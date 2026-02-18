import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AuthForm from './components/auth/AuthForm';
import Dashboard from './components/common/Dashboard';
import PrivateRoute from './components/common/PrivateRoute';

/**
 * Alternative App.tsx using unified AuthForm with toggle
 *
 * To use this version:
 * 1. Rename current App.tsx to App-Original.tsx
 * 2. Rename this file to App.tsx
 * 3. Restart the development server
 */

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/auth" />} />
          <Route path="/auth" element={<AuthForm />} />
          <Route path="/login" element={<Navigate to="/auth" />} />
          <Route path="/register" element={<Navigate to="/auth" />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/auth" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
