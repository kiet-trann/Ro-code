import React from 'react';
import { Zap, User as UserIcon } from 'lucide-react'; // Đổi tên User icon để tránh trùng
import { Link, useLocation } from 'react-router-dom';
import { type User } from '../api/authApi'; // Import type User

interface HeaderProps {
  onOpenUpload: () => void;
  currentUser: User | null; // Khai báo đón nhận currentUser
}

export default function Header({ onOpenUpload, currentUser }: HeaderProps) {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-yellow-500 group">
          <Zap size={28} className="fill-yellow-500 group-hover:scale-110 transition-transform" />
          <span className="font-black tracking-tighter text-xl hidden sm:block">Rổ sét</span>
        </Link>

        <div className="flex items-center gap-3 ml-auto">
          {/* Hiển thị tên người dùng */}
          {currentUser && (
            <span className="text-zinc-400 font-mono text-sm hidden sm:block">
              [{currentUser.username}]
            </span>
          )}

          <button
            onClick={onOpenUpload}
            className="bg-yellow-500 text-black px-4 py-2 rounded-full font-bold text-sm hover:bg-yellow-400 transition-colors shadow-[0_0_15px_rgba(234,179,8,0.3)] whitespace-nowrap"
          >
            Có code hay hả?
          </button>
          <Link
            to="/profile"
            className={`p-2 rounded-full transition-colors ${location.pathname === '/profile' ? 'bg-zinc-800 text-yellow-500' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'}`}
          >
            <UserIcon size={20} />
          </Link>
        </div>
      </div>
    </header>
  );
}