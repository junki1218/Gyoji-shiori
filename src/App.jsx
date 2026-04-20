import React from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { 
  BookOpen, Calendar, MapPin, Target, Backpack, Clock, 
  Bus, Home, FileText, Wallet, Users, FilePlus, Printer, Trash2 
} from 'lucide-react';
import { useShiori } from './context/ShioriContext';

// Import Pages
import Page1DateTime from './pages/Page1_DateTime';
import Page2Destination from './pages/Page2_Destination';
import Page3Goals from './pages/Page3_Goals';
import Page4Belongings from './pages/Page4_Belongings';
import Page5Schedule from './pages/Page5_Schedule';
import Page6Seats from './pages/Page6_Seats';
import Page7Room from './pages/Page7_Room';
import Page8Memo from './pages/Page8_Memo';
import Page9PocketMoney from './pages/Page9_PocketMoney';
import Page10Roles from './pages/Page10_Roles';
import PageCustom from './pages/PageCustom';
import Preview from './pages/Preview';

function Sidebar() {
  const { resetData } = useShiori();
  const navigate = useNavigate();

  const handleReset = () => {
    resetData();
    navigate('/');
  };

  const navItems = [
    { to: "/", icon: <Calendar size={20} />, label: "1. 日時" },
    { to: "/destination", icon: <MapPin size={20} />, label: "2. 行き先" },
    { to: "/goals", icon: <Target size={20} />, label: "3. 目標" },
    { to: "/belongings", icon: <Backpack size={20} />, label: "4. もちもの" },
    { to: "/schedule", icon: <Clock size={20} />, label: "5. スケジュール" },
    { to: "/seats", icon: <Bus size={20} />, label: "6. 座席" },
    { to: "/room", icon: <Home size={20} />, label: "7. 泊まる部屋" },
    { to: "/memo", icon: <FileText size={20} />, label: "8. メモ" },
    { to: "/pocket-money", icon: <Wallet size={20} />, label: "9. お小遣い帳" },
    { to: "/roles", icon: <Users size={20} />, label: "10. かかり" },
    { to: "/custom/11", icon: <FilePlus size={20} />, label: "11. フリーページ1" },
    { to: "/custom/12", icon: <FilePlus size={20} />, label: "12. フリーページ2" },
    { to: "/custom/13", icon: <FilePlus size={20} />, label: "13. フリーページ3" },
    { to: "/custom/14", icon: <FilePlus size={20} />, label: "14. フリーページ4" },
    { to: "/custom/15", icon: <FilePlus size={20} />, label: "15. フリーページ5" },
  ];

  return (
    <aside className="sidebar">
      <div className="flex items-center gap-2 mb-6 px-2">
        <BookOpen size={28} color="var(--primary)" />
        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>しおりメーカー</h2>
      </div>

      <nav className="flex-col gap-2 flex" style={{ flex: 1 }}>
        {navItems.map((item) => (
          <NavLink 
            key={item.to} 
            to={item.to} 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-8 pt-4 border-t" style={{ borderTop: '1px solid var(--border)' }}>
        <NavLink to="/preview" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} style={{ marginBottom: '0.5rem', background: 'var(--primary-light)', color: 'var(--primary)' }}>
          <Printer size={20} />
          完成プレビュー
        </NavLink>
        <button onClick={handleReset} className="btn btn-danger" style={{ width: '100%' }}>
          <Trash2 size={18} />
          データリセット
        </button>
      </div>
    </aside>
  );
}

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <div className="glass-panel">
          <Routes>
            <Route path="/" element={<Page1DateTime />} />
            <Route path="/destination" element={<Page2Destination />} />
            <Route path="/goals" element={<Page3Goals />} />
            <Route path="/belongings" element={<Page4Belongings />} />
            <Route path="/schedule" element={<Page5Schedule />} />
            <Route path="/seats" element={<Page6Seats />} />
            <Route path="/room" element={<Page7Room />} />
            <Route path="/memo" element={<Page8Memo />} />
            <Route path="/pocket-money" element={<Page9PocketMoney />} />
            <Route path="/roles" element={<Page10Roles />} />
            <Route path="/custom/:id" element={<PageCustom />} />
            <Route path="/preview" element={<Preview />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
