import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export interface ProposalResponse {
  success: boolean;
  data: {
    proposal_id: number;
    filename: string;
    text_length: number;
    status: string;
    created_at: string;
  };
}

export interface ProposalDetail {
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
  outcome_updated_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface GenerateResponseResponse {
  success: boolean;
  message: string;
  data: {
    proposal_id: number;
    proposal_response: string;
    tokens_used?: number;
    status: string;
  };
}

const proposalService = {
  /**
   * Uploads an RFP file to the server and creates a new proposal record.
   * @param file - The RFP document (PDF, DOC, or DOCX).
   * @param onProgress - Optional callback receiving upload percentage (0–100).
   * @returns The created proposal's metadata including its ID.
   */
  uploadRFP: async (file: File, onProgress?: (progress: number) => void): Promise<ProposalResponse> => {
    const formData = new FormData();
    formData.append('rfp_file', file);

    const token = localStorage.getItem('token');

    const response = await axios.post<ProposalResponse>(
      `${API_URL}/api/proposals/create`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percentCompleted);
          }
        },
      }
    );

    return response.data;
  },

  /**
   * Fetches a single proposal by its ID.
   * @param proposalId - The numeric ID of the proposal.
   */
  getProposal: async (proposalId: number): Promise<ProposalDetail> => {
    const token = localStorage.getItem('token');

    const response = await axios.get(
      `${API_URL}/api/proposals/${proposalId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    return response.data.data.proposal;
  },

  /** Fetches all proposals belonging to the currently authenticated user. */
  getUserProposals: async (): Promise<ProposalDetail[]> => {
    const token = localStorage.getItem('token');

    const response = await axios.get(
      `${API_URL}/api/proposals`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    return response.data.data.proposals;
  },

  /**
   * Permanently deletes a proposal by ID.
   * @param proposalId - The numeric ID of the proposal to delete.
   */
  deleteProposal: async (proposalId: number): Promise<void> => {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_URL}/api/proposals/${proposalId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  /**
   * Records the win/loss outcome for a proposal, along with optional
   * contract value, competitor, and loss reason details.
   */
  updateOutcome: async (
    proposalId: number,
    data: {
      outcome: string;
      contract_value?: number | null;
      competitor_lost_to?: string | null;
      loss_reason?: string | null;
      loss_notes?: string | null;
    }
  ): Promise<void> => {
    const token = localStorage.getItem('token');
    await axios.put(`${API_URL}/api/proposals/${proposalId}/outcome`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  /**
   * Triggers AI generation of a proposal response for the given proposal.
   * The proposal must have extracted RFP text before this can succeed.
   * @param proposalId - The numeric ID of the proposal.
   */
  generateResponse: async (proposalId: number): Promise<GenerateResponseResponse> => {
    const token = localStorage.getItem('token');

    const response = await axios.post<GenerateResponseResponse>(
      `${API_URL}/api/proposals/${proposalId}/generate`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },
};

export default proposalService;
