# M12 CMP — Compras y proveedores

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Estado | Especificación consolidada — pendiente de validar preguntas abiertas |
| Solución (BASE §105) | ERP (principal); Landing-autogestión (portal de proveedores: invitaciones, cotizaciones, carga de comprobantes y estado de pago); Impuestos (retenciones practicadas vía M06, libro IVA compras, Mis Comprobantes); Tesorería (ejecución del pago vía M14) |
| Olas | **O3** (A validar PA-CMP-01): padrón mínimo de proveedores y registro simple de compra/recepción de equipos serializados del piloto Internet, sin circuito completo. **O8**: circuito completo — proveedores con todos sus datos, solicitud de aprovisionamiento, solicitud de cotización, concursos y licitaciones, orden de compra y liberaciones, recepción/remito, comprobante de proveedor, control de 3 vías, órdenes de pago con retenciones, aprobaciones por monto, portal de proveedores, importación de Mis Comprobantes, compras por servicio y centro de costo, informes. **O11**: lectura de facturas con IA (opt-in), analítica de proveedores y migración repetible. |
| Dueño de datos | `suppliers` (proveedores con CBU, autorizados, tipos de producto, rubros, observaciones, vínculo con cuentas), `supplierCategories` (rubros), `supplierEvaluations` (valoraciones), `supplierCorrespondence` (circulares y comunicaciones), `purchaseConcepts` (conceptos de compra), `purchaseLookups` (destinatarios, modalidades, departamentos y lugares de entrega; las unidades de gasto son `expenseUnits` de M13 y los combustibles `fuelTypes` de M18, CTR-DAT-54), `supplyRequests` (solicitudes de aprovisionamiento), `quoteRequests` (solicitudes de cotización), `sourcingEvents` (concursos y licitaciones), `purchaseOrders` (órdenes de compra y liberaciones), `supplierReceipts` (remitos/recepciones de proveedor), `supplierInvoices` (comprobantes de proveedor: facturas, ND, NC, anticipos), `purchaseDocumentLinks` (trazabilidad ítem a ítem entre documentos), `matchExceptions` (excepciones del control de 3 vías), `paymentOrders` (órdenes de pago: facturas aplicadas, anticipos, retenciones aplicadas, neto), `supplierAdvances` (anticipos a proveedores), `purchaseForecasts` (previsiones periódicas), `supplierPortalSubmissions` (comprobantes cargados por proveedores), `aiInvoiceExtractions` (propuestas de lectura por IA), `supplierLedgerEntries` (cuenta corriente de proveedores) |
| Fuentes consolidadas | BASE §19 completo (objetivo, límite, alcance, control de separación, CU-19, precarga OC-001), §20/§21 (stock y tesorería como límites), §61 (FIS-001, CU-FIS-01, PROV-DEMO-001, RET-DEMO-001), §75, §78 (OPE-001 a OPE-004, CU-OPE-01, OC-DEMO-002), §80 (pendientes de compras por servicio), §98, §101, §105, §106; MER-012 (workflow de aprobación); AGR-003, AGR-011, AGR-016, AGR-022, AGR-026, AGR-027, AGR-028; DEC-002, DEC-007, DEC-009; DFA Módulo 16 (circuito SA → cotización → OC → nota de pedido → recepción → comprobante → pago con retenciones; proveedores, retenciones, libro IVA compras, otros; mejoras: aprobaciones por monto, control de 3 vías, Mis Comprobantes, Interbanking); FIC 2.4 (Mis Comprobantes), FIC 11.1 (Interbanking), FIC 20 (IA, `clsLeerComprobante`, `AUDIT_IA`); RN-08 §1.1, §1.3, §1.4, §3, §4, §6.2 (efecto contable de compras, referencia), §7 completo, §12.1, §12.2, §12.4, §13, §14 (dudas 2–7, 12, 13), §15.3 completo; RN-09 COMPRAS (109 parámetros) y parámetros relacionados (500, 527, 2012, 2066, 2112, 2162, 2502, 2503, 2538, 2548, 2952, 518, 519); CAT §14 completo (`CMPORDE`, `COMBUSTIBLES`, `COMPRAS_RELACION`, `COMP_COM`, `CON_COM`, `CON_COM_RET`, `DESTINATARIO_SAPROV`, `FPALIC_IVA`, `FPITEMS`, `IT_APROV`, `IT_COMPC`, `IT_NPED`, `IT_SCOTIZ`, `IVACOM`, `IVACOM_COMBUSTIBLES`, `IVACOM_WEB`, `NPEDIDO`, `OBS_PRO`, `OCOMPRA`, `PREV_COM`, `PROVEED`, `PROVEED_AUT`, `PROVEED_CBU`, `PROVEED_RET`, `PROVEED_TIPPROD`, `PROVEED_VALORACIONES`, `PROVSUM`, `RPSPROV`, `RPSXPROV`, `RUBPROV`, `RUBXPRO`, `SAPROV`, `SCOTIZ`, `UNIDADES_GASTOS`), CAT §5 (`RETE_TIPO`, `RETE_TIPO_BASE`, `RETS_TIPO`, `CAT_RETG`, `RET_COM`, `PROD_SER_RET`, `SITIVA`), CAT §16 (`PPAGOS`, `PPITEMS`, `PPAGOS_FIRMANTES`, `PPAGOS_FIRMAS`, `INTERBANKING`, `MOV_INTERBANKING`), CAT §17 (`CTSECCION`, `CTSECCION_ASIGNA`, `CTSECCION_GP_ASIGNA`, `CTSECCION_GRUPOS`), CAT §27 (`FIRMASELECTRONICAS*`, `AUDIT_IA`), CAT §29 (`OPE_COM`), CAT §31 (`CIRCUPRO`); INV Configuracion (`abm_Proveed`, `abm_Proveed_Aut`, `abm_proveed_cbu`, `frmProveed_Valoraciones`, `frmSeleccionarProveedores`, `frmProveedorPassGenerica`, `ConsultaProveedores`, `SelectorProveedor`, `abm_Combustible`, `frmImportacionArchivos.Importar_RetencionesCompras`), INV ProMod_Tesoreria (`frmCargaRetenciones`, `frmCargaMedioDePago_Simple`, `frmApertura_Cierre_Cajas_Comprs`, `abm_CajaPago`, `frmConciliacionInterbanking`, `frmSaldosCuentasInterbanking`, como límite con M14); anexos ya redactados M06 FIS (motor de retenciones, Mis Comprobantes), M14 TES (ejecución de pagos, firmas, compromisos de fondos), M13 STK (referencia); CNX (patrones de pantalla, permisos, portal) |


> **Norma de implementación (DEC-111, DEC-112, DEC-110, DEC-113).** Construcción GoodApps: **.NET 10**, **ASP.NET Core**, **EF Core**, **Azure SQL** (base compartida, `TenantId` en tablas de negocio), front **React 19**, **Microsoft Azure** (Container Apps, Blob, Queue, Key Vault, Application Insights), identidad **OpenIddict**. Modelo físico: `07-modelo-relacional-azure-sql.md` y `07-catalogo-tablas-sql.md`. Checklist e impacto: `06-impacto-adaptacion-stack-goodapps.md` (**DIR-13**).
>
> **Lectura:** «colección» en este anexo = **entidad lógica**; tablas, columnas y FK en `07-*`. RF/RN/CU del anexo **no cambian** por el stack.


## 1. Objetivo

Conducir la **adquisición de bienes y servicios** de la cooperativa y su **relación con proveedores**, desde la necesidad interna hasta la obligación de pago lista para tesorería, con trazabilidad comercial, física, fiscal, financiera y contable (BASE §19, §78):

1. **Proveedores** completos: datos fiscales, CBU validados, regímenes de retención aplicables (asignados en M06), tipos de producto, personas autorizadas, rubros, valoraciones, observaciones, correspondencia y portal.
2. **Circuito de compra** con documentos formales y estados explícitos: solicitud de aprovisionamiento (SA) → solicitud de cotización / concurso / licitación → orden de compra (OC, incluidas liberaciones contra OC abierta, ex nota de pedido) → recepción/remito → comprobante de proveedor → orden de pago (OP).
3. **Control de 3 vías** (OC – recepción – factura) con tolerancias, excepciones aprobadas y bloqueo de pago (AGR-027): "se pidieron diez, llegaron seis y se facturaron diez: no se paga como si se hubieran recibido todos".
4. **Compras por servicio y centro de costo** (BASE §78 OPE-001): cada línea identifica servicio, destino, OT u obra y centro de costo, sin duplicar compras compartidas.
5. **Aprobaciones por monto y nivel** con workflow T11 y segregación de funciones (solicita / aprueba / recibe / autoriza el pago).
6. **Orden de pago** con aplicación de facturas y anticipos y **aplicación de retenciones** calculadas por el motor de M06 (CU-FIS-01); la ejecución financiera la hace M14.
7. Automatización de la carga: **importación de Mis Comprobantes** de ARCA como borradores, **portal de proveedores** y **lectura de facturas por IA** que propone y una persona confirma.

## 2. Límite y responsabilidades

**Qué hace M12:**

- Es dueño del proveedor como tercero comercial y de su cuenta corriente (obligaciones, saldos, vencimientos, anticipos). La **identidad** del proveedor (razón social o nombre, CUIT, condición frente al IVA, domicilios y contactos) es de la persona de M01: el proveedor es un rol de esa persona (`personId` obligatorio, DEC-097) y M12 guarda solo los datos del rol.
- Es dueño de los documentos de compra, sus estados, aprobaciones y vínculos ítem a ítem (`COMPRAS_RELACION`).
- Registra la **obligación** (comprobante de proveedor) y decide **qué** se paga, **a quién**, **cuánto** (bruto, retenciones, neto) y **cuándo** queda habilitado; aprueba la OP y la entrega a M14.
- Publica eventos para stock, fiscal, tesorería, contabilidad y comunicaciones.

**Qué NO hace M12 y a quién delega:**

| Tema | Responsable | Qué recibe o pide M12 |
|---|---|---|
| Ingreso físico al depósito, series, ubicaciones, valorización, devoluciones físicas, bienes de uso, fabricación, vales, RMA y servicio técnico de equipos (`RECEPCIONES`/`ESTADOS_RECEP`) | M13 STK | M12 publica `cmp.receipt.confirmed`; M13 crea el movimiento y confirma (`stk.goods.received`, EVT-STK-01). M12 **nunca** mueve stock |
| Motor de retenciones (tipos, escalas, asignaciones, cálculo, certificados, numeración, declaraciones SICORE/SIRE/SIRCAR), libro IVA compras, Libro IVA Digital, conciliación Mis Comprobantes, padrón ARCA, verificación CAE/CAI | M06 FIS | M12 invoca `fis.service.calculateWithholdings` (antes `fis.withholding.calculate`) al preparar la OP y muestra el resultado; M06 confirma `withholdingsApplied` al aprobar; M06 entrega a M12 los comprobantes recibidos no registrados |
| Ejecución del pago: medios (efectivo, cheques propios/terceros, eCheq, transferencia, VEP), caja de pagos, firmas y entrega, archivo Interbanking, débito y conciliación | M14 TES | M12 publica `cmp.paymentOrder.approved/cancelled`; recibe `tes.paymentExecution.executed/voided` |
| Compromisos de fondos y proyección de pagos | M14 TES (con M15) | M12 publica `cmp.purchaseOrder.approved/cancelled`, `cmp.supplierInvoice.registered` |
| Asientos contables (compras, pagos, retenciones, pendientes de recepción) | M15 CON | Consume eventos de M12 con su imputación (servicio, centro de costo, rubro) |
| Catálogo de productos, unidades y alícuotas | M02 CAT | M12 referencia `products` y agrega `purchaseConcepts` propios |
| Orden técnica, obra, consumo de materiales | M10 TEC | M10 origina SA; M12 vincula líneas a OT/obra |
| Adelantos de sueldo, recibos y pago de haberes | M16 SUE | M12 no genera novedades de sueldo (PA-CMP-12) |
| Aprobaciones, expediente, firma electrónica | T11 WFL | M12 declara políticas y documentos |
| Comunicaciones (mail, SMS, WhatsApp) | T09 COM | M12 provee plantillas y destinatarios |
| Identidad del usuario del portal de proveedores | T02 IAM | M12 invita y asigna rol `supplier` |
| Credenciales de Interbanking y de IA | T01/T08 (bóveda) | Nunca en tablas de negocio |

**Regla rectora (BASE §19, §78):** la compra autoriza un pedido; la recepción confirma una entrega; la factura registra la obligación; tesorería paga. Son hitos distintos y **aprobar una orden no equivale a recibir mercadería**. Una entrega parcial no completa el pedido.

## 3. Glosario del módulo

| Término | Definición | Clave de diccionario | Término ProCoop equivalente |
|---|---|---|---|
| Proveedor | Tercero que vende bienes o servicios a la cooperativa. Es un rol de una persona de M01: un socio que además es proveedor tiene una sola persona con los dos roles (DEC-097). | `dict:cmp.supplier` | `PROVEED` |
| CBU del proveedor | Cuenta bancaria validada para transferencias. | `dict:cmp.supplierBankAccount` | `PROVEED_CBU` |
| Autorizado | Persona habilitada por el proveedor para retirar valores o firmar. | `dict:cmp.authorizedPerson` | `PROVEED_AUT` |
| Rubro de proveedor | Clasificación del proveedor (con banco y pago diferido). | `dict:cmp.supplierCategory` | `RUBPROV`/`RUBXPRO`, `RPSPROV`/`RPSXPROV` |
| Valoración | Evaluación del proveedor por cualidad y puntuación. | `dict:cmp.supplierEvaluation` | `PROVEED_VALORACIONES` |
| Concepto de compra | Bien o servicio no inventariable con rubro, alícuota e IIBB. | `dict:cmp.purchaseConcept` | `CON_COM` |
| Solicitud de aprovisionamiento (SA) | Pedido interno de compra con solicitante, destinatario y criticidad. | `dict:cmp.supplyRequest` | `SAPROV`/`IT_APROV` |
| Solicitud de cotización | Pedido de precios a un proveedor; varias se agrupan para comparar. | `dict:cmp.quoteRequest` | `SCOTIZ`/`IT_SCOTIZ` |
| Concurso / licitación | Procedimiento formal de selección con invitación, apertura y adjudicación. | `dict:cmp.sourcingEvent` | Modalidad de contratación 1–4 de `SCOTIZ` |
| Orden de compra (OC) | Compromiso de compra aprobado con un proveedor. | `dict:cmp.purchaseOrder` | `OCOMPRA` / `NPEDIDO`+`IT_NPED` (ver CTR-CMP-02) |
| Liberación | Pedido parcial contra una OC abierta (marco). | `dict:cmp.release` | Nota de pedido (`NPEDIDO`) |
| Recepción / remito de proveedor | Constancia de entrega física o conformidad de servicio. | `dict:cmp.receipt` | `COMP_COM`/`IT_COMPC` |
| Comprobante de proveedor | Factura, ND, NC, ticket o anticipo que registra la obligación. | `dict:cmp.supplierInvoice` | `IVACOM`/`FPITEMS`/`FPALIC_IVA` |
| Control de 3 vías | Comparación OC – recepción – factura por cantidad y precio. | `dict:cmp.threeWayMatch` | — (mejora DFA M16) |
| Excepción de conciliación | Diferencia fuera de tolerancia con causa y decisión. | `dict:cmp.matchException` | — |
| Habilitación de pago | Estado que permite incluir un comprobante en una OP. | `dict:cmp.paymentRelease` | `PER_PAGO` |
| Orden de pago (OP) | Documento que aplica comprobantes y anticipos, retenciones y neto a pagar. | `dict:cmp.paymentOrder` | `PPAGOS`/`PPITEMS` |
| Anticipo a proveedor | Pago sin factura que luego se aplica. | `dict:cmp.supplierAdvance` | Comprobante con concepto P2035 |
| Retención practicada | Importe que la cooperativa retiene como agente (calculado por M06). | `dict:fis.withholdingApplied` | `RET_COM` |
| Previsión de compra | Pago periódico esperado (alquiler, servicio). | `dict:cmp.purchaseForecast` | `PREV_COM` |
| Portal de proveedores | Acceso web del proveedor a cotizaciones, comprobantes y pagos. | `dict:cmp.supplierPortal` | `IVACOM_WEB`, contraseña genérica |
| Unidad de gasto | Agrupador interno de gasto para vales y compras. | `dict:cmp.spendingUnit` | `UNIDADES_GASTOS` |
| Paga a otros | Proveedor cuyos pagos pueden cancelar comprobantes de otros proveedores. | `dict:cmp.paysOthers` | `PERPAGOTROS` |

## 4. Actores, permisos y alcance

| Rol | Capabilities | Alcance de datos |
|---|---|---|
| Solicitante (cualquier área) | `cmp.solicitudes.ver`, `cmp.solicitudes.crear`, `cmp.solicitudes.editar` (propias, antes de aprobar) | Sus solicitudes y las de su área |
| Aprobador de solicitudes | `cmp.solicitudes.aprobar`, `cmp.solicitudes.rechazar` | Según política T11 (área, monto) |
| Comprador | `cmp.proveedores.ver`, `cmp.proveedores.crear`, `cmp.proveedores.editar`, `cmp.solicitudes.ver`, `cmp.solicitudes.procesar`, `cmp.solicitudes.descartar`, `cmp.cotizaciones.ver`, `cmp.cotizaciones.crear`, `cmp.cotizaciones.editar`, `cmp.cotizaciones.evaluar`, `cmp.concursos.ver`, `cmp.concursos.editar`, `cmp.concursos.adjudicar` (antes `cmp.cotizaciones.*`; `cmp.concursos.*`), `cmp.ordenes.ver`, `cmp.ordenes.crear`, `cmp.ordenes.editar`, `cmp.ordenes.enviar`, `cmp.ordenes.cerrar` | Tenant o sucursales |
| Aprobador de compras | `cmp.ordenes.aprobar`, `cmp.concursos.adjudicar` | Según bandas de monto T11 |
| Receptor (depósito / responsable de servicio) | `cmp.recepciones.ver`, `cmp.recepciones.registrar`, `cmp.recepciones.anular`, `cmp.devoluciones.registrar` | Depósitos/áreas asignadas |
| Administrativo de cuentas a pagar | `cmp.comprobantes.ver`, `cmp.comprobantes.registrar`, `cmp.comprobantes.editar`, `cmp.comprobantes.anular`, `cmp.conciliacion.ver`, `cmp.misComprobantes.importar`, `cmp.ia.usar`, `cmp.portal.revisar`, `cmp.anticipos.crear` | Tenant |
| Autorizador de excepciones | `cmp.conciliacion.aprobarExcepcion`, `cmp.pago.habilitar` (reemplaza `Admin_FA_PerPago`), `cmp.proveedores.aprobarCbu` | Según bandas T11 |
| Responsable de pagos | `cmp.ordenesPago.ver`, `cmp.ordenesPago.crear`, `cmp.ordenesPago.editar`, `cmp.retenciones.ajustar` (si P2836), `cmp.ordenesPago.anular` (reemplaza `Anula_OP`) | Tenant |
| Aprobador de pagos | `cmp.ordenesPago.aprobar` | Según bandas T11 |
| Responsable de abastecimiento y señales (HUE-ELE-01, HUE-GAS-04, HUE-TV-01) | `cmp.abastecimiento.aprobar`, `cmp.derechosSenales.liquidar`, `cmp.derechosSenales.aprobar` | Servicios ELE, GAS y TV asignados; quien liquida no aprueba la misma liquidación |
| Tesorero (M14) | `cmp.ordenesPago.ver` (lectura) | Firma y entrega con `tes.*` (reemplazan `Firma_OP`, `Entrega_OP`) |
| Configurador | `cmp.config.configurar`, `cmp.catalogos.configurar`, `cmp.politicas.configurar` | Tenant |
| Auditor | `cmp.*.ver`, `cmp.reportes.exportar` (antes `cmp.*.exportar`) | Tenant, solo lectura |
| Usuario de sueldos | `cmp.proveedoresEmpleados.ver` (reemplaza `frm_Su_Sueldo`) | Proveedores que son empleados |
| Proveedor (portal, rol `supplier`) | `cmp.portal.cotizar`, `cmp.portal.subirComprobante`, `cmp.portal.verPagos`, `cmp.portal.verOrdenes` | Solo su propio proveedor (por CUIT vinculado) |
| Soporte de plataforma | Acceso temporal T01/T02 | Tenant con autorización vigente |

**Segregación obligatoria (BASE §19 Control):** el mismo usuario no puede, sobre una misma operación, (a) solicitar y aprobar la SA, (b) crear y aprobar la OC, (c) aprobar la OC y registrar su recepción, (d) registrar la factura y aprobar su excepción o la OP. Las acciones masivas (autorizar SA, aprobar OC, habilitar pago) exigen la misma capability que la individual y registran usuario y fecha por cada documento (corrige RN-08 §4.3 y §15.3). Los permisos duplicados de ProCoop `autoriz_sa`/`autoriza_sa` se unifican en `cmp.solicitudes.aprobar`; `elimina_sa` y `anula_sa` en `cmp.solicitudes.anular`.

## 5. Requisitos funcionales

> **Barrido transversal (19-11-2026, DEC-111).** Los RF/RN de **§5–§6** definen comportamiento aceptado. Citas a MongoDB, Mongoose, BullMQ, Vue o npm son **mecanismos históricos Connectia** o columnas de contraste; en build GoodApps prevalecen `03-norma-ejecucion-goodapps.md` §3–§4, `07-ddl` y §7 de este anexo. No reinterpretar alcance sin nueva DEC.


### 5.1 Proveedores

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CMP-001 | ABM de proveedores como **rol de una persona de M01** (DEC-097). El alta empieza en el alta asistida de M01 (RF-PER-174): se busca la persona por CUIT, documento o nombre con su control de duplicados; si existe (por ejemplo, un socio contratista) se reutiliza y si no se crea en M01. Razón social, nombre de fantasía, CUIT, condición de IVA (perfil fiscal de la persona, `SITIVA`), domicilio fiscal y comercial, teléfonos y emails se leen de la persona y se editan en M01. La ficha del proveedor guarda solo lo propio del rol: código, inscripción IIBB y jurisdicciones, contactos comerciales (persona de contacto y función), condición de pago por defecto, moneda, cuenta contable (obligatoria si P3068), rubro (obligatorio salvo P2017), marca "paga a otros" (P2019), estado (activo, bloqueado, inactivo) y motivo. *Reemplazado (10-11-2026): "ABM de proveedores: razón social, nombre de fantasía, CUIT, condición de IVA (`SITIVA`), inscripción IIBB y jurisdicciones, domicilio fiscal y comercial, teléfonos, emails, contacto, condición de pago por defecto, moneda, cuenta contable (obligatoria si P3068), rubro (obligatorio salvo P2017), marca "paga a otros" (P2019), estado (activo, bloqueado, inactivo) y motivo."* | CAT `PROVEED` (67 columnas); INV `abm_Proveed`; DFA M16; BASE §19 "Registrar proveedores y condiciones"; DEC-097 | Estándar | O8 | Informado | Una ficha de proveedor por persona (`{tenantId, personId}` único); la CUIT es única por tenant porque es la identificación de la persona (RN-PER-005 de M01); un proveedor bloqueado no recibe OC ni OP. Dar de alta como proveedor a un socio existente reutiliza su persona y no duplica razón social ni CUIT. *Criterio anterior: "CUIT único por tenant; un proveedor bloqueado no recibe OC ni OP."* |
| RF-CMP-002 | Validar CUIT (dígito verificador) y consultar el padrón de ARCA mediante el componente de M06 al dar de alta o modificar (P218), proponiendo datos; alertar si el certificado/constancia del proveedor está vencido (P217) sin abrir páginas externas automáticamente. Desde DEC-097 la validación y la verificación se hacen sobre la identificación de la persona en el alta asistida de M01 (RF-PER-019, RF-PER-020); M12 muestra el resultado y aplica P217 y P218 como políticas del rol. | RN-09 217, 218; M06 PAN-FIS-23; DEC-097 | Estándar | O8 | Adoptado | Con P218 activo, un CUIT inexistente en el padrón muestra advertencia y queda registrada la consulta. |
| RF-CMP-003 | CBU/CVU del proveedor: varias cuentas con descripción, banco, titular y CUIT del titular; validación de formato; **cambio o alta de CBU con aprobación T11** y aviso al proveedor (prevención de fraude); cuenta preferida. | CAT `PROVEED_CBU`; INV `abm_proveed_cbu`, `btnAddCbu`; M14 RN-TES-077 | Estándar | O8 | Adoptado | Una OP no usa un CBU con cambio pendiente de aprobación. |
| RF-CMP-004 | Mostrar y editar, desde la ficha del proveedor, los regímenes de retención aplicables, exclusiones y certificados de no retención con vigencia (los datos son de M06, `withholdingAssignments`); importar retenciones/alícuotas de proveedores por archivo (P2542). | CAT `PROVEED_RET`; DFA M16; INV `Importar_RetencionesCompras`; RN-09 2542; M06 §7.23 | Estándar | O8 | Informado | La ficha muestra lo que M06 aplicará en la próxima OP. |
| RF-CMP-005 | Tipos de producto que provee cada proveedor, para filtrar invitaciones a cotizar. | CAT `PROVEED_TIPPROD` | Estándar | O8 | Informado | Al invitar a cotizar un rubro se sugieren solo proveedores con ese tipo. |
| RF-CMP-006 | Personas autorizadas del proveedor: nombre, documento, fecha de autorización, caducidad opcional, observación; uso en la entrega de valores (M14). | CAT `PROVEED_AUT`; INV `abm_Proveed_Aut` (`chkCaducidad`) | Estándar | O8 | Informado | Un autorizado caducado no puede retirar pagos. |
| RF-CMP-007 | Valoraciones del proveedor: usuario, fecha, cualidad, puntuación, observación; más indicadores automáticos (entregas a término, diferencias de cantidad y precio, devoluciones) para "medir cumplimiento de proveedores". | CAT `PROVEED_VALORACIONES`; INV `frmProveed_Valoraciones`, `btnAgregarValorac`; BASE §19 | Estándar | O8 | Adoptado | El tablero del proveedor muestra puntaje promedio y % de entregas a término del período. |
| RF-CMP-008 | Rubros de proveedores unificados (un solo catálogo con banco y pago diferido) y asignación de uno o varios rubros con fecha. | CAT `RUBPROV`, `RUBXPRO`, `RPSPROV`, `RPSXPROV` | Estándar | O8 | Adoptado (CTR-CMP-10) | Un rubro con "pago diferido" habilita pagos diferidos a sus proveedores (P2015/P2016 en M14). |
| RF-CMP-009 | Observaciones del proveedor y notas con fecha y usuario. | CAT `OBS_PRO` | Estándar | O8 | Informado | Las notas son inmutables; se agregan nuevas. |
| RF-CMP-010 | Vincular el proveedor con cuentas/personas de M01 (proveedor que también es socio o usuario), con tipo de relación. Desde DEC-097 el vínculo con la persona es directo (`suppliers.personId`); `linkedAccounts` queda para relacionar cuentas de servicio con el proveedor (`PROVSUM`), por ejemplo la cuenta de otra persona que el proveedor paga. | CAT `PROVSUM` (`COD_SUM`, `COD_PROV`, `TIPO`); INV `btnAgregarCuenta`; DEC-097 | Estándar | O8 | Informado | La ficha 360 del socio muestra su rol de proveedor; no hay compensación automática de saldos. |
| RF-CMP-011 | Proveedores que son empleados: ocultar sus facturas, recibos y datos en compras e informes salvo capability `cmp.proveedoresEmpleados.ver` (P2653, P2709). | RN-09 2653, 2709; RN-08 §1.4 `frm_Su_Sueldo` | Estándar | O8 | Informado | Un comprador sin la capability no ve importes de proveedores-empleado. |
| RF-CMP-012 | Comunicaciones con el proveedor por email, SMS y WhatsApp (T09) con plantilla; circulares a proveedores (texto masivo por rubro o tipo) e historial de correspondencia. | INV `abm_Proveed` (`EnviarMail`, `btnEnvioSms`, `btnWpp`); CAT `CIRCUPRO`; DFA M16 "Correspondencia" | Estándar | O8 | Informado | Cada envío queda en `supplierCorrespondence` con estado de entrega. |
| RF-CMP-013 | Trámites y documentación del proveedor (constancias, seguros, habilitaciones) con vencimiento y adjuntos en el expediente T11; alerta de vencimiento. | INV `btnAddTramite`, `GuardarAdjuntos` | Estándar | O8 | Adoptado | Un documento obligatorio vencido bloquea nuevas OC si la política lo exige. |
| RF-CMP-014 | Consulta de situación crediticia del proveedor en la Central de Deudores del BCRA como enlace informativo. | INV `btnBCRA` **[VERIFICAR]** uso real | Extensión | O8 | A validar | Sin confirmación, solo enlace externo. |
| RF-CMP-015 | Acceso al portal de proveedores por invitación individual con usuario propio (T02), reemplazando la contraseña genérica y el "blanqueo" manual. | INV `frmProveedorPassGenerica`, `btnBlanqueo` | Estándar | O8 | Reemplazado por invitación T02 (PA-CMP-05) | No existe contraseña compartida entre proveedores. |
| RF-CMP-016 | Cuenta corriente del proveedor: comprobantes, pagos, anticipos, NC, saldo, vencidos y a vencer, con fecha de corte. | DFA M16 "Informes de compras"; BASE §19 "Consultar obligaciones y vencimientos" | Núcleo | O8 | Informado | Saldo = Σ comprobantes − Σ aplicaciones de OP − NC aplicadas, a la fecha de corte. |
| RF-CMP-017 | Búsqueda y selección de proveedores por CUIT, código, nombre, rubro, tipo de producto y valoración (selector embebible en otros módulos y selección múltiple). | INV `ConsultaProveedores`, `SelectorProveedor`, `frmSeleccionarProveedores` | Estándar | O8 | Informado | El selector respeta el alcance de datos. |
| RF-CMP-018 | Padrón mínimo de proveedores (razón social, CUIT, condición IVA) para registrar el ingreso de equipos serializados del piloto. Esos tres datos son de la persona de M01 (O2) y el proveedor se crea con `personId` por el alta asistida (DEC-097). | BASE §101 (O3 stock serializado); CU-OPE-01 | Núcleo | O3 | A validar (PA-CMP-01) | El ingreso de módems del piloto referencia un proveedor existente. |

### 5.2 Catálogos de compras

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CMP-020 | Conceptos de compra (no inventariables): descripción, descripción para formulario, unidad, rubro contable, alícuota de IVA, no gravado, tipo, tipo de IVA, código IIBB; retenciones aplicables por concepto (en M06). | CAT `CON_COM`, `CON_COM_RET` | Estándar | O8 | Informado | Un concepto sin rubro no se usa si el tenant exige imputación. |
| RF-CMP-021 | Destinatarios de SA (áreas/personas receptoras). | CAT `DESTINATARIO_SAPROV` | Estándar | O8 | Informado | Con P2705 la SA exige destinatario. |
| RF-CMP-022 | Unidades de gasto y su panel al cargar productos desde un vale (P2906, uso en M13). El catálogo es `expenseUnits` de M13 (CTR-DAT-54); M12 lo consulta. | CAT `UNIDADES_GASTOS`; RN-09 2906 | Estándar | O8 | Informado | La unidad de gasto se imputa en la línea. |
| RF-CMP-023 | Tipos de combustible y registro de litros y km por comprobante de compra de combustible. El catálogo de tipos es `fuelTypes` de M18 (CTR-DAT-54); M12 registra litros y km en el comprobante. | CAT `COMBUSTIBLES`, `IVACOM_COMBUSTIBLES`; INV `abm_Combustible` | Estándar | O8 | Informado | El informe de consumo de combustible suma litros por vehículo/movimiento. |
| RF-CMP-024 | Modalidades de contratación: sin asignar, caja chica, compulsa/mail, concurso de precios, concurso, licitación; cada una con umbrales y documentos exigidos configurables. | RN-08 §7.3, §15.3 (`GetSolAprovFiltradas`) | Estándar | O8 | Adoptado | Una SA por encima del umbral de compulsa exige al menos N cotizaciones. |
| RF-CMP-025 | Tipos de comprobante de compra y sus operaciones (suma/resta saldo, informa impuestos, mueve stock, anticipo, OP) desde el catálogo de tipos de comprobante de M05/T04. | CAT `OPE_COM`; RN-08 §4.2 (operaciones ORDEN_DE_PAGO, ANTICIPO_A_PROVEEDOR), §7.5 (`INF_IMPOS`) | Estándar | O8 | Informado | Un tipo sin operación configurada no se ofrece. |
| RF-CMP-026 | Previsiones de pagos periódicos por proveedor, concepto o producto con periodicidad (mensual, bimestral, trimestral, semanal, quincenal), vigencia e importe, expuestas a la proyección de M14. | CAT `PREV_COM`; RN-08 §15.3 `GetPrevisionesCompras` | Estándar | O8 | Informado | Una previsión mensual de ARS 10.000 de enero a marzo genera 3 vencimientos proyectados. |

