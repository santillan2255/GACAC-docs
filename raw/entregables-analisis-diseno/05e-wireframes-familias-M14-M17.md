# Wireframes por familia de pantallas: M14 a M17

**Artefacto 4.2 (Wireframes). Parte 05e.** Índice del entregable: [05-wireframes-pantallas-piloto.md](05-wireframes-pantallas-piloto.md), sección 11. Patrones: [05a-wireframes-patrones.md](05a-wireframes-patrones.md).

Un wireframe por familia, generado con `_trabajo/pan_generar.py` a partir de la §10 de cada anexo y revisado a mano. Cada wireframe instancia el patrón base de la familia con los campos y las acciones reales de sus PAN; la tabla de cada familia indica las PAN que la componen y en qué se apartan del wireframe. Símbolos: sección 2.1 de `05`. Datos ficticios; `········` indica un valor.

Módulos de esta parte: M14 TES, M15 CON, M16 SUE, M17 INS (31 familias).

## M14 TES: Tesorería y bancos

Anexo `docs/especificacion/anexos/M14-TES-tesoreria-bancos.md`, §10. 9 familias, 42 PAN. Catálogo: [17-14-M14-TES.md](17-catalogo-pantallas/17-14-M14-TES.md).

### FAM-TES-01 Posición y flujo de fondos

| Dato | Valor |
|---|---|
| Patrón base | PT-05 Tablero, reporte o mapa ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-TES-01 Posición diaria y alertas (M14:1771) |
| Portales | admin, empleado |
| Rutas | `/admin/tes/tablero`, `/admin/tes/flujo`, `/admin/tes/previsiones`, `/admin/tes/escenarios` y 1 más |
| Capabilities | `tes.posicion.ver`, `tes.flujo.ver`, `tes.previsiones.crear`, `tes.flujo.simular` |
| Olas | O8 |

