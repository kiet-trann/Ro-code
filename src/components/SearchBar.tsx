import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';

interface SearchBarProps {
  onSearch: (keyword: string, category: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');

  // TUYỆT CHIÊU DEBOUNCE: Chống spam API
  useEffect(() => {
    // Cài đặt đồng hồ hẹn giờ
    const delayDebounceFn = setTimeout(() => {
      onSearch(searchTerm, category);
    }, 500); // 500ms (Nửa giây)

    // Nếu người dùng tiếp tục gõ trước khi hết 0.5s -> Hủy đồng hồ cũ, đặt lại đồng hồ mới
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, category]); // Chỉ chạy khi searchTerm hoặc category thay đổi

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-6 shadow-sm">
      <div className="flex flex-col gap-4">
        
        {/* Ô Nhập Tìm Kiếm */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-zinc-500" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo mã code, diễn viên idol..."
            className="w-full bg-black border border-zinc-700 rounded-xl pl-11 pr-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-yellow-500 transition-colors placeholder:text-zinc-600"
          />
        </div>

        {/* Bộ Lọc (Filter) Thể Loại */}
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
          <Filter size={16} className="text-zinc-500 shrink-0 mr-1" />
          
          {['All', 'Movie', 'Haiten'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                category === cat 
                ? 'bg-yellow-500 text-black shadow-[0_0_10px_rgba(234,179,8,0.3)]' 
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {cat === 'All' ? 'Tất cả' : cat}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}