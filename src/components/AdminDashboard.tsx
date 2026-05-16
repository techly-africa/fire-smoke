import React, { useState, useEffect } from 'react';
import { bookingService, Booking } from '../services/bookingService';
import { C as TokensC, F as TokensF } from '../tokens';
import * as staticData from '../data';
import { ToastContainer, useToast } from './Toast';
import { supabase } from '../lib/supabase';
import { uploadToCloudinary } from '../lib/cloudinary';
import './AdminDashboard.css';

const C = {
  bg: '#0a0a0a',
  surface: '#141414',
  border: '#262626',
  panel: '#111',
  text: '#ffffff',
  textMuted: '#a3a3a3',
  yellow: '#facc15',
  red: '#ef4444',
  dim: '#666',
  pink: '#ec4899'
};

const F = {
  heavy: '"Archivo Black", sans-serif',
  display: '"Archivo Black", sans-serif',
  mono: '"JetBrains Mono", monospace'
};


function ImageUpload({ value, onUpload }: { value: string, onUpload: (url: string) => void }) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);
  const { toast } = useToast();

  return (
    <div style={{ marginBottom: 12 }}>
      {value && (
        <img 
          src={value} 
          alt="Preview" 
          style={{ maxWidth: 200, height: 100, objectFit: 'cover', border: `1px solid ${C.border}`, marginBottom: 8, display: 'block' }} 
        />
      )}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            
            setUploading(true);
            try {
              const url = await uploadToCloudinary(file, 'fire-smoke/cms');
              onUpload(url);
              toast('Image uploaded successfully.', 'success');
            } catch (err: any) {
              toast(`Upload failed: ${err.message}`, 'error');
            } finally {
              setUploading(false);
            }
          }}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          style={{
            background: 'rgba(255,255,255,0.1)',
            color: C.yellow,
            border: `1px solid ${C.yellow}`,
            padding: '6px 12px',
            fontFamily: F.heavy,
            fontSize: 10,
            cursor: uploading ? 'not-allowed' : 'pointer'
          }}
        >
          {uploading ? 'UPLOADING...' : 'UPLOAD_TO_CLOUDINARY'}
        </button>
      </div>
    </div>
  );
}


