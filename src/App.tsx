import { useState, useEffect, useMemo } from 'react';
import * as staticData from './data';
import { TornDivider } from './components/TornDivider';
import { SectionHeader } from './components/SectionHeader';
import { Checkout } from './components/Checkout';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLogin } from './components/AdminLogin';
import { bookingService } from './services/bookingService';
import { C, F } from './tokens';

const CookieConsent = ({ onAccept }: { onAccept: () => void }) => (
  <div style={{
    position: 'fixed', bottom: 20, left: 20, right: 20, zIndex: 10000,
    background: '#111', border: `2px solid ${C.yellow}`, padding: '20px 32px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    boxShadow: '0 10px 40px rgba(0,0,0,0.8)', flexWrap: 'wrap', gap: 20
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ fontSize: 24 }}>🍪</div>
      <div>
        <div style={{ fontFamily: F.display, fontSize: 14, color: C.yellow, marginBottom: 4 }}>COOKIE_CONSENT_REQUIRED</div>
        <div style={{ fontSize: 11, color: C.dim, maxWidth: 600 }}>
          We use cookies to enhance your experience, manage your bookings, and ensure the performance of the Fire & Smoke platform.
          By clicking accept, you agree to our local storage usage.
        </div>
      </div>
    </div>
    <div style={{ display: 'flex', gap: 12 }}>
      <button
        onClick={onAccept}
        style={{ background: C.yellow, color: C.bg, border: 'none', padding: '10px 24px', fontFamily: F.heavy, fontSize: 12, cursor: 'pointer' }}
      >
        ACCEPT_ALL
      </button>
    </div>
  </div>
);

const HEAT_LABELS = ['MILD', 'WARM', 'SPICY', 'HEAT', 'INFERNO'] as const;
const HEAT_COLORS = ['#fde047', '#fb923c', '#f43f5e', '#dc2626', '#fbbf24'] as const;
const VOICE_COLORS = ['#fde047', '#f43f5e', '#fb923c', '#22d3ee'] as const;
const CREW_COLORS = ['#fde047', '#f43f5e', '#fb923c'] as const;

const Logo = () => (
  <div style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', lineHeight: 0.8, letterSpacing: -1, fontFamily: 'Bowlby One', fontSize: 14 }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
    <div style={{ color: '#fff' }}>FIRE</div>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span style={{ color: '#fde047', marginRight: 4, fontSize: '80%', fontStyle: 'italic' }}>&amp;</span>
      <span style={{ color: '#fff' }}>SMOKE</span>
    </div>
  </div>
);

