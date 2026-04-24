import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useShiori } from '../context/ShioriContext';
import { t } from '../utils/i18n';
import { MessageCircle, Image as ImageIcon, Upload, Trash2, X } from 'lucide-react';

export default function PageCustom() {
  const { id } = useParams();
  const pageId = parseInt(id);
  const { data, updateSection } = useShiori();
  const { useKanji } = data.settings;
  
  const customPages = data?.customPages || [];
  const pageIndex = customPages.findIndex(p => p.id === pageId);
  const page = customPages[pageIndex] || { id: pageId, title: '', bgImage: null, comments: [] };

  const [commentMode, setCommentMode] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);

  const updatePage = (updates) => {
    const newPages = [...customPages];
    if (pageIndex !== -1) {
      newPages[pageIndex] = { ...page, ...updates };
    } else {
      newPages.push({ ...page, ...updates });
    }
    updateSection('customPages', newPages);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePage({ bgImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContainerClick = (e) => {
    if (!commentMode || !page.bgImage) return;
    
    // Prevent adding new bubble if clicking an existing one or editing
    if (e.target.closest('.comment-bubble') || editingCommentId) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newComment = {
      id: Date.now().toString(),
      x,
      y,
      text: 'メモを入力'
    };

    updatePage({ comments: [...(page.comments || []), newComment] });
    setEditingCommentId(newComment.id);
  };

  const handleCommentDoubleClick = (id) => {
    setEditingCommentId(id);
  };

  const updateCommentText = (id, text) => {
    const newComments = (page.comments || []).map(c => 
      c.id === id ? { ...c, text } : c
    );
    updatePage({ comments: newComments });
  };

  const deleteComment = (id) => {
    updatePage({ comments: (page.comments || []).filter(c => c.id !== id) });
    setEditingCommentId(null);
  };

  return (
    <div className="animation-fade-in" key={pageId}>
      <div className="page-header flex justify-between items-center">
        <div className="flex items-center gap-4 flex-1">
          <h1 style={{ margin: 0 }}>{pageId}. </h1>
          <input 
            type="text" 
            value={page.title || ''} 
            onChange={(e) => updatePage({ title: e.target.value })} 
            placeholder={t(useKanji, 'ページタイトルを入力', 'ぺーじ たいとるを にゅうりょく')}
            style={{ fontSize: '1.5rem', fontWeight: 'bold', padding: '0.5rem', border: 'none', background: 'transparent', borderBottom: '2px dashed var(--border)', flex: 1 }}
          />
        </div>
        <div className="flex gap-2">
          <button 
            className={`btn ${commentMode ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setCommentMode(!commentMode)}
            disabled={!page.bgImage}
          >
            <MessageCircle size={20} />
            {commentMode ? 'コメントモードON' : 'コメントモードOFF'}
          </button>
          <button className="btn btn-secondary" onClick={() => fileInputRef.current.click()}>
            <Upload size={20} />
            画像を選択
          </button>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>
      </div>

      <div 
        ref={containerRef}
        onClick={handleContainerClick}
        className="custom-page-container"
        style={{
          width: '100%',
          maxWidth: '800px',
          margin: '0 auto',
          aspectRatio: '1 / 1.414', // A4 Aspect Ratio
          background: page.bgImage ? `url(${page.bgImage})` : 'rgba(255,255,255,0.05)',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          position: 'relative',
          border: '2px dashed var(--border)',
          borderRadius: '8px',
          overflow: 'hidden',
          cursor: commentMode ? 'crosshair' : 'default'
        }}
      >
        {!page.bgImage && (
          <div className="flex-col items-center justify-center h-full text-muted">
            <ImageIcon size={64} strokeWidth={1} />
            <p className="mt-4">A4縦の画像を読み込んでください</p>
          </div>
        )}

        {page.bgImage && (page.comments || []).map(comment => (
          <div 
            key={comment.id}
            className="comment-bubble"
            onDoubleClick={() => handleCommentDoubleClick(comment.id)}
            style={{
              position: 'absolute',
              left: `${comment.x}%`,
              top: `${comment.y}%`,
              transform: 'translate(-50%, -100%)',
              background: 'white',
              color: 'black',
              padding: '0.5rem 1rem',
              borderRadius: '20px 20px 20px 0',
              fontSize: '0.8rem',
              boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
              maxWidth: '200px',
              wordBreak: 'break-word',
              zIndex: editingCommentId === comment.id ? 100 : 10,
              border: '2px solid var(--primary)'
            }}
          >
            {editingCommentId === comment.id ? (
              <div className="flex-col gap-2">
                <textarea 
                  autoFocus
                  value={comment.text}
                  onChange={(e) => updateCommentText(comment.id, e.target.value)}
                  style={{ width: '100%', border: '1px solid #ccc', borderRadius: '4px', padding: '0.2rem', background: 'white', color: 'black' }}
                />
                <div className="flex justify-between">
                  <button className="text-danger" onClick={() => deleteComment(comment.id)}><Trash2 size={14}/></button>
                  <button className="text-primary" onClick={() => setEditingCommentId(null)}>完了</button>
                </div>
              </div>
            ) : (
              comment.text
            )}
            <div style={{
              position: 'absolute',
              bottom: '-10px',
              left: '0',
              width: 0, height: 0,
              borderTop: '10px solid white',
              borderRight: '10px solid transparent'
            }}></div>
          </div>
        ))}
      </div>

      {page.bgImage && (
        <p className="text-center text-muted mt-4 text-sm">
          画像の上をクリックして吹き出しを追加できます。ダブルクリックで内容を編集できます。
        </p>
      )}

      <style>{`
        .custom-page-container {
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          transition: all 0.3s ease;
        }
        .comment-bubble {
          animation: popIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          user-select: none;
        }
        @keyframes popIn {
          from { transform: translate(-50%, -100%) scale(0.5); opacity: 0; }
          to { transform: translate(-50%, -100%) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
