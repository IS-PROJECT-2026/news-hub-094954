import { DEMO_USER, mockArticles, nextMockId } from '../data/mockArticles';

const BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '');

function getToken() {
  return localStorage.getItem('nh_token');
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });
  const data = res.status === 204 ? null : await res.json();
  if (!res.ok) throw new Error(data?.error || 'Request failed');
  return data;
}

function mockTimestamp() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

function buildMockArticle(input) {
  const now = mockTimestamp();
  return {
    id: input.id ?? nextMockId(),
    title: input.title,
    content: input.content,
    category: input.category || 'general',
    author_id: DEMO_USER.id,
    author_name: DEMO_USER.username,
    created_at: input.created_at || now,
    updated_at: now,
  };
}

export async function fetchArticles() {
  try {
    return await apiFetch('/articles');
  } catch (err) {
    return mockArticles;
  }
}

export async function fetchArticle(id) {
  try {
    return await apiFetch(`/articles/${id}`);
  } catch (err) {
    return mockArticles.find(article => String(article.id) === String(id)) || null;
  }
}

export async function createArticle({ title, content, category }) {
  try {
    return await apiFetch('/articles', {
      method: 'POST',
      body: JSON.stringify({ title, content, category }),
    });
  } catch (err) {
    const created = buildMockArticle({ title, content, category });
    mockArticles.unshift(created);
    return created;
  }
}

export async function updateArticle(id, { title, content, category }) {
  try {
    return await apiFetch(`/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ title, content, category }),
    });
  } catch (err) {
    const index = mockArticles.findIndex(article => String(article.id) === String(id));
    if (index === -1) {
      const created = buildMockArticle({ id, title, content, category });
      mockArticles.unshift(created);
      return created;
    }

    const updated = {
      ...mockArticles[index],
      title,
      content,
      category,
      updated_at: mockTimestamp(),
    };

    mockArticles[index] = updated;
    return updated;
  }
}

export async function deleteArticle(id) {
  try {
    await apiFetch(`/articles/${id}`, { method: 'DELETE' });
  } catch (err) {
    const articleIndex = mockArticles.findIndex(article => String(article.id) === String(id));
    if (articleIndex !== -1) {
      mockArticles.splice(articleIndex, 1);
    }
  }
}

