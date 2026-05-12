import { useState, useMemo } from 'react';
import type { Tier } from '../data';
import { C, F } from '../tokens';

interface Props {
  tier: Tier;
  qty: number;
  total: number;
  onClose: () => void;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  friend: string;
}

export function Checkout({ tier, qty, total, onClose }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState<FormState>({ name: '', email: '', phone: '', friend: '' });
  const [paying, setPaying] = useState(false);
  const ref = useMemo(() => 'FS' + Math.floor(100_000 + Math.random() * 900_000), []);

  function submit() {
    setPaying(true);
    setTimeout(() => { setPaying(false); setStep(3); }, 1600);
  }

  const canContinue = form.name.trim() !== '' && form.email.trim() !== '';

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        style={{ background: C.bg, color: C.text, width: '100%', maxWidth: 520, maxHeight: '95dvh', overflowY: 'auto', padding: 22, position: 'relative', border: `3px solid ${C.yellow}`, borderBottom: 'none' }}
        onClick={e => e.stopPropagation()}
      >
        {/* header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <span style={{ fontFamily: F.heavy, fontSize: 14, color: C.yellow, letterSpacing: 1 }}>FIRE &amp; SMOKE</span>
          <button style={{ background: 'transparent', border: 'none', color: C.dim, fontFamily: F.mono, fontSize: 12, cursor: 'pointer', letterSpacing: 1.5, fontWeight: 700 }} onClick={onClose}>× CLOSE</button>
        </div>

        {/* step indicator */}
        {step !== 3 && (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 16 }}>
            {(['01 · YOU', '02 · PAY', '03 · GO'] as const).map((label, i) => (
              <>
                {i > 0 && <span key={`sep-${i}`} style={{ fontFamily: F.mono, fontSize: 10, color: C.dim }}>////</span>}
                <span key={label} style={{ fontFamily: F.mono, fontSize: 10, letterSpacing: 1.5, fontWeight: 700, color: step > i ? C.yellow : C.dim }}>
                  {label}
                </span>
              </>
            ))}
          </div>
        )}

        {step === 1 && (
          <>
            <h3 style={{ fontFamily: F.display, fontSize: 28, margin: '0 0 14px', letterSpacing: -0.5, lineHeight: 1 }}>WHO'S COMING?</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 14, background: C.panel, color: C.yellow, fontFamily: F.mono, fontSize: 14, fontWeight: 700, marginBottom: 16 }}>
              <span>{tier.name}{tier.id !== 'duo' && qty > 1 ? ` × ${qty}` : ''}</span>
              <strong>{total.toLocaleString()} RWF</strong>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {([
                { key: 'name'  as const, label: 'NAME',   ph: 'Your full name' },
                { key: 'email' as const, label: 'EMAIL',  ph: 'you@email.com' },
                { key: 'phone' as const, label: 'PHONE',  ph: '+250 …' },
              ] as { key: keyof FormState; label: string; ph: string }[]).map(({ key, label, ph }) => (
                <label key={key} style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: F.mono, fontSize: 10, letterSpacing: 2, color: C.yellow, fontWeight: 700 }}>
                  {label}
                  <input
                    value={form[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={ph}
                    style={{ padding: 12, border: `2px solid ${C.yellow}`, background: C.panel, color: C.text, fontFamily: F.mono, fontSize: 14, outline: 'none', width: '100%' }}
                  />
                </label>
              ))}
              {tier.id === 'duo' && (
                <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: F.mono, fontSize: 10, letterSpacing: 2, color: C.yellow, fontWeight: 700 }}>
                  FRIEND
                  <input
                    value={form.friend}
                    onChange={e => setForm(f => ({ ...f, friend: e.target.value }))}
                    placeholder="Who you bringing?"
                    style={{ padding: 12, border: `2px solid ${C.yellow}`, background: C.panel, color: C.text, fontFamily: F.mono, fontSize: 14, outline: 'none', width: '100%' }}
                  />
                </label>
              )}
            </div>
            <button
              style={{ width: '100%', marginTop: 18, background: C.pink, color: C.bg, border: 'none', padding: 16, fontFamily: F.heavy, fontSize: 14, letterSpacing: 2, cursor: canContinue ? 'pointer' : 'not-allowed', opacity: canContinue ? 1 : 0.5 }}
              onClick={() => setStep(2)}
              disabled={!canContinue}
            >
              CONTINUE TO PAYMENT ↗
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h3 style={{ fontFamily: F.display, fontSize: 28, margin: '0 0 14px', letterSpacing: -0.5, lineHeight: 1 }}>PAY {total.toLocaleString()} RWF</h3>
            <div style={{ padding: 16, background: '#fafafa', color: C.bg, border: `2px solid ${C.yellow}`, marginTop: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontFamily: F.heavy, fontSize: 16, color: '#f5a623' }}>flutterwave</span>
                <span style={{ fontFamily: F.mono, fontSize: 10, color: '#78716c', letterSpacing: 1 }}>🔒 SSL</span>
              </div>
              <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
                {['CARD', 'MTN MOMO', 'AIRTEL'].map((t, i) => (
                  <button key={t} style={{ flex: 1, padding: '10px 6px', background: i === 0 ? C.bg : '#fff', color: i === 0 ? C.yellow : C.bg, border: `1px solid ${C.bg}`, fontFamily: F.mono, fontSize: 10, fontWeight: 700, letterSpacing: 1, cursor: 'pointer' }}>
                    {t}
                  </button>
                ))}
              </div>
              <input defaultValue="4242 4242 4242 4242" placeholder="Card number" style={{ padding: 12, border: `1px solid ${C.bg}`, background: '#fff', fontFamily: F.mono, fontSize: 14, outline: 'none', width: '100%', marginBottom: 8, display: 'block' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <input defaultValue="05/27" placeholder="MM/YY" style={{ padding: 12, border: `1px solid ${C.bg}`, background: '#fff', fontFamily: F.mono, fontSize: 14, outline: 'none', width: '100%' }} />
                <input defaultValue="123" placeholder="CVV" style={{ padding: 12, border: `1px solid ${C.bg}`, background: '#fff', fontFamily: F.mono, fontSize: 14, outline: 'none', width: '100%' }} />
              </div>
              <button
                style={{ width: '100%', background: C.bg, color: C.yellow, border: 'none', padding: 14, fontFamily: F.heavy, fontSize: 13, letterSpacing: 2, cursor: paying ? 'not-allowed' : 'pointer', marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                onClick={submit}
                disabled={paying}
              >
                {paying ? (
                  <>
                    <span className="spin-icon" />
                    PROCESSING…
                  </>
                ) : (
                  `PAY ${total.toLocaleString()} RWF ↗`
                )}
              </button>
            </div>
            <button
              style={{ marginTop: 12, background: 'transparent', border: 'none', color: C.dim, fontFamily: F.mono, fontSize: 11, letterSpacing: 2, cursor: 'pointer', fontWeight: 700, display: 'block' }}
              onClick={() => setStep(1)}
            >← BACK</button>
          </>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '6px 0' }}>
            <div style={{ fontFamily: F.display, fontSize: 36, color: C.yellow, lineHeight: 1, letterSpacing: -1 }}>✓ YOU'RE IN</div>
            <div style={{ fontFamily: F.mono, fontSize: 14, color: C.text, marginTop: 8, fontWeight: 700 }}>See you in the pines.</div>
            <div style={{ marginTop: 18, background: '#fafafa', color: C.bg, border: `2px solid ${C.bg}` }}>
              <div style={{ background: C.bg, color: C.yellow, padding: '8px 12px', fontFamily: F.mono, fontSize: 11, fontWeight: 700, letterSpacing: 2 }}>
                FIRE &amp; SMOKE · VOL.02 · 30 MAY 2026
              </div>
              <div style={{ padding: 14, display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, textAlign: 'left' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { k: 'NAME', v: form.name },
                    { k: 'TIER', v: tier.name },
                    { k: 'REF',  v: ref },
                  ].map(({ k, v }) => (
                    <div key={k}>
                      <div style={{ fontFamily: F.mono, fontSize: 9, letterSpacing: 2, color: C.dim, fontWeight: 700 }}>{k}</div>
                      <div style={{ fontFamily: F.heavy, fontSize: 13, color: C.bg, marginTop: 2 }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ width: 72, height: 72, display: 'grid', gridTemplateColumns: 'repeat(8,1fr)', gridTemplateRows: 'repeat(8,1fr)', padding: 2, background: '#fff', border: `1px solid ${C.bg}` }}>
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div key={i} style={{ background: (i * 7) % 5 > 1 ? C.bg : 'transparent' }} />
                  ))}
                </div>
              </div>
              <div style={{ background: C.bg, color: C.yellow, padding: '10px 12px', fontFamily: F.mono, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textAlign: 'center' }}>
                SCAN AT GATE · DON'T LOSE THIS
              </div>
            </div>
            <button
              style={{ width: '100%', marginTop: 16, background: C.pink, color: C.bg, border: 'none', padding: 16, fontFamily: F.heavy, fontSize: 14, letterSpacing: 2, cursor: 'pointer' }}
              onClick={onClose}
            >CLOSE</button>
          </div>
        )}
      </div>
    </div>
  );
}
