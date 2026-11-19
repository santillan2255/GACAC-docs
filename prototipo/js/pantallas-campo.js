/* PWA de campo: Mi día (W-16), ejecución y cierre de OT (W-17) y cola de sincronización (PAN-TEC-53). */
'use strict';

(function (GA) {
  var esc = GA.esc;
  var q = GA.q;
  var M = GA.M;
  var PASOS = ['En camino', 'Llegué', 'Checklist', 'Equipo y materiales', 'Fotos', 'Prueba', 'Conformidad', 'Cerrar'];

  function misOts() {
    var cua = GA.e.sesion.cuadrilla;
    return GA.e.ots.filter(function (o) { return o.cuadrilla === cua && ['dispatched', 'onTheWay', 'inProgress', 'executed', 'closed'].indexOf(o.estado) >= 0 && (o.visita.indexOf(GA.HOY) === 0 || o.estado !== 'closed'); });
  }
  function pendiente(o) { return ['dispatched', 'onTheWay', 'inProgress'].indexOf(o.estado) >= 0 && !(o.campo && o.campo.enCola); }

  /* Cola offline: cada mutación lleva un identificador de cliente y se aplica una sola vez */
  function aplicar(op) {
    var o = q.ot(op.otId);
    if (op.tipo === 'estado') GA.marcarOt(o, op.estado);
    if (op.tipo === 'ejecutar') {
      GA.marcarOt(o, 'executed');
      o.evidencias = op.evidencias;
      if (o.campo) o.campo.enCola = false;
      var c = o.casoId ? q.caso(o.casoId) : null;
      if (c) c.linea.push({ fecha: GA.ahora(), autor: 'Sistema', texto: 'El técnico marcó la OT ' + o.id + ' como ejecutada.', tipo: 'sistema' });
    }
  }
  function encolar(op, desc) {
    op.clientMutationId = 'CM-' + GA.sig('cola', 4);
    var item = { id: op.clientMutationId, desc: desc, op: op, estado: 'pendiente', hora: GA.hora() };
    GA.e.colaCampo.push(item);
    if (!GA.e.offline) { aplicar(op); item.estado = 'enviado'; }
  }
  GA.acc.sincronizar = function () {
    if (GA.e.offline) { GA.toast('Seguís sin conexión. Los cambios se envían solos al volver la señal.', 'warn'); return; }
    var n = 0;
    GA.e.colaCampo.forEach(function (it) { if (it.estado === 'pendiente') { aplicar(it.op); it.estado = 'enviado'; n++; } });
    GA.toast(n ? n + ' cambio' + (n === 1 ? '' : 's') + ' enviado' + (n === 1 ? '' : 's') + ', sin duplicados.' : 'No hay cambios pendientes.');
    GA.mutar();
  };
  GA.acc.alternarConexion = function () {
    GA.e.offline = !GA.e.offline;
    GA.anunciar(GA.e.offline ? 'Sin conexión' : 'Conexión restablecida');
    if (!GA.e.offline) { GA.acc.sincronizar(); return; }
    GA.mutar();
  };
  function herramientaConexion() {
    return '<div class="herr-proto" role="group" aria-label="Herramientas del prototipo"><p class="hint">Herramienta del prototipo: simulá la pérdida de señal.</p><button type="button" class="btn btn--sm" data-act="alternarConexion" aria-pressed="' + GA.e.offline + '">' + (GA.e.offline ? 'Volver a tener conexión' : 'Simular sin conexión') + '</button></div>';
  }

  /* ---------- W-16 Mi día (PAN-TEC-50) ---------- */
  GA.ruta('/app/campo/today', {
    app: 'campo', nav: 'hoy',
    render: function (p, query) {
      var tab = GA.ui.dia || 'pendientes';
      var todas = misOts();
      var lista = tab === 'pendientes' ? todas.filter(pendiente) : tab === 'hechas' ? todas.filter(function (o) { return !pendiente(o); }) : todas;
      var ordenes = query.vista === 'ordenes';
      return {
        meta: M('W-16', 'PAN-TEC-50', '/app/campo/today' + (ordenes ? '?vista=ordenes' : ''), 'tec.workOrder.read', 'O3', ordenes ? 'Órdenes' : 'Mi día', 'Lista ordenada de visitas y OT del día, disponible sin conexión.', 'T-TEC (técnico de campo)'),
        html: '<h1 id="h1" tabindex="-1" class="pwa-h1">' + (ordenes ? 'Órdenes' : 'Hoy, ' + GA.HOY) + '</h1><p class="pwa-sub">' + todas.length + ' visita' + (todas.length === 1 ? '' : 's') + ' · Última descarga 07:45</p>' +
          '<button type="button" class="btn btn--sm" data-act="actualizarDia">Actualizar</button>' + herramientaConexion() +
          GA.pestanas('dia', [['pendientes', 'Pendientes'], ['hechas', 'Hechas'], ['todas', 'Todas']], tab, { label: 'Filtro de visitas' }) +
          '<div id="panel-dia" role="tabpanel" aria-labelledby="tab-dia-' + tab + '">' +
          (lista.length ? lista.map(function (o) {
            var k = q.contrato(o.contratoId);
            var est = o.campo && o.campo.enCola ? ['sync', 'pendiente'] : ['ot', o.estado];
            return '<article class="card ot-card"><a class="ot-card__link" href="#/app/campo/work-orders/' + o.id + '"><span class="mono">' + esc(o.visita.split(' ')[1] || '') + ' · OT ' + o.id + '</span><strong>' + esc(o.operacion) + '</strong>' + GA.badge(est[0], est[1]) +
              '<span>' + esc(k ? k.domicilio : '') + ' · ' + esc(k ? q.nombreCuenta(k.cuentaId) : '') + '</span><span>Equipo: ' + (o.clase === 'instalacion' ? 'ONT' : 'revisión') + ' · Prioridad ' + esc(o.prioridad) + '</span></a>' +
              '<div class="fila-2"><button type="button" class="btn btn--sm" data-act="noDisponible">' + GA.ico('mapa') + 'Navegar<span class="sr-only"> a OT ' + o.id + '</span></button><button type="button" class="btn btn--sm" data-act="noDisponible">' + GA.ico('telefono') + 'Llamar<span class="sr-only"> al titular de la OT ' + o.id + '</span></button></div></article>';
          }).join('') : GA.vacio(tab === 'pendientes' ? 'No tenés visitas pendientes para hoy' : 'No hay visitas en esta vista', 'Las OT aparecen cuando la supervisión las despacha a tu cuadrilla.', '<button type="button" class="btn" data-act="actualizarDia">Actualizar</button>')) + '</div>'
      };
    }
  });
  GA.acc.actualizarDia = function () {
    if (GA.e.offline) { GA.toast('Sin conexión: se muestran los datos de la última descarga.', 'warn'); return; }
    GA.toast('Agenda actualizada.');
    GA.render(true);
  };
  GA.acc.fabCampo = function () {
    GA.modal({
      titulo: 'Nuevo', tam: 'sm', pwa: true,
      cuerpo: '<ul class="lista-nav"><li><button type="button" class="btn btn--block" data-act="noDisponible">Reclamo en campo</button></li><li><button type="button" class="btn btn--block" data-act="noDisponible">Foto</button></li><li><button type="button" class="btn btn--block" data-act="noDisponible">Material usado</button></li></ul>'
    });
  };

  /* ---------- W-17 Ejecución y cierre de OT (PAN-TEC-51) ---------- */
  function campoDe(o) {
    if (!o.campo) {
      var k = q.contrato(o.contratoId);
      var per = k ? q.persona(q.titularDeCuenta(k.cuentaId).personaId) : null;
      o.campo = { paso: o.estado === 'inProgress' ? 3 : 1, check: {}, serie: '', cable: '', fotos: [], prueba: '', obs: '', firmante: per ? q.nombre(per) : '', dni: per ? per.dni : '', firma: false, otp: '', disconforme: false, enCola: false };
    }
    return o.campo;
  }
  function requisitos(o, c) {
    var inst = o.clase === 'instalacion';
    var r = [[(inst ? 2 : 1) + ' foto' + (inst ? 's' : '') + ' (cargadas: ' + c.fotos.length + ')', c.fotos.length >= (inst ? 2 : 1)]];
    if (inst) r.push(['Serie de equipo', !!c.serie]);
    r.push(['Prueba de servicio correcta', c.prueba === 'ok']);
    r.push(['Conformidad registrada', c.firma || /^\d{6}$/.test(c.otp) || c.disconforme]);
    return r;
  }

  GA.ruta('/app/campo/work-orders/:id', {
    app: 'campo', nav: 'ordenes',
    render: function (p) {
      var o = q.ot(p.id);
      var meta = M('W-17', 'PAN-TEC-51', '/app/campo/work-orders/' + p.id + (o && o.clase === 'instalacion' ? '?tipo=instalacion' : ''), 'tec.workOrder.update', 'O3', 'OT ' + p.id, 'Guiar al técnico en la ejecución de la OT y capturar evidencias, aun sin conexión.', 'T-TEC');
      if (!o || o.cuadrilla !== GA.e.sesion.cuadrilla) return { meta: meta, volver: '/app/campo/today', html: '<h1 id="h1" tabindex="-1" class="pwa-h1">OT no disponible</h1><p>La OT no está asignada a tu cuadrilla.</p>' };
      var k = q.contrato(o.contratoId);
      var c = campoDe(o);
      var cerrada = ['executed', 'closed'].indexOf(o.estado) >= 0 || c.enCola;
      var cab = '<h1 id="h1" tabindex="-1" class="pwa-h1">OT ' + o.id + ' · ' + esc(o.operacion) + '</h1><p>' + (c.enCola ? GA.badge('sync', 'pendiente') : GA.badge('ot', o.estado)) + '</p>' +
        '<p class="pwa-sub">' + esc(k ? k.domicilio + ' · ' + q.nombreCuenta(k.cuentaId) : '') + '</p>';
      if (cerrada) {
        return { meta: meta, volver: '/app/campo/today', html: cab + '<div class="card"><p>' + (c.enCola ? 'La OT se marcó como ejecutada y se enviará al volver la conexión.' : o.estado === 'closed' ? 'La OT está cerrada y confirmada por supervisión.' : 'La OT se marcó como ejecutada. La supervisión la confirma en el admin.') + '</p></div>' + herramientaConexion() + '<a class="btn btn--pri btn--block" href="#/app/campo/today">Volver a Mi día</a>' };
      }
      var n = c.paso;
      var pasos = '<ol class="pasos pasos--pwa" aria-label="Pasos de la OT">' + PASOS.map(function (x, i) { return '<li class="' + (i + 1 < n ? 'hecho' : i + 1 === n ? 'actual' : '') + '"' + (i + 1 === n ? ' aria-current="step"' : '') + '>' + esc(x) + '</li>'; }).join('') + '</ol>';
      var cuerpo = '';
      var sig = '<button type="button" class="btn btn--pri" data-act="campoPaso" data-d="1">Siguiente</button>';
      if (n === 1) { cuerpo = '<p>Avisá que salís hacia el domicilio. El socio recibe el aviso "técnico en camino".</p>'; sig = '<button type="button" class="btn btn--pri" data-act="campoEstado" data-e="onTheWay">Estoy en camino</button>'; }
      else if (n === 2) { cuerpo = '<p>Confirmá la llegada al domicilio del servicio.</p>'; sig = '<button type="button" class="btn btn--pri" data-act="campoEstado" data-e="inProgress">Llegué</button>'; }
      else if (n === 3) {
        cuerpo = '<fieldset class="radios"><legend>Checklist</legend>' + (o.clase === 'instalacion' ? ['Verificar señal en la caja de distribución', 'Tender la acometida', 'Instalar la roseta óptica'] : ['Verificar señal en la caja de distribución', 'Revisar la acometida', 'Revisar el equipo del socio']).map(function (t, i) {
          return '<label class="check"><input type="checkbox" data-chg="campoCheck" data-i="' + i + '"' + (c.check[i] ? ' checked' : '') + '> ' + esc(t) + '</label>';
        }).join('') + '</fieldset>';
      } else if (n === 4) {
        cuerpo = '<div class="campo"><label for="cp-serie">' + (o.clase === 'instalacion' ? 'Serie de la ONT instalada' : 'Serie del equipo revisado (opcional)') + (o.clase === 'instalacion' ? ' <span class="req">(obligatorio)</span>' : '') + '</label><div class="campo__grupo"><input id="cp-serie" value="' + esc(c.serie) + '" data-inp="campoTxt" data-k="serie" autocomplete="off"><button type="button" class="btn" data-act="escanear">Escanear</button></div><p class="hint">Si no podés escanear, escribí la serie a mano.</p></div>' +
          GA.campo({ id: 'cp-cable', label: 'Cable de acometida usado (metros)', value: c.cable, attrs: 'inputmode="numeric" data-inp="campoTxt" data-k="cable"' }) +
          GA.campo({ id: 'cp-obs', label: 'Observaciones', type: 'textarea', value: c.obs, rows: 2, attrs: 'data-inp="campoTxt" data-k="obs"' }) + '<button type="button" class="btn btn--sm" data-act="noDisponible">Dictar</button>';
      } else if (n === 5) {
        cuerpo = '<p>Fotos (mínimo ' + (o.clase === 'instalacion' ? 2 : 1) + ')</p><ul class="fotos">' + c.fotos.map(function (f, i) {
          return '<li class="foto" role="img" aria-label="Foto ' + (i + 1) + ', tomada a las ' + f + ', con ubicación GPS">' + GA.ico('camara') + '<span>Foto ' + (i + 1) + '</span><span class="mono">' + f + '</span><span>GPS ok</span><button type="button" class="btn-ico" data-act="quitarFoto" data-i="' + i + '" aria-label="Quitar foto ' + (i + 1) + '">' + GA.ico('cerrar') + '</button></li>';
        }).join('') + '<li><button type="button" class="foto foto--agregar" data-act="agregarFoto">' + GA.ico('mas') + '<span>Agregar foto</span></button></li></ul><p class="hint">Prototipo: la cámara se simula.</p>';
      } else if (n === 6) {
        cuerpo = '<fieldset class="radios"><legend>Prueba de servicio</legend><label class="radio-tarjeta"><input type="radio" name="prueba" value="ok" data-chg="campoPrueba"' + (c.prueba === 'ok' ? ' checked' : '') + '> <span>Correcta: navegación y velocidad verificadas</span></label>' +
          '<label class="radio-tarjeta"><input type="radio" name="prueba" value="falla" data-chg="campoPrueba"' + (c.prueba === 'falla' ? ' checked' : '') + '> <span>Falló</span></label></fieldset>' +
          (c.prueba === 'falla' ? '<p class="banda banda--warn">' + GA.ico('warn') + 'Podés volver a intentar la instalación o registrar una visita fallida (M10 §8.5). La OT no se puede cerrar con la prueba fallida.</p>' : '');
      } else if (n === 7) {
        cuerpo = '<div class="card"><p>Tareas: ' + (o.clase === 'instalacion' ? 'instalación y prueba de servicio' : 'revisión y prueba de servicio') + '</p>' + (c.serie ? '<p>Equipo en comodato: <span class="mono">' + esc(c.serie) + '</span></p>' : '') + '</div>' +
          '<div class="grilla-2">' + GA.campo({ id: 'cp-firmante', label: 'Nombre de quien firma', value: c.firmante, req: true, auto: 'name', attrs: 'data-inp="campoTxt" data-k="firmante"' }) + GA.campo({ id: 'cp-dni', label: 'DNI de quien firma', value: c.dni, req: true, hint: 'DNI sin puntos', attrs: 'inputmode="numeric" data-inp="campoTxt" data-k="dni"' }) + '</div>' +
          '<p id="firma-etq">Firma del socio</p><canvas id="firma" class="firma" width="340" height="140" role="img" aria-labelledby="firma-etq" aria-describedby="firma-alt"></canvas>' +
          '<p id="firma-alt" class="hint">Si no puede firmar con el dedo, usá "Firmar con código".</p>' +
          '<div class="fila-2"><button type="button" class="btn btn--sm" data-act="borrarFirma">Borrar firma</button><button type="button" class="btn btn--sm" data-act="firmaCodigo">Firmar con código</button></div>' +
          (c.otp ? '<p>' + GA.badgeTono('ok', 'Conformidad por código registrada') + '</p>' : '') + (c.firma ? '<p>' + GA.badgeTono('ok', 'Firma registrada') + '</p>' : '') + (c.disconforme ? '<p>' + GA.badgeTono('warn', 'El socio no está conforme: decide el supervisor') + '</p>' : '') +
          '<button type="button" class="btn btn--block" data-act="disconforme">No está conforme</button>';
        sig = '<button type="button" class="btn btn--pri" data-act="confirmarConformidad">Confirmar</button>';
      } else {
        var r = requisitos(o, c);
        var ok = r.every(function (x) { return x[1]; });
        cuerpo = '<h2 class="pwa-h2">Resumen de cierre</h2><ul class="lista">' + r.map(function (x) { return '<li>' + GA.badgeTono(x[1] ? 'ok' : 'bad', x[1] ? 'Cumplido' : 'Pendiente') + ' ' + esc(x[0]) + '</li>'; }).join('') + '</ul>' +
          (GA.e.offline ? '<p class="banda banda--warn">' + GA.ico('warn') + 'Sin conexión: se enviará al volver la conexión.</p>' : '') +
          (!ok ? '<p class="hint">Completá los requisitos pendientes para habilitar el cierre (RF-TEC-024).</p>' : '');
        sig = '<button type="button" class="btn btn--pri" data-act="marcarEjecutada"' + (ok ? '' : ' disabled') + '>Marcar como ejecutada</button>';
      }
      return {
        meta: meta, volver: '/app/campo/today',
        html: cab + pasos + '<h2 id="paso-tit" tabindex="-1" class="pwa-h2">Paso ' + n + ' de 8: ' + PASOS[n - 1] + '</h2>' + cuerpo +
          '<div class="fila-entre wiz__pie">' + (n > 1 && n > 2 ? '<button type="button" class="btn" data-act="campoPaso" data-d="-1">Anterior</button>' : '<span></span>') + sig + '</div>',
        despues: function () { if (n === 7) prepararFirma(c); }
      };
    }
  });
  function otCampo() { return q.ot(GA.parseHash().path.split('/').pop()); }
  function irPaso(c, n) {
    c.paso = n;
    GA.mutar();
    var t = document.getElementById('paso-tit');
    if (t) t.focus();
    GA.anunciar('Paso ' + n + ' de 8: ' + PASOS[n - 1]);
  }
  GA.acc.campoPaso = function (el) { var o = otCampo(); var c = campoDe(o); irPaso(c, c.paso + Number(el.getAttribute('data-d'))); };
  GA.acc.campoEstado = function (el) {
    var o = otCampo();
    var e = el.getAttribute('data-e');
    o.estado = e;
    o.historial.push([e, GA.HOY.slice(0, 5) + ' ' + GA.hora()]);
    encolar({ tipo: 'nada', otId: o.id }, 'OT ' + o.id + ': ' + GA.etiquetaEstado('ot', e));
    irPaso(campoDe(o), e === 'onTheWay' ? 2 : 3);
  };
  GA.inp.campoCheck = function (el) { campoDe(otCampo()).check[el.getAttribute('data-i')] = el.checked; GA.guardar(); };
  GA.inp.campoTxt = function (el) { campoDe(otCampo())[el.getAttribute('data-k')] = el.value; GA.guardar(); };
  GA.inp.campoPrueba = function (el) { campoDe(otCampo()).prueba = el.value; GA.mutar(); };
  GA.acc.escanear = function () { var c = campoDe(otCampo()); c.serie = 'ONT-EJEMPLO-' + otCampo().id.slice(-4); GA.toast('Serie leída: ' + c.serie + ' (equipo en custodia del técnico).'); GA.mutar(); };
  GA.acc.agregarFoto = function () { var c = campoDe(otCampo()); c.fotos.push(GA.hora()); GA.anunciar('Foto ' + c.fotos.length + ' agregada'); GA.mutar(); };
  GA.acc.quitarFoto = function (el) { var c = campoDe(otCampo()); c.fotos.splice(Number(el.getAttribute('data-i')), 1); GA.mutar(); };
  GA.acc.disconforme = function () { var c = campoDe(otCampo()); c.disconforme = true; GA.toast('Se registró la disconformidad del socio.', 'warn'); GA.mutar(); };
  GA.acc.borrarFirma = function () { var c = campoDe(otCampo()); c.firma = false; c.trazo = null; GA.mutar(); };
  GA.acc.firmaCodigo = function () {
    GA.modal({
      titulo: 'Firmar con código', tam: 'sm', pwa: true,
      cuerpo: '<p>Enviamos un código al contacto verificado del socio. Pedile que te lo dicte.</p><form id="form-otp" data-form="firmaCodigo">' + GA.campo({ id: 'otp-firma', label: 'Código de 6 dígitos', req: true, auto: 'one-time-code', clase: 'campo--otp', attrs: 'inputmode="numeric" maxlength="6" autofocus' }) + '</form>',
      pie: '<button type="button" class="btn" data-act="cerrarModal">Cancelar</button><button type="submit" form="form-otp" class="btn btn--pri">Registrar</button>'
    });
  };
  GA.form.firmaCodigo = function (f) {
    var v = f.querySelector('#otp-firma').value.trim();
    if (!/^\d{6}$/.test(v)) { GA.toast('El código tiene 6 números.', 'bad'); return; }
    campoDe(otCampo()).otp = v;
    GA.cerrarModal();
    GA.mutar();
  };
  GA.acc.confirmarConformidad = function () {
    var c = campoDe(otCampo());
    if (!c.firmante.trim() || !/^\d{7,8}$/.test(c.dni)) { GA.toast('Completá el nombre y el DNI (sin puntos) de quien firma.', 'bad'); document.getElementById(c.firmante.trim() ? 'cp-dni' : 'cp-firmante').focus(); return; }
    if (!c.firma && !/^\d{6}$/.test(c.otp) && !c.disconforme) { GA.toast('Falta la firma, el código o registrar la disconformidad.', 'bad'); return; }
    irPaso(c, 8);
  };
  GA.acc.marcarEjecutada = function () {
    var o = otCampo();
    var c = campoDe(o);
    var ev = { fotos: c.fotos.length, serie: c.serie, prueba: c.prueba, materiales: c.cable ? 'Cable de acometida ' + c.cable + ' m' : '', obs: c.obs, conformidad: c.disconforme ? 'Disconforme: ' + c.firmante : c.firmante + ' · DNI ' + c.dni + (c.otp ? ' (por código)' : ' (firma)') };
    c.enCola = true;
    encolar({ tipo: 'ejecutar', otId: o.id, evidencias: ev }, 'OT ' + o.id + ': marcada como ejecutada con evidencias');
    GA.toast(GA.e.offline ? 'Guardado en el dispositivo. Se enviará al volver la conexión.' : 'OT ' + o.id + ' marcada como ejecutada y enviada.');
    GA.mutar();
  };

  function prepararFirma(c) {
    var cv = document.getElementById('firma');
    if (!cv) return;
    var ctx = cv.getContext('2d');
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#ffffff';
    if (c.trazo) { var img = new Image(); img.onload = function () { ctx.drawImage(img, 0, 0); }; img.src = c.trazo; }
    var dibujando = false;
    var pos = function (ev) { var r = cv.getBoundingClientRect(); return [(ev.clientX - r.left) * cv.width / r.width, (ev.clientY - r.top) * cv.height / r.height]; };
    cv.addEventListener('pointerdown', function (ev) { dibujando = true; cv.setPointerCapture(ev.pointerId); var p = pos(ev); ctx.beginPath(); ctx.moveTo(p[0], p[1]); });
    cv.addEventListener('pointermove', function (ev) { if (!dibujando) return; var p = pos(ev); ctx.lineTo(p[0], p[1]); ctx.stroke(); });
    cv.addEventListener('pointerup', function () {
      if (!dibujando) return;
      dibujando = false;
      c.trazo = cv.toDataURL();
      if (!c.firma) { c.firma = true; GA.guardar(); GA.anunciar('Firma registrada'); }
      else GA.guardar();
    });
  }

  /* ---------- Cola de sincronización (PAN-TEC-53) y stock ---------- */
  GA.ruta('/app/campo/sync', {
    app: 'campo', nav: 'sync',
    render: function () {
      var cola = GA.e.colaCampo.slice().reverse();
      return {
        meta: M('—', 'PAN-TEC-53', '/app/campo/sync', 'tec.workOrder.update', 'O3', 'Sincronización', 'Ver la cola de cambios del dispositivo y reintentar el envío.', 'T-TEC'),
        html: '<h1 id="h1" tabindex="-1" class="pwa-h1">Sincronización</h1><p class="pwa-sub">' + (GA.e.offline ? 'Sin conexión' : 'Con conexión') + '</p>' + herramientaConexion() +
          '<button type="button" class="btn btn--pri btn--block" data-act="sincronizar">Sincronizar ahora</button>' +
          (cola.length ? '<ul class="lista">' + cola.map(function (it) { return '<li>' + GA.badge('sync', it.estado) + ' ' + esc(it.desc) + ' <span class="mono hint">' + it.hora + ' · ' + it.id + '</span></li>'; }).join('') + '</ul>' : GA.vacio('No hay cambios en la cola', '')) +
          '<p class="hint">La evidencia nunca se descarta sin supervisor.</p>'
      };
    }
  });
  GA.ruta('/app/campo/stock', {
    app: 'campo', nav: 'stock',
    render: function () {
      return {
        meta: M('—', 'Stock en vehículo (M13)', '/app/campo/stock', 'A definir', 'O3', 'Stock en vehículo', 'Equipos y materiales en custodia del técnico.', 'T-TEC'),
        html: '<h1 id="h1" tabindex="-1" class="pwa-h1">Stock en vehículo</h1><ul class="lista"><li>ONT · 3 unidades en custodia (series ficticias)</li><li>Cable de acometida · 250 m</li></ul><p class="hint">Pantalla ilustrativa; el detalle de stock no forma parte del prototipo.</p>'
      };
    }
  });
})(window.GA);
