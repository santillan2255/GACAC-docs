# M11 VEN — Ventas, presupuestos y punto de venta

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Estado | Especificación consolidada — pendiente de validar preguntas abiertas |
| Solución (BASE §105) | ERP (principal); Landing-autogestión (aceptación online y consulta del socio); CRM (caso vinculado al presupuesto aceptado); Cobranza (anticipos y cobro en mostrador); Impuestos (IVA y percepciones de ventas y cuotas, vía M06) |
| Olas | **O4**: conceptos por cobrar en operaciones con titulares del piloto Internet (instalación/conexión, su financiación en cuotas vinculada al servicio, MER-010 restringido). **O6**: cargos de reconexión vinculados a mora. **O8**: presupuestos, aceptación online, venta de productos, entregas, devoluciones, vendedores, POS, rendiciones, financiación comercial, flujo continuo presupuesto → aceptación → OT → factura. **O10**: hardware local de POS vía agente. **O11**: reportes avanzados y migración repetible. |
| Dueño de datos | `operationCharges` (cargos por operación con titulares), `salesQuotes` (presupuestos con ítems, conjuntos, notas y versiones), `salesConditions` (condiciones de venta), `salesQuoteAcceptances` (evidencia de aceptación/rechazo online), `salesOrders` (comprobantes de venta de productos, no fiscales), `salesDeliveries`, `salesReturns`, `salesFinancingPlans` (planes de financiación comercial), `salesInstallments` (cuotas de venta), `salesReps` (vendedores), `salesPriceLists`, `salesDiscountRules`, `posTerminals`, `posSessions`, `freightSettlements` (rendición de viajes y fletes de una venta; **Reemplazado por `tripSettlements` de M18 con `source.kind = salesDocument`, CTR-DAT-53**) |
| Fuentes consolidadas | BASE §2 (descripción F1: "Ventas: contado, cargos en factura y cuotas"; complementos POS y R-Pos), §20 (diferenciar venta, consumo y comodato), §23 completo (objetivo, límite, alcance, CU-23, precarga), §39.3 (INS-INT, CUO-VEN), §44 y §70 (facturación separada y Resolución SIyC 267/2024 sobre conceptos ajenos), §52, §72 (PRO-001 a PRO-004, CU-PRO-01), §73 (composición del primer cobro, CU-INS-01, controles), §74 (pendientes), §78 (el costo del equipo no se convierte en cargo al socio), §97.12, §99.3 (matriz: ventas y cuotas en la factura), §101, §103 (grupos de facturación), §105, §106; MER-009 (obras con presupuesto, referencia), MER-010 completo, MER-012 (workflow); AGR-003, AGR-011, AGR-014, AGR-016, AGR-022, AGR-026; DFA M13 (Módulo 13 — Ventas, presupuestos y punto de venta, funciones y mejora "flujo continuo"), DFA M12 mejoras (simulador de plan, CFT); RN-08 §7.7 y §15.3 `clsPresupuesto`, §15.3 `clsProdSer` (recargos/descuentos y actualización de precios), §15.4 (`PROD_SERV`, facturado no entregado), §15.3 `clsSAprov` (compromiso por presupuestos); RN-02 §2.1, §2.3, §2.5 (`FacturarCuotas`), §10.2 (`clsModificacionCuotas`), §11.1, §11.2 (importaciones con destino `COMP_VEN`/`DEUDAVTA`), §14 (variables de ventas), §15, §16 (defectos de comprobantes y ventas, rendición de fletes); RN-09 VENTAS_Y_FACTURACION, CONFIGURACION, TITULARES, FINANCIACIONES, TECNICA y COBRANZA (parámetros de presupuestos, ventas, cuotas, vendedores, PMovil y reconexión); CAT §13 completo (`COMP_VEN`, `COMP_VEN_RENDICION`, `COMP_VEN_RENDICION_ITEMS`, `IT_COMPV`, `MAQUINAS`, `OB_COMPV`, `PRESUIT`, `PRESUIT_CONJUNTOS`, `PRESUPU`, `PRESUPU_COMPROBANTES`, `PRESUPU_CONDICION`, `PRESUPU_NOTAS`, `VENDEDOR`), CAT §14 (`CMPORDE`), CAT `COMPPOS`, `DESCPOS`, `TEL_POS_REG_CAJA`, `TEL_POS_REG_GRUPOS`, `DEUDAVTA`, `IVAVTA`; FIC 19 (hardware local), FIC 20 (IA, referencia); INV ProMod_Facturacion (`abm_ComprobanteRendicion`, `abm_Presupu_Condicion`, `abm_Presupuesto_Notas`, `abm_Vendedor`, `frmAjusteCuotasMoneda`, `frmAnulacionComprobantesVenta`, `frmComprobanteVenta`, `frmComprobanteVenta_Detalle`, `frmComprobantesFactura_Cuota`, `frmEdicionCuotas`, `frmFacturasImpresion_Cuotas`, `frmImpresionPresupuesto_Orden`, `frmModificaDatosCuotas`, `frmModificarTipoCuotas`, `frmPresupu_EstadoManual`, `frm_ComprobanteRendicion_Detalle`, `frm_Presupuesto`, `frm_Presupuesto_ActualizarProd`, `frm_Presupuesto_ConjuntoDetalle`, `frm_Presupuesto_ConjuntoDetalle_Item`, `frm_Presupuesto_Detalle`, enums `Estados_Presupuesto`, `Estado_AbmRendicion`), INV ProMod_Cobranzas (`FormasPago`, `frmVentaPrepaga`, `frmVentaPrepagaRapida`, `frmAnticipo`, `frmAgregarDeudaCuotas`, `frmDetallecuotas`, `frmReconstruccion_Cuotas`), INV Configuracion (`frmSeleccionar_Presupuesto`, `abm_PtoVenta`); CNX (patrones de pantalla, PWA, permisos) |


> **Norma de implementación (DEC-111, DEC-112, DEC-110, DEC-113).** Construcción GoodApps: **.NET 10**, **ASP.NET Core**, **EF Core**, **Azure SQL** (base compartida, `TenantId` en tablas de negocio), front **React 19**, **Microsoft Azure** (Container Apps, Blob, Queue, Key Vault, Application Insights), identidad **OpenIddict**. Modelo físico: `07-modelo-relacional-azure-sql.md` y `07-catalogo-tablas-sql.md`. Checklist e impacto: `06-impacto-adaptacion-stack-goodapps.md` (**DIR-13**).
>
> **Lectura:** «colección» en este anexo = **entidad lógica**; tablas, columnas y FK en `07-*`. RF/RN/CU del anexo **no cambian** por el stack.


## 1. Objetivo

Gestionar todo lo que la cooperativa **vende o cobra por única vez** fuera de la liquidación periódica del servicio, con trazabilidad comercial, física, financiera, fiscal y contable:

1. Los **conceptos por cobrar en operaciones con titulares** (derecho de conexión, instalación, reconexión, cambio de titular, traslado u otro concepto habilitado), generados por un hito operativo y cobrados con el servicio, al contado o financiados.
2. Los **presupuestos** a socios, titulares, personas o prospectos, con condiciones de venta, conjuntos, notas, comprobantes generados, envío, **aceptación online** y conversión automática en orden de trabajo y factura (**flujo continuo**).
3. La **venta de productos y servicios adicionales**: pedido, disponibilidad, entrega parcial, devolución, listas de precios, reglas de recargo/descuento, vendedores, **punto de venta de mostrador (POS)** y rendición de viajes/fletes.
4. La **financiación comercial** de una venta nueva (cronograma de cuotas, intereses, IVA y percepciones por cuota, cancelación anticipada), separada de la regularización de deuda anterior (M08).
5. La regla de **inclusión de ventas y cuotas en la factura del servicio** (MER-010): por defecto en documentos propios presentados juntos en el resumen; dentro de la factura del servicio solo los conceptos vinculados a ese servicio y con validación fiscal.

## 2. Límite y responsabilidades

**Qué hace M11:**

- Es dueño de la operación comercial (cargo, presupuesto, venta, entrega, devolución, cronograma de cuotas) y de su estado comercial.
- Decide **qué** se cobra, **a quién**, **cuándo** se vuelve exigible y **en qué documento** debe incluirse (propio o factura del servicio), y solicita la emisión a M05.
- Calcula precio, descuentos, recargos comerciales, prorrateos de flete y molde, intereses de financiación y cronograma.
- Emite eventos para técnica, stock, facturación, cuenta corriente, contabilidad y comunicaciones.

**Qué NO hace M11 y a quién delega:**

| Tema | Responsable | Qué recibe o pide M11 |
|---|---|---|
| Comprobante fiscal (factura, ND, NC, numeración, CAE/CAEA, PDF, QR) | M05 FAC | M11 pide `fac.invoice` para la venta, la cuota o el cargo; recibe `fac.invoice.issued/voided` |
| IVA, percepciones IIBB, libro IVA ventas, regímenes informativos | M06 FIS | M11 envía la base por ítem/cuota; M06 calcula y registra |
| Precio de servicios (abono, tramos) y valor de conceptos tarifarios (instalación, conexión, reconexión) | M04 TAR | M11 consulta el concepto y su versión vigente a la fecha del hito |
| Catálogo de servicios, productos, planes y conceptos | M02 CAT | M11 referencia `products`, `billingConcepts`, `plans` |
| Stock físico, reservas, series, egreso, devolución a depósito, RMA, equipos en reparación, lista de materiales | M13 STK | M11 pide reserva, egreso y reingreso; recibe disponibilidad y confirmación |
| Orden de trabajo, visita, instalación, reconexión técnica, app de campo | M10 TEC | M11 pide OT desde presupuesto aceptado; recibe `tec.workOrder.closed` (EVT-TEC-07) con materiales consumidos |
| Caso CRM, ficha 360, alertas en atención | M09 CRM | M11 crea o vincula el caso del presupuesto y publica alertas |
| Cuenta corriente, imputación de pagos, anticipos, cajas, pasarelas | M07 COB | M11 consulta saldo/estado de cuotas; el POS usa la caja de M07 |
| Refinanciación, convenios de deuda, intereses por mora, suspensión y corte, decisión de reconexión | M08 MOR | M08 pide a M11 el cargo de reconexión; M11 nunca refinancia deuda anterior |
| Asientos contables | M15 CON | M15 consume eventos de M11/M05 |
| Pagos a transportistas, viáticos y combustible de rendición | M14 TES / M12 CMP | M11 registra la rendición; el pago sigue su circuito |
| Venta de energía prepaga y puntos de venta remotos R-Pos | M03 MED | Fuera de M11 (referencia) |
| Aprobaciones y expediente documental | T11 WFL | M11 declara qué operaciones requieren aprobación |
| Envío de presupuestos y avisos | T09 COM | M11 provee plantillas y datos |
| Hardware de mostrador (impresora de tickets, lector) | T06 INT / agente local (FIC 19) | M11 emite trabajos de impresión |

**Regla de límite rectora (BASE §23):** M11 administra la venta y su cronograma; **no mezcla la operación nueva con la refinanciación de deuda anterior**. El cobro se registra por cajas o pagos externos (M07). **Regla de BASE §78:** el costo de adquirir un equipo no se transforma automáticamente en un cargo al socio; su cobro depende de las condiciones del producto (venta, comodato u otra modalidad).

## 3. Glosario del módulo

| Término | Definición | Clave de diccionario | Término ProCoop equivalente |
|---|---|---|---|
| Cargo por operación | Concepto de única vez que nace de un hito operativo con un titular (conexión, instalación, reconexión, cambio de titular, traslado) y se cobra con el servicio, al contado o en cuotas. | `dict:ven.operationCharge` | "Conceptos por cobrar en operaciones con titulares", derechos de conexión/reconexión (`PRCAGAS` pendientes) |
| Hito disparador | Evento que vuelve exigible un cargo: aprobación, OT confirmada, instalación efectiva, inicio de período. | `dict:ven.chargeTrigger` | — |
| Presupuesto | Oferta comercial con ítems, precios, condiciones y validez, dirigida a una cuenta o persona. | `dict:ven.quote` | Presupuesto (`PRESUPU`/`PRESUIT`) |
| Versión de presupuesto | Contenido inmutable que se envía y se acepta; modificar crea una nueva versión. | `dict:ven.quoteVersion` | — (ProCoop sobrescribe) |
| Conjunto | Agrupador de ítems dentro de un presupuesto (por ejemplo, "Tablero", "Acometida") con nombre y cantidad. | `dict:ven.quoteGroup` | `PRESUIT_CONJUNTOS` |
| Condición de venta | Texto/condición comercial seleccionable (plazo, forma de pago, garantía, validez). | `dict:ven.salesCondition` | `PRESUPU_CONDICION` |
| Nota de presupuesto | Nota con título, texto, fecha y usuario. | `dict:ven.quoteNote` | `PRESUPU_NOTAS` |
| Aceptación online | Conformidad del destinatario sobre una versión exacta, registrada con evidencia. | `dict:ven.onlineAcceptance` | — (mejora DFA M13) |
| Flete / molde | Productos especiales cuyo importe se prorratea entre los demás ítems por peso. | `dict:ven.freight` / `dict:ven.mold` | Producto P2953 / P3032 |
| Venta (pedido de venta) | Operación comercial de productos o servicios adicionales; su documento fiscal lo emite M05. | `dict:ven.salesOrder` | Comprobante de venta `COMP_VEN`/`IT_COMPV`; "CVEN" |
| Venta rápida | Venta de mostrador simplificada con cuenta y vendedor por defecto. | `dict:ven.quickSale` | CVEN Rápida (P1007/P1008) |
| POS | Puesto de venta de mostrador con sesión de caja, lector y emisión inmediata. | `dict:ven.pos` | Complemento POS de ProCoop (no confundir con `COMPPOS`) |
| Entrega pendiente | Cantidad vendida aún no entregada. | `dict:ven.pendingDelivery` | `IT_COMPV.CAN_PEN` ("facturado no entregado") |
| Plan de financiación comercial | Condición de cuotas, anticipo, tasa, sellado y máximo de cuota aplicable a una venta. | `dict:ven.financingPlan` | Formas de pago / planes (`FormasPago`) |
| Cuota de venta | Obligación programada de una venta financiada con capital, interés, IVA y percepción. | `dict:ven.installment` | `DEUDAVTA` (`TPCUOTA = 0`), interés diferido (`TPCUOTA = 1`) |
| Cancelación anticipada | Pago adelantado de cuotas con tratamiento del interés no devengado. | `dict:ven.earlyPayoff` | — |
| Vendedor | Rol de una persona de M01 a la que se atribuye la venta o el presupuesto; la identidad (nombre, documento, domicilio, contactos) es de la persona y la ficha de vendedor guarda solo los datos del rol (DEC-097). | `dict:ven.salesRep` | `VENDEDOR` |
| Lista de precios | Precios de venta de artículos por vigencia y canal. | `dict:ven.priceList` | `PROD_SER.PRE_VSI` y actualización masiva |
| Regla de recargo/descuento | Condición que bonifica o recarga un producto según cuenta, forma de pago, deuda y cantidad. | `dict:ven.discountRule` | `Get_RecargoDescuento` (`clsProdSer`) |
| Rendición de viaje | Registro de km, flete, peajes, viáticos y combustible de una entrega. | `dict:ven.freightSettlement` | `COMP_VEN_RENDICION`, `COMP_VEN_RENDICION_ITEMS` |
| Anticipo de productos | Pago recibido antes de facturar, aplicable a la venta o a facturación futura. | `dict:ven.productAdvance` | Anticipo (P29, P2409, P3008, P3038) |
| Inclusión en factura del servicio | Excepción por la que un cargo o cuota vinculado al servicio viaja en su factura periódica. | `dict:ven.includeInServiceInvoice` | Cuota en factura mensual (P308) |

## 4. Actores, permisos y alcance

| Rol | Capabilities | Alcance de datos |
|---|---|---|
| Vendedor / comercial | `ven.presupuestos.ver`, `ven.presupuestos.crear`, `ven.presupuestos.editar`, `ven.presupuestos.enviar`, `ven.ventas.ver`, `ven.ventas.crear`, `ven.ventas.editar`, `ven.cuotas.ver`, `ven.precios.ver` | Sucursales asignadas; "propios" si el perfil lo limita a su `salesRepId` |
| Supervisor comercial | Todo lo del vendedor + `ven.presupuestos.aprobar`, `ven.presupuestos.anular`, `ven.presupuestos.cambiarEstado`, `ven.ventas.aprobar`, `ven.ventas.anular`, `ven.ventas.devolver`, `ven.riesgo.override`, `ven.precios.editar`, `ven.precios.actualizarMasivo`, `ven.descuentos.configurar`, `ven.vendedores.*`, `ven.presupuestos.exportar`, `ven.ventas.exportar` | Tenant o sucursales |
| Cajero POS | `ven.pos.operar`, `ven.pos.abrir`, `ven.pos.cerrar`, `ven.ventas.crear` (venta rápida), `ven.ventas.ver` | Terminal y sucursal asignadas |
| Administrativo de facturación | `ven.cargos.ver`, `ven.cargos.crear`, `ven.cargos.editar`, `ven.cargos.anular`, `ven.cuotas.ver`, `ven.cuotas.editar`, `ven.cuotas.modificarMasivo`, `ven.cuotas.cancelarAnticipado`, `ven.ventas.anular` | Tenant / servicios asignados |
| Aprobador (T11) | `ven.cargos.aprobar`, `ven.presupuestos.aprobar`, `ven.ventas.aprobar` según políticas | Según política de T11 |
| Técnico de campo (pwa-campo) | `ven.presupuestos.ver`, `ven.presupuestos.crear` (en campo), `ven.ventas.crear` (venta en campo) | Órdenes asignadas a su cuadrilla |
| Depósito / logística | `ven.entregas.ver`, `ven.entregas.registrar`, `ven.rendiciones.ver`, `ven.rendiciones.crear`, `ven.rendiciones.editar` | Depósitos asignados |
| Socio / titular (pwa-socio, landing) | `ven.misPresupuestos.ver`, `ven.misPresupuestos.aceptar`, `ven.misPresupuestos.rechazar`, `ven.misCuotas.ver` | Solo sus cuentas (relación autorizada M01) |
| Destinatario sin cuenta (prospecto) | Acceso por enlace firmado de un solo presupuesto (`/api/public/<tenantSlug>/quotes/:token`) | Solo ese presupuesto, por vigencia del enlace |
| Configurador del tenant | `ven.config.configurar`, `ven.condiciones.configurar`, `ven.planes.configurar`, `ven.pos.configurar` | Tenant |
| Auditor | `ven.*.ver`, `ven.*.exportar` | Tenant, solo lectura |
| Soporte de plataforma | Acceso temporal según T01/T02 | Tenant con autorización vigente |

Controles: quien crea un presupuesto o una venta con descuento fuera de política no puede aprobarlo (segregación, T11). Las acciones masivas (cambio de estado, anulación por rango, modificación masiva de cuotas, actualización de precios) exigen la capability y registran usuario y fecha **siempre** (corrige el defecto de ProCoop de acciones masivas sin control, RN-08 §4.3).

## 5. Requisitos funcionales

> **Barrido transversal (19-11-2026, DEC-111).** Los RF/RN de **§5–§6** definen comportamiento aceptado. Citas a MongoDB, Mongoose, BullMQ, Vue o npm son **mecanismos históricos Connectia** o columnas de contraste; en build GoodApps prevalecen `03-norma-ejecucion-goodapps.md` §3–§4, `07-ddl` y §7 de este anexo. No reinterpretar alcance sin nueva DEC.


### 5.1 Conceptos por cobrar en operaciones con titulares (piloto)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-VEN-001 | Registrar cargos por operación con titulares: derecho de conexión, instalación, reconexión, cambio de titular, traslado de domicilio, visita adicional u otro concepto habilitado por el tenant, asociados a cuenta, titular, contrato y servicio. | DFA M13; BASE §72 PRO-002; §73 | Núcleo | O4 | Informado | Un cargo siempre tiene `accountId`, `contractId`, `serviceCode`, `conceptId` y origen; sin contrato no se admite salvo concepto marcado `allowWithoutContract`. |
| RF-VEN-002 | Generar el cargo automáticamente desde el hito disparador configurado por concepto (aprobación de la solicitud, OT confirmada, instalación probada, inicio de período), consumiendo eventos de M09, M10 y M08; también alta manual con permiso. | BASE §72 ("establecer disparador de cada cargo"); §73 | Núcleo | O4 | Adoptado | Al confirmar una OT de instalación con el concepto INS-INT configurado se crea un único cargo en estado `pending`. |
| RF-VEN-003 | Valorizar el cargo con el concepto y la versión tarifaria de M04 vigente a la fecha del hito, guardando la instantánea (precio, versión, regla de redondeo, tratamiento fiscal). | BASE §6, §72; AGR-011 | Núcleo | O4 | Adoptado | Cambiar la tarifa después del hito no modifica el cargo ya valorizado. |
| RF-VEN-004 | Idempotencia: un mismo hito (`sourceType` + `sourceId` + `conceptId`) genera un único cargo aunque el evento llegue repetido o la app de campo sincronice dos veces. | BASE §73 Controles; AGR-016 | Núcleo | O4 | Adoptado | Reprocesar el evento devuelve el cargo existente; no hay duplicado. |
| RF-VEN-005 | Elegir la modalidad de cobro del cargo: (a) contado en la próxima factura del servicio; (b) factura inmediata propia; (c) financiado en cuotas con plan comercial, mostrando capital, interés y tributos de cada cuota. | BASE §72 PRO-004, §73 ("instalación: hito, pago contado o cuotas"); MER-010; DEC-016 (la instalación contado se factura en la primera factura del ciclo posterior a la OT confirmada) | Núcleo | O4 | Adoptado | El ejemplo de §72 (ARS 20.000 en 2 cuotas de ARS 11.000 = 10.000 de capital + 1.000 de interés) se reproduce exactamente. |
| RF-VEN-006 | Al elegir la financiación de un cargo se anula la alternativa de cobrarlo al contado: un solo cronograma y ninguna duplicación entre módulos. | BASE §72 CU-PRO-01 ("evitar duplicar una instalación cobrada al contado y financiada") | Núcleo | O4 | Informado | Un cargo financiado no aparece como ítem contado en la factura del ciclo. |
| RF-VEN-007 | Incluir el cargo o sus cuotas en la factura periódica del servicio **solo** cuando el concepto está marcado como vinculado a ese servicio (`linkedToServiceCode`) y tiene validación fiscal registrada por el tenant; si no, se emite en documento propio y se presenta en el resumen de cuenta. | MER-010; BASE §52, §70; §103 | Núcleo | O4 | Informado | Un concepto no vinculado nunca se agrega a la factura del servicio, aunque el tenant use grupos de facturación. |
| RF-VEN-008 | Bonificar total o parcialmente, o anular, un cargo antes de facturarlo, con motivo y aprobación por monto (T11). Después de facturado, la corrección es una NC en M05. | AGR-003; MER-012 | Núcleo | O4 | Adoptado | La bonificación queda auditada y el cargo conserva su importe original y el bonificado. |
| RF-VEN-009 | Generar cargos y créditos de reconexión a pedido de M08/M10: débito al reconectar un servicio no facturado en el período (P2661), crédito por días de servicio desconectado con su concepto (P2483/P2485) y opción de cerrar la OT de reconexión sin comprobante (P2907). | RN-09 TECNICA (2483, 2485, 2661, 2907); DFA M13 | Estándar | O6 | Adoptado | Con P2661 activo, la reconexión genera un único cargo; con P2907 la OT puede cerrarse sin cargo y queda la marca. |
| RF-VEN-010 | Mostrar al socio, en la PWA y en el resumen, cada cargo por operación con su origen, estado, modalidad y cronograma de cuotas. | BASE §72 ("mostrar al socio el detalle de su precio") | Estándar | O4 | Adoptado | El socio ve "Instalación Internet — 2 cuotas de ARS 11.000 — cuota 1 facturada". |
| RF-VEN-011 | Proveer a M04/M05 los cargos pendientes para la simulación del primer cobro (abono prorrateado + instalación) antes de confirmar la contratación. | BASE §73 CU-INS-01 | Núcleo | O4 | Adoptado | La simulación del CU-INS-01 muestra ARS 30.500 (con prorrateo y promoción) y ARS 35.000 (sin prorrateo). |
| RF-VEN-012 | Configurar el método de facturación de presupuestos de factibilidad: factura manual o venta de materiales. | RN-09 2348 | Estándar | O8 | Adoptado | Con "venta de materiales" el presupuesto de factibilidad aceptado genera una venta con sus ítems. |
| RF-VEN-013 | Permitir cargos por operación sobre servicios de cualquier tipo (electricidad, agua, gas, TIC, sociales) con el mismo modelo. | DEC-007 | Estándar | O7 | Adoptado | Un cargo de conexión de agua se registra igual que el de Internet. |

