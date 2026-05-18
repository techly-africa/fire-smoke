-- Use IF NOT EXISTS for tables
CREATE TABLE IF NOT EXISTS bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_number TEXT UNIQUE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    tier_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    total_price INTEGER NOT NULL,
    payment_status TEXT DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'CONFIRMED', 'REJECTED')),
    momo_reference TEXT,
    coupon_code TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE,
    ticket_sent BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS settings (
    id BIGSERIAL PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure initial settings exist
INSERT INTO settings (key, value) VALUES ('max_capacity', '200') ON CONFLICT (key) DO NOTHING;
INSERT INTO settings (key, value) VALUES ('early_bird_active', 'true') ON CONFLICT (key) DO NOTHING;
INSERT INTO settings (key, value) VALUES ('early_bird_price', '15000') ON CONFLICT (key) DO NOTHING;
INSERT INTO settings (key, value) VALUES ('early_bird_deadline', '2026-05-22') ON CONFLICT (key) DO NOTHING;

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Idempotent Policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Allow anonymous rsvp" ON bookings;
    DROP POLICY IF EXISTS "Allow admin select" ON bookings;
    DROP POLICY IF EXISTS "Allow admin update" ON bookings;
    DROP POLICY IF EXISTS "Public read settings" ON settings;
    DROP POLICY IF EXISTS "Admin update settings" ON settings;
EXCEPTION
    WHEN undefined_object THEN
        -- Do nothing if policy doesn't exist
END $$;

CREATE POLICY "Allow anonymous rsvp" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin select" ON bookings FOR SELECT USING (true);
CREATE POLICY "Allow admin update" ON bookings FOR UPDATE USING (true);
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Admin update settings" ON settings FOR UPDATE USING (true);
