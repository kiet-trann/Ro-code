import React, { useState, useEffect } from 'react';
import TabNavigation, { type TabType } from '../components/TabNavigation';
import CodeCard, { type CodeCardProps } from '../components/CodeCard';
import codeApi from '../api/codeApi';
import CommentModal from '../components/CommentModal'; // <-- 1. IMPORT MODAL VÀO ĐÂY
import GachaModal from '../components/GachaModal';
import { Dices } from 'lucide-react';
import FloatingGacha from '../components/FloatingGacha';
// Khai báo FeedProps
interface FeedProps {
    currentUserId?: number;
}

export default function Feed({ currentUserId }: FeedProps) {
    const [activeTab, setActiveTab] = useState<string>('trending');
    const [codes, setCodes] = useState<CodeCardProps[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

    // --- 2. THÊM STATE QUẢN LÝ MODAL BÌNH LUẬN ---
    const [isCommentModalOpen, setIsCommentModalOpen] = useState<boolean>(false);
    const [selectedCodeId, setSelectedCodeId] = useState<number | null>(null);
    const [isGachaModalOpen, setIsGachaModalOpen] = useState<boolean>(false);

    const tabs: TabType[] = [
        { id: 'trending', label: 'Lên "đỉnh"' },
        { id: 'foryou', label: 'Dành Cho Bạn' },
        { id: 'new', label: 'Code mới' }
    ];

    useEffect(() => {
        setCodes([]);
        setPage(1);
    }, [activeTab]);

    useEffect(() => {
        const fetchCodes = async () => {
            if (!currentUserId) return;

            page === 1 ? setIsLoading(true) : setIsLoadingMore(true);

            try {
                let response;
                if (activeTab === 'trending') {
                    response = await codeApi.getTrending(currentUserId, page, 10);
                } else if (activeTab === 'foryou') {
                    response = await codeApi.getForYou(currentUserId, page, 10);
                } else {
                    response = await codeApi.getNew(currentUserId, page, 10);
                }

                if (response) {
                    // Nếu là trang 1 thì ghi đè, nếu trang > 1 thì nối mảng
                    setCodes(prev => page === 1 ? response.items : [...prev, ...response.items]);
                    setTotalPages(response.totalPages);
                }
            } catch (error) {
                console.error("Lỗi tải data", error);
            } finally {
                setIsLoading(false);
                setIsLoadingMore(false);
            }
        };

        fetchCodes();
    }, [activeTab, currentUserId, page]);

    // --- 3. HÀM XỬ LÝ KHI BẤM NÚT BÌNH LUẬN ---
    const handleOpenComments = (codeId: number) => {
        setSelectedCodeId(codeId);
        setIsCommentModalOpen(true);
    };

    return (
        <main className="max-w-2xl mx-auto px-4 py-8 animate-in slide-in-from-bottom-4 duration-500">
            <TabNavigation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="flex flex-col gap-4">
                {isLoading ? (
                    <div className="text-center text-zinc-500 font-mono py-10 animate-pulse">Chờ tí đang tìm...</div>
                ) : codes.length > 0 ? (
                    <>
                        {codes.map(code => (
                            <CodeCard
                                key={code.id}
                                {...code}
                                currentUserId={currentUserId}
                                onOpenComments={handleOpenComments} // <-- 4. TRUYỀN HÀM MỞ MODAL CHO TỪNG THẺ CODE
                            />
                        ))}

                        {/* NÚT XEM THÊM - Chỉ hiện khi trang hiện tại nhỏ hơn tổng số trang */}
                        {page < totalPages && (
                            <button
                                onClick={() => setPage(prev => prev + 1)}
                                disabled={isLoadingMore}
                                className="mt-4 w-full py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-yellow-500 font-bold hover:bg-zinc-800 transition-colors disabled:opacity-50"
                            >
                                {isLoadingMore ? 'Đang tìm thêm...' : ' Còn cái khác hay hơn không? '}
                            </button>
                        )}
                    </>
                ) : (
                    <div className="text-center py-10 text-zinc-600">Kho lưu trữ trống.</div>
                )}
            </div>

            <FloatingGacha onClick={() => setIsGachaModalOpen(true)} />

            {/* --- 5. CHÈN MODAL BÌNH LUẬN VÀO CUỐI TRANG --- */}
            <CommentModal
                isOpen={isCommentModalOpen}
                onClose={() => setIsCommentModalOpen(false)}
                codeId={selectedCodeId}
                currentUserId={currentUserId}
            />
            <GachaModal
                isOpen={isGachaModalOpen}
                onClose={() => setIsGachaModalOpen(false)}
                currentUserId={currentUserId}
            />
        </main>
    );
}