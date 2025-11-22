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
    frame.onload = () => {
      try {
        fillConsentFieldsInIframe(frame);
      } catch (e) {
        console.warn('No se pudieron rellenar campos en el iframe:', e);
      }
    };
    viewerTitle.textContent = title || 'Vista previa';
    openNew.href = href;
    wrap.hidden = false;
    wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

 

  // Devuelve el "contexto" (datos) desde tu UI para rellenar el iframe
  function buildConsentContext() {
    const paciente = getPacienteBasics(); // ya la tienes
    const profSel = document.getElementById('profSelect');
    const profDocumento = profSel?.value || '';
    const profNombre = profSel?.options[profSel.selectedIndex]?.text || '';

    const ctx = {
      paciente: {
        nombre: paciente?.nombre || '',
        numero: paciente?.numero || '',
        celular: paciente?.celular || '',
        correo: paciente?.correo || '',
        // agrega aquí cualquier otro campo si lo tienes disponible
      },
      profesional: {
        documento: profDocumento,
        nombre: profNombre,
        registroMedico: '', // si lo traes de tu endpoint de profesionales, setéalo
      },
      usuarioActual: '', // si manejas el user logueado
      rips: {},          // si manejas codigos rips
    };
    return ctx;
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
    // alert('Firmar: pendiente de implementar. Aquí invocaremos el flujo de firma.');
  });



  async function fetchempresas() {
    const selectEl = document.getElementById('EmpresasSelect');


    let resp = await tryFetch(`api/empresas`, {
      headers: apiHeaders(),
      cache: 'no-store',
    });
    if (!resp)
      resp = await tryFetch(`./api/empresas`, {
        headers: apiHeaders(),
        cache: 'no-store',
      });
    if (!resp) {
      alert('No se pudo conectar con el servicio de pacientes.');
      return;
    }



    const data = await resp.json();
    console.log('empresas fetched:', data);

    selectEl.innerHTML = '';

    // Placeholder
    const ph = document.createElement('option');
    ph.value = '';
    ph.textContent = 'Seleccione una empresa...';
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
        'documentoEmpresa'
      ]);
      const nombre = get(r, [
        'razonSocialEmpresa'
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
  window.addEventListener('DOMContentLoaded', fetchempresas);

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
    const selectEm = document.getElementById('EmpresasSelect');
    if (!fileEnc) {
      alert('Selecciona un consentimiento de la lista.');
      return;
    }

    if (!selectEl.value.trim()) {
      alert('Selecciona un profesional de la lista.');
      return;
    }

    if (!selectEm.value.trim()) {
      alert('Selecciona una Empresa de la lista.');
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

    const selectEm = document.getElementById('EmpresasSelect');
    const EmpDocumento = selectEm.value;
    const EmpNombre = selectEm.options[selectEm.selectedIndex]?.text;

    const selectEl = document.getElementById('profSelect');
    const profDocumento = selectEl.value;
    const profNombre = selectEl.options[selectEl.selectedIndex]?.text;
    console.log(profDocumento, profNombre);
    console.log("profDocumento", "profNombre");
    
    const qs = new URLSearchParams({
      nombre: paciente.nombre || '',
      // nombre: paciente.nombre || '',
      numero: paciente.numero || '',
      celular: paciente.celular || '',
      correo: paciente.correo || '',
      profDocumento: profDocumento || '',
      profNombre: profNombre || '',
      EmpDocumento: EmpDocumento || '',
      EmpNombre: EmpNombre || '',
      profNombre2: "EmpNombre2" || '',
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
      profDocumento: get('[data-field="profDocumento"]'),
      profNombre: get('[data-field="profNombre"]'),
      EmpDocumento: get('[data-field="EmpDocumento"]'),
      EmpNombre: get('[data-field="EmpNombre"]'),
      profNombre2: get('[data-field="profNombre2"]'),
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
  fetchempresas();
});


/* ===================== FIRMA + IMPRIMIR (ADD-ON MINIMAL) ===================== */
(() => {
  // Evita doble-instalación si ya pegaste este bloque
  if (window.__firmaAddOnInstalled) return;
  window.__firmaAddOnInstalled = true;

  // Helpers mínimos (no colisionan con tu $ ni con otras funciones)
  const q = (sel, root = document) => root.querySelector(sel);

  // Carga SweetAlert2 y SignaturePad solo si faltan
  async function ensureLibs() {
    const tasks = [];
    if (typeof window.Swal === 'undefined') {
      tasks.push(loadScript('https://cdn.jsdelivr.net/npm/sweetalert2@11'));
    }
    if (typeof window.SignaturePad === 'undefined') {
      tasks.push(loadScript('https://cdn.jsdelivr.net/npm/signature_pad@4.1.5/dist/signature_pad.umd.min.js'));
    }
    if (tasks.length) await Promise.all(tasks);
  }
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  // Lee nombre/doc del paciente desde el documento cargado en el iframe (#T1 y #T5)
  function getPacienteFromIframe() {
    const frame = q('#viewer');
    const doc = frame && frame.contentDocument;
    const out = { nombre: 'paciente', doc: 'sin_doc' };
    if (!doc) return out;
    const nombre = doc.getElementById('T1');
    const docId = doc.getElementById('T5');
    if (nombre && nombre.value) out.nombre = String(nombre.value).trim() || out.nombre;
    if (docId && docId.value) out.doc = String(docId.value).trim() || out.doc;
    return out;
  }

  // Inserta/actualiza <img id="firmaPaciente"> en el documento del iframe
  function injectFirmaIntoIframe(url) {
    const frame = q('#viewer');
    const doc = frame && frame.contentDocument;
    if (!doc) throw new Error('No hay documento cargado en el visor.');
    let img = doc.getElementById('firmaPaciente');

    if (!img) {
      // Si no existe el placeholder, lo creamos al final del documento
      const wrap = doc.createElement('div');
      wrap.id = 'firmaPacienteWrap';
      wrap.style.marginTop = '12px';
      img = doc.createElement('img');
      img.id = 'firmaPaciente';
      img.alt = 'Firma del paciente';
      img.style.width = '260px';
      img.style.height = '120px';
      img.style.objectFit = 'contain';
      img.style.border = '1px dashed #999';
      img.style.background = '#fff';
      wrap.appendChild(img);
      (doc.body || doc.documentElement).appendChild(wrap);
    }
    img.src = url + '?t=' + Date.now();

    // Asegura que se imprima
    if (!doc.getElementById('firmaPrintCss')) {
      const style = doc.createElement('style');
      style.id = 'firmaPrintCss';
      style.textContent = `
        @media print {
          #firmaPaciente { display:block !important; }
          #firmaPacienteWrap { page-break-inside: avoid; }
          img { max-width: 100% !important; }
        }
      `;
      doc.head.appendChild(style);
    }
  }

  // Modal de firma con SweetAlert2 + SignaturePad
  async function pedirFirmaDataURL() {
    await ensureLibs();

    const html = `
      <div style="display:flex;flex-direction:column;gap:8px;">
        <div style="font-size:14px;">Firme dentro del recuadro</div>
        <div style="border:1px solid #ccc;border-radius:8px;touch-action:none;">
          <canvas id="signature-canvas" style="width:100%;height:240px;"></canvas>
        </div>
        <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:4px;">
          <button id="btnUndo" class="swal2-cancel swal2-styled" type="button">Deshacer</button>
          <button id="btnClear" class="swal2-cancel swal2-styled" type="button">Borrar</button>
        </div>
      </div>
    `;

    const ret = await Swal.fire({
      title: 'Firma del paciente',
      html,
      width: 700,
      allowOutsideClick: false,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Guardar firma',
      didOpen: () => {
        const canvas = document.getElementById('signature-canvas');
        function resize() {
          const ratio = Math.max(window.devicePixelRatio || 1, 1);
          const rect = canvas.getBoundingClientRect();
          canvas.width = rect.width * ratio;
          canvas.height = rect.height * ratio;
          canvas.getContext('2d').scale(ratio, ratio);
        }
        resize();
        window.addEventListener('resize', resize);

        const pad = new SignaturePad(canvas, {
          minWidth: 0.7, maxWidth: 2.2, throttle: 2,
          backgroundColor: 'rgba(255,255,255,1)', penColor: 'black'
        });
        document.getElementById('btnClear')?.addEventListener('click', () => pad.clear());
        document.getElementById('btnUndo')?.addEventListener('click', () => {
          const data = pad.toData(); if (data.length) { data.pop(); pad.fromData(data); }
        });

        Swal.__pad = pad;
        Swal.__cleanup = () => window.removeEventListener('resize', resize);
      },
      willClose: () => { Swal.__cleanup?.(); },
      preConfirm: () => {
        const pad = Swal.__pad;
        if (!pad || pad.isEmpty()) {
          Swal.showValidationMessage('Por favor, realice la firma antes de guardar.');
          return false;
        }
        return pad.toDataURL('image/png');
      }
    });

    if (ret.isConfirmed && typeof ret.value === 'string') return ret.value;
    return null;
  }

  // === Handler del botón "Firmar" (NO toca tu lógica existente) ===
  const signBtn = q('#signBtn');
  if (signBtn && !signBtn.dataset.firmaBound) {
    signBtn.dataset.firmaBound = '1';
    signBtn.addEventListener('click', async () => {
      try {
        const frame = q('#viewer');
        if (!frame?.contentWindow || !frame?.contentDocument) {
          alert('Carga primero un consentimiento en el visor.');
          return;
        }

        const { nombre, doc } = getPacienteFromIframe();
        const dataUrl = await pedirFirmaDataURL();
        if (!dataUrl) return; // cancelado

        // Enviar al backend (prefijo global /api)
        const resp = await fetch('/api/firmas/paciente', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imagenBase64: dataUrl,
            pacienteNombre: nombre,
            pacienteDoc: doc
          })
        });
        if (!resp.ok) throw new Error(await resp.text() || 'Error guardando la firma');
        const json = await resp.json(); // { url: '/firmapacientes/...' }

        injectFirmaIntoIframe(json.url);

        // Mensaje breve
        if (window.Swal) Swal.fire({ icon: 'success', title: '¡Firma guardada!', timer: 1200, showConfirmButton: false });
        else alert('¡Firma guardada!');
      } catch (err) {
        console.error(err);
        if (window.Swal) Swal.fire({ icon: 'error', title: 'Error', text: err?.message || String(err) });
        else alert('Error: ' + (err?.message || String(err)));
      }
    });
  }

  // === Handler del botón "Imprimir" (usa el contenido actual del iframe) ===
  const printBtn = q('#printBtn');
  if (printBtn && !printBtn.dataset.printBound) {
    printBtn.dataset.printBound = '1';
    printBtn.addEventListener('click', () => {
      const frame = q('#viewer');
      if (!frame?.contentWindow) {
        alert('No hay documento cargado para imprimir.');
        return;
      }
      // Por si acaso, inyecta CSS de impresión mínimo
      const doc = frame.contentDocument;
      if (doc && !doc.getElementById('firmaPrintCss')) {
        const style = doc.createElement('style');
        style.id = 'firmaPrintCss';
        style.textContent = `
          @media print {
            #firmaPaciente { display:block !important; }
            #firmaPacienteWrap { page-break-inside: avoid; }
            img { max-width: 100% !important; }
          }
        `;
        doc.head.appendChild(style);
      }
      frame.contentWindow.focus();
      frame.contentWindow.print();
    });
  }
})();