### 5.2 Presupuestos

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-VEN-020 | Crear presupuestos para una cuenta/titular (con persona), para una persona registrada o para un prospecto (nombre y contacto), con persona por defecto configurable (P2894); cabecera: número, fecha, validez, punto de venta, vendedor, condición de venta, moneda y cotización, servicio y domicilio de prestación opcionales, referencia, obra u OT relacionada. | DFA M13; CAT `PRESUPU`; RN-08 §15.3; RN-09 2894, 2788 | Estándar | O8 | Informado | El presupuesto se numera por tenant y punto de venta sin huecos. |
| RF-VEN-021 | Ítems de presupuesto: producto, concepto o servicio adicional; descripción (hasta el largo configurable, ProCoop trunca a 60); cantidad; precio unitario sin IVA o con IVA (P2915); descuento; alícuota; cantidad pendiente; serie reservada; requerimiento vinculado; observación; estado del ítem; marca "prorratear". | CAT `PRESUIT`; RN-08 §15.3 | Estándar | O8 | Informado | La cantidad pendiente inicia igual a la cantidad y baja al facturar o entregar. |
| RF-VEN-022 | Administrar el catálogo de **condiciones de venta** de presupuestos y seleccionarlas en cada presupuesto. | DFA M13; CAT `PRESUPU_CONDICION`; INV `abm_Presupu_Condicion` | Estándar | O8 | Informado | Una condición inactiva no se ofrece en presupuestos nuevos pero se conserva en los históricos. |
| RF-VEN-023 | Registrar **notas** de presupuesto con título, texto, fecha y usuario; listarlas e imprimirlas. | CAT `PRESUPU_NOTAS`; INV `abm_Presupuesto_Notas`; RN-08 `GetDatosInformePresupuestoNotas` | Estándar | O8 | Informado | Las notas no se editan después de enviada la versión; se agregan nuevas. |
| RF-VEN-024 | **Conjuntos**: agrupar ítems en conjuntos con descripción y cantidad; copiar/clonar conjunto; editar y eliminar conjunto e ítems; autocompletar el nombre del conjunto (P3004); emitir el presupuesto por conjuntos (P2949). | CAT `PRESUIT_CONJUNTOS`; INV `frm_Presupuesto_ConjuntoDetalle`, `_Item`; RN-09 3004, 2949 | Estándar | O8 | Informado | El total del conjunto = Σ ítems × cantidad del conjunto. |
| RF-VEN-025 | Precio de productos con estructura (lista de materiales de M13): costo = costo de componentes + costo fijo de fabricación; venta = costo × (1 + margen); margen por defecto (P2903) y cálculo de rentabilidad por ítem, conjunto y total. | RN-08 §15.3 `ActualizarPrecios`; `Get_CostoFijo`; RN-09 2903 | Estándar | O8 | Adoptado | Con costo 1.000 y margen 30 % el precio sugerido es 1.300. |
| RF-VEN-026 | Prorratear el importe de **flete** (producto P2953), **molde** (P3032) y de los ítems marcados "prorratear" entre los demás ítems en proporción al peso. | RN-08 §7.7, §15.3 `CalcularProrrateo` | Estándar | O8 | Informado | La suma prorrateada iguala exactamente el importe a repartir (residuo asignado al último ítem). |
| RF-VEN-027 | Actualizar precios del presupuesto (P2892) por precio vigente, índice, cotización del dólar o margen antes de enviarlo. | INV `frm_Presupuesto_ActualizarProd`; RN-09 2892 | Estándar | O8 | Informado | La actualización crea una nueva versión si el presupuesto ya fue enviado. |
| RF-VEN-028 | Validar al presupuestar, según configuración: que la cuenta tenga servicios activos (P2395; condición conectado); que el servicio no esté desconectado (con opción de cerrar si tiene deuda, P3009); que la cuenta tenga la propiedad requerida o no tenga la propiedad que impide presupuestar (P2901); deuda y vencimiento (P2381, P2600). | RN-08 §15.3 `ValidarServiciosCuenta`, `ValidarConexionServicios`, `ValidarPropiedad`; RN-09 2381, 2395, 2600, 2901, 3009 | Estándar | O8 | A validar (PA-VEN-11) | Cada validación puede ser bloqueante o advertencia; el override exige `ven.riesgo.override` y queda auditado. |
| RF-VEN-029 | Impedir otro presupuesto vigente, no anulado y sin facturar de la misma cuenta con alguno de los mismos productos. | RN-08 §15.3 `ValidarPresupuPorPer` | Estándar | O8 | Informado | Se informa el presupuesto existente y su enlace. |
| RF-VEN-030 | Gestionar el ciclo de vida del presupuesto con transiciones explícitas (sección 8): enviar, reenviar, aprobar/aceptar, volver a borrador, rechazar, marcar para facturar, facturar parcial/total, anular, vencer. | RN-08 §7.7, §15.3; AGR-003 | Estándar | O8 | Informado | Ninguna transición se ejecuta desde un estado no permitido (corrige `AprobarPresupuesto` sin validar estado). |
| RF-VEN-031 | Enviar el presupuesto por email, WhatsApp o portal con PDF de plantilla configurable (P210), impresión simple por defecto (P3037) y página extra con datos de producto (P3024); impresión masiva de presupuestos/órdenes. | RN-09 210, 3024, 3037; INV `frmImpresionPresupuesto_Orden`; T09 | Estándar | O8 | Informado | El envío registra canal, destinatario, versión y resultado de entrega. |
| RF-VEN-032 | **Aceptación online**: el destinatario acepta o rechaza (con motivo) una versión exacta desde la PWA (si es socio autenticado) o desde un enlace firmado con verificación por OTP al contacto registrado; se guarda evidencia (versión, hash del PDF, fecha, canal, usuario o contacto verificado, IP y agente). | DFA M13 mejora; BASE §50; T02 | Estándar | O8 | A validar (PA-VEN-05) | Aceptar una versión reemplazada o vencida es imposible; la evidencia queda en el expediente. |
| RF-VEN-033 | Vencimiento automático: un presupuesto enviado cuya validez es anterior a hoy pasa a `expired` (job diario); puede renovarse creando una nueva versión con precios actualizados. | RN-08 §15.3 (vencido si `FEC_VAL` < fecha); RN-09 2788 | Estándar | O8 | Adoptado | El listado distingue enviados vigentes y vencidos. |
| RF-VEN-034 | Modificar un presupuesto enviado lo vuelve a borrador en una nueva versión; el cambio de cuenta/persona solo se permite antes de aprobar y con P3010. | RN-08 §15.3 `ActualizarPRESUPU`; RN-09 3010 | Estándar | O8 | Informado | La versión anterior queda consultable y no aceptable. |
| RF-VEN-035 | Aprobar un presupuesto sin obra u OT asignada pide confirmación explícita cuando P2914 está activo. | RN-08 §7.7; RN-09 2914 | Estándar | O8 | Informado | La confirmación queda registrada con el usuario. |
| RF-VEN-036 | Al aceptarse, ofrecer o crear automáticamente (según configuración) el caso CRM y la OT en M10 con los ítems de mano de obra y materiales, dejando el vínculo presupuesto ↔ caso ↔ OT; al rechazar o anular, desvincular y cerrar el caso. | RN-08 §15.3 `GenerarTicket`, `Rechazar_Anular_Presupu`; DFA M13 mejora | Estándar | O8 | Adoptado | El caso nace con tipo y estado configurables (no fijos) y asunto = referencia o número. |
| RF-VEN-037 | Presupuestos en campo: enviar presupuestos a la app de campo (P2380), sincronizarlos con ventas (P2386), usar solo productos habilitados para campo, punto de venta fijo de campo (P2383), presupuestos a granel con coeficiente multiplicador (VAR_PMOVIL 25 y 26), órdenes para campo con contacto, domicilio y medidor del servicio. | RN-08 §15.3 `ValidarItemsPresupu`, `Get_Presupuestos_Orden`; RN-09 2380, 2383, 2386, PMOVIL 25, 26 | Estándar | O8 | Informado | Un producto no habilitado para campo no puede agregarse a un presupuesto que se envía a campo. |
| RF-VEN-038 | Facturar en campo ventas con o sin presupuesto usando el tipo de factura configurado (P2592 / P2641), días de vencimiento (P2593), guardado del PDF (P2589), publicación del comprobante en la autogestión (VAR_PMOVIL 52) y mensaje automático por SMS o WhatsApp (VAR_PMOVIL 53). | RN-09 2589, 2592, 2593, 2641, PMOVIL 52, 53 | Estándar | O8 | Informado | La venta en campo offline usa `clientMutationId` y no se duplica al sincronizar. |
| RF-VEN-039 | Registrar anticipos sobre un presupuesto (cobro por M07) y aplicarlos al facturar; un presupuesto con anticipo no se anula sin devolver o reasignar el anticipo. | RN-08 §15.3 `tieneAnticipo`; INV `frmAnticipo` | Estándar | O8 | Adoptado | El anticipo aplicado reduce el saldo de la factura generada. |
| RF-VEN-040 | Generar desde el presupuesto, total o parcialmente por ítems pendientes, la venta (`salesOrder`) y/o la solicitud de factura a M05; registrar los comprobantes generados en el presupuesto. | CAT `PRESUPU_COMPROBANTES`; RN-08 `Generar_PresupuComprob`, `ActualizarCantidades` | Estándar | O8 | Informado | Dos facturaciones parciales no superan la cantidad presupuestada. |
| RF-VEN-041 | Comprometer stock por presupuestos aprobados con obra (reserva en M13) y liberar al anular, rechazar o facturar. | RN-08 §15.3 `Get_Stock_Comprometido_Presup` | Estándar | O8 | Adoptado | El disponible de M13 descuenta lo comprometido. |
| RF-VEN-042 | Alertar en la ficha de atención (M09) cuando la cuenta tiene un presupuesto pendiente (P2398). | RN-09 2398 | Estándar | O8 | Informado | La alerta muestra número, estado y vencimiento. |
| RF-VEN-043 | Permitir importar los productos de un presupuesto en un vale de materiales de M13 (P2899). | RN-09 2899 | Estándar | O8 | Informado | El vale referencia el presupuesto. |
| RF-VEN-044 | Seleccionar un presupuesto existente desde otras pantallas (búsqueda por cuenta, número, estado) y vincularlo a obra (`ObtenerObras`) o a orden. | INV `frmSeleccionar_Presupuesto`; RN-08 `ObtenerObras` | Estándar | O8 | Informado | La búsqueda respeta el alcance de datos. |
| RF-VEN-045 | Cambiar el estado manualmente con permiso especial y motivo (reemplaza `frmPresupu_EstadoManual`), limitado a las transiciones de la sección 8. | INV `frmPresupu_EstadoManual` | Estándar | O8 | Adoptado | El cambio manual queda en el historial con motivo. |
| RF-VEN-046 | Informe de presupuestos por estado, vendedor, período, cuenta, con notas, pendientes, conversión y tiempo a aceptación. | RN-08 `GetDatosInformePresupuesto`; AGR-022 | Estándar | O8 | Adoptado | La tasa de conversión = aceptados / enviados del período. |
| RF-VEN-047 | Presupuesto de obras y contribución por mejoras (MER-009): el presupuesto puede vincularse a una obra de M10 para su costeo; el prorrateo entre beneficiarios pertenece a M10/M08. | MER-009 | Extensión | O10 | Adoptado | El presupuesto aceptado aporta el monto aprobado a la obra. |

### 5.3 Venta de productos, entregas y devoluciones

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-VEN-050 | Registrar ventas de productos y servicios adicionales con cabecera (cuenta/titular, servicio opcional, vendedor, condición y forma de pago, lote, descuento, moneda/cotización, observaciones y transporte) e ítems (producto, cantidad, precio sin IVA, descuento, alícuotas, cantidad pendiente de entrega, serie, observación, estado). | CAT `COMP_VEN`, `IT_COMPV`, `OB_COMPV`; INV `frmComprobanteVenta`, `_Detalle`; BASE §23 | Estándar | O8 | Informado | La venta confirmada solicita a M05 el comprobante y guarda su referencia. |
| RF-VEN-051 | Administrar listas de precios de venta de artículos con vigencia, moneda y canal (mostrador, campo, portal), sin afectar las tarifas de servicios de M04. | BASE §23 ("aplicar listas de precios") | Estándar | O8 | Informado | Una venta toma la lista vigente a su fecha y guarda el precio aplicado. |
| RF-VEN-052 | Reglas de recargo o descuento por producto: aplican si la cuenta tiene la propiedad y valor exigidos, coincide el tipo de titular (activo/no activo) y la forma de pago, no tiene deuda de comprobantes excluidos (o ninguna vencida hace más de N días) y no superó la cantidad límite del producto en el mes; pueden bonificar con otro producto. | RN-08 §15.3 `Get_RecargoDescuento`, `ValidarDescuento`, `ValidarCantidadMaxima` | Estándar | O8 | Informado | Superada la cantidad mensual la regla deja de aplicar y se informa por qué. |
| RF-VEN-053 | Actualización masiva de precios de venta por filtros (rango de código, departamento, rubro, tipo, servicio, proveedor, plan/etapa de vivienda) y modos porcentaje, coeficiente, cotización del dólar (precio × cotización nueva / cotización vigente a la fecha del último precio, solo productos con fecha de precio), monto fijo; recálculo de venta por margen; conserva precio anterior y audita. | RN-08 §15.3 `ActualizarPrecios`, `Get_DatosGrilla_ActualizarPrecios` | Estándar | O8 | Informado | La previsualización muestra precio actual, nuevo y variación antes de confirmar. |
| RF-VEN-054 | Controlar disponibilidad y reservar stock en M13 al confirmar la venta; egresar al entregar o al confirmar según configuración (P77). | BASE §23 ("controlar disponibilidad"); RN-09 77 | Estándar | O8 | A validar (PA-VEN-06) | Sin disponible, la venta queda pendiente o se bloquea según configuración. |
| RF-VEN-055 | Entregas parciales y consulta de "vendido/facturado no entregado"; cada entrega registra cantidades, series, depósito, receptor, fecha y comprobante de entrega. | BASE §23 ("registrar pedidos y entregas"); RN-08 §15.4 `GetStockFacturadoNoEntregado` | Estándar | O8 | Informado | La venta pasa a `delivered` solo cuando no quedan pendientes. |
| RF-VEN-056 | Validar trazabilidad y ubicación: un ítem de producto serializado exige una serie disponible en stock y no asignada a un suministro. | INV `frmComprobanteVenta.ValidarTrazabilidad`, `ValidarUbicacion`; RN-08 §15.4 `clsTrazabilidad` | Estándar | O8 | Informado | Una serie instalada en un servicio no puede venderse. |
| RF-VEN-057 | Mostrar y validar el riesgo crediticio (deuda vencida, importe y límite) antes de financiar o vender a crédito. | INV `frmComprobanteVenta.MostrarRiesgoCrediticio`; `FormasPago.ValidarRiesgoCrediticio`, `_Importes` | Estándar | O8 | A validar (PA-VEN-11) | Superado el límite se exige override con permiso. |
| RF-VEN-058 | Formas de pago de la venta: contado (con descuento contado o 1 cuota, P2247, y descuento por efectivo), cuotas según plan (entrega inicial, cantidad, máximo por cuota, interés P2089, sellado P676, días de vencimiento), crédito fiscal en factura en cuotas (P2930), tipo de comprobante para factura en cuotas con intereses (P733). | INV `FormasPago`, `frmComprobanteVenta.AplicarDescuentoEfectivo`; RN-09 2247, 2089, 676, 2930, 733 | Estándar | O8 | A validar (PA-VEN-02) | El cronograma suma exactamente capital + interés + tributos de la operación. |
| RF-VEN-059 | Solicitar a M05 el comprobante fiscal de la venta: contado inmediato (esperando CAE antes de entregar si P727), venta en cuotas según el modelo fiscal configurado (factura total con concepto "factura en cuotas" P403 o factura por cuota). | RN-09 403, 727; RN-02 §14; DEC-018 | Estándar | O8 | A validar (PA-VEN-02) | Una venta no se entrega como "facturada" mientras su comprobante no tenga CAE, si P727 está activo. Según DEC-018 la espera tiene un tiempo máximo (lo fija M05); vencido, M05 emite con CAEA de contingencia o deja el comprobante pendiente, que no se entrega como fiscal. |
| RF-VEN-060 | Emitir siempre recibo oficial en las operaciones de caja de la venta (P2452). | RN-09 2452 | Estándar | O8 | Informado | El cobro en POS genera recibo de M07. |
| RF-VEN-061 | Registrar la diferencia de cotización en ventas en moneda extranjera como ítem con el producto configurado (P2289). | RN-09 2289 | Estándar | O8 | Informado | La diferencia se informa separada del precio. |
| RF-VEN-062 | Anular ventas individualmente o por rango (tipo, punto de venta, número desde/hasta) con permiso y respetando el cierre de ventas (P67); si el comprobante fiscal tiene CAE, la anulación se hace por NC de M05. | INV `frmAnulacionComprobantesVenta`; RN-02 §10.1; RN-09 67 | Estándar | O8 | Informado | No se anula una venta con fecha ≤ cierre de ventas. |
| RF-VEN-063 | Devoluciones: reingreso a stock (M13), NC (M05) y ajuste de cuotas según su estado de cobro (no facturadas se anulan; facturadas impagas se acreditan; cobradas generan saldo a favor o devolución por M07). | BASE §23 CU-23 excepción; ("gestionar devoluciones") | Estándar | O8 | Informado | El CU-23 con devolución deja cuotas y saldo conciliados. |
| RF-VEN-064 | Venta rápida (mostrador): cuenta por defecto (P1007), vendedor por defecto (P1008) con opción de saltear su validación (P3053), impedir modificar el tipo de cuota (P2678). | RN-09 1007, 1008, 2678, 3053 | Estándar | O8 | Informado | La venta rápida se completa en una sola pantalla. |
| RF-VEN-065 | Imprimir la liquidación de crédito (P312, P2272) y la factura desde la venta (P2273); mostrar u ocultar importes por ítem en el reporte de la venta (P2246). | RN-09 312, 2246, 2272, 2273 | Estándar | O8 | Informado | La liquidación de crédito informa capital, interés, CFT y cronograma. |
| RF-VEN-066 | Registrar los equipos o máquinas vendidos (serie, producto, fecha de compra y de entrega, precio, cliente) vinculando la venta con la ficha del activo serializado de M13; las máquinas en reparación pertenecen a M13 (RMA/servicio técnico). | CAT `MAQUINAS` | Estándar | O8 | Adoptado | Desde la venta se navega a la ficha del equipo y viceversa. |
| RF-VEN-067 | Vincular ventas con órdenes técnicas: los materiales vendidos en una OT generan una venta vinculada a la OT y a su solicitud. | CAT `CMPORDE` | Estándar | O8 | Informado | La OT muestra sus ventas y la venta su OT. |
| RF-VEN-068 | La venta de productos no exige pertenecer a un grupo de facturación (P2519): se emite en documento propio, salvo la excepción de RF-VEN-007. | RN-09 2519; MER-010 | Estándar | O8 | Informado | Ninguna venta de producto se agrega sola a la factura del servicio. |
| RF-VEN-069 | Concepto de descuento en ventas y facturas (P2564) configurable. | RN-09 2564 | Estándar | O8 | Informado | El descuento global se informa como ítem con su concepto. |
| RF-VEN-070 | Ventas de servicios adicionales (artículos y servicios adicionales) administrados como productos del catálogo de M02 marcados vendibles por canal (equivale a `PROD_SERV` 1, 2, 3, 5 u otro). | BASE §23; RN-08 §15.4 `PROD_SERV` | Estándar | O8 | Adoptado | Un producto "solo compras y stock" no aparece en ventas. |

### 5.4 Financiación comercial y cuotas

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-VEN-080 | Configurar planes de financiación comercial: cantidad de cuotas, anticipo mínimo, tasa y método (sin interés, francés, directo), sellado, máximo por cuota, periodicidad, tipo de cuota y vigencia. | BASE §23 ("configurar condiciones de financiación"); §72 PRO-004 | Estándar | O4 | Adoptado | El plan "3 cuotas sin interés" del CU-23 se configura sin código. |
| RF-VEN-081 | Generar el cronograma de cuotas con capital, interés, IVA (general y sobretasa), percepciones por cuota (IIBB solo si la base supera el mínimo), vencimientos y número de cuota. | BASE §23; RN-02 §11.1 (`GetPercepcionCuota`) | Núcleo | O4 | Informado | La suma de cuotas = total financiado sin diferencias de redondeo. |
| RF-VEN-082 | Mostrar simulación del plan con anticipo, cuotas, tasa nominal, TEA y costo financiero total (CFT) antes de confirmar. | DFA M12 mejoras ("simulador de plan: anticipo, cuotas, tasa y CFT") | Estándar | O4 | Adoptado | La simulación coincide con el cronograma generado. |
| RF-VEN-083 | Estados de cuota: programada, facturada, cobrada parcial, cobrada, cancelada anticipadamente, anulada; el estado de cobro proviene de la imputación de M07. | BASE §23 ("identificar cuotas pendientes, cobradas o canceladas") | Núcleo | O4 | Informado | Una cuota cobrada en caja aparece como cobrada al confirmar la imputación. |
| RF-VEN-084 | Facturar cuotas: por defecto en documento propio por corrida (job M05) presentado en el resumen; inclusión en la factura del servicio solo si el concepto es vinculado (RF-VEN-007). | MER-010; RN-02 §2.5; RN-09 2443 | Núcleo | O4 | Informado | Una cuota de venta de router nunca viaja dentro de la factura de Internet salvo que su concepto esté vinculado y validado. |
| RF-VEN-085 | Cuando la inclusión está permitida, agrupar las cuotas: las asociadas a un servicio van con ese servicio y su grupo de facturación; las de un tipo de cuota con grupo indicado, al grupo indicado; el resto, al grupo por defecto. | RN-02 §2.5 `FacturarCuotas` | Estándar | O4 | Informado | La factura de un grupo contiene solo cuotas de servicios del grupo. |
| RF-VEN-086 | Seleccionar cuotas a facturar por rango de vencimiento (hasta una fecha, sin tomar las anteriores a "desde − N meses", N = 10 configurable) o lista explícita; incluir intereses diferidos si se pide. | RN-02 §2.3 `GetDeudaFacturar` | Estándar | O4 | Informado | Una cuota ya facturada (con factura) no se vuelve a tomar. |
| RF-VEN-087 | Cancelación anticipada total o parcial con quita del interés no devengado según la condición del plan, generando el ajuste o NC correspondiente. | BASE §23 ("gestionar cancelación anticipada") | Estándar | O8 | Informado | La cancelación de 2 cuotas restantes descuenta sus intereses futuros. |
| RF-VEN-088 | Modificación masiva de cuotas pendientes (sin factura, no anuladas): importe de un producto por porcentaje repartido proporcional a capital, costo del producto (diferencia contra el último precio usado), desplazar vencimientos N meses, cambio de alícuota de IVA general y/o sobretasa (con o sin el IVA del interés), tipo de cuota (también sobre facturas de financiación emitidas), filtro por prepagas; registra nota en la cuenta y movimiento de ajuste de capital. | RN-02 §10.2; INV `frmModificaDatosCuotas`, `frmModificarTipoCuotas`, `frmEdicionCuotas`, `frmAjusteCuotasMoneda` | Estándar | O8 | Informado | La sobretasa usa su propia tasa (corrige el defecto de ProCoop). |
| RF-VEN-089 | Anticipos de productos: concepto de anticipo (P29), tipo de cuota para anticipo de productos (P2409), opción de descontarlos de facturación futura (P3008) y de usarlos en la facturación masiva (P3038). | RN-09 29, 2409, 3008, 3038 | Estándar | O8 | Informado | Un anticipo de producto aplicado en la masiva no se aplica dos veces. |
| RF-VEN-090 | Informar a M06 los ítems financiados para separarlos en el libro IVA ventas (P2972) y el detalle de ventas con concepto "factura en cuotas" (P403) como exento o excluido. | RN-09 2972, 403 | Estándar | O8 | Informado | El libro IVA de M06 muestra los financiados separados si P2972. |
| RF-VEN-091 | Distinguir siempre la financiación de una venta nueva de la regularización de deuda anterior (M08): distinto tipo de operación, numeración, reportes y reglas, aunque compartan el componente de cronograma. | BASE §23 Criterio; AGR-014 | Núcleo | O4 | Informado | Un convenio de M08 no puede incluir como "venta" una deuda anterior ni viceversa. |
| RF-VEN-092 | Relacionar cada cuota y cada factura con su operación original (cargo, venta o presupuesto). | BASE §23 ("relacionar cada obligación con su operación original") | Núcleo | O4 | Informado | Desde la cuota se navega a la venta y desde la venta a todas sus cuotas y facturas. |
| RF-VEN-093 | Recibir de M05 las importaciones de terceros con destino "venta con cuotas" (formatos EMA, SAM, EME, CT1, FAR, IAL, CEL) y crear las ventas y cuotas con numeración sin huecos. | RN-02 §11.2 `Guardar_Comprobantes` | Estándar | O8 | Informado | Una importación no deja números sin usar (corrige el defecto de ProCoop). |
| RF-VEN-094 | Consultar el detalle de cuotas de una cuenta y agregar deuda en cuotas desde la cobranza (equivalente a `frmDetallecuotas`, `frmAgregarDeudaCuotas`), sin reconstruir cuotas por fuera de las reglas. | INV ProMod_Cobranzas | Estándar | O8 | Adoptado | La reconstrucción de cuotas (`frmReconstruccion_Cuotas`) se reemplaza por la auditoría del cronograma. |

