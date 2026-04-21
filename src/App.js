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

function App() {
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