import React, { useEffect, useRef } from 'react';
import { Routes, Route, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  BookOpen, Calendar, MapPin, Target, Backpack, Clock,
  Bus, Home, FileText, Wallet, Users, FilePlus, Printer, Trash2, Settings as SettingsIcon,
  ChevronLeft, ChevronRight
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
import Print from './pages/Print';
import Settings from './pages/Settings';

function Sidebar() {
  const { data, resetData } = useShiori();
  const { useKanji } = data.settings;
  const navigate = useNavigate();

  const handleReset = () => {
    resetData();
    navigate('/');
  };

  const navItems = [
    { to: "/", icon: <Calendar size={20} />, label: useKanji ? "1. 日時" : "1. にちじ" },
    { to: "/destination", icon: <MapPin size={20} />, label: useKanji ? "2. 行き先" : "2. いきさき" },
    { to: "/goals", icon: <Target size={20} />, label: useKanji ? "3. 目標" : "3. もくひょう" },
    { to: "/belongings", icon: <Backpack size={20} />, label: useKanji ? "4. もちもの" : "4. もちもの" },
    { to: "/schedule", icon: <Clock size={20} />, label: useKanji ? "5. スケジュール" : "5. スケジュール" },
    { to: "/seats", icon: <Bus size={20} />, label: useKanji ? "6. 座席" : "6. ざせき" },
    { to: "/room", icon: <Home size={20} />, label: useKanji ? "7. 泊まる部屋" : "7. とまるへや" },
    { to: "/memo", icon: <FileText size={20} />, label: useKanji ? "8. メモ" : "8. めも" },
    { to: "/pocket-money", icon: <Wallet size={20} />, label: useKanji ? "9. お小遣い帳" : "9. おこづかいちょう" },
    { to: "/roles", icon: <Users size={20} />, label: useKanji ? "10. かかり" : "10. かかり" },
    { to: "/custom/11", icon: <FilePlus size={20} />, label: useKanji ? "11. フリーページ1" : "11. ふりーぺーじ1" },
    { to: "/custom/12", icon: <FilePlus size={20} />, label: useKanji ? "12. フリーページ2" : "12. ふりーぺーじ2" },
    { to: "/custom/13", icon: <FilePlus size={20} />, label: useKanji ? "13. フリーページ3" : "13. ふりーぺーじ3" },
    { to: "/custom/14", icon: <FilePlus size={20} />, label: useKanji ? "14. フリーページ4" : "14. ふりーぺーじ4" },
    { to: "/custom/15", icon: <FilePlus size={20} />, label: useKanji ? "15. フリーページ5" : "15. ふりーぺーじ5" },
  ];

  return (
    <aside className="sidebar">
      <div className="flex items-center gap-2 mb-6 px-2">
        <BookOpen size={28} color="var(--primary)" />
        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>{useKanji ? 'しおりメーカー' : 'しおりめーかー'}</h2>
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
        <NavLink to="/settings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} style={{ marginBottom: '0.5rem' }}>
          <SettingsIcon size={20} />
          {useKanji ? '設定' : 'せってい'}
        </NavLink>
        <NavLink to="/preview" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} style={{ marginBottom: '0.5rem', background: 'var(--primary-light)', color: 'var(--primary)' }}>
          <Printer size={20} />
          {useKanji ? '完成プレビュー' : 'かんせいぷれびゅー'}
        </NavLink>
        <NavLink to="/print" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} style={{ marginBottom: '0.5rem', background: 'rgba(45,96,80,0.35)', color: '#81C784' }}>
          <Printer size={20} />
          {useKanji ? '印刷' : 'いんさつ'}
        </NavLink>
        <button onClick={handleReset} className="btn btn-danger" style={{ width: '100%' }}>
          <Trash2 size={18} />
          {useKanji ? 'データリセット' : 'でーたりせっと'}
        </button>
      </div>
    </aside>
  );
}

const PAGE_ROUTES = [
  "/", "/destination", "/goals", "/belongings", "/schedule",
  "/seats", "/room", "/memo", "/pocket-money", "/roles",
  "/custom/11", "/custom/12", "/custom/13", "/custom/14", "/custom/15",
];

function PageNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = useShiori();
  const { useKanji } = data.settings;
  const currentIndex = PAGE_ROUTES.indexOf(location.pathname);

  if (currentIndex === -1) return null;

  const prev = currentIndex > 0 ? PAGE_ROUTES[currentIndex - 1] : null;
  const next = currentIndex < PAGE_ROUTES.length - 1 ? PAGE_ROUTES[currentIndex + 1] : "/preview";

  return (
    <div className="page-nav flex justify-between mt-8 pt-4" style={{ borderTop: '1px dashed var(--border)' }}>
      {prev ? (
        <button className="btn btn-secondary" onClick={() => navigate(prev)}>
          <ChevronLeft size={18} /> {useKanji ? '前のページ' : 'まえの ぺーじ'}
        </button>
      ) : <span />}
      <button className="btn btn-primary" onClick={() => navigate(next)}>
        {next === "/preview"
          ? (useKanji ? 'プレビューへ' : 'ぷれびゅーへ')
          : (useKanji ? '次のページ' : 'つぎの ぺーじ')}
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

function App() {
  const { data, bgmUrl } = useShiori();
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      if (data.settings.bgmEnabled && bgmUrl) {
        audioRef.current.play().catch(e => console.log('BGM playback failed:', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [data.settings.bgmEnabled, bgmUrl]);

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
            <Route path="/print" element={<Print />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
          <PageNav />
        </div>
      </main>
      {bgmUrl && (
        <audio ref={audioRef} src={bgmUrl} loop />
      )}
    </div>
  );
}

export default App;