### 5.3 Solicitud de aprovisionamiento

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CMP-030 | Alta de SA con ítems de producto, concepto o texto libre: cantidad, unidad, costo estimado (con precio de última compra), solicitante, destinatario, criticidad (normal, alta, urgente), modalidad, fecha requerida, observaciones; y **por línea**: servicio, centro de costo, OT u obra, destino/depósito. | CAT `SAPROV`, `IT_APROV`; RN-08 §7.2; BASE §19, §78, §80 | Estándar | O8 | Informado | Una SA para "reposición de módems del servicio INT" guarda servicio y centro de costo en la línea. |
| RF-CMP-031 | Originar SA desde: punto de reposición de M13, OT/obra de M10 (materiales faltantes), fabricación (M13) o manualmente. | BASE §78 ("un requerimiento puede originarse en una necesidad de servicio, reposición o intervención") | Estándar | O8 | Adoptado | La SA conserva el vínculo con su origen. |
| RF-CMP-032 | Aprobación de SA por workflow T11 según política (monto estimado, área, criticidad), con opción de **doble aprobación** por usuarios distintos (P2867). Nunca se autoaprueba por procesar un ítem. | RN-08 §7.2 (`Autorizar`, `DOBLE_AUTO`; defecto `Procesar` autoriza); RN-09 2640, 2867; MER-012 | Estándar | O8 | Adoptado | Procesar un ítem de una SA no aprobada devuelve error `cmp/request-not-approved`. |
| RF-CMP-033 | Visibilidad: quien no puede aprobar ve solo SA aprobadas para procesar; filtro de vigencia en días (P2036) que **sí** excluye SA más antiguas que la vigencia. | RN-08 §15.3 (defecto de vigencia) | Estándar | O8 | Adoptado | Con vigencia 30, una SA de hace 45 días no aparece en pendientes. |
| RF-CMP-034 | Estados: borrador, pendiente de aprobación, aprobada, rechazada, en proceso (compras la tomó), parcialmente procesada, procesada, descartada, anulada; reabrir ("marcar pendiente") con motivo. | RN-08 §7.2 (`GetEstadoSolicitud`, `CambiarA_EnProceso`, `Descartar`, `MarcarPendiente`) | Estándar | O8 | Informado | No se elimina una SA con ítems procesados; se anula. |
| RF-CMP-035 | Aprobación por informe impreso para firma del aprobador (marca "exportada"), como alternativa al workflow electrónico. | RN-08 §15.3 (`GetDatosInformeParaAutorizar`, `MarcarComoExportada`) | Extensión | O8 | Reemplazado por T11 con PDF firmable | El PDF incluye monto estimado y precio de última compra. |
| RF-CMP-036 | Aprobación masiva de SA filtradas por fecha y modalidad, con la misma capability e historial por documento. | RN-08 §15.3 (`AutorizarSolicitudes` sin permisos) | Estándar | O8 | Adoptado | Las SA para las que el usuario no tiene banda quedan rechazadas en el resultado con causa. |
| RF-CMP-037 | Mostrar disponibilidad comprometida del producto: saldo de OC abiertas, facturas pendientes de recepción y presupuestos aprobados con obra (M11), junto con el stock de M13. | RN-08 §15.3 (`Get_Stock_ItemsOC`, `Get_Stock_FpItems`, `Get_Stock_Comprometido_Presup`) | Estándar | O8 | Informado | Al pedir 10 módems se ve que hay 4 en OC abiertas. |
| RF-CMP-038 | Advertir si ya existe un pedido abierto del mismo producto o concepto (SA sin recibir u OC con saldo pendiente). | RN-08 §15.3 (`Get_SolicitudAprov`, defecto para conceptos) | Estándar | O8 | Adoptado | La búsqueda funciona igual para productos y conceptos. |
| RF-CMP-039 | Solicitar cotización de los materiales de una SA por mail con plantilla (P2888). | RN-09 2888 | Estándar | O8 | Informado | El mail llega con los ítems y el enlace al portal. |

### 5.4 Cotizaciones, concursos y licitaciones

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CMP-040 | Generar solicitudes de cotización a uno o varios proveedores desde SA aprobadas (una por proveedor, agrupadas), con vencimiento configurable (default 15 días), moneda y cotización. | CAT `SCOTIZ`, `IT_SCOTIZ`; RN-08 §7.3 | Estándar | O8 | Informado | Tres proveedores invitados generan tres cotizaciones del mismo grupo. |
| RF-CMP-041 | Cargar precios cotizados por el comprador o por el proveedor en el portal (precio, validez, plazo de entrega, observación), mostrando costo anterior e IVA calculado según la situación de IVA de la cooperativa (P527); marcar enviada o rechazada con motivo. | RN-08 §7.3, §15.3 (`GuardarCotizacion`, `GetDetallesACotizar`, `RechazarCotizacion`) | Estándar | O8 | Informado | Una cotización cotizada exige costo ≠ 0 en todos sus ítems. |
| RF-CMP-042 | Cuadro comparativo de cotizaciones hermanas por ítem (precio, total en pesos P3119, plazo, valoración del proveedor) y últimas cotizaciones/órdenes del producto. | RN-08 §15.3 (`getCotizadasCompletas`, `GetUltimasCotizaciones`); RN-09 3119; BASE §19 "Solicitar y comparar cotizaciones" | Estándar | O8 | Informado | Si la SA se cotizó a un solo proveedor, se informa que no hay comparación. |
| RF-CMP-043 | Evaluar/adjudicar por ítem (contratado o descartado) con ajuste de cantidad y justificación cuando no se elige el menor precio. | RN-08 §7.3 (`EvaluarCotizaciones`, `EvaluarCotizacion`) | Estándar | O8 | Adoptado | Adjudicar un precio no mínimo exige justificación. |
| RF-CMP-044 | Concursos de precios, concursos y licitaciones: numeración correlativa por modalidad, invitación por plantilla (P2893), pliego y adjuntos, recepción de ofertas en sobre cerrado hasta la fecha de apertura, acta de apertura, planilla de adjudicación, carátula de expediente. | RN-08 §7.3 (`GetParametros_CaratulaExpendiente`, `GetDetallesActaApertura`, `GetDetalles_PlanillAdjudicacion`); RN-09 2893 | Estándar | O8 | A validar (PA-CMP-13) | Ninguna oferta es visible para compras antes de la apertura. |
| RF-CMP-045 | Generar la OC desde los ítems adjudicados. | RN-08 §15.3 (`GetCotizacionesCotizadas`) | Estándar | O8 | Informado | Un ítem adjudicado no genera dos OC. |

### 5.5 Órdenes de compra

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CMP-050 | Alta de OC: proveedor, fecha, forma y condición de pago, plazo y lugar de entrega, fecha de entrega (obligatoria si P2735), fecha estimada de pago (obligatoria si P2810), solicitante (usuario si P2447), firmante, departamento, moneda (modificable si P2323) y cotización, observaciones; ítems con producto o concepto, cantidad, bultos, precio, bonificación, alícuotas, fecha de entrega por línea. | CAT `OCOMPRA`, `NPEDIDO`, `IT_NPED`; RN-08 §7.4; RN-09 2323, 2335, 2447, 2735, 2810 | Estándar | O8 | Informado | Con P2335, una OC sin todos los campos obligatorios no se emite. |
| RF-CMP-051 | Cada línea de OC identifica servicio, destino (depósito/OT/obra con P3101), centro de costo y, si abastece varios servicios, una **distribución explícita** (porcentaje o cantidad) que suma 100 % sin duplicar el total. | BASE §78 OPE-001, §80; RN-09 3101 | Núcleo | O8 | A validar (PA-CMP-14) | Una OC de ARS 40.000 compartida 50/50 entre INT y TV informa ARS 20.000 por servicio y ARS 40.000 en total. |
| RF-CMP-052 | Aprobación de OC por bandas de monto y categoría en T11 (reemplaza P2377/P2382: "autorizada por defecto" o "pendiente si supera monto"), con capability y segregación; una OC no aprobada no se envía ni se recibe. | RN-08 §7.4 (autorización sin permiso); RN-09 2377, 2382; DFA M16 "Aprobaciones por monto"; MER-012 | Núcleo | O8 | Adoptado | Con banda "≥ ARS 500.000 requiere gerencia", una OC de ARS 600.000 queda `pendingApproval` hasta que gerencia apruebe. |
| RF-CMP-053 | Enviar la OC al proveedor por mail con plantilla (P2905) y publicarla en el portal; el proveedor confirma recepción y fecha comprometida. | RN-09 2905; RN-08 §15.3 (`GetOrdenesAutorizadas`) | Estándar | O8 | Informado | La OC enviada registra fecha, canal y confirmación. |
| RF-CMP-054 | OC abierta (marco) con precio y cantidad máximos por vigencia y **liberaciones** parciales (reemplaza la nota de pedido); consumo del saldo marco. | DFA M16 (Nota de Pedido); CAT `NPEDIDO`/`IT_NPED` | Estándar | O8 | A validar (PA-CMP-02) | Una liberación que supera el saldo del marco se rechaza. |
| RF-CMP-055 | Modificar una OC aprobada crea una nueva versión que vuelve a aprobación si cambia importe, proveedor o condiciones por encima de la tolerancia; historial de versiones. | AGR-003 | Estándar | O8 | Adoptado | La recepción se valida contra la versión vigente. |
| RF-CMP-056 | Cerrar (saldo no se recibirá) o cancelar una OC con motivo, liberando el compromiso de fondos. | RN-08 §15.3 (OC no anuladas `A`, no cerradas `C`); AGR-028 | Estándar | O8 | Informado | `cmp.purchaseOrder.cancelled` libera el remanente en M14. |
| RF-CMP-057 | Publicar el compromiso de fondos al aprobar la OC (`cmp.purchaseOrder.approved`) con importe, moneda, fecha estimada de pago, servicio y centro de costo. | AGR-028; M14 RF-TES-156 | Estándar | O8 | A validar (PA-CMP-09) | El informe distingue comprometido, devengado y pagado. |
| RF-CMP-058 | Al importar ítems de OC en remito o factura, copiar el motivo de compra a observaciones (P2647) y tomar el % de IVA del documento origen (P2690/P2791) o el del producto. | RN-09 2647, 2690, 2791; RN-08 §15.3 | Estándar | O8 | Informado | La alícuota tomada se muestra y puede corregirse con permiso. |
| RF-CMP-059 | Listar OC pendientes de aprobación, incluidas las de proveedores "paga a otros". | RN-08 §7.4 (`GetPendientesAutorizar`) | Estándar | O8 | Informado | La bandeja de aprobación muestra solo las de la banda del usuario. |

### 5.6 Recepción y remito de proveedor

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CMP-060 | Registrar la recepción (remito del proveedor) contra una o varias OC aprobadas, por cantidades parciales, con número del proveedor cuando el comprobante informa impuestos, depósito/destino, series y lotes (capturados en M13), receptor y fecha. | CAT `COMP_COM`, `IT_COMPC`; RN-08 §7.5; BASE §19 "Registrar entregas parciales"; CU-19 | Núcleo | O8 | Informado | CU-19: OC de 10, recepción de 6 → OC `partiallyReceived` con 4 pendientes. |
| RF-CMP-061 | La recepción **no mueve stock en M12**: publica `cmp.receipt.confirmed` y M13 registra el ingreso físico; si M13 rechaza (depósito, serie), la recepción queda `stockPending` con alerta. | RN-08 §7.5 (el remito mueve stock); BASE §78; AGR-026 | Núcleo | O8 | Reemplazado por evento a M13 (CTR-CMP-05) | Ningún documento de M12 escribe movimientos de stock. |
| RF-CMP-062 | Conformidad de servicios sin recepción material (mantenimiento, honorarios): el responsable del servicio registra la conformidad total o parcial. | AGR-027 ("servicios sin recepción material") | Estándar | O8 | Adoptado | Una factura de servicio sin conformidad queda retenida. |
| RF-CMP-063 | Excesos de entrega: aceptar hasta la tolerancia configurada; por encima, rechazar o pedir aprobación. | AGR-027 ("excesos") | Estándar | O8 | Adoptado | Con tolerancia 0 %, recibir 11 de 10 exige aprobación. |
| RF-CMP-064 | Devoluciones al proveedor: remito de devolución que reabre o reduce el pendiente de la OC, solicita a M13 la salida y espera NC del proveedor. | BASE §19 "Administrar devoluciones"; RN-09 2791 (remito de devolución) | Estándar | O8 | Informado | La devolución queda vinculada a la NC cuando llega. |
| RF-CMP-065 | Opciones de carga: mostrar solo OC al importar ítems en remitos (P2649), no pedir depósito para productos sin stock (P2560), avisar si el producto no controla stock (P2989), cargar ítem "pendiente" (recibido sin ingreso) por defecto si controla stock (P3030), ofrecer imprimir etiquetas (P3071, vía M13). | RN-09 2560, 2649, 2989, 3030, 3071 | Estándar | O8 | Informado | Cada opción es configurable y se documenta en la ayuda. |
| RF-CMP-066 | Cantidades con hasta los decimales de la unidad de medida del producto; la opción de 4 decimales para productos con stock (P2691) se reemplaza por la precisión de la unidad. | RN-09 2691 (genera inconsistencias); AGR-011 | Estándar | O8 | Reemplazado (CTR-CMP-18) | Una unidad "unidad" admite 0 decimales; "metro", hasta 3. |
| RF-CMP-067 | Registro simplificado de ingreso de equipos serializados del piloto (OC opcional, proveedor del padrón mínimo, series). | CU-OPE-01; BASE §101 | Núcleo | O3 | A validar (PA-CMP-01) | OC-DEMO-002: 2 módems, series registradas en M13. |

### 5.7 Comprobantes de proveedor

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CMP-070 | Registrar facturas, ND, NC, tickets y recibos de proveedor: tipo, punto de venta, número, fecha, fecha contable, vencimiento(s), moneda/cotización, CAE/CAI, netos gravados por alícuota, no gravado, exento, IVA por alícuota, percepciones (IVA, IIBB por jurisdicción), impuestos internos, otros tributos, total; ítems de producto o concepto con cantidad, precio, IVA, rubro, servicio, centro de costo, OT/obra, unidad de gasto. | CAT `IVACOM` (47 columnas), `FPITEMS`, `FPALIC_IVA`; RN-08 §7.6 | Núcleo | O8 | Informado | El total = gravado + no gravado + exento + IVA + percepciones + impuestos + otros. |
| RF-CMP-071 | Validaciones al registrar: proveedor, tipo, punto y número obligatorios; año razonable; período abierto de Compras, Stock y Contable; sin precios en cero; tipo permitido para la condición de IVA del proveedor (bloqueo o advertencia con P2365); no duplicado (proveedor + tipo + punto + número); fecha no posterior al mes actual (P3067). | RN-08 §7.6 `Validar`, §15.3 `ComprobanteExiste`; RN-09 2365, 3067 | Núcleo | O8 | Informado | Un comprobante duplicado devuelve `cmp/duplicate-invoice` con enlace al existente. |
| RF-CMP-072 | Diferencia admitida entre el total y la suma de componentes y entre cabecera e ítems: hasta P2057 (default ARS 0,50); controles de IVA de cabecera vs ítems y de cada ítem recalculado con su alícuota. | RN-08 §7.6, §15.3 (`Get_Diferencias`, `ValidarNeto`); RN-09 2057 | Núcleo | O8 | Informado | Una diferencia de ARS 0,60 con límite 0,50 impide registrar. |
| RF-CMP-073 | Consultar CAE/CAI del comprobante en ARCA (M06) al cargar (P2977) y advertir si no existe. | RN-09 2977; M06 RF-FIS-124 | Estándar | O8 | Informado | Un CAE inexistente queda con advertencia visible. |
| RF-CMP-074 | Autocompletar fecha contable y vencimiento (P2388) con vencimiento por defecto (P2026 → días desde fecha); fecha contable en período abierto (P580 reemplazado por períodos). | RN-09 580, 2026, 2388 | Estándar | O8 | Informado | La fecha contable propuesta pertenece a un período abierto. |
| RF-CMP-075 | Descuento global como ítem negativo del concepto configurado (P2403, obligatorio si se usan descuentos). | RN-08 §7.6; RN-09 2403 | Estándar | O8 | Informado | Sin concepto configurado, el descuento global no se habilita. |
| RF-CMP-076 | Importar ítems desde OC y/o recepciones (pendientes), y también facturar antes de recibir (factura anticipada: luego la recepción consume el pendiente de la factura, relación 5 → 4). | RN-08 §15.3 (`COMPRAS_RELACION` 5 → 4); AGR-027 ("factura anticipada") | Núcleo | O8 | Informado | La factura anticipada queda retenida para pago hasta la recepción (§9.3). |
| RF-CMP-077 | Actualización del costo de compra del producto al registrar (salvo P264), preguntando antes si P426, usando el precio unitario neto del comprobante; registro del costo anterior. La valorización de stock es de M13 y **no** se reescribe el costo histórico de recepciones. | RN-08 §7.6 (promedio ponderado reescribe remito), §15.3 (`GetLstProductos_Actualizar`); RN-09 264, 426; AGR-026 | Estándar | O8 | Adoptado (CTR-CMP-09) | M13 recibe el costo facturado como ajuste de costo, no como reescritura del movimiento. |
| RF-CMP-078 | Registrar observación obligatoria al modificar un concepto en un comprobante (P2533) e historial de cambios. | RN-09 2533 | Estándar | O8 | Informado | La modificación muestra valor anterior y nuevo. |
| RF-CMP-079 | Imputación: servicio del cliente en el comprobante (P2277), obra por ítem (P3101), centros de costo y grupos de secciones (P2896) con % de IVA por sección (P2902) y reglas de asignación automática; IVA no tomado como gasto (P2890, efecto en M15/M06). | RN-09 2277, 2890, 2896, 2902, 3101; CAT `CTSECCION*`; BASE §78 | Estándar | O8 | Informado | La distribución por centro de costo suma 100 % del neto. |
| RF-CMP-080 | Rubro de vivienda: si el comprobante es del rubro P2502, sus productos deben ser del rubro P2503. | RN-08 §7.6; RN-09 2502, 2503 | Extensión | O8 | Informado | Un producto de otro rubro se rechaza en ese comprobante. |
| RF-CMP-081 | Comprobantes en cuotas (vencimientos múltiples con periodicidad). | RN-08 §7.6 (`GuardarComp` con periodicidad) | Estándar | O8 | Informado | La suma de vencimientos = total. |
| RF-CMP-082 | Anticipos a proveedores sin factura (concepto P2035, sin rubro si P2017) y su posterior aplicación contra facturas; informar anticipos pendientes al pagar (P2777). | RN-08 §4.2; RN-09 2017, 2035, 2777 | Estándar | O8 | Informado | Un anticipo aplicado reduce el saldo de la factura y queda trazado. |
| RF-CMP-083 | Anular un comprobante: nunca se borra; se marca anulado con motivo si no tiene OP aplicada ni período cerrado; libera vínculos (recepción, portal, IA, combustible) y emite evento de reversión. | RN-08 §7.6 (la anulación borra) | Núcleo | O8 | Reemplazado (CTR-CMP-17) | El comprobante anulado sigue consultable. |
| RF-CMP-084 | Opciones de carga e impresión: consultar si imprimir al registrar (P2424), separar comprobantes en libro IVA por defecto (P832, dato para M06), informe de libro IVA compras personalizado (P382, en M06), informe particularizado de retenciones en IVA compras (P406, en M06). | RN-09 382, 406, 832, 2424 | Estándar | O8 | Informado | P832 se guarda en el comprobante y M06 lo respeta. |
| RF-CMP-085 | Comprobantes de compra de energía y otros insumos regulados, disponibles para M03/M06 (balance energético, informes a reguladores). | M06 §2 (FACT_EPEC, FIC 9.3) | Estándar | O8 | Informado | El comprobante marcado "compra de energía" es consultable por M03. Detalle del circuito de energía y gas en RF-CMP-149…153 (HUE-ELE-01, HUE-GAS-04). |
| RF-CMP-086 | Integración con sueldos: comprobantes de proveedores-empleado y recibos pagados por OP (P2366) se informan a M16 sin que M12 genere novedades. | RN-09 2366; RN-08 §4.4 | Estándar | O9 | A validar (PA-CMP-12) | Con integración activa, M16 recibe el evento de pago. |

### 5.8 Control de 3 vías y habilitación de pago

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CMP-090 | Conciliar automáticamente cada línea de factura con OC y recepción: cantidad facturada ≤ cantidad recibida (o conformada) + tolerancia; precio facturado = precio de OC ± tolerancia (porcentaje y monto); condiciones (moneda, plazo) iguales. | DFA M16 "Control de 3 vías"; AGR-027; BASE §19 "Controlar diferencias de cantidades y precios" | Núcleo | O8 | A validar (PA-CMP-04) | AGR-027: pedidos 10, recibidos 6, facturados 10 → excepción de cantidad por 4 y pago habilitado solo por 6 o bloqueado según política. |
| RF-CMP-091 | Crear una excepción por cada diferencia fuera de tolerancia con tipo (cantidad, precio, condición, sin OC, sin recepción), importe en disputa, causa y decisión (aceptar, reclamar NC, rechazar) aprobada por T11. | AGR-027 ("cada diferencia está aprobada o pendiente con causa"); CU-19 Excepción | Núcleo | O8 | Adoptado | Ninguna factura con excepción abierta se incluye en una OP. |
| RF-CMP-092 | Habilitación de pago: automática si la factura concilia sin excepciones abiertas; manual con capability `cmp.pago.habilitar` y motivo en los demás casos. Reemplaza P2201/P2457 ("pago autorizado / no autorizado / autorizar mayores a monto"). | RN-08 §4.1, §15.3 (`ActualizarPermitirPago` sin permisos); RN-09 2201, 2457 | Núcleo | O8 | A validar (PA-CMP-15) | Habilitar sin permiso devuelve 403. |
| RF-CMP-093 | Compras sin OC: permitidas solo para categorías definidas (servicios públicos, impuestos, caja chica, gastos menores a un umbral), con aprobación posterior; informe de facturas sin OC. | RN-08 §7.1 ("el circuito no es obligatorio"), §15.3 (`GetComprobanteSinOrdenes`); AGR-027 ("tratamiento de compras sin orden previa") | Núcleo | O8 | A validar (PA-CMP-07) | Una factura sin OC fuera de las categorías crea excepción `withoutPO`. |
| RF-CMP-094 | Tablero de conciliación: facturas conciliadas, con excepción, retenidas, habilitadas; recepciones sin factura (pendientes de facturar) y facturas sin recepción. | AGR-027; BASE §80 (reportes de conciliación) | Estándar | O8 | Adoptado | El tablero cuadra con el saldo de proveedores a la fecha de corte. |

### 5.9 Órdenes de pago

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CMP-100 | Preparar la OP: proveedor (o proveedor "paga a otros" con comprobantes de otros proveedores), selección de comprobantes habilitados con saldo (pago total o parcial), NC y anticipos a aplicar, anticipos nuevos sin factura, descuento, fecha de pago, fecha estimada de ejecución, nombre particularizado del beneficiario (P1029). | RN-08 §4.1–4.2, §15.3 (`GetPendientesDePago`); RN-09 1029; BASE §19 "Preparar pagos" | Núcleo | O8 | Informado | El importe aplicado a una factura no supera su saldo. |
| RF-CMP-101 | Calcular las retenciones invocando el motor de M06 (`fis.service.calculateWithholdings`, antes `fis.withholding.calculate`) con proveedor, comprobantes, componentes, formalidad, anticipos y fecha; mostrar por régimen base, mínimo, escala, acumulado del período, retenido previo e importe, y el **neto a pagar**. | RN-08 §3; BASE §61; CU-FIS-01; M06 §9.8 | Núcleo | O8 | Informado | CU-FIS-01: base 100.000, retención 2.000, neto 98.000. |
| RF-CMP-102 | Habilitación por régimen (P2037 IIBB, P2039 IVA, P2041 Ganancias, P2043 SUSS), no retener en comprobantes no formales (P410), IVA presunto en anticipos y comprobantes sin IVA discriminado (P2310), no retener en anticipos (P409), código de régimen obligatorio (P2813): parámetros del motor de M06 que M12 respeta y muestra. | RN-09 409, 410, 2037, 2039, 2041, 2043, 2310, 2813 | Núcleo | O8 | Informado | Con P2041 desactivado no se propone retención de Ganancias. |
| RF-CMP-103 | Ajuste manual de una retención (P2836) solo con capability `cmp.retenciones.ajustar`, motivo y aprobación; queda el valor calculado y el ajustado. | RN-09 2836 | Estándar | O8 | A validar (PA-CMP-06) | Un ajuste sin motivo se rechaza. |
| RF-CMP-104 | Aprobar la OP por bandas T11 y segregación; al aprobar: M06 confirma retenciones y numera certificados; M12 publica `cmp.paymentOrder.approved` con bruto, retenciones, neto, CBU validado y vencimiento para que M14 ejecute (medios, firmas, entrega, archivo bancario). | M14 §2; RN-08 §4.3; DFA M16 (Interbanking) | Núcleo | O8 | Informado | Una OP no aprobada no aparece en la bandeja de M14. |
| RF-CMP-105 | Certificados de retención: imprimir/enviar automáticamente al aprobar por régimen (P2038, P2040, P2042, P2044), con punto de venta de IIBB (P2012) y fecha de información según día límite (P2045), generados por M06. | RN-08 §3.3–3.4; RN-09 2012, 2038, 2040, 2042, 2044, 2045 | Estándar | O8 | Informado | El certificado se envía al proveedor por mail/portal. |
| RF-CMP-106 | Al recibir `tes.paymentExecution.executed`, marcar la OP pagada, cancelar saldos y actualizar la cuenta corriente; con `tes.paymentExecution.voided` o anulación de la OP, reponer saldos, anular anticipos generados (si su contraparte no fue aplicada en otra OP) y pedir a M06 anular las retenciones (estado anulado, no borrado). | RN-08 §4.4; M14 RF-TES-120 | Núcleo | O8 | Informado | La anulación nunca borra registros; repone exactamente los saldos aplicados. |
| RF-CMP-107 | El saldo de la factura se reduce al aprobar la OP (comprometido para pago) y se considera cancelado al ejecutarse; no se pisa el vencimiento original. | RN-08 §4.2 (pisa `VENCE1` con hoy) | Núcleo | O8 | Adoptado | El informe de antigüedad usa el vencimiento original. |
| RF-CMP-108 | Opciones de OP: imprimir al emitir (P2018), mostrar asiento contable propuesto (P2308, desde M15), permitir modificar la fecha de la OP (P2572), pagar facturas con fecha contable posterior al pago (P110), plantilla para envío masivo de OP a proveedores (P2418), firmantes impresos y datos de autoridades en documentos (P2372, P2020–P2024, datos de la empresa en T01). | RN-09 110, 2018, 2020–2024, 2308, 2372, 2418, 2572 | Estándar | O8 | Informado | El envío masivo usa la plantilla configurada. |
| RF-CMP-109 | Adelantos de sueldo a empleados (concepto P2034, tipo de novedad P2538) no se gestionan como OP de compras: se derivan a M16. | RN-08 §4.2; RN-09 2034, 2538 | Estándar | O9 | A validar (PA-CMP-12) | Una OP a un proveedor-empleado con concepto de adelanto se rechaza con enlace a M16. |
| RF-CMP-110 | Pagos de recibos de sueldo mediante OP solo si M16 lo solicita (lote aprobado); M12 no borra facturas de sueldo al anular. | RN-08 §4.4 | Estándar | O9 | A validar (PA-CMP-12) | La anulación avisa a M16 en lugar de borrar. |
| RF-CMP-111 | Consultar pagos pendientes de salida (efectivo pendiente de caja), pagos diferidos y estado de ejecución informado por M14. | RN-08 §15.3 (`PagosEnEfectivoPendientes`, `PagosDiferidos`) | Estándar | O8 | Informado | El informe se abre por medio con fila de total. |
| RF-CMP-112 | Portal de proveedores: el proveedor ve OC, estado de sus comprobantes (pendiente, registrado, rechazado con motivo, habilitado, en pago, pagado) y descarga certificados de retención y comprobantes de pago. | RN-08 §15.3 (`ObtenerEstadoComprobante`, estado "A" ambiguo); M14 RF-TES-125 | Estándar | O8 | A validar (PA-CMP-05) | Los estados se derivan de §8, sin la ambigüedad del estado "A". |

### 5.10 Importación de Mis Comprobantes, portal e IA

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CMP-120 | Recibir de M06 los comprobantes recibidos que figuran en Mis Comprobantes de ARCA y no están registrados en M12, y crear **borradores** de comprobante de proveedor (proveedor por CUIT, tipo, punto, número, fecha, importes por alícuota) para revisión y confirmación por una persona. | DFA M16 mejora; FIC 2.4 (`Get_Informe_ComprobantesNoProcoop`); M06 RF-FIS-122 | Estándar | O8 | A validar (PA-CMP-10) | Un comprobante importado nunca queda registrado sin confirmación humana. |
| RF-CMP-121 | Informe de diferencias entre compras registradas y Mis Comprobantes (faltantes, sobrantes, importes distintos), con acceso al borrador o al registrado. | FIC 2.4 (`Comparar_LibroCompras`); M06 §9.10 | Estándar | O8 | Informado | El informe cuadra con la conciliación de M06 del mismo período. |
| RF-CMP-122 | Recibir comprobantes cargados por el proveedor en el portal (datos + PDF), rechazar duplicados (CUIT + tipo + punto + número), revisar y registrar o rechazar con motivo. | CAT `IVACOM_WEB`; RN-08 §4.1, §15.3 (`GuardarProveedorYAdjunto`, `GuardarMotivoRechazo`) | Estándar | O8 | Informado | El proveedor ve el motivo del rechazo. |
| RF-CMP-130 | Lectura de facturas de proveedor (PDF/imagen) con IA: extrae cabecera, importes y alícuotas, distingue a la cooperativa (CUIT y razón social del tenant, P518/P519) del emisor, propone proveedor, ítems e imputación; una persona revisa, corrige y confirma. | FIC 20 (`clsLeerComprobante`); RN-08 §7.6, §15.3 (`GetImgFromPDF`); RN-09 518, 519 | Extensión | O11 | A validar (PA-CMP-11) | La propuesta muestra la confianza por campo; nada se registra sin confirmación. |
| RF-CMP-131 | Auditoría de cada uso de IA (tipo, documento, modelo, tokens, usuario, resultado aceptado/corregido) sin guardar datos personales innecesarios; activación por tenant con acuerdo de tratamiento de datos. La auditoría por persona es `auditAi` de T02 y el consumo `aiUsage` de T01; M12 guarda solo el resultado de la extracción en `aiInvoiceExtractions` (CTR-DAT-04). | CAT `AUDIT_IA`; T08 | Extensión | O11 | A validar (PA-CMP-11) | El tenant ve el consumo y la tasa de corrección. |

### 5.11 Informes y transversales

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CMP-140 | Informes de compras (sección 15): SA por estado y aprobación, cotizaciones y comparativos, OC pendientes de recepción, recepciones pendientes de facturar, facturas sin OC, diferencias de comprobantes, cuenta corriente y antigüedad de proveedores, compras por servicio/centro de costo/rubro/proveedor/producto, costo de reposición, previsiones de pagos, pagos pendientes y diferidos, desempeño de proveedores, proveedores alcanzados por regímenes especiales. | RN-08 §15.3 `clsInformes_Compras`; DFA M16 "Informes de Compras"; BASE §80 | Estándar | O8 | Informado | Cada informe declara fórmula, universo y fecha de corte. |
| RF-CMP-141 | Trazabilidad documento a documento por ítem (origen y destino con cantidades y precios) en todos los documentos, no solo en el primer ítem. | CAT `COMPRAS_RELACION`; RN-08 §15.3 (defecto `CargarRelaciones`) | Núcleo | O8 | Adoptado | Cada línea muestra SA, cotización, OC, recepción y factura vinculadas. |
| RF-CMP-142 | Respetar el cierre de períodos de Compras (P500), Stock y Contable mediante la entidad unificada de períodos (T04/M15). | RN-08 §1.1; RN-09 500 | Núcleo | O8 | Adoptado | Un comprobante con fecha contable en período cerrado se rechaza. |
| RF-CMP-143 | Identificadores internos por documento (ObjectId) y numeración legible por tipo y punto; los ID compuestos de ProCoop se conservan como referencia de migración. | RN-08 §1.3 | Núcleo | O8 | Reemplazado (CTR-CMP-13) | No se usan claves concatenadas como identidad. |
| RF-CMP-144 | Integrar el efecto contable en línea (DEC-009): cada comprobante, recepción con pendiente, retención y OP publica su evento con imputación para M15; cuenta de compras por defecto del proveedor (P2112) y cuenta de productos pendientes de entrega (P2162) como configuración contable de M15. | DEC-009; RN-08 §1.2, §6.2; RN-09 2112, 2162, 2548 | Núcleo | O8 | Adoptado (CTR-CMP-08) | Anular un comprobante genera la reversión contable vinculada. |
| RF-CMP-145 | Etiquetas por diccionario, plantillas por tenant, auditoría de todo cambio, aislamiento por tenant en consultas, exportaciones, portal y APIs. | BASE §54, §65; DEC-002 | Núcleo | O8 | Informado | Un proveedor del portal de TEN-001 no ve datos de TEN-002 aunque tenga el mismo CUIT. |
| RF-CMP-146 | Copiar entre tenants la configuración de M12 (conceptos, modalidades, políticas, plantillas), sin proveedores ni operaciones. | BASE §81 | Extensión | O8 | Adoptado | La copia no incluye datos de terceros. |
| RF-CMP-147 | Integración con fabricación: las opciones de partes de producción (P2967, P3043, P3057, P3171) pertenecen a M13; M12 solo recibe SA de fabricación. | RN-09 2967, 3043, 3057, 3171 | Estándar | O8 | Reemplazado por M13 | M12 no ofrece opciones de partes de producción; las SA de fabricación recibidas desde M13 se procesan como cualquier SA con su origen identificado. |
| RF-CMP-148 | Parámetros de caja de pagos y medios (P134, P135, P144, P146, P402, P2000–P2004, P2015, P2016, P2025, P2065, P2079, P2433, P2573, P3044, P2952) pertenecen a M14; M12 los respeta al preparar la OP (por ejemplo, pago diferido solo a rubros que lo admiten). | RN-09 COMPRAS; M14 | Estándar | O8 | Reemplazado por M14 | La OP propone medios compatibles con la configuración de M14. |