### 5.5 Vendedores, POS y rendiciones

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-VEN-100 | ABM de vendedores como **rol de una persona de M01** (DEC-097): `personId` obligatorio; el alta busca o crea la persona con el alta asistida de M01 y su control de duplicados (RF-PER-174), de modo que un socio o empleado que además vende tiene una sola persona con varios roles. Nombre o razón social, documento, domicilio, teléfonos y correo se leen de la persona y se editan en M01; la ficha de vendedor guarda solo lo propio del rol: código, vínculo opcional con usuario (T02) o empleado (M16), sucursales y activo/inactivo. *Reemplazado (10-11-2026): "ABM de vendedores: nombre o razón social, domicilio (calle, número, departamento, piso, barrio, provincia, localidad, código postal), teléfono, fax, celular, email, vínculo opcional con usuario o empleado (M16), sucursal, activo/inactivo."* | CAT `VENDEDOR`; INV `abm_Vendedor`; DFA M13; DEC-097 | Estándar | O8 | Informado | Un vendedor inactivo no se asigna a operaciones nuevas. Dar de alta como vendedor a una persona que ya es titular reutiliza su `personId` y no duplica nombre ni documento; no se puede guardar un vendedor sin `personId`. |
| RF-VEN-101 | Vendedor por defecto por canal: venta rápida (P1008), anticipos y notificaciones de M07/M08 que ProCoop atribuye a un vendedor, redondeo de cobranza en efectivo (P3069); el vendedor es opcional salvo configuración. | RN-09 1008, 3069, 3053 | Estándar | O8 | A validar (PA-VEN-10) | Sin vendedor y con la validación activa, la venta no se confirma. |
| RF-VEN-102 | Informe de ventas y presupuestos por vendedor (cantidad, importe, conversión, devoluciones). | DFA M13 | Estándar | O8 | Adoptado | El informe concilia con el total de ventas del período. |
| RF-VEN-103 | Comisiones de vendedores. | — (no en fuentes; práctica de mercado) | Extensión | O11 | A validar (PA-VEN-03) | Solo si se aprueba PA-VEN-03. |
| RF-VEN-104 | POS de mostrador por sucursal: terminal configurada (punto de venta fiscal de M05, depósito, lista de precios, caja de M07), apertura y cierre de sesión con arqueo, venta rápida con lector de código de barras, cobro con varios medios, emisión inmediata de factura electrónica y ticket. | DFA M13 "POS"; BASE §2 (complemento POS); MER1 (POS fiscal) | Estándar | O8 | A validar (PA-VEN-04) | Un cierre de sesión cuadra ventas, cobros por medio y comprobantes emitidos. |
| RF-VEN-105 | Impresión de tickets y uso de lector/impresora de mostrador mediante el agente local de hardware. | FIC 19 | Extensión | O10 | Adoptado | Sin agente, el ticket se imprime desde el navegador. |
| RF-VEN-106 | La numeración por punto de venta y comprobante (`COMPPOS`) es de M05; los descuentos por servicio y categoría (`DESCPOS`) son de M04; las posiciones de regleta telefónica (`TEL_POS_REG_*`) son de M10. | CAT; DFA M13 | Estándar | — | Reemplazado por M05/M04/M10 | Ver CTR-VEN-02. |
| RF-VEN-107 | Rendición de viajes de una venta: km reales, flete real, tipo de flete (sin asignar, propio, tercero — valores distintos), peajes, viáticos e ítems de combustible (puesto, comprobante, litros, precio por litro, cargado en viaje); cálculo de km; informe de rendición con precio por km = flete / km; datos de la empresa como transporte propio (P518–P522). | CAT `COMP_VEN_RENDICION`, `_ITEMS`; INV `abm_ComprobanteRendicion`, `frm_ComprobanteRendicion_Detalle`; RN-02 §16 (defectos de rendición de fletes); RN-09 518–522 | Extensión | O8 | A validar (PA-VEN-07) | El informe de rendición no confunde transporte propio con sin asignar. |
| RF-VEN-108 | Rendición de comprobantes de venta según cobranzas (P76) **[VERIFICAR]** su significado con una cooperativa que la tenga activa. | RN-09 76 | Extensión | O8 | A validar | Sin confirmación, no se implementa. |

### 5.6 Flujo continuo, transversales y reportes

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-VEN-110 | Flujo continuo **presupuesto → aceptación online → OT → consumo de materiales → venta/factura** en un único expediente (T11) con línea de tiempo, sin recarga manual de datos entre etapas. | DFA M13 mejora | Estándar | O8 | Informado | Al cerrar la OT, los materiales consumidos se comparan con lo presupuestado y la factura se genera con lo aceptado más las diferencias aprobadas. |
| RF-VEN-111 | Diferencias entre lo presupuestado y lo ejecutado en la OT (más o menos materiales/horas): se facturan según la condición aceptada (precio cerrado o a liquidar) y las diferencias por encima de la tolerancia requieren aprobación del cliente o del supervisor. | DFA M13 mejora; AGR-003 | Estándar | O8 | Adoptado | Con precio cerrado, un consumo mayor no aumenta la factura. |
| RF-VEN-112 | Tablero kanban de presupuestos y ventas por estado, con filtros por vendedor, sucursal y servicio. | CNX; DFA M14 mejoras (tablero) | Estándar | O8 | Adoptado | Arrastrar una tarjeta ejecuta solo transiciones permitidas. |
| RF-VEN-113 | Notificar al socio cada cambio de estado relevante (presupuesto enviado, por vencer, aceptado, OT programada, factura emitida, cuota por vencer) vía T09. | BASE §47; T09 | Estándar | O8 | Adoptado | El socio recibe la notificación en el canal preferido. |
| RF-VEN-114 | Respetar el cierre de período de ventas (P67) y de facturación mediante la entidad unificada de períodos de T04/M15. | RN-08 §1.1; RN-02 §10.1 | Núcleo | O4 | Adoptado | Una operación con fecha en período cerrado se rechaza con mensaje claro. |
| RF-VEN-115 | Reportes de ventas de productos (por producto, rubro, servicio, sucursal, vendedor, forma de pago), detalle de ventas, cuotas facturadas y pendientes, comprobantes no facturados, cargos por operación pendientes y facturados, conversión de presupuestos, entregas pendientes, devoluciones (sección 15). | RN-02 §16 (`Get_VentasProductos`, `Get_Cuotas_Facturadas_Pendientes`, `Get_ComprobantesNoFacturados`); AGR-022 | Estándar | O8 | Adoptado | Cada reporte declara fórmula, universo y fecha de corte. |
| RF-VEN-116 | Todas las etiquetas por diccionario del tenant; documentos con plantillas del tenant; auditoría de cada cambio; aislamiento por tenant en consultas, exportaciones y APIs. | BASE §54, §65; DEC-002 | Núcleo | O4 | Informado | Un usuario de TEN-002 no ve presupuestos de TEN-001 ni por API. |
| RF-VEN-117 | Copiar entre tenants la configuración de M11 (condiciones de venta, planes, reglas, plantillas) sin copiar operaciones. | BASE §81 | Extensión | O8 | Adoptado | La copia no incluye presupuestos, ventas ni cuotas. |

## 6. Reglas de negocio

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-VEN-001 | Un hito genera un único cargo; clave de idempotencia `tenantId + sourceType + sourceId + conceptId`. | Cargos pendientes `PRCAGAS` por período; riesgo de duplicado al reprocesar (RN-02 §2.3). | Mejorar | — | — |
| RN-VEN-002 | El cargo se valoriza con la versión de concepto/tarifa vigente a la fecha efectiva del hito y se congela. | Toma el precio al facturar. | Mejorar | — | — |
| RN-VEN-003 | Cargo financiado ⇒ la alternativa contado queda anulada; nunca coexisten. | No documentado. | Mejorar (BASE §72) | — | — |
| RN-VEN-004 | Inclusión en factura del servicio solo si `concept.linkedToServiceCode = contrato.serviceCode` y `concept.fiscalValidatedAt` no nulo; en otro caso, documento propio. | Cuotas de ventas se facturan con la masiva junto a los servicios; P308 "cuota en factura mensual". | Reemplazar (MER-010) | `ven.includeLinkedInServiceInvoice` | — |
| RN-VEN-005 | La venta financiada y la refinanciación de deuda son operaciones distintas; un cronograma de M11 nunca contiene deuda previa. | `DEUDAVTA` mezcla cuotas de ventas y financiaciones. | Reemplazar | — | — |
| RN-VEN-006 | El costo de adquisición de un equipo no genera cargo al socio; solo un concepto habilitado (venta, cargo de comodato, garantía) lo hace. | — | Replicar (BASE §78) | — | — |
| RN-VEN-007 | No puede existir otro presupuesto vigente, no anulado y sin facturar de la misma cuenta con alguno de los mismos productos. | `ValidarPresupuPorPer` (`clsPresupuesto.cs:308-324`). | Replicar | `ven.quote.uniquePerProductAccount` | — |
| RN-VEN-008 | Transiciones del presupuesto: Enviar desde borrador (si ya enviado/aceptado solo reenvía); Aceptar desde borrador o enviado; Volver a borrador desde aceptado sin OT ni facturas; Rechazar desde borrador o enviado; Marcar para facturar desde cualquier estado salvo anulado, facturado, rechazado o ya para facturar; Anular desde cualquiera salvo anulado o facturado (con confirmación si aceptado, enviado o para facturar). | `clsPresupuesto.cs:839-872, 1042-1301`; defecto `AprobarPresupuesto(codCve)` sin validar estado. | Replicar + corregir defecto | — | — |
| RN-VEN-009 | Vencido = enviado con `validUntil` < hoy (zona del tenant); estado derivado materializado por job. | Vencido calculado en el informe. | Mejorar | `ven.quote.validityDays` (P2788) | — |
| RN-VEN-010 | Modificar un presupuesto enviado crea una nueva versión en borrador; la aceptación se refiere a una versión inmutable. | Vuelve a "Generado" y sobrescribe. | Mejorar | — | — |
| RN-VEN-011 | El cambio de cuenta/persona del presupuesto solo antes de aceptar y si está habilitado. | P3010. | Replicar | P3010 | — |
| RN-VEN-012 | Aceptar sin obra/OT asignada pide confirmación si está habilitado. | P2914 (`clsPresupuesto.cs:1131`). | Replicar | P2914 | — |
| RN-VEN-013 | Validaciones de cuenta al presupuestar: servicios en condición conectado; servicio no en estado de desconexión; propiedad con valor "SI" cuando se exige. | `ValidarServiciosCuenta`, `ValidarConexionServicios`, `ValidarPropiedad`. | Replicar (configurables) | P2395, P3009, P2901 | — |
| RN-VEN-014 | Validación de deuda y vencimiento: se considera la deuda vencida al vencimiento configurado (1.º a 4.º). | P2381, P2600. | Replicar (advertencia u override) | P2381, P2600 | — |
| RN-VEN-015 | Precio de conjunto con estructura = costo de componentes + costo fijo; venta = costo × (1 + margen). Costo fijo = cantidad del componente de mano de obra (o peso si no hay) × coeficiente de mano de obra de la clasificación. | `ActualizarPrecios` (`:1667-1691`), `Get_CostoFijo` (`clsProdSer.cs:994-1016`). | Replicar | P2903, P3015 | — |
| RN-VEN-016 | Prorrateo: flete + molde + ítems "prorratear" se reparten entre los demás ítems por peso; el residuo de redondeo va al último ítem. | `CalcularProrrateo` (`:1583-1600`). | Replicar + mejorar redondeo (AGR-011) | P2953, P3032 | — |
| RN-VEN-017 | Presupuesto a campo: todos sus productos deben estar habilitados para campo; usa el punto de venta fijo de campo si está configurado. | `ValidarItemsPresupu` (módulo PMovil 0 o 2), P2383. | Replicar | P2380, P2383 | — |
| RN-VEN-018 | Presupuesto aceptado crea el caso CRM con tipo, subtipo, prioridad y estado configurables y asunto = referencia o número. | Ticket con gravedad 50 y estado 5 fijos (`GenerarTicket`). | Mejorar | `ven.quote.crmCaseType` | — |
| RN-VEN-019 | Un presupuesto con anticipo no se anula sin devolver o reasignar el anticipo. | `tieneAnticipo`. | Mejorar | — | — |
| RN-VEN-020 | Stock: la venta confirmada reserva; el egreso ocurre en la entrega (o al confirmar si así se configura). | P77 "Mover stock al registrar venta". | Replicar parametrizable | P77 → `ven.stockIssueOn` | — |
| RN-VEN-021 | Una serie vendida debe estar en stock disponible y no asignada a un suministro. | `ValidarTrazabilidad`; `clsTrazabilidad.Validar_Ingreso`. | Replicar | — | — |
| RN-VEN-022 | Riesgo crediticio: si la deuda vencida o el riesgo supera el límite, se advierte o bloquea según configuración; override con permiso. | `MostrarRiesgoCrediticio`, `ValidarRiesgoCrediticio_Importes`. | Replicar | `ven.creditRisk.*` | Valores de límite en LAG |
| RN-VEN-023 | Descuento contado o 1 cuota con su concepto; el IVA del ítem con descuento se calcula sobre el neto **con** descuento. | P2247; defecto `GetItCompV` calcula IVA sobre neto sin descuento. | Replicar + corregir | P2247 | — |
| RN-VEN-024 | Interés de financiación con su concepto; IVA del interés según el concepto. | P2089; P606. | Replicar | P2089 | — |
| RN-VEN-025 | Percepción IIBB por cuota solo si la base supera el mínimo del régimen (cálculo en M06). | `GetPercepcionCuota` (`clsComprobanteFactura.cs:69-94`). | Replicar | — | — |
| RN-VEN-026 | Modelo fiscal de la venta en cuotas configurable por concepto: factura total al vender (con crédito por "factura en cuotas" y crédito fiscal según P2930) o factura por cuota. | P403, P2930, P733, P308. | A validar (PA-VEN-02) | P403, P2930, P733 | Validación del contador |
| RN-VEN-027 | Una cuota facturada queda `billed` con referencia a la factura y no se vuelve a seleccionar; la anulación de la factura la devuelve a `scheduled`. | `ESTADO = 'F'` con `ID_FAC`. | Replicar | — | — |
| RN-VEN-028 | Agrupación de cuotas en la factura (solo cuando la inclusión es válida): por servicio → grupo del servicio; por tipo de cuota con grupo → ese grupo; resto → grupo por defecto. | `FacturarCuotas` (`clsFacturacionMasiva.cs:1054-1127`). | Replicar | — | — |
| RN-VEN-029 | Las cuotas no requieren ítems de servicio para facturarse: van en documento propio. | P2443 "No facturar cuotas sin servicios". | Reemplazar (MER-010) | P2443 (solo para inclusión) | — |
| RN-VEN-030 | Selección de cuotas: `dueDate ≤ hasta` y `dueDate ≥ desde − N meses` (N = 10 por defecto); intereses diferidos si se pide. | `GetDeudaFacturar`. | Replicar parametrizable | `ven.installments.lookbackMonths` | — |
| RN-VEN-031 | La modificación masiva solo alcanza cuotas sin factura y no anuladas (salvo cambio de tipo, que alcanza facturas de financiación emitidas); deja nota y movimiento de ajuste de capital en una transacción; la sobretasa usa su propia tasa. | `clsModificacionCuotas`; defecto: sobretasa usa la tasa general nueva. | Replicar + corregir | — | — |
| RN-VEN-032 | Cancelación anticipada: interés no devengado = Σ interés de cuotas canceladas no vencidas, salvo plan "sin quita". | No documentado. | Mejorar | `ven.earlyPayoff.policy` | — |
| RN-VEN-033 | Devolución: cuotas `scheduled` → `voided`; `billed` impagas → NC; pagadas → saldo a favor o devolución por M07; el stock reingresa solo con la recepción física en M13. | CU-23 excepción. | Replicar (BASE §23) | — | — |
| RN-VEN-034 | No se anula ni modifica una venta con fecha ≤ cierre de ventas; con CAE solo por NC. | P67; RN-02 §10.1. | Replicar | P67 | — |
| RN-VEN-035 | Sin vendedor y con la validación de vendedor activa, la venta rápida no se confirma. | P1008/P3053. | Replicar parametrizable | P1008, P3053 | — |
| RN-VEN-036 | En venta rápida el tipo de cuota no se modifica si está bloqueado. | P2678. | Replicar | P2678 | — |
| RN-VEN-037 | La diferencia de cotización se registra con su producto. | P2289. | Replicar | P2289 | — |
| RN-VEN-038 | En operaciones de caja se emite siempre recibo oficial si está configurado. | P2452. | Replicar | P2452 | — |
| RN-VEN-039 | Con P727, la venta espera el CAE antes de considerarse emitida y entregable, hasta el tiempo máximo de M05; vencido, rige la contingencia CAEA o el comprobante pendiente no entregable como fiscal (DEC-018). | P727 (`clsComprobanteVenta.Guardar`). | Replicar (ajustado por DEC-018) | P727 | — |
| RN-VEN-040 | Recargo/descuento por producto: aplica si cumple propiedad y valor de la cuenta, tipo de titular, forma de pago, ausencia de deuda excluida o vencida > N días y cantidad mensual no superada; puede bonificar con otro producto. | `Get_RecargoDescuento` (`clsProdSer.cs:793-861`). | Replicar | — | Reglas cargadas en LAG |
| RN-VEN-041 | Actualización por dólar: solo productos con fecha de precio; si hay margen, recalcular venta = costo × (1 + margen); guardar costo anterior; no cambiar la fecha de precio en actualización por dólar. | `ActualizarPrecios` (`clsProdSer.cs:429-454, 863-952`). | Replicar | — | — |
| RN-VEN-042 | Rendición: tipos de transporte con valores distintos; precio por km = flete real / km reales. | Defectos: `SinAsignar` y `Propio` valen 0; "precio por km" = precio / viajes. | Corregir | — | — |
| RN-VEN-043 | Ventas con concepto "factura en cuotas" se informan como exento o excluidas en el detalle de ventas. | P403 (`clsInformes_Facturacion.cs:3034, 3060`). | Replicar | P403 | — |
| RN-VEN-044 | Ítems financiados separados en el libro IVA ventas si está configurado. | P2972. | Replicar (en M06) | P2972 | — |
| RN-VEN-045 | Los documentos económicos de M11 nunca se borran: se anulan o revierten con vínculo al original. | Eliminación física en varias rutas. | Reemplazar | — | — |
| RN-VEN-046 | Importes en `Decimal128`, precios unitarios hasta 6 decimales, importes a 2, regla de redondeo por concepto. | `float` en informes (RN-02 §16). | Reemplazar (AGR-011) | — | — |
| RN-VEN-047 | Aceptación online válida solo si: versión vigente y no vencida, identidad verificada (usuario autenticado con relación sobre la cuenta, o OTP enviado al contacto registrado del destinatario) y evidencia completa. | — | Mejorar | `ven.acceptance.*` | — |
| RN-VEN-048 | Importaciones con destino venta usan numeración secuencial sin huecos. | Defecto: deja un número sin usar por importación. | Corregir | — | — |
| RN-VEN-049 | Reconexión: débito si el servicio reconectado no fue facturado en el período (P2661); crédito por días desconectados (P2483) con concepto P2485; cierre de OT sin comprobante permitido (P2907). | `clsTecnica.Generar_DescuentoReconexion` (`:1605-1675`). | Replicar | P2483, P2485, P2661, P2907 | — |
| RN-VEN-050 | Presupuesto de factibilidad: método de facturación "factura manual" o "venta de materiales". | P2348. | Replicar | P2348 | — |
| RN-VEN-051 | Las acciones masivas (anulación por rango, cambio de estado, modificación de cuotas, actualización de precios) validan permiso y registran usuario y fecha. | Acciones masivas sin control en otros módulos. | Mejorar | — | — |
| RN-VEN-052 | Mostrar el CFT y la TEA en toda oferta financiada al consumidor final. | No. | Mejorar (práctica de defensa del consumidor) | — | Normativa vigente |

## 7. Modelo de datos
> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueidentifier`, `DECIMAL`, `DATETIME2`, etc.; ver `07-ddl`). Menciones puntuales de Mongo/Mongoose/BullMQ sin tipo de columna = **comparativa histórica** Connectia, sin efecto en build.


Campos comunes a todas las colecciones (no se repiten): `TenantId` (uniqueidentifier, obligatorio), `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `version` (control optimista), `deletedAt` (solo catálogos; los documentos económicos nunca se borran). Importes `DECIMAL(18,4)` con `currency` (`ARS` por defecto). Todos los índices empiezan por `TenantId`.

### 7.1 `operationCharges` — cargos por operación con titulares

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `number` | String | Sí | Número interno `CHG-AAAA-NNNNNN` |
| `accountId`, `holderId`, `contractId` | uniqueidentifier | Sí (contrato salvo concepto `allowWithoutContract`) | Cuenta y titular (M01) y contrato (`serviceContracts` de M02; antes `serviceContractId`, CTR-DAT-30) |
| `serviceId` | uniqueidentifier | Sí | Servicio (`tenantServices` de M02; T05 §7.2). Antes `serviceCode` (String), que T05 reserva para el código público de la API externa (CTR-DAT-32) |
| `conceptId`, `conceptVersionId` | uniqueidentifier | Sí | Concepto facturable y versión: → M02 `billableConcepts` (la versión es la vigente del concepto; antes "(M02/M04)"; PA-VEN-12) |
| `chargeType` | Enum | Sí | `connection`, `installation`, `reconnection`, `holderChange`, `relocation`, `extraVisit`, `reconnectionCredit`, `other` |
| `trigger` | Enum | Sí | `requestApproved`, `workOrderCompleted`, `installationConfirmed`, `periodStart`, `manual` |
| `sourceType`, `sourceId` | String, uniqueidentifier | Sí | Origen (`crm.request`, `tec.workOrder`, `mor.reconnection`, `manual`). `sourceType` no es referencia: discriminador de `sourceId`, polimórfica (→ M09 `crmCases` · M10 `workOrders` · M08 `interruptionCases`; PA-VEN-12) |
| `idempotencyKey` | String | Sí | `sourceType:sourceId:conceptId` |
| `effectiveDate` | Date | Sí | Fecha del hito (zona del tenant) |
| `quantity`, `unitPrice`, `amount` | DECIMAL(18,4) | Sí | Instantánea de valorización |
| `tariffSnapshot` | Object | Sí | `{ tariffVersionId, rounding, taxTreatment, priceDate }` |
| `discountAmount`, `discountReason`, `discountApprovalId` | DECIMAL(18,4), String, uniqueidentifier | No | Bonificación aprobada. `discountAmount` y `discountReason` no son referencias; `discountApprovalId` → T11 `approvalRequests` (PA-VEN-12) |
| `billingMode` | Enum | Sí | `nextServiceInvoice`, `ownInvoice`, `financed` |
| `includeInServiceInvoice` | Boolean | Sí | Resultado de RN-VEN-004 |
| `financingPlanId`, `installmentIds[]` | uniqueidentifier | Si `financed` | Plan y cuotas |
| `invoiceRefs[]` | `{ invoiceId, itemId, amount }` | No | Facturas que lo incluyen (M05) |
| `status` | Enum | Sí | Ver §8.1 |
| `cancelReason`, `cancelledAt` | String, Date | No | Anulación |
| `recordedAt` | Date | Sí | Fecha de registro (AGR-010) |

Índices: `{tenantId, idempotencyKey}` único; `{tenantId, accountId, status}`; `{tenantId, contractId, effectiveDate}`; `{tenantId, status, billingMode}`. Origen ProCoop: `PRCAGAS` (cargos adicionales pendientes) y comprobantes de técnica de reconexión. **Corregido (CTR-DAT-38):** las filas pendientes de `PRCAGAS` migran como `billableItems` pendientes de M05; `operationCharges` no tiene origen migrado.

### 7.2 `salesConditions` — condiciones de venta

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `code` | String | Sí | Código único por tenant |
| `name` | String | Sí | Etiqueta (`dict:` opcional) |
| `text` | String | Sí | Texto que se imprime |
| `kind` | Enum | No | `payment`, `delivery`, `warranty`, `validity`, `other` |
| `active` | Boolean | Sí | |

Índice `{tenantId, code}` único. Origen: `PRESUPU_CONDICION` (`COD_COND`, `CONDICION`).

### 7.3 `salesQuotes` — presupuestos

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `number` | String | Sí | `pointOfSale-NNNNNNNN` por tenant y punto de venta |
| `pointOfSaleId` | uniqueidentifier | Sí | Punto de venta (M05) |
| `customer` | Object | Sí | `{ accountId?, personId?, prospect?: { name, email, phone, taxId? } }` |
| `contractId`, `serviceCode`, `premiseAddressId` | uniqueidentifier/String | No | Servicio y domicilio de prestación: `contractId` → M02 `serviceContracts`; `premiseAddressId` → M01 `addresses` (PA-VEN-12) |
| `salesRepId` | uniqueidentifier | Según config | Vendedor |
| `conditionIds[]` | uniqueidentifier | No | Condiciones de venta |
| `currency`, `exchangeRate` | String, DECIMAL(18,4) | Sí | Moneda y cotización |
| `pricesIncludeVat` | Boolean | Sí | P2915 |
| `reference` | String | No | Referencia/asunto |
| `workOrderId`, `projectId`, `crmCaseId`, `feasibilityId` | uniqueidentifier | No | Vínculos (M10/M09) |
| `channel` | Enum | Sí | `office`, `field`, `portal` |
| `fieldBulk`, `fieldBulkCoefficient` | Boolean, DECIMAL(18,4) | No | Granel (PMOVIL 25/26) |
| `currentVersion` | Number | Sí | Versión vigente |
| `versions[]` | Array | Sí | Ver subdocumento |
| `notes[]` | Array | No | `{ title, text, at, by }` (`PRESUPU_NOTAS`) |
| `advancePayments[]` | Array | No | `{ paymentId, amount, appliedAmount }` (M07) |
| `generatedDocuments[]` | Array | No | `{ salesOrderId?, invoiceId?, at }` (`PRESUPU_COMPROBANTES`) |
| `stockReservationIds[]` | uniqueidentifier | No | Reservas en M13 |
| `status` | Enum | Sí | Ver §8.2 |
| `sentAt`, `acceptedAt`, `rejectedAt`, `rejectReason`, `cancelledAt`, `cancelReason`, `toInvoiceAt` | Date/String | No | Fechas de transición |
| `validUntil` | Date | Sí | Validez (P2788) |

