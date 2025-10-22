document.addEventListener('DOMContentLoaded', () => {
  // --- Auth básica
  (function ensureAuth() {
    const token = sessionStorage.getItem('token');
    if (!token) {
      window.location.href = 'index.html';
    }
  })();

  // --- Helpers
  const $ = (sel) => document.querySelector(sel);

  function apiHeaders() {
    const token = sessionStorage.getItem('token');
    const h = { 'Content-Type': 'application/json' };
    if (token) h['Authorization'] = `Bearer ${token}`;
    return h;
  }
  async function tryFetch(path, opts = {}) {
    try {
      const r = await fetch(path, opts);
      return r.ok ? r : null;
    } catch {
      return null;
    }
  }

  // --- Logout
  $('#logoutBtn')?.addEventListener('click', () => {
    sessionStorage.removeItem('token');
    window.location.href = 'index.html';
  });

  // --- Paciente
  const infoEl = $('#infoPaciente');
  const fields = infoEl
    ? {
        nombre: infoEl.querySelector('[data-field="nombre"]'),
        numero: infoEl.querySelector('[data-field="numero"]'),
        celular: infoEl.querySelector('[data-field="celular"]'),
        correo: infoEl.querySelector('[data-field="correo"]'),
      }
    : {};

  $('#buscarBtn')?.addEventListener('click', async () => {
    const doc = ($('#docInput')?.value || '').trim();
    if (!doc) {
      alert('Escribe un documento para buscar.');
      return;
    }

    let resp = await tryFetch(`api/entidadii/${encodeURIComponent(doc)}`, {
      headers: apiHeaders(),
      cache: 'no-store',
    });
    if (!resp)
      resp = await tryFetch(`./entidadii/${encodeURIComponent(doc)}`, {
        headers: apiHeaders(),
        cache: 'no-store',
      });
    if (!resp) {
      alert('No se pudo conectar con el servicio de pacientes.');
      return;
    }

    const data = await resp.json();
    const entidad = data.entidad || data || {};
    const nombre =
      entidad.nombreCompletoEntidad ||
      [
        entidad.primerNombreEntidad,
        entidad.segundoNombreEntidad,
        entidad.primerApellidoEntidad,
        entidad.segundoApellidoEntidad,
      ]
        .filter(Boolean)
        .join(' ')
        .trim();

    const numero = entidad.documentoEntidad || data.documentoEntidad || doc;
    const celular =
      data.telefonoCelularEntidadII ||
      entidad.telefonoCelularEntidadII ||
      entidad.celular ||
      '—';
    const correo =
      data.emailEntidadII || entidad.emailEntidadII || entidad.correo || '—';

    if (infoEl) {
      fields.nombre.textContent = nombre || 'Sin nombre';
      fields.numero.textContent = String(numero);
      fields.celular.textContent = String(celular);
      fields.correo.textContent = String(correo);
      infoEl.hidden = false;
      // Fer recuerde que aca podemos colocar la info que 
      // buscamos del paciente dentro de los campos en el html los que esta en divs
    }
  });

  $('#docInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      $('#buscarBtn')?.click();
    }
  });

  // --- Visor (creación perezosa si no existe en el HTML)
  function ensureViewer() {
    let wrap = document.getElementById('viewerWrap');
    if (!wrap) {
      // crea el bloque del visor
      const section = document.querySelector(
        'section[aria-labelledby="consTitulo"] .body',
      );
      if (!section) return null;
      const div = document.createElement('div');
      div.className = 'viewer';
      div.id = 'viewerWrap';
      div.hidden = false;
      div.innerHTML = `
        <div class="viewer-toolbar">
          <div class="viewer-title" id="viewerTitle">Vista previa</div>
          <div class="spacer"></div>
          <a class="btn small" id="openNew" target="_blank" rel="noopener">Abrir en pestaña</a>
          <button class="btn small" id="printBtn" type="button">Imprimir</button>
        </div>
        <iframe id="viewer" title="Vista del consentimiento"></iframe>
      `;
      section.appendChild(div);
    }
    return document.getElementById('viewerWrap');
  }

  function openInViewer(href, title) {
    const wrap = ensureViewer();
    if (!wrap) {
      alert('No se pudo crear el visor');
      return;
    }
    const frame = document.getElementById('viewer');
    const viewerTitle = document.getElementById('viewerTitle');
    const openNew = document.getElementById('openNew');

    frame.src = href;
    viewerTitle.textContent = title || 'Vista previa';
    openNew.href = href;
    wrap.hidden = false;
    wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'printBtn') {
      const frame = document.getElementById('viewer');
      if (frame?.contentWindow) {
        frame.contentWindow.focus();
        frame.contentWindow.print();
      } else {
        alert('Carga primero un consentimiento.');
      }
    }
  });

  async function loadConsentimientos() {
    const listEl = document.getElementById('consList');
    listEl.innerHTML =
      '<div class="item"><span class="pill">Cargando…</span> Consultando /api/consentimientos…</div>';

    // 1) Pide SIEMPRE al endpoint (con o sin prefijo global)
    let resp = null;
    try {
      resp = await fetch('api/consentimientos', { cache: 'no-store' });
      if (!resp.ok) resp = null;
    } catch {}

    if (!resp) {
      try {
        resp = await fetch('./consentimientos', { cache: 'no-store' });
        if (!resp.ok) resp = null;
      } catch {}
    }

    if (!resp) {
      listEl.innerHTML =
        '<div class="item">No pude leer <b>/api/consentimientos</b>. Verifica el controlador Nest.</div>';
      return;
    }

    const archivos = await resp.json();
    if (!Array.isArray(archivos) || archivos.length === 0) {
      listEl.innerHTML =
        '<div class="item">No hay archivos HTML en <b>/public/Consentimientos</b>.</div>';
      return;
    }

    // 2) Render con nombres reales (espacios/acentos soportados)
    listEl.innerHTML = '';
    archivos
      .filter((n) => /\.html?$/i.test(n))
      .forEach((file) => {
        const display = file;
        const href =
          '/Consentimientos/' + encodeURIComponent(file).replace(/%2F/g, '/');

        const item = document.createElement('div');
        item.className = 'item';
        item.innerHTML = `
  <div class="pill">HTML</div>
  <div style="font-weight:700;color:#0f172a">${display}</div>
  <div style="margin-left:auto">
    <button class="btn small" type="button">Ver aquí</button>
  </div>
`;

        item.querySelector('button').addEventListener('click', () => {
          // 1) Tomar datos del paciente
          const paciente = getPacienteBasics();
          if (!paciente) {
            alert(
              'Primero busca y carga un paciente para enviar sus datos al consentimiento.',
            );
            return;
          }

          // 2) Construir URL con parámetros
          const base =
            '/Consentimientos/' + encodeURIComponent(file).replace(/%2F/g, '/');
          const qs = new URLSearchParams({
            nombre: paciente.nombre || '',
            numero: paciente.numero || '',
            celular: paciente.celular || '',
            correo: paciente.correo || '',
          });

          // 3) Abrir en nueva pestaña con los parámetros
          const url = `${base}?${qs.toString()}`;
          window.open(url, '_blank', 'noopener');
        });

        listEl.appendChild(item);
      });
  }

  function getPacienteBasics() {
    const infoEl = document.getElementById('infoPaciente');
    // Si aún no hay datos visibles, avisamos
    if (infoEl?.hidden) return null;

    const get = (sel) => (infoEl.querySelector(sel)?.textContent || '').trim();
    return {
      nombre: get('[data-field="nombre"]'),
      numero: get('[data-field="numero"]'),
      celular: get('[data-field="celular"]'),
      correo: get('[data-field="correo"]'),
    };
  }

  loadConsentimientos();
});
