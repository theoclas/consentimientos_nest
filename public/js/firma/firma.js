// js/firma/firma.js

// Helpers mínimos
const q = (selector, root = document) => root.querySelector(selector);

// Carga SweetAlert2 y SignaturePad solo si faltan
async function ensureLibs() {
  const tasks = [];

  if (typeof window.Swal === 'undefined') {
    tasks.push(loadScript('https://cdn.jsdelivr.net/npm/sweetalert2@11'));
  }

  if (typeof window.SignaturePad === 'undefined') {
    tasks.push(
      loadScript(
        'https://cdn.jsdelivr.net/npm/signature_pad@4.1.5/dist/signature_pad.umd.min.js',
      ),
    );
  }

  if (tasks.length) {
    await Promise.all(tasks);
  }
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Lee nombre/doc del paciente desde el documento cargado en el iframe (#T1 y #T5)
function getPacienteFromIframe() {
  const frame = q('#viewer');
  const doc = frame && frame.contentDocument;

  const out = { nombre: 'paciente', doc: 'sin_doc' };
  if (!doc) return out;

  const nombreInput = doc.getElementById('T1');
  const docInput = doc.getElementById('T5');

  if (nombreInput && nombreInput.value) {
    out.nombre = String(nombreInput.value).trim() || out.nombre;
  }

  if (docInput && docInput.value) {
    out.doc = String(docInput.value).trim() || out.doc;
  }

  return out;
}

// Inserta/actualiza <img id="firmaPaciente"> en el documento del iframe
function injectFirmaIntoIframe(url) {
  const frame = q('#viewer');
  const doc = frame && frame.contentDocument;

  if (!doc) {
    throw new Error('No hay documento cargado en el visor.');
  }

  let img = doc.getElementById('firmaPaciente');

  if (!img) {
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

  img.src = `${url}?t=${Date.now()}`;

  // Asegura que se imprima correctamente
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
        minWidth: 0.7,
        maxWidth: 2.2,
        throttle: 2,
        backgroundColor: 'rgba(255,255,255,1)',
        penColor: 'black',
      });

      document.getElementById('btnClear')?.addEventListener('click', () =>
        pad.clear(),
      );

      document.getElementById('btnUndo')?.addEventListener('click', () => {
        const data = pad.toData();
        if (data.length) {
          data.pop();
          pad.fromData(data);
        }
      });

      Swal.__pad = pad;
      Swal.__cleanup = () => window.removeEventListener('resize', resize);
    },
    willClose: () => {
      Swal.__cleanup?.();
    },
    preConfirm: () => {
      const pad = Swal.__pad;
      if (!pad || pad.isEmpty()) {
        Swal.showValidationMessage(
          'Por favor, realice la firma antes de guardar.',
        );
        return false;
      }
      return pad.toDataURL('image/png');
    },
  });

  if (ret.isConfirmed && typeof ret.value === 'string') {
    return ret.value;
  }

  return null;
}

// Handler del botón "Firmar"
function initSignButton() {
  const signBtn = q('#signBtn');

  if (!signBtn || signBtn.dataset.firmaBound === '1') return;

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

      const resp = await fetch('/api/firmas/paciente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imagenBase64: dataUrl,
          pacienteNombre: nombre,
          pacienteDoc: doc,
        }),
      });

      if (!resp.ok) {
        throw new Error((await resp.text()) || 'Error guardando la firma');
      }

      const json = await resp.json(); // { url: '/firmapacientes/...' }
      injectFirmaIntoIframe(json.url);

      if (window.Swal) {
        Swal.fire({
          icon: 'success',
          title: '¡Firma guardada!',
          timer: 1200,
          showConfirmButton: false,
        });
      } else {
        alert('¡Firma guardada!');
      }
    } catch (error) {
      console.error(error);

      if (window.Swal) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error?.message || String(error),
        });
      } else {
        alert('Error: ' + (error?.message || String(error)));
      }
    }
  });
}

export function initFirma() {
  initSignButton();
}
