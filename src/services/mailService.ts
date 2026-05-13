import { supabase } from '../lib/supabase';
import { Booking } from './bookingService';

export const mailService = {
  async sendTicket(booking: Booking, eventData?: any) {
    const EVENT = eventData || {
      name: 'Fire & Smoke',
      dateLabel: 'MAY 30, 2026',
      location: 'MT KIGALI',
      timeLabel: '2:00 PM'
    };

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Inter', -apple-system, sans-serif; background-color: #050505; color: #ffffff; margin: 0; padding: 40px 20px; }
          .container { max-width: 500px; margin: 0 auto; background: #111111; border: 4px solid #fde047; padding: 40px; position: relative; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 40px; font-weight: 900; color: #ffffff; letter-spacing: -2px; }
          .logo span { color: #fde047; }
          .ticket-info { margin-bottom: 30px; }
          .label { font-size: 10px; color: #71717a; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px; font-weight: 700; }
          .value { font-size: 20px; color: #ffffff; font-weight: 800; margin-bottom: 20px; }
          .ticket-number { background: #fde047; color: #000000; padding: 20px; text-align: center; font-size: 32px; font-weight: 900; letter-spacing: 2px; margin: 40px 0; border: 2px dashed #000000; }
          .footer { text-align: center; font-size: 12px; color: #71717a; line-height: 1.6; border-top: 1px solid #333; padding-top: 20px; }
          .event-details { background: rgba(253, 224, 71, 0.05); padding: 20px; border-radius: 4px; margin-bottom: 30px; }
          .highlight { color: #fde047; font-weight: 700; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">${EVENT.name.toUpperCase()} <span>&</span> SMOKE</div>
            <p style="color: #71717a; margin-top: 10px; font-size: 14px;">Your ticket on behalf of ${EVENT.name}</p>
          </div>

          <div class="ticket-info">
            <div class="label">GUEST_NAME</div>
            <div class="value">${booking.full_name}</div>
            
            <div class="label">TIER / QUANTITY</div>
            <div class="value">${booking.tier_id.toUpperCase()} (x${booking.quantity})</div>
          </div>

          <div class="event-details">
            <div style="font-weight: 800; font-size: 14px; margin-bottom: 8px;">EVENT_LOGISTICS</div>
            <div style="font-size: 13px; color: #a1a1aa; line-height: 1.5;">
              📅 <span class="highlight">${EVENT.dateLabel.toUpperCase()}</span><br>
              📍 <span class="highlight">${EVENT.location.toUpperCase()}</span><br>
              🕒 <span class="highlight">${EVENT.timeLabel.split('—')[0].trim().toUpperCase()}</span>
            </div>
          </div>

          <div class="label" style="text-align: center;">UNIQUE_TICKET_ID</div>
          <div class="ticket-number">${booking.ticket_number}</div>

          <div class="footer">
            Present this ticket number at the gate for validation.<br>
            A physical wristband will be issued upon arrival.<br><br>
            <span style="font-weight: 700; color: #ffffff;">STAY_FIRED_UP.</span>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      const { data, error } = await supabase.functions.invoke('send-ticket', {
        body: { booking, html },
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        }
      });

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error sending email via Supabase Function:', err);
      throw err;
    }
  }
};
