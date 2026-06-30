import React, { useState, useRef } from 'react';
import { useShiori } from '../context/ShioriContext';
import { CheckCircle2, Circle, Star, Trash2, Camera } from 'lucide-react';
import { t } from '../utils/i18n';
import ImageWithZoom from '../components/ImageWithZoom';

export default function Page4Belongings() {
  const { data, updateSection } = useShiori();
  const { useKanji } = data.settings;
  const belongings = data.belongings;
  const [newItem, setNewItem] = useState('');
  const [recentlyPacked, setRecentlyPacked] = useState(new Set());
  const fileInputRefs = useRef({});

  const addItem = () => {
    if (!newItem.trim()) return;
    const item = { id: Date.now().toString(), name: newItem, isEssential: false, packed: false, image: null };
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

  const togglePacked = (id) => {
    const item = belongings.find(b => b.id === id);
    const willBePacked = !(item?.packed ?? false);
    updateSection('belongings', belongings.map(b =>
      b.id === id ? { ...b, packed: !(b.packed ?? false) } : b
    ));
    if (willBePacked) {
      setRecentlyPacked(prev => new Set([...prev, id]));
      setTimeout(() => {
        setRecentlyPacked(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }, 900);
    }
  };

  const handleImageUpload = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateSection('belongings', belongings.map(item =>
          item.id === id ? { ...item, image: reader.result } : item
        ));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (id) => {
    updateSection('belongings', belongings.map(item =>
      item.id === id ? { ...item, image: null } : item
    ));
  };

  const totalItems = belongings.length;
  const packedCount = belongings.filter(b => b.packed ?? false).length;
  const progressPct = totalItems > 0 ? Math.round((packedCount / totalItems) * 100) : 0;

  const sortedBelongings = [...belongings].sort((a, b) => {
    if (a.isEssential && !b.isEssential) return -1;
    if (!a.isEssential && b.isEssential) return 1;
    return 0;
  });

  return (
    <div className="animation-fade-in">
      <div className="page-header">
        <h1>{t(useKanji, '4. もちもの', '4. もちもの')}</h1>
        <p className="text-muted">
          {t(useKanji, '忘れ物がないように、持ち物リストを作成しましょう。', 'わすれものが ないように、もちものりすとを つくりましょう。')}
        </p>
      </div>

      {totalItems > 0 && (
        <div className="card mb-4">
          <div className="flex justify-between items-center mb-2">
            <span style={{ fontSize: '1rem', fontWeight: 600 }}>
              {t(useKanji, '準備できた', 'じゅんびできた')}
            </span>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: progressPct === 100 ? 'var(--secondary)' : 'var(--primary)' }}>
              {packedCount} / {totalItems}
            </span>
          </div>
          <div className="belongings-progress-track">
            <div
              className="belongings-progress-bar"
              style={{
                width: `${progressPct}%`,
                background: progressPct === 100 ? 'var(--secondary)' : progressPct > 80 ? '#FFB74D' : 'var(--primary)',
              }}
            />
          </div>
          {progressPct === 100 && (
            <p style={{ textAlign: 'center', marginTop: '0.5rem', color: 'var(--secondary)', fontWeight: 600, fontSize: '1.1rem' }}>
              🎒 {t(useKanji, '準備完了！', 'じゅんびかんりょう！')}
            </p>
          )}
        </div>
      )}

      <div className="card mb-4">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder={t(useKanji, '新しい持ち物を入力...', 'あたらしい もちものを にゅうりょく...')}
            onKeyDown={(e) => e.key === 'Enter' && addItem()}
          />
          <button className="btn btn-primary" onClick={addItem} style={{ whiteSpace: 'nowrap' }}>
            + {t(useKanji, '追加', 'ついか')}
          </button>
        </div>

        <div className="flex-col gap-2">
          {sortedBelongings.map(item => (
            <div
              key={item.id}
              className={`belonging-item${(item.packed ?? false) ? ' belonging-packed' : ''}${recentlyPacked.has(item.id) ? ' belonging-flash' : ''}`}
              onClick={() => togglePacked(item.id)}
              role="checkbox"
              aria-checked={item.packed ?? false}
              tabIndex={0}
              onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && togglePacked(item.id)}
            >
              <div className="belonging-check">
                {(item.packed ?? false)
                  ? <CheckCircle2 size={34} strokeWidth={2.5} color="var(--secondary)" />
                  : <Circle size={34} strokeWidth={2} color="rgba(255,255,255,0.3)" />
                }
              </div>

              <span className="belonging-name">{item.name}</span>

              {item.image && (
                <div onClick={e => e.stopPropagation()}>
                  <ImageWithZoom src={item.image} onRemove={() => removeImage(item.id)} label={item.name} />
                </div>
              )}

              <div className="belonging-actions" onClick={e => e.stopPropagation()}>
                {item.isEssential && (
                  <span className="belonging-essential">{t(useKanji, '必須', 'ひっす')}</span>
                )}
                <button
                  className="btn-icon"
                  onClick={() => toggleEssential(item.id)}
                  title={t(useKanji, item.isEssential ? '必須を解除' : '必須にする', item.isEssential ? 'ひっすを かいじょ' : 'ひっすにする')}
                  style={{ color: item.isEssential ? '#FFB74D' : 'rgba(255,255,255,0.3)' }}
                >
                  <Star size={18} fill={item.isEssential ? '#FFB74D' : 'none'} />
                </button>
                {!item.image && (
                  <button className="btn-icon" onClick={() => fileInputRefs.current[item.id]?.click()}>
                    <Camera size={18} />
                  </button>
                )}
                <button className="btn-icon" onClick={() => removeItem(item.id)}>
                  <Trash2 size={18} />
                </button>
                <input
                  type="file"
                  ref={el => fileInputRefs.current[item.id] = el}
                  onChange={(e) => handleImageUpload(item.id, e)}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </div>
            </div>
          ))}
          {belongings.length === 0 && (
            <p className="text-center text-muted mt-4">
              {t(useKanji, '持ち物が登録されていません。', 'もちものが とうろくされていません。')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
