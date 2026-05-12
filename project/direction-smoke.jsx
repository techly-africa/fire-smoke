// Direction 3: SMOKE STACK — Neon zine. Charcoal black canvas, electric magenta
// + safety-cone orange + acid yellow neons, monospace + heavy display, sticker
// rotations, marquee strips, tilted polaroid photos, dotted/torn dividers,
// rave-flyer energy.

function SmokeStackSite() {
  const { EVENT, TIERS, WHATS_NEW, GAMES, PRIZES, PRIZE_REWARDS, SCHEDULE,
    GALLERY, TESTIMONIALS, FAQ, HOSTS, SPONSORS, QUIZ,
    useCountdown } = window.FS;

  const cd = useCountdown(EVENT.dateISO);
  const [selectedTier, setSelectedTier] = React.useState('early');
  const [qty, setQty] = React.useState(1);
  const [checkoutOpen, setCheckoutOpen] = React.useState(false);
  const [heat, setHeat] = React.useState(3);
  const [carouselIdx, setCarouselIdx] = React.useState(0);
  const [openFaq, setOpenFaq] = React.useState(-1);
  const [quizIdx, setQuizIdx] = React.useState(0);
  const [quizChoice, setQuizChoice] = React.useState(null);
  const [quizScore, setQuizScore] = React.useState(0);
  const [quizDone, setQuizDone] = React.useState(false);

  const tier = TIERS.find((t) => t.id === selectedTier);
  const total = tier.id === 'duo' ? tier.price : tier.price * qty;
  const heatLabel = ['MILD', 'WARM', 'SPICY', 'HEAT', 'INFERNO'][heat - 1];
  const heatColor = ['#fde047', '#fb923c', '#f43f5e', '#dc2626', '#fbbf24'][heat - 1];

  return (
    <div style={ssStyles.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Bowlby+One&family=Space+Mono:wght@400;700&family=Archivo+Black&display=swap" rel="stylesheet" />
      <style>{ssCSS}</style>

      {/* TOP MARQUEE */}
      <div style={ssStyles.marquee}>
        <div style={ssStyles.marqueeInner} className="ss-marquee-anim">
          {Array.from({ length: 4 }).map((_, k) =>
          <span key={k} style={ssStyles.marqueeText}>
              ▲ FIRE &amp; SMOKE VOL.02 ▲ 30 MAY 2026 ▲ FAZENDA ZENGA ▲ DAYTIME GAMES EDITION ▲ DON'T COME ALONE ▲&nbsp;
            </span>
          )}
        </div>
      </div>

      {/* HERO */}
      <section style={ssStyles.hero}>
        <div style={ssStyles.heroGrid}>
          <div style={ssStyles.heroLeft}>
            <div style={ssStyles.heroBadgeRow}>
              <span style={ssStyles.heroBadge}>VOL · 02</span>
              <span style={ssStyles.heroBadge2}>BBQ × GAMES</span>
              <span style={ssStyles.heroBadge3}>DAYTIME</span>
            </div>
            <h1 style={ssStyles.heroH1}>
              <span style={ssStyles.heroLine1}>FIRE</span>
              <span style={ssStyles.heroAmp}>&amp;</span>
              <span style={{ ...ssStyles.heroLine2, fontSize: "93px" }}>SMOKE</span>
            </h1>
            <div style={ssStyles.heroBarcode}>||||  |||  ||||| ||  | ||||  || RWA-26-2</div>

            <div style={ssStyles.heroSticker1}>
              <div style={ssStyles.heroSticker1Inner}>
                <div style={ssStyles.heroSticker1Big}>30</div>
                <div style={ssStyles.heroSticker1Sm}>MAY</div>
                <div style={ssStyles.heroSticker1Year}>'26</div>
              </div>
            </div>

            <p style={ssStyles.heroPara}>
              Last edition we held it down for the CrossFit crew. This time it's switching up — different proteins, daytime music, a games corner, a sauce battle that will ruin you, and pine-forest photo moments from three.
            </p>

            <div style={ssStyles.heroMeta}>
              <div style={ssStyles.heroMetaRow}><span style={ssStyles.heroMetaK}>WHERE</span><span style={ssStyles.heroMetaV}>FAZENDA ZENGA · MT KIGALI</span></div>
              <div style={ssStyles.heroMetaRow}><span style={ssStyles.heroMetaK}>WHEN</span><span style={ssStyles.heroMetaV}>SAT 30 MAY · 2PM — 8PM</span></div>
              <div style={ssStyles.heroMetaRow}><span style={ssStyles.heroMetaK}>FROM</span><span style={ssStyles.heroMetaV}>15,000 RWF</span></div>
            </div>

            <button style={ssStyles.heroCta} onClick={() => setCheckoutOpen(true)}>
              <span style={ssStyles.heroCtaLabel}>RSVP &amp; PAY ↗</span>
            </button>
          </div>

          <div style={ssStyles.heroRight}>
            <div style={ssStyles.polaroid} className="ss-polaroid-1">
              <img src="photos/p13-peace.jpeg" alt="" style={ssStyles.polaroidImg} />
              <div style={ssStyles.polaroidCap}>VOL.01 ✌</div>
            </div>
            <div style={ssStyles.polaroid} className="ss-polaroid-2">
              <img src="photos/p11-chef-bandana.jpeg" alt="" style={ssStyles.polaroidImg} />
              <div style={ssStyles.polaroidCap}>THE PITMASTER</div>
            </div>
            <div style={ssStyles.polaroid} className="ss-polaroid-3">
              <img src="photos/p12-kamado.jpeg" alt="" style={ssStyles.polaroidImg} />
              <div style={ssStyles.polaroidCap}>KAMADO HOT</div>
            </div>
          </div>
        </div>

        {/* COUNTDOWN — punched ticket */}
        <div style={ssStyles.countdownStrip}>
          <div style={ssStyles.countdownLbl}>★ COUNTDOWN ★</div>
          <div style={ssStyles.countdownRow}>
            {[['D', cd.days], ['H', cd.hours], ['M', cd.mins], ['S', cd.secs]].map(([l, v]) =>
            <div key={l} style={ssStyles.countdownCell}>
                <div style={ssStyles.countdownVal}>{String(v).padStart(2, '0')}</div>
                <div style={ssStyles.countdownK}>{l}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* TORN DIVIDER */}
      <TornDivider color="#fde047" />

      {/* WHAT'S NEW */}
      <section style={{ ...ssStyles.section, background: '#fde047', color: '#0a0a0a' }}>
        <SS_H title="NEW THIS EDITION" sub="// switch_it_up.sh" color="#0a0a0a" />
        <div style={ssStyles.newGrid}>
          {WHATS_NEW.map((w, i) =>
          <div key={i} style={ssStyles.newTile}>
              <div style={ssStyles.newTileNum}>NEW/{String(i + 1).padStart(2, '0')}</div>
              <div style={ssStyles.newTileTitle}>{w.title}</div>
              <div style={ssStyles.newTileSub}>{w.sub}</div>
            </div>
          )}
        </div>
      </section>

      <TornDivider color="#0a0a0a" flip />

      {/* SCHEDULE */}
      <section style={ssStyles.section}>
        <SS_H title="RUN OF SHOW" sub="// what_happens_when()" />
        <div style={ssStyles.schedTrack}>
          {SCHEDULE.map((row, i) =>
          <div key={i} style={ssStyles.schedRow}>
              <div style={ssStyles.schedTime}>{row.t}</div>
              <div style={ssStyles.schedDot} />
              <div style={ssStyles.schedBody}>
                <div style={ssStyles.schedLabel}>{row.label}</div>
                <div style={ssStyles.schedSub}>{row.sub}</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* GAMES */}
      <section style={{ ...ssStyles.section, background: '#f43f5e', color: '#0a0a0a' }}>
        <SS_H title="GAMES ON SITE" sub="// pick_your_poison()" color="#0a0a0a" />
        <div style={ssStyles.gamesGrid}>
          {GAMES.map((g, i) =>
          <div key={g.name} style={{ ...ssStyles.gameTag, transform: `rotate(${(i % 2 ? 1 : -1) * (1 + i % 3)}deg)` }}>
              <div style={ssStyles.gameTagK}>{g.tag}</div>
              <div style={ssStyles.gameTagName}>{g.name}</div>
            </div>
          )}
        </div>
        <div style={ssStyles.gamesNote}>★ ANYONE WITH GAMES IS WELCOME TO BRING THEM ALONG ★</div>
      </section>

      {/* PRIZES */}
      <section style={ssStyles.section}>
        <SS_H title="WHAT YOU CAN WIN" sub="// reward.json" />
        <div style={ssStyles.prizeGrid}>
          {PRIZES.map((p, i) =>
          <div key={i} style={ssStyles.prizeCard}>
              <div style={ssStyles.prizeBigN}>0{i + 1}</div>
              <div style={ssStyles.prizeName}>{p.name}</div>
              <div style={ssStyles.prizeDesc}>{p.desc}</div>
            </div>
          )}
        </div>
        <div style={ssStyles.rewardsBar}>
          <span style={ssStyles.rewardsLbl}>PRIZES:</span>
          {PRIZE_REWARDS.map((r, i) =>
          <span key={i} style={ssStyles.rewardsChip}>{r.name}</span>
          )}
        </div>
      </section>

      <TornDivider color="#fb923c" />

      {/* SAUCE HEAT SLIDER */}
      <section style={{ ...ssStyles.section, background: '#fb923c', color: '#0a0a0a' }}>
        <SS_H title="SAUCE BATTLE" sub="// pick_a_lane.sh" color="#0a0a0a" />
        <div style={ssStyles.sauceCard}>
          <div style={ssStyles.sauceTop}>
            <div>
              <div style={ssStyles.sauceLevelLbl}>YOUR LEVEL ↓</div>
              <div style={{ ...ssStyles.sauceLevelVal, color: heatColor, textShadow: `0 0 24px ${heatColor}, 0 0 4px #fff` }}>
                {heatLabel}
              </div>
            </div>
            <div style={{ ...ssStyles.sauceMeter, borderColor: heatColor }}>
              <div style={ssStyles.sauceMeterN}>{heat}</div>
              <div style={ssStyles.sauceMeterOf}>/ 5</div>
            </div>
          </div>
          <input type="range" min="1" max="5" value={heat} onChange={(e) => setHeat(+e.target.value)}
          style={{ ...ssStyles.sauceSlider, accentColor: heatColor }} />
          <div style={ssStyles.sauceTicks}>
            {['MILD', 'WARM', 'SPICY', 'HEAT', 'INFERNO'].map((l, i) =>
            <div key={i} style={{
              ...ssStyles.sauceTick,
              color: i + 1 === heat ? '#0a0a0a' : 'rgba(10,10,10,0.4)',
              fontWeight: i + 1 === heat ? 700 : 400
            }}>{l}</div>
            )}
          </div>
          <div style={ssStyles.sauceDesc}>
            {heat <= 2 && '> honey-glaze, smoked paprika, lemon. mellow vibes.'}
            {heat === 3 && '> akabanga + ginger glaze. respect-tier. start here.'}
            {heat === 4 && '> pili-pili reduction. you WILL feel it tomorrow.'}
            {heat === 5 && '> carolina reaper × habanero. no survivors. sign waiver.'}
          </div>
        </div>
      </section>

      <TornDivider color="#0a0a0a" flip />

      {/* GALLERY CAROUSEL */}
      <section style={ssStyles.section}>
        <SS_H title="LAST EDITION" sub="// roll.gif" />
        <div style={ssStyles.carWrap}>
          <div style={ssStyles.carFrame}>
            <img src={GALLERY[carouselIdx].src} alt="" style={ssStyles.carImg} />
            <div style={ssStyles.carCorner1}>● REC</div>
            <div style={ssStyles.carCorner2}>VOL.01 / {String(carouselIdx + 1).padStart(2, '0')}</div>
            <div style={ssStyles.carCap}>"{GALLERY[carouselIdx].caption}"</div>
          </div>
          <div style={ssStyles.carCtrls}>
            <button style={ssStyles.carBtn} onClick={() => setCarouselIdx((carouselIdx - 1 + GALLERY.length) % GALLERY.length)}>← PREV</button>
            <button style={ssStyles.carBtn} onClick={() => setCarouselIdx((carouselIdx + 1) % GALLERY.length)}>NEXT →</button>
          </div>
          <div style={ssStyles.dotRow}>
            {GALLERY.map((_, i) =>
            <button key={i} onClick={() => setCarouselIdx(i)} style={{
              ...ssStyles.dot, background: i === carouselIdx ? '#fde047' : 'rgba(255,255,255,0.2)'
            }} />
            )}
          </div>
        </div>
      </section>

      {/* VOICES */}
      <section style={{ ...ssStyles.section, background: '#0a0a0a' }}>
        <SS_H title="VOICES" sub="// reviews.txt" />
        <div style={ssStyles.voiceGrid}>
          {TESTIMONIALS.map((t, i) =>
          <div key={i} style={{ ...ssStyles.voiceCard, transform: `rotate(${i % 2 ? 1 : -1}deg)`,
            background: ['#fde047', '#f43f5e', '#fb923c', '#22d3ee'][i % 4],
            color: '#0a0a0a' }}>
              <div style={ssStyles.voiceQuote}>"{t.quote}"</div>
              <div style={ssStyles.voiceWho}>— {t.name} {t.handle}</div>
            </div>
          )}
        </div>
      </section>

      {/* HOSTS */}
      <section style={ssStyles.section}>
        <SS_H title="THE CREW" sub="// hosts.csv" />
        <div style={ssStyles.crewGrid}>
          {HOSTS.map((h, i) =>
          <div key={i} style={ssStyles.crewCard}>
              <div style={{ ...ssStyles.crewInit, background: ['#fde047', '#f43f5e', '#fb923c', '#22d3ee'][i % 4] }}>
                {h.name.split(' ').map((p) => p[0]).join('')}
              </div>
              <div style={ssStyles.crewName}>{h.name}</div>
              <div style={ssStyles.crewRole}>{h.role}</div>
              <div style={ssStyles.crewTag}>"{h.tag}"</div>
            </div>
          )}
        </div>
      </section>

      {/* TICKETS */}
      <section style={{ ...ssStyles.section, background: '#fde047', color: '#0a0a0a' }}>
        <SS_H title="GET YOUR PASS" sub="// reserve.exe" color="#0a0a0a" />
        <div style={ssStyles.tierStack}>
          {TIERS.map((t) =>
          <button key={t.id} onClick={() => setSelectedTier(t.id)}
          style={{
            ...ssStyles.tierCard,
            ...(selectedTier === t.id ? ssStyles.tierCardActive : {})
          }}>
              <div style={ssStyles.tierLeft}>
                <div style={ssStyles.tierName}>{t.name}</div>
                <div style={ssStyles.tierSub}>{t.sub}</div>
                {t.badge && <div style={ssStyles.tierBadge}>★ {t.badge}</div>}
              </div>
              <div style={ssStyles.tierRight}>
                <div style={ssStyles.tierPrice}>{t.price.toLocaleString()}</div>
                <div style={ssStyles.tierRwf}>RWF</div>
              </div>
              {selectedTier === t.id && <div style={ssStyles.tierMark}>✓ SELECTED</div>}
            </button>
          )}
        </div>

        <div style={ssStyles.qtyCard}>
          {tier.id !== 'duo' &&
          <div style={ssStyles.qtyRow}>
              <span style={ssStyles.qtyLbl}>QUANTITY</span>
              <div style={ssStyles.qtyCtrl}>
                <button style={ssStyles.qtyBtn} onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <span style={ssStyles.qtyVal}>{qty}</span>
                <button style={ssStyles.qtyBtn} onClick={() => setQty(Math.min(10, qty + 1))}>+</button>
              </div>
            </div>
          }
          <div style={ssStyles.totalRow}>
            <span style={ssStyles.totalLbl}>TOTAL DUE</span>
            <span style={ssStyles.totalVal}>{total.toLocaleString()} <span style={ssStyles.totalCur}>RWF</span></span>
          </div>
          <button style={ssStyles.bigBuy} onClick={() => setCheckoutOpen(true)}>
            <span>RSVP &amp; PAY VIA FLUTTERWAVE</span>
            <span>↗</span>
          </button>
        </div>
      </section>

      <TornDivider color="#0a0a0a" flip />

      {/* QUIZ */}
      <section style={ssStyles.section}>
        <SS_H title="BBQ QUIZ" sub="// 5 questions. no cheating." />
        <div style={ssStyles.quizCard}>
          {!quizDone ?
          <>
              <div style={ssStyles.quizProgBar}>
                {QUIZ.map((_, i) =>
              <div key={i} style={{
                ...ssStyles.quizProgPip,
                background: i < quizIdx ? '#fde047' : i === quizIdx ? '#fb923c' : '#3f3f46'
              }} />
              )}
              </div>
              <div style={ssStyles.quizMeta}>Q {quizIdx + 1} OF {QUIZ.length} · SCORE {quizScore}</div>
              <div style={ssStyles.quizQ}>{QUIZ[quizIdx].q}</div>
              <div style={ssStyles.quizOpts}>
                {QUIZ[quizIdx].options.map((opt, i) => {
                const showResult = quizChoice != null;
                const isCorrect = QUIZ[quizIdx].answer === i;
                const isPicked = quizChoice === i;
                return (
                  <button key={i} disabled={showResult} onClick={() => setQuizChoice(i)}
                  style={{
                    ...ssStyles.quizOpt,
                    ...(showResult && isCorrect ? ssStyles.quizOptOK : {}),
                    ...(showResult && isPicked && !isCorrect ? ssStyles.quizOptBad : {})
                  }}>
                      <span style={ssStyles.quizOptLetter}>{String.fromCharCode(65 + i)}</span>
                      <span>{opt}</span>
                    </button>);

              })}
              </div>
              {quizChoice != null &&
            <div style={ssStyles.quizFact}>
                  <strong style={{ color: quizChoice === QUIZ[quizIdx].answer ? '#86efac' : '#fca5a5' }}>
                    {quizChoice === QUIZ[quizIdx].answer ? '> CORRECT' : '> WRONG'}
                  </strong>
                  <div style={{ marginTop: 6 }}>{QUIZ[quizIdx].fact}</div>
                  <button style={ssStyles.quizNext} onClick={() => {
                const right = quizChoice === QUIZ[quizIdx].answer;
                if (quizIdx === QUIZ.length - 1) {setQuizScore((s) => s + (right ? 1 : 0));setQuizDone(true);} else
                {setQuizScore((s) => s + (right ? 1 : 0));setQuizIdx(quizIdx + 1);setQuizChoice(null);}
              }}>{quizIdx === QUIZ.length - 1 ? 'SEE_RESULT()' : 'NEXT_Q() →'}</button>
                </div>
            }
            </> :

          <div style={ssStyles.quizDone}>
              <div style={ssStyles.quizDoneScore}>{quizScore}/{QUIZ.length}</div>
              <div style={ssStyles.quizDoneLbl}>
                {quizScore === 5 && '> PITMASTER. BRING THE TONGS.'}
                {quizScore === 4 && '> STRONG SHOW. YOU\'RE MANNING A GRILL.'}
                {quizScore === 3 && '> DECENT. STAND NEAR COLLINS.'}
                {quizScore < 3 && '> COME FOR THE FOOD, LEAVE WITH A DEGREE.'}
              </div>
              <button style={ssStyles.quizReset} onClick={() => {setQuizIdx(0);setQuizChoice(null);setQuizScore(0);setQuizDone(false);}}>
                RESET()
              </button>
            </div>
          }
        </div>
      </section>

      {/* FAQ */}
      <section style={ssStyles.section}>
        <SS_H title="FAQ" sub="// readme.md" />
        <div style={ssStyles.faqList}>
          {FAQ.map((f, i) =>
          <div key={i} style={ssStyles.faqRow}>
              <button style={ssStyles.faqBtn} onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                <span style={ssStyles.faqK}>{String(i + 1).padStart(2, '0')}</span>
                <span style={ssStyles.faqQ}>{f.q}</span>
                <span style={{ ...ssStyles.faqPlus, transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0)' }}>+</span>
              </button>
              {openFaq === i && <div style={ssStyles.faqA}>{f.a}</div>}
            </div>
          )}
        </div>
      </section>

      {/* MAP */}
      <section style={{ ...ssStyles.section, background: '#22d3ee', color: '#0a0a0a' }}>
        <SS_H title="GETTING THERE" sub="// gps.coords" color="#0a0a0a" />
        <div style={ssStyles.mapWrap}>
          <svg viewBox="0 0 400 240" style={ssStyles.mapSvg}>
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
        <div style={ssStyles.mapBox}>
          <div style={ssStyles.mapKv}><span style={ssStyles.mapK}>LOC</span><span style={ssStyles.mapV}>Fazenda Zenga · Mt Kigali pines</span></div>
          <div style={ssStyles.mapKv}><span style={ssStyles.mapK}>WHEN</span><span style={ssStyles.mapV}>SAT 30 MAY · 2PM</span></div>
          <a href={EVENT.mapsUrl} target="_blank" rel="noopener noreferrer" style={ssStyles.mapLink}>OPEN_IN_MAPS() ↗</a>
        </div>
      </section>

      {/* SPONSORS */}
      <section style={{ ...ssStyles.section, paddingTop: 32, paddingBottom: 32 }}>
        <div style={ssStyles.sponsorHead}>// WITH_THANKS_TO</div>
        <div style={ssStyles.sponsorGrid}>
          {SPONSORS.map((s, i) =>
          <div key={i} style={ssStyles.sponsorCell}>
              <div style={ssStyles.sponsorName}>{s.name}</div>
              <div style={ssStyles.sponsorKind}>{s.kind}</div>
            </div>
          )}
        </div>
      </section>

      {/* BOTTOM MARQUEE */}
      <div style={{ ...ssStyles.marquee, background: '#f43f5e', color: '#0a0a0a' }}>
        <div style={ssStyles.marqueeInner} className="ss-marquee-anim-rev">
          {Array.from({ length: 4 }).map((_, k) =>
          <span key={k} style={ssStyles.marqueeText}>
              ✦ COME HUNGRY ✦ BRING A FRIEND ✦ LEAVE WITH STORIES ✦ {EVENT.ig} ✦&nbsp;
            </span>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <footer style={ssStyles.footer}>
        <div style={ssStyles.footerLogo}>FIRE &amp; SMOKE</div>
        <div style={ssStyles.footerLine}>© 2026 · KIGALI · NOT JUST A BBQ</div>
        <div style={ssStyles.footerLine}>{EVENT.ig} · {EVENT.whatsapp}</div>
      </footer>

      {/* STICKY MOBILE */}
      <div style={ssStyles.stickyBar}>
        <div>
          <div style={ssStyles.stickyK}>FROM</div>
          <div style={ssStyles.stickyV}>15,000 RWF</div>
        </div>
        <button style={ssStyles.stickyBtn} onClick={() => setCheckoutOpen(true)}>RSVP ↗</button>
      </div>

      {checkoutOpen && <SSCheckout tier={tier} qty={qty} total={total} onClose={() => setCheckoutOpen(false)} />}
    </div>);

}

function SS_H({ title, sub, color }) {
  return (
    <div style={{ ...ssStyles.sectHead, color: color || '#fff' }}>
      <div style={ssStyles.sectSub}>{sub}</div>
      <h2 style={ssStyles.sectTitle}>{title}</h2>
    </div>);

}

function TornDivider({ color, flip }) {
  // jagged zigzag SVG band
  return (
    <div style={{ height: 24, width: '100%', overflow: 'hidden', transform: flip ? 'scaleY(-1)' : 'none', background: 'transparent' }}>
      <svg viewBox="0 0 100 6" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
        <polygon points="0,0 0,6 4,2 8,6 12,2 16,6 20,2 24,6 28,2 32,6 36,2 40,6 44,2 48,6 52,2 56,6 60,2 64,6 68,2 72,6 76,2 80,6 84,2 88,6 92,2 96,6 100,2 100,0" fill={color} />
      </svg>
    </div>);

}

function SSCheckout({ tier, qty, total, onClose }) {
  const [step, setStep] = React.useState(1);
  const [form, setForm] = React.useState({ name: '', email: '', phone: '', friend: '' });
  const [paying, setPaying] = React.useState(false);
  const ref = 'FS' + Math.floor(100000 + Math.random() * 900000);

  const submit = () => {
    setPaying(true);
    setTimeout(() => {setPaying(false);setStep(3);}, 1600);
  };

  return (
    <div style={ssStyles.modalOverlay} onClick={onClose}>
      <div style={ssStyles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={ssStyles.modalHead}>
          <span style={ssStyles.modalHeadLogo}>FIRE &amp; SMOKE</span>
          <button style={ssStyles.modalClose} onClick={onClose}>× CLOSE</button>
        </div>

        {step !== 3 &&
        <div style={ssStyles.modalSteps}>
            <span style={{ ...ssStyles.modalStep, ...(step >= 1 ? ssStyles.modalStepOn : {}) }}>01 · YOU</span>
            <span style={ssStyles.modalSep}>////</span>
            <span style={{ ...ssStyles.modalStep, ...(step >= 2 ? ssStyles.modalStepOn : {}) }}>02 · PAY</span>
            <span style={ssStyles.modalSep}>////</span>
            <span style={{ ...ssStyles.modalStep, ...(step >= 3 ? ssStyles.modalStepOn : {}) }}>03 · GO</span>
          </div>
        }

        {step === 1 &&
        <>
            <h3 style={ssStyles.modalTitle}>WHO'S COMING?</h3>
            <div style={ssStyles.modalSummary}>
              <span>{tier.name}{tier.id !== 'duo' && qty > 1 && ` × ${qty}`}</span>
              <strong>{total.toLocaleString()} RWF</strong>
            </div>
            <div style={ssStyles.modalForm}>
              <label style={ssStyles.modalLbl}>NAME
                <input style={ssStyles.modalInput} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
              </label>
              <label style={ssStyles.modalLbl}>EMAIL
                <input style={ssStyles.modalInput} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" />
              </label>
              <label style={ssStyles.modalLbl}>PHONE
                <input style={ssStyles.modalInput} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+250 …" />
              </label>
              {tier.id === 'duo' &&
            <label style={ssStyles.modalLbl}>FRIEND
                  <input style={ssStyles.modalInput} value={form.friend} onChange={(e) => setForm({ ...form, friend: e.target.value })} placeholder="Who you bringing?" />
                </label>
            }
            </div>
            <button style={ssStyles.modalNext} onClick={() => setStep(2)} disabled={!form.name || !form.email}>
              CONTINUE TO PAYMENT ↗
            </button>
          </>
        }

        {step === 2 &&
        <>
            <h3 style={ssStyles.modalTitle}>PAY {total.toLocaleString()} RWF</h3>
            <div style={ssStyles.flutter}>
              <div style={ssStyles.flutterHead}>
                <span style={ssStyles.flutterLogo}>flutterwave</span>
                <span style={ssStyles.flutterLock}>🔒 SSL</span>
              </div>
              <div style={ssStyles.flutterTabs}>
                <button style={{ ...ssStyles.flutterTab, ...ssStyles.flutterTabOn }}>CARD</button>
                <button style={ssStyles.flutterTab}>MTN MOMO</button>
                <button style={ssStyles.flutterTab}>AIRTEL</button>
              </div>
              <input style={ssStyles.flutterInput} placeholder="Card number" defaultValue="4242 4242 4242 4242" />
              <div style={ssStyles.flutterSplit}>
                <input style={ssStyles.flutterInput} placeholder="MM/YY" defaultValue="05/27" />
                <input style={ssStyles.flutterInput} placeholder="CVV" defaultValue="123" />
              </div>
              <button style={ssStyles.flutterPay} onClick={submit} disabled={paying}>
                {paying ? 'PROCESSING…' : `PAY ${total.toLocaleString()} RWF ↗`}
              </button>
            </div>
            <button style={ssStyles.modalBack} onClick={() => setStep(1)}>← BACK</button>
          </>
        }

        {step === 3 &&
        <div style={ssStyles.successWrap}>
            <div style={ssStyles.successBig}>✓ YOU'RE IN</div>
            <div style={ssStyles.successSub}>See you in the pines.</div>
            <div style={ssStyles.passCard}>
              <div style={ssStyles.passStrip}>FIRE &amp; SMOKE · VOL.02 · 30 MAY 2026</div>
              <div style={ssStyles.passBody}>
                <div style={ssStyles.passKV}>
                  <div><div style={ssStyles.passK}>NAME</div><div style={ssStyles.passV}>{form.name}</div></div>
                  <div><div style={ssStyles.passK}>TIER</div><div style={ssStyles.passV}>{tier.name}</div></div>
                  <div><div style={ssStyles.passK}>REF</div><div style={ssStyles.passV}>{ref}</div></div>
                </div>
                <div style={ssStyles.passQR}>
                  {Array.from({ length: 64 }).map((_, i) => <div key={i} style={{ background: i * 7 % 5 > 1 ? '#0a0a0a' : 'transparent' }} />)}
                </div>
              </div>
              <div style={ssStyles.passFoot}>SCAN AT GATE · DON'T LOSE THIS</div>
            </div>
            <button style={ssStyles.modalNext} onClick={onClose}>CLOSE</button>
          </div>
        }
      </div>
    </div>);

}

const k_yellow = '#fde047';
const k_pink = '#f43f5e';
const k_orange = '#fb923c';
const k_cyan = '#22d3ee';
const k_bg = '#0a0a0a';
const k_text = '#fafafa';
const k_dim = '#a1a1aa';

const display = "'Bowlby One', 'Archivo Black', sans-serif";
const mono = "'Space Mono', 'Courier New', monospace";
const heavy = "'Archivo Black', sans-serif";

const ssStyles = {
  page: { background: k_bg, color: k_text, fontFamily: mono, paddingBottom: 80, minHeight: '100vh', overflowX: 'hidden' },

  marquee: { background: k_yellow, color: k_bg, padding: '8px 0', overflow: 'hidden', position: 'relative', borderTop: `3px solid ${k_bg}`, borderBottom: `3px solid ${k_bg}` },
  marqueeInner: { whiteSpace: 'nowrap', display: 'inline-block' },
  marqueeText: { fontFamily: heavy, fontSize: 13, letterSpacing: 2, textTransform: 'uppercase' },

  hero: { padding: '24px 18px 0' },
  heroGrid: { position: 'relative' },
  heroLeft: { position: 'relative' },
  heroBadgeRow: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 },
  heroBadge: { background: k_yellow, color: k_bg, padding: '4px 10px', fontFamily: mono, fontSize: 10, fontWeight: 700, letterSpacing: 1.5 },
  heroBadge2: { background: k_pink, color: k_bg, padding: '4px 10px', fontFamily: mono, fontSize: 10, fontWeight: 700, letterSpacing: 1.5 },
  heroBadge3: { background: k_cyan, color: k_bg, padding: '4px 10px', fontFamily: mono, fontSize: 10, fontWeight: 700, letterSpacing: 1.5 },

  heroH1: { fontFamily: display, fontSize: 'clamp(72px, 22vw, 130px)', lineHeight: 0.85, margin: 0, fontWeight: 400, letterSpacing: -2, display: 'flex', flexDirection: 'column' },
  heroLine1: { color: k_text, textShadow: `6px 6px 0 ${k_pink}` },
  heroAmp: { color: k_yellow, fontSize: '60%', alignSelf: 'flex-start', marginLeft: 8, marginTop: -8, fontStyle: 'italic', WebkitTextStroke: `2px ${k_bg}` },
  heroLine2: { color: k_text, textShadow: `6px 6px 0 ${k_orange}` },

  heroBarcode: { fontFamily: mono, fontSize: 11, color: k_dim, letterSpacing: 4, marginTop: 14 },

  heroSticker1: { position: 'absolute', top: 30, right: -8, transform: 'rotate(8deg)', zIndex: 2 },
  heroSticker1Inner: { background: k_pink, color: k_bg, width: 88, height: 88, borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: `3px solid ${k_bg}`, boxShadow: '0 6px 0 rgba(0,0,0,0.5)' },
  heroSticker1Big: { fontFamily: display, fontSize: 38, lineHeight: 1 },
  heroSticker1Sm: { fontFamily: mono, fontSize: 11, fontWeight: 700, letterSpacing: 2, marginTop: -2 },
  heroSticker1Year: { fontFamily: mono, fontSize: 10, fontWeight: 700, letterSpacing: 1.5 },

  heroPara: { fontFamily: mono, fontSize: 14, lineHeight: 1.6, color: '#d4d4d8', marginTop: 22, maxWidth: 520 },

  heroMeta: { marginTop: 22, padding: '14px 12px', background: '#18181b', border: `1px solid #27272a` },
  heroMetaRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '6px 0', borderBottom: '1px dashed #3f3f46' },
  heroMetaK: { fontFamily: mono, fontSize: 10, color: k_yellow, letterSpacing: 2, fontWeight: 700 },
  heroMetaV: { fontFamily: heavy, fontSize: 13, color: k_text, letterSpacing: 0.5 },

  heroCta: { width: '100%', marginTop: 20, padding: '20px', background: k_pink, color: k_bg, border: `3px solid ${k_bg}`, fontFamily: display, fontSize: 18, cursor: 'pointer', boxShadow: `8px 8px 0 ${k_yellow}`, letterSpacing: 1 },
  heroCtaLabel: {},

  heroRight: { position: 'relative', marginTop: 32, height: 280 },
  polaroid: { position: 'absolute', background: '#fafafa', padding: 6, paddingBottom: 22, boxShadow: '0 10px 24px rgba(0,0,0,0.6)' },
  polaroidImg: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  polaroidCap: { position: 'absolute', bottom: 4, left: 0, right: 0, textAlign: 'center', fontFamily: mono, fontSize: 11, fontWeight: 700, color: k_bg, letterSpacing: 1 },

  countdownStrip: { marginTop: 28, padding: '16px 14px', background: '#18181b', border: `2px dashed ${k_yellow}`, position: 'relative' },
  countdownLbl: { fontFamily: mono, fontSize: 11, color: k_yellow, letterSpacing: 3, fontWeight: 700, textAlign: 'center', marginBottom: 10 },
  countdownRow: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 },
  countdownCell: { textAlign: 'center', padding: '10px 4px', background: k_bg, border: `1px solid ${k_yellow}` },
  countdownVal: { fontFamily: display, fontSize: 34, color: k_text, lineHeight: 1, letterSpacing: -1 },
  countdownK: { fontFamily: mono, fontSize: 10, color: k_yellow, letterSpacing: 2, fontWeight: 700, marginTop: 4 },

  section: { padding: '40px 18px', background: k_bg, color: k_text },
  sectHead: { marginBottom: 24 },
  sectSub: { fontFamily: mono, fontSize: 11, opacity: 0.65, letterSpacing: 1.5, marginBottom: 6 },
  sectTitle: { fontFamily: display, fontSize: 'clamp(36px, 10vw, 56px)', margin: 0, lineHeight: 0.95, letterSpacing: -1 },

  newGrid: { display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 },
  newTile: { background: k_bg, color: k_text, padding: 14, border: `2px solid ${k_bg}` },
  newTileNum: { fontFamily: mono, fontSize: 9, letterSpacing: 2, color: k_yellow, fontWeight: 700 },
  newTileTitle: { fontFamily: heavy, fontSize: 17, marginTop: 6, lineHeight: 1.1 },
  newTileSub: { fontFamily: mono, fontSize: 12, color: '#a1a1aa', marginTop: 6, lineHeight: 1.4 },

  schedTrack: { position: 'relative', paddingLeft: 12 },
  schedRow: { display: 'grid', gridTemplateColumns: '70px 16px 1fr', gap: 12, padding: '12px 0', borderBottom: '1px dashed #3f3f46', alignItems: 'baseline' },
  schedTime: { fontFamily: display, fontSize: 20, color: k_yellow, letterSpacing: -1 },
  schedDot: { width: 10, height: 10, borderRadius: '50%', background: k_pink, marginTop: 6, alignSelf: 'start' },
  schedBody: {},
  schedLabel: { fontFamily: heavy, fontSize: 15, color: k_text, letterSpacing: 0.5 },
  schedSub: { fontFamily: mono, fontSize: 12, color: '#a1a1aa', marginTop: 4 },

  gamesGrid: { display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  gameTag: { background: k_bg, color: k_yellow, padding: '10px 14px', border: `3px solid ${k_bg}`, boxShadow: '4px 4px 0 rgba(0,0,0,0.4)', minWidth: 100, textAlign: 'center' },
  gameTagK: { fontFamily: mono, fontSize: 9, opacity: 0.6, letterSpacing: 1.5 },
  gameTagName: { fontFamily: heavy, fontSize: 14, marginTop: 2 },
  gamesNote: { fontFamily: mono, fontSize: 12, fontWeight: 700, textAlign: 'center', marginTop: 20, letterSpacing: 1.5 },

  prizeGrid: { display: 'grid', gridTemplateColumns: '1fr', gap: 12 },
  prizeCard: { padding: 16, background: '#18181b', border: `1px solid #27272a`, borderLeft: `6px solid ${k_pink}` },
  prizeBigN: { fontFamily: display, fontSize: 32, color: k_pink, lineHeight: 1, letterSpacing: -1 },
  prizeName: { fontFamily: heavy, fontSize: 18, color: k_text, marginTop: 4 },
  prizeDesc: { fontFamily: mono, fontSize: 13, color: '#a1a1aa', marginTop: 6, lineHeight: 1.4 },
  rewardsBar: { marginTop: 18, padding: '12px', background: k_yellow, color: k_bg, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
  rewardsLbl: { fontFamily: heavy, fontSize: 12, letterSpacing: 2 },
  rewardsChip: { fontFamily: mono, fontSize: 11, fontWeight: 700, padding: '4px 8px', background: k_bg, color: k_yellow },

  sauceCard: { padding: 18, background: '#fef3c7', color: k_bg, border: `3px solid ${k_bg}`, boxShadow: `8px 8px 0 ${k_bg}` },
  sauceTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  sauceLevelLbl: { fontFamily: mono, fontSize: 11, letterSpacing: 2, fontWeight: 700 },
  sauceLevelVal: { fontFamily: display, fontSize: 'clamp(36px,12vw,56px)', lineHeight: 1, marginTop: 4, letterSpacing: -1 },
  sauceMeter: { width: 78, height: 78, borderRadius: '50%', border: `4px solid`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: k_bg, color: k_yellow, flexShrink: 0 },
  sauceMeterN: { fontFamily: display, fontSize: 30, lineHeight: 1 },
  sauceMeterOf: { fontFamily: mono, fontSize: 10, fontWeight: 700, marginTop: -2 },
  sauceSlider: { width: '100%', marginTop: 20, height: 8 },
  sauceTicks: { display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', marginTop: 8 },
  sauceTick: { fontFamily: mono, fontSize: 10, letterSpacing: 1, textAlign: 'center' },
  sauceDesc: { fontFamily: mono, fontSize: 13, marginTop: 16, padding: '10px', background: k_bg, color: k_yellow, lineHeight: 1.5 },

  carWrap: {},
  carFrame: { position: 'relative', border: `3px solid ${k_yellow}`, padding: 6, background: k_bg },
  carImg: { width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' },
  carCorner1: { position: 'absolute', top: 12, left: 12, background: k_pink, color: k_bg, fontFamily: mono, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, padding: '3px 8px' },
  carCorner2: { position: 'absolute', top: 12, right: 12, background: k_bg, color: k_yellow, fontFamily: mono, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, padding: '3px 8px', border: `1px solid ${k_yellow}` },
  carCap: { position: 'absolute', bottom: 16, left: 12, right: 12, background: 'rgba(0,0,0,0.7)', color: k_yellow, fontFamily: mono, fontSize: 12, padding: '8px 10px', backdropFilter: 'blur(4px)' },
  carCtrls: { display: 'flex', justifyContent: 'space-between', marginTop: 14, gap: 10 },
  carBtn: { flex: 1, padding: '12px', background: 'transparent', border: `2px solid ${k_yellow}`, color: k_yellow, fontFamily: heavy, fontSize: 12, letterSpacing: 2, cursor: 'pointer' },
  dotRow: { display: 'flex', justifyContent: 'center', gap: 6, marginTop: 12 },
  dot: { width: 8, height: 8, borderRadius: '50%', border: 'none', cursor: 'pointer', padding: 0 },

  voiceGrid: { display: 'flex', flexDirection: 'column', gap: 18 },
  voiceCard: { padding: 16, border: `3px solid #fafafa` },
  voiceQuote: { fontFamily: heavy, fontSize: 16, lineHeight: 1.3 },
  voiceWho: { fontFamily: mono, fontSize: 12, fontWeight: 700, marginTop: 10, letterSpacing: 1 },

  crewGrid: { display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 },
  crewCard: { padding: 14, background: '#18181b', border: `1px solid #27272a`, textAlign: 'center' },
  crewInit: { width: 52, height: 52, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: heavy, fontSize: 18, color: k_bg, margin: '0 auto 10px', border: `2px solid ${k_bg}` },
  crewName: { fontFamily: heavy, fontSize: 14 },
  crewRole: { fontFamily: mono, fontSize: 10, color: k_yellow, letterSpacing: 2, fontWeight: 700, marginTop: 4 },
  crewTag: { fontFamily: mono, fontStyle: 'italic', fontSize: 11, color: '#a1a1aa', marginTop: 6 },

  tierStack: { display: 'flex', flexDirection: 'column', gap: 10 },
  tierCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: 16, background: k_bg, color: k_yellow, border: `3px solid ${k_bg}`, textAlign: 'left', cursor: 'pointer', position: 'relative' },
  tierCardActive: { background: k_pink, color: k_bg, boxShadow: `6px 6px 0 ${k_bg}` },
  tierLeft: { flex: 1 },
  tierName: { fontFamily: heavy, fontSize: 18 },
  tierSub: { fontFamily: mono, fontSize: 12, marginTop: 4, opacity: 0.85 },
  tierBadge: { fontFamily: mono, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, marginTop: 6 },
  tierRight: { textAlign: 'right' },
  tierPrice: { fontFamily: display, fontSize: 30, lineHeight: 1, letterSpacing: -1 },
  tierRwf: { fontFamily: mono, fontSize: 11, fontWeight: 700, letterSpacing: 1.5 },
  tierMark: { position: 'absolute', bottom: -10, right: 10, background: k_yellow, color: k_bg, fontFamily: mono, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, padding: '2px 8px' },

  qtyCard: { marginTop: 18, padding: 16, background: k_bg, color: k_yellow },
  qtyRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: `1px dashed #3f3f46` },
  qtyLbl: { fontFamily: mono, fontSize: 11, letterSpacing: 2, fontWeight: 700 },
  qtyCtrl: { display: 'flex', alignItems: 'center', gap: 8 },
  qtyBtn: { width: 36, height: 36, background: 'transparent', border: `2px solid ${k_yellow}`, color: k_yellow, fontFamily: heavy, fontSize: 16, cursor: 'pointer' },
  qtyVal: { fontFamily: display, fontSize: 22, minWidth: 24, textAlign: 'center' },
  totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '14px 0' },
  totalLbl: { fontFamily: mono, fontSize: 11, letterSpacing: 2, fontWeight: 700 },
  totalVal: { fontFamily: display, fontSize: 32, color: k_text, lineHeight: 1, letterSpacing: -1 },
  totalCur: { fontFamily: mono, fontSize: 13, color: k_yellow },
  bigBuy: { width: '100%', padding: '18px', background: k_yellow, color: k_bg, border: 'none', fontFamily: display, fontSize: 16, cursor: 'pointer', letterSpacing: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },

  quizCard: { padding: 18, background: '#18181b', border: `1px solid #27272a` },
  quizProgBar: { display: 'flex', gap: 4 },
  quizProgPip: { flex: 1, height: 6 },
  quizMeta: { fontFamily: mono, fontSize: 10, letterSpacing: 2, color: k_yellow, fontWeight: 700, marginTop: 10 },
  quizQ: { fontFamily: heavy, fontSize: 18, color: k_text, marginTop: 8, lineHeight: 1.2 },
  quizOpts: { display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 },
  quizOpt: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: k_bg, color: k_text, border: `1px solid #3f3f46`, cursor: 'pointer', fontFamily: mono, fontSize: 13, textAlign: 'left', width: '100%' },
  quizOptOK: { background: 'rgba(34,197,94,0.15)', borderColor: '#22c55e' },
  quizOptBad: { background: 'rgba(239,68,68,0.15)', borderColor: '#ef4444' },
  quizOptLetter: { fontFamily: heavy, fontSize: 12, color: k_yellow, letterSpacing: 2, minWidth: 18 },
  quizFact: { fontFamily: mono, fontSize: 12, color: '#d4d4d8', marginTop: 14, padding: '12px', background: k_bg, lineHeight: 1.5, border: `1px solid #3f3f46` },
  quizNext: { display: 'block', marginTop: 12, background: k_yellow, color: k_bg, border: 'none', padding: '10px 14px', fontFamily: heavy, fontSize: 12, letterSpacing: 2, cursor: 'pointer' },
  quizDone: { textAlign: 'center', padding: '14px 6px' },
  quizDoneScore: { fontFamily: display, fontSize: 80, color: k_yellow, lineHeight: 1, letterSpacing: -3 },
  quizDoneLbl: { fontFamily: mono, fontSize: 14, fontWeight: 700, color: k_text, marginTop: 8, letterSpacing: 1 },
  quizReset: { marginTop: 14, background: 'transparent', border: `2px solid ${k_yellow}`, color: k_yellow, padding: '10px 14px', fontFamily: heavy, fontSize: 12, letterSpacing: 2, cursor: 'pointer' },

  faqList: { display: 'flex', flexDirection: 'column' },
  faqRow: { borderBottom: '1px dashed #3f3f46' },
  faqBtn: { display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '16px 0', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', color: k_text },
  faqK: { fontFamily: mono, fontSize: 12, fontWeight: 700, color: k_yellow, letterSpacing: 2 },
  faqQ: { fontFamily: heavy, fontSize: 14, color: k_text, flex: 1, lineHeight: 1.3 },
  faqPlus: { fontFamily: display, fontSize: 22, color: k_pink, transition: 'transform 0.2s' },
  faqA: { fontFamily: mono, fontSize: 13, color: '#a1a1aa', lineHeight: 1.55, padding: '0 0 16px 28px' },

  mapWrap: { background: '#fff', padding: 6, border: `3px solid ${k_bg}`, boxShadow: `6px 6px 0 ${k_bg}` },
  mapSvg: { width: '100%', display: 'block' },
  mapBox: { marginTop: 16, padding: 16, background: k_bg, color: k_yellow },
  mapKv: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed #3f3f46' },
  mapK: { fontFamily: mono, fontSize: 11, letterSpacing: 2, fontWeight: 700 },
  mapV: { fontFamily: heavy, fontSize: 13, color: k_text },
  mapLink: { display: 'inline-block', marginTop: 12, padding: '10px 14px', background: k_yellow, color: k_bg, fontFamily: heavy, fontSize: 12, letterSpacing: 2, textDecoration: 'none' },

  sponsorHead: { fontFamily: mono, fontSize: 11, letterSpacing: 2, color: k_dim, fontWeight: 700, marginBottom: 14 },
  sponsorGrid: { display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 },
  sponsorCell: { padding: 12, background: '#18181b', border: `1px solid #27272a` },
  sponsorName: { fontFamily: heavy, fontSize: 14, color: k_text },
  sponsorKind: { fontFamily: mono, fontSize: 10, color: k_yellow, letterSpacing: 1.5, fontWeight: 700, marginTop: 4 },

  footer: { padding: '24px 18px 110px', textAlign: 'center', background: k_bg, borderTop: `3px solid ${k_yellow}` },
  footerLogo: { fontFamily: display, fontSize: 28, color: k_text, letterSpacing: -0.5 },
  footerLine: { fontFamily: mono, fontSize: 11, color: k_dim, marginTop: 6, letterSpacing: 1 },

  stickyBar: { position: 'fixed', bottom: 0, left: 0, right: 0, background: k_bg, borderTop: `3px solid ${k_yellow}`, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 50 },
  stickyK: { fontFamily: mono, fontSize: 9, letterSpacing: 2, color: k_yellow, fontWeight: 700 },
  stickyV: { fontFamily: heavy, fontSize: 16, color: k_text, lineHeight: 1.1 },
  stickyBtn: { background: k_pink, color: k_bg, border: 'none', padding: '12px 18px', fontFamily: heavy, fontSize: 13, letterSpacing: 2, cursor: 'pointer' },

  // modal
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(6px)' },
  modal: { background: k_bg, color: k_text, width: '100%', maxWidth: 480, maxHeight: '95vh', overflowY: 'auto', padding: 22, position: 'relative', border: `3px solid ${k_yellow}` },
  modalHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  modalHeadLogo: { fontFamily: heavy, fontSize: 14, color: k_yellow, letterSpacing: 1 },
  modalClose: { background: 'transparent', border: 'none', color: k_dim, fontFamily: mono, fontSize: 12, cursor: 'pointer', letterSpacing: 1.5, fontWeight: 700 },

  modalSteps: { display: 'flex', gap: 6, alignItems: 'center', marginBottom: 16 },
  modalStep: { fontFamily: mono, fontSize: 10, letterSpacing: 1.5, color: k_dim, fontWeight: 700 },
  modalStepOn: { color: k_yellow },
  modalSep: { color: k_dim },

  modalTitle: { fontFamily: display, fontSize: 28, margin: 0, marginBottom: 14, letterSpacing: -0.5, lineHeight: 1 },
  modalSummary: { display: 'flex', justifyContent: 'space-between', padding: 14, background: '#18181b', color: k_yellow, fontFamily: mono, fontSize: 14, fontWeight: 700 },
  modalForm: { display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 },
  modalLbl: { display: 'flex', flexDirection: 'column', gap: 6, fontFamily: mono, fontSize: 10, letterSpacing: 2, color: k_yellow, fontWeight: 700 },
  modalInput: { padding: '12px', border: `2px solid ${k_yellow}`, background: '#18181b', color: k_text, fontFamily: mono, fontSize: 14, outline: 'none' },
  modalNext: { width: '100%', marginTop: 18, background: k_pink, color: k_bg, border: 'none', padding: '16px', fontFamily: heavy, fontSize: 14, letterSpacing: 2, cursor: 'pointer' },
  modalBack: { marginTop: 12, background: 'transparent', border: 'none', color: k_dim, fontFamily: mono, fontSize: 11, letterSpacing: 2, cursor: 'pointer', fontWeight: 700 },

  flutter: { padding: 16, background: '#fafafa', color: k_bg, border: `2px solid ${k_yellow}`, marginTop: 8 },
  flutterHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  flutterLogo: { fontFamily: heavy, fontSize: 16, color: '#f5a623' },
  flutterLock: { fontFamily: mono, fontSize: 10, color: k_dim, letterSpacing: 1 },
  flutterTabs: { display: 'flex', gap: 4, marginBottom: 12 },
  flutterTab: { flex: 1, padding: '10px 6px', background: '#fff', border: `1px solid ${k_bg}`, fontFamily: mono, fontSize: 10, fontWeight: 700, letterSpacing: 1, cursor: 'pointer' },
  flutterTabOn: { background: k_bg, color: k_yellow },
  flutterInput: { padding: '12px', border: `1px solid ${k_bg}`, background: '#fff', fontFamily: mono, fontSize: 14, outline: 'none', width: '100%', marginBottom: 8 },
  flutterSplit: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 },
  flutterPay: { width: '100%', background: k_bg, color: k_yellow, border: 'none', padding: '14px', fontFamily: heavy, fontSize: 13, letterSpacing: 2, cursor: 'pointer', marginTop: 8 },

  successWrap: { textAlign: 'center', padding: '6px 0' },
  successBig: { fontFamily: display, fontSize: 36, color: k_yellow, lineHeight: 1, letterSpacing: -1 },
  successSub: { fontFamily: mono, fontSize: 14, color: k_text, marginTop: 8, fontWeight: 700 },
  passCard: { marginTop: 18, background: '#fafafa', color: k_bg, padding: 0, border: `2px solid ${k_bg}` },
  passStrip: { background: k_bg, color: k_yellow, padding: '8px 12px', fontFamily: mono, fontSize: 11, fontWeight: 700, letterSpacing: 2 },
  passBody: { padding: 14, display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, textAlign: 'left' },
  passKV: { display: 'flex', flexDirection: 'column', gap: 8 },
  passK: { fontFamily: mono, fontSize: 9, letterSpacing: 2, color: k_dim, fontWeight: 700 },
  passV: { fontFamily: heavy, fontSize: 13, color: k_bg, marginTop: 2 },
  passQR: { width: 72, height: 72, display: 'grid', gridTemplateColumns: 'repeat(8,1fr)', gridTemplateRows: 'repeat(8,1fr)', padding: 2, background: '#fff', border: `1px solid ${k_bg}` },
  passFoot: { background: 'repeating-linear-gradient(90deg, #fafafa 0, #fafafa 6px, #0a0a0a 6px, #0a0a0a 8px)', padding: '10px 12px', fontFamily: mono, fontSize: 10, color: k_bg, fontWeight: 700, letterSpacing: 1.5, textAlign: 'center', background: '#0a0a0a', color: '#fde047' }
};

const ssCSS = `
  @keyframes ss-marquee { from { transform: translateX(0) } to { transform: translateX(-25%) } }
  @keyframes ss-marquee-rev { from { transform: translateX(-25%) } to { transform: translateX(0) } }
  .ss-marquee-anim { animation: ss-marquee 28s linear infinite; }
  .ss-marquee-anim-rev { animation: ss-marquee-rev 28s linear infinite; }

  .ss-polaroid-1 { width: 150px; height: 200px; left: 4%; top: 10px; transform: rotate(-6deg); z-index: 1; }
  .ss-polaroid-2 { width: 130px; height: 170px; right: 6%; top: 30px; transform: rotate(7deg); z-index: 2; }
  .ss-polaroid-3 { width: 140px; height: 180px; left: 40%; top: 90px; transform: rotate(-2deg); z-index: 3; }
`;

window.SmokeStackSite = SmokeStackSite;