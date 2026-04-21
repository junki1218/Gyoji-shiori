import React from 'react';
import { useParams } from 'react-router-dom';
import { useShiori } from '../context/ShioriContext';

export default function PageCustom() {
  const { id } = useParams();
  const pageId = parseInt(id);
  const { data, updateSection } = useShiori();
  
  const customPages = data?.customPages || [];
  const pageIndex = customPages.findIndex(p => p.id === pageId);
  const page = customPages[pageIndex] || { title: `フリーページ ${pageId - 10}`, content: '' };

  const handleChange = (field, value) => {
    const newPages = [...customPages];
    if (pageIndex !== -1) {
      newPages[pageIndex] = { ...page, [field]: value };
    } else {
      // If page doesn't exist in state yet, add it
      newPages.push({ id: pageId, [field]: value });
    }
    updateSection('customPages', newPages);
  };

  return (
    <div className="animation-fade-in" key={pageId}>
      <div className="page-header">
        <div className="flex items-center gap-4">
          <h1 style={{ margin: 0 }}>{pageId}. </h1>
          <input 
            type="text" 
            value={page.title || ''} 
            onChange={(e) => handleChange('title', e.target.value)} 
            placeholder="ページタイトルを入力"
            style={{ fontSize: '1.5rem', fontWeight: 'bold', padding: '0.5rem', border: 'none', background: 'transparent', borderBottom: '2px dashed var(--border)', flex: 1 }}
          />
        </div>
        <p className="text-muted mt-2">自由に見出しと本文を作成できる拡張ページです。</p>
      </div>

      <div className="card">
        <textarea 
          value={page.content || ''} 
          onChange={(e) => handleChange('content', e.target.value)} 
          rows="15"
          placeholder="ここに内容を自由に入力してください..." 
          style={{ resize: 'vertical' }}
        />
      </div>
    </div>
  );
}
