import { useState, useEffect } from 'react';
import { bookingService, Booking } from '../services/bookingService';
import { C, F } from '../tokens';
import * as staticData from '../data';
import { ToastContainer, useToast } from './Toast';

export function AdminDashboard() {
  const { toasts, toast, remove } = useToast();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'REJECTED'>('PENDING');
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const confirmedTicketsCount = bookings
    .filter(b => b.payment_status === 'CONFIRMED')
    .reduce((acc, b) => acc + b.quantity, 0);
  
  // Validator state
  const [ticketInput, setTicketInput] = useState('');
  const [validationResult, setValidationResult] = useState<{ success: boolean; msg: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'GUESTS' | 'LOGISTICS' | 'CMS'>('GUESTS');

  // CMS state
  const [cmsData, setCmsData] = useState<Record<string, any>>({
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
  });
  const [selectedCmsKey, setSelectedCmsKey] = useState<string>('EVENT');
  const [isSavingCms, setIsSavingCms] = useState(false);

  async function handleValidate() {
    if (!ticketInput) return;
    setValidationResult(null);
    setActionLoading('validate');
    try {
      const b = await bookingService.validateTicket(ticketInput);
      setValidationResult({ success: true, msg: `VALID: ${b.full_name} (${b.tier_id}) - Marked as USED.` });
      setTicketInput('');
      await loadBookings();
    } catch (err: any) {
      setValidationResult({ success: false, msg: err.message });
    } finally {
      setActionLoading(null);
    }
  }

  // Capacity state
  const [maxCapacity, setMaxCapacity] = useState(200);
  const [isUpdatingCapacity, setIsUpdatingCapacity] = useState(false);

  // Early Bird state
  const [ebActive, setEbActive] = useState(true);
  const [ebPrice, setEbPrice] = useState(15000);
  const [ebDeadline, setEbDeadline] = useState('2026-05-22');

  useEffect(() => {
    loadBookings();
    loadSettings();
    loadCms();
  }, []);

  async function loadCms() {
    try {
      const data = await bookingService.getAllCms();
      if (Object.keys(data).length > 0) {
        setCmsData(prev => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.error('Failed to load CMS data');
    }
  }


  async function handleSaveCms() {
    try {
      setIsSavingCms(true);
      const content = cmsData[selectedCmsKey];
      await bookingService.updateCms(selectedCmsKey, content);
      toast(`${selectedCmsKey} saved successfully.`, 'success');
    } catch (err: any) {
      toast(`Save failed: ${err.message}`, 'error');
    } finally {
      setIsSavingCms(false);
    }
  }

  function updateField(path: string[], value: any) {
    setCmsData(prev => {
      const newData = { ...prev };
      let current = newData[selectedCmsKey];
      
      // Navigate to the target object
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      
      // Update the value
      current[path[path.length - 1]] = value;
      return newData;
    });
  }

  const renderEditorFields = (data: any, path: string[] = []) => {
    if (typeof data === 'string') {
      const isLong = data.length > 50 || data.includes('\n');
      const isImage = path[path.length - 1]?.toLowerCase().includes('image') || 
                      path[path.length - 1]?.toLowerCase().includes('photo') ||
                      path[path.length - 1]?.toLowerCase().includes('url');

      return (
        <div style={{ marginBottom: 16 }}>
          {isImage && data && (
            <img src={data} alt="Preview" style={{ maxWidth: 100, height: 60, objectFit: 'cover', border: `1px solid ${C.border}`, marginBottom: 8, display: 'block' }} />
          )}
          {isLong ? (
            <textarea 
              value={data}
              onChange={e => updateField(path, e.target.value)}
              style={{ width: '100%', background: '#000', color: '#fff', border: `1px solid ${C.border}`, padding: 12, fontFamily: F.mono, fontSize: 13, minHeight: 100 }}
            />
          ) : (
            <input 
              type="text"
              value={data}
              onChange={e => updateField(path, e.target.value)}
              style={{ width: '100%', background: '#000', color: '#fff', border: `1px solid ${C.border}`, padding: 12, fontFamily: F.mono, fontSize: 13 }}
            />
          )}
        </div>
      );
    }

    if (typeof data === 'number') {
      return (
        <input 
          type="number"
          value={data}
          onChange={e => updateField(path, Number(e.target.value))}
          style={{ width: '100%', background: '#000', color: '#fff', border: `1px solid ${C.border}`, padding: 12, fontFamily: F.mono, fontSize: 13 }}
        />
      );
    }

    if (typeof data === 'boolean') {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <button 
            onClick={() => updateField(path, !data)}
            style={{ 
              background: data ? '#22c55e' : '#333', 
              color: '#fff', 
              border: 'none', 
              padding: '6px 12px', 
              fontFamily: F.heavy, 
              fontSize: 10, 
              cursor: 'pointer' 
            }}
          >
            {data ? 'TRUE' : 'FALSE'}
          </button>
        </div>
      );
    }

    if (Array.isArray(data)) {
      return (
        <div style={{ paddingLeft: 16, borderLeft: `2px solid ${C.border}` }}>
          {data.map((item, idx) => (
            <div key={idx} style={{ marginBottom: 24, padding: 16, background: 'rgba(255,255,255,0.02)', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' }}>
                <span style={{ fontSize: 10, color: C.yellow, fontFamily: F.mono }}>ITEM #{idx + 1}</span>
                <button 
                  onClick={() => {
                    const newList = [...data];
                    newList.splice(idx, 1);
                    updateField(path, newList);
                  }}
                  style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: 10, cursor: 'pointer', fontFamily: F.mono }}
                >
                  [REMOVE]
                </button>
              </div>
              {renderEditorFields(item, [...path, idx.toString()])}
            </div>
          ))}
          <button 
            onClick={() => {
              const newItem = typeof data[0] === 'object' ? { ...data[0] } : (typeof data[0] === 'string' ? '' : 0);
              // Clear strings/numbers in new object
              if (typeof newItem === 'object') {
                Object.keys(newItem).forEach(k => {
                  if (typeof newItem[k] === 'string') newItem[k] = '';
                });
              }
              updateField(path, [...data, newItem]);
            }}
            style={{ background: 'rgba(255,255,255,0.05)', color: C.yellow, border: `1px dashed ${C.yellow}`, padding: '12px', width: '100%', cursor: 'pointer', fontFamily: F.heavy, fontSize: 11 }}
          >
            + ADD NEW ITEM
          </button>
        </div>
      );
    }

    if (typeof data === 'object' && data !== null) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {Object.keys(data).map(key => (
            <div key={key}>
              <label style={{ display: 'block', fontSize: 11, color: C.dim, marginBottom: 6, fontFamily: F.mono, textTransform: 'uppercase' }}>{key}</label>
              {renderEditorFields(data[key], [...path, key])}
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  async function loadSettings() {
    try {
      const settings = await bookingService.getSettings();
      const cap = settings.find((s: any) => s.key === 'max_capacity');
      if (cap) setMaxCapacity(Number(cap.value));
      
      const active = settings.find((s: any) => s.key === 'early_bird_active');
      if (active) setEbActive(active.value === 'true');

      const price = settings.find((s: any) => s.key === 'early_bird_price');
      if (price) setEbPrice(Number(price.value));

      const deadline = settings.find((s: any) => s.key === 'early_bird_deadline');
      if (deadline) setEbDeadline(deadline.value);

    } catch (err) {
      console.error('Failed to load settings');
    }
  }

  async function handleUpdateSetting(key: string, val: string) {
    setActionLoading(`setting-${key}`);
    try {
      await bookingService.updateSetting(key, val);
      if (key === 'early_bird_active') setEbActive(val === 'true');
      if (key === 'early_bird_price') setEbPrice(Number(val));
      if (key === 'early_bird_deadline') setEbDeadline(val);
      toast(`${key.replace(/_/g, ' ')} updated.`, 'success');
    } catch (err) {
      toast(`Failed to update ${key}.`, 'error');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleUpdateCapacity(val: number) {
    setIsUpdatingCapacity(true);
    try {
      await bookingService.updateSetting('max_capacity', val.toString());
      setMaxCapacity(val);
      toast(`Max capacity set to ${val}.`, 'success');
    } catch (err) {
      toast('Failed to update capacity.', 'error');
    } finally {
      setIsUpdatingCapacity(false);
    }
  }


  async function loadBookings() {
    setLoading(true);
    try {
      const data = await bookingService.fetchBookings();
      setBookings(data);
    } catch (err) {
      console.error('Failed to load bookings', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm(id: string) {
    setActionLoading(id);
    try {
      await bookingService.confirmBooking(id);
      await loadBookings();
      toast('Booking confirmed. Ticket sent.', 'success');
    } catch (err) {
      toast('Failed to confirm booking.', 'error');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReject(id: string) {
    if (!window.confirm('Are you sure you want to reject this booking?')) return;
    setActionLoading(id);
    try {
      await bookingService.rejectBooking(id);
      await loadBookings();
      toast('Booking rejected.', 'info');
    } catch (err) {
      toast('Failed to reject booking.', 'error');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleResend(booking: Booking) {
    setActionLoading(`resend-${booking.id}`);
    try {
      await bookingService.resendTicket(booking);
      toast('Ticket email resent successfully.', 'success');
    } catch (err) {
      toast('Failed to resend email. Is the Edge Function deployed?', 'error');
    } finally {
      setActionLoading(null);
    }
  }

  const filtered = bookings.filter(b => {
    const matchesFilter = filter === 'ALL' || b.payment_status === filter;
    const matchesSearch = b.full_name.toLowerCase().includes(search.toLowerCase()) || 
                          b.email.toLowerCase().includes(search.toLowerCase()) ||
                          (b.momo_reference && b.momo_reference.includes(search));
    return matchesFilter && matchesSearch;
  });

  return (
    <>
    <ToastContainer toasts={toasts} remove={remove} />
    <div style={{ background: C.bg, minHeight: '100vh', padding: '40px 20px', color: C.text, fontFamily: F.mono }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, borderBottom: `2px solid ${C.yellow}`, paddingBottom: 20, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: F.display, fontSize: 'clamp(24px, 5vw, 40px)', color: C.yellow, margin: 0 }}>BOOKING_ADMIN</h1>
            <p style={{ color: C.dim, margin: '4px 0 0', fontSize: 14 }}>Manage RSVPs and Confirm Payments</p>
          </div>
          <button 
            onClick={() => activeTab === 'GUESTS' ? loadBookings() : activeTab === 'LOGISTICS' ? loadSettings() : loadCms()}
            disabled={loading}
            style={{ background: 'transparent', border: `1px solid ${C.yellow}`, color: C.yellow, padding: '8px 16px', cursor: 'pointer', fontFamily: F.heavy, fontSize: 12 }}
          >
            {loading ? '...' : 'REFRESH_DATA()'}
          </button>
        </header>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 32, borderBottom: `1px solid ${C.border}`, paddingBottom: 16 }}>
          {(['GUESTS', 'LOGISTICS', 'CMS'] as const).map(t => (
            <button 
              key={t}
              onClick={() => setActiveTab(t)}
              style={{ 
                padding: '12px 24px', 
                background: activeTab === t ? C.yellow : 'transparent', 
                color: activeTab === t ? C.bg : C.text,
                border: activeTab === t ? 'none' : `1px solid ${C.border}`,
                fontFamily: F.display,
                fontSize: 14,
                cursor: 'pointer',
                letterSpacing: 1
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {activeTab === 'LOGISTICS' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 32 }}>
            {/* Validator Panel */}
            <div style={{ background: '#111', border: `2px solid ${C.bg}`, padding: 24 }}>
              <h2 style={{ fontFamily: F.display, fontSize: 18, margin: '0 0 16px', color: C.dim }}>TICKET_VALIDATOR</h2>
              <div style={{ display: 'flex', gap: 8 }}>
                <input 
                  type="text" 
                  placeholder="Enter Ticket ID (e.g. EB-78...)" 
                  value={ticketInput}
                  onChange={e => setTicketInput(e.target.value.toUpperCase())}
                  style={{ flex: 1, background: '#000', border: `1px solid ${C.dim}`, color: '#fff', padding: '12px', fontFamily: F.mono, outline: 'none' }}
                />
                <button 
                  onClick={handleValidate}
                  disabled={!ticketInput || actionLoading === 'validate'}
                  style={{ background: C.yellow, color: C.bg, border: 'none', padding: '0 24px', fontFamily: F.heavy, cursor: 'pointer' }}
                >
                  {actionLoading === 'validate' ? '...' : 'CHECK'}
                </button>
              </div>
              {validationResult && (
                <div style={{ marginTop: 16, padding: 12, background: validationResult.success ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${validationResult.success ? '#22c55e' : '#ef4444'}` }}>
                  <div style={{ fontWeight: 700, color: validationResult.success ? '#22c55e' : '#ef4444' }}>{validationResult.msg}</div>
                </div>
              )}
            </div>

            {/* Logistics Panel */}
            <div style={{ background: '#111', border: `2px solid ${C.yellow}`, padding: 24 }}>
              <h2 style={{ fontFamily: F.display, fontSize: 18, margin: '0 0 16px', color: C.yellow }}>LOGISTICS_CAPACITY</h2>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 10, color: C.dim, marginBottom: 4 }}>TOTAL TICKETS SOLD</div>
                  <div style={{ fontSize: 32, fontFamily: F.display, color: confirmedTicketsCount >= maxCapacity ? C.pink : C.text }}>
                    {confirmedTicketsCount} <span style={{ fontSize: 14, color: C.dim }}>/ {maxCapacity}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 10, color: C.dim, marginBottom: 4 }}>SET MAX CAPACITY</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input 
                      type="number"
                      defaultValue={maxCapacity}
                      id="max-cap-input"
                      style={{ width: 80, background: '#000', border: `1px solid ${C.yellow}`, color: C.yellow, padding: '8px', fontFamily: F.mono, textAlign: 'center', fontSize: 18 }}
                    />
                    <button 
                      disabled={isUpdatingCapacity}
                      onClick={() => {
                        const val = (document.getElementById('max-cap-input') as HTMLInputElement).value;
                        handleUpdateCapacity(Number(val));
                      }}
                      style={{ background: C.yellow, color: C.bg, border: 'none', padding: '0 12px', fontFamily: F.heavy, fontSize: 11, cursor: 'pointer' }}
                    >
                      {isUpdatingCapacity ? '...' : 'SAVE'}
                    </button>
                  </div>
                </div>
              </div>
              <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ 
                  width: `${Math.min(100, (confirmedTicketsCount / maxCapacity) * 100)}%`, 
                  height: '100%', 
                  background: confirmedTicketsCount >= maxCapacity ? C.pink : C.yellow,
                  transition: 'width 0.5s ease'
                }} />
              </div>
              <p style={{ fontSize: 10, color: C.dim, marginTop: 12 }}>
                * When total sold reaches max capacity, the RSVP button on the landing page will be disabled.
              </p>
            </div>

            {/* Early Bird Panel */}
            <div style={{ background: '#111', border: `2px solid ${ebActive ? C.yellow : C.dim}`, padding: 24 }}>
              <h2 style={{ fontFamily: F.display, fontSize: 18, margin: '0 0 16px', color: ebActive ? C.yellow : C.dim }}>EARLY_BIRD_CONTROL</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Toggle */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>EB_TICKETS_ENABLED</span>
                  <button 
                    onClick={() => handleUpdateSetting('early_bird_active', ebActive ? 'false' : 'true')}
                    style={{ 
                      background: ebActive ? '#22c55e' : '#333', 
                      color: '#fff', 
                      border: 'none', 
                      padding: '8px 16px', 
                      fontFamily: F.heavy, 
                      fontSize: 11, 
                      cursor: 'pointer',
                      minWidth: 100
                    }}
                  >
                    {actionLoading === 'setting-early_bird_active' ? '...' : (ebActive ? 'ENABLED' : 'DISABLED')}
                  </button>
                </div>

                {/* Price */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>EB_PRICE (RWF)</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input 
                      type="number" 
                      defaultValue={ebPrice}
                      id="eb-price-input"
                      style={{ width: 80, background: '#000', border: `1px solid ${C.yellow}`, color: '#fff', padding: '6px', textAlign: 'center', fontFamily: F.mono }}
                    />
                    <button 
                      disabled={actionLoading === 'setting-early_bird_price'}
                      onClick={() => {
                        const val = (document.getElementById('eb-price-input') as HTMLInputElement).value;
                        handleUpdateSetting('early_bird_price', val);
                      }}
                      style={{ background: C.yellow, color: C.bg, border: 'none', padding: '0 10px', fontSize: 10, fontFamily: F.heavy, cursor: 'pointer' }}
                    >
                      {actionLoading === 'setting-early_bird_price' ? '...' : 'OK'}
                    </button>
                  </div>
                </div>

                {/* Deadline */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.dim }}>DEADLINE (e.g. May 22)</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input 
                      type="text" 
                      defaultValue={ebDeadline}
                      id="eb-deadline-input"
                      style={{ flex: 1, background: '#000', border: `1px solid ${C.yellow}`, color: '#fff', padding: '8px', fontFamily: F.mono }}
                    />
                    <button 
                      disabled={actionLoading === 'setting-early_bird_deadline'}
                      onClick={() => {
                        const val = (document.getElementById('eb-deadline-input') as HTMLInputElement).value;
                        handleUpdateSetting('early_bird_deadline', val);
                      }}
                      style={{ background: C.yellow, color: C.bg, border: 'none', padding: '0 10px', fontSize: 10, fontFamily: F.heavy, cursor: 'pointer' }}
                    >
                      {actionLoading === 'setting-early_bird_deadline' ? '...' : 'OK'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'CMS' && (
          <div style={{ background: '#111', border: `2px solid ${C.yellow}`, padding: 32 }}>
            <h2 style={{ fontFamily: F.display, fontSize: 24, margin: '0 0 24px', color: C.yellow }}>CONTENT_MANAGEMENT_SYSTEM</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: 32 }}>
              {/* Section List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {Object.keys(cmsData).sort().map(key => (
                  <button 
                    key={key}
                    onClick={() => setSelectedCmsKey(key)}
                    style={{ 
                      padding: '12px 16px', 
                      textAlign: 'left', 
                      background: selectedCmsKey === key ? C.yellow : 'rgba(255,255,255,0.05)', 
                      color: selectedCmsKey === key ? C.bg : C.text,
                      border: 'none',
                      fontFamily: F.mono,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      letterSpacing: 1
                    }}
                  >
                    {key}
                  </button>
                ))}
              </div>

              {/* Editor */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontFamily: F.mono, fontSize: 11, color: C.dim }}>SECTION: <span style={{ color: C.yellow }}>{selectedCmsKey}</span></div>
                  <button 
                    onClick={handleSaveCms}
                    disabled={isSavingCms}
                    style={{ background: C.yellow, color: C.bg, border: 'none', padding: '8px 24px', fontFamily: F.heavy, cursor: 'pointer', boxShadow: '0 4px 14px rgba(250, 204, 21, 0.3)' }}
                  >
                    {isSavingCms ? 'SAVING...' : 'PUBLISH_CHANGES'}
                  </button>
                </div>
                <div style={{ height: 600, overflowY: 'auto', paddingRight: 20, border: `1px solid rgba(255,255,255,0.05)`, background: 'rgba(0,0,0,0.2)', padding: 24 }}>
                  {cmsData[selectedCmsKey] ? renderEditorFields(cmsData[selectedCmsKey]) : <div style={{ color: C.dim }}>Select a section to edit.</div>}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'GUESTS' && (
          <>
            <div style={{ display: 'flex', gap: 20, marginBottom: 32, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: 300 }}>
                <input 
                  type="text" 
                  placeholder="Search name, email, or reference..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', background: C.panel, border: `1px solid ${C.border}`, color: C.text, fontFamily: F.mono, outline: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                {['ALL', 'PENDING', 'CONFIRMED', 'REJECTED'].map(f => (
                  <button 
                    key={f}
                    onClick={() => setFilter(f as any)}
                    style={{ 
                      padding: '8px 16px', 
                      background: filter === f ? C.yellow : C.panel, 
                      color: filter === f ? C.bg : C.text,
                      border: 'none',
                      fontFamily: F.heavy,
                      fontSize: 11,
                      cursor: 'pointer',
                      letterSpacing: 1
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: 100, color: C.yellow }}>LOADING_DATA...</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', background: C.panel, border: `1px solid ${C.border}` }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${C.border}`, textAlign: 'left' }}>
                      <th style={{ padding: 16, fontSize: 12, color: C.dim }}>DATE</th>
                      <th style={{ padding: 16, fontSize: 12, color: C.dim }}>GUEST</th>
                      <th style={{ padding: 16, fontSize: 12, color: C.dim }}>TIER</th>
                      <th style={{ padding: 16, fontSize: 12, color: C.dim }}>TOTAL</th>
                      <th style={{ padding: 16, fontSize: 12, color: C.dim }}>MOMO_REF</th>
                      <th style={{ padding: 16, fontSize: 12, color: C.dim }}>STATUS</th>
                      <th style={{ padding: 16, fontSize: 12, color: C.dim }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(b => (
                      <tr key={b.id} style={{ borderBottom: `1px solid ${C.border}`, transition: 'background 0.2s' }}>
                        <td style={{ padding: 16, fontSize: 13 }}>{new Date(b.created_at).toLocaleDateString()}</td>
                        <td style={{ padding: 16 }}>
                          <div style={{ fontWeight: 700, fontSize: 14 }}>{b.full_name}</div>
                          <div style={{ fontSize: 11, color: C.dim }}>{b.email}</div>
                          <div style={{ fontSize: 11, color: C.dim }}>{b.phone}</div>
                        </td>
                        <td style={{ padding: 16, fontSize: 13 }}>{b.tier_id.toUpperCase()} (x{b.quantity})</td>
                        <td style={{ padding: 16, fontSize: 14, fontWeight: 700 }}>{b.total_price.toLocaleString()}</td>
                        <td style={{ padding: 16, fontSize: 13, color: C.yellow }}>{b.momo_reference || '---'}</td>
                        <td style={{ padding: 16 }}>
                          <span style={{ 
                            padding: '4px 8px', 
                            fontSize: 10, 
                            fontWeight: 700, 
                            background: b.payment_status === 'CONFIRMED' ? 'rgba(34,197,94,0.2)' : b.payment_status === 'REJECTED' ? 'rgba(239,68,68,0.2)' : 'rgba(234,179,8,0.2)',
                            color: b.payment_status === 'CONFIRMED' ? '#4ade80' : b.payment_status === 'REJECTED' ? '#f87171' : '#facc15',
                            borderRadius: 4
                          }}>
                            {b.payment_status}
                          </span>
                          {b.ticket_number && (
                            <div style={{ fontSize: 10, marginTop: 4, color: C.dim }}>
                              TICKET: {b.ticket_number}
                              {b.used_at && (
                                <span style={{ color: C.pink, marginLeft: 8, fontWeight: 700 }}>[USED]</span>
                              )}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: 16 }}>
                          {b.payment_status === 'PENDING' && (
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button 
                                disabled={!!actionLoading}
                                onClick={() => handleConfirm(b.id)}
                                style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '6px 12px', cursor: 'pointer', fontSize: 11, fontWeight: 700 }}
                              >
                                {actionLoading === b.id ? '...' : 'CONFIRM'}
                              </button>
                              <button 
                                disabled={!!actionLoading}
                                onClick={() => handleReject(b.id)}
                                style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', cursor: 'pointer', fontSize: 11, fontWeight: 700 }}
                              >
                                {actionLoading === b.id ? '...' : 'REJECT'}
                              </button>
                            </div>
                          )}
                          {b.payment_status === 'CONFIRMED' && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <span style={{ color: C.dim, fontSize: 11 }}>Confirmed ✓</span>
                              <button 
                                disabled={actionLoading === `resend-${b.id}`}
                                onClick={() => handleResend(b)}
                                style={{ background: 'rgba(255,255,255,0.05)', color: C.yellow, border: `1px solid ${C.yellow}`, padding: '4px 8px', cursor: 'pointer', fontSize: 10, fontFamily: F.mono }}
                              >
                                {actionLoading === `resend-${b.id}` ? '...' : 'RESEND_EMAIL'}
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={7} style={{ padding: 40, textAlign: 'center', color: C.dim }}>No bookings found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
    </>
  );
}
