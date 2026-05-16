import { supabase } from '../lib/supabase';
import { mailService } from './mailService';

export interface Booking {
  id: string;
  ticket_number: string | null;
  full_name: string;
  email: string;
  phone: string;
  tier_id: string;
  quantity: number;
  total_price: number;
  payment_status: 'PENDING' | 'CONFIRMED' | 'REJECTED';
  momo_reference: string | null;
  created_at: string;
  confirmed_at: string | null;
  ticket_sent: boolean;
  used_at: string | null;
}

export interface CmsSection {
  section_key: string;
  content: any;
}

// All write operations use supabase.rpc() (HTTP POST) instead of
// .update() (HTTP PATCH) to work around the project's CORS restriction
// that blocks PATCH on the Supabase REST API.

export const bookingService = {

  // ------------------------------------------------------------------
  // BOOKINGS — reads
  // ------------------------------------------------------------------

  async fetchBookings() {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Booking[];
  },

  async submitBooking(data: Omit<Booking, 'id' | 'ticket_number' | 'payment_status' | 'created_at' | 'confirmed_at' | 'ticket_sent' | 'used_at'> & { coupon_code?: string }) {
    const { data: booking, error } = await supabase
      .from('bookings')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return booking;
  },

  async validateCoupon(code: string) {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') throw new Error('Invalid or expired coupon.');
      throw error;
    }

    if (data.max_uses > 0 && data.current_uses >= data.max_uses) {
      throw new Error('This coupon has reached its usage limit.');
    }

    return data;
  },

  // ------------------------------------------------------------------
  // BOOKINGS — writes via RPC (POST, not PATCH)
  // ------------------------------------------------------------------

  async validateTicket(ticketNumber: string) {
    const { data, error } = await supabase
      .rpc('validate_ticket', { p_ticket_number: ticketNumber });

    if (error) throw new Error(error.message);
    if (!data || data.length === 0) throw new Error('Ticket not found or not confirmed.');
    return data[0] as Booking;
  },

  async confirmBooking(id: string) {
    const ticketNumber = `FS-26-${Math.floor(1000 + Math.random() * 9000)}`;

    const { data, error } = await supabase
      .rpc('confirm_booking', { p_id: id, p_ticket_number: ticketNumber });

    if (error) throw error;
    if (!data || data.length === 0) throw new Error('Booking not found.');

    const booking = data[0] as Booking;

    // Send email via Resend with dynamic CMS data
    try {
      const cms = await this.getAllCms();
      await mailService.sendTicket(booking, cms.EVENT);
    } catch (mailErr) {
      console.error('Failed to send ticket email:', mailErr);
      // Non-fatal — booking is confirmed; email failure is logged only.
    }

    return booking;
  },

  async rejectBooking(id: string) {
    const { data, error } = await supabase
      .rpc('reject_booking', { p_id: id });

    if (error) throw error;
    if (!data || data.length === 0) throw new Error('Booking not found.');
    return data[0] as Booking;
  },

  async resendTicket(booking: Booking) {
    return await mailService.sendTicket(booking);
  },

  // ------------------------------------------------------------------
  // SETTINGS — reads + writes via RPC
  // ------------------------------------------------------------------

  async getSettings() {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*');
      if (error) return [];
      return data || [];
    } catch (e) {
      return [];
    }
  },

  async updateSetting(key: string, value: string) {
    const { error } = await supabase
      .rpc('update_setting', { p_key: key, p_value: value });

    if (error) throw error;
  },

  // ------------------------------------------------------------------
  // CMS — reads + writes via RPC
  // ------------------------------------------------------------------

  async getAllCms(): Promise<Record<string, any>> {
    const { data, error } = await supabase
      .from('cms')
      .select('section_key, content');

    if (error) throw error;
    return (data as CmsSection[]).reduce(
      (acc, curr) => ({ ...acc, [curr.section_key]: curr.content }),
      {}
    );
  },

  async updateCms(key: string, content: any) {
    const { error } = await supabase
      .rpc('update_cms_section', { p_key: key, p_content: content });

    if (error) throw error;
  },

  async submitPrediction(email: string, score1: number, score2: number) {
    const { error } = await supabase
      .rpc('submit_prediction', { 
        p_email: email, 
        p_score1: score1, 
        p_score2: score2 
      });

    if (error) throw error;
  },
};
