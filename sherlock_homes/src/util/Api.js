import axios from "axios";
export const apiClient = axios.create({
    // baseURL: 'http://3.39.93.101:8081',
    // baseURL: 'http://3.39.93.101:8082',
    // baseURL: 'http://3.39.93.101:8083',
    // baseURL: 'http://3.39.93.101:8084',
    // headers: { 'Authorization': 'Bearer your-token' },
});

apiClient.interceptors.request.use((config) => {
    console.log(`API 요청: ${config.url}`);
    return config;
});
