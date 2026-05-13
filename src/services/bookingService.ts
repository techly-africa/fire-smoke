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

export const bookingService = {
  async validateTicket(ticketNumber: string) {
    // 1. Find the booking
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('ticket_number', ticketNumber)
      .eq('payment_status', 'CONFIRMED')
      .single();

    if (fetchError || !booking) {
      throw new Error('Ticket not found or not confirmed.');
    }

    // 2. Check if already used
    if (booking.used_at) {
      throw new Error(`Ticket already validated at ${new Date(booking.used_at).toLocaleTimeString()}`);
    }

    // 3. Mark as used
    const { data, error: updateError } = await supabase
      .from('bookings')
      .update({ used_at: new Date().toISOString() })
      .eq('id', booking.id)
      .select()
      .single();

    if (updateError) throw updateError;
    return data as Booking;
  },
  async submitBooking(data: Omit<Booking, 'id' | 'ticket_number' | 'payment_status' | 'created_at' | 'confirmed_at' | 'ticket_sent' | 'used_at'>) {
    const { data: booking, error } = await supabase
      .from('bookings')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return booking;
  },

  async fetchBookings() {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Booking[];
  },

  async confirmBooking(id: string) {
    const ticketNumber = `FS-26-${Math.floor(1000 + Math.random() * 9000)}`;
    const { data, error } = await supabase
      .from('bookings')
      .update({
        payment_status: 'CONFIRMED',
        ticket_number: ticketNumber,
        confirmed_at: new Date().toISOString(),
        ticket_sent: true
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    // Send email via Resend with dynamic CMS data
    try {
      const cms = await this.getAllCms();
      await mailService.sendTicket(data as Booking, cms.EVENT);
    } catch (mailErr) {
      console.error('Failed to send ticket email:', mailErr);
      // We don't throw here to avoid breaking the UI, but we log it
    }

    return data as Booking;
  },

  async rejectBooking(id: string) {
    const { data, error } = await supabase
      .from('bookings')
      .update({ payment_status: 'REJECTED' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Booking;
  },

  async resendTicket(booking: Booking) {
    return await mailService.sendTicket(booking);
  },

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
    const { data, error } = await supabase
      .from('settings')
      .update({ value, updated_at: new Date().toISOString() })
      .eq('key', key)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getAllCms(): Promise<Record<string, any>> {
    const { data, error } = await supabase.from('cms').select('section_key, content');
    if (error) throw error;
    return (data as CmsSection[]).reduce((acc, curr) => ({ ...acc, [curr.section_key]: curr.content }), {});
  },

  async updateCms(key: string, content: any) {
    const { error } = await supabase
      .from('cms')
      .upsert({ section_key: key, content, updated_at: new Date().toISOString() }, { onConflict: 'section_key' });
    if (error) throw error;
  }
};
