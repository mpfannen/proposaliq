import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import knowledgeBaseService, { KBDocument } from '../../services/knowledgeBaseService';
import './KnowledgeBase.css';

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
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const KnowledgeBase: React.FC = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<KBDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [documentType, setDocumentType] = useState('general');
  const [uploadError, setUploadError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const docs = await knowledgeBaseService.getDocuments();
      setDocuments(docs);
    } catch (err) {
      console.error('Failed to load knowledge base:', err);
    } finally {
      setLoading(false);
    }
  };

  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    if (file.size > MAX_FILE_SIZE) {
      setUploadError(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is 100MB.`);
      return;
    }
    setUploadError('');
    setSuccessMessage('');
    setUploading(true);
    setUploadProgress(0);

    try {
      const doc = await knowledgeBaseService.uploadDocument(file, documentType, setUploadProgress);
      setDocuments((prev) => [
        {
          id: doc.id,
          user_id: 0,
          filename: doc.filename,
          document_type: doc.document_type,
          file_size: doc.file_size,
          created_at: doc.created_at,
          updated_at: doc.created_at,
        },
        ...prev,
      ]);
      setSuccessMessage(`"${file.name}" uploaded successfully.`);
    } catch (err: any) {
      setUploadError(err.response?.data?.error || err.response?.data?.message || 'Failed to upload document');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id: number, filename: string) => {
    if (!window.confirm(`Delete "${filename}"?`)) return;

    setDeleteError('');
    try {
      await knowledgeBaseService.deleteDocument(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    } catch (err: any) {
      setDeleteError(err.response?.data?.message || 'Failed to delete document');
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
    <div className="kb-container">
      <nav className="kb-nav">
        <div className="nav-brand">
          <h1>ProposalIQ</h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-back-nav" onClick={() => navigate('/settings')}>Settings</button>
          <button className="btn-back-nav" onClick={() => navigate('/dashboard')}>← Dashboard</button>
        </div>
      </nav>

      <div className="kb-content">
        <div className="kb-header">
          <h2>Knowledge Base</h2>
          <p>Upload company documents to personalize AI-generated proposals</p>
        </div>

        {/* Upload Section */}
        <div className="kb-upload-card">
          <h3>Add Document</h3>

          <div className="type-selector">
            <label>Document Type</label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              disabled={uploading}
            >
              {DOCUMENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div
            {...getRootProps()}
            className={`kb-dropzone ${isDragActive ? 'active' : ''} ${uploading ? 'disabled' : ''}`}
          >
            <input {...getInputProps()} />
            {uploading ? (
              <div className="uploading-state">
                <div className="spinner"></div>
                <p>Uploading and extracting text...</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            ) : isDragActive ? (
              <p>Drop the file here</p>
            ) : (
              <>
                <div className="upload-icon">📁</div>
                <p>Drag & drop a document here</p>
                <p className="file-hint">or click to browse — PDF, DOC, DOCX, MD (Max 100MB)</p>
              </>
            )}
          </div>

          {uploadError && <div className="kb-error">{uploadError}</div>}
          {successMessage && <div className="kb-success">{successMessage}</div>}
        </div>

        {/* Documents List */}
        <div className="kb-list-card">
          <h3>Uploaded Documents <span className="doc-count">{documents.length}</span></h3>

          {deleteError && <div className="kb-error">{deleteError}</div>}

          {loading ? (
            <div className="kb-loading">
              <div className="spinner"></div>
              <p>Loading documents...</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="kb-empty">
              <div className="empty-icon">📂</div>
              <p>No documents uploaded yet.</p>
              <p className="empty-hint">Upload company documents above to enhance your proposals.</p>
            </div>
          ) : (
            <table className="kb-table">
              <thead>
                <tr>
                  <th>Filename</th>
                  <th>Type</th>
                  <th>Size</th>
                  <th>Uploaded</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id}>
                    <td className="filename-cell">📄 {doc.filename}</td>
                    <td>
                      <span
                        className="type-badge"
                        style={{ backgroundColor: TYPE_COLORS[doc.document_type] || '#6c757d' }}
                      >
                        {DOCUMENT_TYPES.find((t) => t.value === doc.document_type)?.label || doc.document_type}
                      </span>
                    </td>
                    <td>{formatBytes(doc.file_size)}</td>
                    <td>{new Date(doc.created_at).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(doc.id, doc.filename)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;
