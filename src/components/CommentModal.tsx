import React, { useState, useEffect } from 'react';
import { X, Send, User, MessageSquare } from 'lucide-react';
import codeApi, { type CommentResponse } from '../api/codeApi';
import toast from 'react-hot-toast';

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  codeId: number | null;
  currentUserId?: number;
}

export default function CommentModal({ isOpen, onClose, codeId, currentUserId }: CommentModalProps) {
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tự động gọi API lấy bình luận khi Modal mở lên
  useEffect(() => {
    if (isOpen && codeId) {
      fetchComments();
    }
  }, [isOpen, codeId]);

  const fetchComments = async () => {
    if (!codeId) return;
    setIsLoading(true);
    try {
      const data = await codeApi.getComments(codeId);
      setComments(data);
    } catch (error) {
      toast.error('Không thể tải bình luận!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    if (!currentUserId) {
      toast.error('Bạn cần có tài khoản (ID) để bình luận!');
      return;
    }

    if (!codeId) return;

    setIsSubmitting(true);
    try {
      const addedComment = await codeApi.postComment(codeId, {
        content: newComment,
        userId: currentUserId
      });
      // Thêm bình luận mới vào đầu danh sách đang hiển thị
      setComments([addedComment, ...comments]);
      setNewComment(''); // Xóa ô nhập
    } catch (error) {
      toast.error('Lỗi khi gửi bình luận. Thử lại sau!');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format thời gian cho đẹp
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN') + ' lúc ' + date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen || !codeId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-[0_0_40px_rgba(234,179,8,0.15)] relative">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800">
          <div className="flex items-center gap-2 text-yellow-500">
            <MessageSquare size={20} />
            <h2 className="text-lg font-black tracking-tighter text-white uppercase">Phòng "Thẩm" Định</h2>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Khu vực hiển thị danh sách bình luận (Cuộn được) */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
          {isLoading ? (
            <div className="text-center text-zinc-500 py-10 font-mono text-sm">Đang tải bình luận...</div>
          ) : comments.length === 0 ? (
            <div className="text-center text-zinc-600 py-10 font-mono text-sm">
              Chưa có ai "thẩm" code này. Bạn hãy là người đầu tiên!
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="bg-black/50 p-4 rounded-xl border border-zinc-800/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-zinc-800 rounded-full">
                    <User size={12} className="text-zinc-400" />
                  </div>
                  <span className="font-bold text-sm text-zinc-300">
                    Người dùng #{comment.userId} {/* Nếu có API lấy tên user thì thay vào đây */}
                  </span>
                  <span className="text-[10px] text-zinc-600 ml-auto font-mono">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Khu vực nhập bình luận mới */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 rounded-b-2xl">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Nhập đánh giá của bạn..."
              className="flex-1 bg-black border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-yellow-500 transition-colors placeholder:text-zinc-600"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={!newComment.trim() || isSubmitting}
              className="bg-yellow-500 text-black p-3 rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Send size={20} className={isSubmitting ? "opacity-50" : ""} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}