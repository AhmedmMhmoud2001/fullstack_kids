import { API_BASE_URL } from './config';

export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem('authToken');

    const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            // Note: Content-Type is set automatically for FormData
        },
        body: formData
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to upload image');
    }

    return data.data; // Returns { url: '...', filename: '...' }
};
