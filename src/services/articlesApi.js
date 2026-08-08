const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

export function fetchArticles() {
  return apiFetch('/articles');
}

export function fetchArticle(id) {
  return apiFetch(`/articles/${id}`);
}

export function createArticle({ title, content, category }) {
  return apiFetch('/articles', {
    method: 'POST',
    body: JSON.stringify({ title, content, category }),
  });
}

export function updateArticle(id, { title, content, category }) {
  return apiFetch(`/articles/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ title, content, category }),
  });
}

export function deleteArticle(id) {
  return apiFetch(`/articles/${id}`, { method: 'DELETE' });
}