Subdocumento `versions[]`: `{ version, createdAt, createdBy, items[], groups[], freight, mold, totals: { net, vat[], perceptions[], total }, pdfFileId, pdfHash, sentChannels[] }`.

Ítem: `{ itemId, lineType: product|concept|service|text, productId?, conceptId?, description, quantity, unit, unitCost, unitPrice, marginPct, discountPct, vatRate, surchargeVatRate, weight, prorate: Boolean, proratedAmount, groupId?, pendingQty, reservedSerials[], requirementRef?, note, status: open|invoiced|cancelled }`.

Conjunto (`groups[]`): `{ groupId, name, quantity, order }` (`PRESUIT_CONJUNTOS`: `ITEM`, `DES_ITEM`, `CAN_ITEM`).

Índices: `{tenantId, number}` único; `{tenantId, "customer.accountId", status}`; `{tenantId, status, validUntil}`; `{tenantId, salesRepId, createdAt}`; `{tenantId, "versions.items.productId", status}` (para RN-VEN-007). Origen: `PRESUPU` (cabecera, `COD_CVE`, 51 columnas: `COD_COM`, `SUC_COM`, `NUM_COM`, `DEB_CRE`, `FECHA`, `COD_SOC`, `COD_SUM`, `COD_VEN`, `PAGO`, `LOTE`, `SUBNETO`, `DTO`, `ESTADO`, `FEC_VAL` y otras), `PRESUIT` (renglones), `PRESUIT_CONJUNTOS`, `PRESUPU_NOTAS`, `PRESUPU_COMPROBANTES`.

### 7.4 `salesQuoteAcceptances` — evidencia de aceptación o rechazo

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `quoteId`, `quoteVersion` | uniqueidentifier, Number | Sí | Versión exacta: `quoteId` → M11 `salesQuotes`; `quoteVersion` no es referencia (número de `versions[]`; PA-VEN-12) |
| `decision` | Enum | Sí | `accepted`, `rejected` |
| `reason` | String | Si rechazo | Motivo |
| `actor` | Object | Sí | `{ type: user\|verifiedContact\|employee, userId?, contact?, otpVerificationId? }` |
| `channel` | Enum | Sí | `pwa`, `publicLink`, `office`, `field` |
| `pdfHash` | String | Sí | Hash del documento aceptado |
| `ip`, `userAgent`, `at` | String, String, Date | Sí | Evidencia técnica |
| `signatureFileId` | uniqueidentifier | No | Firma en campo |

Índice `{tenantId, quoteId, quoteVersion}`. Sin equivalente ProCoop.

### 7.5 `salesOrders` — ventas de productos y servicios adicionales

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `number` | String | Sí | Número interno por punto de venta |
| `pointOfSaleId`, `branchId` | uniqueidentifier | Sí | `pointOfSaleId` → `pointsOfSale` (M06); `branchId` → `branches` (T04) |
| `legalEntityId` | uniqueidentifier → `legalEntities` (T04) | Sí | Entidad jurídica que vende; la resuelve T04 (RF-CFG-137) y debe coincidir con la del punto de venta (DEC-064) |
| `kind` | Enum | Sí | `standard`, `quick`, `pos`, `field`, `imported`, `fromQuote`, `fromWorkOrder` |
| `accountId`, `holderId`, `personId` | uniqueidentifier | Sí (uno) | Cliente |
| `contractId`, `serviceCode` | uniqueidentifier/String | No | Servicio vinculado |
| `salesRepId` | uniqueidentifier | Según config | |
| `quoteId`, `workOrderId`, `posSessionId`, `importBatchId` | uniqueidentifier | No | Orígenes (`CMPORDE`, `PRESUPU_COMPROBANTES`) |
| `priceListId` | uniqueidentifier | Sí | |
| `currency`, `exchangeRate` | | Sí | |
| `paymentTerms` | Object | Sí | `{ mode: cash\|installments\|account, financingPlanId?, downPayment?, cashDiscountPct?, stampTax? }` |
| `items[]` | Array | Sí | `{ itemId, productId, description, quantity, unitPrice, discountPct, discountAmount, vatRate, surchargeVatRate, net, vat, perceptions[], pendingDeliveryQty, serials[], warehouseId, appliedRuleIds[], note, status }` (`IT_COMPV`: `COD_PRO`, `CAN_ITE`, `PRE_VSI`, `CAN_PEN`, `ID_OBS`, `COD_CVI`, `ESTADO`, `DES_PRO`, `IVA1`…) |
| `transport` | Object | No | `{ carrierName, carrierTaxId, declaredValue, notes[] }` (`OB_COMPV`: `TRANSPO`, `NOM_TRANS`, `DOC_TRANS`, `VAL_DECLA`, `OBS_GRAL1`, `OBS_GRAL2`, `OBS_FAC1`) |
| `totals` | Object | Sí | `{ net, discounts, vat[], perceptions[], interest, total }` |
| `creditRiskCheck` | Object | No | `{ overdueDebt, limit, result, overrideBy? }` |
| `fiscalDocuments[]` | Array | No | `{ invoiceId, type, status }` (M05) |
| `installmentIds[]` | uniqueidentifier | No | |
| `deliveryStatus` | Enum | Sí | `none`, `partial`, `complete` |
| `status` | Enum | Sí | Ver §8.3 |
| `soldEquipment[]` | Array | No | `{ serializedItemId, serial, deliveredAt }` (`MAQUINAS`) |
| `recordedAt`, `operationDate` | Date | Sí | |

Índices: `{tenantId, number}` único; `{tenantId, accountId, operationDate}`; `{tenantId, status}`; `{tenantId, salesRepId, operationDate}`; `{tenantId, workOrderId}`; `{tenantId, "items.serials"}`. Origen: `COMP_VEN` (`ID_COMPV`, `COD_COM`, `SUC_COM`, `NUM_COM`, `DEB_CRE`, `FECHA`, `COD_SOC`, `COD_SUM`, `COD_VEN`, `PAGO`, `LOTE`, `SUBNETO`, `DTO` y 26 más), `IT_COMPV`, `OB_COMPV`, `CMPORDE` (`COD_SOL`, `COD_CVE`, `ID_COMPV`), `MAQUINAS` (parte comercial).

### 7.6 `salesDeliveries` y `salesReturns`

`salesDeliveries`: `{ salesOrderId, number, deliveredAt, warehouseId, items[{ itemId, quantity, serials[] }], receiverName, receiverDocument, signatureFileId?, stockMovementIds[], freightSettlementId?, status: draft|confirmed|voided }`. Índice `{tenantId, salesOrderId}`.

`salesReturns`: `{ salesOrderId, number, returnedAt, reason, items[{ itemId, quantity, serials[], condition: resaleable|defective }], creditNoteRequestId?, installmentActions[{ installmentId, action: void|credit|refund }], stockReceiptIds[], status: draft|approved|completed|cancelled, approvalId? }`. Índice `{tenantId, salesOrderId}`.

### 7.7 `salesFinancingPlans` — planes de financiación comercial

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `code`, `name` | String | Sí | |
| `installmentsCount`, `minDownPaymentPct`, `maxInstallmentAmount` | Number/DECIMAL(18,4) | Sí/No/No | |
| `method` | Enum | Sí | `noInterest`, `french`, `direct` |
| `nominalRate`, `periodicity` | DECIMAL(18,4), Enum | Sí | `monthly`, `bimonthly` |
| `interestConceptId` | uniqueidentifier | Si hay interés | P2089 |
| `stampTaxConceptId`, `stampTaxPct` | | No | Sellado (P676) |
| `installmentType` | String | Sí | Tipo de cuota (`TIPO_FAC`) |
| `fiscalModel` | Enum | Sí | `invoiceTotalUpfront`, `invoicePerInstallment` (PA-VEN-02) |
| `earlyPayoffPolicy` | Enum | Sí | `waiveUnaccruedInterest`, `noWaiver` |
| `appliesTo` | Object | Sí | `{ chargeTypes[], productCategories[], channels[] }` |
| `validFrom`, `validTo` | Date | Sí/No | Vigencia |

### 7.8 `salesInstallments` — cuotas de venta

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `originType`, `originId` | Enum, uniqueidentifier | Sí | `salesOrder`, `operationCharge`, `quote`. `originType` no es referencia: discriminador de `originId`, polimórfica (→ M11 `salesOrders` · `operationCharges` · `salesQuotes`; PA-VEN-12) |
| `accountId`, `contractId`, `serviceCode` | | Sí/No/No | |
| `number`, `of` | Number | Sí | Cuota N de M |
| `kind` | Enum | Sí | `regular` (`TPCUOTA = 0`), `deferredInterest` (`TPCUOTA = 1`) |
| `dueDate` | Date | Sí | |
| `principal`, `interest`, `vat`, `surchargeVat`, `interestVat`, `perceptions[]`, `total` | DECIMAL(18,4) | Sí | |
| `remainingPrincipal` | DECIMAL(18,4) | Sí | (`CAP_RES`) |
| `installmentType`, `billingGroupId` | String, uniqueidentifier | Sí/No | `installmentType` no es referencia: código del tipo de comprobante de la cuota (`TIPO_FAC`, igual a `voucherTypes.code` de M05); `billingGroupId` → M05 `billingGroups` (PA-VEN-12) |
| `includeInServiceInvoice` | Boolean | Sí | |
| `invoiceId`, `billedAt` | uniqueidentifier, Date | No | (`ID_FAC`) |
| `paidAmount`, `paymentStatus` | DECIMAL(18,4), Enum | Sí | Desde M07 |
| `status` | Enum | Sí | Valores: `scheduled`, `billed`, `partiallyPaid`, `paid`, `earlyPaidOff`, `voided`, `credited` (§8.4 y §8.6; PA-VEN-12); antes "Ver §8.4" |
| `adjustments[]` | Array | No | `{ type, before, after, reason, batchId, at, by }` |

Índices: `{tenantId, accountId, status, dueDate}`; `{tenantId, originType, originId, number}` único; `{tenantId, status, dueDate}`. Origen: `DEUDAVTA` (`COD_CVC`, `NRO_CUO`, `DE_CUO`, `FEC_VTO`, `CAP_CUO`, `INT_CUO`, `CAP_RES`, `FAC_AUT`, `FAC_COD` y 23 más) solo las de origen venta; `IVAVTA` (IVA por alícuota de la cuota: `ALI_IVA`, `TIP_IVA`, `IMP_IVA`, `IMP_NET`, `COD_CVC`).

### 7.9 `salesReps` — vendedores

`{ code, personId, userId?, employeeId?, branchIds[], active }` (DEC-097): `personId` → `persons` (M01) obligatorio; nombre, domicilio, teléfonos, fax, celular y correo se leen de la persona (M01) y no se guardan en la ficha. *Reemplazado (10-11-2026): "`{ code, name, address{ street, number, floor, apartment, neighborhood, province, locality, postalCode }, phone, fax, mobile, email, userId?, employeeId?, branchIds[], active }`"*. Índices `{tenantId, code}` único y `{tenantId, personId}` único (una ficha de vendedor por persona). Origen: `VENDEDOR` (`COD_VEN`, `NOM_RAZ`, `COD_CAL`, `DOM_NUM`, `DOM_DPT`, `DOM_PIS`, `COD_BAR`, `COD_PRO`, `COD_LOC`, `DOM_COD`, `DOM_TEL`, `DOM_FAX`, `CELULAR` y 4 más).

### 7.10 `salesPriceLists` y `salesDiscountRules`

`salesPriceLists`: `{ code, name, currency, channels[], validFrom, validTo, items[{ productId, price, priceIncludesVat, marginPct, lastCost, previousPrice, updatedAt, updatedBy, updateBatchId }] }`. Índices `{tenantId, code}` único; `{tenantId, "items.productId"}`.

`salesDiscountRules`: `{ code, productId, type: discount|surcharge|bonusProduct, valuePct?, valueAmount?, bonusProductId?, conditions{ accountProperty{ code, value }?, holderActive?: Boolean, paymentMethods[], excludedDocumentTypes[], maxOverdueDays?, monthlyQuantityLimit? }, validFrom, validTo, active }`.

### 7.11 `posTerminals` y `posSessions`

`posTerminals`: `{ code, name, branchId, pointOfSaleId, warehouseId, priceListId, cashRegisterId (M07), printer{ mode: browser|agent, agentId? }, defaultAccountId (P1007), defaultSalesRepId (P1008), active }`.

`posSessions`: `{ terminalId, openedAt, openedBy, openingFloat, closedAt, closedBy, totalsBySalesType, totalsByPaymentMethod[], invoices[], countedCash, difference, status: open|closed|reconciled, cashSessionId (M07) }`. Índice `{tenantId, terminalId, status}`.

### 7.12 `freightSettlements` — rendiciones

> **Reemplazado por `tripSettlements` de M18 (CTR-DAT-53).** La rendición de viaje es una sola colección, de M18, con `source.kind = salesDocument` y `source.docId = salesOrderId` para las ventas; M11 la crea por comando a M18 y la consulta. El esquema siguiente queda como requisito de los datos que la venta necesita; PA-VEN-07 sigue vigente para el proceso, no para la colección.

`{ salesOrderId, deliveryId?, date, transportType: unassigned|own|thirdParty, carrierId?, kmPlanned, kmActual, freightPlanned, freightActual, tolls, perDiem, fuelItems[{ stationCode, voucherNumber, liters, pricePerLiter, loadedDuringTrip }], pricePerKm, status: draft|confirmed|voided }`. Origen `COMP_VEN_RENDICION` (`ID_RENDICION`, `ID_COMPV`, `FECHA`, `KM_REALES`, `FLETE_REAL`, `TIPO_FLETE`, `PEAJES`, `VIATICOS`), `COMP_VEN_RENDICION_ITEMS` (`NUM_PUESTO`, `NUM_COM`, `LITROS`, `PRELITRO`, `CARGADOENVIAJE`).

### 7.13 Relaciones

```
operationCharges ─▶ serviceContracts (M01) · billingConcepts (M02/M04) · salesInstallments · invoices (M05)
salesQuotes ─▶ accounts/persons (M01) · salesConditions · salesReps · workOrders/projects (M10) · crmCases (M09)
            ─▶ salesQuoteAcceptances · salesOrders · invoices · stockReservations (M13) · payments (M07)
salesOrders ─▶ salesDeliveries · salesReturns · salesInstallments · invoices · serializedItems (M13) · tripSettlements (M18; antes freightSettlements)
salesInstallments ─▶ invoices (M05) · paymentAllocations (M07)
posSessions ─▶ posTerminals · cashSessions (M07)
```

### 7.14 Tablas de campos normalizadas y referencias declaradas

Corrección de consistencia (categorías 2, 3 y 4 de `_trabajo/correccion-inconsistencias-instrucciones.md`). Para cada colección cuyo §7 lista los campos en texto se da la tabla normalizada; para las que ya tienen tabla, solo las referencias cuyo destino estaba implícito o faltaba. Fuentes: la lista del anexo y el catálogo de T05. La lista original sigue vigente como descripción; para nombres de campo y referencias prevalece esta tabla, alineada con T05. `[VERIFICAR]` marca tipo, obligatoriedad o destino no deducibles del anexo ni de T05. Referencia: colección destino (anexo dueño).

#### 7.14.1 `operationCharges` (COL-VEN-01) — referencias declaradas

