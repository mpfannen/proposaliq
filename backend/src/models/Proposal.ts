import pool from '../config/database';

export interface Proposal {
  id: number;
  user_id: number;
  rfp_filename: string;
  rfp_text: string | null;
  proposal_response: string | null;
  status: string;
  outcome: string;
  contract_value: number | null;
  competitor_lost_to: string | null;
  loss_reason: string | null;
  loss_notes: string | null;
  outcome_updated_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface ProposalInput {
  user_id: number;
  rfp_filename: string;
  rfp_text: string;
  proposal_response?: string;
  status?: string;
}

export interface OutcomeInput {
  outcome: string;
  contract_value?: number | null;
  competitor_lost_to?: string | null;
  loss_reason?: string | null;
  loss_notes?: string | null;
}

export interface ProposalResponse {
  id: number;
  user_id: number;
  rfp_filename: string;
  rfp_text: string | null;
  proposal_response: string | null;
  status: string;
  outcome: string;
  contract_value: number | null;
  competitor_lost_to: string | null;
  loss_reason: string | null;
  loss_notes: string | null;
  outcome_updated_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

const SELECT_COLS = `
  id, user_id, rfp_filename, rfp_text, proposal_response, status,
  outcome, contract_value, competitor_lost_to, loss_reason, loss_notes, outcome_updated_at,
  created_at, updated_at
`;

class ProposalModel {
  // Create a new proposal
  async create(proposalData: ProposalInput): Promise<ProposalResponse> {
    console.log('🔵 ProposalModel.create called');
    const { user_id, rfp_filename, rfp_text, status = 'draft' } = proposalData;

    try {
      const query = `
        INSERT INTO proposals (user_id, rfp_filename, rfp_text, status)
        VALUES ($1, $2, $3, $4)
        RETURNING ${SELECT_COLS}
      `;

      console.log('🔵 Executing INSERT query for proposal...');
      const result = await pool.query(query, [user_id, rfp_filename, rfp_text, status]);
      console.log('✅ Proposal created successfully:', result.rows[0].id);
      return result.rows[0];
    } catch (error: any) {
      console.error('❌ ProposalModel.create error:', error.message);
      throw error;
    }
  }

  // Find proposal by ID
  async findById(id: number): Promise<ProposalResponse | null> {
    const query = `SELECT ${SELECT_COLS} FROM proposals WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  // Find all proposals for a user
  async findByUserId(user_id: number): Promise<ProposalResponse[]> {
    const query = `
      SELECT ${SELECT_COLS}
      FROM proposals
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [user_id]);
    return result.rows;
  }

  // Update proposal status or response
  async update(id: number, updates: Partial<ProposalInput>): Promise<ProposalResponse | null> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (updates.rfp_text !== undefined) {
      fields.push(`rfp_text = $${paramCount++}`);
      values.push(updates.rfp_text);
    }
    if (updates.proposal_response !== undefined) {
      fields.push(`proposal_response = $${paramCount++}`);
      values.push(updates.proposal_response);
    }
    if (updates.status !== undefined) {
      fields.push(`status = $${paramCount++}`);
      values.push(updates.status);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const query = `
      UPDATE proposals
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING ${SELECT_COLS}
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  // Update win/loss outcome
  async updateOutcome(id: number, data: OutcomeInput): Promise<ProposalResponse | null> {
    const query = `
      UPDATE proposals
      SET outcome = $1,
          contract_value = $2,
          competitor_lost_to = $3,
          loss_reason = $4,
          loss_notes = $5,
          outcome_updated_at = NOW()
      WHERE id = $6
      RETURNING ${SELECT_COLS}
    `;
    const result = await pool.query(query, [
      data.outcome,
      data.contract_value ?? null,
      data.competitor_lost_to ?? null,
      data.loss_reason ?? null,
      data.loss_notes ?? null,
      id,
    ]);
    return result.rows[0] || null;
  }

  // Delete proposal
  async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM proposals WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }
}

export default new ProposalModel();
