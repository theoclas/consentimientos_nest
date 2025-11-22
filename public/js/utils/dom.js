// js/utils/dom.js

// Selección rápida de un solo elemento
export const $ = (selector, root = document) => root.querySelector(selector);

// Escapar texto antes de insertarlo como HTML
export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
