import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    // Theo dõi vị trí cuộn chuột
    useEffect(() => {
        const toggleVisibility = () => {
            // Nếu cuộn xuống quá 300px thì mới hiện nút
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        // Dọn dẹp event listener khi component unmount
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    // Hàm xử lý cuộn mượt mà lên top
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth', // Hiệu ứng lướt mượt
        });
    };

    return (
        <button
            onClick={scrollToTop}
            title="Lên mặt đất"
            className={`fixed bottom-8 right-8 p-3 rounded-full bg-yellow-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:bg-yellow-400 hover:scale-110 transition-all duration-300 z-50 ${isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10 pointer-events-none'
                }`}
        >
            <ArrowUp size={24} strokeWidth={3} />
        </button>
    );
}