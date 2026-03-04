import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './styles/global.css';

// Pages
import LandingPage    from './pages/LandingPage';
import LoginPage      from './pages/LoginPage';
import Dashboard      from './pages/Dashboard';
import StockResearch  from './pages/StockResearch';
import AIChat         from './pages/AIChat';
import ResearchPage   from './pages/ResearchPage';
import Circulars      from './pages/Circulars';
import ExcelAgent     from './pages/ExcelAgent';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="app-loading"><span>▲</span></div>;
  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="app-loading"><span>▲</span></div>;
  return user ? <Navigate to="/dashboard" /> : children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"        element={<LandingPage />} />
          <Route path="/login"   element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/stocks"    element={<PrivateRoute><StockResearch /></PrivateRoute>} />
          <Route path="/ai-chat"   element={<PrivateRoute><AIChat /></PrivateRoute>} />
          <Route path="/research"  element={<PrivateRoute><ResearchPage /></PrivateRoute>} />
          <Route path="/circulars" element={<PrivateRoute><Circulars /></PrivateRoute>} />
          <Route path="/excel"     element={<PrivateRoute><ExcelAgent /></PrivateRoute>} />
          <Route path="*"          element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>

      <style>{`
        .app-loading {
          height: 100vh; display: flex; align-items: center; justify-content: center;
          background: var(--black); color: var(--gold); font-size: 32px;
          animation: pulse 1s infinite;
        }
      `}</style>
    </AuthProvider>
  );
}

export default App;