| Campo | Tipo | Referencia |
|---|---|---|
| `conceptVersionId` | uniqueidentifier | → M02 `billableConcepts` (versión vigente del concepto) (PA-VEN-12; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `sourceType` | enum | No es referencia: discriminador de `sourceId` (PA-VEN-12; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `sourceId` | uniqueidentifier | Polimórfica según `sourceType`: → M09 `crmCases` · M10 `workOrders` · M08 `interruptionCases` (PA-VEN-12; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `discountAmount` | DECIMAL(18,4) | No es referencia: importe (PA-VEN-12; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `discountReason` | string | No es referencia: motivo en texto libre (PA-VEN-12; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `discountApprovalId` | uniqueidentifier | → T11 `approvalRequests` (PA-VEN-12; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `financingPlanId` | uniqueidentifier | `salesFinancingPlans` (M11); antes implícita por el nombre |
| `installmentIds` | uniqueidentifier[] | `salesInstallments` (M11); antes implícita por el nombre |
| `invoiceRefs` | object[] | `invoices` (M05); antes implícita por el nombre |

#### 7.14.2 `salesQuotes` (COL-VEN-03) — referencias declaradas

| Campo | Tipo | Referencia |
|---|---|---|
| `premiseAddressId` | uniqueidentifier | → M01 `addresses` (domicilio de prestación) (PA-VEN-12; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `salesRepId` | uniqueidentifier | `salesReps` (M11); antes implícita por el nombre |
| `conditionIds` | uniqueidentifier[] | `salesConditions` (M11); antes implícita por el nombre |
| `projectId` | uniqueidentifier | → M09 `crmProjects` (T05 §7.2.1) (PA-VEN-12; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `feasibilityId` | uniqueidentifier | `feasibilityRequests` (M10); antes implícita por el nombre |
| `stockReservationIds` | uniqueidentifier[] | `stockReservations` (M13); antes implícita por el nombre |

#### 7.14.3 `salesQuoteAcceptances` (COL-VEN-04) — referencias declaradas

| Campo | Tipo | Referencia |
|---|---|---|
| `quoteId` | uniqueidentifier | `salesQuotes` (M11); antes implícita por el nombre |
| `quoteVersion` | int | No es referencia: número de versión dentro de `salesQuotes.versions[]` (PA-VEN-12; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |

#### 7.14.4 `salesOrders` (COL-VEN-05) — referencias declaradas

| Campo | Tipo | Referencia |
|---|---|---|
| `salesRepId` | uniqueidentifier | `salesReps` (M11); antes implícita por el nombre |
| `quoteId` | uniqueidentifier | `salesQuotes` (M11); antes implícita por el nombre |
| `posSessionId` | uniqueidentifier | `posSessions` (M11); antes implícita por el nombre |
| `importBatchId` | uniqueidentifier | → T07 `migrationBatches` (T05 §7.2.1) (PA-VEN-12; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `priceListId` | uniqueidentifier | `salesPriceLists` (M11); antes implícita por el nombre |
| `installmentIds` | uniqueidentifier[] | `salesInstallments` (M11); antes implícita por el nombre |

#### 7.14.5 `salesDeliveries` (COL-VEN-06)

Lista original: §7.6.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `salesOrderId` | uniqueidentifier | [VERIFICAR] | — | `salesOrders` (M11); antes implícita por el nombre |
| `number` | int / string [VERIFICAR] | [VERIFICAR] | — | — |
| `deliveredAt` | Date | [VERIFICAR] | — | — |
| `warehouseId` | uniqueidentifier | [VERIFICAR] | — | `warehouses` (M13) |
| `items` | array | [VERIFICAR] | [{ itemId, quantity, serials[] }] | — |
| `receiverName` | string | [VERIFICAR] | — | — |
| `receiverDocument` | [VERIFICAR] | [VERIFICAR] | — | — |
| `signatureFileId` | uniqueidentifier | No | — | `storedFiles` (T01) |
| `stockMovementIds` | array | [VERIFICAR] | — | `stockMovements` (M13); antes implícita por el nombre |
| `freightSettlementId` | uniqueidentifier | No | — | → M18 `tripSettlements` (rendición de viaje; CTR-DAT-53) (PA-VEN-12; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `status` | enum | [VERIFICAR] | Valores: `draft`, `confirmed`, `voided`. | — |

#### 7.14.6 `salesReturns` (COL-VEN-07)

Lista original: §7.6.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `salesOrderId` | uniqueidentifier | [VERIFICAR] | — | `salesOrders` (M11); antes implícita por el nombre |
| `number` | int / string [VERIFICAR] | [VERIFICAR] | — | — |
| `returnedAt` | Date | [VERIFICAR] | — | — |
| `reason` | string | [VERIFICAR] | — | — |
| `items` | array | [VERIFICAR] | [{ itemId, quantity, serials[], condition: resaleable\|defective }] | — |
| `creditNoteRequestId` | uniqueidentifier | No | — | → M05 `invoiceAnnulmentRequests` (pedido de nota de crédito) (PA-VEN-12; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `installmentActions` | array | [VERIFICAR] | [{ installmentId, action: void\|credit\|refund }] | — |
| `stockReceiptIds` | array | [VERIFICAR] | — | → M13 `stockDocuments` (reingreso de stock; no son recibos de cobranza) (PA-VEN-12; antes "`receipts` (M07)") |
| `status` | enum | [VERIFICAR] | Valores: `draft`, `approved`, `completed`, `cancelled`. | — |
| `approvalId` | uniqueidentifier | No | }`. Índice `{tenantId, salesOrderId | `approvalRequests` (T11) |

#### 7.14.7 `salesInstallments` (COL-VEN-09) — referencias declaradas

| Campo | Tipo | Referencia |
|---|---|---|
| `originType` | enum | No es referencia: discriminador de `originId` (PA-VEN-12; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `originId` | uniqueidentifier | Polimórfica según `originType`: → M11 `salesOrders` · `operationCharges` · `salesQuotes` (PA-VEN-12; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `installmentType` | string | No es referencia: código `TIPO_FAC` (igual a `voucherTypes.code` de M05) (PA-VEN-12; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `billingGroupId` | uniqueidentifier | `billingGroups` (M05); antes implícita por el nombre |

#### 7.14.8 `salesReps` (COL-VEN-10)

Lista original: §7.9.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | [VERIFICAR] | — | — |
| `personId` | uniqueidentifier | Sí | Persona del vendedor; alta asistida de M01 con control de duplicados (DEC-097). | `persons` (M01) |
| `name` | — | — | **Reemplazado (10-11-2026, DEC-097):** se lee de `persons.displayName` (M01). Fila anterior: "`name` · string · [VERIFICAR]". | — |
| `address` | — | — | **Reemplazado (10-11-2026, DEC-097):** se lee de `persons.addresses` (M01). Fila anterior: "`address` · object · [VERIFICAR] · { street, number, floor, apartment, neighborhood, province, locality, postalCode }". | — |
| `phone` | — | — | **Reemplazado (10-11-2026, DEC-097):** se lee de `persons.contacts` (M01). Fila anterior: "`phone` · [VERIFICAR] · [VERIFICAR]". | — |
| `fax` | — | — | **Reemplazado (10-11-2026, DEC-097):** se lee de `persons.contacts` tipo `fax` (M01). Fila anterior: "`fax` · [VERIFICAR] · [VERIFICAR]". | — |
| `mobile` | — | — | **Reemplazado (10-11-2026, DEC-097):** se lee de `persons.contacts` tipo `mobile` (M01). Fila anterior: "`mobile` · [VERIFICAR] · [VERIFICAR]". | — |
| `email` | — | — | **Reemplazado (10-11-2026, DEC-097):** se lee de `persons.contacts` tipo `email` (M01). Fila anterior: "`email` · [VERIFICAR] · [VERIFICAR]". | — |
| `userId` | uniqueidentifier | No | — | `memberships` (T02) |
| `employeeId` | uniqueidentifier | No | — | `employees` (M16) |
| `branchIds` | array | [VERIFICAR] | — | `branches` (T04) |
| `active` | bool | [VERIFICAR] | }`. Índice `{tenantId, code | — |

#### 7.14.9 `salesPriceLists` (COL-VEN-11)

Lista original: §7.10.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | [VERIFICAR] | — | — |
| `name` | string | [VERIFICAR] | — | — |
| `currency` | [VERIFICAR] | [VERIFICAR] | — | — |
| `channels` | array | [VERIFICAR] | — | — |
| `validFrom` | Date | [VERIFICAR] | — | — |
| `validTo` | Date | [VERIFICAR] | — | — |
| `items` | array | [VERIFICAR] | [{ productId, price, priceIncludesVat, marginPct, lastCost, previousPrice, updatedAt, updatedBy, updateBatchId }] }`. Índices `{tenantId, code}` único; `{tenantId, "it… | — |

#### 7.14.10 `salesDiscountRules` (COL-VEN-12)

Lista original: §7.10.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | [VERIFICAR] | — | — |
| `productId` | uniqueidentifier | [VERIFICAR] | — | → M02 `serviceProducts` (T05 §7.2.1) (PA-VEN-12; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `type` | enum | [VERIFICAR] | Valores: `discount`, `surcharge`, `bonusProduct`. | — |
| `valuePct` | DECIMAL(18,4) | No | — | — |
| `valueAmount` | DECIMAL(18,4) | No | — | — |
| `bonusProductId` | uniqueidentifier | No | — | → M02 `serviceProducts` (producto bonificado) (PA-VEN-12; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `conditions` | object | [VERIFICAR] | { accountProperty{ code, value }?, holderActive?: Boolean, paymentMethods[], excludedDocumentTypes[], maxOverdueDays?, monthlyQuantityLimit? } | — |
| `validFrom` | Date | [VERIFICAR] | — | — |
| `validTo` | Date | [VERIFICAR] | — | — |
| `active` | bool | [VERIFICAR] | — | — |

#### 7.14.11 `posTerminals` (COL-VEN-13)

Lista original: §7.11.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | [VERIFICAR] | — | — |
| `name` | string | [VERIFICAR] | — | — |
| `branchId` | uniqueidentifier | [VERIFICAR] | — | `branches` (T04) |
| `pointOfSaleId` | uniqueidentifier | [VERIFICAR] | — | `pointsOfSale` (M06) |
| `warehouseId` | uniqueidentifier | [VERIFICAR] | — | `warehouses` (M13) |
| `priceListId` | uniqueidentifier | [VERIFICAR] | — | `salesPriceLists` (M11); antes implícita por el nombre |
| `cashRegisterId` | uniqueidentifier | [VERIFICAR] | M07 | `cashRegisters` (M07); antes implícita por el nombre |
| `printer` | object | [VERIFICAR] | { mode: browser\|agent, agentId? } | — |
| `defaultAccountId` | uniqueidentifier | [VERIFICAR] | P1007 | → M01 `accounts` (cuenta por defecto del POS, P1007) (PA-VEN-12; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `defaultSalesRepId` | uniqueidentifier | [VERIFICAR] | P1008 | `salesReps` (M11); antes implícita por el nombre |
| `active` | bool | [VERIFICAR] | — | — |

#### 7.14.12 `posSessions` (COL-VEN-14)

Lista original: §7.11.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `posTerminalId` | uniqueidentifier | [VERIFICAR] | Nombre de T05; antes `terminalId` en este anexo. | `posTerminals` (M11); antes implícita por el nombre |
| `openedAt` | Date | [VERIFICAR] | — | — |
| `openedBy` | uniqueidentifier | [VERIFICAR] | — | `memberships` (T02) |
| `openingFloat` | [VERIFICAR] | [VERIFICAR] | — | — |
| `closedAt` | Date | [VERIFICAR] | — | — |
| `closedBy` | uniqueidentifier | [VERIFICAR] | — | `memberships` (T02) |
| `totalsBySalesType` | [VERIFICAR] | [VERIFICAR] | — | — |
| `totalsByPaymentMethod` | array | [VERIFICAR] | — | — |
| `invoices` | array | [VERIFICAR] | — | — |
| `countedCash` | [VERIFICAR] | [VERIFICAR] | — | — |
| `difference` | [VERIFICAR] | [VERIFICAR] | — | — |
| `status` | enum | [VERIFICAR] | Valores: `open`, `closed`, `reconciled`. | — |
| `cashSessionId` | uniqueidentifier | [VERIFICAR] | (M07) }`. Índice `{tenantId, terminalId, status | `cashSessions` (M07); antes implícita por el nombre |
| `open` | [VERIFICAR] | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

### 7.15 Residuales del 5-11-2026: referencias y valores de estado (PA-VEN-12)

Ronda de residuales detectados al regenerar los entregables (categorías 1 y 2 de `_trabajo/residuales-instrucciones.md`). Las filas de §7.1 a §7.8 y de §7.14 quedaron corregidas en su lugar con "antes"; esta tabla las resume.

| Colección | Campo | Tipo | Referencia | Antes |
|---|---|---|---|---|
| `operationCharges` | `conceptVersionId` | uniqueidentifier | → M02 `billableConcepts` | sin destino |
| `operationCharges` | `sourceType` / `sourceId` | enum / uniqueidentifier | Discriminador / polimórfica (`crmCases`, `workOrders`, `interruptionCases`) | sin destino |
| `operationCharges` | `discountAmount`, `discountReason` | DECIMAL(18,4) / string | No es referencia | sin destino |
| `operationCharges` | `discountApprovalId` | uniqueidentifier | → T11 `approvalRequests` | sin destino |
| `salesQuotes` | `premiseAddressId` | uniqueidentifier | → M01 `addresses` | sin destino |
| `salesQuotes` | `projectId` | uniqueidentifier | → M09 `crmProjects` | sin destino |
| `salesQuoteAcceptances` | `quoteVersion` | int | No es referencia | sin destino |
| `salesOrders` | `importBatchId` | uniqueidentifier | → T07 `migrationBatches` | sin destino |
| `salesDeliveries` | `freightSettlementId` | uniqueidentifier | → M18 `tripSettlements` | sin destino |
| `salesReturns` | `creditNoteRequestId` | uniqueidentifier | → M05 `invoiceAnnulmentRequests` | sin destino |
| `salesReturns` | `stockReceiptIds` | uniqueidentifier[] | → M13 `stockDocuments` | `receipts` (M07) |
| `salesInstallments` | `originType` / `originId` | enum / uniqueidentifier | Discriminador / polimórfica (`salesOrders`, `operationCharges`, `salesQuotes`) | sin destino |
| `salesInstallments` | `installmentType` | string | No es referencia (código `TIPO_FAC`) | sin destino |
| `salesDiscountRules` | `productId`, `bonusProductId` | uniqueidentifier | → M02 `serviceProducts` | sin destino |
| `posTerminals` | `defaultAccountId` | uniqueidentifier | → M01 `accounts` | sin destino |

## 8. Estados y transiciones

### 8.1 Cargo por operación (`operationCharges.status`)

Estado inicial: `pending`.

| Origen | Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|---|
| — | `pending` | Sistema (evento) o administrativo | Hito válido; idempotencia | `ven.operationCharge.created` | `cancelled` |
| `pending` | `valued` | Sistema | Concepto con versión vigente | Instantánea tarifaria | Revalorizar solo con permiso y motivo |
| `valued` | `scheduled` | Sistema | Modalidad elegida | Si `financed`: cuotas; si `nextServiceInvoice`: queda para el ciclo como ítem de `billableItems` de M05, creado en la misma operación con `fac.service.upsertBillableItem` (`sourceModule = VEN`, `sourceType = manualCharge` o el que corresponda al `chargeType`, `sourceRef.id = chargeId`, `itemClass = standard`; idempotente por `{sourceModule, sourceRef.id}`, CTR-DAT-38). M11 no mantiene una cola propia de pendientes ni usa `preloadedCharges` (absorbida por `billableItems`) | Volver a `valued` si no se facturó nada (M11 llama a `fac.service.cancelBillableItem`) |
| `scheduled` | `invoiced` | M05 | Factura emitida (total o última cuota) | `ven.operationCharge.invoiced` | Por NC: `credited` |
| `valued`/`scheduled` | `cancelled` | Administrativo + T11 | Sin facturas | Cuotas `voided`; ítem pendiente cancelado en M05 con `fac.service.cancelBillableItem(VEN, chargeId)` | No |
| `invoiced` | `credited` | M05 (NC) | NC emitida | | No |

### 8.2 Presupuesto (`salesQuotes.status`)

Estado inicial: `draft`.

| Origen | Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|---|
| — | `draft` | Vendedor, técnico | RN-VEN-007, RN-VEN-013 | Versión 1 | — |
| `draft` | `sent` | Vendedor | Ítems, validez, PDF generado | Envío T09; `ven.quote.sent` | Modificar → nueva versión `draft` |
| `sent` | `sent` (reenvío) | Vendedor | — | Reenvía la misma versión | — |
| `sent` | `expired` | Job | `validUntil` < hoy | Libera reservas | Renovar → nueva versión `draft` |
| `draft`/`sent` | `accepted` | Socio (online) o vendedor/supervisor | RN-VEN-047, RN-VEN-012 | `ven.quote.accepted`; caso CRM y OT (según config); reservas | `draft` solo sin OT ni facturas (RN-VEN-008) |
| `draft`/`sent` | `rejected` | Socio o vendedor | Motivo | Cierra caso; libera reservas | No (nuevo presupuesto) |
| `accepted` | `inExecution` | Sistema | OT creada | — | — |
| `accepted`/`inExecution`/`sent`/`draft` | `toInvoice` | Vendedor/sistema | No anulado, facturado ni rechazado | Lista para facturar | `accepted` |
| `toInvoice` | `partiallyInvoiced` / `invoiced` | Sistema | Comprobantes generados | Baja pendientes | NC devuelve pendientes |
| cualquiera salvo `cancelled`/`invoiced` | `cancelled` | Supervisor | Confirmación si `accepted`/`sent`/`toInvoice`; RN-VEN-019 | Desvincula caso; libera reservas | No |

Equivalencia ProCoop: vacío = Generado (`draft`), `E` = Enviado (`sent`), `O` = Aprobado (`accepted`), `R` = Rechazado, `P` = Para facturar, `F` = Facturado, `A` = Anulado; vencido derivado.

### 8.3 Venta (`salesOrders.status`)

Estado inicial: `draft`.

| Origen | Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|---|
| — | `draft` | Vendedor, cajero | — | — | — |
| `draft` | `pendingApproval` | Sistema | Descuento o riesgo fuera de política | Tarea T11 | `draft` |
| `draft`/`pendingApproval` | `confirmed` | Vendedor / aprobador | Disponibilidad, riesgo, vendedor | Reserva stock; pide comprobante a M05; cuotas | `cancelled` antes de comprobante |
| `confirmed` | `invoiced` | M05 | Comprobante con CAE (si P727) | `ven.salesOrder.invoiced` | NC |
| `invoiced`/`confirmed` | `partiallyDelivered` / `delivered` | Depósito | Entregas | Egreso de stock | Devolución |
| `invoiced`/`delivered` | `returned` (total) / `partiallyReturned` | Supervisor | `salesReturns` aprobada | NC, reingreso, cuotas | No |
| `draft`/`confirmed` sin comprobante | `cancelled` | Supervisor | Período abierto | Libera reservas | No |
| `invoiced` | `voided` | Supervisor | NC total; período abierto | Cuotas `voided`/acreditadas | No |

### 8.4 Cuota (`salesInstallments.status`)

Estado inicial: `scheduled`.

`scheduled` → `billed` (factura M05) → `partiallyPaid` → `paid` (imputación M07). `scheduled` → `earlyPaidOff` (cancelación anticipada). `scheduled` → `voided` (devolución/anulación). `billed` → `scheduled` (anulación de la factura). `billed` → `credited` (NC).

### 8.5 Sesión de POS

Estado inicial: `open`.

`open` → `closed` (arqueo) → `reconciled` (M07 confirma la caja). `closed` → `open` solo con permiso de supervisor y antes de la conciliación.

### 8.6 Máquinas completadas y altas explícitas (residuales del 5-11-2026, PA-VEN-12)

Agrega las transiciones de `salesDeliveries` y `salesReturns`, que solo tenían valores (INC-06-02), y traslada a tabla las máquinas de §8.4 y §8.5, que daban el estado inicial solo en texto (INC-06-08). Las filas `(nuevo)` fijan el estado inicial. Valores asumidos en PA-VEN-12 (DEC-072); coinciden con §7.

| Colección | Desde | Hacia | Disparador | Guarda | Evento |
|---|---|---|---|---|---|
| `salesDeliveries` | (nuevo) | `draft` | Depósito prepara la entrega de una venta confirmada o facturada | Venta en `confirmed` o `invoiced` | — |
| `salesDeliveries` | `draft` | `confirmed` | Confirmación de la entrega | Egreso de stock en M13 (`stockMovementIds`); firma del receptor | — |
| `salesDeliveries` | `draft` | `voided` | Descarte del borrador | — | — |
| `salesDeliveries` | `confirmed` | `voided` | Anulación de la entrega | Reingreso por movimiento compensatorio en M13; período abierto | — |
| `salesReturns` | (nuevo) | `draft` | Alta de la devolución sobre una venta facturada o entregada | — | — |
| `salesReturns` | `draft` | `approved` | Aprobación del supervisor (`approvalId` en T11) | Ítems y condición informados | — |
| `salesReturns` | `approved` | `completed` | Nota de crédito emitida por M05 y reingreso de stock en M13 | `creditNoteRequestId` resuelto; `installmentActions` aplicadas | — |
| `salesReturns` | `draft` · `approved` | `cancelled` | Cancelación | Sin nota de crédito emitida | — |
| `salesInstallments` | (nuevo) | `scheduled` | Generación del plan de cuotas al confirmar la venta o el cargo financiado | — | — |
| `salesInstallments` | `scheduled` | `billed` | Factura de M05 que incluye la cuota | — | — |
| `salesInstallments` | `billed` | `partiallyPaid` | Imputación parcial en M07 | — | — |
| `salesInstallments` | `billed` · `partiallyPaid` | `paid` | Imputación total en M07 | — | — |
| `salesInstallments` | `scheduled` | `earlyPaidOff` | Cancelación anticipada | — | — |
| `salesInstallments` | `scheduled` | `voided` | Devolución o anulación de la venta | — | — |
| `salesInstallments` | `billed` | `scheduled` | Anulación de la factura | — | — |
| `salesInstallments` | `billed` | `credited` | Nota de crédito | — | — |
| `posSessions` | (nuevo) | `open` | Apertura de la sesión en el terminal | Sin otra sesión `open` en el terminal (único parcial de T05) | — |
| `posSessions` | `open` | `closed` | Arqueo y cierre | — | — |
| `posSessions` | `closed` | `reconciled` | M07 confirma la caja | — | — |
| `posSessions` | `closed` | `open` | Reapertura | Permiso de supervisor; antes de la conciliación | — |

## 9. Procesos y flujos

### 9.1 Cargo de instalación del piloto Internet (O4)

1. M09 aprueba la solicitud de alta INT-100; si el concepto INS-INT tiene disparador `requestApproved`, M11 crea el cargo `pending`; si es `installationConfirmed`, espera.
2. M10 confirma la OT de instalación (`tec.workOrder.closed`, EVT-TEC-07, con resultado exitoso y equipo instalado).
3. M11 crea/valoriza el cargo con la versión vigente de INS-INT (RN-VEN-001/002).
4. Según la elección del socio en la contratación: contado → `nextServiceInvoice` (concepto vinculado a INT, incluido en la primera factura del ciclo); propio → pide factura inmediata a M05; financiado → genera cuotas con el plan (RF-VEN-081) y las marca `includeInServiceInvoice` si el concepto es vinculado y validado.
5. El cargo contado (`nextServiceInvoice`) ya está en `billableItems` de M05 desde el paso 4, creado por M11 con `fac.service.upsertBillableItem` (`sourceModule = VEN`, `sourceRef.id = chargeId`; CTR-DAT-38); las cuotas las proyecta M05 en `billableItems` al consumir EVT-VEN-11/12 (M05 §12.2). M05 toma ambos en la corrida, al emitir publica `fac.invoice.issued` y `fac.billableItem.billed` (EVT-FAC-20); M11 marca cargos y cuotas. Texto anterior: "M05, en la corrida, consulta `GET /api/admin/ven/billing-items?contract=…&period=…` y recibe ítems y cuotas a incluir" (reemplazado: M05 no consulta una cola de M11).
6. M07 imputa pagos; M11 actualiza `paymentStatus`.
7. Una visita fallida no crea el cargo; una sincronización repetida no lo duplica (BASE §73).

### 9.2 Cargo de reconexión (O6)

M08 decide reconectar → M10 ejecuta la OT → al confirmar, M11 aplica RN-VEN-049 (débito por reconexión si P2661; crédito por días desconectados si P2483; cierre sin comprobante si P2907) → cargos a la próxima factura del servicio.

### 9.3 Flujo continuo presupuesto → aceptación → OT → factura (O8)

1. Vendedor o técnico crea el presupuesto (oficina o campo), con conjuntos, flete y molde; valida cuenta (RN-VEN-013/014) y unicidad (RN-VEN-007).
2. Envía la versión (PDF + enlace firmado) por el canal preferido del destinatario.
3. El socio acepta online (PWA o enlace + OTP); se guarda la evidencia.
4. Según configuración: se cobra anticipo (M07, pasarela) y/o se crea el caso CRM y la OT en M10 con materiales y mano de obra; se reservan materiales en M13.
5. La OT se ejecuta; M10 informa materiales y horas reales.
6. M11 compara ejecutado contra aceptado (RF-VEN-111); diferencias dentro de tolerancia se ajustan; fuera de tolerancia piden aprobación.
7. El presupuesto pasa a `toInvoice`; M11 crea la venta y pide la factura a M05 (contado o plan); aplica anticipos.
8. Se notifica al socio cada paso (T09); todo queda en el expediente (T11).

### 9.4 Venta con entrega y cuotas (CU-23)

Registrar artículo y confirmar disponibilidad → crear venta con plan → confirmar (reserva) → M05 emite (modelo fiscal del plan) → entrega (egreso) → cuotas por corrida en documento propio → cobro en M07. Devolución: RN-VEN-033.

### 9.5 Venta en POS

Apertura de sesión → escaneo de productos (lista de precios del terminal) → reglas de descuento → cobro (M07) → factura electrónica inmediata (M05) → ticket (navegador o agente) → egreso de stock inmediato (entrega en mostrador) → cierre con arqueo por medio.

### 9.6 Jobs

| Job | Frecuencia | Descripción | Reintento / recuperación |
|---|---|---|---|
| `JOB-VEN-01` `ven:vencer-presupuestos` | Diario 00:30 (zona del tenant) | Pasa a `expired` y libera reservas | Idempotente; reanuda por cursor |
| `JOB-VEN-02` `ven:recordar-presupuestos` | Diario | Avisa presupuestos por vencer (N días) | Idempotente por (presupuesto, fecha) |
| `JOB-VEN-03` `ven:preparar-cuotas-corrida` | A demanda de M05 | Selecciona cuotas a facturar (RN-VEN-030) y las bloquea para la corrida | Libera al cancelar la corrida |
| `JOB-VEN-04` `ven:modificacion-masiva-cuotas` | A demanda | Ejecuta la modificación con vista previa confirmada | Transacción por lote de 500; reanudable |
| `JOB-VEN-05` `ven:actualizacion-masiva-precios` | A demanda | Aplica la actualización confirmada | Reanudable; auditoría por producto |
| `JOB-VEN-06` `ven:importar-ventas-terceros` | A demanda (desde M05) | Crea ventas y cuotas de importaciones | Idempotente por archivo + fila |
| `JOB-VEN-07` `ven:sincronizar-campo` | Al sincronizar | Procesa presupuestos/ventas de pwa-campo con `clientMutationId` | Idempotente |

## 10. Pantallas

Todas las pantallas de admin usan el layout CNX: barra de filtros persistente, tabla paginada con columnas configurables, exportación según permiso, acciones por fila, panel lateral de detalle, estados vacíos con acción sugerida y ayuda contextual (`?`) con texto del diccionario. Las de PWA son mobile-first con modo offline en pwa-campo.

### PAN-VEN-01 — Cargos por operación (bandeja)

- **App / ruta:** admin `/ven/cargos` · **Capability:** `ven.cargos.ver`
- **Filtros:** estado, tipo de cargo, servicio, modalidad, fecha del hito, cuenta, origen (OT, solicitud, reconexión, manual).
- **Columnas:** número, cuenta, titular, servicio, concepto, fecha del hito, importe, modalidad, cuotas (N/M facturadas), estado, factura.
- **Acciones:** ver detalle; crear manual (`ven.cargos.crear`); bonificar (`ven.cargos.editar`, T11); anular (`ven.cargos.anular`); cambiar modalidad antes de facturar; navegar al origen.
- **Modales:** bonificación con motivo e importe; anulación con motivo; simulación de cuotas.
- **Vacío:** "No hay cargos pendientes. Los cargos se generan al confirmar instalaciones u otras operaciones configuradas."
- **Ayuda:** explica disparadores e inclusión en factura del servicio (MER-010).
- **Equivalencia INV:** sin pantalla propia en ProCoop (cargos adicionales dentro de facturación).

### PAN-VEN-02 — Presupuestos (listado)

- **App / ruta:** admin `/ven/presupuestos` · **Capability:** `ven.presupuestos.ver`
- **Filtros:** estado (incluye vencidos), vendedor, sucursal, punto de venta, cuenta/persona/prospecto, fecha, validez, servicio, con obra/OT, canal.
- **Columnas:** número, fecha, cliente, referencia, vendedor, total, validez, versión, estado, OT/caso, facturado %.
- **Acciones:** nuevo; abrir; enviar/reenviar; marcar para facturar; anular; cambio manual de estado (`ven.presupuestos.cambiarEstado`); impresión masiva; exportar.
- **Vacío:** "Todavía no hay presupuestos. Creá el primero o pedí uno desde una OT."
- **Equivalencia INV:** `frm_Presupuesto` (búsqueda), `frmImpresionPresupuesto_Orden`, `frmSeleccionar_Presupuesto`.

### PAN-VEN-03 — Editor de presupuesto

- **App / ruta:** admin `/ven/presupuestos/:id` · **Capability:** `ven.presupuestos.editar` (lectura con `ver`)
- **Layout:** cabecera (cliente, vendedor, condiciones, moneda, validez, referencia, servicio y domicilio, obra/OT); pestañas **Ítems** (grilla editable con conjuntos expandibles, margen, costo, descuento, IVA, prorrateo), **Conjuntos**, **Notas**, **Comprobantes generados**, **Versiones** (comparador), **Aceptación** (evidencia), **Historial**.
- **Acciones:** agregar producto/concepto/texto; crear/clonar/eliminar conjunto; actualizar precios (`frm_Presupuesto_ActualizarProd`); calcular prorrateo; vista previa PDF; enviar (elige canal); aceptar en nombre del cliente con evidencia (`ven.presupuestos.aprobar`); rechazar; volver a borrador; marcar para facturar; facturar parcial (selección de ítems pendientes); registrar anticipo; generar OT; anular.
- **Modales:** confirmar aprobación sin obra (P2914); advertencias de validación de cuenta, deuda y unicidad con override; selección parcial a facturar.
- **Vacío de ítems:** "Agregá productos o un conjunto para calcular el total."
- **Equivalencia INV:** `frm_Presupuesto`, `frm_Presupuesto_Detalle`, `frm_Presupuesto_ConjuntoDetalle`, `frm_Presupuesto_ConjuntoDetalle_Item`, `abm_Presupuesto_Notas`, `frmPresupu_EstadoManual`.

### PAN-VEN-04 — Condiciones de venta

- **App / ruta:** admin `/ven/config/condiciones` · **Capability:** `ven.condiciones.configurar`
- **Columnas:** código, nombre, tipo, activo. **Acciones:** alta, edición, activar/desactivar.
- **Equivalencia INV:** `abm_Presupu_Condicion`.

### PAN-VEN-05 — Aceptación online del presupuesto

- **App / ruta:** landing `/p/:tenantSlug/presupuesto/:token` y pwa-socio `/presupuestos/:id` · **Capability:** pública con token + OTP / `ven.misPresupuestos.aceptar`
- **Layout:** resumen del presupuesto (versión, ítems agrupados por conjunto, condiciones, total, validez), PDF descargable, botones **Aceptar** y **Rechazar** (con motivo), verificación OTP si no está autenticado, confirmación con número de seguimiento.
- **Estados:** vencido ("Este presupuesto venció el …; pedí una actualización"), reemplazado ("Hay una versión más nueva"), ya respondido.
- **Equivalencia INV:** no existe (mejora).

### PAN-VEN-06 — Mis presupuestos y mis cuotas

- **App / ruta:** pwa-socio `/presupuestos`, `/cuotas` · **Capability:** `ven.misPresupuestos.ver`, `ven.misCuotas.ver`
- **Contenido:** presupuestos por estado; cargos por operación y cuotas con capital, interés, vencimiento, estado y factura; botón pagar (M07).
- **Vacío:** "No tenés presupuestos ni cuotas pendientes."

### PAN-VEN-07 — Presupuesto y venta en campo

- **App / ruta:** pwa-campo `/ot/:id/presupuesto`, `/ot/:id/venta` · **Capability:** `ven.presupuestos.crear`, `ven.ventas.crear`
- **Contenido:** productos habilitados para campo, granel con coeficiente, firma del cliente, facturación en campo (P2592/P2641), envío por SMS/WhatsApp; funciona offline con cola de sincronización.
- **Equivalencia INV:** módulo PMovil (sin formulario de escritorio).

### PAN-VEN-08 — Ventas (listado)

- **App / ruta:** admin `/ven/ventas` · **Capability:** `ven.ventas.ver`
- **Filtros:** estado, tipo, vendedor, sucursal, punto de venta, cuenta, fecha, entrega, forma de pago, con OT/presupuesto.
- **Columnas:** número, fecha, cliente, vendedor, total, forma de pago, comprobante fiscal, entrega, estado.
- **Acciones:** nueva; abrir; anular; devolver; exportar.
- **Equivalencia INV:** `frmComprobanteVenta` (búsqueda).

### PAN-VEN-09 — Editor de venta

- **App / ruta:** admin `/ven/ventas/:id` · **Capability:** `ven.ventas.editar`
- **Layout:** cabecera (cliente, servicio, vendedor, lista de precios, moneda, forma de pago); grilla de ítems con series, depósito y reglas aplicadas; panel de riesgo crediticio; pestaña **Transporte y observaciones**; pestaña **Cuotas** (simulador con CFT); pestañas **Entregas**, **Devoluciones**, **Comprobantes**, **Historial**.
- **Modales:** forma de pago y plan (equivale a `FormasPago`); override de riesgo; selección de serie; aprobación de descuento.
- **Equivalencia INV:** `frmComprobanteVenta`, `frmComprobanteVenta_Detalle`, `FormasPago`, `frmLiquidacionCredito`.

### PAN-VEN-10 — Venta rápida / POS

- **App / ruta:** admin `/ven/pos/:terminalId` · **Capability:** `ven.pos.operar`
- **Layout:** pantalla completa táctil: buscador/escáner, carrito, cliente (por defecto P1007), vendedor (por defecto P1008), descuentos, total, cobro multi-medio, emitir; atajos de teclado.
- **Estados:** sin sesión abierta → botón abrir; sin conexión → bloqueo de emisión fiscal con aviso.
- **Equivalencia INV:** CVEN Rápida, `frmVentaPrepagaRapida` (solo patrón de pantalla).

### PAN-VEN-11 — Sesiones de POS y terminales

- **App / ruta:** admin `/ven/pos/sesiones`, `/ven/config/pos` · **Capability:** `ven.pos.abrir`/`cerrar`/`configurar`
- **Contenido:** apertura con fondo; cierre con arqueo por medio y diferencias; configuración de terminal (punto de venta, depósito, lista, caja, impresora).

### PAN-VEN-12 — Entregas pendientes

- **App / ruta:** admin `/ven/entregas` · **Capability:** `ven.entregas.registrar`
- **Columnas:** venta, cliente, producto, vendido, entregado, pendiente, depósito, antigüedad. **Acciones:** registrar entrega parcial/total con series y receptor; imprimir remito de entrega.

### PAN-VEN-13 — Devoluciones

- **App / ruta:** admin `/ven/devoluciones` · **Capability:** `ven.ventas.devolver`
- **Contenido:** selección de venta e ítems, estado del producto, vista de efecto en cuotas y NC antes de aprobar.

### PAN-VEN-14 — Cuotas de venta

- **App / ruta:** admin `/ven/cuotas` · **Capability:** `ven.cuotas.ver`
- **Filtros:** cuenta, origen, estado, vencimiento, tipo de cuota, servicio, inclusión en factura del servicio.
- **Acciones:** editar cuota sin facturar (`ven.cuotas.editar`); cancelación anticipada (`ven.cuotas.cancelarAnticipado`); ver factura.
- **Equivalencia INV:** `frmDetallecuotas`, `frmEdicionCuotas`, `frmComprobantesFactura_Cuota`, `frmFacturasImpresion_Cuotas`.

### PAN-VEN-15 — Modificación masiva de cuotas

- **App / ruta:** admin `/ven/cuotas/modificacion-masiva` · **Capability:** `ven.cuotas.modificarMasivo`
- **Pasos:** filtro (producto, tipo de cuota, prepagas, rango de vencimientos) → tipo de modificación (porcentaje, costo, desplazar vencimientos, alícuota IVA/sobretasa, tipo de cuota, moneda) → vista previa con totales → confirmación con motivo → seguimiento del job.
- **Equivalencia INV:** `frmModificaDatosCuotas`, `frmModificarTipoCuotas`, `frmAjusteCuotasMoneda`.

### PAN-VEN-16 — Vendedores

- **App / ruta:** admin `/ven/config/vendedores` · **Capability:** `ven.vendedores.ver`/`editar`
- **Columnas:** código, nombre, sucursal, email, celular, usuario vinculado, activo. Nombre, email y celular se leen de la persona de M01 (DEC-097).
- **Alta:** "Nuevo vendedor" abre el alta asistida de M01 (PAN-PER-04 en modo búsqueda, RF-PER-174): se busca la persona por documento, CUIT o nombre; si existe se reutiliza y si no se crea con control de duplicados; luego se cargan solo los datos del rol (código, usuario o empleado, sucursales, activo). Los datos de identidad se muestran de solo lectura con enlace a la ficha de la persona.
- **Equivalencia INV:** `abm_Vendedor`.

### PAN-VEN-17 — Listas de precios y actualización masiva

- **App / ruta:** admin `/ven/precios`, `/ven/precios/actualizar` · **Capability:** `ven.precios.ver`/`editar`/`actualizarMasivo`
- **Contenido:** listas por vigencia y canal; actualizador con filtros (rango de código, departamento, rubro, tipo, servicio, proveedor, plan/etapa) y modos; grilla de vista previa (actual, nuevo, variación %, margen) y confirmación.

### PAN-VEN-18 — Reglas de recargo y descuento

- **App / ruta:** admin `/ven/config/descuentos` · **Capability:** `ven.descuentos.configurar`
- **Contenido:** regla por producto con condiciones; simulador "¿aplica a esta cuenta?".

### PAN-VEN-19 — Planes de financiación comercial

- **App / ruta:** admin `/ven/config/planes` · **Capability:** `ven.planes.configurar`
- **Contenido:** ABM de planes; simulador de cuotas con TEA y CFT; vigencia y ámbito.

### PAN-VEN-20 — Rendiciones de viajes

- **App / ruta:** admin `/ven/rendiciones` · **Capability:** `ven.rendiciones.ver`/`crear`/`editar`
- **Contenido:** rendición por venta/entrega con km, flete, peajes, viáticos e ítems de combustible; informe de rendición.
- **Equivalencia INV:** `abm_ComprobanteRendicion`, `frm_ComprobanteRendicion_Detalle`.

### PAN-VEN-21 — Flujo continuo (tablero)

- **App / ruta:** admin `/ven/tablero` · **Capability:** `ven.presupuestos.ver`
- **Contenido:** kanban Borrador → Enviado → Aceptado → En ejecución → Para facturar → Facturado, con tarjetas que muestran OT, materiales y diferencias; solo permite arrastres válidos.

### PAN-VEN-22 — Anulación de ventas por rango

- **App / ruta:** admin `/ven/ventas/anular-rango` · **Capability:** `ven.ventas.anular`
- **Contenido:** tipo, punto de venta, desde/hasta; vista previa con las que no pueden anularse (CAE, período cerrado) y motivo.
- **Equivalencia INV:** `frmAnulacionComprobantesVenta`.

### PAN-VEN-23 — Reportes de ventas

- **App / ruta:** admin `/ven/reportes` · **Capability:** `ven.ventas.exportar`
- **Contenido:** catálogo de reportes de la sección 15 con parámetros, fecha de corte y exportación.

### PAN-VEN-24 — Configuración de ventas

- **App / ruta:** admin `/ven/config` · **Capability:** `ven.config.configurar`
- **Contenido:** parámetros de la sección 14 agrupados (presupuestos, ventas, cuotas, campo, POS, aceptación online, riesgo), con ayuda y origen.

## 11. API

| ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-VEN-001 | GET | `/api/admin/ven/operation-charges` | `ven.cargos.ver` | Listar cargos (filtros, paginado) | Sí |
| API-VEN-002 | POST | `/api/admin/ven/operation-charges` | `ven.cargos.crear` | Alta manual de cargo | Sí (Idempotency-Key) |
| API-VEN-003 | POST | `/api/admin/ven/operation-charges/:id/discount` | `ven.cargos.editar` | Bonificar (inicia T11 si corresponde) | Sí |
| API-VEN-004 | POST | `/api/admin/ven/operation-charges/:id/cancel` | `ven.cargos.anular` | Anular cargo no facturado | Sí |
| API-VEN-005 | POST | `/api/admin/ven/operation-charges/:id/billing-mode` | `ven.cargos.editar` | Cambiar modalidad (contado/propia/financiada) | Sí |
| API-VEN-006 | GET | `/api/admin/ven/billing-items` | `fac.facturacion.ejecutar` (cuenta técnica de M05; antes "interno M05 (`fac.facturacion.ejecutar`)") | **Reemplazado por** API-FAC-105 (`GET /api/admin/fac/billable-items`, M05; antes "Reemplazado por `billableItems` de M05"; PA-VEN-12). `billableItems` de M05 (CTR-DAT-38): M11 crea los cargos con `fac.service.upsertBillableItem` y M05 proyecta las cuotas desde EVT-VEN-11/12; M05 no consulta a M11 en la corrida. Se conserva solo como consulta de conciliación de solo lectura. Descripción original: "Ítems y cuotas a facturar por contrato/período/corrida" | Sí |
| API-VEN-007 | POST | `/api/admin/ven/billing-items/lock` | `fac.facturacion.ejecutar` (cuenta técnica de M05; antes "interno M05") | **Reemplazado por** API-FAC-044 (`POST /api/admin/fac/runs/{id}/prepare`, M05: la preparación de la corrida congela la selección de `billableItems`; antes "Reemplazado por la selección de `billableItems` que hace M05 en su propia corrida"; PA-VEN-12) (CTR-DAT-38); no se implementa. Descripción original: "Bloquear selección para una corrida" | Sí (por `runId`) |
| API-VEN-008 | POST | `/api/admin/ven/simulations/first-charge` | `ven.cargos.ver` | Simular primer cobro (cargos + cuotas) para M04/M09 | Sí |
| API-VEN-010 | GET | `/api/admin/ven/quotes` | `ven.presupuestos.ver` | Listar presupuestos | Sí |
| API-VEN-011 | POST | `/api/admin/ven/quotes` | `ven.presupuestos.crear` | Crear presupuesto | Sí (Idempotency-Key) |
| API-VEN-012 | GET | `/api/admin/ven/quotes/:id` | `ven.presupuestos.ver` | Detalle con versiones | Sí |
| API-VEN-013 | PATCH | `/api/admin/ven/quotes/:id` | `ven.presupuestos.editar` | Editar borrador (o crear nueva versión) | Sí (`If-Match`) |
| API-VEN-014 | POST | `/api/admin/ven/quotes/:id/send` | `ven.presupuestos.enviar` | Enviar/reenviar por canales | Sí |
| API-VEN-015 | POST | `/api/admin/ven/quotes/:id/accept` | `ven.presupuestos.aprobar` | Aceptar en nombre del cliente con evidencia | Sí |
| API-VEN-016 | POST | `/api/admin/ven/quotes/:id/reject` | `ven.presupuestos.aprobar` | Rechazar con motivo | Sí |
| API-VEN-017 | POST | `/api/admin/ven/quotes/:id/revert-to-draft` | `ven.presupuestos.editar` | Volver a borrador (sin OT ni facturas) | Sí |
| API-VEN-018 | POST | `/api/admin/ven/quotes/:id/mark-to-invoice` | `ven.presupuestos.editar` | Marcar para facturar | Sí |
| API-VEN-019 | POST | `/api/admin/ven/quotes/:id/invoice` | `ven.ventas.crear` | Facturar total/parcial por ítems | Sí (Idempotency-Key) |
| API-VEN-020 | POST | `/api/admin/ven/quotes/:id/cancel` | `ven.presupuestos.anular` | Anular | Sí |
| API-VEN-021 | POST | `/api/admin/ven/quotes/:id/state` | `ven.presupuestos.cambiarEstado` | Cambio manual de estado con motivo | Sí |
| API-VEN-022 | POST | `/api/admin/ven/quotes/:id/work-order` | `ven.presupuestos.aprobar` | Generar caso CRM y OT | Sí |
| API-VEN-023 | POST | `/api/admin/ven/quotes/:id/notes` | `ven.presupuestos.editar` | Agregar nota | No |
| API-VEN-024 | POST | `/api/admin/ven/quotes/:id/groups/:groupId/clone` | `ven.presupuestos.editar` | Clonar conjunto | No |
| API-VEN-025 | POST | `/api/admin/ven/quotes/:id/recalculate` | `ven.presupuestos.editar` | Recalcular precios, margen y prorrateo | Sí |
| API-VEN-026 | GET | `/api/admin/ven/quotes/:id/pdf` | `ven.presupuestos.ver` | PDF de una versión | Sí |
| API-VEN-027 | POST | `/api/admin/ven/quotes/bulk-print` | `ven.presupuestos.ver` | Impresión masiva | Sí |
| API-VEN-028 | GET/POST | `/api/admin/ven/sales-conditions` | `ven.condiciones.configurar` | ABM condiciones | Sí (POST con Idempotency-Key) |
| API-VEN-030 | GET | `/api/public/<tenantSlug>/quotes/:token` | `public: true` (sin capability, RF-IAM-061; acceso por token firmado del enlace) | Ver presupuesto por enlace | Sí |
| API-VEN-031 | POST | `/api/public/<tenantSlug>/quotes/:token/otp` | `public: true` (sin capability, RF-IAM-061; acceso por token firmado del enlace) | Enviar OTP al contacto registrado | No (limitado por tasa) |
| API-VEN-032 | POST | `/api/public/<tenantSlug>/quotes/:token/decision` | `public: true` (sin capability, RF-IAM-061; acceso por token firmado del enlace más OTP) | Aceptar o rechazar | Sí |
| API-VEN-033 | GET | `/api/ven/my/quotes` | `ven.misPresupuestos.ver` | Presupuestos del socio | Sí |
| API-VEN-034 | POST | `/api/ven/my/quotes/:id/decision` | `ven.misPresupuestos.aceptar` | Aceptar/rechazar como socio | Sí |
| API-VEN-035 | GET | `/api/ven/my/installments` | `ven.misCuotas.ver` | Cargos y cuotas del socio | Sí |
| API-VEN-040 | GET | `/api/admin/ven/sales-orders` | `ven.ventas.ver` | Listar ventas | Sí |
| API-VEN-041 | POST | `/api/admin/ven/sales-orders` | `ven.ventas.crear` | Crear venta | Sí (Idempotency-Key / `clientMutationId`) |
| API-VEN-042 | PATCH | `/api/admin/ven/sales-orders/:id` | `ven.ventas.editar` | Editar borrador | Sí (`If-Match`) |
| API-VEN-043 | POST | `/api/admin/ven/sales-orders/:id/confirm` | `ven.ventas.crear` | Confirmar (riesgo, reserva, pide comprobante) | Sí |
| API-VEN-044 | POST | `/api/admin/ven/sales-orders/:id/risk-override` | `ven.riesgo.override` | Autorizar riesgo excedido | Sí |
| API-VEN-045 | POST | `/api/admin/ven/sales-orders/:id/cancel` | `ven.ventas.anular` | Anular | Sí |
| API-VEN-046 | POST | `/api/admin/ven/sales-orders/cancel-range` | `ven.ventas.anular` | Anulación por rango (job) | Sí |
| API-VEN-047 | POST | `/api/admin/ven/sales-orders/:id/deliveries` | `ven.entregas.registrar` | Registrar entrega | Sí |
| API-VEN-048 | GET | `/api/admin/ven/deliveries/pending` | `ven.entregas.ver` | Vendido no entregado | Sí |
| API-VEN-049 | POST | `/api/admin/ven/sales-orders/:id/returns` | `ven.ventas.devolver` | Crear devolución | Sí |
| API-VEN-050 | POST | `/api/admin/ven/returns/:id/approve` | `ven.ventas.aprobar` | Aprobar devolución | Sí |
| API-VEN-051 | POST | `/api/admin/ven/financing/simulate` | `ven.ventas.ver` | Simular plan (cuotas, TEA, CFT) | Sí |
| API-VEN-052 | GET/POST | `/api/admin/ven/financing-plans` | `ven.planes.configurar` | ABM planes | Sí |
| API-VEN-053 | GET | `/api/admin/ven/installments` | `ven.cuotas.ver` | Listar cuotas | Sí |
| API-VEN-054 | PATCH | `/api/admin/ven/installments/:id` | `ven.cuotas.editar` | Editar cuota sin facturar | Sí (`If-Match`) |
| API-VEN-055 | POST | `/api/admin/ven/installments/bulk-update` | `ven.cuotas.modificarMasivo` | Modificación masiva (preview/confirm) | Sí |
| API-VEN-056 | POST | `/api/admin/ven/installments/early-payoff` | `ven.cuotas.cancelarAnticipado` | Cancelación anticipada | Sí |
| API-VEN-060 | GET/POST | `/api/admin/ven/sales-reps` | `ven.vendedores.ver`/`editar` | ABM vendedores | Sí |
| API-VEN-061 | GET/POST | `/api/admin/ven/price-lists` | `ven.precios.ver`/`editar` | Listas de precios | Sí |
| API-VEN-062 | POST | `/api/admin/ven/price-lists/bulk-update` | `ven.precios.actualizarMasivo` | Actualización masiva (preview/confirm) | Sí |
| API-VEN-063 | GET/POST | `/api/admin/ven/discount-rules` | `ven.descuentos.configurar` | Reglas de recargo/descuento | Sí |
| API-VEN-064 | POST | `/api/admin/ven/discount-rules/evaluate` | `ven.ventas.ver` | Evaluar reglas para cuenta y producto | Sí |
| API-VEN-070 | GET/POST | `/api/admin/ven/pos/terminals` | `ven.pos.configurar` | Terminales | Sí |
| API-VEN-071 | POST | `/api/admin/ven/pos/sessions` | `ven.pos.abrir` | Abrir sesión | Sí |
| API-VEN-072 | POST | `/api/admin/ven/pos/sessions/:id/close` | `ven.pos.cerrar` | Cerrar con arqueo | Sí |
| API-VEN-073 | POST | `/api/admin/ven/pos/sessions/:id/sales` | `ven.pos.operar` | Venta POS (crea, cobra, emite) | Sí (Idempotency-Key) |
| API-VEN-080 | GET/POST | `/api/admin/ven/freight-settlements` | `ven.rendiciones.ver`/`crear` | Rendiciones | Sí |
| API-VEN-090 | GET | `/api/admin/ven/reports/:code` | `ven.ventas.exportar` | Ejecutar reporte (sección 15) | Sí |
| API-VEN-091 | GET/PUT | `/api/admin/ven/settings` | `ven.config.configurar` | Parámetros del módulo | Sí |
| API-VEN-092 | GET | `/api/v1/ext/ven/quotes`, `/api/v1/ext/ven/sales-orders` | `ven.presupuestos.ver`, `ven.ventas.ver` (scopes de la API key, cuenta técnica S-API) (antes API key con scope `ven.read`) | Consulta para integraciones externas | Sí |

Errores RFC 9457 específicos: `ven/quote-expired`, `ven/quote-version-superseded`, `ven/invalid-transition`, `ven/duplicate-quote-product`, `ven/credit-risk-exceeded`, `ven/period-closed`, `ven/serial-not-available`, `ven/installment-already-billed`, `ven/inclusion-not-allowed`, `ven/sales-rep-required`.

## 12. Eventos y jobs

| ID | Evento | Productor | Consumidores | Payload mínimo |
|---|---|---|---|---|
| EVT-VEN-01 | `ven.operationCharge.created` | M11 | M09 (ficha). M05 ya no lo consume para crear pendientes: el ítem se crea por llamada síncrona a `fac.service.upsertBillableItem` en la transición `valued` → `scheduled` (§8.1; antes "M05 (pendientes)") | `chargeId, accountId, contractId, conceptId, amount, billingMode, billableItemId?` (presente si `billingMode = nextServiceInvoice`) |
| EVT-VEN-02 | `ven.operationCharge.cancelled` | M11 | M09; M05 solo como aviso (la cancelación del ítem ya se hizo con `fac.service.cancelBillableItem`) | `chargeId, reason, billableItemId?` |
| EVT-VEN-03 | `ven.operationCharge.invoiced` | M11 | M09 | `chargeId, invoiceIds` |
| EVT-VEN-04 | `ven.quote.created` / `ven.quote.sent` | M11 | T09, M09 | `quoteId, version, channels` |
| EVT-VEN-05 | `ven.quote.accepted` | M11 | M10 (OT), M09 (caso), M13 (reserva), T09 | `quoteId, version, acceptanceId, items` |
| EVT-VEN-06 | `ven.quote.rejected` / `ven.quote.expired` / `ven.quote.cancelled` | M11 | M09, M13 (liberar), T09 | `quoteId, reason` |
| EVT-VEN-07 | `ven.salesOrder.confirmed` | M11 | M13 (reserva/egreso), M05 (comprobante), M15 (si corresponde) | `salesOrderId, items, paymentTerms` |
| EVT-VEN-08 | `ven.salesOrder.delivered` | M11 | M13, M15 | `salesOrderId, deliveryId, items, serials` |
| EVT-VEN-09 | `ven.salesOrder.returned` | M11 | M13 (reingreso), M05 (NC), M07 | `salesOrderId, returnId, items, installmentActions` |
| EVT-VEN-10 | `ven.salesOrder.cancelled` | M11 | M13, M05, M15 | `salesOrderId, reason` |
| EVT-VEN-11 | `ven.installmentPlan.created` | M11 | M07 (saldo proyectado), M15 | `originType, originId, installments[]` |
| EVT-VEN-12 | `ven.installment.updated` (masivo, cancelación) | M11 | M07, M15 | `installmentIds, batchId, type` |
| EVT-VEN-13 | `ven.posSession.closed` | M11 | M07 (caja), M15 | `sessionId, totals` |
| EVT-VEN-14 | `ven.priceList.updated` | M11 | M09, pwa-campo (caché) | `priceListId, batchId` |
| EVT-VEN-15 | `ven.salesOrder.invoiced` | M11 | M13 (entrega pendiente), T10 | `salesOrderId, invoiceId` |

**Eventos consumidos:** `crm.commandRequest.requested` (EVT-CRM-13, M09), `tec.workOrder.closed` / `tec.workOrder.cancelled` (EVT-TEC-07/08, M10), `mor.interruption.requested` (EVT-MOR-12, M08), `fac.invoice.issued` / `fac.invoice.annulled` / `fac.creditNote.issued` (EVT-FAC-07/08/10, M05; con DEC-107 un comprobante con CAE rechazado por ARCA vuelve a borrador o a la cola y cambia de número sin cambiar su `invoiceId`, RN-FAC-164 de M05: M11 referencia los comprobantes solo por `invoiceId` en `invoiceRefs[]`, `generatedDocuments[]`, `fiscalDocuments[]` y cuotas, trata la reemisión con `issueAttempt` mayor como idempotente y no revierte cargos ni cuotas facturados ante `fac.invoice.returnedToDraft`, EVT-FAC-22; no guarda ni muestra el número, así que no consume `fac.invoice.renumbered`, EVT-FAC-23; 10-11-2026), `cob.payment.confirmed` (EVT-COB-04, M07), `stk.reservation.failed` (EVT-STK-23) / `stk.materials.consumed` (EVT-STK-02) (M13), `wfl.approval.decided` (EVT-WFL-010, T11), `cat.configVersion.published` (EVT-CAT-04, M02).

Todos se publican por outbox en la misma transacción; consumidores idempotentes por `eventId`. Jobs: ver §9.6 (`JOB-VEN-01` a `JOB-VEN-07`), en BullMQ con 5 reintentos exponenciales y cola de errores visible en T07.

## 13. Integraciones

| Integración | Dirección | Uso en M11 | Responsable técnico |
|---|---|---|---|
| ARCA (WSFE) | Indirecta vía M05 | CAE de facturas de venta y cuotas; P727 espera el CAE | M05 / T06 |
| Pasarelas de pago | Indirecta vía M07 | Anticipo y pago online del presupuesto aceptado; cobro de cuotas | M07 |
| Email / WhatsApp / SMS | Vía T09 | Envío de presupuestos, OTP, recordatorios | T09 |
| Agente local de hardware | Vía T06 / FIC 19 | Impresora de tickets, lector de código de barras, cajón de dinero | T06 |
| App de campo | pwa-campo | Presupuestos y ventas offline | M10 / T05 |
| Firma en pantalla | pwa-campo | Conformidad de entrega y aceptación en campo | T11 |
| Importación de terceros | Vía M05 | Ventas con cuotas desde archivos externos | M05 |
| Controladores fiscales | No en alcance inicial (PA-VEN-04) | — | — |

## 14. Parámetros

Ámbito: `tenant` salvo indicación (`branch` = sucursal, `pos` = punto de venta/terminal). Los parámetros que en ProCoop son FK a `PROD_SER`/`TIPO_FAC`/`VENDEDOR`/`PTOVENTA` se convierten en referencias a `billingConcepts`/`products`, tipos de comprobante de M05, `salesReps` y puntos de venta. Se administran con versionado en T04 (`T04b-CFG` mantiene el catálogo completo).

### 14.1 Cargos por operación y reconexión

| ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 |
|---|---|---|---|---|---|---|
| PRM-VEN-001 | `ven.charges.triggerByConcept` | Map<conceptId, trigger> | tenant | INS-INT → `installationConfirmed` | Hito que vuelve exigible cada concepto | BASE §72 |
| PRM-VEN-002 | `ven.charges.defaultBillingMode` | Enum | tenant | `nextServiceInvoice` | Modalidad por defecto | BASE §72-73 |
| PRM-VEN-003 | `ven.includeLinkedInServiceInvoice` | Boolean | tenant | `true` | Permite incluir conceptos vinculados y validados en la factura del servicio | MER-010; reemplaza #308 |
| PRM-VEN-004 | `ven.charges.discountApprovalThreshold` | Decimal | tenant | 0 (toda bonificación aprueba) | Monto a partir del cual la bonificación requiere T11 | MER-012 |
| PRM-VEN-005 | `ven.reconnection.debitIfNotBilled` | Boolean | tenant | `false` | Débito al reconectar servicio no facturado en el período | #2661 |
| PRM-VEN-006 | `ven.reconnection.creditDisconnectedDays` | Boolean | tenant | `false` | Crédito por días de servicio desconectado | #2483 |
| PRM-VEN-007 | `ven.reconnection.creditConceptId` | Ref concepto | tenant | — | Concepto del crédito por días desconectados | #2485 |
| PRM-VEN-008 | `ven.reconnection.allowCloseWithoutCharge` | Boolean | tenant | `false` | Cerrar OT de reconexión sin comprobante | #2907 |

### 14.2 Presupuestos

| ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 |
|---|---|---|---|---|---|---|
| PRM-VEN-010 | `ven.quote.template` | Ref plantilla | tenant | Plantilla estándar | Informe/plantilla del presupuesto | #210 |
| PRM-VEN-011 | `ven.quote.validityDays` | Integer | tenant | 15 | Días de validez | #2788 |
| PRM-VEN-012 | `ven.quote.allowPriceRecalc` | Boolean | tenant | `true` | Calcular/actualizar precio de producto en el presupuesto | #2892 |
| PRM-VEN-013 | `ven.quote.defaultPersonId` | Ref persona | tenant | — | Persona por defecto al crear | #2894 |
| PRM-VEN-014 | `ven.quote.defaultMarginPct` | Decimal | tenant | 0 | Margen por defecto al actualizar precio | #2903 |
| PRM-VEN-015 | `ven.quote.laborCostProductId` | Ref producto | tenant | — | Producto para costo de mano de obra (costo fijo) | #3015 |
| PRM-VEN-016 | `ven.quote.requireWorkOnApprove` | Boolean | tenant | `false` | Confirmar aprobación sin obra asignada | #2914 |
| PRM-VEN-017 | `ven.quote.pricesIncludeVat` | Boolean | tenant | `false` | Registrar precio con IVA | #2915 |
| PRM-VEN-018 | `ven.quote.printByGroups` | Boolean | tenant | `false` | Emitir por conjuntos | #2949 |
| PRM-VEN-019 | `ven.quote.freightProductId` | Ref producto | tenant | — | Producto flete (prorrateo) | #2953 |
| PRM-VEN-020 | `ven.quote.moldProductId` | Ref producto | tenant | — | Producto molde (prorrateo) | #3032 |
| PRM-VEN-021 | `ven.quote.autoGroupName` | Boolean | tenant | `false` | Autocompletar nombre de conjunto | #3004 |
| PRM-VEN-022 | `ven.quote.printProductPage` | Boolean | tenant | `false` | Página extra con datos del producto | #3024 |
| PRM-VEN-023 | `ven.quote.simplePrintDefault` | Boolean | tenant | `false` | Impresión simple por defecto al registrar | #3037 |
| PRM-VEN-024 | `ven.quote.allowCustomerChangeBeforeApprove` | Boolean | tenant | `false` | Cambiar cliente antes de aprobar | #3010 |
| PRM-VEN-025 | `ven.quote.validateActiveServices` | Enum `off/warn/block` | tenant | `off` | Validar servicios activos | #2395 |
| PRM-VEN-026 | `ven.quote.validateConnectionAndCloseIfDebt` | Enum `off/warn/block` | tenant | `off` | Validar conexión y cerrar si tiene deuda | #3009 |
| PRM-VEN-027 | `ven.quote.blockingPropertyCode` | Ref propiedad | tenant | — | Propiedad personalizada para no cargar presupuestos | #2901 |
| PRM-VEN-028 | `ven.quote.validateDebt` | Enum `off/warn/block` | tenant | `warn` | Validar deuda y vencimiento | #2381 |
| PRM-VEN-029 | `ven.quote.debtDueDateToConsider` | Enum `due1..due4` | tenant | `due1` | Vencimiento a considerar | #2600 |
| PRM-VEN-030 | `ven.quote.alertInAttention` | Boolean | tenant | `true` | Alertar en atención el presupuesto pendiente | #2398 |
| PRM-VEN-031 | `ven.quote.allowImportToMaterialVoucher` | Boolean | tenant | `false` | Importar productos del presupuesto al vale de materiales | #2899 |
| PRM-VEN-032 | `ven.quote.feasibilityBillingMethod` | Enum `manualInvoice/materialsSale` | tenant | `manualInvoice` | Facturación de presupuestos de factibilidad | #2348 |
| PRM-VEN-033 | `ven.quote.uniquePerProductAccount` | Boolean | tenant | `true` | Unicidad por cuenta y producto | RN-08 §15.3 |
| PRM-VEN-034 | `ven.quote.crmCaseType` | Object `{type, subtype, priority, status}` | tenant | Tipo "Presupuesto" | Caso creado al aceptar | RN-08 §15.3 |
| PRM-VEN-035 | `ven.quote.autoCreateWorkOrder` | Enum `off/offer/auto` | tenant | `offer` | Crear OT al aceptar | DFA M13 |
| PRM-VEN-036 | `ven.quote.executionTolerancePct` | Decimal | tenant | 5 | Tolerancia ejecutado vs aceptado | DFA M13 mejora |
| PRM-VEN-037 | `ven.quote.expiryReminderDays` | Integer | tenant | 3 | Aviso antes del vencimiento | — (mejora) |
| PRM-VEN-038 | `ven.acceptance.channels` | Set `pwa/publicLink` | tenant | ambos | Canales de aceptación online | PA-VEN-05 |
| PRM-VEN-039 | `ven.acceptance.linkTtlDays` | Integer | tenant | igual a validez | Vigencia del enlace firmado | PA-VEN-05 |
| PRM-VEN-040 | `ven.acceptance.requireOtp` | Boolean | tenant | `true` | OTP para enlace público | PA-VEN-05 |
| PRM-VEN-041 | `ven.acceptance.requireAdvancePct` | Decimal | tenant | 0 | Anticipo exigido al aceptar | DFA M13 |

### 14.3 Campo (PMovil)

| ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 |
|---|---|---|---|---|---|---|
| PRM-VEN-045 | `ven.field.sendQuotes` | Boolean | tenant | `false` | Enviar presupuesto a la app de campo | #2380 |
| PRM-VEN-046 | `ven.field.fixedPointOfSaleId` | Ref punto de venta | tenant | — | Punto de venta fijo para presupuestos de campo | #2383 |
| PRM-VEN-047 | `ven.field.autoSync` | Boolean | tenant | `true` | Sincronizar ventas y presupuestos automáticamente | #2386 |
| PRM-VEN-048 | `ven.field.pdfStorage` | Ref almacenamiento | tenant | Almacenamiento de documentos | Destino de PDF de facturas contado de campo (ProCoop: ruta de disco) | #2589 |
| PRM-VEN-049 | `ven.field.invoiceTypeWithQuote` | Ref tipo comprobante | tenant | — | Factura para ventas con presupuesto | #2592 |
| PRM-VEN-050 | `ven.field.invoiceDueDays` | Integer | tenant | 10 | Días de vencimiento de facturas de campo | #2593 |
| PRM-VEN-051 | `ven.field.invoiceTypeWithoutQuote` | Ref tipo comprobante | tenant | — | Factura para ventas sin presupuesto | #2641 |
| PRM-VEN-052 | `ven.field.bulkQuotes` | Boolean | tenant | `false` | Presupuestos a granel | VAR_PMOVIL 25 |
| PRM-VEN-053 | `ven.field.bulkCoefficient` | Decimal | tenant | 1 | Coeficiente multiplicador a granel | VAR_PMOVIL 26 |
| PRM-VEN-054 | `ven.field.publishInvoiceInSelfService` | Boolean | tenant | `true` | Publicar comprobante en autogestión | VAR_PMOVIL 52 |
| PRM-VEN-055 | `ven.field.autoMessageChannel` | Enum `none/sms/whatsapp` | tenant | `none` | Mensaje automático al cliente | VAR_PMOVIL 53 |

### 14.4 Ventas, POS y vendedores

| ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 |
|---|---|---|---|---|---|---|
| PRM-VEN-060 | `ven.salesClosingDate` | — (reemplazado) | tenant | — | Fecha de cierre de ventas → entidad unificada de períodos (T04/M15) | #67 |
| PRM-VEN-061 | `ven.stockIssueOn` | Enum `confirm/delivery` | tenant | `delivery` | Momento del egreso de stock | #77 (PA-VEN-06) |
| PRM-VEN-062 | `ven.settlement.byCollections` | Boolean | tenant | `false` | Rendición de comprobantes según cobranzas **[VERIFICAR]** | #76 |
| PRM-VEN-063 | `ven.creditSettlementTemplate` | Ref plantilla | tenant | estándar | Informe de liquidación de crédito | #312 |
| PRM-VEN-064 | `ven.printCreditSettlementFromSale` | Boolean | tenant | `false` | Imprimir liquidación de crédito desde la venta | #2272 |
| PRM-VEN-065 | `ven.printInvoiceFromSale` | Boolean | tenant | `true` | Imprimir factura desde la venta | #2273 |
| PRM-VEN-066 | `ven.showItemAmountsInReport` | Boolean | tenant | `true` | Mostrar importes de ítems en el reporte de la venta | #2246 |
| PRM-VEN-067 | `ven.waitForCae` | Boolean | tenant | `true` | Aguardar CAE antes de dar por emitida | #727 |
| PRM-VEN-068 | `ven.cashDiscountConceptId` | Ref concepto | tenant | — | Descuento contado o 1 cuota | #2247 |
| PRM-VEN-069 | `ven.discountConceptId` | Ref concepto | tenant | — | Descuento en ventas y facturas | #2564 |
| PRM-VEN-070 | `ven.exchangeDiffProductId` | Ref producto | tenant | — | Diferencia de cotización | #2289 |
| PRM-VEN-071 | `ven.alwaysOfficialReceipt` | Boolean | tenant | `false` | Recibo oficial siempre en operaciones de caja | #2452 |
| PRM-VEN-072 | `ven.skipBillingGroupValidation` | Boolean | tenant | `true` | No validar grupos de facturación en venta de productos | #2519 |
| PRM-VEN-073 | `ven.quickSale.defaultAccountId` | Ref cuenta | pos | — | Cuenta por defecto en venta rápida | #1007 |
| PRM-VEN-074 | `ven.quickSale.defaultSalesRepId` | Ref vendedor | pos | — | Vendedor por defecto | #1008 |
| PRM-VEN-075 | `ven.quickSale.skipSalesRepValidation` | Boolean | tenant | `true` | Saltar validación de vendedor | #3053 |
| PRM-VEN-076 | `ven.quickSale.lockInstallmentType` | Boolean | tenant | `false` | Impedir modificar el tipo de cuota | #2678 |
| PRM-VEN-077 | `ven.cashRoundingSalesRepId` | Ref vendedor | tenant | — | Vendedor para redondeo en cobranza en efectivo (lo usa M07) | #3069 |
| PRM-VEN-078 | `ven.salesRep.required` | Boolean | tenant | `false` | Vendedor obligatorio | PA-VEN-10 |
| PRM-VEN-079 | `ven.creditRisk.mode` | Enum `off/warn/block` | tenant | `warn` | Validación de riesgo | RN-08; PA-VEN-11 |
| PRM-VEN-080 | `ven.creditRisk.limitDefault` | Decimal | tenant | 0 (sin límite) | Límite por defecto por cuenta | INV `FormasPago` |
| PRM-VEN-081 | `ven.company.ownTransportData` | Ref datos de empresa (T01) | tenant | — | Datos de la empresa (razón social, CUIT, calle, número, barrio) para transporte propio y documentos | #518–#522 |
| PRM-VEN-082 | `ven.pos.printMode` | Enum `browser/agent` | pos | `browser` | Impresión de tickets | FIC 19 |
| PRM-VEN-083 | `ven.pos.requireOpenSession` | Boolean | pos | `true` | Exigir sesión abierta para vender | — (mejora) |

### 14.5 Financiación comercial, cuotas y anticipos

| ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 |
|---|---|---|---|---|---|---|
| PRM-VEN-090 | `ven.installmentInvoiceConceptId` | Ref concepto | tenant | — | Concepto "factura en cuotas" | #403 |
| PRM-VEN-091 | `ven.installmentInvoiceWithInterestDocType` | Ref tipo comprobante | tenant | — | Tipo de comprobante para factura en cuotas con intereses | #733 |
| PRM-VEN-092 | `ven.installmentInvoiceFiscalCredit` | Boolean | tenant | `false` | Generar crédito fiscal en factura en cuotas | #2930 |
| PRM-VEN-093 | `ven.financeInterestConceptId` | Ref concepto | tenant | — | Interés del comprobante de venta | #2089 |
| PRM-VEN-094 | `ven.stampTaxConceptId` | Ref concepto | tenant | — | Sellado (compartido con convenios de M08) | #676 |
| PRM-VEN-095 | `ven.installmentInMonthlyInvoiceConceptId` | Ref concepto | tenant | — | Concepto de cuota en factura mensual (solo inclusión válida) | #308 |
| PRM-VEN-096 | `ven.financingDebtConceptId` | — (de M08) | tenant | — | Deuda de financiación: pertenece a M08 | #310 |
| PRM-VEN-097 | `ven.billOnlyInstallmentsWithServices` | — (reemplazado) | tenant | — | "No facturar cuotas sin servicios": reemplazado por documento propio | #2443 |
| PRM-VEN-098 | `ven.separateFinancedInVatBook` | Boolean | tenant | `false` | Separar ítems financiados en libro IVA ventas (lo aplica M06) | #2972 |
| PRM-VEN-099 | `ven.installments.lookbackMonths` | Integer | tenant | 10 | Meses hacia atrás al seleccionar cuotas | RN-02 §2.3 |
| PRM-VEN-100 | `ven.earlyPayoff.policy` | Enum | tenant | `waiveUnaccruedInterest` | Quita de interés no devengado | BASE §23 |
| PRM-VEN-101 | `ven.advanceConceptId` | Ref concepto | tenant | — | Concepto para anticipo | #29 |
| PRM-VEN-102 | `ven.productAdvanceInstallmentType` | Ref tipo de cuota | tenant | — | Tipo de cuota para anticipo de productos | #2409 |
| PRM-VEN-103 | `ven.productAdvanceDeductFuture` | Boolean | tenant | `false` | Indicar si el anticipo se descuenta de facturación futura | #3008 |
| PRM-VEN-104 | `ven.productAdvanceInMassBilling` | Boolean | tenant | `false` | Usar anticipos de productos en la masiva | #3038 |
| PRM-VEN-105 | `ven.financing.showCftTea` | Boolean | tenant | `true` | Mostrar CFT y TEA | RN-VEN-052 |

Referencia sin parámetro propio: #606 (concepto de interés por mora) pertenece a M08 y no se usa para interés de financiación comercial.

## 15. Reportes

| Código | Reporte | Fórmula / contenido | Universo | Fecha de corte (AGR-022) |
|---|---|---|---|---|
| REP-VEN-01 | Cargos por operación | Σ `amount − discountAmount` por estado, tipo y servicio | Cargos no anulados del período del hito | `effectiveDate` |
| REP-VEN-02 | Presupuestos por estado y vendedor | Cantidad e importe (versión vigente) por estado | Presupuestos creados en el período | `createdAt` |
| REP-VEN-03 | Conversión de presupuestos | Aceptados / enviados; tiempo medio envío → aceptación | Enviados en el período | `sentAt` |
| REP-VEN-04 | Presupuesto (documento) y notas | Ítems, conjuntos, prorrateos, condiciones, notas | Un presupuesto | Versión |
| REP-VEN-05 | Ventas de productos | Σ neto, IVA, total por producto, rubro, servicio, sucursal, vendedor, forma de pago | Ventas confirmadas no anuladas | `operationDate` |
| REP-VEN-06 | Detalle de ventas | Ventas con concepto "factura en cuotas" informadas como exento/excluido (P403) | Comprobantes de venta del período | Fecha del comprobante |
| REP-VEN-07 | Facturado no entregado | Σ `pendingDeliveryQty` por producto y depósito | Ventas `invoiced` con pendientes | Fecha de consulta |
| REP-VEN-08 | Cuotas facturadas y pendientes | Capital, interés, IVA por estado y vencimiento | Cuotas no anuladas | `dueDate` |
| REP-VEN-09 | Comprobantes no facturados | Ventas/presupuestos para facturar sin comprobante | Estado `toInvoice`/`confirmed` | Fecha de consulta |
| REP-VEN-10 | Devoluciones | Cantidad e importe por motivo | Devoluciones completadas | `returnedAt` |
| REP-VEN-11 | Liquidación de crédito | Capital, interés, tasa, TEA, CFT, cronograma | Una venta financiada | Fecha de venta |
| REP-VEN-12 | Rendición de viajes | Km, flete real, precio por km = flete / km, peajes, viáticos, combustible | Rendiciones confirmadas | `date` |
| REP-VEN-13 | Arqueo de POS | Ventas y cobros por medio vs contado; diferencia | Sesiones cerradas | `closedAt` |
| REP-VEN-14 | Ventas y presupuestos por vendedor | Cantidad, importe, conversión, devoluciones | Operaciones del período | Fecha de operación |
| REP-VEN-15 | Cartera de cuotas comerciales | Capital pendiente por antigüedad; separado de convenios M08 | Cuotas `scheduled`/`billed` | Fecha de corte elegida |

Todos los reportes concilian con M05 (comprobantes) y M07 (cobros) a la misma fecha de corte y se exponen a T10.

## 16. Casos de uso

### CU-23 — Venta de producto financiada en cuotas (BASE §23)

- **Actor:** vendedor; **sistema:** M11, M13, M05, M07.
- **Precondición:** TEN-001 con artículo ART-ROU-01 (router) en stock, precio ARS 90.000, plan "3 cuotas sin interés".
- **Flujo:** 1) el vendedor registra la venta VEN-001 a la cuenta de prueba; 2) M13 confirma disponibilidad y reserva; 3) elige el plan y ve la simulación (3 × ARS 30.000, TEA 0, CFT 0); 4) confirma; M05 emite según el modelo fiscal (PA-VEN-02); 5) entrega del equipo con serie (egreso M13); 6) las cuotas se facturan por corrida en documento propio y se presentan en el resumen; 7) M07 registra los cobros y las cuotas pasan a `paid`.
- **Excepción:** devolución tras la cuota 1 cobrada: reingreso al depósito, NC, cuotas 2 y 3 `voided`, cuota 1 queda como saldo a favor o devolución.
- **Resultado:** venta, entrega, cuotas, facturas y cobros vinculados; ninguna cuota viaja en la factura de Internet.

### CU-PRO-01 — Instalación financiada en el piloto (BASE §72)

- **Definición dueña:** M02 «CU-PRO-01 (BASE) — Contratar Internet (piloto)». Aquí solo el tramo de ventas (cargo de instalación y su financiación).
- **Flujo:** contratación de Internet con instalación ARS 20.000 financiada en 2 cuotas de ARS 11.000 (10.000 de capital + 1.000 de interés cada una); al confirmar la OT nace un único cargo; se generan 2 cuotas vinculadas al servicio INT; la alternativa contado queda anulada.
- **Resultado:** la cuota 1 viaja en la primera factura de Internet (concepto vinculado y validado) o en documento propio si el tenant no validó la inclusión.

### CU-INS-01 — Primer cobro con instalación (BASE §73, compartido con M04/M05)

- **Definición dueña:** M10 «CU-INS-01 (BASE §73, parte técnica) — Instalación integral». Aquí solo el aporte de ventas al primer cobro.
- **Flujo:** M11 aporta el cargo INS-INT de ARS 30.000 (contado) a la simulación; con prorrateo y promoción el primer cobro es ARS 30.500; sin prorrateo, ARS 35.000. Una visita fallida no genera cargo. Los importes son los del ejemplo de BASE §73 y valen solo para este caso; el *seed* demo usa INS-INT ARS 20.000 (M02 §18, HUE-SRV-05; ver CTR-TAR-30 de M04).

### CU-VEN-01 — Presupuesto con aceptación online y flujo continuo

- **Actor:** vendedor, socio, técnico.
- **Flujo:** 1) el vendedor crea un presupuesto de ampliación de red interna con un conjunto "Materiales" y otro "Mano de obra"; 2) lo envía por email con enlace; 3) el socio abre el enlace, recibe OTP y acepta la versión 1; 4) se crea el caso CRM y la OT con los materiales reservados; 5) el técnico ejecuta y reporta un 3 % más de cable (dentro de tolerancia 5 %); 6) el presupuesto pasa a `toInvoice` y se factura lo aceptado (precio cerrado); 7) el socio recibe la factura.
- **Excepciones:** versión vencida → el enlace informa y ofrece pedir actualización; consumo 12 % mayor → aprobación del supervisor o del socio antes de facturar la diferencia.

### CU-VEN-02 — Venta en POS de mostrador

- **Flujo:** el cajero abre sesión con fondo ARS 10.000; vende un cable y un conector a consumidor final (cuenta por defecto); cobra con tarjeta de débito; se emite factura electrónica y ticket; al cierre, el arqueo cuadra por medio.
- **Excepción:** sin conexión con ARCA, la venta queda pendiente de emisión y no se entrega como facturada si P727 está activo.

### CU-VEN-03 — Reconexión con cargo (O6)

- **Flujo:** M08 decide reconectar una cuenta con deuda regularizada; M10 confirma la OT; M11 genera el cargo de reconexión (concepto de M04) a la próxima factura del servicio y, si P2483 está activo, un crédito por los días desconectados.

### CU-VEN-04 — Modificación masiva de cuotas

- **Flujo:** el administrativo aumenta 10 % las cuotas pendientes de un producto; ve la vista previa (cantidad, importe actual, nuevo), confirma con motivo; el job actualiza, deja nota en cada cuenta y movimiento de ajuste.
- **Excepción:** cuotas ya facturadas quedan excluidas y se informan.

### CU-VEN-05 — Presupuesto en campo

- **Flujo:** el técnico, sin señal, arma un presupuesto con productos habilitados para campo, el socio firma en pantalla; al sincronizar se crea una única vez y, si se factura en campo, se usa el tipo P2592 y se publica en autogestión.

## 17. Criterios de aceptación y escenarios de prueba

### 17.1 Criterios generales

1. Cada RF de la sección 5 cumple su criterio de aceptación.
2. **Permisos negativos:** un vendedor sin `ven.presupuestos.anular` recibe 403 al anular; un cajero no puede modificar cuotas; un socio no ve presupuestos de cuentas sin relación autorizada; un enlace público no da acceso a otro presupuesto.
3. **Aislamiento por tenant:** consultas, exportaciones, API externas, eventos y jobs filtran por `tenantId`; pruebas cruzadas TEN-001/TEN-002 sin fuga.
4. **Reintentos e idempotencia:** reprocesar `tec.workOrder.closed` (EVT-TEC-07) no duplica el cargo; reenviar POST con el mismo Idempotency-Key devuelve el mismo recurso; sincronizar dos veces desde campo no duplica.
5. **Concurrencia:** dos usuarios editando el mismo presupuesto → el segundo recibe 412 (`If-Match`).
6. **Períodos:** operación en período cerrado → error `ven/period-closed`.
7. **Redondeo:** suma de cuotas = total financiado; prorrateo = importe a repartir.
8. **Auditoría:** toda transición, override y acción masiva registra usuario, fecha, valor anterior y nuevo.

### 17.2 Escenarios

| ID | Escenario | Resultado esperado |
|---|---|---|
| ESC-VEN-01 | Instalación financiada CU-PRO-01 | 1 cargo, 2 cuotas de ARS 11.000, sin ítem contado |
| ESC-VEN-02 | Cuota de router (no vinculada) en ciclo de Internet | Documento propio; la factura de Internet no contiene la cuota |
| ESC-VEN-03 | Concepto vinculado sin validación fiscal | No se incluye; documento propio y alerta de configuración |
| ESC-VEN-04 | Evento de OT duplicado | Un solo cargo |
| ESC-VEN-05 | Visita fallida | Ningún cargo |
| ESC-VEN-06 | Aceptación de versión reemplazada | Error `ven/quote-version-superseded` |
| ESC-VEN-07 | Presupuesto duplicado misma cuenta y producto | Bloqueo con enlace al existente |
| ESC-VEN-08 | Aprobar presupuesto anulado (defecto ProCoop) | Error `ven/invalid-transition` |
| ESC-VEN-09 | Venta de serie instalada en un suministro | Error `ven/serial-not-available` |
| ESC-VEN-10 | Riesgo excedido en modo `block` | Venta en `pendingApproval`; override con permiso |
| ESC-VEN-11 | Devolución CU-23 con cuota 1 cobrada | Cuotas 2–3 anuladas; saldo a favor |
| ESC-VEN-12 | Descuento contado con IVA | IVA sobre neto con descuento |
| ESC-VEN-13 | Modificación masiva de sobretasa | Usa la tasa de sobretasa, no la general |
| ESC-VEN-14 | Importación de terceros con cuotas | Numeración sin huecos |
| ESC-VEN-15 | Rendición con transporte propio | Valor distinto de "sin asignar"; precio/km = flete/km |
| ESC-VEN-16 | Cierre de POS con diferencia | Diferencia registrada; sesión `closed` hasta conciliar |
| ESC-VEN-17 | Cancelación anticipada de 2 cuotas | Quita de interés no devengado según plan |
| ESC-VEN-18 | Usuario de TEN-002 consulta presupuesto de TEN-001 por API | 404 |

Escenarios BASE: ESC-01 a ESC-05 de la guía aplican en lo que toca a M11 (alta piloto con instalación, primera factura, cobro, mora y reconexión).

## 18. Precarga ficticia

Datos ficticios para TEN-001 (no se transcriben datos de la DEMO):

| Elemento | Valor |
|---|---|
| Conceptos | INS-INT "Instalación Internet" ARS 20.000, valor del *seed* único de M02 §18 (HUE-SRV-05; antes ARS 30.000, de BASE §39.3) (disparador `installationConfirmed`, vinculado a INT, validación fiscal registrada); CON-INT "Derecho de conexión" ARS 20.000; REC-INT "Reconexión" ARS 5.000; CUO-VEN "Cuota de venta" (no vinculado) |
| Planes | FIN-3SI "3 cuotas sin interés"; FIN-2INS "2 cuotas instalación" (tasa que da 2 × ARS 11.000 sobre ARS 20.000); FIN-6FR "6 cuotas francés" con TEA de ejemplo |
| Artículos | ART-ROU-01 Router Wi-Fi ARS 90.000 (serializado, 5 unidades en depósito DEP-01); ART-CAB-01 Cable UTP por metro ARS 800; ART-CON-01 Conector RJ45 ARS 300 |
| Vendedores | VND-01 "Vendedor Demo Uno" (sucursal central); VND-02 "Vendedor Demo Dos" |
| Condiciones de venta | CND-01 "Contado contra entrega"; CND-02 "Validez 15 días"; CND-03 "Garantía 6 meses" |
| Presupuestos | PRE-0001-00000001 (borrador), PRE-0001-00000002 (enviado), PRE-0001-00000003 (aceptado con OT), PRE-0001-00000004 (vencido) |
| Ventas | VEN-001 (CU-23, 3 cuotas de ARS 30.000); VEN-002 venta POS contado |
| Terminal POS | POS-01 sucursal central, lista LST-MOST, caja CJ-01 |
| Lista de precios | LST-MOST (mostrador), LST-CAMPO (campo) |
| Regla | DSC-01: 5 % de descuento en ART-CAB-01 con pago contado y sin deuda vencida > 30 días |
| Cuenta | Cuenta de prueba "Socio Demo" con servicio INT activo (M01) |

## 19. Migración

| Tabla ProCoop | Destino CoopApps | Transformación | Validación de conciliación |
|---|---|---|---|
| `PRESUPU` | `salesQuotes` (cabecera, versión 1) | Estados: vacío→`draft`, E→`sent` (o `expired` si `FEC_VAL` < fecha de migración), O→`accepted`, R→`rejected`, P→`toInvoice`, F→`invoiced`, A→`cancelled`; `COD_SOC`/`COD_SUM` → `accountId`/`contractId` por tabla de mapeo | Cantidad y total por estado |
| `PRESUIT` | `salesQuotes.versions[0].items` | Descripción completa si existe; `CAN_PEN` → `pendingQty` | Σ ítems = total cabecera |
| `PRESUIT_CONJUNTOS` | `versions[0].groups` | `ITEM` → `groupId` | Cantidad de conjuntos |
| `PRESUPU_CONDICION` | `salesConditions` + `conditionIds` | Código preservado | — |
| `PRESUPU_NOTAS` | `salesQuotes.notes` | Usuario mapeado o "migrado" | Cantidad |
| `PRESUPU_COMPROBANTES` | `salesQuotes.generatedDocuments` | Referencias a facturas migradas por M05 | Todas las referencias resuelven |
| `COMP_VEN`, `IT_COMPV`, `OB_COMPV` | `salesOrders` (`kind: imported`) | `CAN_PEN` → `pendingDeliveryQty`; estados; `ID_OBS` → observaciones; transporte | Σ por período = libro de ventas de M05 |
| `COMP_VEN_RENDICION`, `_ITEMS` | `tripSettlements` de M18 con `source.kind = salesDocument` (antes `freightSettlements`; CTR-DAT-53) | Tipos de flete corregidos (sin asignar/propio/tercero) | Σ flete real |
| `VENDEDOR` | `salesReps` + persona de M01 (DEC-097) | `COD_VEN` preservado como `code`; `NOM_RAZ`, domicilio (`COD_CAL`, `DOM_*`, `COD_BAR`, `COD_PRO`, `COD_LOC`), `DOM_TEL`, `DOM_FAX` y `CELULAR` no se copian a la ficha: T07 vincula el vendedor a una persona existente o la crea con las reglas de unificación del padrón (si coincide con un titular, empleado o proveedor, se reutiliza esa persona). Si la fila no trae documento, la persona nueva queda `documentPending` (DEC-099, M01) | Cantidad; vendedores sin `personId` = 0 |
| `DEUDAVTA` + `IVAVTA` | `salesInstallments` (solo origen venta/cargo) | Separación por origen: cuotas de financiación de deuda → M08; `TPCUOTA` → `kind`; `ID_FAC` → `invoiceId` | Σ capital pendiente por cuenta = saldo ProCoop |
| `MAQUINAS` | `salesOrders.soldEquipment` + ficha serializada de M13 | Parte comercial en M11; reparación en M13 | Cantidad |
| `CMPORDE` | Vínculo `salesOrders.workOrderId` | Por `COD_SOL` y `ID_COMPV` | Toda venta con OT resuelve |
| `PRCAGAS` (pendientes) | `billableItems` pendientes de M05 (CTR-DAT-38; antes `operationCharges` `valued`/`scheduled`) | Solo pendientes no facturados; `operationCharges` nace en CoopApps sin origen migrado | Σ pendientes |
| `COMPPOS`, `DESCPOS`, `TEL_POS_REG_*` | No migra en M11 (M05, M04, M10) | — | — |

Reglas: IDs compuestos de ProCoop se guardan en el subdocumento `legacy` (T05 §19.1; antes `legacyRef`, CTR-DAT-32) y en `legacyIdMap` (T07); migración repetible e idempotente; no se migran presupuestos anulados con más de N años si el tenant lo decide (T07); conciliación firmada antes del paralelo.

## 20. Contraposiciones resueltas

| ID | Fuentes | Conflicto | Resolución | Regla de prevalencia |
|---|---|---|---|---|
| CTR-VEN-01 | MER-010, BASE §52/§70 vs RN-09 #308, RN-02 §2.5 | ProCoop factura cuotas de ventas dentro de la factura mensual del servicio; BASE exige documentos propios salvo conceptos vinculados | Documento propio por defecto; inclusión solo vinculado + validación fiscal | BASE/MER > RN |
| CTR-VEN-02 | DFA M13 vs CAT | DFA asocia a "POS" las tablas `COMPPOS`, `DESCPOS`, `TEL_POS_REG_*`, que en CAT son numeración por punto de venta, descuentos y regleta telefónica | Se asignan a M05, M04 y M10; el POS de mostrador es nuevo en M11 | CAT (testigo de datos) aclara DFA; BASE §2 define el POS |
| CTR-VEN-03 | `DEUDAVTA` vs BASE §23 | ProCoop mezcla cuotas de ventas y financiaciones de deuda | Se separan por origen en la migración (M11 / M08) | BASE > CAT |
| CTR-VEN-04 | RN-08 §15.3 vs AGR-003 | `AprobarPresupuesto` cambia estado sin validar el origen | Transiciones explícitas con validación | AGR > RN |
| CTR-VEN-05 | BASE §52 (no mezclar conceptos ajenos) vs DFA M13 (derechos de conexión con el servicio) | ¿Se puede cobrar el derecho de conexión en la factura del servicio? | Sí, porque es concepto vinculado al servicio; requiere validación fiscal | BASE (MER-010 explícito) |
| CTR-VEN-06 | RN-09 #2443 vs MER-010 | "No facturar cuotas sin servicios" impide cuotas en documento propio | Reemplazado: cuotas en documento propio | BASE > RN |
| CTR-VEN-07 | RN-09 #1008/#3053 vs PA-VEN-10 | Vendedor por defecto obligatorio en ProCoop | Opcional por configuración (PA-VEN-10) | A validar |
| CTR-VEN-08 | DFA (compras) vs CAT §14 | `CMPORDE` figura en compras, pero vincula OT con comprobantes de venta | Pertenece a M11 | CAT > DFA |
| CTR-VEN-09 | CAT `MAQUINAS` vs M13 | Mezcla equipos vendidos y en reparación | Parte comercial M11; reparación/RMA M13 | BASE §19/§23 (límites) |
| CTR-VEN-10 | RN-08 §15.3 (`GenerarTicket` con gravedad y estado fijos) vs CNX/BASE (configurable) | Valores fijos en código | Configurables por tenant (PRM-VEN-034) | BASE > RN |
| CTR-VEN-11 | RN-08 §7.7 vs RN-08 §15.3 | Primera pasada describe menos estados y transiciones que la segunda | Prevalece la segunda pasada, más detallada | Fuente más reciente/detallada |
| CTR-VEN-12 | RN-02 §16 (rendición: propio y sin asignar valen 0) vs negocio | Defecto de enumeración | Valores distintos | Corrección de deuda técnica (guía §2.5) |
| CTR-VEN-13 | RN-02 (IVA del ítem con descuento sobre neto sin descuento) vs normativa | Defecto de cálculo | IVA sobre neto con descuento | Corrección de deuda técnica |
| CTR-VEN-14 | RN-09 #2589 (ruta de disco) vs DEC-004 | Archivos en disco local | Almacenamiento de documentos del tenant | DEC > RN |
| CTR-VEN-15 | RN-09 #67 (fecha de cierre por parámetro) vs AGR/T04 | Cierre por variable suelta | Entidad unificada de períodos | AGR > RN |
| CTR-VEN-16 | `freightSettlements` (M11) vs `tripSettlements` (M18) | Dos colecciones para la rendición de un viaje | `tripSettlements` de M18 con `source.kind = salesDocument` | CTR-DAT-53 |
| CTR-VEN-17 | `PRCAGAS` → `operationCharges` (M11) vs `billableItems` (M05) | Destino de los cargos pendientes migrados | `billableItems` pendientes de M05; `operationCharges` sin origen migrado | CTR-DAT-38 (M05 es dueño de lo a facturar) |
| CTR-VEN-18 | Nombres de campo de M11 (`serviceContractId`, `legacyRef`) vs T05 §7.2 y §19.1 | Nombres divergentes para el contrato y para la clave de origen. | `contractId` y subdocumento `legacy`; los nombres viejos quedan solo en las notas de alias. | CTR-DAT-30, CTR-DAT-32 |
| CTR-VEN-19 | CAT `VENDEDOR` (nombre, domicilio y teléfonos propios) y §7.9 anterior vs RN-PER-001 (M01) y DEC-097 | El vendedor tenía identidad propia, separada de la persona; un socio o empleado que vende quedaba en dos fichas. | `salesReps.personId` obligatorio con alta asistida de M01; la ficha guarda solo datos del rol (RF-VEN-100, §7.9, §7.14.8, PAN-VEN-16, §19). | DEC-097 > CAT |

## 21. Preguntas abiertas

### PA-VEN-01 — Inclusión de cuotas no vinculadas en la factura del servicio

- **Pregunta:** ¿Se permite, por excepción configurable, incluir cuotas de ventas no vinculadas (por ejemplo, router) en la factura del servicio, como hace ProCoop?
- **Contexto:** MER-010 y BASE §52/§70 restringen la inclusión a conceptos vinculados; ProCoop lo hace en general (P308).
- **Opciones:** A) (Recomendada) No: solo conceptos vinculados y validados; el resto en documento propio presentado junto en el resumen. B) Permitir por tenant con validación fiscal documentada. C) Permitir siempre como ProCoop.
- **Impacto si no se responde:** se aplica A; tenants que hoy cobran ventas en la factura deberán comunicar el cambio.
- **Bloquea:** RF-VEN-007, RF-VEN-084, RN-VEN-004.

### PA-VEN-02 — Modelo fiscal de la venta en cuotas

- **Pregunta:** ¿La venta financiada se factura por el total al vender (con "factura en cuotas" y crédito fiscal) o se factura cada cuota?
- **Contexto:** ProCoop admite ambos (P403, P2930, P733); impacta IVA, percepciones y libro IVA.
- **Opciones:** A) (Recomendada) Configurable por plan/concepto, default "factura total al vender" con cuotas como cronograma de cobro. B) Siempre factura por cuota. C) Siempre factura total.
- **Impacto si no se responde:** se implementa A con default; validación del contador del tenant.
- **Bloquea:** RF-VEN-058, RF-VEN-059, RN-VEN-026, CU-23 paso 4.

