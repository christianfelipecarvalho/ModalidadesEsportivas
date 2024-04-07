import axios from "axios";

axios.defaults.headers.common['Content-Type'] = 'application/json';

axios.interceptors.request.use(
    config => {
        config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
        return config;
    },
    error => Promise.reject(error)
)

axios.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const token = localStorage.getItem('token');
            const refreshToken = localStorage.getItem('refreshToken');
            return axios.put('https://geresportes.azurewebsites.net/login/refresh', { token, refreshToken })
                .then(response => {
                    if (response.status === 200) {
                        localStorage.setItem('token', response.data.token);
                        axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;
                        return axios(originalRequest);
                    }
                })
        }
        return Promise.reject(error);
    }
);

export default axios;