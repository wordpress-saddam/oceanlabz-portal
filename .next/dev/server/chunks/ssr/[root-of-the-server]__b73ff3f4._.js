module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/Documents/projects/oceanlabz-portal/lib/api.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// API Configuration
__turbopack_context__.s([
    "audioCategoryApi",
    ()=>audioCategoryApi,
    "audioTrackApi",
    ()=>audioTrackApi,
    "authApi",
    ()=>authApi,
    "cookieUtils",
    ()=>cookieUtils,
    "locationDeviceApi",
    ()=>locationDeviceApi,
    "validateEmail",
    ()=>validateEmail,
    "validatePassword",
    ()=>validatePassword
]);
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
// API Client
class ApiClient {
    constructor(baseURL){
        this.baseURL = baseURL;
    }
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...options.headers
            }
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
        return this.request(endpoint, {
            ...options,
            method: 'GET'
        });
    }
    async post(endpoint, body, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(body)
        });
    }
}
const apiClient = new ApiClient(API_BASE_URL);
const authApi = {
    /**
     * Register a new user
     * @param {Object} userData - User registration data
     * @param {string} userData.name - User's full name
     * @param {string} userData.email - User's email
     * @param {string} userData.password - User's password
     * @param {string} userData.password_confirmation - Password confirmation
     * @param {string} [userData.role] - User role (admin or subscriber)
     * @returns {Promise<Object>} Response with user data and token
     */ async register (userData) {
        return apiClient.post('/api/register', userData);
    },
    /**
     * Login user
     * @param {string} email - User's email
     * @param {string} password - User's password
     * @returns {Promise<Object>} Response with user data and token
     */ async login (email, password) {
        return apiClient.post('/api/login', {
            email,
            password
        });
    },
    /**
     * Logout user
     * @param {string} token - Authentication token
     * @returns {Promise<Object>} Response confirming logout
     */ async logout (token) {
        return apiClient.post('/api/logout', {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    },
    /**
     * Get authenticated user
     * @param {string} token - Authentication token
     * @returns {Promise<Object>} Response with user data
     */ async getUser (token) {
        return apiClient.get('/api/user', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    },
    /**
     * Request password reset
     * @param {string} email - User's email
     * @returns {Promise<Object>} Response with reset link
     */ async forgotPassword (email) {
        return apiClient.post('/api/forgot-password', {
            email
        });
    },
    /**
     * Reset password with token
     * @param {string} email - User's email
     * @param {string} token - Reset token
     * @param {string} password - New password
     * @param {string} password_confirmation - Password confirmation
     * @returns {Promise<Object>} Response confirming password reset
     */ async resetPassword (email, token, password, password_confirmation) {
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
     */ async getAllUsers (token) {
        return apiClient.get('/api/users', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    },
    /**
     * Get user by ID
     * @param {number} id - User ID
     * @param {string} token - Authentication token
     * @returns {Promise<Object>} Response with user data
     */ async getUserById (id, token) {
        return apiClient.get(`/api/users/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    },
    /**
     * Update user
     * @param {number} id - User ID
     * @param {Object} userData - User data to update
     * @param {string} token - Authentication token
     * @returns {Promise<Object>} Response with updated user data
     */ async updateUser (id, userData, token) {
        return apiClient.request(`/api/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData),
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    },
    /**
     * Delete user
     * @param {number} id - User ID
     * @param {string} token - Authentication token
     * @returns {Promise<Object>} Response confirming deletion
     */ async deleteUser (id, token) {
        return apiClient.request(`/api/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }
};
const cookieUtils = {
    /**
     * Set a cookie
     * @param {string} name - Cookie name
     * @param {string} value - Cookie value
     * @param {number} days - Expiration in days
     */ set (name, value, days = 1) {
        const maxAge = days * 24 * 60 * 60;
        document.cookie = `${name}=${value}; path=/; max-age=${maxAge}`;
    },
    /**
     * Get a cookie value
     * @param {string} name - Cookie name
     * @returns {string|null} Cookie value or null
     */ get (name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    },
    /**
     * Delete a cookie
     * @param {string} name - Cookie name
     */ delete (name) {
        document.cookie = `${name}=; path=/; max-age=0`;
    },
    /**
     * Clear all auth cookies
     */ clearAuth () {
        this.delete('token');
        this.delete('role');
        this.delete('userName');
    }
};
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function validatePassword(password) {
    return password.length >= 8;
}
const audioCategoryApi = {
    /**
     * Get all audio categories
     * @param {string} token - Authentication token
     * @returns {Promise<Object>} Response with categories array
     */ async getAll (token) {
        return apiClient.get('/api/audio-categories', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    },
    /**
     * Create a new audio category
     * @param {Object} categoryData - Category data
     * @param {string} categoryData.name - Category name
     * @param {string} [categoryData.icon] - Category icon emoji
     * @param {string} token - Authentication token
     * @returns {Promise<Object>} Response with created category
     */ async create (categoryData, token) {
        return apiClient.post('/api/admin/audio-categories', categoryData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    },
    /**
     * Update an audio category
     * @param {number} id - Category ID
     * @param {Object} categoryData - Category data to update
     * @param {string} token - Authentication token
     * @returns {Promise<Object>} Response with updated category
     */ async update (id, categoryData, token) {
        return apiClient.request(`/api/admin/audio-categories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(categoryData),
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    },
    /**
     * Delete an audio category
     * @param {number} id - Category ID
     * @param {string} token - Authentication token
     * @returns {Promise<Object>} Response confirming deletion
     */ async delete (id, token) {
        return apiClient.request(`/api/admin/audio-categories/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }
};
const audioTrackApi = {
    /**
     * Get all audio tracks
     * @param {string} token - Authentication token
     * @returns {Promise<Object>} Response with tracks array
     */ async getAll (token) {
        return apiClient.get('/api/audio-tracks', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    },
    /**
     * Get a single audio track by ID
     * @param {number} id - Track ID
     * @param {string} token - Authentication token
     * @returns {Promise<Object>} Response with track data
     */ async getById (id, token) {
        return apiClient.get(`/api/audio-tracks/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    },
    /**
     * Create a new audio track with file upload
     * @param {FormData} formData - FormData containing track data and audio file
     * @param {string} token - Authentication token
     * @returns {Promise<Object>} Response with created track
     */ async create (formData, token) {
        const url = `${API_BASE_URL}/api/admin/audio-tracks`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
            body: formData
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
     */ async update (id, formData, token) {
        const url = `${API_BASE_URL}/api/admin/audio-tracks/${id}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
            body: formData
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
     */ async delete (id, token) {
        return apiClient.request(`/api/admin/audio-tracks/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }
};
const locationDeviceApi = {
    /**
     * Get all location devices
     * @param {string} token - Authentication token
     * @returns {Promise<Object>} Response with devices array
     */ async getAll (token) {
        return apiClient.get('/api/location-devices', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    },
    /**
     * Get a single location device by ID
     * @param {number} id - Device ID
     * @param {string} token - Authentication token
     * @returns {Promise<Object>} Response with device data
     */ async getById (id, token) {
        return apiClient.get(`/api/location-devices/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
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
     */ async create (deviceData, token) {
        return apiClient.post('/api/admin/location-devices', deviceData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    },
    /**
     * Update a location device
     * @param {number} id - Device ID
     * @param {Object} deviceData - Device data to update
     * @param {string} token - Authentication token
     * @returns {Promise<Object>} Response with updated device
     */ async update (id, deviceData, token) {
        return apiClient.request(`/api/admin/location-devices/${id}`, {
            method: 'PUT',
            body: JSON.stringify(deviceData),
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    },
    /**
     * Delete a location device
     * @param {number} id - Device ID
     * @param {string} token - Authentication token
     * @returns {Promise<Object>} Response confirming deletion
     */ async delete (id, token) {
        return apiClient.request(`/api/admin/location-devices/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    },
    /**
     * Toggle device status (Active/Inactive)
     * @param {number} id - Device ID
     * @param {string} token - Authentication token
     * @returns {Promise<Object>} Response with updated device
     */ async toggleStatus (id, token) {
        return apiClient.request(`/api/admin/location-devices/${id}/toggle`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }
};
}),
"[project]/Documents/projects/oceanlabz-portal/app/login/page.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Login
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/projects/oceanlabz-portal/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/projects/oceanlabz-portal/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/projects/oceanlabz-portal/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/projects/oceanlabz-portal/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$lib$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/projects/oceanlabz-portal/lib/api.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function Login() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        email: "",
        password: "",
        rememberMe: false
    });
    const [errors, setErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loginError, setLoginError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const handleChange = (e)=>{
        const { name, value, type, checked } = e.target;
        setFormData((prev)=>({
                ...prev,
                [name]: type === "checkbox" ? checked : value
            }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev)=>({
                    ...prev,
                    [name]: ""
                }));
        }
        setLoginError("");
    };
    const validateForm = ()=>{
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$lib$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["validateEmail"])(formData.email)) {
            newErrors.email = "Invalid email format";
        }
        if (!formData.password) {
            newErrors.password = "Password is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleLogin = async (e)=>{
        e.preventDefault();
        setLoginError("");
        if (!validateForm()) {
            return;
        }
        setIsLoading(true);
        try {
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$lib$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authApi"].login(formData.email, formData.password);
            if (result.success) {
                const { user, access_token } = result.data;
                // Set cookies for authentication
                __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$lib$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cookieUtils"].set('token', access_token, formData.rememberMe ? 7 : 1);
                __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$lib$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cookieUtils"].set('role', user.role, formData.rememberMe ? 7 : 1);
                __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$lib$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cookieUtils"].set('userName', user.name, formData.rememberMe ? 7 : 1);
                // Redirect based on role
                if (user.role === "admin") {
                    router.push("/admin");
                } else {
                    router.push("/dashboard");
                }
            }
        } catch (error) {
            setLoginError(error.message || "Invalid email or password");
            setIsLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center p-4 animate-fadeIn",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 overflow-hidden pointer-events-none",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"
                    }, void 0, false, {
                        fileName: "[project]/Documents/projects/oceanlabz-portal/app/login/page.jsx",
                        lineNumber: 87,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow",
                        style: {
                            animationDelay: "1s"
                        }
                    }, void 0, false, {
                        fileName: "[project]/Documents/projects/oceanlabz-portal/app/login/page.jsx",
                        lineNumber: 88,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/projects/oceanlabz-portal/app/login/page.jsx",
                lineNumber: 86,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative w-full max-w-md animate-slideUp",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl border border-[#3a3a3a] p-8 shadow-2xl backdrop-blur-xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center mb-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-2",
                                    children: "OceanLabz"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/projects/oceanlabz-portal/app/login/page.jsx",
                                    lineNumber: 96,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[#9a9a9a]",
                                    children: "Sign in to your account"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/projects/oceanlabz-portal/app/login/page.jsx",
                                    lineNumber: 99,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/projects/oceanlabz-portal/app/login/page.jsx",
                            lineNumber: 95,
                            columnNumber: 21
                        }, this),
                        loginError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg animate-slideUp",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-red-400 text-sm flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "⚠️"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/projects/oceanlabz-portal/app/login/page.jsx",
                                        lineNumber: 106,
                                        columnNumber: 33
                                    }, this),
                                    loginError
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/projects/oceanlabz-portal/app/login/page.jsx",
                                lineNumber: 105,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Documents/projects/oceanlabz-portal/app/login/page.jsx",
                            lineNumber: 104,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: handleLogin,
                            className: "space-y-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-[#9a9a9a] mb-2",
                                            children: "Email Address"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/projects/oceanlabz-portal/app/login/page.jsx",
                                            lineNumber: 116,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "absolute left-4 top-1/2 -translate-y-1/2 text-xl",
                                                    children: "📧"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/projects/oceanlabz-portal/app/login/page.jsx",
                                                    lineNumber: 120,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "email",
                                                    name: "email",
                                                    value: formData.email,
                                                    onChange: handleChange,
                                                    className: `w-full bg-[#0a0a0a] border ${errors.email ? "border-red-500" : "border-[#3a3a3a]"} rounded-lg px-12 py-3 text-white placeholder-[#6a6a6a] focus:outline-none focus:border-blue-500 smooth-transition`,
                                                    placeholder: "you@example.com"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/projects/oceanlabz-portal/app/login/page.jsx",
                                                    lineNumber: 121,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/projects/oceanlabz-portal/app/login/page.jsx",
                                            lineNumber: 119,
                                            columnNumber: 29
                                        }, this),
                                        errors.email && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-red-400 text-xs mt-1",
                                            children: errors.email
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/projects/oceanlabz-portal/app/login/page.jsx",
                                            lineNumber: 132,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/projects/oceanlabz-portal/app/login/page.jsx",
                                    lineNumber: 115,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-[#9a9a9a] mb-2",
                                            children: "Password"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/projects/oceanlabz-portal/app/login/page.jsx",
                                            lineNumber: 138,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "absolute left-4 top-1/2 -translate-y-1/2 text-xl",
                                                    children: "🔒"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/projects/oceanlabz-portal/app/login/page.jsx",
                                                    lineNumber: 142,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "password",
                                                    name: "password",
                                                    value: formData.password,
                                                    onChange: handleChange,
                                                    className: `w-full bg-[#0a0a0a] border ${errors.password ? "border-red-500" : "border-[#3a3a3a]"} rounded-lg px-12 py-3 text-white placeholder-[#6a6a6a] focus:outline-none focus:border-blue-500 smooth-transition`,
                                                    placeholder: "••••••••"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/projects/oceanlabz-portal/app/login/page.jsx",
                                                    lineNumber: 143,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/projects/oceanlabz-portal/app/login/page.jsx",
                                            lineNumber: 141,
                                            columnNumber: 29
                                        }, this),
                                        errors.password && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-red-400 text-xs mt-1",
                                            children: errors.password
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/projects/oceanlabz-portal/app/login/page.jsx",
                                            lineNumber: 154,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-right mt-2",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/forgot-password",
                                                className: "text-sm text-blue-500 hover:text-blue-400 smooth-transition",
                                                children: "Forgot Password?"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/projects/oceanlabz-portal/app/login/page.jsx",
                                                lineNumber: 157,
                                                columnNumber: 33
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/projects/oceanlabz-portal/app/login/page.jsx",
                                            lineNumber: 156,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/projects/oceanlabz-portal/app/login/page.jsx",
                                    lineNumber: 137,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "flex items-center gap-2 cursor-pointer",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                name: "rememberMe",
                                                checked: formData.rememberMe,
                                                onChange: handleChange,
                                                className: "w-4 h-4 rounded border-[#3a3a3a] bg-[#0a0a0a] text-blue-600 focus:ring-blue-500"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/projects/oceanlabz-portal/app/login/page.jsx",
                                                lineNumber: 169,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm text-[#9a9a9a]",
                                                children: "Remember me"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/projects/oceanlabz-portal/app/login/page.jsx",
                                                lineNumber: 176,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/projects/oceanlabz-portal/app/login/page.jsx",
                                        lineNumber: 168,
                                        columnNumber: 29
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Documents/projects/oceanlabz-portal/app/login/page.jsx",
                                    lineNumber: 167,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    disabled: isLoading,
                                    className: "w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/20 smooth-transition hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                                    children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex items-center justify-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "animate-spin",
                                                children: "⏳"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/projects/oceanlabz-portal/app/login/page.jsx",
                                                lineNumber: 188,
                                                columnNumber: 37
                                            }, this),
                                            "Signing in..."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/projects/oceanlabz-portal/app/login/page.jsx",
                                        lineNumber: 187,
                                        columnNumber: 33
                                    }, this) : "Sign In"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/projects/oceanlabz-portal/app/login/page.jsx",
                                    lineNumber: 181,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/projects/oceanlabz-portal/app/login/page.jsx",
                            lineNumber: 113,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "my-6 flex items-center gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 h-px bg-[#3a3a3a]"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/projects/oceanlabz-portal/app/login/page.jsx",
                                    lineNumber: 199,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[#6a6a6a] text-sm",
                                    children: "OR"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/projects/oceanlabz-portal/app/login/page.jsx",
                                    lineNumber: 200,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 h-px bg-[#3a3a3a]"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/projects/oceanlabz-portal/app/login/page.jsx",
                                    lineNumber: 201,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/projects/oceanlabz-portal/app/login/page.jsx",
                            lineNumber: 198,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-center text-[#9a9a9a]",
                            children: [
                                "Don't have an account?",
                                " ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$projects$2f$oceanlabz$2d$portal$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/signup",
                                    className: "text-blue-500 hover:text-blue-400 smooth-transition font-medium",
                                    children: "Sign up"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/projects/oceanlabz-portal/app/login/page.jsx",
                                    lineNumber: 207,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/projects/oceanlabz-portal/app/login/page.jsx",
                            lineNumber: 205,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/projects/oceanlabz-portal/app/login/page.jsx",
                    lineNumber: 93,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/Documents/projects/oceanlabz-portal/app/login/page.jsx",
                lineNumber: 92,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/projects/oceanlabz-portal/app/login/page.jsx",
        lineNumber: 84,
        columnNumber: 9
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__b73ff3f4._.js.map