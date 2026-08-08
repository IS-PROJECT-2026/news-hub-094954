import React, { useState, useCallback } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { useArticleFilters } from './hooks/useArticleFilters';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ArticleCard from './components/ArticleCard';
import ArticleModal from './components/ArticleModal';
import ArticleForm from './components/ArticleForm';
import SkeletonCard from './components/SkeletonCard';
import Pagination from './components/Pagination';
import LoginModal from './components/LoginModal';
import styles from './App.module.css';

function AppInner() {
  const { articles, isLoading, error, showLoginModal, removeArticle } = useAppContext();
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [formArticle, setFormArticle] = useState(null); // null=closed, {}=new, article=edit
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const {
    search, setSearch,
    category, setCategory,
    sort, setSort,
    categories,
    filtered,
    pageArticles,
    currentPage,
    totalPages,
    setCurrentPage,
  } = useArticleFilters();

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchInput(value);
    setSearch(value);
  }, [setSearch]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setCurrentPage]);

  const handleDelete = useCallback(async (id) => {
    try {
      await removeArticle(id);
    } catch (err) {
      alert(err.message || 'Failed to delete article');
    }
  }, [removeArticle]);

  const categoryCount = categories.length;

  return (
    <div>
      <Header
        totalCount={articles.length || null}
        categoryCount={categoryCount || null}
        searchValue={searchInput}
        onSearchChange={handleSearchChange}
        onMenuToggle={() => setMenuOpen(o => !o)}
        menuOpen={menuOpen}
        onNewArticle={() => setFormArticle({})}
      />

      <div className={styles.mainWrap}>
        {menuOpen && (
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 140, background: 'rgba(0,0,0,0.4)' }}
            onClick={() => setMenuOpen(false)}
          />
        )}
        <Sidebar
          categories={categories}
          category={category}
          onCategoryChange={setCategory}
          sort={sort}
          onSortChange={setSort}
          isOpen={menuOpen}
        />

        <div className={styles.contentArea}>
          <div className={styles.toolbar}>
            <span className={styles.resultsLabel}>
              {isLoading
                ? 'Loading…'
                : error
                ? 'Error'
                : <><span className={styles.resultsCount}>{filtered.length}</span> articles found</>
              }
            </span>
          </div>

          <div className={styles.grid}>
            {isLoading && Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}

            {!isLoading && error && (
              <div className={styles.stateBox}>
                <div className={styles.stateIcon}>⚠️</div>
                <div className={styles.stateTitle}>Couldn't load articles</div>
                <div className={styles.stateMsg}>{error}</div>
              </div>
            )}

            {!isLoading && !error && pageArticles.length === 0 && (
              <div className={styles.stateBox}>
                <div className={styles.stateIcon}>🔍</div>
                <div className={styles.stateTitle}>No articles found</div>
                <div className={styles.stateMsg}>Try different keywords or filters, or publish the first one.</div>
              </div>
            )}

            {!isLoading && !error && pageArticles.map((article, i) => (
              <ArticleCard
                key={article.id}
                article={article}
                index={i}
                onOpen={setSelectedArticle}
                onEdit={setFormArticle}
                onDelete={handleDelete}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          onEdit={setFormArticle}
          onDelete={handleDelete}
        />
      )}
      {formArticle !== null && (
        <ArticleForm
          article={formArticle.id ? formArticle : null}
          onClose={() => setFormArticle(null)}
        />
      )}
      {showLoginModal && <LoginModal />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
