import React, { useState, useRef } from 'react';
import { useShiori } from '../context/ShioriContext';
import { Plus, Trash2, Camera, Image as ImageIcon } from 'lucide-react';
import { t } from '../utils/i18n';
import ImageWithZoom from '../components/ImageWithZoom';

export default function Page4Belongings() {
  const { data, updateSection } = useShiori();
  const { useKanji } = data.settings;
  const belongings = data.belongings;
  const [newItem, setNewItem] = useState('');
  const fileInputRefs = useRef({});

  const addItem = () => {
    if (!newItem.trim()) return;
    const item = { id: Date.now().toString(), name: newItem, isEssential: false, image: null };
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

  return (
    <div className="animation-fade-in">
      <div className="page-header">
        <h1>{t(useKanji, '4. もちもの', '4. もちもの')}</h1>
        <p className="text-muted">
          {t(useKanji, '忘れ物がないように、持ち物リストを作成しましょう。', 'わすれものが ないように、もちものりすとを つくりましょう。')}
        </p>
      </div>

      <div className="card mb-4">
        <div className="flex gap-2 mb-4">
          <input 
            type="text" 
            value={newItem} 
            onChange={(e) => setNewItem(e.target.value)} 
            placeholder={t(useKanji, '新しい持ち物を入力...', 'あたらしい もちものを にゅうりょく...')}
            onKeyPress={(e) => e.key === 'Enter' && addItem()}
          />
          <button className="btn btn-primary" onClick={addItem}>
            <Plus size={20} /> {t(useKanji, '追加', 'ついか')}
          </button>
        </div>

        <div className="flex-col gap-3">
          {belongings.map(item => (
            <div key={item.id} className="flex items-center justify-between p-4 border rounded" style={{ borderColor: 'var(--border)', background: 'rgba(255,255,255,0.01)' }}>
              <div className="flex items-center gap-4" style={{ flex: 1 }}>
                <input 
                  type="checkbox" 
                  checked={item.isEssential} 
                  onChange={() => toggleEssential(item.id)} 
                  style={{ width: '1.2rem', height: '1.2rem' }}
                />
                <span style={{ fontWeight: item.isEssential ? '600' : '400', flex: 1 }}>{item.name}</span>
                
                <div className="flex items-center gap-2">
                  <ImageWithZoom src={item.image} onRemove={() => removeImage(item.id)} label={item.name} />
                  {!item.image && (
                    <button className="btn-icon" onClick={() => fileInputRefs.current[item.id].click()}>
                      <Camera size={20} />
                    </button>
                  )}
                  <input 
                    type="file" 
                    ref={el => fileInputRefs.current[item.id] = el}
                    onChange={(e) => handleImageUpload(item.id, e)}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                {item.isEssential && <span className="text-xs" style={{ color: 'var(--danger)', background: 'rgba(255,138,128,0.2)', padding: '0.1rem 0.5rem', borderRadius: '4px' }}>{t(useKanji, '必須', 'ひっす')}</span>}
                <button className="btn-icon" onClick={() => removeItem(item.id)}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {belongings.length === 0 && (
            <p className="text-center text-muted mt-4">{t(useKanji, '持ち物が登録されていません。', 'もちものが とうろくされていません。')}</p>
          )}
        </div>
      </div>
    </div>
  );
}
