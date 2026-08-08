import React, { useEffect } from 'react';
import styles from './ArticleModal.module.css';
import { useAppContext } from '../context/AppContext';
import { getCategoryColour, formatDate } from '../utils/helpers';

export default function ArticleModal({ article, onClose, onEdit, onDelete }) {
  const { user } = useAppContext();

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!article) return null;

  const colour = getCategoryColour(article.category || 'general');
  const isOwner = user && user.id === article.author_id;

  const metaFields = [
    { label: 'Published', value: formatDate(article.created_at) },
    { label: 'Author', value: article.author_name },
    ...(article.updated_at && article.updated_at !== article.created_at
      ? [{ label: 'Updated', value: formatDate(article.updated_at) }]
      : []),
  ];

  const handleEdit = () => { onEdit(article); onClose(); };
  const handleDelete = () => {
    if (confirm("Delete this article? This can't be undone.")) {
      onDelete(article.id);
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div className={styles.headerLeft}>
            <span className={styles.sourceBadge} style={{ background: colour }}>
              {article.category || 'general'}
            </span>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.body}>
          <h2 className={styles.title}>{article.title}</h2>

          {article.image_url && (
            <img
              src={article.image_url}
              alt={article.title}
              className={styles.modalImage}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          )}

          {isOwner && (
            <div className={styles.signalsRow}>
              <button className={styles.reactBtn} onClick={handleEdit}>
                ✎ Edit
              </button>
              <button className={styles.reactBtn} onClick={handleDelete}>
                🗑 Delete
              </button>
            </div>
          )}

          <div className={styles.metaGrid}>
            {metaFields.map(f => (
              <div key={f.label} className={styles.metaItem}>
                <span className={styles.metaLabel}>{f.label}</span>
                <span className={styles.metaValue}>{f.value}</span>
              </div>
            ))}
          </div>

          <p className={styles.desc}>{article.content}</p>
        </div>
      </div>
    </div>
  );
}
