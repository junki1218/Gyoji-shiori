import React, { useRef, useState, useEffect } from 'react';
import { useShiori } from '../context/ShioriContext';
import { Plus, Trash2, Camera, GripVertical } from 'lucide-react';
import { t } from '../utils/i18n';
import AnalogClock from '../components/AnalogClock';
import ImageWithZoom from '../components/ImageWithZoom';
import { suggestPictogram } from '../utils/pictograms';

const toMins = (timeStr) => {
  const [h, m] = (timeStr || '00:00').split(':').map(Number);
  return h * 60 + m;
};

function TimerRing({ percent, label, sublabel }) {
  const pct = Math.max(0, Math.min(100, percent));
  const style = {
    background: `conic-gradient(var(--primary) ${pct * 3.6}deg, rgba(255,255,255,0.12) ${pct * 3.6}deg)`
  };
  return (
    <div className="timer-ring" style={style}>
      <div className="timer-ring-inner">
        <span className="timer-ring-label">{label}</span>
        {sublabel && <span className="timer-ring-sublabel">{sublabel}</span>}
      </div>
    </div>
  );
}

function NowNextCard({ schedule, useKanji }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000 * 15);
    return () => clearInterval(timer);
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const nowMins = now.getHours() * 60 + now.getMinutes();

  const todayEvents = schedule
    .filter(ev => ev.date === todayStr && ev.activity)
    .sort((a, b) => a.time.localeCompare(b.time));

  if (todayEvents.length === 0) return null;

  const currentEvent = [...todayEvents].reverse().find(ev => toMins(ev.time) <= nowMins);
  const nextEvent = todayEvents.find(ev => toMins(ev.time) > nowMins);

  if (!currentEvent && !nextEvent) return null;

  // ビジュアルタイマー: 現在の活動開始（無ければ0時）〜次の活動開始までの残り時間を円グラフで表示
  // 注: currentEvent が無い場合に spanStart を nowMins にすると、基準点が毎秒 "今" に追従してしまい
  // 残量が常に100%（進捗0%）に固定されるため、その日の開始（0時）を基準にする
  let timerPercent = null;
  let remainMins = null;
  if (nextEvent) {
    const spanStart = currentEvent ? toMins(currentEvent.time) : 0;
    const spanEnd = toMins(nextEvent.time);
    const totalSpan = Math.max(1, spanEnd - spanStart);
    remainMins = Math.max(0, spanEnd - nowMins);
    timerPercent = 100 - Math.min(100, (remainMins / totalSpan) * 100);
  }

  return (
    <div className="now-next-container mb-4">
      <p className="now-next-title">
        {t(useKanji, '📅 今日のスケジュール', '📅 きょうのすけじゅーる')}
      </p>
      <div className="now-next-cards">
        {currentEvent && (
          <div className="now-card">
            <span className="now-badge">NOW</span>
            <div className="now-time">{currentEvent.time}</div>
            <div className="now-activity">{suggestPictogram(currentEvent.activity)} {currentEvent.activity}</div>
            {currentEvent.image && (
              <img src={currentEvent.image} alt="" className="now-img" />
            )}
          </div>
        )}
        {nextEvent && (
          <div className="next-card">
            <span className="next-badge">NEXT</span>
            <div className="next-time">{nextEvent.time}</div>
            <div className="next-activity">{suggestPictogram(nextEvent.activity)} {nextEvent.activity}</div>
            {nextEvent.image && (
              <img src={nextEvent.image} alt="" className="now-img" />
            )}
          </div>
        )}
        {timerPercent !== null && (
          <TimerRing
            percent={timerPercent}
            label={remainMins >= 60 ? `${Math.floor(remainMins / 60)}${t(useKanji, '時間', 'じかん')}${remainMins % 60}${t(useKanji, '分', 'ぷん')}` : `${remainMins}${t(useKanji, '分', 'ぷん')}`}
            sublabel={t(useKanji, 'つぎまで', 'つぎまで')}
          />
        )}
      </div>
    </div>
  );
}