```text
+----------------------------------------------------------------------------+
| Posición diaria y alertas   Período [dd-mm-yyyy a dd-mm-yyyy] [Exportar ▼] |
| [Sucursal ▼] [Servicio ▼]                                                  |
+----------------------------------------------------------------------------+
| +-Indicador 1---+ +-Indicador 2---+ +-Indicador 3---+ +-Indicador 4---+    |
| | ######        | | ######        | | ######        | | ######        |    |
| +---------------+ +---------------+ +---------------+ +---------------+    |
| +-- Gráfico: evolución mensual ----+ +-- Distribución o mapa ------------+ |
| | ##################               | | ##################                | |
| +----------------------------------+ +-----------------------------------+ |
+----------------------------------------------------------------------------+
| Disponible En tránsit A acredita Cartera    No debitad Proyección [...]    |
| -----------------------------------------------------------------------    |
| $ 0.000,00 ········   ········   ········   ········   ········    ...     |
| $ 0.000,00 ········   ········   ········   ········   ········    ...     |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M14:1771, M14:1802, M14:1803, M14:1804, M14:1811): Columnas: Disponible total, En tránsito, A acreditar, Cartera, No debitados, Proyección 7/30 días; Campos: Disponible total, En tránsito, A acreditar, Cartera, No debitados, Proyección 7/30 días, Gráfico de saldo proyectado, Lista de alertas; Acciones: Ir a cada bandeja, Exportar, Recalcular, Guardar snapshot, Alta/edición, Liberar compromiso, Crear, Duplicar, Archivar, Ver detalle.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-TES-01 | Posición diaria y alertas | PT-05 | `/admin/tes/tablero` | Campos: disponible total, en tránsito, a acreditar, cartera, no debitados, proyección 7/30 días, gráfico de saldo… |
| PAN-TES-32 | Flujo de fondos proyectado | PT-05 | `/admin/tes/flujo` | Flujo de fondos proyectado. Selector horizonte y granularidad; tabla por fecha con ingresos/egresos por origen y… |
| PAN-TES-33 | Previsiones y compromisos | PT-02 | `/admin/tes/previsiones` | Usa PT-02 Ficha o detalle con pestañas. Previsiones y compromisos. Pestañas Previsiones (con periodicidad) y Compromisos (con consumo y liberación)… |
| PAN-TES-34 | Escenarios de liquidez | PT-01 | `/admin/tes/escenarios` | Usa PT-01 Listado con filtros. Escenarios de liquidez. Lista de escenarios con supuestos; comparación con base. Crear, duplicar, archivar |
| PAN-TES-41 | Posición diaria móvil | PT-07 | `/app/tesoreria/posicion` | Usa PT-07 Portal del socio y del empleado (PWA). Posición diaria móvil. Cards por cuenta: disponible, tránsito; proyección 7 días. Ver detalle |

### FAM-TES-02 Cuentas y libro de bancos

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-TES-02 Listado de cuentas financieras (M14:1772) |
| Portales | admin |
| Rutas | `/admin/tes/cuentas`, `/admin/tes/entidades`, `/admin/tes/categorias`, `/admin/tes/movimientos` y 2 más |
| Capabilities | `tes.cuentas.ver`, `tes.cuentas.crear/editar`, `tes.cuentas.configurar`, `tes.categorias.configurar` y 1 más |
| Olas | O5 |

```text
+----------------------------------------------------------------------------+
| Inicio > TES > Listado de cuentas fin… [Bloquear] [Cerrar] [Nueva cuenta*] |
| Listado de cuentas financieras                                   (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Tipo ▼] [Moneda ▼] [Estado ▼] [Sucursal ▼]            |
| [Más filtros]                                                              |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Código    Nombre    Tipo      Entidad   CBU       Moneda    [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Bloquear] [Cerrar] [Ver libro]  25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M14:1772, M14:1773, M14:1774, M14:1775, M14:1776, M14:1777): Filtros: Tipo, Moneda, Estado, Sucursal; Columnas: Código, Nombre, Tipo, Entidad, CBU, Moneda, Saldo operativo, Saldo contable; Pestañas: Datos, Medios habilitados, Firmantes, Interbanking, Contabilidad, Alertas; Pasos: Tipo, Ingresos, Egresos, Cupones/retenciones, Datos de comprobante; Acciones: Nueva cuenta, Bloquear, Cerrar, Ver libro, Guardar, Validar CBU, Vincular IB, Alta/edición, Importar con ExcelImportWizard, Nueva operación.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-TES-02 | Listado de cuentas financieras | PT-01 | `/admin/tes/cuentas` | Filtros: tipo, moneda, estado, sucursal; Columnas: código, nombre, tipo, entidad, CBU, moneda, saldo operativo, saldo… |
| PAN-TES-03 | Ficha de cuenta | PT-11 | modal en PAN-TES-02 | Usa PT-11 Modal, pestaña o componente embebido. Pestañas: Datos, Medios habilitados, Firmantes, Interbanking, Contabilidad, Alertas |
| PAN-TES-04 | Entidades financieras y sucursales | PT-01 | `/admin/tes/entidades` | Entidades financieras y sucursales. Dos DataTables maestro-detalle. Alta/edición (modal md) |
| PAN-TES-05 | Categorías y conceptos | PT-09 | `/admin/tes/categorias` | Usa PT-09 Configuración versionada. Categorías y conceptos. Pestañas Categorías (con tipos permitidos y clase de gasto) y Conceptos. Alta/edición (modal… |
| PAN-TES-06 | Libro unificado de movimientos y operaciones | PT-05 | `/admin/tes/movimientos` | Usa PT-05 Tablero, reporte o mapa. Pasos: tipo, ingresos, egresos, cupones/retenciones, datos de comprobante, confirmar, con componente "medio de … |
| PAN-TES-07 | Libro de bancos / tesorería | PT-05 | `/admin/tes/cuentas/:id/libro` | Usa PT-05 Tablero, reporte o mapa. Libro de bancos / tesorería. Saldo inicial, movimientos, saldo acumulado, selector tipo de fecha (emisión, valor… |
| PAN-TES-37 | Detalle de operación | PT-02 | `/admin/tes/operaciones/:id` | Usa PT-02 Ficha o detalle con pestañas. Detalle de operación. Cabecera, movimientos, medios, valores, origen, asiento, auditoría. Imprimir comprobante… |

### FAM-TES-03 Extractos y conciliación bancaria

| Dato | Valor |
|---|---|
| Patrón base | PT-06 Bandeja de trabajo ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-TES-09 Conciliación bancaria asistida (M14:1779) |
| Portales | admin |
| Rutas | `/admin/tes/extractos`, `/admin/tes/conciliacion/:cuenta`, `/admin/tes/reglas-conciliacion` |
| Capabilities | `tes.extractos.importar`, `tes.conciliacion.conciliar`, `tes.reglasConciliacion.configurar` |
| Olas | O5 |

```text
+----------------------------------------------------------------------------+
| Bandeja: Conciliación bancaria asistida           [Confirmar sugerencias*] |
| [Mías N] [Equipo N] [Vencidas N] [Sin asignar N]   [Fecha de co… ▼]        |
+----------------------------------------------------------------------------+
| +-- Lista ---------------------+ +-- Detalle ----------------------------+ |
| | [SLA 2 h] Cuenta · Fecha … … | | Cuenta: ········                      | |
| | [SLA 2 h] Cuenta · Fecha … … | | Fecha de corte: ········              | |
| | [SLA 2 h] Cuenta · Fecha … … | | Saldo extracto: ········              | |
| | ...                          | | Saldo libro: ········                 | |
| |                              | | Diferencia: ········                  | |
| |                              | | Línea de tiempo y comentarios         | |
| |                              | | [Conciliar automát…] [Conciliar sele… | |
| +------------------------------+ +---------------------------------------+ |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M14:1778, M14:1779, M14:1780): Filtros: Fecha de corte; Columnas: Cuenta, Fecha de corte, Saldo extracto, Saldo libro, Diferencia; Campos: Cuenta, Fecha de corte, Saldo extracto, Saldo libro, Diferencia; Acciones: Conciliar automático, Confirmar sugerencias, Conciliar selección, Crear movimiento desde línea, Enviar a no identificados, Desconciliar, Cerrar conciliación, Imprimir reporte, Importar, Administrar perfiles.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-TES-08 | Importaciones de extractos | PT-04 | `/admin/tes/extractos` | Usa PT-04 Asistente por pasos o proceso masivo. Importaciones de extractos. DataTable de importaciones (cuenta, período, saldos, líneas, duplicados, continuidad)… |
| PAN-TES-09 | Conciliación bancaria asistida | PT-06 | `/admin/tes/conciliacion/:cuenta` | Campos: cuenta, fecha de corte, saldo extracto, saldo libro, diferencia |
| PAN-TES-10 | Reglas de conciliación | PT-06 | `/admin/tes/reglas-conciliacion` | Reglas de conciliación. DataTable con prioridad (arrastrar). Alta/edición, probar sobre extracto (simulación) |

### FAM-TES-04 Interbanking y archivos bancarios

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-TES-11 Conexión y cuentas IB (M14:1781) |
| Portales | admin |
| Rutas | `/admin/tes/interbanking`, `/admin/tes/interbanking/saldos`, `/admin/tes/archivos-pago` |
| Capabilities | `tes.interbanking.configurar`, `tes.interbanking.sincronizar`, `tes.archivosPago.generar` |
| Olas | O5 a O8 |

```text
+----------------------------------------------------------------------------+
| Inicio > TES > Conexión… [Sincronizar ahora] [Vincular] [Probar conexión*] |
| Conexión y cuentas IB                                            (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Fecha/hora ▼] [Más filtros]                           |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Cuenta    Saldo ban Saldo lib Diferenci Fecha/hor Propósito [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   $ 0.000,0 $ 0.000,0 ·······   dd-mm-yyy ·······    ...       |
| [ ] ·······   $ 0.000,0 $ 0.000,0 ·······   dd-mm-yyy ·······    ...       |
| [ ] ·······   $ 0.000,0 $ 0.000,0 ·······   dd-mm-yyy ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Sincronizar ahora] [Vincular] … 25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M14:1781, M14:1782, M14:1783): Filtros: Fecha/hora; Columnas: Cuenta, Saldo banco, Saldo libro, Diferencia, Fecha/hora, Propósito, Formato, Cuenta origen; Acciones: Probar conexión, Sincronizar ahora, Vincular, Editar mapeos, Actualizar, Generar, Descargar, Registrar envío/acuse, Importar respuesta, Anular no enviado.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-TES-11 | Conexión y cuentas IB | PT-01 | `/admin/tes/interbanking` | Conexión y cuentas IB. Estado de conexión, último token, cuentas IB y vínculo, mapeo de códigos, corridas. Probar… |
| PAN-TES-12 | Saldos IB vs libro | PT-05 | `/admin/tes/interbanking/saldos` | Usa PT-05 Tablero, reporte o mapa. Columnas: cuenta, saldo banco, saldo libro, diferencia, fecha/hora |
| PAN-TES-13 | Archivos de pago | PT-03 | `/admin/tes/archivos-pago` | Usa PT-03 Formulario o editor. Columnas: propósito, formato, cuenta origen, fecha, líneas, total, estado |

### FAM-TES-05 Valores, tarjetas y depositos

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-TES-14 Cartera de valores de terceros (M14:1784) |
| Portales | admin |
| Rutas | `/admin/tes/valores`, `/admin/tes/libradores`, `/admin/tes/depositos`, `/admin/tes/tarjetas` y 3 más |
| Capabilities | `tes.valores.ver`, `tes.valores.crear`, `tes.valores.editar`, `tes.depositos.crear` y 4 más |
| Olas | O5 a O8 |

```text
+----------------------------------------------------------------------------+
| Inicio > TES > Cartera de… [Habilitar/deshabi…] [Depositar] [Nuevo valor*] |
| Cartera de valores de terceros                                   (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Fecha de pago ▼] [Estado ▼] [Más filtros]             |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Formato   Banco     Número    Librador  CUIT      Fecha de  [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   dd-mm-yyy  ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   dd-mm-yyy  ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   dd-mm-yyy  ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Habilitar/deshabi…] [Depositar… 25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M14:1784, M14:1785, M14:1786, M14:1787, M14:1791, M14:1792): Filtros: Fecha de pago, Estado; Columnas: Formato, Banco, Número, Librador, CUIT, Fecha de pago, Importe, Estado; Acciones: Nuevo valor, Habilitar/deshabilitar para pago, Depositar, Rechazar, Recuperar, Devolver, Egreso manual, Ver historial, Guardar, Ver rechazados.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-TES-14 | Cartera de valores de terceros | PT-01 | `/admin/tes/valores` | Columnas: formato, banco, número, librador, CUIT, fecha de pago, importe, estado, custodia, habilitado para pago… |
| PAN-TES-15 | Alta/edición de valor | PT-03 | modal lg | Usa PT-03 Formulario o editor. Alta/edición de valor. Campos de RF-TES-061, lectura CMC-7, cálculo de valor actual, aviso de rechazados del librador… |
| PAN-TES-16 | Cuentas de libradores | PT-01 | `/admin/tes/libradores` | Cuentas de libradores. DataTable con bloqueo. Bloquear/desbloquear |
| PAN-TES-17 | Depósitos bancarios | PT-01 | `/admin/tes/depositos` | Depósitos bancarios. DataTable de boletas con estado y fecha probable. Nuevo depósito (modal lg: cuenta, efectivo… |
| PAN-TES-21 | Tarjetas y planes | PT-02 | `/admin/tes/tarjetas` | Usa PT-02 Ficha o detalle con pestañas. Tarjetas y planes. DataTable; ficha con recargos por cuotas. Alta/edición, agregar/quitar cuota |
| PAN-TES-22 | Cupones | PT-01 | `/admin/tes/cupones` | Pasos: Presentar (lote), anular presentación …, PAN-TES-23) |
| PAN-TES-23 | Liquidaciones de tarjeta | PT-04 | `/admin/tes/liquidaciones-tarjeta` | Usa PT-04 Asistente por pasos o proceso masivo. Liquidaciones de tarjeta. DataTable; formulario de liquidación con desglose y control de cuadre. Registrar, anular… |
| PAN-TES-24 | Cartera de retenciones recibidas | PT-01 | `/admin/tes/retenciones-recibidas` | Cartera de retenciones recibidas. DataTable con tipo, agente, certificado, importe, estado, cómputo M06. Nueva (modal… |

### FAM-TES-06 Cheques y eCheq

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-TES-18 Chequeras y cheques propios (M14:1788) |
| Portales | admin |
| Rutas | `/admin/tes/chequeras`, `/admin/tes/echeq` |
| Capabilities | `tes.chequeras.ver`, `tes.echeq.ver`, `tes.chequeras.imprimir` |
| Olas | O5 a O8 |

```text
+----------------------------------------------------------------------------+
| Inicio > TES … [Anular/desmarcar …] [Reemplazar en pago] [Nueva chequera*] |
| Chequeras y cheques propios                                      (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Más filtros]                                          |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Chequeras Cheques p Maestro   Detalle   Nueva che Anular/de [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Anular/desmarcar …] [Reemplaza… 25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M14:1788, M14:1789, M14:1790): Columnas: Chequeras, Cheques propios, Maestro, Detalle, Nueva chequera, Anular/desmarcar cheque; Campos: Chequeras, Cheques propios, Maestro, Detalle, Nueva chequera, Anular/desmarcar cheque; Acciones: Nueva chequera, Anular/desmarcar cheque, Reemplazar en pago, Recuperar, Baja parcial, Aceptar/repudiar recibido, Endosar, Depositar, Custodia, Negociar.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-TES-18 | Chequeras y cheques propios | PT-01 | `/admin/tes/chequeras` | Chequeras y cheques propios. Maestro (chequeras) / detalle (cheques con estado, número, beneficiario, fecha de pago… |
| PAN-TES-19 | Bandeja eCheq | PT-06 | `/admin/tes/echeq` | Usa PT-06 Bandeja de trabajo. Bandeja eCheq. Pestañas Emitidos y Recibidos con estado bancario; alertas de aceptación. Aceptar/repudiar recibido… |
| PAN-TES-20 | Impresión de cheques | PT-11 | modal xl en PAN-TES-18 | Usa PT-11 Modal, pestaña o componente embebido. Impresión de cheques. Rango desde/hasta, vista previa, formato. Imprimir, marcar impresos |

### FAM-TES-07 Pagos y firma

| Dato | Valor |
|---|---|
| Patrón base | PT-07 Portal del socio y del empleado (PWA) ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-TES-40 Firma móvil de pagos (M14:1810) |
| Portales | admin, empleado |
| Rutas | `/admin/tes/cajas-pago`, `/admin/tes/pagos`, `/admin/tes/pagos/firma`, `/app/tesoreria/firmas` |
| Capabilities | `tes.cajasPago.abrir`, `tes.pagos.ver`, `tes.pagos.firmar` |
| Olas | O5 a O8 |

```text
+------------------------------------------------------------+
| < Firma móvil de pagos                                 (o) |
| Cuenta [Cuenta 0001 ▼]                                     |
+------------------------------------------------------------+
| +--------------------------------------------------------+ |
| | Origen: ········                                       | |
| | Beneficiario: ········                                 | |
| | Vencimiento: ········                                  | |
| | Programado: ········                                   | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| +--------------------------------------------------------+ |
| | Origen: ········                                       | |
| | Beneficiario: ········                                 | |
| | Vencimiento: ········                                  | |
| | Programado: ········                                   | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| [                        Firmar                       * ]  |
+------------------------------------------------------------+
| Inicio | Recibos | (+) | Solicitudes | Perfil              |
+------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M14:1795, M14:1796, M14:1797, M14:1810): Columnas: Origen, Beneficiario, Vencimiento, Programado, Neto, Estado, Firmas; Acciones: Firmar, Rechazar con motivo, Abrir, Cerrar con arqueo, Reabrir, Consultar por mes/12 meses, Instrumentar, Programar fecha, Anular, Imprimir comprobante.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-TES-25 | Cajas para pagos a proveedores | PT-03 | `/admin/tes/cajas-pago` | Usa PT-03 Formulario o editor. Cajas para pagos a proveedores. Sesiones por fecha con tope, medios, pagado, disponible, estado. Abrir, cerrar con… |
| PAN-TES-26 | Bandeja de pagos a ejecutar | PT-06 | `/admin/tes/pagos` | Usa PT-06 Bandeja de trabajo. Columnas: origen, beneficiario, vencimiento, programado, neto, estado, firmas |
| PAN-TES-27 | Firma y entrega | PT-01 | `/admin/tes/pagos/firma` | Usa PT-01 Listado con filtros. Firma y entrega. Lista de pagos firmables por el usuario con total seleccionado. Firmar (individual/masivo, 2FA)… |
| PAN-TES-40 | Firma móvil de pagos | PT-07 | `/app/tesoreria/firmas` | Firma móvil de pagos. Cards de pagos pendientes de firma (beneficiario, importe, vencimiento, cuenta) con skeleton y… |

### FAM-TES-08 Cajas y cierres

| Dato | Valor |
|---|---|
| Patrón base | PT-04 Asistente por pasos o proceso masivo ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-TES-29 Arqueo y cierre de caja de tesorería (M14:1799) |
| Portales | admin |
| Rutas | `/admin/tes/rendiciones`, `/admin/tes/cierre-caja`, `/admin/tes/periodos` |
| Capabilities | `tes.rendiciones.recibir`, `tes.cierreCaja.cerrar`, `tes.periodos.cerrar` |
| Olas | O5 a O8 |

```text
+----------------------------------------------------------------------------+
| Arqueo y cierre de caja de tesorería                            [Cancelar] |
+----------------------------------------------------------------------------+
| (1) Datos ── (2) Validación ── (3) Confirmación                            |
|                                                                            |
| Paso 2 de 3: Validación                                                    |
|                                                                            |
| Proceso en segundo plano (JobProgress): [##########..........] 50 %        |
| Resultado: N procesados · N con error [Descargar errores]                  |
+----------------------------------------------------------------------------+
| [Anterior]                                    [Guardar borrador] [Cerrar*] |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M14:1798, M14:1799, M14:1812): Columnas: Caja, Cajero, Fecha, Declarado, Estado, Antigüedad; Acciones: Cerrar, Reabrir, Imprimir planilla, Recibir, Aceptar, Aceptar con diferencia, Observar, Anular.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-TES-28 | Rendiciones de cajas de cobranza | PT-01 | `/admin/tes/rendiciones` | Usa PT-01 Listado con filtros. Columnas: caja, cajero, fecha, declarado, estado, antigüedad |
| PAN-TES-29 | Arqueo y cierre de caja de tesorería | PT-04 | `/admin/tes/cierre-caja` | Arqueo y cierre de caja de tesorería. Saldo inicial, ingresos, egresos, teórico, contado, diferencia por moneda… |
| PAN-TES-42 | Cierre de períodos de Tesorería y Bancos | PT-04 | `/admin/tes/periodos` | Cierre de períodos de Tesorería y Bancos. Fechas de cierre por módulo, bloqueantes (cajas abiertas, conciliaciones… |

### FAM-TES-09 Monedas, instrumentos, informes y parámetros

| Dato | Valor |
|---|---|
| Patrón base | PT-09 Configuración versionada ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-TES-39 Parámetros de tesorería (M14:1809) |
| Portales | admin |
| Rutas | `/admin/tes/monedas`, `/admin/tes/tipos-valor`, `/admin/tes/haberes`, `/admin/tes/informes` y 2 más |
| Capabilities | `tes.monedas.configurar`, `tes.configuracion.configurar`, `tes.haberes.ejecutar`, `tes.informes.ver` y 1 más |
| Olas | O5 a O9 |

```text
+----------------------------------------------------------------------------+
| Parámetros de tesorería                                          (?) Ayuda |
| Versión [v3 · Vigente ▼]  [Borrador]  Vigencia desde [dd-mm-yyyy]          |
| [Comparar versiones] [Historial] [Duplicar]                     [Guardar*] |
+----------------------------------------------------------------------------+
| +-- Secciones ---------+ +-- Edición ------------------------------------+ |
| | > No identificados … | | Formulario agrupado de … [______________]     | |
| | > Líneas sin clasif… | | Reglas de firmas [______________]             | |
| | > Archivos sin resp… | | Umbrales de aprobación [______________]       | |
| | > Eventos no proces… | | Horarios de jobs [______________]             | |
| | > Diferencias de re… | | Guardar [______________]                      | |
| |                      | | Monedas [______________]                      | |
| +----------------------+ +-----------------------------------------------+ |
| ApprovalBar: el cambio queda en borrador hasta su aprobación (doble contr… |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M14:1800, M14:1801, M14:1805, M14:1806, M14:1808, M14:1809): Pestañas: No identificados enviados a M07, Líneas sin clasificar, Archivos sin respuesta, Eventos no procesados, Diferencias de rendición; Campos: Formulario agrupado de §14, Reglas de firmas, Umbrales de aprobación, Horarios de jobs, Guardar, Monedas, Cotizaciones, Habilitar; Acciones: Guardar, Publicar, Habilitar, Editar reglas, Cargar cotización, Actualizar desde fuente, Alta/edición, Generar archivo, Registrar envío, Importar respuesta.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-TES-30 | Monedas y cotizaciones | PT-02 | `/admin/tes/monedas` | Usa PT-02 Ficha o detalle con pestañas. Monedas y cotizaciones. Pestañas Monedas habilitadas y Cotizaciones (DataTable por moneda/fuente/fecha). Habilitar… |
| PAN-TES-31 | Tipos de instrumento | PT-09 | `/admin/tes/tipos-valor` | Tipos de instrumento. DataTable. Alta/edición |
| PAN-TES-35 | Lotes de pago de haberes | PT-04 | `/admin/tes/haberes` | Usa PT-04 Asistente por pasos o proceso masivo. Lotes de pago de haberes. DataTable de lotes (período, total, estado); detalle por empleado solo con… |
| PAN-TES-36 | Catálogo de informes | PT-05 | `/admin/tes/informes` | Usa PT-05 Tablero, reporte o mapa. Catálogo de informes. Lista de informes de §15 con parámetros (fecha de corte, cuentas, monedas). Ejecutar, exportar… |
| PAN-TES-38 | Bandeja de excepciones | PT-06 | `/admin/tes/excepciones` | Usa PT-06 Bandeja de trabajo. Pestañas: no identificados enviados a M07, líneas sin clasificar, archivos sin respuesta, eventos no procesados… |
| PAN-TES-39 | Parámetros de tesorería | PT-09 | `/admin/tes/configuracion` | Parámetros de tesorería. Formulario agrupado de §14, reglas de firmas, umbrales de aprobación, horarios de jobs… |

## M15 CON: Contabilidad

Anexo `docs/especificacion/anexos/M15-CON-contabilidad.md`, §10. 8 familias, 40 PAN. Catálogo: [17-15-M15-CON.md](17-catalogo-pantallas/17-15-M15-CON.md).

### FAM-CON-01 Tablero, configuración, salud y contador externo

| Dato | Valor |
|---|---|
| Patrón base | PT-09 Configuración versionada ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-CON-02 Configuración contable (M15:1671) |
| Portales | admin |
| Rutas | `/admin/con`, `/admin/con/configuracion`, `/admin/con/externo`, `/admin/con/salud` |
| Capabilities | `con.asientos.ver`, `con.config.ver`, `con.externo.ver` |
| Olas | O5 |

```text
+----------------------------------------------------------------------------+
| Configuración contable                                           (?) Ayuda |
| Versión [v3 · Vigente ▼]  [Borrador]  Vigencia desde [dd-mm-yyyy]          |
| [Comparar versiones] [Historial] [Duplicar]            [Guardar borrador*] |
+----------------------------------------------------------------------------+
| +-- Secciones ---------+ +-- Edición ------------------------------------+ |
| | > Tablero contable   | | Formulario por pestañas [______________]      | |
| | > Sistema contable … | | Historial de versiones … [______________]     | |
| | > Salud de la confi… | | Tarjetas [______________]                     | |
| +----------------------+ +-----------------------------------------------+ |
| ApprovalBar: el cambio queda en borrador hasta su aprobación (doble contr… |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M15:1665, M15:1671, M15:1858, M15:1873): Pestañas: Tablero contable, Sistema contable externo, Salud de la configuración contable; Campos: Formulario por pestañas, Historial de versiones en modal lg, Tarjetas; Zonas: Formulario por pestañas, Historial de versiones en modal lg, Tarjetas; Acciones: Guardar borrador, Validar, Ir a bandeja, Ir a cierre de período.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-CON-01 | Tablero contable | PT-05 | `/admin/con` | Usa PT-05 Tablero, reporte o mapa. Zonas: tarjetas |
| PAN-CON-02 | Configuración contable | PT-09 | `/admin/con/configuracion` | Zonas: formulario por pestañas, historial de versiones en modal lg |
| PAN-CON-37 | Sistema contable externo | PT-01 | `/admin/con/externo` | Usa PT-01 Listado con filtros. / con.externo.ejecutar. Mapeo de operaciones y cuentas externas (externalLedgerMappings), layouts, exportaciones e… |
| PAN-CON-40 | Salud de la configuración contable | PT-09 | `/admin/con/salud` | Lista de hallazgos del JOB-CON-19 por severidad (bloqueante, advertencia): roles sin cuenta, entidades sin cuenta… |

### FAM-CON-02 Planes de cuentas, rubros, reglas y asignaciones

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-CON-03 Planes de cuentas (M15:1677) |
| Portales | admin |
| Rutas | `/admin/con/planes`, `/admin/con/planes/:chartId/cuentas`, `/admin/con/planes/:chartId/rubros`, `/admin/con/planes/:chartId/cuentas/mantenimiento` y 5 más |
| Capabilities | `con.planes.ver`, `con.cuentas.ver`, `con.cuentas.editar`, `con.cuentas.renumerar` y 3 más |
| Olas | O5 a O8 |

```text
+----------------------------------------------------------------------------+
| Inicio > CON > Planes de cuentas               [Copiar] [Aprobar] [Nuevo*] |
| Planes de cuentas                                                (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Propósito ▼] [Estado ▼] [Vigencia ▼] [Imputable ▼]    |
| [Más filtros]                                                              |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Código    Nombre    Propósito Estado    Versión   Vigencia  [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   [Activo]  ·······   dd-mm-yyy  ...       |
| [ ] ·······   ·······   ·······   [Pendient ·······   dd-mm-yyy  ...       |
| [ ] ·······   ·······   ·······   [Activo]  ·······   dd-mm-yyy  ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Copiar] [Aprobar] [Promover a … 25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M15:1677, M15:1683, M15:1690, M15:1695, M15:1700, M15:1706): Filtros: Propósito, Estado, Vigencia, Imputable, Naturaleza, Rubro; Columnas: Código, Nombre, Propósito, Estado, Versión, Vigencia, Ejercicios que lo usan, Cuentas; Campos: Código, Nombre, Padre, Imputable, Naturaleza, Saldo normal, Regularizadora, Rubro/subrubro, Ajustable, Monetaria; Zonas: Árbol a la izquierda; Pasos: Grilla cuenta origen, Destinos con porcentaje y condición; Modales: Alta rápida md. Equivalencia; Acciones: Nuevo, Copiar, Aprobar, Promover a operativo para un ejercicio, Archivar, Alta, Edición, Inactivar, Imprimir plan, Exportar.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-CON-03 | Planes de cuentas | PT-01 | `/admin/con/planes` | Filtros: propósito, estado, vigencia; Columnas: código, nombre, propósito, estado, versión, vigencia, ejercicios que… |
| PAN-CON-04 | Árbol y ficha de cuentas | PT-02 | `/admin/con/planes/:chartId/cuentas` | Usa PT-02 Ficha o detalle con pestañas. Filtros: imputable, naturaleza, rubro, ajustable, estado, con movimientos, "sin rubro"; Campos: código, nombre, padre… |
| PAN-CON-05 | Rubros y subrubros contables | PT-01 | `/admin/con/planes/:chartId/rubros` | Columnas: código, nombre, tipo, sección de estados, orden, cuentas asociadas |
| PAN-CON-06 | Renumerar y unificar cuentas | PT-01 | `/admin/con/planes/:chartId/cuentas/mantenimiento` | / con.cuentas.unificar. renumerar: cuenta, código nuevo, vista previa de hijos afectados. Unificar: cuenta origen(es)… |
| PAN-CON-07 | Roles de cuenta | PT-01 | `/admin/con/planes/:chartId/roles` | Columnas: rol, grupo, cuenta, overrides, número V2 de origen, PRM-ID, estado |
| PAN-CON-08 | Reglas de imputación y simulador | PT-04 | `/admin/con/reglas` | Usa PT-04 Asistente por pasos o proceso masivo. Filtros: tipo de evento, rol de importe, cuenta, dimensión, estado, vigencia; Columnas: código, nombre, evento, rol de… |
| PAN-CON-09 | Asignación y reasignación masiva de cuentas | PT-04 | `/admin/con/asignaciones` | Usa PT-04 Asistente por pasos o proceso masivo. Selector de tipo de entidad (productos, servicios, alícuotas, tipos de factura, grupos contables, proveedores, bancos… |
| PAN-CON-32 | Equivalencias entre planes | PT-04 | `/admin/con/equivalencias` | Usa PT-04 Asistente por pasos o proceso masivo. Pasos: grilla cuenta origen, destinos con porcentaje y condición |
| PAN-CON-38 | Rubros de capital | PT-01 | `/admin/con/capital-rubros` | Rubro de capital, rubros de producto incluidos (exclusivos), cuentas de suscripto, integrado, a cobrar y a devolver… |

### FAM-CON-03 Ejercicios y períodos

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-CON-10 Ejercicios (M15:1717) |
| Portales | admin |
| Rutas | `/admin/con/ejercicios`, `/admin/con/periodos`, `/admin/con/ejercicios/:id/cierre` |
| Capabilities | `con.ejercicios.ver`, `con.periodos.ver`, `con.ejercicios.cerrar` |
| Olas | O5 |

```text
+----------------------------------------------------------------------------+
| Inicio > CON > Ejercicios                   [Abrir] [Ir a cierre] [Nuevo*] |
| Ejercicios                                                       (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Estado ▼] [Más filtros]                               |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Número    Desde     Hasta     Estado    Irregular Plan oper [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   [Activo]  ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   [Pendient ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   [Activo]  ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Abrir] [Ir a cierre]            25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M15:1717, M15:1722, M15:1828): Filtros: Estado; Columnas: Número, Desde, Hasta, Estado, Irregular, Plan operativo, Asientos de cierre/apertura, Cerrado por; Acciones: Nuevo, Abrir, Ir a cierre, Bloquear/desbloquear módulo hasta fecha, Cerrar período.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-CON-10 | Ejercicios | PT-01 | `/admin/con/ejercicios` | Columnas: número, desde, hasta, estado, irregular, plan operativo, asientos de cierre/apertura, cerrado por, fecha de… |
| PAN-CON-11 | Períodos y bloqueos por módulo | PT-01 | `/admin/con/periodos` | / con.periodos.bloquear / con.periodos.reabrir. Matriz meses × módulos (facturación, comprobantes de venta, cobranza… |
| PAN-CON-31 | Cierre y reapertura de ejercicio; cuentas de resultado | PT-04 | `/admin/con/ejercicios/:id/cierre` | Usa PT-04 Asistente por pasos o proceso masivo. / con.ejercicios.reabrir. Pestaña "Cuentas de resultado" (destinos por prefijo, cuentas o rubros; ganancias/pérdidas)… |

### FAM-CON-04 Asientos y contabilización

| Dato | Valor |
|---|---|
| Patrón base | PT-04 Asistente por pasos o proceso masivo ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-CON-17 Lote de contabilización ("Cierre automático") (M15:1757) |
| Portales | admin |
| Rutas | `/admin/con/asientos`, `/admin/con/asientos/:id`, `/admin/con/plantillas`, `/admin/con/asientos/importar` y 4 más |
| Capabilities | `con.asientos.ver`, `con.asientos.crear`, `con.asientos.importar`, `con.eventos.ver` y 3 más |
| Olas | O5 a O8 |

```text
+----------------------------------------------------------------------------+
| Lote de contabilización ("Cierre automático")                   [Cancelar] |
+----------------------------------------------------------------------------+
| (1) Rango ── (2) Ejercicio ── (3) Módulos ── (4) Detalle diario o …        |
|                                                                            |
| Paso 2 de 4: Ejercicio                                                     |
|   Rango                           [______________________]                 |
|   Ejercicio                       [______________________]                 |
|   Módulos                         [______________________]                 |
|   Detalle diario o por operación  [______________________]                 |
|                                                                            |
| Proceso en segundo plano (JobProgress): [##########..........] 50 %        |
| Resultado: N procesados · N con error [Descargar errores]                  |
+----------------------------------------------------------------------------+
| [Anterior]                                     [Guardar borrador] [Nuevo*] |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M15:1728, M15:1734, M15:1741, M15:1746, M15:1751, M15:1757): Filtros: Rango por fecha contable o de registro, Tipo, Origen, Módulo, Estado, Cuenta; Columnas: Número, Fecha, Tipo, Descripción, Origen, Debe, Haber, Estado; Campos: Rango, Ejercicio, Módulos, Detalle diario o por operación, Composición de stock, Fecha de emisión en ventas, Filtro de tipos de factura, Método de valuación de stock; Acciones: Nuevo, Abrir, Duplicar, Anular/revertir, Imprimir, Guardar borrador, Enviar a aprobación, Contabilizar, Aprobar/rechazar, Anular.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-CON-12 | Diario (asientos) | PT-01 | `/admin/con/asientos` | Usa PT-01 Listado con filtros. Filtros: rango por fecha contable o de registro, tipo, origen, módulo, estado, cuenta, centro, usuario, importe… |
| PAN-CON-13 | Asiento (alta, edición y detalle) | PT-03 | `/admin/con/asientos/:id` | Usa PT-03 Formulario o editor. / con.asientos.editar / con.asientos.contabilizar / con.asientos.aprobar. detalle de automáticos: solo lectura, ruta… |
| PAN-CON-14 | Plantillas de asiento | PT-09 | `/admin/con/plantillas` | Usa PT-09 Configuración versionada. Columnas: código, nombre, uso, recurrencia, reversión automática, estado |
| PAN-CON-15 | Importación de asientos | PT-04 | `/admin/con/asientos/importar` | ExcelImportWizard: plantilla descargable (con centros, sin centros, asiento único), mapeo de columnas, validación… |
| PAN-CON-16 | Bandeja de eventos contables | PT-06 | `/admin/con/eventos` | Usa PT-06 Bandeja de trabajo. Filtros: estado, módulo, tipo de evento, rango, causa del faltante; Columnas: fecha contable, módulo, tipo, documento… |
| PAN-CON-17 | Lote de contabilización ("Cierre automático") | PT-04 | `/admin/con/lotes` | Campos: rango, ejercicio, módulos, detalle diario o por operación, composición de stock, fecha de emisión en ventas… |
| PAN-CON-18 | Anulación masiva | PT-04 | `/admin/con/asientos/anulacion-masiva` | Filtros (rango, origen, lote, módulo, tipo); grilla con selección; validación por asiento (apertura/cierre excluidos… |
| PAN-CON-19 | Renumeración de asientos | PT-09 | `/admin/con/asientos/renumerar` | Usa PT-09 Configuración versionada. Pasos: vista previa (número actual, nuevo) |

### FAM-CON-05 Reportes y libros contables

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-CON-20 Mayor (M15:1773) |
| Portales | admin |
| Rutas | `/admin/con/reportes/mayor`, `/admin/con/reportes/sumas-saldos`, `/admin/con/reportes`, `/admin/con/libros` y 2 más |
| Capabilities | `con.reportes.ver`, `con.libros.ver` |
| Olas | O5 a O8 |

```text
+----------------------------------------------------------------------------+
| Inicio > CON > Mayor                           [Abrir] [Exportar] [Nuevo*] |
| Mayor                                                            (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Plan ▼] [Cuenta o rango de… ▼] [Rama ▼] [Período ▼]   |
| [Más filtros]                                                              |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Fecha     Asiento   Descripci Documento Debe      Haber     [...]      |
| ---------------------------------------------------------------------      |
| [ ] dd-mm-yyy ·······   ·······   ·······   $ 0.000,0 $ 0.000,0  ...       |
| [ ] dd-mm-yyy ·······   ·······   ·······   $ 0.000,0 $ 0.000,0  ...       |
| [ ] dd-mm-yyy ·······   ·······   ·······   $ 0.000,0 $ 0.000,0  ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Abrir] [Exportar]               25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M15:1773, M15:1778, M15:1783, M15:1788, M15:1808, M15:1868): Filtros: Plan, Cuenta o rango de cuentas, Rama, Período, Fecha contable o de registro, Centro; Columnas: Fecha, Asiento, Descripción, Documento, Debe, Haber, Saldo acumulado, Saldo anterior al inicio; Pasos: Clic en renglón, Asiento y documento. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-CON-20 | Mayor | PT-01 | `/admin/con/reportes/mayor` | Filtros: plan, cuenta o rango de cuentas, rama, período, fecha contable o de registro, centro, servicio, estado… |
| PAN-CON-21 | Sumas y saldos | PT-01 | `/admin/con/reportes/sumas-saldos` | Filtros: plan, ejercicio, rango, nivel, con/sin movimientos, centro, servicio, incluir asientos de cierre; Columnas… |
| PAN-CON-22 | Catálogo de informes contables | PT-05 | `/admin/con/reportes` | Usa PT-05 Tablero, reporte o mapa. Tarjetas por informe (§15) con parámetros en modal md y salida PDF/XLSX/CSV; informes regulatorios exportables (OCEBA… |
| PAN-CON-23 | Libros rubricados | PT-05 | `/admin/con/libros` | Usa PT-05 Tablero, reporte o mapa. / con.libros.transcribir. Lista de libros (tipo, rúbrica, hojas desde/hasta, última usada, formato, estado) y… |
| PAN-CON-27 | Resultado por servicio y sección | PT-01 | `/admin/con/reportes/resultado-servicio` | Filtros: período, servicio, centro, corrida de distribución, plan; Columnas: servicio/centro, ingresos directos… |
| PAN-CON-39 | Anticipos y saldos a favor a una fecha | PT-01 | `/admin/con/reportes/anticipos` | Columnas: socio, cuenta, servicio, anticipo/saldo a favor, origen, antigüedad |

### FAM-CON-06 Centros de costo

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-CON-24 Centros de costo y grupos (M15:1793) |
| Portales | admin |
| Rutas | `/admin/con/centros`, `/admin/con/centros/asignaciones`, `/admin/con/distribuciones` |
| Capabilities | `con.centros.ver`, `con.centros.configurar`, `con.distribuciones.ver` |
| Olas | O5 |

```text
+----------------------------------------------------------------------------+
| Inicio > CON > Centros de costo y grupos       [Abrir] [Exportar] [Nuevo*] |
| Centros de costo y grupos                                        (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Tipo de operación ▼] [Tipo de elemento ▼]             |
| [Más filtros]                                                              |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Elemento             Modelo o reparto     Vigencia             [...]   |
| ------------------------------------------------------------------------   |
| [ ] ··········           ··········           dd-mm-yyyy            ...    |
| [ ] ··········           ··········           dd-mm-yyyy            ...    |
| [ ] ··········           ··········           dd-mm-yyyy            ...    |
+----------------------------------------------------------------------------+
| N seleccionadas: [Abrir] [Exportar]               25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M15:1793, M15:1798, M15:1803): Filtros: Tipo de operación, Tipo de elemento; Columnas: Elemento, Modelo o reparto, Vigencia. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-CON-24 | Centros de costo y grupos | PT-01 | `/admin/con/centros` | Pasos: `abm_CtSeccion` (`cmdCategorias`, grupos y categorías de sección) |
| PAN-CON-25 | Reglas de asignación a centros | PT-09 | `/admin/con/centros/asignaciones` | Usa PT-09 Configuración versionada. Filtros: tipo de operación, tipo de elemento; Columnas: elemento, modelo o reparto, vigencia |
| PAN-CON-26 | Modelos y corridas de distribución | PT-04 | `/admin/con/distribuciones` | Usa PT-04 Asistente por pasos o proceso masivo. / con.distribuciones.ejecutar. Modelos (porcentaje fijo o driver), corridas por período con totales… |

### FAM-CON-07 Conciliaciones y ajuste por inflación

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-CON-29 Índices de inflación (M15:1818) |
| Portales | admin |
| Rutas | `/admin/con/conciliaciones`, `/admin/con/inflacion/indices`, `/admin/con/inflacion/corridas` |
| Capabilities | `con.conciliaciones.ver`, `con.inflacion.ver`, `con.inflacion.ejecutar` |
| Olas | O8 |

```text
+----------------------------------------------------------------------------+
| Inicio > CON > Índices de inflación            [Abrir] [Exportar] [Nuevo*] |
| Índices de inflación                                             (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Más filtros]                                          |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] / con     Inflacion Editar    Series    Importaci Alerta de [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Abrir] [Exportar]               25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M15:1813, M15:1818, M15:1823): Columnas: / con, Inflacion, Editar, Series, Importación desde planilla, Alerta de meses faltantes; Campos: / con, Inflacion, Editar, Series, Importación desde planilla, Alerta de meses faltantes. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-CON-28 | Conciliaciones | PT-06 | `/admin/con/conciliaciones` | Usa PT-06 Bandeja de trabajo. / con.conciliaciones.ejecutar. Lista de corridas por tipo y fecha de corte; detalle: auxiliar vs contable por clave… |
| PAN-CON-29 | Índices de inflación | PT-01 | `/admin/con/inflacion/indices` | / con.inflacion.editar. Series (código, nombre, fuente) y grilla año × mes de valores; importación desde planilla… |
| PAN-CON-30 | Ajuste por inflación | PT-01 | `/admin/con/inflacion/corridas` | Parámetros (ejercicio, hasta, serie, método); vista previa por cuenta y mes de origen (histórico, coeficiente… |

### FAM-CON-08 Presupuesto, simulación y estados contables

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-CON-34 Presupuestos (M15:1843) |
| Portales | admin |
| Rutas | `/admin/con/simulaciones`, `/admin/con/presupuestos`, `/admin/con/presupuestos/:id/ejecucion`, `/admin/con/estados` |
| Capabilities | `con.simulaciones.ver`, `con.presupuestos.ver`, `con.estados.generar` |
| Olas | O8 |

```text
+----------------------------------------------------------------------------+
| Inicio > CON > Presupuestos                    [Abrir] [Exportar] [Nuevo*] |
| Presupuestos                                                     (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Cuenta/centro/ser… ▼] [Presupuestado ▼] [Más filtros] |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Cuenta/ce Presupues Compromet Devengado Pagado    Disponibl [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   [Activo]  ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   [Pendient ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   [Activo]  ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Abrir] [Exportar]               25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M15:1838, M15:1843, M15:1848, M15:1853): Filtros: Cuenta/centro/servicio, Presupuestado; Columnas: Cuenta/centro/servicio, Presupuestado, Comprometido, Devengado, Pagado, Disponible, % ejecución. El anexo no detalla acciones de estas pantallas: el wireframe usa los genéricos del patrón y se completan en el diseño de cada pantalla.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-CON-33 | Escenarios de simulación | PT-04 | `/admin/con/simulaciones` | Usa PT-04 Asistente por pasos o proceso masivo. / con.simulaciones.crear / con.simulaciones.ejecutar. Lista (código, tipo, plan, universo, estado, comparable, último… |
| PAN-CON-34 | Presupuestos | PT-01 | `/admin/con/presupuestos` | / con.presupuestos.editar / con.presupuestos.aprobar. Lista de versiones por ejercicio; editor de líneas cuenta ×… |
| PAN-CON-35 | Ejecución presupuestaria y compromisos | PT-05 | `/admin/con/presupuestos/:id/ejecucion` | Usa PT-05 Tablero, reporte o mapa. Columnas: cuenta/centro/servicio, presupuestado, comprometido, devengado, pagado, disponible, % ejecución, detalle de… |
| PAN-CON-36 | Estados contables y plantillas | PT-09 | `/admin/con/estados` | Usa PT-09 Configuración versionada. / con.estados.aprobar / con.estados.emitir. Plantillas (marco INAES-RT, regulador, propia) con editor de líneas… |

## M16 SUE: Personal y sueldos

Anexo `docs/especificacion/anexos/M16-SUE-personal-sueldos.md`, §10. 8 familias, 47 PAN. Catálogo: [17-16-M16-SUE.md](17-catalogo-pantallas/17-16-M16-SUE.md).

### FAM-SUE-01 Tablero, empleados y empresas

| Dato | Valor |
|---|---|
| Patrón base | PT-02 Ficha o detalle con pestañas ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-SUE-03 Ficha del legajo (M16:2029) |
| Portales | admin |
| Rutas | `/admin/sue`, `/admin/sue/empleados`, `/admin/sue/empleados/:id`, `/admin/sue/empleados/nuevo` y 2 más |
| Capabilities | `sue.reportes.ver`, `sue.legajos.ver`, `sue.legajos.crear`, `sue.estructura.configurar` |
| Olas | O9 |

```text
+----------------------------------------------------------------------------+
| Inicio > SUE > Ficha del legajo                                  (?) Ayuda |
| Ficha del legajo  [Acti… [Editar] [Cambiar categoría] [Emitir constancia*] |
+----------------------------------------------------------------------------+
| Período actual por …: ········  Estado: ········         Liquidaciones pe… |
| Recibos sin firmar: ········  Licencias pendientes: ········  Documentos … |
+----------------------------------------------------------------------------+
| Datos personales | Laboral | Centros de costo | Familiares | Cuentas | Do… |
| ================                                                           |
| Legajo     Apellido   Nombre     CUIL       Empresa    Categoría  [...]    |
| -----------------------------------------------------------------------    |
| ········   ········   ········   ········   ········   ········    ...     |
| ········   ········   ········   ········   ········   ········    ...     |
+----------------------------------------------------------------------------+
| Línea de tiempo: dd-mm-yyyy  evento del registro  (usuario)     [Ver todo] |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M16:2027, M16:2028, M16:2029, M16:2030, M16:2031, M16:2064): Filtros: Empresa, Estado, Convenio, Categoría, Área, Centro de costo; Columnas: Legajo, Apellido, Nombre, CUIL, Empresa, Categoría, Área, Ingreso; Pestañas: Datos personales, Laboral, Centros de costo, Familiares, Cuentas, Documentación, Turnos; Campos: Período actual por empresa, Estado, Liquidaciones pendientes de aprobar, Recibos sin firmar, Licencias pendientes, Documentos vencidos, Fin de prueba, Certificados art; Pasos: Persona, Empresa y laboral, Seguridad social, Pago, Familiares, Alta registral, Resumen; Acciones: Editar, Cambiar categoría, Desvincular, Reincorporar, Emitir constancia, Ir a cada bandeja, Nuevo, Importar Excel, Exportar, Ver ficha.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-SUE-01 | Tablero de sueldos | PT-05 | `/admin/sue` | Usa PT-05 Tablero, reporte o mapa. Campos: período actual por empresa, estado, liquidaciones pendientes de aprobar, recibos sin firmar, licencias… |
| PAN-SUE-02 | Listado de empleados | PT-01 | `/admin/sue/empleados` | Usa PT-01 Listado con filtros. Filtros: empresa, estado, convenio, categoría, área, centro de costo, encargado, texto; Columnas: legajo, apellido… |
| PAN-SUE-03 | Ficha del legajo | PT-02 | `/admin/sue/empleados/:id` | Pestañas: Datos personales, Laboral, Centros de costo, Familiares, Cuentas, Documentación, Turnos, Situación de… |
| PAN-SUE-04 | Alta en asistente | PT-04 | `/admin/sue/empleados/nuevo` | Usa PT-04 Asistente por pasos o proceso masivo. Pasos: persona, empresa y laboral, seguridad social, pago, familiares, alta registral, resumen |
| PAN-SUE-05 | Empresas empleadoras | PT-02 | `/admin/sue/empresas` | Columnas: código, razón social, CUIT, tipo, ART, agente de retención, empleados activos |
| PAN-SUE-38 | Informes de sueldos | PT-05 | `/admin/sue/informes` | Usa PT-05 Tablero, reporte o mapa. Informes de sueldos. Catálogo del §15 con filtros comunes. Ejecutar, exportar, programar |

### FAM-SUE-02 Convenios, categorías, cargos, turnos y tablas oficiales

| Dato | Valor |
|---|---|
| Patrón base | PT-09 Configuración versionada ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-SUE-47 Tablas oficiales de sueldos y Ganancias (M16:2073) |
| Portales | admin, plataforma |
| Rutas | `/admin/sue/config/sindicatos-convenios`, `/admin/sue/config/categorias-escalas`, `/admin/sue/config/cargos-areas`, `/admin/sue/config/turnos` y 3 más |
| Capabilities | `sue.estructura.configurar`, `sue.reportes.ver`, `pla.tablasSueldos.editar` |
| Olas | O1 a O9 |

```text
+----------------------------------------------------------------------------+
| Tablas oficiales de sueldos y Ganancias                          (?) Ayuda |
| Versión [v3 · Vigente ▼]  [Borrador]  Vigencia desde [dd-mm-yyyy]          |
| [Comparar versiones] [Historial] [Duplicar]               [Nueva versión*] |
+----------------------------------------------------------------------------+
| +-- Secciones ---------+ +-- Edición ------------------------------------+ |
| | > Sindicatos y conv… | | Versiones [______________]                    | |
| | > Categorías, escal… | | Fuente [______________]                       | |
| | > Cargos y áreas     | | Vigencia [______________]                     | |
| | > Turnos y jornadas  | | Versión [______________]                      | |
| | > Obras sociales ad… | | Filas [______________]                        | |
| +----------------------+ +-----------------------------------------------+ |
| ApprovalBar: el cambio queda en borrador hasta su aprobación (doble contr… |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M16:2032, M16:2033, M16:2034, M16:2035, M16:2036, M16:2037): Columnas: Versiones, Fuente, Vigencia, Versión, Filas; Pestañas: Sindicatos y convenios, Categorías, escalas y antigüedad, Cargos y áreas, Turnos y jornadas, Obras sociales adoptadas y motivos de egreso; Acciones: Nueva versión, Importar desde ARCA, Publicar, Nuevo, Editar, Registrar validación, Retirar, Nueva escala, Comparar escalas, Enviar a aprobación.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-SUE-06 | Sindicatos y convenios | PT-02 | `/admin/sue/config/sindicatos-convenios` | Usa PT-02 Ficha o detalle con pestañas. Sindicatos y convenios. Dos pestañas con DataTable; convenio con validación y guardias. Nuevo, editar, registrar… |
| PAN-SUE-07 | Categorías, escalas y antigüedad | PT-01 | `/admin/sue/config/categorias-escalas` | Usa PT-01 Listado con filtros. Categorías, escalas y antigüedad. Selector de convenio; grilla de categorías; línea de tiempo de escalas (borrador… |
| PAN-SUE-08 | Cargos y áreas | PT-01 | `/admin/sue/config/cargos-areas` | Usa PT-01 Listado con filtros. Cargos y áreas. Áreas con centro de costo y servicios. ABM |
| PAN-SUE-09 | Turnos y jornadas | PT-03 | `/admin/sue/config/turnos` | Usa PT-03 Formulario o editor. Turnos y jornadas. Turnos con horarios por día (editor semanal). ABM, asignación masiva |
| PAN-SUE-10 | Obras sociales adoptadas y motivos de egreso | PT-09 | `/admin/sue/config/obras-sociales` | Obras sociales adoptadas y motivos de egreso. Dos pestañas. ABM con selector de código oficial |
| PAN-SUE-11 | Consulta de tablas oficiales adoptadas | PT-09 | `/admin/sue/config/tablas-oficiales` | Columnas: versión, fuente, vigencia, filas |
| PAN-SUE-47 | Tablas oficiales de sueldos y Ganancias | PT-09 | `/admin/plataforma/tablas-sueldos` | Columnas: versiones, fuente, vigencia |

### FAM-SUE-03 Conceptos, variables y versiones

| Dato | Valor |
|---|---|
| Patrón base | PT-09 Configuración versionada ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-SUE-13 Conceptos y editor de fórmulas (M16:2039) |
| Portales | admin |
| Rutas | `/admin/sue/config/variables`, `/admin/sue/config/conceptos`, `/admin/sue/config/tipos-liquidacion`, `/admin/sue/config/versiones` y 2 más |
| Capabilities | `sue.variables.configurar`, `sue.conceptos.configurar`, `sue.tiposLiquidacion.configurar`, `sue.configuracion.publicar` y 2 más |
| Olas | O9 |

```text
+----------------------------------------------------------------------------+
| Conceptos y editor de fórmulas                                   (?) Ayuda |
| Versión [v3 · Vigente ▼]  [Borrador]  Vigencia desde [dd-mm-yyyy]          |
| [Comparar versiones] [Historial] [Duplicar]                       [Nuevo*] |
+----------------------------------------------------------------------------+
| +-- Secciones ---------+ +-- Edición ------------------------------------+ |
| | > Variables          | | Nombre [______________]                       | |
| | > Tipos de liquidac… | | Tipo [______________]                         | |
| | > Versiones de conf… | | Fórmula [______________]                      | |
| | > Aplicar aumentos   | | Usado en [______________]                     | |
| | > Reglas de imputac… | |                                               | |
| +----------------------+ +-----------------------------------------------+ |
| ApprovalBar: el cambio queda en borrador hasta su aprobación (doble contr… |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M16:2038, M16:2039, M16:2040, M16:2041, M16:2042, M16:2058): Filtros: Tipo, Activo, Tipo de liquidación, Clasificación; Columnas: Nombre, Tipo, Fórmula, Usado en; Pestañas: Variables, Tipos de liquidación, Versiones de configuración, Aplicar aumentos, Reglas de imputación contable; Acciones: Nuevo, Duplicar, Validar, Probar, Nueva, Editar con editor de fórmulas, Renombrar, ABM, Crear borrador, Simular.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-SUE-12 | Variables | PT-03 | `/admin/sue/config/variables` | Usa PT-03 Formulario o editor. Columnas: nombre, tipo, fórmula, usado en |
| PAN-SUE-13 | Conceptos y editor de fórmulas | PT-09 | `/admin/sue/config/conceptos` | Filtros: tipo, activo, tipo de liquidación, clasificación |
| PAN-SUE-14 | Tipos de liquidación | PT-04 | `/admin/sue/config/tipos-liquidacion` | Usa PT-04 Asistente por pasos o proceso masivo. Tipos de liquidación. Columnas del §7.23. ABM |
| PAN-SUE-15 | Versiones de configuración | PT-09 | `/admin/sue/config/versiones` | Versiones de configuración. Lista de versiones; detalle con cambios, validación, diferencias de simulación. Crear… |
| PAN-SUE-16 | Aplicar aumentos | PT-03 | `/admin/sue/config/aumentos` | Usa PT-03 Formulario o editor. Aplicar aumentos. Formulario de objetivo y valor; previsualización. Previsualizar, generar escala |
| PAN-SUE-32 | Reglas de imputación contable | PT-09 | `/admin/sue/config/contabilidad` | Reglas de imputación contable. Reglas con prioridad y filtros; validación de cuentas sin asignar. ABM, simular asiento… |

### FAM-SUE-04 Novedades y licencias

| Dato | Valor |
|---|---|
| Patrón base | PT-06 Bandeja de trabajo ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-SUE-21 Tareas extra (M16:2047) |
| Portales | admin |
| Rutas | `/admin/sue/config/tipos-novedad`, `/admin/sue/novedades`, `/admin/sue/novedades/importar`, `/admin/sue/fichadas` y 2 más |
| Capabilities | `sue.tiposNovedad.configurar`, `sue.novedades.ver`, `sue.novedades.importar`, `sue.novedades.crear` y 1 más |
| Olas | O9 |

```text
+----------------------------------------------------------------------------+
| Bandeja: Tareas extra                                             [Nueva*] |
| [Mías N] [Equipo N] [Vencidas N] [Sin asignar N]   [Tipo ▼] [Período ▼]    |
+----------------------------------------------------------------------------+
| +-- Lista ---------------------+ +-- Detalle ----------------------------+ |
| | [SLA 2 h] Tipo · Cuenta · P… | | Tipo: ········                        | |
| | [SLA 2 h] Tipo · Cuenta · P… | | Cuenta: ········                      | |
| | [SLA 2 h] Tipo · Cuenta · P… | | Período: ········                     | |
| | ...                          | | Ejecutor: ········                    | |
| |                              | | Cantidad: ········                    | |
| |                              | | Línea de tiempo y comentarios         | |
| |                              | | [Importar desde M0…]                  | |
| +------------------------------+ +---------------------------------------+ |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M16:2043, M16:2044, M16:2045, M16:2046, M16:2047, M16:2048): Filtros: Tipo, Período; Columnas: Tipo, Cuenta, Período, Ejecutor, Cantidad, Unitario, Total; Pestañas: Pendientes, Autorizadas, Calendario, Saldos de vacaciones; Acciones: Nueva, Importar desde M03/M08/M10, ABM, Agregar, Aprobar seleccionadas, Anular, Ver origen, Generar propuestas, Confirmar, Cargar manual.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-SUE-17 | Tipos de novedad y causas de licencia | PT-09 | `/admin/sue/config/tipos-novedad` | Usa PT-09 Configuración versionada. Tipos de novedad y causas de licencia. Dos pestañas. ABM |
| PAN-SUE-18 | Novedades del período | PT-01 | `/admin/sue/novedades` | Usa PT-01 Listado con filtros. Novedades del período. Selector empresa y período; grilla editable masiva (empleado × tipo); filtros por origen y… |
| PAN-SUE-19 | Importación de novedades | PT-04 | `/admin/sue/novedades/importar` | Usa PT-04 Asistente por pasos o proceso masivo. Importación de novedades. ExcelImportWizard para Excel y anticipos; pestañas «Desde órdenes de trabajo», «Desde… |
| PAN-SUE-20 | Fichadas y horarios | PT-02 | `/admin/sue/fichadas` | Usa PT-02 Ficha o detalle con pestañas. Fichadas y horarios. Por empleado y día: turno, fichadas, horas, diferencias. Cargar manual, procesar día, importar |
| PAN-SUE-21 | Tareas extra | PT-06 | `/admin/sue/tareas-extra` | Columnas: tipo, cuenta, período, ejecutor, cantidad, unitario, total |
| PAN-SUE-22 | Bandeja y calendario de licencias | PT-06 | `/admin/sue/licencias` | Pestañas: Pendientes, Autorizadas, Calendario, Saldos de vacaciones |

### FAM-SUE-05 Liquidación de sueldos

| Dato | Valor |
|---|---|
| Patrón base | PT-04 Asistente por pasos o proceso masivo ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-SUE-24 Liquidaciones (M16:2050) |
| Portales | admin |
| Rutas | `/admin/sue/periodos`, `/admin/sue/liquidaciones`, `/admin/sue/liquidaciones/:id`, `/admin/sue/simulador` y 3 más |
| Capabilities | `sue.liquidaciones.cerrar`, `sue.liquidaciones.ver`, `sue.liquidaciones.simular`, `sue.recibos.ver` y 1 más |
| Olas | O9 |

```text
+----------------------------------------------------------------------------+
| Liquidaciones                                                   [Cancelar] |
+----------------------------------------------------------------------------+
| (1) Datos ── (2) Validación ── (3) Confirmación                            |
|                                                                            |
| Paso 2 de 3: Validación                                                    |
|                                                                            |
| Proceso en segundo plano (JobProgress): [##########..........] 50 %        |
| Resultado: N procesados · N con error [Descargar errores]                  |
+----------------------------------------------------------------------------+
| [Anterior]                         [Guardar borrador] [Nueva liquidación*] |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M16:2049, M16:2050, M16:2051, M16:2052, M16:2053, M16:2065): Filtros: Empresa, Período, Tipo, Estado; Columnas: Número, Tipo, Período, Empleados, Neto, Estado, Calculó, Aprobó; Pestañas: Recibos, Controles, Comparativo con período anterior, Vista previa de asiento, Pagos, Presentaciones, Historial; Acciones: Nueva liquidación, Simular, Cerrar, Reabrir, Calcular, Recalcular empleado, Enviar a aprobación, Aprobar, Anular, Solicitar pago.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-SUE-23 | Períodos de sueldos | PT-01 | `/admin/sue/periodos` | Usa PT-01 Listado con filtros. Períodos de sueldos. Por empresa: períodos y estados. Cerrar, reabrir (con aprobación) |
| PAN-SUE-24 | Liquidaciones | PT-04 | `/admin/sue/liquidaciones` | Filtros: empresa, período, tipo, estado; Columnas: número, tipo, período, empleados, neto, estado, calculó, aprobó |
| PAN-SUE-25 | Detalle de liquidación | PT-04 | `/admin/sue/liquidaciones/:id` | Pestañas: Recibos, Controles, Comparativo con período anterior, Vista previa de asiento, Pagos, Presentaciones… |
| PAN-SUE-26 | Simulador | PT-04 | `/admin/sue/simulador` | Simulador. Selección de empleados, tipo, período, versión de configuración, novedades hipotéticas. Simular, comparar… |
| PAN-SUE-27 | Recibo de sueldo | PT-02 | `/admin/sue/recibos/:id` | Usa PT-02 Ficha o detalle con pestañas. Recibo. Vista del recibo con traza por renglón (modal), estado de firma y entrega, pagos, Ganancias del mes. Descargar… |
| PAN-SUE-39 | Liquidación externa | PT-04 | `/admin/sue/importacion-externa` | Liquidación externa (CU-28). Lotes con estado; asistente de carga y validación; layouts. Importar, aprobar, anular |
| PAN-SUE-40 | Paralelo ProCoop | PT-01 | `/admin/sue/paralelo` | Usa PT-01 Listado con filtros. Paralelo ProCoop. Comparativo por empleado y concepto. Cargar archivo legado, comparar |

### FAM-SUE-06 Egresos, Ganancias, presentaciones y pagos

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-SUE-30 Presentaciones (M16:2056) |
| Portales | admin |
| Rutas | `/admin/sue/egresos`, `/admin/sue/ganancias`, `/admin/sue/presentaciones`, `/admin/sue/pagos` |
| Capabilities | `sue.egresos.crear`, `sue.ganancias.ver`, `sue.presentaciones.generar`, `sue.pagos.ver` |
| Olas | O9 |

```text
+----------------------------------------------------------------------------+
| Inicio > SUE > Presentaciones             [Aprobar] [Descargar] [Generar*] |
| Presentaciones                                                   (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Período ▼] [Más filtros]                              |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Por empre Período   LSD       SICOSS    SICORE    Egresos   [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Aprobar] [Descargar] [Cargar a… 25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M16:2054, M16:2055, M16:2056, M16:2057): Filtros: Período; Columnas: Por empresa, Período, LSD, SICOSS, SICORE, Egresos; Pestañas: Calculadora por empleado, F.572 importados, Liquidación anual/final, Diferencias mes a mes; Campos: Por empresa, Período, LSD, SICOSS, SICORE, Egresos, Liquidación final, Lista; Acciones: Generar, Aprobar, Descargar, Cargar acuse, Rectificar, Simular final, Enviar a aprobación, Emitir certificados, Importar SIRADIG, Recalcular.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-SUE-28 | Egresos y liquidación final | PT-04 | `/admin/sue/egresos` | Usa PT-04 Asistente por pasos o proceso masivo. Egresos y liquidación final. Lista; asistente: motivo, fechas, preaviso, cálculo, lista de tareas. Simular final… |
| PAN-SUE-29 | Ganancias | PT-02 | `/admin/sue/ganancias` | Usa PT-02 Ficha o detalle con pestañas. Pestañas: Calculadora por empleado, F.572 importados, Liquidación anual/final, Diferencias mes a mes |
| PAN-SUE-30 | Presentaciones | PT-01 | `/admin/sue/presentaciones` | Presentaciones. Por empresa y período: LSD, SICOSS, SICORE, F.1357/F.1359, sindicatos, ART; estado y controles… |
| PAN-SUE-31 | Pago de haberes | PT-03 | `/admin/sue/pagos` | Usa PT-03 Formulario o editor. Pago de haberes. Solicitudes con estado e ítems; rechazados. Nueva solicitud, reintentar rechazados, anular |

### FAM-SUE-07 Recursos humanos

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-SUE-36 Accidentes y ART (M16:2062) |
| Portales | admin |
| Rutas | `/admin/sue/certificados`, `/admin/sue/rrhh/evaluaciones`, `/admin/sue/rrhh/disciplina`, `/admin/sue/rrhh/accidentes` y 1 más |
| Capabilities | `sue.certificados.emitir`, `sue.rrhh.evaluaciones.ver`, `sue.rrhh.sanciones.ver`, `sue.rrhh.accidentes.ver` y 1 más |
| Olas | O9 |

```text
+----------------------------------------------------------------------------+
| Inicio > SUE > Acc… [Denunciar] [Vincular licencia] [Registrar reintegro*] |
| Accidentes y ART                                                 (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Fecha ▼] [Tipo ▼] [Estado ▼] [Más filtros]            |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Empleado  Fecha     Tipo      Siniestro Días ILT  Estado    [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   dd-mm-yyy ·······   ·······   ·······   [Activo]   ...       |
| [ ] ·······   dd-mm-yyy ·······   ·······   ·······   [Pendient  ...       |
| [ ] ·······   dd-mm-yyy ·······   ·······   ·······   [Activo]   ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Denunciar] [Vincular licencia]… 25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M16:2059, M16:2060, M16:2061, M16:2062, M16:2063): Filtros: Fecha, Tipo, Estado; Columnas: Empleado, Fecha, Tipo, Siniestro ART, Días ILT, Estado, Expediente, Actor; Acciones: Denunciar, Vincular licencia, Registrar reintegro, Alta, Emitir, Entregar, Crear ciclo, Cerrar, Calibrar, Nueva sanción.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-SUE-33 | Certificados y constancias | PT-01 | `/admin/sue/certificados` | Certificados y constancias. Pendientes con vencimiento; emitidos. Emitir, entregar |
| PAN-SUE-34 | Evaluaciones y objetivos | PT-01 | `/admin/sue/rrhh/evaluaciones` | Evaluaciones y objetivos. Plantillas, ciclos, avance, resultados. Crear ciclo, cerrar, calibrar |
| PAN-SUE-35 | Sanciones y sumarios | PT-02 | `/admin/sue/rrhh/disciplina` | Usa PT-02 Ficha o detalle con pestañas. Sanciones y sumarios. Dos pestañas. Nueva sanción, notificar, abrir sumario, resolver |
| PAN-SUE-36 | Accidentes y ART | PT-01 | `/admin/sue/rrhh/accidentes` | Columnas: empleado, fecha, tipo, siniestro ART, días ILT, estado |
| PAN-SUE-37 | Juicios laborales | PT-01 | `/admin/sue/rrhh/juicios` | Columnas: expediente, actor, monto reclamado, provisión, estado |

### FAM-SUE-08 Portal del empleado

| Dato | Valor |
|---|---|
| Patrón base | PT-07 Portal del socio y del empleado (PWA) ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-SUE-41 Mis recibos de sueldo (M16:2067) |
| Portales | empleado |
| Rutas | `/app/empleado/recibos`, `/app/empleado/licencias`, `/app/empleado/datos`, `/app/empleado/equipo` y 2 más |
| Capabilities | `sue.portal.recibos.ver`, `sue.portal.licencias.solicitar`, `sue.portal.datos.ver`, `sue.equipo.ver` y 2 más |
| Olas | O9 |

```text
+------------------------------------------------------------+
| < Mis recibos de sueldo                                (o) |
| Cuenta [Cuenta 0001 ▼]                                     |
+------------------------------------------------------------+
| +--------------------------------------------------------+ |
| | Mis recibos: ········                                  | |
| | Cards por período: ········                            | |
| | Firmar/conformidad: ········                           | |
| | Disconformidad con nota: ········                      | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| +--------------------------------------------------------+ |
| | Mis recibos: ········                                  | |
| | Cards por período: ········                            | |
| | Firmar/conformidad: ········                           | |
| | Disconformidad con nota: ········                      | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| [                       Ver PDF                       * ]  |
+------------------------------------------------------------+
| Inicio | Recibos | (+) | Solicitudes | Perfil              |
+------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M16:2067, M16:2068, M16:2069, M16:2070, M16:2071, M16:2072): Campos: Mis recibos, Cards por período, Firmar/conformidad, Disconformidad con nota, 3 skeleton cards, «Aún no tenés recibos»; Acciones: Ver PDF, Firmar/conformidad, Disconformidad con nota, FAB «+» abre modal de solicitud, Proponer cambio, Subir documento, Aprobar, Rechazar, Pedir constancia, Descargar.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-SUE-41 | Mis recibos de sueldo | PT-07 | `/app/empleado/recibos` | Mis recibos. Cards por período (neto, estado de firma). Ver PDF, firmar/conformidad (OTP), disconformidad con nota. 3… |
| PAN-SUE-42 | Vacaciones y licencias | PT-07 | `/app/empleado/licencias` | Vacaciones y licencias. Saldo por año; solicitudes con estado. FAB «+» abre modal de solicitud (causa, fechas, adjuntos) |
| PAN-SUE-43 | Mis datos y documentos | PT-07 | `/app/empleado/datos` | Mis datos y documentos. Datos laborales (lectura), familiares, cuentas, documentos. Proponer cambio, subir documento |
| PAN-SUE-44 | Mi equipo | PT-07 | `/app/empleado/equipo` | Mi equipo (encargado). Operarios, licencias y novedades pendientes, calendario. Aprobar, rechazar |
| PAN-SUE-45 | Mis certificados y constancias | PT-07 | `/app/empleado/certificados` | Mis certificados y constancias. Lista. Pedir constancia, descargar |
| PAN-SUE-46 | Mis evaluaciones y objetivos | PT-07 | `/app/empleado/evaluaciones` | Mis evaluaciones y objetivos. Ciclos abiertos, objetivos. Autoevaluar, registrar avance |

## M17 INS: Institucional

Anexo `docs/especificacion/anexos/M17-INS-institucional.md`, §10. 6 familias, 33 PAN. Catálogo: [17-17-M17-INS.md](17-catalogo-pantallas/17-17-M17-INS.md).

### FAM-INS-01 Padrón y ficha del asociado

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-INS-01 Listado de asociados (M17:1305) |
| Portales | admin |
| Rutas | `/admin/ins/asociados`, `/admin/ins/asociados/:id`, `/admin/ins/libro`, `/admin/ins/credenciales` |
| Capabilities | `ins.asociados.ver`, `ins.libro.emitir`, `ins.credenciales.emitir` |
| Olas | O10 |

```text
+----------------------------------------------------------------------------+
| Inicio > INS > Listado d… [Exportar] [Credenciales masi…] [Nuevo ingreso*] |
| Listado de asociados                                             (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Estado ▼] [Número ▼] [Nombre/CUIT ▼] [Distrito ▼]     |
| [Más filtros]                                                              |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Número    Nombre    Documento Estado    Alta      Antigüeda [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   [Activo]  ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   [Pendient ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   [Activo]  ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Exportar] [Credenciales masi…]… 25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M17:1305, M17:1306, M17:1309, M17:1331): Filtros: Estado, Número, Nombre/CUIT, Distrito, Categoría INAES, Fecha de alta desde/hasta; Columnas: Número, Nombre, Documento enmascarado, Estado, Alta, Antigüedad, Distrito, Capital integrado; Pestañas: Datos institucionales, Historia de estados, Capital, Órganos, Mandatos, Asambleas, Asistencias; Campos: Número, Estado, Antigüedad, Categoría, Distrito; Acciones: Nuevo ingreso, Exportar, Credenciales masivas, Abrir ficha, Cambiar estado, Asignar distrito, Emitir credencial, Iniciar egreso, Iniciar rescate, Transferir capital.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-INS-01 | Listado de asociados | PT-01 | `/admin/ins/asociados` | Filtros: estado, número, nombre/CUIT, distrito, categoría INAES, fecha de alta desde/hasta, con deuda de capital, con… |
| PAN-INS-02 | Ficha institucional del asociado | PT-02 | `/admin/ins/asociados/:id` | Usa PT-02 Ficha o detalle con pestañas. Pestañas: Datos institucionales, Historia de estados, Capital, Órganos, mandatos, Asambleas, asistencias, Documentos… |
| PAN-INS-05 | Libro de Registro de Asociados | PT-05 | `/admin/ins/libro` | Usa PT-05 Tablero, reporte o mapa. Libro de Registro de Asociados. Selector de período y fecha de corte, opción capital anterior. Historial de ediciones… |
| PAN-INS-27 | Credenciales | PT-01 | `/admin/ins/credenciales` | Credenciales. Selección por padrón o filtro, plantilla. Emitir masivo, revocar |

### FAM-INS-02 Ingresos y egresos de asociados

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-INS-04 Trámites de egreso y exclusión (M17:1308) |
| Portales | admin |
| Rutas | `/admin/ins/solicitudes`, `/admin/ins/egresos` |
| Capabilities | `ins.asociados.aprobar`, `ins.asociados.egresar` |
| Olas | O10 |

```text
+----------------------------------------------------------------------------+
| Inicio > IN… [Notificar exclusi…] [Registrar apelaci…] [Registrar egreso*] |
| Trámites de egreso y exclusión                                   (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Estado ▼] [Canal ▼] [Fecha ▼] [Más filtros]           |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Asociado  Causa     Fecha     Servicios Capital i Rescate   [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   dd-mm-yyy ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   dd-mm-yyy ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   dd-mm-yyy ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Notificar exclusi…] [Registrar… 25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M17:1307, M17:1308): Filtros: Estado, Canal, Fecha; Columnas: Asociado, Causa, Fecha, Servicios activos, Capital integrado, Rescate, Estado del trámite, Solicitante; Acciones: Registrar egreso, Notificar exclusión, Registrar apelación, Imprimir solicitud, Validar, Pasar a consejo, Aprobar con acta, Rechazar con motivo.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-INS-03 | Bandeja de solicitudes de ingreso | PT-06 | `/admin/ins/solicitudes` | Usa PT-06 Bandeja de trabajo. Filtros: estado, canal, fecha; Columnas: solicitante, fecha, canal, documentación completa, suscripción propuesta… |
| PAN-INS-04 | Trámites de egreso y exclusión | PT-01 | `/admin/ins/egresos` | Columnas: asociado, causa, fecha, servicios activos, capital integrado, rescate, estado del trámite |

### FAM-INS-03 Capital, excedentes y honorarios

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-INS-07 Movimientos de capital (M17:1311) |
| Portales | admin |
| Rutas | `/admin/ins/config/capital`, `/admin/ins/capital/movimientos`, `/admin/ins/asociados/:id/capital`, `/admin/ins/capital/reservas` y 6 más |
| Capabilities | `ins.config.configurar`, `ins.capital.ver`, `ins.reservas.gestionar`, `ins.transferencias.crear` y 5 más |
| Olas | O10 |

```text
+----------------------------------------------------------------------------+
| Inicio > INS > Movimientos de … [Movimiento manual] [Revertir] [Importar*] |
| Movimientos de capital                                           (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Asociado ▼] [Rubro ▼] [Tipo ▼] [Origen ▼]             |
| [Más filtros]                                                              |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Fecha     Asociado  Tipo      Origen    Importe   Estado    [...]      |
| ---------------------------------------------------------------------      |
| [ ] dd-mm-yyy ·······   ·······   ·······   $ 0.000,0 [Activo]   ...       |
| [ ] dd-mm-yyy ·······   ·······   ·······   $ 0.000,0 [Pendient  ...       |
| [ ] dd-mm-yyy ·······   ·······   ·······   $ 0.000,0 [Activo]   ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Movimiento manual] [Revertir] … 25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M17:1310, M17:1311, M17:1312, M17:1313, M17:1314, M17:1315): Filtros: Asociado, Rubro, Tipo, Origen, Fecha, Estado contable; Columnas: Fecha, Asociado, Tipo, Origen, Importe, Estado, Asiento, Destino; Campos: Rubros, Reglas, Valor nominal versionado, Cierres, Revisión, Conciliación con M15, Ejercicio, Resultado, Apropiaciones; Acciones: Movimiento manual, Revertir, Reintentar contabilización, Importar, Alta/edición/inactivación, Versionar, PDF, Enviar por T09, Reservar, Recuperar.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-INS-06 | Rubros, reglas de suscripción y valor de cuota social | PT-09 | `/admin/ins/config/capital` | Usa PT-09 Configuración versionada. Campos: rubros, reglas, valor nominal versionado |
| PAN-INS-07 | Movimientos de capital | PT-01 | `/admin/ins/capital/movimientos` | Filtros: asociado, rubro, tipo, origen, fecha, estado contable; Columnas: fecha, asociado, tipo, origen, importe… |
| PAN-INS-08 | Estado de cuenta de capital | PT-01 | `/admin/ins/asociados/:id/capital` | Estado de cuenta de capital. Resumen por tipo (suscripto, facturado, comprometido, integrado, reservado, reembolsado… |
| PAN-INS-09 | Reservas y recuperos | PT-01 | `/admin/ins/capital/reservas` | Columnas: asociado, importe, destino, comprobante, estado |
| PAN-INS-10 | Transferencias de capital entre asociados | PT-04 | `/admin/ins/capital/transferencias` | Usa PT-04 Asistente por pasos o proceso masivo. Columnas: cedente, cesionario, cuotas, importe, servicios, estado |
| PAN-INS-11 | Rescates/reembolsos | PT-01 | `/admin/ins/capital/rescates` | Filtros: estado, ejercicio; Columnas: número, asociado, motivo, integrado, compensaciones, a reembolsar, posición en… |
| PAN-INS-12 | Cierres, revisión y conciliación | PT-06 | `/admin/ins/capital/cierres` | Usa PT-06 Bandeja de trabajo. Campos: cierres, revisión, conciliación con M15 |
| PAN-INS-13 | Importación de capital | PT-04 | `/admin/ins/capital/importar` | Usa PT-04 Asistente por pasos o proceso masivo. Importación de capital (ExcelImportWizard de T07). Pasos: plantilla, carga, mapeo, validación, simulación… |
| PAN-INS-14 | Distribución de excedentes | PT-02 | `/admin/ins/excedentes` | Usa PT-02 Ficha o detalle con pestañas. Columnas: base, retorno, interés, forma; Campos: ejercicio, resultado, apropiaciones |
| PAN-INS-25 | Honorarios institucionales | PT-01 | `/admin/ins/honorarios` | Honorarios institucionales. Definiciones vigentes (resolución, cargos, importe); liquidaciones por período. Liquidar… |

### FAM-INS-04 Órganos, reuniones, INAES y configuración

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-INS-24 Seguimiento de resoluciones (M17:1328) |
| Portales | admin |
| Rutas | `/admin/ins/organos`, `/admin/ins/reuniones`, `/admin/ins/reuniones/:id`, `/admin/ins/resoluciones` y 2 más |
| Capabilities | `ins.organos.gestionar`, `ins.reuniones.ver`, `ins.inaes.exportar`, `ins.config.configurar` |
| Olas | O10 |

```text
+----------------------------------------------------------------------------+
| Inicio > INS > Seguimiento de resoluciones   [Reasignar] [Cambiar estado*] |
| Seguimiento de resoluciones                                      (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Tipo ▼] [Estado ▼] [Órgano ▼] [Fecha ▼] [Más filtros] |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Número    Reunión   Categoría Responsab Vencimien Estado    [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   dd-mm-yyy [Activo]   ...       |
| [ ] ·······   ·······   ·······   ·······   dd-mm-yyy [Pendient  ...       |
| [ ] ·······   ·······   ·······   ·······   dd-mm-yyy [Activo]   ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Reasignar]                      25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M17:1319, M17:1320, M17:1321, M17:1328, M17:1330, M17:1332): Filtros: Tipo, Estado, Órgano, Fecha; Columnas: Número, Reunión, Categoría, Responsable, Vencimiento, Estado; Pestañas: Datos, Orden del día, Participantes, Asistencia, Permisos, Resoluciones, Acta; Acciones: Cambiar estado, Reasignar, Alta de mandato, Finalizar, Reemplazar por suplente, Imprimir nómina de autoridades, Nueva reunión, Duplicar, Cancelar, Agregar tema desde CRM/mesa/lote.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-INS-15 | Órganos, cargos y mandatos | PT-01 | `/admin/ins/organos` | Órganos, cargos y mandatos. Por órgano: cargos y ocupantes vigentes; histórico; vencimientos. Alta de mandato… |
| PAN-INS-16 | Agenda de reuniones | PT-06 | `/admin/ins/reuniones` | Usa PT-06 Bandeja de trabajo. Filtros: tipo, estado, órgano, fecha |
| PAN-INS-17 | Detalle de reunión | PT-02 | `/admin/ins/reuniones/:id` | Usa PT-02 Ficha o detalle con pestañas. Pestañas: Datos, Orden del día, Participantes, asistencia, Permisos, Resoluciones, Acta, Documentos |
| PAN-INS-24 | Seguimiento de resoluciones | PT-01 | `/admin/ins/resoluciones` | Columnas: número, reunión, categoría, responsable, vencimiento, estado |
| PAN-INS-26 | Presentaciones INAES | PT-01 | `/admin/ins/inaes` | Presentaciones INAES. Lista por tipo y período con vencimiento, lotes, validaciones, acuse. Catálogo de categorías… |
| PAN-INS-28 | Configuración institucional | PT-09 | `/admin/ins/config` | Usa PT-09 Configuración versionada. Configuración institucional. Formularios por grupo de parámetros (§14), estatuto vigente (versión y PDF), series de… |

### FAM-INS-05 Asambleas

| Dato | Valor |
|---|---|
| Patrón base | PT-01 Listado con filtros ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-INS-19 Padrones (M17:1323) |
| Portales | admin, empleado |
| Rutas | `/admin/ins/asambleas/:id`, `/admin/ins/padrones`, `/app/ins/acreditacion/:meetingId`, `/admin/ins/asambleas/:id/votaciones` y 3 más |
| Capabilities | `ins.reuniones.gestionar`, `ins.padrones.generar`, `ins.asistencia.registrar`, `ins.votaciones.gestionar` y 3 más |
| Olas | O10 |

```text
+----------------------------------------------------------------------------+
| Inicio > IN… [Publicar exhibici…] [Resolver reclamo] [Generar preliminar*] |
| Padrones                                                         (?) Ayuda |
+----------------------------------------------------------------------------+
| Buscar [__________] [Libro ▼] [Número ▼] [Fecha ▼] [Estado de firma ▼]     |
| [Más filtros]                                                              |
| Vistas guardadas [Todas ▼]   Filtros activos: (chip x)   [Exportar ▼]      |
+----------------------------------------------------------------------------+
| [ ] Selección Criterios Conjunto  Columnas  Resultado Línea de  [...]      |
| ---------------------------------------------------------------------      |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
| [ ] ·······   ·······   ·······   ·······   ·······   ·······    ...       |
+----------------------------------------------------------------------------+
| N seleccionadas: [Publicar exhibici…] [Resolver … 25 ▼  1-25 de N  < 1 2 > |
+----------------------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M17:1322, M17:1323, M17:1324, M17:1325, M17:1326, M17:1327): Filtros: Libro, Número, Fecha, Estado de firma; Columnas: Selección de asamblea, Criterios, Conjunto guardado, Columnas, Resultado, Línea de tiempo; Campos: Selección de asamblea, Criterios, Conjunto guardado, Columnas, Resultado, Línea de tiempo, Resolución de convocatoria, Documentación; Acciones: Generar preliminar, Publicar exhibición, Resolver reclamo, Aprobar final, Exportar PDF/XLSX, Publicar convocatoria, Adjuntar documentos, Registrar comunicación INAES, Acreditar, Registrar retiro.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-INS-18 | Expediente de asamblea | PT-02 | `/admin/ins/asambleas/:id` | Usa PT-02 Ficha o detalle con pestañas. Expediente de asamblea. Línea de tiempo: resolución de convocatoria, documentación, padrón, publicación, listas, acto… |
| PAN-INS-19 | Padrones | PT-01 | `/admin/ins/padrones` | Padrones. Selección de asamblea, criterios (todos los filtros de RF-INS-079), conjunto guardado, columnas. Resultado… |
| PAN-INS-20 | Acreditación en el acto | PT-07 | `/app/ins/acreditacion/:meetingId` | Usa PT-07 Portal del socio y del empleado (PWA). Acreditación en el acto. Lector QR de credencial o búsqueda por número/documento; muestra habilitación, poderes que… |
| PAN-INS-21 | Votaciones y escrutinio | PT-01 | `/admin/ins/asambleas/:id/votaciones` | Votaciones y escrutinio. Por tema: método, mayoría, habilitados, opciones, recuento. Abrir, cerrar, cargar recuento… |
| PAN-INS-22 | Listas y junta electoral | PT-01 | `/admin/ins/asambleas/:id/listas` | Listas y junta electoral. Listas con candidatos por cargo, avales, observaciones, impugnaciones. Registrar lista… |
| PAN-INS-23 | Libros de actas | PT-05 | `/admin/ins/actas` | Usa PT-05 Tablero, reporte o mapa. Filtros: libro, número, fecha, estado de firma |
| PAN-INS-29 | Distritos electorales | PT-01 | `/admin/ins/config/distritos` | Distritos electorales. Código, nombre, regla de asignación, bancas. Alta, edición, reasignación masiva |

### FAM-INS-06 Institucional en portal y landing

| Dato | Valor |
|---|---|
| Patrón base | PT-07 Portal del socio y del empleado (PWA) ([05a](05a-wireframes-patrones.md)) |
| PAN de referencia del wireframe | PAN-INS-30 Mi asociación (componente embebido en PAN-POR-102) (M17:1334) |
| Portales | landing, socio |
| Rutas | `/app/mi-asociacion`, `/app/asambleas`, `/app/asociarme`, `/asambleas` |
| Capabilities | `ins.mi.ver`, `ins.mi.solicitar` |
| Olas | O10 |

```text
+------------------------------------------------------------+
| < Mi asociación (componente emb…                       (o) |
| Cuenta [Cuenta 0001 ▼]                                     |
+------------------------------------------------------------+
| +--------------------------------------------------------+ |
| | Estado: ········                                       | |
| | Número: ········                                       | |
| | Antigüedad: ········                                   | |
| | Capital: ········                                      | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| +--------------------------------------------------------+ |
| | Estado: ········                                       | |
| | Número: ········                                       | |
| | Antigüedad: ········                                   | |
| | Capital: ········                                      | |
| | [Activo]                                             > | |
| +--------------------------------------------------------+ |
| [                   Solicitar egreso                  * ]  |
+------------------------------------------------------------+
| Inicio | Cuentas y servicios | (+) | Gestiones | Comunidad |
+------------------------------------------------------------+
```

Campos y acciones tomados de la §10 del anexo (M17:1334, M17:1335, M17:1336, M17:1337): Campos: Estado, Número, Antigüedad, Capital, Credencial digital con QR, Documentos; Acciones: Descargar estado de capital, Mostrar credencial, Solicitar egreso, Reclamar padrón, Cargar poder, Enviar solicitud, Descargar.

| PAN | Nombre | Patrón | Ruta | Contenido o variante |
|---|---|---|---|---|
| PAN-INS-30 | Mi asociación (componente embebido en PAN-POR-102) | PT-07 | `/app/mi-asociacion` | Campos: estado, número, antigüedad, capital, credencial digital con QR, documentos |
| PAN-INS-31 | Convocatorias y padrón propio | PT-07 | `/app/asambleas` | Convocatorias y padrón propio. Próximas asambleas, orden del día, documentación, mi habilitación y motivo. Reclamar… |
| PAN-INS-32 | Solicitud de ingreso | PT-07 | `/app/asociarme` | Solicitud de ingreso. Pasos: datos (de M01), estatuto (aceptación), suscripción propuesta, documentos, confirmación… |
| PAN-INS-33 | Asambleas y convocatorias | PT-10 | `/asambleas` | Usa PT-10 Página pública (landing). Convocatorias públicas. Convocatoria y documentación pública (sin datos personales). Descargar. "Sin convocatorias" |
