import React, { useState } from 'react';
import { Copy, Star, Check, User } from 'lucide-react';
import codeApi from '../api/codeApi';
import toast from 'react-hot-toast';

export interface CodeCardProps {
  id?: number;
  codeText: string;
  author: string;
  timeAgo: string;
  avgRating: number;
  isWatched: boolean;
  currentUserId?: number; // ĐÃ THÊM: Để đón ID từ Feed/Profile truyền xuống
}

export default function CodeCard({ id, codeText, author, timeAgo, avgRating, isWatched: apiIsWatched, currentUserId }: CodeCardProps) {
  const [isWatched, setIsWatched] = useState<boolean>(apiIsWatched);
  const [userRating, setUserRating] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    toast.success('Đã chép mã vào bộ nhớ đệm!');
    setTimeout(() => setCopied(false), 2000);
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

      <div className="flex justify-between items-center mb-4 text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-zinc-800 rounded-full"><User size={12} className="text-zinc-400" /></div>
          <span className="font-medium text-zinc-300">{author}</span>
        </div>
        <span>{timeAgo}</span>
      </div>

      <div className="flex justify-between items-center bg-black p-4 rounded-lg border border-zinc-800/50 mb-4 group">
        <span className="font-mono text-xl tracking-wider text-zinc-100 uppercase">{codeText}</span>
        <button
          onClick={handleCopy}
          title="Sao chép"
          className="p-2 bg-zinc-800 rounded-md text-zinc-400 hover:text-yellow-400 hover:bg-zinc-700 transition-colors"
        >
          {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
        </button>
      </div>

      <div className="flex justify-between items-center">
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
        <div className="text-xs text-zinc-500 font-mono">
          {isWatched ? 'ĐÃ XEM' : `ĐIỂM: ${avgRating}/5`}
        </div>
      </div>
    </div>
  );
}