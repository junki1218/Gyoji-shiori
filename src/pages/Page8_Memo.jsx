import React from 'react';
import { useShiori } from '../context/ShioriContext';
import { t } from '../utils/i18n';

export default function Page8Memo() {
  const { data, updateSection } = useShiori();
  const { useKanji } = data.settings;

  const handleChange = (e) => {
    updateSection('memo', e.target.value);
  };

  return (
    <div className="animation-fade-in">
      <div className="page-header">
        <h1>{t(useKanji, '8. メモ・連絡事項', '8. めも・れんらくじこう')}</h1>
        <p className="text-muted">
          {t(useKanji, '注意事項や個人的なメモを自由に記入してください。', 'ちゅういじこうや こじんてきな めもを じゆうに きにゅうしてください。')}
        </p>
      </div>

      <div className="card">
        <div className="form-group">
          <label>{t(useKanji, 'メモ欄', 'めもらん')}</label>
          <textarea 
            value={data.memo} 
            onChange={handleChange} 
            rows="10"
            placeholder={t(useKanji, 'ここにメモを入力...', 'ここに めもを にゅうりょく...')} 
            style={{ resize: 'vertical' }}
          />
        </div>
      </div>
    </div>
  );
}
