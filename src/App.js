import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import Accommodations from './pages/Accommodations';
import Alumni from './pages/Alumni';
import MyPage from './pages/MyPage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/accommodations" element={<Accommodations />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/alumni" element={<Alumni />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;