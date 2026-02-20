import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../../contexts/AuthContext';
import authService from '../../services/authService';
import knowledgeBaseService, { KBDocument } from '../../services/knowledgeBaseService';
import './Settings.css';

type Tab = 'account' | 'knowledge-base' | 'subscription' | 'preferences';

const TABS = [
  { id: 'account' as Tab, label: 'Account Information', icon: '👤' },
  { id: 'knowledge-base' as Tab, label: 'Knowledge Base', icon: '📚' },
  { id: 'subscription' as Tab, label: 'Subscription & Billing', icon: '💳' },
  { id: 'preferences' as Tab, label: 'Preferences', icon: '🎛️' },
];

const DOCUMENT_TYPES = [
  { value: 'general', label: 'General' },
  { value: 'company_overview', label: 'Company Overview' },
  { value: 'case_study', label: 'Case Study' },
  { value: 'pricing', label: 'Pricing' },
  { value: 'team_bio', label: 'Team Bio' },
  { value: 'capability_statement', label: 'Capability Statement' },
];

const TYPE_COLORS: Record<string, string> = {
  general: '#6c757d',
  company_overview: '#667eea',
  case_study: '#28a745',
  pricing: '#fd7e14',
  team_bio: '#17a2b8',
  capability_statement: '#764ba2',
};

