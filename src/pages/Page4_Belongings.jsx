import React, { useState } from 'react';
import { useShiori } from '../context/ShioriContext';
import { Plus, Trash2 } from 'lucide-react';

export default function Page4Belongings() {
  const { data, updateSection } = useShiori();
  const belongings = data.belongings;
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (!newItem.trim()) return;
    const item = { id: Date.now().toString(), name: newItem, isEssential: false };
    updateSection('belongings', [...belongings, item]);
    setNewItem('');
  };

  const removeItem = (id) => {
    updateSection('belongings', belongings.filter(item => item.id !== id));
  };

  const toggleEssential = (id) => {
    updateSection('belongings', belongings.map(item => 
      item.id === id ? { ...item, isEssential: !item.isEssential } : item
    ));
  };

  return (
    <div className="animation-fade-in">
      <div className="page-header">
        <h1>4. もちもの</h1>
        <p className="text-muted">忘れ物がないように、持ち物リストを作成しましょう。</p>
      </div>

      <div className="card mb-4">
        <div className="flex gap-2 mb-4">
          <input 
            type="text" 
            value={newItem} 
            onChange={(e) => setNewItem(e.target.value)} 
            placeholder="新しい持ち物を入力..."
            onKeyPress={(e) => e.key === 'Enter' && addItem()}
          />
          <button className="btn btn-primary" onClick={addItem}>
            <Plus size={20} /> 追加
          </button>
        </div>

        <div className="flex-col gap-2">
          {belongings.map(item => (
            <div key={item.id} className="flex items-center justify-between p-3 border rounded" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={item.isEssential} 
                  onChange={() => toggleEssential(item.id)} 
                  style={{ width: '1.2rem', height: '1.2rem' }}
                />
                <span style={{ fontWeight: item.isEssential ? '600' : '400' }}>{item.name}</span>
                {item.isEssential && <span className="text-sm" style={{ color: 'var(--danger)', background: '#FEF2F2', padding: '0.1rem 0.5rem', borderRadius: '1rem' }}>必須</span>}
              </div>
              <button className="btn-icon" onClick={() => removeItem(item.id)}>
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {belongings.length === 0 && (
            <p className="text-center text-muted mt-4">持ち物が登録されていません。</p>
          )}
        </div>
      </div>
    </div>
  );
}
