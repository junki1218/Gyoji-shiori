import React from 'react';
import { useShiori } from '../context/ShioriContext';

export default function Page8Memo() {
  const { data, updateSection } = useShiori();

  const handleChange = (e) => {
    updateSection('memo', e.target.value);
  };

  return (
    <div className="animation-fade-in">
      <div className="page-header">
        <h1>8. メモ・連絡事項</h1>
        <p className="text-muted">注意事項や個人的なメモを自由に記入してください。</p>
      </div>

      <div className="card">
        <div className="form-group">
          <label>メモ欄</label>
          <textarea 
            value={data.memo} 
            onChange={handleChange} 
            rows="10"
            placeholder="ここにメモを入力..." 
            style={{ resize: 'vertical' }}
          />
        </div>
      </div>
    </div>
  );
}