export default function Page5Schedule() {
  const { data, updateSection } = useShiori();
  const { useKanji } = data.settings;
  const schedule = data.schedule;
  const fileInputRefs = useRef({});

  const todayStr = new Date().toISOString().split('T')[0];
  const [draggedId, setDraggedId] = useState(null);

  const addEvent = () => {
    const newEvent = { id: Date.now().toString(), date: '', time: '09:00', activity: '', image: null, order: Date.now() };
    updateSection('schedule', [...schedule, newEvent]);
  };

  const updateEvent = (id, field, value) => {
    updateSection('schedule', schedule.map(ev =>
      ev.id === id ? { ...ev, [field]: value } : ev
    ));
  };

  const removeEvent = (id) => {
    updateSection('schedule', schedule.filter(ev => ev.id !== id));
  };

  const handleImageUpload = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateEvent(id, 'image', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const sortedSchedule = [...schedule].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    const aOrder = a.order ?? toMins(a.time);
    const bOrder = b.order ?? toMins(b.time);
    return aOrder - bOrder;
  });

  const handleDropReorder = (date, targetId) => {
    if (!draggedId || draggedId === targetId) return;
    const dateEvents = sortedSchedule.filter(ev => ev.date === date);
    const fromIdx = dateEvents.findIndex(ev => ev.id === draggedId);
    const toIdx = dateEvents.findIndex(ev => ev.id === targetId);
    if (fromIdx === -1 || toIdx === -1) return;
    const reordered = [...dateEvents];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);
    const orderMap = new Map(reordered.map((ev, idx) => [ev.id, idx * 10]));
    updateSection('schedule', schedule.map(ev =>
      orderMap.has(ev.id) ? { ...ev, order: orderMap.get(ev.id) } : ev
    ));
    setDraggedId(null);
  };

  const groupedDates = [...new Set(sortedSchedule.map(ev => ev.date))];

  const formatDate = (dateStr) => {
    if (!dateStr) return t(useKanji, '日付未設定', 'ひづけ みせってい');
    try {
      const d = new Date(dateStr);
      const weekDays = useKanji
        ? ['日', '月', '火', '水', '木', '金', '土']
        : ['にち', 'げつ', 'か', 'すい', 'もく', 'きん', 'ど'];
      return `${dateStr}（${weekDays[d.getDay()]}）`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="animation-fade-in">
      <div className="page-header">
        <h1>{t(useKanji, '5. スケジュール', '5. すけじゅーる')}</h1>
        <p className="text-muted">
          {t(useKanji, '行事の予定やタイムテーブルを作成します。', 'ぎょうじの よていや たいむてーぶるを つくります。')}
        </p>
      </div>

      <NowNextCard schedule={schedule} useKanji={useKanji} />

      <div className="card mb-4">
        <button className="btn btn-primary mb-4" onClick={addEvent}>
          <Plus size={20} /> {t(useKanji, '予定を追加', 'よていを ついか')}
        </button>

        <div className="flex-col gap-6">
          {groupedDates.map(date => {
            const isToday = date === todayStr;
            return (
              <div key={date}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.75rem',
                  paddingBottom: '0.4rem',
                  borderBottom: '1px dashed var(--border)'
                }}>
                  <span className={isToday ? 'today-date-badge' : ''} style={{
                    background: isToday ? 'var(--primary)' : 'var(--primary-light)',
                    color: isToday ? '#1a3c34' : 'var(--primary)',
                    padding: '0.2rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    border: `1px solid var(--primary)`,
                    whiteSpace: 'nowrap',
                  }}>
                    {isToday ? `📅 ${t(useKanji, '今日 ', 'きょう ')}` : ''}{formatDate(date)}
                  </span>
                  <span className="text-xs text-muted">
                    {sortedSchedule.filter(ev => ev.date === date).length}
                    {t(useKanji, '件', 'けん')}
                  </span>
                </div>

                <div className="flex-col gap-3">
                  {sortedSchedule.filter(ev => ev.date === date).map((ev) => (
                    <div
                      key={ev.id}
                      className={`flex items-center gap-4 p-4 border rounded schedule-row ${draggedId === ev.id ? 'schedule-row-dragging' : ''}`}
                      style={{ borderColor: 'var(--border)', background: 'rgba(255,255,255,0.02)' }}
                      draggable
                      onDragStart={() => setDraggedId(ev.id)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleDropReorder(date, ev.id)}
                      onDragEnd={() => setDraggedId(null)}
                    >
                      <span className="drag-handle" title={t(useKanji, 'ドラッグで並べ替え', 'どらっぐで ならべかえ')}>
                        <GripVertical size={18} />
                      </span>
                      <div className="flex-col gap-1 items-center" style={{ alignItems: 'center' }}>
                        <AnalogClock time={ev.time} size={56} />
                        <input
                          type="time"
                          value={ev.time}
                          onChange={(e) => updateEvent(ev.id, 'time', e.target.value)}
                          style={{ width: '96px', fontSize: '0.8rem', padding: '0.2rem', textAlign: 'center' }}
                        />
                      </div>

                      <div className="flex-col gap-2" style={{ flex: 1 }}>
                        <div className="flex gap-2 items-center">
                          <input
                            type="date"
                            value={ev.date}
                            onChange={(e) => updateEvent(ev.id, 'date', e.target.value)}
                            style={{ width: '150px', fontSize: '0.85rem' }}
                          />
                          <div className="flex items-center gap-2">
                            <ImageWithZoom src={ev.image} onRemove={() => updateEvent(ev.id, 'image', null)} label={ev.activity} />
                            {!ev.image && (
                              <button className="btn-icon" onClick={() => fileInputRefs.current[ev.id].click()}>
                                <Camera size={20} />
                              </button>
                            )}
                            <input
                              type="file"
                              ref={el => fileInputRefs.current[ev.id] = el}
                              onChange={(e) => handleImageUpload(ev.id, e)}
                              accept="image/*"
                              style={{ display: 'none' }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {suggestPictogram(ev.activity) && (
                            <span className="pictogram-badge" title={t(useKanji, '自動提案アイコン', 'じどう ていあん あいこん')}>
                              {suggestPictogram(ev.activity)}
                            </span>
                          )}
                          <input
                            type="text"
                            value={ev.activity}
                            onChange={(e) => updateEvent(ev.id, 'activity', e.target.value)}
                            placeholder={t(useKanji, '活動内容（例：清水寺見学）', 'かつどうないよう（れい：きよみずでら けんがく）')}
                            style={{ width: '100%' }}
                          />
                        </div>
                      </div>

                      <button className="btn-icon" onClick={() => removeEvent(ev.id)}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {schedule.length === 0 && (
            <div className="flex-col items-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem', gap: '1rem' }}>
              <p className="text-center text-muted">{t(useKanji, '予定がありません。追加してください。', 'よていが ありません。ついかしてください。')}</p>
              <button className="btn btn-primary" onClick={addEvent}>
                <Plus size={20} /> {t(useKanji, '最初の予定を追加', 'さいしょの よていを ついか')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
