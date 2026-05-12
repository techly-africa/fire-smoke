import { useState } from 'react';
import { C, F } from '../tokens';

interface AdminLoginProps {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this should be verified via Supabase Auth or a secure backend.
    // For this prototype, we'll use a hardcoded password as a gate.
    if (password === 'FS-ADMIN-2026') {
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div style={{ 
      background: `radial-gradient(circle at 50% 50%, #1a1a1a 0%, ${C.bg} 100%)`, 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      color: C.text,
      fontFamily: F.mono,
      padding: 20
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: 400, 
        background: C.panel, 
        border: `3px solid ${C.yellow}`, 
        padding: 40,
        boxShadow: '20px 20px 0 rgba(0,0,0,0.5)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative elements */}
        <div style={{ position: 'absolute', top: -10, right: -10, background: C.yellow, color: C.bg, padding: '4px 20px', transform: 'rotate(45deg)', fontFamily: F.heavy, fontSize: 10 }}>
          SECURE_ACCESS
        </div>

        <h1 style={{ fontFamily: F.display, fontSize: 32, color: C.yellow, margin: '0 0 8px' }}>ADMIN_PORTAL</h1>
        <p style={{ color: C.dim, fontSize: 13, marginBottom: 32, lineHeight: 1.5 }}>
          Enter authorization code to manage event bookings and payment verifications.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 11, color: C.dim, marginBottom: 8, letterSpacing: 1 }}>ACCESS_KEY</label>
            <input 
              type="password" 
              autoFocus
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••••"
              style={{ 
                width: '100%', 
                padding: '16px', 
                background: '#0a0a0a', 
                border: `1px solid ${error ? C.pink : C.border}`, 
                color: error ? C.pink : C.text,
                fontFamily: F.mono,
                fontSize: 16,
                outline: 'none',
                transition: 'all 0.2s'
              }}
            />
            {error && (
              <div style={{ color: C.pink, fontSize: 10, marginTop: 8, fontWeight: 700 }}>INVALID_CREDENTIALS_RETRY</div>
            )}
          </div>

          <button 
            type="submit"
            style={{ 
              width: '100%', 
              padding: '16px', 
              background: C.yellow, 
              color: C.bg, 
              border: 'none', 
              fontFamily: F.heavy, 
              fontSize: 14, 
              cursor: 'pointer',
              letterSpacing: 2,
              transition: 'transform 0.1s'
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            AUTHORIZE()
          </button>
        </form>

        <div style={{ marginTop: 40, borderTop: `1px solid ${C.border}`, paddingTop: 20, textAlign: 'center' }}>
          <button 
            onClick={() => window.location.href = '/'}
            style={{ background: 'transparent', border: 'none', color: C.dim, fontSize: 11, cursor: 'pointer', textDecoration: 'underline' }}
          >
            RETURN_TO_SITE
          </button>
        </div>
      </div>
    </div>
  );
}