/* ===================== GUARDAR -> generar PDF en servidor ===================== */
(() => {
  const $ = (sel) => document.querySelector(sel);

  function getPacienteFromIframe() {
    const frame = $('#viewer');
    const doc = frame && frame.contentDocument;
    const out = { nombre: 'paciente', doc: 'sin_doc' };
    if (!doc) return out;
    const nombre = doc.getElementById('T1');
    const docId = doc.getElementById('T5');
    if (nombre && nombre.value) out.nombre = String(nombre.value).trim() || out.nombre;
    if (docId && docId.value) out.doc = String(docId.value).trim() || out.doc;
    return out;
  }

  async function getIframeHtml() {
    const frame = $('#viewer');
    if (!frame?.contentDocument) throw new Error('No hay documento cargado.');
    // Serializamos TODO el HTML (incluye la <img id="firmaPaciente"> ya insertada)
    const doc = frame.contentDocument;
    return '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
  }
 
})();



const saveBtn = document.getElementById('saveBtn');

function setSaving(saving) {
  if (!saveBtn) return;
  saveBtn.disabled = saving;
  saveBtn.classList.toggle('is-loading', saving);
  saveBtn.setAttribute('aria-busy', saving ? 'true' : 'false');
  const label = saveBtn.querySelector('.btn__label');
  if (label) {
    if (saving) {
      label.dataset.text = label.textContent;
      label.textContent = 'Guardando…';
    } else {
      label.textContent = label.dataset.text || 'Guardar';
    }
  }
}

