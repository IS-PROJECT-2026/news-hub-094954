import { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';

const PAGE_SIZE = 9;

export function useArticleFilters() {
  const { articles } = useAppContext();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  const categories = useMemo(() => {
    const set = new Set(articles.map(a => a.category).filter(Boolean));
    return Array.from(set).sort();
  }, [articles]);

  const filtered = useMemo(() => {
    let list = articles;

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(a =>
        a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q)
      );
    }

    if (category) {
      list = list.filter(a => a.category === category);
    }

    list = [...list].sort((a, b) => {
      if (sort === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
      if (sort === 'author') return a.author_name.localeCompare(b.author_name);
      return new Date(b.created_at) - new Date(a.created_at); // newest
    });

    return list;
  }, [articles, search, category, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageArticles = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return {
    search, setSearch: (v) => { setSearch(v); setCurrentPage(1); },
    category, setCategory: (v) => { setCategory(v); setCurrentPage(1); },
    sort, setSort,
    categories,
    filtered,
    pageArticles,
    currentPage: safePage,
    totalPages,
    setCurrentPage,
  };
}
