import React from 'react';
import { useShiori } from '../context/ShioriContext';

export default function Page2Destination() {
  const { data, updateSection } = useShiori();
  const dest = data.destination;

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateSection('destination', { ...dest, [name]: value });
  };

  return (
    <div className="animation-fade-in">
      <div className="page-header">
        <h1>2. 行き先</h1>
        <p className="text-muted">メインとなる目的地や宿泊先の情報を入力してください。</p>
      </div>

      <div className="card">
        <div className="form-group">
          <label>目的地・宿泊先名</label>
          <input 
            type="text" 
            name="name" 
            value={dest.name} 
            onChange={handleChange} 
            placeholder="例：京都・奈良 / 〇〇ホテル" 
          />
        </div>

        <div className="form-group">
          <label>住所</label>
          <input 
            type="text" 
            name="address" 
            value={dest.address} 
            onChange={handleChange} 
            placeholder="例：京都府京都市〇〇区〇〇町 1-2-3" 
          />
        </div>

        <div className="form-group">
          <label>行き先についての説明や見どころ</label>
          <textarea 
            name="description" 
            value={dest.description} 
            onChange={handleChange} 
            rows="4"
            placeholder="例：清水寺などの歴史的な建造物を見学し、日本の伝統文化に触れます。" 
          />
        </div>

        <div className="form-group">
          <label>地図URL（Google Maps等のリンク）</label>
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
