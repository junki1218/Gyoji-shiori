import React from 'react';
import { useShiori } from '../context/ShioriContext';
import { Printer } from 'lucide-react';
import { t } from '../utils/i18n';

export default function Preview() {
  const { data } = useShiori();
  const { useKanji } = data.settings;

  const handlePrint = () => window.print();

  const totalSpent = data.pocketMoney.expenses.reduce((acc, cur) => acc + cur.cost, 0);
  const remaining = data.pocketMoney.budget - totalSpent;

  const seatRows = Array.from({ length: data.seats.rows }, (_, i) => i);
  const seatCols = Array.from({ length: data.seats.cols }, (_, i) => i);

  return (
    <div className="animation-fade-in">
      <div className="page-header flex justify-between items-center hide-on-print">
        <div>
          <h1>{t(useKanji, '完成プレビュー', 'かんせい ぷれびゅー')}</h1>
          <p className="text-muted">
            {t(useKanji, 'この画面を印刷（PDF保存）して「しおり」として配布できます。', 'この がめんを いんさつして 「しおり」として くばることが できます。')}
          </p>
        </div>
        <button className="btn btn-primary" onClick={handlePrint}>
          <Printer size={20} /> {t(useKanji, '印刷する', 'いんさつ する')}
        </button>
      </div>

      <div className="print-container">

        {/* 表紙 */}
        <div className="shiori-page cover-page">
          <h1 className="cover-title">{data.dateTime.title || t(useKanji, '修学旅行のしおり', 'しゅうがくりょこうの しおり')}</h1>
          <div className="cover-info">
            {data.dateTime.startDate && (
              <p>{t(useKanji, '日程：', 'にってい：')}{data.dateTime.startDate}{data.dateTime.endDate ? ` 〜 ${data.dateTime.endDate}` : ''}</p>
            )}
            {data.dateTime.meetingTime && (
              <p>{t(useKanji, '集合時間：', 'しゅうごう じかん：')}{data.dateTime.meetingTime}{data.dateTime.meetingPlace ? `　${data.dateTime.meetingPlace}` : ''}</p>
            )}
            {data.destination.name && (
              <p>{t(useKanji, '行き先：', 'いきさき：')}{data.destination.name}</p>
            )}
          </div>
          {(data.goals.classGoal || data.goals.personalGoal) && (
            <div className="goals-box">
              {data.goals.classGoal && (
                <>
                  <h3>{t(useKanji, 'スローガン', 'すろーがん')}</h3>
                  <p>{data.goals.classGoal}</p>
                </>
              )}
              {data.goals.personalGoal && (
                <>
                  <h3 style={{ marginTop: '1rem' }}>{t(useKanji, '個人の目標', 'こじんの もくひょう')}</h3>
                  <p>{data.goals.personalGoal}</p>
                </>
              )}
            </div>
          )}
        </div>

        {/* 日程表 */}
        {data.schedule.length > 0 && (
          <div className="shiori-page">
            <div className="section">
              <h2>{t(useKanji, '日程表', 'にっていひょう')}</h2>
              <table className="schedule-table">
                <thead>
                  <tr>
                    <th>{t(useKanji, '日付', 'ひづけ')}</th>
                    <th>{t(useKanji, '時間', 'じかん')}</th>
                    <th>{t(useKanji, '活動内容', 'かつどう ないよう')}</th>
                    <th>{t(useKanji, '写真', 'しゃしん')}</th>
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
                      <td>
                        {ev.image && <img src={ev.image} alt={ev.activity} style={{ width: '60px', height: '45px', objectFit: 'cover', borderRadius: '4px' }} />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 持ち物・行き先 */}
        <div className="shiori-page">
          <div className="print-grid-2">
            {data.belongings.length > 0 && (
              <div className="section">
                <h2>{t(useKanji, '持ち物リスト', 'もちもの りすと')}</h2>
                <ul className="belongings-list">
                  {data.belongings.map(item => (
                    <li key={item.id}>
                      <span className="checkbox" />
                      <span style={{ flex: 1 }}>{item.name}</span>
                      {item.isEssential && <strong className="essential-badge">{t(useKanji, '必須', 'ひっす')}</strong>}
                      {item.image && <img src={item.image} alt={item.name} style={{ width: '30px', height: '30px', objectFit: 'cover', borderRadius: '2px' }} />}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              {data.destination.name && (
                <div className="section mb-4">
                  <h2>{t(useKanji, '行き先', 'いきさき')}</h2>
                  <div className="info-box">
                    <p><strong>{data.destination.name}</strong></p>
                    {data.destination.address && <p style={{ fontSize: '0.85rem', color: '#666' }}>{data.destination.address}</p>}
                    {data.destination.description && <p style={{ marginTop: '0.5rem' }}>{data.destination.description}</p>}
                  </div>
                </div>
              )}

              {(data.room.roomNumber || data.room.members.length > 0) && (
                <div className="section">
                  <h2>{t(useKanji, '宿泊部屋', 'しゅくはく へや')}</h2>
                  <div className="info-box">
                    {data.room.roomNumber && <p><strong>{t(useKanji, '部屋:', 'へや:')}</strong> {data.room.roomNumber}</p>}
                    {data.room.members.length > 0 && (
                      <p><strong>{t(useKanji, 'メンバー:', 'めんばー:')}</strong> {data.room.members.join('、')}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 座席表 */}
        {Object.keys(data.seats.assignments).length > 0 && (
          <div className="shiori-page">
            <div className="section">
              <h2>
                {data.seats.transportType === 'bus'
                  ? t(useKanji, 'バス座席表', 'ばす ざせきひょう')
                  : t(useKanji, '電車座席表', 'でんしゃ ざせきひょう')}
              </h2>
              {data.seats.transportType === 'bus' && (
                <p className="seat-front-label">{t(useKanji, '▲ 前方 / 運転席', '▲ ぜんぽう / うんてんせき')}</p>
              )}
              <div className="seat-grid">
                {seatRows.map(row => (
                  <div key={row} className="seat-row">
                    {seatCols.map(col => {
                      const isAisle = data.seats.cols > 3 && col === Math.floor(data.seats.cols / 2);
                      return (
                        <React.Fragment key={col}>
                          {isAisle && <div className="seat-aisle" />}
                          <div className="seat-cell">
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

        {/* かかり・メモ */}
        <div className="shiori-page">
          {data.roles.length > 0 && (
            <div className="section">
              <h2>{t(useKanji, '係（役割）', 'かかり（やくわり）')}</h2>
              <div className="roles-grid">
                {data.roles.map(r => (
                  <div key={r.id} className="role-item">
                    <span className="role-name">{r.roleName}</span>
                    <span className="person-name">{r.personName || '　'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="section mt-4">
            <h2>{t(useKanji, 'メモ・連絡事項', 'めも・れんらく じこう')}</h2>
            <div className="memo-box">
              {data.memo
                ? <p style={{ whiteSpace: 'pre-wrap' }}>{data.memo}</p>
                : <div className="empty-lines"><hr/><hr/><hr/><hr/></div>
              }
            </div>
          </div>
        </div>

        {/* お小遣い帳 */}
        {(data.pocketMoney.budget > 0 || data.pocketMoney.expenses.length > 0) && (
          <div className="shiori-page">
            <div className="section">
              <h2>{t(useKanji, 'お小遣い帳', 'おこづかいちょう')}</h2>
              <div className="pocket-summary">
                <div className="pocket-card">
                  <span>{t(useKanji, '予算', 'よさん')}</span>
                  <strong>¥ {data.pocketMoney.budget.toLocaleString()}</strong>
                </div>
                <div className="pocket-card">
                  <span>{t(useKanji, '使用額', 'しようがく')}</span>
                  <strong>¥ {totalSpent.toLocaleString()}</strong>
                </div>
                <div className="pocket-card" style={{ borderColor: remaining >= 0 ? '#22c55e' : '#ef4444' }}>
                  <span>{t(useKanji, '残り', 'のこり')}</span>
                  <strong style={{ color: remaining >= 0 ? '#166534' : '#dc2626' }}>¥ {remaining.toLocaleString()}</strong>
                </div>
              </div>
              {data.pocketMoney.expenses.length > 0 && (
                <table className="schedule-table mt-4">
                  <thead>
                    <tr>
                      <th>{t(useKanji, '品物', 'しなもの')}</th>
                      <th style={{ textAlign: 'right' }}>{t(useKanji, '金額', 'きんがく')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.pocketMoney.expenses.map(ex => (
                      <tr key={ex.id}>
                        <td>{ex.item}</td>
                        <td style={{ textAlign: 'right' }}>¥ {ex.cost.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* フリーページ */}
        {data.customPages.filter(p => p.content || p.title !== `フリーページ ${p.id - 10}`).map(page => (
          page.content ? (
            <div className="shiori-page" key={page.id}>
              <div className="section">
                <h2>{page.title}</h2>
                <p style={{ whiteSpace: 'pre-wrap' }}>{page.content}</p>
              </div>
            </div>
          ) : null
        ))}

      </div>

      <style>{`
        .print-container {
          background: #fff;
          border-radius: var(--radius-md);
          padding: 2rem;
          color: #000;
        }
        .shiori-page {
          margin-bottom: 3rem;
          page-break-after: always;
        }
        .shiori-page:last-child { page-break-after: auto; }

        /* Cover */
        .cover-page {
          text-align: center;
          padding: 4rem 2rem;
          border: 3px solid #1a3c34;
          border-radius: 8px;
          min-height: 300px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
        }
        .cover-title {
          font-size: 2.8rem;
          color: #1a3c34;
          border-bottom: none !important;
          margin-bottom: 0;
        }
        .cover-info { font-size: 1.1rem; line-height: 2; }
        .goals-box {
          background: #f0fdf4;
          padding: 1.5rem 2rem;
          border-radius: 8px;
          text-align: left;
          width: 100%;
          max-width: 500px;
          border-left: 4px solid #1a3c34;
        }

        /* Section */
        .section { margin-bottom: 1.5rem; }
        .section h2 {
          border-bottom: 2px solid #1a3c34;
          padding-bottom: 0.4rem;
          margin-bottom: 1rem;
          color: #1a3c34;
          font-size: 1.3rem;
        }

        .print-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        /* Schedule */
        .schedule-table {
          width: 100%;
          border-collapse: collapse;
        }
        .schedule-table th, .schedule-table td {
          border: 1px solid #ccc;
          padding: 0.4rem 0.6rem;
          font-size: 0.9rem;
          vertical-align: middle;
        }
        .schedule-table th { background: #f0fdf4; text-align: center; }

        /* Belongings */
        .belongings-list { list-style: none; padding: 0; }
        .belongings-list li {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.25rem 0;
          border-bottom: 1px dotted #ccc;
          font-size: 0.9rem;
        }
        .checkbox {
          display: inline-block;
          width: 1rem;
          height: 1rem;
          border: 1.5px solid #000;
          flex-shrink: 0;
        }
        .essential-badge {
          font-size: 0.7rem;
          color: #dc2626;
          background: #fee2e2;
          padding: 0.1rem 0.3rem;
          border-radius: 3px;
          white-space: nowrap;
        }

        /* Info boxes */
        .info-box {
          background: #f9fafb;
          padding: 0.75rem 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          font-size: 0.9rem;
          line-height: 1.8;
        }

        /* Seats */
        .seat-front-label {
          text-align: center;
          font-size: 0.8rem;
          color: #666;
          margin-bottom: 0.5rem;
        }
        .seat-grid { display: flex; flex-direction: column; gap: 4px; align-items: center; }
        .seat-row { display: flex; gap: 4px; }
        .seat-cell {
          width: 56px;
          height: 32px;
          border: 1px solid #aaa;
          border-radius: 4px;
          background: #f0fdf4;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          text-align: center;
          overflow: hidden;
        }
        .seat-aisle { width: 20px; }

        /* Roles */
        .roles-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }
        .role-item {
          display: flex;
          flex-direction: column;
          padding: 0.5rem 0.75rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          background: #f9fafb;
        }
        .role-name { font-weight: bold; font-size: 0.8rem; color: #555; }
        .person-name { font-size: 1rem; margin-top: 0.2rem; }

        /* Memo */
        .memo-box {
          min-height: 120px;
          border: 1px solid #ccc;
          padding: 0.75rem 1rem;
          border-radius: 6px;
          font-size: 0.9rem;
        }
        .empty-lines hr {
          margin: 2rem 0;
          border: none;
          border-bottom: 1px dotted #ccc;
        }

        /* Pocket money */
        .pocket-summary {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .pocket-card {
          flex: 1;
          border: 1px solid #ccc;
          border-radius: 6px;
          padding: 0.75rem;
          text-align: center;
          background: #f9fafb;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        .pocket-card span { font-size: 0.8rem; color: #666; }
        .pocket-card strong { font-size: 1.2rem; }

        @media print {
          body { background: none; }
          .app-container { display: block; }
          .sidebar, .hide-on-print, .page-nav { display: none !important; }
          .main-content { margin: 0 !important; padding: 0 !important; }
          .glass-panel { box-shadow: none !important; border: none !important; padding: 0 !important; }
          .print-container { padding: 0; }
        }
      `}</style>
    </div>
  );
}
