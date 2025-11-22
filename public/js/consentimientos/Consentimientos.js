// js/consentimientos/consentimientos.js
import { escapeHtml } from '../utils/dom.js';

async function loadConsentimientos() {
  const selectEl = document.getElementById('consSelect');
  if (!selectEl) return;

  let resp = null;

  try {
    resp = await fetch('api/consentimientos', { cache: 'no-store' });
    if (!resp.ok) resp = null;
  } catch {
    resp = null;
  }

  if (!resp) {
    try {
      resp = await fetch('./consentimientos', { cache: 'no-store' });
      if (!resp.ok) resp = null;
    } catch {
      resp = null;
    }
  }

  if (!resp) {
    selectEl.innerHTML = '<option value="">(sin archivos)</option>';
    return;
  }

  const archivos = await resp.json();
  const htmlFiles = Array.isArray(archivos)
    ? archivos.filter((name) => /\.html?$/i.test(name))
    : [];

  if (htmlFiles.length === 0) {
    selectEl.innerHTML = '<option value="">(sin archivos)</option>';
    return;
  }

  selectEl.innerHTML =
    '<option value="">Selecciona un consentimiento…</option>' +
    htmlFiles
      .map(
        (fileName) =>
          `<option value="${encodeURIComponent(
            fileName,
          )}">${escapeHtml(fileName)}</option>`,
      )
      .join('');
}

export function initConsentimientos() {
  loadConsentimientos().catch((err) => {
    console.error('Error cargando consentimientos:', err);
    const selectEl = document.getElementById('consSelect');
    if (selectEl) {
      selectEl.innerHTML = '<option value="">(error al cargar)</option>';
    }
  });
}
