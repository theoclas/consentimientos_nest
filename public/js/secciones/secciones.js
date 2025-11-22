// js/secciones/secciones.js

export function initSecciones() {
  const formulaSection = document.getElementById('formulaMedica');
  const consentSection = document.getElementById('Consentimientos');

  const btnFormula = document.getElementById('FormulaMedicaBtn');
  const btnConsent = document.getElementById('ConsentimientosBtn');

  if (!formulaSection || !consentSection || !btnFormula || !btnConsent) {
    return;
  }

  // Mostrar Formulario de Paciente (Fórmula Médica)
  btnFormula.addEventListener('click', () => {
    formulaSection.hidden = false;
    consentSection.style.display = 'none';
    btnFormula.disabled = true;
    btnConsent.disabled = false;
  });

  // Mostrar Consentimientos
  btnConsent.addEventListener('click', () => {
    consentSection.style.display = 'block';
    formulaSection.hidden = true;
    btnConsent.disabled = true;
    btnFormula.disabled = false;
  });
}
