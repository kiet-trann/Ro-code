import React, { useState } from 'react';
import { X, ShieldCheck, AlertCircle } from 'lucide-react';
import codeApi from '../api/codeApi';
import toast from 'react-hot-toast';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId?: number;
}

export default function UploadModal({ isOpen, onClose, currentUserId }: UploadModalProps) {
  const [newCode, setNewCode] = useState<string>('');
  const [actorName, setActorName] = useState<string>('');
  const [category, setCategory] = useState<string>('Movie');
  const [isLoading, setIsLoading] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cleanCode = newCode.trim();
    const cleanActor = actorName.trim();

    // 1. Kiểm tra rỗng cơ bản
    if (!cleanCode || !currentUserId) {
      toast.error('Chưa điền code kìa!');
      return;
    }

    if (!cleanActor) {
      toast.error('Nhớ điền tên diễn viên để anh em còn biết đường tìm!');
      return;
    }

    // 2. Tầng lọc Regex "Chó săn" - Bảo vệ sự trong sạch của hệ thống
    const codes = cleanCode.split(/[,;\n\r]+/).filter(c => c.trim() !== "");

    for (let c of codes) {
      const code = c.trim().toUpperCase();

      if (category === 'Haiten') {
        // Luật Haiten: Chỉ chứa 5 đến 6 chữ số (nhentai style)
        if (!/^\d{5,6}$/.test(code)) {
          toast.error(`Mã '${code}' sai luật! Haiten phải là dãy 5 hoặc 6 chữ số.`);
          return;
        }
      } else {
        // Luật Movie: Phải có dạng CHỮ-SỐ (VD: ABCD-123 hoặc JAV-001)
        // Chấp nhận cả trường hợp không có dấu gạch nhưng phải có cả Chữ và Số
        if (!/^[A-Z0-9]+-[0-9]+$/i.test(code) && !/^[A-Z]{2,}[0-9]{2,}$/i.test(code)) {
          toast.error(`Mã '${code}' không giống phim thật! Định dạng chuẩn là: CHỮ-SỐ (VD: ABCD-123).`);
          return;
        }
      }
    }

    setIsLoading(true);

    // 3. Gọi API với dữ liệu đã được lọc sạch
    toast.promise(
      codeApi.dropCode({
        codeText: cleanCode.toUpperCase(),
        authorId: currentUserId,
        actorName: cleanActor,
        category: category
      }),
      {
        loading: 'Đang soi chiếu nhân phẩm...',
        // HỨNG LỜI KHEN TỪ BACKEND
        success: (res: any) => {
          // res.data.message chính là câu "Thả code thành công! Đã cộng điểm..." từ C#
          return res.data?.message || 'Đồng sét cảm ơn vì đã đóng góp ❤️';
        },
        // HỨNG ĐẠN CHỬI TỪ BACKEND
        error: (err: any) => {
          // Móc câu chửi "Mã pha ke", "Hàng nhai lại" từ C# ra đập vào mặt User
          return err.response?.data?.message || 'Cá mập cắn cáp hoặc Server nổ rồi!';
        }
      }
    ).then((res) => {
      setNewCode('');
      setActorName('');
      setCategory('Movie');
      onClose();

      // NẾU MUỐN PRO: Thay vì window.location.reload(), hãy gọi một prop function từ Component cha truyền vào.
      // Ví dụ: onUploadSuccess(res.data.data); // Truyền mảng code mới vào hàm cha để nó nhét vào state list hiện tại

    }).finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-zinc-950 border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-[0_0_50px_rgba(234,179,8,0.2)] relative">

        {/* Nút đóng xịn xò */}
        <button onClick={onClose} className="absolute top-5 right-5 text-zinc-500 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-full">
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="flex flex-col items-center gap-2 mb-8 text-center">
            <div className="p-3 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 mb-2">
              <ShieldCheck size={32} className="text-yellow-500" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white uppercase italic">Cống nạp mã code</h2>
            <p className="text-zinc-500 text-xs font-mono">Hệ thống sẽ tự động từ chối các mã "ma" không đúng định dạng.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* --- THỂ LOẠI --- */}
            <div className="space-y-1.5 relative">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Thể loại</label>

              {/* Nút bấm hiển thị */}
              <div
                onClick={() => setIsSelectOpen(!isSelectOpen)}
                className={`w-full bg-zinc-900/50 border ${isSelectOpen ? 'border-yellow-500/50' : 'border-zinc-800'} rounded-2xl px-4 py-3.5 text-zinc-100 flex justify-between items-center cursor-pointer transition-all hover:bg-zinc-800/50`}
              >
                <span className="font-bold flex items-center gap-2">
                  {category === 'Movie' ? ' Phim thông thường (Movie)' : ' Haiten (Mã 5-6 số)'}
                </span>
                <div className={`transition-transform duration-300 ${isSelectOpen ? 'rotate-180' : ''}`}>
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              {/* Menu xổ xuống (Dropdown) */}
              {isSelectOpen && (
                <>
                  {/* Lớp phủ để bấm ra ngoài thì đóng menu */}
                  <div className="fixed inset-0 z-10" onClick={() => setIsSelectOpen(false)}></div>

                  <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div
                      onClick={() => { setCategory('Movie'); setIsSelectOpen(false); }}
                      className={`px-4 py-3 hover:bg-yellow-500 hover:text-black cursor-pointer transition-colors flex items-center gap-2 font-bold ${category === 'Movie' ? 'text-yellow-500 bg-yellow-500/5' : 'text-zinc-300'}`}
                    >
                      Phim thông thường (Movie)
                    </div>
                    <div
                      onClick={() => { setCategory('Haiten'); setIsSelectOpen(false); }}
                      className={`px-4 py-3 hover:bg-yellow-500 hover:text-black cursor-pointer transition-colors flex items-center gap-2 font-bold ${category === 'Haiten' ? 'text-yellow-500 bg-yellow-500/5' : 'text-zinc-300'}`}
                    >
                      Haiten (Mã 5-6 số)
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* --- TÊN DIỄN VIÊN --- */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Tác giả / Diễn viên</label>
              <input
                type="text"
                value={actorName}
                onChange={(e) => setActorName(e.target.value)}
                placeholder="Ai đóng/vẽ bộ này?"
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-4 py-3.5 text-zinc-100 focus:outline-none focus:border-yellow-500/50 transition-all placeholder:text-zinc-700 font-bold"
              />
            </div>

            {/* --- Ô NHẬP CODE --- */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1 flex justify-between">
                Mã Code <span>(Mỗi mã 1 dòng)</span>
              </label>
              <textarea
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder={category === 'Movie' ? "Ví dụ: ABCD-123" : "Ví dụ: 123456"}
                rows={3}
                className="w-full bg-black border border-zinc-800 rounded-2xl px-4 py-4 text-center font-mono text-2xl text-yellow-500 focus:outline-none focus:border-yellow-500 transition-all placeholder:text-zinc-800 uppercase resize-none shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full bg-yellow-500 text-black py-4 rounded-2xl font-black text-lg hover:bg-yellow-400 transition-all active:scale-95 disabled:opacity-50 shadow-[0_10px_20px_rgba(234,179,8,0.2)]"
            >
              <div className="flex items-center justify-center gap-2">
                {isLoading ? (
                  <span className="animate-pulse">Đang thẩm định...</span>
                ) : (
                  <><span>XUẤT BẢN</span></>
                )}
              </div>
            </button>
          </form>
        </div>

        {/* Footer cảnh báo */}
        <div className="bg-zinc-900/50 p-5 flex items-start gap-3 border-t border-white/5">
          <AlertCircle size={18} className="text-zinc-600 shrink-0 mt-0.5" />
          <p className="text-[10px] text-zinc-500 leading-relaxed italic">
            Mọi mã rác, mã sai định dạng hoặc cố tình spam sẽ bị hệ thống tự động quét và trừ điểm "Nhân Phẩm" trên Đại Lộ Danh Vọng.
          </p>
        </div>
      </div>
    </div>
  );
}