### PA-VEN-03 — Comisiones de vendedores

- **Pregunta:** ¿Se requiere liquidar comisiones de vendedores?
- **Contexto:** Ninguna fuente lo pide; es práctica de mercado.
- **Opciones:** A) (Recomendada) No en O8; solo informe por vendedor; evaluar en O11. B) Comisiones por porcentaje sobre cobrado en O8. C) Integración con sueldos (M16).
- **Impacto si no se responde:** solo REP-VEN-14.
- **Bloquea:** RF-VEN-103.

### PA-VEN-04 — Comprobantes en POS

- **Pregunta:** ¿El POS emite factura electrónica o requiere controlador fiscal?
- **Contexto:** BASE §2 menciona POS; el mercado usa factura electrónica con ticket no fiscal; los controladores fiscales requieren hardware homologado.
- **Opciones:** A) (Recomendada) Factura electrónica (M05) + ticket no fiscal/representación impresa. B) Soporte de controladores fiscales vía agente (O10). C) Ambos.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-VEN-104, RF-VEN-105.

### PA-VEN-05 — Identificación en la aceptación online

- **Pregunta:** ¿Qué nivel de verificación exige la aceptación online?
- **Contexto:** El presupuesto puede dirigirse a socios o prospectos; la aceptación tiene valor contractual.
- **Opciones:** A) (Recomendada) Usuario autenticado de la PWA con relación sobre la cuenta, o enlace firmado + OTP al contacto registrado. B) Solo usuario autenticado. C) Enlace sin OTP.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-VEN-032, RN-VEN-047, PAN-VEN-05.

