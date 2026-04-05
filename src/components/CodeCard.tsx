import React, { useState } from 'react';
import { Copy, Check, MessageSquare, Star, PlayCircle, Bookmark, User, Tag, Eye, MessageCircle } from 'lucide-react';
import codeApi from '../api/codeApi';
import toast from 'react-hot-toast';

export interface CodeCardProps {
  id?: number;
  codeText: string;
  author: string;
  timeAgo: string;
  avgRating: number;
  isWatched: boolean;
  isSaved?: boolean;
  currentUserId?: number;
  // --- 3 TRƯỜNG MỚI THÊM ---
  actorName?: string;
  category?: string;
  viewCount?: number;
  // Hàm trigger mở modal bình luận (Sẽ làm ở bước sau)
  onOpenComments?: (codeId: number) => void;
}

export default function CodeCard({
  id, codeText, author, timeAgo, avgRating, isWatched: apiIsWatched, isSaved = false, currentUserId,
  actorName = "Chưa cập nhật",
  category = "Movie",
  viewCount = 0,
  onOpenComments
}: CodeCardProps) {
  const [isWatched, setIsWatched] = useState<boolean>(apiIsWatched);
  const [userRating, setUserRating] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  // State quản lý lượt xem hiển thị trên giao diện
  const [views, setViews] = useState<number>(viewCount);
  const [hasViewed, setHasViewed] = useState<boolean>(false); // Tránh spam view

  const [isSavedLocal, setIsSavedLocal] = useState<boolean>(isSaved);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggleSave = async () => {
    // 1. SỬA LỖI ID: Thêm điều kiện check !id để TypeScript yên tâm
    if (!currentUserId || !id) {
      toast.error("Vui lòng đăng nhập để lưu code!");
      return;
    }
    if (isSaving) return;

    // Cập nhật UI ngay lập tức (Optimistic UI)
    setIsSavedLocal(!isSavedLocal);
    setIsSaving(true);

    try {
      // 2. SỬA LỖI ISSAVED: Thêm ': any' vào biến response
      const response: any = await codeApi.toggleSave(id, currentUserId);

      // Backend trả về { isSaved: true/false }
      setIsSavedLocal(response.isSaved);

      if (response.isSaved) {
        toast.success("Đã cất vào tủ đồ!");
      } else {
        toast.success("Đã vứt khỏi tủ đồ!");
      }
    } catch (error) {
      // Nếu API lỗi, khôi phục lại trạng thái cũ
      setIsSavedLocal(!isSavedLocal);
      toast.error("Lỗi mạng, chưa lưu được!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = async () => {
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    toast.success('Đã chép mã vào bộ nhớ đệm!');
    setTimeout(() => setCopied(false), 2000);

    // Tự động TĂNG VIEW khi user bấm Copy (và chỉ tăng 1 lần cho mỗi phiên)
    if (id && !hasViewed) {
      try {
        await codeApi.increaseView(id);
        setViews(prev => prev + 1); // Cập nhật số view ngay trên màn hình
        setHasViewed(true);
      } catch (error) {
        console.log("Lỗi khi tăng view:", error);
      }
    }
  };

  const handleRate = async (score: number) => {
    if (isWatched || !id || !currentUserId) return;

    try {
      await codeApi.rateCode(id, { userId: currentUserId, score: score });
      setUserRating(score);
      setIsWatched(true);
      toast.success('Cũng khá chứ bộ');
    } catch (error) {
      toast.error('Lỗi khi chấm điểm.');
    }
  };

  return (
    <div className={`relative p-5 rounded-xl border transition-all duration-300 ${isWatched ? 'bg-zinc-900/40 border-yellow-500/20 opacity-70' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
      }`}>

      {/* Header: Tác giả & Thời gian */}
      <div className="flex justify-between items-center mb-3 text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-zinc-800 rounded-full"><User size={12} className="text-zinc-400" /></div>
          <span className="font-medium text-zinc-300">{author}</span>
        </div>
        <span>{timeAgo}</span>
      </div>

      {/* Info: Tên diễn viên & Thể loại */}
      <div className="flex justify-between items-center mb-3">
        <div className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
          <Tag size={14} className="text-yellow-500" />
          {actorName}
        </div>
        {/* Badge phân loại */}
        <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${category === 'Haiten' ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
          }`}>
          {category ? category : "Movie"}
        </span>
      </div>

      {/* Box chứa Code */}
      <div className="flex justify-between items-center bg-black p-4 rounded-lg border border-zinc-800/50 mb-4 group">
        <span className="font-mono text-xl tracking-wider text-zinc-100 uppercase">{codeText}</span>

        {/* --- CỤM NÚT ACTION (BOOKMARK + COPY) --- */}
        <div className="flex items-center gap-2">

          {/* NÚT LƯU (BOOKMARK) */}
          <button
            onClick={handleToggleSave}
            disabled={isSaving}
            className={`p-2 rounded-md transition-all duration-300 ${isSavedLocal
              ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/50'
              : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 border border-transparent'
              }`}
            title={isSavedLocal ? "Bỏ lưu" : "Lưu vào tủ đồ"}
          >
            <Bookmark size={18} className={isSavedLocal ? 'fill-yellow-500' : ''} />
          </button>

          {/* NÚT COPY */}
          <button
            onClick={handleCopy}
            title="Sao chép & Xem"
            className="p-2 bg-zinc-800 rounded-md text-zinc-400 hover:text-yellow-400 hover:bg-zinc-700 transition-colors"
          >
            {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
          </button>
        </div>
      </div>

      {/* Footer: Rating, Views & Comments */}
      <div className="flex justify-between items-center">
        {/* Cụm đánh giá sao */}
        <div className="flex items-center gap-1 cursor-pointer">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star} size={20}
              onClick={() => handleRate(star)}
              className={`transition-colors ${(userRating >= star) || (isWatched && avgRating >= star && userRating === 0)
                ? 'fill-yellow-500 text-yellow-500'
                : 'text-zinc-600 hover:text-yellow-400'
                }`}
            />
          ))}
        </div>

        {/* Cụm Thống kê (View, Bình luận, Điểm) */}
        <div className="flex items-center gap-4 text-xs text-zinc-500 font-mono">
          {/* Lượt xem */}
          <div className="flex items-center gap-1" title="Lượt xem">
            <Eye size={14} />
            <span>{views}</span>
          </div>

          {/* Nút Bình luận */}
          <button
            onClick={() => id && onOpenComments && onOpenComments(id)}
            className="flex items-center gap-1 hover:text-yellow-400 transition-colors"
            title="Xem bình luận"
          >
            <MessageCircle size={14} />
            <span>Bình luận</span>
          </button>

          {/* Điểm số / Trạng thái */}
          <div className="ml-2 pl-4 border-l border-zinc-800">
            {isWatched ? 'ĐÃ XEM' : `ĐIỂM: ${avgRating}/5`}
          </div>
        </div>
      </div>

    </div>
  );
}