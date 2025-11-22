// js/main.js
import { ensureAuth } from './utils/api.js';
import { initPacienteEventos } from './paciente/paciente.js';
import { initEmpresas } from './empresas/empresas.js';
import { initProfesionales } from './profesionales/profesionales.js';
import { initConsentimientos } from './consentimientos/consentimientos.js';
import { initVisorBasico } from './visor/visor.js';
import { initFirma } from './firma/firma.js';
import { initPdfGuardado } from './pdf/pdf.js';
import { initSecciones } from './secciones/secciones.js';
import { initFormula } from './formula/formula.js';

// Nota: las funciones init* de los otros módulos
// las escribiré en las PARTES siguientes 😉

function initLogout() {
  const logoutBtn = document.getElementById('logoutBtn');
  logoutBtn?.addEventListener('click', () => {
    sessionStorage.removeItem('token');
    window.location.href = 'index.html';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // 1) Auth
  ensureAuth();

  // 2) Logout
  initLogout();

  // 3) Paciente (búsqueda / info básica)
  initPacienteEventos();

  // 4) Módulos de datos
  initEmpresas();
  initProfesionales();
  initConsentimientos();

  // 5) Visor, firma, PDF
  initVisorBasico();
  initFirma();
  initPdfGuardado();

  // 6) Navegación entre secciones y fórmula médica
  initSecciones();
  initFormula();
});
