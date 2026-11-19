# M07 COB — Cuenta corriente, cobranza, cajas, entes, débitos, pasarelas y conciliación

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Estado | Especificación consolidada — pendiente de validar preguntas abiertas |
| Solución (BASE §105) | **Cobranza** (solución 5: cuenta corriente, cajas, cobradores, canales de cobro, imputación) y **Pasarelas** (solución 6: tarjetas, billeteras, QR, débito automático, transferencias, redes extrabancarias, confirmación y conciliación). Mora, convenios, garantías, incobrables y judicial, que BASE §105 incluye en la solución 5, se especifican en M08 MOR. |
| Olas | **O5** (núcleo y estándar de todo el módulo); O6 (integración con mora, suspensión y reconexión: eventos ya emitidos en O5, consumo en M08); O7 (punto de cobro de venta prepaga y cobranza de servicios medidos; ver PA-COB-15); O10 (cobro de cuotas de vivienda, servicios sociales y cobradores avanzados); O11 (migración repetible y paralelo con ProCoop) |
| Dueño de datos | `currentAccounts`, `obligations`, `ledgerEntries`, `allocations`, `allocationPolicies`, `creditBalances`, `unidentifiedReceipts`, `accountStatements`, `cashRegisters`, `cashSessions`, `cashOperations`, `receipts`, `paymentTenders`, `paymentMethods`, `cardPlans`, `staticQrCodes`, `collectors`, `collectionRounds`, `collectorSettlements`, `collectionAgencies`, `paymentReferences`, `externalKeyAliases`, `agencyDebtExports`, `agencyPublishedDebts`, `agencySettlements`, `agencySettlementLines`, `agencyNoveltyFiles`, `directDebitMandates`, `directDebitBatches`, `gatewayConnectors`, `paymentChannels`, `paymentIntents`, `gatewayTransactions`, `gatewayWebhookEvents`, `paymentCoupons`, `refundCases`, `chargebacks`, `collectionReconciliations`, `treasuryHandovers`, `thirdPartyBillers`, `thirdPartyCollections`, `externalObligationImports`, `collectionReportSchemes`, `collectionExceptions`, `collectionAccountingGroups` (PA-COB-20). Corregido: `cashDiscountRules` (antes en esta lista) es `earlyPaymentDiscountRules` de M08 (CTR-DAT-40) y `fileLayouts` (antes en esta lista) es de T06 (CTR-DAT-05, COL-INT-10). |
| Fuentes consolidadas | BASE §11, §12, §13, §37, §39.4, §39.5 (filas Saldo de obligación y Pago externo), §39.6 (roles Cajero y Tesorería), §40, §44 (FAC-001 a FAC-004, 44.8), §57, §68 (CTA-001 a CTA-004), §71, §75 (CON-004, CON-005), §97.6, §98, MER-007, MER-019, §101, §103 (FAC-005 a FAC-012, CU-103, 103.6), §105 (soluciones 5 y 6), §106; AGR-011, AGR-012, AGR-013, AGR-016, AGR-021, hipótesis 102.5.3 y 102.5.5, ESC-01, ESC-04; DFA Módulo 9 (cuenta corriente), Módulo 10 (cobranza) y proceso de cobro (líneas 1183-1189); REL "Tablas relacionadas a Cobranzas"; RN-05 completo (§1 a §13.13); RN-13 §1 a §15, §17 a §20 (la §16 Interbanking la toma M14); RN-11 resumen, "Confirmado en la base demo", §1.1 a §1.4, §5, implicancias y dudas; RN-12 completo; FIC §4.1 a §4.4, §5.1, §5.2, §6; CAT §6 (Cobranza y caja, 21 tablas) y §7 (Entes recaudadores y pagos electrónicos, 13 tablas; DEC-104, antes decía ~~14~~); RN-09 grupo COBRANZA (parámetros que cambian comportamiento); INV `ProMod_Cobranzas.md` (90 formularios, 6 controles y tipos auxiliares); CNX (patrones de pantallas, permisos y PWA offline) |


> **Norma de implementación (DEC-111, DEC-112, DEC-110, DEC-113).** Construcción GoodApps: **.NET 10**, **ASP.NET Core**, **EF Core**, **Azure SQL** (base compartida, `TenantId` en tablas de negocio), front **React 19**, **Microsoft Azure** (Container Apps, Blob, Queue, Key Vault, Application Insights), identidad **OpenIddict**. Modelo físico: `07-modelo-relacional-azure-sql.md` y `07-catalogo-tablas-sql.md`. Checklist e impacto: `06-impacto-adaptacion-stack-goodapps.md` (**DIR-13**).
>
> **Lectura:** «colección» en este anexo = **entidad lógica**; tablas, columnas y FK en `07-*`. RF/RN/CU del anexo **no cambian** por el stack.


## 1. Objetivo

Ser la **única fuente del saldo comercial** de cada titular dentro de su tenant y el **único camino por el que entra dinero** al sistema. El módulo:

1. Registra cada obligación exigible (una por servicio dentro de cada comprobante, FAC-008) y cada movimiento del auxiliar comercial; el saldo se **deriva** de movimientos e imputaciones, nunca se edita (AGR-011).
2. Presenta la cuenta del socio separada por servicio o unificada según la política del tenant, con resumen de cuenta que no crea deuda (FAC-003 a FAC-005, CTA-001).
3. Imputa cada cobro con una regla explícita y configurable (antigüedad, prioridad de servicio o elección del socio), sin dejar importes sin asignar y explicando cada peso recibido como cancelación, crédito o pendiente (FAC-008, AGR-012).
4. Opera la caja presencial completa (apertura, cobro por código de barras, medios de pago combinados, QR, descuentos, retenciones sufridas, anulación, arqueo y cierre con diferencias), los cobradores y la cobranza fuera de oficina (MER-007).
5. Integra todos los canales externos de cobro (entes recaudadores por archivo o API, débito automático por CBU o tarjeta, pasarelas de pago con link, botón, QR y tokenización) mediante **un motor común**: un modelo único de intención de pago, un motor declarativo de layouts para archivos y una interfaz única de conector con adaptador por proveedor.
6. Garantiza que **un pago se registra una sola vez** aunque el proveedor notifique varias veces, que un pago incierto no se reenvía sin conciliar (§105 solución 6, ESC-04) y que el bruto cobrado, la comisión y el neto acreditado se concilian por separado (BASE §13).
7. Gestiona devoluciones y contracargos con sus dos efectos (comercial y financiero, AGR-013), la conciliación de cobranzas, la rendición de fondos a tesorería y emite los eventos económicos que M15 contabiliza.

Reemplaza íntegramente la cobranza de ProCoop (`ProMod_Cobranzas`, `ReglasNegocio.Cobranzas`, `ProMod_WebService`) corrigiendo su deuda técnica y de seguridad (RN-13 §17).

## 2. Límite y responsabilidades

### 2.1 Qué hace

| Ámbito | Responsabilidad de COB |
|---|---|
| Auxiliar comercial | Obligaciones, movimientos, imputaciones, saldos derivados, saldos a favor, anticipos, cobros no identificados, integridad y conciliación con contabilidad. |
| Presentación de la cuenta | Cuentas separadas o unificadas, resumen de cuenta, estado de cuenta, mínimo de pago informado, vistas por titular, cuenta, contrato, servicio y documento, saldo a fecha histórica. |
| Imputación | Motor único y políticas configurables por tenant, servicio y canal; reasignación autorizada; cancelación automática de créditos contra débitos. |
| Caja | Puestos, sesiones, operaciones, recibos, medios de pago, tarjetas con recargo, QR de caja, descuentos en caja, retenciones sufridas, egresos autorizados (pago a proveedor, donación), anulación, arqueo, cierre, rendición a tesorería. |
| Cobradores | Listas de cobro, cobro en campo offline, rendición del cobrador, base de comisiones. |
| Entes recaudadores | Configuración, layouts, identificador de pago, envío de deuda, rendición, validaciones, morosidad, novedades, rechazos, control. |
| Débito automático | Mandatos (adhesiones), exclusiones, presentaciones, rendición, rechazos que vuelven a deuda, reintentos. |
| Pasarelas | Conectores, intenciones de pago, links, QR, cupón de pago único, webhooks, conciliación diaria, pagos inciertos, tokenización (por el proveedor). |
| Devoluciones y contracargos | Expediente de devolución, contracargos y reversiones, efectos comerciales. |
| Conciliación de cobranzas | Pagado por el socio vs. rendido por el canal vs. esperado acreditar; comisiones; diferencias a revisión. |
| Eventos económicos | Publicación por outbox de todos los hechos que M15, M14, M08, M06, M19 y T09 consumen. |

### 2.2 Qué NO hace y a quién delega

| Tema | Responsable | Interfaz con COB |
|---|---|---|
| Emisión de facturas, ND, NC, numeración fiscal, CAE, PDF de factura, código de barras impreso, grupos de facturación | **M05 FAC** | COB consume `fac.invoice.issued`, `fac.creditNote.issued`, `fac.debitNote.issued`, `fac.invoice.annulled` (EVT-FAC-07/10/11/08); solicita a M05 la emisión de ND por recargo diferido, comisión trasladada, cargo por reversión y comprobante por conceptos cobrados en caja. COB entrega a M05 el **identificador de pago** a imprimir (RF-COB-100). Desde el 10-11-2026 COB también consume `fac.invoice.returnedToDraft` y `fac.invoice.renumbered` (EVT-FAC-22/23) y no cobra ni publica una obligación hasta la autorización fiscal (RN-COB-158; DEC-107), y expone a M05 `cob.service.agencyDueDateCapacities` con la cantidad de vencimientos que admite cada ente (RN-COB-159; DEC-106). |
| Cálculo de recargos, intereses, mora, tasas e índices, diferimiento a la próxima factura, convenios, cuotas, garantías, prescripción, incobrables, suspensión, corte y reconexión | **M08 MOR** | COB invoca el servicio `mor.surcharge.quote` en cada punto de cobro (caja, ente, pasarela, débito, cobrador) y aplica el resultado; publica `cob.payment.confirmed`, `cob.obligation.settled` y `cob.minimumPayment.evaluated` para que M08 evalúe reconexión, instancias y caída de convenios. |
| Tributos de cada comprobante, retenciones y percepciones como agente, DDJJ de retenciones sufridas, regímenes informativos | **M06 FIS** | COB registra la retención sufrida en el cobro y publica `cob.retention.received`. |
| Depósito de fondos, cartera de valores (cheques), cuentas bancarias propias, libro banco, conciliación bancaria contra extractos, Interbanking, pago a proveedores | **M14 TES** | COB publica la acreditación esperada por canal (`cob.settlement.expected`), entrega valores y efectivo al cierre (`cob.treasuryHandover.delivered`); consume `tes.gatewayCredit.reconciled` (EVT-TES-07). Expone a M14 el servicio de solo lectura `cob.service.getUnremittedCash` (RF-COB-195) con el saldo por caja y medio de las sesiones sin rendir, que M14 muestra en una línea separada de la posición diaria (DEC-101); la caja de cobranza sigue siendo de M07 hasta que M14 acepta la rendición. |
| Asientos contables | **M15 CON** | Consume los eventos `cob.*` económicos (sección 12). |
| Integración técnica: transporte SFTP/HTTP, bóveda de credenciales, salud de conectores, reintentos de transporte, agente local de hardware (impresora fiscal o térmica, lector, cajón) | **T06 INT** | COB define el contrato funcional del conector y del layout; T06 provee el transporte y la bóveda. |
| Notificaciones (recibo por email, WhatsApp, SMS; aviso de rechazo) | **T09 COM** | COB publica eventos; T09 entrega. |
| Pantallas del socio (Mis facturas y pagos, pagar) | **M19 POR** | COB expone API y componentes de checkout. |
| Venta y cálculo de energía prepaga, recarga en medidor | **M03 MED** | COB es el punto de cobro de la venta (intención o cobro en caja tipo `prepaid`). |
| Cuotas de vivienda, obras y servicios sociales | **M18 SOC**, **M10 TEC** | Se cobran como obligaciones genéricas. |
| Personas, titulares, cuentas, notas de cuenta | **M01 PER** | COB lee; las notas con bloqueo de caja se aplican en el cobro. |
| Autorizaciones con flujo, expediente documental | **T11 WFL** | Anulaciones, reasignaciones, diferencias de arqueo y devoluciones usan su motor de autorizaciones. |
| Parámetros y su catálogo exhaustivo ProCoop | **T04 CFG** (T04b) | La sección 14 lista los parámetros que cambian el comportamiento de COB. |

## 3. Glosario del módulo

| Término | Definición | Clave de diccionario | Término ProCoop equivalente |
|---|---|---|---|
| Auxiliar comercial | Registro de movimientos e imputaciones que es la única fuente del saldo de cada titular. | `dict:cob.ledger` | Cuenta corriente (FACTURAS.SALDO + IT_PAGSO) |
| Cuenta corriente | Agrupación de obligaciones de un titular que se presentan juntas: separada por servicio o unificada. | `dict:cob.currentAccount` | Cuenta (`COD_SUM`) / Grupo Factura |
| Obligación | Importe exigible con vencimientos, originado por un documento (factura, ND, cuota, cargo); una por servicio dentro de cada comprobante agrupado. | `dict:cob.obligation` | Comprobante con saldo (`FACTURAS`, `DEUDAVTA`) |
| Movimiento | Asiento inmutable del auxiliar, débito o crédito, con causa, autor y documento. | `dict:cob.ledgerEntry` | Ítem de factura / recibo |
| Imputación | Aplicación de un crédito (pago, NC, anticipo) a una obligación por un importe y componente. | `dict:cob.allocation` | `IT_PAGSO` (ENTREGA) |
| Saldo | Importe pendiente derivado: importe de la obligación menos imputaciones vigentes. | `dict:cob.balance` | `FACTURAS.SALDO` (editable en ProCoop) |
| Cuenta separada / unificada | Modalidad de presentación elegida por el tenant con excepciones (FAC-005). | `dict:cob.accountMode.separate` / `dict:cob.accountMode.unified` | — |
| Resumen de cuenta | Documento de presentación de obligaciones existentes; no es deuda. | `dict:cob.statement` | Resumen / talón sumado |
| Estado de cuenta | Listado descargable de movimientos y saldos a una fecha. | `dict:cob.accountStatementReport` | Consulta de deuda impresa |
| Mínimo de pago | Umbral configurable informado en el resumen; no cancela el resto (CTA-002). | `dict:cob.minimumPayment` | — |
| Política de imputación | Regla versionada que reparte un cobro entre obligaciones y componentes. | `dict:cob.allocationPolicy` | Validaciones 321/324/375 |
| Saldo a favor | Crédito disponible del titular, con origen y regla de aplicación. | `dict:cob.creditBalance` | `ANTICIPOS` (`SDO_ANT`) |
| Anticipo | Saldo a favor por pago anterior a la factura o pago a cuenta. | `dict:cob.advance` | Anticipo |
| Excedente | Parte de un cobro que supera lo imputable. | `dict:cob.overpayment` | Pago duplicado / anticipo |
| Cobro no identificado | Dinero recibido sin titular u obligación determinable; queda en bandeja. | `dict:cob.unidentified` | (no existe; "comprobante no encontrado" en log) |
| Imputación no automática | Marca de un crédito que no se aplica solo. | `dict:cob.nonAutoCredit` | `CREDITOS_NOAUTOMATICOS` |
| Cancelación automática | Proceso que aplica créditos abiertos contra débitos abiertos. | `dict:cob.autoOffset` | Cancelación Automática |
| Caja (puesto) | Punto de cobro: ventanilla, caja virtual de ente, cobrador o canal digital. | `dict:cob.cashRegister` | `CAJASJP`, número de caja |
| Sesión de caja | Turno abierto por un cajero en una caja con fondo inicial hasta su cierre. | `dict:cob.cashSession` | `CAJAS` (fecha + número + usuario) |
| Operación de caja | Cada acto de cobro o egreso con totales por medio de pago. | `dict:cob.cashOperation` | `PLAN_CAJ` |
| Recibo | Comprobante de cobro con detalle de imputaciones y medios. | `dict:cob.receipt` | `PAG_SOC` + `IT_PAGSO` |
| Medio de pago | Forma de pago aceptada (efectivo, cheque, transferencia, tarjeta, QR, retención, débito, ente). | `dict:cob.paymentMethod` | `TIP_VAL`, `FORMAPA` |
| Valor | Cheque de terceros recibido. | `dict:cob.cheque` | `VALORES` |
| Cupón de tarjeta | Comprobante de pago con tarjeta en caja (POS). | `dict:cob.cardVoucher` | `CUPONTAR` |
| Retención sufrida | Retención practicada por el pagador que cancela parte de la deuda. | `dict:cob.retentionReceived` | `RETENCIO` |
| Arqueo | Conteo declarado por medio y moneda comparado con el teórico. | `dict:cob.cashCount` | Datos de cierre |
| Teórico | Importe esperado en caja calculado desde las operaciones. | `dict:cob.expectedAmount` | Teórico por medio |
| Diferencia de arqueo | Real menos teórico; genera quebranto de ingreso o egreso. | `dict:cob.cashDifference` | `TOT_DIF`, quebranto |
| Rendición a tesorería | Entrega de fondos y documentación del cajero o cobrador. | `dict:cob.treasuryHandover` | Presentación de caja a tesorería |
| Cobrador | Persona que cobra fuera de oficina con lista de cobro. | `dict:cob.collector` | — (MER-007) |
| Ente recaudador | Entidad externa que cobra por cuenta de la cooperativa (Red Link, SIRO, Banelco, Pago Fácil, Rapipago, Cobro Express, bancos, tarjetas). | `dict:cob.agency` | `BANCOS` |
| Caja virtual del ente | Caja propia de cada ente donde se registran sus cobros. | `dict:cob.agencyCashRegister` | `BANCOS.CAJA` |
| Archivo de deuda | Publicación de obligaciones al ente (archivo o API). | `dict:cob.debtExport` | Generar Archivo para Entidad Recaudadora |
| Rendición | Informe de pagos que devuelve el ente (archivo o API). | `dict:cob.settlement` | Importar rendición |
| Layout | Estructura declarativa de un archivo (cabecera, detalle, pie, posiciones). | `dict:cob.fileLayout` | Modelo de importador/exportador |
| Identificador de pago | Código autocontenido y estable que identifica la obligación, cupón o intención publicada. | `dict:cob.paymentReference` | Prefijos 40/41/42/43/99 |
| Código de pago electrónico | Identificador para homebanking y redes (Red Link, Banelco). | `dict:cob.electronicPaymentCode` | Identificador de usuario Red Link |
| Alias de clave externa | Equivalencia entre una clave de un sistema anterior y la cuenta o servicio de CoopApps. | `dict:cob.externalKeyAlias` | `FACTURAS.USUARIO` |
| Novedades | Archivo del ente con altas, bajas y modificaciones de adhesiones. | `dict:cob.noveltyFile` | Importar Archivo de Novedades |
| Archivo de morosidad | Archivo del ente con deudas morosas del canal (Tarjeta Naranja). | `dict:cob.delinquencyFile` | Importar Archivo de Morosidad |
| Débito automático | Cobro automático por CBU o tarjeta según mandato. | `dict:cob.directDebit` | Débito automático (`SUMSOC.DEB_TARJ`) |
| Adhesión (mandato) | Autorización del titular para debitar un medio por cuenta o servicio. | `dict:cob.mandate` | Adhesión |
| Presentación de débitos | Lote enviado al ente con las obligaciones a debitar. | `dict:cob.debitBatch` | Exportar archivo de débitos |
| Rechazo | Débito o pago no cobrado con código de causa. | `dict:cob.rejection` | `RECHAZOS`, código R |
| Pasarela | Proveedor de pagos online (Pagos360, Mercado Pago, SIRO botón, Macro, otros). | `dict:cob.gateway` | Entidad digital |
| Conector | Adaptador de una pasarela o ente a la interfaz única. | `dict:cob.connector` | Subclase de `EntidadDigital` |
| Intención de pago | Solicitud de pago identificable con ítems, importes por vencimiento y estado. | `dict:cob.paymentIntent` | `PAGOS360` + `PAGOS360_ITEMS` |
| Transacción del proveedor | Pago, rechazo o contracargo informado por el proveedor. | `dict:cob.gatewayTransaction` | `PAGOS360_PAGOS` |
| Pago incierto | Operación cuyo resultado no se conoce (timeout, error). | `dict:cob.uncertainPayment` | — |
| Link de pago | URL de checkout enviable por WhatsApp, email o SMS. | `dict:cob.paymentLink` | Link de pago Pagos360 |
| QR estático / dinámico | QR fijo por puesto con monto cargado por transacción / QR de un solo uso por operación. | `dict:cob.staticQr` / `dict:cob.dynamicQr` | `CAJAS_QR` / QR dinámico |
| Cupón de pago único | Código que cancela varias facturas del resumen en un acto (MER-019). | `dict:cob.singleCoupon` | Talón sumado (cuota 0) |
| Contracargo | Reversión del pago iniciada por el emisor del medio. | `dict:cob.chargeback` | Reversión |
| Devolución | Reintegro de dinero al pagador por decisión de la cooperativa. | `dict:cob.refund` | (no existe) |
| Conciliación de cobranzas | Comparación de pagado, rendido y acreditado por canal. | `dict:cob.reconciliation` | Controles de pie y log |
| Comisión del ente | Cargo del canal por cada cobro; gasto financiero separado del pago. | `dict:cob.agencyFee` | `FORMA_CAL`, `NET_FEE` |
| Diferimiento de recargo | Recargo no cobrado en el acto que M08 factura después. | `dict:cob.surchargeDeferral` | Diferir todo / mora / no diferir |
| Deuda notificada | Obligaciones incluidas en un aviso de corte (M08). | `dict:cob.notifiedDebt` | Notificación (prefijo 40) |
| Bloqueo de cobro | Marca que impide cobrar un comprobante. | `dict:cob.collectionBlock` | `ID_BLO`, `BLO_CAJ` |
| Cobranza por cuenta de terceros | Cobro de comprobantes de otro emisor (municipio, otros) con comisión y rendición. | `dict:cob.thirdPartyCollection` | `TERCEROS`, `FACTURAS_TERCEROS` |

## 4. Actores, permisos y alcance

| Rol (perfil sugerido) | Capabilities | Alcance de datos |
|---|---|---|
| Cajero | `cob.cuentas.ver`, `cob.caja.abrir` (antes `cob.cajas.abrir`), `cob.caja.cobrar`, `cob.caja.cerrar` (antes `cob.cajas.cerrar`), `cob.recibos.ver`, `cob.recibos.reimprimir`, `cob.recibos.enviar`, `cob.links.crear`, `cob.qr.cobrar` | Sus cajas asignadas y sucursal; titulares del tenant para consulta de deuda |
| Cajero con facultades | lo anterior + `cob.caja.cobrarParcial`, `cob.caja.cambiarRecargo`, `cob.caja.desmarcarNota`, `cob.caja.cobrarBloqueado`, `cob.caja.anular`, `cob.caja.egresar` (incluye la donación; antes `cob.caja.donacion`) | Ídem |
| Supervisor de caja | `cob.caja.anularOtroUsuario`, `cob.caja.aprobarDiferencia`, `cob.caja.reabrir`, `cob.caja.configurar` (antes `cob.cajas.configurar`), `cob.caja.ver` (todas), `cob.reportes.ver` | Sucursales asignadas |
| Operador de cuenta corriente | `cob.cuentas.ver`, `cob.cuentas.exportar`, `cob.imputaciones.crear`, `cob.imputaciones.reasignar`, `cob.creditos.crear`, `cob.creditos.aplicar`, `cob.noIdentificados.ver`, `cob.noIdentificados.identificar`, `cob.resumenes.emitir`, `cob.bloqueos.gestionar` | Tenant (o zonas/servicios asignados) |
| Responsable de cuenta corriente | `cob.imputaciones.aprobar`, `cob.creditos.aprobar`, `cob.noIdentificados.aplicar`, `cob.ajustes.aprobar`, `cob.autoOffset.ejecutar` | Tenant |
| Responsable de cobranzas externas | `cob.entes.ver`, `cob.entes.exportar`, `cob.entes.importar`, `cob.entes.confirmar`, `cob.debitos.ver`, `cob.debitos.adherir`, `cob.debitos.presentar`, `cob.debitos.importar`, `cob.intenciones.ver`, `cob.intenciones.crear`, `cob.intenciones.cancelar`, `cob.intenciones.reprocesar`, `cob.excepciones.resolver` | Tenant |
| Tesorero | `cob.conciliacion.ver`, `cob.conciliacion.conciliar`, `cob.conciliacion.cerrar`, `cob.rendiciones.recibir`, `cob.devoluciones.ejecutar`, `cob.contracargos.gestionar`, `cob.reportes.exportar` | Tenant; cuentas bancarias según M14 |
| Responsable de devoluciones | `cob.devoluciones.solicitar`, `cob.devoluciones.aprobar` (segregado de quien ejecuta) | Tenant |
| Contador | `cob.cuentas.ver`, `cob.reportes.ver`, `cob.reportes.exportar`, `cob.integridad.ver` | Tenant, solo lectura |
| Administrador de cobranza del tenant | `cob.politicas.configurar`, `cob.medios.configurar`, `cob.descuentos.configurar`, `cob.entes.configurar`, `cob.layouts.configurar`, `cob.pasarelas.configurar`, `cob.terceros.configurar`, `cob.cobradores.gestionar` | Tenant |
| Cobrador | `cob.cobranzaCampo.ver`, `cob.cobranzaCampo.cobrar`, `cob.cobradores.rendir` | Sus listas de cobro asignadas (alcance `propios`) |
| Atención / CRM | `cob.cuentas.ver`, `cob.links.crear`, `cob.recibos.enviar` | Tenant |
| Socio (PWA/landing) | `cob.miCuenta.ver`, `cob.miCuenta.pagar`, `cob.miCuenta.adherirDebito`, `cob.miCuenta.informarTransferencia` | Sus cuentas autorizadas (BASE §39.6) |
| Integración (cuenta de servicio por conector) | `cob.webhooks.recibir`, `cob.rendiciones.ingestar` | Solo su conector y tenant |
| Soporte de plataforma | `cob.*.ver` con acceso temporal auditado (T01) | Tenant asistido, solo lectura salvo autorización |
| Auditor | `cob.*.ver`, `cob.auditoria.ver` | Tenant, solo lectura |

Reglas de permisos: una misma persona no puede solicitar y aprobar una devolución, ni declarar y aprobar su propia diferencia de arqueo por encima del umbral (PRM-COB-034). Toda acción económica queda en la auditoría de T02 con antes/después. Sin el permiso, el botón no se muestra y la API responde 403 con `problem+json`.

## 5. Requisitos funcionales

### 5.1 Auxiliar comercial y saldos

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-COB-001 | Registrar una obligación por cada servicio dentro de cada comprobante emitido, consumiendo el evento de M05, con servicio, contrato o suministro, período, vencimientos (de 1 a 4 por defecto, hasta el tope del tenant por tipo de comprobante o servicio; DEC-106) e importe por vencimiento, y componentes (capital, tributos, cargos por cuenta de terceros, otros). La obligación de un comprobante que requiere autorización fiscal no se cobra ni se publica hasta la autorización (RN-COB-158; DEC-107). *Reemplazado (10-11-2026, DEC-106): "vencimientos (hasta 4)".* | BASE §11, §103 FAC-008, AGR-011, DFA M9; DEC-106; DEC-107 | Núcleo | O5 | Informado | La suma de obligaciones de un comprobante es igual a su total; reprocesar el mismo evento no crea otra obligación (idempotencia por `eventId`); una factura con 6 vencimientos genera una obligación con 6 elementos en `dueSchedule`; una factura CAE sin autorizar no aparece cobrable ni exportable. |
| RF-COB-002 | Registrar movimientos inmutables del auxiliar: débitos (factura, ND, interés, cuota, comisión trasladada, cargo por reversión) y créditos (pago, NC, anticipo, retención, ajuste autorizado), con causa, autor, documento origen, fecha efectiva y fecha de registro. | BASE §11, DFA M9 mejora, AGR-011 | Núcleo | O5 | Informado | Ningún movimiento se edita ni borra; la corrección es un movimiento de reversión vinculado. |
| RF-COB-003 | Derivar el saldo: saldo de obligación = importe − imputaciones vigentes; saldo de cuenta = obligaciones abiertas − créditos disponibles. Ningún campo de saldo es editable por usuario ni API. | AGR-011, BASE §39.5, DFA M9 | Núcleo | O5 | Adoptado | El total no depende de la pantalla o proceso que lo consulte (criterio AGR-011). |
| RF-COB-004 | Derivar el estado de saldo de cada obligación: Pendiente, Parcialmente cancelada, Cancelada; más los estados informados por M08 (En convenio, Incobrable, Prescripta). | BASE §39.5 | Núcleo | O5 | Informado | El estado se recalcula al imputar o revertir; no se fija a mano. |
| RF-COB-005 | Consultar movimientos y saldos por titular, cuenta corriente, contrato, servicio y documento, con filtros de vencido/no vencido, servicio, tipo de comprobante y rango de fechas. | BASE §11, CON-005, DFA M9 | Núcleo | O5 | Informado | La consulta por titular muestra la apertura por servicio también en cuenta unificada. |
| RF-COB-006 | Mostrar cargos, pagos, ajustes y créditos disponibles, separando capital, intereses, recargos, gastos y tributos. | BASE §11 | Núcleo | O5 | Informado | El detalle de un documento suma su total por componentes. |
| RF-COB-007 | Consultar el saldo a una fecha histórica, eligiendo la fecha del pago a considerar (fecha de pago, fecha del recibo o fecha de registración). | BASE §11, RN-05 §13.11 | Estándar | O5 | Informado | Deuda a fecha pasada = saldo actual + pagos posteriores a esa fecha, según el tipo elegido. |
| RF-COB-008 | Mostrar antigüedad, vencimientos, cobros parciales, acuerdos y acciones de seguimiento de M08 en la vista de cuenta. | BASE §11 (§75), CON-005 | Estándar | O5 | Informado | Los datos de M08 se muestran por referencia, sin duplicarlos. |
| RF-COB-009 | Ver el detalle de cada documento: origen, imputaciones, recibos, intenciones de pago en curso, débitos presentados, contracargos y financiaciones que lo incluyen. | RN-05 §13.2, INV `frmPagosPorComprobante`, `frmCobranza_DetellePagos` | Núcleo | O5 | Adoptado | Desde la factura se llega a cada recibo y desde cada recibo a la operación de caja. |
| RF-COB-010 | Mostrar los pagos pendientes de confirmación (intención iniciada, transferencia informada, débito presentado) de forma informativa, sin reducir la deuda. | BASE §11 regla y CU-11, §40 paso 9 | Núcleo | O5 | Informado | Un pago en estado Pendiente no cambia el saldo ni habilita reconexión. |
| RF-COB-011 | Admitir ajustes solo mediante operación documentada: NC o ND emitida por M05, o ajuste interno autorizado con causa, autor y contrapartida. | AGR-011 | Núcleo | O5 | Adoptado | Ningún ajuste carece de operación, causa, autor y contrapartida. |
| RF-COB-012 | Bloquear comprobantes para el cobro, individual o masivamente por filtros, con motivo y vigencia; desbloquear con permiso. Caja, entes, pasarelas y portal respetan el bloqueo. | RN-05 §4.6, §13.2; INV `frmBloqueoMasivoFacturas`; V2 2586, 2596, 3102 | Estándar | O5 | Adoptado | Un comprobante bloqueado no se publica a entes y su rendición queda observada salvo que el parámetro lo permita. |
| RF-COB-013 | Aplicar en el cobro las notas de cuenta de M01 con bloqueo de caja (impide cobrar) o mensaje en caja (aviso desmarcable con permiso). | RN-05 §3.2; V2 2473 | Estándar | O5 | Adoptado | El cajero ve la nota; sin `cob.caja.desmarcarNota` no puede cobrar una cuenta con bloqueo. |
| RF-COB-014 | Proponer la regularización autorizada de comprobantes de importe cero no marcados como pagos y de pares débito/crédito internos que se compensan (misma cuenta, fecha, total, saldo, vencimiento y tipo). | RN-05 §13.5 | Extensión | O5 | Adoptado | La propuesta no se aplica sin aprobación y genera movimientos trazables. |
| RF-COB-015 | Conciliar el auxiliar con la contabilidad (M15) por cuenta contable de créditos por servicios y por servicio, con diferencias explicadas. | BASE §11, §75, AGR-011 | Núcleo | O5 | Informado | El saldo del auxiliar a una fecha es igual al saldo contable de las cuentas de créditos, o la diferencia figura con causa. |
| RF-COB-016 | Verificar diariamente la integridad: obligaciones − imputaciones = saldos proyectados; recibo = suma de ítems; operación = suma de medios; cada medio = su registro. | RN-05 §13.1 informe de integridad, AGR-011 | Núcleo | O5 | Adoptado | El job JOB-COB-14 reporta cero diferencias o abre una excepción por cada una. |
| RF-COB-017 | Mostrar datos extra de la cuenta en consulta y caja: adhesión a débito, servicio desconectado o pendiente de desconexión, teléfono, medidor y domicilio. | RN-05 §13.5 `Get_InfoExtra`; V2 2349, 2436 | Estándar | O5 | Adoptado | La ficha de caja muestra los indicadores sin abrir otra pantalla. |
| RF-COB-018 | Avisar si el titular tiene deuda vencida en otras cuentas al cobrar una de ellas, incluidas las de otras entidades jurídicas (DEC-087). La deuda previa asociada al domicilio o al suministro de otro titular se muestra como advertencia con autorización opcional; nunca bloquea ni se traslada (DEC-029, RN-COB-155). | RN-05 §3.2; V2 187; DEC-029 | Estándar | O5 | Adoptado | El aviso aparece cuando el parámetro está activo; no impide cobrar. |
| RF-COB-019 | Llevar los componentes por cuenta de terceros (tasas) con saldo propio dentro de la obligación, para rendirlos al tercero (M06). | BASE §103 CU-103 | Estándar | O5 | Informado | El cobro parcial respeta la prioridad configurada y el importe del tercero cobrado se informa a M06. |
| RF-COB-020 | Excluir de caja y consulta los comprobantes pasados N días del segundo vencimiento, cuando el tenant lo configure. | V2 2385 | Extensión | O5 | Adoptado | Con N configurado, el comprobante deja de ofrecerse y se informa el motivo. |
| RF-COB-191 | Consultar el historial de la cuenta corriente con **consulta diferida** para el detalle de más de 36 meses (DEC-087, PA-DAT-02): obligaciones, imputaciones, recibos y sus PDF quedan siempre en línea; el detalle accesorio archivado por T05/T08 (bitácoras de entes, líneas de rendición, eventos de pasarela, intenciones de pago) se pide como consulta diferida y se entrega por notificación con enlace. El saldo y la deuda a una fecha nunca dependen del archivo. | DEC-087; T05; T08 | Estándar | O5 | Adoptado | Un estado de cuenta de 2019 se emite en línea con todos sus recibos; el detalle de líneas de rendición de 2019 se entrega como consulta diferida y no bloquea la caja. |

### 5.2 Cuentas separadas o unificadas, resumen y mínimo de pago

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-COB-021 | Configurar la modalidad de cuenta corriente por tenant (separada por servicio o unificada del titular) con excepciones por servicio, cuenta o titular, vigente desde un período. | FAC-003, FAC-005, CTA-001 | Núcleo | O5 | Informado | Dos tenants con modalidades distintas no se afectan; el cambio rige desde un período. |
| RF-COB-022 | En la cuenta unificada, conservar identidad, saldo y cancelaciones de cada factura y servicio. | FAC-004, BASE §44.3, §44.4 | Núcleo | O5 | Informado | El total agrupado es la suma de saldos por servicio; no existe una deuda adicional. |
| RF-COB-023 | Emitir el resumen de cuenta con facturas incluidas, pendiente por servicio, total, vencimientos, mínimo de pago e identificador de pago; el resumen es un documento de presentación, reproducible desde el auxiliar. | FAC-004, BASE §44.4, AGR-011, MER-019 | Núcleo | O5 | Informado | Regenerar el resumen no cambia saldos; el resumen no se contabiliza como obligación. |
| RF-COB-024 | Emitir el estado de cuenta descargable (PDF, XLSX) por el socio y por el operador. | BASE §11, DFA M9 mejora | Núcleo | O5 | Informado | El estado de cuenta a una fecha coincide con la consulta de saldo a esa fecha. |
| RF-COB-025 | Un cambio de modalidad no reemite ni fusiona documentos históricos; los resúmenes emitidos se conservan tal como se emitieron y las vistas se recalculan desde el auxiliar. | BASE §44.6 control, FAC-005 | Núcleo | O5 | Informado | Tras el cambio, los resúmenes previos se descargan idénticos. |
| RF-COB-026 | Mostrar al socio, en portal, app y API, la apertura por servicio: cuánto corresponde a cada servicio y qué pagó de cada uno. | FAC-011 | Núcleo | O5 | Informado | El socio ve la imputación de cada pago por servicio. |
| RF-COB-027 | Restringir la agrupación al mismo tenant y al mismo titular. | BASE §44.3 | Núcleo | O5 | Informado | La API rechaza agrupar cuentas de otro titular u otro tenant. |
| RF-COB-028 | Configurar el mínimo de pago (importe, porcentaje, obligaciones exigibles o fórmula, saldo elegible, exclusiones) e informarlo en el resumen; pagar el mínimo no cancela el resto de la deuda. | CTA-002, BASE §68, §71 | Estándar | O5 | A validar (PA-COB-06) | El sistema nunca infiere que pagar el mínimo cancela otras obligaciones. |
| RF-COB-029 | Evaluar el cumplimiento del mínimo en cada fecha de evaluación y publicar el resultado para M08, sin ejecutar suspensiones. | CTA-003, BASE §68 CU-CTA-01 | Estándar | O5 | A validar (PA-COB-06) | El evento `cob.minimumPayment.evaluated` lleva cuenta, mínimo, pagado y obligaciones; COB no cambia estados de servicio. |
| RF-COB-030 | Usar el grupo de facturación de M05 como unidad del resumen agrupado, con su domicilio de reparto, periodicidad y canal de entrega. | FAC-006, BASE §103 | Núcleo | O5 | Informado | El resumen del grupo incluye solo los servicios del grupo vigentes en el período. |
| RF-COB-192 | Mantener **una cuenta corriente por titular y por entidad jurídica** (DEC-087, PA-DAT-01; DEC-064): cada obligación se registra en la cuenta del titular para la entidad emisora del comprobante (`legalEntityId`); la cuenta unificada agrupa solo servicios de la misma entidad; la consulta del titular y el portal muestran todas sus cuentas con subtotal por entidad y total general informativo. | DEC-087; DEC-064; T05 PA-DAT-01 | Núcleo | O5 | Adoptado | Un titular con ELE (entidad A) e Internet (entidad B) tiene dos cuentas corrientes; una obligación de B nunca se registra en la cuenta de A; el portal muestra A, B y el total. |

### 5.3 Imputación

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-COB-031 | Usar un único motor de imputación para todos los canales (caja, cobrador, ente, débito, pasarela, cupón, crédito interno). | RN-05 §1, §11.1 | Núcleo | O5 | Adoptado | El mismo cobro produce las mismas imputaciones por cualquier canal. |
| RF-COB-032 | Configurar políticas de imputación versionadas por tenant, servicio y canal: selección explícita, antigüedad (primer o último vencimiento), prioridad de servicio, elección del socio. | FAC-008, BASE §106, DFA M9 mejora | Núcleo | O5 | Adoptado (PA-COB-01 respondida, DEC-048) | Un pago parcial en comprobante agrupado no deja saldos sin asignar y cuadra por servicio. |
| RF-COB-033 | Dentro de cada obligación, aplicar el pago primero a recargos e intereses (entre vencimientos, mora, financiación) y luego a capital, salvo que la política diga otro orden. | RN-05 §3.3 | Núcleo | O5 | Adoptado | Con recargo ARS 200 y pago ARS 1.000 sobre factura ARS 3.000, capital imputado ARS 800. |
| RF-COB-034 | Validar en caja el orden configurado: más antiguas primero (global o por servicio, contra primer o último vencimiento), deuda notificada completa, cuotas en orden, cupón o talón completo. Cada regla es error o aviso según configuración. | RN-05 §3.2, §13.2; V2 321, 324, 375, 462, 2263, 2355 | Estándar | O5 | Adoptado | Con la regla activa, saltear una factura más antigua bloquea la confirmación con el mensaje de la regla. |
| RF-COB-035 | Admitir pago parcial con permiso y política; el importe se reparte completamente según la regla. | FAC-008, BASE §12, §40.4 | Núcleo | O5 | A validar (PA-COB-07) | Un cobro parcial deja cada peso imputado o como crédito explícito. |
| RF-COB-036 | Registrar pagos a cuenta sin obligación seleccionada, que quedan como saldo a favor del titular y la cuenta. | BASE §11 | Núcleo | O5 | Informado | El pago a cuenta aparece como crédito disponible con su origen. |
| RF-COB-037 | Reasignar imputaciones con autorización: reversa de la imputación original y nueva imputación, ambas trazables. | BASE §11 | Estándar | O5 | Informado | La reasignación no altera el recibo original y queda con aprobador. |
| RF-COB-038 | En cuenta unificada, imputar entre servicios solo según la política vigente o la elección expresa del socio; nunca por inferencia. | BASE §44.5, §44.8, AGR-012 | Núcleo | O5 | Adoptado (PA-COB-03 respondida, DEC-049) | Un pago imputado expresamente a agua no reduce internet. |
| RF-COB-039 | Imputar el cupón de pago único a cada factura incluida con la misma regla de FAC-008. | MER-019, BASE §103.6 | Núcleo | O5 | Informado | Pagar el cupón cancela las facturas del cupón según la regla y deja trazado cada ítem. |
| RF-COB-040 | Aplicar créditos (NC, anticipos, saldos a favor) contra débitos abiertos por orden de vencimiento, excluyendo los créditos marcados como de imputación no automática; en lote o por cuenta. | RN-05 §13.5, §13.13.3; INV `frmCancelacionAutomatica` | Estándar | O5 | Adoptado | Con débitos ≥ créditos, se consumen todos los créditos; el último débito queda parcial solo si cubre recargos. |
| RF-COB-041 | Control de concurrencia: si el saldo cambió entre la consulta y la confirmación, rechazar la operación y recalcular. | RN-05 §3.4 paso 8 | Núcleo | O5 | Adoptado | Dos cajeros cobrando la misma factura: el segundo recibe conflicto 409 y la deuda actualizada. |
| RF-COB-042 | Explicar cada imputación con la política y versión aplicada, el orden, el componente y el autor. | AGR-011 | Núcleo | O5 | Adoptado | Desde el recibo se ve por qué cada peso fue a cada obligación. |

### 5.4 Saldos a favor, anticipos, excedentes y cobros no identificados

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-COB-043 | Registrar saldos a favor con origen (excedente, anticipo, pago a cuenta, pago duplicado, redondeo, NC, anulación de imputación, reversión, retención en exceso), cuenta, servicio, importe y saldo disponible. | AGR-012, DFA M9, CAT `ANTICIPOS` | Núcleo | O5 | Adoptado | Cada saldo a favor tiene origen y documento vinculado. |
| RF-COB-044 | Ante un excedente, cancelar la obligación y dejar el resto como saldo a favor o pendiente de aplicación según la política aprobada. | AGR-012, ESC-01 | Núcleo | O5 | A validar (PA-COB-04) | ARS 15.000 sobre factura de ARS 13.000: cancelada y ARS 2.000 a favor o pendiente. |
| RF-COB-045 | No aplicar un excedente ni un saldo a favor a otro titular, conviviente o servicio por inferencia (dirección, nombre parecido, imagen de comprobante). | AGR-012, ESC-01 | Núcleo | O5 | Adoptado | En ESC-01 la deuda del hermano B no se reduce. |
| RF-COB-046 | Gestionar una bandeja de cobros no identificados con canal, importe, referencia, datos del pagador, evidencia, responsable, antigüedad, identificación y aplicación autorizada. | AGR-012, DFA M10 mejora | Núcleo | O5 | Adoptado | Ningún cobro no identificado queda sin responsable; la antigüedad se reporta. |
| RF-COB-047 | Exigir para la identificación datos verificables (identificador de pago, cuenta, CUIT/DNI del pagador, referencia bancaria); el nombre, el domicilio o una imagen no bastan. | AGR-012, BASE §39.4 TRA | Núcleo | O5 | Adoptado | La API de identificación rechaza aplicar sin al menos un dato verificable o aprobación expresa. |
| RF-COB-048 | Tratar el pago anterior a la factura como anticipo que se aplica al emitirse la obligación según política. | AGR-012 | Estándar | O5 | Adoptado | Al emitirse la factura, el anticipo se imputa automáticamente si es aplicable. |
| RF-COB-049 | Ante un pago de ente o pasarela sobre un comprobante ya cancelado por otra vía, crear un saldo a favor en la cuenta pagadora, con marca de imputación no automática configurable y visible en el resultado de la importación. | RN-05 §4.6, §5.4; V2 3176 | Núcleo | O5 | Adoptado | El duplicado no se pierde ni se aplica a otra cuenta; queda listado en el resultado. |
| RF-COB-050 | Crear anticipos manuales con concepto, importe, vencimientos, porcentaje de aplicación parcial, aplicación en facturación futura e imputación no automática. | INV `frmAnticipo`, `ModoAnticipo` | Estándar | O5 | Adoptado | El anticipo manual genera recibo y saldo a favor; requiere caja abierta si ingresa dinero. |
| RF-COB-051 | Generar saldo a favor por redondeo en cobros en efectivo cuando el tenant lo habilite, con importe máximo. | RN-05 §3.3, §13.5; V2 3054-3056, 3069, 3070, 739, 3055 | Extensión | O5 | Adoptado | No se genera si la cuenta adeuda débitos de redondeo previos. |
| RF-COB-052 | Permitir que el saldo a favor se descuente en la próxima factura (M05 lo aplica como crédito al emitir) cuando el tenant lo configure. | V2 2651 | Estándar | O5 | Adoptado | La factura siguiente muestra el crédito aplicado y el saldo a favor se consume. |
| RF-COB-053 | Recibir transferencias informadas por el socio o el cajero (con comprobante adjunto) en estado pendiente de verificación hasta que M14 confirme la acreditación o un operador la verifique según el circuito acordado. | BASE §39.4 TRA, §97.6 | Núcleo | O5 | Informado | Una imagen de comprobante no cancela deuda por sí sola. |
| RF-COB-054 | Explicar cada peso recibido como cancelación, crédito o pendiente en un reporte por período y canal. | AGR-012 criterio | Núcleo | O5 | Adoptado | Recibido = imputado + saldos a favor + no identificados + devoluciones, sin diferencia. |

### 5.5 Caja

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-COB-055 | Administrar cajas (puestos) por sucursal y tipo (ventanilla, virtual de ente, cobrador, canal digital), con caja fija opcional por usuario y número automático. | RN-05 §2; CAT `CAJASJP`; V2 129 | Núcleo | O5 | Adoptado | Las cajas virtuales de entes y canales no se asignan a cajeros. |
| RF-COB-056 | Abrir la sesión de caja por operador con fondo inicial por moneda y observación. | BASE §12, RN-05 §13.1; INV `frmAperturaCaja` | Núcleo | O5 | Informado | CU-12: CAJ-01 abierta con ARS 20.000. |
| RF-COB-057 | Exigir sesión abierta para cobrar, anular o egresar; seleccionar la caja si el usuario tiene varias. | RN-05 §2, §3.5; INV `frmSeleccionCaja` | Núcleo | O5 | Adoptado | Sin sesión abierta la API responde 409 `cob.caja.sesionCerrada`. |
| RF-COB-058 | Buscar la deuda por código de barras, identificador de pago, comprobante (tipo, punto de venta, número), cuenta, titular (id, nombre, DNI/CUIT), cupón o QR del socio; elemento de búsqueda por defecto configurable. | V2 323, 2524; DFA M10 mejora "caja web"; INV `ConsultaDeuda`, `frmComprobantePorCuenta` | Núcleo | O5 | Adoptado | La lectura del código de barras de una factura propia la carga en menos de 1 s. |
| RF-COB-059 | Decodificar todos los formatos de código de barras e identificadores vigentes para el tenant, incluidos los de transición publicados por ProCoop. | RN-11 implicancia 4, FIC 4.3 | Núcleo | O5 | Adoptado | Las facturas emitidas por ProCoop antes del corte se cobran en caja CoopApps. |
| RF-COB-060 | Listar la deuda a cobrar: facturas, cuotas, cupones, saldos a favor (con signo crédito), recargo por vencimiento obtenido de M08, modo de diferir, cuotas y total marcado. | RN-05 §3.1 | Núcleo | O5 | Adoptado | La lista se ordena por vencimiento ascendente; el orden automático se puede quitar si V2 2687. |
| RF-COB-061 | Mostrar advertencias de tipo error (impiden cobrar) o aviso al seleccionar la cuenta: comprobante bloqueado, nota con bloqueo de caja, nota con mensaje, deuda notificada incompleta, titular notificado, deuda antigua, deuda antigua del servicio, deuda vencida en otras cuentas, servicio desconectado, orden de desconexión pendiente, saldo a favor disponible. | RN-05 §3.2, §13.2; V2 302, 321, 324, 375, 187, 2411, 2909, 2932; INV `frmCobranza_Validaciones` | Núcleo | O5 | Adoptado | Cada advertencia muestra la regla y si es bloqueante. |
| RF-COB-062 | Calcular el recargo invocando a M08 con la fecha de cobro (o fecha de cálculo fija configurada) y permitir cambiar el recargo diario o no cobrarlo con permiso, dejando registro. | RN-05 §3.3; V2 1030, 2487, 3135 | Núcleo | O5 | Adoptado | Cambiar el recargo sin `cob.caja.cambiarRecargo` es imposible; el cambio queda auditado. |
| RF-COB-063 | Aplicar el modo de diferimiento del recargo (no diferir, diferir solo mora, diferir todo) según tenant, canal o ente; informar a M08 lo diferido para su ND posterior. En el pago online de una factura vencida el interés se difiere por defecto a la próxima factura, configurable por canal (DEC-051). | RN-05 §3.3, MER-019; V2 1011 | Núcleo | O5 | Informado | Con "diferir todo", el cobro cancela capital y M08 recibe el recargo diferido. |
| RF-COB-064 | Cobrar uno o varios documentos, de una o varias cuentas del mismo titular u otros titulares, en una operación. | BASE §12 | Núcleo | O5 | Informado | Una operación con dos cuentas emite un recibo por cuenta (o uno por operación si se configura); si las cuentas son de entidades jurídicas distintas, siempre un recibo por entidad (RF-COB-193, DEC-087). |
| RF-COB-065 | Combinar medios de pago: efectivo (multimoneda con cotización), cheque de terceros, transferencia, tarjeta de débito o crédito (cupón, autorización, cuotas), QR, retención sufrida y saldo a favor. | BASE §12, RN-05 §3.4 paso 7; INV `frmCargaMedioDePago`, `FormasPago` | Núcleo | O5 | Informado | La suma de medios es igual al total cobrado más el vuelto. |
| RF-COB-066 | Calcular vuelto (proporcional, desde el último ingreso o sin vuelto según tenant) y ofrecer donar el vuelto. | V2 1001, 1012, 1015, 2248; INV `IgnorarVueltoAutomatico` | Estándar | O5 | Adoptado | Sin vuelto habilitado, un efectivo excedente queda como saldo a favor con aviso. |
| RF-COB-067 | Aplicar recargo por medio de pago (tarjeta con cuotas, transferencia, valores a fecha) como concepto facturable vía M05 según plan de tarjeta configurado. | CAT `TARJETAS_RECARGO`; V2 2069, 2070, 486, 487 | Estándar | O5 | Adoptado | El recargo se muestra antes de confirmar y genera su comprobante. |
| RF-COB-068 | Cobrar con QR de caja: dinámico por operación o estático por puesto; en ambos casos con referencia única por transacción. | RN-05 §2, §13.7; RN-13 §3.4; V2 2772, 2803, 2920, 2939 | Estándar | O5 | Adoptado | Dos socios que pagan el mismo importe el mismo día en el mismo puesto se asignan sin ambigüedad. |
| RF-COB-069 | Aplicar descuentos en caja por pronto pago por tipo de factura o servicio y rango de días, sin superposición y con tope 100 %, documentados como bonificación (NC o ítem de M05), opcionalmente solo para socios. La regla vive en `earlyPaymentDiscountRules` de M08 (CTR-DAT-40). | RN-05 §13.5; CAT `DESCUENTO_CAJA`; INV `abm_DescuentoCaja` | Estándar | O5 | Adoptado | La caja no modifica precios: el descuento genera su documento. |
| RF-COB-070 | Registrar retenciones sufridas en el cobro (tipo, régimen, número de certificado, fecha, importe, adjunto) como medio que cancela deuda. | DFA M10, CAT `RETENCIO` | Estándar | O5 | Adoptado | La retención se informa a M06 y se presenta con la caja. |
| RF-COB-071 | Cobrar conceptos de conexión u otros cargos en caja (precio vigente, importe bloqueado o editable, situación de IVA por defecto, bonificación por cantidad), con comprobante emitido por M05. | RN-05 §13.5; V2 443, 2086; INV `frmConceptosCobrar` | Estándar | O5 | Adoptado | El comprobante se emite y se cobra en la misma operación. |
| RF-COB-072 | Registrar egresos de caja autorizados por pago a proveedor (órdenes de pago de M12/M14), con validación de firmas y marca de entrega. | RN-05 §13.3; V2 144, 207, 2362, 2513, 2988 | Extensión | O8 | Adoptado | El egreso reduce el efectivo teórico y queda vinculado a la orden. |
| RF-COB-073 | Recibir donaciones en caja para entidades habilitadas (nunca, siempre o solo con vuelto). | V2 2248; INV `frmCobranza_Donaciones`; RN-05 §13.5 `Get_Entidades` | Extensión | O5 | Adoptado | La donación genera su comprobante y no se mezcla con la deuda. |
| RF-COB-074 | Cobrar cuotas de vivienda, de obras y de otros servicios sociales como obligaciones genéricas de sus módulos. | RN-05 §13.2; INV `frmCobranza_Vivienda`, `frmCobranza_Obra` | Estándar | O10 | Adoptado | La caja no tiene lógica propia por servicio social. |
| RF-COB-075 | Ser el punto de cobro de la venta prepaga en caja y portal; el cálculo de consumo, retención a cuenta de deuda y bonificación los resuelve M03, y COB imputa la retención a la deuda. | RN-05 §13.8; RN-12 §3; INV `frmVentaPrepaga`, `frmVentaPrepagaRapida` | Estándar | O7 | Adoptado (PA-COB-15 asumida, DEC-072; requerido para migrar LAG, DEC-088; antes "A validar (PA-COB-15)") | La venta prepaga produce un recibo y la carga en M03; si falla la carga, la operación se revierte. |
| RF-COB-076 | Solicitar a M05 la factura electrónica posterior al cobro (ND de recargo cobrado, comprobantes generados en caja) y esperar el CAE antes de imprimir cuando el tenant lo configure. | RN-05 §3.4 paso 12; V2 727, 1056, 2249 | Núcleo | O5 | Adoptado | Con espera activa y ARCA caído, la operación queda en estado pendiente fiscal sin perder el cobro. |
| RF-COB-077 | Notificar el pago al socio por email, WhatsApp o SMS con el recibo (vía T09), según tipo de envío configurado. | RN-05 §3.4 paso 12; V2 2664, 2665, 2674, 2684, 2698, 2719 | Estándar | O5 | Adoptado | El recibo llega en menos de 5 minutos en el canal elegido. |
| RF-COB-078 | Disparar, al confirmar un cobro, la evaluación de reconexión y de cambio de estado de servicios en M08. Por DEC-014, en servicios remotos la reconexión es automática al confirmarse el pago sin deuda vencida del servicio y, si requiere técnico, M08 crea la OT automáticamente; un pago pendiente de confirmación no la dispara (RF-COB-010). | RN-05 §3.4 paso 12, §13.2; V2 2713, 3106, 3112, 2926, 3147, 3113, 2917, 3033, 3163 | Núcleo | O5 | Adoptado | COB publica `cob.obligation.settled` y `cob.payment.confirmed`; M08 decide. |
| RF-COB-079 | Anular una operación de cobro con autorización, validaciones y efectos completos mediante reversos (sección 6.6). | BASE §12, RN-05 §3.5, §13.4, §13.13.2; INV `frmAnulacionOperacion` | Núcleo | O5 | Informado | La anulación no borra nada: el recibo queda Anulado y los saldos se reponen por movimientos. |
| RF-COB-080 | Realizar el arqueo: teórico por medio y moneda; contado declarado por medio (efectivo por denominación opcional, cheques, cupones, retenciones, transferencias); diferencia por medio. | BASE §12, RN-05 §13.1, §13.13.1; INV `frmCierreCaja` | Núcleo | O5 | A validar (PA-COB-08) | CU-12: efectivo esperado ARS 25.000. |
| RF-COB-081 | Registrar diferencias de arqueo con justificación obligatoria y aprobación por encima de un umbral; generar el quebranto de ingreso o egreso. | BASE §12 | Núcleo | O5 | Informado | Una diferencia no se corrige borrando recibos. |
| RF-COB-082 | Cerrar el turno; permitir cierre de varias sesiones o días si el tenant lo habilita; reabrir (anular el cierre) con permiso solo si tesorería no procesó la rendición. | RN-05 §2, §13.1; V2 2688 | Núcleo | O5 | Adoptado | No se reabre una sesión cuya rendición fue recibida por M14. |
| RF-COB-083 | Establecer límites y permisos por cajero: importe máximo por operación, medios habilitados, anular solo operaciones propias, efectivo máximo en caja. | BASE §12, V2 2394 | Estándar | O5 | Informado | Superar el límite pide aprobación de supervisor. |
| RF-COB-084 | Mantener trazabilidad recibo ↔ operación ↔ imputación ↔ medios ↔ sesión ↔ rendición a tesorería. | BASE §12 | Núcleo | O5 | Informado | Desde cualquier entidad se navega a las demás. |
| RF-COB-085 | Operar la caja web desde navegador, con lector de código de barras como teclado, impresión de ticket o recibo por el agente local (T06) y pantalla optimizada para teclado. | DFA M10 mejora; V2 228, 2270, 2364, 2510 | Núcleo | O5 | Adoptado | Un cobro estándar se completa con teclado en no más de 4 pasos. |
| RF-COB-195 | Exponer a M14 el servicio interno de solo lectura `cob.service.getUnremittedCash({ asOf, legalEntityId?, branchIds?, currency? })` con el efectivo y los valores de las **sesiones de caja sin rendir**: sesiones de cajas `counter`, `collector` o `remote` en estado `open`, `closing`, `closed` o `reopened` a la fecha `asOf` (todavía no `handedOver`). Devuelve, por sesión: `cashSessionId`, `cashRegisterId`, `branchId`, `userId` (cajero), `legalEntityId`, `status`, `businessDate`, `openedAt`, `closedAt`, `ageDays` (fecha `asOf` − `businessDate`), `treasuryHandoverId` y su `status` si existe, y `totalsByMethod` [`{ method, currency, amount, count }`] (efectivo, cheques, cupones, retenciones, transferencias), tomado del teórico (`expected`) si la sesión está abierta y del declarado del arqueo (`declared`) si está cerrada; más el total por medio y moneda. Las cajas `agencyVirtual` y `digitalChannel` no se incluyen (su neto se publica como acreditación esperada, RF-COB-170). El servicio se calcula sobre `cashSessions` y `cashOperations` de M07 y no escribe nada; M14 lo invoca y no lee ni copia esas colecciones (RN-DAT-003). Respeta el alcance del usuario que consulta (sucursales). (DEC-101) | DEC-101; aporte A9 de `NucleoTransversal-Modelo` §11.1 | Núcleo | O5 | Adoptado | Con la sesión S1 abierta (teórico ARS 25.000 en efectivo) y S2 cerrada ayer (declarado ARS 12.000 en efectivo y un cheque de ARS 3.000) con rendición `delivered`, el servicio devuelve dos sesiones (antigüedad 0 y 1) y un total de ARS 40.000; cuando M14 acepta la rendición de S2 y la sesión pasa a `handedOver`, deja de devolverla. Una caja `digitalChannel` nunca aparece. |

### 5.6 Recibos

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-COB-086 | Emitir recibo por cuenta corriente (o uno por operación si se configura, nunca mezclando entidades jurídicas: RF-COB-193, DEC-087) de tipo oficial, interno, pago por ente o pago a titular; recibo oficial siempre cuando el tenant lo exija. | RN-05 §3.4 paso 6; V2 2452, 2719 | Núcleo | O5 | Adoptado | Cada recibo lista obligaciones, importe aplicado, saldo previo, recargos separados y medios. |
| RF-COB-087 | Numerar recibos con el servicio de numeración de M05 `fac.service.nextNumber({ legalEntityId, voucherTypeId, pointOfSaleId, idempotencyKey })` (RF-FAC-179, RN-FAC-161; CTR-DAT-74) **por entidad jurídica** del recibo, sin bloqueos globales, serializado por numerador (tipo de recibo + punto de venta de la entidad); una operación con deuda de varias entidades pide un número por entidad (RF-COB-193) y la `idempotencyKey` es `{operationId, legalEntityId}` para que un reintento no consuma otro número. El recibo no pasa por ARCA: su numerador es `authorizationType = none` en M05, su número es definitivo al emitirse y no le aplica la liberación y renumeración de DEC-107 (RN-FAC-164 punto 12; RN-COB-158 punto 6). Texto anterior: "Numerar recibos con el servicio de numeración (M05) sin bloqueos globales, serializado por talonario y punto de venta." | RN-05 §13.3, §13.13.4; RF-FAC-179 | Núcleo | O5 | Adoptado | Diez cajas concurrentes no producen números repetidos ni huecos no explicados; un reintento con la misma operación devuelve el mismo número; un punto de venta de otra entidad se rechaza con `POS_CONFLICT`. |
| RF-COB-088 | Consultar, reimprimir y reenviar recibos (email, WhatsApp, SMS) con plantilla; cobrar la reimpresión según permiso si el tenant lo define. | INV `frmReimpresionRecibos`, `frmImpresiones`; V2 2684, 2698, 2929 | Estándar | O5 | Adoptado | La reimpresión queda registrada con usuario y fecha. |
| RF-COB-089 | Generar recibo en PDF y ticket térmico, con QR de validación del recibo. | DFA M10; INV `frmImpresiones` (`Imprimir_TicketPago`) | Estándar | O5 | Adoptado | El QR abre la validación pública del recibo sin datos personales. |
| RF-COB-090 | Imprimir operación de caja en lugar de recibo o sin vista previa según configuración. | V2 2270, 2364 | Extensión | O5 | Adoptado | La opción se respeta en todos los puestos del tenant. |
| RF-COB-193 | Cobrar en **una sola operación de caja** deuda de varias entidades jurídicas del mismo titular (o de varios titulares), emitiendo **un recibo por entidad jurídica** con la numeración de esa entidad (DEC-087; CTR-DAT-74): los medios de pago se reparten entre los recibos según lo imputado a cada entidad (efectivo y vuelto se asignan al recibo de mayor importe salvo elección del cajero), la operación conserva un único `operationId` y un único ticket resumen, y la anulación de la operación anula todos sus recibos. La opción "un recibo por operación" (PRM-COB-065) nunca mezcla entidades. | DEC-087; DEC-064; CTR-COB-20 | Núcleo | O5 | Adoptado | Cobro de ARS 13.000 (ARS 8.000 ELE entidad A + ARS 5.000 Internet entidad B) con efectivo y tarjeta: dos recibos (A y B) con numeración propia, suma de medios = 13.000; anular la operación anula ambos. |
| RF-COB-194 | Rendir a tesorería (M14) y contabilizar (M15) por entidad jurídica: el cierre de caja y el traspaso a tesorería totalizan por entidad y medio, y la operación multi-entidad genera, si corresponde, la deuda entre entidades por el dinero recibido en la caja de una entidad por cuenta de otra (evento contable a M15). | DEC-087; DEC-064 | Estándar | O5 | Adoptado | Una caja de la entidad A que cobra ARS 8.000 de A y ARS 5.000 de B informa en el cierre A: 8.000 y B: 5.000, y M15 registra la cuenta entre entidades de ARS 5.000. |

### 5.7 Cobradores y cobranza fuera de oficina

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-COB-091 | Administrar cobradores (persona, zonas, caja virtual propia, límites, medios permitidos, comisión) y generar listas de cobro desde la deuda por zona, ruta o selección. | MER-007 | Estándar | O5 | Informado | La lista toma la deuda vigente con recargo calculado a la fecha prevista. |
| RF-COB-092 | Cobrar en campo desde la PWA con rol cobrador, sin conexión, con recibo provisorio numerado por dispositivo y sincronización posterior con `clientMutationId` y control de duplicados. | MER-007, CNX offline | Estándar | O5 | A validar (PA-COB-14) | Reenviar la misma mutación no duplica el cobro; un conflicto de saldo queda en bandeja. |
| RF-COB-093 | Rendir la cobranza del cobrador: entrega de fondos, conciliación lista vs. cobrado vs. entregado y diferencias. | MER-007 | Estándar | O5 | Informado | La rendición no se cierra con diferencias sin justificar. |
| RF-COB-094 | Liquidar la base de comisión de cobradores por período (importe, porcentaje, mínimo) y enviarla a M16 o M12 para su pago. | MER-007 | Extensión | O10 | Informado | La base coincide con lo rendido y confirmado. |
| RF-COB-095 | Habilitar puntos de cobro remotos (kioscos, estaciones) para venta prepaga y cobro de facturas, como cajas remotas con usuario propio. | MER-007 (R-Pos), V2 714-717, 2489 | Extensión | O7 | Informado | La caja remota opera con límites y rinde como cobrador. |
| RF-COB-096 | Aplicar las reglas de cobranza remota: recargo por cobranza remota con su concepto, importe máximo por factura, solo efectivo, cajas habilitadas. | V2 714, 715, 716, 717, 718, 719; RN-05 §13.5 `AplicarComisionRemota` | Extensión | O7 | Adoptado | El recargo remoto se agrega con su IVA y se informa antes de confirmar. |
| RF-COB-097 | Controlar el efectivo máximo en poder del cobrador y bloquear nuevos cobros en efectivo al superarlo hasta rendir. | MER-007 | Extensión | O5 | Adoptado | Superado el tope, la PWA muestra el bloqueo y el motivo. |

### 5.8 Entes recaudadores

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-COB-098 | Configurar cada ente como datos: convenio, concepto, caja virtual, cuenta bancaria de acreditación (M14), último vencimiento aceptado, admite entregas, modo de diferir recargo, cobrar al primer vencimiento, mora pasado el último vencimiento, interés diario forzado a cero, comisión (fija por comprobante o porcentaje con mínimo y máximo, trasladable al usuario), forma de registración bancaria, conciliación automática, forma de identificar el comprobante, layouts de envío y rendición, archivo de control, canal de intercambio. | RN-05 §4.1, §11.4; INV `abm_Bancos`, `FrmEntidades`, `FrmEntidades_Config` | Núcleo | O5 | Adoptado | Dar de alta un ente nuevo de una familia conocida no requiere desarrollo. |
| RF-COB-099 | Proveer un motor declarativo de layouts versionado (cabecera, detalle, pie, posición, largo, decimales implícitos, relleno, formatos de fecha incluida juliana, signo, cálculo de totales y contadores) con las familias Red Link (continua y por lote), Banelco/PMC, Pago Fácil, Rapipago, Cobro Express, SIRO (archivo), débitos Visa/Mastercard/Fiserv (DEBLIQC/DEBLIQD/DEBLIMC), Tarjeta Naranja/NaranjaX, débito directo CBU, Mercado Pago CSV, Macro archivo, ProntoPago QR y bancos. Cada layout de exportación declara cuántos vencimientos admite (`fileLayouts.dueDateCapacity` de T06), que se copia al ente (`collectionAgencies.dueDateCapacity`) y valida el tope de vencimientos de M05 (RN-COB-159; DEC-106). | RN-05 §4.2, §5, §6.2, §11.3, §13.10; FIC 4.4; DEC-106 | Núcleo | O5 | Adoptado | Cada familia tiene un archivo de prueba que el motor genera o lee bit a bit igual que ProCoop. Un layout que admite 2 vencimientos exporta los vencimientos 1 y 2 de una obligación que tiene 5. |
| RF-COB-100 | Generar un identificador de pago autocontenido y estable por obligación, cupón, cuota, aviso de deuda e intención, con dígito verificador, y entregarlo a M05 para imprimir y a los entes para publicar. | RN-05 §4.3, §11.2; RN-11 implicancia 3 | Núcleo | O5 | Adoptado | La rendición se resuelve sin depender del importe. |
| RF-COB-101 | Exportar la deuda al ente con selección (saldo > 0, sin créditos) y filtros: período, emisión, vencimiento, tipos de comprobante y servicio, empresa de reparto, excluir adheridos a débito, incluir pagados, excluir titulares con deuda, importe máximo, excluir bloqueados, incluir cupones y cuotas; con validación de saldo para facturas con pago parcial. Solo se exportan obligaciones con `fiscalGate` `authorized` o `notRequired` (RN-COB-158; DEC-107) y, de cada una, los primeros N vencimientos que admite el ente (RN-COB-159; DEC-106). | RN-05 §4.4; V2 2267, 3092, 2686; INV `frmArchivoEntidadesRecaudadoras`, `ConsultaFacturacionEntidad`; DEC-106; DEC-107 | Núcleo | O5 | Adoptado | Una factura con pago parcial se publica por su saldo cuando el layout valida saldo. Una factura pendiente de CAE no se exporta; al autorizarse entra en la exportación siguiente. |
| RF-COB-102 | Mantener el registro de deuda publicada por ente con índice único por (período, concepto, identificador) para Red Link y SIRO, sin reinformar un comprobante ya publicado salvo actualización. | RN-05 §4.4; CAT `RED_LINK`, `DEUDARED`, `DEUDARED_TIPO`; V2 2966 | Núcleo | O5 | Adoptado | Reexportar el mismo período no duplica registros en el ente. |
| RF-COB-103 | Generar el archivo de control adicional cuando el layout lo requiera (Red Link) y nombrar archivos según la regla del layout, sin sobrescribir. | RN-05 §5.1, §13.10 | Núcleo | O5 | Adoptado | Dos exportaciones el mismo día producen nombres distintos. |
| RF-COB-104 | Generar automáticamente el archivo de deuda tras cada lote de facturación y, en modalidad continua, diariamente con las novedades. El archivo del lote incluye solo los comprobantes ya autorizados (CAE, CAEA vigente asignado o CESP); los que se autorizan después, o se reemiten tras volver a borrador, entran en la novedad siguiente (RN-COB-158; DEC-107). | DFA M10 mejora; FIC 4.1; DEC-107 | Núcleo | O5 | Adoptado | El job se dispara con `fac.billingRun.issued` (EVT-FAC-05) y deja el archivo listo para T06; un lote con 2 comprobantes rechazados por ARCA exporta solo los autorizados. |
| RF-COB-105 | Informar la base de deuda por API cuando el ente lo ofrezca (SIRO) y consultar su estado (registros correctos, erróneos, totales). | RN-05 §5.2; RN-13 §4.2; CAT `SIRO_BASEDEUDA`; INV `frmBaseDeudaSiro`, `frmConsultaBaseDeudaSiro` | Núcleo | O5 | Adoptado | El resultado de la base queda registrado y los errores por registro son visibles. |
| RF-COB-106 | Importar la rendición (archivo cargado, SFTP o API) validando convenio, fecha de presentación no futura, cantidad e importe del pie. | RN-05 §4.5; RN-11 §1.1 | Núcleo | O5 | Adoptado | Un convenio distinto rechaza el archivo completo con el mensaje del ente. |
| RF-COB-107 | Validar cada registro de rendición: comprobante inexistente o anulado; ya pagado por el mismo ente (informativo) o por otra vía (saldo a favor); pasado el último vencimiento aceptado; importe mayor o menor con tolerancia; entrega mínima; duplicados en el archivo; titular notificado; comprobante bloqueado. | RN-05 §4.6, §11.5 | Núcleo | O5 | Adoptado | Cada registro queda con resultado OK, advertencia o error y su motivo. |
| RF-COB-108 | Presentar el resultado de la importación como log revisable antes de confirmar; confirmar solo registros OK o seleccionados; los errores pasan a la bandeja de excepciones. | RN-05 §4.7, §11.5; INV `frmResultadoImpEntidades` | Núcleo | O5 | Adoptado | Nada se imputa hasta confirmar; un error no bloquea el resto. |
| RF-COB-109 | Registrar la rendición confirmada en la caja virtual del ente, con medio transferencia por el total a la cuenta del ente, comisión del ente, fecha de cobro y fecha de acreditación o rendición. | RN-05 §4.7; V2 2646, 3023 | Núcleo | O5 | Adoptado | La acreditación esperada se publica a M14 por el neto. |
| RF-COB-110 | Impedir reimportar el mismo archivo (huella) y reaplicar un registro ya aplicado. | AGR-016 | Núcleo | O5 | Adoptado | Subir dos veces el mismo archivo devuelve el resultado de la primera importación. |
| RF-COB-111 | Importar el archivo de morosidad del ente (Tarjeta Naranja) y emitir su informe. | RN-05 §13.10; INV `frmArchivoMorosidad` | Extensión | O5 | Adoptado | Valida el comercio contra el convenio del ente. |
| RF-COB-112 | Importar archivos de novedades de adhesión del ente (alta, baja, modificación) con layout propio. | RN-05 §6.1; INV `frmArchivoNovedades` | Estándar | O5 | Adoptado | Las novedades se aplican solo a cuentas del mismo ente o sin ente. |
| RF-COB-113 | Aceptar pagos fuera de término según el ente (sin tope o hasta el vencimiento configurado) con el recargo que corresponda. | RN-12 §2, RN-05 §4.6 | Núcleo | O5 | Adoptado | Configuración LAG: todos los entes aceptan sin tope. |
| RF-COB-114 | Facturar al usuario la comisión del ente cuando el ente la traslade (vía M05, concepto configurado). | RN-05 §4.7; V2 360 | Extensión | O5 | A validar (PA-COB-17) | La comisión trasladada genera su comprobante y se informa al socio. |
| RF-COB-115 | Registrar los rechazos informados por los entes con código y causa, y devolver a deuda lo rechazado. | CAT `RECHAZOS` (FIC 4.1); FIC 6 | Núcleo | O5 | Adoptado | La obligación rechazada vuelve a Pendiente por movimiento de reversión. |
| RF-COB-116 | Procesar automáticamente las rendiciones a una hora configurable, con aviso de errores por email al responsable. | V2 2994, 2995, 3025 | Estándar | O5 | Adoptado | El job deja el resultado en estado "pendiente de confirmar" o confirma solo si el ente tiene confirmación automática. |
| RF-COB-117 | Renombrar o mover el archivo procesado en el origen cuando el canal lo permita. | V2 3005 | Extensión | O5 | Adoptado | El archivo procesado no se vuelve a tomar. |
| RF-COB-118 | Soportar entes sin interfaz (cartera de documentos a cobrar) como caja o cartera con registro manual. | RN-12 §2 (DOCUMENTOS A COBRAR) | Estándar | O5 | Adoptado | El ente sin layout no ofrece exportar ni importar. |

### 5.9 Débito automático

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-COB-119 | Registrar adhesiones (mandatos) por cuenta o servicio: ente o tarjeta, medio (CBU de 22 dígitos validado o tarjeta tokenizada/enmascarada), titular del medio, CUIT del titular del CBU, período desde, fecha de alta, estado. | RN-05 §6.1; FIC 6; CAT `DEBITO_EXCLUSION`, `ADHSOC` | Núcleo | O5 | Adoptado | Un CBU con dígitos verificadores inválidos se rechaza. |
| RF-COB-120 | Dar de alta adhesiones por operador, por el socio en el portal o por API del proveedor (Pagos360), con estados Pendiente de firma, Activa, Cancelada, Error. | RN-05 §6.1, RN-13 §3.5; INV `frmPagos360_DebitosAutomaticos` | Núcleo | O5 | Adoptado | La adhesión solo debita cuando está Activa. |
| RF-COB-121 | Excluir del débito tipos de facturación o servicios por cuenta. | RN-05 §6.1; CAT `DEBITO_EXCLUSION` | Estándar | O5 | Adoptado | Una factura de un tipo excluido no entra en la presentación. |
| RF-COB-122 | Generar la presentación por ente con las obligaciones elegibles, fecha de débito y regla de corte (día del vencimiento a partir del cual pasa al mes siguiente). | RN-05 §6.2; RN-13 §3.5; V2 2779; INV `frmArchivosDebitosAutomaticos` | Núcleo | O5 | Adoptado | Con corte 19 y vencimiento día 20, la tarjeta se debita el mes siguiente. |
| RF-COB-123 | Importar la rendición de débitos: aceptados se registran como cobro; rechazados con código (R08, R09, R10 y los del ente) vuelven a deuda visible y se notifica al socio. | RN-05 §6.2; FIC 6; INV `frmArchivoDebitosAutomaticos` | Núcleo | O5 | Adoptado | La obligación rechazada no queda como cobrada en ningún reporte. |
| RF-COB-124 | Reintentar débitos rechazados de forma controlada según código de rechazo y política (cantidad, intervalo), sin reintentar los rechazos definitivos. | BASE §39.4 DEB | Estándar | O5 | Informado | Un rechazo por "orden de no pagar" no se reintenta. |
| RF-COB-125 | Cobrar al primer vencimiento el débito sin rechazos previos. | RN-05 §6.2 | Estándar | O5 | Adoptado | El débito exitoso en la primera presentación no paga recargo. |
| RF-COB-126 | Permitir el pago voluntario de obligaciones adheridas por otros canales según política (no permitir, siempre, solo con recargo). | V2 63, 3047 | Estándar | O5 | Adoptado | Si se pagó por otro canal antes de la presentación, la obligación se excluye del lote. |
| RF-COB-127 | Excluir por defecto las obligaciones adheridas de la publicación a otros entes. | RN-05 §4.4 | Estándar | O5 | Adoptado | Configurable por ente. |
| RF-COB-128 | Dar de baja la adhesión, cancelándola en el proveedor cuando corresponda, con fecha de baja. | RN-05 §6.1; RN-13 §3.5 | Núcleo | O5 | Adoptado | Tras la baja, la cuenta no entra en la siguiente presentación. |
| RF-COB-129 | Impedir que una obligación esté a la vez en dos presentaciones o intenciones activas. | RN-05 §13.7 `Validar_Insert` | Núcleo | O5 | Adoptado | La segunda inclusión se rechaza con la referencia a la primera. |
| RF-COB-130 | Informar a M05 la adhesión vigente para la leyenda en la factura y al portal para el estado del socio. | FIC 6 | Estándar | O5 | Adoptado | La factura de un adherido muestra la leyenda de débito. |

### 5.10 Pagos online y pasarelas

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-COB-131 | Definir una interfaz única de conector (crear intención, consultar, listar cobranzas por rango, cancelar, devolver, adherir débito, emitir débito, listar contracargos, generar QR) con capacidades declaradas por conector. | RN-13 §19.2; FIC 5.2 | Núcleo | O5 | Adoptado | Ningún conector expone operaciones no soportadas: la UI las oculta según capacidades. |
| RF-COB-132 | Implementar adaptadores SIRO (botón, base de deuda, rendición, QR), Pagos360 (link, QR, débito, reportes, contracargos) y Mercado Pago (Checkout Pro) en O5; Macro, NaranjaX, PayFun, Pagos TIC, SiPago, Helipagos, ProvinciaNet, ProntoPago y OffLine bajo demanda (en la ola en que un tenant los pida o los requiera para su corte de migración; sin pedido, O11; T06 CTR-INT-23). Red Link también en O5 (DEC-015). | RN-13 §1, §19.1; RN-12 §3 | Núcleo | O5 | Adoptado (DEC-015) | Cada adaptador pasa la batería de pruebas de contrato del conector. |
| RF-COB-133 | Guardar credenciales por tenant y conector en la bóveda (T06), con ambiente sandbox o producción y URL base configurables; nunca en parámetros, logs ni respuestas. | RN-13 §17, §19.2; DEC-001 | Núcleo | O5 | Adoptado | Un volcado de logs no contiene secretos. |
| RF-COB-134 | Modelar una intención de pago única con tipo (factura, cupón único, cuota, prepaga, web, caja, link, manual, débito, archivo), ítems, importes por vencimiento, medios permitidos, vencimiento y estado. | RN-05 §7.1; RN-13 §2.2, §19.2 | Núcleo | O5 | Adoptado | Todos los conectores usan la misma intención. |
| RF-COB-135 | Calcular importes por vencimiento con M08 al crear la intención y vencerla al último vencimiento o plazo configurado. | RN-13 §3.3, §19.2; V2 905, 908, 914 | Núcleo | O5 | Adoptado | Una intención vencida no se puede pagar y se cancela en el proveedor si lo soporta. |
| RF-COB-136 | Reutilizar una intención vigente idéntica (mismo importe, pagador, conector, medios y obligaciones) dentro de una ventana configurable. | RN-05 §7.1, §13.6 | Estándar | O5 | Adoptado | Dos clics seguidos en "Pagar" devuelven el mismo link. |
| RF-COB-137 | Aplicar monto mínimo para pagar online y descartar intenciones por debajo del umbral. | RN-05 §7.2; V2 906 | Estándar | O5 | Adoptado | Una intención de ARS 8 se rechaza con mensaje. |
| RF-COB-138 | Configurar medios, marcas de tarjeta y cuotas excluidas por canal (caja, prepaga, entidad, portal). | RN-13 §3.3; V2 909, 2389, 2390, 2677, 2720, 2743 | Estándar | O5 | Adoptado | El checkout solo ofrece los medios habilitados. |
| RF-COB-139 | Recibir webhooks en un endpoint propio por conector y tenant, validar firma cuando el proveedor la ofrezca, persistir el evento crudo y tratarlo como disparador: siempre reconsultar al proveedor antes de confirmar. | RN-13 §2.3, §19.3 | Núcleo | O5 | Adoptado | Un webhook falsificado no confirma ningún pago. |
| RF-COB-140 | Ejecutar conciliación diaria contra el reporte o listado del proveedor con ventana configurable (por defecto 4 días) y alta de pagos sin intención previa. | RN-13 §2.3, §3.3, §19.3 | Núcleo | O5 | Adoptado | Un pago cuyo webhook se perdió se registra al día siguiente. |
| RF-COB-141 | Deduplicar por identificador de pago externo: una notificación repetida no crea otro cobro. | BASE §13, CU-13; RN-13 §3.3 | Núcleo | O5 | Informado | CU-13: notificación repetida sin segundo pago. |
| RF-COB-142 | Marcar como "Resultado incierto" toda operación sin respuesta concluyente; no reenviar, recrear ni volver a cobrar sin conciliar con el proveedor. | §105 solución 6, AGR-016, ESC-04 | Núcleo | O5 | Informado | Tras restaurar un respaldo, el sistema consulta identificadores externos antes de cualquier reenvío. |
| RF-COB-143 | No considerar el retorno a la página de éxito ni datos del navegador como prueba de cobro. | BASE §13, §40.4 | Núcleo | O5 | Informado | La URL de éxito solo muestra "estamos confirmando tu pago". |
| RF-COB-144 | No almacenar datos completos de tarjeta: usar formularios alojados y tokenización del proveedor; guardar solo token, marca y últimos 4 dígitos. Cada conector declara su modo de captura (`cardDataMode`) y el alcance PCI de CoopApps es SAQ A (DEC-091). | §105 solución 6; RN-13 §3.7, §17; DEC-091 | Núcleo | O5 | Informado | Ninguna colección, log, cola ni archivo generado contiene PAN, vencimiento ni código de seguridad (barrido de patrones de PAN con Luhn sobre bases, logs y archivos de presentación). |
| RF-COB-145 | Crear y enviar links de pago por WhatsApp, email o SMS desde caja, cuenta corriente, CRM o portal, con plantilla. | DFA M10 mejora; INV `frmCobranza_LinkPagos360`; V2 2620, 2645 | Núcleo | O5 | Adoptado | El link enviado lleva la intención y vence según configuración. |
| RF-COB-146 | Generar QR interoperable en facturas (masivo por lote, con errores por intención y reintento) y en el portal. | RN-13 §3.3, §15; RN-05 §13.7 | Estándar | O5 | Adoptado | El lote informa QR generados y fallidos. |
| RF-COB-147 | Registrar por transacción bruto, comisión bruta, comisión neta, IVA de la comisión, neto, canal, fecha de pago y fecha de acreditación disponible. | BASE §13, RN-13 §3.2; CAT `PAGOS360_PAGOS` | Núcleo | O5 | Informado | CU-13: bruto ARS 8.000, comisión ARS 160, neto ARS 7.840. |
| RF-COB-148 | Ante diferencia entre importe pagado y esperado, aceptar el pago confirmado, imputarlo con la política vigente y enviar la diferencia a revisión. | RN-13 §19.2 | Núcleo | O5 | A validar (PA-COB-05) | Un pago confirmado nunca queda sin registrar por "importes no coinciden". |
| RF-COB-149 | Mostrar el estado por conector y tenant (operativo, degradado, credencial vencida, caído) y una bandeja de operaciones detenidas con causa accionable. | AGR-021, AGR-016 | Núcleo | O5 | Adoptado | Un certificado vencido marca solo ese conector, no todos los socios. |
| RF-COB-150 | Notificar a la caja en tiempo real la confirmación de un QR; consulta corta de respaldo hasta 10 minutos. | RN-13 §2.3, §19.3 | Estándar | O5 | Adoptado | El cajero ve "pagado" sin refrescar. |
| RF-COB-151 | Vencer y depurar intenciones no pagadas (registradas sin pago) y cancelarlas en el proveedor cuando lo soporte. | RN-12 §3, RN-05 §13.7 | Estándar | O5 | Adoptado | Las intenciones vencidas no figuran como deuda en trámite. |
| RF-COB-152 | Permitir pagar online facturas, resumen, cupón único, cuotas y venta prepaga desde portal y app (M19), y pagar sin login con identificador de pago cuando el tenant lo habilite. | BASE §53 (landing), DFA M10 mejora, RN-12 §5 | Núcleo | O5 | Adoptado | El pago sin login no expone datos personales más allá de importe y servicio. |
| RF-COB-153 | Limitar los días desde el último vencimiento en que se puede pagar online y el pago pasado el tercer vencimiento. | V2 905, 914, 3144, 3199, 2869, 3006 | Estándar | O5 | Adoptado | Pasado el límite, el portal ofrece contactar a la cooperativa. |

### 5.11 Cupón de pago único

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-COB-154 | Emitir cupón de pago único (código de barras, QR y código electrónico) que cancela en un acto varias facturas del resumen, con vigencia y anulación si no se paga. | MER-019, BASE §103.6 | Núcleo | O5 | Informado | El cupón se paga en caja, ente o pasarela y cada factura queda imputada. |
| RF-COB-155 | Migrar los talones sumados y cuotas vigentes de ProCoop como cupones equivalentes. | RN-05 §4.3; CAT `TALONFAC_PAGO` | Estándar | O7 (DEC-089; antes O11) | Adoptado | Un talón ProCoop rendido después del corte se imputa en CoopApps. |
| RF-COB-156 | Exigir el pago completo del cupón en caja o anularlo automáticamente si se paga parcialmente según configuración. | V2 2355, 2337, 2360 | Estándar | O5 | Adoptado | Con exigencia activa, faltar una factura del cupón bloquea la confirmación. |

### 5.12 Devoluciones y contracargos

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-COB-157 | Gestionar el expediente de devolución: solicitud, causa, documento correctivo si corresponde (NC por M05), aprobación, cuenta destino, ejecución financiera (proveedor o M14) y conciliación; una orden repetida no devuelve dos veces. | AGR-013 | Núcleo | O5 | Adoptado | Repetir "ejecutar" con la misma clave no genera un segundo reintegro. |
| RF-COB-158 | Separar el saldo comercial del reintegro pendiente o ejecutado. | AGR-013 | Núcleo | O5 | Adoptado | Emitir un crédito de ARS 2.000 no figura como devuelto hasta la ejecución confirmada. |
| RF-COB-159 | Registrar contracargos y reversiones: reabrir la obligación por movimiento de reversión sin borrar el recibo, y opcionalmente cargar interés diario por reversión y comisión del proveedor como débitos. | AGR-013; BASE CU-13 excepción; RN-05 §13.7; RN-13 §3.6; V2 2999-3002, 3052, 3059, 3073 | Núcleo | O5 | A validar (PA-COB-11) | El recibo original sigue visible; la deuda vuelve con el movimiento de contracargo. |
| RF-COB-160 | Bloquear el pago online de la cuenta tras una reversión cuando el tenant lo configure. | V2 3002 | Estándar | O5 | Adoptado | La cuenta bloqueada solo paga en caja hasta el desbloqueo. |
| RF-COB-161 | Importar contracargos desde el reporte del proveedor o un archivo. | RN-13 §3.6; RN-05 §13.7 | Núcleo | O5 | Adoptado | El job diario detecta los contracargos del día anterior. |
| RF-COB-162 | Reabrir la deuda cuando M14 informe el rechazo de un cupón de tarjeta presentado o de un cheque. | V2 3177; RN-05 §13.12 | Estándar | O5 | Adoptado | La obligación vuelve a Pendiente y se notifica al socio. |
| RF-COB-163 | Evaluar los efectos de devoluciones y contracargos en promociones, mora, financiación y períodos cerrados mediante eventos a M08, M05 y M15. | AGR-013 | Estándar | O5 | Adoptado | Un contracargo sobre un período contable cerrado se registra en el período abierto. |
| RF-COB-190 | Devolver el depósito en garantía (por ejemplo, el del préstamo ortopédico de M18) como **crédito a la cuenta**: al consumir `mor.guarantee.refunded` (EVT-MOR-16) con `refundMode = accountCredit`, crear un saldo a favor con `origin = guaranteeRefund` por el importe a devolver, aplicable a deuda según la política de imputación; el reintegro en dinero solo procede si el titular lo pide, por expediente de devolución (RF-COB-157) y pago de M14. | HUECO-OTR-04; RF-MOR-179; RN-CON-123 | Estándar | O10 | Adoptado | Depósito ORT-DEMO-01 de ARS 20.000 devuelto sin daños: saldo a favor de ARS 20.000 con origen `guaranteeRefund`; reprocesar el evento no crea otro saldo (idempotencia por `guaranteeId`); M15 registra M-133. |

### 5.13 Conciliación de cobranzas y rendición a tesorería

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-COB-164 | Conciliar por canal y día: intenciones o rendiciones vs. pagos confirmados vs. acreditación esperada y real (M14). | BASE §13, DFA proceso de cobro | Núcleo | O5 | Informado | Cada día cerrado tiene acta con diferencias explicadas. |
| RF-COB-165 | Registrar por separado el pago del socio (cancela deuda por el bruto) y el gasto financiero (comisión). | BASE §13 ejemplo, §40.5 | Núcleo | O5 | Informado | La comisión no se resta del importe cancelado por el socio. |
| RF-COB-166 | Enviar las diferencias a revisión con responsable y estado. | BASE §13 | Núcleo | O5 | Informado | Ninguna diferencia queda sin responsable. |
| RF-COB-167 | Conservar la evidencia de cada transacción (respuesta del proveedor, archivo, registro, webhook) con retención definida. | BASE §13 | Núcleo | O5 | Informado | Desde el recibo se descarga la evidencia del canal. |
| RF-COB-168 | Preparar la rendición del cajero a tesorería: carátula, recibos, operaciones, comprobantes cobrados, integridad, cierre teórico, efectivo, valores, cupones, retenciones y transferencias, filtrable por fecha de registración o de pago. | RN-05 §13.1; INV `frmInformePresentacionCajero` | Núcleo | O5 | Adoptado | Tesorería recibe y firma digitalmente la rendición. |
| RF-COB-169 | Al cierre, entregar los cheques a la cartera de M14, presentar automáticamente los cupones de débito y, si se configura, las retenciones. | RN-05 §2, §13.1; V2 2952 | Núcleo | O5 | Adoptado | Los cheques salen de la caja y la anulación de cobros que los contienen queda bloqueada. |
| RF-COB-170 | Publicar a M14 la acreditación esperada por ente o pasarela (neto, fecha, cuenta) para la conciliación bancaria. | DFA proceso de cobro; RN-05 §4.7 | Núcleo | O5 | Adoptado | M14 empareja el movimiento bancario con la expectativa. |
| RF-COB-171 | Configurar por ente la forma de registración en el libro banco: por comprobante, por fecha de acreditación, por caja o por pago. | RN-05 §3.4 paso 7, §4.7; RN-11 implicancia 5 | Estándar | O5 | A validar (PA-COB-10) | El número de movimientos esperados en M14 coincide con la forma elegida. |
| RF-COB-172 | Cerrar la conciliación de un día con acta, responsable y diferencias pendientes trasladadas. | BASE §13, AGR-015 (análogo) | Estándar | O5 | Adoptado | El acta no se cierra ocultando diferencias. |

### 5.14 Efectos contables

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-COB-173 | Publicar eventos económicos con los datos del asiento: medio, caja o ente, cuenta bancaria, servicio, centro de costo, componentes (capital, interés, tributo de terceros), comisión e IVA de comisión. | DEC-009; DFA proceso de cobro paso 4; BASE §75 | Núcleo | O5 | Adoptado | M15 genera el asiento solo con el evento. |
| RF-COB-174 | No contabilizar dos veces por reenvío de una integración o evento. | BASE §75 | Núcleo | O5 | Informado | El evento lleva `operationId` estable. |
| RF-COB-175 | El resumen de cuenta no genera obligación ni ingreso. | BASE §75, §44.4 | Núcleo | O5 | Informado | No existe evento contable de resumen. |
| RF-COB-176 | Informar a M17 el capital social cobrado al cierre de caja cuando corresponda. **Corregido (HUECO-CAP-02):** es solo una conciliación de cierre (capital cobrado en la sesión contra integraciones registradas por M17) sin efecto sobre el auxiliar de capital; la integración la registra M17 al consumir `cob.payment.confirmed` (RN-INS-017). Una diferencia se informa como excepción de conciliación y no genera movimientos de capital. La ola O5 corresponde al mínimo de capital social de DEC-019 (rubros, regla, facturado/pagado, estado de cuenta); el resto del capital social es O10. | RN-05 §2; V2 2543; RN-INS-017; HUECO-CAP-02; DEC-019 | Estándar | O5 (antes O10) | Adoptado | El capital cobrado coincide con las obligaciones de capital canceladas; reprocesar el cierre no crea movimientos en el auxiliar de M17. |

### 5.15 Terceros y operaciones complementarias

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-COB-177 | Cobrar por cuenta de terceros (municipio, otros emisores) por código de barras del tercero, con validaciones (pagos múltiples, importes negativos, vencidos, mínimo), comisión fija o porcentual con mínimo y rendición al tercero. | RN-05 §13.9; CAT `TERCEROS`, `FACTURAS_TERCEROS`; INV `abm_Terceros`, `frmCobranzaTerceros`; V2 2662 | Extensión | O5 | Adoptado | Un comprobante de tercero ya rendido no se puede anular en caja. |
| RF-COB-178 | Consultar y cobrar resúmenes de tarjeta de un tercero mediante servicio autenticado. | RN-13 §14; V2 3114 | Extensión | O10 | Adoptado | El servicio exige autenticación; sin ella el conector no se habilita. |
| RF-COB-179 | Importar obligaciones de otros sistemas para cobrarlas (formatos General, Administración Pública y Comprobante con número), consultarlas y eliminar las no cobradas. | RN-05 §13.10; INV `frmCobranza_ImportarFacturas`, `frmComprobantesAdministracionPublicaRAWConsulta` | Extensión | O5 | Adoptado | Un archivo vacío se rechaza; las importadas quedan identificadas por origen. |
| RF-COB-180 | Definir esquemas de informes de cobranza (productos, servicios e impuestos a incluir). | CAT `ESQUEMAS_INFORMES_COBRANZAS` | Extensión | O5 | Adoptado | El reporte respeta el esquema elegido. |
| RF-COB-181 | Consultar cheques recibidos en caja y controlar número de cheque repetido. | INV `frmCobranza_ConsultaCheques`; V2 2725 | Estándar | O5 | Adoptado | Con el control activo, un cheque con número repetido del mismo banco se rechaza. |
| RF-COB-182 | Auditar cobros con fecha de cobro distinta de la fecha de cálculo del recargo. | RN-05 §13.1 | Estándar | O5 | Adoptado | El informe lista los recibos con fecha retroactiva y su autor. |
| RF-COB-183 | Registrar en la auditoría de T02 cada evento de caja (consulta, cobro, anulación, venta prepaga) con caja, cuenta, valor y descripción. | CAT `COBRANZA_LOG`; RN-05 §13.8 | Núcleo | O5 | Adoptado | El log de caja no se puede modificar. |

### 5.16 Transición desde ProCoop (formatos de la base relevada LAG)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-COB-184 | Proveer un resolutor de transición para la rendición Red Link de LAG: identificación por cuenta + servicio + importe, solo sobre obligaciones impagas, desempate por vencimiento vigente a la fecha de cobro y luego la más antigua; si quedan dos candidatas, no imputar y dejar como no identificado; identificadores sin desborde. | RN-11 §1.1 e implicancia 1; RN-12 §2 | Núcleo | O5 | Adoptado (PA-COB-09 respondida, DEC-050) | Dos meses con igual importe no producen imputación errónea ni anulación de repeticiones. |
| RF-COB-185 | Mantener una tabla de alias de claves externas (código de usuario del sistema anterior, cuentas "cuenta × 100 + servicio", identificadores Red Link de 7 u 8 + 2 dígitos) hacia cuenta y servicio. | RN-11 implicancia 2; RN-05 §4.3 `Comprobante_USUARIO` | Núcleo | O5 | Adoptado | La rendición con clave anterior se resuelve por alias, no por búsqueda libre. |
| RF-COB-186 | Generar los formatos de envío vigentes de LAG: Red Link 19 con identificador de 10 (convenio de 3) y SIRO con el "0" antepuesto al convenio para el código de barras 0447 de 56 dígitos, mientras se acuerda el identificador nuevo. | RN-12 §2, §5; RN-11 §1.2, §1.3 | Núcleo | O5 | Adoptado (PA-COB-09 respondida, DEC-050) | El archivo generado por CoopApps para un período coincide con el de ProCoop. |
| RF-COB-187 | Validar el largo y los topes del código de barras antes de entregarlo a M05 (importe de 7 dígitos, días entre vencimientos) y usar el formato extendido acordado. | RN-11 resumen 4 e implicancia 4 | Núcleo | O5 | A validar (PA-COB-16) | Ninguna factura sale con código vacío sin aviso. |
| RF-COB-188 | Rendir SIRO por API o por archivo según la configuración confirmada con la cooperativa. | RN-12 §2, §6 | Núcleo | O5 | Adoptado | Ambos caminos producen el mismo resultado de importación. |

### 5.17 Reportes

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-COB-189 | Proveer los reportes, indicadores y exportaciones de la sección 15 con fórmula, universo y fecha de corte. | AGR-022; RN-05 §13.1, §13.11; INV `frmTotalesTipoComprobante`, `frmImpresiones` | Núcleo | O5 | Adoptado | Cada reporte declara universo y corte y coincide con el auxiliar. |

## 6. Reglas de negocio

Formato: ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | Verificación.

### 6.1 Invariantes monetarias y auxiliar

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-COB-001 | Todo importe es `Decimal128` con aritmética `decimal.js`; importes a 2 decimales, recargos y prorrateos con regla de redondeo explícita por concepto (half-even por defecto). | Importes `decimal` SQL; tolerancias de 0,02 a 0,06 para cuadrar (RN-05 §3.4 paso 10, §13.1) | Mejorar: cuadre exacto; tolerancias solo en validaciones de rendición declaradas | PRM-COB-001, PRM-COB-002 | — |
| RN-COB-002 | El saldo de una obligación es `amount − Σ allocations(status=active)`; el campo `openAmount` es una proyección no editable que se recalcula en la misma transacción y se verifica en JOB-COB-14. | `FACTURAS.SALDO` y `PAGA` editados por cada proceso (RN-05 §3.4 paso 8) | Reemplazar (AGR-011) | — | — |
| RN-COB-003 | Ningún movimiento ni imputación se borra; la corrección es un movimiento o imputación inversa vinculada (`reversalOf`). | La anulación borra `IT_PAGSO`, `EFEC_OP`, `TRAN_OP`, etc. y guarda histórico (RN-05 §3.5, §13.4) | Reemplazar (BASE §12 regla) | — | — |
| RN-COB-004 | Cada obligación pertenece a un único titular, cuenta, servicio y documento de origen; el comprobante agrupado genera una obligación por servicio (FAC-008). | Un `FACTURAS` por comprobante con `TIPO` de servicio | Mejorar | — | — |
| RN-COB-005 | La moneda es ARS por defecto; el cobro en moneda extranjera se convierte a la moneda de la obligación con la cotización del momento y se guarda importe original y cotización. | `EFEC_OP.TIP_MON`, `COT_PES` (RN-05 §3.4 paso 7) | Replicar | PRM-COB-003 (moneda por defecto de caja, V2 186) | — |
| RN-COB-006 | La fecha efectiva del cobro es la fecha de pago informada por el canal (caja: fecha de operación; ente: fecha de cobro; pasarela: fecha de pago), en la zona horaria del tenant; `recordedAt` es la fecha de registro. | `FechaCobro`, `FechaAcreditacion`, `FECHA_REN` (RN-05 §4.5, §7.2) | Replicar | — | — |
| RN-COB-007 | Ajustes del auxiliar solo con documento (NC/ND de M05) o ajuste interno autorizado con contrapartida y causa codificada. | Créditos/débitos internos libres (RN-05 §13.5) | Mejorar (AGR-011) | PRM-COB-040 | — |
| RN-COB-008 | Un evento de origen (`fac.invoice.issued`, rendición, webhook) se aplica una sola vez: clave de idempotencia por `tenantId` + origen + id externo. | Deduplicación por `ID_360`, `checkearComprobantesInformados`, control 3169 | Mejorar (AGR-016) | — | — |
| RN-COB-009 | Al consumir una NC de M05 vinculada a una factura, se crea un crédito que se imputa primero a la obligación referida (mismo servicio, FAC-009); el excedente queda a favor. | NC como crédito de la cuenta (RN-05 §13.5) | Mejorar | — | — |
| RN-COB-010 | Al consumir la anulación de una factura sin pagos, la obligación pasa a Anulada por movimiento inverso; con pagos, M05 debe emitir NC y COB conserva los pagos como saldo a favor. | `AnularFacturas` desde caja (RN-05 §13.5) | Mejorar | — | — |
| RN-COB-011 | Una obligación incluida en un convenio de M08 queda en estado En convenio y deja de ser exigible por sí; las cuotas son las nuevas obligaciones. No se cobra dos veces (AGR-014). | `DEUDAVTA` + factura original (RN-05 §13.6) | Replicar con control | — | — |
| RN-COB-012 | La consulta de deuda a una fecha pasada = saldo actual + pagos posteriores según fecha elegida (0 fecha de pago, 1 fecha del recibo, 2 fecha de registración). | `Get_DetalleDeuda` (RN-05 §13.11) | Replicar (derivado del auxiliar) | — | — |
| RN-COB-013 | El saldo de cuenta puede ser negativo (a favor) solo por saldos a favor explícitos; un saldo de obligación nunca es negativo. | `SALDO` negativo da error (RN-05 §3.4 paso 8) | Replicar | — | — |

### 6.2 Cuentas, resumen y mínimo

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-COB-014 | La modalidad de cuenta se resuelve en este orden: excepción por titular > por cuenta > por servicio > default del tenant, vigente a la fecha del período. | Grupo Factura por cuenta | Mejorar (FAC-005) | PRM-COB-010, PRM-COB-011 | — |
| RN-COB-015 | Una cuenta unificada agrupa solo obligaciones del mismo titular, tenant y entidad jurídica (RN-COB-151); un titular con varios inmuebles del mismo servicio tiene una cuenta unificada por grupo de facturación. | — | Adoptar | PRM-COB-012 | A validar (PA-COB-02) |
| RN-COB-016 | El resumen es un snapshot inmutable (número, fecha de corte, obligaciones y saldos a esa fecha); sus totales se recalculan desde el auxiliar al emitir y nunca se editan. | Talón sumado con saldo propio recalculado (RN-05 §13.4) | Reemplazar | PRM-COB-013 | — |
| RN-COB-017 | El mínimo de pago se calcula sobre el saldo elegible (capital vencido, cargos autorizados, menos convenios vigentes y reclamos en trámite) según fórmula configurada; su pago se imputa con la política normal y no cancela el resto. | — | Adoptar (CTA-002) | PRM-COB-014, PRM-COB-015 | A validar (PA-COB-06) |
| RN-COB-018 | El incumplimiento del mínimo no ejecuta suspensión: genera evaluación para M08 por servicio, que verifica fundamento, aviso y restricciones (§68). | — | Adoptar | — | — |
| RN-COB-019 | Cambiar la modalidad de cuenta rige desde el período siguiente; no fusiona ni separa documentos emitidos ni resúmenes previos. | — | Adoptar (§44.6, FAC-005) | — | — |
| RN-COB-151 | **Cuenta corriente por titular y entidad jurídica** (DEC-087, PA-DAT-01 asumida la recomendada, DEC-072): la clave de la cuenta es (`holderId`, `legalEntityId`) más la modalidad (servicio o grupo); una obligación se registra en la cuenta cuya `legalEntityId` coincide con la del comprobante; imputaciones, saldos a favor, compensaciones entre servicios y aplicación de NC nunca cruzan entidades. Un saldo a favor de la entidad A solo se aplica a deuda de B mediante devolución en A y cobro en B, ambos documentados. | Empresas de ProCoop (`EMPRESAS`, DEC-064) | Adoptar (DEC-064, DEC-087) | — | Sí: cómo asigna ProCoop la empresa a cada cuenta en la base de la piloto. |
| RN-COB-152 | **Un recibo por entidad jurídica**: una operación de caja, cobrador, ente o pasarela que cancela deuda de varias entidades emite un recibo por entidad, numerado con el talonario o punto de venta de esa entidad (CTR-DAT-74); los medios de pago se asignan a cada recibo hasta cubrir lo imputado a esa entidad, el efectivo y el vuelto van al recibo de mayor importe salvo elección del cajero, y la suma de recibos es igual al total de la operación. Anular la operación anula todos sus recibos; anular un solo recibo exige anular la operación. | Recibo por cuenta (V2 2719) | Adoptar (DEC-087) | PRM-COB-065 | — |
| RN-COB-153 | **Cobro con caja de otra entidad**: cuando la caja pertenece a la entidad A y cobra deuda de la entidad B, el recibo es de B, la sesión registra el ingreso por entidad y el cierre informa a M14 y a M15 los totales por entidad para el traspaso o la cuenta entre entidades. | — | Adoptar (DEC-087) | — | Sí: tratamiento contable de la cuenta entre entidades con el contador de la piloto. |
| RN-COB-154 | **Historia en línea y consulta diferida** (DEC-087, PA-DAT-02): obligaciones, movimientos, imputaciones, recibos y sus PDF permanecen en línea sin límite; el detalle accesorio de más de 36 meses (líneas de rendición, novedades de entes, eventos de pasarela, bitácoras) se consulta en diferido según la política de archivo de T05/T08. Ningún cálculo de saldo ni prescripción depende del detalle archivado. | Sin archivado | Adoptar (DEC-087) | — | — |
| RN-COB-155 | **Cambio de titularidad** (DEC-045): la deuda queda en la cuenta corriente del titular saliente; el alta del nuevo titular abre su propia cuenta corriente desde la fecha del cambio y solo asume deuda anterior mediante convenio de M08 (RN-MOR-147). Al cobrar, la caja advierte la deuda previa asociada al suministro o domicilio, con autorización opcional y sin bloquear ni trasladar la deuda (DEC-029). | — | Adoptar (DEC-045, DEC-029) | — | — |
| RN-COB-156 | **Cupón de pago por entidad jurídica** (DEC-064, DEC-087): un `paymentCoupon` agrupa solo obligaciones de una misma `legalEntityId`; si el estado de cuenta o la selección del titular incluye deuda de varias entidades, se emite un cupón por entidad, cada uno con su referencia de pago y sus importes por vencimiento. El cobro de varios cupones en una operación sigue RN-COB-152. | `TALONFAC` sin entidad | Adoptar (DEC-087) | — | — |
| RN-COB-157 | **Clase de ítem de la obligación** (`itemClass` de M05, RF-FAC-176, RN-FAC-156): M07 recibe la clase en cada obligación y la conserva en imputaciones, recibos y en `cob.payment.confirmed`. Una obligación `guaranteeDeposit` cobrada es un **pasivo reintegrable** con el depositante, nunca ingreso (M15, RN-CON-123): se muestra en el estado de cuenta como "Depósito en garantía (reintegrable)", no se compensa con otra deuda por la política de imputación, no genera interés ni recargo y solo se aplica o devuelve por la liquidación de M08 (RF-MOR-179, EVT-MOR-16) o por RF-COB-190. Las clases `subsidyFundContribution`, `burialRightAcquisition` y `burialRightMaintenance` se cobran como deuda común y viajan a M15 para su rol contable. | Sin clase propia | Adoptar | — | — |
| RN-COB-158 | **Compuerta fiscal de la obligación** (DEC-107; RN-FAC-164 de M05): (1) al consumir `fac.invoice.issued` o `fac.debitNote.issued` de un comprobante que requiere autorización (`requiresAuthorization = true`) M07 registra la obligación con `fiscalGate = pendingAuthorization`; si el comprobante ya llega con CAEA vigente asignado, CESP o CAI, o no requiere autorización, la registra directamente `authorized` o `notRequired`; (2) mientras esté `pendingAuthorization`: no se registra el movimiento `obligation` en el auxiliar, no se cobra en caja ni por canales, no se emite ni publica identificador de pago, no aparece en el portal ni se exporta a entes de cobro (RF-COB-101, RF-COB-104) ni se incluye en débitos automáticos; el estado de cuenta interno la muestra como "pendiente de autorización fiscal"; (3) con `fis.invoice.authorized` (EVT-FIS-01) pasa a `authorized`, se registra el movimiento del auxiliar con la fecha de emisión y queda disponible para cobro y publicación; **vencimientos corridos** (M05 RN-FAC-165; 10-11-2026): si la fecha de autorización es posterior al primer vencimiento de `dueSchedule`, en la misma transacción M07 corre los vencimientos con la regla de M05 (el primero pasa a la fecha de autorización más `fiscalGate.lateAuthorizationGraceDays`, ajustada a día hábil, y los siguientes se corren la misma cantidad de días; los importes no cambian), guarda los originales en `dueScheduleShift` y recién entonces genera identificadores de pago y publica a entes, de modo que el socio nunca recibe un comprobante ya vencido; `fac.invoice.dueDatesChanged` (EVT-FAC-13) con `reason = lateAuthorization` llega con las mismas fechas y no vuelve a correrlas (idempotente por `invoiceId`); (4) con `fac.invoice.returnedToDraft` (EVT-FAC-22) pasa a `released`: no publica ni cobra; con `fac.invoice.renumbered` (EVT-FAC-23) actualiza `sourceDocument.number`; la reemisión (`fac.invoice.issued` con `issueAttempt` mayor) actualiza la misma obligación por `{sourceDocumentId, sourceLineKey}` y vuelve a `pendingAuthorization`; si M05 la descarta (`fac.invoice.annulled`) pasa a `voided` sin movimiento; (5) un `fis.authorization.rejected` no anula la obligación por sí solo: espera la decisión de M05 (EVT-FAC-22); (6) los **recibos** de M07 no pasan por ARCA (`authorizationType = none`, RF-COB-087) y no esperan CAE; solo una factura o ND generada en caja (recargo, conceptos cobrados en caja) sigue esta regla; (7) M07 no renumera ni conoce números provisorios fuera de `sourceDocument`. | ProCoop registra la deuda al facturar y bloquea el cobro con `ID_BLO = -1` hasta el CAE (RN-02 §4.4) | Adoptar (DEC-107) | PRM-COB-066 | — |
| RN-COB-159 | **Vencimientos publicados a un ente** (DEC-106; RN-FAC-163 de M05): (1) M07 publica a cada ente como máximo `collectionAgencies.dueDateCapacity` vencimientos de una obligación: **los primeros N** en el orden de `dueSchedule`; (2) los vencimientos posteriores solo se cobran por los canales que los admiten (caja, portal, pasarela) y la exportación registra cuántos se publicaron (`agencyDebtExports.publishedDueCount` por ítem); (3) M07 expone a M05 el servicio interno `cob.service.agencyDueDateCapacities({ legalEntityId, serviceId? })`, que devuelve por ente habilitado `{ agencyId, exportLayoutId, layoutVersion, dueDateCapacity }`, para validar el tope de vencimientos antes de guardarlo; (4) un ente sin `dueDateCapacity` declarada no puede habilitarse; (5) pasado el último vencimiento publicado al ente, el ente no lo cobra aunque la obligación tenga vencimientos posteriores (equivale al `maxAcceptedDue` anterior). | ProCoop publica hasta 4 vencimientos y limita el último aceptado por ente (`PERFUETER`, `FUETERBAN`) | Adoptar (DEC-106) | — | Capacidad real de cada layout y convenio (se declara por ente, no se supone) |

### 6.3 Imputación

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-COB-020 | El motor recibe: cobro (importe, fecha, canal, titular/cuenta), obligaciones seleccionadas o identificadas y política; devuelve imputaciones por obligación y componente y el remanente (saldo a favor o no identificado). | Cajero marca; no hay reparto automático entre comprobantes (RN-05 §3.2, duda 6) | Mejorar (FAC-008) | PRM-COB-020 | — |
| RN-COB-021 | Política **selección explícita**: imputa a las obligaciones elegidas en el orden elegido; el remanente según RN-COB-030. | Selección del cajero | Replicar | — | — |
| RN-COB-022 | Política **antigüedad**: ordena por primer vencimiento ascendente (o último vencimiento si se configura), luego fecha de emisión, luego id. | Validación 324/462 | Mejorar | PRM-COB-021 | — |
| RN-COB-023 | Política **prioridad de servicio**: orden por prioridad configurada de servicio (ej. tasa de terceros, energía, internet) y dentro de cada servicio por antigüedad. | 375 por servicio | Mejorar (CU-103) | PRM-COB-022 | — |
| RN-COB-024 | Política **elección del socio**: el socio elige obligaciones en portal o caja; si no elige, se aplica la política por defecto. | — | Adoptar (FAC-008) | PRM-COB-020 | Adoptado (PA-COB-01 respondida, DEC-048) |
| RN-COB-025 | Dentro de una obligación el orden de componentes es: recargo entre vencimientos, interés por mora, interés de financiación, tributos de terceros si el tenant prioriza, capital. | `Get_TotalPagar`: recargo + financiación primero, resto capital (RN-05 §3.3) | Replicar (configurable) | PRM-COB-023 | — |
| RN-COB-026 | Si el pago parcial no cubre los recargos e intereses de la obligación, se rechaza el pago parcial en entes (entrega mínima) y en caja se avisa. | Entrega mínima = recargo entre vencimientos (RN-05 §4.6) | Replicar | PRM-COB-024 | — |
| RN-COB-027 | Deuda notificada (aviso de corte de M08): con la regla activa no se cobra parcialmente; deben incluirse todas las obligaciones notificadas vencidas. | Param 321 | Replicar | PRM-COB-025 | LAG: No |
| RN-COB-028 | Más antiguas primero: con la regla activa, una obligación no puede cobrarse si existe otra más antigua impaga (global o del mismo servicio), comparando por primer o último vencimiento; excluye créditos. | Params 324, 375, 462 | Replicar | PRM-COB-026, PRM-COB-027, PRM-COB-021 | LAG: No |
| RN-COB-029 | Cuotas en orden: no se saltea una cuota anterior impaga del mismo plan. | Param 2263 | Replicar | PRM-COB-028 | LAG: Sí |
| RN-COB-030 | Remanente: si hay importe sin obligación, va a saldo a favor de la cuenta pagadora (política por defecto) o a pendiente de aplicación; nunca a otra cuenta. | Pago duplicado → anticipo (RN-05 §5.4) | Mejorar (AGR-012) | PRM-COB-030 | A validar (PA-COB-04) |
| RN-COB-031 | Imputación entre servicios en cuenta unificada: solo si la política lo permite o el socio lo elige expresamente. | — | Adoptar | PRM-COB-031 | Adoptado (PA-COB-03 respondida, DEC-049) |
| RN-COB-032 | Cancelación automática de créditos: si débitos ≥ créditos, se aplican todos los créditos por orden de primer vencimiento; el último débito puede quedar parcial solo si lo aplicado cubre recargo e intereses (o se difiere todo); el sobrante se descuenta del último crédito. Si créditos > débitos, simétrico. Se excluyen créditos de imputación no automática. | `Get_InfoCobranza_AutoCancelar` (RN-05 §13.5) | Replicar | PRM-COB-032 | — |
| RN-COB-033 | Reasignar una imputación exige reversa de la original y nueva imputación en una transacción, con autorización según T11; prohibido si la obligación original está en un período contable cerrado sin ajuste en el período abierto. | — | Adoptar (BASE §11) | PRM-COB-033 | — |
| RN-COB-034 | Concurrencia: toda imputación verifica la versión de la obligación; si cambió, falla con 409 y se recalcula. | Bloqueo optimista por `SALDO` y `FECHASALDO` (RN-05 §3.4 paso 8) | Replicar | — | — |
| RN-COB-035 | El cupón de pago único se imputa con la política del tenant a las obligaciones del cupón; si alguna ya se canceló por otra vía, su parte va a saldo a favor. | Talón sumado: saldo recalculado (RN-05 §13.4) | Mejorar | PRM-COB-035 | — |
| RN-COB-036 | Comprobantes de importe cero o pares débito/crédito internos compensables se proponen para regularizar; no se anulan solos. | `Get_InfoCobranza_ImporteCero`, `AutoAnularDebCre` (RN-05 §13.5) | Replicar con autorización | — | — |

### 6.4 Saldos a favor, anticipos y no identificados

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-COB-037 | Todo saldo a favor tiene origen, cuenta, servicio (si corresponde), importe, saldo disponible, aplicabilidad automática y vigencia; se consume por imputaciones. | `ANTICIPOS` con `IMP_ANT`, `SDO_ANT` (RN-05 §3.3) | Mejorar | PRM-COB-036 | — |
| RN-COB-038 | Excedente en ESC-01: se cancela la obligación del pagador identificado y el resto queda a favor o pendiente; nunca se aplica a otro titular ni conviviente. | — | Adoptar (AGR-012) | PRM-COB-030 | — |
| RN-COB-039 | Pago duplicado en rendición: si el pago anterior vino del mismo ente → "ya importado" informativo sin crédito; si vino de otra vía → saldo a favor por duplicado en la cuenta pagadora. | RN-05 §4.6 paso 3, `GetAnticipo` | Replicar | PRM-COB-037 | — |
| RN-COB-040 | Los saldos a favor por duplicado y por contracargo se crean con imputación no automática por defecto; su aplicación requiere operador o la política. | Marcas `ImputacionNoAutomatica`, `CreditoPorAnticipo` | Replicar | PRM-COB-038 | — |
| RN-COB-041 | Saldo a favor por redondeo en efectivo: concepto, tipo y comprobantes formales configurados; no se genera si la cuenta adeuda débitos de redondeo previos; vencimiento hoy e imputación no automática. | `Crear_Anticipo_Redondeo` (RN-05 §13.5) | Replicar | PRM-COB-039 | ¿LAG redondea? |
| RN-COB-042 | Un cobro no identificado se crea cuando el canal no permite determinar titular u obligación (comprobante no encontrado, ambiguo, transferencia sin referencia); se identifica con datos verificables y se aplica con aprobación si supera el umbral. | "Comprobante no encontrado" en el log, sin anticipo (RN-11 §1.1) | Mejorar (AGR-012) | PRM-COB-041, PRM-COB-042 | — |
| RN-COB-043 | Un cobro no identificado no aplicado en N días escala al responsable de tesorería; su devolución requiere expediente (RN-COB-097). | — | Adoptar | PRM-COB-043 | — |
| RN-COB-044 | El saldo a favor se aplica a la próxima factura cuando el tenant lo configure; M05 lo muestra en el comprobante. | Param 2651 | Replicar | PRM-COB-044 | — |
| RN-COB-045 | Las transferencias informadas quedan pendientes de verificación; se confirman por conciliación con M14 o por verificación manual con permiso y evidencia. | — | Adoptar (BASE §39.4) | PRM-COB-045 | — |

### 6.5 Caja

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-COB-046 | Una sesión está abierta si no tiene cierre; un usuario puede tener varias sesiones abiertas en cajas distintas, nunca dos en la misma caja. | `CAJAS` por fecha con `CIERRE` nulo (RN-05 §2) | Replicar | — | — |
| RN-COB-047 | El número de caja libre excluye los reservados a entes y a usuarios con caja fija; cada ente y cobrador tiene su caja virtual. | `Get_NumeroCaja` (RN-05 §2) | Replicar | PRM-COB-050 | — |
| RN-COB-048 | La sesión se abre con fecha del día del tenant; abrir con fecha distinta exige permiso. | `AbrirCaja` sin validar número (RN-05 §13.1) | Mejorar | — | — |
| RN-COB-049 | Validaciones de cobro: ver RN-COB-027 a RN-COB-029 más: nota de bloqueo (error), nota de mensaje (aviso desmarcable con permiso), titular notificado (aviso), servicio desconectado (aviso), orden de desconexión pendiente (aviso), deuda vencida en otras cuentas (aviso), talón/cupón completo (error si configurado), comprobante bloqueado (error salvo permiso). | `Validar_CobranzaLocal`, `Validar_AdvertenciasCaja` (RN-05 §3.2, §13.2) | Replicar | PRM-COB-025 a PRM-COB-029, PRM-COB-051 a PRM-COB-055 | Valores LAG |
| RN-COB-050 | El recargo lo calcula M08 con la fecha de cobro; el cajero con permiso puede cambiar el recargo diario o no cobrarlo; el cambio se registra con motivo. | Param 1030; `CambiarRecargoDiario`, `CambiarFecha` (INV `frmCobranza`) | Replicar | PRM-COB-056, PRM-COB-057 | — |
| RN-COB-051 | Modo de diferir: `NoDiferir` cobra todo; `DiferirInteresMora` cobra recargo entre vencimientos y difiere mora; `DiferirTodo` no cobra recargo. Lo diferido se informa a M08 (`cob.surcharge.deferred`) que emite la ND "Intereses diferidos". | `DiferirInteres` (RN-05 §3.3); LAG 1011 = 3 | Replicar | PRM-COB-058 | LAG: diferir todo |
| RN-COB-052 | Si una factura ya tiene un pago parcial, en entes se difiere todo el recargo. | RN-05 §4.6 paso 1 | Replicar | — | — |
| RN-COB-053 | Integridad de la operación: Σ ítems imputados + saldo a favor generado = Σ medios − vuelto; exacto. | `ValidarIntegridad` con tolerancia 0,06 (RN-05 §3.4 paso 10) | Mejorar (exacto) | — | — |
| RN-COB-054 | Vuelto: solo del efectivo; modos proporcional, desde último ingreso, o sin vuelto (el excedente va a saldo a favor o donación). | Params 1001, 1012, 1015 | Replicar | PRM-COB-059 | — |
| RN-COB-055 | Recargo por medio de pago: tarjeta según plan de cuotas (tipo y valor), transferencia, valores a fecha (interés diario); se factura como concepto vía M05 y se cobra en la misma operación. | `RegistrarRecargosPorMedioPago` (V2 2069, 2070, 487); `TARJETAS_RECARGO` | Replicar | PRM-COB-060, PRM-COB-061 | — |
| RN-COB-056 | Descuento en caja: por tipo de factura o servicio, rango de días del mes sin superposición, porcentaje con suma ≤ 100, solo socios opcional; se documenta como bonificación de M05. La regla se lee de `earlyPaymentDiscountRules` de M08 (CTR-DAT-40). | `DESCUENTO_CAJA` (RN-05 §13.5) | Replicar | PRM-COB-062 | ¿LAG tiene descuentos? |
| RN-COB-057 | QR estático por puesto: al cobrar se carga el importe en el QR con una referencia única de transacción; el pago se asocia por referencia, no por fecha + importe; al terminar el QR se limpia. | Emparejamiento por fecha e importe (RN-13 §3.4; RN-05 §13.7) | Reemplazar | PRM-COB-063 | — |
| RN-COB-058 | QR dinámico: una intención tipo caja por operación; si el importe no cambió se reutiliza la intención en curso; sin comprobantes se crea una intención de prepaga. | `GeneradorQrFactory`, `QrDinamico` (RN-05 §13.7) | Replicar | PRM-COB-063 | — |
| RN-COB-059 | Retención sufrida: requiere tipo, número de certificado, fecha e importe; cancela deuda como medio; no se anula la cobranza si la retención ya se presentó. | `RETENCIO` (RN-05 §3.4) | Replicar | PRM-COB-064 | — |
| RN-COB-060 | Egreso por pago a proveedor: solo órdenes no anuladas con salida pendiente (y con firmas completas si se configura); reduce el efectivo de la moneda por defecto; con la opción activa marca la orden como firmada y entregada. | `Registrar_PagoProveedor` (RN-05 §13.3) | Replicar | PRM-COB-065 | — |
| RN-COB-061 | Comprobante generado en la caja (recargo cobrado, conceptos, ND de intereses) queda marcado como generado en caja; al anular la cobranza se anula entero salvo que tenga CAE, en cuyo caso M05 emite NC. | `GEN_CAJ` (RN-05 §13.4) | Mejorar | — | — |
| RN-COB-062 | Espera de CAE: si el tenant exige autorización fiscal antes de entregar el recibo, la operación queda "pendiente fiscal" y se completa al recibir el CAE; el cobro ya está registrado. | Param 727 (LAG Sí) | Replicar | PRM-COB-066 | — |
| RN-COB-063 | Límites del cajero: importe máximo por operación, efectivo máximo en caja (alerta de retiro parcial), medios habilitados; superar requiere aprobación. | — | Adoptar (BASE §12) | PRM-COB-067, PRM-COB-068 | — |
| RN-COB-064 | Arqueo: teórico por medio = Σ detalle de operaciones de la sesión por medio y moneda + movimientos manuales de la sesión; el cajero declara el contado por medio; diferencia por medio = declarado − teórico. | Solo efectivo arqueado; los demás medios = teórico (RN-05 §13.1) | Mejorar | PRM-COB-069 | A validar (PA-COB-08) |
| RN-COB-065 | Control de integridad del cierre: teórico por detalle vs. totales de cabecera de operaciones; toda diferencia es una excepción (no un aviso) y bloquea el cierre hasta explicarla. | Aviso si diferencia > 0,05 (RN-05 §13.1) | Mejorar | — | — |
| RN-COB-066 | Diferencia de arqueo: justificación obligatoria; por encima del umbral requiere aprobación de supervisor; genera movimiento de quebranto (ingreso si sobra, egreso si falta) hacia M14/M15. | `TOT_DIF` y quebranto (RN-05 §13.1) | Replicar | PRM-COB-034 | — |
| RN-COB-067 | Cierre de varias sesiones o días: solo si en el período hay únicamente efectivo, cuando el tenant lo habilite. | Param 2688; "Solo es posible cerrar cobranzas en Efectivo" | Replicar | PRM-COB-070 | — |
| RN-COB-068 | Al cerrar: cheques pasan a la cartera de M14 (fuera de caja); cupones de débito se presentan; cupones de crédito quedan para presentar en tesorería; retenciones se presentan si se configura; transferencias generan la expectativa bancaria; si no hubo movimientos igual se registra el cierre en cero. | `CerrarCaja` (RN-05 §2, §13.1) | Replicar | PRM-COB-071 | 2952 en LAG |
| RN-COB-069 | Reapertura (anulación del cierre): con permiso, solo si M14 no recibió la rendición ni cerró el día; con cierre múltiple reabre todas las sesiones del grupo. | `AnularCierreCajas` (RN-05 §2, §13.1) | Replicar | — | — |
| RN-COB-070 | Si el cierre falla en cualquier paso (por ejemplo una expectativa bancaria), se revierte completo. | Revierte todo si falla un `RESBAN` (RN-05 §13.1) | Replicar | — | — |
| RN-COB-071 | Cobro de conceptos de conexión: precio = segundo importe si vigente, si no importe fijo o precio del producto; importe editable salvo bloqueo; bonificación por cantidad con contador por cuenta hasta el máximo. | `Get_ConceptosCobrar`, `CONE_BONIF` (RN-05 §13.5) | Replicar | PRM-COB-072 | Tipo 4 en LAG |
| RN-COB-072 | Reconexión tras el cobro: COB publica las obligaciones canceladas y servicios del titular; M08 aplica 2926/3147/3113/3163/2713/3106 para decidir orden o reconexión directa. | `Get_SersocReconexion`, `GenerarConfirmarOrdenTrabajo` (RN-05 §13.2) | Delegar a M08 | (M08) | Valores LAG |

### 6.6 Anulación de cobros

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-COB-073 | No se anula si: falta permiso; ya está anulada; el usuario no tiene sesión abierta; en ventanilla la sesión original está cerrada (salvo flujo de anulación con autorización de supervisor y efecto en la sesión actual); los cheques salieron de caja; hay recargos diferidos ya facturados; hay cobros de terceros ya rendidos; venta prepaga con retención aplicada; la operación es de otro usuario y el tenant lo prohíbe. | `ValidarAnular` (RN-05 §3.5, §13.4); V2 2394 | Replicar | PRM-COB-075, PRM-COB-076 | — |
| RN-COB-074 | Orden inverso: si hay imputaciones posteriores sobre la misma obligación, se exige anular primero las posteriores. | `SAL_ACT ≠ SALDO` rechaza (RN-05 §3.5) | Replicar | — | — |
| RN-COB-075 | Efectos de la anulación, todos por reverso: imputaciones revertidas, recibo Anulado, medios revertidos (efectivo, transferencia, cupón, retención; cheque propio vuelve disponible), expectativa bancaria anulada en M14, cupón/talón con saldo restaurado, recargo diferido de ese recibo cancelado, cobro de tercero revertido, venta prepaga revertida por M03, comprobante generado en caja anulado o NC, intención de pago vuelta a "Pagada sin imputar". | `Anular`, `AnularPagos`, `AnularCobranza` Pagos360 (RN-05 §3.5, §13.4) | Mejorar (sin borrado) | — | — |
| RN-COB-076 | La búsqueda de la operación a anular es por número de operación, recibo o comprobante; por rango solo operaciones sin vuelto. | `GetOperaciones` (RN-05 §13.4) | Replicar | — | — |
| RN-COB-077 | El movimiento bancario de un ente se ubica por `operationId` (no por búsqueda de importe, fecha y categoría). | Búsqueda por cuenta+fecha+mov 70/71+categoría+importe (RN-05 §13.4) | Reemplazar | — | — |
| RN-COB-078 | Prepaga con reversión de facturas: al anular, M03 revierte la carga y COB registra la regularización sin intereses ni medios. | Pago automático de regularización (RN-05 §13.4) | Replicar vía M03 | — | Prepaga LAG |

### 6.7 Entes recaudadores

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-COB-079 | Cada ente se configura como datos (RF-COB-098); el layout se elige por familia y versión, no por código por cooperativa. | ~295 importadores y ~209 exportadores por reflexión (RN-05 §4.2) | Reemplazar (motor declarativo) | — | — |
| RN-COB-080 | Identificador de pago: prefijo de tipo (aviso de deuda, obligación, cupón, intención) + id interno + dígito verificador, de largo fijo por layout; formas alternativas por ente (id directo, código anterior por alias, 3+4+8). | Prefijos 40/41/42/43/99/21-23 y `ARC_CONFIG` (RN-05 §4.3) | Mejorar | PRM-COB-080 | — |
| RN-COB-081 | Exportación: solo obligaciones con saldo > 0 y no créditos; aplica filtros (RF-COB-101); con "validar saldo", si la obligación tiene pago parcial, todos los importes por vencimiento pasan a ser el saldo. | `Get_Comprobantes_Factura`, `ValidarSaldo` (RN-05 §4.4) | Replicar | PRM-COB-081, PRM-COB-082 | — |
| RN-COB-082 | Importes en el archivo en centavos con relleno de ceros; negativo ocupa una posición del largo. | `Get_TextoImporte` (RN-05 §4.4, §13.10) | Replicar en el motor | — | — |
| RN-COB-083 | Índice Red Link único por (período, concepto, identificador) con índice inicial configurable; no se reinforma un comprobante ya informado. | `Indexar_Registro`, `checkearComprobantesInformados` (RN-05 §4.4) | Replicar | PRM-COB-083 | — |
| RN-COB-084 | SIRO: máximo 10 comprobantes por cuenta y período; días extra al último vencimiento solo con diferir = solo mora; excluir período o comprobantes ya informados; nombre de archivo con CUIT del administrador. | `E_SIRO` (RN-05 §5.2); V2 3006, 2818, 2296 | Replicar | PRM-COB-084 a PRM-COB-086 | — |
| RN-COB-085 | Rendición: se valida convenio de cabecera = convenio del ente y fecha de presentación ≤ hoy; si falla, se rechaza el archivo completo. | RN-05 §4.5; RN-11 §1.1 | Replicar | — | — |
| RN-COB-086 | Pie: cantidad de registros (pie − 2 cuando incluye cabecera y pie) e importe total; si no coinciden con lo leído es **advertencia** visible, no error. | `Validar_CantidadImportada`, `Validar_ImporteImportado` | Replicar | — | — |
| RN-COB-087 | Importe esperado = saldo + recargo entre vencimientos si corresponde (según modo de diferir del ente y fecha de cobro); si el registro trae el recargo explícito se usa ese. | `LoadComprobantes_Simple` (RN-05 §4.6 paso 2) | Replicar (cálculo vía M08) | — | — |
| RN-COB-088 | Pasado el último vencimiento aceptado por el ente (o sin tope si no se configura vencimiento máximo): error "el ente no permite pagos pasados el día…". | `PERFUETER`/`FUETERBAN` (LAG = 5, sin tope) | Replicar | PRM-COB-087 | — |
| RN-COB-089 | Importe superior: error salvo tolerancia configurada por ente (advertencia ≤ tolerancia, el excedente va a saldo a favor). Importe inferior: error si el ente no admite entregas; si las admite, error solo si no cubre la entrega mínima. | RN-05 §4.6 pasos 5-6 (tolerancia ≈ $1) | Replicar | PRM-COB-088, PRM-COB-089 | — |
| RN-COB-090 | Duplicados dentro del archivo (misma cuenta, comprobante, cuota y primer vencimiento): se marcan y no se aplican las repeticiones; con la opción activa se agrupan como advertencia. | `Validar_Duplicados` (V2 3200) | Replicar | PRM-COB-090 | LAG |
| RN-COB-091 | Comprobante anulado, titular notificado y comprobante bloqueado se validan en la rendición; bloqueado se acepta si el tenant lo permite. | RN-05 §4.6 paso 7; V2 302, 2586, 2596 | Replicar | PRM-COB-055 | — |
| RN-COB-092 | Solo se registran los registros OK y confirmados; los errores quedan en bandeja con su motivo y pueden resolverse (identificar, aplicar, devolver). | Log sin registro de errores (RN-05 §4.7) | Mejorar | — | — |
| RN-COB-093 | Registración de la rendición: medio transferencia por el total rendido a la cuenta del ente, concepto "Cobranza {ente}", fecha de rendición, diferencia del ente, conciliado automático según ente; caja virtual del ente. | `RegistrarPago_Entidades` (RN-05 §4.7) | Replicar | PRM-COB-091 | — |
| RN-COB-094 | Comisión del ente: importe fijo por comprobante o porcentaje acotado por mínimo y máximo; registrada como gasto financiero; si se traslada, se factura al usuario. | `RegistrarCobranzaEntidad` (RN-05 §4.7) | Replicar | PRM-COB-092 | LAG sin comisión |
| RN-COB-095 | Forma de registración bancaria por ente (por comprobante, fecha de acreditación, caja, pago); si el layout no la informa, se usa la del ente (no "por caja" implícito). | Red Link LAG ignora `TIPO_REG` y asienta por caja (RN-11 §1.1) | Mejorar | PRM-COB-093 | A validar (PA-COB-10) |
| RN-COB-096 | Rendición SIRO: descartar importe 0; dígito de tipo 5 = aviso de deuda; comprobantes que empiezan con 7 = pago web vinculado a intención; con 8 se descartan; validar convenio y fecha de acreditación; decodificar código de barras SIRO; tomar fecha de rendición = acreditación. | `PR/SIRO.cs` (RN-05 §5.2; RN-11 §1.3) | Replicar | — | — |
| RN-COB-097 | Rendición Banelco/Pago Fácil/Rapipago/Cobro Express: cliente por cuenta y comprobante por código de barras o identificador de pago; opción de tomar fecha de rendición = fecha de importación (importador Banelco). | RN-05 §5.3; V2 3023 | Replicar | PRM-COB-094 | — |
| RN-COB-098 | Novedades de adhesión: alta → adhesión Activa con ente, período, medio y fecha; baja → Cancelada con fecha; modificación → actualiza el medio; solo se aplican si la cuenta no tiene ente o es el mismo ente; las demás se devuelven como error. | `Procesar_Novedades` (RN-05 §6.1) | Replicar | — | Período = código de persona [VERIFICAR] |
| RN-COB-099 | Morosidad Naranja: valida comercio = convenio; registra tarjeta, importe, vencimiento, presentación y cuenta; emite informe. | `Archivo_Morosidad` (RN-05 §13.10) | Replicar | — | — |
| RN-COB-100 | Fecha juliana AAJJJ se interpreta siempre del siglo 2000. | `ConversorFechaJuliana` (RN-05 §13.10) | Replicar en el motor | — | — |

### 6.8 Débito automático

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-COB-101 | La presentación selecciona obligaciones de cuentas con adhesión Activa al ente, excluyendo tipos en exclusión, ya pagadas, en otra presentación activa o bloqueadas. | `Generar_Debitos_Automaticos`, `DEBITO_EXCLUSION` (RN-05 §4.4, §6.2) | Replicar | — | — |
| RN-COB-102 | Débito con tarjeta: si el día del primer vencimiento ≥ día de corte (19 por defecto), el débito pasa al mes siguiente. | `Registrar_Solicitudes_Debito` (V2 2779) | Replicar | PRM-COB-100 | — |
| RN-COB-103 | Débito sin rechazos previos se cobra al importe del primer vencimiento aunque se acredite después. | `Importador_Base.cs:1903` | Replicar | — | — |
| RN-COB-104 | Rechazo: la obligación vuelve a Pendiente (si se había anticipado el cobro) o queda Pendiente; se registra código y causa; se notifica; los rechazos definitivos (orden de no pagar, cuenta cerrada, baja de tarjeta) suspenden la adhesión. | Rechazados no se registran (RN-05 §6.2) | Mejorar | PRM-COB-101, PRM-COB-102 | — |
| RN-COB-105 | Códigos de resultado Naranja: 0 aceptado, 8 inexistente, 35 rechazada, 81 baja, 102 importe 0, 145 error de referencia. Débito directo CBU: códigos interbancarios R (R08 orden de no pagar, R09 día no laborable, R10 falta de fondos y demás). | RN-05 §6.2 | Replicar como catálogo | PRM-COB-103 | — |
| RN-COB-106 | Estados de adhesión por API (Pagos360): `pending_to_sign` → Pendiente de firma; `signed` → Activa; `canceled` → Cancelada (en sincronización periódica) o Error (en el alta). | `Registrar_DebitoTarjeta/Cbu`, `Actualizar_EstadosDebitos` (RN-05 §6.1) | Replicar | — | — |
| RN-COB-107 | Una obligación no puede estar en dos presentaciones o intenciones no canceladas; las intenciones web (prepaga y cobranza del portal) solo cuentan si su segundo vencimiento no pasó. | `Validar_Insert` (RN-05 §13.7) | Replicar | — | — |
| RN-COB-108 | Pago voluntario de obligación adherida: según política (no permitir, siempre, solo con recargo); si se pagó antes de presentar, se excluye; si se pagó y además se debitó, el segundo cobro va a saldo a favor o devolución. | V2 63, 3047 | Replicar | PRM-COB-104 | — |
| RN-COB-109 | El número de tarjeta nunca llega a CoopApps: la adhesión se captura en el componente alojado de la pasarela o en el sistema de la procesadora, y se guarda solo `cardToken` (token o número de adherente del proveedor, cifrado a nivel de campo), `brand` y `last4`; no se guardan vencimiento ni código de seguridad. Una procesadora cuyo archivo exige el PAN completo no se integra por archivo (DEC-091). El CBU se guarda cifrado y se muestra enmascarado. | `SUMSOC.NUM_TARJ` en claro | Reemplazar (seguridad) | — | — |

### 6.9 Pasarelas e intenciones de pago

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-COB-110 | Estados de intención: Borrador → Emitida (registrada en el proveedor) → Pagada (transacción confirmada) → Imputada; más Vencida, Cancelada, Rechazada, Revertida, Devuelta, Resultado incierto. | `PAGOS360.ESTADO` 0-6 (RN-13 §2.2) | Mejorar | — | — |
| RN-COB-111 | La confirmación siempre es por consulta autenticada al proveedor (o rendición firmada del ente); el webhook es solo disparador; el importe del portal nunca se usa. | Webhook vía CoopOnline + `Obtener_Pago`; ProvinciaNet confía el importe del portal (RN-13 §2.3, §12) | Mejorar; descartar ProvinciaNet sin verificación | — | — |
| RN-COB-112 | Deduplicación: índice único (`tenantId`, `connectorId`, `externalPaymentId`); un pago ya registrado se ignora. | Saltear si existe `ID_360` (RN-13 §3.3) | Replicar | — | — |
| RN-COB-113 | Una intención admite exactamente un pago confirmado sin imputar (en débitos, con comisión); dos pagos sobre la misma intención: el segundo va a saldo a favor y a revisión. | `Pagos360.Importar` exige un pago (RN-05 §7.2) | Mejorar | — | — |
| RN-COB-114 | Importe esperado = importe 1 si se pagó antes del primer vencimiento (o débito sin rechazos), si no importe 2; pasado el tercer vencimiento se usa el primero si se configura. | RN-05 §7.2; V2 908 | Replicar | PRM-COB-110 | — |
| RN-COB-115 | Distribución del pago entre ítems: cada ítem toma el total del vencimiento según fecha de pago y modo de diferir; si tenía saldo parcial se prorratea; si trae recargo explícito se usa. | RN-05 §7.2 paso 3 | Replicar (vía motor de imputación) | — | — |
| RN-COB-116 | Si la suma de ítems ≠ pago, no se bloquea: se imputa con la política y la diferencia va a revisión (más: saldo a favor; menos: obligación parcial y recargo diferido). | Error "diferencia entre importe cobrado y comprobantes"; "importes no coinciden" bloquea (RN-05 §7.2, RN-13 §2.3) | Mejorar | PRM-COB-111 | A validar (PA-COB-05) |
| RN-COB-117 | Reutilización: intención idéntica (importe, pagador, email, nombre, conector, medios y obligaciones) creada dentro de la ventana se reutiliza; no aplica a conectores que no lo soporten. | 10 minutos (mensaje dice 30), solo tipo 9, no SIRO ni Macro (RN-05 §7.1, §13.6) | Replicar configurable | PRM-COB-112 | — |
| RN-COB-118 | Se descartan intenciones ≤ monto mínimo (por defecto ARS 10) y con importe ≥ tope técnico del conector (ej. QR masivo < 100.000.000). | RN-05 §7.2, §13.7; ProntoPago (RN-13 §13) | Replicar | PRM-COB-113 | — |
| RN-COB-119 | Pagos sin intención previa (pago desde la app del proveedor o QR externo): se crea una intención tipo "web" con ítems de la metadata o referencia; si no se identifican, va a no identificados. | `Importar_Pagos_Inexistentes` (RN-05 §13.7; RN-13 §3.3, §4.3) | Replicar | — | — |
| RN-COB-120 | Elección del conector: por canal de pago configurado; si no, conector por defecto del canal (web, caja, QR de caja, terminal); si no hay, offline (cupón para ente). | `GenerarSolicitud`, params 2774, 2500, 2645, 2803, 3142 (RN-13 §2.4) | Replicar | PRM-COB-114, PRM-COB-115 | — |
| RN-COB-121 | Cobertura de medios por conector: link/botón (Pagos360, SIRO, Mercado Pago, Macro, PayFun, Pagos TIC, SiPago, Helipagos); QR dinámico en caja (Pagos360, SIRO, NaranjaX); QR estático (Pagos360, SIRO); QR en factura (Pagos360, ProvinciaNet, ProntoPago); Pago Fácil/Rapipago online por códigos de Pagos360/Helipagos/PayFun; débito por API (Pagos360); DEBIN (Pagos360, PayFun); Red Link/Banelco como canal de Pagos360. | RN-13 §15 | Replicar como capacidades declaradas | — | — |
| RN-COB-122 | Pago incierto: ante timeout o error 5xx al crear o confirmar, la intención pasa a Resultado incierto; un job reconsulta por referencia externa; recién con respuesta concluyente se reintenta o se confirma. | Sin reintentos ni timeouts (RN-13 §2.1) | Reemplazar (AGR-016) | PRM-COB-116 | — |
| RN-COB-123 | Tras restaurar un respaldo o reprocesar, antes de cualquier reenvío se consultan los identificadores externos existentes en el proveedor (ESC-04). | — | Adoptar | — | — |
| RN-COB-124 | Rechazo de pasarela (RECHAZADA/ERROR): la intención pasa a Rechazada y el portal vuelve a mostrar la deuda como pagable. | SIRO → estado 6 y `MarcarPagoPendiente` (RN-13 §4.3) | Replicar | — | — |
| RN-COB-125 | Esperas fijas (25 s SIRO, 10 s ProvinciaNet) se reemplazan por consulta asíncrona con backoff. | `Thread.Sleep` (RN-13 §4.3, §12) | Reemplazar | PRM-COB-117 | — |
| RN-COB-126 | Comisiones de la transacción se toman del proveedor (bruta, neta, IVA, neto); si el proveedor no las informa (Mercado Pago por API), se calculan con la tarifa del conector y se marcan como estimadas hasta la conciliación. | MP registra comisiones en 0 (RN-13 §5) | Mejorar | PRM-COB-118 | — |
| RN-COB-127 | El débito por tarjeta o CBU de Pagos360 se modela como intención tipo débito vinculada al mandato; tipo según largo del medio (22 dígitos = CBU). | `E_Pagos360` `DEBITO_TIPO` (RN-05 §6.2) | Replicar | — | — |
| RN-COB-128 | SIRO: el identificador externo de la intención antepone "8" al número (la rendición SIRO descarta los que empiezan con 8 para no duplicar con el botón). | `Save` SIRO (RN-05 §13.7) | Replicar | — | — |
| RN-COB-129 | El token de sesión de cada proveedor se cachea con su vencimiento real; nunca sin control de expiración. | NaranjaX sin control; SIRO 10 min (RN-13 §4.1, §7) | Mejorar | — | — |
| RN-COB-130 | Webhooks: endpoint `/api/v1/ext/cob/webhooks/{connector}/{tenantSlug}` con token por conector; responde 2xx tras persistir; procesa asíncrono por cola. | Firebase/CoopOnline (RN-13 §2.3) | Reemplazar | — | — |

### 6.10 Devoluciones, contracargos y conciliación

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-COB-131 | Devolución: estados Solicitada → Aprobada → En ejecución → Ejecutada → Conciliada (o Rechazada, Cancelada, Fallida); quien solicita no aprueba; la ejecución usa clave de idempotencia; el importe no supera el saldo a favor o el cobro original. | No existe (RN-13 §3.6, duda 10) | Adoptar (AGR-013) | PRM-COB-120 | — |
| RN-COB-132 | La devolución por el proveedor solo si el conector declara la capacidad; si no, se ejecuta por M14 (transferencia) y se concilia. | Sin refunds por API | Adoptar | — | A validar (PA-COB-12) |
| RN-COB-133 | Contracargo: transacción negativa del proveedor; revierte las imputaciones del pago (la obligación vuelve a Pendiente), marca la intención Revertida, opcionalmente crea débitos por interés diario de reversión (importe × % diario × días desde la menor entre fecha de pago y primer vencimiento hasta hoy) y comisión de reversión, y puede bloquear el pago online. | `Crear_Anticipo_Rever` con débito exento (RN-05 §13.7; RN-13 §3.6) | Mejorar | PRM-COB-121 a PRM-COB-124 | A validar (PA-COB-11) |
| RN-COB-134 | El débito por reversión usa concepto exento; si el concepto configurado está gravado, se rechaza la configuración. | Error si concepto gravado (RN-05 §13.7) | Replicar | — | — |
| RN-COB-135 | Reversión por cuenta o por factura según configuración; devuelve la lista de cuentas a bloquear. | V2 3001 | Replicar | PRM-COB-122 | — |
| RN-COB-136 | Conciliación de cobranzas por canal y día: pagado (bruto) = Σ transacciones confirmadas; comisión = Σ comisiones; neto esperado = bruto − comisión − retenciones del canal; acreditado = movimiento M14. Diferencia = esperado − acreditado. | Solo controles de pie y log (RN-05 §4.7) | Mejorar (BASE §13) | PRM-COB-125 | — |
| RN-COB-137 | La comisión no reduce el importe cancelado por el socio: se registra como gasto financiero. | — | Adoptar (BASE §13, §40.5) | — | — |
| RN-COB-138 | Un día de conciliación se cierra con acta; las diferencias no resueltas pasan al día siguiente identificadas. | — | Adoptar | — | — |

### 6.11 Cobradores y terceros

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-COB-139 | La lista de cobro congela importes a la fecha prevista; al cobrar en campo, si la fecha real difiere, el recargo se recalcula al sincronizar y la diferencia va a revisión. | — | Adoptar (MER-007) | PRM-COB-130 | — |
| RN-COB-140 | Recibo provisorio offline numerado por dispositivo (serie del cobrador + correlativo); al sincronizar se emite el recibo definitivo vinculado. | — | Adoptar | PRM-COB-131 | — |
| RN-COB-141 | Duplicados offline: `clientMutationId` único por tenant; reenvío devuelve el resultado original. Si la obligación fue pagada por otro canal entre medio, el cobro offline va a saldo a favor y a revisión. | — | Adoptar (CNX) | — | — |
| RN-COB-142 | Cobro por cuenta de terceros: según configuración del tercero no se admiten pagos múltiples del mismo comprobante, importes negativos sin devolución, vencidos o menores al mínimo; se crea una obligación propia con importes y vencimientos del comprobante del tercero; la comisión es fija o porcentual con mínimo; anulación imposible si ya se rindió. | `clsTerceros` (RN-05 §13.9) | Replicar | PRM-COB-132 | — |
| RN-COB-143 | Comisión remota: recargo de cobranza remota con su concepto e IVA, importe máximo por factura, solo efectivo y cajas habilitadas. | V2 714-719 | Replicar | PRM-COB-133 | — |

### 6.12 Transición desde ProCoop (formatos de la base relevada LAG)

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-COB-144 | Resolutor Red Link LAG: servicio = dígitos 9-10 del identificador de 10 (01 EN, 02 GS, 04 AG, 05 SV; 03 sin tipo); cuenta = primeros 8 dígitos (7 si gas); se interpreta como cuenta+servicio si el servicio ≠ 00 y el número de 10 no existe como cuenta, o si existe y servicio = 02 y concepto = 002; si no, número completo como cuenta. | `Entidades.LAG/Red_Link.cs` (RN-11 §1.1) | Replicar la decodificación vía alias | — | Concepto 002, código 03 |
| RN-COB-145 | Búsqueda LAG mejorada: solo obligaciones impagas de esa cuenta y servicio con algún importe por vencimiento = importe pagado y emisión ≤ fecha de cobro; desempate por vencimiento vigente a la fecha de cobro, luego la más antigua; si quedan ≥ 2, cobro no identificado con candidatos sugeridos. | Elige la más reciente aunque esté paga; duplicados anulados (RN-11 §1.1) | Mejorar | PRM-COB-140 | — |
| RN-COB-146 | Si no hay coincidencia por cuenta, se busca por alias (código del sistema anterior) y, para gas, por el identificador original de 10 dígitos. | Fallback `USUARIO` (RN-11 §1.1) | Replicar vía alias | — | Uso de `USUARIO` |
| RN-COB-147 | El identificador se trata como texto (sin desborde de enteros); una línea mal formada se rechaza individualmente, no el archivo completo. | `Int32` aborta todo el archivo (RN-11 §1.1) | Reemplazar | — | Rango de cuentas |
| RN-COB-148 | Exportación SIRO LAG: convenio normalizado a 10 y con "0" antepuesto (11) para el código de barras 0447 de 56; si el código supera el ancho (importe ≥ ARS 100.000,00 o > 99 días entre vencimientos) se informa el error y se usa el formato extendido acordado; nunca vacío silencioso; los cupones y avisos se exportan sin excepción. | `E_SIRO.cs:134-139`; excepción con talones (RN-11 §1.3) | Mejorar | PRM-COB-141 | Cantidad ≥ 100.000 |
| RN-COB-149 | Configuración LAG a migrar: Red Link (convenio D67, rendición propia, envío 19/10, caja 101, diferir solo mora, sin tope de vencimiento, sin entregas, mora pasado el último vencimiento, sin comisión, sin conciliación automática); SIRO (envío SIRO archivo, rendición integrada por API o archivo, caja 102, mismas reglas); Documentos a cobrar (sin interfaz, caja 300). | RN-12 §2 | Replicar como datos de migración | — | Producción vs. demo |
| RN-COB-150 | Las ramas muertas y de otras cooperativas ("FAL", "LAGU", `E_SIRO.cs:26`) no se portan. | RN-11 implicancia 8 | Descartar | — | — |

## 7. Modelo de datos
> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueidentifier`, `DECIMAL`, `DATETIME2`, etc.; ver `07-ddl`). Menciones puntuales de Mongo/Mongoose/BullMQ sin tipo de columna = **comparativa histórica** Connectia, sin efecto en build.


### 7.0 Convenciones comunes

- Todo documento lleva `TenantId` (uniqueidentifier, obligatorio), `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `version` (control optimista). Todos los índices compuestos empiezan por `TenantId` (DEC-002).
- Importes: `DECIMAL(18,4)`; los objetos `money` son `{ amount: DECIMAL(18,4), currency: 'ARS' }`. Prohibido `Number` para importes.
- Los documentos económicos (`obligations`, `ledgerEntries`, `allocations`, `receipts`, `cashOperations`, `paymentTenders`, `creditBalances`, `gatewayTransactions`, `agencySettlementLines`, `refundCases`, `chargebacks`) **nunca se borran**: se anulan o revierten.
- Datos sensibles: CBU cifrado a nivel de campo y mostrado enmascarado; tarjetas solo como token del proveedor, marca y últimos 4 dígitos; nunca PAN ni código de seguridad. Credenciales solo como referencia a la bóveda (`credentialRef`).
- `operationId`: identificador de operación estable por tenant (AGR-016) usado como clave de idempotencia de cada hecho económico.
- Mapeo ProCoop: se indica en cada colección la tabla CAT de origen.
- **Entidad jurídica (DEC-064, DEC-087):** `currentAccounts`, `obligations`, `ledgerEntries`, `allocations`, `receipts`, `creditBalances`, `unidentifiedReceipts` (al identificarse), `refundCases`, `chargebacks`, `agencySettlementLines`, `collectionReconciliations`, `paymentCoupons` (RN-COB-156) y `treasuryHandovers` (por entidad, RF-COB-194) llevan `legalEntityId` (obligatorio en los documentos económicos de la lista de RF-CFG-136 de T04: `receipts`, `obligations`, `ledgerEntries`, `currentAccounts`; el validador del esquema base rechaza el documento sin entidad o con entidad inactiva a su fecha) → `legalEntities` (T04). Se hereda de la obligación (y esta del comprobante de M05); una imputación nunca cruza entidades jurídicas.
- **Nombres canónicos (T05 §7.2, CTR-DAT-30):** `voucherTypeId` (antes `documentTypeId`), `storedFileId` (antes `fileId`; los derivados con rol son `<rol>StoredFileId(s)`: `evidenceStoredFileId(s)`, `imageStoredFileId`, `controlStoredFileId`, `iconStoredFileId`, `minutesStoredFileId`, `reportStoredFileId`), `treasuryAccountId` (antes `bankAccountId`, cuenta de tesorería de M14), `ledgerAccountId` (antes `accountingAccountRef`), `approvalRequestId` (antes `approvalId`), `holderId`. Las credenciales (`credentialRef`) apuntan a `integrationSecrets` de T06. El subdocumento `legacy` sigue la forma de T05 `{system: 'procoop', table, key, displayKey, runId, hash, readOnly, priorMigration}`.
- **Cuenta corriente ≠ cuenta (CTR-DAT-65):** `currentAccountId` identifica la cuenta corriente de esta colección; `accountId` es siempre la cuenta (suministro) de M01. Nunca se usa `accountId` para la cuenta corriente.

### 7.1 `currentAccounts` — cuentas corrientes

Propósito: agrupación de presentación de obligaciones (separada por servicio o unificada del titular). Hay una cuenta corriente por titular **y por entidad jurídica** (DEC-087, PA-DAT-01; RN-COB-151): la cuenta unificada agrupa solo servicios de la misma entidad.

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `code` | string | Sí | Código visible de la cuenta corriente (único por tenant). |
| `holderId` | uniqueidentifier → M01 | Sí | Titular. |
| `legalEntityId` | uniqueidentifier → T04 `legalEntities` | Sí | Entidad jurídica a la que pertenecen todas las obligaciones de la cuenta (DEC-064, DEC-087). |
| `accountIds` | [uniqueidentifier] → M01 | Sí | Cuentas (suministros) incluidas. |
| `billingGroupId` | uniqueidentifier → M05 | No | Grupo de facturación (FAC-006) cuando la cuenta es unificada por grupo. |
| `mode` | enum `separate` \| `unified` | Sí | Modalidad efectiva (RN-COB-014). |
| `serviceId` | uniqueidentifier → M02 | Cond. | Obligatorio si `mode = separate`. |
| `contractIds` | [uniqueidentifier] | No | Contratos incluidos. |
| `allocationPolicyId` | uniqueidentifier | No | Política propia (excepción). |
| `minimumPaymentPolicy` | objeto | No | Fórmula y saldo elegible (PRM-COB-014/015). |
| `electronicPaymentCode` | string | No | Código de pago electrónico de la cuenta para redes. |
| `status` | enum `active` \| `closed` | Sí | — |
| `validFrom` / `validTo` | Date | Sí / No | Vigencia de la modalidad. |

Índices: `{tenantId, code}` único; `{tenantId, holderId, legalEntityId, status}`; `{tenantId, holderId, legalEntityId, mode, serviceId}` único parcial para `status = active` (una cuenta unificada por titular y entidad, o una separada por servicio); `{tenantId, billingGroupId}`; `{tenantId, accountIds}`. Origen: `SUMSOC` (cuenta, `COD_SUM`), Grupo Factura (FAC-012); `legalEntityId` desde `EMPRESAS`/`COD_EMP` vía T07.

### 7.2 `obligations` — obligaciones exigibles

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `currentAccountId`, `holderId`, `accountId` | uniqueidentifier | Sí | Cuenta corriente, titular y cuenta M01. |
| `legalEntityId` | uniqueidentifier → T04 | Sí | Entidad jurídica emisora del comprobante de origen; debe coincidir con la de la cuenta corriente (DEC-064). |
| `serviceId`, `contractId` | uniqueidentifier | Sí / No | Servicio y contrato o suministro. |
| `billingGroupId` | uniqueidentifier | No | Grupo de facturación. |
| `sourceType` | enum `invoice`, `debitNote`, `installment`, `interestCharge`, `surchargeDeferred`, `commissionCharge`, `reversalCharge`, `connectionCharge`, `thirdPartyDocument`, `externalImport`, `advanceDebit`, `migration`, `other` | Sí | Origen. |
| `sourceDocumentId` | uniqueidentifier | Sí | Documento de M05/M08/M18 o importación. |
| `sourceDocument` | `{ type, pointOfSale, number, letter }` | Sí | Número visible. Si M05 renumera un comprobante todavía no autorizado (`fac.invoice.renumbered`, EVT-FAC-23; DEC-107), se actualiza `number` y el anterior queda en la auditoría; con `fiscalGate = authorized` el número ya no cambia. |
| `sourceLineKey` | string | Sí | Clave del bloque de servicio dentro del comprobante agrupado. |
| `period` | string `YYYY-MM` | No | Período facturado. |
| `issueDate` | Date | Sí | Emisión. |
| `dueSchedule` | [`{ seq: 1..N, dueDate, amount }`] | Sí | Vencimientos e importes por vencimiento, copiados de `invoices.dueDates` de M05; N es el tope efectivo del comprobante (`invoices.dueDateCap.effective`, 4 por defecto; PRM-FAC-163; DEC-106). Origen ProCoop: `TOTAL1..4`, `VTO1..4`. *Reemplazado (10-11-2026, DEC-106): "`seq: 1..4`".* Si el comprobante se autoriza después del primer vencimiento, las fechas se corren al habilitar `fiscalGate` (RN-COB-158 punto 3; M05 RN-FAC-165; DEC-107, 10-11-2026). |
| `dueScheduleShift` | `{ authorizedAt, graceDays, shiftDays, originalDueDates[{ seq, dueDate }] }` | No | Corrimiento de vencimientos por autorización tardía aplicado al habilitar `fiscalGate`; M08 calcula la mora desde las fechas corridas de `dueSchedule` (RN-COB-158 punto 3; M05 RN-FAC-165; DEC-107, 10-11-2026). |
| `fiscalGate` | `{ status: notRequired\|pendingAuthorization\|authorized\|released, authorizationKind, authorizedAt, issueAttempt, lateAuthorizationGraceDays }` (`lateAuthorizationGraceDays` copiado de `fac.invoice.issued`, M05 RN-FAC-165; 10-11-2026) | Sí | Compuerta fiscal del documento de origen (DEC-107; RN-COB-158): mientras esté `pendingAuthorization` la obligación no genera movimiento en el auxiliar, no se cobra, no se publica al portal ni a entes y no emite identificador de pago; `released` = el comprobante volvió a borrador o a la cola en M05 (EVT-FAC-22). Default `notRequired` para orígenes sin autorización fiscal. |
| `amount` | money | Sí | Importe original. |
| `components` | [`{ kind: capital\|tax\|thirdParty\|surcharge\|interest\|financing\|fee\|other, code, amount, thirdPartyBillerId? }`] | Sí | Desglose (neto, IVA, percepción, IIBB, terceros). |
| `itemClass` | enum `standard`, `guaranteeDeposit`, `subsidyFundContribution`, `burialRightAcquisition`, `burialRightMaintenance` | Sí | Clase del ítem de M05 (RF-FAC-176); default `standard`. `guaranteeDeposit` es pasivo reintegrable (RN-COB-157). Si un comprobante mezcla clases, cada bloque es una obligación propia (`sourceLineKey`). |
| `openAmount` | DECIMAL(18,4) | Sí | Proyección no editable (RN-COB-002). |
| `openComponents` | [`{ kind, amount }`] | Sí | Saldo por componente. |
| `balanceStatus` | enum `pending`, `partial`, `paid`, `voided` | Sí | Derivado. |
| `lifecycle` | `{ agreementId?, writtenOffAt?, prescribedAt?, notifiedNoticeId?, disputeClaimId? }` | No | Marcas de M08/M09. |
| `collectionBlock` | `{ blocked, reason, until, by, at }` | No | Bloqueo de cobro (RF-COB-012). |
| `directDebitMandateId` | uniqueidentifier | No | Adhesión aplicable. |
| `paymentReferenceIds` | [uniqueidentifier] | No | Identificadores publicados. |
| `generatedInCash` | bool | No | Comprobante generado en caja (`GEN_CAJ`). |
| `legacy` | `{ system, table, key, displayKey, runId, hash, readOnly, priorMigration }` (T05; antes `{ system, id, user, account }`) | No | Claves ProCoop: `key` = `ID_FAC`; `displayKey` = `USUARIO` y cuenta. |
| `recordedAt` | Date | Sí | Registro (AGR-010). |

Índices: `{tenantId, sourceDocumentId, sourceLineKey}` único (la reemisión de un comprobante devuelto a borrador actualiza la misma obligación; DEC-107); `{tenantId, 'fiscalGate.status', issueDate}` (DEC-107); `{tenantId, currentAccountId, balanceStatus, 'dueSchedule.0.dueDate'}`; `{tenantId, holderId, balanceStatus}`; `{tenantId, serviceId, period}`; `{tenantId, 'legacy.key'}` (antes `'legacy.id'`); `{tenantId, directDebitMandateId, balanceStatus}`. Origen: `FACTURAS`, `DEUDAVTA`, `COMPNOTI`, `ANUFAC`, `CAPITAL` (obligaciones de capital).

### 7.3 `ledgerEntries` — movimientos del auxiliar

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `entryNo` | long | Sí | Correlativo por tenant. |
| `currentAccountId`, `holderId`, `serviceId` | uniqueidentifier | Sí | — |
| `direction` | enum `debit` \| `credit` | Sí | — |
| `kind` | enum `obligation`, `payment`, `creditNote`, `advance`, `adjustment`, `reversal`, `chargeback`, `refund`, `writeOff`, `agreementReplacement`, `migrationOpening` | Sí | — |
| `amount` | money | Sí | — |
| `obligationId` / `creditBalanceId` / `receiptId` | uniqueidentifier | Cond. | Vínculos. |
| `sourceRef` | `{ type, id }` | Sí | Documento o hecho de origen. |
| `effectiveDate` | Date | Sí | Fecha efectiva. |
| `recordedAt` | Date | Sí | Fecha de registro. |
| `reversalOf` | uniqueidentifier | No | Movimiento que revierte. |
| `reasonCode`, `reasonText` | string | Cond. | Obligatorio en ajustes y reversos. |
| `authorizedBy` | uniqueidentifier | Cond. | Ajustes y reversos. |
| `operationId` | string | Sí | Idempotencia. |

Índices: `{tenantId, operationId, kind}` único; `{tenantId, currentAccountId, effectiveDate}`; `{tenantId, obligationId}`; `{tenantId, entryNo}` único. Origen: derivado de `FACTURAS`, `IT_PAGSO`, `ANTICIPOS`, `ANUPAG_SOC`.

### 7.4 `allocations` — imputaciones

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `obligationId` | uniqueidentifier | Sí | Obligación cancelada. |
| `creditType` | enum `payment`, `creditNote`, `creditBalance`, `retention`, `writeOff`, `agreement` | Sí | Origen del crédito. |
| `creditRef` | `{ type, id }` | Sí | Recibo, saldo a favor, NC. |
| `component` | enum `surchargeBetweenDues`, `interestMora`, `interestFinancing`, `thirdParty`, `tax`, `capital` | Sí | Componente imputado. |
| `amount` | DECIMAL(18,4) | Sí | — |
| `prevOpenAmount` | DECIMAL(18,4) | Sí | Saldo previo (`SAL_ACT`). |
| `policy` | `{ policyId, version, strategy }` | Sí | Regla aplicada. |
| `sequence` | int | Sí | Orden dentro de la operación. |
| `effectiveDate` | Date | Sí | — |
| `status` | enum `active` \| `reversed` | Sí | — |
| `reversedBy` | uniqueidentifier | No | Imputación inversa. |
| `reversalReason` | string | Cond. | — |
| `authorizedBy` | uniqueidentifier | Cond. | Reasignaciones. |
| `operationId` | string | Sí | Idempotencia. |

Índices: `{tenantId, operationId, sequence}` único; `{tenantId, obligationId, status}`; `{tenantId, 'creditRef.id', status}`. Origen: `IT_PAGSO` (`ENTREGA`, `SAL_ACT`, `INT_234`, `INT_MOR`, `INT_FIN`, `FACTOR`, `FEC_ACRED`, `NRO_CUO`), `TALONFAC_PAGO`, `ANUIT_PAGSO`, `IT_PAGSO_INTERES`, `IT_PAGSO_INTERES_TRAMAS` (el detalle de cálculo lo guarda M08).

### 7.5 `allocationPolicies` — políticas de imputación (configuración versionada, T04)

Campos: `code`, `nameKey` (dict), `scope` `{ serviceIds, channels: [cash, collector, agency, directDebit, gateway, coupon, internal] }`, `strategy` enum `explicit` \| `oldestFirst` \| `servicePriority` \| `payerChoice`, `ageReference` enum `firstDue` \| `lastDue`, `servicePriority` [serviceId], `componentOrder` [component], `partialAllowedByChannel` {canal: bool}, `minimumCoverage` enum `surcharges` \| `none`, `remainderTreatment` enum `creditBalance` \| `pendingApplication`, `crossServiceAllowed` enum `never` \| `payerChoice` \| `policy`, `cashValidations` `{ fullNotifiedDebt, oldestFirst, oldestFirstByService, installmentsInOrder, fullCoupon, severity: error|warning }`, `version`, `status` enum `draft` \| `published` \| `retired`, `validFrom`. Índice `{tenantId, code, version}` único. Origen: V2 321, 324, 375, 462, 2263, 2355.

### 7.6 `creditBalances` — saldos a favor y anticipos

Campos: `currentAccountId`, `holderId`, `serviceId` (opcional), `origin` enum `overpayment`, `advance`, `onAccount`, `duplicatePayment`, `rounding`, `creditNote`, `allocationReversal`, `retentionExcess`, `collectorExcess`, `migration`, `guaranteeRefund` (devolución de depósito en garantía, RF-COB-190; HUECO-OTR-04); `sourceRef`; `amount`, `openAmount` (proyección); `autoApplicable` bool; `applyOnNextInvoice` bool; `partialApplicationPct` DECIMAL(18,4); `dueSchedule` (anticipos con vencimientos); `validFrom`, `validTo`; `status` enum `open`, `consumed`, `refundRequested`, `refunded`, `voided`; `notes`. Índices: `{tenantId, currentAccountId, status}`; `{tenantId, 'sourceRef.id'}`. Origen: `ANTICIPOS` (`IMP_ANT`, `SDO_ANT`), `ANTIFACTU`, `CREDITOS_NOAUTOMATICOS`.

### 7.7 `unidentifiedReceipts` — cobros no identificados

Campos: `channel` enum `cash`, `agency`, `gateway`, `transfer`, `directDebit`, `collector`; `sourceRef` (línea de rendición, transacción, movimiento bancario M14); `amount`; `receivedAt`; `payerData` `{ name, docType, docNumberMasked, cbuMasked, bankReference, freeText }`; `candidateObligationIds`; `evidenceStoredFileIds` (antes `evidenceFileIds`); `status` enum `pending`, `identified`, `applied`, `refundRequested`, `refunded`, `transferredToCredit`, `voided`; `assignedTo`; `escalatedAt`; `resolution` `{ holderId, currentAccountId, receiptId, creditBalanceId, approvedBy, at, verificationData }`. Índices: `{tenantId, status, receivedAt}`; `{tenantId, 'sourceRef.id'}` único. Origen: no existe en ProCoop (registros con "Comprobante no encontrado").

### 7.8 `accountStatements` — resúmenes de cuenta

Campos: `number`, `currentAccountId`, `billingGroupId`, `cutoffDate`, `periodFrom`, `periodTo`, `lines` [`{ obligationId, serviceId, document, dueDate, originalAmount, openAmount }`], `totalsByService` [`{ serviceId, open }`], `totalOpen`, `minimumPayment`, `creditAvailable`, `couponId`, `paymentReferenceIds`, `storedFileId` (PDF privado), `deliveryChannels`, `status` enum `issued`, `delivered`, `superseded`. Índice `{tenantId, currentAccountId, cutoffDate}`. Origen: resumen / talón sumado.

### 7.9 `cashRegisters` — cajas (puestos)

Campos: `code` (número), `name`, `branchId`, `type` enum `counter`, `agencyVirtual`, `collector`, `digitalChannel`, `remote`; `fixedUserId`; `agencyId`; `collectorId`; `connectorId`; `allowedMethods`; `limits` `{ maxPerOperation, maxCashOnHand }`; `staticQrCodeId`; `printerProfile` (T06); `status` enum `active`, `inactive` (catálogo; una caja `inactive` no abre sesiones). Índice `{tenantId, code}` único. Origen: `CAJASJP`, `BANCOS.CAJA`, `USERS.COD_CAJ`.

### 7.10 `cashSessions` — sesiones (turnos)

Campos: `cashRegisterId`, `userId`, `businessDate`, `openedAt`, `closedAt`, `openingFloat` [money], `status` (sección 8), `expected` [`{ method, currency, amount }`], `declared` [`{ method, currency, amount, denominations? }`], `differences` [`{ method, currency, amount, justification, approvedBy, adjustmentEntryId }`], `integrityIssues` [], `closeGroupId` (cierre múltiple), `handoverId`, `notes`. Índices: `{tenantId, cashRegisterId, status}` (único parcial para `open`); `{tenantId, userId, businessDate}`. Origen: `CAJAS` (`APERTURA`, `CIERRE`, `TOT_EFE`, `TOT_CHE`, `TOT_RET`, `TOT_TAR`, `TOT_DIF`, `TOTAL`, `OBS_CAJ`), `CIERRE`.

### 7.11 `cashOperations` — operaciones de caja

Campos: `operationNo`, `sessionId`, `cashRegisterId`, `type` enum `collection`, `supplierPayment`, `donation`, `manualIn`, `manualOut`, `prepaidSale`, `thirdPartyCollection`, `agencySettlement`, `gatewaySettlement`, `directDebitSettlement`, `collectorSettlement`, `roundingAdjustment`; `channel`; `agencyId` / `connectorId`; `businessDate`, `time`; `totalsByMethod` [`{ method, in, out }`]; `cashPaid`; `change`; `receiptIds`; `originRef` (rendición, intención, lista de cobro); `status` enum `confirmed`, `pendingFiscal`, `voided`; `void` `{ by, at, reason, approvalRequestId }`; `operationId` (único). Índices: `{tenantId, operationId}` único; `{tenantId, sessionId}`; `{tenantId, businessDate, cashRegisterId}`. Origen: `PLAN_CAJ` (`TP_PLA`, `NUM_CAJ`, `COD_OPER`, `ENT_EFE`, `ENT_CHE`, `ENT_RET`, `ENT_TAR`, `ENT_TRA`, `SAL_*`, `PAG_EFE`, `VUE_EFE`, `COD_BAN`, `ESTADO`), `ANUPLAN_CAJ`.

### 7.12 `receipts` — recibos

Campos: `legalEntityId` (→ T04; DEC-064, DEC-087: un recibo pertenece a una sola entidad jurídica), `number` `{ pointOfSale, number, voucherTypeId }` con `pointOfSaleId` / `numberSequenceId` del servicio de numeración de M05 asociado a la entidad (CTR-DAT-74), asignado con `fac.service.nextNumber` (RF-FAC-179, RF-COB-087), `type` enum `official`, `internal`, `agency`, `refundToHolder`; `cashOperationId` (una operación de caja puede tener varios recibos, uno por entidad jurídica, RN-COB-152); `currentAccountId`, `holderId`; `issueDate`, `paymentDate`; `total`; `items` [`{ obligationId, document, serviceId, prevOpen, applied, components: {surcharge, interest, financing, thirdParty, capital}, factor: 1|-1 }`] (vista desnormalizada de `allocations`); `creditBalanceIds`; `tenderSummary`; `fiscal` `{ status: notRequired|pending|authorized|failed, documentId }`; `storedFileId`; `validationCode` (QR público); `status` enum `issued`, `voided`; `voidRef`; `deliveries` [`{ channel, to, at, status }`]; `reprints` [`{ by, at, charged }`]. Índices: `{tenantId, legalEntityId, 'number.pointOfSale', 'number.number', 'number.voucherTypeId'}` único (CTR-DAT-74; antes sin `legalEntityId`); `{tenantId, cashOperationId, legalEntityId}`; `{tenantId, currentAccountId, issueDate}`; `{tenantId, validationCode}` único. Origen: `PAG_SOC`, `IT_PAGSO`, `REC_CON`, `IT_RECCO`, `ANUPAG_SOC`.

### 7.13 `paymentTenders` — medios de pago aplicados

Campos comunes: `cashOperationId`, `method` enum `cash`, `thirdPartyCheque`, `ownCheque`, `transfer`, `debitCard`, `creditCard`, `qr`, `retention`, `creditBalance`, `agency`, `gateway`, `directDebit`; `currency`, `amount`, `exchangeRate`, `amountInBase`; `status` enum `inRegister`, `handedOver`, `presented`, `deposited`, `rejected`, `voided`; `handoverId`. Detalle por medio:
- `cash`: `denominations` (opcional).
- `thirdPartyCheque`: `bankCode`, `branch`, `number`, `chequeDate`, `issuerCuit`, `issuerName`, `isDeferred`, `portfolioRef` (M14).
- `ownCheque`: `chequebookRef` (M14).
- `transfer`: `treasuryAccountId` (M14), `reference`, `transferDate`, `subtype` enum `bank` \| `card` \| `qr`, `verification` `{ status, by, at, evidenceStoredFileId }` (antes `evidenceFileId`).
- `debitCard` / `creditCard`: `cardPlanId`, `brand`, `last4`, `authorizationCode`, `voucherNumber`, `installments`, `surchargeAmount`, `presentation` `{ presented, number, date }`.
- `qr`: `intentId`, `gatewayTransactionId` (antes `transactionId`).
- `retention`: `taxType`, `regime`, `certificateNumber`, `retentionDate`, `storedFileId`, `presented`.
- `creditBalance`: `creditBalanceId`.
- `agency` / `gateway` / `directDebit`: `settlementId` (→ M07 `agencySettlements`) / `gatewayTransactionId` (antes `transactionId`; → M07 `gatewayTransactions`) / `directDebitBatchId` (antes `batchId`; → M07 `directDebitBatches`) (PA-COB-21).

Índices: `{tenantId, cashOperationId}`; `{tenantId, method, status}`; `{tenantId, 'thirdPartyCheque.bankCode', 'thirdPartyCheque.number'}` (control de repetidos V2 2725). Origen: `EFEC_OP`, `TRAN_OP`, `VALORES`, `RETENCIO`, `IT_RETM`, `CUPONTAR`, `PAGOTAR`.

### 7.14 `paymentMethods` — catálogo de medios (configuración)

Campos: `code`, `nameKey`, `kind` (enum de `paymentTenders.method`), `ledgerAccountId` (M15), `requiresManualData`, `allowsChange`, `allowedChannels`, `currency`, `isDefaultInCash`, `active`. Origen: `TIP_VAL` (`CTA_CONTA`, `DATO_MANUAL`, `VUELTO`), `FORMAPA`, `FPITEMS`, `FPALIC_IVA`; V2 650.

### 7.15 `cardPlans` — tarjetas y recargos

Campos: `brand`, `name`, `processor`, `merchantNumber`, `cardType` enum `debit` \| `credit`, `presentationMode` enum `autoOnClose` \| `treasury`, `usableInCash`, `cashSurcharge` `{ pct, amount }`, `installmentPlans` [`{ installments, surchargeType: pct|amount, value }`], `surchargeProductId`, `active`. Origen: `TARJETAS` (`COD_TARJ`, `NOM_TARJ`, `COD_PROV`, `COMERCIO`, `PER_DEB`, `PRESEN`, `USO_CAJA`, `POR_CAJA`, `IMP_CAJA`, `COD_PRO`), `TARJETAS_RECARGO` (`CUOTAS`, `RECARGO_TIPO`, `RECARGO_VALOR`).

**Dueño:** M07 (COL-COB-15, CTR-DAT-08). M14 solo lee el plan para cupones, presentaciones y liquidaciones (su §7.27 quedó reemplazada); se agregan aquí los campos que M14 necesita del plan: `code` (único, `COD_TARJ`), `processorSupplierId` (proveedor procesador de M12; precisa `processor`, `COD_PROV`), `fileCode` (`COD_ARC`), `cardType` admite además `prepaid`, `settlementTreasuryAccountId` (cuenta de acreditación de M14; `settlementAccountId` en M14) y `settlementDays` (días de acreditación); se exponen por servicio interno de lectura. `surchargeProductId` es el concepto del recargo (`surchargeConceptId` en T05; alias).

### 7.16 `cashDiscountRules` — descuentos en caja

**Reemplazado por `earlyPaymentDiscountRules` de M08 (CTR-DAT-40).** M07 no es dueño de esta colección: la caja consulta la regla de descuento por pronto pago de M08 (§7.5 de M08) en la misma cotización que el recargo (`mor.surcharge.quote`) y aplica el resultado documentándolo vía M05 (RF-COB-069). Los campos siguientes se conservan como referencia del origen `DESCUENTO_CAJA` que migra a M08.

Campos: `serviceId` o `billingTypeId`, `dayFrom`, `dayTo`, `pct`, `productId` (bonificación), `membersOnly`, `validFrom`, `validTo`, `status`. Validación: rangos no superpuestos por tipo y suma ≤ 100. Origen: `DESCUENTO_CAJA` (`DIA_DESDE`, `DIA_HASTA`, `COD_TPFC`, `DESCUENTO`, `COD_PRO`, `SOLO_SOCIOS`).

### 7.17 `staticQrCodes` — QR estáticos por puesto

Campos: `cashRegisterId`, `connectorId`, `externalQrId`, `payloadRef`, `imageStoredFileId` (antes `imageFileId`), `currentTransaction` `{ reference, amount, intentId, loadedAt }`, `status` enum `active`, `inactive`. Origen: `CAJAS_QR` (`QR`, `QR_ID`).

### 7.18 `collectors`, `collectionRounds`, `collectorSettlements` — cobradores (MER-007)

- `collectors`: `code`, `personId`, `cashRegisterId`, `zones`, `limits` `{ maxCashOnHand, maxPerOperation }`, `allowedMethods`, `commission` `{ mode: pct|perReceipt, value, min }`, `deviceIds`, `receiptSeries`, `status` enum `active`, `suspended`, `inactive` (§8.19; PA-COB-21; antes sin valores).
- `collectionRounds`: `collectorId`, `plannedDate`, `items` [`{ obligationId, currentAccountId, expectedAmount, surchargeQuote, status: pending|collected|partial|notCollected, reason, offlineReceiptNo, clientMutationId, collectedAt, geo }`], `status` (sección 8).
- `collectorSettlements`: `collectorId`, `roundIds`, `collectedTotal`, `handedOverTotal`, `difference`, `justification`, `sessionId`, `commissionBase`, `status`.

Índice `{tenantId, 'items.clientMutationId'}` único disperso. Origen: no existe en ProCoop (MER-007).

### 7.19 `collectionAgencies` — entes recaudadores

| Campo | Tipo | Descripción | Origen `BANCOS` |
|---|---|---|---|
| `code`, `name` | string | Identificación | `COD_BAN`, `DES_BAN` |
| `type` | enum `network`, `bank`, `card`, `portfolio`, `gatewaySettlement` | Tipo | — |
| `agreementCode` | string | Convenio (se valida contra la cabecera) | `CONVENIO` |
| `conceptCode` | string | Concepto Red Link | `ID_CON` |
| `barcode` | `{ formatCode, agreement }` | Formato y convenio del código de barras | `ID_CODBAR`, `CONV_CODBAR` |
| `cashRegisterId` | uniqueidentifier | Caja virtual | `CAJA` |
| `treasuryAccountId` | uniqueidentifier → M14 | Cuenta de acreditación | `COD_BANT` |
| `exportLayoutId`, `importLayoutId`, `controlLayoutId` | uniqueidentifier | Layouts | `COD_ARC2`, `COD_ARC` |
| `referenceMode` | enum `default`, `directObligationId`, `legacyUserAlias`, `format3_4_8`, `lagResolver` | Forma de identificar el comprobante | `ARC_CONFIG` |
| `maxAcceptedDue` | enum `due1`..`due4`, `none` | Último vencimiento aceptado. Con DEC-106 queda como dato de migración: el valor operativo es `dueDateCapacity` (`due1`..`due4` → 1..4; `none` → `null`). *Reemplazado como fuente operativa (10-11-2026, DEC-106).* | `PERFUETER`, `FUETERBAN` |
| `dueDateCapacity` | int ≥ 1 | Cantidad máxima de vencimientos que el ente admite, según su layout de exportación vigente (`fileLayouts.dueDateCapacity` de T06 para `exportLayoutId`) o lo que declare el convenio si es menor; obligatoria para habilitar el ente. Se publica a M05 con `cob.service.agencyDueDateCapacities` para validar el tope de vencimientos (RN-FAC-163) y define cuántos vencimientos se publican al ente: los primeros N (RN-COB-159; DEC-106, 10-11-2026) | `maxAcceptedDue` (migración) |
| `allowsPartial` | bool | Entregas | `PERMITE_ENTREGA` |
| `surchargeDeferral` | enum `none`, `deferMora`, `deferAll` | Modo de diferir | `DIFERIR` |
| `chargeAtDue1`, `chargeMoraAfterLastDue`, `forceZeroDailyInterest` | bool | Reglas de recargo | `COBVTO1`, `RECARGO3VTO`, `PORC_INTERES` |
| `fee` | `{ mode: none\|fixedPerItem\|pct, amount, pct, min, max, transferToPayer, productId }` | Comisión | `TRASLADAR`, `FORMA_CAL`, `IMPO_CAL`, `IMPO_MIN`, `IMPO_MAX` |
| `bankPostingMode` | enum `perReceipt`, `perCreditDate`, `perCashRegister`, `perPayment` | Registración bancaria | `TIPO_REG` |
| `autoReconciled` | bool | Movimiento nace conciliado | `CONCILIACION_AUTO` |
| `amountTolerance` | DECIMAL(18,4) | Tolerancia de importe | `_minimoDiferencia` |
| `maxItemsPerAccountPeriod`, `extraDaysLastDue`, `excludeAlreadyInformed`, `settlementDateMode` | varios | Reglas de layout (SIRO, Banelco) | V2 3006, 2818, 3023 |
| `transport` | `{ mode: manual\|sftp\|api, t06ConnectionId, schedule, autoConfirm, errorEmails }` | Canal | V2 2994, 2995, 3025, 3005 |
| `excludeDirectDebitAdhered` | bool | — | — |
| `status` | enum `active`, `inactive` | — | `IMPORTAR` |

Índice `{tenantId, code}` único. Origen adicional: `ENTIDADES`, `ENTIDACOL*`, `ENTIDACON`, `ENTIDACOU`, `ENTIDACRIT`, `ENTIDADCIR`, `ENTIDAEST`, `ENTIDAGRUP`, `ENTIDAMEN`, `ENTIDA_ESTADOS` (DFA M10; configuración de entidades: columnas, conceptos, criterios, circuitos, estados, grupos, mensajes) **[VERIFICAR]** su contenido real en la base LAG antes de mapear campo a campo; Empresas Tercerizadas (REL) → `collectionAgencies.type = network` o `thirdPartyBillers` según uso.

### 7.20 `fileLayouts` — motor declarativo de layouts

**Dueño: T06 (CTR-DAT-05, COL-INT-10).** M07 no es dueño de `fileLayouts`: los entes, débitos y rendiciones referencian el layout por `fileLayoutId` (`collectionAgencies.exportLayoutId`, `importLayoutId`, `controlLayoutId`, todos `fileLayoutId` de T06) y M07 aporta las familias y direcciones que necesita. La descripción siguiente queda como requisito de M07 sobre el motor de T06.

Campos: `code`, `family` enum `redlink`, `banelco`, `pagofacil`, `rapipago`, `cobroexpress`, `siro`, `visaMastercard`, `naranja`, `cbuDirectDebit`, `mercadopagoCsv`, `macro`, `prontopagoQr`, `bank`, `custom`; `direction` enum `export`, `import`, `control`, `novelty`, `delinquency`, `directDebitExport`, `directDebitImport`; `version`; `encoding` (header y detalle pueden diferir: RN-11 §1.1); `lineSeparator`; `recordWidth`; `header`, `detail`, `footer` [`{ name, start (base 0), length, type: numeric|alpha|date|julianDate|amount|constant, decimals, pad, align, format, source (expresión sobre el modelo), signPosition }`]; `footerCountOffset` (ej. −2); `fileNamePattern`; `controlFile` (layout asociado); `rules` (máximos por cuenta, filtros); `sampleFiles` [storedFileId]; `status` enum `draft`, `published`, `retired`. Índice `{tenantId|PLATFORM, code, version}` único: los layouts estándar viven en el tenant `PLATFORM` y se copian o referencian. Origen: `Importador_Base.Modelos`, `Exportador_Base.Modelos`, clases `Estructura`.

### 7.21 `paymentReferences` y `externalKeyAliases`

- `paymentReferences`: `kind` enum `obligation`, `coupon`, `notice`, `intent`, `installment`, `account`; `targetId`; `code` (identificador autocontenido); `checkDigit`; `barcodes` [`{ format, value, valid, invalidReason }`]; `electronicCode`; `qrPayload`; `validUntil`; `status` enum `active`, `consumed`, `cancelled`. Índice `{tenantId, code}` único; `{tenantId, targetId}`.
- `externalKeyAliases`: `source` enum `legacyUser`, `lagRedLink`, `accountTimes100`, `agencyIdentifier`, `procoopIdFac`; `agencyId`; `externalKey`; `currentAccountId`, `accountId`, `serviceId`; `validFrom`, `validTo`. Índice `{tenantId, source, agencyId, externalKey}` único. Origen: `FACTURAS.USUARIO`, `SUMSOC.COD_SUM`, identificador Red Link.
- Distinción de alias (CTR-DAT-25): `externalKeyAliases` (M07) resuelve claves externas con que los **entes y canales de cobro** identifican una deuda (operación vigente); `legacyKeyAliases` (T07) traduce claves ProCoop durante la migración; `externalReferences` (T06) vincula entidades con sistemas externos integrados. Un mismo valor puede estar en más de una, pero cada colección solo se consulta para su propósito.

### 7.22 `agencyDebtExports` y `agencyPublishedDebts`

- `agencyDebtExports`: `agencyId`, `layout` `{ id, version }`, `operation` enum `debtPublication`, `debtUpdate`, `directDebit`; `filters`; `period`; `storedFileId`, `controlStoredFileId` (antes `controlFileId`), `fileName`; `recordCount`; `totals` `{ due1, due2, due3 }` (con DEC-106 se agrega `byDue[] { seq, amount }` para layouts con más vencimientos; `due1..due3` se conservan por compatibilidad con SIRO); `publishedDueCount` (vencimientos publicados por ítem = mínimo entre `dueSchedule` y `collectionAgencies.dueDateCapacity`; RN-COB-159; DEC-106, 10-11-2026); `api` `{ transactionNo, confirmAutomatically, result: {correct, errors, processed, totalDue1, totalDue2, description}, state }`; `status` (sección 8); `sentVia`; `operationId`. Origen: `SIRO_BASEDEUDA` (`Nro_transaccion`, `Registros_correctos`, `Registros_erroneo`, `Registros_procesados`, `Confirma_automaticamente`, `Error_descripcion`, `Estado`, `Fecha_Envio`, `Fecha_proceso`, `Total_primer_vto`, `Total_segundo_vto`), carpeta `Debitos`.
- `agencyPublishedDebts`: `agencyId`, `exportId`, `targetRef` (obligación o cupón), `period`, `concept`, `identifier`, `index`, `dueAmounts`, `status` enum `published`, `updated`, `withdrawn`, `paid`. Índice `{tenantId, agencyId, period, concept, identifier}` único. Origen: `RED_LINK` (`INDICE`, `PERIODO`, `CONCEPTO`, `IDENTIFICADOR`, `COMPROBANTE`, `ENTIDAD`, `MODELO`), `DEUDARED` (`CANTIDAD`), `DEUDARED_TIPO` (`REDONDEO`, `COD_TPFC`). Por CTR-DAT-42 de T05, `DEUDARED`/`DEUDARED_TIPO` son deuda publicada a la red y los migra solo M07 a esta colección (M04 no los migra; `roundingCarryEntries` de M04 nace vacía). [VERIFICAR] en LAG: RN-01 §15 los relaciona con el saldo de redondeo; si en LAG resultan ser saldo de redondeo, M07 carga ese saldo inicial como movimiento de apertura por cuenta (`ledgerEntries` de migración, y `creditBalances` con `origin = rounding` si es a favor) y T05 revisa CTR-DAT-42.

### 7.23 `agencySettlements` y `agencySettlementLines`

- `agencySettlements`: `agencyId`, `source` enum `upload`, `sftp`, `api`; `storedFileId`, `fileHash`; `presentationDate`; `header` `{ agreement, date }`; `footer` `{ count, total }`; `read` `{ count, total }`; `warnings`; `status` (sección 8); `confirmedBy`, `confirmedAt`; `cashOperationId`; `feeTotal`; `expectedCredit` `{ net, date, treasuryAccountId }`. Índice `{tenantId, agencyId, fileHash}` único.
- `agencySettlementLines`: `settlementId`, `lineNo`, `rawMasked`, `parsed` `{ amount, accountKey, reference, dueDate, paymentDate, creditDate, conceptId, barcode, rejectCode }`, `resolution` `{ method: reference|alias|lagResolver|barcode|intent, obligationIds, couponId, intentId, candidates }`, `expectedAmount`, `result` enum `ok`, `warning`, `error`; `messages` [`{ code, text }`]; `selected` bool; `action` enum `applied`, `creditCreated`, `unidentified`, `ignored`, `rejectedDebit`, `pending`; `receiptId`; `unidentifiedId`. Índice `{tenantId, settlementId, lineNo}` único. Origen: log `LogCobranzaEntidades`, `RECHAZOS`.

### 7.24 `agencyNoveltyFiles` — novedades y morosidad

Campos: `agencyId`, `kind` enum `novelty` \| `delinquency`, `storedFileId`, `fileHash`, `lines` [`{ action: add|remove|update, accountKey, mediumMasked, period, amount, dueDate, presentationDate, result, message }`], `status` enum `imported`, `applied`, `rejected`. Origen: archivos Naranja, Visa crédito/débito, PampaPagos, Comafi.

### 7.25 `directDebitMandates` y `directDebitBatches`

- `directDebitMandates`: `currentAccountId`, `accountId`, `serviceIds` (vacío = todos), `agencyId` o `gatewayConnectorId` (nombre de T05; antes `connectorId`), `mediumType` enum `cbu` \| `card`, `cbuEncrypted`, `cbuMasked`, `cardToken` (identificador opaco del proveedor, nunca PAN; DEC-091), `cardTokenType` enum `gatewayToken` \| `processorAdherentId`, `brand`, `last4`, `holderName`, `holderCuit`, `periodFrom`, `signedAt`, `status` (sección 8), `externalId`, `exclusions` [`{ billingTypeId | serviceId }`], `consecutiveRejections`, `lastRejectCode`, `cancelledAt`, `source` enum `operator`, `portal`, `novelty`, `api`, `migration`. Índices: `{tenantId, currentAccountId, status}`; `{tenantId, gatewayConnectorId, externalId}`. Origen: `SUMSOC` (`DEB_TARJ`, `COD_BAN`, `NUM_TARJ`, `ID_TARJ`, `PER_TARJ`, `FEC_TARJ`), `SUMSOC_EXTRAS` (`DEBITO_360_ID`, `DEBITO_360_ESTADO`), `DEBITO_EXCLUSION` (`COD_SUM`, `COD_TPFC`), `ADHSOC`.
- `directDebitBatches`: `agencyId` o `connectorId`, `exportId`, `debitDate`, `items` [`{ obligationId, mandateId, amount, attempt, status: presented|accepted|rejected|retryScheduled|excluded, rejectCode, receiptId }`], `totals`, `status` (sección 8).

### 7.26 `gatewayConnectors` y `paymentChannels`

- `gatewayConnectors`: `provider` enum `siro`, `pagos360`, `mercadopago`, `macro`, `naranjax`, `payfun`, `pagostic`, `sipago`, `helipagos`, `provincianet`, `prontopago`, `offline`; `name`; `environment` enum `sandbox` \| `production`; `baseUrls`; `credentialRef` (bóveda T06); `capabilities` [enum `createIntent`, `query`, `listCollections`, `cancel`, `refund`, `mandate`, `debit`, `chargebacks`, `dynamicQr`, `staticQr`, `invoiceQrBatch`, `barcode`, `debtBase`, `webhook`]; `channels` [`portal`, `app`, `cashRegister`, `cashQr`, `terminal`, `link`, `invoice`]; `allowedMethods`; `excludedMethods`; `cardDataMode` enum `hostedFields` \| `redirect` \| `terminal` \| `none` (DEC-091); `excludedCardBrands`; `excludedInstallments`; `minAmount`; `reuseWindowMinutes`; `reconciliationWindowDays`; `qrMerchantData` `{ merchantName, city, postalCode, mcc, cuit, cbu, province }`; `settlementAgencyId` (caja virtual y cuenta); `feeSchedule`; `directDebitCutoffDay`; `webhookTokenRef`; `health` `{ status: ok|degraded|credentialExpired|down, lastOkAt, lastError }`; `status` enum `active`, `suspended`, `inactive` (§8.19; PA-COB-21; antes sin valores). Índice `{tenantId, provider, name}` único. Origen: parámetros V2 por pasarela (sección 14), `CANALES_PAGOS.API`.
- `paymentChannels`: `code`, `nameKey`, `iconStoredFileId` (antes `iconFileId`), `connectorId`, `methods`, `visibleIn` [`portal`, `app`, `landing`], `order`, `active`. Origen: `CANALES_PAGOS` (`API`, `DESCRIPCION`, `OBSERVA`, `ICONO`, `MEDIOS`).

### 7.27 `paymentIntents` — intenciones de pago

| Campo | Tipo | Oblig. | Descripción | Origen `PAGOS360` |
|---|---|---|---|---|
| `intentNo` | long | Sí | Correlativo | `COD_PAG` |
| `connectorId` | uniqueidentifier | Sí | Conector | `API` |
| `type` | enum `invoice`, `coupon`, `installment`, `prepaid`, `web`, `cashRegister`, `link`, `manual`, `directDebit`, `file`, `thirdPartySummary` | Sí | Tipo | `TIPO` |
| `originChannel` | enum `portal`, `app`, `landing`, `cash`, `crm`, `whatsapp`, `api`, `system` | Sí | Canal | — |
| `currentAccountId`, `holderId` | uniqueidentifier | Cond. | — | — |
| `payer` | `{ name, email, phone }` | No | Pagador | `NOMBRE`, `MAIL` |
| `items` | [`{ obligationId\|couponId, document, serviceId, installment, amountsByDue, surchargeMora, surchargeDue }`] | Sí | Ítems | `PAGOS360_ITEMS` (`ID_FAC`, `TOTAL1/2`, `VTO1/2`, `TALON`, `CUOTA`, `RECARGO_MORA`, `RECARGO_VTO`) |
| `amounts` | [`{ seq, dueDate, amount }`] | Sí | Importes por vencimiento | `IMPORTE1/2`, `VTO1/2` |
| `allowedMethods` | [enum] | Sí | Medios | `MEDIOS` |
| `concept` | string | Sí | Concepto | `CONCEPTO` |
| `expiresAt` | Date | Sí | Vencimiento | — |
| `status` | enum (sección 8) | Sí | Estado | `ESTADO` |
| `externalId` | string | Cond. | Id externo | `ID_360`, `ID_SIRO`, `ID_ENTIDAD` |
| `externalRefs` | `{ checkoutUrl, barcode, barcodeUrl, rapipagoBarcode, pagoFacilBarcodes, qrData, pdfUrl }` | No | Datos devueltos | `URL_PAGO`, `CODIGO_BARRA` |
| `metadata` | objeto | No | Metadata del proveedor | `PAGOS360_EXTRAS.METADATA` |
| `mandateId` | uniqueidentifier | No | Débito | `DEBITO_ID`, `DEBITO_TIPO` |
| `shares` | [`{ channel, to, at, status }`] | No | Envíos del link | — |
| `reusedFromId` | uniqueidentifier | No | Reutilización | — |
| `transactionIds` | [uniqueidentifier] | No | Transacciones | — |
| `receiptId` | uniqueidentifier | No | Imputación | — |
| `statusHistory` | [`{ from, to, at, by, cause }`] | Sí | Auditoría | `Cambiar_Estado` |
| `uncertainSince` | Date | No | Pago incierto | — |
| `idempotencyKey` | string | Sí | — | — |

Índices: `{tenantId, intentNo}` único; `{tenantId, connectorId, externalId}` único disperso; `{tenantId, status, expiresAt}`; `{tenantId, 'items.obligationId', status}`. Origen: `PAGOS360`, `PAGOS360_ITEMS`, `PAGOS360_EXTRAS`.

### 7.28 `gatewayTransactions` y `gatewayWebhookEvents`

- `gatewayTransactions`: `connectorId`, `intentId`, `externalPaymentId`, `type` enum `payment`, `rejection`, `chargeback`, `refund`, `reversal`; `status`; `channel`; `grossAmount`; `grossFee`; `netFee`; `feeVat`; `netAmount`; `feeEstimated` bool; `paidAt`; `availableAt`; `payerMasked`; `evidenceStoredFileId` (antes `evidenceFileId`); `receivedVia` enum `webhook`, `reconciliation`, `polling`, `file`; `cashOperationId` (cuando se imputa; equivalente `ID_PLA`). Índice `{tenantId, connectorId, externalPaymentId, type}` único. Origen: `PAGOS360_PAGOS` (`ID_360`, `IMPORTE`, `NET_FEE`, `NET_AMOUNT`, `FEE_IVA`, `GROSS_FEE`, `FECHA_REG`, `FECHA_PAG`, `FECHA_REN`, `CHANNEL`, `COD_PAGSOC`).
- `gatewayWebhookEvents`: `connectorId`, `receivedAt`, `headersFiltered`, `signatureValid`, `payloadRef` (almacenamiento privado), `dedupeKey`, `status` enum `received`, `processing`, `processed`, `ignored`, `failed`; `attempts`; `lastError`; `relatedIntentId`. Índice `{tenantId, connectorId, dedupeKey}` único; retención 18 meses (PRM-COB-126).

### 7.29 `paymentCoupons` — cupón de pago único

Campos: `couponNo`, `legalEntityId` (→ T04, Sí; todas las obligaciones del cupón son de esa entidad, RN-COB-156), `currentAccountId`, `statementId`, `obligationIds`, `totalsByDue` [`{ seq, dueDate, amount }`], `paymentReferenceId`, `status` (sección 8), `validUntil`, `legacy` `{ talonNumber, installment }`. Origen: `TALONFAC` (cuota 0 = talón sumado), `TALONFAC_PAGO`.

### 7.30 `refundCases` y `chargebacks`

- `refundCases`: `caseNo`, `currentAccountId`, `holderId`, `sourceRef` (recibo, transacción, saldo a favor, no identificado), `cause`, `amount`, `correctiveDocumentId` (NC M05), `destination` `{ type: gateway|bankTransfer|cash, cbuMasked, holderName, holderCuit }`, `requestedBy`, `approvedBy`, `workflowInstanceId` (T11), `status` (sección 8), `execution` `{ via: connector|treasury|cash, externalRefundId, executedAt, idempotencyKey }`, `reconciliationId`.
- `chargebacks`: `connectorId`, `transactionId`, `intentId`, `receiptId`, `amount`, `reason`, `notifiedAt`, `status` (sección 8), `reversalAllocationIds`, `chargeObligationIds` (interés y comisión de reversión), `blockedAccountIds`, `evidenceStoredFileIds` (antes `evidenceFileIds`).

### 7.31 `collectionReconciliations` y `treasuryHandovers`

- `collectionReconciliations`: `date`, `scope` `{ agencyId | connectorId | cashRegisterId }`, `gross`, `fees`, `feeVat`, `retentions`, `expectedNet`, `bankCredited`, `difference`, `items` [`{ ref, type, expected, actual, status: matched|unmatched|difference, comment, exceptionId }`], `status` (sección 8), `closedBy`, `minutesStoredFileId` (antes `minutesFileId`).
- `treasuryHandovers`: `sessionIds` o `collectorSettlementId`, `legalEntityId` (una entrega por entidad jurídica, RF-COB-194), `deliveredBy`, `receivedBy`, `contents` `{ cashByCurrency, cheques [tenderId], cardVouchers [tenderId], retentions [tenderId], transfers [tenderId] }`, `reportStoredFileId` (antes `reportFileId`), `status` (sección 8), `deliveredAt`, `receivedAt`, `observations`. M07 registra la **entrega**; M14 registra la **recepción** en `cashRemittances` con `treasuryHandoverId` = `_id` de esta entrega (CTR-DAT-64, CTR-TES-25): `receivedBy` y `receivedAt` se completan al consumir `tes.cashRemittance.accepted` (EVT-TES-08, con `treasuryHandoverId`) y no se editan en M07.

### 7.32 `thirdPartyBillers` y `thirdPartyCollections`

- `thirdPartyBillers`: `code`, `name`, `linkedAccountId`, `barcodeType`, `thirdPartyNumber`, `voucherTypeId`, `productId`, `fee` `{ mode, value, min }`, `billingTypeId`, `allowsPartial`, `allowsOverdue`, `allowsMultiple`, `allowsRefund`, `minAmount`, `isDonationEntity`, `summaryServiceConnectorId`, `active`. Origen: `TERCEROS` (`DES_TER`, `COD_SUM`, `COD_BAR`, `NRO_TER`, `COD_COM`, `COD_PRO`, `FORMA_CAL`, `IMPO_CAL`, `IMPO_MIN`, `COD_TPFC`, `PARCIALES`, `VENCIDOS`).
- `thirdPartyCollections`: `billerId`, `obligationId` (propia), `barcode`, `documentRef`, `dueDate`, `amount`, `fee`, `receiptId`, `summaryNumber`, `renderedToThirdPartyAt`, `status`. Origen: `FACTURAS_TERCEROS` (`ID_FAC`, `COD_TER`, `COMPROBANTE`, `FECHA_VTO`, `IMPORTE`, `FEC_RENDICION`, `IMP_COMISION`, `NRO_RESUMEN`).

### 7.33 `externalObligationImports`, `collectionReportSchemes`, `collectionExceptions`

- `externalObligationImports`: `format` enum `general`, `publicAdministration`, `procoopDocument`; `storedFileId`; `lines` [`{ lineNo, result, message, obligationId }`]; `status`.
- `collectionReportSchemes`: `name`, `productIds`, `serviceIds`, `taxIds`, `reportCode`. Origen: `ESQUEMAS_INFORMES_COBRANZAS`.
- `collectionExceptions`: `type` enum `uncertainPayment`, `amountMismatch`, `settlementLineError`, `duplicatePayment`, `webhookFailed`, `integrityDifference`, `offlineSyncConflict`, `fiscalPending`, `reconciliationDifference`, `directDebitRejected`, `connectorDown`; `sourceRef`; `severity`; `assignedTo`; `status` (sección 8); `resolution`; `dueAt`. Bandeja de AGR-016.

### 7.34 Tablas ProCoop sin colección propia

| Tabla CAT | Destino |
|---|---|
| `COBRANZA_LOG` | Auditoría de T02 (evento `cob.audit.*`), RF-COB-183. |
| `CANALES_PAGOS` | `paymentChannels`. |
| `PAGOS360_EXTRAS` | `paymentIntents.metadata`. |
| `TIP_VAL` | `paymentMethods`. |
| `IT_RETM` | `paymentTenders.retention` (detalle por régimen, compartido con M06). |
| `IT_PAGSO_INTERES`, `IT_PAGSO_INTERES_TRAMAS` | Detalle de cálculo de M08 referenciado desde `allocations`. |
| `CAPITAL` | Obligaciones de capital (`sourceType = other`, servicio institucional M17). Facturado y pagado del capital social en O5 (DEC-019). |
| `COMPNOTI` | `obligations.lifecycle.notifiedNoticeId` (M08). |

### 7.35 Tablas de campos normalizadas y referencias declaradas

Corrección de consistencia (categorías 2, 3 y 4 de `_trabajo/correccion-inconsistencias-instrucciones.md`). Para cada colección cuyo §7 lista los campos en texto se da la tabla normalizada; para las que ya tienen tabla, solo las referencias cuyo destino estaba implícito o faltaba. Fuentes: la lista del anexo y el catálogo de T05. La lista original sigue vigente como descripción; para nombres de campo y referencias prevalece esta tabla, alineada con T05. `[VERIFICAR]` marca tipo, obligatoriedad o destino no deducibles del anexo ni de T05. Referencia: colección destino (anexo dueño).

#### 7.35.1 `currentAccounts` (COL-COB-01) — referencias declaradas

| Campo | Referencia |
|---|---|
| `billingGroupId` | `billingGroups` (M05); antes implícita por el nombre |
| `allocationPolicyId` | `allocationPolicies` (M07); antes implícita por el nombre |

#### 7.35.2 `obligations` (COL-COB-02) — referencias declaradas

| Campo | Referencia |
|---|---|
| `billingGroupId` | `billingGroups` (M05); antes implícita por el nombre |
| `directDebitMandateId` | `directDebitMandates` (M07); antes implícita por el nombre |
| `paymentReferenceIds` | `paymentReferences` (M07); antes implícita por el nombre |

#### 7.35.3 `ledgerEntries` (COL-COB-03) — referencias declaradas

| Campo | Referencia |
|---|---|
| `creditBalanceId` | `creditBalances` (M07); antes implícita por el nombre |
| `operationId` | `cashOperations` (M07); antes implícita por el nombre |

#### 7.35.4 `allocations` (COL-COB-04) — referencias declaradas

| Campo | Referencia |
|---|---|
| `creditRef` | `creditBalances` (M07); antes implícita por el nombre |
| `operationId` | `cashOperations` (M07); antes implícita por el nombre |

#### 7.35.5 `allocationPolicies` (COL-COB-05)

Lista original: §7.5.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | [VERIFICAR] | — | — |
| `nameKey` | string | [VERIFICAR] | — | — |
| `scope` | object | [VERIFICAR] | `{ serviceIds, channels: [cash, collector, agency, directDebit, gateway, coupon, internal] }` | — |
| `strategy` | enum | [VERIFICAR] | Valores: `explicit`, `oldestFirst`, `servicePriority`, `payerChoice`. | — |
| `ageReference` | enum | [VERIFICAR] | Valores: `firstDue`, `lastDue`. | — |
| `servicePriority` | array | [VERIFICAR] | [serviceId] | — |
| `componentOrder` | array | [VERIFICAR] | [component] | — |
| `partialAllowedByChannel` | object | [VERIFICAR] | {canal: bool} | — |
| `minimumCoverage` | enum | [VERIFICAR] | Valores: `surcharges`, `none`. | — |
| `remainderTreatment` | enum | [VERIFICAR] | Valores: `creditBalance`, `pendingApplication`. | — |
| `crossServiceAllowed` | enum | [VERIFICAR] | Valores: `never`, `payerChoice`, `policy`. | — |
| `cashValidations` | object | [VERIFICAR] | `{ fullNotifiedDebt, oldestFirst, oldestFirstByService, installmentsInOrder, fullCoupon, severity: error\|warning }` | — |
| `version` | [VERIFICAR] | [VERIFICAR] | — | — |
| `status` | enum | [VERIFICAR] | Valores: `draft`, `published`, `retired`. | — |
| `validFrom` | Date | [VERIFICAR] | — | — |

#### 7.35.6 `creditBalances` (COL-COB-06)

Lista original: §7.6.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `currentAccountId` | uniqueidentifier | [VERIFICAR] | — | `currentAccounts` (M07) |
| `holderId` | uniqueidentifier | [VERIFICAR] | — | `holders` (M01) |
| `serviceId` | uniqueidentifier | No | opcional | `tenantServices` (M02) |
| `origin` | enum | [VERIFICAR] | Valores: `overpayment`, `advance`, `onAccount`, `duplicatePayment`, `rounding`, `creditNote`, `allocationReversal`, `retentionExcess`, `collectorExcess`, `migration`,… | — |
| `sourceRef` | string | [VERIFICAR] | — | — |
| `amount` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `openAmount` | DECIMAL(18,4) | [VERIFICAR] | proyección | — |
| `autoApplicable` | bool | [VERIFICAR] | — | — |
| `applyOnNextInvoice` | bool | [VERIFICAR] | — | — |
| `partialApplicationPct` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `dueSchedule` | [VERIFICAR] | [VERIFICAR] | anticipos con vencimientos | — |
| `validFrom` | Date | [VERIFICAR] | — | — |
| `validTo` | Date | [VERIFICAR] | — | — |
| `status` | enum | [VERIFICAR] | Valores: `open`, `consumed`, `refundRequested`, `refunded`, `voided`. | — |
| `notes` | string | [VERIFICAR] | — | — |

#### 7.35.7 `unidentifiedReceipts` (COL-COB-07)

Lista original: §7.7.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `channel` | enum | [VERIFICAR] | Valores: `cash`, `agency`, `gateway`, `transfer`, `directDebit`, `collector`. | — |
| `sourceRef` | string | [VERIFICAR] | línea de rendición, transacción, movimiento bancario M14 | — |
| `amount` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `receivedAt` | Date | [VERIFICAR] | — | — |
| `payerData` | object | [VERIFICAR] | `{ name, docType, docNumberMasked, cbuMasked, bankReference, freeText }` | — |
| `candidateObligationIds` | uniqueidentifier[] | [VERIFICAR] | — | `obligations` (M07) |
| `evidenceStoredFileIds` | uniqueidentifier[] | [VERIFICAR] | antes `evidenceFileIds` | `storedFiles` (T01) |
| `status` | enum | [VERIFICAR] | Valores: `pending`, `identified`, `applied`, `refundRequested`, `refunded`, `transferredToCredit`, `voided`. | — |
| `assignedTo` | [VERIFICAR] | [VERIFICAR] | — | — |
| `escalatedAt` | Date | [VERIFICAR] | — | — |
| `resolution` | object | [VERIFICAR] | `{ holderId, currentAccountId, receiptId, creditBalanceId, approvedBy, at, verificationData }` | — |

#### 7.35.8 `accountStatements` (COL-COB-08)

Lista original: §7.8.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `number` | int / string [VERIFICAR] | [VERIFICAR] | — | — |
| `currentAccountId` | uniqueidentifier | [VERIFICAR] | — | `currentAccounts` (M07) |
| `billingGroupId` | uniqueidentifier | [VERIFICAR] | — | `billingGroups` (M05); antes implícita por el nombre |
| `cutoffDate` | Date | [VERIFICAR] | — | — |
| `periodFrom` | Date | [VERIFICAR] | — | — |
| `periodTo` | Date | [VERIFICAR] | — | — |
| `lines` | array | [VERIFICAR] | [`{ obligationId, serviceId, document, dueDate, originalAmount, openAmount }`] | — |
| `totalsByService` | array | [VERIFICAR] | [`{ serviceId, open }`] | — |
| `totalOpen` | [VERIFICAR] | [VERIFICAR] | — | — |
| `minimumPayment` | [VERIFICAR] | [VERIFICAR] | — | — |
| `creditAvailable` | [VERIFICAR] | [VERIFICAR] | — | — |
| `paymentCouponId` | uniqueidentifier | [VERIFICAR] | Nombre de T05; antes `couponId` en este anexo. | `paymentCoupons` (M07); antes implícita por el nombre |
| `paymentReferenceIds` | uniqueidentifier[] | [VERIFICAR] | — | `paymentReferences` (M07); antes implícita por el nombre |
| `storedFileId` | uniqueidentifier | [VERIFICAR] | PDF privado | `storedFiles` (T01) |
| `deliveryChannels` | [VERIFICAR] | [VERIFICAR] | — | — |
| `status` | enum | [VERIFICAR] | Valores: `issued`, `delivered`, `superseded`. | — |

#### 7.35.9 `cashRegisters` (COL-COB-09)

Lista original: §7.9.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | [VERIFICAR] | número | — |
| `name` | string | [VERIFICAR] | — | — |
| `branchId` | uniqueidentifier | [VERIFICAR] | — | `branches` (T04) |
| `type` | enum | [VERIFICAR] | Valores: `counter`, `agencyVirtual`, `collector`, `digitalChannel`, `remote`. | — |
| `fixedUserId` | uniqueidentifier | [VERIFICAR] | — | `memberships` (T02) |
| `agencyId` | uniqueidentifier | [VERIFICAR] | — | `collectionAgencies` (M07); antes implícita por el nombre |
| `collectorId` | uniqueidentifier | [VERIFICAR] | — | `collectors` (M07); antes implícita por el nombre |
| `connectorId` | uniqueidentifier | [VERIFICAR] | — | `gatewayConnectors` (M07); antes implícita por el nombre |
| `allowedMethods` | [VERIFICAR] | [VERIFICAR] | — | — |
| `limits` | object | [VERIFICAR] | `{ maxPerOperation, maxCashOnHand }` | — |
| `staticQrCodeId` | uniqueidentifier | [VERIFICAR] | — | `staticQrCodes` (M07); antes implícita por el nombre |
| `printerProfile` | [VERIFICAR] | [VERIFICAR] | T06 | — |
| `status` | enum | [VERIFICAR] | Valores: `active`, `inactive`, `inactive`. | — |
| `workstationId` | uniqueidentifier | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `workstations` (T04); antes implícita por el nombre |

#### 7.35.10 `cashSessions` (COL-COB-10)

Lista original: §7.10.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `cashRegisterId` | uniqueidentifier | [VERIFICAR] | — | `cashRegisters` (M07); antes implícita por el nombre |
| `userId` | uniqueidentifier | [VERIFICAR] | — | `memberships` (T02) |
| `businessDate` | Date | [VERIFICAR] | — | — |
| `openedAt` | Date | [VERIFICAR] | — | — |
| `closedAt` | Date | [VERIFICAR] | — | — |
| `openingFloat` | array | [VERIFICAR] | [money] | — |
| `status` | [VERIFICAR] | [VERIFICAR] | sección 8 | — |
| `expected` | array | [VERIFICAR] | [`{ method, currency, amount }`] | — |
| `declared` | array | [VERIFICAR] | [`{ method, currency, amount, denominations? }`] | — |
| `differences` | array | [VERIFICAR] | [`{ method, currency, amount, justification, approvedBy, adjustmentEntryId }`] | — |
| `integrityIssues` | array | [VERIFICAR] | [] | — |
| `closeGroupId` | string (UUID) | No | Cierre múltiple: identificador de correlación que comparten las sesiones cerradas juntas (antes tipo `uniqueidentifier`). | No es referencia: no hay colección de cierres múltiples; las sesiones del grupo se buscan por este valor (PA-COB-21; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `handoverId` | uniqueidentifier | [VERIFICAR] | — | `treasuryHandovers` (M07); antes implícita por el nombre |
| `notes` | string | [VERIFICAR] | — | — |
| `open` | [VERIFICAR] | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.35.11 `cashOperations` (COL-COB-11)

Lista original: §7.11.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `operationNo` | int / string [VERIFICAR] | [VERIFICAR] | — | — |
| `cashSessionId` | uniqueidentifier | [VERIFICAR] | Nombre canónico del payload de EVT-COB-12/14/25; antes `sessionId` en este anexo. | → M07 `cashSessions` (antes "`cashSessions` (M07); antes implícita por el nombre") |
| `cashRegisterId` | uniqueidentifier | [VERIFICAR] | — | `cashRegisters` (M07); antes implícita por el nombre |
| `type` | enum | [VERIFICAR] | Valores: `collection`, `supplierPayment`, `donation`, `manualIn`, `manualOut`, `prepaidSale`, `thirdPartyCollection`, `agencySettlement`, `gatewaySettlement`,… | — |
| `channel` | [VERIFICAR] | [VERIFICAR] | — | — |
| `agencyId` | uniqueidentifier | [VERIFICAR] | / `connectorId` | `collectionAgencies` (M07); antes implícita por el nombre |
| `businessDate` | Date | [VERIFICAR] | — | — |
| `time` | [VERIFICAR] | [VERIFICAR] | — | — |
| `totalsByMethod` | array | [VERIFICAR] | [`{ method, in, out }`] | — |
| `cashPaid` | [VERIFICAR] | [VERIFICAR] | — | — |
| `change` | [VERIFICAR] | [VERIFICAR] | — | — |
| `receiptIds` | uniqueidentifier[] | [VERIFICAR] | — | `receipts` (M07) |
| `originRef` | string | [VERIFICAR] | rendición, intención, lista de cobro | — |
| `status` | enum | [VERIFICAR] | Valores: `confirmed`, `pendingFiscal`, `voided`. | — |
| `void` | object | [VERIFICAR] | `{ by, at, reason, approvalRequestId }` | — |
| `operationId` | uniqueidentifier | [VERIFICAR] | único | `cashOperations` (M07); antes implícita por el nombre |

#### 7.35.12 `receipts` (COL-COB-12)

Lista original: §7.12.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `legalEntityId` | uniqueidentifier | [VERIFICAR] | → T04; DEC-064, DEC-087: un recibo pertenece a una sola entidad jurídica | `legalEntities` (T04) |
| `number` | object | [VERIFICAR] | `{ pointOfSale, number, voucherTypeId }` con `pointOfSaleId` / `numberSequenceId` del servicio de numeración de M05 asociado a la entidad (CTR-DAT-74) | — |
| `type` | enum | [VERIFICAR] | Valores: `official`, `internal`, `agency`, `refundToHolder`. | — |
| `cashOperationId` | uniqueidentifier | [VERIFICAR] | una operación de caja puede tener varios recibos, uno por entidad jurídica, RN-COB-152 | `cashOperations` (M07); antes implícita por el nombre |
| `currentAccountId` | uniqueidentifier | [VERIFICAR] | — | `currentAccounts` (M07) |
| `holderId` | uniqueidentifier | [VERIFICAR] | — | `holders` (M01) |
| `issueDate` | Date | [VERIFICAR] | — | — |
| `paymentDate` | Date | [VERIFICAR] | — | — |
| `total` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `items` | array | [VERIFICAR] | [`{ obligationId, document, serviceId, prevOpen, applied, components: {surcharge, interest, financing, thirdParty, capital}, factor: 1\|-1 }`] (vista desnormalizada de… | — |
| `creditBalanceIds` | uniqueidentifier[] | [VERIFICAR] | — | `creditBalances` (M07); antes implícita por el nombre |
| `tenderSummary` | [VERIFICAR] | [VERIFICAR] | — | — |
| `fiscal` | object | [VERIFICAR] | `{ status: notRequired\|pending\|authorized\|failed, documentId }` | — |
| `storedFileId` | uniqueidentifier | [VERIFICAR] | — | `storedFiles` (T01) |
| `validationCode` | string | [VERIFICAR] | QR público | — |
| `status` | enum | [VERIFICAR] | Valores: `issued`, `voided`. | — |
| `voidRef` | string | [VERIFICAR] | — | — |
| `deliveries` | array | [VERIFICAR] | [`{ channel, to, at, status }`] | — |
| `reprints` | array | [VERIFICAR] | [`{ by, at, charged }`] | — |
| `voucherTypeId` | uniqueidentifier | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `voucherTypes` (M05) |

#### 7.35.13 `paymentTenders` (COL-COB-13)

Lista original: §7.13.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `cashOperationId` | uniqueidentifier | [VERIFICAR] | — | `cashOperations` (M07); antes implícita por el nombre |
| `method` | enum | [VERIFICAR] | Valores: `cash`, `thirdPartyCheque`, `ownCheque`, `transfer`, `debitCard`, `creditCard`, `qr`, `retention`, `creditBalance`, `agency`, `gateway`, `directDebit`. | — |
| `currency` | [VERIFICAR] | [VERIFICAR] | — | — |
| `amount` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `exchangeRate` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `amountInBase` | [VERIFICAR] | [VERIFICAR] | — | — |
| `status` | enum | [VERIFICAR] | Valores: `inRegister`, `handedOver`, `presented`, `deposited`, `rejected`, `voided`. | — |
| `handoverId` | uniqueidentifier | [VERIFICAR] | . Detalle por medio | `treasuryHandovers` (M07); antes implícita por el nombre |
| `thirdPartyCheckId` | uniqueidentifier | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `thirdPartyChecks` (M14); antes implícita por el nombre |
| `settlementId` | uniqueidentifier | Cond. | Medio `agency`: rendición del ente (§7.13). | → M07 `agencySettlements` (PA-COB-21; antes sin destino declarado) |
| `gatewayTransactionId` | uniqueidentifier | Cond. | Medios `gateway` y `qr` (§7.13); antes `transactionId`. | → M07 `gatewayTransactions` (PA-COB-21) |
| `directDebitBatchId` | uniqueidentifier | Cond. | Medio `directDebit` (§7.13); antes `batchId`. | → M07 `directDebitBatches` (PA-COB-21) |

#### 7.35.14 `paymentMethods` (COL-COB-14)

Lista original: §7.14.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | [VERIFICAR] | — | — |
| `nameKey` | string | [VERIFICAR] | — | — |
| `kind` | [VERIFICAR] | [VERIFICAR] | enum de `paymentTenders.method` | — |
| `ledgerAccountId` | uniqueidentifier | [VERIFICAR] | M15 | `ledgerAccounts` (M15) |
| `requiresManualData` | bool | [VERIFICAR] | — | — |
| `allowsChange` | bool | [VERIFICAR] | — | — |
| `allowedChannels` | [VERIFICAR] | [VERIFICAR] | — | — |
| `currency` | [VERIFICAR] | [VERIFICAR] | — | — |
| `isDefaultInCash` | bool | [VERIFICAR] | — | — |
| `active` | bool | [VERIFICAR] | — | — |

#### 7.35.15 `cardPlans` (COL-COB-15)

Lista original: §7.15.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `brand` | enum | Sí | Valores: `visa`, `mastercard`, `amex`, `cabal`, `naranja`, `maestro`, `diners`, `other` (catálogo común con `directDebitMandates.brand`, DEC-091). | — |
| `name` | string | [VERIFICAR] | — | — |
| `processor` | [VERIFICAR] | [VERIFICAR] | — | — |
| `merchantNumber` | int / string [VERIFICAR] | [VERIFICAR] | — | — |
| `cardType` | enum | [VERIFICAR] | Valores: `debit`, `credit`. | — |
| `presentationMode` | enum | [VERIFICAR] | Valores: `autoOnClose`, `treasury`. | — |
| `usableInCash` | [VERIFICAR] | [VERIFICAR] | — | — |
| `cashSurcharge` | object | [VERIFICAR] | `{ pct, amount }` | — |
| `installmentPlans` | array | [VERIFICAR] | [`{ installments, surchargeType: pct\|amount, value }`] | — |
| `surchargeProductId` | uniqueidentifier | [VERIFICAR] | Producto con que se factura el recargo de tarjeta. | → M02 `serviceProducts` (T05 §7.2.1, `productId`; PA-COB-21; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `active` | bool | [VERIFICAR] | — | — |
| `surchargeConceptId` | uniqueidentifier | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `billableConcepts` (M02) |

#### 7.35.16 `staticQrCodes` (COL-COB-17)

Lista original: §7.17.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `cashRegisterId` | uniqueidentifier | [VERIFICAR] | — | `cashRegisters` (M07); antes implícita por el nombre |
| `gatewayConnectorId` | uniqueidentifier | [VERIFICAR] | Nombre de T05; antes `connectorId` en este anexo. | `gatewayConnectors` (M07); antes implícita por el nombre |
| `externalQrId` | string | [VERIFICAR] | Identificador del QR en el proveedor (antes tipo `uniqueidentifier`). | — (identificador del sistema externo; no es referencia interna) |
| `payloadRef` | string | [VERIFICAR] | — | — |
| `imageStoredFileId` | uniqueidentifier | [VERIFICAR] | antes `imageFileId` | `storedFiles` (T01) |
| `currentTransaction` | object | [VERIFICAR] | `{ reference, amount, intentId, loadedAt }` | — |
| `status` | enum | [VERIFICAR] | Valores: `active`, `inactive`. | — |

#### 7.35.17 `collectors` (COL-COB-18)

Lista original: §7.18.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | [VERIFICAR] | — | — |
| `personId` | uniqueidentifier | [VERIFICAR] | — | `persons` (M01) |
| `cashRegisterId` | uniqueidentifier | [VERIFICAR] | — | `cashRegisters` (M07); antes implícita por el nombre |
| `zones` | [VERIFICAR] | [VERIFICAR] | — | — |
| `limits` | object | [VERIFICAR] | `{ maxCashOnHand, maxPerOperation }` | — |
| `allowedMethods` | [VERIFICAR] | [VERIFICAR] | — | — |
| `commission` | object | [VERIFICAR] | `{ mode: pct\|perReceipt, value, min }` | — |
| `deviceIds` | uniqueidentifier[] | [VERIFICAR] | Dispositivos de la PWA del cobrador. | → M10 `fieldDevices` (T05 §7.2.1, `deviceId`; PA-COB-21; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `receiptSeries` | [VERIFICAR] | [VERIFICAR] | — | — |
| `status` | enum | Sí | Valores: `active`, `suspended`, `inactive` (§8.19; PA-COB-21); antes sin valores. | — |

#### 7.35.18 `collectionRounds` (COL-COB-19)

Lista original: §7.18.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `collectorId` | uniqueidentifier | [VERIFICAR] | — | `collectors` (M07); antes implícita por el nombre |
| `plannedDate` | Date | [VERIFICAR] | — | — |
| `items` | array | [VERIFICAR] | [… | — |
| `status` | enum | Sí | Valores: `draft`, `assigned`, `inProgress`, `synced`, `settled` (§8.15); antes "sección 8". | — |

#### 7.35.19 `collectorSettlements` (COL-COB-20)

Lista original: §7.18.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `collectorId` | uniqueidentifier | [VERIFICAR] | — | `collectors` (M07); antes implícita por el nombre |
| `roundIds` | uniqueidentifier[] | [VERIFICAR] | — | `collectionRounds` (M07); antes implícita por el nombre |
| `collectedTotal` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `handedOverTotal` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `difference` | [VERIFICAR] | [VERIFICAR] | — | — |
| `justification` | [VERIFICAR] | [VERIFICAR] | — | — |
| `cashSessionId` | uniqueidentifier | [VERIFICAR] | Sesión de caja donde se entregan los fondos; antes `sessionId` en este anexo. | → M07 `cashSessions` (antes "`cashSessions` (M07); antes implícita por el nombre") |
| `commissionBase` | [VERIFICAR] | [VERIFICAR] | — | — |
| `status` | enum | Sí | Valores: `open`, `delivered`, `withDifference`, `closed` (§8.17; PA-COB-19); antes sin valores. | — |

#### 7.35.20 `collectionAgencies` (COL-COB-21) — referencias declaradas

| Campo | Tipo | Referencia |
|---|---|---|
| `cashRegisterId` | uniqueidentifier | `cashRegisters` (M07); antes implícita por el nombre |
| `exportLayoutId` | uniqueidentifier | → T06 `fileLayouts` (§7.20, COL-INT-10; PA-COB-21; antes "`exportLayouts` (T10); antes implícita por el nombre") |
| `importLayoutId` | uniqueidentifier | → T06 `fileLayouts` (§7.20, COL-INT-10; PA-COB-21; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `controlLayoutId` | uniqueidentifier | → T06 `fileLayouts` (§7.20, COL-INT-10; PA-COB-21; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `fileLayoutIds` | uniqueidentifier[] | Nombre con que T05 (COL-COB-21) agrupa `exportLayoutId`, `importLayoutId` y `controlLayoutId` → T06 `fileLayouts`. Prevalece el anexo: tres campos con rol (PA-COB-21). |

#### 7.35.21 `paymentReferences` (COL-COB-23)

Lista original: §7.21.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `kind` | enum | [VERIFICAR] | Valores: `obligation`, `coupon`, `notice`, `intent`, `installment`, `account`. | — |
| `targetId` | uniqueidentifier | [VERIFICAR] | — | polimórfica según `kind` (`obligations`, `paymentCoupons`, `delinquencyNotices` [M08], `paymentIntents`, `agreementInstallments` [M08], `currentAccounts`) |
| `code` | string | [VERIFICAR] | identificador autocontenido | — |
| `checkDigit` | [VERIFICAR] | [VERIFICAR] | — | — |
| `barcodes` | array | [VERIFICAR] | [`{ format, value, valid, invalidReason }`] | — |
| `electronicCode` | string | [VERIFICAR] | — | — |
| `qrPayload` | [VERIFICAR] | [VERIFICAR] | — | — |
| `validUntil` | [VERIFICAR] | [VERIFICAR] | — | — |
| `status` | enum | [VERIFICAR] | Valores: `active`, `consumed`, `cancelled`. | — |

#### 7.35.22 `externalKeyAliases` (COL-COB-24)

Lista original: §7.21.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `source` | enum | [VERIFICAR] | Valores: `legacyUser`, `lagRedLink`, `accountTimes100`, `agencyIdentifier`, `procoopIdFac`. | — |
| `agencyId` | uniqueidentifier | [VERIFICAR] | — | `collectionAgencies` (M07); antes implícita por el nombre |
| `externalKey` | string | [VERIFICAR] | — | — (identificador del sistema externo; no es referencia interna) |
| `currentAccountId` | uniqueidentifier | [VERIFICAR] | — | `currentAccounts` (M07) |
| `accountId` | uniqueidentifier | [VERIFICAR] | — | `accounts` (M01) |
| `serviceId` | uniqueidentifier | [VERIFICAR] | — | `tenantServices` (M02) |
| `validFrom` | Date | [VERIFICAR] | — | — |
| `validTo` | Date | [VERIFICAR] | — | — |

#### 7.35.23 `agencyDebtExports` (COL-COB-25)

Lista original: §7.22.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `agencyId` | uniqueidentifier | [VERIFICAR] | — | `collectionAgencies` (M07); antes implícita por el nombre |
| `layout` | object | [VERIFICAR] | `{ id, version }` | — |
| `operation` | enum | [VERIFICAR] | Valores: `debtPublication`, `debtUpdate`, `directDebit`. | — |
| `filters` | [VERIFICAR] | [VERIFICAR] | — | — |
| `period` | [VERIFICAR] | [VERIFICAR] | — | — |
| `storedFileId` | uniqueidentifier | [VERIFICAR] | — | `storedFiles` (T01) |
| `controlStoredFileId` | uniqueidentifier | [VERIFICAR] | antes `controlFileId` | `storedFiles` (T01) |
| `fileName` | string | [VERIFICAR] | — | — |
| `recordCount` | int | [VERIFICAR] | — | — |
| `totals` | object | [VERIFICAR] | `{ due1, due2, due3 }` | — |
| `api` | object | [VERIFICAR] | `{ transactionNo, confirmAutomatically, result: {correct, errors, processed, totalDue1, totalDue2, description}, state }` | — |
| `status` | enum | Sí | Valores: `generated`, `sent`, `acknowledged`, `failed`, `cancelled` (§8.6); antes "sección 8". | — |
| `sentVia` | [VERIFICAR] | [VERIFICAR] | — | — |
| `operationId` | uniqueidentifier | [VERIFICAR] | — | `cashOperations` (M07); antes implícita por el nombre |
| `sequence` | [VERIFICAR] | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.35.24 `agencyPublishedDebts` (COL-COB-26)

Lista original: §7.22.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `agencyId` | uniqueidentifier | [VERIFICAR] | — | `collectionAgencies` (M07); antes implícita por el nombre |
| `exportId` | uniqueidentifier | [VERIFICAR] | — | `agencyDebtExports` (M07); antes implícita por el nombre |
| `targetRef` | string | [VERIFICAR] | obligación o cupón | — |
| `period` | [VERIFICAR] | [VERIFICAR] | — | — |
| `concept` | [VERIFICAR] | [VERIFICAR] | — | — |
| `identifier` | [VERIFICAR] | [VERIFICAR] | — | — |
| `index` | [VERIFICAR] | [VERIFICAR] | — | — |
| `dueAmounts` | [VERIFICAR] | [VERIFICAR] | — | — |
| `status` | enum | [VERIFICAR] | Valores: `published`, `updated`, `withdrawn`, `paid`. | — |

#### 7.35.25 `agencySettlements` (COL-COB-27)

Lista original: §7.23.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `agencyId` | uniqueidentifier | [VERIFICAR] | — | `collectionAgencies` (M07); antes implícita por el nombre |
| `source` | enum | [VERIFICAR] | Valores: `upload`, `sftp`, `api`. | — |
| `storedFileId` | uniqueidentifier | [VERIFICAR] | — | `storedFiles` (T01) |
| `fileHash` | [VERIFICAR] | [VERIFICAR] | — | — |
| `presentationDate` | Date | [VERIFICAR] | — | — |
| `header` | object | [VERIFICAR] | `{ agreement, date }` | — |
| `footer` | object | [VERIFICAR] | `{ count, total }` | — |
| `read` | object | [VERIFICAR] | `{ count, total }` | — |
| `warnings` | [VERIFICAR] | [VERIFICAR] | — | — |
| `status` | enum | Sí | Valores: `imported`, `rejected`, `validated`, `partiallyConfirmed`, `confirmed` (§8.5); antes "sección 8". | — |
| `confirmedBy` | uniqueidentifier | [VERIFICAR] | — | `memberships` (T02) |
| `confirmedAt` | Date | [VERIFICAR] | — | — |
| `cashOperationId` | uniqueidentifier | [VERIFICAR] | — | `cashOperations` (M07); antes implícita por el nombre |
| `feeTotal` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `expectedCredit` | object | [VERIFICAR] | `{ net, date, treasuryAccountId }` | — |

#### 7.35.26 `agencySettlementLines` (COL-COB-28)

Lista original: §7.23.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `settlementId` | uniqueidentifier | [VERIFICAR] | — | `agencySettlements` (M07); antes implícita por el nombre |
| `lineNo` | int / string [VERIFICAR] | [VERIFICAR] | — | — |
| `rawMasked` | [VERIFICAR] | [VERIFICAR] | — | — |
| `parsed` | object | [VERIFICAR] | `{ amount, accountKey, reference, dueDate, paymentDate, creditDate, conceptId, barcode, rejectCode }` | — |
| `resolution` | object | [VERIFICAR] | `{ method: reference\|alias\|lagResolver\|barcode\|intent, obligationIds, couponId, intentId, candidates }` | — |
| `expectedAmount` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `result` | enum | [VERIFICAR] | Valores: `ok`, `warning`, `error`. | — |
| `messages` | array | [VERIFICAR] | [`{ code, text }`] | — |
| `selected` | bool | [VERIFICAR] | — | — |
| `action` | enum | [VERIFICAR] | Valores: `applied`, `creditCreated`, `unidentified`, `ignored`, `rejectedDebit`, `pending`. | — |
| `receiptId` | uniqueidentifier | [VERIFICAR] | — | `receipts` (M07) |
| `unidentifiedId` | uniqueidentifier | [VERIFICAR] | — | `unidentifiedReceipts` (M07); antes implícita por el nombre |

#### 7.35.27 `agencyNoveltyFiles` (COL-COB-29)

Lista original: §7.24.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `agencyId` | uniqueidentifier | [VERIFICAR] | — | `collectionAgencies` (M07); antes implícita por el nombre |
| `kind` | enum | [VERIFICAR] | Valores: `novelty`, `delinquency`. | — |
| `storedFileId` | uniqueidentifier | [VERIFICAR] | — | `storedFiles` (T01) |
| `fileHash` | [VERIFICAR] | [VERIFICAR] | — | — |
| `lines` | array | [VERIFICAR] | [`{ action: add\|remove\|update, accountKey, mediumMasked, period, amount, dueDate, presentationDate, result, message }`] | — |
| `status` | enum | [VERIFICAR] | Valores: `imported`, `applied`, `rejected`. | — |

#### 7.35.28 `directDebitMandates` (COL-COB-30)

Lista original: §7.25.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `currentAccountId` | uniqueidentifier | Sí | Cuenta corriente que se debita. | `currentAccounts` (M07) |
| `accountId` | uniqueidentifier | Sí | Cuenta de servicio de la adhesión. | `accounts` (M01) |
| `serviceIds` | uniqueidentifier[] | No | Vacío = todos los servicios de la cuenta. | `tenantServices` (M02) |
| `channel` | enum | Sí | Valores: `agency` (ente por archivo: banco para CBU o procesadora de tarjetas), `gateway` (pasarela por API). Declarado en T05; define cuál de `agencyId` o `gatewayConnectorId` se completa. Una sola adhesión `active` por cuenta corriente y canal (índice parcial de T05). | — |
| `agencyId` | uniqueidentifier | Si `channel` = `agency` | Ente que recibe la presentación; excluyente con `gatewayConnectorId`. | `collectionAgencies` (M07); antes implícita por el nombre |
| `gatewayConnectorId` | uniqueidentifier | Si `channel` = `gateway` | Conector con las capacidades `mandate` y `debit`; excluyente con `agencyId`. Declarado en T05; antes `connectorId` en §7.25. | `gatewayConnectors` (M07); antes implícita por el nombre |
| `mediumType` | enum | Sí | Valores: `cbu`, `card`. | — |
| `cbuEncrypted` | BinData (cifrado de campo) | Si `mediumType` = `cbu` | CBU de 22 dígitos con dígitos verificadores válidos (RF-COB-119), cifrado con la clave de datos financieros del tenant (RNF-NFR-055, DEC-074); se descifra solo para generar la presentación. Nunca se expone por API. | — |
| `cbuMasked` | string | Si `mediumType` = `cbu` | Últimos 4 dígitos en claro, resto enmascarado (`******************1234`); es lo único que muestran pantallas, comprobantes y API. | — |
| `cardToken` | BinData (cifrado de campo determinístico) | Si `mediumType` = `card` | Identificador opaco emitido por el proveedor (hasta 255 caracteres en claro): token o identificador de adhesión de la pasarela, o número de adherente de la procesadora. **Nunca** es el PAN ni se deriva de él; el cifrado determinístico permite buscar por igualdad al procesar novedades y respuestas. Nunca se expone por API ni se registra en logs (DEC-091). | — |
| `cardTokenType` | enum | Si `mediumType` = `card` | Valores: `gatewayToken` (adhesión tokenizada en pasarela), `processorAdherentId` (número de adherente de procesadora por archivo, FI-INT-57). DEC-091. | — |
| `brand` | enum | Si `mediumType` = `card` | Valores: `visa`, `mastercard`, `amex`, `cabal`, `naranja`, `maestro`, `diners`, `other`; la informa el proveedor. Mismo catálogo que `cardPlans.brand`. | — |
| `last4` | string | Si `mediumType` = `card` | Últimos 4 dígitos (`^\d{4}$`) informados por el proveedor; no se guardan vencimiento ni código de seguridad (RN-NFR-009). | — |
| `holderName` | string | Sí | Titular del medio (puede no ser el titular de la cuenta). | — |
| `holderCuit` | string | Si `mediumType` = `cbu` | CUIT/CUIL del titular del CBU, 11 dígitos sin guiones (`^\d{11}$`) con dígito verificador válido; opcional para tarjeta. | — |
| `periodFrom` | period | Sí | Primer período (`YYYY-MM`) que entra en presentaciones. | — |
| `signedAt` | Date | No | Fecha de firma o alta confirmada; se completa al pasar a `active` (§8.7). | — |
| `status` | enum | Sí | Valores: `pendingSignature`, `active`, `suspended`, `cancelled`, `error` (§8.7); estado inicial `pendingSignature`. | — |
| `externalId` | string | Si `channel` = `gateway` | Identificador de la adhesión en la pasarela (por ejemplo, el `id` de la adhesión de Pagos360; antes tipo `uniqueidentifier`). Único por `{tenantId, gatewayConnectorId, externalId}`. | — (identificador del sistema externo; no es referencia interna) |
| `exclusions` | array | No | [`{ billingTypeId \| serviceId }`] | — |
| `consecutiveRejections` | int | Sí | Rechazos consecutivos (≥ 0, default 0); se reinicia con un débito aceptado; lo usa la transición `active` → `suspended` (§8.7). | — |
| `lastRejectCode` | string | No | Último código de rechazo del ente o la pasarela (RN-COB-105). | — |
| `cancelledAt` | Date | Si `status` = `cancelled` | — | — |
| `source` | enum | Sí | Valores: `operator`, `portal`, `novelty`, `api`, `migration`. | — |

#### 7.35.29 `directDebitBatches` (COL-COB-31)

Lista original: §7.25.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `agencyId` | uniqueidentifier | [VERIFICAR] | o `connectorId` | `collectionAgencies` (M07); antes implícita por el nombre |
| `exportId` | uniqueidentifier | [VERIFICAR] | — | `agencyDebtExports` (M07); antes implícita por el nombre |
| `debitDate` | Date | [VERIFICAR] | — | — |
| `items` | array | [VERIFICAR] | [`{ obligationId, mandateId, amount, attempt, status: presented\|accepted\|rejected\|retryScheduled\|excluded, rejectCode, receiptId }`] | — |
| `totals` | [VERIFICAR] | [VERIFICAR] | — | — |
| `status` | enum | Sí | Valores: `draft`, `presented`, `settled`, `closed` (§8.8; ítems en `items.status`); antes "sección 8". | — |
| `presentationDate` | Date | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |
| `sequence` | [VERIFICAR] | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.35.30 `gatewayConnectors` (COL-COB-32)

Lista original: §7.26.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `provider` | enum | [VERIFICAR] | Valores: `siro`, `pagos360`, `mercadopago`, `macro`, `naranjax`, `payfun`, `pagostic`, `sipago`, `helipagos`, `provincianet`, `prontopago`, `offline`. | — |
| `name` | string | [VERIFICAR] | — | — |
| `environment` | enum | [VERIFICAR] | Valores: `sandbox`, `production`. | — |
| `baseUrls` | [VERIFICAR] | [VERIFICAR] | — | — |
| `credentialRef` | string | Sí | Referencia al secreto en la bóveda de T06 (DEC-074); la credencial nunca se guarda en esta colección. | `integrationSecrets` (T06) |
| `capabilities` | array | [VERIFICAR] | [enum `createIntent`, `query`, `listCollections`, `cancel`, `refund`, `mandate`, `debit`, `chargebacks`, `dynamicQr`, `staticQr`, `invoiceQrBatch`, `barcode`,… | — |
| `channels` | array | [VERIFICAR] | [`portal`, `app`, `cashRegister`, `cashQr`, `terminal`, `link`, `invoice`] | — |
| `allowedMethods` | [VERIFICAR] | [VERIFICAR] | — | — |
| `excludedMethods` | [VERIFICAR] | [VERIFICAR] | — | — |
| `cardDataMode` | enum | Sí | Valores: `hostedFields` (campos o formulario alojados por el proveedor dentro de la página), `redirect` (checkout del proveedor), `terminal` (terminal certificada del adquirente), `none` (el conector no cobra con tarjeta). Cómo se capturan los datos de tarjeta; ningún modo permite que el PAN pase por CoopApps (alcance SAQ A, DEC-091). | — |
| `excludedCardBrands` | string[] | No | Valores de `directDebitMandates.brand`; marcas que no se ofrecen con este conector. | — |
| `excludedInstallments` | [VERIFICAR] | [VERIFICAR] | — | — |
| `minAmount` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `reuseWindowMinutes` | int | [VERIFICAR] | — | — |
| `reconciliationWindowDays` | int | [VERIFICAR] | — | — |
| `qrMerchantData` | object | [VERIFICAR] | `{ merchantName, city, postalCode, mcc, cuit, cbu, province }` | — |
| `settlementAgencyId` | uniqueidentifier | [VERIFICAR] | caja virtual y cuenta | `collectionAgencies` (M07); antes implícita por el nombre |
| `feeSchedule` | [VERIFICAR] | [VERIFICAR] | — | — |
| `directDebitCutoffDay` | [VERIFICAR] | [VERIFICAR] | — | — |
| `webhookTokenRef` | string | Si el proveedor envía webhooks | Referencia en la bóveda de T06 al token o secreto de firma de webhooks del conector (FI-INT-43/44); rotable. | `integrationSecrets` (T06) |
| `health` | object | [VERIFICAR] | `{ status: ok\|degraded\|credentialExpired\|down, lastOkAt, lastError }` | — |
| `status` | enum | Sí | Valores: `active`, `suspended`, `inactive` (§8.19; PA-COB-21); antes sin valores. | — |
| `connectionId` | uniqueidentifier | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | → T06 `integrationConnections` (T05 §7.2.1) (PA-COB-21; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |

#### 7.35.31 `paymentChannels` (COL-COB-33)

Lista original: §7.26.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | [VERIFICAR] | — | — |
| `nameKey` | string | [VERIFICAR] | — | — |
| `iconStoredFileId` | uniqueidentifier | [VERIFICAR] | antes `iconFileId` | `storedFiles` (T01) |
| `gatewayConnectorId` | uniqueidentifier | [VERIFICAR] | Nombre de T05; antes `connectorId` en este anexo. | `gatewayConnectors` (M07); antes implícita por el nombre |
| `methods` | [VERIFICAR] | [VERIFICAR] | — | — |
| `visibleIn` | array | [VERIFICAR] | [`portal`, `app`, `landing`] | — |
| `order` | int | [VERIFICAR] | — | — |
| `active` | bool | [VERIFICAR] | — | — |

#### 7.35.32 `paymentIntents` (COL-COB-34) — referencias declaradas

| Campo | Tipo | Referencia |
|---|---|---|
| `gatewayConnectorId` | uniqueidentifier | → M07 `gatewayConnectors`. Nombre de T05 (COL-COB-34); antes `connectorId` en §7.27 (el índice `{tenantId, connectorId, externalId}` se lee `{tenantId, gatewayConnectorId, externalId}`) (antes "`gatewayConnectors` (M07); antes implícita por el nombre") |
| `mandateId` | uniqueidentifier | `directDebitMandates` (M07); antes implícita por el nombre |
| `reusedFromId` | uniqueidentifier | → M07 `paymentIntents` (autorreferencia: intención reutilizada dentro de `reuseWindowMinutes`; PA-COB-21; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `transactionIds` | uniqueidentifier | `gatewayTransactions` (M07); antes implícita por el nombre |

#### 7.35.33 `gatewayTransactions` (COL-COB-35)

Lista original: §7.28.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `connectorId` | uniqueidentifier | [VERIFICAR] | — | `gatewayConnectors` (M07); antes implícita por el nombre |
| `intentId` | uniqueidentifier | [VERIFICAR] | — | `paymentIntents` (M07); antes implícita por el nombre |
| `externalPaymentId` | string | [VERIFICAR] | Identificador del pago en el proveedor (antes tipo `uniqueidentifier`). | — (identificador del sistema externo; no es referencia interna) |
| `type` | enum | [VERIFICAR] | Valores: `payment`, `rejection`, `chargeback`, `refund`, `reversal`. | — |
| `status` | enum | Sí | Valores: `received`, `confirmed`, `rejected`, `applied`, `unmatched`, `reconciled` (§8.17; PA-COB-19); antes sin valores. | — |
| `channel` | [VERIFICAR] | [VERIFICAR] | — | — |
| `grossAmount` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `grossFee` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `netFee` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `feeVat` | [VERIFICAR] | [VERIFICAR] | — | — |
| `netAmount` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `feeEstimated` | bool | [VERIFICAR] | — | — |
| `paidAt` | Date | [VERIFICAR] | — | — |
| `availableAt` | Date | [VERIFICAR] | — | — |
| `payerMasked` | object | No | `{ name, docNumberMasked, brand, last4, cbuMasked }`: datos del pagador tal como los informa el proveedor, siempre enmascarados; nunca PAN ni CBU completo (DEC-091). | — |
| `evidenceStoredFileId` | uniqueidentifier | [VERIFICAR] | antes `evidenceFileId` | `storedFiles` (T01) |
| `receivedVia` | enum | [VERIFICAR] | Valores: `webhook`, `reconciliation`, `polling`, `file`. | — |
| `cashOperationId` | uniqueidentifier | [VERIFICAR] | cuando se imputa; equivalente `ID_PLA` | `cashOperations` (M07); antes implícita por el nombre |

#### 7.35.34 `gatewayWebhookEvents` (COL-COB-36)

Lista original: §7.28.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `connectorId` | uniqueidentifier | [VERIFICAR] | — | `gatewayConnectors` (M07); antes implícita por el nombre |
| `receivedAt` | Date | [VERIFICAR] | — | — |
| `headersFiltered` | [VERIFICAR] | [VERIFICAR] | — | — |
| `signatureValid` | [VERIFICAR] | [VERIFICAR] | — | — |
| `payloadRef` | string | [VERIFICAR] | almacenamiento privado | — |
| `dedupeKey` | string | [VERIFICAR] | — | — |
| `status` | enum | [VERIFICAR] | Valores: `received`, `processing`, `processed`, `ignored`, `failed`. | — |
| `attempts` | [VERIFICAR] | [VERIFICAR] | — | — |
| `lastError` | [VERIFICAR] | [VERIFICAR] | — | — |
| `relatedIntentId` | uniqueidentifier | [VERIFICAR] | — | `paymentIntents` (M07); antes implícita por el nombre |

#### 7.35.35 `paymentCoupons` (COL-COB-37)

Lista original: §7.29.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `couponNo` | int / string [VERIFICAR] | [VERIFICAR] | — | — |
| `legalEntityId` | uniqueidentifier | Sí | → T04, Sí; todas las obligaciones del cupón son de esa entidad, RN-COB-156 | `legalEntities` (T04) |
| `currentAccountId` | uniqueidentifier | [VERIFICAR] | — | `currentAccounts` (M07) |
| `statementId` | uniqueidentifier | [VERIFICAR] | — | `accountStatements` (M07); antes implícita por el nombre |
| `obligationIds` | uniqueidentifier[] | [VERIFICAR] | — | `obligations` (M07) |
| `totalsByDue` | array | [VERIFICAR] | [`{ seq, dueDate, amount }`] | — |
| `paymentReferenceId` | uniqueidentifier | [VERIFICAR] | — | `paymentReferences` (M07); antes implícita por el nombre |
| `status` | enum | Sí | Valores: `active`, `paid`, `partiallyPaid`, `expired`, `cancelled` (§8.13); antes "sección 8". | — |
| `validUntil` | [VERIFICAR] | [VERIFICAR] | — | — |
| `legacy` | object | [VERIFICAR] | `{ talonNumber, installment }` | — (identificador del sistema externo; no es referencia interna) |
| `number` | string | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.35.36 `refundCases` (COL-COB-38)

Lista original: §7.30.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `caseNo` | int / string [VERIFICAR] | [VERIFICAR] | — | — |
| `currentAccountId` | uniqueidentifier | [VERIFICAR] | — | `currentAccounts` (M07) |
| `holderId` | uniqueidentifier | [VERIFICAR] | — | `holders` (M01) |
| `sourceRef` | string | [VERIFICAR] | recibo, transacción, saldo a favor, no identificado | — |
| `cause` | [VERIFICAR] | [VERIFICAR] | — | — |
| `amount` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `correctiveDocumentId` | uniqueidentifier | [VERIFICAR] | NC M05 | `documents` (T11) |
| `destination` | object | [VERIFICAR] | `{ type: gateway\|bankTransfer\|cash, cbuMasked, holderName, holderCuit }` | — |
| `requestedBy` | uniqueidentifier | [VERIFICAR] | — | `memberships` (T02) |
| `approvedBy` | uniqueidentifier | [VERIFICAR] | — | `memberships` (T02) |
| `workflowInstanceId` | uniqueidentifier | [VERIFICAR] | T11 | `workflowInstances` (T11) |
| `status` | [VERIFICAR] | [VERIFICAR] | sección 8 | — |
| `execution` | object | [VERIFICAR] | `{ via: connector\|treasury\|cash, externalRefundId, executedAt, idempotencyKey }` | — |
| `reconciliationId` | uniqueidentifier | [VERIFICAR] | — | `collectionReconciliations` (M07); antes implícita por el nombre |
| `paymentOrderId` | uniqueidentifier | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `paymentOrders` (M12); antes implícita por el nombre |
| `number` | string | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.35.37 `chargebacks` (COL-COB-39)

Lista original: §7.30.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `connectorId` | uniqueidentifier | [VERIFICAR] | — | `gatewayConnectors` (M07); antes implícita por el nombre |
| `gatewayTransactionId` | uniqueidentifier | [VERIFICAR] | Nombre de T05; antes `transactionId` en este anexo. | `gatewayTransactions` (M07); antes implícita por el nombre |
| `intentId` | uniqueidentifier | [VERIFICAR] | — | `paymentIntents` (M07); antes implícita por el nombre |
| `receiptId` | uniqueidentifier | [VERIFICAR] | — | `receipts` (M07) |
| `amount` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `reason` | string | [VERIFICAR] | — | — |
| `notifiedAt` | Date | [VERIFICAR] | — | — |
| `status` | enum | Sí | Valores: `received`, `applied`, `disputed`, `won`, `lost` (§8.12); antes "sección 8". | — |
| `reversalAllocationIds` | uniqueidentifier[] | [VERIFICAR] | — | `allocations` (M07); antes implícita por el nombre |
| `chargeObligationIds` | uniqueidentifier[] | [VERIFICAR] | interés y comisión de reversión | `obligations` (M07) |
| `blockedAccountIds` | uniqueidentifier[] | [VERIFICAR] | — | `accounts` (M01) |
| `evidenceStoredFileIds` | uniqueidentifier[] | [VERIFICAR] | antes `evidenceFileIds` | `storedFiles` (T01) |
| `externalId` | uniqueidentifier | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — (identificador del sistema externo; no es referencia interna) |

#### 7.35.38 `collectionReconciliations` (COL-COB-40)

Lista original: §7.31.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `date` | Date | [VERIFICAR] | — | — |
| `scope` | object | [VERIFICAR] | `{ agencyId \| connectorId \| cashRegisterId }` | — |
| `gross` | [VERIFICAR] | [VERIFICAR] | — | — |
| `fees` | [VERIFICAR] | [VERIFICAR] | — | — |
| `feeVat` | [VERIFICAR] | [VERIFICAR] | — | — |
| `retentions` | [VERIFICAR] | [VERIFICAR] | — | — |
| `expectedNet` | [VERIFICAR] | [VERIFICAR] | — | — |
| `bankCredited` | [VERIFICAR] | [VERIFICAR] | — | — |
| `difference` | [VERIFICAR] | [VERIFICAR] | — | — |
| `items` | array | [VERIFICAR] | [`{ ref, type, expected, actual, status: matched\|unmatched\|difference, comment, exceptionId }`] | — |
| `status` | enum | Sí | Valores: `open`, `inReview`, `closed` (§8.14); antes "sección 8". | — |
| `closedBy` | uniqueidentifier | [VERIFICAR] | — | `memberships` (T02) |
| `minutesStoredFileId` | uniqueidentifier | [VERIFICAR] | antes `minutesFileId` | `storedFiles` (T01) |
| `agencyId` | uniqueidentifier | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `collectionAgencies` (M07); antes implícita por el nombre |
| `treasuryMovementIds` | uniqueidentifier[] | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `treasuryMovements` (M14); antes implícita por el nombre |

#### 7.35.39 `treasuryHandovers` (COL-COB-41)

Lista original: §7.31.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `sessionIds` | uniqueidentifier[] | [VERIFICAR] | o `collectorSettlementId` | `cashSessions` (M07); antes implícita por el nombre |
| `legalEntityId` | uniqueidentifier | [VERIFICAR] | una entrega por entidad jurídica, RF-COB-194 | `legalEntities` (T04) |
| `deliveredBy` | uniqueidentifier | [VERIFICAR] | — | `memberships` (T02) |
| `receivedBy` | uniqueidentifier | [VERIFICAR] | — | `memberships` (T02) |
| `contents` | object | [VERIFICAR] | `{ cashByCurrency, cheques [tenderId], cardVouchers [tenderId], retentions [tenderId], transfers [tenderId] }` | — |
| `reportStoredFileId` | uniqueidentifier | [VERIFICAR] | antes `reportFileId` | `storedFiles` (T01) |
| `status` | enum | Sí | Valores: `prepared`, `delivered`, `received`, `rejected` (§8.14); antes "sección 8". | — |
| `deliveredAt` | Date | [VERIFICAR] | — | — |
| `receivedAt` | Date | [VERIFICAR] | — | — |
| `observations` | string | [VERIFICAR] | . M07 registra la **entrega** | — |
| `cashSessionIds` | uniqueidentifier[] | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `cashSessions` (M07); antes implícita por el nombre |
| `number` | string | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.35.40 `thirdPartyBillers` (COL-COB-42)

Lista original: §7.32.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | [VERIFICAR] | — | — |
| `name` | string | [VERIFICAR] | — | — |
| `linkedAccountId` | uniqueidentifier | [VERIFICAR] | — | `accounts` (M01) |
| `barcodeType` | [VERIFICAR] | [VERIFICAR] | — | — |
| `thirdPartyNumber` | int / string [VERIFICAR] | [VERIFICAR] | — | — |
| `voucherTypeId` | uniqueidentifier | [VERIFICAR] | — | `voucherTypes` (M05) |
| `productId` | uniqueidentifier | [VERIFICAR] | — | → M02 `serviceProducts` (T05 §7.2.1) (PA-COB-21; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `fee` | object | [VERIFICAR] | `{ mode, value, min }` | — |
| `billingTypeId` | uniqueidentifier | [VERIFICAR] | Clasificación comercial del comprobante del tercero (`COD_TPFC`). | → M05 `voucherTypes` (igual que `voucherTypeOverrideId` de M05, ex `COD_TPFC`; PA-COB-21; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `allowsPartial` | bool | [VERIFICAR] | — | — |
| `allowsOverdue` | bool | [VERIFICAR] | — | — |
| `allowsMultiple` | bool | [VERIFICAR] | — | — |
| `allowsRefund` | bool | [VERIFICAR] | — | — |
| `minAmount` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `isDonationEntity` | bool | [VERIFICAR] | — | — |
| `summaryServiceConnectorId` | uniqueidentifier | [VERIFICAR] | — | `gatewayConnectors` (M07); antes implícita por el nombre |
| `active` | bool | [VERIFICAR] | — | — |

#### 7.35.41 `thirdPartyCollections` (COL-COB-43)

Lista original: §7.32.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `thirdPartyBillerId` | uniqueidentifier | [VERIFICAR] | Nombre de T05; antes `billerId` en este anexo. | `thirdPartyBillers` (M07); antes implícita por el nombre |
| `obligationId` | uniqueidentifier | [VERIFICAR] | propia | `obligations` (M07) |
| `barcode` | string | [VERIFICAR] | — | — |
| `documentRef` | string | [VERIFICAR] | — | — |
| `dueDate` | Date | [VERIFICAR] | — | — |
| `amount` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `fee` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `receiptId` | uniqueidentifier | [VERIFICAR] | — | `receipts` (M07) |
| `summaryNumber` | int / string [VERIFICAR] | [VERIFICAR] | — | — |
| `renderedToThirdPartyAt` | Date | [VERIFICAR] | — | — |
| `status` | enum | Sí | Valores: `collected`, `inSummary`, `rendered`, `voided` (§8.17; PA-COB-19); antes sin valores. | — |
| `cashOperationId` | uniqueidentifier | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `cashOperations` (M07); antes implícita por el nombre |

#### 7.35.42 `externalObligationImports` (COL-COB-44)

Lista original: §7.33.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `format` | enum | [VERIFICAR] | Valores: `general`, `publicAdministration`, `procoopDocument`. | — |
| `storedFileId` | uniqueidentifier | [VERIFICAR] | — | `storedFiles` (T01) |
| `lines` | array | [VERIFICAR] | [`{ lineNo, result, message, obligationId }`] | — |
| `status` | enum | Sí | Valores: `uploaded`, `rejected`, `validated`, `applied`, `partiallyApplied`, `cancelled` (§8.17; PA-COB-19); antes sin valores. | — |
| `source` | [VERIFICAR] | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |
| `fileHash` | string | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.35.43 `collectionReportSchemes` (COL-COB-45)

Lista original: §7.33.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `name` | string | [VERIFICAR] | — | — |
| `productIds` | uniqueidentifier[] | [VERIFICAR] | Productos comerciales del esquema. | → M02 `serviceProducts` (T05 §7.2.1, `productId`; PA-COB-21; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `serviceIds` | uniqueidentifier[] | [VERIFICAR] | — | `tenantServices` (M02) |
| `taxIds` | uniqueidentifier[] | [VERIFICAR] | — | → M06 `taxDefinitions` (T05 §7.2.1) (PA-COB-21; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `reportCode` | string | [VERIFICAR] | — | — |
| `code` | string | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.35.44 `collectionExceptions` (COL-COB-46)

Lista original: §7.33.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `type` | enum | [VERIFICAR] | Valores: `uncertainPayment`, `amountMismatch`, `settlementLineError`, `duplicatePayment`, `webhookFailed`, `integrityDifference`, `offlineSyncConflict`,… | — |
| `sourceRef` | string | [VERIFICAR] | — | — |
| `severity` | [VERIFICAR] | [VERIFICAR] | — | — |
| `assignedTo` | [VERIFICAR] | [VERIFICAR] | — | — |
| `status` | enum | Sí | Valores: `open`, `inProgress`, `resolved`, `dismissed` (§8.15); antes "sección 8". | — |
| `resolution` | [VERIFICAR] | [VERIFICAR] | — | — |
| `dueAt` | Date | [VERIFICAR] | . Bandeja de AGR-016 | — |

### 7.36 `collectionAccountingGroups` — grupos contables de cobranza (PA-COB-20)

Colección declarada el 05-11-2026 (PA-COB-20), nombrada por M15 (RN-CON-028, §7.39) con dueño M07. Agrupa cuentas para imputar contablemente la cobranza; `accounts.accountingGroupId` de M01 apunta aquí. Ola O5, la de RF-COB-173 (eventos económicos con los datos del asiento), que publica el grupo de la cuenta cobrada. Origen ProCoop: `GRU_CON`.

M07 no guarda cuentas contables (M15 §7.39: los módulos dueños solo guardan claves de dimensión). Las cuentas del grupo viven en `entityAccountAssignments` de M15 con `entityType = collectionAccountingGroup`, `entityId` = id del grupo y `usage` = `collectionBilling`, `collectionRefinancing`, `cash`, `checks`, `cards`, `capitalSubscribed`, `capitalPaidIn`, `discountsSurcharges`, `interest` o `vat` (columnas `CTA_COBF`, `CTA_COBR`, `CTA_CAJ`, `CTA_VAL`, `CTA_TAR`, `CTA_CAPS`, `CTA_CAPI`, `CTA_DESR`, `CTA_INT`, `CTA_IVA`). El grupo con `code = 0` no tiene asignaciones: usa los roles contables de M15 (RN-CON-028).

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | Sí | Código del grupo (`GRU_CON`); `0` es el grupo por defecto, que resuelve por roles. | — |
| `name` | string | Sí | Nombre visible. | — |
| `status` | enum | Sí | `active`, `inactive` (§8.18). | — |

Índice `{tenantId, code}` único. Las cuentas se resuelven en M15 por `entityAccountAssignments` (`entityType = collectionAccountingGroup`).

### 7.37 Residuales del 5-11-2026: referencias, nombres canónicos y valores de estado (PA-COB-21)

Ronda de residuales detectados al regenerar los entregables (categorías 1, 2 y 4 de `_trabajo/residuales-instrucciones.md`). Las filas de §7.35 quedaron corregidas en su lugar con "antes"; esta tabla las resume. Referencia: colección destino precedida de → (anexo dueño); "no es referencia" indica un dato o un identificador externo.

| Colección | Campo | Tipo | Referencia | Antes |
|---|---|---|---|---|
| `cashSessions` | `closeGroupId` | string (UUID) | No es referencia (correlación del cierre múltiple) | `uniqueidentifier` sin destino |
| `cashOperations` | `cashSessionId` | uniqueidentifier | → M07 `cashSessions` | `sessionId` |
| `paymentTenders` | `settlementId` | uniqueidentifier | → M07 `agencySettlements` | sin destino |
| `paymentTenders` | `gatewayTransactionId` | uniqueidentifier | → M07 `gatewayTransactions` | `transactionId` |
| `paymentTenders` | `directDebitBatchId` | uniqueidentifier | → M07 `directDebitBatches` | `batchId` |
| `cardPlans` | `surchargeProductId` | uniqueidentifier | → M02 `serviceProducts` | sin destino |
| `staticQrCodes` | `externalQrId` | string | No es referencia (identificador del proveedor) | tipo `uniqueidentifier` |
| `collectors` | `deviceIds` | uniqueidentifier[] | → M10 `fieldDevices` | sin destino |
| `collectorSettlements` | `cashSessionId` | uniqueidentifier | → M07 `cashSessions` | `sessionId` |
| `collectionAgencies` | `exportLayoutId` | uniqueidentifier | → T06 `fileLayouts` | `exportLayouts` (T10), inferido por el nombre |
| `collectionAgencies` | `importLayoutId`, `controlLayoutId` | uniqueidentifier | → T06 `fileLayouts` | sin destino |
| `paymentIntents` | `reusedFromId` | uniqueidentifier | → M07 `paymentIntents` (autorreferencia) | sin destino |
| `paymentIntents` | `gatewayConnectorId` | uniqueidentifier | → M07 `gatewayConnectors` | `connectorId` |
| `gatewayTransactions` | `externalPaymentId` | string | No es referencia (identificador del proveedor) | tipo `uniqueidentifier` |
| `thirdPartyBillers` | `billingTypeId` | uniqueidentifier | → M05 `voucherTypes` | sin destino |
| `collectionReportSchemes` | `productIds` | uniqueidentifier[] | → M02 `serviceProducts` | sin destino |

Campos que T05 cita con otro nombre: `collectionAgencies.fileLayoutIds[]` (T05) = los tres campos con rol del anexo (prevalece el anexo); `paymentIntents.gatewayConnectorId` (T05) se adopta; `cashOperations.sessionId` (T05) pasa a `cashSessionId` como en los payloads de EVT-COB-12, 14 y 25. Valores de `status` agregados en §7.35: `collectors` y `gatewayConnectors` (nuevos, §8.19) y los que solo decían "sección 8" (`collectionRounds`, `agencyDebtExports`, `agencySettlements`, `directDebitBatches`, `paymentCoupons`, `chargebacks`, `collectionReconciliations`, `treasuryHandovers`, `collectionExceptions`), tomados de su máquina del §8.

## 8. Estados y transiciones

### 8.1 `obligations.balanceStatus` (derivado)

Estado inicial: `pending`.

| Origen → Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|
| (nuevo) → `pending` | Sistema (consumo de evento M05/M08) | Documento emitido | `ledgerEntries` débito; publicación a entes si corresponde. Con DEC-107 el débito y la publicación ocurren solo con `fiscalGate` `authorized` o `notRequired`; con `pendingAuthorization` la obligación existe sin movimiento ni publicación hasta `fis.invoice.authorized` (RN-COB-158). *Antes: débito y publicación al registrarse.* | Anulación del documento → `voided` |

Compuerta fiscal (`obligations.fiscalGate.status`, DEC-107; RN-COB-158): `pendingAuthorization` → `authorized` (`fis.invoice.authorized`, EVT-FIS-01: registra el débito del auxiliar y habilita cobro y publicación); `pendingAuthorization` → `released` (`fac.invoice.returnedToDraft`, EVT-FAC-22); `released` → `pendingAuthorization` (reemisión: `fac.invoice.issued` con `issueAttempt` mayor); `pendingAuthorization`/`released` → `voided` (`fac.invoice.annulled` de un comprobante no autorizado, sin movimiento). `authorized` no vuelve atrás: un comprobante autorizado se corrige con NC de M05. Los orígenes sin autorización fiscal nacen `notRequired`.
| `pending` → `partial` | Motor de imputación | Imputación activa < importe | `openAmount` recalculado | Reverso de imputación → `pending` |
| `pending`/`partial` → `paid` | Motor de imputación | Σ imputaciones = importe | `cob.obligation.settled`; retiro de deuda publicada | Reverso (anulación, contracargo, rechazo) → `partial`/`pending` |
| `pending` → `voided` | Sistema (anulación M05 sin pagos) | Sin imputaciones activas | Movimiento inverso | No reversible (se emite documento nuevo) |

Marcas de ciclo de vida (`lifecycle`) las fija M08 (En convenio, Incobrable, Prescripta) o M09 (en reclamo); no cambian el saldo por sí mismas.

### 8.2 `cashSessions.status`

| Origen → Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|
| (nuevo) → `open` | Cajero | Caja sin sesión abierta; permiso `cob.caja.abrir` (antes `cob.cajas.abrir`) | Fondo inicial registrado | Anular apertura sin operaciones |
| `open` → `closing` | Cajero | Sin operaciones en curso | Teórico calculado; arqueo habilitado | Volver a `open` |
| `closing` → `closed` | Cajero (y supervisor si diferencia > umbral) | Declaración completa; integridad sin diferencias; diferencias justificadas | Quebrantos; cheques a cartera; cupones de débito presentados; expectativas bancarias; `cob.cashSession.closed` | → `reopened` |
| `closed` → `reopened` | Supervisor | M14 no recibió la rendición; tesorería abierta para la fecha | Desvincula entregas | → `closed` |
| `closed` → `handedOver` | Tesorero (M14) | Rendición recibida | `tes.cashRemittance.accepted` (EVT-TES-08, de M14) | No reversible (ajuste en M14) |

### 8.3 `cashOperations.status` y `receipts.status`

Estado inicial: `confirmed`.

| Origen → Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|
| (nuevo) → `confirmed` | Cajero / sistema (ente, pasarela, débito, cobrador) | Validaciones OK, integridad exacta | Recibos `issued`, imputaciones, medios, `cob.payment.confirmed` | Anulación |
| (nuevo) → `pendingFiscal` | Sistema | Espera de CAE configurada para una factura o ND generada en la operación (recargo, conceptos cobrados en caja); el recibo no requiere CAE (RF-COB-087; DEC-107) | Cobro registrado; impresión diferida de la factura o ND; el recibo puede entregarse sin ella | → `confirmed` al recibir CAE; si ARCA la rechaza, M05 la devuelve a borrador (RN-FAC-164) y queda la excepción `fiscalPending` hasta su reemisión o anulación |
| `confirmed` → `voided` | Cajero con permiso (supervisor si es de otro usuario o sesión cerrada) | RN-COB-073, RN-COB-074 | Reversos completos (RN-COB-075); recibo `voided`; `cob.receipt.voided` | No reversible: se registra un cobro nuevo |

### 8.4 `paymentIntents.status`

Estado inicial: `draft`.

| Origen → Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|
| (nuevo) → `draft` | Portal, caja, CRM, sistema | Obligaciones con saldo; importe ≥ mínimo | Ítems y montos por vencimiento (M08) | Cancelar |
| `draft` → `issued` | Conector | Respuesta OK del proveedor | `externalId`, link, QR, barras | → `cancelled` |
| `draft` → `uncertain` | Conector | Timeout o error sin respuesta | Excepción; job de reconsulta | → `issued` o `failed` tras reconsultar |
| `issued` → `paid` | Webhook + reconsulta / conciliación / polling | Transacción confirmada por el proveedor | `gatewayTransactions` | → `reversed` |
| `paid` → `imputed` | Motor de imputación | Transacción válida | Recibo, imputaciones, `cob.payment.confirmed` | Anulación de cobranza → `paid` (pagada sin imputar) |
| `issued` → `rejected` | Conector | Proveedor informa rechazo | Portal vuelve a mostrar la deuda | — |
| `issued` → `expired` | Job JOB-COB-12 | Vencida sin pago | Cancelación en el proveedor si soporta | — |
| `issued`/`draft` → `cancelled` | Operador o sistema | Sin pago | — | — |
| `imputed` → `reversed` | Contracargo | Transacción `chargeback` | Reverso de imputaciones; cargos opcionales | — |
| `imputed` → `refunded` | Devolución ejecutada | Expediente ejecutado | — | — |

### 8.5 `agencySettlements.status` y líneas

Estado inicial: `imported`.

| Origen → Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|
| (nuevo) → `imported` | Responsable o job | Huella no repetida | Lectura y parseo | → `rejected` |
| `imported` → `rejected` | Sistema | Convenio o fecha inválidos | Nada se aplica | — |
| `imported` → `validated` | Sistema | Pie y líneas validadas | Líneas `ok`/`warning`/`error` | — |
| `validated` → `partiallyConfirmed` / `confirmed` | Responsable (`cob.entes.confirmar`) o autoconfirmación | Selección de líneas | Operación en caja virtual, recibos, saldos a favor, no identificados, expectativa a M14 | Anulación de la operación (por línea o total) |

Líneas: `pending` → `applied` \| `creditCreated` \| `unidentified` \| `ignored` \| `rejectedDebit`; una línea `unidentified` se resuelve desde la bandeja (RF-COB-046).

### 8.6 `agencyDebtExports.status`

Estado inicial: `generated`.

`generated` → `sent` (T06 entregó) → `acknowledged` (el ente confirma, o API OK) \| `failed` (reintento) ; `generated` → `cancelled` (antes de enviar). Una exportación `acknowledged` no se cancela: se publica una actualización.

### 8.7 `directDebitMandates.status`

Estado inicial: `pendingSignature`.

| Origen → Destino | Actor | Precondición | Efectos |
|---|---|---|---|
| (nuevo) → `pendingSignature` | Operador, socio, API | Medio válido | Solicitud al proveedor (si aplica) |
| (nuevo) / `pendingSignature` → `active` | Proveedor / novedad / operador | Firma o alta confirmada | Entra en presentaciones desde `periodFrom` |
| `active` → `suspended` | Sistema | Rechazos consecutivos o rechazo definitivo | Sale de presentaciones; aviso |
| `suspended` → `active` | Operador / socio | Corrección del medio | — |
| cualquiera → `cancelled` | Operador, socio, novedad de baja | — | Cancelación en el proveedor; `cancelledAt` |
| `pendingSignature` → `error` | Proveedor | Alta rechazada | Aviso |

### 8.8 `directDebitBatches` e ítems

Estado inicial: lote `draft`; ítem `presented`.

Lote: `draft` → `presented` → `settled` (rendición importada) → `closed`. Ítem: `presented` → `accepted` \| `rejected` → (`retryScheduled` → `presented`) \| definitivo; `excluded` si se pagó antes de presentar.

### 8.9 `unidentifiedReceipts.status`

Estado inicial: `pending`.

`pending` → `identified` (operador con datos verificables) → `applied` (con aprobación si supera umbral) ; `pending` → `transferredToCredit` (titular identificado sin obligación) ; `pending` → `refundRequested` → `refunded` (expediente) ; `pending` → `voided` (error de carga del canal, con autorización). Escalamiento automático a los N días (RN-COB-043).

### 8.10 `creditBalances.status`

Estado inicial: `open`.

`open` → `consumed` (imputaciones agotan el saldo) ; `open` → `refundRequested` → `refunded` ; `open` → `voided` (reverso del origen). Una imputación revertida devuelve el saldo (`consumed` → `open`).

### 8.11 `refundCases.status`

Estado inicial: `requested`.

| Origen → Destino | Actor | Precondición | Efectos |
|---|---|---|---|
| (nuevo) → `requested` | `cob.devoluciones.solicitar` | Saldo a favor, cobro o no identificado disponible | Bloquea el importe |
| `requested` → `approved` / `rejected` | `cob.devoluciones.aprobar` (otra persona) | Workflow T11 | NC por M05 si corresponde |
| `approved` → `executing` | `cob.devoluciones.ejecutar` | Clave de idempotencia | Orden al conector o a M14 |
| `executing` → `executed` / `failed` | Conector o M14 | Confirmación | Movimiento de reintegro; `cob.refund.executed` |
| `executed` → `reconciled` | Conciliación | Débito bancario o del proveedor identificado | Cierre |
| `requested`/`approved` → `cancelled` | Solicitante o aprobador | No ejecutada | Libera el importe |

### 8.12 `chargebacks.status`

Estado inicial: `received`.

`received` → `applied` (reverso de imputaciones y cargos) → `disputed` (se presenta descargo ante el proveedor) → `won` (se revierte el contracargo: reimputa) \| `lost` (queda la deuda reabierta).

### 8.13 `paymentCoupons.status`

Estado inicial: `active`.

`active` → `paid` (todas las obligaciones canceladas por el cupón) \| `partiallyPaid` (si el canal admite entregas) \| `expired` (vencimiento) \| `cancelled` (manual o al pagarse alguna obligación por otra vía si se configura).

### 8.14 `collectionReconciliations.status` y `treasuryHandovers.status`

Estado inicial: conciliación `open`; rendición a tesorería `prepared`.

- Conciliación: `open` → `inReview` (hay diferencias) → `closed` (acta); `closed` no se reabre: las diferencias tardías se registran en el día abierto.
- Rendición: `prepared` → `delivered` (cajero) → `received` (tesorería) \| `rejected` (vuelve a la sesión para corregir).

### 8.15 `collectionRounds.status` y `collectionExceptions.status`

Estado inicial: lista de cobro `draft`; excepción `open`.

- Lista de cobro: `draft` → `assigned` → `inProgress` (descargada al dispositivo) → `synced` → `settled` (rendición cerrada).
- Excepción: `open` → `inProgress` → `resolved` \| `dismissed` (con motivo); vencida su `dueAt` se escala.

### 8.16 Otras colecciones con estado (`currentAccounts.status`, `allocations.status`)

Los valores ya estaban en §7; se explicitan las transiciones.

Estado inicial: ver las filas `(nuevo)`.

| Colección | Desde | Hacia | Disparador | Guarda | Evento |
|---|---|---|---|---|---|
| `currentAccounts` | (nuevo) | `active` | Alta de la cuenta del titular (M01) | — | — |
| `currentAccounts` | `active` | `closed` | Cierre de la cuenta en M01 | Saldo cero y sin obligaciones abiertas | — |
| `allocations` | (nuevo) | `active` | Imputación de un recibo, saldo a favor o nota de crédito | Importe ≤ saldo abierto de la obligación | `cob.payment.confirmed` (EVT-COB-04) |
| `allocations` | `active` | `reversed` | Anulación del recibo o reasignación de la imputación | La imputación no fue revertida antes | `cob.allocation.reversed` (EVT-COB-06); `cob.receipt.voided` (EVT-COB-05) si anula el recibo |

### 8.17 `collectorSettlements`, `gatewayTransactions`, `thirdPartyCollections` y `externalObligationImports` (PA-COB-19)

Las cuatro colecciones tenían `status` sin valores (§7.35.19, §7.35.33, §7.35.41 y §7.35.42). Valores y transiciones asumidos en PA-COB-19 (DEC-072).

Estados iniciales: rendición de cobrador `open`; transacción de pasarela `received`; cobro por cuenta de terceros `collected`; importación de obligaciones externas `uploaded`.

| Colección | Desde | Hacia | Disparador | Guarda | Evento |
|---|---|---|---|---|---|
| `collectorSettlements` | (nuevo) | `open` | El cobrador inicia la rendición desde la PWA (`cob.cobradores.rendir`) | Listas de cobro incluidas en `synced` (§8.15) | — |
| `collectorSettlements` | `open` | `delivered` | Entrega de fondos en caja: operación `collectorSettlement` en la sesión `sessionId` | `handedOverTotal` registrado por medio | — |
| `collectorSettlements` | `delivered` | `withDifference` | Conciliación lista vs. cobrado vs. entregado (RF-COB-093) | `difference` distinta de cero | `cob.exception.opened` (EVT-COB-22) |
| `collectorSettlements` | `delivered` | `closed` | Conciliación sin diferencia | `difference` igual a cero | — |
| `collectorSettlements` | `withDifference` | `closed` | Justificación aprobada por el supervisor | `justification` cargada (RF-COB-093: no se cierra con diferencias sin justificar) | `cob.cashDifference.recorded` (EVT-COB-14) si queda quebranto o sobrante |
| `collectorSettlements` | `delivered` · `withDifference` | `open` | Anulación de la operación de caja de la entrega | Sesión de caja abierta | — |
| `gatewayTransactions` | (nuevo) | `received` | Webhook, conciliación, polling o archivo (`receivedVia`) | Clave `{connectorId, externalPaymentId, type}` no repetida | — |
| `gatewayTransactions` | `received` | `confirmed` | Reconsulta al proveedor | El proveedor confirma la operación | — |
| `gatewayTransactions` | `received` | `rejected` | Reconsulta o aviso del proveedor | El proveedor no confirma o informa rechazo | — |
| `gatewayTransactions` | `confirmed` | `applied` | Motor de imputación (`type` = `payment`) o reverso (`chargeback`, `refund`, `reversal`, `rejection`) | Intención u obligación identificada | `cob.payment.confirmed` (EVT-COB-04) para `payment`; `cob.chargeback.applied` (EVT-COB-18) para `chargeback`; `cob.refund.executed` (EVT-COB-19) para `refund`; `cob.allocation.reversed` (EVT-COB-06) para `reversal` y `rejection` |
| `gatewayTransactions` | `confirmed` | `unmatched` | Motor de imputación | Sin intención ni obligación identificable | `cob.exception.opened` (EVT-COB-22); cobro no identificado (§8.9) |
| `gatewayTransactions` | `unmatched` | `applied` | Resolución desde la bandeja | Cuenta identificada | `cob.unidentified.resolved` (EVT-COB-26) |
| `gatewayTransactions` | `applied` | `reconciled` | Conciliación de pasarela (§9) | Acreditación del proveedor identificada por `netAmount` | — |
| `thirdPartyCollections` | (nuevo) | `collected` | Cobro por cuenta de terceros (operación `thirdPartyCollection`) | Tercero con convenio vigente (`thirdPartyBillerId`) | `cob.thirdPartyCollection.recorded` (EVT-COB-21) |
| `thirdPartyCollections` | `collected` | `inSummary` | Armado del resumen de rendición al tercero | `summaryNumber` asignado | — |
| `thirdPartyCollections` | `inSummary` | `collected` | Anulación del resumen antes de rendir | Resumen no rendido | — |
| `thirdPartyCollections` | `inSummary` | `rendered` | Rendición al tercero | `renderedToThirdPartyAt` registrado | — |
| `thirdPartyCollections` | `collected` | `voided` | Anulación de la operación de caja | No incluido en un resumen | `cob.receipt.voided` (EVT-COB-05) |
| `externalObligationImports` | (nuevo) | `uploaded` | Carga del archivo (`storedFileId`) | Huella `{source, fileHash}` no repetida | — |
| `externalObligationImports` | `uploaded` | `rejected` | Validación de formato | `format` o encabezado inválido | — |
| `externalObligationImports` | `uploaded` | `validated` | Validación de líneas | Cada línea con `result` | — |
| `externalObligationImports` | `validated` | `applied` | Confirmación del responsable | Todas las líneas válidas | `cob.obligation.registered` (EVT-COB-01) por obligación creada |
| `externalObligationImports` | `validated` | `partiallyApplied` | Confirmación del responsable | Líneas con error excluidas | `cob.obligation.registered` (EVT-COB-01) por obligación creada |
| `externalObligationImports` | `uploaded` · `validated` | `cancelled` | Descarte por el responsable | Sin líneas aplicadas | — |

Al cerrar una rendición de cobrador, sus listas pasan a `settled` (§8.15) y entra en la base de comisión (JOB-COB-17). Las transacciones de pasarela nunca se borran (§7): un contracargo o una devolución posterior es otra transacción con su `type`. Una importación `applied` o `partiallyApplied` no se revierte en bloque: cada obligación creada se anula por su circuito (§8.1).

### 8.18 `collectionAccountingGroups.status` (PA-COB-20)

| Colección | Desde | Hacia | Disparador | Guarda | Evento |
|---|---|---|---|---|---|
| `collectionAccountingGroups` | (nuevo) | `active` | Alta del grupo contable | `code` no repetido en el tenant | — |
| `collectionAccountingGroups` | `active` | `inactive` | Baja por el administrador | Ninguna cuenta (`accounts.accountingGroupId`, M01) lo usa, o se reasignan antes; el grupo `0` no se desactiva | — |
| `collectionAccountingGroups` | `inactive` | `active` | Reactivación | — | — |

Los cobros ya contabilizados conservan el grupo que tenían; desactivar un grupo no cambia asientos registrados.

### 8.19 Máquinas completadas y altas explícitas (residuales del 5-11-2026, PA-COB-21)

Completa las colecciones que los entregables marcaron sin valores (`collectors`, `gatewayConnectors`), con estados sin transiciones (`accountStatements`, `receipts`, `paymentTenders`, `paymentReferences`, `agencyPublishedDebts`, `agencyNoveltyFiles`, `gatewayWebhookEvents`), con patrón general sin tabla (`allocationPolicies`, `cashRegisters`, `staticQrCodes`, `collectionAgencies`) y las máquinas de §8.6 a §8.15 que decían el estado inicial solo en texto. Las filas `(nuevo)` fijan el estado inicial. Valores asumidos en PA-COB-21 (DEC-072); coinciden con §7.35.

| Colección | Desde | Hacia | Disparador | Guarda | Evento |
|---|---|---|---|---|---|
| `collectors` | (nuevo) | `active` | Alta del cobrador por el administrador de cobranza | Persona (M01) y caja de tipo `collector` asignadas | — |
| `collectors` | `active` | `suspended` | Supervisor suspende al cobrador | Rendición con diferencia sin justificar o límites excedidos (RF-COB-093) | — |
| `collectors` | `suspended` | `active` | Supervisor rehabilita | Diferencias justificadas | — |
| `collectors` | `active` · `suspended` | `inactive` | Baja por el administrador | Sin listas de cobro en `assigned` o `inProgress` ni rendición `open` | — |
| `collectors` | `inactive` | `active` | Reactivación por el administrador | — | — |
| `gatewayConnectors` | (nuevo) | `active` | Alta de la pasarela por el administrador | Credencial en la bóveda (T06) y prueba de conexión `health.status = ok` | — |
| `gatewayConnectors` | `active` | `suspended` | Sistema o administrador | `health.status` en `credentialExpired` o `down` sostenido, o suspensión manual; los canales dejan de ofrecerla | — |
| `gatewayConnectors` | `suspended` | `active` | Administrador | Credencial renovada y prueba de conexión correcta | — |
| `gatewayConnectors` | `active` · `suspended` | `inactive` | Baja por el administrador | Sin intenciones `issued` vigentes | — |
| `gatewayConnectors` | `inactive` | `active` | Reactivación por el administrador | Prueba de conexión correcta | — |
| `accountStatements` | (nuevo) | `issued` | JOB-COB-11 al cierre del ciclo o emisión a demanda | Corte con obligaciones del grupo | — |
| `accountStatements` | `issued` | `delivered` | Sistema: entrega confirmada por el canal (T09) | — | — |
| `accountStatements` | `issued` · `delivered` | `superseded` | Sistema: emisión de un resumen posterior del mismo corte con corrección | Existe resumen sucesor | — |
| `receipts` | (nuevo) | `issued` | Cobro confirmado (§8.3) | Operación de caja `confirmed` | `cob.payment.confirmed` (EVT-COB-04) |
| `receipts` | `issued` | `voided` | Anulación de la operación de caja (cajero con permiso) | RN-COB-073, RN-COB-074 | `cob.receipt.voided` (EVT-COB-05) |
| `paymentTenders` | (nuevo) | `inRegister` | Registro del medio en la operación de caja | — | — |
| `paymentTenders` | `inRegister` | `handedOver` | Rendición a tesorería (`handoverId`) | Rendición `delivered` (§8.14) | — |
| `paymentTenders` | `handedOver` | `presented` | M14 presenta cupones de tarjeta o cheques | — | — |
| `paymentTenders` | `handedOver` · `presented` | `deposited` | M14 deposita o recibe la acreditación | — | — |
| `paymentTenders` | `presented` | `rejected` | Rechazo del cheque o del cupón | — | `cob.allocation.reversed` (EVT-COB-06) |
| `paymentTenders` | `inRegister` | `voided` | Anulación de la operación de caja | Sesión abierta o autorización del supervisor | `cob.receipt.voided` (EVT-COB-05) |
| `paymentReferences` | (nuevo) | `active` | Emisión del identificador de pago (DEC-050) | — | — |
| `paymentReferences` | `active` | `consumed` | Sistema: pago aplicado con el identificador | Pago imputado | — |
| `paymentReferences` | `active` | `cancelled` | Anulación o vencimiento del objeto referido (obligación o cupón) | — | — |
| `agencyPublishedDebts` | (nuevo) | `published` | Exportación `acknowledged` (§8.6) | — | — |
| `agencyPublishedDebts` | `published` | `updated` | Exportación de actualización `acknowledged` | Cambio de importe o vencimiento | — |
| `agencyPublishedDebts` | `published` · `updated` | `paid` | Rendición del ente aplicada | Obligación `paid` | `cob.obligation.settled` |
| `agencyPublishedDebts` | `published` · `updated` | `withdrawn` | Retiro por pago por otro canal o anulación del documento | — | — |
| `agencyNoveltyFiles` | (nuevo) | `imported` | Importación del archivo del ente | Huella `{agencyId, fileHash}` no repetida | — |
| `agencyNoveltyFiles` | `imported` | `applied` | Responsable confirma las novedades | — | — |
| `agencyNoveltyFiles` | `imported` | `rejected` | Validación de formato fallida o rechazo del responsable | — | — |
| `gatewayWebhookEvents` | (nuevo) | `received` | Webhook del proveedor | Firma válida | — |
| `gatewayWebhookEvents` | `received` | `ignored` | Sistema: duplicado por `{connectorId, dedupeKey}` o tipo no suscripto | — | — |
| `gatewayWebhookEvents` | `received` | `processing` | Worker de pasarela toma el evento | — | — |
| `gatewayWebhookEvents` | `processing` | `processed` | Reconsulta al proveedor confirmada | — | Transacción `received` (§8.17) |
| `gatewayWebhookEvents` | `processing` | `failed` | Error de reconsulta o de proceso | — | `cob.exception.opened` (EVT-COB-22) al agotar reintentos |
| `gatewayWebhookEvents` | `failed` | `processing` | Reintento programado | — | — |
| `allocationPolicies` | (nuevo) | `draft` | Configurador crea una versión | — | — |
| `allocationPolicies` | `draft` | `published` | Configurador o aprobador publica | Versión validada; publicada queda inmutable (T05 §7.1.5) | — |
| `allocationPolicies` | `published` | `retired` | Sistema al publicar la versión sucesora | Existe versión sucesora | — |
| `cashRegisters` | (nuevo) | `active` | Alta por el administrador | Validación del esquema (T04 §8.3) | — |
| `cashRegisters` | `active` | `inactive` | Baja por el administrador | Sin sesiones abiertas (cajas), sin transacción en curso (QR) o sin exportaciones pendientes (entes); no se borra (T05 §7.1.5) | — |
| `cashRegisters` | `inactive` | `active` | Reactivación por el administrador | — | — |
| `staticQrCodes` | (nuevo) | `active` | Alta por el administrador | Validación del esquema (T04 §8.3) | — |
| `staticQrCodes` | `active` | `inactive` | Baja por el administrador | Sin sesiones abiertas (cajas), sin transacción en curso (QR) o sin exportaciones pendientes (entes); no se borra (T05 §7.1.5) | — |
| `staticQrCodes` | `inactive` | `active` | Reactivación por el administrador | — | — |
| `collectionAgencies` | (nuevo) | `active` | Alta por el administrador | Validación del esquema (T04 §8.3) | — |
| `collectionAgencies` | `active` | `inactive` | Baja por el administrador | Sin sesiones abiertas (cajas), sin transacción en curso (QR) o sin exportaciones pendientes (entes); no se borra (T05 §7.1.5) | — |
| `collectionAgencies` | `inactive` | `active` | Reactivación por el administrador | — | — |
| `creditBalances` | (nuevo) | `open` | Excedente de cobro, anticipo, nota de crédito, reverso o migración (`origin`) | — | — |
| `unidentifiedReceipts` | (nuevo) | `pending` | Línea de rendición, transacción o movimiento bancario sin cuenta identificable | — | — |
| `collectionRounds` | (nuevo) | `draft` | Armado de la lista de cobro por el supervisor | — | — |
| `agencyDebtExports` | (nuevo) | `generated` | Generación del archivo o envío por API (JOB o responsable) | — | — |
| `directDebitBatches` | (nuevo) | `draft` | Armado del lote de débito | — | — |
| `paymentCoupons` | (nuevo) | `active` | Emisión del cupón de pago único | Obligaciones de una sola entidad jurídica (RN-COB-156) | — |
| `chargebacks` | (nuevo) | `received` | Aviso de contracargo del proveedor | Transacción de pasarela identificada | — |
| `collectionReconciliations` | (nuevo) | `open` | Apertura de la conciliación del día por ente, pasarela o caja | — | — |
| `treasuryHandovers` | (nuevo) | `prepared` | Cajero prepara la entrega al cerrar la sesión | Sesión `closed` o rendición de cobrador cerrada | — |
| `collectionExceptions` | (nuevo) | `open` | Sistema registra la excepción | — | `cob.exception.opened` (EVT-COB-22) |

## 9. Procesos y flujos

Todos los procesos económicos se ejecutan en una transacción MongoDB por operación (recibo + imputaciones + medios + movimientos + saldos + outbox). Si cualquier paso falla, no queda nada aplicado (RN-COB-004). Los efectos externos (correo, entes, contabilidad, tesorería) salen por outbox.

### 9.1 P-COB-01 Registro de obligaciones desde facturación

1. Consumir `fac.invoice.issued`, `fac.debitNote.issued`, `fac.billingRun.issued` (EVT-FAC-05; lote: un evento por comprobante) y `mor.interest.settled` / `mor.deferredInterest.created` (EVT-MOR-02/03; M08: intereses facturados aparte, débitos de reversión) con su `eventId`.
2. Si el `eventId` ya se procesó, terminar (idempotencia del consumidor).
3. Resolver la cuenta corriente según la modalidad (separada por servicio o unificada por grupo de facturación) y crearla si no existe.
4. Por cada bloque de servicio del comprobante crear una obligación con vencimientos (1..N según `dueDates` del comprobante; DEC-106), importes por vencimiento y componentes; fijar `fiscalGate` según la autorización del comprobante (RN-COB-158; DEC-107) y registrar el débito en `ledgerEntries` solo si queda `authorized` o `notRequired`. Si la obligación ya existe por `{sourceDocumentId, sourceLineKey}` (reemisión tras volver a borrador, `issueAttempt` mayor), actualizarla en lugar de crear otra.
4.1. Con `fis.invoice.authorized` (EVT-FIS-01): pasar `fiscalGate` a `authorized`, correr los vencimientos de `dueSchedule` si la autorización llegó después del primero (RN-COB-158 punto 3; M05 RN-FAC-165; 10-11-2026), registrar el débito y seguir con los pasos 5 a 8. Con `fac.invoice.returnedToDraft` (EVT-FAC-22): pasar a `released`. Con `fac.invoice.renumbered` (EVT-FAC-23): actualizar `sourceDocument.number` (DEC-107).
5. Generar identificadores de pago (`paymentReferences`) y códigos de barras por formato habilitado; si un código no es representable (RN-COB-148) registrar el motivo y no dejarlo vacío. Con `fiscalGate = pendingAuthorization` los pasos 5 a 8 esperan a 4.1 (DEC-107).
6. Si hay saldos a favor aplicables automáticamente y está configurado "aplicar en la próxima factura", invocar el motor de imputación (canal `internal`).
7. Si la cuenta tiene adhesión de débito activa y el tipo no está excluido, marcar la obligación para el próximo lote.
8. Publicar `cob.obligation.registered`.
9. `fac.creditNote.issued`: crear un saldo a favor o imputar la NC a la obligación referenciada (RN-COB-037). `fac.invoice.annulled` (EVT-FAC-08): si la obligación no tiene imputaciones activas pasa a `voided`; si las tiene, el evento se rechaza a una excepción (M05 no debe anular comprobantes cobrados sin NC).

Recuperación: los eventos fallidos quedan en la cola de reintentos (5 intentos, backoff exponencial) y luego en `collectionExceptions` tipo `integrityDifference`.

### 9.2 P-COB-02 Motor de imputación

Entrada: crédito (cobro, NC, saldo a favor, retención), cuenta corriente, canal, selección explícita opcional, fecha de cobro.
1. Determinar la política vigente para el canal y servicio (o la de la cuenta).
2. Construir el universo: obligaciones con saldo > 0 de la cuenta, no bloqueadas, no en convenio (salvo cuotas del convenio), ordenadas por la estrategia.
3. Para cada obligación pedir a M08 la cotización (`mor.surcharge.quote`: recargo entre vencimientos, interés de mora, interés de financiación) a la fecha de cobro, salvo que el canal difiera recargos.
4. Validar reglas de caja (deuda notificada completa, más antiguas primero, por servicio, cuotas en orden, cupón completo, entrega mínima) con severidad error o advertencia.
5. Distribuir el importe por componente en el orden configurado (recargos → intereses → terceros → impuestos → capital por defecto).
6. Remanente: saldo a favor o pendiente de aplicación (PRM-COB-030); faltante en canal sin entregas: rechazo o revisión según el canal.
7. Registrar imputaciones con la política y versión aplicada, movimientos, saldos proyectados y, si hubo recargo diferido, publicar `cob.surcharge.deferred` para que M08 lo facture.
8. Devolver el plan de imputación para el recibo.

Simulación: el mismo motor en modo `dryRun` alimenta la pantalla de cobro y el portal (sin persistir).

### 9.3 P-COB-03 Cobro en ventanilla (CU-11)

1. Cajero con sesión abierta busca al titular (número de cuenta, documento, nombre, código de barras o identificador de pago).
2. Se muestran obligaciones de la cuenta, aviso de deuda en otras cuentas (PRM-COB-051), bloqueos, estado de servicio desconectado, saldo a favor y alerta de notificaciones (PRM-COB-052).
3. El cajero selecciona obligaciones o cupón; el sistema simula la imputación y muestra recargos e intereses (PAN-COB-10).
4. Si el cobro es parcial requiere `cob.caja.cobrarParcial` y el motivo; si se modifica el recargo requiere `cob.caja.cambiarRecargo` y queda auditado.
5. El cajero carga medios (efectivo, cheque, transferencia, tarjeta, QR del puesto, retención, saldo a favor); se calculan recargos por tarjeta, vuelto y descuentos.
6. Confirmación con `Idempotency-Key` generado en el cliente; validaciones de integridad exacta (Σ medios − vuelto = Σ recibos).
7. Transacción: operación, recibo(s) (uno por cuenta o uno por cupón según PRM-COB-065 / V2 2719, y siempre al menos uno por entidad jurídica, RF-COB-193; cada recibo toma su número de `fac.service.nextNumber` de M05 con la entidad y el punto de venta del recibo, RF-COB-087, RF-FAC-179), imputaciones, medios, movimientos, saldos, outbox.
8. Comprobante fiscal (si hay factura o ND de recargo o de conceptos cobrados en caja; el recibo no requiere CAE porque no pasa por ARCA, RF-COB-087; DEC-107; *antes: "si el recibo requiere CAE o hay factura de recargo"*): espera síncrona configurable (PRM-COB-066); si no llega, la operación queda `pendingFiscal` y el job JOB-COB-15 la completa.
9. Impresión (perfil de impresora T06), envío por correo o WhatsApp por el motor de comunicaciones de T09 (comando `com.communications.emit`, API-COM-75; antes atribuido a "M10" por error), `cob.payment.confirmed`.

Cancelación: antes de confirmar no se persiste nada. Doble clic o reintento de red con la misma clave devuelve el mismo recibo.

### 9.4 P-COB-04 Anulación de cobranza

1. Usuario con `cob.caja.anular` selecciona la operación; si es de otro usuario o la sesión está cerrada, se requiere supervisor (PRM-COB-075/076).
2. Validaciones: rendición de tesorería no recibida (si fue recibida, se anula con contrapartida en M14), cheque no depositado, cupón de tarjeta no presentado, tercero no rendido, comprobante fiscal anulable (si no, NC por M05).
3. Transacción: reverso de imputaciones (saldos restituidos), reverso de saldos a favor generados (si ya se consumieron, se rechaza salvo reverso en cascada autorizado), medios `voided`, recibo `voided`, movimiento de reverso; los recargos facturados se anulan por M05/M08 mediante evento.
4. `cob.receipt.voided`; ProCoop borraba registros (CTR-COB-04): aquí todo queda.

### 9.5 P-COB-05 Cierre, arqueo y rendición a tesorería (CU-12)

1. Cajero pide cierre: se bloquean nuevas operaciones de la sesión.
2. Verificación de integridad de la sesión (operaciones = medios = recibos); con diferencias no se permite cerrar (RN-COB-060).
3. Cálculo del teórico por medio y moneda; el cajero declara por medio (PA-COB-08), con desglose opcional de billetes.
4. Diferencias: justificación obligatoria; si superan PRM-COB-034, aprobación de supervisor; se registra quebranto o sobrante (evento a M15).
5. Cupones de tarjeta: presentación automática al cierre si PRM-COB-071; cheques pasan a cartera (M14).
6. Se genera el informe de presentación del cajero y la rendición (`treasuryHandovers`), `cob.cashSession.closed` y `cob.treasuryHandover.delivered`.
7. Tesorería (M14) recibe y confirma: `tes.cashRemittance.accepted` (EVT-TES-08) cambia la sesión a `handedOver`.

Cierre múltiple (V2 2688): permitido solo con PRM-COB-070 activo; agrupa sesiones del mismo cajero y deja `closeGroupId`.

### 9.6 P-COB-06 Exportación de deuda a entes

1. Disparador: manual (PAN-COB-18), programado (JOB-COB-01) o por evento (`cob.obligation.registered` para entes en línea como SIRO por API).
2. Selección: obligaciones con saldo según origen (todas las facturas impagas o solo período, PRM-COB-081), excluidas las adheridas a débito si se configura, las ya informadas (PRM-COB-085), las de vencimiento máximo superado y las bloqueadas.
3. Cálculo de importes por vencimiento a publicar: si el ente difiere mora, importes nominales; si no, cotización de M08 a cada vencimiento publicado; días extra en el último vencimiento (PRM-COB-084).
4. Generación con el layout versionado (encabezado, detalle, pie, archivo de control); validaciones de ancho; cantidad y totales.
5. Entrega por T06 (SFTP, API o descarga manual); para SIRO por API: envío, número de transacción, consulta de resultado y confirmación automática o manual.
6. Registro en `agencyDebtExports` y `agencyPublishedDebts` (índice Red Link incremental desde PRM-COB-083).
7. Actualización: al cancelarse una obligación por otro canal, `cob.obligation.settled` marca la deuda publicada como `paid` y, si el ente lo soporta, se publica la baja en la próxima actualización.

### 9.7 P-COB-07 Importación de rendición de entes

1. El archivo llega por SFTP (JOB-COB-02), API (JOB-COB-03) o carga manual; se calcula la huella SHA-256: si ya existe para el ente, se rechaza como duplicado.
2. Validaciones de cabecera (convenio del ente, fecha) y pie (cantidad con offset y total); diferencias de pie se registran como advertencia o error según el layout.
3. Por línea: parseo según layout; resolución de la obligación (identificador autocontenido → alias → resolutor LAG → código de barras → intención); cálculo del importe esperado al vencimiento informado; comparación con tolerancia.
4. Resultado por línea: `ok`, `warning` (importe distinto, vencimiento superado, ya pagada) o `error` (no encontrada, mal formada); propuesta de acción.
5. Confirmación (manual o automática si todas las líneas son `ok` y PRM `autoConfirm`): operación en la caja virtual del ente, recibos tipo `agency`, imputaciones (sin recargo si difiere; con recargo diferido publicado a M08), saldos a favor por duplicado o excedente, no identificados para las no resueltas, rechazos de débito para líneas con código de rechazo.
6. Comisión del ente (fija por ítem o porcentual con mínimo y máximo) calculada y publicada como gasto (M14/M15); `cob.settlement.expected` con neto, fecha de acreditación y cuenta bancaria según la registración configurada.
7. Conciliación: M14 informa `tes.gatewayCredit.reconciled` (EVT-TES-07); la conciliación de cobranzas cierra el día.

Recuperación: confirmar es idempotente por línea (`operationId = settlementId + lineNo`); una caída a mitad reanuda en las líneas no aplicadas.

### 9.8 P-COB-08 Débito automático

1. Adhesiones: alta por operador, portal (socio), archivo de novedades del ente o API del proveedor (Pagos360 CBU/tarjeta); validación de CBU (dígitos verificadores) o token de tarjeta; firma o confirmación del proveedor.
2. Presentación (JOB-COB-07): por cada ente/conector, en el día de corte, se toman obligaciones de cuentas con adhesión activa no excluidas, con saldo y vencimiento en la ventana; se genera el lote (archivo o solicitudes API) por el importe del primer vencimiento o el vigente a la fecha de débito.
3. Resultado (JOB-COB-08): acreditados → cobro (operación en caja virtual del conector, recibo, imputación); rechazados → código del catálogo; reintento según política (PRM-COB-101) si el código es reintentable; definitivos (cuenta cerrada, baja) suspenden la adhesión y avisan al socio.
4. Pago voluntario anterior: si la obligación se pagó por otro canal antes de la presentación, se excluye; si se cobró dos veces, el segundo cobro genera saldo a favor y, si el socio lo pide, devolución (P-COB-12).
5. Morosidad de tarjetas (Naranja, Visa): el archivo de morosidad registra novedades sin generar cobros.

### 9.9 P-COB-09 Pago online (CU-13)

1. El socio (portal, app o link) elige obligaciones o cupón; se simula la imputación y se cotizan recargos al vencimiento vigente.
2. Reutilización: si existe una intención `issued` para los mismos ítems e importes dentro de la ventana (PRM-COB-112), se devuelve; si no, se crea con `Idempotency-Key`.
3. El conector crea la intención en el proveedor (checkout, QR, código de barras, link) y guarda `externalId` y referencias; si no responde, la intención pasa a `uncertain` y **no se reenvía** (P-COB-10).
4. Confirmación por tres vías: webhook (`/api/v1/ext/cob/webhooks/{connector}/{tenantSlug}`: firma o token, registro del evento, deduplicación, respuesta 200 inmediata y procesamiento asíncrono JOB-COB-04 que **reconsulta** el estado al proveedor antes de imputar), polling con backoff para proveedores sin webhook (JOB-COB-05) y conciliación diaria (JOB-COB-06).
5. Imputación: transacción `payment` → operación en la caja virtual del conector → recibo → imputaciones → `cob.payment.confirmed`; comisión real o estimada (PRM-COB-118) registrada en la transacción.
6. Diferencia de importe (pago de 2° vencimiento con importe del 1°, recargo distinto): se acepta, se imputa y la diferencia va a revisión (PA-COB-05).
7. Pago de una obligación ya cancelada por otra vía: saldo a favor + excepción `duplicatePayment`.

### 9.10 P-COB-10 Pago incierto

1. Intención en `uncertain` (timeout, error 5xx, caída).
2. JOB-COB-05 reconsulta por `externalId` o por referencia propia con backoff (1, 5, 15, 60 min, luego cada 6 h hasta 72 h).
3. Si el proveedor confirma la creación → `issued`; si informa pago → P-COB-09 paso 5; si no existe → `failed` y la obligación vuelve a estar disponible.
4. Mientras está incierta, el portal muestra "pago en verificación" y bloquea crear otra intención para los mismos ítems.
5. Vencido el plazo sin resolución, excepción `uncertainPayment` para el responsable de cobranzas externas.

### 9.11 P-COB-11 Contracargo

1. Ingreso por webhook, importación de contracargos (JOB-COB-19) o conciliación.
2. Se registra la transacción `chargeback` y el expediente `chargebacks`.
3. Reverso de las imputaciones del pago (las obligaciones vuelven a tener saldo), intención `reversed`.
4. Opcional (PA-COB-11): cargo por interés diario de reversión y comisión de reversión como obligaciones nuevas emitidas por M08/M05.
5. Bloqueo de pago online de las cuentas afectadas si PRM-COB-124; aviso al socio y al responsable.
6. Disputa: carga de evidencia; resultado `won` (reimputa) o `lost`.

### 9.12 P-COB-12 Devolución

1. Solicitud desde saldo a favor, cobro duplicado, no identificado o reclamo (M09).
2. Workflow T11: aprobación por persona distinta; montos sobre PRM-COB-120 requieren segundo nivel.
3. Documento correctivo por M05 cuando la devolución corresponde a un comprobante fiscal.
4. Ejecución: si el conector declara `refund`, orden al proveedor con clave de idempotencia; si no, orden de pago a M14 (transferencia) o egreso en caja.
5. Confirmación y conciliación del débito; `cob.refund.executed`.

### 9.13 P-COB-13 Cobro no identificado

1. Origen: línea de rendición no resuelta, transferencia bancaria sin referencia (M14 `tes.statementLine.unidentified`, EVT-TES-06), pago de pasarela sin obligación, cobrador.
2. Registro en la bandeja con datos del pagador y candidatos sugeridos (importe, nombre, CUIT, referencia).
3. Identificación por operador con evidencia; si supera PRM-COB-041 requiere aprobación.
4. Aplicación: recibo y imputación con fecha de cobro original (no la de identificación) para el cálculo de recargos.
5. Escalamiento a los PRM-COB-043 días (JOB-COB-21); sin titular, devolución o transferencia a ingresos según política contable (M15).

### 9.14 P-COB-14 Conciliación diaria de cobranzas

1. JOB-COB-06 (pasarelas) y JOB-COB-20 (entes) por canal y día, con ventana de PRM-COB-125 días hacia atrás.
2. Pasarelas: listado de cobros del proveedor vs. `gatewayTransactions`; faltantes se incorporan (y se imputan), sobrantes se marcan.
3. Bruto, comisión, IVA de comisión, retenciones y neto esperado; acreditado según M14.
4. Diferencias a `collectionExceptions`; el responsable cierra el día con acta.

### 9.15 P-COB-15 Cobrador offline

1. Administración genera la lista de cobro con importes congelados a la fecha prevista y la asigna.
2. La PWA del cobrador descarga la lista (cifrada en el dispositivo) y opera sin conexión: recibo provisorio con serie del dispositivo, medios permitidos, límite de efectivo.
3. Al reconectar, la cola IndexedDB sincroniza cada cobro con su `clientMutationId` (idempotente): se emite el recibo definitivo y se recalcula el recargo a la fecha real; diferencias a revisión.
4. Conflictos (obligación ya pagada por otra vía): saldo a favor y excepción `offlineSyncConflict`.
5. Rendición del cobrador: entrega del efectivo en caja, diferencia justificada, base de comisión (JOB-COB-17).

### 9.16 P-COB-16 Cancelación automática de créditos

JOB-COB-10 o ejecución manual (PAN-COB-05): para cada cuenta con saldos a favor `autoApplicable` y obligaciones pendientes del mismo servicio (o de otro con política), simula y aplica el motor de imputación con canal `internal`; los saldos de cobros duplicados y reversiones nunca se aplican automáticamente (PRM-COB-038); resultado por cuenta con detalle.

### 9.17 P-COB-17 Resumen de cuenta y cupón único

JOB-COB-11 al cierre de ciclo de facturación del grupo (o a demanda): genera `accountStatements` con obligaciones abiertas por servicio, pagos del período, saldo a favor, mínimo de pago y cupón único con identificador, código de barras y QR; PDF en almacenamiento privado; entrega por el motor de comunicaciones de T09 (`com.communications.emit`, API-COM-75; antes atribuida a "M10" por error) a los canales del grupo.

### 9.18 P-COB-18 Cobro por cuenta de terceros

Lectura del código de barras del tercero → validación (vencido, parcial, múltiple, mínimo) → obligación propia del tercero → cobro → comisión → resumen de rendición al tercero (M14 paga). Anulación bloqueada si ya se rindió.

### 9.19 P-COB-19 Verificación de integridad del auxiliar

JOB-COB-14 diario y bajo demanda: (a) por obligación, `amount − Σ allocations activas = openAmount`; (b) recibo = Σ ítems; (c) operación = Σ medios − vuelto; (d) cada medio con su registro; (e) Σ auxiliar por servicio = cuenta de deudores de M15 (cuando M15 esté en servicio); (f) saldos a favor = Σ orígenes − Σ consumos. Cada diferencia abre una excepción con el detalle; el sistema nunca corrige solo.

### 9.20 Jobs

| JOB-ID | Nombre BullMQ | Disparador | Frecuencia | Idempotencia | Reintentos | Alerta |
|---|---|---|---|---|---|---|
| JOB-COB-01 | `cob:exportar-deuda-ente` | Programado por ente / manual | Según `collectionAgencies.transport.schedule` | Por ente + período + versión de layout | 3, backoff 5 min | Fallo de envío al responsable |
| JOB-COB-02 | `cob:importar-rendicion` | SFTP T06 (archivo nuevo) / manual | Cada 30 min en ventana configurada | Huella del archivo | 3 | Archivo rechazado o con errores |
| JOB-COB-03 | `cob:sondear-rendicion-api` | Programado (SIRO API, Pagos360) | Diario + a demanda por fecha | Fecha + conector | 5, backoff | Credencial vencida / caída |
| JOB-COB-04 | `cob:procesar-webhook` | Webhook recibido | En línea | `dedupeKey` | 5, backoff exponencial | Evento fallido |
| JOB-COB-05 | `cob:resolver-inciertos` | Intención `uncertain` / polling | Backoff 1-5-15-60 min, luego 6 h hasta 72 h | `intentId` | Hasta 72 h | `uncertainPayment` |
| JOB-COB-06 | `cob:conciliar-pasarelas-diario` | Programado | Diario 06:00 tenant | Conector + fecha | 3 | Diferencias |
| JOB-COB-07 | `cob:presentar-debitos` | Día de corte | Diario (evalúa cortes) | Ente + fecha de débito | 3 | Lote no presentado |
| JOB-COB-08 | `cob:importar-rechazos-debito` | Archivo / API | Diario | Huella / lote | 3 | Rechazos definitivos |
| JOB-COB-09 | `cob:sincronizar-adhesiones` | Programado | Diario | Conector + fecha | 3 | Adhesiones en error |
| JOB-COB-10 | `cob:cancelacion-automatica-creditos` | Programado / manual | Diario tras facturación | Cuenta + fecha | 3 | Fallos por cuenta |
| JOB-COB-11 | `cob:emitir-resumenes` | `fac.billingRun.issued` (EVT-FAC-05) / cierre de ciclo | Por ciclo | Cuenta + fecha de corte | 3 | Resúmenes no generados |
| JOB-COB-12 | `cob:vencer-intenciones` | Programado | Cada hora | `intentId` | 3 | — |
| JOB-COB-13 | `cob:recordatorio-cierre-caja` | Programado | Fin de jornada configurable | Sesión + fecha | 1 | Sesiones abiertas de días anteriores |
| JOB-COB-14 | `cob:verificar-integridad-auxiliar` | Programado / manual | Diario 03:00 tenant | Fecha | 2 | Cualquier diferencia (severidad alta) |
| JOB-COB-15 | `cob:reparar-pendientes` | Operaciones `pendingFiscal`, outbox atascado | Cada 10 min | `operationId` | 10 | Pendiente > 2 h |
| JOB-COB-16 | `cob:qr-masivo-facturas` | `fac.billingRun.issued` (EVT-FAC-05) | Por lote | Obligación + conector | 3 | Obligaciones sin QR |
| JOB-COB-17 | `cob:liquidar-comisiones-cobradores` | Programado / manual | Mensual | Cobrador + período | 3 | — |
| JOB-COB-18 | `cob:procesar-novedades-adhesion` | Archivo de novedades / morosidad | A demanda | Huella | 3 | Líneas rechazadas |
| JOB-COB-19 | `cob:importar-contracargos` | API / archivo del proveedor | Diario | `externalPaymentId` + tipo | 3 | Contracargo recibido |
| JOB-COB-20 | `cob:conciliacion-cobranzas` | Programado | Diario | Ente/caja + fecha | 3 | Diferencias |
| JOB-COB-21 | `cob:escalar-no-identificados` | Programado | Diario | Registro + fecha | 1 | Vencidos |
| JOB-COB-22 | `cob:actualizar-deuda-publicada` | `cob.obligation.settled`, `fac.invoice.annulled` (EVT-FAC-08) | En línea / lote diario | Ente + identificador | 3 | Fallo de actualización |

Cancelación y recuperación comunes: todo job registra su ejecución (inicio, fin, lote, resultado) en la bandeja de procesos de T04; se puede relanzar con los mismos parámetros sin duplicar efectos; un job cancelado deja aplicadas solo las unidades confirmadas (cada unidad en su transacción).

## 10. Pantallas

Patrón común admin (`apps/admin`): `AdminShell`, `AdminStickyHeader` (título, subtítulo, acciones), `ScreenHelp` (qué, quién, cuándo, dónde, por qué, cómo y caso de uso), `DataTable` (columnas configurables, filtros, vistas guardadas, exportación XLSX/CSV/PDF, selección masiva), modales `sm`/`md`/`lg`/`xl`, `ConfirmDialog`, toasts; importes en IBM Plex Mono alineados a la derecha con formato `es-AR`; fechas `dd-mm-yyyy`. Patrón PWA (`apps/pwa`): AppShell, cards de anatomía fija, FAB, 3 skeleton cards, errores inline, cola offline con `clientMutationId`. Estados vacíos con texto del diccionario (`dict:cob.empty.*`) y acción sugerida. Grupo del mapa del sitio: **Cobranzas** (subgrupos Cuenta corriente, Caja, Cobranzas externas, Pasarelas, Conciliación, Configuración).

### PAN-COB-01 — Cuenta corriente del titular
- **App / ruta / capability**: admin · `/cob/cuentas/:currentAccountId` (búsqueda en `/cob/cuentas`) · `cob.cuentas.ver`.
- **Propósito**: ver obligaciones, pagos, saldos a favor, movimientos y estado de la cuenta (BASE §11, §68).
- **Layout**: cabecera con titular, cuentas incluidas, modalidad, saldo total, saldo a favor, mínimo de pago y badges (adhesión a débito, bloqueos, notas, desconectado); pestañas **Obligaciones** · **Movimientos** · **Pagos/recibos** · **Saldos a favor** · **Intenciones de pago** · **Adhesiones** · **Resúmenes** · **Auditoría**.
- **Filtros**: servicio, estado de saldo, período, rango de vencimiento, comprobante, solo vencidas.
- **Columnas (Obligaciones)**: comprobante, servicio, período, emisión, vencimientos (1..N con importe; N según el tope del comprobante, 4 por defecto, DEC-106; antes "1..4"), estado fiscal (pendiente de autorización, DEC-107), importe, saldo, estado, marcas (convenio, notificada, reclamo, bloqueo).
- **Acciones**: cobrar en caja (abre PAN-COB-10), generar link de pago, generar cupón único, emitir resumen, aplicar saldo a favor, bloquear/desbloquear, exportar.
- **Modales**: detalle de obligación (componentes, imputaciones, cotización de recargos a hoy vía M08), detalle de recibo, totales por tipo de comprobante, comprobantes por cuenta.
- **Vacío**: "La cuenta no tiene obligaciones pendientes".
- **INV**: `ConsultaDeuda`, `frmConsultaComprobante`, `frmInfoFactura`, `frmPagosPorComprobante`, `frmCobranza_DetellePagos`, `frmTotalesTipoComprobante`, `frmComprobantePorCuenta`, `ConsultaFacturacionEntidad` (vista por cuenta).

### PAN-COB-02 — Imputaciones y reasignación
- **App / ruta / capability**: admin · `/cob/imputaciones` · `cob.imputaciones.crear`, `cob.imputaciones.reasignar`, `cob.imputaciones.aprobar`.
- **Propósito**: imputar créditos manualmente, revertir y reasignar imputaciones con trazabilidad (RF-COB-031..042).
- **Layout**: buscador de cuenta; dos paneles (créditos disponibles a la izquierda, obligaciones con saldo a la derecha); simulación del motor en el pie.
- **Acciones**: simular, imputar, revertir con motivo, reasignar (revierte + imputa en una transacción), enviar a aprobación cuando supera PRM-COB-033.
- **Modales**: historial de imputaciones de una obligación (política y versión aplicada); aprobación.
- **Vacío**: "No hay créditos disponibles para imputar".
- **INV**: sin equivalente directo (ProCoop editaba `SALDO`); parte de `frmCobranza`.

### PAN-COB-03 — Saldos a favor y anticipos
- **App / ruta / capability**: admin · `/cob/creditos` · `cob.creditos.crear`, `cob.creditos.aplicar`, `cob.creditos.aprobar`.
- **Columnas**: titular, cuenta, origen, fecha, importe, disponible, aplicación automática, aplicar en próxima factura, estado.
- **Acciones**: alta de anticipo (con vencimientos opcionales), aplicar, marcar no automático, solicitar devolución (PAN-COB-26), anular origen.
- **INV**: `frmAnticipo`, tipo `ModoAnticipo`, tablas `ANTICIPOS`, `ANTIFACTU`, `CREDITOS_NOAUTOMATICOS`.

### PAN-COB-04 — Bandeja de cobros no identificados
- **App / ruta / capability**: admin · `/cob/no-identificados` · `cob.noIdentificados.ver`, `cob.noIdentificados.identificar`, `cob.noIdentificados.aplicar`.
- **Filtros**: canal, estado, antigüedad, importe, asignado a.
- **Columnas**: fecha de cobro, canal, importe, datos del pagador (enmascarados), candidatos sugeridos, días, estado, asignado.
- **Acciones**: asignar, identificar (buscar titular y obligaciones, adjuntar evidencia), aplicar (aprobación si supera umbral), pasar a saldo a favor, solicitar devolución, anular con autorización.
- **Vacío**: "No hay cobros pendientes de identificar".
- **INV**: no existe (las líneas con "Comprobante no encontrado" quedaban en el log de `frmResultadoImpEntidades`).

### PAN-COB-05 — Cancelación automática de créditos
- **App / ruta / capability**: admin · `/cob/cancelacion-automatica` · `cob.autoOffset.ejecutar`.
- **Layout**: filtros (servicio, rango de cuentas, fecha), simulación con resultado por cuenta, confirmación masiva, historial de ejecuciones del JOB-COB-10.
- **INV**: `frmCancelacionAutomatica`.

### PAN-COB-06 — Resúmenes de cuenta y cupón único
- **App / ruta / capability**: admin · `/cob/resumenes` · `cob.resumenes.emitir`.
- **Acciones**: emitir a demanda por cuenta o grupo, regenerar, ver PDF, reenviar por canal, generar cupón único con QR y código de barras.
- **Columnas**: número, cuenta, fecha de corte, total, mínimo, cupón, canales, estado.
- **INV**: talón sumado (`TALONFAC` cuota 0) en `frmCobranza`; reportes de resumen de M05.

### PAN-COB-07 — Configuración de cuenta corriente e imputación
- **App / ruta / capability**: admin · `/cob/config/cuenta-corriente` · `cob.politicas.configurar`.
- **Secciones**: modalidad por defecto y excepciones; agrupación unificada; mínimo de pago; políticas de imputación versionadas (estrategia, orden de componentes, validaciones de caja con severidad, remanente, cruce entre servicios); catálogo de causas de ajuste; umbrales.
- **Acciones**: crear borrador, comparar versiones, publicar con vigencia, retirar.
- **INV**: parámetros V2 321, 324, 375, 462, 2263, 2355 en `Configuracion`.

### PAN-COB-08 — Cajas y QR estático
- **App / ruta / capability**: admin · `/cob/config/cajas` · `cob.caja.configurar` (antes `cob.cajas.configurar`).
- **Columnas**: número, nombre, sucursal, tipo, usuario fijo, medios, QR, estado.
- **Acciones**: alta/edición, asociar QR del conector (genera y descarga la imagen para imprimir), desactivar.
- **INV**: `abm_QrEstatico`, `CAJASJP`, `BANCOS.CAJA`.

### PAN-COB-09 — Apertura de caja
- **App / ruta / capability**: admin · `/cob/caja/apertura` · `cob.caja.abrir` (antes `cob.cajas.abrir`).
- **Campos**: caja (si el usuario tiene varias), fecha de negocio (solo hoy, salvo permiso), fondo inicial por moneda.
- **Avisos**: sesiones sin cerrar de días anteriores (bloquea si PRM-COB-070 no lo permite).
- **INV**: `frmAperturaCaja`, `frmSeleccionCaja`.

### PAN-COB-10 — Cobro en ventanilla
- **App / ruta / capability**: admin · `/cob/caja/cobro` · `cob.caja.cobrar` (+ `cobrarParcial`, `cambiarRecargo`, `desmarcarNota`, `cobrarBloqueado`, `donacion` para acciones específicas).
- **Propósito**: cobrar obligaciones, cupones, terceros, donaciones y conceptos de conexión (CU-11).
- **Layout**: barra superior con sesión (caja, cajero, fecha, totales de la sesión); buscador universal (cuenta, documento, nombre, código de barras, identificador de pago, lector); panel de avisos (notas, bloqueos, deuda en otras cuentas, servicio desconectado, notificaciones, saldo a favor); grilla de obligaciones con selección y vencimiento a aplicar; panel lateral de resumen (capital, recargos, intereses, descuentos, total) con detalle de recargo; panel de medios de pago con filas por medio; pie con total, entregado, vuelto y **Confirmar** (atajo F10).
- **Modales**: entrega parcial (importe y motivo); selección de vencimiento; carga de medio (cheque, transferencia, tarjeta con plan y cuotas, retención con certificado); QR del puesto (espera de confirmación); validaciones (errores bloqueantes y advertencias); confirmación de pago; resumen de pagos e impresión; información de recargo (fuente M08); conceptos a cobrar; donaciones; cuotas (vivienda, obra, convenio); mensaje de caja.
- **Accesibilidad**: operación completa por teclado; foco inicial en el buscador.
- **Vacío**: "Buscá una cuenta o leé un código de barras".
- **INV**: `frmCobranza`, `frmEntrega`, `frmSeleccionVencimiento`, `frmCargaMedioDePago`, `frmCobranza_Validaciones`, `frmConfirmarPago`, `frmResumenPagos`, controles `ResumenPago`, `FormasPago`, `AyudaCobranza`, `frmInfoRecargo`, `frmConceptosCobrar`, `frmCobranza_Donaciones`, `frmCobranza_Vivienda`, `frmCobranza_Obra`, `frmDetallecuotas`, `frmMensaje`, `frmCobranzaQrEntidades` (QR en caja), `frmVentaPrepaga` y `frmVentaPrepagaRapida` (solo el cobro; la venta es de M03), tipo `IgnorarVueltoAutomatico`.

### PAN-COB-11 — Anulación de cobranza
- **App / ruta / capability**: admin · `/cob/caja/anulaciones` · `cob.caja.anular`, `cob.caja.anularOtroUsuario`.
- **Layout**: búsqueda por recibo, operación, cuenta o fecha; detalle de la operación con imputaciones y medios; panel de impedimentos (rendición recibida, cheque depositado, cupón presentado, tercero rendido, comprobante fiscal).
- **Acciones**: anular con motivo (aprobación de supervisor si corresponde).
- **INV**: `frmAnulacionOperacion`.

### PAN-COB-12 — Cierre y arqueo
- **App / ruta / capability**: admin · `/cob/caja/cierre` · `cob.caja.cerrar` (antes `cob.cajas.cerrar`), `cob.caja.aprobarDiferencia`, `cob.caja.reabrir`.
- **Layout**: verificación de integridad (semáforo); tabla teórico vs. declarado por medio y moneda; desglose de billetes opcional; diferencias con justificación; lista de cheques, cupones y retenciones a entregar.
- **Acciones**: cerrar, solicitar aprobación, imprimir informe, reabrir (supervisor).
- **INV**: `frmCierreCaja`, `CIERRE`.

### PAN-COB-13 — Rendición a tesorería
- **App / ruta / capability**: admin · `/cob/caja/rendiciones` · `cob.caja.cerrar` (antes `cob.cajas.cerrar`) (entrega), `cob.rendiciones.recibir` (recepción).
- **Columnas**: sesión(es), cajero, fecha, efectivo, cheques, cupones, retenciones, estado.
- **Acciones**: imprimir informe de presentación del cajero, entregar, recibir, rechazar con observación.
- **INV**: `frmInformePresentacionCajero`.

### PAN-COB-14 — Recibos
- **App / ruta / capability**: admin · `/cob/recibos` · `cob.recibos.ver`, `cob.recibos.reimprimir`, `cob.recibos.enviar`.
- **Filtros**: fecha, caja, cajero, canal, cuenta, estado.
- **Acciones**: ver PDF, reimprimir (marca "duplicado"), enviar por correo/WhatsApp, verificar código de validación.
- **INV**: `frmReimpresionRecibos`, `frmImpresiones`.

### PAN-COB-15 — Medios de pago, tarjetas y recargos
- **App / ruta / capability**: admin · `/cob/config/medios` · `cob.medios.configurar`.
- **Pestañas**: medios (catálogo, cuenta contable, datos manuales, vuelto, canales); tarjetas (marca, procesador, comercio, presentación, uso en caja, recargo de caja); planes de cuotas con recargo.
- **INV**: `TIP_VAL`, `TARJETAS`, `TARJETAS_RECARGO`, tipos `MedioPago` (ProMod_Cobranzas).

### PAN-COB-16 — Descuentos en caja
- **App / ruta / capability**: admin · `/cob/config/descuentos` · `cob.descuentos.configurar`.
- **Columnas**: tipo de facturación/servicio, día desde, día hasta, %, producto de bonificación, solo socios, vigencia.
- **Validación**: rangos no superpuestos.
- **INV**: `abm_DescuentoCaja`.

### PAN-COB-17 — Entes recaudadores y layouts
- **App / ruta / capability**: admin · `/cob/config/entes` y `/cob/config/layouts` · `cob.entes.configurar`, `cob.layouts.configurar`.
- **Secciones del ente**: identificación y convenio; caja virtual y cuenta bancaria; layouts (exportación, rendición, control); forma de identificar; reglas de vencimiento, entregas y recargos; comisión; registración bancaria y conciliación automática; transporte (manual, SFTP, API: conexión T06), programación y autoconfirmación; correos de error.
- **Editor de layout**: definición por campos (posición, largo, tipo, formato, expresión), prueba con archivo de muestra (vista previa línea a línea), versionado y publicación.
- **INV**: `abm_Bancos`, `FrmEntidades`, `FrmEntidades_Config`.

### PAN-COB-18 — Archivo de deuda a entes
- **App / ruta / capability**: admin · `/cob/entes/exportaciones` · `cob.entes.exportar`.
- **Layout**: asistente (ente → selección y filtros → vista previa con totales y advertencias de ancho → generar → enviar/descargar); historial de exportaciones; base de deuda SIRO (envío, número de transacción, resultado, confirmar).
- **Columnas (historial)**: ente, fecha, operación, registros, totales por vencimiento, canal, estado.
- **INV**: `frmArchivoEntidadesRecaudadoras`, `frmArchivoEntidadesRecaudadoras_Result`, `ConsultaFacturacionEntidad`, `frmBaseDeudaSiro`, `frmConsultaBaseDeudaSiro`.

### PAN-COB-19 — Importación de rendiciones
- **App / ruta / capability**: admin · `/cob/entes/rendiciones` · `cob.entes.importar`, `cob.entes.confirmar`.
- **Layout**: carga (arrastrar archivo o consultar API por fecha); cabecera validada; tabla de líneas con resultado (ok/advertencia/error), mensajes, obligación resuelta y método, acción propuesta y casilla de selección; totales leídos vs. pie.
- **Acciones**: confirmar seleccionadas, ver archivo original, enviar línea a no identificados, ignorar con motivo, exportar log.
- **INV**: `frmResultadoImpEntidades`, `frmSelectFecha_APISIRO`.

### PAN-COB-20 — Morosidad y novedades de entes
- **App / ruta / capability**: admin · `/cob/entes/novedades` · `cob.debitos.importar`.
- **Acciones**: importar archivo de novedades (altas, bajas, modificaciones) o morosidad; ver resultado por línea; aplicar.
- **INV**: `frmArchivoMorosidad`, `frmArchivoNovedades`.

### PAN-COB-21 — Adhesiones a débito automático
- **App / ruta / capability**: admin · `/cob/debitos/adhesiones` · `cob.debitos.ver`, `cob.debitos.adherir`.
- **Columnas**: cuenta, titular, medio (CBU o tarjeta enmascarados), ente/conector, servicios, desde, estado, rechazos consecutivos.
- **Acciones**: alta (validación de CBU, solicitud de firma), suspender, reactivar, cancelar, exclusiones por tipo de facturación, ver detalle con historial.
- **INV**: `frmPagos360_DebitosAutomaticos`, `frmPagos360_DebitosAutomaticos_Detalle`, `DEBITO_EXCLUSION`.

### PAN-COB-22 — Presentaciones y rechazos de débito
- **App / ruta / capability**: admin · `/cob/debitos/lotes` · `cob.debitos.presentar`, `cob.debitos.importar`.
- **Layout**: lotes por ente y fecha; detalle por ítem (presentado, aceptado, rechazado con código, reintento); importación de resultados.
- **INV**: `frmArchivoDebitosAutomaticos`, `frmArchivosDebitosAutomaticos`.

### PAN-COB-23 — Conectores de pasarelas y canales
- **App / ruta / capability**: admin · `/cob/config/pasarelas` · `cob.pasarelas.configurar`.
- **Layout**: tarjetas por conector con salud (ok, degradado, credencial vencida, caído) y última sincronización; formulario por conector: ambiente, referencia de credencial (T06, nunca el secreto), capacidades, canales, medios y exclusiones, monto mínimo, datos del comercio para QR, caja virtual, ventana de reutilización y conciliación, tarifa de comisión, URL de webhook generada (solo lectura); canales visibles en portal (ícono, orden).
- **Acciones**: probar conexión (T06), activar/desactivar, rotar token de webhook.
- **INV**: `frmPagos360_Config`, `frmSIRO_Config`, `frmMercadoPago_Config`, `frmMacro_Config`, `frmNaranjaX_Config`, `FrmPayFun_Config`, `FrmPagoTic_Config`, `frmSiPago_Config`, `frmHelipagos_Config`, `frmProntoPago_Config`, `FrmProvinciaNet_Config`, `abm_Canales_Pagos`, `FrmRecargoDiarioReversiones`.

### PAN-COB-24 — Intenciones de pago
- **App / ruta / capability**: admin · `/cob/pasarelas/intenciones` · `cob.intenciones.ver`, `cob.intenciones.crear`, `cob.intenciones.cancelar`, `cob.intenciones.reprocesar`.
- **Filtros**: conector, tipo, estado, fecha, cuenta, id externo.
- **Columnas**: número, conector, tipo, cuenta, importe(s), vencimiento, estado, id externo, transacciones, recibo.
- **Acciones**: crear manual (por cuenta u obligaciones), consultar estado en el proveedor, reprocesar imputación, cancelar, ver historial de estados y eventos de webhook, buscar por id externo, generación masiva (SIRO nuevo, QR de facturas) con barra de progreso.
- **INV**: `frmPagos360`, `frmPagos360_BuscarPagos`, `frmPagos360_Info`, `frmPagos360_Pagos`, `frmPagos360_Progress`, `frmPagos360_SearchId`, `frmPagos360_NuevoSiro`, `frmCobranza_Pagos360`, `frmCobranza_WebPagos360`, control `WebPagos360`, `frmCobranzaCoopOnline`, `frmProvinciaNetConsultaQrLote`.

### PAN-COB-25 — Link de pago
- **App / ruta / capability**: admin (y CRM) · modal desde PAN-COB-01 o `/cob/pasarelas/links` · `cob.links.crear`.
- **Campos**: obligaciones o cupón, conector, vencimiento del link, canal de envío (WhatsApp, correo, SMS, copiar), destinatario.
- **INV**: `frmCobranza_LinkPagos360`.

### PAN-COB-26 — Devoluciones y contracargos
- **App / ruta / capability**: admin · `/cob/devoluciones` y `/cob/contracargos` · `cob.devoluciones.solicitar`, `cob.devoluciones.aprobar`, `cob.devoluciones.ejecutar`, `cob.contracargos.gestionar`.
- **Layout**: expedientes con estado, importe, origen, destino, workflow (pasos y aprobadores), ejecución; contracargos con transacción, cuentas bloqueadas, cargos generados, evidencia, resultado de disputa.
- **INV**: no existe (RN-13 §3.6); `FrmRecargoDiarioReversiones` aporta la configuración de cargos.

### PAN-COB-27 — Conciliación de cobranzas
- **App / ruta / capability**: admin · `/cob/conciliacion` · `cob.conciliacion.ver`, `cob.conciliacion.conciliar`, `cob.conciliacion.cerrar`.
- **Layout**: tablero por día y canal (bruto, comisión, IVA, retenciones, neto esperado, acreditado, diferencia, estado); detalle por ítem con emparejamiento; excepciones vinculadas.
- **Acciones**: emparejar manualmente, comentar, cerrar el día (acta PDF).
- **INV**: no existe como tal (controles de pie en `frmResultadoImpEntidades`).

### PAN-COB-28 — Cobradores y listas de cobro
- **App / ruta / capability**: admin · `/cob/cobradores` · `cob.cobradores.gestionar`.
- **Pestañas**: cobradores (zonas, límites, medios, comisión, dispositivos); listas de cobro (generar, asignar, seguimiento); rendiciones de cobradores; liquidación de comisiones.
- **INV**: no existe (MER-007).

### PAN-COB-29 — PWA del cobrador
- **App / ruta / capability**: pwa (rol cobrador) · `/cobrador` · `cob.cobranzaCampo.ver`, `cob.cobranzaCampo.cobrar`, `cob.cobradores.rendir`.
- **Layout**: lista del día en cards (titular, domicilio, importe, estado), mapa opcional, ficha con obligaciones; FAB "Cobrar"; recibo provisorio compartible; indicador de sincronización y cola pendiente; resumen de efectivo en mano vs. límite.
- **Offline**: lista cifrada en IndexedDB; cobros en cola con `clientMutationId`.
- **INV**: no existe.

### PAN-COB-30 — Cobro por cuenta de terceros
- **App / ruta / capability**: admin · `/cob/config/terceros` (ABM) y acción en PAN-COB-10 · `cob.terceros.configurar`, `cob.caja.cobrar`.
- **INV**: `abm_Terceros`, `frmCobranzaTerceros`.

### PAN-COB-31 — Bloqueos de cobro
- **App / ruta / capability**: admin · `/cob/bloqueos` · `cob.bloqueos.gestionar`.
- **Acciones**: bloqueo/desbloqueo individual o masivo por filtro (servicio, período, cuentas), motivo y vencimiento del bloqueo.
- **INV**: `frmBloqueoMasivoFacturas`.

### PAN-COB-32 — Importación de obligaciones externas
- **App / ruta / capability**: admin · `/cob/importaciones` · `cob.imputaciones.crear` (con `cob.cuentas.importar`).
- **Layout**: `ExcelImportWizard` (subir → vista previa con errores → confirmar) por formato (general, administración pública, comprobante ProCoop); consulta de lo importado.
- **INV**: `frmCobranza_ImportarFacturas`, `frmComprobantesAdministracionPublicaRAWConsulta`.

### PAN-COB-33 — Cheques recibidos
- **App / ruta / capability**: admin · `/cob/valores` · `cob.caja.ver`.
- **Columnas**: banco, número, fecha, librador, importe, recibo, caja, estado (en caja, entregado, en cartera M14, rechazado).
- **INV**: `frmCobranza_ConsultaCheques`.

### PAN-COB-34 — Bandeja de excepciones de cobranza
- **App / ruta / capability**: admin · `/cob/excepciones` · `cob.excepciones.resolver`.
- **Filtros**: tipo, severidad, estado, asignado, antigüedad.
- **Acciones**: asignar, abrir el origen, resolver con nota, descartar con motivo, reprocesar.
- **INV**: no existe.

### PAN-COB-35 — Mi cuenta y pagar (socio)
- **App / ruta / capability**: pwa (rol socio) y landing · `/mi-cuenta`, `/mi-cuenta/pagar`, `/pagar/:paymentReference` (público sin login con datos mínimos) · `cob.miCuenta.ver`, `cob.miCuenta.pagar`, `cob.miCuenta.adherirDebito`, `cob.miCuenta.informarTransferencia`.
- **Layout**: card de saldo total y próximo vencimiento; lista de obligaciones por servicio; selección y "Pagar" con canales disponibles (ícono, nombre); estado del pago (pendiente, en verificación, pagado); recibos descargables; adhesión a débito; informar transferencia (comprobante adjunto → no identificado asignado).
- **Público**: muestra solo importe, vencimiento y servicio; nunca datos personales completos.
- **INV**: `AutoGestion` (pago de facturas), `ProcoopNet` (consulta de deuda).

### PAN-COB-36 — Reportes de cobranza
- **App / ruta / capability**: admin · `/cob/reportes` · `cob.reportes.ver`, `cob.reportes.exportar`.
- **Contenido**: catálogo de la sección 15 con filtros comunes (fecha, caja, canal, servicio, sucursal) y esquemas de informe.
- **INV**: `ESQUEMAS_INFORMES_COBRANZAS`; reportes de cobranza de ProMod_Cobranzas.

### 10.37 Formularios de ProMod_Cobranzas delegados a otros módulos

| Formulario ProCoop | Módulo destino | Motivo |
|---|---|---|
| `abm_Moratas`, `abm_TabMora` | M08 | Tasas y tablas de mora. |
| `frmCambioGarante` | M08 | Garantías de convenios. |
| `frmPrescripcionDeuda`, `frmPrescripcionDeuda_Confirmar` | M08 | Prescripción. |
| `frmReconstruccion_Cuotas`, `frmAgregarDeudaCuotas` | M08 | Convenios y cuotas. |
| `frmPagosDesconectados` | M08 | Reconexión por pago. |
| `frmConfiguracionPrepaga`, `frmConfiguracionPrepaga_TipoFac` | M03 | Configuración prepaga (el cobro usa PAN-COB-10). |
| `frmVentaPrepaga`, `frmVentaPrepagaRapida` | M03 (venta) + COB (cobro) | La venta y el token son de M03. |

## 11. API

Convenciones: listados paginados `{ items, total, page, size }`; errores RFC 9457 con `requestId` y código `cob.<area>.<motivo>`; validación Zod compartida; toda operación económica o de integración exige `Idempotency-Key` (misma clave + mismo cuerpo → misma respuesta; misma clave + otro cuerpo → 422 `cob.idempotencia.conflicto`). Errores específicos: 409 `cob.caja.sesionCerrada`, 409 `cob.obligacion.saldoCambiado` (control optimista), 422 `cob.imputacion.reglaIncumplida`, 422 `cob.integridad.mediosNoCuadran`, 409 `cob.rendicion.duplicada`, 423 `cob.obligacion.bloqueada`, 409 `cob.anulacion.impedida`.

### 11.1 Cuenta corriente e imputación (admin)

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-COB-01 | GET | `/api/admin/cob/current-accounts` | `cob.cuentas.ver` | Buscar cuentas corrientes (titular, documento, cuenta, código, identificador de pago). | Sí (lectura) |
| API-COB-02 | GET | `/api/admin/cob/current-accounts/{id}` | `cob.cuentas.ver` | Cabecera con saldos, mínimo, badges. | Sí |
| API-COB-03 | GET | `/api/admin/cob/current-accounts/{id}/obligations` | `cob.cuentas.ver` | Obligaciones con filtros. | Sí |
| API-COB-04 | GET | `/api/admin/cob/current-accounts/{id}/ledger` | `cob.cuentas.ver` | Movimientos con saldo acumulado a una fecha. | Sí |
| API-COB-05 | GET | `/api/admin/cob/obligations/{id}` | `cob.cuentas.ver` | Detalle con componentes, imputaciones y cotización M08 a una fecha. | Sí |
| API-COB-06 | POST | `/api/admin/cob/allocations/simulate` | `cob.imputaciones.crear` | Simulación del motor (`dryRun`). | Sí (sin efectos) |
| API-COB-07 | POST | `/api/admin/cob/allocations` | `cob.imputaciones.crear` | Imputación manual de un crédito. | Sí (`Idempotency-Key`) |
| API-COB-08 | POST | `/api/admin/cob/allocations/{id}/reverse` | `cob.imputaciones.reasignar` | Reverso con motivo. | Sí |
| API-COB-09 | POST | `/api/admin/cob/allocations/reassign` | `cob.imputaciones.reasignar` | Reasignación (reverso + imputación) con aprobación si supera umbral. | Sí |
| API-COB-10 | POST | `/api/admin/cob/allocations/approvals/{id}/decision` | `cob.imputaciones.aprobar` | Aprobar o rechazar. | Sí |
| API-COB-11 | GET / POST | `/api/admin/cob/credit-balances` | `cob.creditos.crear` | Listar y crear anticipos o saldos a favor. | POST sí |
| API-COB-12 | POST | `/api/admin/cob/credit-balances/{id}/apply` | `cob.creditos.aplicar` | Aplicar saldo a obligaciones. | Sí |
| API-COB-13 | PATCH | `/api/admin/cob/credit-balances/{id}` | `cob.creditos.aprobar` | Cambiar aplicación automática / próxima factura. | Sí (versión) |
| API-COB-14 | POST | `/api/admin/cob/auto-offset/runs` | `cob.autoOffset.ejecutar` | Simular o ejecutar cancelación automática. | Sí |
| API-COB-15 | GET | `/api/admin/cob/unidentified-receipts` | `cob.noIdentificados.ver` | Bandeja. | Sí |
| API-COB-16 | POST | `/api/admin/cob/unidentified-receipts/{id}/identify` | `cob.noIdentificados.identificar` | Identificar titular y obligaciones con evidencia. | Sí |
| API-COB-17 | POST | `/api/admin/cob/unidentified-receipts/{id}/apply` | `cob.noIdentificados.aplicar` | Aplicar (genera recibo). | Sí |
| API-COB-18 | POST | `/api/admin/cob/unidentified-receipts/{id}/to-credit` | `cob.noIdentificados.aplicar` | Pasar a saldo a favor. | Sí |
| API-COB-19 | POST | `/api/admin/cob/adjustments` | `cob.ajustes.aprobar` | Ajuste de redondeo o causa catalogada (no fiscal). | Sí |
| API-COB-20 | GET / POST | `/api/admin/cob/statements` | `cob.resumenes.emitir` | Listar y emitir resúmenes. | POST sí |
| API-COB-21 | POST | `/api/admin/cob/payment-coupons` | `cob.resumenes.emitir` | Generar cupón único. | Sí |
| API-COB-22 | POST | `/api/admin/cob/collection-blocks` | `cob.bloqueos.gestionar` | Bloqueo/desbloqueo individual o masivo. | Sí |
| API-COB-23 | POST | `/api/admin/cob/external-obligation-imports` | `cob.cuentas.importar` | Importar obligaciones externas (vista previa y confirmación). | Sí |
| API-COB-24 | GET / PUT | `/api/admin/cob/allocation-policies[/{id}]` | `cob.politicas.configurar` | Políticas versionadas (borrador, publicar). | PUT sí |
| API-COB-25 | GET | `/api/admin/cob/integrity-checks` | `cob.integridad.ver` | Resultados de JOB-COB-14; POST lanza verificación. | Sí |

### 11.2 Caja

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-COB-26 | GET / POST / PATCH | `/api/admin/cob/cash-registers` | `cob.caja.configurar` (antes `cob.cajas.configurar`) | ABM de cajas y QR estático. | POST/PATCH sí |
| API-COB-27 | POST | `/api/admin/cob/cash-sessions` | `cob.caja.abrir` (antes `cob.cajas.abrir`) | Abrir sesión. | Sí |
| API-COB-28 | GET | `/api/admin/cob/cash-sessions/current` | `cob.caja.cobrar` | Sesión abierta del usuario. | Sí |
| API-COB-29 | POST | `/api/admin/cob/cash-sessions/{id}/close-preview` | `cob.caja.cerrar` (antes `cob.cajas.cerrar`) | Teórico e integridad. | Sí |
| API-COB-30 | POST | `/api/admin/cob/cash-sessions/{id}/close` | `cob.caja.cerrar` (antes `cob.cajas.cerrar`) | Cerrar con declaración y justificaciones. | Sí |
| API-COB-31 | POST | `/api/admin/cob/cash-sessions/{id}/differences/{diffId}/approve` | `cob.caja.aprobarDiferencia` | Aprobar diferencia. | Sí |
| API-COB-32 | POST | `/api/admin/cob/cash-sessions/{id}/reopen` | `cob.caja.reabrir` | Reabrir. | Sí |
| API-COB-33 | POST | `/api/admin/cob/cash-operations/quote` | `cob.caja.cobrar` | Cotizar cobro (motor + M08 + recargos por medio + descuentos + vuelto). | Sí (sin efectos) |
| API-COB-34 | POST | `/api/admin/cob/cash-operations` | `cob.caja.cobrar` | Confirmar cobro (operación, recibos, imputaciones, medios). | Sí (`Idempotency-Key` obligatorio) |
| API-COB-35 | POST | `/api/admin/cob/cash-operations/manual` | `cob.caja.egresar` | Ingreso/egreso manual, donación, pago a proveedor. | Sí |
| API-COB-36 | POST | `/api/admin/cob/cash-operations/{id}/void` | `cob.caja.anular` | Anular (supervisor si corresponde). | Sí |
| API-COB-37 | POST | `/api/admin/cob/cash-qr/{cashRegisterId}/charge` | `cob.qr.cobrar` | Cargar importe en el QR del puesto y esperar confirmación. | Sí |
| API-COB-38 | GET | `/api/admin/cob/receipts` | `cob.recibos.ver` | Listar recibos. | Sí |
| API-COB-39 | GET | `/api/admin/cob/receipts/{id}/pdf` | `cob.recibos.ver` | URL firmada del PDF (marca duplicado en reimpresión). | Sí |
| API-COB-40 | POST | `/api/admin/cob/receipts/{id}/send` | `cob.recibos.enviar` | Enviar por el motor de comunicaciones de T09 (`com.communications.emit`; antes "canal M10"). | Sí |
| API-COB-41 | GET / POST | `/api/admin/cob/treasury-handovers` | `cob.caja.cerrar` (antes `cob.cajas.cerrar`) / `cob.rendiciones.recibir` | Rendiciones; POST `/{id}/receive` y `/{id}/reject`. | Sí |
| API-COB-92 | GET | `/api/admin/cob/cash-sessions/unremitted?asOf=&branchId=&legalEntityId=` | `cob.caja.ver` | Sesiones de caja sin rendir con saldo por medio y moneda y antigüedad; misma respuesta que el servicio interno `cob.service.getUnremittedCash` (RF-COB-195) que usa M14 para la posición diaria (DEC-101). | Sí (lectura) |
| API-COB-42 | GET / PUT | `/api/admin/cob/payment-methods`, `/card-plans`, `/cash-discount-rules` | `cob.medios.configurar`, `cob.descuentos.configurar` | Configuración de medios, tarjetas y descuentos. | PUT sí |
| API-COB-43 | GET | `/api/admin/cob/tenders/cheques` | `cob.caja.ver` | Cheques recibidos. | Sí |
| API-COB-44 | GET / PUT | `/api/admin/cob/third-party-billers` | `cob.terceros.configurar` | Terceros. | PUT sí |
| API-COB-45 | POST | `/api/admin/cob/third-party-collections/parse` | `cob.caja.cobrar` | Leer código de barras del tercero y validar. | Sí |

### 11.3 Entes y débito automático

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-COB-46 | GET / PUT | `/api/admin/cob/collection-agencies` | `cob.entes.configurar` | ABM de entes. | PUT sí |
| API-COB-47 | GET / PUT | `/api/admin/cob/file-layouts` | `cob.layouts.configurar` | Layouts versionados; POST `/{id}/test` prueba con archivo. | Sí |
| API-COB-48 | POST | `/api/admin/cob/agency-debt-exports/preview` | `cob.entes.exportar` | Vista previa de exportación. | Sí (sin efectos) |
| API-COB-49 | POST | `/api/admin/cob/agency-debt-exports` | `cob.entes.exportar` | Generar y enviar/descargar. | Sí |
| API-COB-50 | POST | `/api/admin/cob/agency-debt-exports/{id}/confirm` | `cob.entes.exportar` | Confirmar base de deuda SIRO por API. | Sí |
| API-COB-51 | POST | `/api/admin/cob/agency-settlements` | `cob.entes.importar` | Subir rendición o consultar API por fecha. | Sí (huella) |
| API-COB-52 | GET | `/api/admin/cob/agency-settlements/{id}/lines` | `cob.entes.importar` | Líneas con resultado. | Sí |
| API-COB-53 | POST | `/api/admin/cob/agency-settlements/{id}/confirm` | `cob.entes.confirmar` | Confirmar líneas seleccionadas. | Sí (por línea) |
| API-COB-54 | POST | `/api/admin/cob/agency-novelty-files` | `cob.debitos.importar` | Novedades y morosidad. | Sí (huella) |
| API-COB-55 | GET / POST / PATCH | `/api/admin/cob/direct-debit-mandates` | `cob.debitos.adherir` | Adhesiones (alta, suspensión, cancelación, exclusiones). El operador nunca carga datos de tarjeta: para tarjeta por pasarela genera la sesión del proveedor y la envía al socio como link; para procesadora por archivo registra el número de adherente informado por la procesadora (DEC-091). | Sí |
| API-COB-56 | POST | `/api/admin/cob/direct-debit-batches` | `cob.debitos.presentar` | Generar/presentar lote. | Sí |
| API-COB-57 | POST | `/api/admin/cob/direct-debit-batches/{id}/results` | `cob.debitos.importar` | Importar resultados y rechazos. | Sí |

### 11.4 Pasarelas, devoluciones, conciliación, cobradores, excepciones

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-COB-58 | GET / PUT | `/api/admin/cob/gateway-connectors` | `cob.pasarelas.configurar` | Conectores (sin secretos); POST `/{id}/test`. | Sí |
| API-COB-59 | GET / PUT | `/api/admin/cob/payment-channels` | `cob.pasarelas.configurar` | Canales visibles. | Sí |
| API-COB-60 | GET | `/api/admin/cob/payment-intents` | `cob.intenciones.ver` | Listar intenciones. | Sí |
| API-COB-61 | POST | `/api/admin/cob/payment-intents` | `cob.intenciones.crear` / `cob.links.crear` | Crear intención o link (reutiliza dentro de la ventana). | Sí |
| API-COB-62 | POST | `/api/admin/cob/payment-intents/{id}/refresh` | `cob.intenciones.reprocesar` | Reconsultar al proveedor y reprocesar. | Sí |
| API-COB-63 | POST | `/api/admin/cob/payment-intents/{id}/cancel` | `cob.intenciones.cancelar` | Cancelar. | Sí |
| API-COB-64 | POST | `/api/admin/cob/payment-intents/{id}/share` | `cob.links.crear` | Enviar link por WhatsApp/correo/SMS. | Sí |
| API-COB-65 | POST | `/api/admin/cob/payment-intents/bulk` | `cob.intenciones.crear` | Generación masiva (QR de facturas, SIRO). | Sí (por obligación) |
| API-COB-66 | GET / POST | `/api/admin/cob/refund-cases` | `cob.devoluciones.solicitar` | Expedientes. | Sí |
| API-COB-67 | POST | `/api/admin/cob/refund-cases/{id}/decision` | `cob.devoluciones.aprobar` | Aprobar/rechazar (segregación). | Sí |
| API-COB-68 | POST | `/api/admin/cob/refund-cases/{id}/execute` | `cob.devoluciones.ejecutar` | Ejecutar. | Sí (`Idempotency-Key` obligatorio) |
| API-COB-69 | GET / PATCH | `/api/admin/cob/chargebacks` | `cob.contracargos.gestionar` | Contracargos y disputa. | Sí |
| API-COB-70 | GET | `/api/admin/cob/reconciliations` | `cob.conciliacion.ver` | Tablero por día y canal. | Sí |
| API-COB-71 | POST | `/api/admin/cob/reconciliations/{id}/match` | `cob.conciliacion.conciliar` | Emparejar ítems. | Sí |
| API-COB-72 | POST | `/api/admin/cob/reconciliations/{id}/close` | `cob.conciliacion.cerrar` | Cerrar con acta. | Sí |
| API-COB-73 | GET / PUT | `/api/admin/cob/collectors` | `cob.cobradores.gestionar` | Cobradores. | Sí |
| API-COB-74 | POST | `/api/admin/cob/collection-rounds` | `cob.cobradores.gestionar` | Generar/asignar listas. | Sí |
| API-COB-75 | GET / PATCH | `/api/admin/cob/exceptions` | `cob.excepciones.resolver` | Bandeja de excepciones. | Sí |
| API-COB-76 | GET | `/api/admin/cob/reports/{reportCode}` | `cob.reportes.ver` | Reporte; `?format=xlsx\|csv\|pdf` exige `cob.reportes.exportar`. | Sí |

### 11.5 PWA (socio y cobrador), público y externos

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-COB-77 | GET | `/api/cob/my/accounts` | `cob.miCuenta.ver` | Cuentas autorizadas y saldos. | Sí |
| API-COB-78 | GET | `/api/cob/my/accounts/{id}/obligations` | `cob.miCuenta.ver` | Obligaciones y recibos. | Sí |
| API-COB-79 | POST | `/api/cob/my/payment-intents` | `cob.miCuenta.pagar` | Iniciar pago. | Sí |
| API-COB-80 | GET | `/api/cob/my/payment-intents/{id}` | `cob.miCuenta.pagar` | Estado del pago. | Sí |
| API-COB-81 | POST | `/api/cob/my/direct-debit-mandates` | `cob.miCuenta.adherirDebito` | Adhesión del socio. Con CBU recibe el CBU y el CUIT del titular. Con tarjeta recibe solo cuenta, servicios y conector, crea la adhesión en `pendingSignature` y devuelve la sesión del componente del proveedor (`{ mode: hostedFields\|redirect, redirectUrl \| sdkInit }`); la adhesión pasa a `active` cuando el proveedor la confirma por webhook y reconsulta. Nunca recibe datos de tarjeta (DEC-091). | Sí |
| API-COB-82 | POST | `/api/cob/my/transfer-notices` | `cob.miCuenta.informarTransferencia` | Informar transferencia con comprobante. | Sí |
| API-COB-83 | GET | `/api/cob/collector/rounds` | `cob.cobranzaCampo.ver` | Listas asignadas (descarga offline). | Sí |
| API-COB-84 | POST | `/api/cob/collector/collections/sync` | `cob.cobranzaCampo.cobrar` | Sincronizar cola offline (`clientMutationId` por ítem). | Sí |
| API-COB-85 | POST | `/api/cob/collector/settlements` | `cob.cobradores.rendir` | Rendición del cobrador. | Sí |
| API-COB-86 | GET | `/api/public/{tenantSlug}/cob/payment-references/{code}` | `public: true` (sin capability, RF-IAM-061; rate limit; antes "Público (rate limit)") | Datos mínimos para pagar sin login. | Sí |
| API-COB-87 | POST | `/api/public/{tenantSlug}/cob/payment-references/{code}/intents` | `public: true` (sin capability, RF-IAM-061; rate limit + captcha; antes "Público (rate limit + captcha)") | Iniciar pago sin login. | Sí |
| API-COB-88 | GET | `/api/public/{tenantSlug}/cob/receipts/verify/{validationCode}` | `public: true` (sin capability, RF-IAM-061; antes "Público") | Verificar recibo (QR). | Sí |
| API-COB-89 | POST | `/api/v1/ext/cob/webhooks/{connector}/{tenantSlug}` | `cob.webhooks.recibir` (token/firma) | Webhook de pasarela: registra, deduplica y responde 200. | Sí (`dedupeKey`) |
| API-COB-90 | POST | `/api/v1/ext/cob/settlements/{agencyCode}` | `cob.rendiciones.ingestar` | Ingesta de rendición por API de un ente o agregador. | Sí (huella) |
| API-COB-91 | GET | `/api/v1/ext/cob/debts` | `cob.rendiciones.ingestar` | Consulta de deuda en línea para redes que la soporten (Red Link en línea, Banelco). | Sí |

## 12. Eventos y jobs

### 12.1 Eventos publicados (outbox)

| EVT-ID | Evento | Disparador | Datos principales | Consumidores |
|---|---|---|---|---|
| EVT-COB-01 | `cob.obligation.registered` | P-COB-01 | `obligationId`, `currentAccountId`, `serviceId`, `dueSchedule[]` (antes: "obligación, cuenta, servicio, vencimientos") | COB (publicación a entes), M19 |
| EVT-COB-02 | `cob.obligation.settled` | Saldo llega a 0 | `obligationId`, `settledAt`, `channel` (antes: "obligación, fecha, canal") | M08 (reconexión, instancias), M05, COB (deuda publicada), T09 (cancela recordatorios; antes M10) |
| EVT-COB-03 | `cob.obligation.reopened` | Reverso que reabre saldo | `obligationId`, `cause` (antes: "obligación, causa") | M08, COB |
| EVT-COB-04 | `cob.payment.confirmed` | Cobro confirmado (cualquier canal) | `cashOperationId`, `receipts[]` (`{ receiptId, legalEntityId }`; uno por entidad, RF-COB-193), `allocations[]` (`{ allocationId, obligationId, component, itemClass, amount }`; RN-COB-157), `channel`, `tendersByReceipt[]` (`{ receiptId, method, amount }`), `paymentDate`, `legalEntityId` (de la caja) (antes: "operación, recibos, imputaciones por componente, canal, medios por recibo, fecha de cobro, `legalEntityId` de la caja") | M15 (asiento por entidad), M08, T09 (aviso; antes M10), M19, M14 (caja virtual) |
| EVT-COB-05 | `cob.receipt.voided` | Anulación | `receiptId`, `reversedAllocationIds[]` (antes: "recibo, reversos") | M15, M08, M05 (anular recargos facturados) |
| EVT-COB-06 | `cob.allocation.reversed` | Reverso / reasignación | `allocationIds[]` (antes: "imputaciones") | M15, M08 |
| EVT-COB-07 | `cob.surcharge.deferred` | Recargo diferido | `obligationId`, `components[]`, `paymentDate` (antes: "obligación, componentes, fecha de cobro") | M08 (ND de intereses diferidos) |
| EVT-COB-08 | `cob.minimumPayment.evaluated` | Evaluación del mínimo | `currentAccountId`, `minimumPayment`, `paidAmount`, `fulfilled` (antes: "cuenta, mínimo, pagado, cumplido") | M08 |
| EVT-COB-09 | `cob.creditBalance.created` / `.consumed` | Saldos a favor | `creditBalanceId`, `origin` (antes: "saldo, origen") | M15, M05 (próxima factura) |
| EVT-COB-10 | `cob.retention.received` | Retención sufrida en cobro | `certificateNumber`, `regime`, `amount` (antes: "certificado, régimen, importe") | M06 |
| EVT-COB-11 | `cob.settlement.expected` | Confirmación de rendición / débito / pasarela | `channel`, `netAmount`, `feeAmount`, `expectedCreditDate`, `treasuryAccountId` (antes: "canal, neto, comisión, fecha y cuenta de acreditación") | M14 |
| EVT-COB-12 | `cob.cashSession.closed` | Cierre de caja | `cashSessionId` (antes `sessionId`; nombre canónico de T05 §7.2), `expected[]`, `declared[]`, `differences[]` (antes: "sesión, teórico, declarado, diferencias") | M14, M15 |
| EVT-COB-13 | `cob.treasuryHandover.delivered` | Rendición entregada | `treasuryHandoverId`, `legalEntityId`, sesiones o rendición de cobrador, contenido por medio y moneda | M14 (crea `cashRemittances` con `treasuryHandoverId`, CTR-DAT-64) |
| EVT-COB-14 | `cob.cashDifference.recorded` | Quebranto o sobrante | `cashSessionId` (antes `sessionId`; nombre canónico de T05 §7.2), `amount` (antes: "sesión, importe") | M15 |
| EVT-COB-15 | `cob.agencyFee.recorded` | Comisión de ente o pasarela | `channel`, `grossFee`, `feeVat` (antes: "canal, bruto, IVA") | M15, M14 |
| EVT-COB-16 | `cob.directDebit.rejected` | Rechazo de débito | `obligationId`, `rejectCode`, `definitive` (antes: "obligación, código, definitivo") | T09 (aviso; antes M10), M08 |
| EVT-COB-17 | `cob.directDebitMandate.changed` | Alta/baja/suspensión | `directDebitMandateId` (antes: "adhesión") | M05 (leyenda en factura), T09 (aviso; antes M10) |
| EVT-COB-18 | `cob.chargeback.applied` | Contracargo aplicado | `gatewayTransactionId` (antes `transactionId`; nombre canónico de T05 §7.2), `currentAccountIds[]` (antes: "transacción, cuentas") | M08 (cargos), M15, T09 (aviso; antes M10) |
| EVT-COB-19 | `cob.refund.executed` | Devolución ejecutada | `refundCaseId` (antes: "expediente") | M14, M15, M09 |
| EVT-COB-20 | `cob.paymentIntent.statusChanged` | Cambio de estado | `paymentIntentId`, `status` (antes: "intención") | M19, T09 (aviso del link; antes M10) |
| EVT-COB-21 | `cob.thirdPartyCollection.recorded` | Cobro de tercero | `thirdPartyBillerId`, `amount`, `fee` (antes: "tercero, importe, comisión") | M14, M15 |
| EVT-COB-22 | `cob.exception.opened` | Nueva excepción | `collectionExceptionId`, `type`, `severity` (antes: "tipo, severidad") | T09 (alertas) |
| EVT-COB-23 | `cob.audit.*` | Acciones sensibles (cambio de recargo, desmarcar nota, anulación, reapertura) | `actorId`, `before`, `after` (antes: "actor, antes/después") | T02 |
| EVT-COB-24 | `cob.payment.informed` | El socio o un canal informa un pago a verificar (comprobante subido, transferencia sin conciliar) | `informedOperationRef`, `currentAccountId`, `amount`, `channel`, `evidenceStoredFileIds[]` (antes: "operación informada, cuenta, importe, canal, evidencia") | M08 (suspende acciones de mora mientras se verifica), M19 |
| EVT-COB-25 | `cob.cashSession.reopened` | Reapertura de una sesión de caja cerrada | `cashSessionId` (antes `sessionId`; nombre canónico de T05 §7.2), `reason`, `authorizedBy` (antes: "sesión, motivo, autorizante") | M14 (anula la rendición no aceptada) |
| EVT-COB-26 | `cob.unidentified.resolved` | Un cobro no identificado se asigna a una cuenta | `unidentifiedReceiptId`, `currentAccountId`, `cashOperationId` (antes: "cobro no identificado, cuenta, operación de cobro resultante") | M14 (concilia el crédito con el cobro) |
| EVT-COB-27 | `cob.refund.approved` | Reintegro al socio aprobado (deriva de `wfl.operation.approved` con `typeCode = cob.refund.execute`) | `refundCaseId`, `currentAccountId`, `amount`, `paymentMethod` (antes: "reintegro, cuenta, importe, medio de pago") | M14 (crea la ejecución de reintegro), T06 (reintegro por pasarela) |
| EVT-COB-28 | `cob.paymentIntent.requested` | Intención creada en `draft` que debe emitirse en el proveedor (portal, caja, CRM, generación masiva; §8.4) | `paymentIntentId`, `gatewayConnectorId`, `currentAccountId`, `amount`, `expiresAt` | T06 (crea la intención en la pasarela con `createPaymentIntent`; responde `int.paymentIntent.created`, EVT-INT-08) |
| EVT-COB-29 | `cob.debtPublication.requested` | Exportación de deuda en `generated` con entrega por conector (§7.22, §8.6) | `agencyDebtExportId`, `agencyId`, `operation`, `period` | T06 (aplica el layout y entrega al ente; responde `int.debtPublication.acknowledged` / `int.debtPublication.rejected`, EVT-INT-09) |
| EVT-COB-30 | `cob.directDebit.batchRequested` | Lote de débito armado que pasa a presentación (`draft` → `presented`, §8.8) | `directDebitBatchId`, `agencyId` o `connectorId`, `exportId`, `debitDate` | T06 (presenta el lote al ente o conector; responde `int.directDebit.resultReceived`, EVT-INT-11) |

### 12.2 Eventos consumidos

| Evento | Productor | Efecto en COB |
|---|---|---|
| `fac.invoice.issued`, `fac.debitNote.issued`, `fac.billingRun.issued` (EVT-FAC-07/11/05) | M05 | Registrar obligaciones (P-COB-01), QR masivo, resúmenes. |
| `fac.creditNote.issued` | M05 | Saldo a favor o imputación a la obligación referenciada. |
| `fac.invoice.annulled` (EVT-FAC-08) | M05 | Obligación `voided` o excepción. |
| `fac.invoice.returnedToDraft` (EVT-FAC-22) | M05 | `fiscalGate = released`: la obligación no se publica ni se cobra hasta la reemisión (RN-COB-158; DEC-107). |
| `fac.invoice.renumbered` (EVT-FAC-23) | M05 | Actualiza `sourceDocument.number` de la obligación no autorizada (DEC-107). |
| `fac.invoice.dueDatesChanged` (EVT-FAC-13) | M05 | Actualiza `dueSchedule` de las obligaciones del comprobante. Con `reason = lateAuthorization` (M05 RN-FAC-165) las fechas ya se corrieron al habilitar `fiscalGate` y el evento no las vuelve a correr; si llega antes de `fis.invoice.authorized`, se guarda y se aplica al habilitar la compuerta (RN-COB-158 punto 3; DEC-107, 10-11-2026). |
| `fis.invoice.authorized` / `fis.authorization.rejected` (EVT-FIS-01/02) | M06 | Completar operaciones `pendingFiscal`. Con `fis.invoice.authorized`, además, pasar `fiscalGate` a `authorized`, registrar el débito del auxiliar y habilitar cobro, identificador de pago y publicación a entes (RN-COB-158; DEC-107). Un rechazo solo se registra; la obligación espera la decisión de M05 (EVT-FAC-22). |
| `mor.interest.settled` / `mor.deferredInterest.created` (EVT-MOR-02/03) | M08 | Obligación de interés, reversión o reconexión. |
| `mor.agreement.created` / `.annulled` (EVT-MOR-14) | M08 | Marca `lifecycle.agreementId`; obligaciones de cuotas. |
| `mor.writeOff.approved` (EVT-MOR-18) / `mor.prescription.executed` (EVT-MOR-19) | M08 | Marca de ciclo de vida e imputación tipo `writeOff`. Los plazos de prescripción (24 meses para facturas periódicas, 60 para el resto, con validación legal) los define M08 en `prescriptionRules` (DEC-052); M07 no calcula prescripción. |
| `mor.guarantee.refunded` (EVT-MOR-16) con `refundMode = accountCredit` | M08 | Saldo a favor con `origin = guaranteeRefund` (RF-COB-190; HUECO-OTR-04). |
| `tes.gatewayCredit.reconciled` / `tes.statementLine.unidentified` (EVT-TES-07/06) | M14 | Conciliación de cobranzas; no identificados. |
| `tes.cashRemittance.accepted` (EVT-TES-08) | M14 | Sesión `handedOver`; completa `receivedBy`/`receivedAt` de la entrega indicada por `treasuryHandoverId` (CTR-DAT-64). |
| `cfg.branch.created` / `.updated` / `.deactivated` (EVT-CFG-20) | T04 | Valida `cashRegisters.branchId` y la entidad jurídica de la caja (`legalEntityId` de la sucursal, RN-COB-153); con `.deactivated` no se abren sesiones nuevas en las cajas de esa sucursal (T04 exige que no haya cajas abiertas). Reemplaza al antiguo `pla.branch.*` (EVT-PLA-21). |
| `per.block.applied` / `.lifted` / `.expired` (EVT-PER-20) | M01 | Bloqueos y mensajes de caja. |
| `per.ownership.changed` (EVT-PER-23) | M01 | Titular de la cuenta corriente (cambio de titularidad desde fecha). **Corregido (DEC-045):** no se cambia el titular de la cuenta existente ni se traslada su deuda; se abre una cuenta corriente del nuevo titular (por entidad jurídica) desde la fecha del cambio y la cuenta del saliente conserva sus obligaciones (RN-COB-155). |
| `int.circuit.opened` / `.closed` (EVT-INT-04) | T06 | Salud del conector; excepción `connectorDown`. |
| `int.file.received` (EVT-INT-19) | T06 | Dispara JOB-COB-02 / JOB-COB-08 / JOB-COB-18. |

**Consumos pendientes de registro en T11 (INC-06-06):** M07 consume `int.circuit.opened` / `.closed` (EVT-INT-04) de T06 para la salud del conector y la excepción `connectorDown`; T11 §12.3 no lista a M07 como consumidor de EVT-INT-04 y debe agregarlo.

Los jobs se detallan en 9.20 (JOB-COB-01..22).

## 13. Integraciones

COB define **qué** se intercambia y las reglas de negocio; T06 resuelve **cómo** (transporte SFTP/API, credenciales en bóveda por tenant, reintentos de transporte, salud de conectores, sandbox). Todo conector implementa la interfaz única `PaymentConnector` con capacidades declaradas (`createIntent`, `query`, `listCollections`, `cancel`, `refund`, `mandate`, `debit`, `chargebacks`, `dynamicQr`, `staticQr`, `invoiceQrBatch`, `barcode`, `debtBase`, `webhook`); COB nunca invoca una capacidad no declarada.

| Integración | Tipo | Dirección | Contenido de negocio | Transporte (T06) | Prioridad / ola |
|---|---|---|---|---|---|
| Red Link (pago de servicios) | Ente / archivo | Exporta deuda, importa rendición | Identificador, concepto, período, importes por vencimiento; rendición con identificador e importe | SFTP o descarga manual | Núcleo · O5 (incluye formatos de la base relevada LAG) |
| Banelco / PagoMisCuentas | Ente / archivo | Exporta deuda, importa rendición | Ídem; fecha de rendición = fecha de importación (V2 3023) | SFTP | Estándar · O5 |
| Pago Fácil, Rapipago, Cobro Express | Ente / archivo de rendición | Importa | Código de barras e importe | SFTP / manual | Estándar · O5 |
| SIRO (Banco Roela) | Ente + pasarela | Base de deuda por API, rendición por API o archivo, intenciones (QR, botón, barras), débito | Base de deuda, transacciones, código 0447/extendido | API REST + SFTP | Núcleo · O5 (incluye formatos de la base relevada LAG) |
| Pagos360 | Pasarela + débito | Intenciones, cobros, adhesiones CBU/tarjeta, débitos, rechazos, contracargos | Solicitudes, pagos, adhesiones | API REST + webhook | Núcleo · O5 |
| Mercado Pago | Pasarela + QR | Checkout, QR dinámico/estático de caja, webhooks, devoluciones | Preferencias, pagos | API REST + webhook | Núcleo · O5 |
| Banco Macro (botón/QR) | Pasarela | Intenciones, consulta | — | API | Extensión · bajo demanda (sin pedido, O11; CTR-INT-23) |
| NaranjaX (QR) | Pasarela | QR de caja | — | API | Extensión · bajo demanda (sin pedido, O11; CTR-INT-23) |
| PayFun, PagosTIC, SiPago, Helipagos, ProntoPago, ProvinciaNet | Pasarela / QR | Intenciones, consulta; ProvinciaNet y ProntoPago QR de facturas en lote | — | API | Extensión · bajo demanda (sin pedido, O11; CTR-INT-23) |
| Visa / Mastercard / Naranja débito y crédito | Débito automático / archivo | Presentación, resultados, novedades, morosidad | Layouts del procesador | SFTP | Estándar · O6 |
| Débito CBU (bancos, PampaPagos, Comafi) | Débito automático | Presentación y rechazos | Layout CBU | SFTP | Estándar · O6 |
| CoopOnline (portal ProCoop) | Transición | Importar pagos hechos en el portal legado durante la convivencia | Pagos | API (solo transición) | O11 (transición de cooperativas migradas); se retira |
| M14 bancos / extractos | Interno | `tes.bankMovement.*` | Movimientos conciliados | Eventos | O5 |
| T09 comunicaciones (antes figuraba "M10 comunicaciones" por error) | Interno | Envío de recibos, links, avisos de rechazo | Plantillas `cob.*` | Eventos y comando `com.communications.emit` (API-COM-75) | O5 |
| Impresoras de caja | T06 | Recibo térmico/A4 | Perfil por caja | Agente local / navegador | O5 |

Reglas: (1) el webhook es solo aviso; la confirmación se hace por reconsulta al proveedor (RN-COB-117); (2) ninguna credencial se guarda en parámetros ni en `gatewayConnectors` (solo `credentialRef`) — reemplaza los parámetros V2 de credenciales (CTR-COB-08); (3) ambiente sandbox por conector para pruebas del tenant; (4) los layouts estándar los mantiene la plataforma y se versionan; (5) caída de un conector: el canal se oculta del portal, la caja sigue operando con los demás medios y se abre excepción.

## 14. Parámetros

Ámbitos: **T** = tenant, **S** = servicio, **E** = ente/conector, **C** = caja. Los parámetros se administran en T04 con vigencia y auditoría.

### 14.1 Generales y cuenta corriente

| PRM-ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 # |
|---|---|---|---|---|---|---|
| PRM-COB-001 | `cob.rounding.mode` | enum | T | `halfUp` | Redondeo de importes. | — |
| PRM-COB-002 | `cob.rounding.decimals` | int | T | 2 | Precisión. | — |
| PRM-COB-003 | `cob.cash.currency` | string | T | `ARS` | Moneda de caja. | 186 |
| PRM-COB-010 | `cob.account.defaultMode` | enum | T | `unified` por grupo de facturación | Modalidad por defecto (PA-COB-02). | — |
| PRM-COB-011 | `cob.account.modeExceptions` | lista | T/S | vacío | Servicios con cuenta separada. | — |
| PRM-COB-012 | `cob.account.unifiedGrouping` | enum | T | `billingGroup` | Agrupación de la cuenta unificada. | — |
| PRM-COB-013 | `cob.statement.schedule` | objeto | T | mensual al cierre de ciclo | Frecuencia y contenido del resumen (PA-COB-18). | — |
| PRM-COB-014 | `cob.minimumPayment.formula` | expresión | T/S | Σ vencidas + recargos | Fórmula del mínimo (PA-COB-06). | — |
| PRM-COB-015 | `cob.minimumPayment.eligible` | enum | T | `overdueOnly` | Saldo elegible. | — |

### 14.2 Imputación y créditos

| PRM-ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 # |
|---|---|---|---|---|---|---|
| PRM-COB-020 | `cob.allocation.defaultPolicyByChannel` | mapa | T | `oldestFirst` (caja: elección del socio) | Política por canal (PA-COB-01). | — |
| PRM-COB-021 | `cob.allocation.ageReference` | enum | T | `firstDue` | Antigüedad por primer o último vencimiento. | 462 |
| PRM-COB-022 | `cob.allocation.servicePriority` | lista | T | vacío | Prioridad de servicios. | — |
| PRM-COB-023 | `cob.allocation.componentOrder` | lista | T | recargo, interés, terceros, impuestos, capital | Orden de componentes. | — |
| PRM-COB-024 | `cob.allocation.minimumPartial` | objeto | T | cubrir recargos | Entrega mínima. | — |
| PRM-COB-025 | `cob.cash.requireFullNotifiedDebt` | enum | T | `warning` | Cobrar deuda notificada completa. | 321 |
| PRM-COB-026 | `cob.cash.requireOldestFirst` | enum | T | `warning` | Más antiguas primero. | 324 |
| PRM-COB-027 | `cob.cash.oldestFirstByService` | bool | T | true | Antigüedad por servicio. | 375 |
| PRM-COB-028 | `cob.cash.installmentsInOrder` | enum | T | `error` | Cuotas en orden. | 2263 |
| PRM-COB-029 | `cob.cash.requireFullCoupon` | bool | T | true | Cupón completo. | 2355 |
| PRM-COB-030 | `cob.allocation.remainder` | enum | T | `creditBalance` | Tratamiento del remanente (PA-COB-04). | — |
| PRM-COB-031 | `cob.allocation.crossService` | enum | T | `payerChoice` | Cruce entre servicios (PA-COB-03). | — |
| PRM-COB-032 | `cob.autoOffset.enabled` | bool | T | true | Cancelación automática de créditos. | — |
| PRM-COB-033 | `cob.allocation.reassignApprovalThreshold` | money | T | 50.000 | Umbral de aprobación de reasignaciones. | — |
| PRM-COB-034 | `cob.cash.differenceApprovalThreshold` | money | T/C | 1.000 | Umbral de diferencia de arqueo. | — |
| PRM-COB-035 | `cob.coupon.partiallyPaidBehavior` | enum | T | `keepActiveRemainder` | Cupón parcialmente cancelado. | — |
| PRM-COB-036 | `cob.credit.autoApplyDefault` | bool | T | true | Saldo a favor aplicable automáticamente por defecto. | — |
| PRM-COB-037 | `cob.credit.duplicateCreatesCredit` | bool | T | true | Pago duplicado genera saldo a favor. | — |
| PRM-COB-038 | `cob.credit.noAutoOrigins` | lista | T | `duplicatePayment`, `allocationReversal` | Orígenes nunca automáticos. | — |
| PRM-COB-039 | `cob.rounding.cashRules` | objeto | T | sin redondeo | Redondeo de caja y ajuste. | 3054, 3055, 3056, 3069, 3070, 739 |
| PRM-COB-040 | `cob.adjustment.reasons` | catálogo | T | redondeo, error de carga, prescripción | Causas de ajuste. | — |
| PRM-COB-041 | `cob.unidentified.approvalThreshold` | money | T | 100.000 | Umbral de aprobación de no identificados. | — |
| PRM-COB-042 | `cob.unidentified.evidenceRequired` | bool | T | true | Evidencia obligatoria. | — |
| PRM-COB-043 | `cob.unidentified.escalationDays` | int | T | 15 | Días para escalar. | — |
| PRM-COB-044 | `cob.credit.applyOnNextInvoice` | bool | T | true | Aplicar saldo a favor en la próxima factura. | 2651 |
| PRM-COB-045 | `cob.transfer.verificationRequired` | bool | T | true | Verificación de transferencias informadas. | — |

### 14.3 Caja

| PRM-ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 # |
|---|---|---|---|---|---|---|
| PRM-COB-050 | `cob.cash.autoRegisterNumber` | bool | T | true | Número de caja automático por usuario. | 129 |
| PRM-COB-051 | `cob.cash.warnOtherAccountsDebt` | bool | T | true | Aviso de deuda en otras cuentas. | 187 |
| PRM-COB-052 | `cob.cash.warnNotifiedHolder` | bool | T | true | Alerta de titular notificado. | 302, 2453 |
| PRM-COB-053 | `cob.cash.warnDisconnectedService` | bool | T | true | Aviso de servicio desconectado. | 2411 |
| PRM-COB-054 | `cob.cash.warnCreditBalance` | bool | T | true | Alerta de saldo a favor. | 2909, 2932 |
| PRM-COB-055 | `cob.cash.allowBlocked` | enum | T | `withPermission` | Cobrar comprobantes bloqueados. | 2586, 2596 |
| PRM-COB-056 | `cob.cash.allowSurchargeChange` | bool | T | true (con permiso) | Cambiar recargo en caja. | 1030 |
| PRM-COB-057 | `cob.cash.fixedCalculationDate` | date | T | vacío | Fecha de cálculo fija. | 2487 |
| PRM-COB-058 | `cob.cash.surchargeDeferral` | enum | T/C | `none` | Modo diferir recargos en caja. | 1011 |
| PRM-COB-059 | `cob.cash.change` | objeto | T | vuelto automático en efectivo | Vuelto. | 1001, 1012, 1015 |
| PRM-COB-060 | `cob.cash.methodSurcharges` | objeto | T | sin recargo | Recargos por medio. | 2069, 2070 |
| PRM-COB-061 | `cob.cash.cardInstallmentSurcharge` | bool | T | true | Recargo por plan de cuotas. | 486, 487 |
| PRM-COB-062 | `cob.cash.discountsEnabled` | bool | T | false | Descuentos en caja (CTR-COB-19). | — |
| PRM-COB-063 | `cob.cash.qrMode` | enum | C | `dynamic` | QR del puesto (dinámico o estático). | 2772, 2803, 2920, 2939 |
| PRM-COB-064 | `cob.cash.retentionFields` | objeto | T | certificado obligatorio | Datos de retención. | — |
| PRM-COB-065 | `cob.cash.supplierPaymentAndReceiptGrouping` | objeto | T | recibo por cuenta | Pago a proveedor en caja y agrupación de recibos. | 144, 207, 2362, 2513, 2988, 2719 |
| PRM-COB-066 | `cob.cash.fiscalWaitSeconds` | int | T | 10 | Espera de CAE. | 727 |
| PRM-COB-067 | `cob.cash.maxPerOperation` | money | C | sin límite | Máximo por operación. | — |
| PRM-COB-068 | `cob.cash.maxCashOnHand` | money | C | sin límite | Efectivo máximo en caja (aviso de retiro). | — |
| PRM-COB-069 | `cob.cash.countedMethods` | lista | T | todos | Medios arqueados (PA-COB-08). | — |
| PRM-COB-070 | `cob.cash.multiDayClose` | bool | T | false | Cierre multi-día. | 2688 |
| PRM-COB-071 | `cob.cash.autoPresentCardsOnClose` | bool | T | true | Presentación automática de cupones al cierre. | 2952 |
| PRM-COB-072 | `cob.cash.connectionConcepts` | lista | T | vacío | Conceptos de conexión cobrables. | 443, 2086 |
| PRM-COB-075 | `cob.void.otherUserRequiresSupervisor` | bool | T | true | Anular de otro usuario. | 2394 |
| PRM-COB-076 | `cob.void.closedSessionRequiresSupervisor` | bool | T | true | Anular con sesión cerrada. | — |

### 14.4 Entes y débito automático

| PRM-ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 # |
|---|---|---|---|---|---|---|
| PRM-COB-080 | `cob.reference.format` | objeto | T | autocontenido con dígito verificador | Formato del identificador (PA-COB-09). | — |
| PRM-COB-081 | `cob.agency.exportOrigin` | enum | E | `allOpen` | Origen de exportación (todas o período). | 2267 |
| PRM-COB-082 | `cob.agency.includePaid` | bool | E | false | Incluir pagados. | 3092 |
| PRM-COB-083 | `cob.redlink.initialIndex` | int | E | 1 | Índice inicial Red Link. | 2966 |
| PRM-COB-084 | `cob.siro.extraDaysLastDue` | int | E | 0 | Días extra último vencimiento. | 3006 |
| PRM-COB-085 | `cob.agency.excludeInformed` | bool | E | false | Excluir ya informados. | 2818 |
| PRM-COB-086 | `cob.agency.adminCuitInFile` | string | E | CUIT del tenant | CUIT administrador (CTR-COB-15). | 2296 |
| PRM-COB-087 | `cob.agency.maxAcceptedDue` | enum | E | último publicado | Vencimiento máximo aceptado. Con DEC-106 el valor por defecto "último publicado" es el vencimiento N = `collectionAgencies.dueDateCapacity` del ente (RN-COB-159). | — |
| PRM-COB-088 | `cob.agency.amountTolerance` | money | E | 0,01 | Tolerancia de importe. | — |
| PRM-COB-089 | `cob.agency.allowsPartial` | bool | E | false | Admite entregas. | — |
| PRM-COB-090 | `cob.agency.duplicatesAsWarning` | bool | E | true | Duplicados como advertencia. | 3200 |
| PRM-COB-091 | `cob.agency.autoReconcile` | bool | E | false | Conciliación automática. | — |
| PRM-COB-092 | `cob.agency.fee` | objeto | E | sin comisión | Comisión del ente. | — |
| PRM-COB-093 | `cob.agency.bankPostingMode` | enum | E | `perCreditDate` | Registración bancaria (PA-COB-10). | — |
| PRM-COB-094 | `cob.banelco.settlementDateIsImportDate` | bool | E | true | Fecha de rendición Banelco. | 3023 |
| PRM-COB-100 | `cob.directDebit.cardCutoffDay` | int | E | 5 | Corte de débito con tarjeta. | 2779 |
| PRM-COB-101 | `cob.directDebit.retryPolicy` | objeto | E | 1 reintento a 5 días en códigos reintentables | Reintentos. | — |
| PRM-COB-102 | `cob.directDebit.definitiveRejections` | lista | E | catálogo del ente | Rechazos que suspenden. | — |
| PRM-COB-103 | `cob.directDebit.rejectCodes` | catálogo | E | por layout | Códigos de rechazo. | — |
| PRM-COB-104 | `cob.directDebit.voluntaryPayment` | enum | T | `excludeIfPaid` | Pago voluntario anterior. | 63, 3047 |

### 14.5 Pasarelas, devoluciones, cobradores, terceros y transición LAG

| PRM-ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 # |
|---|---|---|---|---|---|---|
| PRM-COB-110 | `cob.gateway.firstAmountAfterLastDue` | bool | E | true | Primer importe tras último vencimiento. | 908 |
| PRM-COB-111 | `cob.gateway.amountDifference` | enum | T | `acceptAndReview` | Diferencias de importe (PA-COB-05). | — |
| PRM-COB-112 | `cob.gateway.reuseWindowMinutes` | int | E | 30 | Ventana de reutilización (CTR-COB-16). | — |
| PRM-COB-113 | `cob.gateway.minAmount` | money | E | 0 | Monto mínimo. | 906 |
| PRM-COB-114 | `cob.gateway.connectorByChannel` | mapa | T | — | Conector por canal. | 2774, 2803, 3142 |
| PRM-COB-115 | `cob.gateway.offlineMode` | enum | T | `hideChannel` | Comportamiento ante caída. | 2645, 2620 |
| PRM-COB-116 | `cob.gateway.uncertainRetry` | objeto | T | 1-5-15-60 min, 6 h hasta 72 h | Reconsulta de inciertos. | — |
| PRM-COB-117 | `cob.gateway.pollingBackoff` | objeto | E | 5 min → 1 h | Polling sin webhook. | — |
| PRM-COB-118 | `cob.gateway.estimatedFeeRate` | objeto | E | tarifa del contrato | Comisión estimada. | — |
| PRM-COB-120 | `cob.refund.secondApprovalThreshold` | money | T | 200.000 | Umbral de doble aprobación. | — |
| PRM-COB-121 | `cob.reversal.dailyInterestPct` | Decimal | E | 0 (desactivado) | Interés diario de reversión (PA-COB-11). | 3052 |
| PRM-COB-122 | `cob.reversal.scope` | enum | E | `perInvoice` | Reversión por cuenta o factura. | 3001 |
| PRM-COB-123 | `cob.reversal.fee` | objeto | E | sin comisión | Comisión de reversión. | 3059, 3073 |
| PRM-COB-124 | `cob.reversal.blockOnline` | bool | E | false | Bloqueo online tras reversión. | 3002, 3000 |
| PRM-COB-125 | `cob.reconciliation.windowDays` | int | E | 4 | Ventana de conciliación. | — |
| PRM-COB-126 | `cob.webhook.retentionMonths` | int | T | 18 | Retención de eventos de webhook. | — |
| PRM-COB-130 | `cob.collector.recalcOnSync` | bool | T | true | Recalcular recargo al sincronizar. | — |
| PRM-COB-131 | `cob.collector.offlineSeries` | objeto | T | serie por dispositivo | Numeración offline. | — |
| PRM-COB-132 | `cob.thirdParty.rules` | objeto | T | sin parciales ni vencidos | Reglas de terceros. | — |
| PRM-COB-133 | `cob.remoteCollection.fee` | objeto | T | desactivado | Cobranza remota. | 714, 715, 716, 717, 718, 719 |
| PRM-COB-140 | `cob.lag.resolverEnabled` | bool | T | true solo en tenants migrados con el identificador Red Link de la base relevada LAG | Resolutor LAG (PA-COB-09). | — |
| PRM-COB-141 | `cob.siro.barcodeFormat` | enum | E | `0447` con fallback extendido | Formato de barras SIRO (PA-COB-16). | — |
| PRM-COB-142 | `cob.gateway.transferFeeToPayer` | bool | E | false | Trasladar comisión al socio (PA-COB-17). | — |

### 14.6 Otros parámetros V2 del módulo COBRANZA

| Parámetros V2 # | Tratamiento |
|---|---|
| 228, 323, 598, 599, 650, 2248, 2249, 2337, 2360, 2385, 2452, 2473, 2585, 2639, 2664, 2665, 2674, 2684, 2698, 2725, 2929, 3169, 3176, 3177 | **Adoptado** como reglas o configuración de caja (validaciones, impresión, notas, medios por defecto, cheques repetidos) dentro de PRM-COB-025..076 y `paymentMethods`. **[VERIFICAR]** semántica exacta de cada uno con la cooperativa piloto en el relevamiento de O5 (referencia: base relevada LAG). |
| 2994, 2995, 3025, 3005 | Adoptado en `collectionAgencies.transport` (programación, autoconfirmación, correos de error). |
| 905, 909, 914, 2389, 2390, 2677, 2720, 2726, 2727, 2743, 2759, 2760, 2761, 2773, 2798, 2799, 2800, 2801, 2802, 2975, 3144, 3199 | Adoptado en `gatewayConnectors` (medios, exclusiones, canales, URLs de retorno, datos del comercio QR). |
| 2869, 2687, 2646, 3188, 708, 3083, 2412, 2908, 2501, 2499, 2752, 2789 | Adoptado en configuración de cuenta corriente, recibos y resúmenes. |
| 2489 | Reemplazado por la cuenta de servicio del conector (T06). |
| 299, 1002, 600, 606, 607, 608, 609, 621, 625, 2300, 2356, 2363, 2826, 3167, 3135, 2078, 2080, 372, 1056, 2828 | **Delegado a M08** (intereses, tasas, recargos). |
| 2713, 3106, 3112, 2926, 3147, 3113, 3163, 2917, 3033, 2420, 3153 | **Delegado a M08** (reconexión y estados de servicio por pago). |
| 2371, 2391, 2594, 2940, 3109, 2361, 2703, 393 | **Delegado a M03** (venta prepaga). |
| 2392, 2567, 2574, 2577, 2865, 2613, 2614, 2615, 2911, 2912, 2980, 3102, 2357 | **Delegado a M19 / T06** (autogestión, ATM, tótem). |
| 901, 902, 903, 904, 907, 2492, 2493, 2494, 2495, 2804, 2805, 2553, 2554, 2555, 2756, 2757, 2758, 2762, 2765, 2766, 2767, 2768, 2793, 2794, 2795, 2796, 2816, 2820, 2822, 2877, 2878, 2879, 2880, 2881, 2882, 2883, 2956, 2957, 2958, 2959, 2960, 2969, 2970, 2971, 3046, 3077, 3078, 3079, 2921, 2922, 3139, 2579, 2806 | **Reemplazado** por bóveda de credenciales T06 y configuración del conector (CTR-COB-08). |
| 2264, 2784 | **Descartado** (sigla y fecha de particularidades de otra cooperativa). |
| 2055, 2255 | Delegado a M05. |
| 2508 | Delegado a M18. |
| 2593 | Delegado a M11. |
| 2597 | Delegado a M02. |
| 3158 | Delegado a M06 (FECESCOR). |
| 2746 | Adoptado en `collectionAgencies` Pago Fácil (días de acreditación). |
| 2885 | Adoptado en conector NaranjaX. |
| 2747, 2951, 2338, 2364, 2270, 2441, 2451, 2523, 2562, 2566, 2510, 2524 | Preferencias de interfaz: absorbidas por T03 (vistas guardadas, atajos) o **Descartado** cuando son propias de WinForms. |

## 15. Reportes

Corte temporal común: por **fecha de cobro** (efectiva) salvo indicación; los reportes de cartera son "a fecha" (saldo al cierre del día indicado, AGR-022) y se reproducen igual en cualquier momento posterior porque se calculan desde `ledgerEntries` y `allocations` (no desde `openAmount`). Universo: tenant; filtros por sucursal, servicio, caja, canal, cajero. Exportación XLSX/CSV/PDF.

| REP-ID | Reporte | Fórmula / contenido | Universo y corte |
|---|---|---|---|
| REP-COB-01 | Estado de cuenta del titular | Movimientos y saldo acumulado; obligaciones abiertas por servicio | Cuenta, a fecha |
| REP-COB-02 | Antigüedad de saldos (aging) | Saldo abierto por tramos 0-30, 31-60, 61-90, 91-180, > 180 días desde el 1° vencimiento | Tenant, a fecha |
| REP-COB-03 | Cartera por servicio y período | Σ `amount`, Σ imputado, saldo por servicio y período | A fecha |
| REP-COB-04 | Cobranza diaria por canal | Σ recibos por canal, medio y servicio; recargos e intereses cobrados por separado | Fecha de cobro |
| REP-COB-05 | Planilla de caja / informe de presentación del cajero | Operaciones de la sesión, totales por medio, diferencias | Sesión |
| REP-COB-06 | Arqueos y diferencias | Teórico, declarado, diferencia, aprobador | Período |
| REP-COB-07 | Recibos anulados | Recibos `voided` con motivo, usuario y autorizante | Período |
| REP-COB-08 | Cambios de recargo y notas desmarcadas | Auditoría de acciones sensibles de caja | Período |
| REP-COB-09 | Rendiciones de entes | Por archivo: leídos, aplicados, advertencias, errores, comisión, neto esperado | Fecha de presentación |
| REP-COB-10 | Conciliación de cobranzas | Bruto − comisión − IVA − retenciones = neto esperado vs. acreditado | Día y canal |
| REP-COB-11 | Débito automático | Presentado, aceptado, rechazado por código, tasa de rechazo = rechazados / presentados | Lote / período |
| REP-COB-12 | Adhesiones | Altas, bajas, suspensiones, activas por ente | A fecha |
| REP-COB-13 | Intenciones de pago | Por estado y conector; tasa de conversión = pagadas / emitidas | Período |
| REP-COB-14 | Comisiones de canales | Σ comisiones por canal y su IVA | Fecha de acreditación |
| REP-COB-15 | Saldos a favor | Abiertos por origen y antigüedad | A fecha |
| REP-COB-16 | No identificados | Pendientes por canal y antigüedad | A fecha |
| REP-COB-17 | Devoluciones y contracargos | Expedientes por estado e importe | Período |
| REP-COB-18 | Cobradores | Cobrado, rendido, diferencias, comisión | Período |
| REP-COB-19 | Terceros | Cobrado por tercero, comisión, rendido | Período |
| REP-COB-20 | Cobranza por esquema | Agrupación por productos/impuestos según `collectionReportSchemes` | Fecha de cobro |
| REP-COB-21 | Integridad del auxiliar | Resultado de JOB-COB-14; diferencias abiertas | Fecha de verificación |
| REP-COB-22 | Cumplimiento del mínimo de pago | Cuentas con mínimo, pagado, cumplido | Fecha de evaluación |
| REP-COB-23 | Excepciones de cobranza | Abiertas por tipo, severidad y antigüedad | A fecha |

Indicadores para T09/M18: cobranza del día vs. promedio, % de cobranza digital, días promedio de cobro, tasa de rechazo de débitos, pagos inciertos abiertos, no identificados > 15 días.

## 16. Casos de uso

### 16.1 Casos de uso de BASE (conservan su ID)

**CU-11 — Cobro parcial en caja (BASE §11).** Actor: Cajero con facultades. Precondición: CAJ-01 abierta con fondo ARS 20.000; FAC-DEMO-001 de ARS 13.000 pendiente. Flujo: busca a PER-001; selecciona FAC-DEMO-001; indica entrega de ARS 5.000 con motivo; paga en efectivo; confirma. Resultado: REC-DEMO-001 por 5.000, imputación por componentes (recargos primero), saldo 8.000, obligación `partial`, `cob.payment.confirmed`. Alternativo: sin `cob.caja.cobrarParcial` → 403. Reintento con la misma clave → mismo recibo.

**CU-12 — Cierre de caja (BASE §12).** Actor: Cajero. Precondición: CAJ-01 con fondo 20.000 y el cobro de CU-11. Flujo: pide cierre; integridad OK; teórico efectivo 25.000; declara 25.000; cierra. Resultado: sesión `closed`, rendición `delivered`. Alternativo: declara 24.900 → diferencia −100 justificada; si supera PRM-COB-034 requiere supervisor; quebranto a M15. Anulación posterior a la recepción por tesorería: contrapartida en M14.

**CU-13 — Pago online (BASE §13).** Dueño del ID: M07 (decisión del coordinador del 5-11-2026; el CU-13 de M14 se renumera en M14 con "antes CU-13"). Actor: Socio. Precondición: FAC-DEMO-001 con saldo 8.000 tras CU-11. Flujo: PER-001 entra al portal, elige pagar 8.000, intención TX-DEMO-001; el proveedor confirma (webhook + reconsulta). Resultado: transacción bruto 8.000, comisión 160, neto 7.840; recibo por 8.000; obligación `paid`; `cob.settlement.expected` por 7.840; conciliación diaria cierra sin diferencias. Alternativo: webhook duplicado → un solo recibo; timeout al crear → `uncertain` sin reenvío.

**CU-FAC-01 — Factura agrupada multiservicio cobrada (BASE §44).** Definición dueña: M05 «CU-FAC-01»; aquí solo el tramo de cobranza. FAC-AG-DEMO-002 de ARS 13.000 genera una obligación por servicio; un pago total cancela todas; un pago parcial se imputa según la política (PA-COB-01) y queda trazado por servicio. FAC-INT-DEMO-002 (ARS 25.000) con FAC-001..004.

**CU-CTA-01 — Cuenta unificada con mínimo (BASE §68).** Agua 13.000 + electricidad 20.000 + cementerio 7.000 = 40.000; umbral mínimo 10.000; el socio paga 8.000. Resultado: imputación por antigüedad (o elección), mínimo no cumplido, `cob.minimumPayment.evaluated` con cumplido = false; M08 decide; COB no suspende. Afectación cruzada de saldos deshabilitada por defecto (CTR-COB-14).

**CU-103 — Factura agrupada por grupo de facturación (BASE §103).** Definición dueña: M05 «CU-103»; aquí solo el tramo de cobranza e imputación. Energía 28.000 + internet 15.000 + bomberos 1.200 = 44.200; pago 30.000. Resultado: con la política por defecto se cubren primero recargos y luego obligaciones por antigüedad y prioridad de servicio; el remanente de cada servicio queda abierto y trazado; prevalece §103 (FAC-008) sobre §44 (CTR-COB-01).

**§40 integrado (BASE §40).** PER-001 / ASO-001 / INM-001 / SUM-AG-001 / MED-001: la lectura de M04 → factura M05 → obligación COB → cobro → asiento M15 queda trazada extremo a extremo con los mismos identificadores.

**ESC-01 (AGR 5.x) — Pago duplicado.** El socio paga la misma obligación por Red Link y por portal. Resultado: el primero cancela; el segundo crea saldo a favor `duplicatePayment` no automático + excepción; el socio elige aplicarlo o pedir devolución.

**ESC-04 (AGR 5.x) — Caída del proveedor durante el pago.** Ver CU-COB-12.

### 16.2 Casos de uso nuevos

| CU-ID | Nombre | Actor | Flujo resumido | Resultado |
|---|---|---|---|---|
| CU-COB-01 | Rendición Red Link LAG | Resp. cobranzas externas | Llega el archivo por SFTP; validación de cabecera con convenio; líneas con identificador de 10 dígitos resueltas por alias/resolutor; confirmación | Recibos en caja 101; diferidos a M08; no resueltas a la bandeja |
| CU-COB-02 | Base de deuda SIRO por API | Resp. cobranzas externas | Exporta deuda; recibe número de transacción; consulta resultado; confirma | Deuda publicada; errores por registro visibles |
| CU-COB-03 | Débito rechazado | Sistema / operador | Lote presentado; resultado con rechazo reintentable; reintento; segundo rechazo definitivo | Adhesión suspendida; aviso al socio; obligación sigue abierta |
| CU-COB-04 | Contracargo de tarjeta | Tesorero | Llega contracargo; reverso de imputaciones; cargos opcionales; bloqueo online | Obligación reabierta; expediente en disputa |
| CU-COB-05 | Devolución de pago duplicado | Resp. devoluciones | Solicitud desde saldo a favor; aprobación por otra persona; ejecución por conector o M14 | Reintegro conciliado |
| CU-COB-06 | Cobro offline de cobrador | Cobrador | Descarga lista; cobra sin señal; recibo provisorio; sincroniza | Recibo definitivo; recargo recalculado; conflictos a excepción |
| CU-COB-07 | Cierre con diferencia | Cajero / supervisor | Declara menos; justifica; supervisor aprueba | Quebranto registrado |
| CU-COB-08 | Anulación de cobro de otro cajero | Supervisor | Busca operación; impedimentos OK; anula con motivo | Saldos restituidos; recibo anulado conservado |
| CU-COB-09 | Cupón único multiservicio | Socio | Recibe resumen con cupón; paga en Pago Fácil | Rendición por cupón cancela todas las obligaciones incluidas |
| CU-COB-10 | Cobro QR en caja | Cajero | Carga importe en QR del puesto; socio paga con billetera; confirmación | Recibo con medio QR; transacción conciliada |
| CU-COB-11 | Transferencia no identificada | Operador cta. cte. | M14 informa crédito sin referencia; bandeja; identifica con comprobante; aplica | Recibo con fecha de cobro original |
| CU-COB-12 | Pago incierto (ESC-04) | Sistema | Timeout al crear intención; reconsulta; el proveedor informa pago | Un solo cobro; portal muestra "en verificación" mientras tanto |
| CU-COB-13 | Link de pago por WhatsApp | Atención / CRM | Genera link desde la cuenta; envía; socio paga | Intención imputada; envío trazado |
| CU-COB-14 | Cobro por cuenta de tercero | Cajero | Lee barras del tercero; valida; cobra con comisión | Obligación del tercero y rendición pendiente |
| CU-COB-15 | Diferencia de importe en pasarela | Sistema / responsable | Socio paga importe de 1° vencimiento estando en el 2° | Se imputa; diferencia a revisión (PA-COB-05) |
| CU-COB-16 | Cancelación automática de NC | Sistema | M05 emite NC; saldo a favor; JOB-COB-10 lo aplica a la próxima obligación del mismo servicio | Obligación cancelada sin intervención |

## 17. Criterios de aceptación y escenarios de prueba

### 17.1 Criterios generales

1. **Integridad**: después de cualquier escenario, JOB-COB-14 reporta cero diferencias.
2. **Idempotencia**: repetir cualquier POST económico con la misma `Idempotency-Key` devuelve la misma respuesta y no crea registros; webhooks y archivos repetidos no duplican cobros.
3. **Atomicidad**: forzar una falla después de crear el recibo y antes del outbox deja la base sin cambios.
4. **Decimal**: Σ de 1.000 cobros de ARS 0,10 = ARS 100,00 exactos.
5. **Inmutabilidad**: ninguna API permite editar `openAmount`, `amount` de una obligación ni borrar documentos económicos.
6. **Fechas**: un cobro a las 23:30 hora de Córdoba se registra en la fecha de negocio local, no en la UTC del día siguiente.

### 17.2 Permisos negativos

| ESC | Escenario | Esperado |
|---|---|---|
| ESC-COB-P01 | Cajero sin `cob.caja.cobrarParcial` intenta entrega parcial | 403 problem+json; nada se registra |
| ESC-COB-P02 | Cajero sin `cob.caja.cambiarRecargo` envía recargo modificado | 403 |
| ESC-COB-P03 | Cajero anula operación de otro cajero sin supervisor | 403 `cob.caja.anularOtroUsuario` |
| ESC-COB-P04 | Quien solicitó una devolución intenta aprobarla | 403 (segregación) |
| ESC-COB-P05 | Cobrador consulta lista de otro cobrador | 404 (alcance `propios`) |
| ESC-COB-P06 | Socio consulta cuenta no autorizada | 404 |
| ESC-COB-P07 | Cobro sin sesión abierta | 409 `cob.caja.sesionCerrada` |
| ESC-COB-P08 | Contador intenta imputar | 403 |

### 17.3 Aislamiento de tenant

| ESC | Escenario | Esperado |
|---|---|---|
| ESC-COB-T01 | Usuario del tenant A consulta `obligations/{id}` del tenant B | 404, sin filtrar existencia |
| ESC-COB-T02 | Webhook con `tenantSlug` A y firma del conector de B | 401; evento registrado como inválido |
| ESC-COB-T03 | Archivo de rendición de B cargado en A | Rechazo por convenio |
| ESC-COB-T04 | Índices: toda consulta del módulo incluye `tenantId` (prueba de lint/consulta) | Sin consultas sin `tenantId` |
| ESC-COB-T05 | Layout de plataforma modificado por un tenant | Se crea copia en el tenant; el original no cambia |

### 17.4 Reintentos y fallas

| ESC | Escenario | Esperado |
|---|---|---|
| ESC-COB-R01 | Webhook llega tres veces | Un cobro; dos eventos `ignored` |
| ESC-COB-R02 | Webhook llega antes que la respuesta de creación | Reconsulta resuelve; un cobro |
| ESC-COB-R03 | Timeout al crear intención | `uncertain`; no se crea otra; reconsulta |
| ESC-COB-R04 | Caída del worker a mitad de confirmar rendición de 1.000 líneas | Al reanudar solo se aplican las no aplicadas |
| ESC-COB-R05 | Doble clic en Confirmar en caja | Un recibo |
| ESC-COB-R06 | Sincronización offline repetida | Un recibo por `clientMutationId` |
| ESC-COB-R07 | Mismo archivo con otro nombre | 409 `cob.rendicion.duplicada` |
| ESC-COB-R08 | Dos cajeros cobran la misma obligación a la vez | Uno confirma; el otro recibe 409 `cob.obligacion.saldoCambiado` y recotiza |
| ESC-COB-R09 | CAE no llega | `pendingFiscal`; JOB-COB-15 completa |
| ESC-COB-R10 | Lote de 100 facturas CAE: ARCA rechaza una por un dato y las posteriores sin CAE se renumeran (DEC-107) | Las 100 obligaciones nacen `fiscalGate = pendingAuthorization`, sin débito en el auxiliar ni exportación a entes; las autorizadas pasan a `authorized` y entran en el archivo de deuda; la rechazada queda `released` (EVT-FAC-22) y no se cobra ni publica; las renumeradas actualizan `sourceDocument.number` (EVT-FAC-23) sin crear obligaciones nuevas; al reemitirse y autorizarse la corregida, su misma obligación pasa a `authorized` (RN-COB-158) |
| ESC-COB-R11 | Obligación con 6 vencimientos y ente con `dueDateCapacity` = 3 (DEC-106) | La exportación publica los vencimientos 1 a 3 (`publishedDueCount` = 3); pasado el vencimiento 3 el ente no la cobra; la caja y el portal cobran los vencimientos 4 a 6 (RN-COB-159) |
| ESC-COB-R12 | Cobro en caja con recibo y sin factura de recargo, con ARCA caído (DEC-107) | El recibo se numera y entrega sin esperar CAE (`authorizationType = none`); la operación no queda `pendingFiscal` (RF-COB-087) |

### 17.5 Conciliación

| ESC | Escenario | Esperado |
|---|---|---|
| ESC-COB-C01 | Pago en el proveedor sin webhook | La conciliación diaria lo incorpora e imputa |
| ESC-COB-C02 | Neto acreditado distinto del esperado | Diferencia en excepción; día no cerrable sin comentario |
| ESC-COB-C03 | Pie de archivo con cantidad distinta | Advertencia o rechazo según layout |
| ESC-COB-C04 | Rendición acreditada en dos días | Registración por fecha de acreditación (PRM-COB-093) |

### 17.6 Escenarios BASE y transición

| ESC | Escenario | Esperado |
|---|---|---|
| ESC-01 | Pago duplicado (16.1) | Saldo a favor no automático + excepción |
| ESC-04 | Caída del proveedor (CU-COB-12) | Un solo cobro; sin reenvío |
| ESC-COB-L01 | Línea Red Link LAG con identificador de 10 dígitos y servicio 02 + concepto 002 | Resuelve cuenta+servicio gas |
| ESC-COB-L02 | Dos obligaciones impagas con mismo importe | No identificado con candidatos (no elige la más reciente) |
| ESC-COB-L03 | Identificador fuera de rango entero | Solo esa línea rechazada |
| ESC-COB-L04 | Factura SIRO ≥ ARS 100.000 | Error informado y formato extendido o QR; nunca código vacío |
| ESC-COB-L05 | Paralelo ProCoop vs. CoopApps durante los ciclos consecutivos que exige T07 §17.4 (PRM-MIG-041, default 2; antes "un ciclo completo") en LAG, cada ciclo con el mismo criterio | Σ cobranza por día y saldos por cuenta iguales (tolerancia 0) |
| ESC-COB-E01 | Titular con ELE (entidad A) e Internet (entidad B) (DEC-087) | Dos cuentas corrientes; el portal muestra ambas con total; ningún saldo a favor de A se aplica a B |
| ESC-COB-E02 | Cobro único en caja de ARS 13.000: ARS 8.000 de A y ARS 5.000 de B, con efectivo y tarjeta | Dos recibos numerados por entidad; Σ recibos = 13.000; `cob.payment.confirmed` lleva ambos con su `legalEntityId`; anular la operación anula los dos |
| ESC-COB-E03 | Recibo con PRM-COB-065 = un recibo por operación y deuda de dos entidades | Igual se emiten dos recibos (uno por entidad) |
| ESC-COB-E04 | Cambio de titularidad con ARS 20.000 vencidos del saliente (DEC-045) | La deuda queda en la cuenta del saliente; la nueva cuenta del entrante empieza en 0; la caja muestra la advertencia de deuda previa sin bloquear |
| ESC-COB-E05 | Consulta de detalle de rendición de hace 40 meses (DEC-087) | Recibo y PDF en línea; detalle de líneas como consulta diferida con aviso al terminar |
| ESC-COB-E06 | Estado de cuenta con deuda de la entidad A (ARS 8.000) y de la entidad B (ARS 5.000) y pedido de cupón único | Se emiten dos cupones, uno por entidad, con su referencia de pago; ninguno mezcla obligaciones (RN-COB-156) |
| ESC-COB-E07 | Factura con servicio ARS 12.100 y depósito en garantía ARS 50.000 (`itemClass = guaranteeDeposit`, valores ficticios), cobrada completa | Dos obligaciones; el depósito figura como "reintegrable", no recibe interés ni se usa para compensar otra deuda; `cob.payment.confirmed` informa la clase y M15 lo registra como pasivo (RN-COB-157) |

### 17.7 Criterios por RF

Cada RF de la sección 5 tiene su criterio en la columna correspondiente; la aceptación del módulo exige el 100 % de los RF Núcleo de O5 y los escenarios 17.2–17.6.

## 18. Datos demo

Todos ficticios (BASE §40 y anexos de M01/M05).

| Entidad | Datos |
|---|---|
| Titular / cuentas | PER-001 Ana Pérez (ficticia), ASO-001, INM-001, SUM-AG-001 (agua), cuentas energía, internet y bomberos del mismo grupo de facturación GF-DEMO-01 |
| Cuentas corrientes | CC-DEMO-001 unificada (GF-DEMO-01); CC-DEMO-002 separada (cementerio) |
| Obligaciones | FAC-DEMO-001 ARS 13.000 (vto 10-11-2026 / 20-11-2026 con 13.390); FAC-AG-DEMO-002 13.000; FAC-INT-DEMO-002 25.000; obligaciones CU-CTA-01 (13.000 / 20.000 / 7.000) y CU-103 (28.000 / 15.000 / 1.200) |
| Caja | CAJ-01 sucursal Centro, fondo 20.000; CAJ-101 virtual Red Link; CAJ-102 virtual SIRO; CAJ-300 documentos a cobrar; CAJ-QR-01 con QR estático demo |
| Recibos | REC-DEMO-001 5.000 (CU-11); REC-DEMO-002 8.000 (CU-13) |
| Pasarela | Conector sandbox "Pasarela Demo" con TX-DEMO-001 bruto 8.000 / comisión 160 / neto 7.840 |
| Entes | ENT-DEMO-RL (Red Link, convenio "DEMO1"), ENT-DEMO-SIRO, ENT-DEMO-PF (Pago Fácil) con layouts estándar y archivos de muestra sintéticos (10 líneas: 7 ok, 1 importe distinto, 1 no encontrada, 1 duplicada) |
| Débito | ADH-DEMO-001 CBU ficticio con dígitos verificadores válidos enmascarado `****0001`; lote con un rechazo "fondos insuficientes" |
| Cobrador | COBR-01 con lista de 5 cobros, uno en conflicto |
| Tercero | TER-DEMO-01 "Servicio de terceros demo" con comisión 2 % mínimo 50 |
| Saldos a favor | SAF-DEMO-001 duplicado 8.000 no automático |
| Excepciones | Una de cada tipo para la bandeja |

## 19. Migración

### 19.1 Origen → destino

| Origen ProCoop (CAT §6-§7) | Destino | Transformación | Conciliación |
|---|---|---|---|
| `FACTURAS` (impagas y pagadas de los últimos 24 meses) | `obligations` + `ledgerEntries` | Una obligación por bloque de servicio; `SALDO` → validado contra Σ `IT_PAGSO`; si difiere, se toma `TOTAL − Σ ENTREGA` y se reporta | Σ saldo por servicio = Σ `SALDO` ProCoop; diferencias listadas |
| `FACTURAS` históricas (> 24 meses, pagadas) | Solo consulta (archivo histórico de M18) | Sin obligaciones | — |
| `PAG_SOC`, `IT_PAGSO`, `ANUPAG_SOC`, `ANUIT_PAGSO` | `receipts`, `allocations` (anulados como `voided`) | Componentes desde `INT_234`, `INT_MOR`, `INT_FIN`; `FACTOR` → signo | Σ recibos por día = Σ ProCoop |
| `PLAN_CAJ`, `ANUPLAN_CAJ`, `EFEC_OP`, `TRAN_OP`, `VALORES`, `RETENCIO`, `CUPONTAR` | `cashOperations`, `paymentTenders` | Cheques en cartera → M14 | Σ por medio por día |
| `CAJAS`, `CAJASJP`, `CAJAS_QR` | `cashSessions` (cerradas), `cashRegisters`, `staticQrCodes` | Sesión abierta al corte: se cierra en ProCoop antes de migrar | Totales por sesión |
| `ANTICIPOS`, `ANTIFACTU`, `CREDITOS_NOAUTOMATICOS` | `creditBalances` | `SDO_ANT` → `openAmount` | Σ saldos |
| `TALONFAC`, `TALONFAC_PAGO` | `paymentCoupons` | Solo vigentes | — |
| `BANCOS`, `ENTIDADES*` | `collectionAgencies` | Campo a campo (7.19) | Revisión con el tenant |
| `RED_LINK`, `DEUDARED`, `DEUDARED_TIPO`, `SIRO_BASEDEUDA` | `agencyPublishedDebts`, `agencyDebtExports` (CTR-DAT-42; `DEUDARED` [VERIFICAR] saldo de redondeo en LAG, ver §7) | Último índice Red Link | Índice continúa sin saltos |
| `SUMSOC` (débito), `SUMSOC_EXTRAS`, `DEBITO_EXCLUSION`, `ADHSOC` | `directDebitMandates` | CBU cifrado. Tarjetas (DEC-091, RN-MIG-056): `NUM_TARJ` no se extrae, la consulta de origen calcula `brand` y `last4`; con identificador del proveedor (`DEBITO_360_ID` o número de adherente de la procesadora) → `cardToken` y `active`; con tokenización masiva del proveedor → se importan token, marca y últimos 4; si no, `pendingSignature` y pedido de re-adhesión | Adhesiones activas ProCoop = `active` + `pendingSignature` migradas; tarjetas pendientes de re-adhesión listadas por cuenta |
| `PAGOS360`, `PAGOS360_ITEMS`, `PAGOS360_PAGOS`, `PAGOS360_EXTRAS` | `paymentIntents`, `gatewayTransactions` | Solo intenciones vigentes y transacciones de 18 meses | Σ por conector |
| `CANALES_PAGOS`, `TIP_VAL`, `TARJETAS`, `TARJETAS_RECARGO`, `DESCUENTO_CAJA` | Configuración | — | — |
| `TERCEROS`, `FACTURAS_TERCEROS` | `thirdPartyBillers`, `thirdPartyCollections` | No rendidos quedan pendientes | Σ pendiente de rendir |
| `ESQUEMAS_INFORMES_COBRANZAS` | `collectionReportSchemes` | — | — |
| `COBRANZA_LOG` | Auditoría histórica (solo lectura) | — | — |
| `FACTURAS.USUARIO`, identificadores Red Link | `externalKeyAliases` | Uno por clave | Toda factura ProCoop vigente resoluble |
| Parámetros V2 COBRANZA | PRM-COB y configuración (14.6) | Credenciales: se cargan manualmente en la bóveda (nunca se copian) | Checklist firmado |

### 19.2 Estrategia de transición (formatos de la base relevada LAG)

1. Corte por fecha: cierre de cajas en ProCoop, última rendición importada, última exportación de deuda.
2. Migración de saldos abiertos con apertura (`ledgerEntries.kind = migrationOpening`) por obligación, no por saldo global, para conservar antigüedad.
3. Convivencia: los archivos de entes con facturas emitidas por ProCoop se resuelven por alias y resolutor LAG (PA-COB-09) hasta el vencimiento de la última factura ProCoop; los pagos de CoopOnline se importan por el conector de transición.
4. Paralelo de los ciclos consecutivos que exige T07 §17.4 (PRM-MIG-041, default 2; antes "de un ciclo") (ESC-COB-L05) y conciliación de saldo por cuenta con tolerancia 0; las diferencias heredadas de ProCoop (saldo editable) se documentan y ajustan con causa `migration`.
5. Rollback: hasta la primera rendición procesada en CoopApps se puede volver a ProCoop; después, solo hacia adelante.

## 20. Contraposiciones

| CTR-ID | Fuentes | Conflicto | Resolución | Regla de prevalencia |
|---|---|---|---|---|
| CTR-COB-01 | BASE §44 vs. BASE §103 (FAC-008) | §44 trata la factura agrupada como comprobante único con saldo propio; §103 exige saldo explicable por servicio dentro del grupo de facturación | Una obligación por bloque de servicio; el comprobante agrupado es presentación | BASE más reciente (§103 prevalece sobre §44) |
| CTR-COB-02 | RN-05 §3.4 vs. BASE §103 | ProCoop no reparte un pago parcial entre servicios de un comprobante; BASE pide trazabilidad por servicio | Motor de imputación con política configurable (PA-COB-01) | BASE > RN |
| CTR-COB-03 | RN-05 §3.4 paso 8 (`FACTURAS.SALDO` editable) vs. AGR-011 | Saldo como campo editado por cada proceso vs. saldo derivado de imputaciones | `openAmount` proyección no editable + JOB-COB-14 | AGR > RN |
| CTR-COB-04 | RN-05 §3.5 / §13.4 (anulación borra registros) vs. BASE §12, AGR-010 | Borrado físico vs. trazabilidad | Anulación con reverso; nada se borra | BASE/AGR > RN |
| CTR-COB-05 | RN-05 §13.1 (arqueo solo de efectivo) vs. BASE §12 | Arqueo parcial vs. cierre controlado de todos los medios | Declaración por medio (PA-COB-08) | BASE > RN |
| CTR-COB-06 | RN-05 §5.4 (duplicado → anticipo automático) vs. AGR-012 | Aplicación automática de duplicados vs. control de pagos duplicados | Saldo a favor no automático + excepción | AGR > RN |
| CTR-COB-07 | RN-11 §1.1 (LAG resuelve por importe y elige la más reciente) vs. BASE §13 (referencia única) | Identificación ambigua vs. identificador determinístico | Identificador autocontenido nuevo + resolutor LAG transitorio por alias (PA-COB-09) | BASE > RN |
| CTR-COB-08 | RN-13 §17, V2 credenciales en parámetros vs. DEC-001 (bóveda) | Secretos en tabla de parámetros vs. bóveda por tenant | `credentialRef` a T06; parámetros V2 Reemplazados | DEC > todo |
| CTR-COB-09 | RN-13 §12 (ProvinciaNet confía en el portal) vs. BASE §13 | Confirmación sin verificación vs. confirmación por el proveedor | Reconsulta obligatoria antes de imputar | BASE > RN |
| CTR-COB-10 | RN-13 §3.4 (QR estático identifica por fecha + importe) vs. referencia única | Emparejamiento por coincidencia vs. referencia | QR estático con transacción cargada por caja (referencia única); coincidencias ambiguas a no identificados | BASE > RN |
| CTR-COB-11 | RN-13 §2.3 (webhook vía CoopOnline/Firebase) vs. DEC-003 | Intermediario externo vs. endpoint propio por tenant | Webhook propio `/api/v1/ext/cob/webhooks/...` | DEC > RN |
| CTR-COB-12 | RN-05 §4.6 ("importes no coinciden" rechaza) vs. RN-13 §19.2 | Rechazar vs. aceptar con diferencia | Aceptar, imputar y diferencia a revisión (PA-COB-05) | Más reciente / AGR-016 |
| CTR-COB-13 | MER-019 (punitorio al pago) vs. RN-05 §3.3 (diferir) | Cobrar recargo en el acto vs. diferirlo a la próxima factura | Configurable por canal (PRM-COB-058 y `surchargeDeferral` del ente); M08 calcula | BASE con configuración |
| CTR-COB-14 | BASE §68 (afectación cruzada) vs. FAC-008 | Saldos de un servicio cancelando otro vs. independencia por servicio | Deshabilitada por defecto; habilitable con elección del socio (PA-COB-03) | BASE más reciente |
| CTR-COB-15 | V2 2296 (nombre de archivo) vs. catálogo de layouts | Parámetro define el CUIT administrador en el nombre vs. layout versionado | El layout define el nombre; PRM-COB-086 solo aporta el dato | CAT/layout > parámetro |
| CTR-COB-16 | RN-13 §3.3 (reutilización 10 min) vs. RN-05 §7.2 (30 min) | Ventanas distintas de reutilización | PRM-COB-112 por conector, default 30 | Configurable |
| CTR-COB-17 | V2 2688 (cierre multi-día) vs. BASE §12 (cierre por turno) | Cierre de varios días vs. cierre diario | Cierre por sesión; multi-día solo con parámetro y supervisor | BASE > V2 |
| CTR-COB-18 | RN-13 §3.7 (tótem con datos de tarjeta) vs. BASE §97.6 / §105 (tokenización) | Manejo de PAN vs. no guardar tarjetas | Solo token del proveedor; tótem en M19/T06. Precisado por DEC-091: ni la migración ni los archivos de procesadora transportan PAN | BASE > RN |
| CTR-COB-19 | RN-05 §13.2 (descuentos en caja) vs. BASE (la caja no altera precios) | Descuento aplicado en la caja vs. precio definido en facturación | Bonificación documentada (producto de descuento facturado por M05), desactivada por defecto | BASE > RN |
| CTR-COB-20 | V2 2719 (recibo por cuenta) vs. cupón multi-factura | Un recibo por cuenta vs. un recibo por cupón | PRM-COB-065 configurable; default recibo por cuenta | Configurable |
| CTR-COB-21 | DEC-005 (piloto Internet) vs. prepago de la base relevada LAG (RN-12) | La cooperativa piloto de migración es LAG (DEC-088, antes DEC-081) y vende prepago: la primera migración lo requiere | COB deja el punto de cobro genérico en O5; M03 adelanta subconjunto (PA-COB-15) | DEC > RN |
| CTR-COB-22 | T05 §7.2 y §20 (CTR-DAT-05, 14, 25, 30, 40, 65, 74) vs. nombres de este anexo | Nombres de campos y dueños de colecciones distintos del modelo canónico | Renombrados `documentTypeId` → `voucherTypeId`, `fileId` → `storedFileId`, `bankAccountId` → `treasuryAccountId`, `accountingAccountRef` → `ledgerAccountId`, `approvalId` → `approvalRequestId`, `legacy` con forma de T05; `fileLayouts` pasa a T06; `cashDiscountRules` pasa a `earlyPaymentDiscountRules` de M08; numeración de recibos con `legalEntityId`; notas de alias y de `currentAccountId` ≠ `accountId` (§7.0, §7.21) | T05 > anexo |
| CTR-COB-23 | T05 PA-DAT-01 (DEC-087: cuenta por titular y entidad) vs. RF-COB-064/086 y PRM-COB-065 (un recibo por operación configurable) | Un recibo por operación podía mezclar entidades | Un recibo por entidad siempre; PRM-COB-065 solo agrupa dentro de la misma entidad (RF-COB-193, RN-COB-152) | DEC > anexo |
| CTR-COB-24 | T05 CTR-DAT-08, CTR-DAT-42 y CTR-DAT-64; M05 RF-FAC-176 (`itemClass`) vs. este anexo | `cardPlans` sin los campos que usa M14; `DEUDARED` con doble lectura (deuda publicada o saldo de redondeo); entrega de caja sin vínculo con la recepción de M14; obligaciones sin clase de ítem | `cardPlans` amplía campos (§7.15); `DEUDARED` → `agencyPublishedDebts` con [VERIFICAR] en LAG; `treasuryHandovers` con `legalEntityId` y vínculo `treasuryHandoverId`; `obligations.itemClass` y RN-COB-157; cupón por entidad (RN-COB-156) | T05 > anexo |
| CTR-COB-25 | Documento externo `NucleoTransversal-Modelo` §11.1 (aporte A9: caja de cobranza como cuenta del libro único de fondos) vs. RN-DAT-003 y la frontera M07/M14 de este anexo | El documento quiere ver en tesorería el efectivo de cajas abiertas o sin rendir; aquí la caja de cobranza es de M07 y llega a M14 recién con la rendición | La caja sigue en M07; M07 expone `cob.service.getUnremittedCash` (RF-COB-195, API-COB-92) y M14 lo muestra como línea separada "en cajas sin rendir" (RF-TES-145, RF-TES-168), sin sumarlo al disponible | DEC-101 |
| CTR-COB-26 | ProCoop y RF-COB-001 (hasta 4 vencimientos; `maxAcceptedDue` `due1`..`due4`) vs. documento externo `NucleoTransversal-Modelo` cap. 6.5 (vencimientos sin tope) | Cantidad de vencimientos de la obligación y publicada a cada ente | `dueSchedule` 1..N según el tope de M05 (PRM-FAC-163); cada ente declara `dueDateCapacity` y recibe los primeros N; `maxAcceptedDue` queda como dato de migración (RN-COB-159) | DEC-106 |
| CTR-COB-27 | ProCoop (deuda registrada al facturar y cobro bloqueado con `ID_BLO = -1`) y DEC-035 vs. documento externo `NucleoTransversal-Modelo` cap. 7.2 | Cuándo una factura es deuda cobrable y publicable | Obligación con compuerta fiscal: sin débito, cobro ni publicación hasta CAE, CAEA vigente asignado o CESP; sigue los cambios de número de M05; recibos sin ARCA (RN-COB-158) | DEC-107 |

## 21. Preguntas abiertas

### PA-COB-01 — Regla de imputación por defecto
- **Pregunta**: ¿Cómo se distribuye un pago que no cubre todas las obligaciones seleccionadas o que llega sin selección?
- **Contexto**: ProCoop imputa por comprobante y no reparte (RN-05 §3.4); BASE §103 exige saldo por servicio.
- **Opciones**: A) **(Recomendada)** Por antigüedad (primer vencimiento) con recargos primero, y elección del socio/cajero cuando la hay. B) Por prioridad de servicio configurada. C) Proporcional entre servicios.
- **Impacto si no se responde**: se aplica A; cambios posteriores requieren nueva versión de política.
- **Bloquea**: RF-COB-032, RN-COB-024 (motor RF-COB-031..042), O5.
- **Estado**: Respondida (DEC-048): opción A, por antigüedad con recargos e intereses primero, respetando la elección explícita del socio o del cajero.

### PA-COB-02 — Cuentas unificadas múltiples por titular
- **Pregunta**: ¿Un titular puede tener más de una cuenta corriente unificada?
- **Contexto**: grupos de facturación (FAC-006) y titulares con domicilios distintos.
- **Opciones**: A) **(Recomendada)** Una por grupo de facturación. B) Una única por titular. C) Libre.
- **Impacto si no se responde**: A.
- **Bloquea**: RN-COB-015, RF-COB-021..025.
- **Estado**: Avance (DEC-087): la cuenta corriente es por titular **y por entidad jurídica**; dentro de cada entidad sigue rigiendo la opción A (una por grupo de facturación) hasta que se responda. Ver RF-COB-192 y RN-COB-151.

### PA-COB-03 — Créditos entre servicios en cuenta unificada
- **Pregunta**: ¿Un saldo a favor de un servicio puede cancelar deuda de otro automáticamente?
- **Contexto**: BASE §68 vs. FAC-008 (CTR-COB-14).
- **Opciones**: A) **(Recomendada)** Automático solo en el mismo servicio; entre servicios con elección del socio o autorización. B) Siempre automático. C) Nunca.
- **Impacto si no se responde**: A.
- **Bloquea**: RF-COB-038, RN-COB-031.
- **Estado**: Respondida (DEC-049): opción A, automático solo dentro del mismo servicio; entre servicios, con elección del socio o autorización. Nunca entre entidades jurídicas distintas (DEC-087).

### PA-COB-04 — Tratamiento de excedentes
- **Pregunta**: ¿Qué hacer con el importe que excede lo adeudado?
- **Opciones**: A) **(Recomendada)** Saldo a favor en la misma cuenta, aplicable a las próximas facturas. B) Pendiente de aplicación manual. C) Devolución automática.
- **Impacto si no se responde**: A.
- **Bloquea**: RF-COB-044, RN-COB-030.

### PA-COB-05 — Diferencia entre importe pagado y esperado
- **Pregunta**: ¿Qué hacer cuando un ente o pasarela informa un importe distinto del esperado?
- **Contexto**: CTR-COB-12.
- **Opciones**: A) **(Recomendada)** Aceptar, imputar y enviar la diferencia a revisión. B) Rechazar a no identificados. C) Aceptar sin revisión dentro de tolerancia y rechazar fuera.
- **Impacto si no se responde**: A.
- **Bloquea**: RF-COB-148, RN-COB-116.

### PA-COB-06 — Significado del mínimo de pago
- **Pregunta**: ¿El mínimo de pago evita intereses o solo es umbral para la evaluación de mora?
- **Contexto**: CTA-003, CU-CTA-01.
- **Opciones**: A) **(Recomendada)** Umbral para la evaluación de mora (no cancela ni evita intereses). B) Pago mínimo tipo tarjeta (evita suspensión e intereses sobre lo pagado). C) No usar mínimo.
- **Impacto si no se responde**: A; M08 lo consume.
- **Bloquea**: RF-COB-028, RF-COB-029, RN-COB-017.

### PA-COB-07 — Pago parcial en caja
- **Pregunta**: ¿Se permiten entregas parciales y en qué canales?
- **Opciones**: A) **(Recomendada)** En caja con permiso `cob.caja.cobrarParcial`; en entes según configuración del ente. B) Siempre. C) Nunca.
- **Impacto si no se responde**: A.
- **Bloquea**: RF-COB-035.

### PA-COB-08 — Arqueo de todos los medios
- **Pregunta**: ¿El cierre declara solo efectivo o todos los medios?
- **Contexto**: CTR-COB-05.
- **Opciones**: A) **(Recomendada)** Declaración por medio (efectivo, cheques, cupones, retenciones). B) Solo efectivo, el resto se controla en tesorería.
- **Impacto si no se responde**: A.
- **Bloquea**: RF-COB-080, RN-COB-064.

### PA-COB-09 — Identificador publicado y resolutor LAG en transición
- **Pregunta**: ¿Qué identificador se publica a Red Link/SIRO para facturas nuevas y cómo se resuelven las emitidas por ProCoop?
- **Contexto**: RN-11 §1.1; CTR-COB-07.
- **Opciones**: A) **(Recomendada)** Identificador autocontenido nuevo + resolutor por alias hasta vencer las facturas ProCoop. B) Mantener el identificador LAG actual indefinidamente. C) Corte duro sin convivencia.
- **Impacto si no se responde**: no se pueden migrar cooperativas que publican con el identificador Red Link de la base relevada LAG.
- **Bloquea**: RF-COB-184, RF-COB-186, RN-COB-144..147, O11.
- **Estado**: Respondida (DEC-050): opción A, identificador nuevo autocontenido y resolución por clave ProCoop hasta que venzan sus facturas.

### PA-COB-10 — Registración bancaria de rendiciones
- **Pregunta**: ¿Cómo se informa a tesorería la acreditación esperada?
- **Opciones**: A) **(Recomendada)** Por fecha de acreditación. B) Por recibo. C) Por caja/rendición.
- **Impacto si no se responde**: A.
- **Bloquea**: RF-COB-171, RN-COB-095, M14.

### PA-COB-11 — Cargos en contracargos
- **Pregunta**: ¿Se cobran interés diario y comisión de reversión al socio?
- **Opciones**: A) **(Recomendada)** Configurable, desactivado por defecto. B) Siempre. C) Nunca.
- **Impacto si no se responde**: A.
- **Bloquea**: RF-COB-159, RN-COB-133.

### PA-COB-12 — Devoluciones por API
- **Pregunta**: ¿Las devoluciones se ejecutan por la pasarela o por tesorería?
- **Opciones**: A) **(Recomendada)** Expediente en COB; ejecución por el proveedor solo si declara la capacidad, si no orden a M14. B) Siempre por M14. C) Siempre por el proveedor.
- **Impacto si no se responde**: A.
- **Bloquea**: RN-COB-132.

### PA-COB-13 — Pasarelas prioritarias en O5
- **Pregunta**: ¿Qué conectores entran en la primera ola?
- **Opciones**: A) **(Recomendada)** SIRO + Red Link + Pagos360 + Mercado Pago. B) Solo los que use la cooperativa piloto. C) Todos.
- **Impacto si no se responde**: A.
- **Bloquea**: RF-COB-132, planificación O5/O7.

### PA-COB-14 — Cobranza offline de cobradores
- **Pregunta**: ¿Qué medios acepta un cobrador sin conexión?
- **Opciones**: A) **(Recomendada)** Efectivo y transferencia informada, con límite de efectivo por cobrador. B) Solo efectivo. C) Todos, incluido QR diferido.
- **Impacto si no se responde**: A.
- **Bloquea**: RF-COB-092.

### PA-COB-15 — Adelantar venta prepaga para la cooperativa piloto de migración
- **Pregunta**: ¿Se adelanta la venta prepaga si la cooperativa piloto de migración vende prepago?
- **Contexto**: CTR-COB-21.
- **Opciones**: A) **(Recomendada)** COB deja el punto de cobro genérico en O5 y M03 adelanta solo el subconjunto prepago. B) Mantener prepaga en ProCoop durante la convivencia. C) Adelantar todo M03.
- **Impacto si no se responde**: riesgo para la primera migración.
- **Bloquea**: RF-COB-075, O11.

### PA-COB-16 — Código de barras SIRO para importes ≥ ARS 100.000
- **Pregunta**: ¿Qué formato se usa cuando el código 0447 de 56 dígitos no alcanza?
- **Contexto**: RN-11 §1.3; RN-COB-148.
- **Opciones**: A) **(Recomendada)** Acordar con Banco Roela el formato extendido (0448/0449); mientras tanto, código electrónico y QR. B) Partir el pago en dos cupones. C) No publicar código de barras.
- **Impacto si no se responde**: facturas grandes sin código de barras.
- **Bloquea**: RF-COB-187, RN-COB-148.

### PA-COB-17 — Traslado de comisión al socio
- **Pregunta**: ¿Se traslada al socio la comisión del ente o de la pasarela?
- **Opciones**: A) **(Recomendada)** No trasladar por defecto; configurable por canal con concepto facturado. B) Trasladar siempre. C) Nunca.
- **Impacto si no se responde**: A.
- **Bloquea**: RF-COB-114, PRM-COB-142.

### PA-COB-18 — Frecuencia y distribución del resumen de cuenta
- **Pregunta**: ¿Cada cuánto y por qué canal se emite el resumen de la cuenta corriente?
- **Opciones**: A) **(Recomendada)** Mensual por grupo de facturación al cierre del ciclo, por los canales del grupo. B) Solo a demanda. C) Con cada factura.
- **Impacto si no se responde**: A.
- **Bloquea**: PRM-COB-013, JOB-COB-11.

### PA-COB-19 — Estados de colecciones sin máquina de estados (pendiente 8 del cierre)
- **Pregunta**: ¿Se define una máquina de estados para `collectorSettlements`, `gatewayTransactions`, `thirdPartyCollections` y `externalObligationImports` (M07), las cuotas `agreementInstallments` (M08), `crmCalendarEvents` (M09), `technicalProcedures` (M10), `fixedAssetValueChanges` y `mrpRuns` (M13), o se declaran sin máquina?
- **Contexto**: la corrección de inconsistencias encontró estas colecciones con campo `status` sin valores ni transiciones; `agreementInstallments` tenía valores sin transiciones.
- **Opciones**: A) **(Recomendada)** Definir una máquina por colección (estados y tabla de transiciones con evento) en el anexo dueño según T05. B) Declararlas sin máquina (estado informativo libre).
- **Impacto si no se responde**: A.
- **Bloquea**: §8 de M07, M08, M09, M10 y M13; valores de `status` en T05.
- **Estado**: Asumida (DEC-072): opción A. Máquinas definidas en §8.17 de este anexo (cuatro colecciones de M07), §8.14 de M08 (`agreementInstallments`) y §8.13 de M09 (`crmCalendarEvents`). M10 (`technicalProcedures`) y M13 (`fixedAssetValueChanges`, `mrpRuns`) deben definir las suyas y citar esta PA.

### PA-COB-20 — Colección `collectionAccountingGroups` (cierre, cuarta ronda)
- **Pregunta**: M15 (RN-CON-028, §7.39) nombra `collectionAccountingGroups` con dueño M07, y `accounts.accountingGroupId` (M01, PA-PER-17) apunta a los grupos contables, pero M07 no declaraba la colección. ¿M07 la declara y dónde viven las cuentas del grupo?
- **Contexto**: en ProCoop, `GRU_CON` guarda el grupo con sus columnas de cuenta (`CTA_COBF`, `CTA_COBR`, `CTA_CAJ`, etc.). M15 §7.39 centraliza las cuentas asignadas a entidades de otros módulos en `entityAccountAssignments`.
- **Opciones**: A) **(Recomendada)** M07 declara `collectionAccountingGroups` (`code`, `name`, `status` `active`/`inactive`) en la ola O5, sin cuentas; las cuentas van en `entityAccountAssignments` de M15 con `entityType = collectionAccountingGroup`. B) Declarar el grupo con las cuentas embebidas en M07.
- **Impacto si no se responde**: A.
- **Bloquea**: M15 RN-CON-028; M01 `accounts.accountingGroupId`; T05 §7.2.
- **Estado**: Asumida (DEC-072): opción A. Aplicado en §7.36 y §8.18; M01 cita el destino. T05 debe agregar `collectionAccountingGroups` (M07) y la referencia de `accountingGroupId`.

### PA-COB-21 — Residuales de los entregables: referencias, nombres canónicos y estados (5-11-2026)
- **Pregunta**: ¿Qué destino tienen las referencias que los entregables marcaron sin colección (`closeGroupId`, `settlementId`, `surchargeProductId`, `deviceIds`, `importLayoutId`, `controlLayoutId`, `reusedFromId`, `billingTypeId`, `productIds`; `externalQrId` y `externalPaymentId` con tipo `ObjectId`), qué nombres se adoptan (`cashSessionId`, `gatewayTransactionId`, `directDebitBatchId`, `gatewayConnectorId`) y qué valores y transiciones tienen `collectors.status`, `gatewayConnectors.status` y las colecciones con estados sin transiciones o sin estado inicial explícito?
- **Contexto**: residuales de `docs/entregables-analisis-diseno/03-er/M07-COB-cuenta-corriente-cobranza.md` §7 y de `06a-indice-cobertura-secuencias-estados.md` §7 (INC-06-01, 02, 08).
- **Opciones**: A) **(Recomendada)** Destinos de §7.37 (T05 §7.2.1 cuando existe; `fileLayouts` de T06 para los layouts de entes, como dice §7.20; `voucherTypes` para `billingTypeId`, ex `COD_TPFC`; `closeGroupId`, `externalQrId` y `externalPaymentId` no son referencias), nombres canónicos con alias "antes" y máquinas de §8.19 (`collectors` y `gatewayConnectors` con `active`, `suspended`, `inactive`). B) Mantener `[VERIFICAR]` hasta revisar con la cooperativa.
- **Impacto si no se responde**: A.
- **Bloquea**: diagrama ER de M07; diagramas de estados de M07; T05 §7.2.1 y COL-COB-11, 21, 34.
- **Estado**: Asumida (DEC-072): opción A. Aplicado en §7.35 (filas corregidas con "antes"), §7.37 y §8.19. T05 debe reflejar: `cashSessionId` en COL-COB-11 (antes `sessionId`), los tres campos de layout en COL-COB-21 en lugar de `fileLayoutIds[]`, y en §7.2.1 `closeGroupId`, `externalQrId` y `externalPaymentId` como "no es referencia", `deviceIds` (M07 `collectors`) → `fieldDevices`, `productIds`/`surchargeProductId` (M07) → `serviceProducts`, `billingTypeId` (M07) → `voucherTypes`. También se cierran con los destinos de T05 §7.2.1 `gatewayConnectors.connectionId` (→ T06 `integrationConnections`), `thirdPartyBillers.productId` (→ M02 `serviceProducts`) y `collectionReportSchemes.taxIds` (→ M06 `taxDefinitions`).
- **Eventos de solicitud para T06 (5-11-2026)**: Asumida (DEC-072): M07 declara en §12.1 EVT-COB-28 `cob.paymentIntent.requested` (antes `cob.payment-intent.requested`), EVT-COB-29 `cob.debtPublication.requested` (antes `cob.debt-publication.requested`) y EVT-COB-30 `cob.directDebit.batchRequested` (antes `cob.direct-debit.batch-requested`), que T06 §12 consumía sin que M07 los publicara; payload mínimo con `paymentIntentId`, `agencyDebtExportId` y `directDebitBatchId`; consumidor T06. T11 §12.4 registra los alias.


## 22. Trazabilidad

### 22.1 Requisitos BASE

| Requisito BASE | Cobertura en M07 |
|---|---|
| §105 solución 5 "Sistema de cobranza" (cuenta corriente, cajas, cobradores, canales, imputación; mora/convenios/garantías/incobrables → M08) | RF-COB-001..097, RF-COB-154..156, RF-COB-173..189; RN-COB-001..078, 139..143; PAN-COB-01..16, 28..36 |
| §105 solución 6 "Pasarelas de pago" (tarjetas, billeteras, QR, débito, transferencias, redes extrabancarias; tokenización; pago incierto no se reenvía) | RF-COB-098..153, 157..172; RN-COB-079..138; PAN-COB-17..27; sección 13 |
| §11 CU-11 cobro parcial | RF-COB-035, 055..067; CU-11; ESC-COB-P01 |
| §12 CU-12 cierre de caja | RF-COB-068..085; CU-12; CTR-COB-05 |
| §13 CU-13 pago online | RF-COB-131..153; CU-13; CU-COB-12; ESC-04 |
| §39.4–39.6 (accesos del socio a cuentas autorizadas) | PAN-COB-35; API-COB-77..82; ESC-COB-P06 |
| §40 caso integrado | 16.1; datos demo sección 18 |
| §44 factura agrupada y pendientes §44.8 | CU-FAC-01; CTR-COB-01 |
| §68 cuenta corriente unificada (CTA-001..004, CU-CTA-01) | RF-COB-021..030; RN-COB-014..019; CU-CTA-01; CTR-COB-14 |
| §69, §97.3 (convenios, incobrables) | Delegado a M08 (sección 2.2); obligaciones con `lifecycle` |
| §75 (comunicaciones de cobro) | RF-COB-090, API-COB-40, API-COB-64 (vía M10) |
| §97.6 (seguridad de pagos, PCI) | 7.0 datos sensibles; CTR-COB-18; RN-COB-117 |
| §103 (FAC-005..012, CU-103, §103.6) | Obligación por servicio; CU-103; CTR-COB-01, 02 |
| MER-005, MER-006 (canales y cuenta corriente) | 5.2, 5.8, 5.10 |
| MER-007 (cobradores) | RF-COB-091..097; RN-COB-139..141; PAN-COB-28, 29 |
| MER-019 (punitorios) | CTR-COB-13; invocación `mor.surcharge.quote` |
| Criterios BASE 37, 63, 71, 74, 81 (ciclo completo, pago en proceso, trazabilidad factura-cobro-asiento, saldo por servicio, documento hasta acreditación) | RF-COB-016, RN-COB-002, P-COB-19, sección 12 (eventos a M15/M14), CU-COB-12 |
| AGR-011 (saldo derivado) | RN-COB-002, CTR-COB-03 |
| AGR-012 (duplicados) | RN-COB-040, ESC-01, CTR-COB-06 |
| AGR-013 (devoluciones) | RN-COB-131, 132; PA-COB-12 |
| AGR-016 (idempotencia y excepciones) | 7.0 `operationId`; 11 `Idempotency-Key`; `collectionExceptions` |
| AGR-021 (conciliación) | RN-COB-136; P-COB-14; PAN-COB-27 |
| AGR-022 (corte temporal de reportes) | Sección 15 |
| AGR 5.3, 5.5; ESC-01, ESC-04 | 17.6 |
| DEC-001..005 | Stack y bóveda (sección 13), webhook propio (CTR-COB-11), piloto (CTR-COB-21) |

### 22.2 RN-05 Cobranzas, cajas y entes recaudadores

| Sección RN-05 | Destino en M07 |
|---|---|
| §1 Panorama | Secciones 1, 2 |
| §2 Caja: apertura, operación y cierre | RF-COB-055..058, 068..085; RN-COB-046..049; P-COB-05 |
| §3.1 Consulta de deuda y orden | RF-COB-001..012; PAN-COB-01, 10 |
| §3.2 Orden de aplicación obligatorio | RN-COB-020..028; PRM-COB-025..029 |
| §3.3 Pago parcial, entrega y anticipos | RF-COB-035, 043..054; RN-COB-050..052; PA-COB-07 |
| §3.4 Registración del pago | P-COB-03; RN-COB-001..006; CTR-COB-02, 03 |
| §3.5 Anulación | RF-COB-079; RN-COB-073..078; P-COB-04; CTR-COB-04 |
| §4.1 Configuración del ente (`BANCOS`) | 7.19; PAN-COB-17 |
| §4.2 Selección del formato por reflexión | Reemplazado por `fileLayouts` declarativo de T06 (RN-COB-079..081; CTR-DAT-05) |
| §4.3 Identificador de comprobante | `paymentReferences`; RN-COB-082..084; PA-COB-09 |
| §4.4 Exportación | P-COB-06; RF-COB-098..105 |
| §4.5 Importación | P-COB-07; RF-COB-106..113 |
| §4.6 Validaciones por comprobante | RN-COB-085..092; CTR-COB-12 |
| §4.7 Registración de la rendición y conciliación | RN-COB-093..100; PA-COB-10 |
| §5.1 Red Link | 13; RN-COB-144..147 (LAG); `agencyPublishedDebts` |
| §5.2 SIRO | 13; RN-COB-148; PA-COB-16; JOB-COB-03 |
| §5.3 Banelco, Pago Fácil, Rapipago, Cobro Express | 13; PRM-COB-094 |
| §5.4 Duplicados y anticipos en entes | RN-COB-040; CTR-COB-06 |
| §6.1 Adhesión | RF-COB-119..123; 7.25 |
| §6.2 Presentación y rendición de débitos | RF-COB-124..130; RN-COB-101..109; P-COB-08 |
| §7.1 Modelo `EntidadDigital` | Interfaz `PaymentConnector` (sección 13) |
| §7.2 Pagos360 | 13; 7.27 (origen `PAGOS360`) |
| §7.3 MercadoPago | 13 |
| §7.4 Otras pasarelas | 13 (Extensión) |
| §8 Tabla por cooperativa | Datos de configuración por tenant en migración (19.1 `BANCOS`) |
| §9.1–9.3 Laguna Larga | RN-COB-144..150; 19.2 |
| §10 Parámetros V2 | Sección 14 (14.1–14.6) |
| §11 Implicancias | Decisiones de diseño en secciones 6, 7, 9 |
| §12 Dudas abiertas | PA-COB-01..18 |
| §13.1 Apertura, cierre, arqueo y diferencias | RN-COB-060..066; PA-COB-08 |
| §13.2 Botonera y validaciones | RF-COB-059..067; PAN-COB-10; CTR-COB-19 |
| §13.3 Pago a proveedor y otras operaciones | RF-COB-072..076; PRM-COB-065 |
| §13.4 Anulación y efectos | RF-COB-079; RN-COB-073..078 |
| §13.5 Imputación automática, anticipos, créditos | RN-COB-037..045; P-COB-16 |
| §13.6 Convenios desde la caja y cuotas | Delegado a M08 (cobro de cuotas en PAN-COB-10; PRM-COB-028) |
| §13.7 Entidades digitales: reglas adicionales | RN-COB-110..130 |
| §13.8 Venta prepaga en caja | Delegado a M03 (cobro en PAN-COB-10; PA-COB-15) |
| §13.9 Cobranza por terceros | RF-COB-177..183; RN-COB-142 |
| §13.10 Entes: reglas adicionales | RN-COB-085..100 |
| §13.11 Informes de cobranzas | Sección 15; `collectionReportSchemes` |
| §13.12 Cheques | `paymentTenders.thirdPartyCheque`; PAN-COB-33; M14 |
| §13.13 Implicancias adicionales | Secciones 6, 9, 13 |

### 22.3 RN-13 Pasarelas de pago (excepto §16 Interbanking → M14)

| Sección RN-13 | Destino en M07 |
|---|---|
| §1 Panorama | Sección 13 |
| §2.1 Patrón de transporte | T06 (sección 13) |
| §2.2 Ciclo de vida de la solicitud | 8.4 `paymentIntents` |
| §2.3 Webhook, polling o archivo | P-COB-09, JOB-COB-04/05/06; CTR-COB-11 |
| §2.4 Elección de la pasarela | PRM-COB-114; `paymentChannels` |
| §3.1–3.3 Pagos360 ambiente, endpoints, link | 13; PAN-COB-23..25; CTR-COB-16 |
| §3.4 QR en caja | `staticQrCodes`; CU-COB-10; CTR-COB-10 |
| §3.5 Débito automático | P-COB-08 |
| §3.6 Contracargos, reversiones, anulaciones | P-COB-11; RN-COB-133..135; PA-COB-11 |
| §3.7 Tótem de autogestión | Delegado a M19/T06; CTR-COB-18 |
| §4 SIRO | 13; JOB-COB-03; PAN-COB-18 |
| §5 MercadoPago | 13 |
| §6–§13 Macro, NaranjaX, PayFun, PagosTIC, SiPago, Helipagos, ProvinciaNet, ProntoPago | 13; CTR-COB-09 |
| §14 OffLine y resumen de tarjeta de terceros | Conector `offline`; `thirdPartyBillers.summaryServiceConnectorId` |
| §15 Cobertura por tipo de medio | `gatewayConnectors.capabilities`/`allowedMethods` |
| §16 Interbanking | **M14** (fuera de alcance) |
| §17 Hallazgos de seguridad | CTR-COB-08; 7.0; RN-COB-117 |
| §18 Resto de `ProMod_WebService` | T06 |
| §19.1–19.4 Implicancias (prioridades, diseño genérico, webhooks, no replicar) | PA-COB-13; sección 13; CTR-COB-09..11 |
| §20 Dudas abiertas | PA-COB-05, 11, 12, 13, 17 |

### 22.4 RN-11 Específicas Laguna Larga (líneas 1-181 y 289-fin)

| Sección RN-11 | Destino en M07 |
|---|---|
| Resumen ejecutivo; Confirmado en la base demo | 19.2; RN-COB-149 |
| §1.1 Importador Red Link LAG (modelo 264) | RN-COB-144..147; ESC-COB-L01..L03; CTR-COB-07 |
| §1.2 Envío de deuda a Red Link | P-COB-06; PRM-COB-083 |
| §1.3 SIRO en LAG | RN-COB-148; PA-COB-16; ESC-COB-L04 |
| §1.4 Rama "LAGU" | RN-COB-150 (Descartado) |
| §5 Datos a confirmar en `PR_LAG_DEMO` | Columnas [VERIFICAR] de 6.12; 14.6 |
| Implicancias (by-pass y transición) | 19.2; PA-COB-09, PA-COB-15 |
| Dudas abiertas | PA-COB-09, PA-COB-16 |

### 22.5 RN-12 Configuración real de Laguna Larga

| Sección RN-12 | Destino en M07 |
|---|---|
| §1 Sigla | V2 2264 Descartado (14.6) |
| §2 Entes recaudadores (`BANCOS`) | RN-COB-149; 19.1 |
| §3 Pasarelas online | 13; PA-COB-13 |
| §4 Parámetros relevantes | Sección 14 (PRM-COB-058 diferir, PRM-COB-140) |
| §5 Implicancias | 19.2 |
| §6 Dudas abiertas | PA-COB-09, PA-COB-15 |

### 22.6 Tablas CAT §6 (Cobranzas) y §7 (Entes y pasarelas)

| Tabla CAT | Colección / destino |
|---|---|
| `ANUIT_PAGSO` | `allocations` (`status = reversed`) |
| `ANUPAG_SOC` | `receipts` (`status = voided`) |
| `ANUPLAN_CAJ` | `cashOperations` (`status = voided`) |
| `CAJAS` | `cashSessions` |
| `CAJASJP` | `cashRegisters` |
| `CAJAS_QR` | `staticQrCodes` |
| `COBRANZA_LOG` | Auditoría T02 (7.34) |
| `CUPONTAR` | `paymentTenders` (tarjeta) |
| `DESCUENTO_CAJA` | `earlyPaymentDiscountRules` de M08 (CTR-DAT-40; antes `cashDiscountRules`) |
| `EFEC_OP` | `paymentTenders` (efectivo) |
| `ESQUEMAS_INFORMES_COBRANZAS` | `collectionReportSchemes` |
| `IT_PAGSO` | `allocations` |
| `PAG_SOC` | `receipts` |
| `PLAN_CAJ` | `cashOperations` |
| `RETENCIO` | `paymentTenders` (retención) |
| `TALONFAC_PAGO` | `paymentCoupons` / `allocations` |
| `TARJETAS` | `cardPlans` |
| `TARJETAS_RECARGO` | `cardPlans.installmentPlans` |
| `TIP_VAL` | `paymentMethods` |
| `TRAN_OP` | `paymentTenders` (transferencia) |
| `VALORES` | `paymentTenders` (cheques) → cartera M14 |
| `BANCOS` | `collectionAgencies` |
| `CANALES_PAGOS` | `paymentChannels` |
| `DEBITO_EXCLUSION` | `directDebitMandates.exclusions` |
| `DEUDARED` | `agencyPublishedDebts` |
| `DEUDARED_TIPO` | `agencyPublishedDebts` / configuración del ente |
| `FACTURAS_TERCEROS` | `thirdPartyCollections` |
| `PAGOS360` | `paymentIntents` |
| `PAGOS360_EXTRAS` | `paymentIntents.metadata` |
| `PAGOS360_ITEMS` | `paymentIntents.items` |
| `PAGOS360_PAGOS` | `gatewayTransactions` |
| `RED_LINK` | `agencyPublishedDebts` |
| `SIRO_BASEDEUDA` | `agencyDebtExports` |
| `TERCEROS` | `thirdPartyBillers` |

Otras tablas citadas (no de §6-§7): `FACTURAS`, `DEUDAVTA`, `COMPNOTI`, `ANUFAC` → `obligations`; `ANTICIPOS`, `ANTIFACTU`, `CREDITOS_NOAUTOMATICOS` → `creditBalances`; `TALONFAC` → `paymentCoupons`; `SUMSOC`, `SUMSOC_EXTRAS`, `ADHSOC` → `directDebitMandates`; `IT_RETM` → `paymentTenders`; `IT_PAGSO_INTERES*` → M08; `CAPITAL` → `obligations`; `ENTIDA*` (DFA M10) → `collectionAgencies` [VERIFICAR].

### 22.7 Formularios ProMod_Cobranzas (INV)

| Formularios / controles | Pantalla |
|---|---|
| `ConsultaDeuda`, `frmConsultaComprobante`, `frmInfoFactura`, `frmPagosPorComprobante`, `frmCobranza_DetellePagos`, `frmTotalesTipoComprobante`, `frmComprobantePorCuenta`, `ConsultaFacturacionEntidad` | PAN-COB-01 (y PAN-COB-18) |
| `frmAnticipo` (`ModoAnticipo`) | PAN-COB-03 |
| `frmCancelacionAutomatica` | PAN-COB-05 |
| `abm_QrEstatico` | PAN-COB-08 |
| `frmAperturaCaja`, `frmSeleccionCaja` | PAN-COB-09 |
| `frmCobranza`, `frmEntrega`, `frmSeleccionVencimiento`, `frmCargaMedioDePago`, `frmCobranza_Validaciones`, `frmConfirmarPago`, `frmResumenPagos`, `ResumenPago`, `FormasPago`, `AyudaCobranza`, `frmInfoRecargo`, `frmConceptosCobrar`, `frmCobranza_Donaciones`, `frmCobranza_Vivienda`, `frmCobranza_Obra`, `frmDetallecuotas`, `frmMensaje`, `frmCobranzaQrEntidades`; tipos `Caja`, `MedioPago`, `Operacion`, `IgnorarVueltoAutomatico` | PAN-COB-10 |
| `frmAnulacionOperacion` | PAN-COB-11 |
| `frmCierreCaja` | PAN-COB-12 |
| `frmInformePresentacionCajero` | PAN-COB-13 |
| `frmReimpresionRecibos`, `frmImpresiones` | PAN-COB-14 |
| `abm_DescuentoCaja` | PAN-COB-16 |
| `abm_Bancos`, `FrmEntidades`, `FrmEntidades_Config` | PAN-COB-17 |
| `frmArchivoEntidadesRecaudadoras`, `frmArchivoEntidadesRecaudadoras_Result`, `frmBaseDeudaSiro`, `frmConsultaBaseDeudaSiro` | PAN-COB-18 |
| `frmResultadoImpEntidades`, `frmSelectFecha_APISIRO` | PAN-COB-19 |
| `frmArchivoMorosidad`, `frmArchivoNovedades` | PAN-COB-20 |
| `frmPagos360_DebitosAutomaticos`, `frmPagos360_DebitosAutomaticos_Detalle` | PAN-COB-21 |
| `frmArchivoDebitosAutomaticos`, `frmArchivosDebitosAutomaticos` | PAN-COB-22 |
| `frmPagos360_Config`, `frmSIRO_Config`, `frmMercadoPago_Config`, `frmMacro_Config`, `frmNaranjaX_Config`, `FrmPayFun_Config`, `FrmPagoTic_Config`, `frmSiPago_Config`, `frmHelipagos_Config`, `frmProntoPago_Config`, `FrmProvinciaNet_Config`, `abm_Canales_Pagos`, `FrmRecargoDiarioReversiones` | PAN-COB-23 |
| `frmPagos360`, `frmPagos360_BuscarPagos`, `frmPagos360_Info`, `frmPagos360_Pagos`, `frmPagos360_Progress`, `frmPagos360_SearchId`, `frmPagos360_NuevoSiro`, `frmCobranza_Pagos360`, `frmCobranza_WebPagos360`, `WebPagos360`, `frmCobranzaCoopOnline`, `frmProvinciaNetConsultaQrLote` | PAN-COB-24 |
| `frmCobranza_LinkPagos360` | PAN-COB-25 |
| `abm_Terceros`, `frmCobranzaTerceros` | PAN-COB-30 |
| `frmBloqueoMasivoFacturas` | PAN-COB-31 |
| `frmCobranza_ImportarFacturas`, `frmComprobantesAdministracionPublicaRAWConsulta` | PAN-COB-32 |
| `frmCobranza_ConsultaCheques` | PAN-COB-33 |
| `abm_Moratas`, `abm_TabMora`, `frmCambioGarante`, `frmPrescripcionDeuda`, `frmPrescripcionDeuda_Confirmar`, `frmReconstruccion_Cuotas`, `frmAgregarDeudaCuotas`, `frmPagosDesconectados` | M08 (10.37) |
| `frmConfiguracionPrepaga`, `frmConfiguracionPrepaga_TipoFac`, `frmVentaPrepaga`, `frmVentaPrepagaRapida` | M03 (cobro en PAN-COB-10) |

### 22.8 Otras fuentes

| Fuente | Cobertura |
|---|---|
| DFA M9 (Cobranzas), M10 (Entes), proceso de cobro | Secciones 5, 9, 10 |
| FIC 4–6 (fichas de integración de entes y pasarelas) | Sección 13 |
| README REL 148–160 (menú de cobranzas de la DEMO) | Sección 10 |
| RN-09 §COBRANZA (parámetros V2, líneas 975–1244) | Sección 14 |
| CNX (layouts, DataTable, PWA offline) | Sección 10 |
| DEC-014 Reconexión al pagar | RF-COB-078 |
| DEC-019 Ola del capital social | RF-COB-176, §7.34 `CAPITAL` |
| DEC-029 Deuda previa en el domicilio | RF-COB-018, RN-COB-155 |
| DEC-045 Deuda en cambio de titularidad | RN-COB-155, §12.2 `per.ownership.changed`, ESC-COB-E04 |
| DEC-048 / DEC-049 / DEC-050 | PA-COB-01, PA-COB-03, PA-COB-09 (Respondidas); RF-COB-032, 038, 184, 186; RN-COB-024, 031 |
| DEC-051 Interés en pago online | RF-COB-063 |
| DEC-052 Plazos de prescripción | §12.2 `mor.prescription.executed` |
| DEC-064 / DEC-087 Entidad jurídica, cuenta por titular y entidad, recibo por entidad, historia de 36 meses | §7.0, §7.1, §7.2, §7.12, RF-COB-191..194, RN-COB-151..154, EVT-COB-04, PA-COB-02, CTR-COB-23, ESC-COB-E01..E05 |
| T05 §20 (CTR-DAT-05, 14, 25, 30, 40, 65, 74) | §7.0, §7.12, §7.16, §7.20, §7.21, CTR-COB-22 |
| T05 CTR-DAT-08, 42, 64; M05 RF-FAC-176; T04 RF-CFG-136 y EVT-CFG-20 | §7.0, §7.2 `itemClass`, §7.15, §7.22 `agencyPublishedDebts`, §7.29, §7.31, RN-COB-156, RN-COB-157, EVT-COB-04, EVT-COB-13, §12.2, CTR-COB-24, ESC-COB-E06..E07 |
| DEC-101 Cajas sin rendir en la posición de tesorería (aporte A9 de `NucleoTransversal-Modelo` §11.1) | §2 (fila M14), RF-COB-195, API-COB-92, CTR-COB-25 |
| DEC-104 Cantidad de tablas de CAT §7 (13, no 14) | Encabezado (fuentes consolidadas); §22.6 |
| DEC-106 Tope de vencimientos por tenant, tipo de comprobante o servicio | §2 (fila M05), RF-COB-001, RF-COB-099, RF-COB-101, RN-COB-159, `obligations.dueSchedule`, `collectionAgencies.dueDateCapacity` y `maxAcceptedDue`, `agencyDebtExports.totals`/`publishedDueCount`, P-COB-01 paso 4, PAN de obligaciones, PRM-COB-087, ESC-COB-R11, CTR-COB-26 |
| DEC-107 Comprobante rechazado por ARCA vuelve a borrador; nada se publica antes de la autorización | §2 (fila M05), RF-COB-001, RF-COB-087, RF-COB-101, RF-COB-104, RN-COB-158, `obligations.fiscalGate` y `sourceDocument`, índices, §8.1, §8.3, P-COB-01 pasos 4, 4.1 y 5, P-COB-03 paso 8, §12.2 (EVT-FAC-22, EVT-FAC-23, EVT-FIS-01/02), ESC-COB-R10, ESC-COB-R12, CTR-COB-27. Ronda de cierre (10-11-2026; M05 RN-FAC-165): vencimientos corridos por autorización tardía en RN-COB-158 punto 3, `obligations.dueScheduleShift`, `fiscalGate.lateAuthorizationGraceDays`, P-COB-01 paso 4.1 y §12.2 EVT-FAC-13 |

### 22.9 Resumen de conteos

RF: 195 (RF-COB-001..195) · RN: 159 (RN-COB-001..159) · Colecciones propias: 44 (46 menos `cashDiscountRules` y `fileLayouts`, CTR-DAT-40 y CTR-DAT-05) · Pantallas: 36 (PAN-COB-01..36) · API: 92 (API-COB-01..92) · Eventos publicados: 23 · Jobs: 22 · Casos de uso: 9 de BASE + 16 nuevos · Parámetros: PRM-COB-001..142 (tabla 14) · Reportes: 23 · Contraposiciones: 27 · Preguntas abiertas: 18. *Reemplazado (10-11-2026, DEC-106 y DEC-107): "RN: 157 (RN-COB-001..157) · … · Contraposiciones: 25".* *Reemplazado (10-11-2026, DEC-101): "RF: 194 (RF-COB-001..194) · … · API: 91 (API-COB-01..91) · … · Contraposiciones: 24".*
