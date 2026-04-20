import React from 'react';
import { useShiori } from '../context/ShioriContext';

export default function Page3Goals() {
  const { data, updateSection } = useShiori();
  const goals = data.goals;

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateSection('goals', { ...goals, [name]: value });
  };

  return (
    <div className="animation-fade-in">
      <div className="page-header">
        <h1>3. 目標</h1>
        <p className="text-muted">行事全体のスローガンや個人の目標を設定しましょう。</p>
      </div>

      <div className="card mb-4">
        <div className="form-group">
          <label>クラス・学年のスローガン</label>
          <textarea 
            name="classGoal" 
            value={goals.classGoal} 
            onChange={handleChange} 
            rows="3"
            placeholder="例：ルールを守り、協力して最高の思い出を作ろう！" 
          />
        </div>
      </div>

      <div className="card">
        <div className="form-group">
          <label>個人の目標</label>
          <textarea 
            name="personalGoal" 
            value={goals.personalGoal} 
            onChange={handleChange} 
            rows="3"
            placeholder="例：班長として責任を持って行動する。５分前行動を心がける。" 
          />
        </div>
      </div>
    </div>
  );
}
