const API_URL =
    // 'http://localhost:5000/api';
    'https://secreat-keysstorage-backend.onrender.com/api';

export const apiCall = async (endpoint: string, method: string = 'GET', body?: any, token?: string) => {
    const isFormData = body instanceof FormData;
    const headers: HeadersInit = {};

    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
        method,
        headers,
        body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
    };

    try {
        const res = await fetch(`${API_URL}${endpoint}`, config);
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Something went wrong');
        }

        return data;
    } catch (error: any) {
        throw error.message;
    }
};
