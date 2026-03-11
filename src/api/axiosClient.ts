import axios from 'axios';

const axiosClient = axios.create({
    // baseURL: 'https://localhost:7183/api', // Đổi port này khớp với backend của bạn
    baseURL: 'https://ro-code-be.onrender.com/api', // Đổi port này khớp với backend của bạn
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // Timeout sau 10 giây
});

// Interceptor: Nơi lý tưởng để đính kèm Token (JWT) hoặc xử lý lỗi chung (401, 500)
axiosClient.interceptors.response.use(
    (response) => response.data, // Chỉ lấy data, bỏ qua các wrapper của axios
    (error) => {
        console.error("Lỗi kết nối Server:", error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default axiosClient;