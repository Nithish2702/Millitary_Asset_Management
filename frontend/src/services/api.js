import axios from 'axios';

// Use environment variable for API URL, fallback to localhost for development
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Request with token:', config.method.toUpperCase(), config.url);
    } else {
        console.warn('No token found for request:', config.method.toUpperCase(), config.url);
    }
    return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error('Unauthorized - clearing token');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.reload();
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
};

export const purchaseAPI = {
    create: (data) => api.post('/purchases', data),
    getAll: (params) => api.get('/purchases', { params }),
};

export const transferAPI = {
    create: (data) => api.post('/transfers', data),
    getAll: (params) => api.get('/transfers', { params }),
};

export const assignmentAPI = {
    create: (data) => api.post('/assignments', data),
    getAll: (params) => api.get('/assignments', { params }),
    createExpenditure: (data) => api.post('/assignments/expenditure', data),
    getExpenditures: (params) => api.get('/assignments/expenditure', { params }),
};

export const assetAPI = {
    getAll: (params) => api.get('/assets', { params }),
    getMovements: (assetName, base) => api.get(`/assets/movements/${assetName}/${base}`),
};

export default api;