saveBtn?.addEventListener('click', async () => {
  setSaving(true);
  try {
    const frame = document.querySelector('#viewer');
    if (!frame?.contentDocument || !frame.contentWindow) {
      alert('No hay documento cargado.');
      return;
    }

    const w = frame.contentWindow;
    const srcDoc = frame.contentDocument;

    const cloneEl = srcDoc.documentElement.cloneNode(true);

    // 2) CANVAS → IMG (firma dibujada)
    {
      const origCanvases = Array.from(srcDoc.querySelectorAll('canvas'));
      const cloneCanvases = Array.from(cloneEl.querySelectorAll('canvas'));
      origCanvases.forEach((orig, i) => {
        try {
          const dataUrl = orig.toDataURL('image/png');
          const cloneNode = cloneCanvases[i];
          if (!cloneNode) return;

          const img = cloneEl.ownerDocument.createElement('img');
          img.src = dataUrl;
          img.alt = cloneNode.getAttribute?.('alt') || 'Firma';
          if (cloneNode.getAttribute) img.setAttribute('style', cloneNode.getAttribute('style') || '');
          if (cloneNode.className) img.className = cloneNode.className;
          if (orig.width) img.width = orig.width;
          if (orig.height) img.height = orig.height;

          cloneNode.replaceWith(img);
        } catch { /* canvas tainted o sin firma: ignorar */ }
      });
    }

    // 3) IMG blob:/relativas → data:/absolutas (incluye ../ y ./)
    {
      const baseHref = frame.contentWindow.location.href; // URL de la página dentro del iframe
      const imgs = Array.from(cloneEl.querySelectorAll('img'));

      // helper para convertir a dataURL (útil para #Entidad3)
      async function toDataURL(absUrl) {
        const res = await w.fetch(absUrl, { cache: 'no-store' });
        const blob = await res.blob();
        const dataUrl = await new Promise((resolve) => {
          const fr = new w.FileReader();
          fr.onloadend = () => resolve(fr.result);
          fr.readAsDataURL(blob);
        });
        return dataUrl; // 'data:image/png;base64,...'
      }

      for (const img of imgs) {
        let src = img.getAttribute('src') || '';
        try {
          if (!src) continue;

          // a) blob: → data:
          if (src.startsWith('blob:')) {
            const blob = await w.fetch(src).then(r => r.blob());
            const dataUrl = await new Promise((resolve) => {
              const fr = new w.FileReader();
              fr.onloadend = () => resolve(fr.result);
              fr.readAsDataURL(blob);
            });
            img.setAttribute('src', dataUrl);
            continue;
          }

          // b) data: → ya está embebido
          if (src.startsWith('data:')) continue;

          // c) ABSOLUTA http/https → la dejamos (Puppeteer la carga)
          if (/^https?:\/\//i.test(src)) {
            // Pero si es la firma del profesional (#Entidad3), la embebemos para mayor robustez
            if (img.id === 'Entidad3') {
              const dataUrl = await toDataURL(src);
              img.setAttribute('src', dataUrl);
            }
            continue;
          }

          // d) RELATIVAS (incluye "../FirmasProfesionales/..." y "FirmasProfesionales/...")
          //    Resolver contra la URL del iframe
          const abs = new URL(src, baseHref).href; // ej: http://localhost:3000/FirmasProfesionales/123.png

          // Para #Entidad3 (firma profesional) embebemos en dataURL para que nunca falle
          if (img.id === 'Entidad3') {
            const dataUrl = await toDataURL(abs);
            img.setAttribute('src', dataUrl);
          } else {
            img.setAttribute('src', abs); // suficiente para el resto de imágenes
          }
        } catch {
          // si algo falla, dejamos el src como está
        }
      }
    }

    // === Sincroniza todos los inputs, textareas y selects del iframe al clon ===
    (function syncFormState(srcDoc, cloneDoc) {
      // INPUTS
      srcDoc.querySelectorAll('input').forEach((srcInput) => {
        // localizar el input correspondiente en el clon
        const cloneInput = cloneDoc.querySelector(`input[name="${srcInput.name}"]`)
          || cloneDoc.querySelector(`#${srcInput.id}`);
        if (!cloneInput) return;

        const type = (srcInput.type || '').toLowerCase();

        switch (type) {
          case 'checkbox':
          case 'radio':
            if (srcInput.checked) cloneInput.setAttribute('checked', 'checked');
            else cloneInput.removeAttribute('checked');
            break;
          case 'file':
            // no se puede copiar contenido de archivos, se deja vacío
            cloneInput.removeAttribute('value');
            break;
          default:
            cloneInput.setAttribute('value', srcInput.value ?? '');
        }
      });

      // TEXTAREAS
      srcDoc.querySelectorAll('textarea').forEach((src) => {
        const clone = cloneDoc.querySelector(`textarea[name="${src.name}"]`)
          || cloneDoc.querySelector(`#${src.id}`);
        if (!clone) return;
        clone.textContent = src.value ?? '';
      });

      // SELECTS
      srcDoc.querySelectorAll('select').forEach((src) => {
        const clone = cloneDoc.querySelector(`select[name="${src.name}"]`)
          || cloneDoc.querySelector(`#${src.id}`);
        if (!clone) return;

        // marcar las opciones seleccionadas
        Array.from(clone.options).forEach((opt) => opt.removeAttribute('selected'));
        Array.from(src.options).forEach((opt, i) => {
          if (opt.selected) clone.options[i]?.setAttribute('selected', 'selected');
        });

        clone.setAttribute('value', src.value ?? '');
      });
    })(srcDoc, cloneEl);

    // 4) HTML final con DOCTYPE
    const html = '<!DOCTYPE html>\n' + cloneEl.outerHTML;

    const selectEm = document.getElementById('EmpresasSelect');
    const EmpDocumento = selectEm.value;
    // const EmpNombre = selectEm.options[selectEm.selectedIndex]?.text;
    // 5) Datos del paciente
    // const nombre = srcDoc.getElementById('T1')?.value || 'paciente';
    const nombre = srcDoc.getElementById('nombre')?.value || 'paciente';
    // const doc = srcDoc.getElementById('T5')?.value || 'sin_doc';
    const doc = srcDoc.getElementById('CedulaPaciente')?.value || 'sin_doc';

    const resp = await fetch('/api/consentimientos/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        html,
        pacienteNombre: nombre,
        pacienteDoc: doc,
        descripcion: 'Consentimiento firmado',
        documentoEmpresa: EmpDocumento
      })
    });

    if (!resp.ok) throw new Error(await resp.text());
    const json = await resp.json();

    const msg = `✅ PDF guardado.\n\nRuta: ${json.filePath}\nID: ${json.anexoId}`;
    confirm(msg);
    // window.open(`/api/consentimientos/pdf/${json.anexoId}`, '_blank');
  } catch (e) {
    alert('No se pudo guardar el PDF: ' + (e?.message || String(e)));
  } finally {
    setSaving(false);
  }
});


