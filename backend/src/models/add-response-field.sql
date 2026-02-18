-- Add proposal_response column to proposals table
ALTER TABLE proposals
ADD COLUMN IF NOT EXISTS proposal_response TEXT;

-- Add status for tracking generation progress
-- Update status enum if needed (draft, generating, completed)
