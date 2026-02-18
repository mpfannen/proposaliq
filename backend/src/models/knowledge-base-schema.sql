-- Knowledge Base Schema
-- Run this in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS knowledge_base (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  filename VARCHAR(500) NOT NULL,
  document_type VARCHAR(100) NOT NULL DEFAULT 'general',
  content TEXT NOT NULL,
  file_size INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast per-user lookups
CREATE INDEX IF NOT EXISTS idx_knowledge_base_user_id ON knowledge_base(user_id);

-- Index for filtering by document type
CREATE INDEX IF NOT EXISTS idx_knowledge_base_document_type ON knowledge_base(document_type);

-- Auto-update updated_at (reuses the function already defined in schema.sql)
DROP TRIGGER IF EXISTS update_knowledge_base_updated_at ON knowledge_base;
CREATE TRIGGER update_knowledge_base_updated_at
  BEFORE UPDATE ON knowledge_base
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
