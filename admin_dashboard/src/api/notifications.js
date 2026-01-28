import { API_BASE_URL } from './config';

const getHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    };
};

export const fetchNotifications = async () => {
    try {
        // Since we might not have a backend endpoint yet, we'll return a mock response
        // but structured as a real API call would be.
        // Once the backend is ready, this can be changed to:
        // const response = await fetch(`${API_BASE_URL}/notifications`, { headers: getHeaders() });
        // const data = await response.json();
        // return data;

        return {
            success: true,
            data: [
                {
                    id: 1,
                    type: 'ORDER',
                    title: 'New Order Received',
                    message: 'Order #1234 has been placed by Ahmed Mahmoud.',
                    createdAt: new Date().toISOString(),
                    isRead: false
                },
                {
                    id: 2,
                    type: 'SYSTEM',
                    title: 'System Update',
                    message: 'The dashboard has been updated to version 2.1.0.',
                    createdAt: new Date(Date.now() - 86400000).toISOString(),
                    isRead: true
                },
                {
                    id: 3,
                    type: 'ALERT',
                    title: 'Low Stock Warning',
                    message: 'Product "Kids T-Shirt" is running low on stock (5 items left).',
                    createdAt: new Date(Date.now() - 172800000).toISOString(),
                    isRead: false
                },
                {
                    id: 4,
                    type: 'ORDER',
                    title: 'Order Cancelled',
                    message: 'Order #1230 has been cancelled by the customer.',
                    createdAt: new Date(Date.now() - 259200000).toISOString(),
                    isRead: true
                }
            ]
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch notifications'
        };
    }
};

export const markAsRead = async (id) => {
    try {
        // Mocking API call
        // const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
        //     method: 'PUT',
        //     headers: getHeaders()
        // });
        // return await response.json();
        return { success: true };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const markAllAsRead = async () => {
    try {
        // Mocking API call
        // const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
        //     method: 'PUT',
        //     headers: getHeaders()
        // });
        // return await response.json();
        return { success: true };
    } catch (error) {
        return { success: false, message: error.message };
    }
};
