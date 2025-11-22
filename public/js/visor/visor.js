// js/visor/visor.js
import { $ } from '../utils/dom.js';
import { getPacienteBasics } from '../paciente/paciente.js';

// Abre un consentimiento en el iframe visor
export function openInViewer(href, title) {
  const wrap = $('#viewerWrap');
  if (!wrap) {
    alert('No se encontró el contenedor del visor.');
    return;
  }

  const frame = $('#viewer');
  const viewerTitle = $('#viewerTitle');
  const openNewLink = $('#openNew');

  if (!frame || !viewerTitle || !openNewLink) {
    alert('No se encontraron elementos del visor.');
    return;
  }

  frame.src = href;
  frame.onload = () => {
    try {
      // Esta función la tienes en tu front antiguo; se mantiene el try/catch
      // para no romper si no existe.
      if (typeof window.fillConsentFieldsInIframe === 'function') {
        window.fillConsentFieldsInIframe(frame);
      } else {
        // por si la función está definida en global sin "window."
        // eslint-disable-next-line no-undef
        fillConsentFieldsInIframe?.(frame);
      }
    } catch (error) {
      console.warn('No se pudieron rellenar campos en el iframe:', error);
    }
  };

  viewerTitle.textContent = title || 'Vista previa';
  openNewLink.href = href;

  wrap.hidden = false;
  wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Construye la URL del consentimiento con parámetros del paciente y contexto
function buildConsentUrl(baseHref) {
  const paciente = getPacienteBasics();
  if (!paciente) {
    alert(
      'Primero busca y carga un paciente para enviar sus datos al consentimiento.',
    );
    return null;
  }

  const empresaSelect = document.getElementById('EmpresasSelect');
  const profesionalSelect = document.getElementById('profSelect');

  if (!empresaSelect || !profesionalSelect) {
    alert('No se encontraron los selects de Empresa o Profesional.');
    return null;
  }

  const empresaDocumento = empresaSelect.value;
  const empresaNombre = empresaSelect.options[empresaSelect.selectedIndex]?.text;

  const profesionalDocumento = profesionalSelect.value;
  const profesionalNombre =
    profesionalSelect.options[profesionalSelect.selectedIndex]?.text;

  console.log(profesionalDocumento, profesionalNombre);
  console.log('profDocumento', 'profNombre');

  const queryParams = new URLSearchParams({
    nombre: paciente.nombre || '',
    numero: paciente.numero || '',
    celular: paciente.celular || '',
    correo: paciente.correo || '',
    profDocumento: profesionalDocumento || '',
    profNombre: profesionalNombre || '',
    EmpDocumento: empresaDocumento || '',
    EmpNombre: empresaNombre || '',
    profNombre2: 'EmpNombre2' || '',
  });

  return `${baseHref}?${queryParams.toString()}`;
}

function initVerAquiButton() {
  const verAquiBtn = $('#verAquiBtn');
  if (!verAquiBtn) return;

  verAquiBtn.addEventListener('click', () => {
    const consentimientoSelect = $('#consSelect');
    const profesionalesSelect = document.getElementById('profSelect');
    const empresasSelect = document.getElementById('EmpresasSelect');

    const fileEnc = consentimientoSelect?.value || '';

    if (!fileEnc) {
      alert('Selecciona un consentimiento de la lista.');
      return;
    }

    if (!profesionalesSelect?.value?.trim()) {
      alert('Selecciona un profesional de la lista.');
      return;
    }

    if (!empresasSelect?.value?.trim()) {
      alert('Selecciona una Empresa de la lista.');
      return;
    }

    const basePath = '/Consentimientos/' + fileEnc.replace(/%2F/g, '/');
    const url = buildConsentUrl(basePath);
    if (!url) return;

    openInViewer(url, decodeURIComponent(fileEnc));
  });
}

function initPrintButtonBasico() {
  const printBtn = $('#printBtn');
  if (!printBtn) return;

  printBtn.addEventListener('click', () => {
    const frame = document.getElementById('viewer');
    if (frame?.contentWindow) {
      frame.contentWindow.focus();
      frame.contentWindow.print();
    } else {
      alert('Carga primero un consentimiento.');
    }
  });
}

export function initVisorBasico() {
  initVerAquiButton();
  initPrintButtonBasico();
}