function formatBytes(bytes: number | null): string {
  if (!bytes) return '—';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Account Section ────────────────────────────────────────────────────────

const AccountSection: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileMsg, setProfileMsg] = useState('');
  const [profileErr, setProfileErr] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordErr, setPasswordErr] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);

  const handleProfileSave = async () => {
    setProfileErr('');
    setProfileMsg('');
    if (!name.trim() && !email.trim()) return;

    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setProfileErr('Please enter a valid email address');
        return;
      }
    }

    setProfileSaving(true);
    try {
      const res = await authService.updateProfile({ name: name.trim(), email: email.trim() });
      updateUser(res.data.user);
      setProfileMsg('Profile updated successfully.');
    } catch (err: any) {
      setProfileErr(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSave = async () => {
    setPasswordErr('');
    setPasswordMsg('');
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordErr('All password fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordErr('New passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordErr('New password must be at least 8 characters.');
      return;
    }

    setPasswordSaving(true);
    try {
      await authService.updatePassword(currentPassword, newPassword);
      setPasswordMsg('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordErr(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="settings-section">
      <h2>Account Information</h2>
      <p className="section-desc">Update your name, email address, and password.</p>

      <div className="settings-card">
        <h3>Profile</h3>
        <div className="form-row">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </div>
        <div className="form-row">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
          />
        </div>
        {profileErr && <div className="msg-error">{profileErr}</div>}
        {profileMsg && <div className="msg-success">{profileMsg}</div>}
        <button className="btn-save" onClick={handleProfileSave} disabled={profileSaving}>
          {profileSaving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>

      <div className="settings-card">
        <h3>Change Password</h3>
        <div className="form-row">
          <label>Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
          />
        </div>
        <div className="form-row">
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Min. 8 characters"
          />
        </div>
        <div className="form-row">
          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat new password"
          />
        </div>
        {passwordErr && <div className="msg-error">{passwordErr}</div>}
        {passwordMsg && <div className="msg-success">{passwordMsg}</div>}
        <button className="btn-save" onClick={handlePasswordSave} disabled={passwordSaving}>
          {passwordSaving ? 'Saving...' : 'Change Password'}
        </button>
      </div>

      <div className="settings-card info-card">
        <h3>Account Details</h3>
        <div className="info-row"><span>User ID</span><strong>#{user?.id}</strong></div>
        <div className="info-row"><span>Name</span><strong>{user?.name}</strong></div>
        <div className="info-row"><span>Email</span><strong>{user?.email}</strong></div>
      </div>
    </div>
  );
};

// ─── Knowledge Base Section ──────────────────────────────────────────────────

const KnowledgeBaseSection: React.FC = () => {
  const [documents, setDocuments] = useState<KBDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [documentType, setDocumentType] = useState('general');
  const [uploadError, setUploadError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    knowledgeBaseService.getDocuments()
      .then(setDocuments)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;
    const file = acceptedFiles[0];
    setUploadError('');
    setSuccessMessage('');
    setUploading(true);
    setUploadProgress(0);
    try {
      const doc = await knowledgeBaseService.uploadDocument(file, documentType, setUploadProgress);
      setDocuments((prev) => [{
        id: doc.id, user_id: 0, filename: doc.filename,
        document_type: doc.document_type, file_size: doc.file_size,
        created_at: doc.created_at, updated_at: doc.created_at,
      }, ...prev]);
      setSuccessMessage(`"${file.name}" uploaded successfully.`);
    } catch (err: any) {
      setUploadError(err.response?.data?.error || err.response?.data?.message || 'Failed to upload document');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [documentType]);

  const handleDelete = async (id: number, filename: string) => {
    if (!window.confirm(`Delete "${filename}"?`)) return;
    setDeleteError('');
    try {
      await knowledgeBaseService.deleteDocument(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    } catch {
      setDeleteError('Failed to delete document');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/markdown': ['.md'],
      'text/plain': ['.md'],
    },
    multiple: false,
    disabled: uploading,
  });

  return (
    <div className="settings-section">
      <h2>Knowledge Base</h2>
      <p className="section-desc">Manage documents that Claude uses to personalize your proposals.</p>

      <div className="settings-card">
        <h3>Upload Document</h3>
        <div className="form-row">
          <label>Document Type</label>
          <select value={documentType} onChange={(e) => setDocumentType(e.target.value)} disabled={uploading}>
            {DOCUMENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div {...getRootProps()} className={`kb-dropzone ${isDragActive ? 'active' : ''} ${uploading ? 'disabled' : ''}`}>
          <input {...getInputProps()} />
          {uploading ? (
            <div className="uploading-state">
              <div className="spinner" />
              <p>Uploading...</p>
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${uploadProgress}%` }} /></div>
            </div>
          ) : isDragActive ? (
            <p>Drop file here</p>
          ) : (
            <>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📁</div>
              <p>Drag & drop or click to browse</p>
              <p className="file-hint">PDF, DOC, DOCX, MD — Max 10MB</p>
            </>
          )}
        </div>
        {uploadError && <div className="msg-error">{uploadError}</div>}
        {successMessage && <div className="msg-success">{successMessage}</div>}
      </div>

      <div className="settings-card">
        <h3>Uploaded Documents <span className="badge">{documents.length}</span></h3>
        {deleteError && <div className="msg-error">{deleteError}</div>}
        {loading ? (
          <div className="kb-loading"><div className="spinner" /><p>Loading...</p></div>
        ) : documents.length === 0 ? (
          <div className="kb-empty"><p>No documents uploaded yet.</p></div>
        ) : (
          <table className="kb-table">
            <thead>
              <tr><th>Filename</th><th>Type</th><th>Size</th><th>Date</th><th></th></tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td className="filename-cell">📄 {doc.filename}</td>
                  <td>
                    <span className="type-badge" style={{ backgroundColor: TYPE_COLORS[doc.document_type] || '#6c757d' }}>
                      {DOCUMENT_TYPES.find((t) => t.value === doc.document_type)?.label || doc.document_type}
                    </span>
                  </td>
                  <td>{formatBytes(doc.file_size)}</td>
                  <td>{new Date(doc.created_at).toLocaleDateString()}</td>
                  <td><button className="btn-del" onClick={() => handleDelete(doc.id, doc.filename)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// ─── Placeholder Sections ────────────────────────────────────────────────────

const PlaceholderSection: React.FC<{ title: string; icon: string; description: string }> = ({ title, icon, description }) => (
  <div className="settings-section">
    <h2>{title}</h2>
    <p className="section-desc">{description}</p>
    <div className="settings-card placeholder-card">
      <div className="placeholder-icon">{icon}</div>
      <h3>Coming Soon</h3>
      <p>This feature is under development and will be available in a future update.</p>
    </div>
  </div>
);

// ─── Main Settings Page ──────────────────────────────────────────────────────

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('account');

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="settings-container">
      <nav className="settings-nav">
        <div className="nav-brand" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
          <h1>ProposalIQ</h1>
        </div>
        <div className="nav-links">
          <button className="nav-link nav-link-home" onClick={() => navigate('/dashboard')}>🏠 Dashboard</button>
          <button className="nav-link" onClick={() => navigate('/upload')}>New Proposal</button>
          <button className="nav-link" onClick={() => navigate('/proposals')}>My Proposals</button>
          <button className="nav-link" onClick={() => navigate('/analytics')}>Analytics</button>
          <button className="nav-link" onClick={() => navigate('/knowledge-base')}>Knowledge Base</button>
          <span className="nav-divider" />
          <span className="nav-user">{user?.name}</span>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="settings-layout">
        {/* Sidebar */}
        <aside className="settings-sidebar">
          <h3>Settings</h3>
          <nav>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={`sidebar-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="sidebar-icon">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="settings-main">
          {activeTab === 'account' && <AccountSection />}
          {activeTab === 'knowledge-base' && <KnowledgeBaseSection />}
          {activeTab === 'subscription' && (
            <PlaceholderSection
              title="Subscription & Billing"
              icon="💳"
              description="Manage your plan, billing details, and invoices."
            />
          )}
          {activeTab === 'preferences' && (
            <PlaceholderSection
              title="Preferences"
              icon="🎛️"
              description="Customize your ProposalIQ experience — theme, notifications, defaults."
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Settings;
