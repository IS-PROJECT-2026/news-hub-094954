import React, { useState } from 'react';
import styles from './Header.module.css';
import { useAppContext } from '../context/AppContext';

export default function Header({ totalCount, categoryCount, searchValue, onSearchChange, onMenuToggle, menuOpen, onNewArticle }) {
  const { user, authLoading, setShowLoginModal, handleLogout } = useAppContext();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a href="#" className={styles.logo}>
          <span className={styles.logoDot} />
          NewsHub
        </a>
  
        <button className={styles.hamburger} onClick={onMenuToggle} title="Filters">
          {menuOpen ? '✕' : '☰'}
        </button>

        <button className={styles.searchToggle} onClick={() => setSearchOpen(o => !o)} title="Search">
          🔍
        </button>

        {searchOpen && (
          <div className={styles.searchOverlay} onClick={() => setSearchOpen(false)}>
            <div className={styles.searchModal} onClick={e => e.stopPropagation()}>
              <input
                type="text"
                placeholder="Search articles…"
                autoComplete="off"
                value={searchValue}
                onChange={onSearchChange}
                autoFocus
                className={styles.searchModalInput}
              />
              <button className={styles.searchClose} onClick={() => setSearchOpen(false)}>✕</button>
            </div>
          </div>
        )}

        <nav className={styles.navLinks}>
          {user && (
            <button className={styles.navBtn} onClick={onNewArticle}>
              + New Article
            </button>
          )}
        </nav>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>Articles</div>
            <div className={styles.statValue}>{totalCount || '—'}</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>Categories</div>
            <div className={styles.statValue}>{categoryCount || '—'}</div>
          </div>
        </div>

        {!authLoading && (
          user ? (
            <div className={styles.authArea}>
              <span className={styles.userEmail} title={user.email}>
                {user.username}
              </span>
              <button className={styles.logoutBtn} onClick={handleLogout} title="Sign out">
                Sign out
              </button>
            </div>
          ) : (
            <button className={styles.loginBtn} onClick={() => setShowLoginModal(true)}>
              Sign in
            </button>
          )
        )}
      </div>
    </header>
  );
}
