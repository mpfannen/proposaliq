import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <h1>ProposalIQ</h1>
        </div>
        <div className="nav-user">
          <span className="welcome-text">Welcome, {user?.name}!</span>
          <button onClick={() => navigate('/settings')} className="btn-logout" style={{ marginRight: 8 }}>
            Settings
          </button>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h2>Dashboard</h2>
          <p>AI-Powered RFP Response Tool</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-icon">📝</div>
            <h3>Create New Proposal</h3>
            <p>Start a new AI-powered RFP response</p>
            <button className="btn-action" onClick={() => navigate('/upload')}>Get Started</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📋</div>
            <h3>My Proposals</h3>
            <p>View and manage your existing proposals</p>
            <button className="btn-action" onClick={() => navigate('/proposals')}>View All</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📚</div>
            <h3>Knowledge Base</h3>
            <p>Upload company docs to personalize AI proposals</p>
            <button className="btn-action" onClick={() => navigate('/knowledge-base')}>Manage Docs</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📊</div>
            <h3>Analytics</h3>
            <p>Track your proposal success rates</p>
            <button className="btn-action" onClick={() => navigate('/analytics')}>View Stats</button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
