import React, { useState, useEffect, useRef } from 'react';
import styles from './ArticleForm.module.css';
import { useAppContext } from '../context/AppContext';

const CATEGORY_OPTIONS = ['general', 'business', 'tech', 'health', 'sports', 'entertainment', 'politics'];

export default function ArticleForm({ article, onClose }) {
  const { addArticle, editArticle } = useAppContext();
  const isEditing = !!article;

  const [title, setTitle] = useState(article?.title || '');
  const [content, setContent] = useState(article?.content || '');
  const [category, setCategory] = useState(article?.category || 'general');
  const [imageUrl, setImageUrl] = useState(article?.image_url || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    titleRef.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleSubmit = async () => {
    setError('');
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }
    setLoading(true);
    try {
      const fields = {
        title: title.trim(),
        content: content.trim(),
        category,
        image_url: imageUrl.trim() || null,
      };
      if (isEditing) {
        await editArticle(article.id, fields);
      } else {
        await addArticle(fields);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={() => onClose()}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">×</button>

        <h2 className={styles.title}>{isEditing ? 'Edit article' : 'New article'}</h2>
        <p className={styles.subtitle}>
          {isEditing ? 'Update your article below.' : 'Share something with the community.'}
        </p>

        <div className={styles.fields}>
          <div className={styles.field}>
            <label className={styles.label}>Title</label>
            <input
              ref={titleRef}
              className={styles.input}
              type="text"
              placeholder="Article title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Category</label>
            <select className={styles.select} value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* <div className={styles.field}>
            <label className={styles.label}>Image URL (optional)</label>
            <input
              className={styles.input}
              type="url"
              placeholder="https://example.com/photo.jpg"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
            />
          </div> */}

          <div className={styles.field}>
            <label className={styles.label}>Content</label>
            <textarea
              className={styles.textarea}
              placeholder="Write your article…"
              value={content}
              onChange={e => setContent(e.target.value)}
            />
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.submitBtn} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving…' : isEditing ? 'Save changes' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  );
}
