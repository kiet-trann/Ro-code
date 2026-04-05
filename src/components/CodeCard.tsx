import React, { useState } from 'react';
import { Copy, Check, Star, Bookmark, Eye, Tag, Clapperboard, MessageSquare } from 'lucide-react';
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
  actorName?: string;
  category?: string;
  viewCount?: number;
  onOpenComments?: (codeId: number) => void;
}

export default function CodeCard({
  id, codeText, author, timeAgo, avgRating, isWatched: apiIsWatched, isSaved = false, currentUserId,
  actorName = "Chưa cập nhật", category = "Movie", viewCount = 0, onOpenComments
}: CodeCardProps) {

  const [isWatched, setIsWatched] = useState<boolean>(apiIsWatched);
  const [userRating, setUserRating] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  // State quản lý lượt xem (Giữ nguyên logic của bạn)
  const [views, setViews] = useState<number>(viewCount);
  const [hasViewed, setHasViewed] = useState<boolean>(false);

  const [isSavedLocal, setIsSavedLocal] = useState<boolean>(isSaved);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggleSave = async () => {
    if (!currentUserId || !id) {
      toast.error("Vui lòng đăng nhập để lưu code!");
      return;
    }
    if (isSaving) return;

    setIsSavedLocal(!isSavedLocal);
    setIsSaving(true);

    try {
      const response: any = await codeApi.toggleSave(id, currentUserId);
      setIsSavedLocal(response.isSaved);
      if (response.isSaved) toast.success("Đã cất vào tủ đồ!");
      else toast.success("Đã vứt khỏi tủ đồ!");
    } catch (error) {
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

    // Tự động TĂNG VIEW (Giữ nguyên logic của bạn)
    if (id && !hasViewed) {
      try {
        await codeApi.increaseView(id);
        setViews(prev => prev + 1);
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
    // CARD WRAPPER: Kính mờ + Viền sáng khi Hover (Rổ Sét 2.0)
    <div className="group relative bg-zinc-900/40 backdrop-blur-md border border-white/5 hover:border-yellow-500/30 rounded-2xl p-5 transition-all duration-300 hover:shadow-[0_0_30px_rgba(234,179,8,0.05)] overflow-hidden">

      {/* Tia sáng background chéo thẻ bài (hiện ra khi hover) */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-[50px] -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      {/* --- HEADER: Tác giả & Category --- */}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex items-center gap-3">
          {/* Avatar chữ cái đầu tiên */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-600 to-orange-500 flex items-center justify-center font-black text-black shadow-lg">
            {author.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-black text-zinc-200 text-lg leading-tight">{author}</div>
            <div className="text-zinc-500 text-xs font-mono">{timeAgo}</div>
          </div>
        </div>

        {/* Badge phân loại (Giữ nguyên logic màu của bạn) */}
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${category === 'Haiten'
          ? 'bg-red-500/20 text-red-500 border-red-500/30'
          : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
          }`}>
          <Tag size={10} /> {category ? category : "Movie"}
        </div>
      </div>

      {/* --- DIỄN VIÊN --- */}
      {actorName && actorName !== "Chưa cập nhật" && (
        <div className="mb-4 flex items-center gap-2 text-sm text-zinc-300 font-medium relative z-10">
          <Clapperboard size={14} className="text-zinc-500" />
          <span>{actorName}</span>
        </div>
      )}

      {/* --- HỘP CODE HACKER (Rổ Sét 2.0) --- */}
      <div className="relative group/code mb-5">
        {/* Hiệu ứng sáng phía sau khung code */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl blur-md opacity-0 group-hover/code:opacity-100 transition-opacity duration-300"></div>

        <div className="relative bg-black border border-zinc-800 rounded-xl p-4 flex justify-between items-center overflow-hidden">
          {/* Dải màu bên trái cho giống VS Code */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500"></div>

          <code className="font-mono text-xl md:text-2xl font-black text-yellow-400 tracking-wider pl-2 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]">
            {codeText}
          </code>

          <button
            onClick={handleCopy}
            className={`p-2.5 rounded-lg transition-all ${copied ? 'bg-green-500/20 text-green-400' : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 hover:scale-110 active:scale-95'}`}
            title="Copy nhanh"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>
      </div>

      {/* --- FOOTER: Tương tác --- */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5 relative z-10">

        {/* Khu vực Stats */}
        <div className="flex items-center gap-4 text-xs font-mono text-zinc-500">
          <span className="flex items-center gap-1.5" title="Lượt xem (Live)"><Eye size={14} /> {views}</span>
          <span className="flex items-center gap-1.5 text-yellow-500/80"><Star size={14} className="fill-yellow-500/50" /> {avgRating}/5</span>
        </div>

        {/* Khu vực Action Buttons */}
        <div className="flex items-center gap-2">

          {/* Nút Đánh giá (Giữ nguyên logic của bạn) */}
          {!isWatched ? (
            <div className="flex bg-zinc-800/50 rounded-full p-1 border border-zinc-700/50">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRate(star)}
                  className={`p-1.5 transition-transform hover:scale-125 ${(userRating >= star) ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-500 hover:text-yellow-400'
                    }`}
                  title={`${star} sao`}
                >
                  <Star size={14} />
                </button>
              ))}
            </div>
          ) : (
            <div className="text-[10px] font-bold text-zinc-500 px-3 py-2 bg-zinc-800/30 rounded-full border border-zinc-800">
              ĐÃ XEM
            </div>
          )}

          {/* Nút Bình luận */}
          <button
            onClick={() => id && onOpenComments && onOpenComments(id)}
            className="flex items-center justify-center p-2.5 bg-zinc-800/50 hover:bg-zinc-700 rounded-full text-zinc-400 hover:text-blue-400 border border-zinc-700/50 transition-all hover:scale-110"
            title="Bình luận"
          >
            <MessageSquare size={16} />
          </button>

          {/* Nút Tủ đồ bí mật */}
          <button
            onClick={handleToggleSave}
            disabled={isSaving}
            className={`flex items-center justify-center p-2.5 rounded-full border transition-all hover:scale-110 ${isSavedLocal
              ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-500'
              : 'bg-zinc-800/50 border-zinc-700/50 text-zinc-400 hover:text-white hover:bg-zinc-700'
              }`}
            title={isSavedLocal ? "Bỏ lưu" : "Cất vào Tủ đồ"}
          >
            <Bookmark size={16} className={isSavedLocal ? "fill-yellow-500" : ""} />
          </button>
        </div>
      </div>
    </div>
  );
}