import React, { useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import authApi, { type User } from '../api/authApi';
import toast from 'react-hot-toast';

interface AuthModalProps {
    onLoginSuccess: (user: User) => void;
}

export default function AuthModal({ onLoginSuccess }: AuthModalProps) {
    const [username, setUsername] = useState('');
    const [passcode, setPasscode] = useState(''); // State mới cho Mã khóa
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!username.trim() || !passcode.trim()) {
            toast.error('Tên và mã khóa không được để trống!');
            return;
        }

        setIsLoading(true);
        try {
            const user = await authApi.enterVault(username, passcode);
            localStorage.setItem('vault_user', JSON.stringify(user));
            toast.success(`Cuối cùng cũng tới, ${user.username}!`); // HIỆN TOAST THÀNH CÔNG
            onLoginSuccess(user);
        } catch (error: any) {
            if (error.response && error.response.status === 401) {
                toast.error(error.response.data); // HIỆN TOAST LỖI TỪ BACKEND
            } else {
                toast.error('Hệ thống đang bảo trì, vui lòng thử lại.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm overflow-hidden p-8 shadow-[0_0_50px_rgba(234,179,8,0.1)]">
                <div className="flex flex-col items-center gap-3 mb-8 text-center">
                    <ShieldAlert size={40} className="text-yellow-500" />
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Ey khoan từ từ đã, ai vậy?</h2>
                    <p className="text-sm text-zinc-500 font-mono">Nếu chưa có sẽ tự động tạo mới</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Nhập tên vào đi..."
                        autoFocus
                        className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-4 text-center font-mono text-zinc-100 focus:outline-none focus:border-yellow-500 transition-colors placeholder:text-zinc-700"
                    />
                    {/* Ô nhập MÃ KHÓA mới */}
                    <input
                        type="password"
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        placeholder="Mã khóa (PIN/Password)..."
                        className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-4 text-center font-mono text-zinc-100 focus:outline-none focus:border-yellow-500 transition-colors placeholder:text-zinc-700"
                    />


                    <button
                        type="submit"
                        disabled={!username.trim() || !passcode.trim() || isLoading}
                        className="w-full bg-yellow-500 text-black py-4 rounded-xl font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50 mt-2"
                    >
                        {isLoading ? 'Đang xuất...' : 'Bóng vào trăn'}
                    </button>
                </form>
            </div>
        </div>
    );
}