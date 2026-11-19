/* Mapa del prototipo, login (W-01), selector de espacio y vistas de sistema (PAN-UXD-12). */
'use strict';

(function (GA) {
  var esc = GA.esc;

  var PANTALLAS = [
    ['W-01', 'Login, verificación en dos pasos y selección de espacio', 'PAN-UXD-13 · PAN-POR-23', '/login', '/login'],
    ['W-02', 'Layout general del admin y buscador (tablero)', 'AdminShell · PAN-UXD-04', '/admin/inicio', '/admin/inicio'],
    ['W-02', 'Búsqueda de titulares y cuentas', 'PAN-PER-01', '/admin/per/titulares', '/admin/per/titulares'],
    ['—', 'Alta de persona, titular y cuenta (modal)', 'PAN-PER-04 · PAN-PER-05', 'Modal lg desde /admin/per/titulares', '/admin/per/titulares?alta=1'],
    ['W-03', 'Ficha 360 del titular', 'PAN-PER-02', '/admin/per/titulares/:holderId', '/admin/per/titulares/000123'],
    ['W-04', 'Alta de contrato de servicio (asistente)', 'PAN-CAT-15', '/admin/cat/contracts/new', '/admin/cat/contracts/new?cuenta=0002'],
    ['—', 'Catálogo de servicios', 'PAN-CAT-03', '/admin/cat/services', '/admin/cat/services'],
    ['W-10', 'Configuración del servicio Internet', 'PAN-CAT-04', '/admin/cat/services/:id', '/admin/cat/services/INT'],
    ['—', 'Lotes de facturación', 'PAN-FAC-05', '/admin/fac/lotes', '/admin/fac/lotes'],
    ['W-06', 'Revisión previa del lote (aprobación y emisión)', 'PAN-FAC-07', '/admin/fac/lotes/:id', '/admin/fac/lotes/LOT-2026-11-INT'],
    ['W-05', 'Listado de comprobantes', 'PAN-FAC-09', '/admin/fac/comprobantes', '/admin/fac/comprobantes'],
    ['—', 'Apertura de caja', 'PAN-COB-09', '/admin/cob/caja/apertura', '/admin/cob/caja/apertura'],
    ['W-07', 'Cobro en ventanilla', 'PAN-COB-10', '/admin/cob/caja/cobro', '/admin/cob/caja/cobro'],
    ['—', 'Recibos', 'PAN-COB-14', '/admin/cob/recibos', '/admin/cob/recibos'],
    ['W-08', 'Bandeja de reclamos y casos', 'PAN-CRM-02', '/admin/crm/bandeja', '/admin/crm/bandeja'],
    ['W-08', 'Expediente del caso', 'PAN-CRM-03', '/admin/crm/casos/:id', '/admin/crm/casos/2026-000040'],
    ['—', 'Tablero de órdenes de trabajo', 'PAN-TEC-04', '/admin/tec/work-orders', '/admin/tec/work-orders'],
    ['W-09', 'Ficha de orden de trabajo', 'PAN-TEC-05', '/admin/tec/work-orders/:id', '/admin/tec/work-orders/0000002'],
    ['W-11', 'Inicio con saldo (socio)', 'PAN-POR-25', '/app/inicio', '/app/inicio'],
    ['—', 'Mis cuentas y servicios', 'PAN-POR-26', '/app/cuentas', '/app/cuentas'],
    ['—', 'Mis facturas', 'PAN-POR-38', '/app/facturas', '/app/facturas'],
    ['W-12', 'Detalle de factura', 'PAN-POR-39', '/app/facturas/:invoiceId', '/app/facturas'],
    ['W-13', 'Pagar', 'PAN-POR-40', '/app/pagar', '/app/pagar'],
    ['W-13', 'Resultado del pago', 'PAN-POR-41', '/app/pagos/:checkoutId', '/app/pagos'],
    ['—', 'Historial de pagos', 'PAN-POR-42', '/app/pagos', '/app/pagos'],
    ['W-15', 'Vincular cuenta con código', 'PAN-POR-27', '/app/cuentas/vincular', '/app/cuentas/vincular'],
    ['—', 'Mis gestiones', 'PAN-POR-50', '/app/gestiones', '/app/gestiones'],
    ['W-14', 'Nueva gestión o reclamo (modal)', 'PAN-POR-51', '/app/gestiones/nueva', '/app/gestiones/nueva'],
    ['—', 'Seguimiento de la gestión', 'PAN-POR-33', '/app/gestiones/:caseId', '/app/gestiones'],
    ['W-16', 'Mi día: agenda de OT (campo)', 'PAN-TEC-50', '/app/campo/today', '/app/campo/today'],
    ['W-17', 'Ejecución y cierre de OT con evidencias', 'PAN-TEC-51', '/app/campo/work-orders/:id', '/app/campo/today'],
    ['—', 'Cola de sincronización (campo)', 'PAN-TEC-53', '/app/campo/sync', '/app/campo/sync'],
    ['—', 'Sin acceso', 'PAN-UXD-12', '/sin-acceso', '/sin-acceso']
  ];

  /* ---------- Mapa del prototipo (no es una pantalla del producto) ---------- */
  GA.ruta('/', {
    app: 'mapa',
    meta: { titulo: 'Mapa del prototipo', proposito: 'Punto de entrada del prototipo: recorridos guiados y acceso directo a cada pantalla.' },
    render: function () {
      var s = GA.e.sesion;
      var rec = GA.recorridos.map(function (r, i) {
        return '<li class="tarjeta rec"><h3>' + (i + 1) + '. ' + esc(r.titulo) + '</h3><ol class="rec__pasos">' +
          r.pasos.map(function (p) { return '<li>' + esc(p[1]) + '</li>'; }).join('') + '</ol>' +
          '<button type="button" class="btn btn--pri" data-act="iniciarRecorrido" data-id="' + r.id + '">Iniciar recorrido ' + (i + 1) + '</button></li>';
      }).join('');
      var filas = PANTALLAS.map(function (p) {
        return '<tr><td>' + esc(p[0]) + '</td><td><a href="#' + p[4] + '" data-act="entrarA" data-ruta="' + p[4] + '">' + esc(p[1]) + '</a></td><td>' + esc(p[2]) + '</td><td><code>' + esc(p[3]) + '</code></td></tr>';
      }).join('');
      return {
        claseMain: 'mapa',
        html: '<div class="mapa__cont"><header class="mapa__cab"><p class="mapa__sobre">GoodApps Cooperativas · Artefacto 4.3</p><h1 id="h1" tabindex="-1">Prototipo navegable del piloto (Internet, olas O0 a O5)</h1>' +
          '<p>Prototipo estático, sin servidor, construido sobre los 17 wireframes de <code>05-wireframes-pantallas-piloto.md</code>, las rutas canónicas de T03 §10.9 y el portal del socio de M19. Todos los datos son <strong>ficticios</strong>; los cambios se guardan solo en esta pestaña del navegador.</p>' +
          '<p class="mapa__sesion">' + (s ? 'Sesión activa: <strong>' + esc(s.usuario) + '</strong> en el espacio <strong>' + esc(s.espacio === 'admin' ? 'Administración' : s.espacio === 'campo' ? 'Campo' : 'Mi cooperativa (socio)') + '</strong>.' : 'No hay sesión iniciada.') + '</p>' +
          '<div class="acciones"><a class="btn btn--pri" href="#/login">Ir al login</a><button type="button" class="btn" data-act="entrarComo" data-espacio="admin">Entrar como personal</button><button type="button" class="btn" data-act="entrarComo" data-espacio="socio">Entrar como socio</button><button type="button" class="btn" data-act="entrarComo" data-espacio="campo">Entrar como técnico</button>' +
          '<button type="button" class="btn" data-act="tema">Tema ' + (GA.e.tema === 'dark' ? 'claro' : 'oscuro') + '</button></div></header>' +
          '<section aria-labelledby="t-rec"><h2 id="t-rec">Recorridos guiados</h2><p class="hint">Al iniciar un recorrido se restablecen los datos ficticios y se inicia la sesión que corresponda. Una barra inferior indica cada paso.</p><ul class="rec-grilla">' + rec + '</ul></section>' +
          '<section aria-labelledby="t-pan"><h2 id="t-pan">Pantallas incluidas</h2><div class="tabla-cont"><table class="tabla"><caption class="sr-only">Pantallas del prototipo con su wireframe, pantalla de la especificación y ruta canónica</caption><thead><tr><th scope="col">Wireframe</th><th scope="col">Pantalla</th><th scope="col">PAN</th><th scope="col">Ruta canónica</th></tr></thead><tbody>' + filas + '</tbody></table></div>' +
          '<p class="hint">"—" indica una pantalla de la especificación sin wireframe propio en el documento 05; se agregó para completar los recorridos.</p></section></div>'
      };
    }
  });

  GA.acc.entrarComo = function (el) {
    var e = el.getAttribute('data-espacio');
    if (e === 'admin') { GA.sesionAdmin(); GA.guardar(); GA.ir('/admin/inicio'); }
    else if (e === 'socio') { GA.sesionSocio(); GA.guardar(); GA.ir('/app/inicio'); }
    else { GA.sesionCampo(); GA.guardar(); GA.ir('/app/campo/today'); }
  };
  GA.acc.entrarA = function (el, ev) {
    var ruta = el.getAttribute('data-ruta');
    var espacio = ruta.indexOf('/admin') === 0 ? 'admin' : ruta.indexOf('/app/campo') === 0 ? 'campo' : ruta.indexOf('/app') === 0 ? 'socio' : null;
    if (!espacio) return;
    ev.preventDefault();
    if (!GA.e.sesion || GA.e.sesion.espacio !== espacio) {
      if (espacio === 'admin') GA.sesionAdmin(); else if (espacio === 'campo') GA.sesionCampo(); else GA.sesionSocio();
      GA.guardar();
    }
    GA.ir(ruta);
  };

  /* ---------- W-01 Login ---------- */
  function marcoLogin(contenido) {
    return '<div class="login"><div class="login__velo"><div class="login__caja">' +
      '<div class="login__marca"><span class="logo-coop logo-coop--grande" role="img" aria-label="Logo de Cooperativa Ejemplo (marcador)">CE</span><span>Cooperativa Ejemplo</span></div>' +
      contenido +
      '<p class="login__pie"><a href="#" data-act="ayudaLogin">¿Necesitás ayuda?</a> · <a href="#" data-act="noDisponible">Sitio de la cooperativa</a> · <a href="#" data-act="noDisponible">Accesibilidad</a></p>' +
      '</div></div></div>';
  }

  GA.ruta('/login', {
    app: 'acceso',
    meta: { w: 'W-01', pan: 'PAN-UXD-13', ruta: '/login', cap: 'Público', ola: 'O0 (login, 2FA, selector); O1 (SSO y CiDi)', titulo: 'Ingresar', proposito: 'Autenticar al usuario con la marca del tenant.', roles: 'Todo el personal, socios y técnicos de campo' },
    render: function () {
      var u = GA.ui.login || { usuario: '', errores: [] };
      var errU = u.errores.filter(function (e) { return e[0] === 'login-usuario'; })[0];
      var errC = u.errores.filter(function (e) { return e[0] === 'login-clave'; })[0];
      return {
        claseMain: 'acceso',
        html: marcoLogin('<h1 id="h1" tabindex="-1">Ingresar</h1>' +
          (u.general ? '<div class="banda banda--bad" role="alert">' + GA.ico('bad') + esc(u.general) + '</div>' : '') +
          GA.resumenErrores(u.errores) +
          '<form data-form="login" novalidate>' +
          GA.campo({ id: 'login-usuario', label: 'Email, DNI o CUIT', value: u.usuario, hint: 'DNI sin puntos', req: true, auto: 'username', err: errU && errU[1], attrs: 'autofocus' }) +
          '<div class="campo' + (errC ? ' campo--error' : '') + '"><label for="login-clave">Contraseña <span class="req">(obligatorio)</span></label><div class="campo__grupo">' +
          '<input id="login-clave" name="login-clave" type="password" autocomplete="current-password" required' + (errC ? ' aria-invalid="true" aria-describedby="login-clave-err"' : '') + '>' +
          '<button type="button" class="btn" data-act="mostrarClave" aria-pressed="false" aria-controls="login-clave">Mostrar</button></div>' +
          (errC ? '<p class="err" id="login-clave-err">' + GA.ico('bad') + esc(errC[1]) + '</p>' : '') + '</div>' +
          '<div class="fila-entre"><label class="check"><input type="checkbox" name="recordarme" checked> Recordarme</label><a href="#" data-act="olvide">¿Olvidaste tu contraseña?</a></div>' +
          '<button type="submit" class="btn btn--pri btn--block">Ingresar</button></form>' +
          '<p class="separador"><span>o</span></p>' +
          '<div class="fila-2"><button type="button" class="btn" data-act="noDisponible">Ingresar con Google</button><button type="button" class="btn" data-act="noDisponible">Ingresar con CiDi</button></div>' +
          '<p class="hint login__demo">Prototipo: cualquier usuario y contraseña son válidos. Para ver el error genérico de credenciales, usá la contraseña "error".</p>')
      };
    }
  });

  GA.acc.mostrarClave = function (el) {
    var c = document.getElementById('login-clave');
    var ver = c.type === 'password';
    c.type = ver ? 'text' : 'password';
    el.textContent = ver ? 'Ocultar' : 'Mostrar';
    el.setAttribute('aria-pressed', String(ver));
  };
  GA.acc.noDisponible = function () { GA.toast('Opción simulada: no está disponible en el prototipo.', 'info'); };
  GA.acc.olvide = function () {
    GA.modal({
      titulo: 'Recuperar acceso', tam: 'sm',
      cuerpo: '<form data-form="olvide" novalidate>' + GA.campo({ id: 'olv-usuario', label: 'Email, DNI o CUIT', req: true, auto: 'username', attrs: 'autofocus' }) + '</form>',
      pie: '<button type="button" class="btn" data-act="cerrarModal">Cancelar</button><button type="button" class="btn btn--pri" data-act="enviarOlvide">Enviar instrucciones</button>'
    });
  };
  GA.acc.enviarOlvide = function () {
    GA.cerrarModal();
    GA.toast('Si los datos corresponden a un usuario, te enviamos las instrucciones.', 'info');
  };
  GA.acc.ayudaLogin = function () {
    GA.modal({ titulo: 'Ayuda para ingresar', tam: 'sm', cuerpo: '<p>Comunicate con la cooperativa (datos ficticios): 0000 00-0000, de lunes a viernes de 8 a 16.</p>', pie: '<button type="button" class="btn btn--pri" data-act="cerrarModal">Cerrar</button>' });
  };

  GA.form.login = function (f) {
    var usuario = f.querySelector('#login-usuario').value.trim();
    var clave = f.querySelector('#login-clave').value;
    var errores = [];
    if (!usuario) errores.push(['login-usuario', 'Ingresá tu email, DNI o CUIT.']);
    else if (/^\d{1,3}(\.\d{3})+$/.test(usuario)) errores.push(['login-usuario', 'Escribí el DNI sin puntos.']);
    if (!clave) errores.push(['login-clave', 'Ingresá tu contraseña.']);
    GA.ui.login = { usuario: usuario, errores: errores };
    if (errores.length) { GA.render(true); var r = document.getElementById('resumen-errores'); if (r) r.focus(); return; }
    if (clave === 'error') {
      GA.ui.login.general = 'No pudimos validar tus datos. Revisalos e intentá de nuevo.';
      GA.render(true);
      return;
    }
    GA.ui2fa = { usuario: usuario };
    GA.ir('/login/2fa');
  };

  /* ---------- W-01 Paso 2: verificación en dos pasos ---------- */
  var timer2fa = null;
  GA.ruta('/login/2fa', {
    app: 'acceso',
    meta: { w: 'W-01', pan: 'PAN-UXD-13', ruta: '/login (subruta de verificación)', cap: 'Público', ola: 'O0', titulo: 'Verificación en dos pasos', proposito: 'Segundo factor obligatorio para el personal.', roles: 'Personal de la cooperativa' },
    render: function () {
      if (!GA.ui2fa) return { html: marcoLogin('<h1 id="h1" tabindex="-1">La sesión de ingreso expiró</h1><p><a class="btn btn--pri" href="#/login">Volver a ingresar</a></p>') };
      var err = GA.ui.err2fa;
      return {
        html: marcoLogin('<h1 id="h1" tabindex="-1">Verificación en dos pasos</h1><p>Ingresá el código que enviamos a ****0000.</p>' +
          '<form data-form="dosPasos" novalidate>' +
          GA.campo({ id: 'otp', label: 'Código de 6 dígitos', auto: 'one-time-code', req: true, err: err, clase: 'campo--otp', attrs: 'inputmode="numeric" maxlength="6" pattern="[0-9]{6}" autofocus' }) +
          '<label class="check"><input type="checkbox" name="recordar"> No volver a pedir en este dispositivo por 30 días</label>' +
          '<p><button type="button" class="btn-link" data-act="reenviar2fa" id="reenviar" disabled>Reenviar código (disponible en <span id="cuenta">60</span> s)</button></p>' +
          '<div class="fila-entre"><a class="btn" href="#/login">Volver</a><button type="submit" class="btn btn--pri">Verificar</button></div></form>'),
        despues: function () {
          clearInterval(timer2fa);
          var n = 60;
          timer2fa = setInterval(function () {
            var c = document.getElementById('cuenta');
            var b = document.getElementById('reenviar');
            if (!c || !b) { clearInterval(timer2fa); return; }
            n--;
            if (n <= 0) { clearInterval(timer2fa); b.disabled = false; b.textContent = 'Reenviar código'; }
            else c.textContent = n;
          }, 1000);
        }
      };
    }
  });
  GA.acc.reenviar2fa = function () { GA.toast('Te enviamos un nuevo código.', 'info'); GA.render(); };
  GA.form.dosPasos = function (f) {
    var v = f.querySelector('#otp').value.trim();
    if (!/^\d{6}$/.test(v)) { GA.ui.err2fa = 'El código tiene 6 números.'; GA.render(true); document.getElementById('otp').focus(); return; }
    GA.ui3 = { usuario: GA.ui2fa.usuario };
    GA.ir('/login/espacio');
  };

  /* ---------- W-01 Paso 3 / PAN-POR-23: selección de cooperativa y espacio ---------- */
  GA.ruta('/login/espacio', {
    app: 'acceso',
    meta: { w: 'W-01', pan: 'PAN-UXD-13 · PAN-POR-23', ruta: 'A definir en el admin (AD-01); /app en la PWA', cap: 'Sesión autenticada', ola: 'O0', titulo: 'Elegir cooperativa y espacio', proposito: 'Elegir la cooperativa y el espacio (personal, socio o campo) cuando el usuario tiene más de uno.', roles: 'Usuarios con varios espacios' },
    render: function () {
      var actual = GA.e.sesion ? (GA.e.sesion.tenant === 'dos' ? 'dos-admin' : 'ejemplo-' + GA.e.sesion.espacio) : 'ejemplo-admin';
      var ops = [
        ['ejemplo-admin', 'Cooperativa Ejemplo · Administración · Sucursal Centro'],
        ['ejemplo-socio', 'Cooperativa Ejemplo · Mi cooperativa (como socio)'],
        ['ejemplo-campo', 'Cooperativa Ejemplo · Campo (técnico, Cuadrilla Ejemplo 1)'],
        ['dos-admin', 'Cooperativa Ejemplo Dos · Administración']
      ];
      return {
        html: marcoLogin('<form data-form="espacio"><fieldset class="radios"><legend><h1 id="h1" tabindex="-1">¿Dónde querés ingresar?</h1></legend>' +
          ops.map(function (o) { return '<label class="radio-tarjeta"><input type="radio" name="espacio" value="' + o[0] + '"' + (o[0] === actual ? ' checked' : '') + '> <span>' + esc(o[1]) + '</span></label>'; }).join('') +
          '</fieldset><div class="fila-entre"><a class="btn" href="#/login">Volver</a><button type="submit" class="btn btn--pri">Continuar</button></div></form>')
      };
    }
  });
  GA.form.espacio = function (f) {
    var v = (f.querySelector('input[name="espacio"]:checked') || {}).value || 'ejemplo-admin';
    var destino = GA.destino || '';
    GA.destino = null;
    if (v === 'ejemplo-socio') { GA.sesionSocio(); GA.guardar(); GA.ir(destino.indexOf('/app/') === 0 && destino.indexOf('/app/campo') !== 0 ? destino : '/app/inicio'); return; }
    if (v === 'ejemplo-campo') { GA.sesionCampo(); GA.guardar(); GA.ir(destino.indexOf('/app/campo') === 0 ? destino : '/app/campo/today'); return; }
    GA.sesionAdmin();
    if (v === 'dos-admin') GA.e.sesion.tenant = 'dos';
    GA.guardar();
    GA.ir(v !== 'dos-admin' && destino.indexOf('/admin/') === 0 ? destino : '/admin/inicio');
  };

  /* ---------- PAN-UXD-12 Sin acceso y ruta inexistente ---------- */
  GA.ruta('/sin-acceso', {
    app: 'acceso',
    meta: { pan: 'PAN-UXD-12', ruta: '/sin-acceso', cap: '—', ola: 'O0', titulo: 'Sin acceso', proposito: 'Informar que el espacio actual no tiene permiso para la pantalla pedida.' },
    render: function () {
      return {
        html: marcoLogin('<h1 id="h1" tabindex="-1">No tenés acceso a esta pantalla</h1><p>Tu espacio actual no tiene el permiso necesario. Si creés que es un error, pedíselo al administrador de la cooperativa.</p>' +
          '<div class="fila-entre"><a class="btn" href="#/">Mapa del prototipo</a><a class="btn btn--pri" href="#/login/espacio">Cambiar de espacio</a></div>')
      };
    }
  });
  GA.ruta('/no-encontrada', {
    app: 'acceso',
    meta: { titulo: 'Página no encontrada' },
    render: function () {
      return { html: marcoLogin('<h1 id="h1" tabindex="-1">No encontramos esta página</h1><p>La dirección no corresponde a ninguna pantalla del prototipo.</p><p><a class="btn btn--pri" href="#/">Ir al mapa del prototipo</a></p>') };
    }
  });
})(window.GA);
