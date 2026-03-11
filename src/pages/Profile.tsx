import React, { useState, useEffect } from 'react';
import { User as UserIcon, Shield } from 'lucide-react';
import TabNavigation, { type TabType } from '../components/TabNavigation';
import CodeCard, { type CodeCardProps } from '../components/CodeCard';
import { type User } from '../api/authApi';
import codeApi from '../api/codeApi';

interface ProfileProps {
  currentUser: User | null;
}

export default function Profile({ currentUser }: ProfileProps) {
  const [activeTab, setActiveTab] = useState<string>('watched');
  const [codes, setCodes] = useState<CodeCardProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const tabs: TabType[] = [
    { id: 'watched', label: 'Đã Xem' },
    { id: 'dropped', label: 'Code đã share' }
  ];

  useEffect(() => {
    setCodes([]);
    setPage(1);
  }, [activeTab]);

  // Tự động load dữ liệu thật mỗi khi đổi Tab hoặc đổi User
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!currentUser?.id) return;

      page === 1 ? setIsLoading(true) : setIsLoadingMore(true);

      try {
        let response;
        if (activeTab === 'watched') {
          response = await codeApi.getWatchedCodes(currentUser.id, page, 10);
        } else if (activeTab === 'dropped') {
          response = await codeApi.getDroppedCodes(currentUser.id, page, 10);
        }

        if (response) {
          setCodes(prev => page === 1 ? response.items : [...prev, ...response.items]);
          setTotalPages(response.totalPages);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu cá nhân", error);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    };

    fetchProfileData();
  }, [activeTab, currentUser?.id, page]);

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      {/* Header Profile */}
      <div className="flex items-center gap-6 mb-10 bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
        <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center border-2 border-yellow-500/50">
          <UserIcon size={40} className="text-zinc-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2 uppercase">
            {currentUser?.username || "GUEST"} <Shield size={18} className="text-yellow-500" />
          </h1>
          <p className="text-zinc-500 font-mono text-sm mt-1">ID Mật: #{currentUser?.id}</p>
        </div>
      </div>

      <TabNavigation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="text-center text-zinc-500 font-mono py-10 animate-pulse">
            Đang trích xuất dữ liệu...
          </div>
        ) : codes.length > 0 ? (
          <>
            {codes.map(code => (
              <CodeCard key={code.id} {...code} currentUserId={currentUser?.id} />
            ))}

            {page < totalPages && (
              <button
                onClick={() => setPage(prev => prev + 1)}
                disabled={isLoadingMore}
                className="mt-4 w-full py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-yellow-500 font-bold hover:bg-zinc-800 transition-colors disabled:opacity-50"
              >
                {isLoadingMore ? 'Đang trích xuất...' : 'Còn nữa hả'}
              </button>
            )}
          </>
        ) : (
          <div className="text-center py-10 text-zinc-600 font-mono text-sm border border-dashed border-zinc-800 rounded-xl">
            {activeTab === 'watched'
              ? 'Bạn chưa "thẩm" code nào.'
              : 'Sao còn chưa share code nữa ?'}
          </div>
        )}
      </div>
    </main>
  );
}