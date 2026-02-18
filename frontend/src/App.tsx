import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/common/Dashboard';
import PrivateRoute from './components/common/PrivateRoute';
import FileUpload from './components/proposals/FileUpload';
import ProposalDetail from './components/proposals/ProposalDetail';
import MyProposals from './components/proposals/MyProposals';
import KnowledgeBase from './components/knowledge-base/KnowledgeBase';
import Settings from './components/settings/Settings';
import Analytics from './components/analytics/Analytics';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <PrivateRoute>
                <FileUpload />
              </PrivateRoute>
            }
          />
          <Route
            path="/proposal/:id"
            element={
              <PrivateRoute>
                <ProposalDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/proposals"
            element={
              <PrivateRoute>
                <MyProposals />
              </PrivateRoute>
            }
          />
          <Route
            path="/knowledge-base"
            element={
              <PrivateRoute>
                <KnowledgeBase />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <PrivateRoute>
                <Analytics />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
