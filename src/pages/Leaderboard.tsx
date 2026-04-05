import React, { useState, useEffect } from 'react';
import { Trophy, Medal, UploadCloud, Eye, Star } from 'lucide-react';
import codeApi from '../api/codeApi';
import { Link } from 'react-router-dom';
export default function Leaderboard() {
    const [topUsers, setTopUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const data: any = await codeApi.getLeaderboard();
                setTopUsers(data);
            } catch (error) {
                console.error("Lỗi tải Bảng xếp hạng:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    // Hàm chọn màu Huy chương theo Rank
    const getRankStyle = (rank: number) => {
        switch (rank) {
            case 1: return { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/50', icon: <Trophy size={24} className="text-yellow-400" /> };
            case 2: return { color: 'text-zinc-300', bg: 'bg-zinc-300/10', border: 'border-zinc-300/50', icon: <Medal size={24} className="text-zinc-300" /> };
            case 3: return { color: 'text-amber-600', bg: 'bg-amber-600/10', border: 'border-amber-600/50', icon: <Medal size={24} className="text-amber-600" /> };
            default: return { color: 'text-zinc-500', bg: 'bg-zinc-900', border: 'border-zinc-800', icon: <span className="font-black text-xl text-zinc-600">#{rank}</span> };
        }
    };

    return (
        <main className="max-w-2xl mx-auto px-4 py-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-black uppercase tracking-widest flex items-center justify-center gap-3 mb-2">
                    <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 bg-clip-text text-transparent animate-text-shimmer">
                        Đại Lộ Danh Vọng
                    </span>
                </h1>
                <p className="text-zinc-500 text-sm">Top 10 dân chơi có năng "xuất" cao nhất Rổ Sét. Cập nhật 5 phút/lần.</p>
            </div>

            <div className="flex flex-col gap-3">
                {isLoading ? (
                    // BỘ SKELETON CHO BẢNG XẾP HẠNG
                    [...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-900 animate-pulse">
                            <div className="w-10 h-10 rounded-full bg-zinc-800 shrink-0"></div>
                            <div className="flex-1">
                                <div className="w-32 h-5 bg-zinc-800 rounded-md mb-2"></div>
                                <div className="w-20 h-3 bg-zinc-800 rounded-md"></div>
                            </div>
                            <div className="w-16 h-8 bg-zinc-800 rounded-lg"></div>
                        </div>
                    ))
                ) : topUsers.length > 0 ? (
                    topUsers.map((user) => {
                        const style = getRankStyle(user.rank);
                        return (
                            <div
                                key={user.userId}
                                className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:scale-[1.02] ${style.bg} ${style.border}`}
                            >
                                {/* Cột Rank Icon */}
                                <div className="w-12 flex justify-center items-center shrink-0">
                                    {style.icon}
                                </div>

                                {/* Cột Avatar */}
                                <Link to={`/profile/${user.userId}`} className="shrink-0">
                                    <img src={user.avatarUrl} alt="Avatar" className={`w-12 h-12 rounded-full border-2 ${style.border} hover:scale-110 transition-transform`} />
                                </Link>
                                {/* Cột Info */}
                                <div className="flex-1 min-w-0">
                                    {/* Tên User (Sửa thành thẻ Link) */}
                                    <Link to={`/profile/${user.userId}`} className={`font-black text-lg truncate hover:underline ${style.color}`}>
                                        {user.username}
                                    </Link>

                                    <div className="flex gap-3 text-[10px] sm:text-xs text-zinc-400 font-mono mt-1">
                                        <span className="flex items-center gap-1"><UploadCloud size={12} /> {user.totalUploads} code</span>
                                        <span className="flex items-center gap-1"><Eye size={12} /> {user.totalViews} view</span>
                                    </div>
                                </div>

                                {/* Cột Điểm */}
                                <div className="text-right">
                                    <div className="text-xl font-black text-white flex items-center gap-1">
                                        {user.totalScore} <Star size={16} className="fill-yellow-500 text-yellow-500" />
                                    </div>
                                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Điểm</div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-10 text-zinc-600 border border-zinc-800 border-dashed rounded-xl">
                        Bảng xếp hạng đang trống. Hãy là người đầu tiên ghi danh!
                    </div>
                )}
            </div>
        </main>
    );
}