### 5.12 Abastecimiento mayorista y derechos de señales

Compras recurrentes de insumos regulados (energía y gas) y de derechos de retransmisión de señales de TV. Amplían RF-CMP-085: M12 es dueño del comprobante del proveedor y de su control; M03 es dueño de la medición de compra o frontera; M15 registra el costo.

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CMP-149 | Recibir la factura mensual del mayorista de energía (EPEC u otro mayorista configurado) por archivo (FI-INT-33) o carga manual, como comprobante de proveedor con `wholesaleSupply.kind = energy` y detalle por punto de compra o frontera: período, energía activa por banda horaria, energía reactiva, potencia registrada y contratada, cargos fijos, cargos de transporte y tributos. | HUE-ELE-01; RF-CMP-085; T06 FI-INT-33; M06 §2 (FACT_EPEC) | Núcleo | O8 | Adoptado | Importar dos veces el mismo archivo no duplica el comprobante (idempotencia por proveedor + tipo + punto de venta + número); cada renglón queda vinculado a un `meteringPointId` de M03 o falla con `cmp/supply-point-unknown`. |
| RF-CMP-150 | Controlar cada renglón de la factura mayorista contra la medición propia del mismo punto y período de M03 (puntos `purchase`/`boundary`, RF-MED-012, RF-MED-100), obtenida con API-MED-78 `GET /api/admin/med/purchase-volumes` (RF-MED-129) por servicio, período y proveedor; los volúmenes que M03 devuelve como no validados generan `meteringMissing` hasta su validación: cantidad facturada contra medida y potencia facturada contra registrada; una diferencia fuera de tolerancia (PRM-CMP-113, PRM-CMP-114) crea una excepción `meteringMismatch` y retiene la habilitación de pago hasta la decisión (aceptar, reclamar NC/ND, rechazar). | HUE-ELE-01; HUE-GAS-04; RF-MED-012; RF-MED-129; API-MED-78; AGR-027 | Núcleo | O8 | Adoptado | Con tolerancia 1 %, factura de 100.000 kWh y medición propia de 98.000 kWh, se crea la excepción por 2.000 kWh y el comprobante queda `paymentRelease = blocked`; sin medición propia del período, la excepción es `meteringMissing`. |
| RF-CMP-151 | Balance mensual comprado contra facturado por servicio y zona: cantidad comprada (facturas mayoristas aprobadas), cantidad medida en frontera (M03, API-MED-78 / RF-MED-129), cantidad facturada a usuarios del mismo período (consumos facturados de M05 por servicio), diferencia y porcentaje de pérdida; el balance aprobado se publica como EVT-CMP-16. | HUE-ELE-01; HUE-GAS-04; RF-MED-101; RN-CON-069 | Estándar | O8 | Adoptado | Comprado 100.000 kWh y facturado 91.000 kWh → pérdida 9.000 kWh (9 %); el balance usa la misma fecha de corte que el informe de pérdidas de M03 y no modifica tarifas (RN-TAR-227). |
| RF-CMP-152 | Recibir la factura de la distribuidora de gas (archivo FI-INT-115 de T06 o carga manual) con `wholesaleSupply.kind = gas`: m³ por punto de compra, poder calorífico o factor de corrección informado, cargos fijos, transporte y tributos; aplicar el control de RF-CMP-150 y el balance de RF-CMP-151. **Corregido (DEC-085):** M03 expone m³ medidos **sin corregir** (API-MED-78) y la corrección de volumen la hace M04 (RN-TAR-035); el control compara los m³ sin corregir facturados contra los medidos y, por separado, el factor de corrección de la factura contra el factor vigente de M04 para el período (`gasCalorificFactors`, CTR-DAT-33) (~~control con m³ corregidos de M03~~). El factor lo aplica solo M04; `meteringPoints.gasCorrectionCoefficient` de M03 es únicamente el coeficiente corrector del punto y no se compara con el factor de la factura. | HUE-GAS-04; RF-CMP-085; DEC-085; RN-TAR-035; T06 FI-INT-115; CTR-DAT-33 | Núcleo | O8 | Adoptado | Una factura de gas con factor de corrección distinto del vigente en M04 genera excepción `meteringMismatch` aunque los m³ sin corregir coincidan con los de M03. |
| RF-CMP-153 | Publicar el registro del comprobante mayorista (EVT-CMP-08) con `supplyKind` y rol de costo de abastecimiento para que M15 registre el costo por servicio (RN-CON-069); nunca se genera un cargo o recargo al usuario desde M12. | HUE-ELE-01; HUE-GAS-04; RN-CON-069; DEC-009 | Núcleo | O8 | Adoptado | El asiento de una factura mayorista imputa costo de abastecimiento del servicio ELE o GAS; anular el comprobante genera la reversión vinculada. |
| RF-CMP-154 | Contratos de derechos de señales de TV por programadora: señales o paquetes alcanzados, precio por abonado activo, mínimo garantizado, moneda, vigencia y base de cómputo (PRM-CMP-115). | HUE-TV-01; M02 6.C.3 | Estándar | O10 | Adoptado | No se puede liquidar un período sin contrato vigente para la programadora. |
| RF-CMP-155 | Liquidación mensual de derechos de señales (JOB-CMP-09): por programadora y paquete, cantidad de abonados activos según el informe de abonados activos por paquete de M02 a la fecha de corte (RF-CAT-116, API-CAT-56 `GET /api/admin/cat/reports/active-subscribers-by-package`), × precio por abonado, con el mínimo garantizado; genera la declaración para la programadora (exportable), queda en aprobación y, aprobada, publica EVT-CMP-17 para el devengamiento del costo en M15. La factura posterior de la programadora se concilia contra la liquidación (cantidad declarada contra facturada). | HUE-TV-01; AGR-027; RF-CAT-116; API-CAT-56 | Estándar | O10 | Adoptado | Con 1.200 abonados del paquete básico a ARS 150 y mínimo ARS 150.000, la liquidación es ARS 180.000; con 800 abonados es ARS 150.000 (mínimo). Una factura por 1.250 abonados genera excepción de cantidad por 50. |

## 6. Reglas de negocio

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-CMP-001 | El proveedor es un rol de una persona de M01: `personId` obligatorio y único por tenant (una sola ficha de proveedor por persona); la CUIT, la razón social, la condición de IVA, los domicilios y los contactos son datos de la persona, y su unicidad y verificación las controla M01 (RN-PER-005, RN-PER-135); la condición de IVA de la persona es obligatoria para operar como proveedor; un proveedor bloqueado no recibe OC ni OP. *Reemplazado (10-11-2026, DEC-097): "CUIT único por tenant; condición de IVA obligatoria; un proveedor bloqueado no recibe OC ni OP." Con ese texto la CUIT se controlaba dentro de `suppliers`, que guardaba su propia identidad, de modo que un socio contratista quedaba en dos fichas (persona en M01 y proveedor en M12).* | `PROVEED` con `COD_PROV` numérico, nombre, CUIT, situación IVA y domicilio propios, separado de `PERSONAS`. | Reemplazar (DEC-097; CTR-CMP-22) | — | — |
| RN-CMP-002 | Rubro de proveedor obligatorio salvo configuración; cuenta contable obligatoria si se exige. | P2017 (`clsProveedor.CrearProveedor`), P3068 (`abm_Proveed`). | Replicar | P2017, P3068 | — |
| RN-CMP-003 | Validación contra padrón ARCA al alta/modificación si está activa. | P218 (`ctrCuit.Validar`). | Replicar (vía M06) | P218 | — |
| RN-CMP-004 | Alta o cambio de CBU requiere aprobación de un usuario distinto del que lo cargó; la OP solo usa CBU aprobados. | CBU editable sin control. | Mejorar | — | — |
| RN-CMP-005 | "Paga a otros": sus OP pueden aplicar comprobantes de otros proveedores y se listan juntas. | `PERPAGOTROS` (P2019; `GetPendientesDePago`, `GetPendientesAutorizar`). | Replicar con auditoría del beneficiario real | P2019 | — |
| RN-CMP-006 | Proveedores-empleado ocultos sin capability. | P2653/P2709 + `frm_Su_Sueldo`. | Replicar | P2653, P2709 | — |
| RN-CMP-007 | La SA nace en borrador; al enviarse pasa a aprobación salvo política "sin aprobación" para el monto/área. Nunca se autoaprueba al procesar. | Autoautorizada si el usuario tiene `autoriz_sa` y P2640 desactivado; `Procesar` autoriza implícitamente. | Corregir (CTR-CMP-06) | P2640 → política T11 | — |
| RN-CMP-008 | Doble aprobación: dos usuarios distintos; el segundo no puede ser el primero ni el solicitante. | `DOBLE_AUTO` con `USU_AUTO2`/`USU_AUTO`. | Replicar | P2867 | — |
| RN-CMP-009 | Vigencia de SA: pendientes = fecha ≥ hoy − vigencia. | Compara `FECHA − hoy ≤ vigencia` (sin efecto). | Corregir | P2036 | — |
| RN-CMP-010 | Una SA con ítems procesados no se elimina; se anula o descarta. | `elimina_sa` exige ningún ítem procesado. | Replicar (sin borrado físico) | — | — |
| RN-CMP-011 | Permisos de SA unificados (`autoriz_sa` y `autoriza_sa` son el mismo concepto). | `Descartar`/`MarcarPendiente` validan `autoriza_sa`. | Corregir | — | Confirmar si ambos permisos existen |
| RN-CMP-012 | Búsqueda de pedido abierto: SA con el ítem sin recibir; si no, OC con saldo > 0 (productos y conceptos). | Para conceptos usa saldo = 0 (invertida). | Corregir | — | — |
| RN-CMP-013 | Estados de SA derivados: Pendiente, En proceso (compras la tomó), Procesada (algún ítem recibido), Anulada/Rechazada. | `GetEstadoSolicitud`; `ESTADO = 'A'` mezcla anulada y rechazada. | Mejorar (estados separados) | — | — |
| RN-CMP-014 | Importar pendientes: solicitado y recibido se firman según débito/crédito; costo neto = precio si el IVA estaba discriminado, si no `precio / (1 + %IVA/100)` a 6 decimales. | `GetRem_Pendientes`, `GetNP_Pendientes`, `GetFPITEM_Pendientes`. | Replicar | — | — |
| RN-CMP-015 | Alícuota al importar: la del documento origen si P2690/P2791; si no, la del producto. | Idem. | Replicar | P2690, P2791 | Confirmar prioridad exacta |
| RN-CMP-016 | Documentos importables: OC aprobadas no canceladas ni cerradas; cotizaciones no rechazadas. | OC no `A`, no `C`, no bloqueadas; cotización no `R`. | Replicar | — | — |
| RN-CMP-017 | Toda importación registra el vínculo ítem origen → ítem destino con cantidad y descuenta el pendiente del origen; deshacer devuelve la cantidad exacta (con decimales). | `COMPRAS_RELACION`; `RestaurarPendientes` trunca a entero. | Replicar + corregir | — | — |
| RN-CMP-018 | Cotizaciones: una por proveedor, agrupadas; vencimiento por defecto 15 días. | `clsSCotiz.Alta`. | Replicar parametrizable | `cmp.quote.defaultValidityDays` | — |
| RN-CMP-019 | Estado de cotización: cotizada si todos los ítems tienen costo ≠ 0; evaluada si ningún ítem sin evaluar; procesada si algún ítem con pendiente 0. | `Cotizada`, `SolicitudEvaluada`, `SolicitudProcesada`. | Replicar | — | — |
| RN-CMP-020 | Comparativo solo entre cotizaciones hermanas de la misma SA con precio cargado y sin evaluar (o contratadas si se reevalúa). | `getCotizadasCompletas`. | Replicar | — | — |
| RN-CMP-021 | Evaluación: ítem contratado o descartado; si se cambia la cantidad, se ajusta cantidad y pendiente. | `EvaluarCotizacion`. | Replicar | — | — |
| RN-CMP-022 | IVA de la cotización calculado con la situación de IVA de la cooperativa. | P527 (`GetDetallesACotizar`). | Replicar | P527 | Confirmar uso |
| RN-CMP-023 | Concursos y licitaciones: numeración correlativa por modalidad; ofertas selladas hasta la apertura. | Tipos 1–4 con número correlativo. | Replicar + mejorar | — | — |
| RN-CMP-024 | Aprobación de OC por bandas de monto; sin aprobación no se envía, no se recibe ni se importa. | P2377 = 2 y total ≥ P2382 → `BLOQUEADA`; `AutorizarOrdenesCompras` sin permiso. | Reemplazar (T11, CTR-CMP-06) | P2377, P2382 | — |
| RN-CMP-025 | OC visible para el proveedor en el portal: aprobada, no cancelada ni cerrada. | `GetOrdenesAutorizadas` exige además sin ítems recibidos. | Mejorar (también con recepciones parciales) | — | — |
| RN-CMP-026 | Compra compartida: una sola OC con distribución explícita por servicio/centro que suma 100 %; los informes por servicio usan la distribución y el total no se duplica. | — | Mejorar (BASE §78, §80) | — | — |
| RN-CMP-027 | La recepción no mueve stock en M12; el ingreso físico lo confirma M13. | El remito mueve stock; la factura también si P583 desactivado. | Reemplazar (CTR-CMP-05) | P583 | — |
| RN-CMP-028 | Remito con número del proveedor si el comprobante informa impuestos; si no, numeración propia. | `INF_IMPOS`. | Replicar | — | — |
| RN-CMP-029 | No se elimina un ítem de remito ya facturado; un remito facturado totalmente queda cerrado. | `SAL_CANPRO`, estado "F". | Replicar | — | — |
| RN-CMP-030 | Factura anticipada: la recepción posterior consume el pendiente de la factura (5 → 4) y cierra su saldo. | `clsIvaCom.Procesar`. | Replicar | — | — |
| RN-CMP-031 | Ítem "pendiente" (recibido sin ingreso a stock): pasar de pendiente a recibido genera ingreso; de recibido a pendiente exige ajuste de M13 (no manual sin rastro). | `ValidarItemAnterior` avisa ajuste manual. | Mejorar | P3030 | — |
| RN-CMP-032 | Ítems de remito sin precio toman el costo de la factura vinculada como ajuste de costo en M13, sin reescribir el movimiento histórico. | P2162 ≠ 0 → toma costo; promedio ponderado reescribe el precio del remito (`ModificaPrecioStock_Remito`). | Reemplazar (AGR-026, CTR-CMP-09) | P2162 | — |
| RN-CMP-033 | Validaciones de comprobante: obligatorios, año 1997–2050 reemplazado por rango razonable configurable, períodos abiertos, sin precio 0, tipo permitido por condición IVA (bloqueo o advertencia), no duplicado. | `frmComprobantes_Handler.Validar`, `EmiteComprobante`, `NoExiste`. | Replicar | P2365 | — |
| RN-CMP-034 | Diferencia total vs componentes ≤ P2057 (default 0,50). | Fijo $0,50 en código; P2057 sin uso directo. | Replicar parametrizable | P2057 | — |
| RN-CMP-035 | Total = gravado + no gravado + retenciones + percepciones + impuestos + otros créditos + IVA; alícuotas reagrupadas por porcentaje. | `ActualizarTotal`, `RecalcularAlicuotas`. | Replicar | — | — |
| RN-CMP-036 | Control del neto con descuento global: recalcular aplicando el % de descuento a gravado, no gravado e IVA excluyendo el ítem de descuento. | `ValidarNeto`. | Replicar | P2403 | — |
| RN-CMP-037 | Importar más cantidad que la pendiente de la OC pide confirmación y genera excepción de cantidad. | Confirmación simple. | Mejorar (AGR-027) | — | — |
| RN-CMP-038 | Actualización de costo: si no P264, el costo del producto se actualiza con el mayor precio unitario del comprobante (preguntando si P426); costo anterior guardado. | `GetLstProductos_Actualizar`; P264, P426. | Replicar | P264, P426 | — |
| RN-CMP-039 | Descuento global como ítem negativo del concepto P2403 (obligatorio configurarlo). | `AddFPItem`. | Replicar | P2403 | — |
| RN-CMP-040 | Rubro vivienda P2502 exige productos del rubro P2503. | `Validar`. | Replicar | P2502, P2503 | — |
| RN-CMP-041 | La anulación de un comprobante no lo borra; exige que no tenga OP aplicada y período abierto; libera bienes de uso, combustibles, envío web e IA vinculados. | Borra la factura. | Reemplazar (CTR-CMP-17) | — | — |
| RN-CMP-042 | Comprobantes del portal: único por CUIT + tipo + punto + número; pendiente = sin factura vinculada ni rechazo. | `GuardarProveedorYAdjunto`. | Replicar | — | — |
| RN-CMP-043 | Estado del comprobante para el proveedor derivado de los estados de §8 (pendiente, registrado, rechazado, habilitado, en pago, pagado). | "Pago autorizado" si la factura tiene `ESTADO = 'A'` (ambiguo). | Reemplazar (CTR-CMP-16) | — | — |
| RN-CMP-044 | Control de 3 vías por línea: cantidad facturada acumulada ≤ recibida/conformada acumulada × (1 + tolerancia de cantidad); \|precio factura − precio OC\| ≤ máx(tolerancia %, tolerancia monto). | — | Mejorar (AGR-027) | `cmp.match.*` | — |
| RN-CMP-045 | Con excepción abierta, la factura no se habilita para pago; con política "pagar lo conciliado", solo se habilita el importe conciliado. | — | Mejorar | `cmp.match.partialRelease` | — |
| RN-CMP-046 | Habilitación de pago: automática solo por conciliación; manual con capability y motivo. | P2201 (1 todas, 2 ninguna, 3 hasta P2457) y `Admin_FA_PerPago`; `ActualizarPermitirPago` sin permisos. | Reemplazar | P2201, P2457 | — |
| RN-CMP-047 | Compras sin OC solo en categorías habilitadas; el resto genera excepción. | Circuito no obligatorio. | Reemplazar (AGR-027) | `cmp.noPoCategories` | — |
| RN-CMP-048 | Facturas pendientes de pago: saldo ≠ 0, habilitadas, sin excepción abierta, no anuladas. | `GetPendientesDePago`: saldo ≠ 0 y estado vacío. | Mejorar | — | — |
| RN-CMP-049 | En la OP, cada aplicación ≤ saldo; saldo < 0,01 se considera cancelado. | `ProcesarDetallesOP`. | Replicar | — | — |
| RN-CMP-050 | No se pisa el vencimiento de la factura al pagar. | Pisa `VENCE1` con la fecha de hoy. | Corregir | — | — |
| RN-CMP-051 | Anticipo sin factura: comprobante de anticipo (concepto P2035) que suma y contraparte que resta al aplicarse; requiere ambos tipos de comprobante configurados. | `GenerarCmpAnticipo`; `clsIvaCom.cs:175-189`. | Replicar | P2035 | — |
| RN-CMP-052 | Adelanto de sueldo a empleado: no se registra en M12; se deriva a M16. | P2034 genera novedad de sueldos (P2538) desde la OP. | Reemplazar (PA-CMP-12) | P2034, P2538 | — |
| RN-CMP-053 | Retenciones: M12 no calcula; envía a M06 y muestra base, mínimo, escala, acumulado, retenido previo e importe; un reintento no genera otra retención. | `Retenciones.cs` invocado por la OP. | Reemplazar (servicio M06, CTR-CMP-07) | P2037–P2045, P410, P2310, P409, P2813 | — |
| RN-CMP-054 | Base imponible (para validar el resultado de M06): por comprobante, solo formales si P410; total o prorrata por pago parcial; por ítem si el tipo es por ítem; IVA presunto `neto = total / (1 + P2310/100)` en comprobantes sin IVA discriminado y anticipos; banderas sumar/restar y factor. | RN-08 §3.2. | Replicar en M06 | P410, P2310 | Significado exacto de P410 y P2310 (RN-08 §14 duda 3) |
| RN-CMP-055 | Importe: escala por tramo con excedente; mínimo no imponible (descontado una sola vez al año si "descuento anual"); acumulación mensual/anual; mínimo de retención; devolución si la base acumulada resulta negativa. | RN-08 §3.3. | Replicar en M06 con escalas versionadas (no crearlas "al vuelo") | — | — |
| RN-CMP-056 | Retención ajustada manualmente: solo con P2836 activo, capability, motivo y aprobación; se guardan calculado y ajustado. | P2836 sin control. | Mejorar | P2836 | — |
| RN-CMP-057 | Numeración de certificados por tipo y punto de venta con reinicio anual (M06); fecha de información en el mes siguiente si el día supera P2045. | `ProcesarRetenciones`; `FEC_INF`. | Replicar en M06 | P2012, P2045 | — |
| RN-CMP-058 | La OP aprobada no se modifica; cambiarla exige cancelarla y crear otra. | Edición posible antes de firmar. | Mejorar | — | — |
| RN-CMP-059 | Anulación de OP: requiere capability; si M14 ya ejecutó, se anula primero la ejecución en M14; repone saldos, anula anticipos (salvo contraparte aplicada en otra OP) y retenciones (estado anulado e importe original conservado). | `Anular` (`Anula_OP`; retenciones con importe 0 y estado `A`). | Mejorar (conserva importes, CTR-CMP-17) | — | — |
| RN-CMP-060 | Firma y entrega de la OP son de M14, con permisos también en masivo y registro de usuario y fecha. | `FirmarOP`, `EntregarOP`, masivo sin permisos. | Reemplazar (M14 RF-TES-117) | — | — |
| RN-CMP-061 | Segregación: solicita ≠ aprueba SA; crea ≠ aprueba OC; aprueba OC ≠ recibe; registra factura ≠ aprueba excepción ≠ aprueba OP. | Sin control. | Mejorar (BASE §19) | `cmp.segregation.*` | — |
| RN-CMP-062 | Períodos: ninguna operación con fecha en período cerrado de Compras, Stock o Contable. | P500, P432, ejercicio abierto (`Nucleo.ModuloCerrado`). | Reemplazar por entidad de períodos | P500 | — |
| RN-CMP-063 | Fecha de comprobante de compra no posterior al mes actual si está configurado. | P3067. | Replicar | P3067 | — |
| RN-CMP-064 | Previsiones expandidas por periodicidad 1 mensual, 2 bimestral, 3 trimestral, 4 semanal, 5 quincenal dentro del rango. | `AgregarPrev`/`ValidarFechas`. | Replicar | — | — |
| RN-CMP-065 | Costo de reposición = cantidad de reposición − stock actual, por bultos si el producto se compra en bultos. | `CostoReposicion`. | Replicar (dato de M13) | — | — |
| RN-CMP-066 | Mis Comprobantes e IA solo crean **borradores**; el registro exige confirmación humana y las mismas validaciones que la carga manual. | `clsLeerComprobante` propone la carga. | Mejorar | — | — |
| RN-CMP-067 | La IA distingue a la cooperativa del emisor usando CUIT y razón social del tenant. | P518/P519 en `Leercomprobante`. | Replicar | P518, P519 | — |
| RN-CMP-068 | Cantidades con la precisión de la unidad de medida; importes Decimal128, precios unitarios hasta 6 decimales. | P2691 (4 decimales, inconsistencias); IDs `MAX + 1`. | Reemplazar (AGR-011) | P2691 | — |
| RN-CMP-069 | Identidad interna por ObjectId; numeración legible por tipo y punto; claves ProCoop compuestas solo en `legacy` (antes `legacyRef`). | `ID_PPAGO` = proveedor + tipo + punto + número; `GetMaxValue + 1`. | Reemplazar | — | — |
| RN-CMP-070 | Credenciales de Interbanking, IA y portales en bóveda, nunca en tablas. | `INTERBANKING` guarda client secret y contraseñas. | Reemplazar (CTR-CMP-12) | — | — |
| RN-CMP-071 | Toda acción masiva valida capability por documento y registra usuario y fecha. | Masivos sin control (SA, OC, OP). | Mejorar | — | — |
| RN-CMP-072 | Las retenciones practicadas no reducen indebidamente lo cancelado al proveedor: la factura se cancela por el bruto (neto pagado + retenciones). | — | Replicar (BASE §78, CU-FIS-01) | — | — |
| RN-CMP-073 | Una factura mayorista de energía o gas no se habilita para pago mientras tenga renglones sin control contra la medición propia de M03 o excepciones `meteringMismatch`/`meteringMissing` sin decidir; la medición de M03 es la referencia y M12 no la modifica. | Sin control automatizado relevado (FACT_EPEC informado en M06 §2). | Nuevo (HUE-ELE-01, HUE-GAS-04) | PRM-CMP-113, PRM-CMP-114 | Tolerancias habituales con el mayorista |
| RN-CMP-074 | La compra mayorista y los derechos de señales son costo del servicio (RN-CON-069): no se trasladan como recargo ni cargo al usuario y su efecto tarifario, si lo hay, lo decide M04 por su propio circuito. | BASE §87 | Replicar (HUE-ELE-01, HUE-GAS-04, HUE-TV-01) | — | — |
| RN-CMP-075 | La liquidación de derechos de señales usa únicamente el informe de abonados activos por paquete de M02 a la fecha de corte; M12 no cuenta contratos por su cuenta. Una liquidación aprobada no se recalcula: las correcciones posteriores se liquidan como ajuste en el período siguiente con referencia a la original. | Derechos de señales "a relevar por tenant" (M02 6.C.3). | Nuevo (HUE-TV-01) | PRM-CMP-115, PRM-CMP-116 | Base de cómputo exigida por cada programadora |

