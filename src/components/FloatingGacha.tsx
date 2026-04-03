import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface FloatingGachaProps {
    onClick: () => void;
}

export default function FloatingGacha({ onClick }: FloatingGachaProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [position, setPosition] = useState({ x: -1, y: -1 });
    const [isDragging, setIsDragging] = useState(false);
    const [hasMoved, setHasMoved] = useState(false);
    const offset = useRef({ x: 0, y: 0 });
    const btnRef = useRef<HTMLDivElement>(null);

    // THÊM MỚI: Ref lưu lại kích thước màn hình cũ để tính tỷ lệ
    const windowSize = useRef({ w: window.innerWidth, h: window.innerHeight });

    const clampPosition = (x: number, y: number) => {
        const btnSize = 80;
        const newX = Math.max(0, Math.min(x, window.innerWidth - btnSize));
        const newY = Math.max(0, Math.min(y, window.innerHeight - btnSize));
        return { x: newX, y: newY };
    };

    useEffect(() => {
        const hiddenDate = localStorage.getItem('hideGachaDate');
        const today = new Date().toLocaleDateString('vi-VN');
        if (hiddenDate === today) setIsVisible(false);

        const startX = window.innerWidth - 80;
        const startY = window.innerHeight - 120;
        setPosition(clampPosition(startX, startY));

        // --- BỘ NÃO TÍNH TOÁN KHOẢNG CÁCH MÉP MÀN HÌNH ---
        const handleResize = () => {
            setPosition(prev => {
                if (prev.x === -1) return prev; // Bỏ qua nếu chưa khởi tạo

                const oldW = windowSize.current.w;
                const oldH = windowSize.current.h;
                const newW = window.innerWidth;
                const newH = window.innerHeight;

                let newX = prev.x;
                let newY = prev.y;

                // 1. Xử lý trục X (Ngang): Bám lề trái hoặc phải
                if (prev.x > oldW / 2) {
                    // Đang ở nửa bên phải -> Cố định khoảng cách tới lề phải
                    const distanceToRight = oldW - prev.x;
                    newX = newW - distanceToRight;
                } else {
                    // Đang ở nửa bên trái -> Cố định khoảng cách tới lề trái (newX = prev.x)
                }

                // 2. Xử lý trục Y (Dọc): Bám lề trên hoặc dưới
                if (prev.y > oldH / 2) {
                    // Đang ở nửa dưới -> Cố định khoảng cách tới đáy
                    const distanceToBottom = oldH - prev.y;
                    newY = newH - distanceToBottom;
                } else {
                    // Đang ở nửa trên -> Cố định khoảng cách tới đỉnh
                }

                // Cập nhật lại kích thước màn hình làm mốc cho lần thu phóng sau
                windowSize.current = { w: newW, h: newH };

                // Kẹp toạ độ để chắc chắn 100% không lọt ra ngoài
                return clampPosition(newX, newY);
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleHide = (e: React.PointerEvent<HTMLButtonElement> | React.MouseEvent) => {
        e.stopPropagation();
        setIsVisible(false);
        const today = new Date().toLocaleDateString('vi-VN');
        localStorage.setItem('hideGachaDate', today);
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        setIsDragging(true);
        setHasMoved(false);
        offset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        };
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        setHasMoved(true);
        const newX = e.clientX - offset.current.x;
        const newY = e.clientY - offset.current.y;
        setPosition(clampPosition(newX, newY));
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        setIsDragging(false);
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        if (!hasMoved) onClick();
    };

    if (!isVisible || (position.x === -1 && position.y === -1)) return null;

    return (
        <div
            ref={btnRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            style={{
                left: position.x,
                top: position.y,
                touchAction: 'none'
            }}
            className={`fixed z-50 flex flex-col items-center justify-center cursor-pointer ${isDragging ? 'scale-110 opacity-80' : 'hover:scale-105'
                } transition-transform duration-200`}
        >
            <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)] overflow-visible">
                <button
                    onClick={handleHide}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="absolute -top-2 -right-2 z-50 bg-zinc-800 text-zinc-400 hover:text-white hover:bg-red-500 rounded-full p-1 border border-zinc-600 transition-colors shadow-md"
                    title="Tắt vòng quay"
                >
                    <X size={14} />
                </button>

                <div
                    className="w-full h-full rounded-full animate-[spin_5s_linear_infinite] overflow-hidden"
                    style={{
                        background: 'conic-gradient(#eab308 0deg 60deg, #27272a 60deg 120deg, #eab308 120deg 180deg, #27272a 180deg 240deg, #eab308 240deg 300deg, #27272a 300deg 360deg)',
                    }}
                ></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 bg-black rounded-full border border-yellow-600"></div>
            </div>

            <div className="absolute -bottom-4 md:-bottom-5 bg-yellow-500 text-black text-[9px] md:text-[10px] font-black uppercase px-2 py-0.5 rounded-full whitespace-nowrap shadow-md pointer-events-none border border-yellow-600">
                XEM GÌ ĐÂY TA?
            </div>
        </div>
    );
}