-- Coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  discount_percent INTEGER DEFAULT 0,
  discount_amount INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  max_uses INTEGER DEFAULT 0, -- 0 for unlimited
  current_uses INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active coupons" ON coupons FOR SELECT USING (is_active = TRUE);

-- Initial coupons
INSERT INTO coupons (code, discount_percent) VALUES ('CHAMPION26', 20) ON CONFLICT DO NOTHING;
INSERT INTO coupons (code, discount_percent) VALUES ('FIRE50', 50) ON CONFLICT DO NOTHING;
INSERT INTO coupons (code, discount_percent) VALUES ('FIRE100', 100) ON CONFLICT DO NOTHING;
