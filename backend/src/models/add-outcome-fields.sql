-- Win/Loss tracking fields for proposals
ALTER TABLE proposals
  ADD COLUMN IF NOT EXISTS outcome VARCHAR(50) DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS contract_value DECIMAL(12, 2),
  ADD COLUMN IF NOT EXISTS competitor_lost_to VARCHAR(255),
  ADD COLUMN IF NOT EXISTS loss_reason TEXT,
  ADD COLUMN IF NOT EXISTS outcome_updated_at TIMESTAMP;

-- Index for outcome filtering
CREATE INDEX IF NOT EXISTS idx_proposals_outcome ON proposals(outcome);
