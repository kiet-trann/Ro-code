import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import UploadModal from './components/UploadModal';
import AuthModal from './components/AuthModal';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import { type User } from './api/authApi';
import ScrollToTop from './components/ScrollToTop';
import { Toaster } from 'react-hot-toast';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Khi web vừa load, kiểm tra xem trong LocalStorage có lưu user chưa
  useEffect(() => {
    const savedUser = localStorage.getItem('vault_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-black text-zinc-100">
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              background: '#18181b', // Màu zinc-900
              color: '#f4f4f5',      // Màu text zinc-100
              border: '1px solid #27272a', // Viền zinc-800
            },
            success: {
              iconTheme: { primary: '#eab308', secondary: '#000' }, // Icon màu vàng
            },
          }}
        />
        {/* Nếu chưa có User thì chặn ngay ngoài cửa bằng AuthModal */}
        {!currentUser && <AuthModal onLoginSuccess={setCurrentUser} />}

        <Header onOpenUpload={() => setIsModalOpen(true)} currentUser={currentUser} />

        {/* Truyền currentUser.id thật xuống Feed */}
        <Routes>
          <Route path="/" element={<Feed currentUserId={currentUser?.id} />} />
          <Route path="/profile" element={<Profile currentUser={currentUser} />} />
        </Routes>

        {/* Truyền currentUser.id thật xuống UploadModal */}
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