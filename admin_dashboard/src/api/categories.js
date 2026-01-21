import { API_BASE_URL } from './config';

const getHeaders = () => {
    const token = localStorage.getItem('authToken'); // Assuming token is stored in localStorage
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    };
};

export const fetchCategories = async (audience = null) => {
    const url = audience
        ? `${API_BASE_URL}/categories?audience=${audience}`
        : `${API_BASE_URL}/categories`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch categories');
    }
    return data;
};

export const fetchCategory = async (id) => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'GET',
        headers: getHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch category');
    }
    return data;
};

export const createCategory = async (categoryData) => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(categoryData),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to create category');
    }
    return data;
};

export const updateCategory = async (id, categoryData) => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(categoryData),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to update category');
    }
    return data;
};

export const deleteCategory = async (id) => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to delete category');
    }
    return data;
};
