import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:5213/api/', 
});

apiClient.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('accessToken'); 
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; 
        }
        return config; 
    },
    (error) => {
        return Promise.reject(error); 
    }
);

export default apiClient;