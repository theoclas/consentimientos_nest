// js/formula/formula.js
import { tryFetch, apiHeaders } from '../utils/api.js';

// Consulta de paciente en vista Fórmula
async function consultarPacienteFormula() {
  const docInput = document.getElementById('docFormula');
  const documento = docInput?.value.trim() || '';
  

  if (!documento) {
    alert('Ingrese un documento para consultar.');
    return;
  }

  console.log('Documento fórmula:', documento);

  // Aquí puedes usar tryFetch si quieres el mismo patrón de fallback.
  // De momento mantengo la versión directa que tenías:
  const resp = await fetch(
    `api/cnsta-nest-pacientes-formula/${encodeURIComponent(documento)}`,
    {
      cache: 'no-store',
      // Si requieres token: headers: apiHeaders(),
    },
  );

  if (!resp.ok) {
    alert('No se pudo conectar con el servidor.');
    return;
  }

  const data = await resp.json();
  if (!data) {
    alert('No se encontró información para el documento especificado.');
    return;
  }

  console.log('Datos fórmula:', data);

  // Rellenar campos (solo lectura)
  document.getElementById('edadFormula').value =
    data['edadEntidadIII'] ?? '';
  document.getElementById('direccionFormula').value =
    data['direccionEntidadII'] ?? '';
  document.getElementById('ciudadFormula').value = data['ciudad'] ?? '';
  document.getElementById('telefono1Formula').value =
    data['telefono1EntidadII'] ?? '';
  document.getElementById('telefono2Formula').value =
    data['telefono2EntidadII'] ?? '';
  document.getElementById('celularFormula').value =
    data['telefonoCelularEntidadII'] ?? '';
  document.getElementById('fechaNacFormula').value =
    data['fechaNacimientoEntidadIII']?.split('T')[0] ?? '';
  document.getElementById('sexoFormula').value = data['sexo'] ?? '';
  document.getElementById('estadoCivilFormula').value =
    data['estadoCivil'] ?? '';
  document.getElementById('NombrePaciente').value =
    data['NombreCompleto'] ?? '';

  
}

export function initFormula() {
  const docInput = document.getElementById('docFormula');
  const buscarBtn = document.getElementById('Buscarbtn2');

  docInput?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      consultarPacienteFormula();
    }
  });

  buscarBtn?.addEventListener('click', consultarPacienteFormula);


   const btnImprimir = document.getElementById('btnImprimirformula');
  const iframe = document.getElementById('formIframe');

  btnImprimir?.addEventListener('click', () => {
    if (!iframe) {
      alert('No existe el iframe de Fórmula (formIframe).');
      return;
    }

    // si lo estás ocultando con display:none cuando NO está activo:
    const hiddenByDisplay = getComputedStyle(iframe).display === 'none';
    if (hiddenByDisplay) {
      alert('Primero abre/carga la Fórmula Médica para imprimir.');
      return;
    }

    // imprime SOLO el contenido del iframe
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
  });

}


// export function initFormula() {
 
 
// }

