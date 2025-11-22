// js/empresas/empresas.js
import { apiHeaders, tryFetch } from '../utils/api.js';

async function fetchEmpresas() {
  const empresasSelect = document.getElementById('EmpresasSelect');
  if (!empresasSelect) return;

  let resp = await tryFetch('api/empresas', {
    headers: apiHeaders(),
    cache: 'no-store',
  });

  if (!resp) {
    resp = await tryFetch('./api/empresas', {
      headers: apiHeaders(),
      cache: 'no-store',
    });
  }

  if (!resp) {
    alert('No se pudo conectar con el servicio de pacientes.');
    return;
  }

  const data = await resp.json();
  console.log('empresas fetched:', data);

  empresasSelect.innerHTML = '';

  // Placeholder
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = 'Seleccione una empresa...';
  placeholder.disabled = true;
  placeholder.selected = true;
  empresasSelect.appendChild(placeholder);

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
      const doc = getField(row, ['documentoEmpresa']);
      const nombre = getField(row, ['razonSocialEmpresa']);
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

  empresasSelect.appendChild(fragment);
}

export function initEmpresas() {
  // Solo carga la lista al inicio (igual que antes pero más ordenado)
  fetchEmpresas().catch((err) => {
    console.error('Error cargando empresas:', err);
  });
}
