import React from 'react';
import { useShiori } from '../context/ShioriContext';
import { Plus, Trash2 } from 'lucide-react';

export default function Page10Roles() {
  const { data, updateSection } = useShiori();
  const roles = data.roles;

  const addRole = () => {
    const newRole = { id: Date.now().toString(), roleName: '新しいかかり', personName: '' };
    updateSection('roles', [...roles, newRole]);
  };

  const updateRole = (id, field, value) => {
    updateSection('roles', roles.map(r => 
      r.id === id ? { ...r, [field]: value } : r
    ));
  };

  const removeRole = (id) => {
    updateSection('roles', roles.filter(r => r.id !== id));
  };

  return (
    <div className="animation-fade-in">
      <div className="page-header">
        <h1>10. かかり（役割分担）</h1>
        <p className="text-muted">班長や保健係などの役割と、担当者を決めます。</p>
      </div>

      <div className="card mb-4">
        <button className="btn btn-primary mb-4" onClick={addRole}>
          <Plus size={20} /> かかりを追加
        </button>

        <div className="flex-col gap-2">
          {roles.map(role => (
            <div key={role.id} className="flex items-center gap-2 p-3 border rounded" style={{ borderColor: 'var(--border)' }}>
              <input 
                type="text" 
                value={role.roleName} 
                onChange={(e) => updateRole(role.id, 'roleName', e.target.value)} 
                placeholder="役割（例：班長）"
                style={{ flex: 1, fontWeight: 'bold' }}
              />
              <span className="text-muted">担当者:</span>
              <input 
                type="text" 
                value={role.personName} 
                onChange={(e) => updateRole(role.id, 'personName', e.target.value)} 
                placeholder="名前"
                style={{ flex: 2 }}
              />
              <button className="btn-icon" onClick={() => removeRole(role.id)}>
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {roles.length === 0 && (
            <p className="text-center text-muted mt-4">役割がありません。追加してください。</p>
          )}
        </div>
      </div>
    </div>
  );
}
