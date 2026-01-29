import { API_BASE_URL } from './config';

// Get all contact messages
export const fetchContactMessages = async () => {
    const token = localStorage.getItem('authToken');
    try {
        const response = await fetch(`${API_BASE_URL}/contact`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch messages');
        }

        return data;
    } catch (error) {
        console.error('Error fetching contact messages:', error);
        throw error;
    }
};

// Delete a contact message
export const deleteContactMessage = async (id) => {
    const token = localStorage.getItem('authToken');
    try {
        const response = await fetch(`${API_BASE_URL}/contact/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to delete message');
        }

        return data;
    } catch (error) {
        console.error('Error deleting contact message:', error);
        throw error;
    }
};
