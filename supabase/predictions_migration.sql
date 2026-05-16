-- =============================================================
-- PREDICTIONS TABLE
-- =============================================================

CREATE TABLE IF NOT EXISTS predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  team1_score INT NOT NULL,
  team2_score INT NOT NULL,
  match_id TEXT DEFAULT 'UCL_FINAL_2026',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (anyone can predict)
-- But we can add a rate limit or email validation later
CREATE POLICY "Allow public inserts" ON predictions
  FOR INSERT WITH CHECK (true);

-- Allow public selects for the count (optional)
CREATE POLICY "Allow public select" ON predictions
  FOR SELECT USING (true);

-- =============================================================
-- RPC: submit_prediction
-- =============================================================

CREATE OR REPLACE FUNCTION submit_prediction(
  p_email TEXT, 
  p_score1 INT, 
  p_score2 INT,
  p_match_id TEXT DEFAULT 'UCL_FINAL_2026'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- We could add logic here to prevent multiple predictions per email
  INSERT INTO predictions (email, team1_score, team2_score, match_id)
  VALUES (p_email, p_score1, p_score2, p_match_id);
END;
$$;
