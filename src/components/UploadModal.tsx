import React, { useState } from 'react';
import { X, Zap } from 'lucide-react';
import codeApi from '../api/codeApi';
import toast from 'react-hot-toast';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId?: number; // ĐÃ THÊM: Để đón ID từ App.tsx truyền xuống
}

export default function UploadModal({ isOpen, onClose, currentUserId }: UploadModalProps) {
  const [newCode, setNewCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newCode.trim() || !currentUserId) {
      toast.error('Chưa điền code kìa !');
      return;
    }

    // Dùng toast.promise để hiển thị trạng thái đang loading -> thành công -> thất bại cực xịn
    toast.promise(
      codeApi.dropCode({ codeText: newCode, authorId: currentUserId }),
      {
        loading: 'Đang tải lên...',
        success: 'Đồng sét cảm ơn vì đã đóng góp ❤️',
        error: 'Có lỗi xảy ra khi share code.',
      }
    ).then(() => {
      setNewCode('');
      onClose();
      setTimeout(() => window.location.reload(), 1000); // Reload nhẹ sau 1s để thấy code mới
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <textarea
              value={newCode}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewCode(e.target.value)}
              placeholder="Chia sẻ cho thầy đi! Có thể paste 1 lúc nhiều code (Lưu ý: cách nhau bởi dấu phẩy)"
              autoFocus
              rows={4}
              className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-5 text-center font-mono text-xl text-zinc-100 focus:outline-none focus:border-yellow-500 transition-colors placeholder:text-zinc-700 uppercase resize-none custom-scrollbar"
            />
            <button
              type="submit"
              disabled={!newCode.trim() || isLoading}
              className="w-full bg-yellow-500 text-black py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(234,179,8,0.3)]"
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