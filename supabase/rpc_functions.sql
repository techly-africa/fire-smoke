-- =============================================================
-- RPC FUNCTIONS — replaces all direct REST PATCH calls
-- All functions use SECURITY DEFINER to bypass RLS on writes.
-- These are called via supabase.rpc() (HTTP POST) instead of
-- .update() (HTTP PATCH), working around the CORS restriction
-- that blocks PATCH on this project.
-- Run this in: Supabase Dashboard → SQL Editor
-- =============================================================

-- 1. update_setting
--    Used by AdminDashboard LOGISTICS tab (capacity, early bird).
CREATE OR REPLACE FUNCTION update_setting(p_key TEXT, p_value TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE settings
  SET value      = p_value,
      updated_at = NOW()
  WHERE key = p_key;
END;
$$;

-- 2. update_cms_section
--    Used by AdminDashboard CMS tab.
CREATE OR REPLACE FUNCTION update_cms_section(p_key TEXT, p_content JSONB)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO cms (section_key, content, updated_at)
  VALUES (p_key, p_content, NOW())
  ON CONFLICT (section_key) 
  DO UPDATE SET 
    content    = EXCLUDED.content,
    updated_at = EXCLUDED.updated_at;
END;
$$;

-- 3. confirm_booking
--    Sets payment_status = CONFIRMED and assigns a ticket number.
CREATE OR REPLACE FUNCTION confirm_booking(p_id UUID, p_ticket_number TEXT)
RETURNS SETOF bookings
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  UPDATE bookings
  SET payment_status = 'CONFIRMED',
      ticket_number  = p_ticket_number,
      confirmed_at   = NOW(),
      ticket_sent    = true
  WHERE id = p_id
  RETURNING *;
END;
$$;

-- 4. reject_booking
--    Sets payment_status = REJECTED.
CREATE OR REPLACE FUNCTION reject_booking(p_id UUID)
RETURNS SETOF bookings
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  UPDATE bookings
  SET payment_status = 'REJECTED'
  WHERE id = p_id
  RETURNING *;
END;
$$;

-- 5. validate_ticket
--    Marks a confirmed ticket as used. Returns the booking row.
--    Raises an exception if not found, not confirmed, or already used.
CREATE OR REPLACE FUNCTION validate_ticket(p_ticket_number TEXT)
RETURNS SETOF bookings
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_booking bookings;
BEGIN
  SELECT * INTO v_booking
  FROM bookings
  WHERE ticket_number  = p_ticket_number
    AND payment_status = 'CONFIRMED';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Ticket not found or not confirmed.';
  END IF;

  IF v_booking.used_at IS NOT NULL THEN
    RAISE EXCEPTION 'Ticket already validated at %.',
      TO_CHAR(v_booking.used_at AT TIME ZONE 'UTC', 'HH24:MI:SS');
  END IF;

  RETURN QUERY
  UPDATE bookings
  SET used_at = NOW()
  WHERE id = v_booking.id
  RETURNING *;
END;
$$;

-- 6. delete_booking
--    Used by AdminDashboard to remove test/invalid bookings.
CREATE OR REPLACE FUNCTION delete_booking(p_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM bookings WHERE id = p_id;
END;
$$;

-- 7. create_coupon
--    Used by AdminDashboard to add new discount codes.
CREATE OR REPLACE FUNCTION create_coupon(p_code TEXT, p_discount_percent INTEGER, p_max_uses INTEGER DEFAULT 0)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO coupons (code, discount_percent, max_uses, is_active)
  VALUES (UPPER(p_code), p_discount_percent, p_max_uses, true);
END;
$$;

-- 8. delete_coupon
--    Used by AdminDashboard to remove coupons.
CREATE OR REPLACE FUNCTION delete_coupon(p_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM coupons WHERE id = p_id;
END;
$$;
