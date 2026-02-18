import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import proposalService, { ProposalDetail } from '../../services/proposalService';
import './MyProposals.css';

const STATUS_FILTERS = ['All', 'draft', 'generating', 'completed'];

const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  generating: 'Generating',
  completed: 'Completed',
};

const LOSS_REASONS = [
  { value: 'price_too_high', label: 'Price too high' },
  { value: 'timeline_issues', label: "Timeline couldn't be met" },
  { value: 'lack_experience', label: 'Lacked relevant experience' },
  { value: 'late_submission', label: 'Proposal submitted late' },
  { value: 'missing_certifications', label: 'Missing required certifications' },
  { value: 'scope_mismatch', label: "Scope didn't match requirements" },
  { value: 'lost_to_incumbent', label: 'Lost to incumbent/existing vendor' },
  { value: 'no_response', label: "Client didn't respond" },
  { value: 'other', label: 'Other' },
];

interface OutcomeModal {
  proposalId: number;
  type: 'won' | 'lost';
  contractValue: string;
  competitor: string;
  lossReason: string;
  lossOtherText: string;
  lossNotes: string;
}

const MyProposals: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [proposals, setProposals] = useState<ProposalDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [outcomeModal, setOutcomeModal] = useState<OutcomeModal | null>(null);
  const [updatingOutcomeId, setUpdatingOutcomeId] = useState<number | null>(null);

  useEffect(() => {
    proposalService.getUserProposals()
      .then(setProposals)
      .catch(() => setError('Failed to load proposals'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return proposals.filter((p) => {
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
      const matchesSearch = p.rfp_filename.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [proposals, statusFilter, search]);

  const handleDelete = async (id: number, filename: string) => {
    if (!window.confirm(`Delete "${filename}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await proposalService.deleteProposal(id);
      setProposals((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to delete proposal');
    } finally {
      setDeletingId(null);
    }
  };

  const handleOutcomeChange = (proposalId: number, newOutcome: string) => {
    if (newOutcome === 'pending') {
      handleOutcomeUpdate(proposalId, 'pending', {});
    } else if (newOutcome === 'won') {
      setOutcomeModal({ proposalId, type: 'won', contractValue: '', competitor: '', lossReason: '', lossOtherText: '', lossNotes: '' });
    } else if (newOutcome === 'lost') {
      setOutcomeModal({ proposalId, type: 'lost', contractValue: '', competitor: '', lossReason: '', lossOtherText: '', lossNotes: '' });
    }
  };

  const handleOutcomeUpdate = async (
    proposalId: number,
    outcome: string,
    extras: {
      contractValue?: string;
      competitor?: string;
      lossReason?: string;
      lossNotes?: string;
    }
  ) => {
    setUpdatingOutcomeId(proposalId);
    try {
      await proposalService.updateOutcome(proposalId, {
        outcome,
        contract_value: extras.contractValue ? parseFloat(extras.contractValue) : null,
        competitor_lost_to: extras.competitor || null,
        loss_reason: extras.lossReason || null,
        loss_notes: extras.lossNotes || null,
      });
      setProposals((prev) =>
        prev.map((p) =>
          p.id === proposalId
            ? {
                ...p,
                outcome,
                contract_value: extras.contractValue ? parseFloat(extras.contractValue) : null,
                competitor_lost_to: extras.competitor || null,
                loss_reason: extras.lossReason || null,
                loss_notes: extras.lossNotes || null,
              }
            : p
        )
      );
      setOutcomeModal(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update outcome');
    } finally {
      setUpdatingOutcomeId(null);
    }
  };

  const handleModalSave = () => {
    if (!outcomeModal) return;
    const lossNotesCombined =
      outcomeModal.lossReason === 'other'
        ? [outcomeModal.lossOtherText, outcomeModal.lossNotes].filter(Boolean).join('\n')
        : outcomeModal.lossNotes;
    handleOutcomeUpdate(outcomeModal.proposalId, outcomeModal.type, {
      contractValue: outcomeModal.contractValue,
      competitor: outcomeModal.competitor,
      lossReason: outcomeModal.lossReason,
      lossNotes: lossNotesCombined,
    });
  };

  const handleModalSkip = () => {
    if (!outcomeModal) return;
    handleOutcomeUpdate(outcomeModal.proposalId, outcomeModal.type, {});
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const counts = useMemo(() => ({
    all: proposals.length,
    draft: proposals.filter((p) => p.status === 'draft').length,
    generating: proposals.filter((p) => p.status === 'generating').length,
    completed: proposals.filter((p) => p.status === 'completed').length,
  }), [proposals]);

  return (
    <div className="my-proposals-container">
      <nav className="mp-nav">
        <div className="nav-brand" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
          <h1>ProposalIQ</h1>
        </div>
        <div className="nav-links">
          <button className="nav-link nav-link-home" onClick={() => navigate('/dashboard')}>🏠 Dashboard</button>
          <button className="nav-link" onClick={() => navigate('/upload')}>New Proposal</button>
          <button className="nav-link" onClick={() => navigate('/analytics')}>Analytics</button>
          <button className="nav-link" onClick={() => navigate('/knowledge-base')}>Knowledge Base</button>
          <button className="nav-link" onClick={() => navigate('/settings')}>Settings</button>
          <span className="nav-divider" />
          <span className="nav-user">{user?.name}</span>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="mp-content">
        <div className="mp-header">
          <div>
            <h2>My Proposals</h2>
            <p>{proposals.length} proposal{proposals.length !== 1 ? 's' : ''} total</p>
          </div>
          <button className="btn-new" onClick={() => navigate('/upload')}>+ New Proposal</button>
        </div>

        <div className="mp-toolbar">
          <input
            type="text"
            className="mp-search"
            placeholder="Search by filename..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="status-filters">
            {STATUS_FILTERS.map((s) => {
              const count = s === 'All' ? counts.all : counts[s as keyof typeof counts];
              return (
                <button
                  key={s}
                  className={`filter-btn ${statusFilter === s ? 'active' : ''} ${s !== 'All' ? s : ''}`}
                  onClick={() => setStatusFilter(s)}
                >
                  {s === 'All' ? 'All' : STATUS_LABELS[s]}
                  <span className="filter-count">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {error && <div className="mp-error">{error}</div>}

        {loading ? (
          <div className="mp-loading">
            <div className="spinner" />
            <p>Loading proposals...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="mp-empty">
            <div className="empty-icon">📋</div>
            {proposals.length === 0 ? (
              <>
                <p>No proposals yet.</p>
                <button className="btn-new" onClick={() => navigate('/upload')}>Upload your first RFP</button>
              </>
            ) : (
              <p>No proposals match your search.</p>
            )}
          </div>
        ) : (
          <div className="mp-table-wrapper">
            <table className="mp-table">
              <thead>
                <tr>
                  <th>RFP Filename</th>
                  <th>Status</th>
                  <th>Outcome</th>
                  <th>Created</th>
                  <th>Last Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((proposal) => {
                  const outcome = proposal.outcome || 'pending';
                  return (
                    <tr key={proposal.id}>
                      <td className="filename-cell">
                        <span className="file-icon">📄</span>
                        {proposal.rfp_filename}
                      </td>
                      <td>
                        <span className={`status-badge ${proposal.status}`}>
                          {STATUS_LABELS[proposal.status] || proposal.status}
                        </span>
                      </td>
                      <td>
                        <select
                          className={`outcome-select outcome-${outcome}`}
                          value={outcome}
                          onChange={(e) => handleOutcomeChange(proposal.id, e.target.value)}
                          disabled={updatingOutcomeId === proposal.id}
                        >
                          <option value="pending">⏳ Pending</option>
                          <option value="won">✅ Won</option>
                          <option value="lost">❌ Lost</option>
                        </select>
                      </td>
                      <td className="date-cell">{new Date(proposal.created_at).toLocaleDateString()}</td>
                      <td className="date-cell">{new Date(proposal.updated_at).toLocaleDateString()}</td>
                      <td className="actions-cell">
                        <button className="btn-view" onClick={() => navigate(`/proposal/${proposal.id}`)}>View</button>
                        <button className="btn-edit" onClick={() => navigate(`/proposal/${proposal.id}`)}>Edit</button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(proposal.id, proposal.rfp_filename)}
                          disabled={deletingId === proposal.id}
                        >
                          {deletingId === proposal.id ? '...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Outcome Modal */}
      {outcomeModal && (
        <div className="modal-overlay" onClick={() => setOutcomeModal(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setOutcomeModal(null)}>✕</button>

            {outcomeModal.type === 'won' ? (
              <>
                <h3>🏆 Congratulations!</h3>
                <p className="modal-subtitle">Record the win details for your analytics.</p>
                <div className="modal-field">
                  <label>Contract Value ($)</label>
                  <input
                    type="number"
                    placeholder="e.g. 50000"
                    min="0"
                    value={outcomeModal.contractValue}
                    onChange={(e) => setOutcomeModal((prev) => prev ? { ...prev, contractValue: e.target.value } : prev)}
                  />
                </div>
              </>
            ) : (
              <>
                <h3>Sorry you didn't win this one</h3>
                <p className="modal-subtitle">Help us learn what happened:</p>

                <div className="modal-field">
                  <label>Lost to competitor (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Corp"
                    value={outcomeModal.competitor}
                    onChange={(e) => setOutcomeModal((prev) => prev ? { ...prev, competitor: e.target.value } : prev)}
                  />
                </div>

                <div className="modal-field">
                  <label>Primary reason for loss:</label>
                  <div className="loss-reasons">
                    {LOSS_REASONS.map(({ value, label }) => (
                      <label key={value} className="reason-option">
                        <input
                          type="radio"
                          name="lossReason"
                          value={value}
                          checked={outcomeModal.lossReason === value}
                          onChange={(e) =>
                            setOutcomeModal((prev) =>
                              prev ? { ...prev, lossReason: e.target.value, lossOtherText: '' } : prev
                            )
                          }
                        />
                        <span className="reason-label">{label}</span>
                        {value === 'other' && outcomeModal.lossReason === 'other' && (
                          <input
                            type="text"
                            className="other-text-input"
                            placeholder="Please describe..."
                            value={outcomeModal.lossOtherText}
                            onChange={(e) =>
                              setOutcomeModal((prev) => prev ? { ...prev, lossOtherText: e.target.value } : prev)
                            }
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                          />
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="modal-field">
                  <label>Additional notes (optional)</label>
                  <textarea
                    placeholder="Any other context about what happened..."
                    value={outcomeModal.lossNotes}
                    onChange={(e) => setOutcomeModal((prev) => prev ? { ...prev, lossNotes: e.target.value } : prev)}
                  />
                </div>
              </>
            )}

            <div className="modal-actions">
              <button
                className="btn-modal-skip"
                onClick={handleModalSkip}
                disabled={updatingOutcomeId === outcomeModal.proposalId}
              >
                Skip
              </button>
              <button
                className="btn-modal-primary"
                onClick={handleModalSave}
                disabled={updatingOutcomeId === outcomeModal.proposalId}
              >
                {updatingOutcomeId === outcomeModal.proposalId ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProposals;
