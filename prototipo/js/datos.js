/*
 * Prototipo navegable GoodApps Cooperativas (artefacto 4.3).
 * Datos 100 % ficticios. Ningún dato proviene de una cooperativa real.
 */
'use strict';
window.GA = window.GA || {};

(function (GA) {
  var CLAVE = 'ga-prototipo-estado-v1';
  GA.HOY = '05-11-2026';

  function cuitConDv(prefijo, dni) {
    var base = prefijo + dni;
    var pesos = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    var suma = 0;
    for (var i = 0; i < 10; i++) suma += Number(base.charAt(i)) * pesos[i];
    var dv = 11 - (suma % 11);
    if (dv === 11) dv = 0;
    if (dv === 10) return null;
    return prefijo + '-' + dni + '-' + dv;
  }
  GA.cuitConDv = cuitConDv;

  GA.validarCuit = function (cuit) {
    if (!/^\d{2}-\d{8}-\d$/.test(cuit)) return 'formato';
    var partes = cuit.split('-');
    var esperado = cuitConDv(partes[0], partes[1]);
    return esperado === cuit ? null : 'dv';
  };

  function semilla() {
    return {
      version: 2,
      sesion: null,
      tema: 'dark',
      recorrido: null,
      offline: false,
      seq: { persona: 5, titular: 127, cuenta: 6, contrato: 5, caso: 46, ot: 3, fcB: 2, fcA: 2, recibo: 2, reciboWeb: 2, checkout: 1, cola: 1 },

      personas: [
        { id: 'P-0001', tipo: 'fisica', nombre: 'Socio', apellido: 'Ejemplo', dni: '00000000', cuit: cuitConDv('20', '00000000'), condIva: 'Consumidor final', email: 'socio@correo.example', telefono: '0000 00-0001', domicilio: 'Calle Ejemplo 100', localidad: 'Villa Ejemplo', verificado: true },
        { id: 'P-0002', tipo: 'fisica', nombre: 'Ana', apellido: 'Prueba', dni: '00000002', cuit: cuitConDv('27', '00000002'), condIva: 'Consumidor final', email: 'ana@correo.example', telefono: '0000 00-0002', domicilio: 'Pasaje Prueba 12', localidad: 'Villa Ejemplo', verificado: true },
        { id: 'P-0003', tipo: 'juridica', razon: 'Comercio Ficticio S.R.L.', dni: '', cuit: cuitConDv('30', '00000003'), condIva: 'Responsable inscripto', email: 'admin@comercio.example', telefono: '0000 00-0003', domicilio: 'Av. Ficticia 250', localidad: 'Villa Ejemplo', verificado: true },
        { id: 'P-0004', tipo: 'fisica', nombre: 'Carlos', apellido: 'Muestra', dni: '00000004', cuit: cuitConDv('20', '00000004'), condIva: 'Consumidor final', email: 'carlos@correo.example', telefono: '0000 00-0004', domicilio: 'Calle Imaginaria 45', localidad: 'Paraje Inventado', verificado: false }
      ],

      titulares: [
        { id: '000123', personaId: 'P-0001', estado: 'activo', asociado: true, alta: '12-03-2019' },
        { id: '000124', personaId: 'P-0002', estado: 'activo', asociado: true, alta: '02-07-2021' },
        { id: '000125', personaId: 'P-0003', estado: 'activo', asociado: false, alta: '15-01-2023' },
        { id: '000126', personaId: 'P-0004', estado: 'activo', asociado: true, alta: '20-09-2024' }
      ],

      cuentas: [
        { id: '0001', titularId: '000123', domicilio: 'Calle Ejemplo 100, Villa Ejemplo', principal: true, entrega: 'Electrónica', grupo: 'General' },
        { id: '0002', titularId: '000123', domicilio: 'Calle Ejemplo 102, Villa Ejemplo', principal: false, entrega: 'Electrónica', grupo: 'General' },
        { id: '0003', titularId: '000124', domicilio: 'Pasaje Prueba 12, Villa Ejemplo', principal: true, entrega: 'Electrónica', grupo: 'General' },
        { id: '0004', titularId: '000125', domicilio: 'Av. Ficticia 250, Villa Ejemplo', principal: true, entrega: 'Papel', grupo: 'General' },
        { id: '0005', titularId: '000126', domicilio: 'Calle Imaginaria 45, Paraje Inventado', principal: true, entrega: 'Electrónica', grupo: 'General' }
      ],

      planes: [
        { id: 'FIB100', nombre: 'Fibra 100', velocidad: '100/50 Mbps', abono: 15000, instalacion: 20000 },
        { id: 'FIB300', nombre: 'Fibra 300', velocidad: '300/100 Mbps', abono: 22000, instalacion: 20000 }
      ],

      contratos: [
        { id: 'INT-0001', cuentaId: '0001', planId: 'FIB100', categoria: 'Residencial', estado: 'active', domicilio: 'Calle Ejemplo 100, Villa Ejemplo', casoId: '2026-000039', otId: '0000001', equipo: 'ONT-EJEMPLO-0001', origen: 'App del socio', alta: '28-10-2026' },
        { id: 'INT-0002', cuentaId: '0003', planId: 'FIB100', categoria: 'Residencial', estado: 'pendingInstallation', domicilio: 'Pasaje Prueba 12, Villa Ejemplo', casoId: '2026-000045', otId: '0000002', equipo: 'ONT (a asignar)', origen: 'App del socio', alta: '04-11-2026' },
        { id: 'INT-0003', cuentaId: '0004', planId: 'FIB300', categoria: 'Comercial', estado: 'active', domicilio: 'Av. Ficticia 250, Villa Ejemplo', casoId: null, otId: null, equipo: 'ONT-EJEMPLO-0003', origen: 'Ventanilla', alta: '10-02-2025' },
        { id: 'INT-0004', cuentaId: '0005', planId: 'FIB100', categoria: 'Residencial', estado: 'active', domicilio: 'Calle Imaginaria 45, Paraje Inventado', casoId: null, otId: null, equipo: 'ONT-EJEMPLO-0004', origen: 'Ventanilla', alta: '01-10-2024' }
      ],

      comprobantes: [
        { id: 'FCA-0001-00000001', tipo: 'FC', letra: 'A', numero: '0001-00000001', fecha: '01-10-2026', vto1: '10-10-2026', vto2: '20-10-2026', periodo: '10-2026', cuentaId: '0004', loteId: 'LOT-2026-10-INT', renglones: [{ concepto: 'Abono mensual Fibra 300', importe: 22000, explica: 'Es el precio mensual del plan Fibra 300 que contrataste.' }], total: 22000, pagado: 22000, fiscal: 'autorizado' },
        { id: 'FCB-0001-00000001', tipo: 'FC', letra: 'B', numero: '0001-00000001', fecha: '01-10-2026', vto1: '10-10-2026', vto2: '20-10-2026', periodo: '10-2026', cuentaId: '0005', loteId: 'LOT-2026-10-INT', renglones: [{ concepto: 'Abono mensual Fibra 100', importe: 15000, explica: 'Es el precio mensual del plan Fibra 100 que contrataste.' }], total: 15000, pagado: 15000, fiscal: 'autorizado' }
      ],

      lotes: [
        { id: 'LOT-2026-10-INT', periodo: '10-2026', ciclo: 'INT-MENSUAL', estado: 'closed', universo: 97, aptos: 97, excepciones: 0, total: 1455000, preparo: 'Usuario Ejemplo A', aprobo: 'Usuario Ejemplo D', muestraRevisada: true },
        {
          id: 'LOT-2026-11-INT', periodo: '11-2026', ciclo: 'INT-MENSUAL', estado: 'prebilled', universo: 100, aptos: 98, excepciones: 2, total: 1500000, preparo: 'Usuario Ejemplo A', aprobo: null, muestraRevisada: false,
          conceptos: [
            { concepto: 'Abono Internet', anterior: 1455000, actual: 1470000 },
            { concepto: 'Instalación', anterior: 0, actual: 30000 }
          ],
          muestra: [
            { cuentaId: '0001', categoria: 'Residencial', fiscal: 'Consumidor final', importe: 35000, revisada: false, variacion: true },
            { cuentaId: '0004', categoria: 'Comercial', fiscal: 'Resp. inscripto', importe: 22000, revisada: false, variacion: false },
            { cuentaId: '0005', categoria: 'Residencial', fiscal: 'Consumidor final', importe: 15000, revisada: false, variacion: false }
          ],
          listaExcepciones: [
            { cuenta: '0091', motivo: 'Falta la condición frente al IVA del titular' },
            { cuenta: '0094', motivo: 'Domicilio fiscal incompleto' }
          ]
        }
      ],

      caja: { abierta: false, numero: 'Caja 01', fecha: GA.HOY, fondo: 0, cobrado: 0, operaciones: 0 },
      recibos: [
        { id: 'RC-0001-00000001', fecha: '08-10-2026', cuentaId: '0005', comprobantes: ['FCB-0001-00000001'], medios: [{ medio: 'Efectivo', importe: 15000 }], total: 15000, entregado: 15000, vuelto: 0, canal: 'Caja 01' },
        { id: 'RC-WEB-00000001', fecha: '09-10-2026', cuentaId: '0004', comprobantes: ['FCA-0001-00000001'], medios: [{ medio: 'Red Link', importe: 22000 }], total: 22000, entregado: 22000, vuelto: 0, canal: 'Ente de cobranza' }
      ],
      checkouts: [],

      casos: [
        {
          id: '2026-000039', clase: 'solicitud', prioridad: 'normal', asunto: 'Alta de Internet · Fibra 100', cuentaId: '0001', contratoId: 'INT-0001', estado: 'resuelto', canal: 'app', vence: '30-10-2026 18:00', responsable: 'Usuario Ejemplo C', otId: '0000001', area: 'Comercial',
          linea: [
            { fecha: '20-10-2026 10:00', autor: 'Socio (app)', texto: 'Quiero contratar Internet en mi domicilio.', tipo: 'mensaje' },
            { fecha: '28-10-2026 16:00', autor: 'Sistema', texto: 'Instalación realizada y servicio activo.', tipo: 'sistema' }
          ]
        },
        {
          id: '2026-000040', clase: 'reclamo', prioridad: 'alta', asunto: 'Sin servicio de Internet', cuentaId: '0005', contratoId: 'INT-0004', estado: 'enCurso', canal: 'teléfono', vence: '04-11-2026 18:00', vencido: true, responsable: 'Usuario Ejemplo C', otId: null, area: 'Técnica', sinIntervencion: '8+ días',
          linea: [{ fecha: '28-10-2026 08:15', autor: 'Usuario Ejemplo C', texto: 'El socio informa que no tiene conexión desde ayer.', tipo: 'nota' }]
        },
        {
          id: '2026-000044', clase: 'consulta', prioridad: 'normal', asunto: 'Consulta por cambio de plan', cuentaId: '0003', contratoId: 'INT-0002', estado: 'esperaSocio', canal: 'email', vence: '08-11-2026 12:00', responsable: 'Usuario Ejemplo D', otId: null, area: 'Comercial',
          linea: [{ fecha: '03-11-2026 11:20', autor: 'Socio (email)', texto: '¿Puedo pasar a Fibra 300 cuando me instalen?', tipo: 'mensaje' }]
        },
        {
          id: '2026-000045', clase: 'solicitud', prioridad: 'normal', asunto: 'Alta de Internet · Fibra 100', cuentaId: '0003', contratoId: 'INT-0002', estado: 'enCurso', canal: 'app', vence: '05-11-2026 17:00', responsable: 'Usuario Ejemplo D', otId: '0000002', area: 'Comercial',
          linea: [
            { fecha: '04-11-2026 09:00', autor: 'Socio (app)', texto: 'Solicito el alta de Internet Fibra 100.', tipo: 'mensaje' },
            { fecha: '04-11-2026 09:05', autor: 'Usuario Ejemplo D', texto: 'Factibilidad favorable. Se genera la OT de instalación.', tipo: 'nota' }
          ]
        }
      ],

      ots: [
        { id: '0000001', operacion: 'Instalación de servicio', tipo: 'Instalación FTTH', clase: 'instalacion', estado: 'closed', prioridad: 'Normal', contratoId: 'INT-0001', casoId: '2026-000039', cuadrilla: 'Cuadrilla Ejemplo 1', visita: '28-10-2026 09:00-12:00', ingreso: 'App del socio', historial: [['pending', '21-10 10:00'], ['scheduled', '21-10 10:05'], ['assigned', '27-10 08:00'], ['dispatched', '28-10 07:45'], ['inProgress', '28-10 09:10'], ['executed', '28-10 11:30'], ['closed', '28-10 16:00']], evidencias: { fotos: 2, serie: 'ONT-EJEMPLO-0001', prueba: 'ok', conformidad: 'Socio Ejemplo · DNI 00000000' }, efectos: 'aplicados' },
        { id: '0000002', operacion: 'Instalación de servicio', tipo: 'Instalación FTTH', clase: 'instalacion', estado: 'assigned', prioridad: 'Normal', contratoId: 'INT-0002', casoId: '2026-000045', cuadrilla: 'Cuadrilla Ejemplo 1', visita: '05-11-2026 09:00-12:00', ingreso: 'App del socio', historial: [['pending', '04-11 10:00'], ['scheduled', '04-11 10:05'], ['assigned', '05-11 08:00']], evidencias: null, efectos: 'pendientes' }
      ],

      colaCampo: [],
      vinculadas: ['0001'],
      intentosVinculo: 0,
      historia: [
        { fecha: '04-11-2026 18:00', titularId: '000123', texto: 'Cuenta 0001 vinculada en la app del socio' },
        { fecha: '28-10-2026 16:00', titularId: '000123', texto: 'Contrato INT-0001 activado (OT 0000001)' }
      ]
    };
  }
  GA.semilla = semilla;

  GA.cargar = function () {
    try {
      var crudo = window.sessionStorage.getItem(CLAVE);
      if (crudo) {
        var e = JSON.parse(crudo);
        if (e && e.version === 2) return e;
      }
    } catch (err) { /* almacenamiento no disponible: se usa memoria */ }
    return semilla();
  };

  GA.guardar = function () {
    try { window.sessionStorage.setItem(CLAVE, JSON.stringify(GA.e)); } catch (err) { /* sin persistencia */ }
  };

  GA.reiniciar = function (conservarSesion) {
    var sesion = GA.e ? GA.e.sesion : null;
    var tema = GA.e ? GA.e.tema : 'dark';
    GA.e = semilla();
    GA.e.tema = tema;
    if (conservarSesion) GA.e.sesion = sesion;
    GA.guardar();
  };

  /* ---------- Consultas sobre el estado ---------- */
  GA.q = {
    persona: function (id) { return GA.e.personas.find(function (p) { return p.id === id; }); },
    titular: function (id) { return GA.e.titulares.find(function (t) { return t.id === id; }); },
    cuenta: function (id) { return GA.e.cuentas.find(function (c) { return c.id === id; }); },
    plan: function (id) { return GA.e.planes.find(function (p) { return p.id === id; }); },
    contrato: function (id) { return GA.e.contratos.find(function (c) { return c.id === id; }); },
    comprobante: function (id) { return GA.e.comprobantes.find(function (c) { return c.id === id; }); },
    lote: function (id) { return GA.e.lotes.find(function (l) { return l.id === id; }); },
    caso: function (id) { return GA.e.casos.find(function (c) { return c.id === id; }); },
    ot: function (id) { return GA.e.ots.find(function (o) { return o.id === id; }); },
    recibo: function (id) { return GA.e.recibos.find(function (r) { return r.id === id; }); },
    checkout: function (id) { return GA.e.checkouts.find(function (c) { return c.id === id; }); },
    nombre: function (persona) {
      if (!persona) return '—';
      return persona.tipo === 'juridica' ? persona.razon : persona.nombre + ' ' + persona.apellido;
    },
    titularDeCuenta: function (cuentaId) {
      var c = GA.q.cuenta(cuentaId);
      return c ? GA.q.titular(c.titularId) : null;
    },
    nombreCuenta: function (cuentaId) {
      var t = GA.q.titularDeCuenta(cuentaId);
      return t ? GA.q.nombre(GA.q.persona(t.personaId)) : '—';
    },
    cuentasDe: function (titularId) { return GA.e.cuentas.filter(function (c) { return c.titularId === titularId; }); },
    contratosDe: function (cuentaId) { return GA.e.contratos.filter(function (c) { return c.cuentaId === cuentaId; }); },
    comprobantesDe: function (cuentaId) { return GA.e.comprobantes.filter(function (c) { return c.cuentaId === cuentaId; }); },
    saldoComprobante: function (fc) { return Math.max(0, fc.total - fc.pagado); },
    impagosDe: function (cuentaId) {
      return GA.q.comprobantesDe(cuentaId).filter(function (c) { return c.total - c.pagado > 0 && c.fiscal === 'autorizado'; });
    },
    saldoCuenta: function (cuentaId) {
      return GA.q.impagosDe(cuentaId).reduce(function (s, c) { return s + (c.total - c.pagado); }, 0);
    },
    casosDeCuentas: function (ids) { return GA.e.casos.filter(function (c) { return ids.indexOf(c.cuentaId) >= 0; }); },
    buscarCuenta: function (texto) {
      var t = String(texto || '').trim().toLowerCase().replace(/[.\s]/g, '');
      if (!t) return null;
      return GA.e.cuentas.find(function (c) {
        var tit = GA.q.titular(c.titularId);
        var p = tit ? GA.q.persona(tit.personaId) : null;
        var nombre = GA.q.nombre(p).toLowerCase().replace(/\s/g, '');
        return c.id === t || c.id === t.padStart(4, '0') ||
          (p && (p.dni === t || p.cuit.replace(/-/g, '') === t.replace(/-/g, ''))) ||
          (nombre.indexOf(t) >= 0);
      }) || null;
    }
  };

  /* ---------- Numeración y fechas ---------- */
  GA.sig = function (clave, largo) {
    var n = GA.e.seq[clave]++;
    return String(n).padStart(largo, '0');
  };

  GA.hora = function () {
    var d = new Date();
    return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  };
  GA.ahora = function () { return GA.HOY + ' ' + GA.hora(); };

  var fmt = new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  GA.num = function (n) { return fmt.format(n || 0); };
  GA.ars = function (n) { return 'ARS ' + fmt.format(n || 0); };
  GA.parseImporte = function (texto) {
    var limpio = String(texto || '').replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
    var n = Number(limpio);
    return isFinite(n) ? n : NaN;
  };
})(window.GA);
