// js/pdf/pdf.js
import { $ } from '../utils/dom.js';

const saveBtn = document.getElementById('saveBtn');

function setSaving(saving) {
  if (!saveBtn) return;

  saveBtn.disabled = saving;
  saveBtn.classList.toggle('is-loading', saving);
  saveBtn.setAttribute('aria-busy', saving ? 'true' : 'false');

  const label = saveBtn.querySelector('.btn__label');
  if (!label) return;

  if (saving) {
    label.dataset.text = label.textContent;
    label.textContent = 'Guardando…';
  } else {
    label.textContent = label.dataset.text || 'Guardar';
  }
}

async function handleSaveClick() {
  setSaving(true);

  try {
    const frame = $('#viewer');
    if (!frame?.contentDocument || !frame.contentWindow) {
      alert('No hay documento cargado.');
      return;
    }

    const w = frame.contentWindow;
    const srcDoc = frame.contentDocument;

    // Clonamos el documento entero del iframe
    const cloneEl = srcDoc.documentElement.cloneNode(true);

    // === 1) CANVAS → IMG (firma dibujada) ===
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

          if (cloneNode.getAttribute) {
            img.setAttribute('style', cloneNode.getAttribute('style') || '');
          }

          if (cloneNode.className) {
            img.className = cloneNode.className;
          }

          if (orig.width) img.width = orig.width;
          if (orig.height) img.height = orig.height;

          cloneNode.replaceWith(img);
        } catch {
          // canvas tainted o sin firma: ignorar
        }
      });
    }

    // === 2) IMG src → absolutos o data: (incluye ../ y ./) ===
    {
      const baseHref = frame.contentWindow.location.href;
      const imgs = Array.from(cloneEl.querySelectorAll('img'));

      async function toDataURL(absUrl) {
        const res = await w.fetch(absUrl, { cache: 'no-store' });
        const blob = await res.blob();

        const dataUrl = await new Promise((resolve) => {
          const reader = new w.FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });

        return dataUrl;
      }

      for (const img of imgs) {
        let src = img.getAttribute('src') || '';

        try {
          if (!src) continue;

          // a) blob: → data:
          if (src.startsWith('blob:')) {
            const blob = await w.fetch(src).then((r) => r.blob());

            const dataUrl = await new Promise((resolve) => {
              const reader = new w.FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(blob);
            });

            img.setAttribute('src', dataUrl);
            continue;
          }

          // b) data: → ya está embebido
          if (src.startsWith('data:')) {
            continue;
          }

          // c) ABSOLUTA http/https → la dejamos (Puppeteer la carga)
          if (/^https?:\/\//i.test(src)) {
            // Para #Entidad3 (firma profesional) la embebemos en dataURL
            if (img.id === 'Entidad3') {
              const dataUrl = await toDataURL(src);
              img.setAttribute('src', dataUrl);
            }
            continue;
          }

          // d) RELATIVAS: resolver contra la URL del iframe
          const abs = new URL(src, baseHref).href;

          if (img.id === 'Entidad3') {
            const dataUrl = await toDataURL(abs);
            img.setAttribute('src', dataUrl);
          } else {
            img.setAttribute('src', abs);
          }
        } catch {
          // si algo falla, dejamos el src como está
        }
      }
    }

    // === 3) Sincroniza inputs, textareas y selects del iframe al clon ===
    (function syncFormState(src, clone) {
      // INPUTS
      src.querySelectorAll('input').forEach((srcInput) => {
        const cloneInput =
          clone.querySelector(`input[name="${srcInput.name}"]`) ||
          clone.querySelector(`#${srcInput.id}`);

        if (!cloneInput) return;

        const type = (srcInput.type || '').toLowerCase();

        switch (type) {
          case 'checkbox':
          case 'radio':
            if (srcInput.checked) {
              cloneInput.setAttribute('checked', 'checked');
            } else {
              cloneInput.removeAttribute('checked');
            }
            break;
          case 'file':
            cloneInput.removeAttribute('value');
            break;
          default:
            cloneInput.setAttribute('value', srcInput.value ?? '');
        }
      });

      // TEXTAREAS
      src.querySelectorAll('textarea').forEach((srcTextarea) => {
        const cloneTextarea =
          clone.querySelector(`textarea[name="${srcTextarea.name}"]`) ||
          clone.querySelector(`#${srcTextarea.id}`);

        if (!cloneTextarea) return;
        cloneTextarea.textContent = srcTextarea.value ?? '';
      });

      // SELECTS
      src.querySelectorAll('select').forEach((srcSelect) => {
        const cloneSelect =
          clone.querySelector(`select[name="${srcSelect.name}"]`) ||
          clone.querySelector(`#${srcSelect.id}`);

        if (!cloneSelect) return;

        Array.from(cloneSelect.options).forEach((opt) =>
          opt.removeAttribute('selected'),
        );

        Array.from(srcSelect.options).forEach((opt, i) => {
          if (opt.selected) {
            cloneSelect.options[i]?.setAttribute('selected', 'selected');
          }
        });

        cloneSelect.setAttribute('value', srcSelect.value ?? '');
      });
    })(srcDoc, cloneEl);

    // === 4) HTML final con DOCTYPE ===
    const html = '<!DOCTYPE html>\n' + cloneEl.outerHTML;

    // === 5) Datos extra: empresa + paciente ===
    const empresaSelect = document.getElementById('EmpresasSelect');
    const documentoEmpresa = empresaSelect?.value || '';

    const nombrePaciente =
      srcDoc.getElementById('nombre')?.value || 'paciente';
    const documentoPaciente =
      srcDoc.getElementById('CedulaPaciente')?.value || 'sin_doc';

    const resp = await fetch('/api/consentimientos/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        html,
        pacienteNombre: nombrePaciente,
        pacienteDoc: documentoPaciente,
        descripcion: 'Consentimiento firmado',
        documentoEmpresa,
      }),
    });

    if (!resp.ok) {
      throw new Error(await resp.text());
    }

    const json = await resp.json();

    const msg = `✅ PDF guardado.\n\nRuta: ${json.filePath}\nID: ${json.anexoId}`;
    confirm(msg);
    // Si quieres abrirlo en otra pestaña:
    // window.open(`/api/consentimientos/pdf/${json.anexoId}`, '_blank');
  } catch (error) {
    alert('No se pudo guardar el PDF: ' + (error?.message || String(error)));
  } finally {
    setSaving(false);
  }
}

export function initPdfGuardado() {
  if (!saveBtn) return;

  saveBtn.addEventListener('click', () => {
    handleSaveClick().catch((err) => {
      console.error('Error en guardado PDF:', err);
      setSaving(false);
    });
  });
}
