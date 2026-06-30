import React from 'react';
import { useShiori } from '../context/ShioriContext';
import { t } from '../utils/i18n';

const EMOTIONS = [
  { emoji: '😊', labelKanji: 'うれしい', labelKana: 'うれしい' },
  { emoji: '😄', labelKanji: 'たのしい', labelKana: 'たのしい' },
  { emoji: '😐', labelKanji: 'ふつう',   labelKana: 'ふつう' },
  { emoji: '😪', labelKanji: 'つかれた', labelKana: 'つかれた' },
  { emoji: '😢', labelKanji: 'かなしい', labelKana: 'かなしい' },
];

export default function Page8Memo() {
  const { data, updateSection } = useShiori();
  const { useKanji } = data.settings;
  const currentEmotion = data.memoEmotion ?? '';

  const handleMemoChange = (e) => {
    updateSection('memo', e.target.value);
  };

  const handleEmotionSelect = (emoji) => {
    updateSection('memoEmotion', currentEmotion === emoji ? '' : emoji);
  };

  const selectedEmotionLabel = EMOTIONS.find(e => e.emoji === currentEmotion);

  return (
    <div className="animation-fade-in">
      <div className="page-header">
        <h1>{t(useKanji, '8. メモ・連絡事項', '8. めも・れんらくじこう')}</h1>
        <p className="text-muted">
          {t(useKanji, '注意事項や個人的なメモを自由に記入してください。', 'ちゅういじこうや こじんてきな めもを じゆうに きにゅうしてください。')}
        </p>
      </div>

      <div className="card mb-4">
        <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.78)', fontWeight: 500 }}>
          {t(useKanji, '今の気持ち', 'いまの きもち')}
        </label>

        {currentEmotion && selectedEmotionLabel && (
          <div className="emotion-selected">
            <span className="emotion-selected-emoji">{currentEmotion}</span>
            <span className="emotion-selected-label">
              {t(useKanji, selectedEmotionLabel.labelKanji, selectedEmotionLabel.labelKana)}
            </span>
          </div>
        )}

        <div className="emotion-stamps">
          {EMOTIONS.map(({ emoji, labelKanji, labelKana }) => (
            <button
              key={emoji}
              className={`emotion-btn${currentEmotion === emoji ? ' emotion-btn-selected' : ''}`}
              onClick={() => handleEmotionSelect(emoji)}
              aria-label={t(useKanji, labelKanji, labelKana)}
              aria-pressed={currentEmotion === emoji}
              title={t(useKanji, labelKanji, labelKana)}
            >
              <span className="emotion-emoji">{emoji}</span>
              <span className="emotion-label">{t(useKanji, labelKanji, labelKana)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="form-group">
          <label>{t(useKanji, 'メモ欄', 'めもらん')}</label>
          <textarea
            value={data.memo}
            onChange={handleMemoChange}
            rows="10"
            placeholder={t(useKanji, 'ここにメモを入力...', 'ここに めもを にゅうりょく...')}
            style={{ resize: 'vertical' }}
          />
        </div>
      </div>
    </div>
  );
}
