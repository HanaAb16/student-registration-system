const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper to inject the Bearer token from localStorage into headers
export function getAuthHeaders(customHeaders = {}) {
    const token = localStorage.getItem('auth_token');
    const headers = {
        'Accept': 'application/json',
        ...customHeaders
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

// Helper function to handle API responses and errors
async function handleResponse(response) {
    if (!response.ok) {
        // If 401 Unauthorized, token has expired or is revoked - clear storage
        if (response.status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
        }
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.message || 'API request failed');
        error.status = response.status;
        error.validationErrors = errorData.errors || null; 
        throw error;
    }
    if (response.status === 204) return null; 
    return response.json();
}

// ---------------- Authentication Services ----------------

export const login = async (credentials) => {
    const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(credentials)
    });
    const data = await handleResponse(response);
    if (data.access_token) {
        localStorage.setItem('auth_token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
};

export const registerStudent = async (studentData) => {
    const response = await fetch(`${BASE_URL}/register-student`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(studentData)
    });
    const data = await handleResponse(response);
    if (data.access_token) {
        localStorage.setItem('auth_token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
};

export const getMyProfile = async () => {
    const response = await fetch(`${BASE_URL}/my-profile`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};

export const updateMyProfile = async (profileData) => {
    const response = await fetch(`${BASE_URL}/my-profile`, {
        method: 'PUT',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(profileData)
    });
    return handleResponse(response);
};

export const logout = async () => {
    try {
        await fetch(`${BASE_URL}/logout`, {
            method: 'POST',
            headers: getAuthHeaders()
        });
    } finally {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
    }
};

export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    try {
        return userStr ? JSON.parse(userStr) : null;
    } catch {
        return null;
    }
};

// ---------------- Student & Dashboard Services ----------------

export const getStudents = async (params = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page);
    if (params.per_page) query.append('per_page', params.per_page);
    
    // Support both 'filter' and 'status' parameter names
    const statusFilter = params.filter || params.status;
    if (statusFilter && statusFilter !== 'ALL') {
        query.append('filter', statusFilter);
    }
    if (params.department && params.department !== 'ALL') {
        query.append('department', params.department);
    }
    if (params.search && params.search.trim()) {
        query.append('search', params.search.trim());
    }
    
    const queryString = query.toString() ? `?${query.toString()}` : '';
    const response = await fetch(`${BASE_URL}/students${queryString}`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};

export const getStudentById = async (id) => {
    const response = await fetch(`${BASE_URL}/students/${id}`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};

export const createStudent = async (studentData) => {
    const response = await fetch(`${BASE_URL}/students`, {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(studentData)
    });
    return handleResponse(response);
};

export const updateStudent = async (id, studentData) => {
    const response = await fetch(`${BASE_URL}/students/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(studentData)
    });
    return handleResponse(response);
};

export const deleteStudent = async (id) => {
    const response = await fetch(`${BASE_URL}/students/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};

export const getTrashedStudents = async (params = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page);
    if (params.per_page) query.append('per_page', params.per_page);
    
    const queryString = query.toString() ? `?${query.toString()}` : '';
    const response = await fetch(`${BASE_URL}/students/trashed${queryString}`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};

export const restoreStudent = async (id) => {
    const response = await fetch(`${BASE_URL}/students/${id}/restore`, {
        method: 'POST',
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};

export const getDashboardStats = async () => {
    const response = await fetch(`${BASE_URL}/dashboard-stats`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};

export const exportStudentsCsv = async (filters = {}) => {
    const params = new URLSearchParams();
    const statusFilter = filters.filter || filters.status;
    if (statusFilter && statusFilter !== 'ALL') params.append('status', statusFilter);
    if (filters.department && filters.department !== 'ALL') params.append('department', filters.department);
    if (filters.search && filters.search.trim()) params.append('search', filters.search.trim());

    const token = localStorage.getItem('auth_token');
    if (token) params.append('token', token);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await fetch(`${BASE_URL}/students/export${queryString}`, {
        method: 'GET',
        headers: getAuthHeaders({
            'Accept': 'text/csv'
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to export CSV file');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    const disposition = response.headers.get('Content-Disposition');
    let fileName = `students_export_${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}.csv`;
    if (disposition && disposition.includes('filename=')) {
        const match = disposition.match(/filename="?([^";]+)"?/);
        if (match && match[1]) {
            fileName = match[1];
        }
    }

    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
};
