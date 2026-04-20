import React, { useState } from 'react';
import { useShiori } from '../context/ShioriContext';

export default function Page6Seats() {
  const { data, updateSection } = useShiori();
  const seats = data.seats;

  const handleTypeChange = (e) => {
    updateSection('seats', { ...seats, transportType: e.target.value });
  };

  const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    updateSection('seats', { ...seats, [name]: parseInt(value) || 1 });
  };

  const handleSeatChange = (row, col, value) => {
    const key = `${row}-${col}`;
    const newAssignments = { ...seats.assignments, [key]: value };
    updateSection('seats', { ...seats, assignments: newAssignments });
  };

  // Generate seat layout
  const rows = Array.from({ length: seats.rows }, (_, i) => i);
  const cols = Array.from({ length: seats.cols }, (_, i) => i);

  return (
    <div className="animation-fade-in">
      <div className="page-header">
        <h1>6. 座席（バス・電車）</h1>
        <p className="text-muted">移動時の座席表を作成します。</p>
      </div>

      <div className="card mb-4">
        <div className="grid-2">
          <div className="form-group">
            <label>乗り物の種類</label>
            <select value={seats.transportType} onChange={handleTypeChange}>
              <option value="bus">バス</option>
              <option value="train">電車（新幹線など）</option>
            </select>
          </div>
          <div className="flex gap-4">
            <div className="form-group">
              <label>列数 (タテ)</label>
              <input type="number" name="rows" min="1" max="20" value={seats.rows} onChange={handleDimensionChange} />
            </div>
            <div className="form-group">
              <label>席数 (ヨコ)</label>
              <input type="number" name="cols" min="1" max="10" value={seats.cols} onChange={handleDimensionChange} />
            </div>
          </div>
        </div>

        <div className="mt-8 overflow-auto" style={{ padding: '1rem', background: 'var(--background)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'inline-block', minWidth: '100%' }}>
            {seats.transportType === 'bus' && (
              <div className="text-center mb-4 text-muted font-bold">運転席 / 前方</div>
            )}
            {rows.map(row => (
              <div key={row} className="flex justify-center gap-2 mb-2">
                {cols.map(col => {
                  const isAisle = seats.cols > 3 && col === Math.floor(seats.cols / 2);
                  return (
                    <React.Fragment key={col}>
                      {isAisle && <div style={{ width: '30px' }}></div>}
                      <input
                        type="text"
                        value={seats.assignments[`${row}-${col}`] || ''}
                        onChange={(e) => handleSeatChange(row, col, e.target.value)}
                        placeholder={`${row + 1}-${String.fromCharCode(65 + col)}`}
                        style={{ width: '80px', textAlign: 'center', padding: '0.5rem' }}
                      />
                    </React.Fragment>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