## 7. Modelo de datos
> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueidentifier`, `DECIMAL`, `DATETIME2`, etc.; ver `07-ddl`). Menciones puntuales de Mongo/Mongoose/BullMQ sin tipo de columna = **comparativa histórica** Connectia, sin efecto en build.


Campos comunes (no se repiten): `TenantId`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `version`, `deletedAt` (solo catálogos), `legacy` (clave ProCoop original, migración; subdocumento de T05 `{system: 'procoop', table, key, displayKey, runId, hash, readOnly, priorMigration}`, antes `legacyRef`). Importes `DECIMAL(18,4)` con `currency`. Todos los índices empiezan por `TenantId`. Los documentos económicos nunca se borran.

Entidad jurídica (DEC-064): `supplyRequests`, `quoteRequests`, `purchaseOrders`, `supplierReceipts`, `supplierInvoices`, `paymentOrders`, `supplierAdvances`, `matchExceptions` y `signalRightsSettlements` llevan `legalEntityId` → `legalEntities` (T04), origen `COD_EMP`; en `supplierInvoices`, `paymentOrders` y `purchaseOrders` es obligatorio por el esquema base de RF-CFG-136 (T04), que rechaza el documento sin entidad o con entidad inactiva a su fecha. Una OP solo aplica comprobantes de la misma entidad; el libro IVA compras (M06) y los asientos (M15) se emiten por entidad. El proveedor (`suppliers`) es compartido por el tenant. Nombres canónicos (T05 §7.2, CTR-DAT-30): `storedFileId`, `workflowInstanceId`; derivados con rol como `<rol>StoredFileId(s)`: `specStoredFileIds` y `dossierCoverStoredFileId` en `sourcingEvents` (antes `specFileIds`, `dossierCoverFileId`), `wholesaleSupply.sourceStoredFileId` (antes `sourceFileId`) y `signalRightsSettlements.declarationStoredFileId` (antes `declarationFileId`, COL-CMP-23); el CBU del proveedor en `paymentOrders` es `supplierBankAccountId` (cuenta del proveedor en `suppliers.bankAccounts`, no una cuenta de tesorería `treasuryAccountId`).

### 7.1 `suppliers`

| Campo | Tipo | Oblig. | Descripción / origen |
|---|---|---|---|
| `code` | String | Sí | Código legible (`COD_PROV`) |
| `personId` | uniqueidentifier | Sí | Persona de M01 que tiene el rol de proveedor (DEC-097); se obtiene con el alta asistida de M01 (RF-PER-174). Única por tenant. Antes: opcional (§7.13.1) |
| `identitySnapshot` | Object (proyección) | Calculado | `{ displayName, tradeName, taxId, vatConditionId, refreshedAt }` copiado de la persona de M01 al crear y al recibir `per.person.updated` / `per.taxId.verified`; solo lectura, para búsquedas, índices, el portal y el cruce de Mis Comprobantes por CUIT. La fuente es M01 (DEC-097) |
| `legalName`, `tradeName` | — | — | **Reemplazado (10-11-2026, DEC-097):** se leen de `persons.legalName`/`displayName` y `persons.tradeName` (M01); copia en `identitySnapshot`. Fila anterior: "String · Sí/No · `NOM_PRO`" |
| `taxId` | — | — | **Reemplazado (10-11-2026, DEC-097):** es la identificación CUIT de la persona (`persons.identifiers`, M01), única por tenant por RN-PER-005; copia en `identitySnapshot.taxId`. Fila anterior: "String (CUIT) · Sí · `CUIT`; único" |
| `vatConditionCode` | — | — | **Reemplazado (10-11-2026, DEC-097):** se lee del perfil fiscal de la persona (`persons.fiscalProfile.ivaConditionId`, catálogo de M06). Fila anterior: "String · Sí · Condición IVA (M06, `SITIVA` vía `COD_SIT`)" |
| `grossIncome` | Object | No | `{ regime: local\|multilateral\|exempt, number, jurisdictions[] }` (dato del rol, lo usa M06 para retenciones) |
| `addresses[]` | — | — | **Reemplazado (10-11-2026, DEC-097):** domicilios de la persona en M01 (`persons.addresses` con rol `fiscal` y `commercial`). Fila anterior: "Array · Sí · `{ kind: fiscal\|commercial, street, number, neighborhood, province, locality, postalCode }` (`DOM_*`)" |
| `contacts[]` | Array | No | Contactos comerciales del rol: `{ name, role, phone, mobile, email, preferredChannel }`, personas de contacto con su función. Los teléfonos y correos del propio proveedor son contactos de la persona en M01 (`DOM_TEL`, `DOM_FAX`, email; DEC-097). Antes: "`{ name, role, phone, mobile, email, preferredChannel }` (`DOM_TEL`, `DOM_FAX`, email)" |
| `bankAccounts[]` | Array | No | `{ accountId, description, cbu, alias, bankCode, holderName, holderTaxId, preferred, status: pendingApproval\|approved\|disabled, approvedBy, approvedAt }` (`PROVEED_CBU`) |
| `productTypeIds[]` | uniqueidentifier | No | `PROVEED_TIPPROD` |
| `authorizedPersons[]` | Array | No | `{ name, documentNumber, authorizedAt, expiresAt?, note }` (`PROVEED_AUT`) |
| `categoryAssignments[]` | Array | Según config | `{ categoryId, since }` (`RUBXPRO`, `RPSXPROV`) |
| `notes[]` | Array | No | `{ text, at, by }` (`OBS_PRO`) |
| `linkedAccounts[]` | Array | No | `{ accountId, personId, relation }` (`PROVSUM`) |
| `paysOthers` | Boolean | Sí | `PERPAGOTROS` |
| `isEmployee`, `employeeId` | Boolean, uniqueidentifier | No | Proveedor-empleado (M16) |
| `defaultPaymentTerms` | Object | No | `{ days, method, currency }` |
| `accountingAccountId` | uniqueidentifier | Según P3068 | Cuenta del proveedor (M15) |
| `documents[]` | Array | No | `{ type, storedFileId, validUntil, required }` (trámites) |
| `portal` | Object | No | `{ enabled, invitedUsers[], lastAccessAt }` |
| `performance` | Object | Calculado | `{ onTimeRate, qtyDiffRate, priceDiffRate, returnsRate, avgScore, computedAt }` |
| `status`, `statusReason` | Enum, String | Sí | `active`, `blocked`, `inactive` |

Índices: `{tenantId, personId}` único; `{tenantId, "identitySnapshot.taxId"}`; `{tenantId, code}` único; `{tenantId, "identitySnapshot.displayName"}` (texto) (DEC-097; antes `{tenantId, taxId}` único y `{tenantId, legalName}` (texto)); `{tenantId, "categoryAssignments.categoryId"}`; `{tenantId, "bankAccounts.cbu"}`. Origen: `PROVEED` (67 columnas: `COD_EMP`, `NOM_PRO`, `COD_SIT`, `DOM_CAL`, `DOM_NUM`, `DOM_BAR`, `DOM_PRO`, `DOM_LOC`, `DOM_COD`, `DOM_TEL`, `DOM_FAX`, `CUIT` y 55 más), `PROVEED_CBU`, `PROVEED_AUT`, `PROVEED_TIPPROD`, `RUBXPRO`, `RPSXPROV`, `OBS_PRO`, `PROVSUM`. Los regímenes de retención (`PROVEED_RET`) viven en `withholdingAssignments` de M06.

### 7.2 Catálogos

- `supplierCategories`: `{ code, name, shortName, bankCode?, allowsDeferredPayment, kind: supplier|productService }`. Origen `RUBPROV` (`COD_RUB`, `DES_RUB`, `DES_RUBR`, `COD_BAN`, `PAGDIF`) y `RPSPROV` (`DES_RUB`, `DES_RUBR`) unificados (CTR-CMP-10).
- `purchaseConcepts`: `{ code, name, printName, unit, accountingCategoryId, vatRateCode, nonTaxed, type, vatType, grossIncomeCode, active }`. Origen `CON_COM` (`COD_RUB`, `DES_CON`, `DES_FOR`, `UNI_MED`, `COD_ALI`, `CON_NOG`, `TIPO`, `TIPO_IVA`, `COD_IB`); `CON_COM_RET` → M06 `withholdingAssignments`. Absorbe además `CON_TASAS` (conceptos asociados a tasas, que ProCoop administra solo desde Compras; T05 COL-CMP-05, T07 §19.2, HUECO-TAS-03): campos `kind` (Enum `purchase` | `rateConcept`, default `purchase`; `rateConcept` para las filas de `CON_TASAS`), `ratePercent` (DECIMAL(18,4), obligatorio si `kind = rateConcept`; tasa aplicada) y `purchaseBookColumn` (String; columna del libro de IVA compras donde se acumula). Ninguna regla de facturación lee estos conceptos (antes `CON_TASAS` iba a `taxes` de M06 o a `chargeRules` de M04).
- `purchaseLookups`: `{ kind: recipient|spendingUnit|fuel|contractingModality|department|deliveryPlace, code, name, notes, thresholds? }`. Origen `DESTINATARIO_SAPROV` (`NOM_DES`), `UNIDADES_GASTOS` (`DES_UNIDADES`, `OBS_UNIDADES`), `COMBUSTIBLES` (`COMBUSTIBLE`). **Corregido (CTR-DAT-54):** `purchaseLookups` conserva solo `kind = recipient|contractingModality|department|deliveryPlace`; las unidades de gasto son `expenseUnits` de M13 (`UNIDADES_GASTOS`) y los combustibles `fuelTypes` de M18 (`COMBUSTIBLES`). Los valores `spendingUnit` y `fuel` del enum quedan sin uso: las solicitudes, OC y comprobantes referencian `expenseUnitId` [M13] y `fuelTypeId` [M18].
- `supplierEvaluations`: `{ supplierId, userId, date, quality, score, note, sourceDocument? }`. Origen `PROVEED_VALORACIONES`.
- `supplierCorrespondence`: `{ supplierIds[] | filter, kind: circular|email|sms|whatsapp, templateId, subject, body, sentAt, deliveries[{ supplierId, status }] }`. Origen `CIRCUPRO` (`DES_CIR`, `TEXTO`).
- `purchaseForecasts`: `{ supplierId, conceptId?, productId?, from, to, periodicity: monthly|bimonthly|quarterly|weekly|biweekly, amount, currency, serviceCode?, costCenterId? }`. Origen `PREV_COM`.

### 7.3 `supplyRequests` (SA)

| Campo | Tipo | Oblig. | Descripción / origen |
|---|---|---|---|
| `number` | String | Sí | Por tipo y punto (`COD_COM`, `SUC_COM`, `NUM_COM`) |
| `date`, `requiredBy` | Date | Sí/No | `FECHA`, `HORA` |
| `origin` | Object | Sí | `{ type: manual\|reorderPoint\|workOrder\|project\|manufacturing, refId? }` |
| `requesterId`, `recipientId`, `departmentId` | uniqueidentifier | Sí/Según P2705/No | `USU_SOL`, `COD_DES` |
| `criticality` | Enum | Sí | `normal`, `high`, `urgent` |
| `modality` | Enum | Sí | `unassigned`, `pettyCash`, `quoteByMail`, `priceContest`, `contest`, `tender` |
| `items[]` | Array | Sí | `{ itemId, lineType: product\|concept\|text, productId?, conceptId?, description, quantity, unit, estimatedCost, lastPurchasePrice, pendingQty, receivedQty, serviceCode?, costCenterId?, workOrderId?, projectId?, warehouseId?, allocation[]?, rejected, rejectReason, note }` (`IT_APROV`: `COD_PROD`, `PRO_CON`, `CANT_PED`, `CANT_REC`, `COSTO`, `OBSE`, `CAN_PEN`, `DES_PRO`, `USU_SOL`, `COD_DES`, `OBSE2`) |
| `estimatedTotal` | DECIMAL(18,4) | Sí | `ESTIMADO` |
| `approval` | Object | No | `{ workflowInstanceId, requiresDouble, approvals[{ userId, at, level }] }` (`AUTORIZADO`, `USU_AUTO`, `USU_AUTO2`, `DOBLE_AUTO`) |
| `takenByPurchasingAt` | Date | No | `FEC_COMPRAS` |
| `exportedForSignature` | Object | No | `{ at, by }` (`EXPORTADA`) |
| `status` | Enum | Sí | §8.1 |

Índices: `{tenantId, number}` único; `{tenantId, status, date}`; `{tenantId, "items.productId", status}`; `{tenantId, requesterId}`. Origen `SAPROV` (`FECHA`, `HORA`, `COD_COM`, `SUC_COM`, `NUM_COM`, `OBSE`, `AUTORIZADO`, `USU_AUTO`, `USU_GEN`, `ESTADO`, `ESTIMADO`, `DOBLE_AUTO` y 13 más).

### 7.4 `quoteRequests` y `sourcingEvents`

`quoteRequests`: `{ number, groupId, sourcingEventId?, supplierId, date, dueDate, currency, exchangeRate, sentAt, sentChannel, status, rejectReason, items[{ itemId, productId?, conceptId?, description, quantity, unitCost, previousCost, validityDays, leadTimeDays, note, criticality, pendingQty, evaluation: pending|awarded|discarded, awardedQty, justification }] }`. Índices `{tenantId, groupId}`; `{tenantId, supplierId, status}`. Origen `SCOTIZ` (`FECHA`, `HORA`, `COD_COM`, `SUC_COM`, `NUM_COM`, `COD_PROV`, `USU_GEN`, `OBSE`, `FVTO`, `ESTADO`, `TIP_MON`, `COTIZ` y 8 más), `IT_SCOTIZ` (`COD_PROD`, `PRO_CON`, `CANT`, `COSTO`, `PRE_ANT`, `VALIDEZ`, `OBSE`, `CAN_PEN`, `DES_PRO`, `OBSE2`, `CRITICIDAD` y 4 más).

`sourcingEvents`: `{ number (correlativo por modalidad), modality, title, specStoredFileIds[], invitedSupplierIds[], invitationTemplateId, offersDueAt, openedAt, openingAct{ storedFileId, attendees[] }, awardSheet{ storedFileId }, dossierCoverStoredFileId, status: draft|published|closed|opened|awarded|cancelled }`.

### 7.5 `purchaseOrders`

| Campo | Tipo | Oblig. | Descripción / origen |
|---|---|---|---|
| `number` | String | Sí | Por tipo y punto |
| `kind` | Enum | Sí | `standard`, `blanket` (marco), `release` (liberación) |
| `blanketOrderId` | uniqueidentifier | Si `release` | OC marco |
| `supplierId` | uniqueidentifier | Sí | `COD_PROV` |
| `date`, `deliveryDate`, `estimatedPaymentDate` | Date | Sí/Según P2735/Según P2810 | `FECHA`, `FENTREGA` |
| `paymentTerms`, `deliveryTerms`, `deliveryPlace` | String/Object | Sí | Forma de pago, plazos, lugar |
| `requesterId`, `signerName`, `departmentId` | | No | `USU_GEN`, firmante, departamento |
| `currency`, `exchangeRate` | | Sí | `TIP_MON` |
| `items[]` | Array | Sí | `{ itemId, productId?, conceptId?, description, quantity, packages, unitPrice, bonusPrice, discountPct, vatRates[], deliveryDate, receivedQty, invoicedQty, pendingQty, allocation[{ serviceCode, costCenterId, workOrderId?, projectId?, warehouseId?, pct?, qty? }], purchaseReason, sourceLinks[] }` (`IT_NPED`: `COD_PRO`, `PRO_CON`, `CAN_PRO`, `BULTOS`, `PRE_UNI`, `PRE_BON`, `POR_IVA1` y 26 más) |
| `totals` | Object | Sí | `{ net, vat[], perceptions[], total }` (`IMP_GRA`, `IMP_EXE`, `IMP_NGR`, `IMP_PER`, `IVA_RI`) |
| `blanketLimits` | Object | Si `blanket` | `{ maxAmount, maxQtyByItem, validFrom, validTo, consumedAmount }` |
| `revision`, `revisions[]` | Number, Array | Sí | Versiones con diferencias |
| `approval` | Object | Sí | `{ policyBand, workflowInstanceId, approvedBy[], approvedAt }` (`AUTORIZADO`, bloqueo P2382) |
| `sentAt`, `supplierAcknowledgedAt`, `supplierCommittedDate` | Date | No | |
| `fundCommitmentRef` | String | No | Referencia de compromiso (M14/M15) |
| `status` | Enum | Sí | §8.3 |

Índices: `{tenantId, number}` único; `{tenantId, supplierId, status}`; `{tenantId, status, deliveryDate}`; `{tenantId, "items.allocation.serviceCode"}`. Origen `OCOMPRA` (`FECHA`, `HORA`, `COD_COM`, `SUC_COM`, `NUM_COM`, `COD_PROV`, `FENTREGA`, `AUTORIZADO`, `USU_GEN`, `OBSE`, `ESTADO`, `TIP_MON` y 11 más), `NPEDIDO` (48 columnas), `IT_NPED`.

### 7.6 `supplierReceipts`

`{ number, supplierDocument{ type, pointOfSale, number }?, supplierId, date, kind: goods|serviceAcceptance|return, warehouseId?, receiverId, items[{ itemId, purchaseOrderItemRef?, productId?, conceptId?, description, quantity, unitPrice?, invoicedQty, pendingToInvoiceQty, pendingStockEntry: Boolean, serials[], lots[], excessQty, note, status }], stockStatus: notApplicable|pending|confirmed|rejected, stockMovementIds[], status }`. Índices `{tenantId, supplierId, date}`; `{tenantId, status}`; `{tenantId, "items.purchaseOrderItemRef"}`. Origen `COMP_COM` (`COD_EMP`, `FECHA`, `HORA`, `FEC_CON`, `COD_COM`, `SUC_COM`, `NUM_COM`, `COD_PROV`, `IMP_GRA`, `IMP_EXE`, `IMP_NGR`, `IMP_PER` y 25 más), `IT_COMPC` (`COD_PRO`, `PRO_CON`, `CAN_PRO`, `PRE_UNI`, `IVA`, `SAL_CANPRO`, `ESTADO` y 17 más). `RECEPCIONES`/`ESTADOS_RECEP` (servicio técnico de equipos de clientes) pertenecen a M13 (CTR-CMP-03).

### 7.7 `supplierInvoices`

| Campo | Tipo | Oblig. | Descripción / origen |
|---|---|---|---|
| `supplierId` | uniqueidentifier | Sí | `COD_PROV` |
| `documentType`, `pointOfSale`, `number`, `letter` | String/Number | Sí | `COD_COM`, `SUC_COM`, `NUM_COM` |
| `kind` | Enum | Sí | `invoice`, `debitNote`, `creditNote`, `ticket`, `receipt`, `advance`, `advanceOffset` |
| `issueDate`, `accountingDate` | Date | Sí | `FECHA`, `FEC_CON` |
| `dueDates[]` | Array | Sí | `{ dueDate, amount }` (cuotas) |
| `currency`, `exchangeRate` | | Sí | |
| `authorization` | Object | No | `{ type: CAE\|CAI\|CAEA, code, dueDate, arcaCheck: { status, at } }` |
| `amounts` | Object | Sí | `{ taxedNet, nonTaxed, exempt, vat[{ rate, base, amount }], perceptions[{ tax, jurisdiction, amount }], internalTaxes, otherTaxes, total }` (`IMP_GRA`, `IMP_EXE`, `IMP_NGR`, `IMP_PER`; `FPALIC_IVA`: `PORC_IVA`, `IMP_IVA`, `IMP_BASE`) |
| `vatTakenPct` | DECIMAL(18,4) | No | IVA no tomado (P2890) |
| `items[]` | Array | Sí | `{ itemId, productId?, conceptId?, description, quantity, unitPrice, vatRate, vatNotTaken, accountingCategoryId, allocation[], expenseUnitId? [M13] (antes `spendingUnitId`, CTR-DAT-54), sourceLinks[], pendingReceiptQty, pendingStock: Boolean, matchStatus }` (`FPITEMS`: `COD_PRO`, `PRO_CON`, `CAN_PRO`, `PRE_UNI`, `IVA`, `COD_COMRE`, `SUC_COMRE` y 17 más) |
| `fuel[]` | Array | No | `{ fuelTypeId [M18] (antes `fuelId`, CTR-DAT-54), liters, km, vehicleRef }` (`IVACOM_COMBUSTIBLES`: `ID_COMBUST`, `LTS`, `KM`, `COD_MOV`) |
| `wholesaleSupply` | Object | No | Factura mayorista (RF-CMP-149, RF-CMP-152; HUE-ELE-01, HUE-GAS-04): `{ kind: energy\|gas, serviceId, period, sourceStoredFileId?, lines[{ meteringPointId (M03), band?, quantity, unit: kWh\|kVArh\|kW\|m3, correctionFactor?, measuredQuantity, difference, amount }], meteringCheck: { status: pending\|matched\|exception, checkedAt }, balanceId? }` |
| `signalRightsSettlementId` | uniqueidentifier | No | Liquidación de derechos de señales que concilia la factura de la programadora (RF-CMP-155; HUE-TV-01) |
| `separateInVatBook` | Mixed | No | P832 |
| `customerServiceRef` | Object | No | Servicio de un cliente (P2277) |
| `housingCategoryCheck` | Boolean | No | P2502/P2503 |
| `source` | Enum | Sí | `manual`, `portal`, `arcaImport`, `ai`, `migrated` |
| `sourceRefs` | Object | No | `{ portalSubmissionId?, arcaImportLineId?, aiExtractionId? }` |
| `matchStatus` | Enum | Sí | `notRequired`, `matched`, `exception`, `withoutPO` |
| `paymentRelease` | Object | Sí | `{ status: blocked\|released\|partiallyReleased, releasedAmount, by, at, reason }` (`PER_PAGO`) |
| `balance`, `committedForPayment` | DECIMAL(18,4) | Sí | `SALDO` |
| `status` | Enum | Sí | §8.5 |

Índices: `{tenantId, supplierId, documentType, pointOfSale, number}` único parcial (`status != voided`); `{tenantId, status, "paymentRelease.status"}`; `{tenantId, accountingDate}`; `{tenantId, supplierId, balance}`. Origen `IVACOM` (`COD_EMP`, `FEC_CON`, `FECHA`, `COD_COM`, `SUC_COM`, `NUM_COM`, `COD_PROV`, `COD_RUB`, `IMP_GRA`, `IMP_EXE`, `IMP_NGR`, `IMP_PER` y 35 más), `FPITEMS`, `FPALIC_IVA`, `IVACOM_COMBUSTIBLES`.

### 7.8 `purchaseDocumentLinks`

`{ originType: supplyRequest|quoteRequest|purchaseOrder|receipt|invoice, originId, originItemId, targetType, targetId, targetItemId, quantity, originPrice, targetPrice, createdAt, undoneAt? }`. Índices `{tenantId, originType, originId}`; `{tenantId, targetType, targetId}`. Origen `COMPRAS_RELACION` (`TIPO_ORI` 1–5, `ID_ORI`, `TIPO_DES`, `ID_DES`, `CANTIDAD`).

### 7.9 `matchExceptions`

`{ invoiceId, invoiceItemId?, purchaseOrderId?, receiptId?, type: quantity|price|terms|withoutPO|withoutReceipt|excessReceipt|meteringMismatch|meteringMissing (HUE-ELE-01, HUE-GAS-04), expected, actual, difference, amountInDispute, cause, decision: pending|accepted|claimCreditNote|rejected, workflowInstanceId, decidedBy, decidedAt, note }`. Índices `{tenantId, invoiceId}`; `{tenantId, decision}`.

### 7.10 `paymentOrders`

| Campo | Tipo | Oblig. | Descripción / origen |
|---|---|---|---|
| `number` | String | Sí | Por tipo y punto (sin renumerar al chocar) |
| `supplierId`, `beneficiaryName` | uniqueidentifier, String | Sí/No | `COD_PROV`; P1029 |
| `legalEntityId` | uniqueidentifier | Sí | Entidad jurídica pagadora, la de las facturas aplicadas (DEC-064; clave de T05; PA-CMP-16) |
| `paymentDate`, `expectedExecutionDate` | Date | Sí | `FEC_PAG` |
| `applications[]` | Array | Sí | `{ invoiceId, supplierId, amountApplied, fullPayment }` (`PPITEMS`: `ID_IVACOM`, `COD_C`, `SUC_C`, `NUM_C`, `FAC_PAGA`, `TOTAL_C`) |
| `creditApplications[]` | Array | No | NC y anticipos aplicados |
| `newAdvances[]` | Array | No | `{ advanceId, amount, installments }` |
| `discount` | Object | No | `{ pct, amount }` (`POR_DES`, `IMP_DES`, `SIN_DES`) |
| `withholdings[]` | Array | Sí | Instantánea de M06: `{ withholdingAppliedId, tax, regimeCode, base, amount, calculatedAmount, adjusted: { by, reason }?, certificateNumber }` (`RETG`, `RETB`; detalle en `withholdingsApplied`) |
| `totals` | Object | Sí | `{ gross, withholdings, discount, net }` |
| `supplierBankAccountId` | uniqueidentifier | No | CBU aprobado preferido |
| `approval` | Object | Sí | `{ policyBand, workflowInstanceId, approvedBy[], approvedAt }` |
| `execution` | Object | No | `{ paymentExecutionId (M14), status, executedAt }` |
| `status` | Enum | Sí | §8.6 |

Índices: `{tenantId, number}` único; `{tenantId, supplierId, paymentDate}`; `{tenantId, status}`; `{tenantId, "applications.invoiceId"}`. Origen `PPAGOS` (cabecera: `FEC_PAG`, `COD_PROV`, `COD_COM`, `SUC_COM`, `NUM_COM`, `COD_VEN`, `PAGO`, `POR_DES`, `IMP_DES`, `SIN_DES`, `RETG`, `RETB` y 19 más; firma y entrega migran a M14), `PPITEMS`. `PPAGOS_FIRMANTES`, `PPAGOS_FIRMAS`, `FIRMASELECTRONICAS*` → M14/T11.

### 7.11 Otras colecciones

- `supplierAdvances`: `{ supplierId, paymentOrderId, conceptId (P2035), amount, appliedAmount, installments[], status: open|partiallyApplied|applied|voided }`.
- `supplierPortalSubmissions`: `{ taxId, legalName, supplierId?, documentType, pointOfSale, number, issueDate, dueDate, amount, storedFileId, submittedBy, submittedAt, review: { status: pending|registered|rejected, reason, invoiceId?, by, at } }`. Índice único `{tenantId, taxId, documentType, pointOfSale, number}`. Origen `IVACOM_WEB` (`CUIT`, `RAZON_SOCIAL`, `COD_PROV`, `COD_COM`, `SUC_COM`, `NUM_COM`, `FECHA`, `VENCIMIENTO`, `IMPORTE`, `FECHA_REGISTRADO`, `HORA_REGISTRADO`, `ID_IVACOM` y 6 más).
- `aiInvoiceExtractions`: `{ storedFileId, model, requestedBy, requestedAt, fields{ name: { value, confidence } }, proposedSupplierId, proposedItems[], tokens, outcome: pending|accepted|corrected|discarded, invoiceId?, corrections[] }`. Origen conceptual `AUDIT_IA` (`TIPO_CONSULTA`, `FEC_REG`, `COMANDO`, `RESPUESTA`, `TOKENS`, `USUARIO`): no se migran prompts ni respuestas con datos personales. **Corregido (CTR-DAT-04):** `aiInvoiceExtractions` solo registra extracciones nuevas de CoopApps y **no migra `AUDIT_IA`**; el histórico de `AUDIT_IA` migra a `legacyAuditRecords` (T05/T07). El consumo agregado de IA es de T01 (`aiUsage`), la llamada al proveedor de T06 (`aiUsageLogs`) y la auditoría por persona de T02 (`auditAi`); M12 los referencia y no los duplica.
- `supplierLedgerEntries`: `{ supplierId, date, documentType, documentId, debit, credit, balanceAfter, dueDate }` (proyección derivada para consultas rápidas; se reconstruye desde documentos).
- `supplyBalances` (HUE-ELE-01, HUE-GAS-04): `{ kind: energy|gas, serviceId, zoneId?, period, purchasedQty, boundaryMeasuredQty, billedToUsersQty, lossQty, lossPct, invoiceIds[], status: draft|approved, approvedBy, approvedAt }`. Índice único `{tenantId, kind, serviceId, zoneId, period}`. Sin origen ProCoop directo (el informe de pérdidas de M03 cubre la parte de medición).
- `signalRightsContracts` (HUE-TV-01): `{ supplierId (programadora), signals[], packageIds[] (M02), pricePerSubscriber, currency, minimumGuaranteed, countBasis: cutoffDate|monthlyAverage, validFrom, validTo, status }`.
- `signalRightsSettlements` (HUE-TV-01): `{ contractId, supplierId, period, cutoffDate, lines[{ packageId, activeSubscribers, price, amount }], minimumApplied, total, adjustsSettlementId?, reportRef (informe de M02), declarationStoredFileId, invoiceId?, status: draft|approved|invoiced|voided, approvedBy, approvedAt }`. Índice único `{tenantId, contractId, period, adjustsSettlementId}`.

### 7.12 Relaciones

```
suppliers ─▶ supplierCategories · withholdingAssignments (M06) · accounts/persons (M01) · employees (M16)
supplyRequests ─▶ quoteRequests ─▶ purchaseOrders ─▶ supplierReceipts ─▶ supplierInvoices   (purchaseDocumentLinks por ítem)
supplierInvoices ─▶ matchExceptions · paymentOrders · withholdingsApplied (M06) · stockMovements (M13) · journalEntries (M15)
paymentOrders ─▶ paymentExecutions (M14) · supplierAdvances
purchaseOrders ─▶ fundCommitments (M14) · workOrders/projects (M10) · costCenters (M15)
```

### 7.13 Tablas de campos normalizadas y referencias declaradas

Corrección de consistencia (categorías 2, 3 y 4 de `_trabajo/correccion-inconsistencias-instrucciones.md`). Para cada colección cuyo §7 lista los campos en texto se da la tabla normalizada; para las que ya tienen tabla, solo las referencias cuyo destino estaba implícito o faltaba. Fuentes: la lista del anexo y el catálogo de T05. La lista original sigue vigente como descripción; para nombres de campo y referencias prevalece esta tabla, alineada con T05. `[VERIFICAR]` marca tipo, obligatoriedad o destino no deducibles del anexo ni de T05. Referencia: colección destino (anexo dueño).

#### 7.13.1 `suppliers` (COL-CMP-01) — referencias declaradas

| Campo | Referencia |
|---|---|
| `taxId` | — (CUIT; identificador fiscal, no es referencia). **Reemplazado (10-11-2026, DEC-097):** la CUIT es de la persona de M01 y en `suppliers` solo queda la copia `identitySnapshot.taxId`; la clave única pasa a `personId`. Texto anterior: "T05 lo declara clave única" |
| `productTypeIds` | `supplierCategories` (M12) con `kind = productService` (rubros de productos y servicios, `PROVEED_TIPPROD`; antes `[VERIFICAR]`; PA-CMP-16) |
| `isEmployee` | — (booleano; el empleado es `employeeId` → `employees` (M16)) |
| `accountingAccountId` | `ledgerAccounts` (M15) (antes `[VERIFICAR]`); M15 §7.38 y §7.39 guardan la cuenta del proveedor en `entityAccountAssignments` con `entityType = supplier`: el campo queda como alias de migración de P3068 (PA-CMP-16) |
| `personId` | `persons` (M01) (**obligatorio y único por tenant**, DEC-097; clave de T05). Texto anterior: "(opcional; clave de T05; proveedor que también es persona registrada; PA-CMP-16)" |

#### 7.13.2 `supplierCategories` (COL-CMP-02)

Lista original: §7.2.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | [VERIFICAR] | — | — |
| `name` | string | [VERIFICAR] | — | — |
| `shortName` | string | [VERIFICAR] | — | — |
| `bankCode` | string | No | — | — |
| `allowsDeferredPayment` | bool | [VERIFICAR] | — | — |
| `kind` | enum | [VERIFICAR] | Valores: `supplier`, `productService`. | — |

#### 7.13.3 `purchaseConcepts` (COL-CMP-05)

Lista original: §7.2.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | [VERIFICAR] | — | — |
| `name` | string | [VERIFICAR] | — | — |
| `printName` | string | [VERIFICAR] | — | — |
| `unit` | [VERIFICAR] | [VERIFICAR] | — | — |
| `accountingCategoryId` | uniqueidentifier | [VERIFICAR] | — | `serviceCategories` (M02) |
| `vatRateCode` | string | [VERIFICAR] | — | — |
| `nonTaxed` | [VERIFICAR] | [VERIFICAR] | — | — |
| `type` | [VERIFICAR] | [VERIFICAR] | — | — |
| `vatType` | [VERIFICAR] | [VERIFICAR] | — | — |
| `grossIncomeCode` | string | [VERIFICAR] | — | — |
| `active` | bool | [VERIFICAR] | — | — |
| `vatRateId` | uniqueidentifier | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `vatRates` (M06); antes implícita por el nombre |

#### 7.13.4 `purchaseLookups` (COL-CMP-06)

Lista original: §7.2.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `kind` | enum | [VERIFICAR] | Valores: `recipient`, `spendingUnit`, `fuel`, `contractingModality`, `department`, `deliveryPlace`. | — |
| `code` | string | [VERIFICAR] | — | — |
| `name` | string | [VERIFICAR] | — | — |
| `notes` | string | [VERIFICAR] | — | — |
| `thresholds` | [VERIFICAR] | No | — | — |

#### 7.13.5 `supplierEvaluations` (COL-CMP-03)

Lista original: §7.2.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `supplierId` | uniqueidentifier | [VERIFICAR] | — | `suppliers` (M12) |
| `userId` | uniqueidentifier | [VERIFICAR] | — | `memberships` (T02) |
| `date` | Date | [VERIFICAR] | — | — |
| `quality` | [VERIFICAR] | [VERIFICAR] | — | — |
| `score` | [VERIFICAR] | [VERIFICAR] | — | — |
| `note` | [VERIFICAR] | [VERIFICAR] | — | — |
| `sourceDocument` | [VERIFICAR] | No | — | — |

#### 7.13.6 `supplierCorrespondence` (COL-CMP-04)

Lista original: §7.2.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `supplierIds` | array | [VERIFICAR] | \| filter | `suppliers` (M12) |
| `kind` | enum | [VERIFICAR] | Valores: `circular`, `email`, `sms`, `whatsapp`. | — |
| `templateId` | uniqueidentifier | [VERIFICAR] | — | `messageTemplates` (T09) (antes `[VERIFICAR]`) |
| `subject` | string | [VERIFICAR] | — | — |
| `body` | [VERIFICAR] | [VERIFICAR] | — | — |
| `sentAt` | Date | [VERIFICAR] | — | — |
| `deliveries` | array | [VERIFICAR] | [{ supplierId, status }] | — |
| `communicationId` | uniqueidentifier | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `communications` (T09) |

#### 7.13.7 `purchaseForecasts` (COL-CMP-17)

Lista original: §7.2.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `supplierId` | uniqueidentifier | [VERIFICAR] | — | `suppliers` (M12) |
| `conceptId` | uniqueidentifier | No | — | `billableConcepts` (M02) |
| `productId` | uniqueidentifier | No | T05 nombra el campo `inventoryItemId` (§7.2); `productId` queda como alias (PA-CMP-16). | `inventoryItems` (M13) (antes `[VERIFICAR]`) |
| `from` | Date | [VERIFICAR] | — | — |
| `to` | Date | [VERIFICAR] | — | — |
| `periodicity` | enum | [VERIFICAR] | Valores: `monthly`, `bimonthly`, `quarterly`, `weekly`, `biweekly`. | — |
| `amount` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `currency` | [VERIFICAR] | [VERIFICAR] | — | — |
| `serviceCode` | string | No | — | — |
| `costCenterId` | uniqueidentifier | No | — | `costCenters` (M15) |

#### 7.13.8 `supplyRequests` (COL-CMP-07) — referencias declaradas

| Campo | Referencia |
|---|---|
| `recipientId` | `purchaseLookups` (M12) con `kind = recipient` (`COD_DES`; antes `[VERIFICAR]`) |
| `departmentId` | `departments` (T04); antes implícita por el nombre |

#### 7.13.9 `quoteRequests` (COL-CMP-08)

Lista original: §7.4.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `number` | int / string [VERIFICAR] | [VERIFICAR] | — | — |
| `groupId` | uniqueidentifier | [VERIFICAR] | — | — (identificador que agrupa las solicitudes enviadas juntas a varios proveedores; no es referencia; antes `[VERIFICAR]`) |
| `sourcingEventId` | uniqueidentifier | No | — | `sourcingEvents` (M12); antes implícita por el nombre |
| `supplierId` | uniqueidentifier | [VERIFICAR] | — | `suppliers` (M12) |
| `date` | Date | [VERIFICAR] | — | — |
| `dueDate` | Date | [VERIFICAR] | — | — |
| `currency` | [VERIFICAR] | [VERIFICAR] | — | — |
| `exchangeRate` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `sentAt` | Date | [VERIFICAR] | — | — |
| `sentChannel` | [VERIFICAR] | [VERIFICAR] | — | — |
| `status` | [VERIFICAR] | [VERIFICAR] | — | — |
| `rejectReason` | string | [VERIFICAR] | — | — |
| `items` | array | [VERIFICAR] | [{ itemId, productId?, conceptId?, description, quantity, unitCost, previousCost, validityDays, leadTimeDays, note, criticality, pendingQty, evaluation: pending\|award… | — |
| `supplierIds` | uniqueidentifier[] | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `suppliers` (M12) |

#### 7.13.10 `sourcingEvents` (COL-CMP-09)

Lista original: §7.4.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `number` | int / string [VERIFICAR] | [VERIFICAR] | correlativo por modalidad | — |
| `modality` | [VERIFICAR] | [VERIFICAR] | — | — |
| `title` | [VERIFICAR] | [VERIFICAR] | — | — |
| `specStoredFileIds` | array | [VERIFICAR] | — | `storedFiles` (T01) |
| `invitedSupplierIds` | array | [VERIFICAR] | — | `suppliers` (M12) |
| `invitationTemplateId` | uniqueidentifier | [VERIFICAR] | — | `documentTemplates` (T11) (antes `[VERIFICAR]`) |
| `offersDueAt` | Date | [VERIFICAR] | — | — |
| `openedAt` | Date | [VERIFICAR] | — | — |
| `openingAct` | object | [VERIFICAR] | { storedFileId, attendees[] } | — |
| `awardSheet` | object | [VERIFICAR] | { storedFileId } | — |
| `dossierCoverStoredFileId` | uniqueidentifier | [VERIFICAR] | — | `storedFiles` (T01) |
| `status` | enum | [VERIFICAR] | Valores: `draft`, `published`, `closed`, `opened`, `awarded`, `cancelled`. | — |
| `quoteRequestId` | uniqueidentifier | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `quoteRequests` (M12); antes implícita por el nombre |

#### 7.13.11 `purchaseOrders` (COL-CMP-10) — referencias declaradas

| Campo | Referencia |
|---|---|
| `blanketOrderId` | `purchaseOrders` (M12) (OC marco, `kind = blanket`; antes `[VERIFICAR]`) |
| `legalEntityId` | `legalEntities` (T04) (entidad jurídica compradora, DEC-064; clave de T05; PA-CMP-16) |
| `departmentId` | `departments` (T04); antes implícita por el nombre |
| `fundCommitmentRef` | `fundCommitments` (M14); antes implícita por el nombre |

#### 7.13.12 `supplierReceipts` (COL-CMP-11)

Lista original: §7.6.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `number` | int / string [VERIFICAR] | [VERIFICAR] | — | — |
| `supplierDocument` | object | [VERIFICAR] | { type, pointOfSale, number }? | — |
| `supplierId` | uniqueidentifier | [VERIFICAR] | — | `suppliers` (M12) |
| `date` | Date | [VERIFICAR] | — | — |
| `kind` | enum | [VERIFICAR] | Valores: `goods`, `serviceAcceptance`, `return`. | — |
| `warehouseId` | uniqueidentifier | No | — | `warehouses` (M13) |
| `receiverId` | uniqueidentifier | [VERIFICAR] | — | `memberships` (T02) (usuario que recibe; antes `[VERIFICAR]`) |
| `items` | array | [VERIFICAR] | [{ itemId, purchaseOrderItemRef?, productId?, conceptId?, description, quantity, unitPrice?, invoicedQty, pendingToInvoiceQty, pendingStockEntry: Boolean, serials[], l… | — |
| `stockStatus` | enum | [VERIFICAR] | Valores: `notApplicable`, `pending`, `confirmed`, `rejected`. | — |
| `stockMovementIds` | array | [VERIFICAR] | — | `stockMovements` (M13); antes implícita por el nombre |
| `status` | [VERIFICAR] | [VERIFICAR] | }`. Índices `{tenantId, supplierId, date}`; `{tenantId, status}`; `{tenantId, "items.purchaseOrderItemRef" | — |

#### 7.13.13 `supplierInvoices` (COL-CMP-12) — referencias declaradas

| Campo | Referencia |
|---|---|
| `signalRightsSettlementId` | `signalRightsSettlements` (M12); antes implícita por el nombre |
| `legalEntityId` | `legalEntities` (T04) (entidad jurídica receptora del comprobante, DEC-064; clave de T05; PA-CMP-16) |

#### 7.13.14 `purchaseDocumentLinks` (COL-CMP-13)

Lista original: §7.8.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `originType` | enum | [VERIFICAR] | Valores: `supplyRequest`, `quoteRequest`, `purchaseOrder`, `receipt`, `invoice`. | — |
| `originId` | uniqueidentifier | [VERIFICAR] | — | Polimórfica según `originType`: `supplyRequests`, `quoteRequests`, `purchaseOrders`, `supplierReceipts` o `supplierInvoices` (M12) (antes `[VERIFICAR]`) |
| `originItemId` | uniqueidentifier | [VERIFICAR] | — | — (renglón embebido `items[].itemId` del documento indicado por `originType`; no es colección; antes `[VERIFICAR]`) |
| `targetType` | [VERIFICAR] | [VERIFICAR] | — | — |
| `targetId` | uniqueidentifier | [VERIFICAR] | — | Polimórfica según `targetType`: `supplyRequests`, `quoteRequests`, `purchaseOrders`, `supplierReceipts` o `supplierInvoices` (M12) (antes `[VERIFICAR]`) |
| `targetItemId` | uniqueidentifier | [VERIFICAR] | — | — (renglón embebido `items[].itemId` del documento indicado por `targetType`; no es colección; antes `[VERIFICAR]`) |
| `quantity` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `originPrice` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `targetPrice` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `createdAt` | Date | [VERIFICAR] | — | — |
| `undoneAt` | Date | No | }`. Índices `{tenantId, originType, originId}`; `{tenantId, targetType, targetId | — |

#### 7.13.15 `matchExceptions` (COL-CMP-14)

Lista original: §7.9.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `invoiceId` | uniqueidentifier | [VERIFICAR] | — | `supplierInvoices` (M12) (antes `invoices` (M05), que es la factura de venta; PA-CMP-16) |
| `invoiceItemId` | uniqueidentifier | No | — | — (renglón embebido `items[].itemId` de `supplierInvoices` (M12); antes `[VERIFICAR]`) |
| `purchaseOrderId` | uniqueidentifier | No | — | `purchaseOrders` (M12); antes implícita por el nombre |
| `receiptId` | uniqueidentifier | No | — | `supplierReceipts` (M12) (antes `receipts` (M07), que es el recibo de cobranza; PA-CMP-16) |
| `type` | enum | [VERIFICAR] | Valores: `quantity`, `price`, `terms`, `withoutPO`, `withoutReceipt`, `excessReceipt`, `meteringMismatch`, `meteringMissing`. | — |
| `expected` | [VERIFICAR] | [VERIFICAR] | — | — |
| `actual` | [VERIFICAR] | [VERIFICAR] | — | — |
| `difference` | [VERIFICAR] | [VERIFICAR] | — | — |
| `amountInDispute` | [VERIFICAR] | [VERIFICAR] | — | — |
| `cause` | [VERIFICAR] | [VERIFICAR] | — | — |
| `decision` | enum | [VERIFICAR] | Valores: `pending`, `accepted`, `claimCreditNote`, `rejected`. | — |
| `workflowInstanceId` | uniqueidentifier | [VERIFICAR] | — | `workflowInstances` (T11) |
| `decidedBy` | uniqueidentifier | [VERIFICAR] | — | `memberships` (T02) |
| `decidedAt` | Date | [VERIFICAR] | — | — |
| `note` | [VERIFICAR] | [VERIFICAR] | }`. Índices `{tenantId, invoiceId}`; `{tenantId, decision | — |

#### 7.13.16 `supplierAdvances` (COL-CMP-16)

Lista original: §7.11.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `supplierId` | uniqueidentifier | [VERIFICAR] | — | `suppliers` (M12) |
| `paymentOrderId` | uniqueidentifier | [VERIFICAR] | — | `paymentOrders` (M12); antes implícita por el nombre |
| `conceptId` | uniqueidentifier | [VERIFICAR] | P2035 | `purchaseConcepts` (M12); antes implícita por el nombre |
| `amount` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `appliedAmount` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `installments` | array | [VERIFICAR] | — | — |
| `status` | enum | [VERIFICAR] | Valores: `open`, `partiallyApplied`, `applied`, `voided`. | — |

#### 7.13.17 `supplierPortalSubmissions` (COL-CMP-18)

Lista original: §7.11.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `taxId` | string | [VERIFICAR] | — | — (CUIT informado por el proveedor; no es referencia; antes tipo uniqueidentifier y `[VERIFICAR]`) |
| `legalName` | string | [VERIFICAR] | — | — |
| `supplierId` | uniqueidentifier | No | — | `suppliers` (M12) |
| `documentType` | [VERIFICAR] | [VERIFICAR] | — | — |
| `pointOfSale` | [VERIFICAR] | [VERIFICAR] | — | — |
| `number` | int / string [VERIFICAR] | [VERIFICAR] | — | — |
| `issueDate` | Date | [VERIFICAR] | — | — |
| `dueDate` | Date | [VERIFICAR] | — | — |
| `amount` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `storedFileId` | uniqueidentifier | [VERIFICAR] | — | `storedFiles` (T01) |
| `submittedBy` | uniqueidentifier | [VERIFICAR] | — | `memberships` (T02) |
| `submittedAt` | Date | [VERIFICAR] | — | — |
| `review` | object | [VERIFICAR] | { status: pending\|registered\|rejected, reason, invoiceId?, by, at } }`. Índice único `{tenantId, taxId, documentType, pointOfSale, number | — |

#### 7.13.18 `aiInvoiceExtractions` (COL-CMP-19)

Lista original: §7.11.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `storedFileId` | uniqueidentifier | [VERIFICAR] | — | `storedFiles` (T01) |
| `model` | [VERIFICAR] | [VERIFICAR] | — | — |
| `requestedBy` | uniqueidentifier | [VERIFICAR] | — | `memberships` (T02) |
| `requestedAt` | Date | [VERIFICAR] | — | — |
| `fields` | object | [VERIFICAR] | { name: { value, confidence } } | — |
| `proposedSupplierId` | uniqueidentifier | [VERIFICAR] | — | `suppliers` (M12) |
| `proposedItems` | array | [VERIFICAR] | — | — |
| `tokens` | [VERIFICAR] | [VERIFICAR] | — | — |
| `outcome` | enum | [VERIFICAR] | Valores: `pending`, `accepted`, `corrected`, `discarded`. | — |
| `invoiceId` | uniqueidentifier | No | — | `supplierInvoices` (M12) (antes `invoices` (M05); PA-CMP-16) |
| `corrections` | array | [VERIFICAR] | — | — |
| `aiUsageLogId` | uniqueidentifier | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `aiUsageLogs` (T06); antes implícita por el nombre |

#### 7.13.19 `supplierLedgerEntries` (COL-CMP-20)

Lista original: §7.11.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `supplierId` | uniqueidentifier | [VERIFICAR] | — | `suppliers` (M12) |
| `date` | Date | [VERIFICAR] | — | — |
| `documentType` | [VERIFICAR] | [VERIFICAR] | — | — |
| `documentId` | uniqueidentifier | [VERIFICAR] | — | `documents` (T11) |
| `debit` | [VERIFICAR] | [VERIFICAR] | — | — |
| `credit` | [VERIFICAR] | [VERIFICAR] | — | — |
| `balanceAfter` | [VERIFICAR] | [VERIFICAR] | — | — |
| `dueDate` | Date | [VERIFICAR] | — | — |

#### 7.13.20 `supplyBalances` (COL-CMP-21)

Lista original: §7.11.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `kind` | enum | [VERIFICAR] | Valores: `energy`, `gas`. | — |
| `serviceId` | uniqueidentifier | [VERIFICAR] | — | `tenantServices` (M02) |
| `zoneId` | uniqueidentifier | No | — | `zones` (T04); antes implícita por el nombre |
| `period` | [VERIFICAR] | [VERIFICAR] | — | — |
| `purchasedQty` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `boundaryMeasuredQty` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `billedToUsersQty` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `lossQty` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `lossPct` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `invoiceIds` | array | [VERIFICAR] | — | `supplierInvoices` (M12) (facturas mayoristas de compra; antes `invoices` (M05); PA-CMP-16) |
| `status` | enum | [VERIFICAR] | Valores: `draft`, `approved`. | — |
| `approvedBy` | uniqueidentifier | [VERIFICAR] | — | `memberships` (T02) |
| `approvedAt` | Date | [VERIFICAR] | }`. Índice único `{tenantId, kind, serviceId, zoneId, period | — |

#### 7.13.21 `signalRightsContracts` (COL-CMP-22)

Lista original: §7.11.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `supplierId` | uniqueidentifier | [VERIFICAR] | programadora | `suppliers` (M12) |
| `signals` | array | [VERIFICAR] | — | — |
| `packageIds` | array | [VERIFICAR] | M02 | `serviceProducts` (M02, COL-CAT-05) (paquetes de señales del servicio de TV; antes `servicePlans` (M02), antes `[VERIFICAR]`; PA-CMP-16) |
| `pricePerSubscriber` | [VERIFICAR] | [VERIFICAR] | — | — |
| `currency` | [VERIFICAR] | [VERIFICAR] | — | — |
| `minimumGuaranteed` | [VERIFICAR] | [VERIFICAR] | — | — |
| `countBasis` | enum | [VERIFICAR] | Valores: `cutoffDate`, `monthlyAverage`. | — |
| `validFrom` | Date | [VERIFICAR] | — | — |
| `validTo` | Date | [VERIFICAR] | — | — |
| `status` | enum | [VERIFICAR] | Valores: `draft`, `active`, `ended` (§8.8; antes sin valores, PA-CMP-16). | — |

#### 7.13.22 `signalRightsSettlements` (COL-CMP-23)

Lista original: §7.11.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `contractId` | uniqueidentifier | [VERIFICAR] | — | `signalRightsContracts` (M12) (contrato de señales, T05 COL-CMP-23; antes `serviceContracts` (M02); PA-CMP-16) |
| `supplierId` | uniqueidentifier | [VERIFICAR] | — | `suppliers` (M12) |
| `period` | [VERIFICAR] | [VERIFICAR] | — | — |
| `cutoffDate` | Date | [VERIFICAR] | — | — |
| `lines` | array | [VERIFICAR] | [{ packageId, activeSubscribers, price, amount }] | — |
| `minimumApplied` | [VERIFICAR] | [VERIFICAR] | — | — |
| `total` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `adjustsSettlementId` | uniqueidentifier | No | — | `signalRightsSettlements` (M12); antes implícita por el nombre |
| `reportRef` | string | [VERIFICAR] | informe de M02 | — (clave del informe de abonados activos que emite M02; no es referencia) |
| `declarationStoredFileId` | uniqueidentifier | [VERIFICAR] | — | `storedFiles` (T01) |
| `invoiceId` | uniqueidentifier | No | — | `supplierInvoices` (M12) (factura de la programadora; antes `invoices` (M05); PA-CMP-16) |
| `status` | enum | [VERIFICAR] | Valores: `draft`, `approved`, `invoiced`, `voided`. | — |
| `approvedBy` | uniqueidentifier | [VERIFICAR] | — | `memberships` (T02) |
| `approvedAt` | Date | [VERIFICAR] | }`. Índice único `{tenantId, contractId, period, adjustsSettlementId | — |

## 8. Estados y transiciones

### 8.1 Solicitud de aprovisionamiento

Estado inicial: `draft`.

| Origen | Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|---|
| — | `draft` | Solicitante | — | — | — |
| `draft` | `pendingApproval` | Solicitante | Ítems válidos; destinatario si P2705 | Tarea T11 | `draft` (retirar) |
| `pendingApproval` | `approved` | Aprobador(es) | Banda; doble si aplica; aprobador ≠ solicitante | `cmp.supplyRequest.approved` | — |
| `pendingApproval` | `rejected` | Aprobador | Motivo | Aviso | Nueva SA |
| `draft` | `approved` | Sistema | Política "sin aprobación" para monto/área | — | — |
| `approved` | `inProcess` | Comprador | Tomada por compras | `takenByPurchasingAt` | `approved` |
| `approved`/`inProcess` | `partiallyProcessed` / `processed` | Sistema | Ítems vinculados a cotización/OC/recepción | — | Deshacer vínculo |
| `approved`/`inProcess`/`partiallyProcessed` | `discarded` | Comprador | Motivo | Ítems pendientes cerrados | `inProcess` ("marcar pendiente") |
| cualquiera sin ítems procesados | `cancelled` | Solicitante/aprobador | Motivo | — | No |

### 8.2 Solicitud de cotización y evento de selección

Estado inicial: `draft`.

`draft` → `sent` → `quoted` (todos los ítems con precio) → `evaluated` (ningún ítem sin evaluar) → `processed` (algún ítem generó OC); `sent`/`quoted` → `rejected` (motivo); `sent` → `expired` (job). Evento: `draft` → `published` → `closed` (vence plazo de ofertas) → `opened` (acta) → `awarded` (planilla) / `cancelled`.

### 8.3 Orden de compra

Estado inicial: `draft`.

| Origen | Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|---|
| — | `draft` | Comprador | — | — | — |
| `draft` | `pendingApproval` | Comprador | Completa (P2335); distribución 100 % | Tarea T11 por banda | `draft` |
| `draft` | `approved` | Sistema | Banda "sin aprobación" | Igual que aprobación | — |
| `pendingApproval` | `approved` | Aprobador | Capability, banda, segregación | `cmp.purchaseOrder.approved` (compromiso) | `cancelled` |
| `pendingApproval` | `rejected` | Aprobador | Motivo | — | `draft` (nueva revisión) |
| `approved` | `sent` | Comprador/sistema | — | Mail (P2905), portal | — |
| `approved`/`sent` | `pendingApproval` (revisión) | Comprador | Cambio fuera de tolerancia | Nueva `revision` | — |
| `sent` | `partiallyReceived` / `received` | Sistema | Recepciones | — | Anulación de recepción |
| `received`/`partiallyReceived` | `invoiced` / `partiallyInvoiced` | Sistema | Facturas | — | Anulación de factura |
| `approved`…`partiallyReceived` | `closed` | Comprador | Motivo; saldo no se recibirá | `cmp.purchaseOrder.cancelled` (remanente) | No |
| `draft`…`sent` sin recepciones | `cancelled` | Comprador + aprobador | Motivo | `cmp.purchaseOrder.cancelled` | No |

### 8.4 Recepción

Estado inicial: `draft`.

`draft` → `confirmed` (`cmp.receipt.confirmed`; `stockStatus = pending` si hay productos con stock) → M13 `stk.goods.received` (EVT-STK-01) ⇒ `stockStatus = confirmed`; M13 rechaza (`stk.goods.rejected`, EVT-STK-24) ⇒ `stockStatus = rejected` y alerta. `confirmed` → `voided` solo sin facturas vinculadas y con período abierto (pide reversión a M13). `confirmed` → `invoiced`/`partiallyInvoiced` por vínculos.

### 8.5 Comprobante de proveedor

Estado inicial: `draft`.

| Origen | Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|---|
| — | `draft` | Usuario, portal, Mis Comprobantes, IA | — | — | Descartar |
| `draft` | `registered` | Cuentas a pagar | Validaciones RN-CMP-033 a 041 | `cmp.supplierInvoice.registered`; conciliación 3 vías | `voided` |
| `registered` | `onHold` | Sistema | Excepción abierta o sin conformidad | `paymentRelease.blocked` | Al resolver |
| `registered`/`onHold` | `releasedForPayment` | Sistema o habilitador | Conciliado o habilitación manual con motivo | `cmp.supplierInvoice.released` | `onHold` |
| `releasedForPayment` | `inPayment` | Sistema | Incluida en OP aprobada | Saldo comprometido | OP anulada → `releasedForPayment` |
| `inPayment` | `partiallyPaid` / `paid` | Sistema | `tes.paymentExecution.executed` | Saldo cancelado | Ejecución anulada |
| `registered`/`onHold`/`releasedForPayment` | `voided` | Supervisor | Sin OP; período abierto | `cmp.supplierInvoice.voided` | No |

### 8.6 Orden de pago

Estado inicial: `draft`.

| Origen | Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|---|
| — | `draft` | Responsable de pagos | Comprobantes habilitados | Retenciones propuestas (M06) | Descartar |
| `draft` | `pendingApproval` | Responsable | Neto > 0 o anticipo | Tarea T11 | `draft` |
| `pendingApproval` | `approved` | Aprobador | Banda, segregación, CBU aprobado si transferencia | M06 confirma retenciones; `cmp.paymentOrder.approved` | `cancelled` |
| `approved` | `inExecution` | M14 | Ejecución creada | — | — |
| `inExecution` | `paid` | Sistema | `tes.paymentExecution.executed` | Saldos cancelados | Ejecución anulada |
| `inExecution`/`paid` | `approved` | Sistema | `tes.paymentExecution.voided` con reinstrumentación | — | — |
| `draft`/`pendingApproval`/`approved` | `cancelled` | Supervisor (`cmp.ordenesPago.anular`) | Sin ejecución vigente en M14; períodos abiertos | Repone saldos; anula anticipos y retenciones; `cmp.paymentOrder.cancelled` | No |

### 8.7 Excepción de conciliación (`matchExceptions.decision`)

Estado inicial: alta → `pending` (el estado es `decision`, §7.9; PA-CMP-16).

`pending` → `accepted` | `claimCreditNote` (se espera NC; al llegar, `resolved`) | `rejected` (factura devuelta al proveedor) — todas con decisión T11; ninguna se borra.

### 8.8 Estados iniciales y máquinas sin transiciones (corrección 05-11-2026)

Corrección del 05-11-2026 (PA-CMP-16): §8.2, §8.4 y §8.7 están en texto corrido y el §7.11 enumera valores sin transiciones para `supplierAdvances`, `supplyBalances` y `signalRightsSettlements`; `signalRightsContracts.status` no tenía valores y el `cancelled` del evento de selección no tenía origen. Esta tabla lo explicita sin cambiar el texto anterior. Estado inicial: ver las filas `(alta)`.

| Colección | Desde | Hacia | Disparador | Guarda | Evento |
|---|---|---|---|---|---|
| `quoteRequests` | (alta) | `draft` | Carga de la solicitud de cotización | — | — |
| `sourcingEvents` | (alta) | `draft` | Alta del evento de selección | — | — |
| `sourcingEvents` | `draft`, `published`, `closed`, `opened` | `cancelled` | Anulación del evento antes de adjudicar | Motivo obligatorio | — |
| `supplierReceipts` | (alta) | `draft` | Carga de la recepción | — | — |
| `matchExceptions.decision` | (alta) | `pending` | Conciliación con diferencia | — | — |
| `supplierAdvances` | (alta) | `open` | OP de anticipo aprobada | — | — |
| `supplierAdvances` | `open` | `partiallyApplied` | Aplicación parcial a una factura | — | — |
| `supplierAdvances` | `open`, `partiallyApplied` | `applied` | Aplicación del saldo total | — | — |
| `supplierAdvances` | `open` | `voided` | Anulación de la OP que lo originó (§8.6) | Sin aplicaciones | — |
| `supplyBalances` | (alta) | `draft` | Cálculo del balance de compra y pérdidas del período | — | — |
| `supplyBalances` | `draft` | `approved` | Aprobación (`approvedBy`) | — | — |
| `signalRightsContracts` | (alta) | `draft` | Carga del contrato con la programadora | — | — |
| `signalRightsContracts` | `draft` | `active` | Aprobación del contrato | — | — |
| `signalRightsContracts` | `active` | `ended` | Fin de vigencia (`validTo`) o rescisión | — | — |
| `signalRightsSettlements` | (alta) | `draft` | Liquidación mensual por abonados activos | — | — |
| `signalRightsSettlements` | `draft` | `approved` | Aprobación (`approvedBy`) | — | EVT-CMP-17 `cmp.signalRightsSettlement.approved` |
| `signalRightsSettlements` | `approved` | `invoiced` | Registro de la factura de la programadora (`invoiceId`) | — | — |
| `signalRightsSettlements` | `draft`, `approved` | `voided` | Anulación; un ajuste posterior usa `adjustsSettlementId` | — | EVT-CMP-17 `cmp.signalRightsSettlement.voided` |

## 9. Procesos y flujos

### 9.1 Circuito completo (CU-19)

1. Depósito crea la SA de 10 medidores para reposición (línea con servicio "energía", centro de costo "redes").
2. La SA se aprueba (T11).
3. Compras genera cotizaciones a 3 proveedores; compara y adjudica a ARS 20.000 por unidad.
4. Se crea OC-001 por 10 × ARS 20.000 = ARS 200.000; aprobación por banda; envío al proveedor; compromiso de fondos.
5. Llegan 6: el receptor registra la recepción; M13 ingresa 6 al depósito; OC queda con 4 pendientes.
6. Llega la factura por 10: la conciliación detecta excepción de cantidad por 4 (ARS 80.000 en disputa); la factura queda `onHold` o con habilitación parcial de ARS 120.000 según política.
7. Se decide: reclamar NC o esperar la entrega; al recibirse las 4 restantes se cierra la excepción.
8. Se prepara la OP, M06 calcula retenciones, se aprueba; M14 ejecuta; M12 marca pagado.

### 9.2 Orden de pago con retención (CU-FIS-01)

Proveedor PROV-DEMO-001 con factura de ARS 100.000 habilitada → OP en borrador → `fis.service.calculateWithholdings` (antes `fis.withholding.calculate`) devuelve RET-DEMO-001 por ARS 2.000 → neto ARS 98.000 → aprobación → M06 confirma la retención y numera el certificado → `cmp.paymentOrder.approved` → M14 ejecuta la transferencia por 98.000 → `tes.paymentExecution.executed` → factura cancelada por 100.000 (98.000 + 2.000). Un reintento de la aprobación (misma Idempotency-Key) no genera otra retención.

### 9.3 Factura anticipada y servicios

Factura que llega antes del remito: se registra, queda `onHold` (sin recepción); la recepción posterior consume el pendiente de la factura (vínculo 5 → 4) y la conciliación la libera. Servicios: la conformidad del responsable reemplaza la recepción.

### 9.4 Importación de Mis Comprobantes

M06 importa el archivo y concilia (JOB-FIS-12) → entrega la lista de comprobantes recibidos no registrados → `JOB-CMP-04` crea borradores con proveedor por CUIT (si no existe, borrador de proveedor con datos del padrón; desde DEC-097 el borrador busca la persona por CUIT en M01 y, si no existe, deja propuesta la persona con los datos del padrón para que cuentas a pagar la confirme en el alta asistida de M01 antes de registrar; nunca se crea un proveedor sin `personId`) → cuentas a pagar revisa, completa imputación y registra → la conciliación de M06 se actualiza.

### 9.5 Lectura con IA

Usuario sube PDF → `JOB-CMP-05` (si el tenant habilitó IA) extrae campos con confianza → la pantalla muestra propuesta lado a lado con el PDF → el usuario corrige y registra (validaciones normales) → se audita resultado y correcciones.

### 9.6 Portal de proveedores

Invitación T02 → proveedor ve OC, cotiza, sube comprobantes con PDF → cuentas a pagar registra o rechaza con motivo → el proveedor sigue estados y descarga certificados de retención y comprobantes de pago.

### 9.7 Jobs

| Job | Frecuencia | Descripción | Reintento / recuperación |
|---|---|---|---|
| `JOB-CMP-01` `cmp:vencer-cotizaciones` | Diario 01:00 | Marca `expired` las cotizaciones vencidas | Idempotente |
| `JOB-CMP-02` `cmp:conciliar-tres-vias` | Al registrar factura o recepción; nocturno de repaso | Recalcula conciliación y excepciones | Idempotente por factura |
| `JOB-CMP-03` `cmp:alertas-vencimientos` | Diario | Facturas por vencer, documentos de proveedor vencidos, OC atrasadas | Idempotente por (documento, fecha) |
| `JOB-CMP-04` `cmp:borradores-mis-comprobantes` | Tras JOB-FIS-12 | Crea borradores desde comprobantes no registrados | Idempotente por línea de importación |
| `JOB-CMP-05` `cmp:lectura-ia` | A demanda | Extracción por IA | 3 reintentos; sin reintento si el proveedor de IA rechaza el contenido |
| `JOB-CMP-06` `cmp:desempeno-proveedores` | Semanal | Recalcula indicadores de desempeño | Reanudable |
| `JOB-CMP-07` `cmp:expandir-previsiones` | Diario | Publica previsiones a M14 para el horizonte configurado | Idempotente |
| `JOB-CMP-08` `cmp:aprobacion-masiva` | A demanda | Ejecuta aprobaciones masivas validando por documento | Reanudable; resultado por documento |
| `JOB-CMP-09` `cmp:liquidar-derechos-senales` | Mensual (día configurable tras el cierre del período de M02) y a demanda | Liquida derechos de señales por contrato vigente con el informe de abonados activos por paquete de M02 (API-CAT-56, RF-CAT-116; credencial de servicio de M12) (RF-CMP-155; HUE-TV-01) | Idempotente por (contrato, período); reanudable |
| `JOB-CMP-10` `cmp:controlar-compra-mayorista` | Al registrar una factura mayorista y diario de repaso | Controla renglones contra la medición propia de M03 (API-MED-78) y recalcula el balance del período (RF-CMP-150, RF-CMP-151; HUE-ELE-01, HUE-GAS-04) | Idempotente por factura; reprocesa al llegar la medición |

Todos en BullMQ con 5 reintentos exponenciales (salvo indicación) y cola de errores visible en T07.

## 10. Pantallas

Pantallas admin con layout CNX (filtros persistentes, tabla paginada con columnas configurables, panel lateral, acciones por fila, exportación según permiso, estados vacíos con acción sugerida, ayuda contextual del diccionario). El portal de proveedores usa la app `landing` con rol `supplier`.

### PAN-CMP-01 — Proveedores (listado)

- **App / ruta:** admin `/cmp/proveedores` · **Capability:** `cmp.proveedores.ver`
- **Filtros:** estado, rubro, tipo de producto, condición IVA, con CBU pendiente, con documentos vencidos, valoración, paga a otros, empleado (solo con `cmp.proveedoresEmpleados.ver`).
- **Columnas:** código, razón social, CUIT, condición IVA, rubros, saldo, vencido, puntaje, estado. Razón social, CUIT y condición IVA vienen de la persona de M01 (`identitySnapshot`, DEC-097).
- **Acciones:** nuevo (abre el alta asistida de M01, PAN-PER-04 en modo búsqueda: buscar por CUIT o nombre, reutilizar la persona existente o crearla con control de duplicados, y después completar los datos del rol; DEC-097); abrir; bloquear/activar; enviar comunicación; exportar.
- **Vacío:** "Todavía no hay proveedores. Agregá uno o importalos."
- **Equivalencia INV:** `ConsultaProveedores`, `frmSeleccionarProveedores`, `SelectorProveedor`.

### PAN-CMP-02 — Ficha del proveedor

- **App / ruta:** admin `/cmp/proveedores/:id` · **Capability:** `cmp.proveedores.editar` (lectura con `ver`)
- **Pestañas:** **Datos** (identidad de la persona de M01 en solo lectura: razón social, nombre de fantasía, CUIT con estado de verificación, condición IVA, domicilios y contactos, con enlace "Editar en Personas" según `per.personas.editar`; datos del rol editables: IIBB y jurisdicciones, contactos comerciales, condición de pago, moneda, cuenta contable; consulta de padrón M06 embebida; DEC-097. Antes: "fiscales, domicilios, contactos, consulta de padrón M06 embebida"); **Cuentas bancarias** (alta con aprobación); **Retenciones** (componente de M06: regímenes, exclusiones, certificados); **Tipos de producto y rubros**; **Autorizados** (con caducidad); **Valoraciones** (manuales + indicadores); **Documentos y trámites** (vencimientos); **Notas**; **Cuentas vinculadas** (M01); **Cuenta corriente**; **Comunicaciones**; **Portal** (invitaciones); **Historial**.
- **Modales:** alta/edición de CBU; valoración; envío de email/SMS/WhatsApp; invitación al portal.
- **Equivalencia INV:** `abm_Proveed` (`btnAddCbu`, `btnAddTramite`, `btnAgregarValorac`, `btnBCRA`, `btnBlanqueo`, `EnviarMail`, `btnEnvioSms`, `btnWpp`, `btnAgregarCuenta`), `abm_Proveed_Aut`, `abm_proveed_cbu`, `frmProveed_Valoraciones`, `frmProveedorPassGenerica` (reemplazada por invitación).

### PAN-CMP-03 — Catálogos de compras

- **App / ruta:** admin `/cmp/config/catalogos` · **Capability:** `cmp.catalogos.configurar`
- **Contenido:** pestañas de conceptos de compra, rubros de proveedores, destinatarios, unidades de gasto, combustibles, modalidades de contratación (con umbrales y documentos exigidos), departamentos y lugares de entrega.
- **Equivalencia INV:** `abm_Combustible` y ABM genéricos de `CON_COM`, `RUBPROV`, `DESTINATARIO_SAPROV`, `UNIDADES_GASTOS`.

### PAN-CMP-04 — Solicitudes de aprovisionamiento

- **App / ruta:** admin `/cmp/solicitudes`; pwa-empleado `/compras/solicitudes` · **Capability:** `cmp.solicitudes.ver`
- **Filtros:** estado, aprobación (todas/aprobadas/sin aprobar), solicitante, destinatario, criticidad, modalidad, servicio, centro de costo, fecha.
- **Columnas:** número, fecha, solicitante, destinatario, criticidad, monto estimado, estado, % procesado.
- **Acciones:** nueva; aprobar/rechazar (bandeja T11); aprobación masiva; tomar (en proceso); descartar; marcar pendiente; anular; generar cotización u OC; imprimir para firma.
- **Vacío:** "No hay solicitudes pendientes."

### PAN-CMP-05 — Editor de solicitud

- **App / ruta:** admin `/cmp/solicitudes/:id`, pwa-empleado · **Capability:** `cmp.solicitudes.crear`/`editar`
- **Layout:** cabecera (destinatario, criticidad, modalidad, fecha requerida); grilla de ítems con producto/concepto/texto, cantidad, costo estimado y última compra, imputación (servicio, centro de costo, OT/obra, depósito) y distribución; panel de disponibilidad comprometida y pedidos abiertos; historial de aprobación.

### PAN-CMP-06 — Cotizaciones y comparativo

- **App / ruta:** admin `/cmp/cotizaciones`, `/cmp/cotizaciones/grupo/:groupId` · **Capability:** `cmp.cotizaciones.ver`/`editar`/`evaluar`
- **Contenido:** listado por grupo y proveedor; carga de precios; envío por mail/portal; **cuadro comparativo** (ítem × proveedor, total en pesos, plazo, valoración, menor precio resaltado); adjudicación por ítem con cantidad y justificación; generar OC.

### PAN-CMP-07 — Concursos y licitaciones

- **App / ruta:** admin `/cmp/concursos/:id` · **Capability:** `cmp.concursos.ver`, `cmp.concursos.editar`, `cmp.concursos.adjudicar` (antes `cmp.concursos.*`)
- **Contenido:** datos y pliego, invitados, plazo de ofertas (sobres cerrados), apertura con acta, planilla de adjudicación, carátula de expediente; documentos en el expediente T11.

### PAN-CMP-08 — Órdenes de compra (listado)

- **App / ruta:** admin `/cmp/ordenes` · **Capability:** `cmp.ordenes.ver`
- **Filtros:** estado, proveedor, tipo (estándar/marco/liberación), fecha de entrega, atrasadas, servicio, centro de costo, solicitante.
- **Columnas:** número, proveedor, fecha, entrega, total, recibido %, facturado %, estado, aprobación.
- **Acciones:** nueva; abrir; enviar; cerrar; cancelar; bandeja de aprobación; exportar.

### PAN-CMP-09 — Editor de orden de compra

- **App / ruta:** admin `/cmp/ordenes/:id` · **Capability:** `cmp.ordenes.editar`
- **Layout:** cabecera (condiciones, entrega, moneda, fechas obligatorias según configuración); ítems con imputación y distribución por servicio; pestañas **Recepciones**, **Facturas**, **Revisiones**, **Aprobación**, **Trazabilidad** (SA → cotización → OC → recepción → factura por ítem), **Historial**.
- **Equivalencia INV:** formulario de orden de compra/nota de pedido (no inventariado en ProMod; reglas en `frmComprobantes_Handler.GuardarOrdenDeCompra`).

### PAN-CMP-10 — Recepciones

- **App / ruta:** admin `/cmp/recepciones`, `/cmp/recepciones/nueva`; pwa-empleado (depósito) · **Capability:** `cmp.recepciones.registrar`
- **Contenido:** búsqueda de OC pendientes del proveedor (solo OC con P2649); cantidades recibidas por línea, excesos, series/lotes (componente M13), depósito (no exigido si no lleva stock, P2560), ítem pendiente de ingreso, conformidad de servicio, devolución al proveedor; estado de stock informado por M13; impresión de etiquetas (P3071).

### PAN-CMP-11 — Comprobantes de proveedor (listado)

- **App / ruta:** admin `/cmp/comprobantes` · **Capability:** `cmp.comprobantes.ver`
- **Filtros:** estado, proveedor, tipo, fecha contable, vencimiento, origen (manual/portal/ARCA/IA), conciliación, habilitación de pago.
- **Columnas:** proveedor, tipo-punto-número, fecha, total, saldo, vencimiento, conciliación, habilitación, estado.
- **Acciones:** nuevo; abrir; habilitar pago (`cmp.pago.habilitar`); anular; exportar.

### PAN-CMP-12 — Editor de comprobante de proveedor

- **App / ruta:** admin `/cmp/comprobantes/:id` · **Capability:** `cmp.comprobantes.registrar`
- **Layout:** visor del PDF a la izquierda (si hay); a la derecha cabecera (CAE/CAI con verificación M06), importes por alícuota y percepciones con control de diferencias en vivo, ítems importables desde OC/recepciones, imputación (rubro, servicio, centro de costo con % IVA, obra, unidad de gasto), combustible, vencimientos/cuotas, descuento global; pestaña **Conciliación 3 vías** con excepciones.
- **Modales:** confirmar actualización de precio (P426); observación obligatoria al modificar concepto (P2533); tipo no permitido para la condición IVA (P2365).

### PAN-CMP-13 — Conciliación de 3 vías

- **App / ruta:** admin `/cmp/conciliacion` · **Capability:** `cmp.conciliacion.ver`/`aprobarExcepcion`
- **Contenido:** tablero de facturas conciliadas, con excepción, retenidas y habilitadas; recepciones sin factura; facturas sin recepción o sin OC; detalle de excepción con esperado/real/diferencia, decisión y workflow.

### PAN-CMP-14 — Órdenes de pago (listado)

- **App / ruta:** admin `/cmp/ordenes-pago` · **Capability:** `cmp.ordenesPago.ver`
- **Filtros:** estado, proveedor, fecha de pago, estado de ejecución (M14).
- **Columnas:** número, proveedor, fecha, bruto, retenciones, neto, aprobación, ejecución, estado.
- **Acciones:** nueva; aprobar; cancelar; enviar comprobantes masivamente (P2418); exportar.

### PAN-CMP-15 — Editor de orden de pago

- **App / ruta:** admin `/cmp/ordenes-pago/:id` · **Capability:** `cmp.ordenesPago.crear`/`editar`
- **Layout:** selección de comprobantes habilitados (incluye otros proveedores si "paga a otros"), NC y anticipos pendientes (aviso P2777); anticipos nuevos; descuento; **panel de retenciones** de M06 con base, mínimo, escala, acumulado, retenido previo, importe y ajuste (P2836); totales bruto/retenciones/neto; CBU aprobado; asiento propuesto (P2308); historial y estado de ejecución.
- **Equivalencia INV:** `frmCargaRetenciones`, `frmCargaMedioDePago_Simple` (los medios pasan a M14).

### PAN-CMP-16 — Cuenta corriente y antigüedad de proveedores

- **App / ruta:** admin `/cmp/cuenta-corriente` · **Capability:** `cmp.comprobantes.ver`
- **Contenido:** movimientos por proveedor con saldo, vencidos por tramos, a vencer, fecha de corte.

### PAN-CMP-17 — Bandeja de comprobantes recibidos (portal, ARCA, IA)

- **App / ruta:** admin `/cmp/recibidos` · **Capability:** `cmp.portal.revisar`, `cmp.misComprobantes.importar`, `cmp.ia.usar`
- **Contenido:** pestañas **Portal** (pendientes de revisión con PDF), **Mis Comprobantes** (borradores desde M06 y diferencias), **Lectura IA** (subir PDF, propuesta con confianza por campo, corregir y registrar).
- **Vacío:** "No hay comprobantes para revisar."

### PAN-CMP-18 — Previsiones de pagos

- **App / ruta:** admin `/cmp/previsiones` · **Capability:** `cmp.comprobantes.ver`
- **Contenido:** ABM de previsiones periódicas y vista del flujo proyectado (previsiones + facturas con saldo + cheques propios de M14).

### PAN-CMP-19 — Comunicaciones y circulares

- **App / ruta:** admin `/cmp/comunicaciones` · **Capability:** `cmp.proveedores.editar`
- **Contenido:** circulares por rubro/tipo de producto, plantillas, historial de envíos y entregas.

### PAN-CMP-20 — Políticas de aprobación y tolerancias

- **App / ruta:** admin `/cmp/config/politicas` · **Capability:** `cmp.politicas.configurar`
- **Contenido:** bandas por monto/categoría/área para SA, OC, excepciones, habilitación de pago y OP (definidas en T11); tolerancias de cantidad y precio; categorías permitidas sin OC; reglas de segregación.

### PAN-CMP-21 — Configuración de compras

- **App / ruta:** admin `/cmp/config` · **Capability:** `cmp.config.configurar`
- **Contenido:** parámetros de la sección 14 agrupados con ayuda y origen V2.

### PAN-CMP-22 — Reportes de compras

- **App / ruta:** admin `/cmp/reportes` · **Capability:** `cmp.comprobantes.ver` + `exportar`
- **Contenido:** catálogo de la sección 15 con parámetros y fecha de corte.

### PAN-CMP-23 — Portal de proveedores

- **App / ruta:** landing `/p/:tenantSlug/proveedores` (inicio, cotizaciones, órdenes, comprobantes, pagos, certificados, datos) · **Capability:** `cmp.portal.verOrdenes`, `cmp.portal.cotizar`, `cmp.portal.subirComprobante`, `cmp.portal.verPagos` (rol `supplier`; antes `cmp.portal.*`)
- **Contenido:** cotizar invitaciones y concursos (sobre cerrado), confirmar OC, subir factura con PDF, ver estados (pendiente, registrado, rechazado con motivo, habilitado, en pago, pagado), descargar certificados de retención y comprobantes de pago, solicitar cambio de CBU (pasa a aprobación).
- **Vacío:** "No tenés órdenes ni comprobantes pendientes con esta cooperativa."

### PAN-CMP-24 — Registro simplificado de ingreso (piloto)

- **App / ruta:** admin `/cmp/ingreso-rapido` · **Capability:** `cmp.recepciones.registrar`
- **Contenido:** proveedor del padrón mínimo, productos serializados y series (componente M13), comprobante opcional (O3; reemplazado por PAN-CMP-10 en O8).

### PAN-CMP-25 — Abastecimiento mayorista y balance (HUE-ELE-01, HUE-GAS-04)

- **App / ruta:** admin `/cmp/abastecimiento` · **Capability:** `cmp.comprobantes.ver`; importar con `cmp.comprobantes.registrar`; aprobar balance con `cmp.abastecimiento.aprobar`
- **Contenido:** importación del archivo del mayorista (FI-INT-33) o carga manual; por factura, renglones por punto con cantidad facturada, medida (M03) y diferencia; excepciones a decidir; balance del período por servicio y zona (comprado, medido en frontera, facturado a usuarios, pérdida y %).
- **Vacío:** "No hay facturas mayoristas para el período. Importá el archivo del proveedor."

### PAN-CMP-26 — Derechos de señales (HUE-TV-01)

- **App / ruta:** admin `/cmp/derechos-senales` · **Capability:** `cmp.comprobantes.ver`; liquidar con `cmp.derechosSenales.liquidar`; aprobar con `cmp.derechosSenales.aprobar`
- **Contenido:** contratos por programadora; liquidaciones por período con abonados activos por paquete (informe de M02), precio, mínimo garantizado y total; descarga de la declaración; conciliación con la factura de la programadora.
- **Vacío:** "No hay contratos de señales vigentes."

## 11. API

| ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-CMP-001 | GET | `/api/admin/cmp/suppliers` | `cmp.proveedores.ver` | Listar proveedores | Sí |
| API-CMP-002 | POST | `/api/admin/cmp/suppliers` | `cmp.proveedores.crear` | Crear proveedor | Sí (Idempotency-Key) |
| API-CMP-003 | GET | `/api/admin/cmp/suppliers/:id` | `cmp.proveedores.ver` | Ficha | Sí |
| API-CMP-004 | PATCH | `/api/admin/cmp/suppliers/:id` | `cmp.proveedores.editar` | Editar | Sí (`If-Match`) |
| API-CMP-005 | POST | `/api/admin/cmp/suppliers/:id/status` | `cmp.proveedores.editar` | Bloquear/activar/inactivar | Sí |
| API-CMP-006 | POST | `/api/admin/cmp/suppliers/:id/bank-accounts` | `cmp.proveedores.editar` | Alta/cambio de CBU (queda pendiente) | Sí |
| API-CMP-007 | POST | `/api/admin/cmp/suppliers/:id/bank-accounts/:accountId/approve` | `cmp.proveedores.aprobarCbu` | Aprobar CBU | Sí |
| API-CMP-008 | POST | `/api/admin/cmp/suppliers/:id/evaluations` | `cmp.proveedores.editar` | Valoración | No |
| API-CMP-009 | POST | `/api/admin/cmp/suppliers/:id/notes` | `cmp.proveedores.editar` | Nota | No |
| API-CMP-010 | POST | `/api/admin/cmp/suppliers/:id/portal-invitations` | `cmp.proveedores.editar` | Invitar al portal | Sí |
| API-CMP-011 | GET | `/api/admin/cmp/suppliers/:id/ledger` | `cmp.comprobantes.ver` | Cuenta corriente a fecha de corte | Sí |
| API-CMP-012 | POST | `/api/admin/cmp/correspondence` | `cmp.proveedores.editar` | Circular o comunicación | Sí |
| API-CMP-013 | GET/POST/PATCH | `/api/admin/cmp/catalogs/:kind` | `cmp.catalogos.configurar` | Conceptos, rubros, destinatarios, unidades, combustibles, modalidades | Sí |
| API-CMP-014 | GET/POST/PATCH | `/api/admin/cmp/forecasts` | `cmp.comprobantes.ver`/`editar` | Previsiones | Sí |
| API-CMP-020 | GET | `/api/admin/cmp/supply-requests` | `cmp.solicitudes.ver` | Listar SA | Sí |
| API-CMP-021 | POST | `/api/admin/cmp/supply-requests` | `cmp.solicitudes.crear` | Crear SA | Sí (Idempotency-Key) |
| API-CMP-022 | PATCH | `/api/admin/cmp/supply-requests/:id` | `cmp.solicitudes.editar` | Editar borrador | Sí (`If-Match`) |
| API-CMP-023 | POST | `/api/admin/cmp/supply-requests/:id/submit` | `cmp.solicitudes.crear` | Enviar a aprobación | Sí |
| API-CMP-024 | POST | `/api/admin/cmp/supply-requests/:id/decision` | `cmp.solicitudes.aprobar` | Aprobar/rechazar | Sí |
| API-CMP-025 | POST | `/api/admin/cmp/supply-requests/bulk-approve` | `cmp.solicitudes.aprobar` | Aprobación masiva (job) | Sí |
| API-CMP-026 | POST | `/api/admin/cmp/supply-requests/:id/take` · `/discard` · `/reopen` · `/cancel` | `cmp.solicitudes.procesar`/`descartar`/`anular` | Transiciones | Sí |
| API-CMP-027 | GET | `/api/admin/cmp/products/:productId/commitments` | `cmp.solicitudes.ver` | Disponibilidad comprometida y pedidos abiertos | Sí |
| API-CMP-030 | POST | `/api/admin/cmp/quote-requests` | `cmp.cotizaciones.crear` | Generar cotizaciones desde SA | Sí |
| API-CMP-031 | PATCH | `/api/admin/cmp/quote-requests/:id` | `cmp.cotizaciones.editar` | Cargar precios | Sí (`If-Match`) |
| API-CMP-032 | POST | `/api/admin/cmp/quote-requests/:id/send` · `/reject` | `cmp.cotizaciones.editar` | Enviar / rechazar | Sí |
| API-CMP-033 | GET | `/api/admin/cmp/quote-groups/:groupId/comparison` | `cmp.cotizaciones.ver` | Cuadro comparativo | Sí |
| API-CMP-034 | POST | `/api/admin/cmp/quote-groups/:groupId/award` | `cmp.cotizaciones.evaluar` | Adjudicar ítems | Sí |
| API-CMP-035 | GET/POST/PATCH | `/api/admin/cmp/sourcing-events` | `cmp.concursos.ver` (GET; nueva), `cmp.concursos.editar` (POST, PATCH; nueva), `cmp.concursos.adjudicar` (adjudicación) (antes `cmp.concursos.*`) | Concursos y licitaciones | Sí |
| API-CMP-036 | POST | `/api/admin/cmp/sourcing-events/:id/open` · `/award` | `cmp.concursos.adjudicar` | Apertura y adjudicación | Sí |
| API-CMP-040 | GET | `/api/admin/cmp/purchase-orders` | `cmp.ordenes.ver` | Listar OC | Sí |
| API-CMP-041 | POST | `/api/admin/cmp/purchase-orders` | `cmp.ordenes.crear` | Crear OC (estándar, marco, liberación) | Sí (Idempotency-Key) |
| API-CMP-042 | PATCH | `/api/admin/cmp/purchase-orders/:id` | `cmp.ordenes.editar` | Editar / nueva revisión | Sí (`If-Match`) |
| API-CMP-043 | POST | `/api/admin/cmp/purchase-orders/:id/submit` · `/decision` | `cmp.ordenes.crear` / `cmp.ordenes.aprobar` | Aprobación | Sí |
| API-CMP-044 | POST | `/api/admin/cmp/purchase-orders/:id/send` | `cmp.ordenes.enviar` | Enviar al proveedor | Sí |
| API-CMP-045 | POST | `/api/admin/cmp/purchase-orders/:id/close` · `/cancel` | `cmp.ordenes.cerrar` | Cerrar / cancelar | Sí |
| API-CMP-046 | GET | `/api/admin/cmp/purchase-orders/:id/traceability` | `cmp.ordenes.ver` | Trazabilidad por ítem | Sí |
| API-CMP-050 | POST | `/api/admin/cmp/receipts` | `cmp.recepciones.registrar` | Registrar recepción/conformidad/devolución | Sí (Idempotency-Key / `clientMutationId`) |
| API-CMP-051 | POST | `/api/admin/cmp/receipts/:id/void` | `cmp.recepciones.anular` | Anular recepción | Sí |
| API-CMP-052 | GET | `/api/admin/cmp/receipts/pending-invoice` | `cmp.recepciones.ver` | Recepciones sin factura | Sí |
| API-CMP-060 | GET | `/api/admin/cmp/supplier-invoices` | `cmp.comprobantes.ver` | Listar comprobantes | Sí |
| API-CMP-061 | POST | `/api/admin/cmp/supplier-invoices` | `cmp.comprobantes.registrar` | Crear borrador o registrar | Sí (Idempotency-Key) |
| API-CMP-062 | PATCH | `/api/admin/cmp/supplier-invoices/:id` | `cmp.comprobantes.editar` | Editar borrador | Sí (`If-Match`) |
| API-CMP-063 | POST | `/api/admin/cmp/supplier-invoices/:id/register` | `cmp.comprobantes.registrar` | Registrar (validaciones + conciliación) | Sí |
| API-CMP-064 | POST | `/api/admin/cmp/supplier-invoices/:id/release` | `cmp.pago.habilitar` | Habilitación manual de pago | Sí |
| API-CMP-065 | POST | `/api/admin/cmp/supplier-invoices/:id/void` | `cmp.comprobantes.anular` | Anular | Sí |
| API-CMP-066 | POST | `/api/admin/cmp/supplier-invoices/validate` | `cmp.comprobantes.registrar` | Validar sin guardar (diferencias, duplicado, CAE) | Sí |
| API-CMP-067 | POST | `/api/admin/cmp/advances` | `cmp.anticipos.crear` | Anticipo a proveedor | Sí |
| API-CMP-070 | GET | `/api/admin/cmp/match-exceptions` | `cmp.conciliacion.ver` | Excepciones | Sí |
| API-CMP-071 | POST | `/api/admin/cmp/match-exceptions/:id/decision` | `cmp.conciliacion.aprobarExcepcion` | Decidir excepción | Sí |
| API-CMP-080 | GET | `/api/admin/cmp/payment-orders` | `cmp.ordenesPago.ver` | Listar OP | Sí |
| API-CMP-081 | POST | `/api/admin/cmp/payment-orders` | `cmp.ordenesPago.crear` | Crear OP en borrador | Sí (Idempotency-Key) |
| API-CMP-082 | PATCH | `/api/admin/cmp/payment-orders/:id` | `cmp.ordenesPago.editar` | Editar borrador | Sí (`If-Match`) |
| API-CMP-083 | POST | `/api/admin/cmp/payment-orders/:id/withholdings/calculate` | `cmp.ordenesPago.editar` | Recalcular retenciones (M06) | Sí |
| API-CMP-084 | POST | `/api/admin/cmp/payment-orders/:id/withholdings/:wid/adjust` | `cmp.retenciones.ajustar` | Ajuste manual con motivo | Sí |
| API-CMP-085 | POST | `/api/admin/cmp/payment-orders/:id/submit` · `/decision` | `cmp.ordenesPago.crear` / `cmp.ordenesPago.aprobar` | Aprobación | Sí |
| API-CMP-086 | POST | `/api/admin/cmp/payment-orders/:id/cancel` | `cmp.ordenesPago.anular` | Cancelar OP | Sí |
| API-CMP-087 | POST | `/api/admin/cmp/payment-orders/bulk-send` | `cmp.ordenesPago.ver` | Envío masivo de OP y certificados | Sí |
| API-CMP-090 | GET | `/api/admin/cmp/inbox/portal` · `/arca` | `cmp.portal.revisar` / `cmp.misComprobantes.importar` | Bandejas de recibidos | Sí |
| API-CMP-091 | POST | `/api/admin/cmp/inbox/portal/:id/decision` | `cmp.portal.revisar` | Registrar o rechazar envío del portal | Sí |
| API-CMP-092 | POST | `/api/admin/cmp/ai-extractions` | `cmp.ia.usar` | Subir PDF para lectura IA | Sí (hash del archivo) |
| API-CMP-093 | POST | `/api/admin/cmp/ai-extractions/:id/accept` | `cmp.ia.usar` | Confirmar propuesta (crea borrador) | Sí |
| API-CMP-100 | GET | `/api/admin/cmp/reports/:code` | `cmp.reportes.exportar` (nueva) (antes `cmp.*.exportar`) | Reportes de la sección 15 | Sí |
| API-CMP-101 | GET/PUT | `/api/admin/cmp/settings` | `cmp.config.configurar` | Parámetros | Sí |
| API-CMP-110 | GET | `/api/public/<tenantSlug>/supplier-portal/orders` · `/quotes` · `/invoices` · `/payments` · `/certificates` | `cmp.portal.verOrdenes` (orders), `cmp.portal.cotizar` (quotes), `cmp.portal.subirComprobante` (invoices), `cmp.portal.verPagos` (payments, certificates); rol `supplier` (antes `cmp.portal.*` (rol `supplier`)) | Consultas del portal | Sí |
| API-CMP-111 | POST | `/api/public/<tenantSlug>/supplier-portal/quotes/:id` | `cmp.portal.cotizar` | Cargar oferta | Sí |
| API-CMP-112 | POST | `/api/public/<tenantSlug>/supplier-portal/invoices` | `cmp.portal.subirComprobante` | Subir comprobante con PDF | Sí (CUIT + tipo + punto + número) |
| API-CMP-113 | POST | `/api/public/<tenantSlug>/supplier-portal/orders/:id/acknowledge` | `cmp.portal.verOrdenes` | Confirmar OC y fecha | Sí |
| API-CMP-120 | GET | `/api/v1/ext/cmp/purchase-orders` · `/supplier-invoices` | `cmp.ordenes.ver`, `cmp.comprobantes.ver` (scopes de la API key, cuenta técnica S-API) (antes API key con scope `cmp.read`) | Consulta para integraciones/BI | Sí |
| API-CMP-121 | POST | `/api/admin/cmp/wholesale-supply/imports` | `cmp.comprobantes.registrar` | Importar archivo de factura mayorista de energía o gas (FI-INT-33; HUE-ELE-01, HUE-GAS-04) | Sí (hash del archivo) |
| API-CMP-122 | GET/POST | `/api/admin/cmp/supply-balances` · `/:id/approve` | `cmp.comprobantes.ver` / `cmp.abastecimiento.aprobar` | Consultar y aprobar el balance comprado contra facturado | Sí |
| API-CMP-123 | GET/POST/PATCH | `/api/admin/cmp/signal-rights/contracts` | `cmp.derechosSenales.liquidar` | Contratos de derechos de señales (HUE-TV-01) | Sí (`If-Match`) |
| API-CMP-124 | GET/POST | `/api/admin/cmp/signal-rights/settlements` · `/:id/approve` · `/:id/declaration` | `cmp.derechosSenales.liquidar` / `cmp.derechosSenales.aprobar` | Ejecutar, aprobar y exportar liquidaciones (HUE-TV-01) | Sí (contrato + período) |

Servicios internos (no HTTP, DEC-003): `cmp.getPayableInvoices` (M14), `cmp.getSupplier` (M06/M14), `cmp.createSupplyRequest` (M10/M13), `cmp.createSupplierExpenseDocument` (M14: gastos de procesadores y rechazos de valores entregados).

Errores RFC 9457: `cmp/duplicate-invoice`, `cmp/total-mismatch`, `cmp/period-closed`, `cmp/request-not-approved`, `cmp/order-not-approved`, `cmp/segregation-violation`, `cmp/open-exception`, `cmp/payment-not-released`, `cmp/bank-account-not-approved`, `cmp/invalid-transition`, `cmp/doc-type-not-allowed`, `cmp/supply-point-unknown` (HUE-ELE-01, HUE-GAS-04), `cmp/signal-contract-missing` (HUE-TV-01).

## 12. Eventos y jobs

| ID | Evento | Productor | Consumidores | Payload mínimo |
|---|---|---|---|---|
| EVT-CMP-01 | `cmp.supplier.created` / `cmp.supplier.updated` | M12 | M06 (padrón, asignaciones), M14 (beneficiarios), M15 | `supplierId, taxId, changes` |
| EVT-CMP-02 | `cmp.supplier.bankAccountApproved` | M12 | M14 | `supplierId, accountId, cbu` |
| EVT-CMP-03 | `cmp.supplyRequest.approved` / `.cancelled` | M12 | M10, M13 (origen), T09 | `requestId, items` |
| EVT-CMP-04 | `cmp.purchaseOrder.approved` | M12 | M14 (compromiso), M15 (comprometido), T09 | `orderId, supplierId, total, currency, estimatedPaymentDate, allocations` |
| EVT-CMP-05 | `cmp.purchaseOrder.cancelled` / `.closed` | M12 | M14 (libera remanente), M15 | `orderId, remainingAmount` |
| EVT-CMP-06 | `cmp.receipt.confirmed` | M12 | M13 (ingreso/egreso por devolución), M15 (pendientes) | `receiptId, items, warehouseId, serials` |
| EVT-CMP-07 | `cmp.receipt.voided` | M12 | M13, M15 | `receiptId` |
| EVT-CMP-08 | `cmp.supplierInvoice.registered` | M12 | M06 (libro IVA compras), M15 (asiento), M14 (devengado, proyección), M13 (ajuste de costo) | `invoiceId, supplierId, amounts, items, allocations` |
| EVT-CMP-09 | `cmp.supplierInvoice.released` / `.voided` | M12 | M14, M06, M15 | `invoiceId, releasedAmount` |
| EVT-CMP-10 | `cmp.matchException.raised` / `.decided` | M12 | T11, T09 | `exceptionId, type, amount` |
| EVT-CMP-11 | `cmp.paymentOrder.approved` | M12 | M14 (ejecución), M06 (confirmar retenciones), M15 | `paymentOrderId, supplierId, gross, withholdings, net, bankAccount, dueDate` |
| EVT-CMP-12 | `cmp.paymentOrder.cancelled` | M12 | M14, M06 (anular retenciones), M15 | `paymentOrderId, reason` |
| EVT-CMP-13 | `cmp.paymentOrder.paid` | M12 | T09 (aviso al proveedor), M16 (si integra sueldos) | `paymentOrderId, paidAt` |
| EVT-CMP-14 | `cmp.portalSubmission.received` / `.decided` | M12 | T09 | `submissionId, status, reason` |
| EVT-CMP-15 | `cmp.paymentOrder.prepared` | M12 | M06 (cálculo previo de retenciones) | `paymentOrderId, supplierId, items, amount` |
| EVT-CMP-16 | `cmp.supplyBalance.approved` | M12 | M03 (informe de pérdidas), M06 (informes al regulador), T10 | `balanceId, kind, serviceId, zoneId, period, purchasedQty, boundaryMeasuredQty, billedToUsersQty, lossQty, lossPct` |
| EVT-CMP-17 | `cmp.signalRightsSettlement.approved` / `.voided` | M12 | M15 (devengamiento del costo, M-128), M14 (previsión de pago), T10 | `settlementId, contractId, supplierId, period, lines[{ packageId, activeSubscribers, amount }], total, currency, serviceId` |

La factura mayorista registrada usa EVT-CMP-08 con `wholesaleSupply.kind` y rol de costo de abastecimiento (M-126, M-127 de M15).

**Eventos consumidos:** `tes.paymentExecution.executed` / `.voided` (M14), `fis.withholding.confirmed` / `.cancelled` (EVT-FIS-12, M06), `fis.misComprobantes.reconciled` (EVT-FIS-22, M06), `stk.goods.received` / `stk.goods.rejected` (EVT-STK-01/24, M13), `stk.item.belowMinimum` (EVT-STK-12, M13), `tec.material.requested` (EVT-TEC-11, M10), `wfl.approval.decided` (T11), `per.person.updated` (EVT-PER-02), `per.taxId.verified` / `per.taxId.mismatch` (EVT-PER-08) y `per.person.merged` (EVT-PER-06) de M01, para refrescar `suppliers.identitySnapshot` y reasignar `personId` tras una fusión (DEC-097).

**Servicios internos consumidos (HUE-ELE-01, HUE-GAS-04, HUE-TV-01):** medición propia por punto y período de M03 (puntos `purchase`/`boundary`, RF-MED-100) mediante API-MED-78 `GET /api/admin/med/purchase-volumes` (RF-MED-129; m³ de gas sin corregir, DEC-085); factor de corrección de gas vigente por período de M04 (RN-TAR-035); consumos facturados por servicio y período de M05; informe de abonados activos por paquete de M02 a una fecha de corte.

Outbox en la misma transacción; consumidores idempotentes por `eventId`. Jobs: §9.7.

## 13. Integraciones

| Integración | Dirección | Uso en M12 | Responsable técnico |
|---|---|---|---|
| ARCA padrón (A5/A13) | Vía M06 | Alta y validación de proveedores (P218) | M06 / T06 |
| ARCA verificación de comprobantes (CAE/CAI) | Vía M06 | Al registrar facturas (P2977) | M06 |
| ARCA Mis Comprobantes | Vía M06 (archivo CSV/Excel) | Borradores de comprobantes recibidos (FIC 2.4) | M06 |
| SICORE / SIRE / SIRCAR | Vía M06 | Declaración de retenciones practicadas | M06 |
| Interbanking / archivos bancarios | Vía M14 | Pago por transferencia con archivo (DFA M16 mejora, FIC 11.1) | M14 / T06 |
| Proveedor de IA | Saliente (opt-in) | Lectura de facturas (FIC 20) con credenciales en bóveda y auditoría | T06 / T08 |
| Email / SMS / WhatsApp | Vía T09 | OC, invitaciones, circulares, certificados, avisos de pago | T09 |
| Portal de proveedores | landing + T02 | Cotizaciones, comprobantes, pagos | M12 / T02 |
| BCRA Central de Deudores | Enlace informativo | Consulta manual (RF-CMP-014) | — |
| Mayorista de energía (EPEC, FI-INT-33) y distribuidora de gas (FI-INT-115) | Entrante (archivo mensual) | Factura mayorista con detalle por punto (RF-CMP-149, RF-CMP-152; HUE-ELE-01, HUE-GAS-04) | M12 / T06 |

## 14. Parámetros

Ámbito `tenant` salvo indicación. Los FK de ProCoop (`CON_COM`, `PROD_SER`, `PLANTILLA`, `CAT_BANC`, `RESPONSA`) se convierten en referencias a `purchaseConcepts`/`products`, plantillas de T09, categorías de M14 y responsables. Catálogo maestro completo en T04b. Se cubren los **109 parámetros COMPRAS** de RN-09 más los relacionados; los que pertenecen a otro módulo se listan con su dueño para trazabilidad.

### 14.1 Proveedores

| ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 |
|---|---|---|---|---|---|---|
| PRM-CMP-001 | `cmp.supplier.allowWithoutCategory` | Boolean | tenant | `false` | Permite no asignar rubro de proveedor (y anticipos sin rubro) | #2017 |
| PRM-CMP-002 | `cmp.supplier.requireAccountingAccount` | Boolean | tenant | `false` | Exigir cuenta contable al cargar/modificar proveedor | #3068 |
| PRM-CMP-003 | `cmp.supplier.enablePaysOthers` | Boolean | tenant | `false` | Habilita marcar proveedores que pagan a otros | #2019 |
| PRM-CMP-004 | `cmp.supplier.validateWithArca` | Boolean | tenant | `true` | Controlar proveedores con el padrón de ARCA | #218 |
| PRM-CMP-005 | `cmp.supplier.alertExpiredCertificate` | Boolean | tenant | `true` | Alertar si la constancia del proveedor está vencida (ProCoop abría la página de ARCA) | #217 |
| PRM-CMP-006 | `cmp.supplier.hideEmployeeDocuments` | Boolean | tenant | `true` | No mostrar facturas y recibos de empleados en compras | #2653 |
| PRM-CMP-007 | `cmp.supplier.excludeEmployeeData` | Boolean | tenant | `true` | No incluir datos de empleados en informes | #2709 |
| PRM-CMP-008 | `cmp.supplier.bankAccountChangeRequiresApproval` | Boolean | tenant | `true` | Cambio de CBU con aprobación | RN-CMP-004 (mejora) |
| PRM-CMP-009 | `cmp.supplier.withholdingImportBase` | Decimal | tenant | — | Importe base imponible al importar retenciones/alícuotas de proveedores (lo usa M06) | #2542 |

### 14.2 Solicitudes, cotizaciones y concursos

| ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 |
|---|---|---|---|---|---|---|
| PRM-CMP-010 | `cmp.request.autoApprovePolicy` | Ref política T11 | tenant | "requiere aprobación" | Reemplaza "generar SA sin autorizar automáticamente según permisos" | #2640 |
| PRM-CMP-011 | `cmp.request.validityDays` | Integer | tenant | 60 | Días de vigencia de la SA (filtro corregido) | #2036 |
| PRM-CMP-012 | `cmp.request.requireRecipient` | Boolean | tenant | `false` | Obligar destinatario | #2705 |
| PRM-CMP-013 | `cmp.request.doubleApproval` | Boolean | tenant | `false` | Doble aprobación de SA | #2867 |
| PRM-CMP-014 | `cmp.request.quoteMailTemplateId` | Ref plantilla | tenant | — | Mail para solicitar cotización de materiales de una SA | #2888 |
| PRM-CMP-015 | `cmp.quote.defaultValidityDays` | Integer | tenant | 15 | Vencimiento por defecto de cotizaciones | RN-08 §7.3 |
| PRM-CMP-016 | `cmp.quote.showAmountsInPesos` | Boolean | tenant | `true` | Mostrar importes en pesos en la planilla comparativa | #3119 |
| PRM-CMP-017 | `cmp.quote.tenantVatCondition` | Ref condición IVA (T01/M06) | tenant | — | Situación de IVA de la cooperativa para calcular IVA de cotizaciones | #527 |
| PRM-CMP-018 | `cmp.sourcing.invitationTemplateId` | Ref plantilla | tenant | — | Plantilla de invitación a concurso o licitación | #2893 |
| PRM-CMP-019 | `cmp.sourcing.modalityThresholds` | Map<modalidad, monto> | tenant | — (a configurar) | Umbrales por modalidad de contratación | RN-08 §15.3 |

### 14.3 Órdenes de compra

| ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 |
|---|---|---|---|---|---|---|
| PRM-CMP-020 | `cmp.order.approvalPolicy` | Ref política T11 (bandas) | tenant | "aprobada hasta el umbral" | Reemplaza "valor por defecto en carga de OC: autorizada / no autorizada" | #2377 |
| PRM-CMP-021 | `cmp.order.approvalThreshold` | Decimal | tenant | 0 | Importe mínimo de OC para quedar pendiente de aprobación (primera banda) | #2382 |
| PRM-CMP-022 | `cmp.order.allowCurrencyChange` | Boolean | tenant | `false` | Modificar moneda en OC | #2323 |
| PRM-CMP-023 | `cmp.order.requireComplete` | Boolean | tenant | `false` | Exigir registración completa | #2335 |
| PRM-CMP-024 | `cmp.order.selectRequesterUser` | Boolean | tenant | `false` | Seleccionar usuario en "solicitó" | #2447 |
| PRM-CMP-025 | `cmp.order.requireDeliveryDate` | Boolean | tenant | `false` | Fecha de entrega obligatoria | #2735 |
| PRM-CMP-026 | `cmp.order.requireEstimatedPaymentDate` | Boolean | tenant | `false` | Fecha estimada de pago obligatoria | #2810 |
| PRM-CMP-027 | `cmp.order.mailTemplateId` | Ref plantilla | tenant | — | Plantilla de envío de OC por mail | #2905 |
| PRM-CMP-028 | `cmp.order.copyReasonToNotes` | Boolean | tenant | `false` | Copiar motivo de compra a observaciones al importar OC | #2647 |
| PRM-CMP-029 | `cmp.order.allowProjectsOnItems` | Boolean | tenant | `false` | Cargar obras en ítems de compras | #3101 |
| PRM-CMP-030 | `cmp.order.revisionTolerancePct` | Decimal | tenant | 0 | Cambio que no requiere nueva aprobación | — (mejora AGR-003) |
| PRM-CMP-031 | `cmp.order.requireServiceAllocation` | Boolean | tenant | `false` | Exigir servicio/centro de costo por línea | BASE §78 (PA-CMP-14) |

### 14.4 Recepción

| ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 |
|---|---|---|---|---|---|---|
| PRM-CMP-035 | `cmp.receipt.independentInvoice` | Boolean | tenant | `true` | Factura independiente de remitos de depósito: en CoopApps la factura nunca mueve stock; el valor define si la factura puede registrar recepción implícita (PA-CMP-03) | #583 |
| PRM-CMP-036 | `cmp.receipt.onlyOrdersOnImport` | Boolean | tenant | `false` | Mostrar solo OC al importar ítems en remitos | #2649 |
| PRM-CMP-037 | `cmp.receipt.noWarehouseIfNoStock` | Boolean | tenant | `true` | No pedir depósito si el producto no lleva stock | #2560 |
| PRM-CMP-038 | `cmp.receipt.warnNoStockControl` | Boolean | tenant | `true` | Avisar que el producto no controla stock | #2989 |
| PRM-CMP-039 | `cmp.receipt.defaultPendingIfStock` | Boolean | tenant | `false` | Cargar ítem como pendiente si controla stock | #3030 |
| PRM-CMP-040 | `cmp.receipt.askPrintLabels` | Boolean | tenant | `false` | Preguntar si imprimir etiquetas (M13) | #3071 |
| PRM-CMP-041 | `cmp.receipt.fourDecimalsQty` | — (reemplazado) | — | — | 4 decimales en cantidades: reemplazado por precisión de la unidad | #2691 |
| PRM-CMP-042 | `cmp.receipt.allowAmountEdit` | Boolean | tenant | `false` | Permite modificar importe en remitos / tomar IVA del origen al importar | #2690 |
| PRM-CMP-043 | `cmp.receipt.excessTolerancePct` | Decimal | tenant | 0 | Tolerancia de exceso de entrega | AGR-027 (PA-CMP-04) |

### 14.5 Comprobantes de proveedor

| ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 |
|---|---|---|---|---|---|---|
| PRM-CMP-050 | `cmp.invoice.maxTotalDifference` | Decimal | tenant | 0,50 | Máxima diferencia entre total de ítems y totales | #2057 |
| PRM-CMP-051 | `cmp.invoice.warnNotAllowedDocType` | Boolean | tenant | `false` | Advertir (en vez de bloquear) comprobantes no autorizados por condición IVA | #2365 |
| PRM-CMP-052 | `cmp.invoice.checkCaeCai` | Boolean | tenant | `true` | Consultar ingreso de CAE/CAI (M06) | #2977 |
| PRM-CMP-053 | `cmp.invoice.autofillDates` | Boolean | tenant | `true` | Autocompletar fecha contable y vencimiento | #2388 |
| PRM-CMP-054 | `cmp.invoice.defaultDueDays` | Integer | tenant | 30 | Vencimiento por defecto (ProCoop: fecha fija) | #2026 |
| PRM-CMP-055 | `cmp.invoice.accountingImputationDate` | — (reemplazado) | — | — | Fecha de imputación contable → períodos de M15 | #580 |
| PRM-CMP-056 | `cmp.invoice.blockBeyondCurrentMonth` | Boolean | tenant | `false` | No exceder el mes actual en la fecha | #3067 |
| PRM-CMP-057 | `cmp.invoice.discountConceptId` | Ref concepto | tenant | — | Concepto por descuento en comprobantes de compra | #2403 |
| PRM-CMP-058 | `cmp.invoice.noPurchasePriceUpdate` | Boolean | tenant | `false` | No actualizar precio de compra al registrar | #264 |
| PRM-CMP-059 | `cmp.invoice.askBeforePriceUpdate` | Boolean | tenant | `true` | Preguntar antes de actualizar precio | #426 |
| PRM-CMP-060 | `cmp.invoice.ignoreProductVatOnImport` | Boolean | tenant | `false` | No tomar IVA de productos al importar ítems (requiere remitos que discriminen IVA) | #2791 |
| PRM-CMP-061 | `cmp.invoice.noteOnConceptChange` | Boolean | tenant | `false` | Observación al modificar un concepto | #2533 |
| PRM-CMP-062 | `cmp.invoice.allowCustomerService` | Boolean | tenant | `false` | Seleccionar un servicio de un cliente en el comprobante | #2277 |
| PRM-CMP-063 | `cmp.invoice.useCostCenterGroups` | Boolean | tenant | `false` | Utilizar grupo de secciones en compras | #2896 |
| PRM-CMP-064 | `cmp.invoice.vatPctByCostCenter` | Boolean | tenant | `false` | Cargar y mostrar % de IVA en compras por secciones | #2902 |
| PRM-CMP-065 | `cmp.invoice.vatNotTakenAsExpense` | Boolean | tenant | `false` | Registrar contablemente como gasto el IVA no tomado (efecto M15/M06) | #2890 |
| PRM-CMP-066 | `cmp.invoice.askPrintOnRegister` | Boolean | tenant | `false` | Consultar si imprimir al registrar | #2424 |
| PRM-CMP-067 | `cmp.invoice.defaultSeparateInVatBook` | Mixed | tenant | — | Valor por defecto para separar comprobantes en libro IVA (M06) | #832 |
| PRM-CMP-068 | `cmp.invoice.vatBookTemplate` | Ref plantilla (M06) | tenant | — | Informe de libro IVA compras personalizado | #382 |
| PRM-CMP-069 | `cmp.invoice.withholdingReportTemplate` | Ref plantilla (M06) | tenant | — | Informe particularizado de retenciones en IVA compras | #406 |
| PRM-CMP-070 | `cmp.invoice.housingCategoryId` / `cmp.invoice.housingProductCategoryId` | Ref rubro | tenant | — | Rubro de vivienda de la factura / rubro exigido a sus productos | #2502, #2503 |
| PRM-CMP-071 | `cmp.invoice.integratePayroll` | Boolean | tenant | `false` | Integrar compras/sueldos (M16) | #2366 |
| PRM-CMP-072 | `cmp.invoice.spendingUnitPanelOnVoucher` | Boolean | tenant | `false` | Panel de unidad de gasto al cargar productos desde un vale (M13) | #2906 |
| PRM-CMP-073 | `cmp.invoice.allowedSources` | Set | tenant | `manual, portal, arcaImport` | Orígenes habilitados (IA solo si PA-CMP-11) | — |

### 14.6 Conciliación y habilitación de pago

| ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 |
|---|---|---|---|---|---|---|
| PRM-CMP-080 | `cmp.payment.releaseMode` | Enum `auto\|manual\|autoUpTo` | tenant | `auto` (por conciliación) | Reemplaza "valor por defecto en carga de facturas: pago autorizado / no autorizado / autorizar mayores a P2457" | #2201 |
| PRM-CMP-081 | `cmp.payment.autoReleaseMaxAmount` | Decimal | tenant | 0 | Importe hasta el cual la habilitación es automática si `autoUpTo` | #2457 |
| PRM-CMP-082 | `cmp.match.qtyTolerancePct` | Decimal | tenant | 0 | Tolerancia de cantidad | AGR-027 (PA-CMP-04) |
| PRM-CMP-083 | `cmp.match.priceTolerancePct` / `cmp.match.priceToleranceAmount` | Decimal | tenant | 2 % / ARS 1.000 | Tolerancia de precio | AGR-027 (PA-CMP-04) |
| PRM-CMP-084 | `cmp.match.partialRelease` | Boolean | tenant | `true` | Habilitar solo lo conciliado | RN-CMP-045 |
| PRM-CMP-085 | `cmp.noPoCategories` | Set de categorías | tenant | servicios públicos, impuestos y tasas, caja chica | Compras permitidas sin OC | PA-CMP-07 |
| PRM-CMP-086 | `cmp.segregation.enforce` | Boolean | tenant | `true` | Segregación de funciones | BASE §19 |

### 14.7 Órdenes de pago y retenciones

| ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 |
|---|---|---|---|---|---|---|
| PRM-CMP-090 | `cmp.payment.allowLaterAccountingDate` | Boolean | tenant | `false` | Pago de facturas con fecha contable posterior al pago | #110 |
| PRM-CMP-091 | `cmp.payment.customBeneficiaryName` | Boolean | tenant | `false` | Particularizar nombre del proveedor en la OP | #1029 |
| PRM-CMP-092 | `cmp.payment.printOnIssue` | Boolean | tenant | `false` | Imprimir OP en la emisión | #2018 |
| PRM-CMP-093 | `cmp.payment.showJournalEntry` | Boolean | tenant | `false` | Mostrar asiento contable en la OP (de M15) | #2308 |
| PRM-CMP-094 | `cmp.payment.allowDateChange` | Boolean | tenant | `false` | Modificar fecha de comprobante de pago | #2572 |
| PRM-CMP-095 | `cmp.payment.bulkSendTemplateId` | Ref plantilla | tenant | — | Plantilla para envío masivo de OP | #2418 |
| PRM-CMP-096 | `cmp.payment.showPendingAdvances` | Boolean | tenant | `true` | Informar anticipos pendientes del proveedor al pagar | #2777 |
| PRM-CMP-097 | `cmp.advance.supplierConceptId` | Ref concepto | tenant | — | Concepto para anticipos a proveedores | #2035 |
| PRM-CMP-098 | `cmp.advance.payrollConceptId` | — (de M16) | — | — | Concepto para adelantos de sueldo: migra a M16 | #2034 |
| PRM-CMP-099 | `cmp.advance.payrollNoveltyType` | — (de M16) | — | — | Tipo de novedad para adelantos | #2538 |
| PRM-CMP-100 | `fis.withholding.grossIncome.enabled` | Boolean (M06) | tenant | `false` | Aplica retención de IIBB | #2037 |
| PRM-CMP-101 | `fis.withholding.vat.enabled` | Boolean (M06) | tenant | `false` | Aplica retención de IVA | #2039 |
| PRM-CMP-102 | `fis.withholding.incomeTax.enabled` | Boolean (M06) | tenant | `false` | Aplica retención de Ganancias | #2041 |
| PRM-CMP-103 | `fis.withholding.socialSecurity.enabled` | Boolean (M06) | tenant | `false` | Aplica retención de Seguridad Social | #2043 |
| PRM-CMP-104 | `cmp.withholding.autoPrint.grossIncome` / `.vat` / `.incomeTax` / `.socialSecurity` | Boolean | tenant | `true` | Imprimir/enviar certificados automáticamente | #2038, #2040, #2042, #2044 |
| PRM-CMP-105 | `fis.withholding.filingCutoffDay` | Integer (M06) | tenant | — | Día límite de presentación (después, mes siguiente) | #2045 |
| PRM-CMP-106 | `fis.withholding.skipNonFormal` | Boolean (M06) | tenant | `false` | No retener en comprobantes no formales | #410 |
| PRM-CMP-107 | `fis.withholding.noAdvances` | Boolean (M06) | tenant | `false` | No permitir anticipos en retenciones | #409 |
| PRM-CMP-108 | `fis.withholding.presumedVatPct` | Decimal (M06) | tenant | 21 | % de IVA para retenciones en adelantos y comprobantes sin IVA discriminado | #2310 |
| PRM-CMP-109 | `fis.withholding.requireRegimeCode` | Boolean (M06) | tenant | `true` | Código de régimen obligatorio en retenciones y percepciones | #2813 |
| PRM-CMP-110 | `cmp.withholding.allowManualAdjust` | Boolean | tenant | `false` | Modificar manualmente las retenciones (con capability y motivo) | #2836 |
| PRM-CMP-111 | `fis.withholding.sicoreInternationalFormat` | Boolean (M06) | tenant | `false` | Formato internacional del archivo de retenciones de Ganancias | #2539 |
| PRM-CMP-112 | `fis.withholding.grossIncomePointOfSale` | String (M06) | tenant | — | Punto de venta de certificados de IIBB | #2012 (relacionado) |

### 14.8 Parámetros COMPRAS cuyo dueño es otro módulo

| Parámetros V2 | Dueño | Tratamiento en M12 |
|---|---|---|
| #134 apertura automática de caja de pagos, #135 importe de efectivo en apertura, #2000 / #2001 / #2002 / #2004 compras habilita pago con cheques / valores / efectivo / transferencia, #2003 definir efectivo disponible para compras | M14 (caja de pagos) | La OP propone solo medios habilitados |
| #144 pago a proveedores desde caja (no permitir / menores a #2025 / definido por usuario / con advertencia), #2025 importe máximo por caja | M14 | Idem |
| #146 categoría para pago con transferencias, #2065 categoría extracción de efectivo, #2079 categoría depósito de efectivo en OP, #2066 (relacionado) | M14 | — |
| #402 controlar fecha de cheques o transferencias en OP, #2433 fecha de movimiento como emisión, #3044 fechas posteriores en transferencias | M14 | — |
| #2015 pago diferido a cuentas que no lo sean, #2016 desactiva pagos diferidos | M14 (con rubro de M12 que admite pago diferido) | El rubro del proveedor informa `allowsDeferredPayment` |
| #2372 firmantes de OP del archivo bancario, #2573 CBU de la cooperativa para Interbanking | M14 | Firmas y archivo son de M14 |
| #2952 (relacionado) presentar retenciones automáticamente en cierre de caja | M14 (retenciones sufridas) | — |
| #2020 jefe administrativo, #2021 secretario, #2022 jefe de compras, #2023 presidente, #2024 tesorero | T01/M17 (datos y autoridades de la empresa) | M12 los usa en documentos (OC, OP, actas) |
| #518 / #519 (relacionados) razón social y CUIT de la cooperativa | T01 | Usados por la lectura IA (RN-CMP-067) |
| #2967 utilizar partes de producción, #3043 no generar partes sin OF, #3057 responsable por defecto del parte, #3171 no finalizar OF manualmente | M13 (fabricación) | M12 recibe SA de fabricación |
| #2112, #2162, #2548 (relacionados) cuenta de compras por defecto, cuenta de productos pendientes, cuenta de compras del rubro en OT/OM | M15 | M12 publica imputación en eventos |
| #500 (relacionado) fecha de cierre de compras | T04/M15 (períodos) | RN-CMP-062 |

### 14.9 Abastecimiento mayorista y derechos de señales

| ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 |
|---|---|---|---|---|---|---|
| PRM-CMP-113 | `cmp.wholesaleSupply.energyTolerancePct` | Decimal | tenant + servicio | `1` | Tolerancia entre kWh/kW facturados y medidos en frontera (RF-CMP-150) | HUE-ELE-01 |
| PRM-CMP-114 | `cmp.wholesaleSupply.gasTolerancePct` | Decimal | tenant + servicio | `1` | Tolerancia entre m³ facturados y medidos, ambos sin corregir (RF-CMP-152; corregido por DEC-085, antes "m³ corregidos") | HUE-GAS-04 |
| PRM-CMP-115 | `cmp.signalRights.defaultCountBasis` | Enum `cutoffDate`, `monthlyAverage` | tenant | `cutoffDate` | Base de cómputo de abonados si el contrato no la define | HUE-TV-01 |
| PRM-CMP-116 | `cmp.signalRights.cutoffDay` | Entero 1–31 | tenant | `1` | Día del mes siguiente en que se toma el informe de abonados de M02 y corre JOB-CMP-09 | HUE-TV-01 |

## 15. Reportes

| Código | Reporte | Fórmula / contenido | Universo | Fecha de corte (AGR-022) |
|---|---|---|---|---|
| REP-CMP-01 | Solicitudes por estado y aprobación | Cantidad y monto estimado; estados 1–6 y aprobación 1–3 de ProCoop | SA del período | `date` |
| REP-CMP-02 | Comparativo de cotizaciones | Precio por ítem y proveedor, total en pesos, diferencia vs menor | Grupo de cotizaciones | Fecha de evaluación |
| REP-CMP-03 | OC pendientes de recepción y atrasadas | Σ `pendingQty × unitPrice`; días de atraso vs `deliveryDate` | OC aprobadas no cerradas | Fecha de consulta |
| REP-CMP-04 | Recepciones pendientes de facturar | Σ `pendingToInvoiceQty` valorizado | Recepciones confirmadas | Fecha de consulta |
| REP-CMP-05 | Facturas sin OC | Ítems de factura sin vínculo con OC (control del circuito) | Comprobantes registrados del período | `accountingDate` |
| REP-CMP-06 | Diferencias de comprobantes | 4 controles: total vs componentes, total vs ítems, IVA cabecera vs ítems, IVA ítem recalculado | Comprobantes del período | `accountingDate` |
| REP-CMP-07 | Excepciones de 3 vías | Por tipo, importe en disputa, antigüedad, decisión | Excepciones abiertas y cerradas | `createdAt` |
| REP-CMP-08 | Cuenta corriente y antigüedad de proveedores | Saldo = Σ comprobantes − Σ aplicaciones; tramos 0–30, 31–60, 61–90, > 90 por vencimiento original | Proveedores | Fecha de corte elegida |
| REP-CMP-09 | Compras por servicio, centro de costo, rubro, proveedor, producto | Σ neto según distribución (sin duplicar compartidas) | Comprobantes registrados | `accountingDate` |
| REP-CMP-10 | Comprometido, devengado y pagado | OC aprobadas pendientes / facturas registradas / OP pagadas, no sumados entre sí | Período y servicio | Fecha de corte |
| REP-CMP-11 | Previsiones de pagos | Previsiones expandidas + facturas con saldo por vencimiento + cheques propios no debitados (M14) | Rango futuro | Fecha de consulta |
| REP-CMP-12 | Pagos pendientes de salida y diferidos | Importe OP − movido en M14, por medio, con total | OP aprobadas | Fecha de consulta |
| REP-CMP-13 | Desempeño de proveedores | % entregas a término, diferencias, devoluciones, puntaje | Proveedores con operaciones | Período |
| REP-CMP-14 | Costo de reposición | (cantidad de reposición − stock) × costo, por bultos | Productos con punto de reposición (M13) | Fecha de consulta |
| REP-CMP-15 | Retenciones practicadas por OP | Detalle desde M06 por proveedor y régimen | OP aprobadas | `paymentDate` |
| REP-CMP-16 | Proveedores alcanzados por regímenes especiales | Filtro por marca/padrón (por ejemplo, Decreto 1945/18) **[VERIFICAR]** | Proveedores | Fecha de consulta |
| REP-CMP-17 | Comprobantes recibidos vs registrados (Mis Comprobantes) | Faltantes, sobrantes, diferencias | Período fiscal | Período |
| REP-CMP-18 | Consumo de combustible | Σ litros y km por combustible y movimiento | Comprobantes con combustible | `issueDate` |

## 16. Casos de uso

### CU-19 — Compra con entrega parcial (BASE §19)

- **Actores:** depósito (solicitante), comprador, aprobador, receptor, cuentas a pagar.
- **Precondición:** TEN-001; proveedor PROV-DEMO-002; producto "Medidor monofásico".
- **Flujo:** SA de 10 medidores → aprobación → cotizaciones y comparación → OC-001 por 10 × ARS 20.000 = ARS 200.000 (aprobada por banda) → recepción de 6 → OC con 4 pendientes (no se da por entregado todo).
- **Excepción:** la factura llega por 10 o con precio ARS 21.000: excepción de cantidad (4 unidades) o de precio (5 % > tolerancia 2 %); la factura queda retenida antes de autorizar el pago.
- **Resultado:** compra de ARS 200.000 base; 6 recibidas, 4 pendientes; pago solo de lo conciliado o tras decisión.

### CU-OPE-01 — Compra de módems por servicio (BASE §78)

- **Flujo:** OC-DEMO-002 por 2 módems a ARS 20.000 (total ARS 40.000) con servicio INT en la línea → recepción con series (M13) → un módem se asigna a instalador y se aplica a una OT, el otro queda disponible (M13) → factura y OP siguen cuentas a pagar y tesorería.
- **Control:** el costo del módem no se transforma en cargo al socio (M11 RN-VEN-006); la existencia no se reduce dos veces.

### CU-FIS-01 — Pago con retención (BASE §61, compartido con M06/M14)

- **Definición dueña:** M06 «CU-FIS-01 — Retención en un pago a proveedor (BASE §61, original)». Aquí solo el tramo de compras (orden de pago con la retención aplicada).
- **Flujo:** OP a PROV-DEMO-001 por factura de ARS 100.000 → M06 determina RET-DEMO-001 por ARS 2.000 → neto ARS 98.000 → aprobación → M14 paga 98.000 → la factura queda cancelada por 100.000; M06 genera certificado y obligación.
- **Control:** un reintento no genera otra retención; exportar no es presentar.

### CU-CMP-01 — Control de 3 vías con excepción (AGR-027)

- **Flujo:** pedidos 10, recibidos 6, facturados 10 → excepción de cantidad por 4 → el autorizador elige "reclamar NC" → se habilitan ARS 120.000 → llega NC por ARS 80.000 → excepción resuelta.
- **Resultado:** el pago respeta lo autorizado y el stock representa lo recibido.

### CU-CMP-02 — Factura recibida por el portal

- **Flujo:** el proveedor invitado sube su factura con PDF → duplicado rechazado si ya existe → cuentas a pagar registra (importando la OC) → el proveedor ve "Registrado", luego "Habilitado", "En pago" y "Pagado" y descarga el certificado de retención.

### CU-CMP-03 — Importación desde Mis Comprobantes

- **Flujo:** M06 concilia el período y detecta 5 comprobantes recibidos no registrados → se crean 5 borradores → el administrativo completa imputación de 4 y descarta 1 (no corresponde) con motivo → la conciliación de M06 se actualiza.

### CU-CMP-04 — Lectura de factura con IA

- **Flujo:** el usuario sube un PDF → la IA propone proveedor (por CUIT del emisor, distinto del de la cooperativa), importes y alícuotas con confianza → el usuario corrige una alícuota y registra → la auditoría registra la corrección.

### CU-CMP-05 — Concurso de precios

- **Flujo:** SA de ARS 3.000.000 supera el umbral de concurso → se publica el evento e invita a 4 proveedores → ofertas en sobre cerrado → apertura con acta → planilla de adjudicación → OC al adjudicado.

### CU-CMP-06 — Alta de CBU con aprobación

- **Flujo:** el proveedor solicita en el portal cambiar su CBU → el comprador lo carga → otro usuario aprueba tras verificación telefónica → la próxima OP usa el nuevo CBU; antes de aprobarse, la OP usa el anterior o queda sin transferencia.

## 17. Criterios de aceptación y escenarios de prueba

### 17.1 Criterios generales

1. Cada RF cumple su criterio de aceptación.
2. **Permisos negativos:** sin `cmp.ordenes.aprobar` → 403 al aprobar OC (también en masivo); sin `cmp.pago.habilitar` → 403; un proveedor del portal no ve OC de otro proveedor; sin `cmp.proveedoresEmpleados.ver` no se ven importes de proveedores-empleado.
3. **Segregación:** el creador de una OC no puede aprobarla (`cmp/segregation-violation`); el aprobador de la OC no puede registrar su recepción.
4. **Aislamiento por tenant:** consultas, portal (mismo CUIT en dos tenants), exportaciones, eventos y jobs filtran por `tenantId`.
5. **Idempotencia y reintentos:** reenviar la aprobación de una OP no duplica retenciones ni ejecuciones; reprocesar `tes.paymentExecution.executed` no cancela dos veces; subir dos veces el mismo comprobante al portal se rechaza.
6. **Concurrencia:** dos OP que aplican la misma factura: la segunda falla si el saldo no alcanza.
7. **Períodos:** fecha contable en período cerrado → `cmp/period-closed`.
8. **Nunca borrar:** anular SA, OC, recepción, comprobante u OP deja el registro consultable.
9. **Auditoría:** toda aprobación, habilitación, ajuste de retención y cambio de CBU registra usuario, fecha, valor anterior y nuevo.

### 17.2 Escenarios

| ID | Escenario | Resultado esperado |
|---|---|---|
| ESC-CMP-01 | CU-19 recepción parcial | OC con 4 pendientes; no `received` |
| ESC-CMP-02 | AGR-027 10/6/10 | Excepción; no se paga como recibido todo |
| ESC-CMP-03 | Precio facturado 5 % mayor, tolerancia 2 % | Excepción de precio |
| ESC-CMP-04 | Diferencia de total ARS 0,60 con límite 0,50 | No se registra (`cmp/total-mismatch`) |
| ESC-CMP-05 | Comprobante duplicado | `cmp/duplicate-invoice` |
| ESC-CMP-06 | Procesar ítem de SA no aprobada (defecto ProCoop) | `cmp/request-not-approved` |
| ESC-CMP-07 | SA de hace 45 días con vigencia 30 | No aparece en pendientes |
| ESC-CMP-08 | Aprobación masiva de OC sin banda suficiente | Rechazo por documento con causa |
| ESC-CMP-09 | Factura de servicio sin conformidad | `onHold` |
| ESC-CMP-10 | Factura sin OC de categoría no permitida | Excepción `withoutPO` |
| ESC-CMP-11 | CU-FIS-01 | Retención 2.000, neto 98.000, factura cancelada por 100.000 |
| ESC-CMP-12 | Anulación de OP ejecutada | Exige anular primero en M14; luego repone saldos y anula retenciones conservando importes |
| ESC-CMP-13 | OP con transferencia a CBU pendiente de aprobación | `cmp/bank-account-not-approved` |
| ESC-CMP-14 | Deshacer vínculo con cantidad 2,5 | Repone 2,5 (no 2) |
| ESC-CMP-15 | Compra compartida 50/50 INT/TV por ARS 40.000 | Informe por servicio 20.000 + 20.000; total 40.000 |
| ESC-CMP-16 | Borrador desde Mis Comprobantes sin revisión | No impacta libro IVA ni cuenta corriente |
| ESC-CMP-17 | Proveedor del portal de TEN-001 consulta OC de TEN-002 con mismo CUIT | 404 |
| ESC-CMP-18 | Recepción rechazada por M13 (serie duplicada) | `stockStatus = rejected` y alerta; la OC no se da por recibida |
| ESC-CMP-19 | Pagar factura: vencimiento original | El informe de antigüedad conserva el vencimiento original |
| ESC-CMP-20 | Adelanto de sueldo desde OP | Rechazo con derivación a M16 |
| ESC-CMP-21 | Factura mayorista de energía ficticia por 100.000 kWh en el punto de frontera FR-DEMO-01; M03 midió 98.000 kWh; tolerancia 1 % (HUE-ELE-01) | Excepción `meteringMismatch` por 2.000 kWh; `paymentRelease = blocked` hasta la decisión |
| ESC-CMP-22 | Factura de gas de la distribuidora sin medición propia del período en M03 (HUE-GAS-04) | Excepción `meteringMissing`; JOB-CMP-10 la reevalúa al llegar la medición |
| ESC-CMP-23 | Balance del período: comprado 100.000 kWh, facturado a usuarios 91.000 kWh (HUE-ELE-01) | Pérdida 9.000 kWh (9 %); al aprobar se publica EVT-CMP-16; ningún usuario recibe recargo |
| ESC-CMP-24 | Programadora PROG-DEMO-01, paquete básico a ARS 150 por abonado, mínimo ARS 150.000; M02 informa 1.200 abonados activos (HUE-TV-01) | Liquidación ARS 180.000; al aprobar se publica EVT-CMP-17 y M15 devenga el costo |
| ESC-CMP-25 | Reejecutar JOB-CMP-09 del mismo período con la liquidación ya aprobada (HUE-TV-01) | No se crea otra liquidación; una corrección se registra como ajuste del período siguiente |

Pendientes BASE §80 ("validar asignación de compras y artículos compartidos sin duplicar importes ni cantidades") y §78 se cubren con ESC-CMP-15 y CU-OPE-01; ESC-01 a ESC-05 de la guía no tocan M12 salvo el ingreso de equipos del piloto (RF-CMP-067).

## 18. Precarga ficticia

Todos los datos son ficticios; los CUIT usan el formato válido con prefijo de prueba y no corresponden a personas o empresas reales.

| Entidad | Datos |
|---|---|
| Tenant | TEN-001 "Cooperativa Demo" |
| Proveedores | PROV-DEMO-001 "Proveedor Demo Retención SA" (responsable inscripto, régimen de retención asignado en M06); PROV-DEMO-002 "Medidores Demo SRL"; PROV-DEMO-003 "Equipos de Red Demo SA" (módems); PROV-DEMO-004 "Servicios Públicos Demo" (categoría sin OC) |
| CBU | Un CBU aprobado por PROV-DEMO-001 y uno pendiente de aprobación por PROV-DEMO-002 (números sintéticos que no validan contra un banco real) |
| Rubros | "Materiales eléctricos" (pago diferido), "Equipos de telecomunicaciones", "Servicios" |
| Conceptos | "Flete", "Mantenimiento", "Servicios públicos", "Anticipo a proveedores" |
| Lookups | Destinatarios "Depósito central", "Taller"; unidad de gasto "Red eléctrica"; combustibles "Nafta", "Gasoil"; modalidades con umbrales ficticios |
| SA | SA-DEMO-001 (10 medidores, aprobada); SA-DEMO-002 (concurso por ARS 3.000.000) |
| OC | OC-001 (BASE §19: 10 medidores × ARS 20.000, 6 recibidos); OC-DEMO-002 (BASE §78: 2 módems × ARS 20.000, servicio INT) |
| Recepciones | REC-DEMO-001 (6 medidores); REC-DEMO-002 (2 módems con series de prueba) |
| Comprobantes | FC-DEMO-001 por 10 medidores (genera excepción de cantidad); FC-DEMO-002 de PROV-DEMO-001 por ARS 100.000 |
| Retención | RET-DEMO-001 por ARS 2.000 (M06) |
| OP | OP-DEMO-001: 100.000 − 2.000 = neto 98.000 |
| Portal | Usuario invitado "proveedor.demo" de PROV-DEMO-003 (rol `supplier`) |
| Mis Comprobantes | REG-DEMO: 5 comprobantes recibidos no registrados (lote ficticio) |

## 19. Migración

### 19.1 Estrategia

- Migración repetible (O11) por tenant con reconciliación de cantidades y saldos: Σ saldos de proveedores en ProCoop = Σ `balance` migrado; OC y SA abiertas con sus pendientes; comprobantes sin cancelar con su vencimiento original.
- Claves compuestas de ProCoop (`COD_COM`+`SUC_COM`+`NUM_COM`+`COD_PROV`) se guardan en `legacy.key` (antes `legacyRef`); la identidad pasa a ObjectId (CTR-CMP-13).
- Los documentos históricos cerrados se migran en estado terminal (`closed`, `paid`, `voided`) sin reejecutar workflow ni eventos de stock o contabilidad.
- Las autorizaciones históricas (`AUTORIZADO`, `USU_AUTO`) se conservan como evidencia `approval.legacy`, sin convertirse en aprobaciones T11.
- No se migran credenciales (`INTERBANKING`), contraseñas del portal (`frmProveedorPassGenerica`) ni prompts/respuestas de `AUDIT_IA` con datos personales.

### 19.2 Mapeo de tablas

| Tabla ProCoop | Destino | Notas |
|---|---|---|
| `PROVEED` | `suppliers` + persona de M01 (DEC-097) | `NOM_PRO`, `CUIT`, `COD_SIT` y `DOM_*` no se copian a la ficha: T07 vincula cada proveedor a una persona existente (por CUIT, o por el DNI contenido en la CUIT, RN-PER-011) o la crea con las reglas de unificación del padrón; un socio contratista queda con una sola persona y dos roles. CUIT validado; dos `PROVEED` con la misma CUIT van a la misma persona y se informan para unificar la ficha de proveedor. *Reemplazado (10-11-2026): "CUIT validado; duplicados por CUIT se fusionan con informe"* |
| `PROVEED_CBU` | `suppliers.bankAccounts` | Migran como `approved` solo si tuvieron pagos por transferencia; el resto `pendingApproval` |
| `PROVEED_AUT` | `suppliers.authorizedPersons` | — |
| `PROVEED_TIPPROD` | `suppliers.productTypeIds` | — |
| `PROVEED_RET` | M06 `withholdingAssignments` | CTR-CMP-07 |
| `PROVEED_VALORACIONES` | `supplierEvaluations` | — |
| `OBS_PRO` | `suppliers.notes` | — |
| `PROVSUM` | `suppliers.linkedAccounts` | Referencia a cuentas de M01 |
| `RUBPROV`, `RPSPROV` | `supplierCategories` | Unificados (CTR-CMP-10) |
| `RUBXPRO`, `RPSXPROV` | `suppliers.categoryAssignments` | Sin duplicar el mismo rubro |
| `CON_COM` | `purchaseConcepts` | — |
| `CON_TASAS` | `purchaseConcepts` (`kind = rateConcept`, `ratePercent`, `purchaseBookColumn`) | O8 (T07 §19.2; T05 COL-CMP-05; HUECO-TAS-03). Antes: `taxes` de M06 (O4). Si el perfilado de T07 encuentra una fila usada en facturación, esa fila se clasifica con RN-MIG-051 / RN-FIS-126 y se informa |
| `CON_COM_RET` | M06 `withholdingAssignments` | — |
| `DESTINATARIO_SAPROV`, `UNIDADES_GASTOS`, `COMBUSTIBLES` | `purchaseLookups` solo para `DESTINATARIO_SAPROV`; `UNIDADES_GASTOS` → `expenseUnits` (M13); `COMBUSTIBLES` → `fuelTypes` (M18) (CTR-DAT-54) | — |
| `SAPROV`, `IT_APROV` | `supplyRequests` | Estados 1–6 mapeados a §8.1 |
| `SCOTIZ`, `IT_SCOTIZ` | `quoteRequests` | — |
| `OCOMPRA` | `purchaseOrders` (`kind = standard`) | CTR-CMP-02 |
| `NPEDIDO`, `IT_NPED` | `purchaseOrders` (`kind = release` o `standard`) | Ítems de OC; PA-CMP-02 |
| `COMP_COM`, `IT_COMPC` | `supplierReceipts` | Movimientos de stock históricos los migra M13 |
| `IVACOM`, `FPITEMS`, `FPALIC_IVA` | `supplierInvoices` | Libro IVA histórico también lo lee M06 |
| `IVACOM_COMBUSTIBLES` | `supplierInvoices.fuel` | — |
| `FACT_EPEC` | `supplierInvoices.wholesaleSupply` (`kind = energy`; CTR-DAT-75, RF-CMP-149); el balance de los períodos migrados se recalcula en `supplyBalances` (ProCoop no tiene tabla de balance) | Histórico de 24 meses (DEC-070); `meteringCheck.status = matched` solo si existe la medición de M03 del período, si no `pending` sin bloquear pagos ya hechos. No se crea `energyPurchaseBills` de M04 |
| `IVACOM_WEB` | `supplierPortalSubmissions` | — |
| `COMPRAS_RELACION` | `purchaseDocumentLinks` | Tipos 1–5 a `originType`/`targetType` |
| `PREV_COM` | `purchaseForecasts` | — |
| `PPAGOS` (cabecera), `PPITEMS` | `paymentOrders` | Firma y entrega a M14 (CTR-CMP-20) |
| `PPAGOS_FIRMANTES`, `PPAGOS_FIRMAS`, `INTERBANKING`, `MOV_INTERBANKING` | M14 | `PPAGOS_FIRMANTES` → `treasuryAccountSigners` y `PPAGOS_FIRMAS` → `paymentExecutions` (migran vivos, CTR-DAT-78 de T05); credenciales de Interbanking a bóveda, sin migrar. Texto anterior: "Credenciales a bóveda, sin migrar" para las cuatro tablas |
| `RET_COM` | M06 `withholdingsApplied` | Referenciado por `paymentOrders.withholdings` |
| `RETE_TIPO`, `RETE_TIPO_BASE`, `RETS_TIPO`, `CAT_RETG`, `PROD_SER_RET`, `SITIVA` | M06 | — |
| `CTSECCION`, `CTSECCION_ASIGNA`, `CTSECCION_GP_ASIGNA`, `CTSECCION_GRUPOS` | M15 (centros de costo y grupos) | Distribuciones de líneas migran en `allocation` |
| `CIRCUPRO` | `supplierCorrespondence` | — |
| `OPE_COM` | M14/M15 (referencia) | Solo `legacy` |
| `AUDIT_IA` | `legacyAuditRecords` (T05/T07; CTR-DAT-04). Antes: `aiInvoiceExtractions` (solo métricas) | Sin contenido |
| `CMPORDE` | M11 | CTR-CMP-11 |
| `RECEPCIONES`, `ESTADOS_RECEP` | M13 | CTR-CMP-03 |

## 20. Contraposiciones resueltas

| CTR-ID | Fuentes | Conflicto | Resolución | Regla de prevalencia |
|---|---|---|---|---|
| CTR-CMP-01 | DFA M16 vs RN-08 §7/CAT §14 | DFA describe SA → cotización → OC → nota de pedido → recepción → comprobante → pago; RN-08 muestra que el circuito real admite saltos (factura directa, remito directo) | Circuito completo con documentos y estados; saltos solo como excepciones controladas (PA-CMP-07) | BASE > DFA/RN |
| CTR-CMP-02 | CAT `OCOMPRA` vs `NPEDIDO` | Dos documentos con función superpuesta (OC y nota de pedido con importes) | Una sola `purchaseOrders` con `kind` estándar/marco/liberación | BASE §19 > CAT (PA-CMP-02) |
| CTR-CMP-03 | CAT §14 vs funcionalidad | `RECEPCIONES`/`ESTADOS_RECEP` parecen recepción de compras pero son recepción de equipos de clientes para servicio técnico | Pertenecen a M13; la recepción de compras es `supplierReceipts` | CAT con análisis de RN |
| CTR-CMP-04 | RN-08 §7.1 vs AGR-027 | "El circuito no es obligatorio" vs control de 3 vías | Control de 3 vías obligatorio salvo categorías sin OC con aprobación | AGR > RN |
| CTR-CMP-05 | RN-08 §7.5/§7.6 vs BASE §78/§20 | El remito y la factura (P583) mueven stock | M12 publica eventos; M13 mueve stock | BASE > RN |
| CTR-CMP-06 | RN-08 §15.3 vs BASE §19/MER-012 | Autorizaciones de SA/OC/pago sin verificación de permiso y autoautorización al procesar | Workflow T11 con capability, bandas y segregación | BASE > RN |
| CTR-CMP-07 | RN-08 §7.7 vs M06 | `Retenciones.cs` calcula dentro de la OP | M06 dueño del motor; M12 aplica el resultado | DEC/anexo dueño > RN |
| CTR-CMP-08 | RN-08 §1.2/§6.2 vs DEC-009 | Contabilización en lote/posterior | Efecto contable en línea vía eventos a M15 | DEC > RN |
| CTR-CMP-09 | RN-08 §7.6 vs AGR-026 | Promedio ponderado reescribe el precio del remito | Ajuste de costo en M13 sin reescribir historia | AGR > RN |
| CTR-CMP-10 | CAT `RUBPROV` vs `RPSPROV` | Dos catálogos de rubros de proveedores | Catálogo único con `kind` | BASE (dato único) > CAT |
| CTR-CMP-11 | CAT §14 vs M11 | `CMPORDE` está en compras pero relaciona órdenes técnicas con comprobantes de venta | Pertenece a M11/M10 | Funcionalidad > ubicación en CAT |
| CTR-CMP-12 | CAT `INTERBANKING` vs BASE (secretos) | Client secret y contraseñas en tabla | Bóveda T01/T08; M14 consume | BASE > CAT |
| CTR-CMP-13 | RN-08 §1.3 vs CNX | Identidad por claves compuestas | ObjectId + `legacy` (antes `legacyRef`) | CNX > RN |
| CTR-CMP-14 | RN-09 #500/#580 vs T04/M15 | Fecha de cierre e imputación por parámetro | Entidad de períodos | BASE > RN-09 |
| CTR-CMP-15 | INV `frmProveedorPassGenerica` vs T02 | Contraseña genérica para proveedores | Invitación individual (PA-CMP-05) | BASE (seguridad) > INV |
| CTR-CMP-16 | RN-08 §15.3 | Estado "A" ambiguo (anulado o autorizado según contexto) | Estados explícitos §8 | BASE > RN |
| CTR-CMP-17 | RN-08 §7.6/§7.7 vs BASE | La anulación borra la factura o pone retenciones en 0 | Nunca borrar; anulación con importes conservados | BASE > RN |
| CTR-CMP-18 | RN-09 #2691 vs AGR-011 | 4 decimales generan inconsistencias | Precisión por unidad de medida | AGR > RN-09 |
| CTR-CMP-19 | RN-08 §4.2/§4.4 vs límites | Adelantos y sueldos gestionados desde la OP | M16 (PA-CMP-12) | Límite de módulos (guía) > RN |
| CTR-CMP-20 | RN-08 §7.7 / CAT §16 vs M14 | La OP de ProCoop incluye firmas, entrega y medios | M12 aprueba; M14 firma, entrega y ejecuta | Anexo dueño (M14) > CAT |
| CTR-CMP-21 | T05 §7.2 y §20 (CTR-DAT-04, 30, 33, 54, 75) vs nombres de este anexo | Campos y catálogos con otro nombre o dueño | `fileId` → `storedFileId` (y derivados `specFileIds`, `dossierCoverFileId`, `sourceFileId`, `declarationFileId` → `…StoredFileId(s)`), `workflowId` → `workflowInstanceId`, `legacyRef` → `legacy`; `bankAccountId` de `paymentOrders` → `supplierBankAccountId` (es el CBU del proveedor, no `treasuryAccountId`); `AUDIT_IA` → `legacyAuditRecords`; unidades de gasto → `expenseUnits` (M13); combustibles → `fuelTypes` (M18); `FACT_EPEC` → `supplierInvoices.wholesaleSupply` (CTR-DAT-75, §19.2); gas: control contra el factor de M04 y no contra `gasCorrectionCoefficient` de M03 (CTR-DAT-33, RF-CMP-152) | T05 > anexo |
| CTR-CMP-22 | RN-CMP-001 y §7.1 anteriores (CUIT único dentro de `suppliers`, identidad propia del proveedor, `personId` opcional) y CAT `PROVEED` vs RN-PER-001 (M01) y DEC-097 | El proveedor guardaba razón social, CUIT, condición IVA y domicilio propios; un socio contratista quedaba en dos fichas y la CUIT se verificaba en dos lugares. | `personId` obligatorio y único; alta asistida de M01 con control de duplicados; identidad leída de M01 con copia de solo lectura `identitySnapshot`; la ficha guarda solo los datos del rol (RF-CMP-001, RF-CMP-002, RF-CMP-010, RN-CMP-001, §7.1, §7.13.1, PAN-CMP-01, PAN-CMP-02, §19.2). | DEC-097 > CAT y texto anterior del anexo |

## 21. Preguntas abiertas

### PA-CMP-01 — Padrón de proveedores en O3
- **Pregunta:** ¿El piloto (O3) necesita un padrón mínimo de proveedores para registrar el ingreso de equipos serializados?
- **Contexto:** BASE §101 pone stock serializado en O3; el circuito de compras está en O8. Sin proveedor, el ingreso de módems queda sin origen.
- **Opciones:** A) (Recomendada) Sí, padrón mínimo (razón social, CUIT, condición IVA) y registro simple de ingreso, sin OC obligatoria. B) Ingreso en M13 sin proveedor y completar en O8. C) Adelantar el circuito completo a O3.
- **Impacto si no se responde:** el ingreso del piloto queda sin trazabilidad de origen o con costo desconocido.
- **Bloquea:** RF-CMP-018, RF-CMP-067, CU-OPE-01 en O3.

### PA-CMP-02 — Nota de pedido
- **Pregunta:** ¿Se mantiene la nota de pedido como documento distinto de la OC?
- **Contexto:** CAT tiene `OCOMPRA` y `NPEDIDO` con funciones superpuestas (CTR-CMP-02).
- **Opciones:** A) (Recomendada) Unificar: la nota de pedido es una liberación contra OC abierta. B) Mantener dos documentos. C) Eliminar la OC marco.
- **Impacto si no se responde:** modelo de OC indefinido y migración ambigua.
- **Bloquea:** RF-CMP-054, migración de `NPEDIDO`.

### PA-CMP-03 — Recepción implícita en la factura (P583)
- **Pregunta:** ¿La factura puede registrar la recepción cuando no hubo remito?
- **Contexto:** con P583 desactivado, la factura de ProCoop mueve stock. En CoopApps la factura nunca mueve stock.
- **Opciones:** A) (Recomendada) Sí, con capability: la factura genera una recepción separada que se publica a M13. B) No, siempre remito previo. C) Solo para servicios (conformidad).
- **Impacto si no se responde:** proveedores que solo entregan factura no pueden recibirse.
- **Bloquea:** PRM-CMP-035, RF-CMP-061.

### PA-CMP-04 — Tolerancias del control de 3 vías
- **Pregunta:** ¿Qué tolerancias de cantidad y precio se aceptan?
- **Contexto:** AGR-027 exige excepciones; ProCoop solo controla totales (P2057).
- **Opciones:** A) (Recomendada) Cantidad 0 %, precio ±2 % con tope ARS 1.000, configurable por tenant y categoría. B) Sin tolerancias. C) Tolerancias por proveedor.
- **Impacto si no se responde:** demasiadas excepciones o pagos no conciliados.
- **Bloquea:** RF-CMP-090, PRM-CMP-043/082/083.

### PA-CMP-05 — Portal de proveedores
- **Pregunta:** ¿Cómo acceden los proveedores?
- **Contexto:** ProCoop usa contraseña genérica (CTR-CMP-15).
- **Opciones:** A) (Recomendada) Invitación individual con rol `supplier` en Landing-autogestión (T02). B) Enlace con OTP por documento. C) Sin portal, solo mail.
- **Impacto si no se responde:** no se implementa la carga web de comprobantes.
- **Bloquea:** RF-CMP-015, RF-CMP-112, CU-CMP-02.

### PA-CMP-06 — Ajuste manual de retenciones (P2836)
- **Pregunta:** ¿Se permite modificar manualmente una retención calculada?
- **Opciones:** A) (Recomendada) Sí, con capability, motivo y aprobación, conservando el valor calculado. B) Nunca. C) Libre, como en ProCoop.
- **Contexto:** hay casos de certificados de exclusión no cargados a tiempo.
- **Impacto si no se responde:** OP bloqueadas o retenciones incorrectas sin auditoría.
- **Bloquea:** RF-CMP-103, PRM-CMP-110.

### PA-CMP-07 — Compras sin OC
- **Pregunta:** ¿Qué compras pueden registrarse sin OC?
- **Contexto:** RN-08 §7.1 admite cualquier factura directa; AGR-027 pide tratamiento explícito.
- **Opciones:** A) (Recomendada) Solo categorías definidas (servicios públicos, impuestos y tasas, caja chica, montos menores a umbral), con aprobación posterior. B) Ninguna. C) Todas con advertencia.
- **Impacto si no se responde:** el control de 3 vías no se aplica o bloquea gastos recurrentes.
- **Bloquea:** RF-CMP-093, PRM-CMP-085.

### PA-CMP-08 — Habilitación parcial de lo conciliado
- **Pregunta:** Con excepción abierta en parte de la factura, ¿se habilita para pago lo conciliado o se bloquea todo?
- **Contexto:** AGR-027 ("no se paga como si se hubieran recibido todos").
- **Opciones:** A) (Recomendada) Habilitar solo el importe conciliado. B) Bloquear toda la factura. C) Decide el autorizador caso a caso.
- **Impacto si no se responde:** demoras de pago o pago de lo no recibido.
- **Bloquea:** RN-CMP-045, PRM-CMP-084.

### PA-CMP-09 — Compromisos y control presupuestario (AGR-028)
- **Pregunta:** ¿El compromiso de la OC solo se informa o bloquea si excede presupuesto?
- **Opciones:** A) (Recomendada) Eventos de compromiso en O8 (comprometido/devengado/pagado); control presupuestario bloqueante como Extensión de M15. B) Bloqueo desde O8. C) Sin compromisos.
- **Contexto:** AGR-028 pide distinguir comprometido, devengado y pagado.
- **Impacto si no se responde:** la proyección de M14 queda incompleta.
- **Bloquea:** RF-CMP-057, REP-CMP-10.

### PA-CMP-10 — Mis Comprobantes
- **Pregunta:** ¿Los comprobantes importados de ARCA pueden registrarse automáticamente?
- **Opciones:** A) (Recomendada) Solo borradores con revisión humana. B) Registro automático si el proveedor tiene concepto por defecto. C) Solo informe.
- **Contexto:** faltan imputación, servicio y vínculo con OC.
- **Impacto si no se responde:** se pierde la automatización o se registran comprobantes mal imputados.
- **Bloquea:** RF-CMP-120/121, CU-CMP-03.

### PA-CMP-11 — Lectura de facturas con IA
- **Pregunta:** ¿Se habilita la IA y bajo qué condiciones?
- **Opciones:** A) (Recomendada) Opt-in por tenant con acuerdo de tratamiento de datos, en O11, siempre con confirmación humana. B) Habilitada por defecto. C) No incluir.
- **Contexto:** FIC 20 muestra uso con proveedor externo y auditoría `AUDIT_IA`.
- **Impacto si no se responde:** riesgo de datos o funcionalidad sin definir.
- **Bloquea:** RF-CMP-130/131, CU-CMP-04.

### PA-CMP-12 — Adelantos y pagos de sueldos
- **Pregunta:** ¿Los adelantos de sueldo y pagos de recibos siguen saliendo de la OP de compras?
- **Opciones:** A) (Recomendada) Mover a M16; M12 solo ejecuta OP cuando M16 envía un lote aprobado. B) Mantener en M12. C) Mixto por tenant.
- **Contexto:** RN-08 §4.2/§4.4 (CTR-CMP-19).
- **Impacto si no se responde:** novedades de sueldo sin control de M16.
- **Bloquea:** RF-CMP-086, RF-CMP-109/110.

### PA-CMP-13 — Concursos y licitaciones
- **Pregunta:** ¿En qué ola y nivel se incluyen?
- **Opciones:** A) (Recomendada) O8, nivel Estándar, con sobre cerrado y acta. B) Extensión posterior. C) Solo concurso de precios por mail.
- **Contexto:** RN-08 §7.3 muestra carátula, acta y planilla de adjudicación.
- **Impacto si no se responde:** compras de monto alto sin procedimiento formal.
- **Bloquea:** RF-CMP-044, CU-CMP-05.

### PA-CMP-14 — Compras compartidas entre servicios
- **Pregunta:** ¿La distribución por servicio es obligatoria?
- **Opciones:** A) (Recomendada) Obligatoria cuando la línea abastece más de un servicio, por porcentaje o cantidad, sumando 100 %. B) Opcional. C) Siempre un solo servicio.
- **Contexto:** BASE §78 OPE-001 y §80.
- **Impacto si no se responde:** costos por servicio duplicados o sin asignar.
- **Bloquea:** RF-CMP-051, PRM-CMP-031, ESC-CMP-15.

### PA-CMP-15 — Habilitación de pago (P2201/P2457)
- **Pregunta:** ¿Cómo se habilita una factura para pago?
- **Opciones:** A) (Recomendada) Automática por conciliación sin excepciones; manual con capability y bandas T11. B) Siempre manual. C) Automática hasta monto.
- **Contexto:** ProCoop permite autorizar sin verificar permisos.
- **Impacto si no se responde:** pagos sin control o cuello de botella.
- **Bloquea:** RF-CMP-092, PRM-CMP-080/081.

### PA-CMP-16 — Residuales del 05-11-2026 (estados, referencias y nombres de campo)
- **Pregunta:** ¿Cómo se cierran los residuales de M12 que detectaron los entregables regenerados?
- **Opciones:** A) (Recomendada) §8.8 con estados iniciales y transiciones de `supplierAdvances`, `supplyBalances`, `signalRightsContracts` (`draft`, `active`, `ended`) y `signalRightsSettlements`; destinos o "no es referencia" en cada campo del §7.13; facturas y recepciones de compra apuntan a `supplierInvoices` y `supplierReceipts` (antes `invoices` de M05 y `receipts` de M07); `legalEntityId` y `personId` de T05. B) Mantener el texto y resolver en los entregables.
- **Contexto:** el índice de estados marcó máquinas sin estado inicial, valores sin transiciones y el `cancelled` del evento de selección sin origen; el modelo entidad-relación dejó referencias sin destino y algunas apuntaban a colecciones de venta o cobranza.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §7.10, §7.13, §8.
- **Estado:** Asumida la recomendada (DEC-072). `packageIds` → `serviceProducts` (M02, COL-CAT-05; antes `servicePlans`, confirmado por M02 PA-CAT-23 el 5-11-2026); T05 COL-CMP-23 todavía dice que M12 nombra `declarationFileId`, pero este anexo ya usa `declarationStoredFileId`.
- **Sincronización (5-11-2026), Asumida (DEC-072):** M12 cita el servicio interno de M06 `fis.service.calculateWithholdings` (antes `fis.withholding.calculate`; M06 §11.1, PA-FIS-22).

## 22. Trazabilidad

### 22.1 BASE y acuerdos

| Fuente | Requisito | Cobertura |
|---|---|---|
| BASE §19 objetivo | Solicitud, cotización, OC, recepción, comprobante, obligación | RF-CMP-020…094, §8 |
| BASE §19 límite | Stock en M13, pago en M14 | §2, RF-CMP-061, RF-CMP-100…108 |
| BASE §19 alcance: proveedores | Padrón y datos | RF-CMP-001…018 |
| BASE §19 alcance: diferencias de cantidades y precios | Control de 3 vías | RF-CMP-090…094, ESC-CMP-01…03 |
| BASE §19 control de separación | Solicita/aprueba/recibe/paga | RN-CMP-024, PRM-CMP-086, §17.1 punto 3 |
| BASE §19 CU-19 y precarga OC-001 | Entrega parcial | CU-19, ESC-CMP-01, §18 |
| BASE §61 FIS-001, CU-FIS-01 | Retención en el pago | RF-CMP-100…105, CU-FIS-01, ESC-CMP-11 |
| BASE §78 OPE-001 | Compras por servicio y centro de costo | RF-CMP-051, REP-CMP-09, ESC-CMP-15 |
| BASE §78 OPE-002…004, CU-OPE-01, OC-DEMO-002 | Materiales y equipos por servicio sin duplicar | CU-OPE-01, RF-CMP-067 |
| BASE §80 | Pendientes de compras por servicio | PA-CMP-14 |
| HUE-ELE-01 | Factura del mayorista de energía controlada contra la medición de frontera y balance comprado contra facturado | RF-CMP-149…151, RF-CMP-153, RN-CMP-073, RN-CMP-074, JOB-CMP-10, EVT-CMP-16, PAN-CMP-25, ESC-CMP-21, ESC-CMP-23; consume API-MED-78 / RF-MED-129 (M03) |
| HUE-GAS-04 | Factura de la distribuidora de gas con el mismo circuito | RF-CMP-152, RF-CMP-153, RN-CMP-073, ESC-CMP-22; API-MED-78 (m³ sin corregir) y factor de M04 (DEC-085, RN-TAR-035) |
| HUE-TV-01 | Liquidación mensual de derechos de señales por abonados activos por paquete | RF-CMP-154, RF-CMP-155, RN-CMP-075, JOB-CMP-09, EVT-CMP-17, PAN-CMP-26, ESC-CMP-24, ESC-CMP-25 |
| BASE §101 / §105 / §106 | Olas y soluciones | Encabezado, PA-CMP-01 |
| MER-012 | Workflow de aprobación | RN-CMP-007, RN-CMP-024, RF-CMP-092 |
| AGR-003 | Revisiones de documentos aprobados | PRM-CMP-030 |
| AGR-011 | Precisión decimal | RF-CMP-066, CTR-CMP-18 |
| AGR-022 | Fechas de corte | §15 |
| AGR-026 | Costo histórico | RF-CMP-077, RN-CMP-032, CTR-CMP-09 |
| AGR-027 | 3 vías | RF-CMP-090…094, CU-CMP-01, PA-CMP-04/08 |
| AGR-028 | Comprometido/devengado/pagado | RF-CMP-057, REP-CMP-10, PA-CMP-09 |
| DEC-009 | Contabilidad en línea | RF-CMP-144, CTR-CMP-08 |
| DFA M16 | Circuito y mejoras (aprobaciones por monto, 3 vías, Mis Comprobantes, Interbanking) | §9, RF-CMP-120, CTR-CMP-01, Interbanking en M14 |
| FIC 2.4 | Mis Comprobantes | RF-CMP-120/121, CU-CMP-03 |
| FIC 11.1 | Interbanking | CTR-CMP-12/20 (M14) |
| FIC 20 | IA | RF-CMP-130/131, PA-CMP-11 |
| DEC-064 | Entidad jurídica en documentos de compra | §7 (nota de campos comunes) |
| DEC-085 | Corrección de volumen de gas en M04 | RF-CMP-152 |
| DEC-097 (contraste NucleoTransversal, aporte A5) | Persona única: `personId` obligatorio en proveedores, alta asistida de M01, identidad leída de M01 | RF-CMP-001, RF-CMP-002, RF-CMP-010, RF-CMP-018, RN-CMP-001, §7.1 (`personId`, `identitySnapshot`), §7.13.1, §9 (Mis Comprobantes), §12 (eventos consumidos de M01), PAN-CMP-01, PAN-CMP-02, §19.2, CTR-CMP-22 |
| T05 §20 (CTR-DAT-04, 30, 54) | Nombres canónicos y dueños de catálogos | §7, RF-CMP-022, 023, 131, §19, CTR-CMP-21 |

### 22.2 Tablas CAT §14 (34 de 34) y relacionadas

Destino detallado en §19.2. `CMPORDE` → M11; `COMBUSTIBLES` → `fuelTypes` de M18 (CTR-DAT-54); `COMPRAS_RELACION` → `purchaseDocumentLinks`; `COMP_COM`, `IT_COMPC` → `supplierReceipts`; `CON_COM`, `CON_TASAS` → `purchaseConcepts`; `CON_COM_RET`, `PROVEED_RET` → M06; `DESTINATARIO_SAPROV` → `purchaseLookups`; `UNIDADES_GASTOS` → `expenseUnits` de M13 (CTR-DAT-54); `FPALIC_IVA`, `FPITEMS`, `IVACOM`, `IVACOM_COMBUSTIBLES` → `supplierInvoices`; `IT_APROV`, `SAPROV` → `supplyRequests`; `IT_NPED`, `NPEDIDO`, `OCOMPRA` → `purchaseOrders`; `IT_SCOTIZ`, `SCOTIZ` → `quoteRequests`; `IVACOM_WEB` → `supplierPortalSubmissions`; `OBS_PRO`, `PROVEED`, `PROVEED_AUT`, `PROVEED_CBU`, `PROVEED_TIPPROD`, `PROVSUM`, `RPSXPROV`, `RUBXPRO` → `suppliers`; `PROVEED_VALORACIONES` → `supplierEvaluations`; `PREV_COM` → `purchaseForecasts`; `RPSPROV`, `RUBPROV` → `supplierCategories`. Relacionadas: CAT §5 → M06; CAT §16 `PPAGOS`/`PPITEMS` → `paymentOrders` (firmas, Interbanking → M14); CAT §17 → M15; CAT §27 `FIRMASELECTRONICAS*` → T11/M14, `AUDIT_IA` → `legacyAuditRecords` (CTR-DAT-04; `aiInvoiceExtractions` no lo migra); CAT §29 `OPE_COM` → referencia; CAT §31 `CIRCUPRO` → `supplierCorrespondence`.

### 22.3 Reglas RN-08

| Sección | Cobertura |
|---|---|
| §1.1, §1.3, §1.4 | RF-CMP-140…148, CTR-CMP-13 |
| §3 | Proveedores y cuenta corriente: RF-CMP-001…018, REP-CMP-08 |
| §4 (4.1, 4.2, 4.4) | RF-CMP-092, RF-CMP-109/110, CTR-CMP-19 |
| §6.2 | RF-CMP-144 (referencia M15) |
| §7.1 | CTR-CMP-04, PA-CMP-07 |
| §7.2–§7.4 | SA, cotizaciones, concursos, OC: RF-CMP-020…059 |
| §7.5 | Recepción: RF-CMP-060…067, CTR-CMP-05 |
| §7.6 | Comprobantes: RF-CMP-070…086, CTR-CMP-09/17 |
| §7.7 | OP y retenciones: RF-CMP-100…112, CTR-CMP-07/20 |
| §12.1, §12.2, §12.4, §13 | Informes y previsiones: §15 |
| §14 dudas 2–7, 12, 13 | PA-CMP-02, 03, 06, 07, 12, 15 y CTR-CMP-16 |
| §15.3 | Defectos corregidos: RN-CMP-007, 024, 043; CTR-CMP-06/16 |

### 22.4 Parámetros RN-09 COMPRAS (109 de 109)

| Destino | Parámetros V2 |
|---|---|
| PRM-CMP de M12 (§14.1–§14.7) | 110, 217, 218, 264, 382, 406, 409, 410, 426, 580, 583, 832, 1029, 2017, 2018, 2019, 2026, 2034, 2035, 2036, 2037, 2038, 2039, 2040, 2041, 2042, 2043, 2044, 2045, 2057, 2201, 2277, 2308, 2310, 2323, 2335, 2365, 2366, 2377, 2382, 2388, 2403, 2418, 2424, 2447, 2457, 2533, 2539, 2542, 2560, 2572, 2640, 2647, 2649, 2653, 2690, 2691, 2705, 2709, 2735, 2777, 2791, 2810, 2813, 2836, 2867, 2888, 2890, 2893, 2896, 2902, 2905, 2906, 2977, 2989, 3030, 3067, 3068, 3071, 3101, 3119 |
| M14 (§14.8) | 134, 135, 144, 146, 402, 2000, 2001, 2002, 2003, 2004, 2015, 2016, 2025, 2065, 2079, 2372, 2433, 2573, 3044 |
| T01/M17 (§14.8) | 2020, 2021, 2022, 2023, 2024 |
| M13 (§14.8) | 2967, 3043, 3057, 3171 |
| Relacionados fuera de COMPRAS | 500, 518, 519, 527, 2012, 2066, 2112, 2162, 2502, 2503, 2538, 2548, 2952 |

Los parámetros con prefijo `fis.` en §14.7 se declaran en M06; M12 los consume.

### 22.5 Inventario de pantallas (INV)

| Pantalla ProCoop | Cobertura |
|---|---|
| `abm_Proveed`, `ConsultaProveedores`, `SelectorProveedor` | PAN-CMP-01/02 |
| `abm_Proveed_Aut`, `abm_proveed_cbu` | PAN-CMP-02 (pestañas), RN-CMP-004 |
| `frmProveed_Valoraciones` | PAN-CMP-02 (valoraciones), `supplierEvaluations` |
| `frmSeleccionarProveedores` | PAN-CMP-01 (selección masiva), `supplierCorrespondence` |
| `frmProveedorPassGenerica`, `btnBlanqueo` | Reemplazado por invitación (RF-CMP-015, CTR-CMP-15) |
| `abm_Combustible` | PAN-CMP-03 (consulta), `fuelTypes` de M18 (CTR-DAT-54; antes `purchaseLookups`) |
| `frmImportacionArchivos.Importar_RetencionesCompras` | M06 (PRM-CMP-009) |
| `frmCargaRetenciones` | Vista de retenciones en la OP (M06) |
| `frmCargaMedioDePago_Simple`, `frmApertura_Cierre_Cajas_Comprs`, `abm_CajaPago`, `frmConciliacionInterbanking`, `frmSaldosCuentasInterbanking` | M14 (límite) |
