import axiosClient from './axiosClient';
import { type CodeCardProps } from '../components/CodeCard';

// Định nghĩa dữ liệu gửi lên
export interface PagedResponse {
    items: CodeCardProps[];
    currentPage: number;
    totalPages: number;
}

export interface DropCodePayload {
    codeText: string;
    authorId: number;
}

export interface RateCodePayload {
    userId: number;
    score: number;
}
const codeApi = {
    // GET: Lấy danh sách Code
    getTrending: (userId: number, page: number = 1, limit: number = 10): Promise<PagedResponse> => {
        return axiosClient.get(`/codes/trending?userId=${userId}&page=${page}&limit=${limit}`);
    },

    // POST: Thả Code mới
    dropCode: (payload: DropCodePayload): Promise<CodeCardProps[]> => {
        return axiosClient.post('/codes/drop', payload);
    },

    // POST: Đánh giá & Lưu trạng thái đã xem
    rateCode: (codeId: number | string, payload: RateCodePayload): Promise<{ message: string }> => {
        return axiosClient.post(`/codes/${codeId}/rate`, payload);
    },
    // Lấy danh sách code user ĐÃ XEM
    getWatchedCodes: (userId: number, page: number = 1, limit: number = 10): Promise<PagedResponse> => {
        return axiosClient.get(`/codes/watched/${userId}?page=${page}&limit=${limit}`);
    },

    // Lấy danh sách code user ĐÃ SHARE (DROP)
    getDroppedCodes: (userId: number, page: number = 1, limit: number = 10): Promise<PagedResponse> => {
        return axiosClient.get(`/codes/dropped/${userId}?page=${page}&limit=${limit}`);
    },
    // Lấy code mới nhất
    getNew: (userId: number, page: number = 1, limit: number = 10): Promise<PagedResponse> => {
        return axiosClient.get(`/codes/new?userId=${userId}&page=${page}&limit=${limit}`);
    },

    // Lấy code gợi ý
    getForYou: (userId: number, page: number = 1, limit: number = 10): Promise<PagedResponse> => {
        return axiosClient.get(`/codes/foryou/${userId}?page=${page}&limit=${limit}`);
    },
};

export default codeApi;