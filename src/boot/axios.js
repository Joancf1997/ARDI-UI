import axios from 'axios'
import { useLoadingStore } from '../stores/loading';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND || "https://mtr.i4solutions.pro/api/",
    timeout: 10000,
    headers: { Accept: 'application/json' }
});

let installed = false;

export function installAxiosInterceptors() {
    if (installed) return;
    installed = true;

    const loading = useLoadingStore();

    api.interceptors.request.use(
        (config) => {
            loading.setLoading(true);
            var userauth = JSON.parse(window.localStorage.getItem('I4MON'));
            var token = userauth ? userauth.usuario.token : null;
            config.headers.Authorization = token
            return config;
        },
        (error) => {
            loading.setLoading(false);
            return Promise.reject(error);
        }
    );

    api.interceptors.response.use(
        (response) => {
            loading.setLoading(false);
            return response;
        },
        (error) => {
            loading.setLoading(false);
            return Promise.reject(error);
        }
    );
}
export default api;