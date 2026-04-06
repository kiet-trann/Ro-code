import React from 'react';
import { Zap, User as UserIcon, Trophy } from 'lucide-react'; // <-- NHỚ IMPORT THÊM Trophy
import { Link, useLocation } from 'react-router-dom';
import { type User } from '../api/authApi';

interface HeaderProps {
  onOpenUpload: () => void;
  currentUser: User | null;
}
// Hàm xuất ra combo CSS cực cháy dựa trên Rank Tier của Backend trả về
export const getRankAura = (tier: string) => {
  switch (tier) {
    case 'Thách Đấu Sét':
      return { color: 'text-red-500', border: 'border-red-500', glow: 'shadow-[0_0_30px_rgba(239,68,68,0.8)] animate-pulse', bg: 'bg-red-500/10', label: 'THÁCH ĐẤU' };
    case 'Sét Kim Cương':
      return { color: 'text-cyan-400', border: 'border-cyan-400', glow: 'shadow-[0_0_20px_rgba(34,211,238,0.6)]', bg: 'bg-cyan-400/10', label: 'KIM CƯƠNG' };
    case 'Sét Vàng':
      return { color: 'text-yellow-400', border: 'border-yellow-400', glow: 'shadow-[0_0_15px_rgba(250,204,21,0.5)]', bg: 'bg-yellow-400/10', label: 'VÀNG' };
    case 'Sét Đồng':
      return { color: 'text-orange-400', border: 'border-orange-400', glow: 'shadow-[0_0_10px_rgba(251,146,60,0.3)]', bg: 'bg-orange-400/10', label: 'ĐỒNG' };
    default: // Sét Nhựa
      return { color: 'text-zinc-500', border: 'border-zinc-800', glow: 'shadow-none', bg: 'bg-zinc-900', label: 'TÂN BINH' };
  }
};
export default function Header({ onOpenUpload, currentUser }: HeaderProps) {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-zinc-950/50 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-yellow-500 group">
          <Zap size={28} className="fill-yellow-500 group-hover:scale-110 transition-transform" />
          <span className="font-black tracking-tighter text-xl hidden sm:block">Rổ sét</span>
        </Link>

        <div className="flex items-center gap-3 ml-auto">
          {/* Hiển thị tên người dùng */}
          {currentUser && (
            (() => {
              const aura = getRankAura(currentUser.rankTier || 'Sét Nhựa');
              return (
                <div className="hidden sm:flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-full border border-white/5">
                  <div className={`w-2 h-2 rounded-full ${aura.bg} ${aura.border} border ${aura.glow}`}></div>
                  <span className={`font-black text-sm ${aura.color}`}>
                    {currentUser.username}
                  </span>
                </div>
              );
            })()
          )}

          {/* Nút Action chính */}
          <button
            onClick={onOpenUpload}
            className="bg-yellow-500 text-black px-4 py-2 rounded-full font-bold text-sm hover:bg-yellow-400 transition-colors shadow-[0_0_15px_rgba(234,179,8,0.3)] whitespace-nowrap"
          >
            Có code hay hả?
          </button>

          {/* --- KHU VỰC NHÓM CÁC ICON ĐIỀU HƯỚNG CÓ ĐƯỜNG KẺ DỌC --- */}
          <div className="flex items-center gap-2 border-l border-zinc-800 pl-3 ml-1">

            {/* Nút Bảng Xếp Hạng */}
            <Link
              to="/leaderboard"
              title="Đại Lộ Danh Vọng"
              className={`p-2 rounded-full transition-colors ${location.pathname === '/leaderboard' ? 'bg-zinc-800 text-yellow-500' : 'bg-zinc-900 text-zinc-400 hover:text-yellow-500'}`}
            >
              <Trophy size={20} />
            </Link>

            {/* Nút Dinh Thự */}
            <Link
              to={`/profile/${currentUser?.id}`} // <-- Đã chèn ID của chính mình vào đây
              title="Dinh Thự"
              className={`p-2 rounded-full transition-colors ${location.pathname.startsWith('/profile') ? 'bg-zinc-800 text-yellow-500' : 'bg-zinc-900 text-zinc-400 hover:text-yellow-500'}`}
            >
              <UserIcon size={20} />
            </Link>

          </div>

        </div>
      </div>
    </header>
  );
}