const input = document.getElementById('medicamento-input');
const list = document.getElementById('medicamento-list');
const labelSeleccionado = document.getElementById('seleccionado');
const btnAgregarMed = document.getElementById('btnAgregarMed');

let timer = null;
// 🔹 aquí guardamos el último medicamento seleccionado
let medicamentoSeleccionado = null;

input.addEventListener('input', () => {
  const texto = input.value.trim();

  if (texto.length < 2) {
    limpiarLista();
    return;
  }

  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    buscarMedicamentos(texto);
  }, 300);
});

async function buscarMedicamentos(texto) {
  try {
    const res = await fetch(
      `http://localhost:3000/api/medicamentos/buscar?descripcionObjeto=${encodeURIComponent(
        texto,
      )}`,
    );

    const data = await res.json();
    console.log('RESPUESTA DEL BACKEND:', data);

    const medicamentos = Array.isArray(data) ? data : (data ? [data] : []);

    pintarLista(medicamentos);
  } catch (err) {
    console.error('ERROR AL BUSCAR:', err);
    limpiarLista();
  }
}

function limpiarLista() {
  list.innerHTML = '';
  list.style.display = 'none';
}

function pintarLista(medicamentos) {
  list.innerHTML = '';

  if (!medicamentos.length) {
    list.style.display = 'none';
    return;
  }

  medicamentos.forEach((med) => {
    const li = document.createElement('li');
    li.className = 'autocomplete-item';
    li.textContent = med.descripcionObjeto;
    li.addEventListener('click', () => onSelect(med));
    list.appendChild(li);
  });

  list.style.display = 'block';
}

function onSelect(med) {
  // 1. Guardamos el seleccionado
  medicamentoSeleccionado = med;

  // 2. Cerrar la lista y dejar el nombre en el input
  input.value = med.descripcionObjeto;
  list.style.display = 'none';
  list.innerHTML = '';

  // 3. Mostrar info del seleccionado
  labelSeleccionado.textContent = `Seleccionado: ${med.descripcionObjeto} (código: ${med.codigoObjeto})`;
}

// 🔹 Cuando el usuario haga clic en "Agregar a fórmula"
if (btnAgregarMed) {
  btnAgregarMed.addEventListener('click', () => {
    if (!medicamentoSeleccionado) {
      alert('Primero selecciona un medicamento de la lista.');
      return;
    }

    // Línea que quieres agregar
    const linea = `• ${medicamentoSeleccionado.descripcionObjeto}`;

    // Buscar el iframe donde está la fórmula
    const iframe = document.getElementById('formIframe');
    if (!iframe) {
      console.error('No se encontró el iframe con id formIframe');
      return;
    }

    // Enviar al iframe por postMessage
    iframe.contentWindow.postMessage(
      {
        tipo: 'agregarMedicamento',
        linea: linea
      },
      '*' // puedes cambiar "*" por el origen exacto si quieres más seguridad
    );
  });
}
