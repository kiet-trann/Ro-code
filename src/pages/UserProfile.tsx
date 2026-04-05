import React, { useState, useEffect } from 'react';
import { ArrowLeft, UploadCloud, Eye, Bookmark, Award } from 'lucide-react';
import codeApi from '../api/codeApi';
import CodeCard, { type CodeCardProps } from '../components/CodeCard';
import ProfileSkeleton from '../components/ProfileSkeleton';
import CodeCardSkeleton from '../components/CodeCardSkeleton';
import EmptyState from '../components/EmptyState';

interface UserProfileProps {
    targetUserId: number;
    currentUserId: number;
    onBack: () => void; // Nút thoát khỏi căn phòng
    onOpenComments: (codeId: number) => void;
}

export default function UserProfile({ targetUserId, currentUserId, onBack, onOpenComments }: UserProfileProps) {
    const [profile, setProfile] = useState<any>(null);
    const [codes, setCodes] = useState<CodeCardProps[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'uploaded' | 'saved' | 'watched'>('uploaded');

    useEffect(() => {
        const fetchProfileAndCodes = async () => {
            setIsLoading(true);
            try {
                // 1. Lấy thông tin thống kê User
                const profileData: any = await codeApi.getUserProfile(targetUserId, currentUserId);
                setProfile(profileData);

                // 2. Lấy danh sách Code hiển thị theo Tab
                let codesData: any;
                if (activeTab === 'uploaded') {
                    codesData = await codeApi.getDroppedCodes(targetUserId, 1, 50); // Lấy code họ đã up
                } else if (activeTab === 'saved' && profileData.isOwner) {
                    codesData = await codeApi.getSavedCodes(targetUserId, 1, 50); // Lấy tủ đồ (chỉ khi là chủ acc)
                } else if (activeTab === 'watched' && profileData.isOwner) {
                    codesData = await codeApi.getWatchedCodes(targetUserId, 1, 50);
                }

                if (codesData) {
                    setCodes(codesData.items);
                }
            } catch (error) {
                console.error("Lỗi tải Profile:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileAndCodes();
    }, [targetUserId, currentUserId, activeTab]);

    if (isLoading && !profile) {
        return <ProfileSkeleton />;
    }

    if (!profile) return null;

    return (
        <div className="max-w-2xl mx-auto px-4 py-8 animate-in slide-in-from-right-8 duration-500">
            {/* --- THANH ĐIỀU HƯỚNG QUAY LẠI --- */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-zinc-400 hover:text-yellow-500 transition-colors mb-6 font-bold"
            >
                <ArrowLeft size={20} /> Quay lại
            </button>

            {/* --- KHU VỰC AVATAR & THỐNG KÊ --- */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8 shadow-lg relative overflow-hidden">
                {/* Background trang trí */}
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-yellow-600/20 to-orange-500/10"></div>

                <div className="relative flex flex-col sm:flex-row items-center gap-6">
                    {/* Avatar lấy từ API tự động sinh */}
                    <img
                        src={profile.avatarUrl}
                        alt="Avatar"
                        className="w-24 h-24 rounded-full border-4 border-zinc-900 shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                    />

                    <div className="flex-1 text-center sm:text-left">
                        <h1 className="text-2xl font-black text-white flex items-center justify-center sm:justify-start gap-2">
                            {profile.username}
                            {profile.totalUploaded > 10 && (
                                <span title="Huy hiệu Chăm chỉ">
                                    <Award className="text-yellow-500" size={24} />
                                </span>
                            )}
                        </h1>
                        <p className="text-zinc-500 text-sm mb-4">
                            {profile.isOwner ? "Đây là ổ của bạn" : "Thành viên của Rổ Sét"}
                        </p>

                        {/* Các con số biết nói */}
                        <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                            <div className="bg-black/50 border border-zinc-800 rounded-xl px-4 py-2 text-center">
                                <div className="text-yellow-500 font-black text-xl">{profile.totalUploaded}</div>
                                <div className="text-[10px] text-zinc-500 uppercase tracking-widest flex items-center gap-1"><UploadCloud size={12} /> Đã đóng góp</div>
                            </div>
                            <div className="bg-black/50 border border-zinc-800 rounded-xl px-4 py-2 text-center">
                                <div className="text-green-500 font-black text-xl">{profile.totalViews}</div>
                                <div className="text-[10px] text-zinc-500 uppercase tracking-widest flex items-center gap-1"><Eye size={12} /> Lượt xem thu về</div>
                            </div>
                            {profile.isOwner && (
                                <div className="bg-black/50 border border-zinc-800 rounded-xl px-4 py-2 text-center">
                                    <div className="text-purple-500 font-black text-xl">{profile.totalSaved}</div>
                                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest flex items-center gap-1"><Bookmark size={12} /> Kho bí mật</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- TAB CHUYỂN ĐỔI BÊN TRONG PROFILE --- */}
            <div className="flex gap-2 mb-6 border-b border-zinc-800 pb-2">
                <button
                    onClick={() => setActiveTab('uploaded')}
                    className={`px-4 py-2 font-bold text-sm transition-colors ${activeTab === 'uploaded' ? 'text-yellow-500 border-b-2 border-yellow-500' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                    Mã đã đóng góp
                </button>
                {profile.isOwner && (
                    <>
                        <button
                            onClick={() => setActiveTab('saved')}
                            className={`px-4 py-2 font-bold text-sm whitespace-nowrap transition-colors ${activeTab === 'saved' ? 'text-yellow-500 border-b-2 border-yellow-500' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            Tủ đồ bí mật
                        </button>

                        <button
                            onClick={() => setActiveTab('watched')}
                            className={`px-4 py-2 font-bold text-sm whitespace-nowrap transition-colors ${activeTab === 'watched' ? 'text-yellow-500 border-b-2 border-yellow-500' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            Lịch sử đã xem
                        </button>
                    </>
                )}
            </div>

            {/* --- DANH SÁCH CODE --- */}
            <div className="flex flex-col gap-4">
                {isLoading ? (
                    <>
                        <CodeCardSkeleton />
                        <CodeCardSkeleton />
                    </>
                ) : codes.length > 0 ? (
                    codes.map(code => (
                        <CodeCard
                            key={code.id}
                            {...code}
                            currentUserId={currentUserId}
                            onOpenComments={onOpenComments}
                        />
                    ))
                ) : (
                    <EmptyState
                        type={activeTab === 'saved' ? 'saved' : 'empty'}
                        message={activeTab === 'uploaded' ? "Idol này giấu nghề, chưa share code nào cả." : undefined}
                    />
                )}
            </div>
        </div>
    );
}