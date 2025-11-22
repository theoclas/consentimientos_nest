// js/profesionales/profesionales.js
import { apiHeaders, tryFetch } from '../utils/api.js';

async function fetchProfesionales() {
  const profesionalesSelect = document.getElementById('profSelect');
  if (!profesionalesSelect) return;

  let resp = await tryFetch('api/profesionales', {
    headers: apiHeaders(),
    cache: 'no-store',
  });

  if (!resp) {
    resp = await tryFetch('./api/profesionales', {
      headers: apiHeaders(),
      cache: 'no-store',
    });
  }

  if (!resp) {
    alert('No se pudo conectar con el servicio de pacientes.');
    return;
  }

  const data = await resp.json();
  console.log('Profesionales fetched:', data);

  // Limpia opciones actuales
  profesionalesSelect.innerHTML = '';

  // Placeholder
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = 'Seleccione un profesional...';
  placeholder.disabled = true;
  placeholder.selected = true;
  profesionalesSelect.appendChild(placeholder);

  // Normalizador de campos por si cambian mayúsculas/estilo
  const getField = (obj, keys) => {
    for (const key of keys) {
      if (obj[key] != null) return obj[key];
    }
    return undefined;
  };

  // Asegura que sea un array
  const rows = Array.isArray(data)
    ? data
    : Array.isArray(data?.items)
    ? data.items
    : [];

  // Mapea y filtra registros válidos
  const items = rows
    .map((row) => {
      const doc = getField(row, [
        'documentoProfesional',
        'DocumentoProfesional',
        'Documento Profesional',
        'documento_profesional',
      ]);
      const nombre = getField(row, [
        'nombresProfesional',
        'Nombres Profesional',
        'NombresProfesional',
        'nombres_profesional',
      ]);
      return { doc, nombre };
    })
    .filter((item) => item.doc && item.nombre);

  // Ordena por nombre (opcional)
  items.sort((a, b) =>
    a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' }),
  );

  // Inserta opciones
  const fragment = document.createDocumentFragment();
  for (const { doc, nombre } of items) {
    const option = document.createElement('option');
    option.value = String(doc);
    option.textContent = String(nombre);
    fragment.appendChild(option);
  }

  profesionalesSelect.appendChild(fragment);
}

function initProfesionalesChangeLogging() {
  document.addEventListener('change', (event) => {
    const target = event.target;
    if (!target) return;

    if (target.id === 'profSelect') {
      const select = target;
      const documento = select.value;
      const nombre = select.options[select.selectedIndex]?.text;

      console.log('Profesional seleccionado:', { documento, nombre });
      // aquí puedes disparar otra consulta si lo necesitas
    }
  });
}

export function initProfesionales() {
  fetchProfesionales().catch((err) => {
    console.error('Error cargando profesionales:', err);
  });

  initProfesionalesChangeLogging();
}
