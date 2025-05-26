import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://images-editor-server.onrender.com/api/', 
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