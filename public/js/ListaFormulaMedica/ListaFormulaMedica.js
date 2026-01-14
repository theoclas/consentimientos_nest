const input = document.getElementById('medicamento-input');
const list = document.getElementById('medicamento-list');
const labelSeleccionado = document.getElementById('seleccionado');
const btnAgregarMed = document.getElementById('btnAgregarMed');
const btnIngresarACeere = document.getElementById('btnIngresarACeere');
const EmpresasSelect = document.getElementById('EmpresasSelect');
const DocumentoPaciente = document.getElementById("docFormula");



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

if (btnIngresarACeere) {
  btnIngresarACeere.addEventListener('click', () => {
    if (!EmpresasSelect.value) {
      alert('Debes Seleccionar una Empresa');
      return;
    }

    const iframe = document.getElementById("formIframe");

    if (!iframe) {
      console.error("No se encontró el iframe con id=formIframe");
      return;
    }

    console.log("Iframe encontrado:", iframe);
    console.log("Iframe pru 1:", iframe.contentDocument);

    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;


    console.log("Empresa ", EmpresasSelect.value); ;
    console.log("Paciente ", DocumentoPaciente.value );
    
    const cont = iframeDoc.getElementById("ContenidoFormula");

    console.log("Texto:", cont.innerText);

      enviarFormula();



    // Si lo vas a mostrar aquí:
    iframe.style.display = "block";

    // Si quieres detectar carga:
    iframe.addEventListener("load", () => {
      console.log("Iframe cargado correctamente");
    }, { once: true }); // para que no se acumule el listener cada click
  });
}

async function enviarFormula() {
  const iframe = document.getElementById("formIframe");
  if (!iframe) {
    alert("No se encontró el iframe");
    return;
  }

  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
  const cont = iframeDoc.getElementById("ContenidoFormula");

  const documentoEmpresa = EmpresasSelect.value;
  const documentoPaciente = DocumentoPaciente.value;
  const contenido = (cont?.innerText || "").trim(); // o innerHTML si quieres guardar formato

  if (!documentoEmpresa) {
    alert("Debes Seleccionar una Empresa");
    return;
  }
  if (!documentoPaciente) {
    alert("Debes ingresar el documento del paciente");
    return;
  }
  if (!contenido) {
    alert("La fórmula está vacía");
    return;
  }

  const payload = {
    contenido: contenido,
    documentoEmpresa: documentoEmpresa,
    documentoPaciente: documentoPaciente
  };

  try {
    const resp = await fetch("http://localhost:3000/api/formulas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    // Si tu API devuelve JSON:
    const data = await resp.json().catch(() => null);

    if (!resp.ok) {
      console.error("Error API:", data);
      alert(`Error al guardar fórmula (${resp.status})`);
      return;
    }

    console.log("Guardado OK:", data);
    alert("Fórmula guardada correctamente ✅");
  } catch (err) {
    console.error("Error de red:", err);
    alert("No se pudo conectar al servidor");
  }
}



// 🔹 Cuando el usuario haga clic en "Agregar a fórmula"
if (btnAgregarMed) {
  btnAgregarMed.addEventListener('click', () => {
    // if (!medicamentoSeleccionado) {
    //   alert('Primero selecciona un medicamento de la lista.');
    //   return;
    // }

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
