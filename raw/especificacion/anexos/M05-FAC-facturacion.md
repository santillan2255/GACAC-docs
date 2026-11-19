# M05 FAC — Facturación: ciclos, lotes y comprobantes

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Estado | Especificación consolidada — pendiente de validar preguntas abiertas |
| Solución (BASE §105) | ERP (principal: emisión de documentos); Landing-autogestión (vista del comprobante con apertura por servicio, FAC-011); APIs (consulta de comprobantes y códigos de pago); Cobranza e Impuestos como consumidores |
| Olas | **O4** (núcleo: ciclos, lotes, modalidad separada/agrupada, comprobante, numeración, vencimientos, anulación/NC/ND, PDF con QR, código de barras, distribución, cierre). O5 (lectura de códigos en caja, bloqueo de cobro operado por cobranza, cupón de pago único). O6 (bloqueo con intereses, ND de intereses pedidas por mora). O7 (recategorización por consumo, retroactivos sobre consumos medidos, facturación in situ, datos de terceros por ruta de lectura). O10 (CVLP y servicios de terceros revendidos de telefonía). O11 (migración repetible, paralelo factura por factura, reportes avanzados) |
| Dueño de datos | `billingCycles`, `billingUniverses`, `billingTemplates`, `billingHolds`, `billingRuns`, `billingRunItems`, `billingRunNumberRanges`, `billingExceptions`, `billingExceptionReasons`, `billedPeriods`, `billableItems`, `invoiceDrafts`, `invoices`, `invoiceRelations`, `invoiceBlockReasons`, `invoiceBlockHistory`, `invoiceAnnulmentRequests`, `voucherTypes`, `voucherResolutionRules`, `pointsOfSale`, `numberSequences`, `billingModePolicies`, `billingGroups`, `dueDateSchemes`, `massOperations`, `massOperationItems`, `billingImports`, `billingImportRows`, `invoiceExternalData`, `invoiceTemplates`, `invoiceLineOrders`, `consumptionChartGroups`, `barcodeFormats`, `barcodeAssignments`, `paymentSlips`, `invoiceDocuments`, `deliveryPreferences`, `distributionRuns`, `invoiceDeliveries`, `distributionRoutes`, `postalCarriers`, `billingCycleClosures`. Reemplazados por T05 §20: `billingHolds` → `blocks` de M01 e `invoiceBlockReasons`/`invoiceBlockHistory` → `holdReasons`/`documentHolds` de M08 (CTR-DAT-36); `pointsOfSale` → M06 (CTR-DAT-17); diseño de `invoiceTemplates` → T11 (CTR-DAT-41); recargo de `dueDateSchemes` → M08 (CTR-DAT-37); cupón único de `paymentSlips` → `paymentCoupons` de M07 (CTR-DAT-39). Los cargos por evento son de M04 (`eventCharges`, CTR-DAT-35). |
| Fuentes consolidadas | BASE §2 (facturación por servicio y precisión 0.17), §10 (liquidación y facturación, CU-10), §37, §40 (ejemplo integrado, paso 6), §44 (FAC-001 a FAC-004, CU-FAC-01, 44.8), §57, §69 (LOT-001 a LOT-004, CU-LOT-01, bandeja de excepciones), §70 (precisiones normativas), §71, §97.2 (en lo que toca a emisión), §97.3, §97.4 (exhibición en el comprobante), §97.10 (Grupo Factura), §98, §101, §103 completa (FAC-005 a FAC-012, CU-103, 103.6), §106, MER-002 (tipo LSP, solo referencia), MER-008, MER-010, MER-016 (WhatsApp para envío de facturas), MER-018, MER-019 (cupón único y gráfico de consumos); AGR-009, AGR-010, AGR-011, AGR-013, AGR-015, AGR-016, AGR-017, AGR-018 (migración), ESC-02, ESC-04, ESC-05; DFA Módulo 8 (líneas 440–524) y circuito 1176–1185; REL §1 (alerta de pendientes de autorizar), §2 (Grupo Factura y flags del servicio), §4 (Administración de Comprobantes y detalle), §5 (Tablas de Facturación); RN-02 §1 a §16 completas, incluida la segunda pasada; RN-09 VENTAS_Y_FACTURACION (líneas 657–974, parámetros de emisión); RN-11 §2 a §4 (código de barras de Laguna Larga, ramas por cooperativa, reportes); FIC 4.3; CAT §4 Facturación (36 tablas); INV `ProMod_Facturacion.md` (82 formularios + 4 tipos auxiliares); CNX §4.2, §4.6, §6.2 |


> **Norma de implementación (DEC-111, DEC-112, DEC-110, DEC-113).** Construcción GoodApps: **.NET 10**, **ASP.NET Core**, **EF Core**, **Azure SQL** (base compartida, `TenantId` en tablas de negocio), front **React 19**, **Microsoft Azure** (Container Apps, Blob, Queue, Key Vault, Application Insights), identidad **OpenIddict**. Modelo físico: `07-modelo-relacional-azure-sql.md` y `07-catalogo-tablas-sql.md`. Checklist e impacto: `06-impacto-adaptacion-stack-goodapps.md` (**DIR-13**).
>
> **Lectura:** «colección» en este anexo = **entidad lógica**; tablas, columnas y FK en `07-*`. RF/RN/CU del anexo **no cambian** por el stack.


## 1. Objetivo

Convertir las cantidades y cargos aprobados por los módulos de medición (M03) y tarifas (M04) en **comprobantes emitidos sin duplicación**, controlados y trazables, para cada cooperativa (tenant) y cada uno de sus servicios. El módulo:

- organiza la facturación en **ciclos** con fechas de corte y **universos de clientes** propios por servicio;
- ejecuta **lotes batch** con un universo congelado y versionado, que pasan por estados explícitos: preparar, prefacturar, revisar excepciones, aprobar, emitir, autorizar, distribuir y cerrar el ciclo con un **acta**;
- emite en **modalidad separada** (un comprobante por servicio, FAC-002) o **agrupada** (un comprobante con varios servicios mediante un grupo de facturación, BASE §103), con el detalle, el saldo y las protecciones de cada servicio preservados;
- administra tipos de comprobante y letras, puntos de venta, talonarios y numeración correlativa, de 1 a 4 vencimientos por defecto (tope configurable por tenant, tipo de comprobante o servicio, PRM-FAC-163; DEC-106; antes "hasta cuatro vencimientos") con su trama de recargos, bloqueos, anulaciones, notas de crédito y débito y reversiones;
- ofrece los procesos masivos de mantenimiento que ProCoop resuelve hoy (recategorización, retroactivos, modificación masiva, facturación de cuotas y de terceros, replicar comprobante, refacturación puntual, factura manual);
- produce la representación del comprobante (diseño, gráfico de consumo, talones, código de barras con motor de formatos configurable, PDF con QR fiscal) y la **distribuye** por papel con reparto (MER-008), email, WhatsApp, app y portal, registrando el resultado de cada envío.

El criterio rector es el de BASE §10: **separar el cálculo comercial de la emisión definitiva del comprobante** y, ante una respuesta externa incierta, consultar antes de reintentar; nunca emitir otra factura a ciegas.

## 2. Límite y responsabilidades

### 2.1 Qué hace este módulo

| Responsabilidad | Detalle |
|---|---|
| Ciclos y universos | Calendarios de corte, emisión y vencimiento por servicio y universo; pertenencia, solapamientos y vigencias. |
| Lotes de facturación | Plantilla de corrida, preparación con universo congelado, prefacturación invocando al motor de M04, muestra de control, comparación con el período anterior, bandeja de excepciones, aprobación, emisión en job, reanudación, reprocesamiento de pendientes, cierre de ciclo con acta. |
| Comprobante | Entidad `invoices` completa: cabecera, bloques y renglones con apertura por servicio, resumen de tributos (calculados por M06), vencimientos, relaciones, estado comercial, estado fiscal (espejo del resultado de M06) y bloqueo de cobro. Inmutable una vez autorizado (o emitido, si no requiere autorización en línea); antes del CAE, un rechazo de ARCA lo devuelve a borrador y libera su número (RN-FAC-164; DEC-107). *Reemplazado (10-11-2026, DEC-107): "Inmutable una vez emitido."* |
| Numeración | Tipos de comprobante, letras, matriz de resolución por condición fiscal, puntos de venta, numeradores y talonarios, control de correlatividad. |
| Vencimientos | De 1 a 4 vencimientos por defecto, con tope configurable (PRM-FAC-163; DEC-106; antes "hasta cuatro"), más el próximo vencimiento; tramas de recargo entre vencimientos que **se imprimen** en el comprobante. |
| Correcciones | Bloqueo y desbloqueo, anulación lógica, NC/ND y reversiones, relación entre comprobantes, refacturación puntual, factura manual, replicar comprobante, modificación masiva, recategorización, retroactivos. |
| Ítems facturables | Cola única de cargos pendientes de facturar (retroactivos, cargos manuales, importaciones de terceros, cuotas expuestas por otros módulos) y su consumo al emitir. |
| Representación | Plantillas de diseño, orden de renglones, gráficos de consumo, talones y documentos de pago, código de barras y QR, PDF. |
| Distribución | Preferencias de entrega, lotes de distribución por canal, impresión masiva y exportación a imprenta, rutas de reparto, empresas postales, franqueo, registro de entrega o devolución. |

### 2.2 Qué NO hace y a quién delega

| Tema | Módulo responsable | Qué recibe o pide FAC |
|---|---|---|
| Cálculo de importes de cada servicio (cargo fijo, P×Q, tramos, prorrateos, promociones, cargos adicionales con fórmulas, cargos finales, anticipos y redondeo del ítem, generación distribuida) | **M04 TAR** | FAC invoca `tar.calculate(caso, versiones)` y recibe el resultado con su traza (`calculationResultId`). No recalcula. |
| Autorización ARCA (WSAA/WSFEv1, CAE/CAEA, CESP), IVA, percepciones, tributos, libro IVA, regímenes informativos (RG 3685, RG 3571, RG 1361, RG 3349, SICORE, SIRCAR), entes reguladores (ENARGAS, ENACOM, ERSeP, Secretaría de Energía), convenios de terceros | **M06 FIS** | FAC solicita tributos para el comprobante candidato, encola la autorización y refleja el **estado fiscal** que M06 devuelve. La cola de autorización es una dependencia. |
| Imputación, saldos, cuenta corriente, resumen de cuenta, cupón de pago único como medio de pago, lectura de códigos en caja, débitos automáticos, archivo de deuda a Red Link y SIRO | **M07 COB** | FAC publica `fac.invoice.issued` con una obligación por servicio (FAC-008); M07 es la única fuente del saldo (AGR-011). FAC expone el servicio de decodificación de códigos de pago. |
| Recargo por mora al cobrar, intereses facturados, notificaciones de deuda, instancias, suspensión y corte | **M08 MOR** | FAC solo calcula e imprime los **recargos entre vencimientos** de la trama. M08 pide a FAC la emisión de ND o facturas de intereses por el servicio de emisión individual. |
| Estructura de persona, titular, cuenta, inmueble y domicilios | **M01 PER** | M01 guarda la referencia `billingGroupId` en la cuenta o el contrato y la muestra en la ficha; FAC es dueño del grupo de facturación y de su contenido (FAC-006). |
| Catálogo de servicios, conceptos, categorías, contratos y su categoría vigente | **M02 CAT** | FAC lee el contrato y su categoría; la recategorización confirma el cambio llamando al servicio de M02. |
| Lecturas y consumos, corrección de consumos de gas, prepago | **M03 MED** | FAC consume consumos aprobados; la venta de prepaga usa el servicio de emisión individual de FAC. |
| Ventas de productos, presupuestos, cuotas de ventas, vendedores | **M11 VEN** | M11 expone cuotas facturables como `billableItems`; la modificación masiva de cuotas es de M11 y reutiliza el motor de operaciones masivas de FAC. |
| Capital social | **M17 INS** | FAC publica el evento de cierre de lote para que M17 registre capital sobre lo facturado. |
| Asientos contables | **M15 CON** | Consume `fac.invoice.issued`, `fac.creditNote.issued` y `fac.debitNote.issued`. |
| Plantillas y envío de email, WhatsApp, SMS y push | **T09 COM** | FAC arma el envío y T09 lo ejecuta y devuelve el estado. |
| Calendario de feriados, configuración versionada y parámetros | **T04 CFG** | FAC lee calendario y parámetros `PRM-FAC-*`. |
| Workflow de autorizaciones y expediente documental | **T11 WFL** | Aprobación de lotes, NC, anulaciones, overrides y cierres. |
| Portal, landing y app del socio | **M19 POR** | Shell y navegación; FAC provee pantallas de contenido y API. |

## 3. Glosario del módulo

| Término | Definición | Clave de diccionario | Término ProCoop |
|---|---|---|---|
| Ciclo de facturación | Configuración que fija, para un servicio y un universo, periodicidad y calendario de corte, emisión y vencimientos. | `dict:fac.cycle` | Tipo de factura + configuración de facturación masiva |
| Universo de clientes | Criterio que determina qué contratos/cuentas pertenecen a un ciclo (zona, ruta, conjunto, categoría, lista). | `dict:fac.universe` | Conjunto de facturación, filtros de cuentas |
| Corte | Cierre de medición o de período a efectos de facturar. **No** es suspensión por impago. | `dict:fac.cutoff` | Fecha de toma de estado |
| Plantilla de corrida | Conjunto versionado de servicios, períodos, filtros, reglas de vencimiento, orden y opciones con que se crea un lote. | `dict:fac.template` | `TIPO_FAC` + `PARSERFA` |
| Tipo de factura | Clasificación comercial del comprobante (por ejemplo energía, financiación, servicios generales). | `dict:fac.invoiceClass` | `COD_TIP` ("EN", "FN", "SG") / "tipo de cuota" |
| Lote | Ejecución operativa de facturación sobre un universo; no es una factura única ni una transacción fiscal indivisible. | `dict:fac.run` | Corrida masiva (`FACTMES`) |
| Universo congelado | Foto identificable de la selección, cantidades y versiones de reglas de un lote, con número de versión y huella. | `dict:fac.frozenUniverse` | — |
| Caso (ítem de lote) | Cada cuenta/grupo seleccionado dentro del lote con su estado individual. | `dict:fac.runItem` | Cuenta dentro del lote |
| Prefacturación | Cálculo de comprobantes candidatos sin numerar ni afectar saldos. | `dict:fac.prebilling` | Simulación |
| Muestra de control | Cuentas elegidas para revisión antes de aprobar (una por categoría, por condición fiscal, grandes y pequeños consumos). | `dict:fac.controlSample` | Cuentas de control |
| Excepción | Caso con un problema que impide o condiciona su emisión, con motivo, responsable y acción. | `dict:fac.exception` | Lista de errores por servicio |
| Emisión | Numeración y persistencia definitiva del comprobante. | `dict:fac.issue` | Generación real |
| Estado fiscal | Situación ante ARCA: no requiere, pendiente, autorizado, autorizado con observaciones, rechazado, incierto, contingencia. | `dict:fac.fiscalStatus` | `ID_BLO = -1` (pendiente de CAE) |
| Respuesta incierta | Resultado de autorización desconocido por corte o tiempo de espera; exige consulta antes de reintentar. | `dict:fac.uncertain` | — |
| Cierre de ciclo / acta | Acto que da por terminado el período de un ciclo con un reporte de control aprobado. | `dict:fac.cycleClosure` | — (cierre del submódulo por fecha) |
| Comprobante | Documento emitido: factura, nota de débito, nota de crédito, liquidación de servicios públicos, ticket, interno, CVLP. | `dict:fac.invoice` | `FACTURAS` |
| Bloque de servicio | Sección del comprobante con los renglones, lecturas, tributos y subtotal de un servicio/contrato. | `dict:fac.serviceBlock` | Ítems agrupados por servicio |
| Renglón | Línea del comprobante: concepto, cantidad, precio unitario, impuestos, neto. | `dict:fac.line` | `ITEMSFAC` |
| Modalidad separada | Un comprobante por servicio y contrato. | `dict:fac.mode.separate` | Grupo factura por servicio |
| Modalidad agrupada | Un comprobante con varios servicios del mismo titular mediante un grupo de facturación. | `dict:fac.mode.grouped` | Grupo Factura (G.F.) |
| Grupo de facturación | Agrupación de servicios/contratos de un titular para presentarlos en un mismo comprobante. | `dict:fac.billingGroup` | `GRUPOS_FACTURA` |
| Tipo de comprobante | Clase legal/interna con su código ARCA y letra. | `dict:fac.voucherType` | `COMPROB` |
| Letra | A, B, C, M, E o sin letra; parte del tipo de comprobante. | `dict:fac.letter` | Parte del código de comprobante |
| Punto de venta | Punto de emisión habilitado ante ARCA o interno. | `dict:fac.pointOfSale` | `PTOVENTA` (`SUC_COM`) |
| Numerador / talonario | Último número por tipo de numeración y punto de venta. | `dict:fac.sequence` | `COMPPOS` |
| Vencimiento | Fecha de pago con su importe; hasta cuatro por comprobante. | `dict:fac.dueDate` | `VTO1..VTO4`, `TOTAL1..TOTAL4` |
| Próximo vencimiento | Fecha estimada del siguiente comprobante, impresa. | `dict:fac.nextDueDate` | `PROX_VTO` |
| Trama de vencimientos | Regla de cantidad, separación y recargo de cada vencimiento. | `dict:fac.dueDateScheme` | Tramas de vencimientos (`TRAMASREC`) |
| Bloqueo de cobro | Marca con causa que impide cobrar un comprobante. | `dict:fac.block` | `ID_BLO` con causa `CAUBLOQ` |
| Anulación | Baja lógica de un comprobante no autorizado y sin pagos. | `dict:fac.annulment` | Anulación (`ESTADO = 'A'`, `ANUFAC`) |
| Reversión | Emisión de un comprobante inverso (NC o ND) asociado al original. | `dict:fac.reversal` | Revertir factura |
| Nota de crédito / débito | Comprobante que disminuye / aumenta una obligación y referencia al original. | `dict:fac.creditNote` / `dict:fac.debitNote` | NC / ND |
| Refacturación puntual | Nueva emisión de un servicio y período fuera del lote, vinculada a la corrección del original. | `dict:fac.rebill` | Refacturación por secuencia |
| Secuencia | Número de pasada dentro de un mismo período (bimestral partido, refacturación). | `dict:fac.sequenceNo` | `SEC_PER`, `Secuencia` |
| Período facturado | Registro de que un contrato-servicio fue facturado en un período y secuencia. | `dict:fac.billedPeriod` | `SERSOC.ULT_FAC` + `SEC_PER` |
| Ítem facturable | Cargo pendiente de incluir en la próxima facturación. | `dict:fac.billableItem` | `PRCAGAS` (cargos adicionales pendientes) |
| Retroactivo | Proceso que genera ítems facturables para cobrar o devolver diferencias de períodos ya facturados. | `dict:fac.retroactive` | Retroactivos |
| Recategorización | Cambio masivo de categoría de servicios según consumo. | `dict:fac.recategorization` | Recategorización |
| Documento de pago / talón | Agrupación de comprobantes para pagarlos con un único código. | `dict:fac.paymentSlip` | Talón sumado (`TALONFAC`) |
| Código de pago | Código de barras o QR que identifica el documento y sus importes para las redes de cobro. | `dict:fac.paymentCode` | Código de barras |
| Formato de código | Definición declarativa de segmentos, anchos y dígito verificador. | `dict:fac.barcodeFormat` | Clase `CodigoBarra.*` |
| Dígito verificador | Algoritmo de control del código. | `dict:fac.checkDigit` | DV1..DV9 |
| Factura manual | Comprobante cargado renglón por renglón por un operador. | `dict:fac.manualInvoice` | Registro de Facturas Manuales |
| Replicar comprobante | Crear un borrador nuevo copiando un comprobante existente. | `dict:fac.replicate` | Replicar Comprobante |
| Preferencia de entrega | Canal o canales elegidos para recibir comprobantes. | `dict:fac.deliveryPreference` | Adhesión a factura electrónica / email |
| Ruta de reparto | Recorrido de distribución en papel con repartidor y secuencia. | `dict:fac.deliveryRoute` | Zona/sector/recorrido postal |
| Pieza postal | Sobre numerado que agrupa los comprobantes de un destinatario. | `dict:fac.postalPiece` | Número de pieza |
| Franqueo | Cargo por envío en papel, si el tenant lo habilita. | `dict:fac.freight` | Franqueo (`POSTALES`, producto subtipo 17) |
| CVLP | Cuenta de venta y líquido producto, para servicios de terceros con comisión. | `dict:fac.cvlp` | CVLP |

## 4. Actores, permisos y alcance

| Rol funcional | Capabilities | Alcance de datos |
|---|---|---|
| Administrador del tenant | `fac.modalidad.configurar`, `fac.tiposComprobante.configurar`, `fac.puntosVenta.configurar`, `fac.numeracion.configurar`, `fac.tramas.configurar`, `fac.diseno.configurar`, `fac.codigoBarras.configurar`, `fac.reparto.configurar`, `fac.parametros.configurar`, `fac.excepcionesMotivos.configurar`, `mor.causas.configurar` (antes `fac.bloqueosCausas.configurar`; capability de M08, PA-FAC-23) | Tenant |
| Responsable de facturación | `fac.ciclos.ver/crear/editar`, `fac.universos.ver/crear/editar`, `fac.plantillas.ver/crear/editar`, `fac.lotes.ver/crear/preparar/prefacturar/emitir/pausar/reanudar/cancelar/exportar`, `fac.excepciones.ver/asignar/resolver/excluir`, `fac.comprobantes.ver/exportar`, `fac.grupos.ver/crear/editar/desarmar`, `fac.distribucion.ver/ejecutar`, `fac.talones.generar`, `fac.cierre.proponer`, `fac.reportes.ver/exportar` | Tenant, o servicios/sucursales asignados |
| Aprobador de facturación (jefe comercial) | `fac.lotes.aprobar`, `fac.cierre.aprobar`, `fac.excepciones.excluir`, `fac.modificacionMasiva.aprobar`, `fac.retroactivos.aprobar`, `fac.recategorizacion.confirmar`, `fac.overrides.aprobar` | Tenant o servicios asignados |
| Operador de facturación | `fac.lotes.ver`, `fac.excepciones.ver/resolver`, `fac.comprobantes.ver/crear` (manual), `fac.comprobantes.replicar`, `fac.comprobantes.refacturar`, `fac.cargos.crear/editar/anular`, `fac.importaciones.crear`, `fac.bloqueos.bloquear/desbloquear`, `fac.modificacionMasiva.crear`, `fac.recategorizacion.simular`, `fac.retroactivos.crear` | Sucursales/servicios asignados |
| Contador / responsable fiscal | `fac.notasCredito.aprobar`, `fac.anulaciones.aprobar`, `fac.cierre.aprobar`, `fac.cierre.reabrir`, `fac.comprobantes.ver/exportar`, `fac.tiposComprobante.configurar`, `fac.grupos.validarFiscal` | Tenant |
| Operador de correcciones (NC/ND) | `fac.comprobantes.anular`, `fac.notasCredito.emitir` (antes `fac.notasCredito.crear`), `fac.notasDebito.emitir` (antes `fac.notasDebito.crear`), `fac.relaciones.editar` | Sucursales asignadas |
| Corrector de datos de clientes | `fac.excepciones.ver/resolver` (motivos de su categoría), acceso a M01 | Zonas/sucursales asignadas |
| Supervisor de consumos | `fac.excepciones.ver/resolver` (motivos de lectura), acceso a M03 | Rutas/zonas asignadas |
| Operador de distribución e impresión | `fac.distribucion.ver/ejecutar/exportar`, `fac.talones.generar/eliminar`, `fac.reparto.ver`, `fac.comprobantes.reimprimir` | Sucursales/rutas asignadas |
| Repartidor (pwa-empleado) | `fac.reparto.registrarEntrega` | Sus rutas (propios) |
| Atención al público | `fac.comprobantes.ver`, `fac.comprobantes.reimprimir`, `fac.comprobantes.reenviar`, `fac.preferencias.editar`, `fac.refacturacion.solicitar` | Sucursal |
| Operador de telefonía / terceros (O10) | `fac.cvlp.ver/crear/finalizar`, `fac.importaciones.crear` | Servicios asignados |
| Auditor | `fac.*.ver`, `fac.reportes.exportar`, `fac.auditoria.ver` | Tenant, solo lectura |
| Socio / titular (pwa-socio, portal) | `por.comprobantes.ver`, `por.comprobantes.descargar`, `por.preferencias.editar` | Propios: cuentas y contratos autorizados |
| Soporte de plataforma | Lectura temporal y auditada (T01), sin capabilities de emisión | Tenant con acceso concedido |
| Cuenta de servicio (workers) | `fac.jobs.ejecutar` | Tenant del job |

**Regla de separación de funciones:** con `PRM-FAC-070` activo (por defecto sí), quien prepara un lote no puede aprobarlo y quien solicita una NC por encima del umbral `PRM-FAC-071` no puede aprobarla. No existe un usuario que saltee validaciones (en ProCoop, `SysAdmin` salteaba CESP y LUA): cualquier excepción a una validación es un **override** con motivo, aprobación (`fac.overrides.aprobar`) y auditoría.

## 5. Requisitos funcionales

> **Barrido transversal (19-11-2026, DEC-111).** Los RF/RN de **§5–§6** definen comportamiento aceptado. Citas a MongoDB, Mongoose, BullMQ, Vue o npm son **mecanismos históricos Connectia** o columnas de contraste; en build GoodApps prevalecen `03-norma-ejecucion-goodapps.md` §3–§4, `07-ddl` y §7 de este anexo. No reinterpretar alcance sin nueva DEC.


### 5.1 Ciclos, universos y plantillas

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-FAC-001 | Crear ciclos de facturación por tenant, servicio y universo, con vigencia, periodicidad (mensual, bimestral, trimestral, anual, a demanda) y calendario con fechas diferenciadas: corte de consumo, fin de período facturado, ejecución del lote, emisión y vencimientos. | BASE §10, §69 LOT-001, §71, AGR-017 | Núcleo | O4 | Informado | TEN-001 tiene AG-C1 (corte día 5) y AG-C2 (día 20) para agua y ELE-C1 (día 10) para electricidad; TEN-002 tiene GAS-C1 (día 15); ninguno ve ni afecta al otro. |
| RF-FAC-002 | Permitir uno o más ciclos por servicio, cada uno con su universo. | BASE §69 LOT-001 | Núcleo | O4 | Informado | Dos ciclos de agua coexisten con universos disjuntos. |
| RF-FAC-003 | Definir universos por criterios combinables: zona, sector y recorrido de lectura; ruta; conjunto de facturación; zona postal, empresa postal y localidad postal; categoría; plan; grupo de facturación; condición fiscal; altas anteriores a una fecha; lista explícita de cuentas o contratos (incluida importación Excel). | BASE §69; RN-02 §2.1, §2.3; CAT `CONJUNTO`, `FACTMES` | Núcleo | O4 | Informado | Un universo "Grupo Centro" por zona devuelve la misma pertenencia al consultarlo dos veces con los mismos datos. |
| RF-FAC-004 | Controlar pertenencia y solapamientos: un contrato-servicio pertenece a un solo ciclo vigente por servicio en cada período; al publicar un ciclo o universo se informa y bloquea todo solapamiento. | BASE §69, §71 | Núcleo | O4 | Informado | Publicar un universo que incluye un contrato ya cubierto por otro ciclo vigente falla con la lista de contratos en conflicto. |
| RF-FAC-005 | Registrar cambios de pertenencia con fecha efectiva y fecha de registro; un cambio rige desde el período siguiente al último corte procesado, sin reabrir lotes emitidos. | BASE §71; AGR-010 | Núcleo | O4 | Adoptado | Un contrato movido de AG-C1 a AG-C2 el día 12 se factura en AG-C2 desde el período siguiente y no queda sin facturar ni facturado dos veces. |
| RF-FAC-006 | Resolver las fechas del ciclo con el calendario del tenant (T04): días hábiles, feriados nacionales, provinciales y locales, meses cortos, años bisiestos; regla de desplazamiento al siguiente o anterior día hábil por tipo de fecha. | RN-02 §2.2.7; AGR-017; DFA M8 `CALENDARIO` | Núcleo | O4 | Adoptado | Un vencimiento calculado en domingo o feriado se desplaza según la regla; el 29/02 se resuelve sin error. |
| RF-FAC-007 | Expresar las fechas de la plantilla de forma declarativa ("día hábil N del mes", "fin de mes + N días", "N días desde emisión", "fecha fija") y resolverlas al preparar el lote, guardando el valor resuelto en el lote. | RN-02 §2.1, §15.1, §16.3 | Núcleo | O4 | Adoptado | La plantilla guarda la expresión; el lote guarda la fecha concreta; cambiar la plantilla no altera lotes ya preparados. |
| RF-FAC-008 | Programación automática: según el calendario del ciclo, el sistema crea el lote en borrador en la fecha de ejecución y notifica al responsable. Nunca prepara ni emite sin una acción o aprobación humana configurada. | BASE §69; AGR-015 | Estándar | O4 | Adoptado | En la fecha de ejecución aparece el lote borrador en la bandeja del responsable; no hay comprobantes nuevos hasta su aprobación. |
| RF-FAC-009 | Mantener **plantillas de corrida** versionadas, separadas del tipo de factura comercial: servicios con período por servicio y rango de lecturas, filtros de universo, cuotas a incluir, reglas de vencimiento y próximo vencimiento, tipo de factura a emitir, tipo de comprobante, orden de emisión, opciones, reporte de impresión. | RN-02 §2.1, §15.1; INV `abm_Tipo_Fac`; CAT `TIPO_FAC`, `PARSERFA` | Núcleo | O4 | Adoptado | Publicar una versión nueva de plantilla no modifica lotes preparados con la anterior. |
| RF-FAC-010 | Proponer la próxima fecha de facturación: último día del mes + 10 días, o un mes después de la última facturación de la plantilla si fue hace menos de 60 días; editable. | RN-02 §2.9 | Estándar | O4 | Replicado (Adoptado) | Con última facturación el 10/10/2026 la propuesta es 10/11/2026. |
| RF-FAC-011 | Registrar marcas de **no facturar** por cuenta o contrato con vigencia, motivo, usuario de alta y de baja, y la marca por servicio de "no facturar"; los casos marcados quedan excluidos del universo con su causa. | RN-02 §2.3; CAT `SUMNOFAC`; REL §2 flag "No Facturar" | Núcleo | O4 | Adoptado | Una cuenta con marca activa aparece en el lote como "excluida: marca no facturar" y no genera comprobante. |
| RF-FAC-012 | Mantener **clasificaciones comerciales** de comprobante (tipo de factura: energía, financiación, servicios generales, viviendas, prepaga) con su reporte, plan de cuentas asociado y grupo de talón. | RN-02 §1, §12.2; CAT `TIPO_FAC` | Estándar | O4 | Adoptado | Cada comprobante emitido tiene una clasificación comercial y una plantilla de impresión resoluble. |

### 5.2 Lote: preparar y congelar el universo

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-FAC-013 | Crear un lote desde un ciclo o ad hoc indicando: a quién (todas las cuentas del universo, una cuenta, varias cuentas, cuentas de control), servicios y período por servicio, período general y secuencia, tipo de comprobante y tipo de factura, vencimientos, orden de emisión y opciones (forzar cuadro tarifario histórico con fecha de vigencia, no aplicar anticipos, no cobrar envío, solo simulación). | RN-02 §2.1; INV `frmFacturacionMensual` | Núcleo | O4 | Adoptado | Las cuatro modalidades de destinatarios generan universos con la cantidad esperada. |
| RF-FAC-014 | Importar la lista de cuentas de un lote "varias cuentas" desde Excel con el asistente genérico (subir, previsualizar errores, confirmar). | RN-02 §2.1 `ImportarCuentas`; CNX §4.6 | Estándar | O4 | Adoptado | Una planilla con una cuenta inexistente muestra el error en la previsualización y no se incorpora. |
| RF-FAC-015 | Validar la configuración del lote antes de preparar con todas las reglas RN-FAC-008 a RN-FAC-016. | RN-02 §2.2 | Núcleo | O4 | Adoptado | Un lote con Vto2 anterior a Vto1 no se puede preparar y muestra el error en el campo. |
| RF-FAC-016 | Validar datos y prerrequisitos: conceptos obligatorios configurados (PRM-FAC-060), matriz de comprobantes resoluble para cada condición fiscal y para ambos signos, numeración forzada inexistente. | RN-02 §2.2 `ValidarDatos` | Núcleo | O4 | Adoptado | Si para "Exento" no hay comprobante de crédito resoluble, la preparación se detiene con "Verifique el tipo de comprobante para la condición fiscal Exento". |
| RF-FAC-017 | Verificar prerrequisitos fiscales y de estado consultando a M06 y M17: CESP vigente si algún servicio liquida como servicio público, padrón de Ingresos Brutos vigente, comprobantes pendientes de autorización con antigüedad mayor a `PRM-FAC-020` días (advertencia o bloqueo según parámetro), registración de capital en curso (bloquea). Las excepciones solo por override aprobado. | RN-02 §2.2 `ValidarCESP`, `ValidarLUA`, `ValidarElectronicas`, `IniciarProceso_Th` | Núcleo | O4 | Adoptado | Sin CESP vigente un lote de servicio público no pasa a "preparado"; con override aprobado sí, y queda auditado. |
| RF-FAC-018 | Garantizar exclusión mutua: un solo lote en preparación, prefacturación o emisión por (tenant, ciclo o plantilla, período, secuencia); lotes de distintos ciclos pueden correr en paralelo. | RN-02 §2.2 `GenerarLog`, §15.4 | Núcleo | O4 | Adoptado | Un segundo intento de emitir el mismo ciclo y período responde 409 con el lote en curso. |
| RF-FAC-019 | **Preparar** congela el universo: guarda la foto de la selección (cuentas, contratos, servicios, grupos), las cantidades (consumos aprobados con su id y versión), las versiones de reglas aplicables (tarifa, configuración publicada, plantilla, trama, matriz de comprobantes) y una huella (hash) del conjunto; el universo queda reproducible. | BASE §69; AGR-015; ESC-05 | Núcleo | O4 | Adoptado | Re-ejecutar la prefacturación de un lote preparado produce los mismos importes aunque después se publique una tarifa nueva. |
| RF-FAC-020 | Aplicar las reglas de elegibilidad por servicio (RN-FAC-020 a RN-FAC-026): conectado, consumos sin facturar, cargos pendientes, baja con cobro proporcional, prepaga, altas anteriores, período no facturado. | RN-02 §2.3 `CargarServicios` | Núcleo | O4 | Adoptado | Un servicio dado de baja hace más de 6 meses sin cargos pendientes no entra en el universo. |
| RF-FAC-021 | Impedir la doble facturación con el registro `billedPeriods` por (contrato, servicio, período, secuencia) vigente; solo se vuelve a facturar con otra secuencia explícita o por consumos/cargos nuevos. | RN-02 §2.3, §15.3; BASE §10 "evitar dobles emisiones" | Núcleo | O4 | Adoptado | Emitir dos veces el mismo lote produce 0 comprobantes nuevos en la segunda ejecución. |
| RF-FAC-022 | Versionar el universo: agregar o quitar casos después de preparar genera una versión nueva con las diferencias y su motivo; nunca se reemplaza en silencio. | AGR-015 | Núcleo | O4 | Adoptado | El lote muestra "Universo v2: +3 −1, motivo: altas tardías aprobadas". |
| RF-FAC-023 | Seleccionar una **muestra de control** automática: una cuenta por categoría, una por condición fiscal, una de grandes y otra de pequeños consumos, más las que el usuario agregue; se marca en el lote para su revisión. | RN-02 §2.3 `GetCuentasMuestra`; INV `frmFacturacionMensual.AgregarCuentasMuestra` | Estándar | O4 | Adoptado | Con 5 categorías y 3 condiciones fiscales la muestra tiene al menos 8 cuentas distintas cuando existen. |
| RF-FAC-024 | Clonar un lote anterior como base de uno nuevo (servicios, filtros, cuentas, opciones), recalculando fechas. | RN-02 §2.9 `CargarCuentas` | Estándar | O4 | Adoptado | Clonar el lote de octubre crea un borrador de noviembre con los mismos filtros. |
| RF-FAC-175 | Ordenar la preparación y prefacturación por **dependencias entre servicios relacionados**: un servicio que toma el consumo de otro (ej. CLO sobre AG, RN-TAR-015) se procesa después de que su servicio base esté preparado con consumo aprobado en el mismo lote o en un lote ya emitido del período; si el base falta, está dado de baja o no tiene consumo aprobado, el caso queda como excepción `RELATED_SERVICE_MISSING` (originada en `TAR-E-RELATED-MISSING` de M04) y el lote continúa (RN-FAC-155). | HUE-CLO-02; RN-TAR-015, RN-TAR-247 | Núcleo | O7 | Adoptado | En un lote AG + CLO, CLO de cada cuenta se calcula después de AG; una cuenta con AG dado de baja queda excluida con `RELATED_SERVICE_MISSING` y las demás se emiten. |

### 5.3 Prefacturación, simulación y comparación

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-FAC-025 | Prefacturar cada caso invocando el motor de M04 con las versiones congeladas; obtener comprobantes candidatos en borrador con detalle de cálculo, sin numerar, sin consumir ítems y sin afectar saldos. | BASE §10; DFA M8 mejoras; RN-02 §2.4 | Núcleo | O4 | Informado | Tras prefacturar, la cuenta corriente (M07) no registra ningún movimiento. |
| RF-FAC-026 | Simular servicios puntuales con configuración genérica (todo vence hoy, lecturas de los últimos dos meses) y simular una cuenta con un cuadro tarifario forzado para comparar cuadros. | RN-02 §2.4 `SimularFacturas`, `SimularFacturasConCuadros` | Estándar | O4 | Adoptado | La simulación con cuadro forzado muestra ambos totales y la diferencia. |
| RF-FAC-027 | Comparar el resultado contra el período anterior por caso, servicio, categoría y total; marcar variaciones que superen `PRM-FAC-030` (porcentaje) o `PRM-FAC-031` (importe) como advertencias. | BASE §10 | Núcleo | O4 | Informado | Un caso que pasa de ARS 13.000 a ARS 40.000 aparece como advertencia de variación. |
| RF-FAC-028 | Armar comprobantes candidatos agrupando por (titular/cuenta, grupo de facturación, clase de comprobante: liquidación de servicios públicos o factura común; DEC-093, RN-FAC-040) según la modalidad vigente; un servicio marcado "facturar con otros" solo se incluye si el comprobante tiene ítems de otro servicio; los cargos que una fórmula envía a otro grupo se suman al comprobante de ese grupo o generan uno nuevo. | RN-02 §2.5 `FacturarServicios`, §2.6.2 `AgregarFactura` | Núcleo | O4 | Adoptado | Un servicio "con otros" solo en la cuenta no genera comprobante. |
| RF-FAC-029 | Aplicar el criterio de emisión: se emite si algún renglón tiene importe distinto de cero; por servicio, opcionalmente, se emite en cero cuando hay consumos (`PRM-FAC-032`). | RN-02 §2.6.3 | Núcleo | O4 | Adoptado (DEC-037; antes A validar PA-FAC-06) | Con el parámetro apagado, un caso con importe 0 queda "sin cargo" en el lote y no emite. |
| RF-FAC-030 | Tratar el total negativo según la política del servicio: emitir nota de crédito o, para generación distribuida, agregar un renglón "Crédito por energía inyectada" como anticipo a futuro que neutraliza el total (el saldo a favor lo administra M07). | RN-02 §2.6.4, §2.6.6, §2.6.8, §15.8; PRM V2 3094 | Núcleo | O4 | Adoptado (DEC-036; antes A validar PA-FAC-05) | Un caso de GD que da −ARS 2.000 emite comprobante en 0 con crédito de ARS 2.000 a favor. |
| RF-FAC-031 | Ejecutar el pipeline de armado en el orden: cargos adicionales no finales (M04), agrupación, criterio de emisión, cabecera e ítems, resolución de comprobante, signo, punto de venta, cargos finales sobre el comprobante armado (M04), GD, anticipos y redondeo (M04/M07), segunda verificación de signo, prepaga, tributos (M06). | RN-02 §2.6 pasos 1–10 | Núcleo | O4 | Adoptado | El detalle del candidato muestra los pasos aplicados en ese orden. |
| RF-FAC-032 | Resolver el tipo de comprobante con un servicio puro y testeable (RN-FAC-040 a RN-FAC-044 y RN-FAC-162). El tipo surge de la condición del emisor y receptor y de la normativa, no de la preferencia del usuario. Un receptor con identificación pendiente (`documentPending` de M01, DEC-099) no recibe comprobantes que exijan identificarlo por documento (RN-FAC-162). | RN-02 §3.2, §15.7; BASE §69 validación fiscal de la factura A; DEC-099 | Núcleo | O4 | Informado | Un caso configurado para factura A sin CUIT queda "No apto para emisión: falta CUIT del receptor" y no se cambia a B sin validación. Un titular migrado sin documento queda en excepción `RECEIVER_DOCUMENT_PENDING` salvo factura B a consumidor final por debajo del umbral de identificación que M06 confirme (DEC-099). |
| RF-FAC-033 | Resolver el punto de venta con un servicio puro (RN-FAC-047). | RN-02 §4.2 | Núcleo | O4 | Adoptado | Dos servicios con puntos de venta propios distintos en un mismo grupo generan la excepción "2 o más servicios con puntos de venta diferentes". |
| RF-FAC-034 | Validar cada candidato con las reglas del comprobante individual (RN-FAC-045). | RN-02 §3.3 | Núcleo | O4 | Adoptado | Un candidato con cantidad 0 en un renglón genera excepción. |

### 5.4 Bandeja de excepciones

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-FAC-035 | Ofrecer una bandeja de excepciones con caso, cliente, cuenta, servicio, contrato, período, problema o dato faltante, código de motivo, severidad, etapa, estado, responsable (rol y usuario), módulo dueño del dato, siguiente acción, fecha límite, lote origen e historial. | BASE §69 LOT-003 y campos ilustrativos | Núcleo | O4 | Informado | ITEM-099 aparece con "Factura A sin CUIT · Bloqueado en prevalidación · Datos de clientes · Completar y validar situación fiscal". |
| RF-FAC-036 | Mantener un catálogo de motivos tipificados con categoría, severidad, responsable y acción por defecto y enlace a la pantalla de corrección. | BASE §69, §71 | Núcleo | O4 | Adoptado | Cada excepción tiene un motivo del catálogo; no existen excepciones de texto libre sin código. |
| RF-FAC-037 | Aislar errores individuales y continuar con los casos válidos; detectar fallos sistémicos (credencial fiscal inválida, integración caída, error de configuración que afecta más de `PRM-FAC-033` % del bloque) y **pausar** el lote en lugar de marcar a todos los clientes como erróneos. | BASE §69 | Núcleo | O4 | Informado | Con la credencial ARCA vencida el lote queda "pausado: credencial fiscal inválida" y los casos siguen "aprobados" sin excepción individual. |
| RF-FAC-038 | Asignar y derivar excepciones al responsable o al módulo dueño (M01 datos fiscales, M03 lecturas, M04 tarifa, M06 fiscal, M02 contrato), con notificación y plazo. | BASE §69, §71; AGR-016 | Núcleo | O4 | Adoptado | El supervisor de consumos recibe la excepción ITEM-100 en su bandeja con enlace a la lectura. |
| RF-FAC-039 | Reprocesar solo los casos pendientes en una ejecución vinculada al lote original, verificando antes la emisión previa de cada caso. | BASE §69, CU-LOT-01 | Núcleo | O4 | Informado | Tras corregir 2 casos, la reemisión genera 2 comprobantes y 0 duplicados. |
| RF-FAC-040 | Excluir un caso con causa (no facturar en este período) con aprobación, o trasladarlo al próximo ciclo; ambos quedan en el acta. | BASE §69; AGR-015 | Núcleo | O4 | Adoptado | Un caso excluido figura en el acta con causa, aprobador y fecha. |
| RF-FAC-041 | Distinguir y contar por separado: prevalidación bloqueada, rechazo fiscal, emitido con observaciones, incierto, excluido con motivo, pendiente; nunca ocultarlos bajo un "lote completado". | BASE §69 | Núcleo | O4 | Informado | El resumen del lote muestra las seis cifras y su suma coincide con el universo. |
| RF-FAC-042 | Conservar la relación entre caso original, corrección, ejecución nueva y comprobantes emitidos. | BASE §69 | Núcleo | O4 | Informado | Desde ITEM-099 se navega a la corrección del CUIT, al reproceso y al comprobante emitido. |

### 5.5 Aprobación

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-FAC-043 | Aprobar la emisión según rol con un resumen obligatorio: universo, aptos, excepciones por motivo, totales por servicio y concepto, variaciones, muestra revisada y advertencias; workflow T11 por umbral de importe total (`PRM-FAC-072`). | BASE §10, §69; MER-012 | Núcleo | O4 | Informado | Un lote por encima del umbral requiere dos aprobaciones; sin ellas el botón Emitir no está disponible. |
| RF-FAC-044 | Permitir la aprobación parcial: se aprueban los aptos y las excepciones siguen pendientes de corrección. | BASE §69 CU-LOT-01 | Núcleo | O4 | Informado | Se aprueban 98 de 100 casos; los 2 restantes siguen en la bandeja. |
| RF-FAC-045 | Invalidar la aprobación de los casos afectados si cambia una versión congelada (por ejemplo, se corrige una lectura) y exigir re-prefacturarlos y re-aprobarlos; los ya emitidos no se tocan. | ESC-05; AGR-009, AGR-010 | Núcleo | O4 | Adoptado | Corregir la lectura de un caso aprobado lo devuelve a "prefacturado" con la diferencia explicada. |
| RF-FAC-046 | Exigir que la muestra de control haya sido marcada como revisada antes de aprobar lotes con más de `PRM-FAC-034` casos. | RN-02 §2.3; AGR-015 | Estándar | O4 | A validar (PA-FAC-11) | Un lote de 5.000 casos sin muestra revisada no se puede aprobar. |
| RF-FAC-174 | **Cola de revisión previa** antes de autorizar: los casos cuyas cuentas pertenecen a las categorías o condiciones especiales configuradas (PRM-FAC-161: grandes usuarios / categorías tarifarias de demanda, usuario-generador, contratos con acuerdo especial, cuentas marcadas) o cuyo cálculo de M04 vino con `requiresReview` (importe sobre PRM-TAR-014, `TAR-W-LARGE-REVIEW`) pasan a `reviewPending` y no se envían a autorización (ARCA) hasta que un revisor con `fac.revisionPrevia.aprobar` los apruebe, los devuelva a prefacturar con observación o los excluya con causa (RN-FAC-154; PAN-FAC-47). | HUE-ELE-02; M02 §6.C.4; MER-003; RF-TAR-114 | Estándar | O7 | Adoptado | Un gran usuario de la categoría configurada queda en `reviewPending` con su detalle de demanda y comparación con el período anterior; el resto del lote se emite; sin aprobación de la revisión no recibe CAE. |

### 5.6 Emisión y numeración del lote

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-FAC-047 | Emitir en un job de fondo por bloques de tamaño configurable (`PRM-FAC-035`), con progreso, métricas (casos por minuto, tiempo estimado, emitidos, errores) y acciones de pausar, reanudar y cancelar lo pendiente. | BASE §10, §69; RN-02 §2.5, §2.8, §15.5 | Núcleo | O4 | Informado | Pausar detiene después del bloque en curso; reanudar continúa desde el siguiente sin duplicar. |
| RF-FAC-048 | Numerar estrictamente en forma correlativa por (tipo de numeración, punto de venta) en el **orden de emisión** del lote, dentro de la misma transacción que persiste los comprobantes y actualiza el numerador; sin huecos ni duplicados. El cálculo puede paralelizarse; la numeración no. | RN-02 §4.3, §15.4, §15.5; AGR-016; DEC-035; DEC-107 | Núcleo | O4 | Adoptado | El número se asigna al emitir, en orden del lote (DEC-035); si ARCA rechaza un comprobante con CAE en línea, ese comprobante vuelve a borrador y libera su número, los posteriores del mismo numerador sin CAE vuelven a la cola y se renumeran al reenviarse desde el último autorizado, y los autorizados nunca cambian (RN-FAC-164; DEC-107). *Reemplazado (10-11-2026, DEC-107): "y si ARCA rechaza se reenvía el mismo número (DEC-035)".* Un fallo en el bloque 7 no consume números: el bloque 8 continúa desde el último número confirmado del bloque 6. |
| RF-FAC-049 | Ordenar la emisión por cuenta, alfabético, zona/sector/recorrido postal, ruta de reparto, o calle y número, porque el orden define la numeración y el reparto. | RN-02 §2.1 `OrdenarCuentas`, §12.1 | Núcleo | O4 | Adoptado | Con orden por ruta, los números crecen en la secuencia de la planilla de reparto. |
| RF-FAC-050 | Registrar por lote el rango de numeración emitido por tipo y punto de venta (desde, hasta, tipo de autorización). | RN-02 §2.9; CAT `FACTMES_COMP` | Núcleo | O4 | Adoptado | El lote muestra "Factura B 0002: 00001001–00001098, CAE". |
| RF-FAC-051 | Al emitir cada caso: crear el comprobante inmutable con su detalle, registrar `billedPeriods`, consumir ítems facturables y cuotas, publicar `fac.invoice.issued` con una obligación por servicio para M07, solicitar autorización a M06 si el punto de venta lo requiere y generar los códigos de pago. | BASE §10, §103 FAC-008 | Núcleo | O4 | Informado | Cada comprobante emitido tiene su evento en el outbox en la misma transacción. |
| RF-FAC-052 | Garantizar idempotencia con una clave de operación por caso (tenant, lote, caso, versión del universo); reintentar nunca duplica comprobantes ni consumos. | BASE §10; AGR-016 | Núcleo | O4 | Informado | Matar el worker en mitad del bloque y relanzar produce el mismo conjunto de comprobantes. |
| RF-FAC-053 | Reanudar procesos interrumpidos desde el último bloque confirmado, mostrando qué quedó emitido y qué pendiente. | BASE §10 | Núcleo | O4 | Informado | El lote reanudado informa "bloques confirmados 1–6, en curso 7". |
| RF-FAC-054 | Conservar en cada comprobante el tenant, titular, asociado, cuenta, servicio(s), contrato(s), lote, versión del universo y referencia al resultado de cálculo. | BASE §10, §44.4 | Núcleo | O4 | Informado | Desde FAC-DEMO-001 se llega al cálculo ARS 3.000 + 20 × ARS 500. |
| RF-FAC-055 | Ofrecer el **servicio de emisión individual** (fuera de lote) para refacturación, factura manual, altas y bajas, venta de prepaga, ventas (M11), intereses (M08) e inmediata/in situ, con las mismas validaciones, numeración e idempotencia. | BASE §10 "individuales o masivos"; RN-02 §2.4 prepaga | Núcleo | O4 | Informado | M08 emite una ND de intereses a través del servicio y obtiene número, PDF y estado fiscal. |
| RF-FAC-056 | Registrar al cierre del lote, si `PRM-FAC-061` lo indica, el evento para capitalizar sobre lo facturado (M17). | RN-02 §2.9; V2 2736, 2855; DEC-019; DEC-061 | Estándar | O10 | Adoptado | El capital se factura como renglón identificado en la factura del servicio, con auxiliar separado y leyenda (DEC-061); el mínimo de capital entra en O5 (DEC-019). Con el parámetro activo, M17 recibe `fac.billingRun.closed` con totales por rubro de capital. |

### 5.7 Estado fiscal y autorización (dependencia de M06)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-FAC-057 | Mantener el **estado fiscal** de cada comprobante separado del bloqueo de cobro y del estado comercial. | RN-02 §6, §15.9 | Núcleo | O4 | Adoptado | Un comprobante puede estar "autorizado" y "bloqueado para cobro" a la vez sin ambigüedad. |
| RF-FAC-058 | Encolar la autorización en M06 y consumir su resultado; ofrecer un tablero de pendientes por lote, punto de venta y antigüedad que reemplaza la alerta manual "Hay facturas electrónicas pendientes de autorizar". | DFA M8 mejoras; REL §1; INV `frmFacturacionElectronica` (M06) | Núcleo | O4 | Adoptado | El tablero muestra pendientes con más de 1 día en rojo; la alerta al iniciar sesión deja de ser necesaria. |
| RF-FAC-059 | Ante respuesta incierta, pedir a M06 la consulta del comprobante o del último autorizado antes de reintentar; no reemitir ni renumerar a ciegas. | BASE §10 CU-10, §69, §97.2; ESC-04 | Núcleo | O4 | Informado | Un corte de red tras el envío deja el comprobante "incierto"; la conciliación lo resuelve como autorizado sin segunda solicitud. |
| RF-FAC-060 | Pausar el lote ante un problema fiscal global informado por M06 (credencial vencida, servicio no disponible, punto de venta inhabilitado). | BASE §69 | Núcleo | O4 | Informado | `fis.authorization.globalFailure` pausa todos los lotes del tenant en fase de autorización. |
| RF-FAC-061 | Reflejar rechazos y observaciones: un rechazo abre excepción "rechazo fiscal" con el código de ARCA, devuelve el comprobante a borrador con su número liberado y devuelve a la cola, para renumerarlos, los posteriores del mismo numerador sin CAE (RN-FAC-164; DEC-107); una observación se registra en el comprobante emitido y no habilita reemitir. | BASE §69 [LOT-F3]; DEC-107 | Núcleo | O4 | Informado | El resumen distingue "emitidos con observación", "devueltos a borrador" y "en cola para renumerar". |
| RF-FAC-062 | Marcar comprobantes emitidos bajo CAEA (contingencia o lotes grandes) y seguir su informe posterior que realiza M06. Un comprobante CAEA observado o rechazado al informarlo no se renumera ni vuelve a borrador porque ya pudo entregarse: se corrige el informe o se emite nota de crédito según la norma (RN-FAC-164 punto 9; DEC-107; [VERIFICAR] con el contador). | BASE §97.2; RN-02 §4.4; DEC-107 | Estándar | O4 | Adoptado | El tablero muestra "CAEA sin informar" con su vencimiento y "CAEA rechazado al informar" con su acción pendiente. |
| RF-FAC-063 | Distribuir, imprimir, publicar al socio y habilitar la publicación de deuda ante entes de cobro solo de comprobantes con CAE, CAEA vigente asignado o CESP, o que no requieren autorización (RN-FAC-164 punto 7; DEC-107). | DFA M8 mejoras (orden emitir → autorizar → distribuir); DEC-107 | Núcleo | O4 | A validar (PA-FAC-03); DEC-107 lo fija para impresión, envío y entes | Un comprobante pendiente de CAE no se envía por email, no tiene PDF imprimible y M07 no publica su deuda a ningún ente. |

### 5.8 Modalidad separada y agrupada; grupos de facturación

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-FAC-064 | Configurar la modalidad por defecto del tenant (separada o agrupada) y excepciones por servicio, cuenta o titular, con vigencia desde un período. | BASE §103 FAC-005; §44 FAC-003; DEC-034 | Núcleo | O4 | Informado | Por defecto, separada por servicio; agrupada solo si se activa por grupo (DEC-034). Dos tenants con modalidades distintas no se afectan; el cambio rige desde un período sin alterar emitidos. |
| RF-FAC-065 | Modalidad separada: un comprobante por servicio y contrato que identifica el servicio; servicios distintos conservan documentos independientes. | BASE §44 FAC-002, §10 | Núcleo | O4 | Informado | Ana recibe FAC-AG-DEMO-002 (agua) y FAC-INT-DEMO-002 (internet). |
| RF-FAC-066 | Grupo de facturación con titular, servicios y contratos incluidos, domicilio postal y de reparto, punto de venta o talonario propio o general, periodicidad común, trama de vencimientos, canal de entrega, tipo de factura propio y opción "forzar nota de débito". | BASE §103 FAC-006; RN-02 §1, §2.6.4; CAT `GRUPOS_FACTURA` | Núcleo | O4 | Informado | El grupo se arma, modifica y desarma con vigencia y auditoría; desarmarlo no reabre períodos cerrados. |
| RF-FAC-067 | Bloquear al configurar un grupo las combinaciones inválidas: servicios de distintos titulares, CUIT/DNI o tenants; servicio que por norma, regulador o regla propia exige documento independiente; prestación de otra razón social; incompatibilidad de punto de venta o tipo de comprobante; explicar el motivo. **Compatibilidad de clase de comprobante (DEC-093):** el grupo puede reunir servicios que liquidan como servicio público (LQSP) y servicios de factura común (internet, telefonía, TV, sepelio y similares), pero el agrupador nunca los mezcla en un mismo comprobante: emite un documento por clase (RN-FAC-040) y la pantalla del grupo lo advierte al configurarlo; un tipo propio del grupo (`voucherTypeOverrideId`) solo se aplica a los servicios de su misma clase, y se bloquea con motivo un tipo propio que obligaría a mezclar clases; dentro de la LQSP solo entran, además de los conceptos tarifarios del servicio público, los conceptos que el tenant declaró accesorios en M06 (`conceptFiscalCases.publicServiceAccessory`; lista pendiente del contador, PA-FIS-23). | BASE §103.3; DEC-093 | Núcleo | O4 | Informado | Agregar un servicio marcado "documento independiente" al grupo falla con el motivo. Un grupo con energía (LQSP) e internet emite una LQSP B con energía y la tasa declarada accesoria, y una factura B con internet; ningún comprobante mezcla las dos clases (DEC-093). |
| RF-FAC-068 | Registrar la validación fiscal de cada combinación (contador del tenant) antes de habilitar el grupo para emitir. | BASE §103.3, §106 | Núcleo | O4 | Informado | Un grupo sin validación fiscal registrada queda "borrador" y sus servicios se emiten separados. |
| RF-FAC-069 | En cada comprobante agrupado, cada renglón identifica servicio, contrato o suministro, período, lecturas, conceptos y tributos propios, con subtotal por servicio. | BASE §103 FAC-007 | Núcleo | O4 | Informado | Desde el comprobante se reconstruye el cálculo de cada servicio igual que si se hubiera emitido solo. |
| RF-FAC-070 | Publicar una obligación por servicio dentro del comprobante agrupado para que M07 aplique la regla de imputación del tenant. | BASE §103 FAC-008; AGR-011 | Núcleo | O4 | Informado | La suma de las obligaciones por servicio es igual al total del comprobante. |
| RF-FAC-071 | Las NC, ND y anulaciones de un comprobante agrupado referencian el original e indican el servicio afectado; corregir un servicio no altera los renglones de los demás. | BASE §103 FAC-009 | Núcleo | O4 | Informado | Una NC por internet en el comprobante de CU-103 no modifica energía ni la tasa. |
| RF-FAC-072 | Resolver servicios de periodicidad distinta dentro de un grupo con una regla configurable (emitir lo vencido en el próximo comprobante del grupo, emitir aparte o prorratear) e informar en el lote qué servicios quedaron fuera del grupo y por qué. | BASE §103 FAC-010; AGR-017; §106 | Núcleo | O4 | A validar (PA-FAC-02) | El lote lista "Sepelio (trimestral) fuera del grupo: no vence en este período". |
| RF-FAC-073 | Mostrar en las vistas del socio, la landing y las APIs el comprobante agrupado con apertura por servicio: cuánto corresponde y qué se pagó de cada uno (dato de pagos provisto por M07). | BASE §103 FAC-011 | Núcleo | O4 | Informado | El socio ve energía ARS 28.000, internet ARS 15.000 y tasa ARS 1.200 por separado. |
| RF-FAC-074 | Cambiar la modalidad o el grupo no reemite ni fusiona comprobantes históricos; la regla de transición rige desde el período siguiente. | BASE §44.6, §103 FAC-005 | Núcleo | O4 | Informado | Pasar de separada a agrupada en diciembre no modifica las facturas de noviembre. |
| RF-FAC-075 | Facturar varios suministros o inmuebles del mismo servicio de un titular según la regla del tenant. | BASE §10, §44.3, §44.8 | Núcleo | O4 | A validar (PA-FAC-07) | Un titular con dos medidores de agua recibe el resultado que indique la regla vigente, sin sumar consumos entre medidores. |
| RF-FAC-076 | Proveer a M07 los datos del resumen de cuenta (comprobantes incluidos, importes y servicio) en ambas modalidades; el resumen no es un comprobante ni una deuda adicional. | BASE §44 FAC-004, §44.4, §103.1 | Núcleo | O5 | Informado | El resumen RES-DEMO-001 muestra ARS 38.000 y no genera una tercera obligación. |

### 5.9 Tipos de comprobante, letras, puntos de venta y numeración

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-FAC-077 | Catálogo de tipos de comprobante: código interno, código ARCA, descripción y abreviatura, **letra como campo explícito** (A, B, C, M, E, sin letra), clase (factura, ND, NC, liquidación de servicios públicos, ticket, interno, CVLP, recibo de factura contado), sentido débito/crédito, comprobante que lo revierte, comprobante con el que comparte numeración, numeración manual, interno, restricción por condición fiscal, cantidad de copias y leyendas por copia, operación por defecto y familia. | RN-02 §1, §3.1; CAT `COMPROB`, `TIP_COMP`; DFA M8 | Núcleo | O4 | Adoptado | La factura B, la ND B y la NC B existen con letra "B" y su par de reversión configurado. |
| RF-FAC-078 | Matriz de resolución por condición fiscal del receptor: comprobante por defecto de factura, ND y NC; factura y crédito de servicio público; versiones MiPyME (FCE) con umbral; ticket. | RN-02 §3.2; CAT `SITIVA` (M06) | Núcleo | O4 | Adoptado | Para Consumidor Final la matriz resuelve Factura B, ND B, NC B y LSP B. |
| RF-FAC-079 | Permitir un comprobante propio por servicio para débito y para crédito. | RN-02 §3.2 `COM_FAC`, `COM_CRE` | Estándar | O4 | Adoptado | Un servicio con comprobante propio lo usa cuando todos los servicios del comprobante coinciden. |
| RF-FAC-080 | Puntos de venta con código, descripción, tipo (electrónico CAE, CAEA, CAI/preimpreso, manual, controlador fiscal, interno), sucursal, servicios y canales habilitados, domicilio, estado y vigencia; punto de venta 0 solo para comprobantes internos si `PRM-FAC-040` lo permite. | RN-02 §4, §4.2; CAT `PTOVENTA`; BASE §97.2 | Núcleo | O4 | Adoptado | Un comprobante fiscal con punto de venta 0 es rechazado en validación. |
| RF-FAC-081 | Numeradores por (tipo de numeración, punto de venta) con último número asignado, último número autorizado por ARCA (referencia para renumerar tras un rechazo, RN-FAC-164; DEC-107), tipo de autorización (CAE, CAEA, CAI, CESP; DEC-104, antes sin CESP; `none` para los recibos de M07 y los comprobantes internos, que no pasan por ARCA) y datos del CAI con vencimiento; se crean al habilitar la combinación por acción explícita, nunca implícitamente con un "punto de venta automático". | RN-02 §4.1, §4.4; CAT `COMPPOS` | Núcleo | O4 | Adoptado | Emitir con una combinación sin numerador produce excepción de configuración, no un numerador nuevo. |
| RF-FAC-082 | Talonario propio por grupo de facturación o numeración general. | BASE §103 FAC-006 (GSP) | Estándar | O4 | Informado | Un grupo con talonario propio numera independiente del general. |
| RF-FAC-083 | Numeración manual forzada solo para un comprobante individual, con permiso `fac.numeracion.forzar`, habilitación `PRM-FAC-041` y verificación de que el número no exista. | RN-02 §2.1, §4.3; V2 376 | Estándar | O4 | Adoptado | Forzar un número ya existente devuelve error; en un lote no se permite. |
| RF-FAC-084 | Controlar correlatividad y huecos por numerador; reparar un numerador desfasado solo con propuesta, aprobación y auditoría (no auto-reparación silenciosa). Los números liberados por un rechazo de ARCA y reasignados al renumerar (RN-FAC-164; DEC-107) no cuentan como huecos: el control se hace sobre los números definitivos y el historial de asignaciones queda auditado. | RN-02 §4.1 `ValidarNumcomEnFacturas`; DEC-107 | Núcleo | O4 | Adoptado | El reporte de correlatividad muestra 0 huecos tras emitir 10.000 comprobantes, aun con 2 rechazos y 30 renumeraciones en el lote. |
| RF-FAC-085 | Antes de habilitar un numerador electrónico o reanudar tras una incidencia, sincronizar con el último comprobante autorizado en ARCA (servicio de M06). | BASE §97.2; INV `frmConsultaNumComAFIP` | Núcleo | O4 | Informado | Si ARCA informa 1.100 y el numerador local 1.098, la emisión se bloquea hasta conciliar. |

### 5.10 Vencimientos y tramas

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-FAC-086 | Soportar de 1 a 4 vencimientos por comprobante **por defecto**, cada uno con fecha, importe total y recargo, más el próximo vencimiento impreso. El tope es un parámetro del tenant, por tipo de comprobante o por servicio (PRM-FAC-163); subirlo por encima de 4 exige que los formatos de código de barras (RF-FAC-140 a RF-FAC-147) y los layouts de los entes de cobro habilitados (RF-COB-099 de M07) admitan esa cantidad, y si un formato o ente no la admite, ante él se publican solo los primeros vencimientos que soporta (RN-FAC-163; DEC-106). *Reemplazado (10-11-2026, DEC-106): "Soportar de 1 a 4 vencimientos por comprobante, cada uno con fecha, importe total y recargo, más el próximo vencimiento impreso."* | RN-02 §1, §5; DFA M8; REL §4; BASE §97.3; DEC-106 | Núcleo | O4 | Informado | FAC-DEMO-001 muestra vencimientos 15/11, 25/11 y 05/12/2026 con sus importes. Con PRM-FAC-163 = 6 para un servicio y un ente cuyo layout admite 3, el comprobante muestra 6 vencimientos y ante ese ente se publican los vencimientos 1 a 3 (escenario 25). |
| RF-FAC-087 | Configurar tramas por servicio, ciclo y tipo de factura: cantidad de vencimientos, separación entre fechas y recargo de cada uno, con los modos fijo en pesos, porcentaje fijo capitalizado, porcentaje diario, trama por rango de importe y trama por vencimiento; IVA del recargo según el concepto de interés y la condición fiscal del receptor (calculado por M06). | RN-02 §5.2; BASE §97.3; CAT/DFA `TRAMASREC` | Núcleo | O4 | Informado | Con trama "fijo en pesos" de ARS 100: Vto2 = T + 100, Vto3 = T + 200, Vto4 = T + 300. |
| RF-FAC-088 | Validar vencimientos con RN-FAC-012 a RN-FAC-015 y RN-FAC-058. | RN-02 §2.2, §3.3 | Núcleo | O4 | Adoptado | Un Vto3 a 75 días de Vto2 con total mayor a 60 días es rechazado. |
| RF-FAC-089 | Aplicar la regla de consistencia: si el total de un vencimiento posterior resulta menor que el total del primero, se igualan los posteriores al primero. | RN-02 §5.2 | Núcleo | O4 | Adoptado | Un recargo negativo por error de trama no reduce el importe. |
| RF-FAC-090 | Exhibir el importe correspondiente a cada vencimiento en el comprobante, en la app y en los códigos de pago. | BASE §97.3 | Núcleo | O4 | Informado | El código de pago codifica los importes del 1.º y 2.º vencimiento iguales a los impresos. |
| RF-FAC-091 | No precargar tasas ni montos de recargo productivos; la trama demo se identifica como demostración. | BASE §97.3 control; §39.1 | Núcleo | O4 | Informado | Un tenant nuevo no tiene trama activa hasta que la configura y aprueba. |
| RF-FAC-092 | En comprobantes individuales, permitir emitir N comprobantes consecutivos sumando un mes al primer vencimiento de cada uno. | RN-02 §5.1 `Guardar(cantidad)` | Estándar | O4 | Adoptado | Emitir 3 cuotas manuales crea vencimientos en tres meses consecutivos. |

### 5.11 Bloqueo de comprobantes

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-FAC-093 | Mantener el catálogo de causas de bloqueo de cobro. | RN-02 §6; DFA M8; CAT `CAUBLOQ`; INV `abm_Caubloq` | Núcleo | O4 | Adoptado | Una causa en uso no se puede eliminar, solo inactivar. |
| RF-FAC-094 | Bloquear y desbloquear comprobantes impagos en forma individual y masiva con filtros (cuenta, titular, tipo, fecha de emisión, vencimiento), registrando historial con fecha, causa, usuario y motivo. | RN-02 §6; CAT `HISBLOQ`; INV `frmDesbloquearComprobanteCuenta` | Núcleo | O5 | Adoptado | Desbloquear un comprobante deja una entrada de historial con causa nula. |
| RF-FAC-095 | Bloquear o desbloquear con cobro de intereses: en la misma operación se pide a M08 la emisión del comprobante de intereses (porcentaje y concepto configurables). | RN-02 §6 `Asignar_Bloqueo_ConIntereses`; V2 2770, 2771, 2984 | Estándar | O6 | Adoptado | Desbloquear con intereses emite el comprobante de intereses y el desbloqueo en una única operación idempotente. |
| RF-FAC-096 | Propagar automáticamente, al emitir un lote, el bloqueo de cobro a los comprobantes nuevos de cuentas que ya tienen comprobantes bloqueados, con la causa de menor código. | RN-02 §2.9, §6; V2 2769 | Estándar | O5 | A validar (PA-FAC-15) | Con la política activa, la factura nueva de una cuenta con bloqueo nace bloqueada. |
| RF-FAC-097 | Publicar los cambios de bloqueo para que M07 impida el cobro en caja y canales. | RN-02 §6 (regla de caja en RN-05) | Núcleo | O5 | Adoptado | Un comprobante bloqueado es rechazado en caja con la causa visible. |

### 5.12 Anulación, notas de crédito y débito, reversión

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-FAC-098 | Anular un comprobante **no autorizado fiscalmente y sin pagos ni financiaciones** con baja lógica (`commercialStatus = annulled`), motivo, aprobación y copia de auditoría; nunca se elimina físicamente. | RN-02 §7.1, §7.2, §15.10; DFA M8 mejoras; Guía §5 | Núcleo | O4 | Adoptado | El comprobante anulado sigue consultable con su contenido original y la marca de anulación. |
| RF-FAC-099 | Revertir un comprobante autorizado o con pagos emitiendo una NC (o ND, si el original es crédito) asociada, con relación de anulación y marca para informar el comprobante asociado a ARCA. | RN-02 §7.2, §7.4, §7.5; BASE §97.2 | Núcleo | O4 | Adoptado | La NC queda vinculada con `relationType = reversal` y `reportToTaxAuthority = true`. |
| RF-FAC-100 | Aplicar todas las validaciones de anulación y reversión (RN-FAC-073 a RN-FAC-083). | RN-02 §7.1 | Núcleo | O4 | Adoptado | Una factura ya revertida no puede revertirse otra vez. |
| RF-FAC-101 | Liberar al anular o revertir lo que el comprobante consumió: consumos, cargos pendientes, cuotas, llamadas e internacionales, presupuestos, anticipos aplicados, franqueo, redondeo acumulado, registro de capital, conceptos de terceros, talones y notificaciones, y retroceder el período facturado. | RN-02 §7.2, §7.3 | Núcleo | O4 | Adoptado | Tras anular, el consumo vuelve a "aprobado sin facturar" y el período queda disponible. |
| RF-FAC-102 | Ofrecer opciones de reversión: revertir consumos (consumo espejo negativo), permitir volver a facturar (copia del consumo sin facturar), liberar créditos y débitos, revertir stock de productos (M13), fechas de vencimiento de la NC. | RN-02 §7.4 `OpcionesCreditosXComprobantes` | Núcleo | O4 | Adoptado | Con "permitir volver a facturar", el próximo lote vuelve a tomar el consumo. |
| RF-FAC-103 | Emitir **créditos por comprobantes** en masa por filtros o archivo importado, excluyendo los que tengan pagos (con lista de excluidos) y procesando en bloques idempotentes. | RN-02 §7.1, §7.4 `CreditosporComprobantes`; INV `frmCreditosXComprobantes` | Núcleo | O4 | Adoptado | 500 facturas seleccionadas con 3 pagadas generan 497 NC y la lista de 3 excluidas. |
| RF-FAC-104 | Emitir NC o ND parciales por servicio, renglón o importe, con causa y documentación; la diferencia de una corrección posterior a la emisión se simula y se emite como ND o NC por la diferencia, sin editar el original. | BASE §103 FAC-009; ESC-02; AGR-013 | Núcleo | O4 | Adoptado | ESC-02: la corrección de ARS 12.000 a ARS 15.000 genera una ND de ARS 3.000 vinculada. |
| RF-FAC-105 | Relacionar manualmente comprobantes de una misma cuenta de los últimos N días (no internos ni anulados), con las marcas "anulación" e "informar CUIT". | RN-02 §7.5; CAT `RELACION_COMP`; INV `frmComprobantesRelaciones`, `abm_Electronica_ComproRelacion` | Estándar | O4 | Adoptado | Una NC manual queda vinculada a su factura y M06 la informa como asociada. |
| RF-FAC-106 | Distinguir el crédito comercial de la devolución de dinero: la NC no implica reintegro; el reintegro lo gestiona M07 con su expediente. | AGR-013 | Núcleo | O5 | Adoptado | Emitir una NC de ARS 2.000 no crea un pago saliente. |
| RF-FAC-107 | Anular comprobantes de venta (M11) con el mismo motor y reglas. | INV `frmAnulacionComprobantesVenta` | Estándar | O8 | Adoptado | Una factura de venta de productos anulada libera su stock según la opción elegida. |

### 5.13 Recategorización, retroactivos y modificación masiva

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-FAC-108 | Recategorización masiva en tres familias de modo: energía por porcentaje de ahorro, energía por consumo total, gas por últimos 6/12 períodos (con consumo corregido opcional y proporcional a 365 días) y gas por cambio de cuadro (beneficio por ahorro). | RN-02 §8; INV `frmRecategorizacion` | Estándar | O7 | Adoptado | La simulación muestra categoría actual, propuesta y fundamento por servicio. |
| RF-FAC-109 | Filtros de recategorización: servicio, cuenta, grupo, zonas, categorías, solo prepagas, recategorización previa (nunca recategorizados o con menos de 6 períodos); vista previa, confirmación con aprobación, guarda la categoría anterior, actualiza la de consumos aún no facturados y deja nota en la cuenta. La categoría del contrato se cambia por el servicio de M02. | RN-02 §8 `Confirmar_Recategorizacion` | Estándar | O7 | Adoptado | Tras confirmar, el contrato tiene la categoría nueva con vigencia y la nota "Recategorizado por ahorro 22 %". |
| RF-FAC-110 | Corregir consumos de gas sin facturar con un factor base, excluyendo consumos divididos automáticamente (ejecuta M03 a pedido de la recategorización). | RN-02 §8 `CorregirConsumos`; INV `frmCorregirConsumoGas` | Extensión | O7 | Adoptado | Los consumos corregidos quedan con su versión anterior consultable. |
| RF-FAC-111 | Retroactivos sobre consumos facturados (proceso 0) y sobre conceptos facturados (proceso 1), con cálculo por cantidad, tramo, importe fijo, porcentaje o proporcional por días, interés opcional con signo explícito, validaciones y control de duplicados; generan **ítems facturables** para la próxima facturación, no comprobantes. | RN-02 §9, §15.15; INV `frmRetroactivos` | Estándar | O7 | Adoptado | Un retroactivo repetido con los mismos parámetros para la misma cuenta es rechazado. |
| RF-FAC-112 | Modificación masiva de comprobantes emitidos: todos los vencimientos, uno de ellos, fecha de emisión, próximo vencimiento o importes de los vencimientos 2 al último (2 a 4 con el tope por defecto; DEC-106), con filtros, vista previa, aprobación, exclusiones por cierre y auditoría por comprobante. | RN-02 §10.1; INV `frmModificaFactura` | Estándar | O4 | Adoptado | La auditoría de cada comprobante muestra valor anterior y nuevo. |
| RF-FAC-113 | Limitar la modificación masiva de comprobantes autorizados fiscalmente a datos no fiscales (vencimientos 2 al último e importes con recargo y próximo vencimiento; DEC-106, antes "vencimientos 2 a 4"). | RN-02 §10.1, §15.16 | Núcleo | O4 | A validar (PA-FAC-10) | Intentar cambiar la fecha de emisión de un autorizado lo excluye con motivo. |
| RF-FAC-114 | Cambiar la clasificación comercial (tipo de factura) de un comprobante sin afectar sus datos fiscales, con auditoría. | INV `frmCambiarTipoFac` | Extensión | O4 | Adoptado | El cambio queda en historial y no reenvía nada a ARCA. |
| RF-FAC-115 | Proveer el motor genérico de operaciones masivas (borrador, vista previa, aprobación, aplicación por bloques, resultado por ítem) para que M11 implemente la modificación de cuotas pendientes (importe por porcentaje, costo del producto, desplazar vencimientos, cambio de IVA, tipo de cuota, filtro de prepagas). | RN-02 §10.2; INV `frmModificaDatosCuotas`, `frmModificarTipoCuotas` | Estándar | O8 | Adoptado | M11 ejecuta una operación "desplazar vencimientos 1 mes" con vista previa y resultado por cuota. |

### 5.14 Facturación de cuotas y de terceros; ítems facturables

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-FAC-116 | Mantener la cola de **ítems facturables** (cargos manuales, retroactivos, importaciones de terceros, cuotas e intereses diferidos expuestos por M11/M08, cargos de técnica) con cuenta, contrato/servicio, concepto, cantidad, precio, período o sin período, grupo destino, origen, estado y comprobante que lo consumió. | RN-02 §2.3, §9, §11; CAT `PRCAGAS` (CAT §3), INV `abm_Prcagas` | Núcleo | O4 | Adoptado | Un cargo pendiente sin período se toma en el primer lote del servicio y queda "facturado" con el id del comprobante. |
| RF-FAC-117 | Incluir cuotas en el lote por rango de vencimientos (hasta una fecha y no anteriores a 10 meses antes de la fecha desde) o por lista explícita, con intereses diferidos opcionales y filtro por tipo de cuota; agrupar cuotas asociadas a un servicio con ese servicio y las de un tipo con grupo propio en su grupo. | RN-02 §2.3 `GetDeudaFacturar`, §2.5 `FacturarCuotas`, §11.1; INV `frmComprobantesFactura_Cuota` | Estándar | O4 | Adoptado | Una cuota de la instalación financiada de internet sale en el bloque de internet. |
| RF-FAC-118 | Por defecto, las ventas y sus cuotas se facturan en documentos propios y se presentan juntas en el resumen; la inclusión en la factura del servicio solo se habilita para conceptos vinculados a ese servicio y con validación fiscal. | BASE MER-010, §52 | Núcleo | O4 | Informado | Una cuota de un electrodoméstico no puede asignarse al grupo de energía. |
| RF-FAC-119 | No emitir comprobantes que solo contengan cuotas cuando la cuenta no tiene ítems de servicio, si `PRM-FAC-062` está activo. | RN-02 §2.5; V2 2443 | Estándar | O4 | Adoptado | Con el parámetro activo, una cuenta con cuotas y sin servicios no genera comprobante en el lote. |
| RF-FAC-120 | Exhibir en un bloque separado los conceptos por cuenta y orden de terceros, solo si M06 confirma convenio vigente con fundamento; sin convenio el ítem es bloqueado como excepción. | BASE §97.4; REL §4 (tasas) | Núcleo | O4 | Informado | Un ítem "Tasa de bomberos" sin convenio vigente genera la excepción "Concepto de terceros sin convenio". |
| RF-FAC-121 | Importaciones de terceros con formato canónico (cuenta o identificador, concepto, cantidad, precio, descripción, período) y adaptadores por origen: EMA (Excel), SAM (Excel + ancho fijo, variante Tasa Verde), EME (DBF de emergencias médicas), CT1 (ancho fijo por socio), FAR (farmacia), IAL (alumbrado público por suministro), CEL (celulares por línea), facturas de gas (Excel), PR1 (telefonía revendida); validación previa con errores; destino elegible: ítem facturable, cuota de venta (M11) o comprobante directo. | RN-02 §11.2, §11.3, §15.17 | Estándar | O4 | Adoptado | Un archivo IAL con un suministro inexistente se rechaza en la fila con "CUENTA INEXISTENTE". |
| RF-FAC-122 | Las importaciones no consumen números de comprobante salvo al emitir efectivamente. | RN-02 §16.1 (bug de número sin usar) | Núcleo | O4 | Adoptado | Importar sin emitir no altera ningún numerador. |
| RF-FAC-123 | Asociar datos de otro prestador para imprimir en el comprobante (por ejemplo, agua de otra empresa) por zona, sector y recorrido. | RN-02 §11.4; V2 2081; CAT `FAC_EXTRAS`, `FAC_EXTRAS_ITEMS` | Extensión | O7 | Adoptado | La factura de una cuenta del recorrido 12 imprime el bloque del otro prestador. |
| RF-FAC-124 | Facturar servicios de terceros revendidos de telefonía móvil (formato PR1: servicio, proporcional, cargo, abono, reintegro, consumo) informando líneas no encontradas, duplicadas y servicios activos no importados. | RN-02 §11.3 | Extensión | O10 | Adoptado | El reporte de importación lista líneas no encontradas. |
| RF-FAC-125 | Emitir CVLP (cuenta de venta y líquido producto) de servicios de terceros con comisiones (hasta tres), filtrable por período, fechas o número de lote, con ND opcional y exclusión opcional de percepciones. | INV `frmCVLP`, `frmCVLP_Finalizar`; V2 19, 70, 71, 76, 78, 141, 297, 353 | Extensión | O10 | Adoptado | Un CVLP con comisión de 5 % muestra bruto, comisión y líquido. |
| RF-FAC-176 | Clases de ítem facturable "depósito en garantía", "aporte al fondo de subsidio" y "derecho de sepultura" (adquisición y mantenimiento) en `billableItems.itemClass` y en los renglones, con bloque de impresión, clase fiscal de M06 y rol contable propios (RN-FAC-156). | HUECO-OTR-04 (RN-CON-123); HUECO-SEP-03 (RN-CON-122); HUECO-CEM-04 (RN-CON-124); RF-FIS-162; RF-FIS-165 | Estándar | O10 | Adoptado | Un depósito de ARS 50.000 por préstamo ortopédico (ficticio) sale en el bloque "Depósito en garantía (reintegrable)" sin IVA ni percepciones y su obligación llega a M07 con `itemClass = guaranteeDeposit`; la cuota 3/24 del derecho de sepultura y el mantenimiento anual salen como renglones de clase `burialRightAcquisition` y `burialRightMaintenance` con el IVA que indique M06. |
| RF-FAC-177 | Emitir por entidad jurídica (DEC-064, DEC-087): resolver `legalEntityId` por contrato o, si está vacío, por `tenantServices.legalEntityId` (M02), separar casos, comprobantes, talones y numeradores por entidad, y elegir punto de venta y CUIT emisor de esa entidad (RN-FAC-157). | DEC-064; DEC-087; T05 RN-DAT-008 | Núcleo | O4 | Adoptado | Un titular con ELE de la entidad LE-01 e Internet de LE-02 en modalidad agrupada recibe dos comprobantes, uno por entidad, cada uno con su punto de venta y numeración; un talón nunca mezcla comprobantes de LE-01 y LE-02. |
| RF-FAC-178 | Consumir `cat.contract.meteringRegimeChanged` (EVT-CAT-28) cuando afecta la facturación del período: volver a prefacturar los casos afectados de lotes preparados y registrar excepción si falta la lectura de retiro (RN-FAC-158). | HUE-AG-03; RN-CAT-078; RN-TAR-250 | Estándar | O7 | Adoptado | Un cambio a `metered` con fecha efectiva 16/11/2026 sobre un lote AG de noviembre preparado marca el caso como afectado; al reprefacturar, el comprobante muestra cuota fija y consumo en dos renglones. |
| RF-FAC-179 | **Numeración de recibos de M07 por entidad jurídica** (DEC-064, DEC-087; CTR-DAT-74): servicio interno `fac.service.nextNumber` que asigna el siguiente número de `numberSequences` para el tipo de recibo y el punto de venta de la entidad del recibo, sin bloqueos globales y serializado por numerador (RF-COB-087); una operación de caja con deuda de dos entidades pide un número por entidad (RF-COB-193). | DEC-064; DEC-087; RF-COB-087; RF-COB-193; T05 CTR-DAT-74 | Núcleo | O4 | Adoptado | Dos cajas concurrentes de LE-01 y una de LE-02 obtienen números correlativos sin repetidos por entidad; un pedido con punto de venta de LE-01 y `legalEntityId` LE-02 se rechaza con `POS_CONFLICT` (RN-FAC-161). |

### 5.15 Factura manual, replicar y refacturación puntual

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-FAC-126 | Editor de factura manual: cabecera (tipo de comprobante, punto de venta, número si es manual, letra, fecha, cuenta y domicilio, titular, vendedor, tipo de factura, depósito, período), deuda vencida del titular visible, opción "registrar pago"; renglones de servicio (con consumo y categoría), producto, cuota, impuesto, anticipo, anticipo de producto y descuento; totales (subneto, descuento %, neto, percepciones, IVA, otros impuestos, total); vencimientos hasta el tope del tipo de comprobante y servicio (PRM-FAC-163, por defecto 4; DEC-106; antes "hasta 4 vencimientos"); moneda y cotización; observaciones. Se guarda como borrador en `invoiceDrafts` hasta emitir. | DFA M8 detalle; REL §4; INV `frmComprobantesFactura` y modales `_Servicio`, `_Cuota`, `_Impuesto`, `_Anticipo` | Núcleo | O4 | Adoptado | Un borrador puede guardarse incompleto; al emitir se valida y numera. |
| RF-FAC-127 | Validar la factura manual con todas las reglas RN-FAC-045 y RN-FAC-058 a RN-FAC-062. | RN-02 §3.3 | Núcleo | O4 | Adoptado | Un Vto1 a más de `PRM-FAC-050` días de hoy es rechazado. |
| RF-FAC-128 | Replicar un comprobante como borrador nuevo copiando cabecera y renglones (todos los ítems si `PRM-FAC-051` lo permite), con fechas actuales. | DFA M8; REL §4; INV `frmComprobantesFactura_Replicar`; V2 2754 | Estándar | O4 | Adoptado | El borrador replicado no comparte número ni estado con el original. |
| RF-FAC-129 | Refacturar un servicio puntual sin reprocesar el lote: anula o revierte el original (según su estado), libera el período, recalcula con M04 y emite con secuencia nueva vinculada, en una operación auditada. | DFA M8 mejoras; RN-02 §2.3 secuencia, §16.5 | Núcleo | O4 | Adoptado | La refacturación de FAC-AG-DEMO-002 deja NC + nueva factura vinculadas y el lote original intacto. |
| RF-FAC-130 | Registrar el pago al emitir una factura de contado delegando el cobro a M07. | REL §4 "Registrar Pago" | Estándar | O5 | Adoptado | La factura contado queda emitida y cancelada en una misma operación. |
| RF-FAC-131 | Al cargar un crédito manual, sugerir, obligar o ignorar la relación con el comprobante de origen según `PRM-FAC-052`. | V2 2450 | Estándar | O4 | Adoptado | Con "obligar", una NC manual sin relación no se puede emitir. |
| RF-FAC-132 | Marcar NC no automáticas (cargadas a mano) para su control. | CAT `CREDITOS_NOAUTOMATICOS` | Estándar | O4 | Adoptado | El reporte de NC filtra "no automáticas". |
| RF-FAC-133 | Registrar comprobantes de administración pública con el formato que corresponda. **[VERIFICAR]** su contenido en ProCoop. | INV `frmComprobnatesAdministracionPublicaRAW`; CAT `COMPROBANTES_ADM` | Extensión | O8 | A validar (PA-FAC-17) | Se puede registrar el comprobante administrativo asociado a una factura y período. |

### 5.16 Impresión, diseño, gráficos y PDF

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-FAC-134 | Plantillas de representación por tenant y reglas explícitas de selección por prioridad: forzada por el usuario, CVLP, clasificación comercial, servicio, prepaga, tipo de comprobante, condición fiscal, variantes electrónica / alternativa / talón sumado. | RN-02 §12.1, §15.13; V2 565, 156, 34 | Núcleo | O4 | Adoptado | Para cada comprobante la regla de selección devuelve exactamente una plantilla y la registra. |
| RF-FAC-135 | Contenido de la representación: datos fiscales exigidos (definidos por M06), bloques por servicio con lecturas y consumos, **gráfico de consumo** de los últimos períodos agrupable por grupos de gráfico, historial, mensajes personalizados, domicilio de la cuenta a la fecha de emisión, código de cuenta para redes, CAE y vencimiento, QR fiscal, códigos de pago, deuda vencida, próximo vencimiento, constancia de percepción y CVP, detalle de llamadas opcional, datos de terceros. | RN-02 §12.1; MER-019; CAT `GRUPOS_GRAFICO`; DFA `GRAFTAB`; V2 2157, 2829 | Núcleo | O4 | Adoptado | La factura de agua muestra el gráfico de 12 períodos y el bloque de terceros separado. |
| RF-FAC-136 | Configurar el orden de impresión de los renglones (grupos con descripción, pie y orden). | CAT `ITEMSORD`; DFA "Órdenes de impresión en Facturas" | Estándar | O4 | Adoptado | Cambiar el orden altera la próxima representación, no las ya generadas. |
| RF-FAC-137 | Generar el PDF por job con el QR fiscal, guardarlo en almacenamiento privado con huella SHA-256 y versión de plantilla, servirlo con URL firmada; contraseña opcional para impresión masiva; fuente y calidad de imagen parametrizables. | DFA M8 mejoras (PDF con QR); BASE §97.2; V2 2368, 2369, 2402, 2697 | Núcleo | O4 | Informado | Regenerar el PDF de un comprobante reproduce el mismo contenido; la huella se conserva por versión. |
| RF-FAC-138 | Reimprimir o generar duplicado con marca visible "duplicado"; cargo por reimpresión opcional (`PRM-FAC-053`). | V2 2612, 2319 | Estándar | O4 | Adoptado | La reimpresión queda auditada con usuario y motivo. |
| RF-FAC-139 | Previsualizar plantillas en tamaño escritorio y celular con datos de demostración antes de publicarlas. | CNX §4.2 previews | Estándar | O4 | Adoptado | La publicación exige al menos una previsualización. |

### 5.17 Código de barras y QR

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-FAC-140 | Motor **declarativo** de formatos: lista ordenada de segmentos (constante, convenio, código de empresa, prefijo de documento, identificador interno, tipo/punto de venta/número, importe de un vencimiento en centavos, recargo, días entre vencimientos, fecha en AAMMDD/AAAAMMDD/DDMMAA/juliana AADDD, período, CUIT, CAE, vencimiento del CAE, relleno), con ancho, relleno y alineación; dígitos verificadores con algoritmo y alcance; largo esperado; reglas de generación por tipo de documento y de lectura. Cada formato declara su **capacidad de vencimientos** (`barcodeFormats.dueDateCapacity`: cuántos vencimientos distintos puede codificar, derivada de sus segmentos de importe, recargo y días entre vencimientos y confirmada al publicar), que se usa para validar el tope de PRM-FAC-163 y para codificar solo los primeros vencimientos que admite (RN-FAC-163; DEC-106). | RN-02 §12.3–§12.5, §15.12; FIC 4.3; DEC-106 | Núcleo | O4 | Adoptado | Un formato nuevo se da de alta sin programar y genera el código de una factura demo con el largo esperado. Un formato con segmentos para 2 vencimientos publica `dueDateCapacity = 2`. |
| RF-FAC-141 | Biblioteca de dígitos verificadores: DV1 (ponderadores 1-3-5-7-9, suma/2 módulo 10, aplicable dos veces), DV2 (9-7-1-3, complemento a 10), DV3 (módulo 10 peso 3 en pares), DV4 (módulo 11 pesos decrecientes), DV5 (peso 3 en impares, sin complemento), DV6 (1-3-5-7-9 con complemento a 10), DV7, DV8 (alfanumérico módulo 43), DV9 (pesos 3..9 cíclicos) y CRC16-CCITT. | RN-02 §12.3 | Núcleo | O4 | Adoptado | Pruebas unitarias con vectores conocidos para cada algoritmo. |
| RF-FAC-142 | Precargar como plantillas de plataforma los formatos genéricos documentados: Pago Fácil 42, 46, 46_2, 50 y 50_2; Banco de Córdoba 43, 48, 50, 50_2 y 56; Banco Nación 38; Mutual Independiente 50; Credicoop 47 (solo lectura); AFIP 40; ProCoop 14; SIRO–Banco Roela 56, Roela extendido 59 y SIRO 0448 59; y la variante Arroyito 54 como ejemplo de formato por cooperativa. | RN-02 §12.4, §12.4.1, §12.5; RN-11 §2.2 | Núcleo | O4 | A validar (PA-FAC-08) | Cada plantilla reproduce el código de ProCoop para la misma factura de prueba. |
| RF-FAC-143 | Codificar facturas, notificaciones de deuda (M08), documentos de pago y solicitudes de pasarela, con los prefijos de documento 40 (notificación), 41 (factura), 42 (talón) y 43 (solicitud de pasarela) para compatibilidad con lo impreso antes de la migración. | RN-02 §12.3, §15.12 | Núcleo | O4 | A validar (PA-FAC-09) | Un código migrado con prefijo 41 se decodifica al comprobante correcto. |
| RF-FAC-144 | Validar el largo: si un importe o una cantidad de días excede el ancho del segmento, no truncar; registrar excepción de impresión y aplicar el formato alternativo configurado (por ejemplo SIRO 59 cuando el importe supera ARS 99.999,99 en SIRO 56). | RN-02 §12.4.1 (créditos sin signo, importe que alarga); RN-11 §2.2 | Núcleo | O4 | A validar (PA-FAC-12) | Una factura de ARS 150.000 con SIRO 56 usa el formato extendido o queda en excepción, nunca un código inválido. |
| RF-FAC-145 | Servicio de decodificación para caja y rendiciones (M07): valida largo y DV, identifica documento y vencimiento, y admite modos heredados configurables para códigos migrados (número + sucursal, cuenta + importe). | RN-02 §12.3 `Get_Facturas`; RN-11 §2.3 | Núcleo | O5 | Adoptado | Un código con DV incorrecto devuelve "código de barras inválido". |
| RF-FAC-146 | Generar QR EMVCo de billeteras y pasarelas (Pagos360, SIRO, NaranjaX, Pronto Pago, ProvinciaNet, Helipagos) con datos del comercio y CRC16, solo si no hay débito automático y el vencimiento no pasó; generar links de pago en la impresión masiva (Pagos360 o Mercado Pago). | RN-02 §12.5, §12.6; V2 519, 2759, 2760, 2761, 2773, 2798, 3144, 2621, 2704, 2764 | Estándar | O5 | Adoptado | El QR de una factura vencida no se imprime. |
| RF-FAC-147 | Asignar formatos por tenant y por recaudador o canal, con convenio por formato y por tipo de documento (resuelve el conflicto de convenio de 10 y 11 caracteres de SIRO para factura y talón). | RN-02 §12.3; RN-11 §2.2 | Núcleo | O4 | Adoptado | Factura y talón de LAG salen con su convenio correcto. |
| RF-FAC-148 | Probador de formatos: generar el código de un comprobante, decodificar un código y comparar con el generado por ProCoop durante el paralelo. | FIC 4.3 | Núcleo | O4 | Adoptado | El probador marca diferencias carácter a carácter. |

### 5.18 Talones y documentos de pago

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-FAC-149 | Generar documentos de pago (talones) agrupando comprobantes de la misma cuenta y grupo de talón: suma de los importes de cada vencimiento, del 1 al último (4 con el tope por defecto; DEC-106; antes "suma de los 4 importes") (los créditos restan), vencimientos del primer comprobante del grupo, número propio, historial de versiones. | RN-02 §12.2, §15.14; CAT `TALONFAC`, `TALONFAC_HST`; INV `frmFacturasImpresion.GenerarTalones` | Estándar | O4 | Adoptado | Energía + agua + sepelio de una cuenta salen en un talón con un solo código. |
| RF-FAC-150 | Partir un comprobante en N talones-cuota con vencimientos propios; la última cuota absorbe el redondeo. | RN-02 §12.2 `GenerarCuotasDeFacturas`; INV `frmFacturasImpresion_Cuotas` | Estándar | O4 | Adoptado | ARS 10.000 en 3 cuotas: 3.333,33 + 3.333,33 + 3.333,34. |
| RF-FAC-151 | Cupón de pago único para la modalidad separada: un documento de pago que cancela varias facturas del resumen con la regla de imputación de M07. El cupón lo emite M07 (`paymentCoupons`, CTR-DAT-39); M05 aporta los comprobantes y sus códigos de pago, y un cupón no mezcla entidades jurídicas (DEC-087). | BASE MER-019, §103.6; CTR-DAT-39 | Núcleo | O5 | Informado | Pagar el cupón de ARS 38.000 cancela agua e internet. |
| RF-FAC-152 | Consultar documentos de pago con sus pagos y eliminar uno no pagado si `PRM-FAC-054` lo permite. | INV `frmTalonesSumados`, `frmTalonesSumados_InfoPagos`; V2 2360 | Estándar | O5 | Adoptado | Un talón con pagos no se puede eliminar. |
| RF-FAC-153 | Imprimir la factura simple si el talón tiene un solo comprobante (`PRM-FAC-055`). | V2 2947 | Estándar | O4 | Adoptado | Un talón de una sola factura no genera página de talón adicional. |

### 5.19 Distribución: impresión y reparto, email, WhatsApp, portal

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-FAC-154 | Registrar preferencias de entrega por titular, cuenta o grupo: papel, email, WhatsApp, app/portal (combinables), destinatarios, adhesión a factura digital con fecha y origen. | BASE MER-008; V2 2663 | Núcleo | O4 | Informado | Ana elige email + app; su comprobante no entra en la impresión de papel. |
| RF-FAC-155 | Crear lotes de distribución por lote de emisión o selección manual, por canal, con agrupación del envío por cuenta, por socio o por socio y teléfono, y envío en tandas configurables. | RN-02 §12.1 salidas; V2 404, 461, 2423, 2626, 2635, 2954, 2955, 3051; INV `frmFacturasImpresion`, `frmProgressImpresion` | Núcleo | O4 | Adoptado | Con agrupación por socio, Ana recibe un email con sus dos facturas. |
| RF-FAC-156 | Enviar por email con PDF adjunto o link firmado y por WhatsApp con plantilla oficial del tenant, a través del centro de comunicaciones (T09), con plantilla configurable. | CNX §6.2; BASE MER-016; V2 539, 540 | Núcleo | O4 | Informado | El aviso de factura emitida usa la plantilla `fac.invoice.issued` del tenant. |
| RF-FAC-157 | Publicar el comprobante en el portal y la app al quedar autorizado y notificar por push si el socio lo eligió. | DFA M8 mejoras; BASE §10 | Núcleo | O4 | Informado | El comprobante aparece en "Mis facturas" al recibir `fis.invoice.authorized`. |
| RF-FAC-158 | Registrar el resultado de cada envío (pendiente, enviado, entregado, leído, fallido, rebotado, devuelto en papel), con id del proveedor, clave de idempotencia y reintentos; ante rebote definitivo, derivar a papel según política. | BASE §10 "registrar el resultado de cada envío"; CNX §6.2 | Núcleo | O4 | Informado | Un email rebotado dos veces genera la pieza en el próximo lote de impresión. |
| RF-FAC-159 | Impresión masiva en lote o exportación a imprenta (PDF unificado ordenado y archivo de datos), mensajes personalizados por segmento, imagen intercalada, numeración de piezas postales por zona/sector/recorrido y orden con sub-orden "i/n" por titular para ensobrar. | BASE MER-008; RN-02 §12.2 `AgregarNroPieza`, `AsignarOrden`; V2 2274, 2741, 2511 | Núcleo | O4 | Informado | El PDF de imprenta respeta el orden de la ruta y cada sobre indica "1/2", "2/2". |
| RF-FAC-160 | Rutas y repartidores de distribución con secuencia; planilla de reparto; registro de entrega o devolución por el repartidor desde la PWA de empleado (funciona sin conexión). | BASE MER-008 | Estándar | O4 | Informado | El repartidor marca "devuelto: domicilio inexistente" sin conexión y se sincroniza después. |
| RF-FAC-161 | Empresas postales con importe y franqueo según cantidad de hojas por destinatario y zona; no cobrar franqueo a quien adhirió a factura digital con email válido. | RN-02 §11.1 franqueo; CAT `POSTALES`; INV `frmFranqueoSegunFacturas`; V2 2663 | Extensión | O4 | A validar (PA-FAC-13) | Un socio adherido a email no tiene renglón de franqueo. |
| RF-FAC-162 | Excluir servicios dados de baja al ordenar por zona/sector/recorrido del servicio y separar facturas por titular según cantidad. | V2 2815, 2367 | Estándar | O4 | Adoptado | Un servicio de baja no altera el orden de reparto. |
| RF-FAC-163 | Consulta pública del comprobante sin login (landing) con datos mínimos de identificación, si el tenant la habilita. | V2 60, 61 (CoopOnline); BASE §53 | Estándar | O4 | Adoptado | La consulta sin login muestra solo comprobantes de la cuenta indicada con control anti-enumeración. |

### 5.20 Cierre de ciclo, cierre de módulo, socio y transversales

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-FAC-164 | Cerrar el ciclo con un **acta**: cuadre del universo (seleccionados = emitidos + emitidos con observación + pendientes + excluidos con causa + inciertos + rechazados), totales por servicio y concepto, estado de autorización y distribución, excepciones trasladadas con responsable, aprobadores, firma; PDF del acta inmutable. | AGR-015; BASE §69 | Núcleo | O4 | Adoptado | Un lote de 100 con 98 emitidos y 2 pendientes puede cerrarse con el acta que muestra 2 trasladados; el período no aparenta 100 facturados. |
| RF-FAC-165 | Reabrir un cierre con motivo y aprobación; la reapertura no modifica comprobantes autorizados ni reabre períodos de grupos desarmados. | AGR-015; BASE §103 FAC-006 | Estándar | O4 | Adoptado | Reabrir crea una versión nueva del acta y conserva la anterior. |
| RF-FAC-166 | Mantener la fecha de cierre del módulo de facturación y de ventas que impide emitir, modificar o anular con fecha anterior. | RN-02 §2.2.9, §3.3.8, §7.1, §10.1; V2 67, 2528 | Núcleo | O4 | Adoptado | Una NC con fecha anterior al cierre es rechazada. |
| RF-FAC-167 | Notificar resultados de cada fase del lote y auditar el lote y cada caso. | BASE §69 | Núcleo | O4 | Informado | La auditoría del caso muestra cada transición con actor y hora. |
| RF-FAC-168 | PWA del socio: lista de comprobantes de sus cuentas autorizadas con apertura por servicio, estado de pago (de M07), vencimiento e importe vigente según la fecha, descarga del PDF y acceso a pagar (M07). | BASE §103 FAC-011, §39.1; DFA M8 | Núcleo | O4 | Informado | Un socio no ve comprobantes de otra cuenta aunque comparta domicilio. |
| RF-FAC-169 | Exponer API de consulta de comprobantes y códigos de pago para terceros y BI con token (T10). | BASE §59, §105 solución 8 | Estándar | O11 | Adoptado | Un token de un tenant no puede leer comprobantes de otro. |
| RF-FAC-170 | Facturación in situ: emitir en el momento de la lectura cuando el régimen y la cooperativa lo permiten, con el servicio de emisión individual desde la app de lecturas (offline con reserva de rango de numeración). Como nada se entrega antes de la autorización (DEC-107), el comprobante entregado en el momento solo puede ser con CAEA vigente asignado o CAI; con CAE en línea se entrega al sincronizar y autorizarse, y un rechazo aplica RN-FAC-164 ([VERIFICAR] al responder PA-FAC-14). | BASE MER-018; DEC-107 | Extensión | O7 | A validar (PA-FAC-14) | Un lecturista emite sin conexión dentro del rango reservado y el sistema concilia al sincronizar. |
| RF-FAC-171 | Emitir la factura de venta de prepaga desde M03/M07 exigiendo que el total coincida con el simulado; si no coincide, revertir el consumo registrado. Redondeo, recargo o bonificación por forma de pago y opción de ND separada según parámetros. | RN-02 §2.4 `GenerarFacturaPrepaga`, §2.6.9; V2 2342, 2413, 2243 | Estándar | O7 | Adoptado | Una diferencia de un centavo con el simulado aborta la venta sin dejar consumo huérfano. |
| RF-FAC-172 | Todas las etiquetas por clave de diccionario y todos los datos aislados por tenant. | BASE §65; DEC-002 | Núcleo | O4 | Informado | Cambiar `dict:fac.invoice` a "Liquidación" se refleja en todas las pantallas del tenant. |
| RF-FAC-173 | Proveer los reportes y exportaciones de la sección 15. | BASE §10, §69; INV `frmMovimientoConcepto`, `frmDiferenciasCuentas`, `frmDiferenciaConceptos` | Núcleo | O4 | Adoptado | Cada reporte declara universo y fecha de corte. |

## 6. Reglas de negocio

Decisión: **Replicar** (se conserva tal cual), **Mejorar** (se conserva con cambios), **Reemplazar** (se resuelve de otra forma), **Descartar** (no se implementa, con motivo).

### 6.1 Configuración, universo y selección

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-FAC-001 | La configuración de una corrida es una plantilla versionada separada de la clasificación comercial. | Se guarda en el registro `TIPO_FAC` elegido junto con la clasificación (RN-02 §2.1) | Mejorar: `billingTemplates` versionadas y `invoiceClass` separada | — | — |
| RN-FAC-002 | Las fechas de la plantilla son expresiones declarativas; el lote guarda la fecha resuelta. | Fechas como texto resueltas con `GetFechaDinamica` (RN-02 §2.1, §16.3) | Reemplazar: gramática declarativa propia (RF-FAC-007) | — | Sintaxis original no relevada |
| RN-FAC-003 | Destinatarios: todas, una, varias (con importación Excel) o cuentas de control. "Cuentas de control" se procesa como "varias" pero queda marcada como muestra. | Cuatro valores de `FacturarA`; control igual a varias (RN-02 §2.1, §16.9) | Mejorar: la muestra se marca y no emite si el lote es de simulación | — | Diferencia real de control |
| RN-FAC-004 | Un lote puede facturar el mismo período más de una vez solo con una **secuencia** distinta y motivo (bimestral partido, refacturación). | `Secuencia` ≠ 0 habilita volver a tomar el período (RN-02 §2.1, §16.5) | Mejorar: secuencia explícita con motivo y registro en `billedPeriods` | — | Uso real de la secuencia |
| RN-FAC-005 | El orden de emisión define el orden de numeración. | `OrdenarCuentas` por cuenta, alfabético o ZSR postal (RN-02 §2.1) | Replicar y ampliar con ruta de reparto y calle | — | — |
| RN-FAC-006 | Opciones del lote: forzar cuadro tarifario histórico con fecha de vigencia, no aplicar anticipos, no cobrar envío, simulación. | `ForzarCuadro`, `NoAplicarAnticipos`, `NoFacturaEnvio`, `Simulacion` (RN-02 §2.1) | Replicar; forzar cuadro requiere `fac.lotes.forzarCuadro` y motivo | PRM-FAC-036 | — |
| RN-FAC-007 | No existe ejecución real sin registro del lote. | `NoGenerarLog` permitía no registrar la corrida (RN-02 §2.1) | Descartar: todo lote se registra (auditoría) | — | — |
| RN-FAC-008 | "Una cuenta" exige la cuenta; "varias" exige al menos una. | `ValidarConfiguracion` 1 (RN-02 §2.2) | Replicar | — | — |
| RN-FAC-009 | El período general no puede ser anterior a 5 años y el desde no puede superar al hasta. | Validación 2 | Replicar | PRM-FAC-037 (años máx., 5) | — |
| RN-FAC-010 | Debe haber servicios o cuotas; cada servicio con período; cada servicio medido con rango de lecturas. | Validación 3 | Replicar | — | — |
| RN-FAC-011 | Si se facturan cuotas sin lista explícita, se exige rango de fechas de cuotas. | Validación 4 | Replicar | — | — |
| RN-FAC-012 | Tipo de factura obligatorio. | Validación 5 | Replicar | — | — |
| RN-FAC-013 | Ningún vencimiento anterior a hoy; Vto1 ≤ Vto2 ≤ … ≤ VtoN (N = cantidad de vencimientos del comprobante, hasta el tope de PRM-FAC-163; DEC-106; antes "Vto1 ≤ Vto2 ≤ Vto3 ≤ Vto4"); próximo vencimiento > último vencimiento. | Validación 6 | Replicar | — | — |
| RN-FAC-014 | Vencimientos y próximo vencimiento en día hábil del calendario del tenant. | Validación 7 (`EsDomingo_O_Feriado`) | Mejorar: calendario por provincia y localidad (T04), sábado configurable | PRM-FAC-038 | Tratamiento del sábado (`ValidarSabado` en INV) |
| RN-FAC-015 | Si la distancia entre el último vencimiento y Vto1 (Vto4 − Vto1 con el tope por defecto; DEC-106) supera 60 días, ningún intervalo entre vencimientos consecutivos puede superar 60 días. | Validación 8 (si el total ≤ 60 no valida nada) | Replicar | PRM-FAC-039 (60) | — |
| RN-FAC-016 | No se emite con fecha anterior al cierre del módulo de facturación. | Validación 9 (`ModuloCerrado`) | Replicar | PRM-FAC-042 | — |
| RN-FAC-017 | Deben estar configurados los conceptos obligatorios para facturar (interés por mora, interés anterior, interés por financiación, impuesto IVA, interés de venta, descuento de venta). | `Valida_V2` 307, 311, 543, 607, 2089, 2247 (RN-02 §2.2, §16.4) | Replicar como chequeo de configuración publicada | PRM-FAC-060 | Valores por base |
| RN-FAC-018 | Para cada condición fiscal debe resolverse un comprobante de débito y uno de crédito para los servicios del lote. | `GetComprobanteOperacion` con ±1 (RN-02 §2.2) | Replicar | — | — |
| RN-FAC-019 | Prerrequisitos fiscales y de estado: CESP vigente para servicios públicos, padrón IIBB vigente, sin pendientes de autorización antiguos, sin registración de capital en curso, exclusión mutua de la corrida. `SysAdmin` salteaba CESP y LUA. | RN-02 §2.2 | Mejorar: sin bypass por usuario; override aprobado y auditado; exclusión por (tenant, ciclo, período, secuencia) | PRM-FAC-020, PRM-FAC-021 | — |
| RN-FAC-020 | Se excluyen cuentas cuyo último registro "no facturar" está activo. | `SUMNOFAC` (RN-02 §2.3) | Replicar con vigencia y motivo | — | — |
| RN-FAC-021 | Con filtros, el universo "todas" se restringe por conjunto, zonas postales, empresa postal, localidad postal, zona/sector de lectura y categorías, considerando solo servicios conectados. | RN-02 §2.3 paso 2 | Replicar como criterios de universo | — | — |
| RN-FAC-022 | Entra una cuenta si tiene algún servicio seleccionado, no marcado "no facturar" y no dado de baja hace más de 6 meses respecto del período, o si tiene cuotas pendientes. | RN-02 §2.3 paso 3 | Replicar | PRM-FAC-043 (meses, 6) | — |
| RN-FAC-023 | Un servicio entra si está conectado, o tiene consumos sin facturar (salvo servicios cotizados relacionados), o cargos pendientes del período o sin período, o es baja con cobro proporcional de cargo fijo dentro del período. | `CargarServicios` (RN-02 §2.3) | Replicar | — | — |
| RN-FAC-024 | En venta de prepaga solo entran categorías prepagas en servicios medidos. | RN-02 §2.3 | Replicar | — | — |
| RN-FAC-025 | Con filtro "altas anteriores a", solo entran servicios dados de alta antes de esa fecha. | RN-02 §2.3 | Replicar | — | — |
| RN-FAC-026 | Un servicio solo se factura si su último período facturado es anterior al período, o es el mismo con otra secuencia, o tiene consumos o cargos nuevos. La marca vive en el registro de períodos facturados, no en un campo del servicio. | `SERSOC.ULT_FAC` + `SEC_PER`, que la anulación "deshace" restando períodos (RN-02 §2.3, §7.3, §15.3) | Reemplazar: `billedPeriods` con índice único parcial sobre vigentes | — | — |
| RN-FAC-027 | Cuotas a facturar: sin comprobante, no anuladas ni facturadas; con lista explícita, esas; si no, cuotas normales con vencimiento hasta la fecha hasta y no anteriores a la fecha desde − 10 meses, más intereses diferidos si se pide, filtradas por tipo de cuota. | `GetDeudaFacturar` (RN-02 §2.3) | Replicar | PRM-FAC-044 (10 meses) | — |
| RN-FAC-028 | Muestra de control: una cuenta al azar por categoría, una por condición fiscal, una de grandes y una de pequeños consumos. | `GetCuentasMuestra` (RN-02 §2.3) | Replicar con semilla registrada para reproducibilidad | — | — |
| RN-FAC-029 | Un contrato-servicio solo puede pertenecer a un ciclo vigente por servicio y período. | — (BASE §69, §71) | Nueva | — | — |
| RN-FAC-030 | El universo de un lote preparado es inmutable; cualquier cambio crea una versión nueva con diferencias y motivo. | — (AGR-015, ESC-05) | Nueva | — | — |
| RN-FAC-155 | Dependencia de servicios relacionados (HUE-CLO-02): al preparar, por cada contrato cuyo servicio toma el consumo de otro (configuración `REL_SER`/`USA_COT` de M02, RN-TAR-015) se registra la dependencia en `serviceDependencies`. El servicio dependiente se prefactura después de su base. Si la base no existe en la cuenta, está dada de baja o no tiene consumo aprobado para el período (en este lote o en uno emitido del mismo período), M04 devuelve `TAR-E-RELATED-MISSING`; el caso de esa cuenta queda `blocked` con excepción `RELATED_SERVICE_MISSING` (dueño M02 si falta/baja el contrato base, M03 si falta el consumo) y el lote continúa; estas excepciones no cuentan para la detección de fallo sistémico salvo que superen `PRM-FAC-033`. | RN-01 §2 (`REL_SER`); ProCoop no define el caso | Mejorar | PRM-FAC-033 | — |
| RN-FAC-159 | Elegibilidad por hechos de M02/M10 y M18 (decisiones vigentes): (1) un contrato es facturable desde el hecho de activación, es decir, la confirmación técnica de instalación y aprovisionamiento; la revisión del supervisor es posterior y no demora la facturación (DEC-033); (2) la instalación del piloto se factura en la primera factura del ciclo posterior a la OT confirmada, con el concepto vinculado al servicio (DEC-016); (3) un suministro provisorio es facturable en esa condición mientras su vencimiento obligatorio esté vigente; vencido sin regularizar, el caso queda en excepción `CONTRACT_INACTIVE` (DEC-027); (4) los adherentes y sus entradas a facturar llegan por `billing-inputs` de M18 desde O4 y se facturan en el contrato del titular (DEC-071); (5) la jerarquía de lo facturado es servicio → producto → plan → conceptos facturables de M02 (DEC-012). | Sin regla explícita en ProCoop (activación y provisorio por estado del servicio). | Adoptar (DEC-012, DEC-016, DEC-027, DEC-033, DEC-071) | — | — |
| RN-FAC-160 | Identificadores y tenants especiales: (1) los códigos de pago (`paymentCodes`) usan un identificador nuevo autocontenido; para comprobantes migrados, el decodificador también resuelve por la clave ProCoop hasta que venzan esas facturas (DEC-050); (2) la facturación del SaaS se emite con este mismo módulo bajo el tenant `PLATFORM` desde O5, con sus propias entidades jurídicas, puntos de venta y numeradores (DEC-065, DEC-064). | ProCoop usa su clave de comprobante en el código de barras. | Adoptar (DEC-050, DEC-065) | — | — |

### 6.2 Simulación, armado y emisión

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-FAC-031 | La simulación usa el mismo motor que la emisión y no tiene efectos (no numera, no persiste, no consume). | `Simulacion = true` (RN-02 §2.4) | Replicar | — | — |
| RN-FAC-032 | Si un servicio de la cuenta da error, la cuenta no se factura y el error queda por servicio. | RN-02 §2.5 | Mejorar: el caso pasa a excepción con motivo tipificado; el resto del lote sigue | — | — |
| RN-FAC-033 | Un fallo de armado de un bloque no corta todo el proceso: si es sistémico, se pausa el lote; si es individual, se aísla el caso. | Si `facturas == null` o falla `EjecutarQuery`, CORTA el proceso (RN-02 §2.5, §2.7) | Reemplazar: pausa recuperable (RF-FAC-037) | PRM-FAC-033 | — |
| RN-FAC-034 | Un servicio "facturar con otros" solo se factura si el comprobante ya tiene ítems de otro servicio; se procesan primero los que no son "con otros". | `FCT_OTR` / `FAC_OTR` (RN-02 §2.5) | Replicar | — | — |
| RN-FAC-035 | Las cuotas asociadas a un servicio van con ese servicio; las de un tipo de cuota con grupo propio van a ese grupo; el resto al grupo por defecto. | `FacturarCuotas` (RN-02 §2.5) | Replicar, sujeto a MER-010 (RN-FAC-099) | — | — |
| RN-FAC-036 | Los comprobantes candidatos se arman por (cuenta/titular, grupo de facturación, clase de comprobante); los cargos que una fórmula manda a otro grupo se suman al comprobante de ese grupo y de su clase o crean uno nuevo (DEC-093, RN-FAC-040). | RN-02 §2.6.2 | Replicar; Mejorar con la clase de comprobante (DEC-093) | — | — |
| RN-FAC-037 | Criterio de emisión: algún renglón ≠ 0; o, con la opción, consumos aunque el importe sea 0. ProCoop agregaba un criterio adicional solo en simulación. | V2 2526, 3109 (RN-02 §2.6.3) | Replicar 2526 como política por servicio; Descartar 3109 (la simulación debe reproducir la emisión) | PRM-FAC-032 | — |
| RN-FAC-038 | Grupo 0 toma el grupo cuyo tipo es el de la corrida; un grupo con "forzar ND" emite nota de débito; un grupo con tipo propio impone su tipo (salvo prepaga). | `AgregaFactura` (RN-02 §2.6.4) | Replicar | — | Uso real de `FORZAR_ND` (§16.6) |
| RN-FAC-039 | Total negativo: se invierten signos de los renglones y el comprobante pasa a crédito; después de cargos finales, se busca el comprobante "de anulación" del actual. Con concepto de GD configurado y energía inyectada mayor que la consumida, se agrega crédito a futuro en vez de NC. | RN-02 §2.6.4, §2.6.6, §2.6.8; V2 3094 | Mejorar: política explícita por servicio (`negativeTotalPolicy`) | PRM-FAC-063 | — |
| RN-FAC-040 | Separación por clase de comprobante (DEC-093): (1) cada renglón del candidato toma la clase de su servicio: **liquidación de servicios públicos** si el servicio liquida como servicio público ante ARCA (marca `tenantServices.profile.billing.publicServiceSettlement = true` de M02, RF-CAT-117, leída de la versión de configuración publicada y vigente del servicio; ex `SERVICIO.LIQ_AFIP`), **factura común** en otro caso (internet, telefonía, TV, sepelio, ventas y similares); (2) el agrupador arma un comprobante por clase dentro de la misma cuenta y grupo, nunca uno mixto; (3) el comprobante de servicio público lleva los conceptos tarifarios de los servicios que liquidan como servicio público y, de cualquier otro origen (tasas, contribuciones, cargos de terceros, cargos eventuales, cuotas, ítems facturables, aporte de capital), solo los conceptos con `conceptFiscalCases.publicServiceAccessory = true` en M06 (RN-FIS-122; PA-FIS-23); el resto va al comprobante común; (4) en el comprobante de servicio público, importe < 0 → crédito de servicio público; si no → factura de servicio público (según la matriz de la condición fiscal); el comprobante común se resuelve con RN-FAC-041 a RN-FAC-044; (5) la regla rige en las dos modalidades: en la separada, un servicio público con conceptos no accesorios también genera su comprobante común; (6) el lote informa por grupo cuántos comprobantes generó por clase, y el talón sumado (RF-FAC-149) y el cupón único de M07 (RF-FAC-151) pueden reunirlos para el pago. *Reemplazado (10-11-2026, DEC-093):* "Si algún servicio liquida como servicio público ante ARCA: importe < 0 → crédito de servicio público; si no → factura de servicio público (según la matriz de la condición fiscal)." | RN-02 §3.2: si algún servicio del comprobante es LQSP, todo el comprobante es LQSP | Reemplazar (DEC-093; antes Replicar; CTR-FAC-21) | — | Lista de conceptos accesorios del tenant (PA-FIS-23) |
| RN-FAC-041 | Si los servicios del comprobante tienen comprobante propio y todos coinciden, se usa ese. | RN-02 §3.2 | Replicar | — | — |
| RN-FAC-042 | Ajuste de signo: importe < 0 y era factura/ND → NC; importe > 0 y era NC → factura. | RN-02 §3.2 | Replicar | — | — |
| RN-FAC-043 | MiPyME: si la cuenta es MiPyME y el importe supera el umbral, se usan los comprobantes FCE de la matriz; si no, el comprobante de la clasificación comercial, luego el por defecto, luego el genérico (1 factura, 3 ND, 5 NC, 90 ticket). | RN-02 §3.2; V2 2515 | Mejorar: sin códigos mágicos por defecto; si no resuelve, excepción de configuración | PRM-FAC-064 | — |
| RN-FAC-044 | El comprobante elegido debe estar entre los habilitados para la condición fiscal del receptor; un comprobante restringido a RI y Monotributo no se emite a otros; uno marcado "no válido para RI" no se emite a RI. | `ValidarComprobanteSitIva`; `TIPO_SIT` 1 y 2 (RN-02 §3.2, §3.3.5) | Replicar | — | — |
| RN-FAC-162 | Receptor con identificación pendiente (DEC-099): si el titular receptor tiene en M01 el estado de identificación `documentPending` (persona migrada de ProCoop sin ningún documento), leído de `identificationStatus` en la foto de identificación del titular de M01 (`holderIdentifierSnapshot { documentTypeId, number, verificationStatus, identificationStatus }`, servicio `per.getHolderSnapshot` y contrato de M02; con `documentPending`, `documentTypeId` y `number` vienen vacíos) a la fecha de prevalidación, y no de una consulta aparte (alineación con M01, 10-11-2026), (1) por defecto el caso **no se emite**: pasa en prevalidación a la excepción `RECEIVER_DOCUMENT_PENDING` (categoría `customerFiscalData`, dueño M01, siguiente acción "regularizar el documento", enlace a la tarea de regularización de M01) sin consumir número; (2) la única excepción es la factura o nota a **consumidor final sin identificar** (receptor 99/0 de RF-FIS-043 de M06), que se emite solo si se cumplen a la vez: la condición fiscal del receptor es consumidor final, el total queda por debajo del umbral de identificación vigente a la fecha de emisión (tabla normativa de M06) y M06 confirma que ni el tipo de comprobante ni los regímenes de información que lo alcanzan exigen el documento; (3) siempre exigen documento y quedan bloqueados: clases A, M y FCE, todo comprobante a un receptor que no sea consumidor final y todo comprobante a consumidor final que alcance el umbral; (4) la liquidación de servicios públicos se trata como comprobante que exige documento mientras M06 no confirme lo contrario con el contador (PA-FIS-24); (5) nunca se inventa un documento, se usa un CUIT genérico ni se cambia la condición fiscal o la clase para poder emitir (CTR-FIS-03 y CTR-FIS-04 de M06); no hay override de usuario; (6) al regularizarse el documento en M01 (evento EVT-PER-27 `per.person.identificationRegularized`, que M05 consume para resolver las excepciones `RECEIVER_DOCUMENT_PENDING` de esa persona y tomar la foto nueva) el caso se reprocesa (RF-FAC-039) y lo ya emitido no se modifica; (7) la misma validación rige en el servicio de emisión individual (RF-FAC-055). | Sin regla en ProCoop para personas sin documento; con documento no numérico envía el CUIT genérico 23333333333 (RN-03 §3.4; CTR-FIS-03 de M06) | Nueva (DEC-099) | — | Si la LQSP y el régimen RG 3571 exigen el documento del usuario (PA-FIS-24) |
| RN-FAC-045 | Validaciones del comprobante individual: cuenta obligatoria; punto de venta ≠ 0 salvo internos habilitados; número ≠ 0 si no es autonumérico; tipo ≠ 0; año entre 1997 y 2050; al menos un renglón; ninguna cantidad 0; total no negativo; número manual no repetido; tipo de factura obligatorio; interno sin conceptos gravados (si se activa); anticipo en renglón único, con su comprobante y exento; ninguna alícuota con base negativa; módulo no cerrado; crédito requiere permiso; descuento exige concepto de descuento; total mayor al sugerido exige confirmación. | `clsComprobanteBase.Validar`, `clsComprobanteFactura.Validar` 1–11 (RN-02 §3.3) | Replicar; la confirmación por importe es una advertencia de la API (no un diálogo en la capa de negocio) | PRM-FAC-040, 045, 046, 047, 048 | — |
| RN-FAC-046 | Al facturar se valida el total del comprobante contra la suma de renglones y tributos con la precisión de AGR-011. | — | Nueva | — | — |
| RN-FAC-047 | Punto de venta: (1) interno con PV 0 si está habilitado; (2) PV propio de los servicios, si todos coinciden (si hay dos distintos: excepción); (3) PV del grupo de facturación; (4) PV del canal o usuario; (5) PV de la sucursal; (6) PV por defecto del tenant. | `GetPuntoVenta`: usuario, equipo (PC), empresa (RN-02 §4.2) | Mejorar: "equipo (PC)" se reemplaza por canal/terminal registrada; se agrega el grupo | PRM-FAC-040 | — |
| RN-FAC-048 | Numeración: la clave es (tipo de numeración, PV); un tipo con "comparte numeración" usa la del relacionado (por ejemplo FA y ND A). | `COMPROB.RELACION` (RN-02 §4.1) | Replicar | — | — |
| RN-FAC-049 | El número se asigna dentro de la misma transacción que persiste el comprobante y actualiza el numerador; si el bloque falla, no se consumen números. | Conexión de numeración con bloqueo de `COMPPOS` y commit separado del de facturas (RN-02 §2.7, §4.1, §4.3) | Reemplazar: transacción única (MongoDB multi-documento) con documento numerador por clave | — | — |
| RN-FAC-050 | Un numerador inexistente no se crea implícitamente. | Si no existe, bloquea la tabla y crea numerador y "PV Automático" (RN-02 §4.1) | Reemplazar: alta explícita (RF-FAC-081) | — | — |
| RN-FAC-051 | Un número ya existente para el tipo (o su relacionado) no se reutiliza; la reparación del numerador es explícita. | `ValidarNumcomEnFacturas` devuelve máximo + 1 y auto-repara (RN-02 §4.1) | Mejorar: detecta y propone, no repara en silencio | — | — |
| RN-FAC-052 | La numeración del lote es correlativa en el orden de emisión; la numeración forzada solo se permite si el lote genera un único comprobante. | RN-02 §4.3 | Replicar | — | — |
| RN-FAC-053 | Tipo de autorización resultante según el numerador: CAEA vigente para la fecha si el numerador lo admite; si no hay y también es CAE, queda pendiente de CAE; CAE → pendiente; CAI → asigna CAI y vencimiento; servicio público con CESP vigente → CESP. | RN-02 §4.4 | Replicar como dato de entrada de M06 | — | Filtro de CAEA con `VTO_CESP <= Hoy` invertido; CAE sin `TipoAutorizacion` (RN-02 §4.4, §16.1) |
| RN-FAC-054 | Con autorización CAE, un comprobante con alguna alícuota de base negativa aborta. | RN-02 §4.3 | Mejorar: excepción del caso, no del lote | — | — |
| RN-FAC-055 | Los comprobantes pendientes de autorización no se envían automáticamente a los canales hasta autorizarse. | Si quedaron bloqueadas por CAE se desactiva `RegistrarFacturasAuto` del lote (RN-02 §4.4) | Mejorar: la cola de M06 autoriza; FAC distribuye al recibir el resultado | PRM-FAC-022 | — |
| RN-FAC-056 | La emisión masiva procesa por bloques con transacción por bloque; el progreso se persiste por bloque. | 300 facturas por bloque; transacción por lote de 100 cuentas; commit parcial sin estado (RN-02 §2.5, §2.7) | Mejorar: bloque configurable, estado y reanudación (RF-FAC-047, 053) | PRM-FAC-035 | Recuperación hoy (§16.2) |
| RN-FAC-154 | Revisión previa (HUE-ELE-02): (1) un caso entra en `reviewPending` si alguna cuenta del caso pertenece a una categoría o condición especial de PRM-FAC-161 o si el cálculo de M04 trae `requiresReview` (PRM-TAR-014, MER-003); (2) el revisor ve el detalle de cálculo (demanda, energía por franja, factor de potencia, conceptos), la comparación con el período anterior y las advertencias; (3) puede aprobar, devolver con observación (vuelve a prefacturar tras la corrección en el módulo dueño) o excluir con causa; (4) mientras haya casos `reviewPending`, el lote puede aprobarse parcialmente (RF-FAC-044) pero esos casos no se envían a autorización fiscal; (5) la revisión queda auditada (revisor, fecha, decisión, nota) y no reemplaza la aprobación de emisión de RF-FAC-043; (6) con PRM-FAC-162 activo, revisor y quien preparó el lote deben ser personas distintas. | M02 §6.C.4; MER-003 | Nueva | PRM-FAC-161, PRM-FAC-162 | — |
| RN-FAC-057 | El cálculo puede paralelizarse por bloques; la numeración y persistencia respetan el orden de emisión. | Un único hilo de fondo; estimación de lotes con redondeo bancario distinta del bucle (RN-02 §2.8) | Mejorar; Descartar la estimación inconsistente y la "demora negativa" (§16.1) | — | — |
| RN-FAC-164 | Comprobante rechazado por ARCA (DEC-107; reemplaza DEC-035 en ese punto): (1) **alcance**: comprobantes con autorización **CAE en línea** (`fiscal.authorizationType = CAE`); el número se sigue asignando al emitir, en el orden del lote (DEC-035, vigente en esa parte), pero es **provisorio** hasta el CAE: el número definitivo es el que ARCA autoriza; (2) **rechazo**: cuando M06 informa `fis.authorization.rejected` con `rejectionKind = dataError` (resultado `R` por un dato del propio comprobante; no 10016, que se concilia, ni `detained` de prevalidación, ni `uncertain`), el comprobante **vuelve a borrador** (`commercialStatus = returnedToDraft`) y **libera su número** (`number = null`; queda en `numberAssignments[]` con `releasedAt` y motivo `arcaRejected` y el código de ARCA); se abre la excepción `FISCAL_REJECTED` y el contenido queda editable: en el lote se corrige el dato en el módulo dueño y el caso se vuelve a prefacturar sobre el mismo `invoiceId`; en la emisión individual se edita con el editor de PAN-FAC-11; si se decide no emitirlo, se descarta como anulación de un comprobante no autorizado (RN-FAC-084, `fac.invoice.annulled`); (3) **posteriores**: los comprobantes del mismo numerador con número mayor al liberado que todavía no tienen CAE (los del mismo lote y, por la correlatividad que exige ARCA por punto de venta y tipo, cualquier otro de ese numerador) **vuelven a la cola** (`commercialStatus = requeued`), liberan su número con motivo `sequenceRelease` y conservan su contenido; ARCA suele rechazarlos en la misma tanda solo por correlatividad (`rejectionKind = sequenceOnly`), y ese rechazo no los devuelve a borrador; antes de liberar, M05 espera que no haya envíos `sending` ni `uncertain` de ese numerador (si hay inciertos, primero se concilian, RF-FAC-059); (4) **numerador**: `numberSequences.lastAuthorizedNumber` guarda el último número autorizado por punto de venta y tipo (lo actualiza el consumidor de `fis.invoice.authorized`) y es la referencia: al liberar, `lastNumber` vuelve a `lastAuthorizedNumber` más los números todavía en curso por debajo del liberado; nunca baja de `lastAuthorizedNumber`; (5) **renumeración**: al reenviarse, los `requeued` reciben números nuevos desde el siguiente al último autorizado, en su orden de emisión original (`emissionSeq` del lote), dentro de la transacción de numeración (RN-FAC-049), con motivo `reissueAfterRelease`, y se publica `fac.invoice.renumbered` (EVT-FAC-23); el borrador corregido se reemite con el número siguiente disponible en ese momento (motivo `reissueAfterCorrection`) sin que la tanda lo espere; el `fiscalAuthorizations` anterior de M06 pasa a `cancelled` con motivo `numberReleased` y se crea uno nuevo con la clave del número nuevo; (6) los comprobantes **autorizados nunca cambian** de número ni de contenido; (7) **nada se imprime, envía, publica en el portal ni publica ante entes de cobro** antes de tener CAE, CAEA vigente asignado o CESP (o CAI, o de no requerir autorización): el PDF, los códigos de barras que incluyen número o CAE, la distribución, la publicación al socio (EVT-FAC-14) y la publicación de deuda de M07 esperan la autorización (RF-FAC-063, RN-FAC-055; RN-COB-158 de M07); el identificador de pago autocontenido (DEC-050) no depende del número; (8) **auditoría**: cada número asignado, liberado y reasignado queda en `invoices.numberAssignments[]` y en la auditoría de T02 con número, numerador, motivo (`initialIssue`, `arcaRejected`, `sequenceRelease`, `reissueAfterCorrection`, `reissueAfterRelease`), código de ARCA si lo hay, lote, actor y fecha; `billingRunNumberRanges` registra los rangos definitivos y los números liberados; los números liberados y reasignados no son huecos en el control de correlatividad (RF-FAC-084); (9) **CAEA**: el comprobante emitido con un CAEA vigente asignado tiene número definitivo desde la emisión y puede entregarse (contingencia y mostrador, DEC-018, DEC-038); como el CAEA se informa después (RF-FIS-067 de M06), si al informarlo ARCA lo observa o rechaza (`fiscal.status = reportRejected`) **no se renumera ni vuelve a borrador**, porque ya se entregó: si el error es del informe, M06 corrige el dato informado y lo vuelve a informar con el mismo número; si el comprobante es incorrecto, se corrige con nota de crédito y un comprobante nuevo, o según lo que indique la norma [VERIFICAR con el contador]; (10) **CESP y CAI**: el código se asigna por rango o talonario al emitir y no hay rechazo en línea; el número es definitivo desde la emisión y los rechazos posteriores de un régimen de información (RG 3571, PA-FIS-24) siguen el tratamiento del punto 9; (11) la misma regla rige en el servicio de emisión individual (RF-FAC-055) y en mostrador; (12) los recibos de M07 no pasan por ARCA (`authorizationType = none`) y no les aplica esta regla. | ProCoop reenvía el comprobante con el mismo número (`ID_BLO = -1` hasta obtener CAE; RN-02 §4.4; RN-03 §3.5); DEC-035 decía "si ARCA rechaza se reenvía el mismo número". | Adoptar (DEC-107) | — | Tratamiento del comprobante CAEA observado o rechazado al informarlo (punto 9); códigos de ARCA que distinguen el rechazo por dato del rechazo solo por correlatividad (punto 3) |

### 6.3 Vencimientos y recargos entre vencimientos

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-FAC-058 | En comprobantes individuales, Vto1 no puede ser anterior a hoy ni posterior a hoy + N días. | `clsComprobanteFactura.Validar` 3; V2 2271 | Replicar | PRM-FAC-050 | — |
| RN-FAC-059 | En comprobantes sueltos todas las fechas de vencimiento (las cuatro en ProCoop y con el tope por defecto; DEC-106) son, por defecto, la fecha de hoy; el usuario puede indicar otras. | `RegistrarCabecera` (RN-02 §5.1) | Mejorar: por defecto se aplica la trama del servicio | — | — |
| RN-FAC-060 | Si un vencimiento no es posterior al anterior, repite el importe del anterior. | `CalcularVencimientos` (RN-02 §5.2) | Replicar | — | — |
| RN-FAC-061 | Modo fijo en pesos: Vto2 = T + r; Vto3 = T + 2r; Vto4 = T + 3r, sin IVA. Con un tope mayor que 4 (PRM-FAC-163; DEC-106), VtoK = T + (K − 1)·r; los modos de RN-FAC-062 a RN-FAC-065 se extienden igual al vencimiento K (capitalizando sobre el anterior, por días desde Vto1 o por la fila de trama con índice K − 1), con el cálculo en `dueDateSurchargeSchemes` de M08. | RN-02 §5.2; V2 74, 578 | Replicar | PRM-FAC-080, 081 | — |
| RN-FAC-062 | Modo porcentaje fijo: Vto2 = T·(1 + r %) + IVA; Vto3 y Vto4 capitalizan sobre el anterior. | RN-02 §5.2 | Replicar | PRM-FAC-080, 081 | — |
| RN-FAC-063 | Modo porcentaje variable: T + T·r %·días entre Vto1 y el vencimiento + IVA. | RN-02 §5.2 | Replicar | PRM-FAC-080, 081 | — |
| RN-FAC-064 | Trama por importe: se busca la trama cuyo rango de importe contiene T (por tipo de factura o genérica); recargo = T·valor %·días (o importe fijo si el tipo de valor es 1) + IVA. ProCoop calcula Vto3 y Vto4 desde el total original. | RN-02 §5.2, §16.1 | Mejorar: se define explícitamente si capitaliza o no por trama (`compounding`) | — | Si el cálculo desde el original es intencional |
| RN-FAC-065 | Trama por vencimiento: la fila con rango 1–1 aplica a Vto2, 2–2 a Vto3, 3–3 a Vto4 (o la primera genérica); recargo = T·valor %·días + IVA. | RN-02 §5.2 | Replicar con índice de vencimiento explícito | — | — |
| RN-FAC-066 | Al recargo se le suma el IVA del concepto de interés según la condición fiscal del titular (cálculo de M06). | `CalcularIVA_Interes`; V2 606 | Replicar delegando en M06 | PRM-FAC-082 | — |
| RN-FAC-067 | Consistencia: si Total2 < Total, se igualan todos los totales posteriores al total (los tres posteriores con el tope por defecto; DEC-106; antes "los tres totales posteriores"). | RN-02 §5.2 | Replicar | — | — |
| RN-FAC-068 | Redondeo de los totales de todos los vencimientos (los cuatro en ProCoop; DEC-106) a 2 decimales salvo configuración contraria, cuando la emisión ≠ Vto1 y no es CAE. | V2 21 (RN-02 §5.2) | Mejorar: precisión y redondeo por concepto (AGR-011); importes fiscales siempre a 2 decimales | PRM-FAC-083 | — |
| RN-FAC-069 | Los recargos entre vencimientos se imprimen y codifican; el interés por mora devengado después del último vencimiento lo calcula M08 y se factura en un documento posterior. | BASE §97.3 | Nueva (límite FAC/M08) | — | — |
| RN-FAC-163 | Tope de vencimientos (DEC-106): (1) el tope por defecto es 4 y se configura en PRM-FAC-163 por tenant, con excepciones por tipo de comprobante y por servicio; el **tope efectivo** de un comprobante es el menor entre el del tipo de comprobante y los de los servicios que incluye (si no hay excepción, el del tenant) y se guarda en `invoices.dueDateCap`; (2) tramas (`dueDateSchemes.dueCount`), calendarios de ciclo, plantillas y comprobantes manuales no pueden superar el tope efectivo de su alcance; (3) **subir** el tope por encima de 4 (o del valor vigente) requiere validar, antes de guardar el parámetro, la `dueDateCapacity` de cada formato de código de barras asignado y vigente para ese alcance (`barcodeAssignments`, RF-FAC-140 a RF-FAC-147) y la capacidad de cada ente de cobro habilitado según su layout (`collectionAgencies.dueDateCapacity` de M07, RF-COB-099, leída con `cob.service.agencyDueDateCapacities`); la validación devuelve la lista de formatos y entes que no admiten la cantidad y el usuario confirma explícitamente (auditado) que ante ellos se publicarán menos vencimientos; un formato sin capacidad declarada bloquea el cambio hasta declararla; (4) si un formato o ente admite menos vencimientos que el comprobante, ante ese formato o ente se publican **solo los primeros N** vencimientos (N = su capacidad), en el orden del comprobante: el código de barras del formato codifica los vencimientos 1 a N (`paymentCodes.dueIndexes`) y M07 publica al ente los vencimientos 1 a N; los posteriores solo se cobran por los canales que los admiten (caja, portal, pasarela) y la publicación por ente queda en `invoices.dueDateCap.perAgency`; (5) bajar el tope no modifica comprobantes emitidos; (6) el importe de cada vencimiento sigue la trama extendida (RN-FAC-061) y la regla de consistencia (RN-FAC-067) para todos los vencimientos. | ProCoop tiene 4 vencimientos fijos (`VTO1..4`, `TOTAL1..4`; RN-02 §1, §5). | Nueva (DEC-106) | PRM-FAC-163 | Que los entes y formatos admitan más de 4 vencimientos (se resuelve por la validación del punto 3, no por suposición) |
| RN-FAC-165 | **Vencimientos corridos por autorización tardía** (DEC-107 con M07 RN-COB-158; 10-11-2026): (1) como nada se imprime, publica ni cobra antes de la autorización fiscal (RN-FAC-164 punto 7), si la autorización llega **después del primer vencimiento** del comprobante el socio no pudo pagarlo a tiempo; al consumir `fis.invoice.authorized` (EVT-FIS-01; fecha de autorización = fecha del evento) M05 **corre los vencimientos**: el primero pasa a la fecha de autorización más los días de gracia (`dueDateSchemes.lateAuthorizationGraceDays` de la trama del comprobante o, si la trama no lo define, PRM-FAC-164), ajustado a día hábil con el calendario de T04 y la misma regla `shift` del calendario del ciclo, y los siguientes se corren la misma cantidad de días, de modo que conservan su distancia con el primero; `nextDueDate` se corre igual; (2) solo cambian las fechas: los importes de cada vencimiento (`dueDates[].total`, `surcharge`, `surchargeTax`) quedan como se congelaron al emitir; (3) el corrimiento se hace en la misma transacción que registra la autorización, antes de generar el PDF, los códigos de barras y la distribución (que esperan la autorización), así que lo impreso y lo publicado ya llevan las fechas corridas; las originales quedan en `invoices.lateAuthorizationShift` y en la auditoría de T02; (4) M05 publica `fac.invoice.dueDatesChanged` (EVT-FAC-13) con `reason = lateAuthorization`; M07 aplica la misma regla al habilitar `fiscalGate` (RN-COB-158) con los días de gracia que el comprobante informa en `fac.invoice.issued` (`lateAuthorizationGraceDays`), para no depender del orden de llegada de los eventos, y M08 calcula la mora desde los vencimientos corridos (RN-MOR-002, RF-MOR-068); (5) antes de cada envío o reenvío a ARCA de un comprobante todavía sin autorizar (`requeued`, o reemitido tras `returnedToDraft`), si su primer vencimiento ya es anterior a la fecha de envío más los días de gracia, M05 recalcula los vencimientos con la misma regla, porque el contenido todavía es editable y así ARCA recibe las fechas corridas; (6) no aplica a comprobantes autorizados antes de su primer vencimiento, a los que no requieren autorización ni a los que tienen CAEA vigente asignado, CESP o CAI desde la emisión (se pueden pagar desde que se emiten). | ProCoop no corre vencimientos: el comprobante bloqueado con `ID_BLO = -1` hasta el CAE conserva sus fechas (RN-02 §4.4). | Nueva (DEC-107) | PRM-FAC-164; `dueDateSchemes.lateAuthorizationGraceDays` | [VERIFICAR con el contador] si la norma impone otro criterio, si correr la fecha de vencimiento del pago (`FchVtoPago`) de un comprobante de servicios después del CAE es admisible o exige otro tratamiento, y si el ente regulador fija un plazo mínimo entre la puesta a disposición de la factura y su vencimiento |

### 6.4 Bloqueo

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-FAC-070 | El estado "pendiente de autorización" no es un bloqueo de cobro y vive en el estado fiscal. | `ID_BLO = -1` mezclado con la causa de bloqueo; los UPDATE excluyen −1 (RN-02 §6) | Reemplazar: `fiscal.status` y `block` separados | — | — |
| RN-FAC-071 | Solo se bloquean comprobantes impagos; cada cambio deja historial (fecha, causa, usuario); causa nula = desbloqueo. Se procesa en bloques. | `Asignar_Bloqueo` en bloques de 500 + `HISBLOQ` (RN-02 §6) | Replicar | — | — |
| RN-FAC-072 | Listar comprobantes bloqueados no modifica datos. | `getComprobantes_Bloqueados` desbloquea pagos como efecto lateral (RN-02 §16.1) | Descartar el efecto lateral; el desbloqueo de pagados es un job explícito | — | — |
| RN-FAC-073 | La alternancia bloquear/desbloquear desde cobranzas es una acción explícita con causa. | `BloquearDesbloquearComprobantes` alterna (RN-02 §6) | Mejorar: dos acciones distintas | — | — |

### 6.5 Anulación, NC, ND y reversión

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-FAC-074 | No se anula algo ya anulado. | `ESTADO = 'A'` (RN-02 §7.1) | Replicar | — | — |
| RN-FAC-075 | No se elimina un comprobante; ProCoop permite eliminar si no tiene pagos ni financiaciones. | RN-02 §7.1, §7.2 (copia a `ANUFAC` y borra) | Reemplazar: anulación lógica siempre (Guía §5) | — | — |
| RN-FAC-076 | Un comprobante autorizado por ARCA no se anula: se revierte con otro comprobante, previa confirmación. | RN-02 §7.1 | Replicar | — | — |
| RN-FAC-077 | Un comprobante incluido en una solicitud de cobro de pasarela activa no se anula hasta que la solicitud esté en estado no cobrado (M07 informa). | Pagos360 estados 0, 1 y 4 (RN-02 §7.1, §12.6) | Replicar consultando a M07 | — | Significado de estados (§16.10) |
| RN-FAC-078 | En operaciones masivas, los comprobantes con pagos se excluyen con lista de excluidos; los autorizados se revierten con NC (no se anulan en masa). | RN-02 §7.1 | Mejorar: se permite la reversión masiva con NC asociada por bloques, con aprobación | — | — |
| RN-FAC-079 | Se excluyen los de fecha anterior o igual al cierre del módulo (en individual, error con la fecha de cierre). | RN-02 §7.1 | Replicar | PRM-FAC-042 | — |
| RN-FAC-080 | Si hay comprobantes pendientes de autorización, la anulación exige doble confirmación y M06 debe confirmar que no fueron autorizados (consulta) antes de anular. | Doble confirmación "no puede revertirse" (RN-02 §7.1) | Mejorar: consulta fiscal previa obligatoria (ESC-04) | — | — |
| RN-FAC-081 | Las ventas de prepaga se excluyen de la anulación masiva. | RN-02 §7.1 | Replicar | — | — |
| RN-FAC-082 | Un comprobante no puede revertirse dos veces: si ya existe una relación con un comprobante de signo opuesto por el mismo total, error. | `ValidarCreditosGenerados` (RN-02 §7.1) | Replicar con control por saldo revertible acumulado (admite parciales) | — | — |
| RN-FAC-083 | Revertir servicios públicos exige CESP vigente; un anticipo ya utilizado no se anula; si toca rubros de capital, se valida con M17. | `ValidarCespLQSP`, `VerificarAnticipos`, `ValidarCapitalizacionEnFacturas` (RN-02 §7.1) | Replicar | — | — |
| RN-FAC-084 | Al anular o revertir se libera todo lo consumido (consumos sin factura; prepaga se elimina el consumo de venta; llamadas, internacionales y cargos sin factura; cuotas pendientes; presupuesto a "P"; anticipos devueltos) y se revierten movimientos de capital, terceros, talones, notificaciones, observaciones y datos extra. | `FinalizarAnulacion` (RN-02 §7.2) | Replicar mediante eventos a los módulos dueños | — | — |
| RN-FAC-085 | El período facturado se retrocede eliminando (lógicamente) el registro de `billedPeriods` del comprobante. ProCoop resta 1 a `CNT_FAC` y retrocede período/secuencia; en obras y viviendas descuenta cuotas y porcentajes. | `AnularSersoc` (RN-02 §7.3) | Reemplazar para servicios; Replicar el efecto en obras (M10) y viviendas (M18) por evento | — | — |
| RN-FAC-086 | Si se anula la factura que cobró el último franqueo de la cuenta, se retrocede el envío registrado. | `DevolverFranqueo` (RN-02 §7.3) | Replicar | — | — |
| RN-FAC-087 | Se devuelve al acumulador de redondeo de la cuenta (o por tipo de factura) lo que el comprobante había aplicado (M04/M07). | `AnularRedondeo` (RN-02 §7.3) | Replicar por evento | — | — |
| RN-FAC-088 | Comprobante de reversión: CVLP con número → "CVLP débito"; forzar LSP → crédito SP de la condición fiscal; forzar electrónica → NC por defecto; si el tipo tiene comprobante de anulación → ese; si no, por la condición fiscal: NC → ND; crédito SP → factura SP y viceversa; factura o ND → NC; si no resuelve → error. | `CargarQueryRevertirFactura` (RN-02 §7.4) | Replicar | — | — |
| RN-FAC-089 | El comprobante de reversión es un clon con fecha de hoy, vencimientos de hoy o indicados (no anteriores a hoy ni desordenados), los totales de todos sus vencimientos (los 4 en ProCoop; DEC-106) = total 1, saldo pleno, número nuevo y renglones copiados; se vincula con relación origen-generado. | RN-02 §7.4 | Replicar | — | — |
| RN-FAC-090 | Revertir consumos inserta un consumo espejo negativo con estados invertidos; "permitir volver a facturar" inserta además una copia sin facturar; si no, retrocede el estado de lectura. | RN-02 §7.4 | Replicar vía servicio de M03 | — | — |
| RN-FAC-091 | Revertir stock genera entrada de productos con stock, salvo comprobantes de tipos excluidos configurados. | Excluye 5, 6, 83 y 92 (RN-02 §7.4) | Mejorar: lista de tipos excluidos configurable | PRM-FAC-065 | — |
| RN-FAC-092 | La relación manual muestra comprobantes de la misma cuenta, no internos ni anulados, de los últimos N días, y graba las marcas "anulación" e "informar CUIT". | RN-02 §7.5 | Replicar | PRM-FAC-066 | — |
| RN-FAC-093 | En la masiva, las relaciones se generan con su propia estructura. | Se generaban con la plantilla de inserción de anticipos (RN-02 §16.1) | Descartar el defecto | — | Uso en la práctica |
| RN-FAC-094 | Ninguna corrección edita un comprobante emitido: toda diferencia es NC, ND o refacturación vinculada. | — (AGR-010, ESC-02) | Nueva | — | — |

### 6.6 Recategorización, retroactivos y modificación masiva

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-FAC-095 | Energía por ahorro: Ahorro = 100 − actual/anterior·100 (opcionalmente en consumo diario); si ≥ 0, la categoría del mismo grupo cuyo rango contiene el ahorro; si es negativo, se desplaza desde el mínimo de la categoría actual; si queda igual no cambia. | `Get_Recategorizacion_Energia` (RN-02 §8) | Replicar | — | — |
| RN-FAC-096 | Energía por consumo total: la categoría del mismo grupo de consumo cuyo rango contiene el consumo actual. | RN-02 §8 | Replicar | — | — |
| RN-FAC-097 | Gas por 6/12 períodos: suma de consumos de los últimos 12 períodos (o bimestres, o por fecha de lectura); en modo corregido aplica factor calórico, presión y temperatura; "proporcional 365" lleva a un año; elige la categoría cuyo rango lo contiene (opcionalmente ignorando inactivas y por orden); redondeo del consumo corregido por truncado o redondeo. | `Get_Recategorizacion_Gas` (RN-02 §8) | Replicar | PRM-FAC-090 a 094 | — |
| RN-FAC-098 | Gas por cambio de cuadro: exige cuadros A, B, S y H por categoría ENARGAS; compara con el mismo período del año anterior (o el anterior a ese si no hay datos, salvo "TEMP"); E se mantiene; beneficiarios en estados 67/70 → H si ahorró ≥ 20 %, si no S; resto → B si ahorró ≥ 20 %, si no A. Al confirmar actualiza el estado de beneficio con la tabla de equivalencias configurable (en ProCoop depende de la sigla "ARR"). | `Get_Recategorizacion_GasCuadros`, `Confirmar_Recategorizacion` (RN-02 §8) | Mejorar: umbral de ahorro y equivalencias de estado configurables por tenant, sin ramas por sigla | PRM-FAC-095, 096 | — |
| RN-FAC-099 | El filtro "nunca recategorizados" se aplica efectivamente. | El resultado del filtro se descarta (RN-02 §16.1) | Descartar el defecto | — | Confirmar con usuarios |
| RN-FAC-100 | La confirmación guarda categoría anterior y nueva, fecha, períodos, consumo y método; actualiza la categoría de consumos no facturados; deja nota en la cuenta; todo atómico. | RN-02 §8 | Replicar | — | — |
| RN-FAC-101 | Retroactivo proceso 0: sobre consumos facturados del período (y opcionalmente el anterior) con filtros de conceptos, cuenta, zona, bajas y categorías (de la lectura, del servicio o cambio desde anteriores); cantidad = consumo o tramo × proporción; precio = importe fijo, porcentaje de lo facturado o proporcional por días entre lectura y fecha de corte. | `GetItemsModificar` (RN-02 §9) | Replicar | — | — |
| RN-FAC-102 | Retroactivo proceso 1: sobre renglones de comprobantes del rango con un concepto o impuesto base, importe fijo o porcentaje. | RN-02 §9 | Replicar | — | — |
| RN-FAC-103 | Interés del retroactivo = total × días entre emisión y próxima facturación × tasa, con **signo explícito** según la operación sea cobro o devolución. | Fórmula con divisor −100 que siempre resta (RN-02 §9, §16.1) | Mejorar | — | Si los retroactivos son siempre devoluciones (PA-FAC-16) |
| RN-FAC-104 | Validaciones del retroactivo: concepto obligatorio; importe, porcentaje o proporcional; proporción ≠ 0 sin importe; rangos coherentes; servicio obligatorio; concepto base en proceso 1; con interés: próxima facturación, tasa y concepto; filtro de categorías obligatorio. No se duplica un retroactivo pendiente con mismo período base, tramas, concepto y rangos para una cuenta. | `ValidarPropiedades`, `ValidarRetroactivosyaCreados` (RN-02 §9) | Replicar | — | — |
| RN-FAC-105 | Los retroactivos generan ítems facturables con comprobante de origen, período base, tramas y tipo de factura, más uno por interés; nunca comprobantes. | `RealizarCambios` (RN-02 §9, §15.15) | Replicar | — | — |
| RN-FAC-106 | Modificación masiva: fecha nueva = fija u original + N días (opcionalmente al día hábil siguiente), nunca ambas; importes 2–4 = total 1 + valor o total 1 × valor. | `clsModificacionFacturas` (RN-02 §10.1) | Replicar | — | — |
| RN-FAC-107 | La modificación masiva excluye siempre los comprobantes anteriores al cierre de facturación y los de emisión ≤ máximo entre el cierre de ventas y la otra fecha de cierre; la emisión nueva no puede ser ≤ cierre de ventas. | RN-02 §10.1; V2 67, 2528 | Replicar | PRM-FAC-042, 067 | — |
| RN-FAC-108 | Comprobantes autorizados: ProCoop pregunta si incluirlos advirtiendo problemas con ARCA. | RN-02 §10.1 | Mejorar: solo datos no fiscales (RF-FAC-113) | — | — |
| RN-FAC-109 | Cada modificación deja auditoría por comprobante con valores anteriores y nuevos. | `RegistrarCambios` (RN-02 §10.1) | Replicar | — | — |
| RN-FAC-110 | La modificación de cuotas (porcentaje, costo, desplazamiento, IVA, tipo de cuota) deja nota por comprobante y movimiento de capital si cambió el capital; usa la tasa correcta para la sobretasa. | `clsModificacionCuotas` (RN-02 §10.2, §16.1) | Replicar en M11 con el motor FAC; Descartar el defecto de la sobretasa | — | — |

### 6.7 Cuotas, terceros e importaciones

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-FAC-111 | Por defecto, ventas y cuotas se facturan en documentos propios; solo se incluyen en la factura del servicio los conceptos vinculados a ese servicio con validación fiscal. | ProCoop incluye cuotas en la masiva sin esa restricción (RN-02 §2.5, §11.1) | Mejorar según MER-010 | PRM-FAC-068 | — |
| RN-FAC-112 | El renglón de cuota lleva su IVA y percepción (IIBB solo si la base supera el mínimo, M06); al emitir, la cuota queda facturada con el id del comprobante. | `GetPercepcionCuota` (RN-02 §11.1) | Replicar | — | — |
| RN-FAC-113 | Un concepto de terceros solo se incluye con convenio y fundamento vigentes; se exhibe separado del cargo propio. | BASE §97.4 | Nueva | — | — |
| RN-FAC-114 | Importaciones: se completa titular y condición fiscal, se marcan errores ("CUENTA INEXISTENTE", "CONCEPTO INEXISTENTE") y se calcula el IVA por concepto y condición. CT1 falla si el socio no tiene o tiene varios servicios. Las facturas de gas importadas rechazan números repetidos en el archivo. | `Fill_Comprobantes`, `Importar_CT1`, `ImportarFacturasGAS` (RN-02 §11.2) | Replicar | PRM-FAC-069 | — |
| RN-FAC-115 | EME con cantidad 0 no divide por cero y no se calcula el cruce por DNI no usado; FAR no asume códigos de producto consecutivos. | Defectos (RN-02 §16.1) | Descartar los defectos | — | — |
| RN-FAC-156 | Clases de ítem facturable (`itemClass`): (1) `guaranteeDeposit` (depósito en garantía, por ejemplo del préstamo ortopédico de M18 o la garantía de M08 RF-MOR-179): se exhibe en un bloque propio "Depósito en garantía (reintegrable)", fuera del neto gravado y de la base de percepciones según la clase fiscal de M06 (RF-FIS-165), y su obligación se publica a M07 con `itemClass` para que M15 la registre como pasivo con el depositante y nunca como ingreso (RN-CON-123); su devolución no es NC sino crédito a la cuenta (M07); (2) `subsidyFundContribution` (aporte al fondo de subsidio): renglón identificado con su concepto; la obligación lleva `itemClass` para que M15 lo acredite al fondo `socialSubsidyFund` (RN-CON-122); (3) `burialRightAcquisition` y `burialRightMaintenance` (derecho de sepultura): adquisición (contado o cuota n/N del plan de M04, RN-TAR-248) y mantenimiento periódico; el IVA lo resuelve M06 por la clase fiscal del concepto (RF-FIS-162) y el reconocimiento del ingreso, M15 (RN-CON-124). Un ítem `guaranteeDeposit` nunca se agrupa en el mismo renglón con otra clase. | Sin clase propia en ProCoop (se facturan como conceptos genéricos). | Nueva (HUECO-OTR-04, HUECO-SEP-03, HUECO-CEM-04) | — | — |
| RN-FAC-157 | Entidad jurídica del comprobante (DEC-064, DEC-087): cada caso del lote se divide por `legalEntityId` del contrato (`serviceContracts.legalEntityId`, opcional) o, si está vacío, del servicio del tenant (`tenantServices.legalEntityId`, obligatorio; M02), resuelto con `legalEntities.resolve({ branchId, serviceId, at })` de T04, antes de resolver modalidad y grupo; el comprobante guarda la copia de los datos del emisor al emitirse (RF-CFG-138); un comprobante, un talón (`paymentSlips`) y un numerador pertenecen a una sola entidad; en modalidad agrupada, los servicios de entidades distintas del mismo titular generan un comprobante por entidad aunque compartan grupo de facturación; el punto de venta debe ser de la misma entidad (si no, excepción `POS_CONFLICT`). La obligación publicada a M07 lleva el `legalEntityId` del comprobante para que se registre en la cuenta corriente de esa entidad y el recibo de M07 salga por entidad (RF-COB-192). | ProCoop emite por `COD_EMP` sin regla explícita de separación en el agrupado. | Nueva (DEC-064, DEC-087) | — | — |
| RN-FAC-161 | Numeración de recibos (RF-FAC-179): (1) el numerador se identifica por `{legalEntityId, voucherTypeId, pointOfSaleId}` y debe existir y estar `active`; (2) el punto de venta debe pertenecer a la misma entidad (si no, `POS_CONFLICT`); (3) el número se asigna con `$inc` y el pedido es idempotente por `idempotencyKey` (reintentar no consume otro número); (4) un número asignado y no usado por anulación de la operación de caja queda registrado como anulado por M07, nunca se reutiliza; (5) los recibos no fiscales internos usan `numberingSequences` de T11, no este servicio. | ProCoop numera recibos por talonario y punto de venta sin entidad (RN-05 §13.3). | Nueva (DEC-064, DEC-087) | — | Numerador inexistente o bloqueado ⇒ M07 no emite el recibo y muestra el motivo. |
| RN-FAC-158 | Cambio de régimen de medición (EVT-CAT-28; HUE-AG-03): (1) si el evento llega con `effectiveAt` dentro del período de un lote preparado y no emitido, los casos del contrato se marcan afectados y se vuelven a prefacturar con la base nueva de M04 (RN-TAR-250); (2) si M04 devuelve `TAR-E-REGIME-READING-MISSING`, el caso queda `blocked` con excepción `METERING_REGIME_READING_MISSING` (dueño M03) y el lote continúa; (3) un lote ya emitido no se modifica: RN-CAT-078 impide fechas efectivas anteriores al último período facturado. | ProCoop lo resuelve cambiando categoría y medidor a mano. | Nueva (HUE-AG-03) | — | — |

### 6.8 Impresión, talones y código de barras

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-FAC-116 | Selección de plantilla: forzada si existe; CVLP; plantilla de la clasificación comercial; la del primer servicio que la tenga; la genérica; prepaga con su plantilla; variantes electrónica, alternativa y talón sumado; sufijos por tipo de comprobante y por condición fiscal. | `NombreReporte` con prefijos `e_`, `2_`, `t_` y sufijos `_<COD_COM>`, `_<COD_SIT>` (RN-02 §12.1) | Reemplazar: reglas explícitas en `invoiceTemplates.selectionRules` | PRM-FAC-100, 101, 102 | — |
| RN-FAC-117 | El código de cuenta para redes es la cuenta con 9 dígitos; el domicilio impreso es el histórico de la cuenta a la fecha de emisión. | RN-02 §12.1 | Replicar | — | — |
| RN-FAC-118 | Órdenes de impresión disponibles: calle y número, cuenta, ZSR postal, comprobante, alfabético, titular, ZSR de lectura, código postal y cuenta. | RN-02 §12.1 | Replicar + ruta de reparto | — | — |
| RN-FAC-119 | Salidas: todas, solo electrónicas por mail o WhatsApp, no electrónicas, todas por mail, PDF, SMS/WhatsApp. | RN-02 §12.1 | Replicar como canales del lote de distribución | — | — |
| RN-FAC-120 | Talones: si ya existían se historizan; se agrupan por cuenta, grupo de talón y orden de talón; el talón suma los importes de cada vencimiento (los 4 en ProCoop; con un tope mayor, hasta el menor tope efectivo de los comprobantes agrupados, de modo que el talón no publique un vencimiento que alguno de ellos no tiene; DEC-106) (créditos restan) y toma los vencimientos del primero; los números se asignan llenando huecos y validando que el rango no esté ocupado. | `GenerarTalones`, `GetNumero` (RN-02 §12.2) | Mejorar: numeración correlativa sin reutilizar huecos (los huecos de talones anulados quedan registrados) | — | — |
| RN-FAC-121 | Talones-cuota: la última cuota absorbe el redondeo. | RN-02 §12.2 | Replicar | — | — |
| RN-FAC-122 | Piezas postales numeradas por zona/sector/recorrido; orden y sub-orden "i/n" por titular y recorrido. | `AgregarNroPieza`, `AsignarOrden` (RN-02 §12.2) | Replicar | — | — |
| RN-FAC-123 | Formato por defecto y convenio del tenant; si falta alguno, no se imprime código. Los formatos aceptados en lectura son los asignados a recaudadores más el por defecto. | V2 2055, 2255; `BANCOS.ID_CODBAR` (RN-02 §12.3) | Replicar con `barcodeAssignments`; la falta de formato es excepción de impresión | PRM-FAC-110, 111 | — |
| RN-FAC-124 | La lectura rechaza caracteres no numéricos salvo formatos declarados alfanuméricos. | Excepción para la sigla "EMPR" (RN-02 §12.3) | Mejorar: atributo del formato, no de la cooperativa | — | — |
| RN-FAC-125 | Decodificación genérica: 41 → comprobante por id; 42 → talón; 40 → notificación (o lote + cuenta); 43 → solicitud de pasarela; 21–23 → socio/cuenta + agrupador + vencimiento; 99 → cuenta + terminaciones; 14 dígitos → tipo + PV + número; 16 dígitos → tipo de 4 dígitos. | `Get_Facturas` (RN-02 §12.3) | Replicar como decodificadores declarativos; casos por cooperativa (CL, RUF, TIO, FOT) como formatos propios | PRM-FAC-112 | — |
| RN-FAC-126 | Importes en centavos con ceros a la izquierda; fechas con formato explícito; juliana AADDD; los créditos se codifican con el valor absoluto. | `Get_TextoImporte`, `Get_FechaTexto` ("mm" mes y "MM" minutos), `GetJulianDate` (RN-02 §12.3, §12.4.1) | Mejorar: tokens de fecha estándar; un crédito no lleva código de pago | — | — |
| RN-FAC-127 | Si falta el comprobante, ProCoop deja el código en ceros. | RN-02 §12.4.1 | Reemplazar: no se imprime código y se registra excepción | — | — |
| RN-FAC-128 | Pago Fácil 46: una notificación cae en el modo heredado; Pago Fácil 46_2 y 50_2 no implementan notificación; Banco de Córdoba 50_2 repite el tercer tramo y divide por cero con total 0; Banco de Córdoba 43 limita a ARS 9.999,99; Credicoop compara año de 2 dígitos; AFIP lanza excepción en ancho. | RN-02 §12.4.1, §16.1 | Descartar los defectos; el motor declarativo valida cada plantilla con vectores de prueba | — | Formatos realmente en uso (§16.7) |
| RN-FAC-129 | SIRO–Banco Roela 56: empresa 0447 + tipo (0 factura en LAG, 5 notificación, 9 talón) + id 8 + Vto1 AAMMDD + importe 7 + días 2 + importe 7 + días (o días máximos desde el último vencimiento) + importe 7 + convenio 10 + DV1 + DV1; la lectura exige 56 y valida solo el último DV; si no encuentra por id, busca por cuenta + Vto1 + importe. | RN-11 §2.2, §2.3 | Replicar el formato; Mejorar: validar ambos DV y la búsqueda por cuenta + importe queda como modo heredado desactivado por defecto | PRM-FAC-113 | Formato y convenio que imprime LAG |
| RN-FAC-130 | QR de pasarela: solo si la solicitud tiene id de QR, no es débito automático y el 2.º vencimiento no pasó; EMVCo con formato 01, dinámico 12, identificador del proveedor, CUIT, MCC, moneda 032, país AR, nombre (≤ 25), ciudad (≤ 15), código postal, dato adicional y CRC16. | `PR_Pagos360_QR` (RN-02 §12.6) | Replicar | PRM-FAC-114 a 119 | — |
| RN-FAC-131 | La impresión toma la primera solicitud de pasarela no anulada; hasta tres códigos por solicitud. | RN-02 §12.6; defecto de condición siempre verdadera (§16.1) | Replicar sin el defecto | — | — |
| RN-FAC-132 | La variación por cooperativa se expresa como configuración (formatos, plantillas, políticas), nunca por sigla. | V2 2264 activa ramas por sigla (RN-02 §14, §15.19; RN-11 §3) | Reemplazar | — | — |

### 6.9 Modalidad, grupos, ciclo y cierre

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-FAC-133 | El grupo de facturación agrupa la presentación fiscal y comercial; no fusiona contratos, deudas ni protecciones; la mora y el corte se evalúan por servicio. | Grupo Factura (REL §2) | Replicar con BASE §103.3 | — | — |
| RN-FAC-134 | Un grupo no agrupa distintos titulares, CUIT/DNI ni tenants, ni servicios que exigen documento independiente. | — (BASE §103.3) | Nueva | — | — |
| RN-FAC-135 | La modalidad efectiva de un caso se resuelve por prioridad: excepción por titular → por cuenta → por servicio → default del tenant, vigente al período. | — (FAC-005) | Nueva | — | — |
| RN-FAC-136 | Desarmar un grupo rige desde el período siguiente y no reabre períodos cerrados. | GSP: armar y desarmar grupos (BASE §103.1) | Nueva | — | — |
| RN-FAC-137 | El lote no puede aparentar como facturados casos pendientes; el cierre exige que la suma de estados cuadre con el universo. | — (AGR-015) | Nueva | — | — |
| RN-FAC-138 | Las excepciones trasladadas al próximo ciclo conservan su id, responsable y antigüedad. | — (AGR-015) | Nueva | — | — |
| RN-FAC-139 | Un lote cerrado no admite nuevas emisiones; los casos pendientes se emiten en un lote de reproceso vinculado al ciclo siguiente o en uno de reproceso del mismo período si el cierre se reabre. | — (AGR-015) | Nueva | — | — |
| RN-FAC-140 | Cambiar la configuración tarifaria o de reglas durante un período parcialmente procesado no reescribe emitidos; los pendientes usan la versión congelada salvo re-preparación aprobada con explicación de ajustes. | — (ESC-05) | Nueva | — | — |
| RN-FAC-141 | La propuesta de próxima facturación es fin de mes + 10 o un mes después de la última si fue hace menos de 60 días. | `GetFechaProximaFacturacion` (RN-02 §2.9) | Replicar | PRM-FAC-010, 011 | — |
| RN-FAC-142 | Al cerrar el lote, si la política está activa, cada cuenta con comprobantes bloqueados (causa de cobro) propaga la causa mínima a los comprobantes del día sin bloqueo. | V2 2769 (RN-02 §2.9) | Replicar como política | PRM-FAC-023 | — |
| RN-FAC-143 | Si hay rubros de capital y la política no lo desactiva, se registra capital sobre lo facturado al cerrar el lote. | V2 2736, 2855 (RN-02 §2.9) | Replicar por evento a M17 | PRM-FAC-061 | — |

### 6.10 Reglas transversales

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-FAC-144 | Importes en `Decimal128` con `decimal.js`; precios unitarios hasta 6 decimales; importes a 2; redondeo explícito por concepto. | Aritmética `float` en informes y apertura de cuotas (RN-02 §16.1) | Reemplazar (AGR-011) | — | — |
| RN-FAC-145 | El saldo de un comprobante no se guarda como campo editable en FAC; lo deriva M07 de movimientos e imputaciones. | `SALDO` arranca igual a `TOTAL1` en `FACTURAS` (RN-02 §1) | Reemplazar (AGR-011): FAC muestra el saldo que expone M07 | — | — |
| RN-FAC-146 | Toda operación económica o de integración acepta `Idempotency-Key` y una clave de negocio estable. | — (AGR-016) | Nueva | — | — |
| RN-FAC-147 | Fechas en UTC y cortes/vencimientos en la zona horaria del tenant. | Fechas del servidor y `ToShortDateString` regional (RN-02 §16.1) | Reemplazar (AGR-017) | — | — |
| RN-FAC-148 | Ninguna consulta se arma concatenando valores de filtros. | SQL concatenado con riesgo de inyección (RN-02 §16.1) | Reemplazar | — | — |
| RN-FAC-149 | Las reglas de negocio no muestran diálogos: devuelven advertencias que la UI confirma. | `MessageBox` en la capa de negocio (RN-02 §3.3.11) | Reemplazar | — | — |
| RN-FAC-150 | Un mismo concepto de error de informes se corrige en el reporte equivalente: IVA del interés con el factor correcto, filtro de sucursal sobre el punto de venta, signo de todas las alícuotas en créditos, filtros de cuotas facturadas correctos. | Defectos de `clsInformes_Facturacion` (RN-02 §16.1) | Descartar los defectos | — | — |
| RN-FAC-151 | El orden de renglones se recalcula sin huecos ni duplicados. | `clsItemsOrd.ActualizarOrden` (RN-02 §16.1) | Descartar el defecto | — | — |
| RN-FAC-152 | Un renglón de stock se identifica por producto y precio en todas las operaciones. | `AgregarDetalle` une por producto y precio y busca solo por producto (RN-02 §16.1) | Descartar el defecto (M11) | — | — |
| RN-FAC-153 | Con descuento, el IVA se calcula sobre el neto con descuento. | `GetItCompV` sobre neto sin descuento (RN-02 §16.1) | Descartar el defecto (M11/M06) | — | — |

## 7. Modelo de datos
> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueidentifier`, `DECIMAL`, `DATETIME2`, etc.; ver `07-ddl`). Menciones puntuales de Mongo/Mongoose/BullMQ sin tipo de columna = **comparativa histórica** Connectia, sin efecto en build.


**Campos comunes** (no se repiten en cada tabla): `TenantId` (uniqueidentifier, obligatorio, primer campo de todo índice), `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `version` (control optimista). Los documentos económicos (`invoices`, `invoiceRelations`, `billedPeriods`, `paymentSlips`, `billingCycleClosures`) **no se borran ni se editan** después de emitidos: cambian solo sus campos de estado por transiciones auditadas. Excepción acotada (DEC-107): un comprobante con CAE en línea que ARCA rechaza, o que queda detrás de uno rechazado, cambia número y estado antes de autorizarse, y solo en `returnedToDraft` su contenido (RN-FAC-164). Dinero: `DECIMAL(18,4)` (marcado `Money`); cantidades y precios unitarios `DECIMAL(18,4)` (marcado `Dec`, hasta 6 decimales). Fechas en UTC; las fechas de negocio sin hora (`Date-only`) se guardan como `YYYY-MM-DD` interpretadas en la zona horaria del tenant.

### 7.1 Ciclos, universos, plantillas y marcas

**`billingCycles`** — ciclo de facturación por servicio y universo.

| Campo | Tipo | Obl. | Descripción |
|---|---|---|---|
| `code` | String | Sí | Código del tenant (ej. `AG-C1`). Único por tenant. |
| `name` | String | Sí | Nombre visible. |
| `serviceId` | uniqueidentifier → M02 | Sí | Servicio facturado. |
| `universeId` | uniqueidentifier → `billingUniverses` | Sí | Universo de clientes. |
| `templateId` | uniqueidentifier → `billingTemplates` | Sí | Plantilla de corrida por defecto. |
| `periodicity` | Enum `monthly, bimonthly, quarterly, semiannual, annual, onDemand` | Sí | Periodicidad. |
| `calendar` | Object | Sí | `{ consumptionCutoff, periodEnd, runDate, issueDate, dueDates[1..N], nextDueDate }` (N = tope de vencimientos de PRM-FAC-163, por defecto 4; DEC-106; antes `dueDates[1..4]`); cada valor es una **expresión de fecha** `{ kind: fixedDay\|businessDay\|endOfMonthPlus\|daysFrom, value, from, shift: next\|previous\|none }`. |
| `dueDateSchemeId` | uniqueidentifier → `dueDateSchemes` | No | Trama por defecto. |
| `deliveryDefaults` | Object | No | Canales por defecto y orden de impresión. |
| `approvalPolicy` | Object | Sí | `{ requireSample, minApprovers, amountThreshold }`. |
| `autoCreateRun` | Boolean | Sí | Crear lote borrador en `runDate` (RF-FAC-008). |
| `status` | Enum `draft`, `published`, `inactive` | Sí | — |
| `validFrom` / `validTo` | Date-only | Sí / No | Vigencia. |
| `configVersionId` | uniqueidentifier → T04 | Sí | Versión de configuración publicada. |

Índices: `{tenantId, code}` único; `{tenantId, serviceId, status, validFrom}`. Origen ProCoop: `TIPO_FAC` (parte de calendario), `CALENDARIO`.

**`billingUniverses`** — criterio de pertenencia.

| Campo | Tipo | Obl. | Descripción |
|---|---|---|---|
| `code`, `name` | String | Sí | Ej. `GRUPO-CENTRO`. |
| `kind` | Enum `criteria, explicitList, set` | Sí | `set` = conjunto de facturación de ProCoop. |
| `criteria` | Object | No | `{ readingZones[], readingSectors[], readingRoutes[], deliveryRoutes[], postalZones[], postalCarriers[], postalLocalities[], categoryIds[], planIds[], billingGroupIds[], taxConditions[], branchIds[], activatedBefore, connectionStates[] }`. |
| `members` | Array `{ accountId, contractId, validFrom, validTo, addedBy, reason }` | No | Para `explicitList` y `set`. |
| `status` | Enum `draft`, `published`, `inactive` | Sí | — |
| `validFrom` / `validTo` | Date-only | Sí / No | — |
| `recordedAt` | Date | Sí | Fecha de registro (AGR-010). |

Índices: `{tenantId, code}` único; `{tenantId, "members.contractId"}`. Origen: `CONJUNTO`, filtros de `FACTMES`.

**`billingTemplates`** — plantilla de corrida versionada.

| Campo | Tipo | Obl. | Descripción |
|---|---|---|---|
| `code`, `name` | String | Sí | — |
| `templateVersion` | Int | Sí | Versión publicada (inmutable al publicar). |
| `invoiceClassCode` | String | Sí | Clasificación comercial a emitir (ex `COD_TIP`). |
| `voucherFamily` | Enum `invoice, debitNote, auto` | Sí | Tipo de comprobante base. |
| `services` | Array `{ serviceId, periodRule, readingWindow: {from, to}, billWithOthers, ownVoucherType }` | Sí | Ex `PARSERFA`. |
| `installments` | Object | No | `{ include, installmentTypes[], dueFrom, dueTo, includeDeferredInterest, groupId }`. |
| `dueDateRules` | Array de expresiones (1..N; N = tope de PRM-FAC-163, por defecto 4; DEC-106; antes 1..4) + `nextDueDate` | Sí | — |
| `dueDateSchemeId` | uniqueidentifier | No | — |
| `orderBy` | Enum `account, alphabetical, postalZsr, deliveryRoute, streetNumber` | Sí | — |
| `options` | Object | Sí | `{ forceTariffTable: {enabled, effectiveDate}, skipAdvances, skipFreight, periodByClass }`. |
| `printTemplateId` | uniqueidentifier | No | — Referencia: `invoiceTemplates` (M05) [VERIFICAR]. |
| `status` | Enum `draft`, `published`, `retired` | Sí | — |
| `previousVersionId` | uniqueidentifier | No | — Referencia: `billingTemplates` (M05). |

Índices: `{tenantId, code, templateVersion}` único. Origen: `TIPO_FAC`, `PARSERFA`.

**`billingHolds`** — marcas "no facturar". **Reemplazado por** `blocks` de M01 (CTR-DAT-36 de T05): el bloqueo de facturación de cuenta o contrato (`SUMNOFAC`, flag `NOFACTURAR`) vive en M01; M05 lo lee al preparar el universo y no crea esta colección. Se conserva la definición como referencia de campos.

Campos: `scope` (Enum `account, contract, service`), `accountId`, `contractId`, `serviceId`, `reason` (String), `validFrom`, `validTo`, `active` (Boolean), `releasedBy`, `releasedAt`. Índice `{tenantId, accountId, active}`. Origen: `SUMNOFAC` (`USU_NOF`, `FEC_NOF`, `USU_FAC`, `FEC_FAC`, `ACTIVO`) y flag `NOFACTURAR` del servicio.

### 7.2 Lote, universo congelado y bandeja de excepciones

**`billingRuns`** — lote de facturación.

| Campo | Tipo | Obl. | Descripción |
|---|---|---|---|
| `code` | String | Sí | Ej. `LOTE-AG-DEMO-001`. Único por tenant. |
| `kind` | Enum `cycle, adHoc, reprocess, simulation, rebill` | Sí | `reprocess` reprocesa pendientes de otro lote. |
| `cycleId` | uniqueidentifier | No | Ciclo origen. |
| `parentRunId` | uniqueidentifier | No | Lote del que reprocesa. Referencia: `billingRuns` (M05). |
| `templateId` / `templateVersion` | uniqueidentifier / Int | Sí | Congelados. Referencia: `templateId` → `billingTemplates` (M05); `templateVersion` es número de versión, no es referencia. |
| `serviceIds` | Array uniqueidentifier | Sí | — |
| `period` | String `YYYY-MM` (CTR-DAT-31; antes ~~`{ year, month }`~~) | Sí | Período general; la pasada la da `sequence`. |
| `servicePeriods` | Array `{ serviceId, period, readingFrom, readingTo }` | Sí | Ex `SFACTME`. |
| `sequence` | Int | Sí | 0 = primera pasada. |
| `target` | Enum `allUniverse, single, several, controlAccounts` | Sí | — |
| `targetAccounts` | Array uniqueidentifier | No | Ex `FACTMES_CTAS`. Referencia: → `accounts` (M01). |
| `filters` | Object | No | Copia de criterios aplicados. |
| `issueDate` | Date-only | Sí | Fecha de emisión resuelta. |
| `dueDates` | Array `{ index, date }` (1..N; N = tope de PRM-FAC-163, por defecto 4; DEC-106; antes 1..4) + `nextDueDate` | Sí | Resueltas. |
| `orderBy` | Enum | Sí | — |
| `options` | Object | Sí | Copia de opciones. |
| `universe` | Object | Sí | `{ currentVersion, versions: [{ version, frozenAt, frozenBy, hash, counts, diff: {added, removed}, reason }] }`. |
| `ruleVersions` | Object | Sí | `{ configVersionId, tariffVersionIds[], dueDateSchemeVersion, voucherMatrixVersion, billingModePolicyVersion, groupVersions }`. |
| `status` | Enum (ver §8.2) | Sí | — |
| `authorizationPhase` | Enum `notRequired`, `pending`, `inProgress`, `completed`, `completedWithIssues` | Sí | — |
| `distributionPhase` | Enum `notStarted`, `inProgress`, `completed`, `completedWithIssues` | Sí | — |
| `counters` | Object | Sí | `{ selected, excluded, blocked, prebilled, warnings, approved, issued, issuedObserved, fiscalRejected, requeued, uncertain, pending, carriedOver, zeroAmount }` (`requeued` = en cola para renumerar; `fiscalRejected` = devueltos a borrador; DEC-107). |
| `totals` | Array `{ serviceId, conceptId, net, taxes, total }` (Money) | No | Totales del lote. |
| `comparison` | Object | No | `{ previousRunId, previousTotal, variationPct, casesOverThreshold }`. |
| `sample` | Object | No | `{ seed, itemIds[], reviewedBy, reviewedAt }`. |
| `approvals` | Array `{ step, userId, decision, at, comment, workflowInstanceId }` (T05 §7.2; antes ~~`workflowId`~~) | No | — |
| `progress` | Object | No | `{ phase, processed, total, ratePerMinute, etaAt, lastConfirmedBlock, currentBlock }`. |
| `pause` | Object | No | `{ reason, code, source, at, by }`. |
| `lockKey` | String | Sí | `tenant:cycle\|template:period:sequence` (exclusión mutua). |
| `jobIds` | Array String | No | Jobs Azure Queue Storage. |
| `overrides` | Array `{ validation, reason, approvedBy, at }` | No | — |
| `startedAt` / `finishedAt` | Date | No | — |
| `legacy` | Object | No | Subdocumento `legacy` de T05 §19.1 (CTR-DAT-32): `ID_REC` va en `legacy.key`; antes ~~`{ procoopIdRec }`~~. Solo consulta. |

Índices: `{tenantId, code}` único; `{tenantId, lockKey}` único parcial sobre estados activos (`preparing, prebilling, issuing`); `{tenantId, cycleId, period, sequence}`; `{tenantId, status}`. Origen: `FACTMES`, `SFACTME`, `FACTMES_CTAS`.

**`billingRunItems`** — caso del universo congelado.

| Campo | Tipo | Obl. | Descripción |
|---|---|---|---|
| `runId` | uniqueidentifier | Sí | — |
| `itemCode` | String | Sí | Ej. `ITEM-099`. |
| `universeVersion` | Int | Sí | Versión en la que entró. |
| `accountId`, `holderId`, `associateMembershipId` | uniqueidentifier → M01 / M01 / M17 | Sí / Sí / No | `associateMembershipId` (antes `memberId`; nombre canónico de T05 §7.2.1, PA-DAT-04) → `associateMemberships` (M17). |
| `billingMode` | Enum `separate, grouped` | Sí | Resuelto por RN-FAC-135. |
| `billingGroupId` / `groupVersion` | uniqueidentifier / Int | No | Referencia: `billingGroupId` → `billingGroups` (M05); `groupVersion` es número de versión, no es referencia. |
| `contracts` | Array `{ contractId, serviceId, consumptionIds[], consumptionVersions[], billableItemIds[], installmentIds[], eligibilityReason }` | Sí | Foto de cantidades. |
| `isSample` | Boolean | Sí | Muestra de control. |
| `status` | Enum (ver §8.3) | Sí | — |
| `exclusion` | Object | No | `{ reasonCode, note, approvedBy, at }`. |
| `exceptionIds` | Array uniqueidentifier | No | — |
| `prebill` | Object | No | `{ calculationResultIds[], candidates: [{ candidateKey, voucherTypeId, letter, pointOfSaleId, serviceBlocks[{serviceId, contractId, subtotal}], net, taxes, total, dueTotals[] }], computedAt }`. |
| `comparison` | Object | No | `{ previousInvoiceIds[], previousTotal, variationPct, flagged }`. |
| `warnings` | Array `{ code, message }` | No | — |
| `invoiceIds` | Array uniqueidentifier | No | Comprobantes emitidos. |
| `idempotencyKey` | String | Sí | `tenant:run:item:universeVersion`. |
| `attempts` | Int | Sí | — |
| `lastError` | Object | No | `{ code, message, at }`. |
| `carriedOverToRunId` | uniqueidentifier | No | — Referencia: `billingRuns` (M05). |
| `preReview` | Object | No | Revisión previa (RF-FAC-174; HUE-ELE-02): `{ required, reasons[] (categoría, condición especial, `requiresReview` de M04), status (`pending`, `approved`, `returned`, `excluded`), reviewerId, decidedAt, note }`. |
| `serviceDependencies` | Array `{ serviceId, dependsOnServiceId, dependsOnContractId, resolved }` | No | Dependencias entre servicios relacionados resueltas al preparar (RF-FAC-175; HUE-CLO-02). |

Índices: `{tenantId, runId, itemCode}` único; `{tenantId, runId, status}`; `{tenantId, idempotencyKey}` único; `{tenantId, accountId, runId}`; `{tenantId, runId, 'preReview.status'}`.

**`billingRunNumberRanges`** — rangos de numeración emitidos.

Campos: `runId`, `voucherTypeId`, `numberingVoucherTypeId` (relacionado), `pointOfSaleId`, `fromNumber`, `toNumber` (Int), `count`, `authorizationType` (Enum `CAE, CAEA, CAI, CESP, none`), `requiresAuthorization` (Boolean), `blockNo`, `releases[] { number, invoiceId, reason: arcaRejected|sequenceRelease, releasedAt, reassignedNumber }` (DEC-107). Los rangos registran los números **definitivos**; mientras haya comprobantes CAE sin autorizar el rango es provisorio y se recalcula al renumerar (RN-FAC-164). Índice `{tenantId, runId}`. Origen: `FACTMES_COMP`.

Campos de `billingRunNumberRanges` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `runId` | uniqueidentifier | Sí | — | `billingRuns` (M05) |
| `voucherTypeId` | uniqueidentifier | [VERIFICAR] | — | `voucherTypes` (M05) |
| `numberingVoucherTypeId` | uniqueidentifier | [VERIFICAR] | Relacionado | `voucherTypes` (M05) |
| `pointOfSaleId` | uniqueidentifier | Sí | — | `pointsOfSale` (M06) |
| `fromNumber` | int | [VERIFICAR] | — | — |
| `toNumber` | int | [VERIFICAR] | Int | — |
| `count` | int | [VERIFICAR] | — | — |
| `authorizationType` | enum | [VERIFICAR] | Enum `CAE, CAEA, CAI, CESP, none` | — |
| `requiresAuthorization` | bool | [VERIFICAR] | Boolean | — |
| `blockNo` | int | [VERIFICAR] | — | — |
| `releases[]` | array | No | Números liberados del rango por un rechazo de ARCA y número reasignado (`number`, `invoiceId`, `reason`, `releasedAt`, `reassignedNumber`; RN-FAC-164; DEC-107) | `invoices` (M05) |

**`billingExceptions`** — bandeja de excepciones.

| Campo | Tipo | Obl. | Descripción |
|---|---|---|---|
| `code` | String | Sí | Correlativo legible. |
| `runId`, `runItemId` | uniqueidentifier | Sí | Origen. |
| `accountId`, `holderId`, `contractId`, `serviceId` | uniqueidentifier | Sí / Sí / No / No | — |
| `period` | String `YYYY-MM` (CTR-DAT-31; antes ~~`{ year, month }`~~) | Sí | — |
| `reasonCode` | String → `billingExceptionReasons` | Sí | Ej. `FISCAL_TAXID_MISSING`. |
| `category` | Enum `customerFiscalData, reading, tariff, contract, configuration, pointOfSale, numbering, dueDate, thirdPartyAgreement, integration, printing, delivery, other` | Sí | — |
| `stage` | Enum `prevalidation, prebilling, approval, issuing, authorization, printing, distribution` | Sí | — |
| `severity` | Enum `blocking, warning` | Sí | — |
| `message` | String (clave dict + parámetros) | Sí | Ej. "Factura A sin CUIT". |
| `missingData` | Array String | No | Campos faltantes. |
| `externalCode` | String | No | Código de rechazo de ARCA u otro. |
| `status` | Enum (ver §8.4) | Sí | — |
| `ownerModule` | Enum `PER, CAT, MED, TAR, FIS, COB, FAC` | Sí | — |
| `ownerRole` / `assigneeId` | String / uniqueidentifier | Sí / No | Responsable. Referencia: `ownerRole` → `roles` (T02), por clave del rol; `assigneeId` → `memberships` (T02). Confirmado en PA-FAC-23 (DEC-072; antes «`roles` (T02) [VERIFICAR]»). |
| `nextAction` | String (dict) | Sí | Ej. "Completar y validar situación fiscal". |
| `deepLink` | String | No | Ruta a la pantalla de corrección. |
| `dueAt` | Date | No | Según SLA (PA-FAC-18). |
| `resolution` | Object | No | `{ action: corrected\|excluded\|carriedOver\|dismissed, by, at, note, evidenceId }`. |
| `reprocessRunId` | uniqueidentifier | No | Ejecución vinculada. Referencia: `billingRuns` (M05). |
| `history` | Array `{ at, by, fromStatus, toStatus, note }` | Sí | — |

Índices: `{tenantId, status, ownerRole}`; `{tenantId, runId}`; `{tenantId, assigneeId, status}`; `{tenantId, accountId}`.

**`billingExceptionReasons`** — catálogo de motivos: `code`, `category`, `severity`, `defaultOwnerRole`, `ownerModule`, `nextActionKey`, `deepLinkTemplate`, `slaHours`, `systemic` (Boolean: cuenta para la detección de fallo global), `active`. Precarga mínima: `FISCAL_TAXID_MISSING`, `FISCAL_CONDITION_INCOMPATIBLE`, `READING_PENDING`, `READING_INCONSISTENT`, `TARIFF_NOT_FOUND`, `TARIFF_VERSION_CHANGED`, `CONTRACT_INACTIVE`, `VOUCHER_UNRESOLVED`, `POS_CONFLICT`, `POS_DISABLED`, `SEQUENCE_MISSING`, `DUE_DATE_INVALID`, `THIRD_PARTY_NO_AGREEMENT`, `NEGATIVE_TAX_BASE`, `ZERO_QUANTITY`, `CALCULATION_ERROR`, `FISCAL_REJECTED`, `FISCAL_UNCERTAIN`, `BARCODE_OVERFLOW`, `BARCODE_FORMAT_MISSING`, `DELIVERY_NO_CONTACT`, `DELIVERY_BOUNCED`, `GROUP_PERIODICITY_MISMATCH`, `MIXED_POS_IN_GROUP`, `RELATED_SERVICE_MISSING` (servicio relacionado faltante, dado de baja o sin consumo aprobado; `TAR-E-RELATED-MISSING` de M04; dueño M02/M03; HUE-CLO-02), `PRE_REVIEW_RETURNED` (devuelto por la revisión previa; HUE-ELE-02), `METERING_REGIME_READING_MISSING` (cambio a no medido sin lectura de retiro; `TAR-E-REGIME-READING-MISSING` de M04; dueño M03; HUE-AG-03), `RECEIVER_DOCUMENT_PENDING` (receptor con identificación `documentPending` y comprobante que exige documento; categoría `customerFiscalData`; dueño M01; RN-FAC-162, DEC-099).

Campos de `billingExceptionReasons` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | Sí | — | — |
| `category` | [VERIFICAR] | [VERIFICAR] | — | — |
| `severity` | [VERIFICAR] | [VERIFICAR] | — | — |
| `defaultOwnerRole` | [VERIFICAR] | [VERIFICAR] | — | — |
| `ownerModule` | [VERIFICAR] | [VERIFICAR] | — | — |
| `nextActionKey` | string | [VERIFICAR] | — | — |
| `deepLinkTemplate` | [VERIFICAR] | [VERIFICAR] | — | — |
| `slaHours` | [VERIFICAR] | [VERIFICAR] | — | — |
| `systemic` | bool | [VERIFICAR] | Boolean: cuenta para la detección de fallo global | — |
| `active` | bool | [VERIFICAR] | — | — |

**`billedPeriods`** — marca anti doble facturación.

Campos: `contractId`, `serviceId`, `period` (`YYYY-MM`; CTR-DAT-31 — antes ~~`{year, month}`~~), `sequence` (Int), `invoiceId`, `serviceBlockId`, `runId`, `status` (Enum `active, released`), `releasedByInvoiceId` (NC/anulación), `releasedAt`. Índice **único parcial** `{tenantId, contractId, serviceId, period, sequence}` con `status = active` (antes con `period.year`, `period.month`). Origen: `SERSOC.ULT_FAC`, `SEC_PER`, `CNT_FAC`.

Campos de `billedPeriods` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `contractId` | uniqueidentifier | Sí | — | `serviceContracts` (M02) |
| `serviceId` | uniqueidentifier | Sí | — | `tenantServices` (M02) |
| `period` | string | Sí | `YYYY-MM`; CTR-DAT-31 — antes ~~`{year, month}`~~ | — |
| `sequence` | int | Sí | Int | — |
| `invoiceId` | uniqueidentifier | Sí | — | `invoices` (M05) |
| `serviceBlockId` | uniqueidentifier | Sí | Bloque del servicio facturado (PA-FAC-23; antes [VERIFICAR]) | → `invoices.serviceBlocks` (subdocumento, M05) |
| `runId` | uniqueidentifier | [VERIFICAR] | — | `billingRuns` (M05) |
| `status` | enum | Sí | Enum `active`, `released` | — |
| `releasedByInvoiceId` | uniqueidentifier | [VERIFICAR] | NC/anulación | [VERIFICAR] destino no declarado |
| `releasedAt` | datetime | [VERIFICAR] | — | — |

**`billableItems`** — ítems facturables pendientes.

| Campo | Tipo | Obl. | Descripción |
|---|---|---|---|
| `sourceModule` | Enum `FAC, VEN, MOR, TEC, MED, FIS, MIG, SOC, TAR` | Sí | Quién lo generó (`SOC` = M18: depósitos de préstamo ortopédico y aportes al fondo de subsidio; `TAR` = M04: cargos precargados del motor —derecho de sepultura, actos y traslados sociales, equipo no devuelto, conceptos de telefonía móvil importados, gas prorrateado—, que absorben `preloadedCharges` de M04 por CTR-DAT-38). |
| `sourceType` | Enum `manualCharge, retroactive, retroactiveInterest, thirdPartyImport, saleInstallment, financingInstallment, deferredInterest, technicalCharge, freight, mobileProviderImport, gasProration, equipmentNotReturned, socialAct, socialTrip, migration, other` | Sí | Los valores `mobileProviderImport` … `socialTrip` corresponden al ex `preloadedCharges.origin` de M04 (CTR-DAT-38). |
| `sourceRef` | `{ type, id }` | No | Ej. operación masiva, venta; para M04, `assignmentId`, `actId`, `tripId` o datos del cálculo de gas prorrateado (ex `originRef`). Índice único `{tenantId, sourceModule, "sourceRef.id"}` cuando está presente (idempotencia; COL-FAC-11). |
| `accountId`, `contractId`, `serviceId` | uniqueidentifier | Sí / No / No | — |
| `conceptId` | uniqueidentifier → M02 | Sí | — |
| `description` | String | No | — |
| `quantity` / `unitPrice` | Dec | Sí | — |
| `amount` | Money | Sí | — |
| `period` | String `YYYY-MM` (CTR-DAT-31; antes ~~`{year, month}`~~) | No | Vacío = primer lote del servicio. |
| `basePeriod` | String `YYYY-MM` (CTR-DAT-31) | No | Retroactivos (`PERIODOB`). |
| `targetGroupId` / `invoiceClassCode` | uniqueidentifier / String | No | Destino. Referencia: `billingGroups` (M05). |
| `dueDate` | Date-only | No | Cuotas. |
| `thirdPartyAgreementId` | uniqueidentifier → M06 | No | — |
| `itemClass` | Enum `standard, guaranteeDeposit, subsidyFundContribution, burialRightAcquisition, burialRightMaintenance` | Sí | Clase del ítem facturable (RF-FAC-176, RN-FAC-156); default `standard`. Determina el bloque de impresión, la clase fiscal que aplica M06 y el rol contable de la obligación publicada a M07/M15. |
| `currency` | String ISO 4217 | Sí | Default `ARS`. |
| `approvedBy` / `approvedAt` | uniqueidentifier / DateTime | No | Aprobación del cargo manual sobre el umbral PRM-TAR-152 de M04 (ex `preloadedCharges.approvedBy`). |
| `calculationId` | uniqueidentifier → M04 `calculations` | No | Cálculo que lo incluyó (RN-TAR-007). |
| `status` | Enum `proposed`, `pending`, `reserved`, `billed`, `cancelled` | Sí | `proposed` = pendiente de aprobación (umbral de M04); `reserved` = tomado por un lote preparado. |
| `reservedByRunId` / `invoiceId` | uniqueidentifier | No | — Referencia: `billingRuns` (M05). |

Índices: `{tenantId, accountId, status}`; `{tenantId, contractId, status, period}`; `{tenantId, sourceModule, "sourceRef.id"}` único parcial. Origen: `PRCAGAS` (filas pendientes; CTR-DAT-38, que absorbe `preloadedCharges` de M04; las de gas prorrateado con `sourceType = gasProration` y [VERIFICAR] en LAG según CTR-TAR-29), `DEUDAVTA` (proyección), `INTERNAC`, `LLA_CEL` (proyección). Es la única colección de lo pendiente de facturar (RF-FAC-116); otros módulos la escriben con `fac.service.upsertBillableItem` (§11.7).

### 7.3 Comprobante

**`invoiceDrafts`** — borradores mutables de factura manual, replicada o refacturación: mismos bloques que `invoices` (`header`, `lines`, `dueDates`) sin número ni estado fiscal, más `legalEntityId` (obligatorio; DEC-064), `origin`, `sourceInvoiceId`, `status` (`editing, validated, discarded, issued`), `issuedInvoiceId`, `validationResult`. Índice `{tenantId, createdBy, status}`.

Campos de `invoiceDrafts` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `origin` | [VERIFICAR] | [VERIFICAR] | — | — |
| `sourceInvoiceId` | uniqueidentifier | [VERIFICAR] | — | [VERIFICAR] destino no declarado |
| `status` | enum | Sí | `editing`, `validated`, `discarded`, `issued` | — |
| `issuedInvoiceId` | uniqueidentifier | [VERIFICAR] | — | [VERIFICAR] destino no declarado |
| `validationResult` | [VERIFICAR] | [VERIFICAR] | — | — |

**`invoices`** — comprobante emitido (cabecera, bloques por servicio, renglones, tributos, vencimientos, relaciones). Inmutable una vez autorizado (o emitido, si no requiere autorización en línea); mientras espera el CAE solo cambian su número y estado por RN-FAC-164, y su contenido solo en `returnedToDraft` (DEC-107); las fechas de vencimiento se corren, en la misma transacción que registra la autorización, si esta llega después del primer vencimiento (RN-FAC-165; 10-11-2026). Los renglones se embeben (acotados por diseño a `PRM-FAC-049` renglones, por defecto 500); para BI se proyectan a la vista de reportes de T10.

| Campo | Tipo | Obl. | Descripción |
|---|---|---|---|
| `legalEntityId` | uniqueidentifier → T04 `legalEntities` | Sí | Entidad jurídica emisora (DEC-064, DEC-087): se toma de `serviceContracts.legalEntityId` o, si está vacío, de `tenantServices.legalEntityId` (M02); determina CUIT emisor, perfil fiscal, punto de venta y numerador. Un comprobante tiene una sola entidad (RN-FAC-157). |
| `voucherTypeId` | uniqueidentifier → `voucherTypes` | Sí | — |
| `voucherClass` | Enum `invoice, debitNote, creditNote, publicServiceSettlement, publicServiceCredit, ticket, internal, cvlp, cashInvoice` | Sí | — |
| `arcaVoucherCode` | Int | No | Código ARCA del tipo. |
| `letter` | Enum `A, B, C, M, E, X` | Sí | `X` = sin letra/interno. |
| `direction` | Enum `debit, credit` | Sí | — |
| `pointOfSaleId` / `posNumber` | uniqueidentifier / Int | Sí | — |
| `number` | Int | Sí (salvo en `returnedToDraft` y `requeued`) | Asignado al emitir; en comprobantes con CAE en línea es provisorio hasta el CAE y se libera (`null`) si ARCA rechaza el comprobante o uno anterior del mismo numerador (RN-FAC-164; DEC-107). *Reemplazado (10-11-2026, DEC-107): "Asignado al emitir."* |
| `fullNumber` | String | Sí (salvo en `returnedToDraft` y `requeued`) | `0002-00001001`. |
| `numberAssignments` | Array `{ number, numberSequenceId, assignedAt, releasedAt, reason: initialIssue\|arcaRejected\|sequenceRelease\|reissueAfterCorrection\|reissueAfterRelease, arcaCode, billingRunId, actor }` | Sí | Historial de cada número asignado, liberado y reasignado con su motivo (RN-FAC-164 punto 8; DEC-107). |
| `issueAttempt` | Int | Sí | Intento de emisión (1 al emitir; +1 en cada reemisión tras `returnedToDraft` o `requeued`); viaja en `fac.invoice.issued` para que los consumidores distingan la reemisión (DEC-107). |
| `emissionSeq` | Int | No | Orden de emisión dentro del lote; define el orden de renumeración de los `requeued` (RN-FAC-164 punto 5; DEC-107). |
| `numberSequenceId` | uniqueidentifier | Sí | Numerador usado. Antes `numberingSequenceId` (nombre de T05). |
| `origin` | Enum `batch, manual, rebill, replica, reversal, import, prepaid, sale, interest, inSitu, migration` | Sí | — |
| `billingRunId` / `billingRunItemId` / `billingCycleId` | uniqueidentifier | No | — |
| `invoiceClassCode` | String | Sí | Clasificación comercial (ex `TIPO`/`COD_TIP`). |
| `period` | String `YYYY-MM` + `sequence` (CTR-DAT-31; antes ~~`{year, month}`~~) | Sí | — |
| `billingMode` | Enum `separate, grouped` | Sí | — |
| `billingGroupId` / `billingGroupVersion` | uniqueidentifier / Int | No | — |
| `customer` | Object | Sí | `{ personId, holderId, associateMembershipId (antes memberId; → associateMemberships, M17), accountId, name, taxIdType, taxId, taxCondition, isMiPyme, serviceAddress, postalAddress (histórico a la fecha), deliveryAddress }`. |
| `issueDate` | Date-only | Sí | — |
| `servicePeriodFrom` / `servicePeriodTo` | Date-only | No | Período facturado (dato fiscal de servicios). |
| `dueDates` | Array `{ index (1..N), date, total (Money), surcharge (Money), surchargeTax (Money) }` | Sí | De 1 hasta el tope efectivo del comprobante (PRM-FAC-163, por defecto 4; RN-FAC-163; DEC-106). *Reemplazado (10-11-2026, DEC-106): "`index (1..4)` … Hasta 4."* La lista no cambia de estructura al subir el tope. |
| `dueDateCap` | Object | Sí | `{ effective (Int), source: tenant\|voucherType\|service, perAgency[{ agencyId, formatId, published (Int) }] }`: tope aplicado al emitir y cantidad de vencimientos publicada ante cada formato o ente cuando alguno admite menos (los primeros N; RN-FAC-163; DEC-106). |
| `lateAuthorizationGraceDays` | Int ≥ 0 | Cond. | Días de gracia resueltos al emitir (trama o PRM-FAC-164) para correr los vencimientos si la autorización llega después del primero; obligatorio si `requiresAuthorization = true` (RN-FAC-165; DEC-107, 10-11-2026). |
| `lateAuthorizationShift` | Object | No | `{ authorizedAt, graceDays, shiftDays, originalDueDates[{ index, date }], originalNextDueDate }`: corrimiento aplicado al autorizarse después del primer vencimiento o al reenviarse a ARCA (RN-FAC-165; DEC-107, 10-11-2026). |
| `nextDueDate` | Date-only | No | — |
| `currency` / `exchangeRate` | String / Dec | Sí / No | `ARS` por defecto (ex `FACTURAS_EXTRAS`). |
| `sellerId`, `warehouseId` | uniqueidentifier | No | Vendedor y depósito (`warehouses` de M13; T05 §7.2 — antes ~~`depotId`~~). Referencia: vendedor como usuario del tenant (`memberships` de T02, según el canal de venta de M11), asumido en PA-FAC-21 (DEC-072); antes [VERIFICAR] vendedor (`employees` de M16 o `memberships` de T02). |
| `serviceBlocks` | Array (ver abajo) | Sí | Al menos uno salvo comprobantes sin servicio (venta, interés). |
| `lines` | Array (ver abajo) | Sí | — |
| `taxes` | Array `{ taxId, kind: vat\|perception\|municipal\|provincial\|fund\|other, jurisdiction, rate (Dec), base (Money), amount (Money), serviceBlockId, thirdPartyAgreementId }` | No | Calculado por M06. |
| `totals` | Object (Money) | Sí | `{ subNet, discountPct, discount, net, nonTaxed, exempt, vat, perceptions, otherTaxes, thirdParty, rounding, advancesApplied, total }`. |
| `commercialStatus` | Enum `issued`, `returnedToDraft`, `requeued`, `annulled`, `reversed`, `partiallyReversed` | Sí | Ver §8.5. `returnedToDraft` y `requeued` solo para comprobantes con CAE en línea antes de autorizarse (RN-FAC-164; DEC-107; antes sin esos valores). |
| `fiscal` | Object | Sí | `{ status, authorizationType: CAE\|CAEA\|CAI\|CESP\|none, cae, caeDueDate, caeaId, cespId, caiNumber, caiDueDate, requestId, attempts, queuedAt, authorizedAt, observations[{code, message}], rejection{code, message}, qrPayload, provincialValidationCode }`. Lo escribe solo el consumidor de eventos de M06. |
| `block` | Object | No | `{ reasonId, since, by, note }` vigente. |
| `obligations` | Array `{ serviceBlockId, serviceId, contractId, amount (Money), obligationRef }` | Sí | Una por servicio (FAC-008), publicada a M07. |
| `paymentCodes` | Array `{ formatId, formatVersion, documentPrefix, code, dueIndexes[], channel, generatedAt }` | No | — |
| `paymentSlipIds` | Array uniqueidentifier | No | — |
| `documentIds` | Array uniqueidentifier → `invoiceDocuments` | No | PDF por versión. |
| `relationsSummary` | Object | No | `{ reversedBy[], reversalOf, annulmentRequestId }` (fuente: `invoiceRelations`). |
| `observations` | String | No | Ex `OB_FACT`. |
| `printMessages` | Array String | No | Mensajes personalizados. |
| `flags` | Object | No | `{ manualCredit, zeroByConsumption, distributedGenerationCredit, prepaidSale, inSitu }`. |
| `calculationTrace` | Object | Sí | `{ calculationResultIds[], ruleVersions }` (M04). |
| `idempotencyKey` | String | Sí | — |
| `legacy` | Object | No | `{ idFac, codCom, sucCom, numCom, tipo, codSit }`. |

Sub-documento `serviceBlocks[]`: `blockId`, `serviceId`, ~~`serviceCode`~~ (se resuelve desde `serviceId`), `contractId`, `accountId` (suministro; CTR-DAT-30 — antes ~~`supplyId`~~), `meterId`, `categoryId`, `tariffVersionId`, `period`, `readings` `{ previousDate, previousValue, currentDate, currentValue, consumption (Dec), unit, multiplier, estimated, days }`, `calculationResultId`, `subtotalNet`, `subtotalTaxes`, `subtotal` (Money), `thirdParty` (Boolean), `printGroupId`, `chart` `{ groupId, series[{period, consumption}] }`.

Sub-documento `lines[]`: `lineId`, `order`, `blockId`, `kind` (Enum `fixedCharge, consumption, product, installment, deferredInterest, tax, thirdParty, surcharge, discount, advance, rounding, interest, freight, dgCredit, other`), `conceptId`, `description`, `quantity` (Dec), `unit`, `unitPrice` (Dec, 6 decimales), `discountPct`, `net` (Money), `vatRate`, `vat`, `otherTaxes`, `total` (Money), `servicePeriod`, `categoryId`, `itemClass` (copia de `billableItems.itemClass`; RN-FAC-156), `sourceRef` `{ type: billableItem|installment|consumption|calculationLine|call, id }`, `extras` `{ cosFi, ncosFi, method, cosFiCap, tariffTableId }` (ex `ITEMSFAC_EXTRAS`), `printOrderId`, `aggregate` (Boolean).

Índices: **único** `{tenantId, numberSequenceId, number}` (el numerador ya es por entidad jurídica), **parcial** sobre `number` no nulo, para que un número liberado pueda reasignarse a otro comprobante (DEC-107; antes índice total); `{tenantId, legalEntityId, issueDate}`; `{tenantId, "customer.accountId", issueDate}`; `{tenantId, billingRunId}`; `{tenantId, "fiscal.status", issueDate}`; `{tenantId, idempotencyKey}` único; `{tenantId, "serviceBlocks.contractId", "period"}` (antes con `period.year`, `period.month`); `{tenantId, "block.reasonId"}` parcial. Origen: `FACTURAS`, `ITEMSFAC`, `ITEMSFAC_EXTRAS`, `FACTURAS_EXTRAS`, `OB_FACT`, `CREDITOS_NOAUTOMATICOS`, `ANUFAC`/`ANUITEMSFAC`/`ANUITEMSFAC_EXTRAS` (como comprobantes `annulled`).

**`invoiceRelations`** — relaciones entre comprobantes.

Campos: `originInvoiceId`, `generatedInvoiceId`, `relationType` (Enum `reversal, partialCredit, debitAdjustment, rebill, replica, manual, administrative, interestOn`), `affectedServiceBlockIds[]`, `amount` (Money), `isAnnulment` (Boolean), `reportToTaxAuthority` (Boolean, ex `INFORMAR_CUIT`), `hidden` (ex `NOMOSTRAR`), `discountsInvoice` (ex `BONIFICA_FACTURA`), `reason`, `requestId`. Índices `{tenantId, originInvoiceId}`, `{tenantId, generatedInvoiceId}`. Origen: `RELACION_COMP`, `COMPROBANTES_ADM` (tipo `administrative`).

Campos de `invoiceRelations` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `originInvoiceId` | uniqueidentifier | Sí | — | [VERIFICAR] destino no declarado |
| `generatedInvoiceId` | uniqueidentifier | Sí | — | [VERIFICAR] destino no declarado |
| `relationType` | enum | Sí | Enum `reversal, partialCredit, debitAdjustment, rebill, replica, manual, administrative, interestOn` | — |
| `affectedServiceBlockIds[]` | uniqueidentifier[] | No | Vacío = todos los bloques (PA-FAC-23; antes [VERIFICAR]) | → `invoices.serviceBlocks` (subdocumento, M05) |
| `amount` | Money | [VERIFICAR] | Money | — |
| `isAnnulment` | bool | [VERIFICAR] | Boolean | — |
| `reportToTaxAuthority` | bool | [VERIFICAR] | Boolean, ex `INFORMAR_CUIT` | — |
| `hidden` | bool | [VERIFICAR] | Ex `NOMOSTRAR` | — |
| `discountsInvoice` | [VERIFICAR] | [VERIFICAR] | Ex `BONIFICA_FACTURA` | — |
| `reason` | string | [VERIFICAR] | — | — |
| `requestId` | uniqueidentifier | [VERIFICAR] | — | `invoiceAnnulmentRequests` (M05) |

**`invoiceAnnulmentRequests`** — solicitud de anulación o reversión: `invoiceIds[]`, `mode` (Enum `annul, reverse, partialCredit, debitAdjustment`), `options` `{ revertConsumptions, allowRebilling, releaseCreditsDebits, revertStock, dueDates[] }`, `reason`, `evidenceIds[]`, `status` (Enum `draft, pendingApproval, approved, rejected, executing, executed, partiallyExecuted, failed`), `workflowInstanceId` (T05 §7.2; antes ~~`workflowId`~~), `excluded[] {invoiceId, reason}`, `resultInvoiceIds[]`, `fiscalCheck` `{ checkedAt, result }`. Origen: proceso `clsAnulacionFacturas`. También recibe los pedidos de ajuste por NC/ND de las diferencias retroactivas de M04 (`retroactiveDiffRuns.adjustmentRequestIds`, modos `partialCredit` y `debitAdjustment`; PA-FAC-22).

Campos de `invoiceAnnulmentRequests` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `invoiceIds[]` | uniqueidentifier[] | [VERIFICAR] | — | `invoices` (M05) |
| `mode` | enum | [VERIFICAR] | Enum `annul, reverse, partialCredit, debitAdjustment` | — |
| `options` | [VERIFICAR] | [VERIFICAR] | — | — |
| `reason` | string | [VERIFICAR] | — | — |
| `evidenceIds[]` | uniqueidentifier[] | [VERIFICAR] | — | `documents` (T11) |
| `status` | enum | Sí | Enum `draft`, `pendingApproval`, `approved`, `rejected`, `executing`, `executed`, `partiallyExecuted`, `failed` | — |
| `workflowInstanceId` | uniqueidentifier | Sí | (T05 §7.2; antes ~~`workflowId`~~), `excluded[] {invoiceId, reason}` | `workflowInstances` (T11) |
| `resultInvoiceIds[]` | uniqueidentifier[] | [VERIFICAR] | — | [VERIFICAR] destino no declarado |
| `fiscalCheck` | [VERIFICAR] | [VERIFICAR] | — | — |
| `number` | string | Sí | Número de la solicitud (único en T05). | — |

**`invoiceBlockReasons`** — `code`, `description`, `active`, `blocksChannels[]` (caja, pasarelas, débito). Origen `CAUBLOQ`. **Reemplazado por** `holdReasons` de M08 (CTR-DAT-36 de T05).

**`invoiceBlockHistory`** — `invoiceId`, `reasonId` (nulo = desbloqueo), `at`, `by`, `note`, `source` (Enum `manual, mass, propagation, interestUnblock`), `massOperationId`. Origen `HISBLOQ`. **Reemplazado por** `documentHolds` de M08 (CTR-DAT-36 de T05): M05 opera el bloqueo (RF-FAC-093 a RF-FAC-097) con el servicio de M08 y conserva en `invoices.block` solo la proyección vigente.

**`invoiceExternalData`** — datos de terceros para imprimir: `invoiceId`, `accountId`, `providerCode`, `fields` (Object), `items[] {description, amount}`, `importId`. Origen `FAC_EXTRAS`, `FAC_EXTRAS_ITEMS`.

Campos de `invoiceExternalData` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `invoiceId` | uniqueidentifier | Sí | — | `invoices` (M05) |
| `accountId` | uniqueidentifier | [VERIFICAR] | — | `accounts` (M01) |
| `providerCode` | string | Sí | — | — |
| `fields` | object | [VERIFICAR] | (Object), `items[] {description, amount}` | — |
| `importId` | uniqueidentifier | [VERIFICAR] | — | `billingImports` (M05) |

### 7.4 Tipos de comprobante, puntos de venta y numeración

**`voucherTypes`**

| Campo | Tipo | Obl. | Descripción |
|---|---|---|---|
| `code` | Int | Sí | Código interno (ex `COD_COM`). |
| `arcaCode` | Int | No | Código ARCA. |
| `name` / `shortName` | String | Sí | Ej. "LIQ. DE SERV. B" / "Spb". |
| `letter` | Enum `A, B, C, M, E, X` | Sí | — |
| `voucherClass` | Enum (como `invoices.voucherClass`) | Sí | — |
| `direction` | Enum `debit, credit` | Sí | Ex `DEB_CRE`. |
| `reversalVoucherTypeId` | uniqueidentifier | No | Ex `COD_COM_ANU`. Referencia: `voucherTypes` (M05). |
| `sharesNumberingWithId` | uniqueidentifier | No | Ex `RELACION`. Referencia: → `voucherTypes` (M05). |
| `manualNumbering` / `internal` | Boolean | Sí | Ex `NUM_MANUAL`, `INTERNO`. |
| `taxConditionRestriction` | Enum `none, onlyRiAndMonotributo, notForRi` | Sí | Ex `TIPO_SIT`. |
| `allowsZeroPointOfSale` | Boolean | Sí | Ex `PTOVTA0`. |
| `copies` / `copyLegends[]` | Int / Array String | Sí / No | Ex `COPIAS`, `LEY_COP1..4`. |
| `defaultForOperation` | Enum `none, advancesDebit, interest, cvlpDebit, …` | No | Ex `OPE_DEFAULT`. |
| `family` | String | No | Ex `TIP_COMP`. |
| `isMiPyme` / `isPublicService` | Boolean | Sí | — |
| `active` | Boolean | Sí | — |

Índice `{tenantId, code}` único. Origen `COMPROB`, `TIP_COMP`.

**`voucherResolutionRules`** — matriz por condición fiscal (versionada): `taxCondition`, `invoiceVoucherTypeId`, `debitNoteVoucherTypeId`, `creditNoteVoucherTypeId`, `publicServiceInvoiceVoucherTypeId`, `publicServiceCreditVoucherTypeId`, `miPymeInvoice/Debit/CreditVoucherTypeId`, `ticketVoucherTypeId`, `matrixVersion`, `validFrom`. Más `serviceOverrides[] {serviceId, debitVoucherTypeId, creditVoucherTypeId}` (ex `SERVICIO.COM_FAC`, `COM_CRE`). Origen `SITIVA` (columnas de comprobantes; la condición fiscal en sí es de M06).

Campos de `voucherResolutionRules` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `taxCondition` | [VERIFICAR] | Sí | — | — |
| `invoiceVoucherTypeId` | uniqueidentifier | [VERIFICAR] | — | [VERIFICAR] destino no declarado |
| `debitNoteVoucherTypeId` | uniqueidentifier | [VERIFICAR] | — | [VERIFICAR] destino no declarado |
| `creditNoteVoucherTypeId` | uniqueidentifier | [VERIFICAR] | — | [VERIFICAR] destino no declarado |
| `publicServiceInvoiceVoucherTypeId` | uniqueidentifier | [VERIFICAR] | — | [VERIFICAR] destino no declarado |
| `publicServiceCreditVoucherTypeId` | uniqueidentifier | [VERIFICAR] | — | [VERIFICAR] destino no declarado |
| `ticketVoucherTypeId` | uniqueidentifier | [VERIFICAR] | — | [VERIFICAR] destino no declarado |
| `matrixVersion` | int | Sí | — | — |
| `validFrom` | date | [VERIFICAR] | — | — |
| `vatConditionSettingId` | uniqueidentifier | [VERIFICAR] | Condición fiscal configurada (T05 lo declara en claves; `taxCondition` es su código). | `vatConditionSettings` (M06) |

**`pointsOfSale`** — `number` (Int), `name`, `kind` (Enum `electronicCae, electronicCaea, cai, manual, fiscalPrinter, internal`), `branchId`, `serviceIds[]`, `channels[]` (Enum `batch, counter, portal, field, prepaid`), `address`, `arcaEnabledAt`, `status` (`draft, active, suspended, retired`), `validFrom`, `validTo`. Índice `{tenantId, number}` único. Origen `PTOVENTA`. **Reemplazado por** `pointsOfSale` de M06 (CTR-DAT-17 de T05; COL-FIS-09): una sola colección con modos fiscales y uso operativo, con `legalEntityId` obligatorio e índice único `{tenantId, legalEntityId, number}` (DEC-064: el mismo número puede existir en dos entidades jurídicas). M05 la lee para resolver el punto de venta del comprobante y conserva aquí solo la definición de `channels[]` y `serviceIds[]` como requisito hacia M06.

**`numberSequences`** — `legalEntityId` (→ T04 `legalEntities`; DEC-064; debe coincidir con el del punto de venta), `numberingVoucherTypeId`, `pointOfSaleId`, `lastNumber` (Int), `lastAuthorizedNumber` (Int; DEC-107), `authorizationType` (Enum `CAE, CAEA, CAI, CESP, none`; `none` para recibos de M07 y comprobantes internos, alineado con `billingRunNumberRanges` e `invoices.fiscal`; DEC-104 y encargo de alineación del 10-11-2026, antes `CAE, CAEA, CAI, CESP` y antes `CAE, CAEA, CAI`), `cai` `{ number, dueDate }`, `billingGroupId` (talonario propio, opcional; `null` = numeración general), `lastSyncedWithArca` `{ at, arcaLastNumber }`, `status` (`active, blocked`), `blockedReason`. Índice **único** `{tenantId, legalEntityId, numberingVoucherTypeId, pointOfSaleId, billingGroupId}` (DEC-064; COL-FAC-21; antes sin `legalEntityId`). Es la numeración fiscal canónica (CTR-DAT-16); la numeración no fiscal es `numberingSequences` de T11. Se actualiza con `$inc` dentro de la transacción de emisión. También numera los **recibos de M07** (`receipts`, RF-COB-087, RF-COB-193; CTR-DAT-74) con su tipo de recibo y un punto de venta de la misma entidad jurídica (RF-FAC-179, RN-FAC-161). Origen `COMPPOS`, `TALONFAC_PAGO` [VERIFICAR contenido].

Campos de `numberSequences` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `legalEntityId` | uniqueidentifier | Sí | → T04 `legalEntities`; DEC-064; debe coincidir con el del punto de venta | `legalEntities` (T04) |
| `numberingVoucherTypeId` | uniqueidentifier | Sí | — | `voucherTypes` (M05) |
| `pointOfSaleId` | uniqueidentifier | Sí | — | `pointsOfSale` (M06) |
| `lastNumber` | int | [VERIFICAR] | Int. Último número asignado; al liberar números por un rechazo de ARCA vuelve a `lastAuthorizedNumber` más los números todavía en curso por debajo del liberado (RN-FAC-164; DEC-107) | — |
| `lastAuthorizedNumber` | int | Sí (numeradores CAE) | Último número autorizado por ARCA para el punto de venta y tipo; lo actualiza el consumidor de `fis.invoice.authorized` y se contrasta con `FECompUltimoAutorizado` (RF-FAC-085). Es la referencia para renumerar: ningún número igual o menor se libera (RN-FAC-164; DEC-107) | — |
| `authorizationType` | enum | [VERIFICAR] | Enum `CAE, CAEA, CAI, CESP, none`: `CESP` para los numeradores de liquidación de servicios públicos, como `invoices.fiscal.authorizationType` y RF-FIS-034 de M06 (DEC-104; antes `CAE, CAEA, CAI`); `none` para los numeradores que no pasan por ARCA (recibos de M07, RF-COB-087; comprobantes internos), como ya usan `billingRunNumberRanges.authorizationType` e `invoices.fiscal.authorizationType` (alineación del 10-11-2026; antes `CAE, CAEA, CAI, CESP`) | — |
| `cai` | [VERIFICAR] | [VERIFICAR] | — | — |
| `billingGroupId` | uniqueidentifier | No | Talonario propio del grupo (`billingGroups.numberingMode = own`, RF-FAC-082); `null` en el numerador general y en los de recibos de M07. Integra el índice único con valor `null` explícito, de modo que hay un solo numerador general por entidad, tipo y punto de venta (DEC-104; antes "Sí" en esta columna, en contradicción con la descripción "opcional") | `billingGroups` (M05) |
| `lastSyncedWithArca` | [VERIFICAR] | [VERIFICAR] | — | — |
| `status` | enum | Sí | `active`, `blocked` | — |
| `blockedReason` | string | [VERIFICAR] | — | — |

> **Alineación con T05 (05-11-2026):** T05 declara `voucherTypeId` en claves y `numberingVoucherTypeId` en el índice único; la ficha usa `numberingVoucherTypeId` (`voucherTypes`, M05). Inconsistencia interna de T05: se informa.

### 7.5 Modalidad, grupos y vencimientos

**`billingModePolicies`** — `defaultMode` (Enum `separate, grouped`), `exceptions[] { scope: service|account|holder, refId, mode, validFromPeriod }`, `periodicityRule` (Enum `nextGroupInvoice, separate, prorate`, FAC-010), `multipleSuppliesRule` (PA-FAC-07), `negativeTotalPolicyByService[] { serviceId, policy: creditNote|futureCredit }`, `policyVersion`, `validFromPeriod`. Un documento vigente por tenant.

Campos de `billingModePolicies` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `defaultMode` | enum | [VERIFICAR] | (Enum `separate, grouped`), `exceptions[] { scope: service/account/holder, refId, mode, validFromPeriod }` | — |
| `periodicityRule` | enum | [VERIFICAR] | Enum `nextGroupInvoice, separate, prorate`, FAC-010 | — |
| `multipleSuppliesRule` | [VERIFICAR] | [VERIFICAR] | (PA-FAC-07), `negativeTotalPolicyByService[] { serviceId, policy: creditNote/futureCredit }` | — |
| `policyVersion` | int | Sí | — | — |
| `validFromPeriod` | string | [VERIFICAR] | — | — |

**`billingGroups`** — grupo de facturación (FAC-006).

| Campo | Tipo | Obl. | Descripción |
|---|---|---|---|
| `code` / `name` | String | Sí | — |
| `holderId` / `accountId` | uniqueidentifier → M01 | Sí | Un solo titular. |
| `taxId` | String | Sí | Copia para validar unicidad de CUIT/DNI. Referencia: no es referencia: copia del CUIT/DNI para validar unicidad. |
| `members` | Array `{ contractId, serviceId, validFrom, validTo }` | Sí | Servicios y contratos incluidos. |
| `postalAddressId` / `deliveryAddressId` | uniqueidentifier → M01 | No | Domicilio postal y de reparto. |
| `pointOfSaleId` / `numberingMode` | uniqueidentifier / Enum `general, own` | No / Sí | Talonario propio o general. Referencia: `pointOfSaleId` → `pointsOfSale` (M05); `numberingMode` no es referencia. |
| `periodicity` | Enum | Sí | Periodicidad común. |
| `dueDateSchemeId` | uniqueidentifier | No | — |
| `deliveryChannels` | Array Enum | No | — |
| `voucherTypeOverrideId` | uniqueidentifier | No | Ex `GRUPOS_FACTURA.COD_TPFC`. Referencia: → `voucherTypes` (M05). |
| `forceDebitNote` | Boolean | Sí | Ex `FORZAR_ND`. |
| `fiscalValidation` | Object | Sí | `{ status: pending\|approved\|rejected, by, at, note }` (BASE §103.3). |
| `status` | Enum `draft`, `active`, `dissolved` | Sí | — |
| `validFrom` / `validTo` | Date-only | Sí / No | — |
| `groupVersion` | Int | Sí | Número de versión; no es referencia. |
| `legacy` | `{ codGf }` | No | FAC-012. |

Índices `{tenantId, holderId, status}`; `{tenantId, "members.contractId", validTo}`. Origen `GRUPOS_FACTURA`.

**`dueDateSchemes`** — tramas: `code`, `name`, `scope` `{ serviceIds[], cycleIds[], invoiceClassCodes[] }`, `dueCount` (1..N; N = tope de PRM-FAC-163 para el alcance de la trama, por defecto 4; DEC-106; antes 1..4), `spacing[] { index, rule (expresión) }`, `mode` (Enum `fixedAmount, fixedPercentCompound, dailyPercent, byAmountRange, byDueIndex`), `rows[] { amountFrom, amountTo, dueIndexFrom, dueIndexTo, valueType: percent|fixed, value (Dec) }`, `compounding` (Boolean), `interestConceptId` (IVA del recargo), `isDemo` (Boolean), `status`, `schemeVersion`, `validFrom`. Origen `TRAMASREC`. **Reemplazado parcialmente (CTR-DAT-37 de T05):** M05 conserva el espaciado de vencimientos (`dueCount`, `spacing[]`); el recargo entre vencimientos (`mode`, `rows[]`, `compounding`, `interestConceptId`) vive en `dueDateSurchargeSchemes` de M08, que M05 invoca para calcular los importes de Vto2 al último vencimiento (Vto4 con el tope por defecto; DEC-106).

Campos de `dueDateSchemes` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | Sí | — | — |
| `name` | string | [VERIFICAR] | — | — |
| `scope` | [VERIFICAR] | [VERIFICAR] | — | — |
| `dueCount` | int | [VERIFICAR] | (1..N; N = tope de PRM-FAC-163, por defecto 4; al guardar la trama se valida contra el tope de su alcance; DEC-106; antes 1..4), `spacing[] { index, rule (expresión) }` | — |
| `mode` | enum | [VERIFICAR] | (Enum `fixedAmount, fixedPercentCompound, dailyPercent, byAmountRange, byDueIndex`), `rows[] { amountFrom, amountTo, dueIndexFrom, dueIndexTo, valueType: percent/fixed, value (Dec) }` | — |
| `compounding` | bool | [VERIFICAR] | Boolean | — |
| `interestConceptId` | uniqueidentifier | [VERIFICAR] | IVA del recargo | `billableConcepts` (M02) |
| `lateAuthorizationGraceDays` | int ≥ 0 | No | Días de gracia desde la autorización fiscal para el primer vencimiento corrido cuando la autorización llega tarde; vacío = PRM-FAC-164 (RN-FAC-165; DEC-107, 10-11-2026) | — |
| `isDemo` | bool | [VERIFICAR] | Boolean | — |
| `status` | enum | Sí | — | — |
| `schemeVersion` | int | Sí | — | — |
| `validFrom` | date | [VERIFICAR] | — | — |

> **Alineación con T05 (05-11-2026):** T05 declara `serviceIds[]` y `cycleIds[]`; en la ficha están dentro de `scope`.

### 7.6 Operaciones masivas e importaciones

**`massOperations`** — `type` (Enum `recategorization, retroactive, invoiceModification, invoiceClassChange, block, unblock, creditByVouchers, installmentModification`), `ownerModule` (FAC o VEN), `params` (Object tipado por tipo, validado con Zod), `filters`, `status` (ver §8.8), `preview` `{ count, totals, generatedAt }`, `approvals[]`, `result` `{ applied, skipped, failed }`, `jobId`. Origen: `clsRecategorizacion`, `clsRetroactivos`, `clsModificacionFacturas`, `clsModificacionCuotas`.

Campos de `massOperations` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `type` | enum | [VERIFICAR] | Enum `recategorization, retroactive, invoiceModification, invoiceClassChange, block, unblock, creditByVouchers, installmentModification` | — |
| `ownerModule` | [VERIFICAR] | [VERIFICAR] | FAC o VEN | — |
| `params` | object | [VERIFICAR] | Object tipado por tipo, validado con Zod | — |
| `filters` | [VERIFICAR] | [VERIFICAR] | — | — |
| `status` | enum | Sí | Ver §8.8 | — |
| `preview` | [VERIFICAR] | [VERIFICAR] | — | — |
| `approvals[]` | array [VERIFICAR] | [VERIFICAR] | — | — |
| `result` | [VERIFICAR] | [VERIFICAR] | — | — |
| `jobId` | uniqueidentifier | Sí | — | `jobRuns` (T01) |

**`massOperationItems`** — `operationId`, `targetType` (`invoice, contract, consumption, installment`), `targetId`, `before` (Object), `after` (Object), `status` (`proposed, applied, skipped, failed`), `reason`, `noteId` (nota en la cuenta, M01).

Campos de `massOperationItems` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `operationId` | uniqueidentifier | Sí | — | `massOperations` (M05) |
| `targetType` | enum | [VERIFICAR] | `invoice, contract, consumption, installment` | — |
| `targetId` | uniqueidentifier | Sí | — | polimórfica según `targetType` |
| `before` | object | [VERIFICAR] | Object | — |
| `after` | object | [VERIFICAR] | Object | — |
| `status` | enum | Sí | `proposed`, `applied`, `skipped`, `failed` | — |
| `reason` | string | [VERIFICAR] | — | — |
| `noteId` | uniqueidentifier | [VERIFICAR] | Nota en la cuenta, M01 | `notes` (M01) |

**`billingImports`** — `format` (Enum `EMA, SAM, SAM_TASA_VERDE, EME, CT1, FAR, IAL, CEL, GAS_INVOICES, PR1, CANONICAL`), `storedFileId` (antes ~~`fileId`~~), `destination` (Enum `billableItem, saleInstallment, directInvoice`), `period`, `conceptId`, `status` (`uploaded, validated, confirmed, applied, failed, cancelled`), `counts` `{ rows, valid, errors }`. **`billingImportRows`** — `importId`, `rowNo`, `raw` (Object), `mapped` `{ accountId, contractId, conceptId, quantity, unitPrice, description, amount }`, `errors[]`, `resultRef`.

**`billingImportRows`** — tabla de campos.

Campos de `billingImportRows` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `importId` | uniqueidentifier | Sí | — | `billingImports` (M05) |
| `rowNo` | int | Sí | — | — |
| `raw` | object | [VERIFICAR] | Object | — |
| `mapped` | [VERIFICAR] | [VERIFICAR] | — | — |
| `errors[]` | array [VERIFICAR] | [VERIFICAR] | — | — |
| `resultRef` | [VERIFICAR] | [VERIFICAR] | — | — |

**`billingImports`** — tabla de campos.

Campos de `billingImports` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `format` | enum | Sí | Enum `EMA, SAM, SAM_TASA_VERDE, EME, CT1, FAR, IAL, CEL, GAS_INVOICES, PR1, CANONICAL` | — |
| `storedFileId` | uniqueidentifier | Sí | Antes ~~`fileId`~~ | `storedFiles` (T01) |
| `destination` | enum | [VERIFICAR] | Enum `billableItem, saleInstallment, directInvoice` | — |
| `period` | string | [VERIFICAR] | — | — |
| `conceptId` | uniqueidentifier | Sí | — | `billableConcepts` (M02) |
| `status` | enum | Sí | `uploaded`, `validated`, `confirmed`, `applied`, `failed`, `cancelled` | — |
| `counts` | [VERIFICAR] | [VERIFICAR] | — | — |
| `fileHash` | string | Sí | Hash del archivo; único con `format` (T05). | — |

### 7.7 Representación, códigos y documentos de pago

**`invoiceTemplates`** — `code`, `name`, `engine` (Enum `html-pdf`), `layout` (definición versionada: secciones, bloques, campos), `assets[]`, `selectionRules[] { priority, match: {forced, voucherClass, invoiceClassCode, serviceId, voucherTypeId, taxCondition, prepaid, electronic, summedSlip, alternative}, }`, `previewedAt`, `status`, `templateVersion`. Origen: plantillas DevExpress por convención de nombres (V2 565, 156, 34). **Reemplazado parcialmente (CTR-DAT-41 de T05):** el diseño (`layout`, `assets[]`) y sus versiones viven en T11 (`documentTemplates`/`templateVersions`); M05 conserva en esta colección solo `code`, `name`, `selectionRules[]` y la referencia `documentTemplateId` + `templateVersion` de T11.

Campos de `invoiceTemplates` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | Sí | — | — |
| `name` | string | [VERIFICAR] | — | — |
| `engine` | enum | [VERIFICAR] | Enum `html-pdf` | — |
| `layout` | [VERIFICAR] | [VERIFICAR] | Definición versionada: secciones, bloques, campos | — |
| `assets[]` | array [VERIFICAR] | [VERIFICAR] | — | — |
| `previewedAt` | datetime | [VERIFICAR] | — | — |
| `status` | enum | Sí | — | — |
| `templateVersion` | int | Sí | Número de versión; no es referencia. | — |

> **Alineación con T05 (05-11-2026):** T05 usa `templateVersionId`; la ficha referencia el diseño de T11 con `documentTemplateId` + `templateVersion` (`documentTemplates`/`templateVersions`, T11). Se informa a T05.

**`invoiceLineOrders`** — `code`, `description`, `footer`, `order`. Origen `ITEMSORD`.

Campos de `invoiceLineOrders` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | Sí | — | — |
| `description` | string | [VERIFICAR] | — | — |
| `footer` | [VERIFICAR] | [VERIFICAR] | — | — |
| `order` | int | [VERIFICAR] | — | — |

**`consumptionChartGroups`** — `code`, `groupCode`, `description`, `serviceIds[]`, `periods` (cantidad, por defecto 12). Origen `GRUPOS_GRAFICO`, `GRAFTAB`.

Campos de `consumptionChartGroups` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | Sí | — | — |
| `groupCode` | string | [VERIFICAR] | — | — |
| `description` | string | [VERIFICAR] | — | — |
| `serviceIds[]` | uniqueidentifier[] | [VERIFICAR] | — | [VERIFICAR] destino no declarado |
| `periods` | [VERIFICAR] | [VERIFICAR] | Cantidad, por defecto 12 | — |

**`barcodeFormats`** — formato declarativo.

| Campo | Tipo | Obl. | Descripción |
|---|---|---|---|
| `code` / `name` | String | Sí | Ej. `PAGOFACIL_42`. |
| `scope` | Enum `platform, tenant` | Sí | Plantillas de plataforma copiables. |
| `length` | Int | Sí | Largo esperado. |
| `alphanumeric` | Boolean | Sí | — |
| `documents` | Object | Sí | Por tipo `invoice, notification, slip, gatewayRequest`: `{ enabled, segments[] }`. |
| `segments[]` | Array | Sí | `{ kind: constant\|agreement\|companyCode\|docPrefix\|internalId\|voucherType\|pointOfSale\|number\|amount\|surcharge\|daysBetween\|date\|period\|cuit\|cae\|caeDueDate\|accountCode\|padding\|checkDigit, source (vencimiento i, etc.), width, pad: zeros\|spaces, align, dateFormat: YYMMDD\|YYYYMMDD\|DDMMYY\|JULIAN_YYDDD\|MMYYYY, onOverflow: error\|fallbackFormat }`. |
| `checkDigits[]` | Array `{ algorithm: DV1..DV9\|CRC16\|MOD10\|MOD11, rangeFrom, rangeTo, position }` | No | — |
| `decoders[]` | Array `{ match (prefijo/largo), extract: {...}, lookup: invoiceId\|slipNumber\|notification\|gatewayRequest\|accountAndAmount\|voucherNumber, legacy: Boolean }` | No | Lectura. |
| `fallbackFormatId` | uniqueidentifier | No | Formato extendido ante desborde. Referencia: → `barcodeFormats` (M05). |
| `dueDateCapacity` | Int | Sí | Cantidad máxima de vencimientos que el formato codifica (≥ 1), por tipo de documento si difiere; se deriva de los segmentos `amount`/`surcharge`/`daysBetween` con `source` de vencimiento y se confirma al publicar el formato. Valida el tope de PRM-FAC-163 y limita la codificación a los primeros N vencimientos (RF-FAC-140, RN-FAC-163; DEC-106). |
| `testVectors[]` | Array `{ input, expected }` | Sí | Validación al publicar. |
| `status` / `formatVersion` | Enum / Int | Sí | — |

**`barcodeAssignments`** — `formatId`, `collectorCode` (recaudador o canal), `documentTypes[]`, `agreementCode` (convenio por documento, secreto no aplica), `isDefault` (Boolean), `printOnInvoice` (Boolean), `readAtCounter` (Boolean), `validFrom`. Origen V2 2055, 2255, `BANCOS.ID_CODBAR`, `BANCOS.CONVENIO`.

Campos de `barcodeAssignments` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `formatId` | uniqueidentifier | Sí | — | `barcodeFormats` (M05) |
| `collectorCode` | string | Sí | Recaudador o canal | — |
| `documentTypes[]` | array [VERIFICAR] | Sí | — | — |
| `agreementCode` | string | [VERIFICAR] | Convenio por documento, secreto no aplica | — |
| `isDefault` | bool | [VERIFICAR] | Boolean | — |
| `printOnInvoice` | bool | [VERIFICAR] | Boolean | — |
| `readAtCounter` | bool | [VERIFICAR] | Boolean | — |
| `validFrom` | date | [VERIFICAR] | — | — |

**`paymentSlips`** — documento de pago (talón o cupón).

Campos: `legalEntityId` (→ T04 `legalEntities`; DEC-064: un talón agrupa solo comprobantes de la misma entidad jurídica), `number` (Int, correlativo por tenant y entidad), `kind` (Enum `summedSlip, installmentSlip`, ~~`singleCoupon`~~ — el cupón único es `paymentCoupons` de M07, CTR-DAT-39), `accountId`, `slipGroupCode`, `invoiceIds[]`, `installmentNo` / `installmentCount`, `dueDates[] { index, date, amount (Money) }` (hasta el tope efectivo de los comprobantes que agrupa, PRM-FAC-163, por defecto 4; DEC-106; antes "hasta 4"), `paymentCodes[]`, `status` (`active, superseded, cancelled, paid` — `paid` lo informa M07), `supersededById`, `history[]`. Índice `{tenantId, legalEntityId, number}` único (antes `{tenantId, number}`). Origen `TALONFAC`, `TALONFAC_HST`.

Campos de `paymentSlips` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `legalEntityId` | uniqueidentifier | Sí | → T04 `legalEntities`; DEC-064: un talón agrupa solo comprobantes de la misma entidad jurídica | `legalEntities` (T04) |
| `number` | int | Sí | Int, correlativo por tenant y entidad | — |
| `kind` | enum | [VERIFICAR] | Enum `summedSlip, installmentSlip`, ~~`singleCoupon`~~ — el cupón único es `paymentCoupons` de M07, CTR-DAT-39 | — |
| `accountId` | uniqueidentifier | Sí | — | `accounts` (M01) |
| `slipGroupCode` | string | [VERIFICAR] | — | — |
| `invoiceIds[]` | uniqueidentifier[] | [VERIFICAR] | — | `invoices` (M05) |
| `installmentNo` | int | [VERIFICAR] | `installmentCount`, `dueDates[] { index, date, amount (Money) }` (hasta el tope efectivo, PRM-FAC-163; DEC-106; antes "hasta 4") | — |
| `paymentCodes[]` | array [VERIFICAR] | [VERIFICAR] | — | — |
| `status` | enum | Sí | `active`, `superseded`, `cancelled`, `paid` — `paid` lo informa M07 | — |
| `supersededById` | uniqueidentifier | [VERIFICAR] | — | `paymentSlips` (M05) |
| `history[]` | array [VERIFICAR] | [VERIFICAR] | — | — |

**`invoiceDocuments`** — `invoiceId` (o `paymentSlipId`, `closureId`), `kind` (Enum `invoicePdf, duplicatePdf, slipPdf, printBatchPdf, closureActaPdf, printDataFile`), `storedFileId` (almacenamiento privado; T05 §7.2 — antes ~~`fileKey`~~), `sha256`, `templateId`, `templateVersion`, `generatedAt`, `pages`, `passwordProtected`. Índice `{tenantId, invoiceId, kind}`.

Campos de `invoiceDocuments` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `invoiceId` | uniqueidentifier | Sí | O `paymentSlipId`, `closureId` | `invoices` (M05) |
| `kind` | enum | Sí | Enum `invoicePdf, duplicatePdf, slipPdf, printBatchPdf, closureActaPdf, printDataFile` | — |
| `storedFileId` | uniqueidentifier | Sí | Almacenamiento privado; T05 §7.2 — antes ~~`fileKey`~~ | `storedFiles` (T01) |
| `sha256` | [VERIFICAR] | [VERIFICAR] | — | — |
| `templateId` | uniqueidentifier | [VERIFICAR] | — | `documentTemplates` (T11) |
| `templateVersion` | int | Sí | Número de versión; no es referencia. | — |
| `generatedAt` | datetime | [VERIFICAR] | — | — |
| `pages` | [VERIFICAR] | [VERIFICAR] | — | — |
| `passwordProtected` | [VERIFICAR] | [VERIFICAR] | — | — |

### 7.8 Distribución

**`deliveryPreferences`** — `holderId`, `accountId`, `billingGroupId` (alcance más específico prevalece), `channels[]` (Enum `paper, email, whatsapp, app`), `emails[]`, `phones[]`, `digitalAdhesion` `{ adheredAt, source: portal|counter|migration, evidenceId }`, `validFrom`. Índice `{tenantId, holderId}`.

Campos de `deliveryPreferences` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `holderId` | uniqueidentifier | Sí | — | `holders` (M01) |
| `accountId` | uniqueidentifier | Sí | — | `accounts` (M01) |
| `billingGroupId` | uniqueidentifier | Sí | Alcance más específico prevalece | `billingGroups` (M05) |
| `channels[]` | enum | [VERIFICAR] | Enum `paper, email, whatsapp, app` | — |
| `emails[]` | array [VERIFICAR] | [VERIFICAR] | — | — |
| `phones[]` | array [VERIFICAR] | [VERIFICAR] | — | — |
| `digitalAdhesion` | [VERIFICAR] | [VERIFICAR] | — | — |
| `validFrom` | date | [VERIFICAR] | — | — |

**`distributionRuns`** — `code`, `billingRunId` (o `selection`), `channels[]`, `grouping` (Enum `none, account, member, memberAndPhone`), `orderBy`, `batchSize`, `waitSeconds`, `printOptions` `{ duplex, interleaveImageId, messages[], pieceNumbering, subOrder, password }`, `status` (ver §8.9), `counts` `{ total, sent, delivered, failed, bounced, returned, printed }`, `outputDocumentIds[]`.

Campos de `distributionRuns` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | Sí | — | — |
| `billingRunId` | uniqueidentifier | Sí | O `selection` | `billingRuns` (M05) |
| `channels[]` | array [VERIFICAR] | [VERIFICAR] | — | — |
| `grouping` | enum | [VERIFICAR] | Enum `none, account, member, memberAndPhone` | — |
| `orderBy` | [VERIFICAR] | [VERIFICAR] | — | — |
| `batchSize` | [VERIFICAR] | [VERIFICAR] | — | — |
| `waitSeconds` | [VERIFICAR] | [VERIFICAR] | — | — |
| `printOptions` | [VERIFICAR] | [VERIFICAR] | — | — |
| `status` | enum | Sí | Ver §8.9 | — |
| `counts` | [VERIFICAR] | [VERIFICAR] | — | — |
| `outputDocumentIds[]` | uniqueidentifier[] | [VERIFICAR] | — | [VERIFICAR] destino no declarado |

**`invoiceDeliveries`** — un registro por comprobante, canal y destino: `invoiceId`, `distributionRunId`, `channel`, `destination` (enmascarado en vistas), `communicationId` (T09), `providerMessageId`, `status` (ver §8.9), `attempts`, `lastError`, `idempotencyKey`, `postalPieceNo`, `routeId`, `routeSequence`, `deliveredAt`, `returnReason`, `recordedBy` (repartidor), `clientMutationId` (offline). Índices `{tenantId, invoiceId}`, `{tenantId, distributionRunId, status}`, `{tenantId, idempotencyKey}` único.

Campos de `invoiceDeliveries` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `invoiceId` | uniqueidentifier | Sí | — | `invoices` (M05) |
| `distributionRunId` | uniqueidentifier | [VERIFICAR] | — | `distributionRuns` (M05) |
| `channel` | [VERIFICAR] | [VERIFICAR] | — | — |
| `destination` | [VERIFICAR] | [VERIFICAR] | Enmascarado en vistas | — |
| `communicationId` | uniqueidentifier | Sí | T09 | `communications` (T09) |
| `providerMessageId` | uniqueidentifier | [VERIFICAR] | — | externa: id del proveedor de mensajería (sin colección) |
| `status` | enum | Sí | Ver §8.9 | — |
| `attempts` | [VERIFICAR] | [VERIFICAR] | — | — |
| `lastError` | [VERIFICAR] | [VERIFICAR] | — | — |
| `idempotencyKey` | string | Sí | — | — |
| `postalPieceNo` | int | [VERIFICAR] | — | — |
| `routeId` | uniqueidentifier | [VERIFICAR] | — | `distributionRoutes` (M05) |
| `routeSequence` | [VERIFICAR] | [VERIFICAR] | — | — |
| `deliveredAt` | datetime | [VERIFICAR] | — | — |
| `returnReason` | string | [VERIFICAR] | — | — |
| `recordedBy` | [VERIFICAR] | [VERIFICAR] | Repartidor | `memberships` (T02) |
| `clientMutationId` | uniqueidentifier | Sí | Offline | no es referencia: clave de idempotencia offline |

**`distributionRoutes`** — `code`, `name`, `courierUserId` (repartidor) o `postalCarrierId`, `zones[]`, `stops[] { accountId, sequence }`, `status`. Origen: zona/sector/recorrido postal de la cuenta (`SUMSOC`).

Campos de `distributionRoutes` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | Sí | — | — |
| `name` | string | [VERIFICAR] | — | — |
| `courierUserId` | uniqueidentifier | [VERIFICAR] | (repartidor) o | `memberships` (T02) |
| `postalCarrierId` | uniqueidentifier | [VERIFICAR] | — | `postalCarriers` (M05) |
| `zones[]` | array [VERIFICAR] | [VERIFICAR] | — | — |
| `status` | enum | Sí | — | — |

**`postalCarriers`** — `code`, `name`, `amount` (Money), `provider`, `freightTable[] { zoneCode, sheetsFrom, sheetsTo, amount }`. Origen `POSTALES`.

Campos de `postalCarriers` (tabla normalizada el 05-11-2026 a partir del texto anterior, que se conserva, y de T05):

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | Sí | — | — |
| `name` | string | [VERIFICAR] | — | — |
| `amount` | Money | [VERIFICAR] | Money | — |
| `provider` | [VERIFICAR] | [VERIFICAR] | — | — |

### 7.9 Cierre de ciclo

**`billingCycleClosures`** — acta de cierre.

| Campo | Tipo | Obl. | Descripción |
|---|---|---|---|
| `cycleId` / `period` / `sequence` | uniqueidentifier / String `YYYY-MM` (CTR-DAT-31; antes ~~Object~~) / Int | Sí | — |
| `runIds` | Array uniqueidentifier | Sí | Lotes incluidos (incluye reprocesos). |
| `reconciliation` | Object | Sí | `{ selected, issued, issuedObserved, pending, excluded, uncertain, fiscalRejected, requeued, carriedOver, balanced: Boolean }` (`requeued` agregado por DEC-107). |
| `totals` | Array `{ serviceId, conceptId, net, taxes, total }` | Sí | — |
| `authorizationSummary` / `distributionSummary` | Object | Sí | Conteos por estado. |
| `carriedOverExceptions` | Array `{ exceptionId, ownerRole, assigneeId, ageDays }` | No | — |
| `numberRanges` | Array (copia de `billingRunNumberRanges`) | Sí | — |
| `status` | Enum (ver §8.10) | Sí | — |
| `approvals` | Array `{ role, userId, at, decision, comment }` | No | — |
| `actaDocumentId` | uniqueidentifier | No | PDF inmutable. |
| `closureVersion` / `previousClosureId` | Int / uniqueidentifier | Sí / No | Reapertura. Referencia: `previousClosureId` → `billingCycleClosures` (M05); `closureVersion` no es referencia. |
| `reopen` | Object | No | `{ reason, requestedBy, approvedBy, at }`. |

Índice `{tenantId, legalEntityId, cycleId, period, sequence, closureVersion}` único (antes con `period.year`, `period.month` y sin entidad); el acta se arma por entidad jurídica (DEC-064), con `legalEntityId` obligatorio.

### 7.10 Mapeo de las 36 tablas de CAT §4 Facturación

| Tabla ProCoop | Destino CoopApps | Observación |
|---|---|---|
| `ANTICIPOS` | M07 (saldos a favor) | FAC aplica anticipos vía servicio de M07 en el renglón `advance`. |
| `ANTIFACTU` | M07 | Aplicación de anticipos a comprobantes. |
| `ANUFAC` | `invoices` con `commercialStatus = annulled` | Reemplazado: no hay tabla espejo; el documento original se conserva. |
| `ANUITEMSFAC` | `invoices.lines` del anulado | Ídem. |
| `ANUITEMSFAC_EXTRAS` | `invoices.lines.extras` | Ídem. |
| `CAUBLOQ` | ~~`invoiceBlockReasons`~~ `holdReasons` (M08; CTR-DAT-36) | — |
| `CLASIFICACION_ITEMS` | ~~M06~~ M13 `itemClassifications` (CTR-DAT-44) | Clasificación de ítems con coeficiente. |
| `COMPROB` | `voucherTypes` | Letra como campo explícito. |
| `COMPROBANTES_ADM` | `invoiceRelations` (`administrative`) | [VERIFICAR] uso (PA-FAC-17). |
| `CONJUNTO` | `billingUniverses` (`kind = set`) | — |
| `CREDITOS_NOAUTOMATICOS` | `invoices.flags.manualCredit` | — |
| `FACTMES` | `billingRuns` | Histórico migrado solo consulta. |
| `FACTMES_COMP` | `billingRunNumberRanges` | — |
| `FACTMES_CTAS` | `billingRuns.targetAccounts` | — |
| `FACTURAS` | `invoices` | `SALDO` no se migra como campo: lo reconstruye M07. |
| `FACTURAS_EXTRAS` | `invoices.currency`, `exchangeRate` | — |
| `FAC_EXTRAS` | `invoiceExternalData` / `invoices.paymentCodes` | Códigos de barra, código Link y datos de terceros. |
| `FAC_EXTRAS_ITEMS` | `invoiceExternalData.items` | — |
| `GRUPOS_FACTURA` | `billingGroups` | FAC-012. |
| `GRUPOS_GRAFICO` | `consumptionChartGroups` | — |
| `HISBLOQ` | ~~`invoiceBlockHistory`~~ `documentHolds` (M08; CTR-DAT-36) | — |
| `ITEMSFAC` | `invoices.lines` | — |
| `ITEMSFAC_EXTRAS` | `invoices.lines.extras` | — |
| `ITEMSORD` | `invoiceLineOrders` | — |
| `OB_FACT` | `invoices.observations` | — |
| `PARSERFA` | `billingTemplates.services` | — |
| `POSTALES` | `postalCarriers` | — |
| `PREPAGA` | M03 (prepago) + `invoiceRelations` | Comprobantes de venta y crédito vinculados a la factura prepaga. |
| `RELACION_COMP` | `invoiceRelations` | — |
| `SFACTME` | `billingRuns.servicePeriods` | — |
| `SUMNOFAC` | ~~`billingHolds`~~ `blocks` (M01; CTR-DAT-36) | — |
| `TALONFAC` | `paymentSlips` | — |
| `TALONFAC_HST` | `paymentSlips.history` / versiones | — |
| `TIPO_FAC` | `billingTemplates` + clasificación comercial (`invoiceClassCode`) + `billingCycles.calendar` | Se separan plantilla, clasificación y calendario. |
| `TIP_COMP` | `voucherTypes.family` | — |
| `FAC_EXTRAS` (código Link) | `invoices.paymentCodes` (`accountCode`) | Cuenta con 9 dígitos. |

Tablas de otros dominios que usa el proceso: `COMPPOS` → `numberSequences`; `PTOVENTA` → `pointsOfSale` (de M06; CTR-DAT-17); `SITIVA` → `voucherResolutionRules` (comprobantes) + M06 (condición fiscal); `TRAMASREC` → `dueDateSchemes` (espaciado) y `dueDateSurchargeSchemes` de M08 (recargo; CTR-DAT-37); `PRCAGAS` → `billableItems`; `DEUDAVTA` → M11 (proyección en `billableItems`); `PAGOS360*` → M07; `CALENDARIO` → T04; `TALONFAC_PAGO` → `paymentSlips` [VERIFICAR]; el cupón único → `paymentCoupons` de M07 (CTR-DAT-39).

## 8. Estados y transiciones

### 8.1 Ciclo (`billingCycles`), universo y plantilla

| Origen | Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|---|
| `draft` | `published` | Responsable de facturación | Sin solapamientos (RF-FAC-004); universo y plantilla publicados | Habilita creación de lotes y programación | Pasar a `inactive` |
| `published` | `inactive` | Responsable | Sin lotes activos del ciclo | No se crean lotes nuevos | Reactivar (`published`) con nueva vigencia |
| Plantilla `draft` | `published` | Responsable | Validación de expresiones de fecha y servicios | Versión inmutable | Publicar nueva versión; `retired` la anterior |

### 8.2 Lote (`billingRuns.status`)

```
draft → preparing → prepared → prebilling → prebilled → approved → issuing → issued
                                   ↑            │            │          │ ├→ issuedWithPending
                                   └── (re-prefacturar casos afectados) │ └→ paused ⇄ issuing
                                                                         └→ failed (técnico, reanudable)
cualquier estado previo a issuing → cancelled ;  issued | issuedWithPending → closed (vía acta)
```

| Origen | Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|---|
| — | `draft` | Responsable o JOB-FAC-17 | Ciclo/plantilla publicados | Lote con fechas propuestas | `cancelled` |
| `draft` | `preparing` | Responsable (`fac.lotes.preparar`) | Validaciones RN-FAC-008 a 019 y lock libre | JOB-FAC-01; toma `lockKey` | Falla → vuelve a `draft` con errores |
| `preparing` | `prepared` | Sistema | Universo congelado v1 | `billableItems` → `reserved`; muestra elegida | `cancelled` libera reservas |
| `prepared` | `prebilling` | Responsable (`fac.lotes.prefacturar`) | — | JOB-FAC-02 | — |
| `prebilling` | `prebilled` | Sistema | Todos los casos procesados | Excepciones abiertas; comparación calculada | — |
| `prebilled` | `prebilling` | Responsable | Universo v2 o versión de regla cambiada | Re-prefactura solo casos afectados (ESC-05) | — |
| `prebilled` | `approved` | Aprobador (`fac.lotes.aprobar`) | Muestra revisada (si aplica); aprobaciones T11 completas; aprobador ≠ preparador | Casos aptos → `approved`; excepciones siguen | Revocar aprobación antes de emitir → `prebilled` |
| `approved` | `issuing` | Responsable (`fac.lotes.emitir`) | Prerrequisitos fiscales vigentes al momento | JOB-FAC-03 por bloques | — |
| `issuing` | `paused` | Responsable o sistema | Fallo sistémico (RF-FAC-037, 060) o pedido | Detiene tras el bloque en curso | `issuing` al reanudar |
| `issuing` | `failed` | Sistema | Error técnico no recuperable automáticamente | Bloques confirmados quedan; alerta | Reanudar → `issuing` |
| `issuing` | `issued` | Sistema | Todos los aprobados emitidos | `fac.billingRun.issued`; fases de autorización y distribución | — |
| `issuing` | `issuedWithPending` | Sistema | Quedan casos pendientes, inciertos o rechazados | Ídem; pendientes visibles | Reproceso (lote `reprocess`) |
| `draft`…`approved` | `cancelled` | Responsable | Ningún comprobante emitido | Libera lock y reservas | No |
| `issued` / `issuedWithPending` | `closed` | Sistema al aprobarse el acta | Acta `approved` (§8.10) | Inmutable | Reapertura del acta → vuelve a `issuedWithPending` |

`authorizationPhase` y `distributionPhase` avanzan en paralelo después de `issuing`; la máquina de cada fase, con su estado inicial, está en §8.13 (antes se escribía aquí la cadena común «pending → inProgress → completed | completedWithIssues», alineada con §7 en §8.12).

### 8.3 Caso del lote (`billingRunItems.status`)

| Origen | Destino | Actor | Precondición | Efectos |
|---|---|---|---|---|
| — | `selected` | Sistema (preparar) | Elegible | — |
| — | `excluded` | Sistema | Marca no facturar, baja, sin ítems | Causa registrada |
| `selected` | `blocked` | Sistema (prevalidación) | Validación bloqueante | Excepción abierta |
| `selected` / `blocked` | `prebilled` | Sistema | Cálculo correcto | Candidatos |
| `prebilled` | `warning` | Sistema | Variación o advertencia | Requiere revisión, no bloquea |
| `prebilled` / `warning` | `approved` | Aprobador | — | — |
| `prebilled` / `warning` | `reviewPending` | Sistema | Cuenta en categoría/condición de PRM-FAC-161 o `requiresReview` de M04 (RF-FAC-174) | Entra en la cola de revisión previa (PAN-FAC-47); no puede aprobarse para emisión |
| `reviewPending` | `prebilled` (revisión aprobada) / `blocked` (devuelto) / `excluded` | Revisor (`fac.revisionPrevia.aprobar`) | RN-FAC-154 | Aprobado: `preReview.status = approved`, no vuelve a la cola salvo re-prefacturación, y sigue el flujo normal de aprobación; devuelto: excepción `PRE_REVIEW_RETURNED`; excluido: acta |
| `prebilled` | `zeroAmount` | Sistema | Criterio de emisión no cumplido | No emite |
| `approved` | `issued` | Sistema | Transacción confirmada | Comprobantes, `billedPeriods`, eventos |
| `issued` | `issuedObserved` | Consumidor M06 | Autorizado con observaciones | — |
| `issued` | `fiscalRejected` | Consumidor M06 | Rechazo por dato del comprobante (`rejectionKind = dataError`) | Excepción `FISCAL_REJECTED`; el comprobante vuelve a borrador y libera su número; los posteriores del numerador sin CAE pasan a `requeued` (RN-FAC-164; DEC-107) |
| `issued` | `requeued` | Sistema | Comprobante posterior a uno liberado del mismo numerador, sin CAE (incluye el rechazo solo por correlatividad, `rejectionKind = sequenceOnly`) | Número liberado con motivo `sequenceRelease`; contenido intacto (RN-FAC-164; DEC-107) |
| `requeued` | `issued` | Sistema (reenvío de la cola) | Sin envíos `sending`/`uncertain` del numerador | Número nuevo desde `lastAuthorizedNumber + 1` en el orden de `emissionSeq`; `fac.invoice.renumbered` (EVT-FAC-23); nueva solicitud a M06 (DEC-107) |
| `fiscalRejected` | `issued` | Sistema (reemisión en el mismo lote, mientras esté `issuedWithPending`) | Excepción resuelta y caso re-prefacturado | Número siguiente disponible (`reissueAfterCorrection`); `fac.invoice.issued` con `issueAttempt` + 1 (DEC-107) |
| `issued` | `uncertain` | Consumidor M06 | Sin respuesta | JOB-FAC-08 |
| `blocked` / `fiscalRejected` | `selected` (en lote `reprocess`) | Sistema | Excepción resuelta | Nuevo caso vinculado; para `fiscalRejected`, el caso nuevo reemite el mismo comprobante en borrador (DEC-107) |
| cualquiera no emitido | `excluded` | Aprobador | Motivo | Acta |
| cualquiera no emitido | `carriedOver` | Sistema al cerrar | Pendiente al cierre | Pasa al ciclo siguiente |

### 8.4 Excepción (`billingExceptions.status`)

`open → assigned → inCorrection → resolved → reprocessed`; desde `open/assigned/inCorrection` también `→ dismissed` (excluido con causa, requiere `fac.excepciones.excluir`) o `→ carriedOver` (al cerrar). `resolved → open` si el reproceso vuelve a fallar (con historial). Una excepción `systemic` no se asigna a clientes: se asocia a la pausa del lote.

### 8.5 Comprobante: estado comercial (`invoices.commercialStatus`)

| Origen | Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|---|
| (borrador) | `issued` | Sistema / operador | Validaciones; numeración | Obligaciones a M07, `billedPeriods`, eventos | — |
| `issued` | `returnedToDraft` | Consumidor M06 | CAE en línea, sin autorizar; rechazo de ARCA por dato del comprobante | Número liberado (`numberAssignments`); `fac.invoice.returnedToDraft` (EVT-FAC-22); M07 deja la obligación sin publicar ni cobrar; `billedPeriods` e ítems siguen reservados al mismo `invoiceId` (RN-FAC-164; DEC-107) | — |
| `issued` | `requeued` | Sistema | CAE en línea, sin autorizar; número posterior a uno liberado del mismo numerador | Número liberado; contenido intacto; `fac.invoice.returnedToDraft` con `kind = requeued` (EVT-FAC-22) (DEC-107) | — |
| `returnedToDraft` / `requeued` | `issued` | Sistema / operador | Corregido (solo `returnedToDraft`) y reenviado | Número nuevo; `fac.invoice.issued` con `issueAttempt` + 1 (desde `returnedToDraft`) o `fac.invoice.renumbered` (desde `requeued`) (DEC-107) | — |
| `returnedToDraft` | `annulled` | Operador + aprobador | Se decide no emitirlo | Liberaciones (RN-FAC-084); `fac.invoice.annulled`; el número ya estaba liberado (DEC-107) | — |
| `issued` | `annulled` | Operador + aprobador | No autorizado ni en proceso fiscal (consulta M06), sin pagos ni financiaciones, posterior al cierre | Liberaciones (RN-FAC-084); `fac.invoice.annulled`; M07 cancela obligaciones | No: se emite uno nuevo |
| `issued` | `reversed` | Operador + aprobador | Autorizado o con pagos; NC por el total | NC vinculada; `fac.invoice.reversed` | Una ND sobre la NC (nunca editar) |
| `issued` | `partiallyReversed` | Operador | NC parcial | Saldo revertible reducido | — |
| `partiallyReversed` | `reversed` | Operador | NC por el remanente | — | — |

### 8.6 Comprobante: estado fiscal (`invoices.fiscal.status`, escrito solo desde eventos de M06)

`notRequired` (interno, CAI, manual) · `pending` → `queued` → `authorized` | `authorizedWithObservations` | `rejected` | `uncertain`; `uncertain` → (conciliación) `authorized` | `rejected` | `queued`; `pending` → `contingency` (CAEA asignado) → `reported` (informado a ARCA) | `reportRejected`. Un comprobante `rejected` vuelve a borrador (`commercialStatus = returnedToDraft`) y libera su número; corregido, se reenvía con un número nuevo desde el último autorizado y su estado fiscal vuelve a `pending`; los posteriores del mismo numerador sin CAE vuelven a `pending` con número nuevo; un `reportRejected` (CAEA) conserva su número y se corrige según RN-FAC-164 punto 9 (DEC-107). *Reemplazado (10-11-2026, DEC-107): "Un comprobante `rejected` puede reenviarse corregido conservando su número si M06 lo admite (PA-FAC-04) o anularse internamente."*

### 8.7 Bloqueo de cobro

`unblocked → blocked(reason)` y `blocked → unblocked` o `blocked → blocked(otra causa)`; cada transición crea `invoiceBlockHistory` (colección absorbida: hoy `documentHolds` de M08, COL-FAC-16 → COL-MOR-12; la máquina de estados es la de M08). Precondición: comprobante con saldo pendiente según M07. No aplica a comprobantes pendientes de autorización (son otro estado).

### 8.8 Operaciones masivas, importaciones y anulaciones

`massOperations`: `draft → previewed → pendingApproval → approved → applying → applied | partiallyApplied | failed`; `draft/previewed/pendingApproval → cancelled`. Una operación aplicada no se revierte: se crea otra operación inversa.
`billingImports`: `uploaded → validated → confirmed → applied | failed`; `uploaded/validated → cancelled`.
`invoiceAnnulmentRequests`: `draft → pendingApproval → approved → executing → executed | partiallyExecuted | failed`; `pendingApproval → rejected`.

### 8.9 Distribución

`distributionRuns`: `draft → running → completed | completedWithIssues`; `running ⇄ paused`; `draft → cancelled`.
`invoiceDeliveries`: `pending → sent → delivered → read`; `sent → failed → pending` (reintento hasta `PRM-FAC-130`), `sent → bounced` (definitivo) → deriva a papel; papel: `pending → printed → handedToRoute → delivered | returned`.

### 8.10 Acta de cierre (`billingCycleClosures.status`)

| Origen | Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|---|
| — | `draft` | Responsable (`fac.cierre.proponer`) | Lotes del ciclo/período en `issued` o `issuedWithPending` | Cálculo del cuadre | Descartar |
| `draft` | `submitted` | Responsable | `reconciliation.balanced = true`; excepciones abiertas con responsable | Notifica aprobadores | `draft` |
| `submitted` | `approved` | Aprobador y contador | — | PDF del acta; lotes `closed`; pendientes `carriedOver`; `fac.billingCycle.closed` | Reapertura |
| `approved` | `reopened` | Contador (`fac.cierre.reabrir`) con aprobación | Motivo | Nueva versión `draft`; lotes vuelven a `issuedWithPending` | Nueva aprobación |

### 8.11 Grupo de facturación

`draft → active` (requiere `fiscalValidation.status = approved`) `→ dissolved` (con `validTo`; rige desde el período siguiente). Cada modificación de miembros crea `groupVersion + 1`.

### 8.12 Estados completados (corrección del 05-11-2026)

Corrección del 05-11-2026 (categoría 5).

**Valores declarados:**

| Entidad | Campo | Valores | Estado inicial | Fuente |
|---|---|---|---|---|
| `dueDateSchemes`, `invoiceTemplates`, `barcodeFormats` | `status` | `draft`, `published`, `retired` (propuestos, aceptados en PA-FAC-21, DEC-072; antes [VERIFICAR]) | `draft` | Mismo ciclo que `billingTemplates` (§7 y §8.1). |
| `distributionRoutes` | `status` | `active`, `inactive` (propuestos, aceptados en PA-FAC-21, DEC-072; antes [VERIFICAR]) | `active` | Catálogo de reparto. |

**Transiciones agregadas:**

| Entidad | Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|---|
| `billableItems` | — | `proposed` | Cargo sobre el umbral de M04 | PRM-TAR-152 | — |
| `billableItems` | — | `pending` | Cargo bajo el umbral o importado | — | — |
| `billableItems` | `proposed` | `pending` | Aprobación (`approvedBy`) | — | — |
| `billableItems` | `pending` | `reserved` | Lote preparado (§8.2, `preparing` → `prepared`) | — | — |
| `billableItems` | `reserved` | `pending` | Lote cancelado (libera reservas) | — | — |
| `billableItems` | `reserved` | `billed` | Comprobante emitido | — | `fac.invoice.issued` |
| `billableItems` | `proposed`/`pending` | `cancelled` | Anulación del cargo (API-FAC-106) | — | — |

**Subestados del lote:** §8.2 decía que `authorizationPhase` y `distributionPhase` avanzan «pending → inProgress → completed | completedWithIssues». Se alinea con §7 (`billingRuns`): `authorizationPhase` empieza en `notRequired` (lote sin comprobantes a autorizar) o `pending`; `distributionPhase` empieza en `notStarted`. Ambos siguen hacia «inProgress» y terminan en «completed» o «completedWithIssues». Tabla de transiciones de cada fase en §8.13.

### 8.13 Estados iniciales y transiciones completadas (residuales del 05-11-2026)

Ronda de residuales del 05-11-2026 (PA-FAC-23, DEC-072): estado de alta explícito de las máquinas de §8.1 a §8.11 que lo daban por implícito, y transiciones de las colecciones de §7 que solo enumeraban estados (`billingUniverses`, `billingTemplates`, `billedPeriods`, `invoiceDrafts`, `numberSequences`, `massOperationItems`, `paymentSlips`). Los valores de §7 se escriben ahora uno por uno (antes en un solo bloque, p. ej. «`draft, published, inactive`»), lo que también declara `pending`, `billed` y `cancelled` de `billableItems` usados en §8.12. Las cadenas de §8.1 a §8.11 no cambian.

| Entidad | Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|---|
| `billingCycles` | — | `draft` | Alta del ciclo | — | — |
| `billingUniverses` | — | `draft` | Alta del universo | — | — |
| `billingUniverses` | `draft` | `published` | Publicación por el responsable | Criterio o lista válidos | — |
| `billingUniverses` | `published` | `inactive` | Desactivación | Sin ciclos publicados que lo usen | — |
| `billingUniverses` | `inactive` | `published` | Reactivación con nueva vigencia | — | — |
| `billingTemplates` | — | `draft` | Alta o nueva versión de la plantilla | — | — |
| `billingTemplates` | `draft` | `published` | Publicación (§8.1) | Expresiones de fecha y servicios válidos | — |
| `billingTemplates` | `published` | `retired` | Publicación de una versión nueva | — | — |
| `billingRuns` | — | `draft` | Alta por el responsable o JOB-FAC-17 (§8.2) | Ciclo y plantilla publicados | — |
| `billingExceptions` | — | `open` | Validación bloqueante o rechazo durante el lote | — | `fac.billingException.opened` |
| `invoices.commercialStatus` | — | `issued` | Emisión (antes «(borrador)» en §8.5: el borrador vive en `invoiceDrafts`) | Validaciones y numeración | `fac.invoice.issued` |
| `invoiceAnnulmentRequests` | — | `draft` | Alta de la solicitud | — | — |
| `billingGroups` | — | `draft` | Alta del grupo | — | — |
| `massOperations` | — | `draft` | Alta de la operación | — | — |
| `billingImports` | — | `uploaded` | Carga del archivo | — | — |
| `distributionRuns` | — | `draft` | Alta de la corrida de distribución | — | — |
| `invoiceDeliveries` | — | `pending` | Comprobante incluido en una corrida de distribución | — | — |
| `billedPeriods` | — | `active` | Emisión del comprobante del período | Índice único parcial por contrato, servicio y período | `fac.invoice.issued` |
| `billedPeriods` | `active` | `released` | NC total o anulación (`releasedByInvoiceId`) | — | `fac.invoice.reversed` / `fac.invoice.annulled` |
| `invoiceDrafts` | — | `editing` | Alta de factura manual, réplica o refacturación | — | — |
| `invoiceDrafts` | `editing` | `validated` | Validación previa a la emisión | — | — |
| `invoiceDrafts` | `validated` | `editing` | Modificación después de validar | — | — |
| `invoiceDrafts` | `validated` | `issued` | Emisión del comprobante | Numeración disponible | `fac.invoice.issued` |
| `invoiceDrafts` | `editing`/`validated` | `discarded` | Descarte por el operador | — | — |
| `numberSequences` | — | `active` | Alta del talonario | — | — |
| `numberSequences` | `active` | `blocked` | Bloqueo (CAI vencido, punto de venta suspendido o inconsistencia de numeración) | — | — |
| `numberSequences` | `blocked` | `active` | Regularización | Numeración conciliada | — |
| `massOperationItems` | — | `proposed` | Vista previa de la operación masiva | — | — |
| `massOperationItems` | `proposed` | `applied`/`skipped`/`failed` | Aplicación de la operación (§8.8) | — | — |
| `paymentSlips` | — | `active` | Emisión del talón o cupón | — | — |
| `paymentSlips` | `active` | `superseded` | Reemplazo por un talón nuevo (`supersededById`) | — | — |
| `paymentSlips` | `active` | `cancelled` | Anulación de los comprobantes que agrupa | — | — |
| `paymentSlips` | `active` | `paid` | Cobro informado por M07 | — | — |
| `billingRuns.authorizationPhase` | — | `notRequired`/`pending` | Emisión del lote (`issuing`): `notRequired` si no hay comprobantes a autorizar | — | — |
| `billingRuns.authorizationPhase` | `pending` | `inProgress` | Envío de comprobantes a M06 | — | — |
| `billingRuns.authorizationPhase` | `inProgress` | `completed`/`completedWithIssues` | Respuestas de M06 recibidas | — | — |
| `billingRuns.distributionPhase` | — | `notStarted` | Emisión del lote (`issuing`) | — | — |
| `billingRuns.distributionPhase` | `notStarted` | `inProgress` | Inicio de la distribución (§8.9) | — | — |
| `billingRuns.distributionPhase` | `inProgress` | `completed`/`completedWithIssues` | Fin de la distribución | — | — |
| `invoices.fiscal.status` | — | `notRequired`/`pending` | Emisión: `notRequired` para comprobante interno, CAI o manual; `pending` si requiere autorización de ARCA | — | `fac.invoice.issued` |

## 9. Procesos y flujos

### 9.1 Ciclo masivo completo (CU-LOT-01, CU-FAC-01)

1. **Programar** (JOB-FAC-17, diario): para cada ciclo publicado cuya `runDate` llega, crea el lote `draft` con fechas resueltas por las expresiones del calendario y el calendario de feriados (T04). Notifica al responsable.
2. **Preparar** (JOB-FAC-01): el responsable revisa fechas, opciones y universo y pide "Preparar". El job toma el lock `lockKey` (si existe otro lote activo con la misma clave, error 409 `FAC_RUN_LOCKED`), ejecuta las validaciones RN-FAC-008 a RN-FAC-019 (consulta prerrequisitos a M06 y M17), resuelve el universo (criterios + lista explícita), aplica marcas "no facturar", bajas y reglas de elegibilidad (RN-FAC-020 a 030), toma la foto de consumos aprobados (M03), ítems facturables y cuotas, resuelve la modalidad de cada cuenta (RN-FAC-135), registra las dependencias entre servicios relacionados y ordena los servicios base antes que los dependientes (CLO después de AG; RN-FAC-155) y **congela** el universo como versión 1 con hash. Reserva `billableItems`. Elige la muestra de control con semilla registrada. Tras prefacturar, los casos que cumplen PRM-FAC-161 o traen `requiresReview` de M04 pasan a la cola de revisión previa (RF-FAC-174) antes de la aprobación de emisión.
3. **Prefacturar** (JOB-FAC-02): por bloques, solicita a M04 el cálculo de cada caso (`POST` interno al servicio de cálculo con `ruleVersions` fijadas), resuelve tipo, letra y punto de venta (RN-FAC-043, 047), arma candidatos de comprobante y vencimientos con recargos de la trama (RN-FAC-058 a 068), compara contra el período anterior y genera excepciones por caso. No asigna números ni crea comprobantes.
4. **Revisar**: el responsable y los correctores trabajan la bandeja de excepciones; cada corrección se hace en el módulo dueño (M01, M02, M03, M04, M06) mediante el enlace de la excepción. Al resolverse, el caso puede re-prefacturarse dentro del mismo lote (si aún no se aprobó) o en un lote `reprocess` (si ya se emitió).
5. **Cambios de universo** (ESC-05): si entra una cuenta, sale otra o cambia una regla, el responsable congela la versión 2; el sistema muestra la diferencia y re-prefactura solo los casos afectados.
6. **Aprobar**: el aprobador (distinto del preparador si `PRM-FAC-070`) ve el resumen obligatorio y aprueba; si el total supera `PRM-FAC-072` se dispara el workflow T11.
7. **Emitir** (JOB-FAC-03): por bloques de `PRM-FAC-035` casos, en una transacción por bloque: revalida que el caso siga apto (versión de consumo y de universo), incrementa numeradores, crea `invoices`, `billedPeriods`, `billingRunNumberRanges`, marca `billableItems` como `billed` y registra en outbox `fac.invoice.issued` y la solicitud de autorización a M06. Confirmado el bloque, persiste `progress.lastConfirmedBlock`. Un error individual aísla el caso; si la tasa de errores del bloque supera `PRM-FAC-033` % o hay un error sistémico, pausa el lote (§9.6).
8. **Autorizar** (M06): M06 consume la cola y responde con `fis.invoice.authorized` y `fis.authorization.*` (EVT-FIS-01 a EVT-FIS-04); FAC actualiza `invoices.fiscal`, `numberSequences.lastAuthorizedNumber` y el caso. Rechazos → excepción `FISCAL_REJECTED`: el comprobante rechazado vuelve a borrador y libera su número, y los posteriores del mismo numerador sin CAE vuelven a la cola (`requeued`) y se renumeran al reenviarse desde el último autorizado, en su orden de emisión, sin esperar la corrección del rechazado (RN-FAC-164; DEC-107; antes "Rechazos → excepción `FISCAL_REJECTED`" con reenvío del mismo número, DEC-035). Sin respuesta → `uncertain` → JOB-FAC-08.
9. **Representar** (JOB-FAC-04 y JOB-FAC-05): al quedar autorizado (o al emitir si no requiere autorización), genera códigos de pago y PDF con QR fiscal y QR de pago (si corresponde). Nada se imprime ni se codifica con número o CAE antes de la autorización (RN-FAC-164 punto 7; DEC-107).
10. **Distribuir** (JOB-FAC-06): según preferencias de entrega: email y WhatsApp vía T09, publicación en portal y app, archivo de impresión ordenado por ruta y pieza (MER-008). Rebotes → papel.
11. **Reprocesar** (JOB-FAC-07): casos con excepción resuelta pasan a un lote `reprocess` vinculado, que repite preparación, prefacturación y aprobación solo para ellos.
12. **Cerrar** (JOB-FAC-15): el responsable propone el acta; el sistema calcula el cuadre; aprobador y contador aprueban; se genera el PDF del acta, los pendientes pasan a `carriedOver`, se propagan bloqueos (si `PRM-FAC-023`), se emite `fac.billingCycle.closed` (M17 registra capital si `PRM-FAC-061`).

### 9.2 Ejemplo ESC-02 (lote con excepciones)

`LOTE-AG-DEMO-001` de AG-C1, 100 casos. Prefacturación: 98 aptos; `ITEM-099` excepción `FISCAL_TAXID_MISSING` (Factura A sin CUIT, responsable: corrector de datos de clientes, próxima acción "Completar y validar situación fiscal"); `ITEM-100` excepción `READING_INCONSISTENT` (responsable: supervisor de consumos). Aprobación y emisión de 98. El lote queda `issuedWithPending` con `counters.pending = 2`. Al corregirse el CUIT, `ITEM-099` se reprocesa en `LOTE-AG-DEMO-001-R1` y emite. `ITEM-100` sigue abierta al cierre y pasa a `carriedOver` con su responsable registrado en el acta. El cuadre del acta: 100 seleccionados = 99 emitidos + 1 trasladado.

### 9.3 Anulación, NC y ND (CU-FAC-04)

1. El operador busca los comprobantes (individual, rango o archivo), elige modo (`annul`, `reverse`, `partialCredit`, `debitAdjustment`) y opciones.
2. El sistema consulta a M06 el estado fiscal y a M07 pagos y financiaciones de cada comprobante; decide el camino permitido (RN-FAC-080 a 090) y muestra los excluidos con motivo.
3. Si el importe supera `PRM-FAC-071` o el modo lo exige, se abre aprobación (T11) con separación de funciones.
4. JOB-FAC-09 ejecuta por comprobante en transacción: emite NC/ND con relación, marca estado comercial del original, libera `billedPeriods` (si permite refacturar), revierte consumos (M03), stock (M11) y cuotas según opciones, y publica eventos. M06 autoriza la NC; M07 aplica la NC contra la obligación original.

### 9.4 Refacturación puntual (CU-FAC-05)

Atención o facturación solicita refacturar un comprobante de un período: el sistema exige revertir primero (NC total o anulación si aún es anulable), libera el período en `billedPeriods`, crea un lote `rebill` de un caso con el universo congelado de esa cuenta, y sigue el mismo circuito prefacturar → aprobar → emitir. La NC y la nueva factura quedan relacionadas (`rebill`).

### 9.5 Factura manual y replicar (CU-FAC-06)

El operador crea un borrador en `invoiceDrafts` (desde cero o replicando), agrega renglones por tipo (servicio, producto, cuota, impuesto, anticipo, anticipo de producto), el sistema calcula con M04/M06 y valida (RN-FAC-045). Al emitir, la transacción es la misma que en masiva (numeración, obligaciones, eventos). Si `PRM-FAC-059`, se imprime automáticamente.

### 9.6 Fallo sistémico y reanudación (AGR-015)

Si en un bloque se detecta un motivo con `systemic = true` (credencial fiscal inválida, servicio de cálculo caído, numerador bloqueado) o la tasa de error supera `PRM-FAC-033` %, el job termina el bloque en curso, marca `paused` con `pause.code`, notifica al responsable y no crea excepciones por cliente. Al reanudar, revalida el prerrequisito y continúa desde `lastConfirmedBlock + 1`. Como cada caso tiene `idempotencyKey`, un reintento del job no duplica comprobantes.

### 9.7 Distribución (CU-FAC-07)

1. JOB-FAC-06 toma los comprobantes autorizados del lote (PA-FAC-03) y resuelve canales por preferencia (RN-FAC-131 a 134).
2. Digital: agrupa por cuenta, socio o socio + teléfono, crea `invoiceDeliveries` y solicita a T09 el envío con adjunto o enlace firmado; procesa callbacks de entrega, lectura, rebote.
3. Papel: genera el archivo de impresión ordenado por ruta, secuencia y pieza postal, con intercalado de imágenes y mensajes; el operador marca "impreso" y entrega a rutas; el repartidor registra entrega o devolución en pwa-empleado (offline con `clientMutationId`).
4. Portal y app: publica el comprobante al quedar autorizado (`fac.invoice.published` implícito en `fac.invoice.issued` + estado fiscal).

### 9.8 Facturación in situ (O7, PA-FAC-14)

El lector toma estado en campo (M03), y si el tenant lo habilita, la PWA de empleado emite comprobantes en un rango de numeración reservado por dispositivo (`numberSequences` con sub-rango) o como comprobantes internos que se autorizan al sincronizar. Reemplaza `frmEnvioPmovil`.

### 9.9 Jobs

| JOB-ID | Nombre BullMQ | Disparador | Idempotencia | Reintentos | Descripción |
|---|---|---|---|---|---|
| JOB-FAC-01 | `fac:preparar-lote` | API preparar | `runId + universeVersion` | 3, backoff exponencial | Valida, resuelve y congela universo. Resuelve el orden por dependencias de servicios relacionados (**CLO después de AG** y, en general, servicio dependiente después de su base; RF-FAC-175, RN-FAC-155; HUE-CLO-02): el bloque de cálculo de M04 recibe los servicios base antes que los dependientes y una dependencia no resuelta genera `RELATED_SERVICE_MISSING` sin detener el lote. |
| JOB-FAC-02 | `fac:prefacturar-lote` | API prefacturar o nueva versión de universo | `runId + itemId + universeVersion + ruleVersionsHash` | 3 por bloque | Calcula candidatos y excepciones. |
| JOB-FAC-03 | `fac:emitir-lote` | API emitir/reanudar | `idempotencyKey` por caso | 5 por bloque; pausa ante sistémico | Emite por bloques. |
| JOB-FAC-04 | `fac:generar-pdf` | `fis.invoice.authorized` o emisión sin autorización | `invoiceId + templateVersion` | 5 | PDF y QR. |
| JOB-FAC-05 | `fac:generar-codigos` | Emisión | `invoiceId + formatVersion` | 3 | Códigos de pago. |
| JOB-FAC-06 | `fac:distribuir-lote` | API distribuir o automático al autorizar | `invoiceId + channel + destination` | Según canal (`PRM-FAC-130`) | Distribución. |
| JOB-FAC-07 | `fac:reprocesar-excepciones` | API o al resolver excepciones | `exceptionId + reprocessRunId` | 3 | Crea/actualiza lote `reprocess`. |
| JOB-FAC-08 | `fac:conciliar-inciertos` | Cada 15 min | `invoiceId` | Hasta resolver; alerta a las 24 h | Pide a M06 consulta del último comprobante y concilia. |
| JOB-FAC-09 | `fac:anular-masivo` | Solicitud aprobada | `requestId + invoiceId` | 3 | Anulación/NC/ND. |
| JOB-FAC-10 | `fac:recategorizar` | Operación aprobada | `operationId + contractId` | 3 | Solo simulación de facturación de la recategorización; M04 propone y M02 aplica el cambio al contrato. Ver JOB-TAR-05 (dueño). |
| JOB-FAC-11 | `fac:retroactivos` | Operación aprobada | `operationId + contractId + period` | 3 | Genera ítems facturables retroactivos. |
| JOB-FAC-12 | `fac:modificacion-masiva` | Operación aprobada | `operationId + invoiceId` | 3 | Aplica cambios no fiscales. |
| JOB-FAC-13 | `fac:importar-terceros` | Importación confirmada | `importId + rowNo` | 3 | Crea ítems o comprobantes. |
| JOB-FAC-14 | `fac:generar-talones` | API | `accountId + slipGroupCode + version` | 3 | Talones/cupones. |
| JOB-FAC-15 | `fac:cerrar-ciclo` | Acta aprobada | `closureId + closureVersion` | 3 | Cierre, PDF del acta, traslados, propagación. |
| JOB-FAC-16 | `fac:alerta-pendientes-autorizacion` | Diario | `tenant + fecha` | 1 | Alerta de pendientes antiguos (REL §1). |
| JOB-FAC-17 | `fac:programar-ciclos` | Diario 02:00 hora del tenant | `cycleId + period + sequence` | 1 | Crea lotes `draft`. |
| JOB-FAC-18 | `fac:aplicar-resultado-fiscal` | Eventos `fis.*` | `eventId` | 5 | Actualiza estado fiscal y casos. |

Todos los jobs llevan `tenantId` en el payload y validan que el lote, comprobante u operación pertenezca a ese tenant antes de actuar.

## 10. Pantallas

Convenciones comunes: admin-panel con `AdminShell`, `AdminStickyHeader`, `ScreenHelp` (clave `help:fac.<pantalla>`), `DataTable` con paginación de servidor, filtros persistentes por usuario y exportación (capability `fac.<recurso>.exportar`). Montos con separador de miles y 2 decimales; fechas `dd-mm-yyyy`. Estados vacíos con acción principal. Toda acción destructiva o masiva pide confirmación con resumen.

| PAN-ID | Nombre | App | Ruta | Capability | Layout y contenido | Equivalencia INV |
|---|---|---|---|---|---|---|
| PAN-FAC-01 | Tablero de facturación | admin-panel | `/admin/fac` | `fac.lotes.ver` | Tarjetas: lotes activos por estado, excepciones abiertas por responsable y antigüedad, pendientes de autorización (alerta REL §1), entregas fallidas, próximos ciclos. | Nuevo (alerta `CantComprobantesPendientesAutorizar`) |
| PAN-FAC-02 | Ciclos de facturación | admin-panel | `/admin/fac/ciclos` | `fac.ciclos.ver` | Tabla: código, servicio, universo, periodicidad, próxima ejecución, estado. Modal lg de alta/edición con editor de expresiones de fecha y vista previa de 6 períodos. | Nuevo (calendario de `TIPO_FAC`) |
| PAN-FAC-03 | Universos y conjuntos | admin-panel | `/admin/fac/universos` | `fac.universos.ver` | Tabla y modal xl con criterios, lista explícita (importación con `ExcelImportWizard`) y conteo en vivo. | Conjuntos de facturación (`CONJUNTO`) |
| PAN-FAC-04 | Plantillas de corrida | admin-panel | `/admin/fac/plantillas` | `fac.plantillas.ver` | Tabla con versiones; modal xl: servicios y períodos, cuotas, vencimientos, orden, opciones, plantilla de impresión. | `abm_Tipo_Fac` |
| PAN-FAC-05 | Lotes | admin-panel | `/admin/fac/lotes` | `fac.lotes.ver` | Filtros: ciclo, período, estado, fase fiscal, fase de distribución. Columnas: código, ciclo, período/secuencia, seleccionados, emitidos, pendientes, total, estado, avance. | `frmConsultaGeneracionFacturas` |
| PAN-FAC-06 | Nuevo lote (asistente) | admin-panel | `/admin/fac/lotes/nuevo` | `fac.lotes.crear` | Pasos: (1) ciclo o plantilla, período, secuencia; (2) fechas y vencimientos con validación en línea (hábiles, 60 días); (3) destinatarios: universo, una cuenta, varias (importación) o cuentas de control; filtros; (4) opciones; (5) resumen y "Preparar". | `frmFacturacionMensual` |
| PAN-FAC-07 | Detalle de lote | admin-panel | `/admin/fac/lotes/:id` | `fac.lotes.ver` | Cabecera con estado, fases, acciones por estado (preparar, prefacturar, congelar nueva versión, aprobar, emitir, pausar, reanudar, cancelar, distribuir, proponer cierre). Pestañas: Resumen (totales por servicio y concepto, comparación), Casos (DataTable con estado, variación, muestra), Excepciones, Universo (versiones y diferencias), Numeración (rangos), Autorización, Distribución, Auditoría. Barra de progreso con ETA. | `frmFacturacionMensual_Resultado`, `frmProgressImpresion` |
| PAN-FAC-08 | Bandeja de excepciones | admin-panel | `/admin/fac/excepciones` | `fac.excepciones.ver` | Filtros: lote, motivo, categoría, etapa, responsable, estado, antigüedad. Columnas ilustrativas BASE §69: cliente/cuenta, período, servicio, motivo, dato faltante, responsable, próxima acción, estado, vence. Acciones: asignar, ir a corregir (enlace), marcar resuelta, excluir con causa, reprocesar seleccionadas. | Nuevo |
| PAN-FAC-09 | Comprobantes | admin-panel | `/admin/fac/comprobantes` | `fac.comprobantes.ver` | Búsqueda por número completo, cuenta, titular, CUIT, código de barras, período, lote, estado comercial y fiscal. Columnas: tipo, letra, número, fecha, cuenta, titular, total, Vto1, estado fiscal, estado comercial, bloqueo. Acciones masivas: reimprimir, reenviar, bloquear, anular/NC. | Administración de Comprobantes (REL §4) |
| PAN-FAC-10 | Detalle de comprobante | admin-panel | `/admin/fac/comprobantes/:id` | `fac.comprobantes.ver` | Cabecera fiscal y comercial, bloques por servicio con lecturas, renglones, tributos, vencimientos, códigos de pago, relaciones, entregas, documentos, historial de bloqueos, auditoría. Acciones: PDF, duplicado, reenviar, replicar, anular/NC/ND, bloquear, observaciones. | Detalle de comprobante (REL §4) |
| PAN-FAC-11 | Factura manual | admin-panel | `/admin/fac/comprobantes/nuevo` | `fac.comprobantes.crear` | Cabecera (cuenta, tipo resuelto, PV, fecha, vencimientos, vendedor, depósito, moneda) y grilla de renglones. Modales md por tipo de renglón: servicio (contrato, consumo, categoría), producto, cuota (selección múltiple con totales), impuesto, anticipo, anticipo de producto, obra. Totales en vivo y advertencias. | `frmComprobantesFactura`, `_Servicio`, `_Cuota`, `_Impuesto`, `_Anticipo`, `frmAnticipoProducto`, `frmSeleccionarObra` |
| PAN-FAC-12 | Replicar comprobante | admin-panel | Modal sm en PAN-FAC-10 | `fac.comprobantes.replicar` | Opciones: fechas nuevas, todos los ítems o solo servicios. Abre PAN-FAC-11 con el borrador. | `frmComprobantesFactura_Replicar` |
| PAN-FAC-13 | Refacturación puntual | admin-panel | `/admin/fac/refacturacion` | `fac.comprobantes.refacturar` | Asistente: comprobante, motivo, reversión requerida, nuevo cálculo con comparación lado a lado, aprobación. | Nuevo |
| PAN-FAC-14 | Anulación y reversión | admin-panel | `/admin/fac/anulaciones` | `fac.comprobantes.anular` | Selección por número, rango, servicio, período o archivo; modo y opciones; resultado previo con permitidos y excluidos; envío a aprobación; seguimiento. | `frmAnulacionFacturas`, `frmCreditosXComprobantes` |
| PAN-FAC-15 | Relaciones del comprobante | admin-panel | Modal lg en PAN-FAC-10/11 | `fac.relaciones.editar` | Comprobantes candidatos de la cuenta en N días, marcas de anulación e informar CUIT. | `frmComprobantesRelaciones` |
| PAN-FAC-16 | Bloqueo de comprobantes | admin-panel | `/admin/fac/bloqueos` | `fac.bloqueos.bloquear` | Selección por cuenta o comprobantes, causa, nota; desbloqueo; historial. | `frmDesbloquearComprobanteCuenta` |
| PAN-FAC-17 | Causas de bloqueo | admin-panel | `/admin/fac/config/causas-bloqueo` | `mor.causas.configurar` (antes `fac.bloqueosCausas.configurar`) | ABM simple sobre `holdReasons` de M08 por API-MOR-25. | `abm_Caubloq` |
| PAN-FAC-18 | Modificación masiva | admin-panel | `/admin/fac/modificacion-masiva` | `fac.modificacionMasiva.crear` | Filtros, campos a cambiar (vencimientos, clasificación comercial, observaciones, mensajes), vista previa antes/después, aprobación. | `frmModificaFactura`, `frmCambiarTipoFac` |
| PAN-FAC-19 | Recategorización | admin-panel | `/admin/fac/recategorizacion` | `fac.recategorizacion.simular` | Método, servicio, período, parámetros; simulación con tabla categoría actual/propuesta/consumo; confirmación aprobada; corrección de consumo de gas (modal). | `frmRecategorizacion`, `frmCorregirConsumoGas` |
| PAN-FAC-20 | Retroactivos | admin-panel | `/admin/fac/retroactivos` | `fac.retroactivos.crear` | Servicio, períodos base, cuadro nuevo, interés; simulación por contrato; aprobación. | `frmRetroactivos` |
| PAN-FAC-21 | Cargos pendientes | admin-panel | `/admin/fac/cargos` | `fac.cargos.crear` | Ítems facturables por cuenta, origen, estado; alta, edición y anulación de los no facturados. | `abm_Prcagas` |
| PAN-FAC-22 | Importaciones de terceros | admin-panel | `/admin/fac/importaciones` | `fac.importaciones.crear` | `ExcelImportWizard` con formato, mapeo, validación por fila, confirmación. | Importaciones (`clsImportacion*`) |
| PAN-FAC-23 | Tipos de comprobante y matriz | admin-panel | `/admin/fac/config/tipos-comprobante` | `fac.tiposComprobante.configurar` | Tabla de tipos; pestaña Matriz por condición fiscal (versionada) con validación de cobertura. | `COMPROB`, `SITIVA` |
| PAN-FAC-24 | Puntos de venta y numeradores | admin-panel | `/admin/fac/config/puntos-venta` | `fac.puntosVenta.configurar` | PV con tipo, canales, servicios; numeradores con último número y última sincronización con ARCA (dato de M06). El ABM de puntos de venta queda **Reemplazado por** PAN-FIS-08 de M06 (CTR-DAT-17); esta pantalla conserva los numeradores (`numberSequences`) y muestra los PV en solo lectura, con filtro por entidad jurídica (DEC-064). | `PTOVENTA`, `COMPPOS` |
| PAN-FAC-25 | Grupos de facturación | admin-panel | `/admin/fac/grupos` | `fac.grupos.ver` | Tabla por titular; modal xl con miembros, domicilios, PV/talonario, periodicidad, canales, validación fiscal; historial de versiones; desarmar. | `abm_GruposFactura` |
| PAN-FAC-26 | Modalidad de facturación | admin-panel | `/admin/fac/config/modalidad` | `fac.modalidad.configurar` | Modalidad por defecto, excepciones por servicio/cuenta/titular, reglas de periodicidad, suministros múltiples y total negativo. | Nuevo (BASE §103) |
| PAN-FAC-27 | Tramas de recargo | admin-panel | `/admin/fac/config/tramas` | `fac.tramas.configurar` | Tabla y modal lg con filas por rango de importe y vencimiento, simulador de importes. | `abm_TramasRec` |
| PAN-FAC-28 | Diseño de comprobantes | admin-panel | `/admin/fac/config/diseno` | `fac.diseno.configurar` | Plantillas con versiones, reglas de selección, vista previa con datos ficticios y comprobante real seleccionado. | Plantillas de `clsFacturasImpresion_Mejorado` |
| PAN-FAC-29 | Gráficos y orden de renglones | admin-panel | `/admin/fac/config/graficos` | `fac.diseno.configurar` | ABM de grupos de gráfico y de orden de renglones. | `abm_GruposGrafico`, `ITEMSORD` |
| PAN-FAC-30 | Formatos de código de barras | admin-panel | `/admin/fac/config/codigos` | `fac.codigoBarras.configurar` | Editor de segmentos con vista de posiciones, DV, decodificadores, vectores de prueba (deben pasar para publicar), asignaciones a recaudadores. | Nuevo (`CodigoBarra.*`) |
| PAN-FAC-31 | Distribución | admin-panel | `/admin/fac/distribucion` | `fac.distribucion.ver` | Corridas por lote o selección; canales, agrupación, orden, tandas; opciones de impresión; seguimiento por estado; reintentos; descarga del archivo de impresión. | `frmFacturasImpresion`, `frmImpresiones`, `frmFacturasImpresion_Cuotas`, `frmProgressImpresion` |
| PAN-FAC-32 | Talones y documentos de pago | admin-panel | `/admin/fac/talones` | `fac.talones.generar` | Generar talón sumado o de cuotas; consulta con pagos; eliminar no pagados. | `frmTalonesSumados`, `frmTalonesSumados_InfoPagos` |
| PAN-FAC-33 | Rutas de reparto y correos | admin-panel | `/admin/fac/config/reparto` | `fac.reparto.configurar` | Rutas, repartidores, secuencia de paradas; correos y tabla de franqueo. | `POSTALES` |
| PAN-FAC-34 | Franqueo según facturas | admin-panel | `/admin/fac/franqueo` | `fac.distribucion.ejecutar` | Selección, importes por correo, generación de cargos. | `frmFranqueoSegunFacturas` |
| PAN-FAC-35 | Cierre de ciclo | admin-panel | `/admin/fac/cierres` | `fac.cierre.proponer` | Cuadre (seleccionados = emitidos + pendientes + excluidos + trasladados), totales, autorización, distribución, pendientes con responsable; aprobación; descarga del acta; reapertura. | Nuevo |
| PAN-FAC-36 | Reportes de facturación | admin-panel | `/admin/fac/reportes` | `fac.reportes.ver` | Reportes de §15 con filtros y exportación. | `frmDiferenciaConceptos`, `frmDiferenciasCuentas`, `frmMovimientoConcepto`, `frmMovimientoConcepto_Export` |
| PAN-FAC-37 | CVLP | admin-panel | `/admin/fac/cvlp` | `fac.cvlp.ver` | Proceso por período, comisiones (hasta 3), totales, finalización. | `frmCVLP`, `frmCVLP_Finalizar` |
| PAN-FAC-38 | Comprobantes de administración pública | admin-panel | `/admin/fac/administracion-publica` | `fac.comprobantes.ver` | Selección por período y organismo, carga, quita, impresión. [VERIFICAR] | `frmComprobnatesAdministracionPublicaRAW` |
| PAN-FAC-39 | Marcas no facturar | admin-panel | `/admin/fac/no-facturar` | `fac.ciclos.editar` | Tabla por cuenta/contrato con vigencia y responsable; alta y liberación. | `SUMNOFAC` |
| PAN-FAC-40 | Preferencias de entrega | admin-panel | Pestaña en la ficha del titular (M01) | `fac.preferencias.editar` | Canales, emails, teléfonos, adhesión, historial. | Adhesión a factura electrónica |
| PAN-FAC-41 | Parámetros de facturación | admin-panel | `/admin/fac/config/parametros` | `fac.parametros.configurar` | Parámetros de §14 agrupados, con ayuda, valor heredado y origen. | Parámetros V2 |
| PAN-FAC-42 | Motivos de excepción | admin-panel | `/admin/fac/config/motivos-excepcion` | `fac.excepcionesMotivos.configurar` | Motivo, categoría, severidad, responsable por defecto, SLA, sistémico. | Nuevo |
| PAN-FAC-43 | Mis facturas | pwa-socio | `/facturas` | `por.comprobantes.ver` | Lista por cuenta con estado de pago (M07), vencimiento, descarga; filtros por período y servicio; offline: últimas 12 disponibles. **Componente embebido en PAN-POR-38 (HUE-SRV-04):** la ruta (`/app/facturas`) y la pantalla son de M19; M05 aporta el componente y API-FAC-150/152. | Portal (V2 39, 45, 2261) |
| PAN-FAC-44 | Detalle de factura | pwa-socio | `/facturas/:id` | `por.comprobantes.ver` | Bloques por servicio, gráfico de consumo, vencimientos, QR de pago, descarga PDF, botón pagar (M07). **Componente embebido en PAN-POR-39 (HUE-SRV-04):** ruta `/app/facturas/:invoiceId` de M19; M05 conserva API-FAC-151/152. | Portal |
| PAN-FAC-45 | Consulta de factura sin login | landing | `/<tenantSlug>/factura` | `por.facturas.consultar` (pública con desafío anti-bot; antes `public.facturas.consultar`, originalmente «Pública con desafío») | Número de cuenta + dato de validación + captcha; muestra vencimientos y PDF. Solo si `PRM-FAC-145`. **Componente embebido en PAN-POR-12 (HUE-SRV-04):** ruta pública `/pagar` de M19; M05 conserva API-FAC-154. | V2 60, 61 |
| PAN-FAC-46 | Reparto | pwa-empleado | `/reparto` | `fac.reparto.registrarEntrega` | Ruta del día, paradas en orden, marcar entregado/devuelto con motivo y foto opcional; offline con sincronización. | Reemplaza `frmEnvioPmovil` (en lo que toca a reparto) |
| PAN-FAC-47 | Cola de revisión previa | admin | `/admin/fac/revision-previa` (antes ~~`/admin/facturacion/revision-previa`~~) | `fac.revisionPrevia.ver` / `fac.revisionPrevia.aprobar` | Casos `reviewPending` por lote, categoría y condición especial (grandes usuarios, MER-003); detalle de cálculo de M04, comparación con el período anterior, advertencias; acciones Aprobar, Devolver con observación, Excluir con causa; filtros y asignación a revisor (RF-FAC-174; HUE-ELE-02). | — (nuevo) |

**Formularios de `ProMod_Facturacion` que pertenecen a otros anexos** (se listan para trazabilidad; se especifican allí): `abm_CespAfip`, `abm_Cvpiibb`, `abm_Electronica`, `abm_Electronica_ComproRelacion`, `abm_Electronica_Iva`, `abm_Electronica_Trib`, `abm_Impuesto`, `frmFacturacionElectronica`, `frmConsultaNumComAFIP`, `frmLibroIvaVenta`, `frmInfoArchivoRG`, `frmEnacom`, `frmEnargasPEN2067` → M06; `abm_ConceptosInt`, `abm_Plan_Cuo`, `frmInteresFacturaImpaga`, `frmInteresFacturaImpagaDetalle` → M08; `frmCuentasPorCobrar` → M07; `abm_GrpCat`, `frmTempModifBonif` → M04; `abm_ComprobanteRendicion`, `frm_ComprobanteRendicion_Detalle` → M07; `frmComprobanteVenta`, `frmComprobanteVenta_Detalle`, `frmAnulacionComprobantesVenta`, `abm_Presupu_Condicion`, `abm_Presupuesto_Notas`, `abm_Vendedor`, `frm_Presupuesto`, `frm_Presupuesto_ActualizarProd`, `frm_Presupuesto_ConjuntoDetalle`, `frm_Presupuesto_ConjuntoDetalle_Item`, `frm_Presupuesto_Detalle`, `frmPresupu_EstadoManual`, `frmImpresionPresupuesto_Orden`, `frmSeleccionarItemsPendientePresu`, `frmAjusteCuotasMoneda`, `frmEdicionCuotas`, `frmModificaDatosCuotas`, `frmModificarTipoCuotas` → M11; `frmTestFacturacion` → Descartado (la simulación de lote cubre la prueba); `frmEnvioPmovil` → Reemplazado por PAN-FAC-46 y la facturación in situ de M03/M05 (O7).

## 11. API

> **Nota de rutas:** Rutas normalizadas el 05-11-2026 a la convención de la maestra (§8 y §13: endpoints en inglés; pública bajo `/api/public/{tenantSlug}/fac/`). Cada fila conserva su ruta anterior en la descripción.

Convenciones: listados con `{ items, total, page, size }`, filtros por query string, orden `sort=campo,-campo`; errores RFC 9457 con `code` estable (ej. `FAC_RUN_LOCKED`, `FAC_RUN_INVALID_STATE`, `FAC_DUE_DATE_NOT_BUSINESS_DAY`, `FAC_VOUCHER_UNRESOLVED`, `FAC_INVOICE_NOT_ANNULLABLE`, `FAC_SEGREGATION_OF_DUTIES`, `FAC_GROUP_TAXID_MISMATCH`, `FAC_BARCODE_TEST_FAILED`); toda operación que crea comprobantes, inicia procesos o cambia estados exige `Idempotency-Key`; las operaciones largas devuelven `202 Accepted` con `jobId` y ubicación del recurso. El `tenantId` sale siempre del token, nunca del cuerpo.

### 11.1 Configuración

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-FAC-001 | GET | `/api/admin/fac/cycles` | `fac.ciclos.ver` | Listar ciclos. Ruta anterior: `/api/admin/fac/ciclos` (convención de rutas en inglés, maestra §13). | Sí |
| API-FAC-002 | POST | `/api/admin/fac/cycles` | `fac.ciclos.crear` | Crear ciclo (borrador). Ruta anterior: `/api/admin/fac/ciclos` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-003 | PATCH | `/api/admin/fac/cycles/{id}` | `fac.ciclos.editar` | Editar borrador o vigencia. Ruta anterior: `/api/admin/fac/ciclos/{id}` (convención de rutas en inglés, maestra §13). | Sí (versión) |
| API-FAC-004 | POST | `/api/admin/fac/cycles/{id}/publish` | `fac.ciclos.editar` | Publicar (valida solapamientos). Ruta anterior: `/api/admin/fac/ciclos/{id}/publicar` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-005 | GET | `/api/admin/fac/cycles/{id}/calendar?from&periods` | `fac.ciclos.ver` | Vista previa de fechas resueltas. Ruta anterior: `/api/admin/fac/ciclos/{id}/calendario?desde&periodos` (convención de rutas en inglés, maestra §13). | Sí |
| API-FAC-006 | GET/POST/PATCH | `/api/admin/fac/universes[/{id}]` | `fac.universos.ver` / `fac.universos.crear` / `fac.universos.editar` | ABM de universos. Ruta anterior: `/api/admin/fac/universos[/{id}]` (convención de rutas en inglés, maestra §13). | Con clave en POST |
| API-FAC-007 | GET | `/api/admin/fac/universes/{id}/count` | `fac.universos.ver` | Conteo y muestra de miembros según criterios. Ruta anterior: `/api/admin/fac/universos/{id}/conteo` (convención de rutas en inglés, maestra §13). | Sí |
| API-FAC-008 | POST | `/api/admin/fac/universes/{id}/members:import` | `fac.universos.editar` | Importar lista explícita. Ruta anterior: `/api/admin/fac/universos/{id}/miembros:importar` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-009 | GET/POST/PATCH | `/api/admin/fac/templates[/{id}]` | `fac.plantillas.ver` / `fac.plantillas.editar` (antes `fac.plantillas.*`; comodín solo admitido en plantillas de plataforma, T02) | ABM de plantillas de corrida. Ruta anterior: `/api/admin/fac/plantillas[/{id}]` (convención de rutas en inglés, maestra §13). | Con clave en POST |
| API-FAC-010 | POST | `/api/admin/fac/templates/{id}/publish` | `fac.plantillas.editar` | Publicar versión. Ruta anterior: `/api/admin/fac/plantillas/{id}/publicar` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-011 | GET/POST/PATCH | `/api/admin/fac/billing-holds[/{id}]` | `fac.ciclos.editar` | Marcas "no facturar". **Reemplazado por** la API de `blocks` de M01 (CTR-DAT-36); queda solo GET de lectura para la preparación del lote. Ruta anterior: `/api/admin/fac/no-facturar[/{id}]` (convención de rutas en inglés, maestra §13). | Con clave en POST |
| API-FAC-012 | GET/POST/PATCH | `/api/admin/fac/voucher-types[/{id}]` | `fac.tiposComprobante.configurar` | Tipos de comprobante. Ruta anterior: `/api/admin/fac/tipos-comprobante[/{id}]` (convención de rutas en inglés, maestra §13). | Con clave en POST |
| API-FAC-013 | GET/PUT | `/api/admin/fac/voucher-matrix` | `fac.tiposComprobante.configurar` | Matriz por condición fiscal (PUT publica nueva versión). Ruta anterior: `/api/admin/fac/matriz-comprobantes` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-014 | GET | `/api/admin/fac/voucher-matrix/resolve?account&service&sign` | `fac.comprobantes.ver` | Explica qué tipo, letra y PV se usaría. Ruta anterior: `/api/admin/fac/matriz-comprobantes/resolver?cuenta&servicio&signo` (convención de rutas en inglés, maestra §13). | Sí |
| API-FAC-015 | GET/POST/PATCH | `/api/admin/fac/points-of-sale[/{id}]` | `fac.puntosVenta.configurar` | Puntos de venta. **Reemplazado por** la API de puntos de venta de M06 (CTR-DAT-17); queda solo GET de lectura con `?legalEntityId=`. Ruta anterior: `/api/admin/fac/puntos-venta[/{id}]` (convención de rutas en inglés, maestra §13). | Con clave en POST |
| API-FAC-016 | GET/POST/PATCH | `/api/admin/fac/number-sequences[/{id}]` | `fac.numeracion.configurar` | Numeradores (alta, bloqueo; el último número solo cambia con override auditado); cada numerador pertenece a una entidad jurídica (`legalEntityId`, DEC-064). Ruta anterior: `/api/admin/fac/numeradores[/{id}]` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-017 | GET/PUT | `/api/admin/fac/billing-mode` | `fac.modalidad.configurar` | Política de modalidad. Ruta anterior: `/api/admin/fac/modalidad` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-018 | GET/POST/PATCH | `/api/admin/fac/billing-groups[/{id}]` | `fac.grupos.ver` / `fac.grupos.crear` / `fac.grupos.editar` | Grupos de facturación. Ruta anterior: `/api/admin/fac/grupos[/{id}]` (convención de rutas en inglés, maestra §13). | Con clave en POST |
| API-FAC-019 | POST | `/api/admin/fac/billing-groups/{id}/fiscal-validation` | `fac.grupos.validarFiscal` | Aprobar o rechazar validación fiscal. Ruta anterior: `/api/admin/fac/grupos/{id}/validacion-fiscal` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-020 | POST | `/api/admin/fac/billing-groups/{id}/dissolve` | `fac.grupos.desarmar` | Disolver desde un período. Ruta anterior: `/api/admin/fac/grupos/{id}/desarmar` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-021 | GET/POST/PATCH | `/api/admin/fac/due-date-schemes[/{id}]` | `fac.tramas.configurar` | Tramas de vencimiento y recargo. Ruta anterior: `/api/admin/fac/tramas[/{id}]` (convención de rutas en inglés, maestra §13). | Con clave en POST |
| API-FAC-022 | POST | `/api/admin/fac/due-date-schemes/{id}/simulate` | `fac.tramas.configurar` | Simular recargos para un importe y fechas. Ruta anterior: `/api/admin/fac/tramas/{id}/simular` (convención de rutas en inglés, maestra §13). | Sí |
| API-FAC-023 | GET/POST/PATCH | `/api/admin/fac/hold-reasons[/{id}]` | `fac.bloqueosCausas.configurar` | Causas de bloqueo. **Reemplazado por** API-MOR-25 (`/api/admin/mor/hold-reasons[/:id]`, `mor.causas.configurar`) sobre `holdReasons` de M08 (CTR-DAT-36). Ruta anterior: `/api/admin/fac/causas-bloqueo[/{id}]` (convención de rutas en inglés, maestra §13). | Con clave en POST |
| API-FAC-024 | GET/POST/PATCH | `/api/admin/fac/exception-reasons[/{code}]` | `fac.excepcionesMotivos.configurar` | Motivos de excepción. Ruta anterior: `/api/admin/fac/motivos-excepcion[/{code}]` (convención de rutas en inglés, maestra §13). | Con clave en POST |
| API-FAC-025 | GET/POST/PATCH | `/api/admin/fac/invoice-templates[/{id}]` | `fac.diseno.configurar` | Diseños de comprobante: reglas de selección en M05; el diseño y sus versiones se guardan en T11 (`documentTemplates`/`templateVersions`, CTR-DAT-41). Ruta anterior: `/api/admin/fac/plantillas-impresion[/{id}]` (convención de rutas en inglés, maestra §13). | Con clave en POST |
| API-FAC-026 | POST | `/api/admin/fac/invoice-templates/{id}/preview` | `fac.diseno.configurar` | PDF de prueba (datos ficticios o comprobante elegido). Ruta anterior: `/api/admin/fac/plantillas-impresion/{id}/vista-previa` (convención de rutas en inglés, maestra §13). | Sí |
| API-FAC-027 | GET/POST/PATCH | `/api/admin/fac/consumption-chart-groups[/{id}]` | `fac.diseno.configurar` | Grupos de gráfico. Ruta anterior: `/api/admin/fac/graficos[/{id}]` (convención de rutas en inglés, maestra §13). | Con clave en POST |
| API-FAC-028 | GET/POST/PATCH | `/api/admin/fac/line-orders[/{id}]` | `fac.diseno.configurar` | Orden de renglones. Ruta anterior: `/api/admin/fac/orden-renglones[/{id}]` (convención de rutas en inglés, maestra §13). | Con clave en POST |
| API-FAC-029 | GET/POST/PATCH | `/api/admin/fac/barcode-formats[/{id}]` | `fac.codigoBarras.configurar` | Formatos de código de barras. Ruta anterior: `/api/admin/fac/formatos-codigo[/{id}]` (convención de rutas en inglés, maestra §13). | Con clave en POST |
| API-FAC-030 | POST | `/api/admin/fac/barcode-formats/{id}/test` | `fac.codigoBarras.configurar` | Generar o decodificar un código de prueba; ejecuta vectores. Ruta anterior: `/api/admin/fac/formatos-codigo/{id}/probar` (convención de rutas en inglés, maestra §13). | Sí |
| API-FAC-031 | POST | `/api/admin/fac/barcode-formats/{id}/publish` | `fac.codigoBarras.configurar` | Publicar (falla si un vector no pasa). Ruta anterior: `/api/admin/fac/formatos-codigo/{id}/publicar` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-032 | GET/POST/PATCH | `/api/admin/fac/barcode-assignments[/{id}]` | `fac.codigoBarras.configurar` | Asignación de formatos a recaudadores y documentos. Ruta anterior: `/api/admin/fac/asignaciones-codigo[/{id}]` (convención de rutas en inglés, maestra §13). | Con clave en POST |
| API-FAC-033 | GET/POST/PATCH | `/api/admin/fac/distribution-routes[/{id}]` | `fac.reparto.configurar` | Rutas de reparto. Ruta anterior: `/api/admin/fac/rutas-reparto[/{id}]` (convención de rutas en inglés, maestra §13). | Con clave en POST |
| API-FAC-034 | GET/POST/PATCH | `/api/admin/fac/postal-carriers[/{id}]` | `fac.reparto.configurar` | Correos y franqueo. Ruta anterior: `/api/admin/fac/correos[/{id}]` (convención de rutas en inglés, maestra §13). | Con clave en POST |
| API-FAC-035 | GET/PATCH | `/api/admin/fac/settings` | `fac.parametros.configurar` | Parámetros del módulo (vía T04). Ruta anterior: `/api/admin/fac/parametros` (convención de rutas en inglés, maestra §13). | Sí (versión) |

### 11.2 Lotes y excepciones

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-FAC-040 | GET | `/api/admin/fac/runs` | `fac.lotes.ver` | Listar lotes. Ruta anterior: `/api/admin/fac/lotes` (convención de rutas en inglés, maestra §13). | Sí |
| API-FAC-041 | POST | `/api/admin/fac/runs` | `fac.lotes.crear` | Crear lote `draft` (ciclo, `adHoc`, `simulation`). Ruta anterior: `/api/admin/fac/lotes` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-042 | GET | `/api/admin/fac/runs/{id}` | `fac.lotes.ver` | Detalle con contadores, fases y progreso. Ruta anterior: `/api/admin/fac/lotes/{id}` (convención de rutas en inglés, maestra §13). | Sí |
| API-FAC-043 | PATCH | `/api/admin/fac/runs/{id}` | `fac.lotes.crear` | Editar fechas/opciones en `draft`. Ruta anterior: `/api/admin/fac/lotes/{id}` (convención de rutas en inglés, maestra §13). | Sí (versión) |
| API-FAC-044 | POST | `/api/admin/fac/runs/{id}/prepare` | `fac.lotes.preparar` | Preparar y congelar v1 (202). Ruta anterior: `/api/admin/fac/lotes/{id}/preparar` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-045 | POST | `/api/admin/fac/runs/{id}/universe/versions` | `fac.lotes.preparar` | Congelar nueva versión con motivo (202). Ruta anterior: `/api/admin/fac/lotes/{id}/universo/versiones` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-046 | GET | `/api/admin/fac/runs/{id}/universe/versions/{v}/diff` | `fac.lotes.ver` | Altas y bajas entre versiones. Ruta anterior: `/api/admin/fac/lotes/{id}/universo/versiones/{v}/diferencias` (convención de rutas en inglés, maestra §13). | Sí |
| API-FAC-047 | POST | `/api/admin/fac/runs/{id}/prebill` | `fac.lotes.prefacturar` | Prefacturar (todo o casos afectados) (202). Ruta anterior: `/api/admin/fac/lotes/{id}/prefacturar` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-048 | GET | `/api/admin/fac/runs/{id}/items` | `fac.lotes.ver` | Casos con filtros (estado, variación, muestra). Ruta anterior: `/api/admin/fac/lotes/{id}/casos` (convención de rutas en inglés, maestra §13). | Sí |
| API-FAC-049 | GET | `/api/admin/fac/runs/{id}/items/{itemId}` | `fac.lotes.ver` | Detalle del caso con prefactura y comparación. Ruta anterior: `/api/admin/fac/lotes/{id}/casos/{itemId}` (convención de rutas en inglés, maestra §13). | Sí |
| API-FAC-050 | POST | `/api/admin/fac/runs/{id}/items/{itemId}/exclude` | `fac.excepciones.excluir` | Excluir con causa. Ruta anterior: `/api/admin/fac/lotes/{id}/casos/{itemId}/excluir` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-051 | POST | `/api/admin/fac/runs/{id}/sample/reviewed` | `fac.lotes.aprobar` | Marcar muestra revisada. Ruta anterior: `/api/admin/fac/lotes/{id}/muestra/revisada` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-052 | GET | `/api/admin/fac/runs/{id}/approval-summary` | `fac.lotes.ver` | Resumen obligatorio para aprobar. Ruta anterior: `/api/admin/fac/lotes/{id}/resumen-aprobacion` (convención de rutas en inglés, maestra §13). | Sí |
| API-FAC-053 | POST | `/api/admin/fac/runs/{id}/approve` | `fac.lotes.aprobar` | Aprobar (o iniciar workflow T11). Ruta anterior: `/api/admin/fac/lotes/{id}/aprobar` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-054 | POST | `/api/admin/fac/runs/{id}/revoke-approval` | `fac.lotes.aprobar` | Volver a `prebilled` antes de emitir. Ruta anterior: `/api/admin/fac/lotes/{id}/revocar-aprobacion` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-055 | POST | `/api/admin/fac/runs/{id}/issue` | `fac.lotes.emitir` | Emitir (202). Ruta anterior: `/api/admin/fac/lotes/{id}/emitir` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-056 | POST | `/api/admin/fac/runs/{id}/pause` | `fac.lotes.pausar` | Pausar al terminar el bloque. Ruta anterior: `/api/admin/fac/lotes/{id}/pausar` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-057 | POST | `/api/admin/fac/runs/{id}/resume` | `fac.lotes.reanudar` | Reanudar desde el último bloque confirmado. Ruta anterior: `/api/admin/fac/lotes/{id}/reanudar` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-058 | POST | `/api/admin/fac/runs/{id}/cancel` | `fac.lotes.cancelar` | Cancelar (solo sin emitidos). Ruta anterior: `/api/admin/fac/lotes/{id}/cancelar` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-059 | POST | `/api/admin/fac/runs/{id}/reprocess` | `fac.lotes.crear` | Crear lote `reprocess` con casos seleccionados o resueltos. Ruta anterior: `/api/admin/fac/lotes/{id}/reprocesar` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-060 | GET | `/api/admin/fac/runs/{id}/numbering` | `fac.lotes.ver` | Rangos emitidos. Ruta anterior: `/api/admin/fac/lotes/{id}/numeracion` (convención de rutas en inglés, maestra §13). | Sí |
| API-FAC-061 | GET | `/api/admin/fac/runs/{id}/export?format={xlsx,csv}` | `fac.lotes.exportar` | Exportar casos y resultados. Ruta anterior: `/api/admin/fac/lotes/{id}/exportar?formato={xlsx,csv}` (convención de rutas en inglés, maestra §13). | Sí |
| API-FAC-062 | POST | `/api/admin/fac/runs/{id}/overrides` | `fac.overrides.aprobar` | Registrar override de validación con motivo. Ruta anterior: `/api/admin/fac/lotes/{id}/overrides` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-063 | GET | `/api/admin/fac/exceptions` | `fac.excepciones.ver` | Bandeja (filtra por alcance del usuario). Ruta anterior: `/api/admin/fac/excepciones` (convención de rutas en inglés, maestra §13). | Sí |
| API-FAC-064 | GET | `/api/admin/fac/exceptions/{id}` | `fac.excepciones.ver` | Detalle con historial. Ruta anterior: `/api/admin/fac/excepciones/{id}` (convención de rutas en inglés, maestra §13). | Sí |
| API-FAC-065 | POST | `/api/admin/fac/exceptions/{id}/assign` | `fac.excepciones.asignar` | Asignar responsable. Ruta anterior: `/api/admin/fac/excepciones/{id}/asignar` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-066 | POST | `/api/admin/fac/exceptions/{id}/resolve` | `fac.excepciones.resolver` | Marcar resuelta (verifica que el dato esté corregido en el módulo dueño). Ruta anterior: `/api/admin/fac/excepciones/{id}/resolver` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-067 | POST | `/api/admin/fac/exceptions/{id}/discard` | `fac.excepciones.excluir` | Excluir del período con causa. Ruta anterior: `/api/admin/fac/excepciones/{id}/descartar` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-068 | POST | `/api/admin/fac/exceptions:bulk-assign` | `fac.excepciones.asignar` | Asignación masiva. Ruta anterior: `/api/admin/fac/excepciones:asignar-masivo` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-158 | GET | `/api/admin/fac/pre-review?runId&categoryId&condition` | `fac.revisionPrevia.ver` | Cola de revisión previa (RF-FAC-174; HUE-ELE-02). Ruta anterior: `/api/admin/fac/revision-previa?runId&categoryId&condition` (convención de rutas en inglés, maestra §13). | Sí |
| API-FAC-159 | POST | `/api/admin/fac/pre-review/{itemId}:decide` | `fac.revisionPrevia.aprobar` | Decisión `approve` / `return` / `exclude` con nota (RN-FAC-154). Ruta anterior: `/api/admin/fac/revision-previa/{itemId}:decidir` (convención de rutas en inglés, maestra §13). | Con clave |

### 11.3 Comprobantes

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-FAC-070 | GET | `/api/admin/fac/invoices` | `fac.comprobantes.ver` | Buscar comprobantes. Ruta anterior: `/api/admin/fac/comprobantes` (convención de rutas en inglés, maestra §13). | Sí |
| API-FAC-071 | GET | `/api/admin/fac/invoices/{id}` | `fac.comprobantes.ver` | Detalle completo. Ruta anterior: `/api/admin/fac/comprobantes/{id}` (convención de rutas en inglés, maestra §13). | Sí |
| API-FAC-072 | GET | `/api/admin/fac/invoices:by-code?code=` | `fac.comprobantes.ver` | Decodificar código de barras y devolver el documento. Ruta anterior: `/api/admin/fac/comprobantes:por-codigo?codigo=` (convención de rutas en inglés, maestra §13). | Sí |
| API-FAC-073 | POST | `/api/admin/fac/drafts` | `fac.comprobantes.crear` | Crear borrador de factura manual. Ruta anterior: `/api/admin/fac/borradores` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-074 | PATCH | `/api/admin/fac/drafts/{id}` | `fac.comprobantes.crear` | Editar cabecera. Ruta anterior: `/api/admin/fac/borradores/{id}` (convención de rutas en inglés, maestra §13). | Sí (versión) |
| API-FAC-075 | POST/PATCH/DELETE | `/api/admin/fac/drafts/{id}/lines[/{lineId}]` | `fac.comprobantes.crear` | Renglones del borrador (el borrador sí se edita y descarta). Ruta anterior: `/api/admin/fac/borradores/{id}/renglones[/{lineId}]` (convención de rutas en inglés, maestra §13). | Con clave en POST |
| API-FAC-076 | POST | `/api/admin/fac/drafts/{id}/calculate` | `fac.comprobantes.crear` | Calcular con M04/M06 y validar; devuelve advertencias. Ruta anterior: `/api/admin/fac/borradores/{id}/calcular` (convención de rutas en inglés, maestra §13). | Sí |
| API-FAC-077 | POST | `/api/admin/fac/drafts/{id}/issue` | `fac.comprobantes.crear` | Emitir el borrador. Ruta anterior: `/api/admin/fac/borradores/{id}/emitir` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-078 | POST | `/api/admin/fac/invoices/{id}/replicate` | `fac.comprobantes.replicar` | Crear borrador replicado. Ruta anterior: `/api/admin/fac/comprobantes/{id}/replicar` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-079 | POST | `/api/admin/fac/invoices/{id}/rebill` | `fac.comprobantes.refacturar` | Iniciar refacturación puntual. Ruta anterior: `/api/admin/fac/comprobantes/{id}/refacturar` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-080 | POST | `/api/admin/fac/annulment-requests` | `fac.comprobantes.anular` | Crear solicitud (individual, rango, archivo). Ruta anterior: `/api/admin/fac/anulaciones` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-081 | POST | `/api/admin/fac/annulment-requests/{id}/evaluate` | `fac.comprobantes.anular` | Evaluar permitidos y excluidos. Ruta anterior: `/api/admin/fac/anulaciones/{id}/evaluar` (convención de rutas en inglés, maestra §13). | Sí |
| API-FAC-082 | POST | `/api/admin/fac/annulment-requests/{id}/submit` | `fac.comprobantes.anular` | Enviar a aprobación. Ruta anterior: `/api/admin/fac/anulaciones/{id}/enviar` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-083 | POST | `/api/admin/fac/annulment-requests/{id}/approve` | `fac.anulaciones.aprobar` / `fac.notasCredito.aprobar` | Aprobar o rechazar; ejecuta JOB-FAC-09. Ruta anterior: `/api/admin/fac/anulaciones/{id}/aprobar` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-084 | GET | `/api/admin/fac/annulment-requests[/{id}]` | `fac.comprobantes.ver` | Seguimiento. Ruta anterior: `/api/admin/fac/anulaciones[/{id}]` (convención de rutas en inglés, maestra §13). | Sí |
| API-FAC-085 | POST | `/api/admin/fac/invoices/{id}/debit-note` | `fac.notasDebito.emitir` (antes `fac.notasDebito.crear`) | ND de ajuste relacionada. Ruta anterior: `/api/admin/fac/comprobantes/{id}/nota-debito` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-086 | GET/PUT | `/api/admin/fac/invoices/{id}/relations` | `fac.relaciones.editar` | Consultar y registrar relaciones manuales. Ruta anterior: `/api/admin/fac/comprobantes/{id}/relaciones` (convención de rutas en inglés, maestra §13). | Con clave en PUT |
| API-FAC-087 | POST | `/api/admin/fac/holds` | `fac.bloqueos.bloquear` | Bloquear comprobantes o cuenta. Ruta anterior: `/api/admin/fac/bloqueos` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-088 | POST | `/api/admin/fac/hold-releases` | `fac.bloqueos.desbloquear` | Desbloquear. Ruta anterior: `/api/admin/fac/desbloqueos` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-089 | GET | `/api/admin/fac/invoices/{id}/holds` | `fac.comprobantes.ver` | Historial de bloqueos. Ruta anterior: `/api/admin/fac/comprobantes/{id}/bloqueos` (convención de rutas en inglés, maestra §13). | Sí |
| API-FAC-090 | PATCH | `/api/admin/fac/invoices/{id}/observations` | `fac.comprobantes.crear` | Observaciones (dato no fiscal, auditado). Ruta anterior: `/api/admin/fac/comprobantes/{id}/observaciones` (convención de rutas en inglés, maestra §13). | Sí (versión) |
| API-FAC-091 | GET | `/api/admin/fac/invoices/{id}/pdf?type={original,duplicate}` | `fac.comprobantes.ver` | Descarga (URL firmada). Ruta anterior: `/api/admin/fac/comprobantes/{id}/pdf?tipo={original,duplicado}` (convención de rutas en inglés, maestra §13). | Sí |
| API-FAC-092 | POST | `/api/admin/fac/invoices/{id}/reprint` | `fac.comprobantes.reimprimir` | Duplicado con motivo y cargo opcional. Ruta anterior: `/api/admin/fac/comprobantes/{id}/reimprimir` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-093 | POST | `/api/admin/fac/invoices/{id}/resend` | `fac.comprobantes.reenviar` | Reenviar por canal. Ruta anterior: `/api/admin/fac/comprobantes/{id}/reenviar` (convención de rutas en inglés, maestra §13). | Con clave |

### 11.4 Operaciones masivas, cargos e importaciones

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-FAC-100 | POST | `/api/admin/fac/mass-operations` | según tipo: `fac.modificacionMasiva.crear`, `fac.recategorizacion.simular`, `fac.retroactivos.crear`, `fac.bloqueos.bloquear` | Crear operación. Ruta anterior: `/api/admin/fac/operaciones-masivas` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-101 | POST | `/api/admin/fac/mass-operations/{id}/preview` | según tipo: `fac.modificacionMasiva.crear`, `fac.recategorizacion.simular`, `fac.retroactivos.crear`, `fac.bloqueos.bloquear` (antes: «Ídem») | Simulación (202). Ruta anterior: `/api/admin/fac/operaciones-masivas/{id}/vista-previa` (convención de rutas en inglés, maestra §13). | Sí |
| API-FAC-102 | GET | `/api/admin/fac/mass-operations/{id}/items` | según tipo: `fac.modificacionMasiva.crear`, `fac.recategorizacion.simular`, `fac.retroactivos.crear`, `fac.bloqueos.bloquear` (antes: «Ídem») | Antes/después por objetivo. Ruta anterior: `/api/admin/fac/operaciones-masivas/{id}/items` (convención de rutas en inglés, maestra §13). | Sí |
| API-FAC-103 | POST | `/api/admin/fac/mass-operations/{id}/approve` | `fac.modificacionMasiva.aprobar` / `fac.recategorizacion.confirmar` / `fac.retroactivos.aprobar` | Aprobar y aplicar (202). Ruta anterior: `/api/admin/fac/operaciones-masivas/{id}/aprobar` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-104 | POST | `/api/admin/fac/mass-operations/{id}/cancel` | según tipo: `fac.modificacionMasiva.crear`, `fac.recategorizacion.simular`, `fac.retroactivos.crear`, `fac.bloqueos.bloquear` (antes: «Ídem creación») | Cancelar antes de aplicar. Ruta anterior: `/api/admin/fac/operaciones-masivas/{id}/cancelar` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-105 | GET/POST/PATCH | `/api/admin/fac/billable-items[/{id}]` | `fac.cargos.crear` / `fac.cargos.editar` | Ítems facturables manuales. Ruta anterior: `/api/admin/fac/cargos[/{id}]` (convención de rutas en inglés, maestra §13). | Con clave en POST |
| API-FAC-106 | POST | `/api/admin/fac/billable-items/{id}/void` | `fac.cargos.anular` | Anular cargo no facturado. Ruta anterior: `/api/admin/fac/cargos/{id}/anular` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-107 | POST | `/api/admin/fac/imports` | `fac.importaciones.crear` | Subir archivo con formato. Ruta anterior: `/api/admin/fac/importaciones` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-108 | GET | `/api/admin/fac/imports/{id}/rows` | `fac.importaciones.crear` | Filas con errores. Ruta anterior: `/api/admin/fac/importaciones/{id}/filas` (convención de rutas en inglés, maestra §13). | Sí |
| API-FAC-109 | POST | `/api/admin/fac/imports/{id}/confirm` | `fac.importaciones.crear` | Aplicar (202). Ruta anterior: `/api/admin/fac/importaciones/{id}/confirmar` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-110 | POST/GET | `/api/admin/fac/cvlp[/{id}]` + `/finalize` | `fac.cvlp.crear` / `fac.cvlp.finalizar` | Proceso CVLP (O10). Ruta anterior: `/finalizar` (convención de rutas en inglés, maestra §13). | Con clave en POST |

### 11.5 Distribución, talones y cierre

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-FAC-120 | POST | `/api/admin/fac/distribution-runs` | `fac.distribucion.ejecutar` | Crear corrida de distribución (lote o selección). Ruta anterior: `/api/admin/fac/distribuciones` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-121 | GET | `/api/admin/fac/distribution-runs[/{id}]` | `fac.distribucion.ver` | Seguimiento con conteos. Ruta anterior: `/api/admin/fac/distribuciones[/{id}]` (convención de rutas en inglés, maestra §13). | Sí |
| API-FAC-122 | GET | `/api/admin/fac/distribution-runs/{id}/deliveries` | `fac.distribucion.ver` | Entregas por estado (destino enmascarado). Ruta anterior: `/api/admin/fac/distribuciones/{id}/entregas` (convención de rutas en inglés, maestra §13). | Sí |
| API-FAC-123 | POST | `/api/admin/fac/distribution-runs/{id}/retry` | `fac.distribucion.ejecutar` | Reintentar fallidas. Ruta anterior: `/api/admin/fac/distribuciones/{id}/reintentar` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-124 | GET | `/api/admin/fac/distribution-runs/{id}/print-file` | `fac.distribucion.exportar` | PDF/archivo de imprenta ordenado (URL firmada). Ruta anterior: `/api/admin/fac/distribuciones/{id}/archivo-impresion` (convención de rutas en inglés, maestra §13). | Sí |
| API-FAC-125 | POST | `/api/admin/fac/distribution-runs/{id}/printed` | `fac.distribucion.ejecutar` | Marcar impreso y entregado a rutas. Ruta anterior: `/api/admin/fac/distribuciones/{id}/impreso` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-126 | POST | `/api/fac/delivery/deliveries:sync` | `fac.reparto.registrarEntrega` | Sincronizar entregas offline (lote de mutaciones con `clientMutationId`). Ruta anterior: `/api/fac/reparto/entregas:sincronizar` (convención de rutas en inglés, maestra §13). | Sí (por mutación) |
| API-FAC-127 | GET | `/api/fac/delivery/my-route?date=` | `fac.reparto.registrarEntrega` | Ruta del repartidor para cache offline. Ruta anterior: `/api/fac/reparto/mi-ruta?fecha=` (convención de rutas en inglés, maestra §13). | Sí |
| API-FAC-128 | POST | `/api/admin/fac/payment-slips` | `fac.talones.generar` | Generar talón sumado o de cuotas. Ruta anterior: `/api/admin/fac/talones` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-129 | GET | `/api/admin/fac/payment-slips[/{id}]` | `fac.talones.generar` | Consultar con pagos. Ruta anterior: `/api/admin/fac/talones[/{id}]` (convención de rutas en inglés, maestra §13). | Sí |
| API-FAC-130 | POST | `/api/admin/fac/payment-slips/{id}/void` | `fac.talones.eliminar` | Anular no pagado. Ruta anterior: `/api/admin/fac/talones/{id}/anular` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-131 | POST | `/api/admin/fac/postage` | `fac.distribucion.ejecutar` | Generar cargos de franqueo. Ruta anterior: `/api/admin/fac/franqueo` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-132 | POST | `/api/admin/fac/cycle-closures` | `fac.cierre.proponer` | Proponer acta (calcula cuadre). Ruta anterior: `/api/admin/fac/cierres` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-133 | GET | `/api/admin/fac/cycle-closures[/{id}]` | `fac.lotes.ver` | Consultar actas. Ruta anterior: `/api/admin/fac/cierres[/{id}]` (convención de rutas en inglés, maestra §13). | Sí |
| API-FAC-134 | POST | `/api/admin/fac/cycle-closures/{id}/submit` | `fac.cierre.proponer` | Enviar a aprobación. Ruta anterior: `/api/admin/fac/cierres/{id}/enviar` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-135 | POST | `/api/admin/fac/cycle-closures/{id}/approve` | `fac.cierre.aprobar` | Aprobar (JOB-FAC-15). Ruta anterior: `/api/admin/fac/cierres/{id}/aprobar` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-136 | POST | `/api/admin/fac/cycle-closures/{id}/reopen` | `fac.cierre.reabrir` | Reabrir con motivo. Ruta anterior: `/api/admin/fac/cierres/{id}/reabrir` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-137 | GET | `/api/admin/fac/cycle-closures/{id}/minutes.pdf` | `fac.lotes.ver` | Descargar acta. Ruta anterior: `/api/admin/fac/cierres/{id}/acta.pdf` (convención de rutas en inglés, maestra §13). | Sí |
| API-FAC-138 | GET | `/api/admin/fac/reports/{report}` | `fac.reportes.ver` | Reportes de §15 (`exportar` con `fac.reportes.exportar`). Ruta anterior: `/api/admin/fac/reportes/{reporte}` (convención de rutas en inglés, maestra §13). | Sí |
| API-FAC-139 | GET/PUT | `/api/admin/fac/delivery-preferences/{holderId}` | `fac.preferencias.editar` | Preferencias de entrega del titular. Ruta anterior: `/api/admin/fac/preferencias-entrega/{holderId}` (convención de rutas en inglés, maestra §13). | Con clave en PUT |

### 11.6 Socio, público y externa

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-FAC-150 | GET | `/api/fac/my-invoices` | `por.comprobantes.ver` | Comprobantes de las cuentas autorizadas del usuario (solo autorizados y publicados). Ruta anterior: `/api/fac/mis-comprobantes` (convención de rutas en inglés, maestra §13). | Sí |
| API-FAC-151 | GET | `/api/fac/my-invoices/{id}` | `por.comprobantes.ver` | Detalle (verifica propiedad; si no, 404). Ruta anterior: `/api/fac/mis-comprobantes/{id}` (convención de rutas en inglés, maestra §13). | Sí |
| API-FAC-152 | GET | `/api/fac/my-invoices/{id}/pdf` | `por.comprobantes.descargar` | PDF con URL firmada de corta vida. Ruta anterior: `/api/fac/mis-comprobantes/{id}/pdf` (convención de rutas en inglés, maestra §13). | Sí |
| API-FAC-153 | GET/PUT | `/api/fac/my-delivery-preferences` | `por.preferencias.editar` | Preferencias propias (adhesión digital). Ruta anterior: `/api/fac/mis-preferencias-entrega` (convención de rutas en inglés, maestra §13). | Con clave en PUT |
| API-FAC-154 | POST | `/api/public/{tenantSlug}/fac/invoices:lookup` | `por.facturas.consultar` (pública, con captcha y límite de tasa; antes `public.facturas.consultar`, originalmente «Pública, captcha y límite de tasa») | Consulta sin login con cuenta + dato de validación (si `PRM-FAC-145`). Respuesta mínima: vencimientos, total, enlace PDF de un solo uso. Ruta anterior: `/api/public/{tenantSlug}/facturas:consultar` (convención de rutas en inglés, maestra §13). | Sí |
| API-FAC-155 | GET | `/api/v1/ext/fac/invoices?from&to` | `bia.fac.comprobantes.ver` (token de integración; antes `ext.fac.comprobantes.ver`, originalmente «Token de integración `ext.fac.leer`») | Lectura para integradores (sin datos personales salvo los fiscales necesarios). Ruta anterior: `/api/v1/ext/fac/comprobantes?desde&hasta` (convención de rutas en inglés, maestra §13). | Sí |
| API-FAC-156 | POST | `/api/v1/ext/fac/imports` | `bia.fac.importaciones.crear` (token de integración; antes `ext.fac.importaciones.crear`, originalmente «Token `ext.fac.importar`») | Carga de ítems de terceros por API (formato canónico). Ruta anterior: `/api/v1/ext/fac/importaciones` (convención de rutas en inglés, maestra §13). | Con clave |
| API-FAC-157 | GET | `/api/v1/ext/fac/codes/{code}` | `bia.fac.codigos.ver` (token de integración; antes `ext.fac.codigos.ver`, originalmente «Token `ext.cob.leer`») | Decodificación para recaudadores (devuelve documento, importe vigente y vencimiento). Ruta anterior: `/api/v1/ext/fac/codigos/{codigo}` (convención de rutas en inglés, maestra §13). | Sí |

### 11.7 Servicios internos expuestos a otros módulos (no HTTP público)

`fac.service.getInvoiceForPayment(code|id)` (M07/M19), `fac.service.isPeriodBilled(contractId, serviceId, period)` (M03, M04), `fac.service.resolveVoucher(accountId, serviceId, sign)` (M11), `fac.service.issueInvoice(draft)` (M08 intereses, M11 ventas: emiten comprobantes por el mismo motor de emisión con su `origin`), `fac.service.reserveNumberRange(posId, voucherTypeId, size)` (in situ), `fac.service.nextNumber({ legalEntityId, voucherTypeId, pointOfSaleId, idempotencyKey })` (M07 recibos; RF-FAC-179, RN-FAC-161), `fac.service.upsertBillableItem(item)` / `fac.service.cancelBillableItem(sourceModule, sourceRef)` (M04, M08, M10, M11, M13, M18: alta idempotente por `{sourceModule, sourceRef.id}` de ítems facturables; CTR-DAT-38).

**Servicios internos de otros módulos que FAC invoca** (FAC no es dueño de estos datos y no los duplica):

- **Recargo entre vencimientos (Vto2 a Vto4) — M08 §7.4 `dueDateSurchargeSchemes` (CTR-DAT-37):** al prefacturar y al emitir, FAC resuelve el espaciado con su `dueDateSchemes` (`dueCount`, `spacing[]`) y pide a `mor.service.computeDueDateSurcharge` de M08 (antes "al servicio interno de M08"), con `{ serviceId, cycleId, voucherTypeId, total1, dueDates[] }`, los importes `totalK` de cada vencimiento; congela en el comprobante `dueDates[].totalK`, `schemeId` y versión. Aplica sobre el resultado RF-FAC-089 (consistencia) y pide a M06 el IVA del recargo. Alcanza a RF-FAC-086 a RF-FAC-090 y RN-FAC-061 a RN-FAC-065: los modos y filas de trama que esas reglas describen se configuran y calculan en M08; FAC solo los consume.
- **Bloqueos de cobro — M08 §7.9 `holdReasons`/`documentHolds` (CTR-DAT-36):** las operaciones de RF-FAC-093 a RF-FAC-097 (individual, masiva, con intereses y propagación al emitir) llaman a `mor.service.applyHold` o `mor.service.releaseHold` de M08 (antes "al servicio interno de M08"), que crean o liberan el `documentHold` y devuelve la proyección vigente (`reasonId`, `effect`, `blocksChannels[]`); FAC la guarda en `invoices.block` y publica EVT-FAC-12. El catálogo de causas (RF-FAC-093, API-FAC-023) es `holdReasons` de M08.
- **Obligaciones con `itemClass`:** cada obligación de EVT-FAC-07 lleva el `itemClass` del renglón de origen (`billableItems.itemClass`, `invoices.lines[].itemClass`; RN-FAC-156), de modo que M07 y M15 apliquen el rol contable sin volver a leer el comprobante.

## 12. Eventos y jobs

### 12.1 Eventos emitidos (outbox)

| EVT-ID | Evento | Cuándo | Payload mínimo | Consumidores |
|---|---|---|---|---|
| EVT-FAC-01 | `fac.billingRun.prepared` | Universo congelado | `runId, universeVersion, counts` | T10 (métricas) |
| EVT-FAC-02 | `fac.billingRun.prebilled` | Prefacturación terminada | `runId, totals, exceptionsCount` | T09 (aviso al responsable) |
| EVT-FAC-03 | `fac.billingRun.approved` | Aprobado | `runId, approvedBy` | T02 auditoría |
| EVT-FAC-04 | `fac.billingRun.paused` | Pausa | `runId, code, source` | T09 (alerta) |
| EVT-FAC-05 | `fac.billingRun.issued` | Emisión terminada | `runId, counters, numberRanges` | M06, T10 |
| EVT-FAC-06 | `fac.billingRun.closed` | Acta aprobada | `runId, cycleId, period, totalsByCapitalItem` | M17 (capital), T10 |
| EVT-FAC-07 | `fac.invoice.issued` | Comprobante emitido (también al reemitir un comprobante devuelto a borrador, con `issueAttempt` + 1; DEC-107) | `invoiceId, legalEntityId (DEC-064, DEC-087), voucherTypeId, letter, posNumber, number, issueAttempt (DEC-107), authorizationType (DEC-107), accountId, holderId, issueDate, dueDates, dueDateCap (DEC-106), lateAuthorizationGraceDays (RN-FAC-165; DEC-107, 10-11-2026), obligations[] (con itemClass, RN-FAC-156), requiresAuthorization` | M06 (autorizar, libro IVA), M07 (obligaciones; no las publica ni las cobra hasta la autorización, RN-COB-158), M03 (marca facturado), M11 (cuotas facturadas), M19 |
| EVT-FAC-08 | `fac.invoice.annulled` | Anulado | `invoiceId, reason, releases` | M07, M06, M03, M11 |
| EVT-FAC-09 | `fac.invoice.reversed` | Revertido total o parcial | `invoiceId, creditNoteId, amount, affectedBlocks` | M07, M06 |
| EVT-FAC-10 | `fac.creditNote.issued` | NC emitida | `invoiceId, originInvoiceIds, amount` | M06, M07 |
| EVT-FAC-11 | `fac.debitNote.issued` | ND emitida | `invoiceId, originInvoiceIds, amount` | M06, M07 |
| EVT-FAC-12 | `fac.invoice.blocked` / `fac.invoice.unblocked` | Cambio de bloqueo | `invoiceId, reasonId` | M07 (caja), M14 (rendiciones), M08 |
| EVT-FAC-13 | `fac.invoice.dueDatesChanged` | Modificación masiva de vencimientos, o vencimientos corridos por autorización tardía (RN-FAC-165; DEC-107, 10-11-2026) | `invoiceId, dueDates, reason (massModification, lateAuthorization; 10-11-2026), lateAuthorizationShift (si reason = lateAuthorization)` | M07, M08, M19 |
| EVT-FAC-14 | `fac.invoice.published` | Disponible para el socio | `invoiceId, accountId` | M19 (portal), T09 (push) |
| EVT-FAC-15 | `fac.invoice.delivered` / `fac.invoice.deliveryFailed` | Resultado de entrega | `invoiceId, channel, status` | M01 (contactabilidad), T10 |
| EVT-FAC-16 | `fac.billingException.opened` / `fac.billingException.resolved` | Excepción | `exceptionId, reasonCode, ownerModule, ownerRole` | Módulo dueño (bandeja), T09 |
| EVT-FAC-17 | `fac.billingCycle.closed` | Ciclo cerrado | `closureId, cycleId, period, reconciliation` | M17, T10, M06 (cierre de período) |
| EVT-FAC-18 | `fac.paymentSlip.generated` / `fac.paymentSlip.cancelled` | Documento de pago | `slipId, invoiceIds, codes` | M07, M19 |
| EVT-FAC-19 | `fac.recategorization.confirmed` | Recategorización aplicada | `operationId, contractId, fromCategory, toCategory, validFrom` | M02 (categoría del contrato), M04 |
| EVT-FAC-20 | `fac.billableItem.billed` | Ítem facturado | `billableItemId, invoiceId, sourceRef` | Módulo origen (M08, M11, M13) |
| EVT-FAC-21 | `fac.billingRun.discarded` | Lote descartado antes de emitir | `runId, cycleId, reason, discardedBy` | M04 (descarta cálculos `draft`/`observed`/`approved` del lote), T10 |
| EVT-FAC-22 | `fac.invoice.returnedToDraft` | Un comprobante CAE sin autorizar libera su número: vuelve a borrador por rechazo de ARCA (`kind = returnedToDraft`) o vuelve a la cola detrás de uno liberado (`kind = requeued`) (RN-FAC-164; DEC-107) | `invoiceId, legalEntityId, numberSequenceId, releasedNumber, kind, reason, arcaCode, issueAttempt, billingRunId` | M06 (cancela la solicitud de autorización con motivo `numberReleased`), M07 (la obligación queda sin publicar ni cobrar, RN-COB-158), M19, T02 (auditoría) |
| EVT-FAC-23 | `fac.invoice.renumbered` | Un comprobante `requeued` recibe número nuevo al reenviarse (RN-FAC-164; DEC-107) | `invoiceId, legalEntityId, numberSequenceId, previousNumber, number, fullNumber, issueAttempt` | M06 (nueva solicitud de autorización), M07 (actualiza el número visible de la obligación), M19, T02 (auditoría) |

### 12.2 Eventos consumidos

| Evento | Productor | Efecto en FAC |
|---|---|---|
| `fis.invoice.authorized` / `fis.authorization.detained` / `fis.authorization.rejected` / `fis.authorization.uncertain` (EVT-FIS-01/03/02/04) | M06 | JOB-FAC-18: actualiza `fiscal`, caso del lote, excepción y dispara PDF/distribución; con `authorized` actualiza `numberSequences.lastAuthorizedNumber` y, si la autorización llega después del primer vencimiento, corre los vencimientos antes del PDF y publica EVT-FAC-13 con `reason = lateAuthorization` (RN-FAC-165; 10-11-2026); con `rejected` aplica RN-FAC-164 según `rejectionKind` (`dataError` → `returnedToDraft`; `sequenceOnly` → `requeued`) (DEC-107). |
| `fis.authorization.globalFailure` | M06 | Pausa lotes en `issuing` del tenant (motivo sistémico). |
| `fis.caea.reported` | M06 | Actualiza comprobantes en contingencia; un comprobante rechazado al informar queda `reportRejected` con su número y se trata según RN-FAC-164 punto 9 (DEC-107). |
| `med.consumption.approved` (EVT-MED-11) / `med.consumption.voided` (EVT-MED-13) | M03 | Marca casos del lote preparado como afectados (re-prefacturar). |
| `cat.contract.planChanged` / `.categoryChanged` / `.addressChanged` / `.flagChanged` (EVT-CAT-18 a EVT-CAT-21) / `cat.contract.terminated` (EVT-CAT-15) | M02 | Revalida elegibilidad y grupos. |
| `per.person.updated` (EVT-PER-02) / `per.taxId.verified` (EVT-PER-08) | M01 | Resuelve excepciones de datos fiscales pendientes (sugiere "resolver"). |
| `per.person.identificationRegularized` (EVT-PER-27) | M01 | Resuelve las excepciones `RECEIVER_DOCUMENT_PENDING` de la persona, toma la foto nueva de `holderIdentifierSnapshot` (con `identificationStatus` regularizado) y reprocesa los casos (RN-FAC-162; DEC-099). |
| `cob.payment.confirmed` | M07 | Marca talones pagados; bloquea anulación del comprobante. |
| `com.communication.delivered` / `com.communication.failed` / `com.communication.read` | T09 | Actualiza `invoiceDeliveries`. |
| `mor.deferredInterest.created` (EVT-MOR-03) | M08 | Crea `billableItems` de interés facturado (o emite ND por `issueInvoice`). |
| `ven.installmentPlan.created` (EVT-VEN-11) / `ven.installment.updated` (EVT-VEN-12) | M11 | Proyecta cuotas en `billableItems` (o las excluye). |
| `tar.schedule.published` (EVT-TAR-004) | M04 | Marca lotes preparados con regla desactualizada. |
| `cat.contract.meteringRegimeChanged` (EVT-CAT-28) | M02 | Solo si `effectiveAt` cae en el período de un lote preparado y no emitido: marca los casos del contrato como afectados para volver a prefacturar (RF-FAC-178, RN-FAC-158; HUE-AG-03). Idempotente por `commandId`. |

### 12.3 Jobs

Definidos en §9.9 (JOB-FAC-01 a JOB-FAC-18). Todos son idempotentes, registran en T02 (auditoría) inicio, fin y resultado, y exponen métricas (duración, casos por minuto, errores) en T10.

## 13. Integraciones

| Integración | Dirección | Mecanismo | Dueño | Qué intercambia FAC | Falla y contingencia |
|---|---|---|---|---|---|
| ARCA (WSFEv1, CAEA, consulta de último comprobante) | Salida indirecta | Cola de autorización de M06 | M06 | FAC solo deja el comprobante en cola (`fac.invoice.issued` con `requiresAuthorization`) y consume el resultado. | Caída: pendientes `queued`; credencial inválida: pausa sistémica (RF-FAC-037); sin respuesta: `uncertain` + JOB-FAC-08; contingencia CAEA según PA-FAC-19. |
| Motor de cálculo (M04) | Llamada interna síncrona por bloque | Servicio interno con `ruleVersions` fijadas | M04 | Entrada: contrato, consumo, período, versión de cuadro; salida: renglones, tributos (con M06), traza. | Error individual → excepción `CALCULATION_ERROR`; caída → pausa sistémica. |
| Recaudadores (Pago Fácil, Rapipago, Link, Banelco, SIRO, bancos) | Salida (códigos impresos) y entrada (lectura vía M07) | `barcodeFormats` + API-FAC-157 | FAC (formato), M07 (rendición) | Códigos generados por formato y convenio; decodificación. | Formato sin convenio: excepción de impresión; desborde: formato alternativo (PA-FAC-12). |
| Pasarela de pagos con QR (tipo Pagos360/SIRO QR) | Salida | Solicitud de pago creada por M07, QR impreso por FAC | M07 (solicitud), FAC (representación) | Id de solicitud, monto, vencimiento → QR EMVCo en el PDF. | Sin solicitud: se omite el QR sin bloquear la emisión. |
| Email y WhatsApp | Salida | T09 (proveedores configurables) | T09 | Plantilla, destinatario, adjunto o enlace firmado; callbacks de estado. | Rebote → papel; tandas con espera (`PRM-FAC-133`, `PRM-FAC-134`). |
| Imprenta externa / correo | Salida | Archivo de impresión descargable (PDF por lote y archivo de datos) | FAC | PDF ordenado por ruta/pieza, listado de piezas. | Reimpresión por rango de piezas. |
| Importadores de terceros (EMA, SAM, CT1, EME, FAR, IAL, CEL, PR1, facturas de gas) | Entrada | `billingImports` + API-FAC-156 | FAC | Ítems facturables o comprobantes. | Errores por fila sin aplicar parcial no confirmado. |
| Portal y app (M15) | Salida | Eventos + API-FAC-150..153 | M15 | Comprobantes publicados y PDF. | Cache offline en PWA (últimas 12). |
| Contabilidad (M17) | Salida | Eventos `fac.billingRun.closed`, `fac.billingCycle.closed` | M17 | Totales por concepto y rubro de capital. | Reintento por outbox. |
| Reguladores (ENARGAS, ENACOM, EPEC u otros) | Salida | Reportes de M06 sobre `invoices` | M06 | Datos de comprobantes (lectura). | — |

## 14. Parámetros

Todos se administran en T04 con versión, vigencia y auditoría; ámbito `tenant` salvo indicación. "Origen V2" es el número del parámetro de ProCoop (RN-09) o "—" si es nuevo.

### 14.1 Lote, calendario y validaciones

| PRM-ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 |
|---|---|---|---|---|---|---|
| PRM-FAC-010 | `fac.nextRun.daysAfterMonthEnd` | Int | tenant | 10 | Propuesta de próxima facturación: fin de mes + N. | — (`GetFechaProximaFacturacion`) |
| PRM-FAC-011 | `fac.nextRun.recentRunDays` | Int | tenant | 60 | Si la última fue hace menos de N días, se propone un mes después. | — |
| PRM-FAC-020 | `fac.pendingAuthorization.maxDays` | Int | tenant | 3 | Antigüedad máxima de comprobantes pendientes de autorización antes de alertar o bloquear. | `ValidarElectronicas` |
| PRM-FAC-021 | `fac.pendingAuthorization.action` | Enum `warn, block` | tenant | `warn` | Acción ante pendientes antiguos al preparar un lote. | — |
| PRM-FAC-022 | `fac.authorization.mode` | Enum `automatic, manual` | tenant | `automatic` | Autorizar al emitir o aguardar acción manual. | 726, 727 |
| PRM-FAC-023 | `fac.block.propagateOnClose` | Boolean | tenant | false | Propagar causa de bloqueo mínima a comprobantes del día al cerrar (PA-FAC-15). | 2769 |
| PRM-FAC-030 | `fac.comparison.variationPct` | Dec | servicio | 50 | Variación porcentual que marca advertencia. | — |
| PRM-FAC-031 | `fac.comparison.variationAmount` | Money | servicio | 20000 | Variación absoluta que marca advertencia. | — |
| PRM-FAC-032 | `fac.issue.zeroWithConsumption` | Boolean | servicio | false | Emitir en cero cuando hay consumos (PA-FAC-06). | 2526 |
| PRM-FAC-033 | `fac.issue.systemicErrorPct` | Dec | tenant | 20 | % de errores en un bloque que se trata como fallo sistémico. | — |
| PRM-FAC-034 | `fac.approval.sampleRequiredOver` | Int | tenant | 500 | Casos a partir de los cuales la muestra revisada es obligatoria (PA-FAC-11). | — |
| PRM-FAC-035 | `fac.issue.blockSize` | Int | tenant | 300 | Casos por bloque/transacción. | 2315 |
| PRM-FAC-036 | `fac.run.allowForcedTariff` | Boolean | tenant | true | Permitir forzar cuadro tarifario histórico. | 2404 |
| PRM-FAC-037 | `fac.run.maxYearsBack` | Int | tenant | 5 | Antigüedad máxima del período. | — |
| PRM-FAC-038 | `fac.calendar.saturdayIsBusinessDay` | Boolean | tenant | false | Sábado hábil para vencimientos. | — (`ValidarSabado`) |
| PRM-FAC-039 | `fac.dueDates.maxIntervalDays` | Int | tenant | 60 | Intervalo máximo entre vencimientos. | — |
| PRM-FAC-040 | `fac.pos.allowZeroForInternal` | Boolean | tenant | false | Permitir PV 0 en comprobantes internos. | 2549 |
| PRM-FAC-041 | `fac.numbering.allowManual` | Boolean | tenant | false | Permitir número forzado en comprobante individual. | 376 |
| PRM-FAC-042 | `fac.module.closingDate` | Date | tenant | — | Fecha de cierre de facturación. | Cierre de módulo |
| PRM-FAC-043 | `fac.universe.terminatedMonths` | Int | tenant | 6 | Meses desde la baja en que una cuenta aún entra. | — |
| PRM-FAC-044 | `fac.installments.monthsBack` | Int | tenant | 10 | Meses hacia atrás para tomar cuotas. | — |
| PRM-FAC-045 | `fac.internal.forbidTaxedConcepts` | Boolean | tenant | true | Prohibir conceptos gravados en internos. | 739 |
| PRM-FAC-046 | `fac.manual.discountConceptId` | Ref concepto | tenant | — | Concepto de descuento obligatorio si hay descuento. | 2564 |
| PRM-FAC-047 | `fac.manual.maxSuggestedAmount` | Money | tenant | — | Total que exige confirmación explícita. | 3080 |
| PRM-FAC-048 | `fac.credits.maxAmount` | Money | tenant | — | Importe máximo al generar créditos. | 2783 |
| PRM-FAC-049 | `fac.invoice.maxLines` | Int | plataforma | 500 | Renglones máximos embebidos por comprobante. | — |
| PRM-FAC-050 | `fac.manual.maxDaysToFirstDue` | Int | tenant | 60 | Días máximos de hoy a Vto1 en individuales. | 2271 |
| PRM-FAC-051 | `fac.replicate.allItems` | Boolean | tenant | false | Replicar todos los ítems (no solo servicios). | 2754 |
| PRM-FAC-052 | `fac.manualCredit.relation` | Enum `suggest, require, ignore` | tenant | `require` | Relación al cargar créditos manuales. | 2450 |
| PRM-FAC-053 | `fac.reprint.chargeConceptId` | Ref concepto | tenant | — | Cargo por reimpresión. | 2612 |
| PRM-FAC-054 | `fac.slips.allowDelete` | Boolean | tenant | true | Permitir anular talones no pagados. | 2360 |
| PRM-FAC-055 | `fac.slips.singleInvoiceSimple` | Boolean | tenant | true | Factura simple si el talón tiene una sola. | 2947 |
| PRM-FAC-056 | `fac.manual.defaultSellerId` | Ref | tenant | — | Vendedor por defecto. | 1008 |
| PRM-FAC-057 | `fac.currency.allowForeign` | Boolean | tenant | false | Permitir otras monedas. | 3133 |
| PRM-FAC-058 | `fac.manual.allowPeriodChange` | Boolean | tenant | false | Permitir modificar el período del comprobante antes de emitir. | 2695 |
| PRM-FAC-059 | `fac.manual.autoPrint` | Boolean | usuario | false | Imprimir al emitir factura manual. | 2472 |

### 14.2 Conceptos, políticas y reglas

| PRM-ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 |
|---|---|---|---|---|---|---|
| PRM-FAC-060 | `fac.requiredConcepts` | Object (refs) | tenant | — | Conceptos obligatorios: interés por mora, interés anterior, interés por financiación, IVA, interés de venta, descuento de venta. | 307, 311, 543, 607, 2089, 2247 |
| PRM-FAC-061 | `fac.capital.registerOnClose` | Boolean | tenant | false | Registrar capital sobre lo facturado al cerrar. | 2736, 2855 |
| PRM-FAC-062 | `fac.installments.skipWithoutServices` | Boolean | tenant | false | No emitir comprobantes solo de cuotas. | 2443 |
| PRM-FAC-063 | `fac.negativeTotal.dgConceptId` | Ref concepto | servicio | — | Concepto de crédito a futuro por generación distribuida (PA-FAC-05). | 3094 |
| PRM-FAC-064 | `fac.miPyme.threshold` | Money | tenant | Valor vigente ARCA | Umbral FCE MiPyME. | 2515 |
| PRM-FAC-065 | `fac.reversal.stockExcludedVoucherTypes` | Array refs | tenant | Tipos 5, 6, 83, 92 equivalentes | Tipos excluidos de reversión de stock. | — |
| PRM-FAC-066 | `fac.relations.daysBack` | Int | tenant | 90 | Días hacia atrás en la relación manual. | — |
| PRM-FAC-067 | `fac.sales.closingDates` | Object | tenant | — | Cierre de ventas y segunda fecha de cierre. | 67, 2528 |
| PRM-FAC-068 | `fac.installments.includeInServiceInvoice` | Boolean | tenant | false | Incluir cuotas de ventas en la factura de servicio (MER-010). | — |
| PRM-FAC-069 | `fac.imports.ct1ConceptId` | Ref concepto | tenant | — | Concepto por defecto de importación CT1. | 2284 |
| PRM-FAC-070 | `fac.segregationOfDuties` | Boolean | tenant | true | Separación preparar/aprobar y solicitar/aprobar NC. | — |
| PRM-FAC-071 | `fac.creditNote.approvalThreshold` | Money | tenant | 0 | NC por encima requieren aprobación (0 = todas). | — |
| PRM-FAC-072 | `fac.run.doubleApprovalThreshold` | Money | tenant | — | Total de lote que exige segunda aprobación. | — |
| PRM-FAC-073 | `fac.billingMode.default` | Enum `separate, grouped` | tenant | `separate` | Modalidad por defecto (PA-FAC-01). | — (BASE §103) |
| PRM-FAC-074 | `fac.grouped.periodicityRule` | Enum `nextGroupInvoice, separate, prorate` | tenant | `nextGroupInvoice` | Periodicidades distintas en un grupo (PA-FAC-02). | — |
| PRM-FAC-075 | `fac.multipleSupplies.rule` | Enum `perContract, perAccount` | servicio | `perContract` | Varios suministros del mismo servicio (PA-FAC-07). | — |
| PRM-FAC-076 | `fac.distribution.onlyAuthorized` | Boolean | tenant | true | Distribuir/publicar solo autorizados (PA-FAC-03). | — |
| PRM-FAC-077 | `fac.exchangeDifference.groupId` | Ref | tenant | — | Grupo/clasificación para ítems de diferencia de cotización. | 2512 |
| PRM-FAC-078 | `fac.services.billAlone` | Array refs | tenant | — | Servicios que se facturan en comprobante propio. | 3191 |
| PRM-FAC-079 | `fac.housing.invoiceClassCode` | String | tenant | — | Clasificación comercial de cuotas de viviendas. | 639 |

### 14.3 Vencimientos y recargos

| PRM-ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 |
|---|---|---|---|---|---|---|
| PRM-FAC-080 | `fac.surcharge.mode` | Enum `fixedAmount, fixedPercent, dailyPercent, scheme` | tenant | `scheme` | Modo de recargo entre vencimientos. | 74 |
| PRM-FAC-081 | `fac.surcharge.rate` | Dec | tenant | — | Tasa o monto del recargo. | 578 |
| PRM-FAC-082 | `fac.surcharge.vatConceptId` | Ref concepto | tenant | — | Concepto de interés para IVA del recargo. | 606 |
| PRM-FAC-083 | `fac.totals.noRounding` | Boolean | tenant | false | No redondear totales de vencimientos. | 21 |
| PRM-FAC-084 | `fac.scheme.changeSurchargeConceptId` | Ref concepto | tenant | — | Concepto por recargo en cambio de trama (prepago). | 2283 |

### 14.4 Recategorización

| PRM-ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 |
|---|---|---|---|---|---|---|
| PRM-FAC-090 | `fac.recat.gasByBimester` | Boolean | servicio | false | Recategorizar gas por bimestres. | 2498 |
| PRM-FAC-091 | `fac.recat.byReadingDate` | Boolean | servicio | false | Recategorizar por fecha de lectura. | 2530 |
| PRM-FAC-092 | `fac.recat.ignoreInactiveCategories` | Boolean | servicio | true | Ignorar categorías inactivas. | 3184 |
| PRM-FAC-093 | `fac.recat.correctedRounding` | Enum `truncate, round` | servicio | `round` | Redondeo del consumo corregido de gas. | 119 |
| PRM-FAC-094 | `fac.recat.askReadingDateFrom` | Boolean | servicio | false | Pedir fecha desde de lecturas. | 2643 |
| PRM-FAC-095 | `fac.recat.savingThresholdPct` | Dec | servicio | 20 | Ahorro mínimo para categorías de beneficio. | — |
| PRM-FAC-096 | `fac.recat.fallbackPreviousYear` | Boolean | servicio | true | Usar el año anterior al anterior si falta dato (salvo TEMP). | 2242 |
| PRM-FAC-097 | `fac.recat.benefitStatusMap` | Object | tenant | — | Equivalencias de estado de beneficio al confirmar. | 2264 (sigla ARR) |

### 14.5 Impresión, PDF y código de barras

| PRM-ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 |
|---|---|---|---|---|---|---|
| PRM-FAC-100 | `fac.print.defaultTemplateId` | Ref | tenant | — | Plantilla por defecto. | 565 |
| PRM-FAC-101 | `fac.print.prepaidTemplateId` | Ref | tenant | — | Plantilla de prepago. | 156 |
| PRM-FAC-102 | `fac.print.summedSlipTemplateId` | Ref | tenant | — | Plantilla de talón sumado; imprimir con talón. | 34, 291 |
| PRM-FAC-103 | `fac.print.allowForcedTemplateInMass` | Boolean | tenant | false | Forzar plantilla en impresión masiva. | 2511 |
| PRM-FAC-104 | `fac.print.callDetail` | Boolean | servicio | false | Detalle de llamadas en telefonía. | 2157 |
| PRM-FAC-105 | `fac.print.phoneConsumptionChart` | Boolean | servicio | false | Consumos de teléfono en gráficos. | 2829 |
| PRM-FAC-106 | `fac.pdf.font` | String | tenant | Plataforma | Fuente del PDF. | 2368 |
| PRM-FAC-107 | `fac.pdf.quality` | Enum `standard, high` | tenant | `standard` | Calidad del PDF. | 2369 |
| PRM-FAC-108 | `fac.pdf.massPasswordSecretRef` | Ref secreto | tenant | — | Contraseña del PDF masivo (en bóveda). | 2402 |
| PRM-FAC-109 | `fac.pdf.convertImagesToJpeg` | Boolean | tenant | true | Convertir imágenes a JPEG. | 2697 |
| PRM-FAC-110 | `fac.barcode.defaultFormatId` | Ref | tenant | — | Formato por defecto. | 2055 |
| PRM-FAC-111 | `fac.barcode.agreementCode` | String | tenant | — | Convenio por defecto. | 2255 |
| PRM-FAC-112 | `fac.summary.scope` | Enum `memberWithFinancing, member, accountWithFinancing, account` | tenant | `account` | Resumen y código 22 por socio o cuenta. | 242 |
| PRM-FAC-113 | `fac.barcode.siroMaxDaysFromLastDue` | Int | tenant | — | Días máximos desde el último vencimiento (SIRO). | 2869 |
| PRM-FAC-114 | `fac.qr.merchantTaxId` | String | tenant | — | CUIT del comercio para QR. | 519 |
| PRM-FAC-115 | `fac.qr.merchantName` | String (≤ 25) | tenant | — | Nombre del comercio. | 2759 |
| PRM-FAC-116 | `fac.qr.postalCode` | String | tenant | — | Código postal. | 2760 |
| PRM-FAC-117 | `fac.qr.city` | String (≤ 15) | tenant | — | Ciudad. | 2761 |
| PRM-FAC-118 | `fac.qr.mcc` | String | tenant | — | Código de rubro (MCC). | 2773 |
| PRM-FAC-119 | `fac.qr.siro` | Object | tenant | — | CUIT SIRO y días del 3.er vencimiento del QR. | 2798, 3144 |
| PRM-FAC-120 | `fac.paymentLink.auto` | Object | tenant | — | Link de pago automático y medio. | 2621, 2704 |
| PRM-FAC-121 | `fac.qr.defaultEmail` | String | tenant | — | Email por defecto para la solicitud QR. | 2764 |
| PRM-FAC-122 | `fac.reading.useAccountInsteadOfRoute` | Boolean | tenant | false | Usar número de cuenta en lugar de ruta en lectura. | 484 |

### 14.6 Distribución y portal

| PRM-ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 |
|---|---|---|---|---|---|---|
| PRM-FAC-130 | `fac.delivery.maxRetries` | Int | tenant | 3 | Reintentos por canal digital. | — |
| PRM-FAC-131 | `fac.email.attachFile` | Boolean | tenant | true | Adjuntar PDF (si no, enlace firmado). | 539 |
| PRM-FAC-132 | `fac.email.templateId` | Ref T09 | tenant | — | Plantilla de email. | 540 |
| PRM-FAC-133 | `fac.email.batchSize` | Int | tenant | 200 | Tamaño de tanda. | 404 |
| PRM-FAC-134 | `fac.email.waitSeconds` | Int | tenant | 60 | Espera entre tandas. | 461 |
| PRM-FAC-135 | `fac.email.perPrintBatch` | Int | tenant | — | Mails por lote de impresión masiva. | 2626 |
| PRM-FAC-136 | `fac.email.grouping` | Enum `none, account, member` | tenant | `account` | Agrupar emails. | 2423, 2635 |
| PRM-FAC-137 | `fac.whatsapp.grouping` | Enum `none, account, member, memberAndPhone` | tenant | `account` | Agrupar WhatsApp. | 2954, 2955, 3051 |
| PRM-FAC-138 | `fac.freight.skipIfDigital` | Boolean | tenant | true | No cobrar franqueo si está adherido a digital. | 2663 |
| PRM-FAC-139 | `fac.print.defaultBatch` | Int | tenant | — | Lote por defecto en impresión. | 2274 |
| PRM-FAC-140 | `fac.print.assignOrder` | Boolean | tenant | true | Asignar orden en impresión masiva. | 2741 |
| PRM-FAC-141 | `fac.print.excludeTerminatedInZsr` | Boolean | tenant | true | Excluir bajas en el orden por zona-sector-recorrido. | 2815 |
| PRM-FAC-142 | `fac.print.splitByHolderCount` | Int | tenant | — | Separar facturas por titular según cantidad. | 2367 |
| PRM-FAC-143 | `fac.print.duplicateInMass` | Boolean | tenant | false | Imprimir duplicado en masiva. | 2319 |
| PRM-FAC-144 | `fac.print.showPreview` | Boolean | usuario | true | Vista previa antes de imprimir. | 42 |
| PRM-FAC-145 | `fac.portal.anonymousLookup` | Boolean | tenant | false | Consulta de factura sin login. | 60, 61 |
| PRM-FAC-146 | `fac.portal.cart` | Boolean | tenant | true | Carro de facturas para pagar varias. | 45 |
| PRM-FAC-147 | `fac.portal.visibleClasses` | Enum `all, monthlyOnly, dailyOnly` | tenant | `all` | Qué facturación se muestra en web. | 2261, 39 |
| PRM-FAC-148 | `fac.portal.includeFinancingInstallments` | Boolean | tenant | false | Mostrar cuotas de financiación. | 2448 |
| PRM-FAC-149 | `fac.print.massDownloadView` | Boolean | tenant | false | Vista de descargas masivas por plantilla. | 3036 |

### 14.7 Otros comprobantes y terceros

| PRM-ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 |
|---|---|---|---|---|---|---|
| PRM-FAC-150 | `fac.cvlp.settings` | Object | servicio | — | CVLP: concepto CPP, comisiones (hasta 3) y default, rendición según cobranzas, ND, sin percepciones, filtro (O10). | 19, 70, 71, 76, 78, 141, 297, 353 |
| PRM-FAC-151 | `fac.authorization.maxAmount` | Money | tenant | — | Importe máximo para autorizar automáticamente (por comprobante y por lote); referencia a M06. | 2427, 2712 |
| PRM-FAC-152 | `fac.reports.dateType` | Enum `issue, period, due` | tenant | `issue` | Fecha que muestran los reportes. | 2476 |
| PRM-FAC-153 | `fac.print.unknownConceptText` | String | tenant | — | Texto de concepto desconocido. | 2318 |
| PRM-FAC-154 | `fac.telephony.billZeroConsumption` | Boolean | servicio | false | Facturar telefonía con consumo 0 (criterio de M04). | 2514 |
| PRM-FAC-155 | `fac.interest.useInvoiceNotDebitNote` | Boolean | tenant | false | Intereses facturados como factura en lugar de ND (M08). | 273 |
| PRM-FAC-156 | `fac.interest.advanceVoucherTypeId` | Ref | tenant | — | Comprobante de intereses adelantados. | 339 |
| PRM-FAC-157 | `fac.interest.unblockSettings` | Object | tenant | — | Tipo, % y concepto de intereses por desbloqueo. | 2984, 2770, 2771 |
| PRM-FAC-158 | `fac.mass.allowProductAdvances` | Boolean | tenant | false | Anticipos de productos en masiva. | 3038 |
| PRM-FAC-159 | `fac.mass.blocked` | Boolean | tenant | false | Bloqueo global de la facturación masiva (mantenimiento). | 421 |
| PRM-FAC-160 | `fac.print.thirdPartyTemplateId` | Ref | tenant | — | Modelo de impresión de terceros. | 2081 |
| PRM-FAC-161 | `fac.preReview.criteria` | Object `{ categoryIds[], specialConditions[] (largeUser, distributedGeneration, specialAgreement, flaggedAccount), includeTariffRequiresReview }` | tenant/servicio | `{ categoryIds: [], specialConditions: [largeUser], includeTariffRequiresReview: true }` | Categorías y condiciones especiales que pasan por la cola de revisión previa (RF-FAC-174, RN-FAC-154; HUE-ELE-02). | — |
| PRM-FAC-162 | `fac.preReview.segregationOfDuties` | Boolean | tenant | true | Revisor distinto de quien preparó el lote (RN-FAC-154). | — |
| PRM-FAC-163 | `fac.dueDates.maxCount` | Object `{ default: Int ≥ 1, byVoucherTypeId: { <voucherTypeId>: Int ≥ 1 }, byServiceId: { <serviceId>: Int ≥ 1 } }` | tenant (con excepciones por tipo de comprobante y servicio) | `{ default: 4, byVoucherTypeId: {}, byServiceId: {} }` | Tope de vencimientos por comprobante; el efectivo es el menor entre el del tipo y los de los servicios del comprobante. Subirlo valida la capacidad de los formatos de código de barras y de los layouts de los entes habilitados; ante los que admiten menos se publican los primeros N (RF-FAC-086, RN-FAC-163; DEC-106). | — (ProCoop: 4 fijos) |
| PRM-FAC-164 | `fac.dueDates.lateAuthorizationGraceDays` | Int ≥ 0 (días corridos) | tenant (con excepciones por tipo de comprobante y servicio) | 10 [VERIFICAR con el contador] | Días de gracia desde la autorización fiscal para el primer vencimiento cuando ARCA autoriza un comprobante después de su primer vencimiento; los siguientes se corren la misma cantidad de días; la trama (`dueDateSchemes.lateAuthorizationGraceDays`) puede fijar otro valor (RN-FAC-165; DEC-107, 10-11-2026). | — (ProCoop: no existe) |

Parámetros de RN-09 de cálculo puro (cuadros, bonificaciones, prorrateos, consumos estimados) se especifican en M04; los de impuestos, percepciones, CAE/CAEA y libro IVA en M06; los de interés por mora y planes de cuotas en M08. Parámetros de ProCoop que dependían de siglas de cooperativa (ej. 2264 por "ARR") se reemplazan por configuración declarativa (CTR-FAC-10).

## 15. Reportes

| Reporte | Universo | Fórmula / contenido | Fecha de corte | Equivalencia INV |
|---|---|---|---|---|
| Facturación por período | Comprobantes no anulados de débito − créditos del período | Por servicio, concepto, categoría, condición fiscal: neto, IVA, otros tributos, total; cantidad de comprobantes. | Fecha según `PRM-FAC-152` | — |
| Movimiento por concepto | Renglones de comprobantes emitidos | Por concepto: cantidad, importe; detalle exportable. | Emisión | `frmMovimientoConcepto`, `_Export` |
| Diferencias entre conceptos | Dos períodos o dos lotes | Δ importe y Δ cantidad por concepto; casos con mayor variación. | Períodos elegidos | `frmDiferenciaConceptos` |
| Diferencias entre cuentas | Dos períodos, cuentas seleccionadas o automáticas | Δ total por cuenta, opcionalmente con financiaciones. | Períodos elegidos | `frmDiferenciasCuentas` |
| Cuadre del lote/ciclo | Casos de los lotes del ciclo/período | `seleccionados = emitidos + pendientes + excluidos + trasladados`; totales por servicio. | Momento de consulta (o acta) | Nuevo |
| Excepciones por motivo y antigüedad | Excepciones abiertas | Cantidad por motivo, responsable, tramo de antigüedad (0–2, 3–7, > 7 días), vencidas por SLA. | Momento de consulta | Nuevo |
| Pendientes de autorización | Comprobantes `pending/queued/uncertain/rejected` | Cantidad e importe por PV y antigüedad. | Momento de consulta | Alerta REL §1 |
| Numeración utilizada | `billingRunNumberRanges` + emitidos individuales | Rangos por tipo y PV, huecos detectados (deben ser 0 en electrónicos). | Período | `FACTMES_COMP` |
| Comprobantes bloqueados | Bloqueo vigente | Por causa, antigüedad, saldo (de M07). | Momento de consulta | `HISBLOQ` |
| NC, ND y anulaciones | Comprobantes de corrección | Por motivo, usuario, aprobador, importe; relación con el original. | Emisión | — |
| Entregas | `invoiceDeliveries` | Por canal y estado; tasa de rebote; devoluciones de papel por ruta. | Período de distribución | Nuevo |
| Comparación con período anterior | Casos del lote | Variación % e importe; casos sobre umbral. | Prefacturación | Nuevo |

Todos los reportes filtran por tenant y por el alcance de datos del usuario, se exportan a xlsx/csv con `fac.reportes.exportar` y la exportación queda auditada.

## 16. Casos de uso

| CU-ID | Nombre | Actor | Precondición | Flujo principal | Alternativos / excepciones | Resultado |
|---|---|---|---|---|---|---|
| CU-10 | Liquidar y facturar un período (BASE §10) | Responsable de facturación | Consumos aprobados, cuadros vigentes | §9.1 pasos 1–12. | Excepciones (§9.2), pausa (§9.6). | Comprobantes emitidos y obligaciones en M07. |
| CU-FAC-01 | Emitir lote de facturación (BASE §44) | Responsable, aprobador | Lote `prebilled` | Revisar resumen, aprobar, emitir, seguir progreso. | Separación de funciones impide auto-aprobación (403 `FAC_SEGREGATION_OF_DUTIES`). | Lote `issued` o `issuedWithPending`. |
| CU-LOT-01 | Ejecutar lote con excepciones (BASE §69) | Responsable, correctores | Lote preparado | Prefacturar, trabajar la bandeja, reprocesar. | Exclusión con causa; traslado al cierre. | Cuadre completo del lote. |
| CU-103 | Facturar agrupado a un titular (BASE §103) | Responsable | Grupo `active` con validación fiscal | El lote resuelve modalidad agrupada y emite un comprobante con bloques por servicio. | Periodicidad distinta (PA-FAC-02); PV distintos → excepción `MIXED_POS_IN_GROUP`. | Un comprobante, una obligación por servicio. |
| CU-40 (paso 6) | Ejemplo integrado (BASE §40) | Sistema | Consumo aprobado | Emite la factura del ejemplo con sus vencimientos. | — | Factura disponible para cobro. |
| CU-FAC-02 | Configurar ciclo, universo y plantilla | Responsable | — | Crear universo, plantilla y ciclo; vista previa de calendario; publicar. | Solapamiento de universos → error. | Ciclo programado. |
| CU-FAC-03 | Resolver excepción | Corrector | Excepción abierta asignada | Abrir enlace, corregir en el módulo dueño, marcar resuelta, reprocesar. | Corrección insuficiente → la excepción reabre. | Caso emitido en reproceso. |
| CU-FAC-04 | Anular o emitir NC/ND | Operador de correcciones, contador | Comprobante emitido | §9.3. | No anulable → se propone NC; pagos → NC con imputación en M07. | Comprobante corregido sin borrado. |
| CU-FAC-05 | Refacturar un comprobante | Facturación | Comprobante revertible | §9.4. | Sin reversión previa → bloqueo `FAC_PERIOD_ALREADY_BILLED`. | NC + nueva factura relacionadas. |
| CU-FAC-06 | Emitir factura manual o replicada | Operador | Cuenta activa | §9.5. | Validaciones RN-FAC-045. | Comprobante individual emitido. |
| CU-FAC-07 | Distribuir comprobantes | Operador de distribución | Comprobantes autorizados | §9.7. | Rebote → papel. | Entregas registradas. |
| CU-FAC-08 | Cerrar ciclo con acta | Responsable, aprobador, contador | Lotes emitidos | Proponer, revisar cuadre, aprobar, descargar acta. | Cuadre no balancea → no se puede enviar; reapertura. | Acta inmutable. |
| CU-FAC-09 | Crear o desarmar grupo de facturación | Responsable, contador | Contratos del mismo titular | Crear grupo, validar fiscalmente, activar; desarmar desde un período. | CUIT distinto → `FAC_GROUP_TAXID_MISMATCH`. | Grupo versionado. |
| CU-FAC-10 | Recategorizar | Operador, aprobador | Consumos históricos | Simular, revisar, confirmar. | Sin cuadros ENARGAS completos → error. | Categorías actualizadas en M02. |
| CU-FAC-11 | Aplicar retroactivos | Operador, aprobador | Cuadro nuevo con vigencia pasada | Simular diferencias por período y contrato; aprobar; ítems facturables generados. | Signo del interés (PA-FAC-16). | Diferencias en el próximo lote. |
| CU-FAC-12 | Modificación masiva | Operador, aprobador | Comprobantes no cerrados | Filtrar, elegir campos, vista previa, aprobar. | Autorizados: solo datos no fiscales (PA-FAC-10). | Cambios auditados con antes/después. |
| CU-FAC-13 | Importar cargos de terceros | Operador | Archivo de formato soportado | Subir, mapear, validar, confirmar. | Filas con error no se aplican. | Ítems facturables o comprobantes. |
| CU-FAC-14 | Bloquear o desbloquear comprobantes | Operador | Comprobante con saldo | Elegir causa, bloquear; desbloquear. | Propagación al cierre (PA-FAC-15). | Historial de bloqueo. |
| CU-FAC-15 | Consultar y descargar mi factura | Socio | Usuario vinculado a la cuenta | Ver lista, detalle, descargar, pagar. | Consulta sin login (PRM-FAC-145). | Acceso a sus comprobantes. |
| CU-FAC-16 | Registrar entrega en reparto | Repartidor | Ruta asignada | Marcar entregado/devuelto (offline), sincronizar. | Conflicto de sincronización → gana el primer registro, el segundo queda observado. | Entregas actualizadas. |
| CU-FAC-17 | Configurar formato de código de barras | Administrador | — | Definir segmentos, DV, decodificador, vectores; publicar; asignar. | Vector falla → no publica. | Formato activo. |
| CU-FAC-18 | Generar talón sumado o de cuotas | Operador de distribución | Comprobantes con saldo | Elegir comprobantes, generar, imprimir. | Talón anterior vigente → `superseded`. | Documento de pago con códigos. |

## 17. Criterios de aceptación y escenarios

1. **ESC-02 (lote con excepciones):** dado `LOTE-AG-DEMO-001` con 100 casos, cuando se prefactura, entonces 98 quedan aptos y `ITEM-099` (Factura A sin CUIT) y `ITEM-100` (lectura inconsistente) quedan en la bandeja con responsable y próxima acción; al emitir, el lote queda `issuedWithPending` con 98 emitidos y el reporte de cuadre muestra 100 = 98 + 2.
2. **ESC-04 (cliente con varios servicios):** dado el titular del CU-103 con energía (ARS 28.000), internet (ARS 15.000) y tasa (ARS 1.200) en modalidad agrupada, cuando se emite, entonces hay un comprobante `RES-DEMO-001`-equivalente de ARS 44.200 con tres bloques y tres obligaciones; un pago de ARS 30.000 lo imputa M07 por obligación sin que FAC cambie el comprobante.
3. **ESC-04 separada:** con modalidad separada, el mismo titular recibe tres comprobantes y ningún renglón de un servicio aparece en el comprobante de otro.
4. **ESC-05 (cambio de universo):** dado un lote preparado (v1, 100 casos), cuando se agrega una cuenta y se excluye otra, entonces se congela v2, la diferencia muestra +1/−1 y solo esos dos casos se prefacturan.
5. **Doble facturación:** dado un contrato ya facturado para 10/2026 secuencia 0, cuando otro lote intenta emitirlo, entonces el índice único de `billedPeriods` lo impide y el caso queda en excepción `PERIOD_ALREADY_BILLED`; tras una NC con "permite refacturar", el período se libera.
6. **Reintento del job:** dado un bloque emitido cuyo worker cae antes de confirmar progreso, cuando el job se reintenta, entonces no se crean comprobantes duplicados (misma `idempotencyKey`) y la numeración no tiene huecos.
7. **Fallo sistémico:** dada la credencial ARCA inválida, cuando se emite, entonces el lote pasa a `paused` con motivo sistémico, no se abren excepciones por cliente, y al reanudar continúa desde el bloque siguiente.
8. **Incierto:** dado un comprobante sin respuesta de ARCA, cuando JOB-FAC-08 consulta el último autorizado y coincide, entonces queda `authorized` con su CAE; si no coincide, vuelve a `queued` con el mismo número.
9. **Permisos negativos:** un operador sin `fac.lotes.aprobar` recibe 403 al aprobar; el preparador del lote recibe 403 `FAC_SEGREGATION_OF_DUTIES` aunque tenga el permiso; un socio que pide `/api/fac/mis-comprobantes/{id}` de otra cuenta recibe 404.
10. **Aislamiento de tenant:** un usuario de TEN-002 no ve lotes, comprobantes, excepciones ni formatos de TEN-001; un job con `tenantId` de TEN-002 y un `runId` de TEN-001 falla sin efectos; los numeradores de ambos tenants son independientes aunque usen el mismo número de PV.
11. **Vencimientos:** un Vto2 que cae domingo o feriado de Córdoba se rechaza en el asistente con sugerencia del próximo hábil; Vto1 a Vto4 a 75 días con un intervalo de 61 días se rechaza.
12. **Recargos:** con trama de porcentaje fijo 3 % y total 13.000, Vto2 = 13.390 + IVA del interés según condición fiscal (calculado por M06); los cuatro importes impresos coinciden con los del código de barras.
13. **Anulación:** un comprobante autorizado no se puede anular (error `FAC_INVOICE_NOT_ANNULLABLE` con sugerencia de NC); uno interno sin pagos se anula y libera período y consumos.
14. **Conciliación:** la suma de `obligations` de cada comprobante es igual a su total; la suma de totales de comprobantes del lote coincide con `billingRuns.totals` y con lo informado a M17 en el cierre.
15. **Código de barras:** un formato con vectores de prueba que no pasan no se puede publicar; un importe que no entra en el ancho genera el formato alternativo o una excepción de impresión (PA-FAC-12), nunca un código truncado.
16. **Distribución:** con `PRM-FAC-076` activo, un comprobante `queued` no se envía ni se publica; al autorizarse se envía; un email rebotado genera entrega en papel.
17. **Cierre:** un acta con cuadre no balanceado no se puede enviar; una vez aprobada, los lotes quedan `closed`, y la reapertura genera versión 2 sin modificar la 1.
18. **Offline de reparto:** el repartidor registra 20 entregas sin conexión; al sincronizar se aplican una sola vez (por `clientMutationId`).
19. **Revisión previa de grandes usuarios (HUE-ELE-02):** con PRM-FAC-161 = `largeUser` y un lote ELE-C1 con 2 grandes usuarios ficticios, cuando se prefactura, entonces esos 2 casos quedan `reviewPending` en PAN-FAC-47 y el resto puede aprobarse y emitirse; uno aprobado por el revisor sigue a emisión y recibe CAE; el otro, devuelto, queda `blocked` con `PRE_REVIEW_RETURNED`; el preparador del lote no puede revisar (PRM-FAC-162).
20. **Cloaca después de agua (HUE-CLO-02):** en un lote AG + CLO de 50 cuentas, cuando se prepara, entonces CLO de cada cuenta se prefactura después de su AG; una cuenta cuyo AG está dado de baja queda `blocked` con `RELATED_SERVICE_MISSING` (de `TAR-E-RELATED-MISSING`) y las otras 49 se emiten.
21. **Clases de ítem (HUECO-OTR-04, HUECO-SEP-03, HUECO-CEM-04):** dado un socio con un depósito en garantía de ARS 50.000, un aporte al fondo de subsidio de ARS 1.500 y la cuota 3/24 de un derecho de sepultura (valores ficticios), cuando se emite, entonces el depósito sale en su bloque sin IVA ni percepciones, cada renglón lleva su `itemClass` y las obligaciones llegan a M07 con esa clase (RN-FAC-156).
22. **Entidad jurídica (DEC-064, DEC-087):** dado un titular con ELE de LE-01 e Internet de LE-02 en modalidad agrupada, cuando se emite, entonces hay dos comprobantes con numeradores de cada entidad (ambos pueden usar el PV 0001) y dos obligaciones que M07 registra en dos cuentas corrientes (RN-FAC-157).
23. **Cambio de régimen (HUE-AG-03):** dado un lote AG de 11/2026 preparado, cuando llega EVT-CAT-28 a `metered` con `effectiveAt` 16/11/2026, entonces el caso se reprefactura con cuota fija y consumo; si fuera a `unmetered` sin lectura de retiro, el caso queda `blocked` con `METERING_REGIME_READING_MISSING` (RN-FAC-158).
24. **Numeración de recibos por entidad (RF-FAC-179):** dado un cobro de ARS 13.000 (ficticio) con ARS 8.000 de LE-01 y ARS 5.000 de LE-02, cuando M07 pide dos números con `fac.service.nextNumber`, entonces recibe un número del numerador de LE-01 y otro del de LE-02, y reintentar con la misma `idempotencyKey` devuelve el mismo número.
25. **Tope de vencimientos (DEC-106):** dado PRM-FAC-163 con `byServiceId` = 6 para un servicio, un formato de código de barras con `dueDateCapacity` = 2 y un ente cuyo layout admite 3, cuando el administrador guarda el tope, entonces la validación lista ese formato y ese ente y exige confirmación auditada; al emitir, el comprobante tiene 6 vencimientos, el código de barras codifica los vencimientos 1 y 2, M07 publica al ente los vencimientos 1 a 3 y `invoices.dueDateCap.perAgency` lo registra (RN-FAC-163). Un comprobante agrupado con otro servicio de tope 4 usa tope efectivo 4.
26. **Rechazo de ARCA en un lote (DEC-107):** dado un lote con 100 comprobantes CAE numerados 1001 a 1100 en el PV 0002 y último autorizado 1000, cuando ARCA autoriza 1001 a 1040, rechaza 1041 por un dato del receptor y rechaza 1042 a 1060 solo por correlatividad, entonces 1041 queda `returnedToDraft` con su número liberado y excepción `FISCAL_REJECTED`; 1042 a 1100 quedan `requeued`; `lastAuthorizedNumber` = 1040; al reenviar la cola, los 59 comprobantes reciben 1041 a 1099 en su orden de emisión con `fac.invoice.renumbered`; al corregirse, el borrador recibe 1100; 1001 a 1040 no cambian; ninguno de los 60 tuvo PDF, envío ni publicación a entes antes del CAE; cada número asignado, liberado y reasignado figura en `numberAssignments` con su motivo y el control de correlatividad informa 0 huecos (RN-FAC-164).
27. **CAEA rechazado al informar (DEC-107):** dado un comprobante emitido y entregado en mostrador con CAEA vigente asignado, cuando el informe del CAEA lo rechaza, entonces queda `reportRejected` con su número, no se renumera ni vuelve a borrador, y la bandeja propone corregir y reinformar o emitir nota de crédito según la norma ([VERIFICAR] con el contador; RN-FAC-164 punto 9).
28. **Receptor regularizado (DEC-099):** dado un caso en `RECEIVER_DOCUMENT_PENDING` cuyo `holderIdentifierSnapshot.identificationStatus` era `documentPending`, cuando M01 publica EVT-PER-27, entonces la excepción se resuelve, el caso toma la foto nueva y se reprocesa (RN-FAC-162).

## 18. Precarga demo ficticia

Todos los datos son ficticios (nombres, CUIT con dígito verificador válido pero no asignado, domicilios inventados).

| Elemento | TEN-001 (cooperativa multiservicio) | TEN-002 (distribuidora de gas) |
|---|---|---|
| Ciclos | `AG-C1` agua (corte día 5), `AG-C2` agua (día 20), `ELE-C1` electricidad (día 10) | `GAS-C1` gas (día 15, bimestral) |
| Universos | `GRUPO-CENTRO`, `GRUPO-NORTE`, `CONTROL` (10 cuentas) | `GAS-TODOS` |
| Puntos de venta | 0002 electrónico CAE (lotes), 0003 electrónico (mostrador), 0000 interno | 0005 electrónico CAE |
| Tipos | Factura A/B, ND A/B, NC A/B, Liquidación de servicios públicos A/B y créditos, interno X | Factura A/B, NC A/B, ND A/B |
| Tramas | `TR-AG` 2 vencimientos, 3 % fijo; `TR-ELE` 3 vencimientos por rango de importe | `TR-GAS` 2 vencimientos, % diario |
| Grupo de facturación | `GF-DEMO-001`: titular ficticio con energía, internet y tasa (CU-103) | — |
| Lotes | `LOTE-AG-DEMO-001` (100 casos: 98 emitidos, `ITEM-099` sin CUIT, `ITEM-100` lectura), `LOTE-AG-DEMO-001-R1` reproceso | `LOTE-GAS-DEMO-001` simulación |
| Comprobantes | `FAC-DEMO-001` ARS 13.000, Vto1 15-11-2026; `FAC-AG-DEMO-002` ARS 13.000; `FAC-INT-DEMO-002` ARS 25.000; `RES-DEMO-001` ARS 38.000; comprobante agrupado CU-103 ARS 44.200 con pago demo de ARS 30.000 (en M07) | 5 facturas de gas |
| Excepciones | 2 abiertas (ESC-02), 1 resuelta | — |
| Formatos de código | `GENERICO_40_43`, `PAGOFACIL_DEMO`, `SIRO_56_DEMO` con vectores de prueba | `GENERICO_40_43` |
| Distribución | 60 % email, 25 % papel por 3 rutas, 15 % WhatsApp; 2 rebotes | 100 % email |
| Acta | Acta de AG-C1 10/2026 aprobada (v1) | — |

## 19. Migración

**Principios:** se migran comprobantes históricos como **solo lectura** (`origin = migration`, sin reemitir ni reautorizar), conservando número, CAE y relaciones; los saldos los reconstruye M07 (AGR-011); la configuración se migra a borradores que el tenant revisa y publica (AGR-018). Orden: tipos de comprobante y PV → numeradores (último número por tipo/PV verificado contra ARCA vía M06) → tramas, causas de bloqueo, gráficos, orden de renglones, correos → plantillas y universos → grupos (FAC-012) → comprobantes, renglones, relaciones, bloqueos → talones → marcas no facturar, cargos pendientes → períodos facturados.

| Origen ProCoop | Destino | Regla de transformación | Validación de conciliación |
|---|---|---|---|
| `COMPROB`, `TIP_COMP` | `voucherTypes` | Letra explícita; `COD_COM_ANU` → `reversalVoucherTypeId`; `RELACION` → `sharesNumberingWithId`. | Todos los tipos usados en `FACTURAS` existen. |
| `PTOVENTA` | `pointsOfSale` (de M06; CTR-DAT-17; lo migra M06 con `legalEntityId` desde `COD_EMP`) | "Equipo (PC)" → canal/terminal. | PV usados en comprobantes existen. |
| `COMPPOS` | `numberSequences` | Último número = máx(emitido migrado, ARCA). | Sin colisiones con el siguiente número. |
| `SITIVA` (comprobantes) | `voucherResolutionRules` | Una versión inicial. | Cobertura por condición y signo. |
| `TIPO_FAC`, `PARSERFA` | `billingTemplates` (borrador) + `invoiceClassCode` + calendario de `billingCycles` | Separar plantilla, clasificación y fechas. | Revisión del tenant antes de publicar. |
| `CONJUNTO` | `billingUniverses` (`set`) | — | Conteo igual. |
| `GRUPOS_FACTURA` | `billingGroups` | `fiscalValidation = pending`; un grupo con CUIT mixto queda en borrador con observación. | FAC-012: mismos miembros. |
| `TRAMASREC` | `dueDateSchemes` (espaciado) + `dueDateSurchargeSchemes` de M08 (recargo; CTR-DAT-37) | Modo y filas. | Simulación de 10 comprobantes coincide con lo impreso. |
| `FACTURAS` (+ `FACTURAS_EXTRAS`, `OB_FACT`, `CREDITOS_NOAUTOMATICOS`, `FAC_EXTRAS`) | `invoices` | `legacy.*` con ids; `SALDO` no se migra; cliente con domicilio histórico de la fecha. | Cantidad y suma de totales por mes, tipo y PV. |
| `ITEMSFAC`, `ITEMSFAC_EXTRAS` | `invoices.lines` | Agrupar por `ID_FAC`; bloque por servicio deducido del renglón. | Σ renglones = total por comprobante. |
| `ANUFAC`, `ANUITEMSFAC`, `ANUITEMSFAC_EXTRAS` | `invoices` con `commercialStatus = annulled` | Se migran como el comprobante original anulado (no como tabla espejo). | Cantidad de anulados por mes. |
| `RELACION_COMP`, `COMPROBANTES_ADM` | `invoiceRelations` | Tipo según marcas. | Toda NC migrada tiene origen o queda observada. |
| `CAUBLOQ`, `HISBLOQ` | ~~`invoiceBlockReasons`, `invoiceBlockHistory`~~ `holdReasons`, `documentHolds` (M08; CTR-DAT-36); los migra M08 | `ID_BLO` mezclado se separa por contexto (CTR-FAC-04). | Bloqueos vigentes iguales. |
| `TALONFAC`, `TALONFAC_HST` | `paymentSlips` | Historia como versiones. | Talones vigentes con sus comprobantes. |
| `FACTMES`, `FACTMES_COMP`, `FACTMES_CTAS`, `SFACTME` | `billingRuns` históricos (`closed`, solo consulta), `billingRunNumberRanges` | Sin casos detallados; contadores derivados. | Rangos coinciden con comprobantes. |
| `SUMNOFAC` | ~~`billingHolds`~~ `blocks` (M01; CTR-DAT-36) | — | — |
| `PRCAGAS` | `billableItems` (`pending`) | Solo no facturados. | Σ pendientes. |
| `FAC_EXTRAS_ITEMS` | `invoiceExternalData` | — | — |
| `GRUPOS_GRAFICO`, `ITEMSORD`, `POSTALES` | `consumptionChartGroups`, `invoiceLineOrders`, `postalCarriers` | — | — |
| `SERSOC.ULT_FAC`, `SEC_PER`, `CNT_FAC` | `billedPeriods` | Últimos 24 períodos por contrato. | Ningún período del último año queda sin marca. |
| Preferencias de email/adhesión | `deliveryPreferences` | Conservar canal; sin dato → papel (PA-FAC-20). | — |
| `PREPAGA`, `ANTICIPOS`, `ANTIFACTU`, `CLASIFICACION_ITEMS` | M03, M07, M13 (`itemClassifications`, CTR-DAT-44; antes ~~M06~~) | Fuera de FAC. | — |
| Plantillas DevExpress | `invoiceTemplates` (reglas de selección) + `documentTemplates`/`templateVersions` de T11 (diseño; CTR-DAT-41) | Rediseño (no conversión automática); comparación visual de 20 comprobantes por plantilla. | Aprobación del tenant. |

## 20. Contraposiciones

| CTR-ID | Fuente A | Fuente B | Resolución | Fundamento |
|---|---|---|---|---|
| CTR-FAC-01 | BASE §10 y §44: factura "por servicio" como regla | BASE §103: modalidad separada o agrupada con grupos de facturación | Prevalece §103: separada por defecto, agrupada opt-in con una obligación por servicio. | Prevalencia: §103 sobre secciones previas de BASE. |
| CTR-FAC-02 | ProCoop: eliminación física de comprobantes no autorizados (copia en `ANUFAC`) | Guía §5 y AGR-013: no se borran registros económicos | Anulación lógica (`annulled`) conservando el documento; autorizados solo por NC. | Guía y AGR prevalecen sobre RN. |
| CTR-FAC-03 | ProCoop: cuotas de ventas dentro de la factura del servicio sin restricción | MER-010: ventas en documento propio salvo vinculación fiscal validada | Default documento propio; inclusión solo por `PRM-FAC-068` y concepto vinculado. | BASE (MER) sobre RN. |
| CTR-FAC-04 | `ID_BLO` = −1 para pendiente de CAE mezclado con bloqueo de cobro | RN-02 §15.9 y BASE §97.2 | Estados separados: `fiscal.status` y `block`. | Diseño CoopApps. |
| CTR-FAC-05 | ProCoop: dos commits (facturas y numerador) | AGR-016: numeración atómica | Una transacción por bloque con `$inc` del numerador. | AGR sobre RN. |
| CTR-FAC-06 | Bloqueo global de la tabla `FACTMES` | Multi-tenant (DEC) | Lock por (tenant, ciclo/plantilla, período, secuencia). | DEC sobre RN. |
| CTR-FAC-07 | `SysAdmin` saltea CESP y LUA | Guía (auditoría, sin bypass) | Override con motivo, aprobación y auditoría; sin usuario privilegiado. | Guía. |
| CTR-FAC-08 | DFA: Azure Queue Storage y QuestPDF | DEC-001 (stack: BullMQ, PDF de la plataforma) | Jobs BullMQ y generador de PDF de la plataforma. | DEC sobre DFA. |
| CTR-FAC-09 | ProCoop: diálogos de confirmación (`MessageBox`) en la capa de negocio | Arquitectura API | Advertencias en la respuesta de la API y confirmación explícita del cliente. | Guía. |
| CTR-FAC-10 | Sigla V2 2264 y clases por cooperativa | Configuración declarativa por tenant | Parámetros y formatos declarativos; sin ramas por sigla. | RN-02 §15.19; DEC multi-tenant. |
| CTR-FAC-11 | ProCoop: modificación masiva de comprobantes electrónicos | RN-02 §15.16 y normativa fiscal | Autorizados: solo datos no fiscales (PA-FAC-10). | Normativa (AGR-013). |
| CTR-FAC-12 | BASE §97.3: recargos e intereses como parte de facturación | Alcance de M08 (mora) | Recargos entre vencimientos impresos en M05; intereses por mora facturados después, en M08. | Límites de módulos de la maestra. |
| CTR-FAC-13 | RN-02 §12.2 talones sumados | MER-019 cupón único | Unificados en `paymentSlips` (`summedSlip`, `installmentSlip`, ~~`singleCoupon`~~). El cupón único pasa a `paymentCoupons` de M07 (CTR-DAT-39 de T05); M05 conserva talones sumados y de cuota. | BASE (MER) prevalece; se conserva la funcionalidad. |
| CTR-FAC-14 | ProCoop: lote parcial sin estado; se recorre de nuevo confiando en `ULT_FAC` | AGR-015: reanudación y cuadre | Estados `paused/issuedWithPending`, progreso por bloque, `billedPeriods` único. | AGR sobre RN. |
| CTR-FAC-15 | ProCoop: importaciones dejan un número sin usar | Numeración sin huecos | Se reserva el número dentro de la misma transacción de emisión. | AGR-016. |
| CTR-FAC-16 | RN-02 §13 reguladores dentro de facturación | Maestra: reguladores en M06 | Se especifican en M06; M05 solo expone lectura de comprobantes. | Límites de módulos. |
| CTR-FAC-17 | ProCoop: tipo de comprobante por `TIPO_FAC.COD_COM` y preferencia | BASE §69/§97.2: resolución por condición fiscal | Matriz versionada por condición fiscal; la clasificación comercial solo restringe. | BASE sobre RN. |
| CTR-FAC-18 | RN-02 §15.18: ENACOM fuera del MVP | DEC-007: ENACOM incluido en M06 (O7) | Prevalece DEC-007; fuera del alcance de M05. | DEC sobre RN. |
| CTR-FAC-19 | `FACTURAS.SALDO` | AGR-011: saldos en M07 | No se guarda saldo en `invoices`; M07 lo calcula. | AGR. |
| CTR-FAC-20 | ProCoop: talones numerados en huecos de la tabla | Numeración correlativa | `paymentSlips.number` correlativo por tenant. | Diseño CoopApps. |
| CTR-FAC-21 | ProCoop (RN-02 §3.2): si algún servicio del comprobante liquida como servicio público, todo el comprobante es LQSP | DEC-093 (contraste `NucleoTransversal-Modelo`, aporte A1): en la factura agrupada de DEC-034 esa regla puede emitir internet o sepelio dentro de una LQSP | Un comprobante por clase (LQSP o factura común); en la LQSP solo los conceptos tarifarios del servicio público y los accesorios declarados en M06 (RN-FAC-040, RF-FAC-067; PA-FIS-23). | DEC sobre RN. |
| CTR-FAC-22 | ProCoop y RF-FAC-086: 4 vencimientos fijos | Documento externo `NucleoTransversal-Modelo` cap. 6.5: vencimientos sin tope | De 1 a 4 por defecto; tope por tenant, tipo de comprobante o servicio (PRM-FAC-163) validado contra formatos de código de barras y layouts de entes; ante los que admiten menos se publican los primeros N (RN-FAC-163). | DEC-106. |
| CTR-FAC-23 | DEC-035 y ProCoop: el comprobante rechazado por ARCA se reenvía con el mismo número | Documento externo `NucleoTransversal-Modelo` cap. 7.2: el comprobante no autorizado vuelve a borrador | Vuelve a borrador y libera su número; los posteriores sin CAE se renumeran desde el último autorizado; autorizados inmutables; nada se entrega antes de CAE, CAEA asignado o CESP; CAEA rechazado al informar no se renumera (RN-FAC-164). | DEC-107 (reemplaza DEC-035 en ese punto). |

## 21. Preguntas abiertas

### PA-FAC-01 — Modalidad por defecto para tenants nuevos
- **Pregunta:** ¿qué modalidad de facturación se configura por defecto al dar de alta un tenant?
- **Contexto:** BASE §103 admite separada y agrupada; las cooperativas migradas traen su práctica.
- **Opciones:** A) Separada por defecto, agrupada opt-in por grupo (Recomendada). B) Agrupada por titular por defecto. C) Obligar a elegir en el alta sin default.
- **Impacto:** onboarding, plantillas de impresión, M07.
- **Estado:** Respondida (DEC-034): separada por servicio por defecto; agrupada solo si se activa por grupo.
- **Bloquea:** RF-FAC-064, PRM-FAC-073.

### PA-FAC-02 — Periodicidad distinta dentro de un grupo
- **Pregunta:** si un servicio del grupo es bimestral y otro mensual, ¿cómo se emite?
- **Contexto:** FAC-010 de BASE §103.
- **Opciones:** A) El servicio con período vencido se incluye en el próximo comprobante del grupo (Recomendada). B) Se emite separado cuando no coincide. C) Prorratear a la periodicidad del grupo.
- **Impacto:** cálculo (M04), vencimientos.
- **Bloquea:** RF-FAC-072, PRM-FAC-074.

### PA-FAC-03 — Distribuir y publicar solo autorizados
- **Pregunta:** ¿se envían o publican comprobantes pendientes de autorización?
- **Contexto:** ProCoop desactivaba el registro automático si quedaban bloqueados por CAE.
- **Opciones:** A) Solo autorizados (Recomendada). B) Enviar con leyenda "pendiente de autorización". C) Configurable por canal.
- **Impacto:** plazos de entrega, M15.
- **Bloquea:** RF-FAC-063, PRM-FAC-076.

### PA-FAC-04 — Momento de asignación del número fiscal
- **Pregunta:** ¿el número se asigna al emitir o al autorizar?
- **Contexto:** ARCA exige correlatividad por tipo y PV; el orden de reparto requiere numeración en orden de ruta.
- **Opciones:** A) Numerar al emitir en orden del lote y autorizar en orden estricto por numerador; un rechazo bloquea el numerador hasta reenviar el mismo número corregido (Recomendada). B) Número interno provisorio y número fiscal al autorizar. C) Usar CAEA para masiva.
- **Impacto:** M06, impresión, conciliación.
- **Estado:** Respondida (DEC-035): opción A; número al emitir en orden del lote; ante rechazo se reenvía el mismo número. **Reemplazada en parte por DEC-107 (10-11-2026):** se mantiene la asignación al emitir en orden del lote; ante un rechazo de ARCA el comprobante vuelve a borrador y libera su número, los posteriores sin CAE vuelven a la cola y se renumeran desde el último autorizado, y los autorizados nunca cambian (RN-FAC-164). *Reemplazado (10-11-2026, DEC-107): "ante rechazo se reenvía el mismo número" y, en la opción A, "un rechazo bloquea el numerador hasta reenviar el mismo número corregido".*
- **Bloquea:** RF-FAC-048 a 052, §8.6.

### PA-FAC-05 — Total negativo
- **Pregunta:** ¿qué se hace cuando el total de un caso es negativo?
- **Contexto:** ProCoop invierte signos y emite NC; con GD agrega crédito a futuro.
- **Opciones:** A) Política por servicio, default NC; GD con crédito a futuro (Recomendada). B) Siempre NC. C) Siempre saldo a favor en M07.
- **Impacto:** M06, M07.
- **Estado:** Respondida (DEC-036): política por servicio, por defecto NC; generación distribuida como crédito a futuro (coherente con DEC-060 y RF-MED-097).
- **Bloquea:** RF-FAC-030, RN-FAC-039, PRM-FAC-063.

### PA-FAC-06 — Factura en cero por consumo
- **Pregunta:** ¿se emite un comprobante en cero cuando hay consumo pero importe nulo?
- **Opciones:** A) No emitir; registrar "sin cargo" en el lote; configurable por servicio (Recomendada). B) Emitir siempre. C) No emitir nunca.
- **Impacto:** ARCA, reportes regulatorios.
- **Estado:** Respondida (DEC-037): no emitir; registrar "sin cargo", configurable por servicio.
- **Bloquea:** RF-FAC-029, PRM-FAC-032.

### PA-FAC-07 — Varios suministros del mismo servicio
- **Pregunta:** un titular con dos medidores de agua, ¿una o dos facturas?
- **Opciones:** A) Una por contrato/suministro en separada; agrupar solo vía grupo (Recomendada). B) Una por cuenta. C) Configurable por servicio.
- **Impacto:** M02, impresión.
- **Bloquea:** RF-FAC-075, PRM-FAC-075.

### PA-FAC-08 — Formatos de código de barras a precargar
- **Pregunta:** ¿qué formatos se priorizan en O4?
- **Contexto:** ProCoop tiene ~100 (RN-02 §16.7).
- **Opciones:** A) Los de la cooperativa piloto + los genéricos de RF-FAC-142 (Recomendada). B) Todos. C) Solo genéricos.
- **Impacto:** esfuerzo de O4, migración.
- **Bloquea:** RF-FAC-142.

### PA-FAC-09 — Conservar prefijos 40/41/42/43
- **Pregunta:** ¿se mantienen los prefijos de documento de ProCoop?
- **Opciones:** A) Sí, para leer lo ya impreso (Recomendada). B) Nuevos prefijos con decodificador heredado temporal.
- **Impacto:** recaudadores, M07.
- **Bloquea:** RF-FAC-143.

### PA-FAC-10 — Modificación masiva de autorizados
- **Opciones:** A) Solo datos no fiscales (vencimientos 2–4, recargos, observaciones, mensajes) (Recomendada). B) Prohibir toda modificación. C) Igual que ProCoop.
- **Contexto:** RN-02 §15.16.
- **Pregunta:** ¿qué se puede modificar masivamente en comprobantes autorizados?
- **Impacto:** cumplimiento fiscal.
- **Bloquea:** RF-FAC-113.

### PA-FAC-11 — Muestra de control obligatoria
- **Pregunta:** ¿la muestra revisada es obligatoria para aprobar lotes grandes?
- **Opciones:** A) Sí, a partir de `PRM-FAC-034` casos (Recomendada). B) Siempre opcional. C) Siempre obligatoria.
- **Impacto:** tiempos de ciclo.
- **Bloquea:** RF-FAC-046.

### PA-FAC-12 — Desborde de ancho de importe en el código
- **Pregunta:** ¿qué pasa si el importe no entra en el ancho del formato (ej. Banco de Córdoba 43, 6 dígitos)?
- **Opciones:** A) Formato alternativo automático configurado (Recomendada). B) Excepción de impresión sin código. C) Truncar (como ProCoop).
- **Impacto:** recaudación.
- **Bloquea:** RF-FAC-144.

### PA-FAC-13 — Franqueo
- **Pregunta:** ¿se ofrece el cargo por franqueo?
- **Opciones:** A) Habilitable por tenant con validación de adhesión digital (Recomendada). B) Descartar.
- **Impacto:** M02 (concepto), distribución.
- **Bloquea:** RF-FAC-161, PAN-FAC-34, PRM-FAC-138.

### PA-FAC-14 — Facturación in situ
- **Pregunta:** ¿en qué ola y con qué modelo se emite en campo?
- **Opciones:** A) O7 con reserva de rango por dispositivo (Recomendada). B) O7 como internos que se autorizan al sincronizar. C) Fuera de alcance.
- **Impacto:** M03, M06, PWA offline.
- **Bloquea:** RF-FAC-170, §9.8.

### PA-FAC-15 — Propagación de bloqueos al cierre
- **Opciones:** A) Configurable, default desactivado (Recomendada). B) Replicar siempre (V2 2769). C) Descartar.
- **Pregunta:** ¿se propagan causas de bloqueo a los comprobantes nuevos?
- **Impacto:** cobranza.
- **Bloquea:** RF-FAC-096, RN-FAC-142, PRM-FAC-023.

### PA-FAC-16 — Signo del interés en retroactivos
- **Pregunta:** ProCoop calcula el interés con signo negativo (RN-02 §16.1); ¿los retroactivos son siempre devoluciones?
- **Opciones:** A) Signo explícito según la diferencia (cargo o devolución) (Recomendada). B) Replicar signo negativo.
- **Impacto:** importes facturados.
- **Bloquea:** RF-FAC-111, CU-FAC-11.

### PA-FAC-17 — Comprobantes de administración pública
- **Pregunta:** ¿qué hace exactamente `frmComprobnatesAdministracionPublicaRAW` / `COMPROBANTES_ADM`? [VERIFICAR]
- **Opciones:** A) Relevar con la cooperativa piloto; mientras tanto, modelar como relación `administrative` y reporte (Recomendada). B) Descartar.
- **Impacto:** organismos públicos clientes.
- **Bloquea:** RF-FAC-133, PAN-FAC-38.

### PA-FAC-18 — SLA por defecto de excepciones
- **Pregunta:** ¿qué responsables y plazos de corrección se precargan? (BASE §71)
- **Opciones:** A) Por categoría: datos fiscales 48 h (corrector), lecturas 24 h (supervisor de consumos), configuración 24 h (responsable) (Recomendada). B) Sin SLA. C) Definido por cada tenant desde cero.
- **Impacto:** tablero, alertas.
- **Bloquea:** `billingExceptionReasons.slaHours`.

### PA-FAC-19 — Contingencia ante caída fiscal
- **Pregunta:** ¿qué hace el lote si ARCA no responde por horas? (BASE §71)
- **Opciones:** A) Emitir y dejar en cola; pausar solo la fase de autorización; CAEA si el tenant lo tiene habilitado (Recomendada). B) Pausar la emisión. C) Siempre CAEA.
- **Impacto:** M06, distribución.
- **Estado:** Respondida (DEC-038): emitir y encolar; pausar solo la autorización; CAEA si está habilitado. En mostrador rige DEC-018 (espera del CAE con tiempo máximo; luego CAEA o comprobante pendiente no entregable como fiscal).
- **Bloquea:** §13, §8.6.

### PA-FAC-20 — Preferencia de entrega de migrados
- **Pregunta:** ¿qué canal tienen los titulares migrados?
- **Opciones:** A) Conservar el de ProCoop; sin dato, papel (Recomendada). B) Email si existe correo. C) Pedir confirmación a todos.
- **Impacto:** costos de impresión, consentimiento.
- **Bloquea:** §19.

### PA-FAC-21 - Destino de `invoices.sellerId` y valores de estado propuestos
- **Pregunta:** ¿a qué colección apunta `invoices.sellerId` y se aceptan los valores de estado propuestos en el §8 marcados `[VERIFICAR]`?
- **Contexto:** al completar las tablas del §7 y los estados del §8 (05-11-2026) el destino y algunos valores no se pudieron deducir de T05 ni del anexo.
- **Opciones:**
  - A) **(Recomendada)** `sellerId` → vendedores o usuarios de T02 según el canal de venta (M11); aceptar los valores propuestos.
  - B) Quitar el campo si ningún RF ni RN lo usa.
- **Impacto si no se responde:** queda `[VERIFICAR]` y sin validación de integridad.
- **Bloquea:** T05 §7.2.
- **Estado:** Asumida (DEC-072): opción A. `invoices.sellerId` → vendedor como usuario del tenant (`memberships` de T02) según el canal de venta de M11; se aceptan los valores de estado propuestos del §8. Aplicado en §7 y §8. T05 debe agregar la referencia.

### PA-FAC-22 - Destino de `adjustmentRequestIds` de M04 (cierre, segunda ronda)
- **Pregunta:** ¿a qué colección apuntan los pedidos de ajuste (NC/ND) que M04 genera desde `retroactiveDiffRuns.adjustmentRequestIds`?
- **Contexto:** PA-TAR-20 de M04 los mandó a «pedidos de ajuste de M05», pero M05 no tenía una colección con ese nombre. `invoiceAnnulmentRequests` ya cubre anulaciones, reversiones, créditos parciales y ajustes por débito (`mode` = `annul`, `reverse`, `partialCredit`, `debitAdjustment`), con aprobación y resultado.
- **Opciones:**
  - A) **(Recomendada)** `adjustmentRequestIds` → `invoiceAnnulmentRequests` (COL-FAC-17), con `mode` `partialCredit` o `debitAdjustment`.
  - B) Colección nueva de pedidos de ajuste.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** T05 §7.2; M04 `retroactiveDiffRuns`.
- **Estado:** Asumida (DEC-072): opción A. No se declara colección nueva; aplicado en la ficha de `invoiceAnnulmentRequests` (§7) y en M04.

### PA-FAC-23 — Residuales de estados, referencias y API reemplazada (ronda del 05-11-2026)
- **Pregunta:** ¿Se confirman los estados de alta y las transiciones agregadas en §8.13, los destinos y la obligatoriedad de las referencias marcadas y la API destino de API-FAC-023?
- **Contexto:** al regenerar los entregables, 06a §7 marcó 11 máquinas de M05 sin estado inicial, 6 colecciones con `status` sin valores legibles (escritos en un solo bloque), `paymentSlips` sin transiciones y `billableItems` con valores de §8.12 no declarados; 03-er marcó referencias sin destino; API-FAC-023 decía «Reemplazado» sin API destino.
- **Opciones:**
  - A) **(Recomendada)** Escribir los valores de §7 uno por uno; declarar en §8.13 los estados de alta y las transiciones; `ownerRole` → `roles` y `assigneeId` → `memberships` (T02); `serviceBlockId` obligatorio y `affectedServiceBlockIds` opcional (vacío = todos); los números de versión no son referencias; API-FAC-023 reemplazada por API-MOR-25.
  - B) Mantener API-FAC-023 como fachada de M08 con capability propia.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** 06 (estados), 03 (ER), 05 (contratos de API), T02 (capability `fac.bloqueosCausas.configurar`).
- **Estado:** Asumida (DEC-072): opción A. Aplicado en §7, §8.7, §8.13 y §11. T02 debe marcar `fac.bloqueosCausas.configurar` como reemplazada por `mor.causas.configurar` (API-MOR-25).
- **Sincronización (5-11-2026), Asumida (DEC-072):** `billingRunItems` y `invoices.customer` usan `associateMembershipId` (antes `memberId`) → `associateMemberships` (M17), nombre canónico de T05 §7.2.1 (PA-DAT-04).
- **Residual (5-11-2026), Asumida (DEC-072):** PAN-FAC-17 y el rol Administrador del tenant (§4) citan `mor.causas.configurar` (antes `fac.bloqueosCausas.configurar`), la misma capability de API-MOR-25 que usa la pantalla.

## 22. Trazabilidad

### 22.1 BASE, AGR y escenarios

| Fuente | Destino en M05 | Estado |
|---|---|---|
| BASE §2 (facturación por servicio, precisión 0.17) | RF-FAC-064 a 076, RN-FAC-133 a 136, CTR-FAC-01 | Adoptado (con §103) |
| BASE §10 (liquidación y facturación, CU-10) | §5.2 a §5.6, CU-10, §9.1 | Adoptado |
| BASE §37 | §5.19, §9.7 | Adoptado |
| BASE §40 (ejemplo integrado, paso 6) | CU-40 paso 6, §18 | Adoptado |
| BASE §44 (FAC-001 a FAC-004, CU-FAC-01, 44.8) | §5.6, §5.12, CU-FAC-01, CTR-FAC-01 | Adoptado |
| BASE §57 | §5.20, §15 | Adoptado |
| BASE §69 (LOT-001 a LOT-004, CU-LOT-01, bandeja) | §5.1 a §5.5, §7.2, PAN-FAC-08, CU-LOT-01 | Adoptado |
| BASE §70 (precisiones normativas) | §5.7, §5.9, CTR-FAC-17 | Adoptado |
| BASE §71 (pendientes) | PA-FAC-18, PA-FAC-19, RF-FAC-001 | A validar |
| BASE §97.2 (emisión) | §5.7, §5.9, §8.6, CTR-FAC-04 | Adoptado |
| BASE §97.3 | §5.10, §6.3, CTR-FAC-12 | Adoptado (recargos entre vencimientos) |
| BASE §97.4 (exhibición) | §5.16 | Adoptado |
| BASE §97.10 (Grupo Factura) | §5.8, `billingGroups` | Adoptado |
| BASE §98 | §5.16, `invoiceDocuments` | Adoptado |
| BASE §101 | §5.19, PAN-FAC-43 a 45 | Adoptado |
| BASE §103 (FAC-005 a FAC-012, CU-103, 103.6) | §5.8, §6.9, CU-103, CU-FAC-09, PA-FAC-01, 02, 07 | Adoptado |
| BASE §106 | §5.20 | Adoptado |
| MER-002 (tipo LSP) | `voucherTypes.isPublicService` | Informado (referencia) |
| MER-008 (impresión y reparto) | §5.19, PAN-FAC-31, 33, 46 | Adoptado |
| MER-010 (cuotas en documento propio) | RN-FAC-111, PRM-FAC-068, CTR-FAC-03 | Adoptado |
| MER-016 (WhatsApp) | RF de §5.19, PRM-FAC-137 | Adoptado |
| MER-018 | §5.19 | Adoptado |
| MER-019 (cupón único, gráfico) | §5.18, `paymentSlips`, `consumptionChartGroups`, CTR-FAC-13 | Adoptado |
| AGR-009 | §5.1 | Adoptado |
| AGR-010 (vigencias, fecha de registro) | `billingUniverses.recordedAt`, §7 | Adoptado |
| AGR-011 (saldos y precisión) | CTR-FAC-19, RN-FAC-068 | Adoptado |
| AGR-013 (no borrado) | CTR-FAC-02, §8.5 | Adoptado |
| AGR-015 (lote parcial, cuadre) | §8.2, §9.6, CTR-FAC-14, §17.1 | Adoptado |
| AGR-016 (numeración) | CTR-FAC-05, CTR-FAC-15 | Adoptado |
| AGR-017 | RF-FAC-001 | Adoptado |
| AGR-018 (migración) | §19 | Adoptado |
| ESC-02 | §9.2, §17.1, §18 | Adoptado |
| ESC-04 | §17.2, §17.3, CU-103 | Adoptado |
| ESC-05 | §8.2, §17.4 | Adoptado |
| DEC-012, DEC-016, DEC-027, DEC-033, DEC-071 | RN-FAC-159 | Adoptado |
| DEC-018, DEC-038 (caída de ARCA en mostrador y en masiva) | PA-FAC-19 (Respondida) | Adoptado |
| DEC-019, DEC-061 (capital social en la factura) | RF-FAC-056 | Adoptado |
| DEC-034 (modalidad por defecto) | RF-FAC-064; PA-FAC-01 (Respondida) | Adoptado |
| DEC-035 (número fiscal al emitir) | RF-FAC-048; PA-FAC-04 (Respondida) | Adoptado en la asignación al emitir en orden del lote; **Reemplazado por DEC-107** en el comprobante rechazado |
| DEC-106 (tope de vencimientos) | RF-FAC-086; RF-FAC-112, 113, 126, 140, 149; RN-FAC-013, 015, 059, 061, 067, 068, 089, 120, 163; PRM-FAC-163; `invoices.dueDates`/`dueDateCap`, `billingCycles.calendar`, `billingTemplates.dueDateRules`, `billingRuns.dueDates`, `dueDateSchemes.dueCount`, `barcodeFormats.dueDateCapacity`, `paymentSlips.dueDates`; escenario 25; CTR-FAC-22 | Adoptado |
| DEC-107 (comprobante rechazado por ARCA; reemplaza DEC-035 en ese punto) | RF-FAC-048, 061, 062, 063, 081, 084, 170; RN-FAC-164; `invoices.number`, `numberAssignments`, `issueAttempt`, `emissionSeq`, `commercialStatus`; `numberSequences.lastAuthorizedNumber`; `billingRunNumberRanges.releases`; §8.3, §8.5, §8.6; §9 pasos 8 y 9; EVT-FAC-07, 22, 23; escenarios 26 y 27; PA-FAC-04; CTR-FAC-23. Ronda de cierre (10-11-2026, con M07 RN-COB-158): RN-FAC-165 (vencimientos corridos por autorización tardía), PRM-FAC-164, `invoices.lateAuthorizationGraceDays` y `lateAuthorizationShift`, `dueDateSchemes.lateAuthorizationGraceDays`, EVT-FAC-07 y EVT-FAC-13 (`reason`), §12.2 `fis.invoice.authorized` | Adoptado |
| Alineación de `numberSequences.authorizationType` con `none` (10-11-2026) y DEC-099 con M01 (`holderIdentifierSnapshot.identificationStatus`, EVT-PER-27) | `numberSequences.authorizationType`; RF-FAC-081; RN-FAC-162; §12.2; escenario 28 | Adoptado |
| DEC-036, DEC-060 (total negativo; generación distribuida) | RF-FAC-030; PA-FAC-05 (Respondida) | Adoptado |
| DEC-037 (factura en cero) | RF-FAC-029; PA-FAC-06 (Respondida) | Adoptado |
| DEC-050 (identificador de pago), DEC-065 (SaaS bajo `PLATFORM`) | RN-FAC-160 | Adoptado |
| DEC-064, DEC-087 (entidad jurídica; recibo y cuenta corriente por entidad) | RF-FAC-177; RF-FAC-179; RN-FAC-157; RN-FAC-161; `invoices.legalEntityId` (desde contrato o `tenantServices.legalEntityId`), `invoiceDrafts`, `numberSequences` (también recibos de M07), `paymentSlips`; escenarios 22 y 24; RF-CFG-136/138 de T04 | Adoptado |
| HUECO-OTR-04, HUECO-SEP-03, HUECO-CEM-04 (clases de ítem; RN-CON-122/123/124, RF-FIS-162) | RF-FAC-176; RN-FAC-156; `billableItems.itemClass`; escenario 21 | Adoptado |
| HUE-AG-03 (EVT-CAT-28) | RF-FAC-178; RN-FAC-158; §12.2; escenario 23 | Adoptado |
| DEC-093 (factura agrupada sin mezclar LQSP y factura común; PA-FIS-23) | RF-FAC-028, RF-FAC-067; RN-FAC-036, RN-FAC-040 (texto anterior conservado); CTR-FAC-21; `conceptFiscalCases.publicServiceAccessory` de M06; marca `tenantServices.profile.billing.publicServiceSettlement` de M02 (RF-CAT-117) leída en RN-FAC-040 punto 1 | Adoptado (lista de accesorios pendiente del contador) |
| DEC-094 (LQSP autorizada con CESP; PA-FIS-24) | RF-FAC-081 y `numberSequences.authorizationType` con `CESP`; RN-FAC-162 (4) | Adoptado |
| DEC-099 (persona sin documento, `documentPending`) | RF-FAC-032; RN-FAC-162; motivo `RECEIVER_DOCUMENT_PENDING` en `billingExceptionReasons` | Adoptado |
| DEC-104 puntos 7 y 8 (inconsistencias internas) | `numberSequences.authorizationType` admite `CESP`; `numberSequences.billingGroupId` opcional (`null` = numeración general); RF-FAC-081 | Adoptado |
| T05 §20 (CTR-DAT-16, 17, 30, 31, 32, 36, 37, 38, 39, 41, 44, 74) | §7.3 `billableItems` absorbe `preloadedCharges` de M04 (CTR-DAT-38); `numberSequences` para recibos de M07 (CTR-DAT-74); PAN-FAC-47 ruta `/admin/fac/`;  §7.1 `billingHolds`; §7.2 y §7.3 períodos, `legacy`, `workflowInstanceId`, `warehouseId`, `accountId`, `storedFileId`; §7.4 `pointsOfSale`, `numberSequences`; §7.5 `dueDateSchemes`; §7.7 `invoiceTemplates`, `paymentSlips`; §7.10 y §19 mapeos | Adoptado |

### 22.2 DFA, REL, FIC, RN-11, CNX

| Fuente | Destino | Estado |
|---|---|---|
| DFA Módulo 8 (líneas 440–524) | §5 completo, §10 | Adoptado; tecnología por CTR-FAC-08 |
| DFA circuito 1176–1185 | §9.1 | Adoptado |
| REL §1 (alerta pendientes de autorizar) | RF-FAC-017, JOB-FAC-16, PAN-FAC-01 | Adoptado |
| REL §2 (Grupo Factura y flags del servicio) | §5.8, PRM-FAC-078 | Adoptado |
| REL §4 (Administración de Comprobantes y detalle) | PAN-FAC-09, PAN-FAC-10 | Adoptado |
| REL §5 (tablas de facturación) | §7.10 | Adoptado |
| FIC 4.3 | §5.7, §13 | Adoptado |
| RN-11 §2 (códigos SIRO/Roela) | RN-FAC-129, PRM-FAC-113 | Adoptado |
| RN-11 §3–§4 (lectura y búsqueda) | RN-FAC-125, API-FAC-157 | Adoptado; búsqueda por cuenta + importe como modo heredado |
| CNX §4.2 a §4.6 | §12, §13 | Adoptado |
| CNX §6.2 | §11.7 | Adoptado |

### 22.3 RN-02 (facturación masiva y comprobantes)

| Sección RN-02 | Destino | Estado |
|---|---|---|
| §1 Conceptos | §3 Glosario | Adoptado |
| §2.1 Configuración (tipo de factura como plantilla) | RF-FAC-009 a 012, RN-FAC-001 a 007, `billingTemplates` | Adoptado (separada plantilla/clasificación) |
| §2.2 Validaciones previas | RF-FAC-016, 017, RN-FAC-008 a 019 | Adoptado; bypass reemplazado (CTR-FAC-07) |
| §2.3 Selección de cuentas | RF-FAC-013 a 024, RN-FAC-020 a 030 | Adoptado |
| §2.4 Simulación | RF-FAC-025 a 034, RN-FAC-031 | Adoptado; criterio 3109 descartado |
| §2.5 Generación | RF-FAC-047 a 056, RN-FAC-032 a 057 | Adoptado |
| §2.6 Armado de comprobantes | RN-FAC-034 a 044 | Adoptado |
| §2.7 Persistencia y transacciones | RN-FAC-056, CTR-FAC-05, CTR-FAC-14 | Reemplazado por bloques transaccionales |
| §2.8 Hilos y avance | RF-FAC-047, JOB-FAC-03 | Reemplazado por jobs BullMQ |
| §2.9 Log y cierre | RF-FAC-056, RN-FAC-141 a 143, §5.20 | Adoptado |
| §3.1 a §3.3 Tipos, resolución, validaciones | §5.9, RN-FAC-043 a 047, `voucherTypes` | Adoptado |
| §4.1 a §4.4 Numeración, PV, autorización | §5.6, §5.9, RN-FAC-047 a 055, PA-FAC-04 | Adoptado |
| §5.1, §5.2 Vencimientos | §5.10, RN-FAC-058 a 069 | Adoptado |
| §6 Bloqueo | §5.11, RN-FAC-070 a 073, §8.7 | Adoptado |
| §7.1 a §7.5 Anulación, NC, relación | §5.12, RN-FAC-074 a 094, §9.3 | Adoptado; borrado reemplazado (CTR-FAC-02) |
| §8 Recategorización | RF-FAC-108 a 110, RN-FAC-095 a 100 | Adoptado |
| §9 Retroactivos | RF-FAC-111, 112, RN-FAC-101 a 105, PA-FAC-16 | Adoptado |
| §10.1 Modificación de facturas | RF-FAC-113 a 115, RN-FAC-106 a 110, PA-FAC-10 | Adoptado con límite fiscal |
| §10.2 Modificación de cuotas | M11 | Fuera de M05 |
| §11.1 Cuotas dentro de la masiva | RN-FAC-111, CTR-FAC-03 | Adoptado con MER-010 |
| §11.2 Importaciones de terceros | RF-FAC-121 a 123, RN-FAC-112 a 115, `billingImports` | Adoptado |
| §11.3 Servicios de terceros | RF-FAC-124, PAN-FAC-37 (CVLP, O10) | Adoptado |
| §11.4 Datos extra de terceros | `invoiceExternalData` | Adoptado |
| §12.1 Selección del reporte | RN-FAC-116, `invoiceTemplates.selectionRules` | Reemplazado por reglas explícitas |
| §12.2 Talones | §5.18, `paymentSlips`, CTR-FAC-13 | Adoptado |
| §12.3 Código de barras: arquitectura | RF-FAC-140 a 148, RN-FAC-123 a 125 | Adoptado declarativo |
| §12.4, §12.4.1 Formatos genéricos | RF-FAC-142, PA-FAC-08, PA-FAC-12 | A validar |
| §12.5 Variación por cooperativa | CTR-FAC-10 | Reemplazado por formatos del tenant |
| §12.6 Pagos360 | RN-FAC-130, PRM-FAC-114 a 121 | Adoptado |
| §13.1 ENARGAS, §13.2 ENACOM, §13.3, §13.3.1 Archivos | M06 (CTR-FAC-16, CTR-FAC-18) | Fuera de M05 |
| §14 Parámetros `Busca_V2_*` | §14 | Adoptado; los de cálculo, fiscales y de mora a M04/M06/M08 |
| §15.1 a §15.19 Implicancias | §15.1 → `billingTemplates`; §15.2 → §8.2; §15.3 → `billedPeriods`; §15.4 → CTR-FAC-05, 06; §15.5 → JOB-FAC-03; §15.6 → RF-FAC-025 a 034; §15.7 → API-FAC-014; §15.8 → PA-FAC-05; §15.9 → CTR-FAC-04; §15.10 → §8.5; §15.11 → §5.10; §15.12 → RF-FAC-140 a 148, PA-FAC-09; §15.13 → RN-FAC-116; §15.14 → `paymentSlips`; §15.15 → §5.13; §15.16 → PA-FAC-10; §15.17 → `billingImports`; §15.18 → CTR-FAC-18; §15.19 → §14 | Adoptado |
| §16.1 Posibles errores de ProCoop | Retroactivos → PA-FAC-16; número sin usar → CTR-FAC-15; tramas 3 y 4 → RN-FAC-064 (cálculo sobre el vencimiento anterior en modo compuesto, configurable); Banco de Córdoba 43 → PA-FAC-12; desbloqueo lateral al listar → Descartado (reportes sin efectos); SQL concatenado → Descartado; `float` → Decimal128; demora negativa → métricas de JOB-FAC-03; resto (ventas, fletes, ENARGAS, Credicoop, IVA de cuotas) → M11, M18, M06, M07 | Reemplazado o derivado |
| §16.2 Corridas parciales | §9.6, CTR-FAC-14 | Resuelto |
| §16.3 Fechas dinámicas | `billingCycles.calendar` (expresiones tipadas) | Reemplazado |
| §16.4 Variables obligatorias | PRM-FAC-060 | Adoptado |
| §16.5 Secuencia | `period.sequence` en `billedPeriods`; refacturación solo con período liberado | Adoptado |
| §16.6 Grupos de factura | §5.8, PA-FAC-01 | A validar con piloto |
| §16.7 Formatos en uso | PA-FAC-08 | A validar |
| §16.8 ENARGAS | M06 | Fuera de M05 |
| §16.9 Cuentas de control | `billingRuns.target = controlAccounts` con universo `CONTROL` | Adoptado |
| §16.10 Estados Pagos360 | M07 | Fuera de M05 |

### 22.4 CAT §4 (36 tablas)

Las 36 tablas (`ANTICIPOS`, `ANTIFACTU`, `ANUFAC`, `ANUITEMSFAC`, `ANUITEMSFAC_EXTRAS`, `CAUBLOQ`, `CLASIFICACION_ITEMS`, `COMPROB`, `COMPROBANTES_ADM`, `CONJUNTO`, `CREDITOS_NOAUTOMATICOS`, `FACTMES`, `FACTMES_COMP`, `FACTMES_CTAS`, `FACTURAS`, `FACTURAS_EXTRAS`, `FAC_EXTRAS`, `FAC_EXTRAS_ITEMS`, `GRUPOS_FACTURA`, `GRUPOS_GRAFICO`, `HISBLOQ`, `ITEMSFAC`, `ITEMSFAC_EXTRAS`, `ITEMSORD`, `OB_FACT`, `PARSERFA`, `POSTALES`, `PREPAGA`, `RELACION_COMP`, `SFACTME`, `SUMNOFAC`, `TALONFAC`, `TALONFAC_HST`, `TIPO_FAC`, `TIP_COMP`) están mapeadas una por una en §7.10 y su migración en §19. `ANTICIPOS`, `ANTIFACTU` → M07; `CLASIFICACION_ITEMS` → ~~M06~~ M13 (`itemClassifications`, CTR-DAT-44); `PREPAGA` → M03/M07; el resto, colecciones de M05.

### 22.5 Inventario `ProMod_Facturacion` (82 formularios y auxiliares)

| Formularios | Destino | Estado |
|---|---|---|
| `frmFacturacionMensual`, `frmFacturacionMensual_Resultado`, `frmConsultaGeneracionFacturas`, `frmProgressImpresion` | PAN-FAC-05, 06, 07 | Reemplazado |
| `abm_Tipo_Fac` | PAN-FAC-04 | Reemplazado |
| `frmComprobantesFactura`, `_Servicio`, `_Cuota`, `_Impuesto`, `_Anticipo`, `frmAnticipoProducto`, `frmSeleccionarObra` | PAN-FAC-11 | Reemplazado |
| `frmComprobantesFactura_Replicar` | PAN-FAC-12 | Reemplazado |
| `frmAnulacionFacturas`, `frmCreditosXComprobantes` | PAN-FAC-14 | Reemplazado |
| `frmComprobantesRelaciones` | PAN-FAC-15 | Reemplazado |
| `frmDesbloquearComprobanteCuenta` | PAN-FAC-16 | Reemplazado |
| `abm_Caubloq` | PAN-FAC-17 | Reemplazado |
| `frmModificaFactura`, `frmCambiarTipoFac` | PAN-FAC-18 | Reemplazado |
| `frmRecategorizacion`, `frmCorregirConsumoGas` | PAN-FAC-19 | Reemplazado |
| `frmRetroactivos` | PAN-FAC-20 | Reemplazado |
| `abm_Prcagas` | PAN-FAC-21 | Reemplazado |
| `abm_GruposFactura` | PAN-FAC-25 | Reemplazado |
| `abm_TramasRec` | PAN-FAC-27 | Reemplazado |
| `abm_GruposGrafico` | PAN-FAC-29 | Reemplazado |
| `frmFacturasImpresion`, `frmImpresiones`, `frmFacturasImpresion_Cuotas`, `clsFacturasImpresion_Mejorado`, `ParametrosImpresionMejorados`, `MostrarPlantillaEventArgs`, `MostrarPreviewEventArgs`, `SeleccionarImpresoraEventArgs` | PAN-FAC-28, 31 | Reemplazado |
| `frmTalonesSumados`, `frmTalonesSumados_InfoPagos` | PAN-FAC-32 | Reemplazado |
| `frmFranqueoSegunFacturas` | PAN-FAC-34 (PA-FAC-13) | A validar |
| `frmDiferenciaConceptos`, `frmDiferenciasCuentas`, `frmMovimientoConcepto`, `frmMovimientoConcepto_Export` | PAN-FAC-36 | Reemplazado |
| `frmCVLP`, `frmCVLP_Finalizar` | PAN-FAC-37 (O10) | Reemplazado |
| `frmComprobnatesAdministracionPublicaRAW` | PAN-FAC-38 (PA-FAC-17) | A validar |
| `frmEnvioPmovil` | PAN-FAC-46 y §9.8 | Reemplazado |
| `frmTestFacturacion` | — | Descartado (simulación de lote) |
| `abm_CespAfip`, `abm_Cvpiibb`, `abm_Electronica`, `abm_Electronica_ComproRelacion`, `abm_Electronica_Iva`, `abm_Electronica_Trib`, `abm_Impuesto`, `frmFacturacionElectronica`, `frmConsultaNumComAFIP`, `frmLibroIvaVenta`, `frmInfoArchivoRG`, `frmEnacom`, `frmEnargasPEN2067` | M06 | Fuera de M05 |
| `abm_ConceptosInt`, `abm_Plan_Cuo`, `frmInteresFacturaImpaga`, `frmInteresFacturaImpagaDetalle` | M08 | Fuera de M05 |
| `frmCuentasPorCobrar` | M07 | Fuera de M05 |
| `abm_GrpCat`, `frmTempModifBonif` | M04 | Fuera de M05 |
| `abm_ComprobanteRendicion`, `frm_ComprobanteRendicion_Detalle` | M07 | Fuera de M05 |
| `frmComprobanteVenta`, `frmComprobanteVenta_Detalle`, `frmAnulacionComprobantesVenta`, `abm_Presupu_Condicion`, `abm_Presupuesto_Notas`, `abm_Vendedor`, `frm_Presupuesto`, `frm_Presupuesto_ActualizarProd`, `frm_Presupuesto_ConjuntoDetalle`, `frm_Presupuesto_ConjuntoDetalle_Item`, `frm_Presupuesto_Detalle`, `frmPresupu_EstadoManual`, `frmImpresionPresupuesto_Orden`, `frmSeleccionarItemsPendientePresu`, `frmAjusteCuotasMoneda`, `frmEdicionCuotas`, `frmModificaDatosCuotas`, `frmModificarTipoCuotas`, `Estados_Presupuesto`, `Origen` | M11 | Fuera de M05 |
| Pantallas nuevas sin equivalente | PAN-FAC-01, 02, 03, 08, 13, 22, 23, 24, 26, 30, 33, 35, 39, 40, 41, 42, 43, 44, 45 | Nuevo |

### 22.6 RN-09 (parámetros)

Los parámetros V2 del dominio de emisión, impresión, distribución y portal están en §14 con su número de origen. Los de cálculo (M04), fiscales (M06), mora y planes (M08) y ventas (M11, ej. 2600) se trazan en esos anexos. El 2264 (sigla de cooperativa) queda Reemplazado por configuración declarativa (CTR-FAC-10); el 3109 (criterio solo en simulación) queda Descartado (RN-FAC-037).