### PA-VEN-06 — Momento del egreso de stock

- **Pregunta:** ¿El stock egresa al confirmar la venta o al entregar?
- **Contexto:** ProCoop: P77 "mover stock al registrar venta".
- **Opciones:** A) (Recomendada) Reserva al confirmar y egreso en la entrega; en POS al emitir. B) Egreso al confirmar. C) Por depósito.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-VEN-054, RN-VEN-020.

### PA-VEN-07 — Alcance de la rendición de viajes y fletes

- **Pregunta:** ¿Cuántas cooperativas usan la rendición de fletes y combustible de ventas?
- **Contexto:** Funcionalidad de nicho con defectos en ProCoop.
- **Opciones:** A) (Recomendada) Extensión en O8, activable por tenant. B) Núcleo. C) Descartar.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-VEN-107.

### PA-VEN-08 — Momento de facturación de la instalación del piloto

- **Pregunta:** ¿La instalación contado se factura en la primera factura del ciclo o inmediatamente al confirmar la OT?
- **Contexto:** BASE §73 deja ambos caminos.
- **Opciones:** A) (Recomendada) En la primera factura del ciclo tras la OT confirmada (concepto vinculado). B) Factura inmediata propia. C) Configurable por concepto (default A).
- **Impacto si no se responde:** C con default A.
- **Bloquea:** RF-VEN-005, §9.1, CU-INS-01.
- **Estado:** Respondida (DEC-016): opción A, en la primera factura del ciclo posterior a la OT confirmada.

