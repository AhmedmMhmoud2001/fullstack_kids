import { API_BASE_URL } from './config';

const getHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    };
};

const brandsApi = {
    getAll: async () => {
        const response = await fetch(`${API_BASE_URL}/brands`, {
            method: 'GET',
            headers: getHeaders(),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch brands');
        return data;
    },
    getOne: async (id) => {
        const response = await fetch(`${API_BASE_URL}/brands/${id}`, {
            method: 'GET',
            headers: getHeaders(),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch brand');
        return data;
    },
    create: async (brandData) => {
        const response = await fetch(`${API_BASE_URL}/brands`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(brandData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to create brand');
        return data;
    },
    update: async (id, brandData) => {
        const response = await fetch(`${API_BASE_URL}/brands/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(brandData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to update brand');
        return data;
    },
    delete: async (id) => {
        const response = await fetch(`${API_BASE_URL}/brands/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to delete brand');
        return data;
    }
};

export default brandsApi;
