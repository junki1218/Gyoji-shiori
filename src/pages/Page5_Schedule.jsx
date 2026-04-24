import React, { useRef } from 'react';
import { useShiori } from '../context/ShioriContext';
import { Plus, Trash2, Camera } from 'lucide-react';
import { t } from '../utils/i18n';
import AnalogClock from '../components/AnalogClock';
import ImageWithZoom from '../components/ImageWithZoom';

export default function Page5Schedule() {
  const { data, updateSection } = useShiori();
  const { useKanji } = data.settings;
  const schedule = data.schedule;
  const fileInputRefs = useRef({});

  const addEvent = () => {
    const newEvent = { id: Date.now().toString(), date: '', time: '09:00', activity: '', image: null };
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
    return a.time.localeCompare(b.time);
  });

  return (
    <div className="animation-fade-in">
      <div className="page-header">
        <h1>{t(useKanji, '5. スケジュール', '5. すけじゅーる')}</h1>
        <p className="text-muted">
          {t(useKanji, '行事の予定やタイムテーブルを作成します。', 'ぎょうじの よていや たいむてーぶるを つくります。')}
        </p>
      </div>

      <div className="card mb-4">
        <button className="btn btn-primary mb-4" onClick={addEvent}>
          <Plus size={20} /> {t(useKanji, '予定を追加', 'よていを ついか')}
        </button>

        <div className="flex-col gap-4">
          {sortedSchedule.map((ev, index) => (
            <div key={ev.id} className="flex items-center gap-4 p-4 border rounded" style={{ borderColor: 'var(--border)', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ width: '30px', textAlign: 'center', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                {index + 1}
              </div>
              
              <div className="flex-col gap-1 items-center">
                <AnalogClock time={ev.time} size={60} />
                <input 
                  type="time" 
                  value={ev.time} 
                  onChange={(e) => updateEvent(ev.id, 'time', e.target.value)} 
                  style={{ width: '100px', fontSize: '0.8rem', padding: '0.2rem' }}
                />
              </div>

              <div className="flex-col gap-2" style={{ flex: 1 }}>
                <div className="flex gap-2">
                  <input 
                    type="date" 
                    value={ev.date} 
                    onChange={(e) => updateEvent(ev.id, 'date', e.target.value)} 
                    style={{ width: '150px' }}
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
                <input 
                  type="text" 
                  value={ev.activity} 
                  onChange={(e) => updateEvent(ev.id, 'activity', e.target.value)} 
                  placeholder={t(useKanji, '活動内容（例：清水寺見学）', 'かつどうないよう（れい：きよみずでら けんがく）')}
                  style={{ width: '100%' }}
                />
              </div>

              <button className="btn-icon" onClick={() => removeEvent(ev.id)}>
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {schedule.length === 0 && (
            <p className="text-center text-muted mt-4">{t(useKanji, '予定がありません。追加してください。', 'よていが ありません。ついかしてください。')}</p>
          )}
        </div>
      </div>
    </div>
  );
}
