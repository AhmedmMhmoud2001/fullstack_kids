import { API_BASE_URL } from './config';

const getHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    };
};

const staticPagesApi = {
    getAll: async () => {
        const response = await fetch(`${API_BASE_URL}/static-pages`, {
            method: 'GET',
            headers: getHeaders(),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch pages');
        return data;
    },
    getOne: async (idOrSlug) => {
        const response = await fetch(`${API_BASE_URL}/static-pages/${idOrSlug}`, {
            method: 'GET',
            headers: getHeaders(),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch page');
        return data;
    },
    create: async (pageData) => {
        const response = await fetch(`${API_BASE_URL}/static-pages`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(pageData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to create page');
        return data;
    },
    update: async (id, pageData) => {
        const response = await fetch(`${API_BASE_URL}/static-pages/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(pageData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to update page');
        return data;
    },
    delete: async (id) => {
        const response = await fetch(`${API_BASE_URL}/static-pages/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to delete page');
        return data;
    }
};

export default staticPagesApi;
