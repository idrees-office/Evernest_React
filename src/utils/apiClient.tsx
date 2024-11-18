import axios from 'axios';
import { getBaseUrl } from '../components/BaseUrl';

const apiClient = axios.create({
    baseURL: getBaseUrl(), 
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default apiClient;
