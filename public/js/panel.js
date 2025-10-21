
(function ensureAuth() {
    const token = sessionStorage.getItem('token');
    if (!token) { window.location.href = 'index.html'; }
})();

document.getElementById('logoutBtn').addEventListener('click', () => {
    sessionStorage.removeItem('token');
    window.location.href = 'index.html';
});

const infoEl = document.getElementById('infoPaciente');
const fields = {
    nombre: infoEl.querySelector('[data-field="nombre"]'),
    numero: infoEl.querySelector('[data-field="numero"]'),
    celular: infoEl.querySelector('[data-field="celular"]'),
    correo: infoEl.querySelector('[data-field="correo"]')
};

document.getElementById('buscarBtn').addEventListener('click', async () => {
    const doc = (document.getElementById('docInput').value || '').trim();
    if (!doc) { alert('Escribe un documento para buscar.'); return; }

    const token = sessionStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const tryFetch = async (path) => {
        try {
            const r = await fetch(path, { headers, cache: 'no-store' });
            return r.ok ? r : null;
        } catch { return null; }
    };

    let resp = await tryFetch(`api/entidadii/${encodeURIComponent(doc)}`);
    if (!resp) resp = await tryFetch(`./entidadii/${encodeURIComponent(doc)}`);

    if (!resp) { alert('No se pudo conectar con el servicio de pacientes.'); return; }

    const data = await resp.json();
    const entidad = data.entidad || data || {};
    const nombre = entidad.nombreCompletoEntidad || [
        entidad.primerNombreEntidad, entidad.segundoNombreEntidad,
        entidad.primerApellidoEntidad, entidad.segundoApellidoEntidad
    ].filter(Boolean).join(' ').trim();

    const numero = entidad.documentoEntidad || data.documentoEntidad || doc;
    const celular = data.telefonoCelularEntidadII || entidad.telefonoCelularEntidadII || entidad.celular || '—';
    const correo = data.emailEntidadII || entidad.emailEntidadII || entidad.correo || '—';

    const payload = { nombre: nombre || 'Sin nombre', numero, celular, correo };

    Object.entries(payload).forEach(([k, v]) => fields[k].textContent = String(v));
    infoEl.hidden = false;
});

document.getElementById('docInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); document.getElementById('buscarBtn').click(); }
});

async function loadConsentimientos() {
    const listEl = document.getElementById('consList');
    listEl.innerHTML = '<div class="item"><span class="pill">Cargando…</span> Buscando archivos HTML…</div>';

    const candidates = [];

    try {
        let api = await fetch('api/consentimientos', { cache: 'no-store' });
        if (!api.ok) {
            api = await fetch('./consentimientos', { cache: 'no-store' });
        }
        if (api.ok) {
            const arr = await api.json();
            if (Array.isArray(arr)) {
                arr.filter(x => /\.html?$/i.test(x)).forEach(x => candidates.push(x));
            }
        }
    } catch (e) { }

    if (candidates.length === 0) {
        try {
            const r = await fetch('./Consentimientos/manifest.json', { cache: 'no-store' });
            if (r.ok) {
                const data = await r.json();
                if (Array.isArray(data)) {
                    data.filter(x => /\.html?$/i.test(x)).forEach(x => candidates.push(x));
                } else if (Array.isArray(data.files)) {
                    data.files.filter(x => /\.html?$/i.test(x)).forEach(x => candidates.push(x));
                }
            }
        } catch (e) { }
    }

    if (candidates.length === 0) {
        try {
            const r = await fetch('./Consentimientos/', { cache: 'no-store' });
            if (r.ok) {
                const html = await r.text();
                const doc = new DOMParser().parseFromString(html, 'text/html');
                const links = Array.from(doc.querySelectorAll('a'))
                    .map(a => a.getAttribute('href'))
                    .filter(h => h && /\.html?$/i.test(h));
                links.forEach(h => candidates.push(h.replace(/^\/.+?\//, '')));
            }
        } catch (e) { }
    }

    if (candidates.length === 0) {
        candidates.push(
            'consentimiento-procedimiento.html',
            'consentimiento-anestesia.html',
            'consentimiento-cirugia.html'
        );
    }

    if (candidates.length) {
        listEl.innerHTML = '';
        candidates.forEach((file) => {
            const display = file;
            const href = './Consentimientos/' + encodeURIComponent(file).replace(/%2F/g, '/');
            const item = document.createElement('div');
            item.className = 'item';
            item.innerHTML = `
            <div class="pill">HTML</div>
            <div style="font-weight:700;color:#0f172a">${display}</div>
            <div style="margin-left:auto"><a class="btn" href="${href}" target="_blank" rel="noopener">Abrir</a></div>
          `;
            listEl.appendChild(item);
        });
    } else {
        listEl.innerHTML = '<div class="item">No se encontraron archivos HTML en /Consentimientos/</div>';
    }
}

loadConsentimientos();
