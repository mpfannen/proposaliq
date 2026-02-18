import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import proposalService, { ProposalDetail as ProposalType } from '../../services/proposalService';
import { printProposal } from '../../utils/printProposal';
import './ProposalDetail.css';

const ProposalDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState<ProposalType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState('');

  useEffect(() => {
    const fetchProposal = async () => {
      if (!id) {
        setError('No proposal ID provided');
        setLoading(false);
        return;
      }

      try {
        const data = await proposalService.getProposal(parseInt(id));
        setProposal(data);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching proposal:', err);
        setError(err.response?.data?.message || 'Failed to load proposal');
        setLoading(false);
      }
    };

    fetchProposal();
  }, [id]);

  const handleGenerateResponse = async () => {
    if (!id) return;

    setGenerating(true);
    setGenerateError('');

    try {
      const result = await proposalService.generateResponse(parseInt(id));

      // Update the proposal with the generated response
      setProposal((prev) => prev ? {
        ...prev,
        proposal_response: result.data.proposal_response,
        status: result.data.status,
      } : null);

      console.log('✅ Response generated successfully');
      if (result.data.tokens_used) {
        console.log('📊 Tokens used:', result.data.tokens_used);
      }
    } catch (err: any) {
      console.error('Error generating response:', err);
      const backendError = err.response?.data?.error || err.response?.data?.message || 'Failed to generate response';
      setGenerateError(backendError);
    } finally {
      setGenerating(false);
    }
  };

  const PageNav = () => (
    <nav className="page-nav">
      <h1 onClick={() => navigate('/dashboard')}>ProposalIQ</h1>
      <button className="page-nav-btn" onClick={() => navigate('/dashboard')}>🏠 Dashboard</button>
    </nav>
  );

  if (loading) {
    return (
      <div className="proposal-detail-container">
        <PageNav />
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading proposal...</p>
        </div>
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="proposal-detail-container">
        <PageNav />
        <div className="error-state">
          <h2>Error</h2>
          <p>{error || 'Proposal not found'}</p>
          <button onClick={() => navigate('/proposals')} className="btn-back">
            Back to My Proposals
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="proposal-detail-container">
      <PageNav />
      <div className="proposal-detail-body">
      <div className="proposal-detail-card">
        <div className="proposal-header">
          <button onClick={() => navigate('/proposals')} className="back-btn">
            ← Back to My Proposals
          </button>
          <h1>Proposal Details</h1>
        </div>

        <div className="proposal-meta">
          <div className="meta-item">
            <label>Filename:</label>
            <span>{proposal.rfp_filename}</span>
          </div>
          <div className="meta-item">
            <label>Status:</label>
            <span className={`status-badge ${proposal.status}`}>
              {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
            </span>
          </div>
          <div className="meta-item">
            <label>Created:</label>
            <span>{new Date(proposal.created_at).toLocaleString()}</span>
          </div>
          <div className="meta-item">
            <label>Text Length:</label>
            <span>{proposal.rfp_text?.length || 0} characters</span>
          </div>
        </div>

        <div className="proposal-content">
          <h2>Extracted RFP Text</h2>
          <div className="text-preview">
            {proposal.rfp_text ? (
              <pre>{proposal.rfp_text}</pre>
            ) : (
              <p className="no-text">No text extracted</p>
            )}
          </div>
        </div>

        {proposal.proposal_response && (
          <div className="proposal-content">
            <h2>AI-Generated Proposal Response</h2>
            <div className="text-preview">
              <pre>{proposal.proposal_response}</pre>
            </div>
          </div>
        )}

        {generateError && (
          <div className="error-message">
            <p>❌ {generateError}</p>
          </div>
        )}

        <div className="proposal-actions">
          <button
            className="btn-primary"
            onClick={handleGenerateResponse}
            disabled={generating || proposal.status === 'generating' || !proposal.rfp_text}
          >
            {generating || proposal.status === 'generating'
              ? '⏳ Generating Response...'
              : proposal.proposal_response
                ? '🔄 Regenerate Response'
                : '🤖 Generate Response'
            }
          </button>
          <button
            className="btn-print-detail"
            onClick={() => printProposal(proposal)}
            disabled={!proposal.proposal_response}
            title={!proposal.proposal_response ? 'Generate a response first' : 'Print proposal'}
          >
            🖨️ Print
          </button>
          <button onClick={() => navigate('/proposals')} className="btn-secondary">
            Close
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ProposalDetail;