// ==== CAMBIO ENTRE SECCIONES ====
const formulaSection = document.getElementById('formulaMedica');
const consentSection = document.getElementById('Consentimientos');
// const consentSection = document.querySelector('.Consentimientos');
const btnFormula = document.getElementById('FormulaMedicaBtn');
const btnConsent = document.getElementById('ConsentimientosBtn');

// Mostrar Formulario de Paciente (Fórmula Médica)
btnFormula?.addEventListener('click', () => {
  formulaSection.hidden = false;
  consentSection.style.display = 'none'; // oculta consentimientos
  btnFormula.disabled = true;
  btnConsent.disabled = false;
});

// Mostrar Consentimientos
btnConsent?.addEventListener('click', () => {
  consentSection.style.display = 'block';
  formulaSection.hidden = true; // oculta formulario
  btnConsent.disabled = true;
  btnFormula.disabled = false;
});



// --- Consulta de paciente en vista Formula
async function consultarPacienteFormula() {
  const doc = document.getElementById('docFormula').value.trim();
  if (!doc) {
    alert('Ingrese un documento para consultar.');
    return;
  }
  console.log(doc);

  // const resp = await tryFetch(`api/cnsta-nest-pacientes-formula/${encodeURIComponent(doc)}`, { cache: 'no-store' });
  // if (!resp) {
  //   alert('No se pudo conectar con el servidor.');
  //   return;
  // }

  const resp = await fetch(`api/cnsta-nest-pacientes-formula/${encodeURIComponent(doc)}`, { cache: 'no-store' });
  if (!resp.ok) {
    alert('No se pudo conectar con el servidor.');
    return;
  }


  const data = await resp.json();
  if (!data) {
    alert('No se encontró información para el documento especificado.');
    return;
  }
console.log(data);

  // Rellenar campos (solo lectura)
  document.getElementById('edadFormula').value = data['edadEntidadIII'] ?? '';
  document.getElementById('direccionFormula').value = data['direccionEntidadII'] ?? '';
  document.getElementById('ciudadFormula').value = data['ciudad'] ?? '';
  document.getElementById('telefono1Formula').value = data['telefono1EntidadII'] ?? '';
  document.getElementById('telefono2Formula').value = data['telefono2EntidadII'] ?? '';
  document.getElementById('celularFormula').value = data['telefonoCelularEntidadII'] ?? '';
  document.getElementById('fechaNacFormula').value = data['fechaNacimientoEntidadIII']?.split('T')[0] ?? '';
  document.getElementById('sexoFormula').value = data['sexo'] ?? '';
  document.getElementById('estadoCivilFormula').value = data['estadoCivil'] ?? '';
  document.getElementById('NombrePaciente').value = data['NombreCompleto'] ?? '';
}

// Dispara la búsqueda al presionar Enter
document.getElementById('docFormula')?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    consultarPacienteFormula();
  }
});

document.getElementById('Buscarbtn2')?.addEventListener('click', consultarPacienteFormula);


