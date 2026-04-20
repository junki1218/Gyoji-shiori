import React, { useState } from 'react';
import { useShiori } from '../context/ShioriContext';
import { Plus, Trash2 } from 'lucide-react';

export default function Page9PocketMoney() {
  const { data, updateSection } = useShiori();
  const pocketMoney = data.pocketMoney;
  const [newItem, setNewItem] = useState({ item: '', cost: '' });

  const handleBudgetChange = (e) => {
    updateSection('pocketMoney', { ...pocketMoney, budget: parseInt(e.target.value) || 0 });
  };

  const addExpense = () => {
    if (!newItem.item.trim() || !newItem.cost) return;
    const expense = { 
      id: Date.now().toString(), 
      item: newItem.item, 
      cost: parseInt(newItem.cost) 
    };
    updateSection('pocketMoney', { 
      ...pocketMoney, 
      expenses: [...pocketMoney.expenses, expense] 
    });
    setNewItem({ item: '', cost: '' });
  };

  const removeExpense = (id) => {
    updateSection('pocketMoney', { 
      ...pocketMoney, 
      expenses: pocketMoney.expenses.filter(ex => ex.id !== id) 
    });
  };

  const totalSpent = pocketMoney.expenses.reduce((acc, curr) => acc + curr.cost, 0);
  const remaining = pocketMoney.budget - totalSpent;

  return (
    <div className="animation-fade-in">
      <div className="page-header">
        <h1>9. お小遣い帳</h1>
        <p className="text-muted">予算と使ったお金を管理します。</p>
      </div>

      <div className="grid-2 mb-4">
        <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <h3 className="text-muted" style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>予算</h3>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>¥</span>
            <input 
              type="number" 
              value={pocketMoney.budget} 
              onChange={handleBudgetChange} 
              style={{ fontSize: '1.5rem', fontWeight: 'bold', border: 'none', borderBottom: '2px solid var(--border)', borderRadius: 0, padding: '0.2rem' }}
            />
          </div>
        </div>
        <div className="card" style={{ borderLeft: `4px solid ${remaining >= 0 ? 'var(--secondary)' : 'var(--danger)'}` }}>
          <h3 className="text-muted" style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>残り</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: remaining >= 0 ? 'inherit' : 'var(--danger)' }}>
            ¥ {remaining.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="mb-4">使ったお金リスト</h3>
        
        <div className="flex gap-2 mb-4">
          <input 
            type="text" 
            value={newItem.item} 
            onChange={(e) => setNewItem({...newItem, item: e.target.value})} 
            placeholder="買ったもの（例：お土産）"
            style={{ flex: 2 }}
          />
          <input 
            type="number" 
            value={newItem.cost} 
            onChange={(e) => setNewItem({...newItem, cost: e.target.value})} 
            placeholder="金額"
            style={{ flex: 1 }}
            onKeyPress={(e) => e.key === 'Enter' && addExpense()}
          />
          <button className="btn btn-primary" onClick={addExpense}>
            <Plus size={20} /> 記録
          </button>
        </div>

        <div className="flex-col gap-2">
          {pocketMoney.expenses.map(ex => (
            <div key={ex.id} className="flex items-center justify-between p-3 border rounded" style={{ borderColor: 'var(--border)' }}>
              <span>{ex.item}</span>
              <div className="flex items-center gap-4">
                <span style={{ fontWeight: 'bold' }}>¥ {ex.cost.toLocaleString()}</span>
                <button className="btn-icon" onClick={() => removeExpense(ex.id)}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {pocketMoney.expenses.length === 0 && (
            <p className="text-center text-muted mt-4">まだ使った記録がありません。</p>
          )}
        </div>
      </div>
    </div>
  );
}
