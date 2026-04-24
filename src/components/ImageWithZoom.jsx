import React, { useState } from 'react';
import { X, ImageIcon } from 'lucide-react';

export default function ImageWithZoom({ src, onRemove, label = "" }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!src) return null;

  return (
    <>
      <div 
        className="image-thumbnail"
        onClick={() => setIsOpen(true)}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '4px',
          overflow: 'hidden',
          cursor: 'pointer',
          border: '2px solid var(--border)',
          position: 'relative'
        }}
      >
        <img src={src} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      {isOpen && (
        <div 
          className="image-modal-overlay"
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(5px)',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <div className="relative" style={{ maxWidth: '90%', maxHeight: '90%' }}>
            <img 
              src={src} 
              alt={label} 
              style={{ width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '90vh', borderRadius: '8px', border: '2px solid white' }} 
            />
            <button 
              className="btn-icon" 
              onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
              style={{ position: 'absolute', top: '-40px', right: '-40px', color: 'white' }}
            >
              <X size={32} />
            </button>
            {onRemove && (
              <button 
                className="btn btn-danger" 
                onClick={(e) => { e.stopPropagation(); onRemove(); setIsOpen(false); }}
                style={{ position: 'absolute', bottom: '-50px', left: '50%', transform: 'translateX(-50%)' }}
              >
                画像を削除
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
