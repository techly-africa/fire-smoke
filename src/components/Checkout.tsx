import { useState, Fragment } from 'react';
import type { Tier } from '../data';
import { C, F } from '../tokens';
import { bookingService } from '../services/bookingService';

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
  reference: string;
}

export function Checkout({ tier, qty, total, onClose }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState<FormState>({ name: '', email: '', phone: '', friend: '', reference: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setIsSubmitting(true);
    setError(null);
    try {
      await bookingService.submitBooking({
        full_name: form.name,
        email: form.email,
        phone: form.phone,
        tier_id: tier.id,
        quantity: qty,
        total_price: total,
        momo_reference: form.reference,
      });
      setStep(3);
    } catch (err: any) {
      setError(err.message || 'Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const canContinue = form.name.trim() !== '' && form.email.trim() !== '';

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', padding: '20px' }}
      onClick={onClose}
    >
      <div
        style={{ background: C.bg, color: C.text, width: '100%', maxWidth: 520, maxHeight: '90dvh', overflowY: 'auto', padding: 'clamp(16px, 4vw, 24px)', position: 'relative', border: `3px solid ${C.yellow}` }}
        onClick={e => e.stopPropagation()}
      >
        {/* header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <span style={{ fontFamily: F.heavy, fontSize: 'clamp(12px, 3vw, 16px)', color: C.yellow, letterSpacing: 1 }}>FIRE &amp; SMOKE</span>
          <button style={{ background: 'transparent', border: 'none', color: C.dim, fontFamily: F.mono, fontSize: 'clamp(10px, 2.5vw, 12px)', cursor: 'pointer', letterSpacing: 1.5, fontWeight: 700 }} onClick={onClose}>× CLOSE</button>
        </div>

        {/* step indicator */}
        {step !== 3 && (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 16 }}>
            {(['01 · YOU', '02 · PAY', '03 · DONE'] as const).map((label, i) => (
              <Fragment key={label}>
                {i > 0 && <span style={{ fontFamily: F.mono, fontSize: 10, color: C.dim }}>////</span>}
                <span style={{ fontFamily: F.mono, fontSize: 10, letterSpacing: 1.5, fontWeight: 700, color: step > i ? C.yellow : C.dim }}>
                  {label}
                </span>
              </Fragment>
            ))}
          </div>
        )}

        {step === 1 && (
          <>
            <h3 style={{ fontFamily: F.display, fontSize: 'clamp(24px, 6vw, 32px)', margin: '0 0 14px', letterSpacing: -0.5, lineHeight: 1 }}>WHO'S COMING?</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 14, background: C.panel, color: C.yellow, fontFamily: F.mono, fontSize: 14, fontWeight: 700, marginBottom: 16 }}>
              <span>{tier.name}{tier.id !== 'duo' && qty > 1 ? ` × ${qty}` : ''}</span>
              <strong>{total.toLocaleString()} RWF</strong>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {([
                { key: 'name' as const, label: 'NAME', ph: 'Your full name' },
                { key: 'email' as const, label: 'EMAIL', ph: 'you@email.com' },
                { key: 'phone' as const, label: 'PHONE', ph: '+250 …' },
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
          <div style={{ animation: 'ss-fade-in 0.4s' }}>
            <h2 style={{ fontFamily: F.display, fontSize: 40, margin: '0 0 24px', letterSpacing: -1 }}>PAY {total.toLocaleString()} RWF</h2>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.dim}`, padding: 24, marginBottom: 24 }}>
              <p style={{ fontFamily: F.mono, fontSize: 11, color: C.yellow, margin: '0 0 16px', letterSpacing: 2, fontWeight: 700 }}>MOMO TRANSFER DETAILS:</p>

              {/* Mobile USSD Section */}
              {/Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ? (
                <div style={{ marginBottom: 24 }}>
                  <p style={{ fontSize: 13, color: C.dim, marginBottom: 16, lineHeight: 1.4 }}>Tap the button below to dial the payment code automatically on your phone.</p>
                  <a
                    href={`tel:*182*1*1*0785608546*${total}%23`}
                    style={{
                      display: 'block',
                      background: C.yellow,
                      color: C.bg,
                      textAlign: 'center',
                      padding: '16px',
                      textDecoration: 'none',
                      fontFamily: F.heavy,
                      fontSize: 16,
                      borderRadius: 4,
                      marginBottom: 12
                    }}
                  >
                    DIAL TO PAY ↗
                  </a>
                  <div style={{ textAlign: 'center', fontSize: 11, color: C.dim }}>
                    Code: <span style={{ color: C.text }}>*182*1*1*0785608546*{total}#</span>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '8px 12px', marginBottom: 24 }}>
                  <span style={{ color: C.dim, fontSize: 12 }}>NUMBER:</span>
                  <span style={{ fontWeight: 700, fontSize: 20 }}>0785 608 546</span>
                  <span style={{ color: C.dim, fontSize: 12 }}>NAME:</span>
                  <span style={{ fontWeight: 700, fontSize: 20 }}>Collins Muoki</span>
                </div>
              )}

              <div style={{ borderTop: `1px solid ${C.dim}`, paddingTop: 20, marginTop: 20 }}>
                <label style={{ display: 'block', fontFamily: F.mono, fontSize: 11, color: C.yellow, marginBottom: 12, letterSpacing: 1, fontWeight: 700 }}>TRANSACTION REFERENCE / ID</label>
                <input
                  type="text"
                  placeholder="e.g. 123456789"
                  value={form.reference}
                  onChange={e => setForm(f => ({ ...f, reference: e.target.value }))}
                  style={{ width: '100%', padding: '16px', background: '#0a0a0a', border: `2px solid ${C.yellow}`, color: C.text, fontFamily: F.mono, fontSize: 18, outline: 'none' }}
                />
              </div>
            </div>

            {error && (
              <div style={{ marginBottom: 16, padding: 12, background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid #ef4444', fontFamily: F.mono, fontSize: 12 }}>
                {error}
              </div>
            )}

            <button
              className="ss-glass-cta"
              disabled={!form.reference || isSubmitting}
              onClick={submit}
              style={{ width: '100%', background: C.yellow, color: C.bg, fontFamily: F.heavy, fontSize: 16, border: 'none' }}
            >
              {isSubmitting ? 'PROCESSING...' : "I'VE PAID ↗"}
            </button>
            <button
              onClick={() => setStep(1)}
              style={{ background: 'transparent', border: 'none', color: C.dim, marginTop: 16, cursor: 'pointer', fontFamily: F.mono, fontSize: 12, display: 'block', width: '100%' }}
            >
              ← BACK
            </button>
          </div>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <div style={{ fontSize: 64, marginBottom: 12 }}>🔥</div>
            <div style={{ fontFamily: F.display, fontSize: 'clamp(28px, 8vw, 40px)', color: C.yellow, lineHeight: 1, letterSpacing: -1 }}>RSVP RECEIVED</div>
            <div style={{ fontFamily: F.mono, fontSize: 14, color: C.text, marginTop: 12, fontWeight: 700, lineHeight: 1.5 }}>
              Your booking is pending confirmation. <br />
              We'll verify your payment and email your ticket shortly.
            </div>

            <div style={{ marginTop: 24, padding: 20, background: C.panel, border: `1px solid ${C.dashed}`, textAlign: 'left' }}>
              <div style={{ fontFamily: F.mono, fontSize: 10, color: C.yellow, letterSpacing: 2, fontWeight: 700, marginBottom: 12 }}>SUMMARY:</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontFamily: F.mono, fontSize: 12, color: C.dim }}>GUEST:</span>
                <span style={{ fontFamily: F.heavy, fontSize: 14 }}>{form.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontFamily: F.mono, fontSize: 12, color: C.dim }}>TIER:</span>
                <span style={{ fontFamily: F.heavy, fontSize: 14 }}>{tier.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: F.mono, fontSize: 12, color: C.dim }}>TOTAL:</span>
                <span style={{ fontFamily: F.heavy, fontSize: 14 }}>{total.toLocaleString()} RWF</span>
              </div>
            </div>

            <button
              style={{ width: '100%', marginTop: 24, background: C.pink, color: C.bg, border: 'none', padding: 16, fontFamily: F.heavy, fontSize: 14, letterSpacing: 2, cursor: 'pointer' }}
              onClick={onClose}
            >AWESOME</button>
          </div>
        )}
      </div>
    </div>
  );
}
