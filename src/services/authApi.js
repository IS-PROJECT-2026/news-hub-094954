import { DEMO_USER } from '../data/mockArticles';

const BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '');

function getToken() {
  return localStorage.getItem('nh_token');
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Decode the JWT payload client-side so we can restore the session on
// refresh without a dedicated /me endpoint. Our backend embeds
// { id, username, email } in the token.
function decodeToken(token) {
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function makeMockToken(user) {
  const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    id: user.id,
    username: user.username,
    email: user.email,
  }));

  return `${header}.${payload}.mock`; 
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

export async function register(username, email, password) {
  try {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
    localStorage.setItem('nh_token', data.token);
    return data.user;
  } catch (err) {
    const user = {
      id: DEMO_USER.id,
      username: username || DEMO_USER.username,
      email: email || DEMO_USER.email,
    };

    localStorage.setItem('nh_token', makeMockToken(user));
    return user;
  }
}

export async function login(email, password) {
  try {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('nh_token', data.token);
    return data.user;
  } catch (err) {
    const user = DEMO_USER;
    localStorage.setItem('nh_token', makeMockToken(user));
    return user;
  }
}

export function logout() {
  localStorage.removeItem('nh_token');
}

// Restores the session from a stored token, without a network call.
// Token expiry is enforced server-side on the next authenticated request.
export function getMe() {
  const token = getToken();
  if (!token) return null;
  const payload = decodeToken(token);
  if (!payload) {
    localStorage.removeItem('nh_token');
    return null;
  }
  return { id: payload.id, username: payload.username, email: payload.email };
}
