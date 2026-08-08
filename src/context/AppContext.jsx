import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout, getMe } from '../services/authApi';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Restore session from stored token (no network call needed)
  useEffect(() => {
    setUser(getMe());
    setAuthLoading(false);
  }, []);

  const handleLogin = useCallback(async (email, password) => {
    const u = await apiLogin(email, password);
    setUser(u);
    setShowLoginModal(false);
  }, []);

  const handleRegister = useCallback(async (username, email, password) => {
    const u = await apiRegister(username, email, password);
    setUser(u);
    setShowLoginModal(false);
  }, []);

  const handleLogout = useCallback(() => {
    apiLogout();
    setUser(null);
  }, []);

  return (
    <AppContext.Provider value={{
      user,
      authLoading,
      showLoginModal,
      setShowLoginModal,
      handleLogin,
      handleRegister,
      handleLogout,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
