import { API_BASE_URL } from './config';

const getHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    };
};

export const fetchOrders = async (audience = null) => {
    try {
        const url = audience
            ? `${API_BASE_URL}/orders?audience=${audience}`
            : `${API_BASE_URL}/orders`;

        const response = await fetch(url, {
            method: 'GET',
            headers: getHeaders(),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch orders');
        return data;
    } catch (error) {
        throw error;
    }
};

export const fetchOrderById = async (id, audience = null) => {
    try {
        const url = audience
            ? `${API_BASE_URL}/orders/${id}?audience=${audience}`
            : `${API_BASE_URL}/orders/${id}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: getHeaders(),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch order');
        return data;
    } catch (error) {
        throw error;
    }
};

export const updateOrderStatus = async (id, status) => {
    try {
        const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ status }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to update order status');
        return data;
    } catch (error) {
        throw error;
    }
};

export const updateOrderItemStatus = async (itemId, status) => {
    try {
        const response = await fetch(`${API_BASE_URL}/orders/items/${itemId}/status`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ status }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to update item status');
        return data;
    } catch (error) {
        throw error;
    }
};
