import React, { useState } from 'react';
import { X, MapPin } from 'lucide-react';
import codeApi from '../api/codeApi';
import CodeCard, { type CodeCardProps } from './CodeCard';
import toast from 'react-hot-toast';

interface GachaModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentUserId?: number;
}

export default function GachaModal({ isOpen, onClose, currentUserId }: GachaModalProps) {
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0); // Góc quay hiện tại
    const [resultCode, setResultCode] = useState<CodeCardProps | null>(null);

    if (!isOpen) return null;

    const handleSpin = async () => {
        if (!currentUserId) {
            toast.error("Bạn phải có tài khoản mới được chơi!");
            return;
        }

        // Nếu đang quay hoặc đã có kết quả rồi thì không cho bấm nút giữa nữa
        if (isSpinning || resultCode) return;

        setIsSpinning(true);

        try {
            // 1. Gọi API lấy kết quả "ngầm" trước khi quay
            const response = await codeApi.spinGacha(currentUserId);

            // 2. Tính toán góc quay (Quay ít nhất 5 vòng + một góc ngẫu nhiên để kim chỉ ngẫu nhiên)
            const extraSpins = 5 * 360; // 5 vòng
            const randomDegree = Math.floor(Math.random() * 360); // Trỏ vào 1 góc bất kỳ
            const newRotation = rotation + extraSpins + randomDegree;

            setRotation(newRotation); // Kích hoạt hiệu ứng CSS quay

            // 3. Đợi đúng 4 giây (khớp với thời gian CSS transition) mới hiển thị thẻ bài
            setTimeout(() => {
                setResultCode(response);
                setIsSpinning(false);
                toast.success("Bốc trúng hàng thơm!");
            }, 4000);

        } catch (error: any) {
            setIsSpinning(false);
            // Bắt lỗi từ Backend trả về (Ví dụ: "Hôm nay nhân phẩm đã cạn...")
            const errorMsg = error.response?.data?.message || "Lỗi máy chủ quay thưởng!";
            toast.error(errorMsg);
        }
    };

    const handleClose = () => {
        // Reset lại trạng thái khi đóng
        setResultCode(null);
        setIsSpinning(false);
        // Không reset vòng quay về 0 để tránh giật lag, cứ để im góc đó cho lần mở sau
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden shadow-[0_0_50px_rgba(234,179,8,0.2)] relative flex flex-col items-center p-8">
                <button onClick={handleClose} className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 z-10">
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-black tracking-tighter text-yellow-500 uppercase mb-2">Vòng Quay Nhân Phẩm</h2>
                <p className="text-sm text-zinc-400 text-center mb-8">
                    Mỗi ngày 1 lần. Chạm vào nút ở giữa để thử vận may!
                </p>

                {/* --- KHU VỰC VÒNG QUAY --- */}
                {!resultCode && (
                    <div className="relative w-64 h-64 mb-4">
                        {/* Mũi tên chỉ định (Cái Kim) */}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 text-white drop-shadow-md">
                            <MapPin size={36} className="fill-yellow-500 text-yellow-600 rotate-180" />
                        </div>

                        {/* Vòng quay (Bánh xe) */}
                        <div
                            className="w-full h-full rounded-full border-4 border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)] overflow-hidden relative"
                            style={{
                                // Tạo các mảng màu xen kẽ
                                background: 'conic-gradient(#eab308 0deg 60deg, #27272a 60deg 120deg, #eab308 120deg 180deg, #27272a 180deg 240deg, #eab308 240deg 300deg, #27272a 300deg 360deg)',
                                // Hiệu ứng quán tính quay: 4s, chập chậm dần ở cuối (cubic-bezier)
                                transform: `rotate(${rotation}deg)`,
                                transition: 'transform 4s cubic-bezier(0.15, 0.85, 0.15, 1)'
                            }}
                        >
                        </div>

                        {/* Nút bấm ở trung tâm vòng quay */}
                        <button
                            onClick={handleSpin}
                            disabled={isSpinning}
                            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full font-black text-xs uppercase z-10 border-4 border-zinc-900 shadow-xl transition-transform ${isSpinning ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed scale-95' : 'bg-black text-yellow-500 hover:scale-110 active:scale-95 cursor-pointer'
                                }`}
                        >
                            Quay
                        </button>
                    </div>
                )}

                {/* --- KHU VỰC HIỂN THỊ KẾT QUẢ KHI QUAY XONG --- */}
                {resultCode && (
                    <div className="w-full animate-in zoom-in-95 duration-500">
                        <div className="text-center text-yellow-500 font-bold mb-4 uppercase tracking-widest text-sm">
                            🎉 Nhân phẩm bùng nổ 🎉
                        </div>

                        <CodeCard {...resultCode} currentUserId={currentUserId} />

                        <button
                            onClick={handleClose}
                            className="mt-6 w-full py-3 bg-zinc-800 rounded-xl text-zinc-300 font-bold hover:bg-zinc-700 transition-colors"
                        >
                            Cất vào kho & Đóng
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}