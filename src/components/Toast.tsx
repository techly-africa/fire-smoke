import { useState, useCallback, useEffect, useRef } from 'react';
import { C, F } from '../tokens';

export type ToastVariant = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

const VARIANT_STYLES: Record<ToastVariant, { border: string; color: string; icon: string }> = {
  success: { border: '#22c55e', color: '#4ade80', icon: '✓' },
  error:   { border: C.pink,    color: '#f87171', icon: '✕' },
  info:    { border: C.yellow,  color: C.yellow,  icon: '→' },
};

// ---------- individual toast ----------
function ToastCard({ item, onDone }: { item: ToastItem; onDone: () => void }) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    // mount → slide in
    const rAF = requestAnimationFrame(() => setVisible(true));

    // auto-dismiss after 3 s
    timerRef.current = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 300); // wait for slide-out animation
    }, 3000);

    return () => {
      cancelAnimationFrame(rAF);
      clearTimeout(timerRef.current);
    };
  }, [onDone]);

  const s = VARIANT_STYLES[item.variant];

  return (
    <div
      onClick={() => { setVisible(false); setTimeout(onDone, 300); }}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '14px 18px',
        background: C.panel,
        border: `1px solid ${s.border}`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px ${s.border}22`,
        cursor: 'pointer',
        minWidth: 260,
        maxWidth: 380,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.28s cubic-bezier(0.22,1,0.36,1), opacity 0.28s ease',
        userSelect: 'none',
      }}
    >
      {/* icon badge */}
      <div style={{
        width: 22,
        height: 22,
        borderRadius: '50%',
        border: `1.5px solid ${s.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 11,
        fontFamily: F.mono,
        color: s.color,
        flexShrink: 0,
        marginTop: 1,
      }}>
        {s.icon}
      </div>

      {/* message */}
      <span style={{
        fontFamily: F.mono,
        fontSize: 12,
        color: C.text,
        lineHeight: 1.5,
        letterSpacing: 0.2,
      }}>
        {item.message}
      </span>
    </div>
  );
}

// ---------- container + hook ----------
let _nextId = 1;

export function ToastContainer({ toasts, remove }: { toasts: ToastItem[]; remove: (id: number) => void }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: 28,
      right: 28,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      pointerEvents: 'none',
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{ pointerEvents: 'auto' }}>
          <ToastCard item={t} onDone={() => remove(t.id)} />
        </div>
      ))}
    </div>
  );
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, variant: ToastVariant = 'info') => {
    const id = _nextId++;
    setToasts(prev => [...prev, { id, message, variant }]);
  }, []);

  const remove = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, toast, remove };
}
