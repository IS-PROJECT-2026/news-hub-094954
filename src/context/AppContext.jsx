import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe, login as apiLogin, register as apiRegister, logout as apiLogout } from '../services/authApi';
import { fetchArticles, createArticle, updateArticle, deleteArticle } from '../services/articlesApi';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Restore session from stored token (no network call needed)
  useEffect(() => {
    setUser(getMe());
    setAuthLoading(false);
  }, []);

  const loadArticles = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await fetchArticles();
      setArticles(data);
    } catch (err) {
      setError(err.message || 'Failed to load articles');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadArticles(); }, [loadArticles]);

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

  const addArticle = useCallback(async (fields) => {
    const created = await createArticle(fields);
    setArticles(prev => [created, ...prev]);
    return created;
  }, []);

  const editArticle = useCallback(async (id, fields) => {
    const updated = await updateArticle(id, fields);
    setArticles(prev => prev.map(a => (a.id === id ? updated : a)));
    return updated;
  }, []);

  const removeArticle = useCallback(async (id) => {
    await deleteArticle(id);
    setArticles(prev => prev.filter(a => a.id !== id));
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
      articles,
      isLoading,
      error,
      loadArticles,
      addArticle,
      editArticle,
      removeArticle,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
