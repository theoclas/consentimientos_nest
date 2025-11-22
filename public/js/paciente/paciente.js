// js/paciente/paciente.js
import { $, escapeHtml } from '../utils/dom.js';
import { apiHeaders, tryFetch } from '../utils/api.js';

// Referencias a la sección de info de paciente
const infoPacienteElement = $('#infoPaciente');

const pacienteFields = infoPacienteElement
  ? {
      nombre: infoPacienteElement.querySelector('[data-field="nombre"]'),
      numero: infoPacienteElement.querySelector('[data-field="numero"]'),
      celular: infoPacienteElement.querySelector('[data-field="celular"]'),
      correo: infoPacienteElement.querySelector('[data-field="correo"]'),
    }
  : {};

// Normaliza la entidad de paciente desde las distintas formas de respuesta
function normalizarEntidadPaciente(data, docIngresado) {
  const entidad = data.entidad || data || {};

  const nombreCompleto =
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

  const numeroDocumento =
    entidad.documentoEntidad || data.documentoEntidad || docIngresado;

  const celular =
    data.telefonoCelularEntidadII ||
    entidad.telefonoCelularEntidadII ||
    entidad.celular ||
    '—';

  const correo =
    data.emailEntidadII || entidad.emailEntidadII || entidad.correo || '—';

  return {
    nombre: nombreCompleto || 'Sin nombre',
    numero: String(numeroDocumento),
    celular: String(celular),
    correo: String(correo),
  };
}

// Rellena la UI con los datos del paciente
function pintarPacienteEnUI(paciente) {
  if (!infoPacienteElement) return;

  pacienteFields.nombre.textContent = paciente.nombre;
  pacienteFields.numero.textContent = paciente.numero;
  pacienteFields.celular.textContent = paciente.celular;
  pacienteFields.correo.textContent = paciente.correo;

  infoPacienteElement.hidden = false;
}

// Consulta paciente por documento y pinta en la UI
export async function buscarPacientePorDocumento() {
  const docInput = $('#docInput');
  const documento = (docInput?.value || '').trim();

  if (!documento) {
    alert('Escribe un documento para buscar.');
    return;
  }

  // Primero intenta /api/entidadii/:doc y luego fallback ./entidadii/:doc
  let response = await tryFetch(`api/entidadii/${encodeURIComponent(documento)}`, {
    headers: apiHeaders(),
    cache: 'no-store',
  });

  if (!response) {
    response = await tryFetch(`./entidadii/${encodeURIComponent(documento)}`, {
      headers: apiHeaders(),
      cache: 'no-store',
    });
  }

  if (!response) {
    alert('No se pudo conectar con el servicio de pacientes.');
    return;
  }

  const data = await response.json();
  const paciente = normalizarEntidadPaciente(data, documento);
  pintarPacienteEnUI(paciente);
}

// Devuelve datos básicos del paciente actualmente cargado en la UI
export function getPacienteBasics() {
  const infoEl = $('#infoPaciente');
  if (infoEl?.hidden) return null;

  const getFieldText = (selector) =>
    (infoEl.querySelector(selector)?.textContent || '').trim();

  return {
    nombre: getFieldText('[data-field="nombre"]'),
    numero: getFieldText('[data-field="numero"]'),
    celular: getFieldText('[data-field="celular"]'),
    correo: getFieldText('[data-field="correo"]'),
    profDocumento: getFieldText('[data-field="profDocumento"]'),
    profNombre: getFieldText('[data-field="profNombre"]'),
    EmpDocumento: getFieldText('[data-field="EmpDocumento"]'),
    EmpNombre: getFieldText('[data-field="EmpNombre"]'),
    profNombre2: getFieldText('[data-field="profNombre2"]'),
  };
}

// Construye el contexto para un consentimiento, a partir de tu UI
export function buildConsentContext() {
  const paciente = getPacienteBasics();

  const profSelect = document.getElementById('profSelect');
  const profDocumento = profSelect?.value || '';
  const profNombre =
    profSelect?.options[profSelect.selectedIndex]?.text || '';

  const context = {
    paciente: {
      nombre: paciente?.nombre || '',
      numero: paciente?.numero || '',
      celular: paciente?.celular || '',
      correo: paciente?.correo || '',
    },
    profesional: {
      documento: profDocumento,
      nombre: profNombre,
      registroMedico: '', // pendiente: si tienes este campo en el endpoint de profesionales
    },
    usuarioActual: '', // si manejas el usuario logueado
    rips: {}, // si manejas códigos rips
  };

  return context;
}

// Inicializa eventos asociados al paciente (botón buscar + enter)
export function initPacienteEventos() {
  const buscarBtn = $('#buscarBtn');
  const docInput = $('#docInput');

  buscarBtn?.addEventListener('click', buscarPacientePorDocumento);

  docInput?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      buscarPacientePorDocumento();
    }
  });
}
