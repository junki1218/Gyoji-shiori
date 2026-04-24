import React from 'react';
import { useShiori } from '../context/ShioriContext';
import { t } from '../utils/i18n';

export default function Page2Destination() {
  const { data, updateSection } = useShiori();
  const { useKanji } = data.settings;
  const dest = data.destination;

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateSection('destination', { ...dest, [name]: value });
  };

  return (
    <div className="animation-fade-in">
      <div className="page-header">
        <h1>{t(useKanji, '2. 行き先', '2. いきさき')}</h1>
        <p className="text-muted">
          {t(useKanji, 'メインとなる目的地や宿泊先の情報を入力してください。', 'メインとなる もくてきちや しゅくはくさきの じょうほうを にゅうりょくしてください。')}
        </p>
      </div>

      <div className="card">
        <div className="form-group">
          <label>{t(useKanji, '目的地・宿泊先名', 'もくてきち・しゅくはくさきめい')}</label>
          <input 
            type="text" 
            name="name" 
            value={dest.name} 
            onChange={handleChange} 
            placeholder={t(useKanji, '例：京都・奈良 / 〇〇ホテル', 'れい：きょうと・なら / 〇〇ほてる')} 
          />
        </div>

        <div className="form-group">
          <label>{t(useKanji, '住所', 'じゅうしょ')}</label>
          <input 
            type="text" 
            name="address" 
            value={dest.address} 
            onChange={handleChange} 
            placeholder={t(useKanji, '例：京都府京都市〇〇区〇〇町 1-2-3', 'れい：きょうとふ きょうとし 〇〇く 〇〇まち 1-2-3')} 
          />
        </div>

        <div className="form-group">
          <label>{t(useKanji, '行き先についての説明や見どころ', 'いきさきについての せつめいや みどころ')}</label>
          <textarea 
            name="description" 
            value={dest.description} 
            onChange={handleChange} 
            rows="4"
            placeholder={t(useKanji, '例：清水寺などの歴史的な建造物を見学し、日本の伝統文化に触れます。', 'れい：きよみずでらなどの れきしてきな けんぞうぶつを けんがくし、にっぽんの でんとうぶんかに ふれます。')} 
          />
        </div>

        <div className="form-group">
          <label>{t(useKanji, '地図URL', 'ちずURL')}</label>
          <input 
            type="text" 
            name="mapUrl" 
            value={dest.mapUrl} 
            onChange={handleChange} 
            placeholder="https://..." 
          />
        </div>
      </div>
    </div>
  );
}
