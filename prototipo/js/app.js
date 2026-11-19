/* Núcleo del prototipo: rutas por hash, shells (AdminShell / AppShell), barra de prototipo y recorridos. */
'use strict';

(function (GA) {
  var esc = GA.esc;
  var RUTAS = [];
  GA.ui = {};
  var rutaPrevia = null;

  GA.ruta = function (patron, def) {
    def.patron = patron;
    def.partes = patron.split('/').filter(Boolean);
    RUTAS.push(def);
  };

  function parseHash() {
    var h = location.hash || '#/';
    if (h.indexOf('#/') !== 0) h = '#/';
    var crudo = h.slice(1);
    var i = crudo.indexOf('?');
    var path = i >= 0 ? crudo.slice(0, i) : crudo;
    var query = {};
    if (i >= 0) {
      crudo.slice(i + 1).split('&').forEach(function (par) {
        if (!par) return;
        var kv = par.split('=');
        query[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || '');
      });
    }
    return { path: path || '/', query: query };
  }
  GA.parseHash = parseHash;

  function buscarRuta(path) {
    var partes = path.split('/').filter(Boolean);
    for (var r = 0; r < RUTAS.length; r++) {
      var def = RUTAS[r];
      if (def.partes.length !== partes.length) continue;
      var params = {};
      var ok = true;
      for (var i = 0; i < partes.length; i++) {
        var p = def.partes[i];
        if (p.charAt(0) === ':') params[p.slice(1)] = decodeURIComponent(partes[i]);
        else if (p !== partes[i]) { ok = false; break; }
      }
      if (ok) return { def: def, params: params };
    }
    return null;
  }

  GA.ir = function (ruta) {
    var destino = '#' + ruta;
    if (location.hash === destino) GA.render();
    else location.hash = destino;
  };

  GA.mutar = function () { GA.guardar(); GA.render(true); };

  /* ---------- Render principal ---------- */
  GA.render = function (mismaVista) {
    var loc = parseHash();
    var hallado = buscarRuta(loc.path);
    var claveRuta = loc.path;
    if (claveRuta !== rutaPrevia) { GA.ui = {}; mismaVista = false; }
    rutaPrevia = claveRuta;

    document.documentElement.setAttribute('data-theme', GA.e.tema || 'dark');
    var focoId = mismaVista && document.activeElement ? document.activeElement.id : null;

    if (!hallado) hallado = buscarRuta('/no-encontrada');
    var def = hallado.def;
    var s = GA.e.sesion;

    if (def.app === 'admin' || def.app === 'socio' || def.app === 'campo') {
      if (!s) { GA.destino = loc.path; return GA.ir('/login'); }
      if (s.espacio !== def.app) { hallado = buscarRuta('/sin-acceso'); def = hallado.def; }
    }

    sincronizarRecorrido(loc);

    var vista = def.render(hallado.params, loc.query) || {};
    var meta = vista.meta || def.meta || {};
    GA.metaActual = meta;
    var contenido;
    if (def.app === 'admin') contenido = shellAdmin(def, vista);
    else if (def.app === 'socio') contenido = shellSocio(def, vista);
    else if (def.app === 'campo') contenido = shellCampo(def, vista);
    else contenido = '<main id="contenido" class="' + (vista.claseMain || 'acceso') + '" tabindex="-1">' + vista.html + '</main>';

    document.body.setAttribute('data-app', def.app === 'socio' || def.app === 'campo' ? 'pwa' : def.app);
    var app = document.getElementById('app');
    app.innerHTML = barraPrototipo(meta) + contenido + barraRecorrido();
    document.title = (meta.titulo || 'Prototipo') + ' · Prototipo GoodApps Cooperativas';

    if (vista.despues) vista.despues();
    var foco = focoId && document.getElementById(focoId);
    if (foco) foco.focus();
    else if (!mismaVista) {
      var h1 = document.getElementById('h1');
      if (h1) h1.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    }
  };

  /* ---------- Barra fija "Prototipo - datos ficticios" ---------- */
  function barraPrototipo(meta) {
    var ref = [meta.w, meta.pan].filter(Boolean).join(' · ');
    return '<div class="proto" role="region" aria-label="Información del prototipo">' +
      '<span class="proto__etq">Prototipo - datos ficticios</span>' +
      '<span class="proto__ref" title="' + esc(meta.ruta || '') + '">' + esc(ref || 'Sin pantalla del producto') +
      (meta.ruta ? ' <span class="proto__ruta">· <code>' + esc(meta.ruta) + '</code></span>' : '') + '</span>' +
      '<span class="proto__acc">' +
      '<a href="#/" class="proto__btn">Mapa del prototipo</a>' +
      '<button type="button" class="proto__btn" data-act="verFicha">Ficha</button>' +
      '<button type="button" class="proto__btn" data-act="reiniciarDatos">Reiniciar datos</button></span></div>';
  }

  GA.acc.verFicha = function () {
    var m = GA.metaActual || {};
    var filas = [['Wireframe', m.w], ['Pantalla (PAN)', m.pan], ['Ruta canónica', m.ruta], ['Capability', m.cap], ['Ola', m.ola], ['Propósito', m.proposito], ['Roles típicos', m.roles]];
    GA.modal({
      titulo: 'Ficha de la pantalla', tam: 'md',
      cuerpo: '<dl class="dl">' + filas.map(function (f) { return '<dt>' + f[0] + '</dt><dd>' + (f[1] ? esc(f[1]) : 'No aplica') + '</dd>'; }).join('') + '</dl>' +
        '<p class="hint">Referencias tomadas de 05-wireframes-pantallas-piloto.md y de T03 §10.9. Ante diferencias prevalece la especificación.</p>',
      pie: '<button type="button" class="btn btn--pri" data-act="cerrarModal">Cerrar</button>'
    });
  };

  GA.acc.reiniciarDatos = function () {
    GA.modal({
      titulo: 'Reiniciar datos ficticios', tam: 'sm',
      cuerpo: '<p>Se descartan todos los cambios hechos en el prototipo (altas, cobros, pagos, reclamos) y se vuelve al escenario inicial. La sesión se mantiene.</p>',
      pie: '<button type="button" class="btn" data-act="cerrarModal">Cancelar</button><button type="button" class="btn btn--pri" data-act="confirmarReinicio">Reiniciar</button>'
    });
  };
  GA.acc.confirmarReinicio = function () {
    GA.cerrarModal();
    GA.reiniciar(true);
    GA.toast('Datos ficticios restablecidos.');
    GA.render();
  };

  /* ---------- AdminShell (W-02) ---------- */
  var MENU_ADMIN = [
    ['Inicio', [['tablero', 'Tablero', '/admin/inicio']]],
    ['Socios y cuentas', [['titulares', 'Titulares', '/admin/per/titulares']]],
    ['Servicios', [['servicios', 'Catálogo de servicios', '/admin/cat/services']]],
    ['Facturación', [['lotes', 'Lotes de facturación', '/admin/fac/lotes'], ['comprobantes', 'Comprobantes emitidos', '/admin/fac/comprobantes']]],
    ['Cobranza', [['apertura', 'Apertura y cierre de caja', '/admin/cob/caja/apertura'], ['cobro', 'Cobranza en caja', '/admin/cob/caja/cobro'], ['recibos', 'Recibos', '/admin/cob/recibos']]],
    ['Atención', [['bandeja', 'Bandeja de atención', '/admin/crm/bandeja']]],
    ['Técnica', [['ots', 'Órdenes de trabajo', '/admin/tec/work-orders']]]
  ];
  GA.MENU_ADMIN = MENU_ADMIN;

  function shellAdmin(def, vista) {
    var s = GA.e.sesion;
    var abiertos = GA.e.casos.filter(function (c) { return c.estado !== 'resuelto'; }).length;
    var tenant = s.tenant === 'dos' ? 'Cooperativa Ejemplo Dos' : 'Cooperativa Ejemplo';
    var menu = MENU_ADMIN.map(function (cl) {
      var activo = cl[1].some(function (it) { return it[0] === def.nav; });
      return '<details class="menu__cl"' + (activo || cl[0] === 'Inicio' ? ' open' : '') + '><summary>' + esc(cl[0]) +
        (cl[0] === 'Atención' && s.tenant !== 'dos' ? ' <span class="contador" aria-label="' + abiertos + ' casos abiertos">' + abiertos + '</span>' : '') + '</summary><ul>' +
        cl[1].map(function (it) {
          return '<li><a href="#' + it[2] + '"' + (it[0] === def.nav ? ' aria-current="page"' : '') + '>' + esc(it[1]) + '</a></li>';
        }).join('') + '</ul></details>';
    }).join('');
    var colapsado = GA.ui.menuAbierto ? '' : ' adm--menu-cerrado-movil';
    var cuerpo = s.tenant === 'dos' && def.nav !== 'tablero'
      ? GA.cabecera({ migas: ['Inicio'], titulo: vista.meta ? vista.meta.titulo : 'Sin datos' }) + '<div class="pag">' + GA.vacio('Esta cooperativa no tiene datos en el prototipo', 'Cada cooperativa ve solo sus propios datos (aislamiento por tenant). Cambiá de espacio para volver a Cooperativa Ejemplo.', '<button type="button" class="btn btn--pri" data-act="cambiarEspacio">Cambiar de espacio</button>') + '</div>'
      : vista.html;
    return '<div class="adm' + colapsado + '">' +
      '<header class="adm-top">' +
      '<button type="button" class="btn-ico adm-top__menu" data-act="menuAdmin" aria-expanded="' + (!!GA.ui.menuAbierto) + '" aria-controls="adm-menu" aria-label="Mostrar u ocultar el menú">' + GA.ico('menu') + '</button>' +
      '<a class="logo-prod" href="#/admin/inicio" aria-label="GoodApps, ir al inicio">GoodApps</a>' +
      '<span class="adm-top__sep" aria-hidden="true"></span>' +
      '<span class="logo-coop" role="img" aria-label="Logo de ' + esc(tenant) + ' (marcador)">' + (s.tenant === 'dos' ? 'C2' : 'CE') + '</span>' +
      '<button type="button" class="ctx" data-act="cambiarEspacio" aria-label="Contexto: ' + esc(tenant) + ', ' + esc(s.sucursal) + '. Cambiar de espacio">' + esc(tenant) + ' · ' + esc(s.sucursal) + ' ▾</button>' +
      '<button type="button" class="buscador" data-act="buscar" aria-keyshortcuts="Control+K">' + GA.ico('buscar') + '<span>Buscar pantallas, titulares, comprobantes, OT</span><kbd>Ctrl+K</kbd></button>' +
      '<button type="button" class="btn btn--sec adm-top__mapa" data-act="mapaSitio">Mapa del sitio</button>' +
      '<nav class="fijados" aria-label="Accesos fijados"><a href="#/admin/cob/caja/cobro">Cobranza en caja</a><a href="#/admin/fac/comprobantes">Comprobantes</a><a href="#/admin/crm/bandeja">Bandeja</a></nav>' +
      '<button type="button" class="btn-ico" data-act="alertas" aria-label="Alertas: 1">' + GA.ico('campana') + '<span class="punto" aria-hidden="true">1</span></button>' +
      '<button type="button" class="btn-ico" data-act="ayuda" aria-label="Ayuda de esta pantalla">' + GA.ico('ayuda') + '</button>' +
      menuUsuario('UD', s.usuario) +
      '</header>' +
      '<nav id="adm-menu" class="adm-menu" aria-label="Menú principal">' + menu + '</nav>' +
      '<main id="contenido" class="adm-main" tabindex="-1">' +
      '<p class="aviso-chico banda banda--info">' + GA.ico('info') + 'En pantallas chicas se recomienda la app de empleado (a validar en PA-UXD-13). El prototipo igual se adapta.</p>' +
      cuerpo + '</main></div>';
  }

  function menuUsuario(iniciales, nombre) {
    var abierto = !!GA.ui.menuUsuario;
    return '<div class="menu-usu"><button type="button" class="avatar" id="btn-usuario" data-act="menuUsuario" aria-haspopup="true" aria-expanded="' + abierto + '" aria-controls="pop-usuario" aria-label="Menú de ' + esc(nombre) + '">' + esc(iniciales) + '</button>' +
      '<div class="pop" id="pop-usuario"' + (abierto ? '' : ' hidden') + '><p class="pop__nombre">' + esc(nombre) + '</p>' +
      '<button type="button" data-act="cambiarEspacio">Cambiar de espacio</button>' +
      '<button type="button" data-act="tema">Tema ' + (GA.e.tema === 'dark' ? 'claro' : 'oscuro') + '</button>' +
      '<button type="button" data-act="salir">Cerrar sesión</button></div></div>';
  }

  GA.cabecera = function (o) {
    var migas = (o.migas || []).map(function (m) {
      return Array.isArray(m) ? '<li><a href="#' + m[1] + '">' + esc(m[0]) + '</a></li>' : '<li>' + esc(m) + '</li>';
    }).join('');
    return '<div class="cab-pag"><nav class="migas" aria-label="Ruta de navegación"><ol>' + migas + '</ol></nav>' +
      '<div class="cab-pag__fila"><div class="cab-pag__tit"><h1 id="h1" tabindex="-1">' + esc(o.titulo) + '</h1>' + (o.extra || '') +
      (o.subtitulo ? '<p class="sub">' + o.subtitulo + '</p>' : '') + '</div>' +
      (o.acciones ? '<div class="acciones">' + o.acciones + '</div>' : '') + '</div></div>';
  };

  GA.acc.menuAdmin = function () { GA.ui.menuAbierto = !GA.ui.menuAbierto; GA.render(true); };
  GA.acc.menuUsuario = function () { GA.ui.menuUsuario = !GA.ui.menuUsuario; GA.render(true); };
  GA.acc.tema = function () { GA.e.tema = GA.e.tema === 'dark' ? 'light' : 'dark'; GA.ui.menuUsuario = false; GA.mutar(); };
  GA.acc.salir = function () { GA.e.sesion = null; GA.e.recorrido = null; GA.guardar(); GA.ir('/login'); };
  GA.acc.cambiarEspacio = function () { GA.ui.menuUsuario = false; GA.cerrarModal(); GA.ir('/login/espacio'); };
  GA.acc.alertas = function () {
    GA.modal({
      titulo: 'Centro de alertas', tam: 'md',
      cuerpo: '<ul class="lista"><li>' + GA.badgeTono('bad', 'Vencido') + ' Caso 2026-000040 superó el SLA de atención. <a href="#/admin/crm/casos/2026-000040" data-act="cerrarModal">Abrir caso</a></li></ul>' +
        '<p class="hint">Las alertas críticas se muestran como banda persistente y contador; nunca como modal bloqueante (CTR-UXD-14).</p>',
      pie: '<button type="button" class="btn btn--pri" data-act="cerrarModal">Cerrar</button>'
    });
  };

  /* ScreenHelp (T03 §10.1.3), con los datos de la ficha de la pantalla */
  GA.acc.ayuda = function () {
    var m = GA.metaActual || {};
    GA.modal({
      titulo: '¿Qué es esta pantalla?', tam: 'md',
      cuerpo: '<dl class="dl"><dt>Qué</dt><dd>' + esc(m.proposito || m.titulo) + '</dd><dt>Quién</dt><dd>' + esc(m.roles || 'Usuarios con el permiso de la pantalla') + '</dd>' +
        '<dt>Permiso</dt><dd><code>' + esc(m.cap || '—') + '</code></dd><dt>Desde qué ola</dt><dd>' + esc(m.ola || '—') + '</dd><dt>Referencia</dt><dd>' + esc([m.w, m.pan].filter(Boolean).join(' · ')) + '</dd></dl>' +
        '<p class="hint">En el producto, los textos de ayuda salen del diccionario y se configuran por cooperativa.</p>',
      pie: '<button type="button" class="btn btn--pri" data-act="cerrarModal">Entendido</button>'
    });
  };

  /* Buscador global (RF-UXD-057) */
  GA.acc.buscar = function () {
    if (!GA.e.sesion || GA.e.sesion.espacio !== 'admin') return;
    GA.modal({
      titulo: 'Buscar', tam: 'lg',
      cuerpo: '<div class="campo"><label for="busq-global">Pantallas, titulares (nombre, DNI, CUIT o cuenta), comprobantes u OT</label><input id="busq-global" type="search" autocomplete="off" data-inp="busqueda" autofocus></div><div id="busq-res" aria-live="polite">' + resultadosBusqueda('') + '</div>'
    });
  };
  GA.inp.busqueda = function (el) { document.getElementById('busq-res').innerHTML = resultadosBusqueda(el.value); };
  function resultadosBusqueda(texto) {
    var t = texto.trim().toLowerCase();
    if (!t) return '<p class="hint">Escribí al menos un carácter. Ejemplos: "ejemplo", "00000000", "0001", "lote".</p>';
    var grupos = [];
    var pant = [];
    MENU_ADMIN.forEach(function (cl) { cl[1].forEach(function (it) { if ((cl[0] + ' ' + it[1]).toLowerCase().indexOf(t) >= 0) pant.push(['#' + it[2], cl[0] + ' / ' + it[1]]); }); });
    if (pant.length) grupos.push(['Pantallas', pant]);
    var tit = GA.e.titulares.filter(function (ti) {
      var p = GA.q.persona(ti.personaId);
      var cuentas = GA.q.cuentasDe(ti.id).map(function (c) { return c.id; }).join(' ');
      return (GA.q.nombre(p) + ' ' + p.dni + ' ' + p.cuit + ' ' + ti.id + ' ' + cuentas).toLowerCase().indexOf(t) >= 0;
    }).map(function (ti) { var p = GA.q.persona(ti.personaId); return ['#/admin/per/titulares/' + ti.id, GA.q.nombre(p) + ' · Titular ' + ti.id + ' · CUIT ' + p.cuit]; });
    if (tit.length) grupos.push(['Titulares', tit]);
    var fc = GA.e.comprobantes.filter(function (c) { return (c.numero + ' ' + GA.q.nombreCuenta(c.cuentaId)).toLowerCase().indexOf(t) >= 0; })
      .map(function (c) { return ['#/admin/fac/comprobantes?id=' + c.id, c.tipo + ' ' + c.letra + ' ' + c.numero + ' · ' + GA.q.nombreCuenta(c.cuentaId) + ' · ' + GA.ars(c.total)]; });
    if (fc.length) grupos.push(['Comprobantes', fc]);
    var ots = GA.e.ots.filter(function (o) { return ('ot ' + o.id + ' ' + o.operacion).toLowerCase().indexOf(t) >= 0; })
      .map(function (o) { return ['#/admin/tec/work-orders/' + o.id, 'OT ' + o.id + ' · ' + o.operacion + ' · ' + GA.etiquetaEstado('ot', o.estado)]; });
    if (ots.length) grupos.push(['Órdenes de trabajo', ots]);
    if (!grupos.length) return '<p>No encontramos coincidencias. Probá buscar por documento o número de cuenta.</p>';
    return grupos.map(function (g) {
      return '<h3 class="busq__grupo">' + esc(g[0]) + '</h3><ul class="busq__lista">' + g[1].map(function (r) { return '<li><a href="' + r[0] + '" data-act="cerrarModal">' + esc(r[1]) + '</a></li>'; }).join('') + '</ul>';
    }).join('');
  }

  GA.acc.mapaSitio = function () {
    GA.modal({
      titulo: 'Mapa del sitio (pantallas del prototipo)', tam: 'xl',
      cuerpo: '<div class="mapa-sitio">' + MENU_ADMIN.map(function (cl) {
        return '<section><h3>' + esc(cl[0]) + '</h3><ul>' + cl[1].map(function (it) { return '<li><a href="#' + it[2] + '" data-act="cerrarModal">' + esc(it[1]) + '</a></li>'; }).join('') + '</ul></section>';
      }).join('') + '</div><p class="hint">El mapa del sitio completo del producto tiene 18 clusters (T03 §10.8.1); aquí solo figuran las pantallas incluidas en el prototipo.</p>'
    });
  };

  /* ---------- AppShell de la PWA del socio (W-11 a W-15) ---------- */
  function shellSocio(def, vista) {
    var s = GA.e.sesion;
    var tabs = [['inicio', 'Inicio', '/app/inicio', 'inicio'], ['servicios', 'Servicios', '/app/cuentas', 'servicios'], ['fab'], ['gestiones', 'Gestiones', '/app/gestiones', 'gestiones'], ['comunidad', 'Comunidad', '/app/comunidad', 'comunidad']];
    var fab = vista.fab || { texto: 'Pagar', href: '/app/pagar' };
    return '<div class="pwa-fondo"><div class="pwa">' +
      '<header class="pwa-top">' +
      (vista.volver ? '<a class="btn-ico" href="#' + vista.volver + '" aria-label="Volver">' + GA.ico('volver') + '</a>' : '<button type="button" class="btn-ico" data-act="menuPwa" aria-label="Abrir menú">' + GA.ico('menu') + '</button>') +
      '<span class="logo-coop logo-coop--pwa" role="img" aria-label="Logo de Cooperativa Ejemplo (marcador)">CE</span><span class="pwa-top__nombre">Cooperativa Ejemplo</span>' +
      '<button type="button" class="btn-ico" data-act="avisosPwa" aria-label="Avisos: 2">' + GA.ico('campana') + '<span class="punto" aria-hidden="true">2</span></button>' +
      menuUsuario('SE', s.usuario) + '</header>' +
      (vista.banners || '') +
      '<main id="contenido" class="pwa-main pwa-mod" tabindex="-1">' + vista.html + '</main>' +
      '<nav class="tabbar" aria-label="Navegación principal">' + tabs.map(function (t) {
        if (t[0] === 'fab') {
          return fab.act ? '<button type="button" class="fab" data-act="' + fab.act + '" aria-label="' + esc(fab.texto) + '">' + GA.ico('mas') + '</button>'
            : '<a class="fab" href="#' + fab.href + '" aria-label="' + esc(fab.texto) + '">' + GA.ico('mas') + '</a>';
        }
        return '<a href="#' + t[2] + '"' + (def.nav === t[0] ? ' aria-current="page"' : '') + '>' + GA.ico(t[3]) + '<span>' + t[1] + '</span></a>';
      }).join('') + '</nav></div></div>';
  }

  /* ---------- AppShell de la PWA de campo (W-16, W-17) ---------- */
  function shellCampo(def, vista) {
    var s = GA.e.sesion;
    var pend = GA.e.colaCampo.filter(function (c) { return c.estado === 'pendiente'; }).length;
    var tabs = [['hoy', 'Hoy', '/app/campo/today', 'hoy'], ['ordenes', 'Órdenes', '/app/campo/today?vista=ordenes', 'ordenes'], ['fab'], ['stock', 'Stock', '/app/campo/stock', 'stock'], ['sync', 'Sincronización', '/app/campo/sync', 'sync']];
    var banda = GA.e.offline || pend
      ? '<div class="pwa-banner pwa-banner--warn" role="status">' + GA.ico('warn') + '<span>' + (GA.e.offline ? 'Sin conexión. ' : '') + pend + ' cambio' + (pend === 1 ? '' : 's') + ' pendiente' + (pend === 1 ? '' : 's') + ' de enviar.</span><button type="button" class="btn btn--sm" data-act="sincronizar">Reintentar</button></div>' : '';
    return '<div class="pwa-fondo"><div class="pwa pwa--campo">' +
      '<header class="pwa-top">' +
      (vista.volver ? '<a class="btn-ico" href="#' + vista.volver + '" aria-label="Volver">' + GA.ico('volver') + '</a>' : '<span class="btn-ico" aria-hidden="true"></span>') +
      '<span class="logo-coop logo-coop--pwa" role="img" aria-label="Logo de Cooperativa Ejemplo (marcador)">CE</span><span class="pwa-top__nombre">Campo</span>' +
      '<a class="btn-ico" href="#/app/campo/sync" aria-label="Pendientes de sincronizar: ' + pend + '">' + GA.ico('sync') + (pend ? '<span class="punto" aria-hidden="true">' + pend + '</span>' : '') + '</a>' +
      menuUsuario('TE', s.usuario) + '</header>' + banda +
      '<main id="contenido" class="pwa-main pwa-mod" tabindex="-1">' + vista.html + '</main>' +
      '<nav class="tabbar" aria-label="Navegación de campo">' + tabs.map(function (t) {
        if (t[0] === 'fab') return '<button type="button" class="fab" data-act="fabCampo" aria-label="Nuevo: reclamo en campo, foto o material usado">' + GA.ico('mas') + '</button>';
        return '<a href="#' + t[2] + '"' + (def.nav === t[0] ? ' aria-current="page"' : '') + '>' + GA.ico(t[3]) + '<span>' + t[1] + '</span></a>';
      }).join('') + '</nav></div></div>';
  }

  GA.acc.menuPwa = function () {
    GA.modal({
      titulo: 'Menú', tam: 'sm', pwa: true,
      cuerpo: '<ul class="lista-nav"><li><a href="#/app/inicio" data-act="cerrarModal">Inicio</a></li><li><a href="#/app/cuentas" data-act="cerrarModal">Mis cuentas y servicios</a></li><li><a href="#/app/facturas" data-act="cerrarModal">Mis facturas</a></li><li><a href="#/app/pagos" data-act="cerrarModal">Historial de pagos</a></li><li><a href="#/app/gestiones" data-act="cerrarModal">Mis gestiones</a></li><li><a href="#/app/cuentas/vincular" data-act="cerrarModal">Vincular cuenta</a></li></ul>' +
        '<p><button type="button" class="btn btn--block" data-act="cambiarEspacio">Cambiar de espacio</button></p><p><button type="button" class="btn btn--block" data-act="salir">Cerrar sesión</button></p>'
    });
  };
  GA.acc.avisosPwa = function () {
    GA.modal({
      titulo: 'Avisos', tam: 'sm', pwa: true,
      cuerpo: '<ul class="lista"><li>Tu factura del período 11-2026 ya está disponible.</li><li>Corte programado de mantenimiento (ficticio): 12-11-2026 de 02:00 a 04:00.</li></ul>'
    });
  };

  /* ---------- Recorridos guiados ---------- */
  function sesionAdmin() { GA.e.sesion = { espacio: 'admin', tenant: 'ejemplo', sucursal: 'Sucursal Centro', usuario: 'Usuario Ejemplo D' }; }
  function sesionSocio() { GA.e.sesion = { espacio: 'socio', tenant: 'ejemplo', sucursal: '', usuario: 'Socio Ejemplo', personaId: 'P-0001' }; }
  GA.sesionAdmin = sesionAdmin;
  GA.sesionSocio = sesionSocio;
  GA.sesionCampo = function () { GA.e.sesion = { espacio: 'campo', tenant: 'ejemplo', sucursal: '', usuario: 'Técnico Ejemplo', cuadrilla: 'Cuadrilla Ejemplo 1' }; };

  GA.recorridos = [
    {
      id: 'r1', titulo: 'Ingreso y selección de cooperativa y espacio', prep: function () { GA.reiniciar(); GA.e.sesion = null; },
      pasos: [
        ['/login', 'Ingresá con cualquier usuario y contraseña (por ejemplo, el DNI 00000000).'],
        ['/login/2fa', 'Escribí cualquier código de 6 dígitos y verificá.'],
        ['/login/espacio', 'Elegí la cooperativa y el espacio. Probá también "Cooperativa Ejemplo Dos".'],
        ['/admin/inicio', 'Llegaste al tablero del personal. Usá Ctrl+K para buscar o el menú lateral.']
      ]
    },
    {
      id: 'r2', titulo: 'Alta de persona, titular y cuenta', prep: function () { GA.reiniciar(); sesionAdmin(); },
      pasos: [
        ['/admin/per/titulares', 'Desde Titulares, tocá "Nuevo titular".'],
        ['/admin/per/titulares/:nuevo', 'Completá la persona y la cuenta. Al guardar se abre la ficha 360 del nuevo titular.']
      ]
    },
    {
      id: 'r3', titulo: 'Alta de contrato de Internet', prep: function () { GA.reiniciar(); sesionAdmin(); },
      pasos: [
        ['/admin/per/titulares/000123', 'En la ficha 360, la cuenta 0002 no tiene contratos: tocá "Nuevo contrato".'],
        ['/admin/cat/contracts/new', 'Recorré los 6 pasos del asistente y tocá "Crear contrato".'],
        ['/admin/per/titulares/000123', 'El contrato queda Solicitado y vinculado a un caso de atención.'],
        ['/admin/crm/bandeja', 'El caso de la solicitud aparece en la bandeja de atención.']
      ]
    },
    {
      id: 'r4', titulo: 'Facturación: revisión previa y emisión del lote', prep: function () { GA.reiniciar(); sesionAdmin(); },
      pasos: [
        ['/admin/fac/lotes', 'Abrí el lote LOT-2026-11-INT, que está Prefacturado.'],
        ['/admin/fac/lotes/LOT-2026-11-INT', 'Revisá la muestra de control, marcala como revisada, aprobá y después emití.'],
        ['/admin/fac/comprobantes', 'Los comprobantes emitidos del período 11-2026 aparecen en el listado.']
      ]
    },
    {
      id: 'r5', titulo: 'Cobro en caja y recibo', prep: function () { GA.reiniciar(); sesionAdmin(); GA.emitirLoteDirecto('LOT-2026-11-INT'); },
      pasos: [
        ['/admin/cob/caja/apertura', 'Abrí la caja 01 con un fondo inicial.'],
        ['/admin/cob/caja/cobro', 'Buscá la cuenta 0001, entregá ARS 40.000 en efectivo y confirmá con F10.'],
        ['/admin/cob/recibos', 'El recibo queda registrado; podés verlo e imprimirlo (simulado).'],
        ['/admin/per/titulares/000123', 'En la ficha 360, la pestaña Cuenta corriente muestra el pago.']
      ]
    },
    {
      id: 'r6', titulo: 'Portal del socio: facturas, pago, vinculación y gestiones', prep: function () { GA.reiniciar(); GA.emitirLoteDirecto('LOT-2026-11-INT'); sesionSocio(); },
      pasos: [
        ['/app/inicio', 'Inicio con el saldo a pagar. Tocá "Tu última factura".'],
        ['/app/facturas/:ultima', 'Detalle de la factura con "¿Por qué pago esto?". Tocá "Pagar".'],
        ['/app/pagar', 'Elegí SIRO y pagá.'],
        ['/app/pagos/:checkout', 'El pago queda pendiente hasta la notificación. Simulá la confirmación.'],
        ['/app/cuentas/vincular', 'Vinculá la cuenta 0002 con el DNI 00000000.'],
        ['/app/gestiones', 'Desde Gestiones, tocá ( + ) para iniciar una gestión o reclamo.']
      ]
    },
    {
      id: 'r7', titulo: 'Reclamo y orden de trabajo (admin y campo)', prep: function () { GA.reiniciar(); sesionAdmin(); },
      pasos: [
        ['/admin/crm/bandeja', 'En la bandeja, abrí el reclamo vencido 2026-000040.'],
        ['/admin/crm/casos/2026-000040', 'Tomá el caso y creá una OT de reclamo técnico.'],
        ['/admin/tec/work-orders/:ot', 'En la ficha de la OT, tocá "Despachar". Luego cambiá al espacio de campo.'],
        ['/app/campo/today', 'En Mi día, abrí la OT despachada.'],
        ['/app/campo/work-orders/:ot', 'Completá los pasos y marcá la OT como ejecutada.'],
        ['/admin/tec/work-orders/:ot', 'De vuelta en el admin, confirmá y cerrá la OT: el caso queda resuelto.']
      ]
    }
  ];

  function resolverPaso(ruta) {
    if (ruta.indexOf(':nuevo') >= 0) { var t = GA.e.titulares[GA.e.titulares.length - 1]; return ruta.replace(':nuevo', t.id); }
    if (ruta.indexOf(':ultima') >= 0) {
      var fc = GA.e.comprobantes.filter(function (c) { return c.cuentaId === '0001'; }).pop();
      return fc ? ruta.replace(':ultima', fc.id) : '/app/facturas';
    }
    if (ruta.indexOf(':checkout') >= 0) { var ch = GA.e.checkouts[GA.e.checkouts.length - 1]; return ch ? ruta.replace(':checkout', ch.id) : '/app/pagar'; }
    if (ruta.indexOf(':ot') >= 0) {
      var ot = GA.e.ots.filter(function (o) { return o.casoId === '2026-000040'; }).pop();
      return ot ? ruta.replace(':ot', ot.id) : '/admin/crm/casos/2026-000040';
    }
    return ruta;
  }

  function recorridoActual() {
    var r = GA.e.recorrido;
    if (!r) return null;
    var def = GA.recorridos.find(function (x) { return x.id === r.id; });
    return def ? { def: def, paso: r.paso } : null;
  }

  function sincronizarRecorrido(loc) {
    var ra = recorridoActual();
    if (!ra) return;
    for (var i = ra.def.pasos.length - 1; i > ra.paso; i--) {
      if (resolverPaso(ra.def.pasos[i][0]) === loc.path) { GA.e.recorrido.paso = i; GA.guardar(); return; }
    }
  }

  function barraRecorrido() {
    var ra = recorridoActual();
    if (!ra) return '';
    var n = ra.def.pasos.length;
    var paso = ra.def.pasos[ra.paso];
    return '<aside class="tour" aria-label="Recorrido guiado"><p><strong>' + esc(ra.def.titulo) + '</strong> · Paso ' + (ra.paso + 1) + ' de ' + n + ': ' + esc(paso[1]) + '</p>' +
      '<div class="tour__acc">' +
      (ra.paso > 0 ? '<button type="button" class="btn btn--sm" data-act="tourPaso" data-d="-1">Anterior</button>' : '') +
      (ra.paso < n - 1 ? '<button type="button" class="btn btn--sm btn--pri" data-act="tourPaso" data-d="1">Siguiente paso</button>' : '<button type="button" class="btn btn--sm btn--pri" data-act="tourSalir">Terminar</button>') +
      '<button type="button" class="btn btn--sm" data-act="tourSalir">Salir del recorrido</button></div></aside>';
  }

  GA.acc.iniciarRecorrido = function (el) {
    var def = GA.recorridos.find(function (x) { return x.id === el.getAttribute('data-id'); });
    def.prep();
    GA.e.recorrido = { id: def.id, paso: 0 };
    GA.guardar();
    GA.ir(resolverPaso(def.pasos[0][0]));
  };
  GA.acc.tourPaso = function (el) {
    var ra = recorridoActual();
    var p = ra.paso + Number(el.getAttribute('data-d'));
    GA.e.recorrido.paso = p;
    var destino = resolverPaso(ra.def.pasos[p][0]);
    var espacio = destino.indexOf('/admin') === 0 ? 'admin' : destino.indexOf('/app/campo') === 0 ? 'campo' : destino.indexOf('/app') === 0 ? 'socio' : null;
    if (espacio && GA.e.sesion && GA.e.sesion.espacio !== espacio) {
      if (espacio === 'admin') sesionAdmin(); else if (espacio === 'campo') GA.sesionCampo(); else sesionSocio();
      GA.toast('El recorrido cambió al espacio ' + (espacio === 'admin' ? 'de administración' : espacio === 'campo' ? 'de campo' : 'del socio') + '.', 'info');
    }
    GA.guardar();
    GA.ir(destino);
  };
  GA.acc.tourSalir = function () { GA.e.recorrido = null; GA.mutar(); };

  /* ---------- Delegación de eventos ---------- */
  document.addEventListener('click', function (ev) {
    var el = ev.target.closest('[data-act]');
    if (GA.ui.menuUsuario && !ev.target.closest('.menu-usu')) { GA.ui.menuUsuario = false; GA.render(true); }
    if (!el) return;
    var fn = GA.acc[el.getAttribute('data-act')];
    if (fn) {
      if (el.tagName === 'A' && el.getAttribute('href') === '#') ev.preventDefault();
      fn(el, ev);
    }
  });
  document.addEventListener('submit', function (ev) {
    var f = ev.target.closest('form[data-form]');
    if (!f) return;
    ev.preventDefault();
    var fn = GA.form[f.getAttribute('data-form')];
    if (fn) fn(f, ev);
  });
  document.addEventListener('input', function (ev) {
    var el = ev.target.closest('[data-inp]');
    if (!el) return;
    var fn = GA.inp[el.getAttribute('data-inp')];
    if (fn) fn(el, ev);
  });
  document.addEventListener('change', function (ev) {
    var el = ev.target.closest('[data-chg]');
    if (!el) return;
    var fn = GA.inp[el.getAttribute('data-chg')];
    if (fn) fn(el, ev);
  });
  document.addEventListener('keydown', function (ev) {
    if ((ev.ctrlKey || ev.metaKey) && (ev.key === 'k' || ev.key === 'K')) { ev.preventDefault(); GA.acc.buscar(); }
    if (ev.key === 'F10' && GA.teclaF10) { ev.preventDefault(); GA.teclaF10(); }
    if (ev.key === 'Escape' && GA.ui.menuUsuario) {
      GA.ui.menuUsuario = false; GA.render(true);
      var b = document.getElementById('btn-usuario'); if (b) b.focus();
    }
  });

  GA.acc.saltar = function (el, ev) {
    ev.preventDefault();
    var m = document.getElementById('contenido');
    if (m) m.focus();
  };

  GA.acc.tab = function (el) {
    GA.ui[el.getAttribute('data-grupo')] = el.getAttribute('data-valor');
    GA.render(true);
  };

  window.addEventListener('hashchange', function () { GA.cerrarModal(); GA.teclaF10 = null; GA.render(); });
  document.addEventListener('DOMContentLoaded', function () {
    GA.e = GA.cargar();
    GA.render();
  });
})(window.GA);
