import React from 'react';
import { useShiori } from '../context/ShioriContext';
import { Printer } from 'lucide-react';
import { t } from '../utils/i18n';

export default function Preview() {
  const { data } = useShiori();
  const { useKanji } = data.settings;
  
  const handlePrint = () => {
    window.print();
  };

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
          <h1 className="title">{data.dateTime.title || t(useKanji, '修学旅行のしおり', 'しゅうがくりょこうの しおり')}</h1>
          <div className="info">
            <p>{t(useKanji, '日程：', 'にってい：')}{data.dateTime.startDate} 〜 {data.dateTime.endDate}</p>
            <p>{t(useKanji, '行き先：', 'いきさき：')}{data.destination.name}</p>
          </div>
          <div className="goals-box">
            <h3>{t(useKanji, 'スローガン', 'すろーがん')}</h3>
            <p>{data.goals.classGoal || t(useKanji, '（未設定）', '（まだ きまっていない）')}</p>
            <h3>{t(useKanji, '個人の目標', 'こじんの もくひょう')}</h3>
            <p>{data.goals.personalGoal || t(useKanji, '（未設定）', '（まだ きまっていない）')}</p>
          </div>
        </div>

        {/* スケジュールと詳細 */}
        <div className="shiori-page">
          <div className="section">
            <h2>{t(useKanji, '日程表', 'にっていひょう')}</h2>
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>{t(useKanji, '日付', 'ひづけ')}</th>
                  <th>{t(useKanji, '時間', 'じかん')}</th>
                  <th>{t(useKanji, '活動内容', 'かつどう ないよう')}</th>
                </tr>
              </thead>
              <tbody>
                {data.schedule.length > 0 ? data.schedule.map(ev => (
                  <tr key={ev.id}>
                    <td>{ev.date}</td>
                    <td>{ev.time}</td>
                    <td>{ev.activity}</td>
                  </tr>
                )) : <tr><td colSpan="3" className="text-center text-muted">{t(useKanji, 'スケジュールがありません', 'すけじゅーるが ありません')}</td></tr>}
              </tbody>
            </table>
          </div>

          <div className="grid-2 gap-4 mt-4">
            <div className="section">
              <h2>{t(useKanji, '持ち物リスト', 'もちもの りすと')}</h2>
              <ul className="belongings-list">
                {data.belongings.length > 0 ? data.belongings.map(item => (
                  <li key={item.id}>
                    <span className="checkbox"></span>
                    {item.name} {item.isEssential && <strong>({t(useKanji, '必須', 'ひっす')})</strong>}
                  </li>
                )) : <p className="text-muted">{t(useKanji, '持ち物がありません', 'もちものが ありません')}</p>}
              </ul>
            </div>
            <div className="section">
              <h2>{t(useKanji, '宿泊・座席', 'しゅくはく・ざせき')}</h2>
              <div className="info-box">
                <p><strong>{t(useKanji, '部屋番号:', 'へやばんごう:')}</strong> {data.room.roomNumber}</p>
                <p><strong>{t(useKanji, '同室メンバー:', 'おなじへやの めんばー:')}</strong> {data.room.members.join('、')}</p>
              </div>
              <div className="info-box mt-2">
                <p><strong>{t(useKanji, '乗り物:', 'のりもの:')}</strong> {data.seats.transportType === 'bus' ? t(useKanji, 'バス', 'ばす') : t(useKanji, '電車', 'でんしゃ')}</p>
                <p className="text-sm text-muted">{t(useKanji, '座席は別途確認', 'ざせきは べつに かくにん')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* かかり・メモ・その他 */}
        <div className="shiori-page">
          <div className="section">
            <h2>{t(useKanji, '係（役割）', 'かかり（やくわり）')}</h2>
            <div className="roles-grid">
              {data.roles.length > 0 ? data.roles.map(r => (
                <div key={r.id} className="role-item">
                  <span className="role-name">{r.roleName}</span>
                  <span className="person-name">{r.personName}</span>
                </div>
              )) : <p className="text-muted">{t(useKanji, '役割がありません', 'やくわりが ありません')}</p>}
            </div>
          </div>

          <div className="section mt-4">
            <h2>{t(useKanji, 'メモ・連絡事項', 'めも・れんらく じこう')}</h2>
            <div className="memo-box">
              {data.memo ? (
                <p style={{ whiteSpace: 'pre-wrap' }}>{data.memo}</p>
              ) : (
                <div className="empty-lines">
                  <hr/><hr/><hr/><hr/>
                </div>
              )}
            </div>
          </div>
          
          {data.customPages.filter(p => p.content).map(page => (
             <div className="section mt-4" key={page.id}>
               <h2>{page.title}</h2>
               <p style={{ whiteSpace: 'pre-wrap' }}>{page.content}</p>
             </div>
          ))}
        </div>
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
        .shiori-page:last-child {
          page-break-after: auto;
        }
        .cover-page {
          text-align: center;
          padding: 4rem 2rem;
          border: 4px solid var(--primary);
          border-radius: var(--radius-lg);
        }
        .cover-page .title {
          font-size: 3rem;
          color: var(--primary);
          margin-bottom: 2rem;
        }
        .cover-page .info {
          font-size: 1.25rem;
          margin-bottom: 3rem;
        }
        .goals-box {
          background: #f0fdf4;
          padding: 2rem;
          border-radius: var(--radius-md);
          text-align: left;
        }
        .section h2 {
          border-bottom: 2px solid var(--primary);
          padding-bottom: 0.5rem;
          color: var(--primary);
        }
        .schedule-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
        }
        .schedule-table th, .schedule-table td {
          border: 1px solid #ccc;
          padding: 0.5rem;
          text-align: left;
        }
        .schedule-table th {
          background: #f0fdf4;
        }
        .belongings-list {
          list-style: none;
          padding: 0;
        }
        .belongings-list li {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .checkbox {
          display: inline-block;
          width: 1rem;
          height: 1rem;
          border: 1px solid #000;
        }
        .info-box {
          background: #f9fafb;
          padding: 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
        }
        .roles-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        .role-item {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #ccc;
          padding-bottom: 0.25rem;
        }
        .role-name { font-weight: bold; }
        .memo-box {
          min-height: 150px;
          border: 1px solid #ccc;
          padding: 1rem;
          border-radius: 0.5rem;
        }
        .empty-lines hr {
          margin: 2rem 0;
          border: none;
          border-bottom: 1px dotted #ccc;
        }

        @media print {
          body {
            background: none;
          }
          .app-container {
            display: block;
          }
          .sidebar, .hide-on-print {
            display: none !important;
          }
          .main-content {
            margin: 0 !important;
            padding: 0 !important;
          }
          .glass-panel {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
          }
          .print-container {
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
}
