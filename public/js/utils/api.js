// js/utils/api.js

// Verifica que exista token en sessionStorage, si no, redirige a login
export function ensureAuth() {
  const token = sessionStorage.getItem('token');
  if (!token) {
    window.location.href = 'index.html';
  }
}

// Headers estándar de la API (incluye Authorization si hay token)
export function apiHeaders() {
  const token = sessionStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

// Fetch con manejo de error silencioso: devuelve Response o null
export async function tryFetch(path, options = {}) {
  try {
    const response = await fetch(path, options);
    return response.ok ? response : null;
  } catch {
    return null;
  }
}
