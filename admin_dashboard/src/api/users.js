import { API_BASE_URL } from './config';

const getHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    };
};

export const fetchUsers = async () => {
    const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'GET',
        headers: getHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch users');
    }
    return data;
};

export const createUser = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to create user');
    }
    return data;
};

export const updateUser = async (id, userData) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to update user');
    }
    return data;
};

export const deleteUser = async (id) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to delete user');
    }
    return data;
};
