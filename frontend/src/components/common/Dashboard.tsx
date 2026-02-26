import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

/* ─── SVG Icons ──────────────────────────────────────────────────────────── */
const IconDocument = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="12" y1="18" x2="12" y2="12"/>
    <line x1="9" y1="15" x2="15" y2="15"/>
  </svg>
);

const IconList = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);

const IconBook = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
  </svg>
);

const IconBar = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);

const IconSettings = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
  </svg>
);

const IconLogout = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

/* ─── Dashboard ──────────────────────────────────────────────────────────── */
const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-root">
      {/* Nav */}
      <header className="dashboard-nav">
        <div className="dashboard-nav-inner">
          <span className="dashboard-logo">ProposalIQ</span>
          <div className="dashboard-nav-user">
            <span className="dashboard-welcome">Welcome, {user?.name}</span>
            <button
              className="dashboard-nav-btn"
              onClick={() => navigate('/settings')}
              aria-label="Settings"
            >
              <IconSettings />
              Settings
            </button>
            <button
              className="dashboard-nav-btn dashboard-nav-btn--outline"
              onClick={handleLogout}
              aria-label="Log out"
            >
              <IconLogout />
              Log out
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="dashboard-main">
        <div className="dashboard-content">
          <div className="dashboard-header">
            <h1>Dashboard</h1>
            <p>AI-powered RFP proposal drafts for your firm</p>
          </div>

          <div className="dashboard-grid">
            <article className="dashboard-card" tabIndex={0} role="button" onClick={() => navigate('/upload')} onKeyDown={(e) => e.key === 'Enter' && navigate('/upload')}>
              <div className="dashboard-card-icon">
                <IconDocument />
              </div>
              <div className="dashboard-card-body">
                <h2>Create New Proposal</h2>
                <p>Start a new AI-powered RFP response by uploading your document</p>
              </div>
              <button className="dashboard-card-action" onClick={(e) => { e.stopPropagation(); navigate('/upload'); }}>
                Get started
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
            </article>

            <article className="dashboard-card" tabIndex={0} role="button" onClick={() => navigate('/proposals')} onKeyDown={(e) => e.key === 'Enter' && navigate('/proposals')}>
              <div className="dashboard-card-icon">
                <IconList />
              </div>
              <div className="dashboard-card-body">
                <h2>My Proposals</h2>
                <p>View and manage all your existing proposal drafts in one place</p>
              </div>
              <button className="dashboard-card-action" onClick={(e) => { e.stopPropagation(); navigate('/proposals'); }}>
                View all
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
            </article>

            <article className="dashboard-card" tabIndex={0} role="button" onClick={() => navigate('/knowledge-base')} onKeyDown={(e) => e.key === 'Enter' && navigate('/knowledge-base')}>
              <div className="dashboard-card-icon">
                <IconBook />
              </div>
              <div className="dashboard-card-body">
                <h2>Knowledge Base</h2>
                <p>Upload your firm's documents to personalize every AI-generated proposal</p>
              </div>
              <button className="dashboard-card-action" onClick={(e) => { e.stopPropagation(); navigate('/knowledge-base'); }}>
                Manage docs
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
            </article>

            <article className="dashboard-card" tabIndex={0} role="button" onClick={() => navigate('/analytics')} onKeyDown={(e) => e.key === 'Enter' && navigate('/analytics')}>
              <div className="dashboard-card-icon">
                <IconBar />
              </div>
              <div className="dashboard-card-body">
                <h2>Analytics</h2>
                <p>Track your proposal activity and monitor submission history</p>
              </div>
              <button className="dashboard-card-action" onClick={(e) => { e.stopPropagation(); navigate('/analytics'); }}>
                View stats
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
            </article>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
