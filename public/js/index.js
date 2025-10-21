// index.js
document.addEventListener('DOMContentLoaded', () => {
  // Si ya hay sesión, ir directo al panel
  if (sessionStorage.getItem('token')) {
    window.location.href = 'panel.html';   // ← ruta RELATIVA
    return;
  }

  // Mostrar/ocultar contraseña
  function togglePw() {
    const input = document.getElementById('password');
    const btn = document.querySelector('.pw-toggle');
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
    btn.textContent = type === 'password' ? 'Ver' : 'Ocultar';
  }
  const toggleBtn = document.querySelector('.pw-toggle');
  if (toggleBtn) toggleBtn.addEventListener('click', togglePw);

  // Manejo del formulario de login
  const form = document.querySelector('form');  // o document.getElementById('loginForm')
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nombreDeUsuario = document.getElementById('usuario').value.trim();
    const contrasena = document.getElementById('password').value.trim();

    const button = form.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = 'Ingresando...';

    try {
      // Usa ruta RELATIVA (sin / inicial) para que funcione en carpeta local o subcarpeta de servidor
      const response = await fetch('api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombreDeUsuario, contrasena }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        const message = err.message || 'Credenciales inválidas.';
        alert(message);
        return;
      }

      const data = await response.json();
      if (data.access_token) {
        sessionStorage.setItem('token', data.access_token);
      } else {
        // Por si tu backend usa otro nombre
        sessionStorage.setItem('token', data.token || 'ok');
      }

      window.location.href = 'panel.html';   // ← ruta RELATIVA
    } catch (error) {
      console.error('Error en login:', error);
      alert('Ocurrió un error al iniciar sesión.');
    } finally {
      button.disabled = false;
      button.textContent = originalText;
    }
  });
});
