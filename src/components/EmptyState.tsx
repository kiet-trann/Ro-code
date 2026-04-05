import React from 'react';
import { Ghost, SearchX, Inbox, Sparkles } from 'lucide-react';

interface EmptyStateProps {
    type?: 'empty' | 'search' | 'saved';
    title?: string;
    message?: string;
    actionText?: string;
    onAction?: () => void;
}

export default function EmptyState({
    type = 'empty',
    title,
    message,
    actionText,
    onAction
}: EmptyStateProps) {

    // Tự động chọn Icon và nội dung dựa trên "Hoàn cảnh"
    const getConfig = () => {
        switch (type) {
            case 'search':
                return {
                    icon: <SearchX size={48} className="text-zinc-600 mb-4" />,
                    defaultTitle: 'Đáy biển mò kim',
                    defaultMessage: 'Không tìm thấy mã code nào khớp với từ khóa của bạn. Thử tìm cái khác xem sao?'
                };
            case 'saved':
                return {
                    icon: <Inbox size={48} className="text-zinc-600 mb-4" />,
                    defaultTitle: 'Tủ đồ đóng bụi',
                    defaultMessage: 'Chưa có bí kíp nào được cất giấu ở đây cả. Mau ra ngoài lùng sục đi!'
                };
            default:
                return {
                    icon: <Ghost size={48} className="text-zinc-600 mb-4 animate-bounce" />,
                    defaultTitle: 'Vườn không nhà trống',
                    defaultMessage: 'Nơi này hoang vu quá, chẳng có dữ liệu nào để hiển thị cả.'
                };
        }
    };

    const config = getConfig();

    return (
        <div className="w-full py-16 px-6 flex flex-col items-center justify-center text-center bg-zinc-900/20 backdrop-blur-sm border border-zinc-800 border-dashed rounded-2xl">
            {/* Hiệu ứng Icon bay bay */}
            <div className="relative">
                <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full"></div>
                {config.icon}
            </div>

            <h3 className="text-xl font-black text-zinc-300 mb-2">
                {title || config.defaultTitle}
            </h3>

            <p className="text-sm text-zinc-500 max-w-sm mb-6">
                {message || config.defaultMessage}
            </p>

            {/* Nút Call-to-action (Nếu có truyền vào) */}
            {actionText && onAction && (
                <button
                    onClick={onAction}
                    className="flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-yellow-500 hover:text-black text-yellow-500 font-bold rounded-full transition-colors duration-300 shadow-lg"
                >
                    <Sparkles size={18} /> {actionText}
                </button>
            )}
        </div>
    );
}