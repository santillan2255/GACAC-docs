/* Admin: facturación (W-05, W-06), cobranza (W-07), atención (W-08) y técnica (W-09). */
'use strict';

(function (GA) {
  var esc = GA.esc;
  var q = GA.q;
  var M = GA.M;

  /* ================= FACTURACIÓN ================= */

  GA.emitirLoteDirecto = function (loteId) {
    var lote = q.lote(loteId);
    if (!lote || lote.estado === 'issued') return;
    GA.e.contratos.filter(function (k) { return k.estado === 'active'; }).forEach(function (k) {
      var pl = q.plan(k.planId);
      var cuenta = q.cuenta(k.cuentaId);
      var per = q.persona(q.titular(cuenta.titularId).personaId);
      var letra = per.condIva === 'Responsable inscripto' ? 'A' : 'B';
      var numero = '0001-' + GA.sig(letra === 'A' ? 'fcA' : 'fcB', 8);
      var renglones = [{ concepto: 'Abono mensual ' + pl.nombre, importe: pl.abono, explica: 'Es el precio mensual del plan ' + pl.nombre + ' que contrataste.' }];
      if (k.alta.slice(3) === '10-2026') renglones.push({ concepto: 'Instalación', importe: pl.instalacion, explica: 'Se cobra una sola vez, por la instalación del servicio realizada el ' + k.alta + '.' });
      var total = renglones.reduce(function (s, r) { return s + r.importe; }, 0);
      GA.e.comprobantes.push({ id: 'FC' + letra + '-' + numero, tipo: 'FC', letra: letra, numero: numero, fecha: GA.HOY, vto1: '10-11-2026', vto2: '20-11-2026', periodo: lote.periodo, cuentaId: k.cuentaId, loteId: lote.id, contratoId: k.id, renglones: renglones, total: total, pagado: 0, fiscal: 'autorizado' });
    });
    lote.estado = 'issued';
    lote.muestraRevisada = true;
    lote.aprobo = lote.aprobo || 'Usuario Ejemplo D';
    lote.auditoria = (lote.auditoria || []).concat([[GA.ahora(), 'Lote emitido: 98 comprobantes autorizados (CAE obtenido, simulado)']]);
  };

  GA.ruta('/admin/fac/lotes', {
    app: 'admin', nav: 'lotes',
    render: function () {
      return {
        meta: M('—', 'PAN-FAC-05', '/admin/fac/lotes', 'fac.lotes.ver', 'O4', 'Lotes de facturación', 'Listado de lotes de facturación por período y ciclo.', 'T-FAC, aprobador de facturación'),
        html: GA.cabecera({ migas: ['Facturación', 'Emisión', 'Lotes de facturación'], titulo: 'Lotes de facturación', acciones: '<button type="button" class="btn btn--pri" data-act="noDisponible">Nuevo lote</button>' }) +
          '<div class="pag"><div class="tabla-cont"><table class="tabla"><caption class="sr-only">Lotes de facturación</caption><thead><tr><th scope="col">Lote</th><th scope="col">Período</th><th scope="col">Ciclo</th><th scope="col" class="num">Universo</th><th scope="col" class="num">Total (ARS)</th><th scope="col">Estado</th></tr></thead><tbody>' +
          GA.e.lotes.slice().reverse().map(function (l) {
            return '<tr><td><a class="mono" href="#/admin/fac/lotes/' + l.id + '">' + l.id + '</a></td><td class="mono">' + l.periodo + '</td><td class="mono">' + l.ciclo + '</td><td class="num mono">' + l.universo + '</td><td class="num mono">' + GA.num(l.total) + '</td><td>' + GA.badge('lote', l.estado) + '</td></tr>';
          }).join('') + '</tbody></table></div></div>'
      };
    }
  });

  GA.ruta('/admin/fac/lotes/:id', {
    app: 'admin', nav: 'lotes',
    render: function (p) {
      var l = q.lote(p.id);
      var meta = M('W-06', 'PAN-FAC-07', '/admin/fac/lotes/' + p.id, 'fac.lotes.ver · fac.lotes.aprobar · fac.lotes.emitir', 'O4', 'Lote ' + p.id, 'Revisar la prefacturación (totales, variaciones, muestra y excepciones) antes de aprobar la emisión.', 'T-FAC (preparador), aprobador de facturación, T-GER');
      if (!l) return { meta: meta, html: GA.cabecera({ migas: [['Lotes', '/admin/fac/lotes']], titulo: 'Lote no encontrado' }) };
      if (!l.muestra) {
        return { meta: meta, html: GA.cabecera({ migas: ['Facturación', 'Emisión', ['Lotes de facturación', '/admin/fac/lotes'], l.id], titulo: 'Lote ' + l.id, extra: '<p class="cab-pag__datos">' + GA.badge('lote', l.estado) + '</p>' }) + '<div class="pag"><p>Lote del período ' + l.periodo + ' cerrado. Aprobó ' + esc(l.aprobo) + '.</p><a class="btn" href="#/admin/fac/comprobantes">Ver comprobantes</a></div>' };
      }
      l.auditoria = l.auditoria || [['04-11-2026 19:00', 'Prefacturación terminada por Usuario Ejemplo A']];
      var tab = GA.ui.lote || 'resumen';
      var enJob = l.estado === 'prebilling' || l.estado === 'issuing';
      var acciones = '';
      if (l.estado === 'prebilled') acciones = '<button type="button" class="btn btn--pri" data-act="aprobarLote">Aprobar</button><button type="button" class="btn" data-act="reprefacturar">Re-prefacturar</button><button type="button" class="btn" data-act="cancelarLote">Cancelar lote</button>';
      else if (l.estado === 'approved') acciones = '<button type="button" class="btn btn--pri" data-act="emitirLote">Emitir</button>';
      else if (l.estado === 'issued') acciones = '<a class="btn btn--pri" href="#/admin/fac/comprobantes">Ver comprobantes</a>';
      var tabs = [['resumen', 'Resumen'], ['casos', 'Casos'], ['excepciones', 'Excepciones', l.excepciones], ['auditoria', 'Auditoría']];
      var panel = '';
      if (tab === 'resumen') {
        panel = '<div class="kpis">' +
          '<div class="kpi"><span class="kpi__t">Universo</span><span class="kpi__v">' + l.universo + ' casos</span></div>' +
          '<div class="kpi"><span class="kpi__t">Aptos</span><span class="kpi__v">' + l.aptos + '</span></div>' +
          '<div class="kpi"><span class="kpi__t">Excepciones</span><span class="kpi__v">' + l.excepciones + '</span></div>' +
          '<div class="kpi"><span class="kpi__t">Total a emitir</span><span class="kpi__v mono">' + GA.ars(l.total) + '</span></div></div>' +
          '<section class="panel"><h2>Totales por concepto</h2><div class="tabla-cont"><table class="tabla"><thead><tr><th scope="col">Concepto</th><th scope="col" class="num">Período anterior</th><th scope="col" class="num">Este período</th><th scope="col" class="num">Variación</th></tr></thead><tbody>' +
          l.conceptos.map(function (c) {
            var v = c.anterior ? ((c.actual - c.anterior) / c.anterior * 100) : null;
            return '<tr><td>' + esc(c.concepto) + '</td><td class="num mono">' + GA.num(c.anterior) + '</td><td class="num mono">' + GA.num(c.actual) + '</td><td class="num">' + (v === null ? 'Nuevo concepto' : (v >= 0 ? '+' : '') + v.toFixed(1).replace('.', ',') + ' %') + '</td></tr>';
          }).join('') + '</tbody></table></div></section>' +
          '<section class="panel"><div class="fila-entre"><h2>Muestra de control (' + l.muestra.length + ' cuentas)</h2>' +
          (l.estado === 'prebilled' ? '<button type="button" class="btn" data-act="marcarMuestra"' + (l.muestraRevisada ? ' disabled' : '') + '>' + (l.muestraRevisada ? 'Muestra revisada' : 'Marcar muestra como revisada') + '</button>' : '') + '</div>' +
          '<p class="hint">El prototipo muestra 3 cuentas de ejemplo; el universo de 100 casos es ilustrativo.</p><ul class="muestra">' +
          l.muestra.map(function (m, i) {
            return '<li><label class="check"><input type="checkbox" data-chg="muestraItem" data-i="' + i + '"' + (m.revisada || l.muestraRevisada ? ' checked' : '') + (l.estado !== 'prebilled' ? ' disabled' : '') + '> Cta. <span class="mono">' + m.cuentaId + '</span> · ' + esc(m.categoria) + ' · ' + esc(m.fiscal) + ' · <span class="mono">' + GA.ars(m.importe) + '</span></label>' +
              '<button type="button" class="btn btn--sm" data-act="verCalculo" data-i="' + i + '">Ver cálculo<span class="sr-only"> de la cuenta ' + m.cuentaId + '</span></button></li>';
          }).join('') + '</ul>' +
          '<div class="banda banda--warn">' + GA.ico('warn') + '<div><strong>Advertencias de variación (1)</strong><br>Cta. 0001 supera el umbral de variación respecto del período anterior (primera factura con instalación).</div></div></section>';
      } else if (tab === 'casos') {
        panel = '<div class="tabla-cont"><table class="tabla"><thead><tr><th scope="col">Cuenta</th><th scope="col">Titular</th><th scope="col">Categoría</th><th scope="col" class="num">Importe (ARS)</th><th scope="col">Estado del caso</th></tr></thead><tbody>' +
          l.muestra.map(function (m) { return '<tr><td class="mono">' + m.cuentaId + '</td><td>' + esc(q.nombreCuenta(m.cuentaId)) + '</td><td>' + esc(m.categoria) + '</td><td class="num mono">' + GA.num(m.importe) + '</td><td>' + GA.badgeTono('ok', 'Apto') + '</td></tr>'; }).join('') +
          '</tbody></table></div><p class="hint">Se listan solo las cuentas de ejemplo del prototipo.</p>';
      } else if (tab === 'excepciones') {
        panel = '<ul class="lista">' + l.listaExcepciones.map(function (x) { return '<li>' + GA.badgeTono('bad', 'Prevalidación bloqueada') + ' Cta. <span class="mono">' + x.cuenta + '</span> · ' + esc(x.motivo) + '</li>'; }).join('') + '</ul><p class="hint">Con aprobación parcial, las excepciones siguen en la bandeja (RF-FAC-044).</p>';
      } else {
        panel = '<ol class="timeline">' + l.auditoria.slice().reverse().map(function (a) { return '<li><span class="timeline__f">' + esc(a[0]) + '</span>' + esc(a[1]) + '</li>'; }).join('') + '</ol>';
      }
      return {
        meta: meta,
        html: GA.cabecera({
          migas: ['Facturación', 'Emisión', ['Lotes de facturación', '/admin/fac/lotes'], l.id], titulo: 'Lote ' + l.id,
          extra: '<p class="cab-pag__datos">Internet · Período ' + l.periodo + ' · ' + GA.badge('lote', l.estado) + '</p><p class="cab-pag__datos">Ciclo ' + l.ciclo + ' · Preparó: ' + esc(l.preparo) + (l.aprobo ? ' · Aprobó: ' + esc(l.aprobo) : '') + '</p>',
          acciones: enJob ? '' : acciones
        }) + '<div class="pag">' +
          (GA.ui.errLote ? '<div class="banda banda--bad" role="alert" tabindex="-1" id="err-lote">' + GA.ico('bad') + esc(GA.ui.errLote) + '</div>' : '') +
          (enJob ? '<div class="panel job" role="status"><h2>' + (l.estado === 'issuing' ? 'Emitiendo comprobantes' : 'Prefacturando') + '</h2><div class="barra" role="progressbar" aria-label="Progreso del proceso" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" id="job-barra"><span id="job-fill"></span></div><p id="job-txt" aria-live="polite">0 de ' + l.universo + ' casos procesados</p><p class="hint">El proceso sigue en segundo plano aunque cierres la pantalla.</p></div>' : '') +
          GA.pestanas('lote', tabs, tab, { label: 'Secciones del lote' }) + '<div id="panel-lote" role="tabpanel" aria-labelledby="tab-lote-' + tab + '">' + panel + '</div></div>',
        despues: function () { if (enJob) correrJob(l); }
      };
    }
  });

  var jobTimer = null;
  function correrJob(l) {
    clearInterval(jobTimer);
    var avance = 0;
    jobTimer = setInterval(function () {
      var fill = document.getElementById('job-fill');
      if (!fill) { clearInterval(jobTimer); terminarJob(l); return; }
      avance = Math.min(100, avance + 20);
      fill.style.width = avance + '%';
      document.getElementById('job-barra').setAttribute('aria-valuenow', String(avance));
      document.getElementById('job-txt').textContent = Math.round(l.universo * avance / 100) + ' de ' + l.universo + ' casos procesados';
      if (avance >= 100) { clearInterval(jobTimer); setTimeout(function () { terminarJob(l); GA.render(true); }, 400); }
    }, 450);
  }
  function terminarJob(l) {
    if (l.estado === 'issuing') { l.estado = 'approved'; GA.emitirLoteDirecto(l.id); GA.toast('Lote emitido. Los comprobantes ya figuran en el listado.'); }
    else if (l.estado === 'prebilling') {
      l.estado = 'prebilled';
      l.auditoria.push([GA.ahora(), 'Re-prefacturación terminada; la muestra vuelve a quedar sin revisar']);
      GA.toast('Prefacturación terminada.');
    }
    GA.guardar();
  }

  GA.inp.muestraItem = function (el) {
    var l = q.lote(GA.parseHash().path.split('/').pop());
    l.muestra[Number(el.getAttribute('data-i'))].revisada = el.checked;
    GA.guardar();
  };
  GA.acc.marcarMuestra = function () {
    var l = q.lote(GA.parseHash().path.split('/').pop());
    l.muestraRevisada = true;
    l.muestra.forEach(function (m) { m.revisada = true; });
    l.auditoria.push([GA.ahora(), 'Muestra de control marcada como revisada por ' + GA.e.sesion.usuario]);
    GA.ui.errLote = null;
    GA.toast('Muestra de control marcada como revisada.');
    GA.mutar();
  };
  GA.acc.verCalculo = function (el) {
    var l = q.lote(GA.parseHash().path.split('/').pop());
    var m = l.muestra[Number(el.getAttribute('data-i'))];
    var k = GA.e.contratos.filter(function (x) { return x.cuentaId === m.cuentaId; })[0];
    var pl = q.plan(k.planId);
    var inst = m.importe > pl.abono;
    GA.modal({
      titulo: 'Cálculo de la cuenta ' + m.cuentaId, tam: 'md',
      cuerpo: '<p>' + esc(q.nombreCuenta(m.cuentaId)) + ' · Contrato ' + k.id + ' · ' + esc(pl.nombre) + '</p><div class="tabla-cont"><table class="tabla"><thead><tr><th scope="col">Concepto</th><th scope="col" class="num">Importe (ARS)</th></tr></thead><tbody>' +
        '<tr><td>Abono mensual</td><td class="num mono">' + GA.num(pl.abono) + '</td></tr>' + (inst ? '<tr><td>Instalación (evento del ' + k.alta + ')</td><td class="num mono">' + GA.num(pl.instalacion) + '</td></tr>' : '') +
        '<tr><th scope="row">Total</th><td class="num mono">' + GA.num(m.importe) + '</td></tr></tbody></table></div><p class="hint">Prefacturar no numera, no consume ítems ni afecta saldos (RF-FAC-025).</p>',
      pie: '<button type="button" class="btn btn--pri" data-act="cerrarModal">Cerrar</button>'
    });
  };
  GA.acc.aprobarLote = function () {
    var l = q.lote(GA.parseHash().path.split('/').pop());
    if (!l.muestraRevisada) {
      GA.ui.errLote = 'Antes de aprobar, marcá la muestra de control como revisada (obligatorio en lotes de más de PRM-FAC-034 casos).';
      GA.render(true);
      document.getElementById('err-lote').focus();
      return;
    }
    GA.modal({
      titulo: 'Aprobar emisión del lote ' + l.id, tam: 'md',
      cuerpo: '<p>Universo ' + l.universo + ' · Aptos ' + l.aptos + ' · Excepciones ' + l.excepciones + ' (siguen pendientes)</p><p>Total <span class="mono">' + GA.ars(l.total) + '</span> · Muestra revisada: Sí</p>' +
        '<p class="hint">Aprobás como ' + esc(GA.e.sesion.usuario) + '; el lote lo preparó ' + esc(l.preparo) + ' (segregación de funciones).</p>' +
        '<form id="form-aprobar" data-form="aprobarLote">' + GA.campo({ id: 'apr-com', label: 'Comentario', type: 'textarea', attrs: 'autofocus' }) + '</form>',
      pie: '<button type="button" class="btn" data-act="cerrarModal">Cancelar</button><button type="submit" form="form-aprobar" class="btn btn--pri">Aprobar</button>'
    });
  };
  GA.form.aprobarLote = function (f) {
    var l = q.lote(GA.parseHash().path.split('/').pop());
    l.estado = 'approved';
    l.aprobo = GA.e.sesion.usuario;
    var com = f.querySelector('#apr-com').value.trim();
    l.auditoria.push([GA.ahora(), 'Lote aprobado por ' + l.aprobo + (com ? ': "' + com + '"' : '')]);
    GA.cerrarModal();
    GA.toast('Lote aprobado. Ya podés emitirlo.');
    GA.mutar();
  };
  GA.acc.emitirLote = function () {
    var l = q.lote(GA.parseHash().path.split('/').pop());
    l.estado = 'issuing';
    l.auditoria.push([GA.ahora(), 'Emisión iniciada por ' + GA.e.sesion.usuario]);
    GA.mutar();
  };
  GA.acc.reprefacturar = function () {
    var l = q.lote(GA.parseHash().path.split('/').pop());
    l.estado = 'prebilling';
    l.muestraRevisada = false;
    l.muestra.forEach(function (m) { m.revisada = false; });
    GA.mutar();
  };
  GA.acc.cancelarLote = function () {
    var l = q.lote(GA.parseHash().path.split('/').pop());
    GA.modal({
      titulo: 'Cancelar el lote ' + l.id, tam: 'md',
      cuerpo: '<p>Se descarta la prefacturación. No se emite ningún comprobante y el período queda sin lote.</p><form id="form-cancelar" data-form="cancelarLote">' +
        GA.campo({ id: 'can-id', label: 'Para confirmar, escribí el identificador del lote (' + l.id + ')', req: true, attrs: 'autofocus autocomplete="off"' }) + '</form>',
      pie: '<button type="button" class="btn" data-act="cerrarModal">Volver</button><button type="submit" form="form-cancelar" class="btn btn--peligro">Cancelar lote</button>'
    });
  };
  GA.form.cancelarLote = function (f) {
    var l = q.lote(GA.parseHash().path.split('/').pop());
    if (f.querySelector('#can-id').value.trim() !== l.id) { GA.toast('El identificador no coincide. El lote no se canceló.', 'bad'); return; }
    l.estado = 'cancelled';
    l.auditoria.push([GA.ahora(), 'Lote cancelado por ' + GA.e.sesion.usuario]);
    GA.cerrarModal();
    GA.toast('Lote cancelado. Podés restablecer el escenario con "Reiniciar datos".', 'warn');
    GA.mutar();
  };

  /* ---------- Comprobantes (W-05, PAN-FAC-09) ---------- */
  GA.ruta('/admin/fac/comprobantes', {
    app: 'admin', nav: 'comprobantes',
    render: function (p, query) {
      var periodos = GA.e.comprobantes.map(function (c) { return c.periodo; }).filter(function (v, i, a) { return a.indexOf(v) === i; }).sort(function (a, b) { return a.slice(3) + a.slice(0, 2) < b.slice(3) + b.slice(0, 2) ? 1 : -1; });
      var f = GA.ui.fc || (GA.ui.fc = { q: '', periodo: periodos[0] || 'todos', comercial: 'todos', fiscal: 'todos' });
      GA.ui.sel = GA.ui.sel || {};
      var t = f.q.trim().toLowerCase();
      var lista = GA.e.comprobantes.filter(function (c) {
        if (f.periodo !== 'todos' && c.periodo !== f.periodo) return false;
        var com = q.saldoComprobante(c) ? 'impaga' : 'pagada';
        if (f.comercial !== 'todos' && com !== f.comercial) return false;
        if (f.fiscal !== 'todos' && c.fiscal !== f.fiscal) return false;
        if (!t) return true;
        var per = q.persona(q.titularDeCuenta(c.cuentaId).personaId);
        return (c.numero + ' ' + c.cuentaId + ' ' + q.nombre(per) + ' ' + per.cuit).toLowerCase().indexOf(t) >= 0;
      });
      var chips = [];
      if (f.periodo !== 'todos') chips.push(['periodo', 'Período ' + f.periodo]);
      if (f.comercial !== 'todos') chips.push(['comercial', 'Estado comercial: ' + GA.etiquetaEstado('comercial', f.comercial)]);
      if (f.fiscal !== 'todos') chips.push(['fiscal', 'Estado fiscal: ' + GA.etiquetaEstado('fiscal', f.fiscal)]);
      if (t) chips.push(['q', 'Texto: ' + f.q]);
      var nSel = Object.keys(GA.ui.sel).filter(function (k) { return GA.ui.sel[k]; }).length;
      var total = lista.reduce(function (s, c) { return s + c.total; }, 0);
      var tabla = lista.length ? '<div class="tabla-cont"><table class="tabla"><caption class="sr-only">Comprobantes emitidos</caption><thead><tr><th scope="col"><span class="sr-only">Seleccionar</span></th><th scope="col">Tipo</th><th scope="col">Letra</th><th scope="col">Número</th><th scope="col">Fecha</th><th scope="col">Cuenta</th><th scope="col">Titular</th><th scope="col" class="num">Total (ARS)</th><th scope="col">Vto. 1</th><th scope="col">Estado fiscal</th><th scope="col">Estado comercial</th></tr></thead><tbody>' +
        lista.map(function (c) {
          var ti = q.titularDeCuenta(c.cuentaId);
          return '<tr><td><input type="checkbox" id="sel-' + c.id + '" data-chg="selFc" data-id="' + c.id + '"' + (GA.ui.sel[c.id] ? ' checked' : '') + ' aria-label="Seleccionar comprobante ' + c.numero + '"></td><td>' + c.tipo + '</td><td>' + c.letra + '</td>' +
            '<td><a class="mono" href="#/admin/fac/comprobantes/' + encodeURIComponent(c.id) + '">' + c.numero + '</a></td><td class="mono">' + c.fecha + '</td><td class="mono">' + c.cuentaId + '</td><td><a href="#/admin/per/titulares/' + ti.id + '">' + esc(q.nombreCuenta(c.cuentaId)) + '</a></td>' +
            '<td class="num mono">' + GA.num(c.total) + '</td><td class="mono">' + c.vto1 + '</td><td>' + GA.badge('fiscal', c.fiscal) + '</td><td>' + GA.badge('comercial', q.saldoComprobante(c) ? 'impaga' : 'pagada') + '</td></tr>';
        }).join('') + '</tbody></table></div>'
        : GA.vacio('No hay comprobantes con estos filtros', '', '<button type="button" class="btn" data-act="limpiarFc">Limpiar filtros</button>');
      return {
        meta: M('W-05', 'PAN-FAC-09', '/admin/fac/comprobantes', 'fac.comprobantes.ver', 'O4', 'Comprobantes', 'Buscar y consultar comprobantes emitidos y ejecutar acciones individuales o masivas.', 'T-FAC, T-ATE (consulta), T-GER'),
        html: GA.cabecera({ migas: ['Facturación', 'Comprobantes', 'Comprobantes emitidos'], titulo: 'Comprobantes', subtitulo: 'Facturas, notas de crédito y débito emitidas', acciones: '<button type="button" class="btn" data-act="noDisponible">Factura manual</button><button type="button" class="btn" data-act="noDisponible">Exportar ▾</button>' }) +
          '<div class="pag"><form class="filtros" data-form="buscarFc" role="search"><div class="campo campo--crece"><label for="fc-q">Número, cuenta, titular o CUIT</label><input id="fc-q" type="search" value="' + esc(f.q) + '"></div>' +
          GA.campo({ id: 'fc-periodo', label: 'Período', type: 'select', value: f.periodo, opciones: [['todos', 'Todos']].concat(periodos.map(function (x) { return [x, x]; })), attrs: 'data-chg="filtroFc" data-k="periodo"' }) +
          GA.campo({ id: 'fc-com', label: 'Estado comercial', type: 'select', value: f.comercial, opciones: [['todos', 'Todos'], ['impaga', 'Impaga'], ['pagada', 'Pagada']], attrs: 'data-chg="filtroFc" data-k="comercial"' }) +
          GA.campo({ id: 'fc-fis', label: 'Estado fiscal', type: 'select', value: f.fiscal, opciones: [['todos', 'Todos'], ['autorizado', 'Autorizado'], ['pendiente', 'Pendiente']], attrs: 'data-chg="filtroFc" data-k="fiscal"' }) +
          '<button type="submit" class="btn">Buscar</button></form>' +
          (chips.length ? '<div class="chips" aria-label="Filtros activos">Filtros activos: ' + chips.map(function (c) { return '<button type="button" class="chip" data-act="quitarFiltroFc" data-k="' + c[0] + '" aria-label="Quitar filtro ' + esc(c[1]) + '">' + esc(c[1]) + ' ×</button>'; }).join('') + ' <button type="button" class="btn-link" data-act="limpiarFc">Limpiar filtros</button></div>' : '') +
          tabla +
          '<div class="barra-masiva"><span aria-live="polite" id="sel-cont">' + nSel + ' seleccionado' + (nSel === 1 ? '' : 's') + '</span>' +
          ['Reimprimir', 'Reenviar', 'Bloquear', 'Anular / NC'].map(function (a) { return '<button type="button" class="btn btn--sm" data-act="masivaFc" data-a="' + a + '"' + (nSel ? '' : ' disabled') + '>' + a + '</button>'; }).join('') +
          '<span class="crece"></span><span>Total de la página: <strong class="mono">' + GA.ars(total) + '</strong></span></div></div>',
        despues: function () { if (query.id && !GA.ui.fcAbierto) { GA.ui.fcAbierto = true; abrirFc(query.id); } }
      };
    }
  });
  GA.form.buscarFc = function (f) { GA.ui.fc.q = f.querySelector('#fc-q').value; GA.render(true); };
  GA.inp.filtroFc = function (el) { GA.ui.fc[el.getAttribute('data-k')] = el.value; GA.render(true); };
  GA.acc.quitarFiltroFc = function (el) { var k = el.getAttribute('data-k'); GA.ui.fc[k] = k === 'q' ? '' : 'todos'; GA.render(true); var b = document.getElementById('fc-q'); if (b) b.focus(); };
  GA.acc.limpiarFc = function () { GA.ui.fc = { q: '', periodo: 'todos', comercial: 'todos', fiscal: 'todos' }; GA.render(true); };
  GA.inp.selFc = function (el) { GA.ui.sel[el.getAttribute('data-id')] = el.checked; GA.render(true); };
  GA.acc.masivaFc = function (el) {
    var ids = Object.keys(GA.ui.sel).filter(function (k) { return GA.ui.sel[k]; });
    var a = el.getAttribute('data-a');
    GA.modal({
      titulo: a + ': ' + ids.length + ' comprobante' + (ids.length === 1 ? '' : 's'), tam: 'md',
      cuerpo: '<p>Resumen previo de la acción masiva:</p><ul class="lista">' + ids.map(function (id) { var c = q.comprobante(id); return '<li class="mono">' + c.tipo + ' ' + c.letra + ' ' + c.numero + ' · ' + GA.ars(c.total) + '</li>'; }).join('') + '</ul>' +
        (a === 'Anular / NC' ? '<p class="banda banda--warn">' + GA.ico('warn') + 'Los comprobantes nunca se borran: se emite una nota de crédito. En el prototipo esta acción es simulada y no modifica datos.</p>' : '<p class="hint">Acción simulada en el prototipo.</p>'),
      pie: '<button type="button" class="btn" data-act="cerrarModal">Cancelar</button><button type="button" class="btn btn--pri" data-act="confirmarMasiva" data-a="' + a + '">Confirmar</button>'
    });
  };
  GA.acc.confirmarMasiva = function (el) { GA.cerrarModal(); GA.toast(el.getAttribute('data-a') + ': resultado por ítem OK (simulado).', 'info'); };
  GA.acc.verFc = function (el) { abrirFc(el.getAttribute('data-id')); };
  function htmlDetalleComprobante(c) {
    if (!c) return '<p>Comprobante no encontrado.</p>';
    var ti = q.titularDeCuenta(c.cuentaId);
    var saldo = q.saldoComprobante(c);
    return '<p class="cab-pag__datos">' + GA.badge('fiscal', c.fiscal) + ' ' + GA.badge('comercial', saldo ? 'impaga' : 'pagada') + '</p>' +
      '<dl class="dl dl--2"><dt>Titular</dt><dd><a href="#/admin/per/titulares/' + ti.id + '">' + esc(q.nombreCuenta(c.cuentaId)) + '</a></dd><dt>Cuenta</dt><dd class="mono">' + c.cuentaId + '</dd><dt>Período</dt><dd class="mono">' + c.periodo + '</dd><dt>Fecha de emisión</dt><dd class="mono">' + c.fecha + '</dd><dt>Vencimientos</dt><dd class="mono">' + c.vto1 + ' · ' + c.vto2 + '</dd><dt>Lote</dt><dd><a class="mono" href="#/admin/fac/lotes/' + c.loteId + '">' + c.loteId + '</a></dd>' +
      (c.contratoId ? '<dt>Contrato</dt><dd><a class="mono" href="#/admin/cat/contracts/' + c.contratoId + '">' + c.contratoId + '</a></dd>' : '') +
      '<dt>CAE</dt><dd class="mono">75000000000000 (simulado)</dd></dl>' +
      '<h2>Importes</h2><div class="tabla-cont"><table class="tabla"><caption class="sr-only">Renglones del comprobante</caption><thead><tr><th scope="col">Concepto</th><th scope="col" class="num">Importe (ARS)</th></tr></thead><tbody>' +
      c.renglones.map(function (r) { return '<tr><td>' + esc(r.concepto) + (r.explica ? '<p class="hint">' + esc(r.explica) + '</p>' : '') + '</td><td class="num mono">' + GA.num(r.importe) + '</td></tr>'; }).join('') +
      '<tr><th scope="row">Total</th><td class="num mono">' + GA.num(c.total) + '</td></tr><tr><th scope="row">Pagado</th><td class="num mono">' + GA.num(c.pagado) + '</td></tr><tr><th scope="row">Saldo</th><td class="num mono">' + GA.num(saldo) + '</td></tr></tbody></table></div>' +
      '<div class="acciones"><button type="button" class="btn" data-act="noDisponible">Descargar PDF</button><button type="button" class="btn" data-act="noDisponible">Reenviar por email</button>' +
      (saldo ? '<a class="btn btn--pri" href="#/admin/cob/caja/cobro?cuenta=' + c.cuentaId + '">Cobrar en caja</a>' : '') + '</div>' +
      '<p class="hint">Detalle del comprobante (PAN-FAC-10). Las acciones masivas siguen en el listado.</p>';
  }
  function abrirFc(id) {
    var c = q.comprobante(id);
    if (!c) return;
    GA.modal({
      titulo: c.tipo + ' ' + c.letra + ' ' + c.numero, tam: 'lg',
      cuerpo: htmlDetalleComprobante(c),
      pie: '<a class="btn" href="#/admin/fac/comprobantes/' + encodeURIComponent(c.id) + '" data-act="cerrarModal">Abrir pantalla completa</a><button type="button" class="btn btn--pri" data-act="cerrarModal">Cerrar</button>'
    });
  }

  GA.ruta('/admin/fac/comprobantes/:id', {
    app: 'admin', nav: 'comprobantes',
    render: function (p) {
      var c = q.comprobante(decodeURIComponent(p.id));
      var meta = M('—', 'PAN-FAC-10', '/admin/fac/comprobantes/:invoiceId', 'fac.comprobantes.ver', 'O4', 'Detalle del comprobante', 'Consultar un comprobante emitido con renglones, estados fiscal y comercial y acciones.', 'T-FAC, T-ATE (consulta), T-GER');
      if (!c) {
        return { meta: meta, html: GA.cabecera({ migas: [['Comprobantes', '/admin/fac/comprobantes']], titulo: 'Comprobante no encontrado' }) + '<div class="pag">' + GA.vacio('No existe este comprobante', '', '<a class="btn" href="#/admin/fac/comprobantes">Volver al listado</a>') + '</div>' };
      }
      meta.titulo = c.tipo + ' ' + c.letra + ' ' + c.numero;
      return {
        meta: meta,
        html: GA.cabecera({
          migas: ['Facturación', ['Comprobantes', '/admin/fac/comprobantes'], c.numero],
          titulo: meta.titulo,
          extra: '<p class="cab-pag__datos">Cuenta <span class="mono">' + c.cuentaId + '</span> · Período <span class="mono">' + c.periodo + '</span></p>',
          acciones: '<a class="btn" href="#/admin/fac/comprobantes">Volver al listado</a>'
        }) + '<div class="pag panel">' + htmlDetalleComprobante(c) + '</div>'
      };
    }
  });

  GA.ruta('/admin/cob/cuentas/:id', {
    app: 'admin', nav: 'cc',
    render: function (p) {
      var cuenta = q.cuenta(p.id);
      var meta = M('—', 'PAN-COB-01', '/admin/cob/cuentas/:currentAccountId', 'cob.cuentas.ver', 'O5', 'Cuenta corriente', 'Ver saldo, movimientos y acciones de cobranza de una cuenta.', 'T-CAJ, T-FAC, T-ATE');
      if (!cuenta) {
        return { meta: meta, html: GA.cabecera({ migas: ['Cobranza', 'Cuenta corriente'], titulo: 'Cuenta no encontrada' }) + '<div class="pag">' + GA.vacio('No existe la cuenta ' + p.id, '', '<a class="btn" href="#/admin/per/titulares">Buscar titular</a>') + '</div>' };
      }
      var ti = q.titular(cuenta.titularId);
      var mov = GA.movimientos([cuenta.id]);
      var saldo = q.saldoCuenta(cuenta.id);
      var impagos = q.impagosDe(cuenta.id).length;
      meta.titulo = 'Cuenta corriente · Cta. ' + cuenta.id;
      return {
        meta: meta,
        html: GA.cabecera({
          migas: ['Cobranza', 'Cuenta corriente', 'Cta. ' + cuenta.id],
          titulo: 'Cuenta corriente',
          subtitulo: q.nombreCuenta(cuenta.id) + ' · ' + esc(cuenta.domicilio),
          extra: '<p class="cab-pag__datos">Saldo <strong class="mono">' + GA.ars(saldo) + '</strong> · ' + (impagos ? GA.badgeTono('warn', impagos + ' factura' + (impagos > 1 ? 's' : '') + ' impaga' + (impagos > 1 ? 's' : '')) : GA.badgeTono('ok', 'Al día')) + '</p>',
          acciones: '<a class="btn btn--pri" href="#/admin/cob/caja/cobro?cuenta=' + cuenta.id + '">Cobrar en caja</a><a class="btn" href="#/admin/per/titulares/' + ti.id + '">Ficha del titular</a><a class="btn" href="#/admin/per/cuentas/' + cuenta.id + '">Ficha de la cuenta</a>'
        }) + '<div class="pag">' +
          (mov.length ? '<div class="tabla-cont"><table class="tabla"><caption class="sr-only">Movimientos</caption><thead><tr><th scope="col">Fecha</th><th scope="col">Movimiento</th><th scope="col" class="num">Debe</th><th scope="col" class="num">Haber</th><th scope="col" class="num">Saldo</th></tr></thead><tbody>' +
            mov.map(function (m) {
              var link = '';
              if (m.desc.indexOf('FC') === 0) {
                var fc = GA.e.comprobantes.filter(function (x) { return m.desc.indexOf(x.numero) >= 0; })[0];
                if (fc) link = ' <a href="#/admin/fac/comprobantes/' + encodeURIComponent(fc.id) + '" class="btn-link">Ver comprobante</a>';
              }
              return '<tr><td class="mono">' + m.fecha + '</td><td>' + esc(m.desc) + link + '</td><td class="num mono">' + (m.debe ? GA.num(m.debe) : '') + '</td><td class="num mono">' + (m.haber ? GA.num(m.haber) : '') + '</td><td class="num mono">' + GA.num(m.saldo) + '</td></tr>';
            }).join('') + '</tbody></table></div>' : GA.vacio('Sin movimientos', 'Todavía no hay comprobantes ni pagos en esta cuenta.')) +
          '<p class="hint">Vista operativa de Cobranza. La pestaña Cuenta corriente en la ficha 360 del titular es de solo lectura para otros roles.</p></div>'
      };
    }
  });

  /* ================= COBRANZA ================= */

  GA.ruta('/admin/cob/caja/apertura', {
    app: 'admin', nav: 'apertura',
    render: function () {
      var c = GA.e.caja;
      var cuerpo = c.abierta
        ? '<section class="panel"><h2>Sesión de caja abierta</h2><dl class="dl dl--2"><dt>Caja</dt><dd>' + esc(c.numero) + '</dd><dt>Cajero</dt><dd>' + esc(GA.e.sesion.usuario) + '</dd><dt>Fecha de negocio</dt><dd class="mono">' + c.fecha + '</dd><dt>Fondo inicial</dt><dd class="mono">' + GA.ars(c.fondo) + '</dd><dt>Cobrado en la sesión</dt><dd class="mono">' + GA.ars(c.cobrado) + ' (' + c.operaciones + ' operaciones)</dd></dl>' +
          '<div class="acciones"><a class="btn btn--pri" href="#/admin/cob/caja/cobro">Ir a cobrar</a><button type="button" class="btn" data-act="cerrarCaja">Cerrar caja y arqueo</button></div></section>'
        : '<form class="panel form-angosto" data-form="abrirCaja" novalidate><h2>Abrir sesión de caja</h2>' +
          GA.campo({ id: 'cj-caja', label: 'Caja', type: 'select', value: 'Caja 01', opciones: ['Caja 01', 'Caja 02'] }) +
          GA.campo({ id: 'cj-fecha', label: 'Fecha de negocio', value: GA.HOY, hint: 'Solo hoy, salvo permiso especial.', attrs: 'readonly' }) +
          GA.campo({ id: 'cj-fondo', label: 'Fondo inicial en efectivo (ARS)', value: '10.000,00', req: true, attrs: 'inputmode="decimal" autofocus', err: GA.ui.errCaja }) +
          '<button type="submit" class="btn btn--pri">Abrir caja</button></form>';
      return {
        meta: M('—', 'PAN-COB-09', '/admin/cob/caja/apertura', 'cob.caja.abrir', 'O5', 'Apertura de caja', 'Abrir la sesión de caja (requisito previo para cobrar en ventanilla).', 'T-CAJ, T-TES'),
        html: GA.cabecera({ migas: ['Cobranza', 'Caja', 'Apertura y cierre de caja'], titulo: 'Apertura y cierre de caja', extra: '<p class="cab-pag__datos">' + GA.badge('caja', c.abierta ? 'abierta' : 'cerrada') + '</p>' }) + '<div class="pag">' + cuerpo + '</div>'
      };
    }
  });
  GA.form.abrirCaja = function (f) {
    var fondo = GA.parseImporte(f.querySelector('#cj-fondo').value);
    if (isNaN(fondo) || fondo < 0) { GA.ui.errCaja = 'Ingresá un importe válido, por ejemplo 10.000,00.'; GA.render(true); document.getElementById('cj-fondo').focus(); return; }
    GA.e.caja = { abierta: true, numero: f.querySelector('#cj-caja').value, fecha: GA.HOY, fondo: fondo, cobrado: 0, operaciones: 0 };
    GA.guardar();
    GA.toast('Caja abierta.');
    GA.ir('/admin/cob/caja/cobro');
  };
  GA.acc.cerrarCaja = function () {
    var c = GA.e.caja;
    var teorico = c.fondo + GA.e.recibos.filter(function (r) { return r.sesionCaja; }).reduce(function (s, r) { return s + r.medios.filter(function (m) { return m.medio === 'Efectivo'; }).reduce(function (a, m) { return a + m.importe; }, 0) - r.vuelto; }, 0);
    GA.modal({
      titulo: 'Cierre y arqueo de ' + c.numero, tam: 'md',
      cuerpo: '<p>Efectivo teórico: <strong class="mono">' + GA.ars(teorico) + '</strong></p><form id="form-cierre" data-form="cerrarCaja" data-teorico="' + teorico + '">' + GA.campo({ id: 'ci-decl', label: 'Efectivo declarado (ARS)', value: GA.num(teorico), req: true, attrs: 'inputmode="decimal" autofocus' }) + '</form><p class="hint">Cierre y arqueo PAN-COB-12 (simplificado).</p>',
      pie: '<button type="button" class="btn" data-act="cerrarModal">Cancelar</button><button type="submit" form="form-cierre" class="btn btn--pri">Cerrar caja</button>'
    });
  };
  GA.form.cerrarCaja = function (f) {
    var d = GA.parseImporte(f.querySelector('#ci-decl').value);
    var dif = d - Number(f.getAttribute('data-teorico'));
    GA.e.caja.abierta = false;
    GA.e.recibos.forEach(function (r) { r.sesionCaja = false; });
    GA.cerrarModal();
    GA.toast(dif === 0 ? 'Caja cerrada sin diferencias.' : 'Caja cerrada con una diferencia de ' + GA.ars(dif) + ' a justificar.', dif === 0 ? 'ok' : 'warn');
    GA.mutar();
  };

  /* ---------- Cobro en ventanilla (W-07, PAN-COB-10) ---------- */
  function estadoCobro(cuentaId) {
    var impagos = q.impagosDe(cuentaId);
    var sel = {};
    impagos.forEach(function (c) { sel[c.id] = true; });
    return { cuentaId: cuentaId, sel: sel, medios: [{ medio: 'Efectivo', importe: '' }], vto: '1', parcial: null };
  }
  function totalCobro(st) { return q.impagosDe(st.cuentaId).filter(function (c) { return st.sel[c.id]; }).reduce(function (s, c) { return s + q.saldoComprobante(c); }, 0); }
  function entregado(st) { return st.medios.reduce(function (s, m) { var n = GA.parseImporte(m.importe); return s + (isNaN(n) ? 0 : n); }, 0); }

  GA.ruta('/admin/cob/caja/cobro', {
    app: 'admin', nav: 'cobro',
    render: function (p, query) {
      var c = GA.e.caja;
      var meta = M('W-07', 'PAN-COB-10', '/admin/cob/caja/cobro', 'cob.caja.cobrar', 'O5', 'Cobranza en caja', 'Cobrar en ventanilla obligaciones de una o varias cuentas con medios de pago combinados.', 'T-CAJ (cajero), T-TES (supervisión)');
      var cab = GA.cabecera({ migas: ['Cobranza', 'Caja', 'Cobranza en caja'], titulo: 'Cobranza en caja' });
      if (!c.abierta) {
        return { meta: meta, html: cab + '<div class="pag"><div class="banda banda--warn" role="status">' + GA.ico('warn') + '<div>No hay una sesión de caja abierta. Para cobrar, primero abrí la caja.</div></div><a class="btn btn--pri" href="#/admin/cob/caja/apertura">Abrir caja</a></div>' };
      }
      if (query.cuenta && !GA.ui.cobro && q.cuenta(query.cuenta)) GA.ui.cobro = estadoCobro(query.cuenta);
      var st = GA.ui.cobro;
      var barra = '<p class="sesion-caja">' + esc(c.numero) + ' · Cajero: ' + esc(GA.e.sesion.usuario) + ' · Fecha ' + c.fecha + ' · Cobrado en la sesión <span class="mono">' + GA.ars(c.cobrado) + '</span></p>';
      var buscador = '<form class="filtros" data-form="buscarCobro" role="search"><div class="campo campo--crece"><label for="cob-q">Cuenta, documento, nombre, código de barras o identificador de pago</label><input id="cob-q" type="search" value="' + esc(GA.ui.cobroQ || '') + '" autocomplete="off"' + (st ? '' : ' autofocus') + '></div><button type="submit" class="btn">Buscar</button></form>';
      var cuerpo;
      if (!st) {
        cuerpo = GA.ui.cobroNoHallado ? GA.vacio('No encontramos una cuenta con ese dato', 'Probá con el número de cuenta (por ejemplo 0001), el DNI o el nombre.') : GA.vacio('Buscá una cuenta o leé un código de barras', 'Ejemplo del prototipo: cuenta 0001.');
      } else {
        var impagos = q.impagosDe(st.cuentaId);
        var total = totalCobro(st);
        var ent = entregado(st);
        var vuelto = Math.max(0, ent - total);
        var otras = q.cuentasDe(q.cuenta(st.cuentaId).titularId).filter(function (x) { return x.id !== st.cuentaId && q.saldoCuenta(x.id) > 0; });
        cuerpo = '<p class="avisos">' + GA.badgeTono('info', 'Sin notas ni bloqueos') + GA.badgeTono(otras.length ? 'warn' : 'info', otras.length ? 'Deuda en otras cuentas' : 'Sin deuda en otras cuentas') + '</p>' +
          (impagos.length ? '<div class="cobro"><section class="panel"><h2>' + esc(q.nombreCuenta(st.cuentaId)) + ' · Cta. <span class="mono">' + st.cuentaId + '</span></h2><div class="tabla-cont"><table class="tabla"><caption class="sr-only">Obligaciones pendientes</caption><thead><tr><th scope="col"><span class="sr-only">Cobrar</span></th><th scope="col">Comprobante</th><th scope="col">Servicio</th><th scope="col">Vto.</th><th scope="col" class="num">Saldo (ARS)</th></tr></thead><tbody>' +
            impagos.map(function (f) { return '<tr><td><input type="checkbox" data-chg="cobroSel" data-id="' + f.id + '"' + (st.sel[f.id] ? ' checked' : '') + ' aria-label="Cobrar ' + f.tipo + ' ' + f.letra + ' ' + f.numero + '"></td><td class="mono">' + f.tipo + ' ' + f.letra + ' ' + f.numero + '</td><td>Internet</td><td class="mono">' + f.vto1 + '</td><td class="num mono">' + GA.num(q.saldoComprobante(f)) + '</td></tr>'; }).join('') +
            '</tbody></table></div>' + GA.campo({ id: 'cob-vto', label: 'Vencimiento a aplicar', type: 'select', value: st.vto, opciones: [['1', '1er vencimiento (sin recargo)'], ['2', '2do vencimiento']], attrs: 'data-chg="cobroVto"' }) + '</section>' +
            '<aside class="panel resumen" aria-labelledby="t-res"><h2 id="t-res">Resumen</h2><dl class="dl-num"><dt>Capital</dt><dd class="mono">' + GA.num(total) + '</dd><dt>Recargos</dt><dd class="mono">0,00</dd><dt>Intereses</dt><dd class="mono">0,00</dd><dt>Descuentos</dt><dd class="mono">0,00</dd><dt class="total">Total</dt><dd class="mono total">' + GA.num(total) + '</dd></dl></aside></div>' +
            '<section class="panel"><h2>Medios de pago</h2>' + st.medios.map(function (m, i) {
              return '<div class="medio">' + GA.campo({ id: 'med-' + i, label: 'Medio ' + (i + 1), type: 'select', value: m.medio, opciones: ['Efectivo', 'Tarjeta de débito', 'Transferencia', 'Cheque'], attrs: 'data-chg="medioTipo" data-i="' + i + '"' }) +
                GA.campo({ id: 'imp-' + i, label: 'Importe (ARS)', value: m.importe, attrs: 'inputmode="decimal" data-inp="medioImporte" data-i="' + i + '"' }) +
                (st.medios.length > 1 ? '<button type="button" class="btn btn--sm" data-act="quitarMedio" data-i="' + i + '">Quitar<span class="sr-only"> medio ' + (i + 1) + '</span></button>' : '') + '</div>';
            }).join('') + '<button type="button" class="btn btn--sm" data-act="agregarMedio">+ Agregar medio</button></section>' +
            '<div class="pie-cobro" ><p>Total <strong class="mono" id="pie-total">' + GA.ars(total) + '</strong> · Entregado <strong class="mono" id="pie-ent">' + GA.ars(ent) + '</strong> · Vuelto <strong class="mono" id="pie-vuelto" aria-live="polite">' + GA.ars(vuelto) + '</strong></p>' +
            '<div class="acciones"><button type="button" class="btn" data-act="entregaParcial">Entrega parcial</button><button type="button" class="btn btn--pri" data-act="confirmarCobro" aria-keyshortcuts="F10">Confirmar (F10)</button></div></div>'
            : GA.vacio('La cuenta no tiene obligaciones pendientes', 'Podés cobrar conceptos o anticipos (no incluido en el prototipo).', '<a class="btn" href="#/admin/per/titulares/' + q.cuenta(st.cuentaId).titularId + '">Ver ficha del titular</a>'));
      }
      return { meta: meta, html: cab + '<div class="pag">' + barra + buscador + cuerpo + '</div>', despues: function () { GA.teclaF10 = st ? GA.acc.confirmarCobro : null; } };
    }
  });
  GA.form.buscarCobro = function (f) {
    var v = f.querySelector('#cob-q').value;
    GA.ui.cobroQ = v;
    var c = q.buscarCuenta(v);
    GA.ui.cobro = c ? estadoCobro(c.id) : null;
    GA.ui.cobroNoHallado = !c;
    GA.render(true);
    var imp = document.getElementById('imp-0');
    if (imp) imp.focus();
  };
  function refrescarPie() {
    var st = GA.ui.cobro;
    var total = totalCobro(st);
    var ent = entregado(st);
    document.getElementById('pie-ent').textContent = GA.ars(ent);
    document.getElementById('pie-vuelto').textContent = GA.ars(Math.max(0, ent - total));
  }
  GA.inp.medioImporte = function (el) { GA.ui.cobro.medios[Number(el.getAttribute('data-i'))].importe = el.value; refrescarPie(); };
  GA.inp.medioTipo = function (el) { GA.ui.cobro.medios[Number(el.getAttribute('data-i'))].medio = el.value; };
  GA.inp.cobroSel = function (el) { GA.ui.cobro.sel[el.getAttribute('data-id')] = el.checked; GA.render(true); };
  GA.inp.cobroVto = function (el) { GA.ui.cobro.vto = el.value; };
  GA.acc.agregarMedio = function () { GA.ui.cobro.medios.push({ medio: 'Transferencia', importe: '' }); GA.render(true); var i = document.getElementById('imp-' + (GA.ui.cobro.medios.length - 1)); if (i) i.focus(); };
  GA.acc.quitarMedio = function (el) { GA.ui.cobro.medios.splice(Number(el.getAttribute('data-i')), 1); GA.render(true); };
  GA.acc.entregaParcial = function () {
    GA.modal({
      titulo: 'Entrega parcial', tam: 'md',
      cuerpo: '<form id="form-parcial" data-form="entregaParcial" novalidate>' + GA.campo({ id: 'par-imp', label: 'Importe a cobrar (ARS)', req: true, attrs: 'inputmode="decimal" autofocus' }) +
        GA.campo({ id: 'par-mot', label: 'Motivo', type: 'select', opciones: ['El socio no dispone del total', 'Acuerdo con atención'] }) + '<p class="hint">Requiere el permiso cob.caja.cobrarParcial.</p></form>',
      pie: '<button type="button" class="btn" data-act="cerrarModal">Cancelar</button><button type="submit" form="form-parcial" class="btn btn--pri">Aplicar</button>'
    });
  };
  GA.form.entregaParcial = function (f) {
    var n = GA.parseImporte(f.querySelector('#par-imp').value);
    var total = totalCobro(GA.ui.cobro);
    if (isNaN(n) || n <= 0 || n >= total) { GA.toast('El importe parcial debe ser mayor que 0 y menor que ' + GA.ars(total) + '.', 'bad'); return; }
    GA.ui.cobro.parcial = { importe: n, motivo: f.querySelector('#par-mot').value };
    GA.ui.cobro.medios = [{ medio: 'Efectivo', importe: GA.num(n) }];
    GA.cerrarModal();
    GA.toast('Entrega parcial de ' + GA.ars(n) + ' aplicada.', 'info');
    GA.render(true);
  };
  GA.acc.confirmarCobro = function () {
    var st = GA.ui.cobro;
    if (!st || document.getElementById('modal').open) return;
    var total = st.parcial ? st.parcial.importe : totalCobro(st);
    var ent = entregado(st);
    var errores = [];
    if (!total) errores.push('Seleccioná al menos un comprobante.');
    if (ent < total) errores.push('La suma de los medios (' + GA.ars(ent) + ') no cubre el total (' + GA.ars(total) + '). Completá los medios o registrá una entrega parcial.');
    var noEfectivo = st.medios.filter(function (m) { return m.medio !== 'Efectivo'; }).reduce(function (s, m) { var n = GA.parseImporte(m.importe); return s + (isNaN(n) ? 0 : n); }, 0);
    if (noEfectivo > total) errores.push('Solo el efectivo puede generar vuelto.');
    if (errores.length) {
      GA.modal({ titulo: 'Validaciones', tam: 'md', cuerpo: '<ul class="lista">' + errores.map(function (e) { return '<li>' + GA.badgeTono('bad', 'Bloqueante') + ' ' + esc(e) + '</li>'; }).join('') + '</ul>', pie: '<button type="button" class="btn btn--pri" data-act="cerrarModal" autofocus>Volver al cobro</button>' });
      return;
    }
    GA.modal({
      titulo: 'Confirmar cobro', tam: 'md',
      cuerpo: '<p>Cuenta <span class="mono">' + st.cuentaId + '</span> · ' + esc(q.nombreCuenta(st.cuentaId)) + '</p><dl class="dl-num"><dt>Total a cobrar</dt><dd class="mono">' + GA.num(total) + '</dd><dt>Entregado</dt><dd class="mono">' + GA.num(ent) + '</dd><dt>Vuelto</dt><dd class="mono">' + GA.num(Math.max(0, ent - total)) + '</dd></dl>' + (st.parcial ? '<p>' + GA.badgeTono('warn', 'Entrega parcial') + ' ' + esc(st.parcial.motivo) + '</p>' : ''),
      pie: '<button type="button" class="btn" data-act="cerrarModal">Volver</button><button type="button" class="btn btn--pri" data-act="registrarCobro" autofocus>Confirmar cobro</button>'
    });
  };
  GA.acc.registrarCobro = function () {
    var st = GA.ui.cobro;
    var restante = st.parcial ? st.parcial.importe : totalCobro(st);
    var total = restante;
    var ent = entregado(st);
    var fcs = q.impagosDe(st.cuentaId).filter(function (c) { return st.sel[c.id]; });
    var aplicados = [];
    fcs.forEach(function (c) { if (restante <= 0) return; var a = Math.min(restante, q.saldoComprobante(c)); c.pagado += a; restante -= a; aplicados.push(c.id); });
    var id = 'RC-0001-' + GA.sig('recibo', 8);
    var medios = st.medios.map(function (m) { return { medio: m.medio, importe: GA.parseImporte(m.importe) || 0 }; }).filter(function (m) { return m.importe > 0; });
    GA.e.recibos.push({ id: id, fecha: GA.HOY, cuentaId: st.cuentaId, comprobantes: aplicados, medios: medios, total: total, entregado: ent, vuelto: Math.max(0, ent - total), canal: GA.e.caja.numero, sesionCaja: true });
    GA.e.caja.cobrado += total;
    GA.e.caja.operaciones++;
    GA.e.historia.unshift({ fecha: GA.ahora(), titularId: q.cuenta(st.cuentaId).titularId, texto: 'Cobro en ' + GA.e.caja.numero + ' por ' + GA.ars(total) + ' (recibo ' + id + ')' });
    GA.ui.cobro = null;
    GA.ui.cobroQ = '';
    GA.guardar();
    GA.render(true);
    abrirRecibo(id, true);
  };

  function abrirRecibo(id, recien) {
    var r = q.recibo(id);
    GA.modal({
      titulo: (recien ? 'Cobro registrado · ' : '') + 'Recibo ' + r.id, tam: 'md',
      cuerpo: '<div class="recibo"><p class="recibo__coop">Cooperativa Ejemplo · CUIT ' + GA.cuitConDv('30', '00000000') + ' (ficticio)</p><dl class="dl dl--2"><dt>Fecha</dt><dd class="mono">' + r.fecha + '</dd><dt>Cuenta</dt><dd class="mono">' + r.cuentaId + '</dd><dt>Titular</dt><dd>' + esc(q.nombreCuenta(r.cuentaId)) + '</dd><dt>Canal</dt><dd>' + esc(r.canal) + '</dd></dl>' +
        '<p>Comprobantes cancelados: ' + r.comprobantes.map(function (cid) { var c = q.comprobante(cid); return '<span class="mono">' + c.tipo + ' ' + c.letra + ' ' + c.numero + '</span>'; }).join(', ') + '</p>' +
        '<dl class="dl-num">' + r.medios.map(function (m) { return '<dt>' + esc(m.medio) + '</dt><dd class="mono">' + GA.num(m.importe) + '</dd>'; }).join('') + '<dt>Vuelto</dt><dd class="mono">' + GA.num(r.vuelto) + '</dd><dt class="total">Total cobrado</dt><dd class="mono total">' + GA.num(r.total) + '</dd></dl>' +
        '<p class="hint">Código de validación del recibo: simulado. La impresión la hace el agente local (no incluido).</p></div>',
      pie: '<button type="button" class="btn" data-act="imprimirRecibo">' + (recien ? 'Imprimir' : 'Reimprimir (duplicado)') + '</button><a class="btn" href="#/admin/cob/recibos" data-act="cerrarModal">Ver recibos</a><button type="button" class="btn btn--pri" data-act="cerrarModal" autofocus>' + (recien ? 'Nuevo cobro' : 'Cerrar') + '</button>'
    });
  }
  GA.acc.imprimirRecibo = function () { GA.toast('Impresión enviada al agente local (simulado).', 'info'); };

  GA.ruta('/admin/cob/recibos', {
    app: 'admin', nav: 'recibos',
    render: function (p, query) {
      return {
        meta: M('—', 'PAN-COB-14', '/admin/cob/recibos', 'cob.recibos.ver', 'O5', 'Recibos', 'Consultar, reimprimir y enviar recibos.', 'T-CAJ, T-TES'),
        html: GA.cabecera({ migas: ['Cobranza', 'Caja', 'Recibos'], titulo: 'Recibos' }) +
          '<div class="pag"><div class="tabla-cont"><table class="tabla"><caption class="sr-only">Recibos</caption><thead><tr><th scope="col">Recibo</th><th scope="col">Fecha</th><th scope="col">Cuenta</th><th scope="col">Titular</th><th scope="col">Canal</th><th scope="col" class="num">Total (ARS)</th></tr></thead><tbody>' +
          GA.e.recibos.slice().reverse().map(function (r) { return '<tr><td><a href="#" class="mono" data-act="verRecibo" data-id="' + r.id + '">' + r.id + '</a></td><td class="mono">' + r.fecha + '</td><td class="mono">' + r.cuentaId + '</td><td>' + esc(q.nombreCuenta(r.cuentaId)) + '</td><td>' + esc(r.canal) + '</td><td class="num mono">' + GA.num(r.total) + '</td></tr>'; }).join('') +
          '</tbody></table></div></div>',
        despues: function () { if (query.id && !GA.ui.recAbierto) { GA.ui.recAbierto = true; abrirRecibo(query.id); } }
      };
    }
  });
  GA.acc.verRecibo = function (el) { abrirRecibo(el.getAttribute('data-id')); };

  /* ================= ATENCIÓN ================= */

  GA.ruta('/admin/crm/bandeja', {
    app: 'admin', nav: 'bandeja',
    render: function (p, query) {
      var yo = GA.e.sesion.usuario;
      var tab = GA.ui.bandeja || 'area';
      var clase = GA.ui.clase !== undefined ? GA.ui.clase : (query.clase || 'todas');
      var base = GA.e.casos.filter(function (c) { return clase === 'todas' || c.clase === clase; });
      var abiertos = base.filter(function (c) { return c.estado !== 'resuelto'; });
      var cuentas = {
        mios: abiertos.filter(function (c) { return c.responsable === yo; }),
        area: abiertos,
        espera: abiertos.filter(function (c) { return c.estado === 'esperaSocio'; }),
        vencidos: abiertos.filter(function (c) { return c.vencido; }),
        resueltos: base.filter(function (c) { return c.estado === 'resuelto'; })
      };
      var lista = cuentas[tab];
      var tarjeta = function (c) {
        return '<li class="caso' + (c.vencido && c.estado !== 'resuelto' ? ' caso--vencido' : '') + '"><div class="caso__cab"><a class="mono" href="#/admin/crm/casos/' + c.id + '">' + c.id + '</a> ' + GA.badge('prioridad', c.prioridad) + ' <strong>' + esc(c.asunto) + '</strong></div>' +
          '<p>' + esc(q.nombreCuenta(c.cuentaId)) + ' · Cta. <span class="mono">' + c.cuentaId + '</span> · ' + esc(c.clase.charAt(0).toUpperCase() + c.clase.slice(1)) + '</p>' +
          '<p>' + GA.badge('caso', c.estado) + ' Responsable: ' + esc(c.responsable) + ' · Canal: ' + esc(c.canal) + ' · Vence SLA: <span class="mono">' + esc(c.vence) + '</span>' + (c.vencido && c.estado !== 'resuelto' ? ' ' + GA.badgeTono('bad', 'SLA vencido') : '') + '</p>' +
          (c.sinIntervencion ? '<p>Sin intervención: ' + esc(c.sinIntervencion) + '</p>' : '') +
          '<div class="acciones">' + (c.responsable !== yo && c.estado !== 'resuelto' ? '<button type="button" class="btn btn--sm" data-act="tomarCaso" data-id="' + c.id + '">Tomar<span class="sr-only"> caso ' + c.id + '</span></button>' : '') + '<a class="btn btn--sm" href="#/admin/crm/casos/' + c.id + '">Abrir<span class="sr-only"> caso ' + c.id + '</span></a></div></li>';
      };
      var grupos = tab === 'resueltos' ? [['Resueltos', lista]] : [['Vencidos', lista.filter(function (c) { return c.vencido; })], ['Hoy', lista.filter(function (c) { return !c.vencido && c.vence.indexOf(GA.HOY) === 0; })], ['Próximos días', lista.filter(function (c) { return !c.vencido && c.vence.indexOf(GA.HOY) !== 0; })]];
      var cuerpo = lista.length ? grupos.filter(function (g) { return g[1].length; }).map(function (g) { return '<section><h2 class="grupo">' + g[0] + '</h2><ul class="casos">' + g[1].map(tarjeta).join('') + '</ul></section>'; }).join('')
        : GA.vacio(tab === 'mios' ? 'No tenés casos asignados' : 'No hay casos en esta vista', '', tab === 'mios' ? '<button type="button" class="btn" data-act="tab" data-grupo="bandeja" data-valor="area">Ver Mi área</button>' : '');
      return {
        meta: M('W-08', 'PAN-CRM-02', '/admin/crm/bandeja' + (clase !== 'todas' ? '?clase=' + clase : ''), 'crm.casos.ver', 'O2–O3', 'Bandeja de atención', 'Atender los casos del área y propios, ordenados por vencimiento de SLA.', 'T-ATE, T-SAT, empleados resolutores'),
        html: GA.cabecera({ migas: ['Atención', 'Casos', clase === 'reclamo' ? 'Reclamos' : 'Bandeja'], titulo: 'Bandeja de atención', subtitulo: 'Casos de mi área y asignados a mí', acciones: '<button type="button" class="btn btn--pri" data-act="nuevoCaso">Nuevo caso</button><button type="button" class="btn" data-act="noDisponible">Exportar</button>' }) +
          '<div class="pag">' + GA.pestanas('bandeja', [['mios', 'Mis casos', cuentas.mios.length], ['area', 'Mi área', cuentas.area.length], ['espera', 'En espera del socio', cuentas.espera.length], ['vencidos', 'Vencidos', cuentas.vencidos.length], ['resueltos', 'Resueltos', cuentas.resueltos.length]], tab, { label: 'Vistas de la bandeja' }) +
          '<div class="filtros">' + GA.campo({ id: 'bj-clase', label: 'Clase', type: 'select', value: clase, opciones: [['todas', 'Todas'], ['reclamo', 'Reclamo'], ['solicitud', 'Solicitud'], ['consulta', 'Consulta']], attrs: 'data-chg="claseBandeja"' }) +
          GA.campo({ id: 'bj-serv', label: 'Servicio', type: 'select', value: 'INT', opciones: [['INT', 'Internet']] }) + '</div>' +
          '<div id="panel-bandeja" role="tabpanel" aria-labelledby="tab-bandeja-' + tab + '">' + cuerpo + '</div></div>'
      };
    }
  });
  GA.inp.claseBandeja = function (el) { GA.ui.clase = el.value; GA.render(true); };
  GA.acc.tomarCaso = function (el) {
    var c = q.caso(el.getAttribute('data-id'));
    c.responsable = GA.e.sesion.usuario;
    if (c.estado === 'recibido') c.estado = 'enCurso';
    c.linea.push({ fecha: GA.ahora(), autor: 'Sistema', texto: 'Caso tomado por ' + c.responsable, tipo: 'sistema' });
    GA.toast('Tomaste el caso ' + c.id + '.');
    GA.mutar();
  };
  GA.acc.nuevoCaso = function () {
    GA.modal({
      titulo: 'Nuevo caso', tam: 'lg',
      cuerpo: '<form id="form-caso" data-form="nuevoCaso" novalidate>' +
        GA.campo({ id: 'nc-cta', label: 'Cuenta', type: 'select', req: true, opciones: GA.e.cuentas.map(function (c) { return [c.id, 'Cta. ' + c.id + ' · ' + q.nombreCuenta(c.id)]; }), attrs: 'autofocus' }) +
        GA.campo({ id: 'nc-clase', label: 'Clase', type: 'select', opciones: [['reclamo', 'Reclamo'], ['solicitud', 'Solicitud'], ['consulta', 'Consulta']] }) +
        GA.campo({ id: 'nc-asunto', label: 'Motivo', type: 'select', opciones: ['Sin servicio de Internet', 'Lentitud intermitente', 'Consulta de facturación', 'Cambio de plan'] }) +
        GA.campo({ id: 'nc-desc', label: 'Descripción', type: 'textarea', req: true }) + '</form>',
      pie: '<button type="button" class="btn" data-act="cerrarModal">Cancelar</button><button type="submit" form="form-caso" class="btn btn--pri">Crear caso</button>'
    });
  };
  GA.form.nuevoCaso = function (f) {
    var desc = f.querySelector('#nc-desc').value.trim();
    if (!desc) { GA.toast('Escribí una descripción.', 'bad'); f.querySelector('#nc-desc').focus(); return; }
    var cta = f.querySelector('#nc-cta').value;
    var k = q.contratosDe(cta)[0];
    var id = '2026-' + GA.sig('caso', 6);
    GA.e.casos.push({ id: id, clase: f.querySelector('#nc-clase').value, prioridad: 'normal', asunto: f.querySelector('#nc-asunto').value, cuentaId: cta, contratoId: k ? k.id : null, estado: 'enCurso', canal: 'ventanilla', vence: '06-11-2026 17:00', responsable: GA.e.sesion.usuario, otId: null, area: 'Técnica', linea: [{ fecha: GA.ahora(), autor: GA.e.sesion.usuario, texto: desc, tipo: 'nota' }] });
    GA.guardar();
    GA.cerrarModal();
    GA.toast('Caso ' + id + ' creado.');
    GA.ir('/admin/crm/casos/' + id);
  };

  /* ---------- Expediente del caso (W-08, PAN-CRM-03) ---------- */
  GA.ruta('/admin/crm/casos/:id', {
    app: 'admin', nav: 'bandeja',
    render: function (p) {
      var c = q.caso(p.id);
      var meta = M('W-08', 'PAN-CRM-03', '/admin/crm/casos/' + p.id, 'crm.casos.ver · crm.casos.responder · crm.casos.resolver', 'O2–O3', 'Caso ' + p.id, 'Expediente del caso: contexto, línea de tiempo y vínculos.', 'T-ATE, T-SAT');
      if (!c) return { meta: meta, html: GA.cabecera({ migas: [['Bandeja', '/admin/crm/bandeja']], titulo: 'Caso no encontrado' }) };
      var yo = GA.e.sesion.usuario;
      var k = c.contratoId ? q.contrato(c.contratoId) : null;
      var ot = c.otId ? q.ot(c.otId) : null;
      var abierto = c.estado !== 'resuelto';
      var acciones = abierto ? ((c.responsable !== yo ? '<button type="button" class="btn btn--pri" data-act="tomarCaso" data-id="' + c.id + '">Tomar</button>' : '') +
        '<button type="button" class="btn' + (c.responsable === yo ? ' btn--pri' : '') + '" data-act="responderCaso" data-tipo="mensaje">Responder al socio</button><button type="button" class="btn" data-act="responderCaso" data-tipo="nota">Nota interna</button>' +
        '<button type="button" class="btn" data-act="resolverCaso">Resolver</button>') : '';
      return {
        meta: meta,
        html: GA.cabecera({
          migas: ['Atención', ['Bandeja', '/admin/crm/bandeja'], 'Caso ' + c.id], titulo: 'Caso ' + c.id + ' · ' + c.asunto,
          extra: '<p class="cab-pag__datos">' + GA.badge('caso', c.estado) + ' ' + GA.badge('prioridad', c.prioridad, '(prioridad)') + ' · ' + esc(c.clase) + ' · Canal ' + esc(c.canal) + ' · Responsable: ' + esc(c.responsable) + ' · Vence SLA <span class="mono">' + esc(c.vence) + '</span>' + (c.vencido && abierto ? ' ' + GA.badgeTono('bad', 'SLA vencido') : '') + '</p>',
          acciones: acciones
        }) +
          '<div class="pag"><div class="expediente">' +
          '<section class="panel" aria-labelledby="t-ctx"><h2 id="t-ctx">Contexto</h2><p><a href="#/admin/per/titulares/' + q.cuenta(c.cuentaId).titularId + '">' + esc(q.nombreCuenta(c.cuentaId)) + '</a></p><p>Cta. <span class="mono">' + c.cuentaId + '</span>' + (k ? ' · <span class="mono">' + k.id + '</span>' : '') + '</p><p>' + esc(q.cuenta(c.cuentaId).domicilio) + '</p><p>Deuda (lectura): <span class="mono">' + GA.ars(q.saldoCuenta(c.cuentaId)) + '</span></p></section>' +
          '<section class="panel" aria-labelledby="t-lin"><h2 id="t-lin">Línea de tiempo</h2><ol class="timeline">' + c.linea.map(function (l) {
            return '<li class="tl--' + l.tipo + '"><span class="timeline__f">' + esc(l.fecha) + ' · ' + esc(l.autor) + '</span>' + (l.tipo === 'nota' ? '<span class="etq-nota">Nota interna</span> ' : l.tipo === 'respuesta' ? '<span class="etq-resp">Visible para el socio</span> ' : '') + esc(l.texto) + '</li>';
          }).join('') + '</ol></section>' +
          '<section class="panel" aria-labelledby="t-vin"><h2 id="t-vin">Vínculos</h2>' +
          (ot ? '<p><a href="#/admin/tec/work-orders/' + ot.id + '">OT ' + ot.id + '</a> ' + GA.badge('ot', ot.estado) + '</p>' : '<p>Sin orden de trabajo.</p>' + (abierto && c.clase !== 'consulta' ? '<button type="button" class="btn btn--sm btn--pri" data-act="crearOt">Crear OT</button>' : '')) +
          (k ? '<p>Contrato <span class="mono">' + k.id + '</span> ' + GA.badge('contrato', k.estado) + '</p>' : '') +
          '<p class="hint">Propuesta de IA: disponible desde O6 (DEC-056); no se incluye en el prototipo.</p></section></div></div>'
      };
    }
  });
  function casoActual() { return q.caso(GA.parseHash().path.split('/').pop()); }
  GA.acc.responderCaso = function (el) {
    var tipo = el.getAttribute('data-tipo');
    GA.modal({
      titulo: tipo === 'nota' ? 'Nota interna' : 'Responder al socio', tam: 'md',
      cuerpo: '<form id="form-resp" data-form="responderCaso" data-tipo="' + tipo + '">' + GA.campo({ id: 'resp-txt', label: tipo === 'nota' ? 'Nota (nunca llega al socio)' : 'Mensaje para el socio', type: 'textarea', req: true, attrs: 'autofocus maxlength="1000"' }) + '</form>',
      pie: '<button type="button" class="btn" data-act="cerrarModal">Cancelar</button><button type="submit" form="form-resp" class="btn btn--pri">' + (tipo === 'nota' ? 'Guardar nota' : 'Enviar') + '</button>'
    });
  };
  GA.form.responderCaso = function (f) {
    var t = f.querySelector('#resp-txt').value.trim();
    if (!t) { GA.toast('Escribí el texto.', 'bad'); return; }
    var c = casoActual();
    var tipo = f.getAttribute('data-tipo');
    c.linea.push({ fecha: GA.ahora(), autor: GA.e.sesion.usuario, texto: t, tipo: tipo === 'nota' ? 'nota' : 'respuesta' });
    if (c.estado === 'recibido') c.estado = 'enCurso';
    GA.cerrarModal();
    GA.toast(tipo === 'nota' ? 'Nota interna guardada.' : 'Respuesta enviada al socio (estado de entrega: enviado).');
    GA.mutar();
  };
  GA.acc.resolverCaso = function () {
    var c = casoActual();
    var ot = c.otId ? q.ot(c.otId) : null;
    GA.modal({
      titulo: 'Resolver el caso ' + c.id, tam: 'md',
      cuerpo: (ot && ot.estado !== 'closed' ? '<p class="banda banda--warn">' + GA.ico('warn') + 'La OT ' + ot.id + ' todavía no está cerrada.</p>' : '') +
        '<form id="form-resolver" data-form="resolverCaso">' + GA.campo({ id: 'res-txt', label: 'Comentario de resolución (visible para el socio)', type: 'textarea', req: true, attrs: 'autofocus' }) + '</form>',
      pie: '<button type="button" class="btn" data-act="cerrarModal">Cancelar</button><button type="submit" form="form-resolver" class="btn btn--pri">Resolver</button>'
    });
  };
  GA.form.resolverCaso = function (f) {
    var t = f.querySelector('#res-txt').value.trim();
    if (!t) { GA.toast('Escribí el comentario de resolución.', 'bad'); return; }
    var c = casoActual();
    c.estado = 'resuelto';
    c.vencido = false;
    c.linea.push({ fecha: GA.ahora(), autor: GA.e.sesion.usuario, texto: 'Resuelto: ' + t, tipo: 'respuesta' });
    GA.cerrarModal();
    GA.toast('Caso ' + c.id + ' resuelto.');
    GA.mutar();
  };
  GA.acc.crearOt = function () {
    var c = casoActual();
    GA.modal({
      titulo: 'Crear orden de trabajo', tam: 'lg',
      cuerpo: '<form id="form-ot" data-form="crearOt" novalidate>' +
        GA.campo({ id: 'ot-op', label: 'Operación', type: 'select', value: c.clase === 'reclamo' ? 'reclamo' : 'instalacion', opciones: [['reclamo', 'Reclamo técnico'], ['instalacion', 'Instalación de servicio']], attrs: 'autofocus' }) +
        GA.campo({ id: 'ot-pri', label: 'Prioridad', type: 'select', value: c.prioridad === 'alta' ? 'Alta' : 'Normal', opciones: ['Normal', 'Alta'] }) +
        GA.campo({ id: 'ot-cua', label: 'Cuadrilla', type: 'select', opciones: ['Cuadrilla Ejemplo 1', 'Cuadrilla Ejemplo 2'] }) +
        GA.campo({ id: 'ot-fr', label: 'Visita (franja)', type: 'select', opciones: [GA.HOY + ' 13:00-15:00', GA.HOY + ' 15:00-17:00', '06-11-2026 09:00-12:00'] }) +
        '<p class="hint">Validaciones de creación RF-TEC-027/028. La OT queda vinculada al caso ' + c.id + '.</p></form>',
      pie: '<button type="button" class="btn" data-act="cerrarModal">Cancelar</button><button type="submit" form="form-ot" class="btn btn--pri">Crear OT</button>'
    });
  };
  GA.form.crearOt = function (f) {
    var c = casoActual();
    var op = f.querySelector('#ot-op').value;
    var id = GA.sig('ot', 7);
    var hora = GA.hora();
    var dia = GA.HOY.slice(0, 5);
    GA.e.ots.push({
      id: id, operacion: op === 'reclamo' ? 'Reclamo técnico' : 'Instalación de servicio', tipo: op === 'reclamo' ? 'Revisión de conexión FTTH' : 'Instalación FTTH', clase: op, estado: 'assigned',
      prioridad: f.querySelector('#ot-pri').value, contratoId: c.contratoId, casoId: c.id, cuadrilla: f.querySelector('#ot-cua').value, visita: f.querySelector('#ot-fr').value, ingreso: 'Atención (' + c.canal + ')',
      historial: [['pending', dia + ' ' + hora], ['scheduled', dia + ' ' + hora], ['assigned', dia + ' ' + hora]], evidencias: null, efectos: 'pendientes'
    });
    c.otId = id;
    if (c.estado === 'recibido') c.estado = 'enCurso';
    c.linea.push({ fecha: GA.ahora(), autor: GA.e.sesion.usuario, texto: 'Se creó la OT ' + id + ' para ' + f.querySelector('#ot-cua').value + '.', tipo: 'sistema' });
    GA.guardar();
    GA.cerrarModal();
    GA.toast('OT ' + id + ' creada y asignada.');
    GA.ir('/admin/tec/work-orders/' + id);
  };

  /* ================= TÉCNICA ================= */

  var ESTADOS_OT = ['pending', 'scheduled', 'assigned', 'dispatched', 'inProgress', 'executed', 'closed'];

  GA.ruta('/admin/tec/work-orders', {
    app: 'admin', nav: 'ots',
    render: function () {
      return {
        meta: M('—', 'PAN-TEC-04', '/admin/tec/work-orders', 'tec.workOrder.read', 'O3', 'Órdenes de trabajo', 'Tablero de órdenes de trabajo.', 'T-STE, despachante'),
        html: GA.cabecera({ migas: ['Técnica', 'Operación', 'Órdenes de trabajo'], titulo: 'Órdenes de trabajo' }) +
          '<div class="pag"><div class="tabla-cont"><table class="tabla"><caption class="sr-only">Órdenes de trabajo</caption><thead><tr><th scope="col">OT</th><th scope="col">Operación</th><th scope="col">Titular</th><th scope="col">Cuadrilla</th><th scope="col">Visita</th><th scope="col">Estado</th></tr></thead><tbody>' +
          GA.e.ots.slice().reverse().map(function (o) { var k = q.contrato(o.contratoId); return '<tr><td><a class="mono" href="#/admin/tec/work-orders/' + o.id + '">' + o.id + '</a></td><td>' + esc(o.operacion) + '</td><td>' + esc(k ? q.nombreCuenta(k.cuentaId) : '—') + '</td><td>' + esc(o.cuadrilla) + '</td><td class="mono">' + esc(o.visita) + '</td><td>' + GA.badge('ot', o.estado) + '</td></tr>'; }).join('') +
          '</tbody></table></div></div>'
      };
    }
  });

  GA.ruta('/admin/tec/work-orders/:id', {
    app: 'admin', nav: 'ots',
    render: function (p) {
      var o = q.ot(p.id);
      var meta = M('W-09', 'PAN-TEC-05', '/admin/tec/work-orders/' + p.id, 'tec.workOrder.read · tec.workOrder.update · tec.workOrder.close', 'O3', 'OT ' + p.id, 'Gestionar una orden de trabajo de punta a punta.', 'T-STE (supervisor técnico), despachante, T-ATE (consulta)');
      if (!o) return { meta: meta, html: GA.cabecera({ migas: [['Órdenes de trabajo', '/admin/tec/work-orders']], titulo: 'OT no encontrada' }) };
      var k = q.contrato(o.contratoId);
      var tab = GA.ui.ot || 'datos';
      var acciones = '';
      if (o.estado === 'assigned') acciones = '<button type="button" class="btn btn--pri" data-act="despacharOt">Despachar</button><button type="button" class="btn" data-act="noDisponible">Reprogramar</button><button type="button" class="btn" data-act="noDisponible">Poner en espera</button>';
      else if (o.estado === 'dispatched' || o.estado === 'inProgress') acciones = '<button type="button" class="btn btn--pri" data-act="abrirEnCampo">Abrir en la app de campo</button><button type="button" class="btn" data-act="recuperarOt">Recuperar</button>';
      else if (o.estado === 'executed') acciones = '<button type="button" class="btn btn--pri" data-act="confirmarOt">Confirmar y cerrar</button>';
      var idx = ESTADOS_OT.indexOf(o.estado);
      var lineaEstados = '<ol class="estados">' + ESTADOS_OT.map(function (e, i) {
        var h = o.historial.filter(function (x) { return x[0] === e; })[0];
        return '<li class="' + (i < idx ? 'hecho' : i === idx ? 'actual' : '') + '"' + (i === idx ? ' aria-current="step"' : '') + '><span>' + esc(GA.etiquetaEstado('ot', e)) + (i === idx ? ' <em>(actual)</em>' : '') + '</span><span class="mono">' + (h ? h[1] : '') + '</span></li>';
      }).join('') + '</ol>';
      var ev = o.evidencias;
      var panel = {
        datos: '<dl class="dl dl--2"><dt>Operación</dt><dd>' + esc(o.operacion) + '</dd><dt>Tipo de trabajo</dt><dd>' + esc(o.tipo) + '</dd><dt>Origen</dt><dd>' + (o.casoId ? 'Caso <a href="#/admin/crm/casos/' + o.casoId + '">' + o.casoId + '</a> (CRM)' : '—') + '</dd><dt>Vía de ingreso</dt><dd>' + esc(o.ingreso) + '</dd>' +
          '<dt>Equipo previsto</dt><dd>' + (o.clase === 'instalacion' ? 'ONT (serie a escanear en campo)' : 'Revisión del equipo instalado') + '</dd><dt>Requisitos de cierre</dt><dd>' + (o.clase === 'instalacion' ? 'Fotos (2), serie de equipo, prueba de servicio, conformidad del socio' : 'Foto (1), prueba de servicio, conformidad del socio') + '</dd>' +
          '<dt>Efectos al confirmar</dt><dd>' + (o.clase === 'instalacion' ? 'Conectar servicio, aplicar comodato, solicitar aprovisionamiento' : 'Resolver el caso vinculado y avisar al socio') + '</dd></dl>',
        evidencias: ev ? '<ul class="lista"><li>Fotos: ' + ev.fotos + ' (con hora y GPS)</li>' + (ev.serie ? '<li>Serie del equipo: <span class="mono">' + esc(ev.serie) + '</span></li>' : '') + '<li>Prueba de servicio: ' + (ev.prueba === 'ok' ? 'correcta' : 'fallida') + '</li>' + (ev.materiales ? '<li>Materiales: ' + esc(ev.materiales) + '</li>' : '') + (ev.obs ? '<li>Observaciones: ' + esc(ev.obs) + '</li>' : '') + '</ul>' : '<p>Todavía no hay evidencias. Se cargan desde la app de campo.</p>',
        conformidad: ev && ev.conformidad ? '<p>Conformidad firmada por ' + esc(ev.conformidad) + '.</p>' : '<p>Sin conformidad registrada.</p>',
        efectos: '<ul class="lista">' + (o.clase === 'instalacion' ? ['Conectar servicio', 'Aplicar comodato del equipo', 'Solicitar aprovisionamiento'] : ['Resolver el caso vinculado', 'Avisar al socio']).map(function (x) { return '<li>' + GA.badgeTono(o.efectos === 'aplicados' ? 'ok' : 'neutral', o.efectos === 'aplicados' ? 'Aplicado' : 'Pendiente') + ' ' + x + '</li>'; }).join('') + '</ul>',
        auditoria: '<ol class="timeline">' + o.historial.slice().reverse().map(function (h) { return '<li><span class="timeline__f">' + h[1] + '</span>' + esc(GA.etiquetaEstado('ot', h[0])) + '</li>'; }).join('') + '</ol>'
      }[tab];
      return {
        meta: meta,
        html: GA.cabecera({
          migas: ['Técnica', 'Operación', ['Órdenes de trabajo', '/admin/tec/work-orders'], 'OT ' + o.id], titulo: 'OT ' + o.id + ' · ' + o.operacion,
          extra: '<p class="cab-pag__datos">' + GA.badge('ot', o.estado) + ' Prioridad: ' + esc(o.prioridad) + '</p><p class="cab-pag__datos">' + (k ? esc(q.nombreCuenta(k.cuentaId)) + ' · Cta. <span class="mono">' + k.cuentaId + '</span> · <span class="mono">' + k.id + '</span> · ' + esc(k.domicilio) : '') + '</p><p class="cab-pag__datos">Cuadrilla: ' + esc(o.cuadrilla) + ' · Visita: <span class="mono">' + esc(o.visita) + '</span></p>',
          acciones: acciones
        }) + '<div class="pag">' +
          (o.estado === 'dispatched' || o.estado === 'inProgress' ? '<div class="banda banda--info" role="status">' + GA.ico('info') + 'En el dispositivo del técnico. La edición está bloqueada salvo "Recuperar".</div>' : '') +
          (o.estado === 'executed' ? '<div class="banda banda--warn" role="status">' + GA.ico('warn') + 'Ejecutada en campo. Los efectos contractuales se aplican al confirmar (RF-TEC-037, a validar en PA-TEC-01).</div>' : '') +
          '<div class="ot-grid"><div>' + GA.pestanas('ot', [['datos', 'Datos'], ['evidencias', 'Evidencias'], ['conformidad', 'Conformidad'], ['efectos', 'Efectos'], ['auditoria', 'Auditoría']], tab, { label: 'Secciones de la OT' }) +
          '<div id="panel-ot" role="tabpanel" aria-labelledby="tab-ot-' + tab + '" class="panel">' + panel + '</div></div>' +
          '<aside class="panel" aria-labelledby="t-est"><h2 id="t-est">Estado de la OT</h2>' + lineaEstados + '</aside></div></div>'
      };
    }
  });
  function otActual() { return q.ot(GA.parseHash().path.split('/').pop()); }
  function marcar(o, estado) { o.estado = estado; o.historial.push([estado, GA.HOY.slice(0, 5) + ' ' + GA.hora()]); }
  GA.marcarOt = marcar;
  GA.acc.despacharOt = function () { var o = otActual(); marcar(o, 'dispatched'); GA.toast('OT ' + o.id + ' despachada al dispositivo de ' + o.cuadrilla + '.'); GA.mutar(); };
  GA.acc.recuperarOt = function () { var o = otActual(); marcar(o, 'assigned'); GA.toast('OT recuperada del dispositivo.', 'info'); GA.mutar(); };
  GA.acc.abrirEnCampo = function () { var o = otActual(); GA.sesionCampo(); GA.guardar(); GA.toast('Cambiaste al espacio de campo (Técnico Ejemplo).', 'info'); GA.ir('/app/campo/work-orders/' + o.id); };
  GA.acc.confirmarOt = function () {
    var o = otActual();
    GA.modal({
      titulo: 'Confirmar y cerrar la OT ' + o.id, tam: 'md',
      cuerpo: '<p>Se aplicarán los efectos:</p><ul class="lista">' + (o.clase === 'instalacion' ? '<li>Conectar el servicio y activar el contrato</li><li>Aplicar el comodato del equipo ' + esc(o.evidencias && o.evidencias.serie || '') + '</li><li>Solicitar el aprovisionamiento</li>' : '<li>Resolver el caso ' + esc(o.casoId) + ' y avisar al socio</li>') + '</ul>',
      pie: '<button type="button" class="btn" data-act="cerrarModal">Cancelar</button><button type="button" class="btn btn--pri" data-act="aplicarCierreOt" autofocus>Confirmar y cerrar</button>'
    });
  };
  GA.acc.aplicarCierreOt = function () {
    var o = otActual();
    marcar(o, 'closed');
    o.efectos = 'aplicados';
    var c = o.casoId ? q.caso(o.casoId) : null;
    var k = q.contrato(o.contratoId);
    if (o.clase === 'instalacion' && k) { k.estado = 'active'; k.equipo = (o.evidencias && o.evidencias.serie) || k.equipo; }
    if (c) {
      c.estado = 'resuelto'; c.vencido = false;
      c.linea.push({ fecha: GA.ahora(), autor: 'Sistema', texto: 'OT ' + o.id + ' cerrada. ' + (o.clase === 'instalacion' ? 'Servicio activo.' : 'Servicio restablecido.') + ' Se avisó al socio.', tipo: 'respuesta' });
    }
    GA.cerrarModal();
    GA.toast('OT ' + o.id + ' cerrada. Efectos aplicados' + (c ? ' y caso ' + c.id + ' resuelto.' : '.'));
    GA.mutar();
  };
})(window.GA);
