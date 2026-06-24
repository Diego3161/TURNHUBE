/* =============================================
   TurnHub - JavaScript principal
   Grupo 14 - Diseño y Desarrollo Web UADE
   ============================================= */

// --- Validación de formularios ---

// Valida que un campo no esté vacío
function validarRequerido(input, errorEl, mensaje) {
  if (input.value.trim() === '') {
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    errorEl.textContent = mensaje;
    errorEl.classList.add('visible');
    return false;
  }
  input.classList.remove('is-invalid');
  input.classList.add('is-valid');
  errorEl.classList.remove('visible');
  return true;
}

// Valida formato de email
function validarEmail(input, errorEl) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(input.value.trim())) {
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    errorEl.textContent = 'Ingresá un mail válido (ej: nombre@mail.com)';
    errorEl.classList.add('visible');
    return false;
  }
  input.classList.remove('is-invalid');
  input.classList.add('is-valid');
  errorEl.classList.remove('visible');
  return true;
}

// Valida contraseña mínimo 8 caracteres
function validarPassword(input, errorEl) {
  if (input.value.length < 8) {
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    errorEl.textContent = 'La contraseña debe tener al menos 8 caracteres';
    errorEl.classList.add('visible');
    return false;
  }
  input.classList.remove('is-invalid');
  input.classList.add('is-valid');
  errorEl.classList.remove('visible');
  return true;
}

// --- Mostrar/ocultar contraseña ---
function togglePassword(inputId, btnId) {
  const input = document.getElementById(inputId);
  const btn = document.getElementById(btnId);
  if (!input || !btn) return;

  btn.addEventListener('click', function () {
    if (input.type === 'password') {
      input.type = 'text';
      btn.textContent = '🙈';
    } else {
      input.type = 'password';
      btn.textContent = '👁';
    }
  });
}

// --- Copiar link al portapapeles ---
function copiarLink(texto, btnId) {
  const btn = document.getElementById(btnId);
  if (!btn) return;

  btn.addEventListener('click', function () {
    navigator.clipboard.writeText(texto).then(() => {
      const textoOriginal = btn.textContent;
      btn.textContent = '✓ ¡Copiado!';
      btn.classList.add('btn-success');
      btn.classList.remove('btn-ghost-th');
      setTimeout(() => {
        btn.textContent = textoOriginal;
        btn.classList.remove('btn-success');
        btn.classList.add('btn-ghost-th');
      }, 2000);
    });
  });
}

// --- Selección de slots de horario ---
function initSlots() {
  const slots = document.querySelectorAll('.slot:not(.ocupado)');
  slots.forEach(function (slot) {
    slot.addEventListener('click', function () {
      // Deseleccionar el anterior
      document.querySelectorAll('.slot.selected').forEach(function (s) {
        s.classList.remove('selected');
      });
      // Marcar este como seleccionado
      slot.classList.add('selected');

      // Guardar en sessionStorage para el siguiente paso
      sessionStorage.setItem('turno_horario', slot.dataset.hora);

      // Habilitar el botón de continuar
      const btnContinuar = document.getElementById('btn-continuar');
      if (btnContinuar) {
        btnContinuar.disabled = false;
        btnContinuar.classList.remove('disabled');
      }
    });
  });
}

// --- Guardar servicio seleccionado ---
function guardarServicio(nombre, duracion, precio) {
  sessionStorage.setItem('turno_servicio', nombre);
  sessionStorage.setItem('turno_duracion', duracion);
  sessionStorage.setItem('turno_precio', precio);
}

// --- Rellenar resumen en paso 2 ---
function rellenarResumen() {
  const servicio = sessionStorage.getItem('turno_servicio') || 'Corte de cabello';
  const horario = sessionStorage.getItem('turno_horario') || '10:00';
  const duracion = sessionStorage.getItem('turno_duracion') || '30 min';
  const precio = sessionStorage.getItem('turno_precio') || '$5.000';

  const elServicio = document.getElementById('resumen-servicio');
  const elHorario = document.getElementById('resumen-horario');
  const elDuracion = document.getElementById('resumen-duracion');
  const elPrecio = document.getElementById('resumen-precio');

  if (elServicio) elServicio.textContent = servicio;
  if (elHorario) elHorario.textContent = 'Jue 19 jun · ' + horario + ' hs';
  if (elDuracion) elDuracion.textContent = duracion;
  if (elPrecio) elPrecio.textContent = precio;
}

