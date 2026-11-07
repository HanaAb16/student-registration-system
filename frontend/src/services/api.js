const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper function to handle API responses and errors
async function handleResponse(response) {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // Attach Laravel's specific field errors to the JavaScript Error object
        const error = new Error(errorData.message || 'API request failed');
        error.validationErrors = errorData.errors || null; 
        throw error;
    }
    if (response.status === 204) return null; 
    return response.json();
}

export const getStudents = async () => {
    const response = await fetch(`${BASE_URL}/students`, {
        headers: { 'Accept': 'application/json' }
    });
    return handleResponse(response);
};

export const createStudent = async (studentData) => {
    const response = await fetch(`${BASE_URL}/students`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(studentData)
    });
    return handleResponse(response);
};

export const updateStudent = async (id, studentData) => {
    const response = await fetch(`${BASE_URL}/students/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(studentData)
    });
    return handleResponse(response);
};

export const deleteStudent = async (id) => {
    const response = await fetch(`${BASE_URL}/students/${id}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
    });
    return handleResponse(response);
};