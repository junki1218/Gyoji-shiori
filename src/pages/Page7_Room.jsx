import React, { useState } from 'react';
import { useShiori } from '../context/ShioriContext';
import { Plus, Trash2 } from 'lucide-react';
import { t } from '../utils/i18n';

export default function Page7Room() {
  const { data, updateSection } = useShiori();
  const { useKanji } = data.settings;
  const room = data.room;
  const [newMember, setNewMember] = useState('');

  const handleRoomChange = (e) => {
    const { name, value } = e.target;
    updateSection('room', { ...room, [name]: value });
  };

  const addMember = () => {
    if (!newMember.trim()) return;
    updateSection('room', { ...room, members: [...room.members, newMember] });
    setNewMember('');
  };

  const removeMember = (index) => {
    const newMembers = [...room.members];
    newMembers.splice(index, 1);
    updateSection('room', { ...room, members: newMembers });
  };

  return (
    <div className="animation-fade-in">
      <div className="page-header">
        <h1>{t(useKanji, '7. 泊まる部屋', '7. とまるへや')}</h1>
        <p className="text-muted">
          {t(useKanji, '宿泊先の部屋番号と同室のメンバーを登録します。', 'しゅくはくさきの へやばんごうと どうしつの めんばーを とうろくします。')}
        </p>
      </div>

      <div className="card mb-4">
        <div className="grid-2">
          <div className="form-group">
            <label>{t(useKanji, '部屋番号 / 部屋名', 'へやばんごう / へやめい')}</label>
            <input 
              type="text" 
              name="roomNumber" 
              value={room.roomNumber} 
              onChange={handleRoomChange} 
              placeholder={t(useKanji, '例：302号室', 'れい：302ごうしつ')} 
            />
          </div>
          <div className="form-group">
            <label>{t(useKanji, '定員', 'ていいん')}</label>
            <input 
              type="number" 
              name="capacity" 
              value={room.capacity} 
              onChange={handleRoomChange} 
              min="1"
            />
          </div>
        </div>

        <div className="form-group mt-4">
          <label>{t(useKanji, `同室のメンバー（${room.members.length} / ${room.capacity} 人）`, `おなじへやの めんばー（${room.members.length} / ${room.capacity} にん）`)}</label>
          <div className="flex gap-2 mb-2">
            <input 
              type="text" 
              value={newMember} 
              onChange={(e) => setNewMember(e.target.value)} 
              placeholder={t(useKanji, 'メンバーの名前...', 'めんばーの なまえ...')}
              onKeyPress={(e) => e.key === 'Enter' && addMember()}
              disabled={room.members.length >= room.capacity}
            />
            <button 
              className="btn btn-primary" 
              onClick={addMember}
              disabled={room.members.length >= room.capacity}
            >
              <Plus size={20} /> {t(useKanji, '追加', 'ついか')}
            </button>
          </div>

          <div className="flex-col gap-2 mt-4">
            {room.members.map((member, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded" style={{ borderColor: 'var(--border)' }}>
                <span>{member}</span>
                <button className="btn-icon" onClick={() => removeMember(index)}>
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {room.members.length === 0 && (
              <p className="text-center text-muted mt-2">{t(useKanji, 'メンバーが登録されていません。', 'めんばーが とうろくされていません。')}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
