import axios from 'axios';
import { getBaseUrl } from '../components/BaseUrl';
import store from '../store';

const apiClient = axios.create({
    baseURL: getBaseUrl(),
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

apiClient.interceptors.response.use((response) => response,
    (error) => {
        if (error.response) {
            // Check for 401 and "Unauthenticated" message
            // error.response.status === 401 &&
            if (error.response.data.message === "Unauthenticated.") {
                // Clear token or any relevant data
                localStorage.removeItem('authToken');
                // Redirect to login page
                window.location.href = '/login'; // Replace with your login path
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