export function AdminDashboard({ onLogout }: { onLogout?: () => void }) {
  const { toasts, toast, remove } = useToast();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'REJECTED'>('PENDING');
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const confirmedTicketsCount = bookings
    .filter(b => b.payment_status === 'CONFIRMED')
    .reduce((acc, b) => acc + b.quantity, 0);
  
  // Validator state
  const [ticketInput, setTicketInput] = useState('');
  const [validationResult, setValidationResult] = useState<{ success: boolean; msg: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'GUESTS' | 'LOGISTICS' | 'CMS' | 'PREDICTIONS' | 'COUPONS'>('GUESTS');
  const [predictions, setPredictions] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isAnnouncing, setIsAnnouncing] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    title: string;
    message: string;
    confirmText: string;
    onConfirm: () => void;
    accentColor?: string;
  }>({
    show: false,
    title: '',
    message: '',
    confirmText: 'CONFIRM',
    onConfirm: () => {}
  });

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
    PREDICT_WIN: staticData.PREDICT_WIN,
  });
  const [selectedCmsKey, setSelectedCmsKey] = useState<string>('EVENT');
  const [isSavingCms, setIsSavingCms] = useState(false);

  // Coupon Creation State
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState({ code: '', discount: 10, maxUses: 0 });

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

  async function loadPredictions() {
    try {
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setPredictions(data || []);
    } catch (err: any) {
      toast(`Failed to load predictions: ${err.message}`, 'error');
    }
  }

  async function loadCoupons() {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setCoupons(data || []);
    } catch (err: any) {
      toast(`Failed to load coupons: ${err.message}`, 'error');
    }
  }

  async function handleCreateCoupon() {
    if (!newCoupon.code) {
      toast('Coupon code is required.', 'error');
      return;
    }
    try {
      const { error } = await supabase.rpc('create_coupon', {
        p_code: newCoupon.code,
        p_discount_percent: newCoupon.discount,
        p_max_uses: newCoupon.maxUses
      });
      if (error) throw error;
      toast('Coupon created successfully.', 'success');
      setShowCouponModal(false);
      setNewCoupon({ code: '', discount: 10, maxUses: 0 });
      loadCoupons();
    } catch (err: any) {
      toast(`Failed to create coupon: ${err.message}`, 'error');
    }
  }

  async function handleDeleteCoupon(id: string, code: string) {
    setConfirmModal({
      show: true,
      title: 'DELETE_COUPON',
      message: `Are you sure you want to permanently delete coupon ${code}?`,
      confirmText: 'YES, DELETE',
      accentColor: C.red,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, show: false }));
        try {
          const { error } = await supabase.rpc('delete_coupon', { p_id: id });
          if (error) throw error;
          toast('Coupon deleted.', 'info');
          loadCoupons();
        } catch (err: any) {
          toast(`Deletion failed: ${err.message}`, 'error');
        }
      }
    });
  }

  useEffect(() => {
    if (activeTab === 'PREDICTIONS') loadPredictions();
    if (activeTab === 'COUPONS') loadCoupons();
  }, [activeTab]);

  async function handleAnnounceWinners() {
    const p = cmsData.PREDICT_WIN;
    if (!p.final_score_team1 && !p.final_score_team2 && p.final_score_team1 !== 0) {
      toast('Please set the final scores in CMS first!', 'error');
      return;
    }

    const winners = predictions.filter(
      pr => pr.team1_score === p.final_score_team1 && pr.team2_score === p.final_score_team2
    );

    if (winners.length === 0) {
      toast('No correct predictions found for these scores.', 'info');
      return;
    }

    setConfirmModal({
      show: true,
      title: 'ANNOUNCE WINNERS',
      message: `We found ${winners.length} correct predictions. This will send automated reward emails to all winners immediately. Are you sure?`,
      confirmText: 'YES, SEND REWARDS',
      accentColor: C.yellow,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, show: false }));
        setIsAnnouncing(true);
        try {
          const { mailService } = await import('../services/mailService');
          for (const w of winners) {
            await mailService.sendReward(
              w.email, 
              p.team1, 
              p.team2, 
              p.final_score_team1, 
              p.final_score_team2, 
              p.prize
            );
          }
          toast(`Successfully sent ${winners.length} rewards!`, 'success');
        } catch (err: any) {
          toast(`Error sending rewards: ${err.message}`, 'error');
        } finally {
          setIsAnnouncing(false);
        }
      }
    });
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
        localStorage.setItem('fire_smoke_cms_v2', JSON.stringify({ ...cmsData, ...data }));
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
      localStorage.setItem('fire_smoke_cms_v2', JSON.stringify(cmsData));
      toast(`${selectedCmsKey} saved and synced successfully.`, 'success');
    } catch (err: any) {
      toast(`Save failed: ${err.message}`, 'error');
    } finally {
      setIsSavingCms(false);
    }
  }

  function updateField(path: string[], value: any) {
    console.log('UPDATING FIELD:', path, value);
    setCmsData(prev => {
      const updateDeep = (obj: any, p: string[], val: any): any => {
        if (p.length === 0) return val;
        const [head, ...tail] = p;
        if (Array.isArray(obj)) {
          const newArr = [...obj];
          const idx = parseInt(head);
          newArr[idx] = updateDeep(newArr[idx], tail, val);
          return newArr;
        } else {
          return {
            ...obj,
            [head]: updateDeep(obj[head], tail, val)
          };
        }
      };
      
      const newSectionData = updateDeep(prev[selectedCmsKey], path, value);
      return {
        ...prev,
        [selectedCmsKey]: newSectionData
      };
    });
  }

  const renderEditorFields = (data: any, path: string[] = []) => {
    if (typeof data === 'string') {
      const isLong = data.length > 50 || data.includes('\n');
      
      // Aggressive detection
      const fieldName = (path[path.length - 1] || '').toLowerCase();
      const parentName = (path[path.length - 2] || '').toLowerCase();
      const grandParentName = (path[path.length - 3] || '').toLowerCase();
      
      const isUrlValue = data.startsWith('http') || data.startsWith('/photos/') || data.includes('cloudinary');
      const isImageKey = fieldName.includes('image') || fieldName.includes('photo') || fieldName.includes('url') || fieldName.includes('src') ||
                        parentName.includes('photo') || parentName.includes('gallery') || 
                        grandParentName.includes('photo') || grandParentName.includes('gallery');

      const isImage = isImageKey || isUrlValue;

      if (typeof data === 'boolean' || fieldName === 'active') {
        return (
          <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div 
              onClick={() => updateField(path, !data)}
              style={{ 
                width: 50, 
                height: 24, 
                background: data ? C.yellow : '#333', 
                borderRadius: 12, 
                position: 'relative', 
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              <div style={{ 
                width: 20, 
                height: 20, 
                background: data ? '#000' : '#888', 
                borderRadius: '50%', 
                position: 'absolute', 
                top: 2, 
                left: data ? 28 : 2,
                transition: 'all 0.3s'
              }} />
            </div>
            <span style={{ color: data ? C.yellow : '#666', fontFamily: F.mono, fontSize: 12 }}>{data ? 'ENABLED' : 'DISABLED'}</span>
          </div>
        );
      }

      return (
        <div style={{ marginBottom: 16 }}>
          {isImage && (
            <ImageUpload value={data} onUpload={(url) => updateField(path, url)} />
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
              // Deep clone first item as template
              const template = data[0];
              let newItem: any;
              
              if (typeof template === 'object' && template !== null) {
                newItem = JSON.parse(JSON.stringify(template));
                // Recursively clear values
                const clear = (obj: any) => {
                  Object.keys(obj).forEach(k => {
                    if (typeof obj[k] === 'string') obj[k] = '';
                    else if (typeof obj[k] === 'number') obj[k] = 0;
                    else if (Array.isArray(obj[k])) obj[k] = [];
                    else if (typeof obj[k] === 'object' && obj[k] !== null) clear(obj[k]);
                  });
                };
                clear(newItem);
              } else if (typeof template === 'string') {
                newItem = '';
              } else {
                newItem = 0;
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
    setConfirmModal({
      show: true,
      title: 'REJECT BOOKING',
      message: 'Are you sure you want to reject this booking? This will remove it from the active list.',
      confirmText: 'YES, REJECT',
      accentColor: '#ef4444',
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, show: false }));
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
    });
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

  function handleDelete(id: string, name: string) {
    setDeleteTarget({ id, name });
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const { id, name } = deleteTarget;
    setDeleteTarget(null);
    setActionLoading(`delete-${id}`);
    try {
      const { error } = await supabase.rpc('delete_booking', { p_id: id });
      if (error) throw error;
      setBookings(prev => prev.filter(b => b.id !== id));
      toast(`Booking for ${name} deleted.`, 'info');
    } catch (err: any) {
      toast(`Delete failed: ${err.message}`, 'error');
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

    {/* ── Generic confirmation modal ── */}
    {confirmModal.show && (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}>
        <div style={{
          background: '#0a0a0a', border: `1px solid ${confirmModal.accentColor || C.yellow}`,
          maxWidth: 480, width: '100%', padding: 40, boxShadow: '0 0 50px rgba(0,0,0,0.5)'
        }}>
          <div style={{ fontFamily: F.display, fontSize: 12, color: confirmModal.accentColor || C.yellow, letterSpacing: 3, marginBottom: 20 }}>{confirmModal.title}</div>
          <p style={{ fontFamily: F.mono, fontSize: 16, color: '#fff', margin: '0 0 32px', lineHeight: 1.6 }}>
            {confirmModal.message}
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            <button
              onClick={() => setConfirmModal(prev => ({ ...prev, show: false }))}
              style={{ flex: 1, background: 'transparent', border: `1px solid #333`, color: '#666', padding: '14px', cursor: 'pointer', fontFamily: F.mono, fontSize: 13, fontWeight: 700 }}
            >
              CANCEL
            </button>
            <button
              onClick={confirmModal.onConfirm}
              style={{ flex: 1, background: confirmModal.accentColor || C.yellow, border: 'none', color: '#000', padding: '14px', cursor: 'pointer', fontFamily: F.display, fontSize: 13, fontWeight: 900 }}
            >
              {confirmModal.confirmText}
            </button>
          </div>
        </div>
      </div>
    )}

    {/* ── Delete confirmation modal ── */}
    {deleteTarget && (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}>
        <div style={{
          background: '#111', border: `1px solid #ef4444`,
          maxWidth: 420, width: '100%', padding: 32,
        }}>
          <div style={{ fontFamily: F.display, fontSize: 11, color: '#ef4444', letterSpacing: 2, marginBottom: 16 }}>⚠ CONFIRM DELETE</div>
          <p style={{ fontFamily: F.mono, fontSize: 15, color: '#fff', margin: '0 0 8px' }}>
            Delete booking for
          </p>
          <p style={{ fontFamily: F.display, fontSize: 20, color: C.yellow, margin: '0 0 24px', wordBreak: 'break-word' }}>
            {deleteTarget.name}
          </p>
          <p style={{ fontFamily: F.mono, fontSize: 12, color: '#9ca3af', margin: '0 0 28px' }}>
            This action is permanent and cannot be undone.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => setDeleteTarget(null)}
              style={{ flex: 1, background: 'transparent', border: `1px solid #374151`, color: '#9ca3af', padding: '12px', cursor: 'pointer', fontFamily: F.mono, fontSize: 13 }}
            >
              CANCEL
            </button>
            <button
              onClick={confirmDelete}
              style={{ flex: 1, background: '#ef4444', border: 'none', color: '#fff', padding: '12px', cursor: 'pointer', fontFamily: F.display, fontSize: 13, fontWeight: 700 }}
            >
              YES, DELETE
            </button>
          </div>
        </div>
      </div>
    )}

    {/* ── Create Coupon Modal ── */}
    {showCouponModal && (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}>
        <div style={{
          background: '#0a0a0a', border: `1px solid ${C.yellow}`,
          maxWidth: 480, width: '100%', padding: 40, boxShadow: '0 0 50px rgba(0,0,0,0.5)'
        }}>
          <div style={{ fontFamily: F.display, fontSize: 12, color: C.yellow, letterSpacing: 3, marginBottom: 20 }}>CREATE NEW COUPON</div>
          
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontFamily: F.mono, fontSize: 11, color: '#888', marginBottom: 8, letterSpacing: 1 }}>COUPON CODE</label>
            <input 
              type="text" 
              value={newCoupon.code} 
              onChange={e => setNewCoupon(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
              style={{ width: '100%', background: '#111', border: '1px solid #333', color: '#fff', padding: '12px', fontFamily: F.mono, fontSize: 14 }}
              placeholder="e.g. VIP2024"
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontFamily: F.mono, fontSize: 11, color: '#888', marginBottom: 8, letterSpacing: 1 }}>DISCOUNT PERCENTAGE (%)</label>
            <input 
              type="number" 
              min="0" max="100"
              value={newCoupon.discount} 
              onChange={e => setNewCoupon(prev => ({ ...prev, discount: parseInt(e.target.value) || 0 }))}
              style={{ width: '100%', background: '#111', border: '1px solid #333', color: '#fff', padding: '12px', fontFamily: F.mono, fontSize: 14 }}
            />
          </div>

          <div style={{ marginBottom: 32 }}>
            <label style={{ display: 'block', fontFamily: F.mono, fontSize: 11, color: '#888', marginBottom: 8, letterSpacing: 1 }}>MAX USES (0 for unlimited)</label>
            <input 
              type="number" 
              min="0"
              value={newCoupon.maxUses} 
              onChange={e => setNewCoupon(prev => ({ ...prev, maxUses: parseInt(e.target.value) || 0 }))}
              style={{ width: '100%', background: '#111', border: '1px solid #333', color: '#fff', padding: '12px', fontFamily: F.mono, fontSize: 14 }}
            />
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            <button
              onClick={() => {
                setShowCouponModal(false);
                setNewCoupon({ code: '', discount: 10, maxUses: 0 });
              }}
              style={{ flex: 1, background: 'transparent', border: `1px solid #333`, color: '#666', padding: '14px', cursor: 'pointer', fontFamily: F.mono, fontSize: 13, fontWeight: 700 }}
            >
              CANCEL
            </button>
            <button
              onClick={handleCreateCoupon}
              style={{ flex: 1, background: C.yellow, border: 'none', color: '#000', padding: '14px', cursor: 'pointer', fontFamily: F.display, fontSize: 13, fontWeight: 900 }}
            >
              CREATE COUPON
            </button>
          </div>
        </div>
      </div>
    )}
    <div className="admin-shell" style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: F.mono }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <header className="admin-header" style={{ color: C.text }}>
          <div>
            <h1 style={{ fontFamily: F.display, fontSize: 'clamp(24px, 5vw, 40px)', color: C.yellow, margin: 0 }}>BOOKING_ADMIN</h1>
            <p style={{ color: C.dim, margin: '4px 0 0', fontSize: 14 }}>Manage RSVPs and Confirm Payments</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button 
              onClick={() => activeTab === 'GUESTS' ? loadBookings() : activeTab === 'LOGISTICS' ? loadSettings() : loadCms()}
              disabled={loading}
              style={{ background: 'transparent', border: `1px solid ${C.yellow}`, color: C.yellow, padding: '8px 16px', cursor: 'pointer', fontFamily: F.heavy, fontSize: 12 }}
            >
              {loading ? '...' : 'REFRESH_DATA()'}
            </button>
            {onLogout && (
              <button
                onClick={onLogout}
                style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '8px 16px', cursor: 'pointer', fontFamily: F.heavy, fontSize: 12 }}
              >
                LOGOUT
              </button>
            )}
          </div>
        </header>

        {/* Tab Switcher */}
        <div className="admin-tabs" style={{ display: 'flex', gap: 4, background: '#000', padding: 4, border: `1px solid ${C.border}`, marginBottom: 32 }}>
          {(['GUESTS', 'LOGISTICS', 'CMS', 'PREDICTIONS', 'COUPONS'] as const).map(t => (
            <button 
              key={t}
              className="admin-tab"
              onClick={() => setActiveTab(t)}
              style={{ 
                background: activeTab === t ? C.yellow : 'transparent', 
                color: activeTab === t ? C.bg : C.text,
                border: 'none',
                padding: '8px 16px',
                fontFamily: F.heavy,
                fontSize: 10,
                cursor: 'pointer',
                letterSpacing: 1,
                flex: 1
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
          <div style={{ background: '#111', border: `2px solid ${C.yellow}`, padding: 'clamp(16px, 4vw, 32px)' }}>
            <h2 style={{ fontFamily: F.display, fontSize: 'clamp(16px,5vw,24px)', margin: '0 0 24px', color: C.yellow }}>CONTENT_MANAGEMENT_SYSTEM</h2>
            {/* Mobile: select picker */}
            <select
              className="cms-section-select"
              value={selectedCmsKey}
              onChange={e => setSelectedCmsKey(e.target.value)}
            >
              {Object.keys(cmsData).sort().map(k => <option key={k} value={k}>{k}</option>)}
            </select>
            <div className="cms-grid" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 0, border: `1px solid ${C.border}`, background: C.surface, minHeight: 600 }}>
              {/* Section List */}
              <div style={{ 
                borderRight: `1px solid ${C.border}`, 
                padding: 20, 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 8,
                background: 'rgba(0,0,0,0.2)'
              }}>
                {Object.keys(cmsData).sort().map(key => (
                  <button
                    key={key}
                    onClick={() => setSelectedCmsKey(key)}
                    style={{
                      textAlign: 'left',
                      padding: '12px 16px',
                      background: selectedCmsKey === key ? C.yellow : 'transparent',
                      color: selectedCmsKey === key ? '#000' : C.text,
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: F.heavy,
                      fontSize: 11,
                      letterSpacing: 1,
                      transition: 'all 0.2s'
                    }}
                  >
                    {key}
                  </button>
                ))}
                
                <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: `1px solid ${C.border}` }}>
                  <button
                    onClick={() => {
                      setConfirmModal({
                        show: true,
                        title: 'SAFE_MERGE_CONTENT',
                        message: 'This will add missing fields (like new prediction settings or photos) to your existing content without overwriting your current text. Continue?',
                        confirmText: 'PROCEED_WITH_MERGE',
                        accentColor: C.yellow,
                        onConfirm: async () => {
                          setConfirmModal(prev => ({ ...prev, show: false }));
                          try {
                            const keys = Object.keys(staticData).filter(k => Array.isArray((staticData as any)[k]) || typeof (staticData as any)[k] === 'object');
                            const currentDbData = await bookingService.getAllCms();
                            // ... rest of the merge logic below ...
                          
                          for (const k of keys) {
                            const local = (staticData as any)[k];
                            const remote = currentDbData[k];
                            
                            if (remote) {
                              // Deep merge missing keys from local to remote
                              const merge = (loc: any, rem: any) => {
                                if (Array.isArray(loc) && Array.isArray(rem)) {
                                  rem.forEach((item, i) => {
                                    if (loc[i]) merge(loc[i], item);
                                  });
                                  // If local has more items than remote, we don't add them to be safe, 
                                  // but we could if we wanted to. Let's just focus on adding missing keys to existing items.
                                } else if (typeof loc === 'object' && loc !== null && typeof rem === 'object' && rem !== null) {
                                  Object.keys(loc).forEach(key => {
                                    if (!(key in rem)) {
                                      rem[key] = loc[key]; // Add missing field
                                    } else {
                                      merge(loc[key], rem[key]); // Recurse
                                    }
                                  });
                                }
                              };
                              merge(local, remote);
                              await bookingService.updateCms(k, remote);
                            } else {
                              // If key doesn't exist in DB at all, just push local
                              await bookingService.updateCms(k, local);
                            }
                          }
                          toast('Database safely merged with new schema.', 'success');
                          loadCms();
                        } catch (err: any) {
                          toast(`Merge failed: ${err.message}`, 'error');
                        }
                      }
                    });
                  }}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'rgba(255,255,255,0.05)',
                      color: C.yellow,
                      border: `1px solid ${C.yellow}`,
                      cursor: 'pointer',
                      fontFamily: F.mono,
                      fontSize: 10,
                      textAlign: 'center'
                    }}
                  >
                    SAFE_MERGE_DB_SCHEMA
                  </button>
                </div>
              </div>

              {/* Editor Area */}
              <div style={{ padding: 40, overflowY: 'auto', maxHeight: '80vh' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                  <div>
                    <span style={{ fontSize: 10, color: C.dim, fontFamily: F.mono }}>SECTION:</span>
                    <span style={{ marginLeft: 8, fontFamily: F.heavy, fontSize: 14, color: C.yellow }}>{selectedCmsKey}</span>
                  </div>
                  <button 
                    onClick={handleSaveCms}
                    disabled={isSavingCms}
                    style={{ background: C.yellow, color: C.bg, border: 'none', padding: '12px 24px', fontFamily: F.heavy, fontSize: 13, cursor: 'pointer', boxShadow: '0 4px 14px rgba(250, 204, 21, 0.3)' }}
                  >
                    {isSavingCms ? 'SAVING...' : 'PUBLISH_CHANGES'}
                  </button>
                </div>
                {renderEditorFields(cmsData[selectedCmsKey], [])}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'GUESTS' && (
          <>
            <div style={{ display: 'flex', gap: 20, marginBottom: 32, flexWrap: 'wrap', alignItems: 'center' }}>
              <div className="admin-search-wrap" style={{ flex: 1 }}>
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
              <>
              {/* ── Desktop table ── */}
              <div className="booking-table-wrap">
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
                        <td style={{ padding: '16px 8px', textAlign: 'center' }}>
                          <button
                            disabled={!!actionLoading}
                            onClick={() => handleDelete(b.id, b.full_name)}
                            title="Delete booking"
                            style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', width: 28, height: 28, cursor: 'pointer', fontSize: 14, lineHeight: 1, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            {actionLoading === `delete-${b.id}` ? '…' : '×'}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={8} style={{ padding: 40, textAlign: 'center', color: C.dim }}>No bookings found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {/* ── Mobile cards ── */}
              <div className="booking-cards">
                {filtered.map(b => {
                  const statusColor = b.payment_status === 'CONFIRMED' ? '#4ade80' : b.payment_status === 'REJECTED' ? '#f87171' : '#facc15';
                  const statusBg   = b.payment_status === 'CONFIRMED' ? 'rgba(34,197,94,0.15)' : b.payment_status === 'REJECTED' ? 'rgba(239,68,68,0.15)' : 'rgba(234,179,8,0.15)';
                  return (
                    <div key={b.id} style={{ background: C.panel, border: `1px solid ${C.border}`, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 15 }}>{b.full_name}</div>
                          <div style={{ fontSize: 11, color: C.dim }}>{b.email}</div>
                        </div>
                        <span style={{ padding: '4px 8px', fontSize: 10, fontWeight: 700, background: statusBg, color: statusColor, borderRadius: 4, flexShrink: 0 }}>{b.payment_status}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 16, fontSize: 12, color: C.dim, flexWrap: 'wrap' }}>
                        <span>{b.tier_id.toUpperCase()} ×{b.quantity}</span>
                        <span style={{ color: C.text, fontWeight: 700 }}>{b.total_price.toLocaleString()} RWF</span>
                        {b.momo_reference && <span style={{ color: C.yellow }}>Ref: {b.momo_reference}</span>}
                      </div>
                      {b.ticket_number && <div style={{ fontSize: 10, color: C.dim }}>TICKET: {b.ticket_number}{b.used_at && <span style={{ color: C.pink, marginLeft: 8, fontWeight: 700 }}>[USED]</span>}</div>}
                      {b.payment_status === 'PENDING' && (
                        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                          <button disabled={!!actionLoading} onClick={() => handleConfirm(b.id)} style={{ flex: 1, background: '#22c55e', color: '#fff', border: 'none', padding: '10px', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>{actionLoading === b.id ? '...' : 'CONFIRM'}</button>
                          <button disabled={!!actionLoading} onClick={() => handleReject(b.id)}  style={{ flex: 1, background: '#ef4444', color: '#fff', border: 'none', padding: '10px', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>{actionLoading === b.id ? '...' : 'REJECT'}</button>
                        </div>
                      )}
                      {b.payment_status === 'CONFIRMED' && (
                        <button disabled={actionLoading === `resend-${b.id}`} onClick={() => handleResend(b)} style={{ background: 'transparent', color: C.yellow, border: `1px solid ${C.yellow}`, padding: '8px', cursor: 'pointer', fontSize: 11, fontFamily: F.mono }}>{actionLoading === `resend-${b.id}` ? '...' : 'RESEND_EMAIL'}</button>
                      )}
                      <button
                        disabled={!!actionLoading}
                        onClick={() => handleDelete(b.id, b.full_name)}
                        style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', padding: '6px', cursor: 'pointer', fontSize: 11, fontWeight: 700, marginTop: 4 }}
                      >
                        {actionLoading === `delete-${b.id}` ? '...' : '× DELETE'}
                      </button>
                    </div>
                  );
                })}
                {filtered.length === 0 && <div style={{ padding: 40, textAlign: 'center', color: C.dim }}>No bookings found.</div>}
              </div>
            </>
          )}
          </>
        )}

        {activeTab === 'COUPONS' && (
          <div style={{ animation: 'ss-fade-in 0.4s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: F.display, fontSize: 32, margin: 0, letterSpacing: -1 }}>ACTIVE_COUPONS</h2>
              <button
                onClick={() => setShowCouponModal(true)}
                style={{ background: C.yellow, color: C.bg, border: 'none', padding: '10px 20px', fontFamily: F.heavy, fontSize: 12, cursor: 'pointer' }}
              >
                + NEW_COUPON
              </button>
            </div>

            <div style={{ background: C.panel, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ background: '#000', borderBottom: `1px solid ${C.border}` }}>
                  <tr>
                    <th style={{ padding: 16, fontFamily: F.mono, fontSize: 10, color: C.dim }}>CODE</th>
                    <th style={{ padding: 16, fontFamily: F.mono, fontSize: 10, color: C.dim }}>DISCOUNT</th>
                    <th style={{ padding: 16, fontFamily: F.mono, fontSize: 10, color: C.dim }}>USAGE</th>
                    <th style={{ padding: 16, fontFamily: F.mono, fontSize: 10, color: C.dim }}>STATUS</th>
                    <th style={{ padding: 16, fontFamily: F.mono, fontSize: 10, color: C.dim }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((c) => (
                    <tr key={c.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                      <td style={{ padding: 16, fontFamily: F.heavy, fontSize: 14 }}>{c.code}</td>
                      <td style={{ padding: 16, color: C.yellow, fontFamily: F.mono, fontSize: 14 }}>{c.discount_percent}% OFF</td>
                      <td style={{ padding: 16, fontFamily: F.mono, fontSize: 14 }}>{c.current_uses} / {c.max_uses === 0 ? '∞' : c.max_uses}</td>
                      <td style={{ padding: 16 }}>
                        <span style={{ 
                          fontSize: 10, 
                          padding: '4px 8px', 
                          background: c.is_active ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                          color: c.is_active ? '#22c55e' : '#ef4444',
                          border: `1px solid ${c.is_active ? '#22c55e' : '#ef4444'}`,
                          fontFamily: F.mono,
                          fontWeight: 700
                        }}>
                          {c.is_active ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>
                      <td style={{ padding: 16 }}>
                        <button 
                          onClick={() => handleDeleteCoupon(c.id, c.code)}
                          style={{ background: 'transparent', border: 'none', color: C.red, cursor: 'pointer', fontFamily: F.mono, fontSize: 12 }}
                        >
                          DELETE
                        </button>
                      </td>
                    </tr>
                  ))}
                  {coupons.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ padding: 40, textAlign: 'center', color: C.dim, fontFamily: F.mono }}>NO_COUPONS_FOUND</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {activeTab === 'PREDICTIONS' && (
          <div className="tab-pane">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <h2 style={{ fontFamily: F.heavy, fontSize: 24, margin: 0 }}>PREDICTIONS_TRACKER</h2>
                <p style={{ color: C.textMuted, fontSize: 12, marginTop: 4 }}>Manage user predictions and distribute rewards.</p>
              </div>
              <button 
                onClick={handleAnnounceWinners}
                disabled={isAnnouncing}
                style={{ 
                  background: C.yellow, color: '#000', border: 'none', 
                  padding: '12px 24px', fontFamily: F.heavy, fontSize: 13, 
                  cursor: isAnnouncing ? 'not-allowed' : 'pointer' 
                }}
              >
                {isAnnouncing ? 'SENDING_REWARDS...' : 'ANNOUNCE_WINNERS'}
              </button>
            </div>

            <div style={{ background: C.surface, border: `1px solid ${C.border}`, padding: 24, marginBottom: 24 }}>
              <h3 style={{ fontFamily: F.heavy, fontSize: 14, marginBottom: 16 }}>MATCH_RESULT_INPUT</h3>
              <div style={{ display: 'flex', gap: 24 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 10, color: C.textMuted, marginBottom: 8 }}>{cmsData.PREDICT_WIN.team1} SCORE</label>
                  <input 
                    type="number"
                    value={cmsData.PREDICT_WIN.final_score_team1 ?? 0}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      const updated = { ...cmsData };
                      updated.PREDICT_WIN.final_score_team1 = isNaN(val) ? 0 : val;
                      setCmsData(updated);
                    }}
                    style={{ background: '#000', border: `1px solid ${C.border}`, color: '#fff', padding: 12, width: 80, fontSize: 20, textAlign: 'center' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', paddingTop: 20 }}>VS</div>
                <div>
                  <label style={{ display: 'block', fontSize: 10, color: C.textMuted, marginBottom: 8 }}>{cmsData.PREDICT_WIN.team2} SCORE</label>
                  <input 
                    type="number"
                    value={cmsData.PREDICT_WIN.final_score_team2 ?? 0}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      const updated = { ...cmsData };
                      updated.PREDICT_WIN.final_score_team2 = isNaN(val) ? 0 : val;
                      setCmsData(updated);
                    }}
                    style={{ background: '#000', border: `1px solid ${C.border}`, color: '#fff', padding: 12, width: 80, fontSize: 20, textAlign: 'center' }}
                  />
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end' }}>
                  <p style={{ fontSize: 11, color: C.dim, margin: 0 }}>Setting these scores will allow you to trigger the <b>ANNOUNCE_WINNERS</b> flow above.</p>
                </div>
              </div>
            </div>

            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: `1px solid ${C.border}` }}>
                    <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: 10, fontFamily: F.mono, color: C.textMuted }}>TIMESTAMP</th>
                    <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: 10, fontFamily: F.mono, color: C.textMuted }}>EMAIL</th>
                    <th style={{ textAlign: 'center', padding: '16px 24px', fontSize: 10, fontFamily: F.mono, color: C.textMuted }}>PREDICTION</th>
                    <th style={{ textAlign: 'right', padding: '16px 24px', fontSize: 10, fontFamily: F.mono, color: C.textMuted }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {predictions.map((p, idx) => {
                    const isWinner = p.team1_score === cmsData.PREDICT_WIN.final_score_team1 && 
                                   p.team2_score === cmsData.PREDICT_WIN.final_score_team2;
                    return (
                      <tr key={idx} style={{ borderBottom: `1px solid ${C.border}`, background: isWinner ? 'rgba(250, 204, 21, 0.05)' : 'transparent' }}>
                        <td style={{ padding: '16px 24px', fontSize: 12, color: C.textMuted }}>{new Date(p.created_at).toLocaleString()}</td>
                        <td style={{ padding: '16px 24px', fontSize: 13, fontFamily: F.mono }}>{p.email}</td>
                        <td style={{ padding: '16px 24px', fontSize: 14, textAlign: 'center', fontWeight: 700 }}>{p.team1_score} - {p.team2_score}</td>
                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                          {isWinner ? (
                            <span style={{ background: C.yellow, color: '#000', fontSize: 9, fontWeight: 900, padding: '2px 6px', borderRadius: 2 }}>WINNER</span>
                          ) : (
                            <span style={{ color: C.dim, fontSize: 10 }}>—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
