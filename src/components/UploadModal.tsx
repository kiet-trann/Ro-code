import React, { useState } from 'react';
import { X } from 'lucide-react';
import codeApi from '../api/codeApi';
import toast from 'react-hot-toast';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId?: number;
}

export default function UploadModal({ isOpen, onClose, currentUserId }: UploadModalProps) {
  const [newCode, setNewCode] = useState<string>('');
  const [actorName, setActorName] = useState<string>(''); // Quản lý Tên diễn viên
  const [category, setCategory] = useState<string>('Movie'); // Quản lý Thể loại (Mặc định: Movie)
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 1. Kiểm tra rỗng Code
    if (!newCode.trim() || !currentUserId) {
      toast.error('Chưa điền code kìa !');
      return;
    }

    // 2. Kiểm tra rỗng Tên diễn viên
    if (!actorName.trim()) {
      toast.error('Nhớ điền tên diễn viên để anh em còn biết đường tìm!');
      return;
    }

    // 3. KIỂM TRA LUẬT HAITEN (Chỉ cho phép 1-6 chữ số)
    if (category === 'Haiten') {
      // Tách chuỗi nếu họ nhập nhiều code cách nhau bằng dấu phẩy hoặc xuống dòng
      const codes = newCode.split(/[,;\n\r]+/).filter(c => c.trim() !== "");

      for (let c of codes) {
        if (!/^\d{1,6}$/.test(c.trim())) {
          toast.error(`Code '${c}' sai luật! Haiten chỉ được chứa từ 1 đến 6 chữ số.`);
          return; // Dừng luôn, không gọi API nữa
        }
      }
    }

    setIsLoading(true);

    // 4. Gọi API gửi toàn bộ dữ liệu (Bao gồm actorName và category)
    toast.promise(
      codeApi.dropCode({
        codeText: newCode,
        authorId: currentUserId,
        actorName: actorName.trim(), // Gửi thêm tên diễn viên
        category: category           // Gửi thêm thể loại
      }),
      {
        loading: 'Đang tải lên...',
        success: 'Đồng sét cảm ơn vì đã đóng góp ❤️',
        error: 'Có lỗi xảy ra khi share code.',
      }
    ).then(() => {
      // Reset form sau khi thành công
      setNewCode('');
      setActorName('');
      setCategory('Movie');
      onClose();
      setTimeout(() => window.location.reload(), 1000);
    }).finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden shadow-[0_0_40px_rgba(234,179,8,0.15)] relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300">
          <X size={24} />
        </button>

        <div className="p-8">
          <div className="flex items-center gap-2 mb-6 text-yellow-500 justify-center">
            <h2 className="text-xl font-black tracking-tighter text-white uppercase">Share code cho anh em xem với</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* --- Ô CHỌN THỂ LOẠI --- */}
            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-400">Thể loại</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-yellow-500 transition-colors"
              >
                <option value="Movie">Phim thông thường (Movie)</option>
                <option value="Haiten">Haiten (Chỉ 1-6 số)</option>
              </select>
            </div>

            {/* --- Ô NHẬP TÊN DIỄN VIÊN --- */}
            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-400">
                Tên diễn viên <span className="text-yellow-500">*</span>
              </label>
              <input
                type="text"
                value={actorName}
                onChange={(e) => setActorName(e.target.value)}
                placeholder="Nhập tên thần tượng..."
                className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-yellow-500 transition-colors placeholder:text-zinc-700"
              />
            </div>

            {/* --- Ô NHẬP CODE (Cũ) --- */}
            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-400">
                Mã Code <span className="text-yellow-500">*</span>
              </label>
              <textarea
                value={newCode}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewCode(e.target.value)}
                placeholder="Paste code vào đây (cách nhau bởi dấu phẩy)"
                rows={3}
                className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-center font-mono text-xl text-zinc-100 focus:outline-none focus:border-yellow-500 transition-colors placeholder:text-zinc-700 uppercase resize-none custom-scrollbar"
              />
            </div>

            <button
              type="submit"
              disabled={!newCode.trim() || !actorName.trim() || isLoading}
              className="w-full bg-yellow-500 text-black py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(234,179,8,0.3)] mt-2"
            >
              {isLoading ? 'Đang "xuất"...' : 'Xuất'}
            </button>
          </form>
        </div>
        <div className="bg-black/50 p-4 text-center border-t border-zinc-800">
          <p className="text-xs text-zinc-600 font-mono">Yên tâm đi chỗ này không ai biết đâu. Mã code mày cung cấp sẽ được cộng đồng sét "thẩm" định.</p>
        </div>
      </div>
    </div>
  );
}