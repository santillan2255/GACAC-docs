/* Admin: tablero, titulares (W-02, W-03), alta de persona y cuenta, alta de contrato (W-04) y servicio (W-10). */
'use strict';

(function (GA) {
  var esc = GA.esc;
  var q = GA.q;

  function M(w, pan, ruta, cap, ola, titulo, proposito, roles) {
    return { w: w, pan: pan, ruta: ruta, cap: cap, ola: ola, titulo: titulo, proposito: proposito, roles: roles };
  }
  GA.M = M;

  /* ---------- Tablero (W-02, SM-ADM-001) ---------- */
  GA.ruta('/admin/inicio', {
    app: 'admin', nav: 'tablero',
    render: function () {
      var meta = M('W-02', 'AdminShell (sin PAN propio) · tablero BIA-10', '/admin/inicio → /admin/tableros/:code', 'bia.tableros.ver', 'O0–O1', 'Tablero', 'Marco común del admin y tablero de inicio del rol.', 'Todo el personal');
      if (GA.e.sesion.tenant === 'dos') {
        return { meta: meta, html: GA.cabecera({ migas: ['Inicio', 'Tablero'], titulo: 'Tablero', subtitulo: 'Cooperativa Ejemplo Dos' }) + '<div class="pag">' + GA.vacio('Esta cooperativa no tiene datos en el prototipo', 'Cada cooperativa ve solo sus propios datos (aislamiento por tenant).', '<button type="button" class="btn btn--pri" data-act="cambiarEspacio">Cambiar de espacio</button>') + '</div>' };
      }
      var abiertos = GA.e.casos.filter(function (c) { return c.estado !== 'resuelto'; }).length;
      var vencidos = GA.e.casos.filter(function (c) { return c.vencido && c.estado !== 'resuelto'; }).length;
      var lote = q.lote('LOT-2026-11-INT');
      var kpi = function (t, v, extra, href) { return '<a class="kpi" href="#' + href + '"><span class="kpi__t">' + esc(t) + '</span><span class="kpi__v">' + esc(v) + '</span>' + (extra || '') + '</a>'; };
      return {
        meta: meta,
        html: GA.cabecera({ migas: ['Inicio', 'Tablero'], titulo: 'Tablero', subtitulo: 'Cooperativa Ejemplo · Sucursal Centro · ' + GA.HOY }) +
          '<div class="pag"><div class="kpis">' +
          kpi('Titulares activos', String(GA.e.titulares.length), '', '/admin/per/titulares') +
          kpi('Casos abiertos', String(abiertos), vencidos ? GA.badgeTono('bad', vencidos + ' vencido' + (vencidos > 1 ? 's' : '')) : '', '/admin/crm/bandeja') +
          kpi('Lote 11-2026', GA.etiquetaEstado('lote', lote.estado), GA.badge('lote', lote.estado), '/admin/fac/lotes/' + lote.id) +
          kpi('Caja 01', GA.e.caja.abierta ? 'Abierta' : 'Cerrada', GA.badge('caja', GA.e.caja.abierta ? 'abierta' : 'cerrada'), '/admin/cob/caja/apertura') +
          '</div><section class="panel"><h2>Accesos frecuentes</h2><ul class="accesos">' +
          [['/admin/per/titulares', 'Buscar o dar de alta un titular'], ['/admin/cat/services/INT', 'Configuración del servicio Internet'], ['/admin/fac/lotes/LOT-2026-11-INT', 'Revisar el lote de facturación 11-2026'], ['/admin/cob/caja/cobro', 'Cobrar en ventanilla'], ['/admin/crm/bandeja?clase=reclamo', 'Ver reclamos'], ['/admin/tec/work-orders', 'Órdenes de trabajo']]
            .map(function (a) { return '<li><a href="#' + a[0] + '">' + esc(a[1]) + GA.ico('chevron') + '</a></li>'; }).join('') +
          '</ul></section></div>'
      };
    }
  });

  /* ---------- Búsqueda de titulares (W-02 contenido, PAN-PER-01) ---------- */
  GA.ruta('/admin/per/titulares', {
    app: 'admin', nav: 'titulares',
    render: function (p, query) {
      var f = GA.ui.tit || { q: '', estado: 'activo' };
      var t = f.q.trim().toLowerCase();
      var filas = GA.e.titulares.filter(function (ti) {
        if (f.estado !== 'todos' && ti.estado !== f.estado) return false;
        if (!t) return true;
        var per = q.persona(ti.personaId);
        var cuentas = q.cuentasDe(ti.id);
        var txt = [q.nombre(per), per.dni, per.cuit, per.cuit.replace(/-/g, ''), ti.id].concat(cuentas.map(function (c) { return c.id + ' ' + c.domicilio; })).join(' ').toLowerCase();
        return txt.indexOf(t) >= 0;
      });
      var cuerpo = filas.length ? '<div class="tabla-cont"><table class="tabla"><caption class="sr-only">Titulares encontrados</caption><thead><tr><th scope="col">N.º</th><th scope="col">Nombre</th><th scope="col">Documento</th><th scope="col">Cuentas</th><th scope="col">Estado</th><th scope="col" class="num">Saldo (ARS)</th></tr></thead><tbody>' +
        filas.map(function (ti) {
          var per = q.persona(ti.personaId);
          var cuentas = q.cuentasDe(ti.id);
          var saldo = cuentas.reduce(function (s, c) { return s + q.saldoCuenta(c.id); }, 0);
          return '<tr><td class="mono">' + ti.id + '</td><td><a href="#/admin/per/titulares/' + ti.id + '">' + esc(q.nombre(per)) + '</a></td><td class="mono">' + (per.dni ? 'DNI ****' + per.dni.slice(-4) : 'CUIT ' + esc(per.cuit)) + '</td><td class="mono">' + cuentas.map(function (c) { return c.id; }).join(', ') + '</td><td>' + GA.badge('titular', ti.estado) + '</td><td class="num mono">' + GA.num(saldo) + '</td></tr>';
        }).join('') + '</tbody></table></div><p class="pie-tabla">' + filas.length + ' resultado' + (filas.length === 1 ? '' : 's') + ' · 25 por página</p>'
        : GA.vacio('No encontramos coincidencias', 'Probá buscar por DNI, CUIT o número de cuenta.', '<button type="button" class="btn" data-act="limpiarTit">Limpiar búsqueda</button>');
      return {
        meta: M('W-02', 'PAN-PER-01', '/admin/per/titulares', 'per.titulares.ver', 'O2', 'Titulares', 'Búsqueda de titulares y cuentas.', 'T-ATE, T-SAT, T-FAC, T-GER'),
        html: GA.cabecera({
          migas: ['Socios y cuentas', 'Personas y titulares', 'Titulares'], titulo: 'Titulares', subtitulo: 'Búsqueda de titulares y cuentas',
          acciones: '<button type="button" class="btn btn--pri" data-act="altaPersona">Nuevo titular</button><button type="button" class="btn" data-act="noDisponible">Exportar</button>'
        }) +
          '<div class="pag"><p class="ayuda-pag"><a href="#" data-act="ayuda">¿Qué es esta pantalla?</a></p>' +
          '<form class="filtros" data-form="buscarTit" role="search"><div class="campo campo--crece"><label for="tit-q">Buscar por nombre, DNI, CUIT, cuenta o domicilio</label><input id="tit-q" type="search" value="' + esc(f.q) + '"></div>' +
          GA.campo({ id: 'tit-estado', label: 'Estado', type: 'select', value: f.estado, opciones: [['activo', 'Activos'], ['todos', 'Todos']] }) +
          '<button type="submit" class="btn">Buscar</button></form>' + cuerpo + '</div>',
        despues: function () { if (query.alta === '1' && !GA.ui.altaAbierta) { GA.ui.altaAbierta = true; GA.acc.altaPersona(); } }
      };
    }
  });
  GA.form.buscarTit = function (f) {
    GA.ui.tit = { q: f.querySelector('#tit-q').value, estado: f.querySelector('#tit-estado').value };
    GA.render(true);
  };
  GA.acc.limpiarTit = function () { GA.ui.tit = { q: '', estado: 'activo' }; GA.render(true); };

  /* ---------- Alta de persona, titular y cuenta (PAN-PER-04 modal lg + PAN-PER-05) ---------- */
  function formPersona(v, errores) {
    v = v || { tipo: 'fisica', condIva: 'Consumidor final', mismo: true, entrega: 'Electrónica', asociado: true };
    var err = function (id) { var e = errores.filter(function (x) { return x[0] === id; })[0]; return e && e[1]; };
    var fis = v.tipo !== 'juridica';
    return GA.resumenErrores(errores) + '<form id="form-persona" data-form="altaPersona" novalidate>' +
      '<fieldset class="radios radios--fila"><legend>Tipo de persona</legend>' +
      '<label class="check"><input type="radio" name="tipo" value="fisica" data-chg="tipoPersona"' + (fis ? ' checked' : '') + '> Persona humana</label>' +
      '<label class="check"><input type="radio" name="tipo" value="juridica" data-chg="tipoPersona"' + (!fis ? ' checked' : '') + '> Persona jurídica</label></fieldset>' +
      '<div class="grilla-2" id="bloque-fisica"' + (fis ? '' : ' hidden') + '>' +
      GA.campo({ id: 'pe-nombre', label: 'Nombre', value: v.nombre, req: true, auto: 'given-name', err: err('pe-nombre'), attrs: 'autofocus' }) +
      GA.campo({ id: 'pe-apellido', label: 'Apellido', value: v.apellido, req: true, auto: 'family-name', err: err('pe-apellido') }) +
      GA.campo({ id: 'pe-dni', label: 'DNI', value: v.dni, req: true, hint: 'DNI sin puntos', err: err('pe-dni'), attrs: 'inputmode="numeric"' }) +
      '</div><div id="bloque-juridica"' + (fis ? ' hidden' : '') + '>' +
      GA.campo({ id: 'pe-razon', label: 'Razón social', value: v.razon, req: true, auto: 'organization', err: err('pe-razon') }) + '</div>' +
      '<div class="grilla-2">' +
      GA.campo({ id: 'pe-cuit', label: 'CUIT o CUIL', value: v.cuit, req: true, hint: 'CUIT con guiones, por ejemplo 20-00000000-1', err: err('pe-cuit') }) +
      GA.campo({ id: 'pe-iva', label: 'Condición frente al IVA', type: 'select', value: v.condIva, opciones: ['Consumidor final', 'Responsable inscripto', 'Monotributo', 'Exento'] }) +
      GA.campo({ id: 'pe-email', label: 'Email', type: 'email', value: v.email, auto: 'email', err: err('pe-email') }) +
      GA.campo({ id: 'pe-tel', label: 'Teléfono', type: 'tel', value: v.telefono, auto: 'tel' }) +
      GA.campo({ id: 'pe-dom', label: 'Domicilio (calle y altura)', value: v.domicilio, req: true, auto: 'street-address', err: err('pe-dom') }) +
      GA.campo({ id: 'pe-loc', label: 'Localidad', value: v.localidad || 'Villa Ejemplo', req: true, auto: 'address-level2', err: err('pe-loc') }) +
      '</div><h3 class="sub-form">Titular y cuenta</h3>' +
      '<label class="check"><input type="checkbox" id="pe-asociado"' + (v.asociado ? ' checked' : '') + '> Es asociado de la cooperativa</label>' +
      '<label class="check"><input type="checkbox" id="pe-mismo" data-chg="domMismo"' + (v.mismo ? ' checked' : '') + '> La cuenta usa el mismo domicilio de la persona</label>' +
      '<div id="bloque-domcta"' + (v.mismo ? ' hidden' : '') + '>' + GA.campo({ id: 'pe-domcta', label: 'Domicilio de la cuenta', value: v.domcta, req: true, err: err('pe-domcta') }) + '</div>' +
      GA.campo({ id: 'pe-entrega', label: 'Entrega de facturas', type: 'select', value: v.entrega, opciones: ['Electrónica', 'Papel'] }) +
      '</form>';
  }
  function abrirAltaPersona(v, errores) {
    GA.modal({
      titulo: 'Nuevo titular', tam: 'lg', cuerpo: formPersona(v, errores || []),
      pie: '<button type="button" class="btn" data-act="cerrarModal">Cancelar</button><button type="submit" form="form-persona" class="btn btn--pri">Crear titular y cuenta</button>'
    });
    if (errores && errores.length) document.getElementById('resumen-errores').focus();
  }
  GA.acc.altaPersona = function () { abrirAltaPersona(null, []); };
  GA.inp.tipoPersona = function (el) {
    var fis = el.value === 'fisica';
    document.getElementById('bloque-fisica').hidden = !fis;
    document.getElementById('bloque-juridica').hidden = fis;
  };
  GA.inp.domMismo = function (el) { document.getElementById('bloque-domcta').hidden = el.checked; };

  GA.form.altaPersona = function (f) {
    var val = function (id) { var e = f.querySelector('#' + id); return e ? e.value.trim() : ''; };
    var v = {
      tipo: f.querySelector('input[name="tipo"]:checked').value, nombre: val('pe-nombre'), apellido: val('pe-apellido'), dni: val('pe-dni'), razon: val('pe-razon'),
      cuit: val('pe-cuit'), condIva: val('pe-iva'), email: val('pe-email'), telefono: val('pe-tel'), domicilio: val('pe-dom'), localidad: val('pe-loc'),
      asociado: f.querySelector('#pe-asociado').checked, mismo: f.querySelector('#pe-mismo').checked, domcta: val('pe-domcta'), entrega: val('pe-entrega')
    };
    var e = [];
    if (v.tipo === 'fisica') {
      if (!v.nombre) e.push(['pe-nombre', 'Ingresá el nombre.']);
      if (!v.apellido) e.push(['pe-apellido', 'Ingresá el apellido.']);
      if (!/^\d{7,8}$/.test(v.dni)) e.push(['pe-dni', 'El DNI tiene 7 u 8 números, sin puntos.']);
      else if (GA.e.personas.some(function (p) { return p.dni === v.dni.padStart(8, '0'); })) e.push(['pe-dni', 'Ya existe una persona con ese DNI. Buscala en Titulares.']);
    } else if (!v.razon) e.push(['pe-razon', 'Ingresá la razón social.']);
    var ec = GA.validarCuit(v.cuit);
    if (ec === 'formato') e.push(['pe-cuit', 'Escribí el CUIT con guiones: 2 números, guion, 8 números, guion y 1 número.']);
    else if (ec === 'dv') e.push(['pe-cuit', 'El dígito verificador del CUIT no es correcto.']);
    else if (GA.e.personas.some(function (p) { return p.cuit === v.cuit; })) e.push(['pe-cuit', 'Ya existe una persona con ese CUIT.']);
    else if (v.tipo === 'fisica' && /^\d{7,8}$/.test(v.dni) && v.cuit.split('-')[1] !== v.dni.padStart(8, '0')) e.push(['pe-cuit', 'El CUIT no corresponde al DNI ingresado.']);
    if (v.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.email)) e.push(['pe-email', 'Revisá el formato del email.']);
    if (!v.domicilio) e.push(['pe-dom', 'Ingresá el domicilio.']);
    if (!v.localidad) e.push(['pe-loc', 'Ingresá la localidad.']);
    if (!v.mismo && !v.domcta) e.push(['pe-domcta', 'Ingresá el domicilio de la cuenta.']);
    if (e.length) { abrirAltaPersona(v, e); return; }

    var pid = 'P-' + GA.sig('persona', 4);
    GA.e.personas.push({ id: pid, tipo: v.tipo, nombre: v.nombre, apellido: v.apellido, razon: v.razon, dni: v.tipo === 'fisica' ? v.dni.padStart(8, '0') : '', cuit: v.cuit, condIva: v.condIva, email: v.email, telefono: v.telefono, domicilio: v.domicilio, localidad: v.localidad, verificado: false });
    var tid = GA.sig('titular', 6);
    GA.e.titulares.push({ id: tid, personaId: pid, estado: 'activo', asociado: v.asociado, alta: GA.HOY });
    var cid = GA.sig('cuenta', 4);
    GA.e.cuentas.push({ id: cid, titularId: tid, domicilio: (v.mismo ? v.domicilio : v.domcta) + ', ' + v.localidad, principal: true, entrega: v.entrega, grupo: 'General' });
    GA.e.historia.unshift({ fecha: GA.ahora(), titularId: tid, texto: 'Titular ' + tid + ' y cuenta ' + cid + ' creados por ' + GA.e.sesion.usuario });
    GA.guardar();
    GA.cerrarModal();
    GA.toast('Titular ' + tid + ' y cuenta ' + cid + ' creados.');
    GA.ir('/admin/per/titulares/' + tid);
  };

  /* ---------- Ficha 360 del titular (W-03, PAN-PER-02) ---------- */
  GA.ruta('/admin/per/titulares/:id', {
    app: 'admin', nav: 'titulares',
    render: function (p, query) {
      var ti = q.titular(p.id);
      var meta = M('W-03', 'PAN-PER-02', '/admin/per/titulares/' + p.id, 'per.titulares.ver', 'O2 (persona, cuentas, contratos); O3–O5 (pestañas)', 'Ficha del titular', 'Ver en un solo lugar al titular, sus cuentas, grupos de facturación y contratos.', 'T-ATE, T-SAT, T-FAC, T-CAJ (lectura), T-GER');
      if (!ti) return { meta: meta, html: GA.cabecera({ migas: [['Titulares', '/admin/per/titulares']], titulo: 'Titular no encontrado' }) + '<div class="pag">' + GA.vacio('No existe el titular ' + p.id, '', '<a class="btn" href="#/admin/per/titulares">Volver a Titulares</a>') + '</div>' };
      var per = q.persona(ti.personaId);
      var cuentas = q.cuentasDe(ti.id);
      var tab = GA.ui.ficha || query.tab || 'cuentas';
      var saldo = cuentas.reduce(function (s, c) { return s + q.saldoCuenta(c.id); }, 0);
      var tabs = [['resumen', 'Resumen'], ['cuentas', 'Cuentas y contratos'], ['cc', 'Cuenta corriente'], ['facturas', 'Facturas'], ['reclamos', 'Reclamos y OT'], ['historia', 'Historia']];
      var panel = { resumen: tabResumen, cuentas: tabCuentas, cc: tabCC, facturas: tabFacturas, reclamos: tabReclamos, historia: tabHistoria }[tab](ti, per, cuentas);
      var historia = GA.e.historia.filter(function (h) { return h.titularId === ti.id; }).slice(0, 3);
      meta.titulo = q.nombre(per);
      return {
        meta: meta,
        html: GA.cabecera({
          migas: ['Socios y cuentas', ['Titulares', '/admin/per/titulares'], q.nombre(per)], titulo: q.nombre(per),
          extra: '<p class="cab-pag__datos"><span class="mono">Titular N.º ' + ti.id + '</span> ' + GA.badge('titular', ti.estado) + ' <span>Asociado: ' + (ti.asociado ? 'Sí' : 'No') + '</span></p>' +
            '<p class="cab-pag__datos">' + (per.dni ? 'DNI <span class="mono">' + per.dni + '</span> ' + GA.badgeTono(per.verificado ? 'ok' : 'warn', per.verificado ? 'Verificado' : 'Sin verificar') + ' · ' : '') + 'CUIT <span class="mono">' + esc(per.cuit) + '</span> · ' + esc(per.condIva) + '</p>' +
            '<p class="chips" aria-label="Alertas del titular">' + GA.badgeTono('ok', 'Sin bloqueos') + GA.badgeTono(per.verificado ? 'ok' : 'warn', per.verificado ? 'Documentación al día' : 'Documentación a verificar') + GA.badgeTono(per.email ? 'ok' : 'warn', per.email ? 'Contacto verificado' : 'Sin contacto verificado') + '</p>',
          acciones: '<button type="button" class="btn btn--pri" data-act="nuevaCuenta" data-tit="' + ti.id + '">Nueva cuenta</button><button type="button" class="btn" data-act="noDisponible">Editar</button><button type="button" class="btn" data-act="nuevaNota" data-tit="' + ti.id + '">Nueva nota</button>'
        }) +
          '<div class="pag">' + GA.pestanas('ficha', tabs, tab, { accion: 'tabFicha', label: 'Secciones de la ficha' }) +
          '<div class="ficha-cuerpo"><div id="panel-ficha" role="tabpanel" aria-labelledby="tab-ficha-' + tab + '" class="ficha-panel">' + panel + '</div>' +
          '<aside class="panel lateral" aria-labelledby="t-act"><h2 id="t-act">Actividad reciente</h2><ol class="timeline">' +
          (historia.length ? historia.map(function (h) { return '<li><span class="timeline__f">' + esc(h.fecha) + '</span>' + esc(h.texto) + '</li>'; }).join('') : '<li>Sin actividad.</li>') +
          '</ol><button type="button" class="btn btn--sm" data-act="tabFicha" data-valor="historia">Ver historia</button></aside></div>' +
          '<div class="pie-saldo"><span>Saldo total (solo lectura, M07): <strong class="mono">' + GA.ars(saldo) + '</strong></span>' +
          (cuentas.length ? '<a class="btn" href="#/admin/cob/caja/cobro?cuenta=' + cuentas[0].id + '">Cobrar en caja</a>' : '') + '</div></div>'
      };
    }
  });
  GA.acc.tabFicha = function (el) { GA.ui.ficha = el.getAttribute('data-valor'); GA.render(true); var t = document.getElementById('tab-ficha-' + GA.ui.ficha); if (t) t.focus(); };

  function tabResumen(ti, per, cuentas) {
    var contratos = [];
    cuentas.forEach(function (c) { contratos = contratos.concat(q.contratosDe(c.id)); });
    return '<dl class="dl dl--2"><dt>Email</dt><dd>' + esc(per.email || '—') + '</dd><dt>Teléfono</dt><dd>' + esc(per.telefono || '—') + '</dd><dt>Domicilio</dt><dd>' + esc(per.domicilio + ', ' + per.localidad) + '</dd>' +
      '<dt>Titular desde</dt><dd>' + esc(ti.alta) + '</dd><dt>Cuentas</dt><dd>' + cuentas.length + '</dd><dt>Contratos</dt><dd>' + contratos.length + '</dd></dl>';
  }

  function tarjetaContrato(k) {
    var pl = q.plan(k.planId);
    return '<div class="contrato"><div class="contrato__cab"><strong class="mono">' + k.id + '</strong> · Internet · ' + esc(pl.nombre) + ' ' + GA.badge('contrato', k.estado) + '</div>' +
      '<p>Domicilio del servicio: ' + esc(k.domicilio) + '</p><p>Categoría: ' + esc(k.categoria) + ' · Equipo: ' + esc(k.equipo) + '</p>' +
      '<p>' + (k.casoId ? 'Caso: <a href="#/admin/crm/casos/' + k.casoId + '">' + k.casoId + '</a>' : 'Sin caso') + (k.otId ? ' · OT: <a href="#/admin/tec/work-orders/' + k.otId + '">' + k.otId + '</a>' : '') + '</p>' +
      '<div class="acciones"><button type="button" class="btn btn--sm" data-act="verContrato" data-id="' + k.id + '">Ver contrato</button><button type="button" class="btn btn--sm" data-act="noDisponible">Acciones ▾</button></div></div>';
  }

  function tabCuentas(ti, per, cuentas) {
    if (!cuentas.length) return GA.vacio('El titular no tiene cuentas', '', '<button type="button" class="btn btn--pri" data-act="nuevaCuenta" data-tit="' + ti.id + '">Nueva cuenta</button>');
    return cuentas.map(function (c) {
      var ks = q.contratosDe(c.id);
      return '<details class="cuenta" open><summary><span class="mono">Cta. ' + c.id + '</span>' + (c.principal ? ' (principal)' : '') + ' · ' + esc(c.domicilio) + (ks.length ? '' : ' · Sin contratos activos') + '</summary>' +
        '<p class="hint">Entrega de facturas: ' + esc(c.entrega) + ' · Grupo de facturación: ' + esc(c.grupo) + '</p>' +
        (ks.length ? ks.map(tarjetaContrato).join('') : '<p>Esta cuenta no tiene contratos.</p>') +
        '<a class="btn btn--sm" href="#/admin/cat/contracts/new?cuenta=' + c.id + '">+ Nuevo contrato</a></details>';
    }).join('');
  }

  GA.movimientos = function (cuentaIds) {
    var mov = [];
    GA.e.comprobantes.forEach(function (c) { if (cuentaIds.indexOf(c.cuentaId) >= 0) mov.push({ fecha: c.fecha, desc: c.tipo + ' ' + c.letra + ' ' + c.numero + ' · período ' + c.periodo, cuenta: c.cuentaId, debe: c.total, haber: 0 }); });
    GA.e.recibos.forEach(function (r) { if (cuentaIds.indexOf(r.cuentaId) >= 0) mov.push({ fecha: r.fecha, desc: 'Recibo ' + r.id + ' · ' + r.canal, cuenta: r.cuentaId, debe: 0, haber: r.total }); });
    var conv = function (f) { var x = f.split('-'); return x[2] + x[1] + x[0]; };
    mov.sort(function (a, b) { return conv(a.fecha) < conv(b.fecha) ? -1 : conv(a.fecha) > conv(b.fecha) ? 1 : b.debe - a.debe; });
    var saldo = 0;
    mov.forEach(function (m) { saldo += m.debe - m.haber; m.saldo = saldo; });
    return mov;
  };

  function tabCC(ti, per, cuentas) {
    var mov = GA.movimientos(cuentas.map(function (c) { return c.id; }));
    if (!mov.length) return GA.vacio('Sin movimientos', 'La cuenta corriente todavía no tiene comprobantes ni pagos.');
    return '<p class="hint">Vista de solo lectura; la cuenta corriente la gestiona Cobranza (M07, PAN-COB-01).</p><div class="tabla-cont"><table class="tabla"><caption class="sr-only">Movimientos de cuenta corriente</caption><thead><tr><th scope="col">Fecha</th><th scope="col">Movimiento</th><th scope="col">Cuenta</th><th scope="col" class="num">Debe</th><th scope="col" class="num">Haber</th><th scope="col" class="num">Saldo</th></tr></thead><tbody>' +
      mov.map(function (m) { return '<tr><td class="mono">' + m.fecha + '</td><td>' + esc(m.desc) + '</td><td class="mono">' + m.cuenta + '</td><td class="num mono">' + (m.debe ? GA.num(m.debe) : '') + '</td><td class="num mono">' + (m.haber ? GA.num(m.haber) : '') + '</td><td class="num mono">' + GA.num(m.saldo) + '</td></tr>'; }).join('') + '</tbody></table></div>';
  }

  function tabFacturas(ti, per, cuentas) {
    var ids = cuentas.map(function (c) { return c.id; });
    var fcs = GA.e.comprobantes.filter(function (c) { return ids.indexOf(c.cuentaId) >= 0; });
    if (!fcs.length) return GA.vacio('Sin facturas', 'Las facturas aparecen cuando se emite un lote que incluye estas cuentas.', '<a class="btn" href="#/admin/fac/lotes">Ir a lotes de facturación</a>');
    return '<div class="tabla-cont"><table class="tabla"><caption class="sr-only">Facturas del titular</caption><thead><tr><th scope="col">Comprobante</th><th scope="col">Período</th><th scope="col">Cuenta</th><th scope="col" class="num">Total</th><th scope="col">Estado</th></tr></thead><tbody>' +
      fcs.map(function (c) { return '<tr><td><a class="mono" href="#/admin/fac/comprobantes?id=' + c.id + '">' + c.tipo + ' ' + c.letra + ' ' + c.numero + '</a></td><td class="mono">' + c.periodo + '</td><td class="mono">' + c.cuentaId + '</td><td class="num mono">' + GA.num(c.total) + '</td><td>' + GA.badge('comercial', q.saldoComprobante(c) ? 'impaga' : 'pagada') + '</td></tr>'; }).join('') + '</tbody></table></div>';
  }

  function tabReclamos(ti, per, cuentas) {
    var ids = cuentas.map(function (c) { return c.id; });
    var casos = q.casosDeCuentas(ids);
    var ots = GA.e.ots.filter(function (o) { var k = q.contrato(o.contratoId); return k && ids.indexOf(k.cuentaId) >= 0; });
    return '<h3>Casos</h3>' + (casos.length ? '<ul class="lista">' + casos.map(function (c) { return '<li><a class="mono" href="#/admin/crm/casos/' + c.id + '">' + c.id + '</a> · ' + esc(c.asunto) + ' ' + GA.badge('caso', c.estado) + '</li>'; }).join('') + '</ul>' : '<p>No hay casos.</p>') +
      '<h3>Órdenes de trabajo</h3>' + (ots.length ? '<ul class="lista">' + ots.map(function (o) { return '<li><a class="mono" href="#/admin/tec/work-orders/' + o.id + '">OT ' + o.id + '</a> · ' + esc(o.operacion) + ' ' + GA.badge('ot', o.estado) + '</li>'; }).join('') + '</ul>' : '<p>No hay órdenes de trabajo.</p>');
  }

  function tabHistoria(ti) {
    var h = GA.e.historia.filter(function (x) { return x.titularId === ti.id; });
    return h.length ? '<ol class="timeline">' + h.map(function (x) { return '<li><span class="timeline__f">' + esc(x.fecha) + '</span>' + esc(x.texto) + '</li>'; }).join('') + '</ol>' : '<p>Sin historia.</p>';
  }

  GA.acc.verContrato = function (el) {
    var k = q.contrato(el.getAttribute('data-id'));
    var pl = q.plan(k.planId);
    GA.modal({
      titulo: 'Contrato ' + k.id, tam: 'md',
      cuerpo: '<p>' + GA.badge('contrato', k.estado) + '</p><dl class="dl"><dt>Servicio y plan</dt><dd>Internet · ' + esc(pl.nombre) + ' (' + esc(pl.velocidad) + ')</dd><dt>Abono</dt><dd class="mono">' + GA.ars(pl.abono) + ' por mes</dd>' +
        '<dt>Cuenta</dt><dd class="mono">' + k.cuentaId + '</dd><dt>Domicilio del servicio</dt><dd>' + esc(k.domicilio) + '</dd><dt>Categoría</dt><dd>' + esc(k.categoria) + '</dd><dt>Origen</dt><dd>' + esc(k.origen) + '</dd><dt>Fecha de solicitud o alta</dt><dd>' + esc(k.alta) + '</dd></dl>' +
        '<p class="hint">Ficha del contrato PAN-CAT-14. El estado solo cambia por transiciones (RF-CAT-061).</p>',
      pie: '<button type="button" class="btn btn--pri" data-act="cerrarModal">Cerrar</button>'
    });
  };

  GA.acc.nuevaCuenta = function (el) {
    var tid = el.getAttribute('data-tit');
    var per = q.persona(q.titular(tid).personaId);
    GA.modal({
      titulo: 'Nueva cuenta', tam: 'md',
      cuerpo: '<form id="form-cuenta" data-form="nuevaCuenta" data-tit="' + tid + '" novalidate>' +
        GA.campo({ id: 'nc-dom', label: 'Domicilio de la cuenta', value: per.domicilio + ', ' + per.localidad, req: true, hint: 'Se propone el domicilio del titular para no volver a cargarlo.', attrs: 'autofocus' }) +
        GA.campo({ id: 'nc-entrega', label: 'Entrega de facturas', type: 'select', value: 'Electrónica', opciones: ['Electrónica', 'Papel'] }) + '</form>',
      pie: '<button type="button" class="btn" data-act="cerrarModal">Cancelar</button><button type="submit" form="form-cuenta" class="btn btn--pri">Crear cuenta</button>'
    });
  };
  GA.form.nuevaCuenta = function (f) {
    var dom = f.querySelector('#nc-dom').value.trim();
    if (!dom) { GA.toast('Ingresá el domicilio de la cuenta.', 'bad'); return; }
    var tid = f.getAttribute('data-tit');
    var cid = GA.sig('cuenta', 4);
    GA.e.cuentas.push({ id: cid, titularId: tid, domicilio: dom, principal: false, entrega: f.querySelector('#nc-entrega').value, grupo: 'General' });
    GA.e.historia.unshift({ fecha: GA.ahora(), titularId: tid, texto: 'Cuenta ' + cid + ' creada' });
    GA.cerrarModal();
    GA.toast('Cuenta ' + cid + ' creada.');
    GA.ui.ficha = 'cuentas';
    GA.mutar();
  };

  GA.acc.nuevaNota = function (el) {
    GA.modal({
      titulo: 'Nueva nota', tam: 'md',
      cuerpo: '<form id="form-nota" data-form="nuevaNota" data-tit="' + el.getAttribute('data-tit') + '">' + GA.campo({ id: 'nota-txt', label: 'Nota', type: 'textarea', req: true, attrs: 'autofocus maxlength="500"' }) + '</form>',
      pie: '<button type="button" class="btn" data-act="cerrarModal">Cancelar</button><button type="submit" form="form-nota" class="btn btn--pri">Guardar nota</button>'
    });
  };
  GA.form.nuevaNota = function (f) {
    var t = f.querySelector('#nota-txt').value.trim();
    if (!t) { GA.toast('Escribí la nota antes de guardar.', 'bad'); return; }
    GA.e.historia.unshift({ fecha: GA.ahora(), titularId: f.getAttribute('data-tit'), texto: 'Nota: ' + t });
    GA.cerrarModal();
    GA.toast('Nota guardada.');
    GA.mutar();
  };

  /* ---------- Alta de contrato de servicio (W-04, PAN-CAT-15) ---------- */
  var PASOS = ['Titular y cuenta', 'Servicio y plan', 'Domicilio', 'Requisitos', 'Condiciones', 'Resumen'];

  GA.ruta('/admin/cat/contracts/new', {
    app: 'admin', nav: 'titulares',
    render: function (p, query) {
      var w = GA.ui.wiz;
      if (!w) {
        w = GA.ui.wiz = { paso: 1, cuentaId: query.cuenta || '', planId: 'FIB100', categoria: 'Residencial', origen: 'Ventanilla', caso: 'nuevo', domMismo: true, dom: '', piso: '', acepta: false, canal: 'Ventanilla', errores: [] };
      }
      var cuenta = q.cuenta(w.cuentaId);
      var titular = cuenta ? q.titular(cuenta.titularId) : null;
      var per = titular ? q.persona(titular.personaId) : null;
      var pasosHtml = '<ol class="pasos" aria-label="Pasos del asistente">' + PASOS.map(function (n, i) {
        var estado = i + 1 < w.paso ? 'hecho' : i + 1 === w.paso ? 'actual' : '';
        return '<li class="' + estado + '"' + (estado === 'actual' ? ' aria-current="step"' : '') + '>(' + (i + 1) + ') ' + esc(n) + (estado === 'hecho' ? '<span class="sr-only"> (completado)</span>' : '') + '</li>';
      }).join('') + '</ol>';
      var err = function (id) { var e = w.errores.filter(function (x) { return x[0] === id; })[0]; return e && e[1]; };
      var cuerpo = '';
      var pl = q.plan(w.planId);
      var domServicio = w.domMismo && cuenta ? cuenta.domicilio : (w.dom + (w.piso ? ' ' + w.piso : ''));

      if (w.paso === 1) {
        cuerpo = GA.campo({
          id: 'wz-cuenta', label: 'Titular y cuenta', type: 'select', value: w.cuentaId, req: true, err: err('wz-cuenta'), hint: 'Buscá por nombre, DNI, CUIT o cuenta. En el prototipo se elige de la lista.',
          opciones: [['', 'Elegí una cuenta…']].concat(GA.e.cuentas.map(function (c) { return [c.id, 'Cta. ' + c.id + ' · ' + q.nombreCuenta(c.id) + ' · ' + c.domicilio]; }))
        }) + '<p><a href="#/admin/per/titulares?alta=1">¿No existe? Dar de alta una persona</a></p>';
      } else if (w.paso === 2) {
        var activos = cuenta ? q.contratosDe(cuenta.id).filter(function (k) { return k.estado !== 'cancelled'; }) : [];
        var mismoDom = GA.e.cuentas.filter(function (c) { return cuenta && c.id !== cuenta.id && c.domicilio === cuenta.domicilio; });
        cuerpo = '<p>Titular: <strong>' + esc(q.nombre(per)) + '</strong> · Cuenta <span class="mono">' + cuenta.id + '</span> <button type="button" class="btn-link" data-act="wizIr" data-paso="1">Cambiar</button></p>' +
          GA.campo({ id: 'wz-servicio', label: 'Servicio', type: 'select', value: 'INT', req: true, hint: 'Solo servicios con oferta abierta.', opciones: [['INT', 'Internet']] }) +
          '<fieldset class="planes"><legend>Plan <span class="req">(obligatorio)</span></legend><div class="planes__grilla" role="radiogroup" aria-label="Planes de Internet">' +
          GA.e.planes.map(function (x) {
            return '<label class="plan' + (x.id === w.planId ? ' plan--sel' : '') + '"><input type="radio" name="wz-plan" value="' + x.id + '"' + (x.id === w.planId ? ' checked' : '') + ' data-chg="wizCampo" data-k="planId"><span class="plan__n">' + esc(x.nombre) + '</span><span>' + esc(x.velocidad) + '</span><span class="mono">Abono ' + GA.ars(x.abono) + ' / mes</span><span class="mono">Instalación ' + GA.ars(x.instalacion) + '</span><span>Equipo ONT en comodato</span></label>';
          }).join('') + '</div></fieldset><div class="grilla-3">' +
          GA.campo({ id: 'wz-cat', label: 'Categoría', type: 'select', value: w.categoria, req: true, opciones: ['Residencial', 'Comercial'], attrs: 'data-chg="wizCampo" data-k="categoria"' }) +
          GA.campo({ id: 'wz-origen', label: 'Origen', type: 'select', value: w.origen, opciones: ['Ventanilla', 'Teléfono', 'App del socio', 'Landing'], attrs: 'data-chg="wizCampo" data-k="origen"' }) +
          GA.campo({ id: 'wz-caso', label: 'Caso CRM vinculado', type: 'select', value: w.caso, opciones: [['nuevo', 'Crear un caso de solicitud nuevo']], hint: 'El contrato queda vinculado a un caso de atención.' }) + '</div>' +
          ((activos.length || mismoDom.length) ? '<div class="banda banda--warn" role="status"><strong>Advertencias (' + (activos.length + (mismoDom.length ? 1 : 0)) + ')</strong><ul>' +
            (activos.length ? '<li>La cuenta ya tiene ' + activos.length + ' contrato(s) de Internet (' + activos.map(function (k) { return k.id; }).join(', ') + '). Revisá antes de continuar.</li>' : '') +
            (mismoDom.length ? '<li>Existen otras cuentas con el mismo domicilio. Revisá antes de continuar.</li>' : '') + '</ul></div>' : '');
      } else if (w.paso === 3) {
        cuerpo = '<fieldset class="radios"><legend>Domicilio del servicio</legend>' +
          '<label class="check"><input type="radio" name="wz-dm" value="1" data-chg="wizDom"' + (w.domMismo ? ' checked' : '') + '> Usar el domicilio de la cuenta: ' + esc(cuenta.domicilio) + '</label>' +
          '<label class="check"><input type="radio" name="wz-dm" value="0" data-chg="wizDom"' + (!w.domMismo ? ' checked' : '') + '> Otro domicilio</label></fieldset>' +
          '<div id="wz-otro"' + (w.domMismo ? ' hidden' : '') + ' class="grilla-2">' +
          GA.campo({ id: 'wz-dom', label: 'Calle, altura y localidad', value: w.dom, req: true, auto: 'street-address', err: err('wz-dom') }) +
          GA.campo({ id: 'wz-piso', label: 'Piso y departamento', value: w.piso }) + '</div>' +
          '<div class="mapa-alt" role="img" aria-label="Mapa ilustrativo del domicilio del servicio. Alternativa textual: ' + esc(domServicio || cuenta.domicilio) + ', ubicación confirmada.">' + GA.ico('ubicacion') + '<span>Mapa ilustrativo (sin proveedor de mapas en el prototipo). Ubicación confirmada.</span></div>';
      } else if (w.paso === 4) {
        var reqs = [
          ['Documento del titular verificado', 'Advertir', per.verificado ? ['ok', 'Cumplido'] : ['warn', 'Advertencia: documento sin verificar']],
          ['Sin deuda en el domicilio', 'Advertir', ['ok', 'Cumplido']],
          ['Factibilidad técnica favorable', 'Exigir', ['info', 'Se solicita a Técnica al crear el contrato']],
          ['Aceptación de condiciones', 'Exigir', ['info', 'Se registra en el paso 5']]
        ];
        cuerpo = '<p>Se muestran juntos todos los errores y advertencias del perfil del servicio (RF-CAT-073).</p><div class="tabla-cont"><table class="tabla"><caption class="sr-only">Requisitos de alta de Internet</caption><thead><tr><th scope="col">Requisito</th><th scope="col">Configuración</th><th scope="col">Resultado</th></tr></thead><tbody>' +
          reqs.map(function (r) { return '<tr><td>' + esc(r[0]) + '</td><td>' + esc(r[1]) + '</td><td>' + GA.badgeTono(r[2][0], r[2][1]) + '</td></tr>'; }).join('') + '</tbody></table></div>';
      } else if (w.paso === 5) {
        cuerpo = '<dl class="dl"><dt>Versión del plan</dt><dd>' + esc(pl.nombre) + ' · versión vigente v1</dd><dt>Promociones</dt><dd>Sin promociones vigentes</dd></dl>' +
          GA.campo({ id: 'wz-canal', label: 'Canal de aceptación', type: 'select', value: w.canal, opciones: ['Ventanilla', 'Teléfono', 'App del socio'], attrs: 'data-chg="wizCampo" data-k="canal"' }) +
          '<div class="campo' + (err('wz-acepta') ? ' campo--error' : '') + '"><label class="check"><input type="checkbox" id="wz-acepta" data-chg="wizAcepta"' + (w.acepta ? ' checked' : '') + (err('wz-acepta') ? ' aria-invalid="true" aria-describedby="wz-acepta-err"' : '') + '> El titular aceptó las condiciones del servicio (fecha ' + GA.HOY + ')</label>' +
          (err('wz-acepta') ? '<p class="err" id="wz-acepta-err">' + GA.ico('bad') + esc(err('wz-acepta')) + '</p>' : '') + '</div>';
      } else {
        cuerpo = '<dl class="dl"><dt>Titular</dt><dd>' + esc(q.nombre(per)) + ' · Cuenta ' + cuenta.id + ' · Grupo de facturación: ' + esc(cuenta.grupo) + '</dd>' +
          '<dt>Servicio</dt><dd>Internet · Plan ' + esc(pl.nombre) + ' · Categoría ' + esc(w.categoria) + '</dd><dt>Domicilio del servicio</dt><dd>' + esc(domServicio) + ' (ubicación confirmada)</dd>' +
          '<dt>Conceptos por evento</dt><dd class="mono">Instalación ' + GA.ars(pl.instalacion) + '</dd><dt>Requisitos</dt><dd>' + (per.verificado ? '2 cumplidos · 0 advertencias' : '1 cumplido · 1 advertencia') + ' · factibilidad a solicitar</dd>' +
          '<dt>Estado resultante</dt><dd>' + GA.badge('contrato', 'requested') + ' <span class="hint">Luego pasa a factibilidad y a pendiente de instalación (M02 §8.2).</span></dd>' +
          '<dt>Aceptación</dt><dd>Aceptó las condiciones · canal ' + esc(w.canal) + ' · ' + GA.HOY + '</dd></dl>';
      }

      var pie = '<div class="wiz__pie"><a class="btn" href="#' + (titular ? '/admin/per/titulares/' + titular.id : '/admin/per/titulares') + '">Cancelar</a><span class="crece"></span>' +
        '<button type="button" class="btn" data-act="noDisponibleBorrador">Guardar borrador</button>' +
        (w.paso > 1 ? '<button type="button" class="btn" data-act="wizIr" data-paso="' + (w.paso - 1) + '">Anterior</button>' : '') +
        (w.paso < 6 ? '<button type="submit" class="btn btn--pri">Siguiente</button>' : '<button type="submit" class="btn btn--pri">Crear contrato</button>') + '</div>';

      return {
        meta: M('W-04', 'PAN-CAT-15', '/admin/cat/contracts/new', 'cat.contratos.crear', 'O2 (contrato requested); O3 (comodato en instalación)', 'Nuevo contrato de servicio', 'Dar de alta un contrato de servicio validando requisitos y congelando las condiciones.', 'T-ATE, T-SAT'),
        html: GA.cabecera({ migas: ['Servicios', 'Contratos', 'Nuevo contrato'], titulo: 'Nuevo contrato de servicio', subtitulo: 'Asistente (en el producto se abre como modal xl)' }) +
          '<div class="pag"><div class="wiz panel">' + pasosHtml + GA.resumenErrores(w.errores) +
          '<form data-form="wizard" novalidate><h2 id="paso-tit" tabindex="-1">Paso ' + w.paso + ' de 6: ' + PASOS[w.paso - 1] + '</h2>' + cuerpo + pie + '</form></div></div>'
      };
    }
  });

  GA.inp.wizCampo = function (el) {
    GA.ui.wiz[el.getAttribute('data-k')] = el.value;
    if (el.name === 'wz-plan') { GA.render(true); var r = document.querySelector('input[name="wz-plan"][value="' + el.value + '"]'); if (r) r.focus(); }
  };
  GA.inp.wizDom = function (el) { GA.ui.wiz.domMismo = el.value === '1'; document.getElementById('wz-otro').hidden = GA.ui.wiz.domMismo; };
  GA.inp.wizAcepta = function (el) { GA.ui.wiz.acepta = el.checked; };
  GA.acc.noDisponibleBorrador = function () { GA.toast('Borrador guardado (simulado). En el producto se puede recuperar si se interrumpe la carga.', 'info'); };

  function irPaso(n) {
    GA.ui.wiz.paso = n;
    GA.render(true);
    var t = document.getElementById('paso-tit');
    if (t) t.focus();
    GA.anunciar('Paso ' + n + ' de 6: ' + PASOS[n - 1]);
  }
  GA.acc.wizIr = function (el) { GA.ui.wiz.errores = []; irPaso(Number(el.getAttribute('data-paso'))); };

  GA.form.wizard = function (f) {
    var w = GA.ui.wiz;
    w.errores = [];
    if (w.paso === 1) {
      w.cuentaId = f.querySelector('#wz-cuenta').value;
      if (!w.cuentaId) w.errores.push(['wz-cuenta', 'Elegí el titular y la cuenta.']);
    }
    if (w.paso === 3 && !w.domMismo) {
      w.dom = f.querySelector('#wz-dom').value.trim();
      w.piso = f.querySelector('#wz-piso').value.trim();
      if (!w.dom) w.errores.push(['wz-dom', 'Ingresá el domicilio del servicio.']);
    }
    if (w.paso === 5 && !w.acepta) w.errores.push(['wz-acepta', 'Registrá la aceptación de las condiciones para continuar.']);
    if (w.errores.length) { GA.render(true); document.getElementById('resumen-errores').focus(); return; }
    if (w.paso < 6) { irPaso(w.paso + 1); return; }

    var cuenta = q.cuenta(w.cuentaId);
    var kid = 'INT-' + GA.sig('contrato', 4);
    var casoId = '2026-' + GA.sig('caso', 6);
    var pl = q.plan(w.planId);
    GA.e.contratos.push({ id: kid, cuentaId: cuenta.id, planId: w.planId, categoria: w.categoria, estado: 'requested', domicilio: w.domMismo ? cuenta.domicilio : w.dom + (w.piso ? ' ' + w.piso : ''), casoId: casoId, otId: null, equipo: 'ONT (a asignar)', origen: w.origen, alta: GA.HOY });
    GA.e.casos.push({ id: casoId, clase: 'solicitud', prioridad: 'normal', asunto: 'Alta de Internet · ' + pl.nombre, cuentaId: cuenta.id, contratoId: kid, estado: 'recibido', canal: w.origen.toLowerCase(), vence: '07-11-2026 17:00', responsable: 'Sin asignar', otId: null, area: 'Comercial', linea: [{ fecha: GA.ahora(), autor: 'Sistema', texto: 'Contrato ' + kid + ' solicitado. Falta la factibilidad técnica.', tipo: 'sistema' }] });
    GA.e.historia.unshift({ fecha: GA.ahora(), titularId: cuenta.titularId, texto: 'Contrato ' + kid + ' creado (' + w.origen + '), caso ' + casoId });
    GA.guardar();
    GA.toast('Contrato ' + kid + ' creado en estado Solicitado y vinculado al caso ' + casoId + '.');
    GA.ir('/admin/per/titulares/' + cuenta.titularId);
  };

  /* ---------- Catálogo de servicios (PAN-CAT-03) y configuración (W-10, PAN-CAT-04) ---------- */
  GA.ruta('/admin/cat/services', {
    app: 'admin', nav: 'servicios',
    render: function () {
      return {
        meta: M('—', 'PAN-CAT-03', '/admin/cat/services', 'cat.servicios.ver', 'O2', 'Catálogo de servicios', 'Listado de servicios configurados por la cooperativa.', 'T-ADM'),
        html: GA.cabecera({ migas: ['Servicios', 'Catálogo', 'Catálogo de servicios'], titulo: 'Catálogo de servicios', acciones: '<button type="button" class="btn btn--pri" data-act="noDisponible">Nuevo servicio</button>' }) +
          '<div class="pag"><div class="tabla-cont"><table class="tabla"><caption class="sr-only">Servicios</caption><thead><tr><th scope="col">Código</th><th scope="col">Servicio</th><th scope="col">Oferta</th><th scope="col">Operación</th><th scope="col">Versión vigente</th></tr></thead><tbody>' +
          '<tr><td class="mono">INT</td><td><a href="#/admin/cat/services/INT">Internet</a></td><td>' + GA.badgeTono('ok', 'Abierta') + '</td><td>' + GA.badgeTono('ok', 'Activa') + '</td><td>v1</td></tr>' +
          '</tbody></table></div><p class="hint">El piloto construye Internet como primer servicio (DEC-005). Otros servicios llegan en olas posteriores.</p></div>'
      };
    }
  });

  var REQS = [['fact', 'Factibilidad técnica favorable'], ['doc', 'Documento del titular verificado'], ['deuda', 'Sin deuda en el domicilio'], ['acep', 'Aceptación de condiciones']];
  function cfgServicio() {
    if (!GA.e.servicio) GA.e.servicio = { estado: 'borrador', req: { fact: 'exigir', doc: 'advertir', deuda: 'advertir', acep: 'exigir' }, ot: true, aprov: true, serie: true, canales: { landing: true, app: true, ventanilla: true } };
    return GA.e.servicio;
  }

  GA.ruta('/admin/cat/services/:id', {
    app: 'admin', nav: 'servicios',
    render: function () {
      var c = cfgServicio();
      var tab = GA.ui.srv || 'requisitos';
      var ro = c.estado === 'revision';
      var dis = ro ? ' disabled' : '';
      var tabs = [['general', 'General'], ['prestador', 'Prestador y jurisdicción'], ['requisitos', 'Requisitos de alta'], ['operacion', 'Operación'], ['facturacion', 'Facturación'], ['canales', 'Canales'], ['control', 'Control']];
      var panel;
      if (tab === 'requisitos') {
        panel = '<h2>Requisitos de alta</h2><div class="tabla-cont"><table class="tabla matriz"><caption class="sr-only">Matriz de requisitos de alta: no exigir, advertir o exigir</caption><thead><tr><th scope="col">Requisito</th><th scope="col">No exigir</th><th scope="col">Advertir</th><th scope="col">Exigir</th></tr></thead><tbody>' +
          REQS.map(function (r) {
            return '<tr><th scope="row" id="rq-' + r[0] + '">' + esc(r[1]) + '</th>' + ['no', 'advertir', 'exigir'].map(function (op) {
              return '<td><input type="radio" name="rq-' + r[0] + '" value="' + op + '" aria-labelledby="rq-' + r[0] + ' col-' + op + '"' + (c.req[r[0]] === op ? ' checked' : '') + dis + ' data-chg="srvReq" data-k="' + r[0] + '"></td>';
            }).join('') + '</tr>';
          }).join('') + '</tbody></table><span hidden id="col-no">No exigir</span><span hidden id="col-advertir">Advertir</span><span hidden id="col-exigir">Exigir</span></div>' +
          '<h2>Operación técnica</h2><label class="check"><input type="checkbox" checked' + dis + '> Requiere OT de instalación (operación: Instalación)</label>' +
          '<label class="check"><input type="checkbox" checked' + dis + '> Genera aprovisionamiento (sistema: a definir por tenant, AD-09)</label>' +
          '<label class="check"><input type="checkbox" checked' + dis + '> Requiere equipo serializado (artículo: ONT)</label>' +
          '<h2>Canales de contratación</h2><div class="radios--fila"><label class="check"><input type="checkbox" checked' + dis + '> Landing</label><label class="check"><input type="checkbox" checked' + dis + '> App del socio</label><label class="check"><input type="checkbox" checked' + dis + '> Ventanilla</label></div>';
      } else if (tab === 'general') {
        panel = '<h2>General</h2><dl class="dl"><dt>Código</dt><dd class="mono">INT</dd><dt>Nombre</dt><dd>Internet</dd><dt>Dominio</dt><dd>Internet</dd><dt>Planes publicados</dt><dd>' + GA.e.planes.map(function (p) { return esc(p.nombre); }).join(', ') + '</dd></dl>';
      } else {
        panel = '<h2>' + esc(tabs.filter(function (t) { return t[0] === tab; })[0][1]) + '</h2><p>Esta dimensión del perfil del servicio no se detalla en el prototipo. Cada dimensión admite "No aplica" (RF-CAT-013).</p>';
      }
      return {
        meta: M('W-10', 'PAN-CAT-04', '/admin/cat/services/INT', 'cat.servicios.configurar', 'O2–O4', 'Internet · configuración', 'Configurar el perfil del servicio en versiones con borrador, revisión y publicación.', 'T-ADM, T-FAC'),
        html: GA.cabecera({
          migas: ['Servicios', 'Catálogo', ['Catálogo de servicios', '/admin/cat/services'], 'Internet'], titulo: 'Internet',
          extra: '<p class="cab-pag__datos">Código <span class="mono">INT</span> · Dominio: Internet · Oferta ' + GA.badgeTono('ok', 'Abierta') + ' Operación ' + GA.badgeTono('ok', 'Activa') + '</p>',
          acciones: ro ? '<button type="button" class="btn" data-act="simularFactura">Simular primera factura</button>' :
            '<button type="button" class="btn btn--pri" data-act="enviarRevision">Enviar a revisión</button><button type="button" class="btn" data-act="guardarBorradorSrv">Guardar borrador</button><button type="button" class="btn" data-act="simularFactura">Simular primera factura</button>'
        }) + '<div class="pag">' +
          (ro ? '<div class="banda banda--info" role="status">' + GA.ico('info') + 'Versión v2 en revisión por Usuario Ejemplo A. Los campos son de solo lectura.</div>'
            : '<div class="banda banda--warn" role="status">' + GA.ico('warn') + 'Versión borrador v2 en edición (vigente: v1).</div>') +
          '<div class="srv">' + GA.pestanas('srv', tabs, tab, { vertical: true, label: 'Dimensiones del servicio' }) +
          '<div id="panel-srv" role="tabpanel" aria-labelledby="tab-srv-' + tab + '" class="panel">' + panel + '</div></div></div>'
      };
    }
  });
  GA.inp.srvReq = function (el) { cfgServicio().req[el.getAttribute('data-k')] = el.value; GA.guardar(); };
  GA.acc.guardarBorradorSrv = function () { GA.toast('Borrador v2 guardado.'); };
  GA.acc.enviarRevision = function () {
    var c = cfgServicio();
    var adv = c.req.doc === 'no' ? 1 : 0;
    GA.modal({
      titulo: 'Enviar a revisión la versión v2', tam: 'md',
      cuerpo: '<p>Validaciones antes de enviar:</p><ul class="lista"><li>' + GA.badgeTono('ok', '0 bloqueantes') + ' Servicio no regulado: no requiere autoridad ni título habilitante.</li>' +
        '<li>' + GA.badgeTono(adv ? 'warn' : 'ok', adv + ' advertencia' + (adv === 1 ? '' : 's')) + (adv ? ' No se exige ni se advierte sobre el documento del titular.' : ' Sin advertencias.') + '</li></ul><p>La publicación queda auditada (RF-CAT-006).</p>',
      pie: '<button type="button" class="btn" data-act="cerrarModal">Cancelar</button><button type="button" class="btn btn--pri" data-act="confirmarRevision">Enviar a revisión</button>'
    });
  };
  GA.acc.confirmarRevision = function () { cfgServicio().estado = 'revision'; GA.cerrarModal(); GA.toast('Versión v2 enviada a revisión.'); GA.mutar(); };
  GA.acc.simularFactura = function () {
    var p = q.plan('FIB100');
    GA.modal({
      titulo: 'Simulación de primera factura (sin efectos)', tam: 'md',
      cuerpo: '<p>Plan Fibra 100 · Residencial · Consumidor final</p><div class="tabla-cont"><table class="tabla"><thead><tr><th scope="col">Concepto</th><th scope="col" class="num">Importe (ARS)</th></tr></thead><tbody>' +
        '<tr><td>Abono mensual</td><td class="num mono">' + GA.num(p.abono) + '</td></tr><tr><td>Instalación (concepto por evento)</td><td class="num mono">' + GA.num(p.instalacion) + '</td></tr>' +
        '<tr><th scope="row">Total</th><td class="num mono"><strong>' + GA.num(p.abono + p.instalacion) + '</strong></td></tr></tbody></table></div><p class="hint">Importes ilustrativos con IVA incluido; el desglose de tributos lo resuelven M04, M06 y M08.</p>',
      pie: '<button type="button" class="btn btn--pri" data-act="cerrarModal">Cerrar</button>'
    });
  };
})(window.GA);
