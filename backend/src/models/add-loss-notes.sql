-- Add loss_notes column for structured loss tracking
-- loss_reason already stores structured values (price_too_high, timeline_issues, etc.)
-- loss_notes stores free-text "other" detail or additional context
ALTER TABLE proposals
  ADD COLUMN IF NOT EXISTS loss_notes TEXT;
