export const CATEGORY_COLOURS = [
  '#e63946', '#2a9d8f', '#e9c46a', '#264653',
  '#f4a261', '#457b9d', '#6a4c93', '#1982c4',
];

export function getCategoryColour(name = 'general') {
  return CATEGORY_COLOURS[name.charCodeAt(0) % CATEGORY_COLOURS.length];
}

export function getTimeAgo(dateStr) {
  if (!dateStr) return '';
  // SQLite datetime('now') returns UTC without a 'Z' suffix — add it so
  // the browser doesn't parse it as local time.
  const iso = dateStr.includes('T') ? dateStr : dateStr.replace(' ', 'T') + 'Z';
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function formatDate(str) {
  if (!str) return '—';
  const iso = str.includes('T') ? str : str.replace(' ', 'T') + 'Z';
  return new Date(iso).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}
