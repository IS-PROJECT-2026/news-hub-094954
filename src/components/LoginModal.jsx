import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import styles from './LoginModal.module.css';

export default function LoginModal() {
  const { setShowLoginModal, handleLogin, handleRegister } = useAppContext();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const firstFieldRef = useRef(null);

  useEffect(() => {
    firstFieldRef.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') setShowLoginModal(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setShowLoginModal]);

  const handleSubmit = async () => {
    setError('');
    if (mode === 'register' && !username.trim()) {
      setError('Please choose a username.');
      return;
    }
    if (!email.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (mode === 'register' && password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'login') {
        await handleLogin(email.trim(), password);
      } else {
        await handleRegister(username.trim(), email.trim(), password);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => { if (e.key === 'Enter') handleSubmit(); };

  return (
    <div className={styles.overlay} onClick={() => setShowLoginModal(false)}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={() => setShowLoginModal(false)} aria-label="Close">×</button>

        <div className={styles.lockIcon}>🔐</div>
        <h2 className={styles.title}>
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h2>
        <p className={styles.subtitle}>
          {mode === 'login'
            ? 'Sign in to publish and manage your articles.'
            : 'Create an account to start publishing articles.'}
        </p>

        <div className={styles.fields}>
          {mode === 'register' && (
            <div className={styles.field}>
              <label className={styles.label}>Username</label>
              <input
                ref={firstFieldRef}
                className={styles.input}
                type="text"
                placeholder="yourname"
                value={username}
                onChange={e => setUsername(e.target.value)}
                onKeyDown={onKeyDown}
                autoComplete="username"
              />
            </div>
          )}
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              ref={mode === 'login' ? firstFieldRef : null}
              className={styles.input}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={onKeyDown}
              autoComplete="email"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input
              className={styles.input}
              type="password"
              placeholder={mode === 'register' ? 'At least 8 characters' : '••••••••'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={onKeyDown}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button className={styles.submitBtn} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
        </button>

        <div className={styles.toggle}>
          {mode === 'login' ? (
            <>Don't have an account?{' '}
              <button className={styles.toggleLink} onClick={() => { setMode('register'); setError(''); }}>
                Register
              </button>
            </>
          ) : (
            <>Already have an account?{' '}
              <button className={styles.toggleLink} onClick={() => { setMode('login'); setError(''); }}>
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
