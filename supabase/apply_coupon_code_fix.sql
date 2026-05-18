-- Add coupon_code column to bookings if it doesn't exist
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS coupon_code TEXT;

-- Reload the postgREST schema cache to immediately resolve the error
NOTIFY pgrst, 'reload schema';
