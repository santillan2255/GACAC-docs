/* PWA del socio (AppShell): inicio (W-11), facturas (W-12), pago (W-13), gestiones (W-14) y vinculación (W-15). */
'use strict';

(function (GA) {
  var esc = GA.esc;
  var q = GA.q;
  var M = GA.M;

  function vinculadas() { return GA.e.vinculadas.slice(); }
  function cuentaActiva() {
    var v = vinculadas();
    if (!GA.e.cuentaSocio || v.indexOf(GA.e.cuentaSocio) < 0) GA.e.cuentaSocio = v[0];
    return GA.e.cuentaSocio;
  }
  function h1(t, sub) { return '<h1 id="h1" tabindex="-1" class="pwa-h1">' + esc(t) + '</h1>' + (sub ? '<p class="pwa-sub">' + sub + '</p>' : ''); }
  function fila(href, contenido, etiqueta) { return '<a class="tira" href="#' + href + '"' + (etiqueta ? ' aria-label="' + esc(etiqueta) + '"' : '') + '>' + contenido + GA.ico('chevron', 'tira__ch') + '</a>'; }

  /* ---------- W-11 Inicio con saldo (PAN-POR-25) ---------- */
  GA.ruta('/app/inicio', {
    app: 'socio', nav: 'inicio',
    render: function () {
      var cta = cuentaActiva();
      var saldo = q.saldoCuenta(cta);
      var impagos = q.impagosDe(cta);
      var vto = impagos.length ? impagos[0].vto1 : null;
      var casos = q.casosDeCuentas(vinculadas()).filter(function (c) { return c.estado !== 'resuelto'; });
      var ots = GA.e.ots.filter(function (o) { var k = q.contrato(o.contratoId); return k && vinculadas().indexOf(k.cuentaId) >= 0 && o.estado !== 'closed' && o.estado !== 'executed'; });
      var fcs = q.comprobantesDe(cta);
      var ultima = fcs[fcs.length - 1];
      var banners = GA.e.sinBannerInstalar ? '' : '<div class="pwa-banner" role="region" aria-label="Instalar la app">' + GA.ico('info') + '<span>Instalá la app para entrar más rápido.</span><button type="button" class="btn btn--sm" data-act="noDisponible">Instalar</button><button type="button" class="btn-ico" data-act="cerrarBannerInstalar" aria-label="Cerrar aviso de instalación">' + GA.ico('cerrar') + '</button></div>';
      var selector = vinculadas().length > 1
        ? GA.campo({ id: 'sel-cta', label: 'Cuenta', type: 'select', value: cta, opciones: vinculadas().map(function (id) { return [id, 'Cuenta ' + id + ' · ' + q.cuenta(id).domicilio]; }), attrs: 'data-chg="cuentaSocio"' })
        : '<p class="pwa-sub">Cuenta ' + cta + '</p>';
      var tarjeta = saldo > 0
        ? '<section class="card card--saldo" aria-labelledby="t-saldo"><h2 id="t-saldo" class="card__t">Saldo a pagar</h2><p class="card__monto">' + GA.ars(saldo) + '</p><p>Vence el ' + vto + '</p><a class="btn btn--pri btn--block" href="#/app/pagar?cuenta=' + cta + '">Pagar</a></section>'
        : '<section class="card card--saldo" aria-labelledby="t-saldo"><h2 id="t-saldo" class="card__t">Estás al día</h2><p>No tenés saldo pendiente en esta cuenta.</p><button type="button" class="btn btn--pri btn--block" data-act="nuevaGestion">Reclamar</button></section>';
      return {
        meta: M('W-11', 'PAN-POR-25', '/app/inicio', 'por.portal.ver', 'O2 (inicio); O4 (factura); O5 (saldo y Pagar)', 'Inicio', 'Ver saldo, próximo vencimiento, trámites y accesos directos.', 'C-SOC, C-REP'),
        banners: banners,
        html: h1('Hola, Socio') + selector + tarjeta +
          '<h2 class="pwa-h2">Acciones rápidas</h2><div class="rapidas"><button type="button" class="btn" data-act="nuevaGestion">Reclamar</button><a class="btn" href="#/app/contratar">Contratar</a><button type="button" class="btn" data-act="noDisponible">Coordinar visita</button></div>' +
          '<h2 class="pwa-h2">Trámites en curso</h2>' + (casos.length ? casos.map(function (c) { return fila('/app/gestiones/' + c.id, '<span><strong>' + esc(c.asunto) + '</strong><br>' + GA.badge('casoSocio', c.estado) + '<br><span class="mono">N.º ' + c.id + '</span></span>'); }).join('') : '<p class="pwa-sub">No tenés trámites en curso.</p>') +
          (ots.length ? '<h2 class="pwa-h2">Próxima visita</h2>' + ots.map(function (o) { return '<div class="tira"><span>' + esc(o.visita) + ' · ' + esc(o.operacion) + '</span></div>'; }).join('') : '') +
          '<h2 class="pwa-h2">Tu última factura</h2>' + (ultima ? fila('/app/facturas/' + ultima.id, '<span>Período ' + ultima.periodo + ' · <span class="mono">' + GA.ars(ultima.total) + '</span><br>' + GA.badge('comercial', q.saldoComprobante(ultima) ? 'impaga' : 'pagada') + '</span>', 'Tu última factura: período ' + ultima.periodo + ', ' + GA.ars(ultima.total)) : '<p class="pwa-sub">Todavía no tenés facturas en esta cuenta.</p>') +
          '<h2 class="pwa-h2">Novedades</h2><div class="tira"><span>Nuevo horario de atención en la sede (texto ficticio).</span></div>'
      };
    }
  });
  GA.inp.cuentaSocio = function (el) { GA.e.cuentaSocio = el.value; GA.mutar(); };
  GA.acc.cerrarBannerInstalar = function () { GA.e.sinBannerInstalar = true; GA.mutar(); document.getElementById('h1').focus(); };

  /* ---------- Mis cuentas (PAN-POR-26) ---------- */
  GA.ruta('/app/cuentas', {
    app: 'socio', nav: 'servicios',
    render: function () {
      return {
        meta: M('—', 'PAN-POR-26', '/app/cuentas', 'por.portal.ver', 'O2', 'Mis cuentas y servicios', 'Ver las cuentas vinculadas, sus servicios y saldo.', 'C-SOC, C-REP'),
        fab: { texto: 'Vincular cuenta', href: '/app/cuentas/vincular' },
        html: h1('Mis cuentas y servicios') + vinculadas().map(function (id) {
          var c = q.cuenta(id);
          var ks = q.contratosDe(id);
          return '<section class="card">' + fila('/app/cuentas/' + id, '<h2 class="card__t">Cuenta ' + id + '</h2><p>' + esc(c.domicilio) + '</p><p>Rol: titular · Saldo <span class="mono">' + GA.ars(q.saldoCuenta(id)) + '</span></p>', 'Ver cuenta ' + id) +
            (ks.length ? ks.map(function (k) { return '<p>Internet · ' + esc(q.plan(k.planId).nombre) + ' ' + GA.badge('contrato', k.estado) + '</p>'; }).join('') : '<p>Sin servicios contratados.</p>') + '</section>';
        }).join('') + '<a class="btn btn--block" href="#/app/cuentas/vincular">Vincular otra cuenta</a>'
      };
    }
  });

  /* ---------- Detalle de cuenta (PAN-POR-28) y movimientos (PAN-POR-43) ---------- */
  function cuentaSocioHtml(id) {
    var c = q.cuenta(id);
    if (!c || vinculadas().indexOf(id) < 0) return null;
    var ks = q.contratosDe(id);
    var saldo = q.saldoCuenta(id);
    return '<p>' + esc(c.domicilio) + '</p>' +
      '<dl class="dl"><dt>Titular</dt><dd>' + esc(q.nombreCuenta(id)) + '</dd><dt>Entrega de facturas</dt><dd>' + esc(c.entrega) + '</dd><dt>Saldo</dt><dd class="mono">' + GA.ars(saldo) + '</dd></dl>' +
      '<h2 class="pwa-h2">Servicios</h2>' + (ks.length ? ks.map(function (k) {
        return '<div class="card"><p><strong>Internet · ' + esc(q.plan(k.planId).nombre) + '</strong> ' + GA.badge('contrato', k.estado) + '</p><p class="hint">Contrato ' + k.id + ' · ' + esc(k.domicilio) + '</p></div>';
      }).join('') : '<p>Sin contratos activos en esta cuenta.</p>') +
      '<div class="acciones"><a class="btn btn--pri" href="#/app/cuentas/' + id + '/movimientos">Ver movimientos</a><a class="btn" href="#/app/pagar?cuenta=' + id + '">Pagar</a></div>' +
      '<p class="hint">Representaciones y adhesiones: disponibles en olas siguientes (RF-POR-043).</p>';
  }

  GA.ruta('/app/cuentas/:id/movimientos', {
    app: 'socio', nav: 'servicios',
    render: function (p) {
      var id = p.id;
      var meta = M('—', 'PAN-POR-43', '/app/cuentas/:accountId/movimientos', 'por.facturas.ver', 'O5', 'Movimientos de cuenta', 'Consultar débitos, créditos y saldo de la cuenta.', 'C-SOC, C-REP');
      if (!cuentaSocioHtml(id)) {
        return { meta: meta, volver: '/app/cuentas', html: h1('Movimientos') + GA.vacio('Cuenta no disponible', 'Solo podés ver las cuentas que tenés vinculadas.', '<a class="btn" href="#/app/cuentas">Mis cuentas</a>') };
      }
      var mov = GA.movimientos([id]);
      var cuerpo = mov.length ? '<div class="tabla-cont"><table class="tabla"><caption class="sr-only">Movimientos</caption><thead><tr><th scope="col">Fecha</th><th scope="col">Concepto</th><th scope="col" class="num">Saldo</th></tr></thead><tbody>' +
        mov.map(function (m) { return '<tr><td class="mono">' + m.fecha + '</td><td>' + esc(m.desc) + '</td><td class="num mono">' + GA.num(m.saldo) + '</td></tr>'; }).join('') + '</tbody></table></div>' : GA.vacio('Sin movimientos', 'Cuando haya facturas o pagos, aparecen acá.');
      return { meta: meta, volver: '/app/cuentas/' + id, fab: { texto: 'Pagar', href: '/app/pagar' }, html: h1('Movimientos · Cuenta ' + id) + cuerpo + '<button type="button" class="btn btn--block" data-act="noDisponible">Descargar resumen (PDF)</button>' };
    }
  });

  GA.ruta('/app/perfil', {
    app: 'socio', nav: 'inicio',
    render: function () {
      var per = q.persona(GA.e.sesion.personaId);
      return {
        meta: M('—', 'PAN-POR-59', '/app/perfil', 'por.perfil.editar', 'O0–O2', 'Mi perfil', 'Ver y editar datos de contacto del usuario de la app.', 'C-SOC, C-REP'),
        volver: '/app/inicio',
        html: h1('Mi perfil') + '<dl class="dl"><dt>Nombre</dt><dd>' + esc(GA.q.nombre(per)) + '</dd><dt>Documento</dt><dd class="mono">' + esc(per.dni) + '</dd><dt>CUIT</dt><dd class="mono">' + esc(per.cuit) + '</dd><dt>Email</dt><dd>' + esc(per.email) + '</dd><dt>Teléfono</dt><dd>' + esc(per.telefono) + '</dd><dt>Domicilio postal</dt><dd>' + esc(per.domicilio + ', ' + per.localidad) + '</dd></dl>' +
          '<button type="button" class="btn btn--block" data-act="noDisponible">Editar contacto (con verificación)</button>' +
          '<p class="hint">Cambios de domicilio o datos fiscales generan un trámite en la cooperativa.</p>'
      };
    }
  });

  /* ---------- W-15 Vincular cuenta con código (PAN-POR-27) ---------- */
  GA.ruta('/app/cuentas/vincular', {
    app: 'socio', nav: 'servicios',
    render: function () {
      var v = GA.ui.vinc || (GA.ui.vinc = { paso: 1, metodo: 'codigo', cuenta: '', doc: '', errores: [] });
      var err = function (id) { var e = v.errores.filter(function (x) { return x[0] === id; })[0]; return e && e[1]; };
      var cuerpo;
      if (GA.e.intentosVinculo >= 6) {
        cuerpo = '<div class="banda banda--bad" role="alert">' + GA.ico('bad') + 'Superaste los intentos. Probá de nuevo en 15 minutos.</div><button type="button" class="btn btn--block" data-act="vinculoAsistido">Solicitar vinculación asistida</button>';
      } else if (v.paso === 1) {
        cuerpo = '<p>Elegí cómo querés vincular tu cuenta.</p>' + GA.pestanas('vincMetodo', [['codigo', 'Código al contacto'], ['factura', 'Datos de factura'], ['socio', 'Código de socio']], v.metodo, { accion: 'vincMetodo', label: 'Métodos de vinculación' }) +
          '<div id="panel-vincMetodo" role="tabpanel" aria-labelledby="tab-vincMetodo-' + v.metodo + '">' +
          (v.metodo === 'codigo' ? GA.resumenErrores(v.errores) + '<form data-form="vincular1" novalidate>' +
            GA.campo({ id: 'vi-cuenta', label: 'Número de cuenta o de suministro', value: v.cuenta, req: true, err: err('vi-cuenta'), attrs: 'inputmode="numeric" autofocus' }) +
            '<p><button type="button" class="btn-link" data-act="dondeCuenta">¿Dónde lo encuentro?</button></p>' +
            GA.campo({ id: 'vi-doc', label: 'DNI o CUIT del titular', value: v.doc, req: true, hint: 'DNI sin puntos o CUIT con guiones', err: err('vi-doc') }) +
            '<button type="submit" class="btn btn--pri btn--block">Enviar código</button></form>'
            : '<p>Método habilitable por la cooperativa (DEC-043). En el piloto queda a definir cuáles se habilitan (AD-11); no se incluye en el prototipo.</p>') +
          '</div><p><button type="button" class="btn-link" data-act="vinculoAsistido">¿No podés? Solicitar vinculación asistida</button></p>' +
          '<p class="hint">Prototipo: probá con la cuenta 0002 y el DNI 00000000.</p>';
      } else if (v.paso === 2) {
        cuerpo = '<p>Si los datos son correctos, enviamos un código de 6 dígitos al contacto verificado del titular: <span aria-label="correo que empieza con s">s****@****.example</span>.</p>' +
          (v.fallo ? '<div class="banda banda--bad" role="alert">' + GA.ico('bad') + 'No pudimos vincular la cuenta con esos datos. Revisalos o solicitá la vinculación asistida.</div>' : '') +
          '<form data-form="vincular2" novalidate>' + GA.campo({ id: 'vi-code', label: 'Código de 6 dígitos', req: true, auto: 'one-time-code', clase: 'campo--otp', err: err('vi-code'), hint: 'El código vence en 10 minutos.', attrs: 'inputmode="numeric" maxlength="6" autofocus' }) +
          '<div class="fila-entre"><button type="button" class="btn" data-act="reenviarVinculo">Reenviar código</button><button type="submit" class="btn btn--pri">Vincular</button></div></form>' +
          '<p class="hint">Prototipo: cualquier código de 6 dígitos sirve si los datos son correctos.</p>';
      } else {
        cuerpo = '<div class="card"><p>' + GA.badgeTono('ok', 'Cuenta vinculada') + '</p><p>La cuenta ' + esc(v.cuenta) + ' ya aparece en Mis cuentas y en el selector de Inicio. Le avisamos al titular, que puede revocarla si no fue él.</p></div><a class="btn btn--pri btn--block" href="#/app/cuentas">Ver mis cuentas</a>';
      }
      return {
        meta: M('W-15', 'PAN-POR-27', '/app/cuentas/vincular', 'por.cuentas.vincular', 'O2 (código al contacto); O4 (datos de factura)', 'Vincular cuenta', 'Vincular el usuario con una cuenta existente de forma segura, sin revelar si la cuenta existe.', 'C-VIS, C-SOC'),
        volver: '/app/cuentas', fab: { texto: 'Vincular cuenta', href: '/app/cuentas/vincular' },
        html: h1(v.paso === 2 ? 'Ingresá el código' : 'Vincular cuenta', 'En el producto se abre como modal.') + cuerpo
      };
    }
  });

  GA.ruta('/app/cuentas/:id', {
    app: 'socio', nav: 'servicios',
    render: function (p) {
      var meta = M('—', 'PAN-POR-28', '/app/cuentas/:accountId', 'por.servicios.ver', 'O2', 'Detalle de cuenta', 'Ver domicilio, servicios, saldo y accesos de una cuenta vinculada.', 'C-SOC, C-REP');
      var det = cuentaSocioHtml(p.id);
      if (!det) {
        return { meta: meta, volver: '/app/cuentas', html: h1('Cuenta') + GA.vacio('Cuenta no disponible', '', '<a class="btn" href="#/app/cuentas">Volver</a>') };
      }
      return { meta: meta, volver: '/app/cuentas', fab: { texto: 'Pagar', href: '/app/pagar' }, html: h1('Cuenta ' + p.id) + det };
    }
  });

  GA.acc.vincMetodo = function (el) { GA.ui.vinc.metodo = el.getAttribute('data-valor'); GA.ui.vinc.errores = []; GA.render(true); };
  GA.acc.dondeCuenta = function () {
    GA.modal({ titulo: '¿Dónde está el número de cuenta?', tam: 'sm', pwa: true, cuerpo: '<div class="factura-ilus" role="img" aria-label="Factura ilustrativa: el número de cuenta está arriba a la derecha, debajo del nombre del titular."><span>Factura</span><span class="factura-ilus__marca">Cuenta 0000</span></div><p>Está arriba a la derecha de tu factura, debajo de tu nombre.</p>', pie: '<button type="button" class="btn btn--pri" data-act="cerrarModal">Entendido</button>' });
  };
  GA.acc.vinculoAsistido = function () { GA.toast('Pedido de vinculación asistida enviado a la cooperativa (simulado).', 'info'); };
  GA.acc.reenviarVinculo = function () { GA.toast('Si los datos son correctos, enviamos un nuevo código.', 'info'); };
  GA.form.vincular1 = function (f) {
    var v = GA.ui.vinc;
    v.cuenta = f.querySelector('#vi-cuenta').value.trim();
    v.doc = f.querySelector('#vi-doc').value.trim();
    v.errores = [];
    if (!/^\d{1,8}$/.test(v.cuenta)) v.errores.push(['vi-cuenta', 'Ingresá el número de cuenta (solo números).']);
    if (!/^\d{7,8}$/.test(v.doc) && GA.validarCuit(v.doc) !== null) v.errores.push(['vi-doc', 'Ingresá un DNI sin puntos o un CUIT válido con guiones.']);
    if (v.errores.length) { GA.render(true); document.getElementById('resumen-errores').focus(); return; }
    var c = q.cuenta(v.cuenta.padStart(4, '0'));
    var per = c ? q.persona(q.titular(c.titularId).personaId) : null;
    var docOk = per && (per.dni === v.doc.padStart(8, '0') || per.cuit === v.doc);
    v.valido = !!(c && docOk && per.id === GA.e.sesion.personaId && GA.e.vinculadas.indexOf(c.id) < 0);
    v.cuenta = c ? c.id : v.cuenta;
    v.paso = 2;
    v.fallo = false;
    GA.toast('Si los datos son correctos, enviamos un código al contacto del titular.', 'info');
    GA.render(true);
    document.getElementById('h1').focus();
  };
  GA.form.vincular2 = function (f) {
    var v = GA.ui.vinc;
    var code = f.querySelector('#vi-code').value.trim();
    v.errores = [];
    if (!/^\d{6}$/.test(code)) { v.errores.push(['vi-code', 'El código tiene 6 números.']); GA.render(true); document.getElementById('vi-code').focus(); return; }
    if (!v.valido) {
      GA.e.intentosVinculo++;
      v.fallo = true;
      GA.mutar();
      return;
    }
    GA.e.vinculadas.push(v.cuenta);
    GA.e.historia.unshift({ fecha: GA.ahora(), titularId: q.cuenta(v.cuenta).titularId, texto: 'Cuenta ' + v.cuenta + ' vinculada en la app del socio' });
    v.paso = 3;
    GA.toast('Cuenta ' + v.cuenta + ' vinculada.');
    GA.mutar();
    document.getElementById('h1').focus();
  };

  /* ---------- Mis facturas (PAN-POR-38) ---------- */
  GA.ruta('/app/facturas', {
    app: 'socio', nav: 'inicio',
    render: function () {
      var tab = GA.ui.misFc || 'adeudadas';
      var todas = GA.e.comprobantes.filter(function (c) { return vinculadas().indexOf(c.cuentaId) >= 0; }).reverse();
      var lista = tab === 'adeudadas' ? todas.filter(function (c) { return q.saldoComprobante(c) > 0; }) : todas;
      return {
        meta: M('—', 'PAN-POR-38', '/app/facturas', 'por.facturas.ver', 'O4', 'Mis facturas', 'Ver facturas adeudadas y todas las facturas de las cuentas vinculadas.', 'C-SOC, C-REP'),
        html: h1('Mis facturas') + GA.pestanas('misFc', [['adeudadas', 'Adeudadas'], ['todas', 'Todas']], tab, { label: 'Filtro de facturas' }) +
          '<div id="panel-misFc" role="tabpanel" aria-labelledby="tab-misFc-' + tab + '">' +
          (lista.length ? lista.map(function (c) { return fila('/app/facturas/' + c.id, '<span>Internet · Período ' + c.periodo + ' · Cta. ' + c.cuentaId + '<br>Vence ' + c.vto1 + ' · <span class="mono">' + GA.ars(c.total) + '</span><br>' + GA.badge('comercial', q.saldoComprobante(c) ? 'impaga' : 'pagada') + '</span>', 'Factura período ' + c.periodo + ', ' + GA.ars(c.total) + ', ' + (q.saldoComprobante(c) ? 'impaga' : 'pagada')); }).join('')
            : GA.vacio(tab === 'adeudadas' ? 'No tenés facturas adeudadas' : 'Todavía no tenés facturas', '')) + '</div>' +
          '<p><a href="#/app/pagos">Ver historial de pagos</a></p>'
      };
    }
  });

  /* ---------- W-12 Detalle de factura (PAN-POR-39) ---------- */
  GA.ruta('/app/facturas/:id', {
    app: 'socio', nav: 'inicio',
    render: function (p) {
      var c = q.comprobante(p.id);
      var meta = M('W-12', 'PAN-POR-39 (con PAN-FAC-44)', '/app/facturas/' + p.id, 'por.facturas.ver', 'O4', 'Factura', 'Mostrar una factura con apertura por concepto, explicación de cada importe y acceso a pagar, descargar o reclamar.', 'C-SOC, C-REP');
      if (!c || vinculadas().indexOf(c.cuentaId) < 0) return { meta: meta, volver: '/app/facturas', html: h1('Factura no disponible') + GA.vacio('No encontramos esta factura en tus cuentas', '', '<a class="btn" href="#/app/facturas">Ver mis facturas</a>') };
      var saldo = q.saldoComprobante(c);
      var k = c.contratoId ? q.contrato(c.contratoId) : q.contratosDe(c.cuentaId)[0];
      return {
        meta: meta, volver: '/app/facturas',
        html: h1('Factura ' + c.letra + ' ' + c.numero, 'Período ' + c.periodo + ' · Emitida ' + c.fecha) + '<p>' + GA.badge('comercial', saldo ? 'impaga' : 'pagada') + '</p>' +
          '<h2 class="pwa-h2">Vencimientos</h2><dl class="dl-num"><dt>1er vto. ' + c.vto1 + '</dt><dd class="mono">' + GA.ars(c.total) + '</dd><dt>2do vto. ' + c.vto2 + '</dt><dd class="mono">' + GA.ars(c.total) + ' (*)</dd></dl>' +
          '<h2 class="pwa-h2">Internet · ' + (k ? k.id + ' · ' + esc(q.plan(k.planId).nombre) : '') + '</h2>' +
          '<table class="tabla tabla--pwa"><caption class="sr-only">Conceptos de la factura</caption><thead><tr><th scope="col">Concepto</th><th scope="col" class="num">Importe (ARS)</th><th scope="col"><span class="sr-only">Explicación</span></th></tr></thead><tbody>' +
          c.renglones.map(function (r, i) { return '<tr><td>' + esc(r.concepto) + '</td><td class="num mono">' + GA.num(r.importe) + '</td><td><button type="button" class="btn-ico" data-act="porQue" data-i="' + i + '" aria-label="Explicación de ' + esc(r.concepto) + '">' + GA.ico('ayuda') + '</button></td></tr>'; }).join('') +
          '</tbody></table><dl class="dl-num"><dt>Total</dt><dd class="mono">' + GA.ars(c.total) + '</dd><dt>Pagado</dt><dd class="mono">' + GA.ars(c.pagado) + '</dd><dt class="total">Saldo</dt><dd class="mono total">' + GA.ars(saldo) + '</dd></dl>' +
          '<p class="hint">El ícono de ayuda junto a cada concepto responde "¿Por qué pago esto?". (*) Importe ilustrativo: el recargo por segundo vencimiento y los tributos los resuelven M04, M06 y M08.</p>' +
          (saldo ? '<a class="btn btn--pri btn--block" href="#/app/pagar?fc=' + c.id + '">Pagar</a><div class="fila-2"><button type="button" class="btn" data-act="descargarPdf">Descargar PDF</button><button type="button" class="btn" data-act="reclamarFactura" data-id="' + c.id + '">Reclamar por esta factura</button></div>'
            : '<button type="button" class="btn btn--pri btn--block" data-act="descargarPdf">Descargar PDF</button><button type="button" class="btn btn--block" data-act="reclamarFactura" data-id="' + c.id + '">Reclamar por esta factura</button>'),
        despues: function () { GA.fcActual = c; }
      };
    }
  });
  GA.acc.porQue = function (el) {
    var r = GA.fcActual.renglones[Number(el.getAttribute('data-i'))];
    GA.modal({ titulo: '¿Por qué pago esto?', tam: 'sm', pwa: true, cuerpo: '<p><strong>' + esc(r.concepto) + '</strong></p><p>' + esc(r.explica) + '</p>', pie: '<button type="button" class="btn btn--pri btn--block" data-act="cerrarModal">Entendido</button>' });
  };
  GA.acc.descargarPdf = function () { GA.toast('Descarga simulada. En el producto se usa una URL firmada de corta vida.', 'info'); };
  GA.acc.reclamarFactura = function (el) {
    var c = q.comprobante(el.getAttribute('data-id'));
    GA.preGestion = { tipo: 'consulta', motivo: 'Consulta por factura', texto: 'Consulta sobre la factura ' + c.letra + ' ' + c.numero + ' del período ' + c.periodo + '.' };
    GA.acc.nuevaGestion();
  };

  /* ---------- W-13 Pagar (PAN-POR-40) ---------- */
  GA.ruta('/app/pagar', {
    app: 'socio', nav: 'inicio',
    render: function (p, query) {
      if (!GA.ui.carro) {
        var base = query.fc ? [query.fc] : q.impagosDe(query.cuenta || cuentaActiva()).map(function (c) { return c.id; });
        GA.ui.carro = base.filter(function (id) { var c = q.comprobante(id); return c && vinculadas().indexOf(c.cuentaId) >= 0 && q.saldoComprobante(c) > 0; });
        GA.ui.medio = 'siro';
      }
      var fcs = GA.ui.carro.map(q.comprobante);
      var total = fcs.reduce(function (s, c) { return s + q.saldoComprobante(c); }, 0);
      var meta = M('W-13', 'PAN-POR-40', '/app/pagar', 'por.pagos.crear', 'O5', 'Pagar', 'Pagar una o varias facturas con los medios habilitados.', 'C-SOC, C-REP con acción pagar');
      if (!fcs.length) return { meta: meta, volver: '/app/inicio', html: h1('Pagar') + GA.vacio('No tenés facturas para pagar', 'Estás al día con tus cuentas vinculadas.', '<a class="btn" href="#/app/inicio">Volver al inicio</a>') };
      return {
        meta: meta, volver: '/app/inicio',
        html: h1('Pagar') + '<h2 class="pwa-h2">Facturas a pagar</h2>' + fcs.map(function (c) {
          return '<div class="card card--fila"><div><strong class="mono">FC ' + c.letra + ' ' + c.numero + '</strong><br>Internet · Vence ' + c.vto1 + '<br><span class="mono">' + GA.ars(q.saldoComprobante(c)) + '</span></div><button type="button" class="btn btn--sm" data-act="quitarCarro" data-id="' + c.id + '">Quitar<span class="sr-only"> factura ' + c.numero + '</span></button></div>';
        }).join('') +
          '<dl class="dl-num"><dt>Recargos</dt><dd class="mono">' + GA.ars(0) + '</dd><dt class="total">Total</dt><dd class="mono total">' + GA.ars(total) + '</dd></dl>' +
          '<form data-form="pagar"><fieldset class="radios"><legend class="pwa-h2">Medio de pago</legend>' +
          '<label class="radio-tarjeta"><input type="radio" name="medio" value="siro" data-chg="medioPago"' + (GA.ui.medio === 'siro' ? ' checked' : '') + '> <span>Pagar online con SIRO<br><small>Botón de pago o QR</small></span></label>' +
          '<label class="radio-tarjeta"><input type="radio" name="medio" value="cupon" data-chg="medioPago"' + (GA.ui.medio === 'cupon' ? ' checked' : '') + '> <span>Cupón para pagar en efectivo</span></label></fieldset>' +
          '<p class="hint">También podés pagar con el código de tu factura en home banking o en redes de cobranza. Se imputa primero a la deuda más antigua.</p>' +
          '<p class="hint">Configuración de la piloto: una sola pasarela online, SIRO. Con otra cooperativa, la lista se arma con sus pasarelas habilitadas (DEC-015).</p>' +
          (GA.ui.medio === 'siro' ? '<p class="hint">Al pagar, en el producto se te redirige a SIRO; en el prototipo se simula.</p>' : '') +
          '<button type="submit" class="btn btn--pri btn--block" id="btn-pagar">' + (GA.ui.medio === 'siro' ? 'Pagar ' + GA.ars(total) : 'Generar cupón por ' + GA.ars(total)) + '</button></form>'
      };
    }
  });
  GA.acc.quitarCarro = function (el) { GA.ui.carro = GA.ui.carro.filter(function (id) { return id !== el.getAttribute('data-id'); }); GA.render(true); document.getElementById('h1').focus(); };
  GA.inp.medioPago = function (el) { GA.ui.medio = el.value; GA.render(true); };
  GA.form.pagar = function (f) {
    var btn = f.querySelector('#btn-pagar');
    if (btn.disabled) return;
    btn.disabled = true;
    btn.textContent = 'Procesando…';
    var fcs = GA.ui.carro.slice();
    var total = fcs.reduce(function (s, id) { return s + q.saldoComprobante(q.comprobante(id)); }, 0);
    if (GA.ui.medio === 'cupon') {
      GA.modal({
        titulo: 'Cupón de pago en efectivo', tam: 'sm', pwa: true,
        cuerpo: '<p>Total <strong class="mono">' + GA.ars(total) + '</strong> · Vence 10-11-2026</p><div class="barras" role="img" aria-label="Código de barras ficticio del cupón"></div><p class="mono hint">0000 0000 0000 0000 0000 0000 0000 (ficticio)</p><p class="hint">Presentalo en las redes de cobranza habilitadas.</p>',
        pie: '<button type="button" class="btn btn--pri btn--block" data-act="cerrarModal">Listo</button>'
      });
      btn.disabled = false;
      btn.textContent = 'Generar cupón por ' + GA.ars(total);
      return;
    }
    var id = 'CHK-' + GA.sig('checkout', 4);
    GA.e.checkouts.push({ id: id, importe: total, medio: 'SIRO', comprobantes: fcs, estado: 'pending', pasos: [['generated', GA.HOY.slice(0, 5) + ' ' + GA.hora()], ['pending', GA.HOY.slice(0, 5) + ' ' + GA.hora()]] });
    GA.guardar();
    setTimeout(function () { GA.ir('/app/pagos/' + id); }, 500);
  };

  /* ---------- W-13 Resultado del pago (PAN-POR-41) ---------- */
  var PASOS_PAGO = ['generated', 'pending', 'confirmed', 'imputed', 'sent'];
  GA.ruta('/app/pagos/:id', {
    app: 'socio', nav: 'inicio',
    render: function (p) {
      var ch = q.checkout(p.id);
      var meta = M('W-13', 'PAN-POR-41', '/app/pagos/' + p.id, 'por.pagos.crear', 'O5', 'Estado del pago', 'Seguir el estado real del pago hasta su imputación.', 'C-SOC, C-REP');
      if (!ch) return { meta: meta, volver: '/app/inicio', html: h1('Pago no encontrado') };
      var idx = PASOS_PAGO.indexOf(ch.estado);
      var texto = {
        pending: 'Estamos esperando la confirmación del medio de pago. Te avisaremos cuando se acredite.',
        confirmed: 'SIRO confirmó el pago. Lo estamos imputando a tus facturas.',
        imputed: 'El pago se imputó a tus facturas. Estamos enviando el comprobante.',
        sent: 'Listo. Te enviamos el recibo por email.',
        rejected: 'El pago fue rechazado por el medio de pago. No se debitó ningún importe.'
      }[ch.estado];
      return {
        meta: meta, volver: '/app/inicio',
        html: h1('Estado del pago', '<span class="mono">Pago N.º ' + ch.id + '</span> · <span class="mono">' + GA.ars(ch.importe) + '</span> · ' + ch.medio) +
          (ch.estado === 'rejected' ? '<p>' + GA.badge('checkout', 'rejected') + '</p>' :
            '<ol class="estados estados--pwa">' + PASOS_PAGO.map(function (e, i) {
              var h = ch.pasos.filter(function (x) { return x[0] === e; })[0];
              return '<li class="' + (i < idx ? 'hecho' : i === idx ? 'actual' : '') + '"' + (i === idx ? ' aria-current="step"' : '') + '><span>' + esc(GA.etiquetaEstado('checkout', e)) + (i === idx ? ' <em>(actual)</em>' : '') + '</span><span class="mono">' + (h ? h[1] : '') + '</span></li>';
            }).join('') + '</ol>') +
          '<p id="estado-pago" aria-live="polite">' + esc(texto) + '</p>' +
          (ch.estado === 'pending' ? '<div class="herr-proto" role="group" aria-label="Herramientas del prototipo"><p class="hint">Herramienta del prototipo (no existe en el producto): simulá la notificación que envía SIRO.</p><div class="fila-2"><button type="button" class="btn" data-act="notificarPago" data-r="ok">Simular aprobación</button><button type="button" class="btn" data-act="notificarPago" data-r="rechazo">Simular rechazo</button></div></div>' : '') +
          '<a class="btn btn--pri btn--block" href="#/app/inicio">Volver al inicio</a>' +
          (idx >= 2 ? '<button type="button" class="btn btn--block" data-act="descargarRecibo">Descargar recibo</button>' : '') +
          (ch.estado === 'rejected' ? '<a class="btn btn--block" href="#/app/pagar">Reintentar</a>' : '')
      };
    }
  });
  GA.acc.descargarRecibo = function () { GA.toast('Descarga del recibo simulada.', 'info'); };
  GA.acc.notificarPago = function (el) {
    var ch = q.checkout(GA.parseHash().path.split('/').pop());
    if (el.getAttribute('data-r') === 'rechazo') { ch.estado = 'rejected'; GA.mutar(); return; }
    var paso = function (estado, despues) {
      ch.estado = estado;
      ch.pasos.push([estado, GA.HOY.slice(0, 5) + ' ' + GA.hora()]);
      if (despues) despues();
      GA.mutar();
    };
    paso('confirmed');
    setTimeout(function () {
      paso('imputed', function () {
        var restante = ch.importe;
        var aplicados = [];
        ch.comprobantes.forEach(function (id) { var c = q.comprobante(id); var a = Math.min(restante, q.saldoComprobante(c)); if (a > 0) { c.pagado += a; restante -= a; aplicados.push(id); } });
        var cta = q.comprobante(ch.comprobantes[0]).cuentaId;
        GA.e.recibos.push({ id: 'RC-WEB-' + GA.sig('reciboWeb', 8), fecha: GA.HOY, cuentaId: cta, comprobantes: aplicados, medios: [{ medio: 'SIRO (online)', importe: ch.importe }], total: ch.importe, entregado: ch.importe, vuelto: 0, canal: 'App del socio · SIRO' });
        GA.e.historia.unshift({ fecha: GA.ahora(), titularId: q.cuenta(cta).titularId, texto: 'Pago online ' + ch.id + ' por ' + GA.ars(ch.importe) + ' imputado' });
      });
      setTimeout(function () { paso('sent'); }, 900);
    }, 900);
  };

  /* ---------- Historial de pagos (PAN-POR-42) ---------- */
  GA.ruta('/app/pagos', {
    app: 'socio', nav: 'inicio',
    render: function () {
      var rs = GA.e.recibos.filter(function (r) { return vinculadas().indexOf(r.cuentaId) >= 0; }).reverse();
      return {
        meta: M('—', 'PAN-POR-42', '/app/pagos', 'por.facturas.ver', 'O5', 'Historial de pagos', 'Historial de pagos de todos los canales.', 'C-SOC, C-REP'),
        volver: '/app/facturas',
        html: h1('Historial de pagos') + (rs.length ? rs.map(function (r) { return '<div class="card"><p><strong class="mono">' + GA.ars(r.total) + '</strong> · ' + r.fecha + '</p><p>' + esc(r.canal) + ' · Cta. ' + r.cuentaId + '</p><p class="mono hint">' + r.id + '</p></div>'; }).join('') : GA.vacio('Aún no registramos pagos', ''))
      };
    }
  });

  /* ---------- Gestiones (PAN-POR-50, PAN-POR-51 W-14, PAN-POR-33) ---------- */
  function listaGestiones(abrirModal) {
    var tab = GA.ui.gest || 'abiertas';
    var casos = q.casosDeCuentas(vinculadas()).slice().reverse();
    var lista = casos.filter(function (c) { return tab === 'abiertas' ? c.estado !== 'resuelto' : c.estado === 'resuelto'; });
    return {
      meta: abrirModal ? M('W-14', 'PAN-POR-51', '/app/gestiones/nueva', 'por.gestiones.crear', 'O2–O3', 'Nueva gestión', 'Iniciar un reclamo, consulta o trámite y obtener un número de seguimiento.', 'C-SOC, C-REP')
        : M('—', 'PAN-POR-50', '/app/gestiones', 'por.gestiones.crear', 'O2', 'Mis gestiones', 'Ver las gestiones abiertas y cerradas.', 'C-SOC, C-REP'),
      fab: { texto: 'Nueva gestión', act: 'nuevaGestion' },
      html: h1('Mis gestiones') + GA.pestanas('gest', [['abiertas', 'Abiertas'], ['cerradas', 'Cerradas']], tab, { label: 'Filtro de gestiones' }) +
        '<div id="panel-gest" role="tabpanel" aria-labelledby="tab-gest-' + tab + '">' +
        (lista.length ? lista.map(function (c) { return fila('/app/gestiones/' + c.id, '<span><strong>' + esc(c.asunto) + '</strong><br>' + GA.badge('casoSocio', c.estado) + '<br><span class="mono">N.º ' + c.id + '</span> · ' + esc(c.clase) + '</span>'); }).join('')
          : GA.vacio(tab === 'abiertas' ? 'No tenés gestiones abiertas' : 'No tenés gestiones cerradas', '', '<button type="button" class="btn btn--pri" data-act="nuevaGestion">Nueva gestión</button>')) + '</div>',
      despues: function () { if (abrirModal && !GA.ui.gestAbierta) { GA.ui.gestAbierta = true; GA.acc.nuevaGestion(); } }
    };
  }
  GA.ruta('/app/gestiones', { app: 'socio', nav: 'gestiones', render: function () { return listaGestiones(false); } });
  GA.ruta('/app/gestiones/nueva', { app: 'socio', nav: 'gestiones', render: function () { return listaGestiones(true); } });

  var MOTIVOS = { reclamo: ['Sin servicio de Internet', 'Lentitud intermitente', 'Problema con el equipo'], consulta: ['Consulta por factura', 'Cambio de plan', 'Otra consulta'], tramite: ['Cambio de titularidad', 'Baja del servicio'] };
  function formGestion(v, errores) {
    var err = function (id) { var e = errores.filter(function (x) { return x[0] === id; })[0]; return e && e[1]; };
    var contratos = [];
    vinculadas().forEach(function (id) { contratos = contratos.concat(q.contratosDe(id)); });
    return GA.resumenErrores(errores) + '<form id="form-gestion" data-form="gestion" novalidate>' +
      '<fieldset class="radios radios--fila"><legend>¿Qué querés hacer? <span class="req">(obligatorio)</span></legend>' +
      [['reclamo', 'Reclamo'], ['consulta', 'Consulta'], ['tramite', 'Trámite']].map(function (t) { return '<label class="check"><input type="radio" name="g-tipo" value="' + t[0] + '" data-chg="gTipo"' + (v.tipo === t[0] ? ' checked' : '') + '> ' + t[1] + '</label>'; }).join('') + '</fieldset>' +
      (v.tipo === 'tramite' ? '<p class="banda banda--info">' + GA.ico('info') + 'Los trámites usan un formulario configurable por la cooperativa (PAN-POR-32), no incluido en el prototipo.</p>' : '') +
      GA.campo({ id: 'g-serv', label: 'Servicio', type: 'select', value: v.contrato, req: true, opciones: contratos.map(function (k) { return [k.id, 'Internet · ' + k.id + ' · ' + k.domicilio.split(',')[0]]; }).concat([['', 'No sé cuál es / sin servicio']]) }) +
      GA.campo({ id: 'g-motivo', label: 'Motivo', type: 'select', value: v.motivo, req: true, opciones: MOTIVOS[v.tipo] }) +
      GA.campo({ id: 'g-texto', label: 'Contanos qué pasa', type: 'textarea', value: v.texto, req: true, err: err('g-texto'), rows: 4, attrs: 'maxlength="1000" data-inp="gContador"' }) +
      '<div class="fila-entre"><button type="button" class="btn btn--sm" data-act="noDisponible">Dictar</button><span id="g-cont" class="hint" aria-live="polite">' + (v.texto || '').length + '/1000</span></div>' +
      '<div class="campo"><label for="g-fotos">Fotos o archivos (opcional)</label><input id="g-fotos" type="file" accept="image/*,.pdf" multiple><p class="hint">En el prototipo los archivos no se suben.</p></div>' +
      '<fieldset class="radios"><legend>Ubicación (opcional)</legend><label class="check"><input type="radio" name="g-ubi" value="servicio" checked> Domicilio del servicio</label><label class="check"><input type="radio" name="g-ubi" value="otra"> Otra ubicación</label></fieldset></form>';
  }
  function abrirGestion(v, errores) {
    GA.ui.gForm = v;
    GA.modal({ titulo: 'Nueva gestión', tam: 'md', pwa: true, cuerpo: formGestion(v, errores || []), pie: '<button type="button" class="btn" data-act="cerrarModal">Cancelar</button><button type="submit" form="form-gestion" class="btn btn--pri">Enviar</button>' });
    if (errores && errores.length) document.getElementById('resumen-errores').focus();
  }
  GA.acc.nuevaGestion = function () {
    var pre = GA.preGestion || {};
    GA.preGestion = null;
    var contratos = [];
    vinculadas().forEach(function (id) { contratos = contratos.concat(q.contratosDe(id)); });
    var tipo = pre.tipo || 'reclamo';
    abrirGestion({ tipo: tipo, contrato: contratos[0] ? contratos[0].id : '', motivo: pre.motivo || MOTIVOS[tipo][0], texto: pre.texto || '' });
  };
  function leerGestion() {
    var f = document.getElementById('form-gestion');
    return { tipo: f.querySelector('input[name="g-tipo"]:checked').value, contrato: f.querySelector('#g-serv').value, motivo: f.querySelector('#g-motivo').value, texto: f.querySelector('#g-texto').value };
  }
  GA.inp.gTipo = function () { var v = leerGestion(); v.motivo = MOTIVOS[v.tipo][0]; abrirGestion(v); var r = document.querySelector('input[name="g-tipo"]:checked'); if (r) r.focus(); };
  GA.inp.gContador = function (el) { var n = el.value.length; var c = document.getElementById('g-cont'); c.textContent = n + '/1000'; c.setAttribute('aria-live', n > 900 ? 'polite' : 'off'); };
  GA.form.gestion = function () {
    var v = leerGestion();
    var e = [];
    if (!v.texto.trim()) e.push(['g-texto', 'Contanos qué pasa para que podamos ayudarte.']);
    if (e.length) { abrirGestion(v, e); return; }
    var k = v.contrato ? q.contrato(v.contrato) : null;
    var id = '2026-' + GA.sig('caso', 6);
    GA.e.casos.push({ id: id, clase: v.tipo === 'tramite' ? 'solicitud' : v.tipo, prioridad: 'normal', asunto: v.motivo, cuentaId: k ? k.cuentaId : vinculadas()[0], contratoId: k ? k.id : null, estado: 'recibido', canal: 'app', vence: '06-11-2026 17:00', responsable: 'Sin asignar', otId: null, area: v.tipo === 'reclamo' ? 'Técnica' : 'Comercial', aIdentificar: !k, linea: [{ fecha: GA.ahora(), autor: 'Socio (app)', texto: v.texto.trim(), tipo: 'mensaje' }] });
    GA.guardar();
    var nombre = v.tipo === 'reclamo' ? 'reclamo' : v.tipo === 'consulta' ? 'consulta' : 'trámite';
    GA.modal({
      titulo: 'Recibimos tu ' + nombre, tam: 'sm', pwa: true,
      cuerpo: '<p><span class="mono">N.º ' + id + '</span> ' + GA.badge('casoSocio', 'recibido') + '</p><p>Te avisaremos cada cambio de estado.</p>',
      pie: '<a class="btn btn--pri" href="#/app/gestiones/' + id + '" data-act="cerrarModal" autofocus>Ver seguimiento</a><a class="btn" href="#/app/inicio" data-act="cerrarModal">Volver al inicio</a>'
    });
  };

  GA.ruta('/app/gestiones/:id', {
    app: 'socio', nav: 'gestiones',
    render: function (p) {
      var c = q.caso(p.id);
      var meta = M('—', 'PAN-POR-33', '/app/gestiones/' + p.id, 'por.gestiones.crear', 'O2', 'Seguimiento de gestión', 'Seguir el estado, los mensajes y la OT vinculada de una gestión.', 'C-SOC, C-REP');
      if (!c || vinculadas().indexOf(c.cuentaId) < 0) return { meta: meta, volver: '/app/gestiones', html: h1('Gestión no disponible') };
      var ot = c.otId ? q.ot(c.otId) : null;
      return {
        meta: meta, volver: '/app/gestiones', fab: { texto: 'Nueva gestión', act: 'nuevaGestion' },
        html: h1(c.asunto, '<span class="mono">N.º ' + c.id + '</span> · ' + esc(c.clase)) + '<p>' + GA.badge('casoSocio', c.estado) + '</p>' +
          (ot ? '<div class="card"><p>Visita técnica: <span class="mono">' + esc(ot.visita) + '</span></p><p>' + GA.badge('ot', ot.estado) + '</p></div>' : '') +
          '<h2 class="pwa-h2">Línea de tiempo</h2><ol class="timeline">' + c.linea.filter(function (l) { return l.tipo !== 'nota'; }).map(function (l) {
            return '<li><span class="timeline__f">' + esc(l.fecha) + ' · ' + esc(l.autor.indexOf('Socio') === 0 ? 'Vos' : l.tipo === 'sistema' ? 'Cooperativa' : 'Cooperativa (' + l.autor + ')') + '</span>' + esc(l.texto) + '</li>';
          }).join('') + '</ol>' +
          (c.estado !== 'resuelto' ? '<form data-form="mensajeSocio" novalidate>' + GA.campo({ id: 'ms-txt', label: 'Enviar un mensaje', type: 'textarea', rows: 2, attrs: 'maxlength="1000"' }) + '<button type="submit" class="btn btn--block">Enviar mensaje</button></form>' : '<p class="hint">La gestión está resuelta. Si el problema sigue, podés iniciar una nueva.</p>')
      };
    }
  });
  GA.form.mensajeSocio = function (f) {
    var t = f.querySelector('#ms-txt').value.trim();
    if (!t) { GA.toast('Escribí el mensaje.', 'bad'); return; }
    var c = q.caso(GA.parseHash().path.split('/').pop());
    c.linea.push({ fecha: GA.ahora(), autor: 'Socio (app)', texto: t, tipo: 'mensaje' });
    if (c.estado === 'esperaSocio') c.estado = 'enCurso';
    GA.toast('Mensaje enviado.');
    GA.mutar();
  };

  /* ---------- Fuera de alcance ---------- */
  GA.ruta('/app/contratar', {
    app: 'socio', nav: 'servicios',
    render: function () {
      return {
        meta: M('—', 'PAN-POR-31', '/app/contratar', 'por.servicios.contratar', 'O2', 'Contratar', 'Catálogo de servicios con planes para contratar desde la app.', 'C-SOC, C-VIS'),
        volver: '/app/inicio',
        html: h1('Contratar un servicio') + GA.e.planes.map(function (p) {
          return '<div class="card"><h2 class="card__t">Internet · ' + esc(p.nombre) + '</h2><p>' + esc(p.velocidad) + ' · Abono <span class="mono">' + GA.ars(p.abono) + '</span> · Instalación <span class="mono">' + GA.ars(p.instalacion) + '</span></p><a class="btn btn--pri btn--block" href="#/app/contratar/solicitar?plan=' + p.id + '">Solicitar este plan</a></div>';
        }).join('') +
          '<p class="hint">La cooperativa confirma requisitos y agenda la instalación. El seguimiento lo ves en Mis gestiones.</p>'
      };
    }
  });
  GA.ruta('/app/contratar/solicitar', {
    app: 'socio', nav: 'servicios',
    render: function (p, query) {
      var planId = query.plan || 'FIB100';
      var pl = q.plan(planId) || GA.e.planes[0];
      var cuentas = vinculadas();
      var meta = M('—', 'PAN-POR-32', '/app/contratar/solicitar', 'por.servicios.contratar', 'O2', 'Solicitar contratación', 'Iniciar una solicitud de alta de Internet desde la app del socio.', 'C-SOC');
      var opts = cuentas.map(function (id) { return [id, 'Cuenta ' + id + ' · ' + q.cuenta(id).domicilio]; });
      return {
        meta: meta,
        volver: '/app/contratar',
        html: h1('Solicitar Internet') + '<p>Plan: <strong>' + esc(pl.nombre) + '</strong> (' + esc(pl.velocidad) + ')</p>' +
          (opts.length ? '<form data-form="solicitudContrato" novalidate>' +
            GA.campo({ id: 'sol-cuenta', label: 'Cuenta donde contratar', type: 'select', value: opts[0][0], req: true, opciones: opts, attrs: 'autofocus' }) +
            GA.campo({ id: 'sol-dom', label: 'Domicilio del servicio', type: 'textarea', rows: 2, value: q.cuenta(opts[0][0]).domicilio, req: true, hint: 'Si es otro domicilio, podés editarlo acá.' }) +
            '<label class="check"><input type="checkbox" name="sol-acepta" required> Leí y acepto las condiciones del servicio</label>' +
            '<button type="submit" class="btn btn--pri btn--block">Enviar solicitud</button></form>'
            : GA.vacio('Necesitás vincular una cuenta', 'Antes de contratar, vinculá la cuenta donde querés el servicio.', '<a class="btn btn--pri" href="#/app/cuentas/vincular">Vincular cuenta</a>'))
      };
    }
  });
  GA.form.solicitudContrato = function (f) {
    if (!f.querySelector('[name="sol-acepta"]').checked) { GA.toast('Tenés que aceptar las condiciones.', 'bad'); return; }
    var cuentaId = f.querySelector('#sol-cuenta').value;
    var dom = f.querySelector('#sol-dom').value.trim();
    if (!dom) { GA.toast('Ingresá el domicilio del servicio.', 'bad'); return; }
    var planId = (GA.parseHash().query.plan) || 'FIB100';
    var pl = q.plan(planId) || GA.e.planes[0];
    var kid = 'INT-' + GA.sig('contrato', 4);
    var casoId = '2026-' + GA.sig('caso', 6);
    GA.e.contratos.push({ id: kid, cuentaId: cuentaId, planId: planId, categoria: 'Residencial', estado: 'requested', domicilio: dom, casoId: casoId, otId: null, equipo: 'ONT (a asignar)', origen: 'App del socio', alta: GA.HOY });
    GA.e.casos.push({ id: casoId, clase: 'solicitud', prioridad: 'normal', asunto: 'Alta de Internet · ' + pl.nombre + ' (desde la app)', cuentaId: cuentaId, contratoId: kid, estado: 'recibido', canal: 'app', vence: '12-11-2026 17:00', responsable: 'Sin asignar', otId: null, area: 'Comercial', linea: [{ fecha: GA.ahora(), autor: 'Socio Ejemplo', texto: 'Solicitud enviada desde la app del socio.', tipo: 'mensaje' }, { fecha: GA.ahora(), autor: 'Sistema', texto: 'Contrato ' + kid + ' en estado Solicitado.', tipo: 'sistema' }] });
    GA.e.historia.unshift({ fecha: GA.ahora(), titularId: q.cuenta(cuentaId).titularId, texto: 'Solicitud de contrato ' + kid + ' desde la app' });
    GA.toast('Solicitud enviada. N.º de gestión ' + casoId + '.');
    GA.ir('/app/gestiones/' + casoId);
  };
  GA.ruta('/app/comunidad', {
    app: 'socio', nav: 'comunidad',
    render: function () {
      return { meta: M('—', 'Comunidad (M17/T09)', '/app/comunidad', 'por.portal.ver', 'Fuera del piloto O0–O5', 'Comunidad', 'Muro, novedades y encuestas.', 'C-SOC'), html: h1('Comunidad') + GA.vacio('Fuera del alcance del prototipo', 'El muro, las novedades y las encuestas no forman parte de las pantallas del piloto.') };
    }
  });
})(window.GA);
