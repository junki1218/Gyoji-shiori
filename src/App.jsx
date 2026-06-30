import React, { useEffect, useRef, useState } from 'react';
import { Routes, Route, NavLink, useNavigate, useLocation } from 'react-router-dom';
// useLocation is used in Sidebar and PageNav components below
import {
  BookOpen, Calendar, MapPin, Target, Backpack, Clock,
  Bus, Home, FileText, Wallet, Users, FilePlus, Printer, Trash2,
  Settings as SettingsIcon, ChevronLeft, ChevronRight, Menu, X,
  RotateCcw, ALargeSmall
} from 'lucide-react';
import { useShiori } from './context/ShioriContext';

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

/* ── 文字サイズコントローラー ───────────────────── */
const FONT_SCALES = [0.8, 0.9, 1.0, 1.15, 1.3, 1.5];

function FontScaleController() {
  const { data, updateSettings } = useShiori();
  const fontScale = data.settings.fontScale ?? 1;
  const [open, setOpen] = useState(false);

  const idx = FONT_SCALES.reduce((best, s, i) =>
    Math.abs(s - fontScale) < Math.abs(FONT_SCALES[best] - fontScale) ? i : best, 1);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale * 16}px`;
  }, [fontScale]);

  const set = (newIdx) => {
    if (newIdx >= 0 && newIdx < FONT_SCALES.length) {
      updateSettings({ fontScale: FONT_SCALES[newIdx] });
    }
  };

  const pct = Math.round(FONT_SCALES[idx] * 100);

  return (
    <div className={`fsc-wrap${open ? ' fsc-open' : ''}`}>
      {/* トグルボタン */}
      <button
        className="fsc-toggle"
        onClick={() => setOpen(v => !v)}
        aria-label="文字サイズ"
        title="文字サイズ"
      >
        <ALargeSmall size={20} />
      </button>

      {/* パネル */}
      {open && (
        <div className="fsc-panel">
          <p className="fsc-label">文字サイズ</p>
          <div className="fsc-row">
            <button
              className="fsc-btn"
              onClick={() => set(idx - 1)}
              disabled={idx === 0}
              aria-label="文字を小さく"
            >
              A<sup>−</sup>
            </button>
            <span className="fsc-pct">{pct}%</span>
            <button
              className="fsc-btn"
              onClick={() => set(idx + 1)}
              disabled={idx === FONT_SCALES.length - 1}
              aria-label="文字を大きく"
            >
              A<sup>+</sup>
            </button>
          </div>
          {/* ステップインジケーター */}
          <div className="fsc-dots">
            {FONT_SCALES.map((_, i) => (
              <button
                key={i}
                className={`fsc-dot${i === idx ? ' fsc-dot-active' : ''}`}
                onClick={() => set(i)}
                aria-label={`${Math.round(FONT_SCALES[i] * 100)}%`}
              />
            ))}
          </div>
          {idx !== 2 && (
            <button className="fsc-reset" onClick={() => set(2)}>
              リセット
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ── 縦向き警告オーバーレイ ─────────────────────── */
function OrientationGuard() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const check = () => {
      const isPortrait = window.innerHeight > window.innerWidth;
      const isMobile = Math.min(window.innerWidth, window.innerHeight) < 768;
      setShow(isPortrait && isMobile);
    };

    check();
    window.addEventListener('resize', check);
    window.addEventListener('orientationchange', check);

    // 可能な場合は横向きにロック（Android PWA など）
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('landscape').catch(() => {});
    }

    return () => {
      window.removeEventListener('resize', check);
      window.removeEventListener('orientationchange', check);
    };
  }, []);

  if (!show) return null;

  return (
    <div className="orient-guard">
      <div className="orient-icon">
        <RotateCcw size={64} strokeWidth={1.5} />
      </div>
      <p className="orient-title">端末を横向きにしてください</p>
      <p className="orient-sub">Please rotate your device to landscape</p>
    </div>
  );
}

/* ── サイドバー ────────────────────────────────── */
function Sidebar({ isOpen, onClose }) {
  const { data, resetData } = useShiori();
  const { useKanji } = data.settings;
  const navigate = useNavigate();
  const location = useLocation();
  const activeRef = useRef(null);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [location.pathname]);

  const handleReset = () => {
    resetData();
    navigate('/');
    onClose();
  };

  const iconSize = 18;

  const navItems = [
    { to: '/', icon: <Calendar size={iconSize} />, label: useKanji ? '1. 日時' : '1. にちじ' },
    { to: '/destination', icon: <MapPin size={iconSize} />, label: useKanji ? '2. 行き先' : '2. いきさき' },
    { to: '/goals', icon: <Target size={iconSize} />, label: useKanji ? '3. 目標' : '3. もくひょう' },
    { to: '/belongings', icon: <Backpack size={iconSize} />, label: useKanji ? '4. もちもの' : '4. もちもの' },
    { to: '/schedule', icon: <Clock size={iconSize} />, label: useKanji ? '5. スケジュール' : '5. すけじゅーる' },
    { to: '/seats', icon: <Bus size={iconSize} />, label: useKanji ? '6. 座席' : '6. ざせき' },
    { to: '/room', icon: <Home size={iconSize} />, label: useKanji ? '7. 泊まる部屋' : '7. とまるへや' },
    { to: '/memo', icon: <FileText size={iconSize} />, label: useKanji ? '8. メモ' : '8. めも' },
    { to: '/pocket-money', icon: <Wallet size={iconSize} />, label: useKanji ? '9. お小遣い帳' : '9. おこづかいちょう' },
    { to: '/roles', icon: <Users size={iconSize} />, label: useKanji ? '10. かかり' : '10. かかり' },
    { to: '/custom/11', icon: <FilePlus size={iconSize} />, label: useKanji ? '11. フリーページ1' : '11. ふりーぺーじ1' },
    { to: '/custom/12', icon: <FilePlus size={iconSize} />, label: useKanji ? '12. フリーページ2' : '12. ふりーぺーじ2' },
    { to: '/custom/13', icon: <FilePlus size={iconSize} />, label: useKanji ? '13. フリーページ3' : '13. ふりーぺーじ3' },
    { to: '/custom/14', icon: <FilePlus size={iconSize} />, label: useKanji ? '14. フリーページ4' : '14. ふりーぺーじ4' },
    { to: '/custom/15', icon: <FilePlus size={iconSize} />, label: useKanji ? '15. フリーページ5' : '15. ふりーぺーじ5' },
  ];

  return (
    <>
      {/* モバイル用バックドロップ */}
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}

      <aside className={`sidebar${isOpen ? ' sidebar-open' : ''}`}>
        {/* モバイル用閉じるボタン */}
        <button className="sidebar-close-btn btn-icon" onClick={onClose} aria-label="メニューを閉じる">
          <X size={20} />
        </button>

        <NavLink to="/" onClick={onClose} style={{ textDecoration: 'none' }}>
          <div className="sidebar-brand">
            <BookOpen size={24} color="var(--primary)" />
            <h2 className="sidebar-title">
              {useKanji ? 'しおりメーカー' : 'しおりめーかー'}
            </h2>
          </div>
        </NavLink>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              ref={location.pathname === item.to ? activeRef : null}
            >
              {item.icon}
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <NavLink
            to="/settings"
            onClick={onClose}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            <SettingsIcon size={iconSize} />
            <span className="nav-label">{useKanji ? '設定' : 'せってい'}</span>
          </NavLink>
          <NavLink
            to="/preview"
            onClick={onClose}
            className={({ isActive }) => `nav-link nav-preview${isActive ? ' active' : ''}`}
          >
            <Printer size={iconSize} />
            <span className="nav-label">{useKanji ? '完成プレビュー' : 'かんせいぷれびゅー'}</span>
          </NavLink>
          <NavLink
            to="/print"
            onClick={onClose}
            className={({ isActive }) => `nav-link nav-print${isActive ? ' active' : ''}`}
          >
            <Printer size={iconSize} />
            <span className="nav-label">{useKanji ? '印刷' : 'いんさつ'}</span>
          </NavLink>
          <button onClick={handleReset} className="btn btn-danger" style={{ width: '100%', marginTop: '0.25rem' }}>
            <Trash2 size={16} />
            <span className="nav-label">{useKanji ? 'データリセット' : 'でーたりせっと'}</span>
          </button>
        </div>
      </aside>
    </>
  );
}

/* ── ページナビゲーション ────────────────────────── */
const PAGE_ROUTES = [
  '/', '/destination', '/goals', '/belongings', '/schedule',
  '/seats', '/room', '/memo', '/pocket-money', '/roles',
  '/custom/11', '/custom/12', '/custom/13', '/custom/14', '/custom/15',
];

function PageNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = useShiori();
  const { useKanji } = data.settings;
  const currentIndex = PAGE_ROUTES.indexOf(location.pathname);

  if (currentIndex === -1) return null;

  const prev = currentIndex > 0 ? PAGE_ROUTES[currentIndex - 1] : null;
  const next = currentIndex < PAGE_ROUTES.length - 1 ? PAGE_ROUTES[currentIndex + 1] : '/preview';

  return (
    <div className="page-nav flex justify-between mt-8 pt-4" style={{ borderTop: '1px dashed var(--border)' }}>
      {prev ? (
        <button className="btn btn-secondary" onClick={() => navigate(prev)}>
          <ChevronLeft size={18} />
          <span>{useKanji ? '前のページ' : 'まえの ぺーじ'}</span>
        </button>
      ) : <span />}
      <button className="btn btn-primary" onClick={() => navigate(next)}>
        <span>
          {next === '/preview'
            ? (useKanji ? 'プレビューへ' : 'ぷれびゅーへ')
            : (useKanji ? '次のページ' : 'つぎの ぺーじ')}
        </span>
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

/* ── App ────────────────────────────────────────── */
function App() {
  const { data, bgmUrl } = useShiori();
  const audioRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      if (data.settings.bgmEnabled && bgmUrl) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [data.settings.bgmEnabled, bgmUrl]);

  return (
    <>
      <OrientationGuard />
      <FontScaleController />
      <div className="app-container">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="main-content">
          {/* ハンバーガーボタン（モバイルのみ表示） */}
          <button
            className="hamburger-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="メニューを開く"
          >
            <Menu size={22} />
          </button>

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
      </div>
      {bgmUrl && <audio ref={audioRef} src={bgmUrl} loop />}
    </>
  );
}

export default App;
