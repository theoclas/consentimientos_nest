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

  // --- Paciente (mismo flujo que ya tenías)
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

    // igual que antes: primero /api/entidadii/:doc y fallback ./entidadii/:doc
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
    }
  });

  $('#docInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      $('#buscarBtn')?.click();
    }
  });

  // --- Visor (ya integrado en el HTML)
  function openInViewer(href, title) {
    const wrap = $('#viewerWrap');
    if (!wrap) {
      alert('No se encontró el contenedor del visor.');
      return;
    }
    const frame = $('#viewer');
    const viewerTitle = $('#viewerTitle');
    const openNew = $('#openNew');

    frame.src = href;
    viewerTitle.textContent = title || 'Vista previa';
    openNew.href = href;
    wrap.hidden = false;
    wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Botones del visor
  $('#printBtn')?.addEventListener('click', () => {
    const frame = document.getElementById('viewer');
    if (frame?.contentWindow) {
      frame.contentWindow.focus();
      frame.contentWindow.print();
    } else {
      alert('Carga primero un consentimiento.');
    }
  });

  // Firmar y Guardar: stubs por ahora (quedan listos para conectar)
  $('#signBtn')?.addEventListener('click', () => {
    alert('Firmar: pendiente de implementar. Aquí invocaremos el flujo de firma.');
  });
  $('#saveBtn')?.addEventListener('click', () => {
    alert('Guardar: pendiente de implementar. Aquí enviaremos el HTML firmado al backend.');
  });

  async function fetchProfesionales() {
    const selectEl = document.getElementById('profSelect');

    // igual que antes: primero /api/entidadii/:doc y fallback ./entidadii/:doc
    let resp = await tryFetch(`api/profesionales`, {
      headers: apiHeaders(),
      cache: 'no-store',
    });
    if (!resp)
      resp = await tryFetch(`./api/profesionales`, {
        headers: apiHeaders(),
        cache: 'no-store',
      });
    if (!resp) {
      alert('No se pudo conectar con el servicio de pacientes.');
      return;
    }



    const data = await resp.json();
    console.log('Profesionales fetched:', data);
    // const entidad = data.entidad || data || {};

    // --- Llenar el select ---
    // Limpia opciones actuales
    selectEl.innerHTML = '';

    // Placeholder
    const ph = document.createElement('option');
    ph.value = '';
    ph.textContent = 'Seleccione un profesional...';
    ph.disabled = true;
    ph.selected = true;
    selectEl.appendChild(ph);

    // Normalizador de campos por si cambian mayúsculas/estilo
    const get = (obj, keys) => {
      for (const k of keys) {
        if (obj[k] != null) return obj[k];
      }
      return undefined;
    };

    // Asegura que sea un array
    const rows = Array.isArray(data) ? data : (Array.isArray(data?.items) ? data.items : []);

    // Mapea y filtra registros válidos
    const items = rows.map(r => {
      const doc = get(r, [
        'documentoProfesional', 'DocumentoProfesional', 'Documento Profesional', 'documento_profesional'
      ]);
      const nombre = get(r, [
        'nombresProfesional', 'Nombres Profesional', 'NombresProfesional', 'nombres_profesional'
      ]);
      return { doc, nombre };
    }).filter(x => x.doc && x.nombre);

    // Ordena por nombre (opcional)
    items.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' }));

    // Inserta opciones
    const frag = document.createDocumentFragment();
    for (const { doc, nombre } of items) {
      const opt = document.createElement('option');
      opt.value = String(doc);
      opt.textContent = String(nombre);
      frag.appendChild(opt);
    }
    selectEl.appendChild(frag);
  }

  // Ejemplo de uso del valor seleccionado
  document.addEventListener('change', (e) => {
    if (e.target && e.target.id === 'profSelect') {
      const documento = e.target.value; // el documento del profesional
      const nombre = e.target.options[e.target.selectedIndex]?.text;
      console.log('Profesional seleccionado:', { documento, nombre });
      // aquí puedes disparar otra consulta si lo necesitas
    }
  });

  // Llamar al fetch en el onload
  window.addEventListener('DOMContentLoaded', fetchProfesionales);

  // --- Lista y selector de consentimientos (mantengo tu doble fetch + render)
  async function loadConsentimientos() {
    // const listEl = document.getElementById('consList');
    const selectEl = document.getElementById('consSelect');
    // if (listEl) {
    //   listEl.innerHTML =
    //     '<div class="item"><span class="pill">Cargando…</span> Consultando /api/consentimientos…</div>';
    // }

    // 1) Pide SIEMPRE al endpoint y luego fallback a ./consentimientos (exactamente el patrón que ya usabas)
    let resp = null;
    try {
      resp = await fetch('api/consentimientos', { cache: 'no-store' });
      if (!resp.ok) resp = null;
    } catch { }
    if (!resp) {
      try {
        resp = await fetch('./consentimientos', { cache: 'no-store' });
        if (!resp.ok) resp = null;
      } catch { }
    }

    if (!resp) {
      // if (listEl) {
      //   listEl.innerHTML =
      //     '<div class="item">No pude leer <b>/api/consentimientos</b>. Verifica el controlador Nest.</div>';
      // }
      if (selectEl) {
        selectEl.innerHTML = '<option value="">(sin archivos)</option>';
      }
      return;
    }

    const archivos = await resp.json();
    const htmls = Array.isArray(archivos)
      ? archivos.filter((n) => /\.html?$/i.test(n))
      : [];

    // // 2) Render lista a la derecha (tal como hacías, pero con botón "Ver aquí")
    // if (listEl) {
    //   if (htmls.length === 0) {
    //     listEl.innerHTML =
    //       '<div class="item">No hay archivos HTML en <b>/public/Consentimientos</b>.</div>';
    //   } else {
    //     listEl.innerHTML = '';
    //     htmls.forEach((file) => {
    //       const display = file;
    //       const item = document.createElement('div');
    //       item.className = 'item';
    //       item.innerHTML = `
    //         <div class="pill">HTML</div>
    //         <div style="font-weight:700;color:#0f172a">${display}</div>
    //         <div style="margin-left:auto">
    //           <button class="btn small" type="button">Ver aquí</button>
    //           <a class="btn small" target="_blank" rel="noopener">Nueva pestaña</a>
    //         </div>
    //       `;
    //       const verAquiBtn = item.querySelector('button');
    //       const abrirNueva = item.querySelector('a');

    //       // URL base /Consentimientos/<archivo> (igual que tu implementación)
    //       const base =
    //         '/Consentimientos/' +
    //         encodeURIComponent(file).replace(/%2F/g, '/');

    //       verAquiBtn.addEventListener('click', () => {
    //         const url = buildConsentUrl(base);
    //         if (!url) return;
    //         openInViewer(url, display);
    //       });
    //       abrirNueva.href = base;

    //       listEl.appendChild(item);
    //     });
    //   }
    // }

    // 3) Poblar <select> de forma ordenada
    if (selectEl) {
      if (htmls.length === 0) {
        selectEl.innerHTML = '<option value="">(sin archivos)</option>';
      } else {
        selectEl.innerHTML =
          '<option value="">Selecciona un consentimiento…</option>' +
          htmls
            .map(
              (f) =>
                `<option value="${encodeURIComponent(f)}">${escapeHtml(f)}</option>`,
            )
            .join('');
      }
    }
  }

  // Cargar al visor el seleccionado en el <select>
  $('#verAquiBtn')?.addEventListener('click', () => {
    const sel = $('#consSelect');
    const fileEnc = sel?.value || '';
    const selectEl = document.getElementById('profSelect');
    if (!fileEnc) {
      alert('Selecciona un consentimiento de la lista.');
      return;
    }
    
     if (!selectEl.value.trim()) {
      alert('Selecciona un profesional de la lista.');
      return;
    }

    const base = '/Consentimientos/' + fileEnc.replace(/%2F/g, '/');
    const url = buildConsentUrl(base);
    if (!url) return;
    openInViewer(url, decodeURIComponent(fileEnc));
  });

  // Construye URL con parámetros del paciente (mismo patrón que ya usabas)
  function buildConsentUrl(baseHref) {
    const paciente = getPacienteBasics();
    if (!paciente) {
      alert('Primero busca y carga un paciente para enviar sus datos al consentimiento.');
      return null;
    }

    const selectEl = document.getElementById('profSelect');
    const profDocumento = selectEl.value;
    const profNombre = selectEl.options[selectEl.selectedIndex]?.text;
    const qs = new URLSearchParams({
      nombre: paciente.nombre || '',
      // nombre: paciente.nombre || '',
      numero: paciente.numero || '',
      celular: paciente.celular || '',
      correo: paciente.correo || '',
      profDocumento: profDocumento || '',
      profNombre: profNombre || '',
    }); // esto ya lo hacías en tu versión previa al abrir en una pestaña nueva :contentReference[oaicite:3]{index=3}
    return `${baseHref}?${qs.toString()}`;
  }

  function getPacienteBasics() {
    const infoEl = document.getElementById('infoPaciente');
    if (infoEl?.hidden) return null;
    const get = (sel) => (infoEl.querySelector(sel)?.textContent || '').trim();
    return {
      nombre: get('[data-field="nombre"]'),
      numero: get('[data-field="numero"]'),
      celular: get('[data-field="celular"]'),
      correo: get('[data-field="correo"]'),
    };
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  // Carga inicial
  loadConsentimientos();
  fetchProfesionales();
});
