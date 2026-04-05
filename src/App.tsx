import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import UploadModal from './components/UploadModal';
import AuthModal from './components/AuthModal';
import Feed from './pages/Feed';
import UserProfile from './pages/UserProfile';
import { type User } from './api/authApi';
import ScrollToTop from './components/ScrollToTop';
import { Toaster } from 'react-hot-toast';
import Leaderboard from './pages/Leaderboard';
import { useParams, useNavigate } from 'react-router-dom';

function ProfileWrapper({ currentUserId }: { currentUserId: number }) {
  const { id } = useParams(); // Lấy cái số (ID) trên thanh địa chỉ URL
  const navigate = useNavigate();

  return (
    <UserProfile
      targetUserId={Number(id)} // ID của chủ nhà (lấy từ link)
      currentUserId={currentUserId} // ID của người đang xem (để check isOwner)
      onBack={() => navigate(-1)} // Bấm quay lại thì lùi 1 trang (như nút Back của trình duyệt)
      onOpenComments={(id) => console.log("Mở bình luận:", id)}
    />
  );
}

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Đã xóa biến isViewingProfile dư thừa đi rồi nhé!

  useEffect(() => {
    const savedUser = localStorage.getItem('vault_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-black text-zinc-100 relative overflow-hidden">
        {/* --- HIỆU ỨNG ÁNH SÁNG NỀN (AMBIENT GLOW) --- */}
        {/* Đèn góc trên bên trái */}
        <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-yellow-600/10 blur-[120px] pointer-events-none z-0"></div>
        {/* Đèn góc dưới bên phải */}
        <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-orange-600/10 blur-[120px] pointer-events-none z-0"></div>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#18181b',
              color: '#f4f4f5',
              border: '1px solid #27272a',
            },
            success: {
              iconTheme: { primary: '#eab308', secondary: '#000' },
            },
          }}
        />

        {!currentUser && <AuthModal onLoginSuccess={setCurrentUser} />}

        <Header onOpenUpload={() => setIsModalOpen(true)} currentUser={currentUser} />

        <Routes>
          <Route path="/" element={<Feed currentUserId={currentUser?.id} />} />

          {/* --- TRẠM KIỂM SOÁT URL: /profile SẼ GỌI DINH THỰ RA --- */}
          <Route
            path="/profile"
            element={
              currentUser ? (
                <UserProfile
                  targetUserId={currentUser.id}
                  currentUserId={currentUser.id}
                  // Dùng window.location để điều hướng về trang chủ
                  onBack={() => window.location.href = '/'}
                  // Tạm thời mock logic mở comment, ta sẽ xử lý sâu hơn nếu cần
                  onOpenComments={(id) => console.log("Mở bình luận cho code:", id)}
                />
              ) : null
            }
          />

          <Route path="/leaderboard" element={<Leaderboard />} />

          <Route
            path="/profile/:id"
            element={currentUser ? <ProfileWrapper currentUserId={currentUser.id} /> : null}
          />
        </Routes>

        <UploadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          currentUserId={currentUser?.id}
        />
        <ScrollToTop />
      </div>
    </Router>
  );
}