export function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('fs_admin_auth') === 'true';
  });
  const [showCookieConsent, setShowCookieConsent] = useState(() => {
    return localStorage.getItem('fs_cookie_accepted') !== 'true';
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      setIsAdmin(true);
    }
  }, []);

  const handleAdminLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('fs_admin_auth', 'true');
  };

  const handleAcceptCookies = () => {
    setShowCookieConsent(false);
    localStorage.setItem('fs_cookie_accepted', 'true');
  };


  const [selectedTierId, setSelectedTierId] = useState('early');
  const [qty] = useState(1);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [heat, setHeat] = useState(3);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [openFaq, setOpenFaq] = useState(-1);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizChoice, setQuizChoice] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  // Dynamic Content State (CMS)
  const [cms, setCms] = useState<any>(() => {
    const cached = localStorage.getItem('fs_cms_cache');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error('Failed to parse CMS cache');
      }
    }
    return {
      EVENT: staticData.EVENT,
      TIERS: staticData.TIERS,
      WHATS_NEW: staticData.WHATS_NEW,
      GAMES: staticData.GAMES,
      PRIZES: staticData.PRIZES,
      PRIZE_REWARDS: staticData.PRIZE_REWARDS,
      SCHEDULE: staticData.SCHEDULE,
      GALLERY: staticData.GALLERY,
      TESTIMONIALS: staticData.TESTIMONIALS,
      FAQ: staticData.FAQ,
      HOSTS: staticData.HOSTS,
      SPONSORS: staticData.SPONSORS,
      QUIZ: staticData.QUIZ,
    };
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const el = document.getElementById('hero-slider');
      if (el) {
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (el.scrollLeft >= maxScroll - 1) {
          el.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          el.scrollBy({ left: 350, behavior: 'smooth' });
        }
      }
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function init() {
      try {
        const data = await bookingService.getAllCms();
        if (Object.keys(data).length > 0) {
          const merged = { ...cms, ...data };
          setCms(merged);
          localStorage.setItem('fs_cms_cache', JSON.stringify(merged));
        }
      } catch (err) {
        console.error('CMS Fetch failed, using cached/static fallback');
      }
    }
    init();
  }, []);

  // Map CMS values to local constants for easier usage
  const {
    EVENT, TIERS, WHATS_NEW, GAMES, PRIZES, PRIZE_REWARDS,
    SCHEDULE, GALLERY, TESTIMONIALS, FAQ, HOSTS, SPONSORS, QUIZ
  } = cms;

  // Capacity & Settings state
  const [capacity, setCapacity] = useState({ sold: 0, max: 200 });
  const [isSoldOut, setIsSoldOut] = useState(false);
  const [settings, setSettings] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [bookings, s] = await Promise.all([
          bookingService.fetchBookings(),
          bookingService.getSettings()
        ]);
        const confirmed = bookings.filter(b => b.payment_status === 'CONFIRMED').reduce((acc, b) => acc + b.quantity, 0);
        const max = s.find(item => item.key === 'max_capacity');
        const maxVal = max ? Number(max.value) : 200;

        setSettings(s);
        setCapacity({ sold: confirmed, max: maxVal });
        if (confirmed >= maxVal) setIsSoldOut(true);
      } catch (err) {
        console.error('Capacity/Settings load failed');
      }
    }
    loadData();
  }, []);

  const dynamicTiers = useMemo(() => {
    const ebActive = settings.find(s => s.key === 'early_bird_active')?.value === 'true';
    const ebPrice = Number(settings.find(s => s.key === 'early_bird_price')?.value || 15000);
    const ebDeadline = settings.find(s => s.key === 'early_bird_deadline')?.value || 'May 22';

    let list = TIERS.map((t: any) => {
      if (t.id === 'early') {
        return { ...t, price: ebPrice, sub: `Pay before ${ebDeadline}` };
      }
      return t;
    });

    if (!ebActive) {
      list = list.filter((t: any) => t.id !== 'early');
    }
    return list;
  }, [TIERS, settings]);

  useEffect(() => {
    if (!dynamicTiers.find((t: any) => t.id === selectedTierId)) {
      if (dynamicTiers.length > 0) setSelectedTierId(dynamicTiers[0].id);
    }
  }, [dynamicTiers, selectedTierId]);

  if (isAdmin) {
    if (!isAuthenticated) {
      return <AdminLogin onLogin={handleAdminLogin} />;
    }
    return <AdminDashboard />;
  }

  const tier = dynamicTiers.find((t: any) => t.id === selectedTierId) || dynamicTiers[0];
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
  return (
    <div style={{ background: `radial-gradient(circle at 50% 30%, #1a1a1a 0%, ${C.bg} 70%)`, color: C.text, fontFamily: F.mono, paddingBottom: 'clamp(40px, 10vw, 80px)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: C.yellow, color: C.bg, padding: 'clamp(6px, 1.5vw, 12px) 0', overflow: 'hidden', borderTop: `3px solid ${C.bg}`, borderBottom: `3px solid ${C.bg}` }}>
        <div className="ss-marquee-anim" style={{ whiteSpace: 'nowrap', display: 'inline-block' }}>
          {Array.from({ length: 4 }).map((_, k) => (
            <span key={k} style={{ fontFamily: F.heavy, fontSize: 'clamp(11px, 2vw, 14px)', letterSpacing: 'clamp(1px, 0.5vw, 2px)', textTransform: 'uppercase' }}>
              ▲ FIRE &amp; SMOKE VOL.02 ▲ 30 MAY 2026 ▲ FAZENDA ZENGA ▲ DAYTIME GAMES EDITION ▲ DON'T COME ALONE ▲&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ── MOBILE NAV (TOP) ── */}
      <nav className="mobile-nav-top" style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: 'rgba(10, 10, 10, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid rgba(255,255,255,0.1)`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 20px'
      }}>
        <Logo />
        <button
          style={{ background: C.pink, color: C.bg, border: 'none', padding: '6px 12px', fontFamily: F.heavy, fontSize: 10, letterSpacing: 1 }}
          onClick={() => document.getElementById('tickets')?.scrollIntoView({ behavior: 'smooth' })}
        >
          RSVP
        </button>
      </nav>

      {/* ── DESKTOP NAV ── */}
      <nav className="desktop-nav" style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: 'rgba(10, 10, 10, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid rgba(255,255,255,0.1)`
      }}>
        <div className="desktop-nav-inner">
          <Logo />
          <ul className="desktop-nav-links">
            <li><a href="#whats-new">What's New</a></li>
            <li><a href="#schedule">Schedule</a></li>
            <li><a href="#games">Games</a></li>
            <li><a href="#tickets">Tickets</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>
          <button
            style={{ background: C.pink, color: C.bg, border: `2px solid ${C.bg}`, padding: '8px 16px', fontFamily: F.heavy, fontSize: 12, letterSpacing: 1 }}
            onClick={() => document.getElementById('tickets')?.scrollIntoView({ behavior: 'smooth' })}
          >
            RSVP NOW
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="ss-hero-smokey" style={{ width: '100%', padding: 'clamp(64px, 12vw, 120px) 0', minHeight: '85vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="ss-noise-overlay" />

        {/* video background */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
          <iframe
            src="https://www.youtube.com/embed/qICRoTRV-Fo?autoplay=1&mute=1&controls=0&loop=1&playlist=qICRoTRV-Fo&start=0&end=15&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            style={{
              width: '100vw',
              height: '56.25vw', /* 16:9 */
              minHeight: '100vh',
              minWidth: '177.77vh',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              filter: 'grayscale(0.1) contrast(1.1) brightness(0.6)'
            }}
          />
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(10,10,10,0.5), rgba(10,10,10,0.8))' }} />
        </div>

        <div className="app-container" style={{ position: 'relative', zIndex: 5 }}>
          <div className="hero-grid" style={{ alignItems: 'center' }}>
            <div className="ss-clean-title">
              <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                <span style={{ color: C.yellow, fontFamily: F.mono, fontSize: 12, letterSpacing: 4, fontWeight: 700 }}>VOL · 02</span>
                <span style={{ color: C.dim, opacity: 0.5 }}>/</span>
                <span style={{ color: C.pink, fontFamily: F.mono, fontSize: 12, letterSpacing: 4, fontWeight: 700 }}>RWA-26</span>
              </div>

              <h1 className="ss-hero-title">
                <div className="ss-title-fire">FIRE</div>
                <div className="ss-title-row">
                  <span className="ss-title-amp">&amp;</span>
                  <span className="ss-title-smoke">SMOKE</span>
                </div>
              </h1>

              <p style={{ fontFamily: F.mono, fontSize: 'clamp(14px, 1.4vw, 18px)', lineHeight: 1.6, color: '#a1a1aa', marginTop: 32, maxWidth: 480, letterSpacing: -0.5 }}>
                A daytime bbq experience under the pines. <span style={{ color: C.yellow }}>Limited capacity.</span> High-fire proteins, daytime sets, and the games we love.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 40 }}>
                <button className="ss-glass-cta ss-hover-lift" onClick={() => document.getElementById('tickets')?.scrollIntoView({ behavior: 'smooth' })}>
                  RSVP &amp; PAY NOW ↗
                </button>
                <div style={{ fontFamily: F.mono, fontSize: 11, color: C.dim, letterSpacing: 1 }}>
                  MAY 30 / MT KIGALI / 2PM
                </div>
              </div>
            </div>

            <div style={{ position: 'relative', maxWidth: '100%', overflow: 'hidden' }}>
              <div id="hero-slider" className="ss-hero-collage">
                {[
                  { src: '/photos/p13-peace.jpeg', cap: 'VOL.01 ✌' },
                  { src: '/photos/p11-chef-bandana.jpeg', cap: 'THE PITMASTER' },
                  { src: '/photos/p12-kamado.jpeg', cap: 'KAMADO HOT' },
                  { src: '/photos/image.png', cap: 'THE GRILL' },
                  { src: '/photos/p14-cheers.jpeg', cap: 'CHEERS' },
                  { src: '/photos/p15-vibes.jpeg', cap: 'SUNDAY SERVICE' },
                  { src: '/photos/p16-crowd.jpeg', cap: 'THE FAM' },
                  { src: '/photos/p17-fire.jpeg', cap: 'OPEN FLAME' },
                  { src: '/photos/p18-night.jpeg', cap: 'NIGHTCAP' },
                ].map(({ src, cap }) => (
                  <div key={src} className="ss-hero-polaroid" style={{
                    width: 'clamp(280px, 35vw, 400px)'
                  }}>
                    <img src={src} alt={cap} style={{ width: '100%', height: 'clamp(300px, 40vw, 420px)', objectFit: 'cover', display: 'block' }} />
                    <div style={{ marginTop: 12, textAlign: 'center', fontFamily: F.mono, fontSize: 11, fontWeight: 700, color: C.bg, letterSpacing: 1 }}>{cap}</div>
                  </div>
                ))}
                {/* Spacer to prevent cutting off the last item */}
                <div style={{ flex: '0 0 100px', width: 100 }} />
              </div>
            </div>

            {/* Desktop Slider Nav */}
            <div className="desktop-only" style={{ position: 'absolute', bottom: -20, right: 100, display: 'flex', gap: 12, zIndex: 10 }}>
              <button
                onClick={() => document.getElementById('hero-slider')?.scrollBy({ left: -300, behavior: 'smooth' })}
                style={{ background: C.bg, color: C.yellow, border: `2px solid ${C.yellow}`, padding: '12px 20px', fontFamily: F.heavy, cursor: 'pointer' }}
              >
                ←
              </button>
              <button
                onClick={() => document.getElementById('hero-slider')?.scrollBy({ left: 300, behavior: 'smooth' })}
                style={{ background: C.bg, color: C.yellow, border: `2px solid ${C.yellow}`, padding: '12px 20px', fontFamily: F.heavy, cursor: 'pointer' }}
              >
                →
              </button>
            </div>
          </div>
        </div>
      </section>

    <TornDivider color={C.yellow} />

  {/* ── WHAT'S NEW ── */ }
      <section id="whats-new" style={{ width: '100%', background: C.yellow, color: C.bg }}>
        <div className="section-responsive app-container">
          <SectionHeader title="NEW THIS EDITION" sub="// switch_it_up.sh" color={C.bg} />
          <div className="responsive-grid-2-4">
            {WHATS_NEW.map((w: any, i: number) => (
              <div key={i} style={{ background: C.bg, color: C.text, padding: 24, border: `2px solid ${C.bg}`, position: 'relative', boxShadow: '10px 10px 0 rgba(0,0,0,0.2)' }}>
                {i % 2 === 0 && <div className="ss-tape" style={{ top: -10, right: 20, width: 80, height: 25, opacity: 0.4 }} />}
                <div style={{ fontFamily: F.mono, fontSize: 9, letterSpacing: 2, color: C.yellow, fontWeight: 700 }}>NEW/{String(i + 1).padStart(2, '0')}</div>
                <div style={{ fontFamily: F.heavy, fontSize: 18, marginTop: 10, lineHeight: 1.1 }}>{w.title}</div>
                <div style={{ fontFamily: F.mono, fontSize: 13, color: C.dim, marginTop: 10, lineHeight: 1.4 }}>{w.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TornDivider color={C.bg} flip />

  {/* ── SCHEDULE ── */ }
  <section id="schedule" style={{ width: '100%', background: C.bg }}>
    <div className="section-responsive app-container" style={{ color: C.text }}>
      <SectionHeader title="RUN OF SHOW" sub="// what_happens_when()" />
      <div style={{ paddingLeft: 12, maxWidth: 800 }}>
        {SCHEDULE.map((row: any, i: number) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 20px 1fr', gap: 16, padding: '16px 0', borderBottom: `1px dashed ${C.dashed}`, alignItems: 'baseline' }}>
            <div style={{ fontFamily: F.display, fontSize: 24, color: C.yellow, letterSpacing: -1 }}>{row.t}</div>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: C.pink, marginTop: 8, alignSelf: 'start' }} />
            <div>
              <div style={{ fontFamily: F.heavy, fontSize: 18, color: C.text, letterSpacing: 0.5 }}>{row.label}</div>
              <div style={{ fontFamily: F.mono, fontSize: 13, color: C.dim, marginTop: 6 }}>{row.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>

  {/* ── GAMES ── */ }
  <section id="games" style={{ width: '100%', background: C.pink, color: C.bg, position: 'relative', overflow: 'hidden' }}>
    <div className="section-responsive app-container" style={{ position: 'relative', zIndex: 5 }}>
      <SectionHeader title="GAMES ON SITE" sub="// pick_your_poison()" color={C.bg} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', border: `1px solid ${C.bg}`, background: C.bg }}>
        {GAMES.map((g: any) => (
          <div key={g.name} style={{ padding: '16px', border: `1px solid rgba(255,255,255,0.1)`, textAlign: 'center' }}>
            <div style={{ fontFamily: F.mono, fontSize: 9, color: C.yellow, opacity: 0.8 }}>{g.tag.toUpperCase()}</div>
            <div style={{ fontFamily: F.heavy, fontSize: 15, color: C.text, marginTop: 4 }}>{g.name}</div>
          </div>
        ))}
      </div>
      <div style={{ position: 'relative', marginTop: 24 }}>
        <div className="ss-doodle-arrow" style={{ position: 'absolute', left: 20, top: -10, fontSize: 24, transform: 'rotate(180deg)' }}>➔</div>
        <div style={{ fontFamily: F.mono, fontSize: 14, fontWeight: 700, textAlign: 'center', color: C.bg, background: C.yellow, padding: '8px 20px', display: 'inline-block', margin: '0 auto', letterSpacing: 1 }}>
          ★ ANYONE WITH GAMES IS WELCOME TO BRING THEM ALONG ★
        </div>
      </div>
    </div>

    {/* Jenga Decoration */}
    <img
      src="/photos/pngtree-wooden-jenga-tower-png-image_16011186.png"
      alt="Jenga Tower"
      style={{
        position: 'absolute',
        bottom: -20,
        right: -20,
        width: 'clamp(150px, 25vw, 300px)',
        transform: 'rotate(-5deg)',
        zIndex: 1,
        opacity: 0.9,
        pointerEvents: 'none'
      }}
    />
  </section>

  {/* ── PRIZES ── */ }
      <section style={{ width: '100%', background: C.bg }}>
        <div className="section-responsive app-container" style={{ color: C.text }}>
          <SectionHeader title="WHAT YOU CAN WIN" sub="// reward.json" />
          <div className="responsive-grid-2-4">
            {PRIZES.map((p: any, i: number) => (
              <div key={i} style={{ padding: 24, background: C.panel, border: `2px solid ${C.border}`, borderTop: `6px solid ${i % 2 === 0 ? C.pink : C.yellow}`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -10, right: -10, fontSize: 80, color: C.bg, opacity: 0.1, fontFamily: F.display, pointerEvents: 'none' }}>0{i + 1}</div>
                <div style={{ fontFamily: F.display, fontSize: 48, color: i % 2 === 0 ? C.pink : C.yellow, lineHeight: 1, letterSpacing: -2 }}>0{i + 1}</div>
                <div style={{ fontFamily: F.heavy, fontSize: 22, color: C.text, marginTop: 12, letterSpacing: 0.5 }}>{p.name}</div>
                <div style={{ fontFamily: F.mono, fontSize: 13, color: C.dim, marginTop: 8, lineHeight: 1.4 }}>{p.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 24, padding: 24, background: C.bg, border: `2px solid ${C.yellow}`, color: C.yellow }}>
            <div style={{ fontFamily: F.heavy, fontSize: 18, letterSpacing: 2, marginBottom: 16 }}>★ PRIZES INCLUDE:</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 20 }}>
              {PRIZE_REWARDS.map((r: any, i: number) => (
                <div key={i} style={{ textAlign: 'center', border: `1px dashed ${C.yellow}`, padding: 12 }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{r.icon === 'cup' ? '🥤' : r.icon === 'ticket' ? '🎫' : '📢'}</div>
                  <div style={{ fontFamily: F.mono, fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>{r.name.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <TornDivider color={C.orange} />

  {/* ── SAUCE HEAT SLIDER ── */ }
      <section style={{ 
        width: '100%', 
        position: 'relative',
        backgroundImage: 'url(/photos/image.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed', // nice parallax-ish feel
        color: C.bg 
      }}>
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          backgroundColor: '#fb923c', // C.orange
          opacity: 0.7, 
          zIndex: 1 
        }} />
        <div className="section-responsive app-container" style={{ position: 'relative', zIndex: 2 }}>
          <SectionHeader title="SAUCE BATTLE" sub="// pick_a_lane.sh" color={C.bg} />
          <div className="ss-chalkboard" style={{ padding: '40px 24px', color: '#fff', maxWidth: 800, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: F.mono, fontSize: 12, letterSpacing: 3, fontWeight: 700, color: C.yellow }}>THE HEAT LEVEL ↓</div>
              <div style={{ fontFamily: F.display, fontSize: 'clamp(48px,12vw,80px)', lineHeight: 1, marginTop: 12, letterSpacing: -2, color: heatColor, textShadow: `0 0 15px ${heatColor}`, transition: 'color 0.3s' }}>
                {heatLabel}
              </div>
            </div>
            <div style={{ width: 110, height: 110, borderRadius: '50%', border: `4px solid ${heatColor}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#000', color: C.yellow, flexShrink: 0, boxShadow: '0 0 20px rgba(0,0,0,0.5)' }}>
              <div style={{ fontFamily: F.display, fontSize: 44, lineHeight: 1 }}>{heat}</div>
              <div style={{ fontFamily: F.mono, fontSize: 14, fontWeight: 700, marginTop: -4 }}>/ 5</div>
            </div>
          </div>
          <input
            type="range" min={1} max={5} value={heat}
            onChange={e => setHeat(Number(e.target.value))}
            style={{ width: '100%', marginTop: 32 }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', marginTop: 12 }}>
            {HEAT_LABELS.map((l, i) => (
              <div key={l} style={{ fontFamily: F.mono, fontSize: 11, letterSpacing: 1, textAlign: 'center', color: i + 1 === heat ? C.bg : 'rgba(10,10,10,0.4)', fontWeight: i + 1 === heat ? 700 : 400 }}>{l}</div>
            ))}
          </div>
          <div style={{ fontFamily: F.mono, fontSize: 15, marginTop: 24, padding: 16, background: C.bg, color: C.yellow, lineHeight: 1.5 }}>
            {heat <= 2 && '> honey-glaze, smoked paprika, lemon. mellow vibes.'}
            {heat === 3 && '> akabanga + ginger glaze. respect-tier. start here.'}
            {heat === 4 && '> pili-pili reduction. you WILL feel it tomorrow.'}
            {heat === 5 && '> carolina reaper × habanero. no survivors. sign waiver.'}
          </div>
            </div>
        </div>
      </section>

      <TornDivider color={C.bg} flip />

  {/* ── GALLERY ── */ }
  <section style={{ width: '100%', background: C.bg }}>
    <div className="section-responsive app-container" style={{ color: C.text }}>
      <SectionHeader title="LAST EDITION" sub="// roll.gif" />
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ position: 'relative', border: `4px solid ${C.yellow}`, padding: 8, background: C.bg }}>
          <img src={GALLERY[carouselIdx].src} alt={GALLERY[carouselIdx].caption} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', top: 16, left: 16, background: C.pink, color: C.bg, fontFamily: F.mono, fontSize: 12, fontWeight: 700, letterSpacing: 1.5, padding: '4px 10px' }}>● REC</div>
          <div style={{ position: 'absolute', top: 16, right: 16, background: C.bg, color: C.yellow, fontFamily: F.mono, fontSize: 12, fontWeight: 700, letterSpacing: 1.5, padding: '4px 10px', border: `1px solid ${C.yellow}` }}>
            VOL.01 / {String(carouselIdx + 1).padStart(2, '0')}
          </div>
          <div style={{ position: 'absolute', bottom: 20, left: 16, right: 16, background: 'rgba(0,0,0,0.7)', color: C.yellow, fontFamily: F.mono, fontSize: 14, padding: '12px 16px', backdropFilter: 'blur(4px)' }}>
            "{GALLERY[carouselIdx].caption}"
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, gap: 16 }}>
          <button style={{ flex: 1, padding: 16, background: 'transparent', border: `2px solid ${C.yellow}`, color: C.yellow, fontFamily: F.heavy, fontSize: 14, letterSpacing: 2, cursor: 'pointer' }}
            onClick={() => setCarouselIdx((carouselIdx - 1 + GALLERY.length) % GALLERY.length)}>← PREV</button>
          <button style={{ flex: 1, padding: 16, background: 'transparent', border: `2px solid ${C.yellow}`, color: C.yellow, fontFamily: F.heavy, fontSize: 14, letterSpacing: 2, cursor: 'pointer' }}
            onClick={() => setCarouselIdx((carouselIdx + 1) % GALLERY.length)}>NEXT →</button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
          {GALLERY.map((_: any, i: number) => (
            <button key={i} onClick={() => setCarouselIdx(i)} style={{ width: 10, height: 10, borderRadius: '50%', border: 'none', cursor: 'pointer', padding: 0, background: i === carouselIdx ? C.yellow : 'rgba(255,255,255,0.2)' }} />
          ))}
        </div>
      </div>
    </div>
  </section>

  {/* ── VOICES ── */ }
  <section style={{ width: '100%', background: C.bg }}>
    <div className="section-responsive app-container" style={{ color: C.text }}>
      <SectionHeader title="VOICES" sub="// reviews.txt" />
      <div className="responsive-grid-2-2">
        {TESTIMONIALS.map((t: any, i: number) => (
          <div key={i} style={{ padding: 24, border: '3px solid #fafafa', transform: `rotate(${i % 2 ? 0.5 : -0.5}deg)`, background: VOICE_COLORS[i % 4], color: C.bg }}>
            <div style={{ fontFamily: F.heavy, fontSize: 18, lineHeight: 1.4 }}>"{t.quote}"</div>
            <div style={{ fontFamily: F.mono, fontSize: 13, fontWeight: 700, marginTop: 14, letterSpacing: 1 }}>— {t.name} {t.handle}</div>
          </div>
        ))}
      </div>
    </div>
  </section>

  {/* ── CREW ── */ }
  <section style={{ width: '100%', background: C.bg }}>
    <div className="section-responsive app-container" style={{ color: C.text }}>
      <SectionHeader title="THE CREW" sub="// hosts.csv" />
      <div className="responsive-grid-2-4">
        {HOSTS.map((h: any, i: number) => (
          <div key={i} style={{ padding: 20, background: C.panel, border: `1px solid ${C.border}`, textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.heavy, fontSize: 22, color: C.bg, margin: '0 auto 12px', border: `3px solid ${C.bg}`, background: CREW_COLORS[i % 3] }}>
              {h.name.split(' ').map((p: string) => p[0]).join('')}
            </div>
            <div style={{ fontFamily: F.heavy, fontSize: 16 }}>{h.name}</div>
            <div style={{ fontFamily: F.mono, fontSize: 11, color: C.yellow, letterSpacing: 2, fontWeight: 700, marginTop: 6 }}>{h.role}</div>
            <div style={{ fontFamily: F.mono, fontStyle: 'italic', fontSize: 12, color: C.dim, marginTop: 8 }}>"{h.tag}"</div>
          </div>
        ))}
      </div>
    </div>
  </section>

  {/* ── TICKETS ── */ }
      <section id="tickets" style={{ width: '100%', background: C.yellow, color: C.bg }}>
    <div className="section-responsive app-container">
      <SectionHeader title="GET YOUR PASS" sub="// reserve.exe" color={C.bg} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginTop: 32 }}>
        {dynamicTiers.map((t: any) => {
          const active = selectedTierId === t.id;
          const posterColors = {
            early: C.yellow,
            regular: '#dc2626', // Red from poster
            duo: '#fb923c', // orange
            gate: '#f59e0b', // dark orange
          };
          const cardColor = (posterColors as any)[t.id] || C.yellow;

          return (
            <div key={t.id} style={{ display: 'flex', flexDirection: 'column' }}>
              <button onClick={() => !isSoldOut && setSelectedTierId(t.id)}
                disabled={isSoldOut}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: 24,
                  background: isSoldOut ? '#333' : cardColor,
                  color: isSoldOut ? C.dim : C.bg,
                  border: active && !isSoldOut ? `6px solid ${C.bg}` : `2px solid ${C.bg}`,
                  textAlign: 'center',
                  cursor: isSoldOut ? 'not-allowed' : 'pointer',
                  position: 'relative',
                  boxShadow: active && !isSoldOut ? `0 12px 0 ${C.bg}` : `0 6px 0 ${C.bg}`,
                  transition: 'all 0.1s',
                  width: '100%',
                  opacity: isSoldOut && !active ? 0.5 : 1,
                  flex: 1
                }}>
                <div style={{ fontFamily: F.heavy, fontSize: 18, textTransform: 'uppercase', letterSpacing: 1 }}>{t.name}</div>
                <div style={{ fontSize: 32, margin: '12px 0' }}>{isSoldOut ? '🚫' : t.id === 'early' ? '🎟️' : t.id === 'duo' ? '👥' : t.id === 'gate' ? '🕒' : '🎟️'}</div>
                <div style={{ fontFamily: F.display, fontSize: 32, lineHeight: 1 }}>{t.price.toLocaleString()} <span style={{ fontSize: 14, fontFamily: F.mono }}>RWF</span></div>
                <div style={{ fontFamily: F.mono, fontSize: 10, marginTop: 12, fontWeight: 700, opacity: 0.8 }}>{t.sub.toUpperCase()}</div>
                {active && !isSoldOut && <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: C.bg, color: cardColor, padding: '2px 10px', fontSize: 10, fontFamily: F.heavy }}>SELECTED</div>}
              </button>

              {active && !isSoldOut && (
                <button
                  className="ss-hover-lift"
                  onClick={() => setCheckoutOpen(true)}
                  style={{
                    marginTop: 16,
                    background: C.bg,
                    color: cardColor,
                    border: `3px solid ${cardColor}`,
                    padding: '12px',
                    fontFamily: F.heavy,
                    fontSize: 14,
                    cursor: 'pointer',
                    letterSpacing: 1,
                    animation: 'ss-fade-in 0.3s'
                  }}
                >
                  PAY NOW ↗
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Capacity Urgency Bar */}
      <div style={{ marginTop: 40, background: 'rgba(0,0,0,0.2)', padding: 20, borderRadius: 8, border: `1px solid ${isSoldOut ? C.pink : 'rgba(255,255,255,0.1)'}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12, fontFamily: F.mono }}>
          <div>
            <div style={{ fontSize: 10, color: C.dim, letterSpacing: 2, fontWeight: 700, marginBottom: 4 }}>EVENT_AVAILABILITY</div>
            <div style={{ fontSize: 24, fontFamily: F.display, color: isSoldOut ? C.pink : C.bg }}>
              {isSoldOut ? 'SOLD OUT' : `${capacity.max - capacity.sold} SEATS LEFT`}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: C.dim, letterSpacing: 2, fontWeight: 700, marginBottom: 4 }}>TICKETS_SOLD</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.bg }}>{capacity.sold} / {capacity.max}</div>
          </div>
        </div>
        <div style={{ width: '100%', height: 12, background: 'rgba(0,0,0,0.3)', borderRadius: 6, overflow: 'hidden', border: `1px solid ${C.bg}` }}>
          <div style={{
            width: `${(capacity.sold / capacity.max) * 100}%`,
            height: '100%',
            background: isSoldOut ? C.pink : C.bg,
            transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
          }} />
        </div>
        {!isSoldOut && capacity.max - capacity.sold <= 20 && (
          <div style={{ marginTop: 12, color: C.pink, fontSize: 12, fontWeight: 700, textAlign: 'center', animation: 'ss-pulse 2s infinite' }}>
            ⚠️ HURRY! LESS THAN 20 SEATS REMAINING.
          </div>
        )}
      </div>

      <div style={{ marginTop: 40, padding: 32, background: C.bg, color: C.text, border: `4px solid ${C.yellow}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24, opacity: isSoldOut ? 0.8 : 1 }}>
        <div>
          <div style={{ fontFamily: F.mono, fontSize: 12, color: C.yellow, letterSpacing: 2, fontWeight: 700 }}>PAYMENT DETAILS:</div>
          <div style={{ fontFamily: F.heavy, fontSize: 24, marginTop: 8 }}>{EVENT.payTo}</div>
          <div style={{ fontFamily: F.mono, fontSize: 14, color: C.dim }}>{EVENT.payName}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: F.mono, fontSize: 12, color: C.yellow, letterSpacing: 2, fontWeight: 700 }}>TOTAL DUE:</div>
          <div style={{ fontFamily: F.display, fontSize: 44, color: C.pink }}>{total.toLocaleString()} <span style={{ fontSize: 16 }}>RWF</span></div>
        </div>
        <button
          className={isSoldOut ? "" : "ss-hover-lift"}
          disabled={isSoldOut}
          style={{
            width: '100%',
            padding: 24,
            background: isSoldOut ? '#333' : C.yellow,
            color: isSoldOut ? C.dim : C.bg,
            border: `4px solid ${C.bg}`,
            fontFamily: F.display,
            fontSize: 24,
            cursor: isSoldOut ? 'not-allowed' : 'pointer',
            letterSpacing: 1,
            boxShadow: isSoldOut ? 'none' : `0 8px 0 ${C.bg}`
          }}
          onClick={() => setCheckoutOpen(true)}>
          {isSoldOut ? 'SOLD OUT - WAITLIST ONLY' : 'RSVP & PAY NOW ↗'}
        </button>
      </div>
    </div>
      </section>
      <TornDivider color={C.bg} flip />

  {/* ── BBQ QUIZ ── */ }
  <section style={{ width: '100%', background: C.bg }}>
    <div className="section-responsive app-container" style={{ color: C.text }}>
      <SectionHeader title="BBQ QUIZ" sub="// 5 questions. no cheating." />
      <div style={{ padding: 24, background: C.panel, border: `1px solid ${C.border}`, maxWidth: 800, margin: '0 auto' }}>
        {!quizDone ? (
          <>
            <div style={{ display: 'flex', gap: 6 }}>
              {QUIZ.map((_: any, i: number) => (
                <div key={i} style={{ flex: 1, height: 8, background: i < quizIdx ? C.yellow : i === quizIdx ? C.orange : C.dashed }} />
              ))}
            </div>
            <div style={{ fontFamily: F.mono, fontSize: 11, letterSpacing: 2, color: C.yellow, fontWeight: 700, marginTop: 12 }}>
              Q {quizIdx + 1} OF {QUIZ.length} · SCORE {quizScore}
            </div>
            <div style={{ fontFamily: F.heavy, fontSize: 22, color: C.text, marginTop: 12, lineHeight: 1.2 }}>{QUIZ[quizIdx].q}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
              {QUIZ[quizIdx].options.map((opt: string, i: number) => {
                const revealed = quizChoice !== null;
                const isCorrect = QUIZ[quizIdx].answer === i;
                const isPicked = quizChoice === i;
                return (
                  <button key={i} disabled={revealed} onClick={() => setQuizChoice(i)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px',
                      background: revealed && isCorrect ? 'rgba(34,197,94,0.15)' : revealed && isPicked && !isCorrect ? 'rgba(239,68,68,0.15)' : C.bg,
                      color: C.text,
                      border: revealed && isCorrect ? '2px solid #22c55e' : revealed && isPicked && !isCorrect ? '2px solid #ef4444' : `1px solid ${C.dashed}`,
                      cursor: revealed ? 'default' : 'pointer',
                      fontFamily: F.mono, fontSize: 14, textAlign: 'left', width: '100%',
                    }}>
                    <span style={{ fontFamily: F.heavy, fontSize: 14, color: C.yellow, letterSpacing: 2, minWidth: 24 }}>{String.fromCharCode(65 + i)}</span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
            {quizChoice !== null && (
              <div style={{ fontFamily: F.mono, fontSize: 14, color: '#d4d4d8', marginTop: 20, padding: 16, background: C.bg, lineHeight: 1.6, border: `1px solid ${C.dashed}` }}>
                <strong style={{ color: quizChoice === QUIZ[quizIdx].answer ? '#86efac' : '#fca5a5' }}>
                  {quizChoice === QUIZ[quizIdx].answer ? '> CORRECT' : '> WRONG'}
                </strong>
                <div style={{ marginTop: 8 }}>{QUIZ[quizIdx].fact}</div>
                <button style={{ display: 'block', marginTop: 16, background: C.yellow, color: C.bg, border: 'none', padding: '12px 18px', fontFamily: F.heavy, fontSize: 14, letterSpacing: 2, cursor: 'pointer' }} onClick={advanceQuiz}>
                  {quizIdx === QUIZ.length - 1 ? 'SEE_RESULT()' : 'NEXT_Q() →'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '24px 12px' }}>
            <div style={{ fontFamily: F.display, fontSize: 100, color: C.yellow, lineHeight: 1, letterSpacing: -4 }}>{quizScore}/{QUIZ.length}</div>
            <div style={{ fontFamily: F.mono, fontSize: 18, fontWeight: 700, color: C.text, marginTop: 12, letterSpacing: 1 }}>
              {quizScore === 5 ? '> PITMASTER. BRING THE TONGS.' :
                quizScore === 4 ? "> STRONG SHOW. YOU'RE MANNING A GRILL." :
                  quizScore === 3 ? '> DECENT. STAND NEAR COLLINS.' :
                    '> COME FOR THE FOOD, LEAVE WITH A DEGREE.'}
            </div>
            <button style={{ marginTop: 20, background: 'transparent', border: `3px solid ${C.yellow}`, color: C.yellow, padding: '12px 20px', fontFamily: F.heavy, fontSize: 14, letterSpacing: 2, cursor: 'pointer' }} onClick={resetQuiz}>
              RESET()
            </button>
          </div>
        )}
      </div>
    </div>
  </section>

  {/* ── FAQ ── */ }
  <section id="faq" style={{ width: '100%', background: C.bg }}>
    <div className="section-responsive app-container" style={{ color: C.text }}>
      <SectionHeader title="FAQ" sub="// readme.md" />
      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 900 }}>
        {FAQ.map((f: any, i: number) => (
          <div key={i} style={{ borderBottom: `1px dashed ${C.dashed}` }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%', padding: '24px 0', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', color: C.text }}
              onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
              <span style={{ fontFamily: F.mono, fontSize: 14, fontWeight: 700, color: C.yellow, letterSpacing: 2 }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ fontFamily: F.heavy, fontSize: 18, color: C.text, flex: 1, lineHeight: 1.3 }}>{f.q}</span>
              <span style={{ fontFamily: F.display, fontSize: 28, color: C.pink, transition: 'transform 0.2s', transform: openFaq === i ? 'rotate(45deg)' : undefined, display: 'inline-block' }}>+</span>
            </button>
            {openFaq === i && (
              <div style={{ fontFamily: F.mono, fontSize: 15, color: C.dim, lineHeight: 1.6, padding: '0 0 24px 40px' }}>{f.a}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  </section>

  {/* ── MAP ── */ }
  <section style={{ width: '100%', background: C.cyan, color: C.bg }}>
    <div className="section-responsive app-container">
      <SectionHeader title="GETTING THERE" sub="// gps.coords" color={C.bg} />
      <div className="hero-grid" style={{ alignItems: 'center' }}>
        <div style={{ background: '#fff', padding: 8, border: `4px solid ${C.bg}`, boxShadow: `12px 12px 0 ${C.bg}` }}>
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
        <div style={{ padding: 32, background: C.bg, color: C.yellow, border: `4px solid ${C.bg}`, boxShadow: `12px 12px 0 ${C.yellow}` }}>
          {[
            { k: 'LOC', v: 'Fazenda Zenga · Mt Kigali pines' },
            { k: 'WHEN', v: 'SAT 30 MAY · 2PM' },
          ].map(({ k, v }: { k: string, v: string }) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px dashed ${C.dashed}` }}>
              <span style={{ fontFamily: F.mono, fontSize: 12, letterSpacing: 2, fontWeight: 700 }}>{k}</span>
              <span style={{ fontFamily: F.heavy, fontSize: 16, color: C.text }}>{v}</span>
            </div>
          ))}
          <a href={EVENT.mapsUrl} target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-block', width: '100%', textAlign: 'center', marginTop: 24, padding: '16px 20px', background: C.yellow, color: C.bg, fontFamily: F.heavy, fontSize: 14, letterSpacing: 2, textDecoration: 'none' }}>
            OPEN_IN_MAPS() ↗
          </a>
        </div>
      </div>
    </div>
  </section>

  {/* ── SPONSORS ── */ }
  <section style={{ width: '100%', background: C.bg }}>
    <div className="section-responsive app-container" style={{ color: C.text }}>
      <div style={{ fontFamily: F.mono, fontSize: 12, letterSpacing: 2, color: C.dim, fontWeight: 700, marginBottom: 20 }}>// WITH_THANKS_TO</div>
      <div className="responsive-grid-2-4">
        {SPONSORS.map((s: any, i: number) => (
          <div key={i} style={{ padding: 16, background: C.panel, border: `1px solid ${C.border}` }}>
            <div style={{ fontFamily: F.heavy, fontSize: 16, color: C.text }}>{s.name}</div>
            <div style={{ fontFamily: F.mono, fontSize: 11, color: C.yellow, letterSpacing: 1.5, fontWeight: 700, marginTop: 6 }}>{s.kind}</div>
          </div>
        ))}
      </div>
    </div>
  </section>

  {/* ── BOTTOM MARQUEE ── */ }
  <div style={{ background: C.pink, color: C.bg, padding: 'clamp(6px, 1.5vw, 12px) 0', overflow: 'hidden', borderTop: `3px solid ${C.bg}`, borderBottom: `3px solid ${C.bg}` }}>
    <div className="ss-marquee-anim-rev" style={{ whiteSpace: 'nowrap', display: 'inline-block' }}>
      {Array.from({ length: 4 }).map((_, k) => (
        <span key={k} style={{ fontFamily: F.heavy, fontSize: 'clamp(11px, 2vw, 14px)', letterSpacing: 'clamp(1px, 0.5vw, 2px)', textTransform: 'uppercase' }}>
          ✦ COME HUNGRY ✦ BRING A FRIEND ✦ LEAVE WITH STORIES ✦ {EVENT.ig} ✦&nbsp;
        </span>
      ))}
    </div>
  </div>

  {/* ── FOOTER ── */ }
  <footer style={{ width: '100%', background: C.bg, borderTop: `3px solid ${C.yellow}` }}>
    <div className="app-container" style={{ padding: 'clamp(40px, 8vw, 64px) clamp(12px, 4vw, 32px) clamp(100px, 20vw, 140px)', textAlign: 'center' }}>
      <div style={{ fontFamily: F.display, fontSize: 'clamp(32px, 8vw, 48px)', color: C.text, letterSpacing: -0.5 }}>FIRE &amp; SMOKE</div>
      <div style={{ fontFamily: F.mono, fontSize: 12, color: C.dim, marginTop: 10, letterSpacing: 1 }}>© 2026 · KIGALI · NOT JUST A BBQ</div>
      <div style={{ fontFamily: F.mono, fontSize: 12, color: C.dim, marginTop: 10, letterSpacing: 1 }}>{EVENT.ig} · {EVENT.whatsapp}</div>
      <div style={{ fontFamily: F.mono, fontSize: 11, color: C.dim, marginTop: 32, letterSpacing: 0.5, opacity: 0.8 }}>
        Built & Maintained by <a href="https://www.avel.africa" target="_blank" rel="noopener noreferrer" style={{ color: C.text, textDecoration: 'none', borderBottom: `1px solid ${C.dashed}` }}>avel Africa</a> [www.avel.africa]
      </div>
    </div>
  </footer>

  {/* ── STICKY BAR (MOBILE ONLY) ── */ }
  <div className="mobile-only-sticky" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: C.bg, borderTop: `3px solid ${C.yellow}`, padding: 'clamp(8px, 2vw, 14px) clamp(10px, 3vw, 20px)', alignItems: 'center', zIndex: 50, gap: 10 }}>
    <div>
      <div style={{ fontFamily: F.mono, fontSize: 8, letterSpacing: 1.5, color: C.yellow, fontWeight: 700 }}>FROM</div>
      <div style={{ fontFamily: F.heavy, fontSize: 'clamp(14px, 4vw, 18px)', color: C.text, lineHeight: 1.1 }}>15,000 RWF</div>
    </div>
    <button style={{ background: C.pink, color: C.bg, border: 'none', padding: 'clamp(10px, 2vw, 14px) clamp(12px, 3vw, 20px)', fontFamily: F.heavy, fontSize: 'clamp(11px, 2vw, 14px)', letterSpacing: 1.5, cursor: 'pointer', whiteSpace: 'nowrap' }}
      onClick={() => setCheckoutOpen(true)}>RSVP ↗</button>
  </div>

  {/* ── CHECKOUT MODAL ── */ }
  {
    checkoutOpen && (
      <Checkout tier={tier} qty={qty} total={total} onClose={() => setCheckoutOpen(false)} />
    )
  }

  { showCookieConsent && <CookieConsent onAccept={handleAcceptCookies} /> }
    </div >
  );
}
