import { useState } from 'react';
import {
  EVENT, TIERS, WHATS_NEW, GAMES, PRIZES, PRIZE_REWARDS,
  SCHEDULE, GALLERY, TESTIMONIALS, FAQ, HOSTS, SPONSORS, QUIZ,
} from './data';
import { useCountdown } from './hooks/useCountdown';
import { TornDivider } from './components/TornDivider';
import { SectionHeader } from './components/SectionHeader';
import { Checkout } from './components/Checkout';
import { C, F } from './tokens';

const HEAT_LABELS  = ['MILD', 'WARM', 'SPICY', 'HEAT', 'INFERNO'] as const;
const HEAT_COLORS  = ['#fde047', '#fb923c', '#f43f5e', '#dc2626', '#fbbf24'] as const;
const VOICE_COLORS = ['#fde047', '#f43f5e', '#fb923c', '#22d3ee'] as const;
const CREW_COLORS  = ['#fde047', '#f43f5e', '#fb923c'] as const;

export function App() {
  const cd = useCountdown(EVENT.dateISO);

  const [selectedTierId, setSelectedTierId] = useState('early');
  const [qty, setQty] = useState(1);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [heat, setHeat] = useState(3);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [openFaq, setOpenFaq] = useState(-1);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizChoice, setQuizChoice] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  const tier = TIERS.find(t => t.id === selectedTierId)!;
  const total = tier.id === 'duo' ? tier.price : tier.price * qty;
  const heatLabel = HEAT_LABELS[heat - 1];
  const heatColor = HEAT_COLORS[heat - 1];

  function advanceQuiz() {
    const right = quizChoice === QUIZ[quizIdx].answer;
    const newScore = quizScore + (right ? 1 : 0);
    if (quizIdx === QUIZ.length - 1) {
      setQuizScore(newScore);
      setQuizDone(true);
    } else {
      setQuizScore(newScore);
      setQuizIdx(i => i + 1);
      setQuizChoice(null);
    }
  }

  function resetQuiz() {
    setQuizIdx(0);
    setQuizChoice(null);
    setQuizScore(0);
    setQuizDone(false);
  }

  const sec = (extra?: React.CSSProperties): React.CSSProperties => ({
    padding: '40px 18px',
    background: C.bg,
    color: C.text,
    ...extra,
  });

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: F.mono, paddingBottom: 80, minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── TOP MARQUEE ── */}
      <div style={{ background: C.yellow, color: C.bg, padding: '8px 0', overflow: 'hidden', borderTop: `3px solid ${C.bg}`, borderBottom: `3px solid ${C.bg}` }}>
        <div className="ss-marquee-anim" style={{ whiteSpace: 'nowrap', display: 'inline-block' }}>
          {Array.from({ length: 4 }).map((_, k) => (
            <span key={k} style={{ fontFamily: F.heavy, fontSize: 13, letterSpacing: 2, textTransform: 'uppercase' }}>
              ▲ FIRE &amp; SMOKE VOL.02 ▲ 30 MAY 2026 ▲ FAZENDA ZENGA ▲ DAYTIME GAMES EDITION ▲ DON'T COME ALONE ▲&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ── HERO ── */}
      <section style={{ padding: '24px 18px 0' }}>
        <div style={{ position: 'relative' }}>

          {/* badges */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
            {[
              { label: 'VOL · 02',    bg: C.yellow },
              { label: 'BBQ × GAMES', bg: C.pink },
              { label: 'DAYTIME',     bg: C.cyan },
            ].map(({ label, bg }) => (
              <span key={label} style={{ background: bg, color: C.bg, padding: '4px 10px', fontFamily: F.mono, fontSize: 10, fontWeight: 700, letterSpacing: 1.5 }}>{label}</span>
            ))}
          </div>

          {/* title */}
          <h1 style={{ fontFamily: F.display, fontSize: 'clamp(72px, 22vw, 130px)', lineHeight: 0.85, margin: 0, fontWeight: 400, letterSpacing: -2, display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: C.text, textShadow: `6px 6px 0 ${C.pink}` }}>FIRE</span>
            <span style={{ color: C.yellow, fontSize: '60%', alignSelf: 'flex-start', marginLeft: 8, marginTop: -8, fontStyle: 'italic', WebkitTextStroke: `2px ${C.bg}` }}>&amp;</span>
            <span style={{ color: C.text, textShadow: `6px 6px 0 ${C.orange}`, fontSize: 93 }}>SMOKE</span>
          </h1>

          <div style={{ fontFamily: F.mono, fontSize: 11, color: C.dim, letterSpacing: 4, marginTop: 14 }}>
            ||||  |||  ||||| ||  | ||||  || RWA-26-2
          </div>

          {/* date sticker */}
          <div style={{ position: 'absolute', top: 30, right: -8, transform: 'rotate(8deg)', zIndex: 2 }}>
            <div style={{ background: C.pink, color: C.bg, width: 88, height: 88, borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: `3px solid ${C.bg}`, boxShadow: '0 6px 0 rgba(0,0,0,0.5)' }}>
              <div style={{ fontFamily: F.display, fontSize: 38, lineHeight: 1 }}>30</div>
              <div style={{ fontFamily: F.mono, fontSize: 11, fontWeight: 700, letterSpacing: 2, marginTop: -2 }}>MAY</div>
              <div style={{ fontFamily: F.mono, fontSize: 10, fontWeight: 700, letterSpacing: 1.5 }}>'26</div>
            </div>
          </div>

          <p style={{ fontFamily: F.mono, fontSize: 14, lineHeight: 1.6, color: '#d4d4d8', marginTop: 22, maxWidth: 520 }}>
            Last edition we held it down for the CrossFit crew. This time it's switching up — different proteins, daytime music, a games corner, a sauce battle that will ruin you, and pine-forest photo moments from three.
          </p>

          {/* meta table */}
          <div style={{ marginTop: 22, padding: '14px 12px', background: C.panel, border: `1px solid ${C.border}` }}>
            {[
              { k: 'WHERE', v: 'FAZENDA ZENGA · MT KIGALI' },
              { k: 'WHEN',  v: 'SAT 30 MAY · 2PM — 8PM' },
              { k: 'FROM',  v: '15,000 RWF' },
            ].map(({ k, v }) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '6px 0', borderBottom: `1px dashed ${C.dashed}` }}>
                <span style={{ fontFamily: F.mono, fontSize: 10, color: C.yellow, letterSpacing: 2, fontWeight: 700 }}>{k}</span>
                <span style={{ fontFamily: F.heavy, fontSize: 13, color: C.text, letterSpacing: 0.5 }}>{v}</span>
              </div>
            ))}
          </div>

          <button
            style={{ width: '100%', marginTop: 20, padding: 20, background: C.pink, color: C.bg, border: `3px solid ${C.bg}`, fontFamily: F.display, fontSize: 18, cursor: 'pointer', boxShadow: `8px 8px 0 ${C.yellow}`, letterSpacing: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            onClick={() => setCheckoutOpen(true)}
          >
            <span>RSVP &amp; PAY ↗</span>
          </button>
        </div>

        {/* polaroid stack */}
        <div style={{ position: 'relative', marginTop: 32, height: 280 }}>
          {[
            { src: '/photos/p13-peace.jpeg',       cap: 'VOL.01 ✌',      cls: 'ss-polaroid-1' },
            { src: '/photos/p11-chef-bandana.jpeg', cap: 'THE PITMASTER', cls: 'ss-polaroid-2' },
            { src: '/photos/p12-kamado.jpeg',       cap: 'KAMADO HOT',    cls: 'ss-polaroid-3' },
          ].map(({ src, cap, cls }) => (
            <div key={src} className={cls} style={{ position: 'absolute', background: '#fafafa', padding: 6, paddingBottom: 22, boxShadow: '0 10px 24px rgba(0,0,0,0.6)' }}>
              <img src={src} alt={cap} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', bottom: 4, left: 0, right: 0, textAlign: 'center', fontFamily: F.mono, fontSize: 11, fontWeight: 700, color: C.bg, letterSpacing: 1 }}>{cap}</div>
            </div>
          ))}
        </div>

        {/* countdown */}
        <div style={{ marginTop: 28, padding: '16px 14px', background: C.panel, border: `2px dashed ${C.yellow}` }}>
          <div style={{ fontFamily: F.mono, fontSize: 11, color: C.yellow, letterSpacing: 3, fontWeight: 700, textAlign: 'center', marginBottom: 10 }}>★ COUNTDOWN ★</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
            {([['D', cd.days], ['H', cd.hours], ['M', cd.mins], ['S', cd.secs]] as [string, number][]).map(([l, v]) => (
              <div key={l} style={{ textAlign: 'center', padding: '10px 4px', background: C.bg, border: `1px solid ${C.yellow}` }}>
                <div style={{ fontFamily: F.display, fontSize: 34, color: C.text, lineHeight: 1, letterSpacing: -1 }}>{String(v).padStart(2, '0')}</div>
                <div style={{ fontFamily: F.mono, fontSize: 10, color: C.yellow, letterSpacing: 2, fontWeight: 700, marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TornDivider color={C.yellow} />

      {/* ── WHAT'S NEW ── */}
      <section style={sec({ background: C.yellow, color: C.bg })}>
        <SectionHeader title="NEW THIS EDITION" sub="// switch_it_up.sh" color={C.bg} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
          {WHATS_NEW.map((w, i) => (
            <div key={i} style={{ background: C.bg, color: C.text, padding: 14, border: `2px solid ${C.bg}` }}>
              <div style={{ fontFamily: F.mono, fontSize: 9, letterSpacing: 2, color: C.yellow, fontWeight: 700 }}>NEW/{String(i + 1).padStart(2, '0')}</div>
              <div style={{ fontFamily: F.heavy, fontSize: 17, marginTop: 6, lineHeight: 1.1 }}>{w.title}</div>
              <div style={{ fontFamily: F.mono, fontSize: 12, color: C.dim, marginTop: 6, lineHeight: 1.4 }}>{w.sub}</div>
            </div>
          ))}
        </div>
      </section>

      <TornDivider color={C.bg} flip />

      {/* ── SCHEDULE ── */}
      <section style={sec()}>
        <SectionHeader title="RUN OF SHOW" sub="// what_happens_when()" />
        <div style={{ paddingLeft: 12 }}>
          {SCHEDULE.map((row, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '70px 16px 1fr', gap: 12, padding: '12px 0', borderBottom: `1px dashed ${C.dashed}`, alignItems: 'baseline' }}>
              <div style={{ fontFamily: F.display, fontSize: 20, color: C.yellow, letterSpacing: -1 }}>{row.t}</div>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: C.pink, marginTop: 6, alignSelf: 'start' }} />
              <div>
                <div style={{ fontFamily: F.heavy, fontSize: 15, color: C.text, letterSpacing: 0.5 }}>{row.label}</div>
                <div style={{ fontFamily: F.mono, fontSize: 12, color: C.dim, marginTop: 4 }}>{row.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── GAMES ── */}
      <section style={sec({ background: C.pink, color: C.bg })}>
        <SectionHeader title="GAMES ON SITE" sub="// pick_your_poison()" color={C.bg} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
          {GAMES.map((g, i) => (
            <div key={g.name} style={{ background: C.bg, color: C.yellow, padding: '10px 14px', border: `3px solid ${C.bg}`, boxShadow: '4px 4px 0 rgba(0,0,0,0.4)', minWidth: 100, textAlign: 'center', transform: `rotate(${(i % 2 ? 1 : -1) * (1 + i % 3)}deg)` }}>
              <div style={{ fontFamily: F.mono, fontSize: 9, opacity: 0.6, letterSpacing: 1.5 }}>{g.tag}</div>
              <div style={{ fontFamily: F.heavy, fontSize: 14, marginTop: 2 }}>{g.name}</div>
            </div>
          ))}
        </div>
        <div style={{ fontFamily: F.mono, fontSize: 12, fontWeight: 700, textAlign: 'center', marginTop: 20, letterSpacing: 1.5 }}>
          ★ ANYONE WITH GAMES IS WELCOME TO BRING THEM ALONG ★
        </div>
      </section>

      {/* ── PRIZES ── */}
      <section style={sec()}>
        <SectionHeader title="WHAT YOU CAN WIN" sub="// reward.json" />
        <div style={{ display: 'grid', gap: 12 }}>
          {PRIZES.map((p, i) => (
            <div key={i} style={{ padding: 16, background: C.panel, border: `1px solid ${C.border}`, borderLeft: `6px solid ${C.pink}` }}>
              <div style={{ fontFamily: F.display, fontSize: 32, color: C.pink, lineHeight: 1, letterSpacing: -1 }}>0{i + 1}</div>
              <div style={{ fontFamily: F.heavy, fontSize: 18, color: C.text, marginTop: 4 }}>{p.name}</div>
              <div style={{ fontFamily: F.mono, fontSize: 13, color: C.dim, marginTop: 6, lineHeight: 1.4 }}>{p.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 18, padding: 12, background: C.yellow, color: C.bg, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: F.heavy, fontSize: 12, letterSpacing: 2 }}>PRIZES:</span>
          {PRIZE_REWARDS.map((r, i) => (
            <span key={i} style={{ fontFamily: F.mono, fontSize: 11, fontWeight: 700, padding: '4px 8px', background: C.bg, color: C.yellow }}>{r.name}</span>
          ))}
        </div>
      </section>

      <TornDivider color={C.orange} />

      {/* ── SAUCE HEAT SLIDER ── */}
      <section style={sec({ background: C.orange, color: C.bg })}>
        <SectionHeader title="SAUCE BATTLE" sub="// pick_a_lane.sh" color={C.bg} />
        <div style={{ padding: 18, background: '#fef3c7', color: C.bg, border: `3px solid ${C.bg}`, boxShadow: `8px 8px 0 ${C.bg}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <div>
              <div style={{ fontFamily: F.mono, fontSize: 11, letterSpacing: 2, fontWeight: 700 }}>YOUR LEVEL ↓</div>
              <div style={{ fontFamily: F.display, fontSize: 'clamp(36px,12vw,56px)', lineHeight: 1, marginTop: 4, letterSpacing: -1, color: heatColor, textShadow: `0 0 24px ${heatColor}, 0 0 4px #fff`, transition: 'color 0.3s, text-shadow 0.3s' }}>
                {heatLabel}
              </div>
            </div>
            <div style={{ width: 78, height: 78, borderRadius: '50%', border: `4px solid ${heatColor}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: C.bg, color: C.yellow, flexShrink: 0, transition: 'border-color 0.3s' }}>
              <div style={{ fontFamily: F.display, fontSize: 30, lineHeight: 1 }}>{heat}</div>
              <div style={{ fontFamily: F.mono, fontSize: 10, fontWeight: 700, marginTop: -2 }}>/ 5</div>
            </div>
          </div>
          <input
            type="range" min={1} max={5} value={heat}
            onChange={e => setHeat(Number(e.target.value))}
            style={{ width: '100%', marginTop: 20 }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', marginTop: 8 }}>
            {HEAT_LABELS.map((l, i) => (
              <div key={l} style={{ fontFamily: F.mono, fontSize: 10, letterSpacing: 1, textAlign: 'center', color: i + 1 === heat ? C.bg : 'rgba(10,10,10,0.4)', fontWeight: i + 1 === heat ? 700 : 400 }}>{l}</div>
            ))}
          </div>
          <div style={{ fontFamily: F.mono, fontSize: 13, marginTop: 16, padding: 10, background: C.bg, color: C.yellow, lineHeight: 1.5 }}>
            {heat <= 2 && '> honey-glaze, smoked paprika, lemon. mellow vibes.'}
            {heat === 3 && '> akabanga + ginger glaze. respect-tier. start here.'}
            {heat === 4 && '> pili-pili reduction. you WILL feel it tomorrow.'}
            {heat === 5 && '> carolina reaper × habanero. no survivors. sign waiver.'}
          </div>
        </div>
      </section>

      <TornDivider color={C.bg} flip />

      {/* ── GALLERY ── */}
      <section style={sec()}>
        <SectionHeader title="LAST EDITION" sub="// roll.gif" />
        <div>
          <div style={{ position: 'relative', border: `3px solid ${C.yellow}`, padding: 6, background: C.bg }}>
            <img src={GALLERY[carouselIdx].src} alt={GALLERY[carouselIdx].caption} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }} />
            <div style={{ position: 'absolute', top: 12, left: 12, background: C.pink, color: C.bg, fontFamily: F.mono, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, padding: '3px 8px' }}>● REC</div>
            <div style={{ position: 'absolute', top: 12, right: 12, background: C.bg, color: C.yellow, fontFamily: F.mono, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, padding: '3px 8px', border: `1px solid ${C.yellow}` }}>
              VOL.01 / {String(carouselIdx + 1).padStart(2, '0')}
            </div>
            <div style={{ position: 'absolute', bottom: 16, left: 12, right: 12, background: 'rgba(0,0,0,0.7)', color: C.yellow, fontFamily: F.mono, fontSize: 12, padding: '8px 10px', backdropFilter: 'blur(4px)' }}>
              "{GALLERY[carouselIdx].caption}"
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, gap: 10 }}>
            <button style={{ flex: 1, padding: 12, background: 'transparent', border: `2px solid ${C.yellow}`, color: C.yellow, fontFamily: F.heavy, fontSize: 12, letterSpacing: 2, cursor: 'pointer' }}
              onClick={() => setCarouselIdx((carouselIdx - 1 + GALLERY.length) % GALLERY.length)}>← PREV</button>
            <button style={{ flex: 1, padding: 12, background: 'transparent', border: `2px solid ${C.yellow}`, color: C.yellow, fontFamily: F.heavy, fontSize: 12, letterSpacing: 2, cursor: 'pointer' }}
              onClick={() => setCarouselIdx((carouselIdx + 1) % GALLERY.length)}>NEXT →</button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 12 }}>
            {GALLERY.map((_, i) => (
              <button key={i} onClick={() => setCarouselIdx(i)} style={{ width: 8, height: 8, borderRadius: '50%', border: 'none', cursor: 'pointer', padding: 0, background: i === carouselIdx ? C.yellow : 'rgba(255,255,255,0.2)' }} />
            ))}
          </div>
        </div>
      </section>

      {/* ── VOICES ── */}
      <section style={sec()}>
        <SectionHeader title="VOICES" sub="// reviews.txt" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={{ padding: 16, border: '3px solid #fafafa', transform: `rotate(${i % 2 ? 1 : -1}deg)`, background: VOICE_COLORS[i % 4], color: C.bg }}>
              <div style={{ fontFamily: F.heavy, fontSize: 16, lineHeight: 1.3 }}>"{t.quote}"</div>
              <div style={{ fontFamily: F.mono, fontSize: 12, fontWeight: 700, marginTop: 10, letterSpacing: 1 }}>— {t.name} {t.handle}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CREW ── */}
      <section style={sec()}>
        <SectionHeader title="THE CREW" sub="// hosts.csv" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
          {HOSTS.map((h, i) => (
            <div key={i} style={{ padding: 14, background: C.panel, border: `1px solid ${C.border}`, textAlign: 'center' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.heavy, fontSize: 18, color: C.bg, margin: '0 auto 10px', border: `2px solid ${C.bg}`, background: CREW_COLORS[i % 3] }}>
                {h.name.split(' ').map(p => p[0]).join('')}
              </div>
              <div style={{ fontFamily: F.heavy, fontSize: 14 }}>{h.name}</div>
              <div style={{ fontFamily: F.mono, fontSize: 10, color: C.yellow, letterSpacing: 2, fontWeight: 700, marginTop: 4 }}>{h.role}</div>
              <div style={{ fontFamily: F.mono, fontStyle: 'italic', fontSize: 11, color: C.dim, marginTop: 6 }}>"{h.tag}"</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TICKETS ── */}
      <section id="tickets" style={sec({ background: C.yellow, color: C.bg })}>
        <SectionHeader title="GET YOUR PASS" sub="// reserve.exe" color={C.bg} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {TIERS.map(t => {
            const active = selectedTierId === t.id;
            return (
              <button key={t.id} onClick={() => setSelectedTierId(t.id)}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: 16, background: active ? C.pink : C.bg, color: active ? C.bg : C.yellow, border: `3px solid ${C.bg}`, textAlign: 'left', cursor: 'pointer', position: 'relative', boxShadow: active ? `6px 6px 0 ${C.bg}` : 'none' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: F.heavy, fontSize: 18 }}>{t.name}</div>
                  <div style={{ fontFamily: F.mono, fontSize: 12, marginTop: 4, opacity: 0.85 }}>{t.sub}</div>
                  {t.badge && <div style={{ fontFamily: F.mono, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, marginTop: 6 }}>★ {t.badge}</div>}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: F.display, fontSize: 30, lineHeight: 1, letterSpacing: -1 }}>{t.price.toLocaleString()}</div>
                  <div style={{ fontFamily: F.mono, fontSize: 11, fontWeight: 700, letterSpacing: 1.5 }}>RWF</div>
                </div>
                {active && (
                  <div style={{ position: 'absolute', bottom: -10, right: 10, background: C.yellow, color: C.bg, fontFamily: F.mono, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, padding: '2px 8px' }}>✓ SELECTED</div>
                )}
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: 18, padding: 16, background: C.bg, color: C.yellow }}>
          {tier.id !== 'duo' && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: `1px dashed ${C.dashed}` }}>
              <span style={{ fontFamily: F.mono, fontSize: 11, letterSpacing: 2, fontWeight: 700 }}>QUANTITY</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button style={{ width: 36, height: 36, background: 'transparent', border: `2px solid ${C.yellow}`, color: C.yellow, fontFamily: F.heavy, fontSize: 16, cursor: 'pointer' }} onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <span style={{ fontFamily: F.display, fontSize: 22, minWidth: 24, textAlign: 'center' }}>{qty}</span>
                <button style={{ width: 36, height: 36, background: 'transparent', border: `2px solid ${C.yellow}`, color: C.yellow, fontFamily: F.heavy, fontSize: 16, cursor: 'pointer' }} onClick={() => setQty(Math.min(10, qty + 1))}>+</button>
              </div>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '14px 0' }}>
            <span style={{ fontFamily: F.mono, fontSize: 11, letterSpacing: 2, fontWeight: 700 }}>TOTAL DUE</span>
            <span style={{ fontFamily: F.display, fontSize: 32, color: C.text, lineHeight: 1, letterSpacing: -1 }}>
              {total.toLocaleString()} <span style={{ fontFamily: F.mono, fontSize: 13, color: C.yellow }}>RWF</span>
            </span>
          </div>
          <button style={{ width: '100%', padding: 18, background: C.yellow, color: C.bg, border: 'none', fontFamily: F.display, fontSize: 16, cursor: 'pointer', letterSpacing: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            onClick={() => setCheckoutOpen(true)}>
            <span>RSVP &amp; PAY VIA FLUTTERWAVE</span>
            <span>↗</span>
          </button>
        </div>
      </section>

      <TornDivider color={C.bg} flip />

      {/* ── BBQ QUIZ ── */}
      <section style={sec()}>
        <SectionHeader title="BBQ QUIZ" sub="// 5 questions. no cheating." />
        <div style={{ padding: 18, background: C.panel, border: `1px solid ${C.border}` }}>
          {!quizDone ? (
            <>
              <div style={{ display: 'flex', gap: 4 }}>
                {QUIZ.map((_, i) => (
                  <div key={i} style={{ flex: 1, height: 6, background: i < quizIdx ? C.yellow : i === quizIdx ? C.orange : C.dashed }} />
                ))}
              </div>
              <div style={{ fontFamily: F.mono, fontSize: 10, letterSpacing: 2, color: C.yellow, fontWeight: 700, marginTop: 10 }}>
                Q {quizIdx + 1} OF {QUIZ.length} · SCORE {quizScore}
              </div>
              <div style={{ fontFamily: F.heavy, fontSize: 18, color: C.text, marginTop: 8, lineHeight: 1.2 }}>{QUIZ[quizIdx].q}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
                {QUIZ[quizIdx].options.map((opt, i) => {
                  const revealed = quizChoice !== null;
                  const isCorrect = QUIZ[quizIdx].answer === i;
                  const isPicked = quizChoice === i;
                  return (
                    <button key={i} disabled={revealed} onClick={() => setQuizChoice(i)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                        background: revealed && isCorrect ? 'rgba(34,197,94,0.15)' : revealed && isPicked && !isCorrect ? 'rgba(239,68,68,0.15)' : C.bg,
                        color: C.text,
                        border: revealed && isCorrect ? '1px solid #22c55e' : revealed && isPicked && !isCorrect ? '1px solid #ef4444' : `1px solid ${C.dashed}`,
                        cursor: revealed ? 'default' : 'pointer',
                        fontFamily: F.mono, fontSize: 13, textAlign: 'left', width: '100%',
                      }}>
                      <span style={{ fontFamily: F.heavy, fontSize: 12, color: C.yellow, letterSpacing: 2, minWidth: 18 }}>{String.fromCharCode(65 + i)}</span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
              {quizChoice !== null && (
                <div style={{ fontFamily: F.mono, fontSize: 12, color: '#d4d4d8', marginTop: 14, padding: 12, background: C.bg, lineHeight: 1.5, border: `1px solid ${C.dashed}` }}>
                  <strong style={{ color: quizChoice === QUIZ[quizIdx].answer ? '#86efac' : '#fca5a5' }}>
                    {quizChoice === QUIZ[quizIdx].answer ? '> CORRECT' : '> WRONG'}
                  </strong>
                  <div style={{ marginTop: 6 }}>{QUIZ[quizIdx].fact}</div>
                  <button style={{ display: 'block', marginTop: 12, background: C.yellow, color: C.bg, border: 'none', padding: '10px 14px', fontFamily: F.heavy, fontSize: 12, letterSpacing: 2, cursor: 'pointer' }} onClick={advanceQuiz}>
                    {quizIdx === QUIZ.length - 1 ? 'SEE_RESULT()' : 'NEXT_Q() →'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '14px 6px' }}>
              <div style={{ fontFamily: F.display, fontSize: 80, color: C.yellow, lineHeight: 1, letterSpacing: -3 }}>{quizScore}/{QUIZ.length}</div>
              <div style={{ fontFamily: F.mono, fontSize: 14, fontWeight: 700, color: C.text, marginTop: 8, letterSpacing: 1 }}>
                {quizScore === 5 ? '> PITMASTER. BRING THE TONGS.' :
                 quizScore === 4 ? "> STRONG SHOW. YOU'RE MANNING A GRILL." :
                 quizScore === 3 ? '> DECENT. STAND NEAR COLLINS.' :
                 '> COME FOR THE FOOD, LEAVE WITH A DEGREE.'}
              </div>
              <button style={{ marginTop: 14, background: 'transparent', border: `2px solid ${C.yellow}`, color: C.yellow, padding: '10px 14px', fontFamily: F.heavy, fontSize: 12, letterSpacing: 2, cursor: 'pointer' }} onClick={resetQuiz}>
                RESET()
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={sec()}>
        <SectionHeader title="FAQ" sub="// readme.md" />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {FAQ.map((f, i) => (
            <div key={i} style={{ borderBottom: `1px dashed ${C.dashed}` }}>
              <button style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '16px 0', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', color: C.text }}
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                <span style={{ fontFamily: F.mono, fontSize: 12, fontWeight: 700, color: C.yellow, letterSpacing: 2 }}>{String(i + 1).padStart(2, '0')}</span>
                <span style={{ fontFamily: F.heavy, fontSize: 14, color: C.text, flex: 1, lineHeight: 1.3 }}>{f.q}</span>
                <span style={{ fontFamily: F.display, fontSize: 22, color: C.pink, transition: 'transform 0.2s', transform: openFaq === i ? 'rotate(45deg)' : undefined, display: 'inline-block' }}>+</span>
              </button>
              {openFaq === i && (
                <div style={{ fontFamily: F.mono, fontSize: 13, color: C.dim, lineHeight: 1.55, padding: '0 0 16px 28px' }}>{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── MAP ── */}
      <section style={sec({ background: C.cyan, color: C.bg })}>
        <SectionHeader title="GETTING THERE" sub="// gps.coords" color={C.bg} />
        <div style={{ background: '#fff', padding: 6, border: `3px solid ${C.bg}`, boxShadow: `6px 6px 0 ${C.bg}` }}>
          <svg viewBox="0 0 400 240" style={{ width: '100%', display: 'block' }}>
            <defs>
              <pattern id="ss-dots" width="14" height="14" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="rgba(10,10,10,0.4)" />
              </pattern>
            </defs>
            <rect width="400" height="240" fill="url(#ss-dots)" />
            <path d="M 30 200 Q 130 140 220 130 T 380 80" stroke="#0a0a0a" strokeWidth="3" fill="none" strokeDasharray="8 6" />
            <text x="20" y="40" fontFamily="Space Mono" fontSize="11" fontWeight="700" fill="#0a0a0a">MT_KIGALI</text>
            <text x="280" y="220" fontFamily="Space Mono" fontSize="11" fontWeight="700" fill="#0a0a0a">KIMIHURURA</text>
            <g transform="translate(220,130)">
              <circle r="30" fill="#fde047" stroke="#0a0a0a" strokeWidth="2" />
              <text textAnchor="middle" dy="6" fontFamily="Bowlby One" fontSize="18" fill="#0a0a0a">★</text>
              <rect x="-46" y="-58" width="92" height="20" fill="#0a0a0a" />
              <text textAnchor="middle" y="-44" fontFamily="Space Mono" fontSize="10" fontWeight="700" fill="#fde047">FAZENDA ZENGA</text>
            </g>
          </svg>
        </div>
        <div style={{ marginTop: 16, padding: 16, background: C.bg, color: C.yellow }}>
          {[
            { k: 'LOC',  v: 'Fazenda Zenga · Mt Kigali pines' },
            { k: 'WHEN', v: 'SAT 30 MAY · 2PM' },
          ].map(({ k, v }) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px dashed ${C.dashed}` }}>
              <span style={{ fontFamily: F.mono, fontSize: 11, letterSpacing: 2, fontWeight: 700 }}>{k}</span>
              <span style={{ fontFamily: F.heavy, fontSize: 13, color: C.text }}>{v}</span>
            </div>
          ))}
          <a href={EVENT.mapsUrl} target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-block', marginTop: 12, padding: '10px 14px', background: C.yellow, color: C.bg, fontFamily: F.heavy, fontSize: 12, letterSpacing: 2, textDecoration: 'none' }}>
            OPEN_IN_MAPS() ↗
          </a>
        </div>
      </section>

      {/* ── SPONSORS ── */}
      <section style={{ ...sec(), paddingTop: 32, paddingBottom: 32 }}>
        <div style={{ fontFamily: F.mono, fontSize: 11, letterSpacing: 2, color: C.dim, fontWeight: 700, marginBottom: 14 }}>// WITH_THANKS_TO</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
          {SPONSORS.map((s, i) => (
            <div key={i} style={{ padding: 12, background: C.panel, border: `1px solid ${C.border}` }}>
              <div style={{ fontFamily: F.heavy, fontSize: 14, color: C.text }}>{s.name}</div>
              <div style={{ fontFamily: F.mono, fontSize: 10, color: C.yellow, letterSpacing: 1.5, fontWeight: 700, marginTop: 4 }}>{s.kind}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM MARQUEE ── */}
      <div style={{ background: C.pink, color: C.bg, padding: '8px 0', overflow: 'hidden', borderTop: `3px solid ${C.bg}`, borderBottom: `3px solid ${C.bg}` }}>
        <div className="ss-marquee-anim-rev" style={{ whiteSpace: 'nowrap', display: 'inline-block' }}>
          {Array.from({ length: 4 }).map((_, k) => (
            <span key={k} style={{ fontFamily: F.heavy, fontSize: 13, letterSpacing: 2, textTransform: 'uppercase' }}>
              ✦ COME HUNGRY ✦ BRING A FRIEND ✦ LEAVE WITH STORIES ✦ {EVENT.ig} ✦&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ padding: '24px 18px 110px', textAlign: 'center', background: C.bg, borderTop: `3px solid ${C.yellow}` }}>
        <div style={{ fontFamily: F.display, fontSize: 28, color: C.text, letterSpacing: -0.5 }}>FIRE &amp; SMOKE</div>
        <div style={{ fontFamily: F.mono, fontSize: 11, color: C.dim, marginTop: 6, letterSpacing: 1 }}>© 2026 · KIGALI · NOT JUST A BBQ</div>
        <div style={{ fontFamily: F.mono, fontSize: 11, color: C.dim, marginTop: 6, letterSpacing: 1 }}>{EVENT.ig} · {EVENT.whatsapp}</div>
      </footer>

      {/* ── STICKY BAR ── */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: C.bg, borderTop: `3px solid ${C.yellow}`, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 50 }}>
        <div>
          <div style={{ fontFamily: F.mono, fontSize: 9, letterSpacing: 2, color: C.yellow, fontWeight: 700 }}>FROM</div>
          <div style={{ fontFamily: F.heavy, fontSize: 16, color: C.text, lineHeight: 1.1 }}>15,000 RWF</div>
        </div>
        <button style={{ background: C.pink, color: C.bg, border: 'none', padding: '12px 18px', fontFamily: F.heavy, fontSize: 13, letterSpacing: 2, cursor: 'pointer' }}
          onClick={() => setCheckoutOpen(true)}>RSVP ↗</button>
      </div>

      {/* ── CHECKOUT MODAL ── */}
      {checkoutOpen && (
        <Checkout tier={tier} qty={qty} total={total} onClose={() => setCheckoutOpen(false)} />
      )}
    </div>
  );
}
