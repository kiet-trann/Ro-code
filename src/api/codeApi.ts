import axiosClient from './axiosClient';
import { type CodeCardProps } from '../components/CodeCard';

// Định nghĩa dữ liệu trả về của danh sách Code
export interface PagedResponse {
    items: CodeCardProps[];
    currentPage: number;
    totalPages: number;
}

// 1. ĐÃ SỬA: Thêm ActorName và Category vào payload gửi lên
export interface DropCodePayload {
    codeText: string;
    authorId: number;
    actorName: string; // <-- Mới thêm
    category: string;  // <-- Mới thêm
}

export interface RateCodePayload {
    userId: number;
    score: number;
}

// 2. ĐÃ THÊM: Định nghĩa kiểu dữ liệu cho Bình luận
export interface CommentResponse {
    id: number;
    content: string;
    createdAt: string;
    userId: number;
}

export interface CreateCommentPayload {
    content: string;
    userId: number;
}
export interface UserProfileResponse {
    id: number;
    username: string;
    avatarUrl: string;
    rankTier: string;
    actionPoints: number;
    totalUploaded: number;
    totalViews: number;
    totalSaved: number;
    isOwner: boolean;
}
export interface LeaderboardUser {
    userId: number;
    username: string;
    avatarUrl: string;
    rank: number;
    rankTier: string;
    actionPoints: number;
    totalUploads: number;
    totalViews: number;
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

    // GET: Lấy danh sách code user ĐÃ XEM
    getWatchedCodes: (userId: number, page: number = 1, limit: number = 10): Promise<PagedResponse> => {
        return axiosClient.get(`/codes/watched/${userId}?page=${page}&limit=${limit}`);
    },

    // GET: Lấy danh sách code user ĐÃ SHARE (DROP)
    getDroppedCodes: (userId: number, page: number = 1, limit: number = 10): Promise<PagedResponse> => {
        return axiosClient.get(`/codes/dropped/${userId}?page=${page}&limit=${limit}`);
    },

    // GET: Lấy code mới nhất
    getNew: (userId: number, page: number = 1, limit: number = 10): Promise<PagedResponse> => {
        return axiosClient.get(`/codes/new?userId=${userId}&page=${page}&limit=${limit}`);
    },

    // GET: Lấy code gợi ý
    getForYou: (userId: number, page: number = 1, limit: number = 10): Promise<PagedResponse> => {
        return axiosClient.get(`/codes/foryou/${userId}?page=${page}&limit=${limit}`);
    },

    // ==========================================
    // CÁC API MỚI THÊM CHO TÍNH NĂNG BÌNH LUẬN & VIEW
    // ==========================================

    // POST: Tăng lượt xem (gọi khi user bấm vào xem chi tiết code)
    increaseView: (codeId: number | string): Promise<{ message: string }> => {
        return axiosClient.post(`/codes/${codeId}/view`);
    },

    // GET: Lấy danh sách bình luận của 1 code
    getComments: (codeId: number | string): Promise<CommentResponse[]> => {
        return axiosClient.get(`/comments/code/${codeId}`);
    },

    // POST: Gửi bình luận mới
    postComment: (codeId: number | string, payload: CreateCommentPayload): Promise<CommentResponse> => {
        return axiosClient.post(`/comments/code/${codeId}`, payload);
    },
    spinGacha: (userId: number | string): Promise<CodeCardProps> => {
        return axiosClient.post(`/codes/spin/${userId}`);
    },
    searchCodes: (currentUserId: number, keyword: string, category: string, page: number, pageSize: number = 10) => {
        return axiosClient.get(`/codes/search`, {
            params: { currentUserId, keyword, category, page, pageSize }
        });
    },
    // POST: Bật/Tắt trạng thái Lưu code
    toggleSave: (codeId: number, userId: number | string) => {
        // Gửi userId lên qua Body (ASP.NET [FromBody] int)
        return axiosClient.post(`/codes/${codeId}/save`, userId, {
            headers: { 'Content-Type': 'application/json' }
        });
    },

    // GET: Lấy danh sách Tủ Đồ
    getSavedCodes: (userId: number | string, page: number, pageSize: number = 10) => {
        return axiosClient.get(`/codes/saved/${userId}`, {
            params: { page, pageSize }
        });
    },
    // GET: Lấy thông tin Trang cá nhân (Profile)
    getUserProfile: (targetUserId: number, currentUserId: number): Promise<UserProfileResponse> => {
        return axiosClient.get(`/codes/profile/${targetUserId}`, {
            params: { currentUserId }
        });
    },
    getLeaderboard: (): Promise<LeaderboardUser[]> => {
        return axiosClient.get('/codes/leaderboard');
    },
    reportCode: (codeId: number, reporterId: number): Promise<{ message: string }> => {
    // Chú ý: Backend [FromBody] int mong đợi dữ liệu dạng chuỗi JSON thô, 
    // hoặc một object. Nếu BE bạn để [FromBody] int reporterId thì gửi thế này:
    return axiosClient.post(`/codes/${codeId}/report`, reporterId, {
        headers: { 'Content-Type': 'application/json' }
    });
},
};

export default codeApi;