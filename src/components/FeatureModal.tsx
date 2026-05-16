import { useEffect, useState, useCallback } from 'react';
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
  total?: number;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

export function FeatureModal({ item, index, total, onClose, onPrev, onNext }: Props) {
  const [activePhoto, setActivePhoto] = useState(0);
  const [photoFading, setPhotoFading] = useState(false);
  const [visible, setVisible] = useState(false);

  // Entrance animation trigger
  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  // Reset photo when item changes
  useEffect(() => {
    setActivePhoto(0);
  }, [item]);

  const changePhoto = useCallback((idx: number) => {
    if (idx === activePhoto) return;
    setPhotoFading(true);
    setTimeout(() => {
      setActivePhoto(idx);
      setPhotoFading(false);
    }, 220);
  }, [activePhoto]);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 280);
  }, [onClose]);

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        const next = e.key === 'ArrowDown'
          ? (activePhoto + 1) % item.photos.length
          : (activePhoto - 1 + item.photos.length) % item.photos.length;
        changePhoto(next);
      }
    }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [handleClose, onNext, onPrev, activePhoto, item.photos.length, changePhoto]);

  const badge = `NEW/${String(index + 1).padStart(2, '0')}`;

  return (
    <>
      <style>{`
        @keyframes fm-backdrop-in  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes fm-backdrop-out { from { opacity: 1 } to { opacity: 0 } }
        @keyframes fm-panel-in  { from { opacity: 0; transform: translateY(32px) scale(0.97) } to { opacity: 1; transform: translateY(0) scale(1) } }
        @keyframes fm-panel-out { from { opacity: 1; transform: translateY(0) scale(1) } to { opacity: 0; transform: translateY(24px) scale(0.97) } }
        @keyframes fm-thumb-in { from { opacity: 0; transform: translateX(-8px) } to { opacity: 1; transform: translateX(0) } }
        @keyframes fm-content-in { from { opacity: 0; transform: translateX(16px) } to { opacity: 1; transform: translateX(0) } }
        @keyframes fm-badge-pop { 0%{transform:scale(0.7);opacity:0} 60%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} }
        .fm-thumb { transition: all 0.2s; border: 2px solid transparent; opacity: 0.55; cursor: pointer; overflow: hidden; }
        .fm-thumb:hover { opacity: 0.85; border-color: rgba(253,224,71,0.6); }
        .fm-thumb.active { opacity: 1; border-color: ${C.yellow}; }
        .fm-nav-btn { background: rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.15); color: #fff;
          width: 44px; height: 44px; cursor: pointer; font-size: 18px;
          display: flex; align-items: center; justify-content: center;
          backdrop-filter: blur(8px); transition: all 0.2s; }
        .fm-nav-btn:hover { background: ${C.yellow}; color: #000; border-color: ${C.yellow}; transform: scale(1.08); }
        .fm-feat-nav { background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.7); padding: 8px 20px; cursor: pointer;
          font-family: ${F.mono}; font-size: 11px; letter-spacing: 2px;
          backdrop-filter: blur(8px); transition: all 0.2s; }
        .fm-feat-nav:hover { color: #fff; border-color: rgba(255,255,255,0.4); }
        .fm-feat-nav:disabled { opacity: 0.25; cursor: default; }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 9000,
          background: 'rgba(0,0,0,0.88)',
          backdropFilter: 'blur(8px)',
          animation: `${visible ? 'fm-backdrop-in' : 'fm-backdrop-out'} 0.28s ease forwards`,
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 9001,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 'clamp(12px, 4vw, 40px)',
          pointerEvents: 'none',
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            pointerEvents: 'all',
            width: '100%', maxWidth: 960,
            background: '#0d0d0d',
            border: `1px solid rgba(253,224,71,0.3)`,
            boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(253,224,71,0.1)',
            display: 'grid',
            gridTemplateColumns: 'clamp(220px, 45%, 440px) 1fr',
            maxHeight: '88vh',
            overflow: 'hidden',
            animation: `${visible ? 'fm-panel-in' : 'fm-panel-out'} 0.28s cubic-bezier(0.22,1,0.36,1) forwards`,
          }}
        >
          {/* ── LEFT: Photo stack ── */}
          <div style={{ position: 'relative', background: '#000', display: 'flex', flexDirection: 'column' }}>
            {/* Main photo */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 280 }}>
              <img
                key={activePhoto}
                src={item.photos[activePhoto]}
                alt={`${item.title} photo ${activePhoto + 1}`}
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover', display: 'block',
                  opacity: photoFading ? 0 : 1,
                  transform: photoFading ? 'scale(1.03)' : 'scale(1)',
                  transition: 'opacity 0.22s ease, transform 0.22s ease',
                }}
              />
              {/* Gradient overlay at bottom */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
                background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
              }} />
              {/* Photo counter */}
              <div style={{
                position: 'absolute', bottom: 12, left: 16,
                fontFamily: F.mono, fontSize: 10, color: 'rgba(255,255,255,0.6)',
                letterSpacing: 2,
              }}>
                {String(activePhoto + 1).padStart(2, '0')} / {String(item.photos.length).padStart(2, '0')}
              </div>
              {/* Photo nav arrows */}
              {item.photos.length > 1 && (
                <div style={{
                  position: 'absolute', bottom: 8, right: 12,
                  display: 'flex', gap: 6,
                }}>
                  <button
                    className="fm-nav-btn"
                    onClick={() => changePhoto((activePhoto - 1 + item.photos.length) % item.photos.length)}
                    style={{ width: 32, height: 32, fontSize: 14 }}
                  >←</button>
                  <button
                    className="fm-nav-btn"
                    onClick={() => changePhoto((activePhoto + 1) % item.photos.length)}
                    style={{ width: 32, height: 32, fontSize: 14 }}
                  >→</button>
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            {item.photos.length > 1 && (
              <div style={{
                display: 'flex', gap: 4, padding: '8px',
                background: '#000', flexWrap: 'wrap',
              }}>
                {item.photos.map((src, i) => (
                  <div
                    key={i}
                    className={`fm-thumb${i === activePhoto ? ' active' : ''}`}
                    onClick={() => changePhoto(i)}
                    style={{
                      width: 52, height: 38,
                      animation: `fm-thumb-in 0.3s ease ${i * 60}ms both`,
                    }}
                  >
                    <img
                      src={src}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Content ── */}
          <div style={{
            display: 'flex', flexDirection: 'column',
            overflowY: 'auto',
            animation: 'fm-content-in 0.35s cubic-bezier(0.22,1,0.36,1) 0.08s both',
          }}>
            {/* Header bar */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{
                fontFamily: F.mono, fontSize: 10, color: C.yellow,
                letterSpacing: 3, fontWeight: 700,
                animation: 'fm-badge-pop 0.4s cubic-bezier(0.22,1,0.36,1) 0.15s both',
              }}>
                {badge}
              </div>
              <button
                onClick={handleClose}
                style={{
                  background: 'transparent', border: '1px solid rgba(255,255,255,0.15)',
                  color: 'rgba(255,255,255,0.5)', width: 32, height: 32,
                  cursor: 'pointer', fontSize: 18, lineHeight: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#ef4444';
                  (e.currentTarget as HTMLElement).style.color = '#ef4444';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)';
                  (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)';
                }}
              >×</button>
            </div>

            {/* Body */}
            <div style={{ padding: '28px 24px', flex: 1 }}>
              <h2 style={{
                fontFamily: F.display,
                fontSize: 'clamp(22px, 3vw, 36px)',
                color: '#fff', margin: '0 0 10px',
                lineHeight: 1.05, letterSpacing: -1,
              }}>
                {item.title}
              </h2>

              <p style={{
                fontFamily: F.mono, fontSize: 13,
                color: C.yellow, margin: '0 0 20px',
                lineHeight: 1.5, fontWeight: 600,
              }}>
                {item.sub}
              </p>

              {/* Yellow rule */}
              <div style={{
                width: 36, height: 3, background: C.yellow,
                marginBottom: 20,
                boxShadow: `0 0 8px ${C.yellow}`,
              }} />

              <p style={{
                fontFamily: F.mono, fontSize: 14,
                color: 'rgba(255,255,255,0.65)',
                lineHeight: 1.85, margin: 0,
              }}>
                {item.detail}
              </p>
            </div>

            {/* Feature navigation */}
            {(onPrev || onNext) && (
              <div style={{
                display: 'flex', gap: 8, padding: '16px 24px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
              }}>
                <button className="fm-feat-nav" onClick={onPrev} disabled={!onPrev}>
                  ← PREV
                </button>
                <button className="fm-feat-nav" onClick={onNext} disabled={!onNext}>
                  NEXT →
                </button>
                {total && (
                  <span style={{
                    fontFamily: F.mono, fontSize: 10,
                    color: 'rgba(255,255,255,0.3)', marginLeft: 'auto',
                    alignSelf: 'center', letterSpacing: 1,
                  }}>
                    {index + 1} / {total}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
