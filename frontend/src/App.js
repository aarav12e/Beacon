import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { AuthProvider } from './context/AuthContext';
import './styles/global.css';
import './styles/mobile.css';
import BottomNav from './components/common/BottomNav';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import StockResearch from './pages/StockResearch';
import AIChat from './pages/AIChat';
import ResearchPage from './pages/ResearchPage';
import Circulars from './pages/Circulars';
import ExcelAgent from './pages/ExcelAgent';

/** Requires the user to be signed in via Clerk */
const PrivateRoute = ({ children }) => (
  <>
    <SignedIn>{children}</SignedIn>
    <SignedOut><RedirectToSignIn /></SignedOut>
  </>
);

/** Smooth fade + subtle lift transition for every page */
const pageVariants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.16, ease: 'easeIn' } },
};

const PageTransition = ({ children }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    style={{ width: '100%', minHeight: '100vh' }}
  >
    {children}
  </motion.div>
);

/** AnimatePresence must live inside the Router so it can call useLocation */
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
        <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
        <Route path="/dashboard" element={<PrivateRoute><PageTransition><Dashboard /></PageTransition></PrivateRoute>} />
        <Route path="/stocks" element={<PrivateRoute><PageTransition><StockResearch /></PageTransition></PrivateRoute>} />
        <Route path="/ai-chat" element={<PrivateRoute><PageTransition><AIChat /></PageTransition></PrivateRoute>} />
        <Route path="/research" element={<PrivateRoute><PageTransition><ResearchPage /></PageTransition></PrivateRoute>} />
        <Route path="/circulars" element={<PrivateRoute><PageTransition><Circulars /></PageTransition></PrivateRoute>} />
        <Route path="/excel" element={<PrivateRoute><PageTransition><ExcelAgent /></PageTransition></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AnimatedRoutes />
        <BottomNav />
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
