import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import proposalService from '../../services/proposalService';
import './FileUpload.css';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

const FileUpload: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      return;
    }

    const file = acceptedFiles[0];
    if (file.size > MAX_FILE_SIZE) {
      setError(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is 100MB.`);
      return;
    }
    setError('');
    setUploading(true);
    setProgress(0);

    try {
      const response = await proposalService.uploadRFP(file, (progressPercent) => {
        setProgress(progressPercent);
      });

      console.log('Upload successful:', response);

      // Redirect to proposal detail page
      navigate(`/proposal/${response.data.proposal_id}`);
    } catch (err: any) {
      console.error('Upload error:', err);
      let message = 'Failed to upload file. Please try again.';
      if (err.code === 'ECONNABORTED' || err.message?.toLowerCase().includes('timeout')) {
        message = 'Upload timed out. The file may be too large or your connection is slow. Please try again.';
      } else if (!err.response) {
        message = 'Network error — please check your connection and try again.';
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      }
      setError(message);
      setUploading(false);
      setProgress(0);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    multiple: false,
    disabled: uploading,
  });

  return (
    <div className="file-upload-container">
      <nav className="page-nav">
        <h1 onClick={() => navigate('/dashboard')}>ProposalIQ</h1>
        <button className="page-nav-btn" onClick={() => navigate('/dashboard')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Dashboard
        </button>
      </nav>
      <div className="file-upload-body">
      <div className="file-upload-card">
        <h2>Create New Proposal</h2>
        <p className="subtitle">Upload your RFP document to get started</p>

        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'active' : ''} ${uploading ? 'disabled' : ''}`}
        >
          <input {...getInputProps()} />

          {uploading ? (
            <div className="uploading-state">
              <div className="spinner"></div>
              <p>Uploading and processing...</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
              </div>
              <p className="progress-text">{progress}%</p>
            </div>
          ) : (
            <div className="upload-prompt">
              <div className="upload-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              </div>
              {isDragActive ? (
                <p className="drag-text">Drop the file here</p>
              ) : (
                <>
                  <p className="drag-text">Drag &amp; drop your RFP here</p>
                  <p className="or-text">or</p>
                  <button className="browse-btn">Browse files</button>
                  <p className="file-types">Supported: PDF, DOC, DOCX &mdash; max 100MB</p>
                </>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="error-message">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{flexShrink:0,marginTop:1}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </div>
        )}

        <button
          onClick={() => navigate('/dashboard')}
          className="cancel-btn"
          disabled={uploading}
        >
          Cancel
        </button>
      </div>
      </div>
    </div>
  );
};

export default FileUpload;
