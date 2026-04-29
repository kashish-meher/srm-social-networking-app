import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import MessagesPage from './pages/MessagesPage';
import MyDetailsPage from './pages/MyDetailsPage';
import NotificationsPage from './pages/NotificationsPage';
import MyPostsPage from './pages/MyPostsPage';
import SettingsPage from './pages/SettingsPage';
import CreatePostPage from './pages/CreatePostPage';
import FeedbackPage from './pages/FeedbackPage';

// ✅ Socket created ONCE at module level — lives for entire app session
export const socket = io('http://localhost:5000');

function App() {
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?._id) {
      socket.emit('addUser', user._id);
      console.log('✅ Socket registered for user:', user._id);
    }

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
      // Re-register user on reconnect
      const u = JSON.parse(localStorage.getItem('user') || '{}');
      if (u?._id) socket.emit('addUser', u._id);
    });

    return () => {
      socket.off('connect');
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/mydetails" element={<MyDetailsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/uploadpost" element={<CreatePostPage />} />
        <Route path="/myposts" element={<MyPostsPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;