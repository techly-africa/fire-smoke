import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './App';

// ── WWW → apex self-heal ────────────────────────────────────────
// If a stale SW got registered on www.fireandsmoke.rw, unregister
// it and redirect to the canonical apex domain so Supabase CORS
// and the Vercel redirect both work cleanly.
if (window.location.hostname === 'www.fireandsmoke.rw') {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(regs => {
      regs.forEach(r => r.unregister());
    });
  }
  const target =
    'https://fireandsmoke.rw' +
    window.location.pathname +
    window.location.search;
  window.location.replace(target);
} else {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
