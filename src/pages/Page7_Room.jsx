import React, { useState } from 'react';
import { useShiori } from '../context/ShioriContext';
import { Plus, Trash2 } from 'lucide-react';

export default function Page7Room() {
  const { data, updateSection } = useShiori();
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
        <h1>7. 泊まる部屋</h1>
        <p className="text-muted">宿泊先の部屋番号と同室のメンバーを登録します。</p>
      </div>

      <div className="card mb-4">
        <div className="grid-2">
          <div className="form-group">
            <label>部屋番号 / 部屋名</label>
            <input 
              type="text" 
              name="roomNumber" 
              value={room.roomNumber} 
              onChange={handleRoomChange} 
              placeholder="例：302号室" 
            />
          </div>
          <div className="form-group">
            <label>定員</label>
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
          <label>同室のメンバー（{room.members.length} / {room.capacity} 人）</label>
          <div className="flex gap-2 mb-2">
            <input 
              type="text" 
              value={newMember} 
              onChange={(e) => setNewMember(e.target.value)} 
              placeholder="メンバーの名前..."
              onKeyPress={(e) => e.key === 'Enter' && addMember()}
              disabled={room.members.length >= room.capacity}
            />
            <button 
              className="btn btn-primary" 
              onClick={addMember}
              disabled={room.members.length >= room.capacity}
            >
              <Plus size={20} /> 追加
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
              <p className="text-center text-muted mt-2">メンバーが登録されていません。</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
