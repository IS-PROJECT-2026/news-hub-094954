import React from 'react';
import styles from './ArticleCard.module.css';
import { useAppContext } from '../context/AppContext';
import { getCategoryColour, getTimeAgo } from '../utils/helpers';

export default function ArticleCard({ article, index, onOpen, onEdit, onDelete }) {
  const { user } = useAppContext();
  const colour = getCategoryColour(article.category || 'general');
  const timeAgo = getTimeAgo(article.created_at);
  const isOwner = user && user.id === article.author_id;

  const handleEdit = (e) => { e.stopPropagation(); onEdit(article); };
  const handleDelete = (e) => {
    e.stopPropagation();
    if (confirm('Delete this article? This can\'t be undone.')) onDelete(article.id);
  };

  return (
    <article
      className={styles.card}
      style={{ animationDelay: `${index * 40}ms` }}
      onClick={() => onOpen(article)}
    >
      {article.image_url ? (
        <img
          src={article.image_url}
          alt={article.title}
          className={styles.thumb}
          style={{ borderBottom: `3px solid ${colour}` }}
          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
        />
      ) : null}
      <div
        className={styles.placeholder}
        style={{
          background: `${colour}22`,
          borderBottom: `3px solid ${colour}`,
          display: article.image_url ? 'none' : 'flex',
        }}
      >
        <span style={{ color: colour }}>{(article.category || 'N').charAt(0).toUpperCase()}</span>
      </div>

      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={styles.sourceBadge} style={{ background: colour }}>
            {article.category || 'general'}
          </span>
          <span className={styles.timeBadge}>{timeAgo}</span>
        </div>

        <div className={styles.title}>{article.title}</div>

        <div className={styles.footer}>
          <div className={styles.authorChip}>
            <div className={styles.authorAvatar}>{article.author_name.charAt(0).toUpperCase()}</div>
            <span className={styles.authorName}>{article.author_name}</span>
          </div>
          <div className={styles.actions}>
            {isOwner && (
              <>
                <button className={styles.actionBtn} onClick={handleEdit} title="Edit">
                  ✎
                </button>
                <button className={styles.actionBtn} onClick={handleDelete} title="Delete">
                  🗑
                </button>
              </>
            )}
            <span className={styles.readLink}>Read →</span>
          </div>
        </div>
      </div>
    </article>
  );
}
