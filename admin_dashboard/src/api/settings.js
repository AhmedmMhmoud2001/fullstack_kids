import { API_BASE_URL } from './config';

const getHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    };
};

export const fetchSettings = async () => {
    const response = await fetch(`${API_BASE_URL}/settings`, {
        headers: getHeaders(),
    });
    return await response.json();
};

export const updateSetting = async (key, value) => {
    const response = await fetch(`${API_BASE_URL}/settings`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ key, value }),
    });
    return await response.json();
};
