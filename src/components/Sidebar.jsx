import React from 'react';
import styles from './Sidebar.module.css';

export default function Sidebar({ categories, category, onCategoryChange, sort, onSortChange, isOpen }) {
  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Category</span>
          <button className={styles.clearBtn} onClick={() => onCategoryChange('')}>Clear</button>
        </div>
        <div className={styles.sectionBody}>
          <div className={styles.catGrid}>
            <button
              className={`${styles.catPill} ${category === '' ? styles.catActive : ''}`}
              onClick={() => onCategoryChange('')}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                className={`${styles.catPill} ${category === cat ? styles.catActive : ''}`}
                onClick={() => onCategoryChange(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Sort By</span>
        </div>
        <div className={styles.sectionBody}>
          <select
            className={styles.select}
            value={sort}
            onChange={e => onSortChange(e.target.value)}
          >
            <option value="newest">Latest First</option>
            <option value="oldest">Oldest First</option>
            <option value="author">By Author</option>
          </select>
        </div>
      </div>
    </aside>
  );
}
