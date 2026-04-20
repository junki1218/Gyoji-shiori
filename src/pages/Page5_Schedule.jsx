import React from 'react';
import { useShiori } from '../context/ShioriContext';
import { Plus, Trash2 } from 'lucide-react';

export default function Page5Schedule() {
  const { data, updateSection } = useShiori();
  const schedule = data.schedule;

  const addEvent = () => {
    const newEvent = { id: Date.now().toString(), date: '', time: '09:00', activity: '' };
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

  // Sort by time
  const sortedSchedule = [...schedule].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.time.localeCompare(b.time);
  });

  return (
    <div className="animation-fade-in">
      <div className="page-header">
        <h1>5. スケジュール</h1>
        <p className="text-muted">行事の予定やタイムテーブルを作成します。</p>
      </div>

      <div className="card mb-4">
        <button className="btn btn-primary mb-4" onClick={addEvent}>
          <Plus size={20} /> 予定を追加
        </button>

        <div className="flex-col gap-2">
          {sortedSchedule.map((ev, index) => (
            <div key={ev.id} className="flex items-center gap-2 p-3 border rounded" style={{ borderColor: 'var(--border)' }}>
              <div style={{ width: '50px', textAlign: 'center', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                {index + 1}
              </div>
              <input 
                type="date" 
                value={ev.date} 
                onChange={(e) => updateEvent(ev.id, 'date', e.target.value)} 
                style={{ width: '150px' }}
              />
              <input 
                type="time" 
                value={ev.time} 
                onChange={(e) => updateEvent(ev.id, 'time', e.target.value)} 
                style={{ width: '120px' }}
              />
              <input 
                type="text" 
                value={ev.activity} 
                onChange={(e) => updateEvent(ev.id, 'activity', e.target.value)} 
                placeholder="活動内容（例：清水寺見学）"
                style={{ flex: 1 }}
              />
              <button className="btn-icon" onClick={() => removeEvent(ev.id)}>
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {schedule.length === 0 && (
            <p className="text-center text-muted mt-4">予定がありません。追加してください。</p>
          )}
        </div>
      </div>
    </div>
  );
}
