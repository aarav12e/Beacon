import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser, useAuth as useClerkAuth, useClerk } from '@clerk/clerk-react';
import { authAPI } from '../services/api';

const AuthContext = createContext({});

/**
 * AuthProvider wraps Clerk state and syncs the signed-in user
 * to our MongoDB backend, exposing the same API surface as before
 * (user, loading, logout) so the rest of the app needs minimal changes.
 */
export const AuthProvider = ({ children }) => {
  const { user: clerkUser, isLoaded } = useUser();
  const { getToken, signOut } = useClerkAuth();
  const { openSignIn } = useClerk();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync Clerk user → our MongoDB user record
  useEffect(() => {
    if (!isLoaded) return;

    if (!clerkUser) {
      setUser(null);
      setLoading(false);
      return;
    }

    // Get Clerk session token and sync with backend
    (async () => {
      try {
        const token = await getToken();
        // Store for axios interceptor
        sessionStorage.setItem('clerk_token', token);

        const res = await authAPI.syncClerk({
          clerkId: clerkUser.id,
          name: clerkUser.fullName || clerkUser.firstName || 'User',
          email: clerkUser.primaryEmailAddress?.emailAddress,
        });
        setUser(res.data.user);
      } catch (err) {
        console.error('Clerk sync error:', err);
        // Still set a basic user from Clerk data if backend sync fails
        setUser({
          name: clerkUser.fullName || clerkUser.firstName || 'User',
          email: clerkUser.primaryEmailAddress?.emailAddress,
          role: 'analyst',
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [clerkUser, isLoaded, getToken]);

  const logout = async () => {
    sessionStorage.removeItem('clerk_token');
    setUser(null);
    await signOut();
  };

  // Refresh token periodically (Clerk tokens expire after ~1 min by default)
  useEffect(() => {
    if (!clerkUser) return;
    const interval = setInterval(async () => {
      try {
        const token = await getToken();
        sessionStorage.setItem('clerk_token', token);
      } catch { }
    }, 50_000); // refresh every 50s
    return () => clearInterval(interval);
  }, [clerkUser, getToken]);

  return (
    <AuthContext.Provider value={{ user, loading, logout, openSignIn, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
