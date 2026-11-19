/* Utilidades de interfaz del prototipo: escape, insignias, modales, avisos y teclado. */
'use strict';

(function (GA) {
  GA.acc = {};   // acciones de clic: data-act="nombre"
  GA.form = {};  // envíos de formulario: data-form="nombre"
  GA.inp = {};   // cambios en campos: data-inp="nombre"

  GA.esc = function (v) {
    return String(v === undefined || v === null ? '' : v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  };
  var esc = GA.esc;

  /* ---------- Íconos (SVG inline, trazo 1.75, currentColor) ---------- */
  var ICONOS = {
    ok: '<path d="M5 12.5l4.2 4.2L19 7"/>',
    warn: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    bad: '<circle cx="12" cy="12" r="8.5"/><path d="M9 9l6 6M15 9l-6 6"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/>',
    neutral: '<circle cx="12" cy="12" r="8.5"/><path d="M8.5 12h7"/>',
    buscar: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    cerrar: '<path d="M6 6l12 12M18 6L6 18"/>',
    ayuda: '<circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.5a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .8-1 1.5v.4M12 16.8h.01"/>',
    campana: '<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
    volver: '<path d="M15 5l-7 7 7 7"/>',
    chevron: '<path d="M9 5l7 7-7 7"/>',
    mas: '<path d="M12 5v14M5 12h14"/>',
    inicio: '<path d="M4 11l8-6 8 6v8h-5v-5H9v5H4z"/>',
    servicios: '<rect x="4" y="5" width="16" height="14" rx="2"/><path d="M8 10h8M8 14h5"/>',
    gestiones: '<path d="M6 4h9l3 3v13H6z"/><path d="M9 11h6M9 15h6"/>',
    comunidad: '<circle cx="9" cy="9" r="3"/><circle cx="16.5" cy="10" r="2.5"/><path d="M3.5 19c.6-3 2.8-4.5 5.5-4.5s4.9 1.5 5.5 4.5M14.5 15c2.5-.4 4.6.9 5.5 4"/>',
    hoy: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
    ordenes: '<path d="M8 6h11M8 12h11M8 18h11"/><path d="M4 6h.01M4 12h.01M4 18h.01"/>',
    stock: '<path d="M4 8l8-4 8 4v8l-8 4-8-4z"/><path d="M4 8l8 4 8-4M12 12v8"/>',
    sync: '<path d="M19 8a7.5 7.5 0 0 0-13.5-1.5M5 4v3h3M5 16a7.5 7.5 0 0 0 13.5 1.5M19 20v-3h-3"/>',
    mapa: '<path d="M4 6l5-2 6 2 5-2v14l-5 2-6-2-5 2z"/><path d="M9 4v14M15 6v14"/>',
    camara: '<rect x="3.5" y="7" width="17" height="12" rx="2"/><circle cx="12" cy="13" r="3.2"/><path d="M8.5 7l1.5-2.5h4L15.5 7"/>',
    ubicacion: '<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    telefono: '<path d="M6.5 4h3l1.5 4-2 1.5a10 10 0 0 0 5.5 5.5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A15.5 15.5 0 0 1 4.5 6a2 2 0 0 1 2-2z"/>',
    usuario: '<circle cx="12" cy="9" r="3.5"/><path d="M5 20c1-4 4-5.5 7-5.5s6 1.5 7 5.5"/>'
  };
  GA.ico = function (nombre, extra) {
    return '<svg class="ico ' + (extra || '') + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + (ICONOS[nombre] || '') + '</svg>';
  };

  /* ---------- Estados semánticos (contrato de StatusBadge, T03 §7.A.8) ---------- */
  var ESTADOS = {
    contrato: {
      requested: ['warn', 'Solicitado'], feasibility: ['info', 'En factibilidad'],
      pendingInstallation: ['info', 'Pendiente de instalación'], active: ['ok', 'Activo'], cancelled: ['neutral', 'Anulado']
    },
    comercial: { impaga: ['warn', 'Impaga'], pagada: ['ok', 'Pagada'] },
    fiscal: { autorizado: ['ok', 'Autorizado'], pendiente: ['warn', 'Pendiente'], incierto: ['warn', 'Resultado incierto'] },
    lote: {
      prebilling: ['info', 'Prefacturando'], prebilled: ['warn', 'Prefacturado'], approved: ['info', 'Aprobado'],
      issuing: ['info', 'Emitiendo'], issued: ['ok', 'Emitido'], closed: ['neutral', 'Cerrado'], cancelled: ['neutral', 'Cancelado']
    },
    caso: { recibido: ['warn', 'Recibido'], enCurso: ['info', 'En curso'], esperaSocio: ['warn', 'En espera del socio'], resuelto: ['ok', 'Resuelto'] },
    casoSocio: { recibido: ['warn', 'Recibido'], enCurso: ['info', 'En curso'], esperaSocio: ['warn', 'Esperamos tu respuesta'], resuelto: ['ok', 'Resuelto'] },
    ot: {
      pending: ['neutral', 'Pendiente'], scheduled: ['info', 'Agendada'], assigned: ['info', 'Asignada'], dispatched: ['info', 'Despachada'],
      onTheWay: ['info', 'En camino'], inProgress: ['info', 'En curso'], executed: ['warn', 'Ejecutada, a confirmar'], closed: ['ok', 'Cerrada']
    },
    checkout: {
      generated: ['info', 'Generado'], pending: ['warn', 'Pendiente de confirmación'], confirmed: ['ok', 'Confirmado'],
      imputed: ['ok', 'Imputado'], sent: ['ok', 'Comprobante enviado'], rejected: ['bad', 'Rechazado']
    },
    titular: { activo: ['ok', 'Activo'], baja: ['neutral', 'Baja'] },
    prioridad: { alta: ['bad', 'Alta'], normal: ['neutral', 'Normal'] },
    caja: { abierta: ['ok', 'Abierta'], cerrada: ['neutral', 'Cerrada'] },
    sync: { pendiente: ['warn', 'Pendiente de enviar'], enviado: ['ok', 'Enviado'] }
  };
  GA.etiquetaEstado = function (mapa, valor) {
    var m = ESTADOS[mapa] && ESTADOS[mapa][valor];
    return m ? m[1] : valor;
  };
  GA.badge = function (mapa, valor, sufijo) {
    var m = (ESTADOS[mapa] && ESTADOS[mapa][valor]) || ['neutral', valor];
    return '<span class="badge badge--' + m[0] + '">' + GA.ico(m[0]) + '<span>' + esc(m[1]) + (sufijo ? ' ' + esc(sufijo) : '') + '</span></span>';
  };
  GA.badgeTono = function (tono, texto) {
    return '<span class="badge badge--' + tono + '">' + GA.ico(tono) + '<span>' + esc(texto) + '</span></span>';
  };

  /* ---------- Fragmentos comunes ---------- */
  GA.campo = function (o) {
    // o: {id, label, type, value, hint, req, auto, attrs, opciones, err}
    var id = o.id;
    var req = o.req ? ' <span class="req">(obligatorio)</span>' : '';
    var desc = [];
    if (o.hint) desc.push(id + '-hint');
    if (o.err) desc.push(id + '-err');
    var aria = (desc.length ? ' aria-describedby="' + desc.join(' ') + '"' : '') + (o.err ? ' aria-invalid="true"' : '') + (o.req ? ' required' : '');
    var control;
    if (o.type === 'select') {
      control = '<select id="' + id + '" name="' + (o.name || id) + '"' + aria + ' ' + (o.attrs || '') + '>' +
        o.opciones.map(function (op) {
          var v = typeof op === 'string' ? op : op[0];
          var t = typeof op === 'string' ? op : op[1];
          return '<option value="' + esc(v) + '"' + (String(o.value) === String(v) ? ' selected' : '') + '>' + esc(t) + '</option>';
        }).join('') + '</select>';
    } else if (o.type === 'textarea') {
      control = '<textarea id="' + id + '" name="' + (o.name || id) + '" rows="' + (o.rows || 3) + '"' + aria + ' ' + (o.attrs || '') + '>' + esc(o.value || '') + '</textarea>';
    } else {
      control = '<input id="' + id + '" name="' + (o.name || id) + '" type="' + (o.type || 'text') + '" value="' + esc(o.value || '') + '"' +
        (o.auto ? ' autocomplete="' + o.auto + '"' : '') + aria + ' ' + (o.attrs || '') + '>';
    }
    return '<div class="campo' + (o.err ? ' campo--error' : '') + (o.clase ? ' ' + o.clase : '') + '">' +
      '<label for="' + id + '">' + esc(o.label) + req + '</label>' + control +
      (o.hint ? '<p class="hint" id="' + id + '-hint">' + esc(o.hint) + '</p>' : '') +
      (o.err ? '<p class="err" id="' + id + '-err">' + GA.ico('bad') + esc(o.err) + '</p>' : '') + '</div>';
  };

  GA.vacio = function (titulo, texto, accion) {
    return '<div class="vacio"><svg class="vacio__ilus" viewBox="0 0 64 64" aria-hidden="true"><rect x="10" y="14" width="44" height="36" rx="6"/><path d="M18 26h28M18 34h18"/></svg>' +
      '<p class="vacio__titulo">' + esc(titulo) + '</p>' + (texto ? '<p class="vacio__texto">' + esc(texto) + '</p>' : '') + (accion || '') + '</div>';
  };

  GA.resumenErrores = function (errores) {
    if (!errores.length) return '';
    return '<div class="banda banda--bad" role="alert" tabindex="-1" id="resumen-errores"><strong>Revisá ' + (errores.length === 1 ? 'este dato' : 'estos ' + errores.length + ' datos') + ':</strong><ul>' +
      errores.map(function (e) { return '<li><a href="#" data-act="irCampo" data-campo="' + e[0] + '">' + esc(e[1]) + '</a></li>'; }).join('') + '</ul></div>';
  };

  GA.acc.irCampo = function (el, ev) {
    ev.preventDefault();
    var c = document.getElementById(el.getAttribute('data-campo'));
    if (c) c.focus();
  };

  /* ---------- Modal (dialog nativo: atrapa el foco y cierra con Esc) ---------- */
  var origenFoco = null;
  GA.modal = function (o) {
    // o: {titulo, tam: sm|md|lg|xl, cuerpo, pie, pwa}
    var dlg = document.getElementById('modal');
    var yaAbierto = dlg.open;
    if (!yaAbierto) origenFoco = document.activeElement;
    dlg.className = 'modal modal--' + (o.tam || 'md') + (o.pwa ? ' modal--pwa' : '');
    dlg.innerHTML =
      '<div class="modal__cab"><h2 id="modal-titulo" tabindex="-1">' + esc(o.titulo) + '</h2>' +
      '<button type="button" class="btn-ico" data-act="cerrarModal" aria-label="Cerrar">' + GA.ico('cerrar') + '</button></div>' +
      '<div class="modal__cuerpo">' + o.cuerpo + '</div>' + (o.pie ? '<div class="modal__pie">' + o.pie + '</div>' : '');
    if (!yaAbierto) dlg.showModal();
    var primero = dlg.querySelector('[autofocus]') || dlg.querySelector('#modal-titulo');
    if (primero) primero.focus();
  };
  GA.cerrarModal = function () {
    var dlg = document.getElementById('modal');
    if (dlg.open) dlg.close();
  };
  GA.acc.cerrarModal = function () { GA.cerrarModal(); };
  document.addEventListener('DOMContentLoaded', function () {
    var dlg = document.getElementById('modal');
    dlg.addEventListener('close', function () {
      if (dlg.open) return;
      dlg.innerHTML = '';
      if (origenFoco && document.body.contains(origenFoco)) origenFoco.focus();
    });
    dlg.addEventListener('click', function (ev) { if (ev.target === dlg) GA.cerrarModal(); });
  });

  /* ---------- Avisos (toasts) con aria-live ---------- */
  GA.toast = function (texto, tono) {
    var zona = document.getElementById('toasts');
    var t = document.createElement('div');
    t.className = 'toast toast--' + (tono || 'ok');
    t.innerHTML = GA.ico(tono || 'ok') + '<span>' + esc(texto) + '</span>' +
      '<button type="button" class="btn-ico" aria-label="Cerrar aviso">' + GA.ico('cerrar') + '</button>';
    t.querySelector('button').addEventListener('click', function () { t.remove(); });
    zona.appendChild(t);
    if (tono !== 'bad') setTimeout(function () { t.remove(); }, 5000);
  };
  GA.anunciar = function (texto) {
    var r = document.getElementById('anuncios');
    if (!r) return;
    r.textContent = '';
    setTimeout(function () { r.textContent = texto; }, 60);
  };

  /* ---------- Pestañas con teclado (role="tablist") ---------- */
  document.addEventListener('keydown', function (ev) {
    var tab = ev.target.closest && ev.target.closest('[role="tab"]');
    if (!tab) return;
    var lista = tab.closest('[role="tablist"]');
    var tabs = Array.prototype.slice.call(lista.querySelectorAll('[role="tab"]'));
    var i = tabs.indexOf(tab);
    var vertical = lista.getAttribute('aria-orientation') === 'vertical';
    var sig = vertical ? 'ArrowDown' : 'ArrowRight';
    var ant = vertical ? 'ArrowUp' : 'ArrowLeft';
    var destino = null;
    if (ev.key === sig) destino = tabs[(i + 1) % tabs.length];
    else if (ev.key === ant) destino = tabs[(i - 1 + tabs.length) % tabs.length];
    else if (ev.key === 'Home') destino = tabs[0];
    else if (ev.key === 'End') destino = tabs[tabs.length - 1];
    if (destino) { ev.preventDefault(); destino.focus(); destino.click(); }
  });

  GA.pestanas = function (grupo, items, activa, opciones) {
    // items: [[clave, texto, contador?]]
    opciones = opciones || {};
    return '<div class="tabs' + (opciones.vertical ? ' tabs--v' : '') + '" role="tablist" aria-label="' + esc(opciones.label || 'Secciones') + '"' + (opciones.vertical ? ' aria-orientation="vertical"' : '') + '>' +
      items.map(function (it) {
        var sel = it[0] === activa;
        return '<button type="button" role="tab" id="tab-' + grupo + '-' + it[0] + '" aria-selected="' + sel + '" aria-controls="panel-' + grupo + '"' +
          ' tabindex="' + (sel ? '0' : '-1') + '" data-act="' + (opciones.accion || 'tab') + '" data-grupo="' + grupo + '" data-valor="' + it[0] + '">' +
          esc(it[1]) + (it[2] !== undefined ? ' <span class="contador">' + esc(it[2]) + '</span>' : '') + '</button>';
      }).join('') + '</div>';
  };
})(window.GA);
