// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// API Client
class ApiClient {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);

            // Try to parse JSON response
            let data;
            try {
                data = await response.json();
            } catch (jsonError) {
                // If JSON parsing fails, throw a generic error
                throw new Error('Server returned an invalid response');
            }

            // Check if response is not OK (4xx, 5xx errors)
            if (!response.ok) {
                // Handle validation errors from Laravel
                if (data.errors) {
                    const firstError = Object.values(data.errors)[0];
                    throw new Error(Array.isArray(firstError) ? firstError[0] : firstError);
                }
                throw new Error(data.message || 'An error occurred');
            }

            return data;
        } catch (error) {
            // Network errors (CORS, connection refused, etc.)
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Unable to connect to server. Please check if the backend is running.');
            }
            // Re-throw other errors
            throw error;
        }
    }

    async get(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'GET' });
    }

    async post(endpoint, body, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(body),
        });
    }
}

const apiClient = new ApiClient(API_BASE_URL);

// Authentication API
export const authApi = {
    /**
     * Register a new user
     * @param {Object} userData - User registration data
     * @param {string} userData.name - User's full name
     * @param {string} userData.email - User's email
     * @param {string} userData.password - User's password
     * @param {string} userData.password_confirmation - Password confirmation
     * @param {string} [userData.role] - User role (admin or subscriber)
     * @returns {Promise<Object>} Response with user data and token
     */
    async register(userData) {
        return apiClient.post('/api/register', userData);
    },

    /**
     * Login user
     * @param {string} email - User's email
     * @param {string} password - User's password
     * @returns {Promise<Object>} Response with user data and token
     */
    async login(email, password) {
        return apiClient.post('/api/login', { email, password });
    },

    /**
     * Logout user
     * @param {string} token - Authentication token
     * @returns {Promise<Object>} Response confirming logout
     */
    async logout(token) {
        return apiClient.post('/api/logout', {}, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    },

    /**
     * Get authenticated user
     * @param {string} token - Authentication token
     * @returns {Promise<Object>} Response with user data
     */
    async getUser(token) {
        return apiClient.get('/api/user', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    },

    /**
     * Request password reset
     * @param {string} email - User's email
     * @returns {Promise<Object>} Response with reset link
     */
    async forgotPassword(email) {
        return apiClient.post('/api/forgot-password', { email });
    },

    /**
     * Reset password with token
     * @param {string} email - User's email
     * @param {string} token - Reset token
     * @param {string} password - New password
     * @param {string} password_confirmation - Password confirmation
     * @returns {Promise<Object>} Response confirming password reset
     */
    async resetPassword(email, token, password, password_confirmation) {
        return apiClient.post('/api/reset-password', {
            email,
            token,
            password,
            password_confirmation
        });
    },

    /**
     * Get all users (admin only)
     * @param {string} token - Authentication token
     * @returns {Promise<Object>} Response with users array
     */
    async getAllUsers(token) {
        return apiClient.get('/api/users', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    },

    /**
     * Get user by ID
     * @param {number} id - User ID
     * @param {string} token - Authentication token
     * @returns {Promise<Object>} Response with user data
     */
    async getUserById(id, token) {
        return apiClient.get(`/api/users/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    },

    /**
     * Update user
     * @param {number} id - User ID
     * @param {Object} userData - User data to update
     * @param {string} token - Authentication token
     * @returns {Promise<Object>} Response with updated user data
     */
    async updateUser(id, userData, token) {
        return apiClient.request(`/api/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData),
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    },

    /**
     * Delete user
     * @param {number} id - User ID
     * @param {string} token - Authentication token
     * @returns {Promise<Object>} Response confirming deletion
     */
    async deleteUser(id, token) {
        return apiClient.request(`/api/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    },
};

// Cookie utilities
export const cookieUtils = {
    /**
     * Set a cookie
     * @param {string} name - Cookie name
     * @param {string} value - Cookie value
     * @param {number} days - Expiration in days
     */
    set(name, value, days = 1) {
        const maxAge = days * 24 * 60 * 60;
        document.cookie = `${name}=${value}; path=/; max-age=${maxAge}`;
    },

    /**
     * Get a cookie value
     * @param {string} name - Cookie name
     * @returns {string|null} Cookie value or null
     */
    get(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    },

    /**
     * Delete a cookie
     * @param {string} name - Cookie name
     */
    delete(name) {
        document.cookie = `${name}=; path=/; max-age=0`;
    },

    /**
     * Clear all auth cookies
     */
    clearAuth() {
        this.delete('token');
        this.delete('role');
        this.delete('userName');
    },
};

// Validation functions (keep existing ones)
export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function validatePassword(password) {
    return password.length >= 8;
}

// Audio Categories API
export const audioCategoryApi = {
    /**
     * Get all audio categories
     * @param {string} token - Authentication token
     * @returns {Promise<Object>} Response with categories array
     */
    async getAll(token) {
        return apiClient.get('/api/audio-categories', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    },

    /**
     * Create a new audio category
     * @param {Object} categoryData - Category data
     * @param {string} categoryData.name - Category name
     * @param {string} [categoryData.icon] - Category icon emoji
     * @param {string} token - Authentication token
     * @returns {Promise<Object>} Response with created category
     */
    async create(categoryData, token) {
        return apiClient.post('/api/admin/audio-categories', categoryData, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    },

    /**
     * Update an audio category
     * @param {number} id - Category ID
     * @param {Object} categoryData - Category data to update
     * @param {string} token - Authentication token
     * @returns {Promise<Object>} Response with updated category
     */
    async update(id, categoryData, token) {
        return apiClient.request(`/api/admin/audio-categories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(categoryData),
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    },

    /**
     * Delete an audio category
     * @param {number} id - Category ID
     * @param {string} token - Authentication token
     * @returns {Promise<Object>} Response confirming deletion
     */
    async delete(id, token) {
        return apiClient.request(`/api/admin/audio-categories/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    },
};

// Audio Tracks API
export const audioTrackApi = {
    /**
     * Get all audio tracks
     * @param {string} token - Authentication token
     * @returns {Promise<Object>} Response with tracks array
     */
    async getAll(token) {
        return apiClient.get('/api/audio-tracks', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    },

    /**
     * Get a single audio track by ID
     * @param {number} id - Track ID
     * @param {string} token - Authentication token
     * @returns {Promise<Object>} Response with track data
     */
    async getById(id, token) {
        return apiClient.get(`/api/audio-tracks/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    },

    /**
     * Create a new audio track with file upload
     * @param {FormData} formData - FormData containing track data and audio file
     * @param {string} token - Authentication token
     * @returns {Promise<Object>} Response with created track
     */
    async create(formData, token) {
        const url = `${API_BASE_URL}/api/admin/audio-tracks`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: formData,
        });

        let data;
        try {
            data = await response.json();
        } catch (jsonError) {
            throw new Error('Server returned an invalid response');
        }

        if (!response.ok) {
            if (data.errors) {
                const firstError = Object.values(data.errors)[0];
                throw new Error(Array.isArray(firstError) ? firstError[0] : firstError);
            }
            throw new Error(data.message || 'An error occurred');
        }

        return data;
    },

    /**
     * Update an audio track (supports file upload)
     * @param {number} id - Track ID
     * @param {FormData} formData - FormData containing track data and optional audio file
     * @param {string} token - Authentication token
     * @returns {Promise<Object>} Response with updated track
     */
    async update(id, formData, token) {
        const url = `${API_BASE_URL}/api/admin/audio-tracks/${id}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: formData,
        });

        let data;
        try {
            data = await response.json();
        } catch (jsonError) {
            throw new Error('Server returned an invalid response');
        }

        if (!response.ok) {
            if (data.errors) {
                const firstError = Object.values(data.errors)[0];
                throw new Error(Array.isArray(firstError) ? firstError[0] : firstError);
            }
            throw new Error(data.message || 'An error occurred');
        }

        return data;
    },

    /**
     * Delete an audio track
     * @param {number} id - Track ID
     * @param {string} token - Authentication token
     * @returns {Promise<Object>} Response confirming deletion
     */
    async delete(id, token) {
        return apiClient.request(`/api/admin/audio-tracks/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    },
};

// Location Device API
export const locationDeviceApi = {
    /**
     * Get all location devices
     * @param {string} token - Authentication token
     * @returns {Promise<Object>} Response with devices array
     */
    async getAll(token) {
        return apiClient.get('/api/location-devices', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    },

    /**
     * Get a single location device by ID
     * @param {number} id - Device ID
     * @param {string} token - Authentication token
     * @returns {Promise<Object>} Response with device data
     */
    async getById(id, token) {
        return apiClient.get(`/api/location-devices/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    },

    /**
     * Create a new location device
     * @param {Object} deviceData - Device data
     * @param {string} deviceData.name - Device name
     * @param {string} deviceData.type - Device type
     * @param {number} deviceData.user_id - User ID to assign device to
     * @param {string} [deviceData.status] - Device status (Active/Inactive)
     * @param {string} token - Authentication token
     * @returns {Promise<Object>} Response with created device
     */
    async create(deviceData, token) {
        return apiClient.post('/api/admin/location-devices', deviceData, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    },

    /**
     * Update a location device
     * @param {number} id - Device ID
     * @param {Object} deviceData - Device data to update
     * @param {string} token - Authentication token
     * @returns {Promise<Object>} Response with updated device
     */
    async update(id, deviceData, token) {
        return apiClient.request(`/api/admin/location-devices/${id}`, {
            method: 'PUT',
            body: JSON.stringify(deviceData),
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    },

    /**
     * Delete a location device
     * @param {number} id - Device ID
     * @param {string} token - Authentication token
     * @returns {Promise<Object>} Response confirming deletion
     */
    async delete(id, token) {
        return apiClient.request(`/api/admin/location-devices/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    },

    /**
     * Toggle device status (Active/Inactive)
     * @param {number} id - Device ID
     * @param {string} token - Authentication token
     * @returns {Promise<Object>} Response with updated device
     */
    async toggleStatus(id, token) {
        return apiClient.request(`/api/admin/location-devices/${id}/toggle`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    },
};
