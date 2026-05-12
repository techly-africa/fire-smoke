// Direction 2: EMBER — Cinematic editorial. Big imagery, refined display serif
// for the headline + heavy condensed sans for UI, warm cream + char black,
// rule lines, page-numbered sections, calmer rhythm. Same content, very
// different posture from Inferno.

function EmberSite() {
  const { EVENT, TIERS, WHATS_NEW, GAMES, PRIZES, PRIZE_REWARDS, SCHEDULE,
          GALLERY, TESTIMONIALS, FAQ, HOSTS, SPONSORS, QUIZ,
          useCountdown } = window.FS;

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
  const heatColor = ['#f59e0b','#ea580c','#dc2626','#b91c1c','#7f1d1d'][heat-1];

  const sections = [
    { n:'01', label:'The Edition' },
    { n:'02', label:'What\'s New' },
    { n:'03', label:'Run of Show' },
    { n:'04', label:'Games & Prizes' },
    { n:'05', label:'Sauce Battle' },
    { n:'06', label:'Last Edition' },
    { n:'07', label:'Voices' },
    { n:'08', label:'Hosts' },
    { n:'09', label:'Reserve' },
    { n:'10', label:'Details' },
  ];

  return (
    <div style={emberStyles.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,700;9..144,900&family=Barlow+Condensed:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <style>{emberCSS}</style>

      {/* MASTHEAD */}
      <header style={emberStyles.masthead}>
        <div style={emberStyles.mastRow}>
          <span style={emberStyles.mastEdition}>VOL. 02 · MAY 2026</span>
          <span style={emberStyles.mastTitle}>FIRE &amp; SMOKE</span>
          <span style={emberStyles.mastEdition}>KIGALI · FREE PAPER</span>
        </div>
        <div style={emberStyles.mastRule} />
      </header>

      {/* HERO */}
      <section style={emberStyles.hero}>
        <div style={emberStyles.heroImageWrap}>
          <img src="photos/p06-barrel-grill.jpeg" alt="The drum smoker" style={emberStyles.heroImg} />
          <div style={emberStyles.heroVignette} />
          <div style={emberStyles.heroEditionTag}>BBQ Games · Edition Two</div>
        </div>

        <div style={emberStyles.heroBody}>
          <div style={emberStyles.heroEyebrow}>— A daytime forest gathering</div>
          <h1 style={emberStyles.heroH1}>
            We light the fire.<br/>
            <em style={emberStyles.heroEm}>You bring the stories.</em>
          </h1>
          <p style={emberStyles.heroLede}>
            Last edition we celebrated the CrossFit community with food, fun and good energy. This time we are switching it up — different proteins, daytime music, a games corner, a sauce battle that will ruin you (in the best way), and a pro shooter in the pines from three.
          </p>

          <div style={emberStyles.heroMetaGrid}>
            <div style={emberStyles.heroMetaCell}>
              <div style={emberStyles.heroMetaKey}>WHEN</div>
              <div style={emberStyles.heroMetaVal}>30 May 2026</div>
              <div style={emberStyles.heroMetaSub}>Saturday · 2pm — 8pm</div>
            </div>
            <div style={emberStyles.heroMetaCell}>
              <div style={emberStyles.heroMetaKey}>WHERE</div>
              <div style={emberStyles.heroMetaVal}>Fazenda Zenga</div>
              <div style={emberStyles.heroMetaSub}>Mt Kigali pine forest</div>
            </div>
            <div style={emberStyles.heroMetaCell}>
              <div style={emberStyles.heroMetaKey}>BRING</div>
              <div style={emberStyles.heroMetaVal}>A friend</div>
              <div style={emberStyles.heroMetaSub}>And an appetite</div>
            </div>
          </div>

          <div style={emberStyles.countdownStrip}>
            {[['DAYS',cd.days],['HRS',cd.hours],['MIN',cd.mins],['SEC',cd.secs]].map(([l,v])=>(
              <div key={l} style={emberStyles.countdownCell}>
                <div style={emberStyles.countdownVal}>{String(v).padStart(2,'0')}</div>
                <div style={emberStyles.countdownLbl}>{l}</div>
              </div>
            ))}
          </div>

          <button style={emberStyles.heroCTA} onClick={()=>setCheckoutOpen(true)}>
            <span>Reserve your seat</span>
            <span style={emberStyles.heroCTAArrow}>→</span>
          </button>
          <div style={emberStyles.heroCTASub}>Card &amp; mobile money via Flutterwave · Instant pass</div>
        </div>
      </section>

      {/* INDEX */}
      <nav style={emberStyles.indexBlock}>
        <div style={emberStyles.indexHead}>In this issue</div>
        <div style={emberStyles.indexGrid}>
          {sections.map(s=>(
            <div key={s.n} style={emberStyles.indexRow}>
              <span style={emberStyles.indexN}>{s.n}</span>
              <span style={emberStyles.indexLbl}>{s.label}</span>
              <span style={emberStyles.indexDots}>· · · · · · · · · · · · · · · · · · · · · · · · · · · · · ·</span>
            </div>
          ))}
        </div>
      </nav>

      {/* WHAT'S NEW (sec 02) */}
      <SectionEm n="02" title="What's new this edition">
        <div style={emberStyles.newGrid}>
          {WHATS_NEW.map((w,i)=>(
            <div key={i} style={emberStyles.newCell}>
              <div style={emberStyles.newNum}>0{i+1}</div>
              <div style={emberStyles.newTitle}>{w.title}</div>
              <div style={emberStyles.newSub}>{w.sub}</div>
            </div>
          ))}
        </div>
      </SectionEm>

      {/* SCHEDULE (sec 03) */}
      <SectionEm n="03" title="Run of show" subtitle="Saturday, two until eight">
        <div style={emberStyles.schedTable}>
          {SCHEDULE.map((row,i)=>(
            <div key={i} style={emberStyles.schedRow}>
              <div style={emberStyles.schedTime}>{row.t}</div>
              <div style={emberStyles.schedLabel}>{row.label}</div>
              <div style={emberStyles.schedSub}>{row.sub}</div>
            </div>
          ))}
        </div>
      </SectionEm>

      {/* GAMES + PRIZES (sec 04) */}
      <SectionEm n="04" title="Games & prizes">
        <div style={emberStyles.gamesGrid}>
          {GAMES.map(g=>(
            <div key={g.name} style={emberStyles.gameTile}>
              <div style={emberStyles.gameTag}>{g.tag}</div>
              <div style={emberStyles.gameName}>{g.name}</div>
            </div>
          ))}
        </div>
        <div style={emberStyles.prizeBlock}>
          <div style={emberStyles.prizeBlockHead}>The Three Crowns</div>
          <div style={emberStyles.prizeGrid}>
            {PRIZES.map((p,i)=>(
              <div key={i} style={emberStyles.prizeCell}>
                <div style={emberStyles.prizeN}>0{i+1}</div>
                <div style={emberStyles.prizeName}>{p.name}</div>
                <div style={emberStyles.prizeDesc}>{p.desc}</div>
              </div>
            ))}
          </div>
          <div style={emberStyles.prizeFooter}>
            Winners receive: {PRIZE_REWARDS.map(r=>r.name).join(' · ')}
          </div>
        </div>
      </SectionEm>

      {/* SAUCE BATTLE (sec 05) — heat slider */}
      <SectionEm n="05" title="The sauce battle" subtitle="Choose your battle. Choose wisely.">
        <div style={emberStyles.sauceWrap}>
          <div style={emberStyles.sauceLeft}>
            <div style={emberStyles.sauceLabel}>YOUR HEAT LEVEL</div>
            <div style={{...emberStyles.sauceValue, color:heatColor}}>{heatLabel}</div>
            <div style={emberStyles.sauceSub}>
              {heat<=2 && 'Mellow. Honey-glaze, smoked paprika.'}
              {heat===3 && 'Akabanga ginger glaze. Respect-tier.'}
              {heat===4 && 'Pili pili reduction. You will feel it.'}
              {heat===5 && 'Carolina reaper habanero. No survivors.'}
            </div>
            <input type="range" min="1" max="5" value={heat} onChange={e=>setHeat(+e.target.value)}
              style={{...emberStyles.sauceSlider, accentColor:heatColor}} />
            <div style={emberStyles.sauceScale}>
              <span>mild</span><span>warm</span><span>spicy</span><span>heat</span><span>inferno</span>
            </div>
          </div>
          <div style={emberStyles.sauceRight}>
            <div style={{...emberStyles.sauceFlame, background:`radial-gradient(ellipse at 50% 80%, ${heatColor} 0%, rgba(0,0,0,0) 65%)`}}>
              <div style={emberStyles.sauceFlameInner}>{heat}</div>
              <div style={emberStyles.sauceFlameOf}>OUT OF 5</div>
            </div>
          </div>
        </div>
      </SectionEm>

      {/* LAST EDITION — carousel (sec 06) */}
      <SectionEm n="06" title="Last edition" subtitle="A few moments from the first fire">
        <div style={emberStyles.carouselWrap}>
          <img src={GALLERY[carouselIdx].src} alt={GALLERY[carouselIdx].caption} style={emberStyles.carouselImg} />
          <div style={emberStyles.carouselCap}>{GALLERY[carouselIdx].caption}</div>
          <div style={emberStyles.carouselNav}>
            <button style={emberStyles.carBtn} onClick={()=>setCarouselIdx((carouselIdx-1+GALLERY.length)%GALLERY.length)}>←</button>
            <span style={emberStyles.carouselCount}>{String(carouselIdx+1).padStart(2,'0')} / {String(GALLERY.length).padStart(2,'0')}</span>
            <button style={emberStyles.carBtn} onClick={()=>setCarouselIdx((carouselIdx+1)%GALLERY.length)}>→</button>
          </div>
        </div>
        <div style={emberStyles.thumbStrip}>
          {GALLERY.map((g,i)=>(
            <button key={i} onClick={()=>setCarouselIdx(i)}
              style={{...emberStyles.thumb, opacity: i===carouselIdx ? 1 : 0.4, outline: i===carouselIdx ? '2px solid #e63946' : 'none'}}>
              <img src={g.src} alt="" style={emberStyles.thumbImg} />
            </button>
          ))}
        </div>
      </SectionEm>

      {/* TESTIMONIALS (sec 07) */}
      <SectionEm n="07" title="Voices from edition one">
        <div style={emberStyles.voiceGrid}>
          {TESTIMONIALS.map((t,i)=>(
            <div key={i} style={emberStyles.voiceCell}>
              <div style={emberStyles.voiceQuote}>“{t.quote}”</div>
              <div style={emberStyles.voiceWho}>
                <span style={emberStyles.voiceName}>{t.name}</span>
                <span style={emberStyles.voiceHandle}>{t.handle}</span>
              </div>
            </div>
          ))}
        </div>
      </SectionEm>

      {/* HOSTS (sec 08) */}
      <SectionEm n="08" title="Your hosts">
        <div style={emberStyles.hostsGrid}>
          {HOSTS.map((h,i)=>(
            <div key={i} style={emberStyles.hostCell}>
              <div style={emberStyles.hostInitials}>{h.name.split(' ').map(p=>p[0]).join('')}</div>
              <div>
                <div style={emberStyles.hostName}>{h.name}</div>
                <div style={emberStyles.hostRole}>{h.role}</div>
                <div style={emberStyles.hostTag}>{h.tag}</div>
              </div>
            </div>
          ))}
        </div>
      </SectionEm>

      {/* TICKETS / RSVP (sec 09) */}
      <SectionEm n="09" title="Reserve your seat" subtitle="Four tiers · pick one">
        <div style={emberStyles.tierGrid}>
          {TIERS.map(t=>(
            <button key={t.id} onClick={()=>setSelectedTier(t.id)}
              style={{
                ...emberStyles.tierCard,
                ...(selectedTier===t.id ? emberStyles.tierCardActive : {})
              }}>
              {t.badge && <span style={emberStyles.tierBadge}>{t.badge}</span>}
              <div style={emberStyles.tierName}>{t.name}</div>
              <div style={emberStyles.tierPrice}>{t.price.toLocaleString()} <span style={emberStyles.tierRwf}>RWF</span></div>
              <div style={emberStyles.tierSub}>{t.sub}</div>
              {t.stock != null && <div style={emberStyles.tierStock}>{t.stock} remaining</div>}
            </button>
          ))}
        </div>
        <div style={emberStyles.qtyRow}>
          {tier.id !== 'duo' && (
            <div style={emberStyles.qtyBox}>
              <span style={emberStyles.qtyLbl}>QUANTITY</span>
              <button style={emberStyles.qtyBtn} onClick={()=>setQty(Math.max(1,qty-1))}>−</button>
              <span style={emberStyles.qtyVal}>{qty}</span>
              <button style={emberStyles.qtyBtn} onClick={()=>setQty(Math.min(10,qty+1))}>+</button>
            </div>
          )}
          <div style={emberStyles.totalBox}>
            <span style={emberStyles.totalLbl}>TOTAL</span>
            <span style={emberStyles.totalVal}>{total.toLocaleString()} RWF</span>
          </div>
          <button style={emberStyles.checkoutBtn} onClick={()=>setCheckoutOpen(true)}>
            Continue to checkout →
          </button>
        </div>
      </SectionEm>

      {/* BBQ QUIZ */}
      <SectionEm n="—" title="Backyard test" subtitle="Five questions. No cheating.">
        <div style={emberStyles.quizCard}>
          {!quizDone ? (
            <>
              <div style={emberStyles.quizProg}>Question {quizIdx+1} of {QUIZ.length} · Score {quizScore}</div>
              <div style={emberStyles.quizQ}>{QUIZ[quizIdx].q}</div>
              <div style={emberStyles.quizOpts}>
                {QUIZ[quizIdx].options.map((opt,i)=>{
                  const picked = quizChoice === i;
                  const correct = QUIZ[quizIdx].answer === i;
                  const showResult = quizChoice != null;
                  return (
                    <button key={i} disabled={showResult} onClick={()=>setQuizChoice(i)}
                      style={{
                        ...emberStyles.quizOpt,
                        ...(showResult && correct ? emberStyles.quizOptCorrect : {}),
                        ...(showResult && picked && !correct ? emberStyles.quizOptWrong : {}),
                      }}>
                      <span style={emberStyles.quizOptLetter}>{String.fromCharCode(65+i)}</span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
              {quizChoice != null && (
                <div style={emberStyles.quizFact}>
                  <strong style={{color: quizChoice===QUIZ[quizIdx].answer ? '#16a34a' : '#dc2626'}}>
                    {quizChoice===QUIZ[quizIdx].answer ? 'Correct.' : 'Not quite.'}
                  </strong> {QUIZ[quizIdx].fact}
                  <button style={emberStyles.quizNext} onClick={()=>{
                    const right = quizChoice === QUIZ[quizIdx].answer;
                    if (quizIdx === QUIZ.length-1) { setQuizScore(s=>s+(right?1:0)); setQuizDone(true); }
                    else { setQuizScore(s=>s+(right?1:0)); setQuizIdx(quizIdx+1); setQuizChoice(null); }
                  }}>{quizIdx===QUIZ.length-1 ? 'See result' : 'Next →'}</button>
                </div>
              )}
            </>
          ) : (
            <div style={emberStyles.quizResult}>
              <div style={emberStyles.quizResultScore}>{quizScore} / {QUIZ.length}</div>
              <div style={emberStyles.quizResultLbl}>
                {quizScore===5 && 'Pitmaster. Bring the tongs.'}
                {quizScore===4 && 'Strong show. You\'re manning a grill.'}
                {quizScore===3 && 'Decent. Stand near Collins.'}
                {quizScore<3 && 'Come for the food, leave with a degree.'}
              </div>
              <button style={emberStyles.quizReset} onClick={()=>{setQuizIdx(0);setQuizChoice(null);setQuizScore(0);setQuizDone(false);}}>Play again</button>
            </div>
          )}
        </div>
      </SectionEm>

      {/* FAQ (sec 10) */}
      <SectionEm n="10" title="Details" subtitle="Frequently asked, plainly answered">
        <div style={emberStyles.faqList}>
          {FAQ.map((f,i)=>(
            <div key={i} style={emberStyles.faqRow}>
              <button style={emberStyles.faqBtn} onClick={()=>setOpenFaq(openFaq===i?-1:i)}>
                <span style={emberStyles.faqN}>0{i+1}</span>
                <span style={emberStyles.faqQ}>{f.q}</span>
                <span style={emberStyles.faqToggle}>{openFaq===i?'−':'+'}</span>
              </button>
              {openFaq===i && <div style={emberStyles.faqA}>{f.a}</div>}
            </div>
          ))}
        </div>
      </SectionEm>

      {/* MAP */}
      <SectionEm n="—" title="Getting there">
        <div style={emberStyles.mapCard}>
          <div style={emberStyles.mapSvg}>
            <svg viewBox="0 0 400 220" style={{width:'100%',height:'100%'}}>
              <defs>
                <pattern id="emb-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(120,113,108,0.2)" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="400" height="220" fill="#f5f0e8"/>
              <rect width="400" height="220" fill="url(#emb-grid)"/>
              <path d="M 0 140 Q 100 80 200 110 T 400 90" stroke="#a8a29e" strokeWidth="2" fill="none" strokeDasharray="6 4"/>
              <path d="M 50 200 L 380 160" stroke="#78716c" strokeWidth="3" fill="none"/>
              <text x="20" y="40" fill="#78716c" fontFamily="Barlow Condensed" fontSize="11" letterSpacing="2">MT KIGALI</text>
              <text x="280" y="200" fill="#78716c" fontFamily="Barlow Condensed" fontSize="11" letterSpacing="2">KIMIHURURA</text>
              <g transform="translate(220,110)">
                <circle r="20" fill="#e63946" opacity="0.2"/>
                <circle r="10" fill="#e63946"/>
                <path d="M 0 -20 L 0 -30" stroke="#e63946" strokeWidth="2"/>
                <text y="-38" textAnchor="middle" fontFamily="Fraunces" fontSize="14" fontWeight="700" fill="#1c1917">Fazenda Zenga</text>
              </g>
            </svg>
          </div>
          <div style={emberStyles.mapInfo}>
            <div style={emberStyles.mapKey}>LOCATION</div>
            <div style={emberStyles.mapVal}>Fazenda Zenga · Mt Kigali pine forest</div>
            <div style={emberStyles.mapKey} style={{...emberStyles.mapKey, marginTop:16}}>WHEN</div>
            <div style={emberStyles.mapVal}>30 May 2026 · 2pm</div>
            <a href={EVENT.mapsUrl} target="_blank" rel="noopener noreferrer" style={emberStyles.mapLink}>Open in maps →</a>
          </div>
        </div>
      </SectionEm>

      {/* SPONSORS */}
      <div style={emberStyles.sponsorStrip}>
        <div style={emberStyles.sponsorHead}>With thanks to</div>
        <div style={emberStyles.sponsorRow}>
          {SPONSORS.map((s,i)=>(
            <div key={i} style={emberStyles.sponsorCell}>
              <div style={emberStyles.sponsorName}>{s.name}</div>
              <div style={emberStyles.sponsorKind}>{s.kind}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer style={emberStyles.footer}>
        <div style={emberStyles.footerRule}/>
        <div style={emberStyles.footerRow}>
          <span style={emberStyles.footerTitle}>FIRE &amp; SMOKE</span>
          <span style={emberStyles.footerSub}>{EVENT.ig} · {EVENT.whatsapp}</span>
        </div>
        <div style={emberStyles.footerTagline}>{EVENT.tagline}</div>
      </footer>

      {/* STICKY MOBILE BAR */}
      <div style={emberStyles.stickyBar}>
        <div>
          <div style={emberStyles.stickyKey}>FROM</div>
          <div style={emberStyles.stickyVal}>15,000 RWF</div>
        </div>
        <button style={emberStyles.stickyBtn} onClick={()=>setCheckoutOpen(true)}>Reserve →</button>
      </div>

      {/* CHECKOUT MODAL */}
      {checkoutOpen && <EmberCheckout tier={tier} qty={qty} total={total} onClose={()=>setCheckoutOpen(false)} />}
    </div>
  );
}

function SectionEm({ n, title, subtitle, children }) {
  return (
    <section style={emberStyles.section}>
      <div style={emberStyles.sectionHead}>
        <span style={emberStyles.sectionN}>{n}</span>
        <div style={emberStyles.sectionTitleWrap}>
          <h2 style={emberStyles.sectionTitle}>{title}</h2>
          {subtitle && <div style={emberStyles.sectionSub}>{subtitle}</div>}
        </div>
        <div style={emberStyles.sectionRule}/>
      </div>
      {children}
    </section>
  );
}

function EmberCheckout({ tier, qty, total, onClose }) {
  const [step, setStep] = React.useState(1);
  const [form, setForm] = React.useState({ name:'', email:'', phone:'', friend:'' });
  const [paying, setPaying] = React.useState(false);
  const ref = 'FS' + Math.floor(100000+Math.random()*900000);

  const submit = () => {
    setPaying(true);
    setTimeout(()=>{ setPaying(false); setStep(3); }, 1600);
  };

  return (
    <div style={emberStyles.modalOverlay} onClick={onClose}>
      <div style={emberStyles.modal} onClick={e=>e.stopPropagation()}>
        <button style={emberStyles.modalClose} onClick={onClose}>×</button>

        {step !== 3 && (
          <div style={emberStyles.modalSteps}>
            <span style={{...emberStyles.modalStepDot, ...(step>=1?emberStyles.modalStepActive:{})}}>1 Details</span>
            <span style={emberStyles.modalStepArrow}>—</span>
            <span style={{...emberStyles.modalStepDot, ...(step>=2?emberStyles.modalStepActive:{})}}>2 Payment</span>
            <span style={emberStyles.modalStepArrow}>—</span>
            <span style={{...emberStyles.modalStepDot, ...(step>=3?emberStyles.modalStepActive:{})}}>3 Done</span>
          </div>
        )}

        {step===1 && (
          <>
            <div style={emberStyles.modalEyebrow}>Reservation</div>
            <h3 style={emberStyles.modalTitle}>Tell us who's coming</h3>
            <div style={emberStyles.modalSummary}>
              <span>{tier.name}{tier.id!=='duo' && qty>1 && ` × ${qty}`}</span>
              <span>{total.toLocaleString()} RWF</span>
            </div>
            <div style={emberStyles.modalForm}>
              <label style={emberStyles.modalLbl}>Your name
                <input style={emberStyles.modalInput} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Full name"/>
              </label>
              <label style={emberStyles.modalLbl}>Email
                <input style={emberStyles.modalInput} value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@email.com"/>
              </label>
              <label style={emberStyles.modalLbl}>Phone
                <input style={emberStyles.modalInput} value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+250 …"/>
              </label>
              {tier.id==='duo' && (
                <label style={emberStyles.modalLbl}>Friend's name
                  <input style={emberStyles.modalInput} value={form.friend} onChange={e=>setForm({...form,friend:e.target.value})} placeholder="Who you bringing?"/>
                </label>
              )}
            </div>
            <button style={emberStyles.modalNext} onClick={()=>setStep(2)} disabled={!form.name || !form.email}>
              Continue to payment →
            </button>
          </>
        )}

        {step===2 && (
          <>
            <div style={emberStyles.modalEyebrow}>Payment</div>
            <h3 style={emberStyles.modalTitle}>Pay {total.toLocaleString()} RWF</h3>
            <div style={emberStyles.flutter}>
              <div style={emberStyles.flutterHead}>
                <span style={emberStyles.flutterLogo}>flutterwave</span>
                <span style={emberStyles.flutterSecure}>🔒 SSL secured</span>
              </div>
              <div style={emberStyles.flutterTabs}>
                <button style={{...emberStyles.flutterTab, ...emberStyles.flutterTabActive}}>Card</button>
                <button style={emberStyles.flutterTab}>MoMo MTN</button>
                <button style={emberStyles.flutterTab}>Airtel Money</button>
              </div>
              <div style={emberStyles.flutterFields}>
                <input style={emberStyles.flutterInput} placeholder="Card number" defaultValue="4242 4242 4242 4242"/>
                <div style={emberStyles.flutterSplit}>
                  <input style={emberStyles.flutterInput} placeholder="MM / YY" defaultValue="05/27"/>
                  <input style={emberStyles.flutterInput} placeholder="CVV" defaultValue="123"/>
                </div>
              </div>
              <button style={emberStyles.flutterPay} onClick={submit} disabled={paying}>
                {paying ? 'Processing…' : `Pay ${total.toLocaleString()} RWF`}
              </button>
            </div>
            <button style={emberStyles.modalBack} onClick={()=>setStep(1)}>← back</button>
          </>
        )}

        {step===3 && (
          <div style={emberStyles.successWrap}>
            <div style={emberStyles.successCheck}>✓</div>
            <div style={emberStyles.modalEyebrow}>You're in</div>
            <h3 style={emberStyles.modalTitle}>See you in the pines.</h3>
            <div style={emberStyles.passCard}>
              <div style={emberStyles.passLeft}>
                <div style={emberStyles.passKey}>NAME</div>
                <div style={emberStyles.passVal}>{form.name}</div>
                <div style={emberStyles.passKey}>TIER</div>
                <div style={emberStyles.passVal}>{tier.name}</div>
                <div style={emberStyles.passKey}>REF</div>
                <div style={emberStyles.passVal}>{ref}</div>
              </div>
              <div style={emberStyles.passQR}>
                <div style={emberStyles.qrGrid}>
                  {Array.from({length:64}).map((_,i)=>(<div key={i} style={{background: Math.random()>0.5?'#1c1917':'transparent'}}/>))}
                </div>
                <div style={emberStyles.qrLbl}>SCAN AT GATE</div>
              </div>
            </div>
            <button style={emberStyles.successClose} onClick={onClose}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}

const cream  = '#f7f1e3';
const paper  = '#fbf6ea';
const ink    = '#1c1917';
const dim    = '#78716c';
const accent = '#e63946';
const gold   = '#c89b3c';

const serif = "'Fraunces', Georgia, serif";
const sans  = "'Barlow Condensed', 'Oswald', system-ui, sans-serif";

const emberStyles = {
  page: { background: paper, color: ink, fontFamily: sans, paddingBottom: 80, minHeight: '100vh' },
  masthead: { padding: '14px 20px 0' },
  mastRow: { display:'flex', justifyContent:'space-between', alignItems:'baseline', gap: 12 },
  mastEdition: { fontFamily: sans, fontSize: 10, letterSpacing: 2.5, color: dim, fontWeight: 500 },
  mastTitle: { fontFamily: serif, fontSize: 16, fontWeight: 900, letterSpacing: 1, color: ink },
  mastRule: { height: 1, background: ink, marginTop: 10 },

  hero: { padding: '0' },
  heroImageWrap: { position:'relative', width:'100%', aspectRatio:'4/3', overflow:'hidden' },
  heroImg: { width:'100%', height:'100%', objectFit:'cover', filter:'contrast(1.05) saturate(0.95)' },
  heroVignette: { position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(28,25,23,0.1) 0%, rgba(28,25,23,0) 30%, rgba(28,25,23,0) 60%, rgba(28,25,23,0.4) 100%)' },
  heroEditionTag: { position:'absolute', bottom:16, left:20, fontFamily: sans, fontSize:11, letterSpacing:3, color:'#fff', textTransform:'uppercase', fontWeight:700, padding:'8px 12px', background:'rgba(28,25,23,0.6)', backdropFilter:'blur(4px)' },

  heroBody: { padding: '24px 20px 8px' },
  heroEyebrow: { fontFamily: sans, fontSize: 11, letterSpacing: 3, color: dim, textTransform:'uppercase', fontWeight: 600, marginBottom: 12 },
  heroH1: { fontFamily: serif, fontSize: 'clamp(38px, 11vw, 64px)', lineHeight: 0.98, fontWeight: 900, margin: 0, letterSpacing: -1.5 },
  heroEm: { fontStyle:'italic', fontWeight: 300, color: accent },
  heroLede: { fontFamily: serif, fontSize: 16, lineHeight: 1.55, color: '#3f3a36', marginTop: 18, fontWeight: 400 },

  heroMetaGrid: { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap: 0, marginTop: 24, borderTop:`1px solid ${ink}`, borderBottom:`1px solid ${ink}` },
  heroMetaCell: { padding: '12px 8px', borderRight: `1px solid ${ink}` },
  heroMetaKey: { fontFamily: sans, fontSize: 9, letterSpacing: 2, color: dim, fontWeight: 600 },
  heroMetaVal: { fontFamily: serif, fontSize: 17, fontWeight: 700, color: ink, marginTop: 4, lineHeight: 1.1 },
  heroMetaSub: { fontFamily: sans, fontSize: 11, color: dim, marginTop: 2, letterSpacing: 0.5 },

  countdownStrip: { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap: 6, marginTop: 24 },
  countdownCell: { background: ink, color: cream, padding: '14px 8px', textAlign:'center' },
  countdownVal: { fontFamily: serif, fontSize: 32, fontWeight: 900, lineHeight: 1, letterSpacing: -1 },
  countdownLbl: { fontFamily: sans, fontSize: 10, letterSpacing: 2.5, marginTop: 4, color: '#a8a29e' },

  heroCTA: { width:'100%', marginTop: 22, padding:'18px 16px', background: accent, color: '#fff', border:'none',
            display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer',
            fontFamily: sans, fontSize: 16, fontWeight: 700, letterSpacing: 2, textTransform:'uppercase' },
  heroCTAArrow: { fontFamily: serif, fontSize: 24, fontWeight: 300 },
  heroCTASub: { fontFamily: sans, fontSize: 11, color: dim, textAlign:'center', marginTop: 8, letterSpacing: 0.5 },

  indexBlock: { padding: '40px 20px 8px', borderTop:`1px solid ${ink}`, marginTop: 32 },
  indexHead: { fontFamily: sans, fontSize: 10, letterSpacing: 3, color: dim, textTransform:'uppercase', fontWeight: 600, marginBottom: 14 },
  indexGrid: { display:'flex', flexDirection:'column', gap: 8 },
  indexRow: { display:'flex', alignItems:'baseline', gap: 8, overflow:'hidden' },
  indexN: { fontFamily: serif, fontSize: 13, fontWeight: 700, color: accent, fontVariantNumeric:'tabular-nums' },
  indexLbl: { fontFamily: serif, fontSize: 16, fontWeight: 500, color: ink, flexShrink: 0 },
  indexDots: { fontFamily: sans, fontSize: 12, color: dim, overflow:'hidden', flex:1, whiteSpace:'nowrap' },

  section: { padding: '48px 20px 8px' },
  sectionHead: { marginBottom: 24 },
  sectionN: { fontFamily: serif, fontSize: 13, fontWeight: 700, color: accent, display:'inline-block', marginBottom: 8 },
  sectionTitleWrap: {},
  sectionTitle: { fontFamily: serif, fontSize: 'clamp(32px, 9vw, 48px)', fontWeight: 900, letterSpacing: -1.2, margin: 0, lineHeight: 1 },
  sectionSub: { fontFamily: serif, fontStyle:'italic', fontSize: 17, color: dim, marginTop: 8, fontWeight: 400 },
  sectionRule: { height: 1, background: ink, marginTop: 16 },

  newGrid: { display:'flex', flexDirection:'column', gap: 0 },
  newCell: { padding: '20px 0', borderBottom: `1px solid rgba(28,25,23,0.15)`, display:'grid', gridTemplateColumns:'40px 1fr', gap: 12, alignItems:'baseline' },
  newNum: { fontFamily: serif, fontSize: 14, fontWeight: 700, color: accent, fontVariantNumeric:'tabular-nums' },
  newTitle: { fontFamily: serif, fontSize: 22, fontWeight: 700, lineHeight: 1.15, gridColumn: 2 },
  newSub: { fontFamily: serif, fontSize: 15, color: dim, lineHeight: 1.5, marginTop: 4, gridColumn: 2 },

  schedTable: { display:'flex', flexDirection:'column' },
  schedRow: { display:'grid', gridTemplateColumns:'60px 1fr', gap: 12, padding: '14px 0', borderBottom: `1px solid rgba(28,25,23,0.12)`, alignItems:'baseline' },
  schedTime: { fontFamily: serif, fontSize: 20, fontWeight: 700, color: accent, fontVariantNumeric:'tabular-nums', letterSpacing:-1 },
  schedLabel: { fontFamily: serif, fontSize: 18, fontWeight: 600, color: ink, lineHeight: 1.2 },
  schedSub: { fontFamily: serif, fontSize: 14, color: dim, marginTop: 2, gridColumn: 2, lineHeight: 1.4 },

  gamesGrid: { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap: 8 },
  gameTile: { background: cream, border: `1px solid ${ink}`, padding: '14px 10px', textAlign:'center' },
  gameTag: { fontFamily: sans, fontSize: 9, letterSpacing: 2, color: accent, fontWeight: 700 },
  gameName: { fontFamily: serif, fontSize: 15, fontWeight: 700, marginTop: 4, lineHeight: 1.1 },

  prizeBlock: { marginTop: 28, padding: 18, background: ink, color: cream },
  prizeBlockHead: { fontFamily: sans, fontSize: 11, letterSpacing: 3, color: gold, fontWeight: 700, textAlign:'center', textTransform:'uppercase' },
  prizeGrid: { display:'grid', gridTemplateColumns:'1fr', gap: 16, marginTop: 16 },
  prizeCell: { padding: '14px 0', borderTop: '1px solid rgba(247,241,227,0.15)' },
  prizeN: { fontFamily: serif, fontSize: 13, fontWeight: 700, color: gold },
  prizeName: { fontFamily: serif, fontSize: 20, fontWeight: 800, marginTop: 4 },
  prizeDesc: { fontFamily: serif, fontStyle:'italic', fontSize: 14, color: '#d6cfc1', marginTop: 2 },
  prizeFooter: { fontFamily: sans, fontSize: 11, letterSpacing: 1.5, color: gold, textAlign:'center', marginTop: 16, textTransform:'uppercase' },

  sauceWrap: { display:'grid', gridTemplateColumns:'1fr', gap: 24, padding: 18, background: cream, border:`1px solid ${ink}` },
  sauceLeft: {},
  sauceLabel: { fontFamily: sans, fontSize: 10, letterSpacing: 3, color: dim, fontWeight: 600 },
  sauceValue: { fontFamily: serif, fontSize: 56, fontWeight: 900, lineHeight: 1, letterSpacing: -2, marginTop: 6 },
  sauceSub: { fontFamily: serif, fontStyle:'italic', fontSize: 15, color: ink, marginTop: 8, lineHeight: 1.4 },
  sauceSlider: { width:'100%', marginTop: 20, height: 6 },
  sauceScale: { display:'flex', justifyContent:'space-between', marginTop: 8, fontFamily: sans, fontSize: 10, letterSpacing: 2, color: dim, textTransform:'uppercase' },
  sauceRight: { display:'flex', alignItems:'center', justifyContent:'center' },
  sauceFlame: { width: 160, height: 160, borderRadius: '50%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', transition:'background 0.3s' },
  sauceFlameInner: { fontFamily: serif, fontSize: 80, fontWeight: 900, color: ink, lineHeight: 1 },
  sauceFlameOf: { fontFamily: sans, fontSize: 10, letterSpacing: 3, color: ink, fontWeight: 600 },

  carouselWrap: { position:'relative' },
  carouselImg: { width:'100%', aspectRatio:'4/3', objectFit:'cover', display:'block' },
  carouselCap: { fontFamily: serif, fontStyle:'italic', fontSize: 14, color: dim, marginTop: 8, textAlign:'center' },
  carouselNav: { display:'flex', alignItems:'center', justifyContent:'center', gap: 16, marginTop: 12 },
  carBtn: { width:44, height:44, borderRadius:'50%', border:`1px solid ${ink}`, background:'transparent', fontFamily: serif, fontSize: 20, cursor:'pointer', color: ink },
  carouselCount: { fontFamily: sans, fontSize: 12, letterSpacing: 2, color: dim, fontVariantNumeric:'tabular-nums' },
  thumbStrip: { display:'flex', gap: 6, marginTop: 16, overflowX:'auto', paddingBottom: 4 },
  thumb: { flexShrink: 0, width: 60, height: 60, padding: 0, border: 'none', background:'transparent', cursor:'pointer' },
  thumbImg: { width:'100%', height:'100%', objectFit:'cover', display:'block' },

  voiceGrid: { display:'flex', flexDirection:'column', gap: 0 },
  voiceCell: { padding: '18px 0', borderBottom: `1px solid rgba(28,25,23,0.12)` },
  voiceQuote: { fontFamily: serif, fontSize: 17, lineHeight: 1.45, fontStyle:'italic', color: ink },
  voiceWho: { display:'flex', alignItems:'baseline', gap: 8, marginTop: 8 },
  voiceName: { fontFamily: serif, fontSize: 13, fontWeight: 700, color: ink },
  voiceHandle: { fontFamily: sans, fontSize: 11, letterSpacing: 1, color: dim },

  hostsGrid: { display:'flex', flexDirection:'column', gap: 16 },
  hostCell: { display:'grid', gridTemplateColumns:'56px 1fr', gap: 16, alignItems:'center', padding: '12px 0', borderBottom: `1px solid rgba(28,25,23,0.1)` },
  hostInitials: { width: 56, height: 56, borderRadius:'50%', background: ink, color: cream, display:'flex', alignItems:'center', justifyContent:'center', fontFamily: serif, fontSize: 18, fontWeight: 700 },
  hostName: { fontFamily: serif, fontSize: 18, fontWeight: 700, lineHeight: 1.1 },
  hostRole: { fontFamily: sans, fontSize: 11, letterSpacing: 2, color: accent, fontWeight: 600, marginTop: 2 },
  hostTag: { fontFamily: serif, fontStyle:'italic', fontSize: 13, color: dim, marginTop: 4 },

  tierGrid: { display:'flex', flexDirection:'column', gap: 10 },
  tierCard: { textAlign:'left', position:'relative', padding: 18, background: cream, border: `1px solid ${ink}`, cursor:'pointer', display:'block' },
  tierCardActive: { background: ink, color: cream, transform:'scale(1.005)' },
  tierBadge: { position:'absolute', top:-1, right:-1, background: accent, color:'#fff', padding:'4px 10px', fontFamily: sans, fontSize: 9, letterSpacing: 2, fontWeight: 700 },
  tierName: { fontFamily: serif, fontSize: 22, fontWeight: 700 },
  tierPrice: { fontFamily: serif, fontSize: 36, fontWeight: 900, marginTop: 4, lineHeight: 1, letterSpacing: -1.5 },
  tierRwf: { fontFamily: sans, fontSize: 13, letterSpacing: 2, fontWeight: 600 },
  tierSub: { fontFamily: serif, fontStyle:'italic', fontSize: 13, opacity: 0.7, marginTop: 6, lineHeight: 1.3 },
  tierStock: { fontFamily: sans, fontSize: 10, letterSpacing: 2, color: accent, fontWeight: 700, marginTop: 8, textTransform:'uppercase' },

  qtyRow: { marginTop: 18, display:'flex', flexDirection:'column', gap: 10, padding: 16, background: cream, border:`1px solid ${ink}` },
  qtyBox: { display:'flex', alignItems:'center', gap: 10, justifyContent:'space-between' },
  qtyLbl: { fontFamily: sans, fontSize: 10, letterSpacing: 2, color: dim, fontWeight: 600 },
  qtyBtn: { width: 36, height: 36, border:`1px solid ${ink}`, background:'transparent', fontFamily: serif, fontSize: 18, cursor:'pointer' },
  qtyVal: { fontFamily: serif, fontSize: 22, fontWeight: 700, minWidth: 24, textAlign:'center' },
  totalBox: { display:'flex', justifyContent:'space-between', alignItems:'baseline', paddingTop: 10, borderTop: `1px solid ${ink}` },
  totalLbl: { fontFamily: sans, fontSize: 11, letterSpacing: 3, color: dim, fontWeight: 600 },
  totalVal: { fontFamily: serif, fontSize: 28, fontWeight: 900, letterSpacing: -1 },
  checkoutBtn: { background: accent, color:'#fff', padding:'16px', border:'none', fontFamily: sans, fontSize: 14, letterSpacing: 2.5, fontWeight: 700, cursor:'pointer', textTransform:'uppercase', marginTop: 4 },

  quizCard: { padding: 20, background: ink, color: cream, border: `1px solid ${ink}` },
  quizProg: { fontFamily: sans, fontSize: 10, letterSpacing: 3, color: gold, fontWeight: 600 },
  quizQ: { fontFamily: serif, fontSize: 22, fontWeight: 700, marginTop: 8, lineHeight: 1.2 },
  quizOpts: { display:'flex', flexDirection:'column', gap: 8, marginTop: 16 },
  quizOpt: { display:'flex', alignItems:'center', gap: 12, padding: '12px 14px', background:'transparent', border:`1px solid rgba(247,241,227,0.25)`, color: cream, cursor:'pointer', fontFamily: serif, fontSize: 15, textAlign:'left', width:'100%' },
  quizOptCorrect: { background:'rgba(22,163,74,0.2)', borderColor:'#16a34a', color:'#86efac' },
  quizOptWrong: { background:'rgba(220,38,38,0.2)', borderColor:'#dc2626', color:'#fca5a5' },
  quizOptLetter: { fontFamily: sans, fontSize: 11, letterSpacing: 2, fontWeight: 700, color: gold, minWidth: 20 },
  quizFact: { fontFamily: serif, fontSize: 14, color: '#d6cfc1', marginTop: 16, lineHeight: 1.5 },
  quizNext: { display:'block', marginTop: 14, background: gold, color: ink, border:'none', padding:'12px 18px', fontFamily: sans, fontSize: 12, letterSpacing: 2, fontWeight: 700, cursor:'pointer', textTransform:'uppercase' },
  quizResult: { textAlign:'center', padding: '20px 10px' },
  quizResultScore: { fontFamily: serif, fontSize: 80, fontWeight: 900, color: gold, lineHeight: 1, letterSpacing: -3 },
  quizResultLbl: { fontFamily: serif, fontStyle:'italic', fontSize: 17, color: cream, marginTop: 8 },
  quizReset: { marginTop: 16, background: 'transparent', border: `1px solid ${gold}`, color: gold, padding:'10px 16px', fontFamily: sans, fontSize: 11, letterSpacing: 2, fontWeight: 700, cursor:'pointer', textTransform:'uppercase' },

  faqList: { display:'flex', flexDirection:'column' },
  faqRow: { borderBottom: `1px solid rgba(28,25,23,0.15)` },
  faqBtn: { display:'flex', alignItems:'baseline', gap: 12, width:'100%', padding:'16px 0', background:'transparent', border:'none', textAlign:'left', cursor:'pointer' },
  faqN: { fontFamily: serif, fontSize: 13, fontWeight: 700, color: accent, fontVariantNumeric:'tabular-nums' },
  faqQ: { fontFamily: serif, fontSize: 17, fontWeight: 600, color: ink, flex: 1, lineHeight: 1.25 },
  faqToggle: { fontFamily: serif, fontSize: 22, color: dim, fontWeight: 300 },
  faqA: { fontFamily: serif, fontSize: 15, color: dim, lineHeight: 1.55, padding: '0 0 16px 28px' },

  mapCard: { background: cream, border:`1px solid ${ink}` },
  mapSvg: { width:'100%', aspectRatio:'2/1' },
  mapInfo: { padding: 18, borderTop: `1px solid ${ink}` },
  mapKey: { fontFamily: sans, fontSize: 10, letterSpacing: 2, color: dim, fontWeight: 600 },
  mapVal: { fontFamily: serif, fontSize: 17, fontWeight: 700, marginTop: 2, color: ink },
  mapLink: { fontFamily: sans, fontSize: 12, letterSpacing: 2, color: accent, fontWeight: 700, marginTop: 16, display:'inline-block', textDecoration:'none', textTransform:'uppercase' },

  sponsorStrip: { padding: '48px 20px 32px', textAlign:'center', borderTop: `1px solid rgba(28,25,23,0.15)`, marginTop: 48 },
  sponsorHead: { fontFamily: sans, fontSize: 10, letterSpacing: 3, color: dim, fontWeight: 600, textTransform:'uppercase' },
  sponsorRow: { display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap: 24, marginTop: 18 },
  sponsorCell: {},
  sponsorName: { fontFamily: serif, fontSize: 18, fontWeight: 700, fontStyle:'italic', color: ink },
  sponsorKind: { fontFamily: sans, fontSize: 10, letterSpacing: 2, color: dim, marginTop: 2 },

  footer: { padding: '20px 20px 100px' },
  footerRule: { height: 1, background: ink, marginBottom: 16 },
  footerRow: { display:'flex', justifyContent:'space-between', alignItems:'baseline' },
  footerTitle: { fontFamily: serif, fontSize: 16, fontWeight: 900, letterSpacing: 1 },
  footerSub: { fontFamily: sans, fontSize: 10, letterSpacing: 2, color: dim },
  footerTagline: { fontFamily: serif, fontStyle:'italic', fontSize: 13, color: dim, marginTop: 12 },

  stickyBar: { position:'fixed', bottom: 0, left: 0, right: 0, background: ink, color: cream, padding:'12px 16px', display:'flex', justifyContent:'space-between', alignItems:'center', zIndex: 50, borderTop:`1px solid ${ink}` },
  stickyKey: { fontFamily: sans, fontSize: 9, letterSpacing: 2, color: '#a8a29e', fontWeight: 600 },
  stickyVal: { fontFamily: serif, fontSize: 18, fontWeight: 800, lineHeight: 1.1 },
  stickyBtn: { background: accent, color:'#fff', border:'none', padding:'12px 20px', fontFamily: sans, fontSize: 12, letterSpacing: 2, fontWeight: 700, cursor:'pointer', textTransform:'uppercase' },

  // modal
  modalOverlay: { position:'fixed', inset:0, background:'rgba(28,25,23,0.85)', display:'flex', alignItems:'flex-end', justifyContent:'center', zIndex:100, padding:0, backdropFilter:'blur(4px)' },
  modal: { background: paper, width:'100%', maxWidth: 480, maxHeight: '95vh', overflowY:'auto', padding: 24, position:'relative', borderTop:`3px solid ${accent}` },
  modalClose: { position:'absolute', top:12, right:14, width:36, height:36, border:'none', background:'transparent', fontSize: 26, cursor:'pointer', color: ink, fontFamily: serif, lineHeight: 1 },
  modalSteps: { display:'flex', alignItems:'center', gap: 6, fontFamily: sans, fontSize: 10, letterSpacing: 2, color: dim, marginBottom: 16, fontWeight: 600 },
  modalStepDot: {},
  modalStepActive: { color: ink, fontWeight: 700 },
  modalStepArrow: { color: dim },
  modalEyebrow: { fontFamily: sans, fontSize: 10, letterSpacing: 3, color: accent, fontWeight: 700, textTransform:'uppercase' },
  modalTitle: { fontFamily: serif, fontSize: 28, fontWeight: 900, marginTop: 4, marginBottom: 16, letterSpacing: -1, lineHeight: 1.05 },
  modalSummary: { display:'flex', justifyContent:'space-between', padding: 14, background: cream, border:`1px solid ${ink}`, fontFamily: serif, fontSize: 15, fontWeight: 600 },
  modalForm: { display:'flex', flexDirection:'column', gap: 14, marginTop: 16 },
  modalLbl: { display:'flex', flexDirection:'column', gap: 6, fontFamily: sans, fontSize: 10, letterSpacing: 2, color: dim, fontWeight: 600 },
  modalInput: { padding: '12px 12px', border:`1px solid ${ink}`, background: cream, fontFamily: serif, fontSize: 15, color: ink, outline:'none' },
  modalNext: { width:'100%', marginTop: 18, background: accent, color:'#fff', border:'none', padding:'16px', fontFamily: sans, fontSize: 14, letterSpacing: 2, fontWeight: 700, cursor:'pointer', textTransform:'uppercase' },
  modalBack: { marginTop: 12, background:'transparent', border:'none', fontFamily: sans, fontSize: 11, letterSpacing: 2, color: dim, cursor:'pointer', textTransform:'uppercase' },

  flutter: { padding: 18, background:'#fff', border:`1px solid ${ink}`, marginTop: 10 },
  flutterHead: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 14 },
  flutterLogo: { fontFamily: serif, fontSize: 18, fontWeight: 900, color:'#f5a623', letterSpacing:-0.5 },
  flutterSecure: { fontFamily: sans, fontSize: 10, letterSpacing: 1, color: dim },
  flutterTabs: { display:'flex', gap: 6, marginBottom: 14 },
  flutterTab: { flex: 1, padding: '10px 6px', background: cream, border:`1px solid ${ink}`, fontFamily: sans, fontSize: 10, letterSpacing: 1.5, color: dim, cursor:'pointer', fontWeight: 600, textTransform:'uppercase' },
  flutterTabActive: { background: ink, color: cream },
  flutterFields: { display:'flex', flexDirection:'column', gap: 10 },
  flutterInput: { padding:'12px', border:`1px solid ${ink}`, background: cream, fontFamily: serif, fontSize: 15, outline:'none', width:'100%' },
  flutterSplit: { display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10 },
  flutterPay: { width:'100%', background: accent, color:'#fff', border:'none', padding:'16px', fontFamily: sans, fontSize: 13, letterSpacing: 2.5, fontWeight: 700, cursor:'pointer', marginTop: 16, textTransform:'uppercase' },

  successWrap: { textAlign:'center', padding: '10px 0' },
  successCheck: { width: 72, height: 72, borderRadius:'50%', background: '#dcfce7', color:'#16a34a', display:'flex', alignItems:'center', justifyContent:'center', fontSize: 40, margin:'0 auto 14px' },
  passCard: { display:'grid', gridTemplateColumns:'1fr auto', gap: 16, padding: 16, background: ink, color: cream, marginTop: 16, textAlign:'left' },
  passLeft: { display:'flex', flexDirection:'column', gap: 4 },
  passKey: { fontFamily: sans, fontSize: 9, letterSpacing: 2, color: '#a8a29e', fontWeight: 600, marginTop: 8 },
  passVal: { fontFamily: serif, fontSize: 14, fontWeight: 700, color: cream },
  passQR: { display:'flex', flexDirection:'column', alignItems:'center', gap: 6 },
  qrGrid: { width: 80, height: 80, background:'#fff', display:'grid', gridTemplateColumns:'repeat(8,1fr)', gridTemplateRows:'repeat(8,1fr)', padding: 4 },
  qrLbl: { fontFamily: sans, fontSize: 8, letterSpacing: 1.5, color: '#a8a29e', fontWeight: 600 },
  successClose: { marginTop: 18, width:'100%', background: ink, color: cream, border:'none', padding:'14px', fontFamily: sans, fontSize: 12, letterSpacing: 2, fontWeight: 700, cursor:'pointer', textTransform:'uppercase' },
};

const emberCSS = `
  @media (min-width: 720px) {
    [data-ember-sauce] { grid-template-columns: 1fr 200px !important; }
  }
`;

window.EmberSite = EmberSite;
