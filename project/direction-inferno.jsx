// Direction 1: INFERNO — Heavy gritty poster. Black, fire-red, paper textures,
// distressed angled stamps, sticker labels, condensed display type.

function InfernoSite() {
  const { EVENT, TIERS, WHATS_NEW, GAMES, PRIZES, PRIZE_REWARDS, SCHEDULE,
          GALLERY, TESTIMONIALS, FAQ, HOSTS, SPONSORS, QUIZ,
          useCountdown, SmokeSVG, FlameSVG } = window.FS;

  const cd = useCountdown(EVENT.dateISO);
  const [selectedTier, setSelectedTier] = React.useState('early');
  const [qty, setQty] = React.useState(1);
  const [checkoutOpen, setCheckoutOpen] = React.useState(false);
  const [heat, setHeat] = React.useState(3);
  const [carouselIdx, setCarouselIdx] = React.useState(0);
  const [openFaq, setOpenFaq] = React.useState(0);
  const [quizIdx, setQuizIdx] = React.useState(0);
  const [quizChoice, setQuizChoice] = React.useState(null);
  const [quizScore, setQuizScore] = React.useState(0);
  const [quizDone, setQuizDone] = React.useState(false);

  const tier = TIERS.find(t => t.id === selectedTier);
  const total = (tier.id === 'duo' ? tier.price : tier.price * qty);

  const heatLabel = ['Mild','Warm','Spicy','Heat','Inferno'][heat-1];
  const heatColor = ['#facc15','#fb923c','#ef4444','#dc2626','#7f1d1d'][heat-1];

  return (
    <div style={infStyles.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Barlow+Condensed:wght@500;600;700;800;900&family=Special+Elite&family=Permanent+Marker&display=swap" rel="stylesheet" />
      <style>{infCSS}</style>

      {/* ───────────────── HERO ───────────────── */}
      <section style={infStyles.hero}>
        <div className="inf-noise" />
        <SmokeSVG opacity={0.55} />
        {/* fire glow at bottom */}
        <div style={infStyles.heroGlow} />
        <FlameSVG style={{ position:'absolute', left:-40, bottom:-30, width:200, height:240, opacity:0.85, mixBlendMode:'screen' }} />
        <FlameSVG style={{ position:'absolute', right:-50, bottom:-40, width:220, height:260, opacity:0.7, mixBlendMode:'screen', transform:'scaleX(-1)' }} />

        {/* top nav */}
        <div style={infStyles.nav}>
          <span style={{ fontFamily:'Special Elite, monospace', fontSize:11, letterSpacing:2, color:'#facc15' }}>★ EDITION 02</span>
          <span style={{ fontFamily:'Special Elite, monospace', fontSize:11, letterSpacing:2, color:'#fde68a' }}>{EVENT.ig}</span>
        </div>

        {/* megaphone alert sticker */}
        <div style={infStyles.alertSticker}>
          <span style={{ fontFamily:'Anton, sans-serif', fontSize:13, color:'#111' }}>📣 ALERT — NOT JUST A BBQ</span>
        </div>

        {/* big logo */}
        <div style={infStyles.heroTitleWrap}>
          <div style={infStyles.tagline}>NEW MONTH. NEW FLAME. NEW VIBE.</div>
          <h1 style={infStyles.h1}>
            <span style={infStyles.fireRow}>FIRE</span>
            <span style={infStyles.amp}>&amp;</span>
            <span style={infStyles.smokeRow}>SMOKE</span>
          </h1>
          <div style={infStyles.returns}>
            <span>RETURNS</span>
            <em style={infStyles.editionPill}>BBQ GAMES EDITION</em>
          </div>
        </div>

        {/* date / loc strip */}
        <div style={infStyles.dateStrip}>
          <div style={infStyles.dateItem}>
            <div style={infStyles.dateK}>DATE</div>
            <div style={infStyles.dateV}>30 MAY · 2026</div>
          </div>
          <div style={infStyles.dateDivider} />
          <div style={infStyles.dateItem}>
            <div style={infStyles.dateK}>LOCATION</div>
            <div style={infStyles.dateV}>FAZENDA ZENGA</div>
          </div>
        </div>

        {/* countdown */}
        <div style={infStyles.cdBox}>
          {[['DAYS',cd.days],['HRS',cd.hours],['MIN',cd.mins],['SEC',cd.secs]].map(([k,v],i)=>(
            <div key={i} style={infStyles.cdCell}>
              <div style={infStyles.cdNum}>{String(v).padStart(2,'0')}</div>
              <div style={infStyles.cdK}>{k}</div>
            </div>
          ))}
        </div>

        <button style={infStyles.heroCTA} onClick={()=>document.getElementById('inf-rsvp')?.scrollIntoView()}>
          RSVP &amp; PAY ›
        </button>
        <div style={infStyles.heroSub}>15,000 RWF Early Bird · ends May 22</div>
      </section>

      {/* ───────────────── WHAT'S NEW ───────────────── */}
      <section style={infStyles.section}>
        <SectionHeader kicker="03" title="WHAT'S NEW" sub="Last edition we cooked. This one, we PLAY." />
        <div style={infStyles.newGrid}>
          {WHATS_NEW.map((w,i)=>(
            <div key={i} style={{...infStyles.newCard, transform:`rotate(${i%2?1:-1.2}deg)`}}>
              <div style={infStyles.newIcon}><Icon name={w.icon} /></div>
              <div style={infStyles.newTitle}>{w.title}</div>
              <div style={infStyles.newSub}>{w.sub}</div>
              <div style={infStyles.newTape}>NEW</div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────── GALLERY CAROUSEL ───────────────── */}
      <section style={{...infStyles.section, padding:'40px 0 32px'}}>
        <div style={{ padding:'0 22px' }}>
          <SectionHeader kicker="04" title="LAST TIME ON THE FIRE" sub="Photos from the first edition." />
        </div>
        <div style={infStyles.carouselWrap}>
          <div style={{...infStyles.carouselTrack, transform:`translateX(calc(50% - ${(carouselIdx*240) + 120}px))`}}>
            {GALLERY.map((p,i)=>(
              <div key={i} style={{
                ...infStyles.polaroid,
                transform:`rotate(${i%2===0?-2:2}deg) ${i===carouselIdx?'scale(1.04)':''}`,
                outline: i===carouselIdx ? '3px solid #f97316' : 'none',
              }} onClick={()=>setCarouselIdx(i)}>
                <div style={{...infStyles.polaroidImg, backgroundImage:`url(${p.src})`}} />
                <div style={infStyles.polaroidCap}>{p.caption}</div>
              </div>
            ))}
          </div>
          <div style={infStyles.carouselDots}>
            {GALLERY.map((_,i)=>(
              <button key={i} onClick={()=>setCarouselIdx(i)} style={{
                ...infStyles.dot,
                background: i===carouselIdx ? '#f97316' : 'rgba(255,255,255,0.25)',
                width: i===carouselIdx ? 22 : 6,
              }} />
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── GAMES ───────────────── */}
      <section style={{...infStyles.section, background:'#0a0907'}}>
        <SectionHeader kicker="05" title="GAMES ON SITE" sub="Bring your own deck if you have one. We have stations for:" />
        <div style={infStyles.gamesGrid}>
          {GAMES.map((g,i)=>(
            <div key={i} style={infStyles.gameChip}>
              <span style={infStyles.gameDot} />
              <span style={infStyles.gameName}>{g.name}</span>
              <span style={infStyles.gameTag}>{g.tag}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────── BBQ QUIZ MINI ───────────────── */}
      <section style={{...infStyles.section, padding:'56px 22px 32px'}}>
        <SectionHeader kicker="06" title="PREGAME: BBQ QUIZ" sub={quizDone ? 'Score in. Bring this energy to the forest.' : 'Five questions. Warm-up for the real one on the day.'} />
        <div style={infStyles.quizBox}>
          {!quizDone ? (
            <React.Fragment>
              <div style={infStyles.quizMeta}>
                <span>Q{quizIdx+1} of {QUIZ.length}</span>
                <span>Score · {quizScore}</span>
              </div>
              <div style={infStyles.quizQ}>{QUIZ[quizIdx].q}</div>
              <div style={infStyles.quizOpts}>
                {QUIZ[quizIdx].options.map((o,i)=>{
                  const isPicked = quizChoice === i;
                  const reveal = quizChoice !== null;
                  const isRight = i === QUIZ[quizIdx].answer;
                  return (
                    <button key={i}
                      disabled={reveal}
                      onClick={()=>{
                        setQuizChoice(i);
                        if (i === QUIZ[quizIdx].answer) setQuizScore(s=>s+1);
                      }}
                      style={{
                        ...infStyles.quizOpt,
                        borderColor: reveal && isRight ? '#22c55e' : reveal && isPicked ? '#dc2626' : 'rgba(255,255,255,0.18)',
                        background: reveal && isRight ? 'rgba(34,197,94,0.18)' : reveal && isPicked ? 'rgba(220,38,38,0.18)' : 'rgba(255,255,255,0.04)',
                      }}>
                      <span style={infStyles.quizOptLetter}>{String.fromCharCode(65+i)}</span>
                      <span>{o}</span>
                    </button>
                  );
                })}
              </div>
              {quizChoice !== null && (
                <React.Fragment>
                  <div style={infStyles.quizFact}>{QUIZ[quizIdx].fact}</div>
                  <button style={infStyles.quizNext} onClick={()=>{
                    if (quizIdx === QUIZ.length-1) setQuizDone(true);
                    else { setQuizIdx(i=>i+1); setQuizChoice(null); }
                  }}>{quizIdx === QUIZ.length-1 ? 'See result ›' : 'Next ›'}</button>
                </React.Fragment>
              )}
            </React.Fragment>
          ) : (
            <div style={infStyles.quizResult}>
              <div style={infStyles.quizScoreBig}>{quizScore}<span>/{QUIZ.length}</span></div>
              <div style={infStyles.quizVerdict}>
                {quizScore === 5 ? 'PITMASTER. Sit at the head of the grill.' :
                 quizScore >= 3 ? 'Solid. Hand you the tongs anytime.' :
                 'Plate up and listen to Collins. You will learn.'}
              </div>
              <button style={infStyles.quizRestart} onClick={()=>{ setQuizIdx(0); setQuizChoice(null); setQuizScore(0); setQuizDone(false); }}>Play again</button>
            </div>
          )}
        </div>
      </section>

      {/* ───────────────── SAUCE HEAT SLIDER ───────────────── */}
      <section style={{...infStyles.section, padding:'40px 22px 56px', background:'linear-gradient(180deg, #150806 0%, #0a0907 100%)'}}>
        <SectionHeader kicker="07" title="HOW HOT CAN YOU GO?" sub="Set your heat for the sauce battle. We'll have your level ready." />
        <div style={infStyles.heatBox}>
          <div style={{...infStyles.heatLabel, color:heatColor}}>{heatLabel}</div>
          <div style={infStyles.heatScale}>
            {[1,2,3,4,5].map(n=>(
              <div key={n} style={{
                ...infStyles.heatDot,
                background: n<=heat ? ['#facc15','#fb923c','#ef4444','#dc2626','#7f1d1d'][n-1] : 'rgba(255,255,255,0.1)',
                transform: n<=heat ? `scale(${1 + (n*0.06)})` : 'scale(1)',
              }}>🌶️</div>
            ))}
          </div>
          <input type="range" min="1" max="5" value={heat} onChange={e=>setHeat(+e.target.value)} style={infStyles.heatRange} />
          <div style={infStyles.heatHint}>
            {heat === 1 && 'Ketchup-tier. We respect it.'}
            {heat === 2 && 'Pepper-flake friendly.'}
            {heat === 3 && 'Sweat-on-the-brow, smile-on-the-face.'}
            {heat === 4 && 'One drop of akabanga. Brave.'}
            {heat === 5 && 'You will sign a waiver. We mean it.'}
          </div>
        </div>
      </section>

      {/* ───────────────── PRIZES ───────────────── */}
      <section style={{...infStyles.section, background:'#0f0805'}}>
        <SectionHeader kicker="08" title="PRIZES + AWARDS" sub="Small things, big bragging rights." />
        <div style={infStyles.prizeRow}>
          {PRIZES.map((p,i)=>(
            <div key={i} style={infStyles.prizeCard}>
              <div style={infStyles.prizeStar}>★</div>
              <div style={infStyles.prizeName}>{p.name}</div>
              <div style={infStyles.prizeDesc}>{p.desc}</div>
            </div>
          ))}
        </div>
        <div style={infStyles.rewardStrip}>
          <span style={infStyles.rewardK}>YOU WIN →</span>
          {PRIZE_REWARDS.map((r,i)=>(
            <span key={i} style={infStyles.rewardChip}>{r.name}</span>
          ))}
        </div>
      </section>

      {/* ───────────────── SCHEDULE ───────────────── */}
      <section style={{...infStyles.section, padding:'56px 22px 48px'}}>
        <SectionHeader kicker="09" title="RUN OF SHOW" sub="Loose plan. Real life happens." />
        <div style={infStyles.timeline}>
          {SCHEDULE.map((s,i)=>(
            <div key={i} style={infStyles.tlRow}>
              <div style={infStyles.tlTime}>{s.t}</div>
              <div style={infStyles.tlDot} />
              <div style={infStyles.tlBody}>
                <div style={infStyles.tlLabel}>{s.label}</div>
                <div style={infStyles.tlSub}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────── TESTIMONIALS ───────────────── */}
      <section style={{...infStyles.section, background:'#0a0907', padding:'56px 0 48px'}}>
        <div style={{padding:'0 22px'}}>
          <SectionHeader kicker="10" title="WHAT THE CREW SAID" sub="Texts from after edition one." />
        </div>
        <div style={infStyles.testiScroll}>
          {TESTIMONIALS.map((t,i)=>(
            <div key={i} style={infStyles.testiCard}>
              <div style={infStyles.testiQuote}>"{t.quote}"</div>
              <div style={infStyles.testiFooter}>
                <div style={infStyles.testiAvatar}>{t.name.split(' ').map(n=>n[0]).join('')}</div>
                <div>
                  <div style={infStyles.testiName}>{t.name}</div>
                  <div style={infStyles.testiHandle}>{t.handle}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────── RSVP / PAYMENT ───────────────── */}
      <section id="inf-rsvp" style={{...infStyles.section, padding:'56px 22px 56px', background:'linear-gradient(180deg, #0a0907 0%, #1a0a05 100%)'}}>
        <SectionHeader kicker="11" title="RSVP &amp; PAY" sub="Secure your plate. Card or Mobile Money, all via Flutterwave." />
        <div style={infStyles.tierStack}>
          {TIERS.map(t=>{
            const active = selectedTier === t.id;
            return (
              <button key={t.id} onClick={()=>setSelectedTier(t.id)} style={{
                ...infStyles.tierCard,
                borderColor: active ? '#f97316' : 'rgba(255,255,255,0.12)',
                background: active ? 'linear-gradient(135deg, #2a0f06, #1a0905)' : '#0e0a08',
              }}>
                <div style={infStyles.tierTop}>
                  <span style={infStyles.tierName}>{t.name}</span>
                  {t.badge && <span style={infStyles.tierBadge}>{t.badge}</span>}
                </div>
                <div style={infStyles.tierPrice}>{t.price.toLocaleString()} <em>RWF</em></div>
                <div style={infStyles.tierSub}>{t.sub}</div>
                <div style={infStyles.tierStock}>
                  {typeof t.stock === 'number' ? `${t.stock} spots left` : 'Availability at gate'}
                </div>
                {active && <div style={infStyles.tierCheck}>✓</div>}
              </button>
            );
          })}
        </div>

        {/* qty + total */}
        {tier.id !== 'duo' && (
          <div style={infStyles.qtyRow}>
            <span>Quantity</span>
            <div style={infStyles.qtyControls}>
              <button onClick={()=>setQty(q=>Math.max(1,q-1))} style={infStyles.qtyBtn}>−</button>
              <span style={infStyles.qtyNum}>{qty}</span>
              <button onClick={()=>setQty(q=>Math.min(8,q+1))} style={infStyles.qtyBtn}>+</button>
            </div>
          </div>
        )}
        <div style={infStyles.totalRow}>
          <span style={infStyles.totalK}>TOTAL</span>
          <span style={infStyles.totalV}>{total.toLocaleString()} <em>RWF</em></span>
        </div>
        <button style={infStyles.payBtn} onClick={()=>setCheckoutOpen(true)}>
          PAY WITH FLUTTERWAVE →
        </button>
        <div style={infStyles.payTrust}>
          <span>🔒 Secure checkout</span><span>·</span><span>VISA</span><span>·</span><span>MTN</span><span>·</span><span>Airtel</span>
        </div>
      </section>

      {/* ───────────────── LOCATION ───────────────── */}
      <section style={{...infStyles.section, padding:'56px 22px 40px'}}>
        <SectionHeader kicker="12" title="HOW TO GET THERE" sub="Pine forest above the city. Bring a light layer." />
        <div style={infStyles.mapCard}>
          <div style={infStyles.mapImg}>
            <svg viewBox="0 0 300 180" preserveAspectRatio="none" style={{width:'100%',height:'100%'}}>
              <rect width="300" height="180" fill="#1a1a16" />
              <g stroke="#3a2f1f" strokeWidth="1.5" fill="none">
                <path d="M0 60 Q 80 50 150 80 T 300 90" />
                <path d="M0 120 Q 100 100 180 140 T 300 130" />
                <path d="M40 0 L 60 180" />
                <path d="M210 0 L 230 180" />
              </g>
              {/* trees */}
              {Array.from({length:30}).map((_,i)=>(
                <circle key={i} cx={(i*23)%300} cy={(i*47)%180} r={2+(i%3)} fill="#2d4a2d" opacity="0.6" />
              ))}
              {/* pin */}
              <g transform="translate(150,90)">
                <circle r="22" fill="#f97316" opacity="0.25">
                  <animate attributeName="r" values="18;30;18" dur="2.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0;0.4" dur="2.4s" repeatCount="indefinite" />
                </circle>
                <circle r="9" fill="#f97316" stroke="#fff" strokeWidth="2" />
                <path d="M0 9 L 0 22" stroke="#f97316" strokeWidth="3" />
              </g>
            </svg>
          </div>
          <div style={infStyles.mapMeta}>
            <div style={infStyles.mapName}>📍 {EVENT.location}</div>
            <div style={infStyles.mapAddr}>{EVENT.city}</div>
            <a href={EVENT.mapsUrl} style={infStyles.mapLink}>Open in Maps ↗</a>
          </div>
        </div>
      </section>

      {/* ───────────────── HOSTS ───────────────── */}
      <section style={{...infStyles.section, padding:'40px 22px 40px', background:'#0a0907'}}>
        <SectionHeader kicker="13" title="WHO'S COOKING" sub="The crew behind the fire." />
        <div style={infStyles.hostsRow}>
          {HOSTS.map((h,i)=>(
            <div key={i} style={infStyles.hostCard}>
              <div style={{...infStyles.hostAvatar, backgroundImage:`url(${['photos/p03-grill-smile.jpeg','photos/p13-peace.jpeg','photos/p11-chef-bandana.jpeg'][i]})`}} />
              <div style={infStyles.hostName}>{h.name}</div>
              <div style={infStyles.hostRole}>{h.role}</div>
              <div style={infStyles.hostTag}>"{h.tag}"</div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────── FAQ ───────────────── */}
      <section style={{...infStyles.section, padding:'40px 22px 48px'}}>
        <SectionHeader kicker="14" title="FREQUENTLY ASKED" sub="Stuff people text us about." />
        <div style={infStyles.faqList}>
          {FAQ.map((f,i)=>(
            <button key={i} onClick={()=>setOpenFaq(openFaq===i?-1:i)} style={infStyles.faqItem}>
              <div style={infStyles.faqRow}>
                <span style={infStyles.faqQ}>{f.q}</span>
                <span style={{...infStyles.faqPlus, transform: openFaq===i ? 'rotate(45deg)' : 'rotate(0)'}}>+</span>
              </div>
              {openFaq===i && <div style={infStyles.faqA}>{f.a}</div>}
            </button>
          ))}
        </div>
      </section>

      {/* ───────────────── SPONSORS ───────────────── */}
      <section style={{...infStyles.section, padding:'32px 22px 32px', background:'#0a0907'}}>
        <div style={infStyles.sponsorK}>POWERED BY</div>
        <div style={infStyles.sponsorRow}>
          {SPONSORS.map((s,i)=>(
            <div key={i} style={infStyles.sponsorItem}>
              <div style={infStyles.sponsorName}>{s.name}</div>
              <div style={infStyles.sponsorKind}>{s.kind}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────── FOOTER ───────────────── */}
      <footer style={infStyles.footer}>
        <div style={infStyles.footerLogo}>FIRE &amp; SMOKE</div>
        <div style={infStyles.footerSub}>{EVENT.tagline}</div>
        <div style={infStyles.footerLinks}>
          <a>Instagram</a><span>·</span><a>WhatsApp</a><span>·</span><a>Email</a>
        </div>
        <div style={infStyles.footerLegal}>© 2026 Fire &amp; Smoke. Made with smoke in Kigali.</div>
      </footer>

      {/* ───────────────── CHECKOUT MODAL ───────────────── */}
      {checkoutOpen && (
        <FlutterwaveModal
          tier={tier} qty={qty} total={total}
          onClose={()=>setCheckoutOpen(false)}
          accent="#f97316"
        />
      )}
    </div>
  );
}

// Section header used throughout INFERNO
function SectionHeader({ kicker, title, sub }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontFamily:'Special Elite, monospace', fontSize:11, letterSpacing:3, color:'#f97316', marginBottom:6 }}>
        / {kicker} —
      </div>
      <h2 style={{ fontFamily:'Anton, sans-serif', fontSize:38, lineHeight:0.92, color:'#fffaf0', margin:0, letterSpacing:'-0.01em' }}>
        {title}
      </h2>
      {sub && <div style={{ fontFamily:'Barlow Condensed, sans-serif', fontSize:16, color:'#a8a29e', marginTop:8, lineHeight:1.4 }}>{sub}</div>}
    </div>
  );
}

function Icon({ name, size = 28, color = '#fff7ed' }) {
  const props = { width:size, height:size, viewBox:'0 0 24 24', fill:'none', stroke:color, strokeWidth:1.8, strokeLinecap:'round', strokeLinejoin:'round' };
  switch (name) {
    case 'meat':   return <svg {...props}><path d="M5 14c-2-2-2-6 1-8s8-2 10 0 3 7-1 9-9 1-10-1Z" /><circle cx="14" cy="11" r="2.2" /></svg>;
    case 'music':  return <svg {...props}><path d="M9 18V6l12-2v12" /><circle cx="7" cy="18" r="2.6" /><circle cx="19" cy="16" r="2.6" /></svg>;
    case 'games':  return <svg {...props}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8" cy="8" r="1.5" /><circle cx="16" cy="8" r="1.5" /><circle cx="8" cy="16" r="1.5" /><circle cx="16" cy="16" r="1.5" /></svg>;
    case 'sauce':  return <svg {...props}><path d="M12 3c-1 3-4 4-4 8a4 4 0 1 0 8 0c0-4-3-5-4-8Z" /></svg>;
    case 'camera': return <svg {...props}><path d="M4 8h3l2-3h6l2 3h3v11H4Z" /><circle cx="12" cy="13" r="3.6" /></svg>;
    default: return null;
  }
}

// Flutterwave-styled checkout modal (mocked, but realistic flow)
function FlutterwaveModal({ tier, qty, total, onClose, accent = '#f97316' }) {
  const [step, setStep] = React.useState(1);
  const [form, setForm] = React.useState({ name:'', email:'', phone:'', method:'card' });
  const [card, setCard] = React.useState({ num:'', exp:'', cvv:'' });
  const [success, setSuccess] = React.useState(false);
  const txRef = React.useMemo(()=>'FNS-' + Math.random().toString(36).slice(2,8).toUpperCase(), []);

  const canStep1 = form.name && form.email && form.phone;
  const canPay = form.method === 'card' ? (card.num.length >= 16 && card.exp && card.cvv) : form.phone;

  function pay() {
    setStep(3);
    setTimeout(()=>setSuccess(true), 1800);
  }

  return (
    <div style={modalStyles.scrim} onClick={onClose}>
      <div style={modalStyles.sheet} onClick={e=>e.stopPropagation()}>
        <div style={modalStyles.fwHeader}>
          <div style={modalStyles.fwBrand}>
            <div style={modalStyles.fwLogo}>flutterwave</div>
            <div style={modalStyles.fwSecure}>🔒 Secure</div>
          </div>
          <button onClick={onClose} style={modalStyles.fwClose}>×</button>
        </div>

        <div style={modalStyles.fwMerchant}>
          <div style={modalStyles.fwMerchName}>Fire &amp; Smoke · BBQ Games Edition</div>
          <div style={modalStyles.fwMerchSub}>{tier.name}{tier.id!=='duo' ? ` × ${qty}` : ''}</div>
          <div style={modalStyles.fwAmount}>
            <span style={modalStyles.fwAmountK}>RWF</span>
            <span style={modalStyles.fwAmountV}>{total.toLocaleString()}</span>
          </div>
        </div>

        {!success && step === 1 && (
          <div style={modalStyles.fwBody}>
            <Field label="Full name" v={form.name} onChange={v=>setForm({...form,name:v})} ph="Collins Muoki" />
            <Field label="Email" v={form.email} onChange={v=>setForm({...form,email:v})} ph="you@email.com" />
            <Field label="Phone" v={form.phone} onChange={v=>setForm({...form,phone:v})} ph="+250 78 …" />
            <button disabled={!canStep1} style={{...modalStyles.fwCta, background: canStep1 ? accent : '#3a3a3a'}} onClick={()=>setStep(2)}>
              Continue →
            </button>
            <div style={modalStyles.fwLegal}>By continuing you accept the event terms &amp; refund policy.</div>
          </div>
        )}

        {!success && step === 2 && (
          <div style={modalStyles.fwBody}>
            <div style={modalStyles.methodRow}>
              {[
                { id:'card', label:'Card', sub:'Visa · Mastercard' },
                { id:'momo', label:'Mobile Money', sub:'MTN · Airtel' },
              ].map(m=>(
                <button key={m.id} onClick={()=>setForm({...form,method:m.id})} style={{
                  ...modalStyles.methodCard,
                  borderColor: form.method===m.id ? accent : 'rgba(255,255,255,0.12)',
                  background: form.method===m.id ? 'rgba(249,115,22,0.08)' : '#171513',
                }}>
                  <div style={modalStyles.methodLabel}>{m.label}</div>
                  <div style={modalStyles.methodSub}>{m.sub}</div>
                </button>
              ))}
            </div>
            {form.method === 'card' ? (
              <React.Fragment>
                <Field label="Card number" v={card.num} onChange={v=>setCard({...card,num:v.replace(/[^0-9 ]/g,'').slice(0,19)})} ph="4242 4242 4242 4242" />
                <div style={{display:'flex',gap:10}}>
                  <Field label="MM/YY" v={card.exp} onChange={v=>setCard({...card,exp:v.slice(0,5)})} ph="08/27" />
                  <Field label="CVV" v={card.cvv} onChange={v=>setCard({...card,cvv:v.replace(/[^0-9]/g,'').slice(0,3)})} ph="123" />
                </div>
              </React.Fragment>
            ) : (
              <div style={modalStyles.momoBox}>
                <div style={modalStyles.momoTitle}>MTN MoMo / Airtel Money</div>
                <div style={modalStyles.momoSub}>We'll send a prompt to <strong>{form.phone}</strong>. Approve it on your phone.</div>
              </div>
            )}
            <button disabled={!canPay} style={{...modalStyles.fwCta, background: canPay ? accent : '#3a3a3a'}} onClick={pay}>
              Pay RWF {total.toLocaleString()}
            </button>
            <button style={modalStyles.fwBack} onClick={()=>setStep(1)}>← Back</button>
          </div>
        )}

        {step === 3 && !success && (
          <div style={modalStyles.fwLoading}>
            <div style={modalStyles.spinner} />
            <div style={modalStyles.loadingT}>Processing payment…</div>
            <div style={modalStyles.loadingS}>Do not close this window</div>
          </div>
        )}

        {success && (
          <div style={modalStyles.fwSuccess}>
            <div style={modalStyles.tickWrap}><div style={modalStyles.tick}>✓</div></div>
            <div style={modalStyles.successT}>Payment confirmed</div>
            <div style={modalStyles.successS}>Ref · {txRef}</div>
            <div style={modalStyles.successCard}>
              <div><span>Event</span><strong>Fire &amp; Smoke · 30 May 2026</strong></div>
              <div><span>Ticket</span><strong>{tier.name}{tier.id!=='duo' ? ` × ${qty}` : ''}</strong></div>
              <div><span>Total</span><strong>RWF {total.toLocaleString()}</strong></div>
            </div>
            <div style={modalStyles.successHint}>A QR pass has been emailed to {form.email}. See you in the forest. 🔥</div>
            <button style={{...modalStyles.fwCta, background:accent}} onClick={onClose}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, v, onChange, ph }) {
  return (
    <label style={modalStyles.field}>
      <span style={modalStyles.fieldLabel}>{label}</span>
      <input value={v} onChange={e=>onChange(e.target.value)} placeholder={ph} style={modalStyles.fieldInput} />
    </label>
  );
}

window.InfernoSite = InfernoSite;
window.FlutterwaveModal = FlutterwaveModal;
window.SectionHeader = SectionHeader;
window.IconFS = Icon;
window.Field = Field;

// ─────────────────── INFERNO styles ───────────────────
const infStyles = {
  page: {
    width: '100%', height: '100%', overflowY: 'auto', overflowX: 'hidden',
    background:'#0a0907', color:'#fff7ed',
    fontFamily:'Barlow Condensed, sans-serif',
    WebkitFontSmoothing:'antialiased',
  },
  hero: {
    position:'relative', padding:'18px 22px 28px', overflow:'hidden',
    background:'radial-gradient(ellipse at 50% 110%, #6b1e0d 0%, #2b0a05 40%, #0a0504 80%)',
    minHeight: 760,
  },
  heroGlow: { position:'absolute', left:0, right:0, bottom:0, height:240,
    background:'radial-gradient(ellipse at 50% 100%, rgba(249,115,22,0.55), transparent 70%)', pointerEvents:'none' },
  nav: { position:'relative', display:'flex', justifyContent:'space-between', zIndex:2 },
  alertSticker: { position:'relative', display:'inline-block', background:'#fde047', color:'#111',
    padding:'6px 12px', transform:'rotate(-3deg)', marginTop:18, marginBottom:18, zIndex:2,
    boxShadow:'3px 3px 0 #000' },
  heroTitleWrap: { position:'relative', zIndex:2 },
  tagline: { fontFamily:'Special Elite, monospace', fontSize:12, letterSpacing:3, color:'#fcd34d', marginBottom:10 },
  h1: { margin:0, lineHeight:0.82, fontFamily:'Anton, sans-serif', textTransform:'uppercase' },
  fireRow: { display:'block', fontSize:96, color:'#f97316',
    textShadow:'0 0 22px rgba(249,115,22,0.65), 4px 4px 0 #200a04',
    letterSpacing:'-0.04em', WebkitTextStroke:'1px #ffedd5' },
  amp: { display:'block', fontSize:32, color:'#fde047', margin:'2px 0', fontFamily:'Permanent Marker, cursive', transform:'rotate(-4deg)' },
  smokeRow: { display:'block', fontSize:96, color:'#fffaf0',
    textShadow:'0 0 16px rgba(255,255,255,0.15), 4px 4px 0 #000',
    letterSpacing:'-0.04em' },
  returns: { display:'flex', alignItems:'center', gap:10, marginTop:14, position:'relative', zIndex:2 },
  editionPill: { fontFamily:'Anton, sans-serif', fontStyle:'normal', fontSize:14, letterSpacing:1.5,
    background:'#f97316', color:'#0a0907', padding:'5px 10px', transform:'skewX(-10deg)', display:'inline-block' },
  dateStrip: { display:'flex', alignItems:'center', gap:14, marginTop:24, padding:'12px 14px',
    background:'rgba(0,0,0,0.5)', border:'1px solid rgba(255,237,213,0.18)', position:'relative', zIndex:2 },
  dateItem: { flex:1 },
  dateK: { fontFamily:'Special Elite, monospace', fontSize:10, letterSpacing:2, color:'#fcd34d' },
  dateV: { fontFamily:'Anton, sans-serif', fontSize:22, color:'#fffaf0', marginTop:2 },
  dateDivider: { width:1, height:36, background:'rgba(255,237,213,0.2)' },
  cdBox: { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginTop:18, position:'relative', zIndex:2 },
  cdCell: { background:'#000', border:'1px solid rgba(249,115,22,0.4)', padding:'10px 0', textAlign:'center' },
  cdNum: { fontFamily:'Anton, sans-serif', fontSize:28, color:'#f97316', lineHeight:1 },
  cdK: { fontFamily:'Special Elite, monospace', fontSize:9, letterSpacing:2, color:'#a8a29e', marginTop:4 },
  heroCTA: { display:'block', width:'100%', marginTop:22, padding:'18px 0',
    background:'linear-gradient(180deg, #fde047, #f97316)', color:'#1a0a05',
    fontFamily:'Anton, sans-serif', fontSize:22, letterSpacing:1.5, border:'none',
    boxShadow:'0 6px 0 #7c2d12, 0 12px 30px rgba(249,115,22,0.4)', cursor:'pointer', position:'relative', zIndex:2 },
  heroSub: { textAlign:'center', marginTop:10, fontFamily:'Special Elite, monospace', fontSize:11, color:'#fcd34d', letterSpacing:1.5 },

  section: { padding:'56px 22px 48px', position:'relative' },

  newGrid: { display:'flex', flexDirection:'column', gap:16, marginTop:10 },
  newCard: { position:'relative', padding:'18px 16px 16px', background:'#fffaf0', color:'#1a0a05',
    boxShadow:'4px 4px 0 #000', border:'1.5px solid #000' },
  newIcon: { width:42, height:42, borderRadius:'50%', background:'#f97316', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:10 },
  newTitle: { fontFamily:'Anton, sans-serif', fontSize:24, letterSpacing:0.5 },
  newSub: { fontFamily:'Barlow Condensed, sans-serif', fontSize:14, color:'#3a2f1f', marginTop:4, lineHeight:1.35 },
  newTape: { position:'absolute', top:-10, right:14, background:'#dc2626', color:'#fff',
    fontFamily:'Anton, sans-serif', fontSize:13, padding:'3px 10px', transform:'rotate(6deg)', letterSpacing:1 },

  carouselWrap: { marginTop:24, paddingBottom:6 },
  carouselTrack: { display:'flex', gap:18, transition:'transform 0.4s ease', padding:'30px 0' },
  polaroid: { flex:'0 0 220px', background:'#fffaf0', padding:10, paddingBottom:34,
    boxShadow:'0 12px 30px rgba(0,0,0,0.5)', cursor:'pointer', transition:'transform 0.3s, outline 0.2s', position:'relative' },
  polaroidImg: { width:200, height:200, backgroundSize:'cover', backgroundPosition:'center', filter:'contrast(1.05) saturate(0.9)' },
  polaroidCap: { fontFamily:'Permanent Marker, cursive', fontSize:14, color:'#1a0a05', textAlign:'center', marginTop:10 },
  carouselDots: { display:'flex', justifyContent:'center', gap:6, marginTop:6 },
  dot: { height:6, borderRadius:3, transition:'all 0.3s', border:'none', cursor:'pointer' },

  gamesGrid: { display:'flex', flexWrap:'wrap', gap:8, marginTop:8 },
  gameChip: { display:'flex', alignItems:'center', gap:8, padding:'10px 14px',
    background:'#1a1410', border:'1px solid rgba(249,115,22,0.3)' },
  gameDot: { width:8, height:8, background:'#f97316', borderRadius:'50%' },
  gameName: { fontFamily:'Anton, sans-serif', fontSize:16, color:'#fffaf0', letterSpacing:0.5 },
  gameTag: { fontFamily:'Special Elite, monospace', fontSize:10, color:'#a8a29e', letterSpacing:1.5 },

  quizBox: { marginTop:18, padding:20, background:'#1a1410', border:'1px solid rgba(249,115,22,0.25)' },
  quizMeta: { display:'flex', justifyContent:'space-between', fontFamily:'Special Elite, monospace', fontSize:11, letterSpacing:2, color:'#fcd34d', marginBottom:10 },
  quizQ: { fontFamily:'Anton, sans-serif', fontSize:22, lineHeight:1.15, color:'#fffaf0' },
  quizOpts: { display:'flex', flexDirection:'column', gap:10, marginTop:16 },
  quizOpt: { display:'flex', alignItems:'center', gap:12, padding:'14px 14px', border:'1.5px solid', borderRadius:0,
    color:'#fffaf0', textAlign:'left', fontFamily:'Barlow Condensed, sans-serif', fontSize:16, cursor:'pointer', transition:'all 0.2s' },
  quizOptLetter: { display:'inline-flex', alignItems:'center', justifyContent:'center', width:28, height:28,
    border:'1.5px solid currentColor', fontFamily:'Anton, sans-serif', fontSize:14 },
  quizFact: { marginTop:14, padding:'12px 14px', background:'rgba(252,211,77,0.08)',
    fontFamily:'Special Elite, monospace', fontSize:12, color:'#fcd34d', lineHeight:1.5, letterSpacing:0.5 },
  quizNext: { marginTop:14, width:'100%', padding:'14px 0', background:'#f97316', color:'#1a0a05',
    border:'none', fontFamily:'Anton, sans-serif', fontSize:18, letterSpacing:1.5, cursor:'pointer' },
  quizResult: { textAlign:'center', padding:20 },
  quizScoreBig: { fontFamily:'Anton, sans-serif', fontSize:72, color:'#f97316', lineHeight:1 },
  quizScoreSpan: { color:'#a8a29e', fontSize:32 },
  quizVerdict: { fontFamily:'Anton, sans-serif', fontSize:22, color:'#fffaf0', marginTop:8, lineHeight:1.2 },
  quizRestart: { marginTop:18, padding:'10px 24px', background:'transparent', color:'#fcd34d',
    border:'1.5px solid #fcd34d', fontFamily:'Anton, sans-serif', fontSize:14, letterSpacing:1.5, cursor:'pointer' },

  heatBox: { marginTop:18, padding:'28px 20px', background:'#1a1410', border:'1px solid rgba(249,115,22,0.25)', textAlign:'center' },
  heatLabel: { fontFamily:'Anton, sans-serif', fontSize:48, letterSpacing:1, lineHeight:1 },
  heatScale: { display:'flex', justifyContent:'center', gap:14, marginTop:20, alignItems:'center' },
  heatDot: { width:36, height:36, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
    fontSize:14, transition:'all 0.3s' },
  heatRange: { width:'100%', marginTop:20, accentColor:'#f97316' },
  heatHint: { marginTop:12, fontFamily:'Special Elite, monospace', fontSize:13, color:'#fcd34d', letterSpacing:0.5 },

  prizeRow: { display:'flex', flexDirection:'column', gap:14, marginTop:8 },
  prizeCard: { padding:'18px 16px', background:'linear-gradient(135deg, #2a1408 0%, #1a0905 100%)',
    border:'1.5px solid rgba(249,115,22,0.3)', position:'relative' },
  prizeStar: { position:'absolute', top:-12, right:14, fontSize:28, color:'#fde047' },
  prizeName: { fontFamily:'Anton, sans-serif', fontSize:24, color:'#fffaf0' },
  prizeDesc: { fontFamily:'Barlow Condensed, sans-serif', fontSize:14, color:'#a8a29e', marginTop:4 },
  rewardStrip: { display:'flex', alignItems:'center', gap:10, flexWrap:'wrap', marginTop:18,
    padding:'12px 14px', background:'rgba(252,211,77,0.08)', border:'1px dashed rgba(252,211,77,0.4)' },
  rewardK: { fontFamily:'Special Elite, monospace', fontSize:11, letterSpacing:2, color:'#fcd34d' },
  rewardChip: { fontFamily:'Anton, sans-serif', fontSize:13, padding:'3px 8px', background:'#fcd34d', color:'#1a0a05', letterSpacing:0.5 },

  timeline: { marginTop:18 },
  tlRow: { display:'flex', alignItems:'flex-start', gap:14, padding:'14px 0', borderBottom:'1px dashed rgba(255,237,213,0.1)' },
  tlTime: { fontFamily:'Anton, sans-serif', fontSize:22, color:'#f97316', width:60, flexShrink:0 },
  tlDot: { width:10, height:10, borderRadius:'50%', background:'#fde047', marginTop:9, flexShrink:0,
    boxShadow:'0 0 0 4px rgba(253,224,71,0.15)' },
  tlBody: { flex:1 },
  tlLabel: { fontFamily:'Anton, sans-serif', fontSize:18, color:'#fffaf0', letterSpacing:0.5 },
  tlSub: { fontFamily:'Barlow Condensed, sans-serif', fontSize:14, color:'#a8a29e', marginTop:2 },

  testiScroll: { display:'flex', gap:14, overflowX:'auto', padding:'18px 22px 8px', scrollSnapType:'x mandatory' },
  testiCard: { flex:'0 0 280px', padding:'20px 18px', background:'#1a1410', border:'1.5px solid rgba(249,115,22,0.25)',
    scrollSnapAlign:'start' },
  testiQuote: { fontFamily:'Special Elite, monospace', fontSize:14, color:'#fffaf0', lineHeight:1.55 },
  testiFooter: { display:'flex', alignItems:'center', gap:10, marginTop:14 },
  testiAvatar: { width:34, height:34, borderRadius:'50%', background:'#f97316', color:'#1a0a05',
    display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Anton, sans-serif', fontSize:13 },
  testiName: { fontFamily:'Anton, sans-serif', fontSize:14, color:'#fffaf0', letterSpacing:0.5 },
  testiHandle: { fontFamily:'Special Elite, monospace', fontSize:10, color:'#fcd34d', letterSpacing:1 },

  tierStack: { display:'flex', flexDirection:'column', gap:12, marginTop:18 },
  tierCard: { position:'relative', padding:'16px 18px', textAlign:'left', cursor:'pointer',
    border:'1.5px solid', borderRadius:0, color:'#fffaf0', transition:'all 0.2s' },
  tierTop: { display:'flex', justifyContent:'space-between', alignItems:'center' },
  tierName: { fontFamily:'Anton, sans-serif', fontSize:20, letterSpacing:0.5 },
  tierBadge: { fontFamily:'Anton, sans-serif', fontSize:11, background:'#dc2626', color:'#fff', padding:'2px 8px', letterSpacing:1 },
  tierPrice: { fontFamily:'Anton, sans-serif', fontSize:34, color:'#f97316', marginTop:4 },
  tierSub: { fontFamily:'Barlow Condensed, sans-serif', fontSize:13, color:'#a8a29e' },
  tierStock: { fontFamily:'Special Elite, monospace', fontSize:10, color:'#fcd34d', marginTop:6, letterSpacing:1 },
  tierCheck: { position:'absolute', top:14, right:14, width:24, height:24, borderRadius:'50%',
    background:'#f97316', color:'#1a0a05', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Anton, sans-serif' },

  qtyRow: { display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:18,
    fontFamily:'Anton, sans-serif', fontSize:18, color:'#fffaf0' },
  qtyControls: { display:'flex', alignItems:'center', gap:14 },
  qtyBtn: { width:36, height:36, background:'#1a1410', color:'#f97316', border:'1.5px solid rgba(249,115,22,0.4)',
    fontFamily:'Anton, sans-serif', fontSize:20, cursor:'pointer' },
  qtyNum: { fontFamily:'Anton, sans-serif', fontSize:22, color:'#fffaf0', minWidth:24, textAlign:'center' },

  totalRow: { display:'flex', justifyContent:'space-between', alignItems:'baseline', marginTop:18,
    padding:'14px 16px', background:'#000', border:'1.5px solid rgba(249,115,22,0.4)' },
  totalK: { fontFamily:'Special Elite, monospace', fontSize:12, letterSpacing:3, color:'#fcd34d' },
  totalV: { fontFamily:'Anton, sans-serif', fontSize:34, color:'#f97316' },

  payBtn: { display:'block', width:'100%', marginTop:14, padding:'18px 0',
    background:'linear-gradient(180deg, #f97316, #dc2626)', color:'#fffaf0',
    fontFamily:'Anton, sans-serif', fontSize:20, letterSpacing:1.5, border:'none',
    boxShadow:'0 6px 0 #7c2d12', cursor:'pointer' },
  payTrust: { display:'flex', gap:8, justifyContent:'center', marginTop:14,
    fontFamily:'Special Elite, monospace', fontSize:10, color:'#a8a29e', letterSpacing:1 },

  mapCard: { marginTop:18, border:'1.5px solid rgba(249,115,22,0.3)' },
  mapImg: { height:180, background:'#1a1a16', position:'relative' },
  mapMeta: { padding:'14px 16px', background:'#1a1410' },
  mapName: { fontFamily:'Anton, sans-serif', fontSize:18, color:'#fffaf0', letterSpacing:0.5 },
  mapAddr: { fontFamily:'Barlow Condensed, sans-serif', fontSize:14, color:'#a8a29e', marginTop:2 },
  mapLink: { display:'inline-block', marginTop:10, fontFamily:'Anton, sans-serif', fontSize:13,
    color:'#f97316', letterSpacing:1.5, textDecoration:'underline' },

  hostsRow: { display:'flex', flexDirection:'column', gap:14, marginTop:18 },
  hostCard: { display:'flex', alignItems:'center', gap:14, padding:'12px 14px', background:'#1a1410', border:'1px solid rgba(249,115,22,0.2)' },
  hostAvatar: { width:64, height:64, borderRadius:'50%', backgroundSize:'cover', backgroundPosition:'center', flexShrink:0, border:'2px solid #f97316' },
  hostName: { fontFamily:'Anton, sans-serif', fontSize:18, color:'#fffaf0' },
  hostRole: { fontFamily:'Barlow Condensed, sans-serif', fontSize:13, color:'#fcd34d' },
  hostTag: { fontFamily:'Special Elite, monospace', fontSize:11, color:'#a8a29e', marginTop:2 },

  faqList: { display:'flex', flexDirection:'column', gap:10, marginTop:18 },
  faqItem: { background:'#1a1410', border:'1px solid rgba(249,115,22,0.2)', padding:'14px 16px',
    color:'#fffaf0', textAlign:'left', cursor:'pointer', fontFamily:'inherit' },
  faqRow: { display:'flex', justifyContent:'space-between', alignItems:'center', gap:10 },
  faqQ: { fontFamily:'Anton, sans-serif', fontSize:16, letterSpacing:0.5, flex:1 },
  faqPlus: { fontFamily:'Anton, sans-serif', fontSize:24, color:'#f97316', transition:'transform 0.25s' },
  faqA: { marginTop:10, fontFamily:'Barlow Condensed, sans-serif', fontSize:15, color:'#d4cab9', lineHeight:1.5 },

  sponsorK: { fontFamily:'Special Elite, monospace', fontSize:11, letterSpacing:3, color:'#fcd34d', textAlign:'center', marginBottom:14 },
  sponsorRow: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 },
  sponsorItem: { padding:'12px 12px', background:'#1a1410', border:'1px solid rgba(255,237,213,0.1)', textAlign:'center' },
  sponsorName: { fontFamily:'Anton, sans-serif', fontSize:15, color:'#fffaf0' },
  sponsorKind: { fontFamily:'Special Elite, monospace', fontSize:10, color:'#a8a29e', marginTop:2, letterSpacing:1 },

  footer: { padding:'40px 22px 32px', textAlign:'center', borderTop:'1px solid rgba(249,115,22,0.2)' },
  footerLogo: { fontFamily:'Anton, sans-serif', fontSize:32, color:'#f97316', letterSpacing:0.5 },
  footerSub: { fontFamily:'Special Elite, monospace', fontSize:12, color:'#fcd34d', letterSpacing:2, marginTop:4 },
  footerLinks: { display:'flex', justifyContent:'center', gap:8, marginTop:18,
    fontFamily:'Anton, sans-serif', fontSize:13, color:'#fffaf0', letterSpacing:1 },
  footerLegal: { fontFamily:'Special Elite, monospace', fontSize:10, color:'#6b6259', marginTop:18, letterSpacing:1 },
};

infStyles.quizScoreBig = { ...infStyles.quizScoreBig };
// Special: inner span style is inline via CSS class in CSS string below

const modalStyles = {
  scrim: { position:'absolute', inset:0, background:'rgba(0,0,0,0.7)', display:'flex',
    alignItems:'flex-end', justifyContent:'center', zIndex:50, animation:'fwFade 0.2s ease' },
  sheet: { width:'100%', maxHeight:'92%', background:'#0e0c0a', borderRadius:'18px 18px 0 0',
    overflowY:'auto', animation:'fwSlide 0.25s ease-out', boxShadow:'0 -20px 60px rgba(0,0,0,0.7)' },
  fwHeader: { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 16px',
    borderBottom:'1px solid rgba(255,255,255,0.06)' },
  fwBrand: { display:'flex', alignItems:'center', gap:12 },
  fwLogo: { fontFamily:'Anton, sans-serif', fontSize:18, color:'#f97316', letterSpacing:1 },
  fwSecure: { fontFamily:'Special Elite, monospace', fontSize:10, color:'#a8a29e', letterSpacing:1 },
  fwClose: { background:'none', border:'none', color:'#a8a29e', fontSize:28, cursor:'pointer', padding:0, width:32, height:32, lineHeight:1 },
  fwMerchant: { padding:'20px 18px 18px', textAlign:'center', borderBottom:'1px solid rgba(255,255,255,0.06)' },
  fwMerchName: { fontFamily:'Anton, sans-serif', fontSize:18, color:'#fffaf0' },
  fwMerchSub: { fontFamily:'Barlow Condensed, sans-serif', fontSize:13, color:'#a8a29e', marginTop:4 },
  fwAmount: { display:'flex', justifyContent:'center', alignItems:'baseline', gap:6, marginTop:10 },
  fwAmountK: { fontFamily:'Special Elite, monospace', fontSize:14, color:'#fcd34d', letterSpacing:1.5 },
  fwAmountV: { fontFamily:'Anton, sans-serif', fontSize:42, color:'#f97316' },
  fwBody: { padding:'18px 18px 24px', display:'flex', flexDirection:'column', gap:12 },
  field: { display:'flex', flexDirection:'column', gap:4, flex:1 },
  fieldLabel: { fontFamily:'Special Elite, monospace', fontSize:10, letterSpacing:2, color:'#a8a29e' },
  fieldInput: { background:'#171513', border:'1px solid rgba(255,255,255,0.12)', color:'#fffaf0',
    padding:'12px 12px', fontFamily:'Barlow Condensed, sans-serif', fontSize:16, outline:'none', borderRadius:6 },
  fwCta: { padding:'14px 0', color:'#1a0a05', fontFamily:'Anton, sans-serif', fontSize:16, letterSpacing:1.5,
    border:'none', borderRadius:8, marginTop:6, cursor:'pointer' },
  fwBack: { background:'none', border:'none', color:'#a8a29e', fontFamily:'Special Elite, monospace',
    fontSize:12, letterSpacing:1.5, cursor:'pointer', marginTop:4 },
  fwLegal: { fontFamily:'Special Elite, monospace', fontSize:10, color:'#6b6259', letterSpacing:1, textAlign:'center' },

  methodRow: { display:'flex', gap:10 },
  methodCard: { flex:1, padding:'12px 12px', border:'1.5px solid', textAlign:'left', cursor:'pointer', borderRadius:8 },
  methodLabel: { fontFamily:'Anton, sans-serif', fontSize:15, color:'#fffaf0' },
  methodSub: { fontFamily:'Special Elite, monospace', fontSize:10, color:'#a8a29e', letterSpacing:1, marginTop:2 },

  momoBox: { padding:'18px 16px', background:'#171513', borderRadius:8, border:'1px dashed rgba(252,211,77,0.4)' },
  momoTitle: { fontFamily:'Anton, sans-serif', fontSize:16, color:'#fcd34d' },
  momoSub: { fontFamily:'Barlow Condensed, sans-serif', fontSize:14, color:'#a8a29e', marginTop:6, lineHeight:1.4 },

  fwLoading: { padding:'40px 20px', textAlign:'center' },
  spinner: { width:40, height:40, border:'3px solid rgba(249,115,22,0.2)', borderTopColor:'#f97316',
    borderRadius:'50%', margin:'0 auto', animation:'spin 0.9s linear infinite' },
  loadingT: { fontFamily:'Anton, sans-serif', fontSize:18, color:'#fffaf0', marginTop:16 },
  loadingS: { fontFamily:'Special Elite, monospace', fontSize:12, color:'#a8a29e', marginTop:4 },

  fwSuccess: { padding:'30px 20px', textAlign:'center' },
  tickWrap: { display:'flex', justifyContent:'center' },
  tick: { width:64, height:64, borderRadius:'50%', background:'#22c55e', color:'#fff',
    display:'flex', alignItems:'center', justifyContent:'center', fontSize:36, fontWeight:700 },
  successT: { fontFamily:'Anton, sans-serif', fontSize:24, color:'#fffaf0', marginTop:16 },
  successS: { fontFamily:'Special Elite, monospace', fontSize:12, color:'#fcd34d', marginTop:4, letterSpacing:1.5 },
  successCard: { marginTop:20, padding:'14px 16px', background:'#171513', borderRadius:8, textAlign:'left' },
  successHint: { fontFamily:'Barlow Condensed, sans-serif', fontSize:13, color:'#a8a29e', marginTop:16, lineHeight:1.5 },
};

// fix quizResult span styling
infStyles.quizScoreBig['& span'] = '';

const infCSS = `
  @keyframes fwFade { from { opacity: 0 } to { opacity: 1 } }
  @keyframes fwSlide { from { transform: translateY(40px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
  @keyframes spin { to { transform: rotate(360deg) } }
  .inf-noise { position:absolute; inset:0; pointer-events:none; opacity:0.18; mix-blend-mode:overlay;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' /></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/></svg>"); }
  div [data-fs-success] > div { display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid rgba(255,255,255,0.04); }
  div [data-fs-success] span { font-family: 'Special Elite', monospace; font-size:11px; color:#a8a29e; letter-spacing:1.5px; }
  div [data-fs-success] strong { font-family: 'Anton', sans-serif; font-size:13px; color:#fffaf0; font-weight:400; }
`;

modalStyles.successCard = { ...modalStyles.successCard };
// Add data attribute via React
const _origSuccessCard = modalStyles.successCard;