### PA-VEN-09 — Presupuesto obligatorio para conexiones del piloto

- **Pregunta:** ¿Toda conexión del piloto debe pasar por presupuesto aceptado?
- **Contexto:** El alta del piloto ya usa solicitud y simulación (M09).
- **Opciones:** A) (Recomendada) No; solo para obras/instalaciones especiales. B) Sí, siempre. C) Configurable por servicio.
- **Impacto si no se responde:** A.
- **Bloquea:** §9.1, §9.3.

### PA-VEN-10 — Vendedor obligatorio

- **Pregunta:** ¿El vendedor es obligatorio en ventas y presupuestos?
- **Contexto:** ProCoop usa vendedor por defecto (P1008) con validación (P3053).
- **Opciones:** A) (Recomendada) Opcional con default por terminal/canal; obligatorio si el tenant lo activa. B) Siempre obligatorio. C) No usar vendedores.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-VEN-101, RN-VEN-035.

### PA-VEN-11 — Validación de deuda y riesgo

- **Pregunta:** ¿La deuda vencida o el riesgo excedido bloquean o advierten?
- **Contexto:** P2381/P2600 y riesgo crediticio en ProCoop.
- **Opciones:** A) (Recomendada) Advertencia por defecto con override auditado; bloqueo configurable. B) Bloqueo siempre. C) Sin validación.
- **Impacto si no se responde:** A.
- **Bloquea:** RF-VEN-028, RF-VEN-057, RN-VEN-014, RN-VEN-022.

### PA-VEN-12 — Residuales de los entregables: referencias, estados y API reemplazadas (5-11-2026)
- **Pregunta**: ¿Qué destino tienen las referencias que los entregables marcaron sin colección en M11 (§7.15), qué transiciones tienen entregas y devoluciones, y qué API de M05 reemplaza a API-VEN-006 y API-VEN-007?
- **Contexto**: residuales de `docs/entregables-analisis-diseno/03-er/M11-VEN-ventas-presupuestos.md` §7, de `06a-indice-cobertura-secuencias-estados.md` §7 (INC-06-02 e INC-06-08) y de `18-openapi/_inconsistencias.md` (filas reemplazadas sin API destino).
- **Opciones**: A) **(Recomendada)** Destinos de §7.15, máquinas de §8.6 y API destino API-FAC-105 (consulta de `billableItems`) para API-VEN-006 y API-FAC-044 (preparación de la corrida) para API-VEN-007. B) Mantener `[VERIFICAR]` y el reemplazo sin API destino.
- **Impacto si no se responde**: A.
- **Bloquea**: diagrama ER, diagramas de estados y contrato OpenAPI de M11.
- **Estado**: Asumida (DEC-072): opción A. Aplicado en §7.1 a §7.8, §7.14, §7.15, §8.6 y §11. T05 debe registrar en §7.2.1 `sourceType`, `originType`, `quoteVersion`, `installmentType`, `discountAmount` y `discountReason` como "no es referencia" y los destinos de `premiseAddressId`, `creditNoteRequestId`, `freightSettlementId` y `discountApprovalId`.


## 22. Trazabilidad

### 22.1 Requisitos BASE

| Fuente | Requisito | Cubierto por |
|---|---|---|
| BASE §2 | Ventas contado, cargos en factura y cuotas; complemento POS | RF-VEN-005, 050, 080–086, 104 |
| BASE §20 | Diferenciar venta, consumo y comodato | RN-VEN-006; RF-VEN-066 |
| BASE §23 Objetivo/Alcance | Ventas, pedidos, entregas, devoluciones, listas, financiación, cancelación anticipada, relación con operación original | RF-VEN-050–063, 080–094 |
| BASE §23 Límite | No mezclar venta con refinanciación | RN-VEN-005; RF-VEN-091 |
| BASE §23 CU-23 y precarga | VEN-001, ART-ROU-01, 3 × 30.000 | §16 CU-23; §18 |
| BASE §39.3 | INS-INT, CUO-VEN | §18 |
| BASE §44, §70 (SIyC 267/2024), §52 | Facturación separada de conceptos ajenos | RF-VEN-007; RN-VEN-004; CTR-VEN-01/05 |
| BASE §72 PRO-001..004, CU-PRO-01 | Cargos, disparadores, financiación de instalación, no duplicar | RF-VEN-001–006, 080; CU-PRO-01 |
| BASE §73 CU-INS-01, controles | Primer cobro, visita fallida, idempotencia | RF-VEN-004, 011; ESC-VEN-04/05 |
| BASE §74 | Pendientes del piloto | PA-VEN-08, PA-VEN-09 |
| BASE §78 | Costo de equipo no es cargo al socio | RN-VEN-006 |
| BASE §81 | Copia de configuración | RF-VEN-117 |
| BASE §97.12, §99.3 | Matriz ventas/cuotas en factura | RF-VEN-084, 085 |
| BASE §101, §105, §106 | Olas y soluciones | Encabezado |
| BASE §103 | Grupos de facturación | RF-VEN-085; RN-VEN-028 |
| MER-009 | Obras con presupuesto | RF-VEN-035, 036, 110 |
| MER-010 | Ventas y cuotas en la factura | RF-VEN-007, 084; PA-VEN-01 |
| MER-012 | Workflow de aprobación | RF-VEN-008; §4 controles |
| AGR-003, 011, 014, 016, 022, 026 | Estados, redondeo, financiación, idempotencia, cortes, stock | §8; RN-VEN-046; RF-VEN-091; RF-VEN-004; §15; RF-VEN-054 |
| DFA M13 | Funciones y mejora flujo continuo, aceptación online, POS | RF-VEN-020–047, 100–117 |
| DFA M12 mejoras | Simulador con CFT | RF-VEN-082 |
| FIC 19 | Hardware local | RF-VEN-105 |
| DEC-002, DEC-007, DEC-009 | Multitenant, todo ProCoop, contabilidad temprana | RF-VEN-116, RF-VEN-013, §12 |

### 22.2 Tablas CAT

| Tabla | Sección CAT | Destino |
|---|---|---|
| `COMP_VEN` | §13 | `salesOrders` (§7.5) |
| `COMP_VEN_RENDICION` | §13 | `tripSettlements` de M18 (§7.12, CTR-DAT-53) |
| `COMP_VEN_RENDICION_ITEMS` | §13 | `tripSettlements` de M18 (ítems de combustible; antes `freightSettlements.fuelItems`) |
| `IT_COMPV` | §13 | `salesOrders.items` |
| `MAQUINAS` | §13 | `salesOrders.soldEquipment` + M13 (CTR-VEN-09) |
| `OB_COMPV` | §13 | `salesOrders.transport` / observaciones |
| `PRESUIT` | §13 | `salesQuotes.versions.items` |
| `PRESUIT_CONJUNTOS` | §13 | `salesQuotes.versions.groups` |
| `PRESUPU` | §13 | `salesQuotes` |
| `PRESUPU_COMPROBANTES` | §13 | `salesQuotes.generatedDocuments` |
| `PRESUPU_CONDICION` | §13 | `salesConditions` |
| `PRESUPU_NOTAS` | §13 | `salesQuotes.notes` |
| `VENDEDOR` | §13 | `salesReps` (con `personId` obligatorio y datos de identidad en M01, DEC-097; CTR-VEN-19) |
| `CMPORDE` | §14 | `salesOrders.workOrderId` (CTR-VEN-08) |
| `DEUDAVTA`, `IVAVTA` | Cobranzas | `salesInstallments` (origen venta) / M08 (CTR-VEN-03) |
| `COMPPOS`, `DESCPOS`, `TEL_POS_REG_CAJA`, `TEL_POS_REG_GRUPOS` | Varias | M05, M04, M10 (CTR-VEN-02) |
| `PRCAGAS` | Facturación | `billableItems` de M05 para las pendientes (CTR-DAT-38); `operationCharges` sin origen migrado |

### 22.3 Reglas RN asignadas

| Regla fuente | Cubierta por |
|---|---|
| RN-08 §7.7 y §15.3 `clsPresupuesto` (estados, validaciones, prorrateo, costo fijo, ticket, anticipos, comprobantes) | RN-VEN-007–019, 050; RF-VEN-020–047 |
| RN-08 §15.3 `clsProdSer` (recargos/descuentos, actualización de precios) | RN-VEN-040, 041; RF-VEN-052, 053 |
| RN-08 §15.3 `clsSAprov` (stock comprometido por presupuestos) | RF-VEN-041 |
| RN-08 §15.4 (`PROD_SERV`, facturado no entregado, trazabilidad) | RF-VEN-055, 056, 070 |
| RN-08 §4.3 (acciones masivas sin control) | RN-VEN-051; §4 |
| RN-02 §2.1, §2.3, §2.5 (cuotas en masiva, selección, agrupación) | RN-VEN-027–030; RF-VEN-084–086 |
| RN-02 §10.1, §10.2 (cierre, modificación de cuotas) | RN-VEN-031, 034; RF-VEN-062, 088 |
| RN-02 §11.1, §11.2 (percepción por cuota, importaciones) | RN-VEN-025, 048; RF-VEN-081, 093 |
| RN-02 §14–§16 (variables, defectos: IVA con descuento, rendición, numeración) | RN-VEN-023, 042, 048 |
| RN-09 TECNICA (reconexión) | RN-VEN-049; RF-VEN-009 |

### 22.4 Parámetros

| Parámetros V2 | Cubiertos por |
|---|---|
| #2483, #2485, #2661, #2907 | PRM-VEN-005–008 |
| #210, #2788, #2892, #2894, #2903, #3015, #2914, #2915, #2949, #2953, #3032, #3004, #3024, #3037, #3010, #2395, #3009, #2901, #2381, #2600, #2398, #2899, #2348 | PRM-VEN-010–032 |
| #2380, #2383, #2386, #2589, #2592, #2593, #2641, VAR_PMOVIL 25, 26, 52, 53 | PRM-VEN-045–055 |
| #67, #77, #76, #312, #2272, #2273, #2246, #727, #2247, #2564, #2289, #2452, #2519, #1007, #1008, #3053, #2678, #3069, #518–#522 | PRM-VEN-060–081 |
| #403, #733, #2930, #2089, #676, #308, #310, #2443, #2972, #29, #2409, #3008, #3038, #606 | PRM-VEN-090–104 y nota §14.5 |

### 22.5 Inventario de pantallas (INV)

| Formulario ProCoop | Pantalla CoopApps |
|---|---|
| `frm_Presupuesto`, `frm_Presupuesto_Detalle`, `frm_Presupuesto_ConjuntoDetalle`, `_Item`, `frm_Presupuesto_ActualizarProd`, `abm_Presupuesto_Notas`, `frmPresupu_EstadoManual`, `Estados_Presupuesto` | PAN-VEN-02, 03 |
| `abm_Presupu_Condicion` | PAN-VEN-04 |
| `frmImpresionPresupuesto_Orden`, `frmSeleccionar_Presupuesto` | PAN-VEN-02 |
| `frmComprobanteVenta`, `frmComprobanteVenta_Detalle`, `FormasPago` | PAN-VEN-08, 09 |
| `frmAnulacionComprobantesVenta` | PAN-VEN-22 |
| `abm_Vendedor` | PAN-VEN-16 |
| `abm_ComprobanteRendicion`, `frm_ComprobanteRendicion_Detalle`, `Estado_AbmRendicion` | PAN-VEN-20 |
| `frmModificaDatosCuotas`, `frmModificarTipoCuotas`, `frmEdicionCuotas`, `frmAjusteCuotasMoneda` | PAN-VEN-14, 15 |
| `frmComprobantesFactura_Cuota`, `frmFacturasImpresion_Cuotas`, `frmDetallecuotas`, `frmAgregarDeudaCuotas`, `frmReconstruccion_Cuotas` | PAN-VEN-14 (reconstrucción reemplazada) |
| `frmAnticipo` | PAN-VEN-03 (anticipo) / M07 |
| `frmVentaPrepaga`, `frmVentaPrepagaRapida` | M03 (prepago); patrón de PAN-VEN-10 |
| `abm_PtoVenta` | M05 (referencia desde PAN-VEN-11) |
| `frmLibroIvaVenta` | M06 |
