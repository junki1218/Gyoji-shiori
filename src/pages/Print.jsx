import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShiori } from '../context/ShioriContext';
import { Printer, ArrowLeft } from 'lucide-react';
import { t } from '../utils/i18n';

export default function Print() {
  const { data } = useShiori();
  const { useKanji } = data.settings;
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => window.print(), 600);
    return () => clearTimeout(timer);
  }, []);

  const totalSpent = data.pocketMoney.expenses.reduce((acc, cur) => acc + cur.cost, 0);
  const remaining = data.pocketMoney.budget - totalSpent;
  const seatRows = Array.from({ length: data.seats.rows }, (_, i) => i);
  const seatCols = Array.from({ length: data.seats.cols }, (_, i) => i);
  const tripTitle = data.dateTime.title || t(useKanji, '修学旅行のしおり', 'しゅうがくりょこうの しおり');
  const dateRange = data.dateTime.startDate
    ? `${data.dateTime.startDate}${data.dateTime.endDate ? ` ～ ${data.dateTime.endDate}` : ''}`
    : '';

  return (
    <>
      {/* Toolbar – screen only */}
      <div className="pt-toolbar">
        <button className="btn btn-secondary" onClick={() => navigate('/preview')}>
          <ArrowLeft size={18} />
          {t(useKanji, 'プレビューへ戻る', 'ぷれびゅーへ もどる')}
        </button>
        <span className="pt-hint">
          <Printer size={15} />
          {t(useKanji, '印刷ダイアログが自動で開きます', 'いんさつ だいありが じどうで ひらきます')}
        </span>
        <button className="btn btn-primary" onClick={() => window.print()}>
          <Printer size={16} />
          {t(useKanji, 'もう一度印刷', 'もういちど いんさつ')}
        </button>
      </div>

      {/* Printable booklet */}
      <div className="pt-book">

        {/* ===== 表紙 ===== */}
        <div className="pt-page pt-cover">
          <div className="pt-spine" />
          <div className="pt-cover-wrap">
            <div className="pt-cover-bar">
              <span className="pt-cover-bar-text">
                {t(useKanji, '行事のしおり', 'ぎょうじの しおり')}
              </span>
            </div>
            <div className="pt-cover-body">
              <p className="pt-cover-kicker">{t(useKanji, '行事のしおり', 'ぎょうじの しおり')}</p>
              <h1 className="pt-cover-title">{tripTitle}</h1>
              <p className="pt-cover-ornament">❖ ❖ ❖</p>
              {(dateRange || data.destination.name || data.dateTime.meetingTime) && (
                <div className="pt-cover-info">
                  {dateRange && (
                    <div className="pt-cover-row">
                      <span className="pt-cover-label">{t(useKanji, '日　程', 'にってい')}</span>
                      <span>{dateRange}</span>
                    </div>
                  )}
                  {data.destination.name && (
                    <div className="pt-cover-row">
                      <span className="pt-cover-label">{t(useKanji, '行き先', 'いきさき')}</span>
                      <span>{data.destination.name}</span>
                    </div>
                  )}
                  {data.dateTime.meetingTime && (
                    <div className="pt-cover-row">
                      <span className="pt-cover-label">{t(useKanji, '集　合', 'しゅうごう')}</span>
                      <span>{data.dateTime.meetingTime}{data.dateTime.meetingPlace ? `　${data.dateTime.meetingPlace}` : ''}</span>
                    </div>
                  )}
                </div>
              )}
              {data.goals.classGoal && (
                <div className="pt-cover-slogan">
                  <span className="pt-slogan-kicker">{t(useKanji, '〜 スローガン 〜', '〜 すろーがん 〜')}</span>
                  <p className="pt-slogan-text">「{data.goals.classGoal}」</p>
                </div>
              )}
            </div>
            <div className="pt-cover-bar pt-cover-bar-bottom" />
          </div>
        </div>

        {/* ===== 日程表 ===== */}
        {data.schedule.length > 0 && (
          <div className="pt-page">
            <div className="pt-spine" />
            <div className="pt-inner">
              <h2 className="pt-h2">{t(useKanji, '日程表', 'にっていひょう')}</h2>
              <table className="pt-table">
                <thead>
                  <tr>
                    <th style={{ width: '22%' }}>{t(useKanji, '日付', 'ひづけ')}</th>
                    <th style={{ width: '14%' }}>{t(useKanji, '時間', 'じかん')}</th>
                    <th>{t(useKanji, '活動内容', 'かつどう ないよう')}</th>
                  </tr>
                </thead>
                <tbody>
                  {[...data.schedule].sort((a, b) => {
                    if (a.date !== b.date) return a.date.localeCompare(b.date);
                    return a.time.localeCompare(b.time);
                  }).map(ev => (
                    <tr key={ev.id}>
                      <td>{ev.date}</td>
                      <td>{ev.time}</td>
                      <td>{ev.activity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===== 持ち物 & 行き先・部屋 ===== */}
        <div className="pt-page">
          <div className="pt-spine" />
          <div className="pt-inner pt-grid2">
            {data.belongings.length > 0 && (
              <div>
                <h2 className="pt-h2">{t(useKanji, '持ち物リスト', 'もちもの りすと')}</h2>
                <ul className="pt-list">
                  {data.belongings.map(item => (
                    <li key={item.id}>
                      <span className="pt-chk" />
                      <span style={{ flex: 1 }}>{item.name}</span>
                      {item.isEssential && <span className="pt-badge">{t(useKanji, '必須', 'ひっす')}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              {data.destination.name && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <h2 className="pt-h2">{t(useKanji, '行き先', 'いきさき')}</h2>
                  <div className="pt-infobox">
                    <strong>{data.destination.name}</strong>
                    {data.destination.address && <p style={{ fontSize: '0.78rem', color: '#555', marginTop: '0.2rem' }}>{data.destination.address}</p>}
                    {data.destination.description && <p style={{ marginTop: '0.4rem', fontSize: '0.83rem' }}>{data.destination.description}</p>}
                  </div>
                </div>
              )}
              {(data.room.roomNumber || data.room.members.length > 0) && (
                <div>
                  <h2 className="pt-h2">{t(useKanji, '宿泊部屋', 'しゅくはく へや')}</h2>
                  <div className="pt-infobox">
                    {data.room.roomNumber && <p><strong>{t(useKanji, '部屋:', 'へや:')}</strong> {data.room.roomNumber}</p>}
                    {data.room.members.length > 0 && <p><strong>{t(useKanji, 'メンバー:', 'めんばー:')}</strong> {data.room.members.join('、')}</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===== 座席表 ===== */}
        {Object.keys(data.seats.assignments).length > 0 && (
          <div className="pt-page">
            <div className="pt-spine" />
            <div className="pt-inner">
              <h2 className="pt-h2">
                {data.seats.transportType === 'bus'
                  ? t(useKanji, 'バス座席表', 'ばす ざせきひょう')
                  : t(useKanji, '電車座席表', 'でんしゃ ざせきひょう')}
              </h2>
              {data.seats.transportType === 'bus' && (
                <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#666', marginBottom: '0.5rem' }}>
                  {t(useKanji, '▲ 前方 / 運転席', '▲ ぜんぽう / うんてんせき')}
                </p>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                {seatRows.map(row => (
                  <div key={row} style={{ display: 'flex', gap: '4px' }}>
                    {seatCols.map(col => {
                      const isAisle = data.seats.cols > 3 && col === Math.floor(data.seats.cols / 2);
                      return (
                        <React.Fragment key={col}>
                          {isAisle && <div style={{ width: '14px' }} />}
                          <div className="pt-seat">
                            {data.seats.assignments[`${row}-${col}`] || `${row + 1}-${String.fromCharCode(65 + col)}`}
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== かかり & メモ ===== */}
        <div className="pt-page">
          <div className="pt-spine" />
          <div className="pt-inner">
            {data.roles.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 className="pt-h2">{t(useKanji, '係（役割）', 'かかり（やくわり）')}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  {data.roles.map(r => (
                    <div key={r.id} className="pt-role">
                      <span className="pt-role-name">{r.roleName}</span>
                      <span className="pt-role-person">{r.personName || '　'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div>
              <h2 className="pt-h2">{t(useKanji, 'メモ・連絡事項', 'めも・れんらく じこう')}</h2>
              <div className="pt-memo">
                {data.memo
                  ? <p style={{ whiteSpace: 'pre-wrap' }}>{data.memo}</p>
                  : Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} style={{ borderBottom: '1px dotted #bbb', height: '2.1rem' }} />
                    ))
                }
              </div>
            </div>
          </div>
        </div>

        {/* ===== お小遣い帳 ===== */}
        {(data.pocketMoney.budget > 0 || data.pocketMoney.expenses.length > 0) && (
          <div className="pt-page">
            <div className="pt-spine" />
            <div className="pt-inner">
              <h2 className="pt-h2">{t(useKanji, 'お小遣い帳', 'おこづかいちょう')}</h2>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                <div className="pt-money-card">
                  <span>{t(useKanji, '予算', 'よさん')}</span>
                  <strong>¥{data.pocketMoney.budget.toLocaleString()}</strong>
                </div>
                <div className="pt-money-card">
                  <span>{t(useKanji, '使用額', 'しようがく')}</span>
                  <strong>¥{totalSpent.toLocaleString()}</strong>
                </div>
                <div className="pt-money-card" style={{ borderColor: remaining >= 0 ? '#22c55e' : '#ef4444' }}>
                  <span>{t(useKanji, '残り', 'のこり')}</span>
                  <strong style={{ color: remaining >= 0 ? '#166534' : '#dc2626' }}>¥{remaining.toLocaleString()}</strong>
                </div>
              </div>
              <table className="pt-table">
                <thead>
                  <tr>
                    <th>{t(useKanji, '品物', 'しなもの')}</th>
                    <th style={{ textAlign: 'right', width: '30%' }}>{t(useKanji, '金額', 'きんがく')}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.pocketMoney.expenses.map(ex => (
                    <tr key={ex.id}>
                      <td>{ex.item}</td>
                      <td style={{ textAlign: 'right' }}>¥{ex.cost.toLocaleString()}</td>
                    </tr>
                  ))}
                  {Array.from({ length: Math.max(0, 10 - data.pocketMoney.expenses.length) }).map((_, i) => (
                    <tr key={`e${i}`}><td style={{ height: '1.8rem' }} /><td /></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===== フリーページ ===== */}
        {data.customPages.filter(p => p.content).map(page => (
          <div className="pt-page" key={page.id}>
            <div className="pt-spine" />
            <div className="pt-inner">
              <h2 className="pt-h2">{page.title}</h2>
              <p style={{ whiteSpace: 'pre-wrap', fontSize: '0.88rem', lineHeight: '1.9' }}>{page.content}</p>
            </div>
          </div>
        ))}

        {/* ===== 裏表紙 ===== */}
        <div className="pt-page pt-cover pt-back-cover">
          <div className="pt-spine" />
          <div className="pt-cover-wrap">
            <div className="pt-cover-bar" />
            <div className="pt-cover-body pt-back-body">
              <p className="pt-back-ornament">✦</p>
              <p className="pt-cover-kicker">{t(useKanji, '行事のしおり', 'ぎょうじの しおり')}</p>
              <h2 className="pt-back-title">{tripTitle}</h2>
              {dateRange && <p className="pt-back-date">{dateRange}</p>}
              <div className="pt-back-divider" />
              <p className="pt-back-message">
                {t(useKanji, 'すてきな旅の思い出をたくさん作ろう', 'すてきな たびの おもいでを たくさん つくろう')}
              </p>
              <p className="pt-back-ornament" style={{ opacity: 0.25 }}>✦</p>
            </div>
            <div className="pt-cover-bar pt-cover-bar-bottom" />
          </div>
        </div>

      </div>

      <style>{PRINT_STYLES}</style>
    </>
  );
}

const PRINT_STYLES = `
  /* ── Toolbar (screen only) ── */
  .pt-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.65rem 1rem;
    margin-bottom: 1.5rem;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.18);
    border-radius: 4px;
    color: rgba(255,255,255,0.9);
  }
  .pt-hint {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.83rem;
    color: rgba(255,255,255,0.55);
  }

  /* ── Book container ── */
  .pt-book {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }

  /* ── Page (A4 portrait) ── */
  .pt-page {
    width: 210mm;
    min-height: 297mm;
    background: #fff;
    display: flex;
    box-shadow: 5px 5px 20px rgba(0,0,0,0.35), -2px 0 8px rgba(0,0,0,0.15);
    page-break-after: always;
    break-after: page;
    overflow: hidden;
    position: relative;
  }

  /* ── Spine / binding strip ── */
  .pt-spine {
    width: 7mm;
    flex-shrink: 0;
    background: linear-gradient(to right, #0d2820 0%, #1a3c34 55%, #2d5545 100%);
    position: relative;
  }
  .pt-spine::after {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 1px; height: 100%;
    background: rgba(255,255,255,0.12);
  }

  /* ── Inner content (non-cover pages) ── */
  .pt-inner {
    flex: 1;
    padding: 11mm 10mm 10mm 8mm;
    overflow: hidden;
    color: #111;
  }
  .pt-grid2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  /* ── Section heading ── */
  .pt-h2 {
    font-size: 1rem !important;
    font-weight: 700 !important;
    color: #1a3c34 !important;
    border-bottom: 2px solid #1a3c34 !important;
    padding-bottom: 0.28rem !important;
    margin-bottom: 0.6rem !important;
    text-shadow: none !important;
    display: block !important;
  }

  /* ── Table ── */
  .pt-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.82rem;
    color: #111;
  }
  .pt-table th, .pt-table td {
    border: 1px solid #ccc;
    padding: 0.28rem 0.45rem;
    vertical-align: middle;
  }
  .pt-table th {
    background: #f0fdf4;
    text-align: center;
    color: #1a3c34;
    font-weight: 700;
  }

  /* ── Belongings ── */
  .pt-list { list-style: none; padding: 0; }
  .pt-list li {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.18rem 0;
    border-bottom: 1px dotted #ddd;
    font-size: 0.82rem;
    color: #111;
  }
  .pt-chk {
    display: inline-block;
    width: 0.85rem; height: 0.85rem;
    border: 1.5px solid #333;
    flex-shrink: 0;
  }
  .pt-badge {
    font-size: 0.6rem;
    color: #dc2626;
    background: #fee2e2;
    padding: 0.08rem 0.22rem;
    border-radius: 2px;
    white-space: nowrap;
  }

  /* ── Info box ── */
  .pt-infobox {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    padding: 0.5rem 0.75rem;
    font-size: 0.82rem;
    line-height: 1.7;
    color: #111;
  }

  /* ── Seat cell ── */
  .pt-seat {
    width: 46px; height: 27px;
    border: 1px solid #aaa;
    border-radius: 3px;
    background: #f0fdf4;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.66rem;
    text-align: center;
    overflow: hidden;
    color: #111;
  }

  /* ── Roles ── */
  .pt-role {
    display: flex;
    flex-direction: column;
    padding: 0.3rem 0.55rem;
    border: 1px solid #ddd;
    border-radius: 3px;
    background: #f9fafb;
  }
  .pt-role-name { font-size: 0.68rem; font-weight: bold; color: #555; }
  .pt-role-person { font-size: 0.85rem; margin-top: 0.1rem; color: #111; }

  /* ── Memo ── */
  .pt-memo {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 0.5rem 0.75rem;
    min-height: 60mm;
    font-size: 0.85rem;
    color: #111;
  }

  /* ── Pocket money ── */
  .pt-money-card {
    flex: 1;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 0.45rem;
    text-align: center;
    background: #f9fafb;
    display: flex;
    flex-direction: column;
    gap: 0.12rem;
  }
  .pt-money-card span { font-size: 0.68rem; color: #666; }
  .pt-money-card strong { font-size: 0.95rem; color: #111; }

  /* ── Cover shared ── */
  .pt-cover-wrap {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 297mm;
  }
  .pt-cover-bar {
    height: 32mm;
    background: #1a3c34;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .pt-cover-bar-bottom { height: 18mm; }
  .pt-cover-bar-text {
    color: rgba(255,255,255,0.65);
    font-size: 0.78rem;
    letter-spacing: 0.45em;
  }
  .pt-cover-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.1rem;
    padding: 1.5rem 2.5rem;
    text-align: center;
    color: #111;
  }
  .pt-cover-kicker {
    font-size: 0.72rem;
    letter-spacing: 0.42em;
    color: #777;
    border: 1px solid #1a3c34;
    padding: 0.18rem 0.85rem;
  }
  .pt-cover-title {
    font-size: 2.3rem !important;
    font-weight: 700 !important;
    color: #1a3c34 !important;
    line-height: 1.35;
    margin: 0 !important;
    text-shadow: none !important;
    border: none !important;
    display: block !important;
    padding: 0 !important;
    letter-spacing: 0.05em;
  }
  .pt-cover-ornament {
    color: #1a3c34;
    font-size: 0.95rem;
    letter-spacing: 0.65em;
    opacity: 0.45;
    margin: 0;
  }
  .pt-cover-info {
    background: #f0fdf4;
    border: 1px solid #1a3c34;
    border-radius: 6px;
    padding: 0.85rem 1.4rem;
    width: 100%;
    max-width: 290px;
    text-align: left;
  }
  .pt-cover-row {
    display: flex;
    gap: 0.75rem;
    font-size: 0.86rem;
    margin-bottom: 0.45rem;
    align-items: baseline;
    color: #111;
  }
  .pt-cover-row:last-child { margin-bottom: 0; }
  .pt-cover-label {
    font-weight: 700;
    color: #1a3c34;
    white-space: nowrap;
    min-width: 3.4em;
  }
  .pt-cover-slogan {
    background: #1a3c34;
    color: #fff;
    padding: 0.8rem 1.75rem;
    border-radius: 6px;
    text-align: center;
    width: 100%;
    max-width: 310px;
  }
  .pt-slogan-kicker {
    font-size: 0.7rem;
    letter-spacing: 0.15em;
    opacity: 0.72;
  }
  .pt-slogan-text {
    font-size: 1.05rem;
    margin-top: 0.35rem;
    font-weight: 500;
  }

  /* ── Back cover ── */
  .pt-back-body { gap: 0.9rem; }
  .pt-back-ornament {
    font-size: 1.6rem;
    color: #1a3c34;
    opacity: 0.38;
    margin: 0;
  }
  .pt-back-title {
    font-size: 1.75rem !important;
    font-weight: 700 !important;
    color: #1a3c34 !important;
    margin: 0 !important;
    text-shadow: none !important;
    border: none !important;
    display: block !important;
    letter-spacing: 0.05em;
  }
  .pt-back-date {
    font-size: 0.86rem;
    color: #555;
    margin: 0;
  }
  .pt-back-divider {
    width: 50px;
    height: 2px;
    background: #1a3c34;
    opacity: 0.35;
  }
  .pt-back-message {
    font-size: 0.92rem;
    color: #444;
    letter-spacing: 0.1em;
    margin: 0;
  }

  /* ── Print media ── */
  @page {
    size: A4 portrait;
    margin: 0;
  }

  @media print {
    * { animation: none !important; transition: none !important; }

    body { background: white !important; }

    h1, h2, h3, h4, h5, h6 {
      color: #111 !important;
      text-shadow: none !important;
    }

    .app-container { display: block !important; }
    .sidebar, .page-nav { display: none !important; }
    .main-content {
      margin: 0 !important;
      padding: 0 !important;
      max-width: none !important;
      overflow: visible !important;
    }
    .glass-panel {
      box-shadow: none !important;
      border: none !important;
      padding: 0 !important;
      background: transparent !important;
    }
    .glass-panel::after { display: none !important; }

    .pt-toolbar { display: none !important; }

    .pt-book {
      padding: 0;
      gap: 0;
      display: block;
    }

    .pt-page {
      width: 210mm;
      height: 297mm;
      min-height: 297mm;
      box-shadow: none;
      page-break-after: always;
      break-after: page;
      overflow: hidden;
      display: flex;
    }

    .pt-page:last-child {
      page-break-after: avoid;
      break-after: avoid;
    }

    .pt-cover-wrap { min-height: 297mm; }

    .pt-cover-title { color: #1a3c34 !important; }
    .pt-back-title  { color: #1a3c34 !important; }
    .pt-h2          { color: #1a3c34 !important; }
  }
`;
