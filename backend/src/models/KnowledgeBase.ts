import pool from '../config/database';

export interface KnowledgeBaseDocument {
  id: number;
  user_id: number;
  filename: string;
  document_type: string;
  content: string;
  file_size: number | null;
  created_at: Date;
  updated_at: Date;
}

export interface KnowledgeBaseInput {
  user_id: number;
  filename: string;
  document_type: string;
  content: string;
  file_size?: number;
}

class KnowledgeBaseModel {
  async create(data: KnowledgeBaseInput): Promise<KnowledgeBaseDocument> {
    const { user_id, filename, document_type, content, file_size } = data;
    const query = `
      INSERT INTO knowledge_base (user_id, filename, document_type, content, file_size)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, user_id, filename, document_type, content, file_size, created_at, updated_at
    `;
    const result = await pool.query(query, [user_id, filename, document_type, content, file_size || null]);
    return result.rows[0];
  }

  async findByUserId(user_id: number): Promise<KnowledgeBaseDocument[]> {
    const query = `
      SELECT id, user_id, filename, document_type, file_size, created_at, updated_at
      FROM knowledge_base
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [user_id]);
    return result.rows;
  }

  async findByUserIdWithContent(user_id: number): Promise<KnowledgeBaseDocument[]> {
    const query = `
      SELECT id, user_id, filename, document_type, content, file_size, created_at, updated_at
      FROM knowledge_base
      WHERE user_id = $1
      ORDER BY document_type, created_at DESC
    `;
    const result = await pool.query(query, [user_id]);
    return result.rows;
  }

  async delete(id: number, user_id: number): Promise<boolean> {
    const query = 'DELETE FROM knowledge_base WHERE id = $1 AND user_id = $2';
    const result = await pool.query(query, [id, user_id]);
    return result.rowCount !== null && result.rowCount > 0;
  }
}

export default new KnowledgeBaseModel();
