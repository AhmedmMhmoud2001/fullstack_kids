import { API_BASE_URL } from './config';

const getHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    };
};

const couponsApi = {
    getAll: async () => {
        const response = await fetch(`${API_BASE_URL}/coupons`, {
            method: 'GET',
            headers: getHeaders(),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch coupons');
        return data;
    },
    create: async (couponData) => {
        const response = await fetch(`${API_BASE_URL}/coupons`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(couponData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to create coupon');
        return data;
    },
    update: async (id, couponData) => {
        const response = await fetch(`${API_BASE_URL}/coupons/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(couponData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to update coupon');
        return data;
    },
    delete: async (id) => {
        const response = await fetch(`${API_BASE_URL}/coupons/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to delete coupon');
        return data;
    },
};

export default couponsApi;


