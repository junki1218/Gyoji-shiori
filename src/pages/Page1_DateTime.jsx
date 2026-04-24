import React from 'react';
import { useShiori } from '../context/ShioriContext';
import { t } from '../utils/i18n';
import AnalogClock from '../components/AnalogClock';

export default function Page1DateTime() {
  const { data, updateSection } = useShiori();
  const { useKanji } = data.settings;
  const dt = data.dateTime;

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateSection('dateTime', { ...dt, [name]: value });
  };

  return (
    <div className="animation-fade-in">
      <div className="page-header">
        <h1>{t(useKanji, '1. 日時', '1. にちじ')}</h1>
        <p className="text-muted">
          {t(useKanji, '行事のタイトルと日程を入力してください。', 'ぎょうじの たいとると にっていを にゅうりょくしてください。')}
        </p>
      </div>

      <div className="card">
        <div className="form-group">
          <label>{t(useKanji, '行事のタイトル', 'ぎょうじの たいとる')}</label>
          <input 
            type="text" 
            name="title" 
            value={dt.title} 
            onChange={handleChange} 
            placeholder={t(useKanji, '例：〇〇中学校 修学旅行', 'れい：〇〇ちゅうがっこう しゅうがくりょこう')} 
          />
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label>{t(useKanji, '出発日', 'しゅっぱつび')}</label>
            <input 
              type="date" 
              name="startDate" 
              value={dt.startDate} 
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label>{t(useKanji, '帰着日', 'きちゃくび')}</label>
            <input 
              type="date" 
              name="endDate" 
              value={dt.endDate} 
              onChange={handleChange} 
            />
          </div>
        </div>

        <div className="flex items-end gap-6 mt-4">
          <div className="form-group" style={{ flex: 1 }}>
            <label>{t(useKanji, '集合時間', 'しゅうごう じかん')}</label>
            <input 
              type="time" 
              name="meetingTime" 
              value={dt.meetingTime} 
              onChange={handleChange} 
            />
          </div>
          <div className="flex-col items-center gap-1 mb-2">
             <AnalogClock time={dt.meetingTime} size={80} />
             <span className="text-xs text-muted" style={{ display: 'block', textAlign: 'center' }}>
               {dt.meetingTime || '00:00'}
             </span>
          </div>
          <div className="form-group" style={{ flex: 2 }}>
            <label>{t(useKanji, '集合場所', 'しゅうごう ばしょ')}</label>
            <input 
              type="text" 
              name="meetingPlace" 
              value={dt.meetingPlace} 
              onChange={handleChange} 
              placeholder={t(useKanji, '例：学校の体育館前', 'れい：がっこうの たいいくかんまえ')} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