// --- Rellenar datos en pantalla de éxito ---
function rellenarExito() {
  const servicio = sessionStorage.getItem('turno_servicio') || 'Corte de cabello';
  const horario = sessionStorage.getItem('turno_horario') || '10:00';
  const nombre = sessionStorage.getItem('cliente_nombre') || 'Cliente';
  const mail = sessionStorage.getItem('cliente_telefono') || 'tu WhatsApp';

  const elServicio = document.getElementById('exito-servicio');
  const elFecha = document.getElementById('exito-fecha');
  const elNombre = document.getElementById('exito-nombre');
  const elMail = document.getElementById('exito-mail');

  if (elServicio) elServicio.textContent = servicio;
  if (elFecha) elFecha.textContent = 'Jueves 19 de junio · ' + horario + ' hs';
  if (elNombre) elNombre.textContent = nombre;
  if (elMail) elMail.textContent = mail;
}

// --- Validación form de reserva paso 2 ---
function initFormReserva() {
  const form = document.getElementById('form-reserva');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre');
    const telefono = document.getElementById('telefono');
    const mail = document.getElementById('mail');
    const errorNombre = document.getElementById('error-nombre');
    const errorTelefono = document.getElementById('error-telefono');
    const errorMail = document.getElementById('error-mail');

    const okNombre = validarRequerido(nombre, errorNombre, 'El nombre es obligatorio');
    const okTelefono = validarRequerido(telefono, errorTelefono, 'El teléfono / WhatsApp es obligatorio');
    const okMail = mail.value.trim() === '' ? true : validarEmail(mail, errorMail);

    if (okNombre && okTelefono && okMail) {
      // Guardar en sessionStorage para la pantalla de éxito
      sessionStorage.setItem('cliente_nombre', nombre.value.trim());
      sessionStorage.setItem('cliente_telefono', telefono.value.trim());
      sessionStorage.setItem('cliente_mail', mail.value.trim());
      // Redirigir a la pantalla de éxito
      window.location.href = 'exito.html';
    }
  });
}

// --- Validación form de login ---
function initFormLogin() {
  const form = document.getElementById('form-login');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const mail = document.getElementById('login-mail');
    const pass = document.getElementById('login-pass');
    const errorMail = document.getElementById('error-login-mail');
    const errorPass = document.getElementById('error-login-pass');

    const okMail = validarEmail(mail, errorMail);
    const okPass = validarPassword(pass, errorPass);

    if (okMail && okPass) {
      // Simulación: cualquier mail/pass válido accede al dashboard
      window.location.href = 'dashboard.html';
    }
  });

  // Validación en tiempo real
  const mail = document.getElementById('login-mail');
  const pass = document.getElementById('login-pass');
  if (mail) {
    mail.addEventListener('blur', function () {
      const errorMail = document.getElementById('error-login-mail');
      if (mail.value.trim() !== '') validarEmail(mail, errorMail);
    });
  }
  if (pass) {
    pass.addEventListener('blur', function () {
      const errorPass = document.getElementById('error-login-pass');
      if (pass.value.trim() !== '') validarPassword(pass, errorPass);
    });
  }
}

// --- Inicialización al cargar la página ---
document.addEventListener('DOMContentLoaded', function () {
  initSlots();
  rellenarResumen();
  rellenarExito();
  initFormReserva();
  initFormLogin();

  // Toggle password en login
  togglePassword('login-pass', 'toggle-pass');

  // Copiar link en dashboard
  copiarLink('https://turnhub.com/reservar/peluqueria-marcela', 'btn-copiar-link');

  // Buscador
  initBuscador();
});


// --- Buscador simple ---
// Muestra error técnico al buscar (sin backend real disponible)
function initBuscador() {
  var input = document.getElementById('buscador');
  var btn = document.getElementById('btn-buscar');
  if (!input) return;

  function irAError() {
    var query = input.value.trim();
    if (query.length > 0) {
      window.location.href = 'secciones/error-busqueda.html';
    }
  }

  if (btn) {
    btn.addEventListener('click', function () {
      irAError();
    });
  }

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      irAError();
    }
  });
}
