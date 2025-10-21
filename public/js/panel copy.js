// public/js/panel.js
document.addEventListener('DOMContentLoaded', () => {
  // --- Auth básica (redirige al login si no hay token)
  (function ensureAuth(){
    const token = sessionStorage.getItem('token');
    if(!token){ window.location.href = 'index.html'; }
  })();

  // --- Cerrar sesión
  document.getElementById('logoutBtn')?.addEventListener('click', ()=>{
    sessionStorage.removeItem('token');
    window.location.href = 'index.html';
  });

  // --- Utilidades
  const $ = (sel) => document.querySelector(sel);
  const infoEl = $('#infoPaciente');
  const fields = {
    nombre: infoEl.querySelector('[data-field="nombre"]'),
    numero: infoEl.querySelector('[data-field="numero"]'),
    celular: infoEl.querySelector('[data-field="celular"]'),
    correo: infoEl.querySelector('[data-field="correo"]'),
  };

  const viewerWrap = $('#viewerWrap');
  const viewer = $('#viewer');
  const viewerTitle = $('#viewerTitle');
  const openNew = $('#openNew');
  const printBtn = $('#printBtn');

  // Prefijo API (autodetección: primero intenta /api/*)
  async function tryFetch(path, opts={}) {
    try {
      const r = await fetch(path, opts);
      return r.ok ? r : null;
    } catch { return null; }
  }

  function apiHeaders() {
    const token = sessionStorage.getItem('token');
    const h = { 'Content-Type': 'application/json' };
    if (token) h['Authorization'] = `Bearer ${token}`;
    return h;
  }

  // --- Buscar paciente por documento
  $('#buscarBtn')?.addEventListener('click', async ()=>{
    const doc = ($('#docInput').value || '').trim();
    if(!doc){ alert('Escribe un documento para buscar.'); return; }

    let resp = await tryFetch(`api/entidadii/${encodeURIComponent(doc)}`, { headers: apiHeaders(), cache: 'no-store' });
    if (!resp) resp = await tryFetch(`./entidadii/${encodeURIComponent(doc)}`, { headers: apiHeaders(), cache: 'no-store' });

    if (!resp) { alert('No se pudo conectar con el servicio de pacientes.'); return; }

    const data = await resp.json();

    // Mapeo flexible según tu API
    const entidad = data.entidad || data || {};
    const nombre = entidad.nombreCompletoEntidad || [
      entidad.primerNombreEntidad, entidad.segundoNombreEntidad,
      entidad.primerApellidoEntidad, entidad.segundoApellidoEntidad
    ].filter(Boolean).join(' ').trim();

    const numero = entidad.documentoEntidad || data.documentoEntidad || doc;
    const celular = data.telefonoCelularEntidadII || entidad.telefonoCelularEntidadII || entidad.celular || '—';
    const correo = data.emailEntidadII || entidad.emailEntidadII || entidad.correo || '—';

    fields.nombre.textContent = nombre || 'Sin nombre';
    fields.numero.textContent = String(numero);
    fields.celular.textContent = String(celular);
    fields.correo.textContent = String(correo);
    infoEl.hidden = false;
  });

  // Enter en el input dispara búsqueda
  $('#docInput')?.addEventListener('keydown', (e)=>{
    if(e.key==='Enter'){ e.preventDefault(); $('#buscarBtn').click(); }
  });

  // --- Cargar consentimientos
  async function loadConsentimientos(){
    const listEl = $('#consList');
    listEl.innerHTML = '<div class="item"><span class="pill">Cargando…</span> Buscando archivos HTML…</div>';

    const candidates = [];

    // 1) Endpoint del servidor
    try {
      let api = await tryFetch('api/consentimientos', { cache: 'no-store' });
      if (!api) api = await tryFetch('./consentimientos', { cache: 'no-store' });
      if (api) {
        const arr = await api.json();
        if (Array.isArray(arr)) arr.filter(x=>/\.html?$/i.test(x)).forEach(x=>candidates.push(x));
      }
    } catch {}

    // 2) manifest.json (opcional)
    if (candidates.length===0) {
      try {
        const r = await tryFetch('./Consentimientos/manifest.json', { cache: 'no-store' });
        if (r) {
          const data = await r.json();
          const list = Array.isArray(data) ? data : (Array.isArray(data.files) ? data.files : []);
          list.filter(x=>/\.html?$/i.test(x)).forEach(x=>candidates.push(x));
        }
      } catch {}
    }

    // 3) Fallback directorio (si el server lista índices)
    if (candidates.length===0) {
      try {
        const r = await tryFetch('./Consentimientos/', { cache: 'no-store' });
        if (r) {
          const html = await r.text();
          const doc = new DOMParser().parseFromString(html, 'text/html');
          const links = Array.from(doc.querySelectorAll('a'))
            .map(a=>a.getAttribute('href'))
            .filter(h=>h && /\.html?$/i.test(h));
          links.forEach(h=>candidates.push(h.replace(/^\/.+?\//,'')));
        }
      } catch {}
    }

    // 4) Último recurso: ejemplos
    if (candidates.length===0) {
      candidates.push(
        'consentimiento-procedimiento.html',
        'consentimiento-anestesia.html',
        'consentimiento-cirugia.html'
      );
    }

    // Render + click para abrir en el iframe
    listEl.innerHTML = '';
    candidates.forEach((file)=>{
      const display = file;
      const href = './Consentimientos/' + encodeURIComponent(file).replace(/%2F/g,'/');

      const item = document.createElement('div');
      item.className = 'item';
      item.innerHTML = `
        <div class="pill">HTML</div>
        <div style="font-weight:700;color:#0f172a">${display}</div>
        <div style="margin-left:auto">
          <button class="btn small">Ver aquí</button>
        </div>
      `;
      const btn = item.querySelector('button');

      btn.addEventListener('click', ()=>{
        // Cargar en el iframe
        viewer.src = href; // mismo origen => OK
        viewerTitle.textContent = display;
        openNew.href = href;
        viewerWrap.hidden = false;

        // scroll al visor
        viewerWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });

      listEl.appendChild(item);
    });
  }

  // Botón imprimir del visor (requiere mismo origen)
  printBtn?.addEventListener('click', ()=>{
    if (viewer && viewer.contentWindow) {
      viewer.contentWindow.focus();
      viewer.contentWindow.print();
    } else {
      alert('Carga primero un consentimiento.');
    }
  });

  loadConsentimientos();
});
