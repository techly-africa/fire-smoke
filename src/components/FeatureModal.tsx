import { useEffect } from 'react';
import { C, F } from '../tokens';

interface FeatureItem {
  icon: string;
  title: string;
  sub: string;
  detail: string;
  photos: string[];
}

interface Props {
  item: FeatureItem;
  index: number;
  onClose: () => void;
}

export function FeatureModal({ item, index, onClose }: Props) {
  // Close on Escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const badge = `NEW/${String(index + 1).padStart(2, '0')}`;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(16px, 5vw, 48px)',
        animation: 'fs-modal-in 0.25s ease',
      }}
    >
      <style>{`
        @keyframes fs-modal-in {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* Modal panel — stopPropagation prevents backdrop close */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: C.bg,
          border: `2px solid ${C.yellow}`,
          width: '100%',
          maxWidth: 780,
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 16, zIndex: 10,
            background: 'transparent', border: `1px solid ${C.border}`,
            color: C.dim, width: 36, height: 36,
            cursor: 'pointer', fontSize: 20, lineHeight: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          ×
        </button>

        {/* Photos */}
        {item.photos && item.photos.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: item.photos.length === 1 ? '1fr' : 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 2,
          }}>
            {item.photos.map((src, i) => (
              <div key={i} style={{ aspectRatio: '16/10', overflow: 'hidden', background: '#111' }}>
                <img
                  src={src}
                  alt={`${item.title} photo ${i + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s', cursor: 'zoom-in' }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                />
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        <div style={{ padding: 'clamp(20px, 4vw, 40px)' }}>
          <div style={{
            fontFamily: F.mono, fontSize: 10, color: C.yellow,
            letterSpacing: 3, fontWeight: 700, marginBottom: 12,
          }}>
            {badge}
          </div>

          <h2 style={{
            fontFamily: F.display,
            fontSize: 'clamp(24px, 4vw, 40px)',
            color: C.text, margin: '0 0 12px',
            lineHeight: 1.05, letterSpacing: -1,
          }}>
            {item.title}
          </h2>

          <p style={{
            fontFamily: F.mono, fontSize: 14, color: C.yellow,
            margin: '0 0 20px', lineHeight: 1.5,
          }}>
            {item.sub}
          </p>

          <div style={{
            width: 40, height: 2, background: C.yellow, marginBottom: 20,
          }} />

          <p style={{
            fontFamily: F.mono, fontSize: 15, color: C.dim,
            lineHeight: 1.8, margin: 0,
          }}>
            {item.detail}
          </p>
        </div>
      </div>
    </div>
  );
}
