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
    if (params.status) query.append('status', params.status);
    if (params.department) query.append('department', params.department);
    if (params.search) query.append('search', params.search);
    
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

export const getTrashedStudents = async () => {
    const response = await fetch(`${BASE_URL}/students/trashed`, {
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
