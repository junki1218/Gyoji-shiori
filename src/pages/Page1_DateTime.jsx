import React from 'react';
import { useShiori } from '../context/ShioriContext';

export default function Page1DateTime() {
  const { data, updateSection } = useShiori();
  const dt = data.dateTime;

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateSection('dateTime', { ...dt, [name]: value });
  };

  return (
    <div className="animation-fade-in">
      <div className="page-header">
        <h1>1. 日時</h1>
        <p className="text-muted">行事のタイトルと日程を入力してください。</p>
      </div>

      <div className="card">
        <div className="form-group">
          <label>行事のタイトル</label>
          <input 
            type="text" 
            name="title" 
            value={dt.title} 
            onChange={handleChange} 
            placeholder="例：〇〇中学校 修学旅行" 
          />
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label>出発日</label>
            <input 
              type="date" 
              name="startDate" 
              value={dt.startDate} 
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label>帰着日</label>
            <input 
              type="date" 
              name="endDate" 
              value={dt.endDate} 
              onChange={handleChange} 
            />
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label>集合時間</label>
            <input 
              type="time" 
              name="meetingTime" 
              value={dt.meetingTime} 
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label>集合場所</label>
            <input 
              type="text" 
              name="meetingPlace" 
              value={dt.meetingPlace} 
              onChange={handleChange} 
              placeholder="例：学校の体育館前" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
