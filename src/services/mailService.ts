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
  },

  async sendReward(email: string, team1: string, team2: string, score1: number, score2: number, prize: string) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { margin: 0; padding: 0; background-color: #050505; color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #0a0a0a; border: 1px solid #1a1a1a; }
          .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #fde047; padding-bottom: 20px; }
          .logo { font-size: 28px; font-weight: 900; letter-spacing: -1px; text-transform: uppercase; }
          .logo span { color: #fde047; }
          .winner-tag { background-color: #fde047; color: #000; display: inline-block; padding: 4px 12px; font-weight: 900; font-size: 11px; letter-spacing: 2px; margin-bottom: 20px; text-transform: uppercase; }
          .content { text-align: center; }
          .match-title { font-size: 12px; color: #666; letter-spacing: 2px; margin-bottom: 8px; text-transform: uppercase; }
          .match-score { font-size: 32px; font-weight: 900; margin-bottom: 32px; color: #fff; }
          .prize-box { background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%); padding: 32px; border: 1px solid #333; border-radius: 4px; margin: 40px 0; }
          .prize-label { font-size: 10px; color: #fde047; font-weight: 700; letter-spacing: 2px; margin-bottom: 12px; text-transform: uppercase; }
          .prize-value { font-size: 24px; font-weight: 900; line-height: 1.2; text-transform: uppercase; }
          .code-box { margin-top: 32px; padding: 20px; border: 1px dashed #444; background: rgba(253, 224, 71, 0.05); }
          .code-label { font-size: 9px; color: #666; margin-bottom: 8px; text-transform: uppercase; }
          .code-value { font-family: 'Courier New', Courier, monospace; font-size: 20px; font-weight: 900; color: #fde047; }
          .footer { text-align: center; margin-top: 60px; font-size: 11px; color: #444; line-height: 1.6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">FIRE <span>&</span> SMOKE</div>
          </div>
          
          <div class="content">
            <div class="winner-tag">Winner Announced</div>
            <h1 style="font-size: 48px; margin: 0 0 16px 0; letter-spacing: -2px;">YOU CALLED IT.</h1>
            <p style="color: #888; font-size: 16px; margin-bottom: 40px;">Your prediction for the match was spot on.</p>
            
            <div class="match-title">${team1} vs ${team2}</div>
            <div class="match-score">${score1} - ${score2}</div>
            
            <div class="prize-box">
              <div class="prize-label">YOUR EXCLUSIVE REWARD</div>
              <div class="prize-value">${prize}</div>
              
              <div class="code-box">
                <div class="code-label">Redeem at the bar with this code:</div>
                <div class="code-value">CHAMPION26</div>
              </div>
            </div>
            
            <p style="color: #444; font-size: 12px;">Valid only at the next event. Screenshots allowed.</p>
          </div>

          <div class="footer">
            © 2026 FIRE & SMOKE. ALL RIGHTS RESERVED.<br>
            KIGALI, RWANDA
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      const { data, error } = await supabase.functions.invoke('send-ticket', {
        body: { 
          email, 
          html,
          subject: `🎉 Winner! Your ${prize} is here.`
        }
      });

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error sending reward email:', err);
      throw err;
    }
  },
};
