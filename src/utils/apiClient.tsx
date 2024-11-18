import axios from 'axios';
import { getBaseUrl } from '../components/BaseUrl';
import store from '../store';

const apiClient = axios.create({
    baseURL: getBaseUrl(), // Use your existing baseURL setup
});

// Attach token to every request
apiClient.interceptors.request.use((config) => {
    // const token = store.getState().auth.token;
    const token = localStorage.getItem('authToken');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default apiClient;
