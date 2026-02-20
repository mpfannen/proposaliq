import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
        padding: '60px 48px',
        maxWidth: '480px',
        width: '100%',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>🔍</div>
        <h1 style={{ color: '#667eea', fontSize: 80, margin: '0 0 8px', fontWeight: 800, lineHeight: 1 }}>
          404
        </h1>
        <h2 style={{ color: '#333', fontSize: 24, margin: '0 0 16px', fontWeight: 600 }}>
          Page Not Found
        </h2>
        <p style={{ color: '#666', fontSize: 15, lineHeight: 1.6, margin: '0 0 36px' }}>
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 28px',
              borderRadius: '8px',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'white',
              color: '#667eea',
              border: '2px solid #667eea',
              padding: '12px 28px',
              borderRadius: '8px',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
