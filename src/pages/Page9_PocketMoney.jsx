import React, { useState } from 'react';
import { useShiori } from '../context/ShioriContext';
import { Plus, Trash2 } from 'lucide-react';
import { t } from '../utils/i18n';

export default function Page9PocketMoney() {
  const { data, updateSection } = useShiori();
  const { useKanji } = data.settings;
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
  const spendPercent = pocketMoney.budget > 0
    ? Math.min(100, Math.round((totalSpent / pocketMoney.budget) * 100))
    : 0;
  const isOver = remaining < 0;

  return (
    <div className="animation-fade-in">
      <div className="page-header">
        <h1>{t(useKanji, '9. お小遣い帳', '9. おこづかいちょう')}</h1>
        <p className="text-muted">
          {t(useKanji, '予算と使ったお金を管理します。', 'よさんと つかった おかねを かんりします。')}
        </p>
      </div>

      <div className="grid-2 mb-4">
        <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <h3 className="text-muted" style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{t(useKanji, '予算', 'よさん')}</h3>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>¥</span>
            <input
              type="number"
              value={pocketMoney.budget}
              onChange={handleBudgetChange}
              style={{ fontSize: '1.5rem', fontWeight: 'bold', border: 'none', borderBottom: '2px solid var(--border)', borderRadius: 0, padding: '0.2rem', background: 'transparent' }}
            />
          </div>
        </div>
        <div className="card" style={{ borderLeft: `4px solid ${isOver ? 'var(--danger)' : 'var(--secondary)'}` }}>
          <h3 className="text-muted" style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{t(useKanji, '残り', 'のこり')}</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: isOver ? 'var(--danger)' : 'inherit' }}>
            ¥ {remaining.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {t(useKanji, `使用額: ¥${totalSpent.toLocaleString()}`, `しようがく: ¥${totalSpent.toLocaleString()}`)}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {pocketMoney.budget > 0 && (
        <div className="card mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted">{t(useKanji, '予算の使用状況', 'よさんの しようじょうきょう')}</span>
            <span className="text-sm" style={{ color: isOver ? 'var(--danger)' : 'var(--text-main)', fontWeight: 'bold' }}>
              {spendPercent}%
            </span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '4px', height: '12px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${Math.min(100, spendPercent)}%`,
              background: isOver
                ? 'var(--danger)'
                : spendPercent > 80
                  ? '#FFA726'
                  : 'var(--secondary)',
              borderRadius: '4px',
              transition: 'width 0.5s ease, background 0.3s ease'
            }} />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted">¥0</span>
            <span className="text-xs text-muted">¥{pocketMoney.budget.toLocaleString()}</span>
          </div>
        </div>
      )}

      <div className="card">
        <h3 className="mb-4">{t(useKanji, '使ったお金リスト', 'つかった おかね りすと')}</h3>
        
        <div className="flex gap-2 mb-4">
          <input 
            type="text" 
            value={newItem.item} 
            onChange={(e) => setNewItem({...newItem, item: e.target.value})} 
            placeholder={t(useKanji, '買ったもの（例：お土産）', 'かったもの（れい：おみやげ）')}
            style={{ flex: 2 }}
          />
          <input 
            type="number" 
            value={newItem.cost} 
            onChange={(e) => setNewItem({...newItem, cost: e.target.value})} 
            placeholder={t(useKanji, '金額', 'きんがく')}
            style={{ flex: 1 }}
            onKeyDown={(e) => e.key === 'Enter' && addExpense()}
          />
          <button className="btn btn-primary" onClick={addExpense}>
            <Plus size={20} /> {t(useKanji, '記録', 'きろく')}
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
            <p className="text-center text-muted mt-4">{t(useKanji, 'まだ使った記録がありません。', 'まだ つかった きろくが ありません。')}</p>
          )}
        </div>
      </div>
    </div>
  );
}
