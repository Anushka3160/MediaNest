const API = '/api';   // change to Render URL when deployed

function getToken() { return localStorage.getItem('mn_token'); }
function getUser()  { return JSON.parse(localStorage.getItem('mn_user') || 'null'); }
function setAuth(token, username) {
  localStorage.setItem('mn_token', token);
  localStorage.setItem('mn_user', JSON.stringify({ username }));
}
function clearAuth() {
  localStorage.removeItem('mn_token');
  localStorage.removeItem('mn_user');
}
function requireLogin() {
  if (!getToken()) window.location.href = 'login.html';
}

async function apiFetch(path, options = {}) {
  const token = getToken();
  const res = await fetch(API + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// Convenience wrappers
const Auth    = {
  register: (b) => apiFetch('/auth/register', { method: 'POST', body: b }),
  login:    (b) => apiFetch('/auth/login',    { method: 'POST', body: b }),
  me:       ()  => apiFetch('/auth/me'),
};
const Rooms   = {
  getAll:  ()  => apiFetch('/rooms'),
  create:  (b) => apiFetch('/rooms',     { method: 'POST',   body: b }),
  update:  (id,b) => apiFetch(`/rooms/${id}`, { method: 'PATCH', body: b }),
  delete:  (id)   => apiFetch(`/rooms/${id}`, { method: 'DELETE' }),
};
const Entries = {
  getAll:  (roomId) => apiFetch(`/entries?roomId=${roomId}`),
  create:  (b)  => apiFetch('/entries',      { method: 'POST',   body: b }),
  update:  (id,b)  => apiFetch(`/entries/${id}`, { method: 'PATCH', body: b }),
  delete:  (id)    => apiFetch(`/entries/${id}`, { method: 'DELETE' }),
};