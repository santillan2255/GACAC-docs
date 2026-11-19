# M14 TES — Tesorería y bancos

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Estado | Especificación consolidada — pendiente de validar preguntas abiertas |
| Solución (BASE §105) | ERP (principal: tesorería, bancos, valores, flujo de fondos); Pasarelas de pago (conciliación de acreditaciones netas contra banco); APIs (Interbanking, eCheq, cotizaciones, archivos bancarios) |
| Olas | **O5** (piloto: cuentas bancarias propias, entidades, categorías y conceptos, movimientos básicos, rendición de cajas de cobranza hacia tesorería, caja de tesorería, depósito, importación de extractos y conciliación asistida de acreditaciones y depósitos de la cobranza del piloto, moneda ARS) · **O8** (tesorería completa: valores de terceros, cheques propios y chequeras, eCheq, cupones de tarjetas, retenciones recibidas, cajas para pagos a proveedores, ejecución financiera de órdenes de pago, Interbanking, multimoneda y cotizaciones, flujo de fondos proyectado y escenarios, compromisos, cierre de cajas de tesorería completo, informes) · **O9** (pago de haberes: archivo bancario y conciliación del lote que liquida M16) · **O11** (informes avanzados y BI sobre cubos de tesorería) |
| Dueño de datos | `financialInstitutions` (catálogo plataforma + altas del tenant), `bankBranches`, `treasuryAccounts`, `treasuryAccountSigners`, `treasuryCategories`, `treasuryConcepts`, `instrumentTypes`, `checkDrawerAccounts`, `treasuryOperations`, `treasuryMovements`, `bankDeposits`, `bankStatementImports`, `bankStatementLines`, `statementImportProfiles`, `reconciliations`, `reconciliationMatches`, `reconciliationRules`, `interbankingConnections`, `interbankingSyncRuns`, `interbankingBalanceSnapshots`, `paymentFiles`, `thirdPartyChecks`, `checkEvents`, `checkbooks`, `ownChecks`, `cardPlans` (solo lectura; dueño M07, CTR-DAT-08), `cardVouchers`, `cardPresentations`, `cardSettlements`, `receivedWithholdings`, `withholdingPresentations`, `paymentCashSessions`, `cashRemittances`, `treasuryCashClosings`, `paymentExecutions`, `tenantCurrencySettings`, `exchangeRates`, `plannedCashItems`, `fundCommitments`, `cashFlowScenarios`, `cashFlowSnapshots`, `payrollPaymentBatches`, `treasurySettings` |
| Fuentes consolidadas | BASE §21 (CU-21), §13 (CU-13, conciliación bruto/comisión/neto), §39.6 (rol Tesorería), §40.3 pasos 10–12, §52 (CU-FIS-01, interfaz Tesorería), §75 (conciliaciones y controles, CU-CON-01), §76, §78 (OPE-004, circuito financiero integrado, CU-OPE-01), §80, §98, §101, §102.6 (ESC-01, ESC-04), §102.8 (agenda Caja/tesorería), §104 (SUE-009, SUE-013), §105, §106; AGR-011, AGR-012, AGR-013, AGR-016, AGR-028; DFA M18 (Tesorería); REL §1 fila Tesorería del menú; RN-08 §1.1–1.4, §2.1–2.9, §4.1–4.4, §11.5, §12.1, §12.5 (archivos bancarios), §13, §14, §15.1, §15.3 (`clsPagoFacturas` e informes de pagos y previsiones), §15.7; RN-13 §16.1–16.4 y §17; FIC 11.1–11.3; CAT §16 (23 tablas) y tablas relacionadas de §8/§9/§15/§20/§29 (`VALORES`, `CUPONTAR`, `RETENCIO`, `RETS_TIPO`, `TARJETAS`, `TARJETAS_RECARGO`, `TIP_VAL`, `TRAN_OP`, `EFEC_OP`, `CAJAS`, `PLAN_CAJ`, `PREV_COM`, `SU_AUDIT_TRA_INTERBANKING`, `SU_EMP_CBU`, `FIRMASELECTRONICAS`); RN-09 §6.4 grupo TESORERÍA (33 parámetros); INV `ProMod_Tesoreria.md` (21 formularios); CNX §2.4, §3.1, §4.1 (patrones de pantalla y permisos) |


> **Norma de implementación (DEC-111, DEC-112, DEC-110, DEC-113).** Construcción GoodApps: **.NET 10**, **ASP.NET Core**, **EF Core**, **Azure SQL** (base compartida, `TenantId` en tablas de negocio), front **React 19**, **Microsoft Azure** (Container Apps, Blob, Queue, Key Vault, Application Insights), identidad **OpenIddict**. Modelo físico: `07-modelo-relacional-azure-sql.md` y `07-catalogo-tablas-sql.md`. Checklist e impacto: `06-impacto-adaptacion-stack-goodapps.md` (**DIR-13**).
>
> **Lectura:** «colección» en este anexo = **entidad lógica**; tablas, columnas y FK en `07-*`. RF/RN/CU del anexo **no cambian** por el stack.


## 1. Objetivo

Administrar el dinero de cada cooperativa (tenant) con trazabilidad completa desde el hecho que lo origina hasta su acreditación o débito bancario y su efecto contable, para que la gerencia pueda **ver cuánto dinero tiene disponible, qué está en tránsito, qué compromisos próximos podrían consumirlo y cuál será su posición proyectada** (BASE §21, "Resultado esperado").

El módulo cubre: cuentas bancarias propias y demás cuentas financieras; movimientos de tesorería y bancarios; conciliación bancaria asistida con importación de extractos e Interbanking; valores de terceros (cheques físicos y eCheq recibidos); cheques propios, chequeras y eCheq emitidos; cupones de tarjetas y sus liquidaciones; retenciones recibidas (sufridas) y su destino; cajas para pagos a proveedores; ejecución financiera de las órdenes de pago que origina M12; rendiciones de cajas de cobranza hacia tesorería y su depósito; cierre de cajas de tesorería; monedas y cotizaciones; planificación y proyección del flujo de fondos; compromisos de fondos (AGR-028, coordinado con M15); ejecución del pago de haberes (archivo bancario, la liquidación la hace M16); e informes de tesorería.

Principios rectores, todos obligatorios:

1. **Un cobro esperado no es disponibilidad bancaria** (BASE §21). El sistema distingue siempre: disponible, en tránsito, en cartera, a cobrar, proyectado.
2. **Cobro confirmado y acreditación bancaria son momentos distintos** (BASE §78); los cargos y retenciones se explican sin reducir lo cancelado por el asociado (BASE §13, CU-13).
3. **Cada peso se explica** (AGR-011, AGR-012): todo movimiento tiene origen, causa, autor y contrapartida; los saldos se derivan de movimientos válidos, nunca de campos editables.
4. **Nada se borra**: se anula o revierte con vínculo al original (guía §5; AGR-013).
5. **Ninguna acción se ejecuta dos veces** por un reintento (AGR-016): idempotencia en pagos, archivos, importaciones y conciliaciones.
6. **El pago neto al tercero y el ingreso de retenciones al organismo son movimientos distintos** (BASE §52).

## 2. Límite y responsabilidades

### 2.1 Qué hace TES

| Ámbito | Responsabilidad de TES |
|---|---|
| Cuentas financieras | Alta, configuración, saldos operativo y contable, firmantes, vínculo con Interbanking, cuenta contable de referencia (la regla contable la resuelve M15). |
| Movimientos | Registro único de toda entrada y salida de fondos en cualquier cuenta financiera (banco, caja de tesorería, caja de pagos, cuenta de movimientos de rechazados, cuentas de tránsito), con origen. |
| Conciliación bancaria | Importación de extractos, descarga de movimientos por Interbanking, conciliación asistida y manual, cierre de conciliación con saldo de extracto, partidas pendientes, creación de movimientos desde líneas no registradas. |
| Valores | Custodia y ciclo de vida de cheques de terceros (físicos y eCheq), cheques propios y eCheq emitidos, chequeras, cupones de tarjetas, retenciones recibidas. |
| Rendiciones | Recepción, verificación, aceptación u observación de la rendición de cada caja de cobranza cerrada por M07; traspaso a la caja de tesorería y a cartera; depósito bancario. |
| Pagos | Ejecución financiera de órdenes de pago aprobadas por M12 (medios, firma, entrega, archivo bancario, débito, conciliación); pagos a organismos de obligaciones fiscales determinadas por M06; ejecución de reintegros/devoluciones aprobados por M07 (AGR-013); ejecución del lote de haberes aprobado por M16. |
| Cajas | Caja para pagos a proveedores (apertura, tope, cierre) y caja de tesorería (arqueo y cierre diario). |
| Monedas | Configuración de monedas habilitadas por tenant y cotizaciones con fuente. |
| Flujo de fondos | Posición diaria, proyección por vencimientos a cobrar y a pagar, previsiones, escenarios, alertas. |
| Compromisos | Compromisos de fondos con fecha esperada de pago (AGR-028), con liberación y consumo; coordina con M15 para la vista presupuestaria. |
| Informes | Planilla diaria, composición de cartera, disponibilidades, libros, cheques no debitados, previsiones, cupones, valores, retenciones, depósitos a acreditar, cajas, pagos pendientes de salida y diferidos. |

### 2.2 Qué NO hace TES y a quién delega

| Tema | Responsable | Interfaz con TES |
|---|---|---|
| Cobro al socio, recibo, imputación, cajas de cobranza (apertura, operación, arqueo y cierre de la caja del cajero), pasarelas, débitos, conciliación comercial bruto/comisión/neto de pasarelas y redes, pendientes de identificación comercial | **M07 COB** | M07 invoca servicios de TES para dar de alta valores, cupones, retenciones y transferencias recibidas; al cerrar una caja publica `cob.cashSession.closed` y TES crea la rendición; M07 informa el **neto esperado** de cada rendición de pasarela/red y TES lo concilia contra el banco. |
| Orden de pago: selección de facturas, aplicación, anticipos a proveedores, cálculo de retenciones practicadas, certificados, aprobación de la OP | **M12 CMP** (con **M06 FIS** para el cálculo de retenciones: servicio interno `fis.service.calculateWithholdings`, antes sin nombre de servicio; confirmación y anulación con `fis.service.confirmWithholdings` / `fis.service.cancelWithholdings`) | M12 publica `cmp.paymentOrder.approved`; TES ejecuta, firma, entrega y confirma; TES publica `tes.paymentExecution.executed/voided`. |
| Regímenes fiscales, determinación de retenciones y percepciones, DDJJ, cómputo de retenciones sufridas, VEP como obligación | **M06 FIS** | TES registra retenciones recibidas y las presenta (transfiere) a M06; ejecuta el pago a organismos que M06 determina. |
| Asientos contables, plan de cuentas, ejercicios, presupuesto (crédito, comprometido presupuestario, devengado, pagado) | **M15 CON** | TES publica eventos con categoría y datos; M15 genera el asiento en línea (DEC-009) y devuelve el vínculo. M15 concilia cuentas contables de bancos y caja con los saldos de TES. |
| Liquidación de sueldos, recibos, CBU de empleados (`SU_EMP_CBU`) | **M16 SUE** | M16 publica `sue.paymentRequest.created` (EVT-SUE-17); TES genera el archivo, ejecuta, concilia y devuelve `tes.payrollPayment.confirmed`. |
| Mora, ND por cheque rechazado al socio, intereses | **M08 MOR** / **M05 FAC** | TES publica `tes.thirdPartyCheck.rejected`; M07/M05 generan la ND; M08 aplica la política. |
| Capital social e integración | **M17 INS** | TES no registra capital en el cierre de caja (ver CTR-TES-15). |
| Conectores técnicos (Interbanking, bancos, ARCA cotizaciones, eCheq), bóveda de credenciales, reintentos | **T06 INT** | TES define el contrato funcional; T06 implementa adaptador, credenciales y transporte. |
| Workflow de autorizaciones, expediente documental, outbox | **T11 WFL** | TES declara puntos de aprobación (firma, excepcionales, quebrantos, desconciliación, reapertura). |
| Períodos operativos por módulo (cierre por fecha) | **T04 CFG / M15 CON** (entidad unificada `modulePeriods`) | TES consulta los períodos `tes.bancos` y `tes.tesoreria` antes de registrar o anular. |
| Reportes avanzados, BI | **T10 BIA** | TES expone vistas y cubos certificados. |

### 2.3 Regla de frontera crítica

- La **cancelación comercial** del asociado la decide M07; TES nunca modifica deuda.
- La **obligación con el proveedor** la decide M12; TES nunca modifica saldos de facturas de compra: informa la ejecución y M12 aplica.
- La **disponibilidad** solo cambia por un movimiento de TES en una cuenta financiera.

## 3. Glosario del módulo

| Término | Definición | Clave de diccionario | Término ProCoop equivalente |
|---|---|---|---|
| Cuenta financiera | Cualquier lugar donde la cooperativa tiene o mueve fondos: cuenta bancaria, caja de tesorería, caja de pagos, cuenta de movimientos, cuenta de tránsito. | `dict:tes.account` | `BANKOS` (con `BIC`) |
| Cuenta bancaria propia | Cuenta abierta a nombre de la cooperativa en una entidad financiera (corriente, caja de ahorro, en pesos o moneda extranjera). | `dict:tes.bankAccount` | Cuentas Propias (`BANKOS`) |
| Caja de tesorería | Cuenta de efectivo central donde ingresa la recaudación rendida y desde donde se deposita. | `dict:tes.treasuryCash` | Cuenta con `BIC = 3` "Tesorería" |
| Caja de pagos | Caja diaria para pagos a proveedores en efectivo, con tope y medios habilitados. | `dict:tes.paymentCash` | `CAJAPAGO` |
| Caja de cobranza | Caja del cajero donde se cobra a los socios (dueño M07). | `dict:cob.cashSession` | `CAJAS`, `PLAN_CAJ` |
| Cuenta de movimientos | Cuenta técnica para valores rechazados o cambio de valores. | `dict:tes.movementAccount` | `BANKOS` con `BIC = 2` (P2067, P2076) |
| Cuenta de tránsito | Cuenta técnica para fondos en camino (depósito no acreditado, transferencia entre cuentas con fechas distintas, liquidación de tarjeta presentada). | `dict:tes.transitAccount` | — (nuevo) |
| Operación de tesorería | Agrupador de uno o más movimientos de una misma operación, con número de comprobante. | `dict:tes.operation` | `COD_INT` / "Operación de tesorería" |
| Movimiento | Entrada o salida de fondos en una cuenta financiera, con medio, importe, moneda y origen. | `dict:tes.movement` | `TESORE` (libro de tesorería) y `RESBAN` (resumen bancario) |
| Libro de bancos | Vista de movimientos de una cuenta bancaria con saldo inicial y acumulado. | `dict:tes.bankBook` | Libro de bancos (`GetLibroBancos`) |
| Libro de tesorería | Vista de movimientos de cajas y cartera. | `dict:tes.treasuryBook` | `TESORE` |
| Categoría de movimiento | Clasificación que determina la regla contable y el tipo de movimiento permitido. | `dict:tes.category` | `CAT_BANC`, `CATB_MOVS` |
| Concepto de tesorería | Motivo de ingreso o egreso con valores por defecto. | `dict:tes.concept` | `CONTES` |
| Fecha valor (operativa) | Fecha en que el movimiento afecta el saldo disponible. | `dict:tes.valueDate` | `RESBAN.FECHA` |
| Fecha de emisión | Fecha del comprobante (base del saldo contable). | `dict:tes.issueDate` | `FEC_EMI` |
| Saldo operativo | Saldo por fecha valor. | `dict:tes.operationalBalance` | Saldo operativo |
| Saldo contable | Saldo por fecha de emisión. | `dict:tes.bookBalance` | Saldo contable |
| Extracto | Conjunto de movimientos informados por el banco para una cuenta y período, con saldo inicial y final. | `dict:tes.statement` | — (ProCoop no tiene cabecera de extracto) |
| Línea de extracto | Movimiento individual informado por el banco o Interbanking. | `dict:tes.statementLine` | `MOV_INTERBANKING` |
| Conciliación | Proceso que explica la diferencia entre el saldo del extracto y el saldo del libro a una fecha de corte. | `dict:tes.reconciliation` | Conciliación bancaria (`CONCILIAC = 'S'`) |
| Grupo de conciliación | Vínculo N:M entre líneas de extracto y movimientos de libro que se explican mutuamente. | `dict:tes.reconciliationMatch` | `RESBAN_MOVINT.COD_CONC` |
| Partida pendiente | Movimiento de libro no reflejado en el banco o línea de banco no registrada en libro a la fecha de corte. | `dict:tes.reconcilingItem` | — |
| Interbanking | Red de banca electrónica empresarial argentina; ofrece API de información financiera y carga de archivos de pago. | `dict:tes.interbanking` | `INTERBANKING`, `clsInterbanking` |
| Valor de terceros | Cheque (físico o eCheq) recibido de un socio, cliente u otro tercero. | `dict:tes.thirdPartyCheck` | Valores de Terceros (`VALORES`) |
| Cheque de pago diferido | Cheque con fecha de pago posterior a la emisión. | `dict:tes.deferredCheck` | `DIFERIDO` |
| eCheq | Cheque electrónico (Comunicación BCRA "A" 6578 y complementarias) que se emite, endosa, deposita y custodia por canales electrónicos bancarios. | `dict:tes.echeq` | e-cheq (`CHEQUERAS` número 0) |
| Chequera | Talonario de cheques propios de una cuenta bancaria, física o electrónica. | `dict:tes.checkbook` | `CHEQUERAS` (`ID_CHEQUERA`) |
| Cheque propio | Cheque librado por la cooperativa contra su cuenta. | `dict:tes.ownCheck` | Cheques Propios |
| Cuenta pendiente de débito | Cuenta contable donde se imputan los cheques propios emitidos hasta su débito. | `dict:tes.pendingDebitAccount` | `BANKOS.CTA_PENDEB` |
| Librador | Titular de la cuenta contra la que se libró un cheque de terceros. | `dict:tes.drawer` | `CTASUCE` |
| Cupón de tarjeta | Comprobante de un cobro con tarjeta de crédito o débito. | `dict:tes.cardVoucher` | `CUPONTAR` |
| Presentación de cupones | Lote de cupones presentados al procesador para su liquidación. | `dict:tes.cardPresentation` | `PresentarCupones` (tipo 62) |
| Liquidación de tarjeta | Pago del procesador con neto, comisiones, impuestos y retenciones. | `dict:tes.cardSettlement` | `PAGOTAR`, `CobrarCupones` |
| Retención recibida (sufrida) | Retención que un cliente o procesador practicó a la cooperativa al pagarle. | `dict:tes.receivedWithholding` | Retenciones Recibidas (`RETENCIO`) |
| Presentación de retenciones | Salida de las retenciones de la cartera de tesorería hacia su cómputo fiscal (M06). | `dict:tes.withholdingPresentation` | `PresentarRetenciones` (tipo 64) |
| Rendición de caja | Entrega de los fondos y valores de una caja de cobranza cerrada a tesorería. | `dict:tes.cashRemittance` | Cierre de caja (`CerrarCaja`, tipos 3, 4, 6, 7, 9) |
| Quebranto de caja | Diferencia entre lo contado y lo teórico. | `dict:tes.cashShortage` | Tipos 50/51 |
| Depósito | Ingreso de efectivo o valores en una cuenta bancaria mediante boleta. | `dict:tes.deposit` | Tipos 1 y 2 |
| Fecha probable de acreditación | Fecha estimada en que un depósito de valores queda disponible. | `dict:tes.expectedCreditDate` | `FEPROACRE` |
| Cambio de valores | Operación que entrega y recibe medios distintos (p. ej. efectivo por cheque). | `dict:tes.instrumentExchange` | Tipos 57/58 |
| Ejecución de pago | Realización financiera de una orden de pago aprobada (medios, firma, entrega, débito). | `dict:tes.paymentExecution` | Medios de pago de la OP, `FirmarOP`, `EntregarOP` |
| Salida pendiente | Pago en efectivo registrado que todavía no entregó la caja. | `dict:tes.pendingCashOut` | `SALIDA_PEN` |
| Archivo de pago | Archivo de transferencias para la banca electrónica (proveedores, haberes, transferencias de tesorería). | `dict:tes.paymentFile` | `GenerarArchivosInterbanking`, `GEN_ARCHIVO` |
| VEP | Volante electrónico de pago para obligaciones con organismos. | `dict:tes.vep` | Tipo 73 |
| Posición diaria | Disponible por cuenta y moneda a una fecha, más tránsito y cartera. | `dict:tes.dailyPosition` | Disponibilidades |
| Flujo de fondos proyectado | Proyección de saldos por fecha a partir de vencimientos a cobrar, a pagar, previsiones y compromisos. | `dict:tes.cashFlow` | Previsiones (`GetPrevisiones_*`, `GetPrevisionesCompras`) |
| Previsión | Ingreso o egreso esperado cargado manualmente o con periodicidad. | `dict:tes.plannedItem` | `PREV_COM` |
| Compromiso de fondos | Reserva de fondos por una decisión aprobada (p. ej. OC) que aún no es obligación. | `dict:tes.fundCommitment` | — (nuevo, AGR-028) |
| Escenario de liquidez | Proyección alternativa con supuestos explícitos que no altera lo real. | `dict:tes.liquidityScenario` | — (nuevo, BASE §21) |
| Gasto financiero | Comisión, impuesto, interés o cargo bancario clasificado. | `dict:tes.financialCharge` | Créditos/débitos bancarios (P2118/P2119) |
| Moneda | Moneda habilitada con reglas de redondeo y vuelto. | `dict:tes.currency` | `TIP_MON` |
| Cotización | Tipo de cambio por fecha y hora, compra y venta, con fuente. | `dict:tes.exchangeRate` | `COT_DOL` |
| Tipo de instrumento | Tipo de valor o medio con cuenta contable, carga manual y vuelto. | `dict:tes.instrumentType` | `TIP_VAL` |
| Lote de pago de haberes | Conjunto de acreditaciones netas a empleados aprobado por M16. | `dict:tes.payrollBatch` | Pago de sueldos (`GenerarPago`), `SU_AUDIT_TRA_INTERBANKING` |

## 4. Actores, permisos y alcance

| Rol (perfil sugerido) | Capabilities | Alcance de datos |
|---|---|---|
| Tesorero | `tes.cuentas.ver/crear/editar`, `tes.movimientos.ver/crear/anular`, `tes.conciliacion.ver/conciliar/cerrar`, `tes.extractos.importar`, `tes.interbanking.sincronizar`, `tes.valores.*`, `tes.chequeras.*`, `tes.echeq.*`, `tes.cupones.*`, `tes.retencionesRecibidas.*`, `tes.rendiciones.recibir/aceptar/observar`, `tes.depositos.crear`, `tes.pagos.ver/ejecutar/entregar/anular`, `tes.archivosPago.generar/enviar`, `tes.cierreCaja.cerrar`, `tes.cotizaciones.crear`, `tes.flujo.ver/simular`, `tes.previsiones.crear`, `tes.compromisos.ver`, `tes.haberes.ejecutar`, `tes.informes.ver/exportar` | Tenant, limitado a las cuentas financieras asignadas (`scope.accounts`) |
| Auxiliar de tesorería | `tes.movimientos.ver/crear`, `tes.valores.ver/crear/depositar`, `tes.cupones.ver/presentar`, `tes.retencionesRecibidas.ver/crear`, `tes.rendiciones.recibir`, `tes.depositos.crear`, `tes.extractos.importar`, `tes.conciliacion.ver/conciliar` (sin cerrar), `tes.informes.ver` | Cuentas asignadas; sucursales asignadas |
| Cajero de pagos | `tes.cajasPago.abrir/cerrar`, `tes.pagos.entregar` (solo efectivo y valores de su caja), `tes.informes.ver` (su caja) | Su caja de pagos (`scope.own`) |
| Supervisor / jefe de tesorería | Todo lo del Tesorero + `tes.movimientos.aprobar` (excepcionales y quebrantos), `tes.conciliacion.desconciliar/reabrir`, `tes.cierreCaja.reabrir`, `tes.cuentas.configurar`, `tes.interbanking.configurar`, `tes.reglasConciliacion.configurar`, `tes.configuracion.configurar` | Tenant |
| Firmante de pagos | `tes.pagos.firmar` | Cuentas donde figura como firmante vigente (`treasuryAccountSigners`) y hasta su tope |
| Gerencia / Consejo | `tes.flujo.ver/simular`, `tes.posicion.ver`, `tes.compromisos.ver`, `tes.informes.ver/exportar`, `tes.pagos.firmar` (si es firmante) | Tenant (lectura) |
| Contador | `tes.movimientos.ver`, `tes.conciliacion.ver`, `tes.informes.ver/exportar`, `tes.periodos.cerrar/reabrir` (en coordinación con M15) | Tenant (lectura) |
| Auditor | `tes.*.ver`, `tes.informes.exportar`, auditoría de cambios | Tenant (solo lectura) |
| Cajero de cobranza (M07) | Ninguna de TES; entrega la rendición desde M07 y ve su estado (`cob.caja.ver`) (antes `cob.cajas.ver`) | Su caja |
| Responsable de compras (M12) | `tes.pagos.ver` (estado de ejecución de sus OP) | OP de su ámbito |
| Liquidador de sueldos (M16) | `tes.haberes.ver` (estado del lote, sin importes de otros lotes) | Lotes propios |
| Administrador del tenant | `tes.configuracion.configurar`, `tes.monedas.configurar`, `tes.categorias.configurar`, `tes.conceptos.configurar`, `tes.tarjetas.configurar` | Tenant |
| Proceso de integración (sistema) | Credencial técnica por tenant con `tes.extractos.importar`, `tes.interbanking.sincronizar`, `tes.cotizaciones.crear`, `tes.archivosPago.procesarRespuesta` | Tenant, sin acceso a UI |
| Soporte de plataforma | Acceso temporal auditado (T02); **nunca** ve credenciales de Interbanking ni de bancos | Tenant con autorización vigente |

**Segregación de funciones (obligatoria, BASE SUE-013, RN-08 §13.7):** quien registra o carga una ejecución de pago no puede firmarla; quien firma no puede conciliarla en la misma cuenta si el tenant activa `PRM-TES-060`; quien observa una rendición no puede ser el cajero que la entregó; quien desconcilia no puede cerrar la misma conciliación sin un segundo aprobador.

## 5. Requisitos funcionales

### 5.1 Cuentas financieras y maestros

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-TES-001 | Administrar cuentas financieras de los tipos: cuenta corriente bancaria, caja de ahorro, cuenta en moneda extranjera, cuenta virtual (CVU/billetera), caja de tesorería, caja de pagos, cuenta de movimientos (rechazados, cambio de valores) y cuenta de tránsito. | BASE §21 "Administrar cuentas financieras"; DFA M18 Bancos; CAT `BANKOS` (`BIC`); REL Tesorería "Cuentas Propias" | Núcleo | O5 | Informado | Se crean cuentas de cada tipo; el tipo determina qué medios y operaciones admite; una cuenta no se elimina si tiene movimientos (solo se cierra). |
| RF-TES-002 | Registrar en cada cuenta bancaria: entidad, sucursal, tipo, número, CBU (validado con dígitos verificadores), alias, CUIT del titular, moneda, fecha y saldo inicial, cuenta contable de referencia, cuenta contable pendiente de débito, sucursal/servicio/centro de costo por defecto, formato de impresión de cheques, inclusión en informe de disponibilidades, proveedor asociado (para gastos del banco), número de caja asociado si aplica. | CAT `BANKOS` (`COD_CTA`, `NOM_BAN`, `SAL_INI`, `FECHA`, `CHEQUE`, `IMP_SYS`, `ULT_NUM`, `DIFERIDO`, `SALDO`, `FEC_ULTMOV`, `REPORTE`, `COD_PROV`, `CTA_PENDEB`, `INF_CHEQUE`, `INF_DISPO`, `CAJA`); RN-08 §2.5, §15.1 | Núcleo | O5 | Informado | Un CBU inválido se rechaza; no hay dos cuentas activas con el mismo CBU en el tenant; el saldo inicial queda como movimiento de apertura, no como campo editable. |
| RF-TES-003 | Mantener el catálogo de entidades financieras (código BCRA, nombre) y sus sucursales (código, localidad, provincia, dirección), compartido a nivel plataforma, con posibilidad de altas propias del tenant. | CAT `ENTFIN`, `SUCENT`; INV `abm_EntFin`, `abm_SucEnt` | Núcleo | O5 | Adoptado | El catálogo de plataforma es de solo lectura para el tenant; las altas del tenant no se ven en otros tenants. |
| RF-TES-004 | Administrar categorías de movimiento (descripción, abreviatura, regla contable de M15, tipos de movimiento permitidos) y su relación con tipos de movimiento. | CAT `CAT_BANC`, `CATB_MOVS`; INV `abm_Cat_Banc`; RN-08 §2.1 | Núcleo | O5 | Informado | No se puede registrar un movimiento con una categoría no habilitada para su tipo; una categoría sin regla contable se informa en la lista de "cuentas sin asignar" de M15 antes de operar. |
| RF-TES-005 | Administrar conceptos de tesorería de ingreso o egreso con concepto y observación por defecto, marca de concepto de sistema (no editable), marca operativa y tipo de cierre. | CAT `CONTES` (`DES_MOV`, `DES_MOVR`, `ING_EGR`, `SISTEMA`, `CON_DEFA`, `OBS_DEFA`, `OPERATIVO`, `TIP_CIERRE`) | Núcleo | O5 | Informado | Los conceptos de sistema no se eliminan ni cambian de sentido; al elegir un concepto se precargan concepto y observación. |
| RF-TES-006 | Administrar tipos de instrumento (valores/medios): descripción, cuenta contable de referencia, si admite carga manual de datos y si admite vuelto. | CAT `TIP_VAL` (`DES_TIP`, `CTA_CONTA`, `DATO_MANUAL`, `VUELTO`); INV `abm_TipVal`; RN-09 P2486 | Estándar | O5 | Informado | M07 solo ofrece en caja los tipos habilitados; el tipo por defecto para nuevos valores es configurable (PRM-TES-024). |
| RF-TES-007 | Registrar cuentas de libradores (banco, sucursal, número de cuenta, nombre, CUIT) con marca de bloqueo para no recibir sus cheques. | CAT `CTASUCE` (`RECIBIR`, `CUIT_CTA`); INV `abm_CtaSuce`; RN-08 §15.1 `ValidarNuevoCheque` | Estándar | O8 | Informado | Al cargar un cheque de un librador bloqueado se rechaza con motivo; el desbloqueo queda auditado. |
| RF-TES-008 | Registrar firmantes autorizados por cuenta bancaria con vigencia desde/hasta, tope por firma y regla de firmas conjuntas. | CAT `PPAGOS_FIRMANTES` (`FECHA_DESDE`, `FECHA_HASTA`); RN-08 §4.3, §13.7, §14 duda 6 | Estándar | O8 | A validar (PA-TES-01) | Un firmante fuera de vigencia o por encima de su tope no puede firmar; las reglas por monto exigen la cantidad de firmas configurada. |
| RF-TES-009 | Habilitar por cuenta los medios que admite: cheque físico, eCheq, transferencia, VEP, débito automático, depósito de efectivo, depósito de valores, archivo de pagos. | RN-08 §2.1 (medios), §2.5 | Estándar | O5 | Adoptado | La ejecución de pago solo ofrece medios habilitados en la cuenta elegida. |
| RF-TES-010 | Vincular cada cuenta bancaria con su cuenta en Interbanking por CBU. | RN-13 §16.2 (`BANKOS.CTA_INTERBANKING`); RN-08 §15.1 | Estándar | O8 | Informado | Una cuenta IB solo se vincula a una cuenta propia del mismo CBU; la vinculación se audita. |
| RF-TES-011 | Calcular, sin campos editables, el saldo **operativo** (por fecha valor), el saldo **contable** (por fecha de emisión) y el saldo **a futuro** (con lo vencido agrupado en hoy) de cada cuenta. | RN-08 §15.1 `GetSaldosBancos`, `GetSaldosaFuturo`; AGR-011 | Núcleo | O5 | Informado | Dos consultas a la misma fecha devuelven el mismo saldo desde cualquier pantalla o API; recalcular desde movimientos coincide con el saldo materializado. |
| RF-TES-012 | Cerrar una cuenta financiera solo con saldo cero y sin partidas pendientes de conciliación ni cheques propios emitidos sin debitar; permitir bloquearla temporalmente. | Nuevo (control); AGR-011 | Estándar | O8 | Adoptado | El cierre con saldo o pendientes se rechaza con la lista de bloqueantes. |
| RF-TES-013 | Configurar la caja de tesorería por sucursal (una o varias) con monedas admitidas y responsable. | RN-08 §15.1 `GetDisponibilidades` (`BIC = 3`) | Núcleo | O5 | Adoptado | Cada rendición se recibe en una caja de tesorería de la sucursal de la caja de cobranza o en la que el tenant defina. |

### 5.2 Operaciones y movimientos

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-TES-014 | Registrar operaciones de tesorería que combinen uno o más ingresos y egresos (efectivo, valores de terceros, cheques propios, eCheq, transferencias, retenciones, cupones, débitos) en una o varias cuentas, con un asistente paso a paso. | RN-08 §2.8 `GenerarMov_Extraordinario`; INV `frmWizardMovimientos`, `frmCargaMedioDePago_Simple`; REL Tesorería "Movimientos" | Núcleo | O5 (básico) / O8 (completo) | Informado | La operación se guarda en una sola transacción; si un paso falla no queda nada parcial. |
| RF-TES-015 | Soportar los tipos de operación: depósito de efectivo, depósito de valores, transferencia entre cuentas propias, extracción, ingreso excepcional, egreso excepcional, cambio de valores, quebranto (ingreso/egreso), rechazo de valor, recupero de valor, rechazo de valor entregado, presentación de cupones, cobro de cupones, rechazo de cupón, presentación y salida de retenciones, pago a proveedor (por medio), pago VEP/a organismo, gasto bancario, interés ganado, débito automático, acreditación de pasarela/red, rendición de caja, pago de haberes, reintegro a socio, apertura de saldo. | RN-08 §2.1 (`Tipos_Movimientos_Tesoreria` 1–9, 50, 51, 55–63, 64–68, 70, 72, 73) | Núcleo | O5/O8 | Informado | Cada tipo tiene validaciones y categoría por defecto; el catálogo de tipos es cerrado y versionado (no texto libre). |
| RF-TES-016 | Numerar cada operación con el talonario "Operación de tesorería" del tenant y sucursal, sin saltos ni duplicados bajo concurrencia. | RN-08 §1.3, §15.1 `NuevoNroTesoreria` | Núcleo | O5 | Adoptado | Dos operaciones simultáneas nunca reciben el mismo número (secuencia atómica, no `MAX + 1`). |
| RF-TES-017 | Relacionar cada movimiento con su origen: módulo, tipo de documento, identificador, y en su caso caja, rendición, OP, lote, línea de extracto. | BASE §21 "Relacionar cada movimiento con su origen"; BASE §75 (recorrer informe → asiento → documento → operación) | Núcleo | O5 | Informado | Desde cualquier movimiento se navega al documento de origen y al asiento (M15), y en sentido inverso. |
| RF-TES-018 | Registrar en cada movimiento fecha de emisión, fecha valor, fecha de registro (`recordedAt`) y, en depósitos de valores, fecha probable de acreditación. | RN-08 §15.1 `RegistrarResBan` (`FEPROACRE`); AGR-010 | Núcleo | O5 | Informado | La fecha probable se calcula por días de clearing configurables (PRM-TES-033) y es editable con auditoría. |
| RF-TES-019 | Registrar moneda, cotización e importe en moneda de la cuenta y en pesos para cada medio. | RN-08 §2.1 (moneda, cotización, importe en pesos); CAT `TIP_MON`, `COT_DOL` | Estándar | O8 | Informado | En moneda local la cotización es 1; en moneda extranjera se exige cotización de la fecha (o la última anterior con advertencia). |
| RF-TES-020 | Anular una operación mediante reversión vinculada (nunca borrado), con motivo, permiso, período abierto y, opcionalmente, reversión de los cheques propios incluidos. | RN-08 §2.8 `Anular`, §15.1 (`Anular` sin anular cheques propios); guía §5 | Núcleo | O5 | Informado | La anulación genera movimientos espejo; el original queda en estado `voided` con vínculo; las consultas de saldo excluyen ambos de forma consistente. |
| RF-TES-021 | Emitir el comprobante de la operación (PDF) con ingresos, egresos, medios y firmas, y registrar que fue impreso. | RN-08 §15.1 `GetDatosReporte`; INV `frmTesoreriaHandler.Imprimir/ImprimirTesore/ImprimirResBan` | Estándar | O5 | Informado | Reimprimir muestra la marca "Reimpresión"; para depósitos el comprobante refleja la boleta. |
| RF-TES-022 | Registrar transferencias internas entre cuentas propias; si las fechas valor difieren, el importe queda en la cuenta de tránsito hasta la acreditación. | BASE §21 "Registrar transferencias internas"; RN-08 §2.1 (tipo 70) | Núcleo | O5 | Informado | Durante el tránsito el importe no suma al disponible de ninguna de las dos cuentas (BASE §21 excepción). |
| RF-TES-023 | Registrar cambio de valores con entradas y salidas habilitadas por parámetro (efectivo, valores, cheques propios y transferencias) y cuenta de movimiento configurable. | RN-09 P2058–P2062, P2074, P2075, P2076; RN-08 §2.1 (57, 58) | Estándar | O8 | Informado | Un cambio con un medio no habilitado se rechaza; entradas = salidas o se rechaza. |
| RF-TES-024 | Registrar ingresos y egresos excepcionales con concepto obligatorio y aprobación por monto (T11). | RN-08 §2.1 (55, 56); BASE §21 "Establecer autorizaciones" | Estándar | O8 | Adoptado | Por encima del umbral PRM-TES-061 el movimiento queda `pendingApproval` y no afecta saldo hasta aprobarse. |
| RF-TES-025 | Clasificar gastos financieros (comisiones, mantenimiento, impuesto sobre débitos y créditos bancarios, IVA sobre comisiones, percepciones, intereses deudores y acreedores, otros cargos) con categoría propia y vínculo con el comprobante del banco como proveedor cuando corresponda (M12). | BASE §21 "Clasificar gastos financieros"; RN-08 §15.1 `GetLibroBancos` (banco proveedor); TipoCuenta 2118/2119 | Estándar | O5 | Informado | El informe de gastos financieros suma por clase y período; ningún gasto queda sin categoría. Las alícuotas no se fijan en código: la clase solo clasifica. |
| RF-TES-026 | Permitir modificar en un movimiento emitido solo fecha valor y observación, con auditoría, propagando la fecha al cheque propio asociado y reemitiendo el evento contable (reversa y nuevo si cambió el período). | RN-08 §15.1 `ActualizarCheque`; RN-09 P2288 (advertencia de diferencias contables) | Estándar | O8 | Adoptado | La modificación en período cerrado se rechaza; queda historial antes/después. |
| RF-TES-027 | Controlar los períodos operativos de Bancos y Tesorería: no registrar ni anular movimientos con fecha en período cerrado; reapertura con permiso y auditoría. | RN-08 §1.1 (P502, P506), §13.3 | Núcleo | O5 | Informado | Un movimiento con fecha ≤ cierre se rechaza con mensaje `dict:tes.error.periodClosed`; la reapertura registra quién, cuándo y por qué. |
| RF-TES-028 | Someter a autorización (T11) las operaciones configuradas: excepcionales, quebrantos, anulaciones de operaciones de otro día, desconciliaciones, reapertura de cajas, pagos por encima del tope. | BASE §21; RN-08 §1.4 (controles) | Estándar | O5 | Informado | Cada punto de aprobación tiene umbral y aprobadores configurables; la aprobación queda en el expediente. |
| RF-TES-029 | Validar días no hábiles y feriados (calendario del tenant) al cargar cheques propios, transferencias y valores de terceros según política (ni preguntar ni exigir / preguntar / exigir). | RN-09 P2456, P2604 | Estándar | O8 | Informado | Con política "Exigir" una fecha de pago en feriado se rechaza; con "Preguntar" se advierte y se registra la confirmación. |
| RF-TES-030 | Mostrar el libro de bancos por cuenta (saldo inicial, movimientos no anulados, saldo acumulado, vínculo a la OP o caja de origen y detalle de ND/NC cuando el banco es proveedor) y el libro de tesorería por caja. | RN-08 §15.1 `GetLibroBancos`; CAT `RESBAN`, `TESORE` | Núcleo | O5 | Informado | El saldo final del libro coincide con el saldo operativo/contable de RF-TES-011 según el tipo de fecha elegido. |
| RF-TES-031 | Publicar un evento contable por cada movimiento, reversión y cierre con categoría, cuenta financiera, importes, moneda, origen y dimensiones (servicio, centro de costo, sucursal) para que M15 genere el asiento en línea. | DEC-009; RN-08 §1.2, §13.1 | Núcleo | O5 | Informado | Reenviar el evento no duplica el asiento (idempotencia por `eventId`); el movimiento guarda el `journalEntryId` devuelto. |
| RF-TES-032 | Consultar movimientos con filtros por cuenta, fecha (emisión, valor, registro, conciliación), tipo, categoría, concepto, estado de conciliación, origen, importe y usuario. | RN-08 §15.1 (tipos de fecha 1–4) | Núcleo | O5 | Informado | Los filtros combinados devuelven en menos de 2 s para 100.000 movimientos del tenant (RNF T08). |

### 5.3 Extractos y conciliación bancaria

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-TES-033 | Importar extractos bancarios en CSV, XLSX y TXT de ancho fijo mediante perfiles de importación por banco (mapeo de columnas, formato de fecha e importe, signo, separadores, filas de encabezado y pie) con el asistente `ExcelImportWizard` (subir → vista previa con errores → confirmar). | DFA M18 "Importación de extractos con conciliación asistida"; FIC 11.2; BASE §21 "Conciliar extractos" | Núcleo | O5 | A validar (PA-TES-04) | Un archivo con errores muestra cada fila observada y no importa nada hasta confirmar; el perfil se guarda y reutiliza. |
| RF-TES-034 | Detectar líneas duplicadas por huella (cuenta + fecha + importe + referencia/comprobante + correlativo del banco) entre importaciones y con Interbanking. | RN-13 §16.2 (deduplicación de `getMovimientosCuentaInterbanking`); AGR-016 | Núcleo | O5 | Informado | Reimportar el mismo archivo no crea líneas nuevas; el resumen informa "N duplicadas omitidas". |
| RF-TES-035 | Registrar la cabecera de cada extracto (período, saldo inicial, saldo final, cantidad de líneas, total débitos y créditos) y validar continuidad con el extracto anterior. | RN-08 §2.9 (ProCoop no tiene saldo de extracto), §13.6 | Núcleo | O5 | Adoptado | Si saldo inicial ≠ saldo final del extracto anterior se marca "Discontinuidad" y se exige justificación antes de cerrar la conciliación. |
| RF-TES-036 | Conciliar por cuenta y fecha de corte: saldo según extracto, saldo según libro, partidas pendientes (en libro no en banco; en banco no en libro) y diferencia no explicada, que debe ser cero para cerrar. | BASE §75 "Conciliar caja y banco"; RN-08 §13.6 | Núcleo | O5 | Adoptado | Fórmula verificada: saldo extracto − créditos en banco no registrados + débitos en banco no registrados + depósitos en libro no acreditados − pagos en libro no debitados = saldo libro. |
| RF-TES-037 | Proponer emparejamientos automáticos por reglas (importe exacto, fecha dentro de tolerancia, referencia, CUIT del ordenante, número de cheque, número de transferencia, código de operación) con puntaje, para que el usuario confirme en bloque o uno a uno. | DFA M18 (conciliación asistida); INV `frmConciliacionInterbanking.ConciliarAutomatico` | Núcleo | O5 | A validar (PA-TES-05) | Las propuestas no conciliadas quedan sugeridas; solo las reglas marcadas "autoconfirmar" se confirman sin intervención y quedan auditadas como automáticas. |
| RF-TES-038 | Conciliar manualmente grupos N a M entre líneas de extracto y movimientos de libro, exigiendo que los importes cuadren o que la diferencia se explique con un movimiento creado en el mismo acto. | RN-13 §16.3; RN-08 §15.1 (defecto: no valida cuadre) | Núcleo | O5 | Adoptado | Un grupo descuadrado no se guarda; la diferencia permitida es cero. |
| RF-TES-039 | Crear un movimiento desde una línea de extracto no registrada (gasto, interés, débito automático, crédito no identificado), con categoría sugerida por regla o por código de operación de Interbanking, y conciliarlo en el acto. | BASE §21 "Identificar movimientos sin registrar"; INV `frmConciliacionInterbanking.btnCreditoDebitoBancario_Click`; RN-13 §16.2 (`CON_COM.COD_IB`) | Núcleo | O5 | Informado | El movimiento creado queda vinculado a la línea; la línea pasa a conciliada. |
| RF-TES-040 | Enviar los créditos bancarios no identificados a la bandeja de pendientes de identificación de M07 (AGR-012); al identificarse, M07 imputa al socio y TES concilia el crédito con el cobro. | AGR-012; BASE §44 (no identificados); ESC-01 | Núcleo | O5 | Adoptado | Ningún crédito no identificado se imputa por nombre parecido o dirección; queda en "Pendiente de identificación" con responsable y antigüedad. |
| RF-TES-041 | Desconciliar un grupo completo con permiso, motivo y auditoría; no se puede desconciliar en una conciliación cerrada sin reabrirla. | RN-13 §16.3 `EliminarConciliacion` (borra solo filas del movimiento elegido: defecto) | Estándar | O5 | Adoptado | Desconciliar libera todas las líneas y movimientos del grupo, nunca una parte. |
| RF-TES-042 | Cerrar la conciliación de un período con aprobación, generar el reporte de conciliación (PDF y XLSX) y bloquear sus grupos; reabrir solo con permiso de supervisor. | BASE §75; RN-08 §2.9 | Núcleo | O5 | Adoptado | El reporte muestra fórmula, partidas con antigüedad y firmas; una conciliación cerrada no admite cambios. |
| RF-TES-043 | Conciliar la acreditación neta de cada rendición de pasarela o red (neto esperado informado por M07) contra la línea bancaria; diferencias de importe o fecha van a revisión. | BASE §13 CU-13 (bruto 8.000, comisión 160, neto 7.840); BASE §40.3 pasos 11–12; BASE §21 CU-21 | Núcleo | O5 | Informado | CU-21 reproducido: la acreditación 7.840 se concilia con TX-DEMO-001 y el disponible pasa de 100.000 a 107.840. |
| RF-TES-044 | Conciliar depósitos de efectivo y valores con su acreditación; al acreditarse, los cheques depositados pasan a "Acreditado". | RN-08 §2.4 (estados 4, 5), §15.1 `GetDepositos_ACreditaciones` | Núcleo | O5 | Informado | Un depósito no acreditado a la fecha probable aparece en "Depósitos a acreditar vencidos". |
| RF-TES-045 | Conciliar débitos de cheques propios y eCheq y pasarlos a "Debitado"; informar cheques no debitados. | RN-08 §15.1 `GetChequesNoDebitados` | Estándar | O8 | Informado | Al conciliar el débito el cheque cambia de estado y se informa a M15 para cancelar la cuenta pendiente de débito. |
| RF-TES-046 | Conciliar los débitos de archivos de pago (proveedores, haberes, transferencias) por lote o por línea, y vincular rechazos del banco a la línea del archivo. | RN-13 §16.4; CAT `SU_AUDIT_TRA_INTERBANKING` | Estándar | O8 | Adoptado | Un débito por el total del lote se concilia contra el lote; un rechazo parcial reabre solo las líneas rechazadas. |
| RF-TES-047 | Configurar la antigüedad mínima/máxima admitida para la fecha de conciliación de cuentas bancarias. | RN-09 P2578 | Estándar | O5 | Informado [VERIFICAR] | Intentar conciliar con una fecha fuera del rango configurado se rechaza con mensaje claro. |
| RF-TES-048 | Administrar reglas de conciliación por tenant y cuenta: condiciones (patrón de descripción, código de operación, rango de importe, CUIT), acción (emparejar, sugerir categoría, crear movimiento) y prioridad. | DFA M18 (mejora); RN-13 §16.3 ("no hay conciliación automática por reglas") | Estándar | O5 | Adoptado | Una regla nueva puede probarse en modo simulación sobre un extracto antes de activarse. |
| RF-TES-049 | Proveer a M15 el saldo conciliado por cuenta y fecha para la conciliación de cuentas contables de bancos y caja. | BASE §75 "Conciliaciones y controles"; BASE §76 pendiente "Conciliación y cuentas de control de … caja, bancos" | Estándar | O8 | Informado | El informe contable compara saldo de TES y saldo contable y lista diferencias por corte, estado o clasificación. |
| RF-TES-050 | Registrar en cada conciliación usuario, fecha de conciliación y método (manual, sugerida confirmada, automática). | RN-08 §2.9 (`FEC_CONC`, `USU_CONC`); RN-13 §16.3 (`FEC_CONC_INT`) | Núcleo | O5 | Informado | El informe "Movimientos por fecha de conciliación" reproduce el filtro 3 de ProCoop. |

### 5.4 Interbanking

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-TES-051 | Configurar la conexión del tenant a la API de información financiera de Interbanking (identificador de cliente, credenciales en la bóveda de T06, alcance), con prueba de conexión. | RN-13 §16.1; FIC 11.1; RN-13 §17 (credenciales sin cifrar en ProCoop) | Estándar | O8 | A validar (PA-TES-02) | Las credenciales nunca se muestran ni se registran en logs; la prueba informa éxito o error sin exponer el secreto. |
| RF-TES-052 | Listar las cuentas disponibles en Interbanking y vincularlas a cuentas propias. | RN-13 §16.2 `getCuentasInterbanking` | Estándar | O8 | Informado | Solo se listan cuentas del cliente configurado; las no vinculadas se marcan. |
| RF-TES-053 | Consultar saldos de Interbanking y compararlos con el saldo del libro por cuenta, mostrando la diferencia. | RN-13 §16.2 `getSaldosCuentasInterbanking`; INV `frmSaldosCuentasInterbanking` | Estándar | O8 | Informado | La pantalla muestra saldo banco, saldo libro, diferencia y fecha/hora de la consulta. |
| RF-TES-054 | Descargar diariamente los movimientos de días anteriores de cada cuenta vinculada (paginados), deduplicarlos y registrarlos como líneas de extracto de origen Interbanking. | RN-13 §16.1 (endpoints `movements/anteriores`), §16.2; FIC 11.1 (frecuencia diaria) | Estándar | O8 | Informado | El job es reanudable por cuenta y página; una corrida repetida no crea duplicados. |
| RF-TES-055 | Traducir el código de operación de Interbanking a categoría/concepto de CoopApps mediante una tabla de mapeo editable. | RN-13 §16.2 (`CON_COM.COD_IB`, `getCodConCom`); RN-08 §15.1 (`getCodigos`) | Estándar | O8 | Informado | Un código sin mapeo se marca "Sin clasificar" y aparece en la bandeja de configuración. |
| RF-TES-056 | Generar el archivo de pagos a proveedores en formato Interbanking (cabecera con CBU de origen, sentido y fecha; detalle con CBU destino, importe en centavos, concepto, tipo/sucursal/número de comprobante y retención) desde un lote de ejecuciones de pago. | RN-13 §16.4 `GenerarArchivosInterbanking`; RN-08 §4.2 (`GEN_ARCHIVO`), §12.1 P2573 | Estándar | O8 | Informado | El archivo generado valida longitudes y totales; el CBU de origen es el de la cuenta elegida en el lote (no un parámetro global). |
| RF-TES-057 | Generar archivos de pago en otros formatos por banco como complementos (planilla Credicoop y los que se incorporen). | RN-13 §16.4 (variante Credicoop) | Estándar | O8 | Informado | Agregar un formato no requiere cambiar el núcleo (adaptador T06). |
| RF-TES-058 | Generar archivos de transferencias desde tesorería (no originadas en OP) con CBU de origen de la cuenta seleccionada. | RN-13 §16.4 `clsProveedor.ExportarArchivo_Interbanking` | Estándar | O8 | Informado | Ver CTR-TES-03: no se usa el CBU de sueldos como origen. |
| RF-TES-059 | Registrar envío, respuesta, aceptación y rechazo de cada archivo y de cada línea, con evidencia (archivo, hash, acuse). | CAT `SU_AUDIT_TRA_INTERBANKING` (`JSON_ENVIO`, `JSON_RESPUESTA`, `ESTADO`); BASE §52 ("no marcar Pagado por emitir una instrucción") | Estándar | O8 | Adoptado | Un archivo generado queda "Generado", no "Pagado"; solo el débito conciliado o la respuesta del banco lo pasa a "Ejecutado". |
| RF-TES-060 | Monitorear la vigencia del token y los errores de la integración, con alertas al tesorero y bandeja técnica (AGR-016), sin registrar secretos. | RN-13 §16.1 (token 7200 s), §17 | Estándar | O8 | Adoptado | Un error de autenticación genera una alerta única por día y por tenant; el log no contiene encabezados de autorización. |

### 5.5 Valores de terceros

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-TES-061 | Registrar cheques de terceros físicos, de pago diferido y eCheq recibidos, desde la cobranza (servicio invocado por M07) o desde tesorería, con: entidad, sucursal, número de cuenta, número de cheque, CUIT y nombre del librador, fecha de emisión, fecha de pago, importe, moneda, tipo de instrumento, endosos, origen (socio, cliente, proveedor), y lectura del código CMC-7 con lectora cuando esté disponible. | DFA M18 Valores; CAT `VALORES`; INV `frmNuevoCheque` (`ctrlLectora1_DataFilled`), `Valores_ModoEdicion`; REL "Valores de Terceros" | Núcleo | O8 | Informado | Un cheque cargado por lectora completa banco, sucursal, cuenta y número; los datos manuales se validan igual. |
| RF-TES-062 | Impedir duplicar un cheque por entidad + sucursal + cuenta + número en cualquier estado no anulado. | RN-08 §2.4, §15.1 (defecto: solo en cartera) | Núcleo | O8 | Adoptado | Cargar un cheque ya depositado o entregado se rechaza indicando su estado actual. |
| RF-TES-063 | Advertir al cargar un cheque de un librador con cheques rechazados no recuperados y bloquear libradores marcados. | RN-08 §15.1 `ValidarChequesRechazados`, `ValidarNuevoCheque`; INV `frmNuevoCheque.btnVerRechazados_Click` | Estándar | O8 | Informado | La advertencia muestra cantidad e importe de rechazados; el bloqueo impide guardar. |
| RF-TES-064 | Validar la fecha de pago: rechazar o advertir cheques vencidos (más de N días desde la fecha de pago, por defecto 30), fechas en feriado según política y fechas futuras salvo marca explícita. | RN-09 P2536, P2456; INV `frmNuevoCheque.chIgnorarFechaFut_CheckedChanged` | Estándar | O8 | Informado | Con N = 30, un cheque con fecha de pago hace 31 días se rechaza (o se advierte según configuración). |
| RF-TES-065 | Gestionar el ciclo de vida de cada valor con la máquina de estados Recibido → En cartera → Entregado a proveedor / Depositado → Acreditado; Rechazado → Recuperado / Devuelto; Anulado; Egreso manual; con historial completo de cambios. | RN-08 §2.4 (`clsValores.Estados` 1–10); CAT `VAL_ESTA`, `VAL_MVTO` | Núcleo | O8 | Informado | Toda transición no listada en §8 se rechaza; el historial muestra fecha, hora, usuario, estado y observación. |
| RF-TES-066 | Habilitar valores en cartera para pago a proveedores (con fecha y usuario), y listar los disponibles para pagos. | RN-08 §2.4 (`PERPAGPRO`), §15.1 `MarcarPerPagPro`; INV `frmTesoreriaHandler.MarcarValoresParaPago` | Estándar | O8 | Informado | Solo los valores En cartera y habilitados aparecen en el selector de medios de pago. |
| RF-TES-067 | Entregar valores a proveedores como medio de una ejecución de pago (endoso), pasando a "Entregado a proveedor". | RN-08 §4.2 (tipo 65) | Estándar | O8 | Informado | Un valor entregado no puede depositarse; la anulación del pago lo devuelve a En cartera. |
| RF-TES-068 | Depositar valores en una cuenta bancaria mediante boleta, con fecha probable de acreditación, y acreditarlos al conciliar. | RN-08 §2.1 (tipo 2); RN-09 P2064 | Núcleo | O8 | Informado | La boleta lista los cheques; el total de la boleta es la suma exacta de los valores. |
| RF-TES-069 | Registrar el rechazo de un cheque depositado: reverso del crédito en el banco del depósito, ingreso del valor a la cuenta de movimientos de rechazados, notificación a M07 para la nota de débito al socio con los gastos configurados. | RN-08 §15.1 `Registrar_Movimiento` (tipos 59, 60, cuenta P2067); RN-09 P2067 | Núcleo | O8 | A validar (PA-TES-15) | El socio no queda con deuda cancelada por un cheque rechazado: M07 recibe `tes.thirdPartyCheck.rejected` y reabre la obligación por ND trazable. |
| RF-TES-070 | Registrar el rechazo de un cheque entregado a un proveedor: movimiento tipo rechazo de valor entregado, comprobante al proveedor por el importe con concepto exento configurable, gasto por rechazo opcional y opción de seleccionar el comprobante de compra relacionado. | RN-08 §2.4 `RechazoDeValoresEntregados`; RN-09 P2384, P2516, P2517 | Estándar | O8 | Informado | Si el concepto exento no está configurado, la operación se bloquea antes de empezar con mensaje explícito. |
| RF-TES-071 | Registrar el recupero de un valor rechazado (en efectivo, transferencia u otro valor) y la devolución al librador. | RN-08 §2.4 `RecuperarCheque`, §15.1 (tipo 61, recuperos con transferencias, efectivo y valores) | Estándar | O8 | Informado | El informe "Rechazados no recuperados" (filtro 101) deja de listar el valor recuperado. |
| RF-TES-072 | Modificar datos de un valor (entidad, sucursal, cuenta, observación, fecha) solo mientras está En cartera, con auditoría. | RN-08 §15.1 `ModificarValor`; INV `frmTesoreriaHandler.ModificarCheque` | Estándar | O8 | Informado | Un valor depositado o entregado no admite modificación de datos identificatorios. |
| RF-TES-073 | Calcular el valor actual de un cheque diferido a una tasa ingresada, como ayuda para negociación o descuento. | INV `frmNuevoCheque.CalcularVAN`, `txtVan_EditValueChanged` | Extensión | O8 | Informado | El cálculo es informativo; no genera movimiento. |
| RF-TES-074 | Registrar la negociación (descuento) de valores en un banco o entidad: valores cedidos, neto acreditado, intereses y gastos como gasto financiero. | Nuevo (práctica de mercado, eCheq) | Extensión | O8 | Adoptado | Valores negociados pasan a "Negociado"; si el banco los rechaza, vuelve la obligación con la entidad. |
| RF-TES-075 | Alertar valores próximos a fecha de pago no depositados y valores vencidos en cartera. | RN-09 P2536 | Estándar | O8 | Adoptado | La alerta diaria lista valores con fecha de pago en los próximos N días configurables. |

### 5.6 Cheques propios y chequeras

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-TES-076 | Dar de alta chequeras físicas (cuenta, descripción, número desde, cantidad), generando un cheque por número. | RN-08 §15.1 `GuardarChequeras`; CAT `CHEQUERAS` | Estándar | O8 | Informado | Una chequera con números superpuestos con otra de la misma cuenta se rechaza. |
| RF-TES-077 | Dar de alta chequeras de eCheq con cupo de cheques sin número previo; el número se asigna al emitir. | RN-08 §2.5, §15.1 | Estándar | O8 | Informado | Emitir un eCheq toma el primer registro libre y le asigna el número informado, que no puede repetirse en la cuenta. |
| RF-TES-078 | Emitir cheques propios en una ejecución de pago: exige estado Disponible, guarda fecha de pago, marcas al portador, cruzado y no a la orden, beneficiario, y vincula el cheque al movimiento y al pago. | RN-08 §2.5 `SetEgreso`, `ValidarChequeParaPago`; INV `frmCargaMedioDePago_Simple` (`chkAlPortador`, `chkNoalaorden`, `cboChequeras`) | Estándar | O8 | Informado | Un cheque Anulado o ya Emitido no puede usarse; la fecha de pago en feriado sigue la política de RF-TES-029. |
| RF-TES-079 | Gestionar estados del cheque propio: Disponible, Emitido (entregado), Debitado, Anulado, Rechazado; desmarcar (volver de Anulado a Disponible) solo si no fue emitido. | RN-08 §2.5, §15.1 (`AnularCheque`, `DesmarcarCheque`, `SetRechazado`); INV `frmTesoreriaHandler.AnularCheque` | Estándar | O8 | Informado | Las transiciones siguen §8; anular solo desde Disponible. |
| RF-TES-080 | Reemplazar un cheque dentro de una ejecución de pago (cheque dañado o extraviado) manteniendo el pago y anulando el reemplazado. | RN-08 §2.5 `ReemplazarChequeEnOp`; INV `frmTesoreriaHandler.ReemplazarChequeEnOP` | Estándar | O8 | Informado | El pago conserva su importe; el cheque reemplazado queda Anulado con motivo. |
| RF-TES-081 | Recuperar un cheque propio devuelto por el beneficiario antes del débito (vuelve el fondo, el cheque queda Anulado y el pago se reabre en M12 si corresponde). | RN-08 §2.5 `RecuperaCheque`; INV `frmTesoreriaHandler.RecuperaCheque` | Estándar | O8 | Informado | El recupero revierte el movimiento bancario del cheque. |
| RF-TES-082 | Imprimir cheques físicos por rango correlativo, con beneficiario (nombre de pago de la OP, o "a la orden" del proveedor, o razón social), importe en letras y formato de la chequera o del tenant; marcar impresos y advertir reimpresiones. | RN-08 §2.5 `ImprimirValores`, §15.1 `GetChequesAImprimir`, `ValidarChequesImprimir`; RN-09 P370 | Estándar | O8 | Informado | Desde ≤ hasta obligatorios; la cantidad del rango debe coincidir con los cheques usados en pagos; un cheque ya impreso exige confirmación. |
| RF-TES-083 | Eliminar una chequera completa solo si ningún cheque se usó; la baja parcial pasa los disponibles a Anulados. | RN-08 §15.1 `GuardarChequeras` | Estándar | O8 | Informado | Una chequera con cheques emitidos no se elimina. |
| RF-TES-084 | Imputar los cheques propios emitidos a la cuenta pendiente de débito hasta su débito (evento a M15). | RN-08 §2.5 (`CTA_PENDEB`), §15.2 `GetCuentaBanco` | Estándar | O8 | Informado | Al debitarse, M15 recibe el evento de reclasificación. |

### 5.7 eCheq

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-TES-085 | Emitir eCheq como medio de pago con: cuenta, CUIT y nombre del beneficiario, importe, fecha de pago, modalidad (a la orden / no a la orden), cruzado, motivo de pago y referencia; registrar el identificador del eCheq que devuelve el banco. | DFA M18 "eCheq" (mejora); RN-08 §2.5, §13.6 | Estándar | O8 | A validar (PA-TES-03) | El eCheq queda "Emitido – pendiente de aceptación" hasta que el banco informe aceptación. |
| RF-TES-086 | Seguir el ciclo bancario del eCheq emitido: emitido, aceptado, repudiado, endosado por el beneficiario, presentado al cobro, pagado (debitado), rechazado, anulado (solo antes de aceptación). | RN-08 §13.6 ("e-cheq nativo") | Estándar | O8 | A validar (PA-TES-03) | Un eCheq repudiado reabre el pago en M12 y libera el cupo. |
| RF-TES-087 | Recibir eCheq de terceros: registrar en cartera con identificador eCheq, aceptar o repudiar dentro del plazo con alerta de vencimiento del plazo. | DFA M18 "eCheq" | Estándar | O8 | A validar (PA-TES-03) | Un eCheq no aceptado no está En cartera; vencido el plazo sin acción se alerta al tesorero. |
| RF-TES-088 | Endosar eCheq de cartera a proveedores, depositarlos, ponerlos en custodia y negociarlos, con estados propios (Endosado, Depositado, En custodia, Negociado). | DFA M18 "eCheq" | Estándar | O8 | A validar (PA-TES-03) | Cada acción registra el identificador de la operación bancaria o la carga manual con evidencia. |
| RF-TES-089 | Actualizar el estado de los eCheq por importación del archivo/listado del banco o por adaptador de API cuando esté disponible. | FIC 11 (bancos); T06 | Estándar | O8 | A validar (PA-TES-03) | Importar dos veces el mismo listado no altera estados ya aplicados. |
| RF-TES-090 | Registrar avales y cesiones de eCheq como datos del valor, sin afectar disponibilidad hasta su acreditación. | Nuevo (normativa eCheq) | Extensión | O8 | Adoptado | Los avales se muestran en la ficha del valor. |

### 5.8 Tarjetas, cupones y liquidaciones

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-TES-091 | Administrar tarjetas/planes aceptados: código único, nombre, procesador (proveedor M12), código de archivo, número de comercio, débito o crédito, requiere presentación, uso en caja, porcentaje e importe en caja, producto asociado, y recargos por cuotas (cuotas, tipo de recargo, valor). | CAT `TARJETAS`, `TARJETAS_RECARGO`; INV `abm_Tarjetas`, `abm_Tarjetas_Recargo` (`TipoRecargo`); RN-08 §15.1 `clsTarjetas` | Estándar | O8 | Informado | El código de tarjeta es único; M07 usa los recargos configurados al cobrar en cuotas. |
| RF-TES-092 | Recibir los cupones cobrados en caja (servicio invocado por M07) y, tras aceptar la rendición, dejarlos "En tesorería"; los cupones de tarjetas que no requieren presentación (débito) se presentan automáticamente. | RN-08 §2.2 paso 4; CAT `CUPONTAR`; INV `frmCargaCuponesSimple` | Estándar | O8 | Informado | Un cupón de débito queda "Presentado" en el mismo acto de aceptación con movimiento de presentación. |
| RF-TES-093 | Presentar cupones al procesador en lotes (selección por tarjeta, comercio, fecha), registrando el movimiento de presentación. | RN-08 §2.6 `PresentarCupones` (tipo 62) | Estándar | O8 | Informado | Un cupón ya presentado no puede incluirse en otro lote (control de concurrencia como ProCoop). |
| RF-TES-094 | Corregir tarjeta, número de cupón y autorización de un cupón no liquidado, con auditoría. | RN-08 §15.1 `Actualizar_CuponTar` | Estándar | O8 | Informado | Un cupón liquidado no se modifica. |
| RF-TES-095 | Registrar la liquidación (cobro) de cupones: neto acreditado en banco, comisiones, comisiones con IVA diferencial, importe exento, IVA, impuestos, y retenciones sufridas de IVA, Ganancias, IIBB y Seguridad Social con número de certificado; generar el comprobante de gastos del procesador (M12) y las retenciones recibidas. | RN-08 §2.6 `CobrarCupones`; CAT `PAGOTAR` (`IMP_PRE`, `IMP_PAG`, `RET_IVA`, `RET_GAN`, `RET_IBR`, `COMISIO`, `IVA`); RN-09 P2046, P813, P490, P498 | Estándar | O8 | Informado | Bruto = neto + comisiones + IVA + impuestos + retenciones; si no cuadra se exige diferencia explicada. |
| RF-TES-096 | Permitir (por parámetro) cobrar cupones sin comisiones, seleccionar cupones de otros bancos y mostrar una marca adicional configurable en el cobro de cupones. | RN-09 P2378, P2454, P2732 | Estándar | O8 | Informado [VERIFICAR P2732] | Con P2378 desactivado una liquidación sin comisión se rechaza. |
| RF-TES-097 | Anular una presentación (solo con cupones no liquidados, y si la suma coincide con el movimiento) y anular una liquidación. | RN-08 §15.1 `AnularPresentarCupones`, `AnularCobrarCupones` | Estándar | O8 | Informado | La anulación devuelve los cupones al estado anterior. |
| RF-TES-098 | Registrar el rechazo de un cupón, marcando fecha de rechazo y notificando a M07 para generar el anticipo o la nota de débito al socio, según configuración. | RN-08 §2.6 `CrearAnticipoRechazoCupones`, §15.1 `Crear_Anticipo`; RN-09 P1008, P2409, P3177, P3178; INV `frmRechazarCupon` | Estándar | O8 | A validar (PA-TES-13) | El rechazo exige caja/cuenta abierta para registrar el efecto; la deuda del socio la reabre M07, no TES. |
| RF-TES-099 | Conciliar la liquidación del procesador contra la línea bancaria. | RN-08 §2.6 | Estándar | O8 | Adoptado | Una liquidación conciliada pasa a "Acreditada". |
| RF-TES-100 | Importar liquidaciones de procesadores (archivo del adquirente) para registrar automáticamente cupones liquidados, comisiones y retenciones. | Nuevo (mejora) | Extensión | O8 | Adoptado | Las líneas sin cupón correspondiente quedan en bandeja de revisión. |

### 5.9 Retenciones recibidas

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-TES-101 | Registrar retenciones sufridas originadas en cobranzas (servicio invocado por M07), liquidaciones de tarjetas o movimientos de tesorería, con tipo (IIBB, IVA, Ganancias, Seguridad Social), régimen (catálogo M06), agente (CUIT y nombre), jurisdicción, número y fecha de certificado, importe, adjunto. | RN-08 §2.7; CAT `RETENCIO`, `RETS_TIPO`; INV `frmCargaRetenciones`; REL "Retenciones Recibidas" | Estándar | O8 | Informado | Un certificado con el mismo agente, tipo y número no se registra dos veces. |
| RF-TES-102 | Mantener la cartera de retenciones pendientes (no presentadas y sin salida). | RN-08 §2.7, §15.1 `GetRetencionesPendientes` | Estándar | O8 | Informado | El informe de pendientes coincide con la suma de retenciones en cartera de la caja de tesorería. |
| RF-TES-103 | Presentar retenciones (lote) hacia M06 para su cómputo en la DDJJ del período, con control de concurrencia (una retención no se presenta dos veces) y anulación de la presentación si la suma coincide. | RN-08 §2.7 `PresentarRetenciones` (tipo 64), §15.1 (`UPDATE` condicionado, `AnularPresentarRetenciones`) | Estándar | O8 | Informado | Si otro usuario presentó una de las seleccionadas, el lote completo se rechaza con "ya fue presentada". |
| RF-TES-104 | Registrar la salida de retenciones con destino distinto del cómputo (compensación, devolución solicitada, desestimación con motivo). | RN-08 §2.7 `PresentarSalidaRetenciones` | Estándar | O8 | Informado | Cada salida registra destino, motivo y responsable. |
| RF-TES-105 | Editar número y tipo de una retención no presentada y el concepto del movimiento, con auditoría. | RN-08 §15.1 `GuardarPagoModificado` | Estándar | O8 | Informado | Una retención presentada no se edita. |
| RF-TES-106 | Presentar automáticamente las retenciones al aceptar la rendición o al registrar el movimiento, según parámetro. | RN-08 §2.2 paso 5; RN-09 P2952 | Estándar | O8 | A validar (PA-TES-11) | Con el parámetro activo la retención queda "Presentada a M06" en el mismo acto. |

### 5.10 Cajas para pagos a proveedores

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-TES-107 | Abrir y cerrar la caja de pagos del día con usuario, tope de efectivo y medios habilitados (cheques propios, valores, efectivo, transferencias); apertura automática diaria opcional (o reapertura si estaba cerrada). | RN-08 §2.3, §15.1 `ValidarAperturadeCajaAutomatica`; RN-08 §12.1 P134, P135, P2000, P2001, P2002, P2004; CAT `CAJAPAGO`; INV `abm_CajaPago`, `frmApertura_Cierre_Cajas_Comprs`; REL "Cajas para Pagos a Proveedores" | Estándar | O8 | Informado | Sin caja abierta y sin apertura automática, un pago en efectivo se rechaza con "No se encontró una caja habilitada". |
| RF-TES-108 | Calcular el saldo disponible de la caja de pagos como tope menos pagos en efectivo del día, y opcionalmente el efectivo disponible de una caja de cobranza cuando el tenant permite pagar desde ella. | RN-08 §2.3 `GetSaldo_CajaPagos`, §15.1 `GetCajaCobranza_CajaPagos`; RN-08 §12.1 P144 | Estándar | O8 | A validar (PA-TES-12) | Un pago que supera el disponible se rechaza. |
| RF-TES-109 | Registrar pagos en efectivo como "salida pendiente" cuando el importe no supera el máximo configurado, para que la caja entregue el efectivo después con constancia de recepción del proveedor. | RN-08 §4.2 (P144, P2025, `SALIDA_PEN`), §15.3 `GetMediosDePago` | Estándar | O8 | Informado | La salida pendiente no reduce el efectivo hasta la entrega; el informe "Pagos pendientes de salida" la lista. |
| RF-TES-110 | Consultar cajas de pago por mes o por los últimos 12 meses. | RN-08 §15.1 `ConsultarCajas` (defecto `AddYears`) | Estándar | O8 | Adoptado | Con "últimos 12 meses" el rango retrocede efectivamente un año. |
| RF-TES-111 | Cerrar la caja de pagos con arqueo (contado vs teórico), registrar diferencia como quebranto con aprobación y rendir el sobrante a la caja de tesorería. | RN-08 §2.3; INV `frmApertura_Cierre_Cajas_Comprs.cmdCierre_Click` | Estándar | O8 | Adoptado | El cierre queda con totales por medio y diferencia; no se reabre sin permiso. |
| RF-TES-112 | Impedir anular un pago cuyo efectivo salió de una caja sin anular primero la salida de la caja. | RN-08 §4.4 | Estándar | O8 | Informado | La anulación muestra el bloqueo y el vínculo a la salida. |

### 5.11 Ejecución financiera de órdenes de pago y otros egresos

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-TES-113 | Mostrar la bandeja de órdenes de pago aprobadas por M12 pendientes de ejecución, con proveedor, vencimiento, importe bruto, retenciones, neto a pagar, prioridad, cuenta sugerida y estado de firma. | BASE §78 ("tesorería paga"); RN-08 §4.1–4.2; REL Compras "Pago a Proveedores" | Núcleo | O8 | Informado | Solo aparecen OP en estado `approved` de M12; la bandeja no permite cambiar facturas ni retenciones. |
| RF-TES-114 | Registrar los medios de la ejecución: efectivo (caja de pagos), valores de terceros (endoso), cheque propio, eCheq, transferencia (a CBU validado del proveedor), VEP / pago a organismo, débito automático; con fecha y cuenta por medio. | RN-08 §4.2 (tipos 65, 66, 67, 68, 73), §2.1 (medios); INV `frmCargaMedioDePago_Simple` (`chkPagoVep`) | Núcleo | O8 | Informado | La suma de medios debe ser igual al neto a pagar de la OP; si no, no se guarda. |
| RF-TES-115 | Aplicar las categorías configuradas por medio (transferencias, depósito de valores en OP, pago con valores de terceros, pago en efectivo). | RN-08 §12.1 P146, P2066, P2065, P2079 | Estándar | O8 | Informado | Cada movimiento de pago lleva la categoría del parámetro correspondiente o la elegida con permiso. |
| RF-TES-116 | Permitir fecha valor posterior en pagos con transferencia y usar la fecha del movimiento como fecha de emisión, según parámetros. | RN-08 §4.2 (P3044, P2433) | Estándar | O8 | Informado | Con P3044 desactivado una transferencia con fecha futura se rechaza. |
| RF-TES-117 | Firmar ejecuciones de pago por firmantes vigentes de la cuenta según reglas por monto (N firmas), con segregación respecto de quien cargó; firma masiva con los mismos permisos y registro de usuario y fecha por cada pago. | RN-08 §4.3 (`FirmarOP`, `Firmar_Entragar_MasivaOP` sin permisos: defecto), §13.7; CAT `PPAGOS_FIRMAS`, `FIRMASELECTRONICAS`; BASE SUE-013 | Estándar | O8 | A validar (PA-TES-01) | La firma masiva rechaza individualmente los pagos donde el usuario no es firmante o supera su tope y lista hasta todos los rechazados con causa. |
| RF-TES-118 | Entregar la ejecución (al proveedor o al banco) solo si está firmada; entrega masiva con permisos y registro. | RN-08 §4.3 `EntregarOP` | Estándar | O8 | Informado | Una ejecución no firmada no puede entregarse. |
| RF-TES-119 | Agrupar transferencias con CBU en lotes de pago para generar el archivo bancario (RF-TES-056) o enviarlas por adaptador. | RN-08 §4.2 (`GEN_ARCHIVO`) | Estándar | O8 | Informado | Una transferencia no puede estar en dos lotes vigentes. |
| RF-TES-120 | Anular una ejecución de pago: reverso de movimientos, cheques propios (anulados o recuperados según elección), valores de terceros vueltos a cartera, salida de caja; aviso a M12 para reponer saldos y anular retenciones; con período abierto de Tesorería y Bancos. | RN-08 §4.4 `Anular` | Estándar | O8 | Informado | M12 recibe `tes.paymentExecution.voided` y repone el saldo de facturas; no se borra ningún registro. |
| RF-TES-121 | Informar "pagos pendientes de salida" por medio (efectivo, transferencia, cheque propio) con total, y "pagos diferidos" (movimientos cuya fecha difiere de la fecha de pago). | RN-08 §15.3 `PagosEnEfectivoPendientes`, `PagosPendientes`, `PagosDiferidos` | Estándar | O8 | Informado | Las filas TOTAL coinciden con la suma por medio. |
| RF-TES-122 | Ejecutar el pago a organismos de obligaciones fiscales determinadas por M06 (retenciones y percepciones practicadas, impuestos propios), por VEP o débito, como movimiento distinto del pago neto al proveedor. **Cada pago identifica la obligación que cancela** (DEC-095): la ejecución (`paymentExecutions`, `kind = agencyObligation`) nace de `fis.obligation.created` con `sourceRef.docId` = obligación de `taxObligations` de M06 y guarda `taxObligation` con `ownTaxObligationId` si es una obligación propia de la cooperativa como contribuyente (registro `ownTaxObligations` de M06) o `taxAgentRegistrationId` si es como agente, más su entidad jurídica. Al ejecutarse o anularse publica `tes.paymentExecution.executed` / `.voided` (EVT-TES-15) con esos datos, que M06 usa para pasar la obligación a `paid` (con `treasuryMovementId`) y M15 para el asiento de pago (M-51 si es como agente, M-138 si es propia). El pago sale de una cuenta de la misma entidad jurídica de la obligación. **Obligación anulada (DEC-095, DEC-107; 10-11-2026):** al recibir `fis.obligation.cancelled` (EVT-FIS-26; M06 RN-FIS-133 puntos 7 y 8), M14 anula (`voided`, motivo `taxObligationCancelled` con el `reason` de M06) la ejecución de esa obligación si todavía no salió dinero (`pending`, `instrumented`, `partiallySigned` o `signed`), revierte las reservas de medios y publica `tes.paymentExecution.voided`; si ya está `delivered` o `sentToBank` no la anula sola: la marca con el aviso `taxObligationCancelled` en la bandeja de pagos del tesorero para que el tesorero la anule según §8.9 o la deje ejecutar; una `executed` no se toca (M06 no anula obligaciones `paid`). Si la anulación trae `replacedByObligationId`, la ejecución nueva nace del `fis.obligation.created` de la obligación recalculada. **Estado de la anulación (DEC-095; 10-11-2026, última ronda; M06 RN-FIS-133 punto 9):** M14 lee `cancellationStatus` de EVT-FIS-26. Con `pendingPaymentReconciliation` (obligación `ordered` que M06 deja en `cancellationPending`) aplica lo anterior. El aviso `taxObligationCancelled` al tesorero (`dict:tes.paymentInbox.alert.taxObligationCancelled`, T03 §10.9.14) aclara que M06 espera el resultado del pago: si la ejecución se anula (o el banco devuelve el pago y se anula la `executed`), M14 publica `tes.paymentExecution.voided` y M06 cierra la anulación; si se deja ejecutar, M14 publica `tes.paymentExecution.executed` y M06 registra el importe pagado como saldo a favor ante el organismo (`creditBalanceAmount`); un `tes.paymentExecution.rejected` no resuelve la anulación, por lo que el aviso indica anular la ejecución en lugar de reinstrumentarla. Con `final` posterior a una `pendingPaymentReconciliation` ya procesada para la misma obligación, la segunda publicación es idempotente (clave `{obligationId, cancellationStatus}`): no vuelve a anular la ejecución ni duplica el aviso; marca el aviso como resuelto y muestra el `creditBalanceAmount` si viene. Con `final` sin publicación previa para esa obligación (obligación `pending` en M06), aplica el tratamiento de la primera publicación. | BASE §52 (Tesorería: pago neto y obligación al organismo como movimientos distintos; CU-FIS-01 paso 6); DEC-095 | Estándar | O8 | Informado | CU-FIS-01: neto 98.000 al proveedor y 2.000 al organismo en dos movimientos con orígenes distintos. El pago de una contribución propia de COOP (ARS 150.000, período 2026-06; valores ficticios) publica EVT-TES-15 `executed` con `taxObligationId`, `ownTaxObligationId` y `legalEntityId` de COOP; una ejecución a organismo sin obligación de M06 se rechaza; pagarla desde una cuenta de MUTUAL se rechaza. |
| RF-TES-123 | Ejecutar reintegros y devoluciones a socios aprobados por M07 (AGR-013) y reintegros de excedentes (AGR-012), por transferencia o cheque, sin ejecutar dos veces al repetir la orden. | AGR-012, AGR-013 | Estándar | O5 | Informado | Una misma solicitud de reintegro reenviada con la misma `Idempotency-Key` devuelve la ejecución existente. |
| RF-TES-124 | Emitir el comprobante de pago (detalle de medios) y notificar al proveedor (portal M12) o al socio. | RN-08 §15.3 `GetMediosDePago` (marca impreso); BASE §78 | Estándar | O8 | Adoptado | El comprobante muestra medios, retenciones (de M12) y firmas. |
| RF-TES-125 | Mostrar al proveedor en el portal (M12) el estado financiero de su pago: pendiente, firmado, entregado, transferido, debitado. | RN-08 §15.3 (estado informado al proveedor) | Extensión | O8 | Adoptado | El estado "Pago generado" de ProCoop se reemplaza por los estados de §8. |

### 5.12 Rendiciones de cajas de cobranza y depósito

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-TES-126 | Crear automáticamente una rendición cuando M07 cierra una caja de cobranza, con totales teóricos y contados por medio (efectivo por moneda, cheques, cupones, retenciones, transferencias recibidas, otros) y detalle de cada valor. | RN-08 §2.2 (`CerrarCaja` pasos 1–8); BASE §78 (OPE-004 "rendición"); CAT `CAJAS` (`TOT_EFE`, `TOT_CHE`, `TOT_RET`, `TOT_TAR`, `TOT_DIF`) | Núcleo | O5 | Informado | Cada caja cerrada genera exactamente una rendición (idempotencia por `cashSessionId`). |
| RF-TES-127 | Recibir la rendición en tesorería: conteo del efectivo (por denominación opcional), verificación de cada valor y cupón, y aceptación u observación con motivo. | BASE §102.8 (procedimientos de arqueo); PA-TES-06 | Núcleo | O5 | A validar (PA-TES-06) | Una rendición observada vuelve a M07 con la diferencia y no afecta la caja de tesorería hasta su resolución. |
| RF-TES-128 | Al aceptar la rendición: ingresar el efectivo a la caja de tesorería; pasar cheques de Recibido a En cartera; dejar cupones En tesorería (presentando automáticamente los de débito); dejar retenciones en cartera (presentando según P2952); registrar las transferencias recibidas como ingreso en la cuenta bancaria destino pendiente de conciliación; todo bajo una única operación. | RN-08 §2.2 pasos 1, 3, 4, 5, 7 | Núcleo | O5 (efectivo y transferencias) / O8 (valores, cupones, retenciones) | Informado | La suma de lo ingresado a tesorería por medio coincide con lo rendido aceptado. |
| RF-TES-129 | Registrar la diferencia de efectivo de la rendición (quebranto de ingreso o egreso) con aprobación, separada de la recaudación. | RN-08 §2.2 paso 2 (tipos 50/51, `TOT_DIF`) | Núcleo | O5 | Informado | El quebranto tiene categoría propia y responsable; no modifica cobros de socios. |
| RF-TES-130 | Registrar una rendición "en cero" cuando la caja no tuvo operaciones. | RN-08 §2.2 paso 8 | Estándar | O5 | Informado | La rendición en cero queda aceptada automáticamente y figura en el informe de cajas. |
| RF-TES-131 | Admitir la rendición consolidada de varios días de efectivo de una misma caja (solo efectivo) y su anulación, que reabre las rendiciones incluidas. | RN-08 §2.2 (P2688), `AnularCierreCajas` | Estándar | O8 | Informado | Con P2688 desactivado no se puede consolidar. |
| RF-TES-132 | Registrar depósitos bancarios de efectivo y valores desde la caja de tesorería con boleta (número, fecha, cuenta, detalle), con el importe en tránsito hasta su acreditación. | RN-08 §2.1 (tipos 1, 2); RN-09 P2063, P2064; BASE §21 (excepción: en tránsito) | Núcleo | O5 | Informado | El depósito resta la caja de tesorería y no suma al disponible del banco hasta conciliar la acreditación. |
| RF-TES-133 | Registrar transferencias de fondos desde una caja de tesorería a otra (sucursales) o a bancos, con tránsito. | RN-08 §2.1 (tipos 5–9) | Estándar | O5 | Informado | La caja origen y destino cuadran; el tránsito se cancela al recibir. |
| RF-TES-134 | Registrar el ingreso esperado por rendiciones de entes externos y pasarelas (neto informado por M07) como "a acreditar" y conciliarlo. | BASE §13; BASE §78; RF-TES-043 | Núcleo | O5 | Informado | El neto esperado figura en la posición como "a acreditar", nunca como disponible. |
| RF-TES-135 | Alertar rendiciones pendientes de recepción más allá de N horas y cajas de cobranza abiertas de días anteriores. | RN-08 §15.1 (`Get_CAJAS_Abiertas`, anteriores abiertas), §15.2 `GetCajasAbiertas`; RN-09 P3100 | Estándar | O5 | Adoptado | La alerta diaria lista cajas y rendiciones con antigüedad. |

### 5.13 Cierre de cajas de tesorería

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-TES-136 | Realizar el arqueo de la caja de tesorería por moneda y, opcionalmente, por denominación. | DFA M18 "Cierre de Cajas"; REL "Cierre de Cajas" | Núcleo | O5 | Informado | El arqueo registra contado, teórico y diferencia. |
| RF-TES-137 | Cerrar diariamente cada caja de tesorería: saldo inicial + ingresos − egresos = saldo teórico, comparado con el contado; diferencia como quebranto con aprobación; el saldo final es el inicial del día siguiente. | RN-08 §2.2 (cierre), §15.1 `GetPlanillaDiaria` | Núcleo | O5 | Informado | No se registran movimientos con fecha de un día cerrado de esa caja salvo reapertura. |
| RF-TES-138 | Reabrir un cierre de caja de tesorería con permiso de supervisor, motivo y auditoría, solo si el período no está cerrado. | RN-08 §2.2 `AnularCierreCajas` | Estándar | O5 | Informado | La reapertura revierte el quebranto si existía. |
| RF-TES-139 | Validar que todas las cajas (cobranza, pagos y tesorería) de un rango estén cerradas antes del cierre del período de Tesorería y antes de que M15 cierre el período contable. | RN-09 P3100; RN-08 §15.2 `GetCajasAbiertas` | Estándar | O5 | Informado | El cierre de período muestra la lista de cajas abiertas como bloqueante. |

### 5.14 Monedas y cotizaciones

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-TES-140 | Habilitar monedas por tenant desde el catálogo ISO de plataforma, con descripción, abreviatura, símbolo, divisible, porcentaje de percepción, regla de redondeo, admite vuelto, permitida en caja y marca de sistema. | CAT `TIP_MON` (`DES_MON`, `DES_RED`, `SIMBOLO`, `COT_PES`, `DIVISIBLE`, `POR_PER`, `REDONDEO`, `PER_VUELTO`, `PERMITIDO`, `SISTEMA`); DFA M18 Monedas | Núcleo (ARS) / Estándar (otras) | O5 (ARS) / O8 | Informado | ARS siempre habilitada y no desactivable. |
| RF-TES-141 | Registrar cotizaciones por moneda, fecha y hora, comprador y vendedor, con fuente (ARCA, BNA, manual) y usuario. | CAT `COT_DOL` (`FEC_COT`, `HOR_COT`, `COT_DOLAR`, `COD_MON`, `COTIZACION_VENTA`); FIC 11.3 | Estándar | O8 | Informado | No hay dos cotizaciones de la misma moneda, fuente y fecha-hora. |
| RF-TES-142 | Obtener automáticamente la cotización diaria desde ARCA (`FEParamGetCotizacion`) u otra fuente configurada. | FIC 11.3 (`clsTipMon.GetCotizacion`) | Estándar | O8 | A validar (PA-TES-09) | Un fallo de la fuente genera alerta y permite carga manual con aprobación. |
| RF-TES-143 | Valuar saldos en moneda extranjera a la cotización vigente a la fecha (última ≤ fecha) en disponibilidades y posición, e informar a M15 la diferencia de cambio al cierre. | RN-08 §15.1 `GetDisponibilidades` (última `COT_DOL` ≤ fecha) | Estándar | O8 | A validar (PA-TES-10) | El informe muestra saldo en moneda de origen, cotización usada y equivalente en pesos. |
| RF-TES-144 | Usar la moneda por defecto configurada al cargar medios en caja y tesorería. | RN-08 §2.1 (P186) | Estándar | O5 | Informado | El medio se inicializa en la moneda del parámetro. |

### 5.15 Flujo de fondos, posición y escenarios

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-TES-145 | Consultar la posición diaria consolidada y por cuenta: disponible, en tránsito, a acreditar (depósitos, pasarelas, cupones presentados), valores en cartera, cheques propios emitidos no debitados, saldo neto. Además, en una **línea separada "en cajas sin rendir"** (`dict:tes.position.unremittedCash`), el efectivo y los valores (cheques, cupones, retenciones, transferencias recibidas) de las cajas de cobranza de M07 abiertas o cerradas cuya rendición M14 todavía no aceptó, por medio y moneda, con detalle por caja (caja, sucursal, cajero, estado de la sesión, fecha de negocio, estado de la rendición) y antigüedad en días desde la fecha de negocio. Los datos se leen del servicio de consulta de M07 `cob.service.getUnremittedCash` (RF-COB-195) a la fecha de la posición; TES no lee las colecciones de M07 ni copia sus saldos (RN-DAT-003). La línea **no se suma** al disponible ni al saldo neto (RN-TES-001); se suma recién cuando la rendición se acepta y entra a la caja de tesorería (RF-TES-127). (DEC-101) | BASE §21 "Consultar posición diaria", CU-21; RN-08 §15.1 `GetDisponibilidades`, `GetComposicionCartera`; DEC-101 | Núcleo | O5 (básica) / O8 | Informado | CU-21: saldo actual 107.840 y proyección 77.840. Con una caja abierta con ARS 25.000 de efectivo teórico y otra cerrada ayer con ARS 12.000 en efectivo y un cheque de ARS 3.000 con rendición pendiente de aceptación, la línea "en cajas sin rendir" muestra ARS 40.000 (efectivo 37.000, cheques 3.000) con dos filas de detalle (antigüedad 0 y 1 día) y el saldo actual sigue en 107.840; al aceptar la rendición de ayer, la línea baja a 25.000 y el disponible sube en lo aceptado. |
| RF-TES-146 | Proyectar cobros a partir de los vencimientos a cobrar de cuenta corriente (M07), acreditaciones pendientes de pasarelas y entes, valores en cartera por fecha de pago y cupones presentados por fecha estimada de liquidación. | BASE §21 "Proyectar cobros y pagos"; DFA M18 "Flujo de fondos proyectado a partir de vencimientos a cobrar y a pagar" | Estándar | O8 | A validar (PA-TES-14) | Cada fila proyectada informa su origen y el supuesto aplicado. |
| RF-TES-147 | Proyectar pagos a partir de facturas de proveedores con saldo por vencimiento (M12), OP aprobadas no ejecutadas, cheques propios y eCheq diferidos no debitados, obligaciones fiscales (M06), lotes de haberes (M16), previsiones fijas y compromisos. | RN-08 §15.1 `GetPrevisiones_*`; §15.3 `GetPrevisionesCompras` (tres orígenes) | Estándar | O8 | Informado | Lo vencido no pagado se agrupa en "hoy" (RN-08 §15.1 `GetSaldosaFuturo`). |
| RF-TES-148 | Administrar previsiones manuales y periódicas (mensual, bimestral, trimestral, semanal, quincenal) con proveedor/contraparte, concepto, importe y vigencia, expandidas dentro del rango consultado. | CAT `PREV_COM` (`PERIODICIDAD` 1–5); RN-08 §15.3 | Estándar | O8 | Informado | Una previsión mensual de 10.000 entre enero y marzo aparece tres veces en la proyección del trimestre. |
| RF-TES-149 | Programar obligaciones (fecha y cuenta de pago prevista) para OP aprobadas y obligaciones fiscales. | BASE §21 "Programar obligaciones" | Estándar | O8 | Informado | Una obligación programada aparece en la fecha elegida y no en su vencimiento original. |
| RF-TES-150 | Controlar vencimientos de instrumentos: valores en cartera, cheques propios diferidos, eCheq pendientes de aceptación, plazos fijos u otras colocaciones registradas como cuentas. | BASE §21 "Controlar vencimientos de instrumentos" | Estándar | O8 | Informado | La agenda de vencimientos lista instrumentos por fecha con alerta configurable. |
| RF-TES-151 | Elaborar escenarios de liquidez con supuestos explícitos (porcentaje de cobrabilidad por antigüedad, demora de acreditación, postergación de pagos, previsiones hipotéticas) sin alterar datos reales, y compararlos con la proyección base. | BASE §21 "Elaborar escenarios de liquidez"; BASE §75 (simulación aislada) | Estándar | O8 | Informado | Un escenario no genera movimientos ni compromisos; se identifica como simulación en toda salida. |
| RF-TES-152 | Agrupar la proyección por día, semana o mes, por cuenta, moneda, sucursal, servicio y centro de costo. | BASE §78 (análisis por servicio) | Estándar | O8 | Adoptado | Los totales por agrupación suman el total general. |
| RF-TES-153 | Alertar cuando el saldo proyectado de una cuenta o consolidado caiga por debajo del mínimo configurado en el horizonte. | BASE §21 ("qué compromisos próximos podrían consumirlo") | Estándar | O8 | Adoptado | La alerta indica fecha, cuenta, saldo proyectado y principales egresos que lo explican. |
| RF-TES-154 | Ocultar en la proyección los pagos individuales a empleados a usuarios sin permiso de sueldos (se muestran agregados). | RN-08 §15.3 (P2653, permiso `frm_Su_Sueldo`), §15.7 | Estándar | O8 | Informado | Sin `tes.haberes.verDetalle` se ve una sola línea "Haberes". |
| RF-TES-155 | Guardar fotografías (snapshots) de la proyección y compararlas con lo realmente ocurrido (desvío por origen). | Nuevo (mejora de control) | Extensión | O8 | Adoptado | El informe de desvío muestra proyectado, real y diferencia por semana. |

### 5.16 Compromisos de fondos

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-TES-156 | Registrar compromisos de fondos al aprobarse una OC o contrato en M12, o manualmente, con importe, moneda, fecha esperada de pago, servicio, centro de costo y referencia. | AGR-028; BASE §21 | Estándar | O8 | A validar (PA-TES-08) | AGR-028: "una compra aprobada compromete fondos aunque todavía no exista factura". |
| RF-TES-157 | Consumir el compromiso cuando se registra la factura (pasa a obligación) y cuando se paga; liberarlo al cancelar la OC sin inventar un ingreso. | AGR-028 (ejemplo) | Estándar | O8 | A validar (PA-TES-08) | Cancelar una OC de 40.000 libera 40.000 de compromiso; la proyección deja de mostrarlo. |
| RF-TES-158 | Exponer a M15 los estados comprometido, devengado y pagado por servicio/centro para la comparación con el presupuesto, sin sumarlos como gastos independientes. | AGR-028 (criterio de aceptación) | Estándar | O8 | A validar (PA-TES-08) | La suma comprometido + devengado + pagado nunca se presenta como gasto total. |
| RF-TES-159 | Advertir al aprobar un compromiso que excede la disponibilidad proyectada en su fecha o el límite de autorización configurado. | AGR-028 ("límites de autorización, excepciones") | Extensión | O8 | Adoptado | La advertencia no bloquea salvo que el tenant lo configure. |

### 5.17 Pago de haberes

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-TES-160 | Recibir el lote de pago de haberes aprobado por M16 (empleado, neto, cuentas de acreditación con porcentajes) como obligación a ejecutar, sin simular facturas de proveedor. | BASE §104 SUE-009; RN-08 §11.5 (ProCoop crea factura de compra y OP); DEC-058 (en O8 el lote llega desde la importación de la liquidación externa de M16, CU-28; en O9 desde la liquidación propia) | Estándar | O9 | A validar (PA-TES-07) | El lote se ejecuta por TES; M16 no ve movimientos bancarios ajenos. |
| RF-TES-161 | Generar el archivo de acreditación por banco (Interbanking, Banco Nación y otros formatos), con CBU de origen de la cuenta elegida, datos de la empresa y códigos por banco; repartir el neto entre varias cuentas del empleado cuando corresponde. | RN-08 §11.5, §12.5 (P2262, P2406, P2449, P2671, P2672, P2944, P326, P2468, P3129), §15.7 P3129; RN-13 §16.4 (sueldos) | Estándar | O9 | Informado | La suma del archivo es igual al neto del lote; con varias cuentas los porcentajes suman 100. |
| RF-TES-162 | Permitir modificar la fecha de transferencia del pago de haberes según parámetro, con advertencia de efecto contable. | RN-09 P2288 | Estándar | O9 | Informado | Con el parámetro desactivado la fecha es la del lote. |
| RF-TES-163 | Registrar el débito bancario del lote, los rechazos por empleado y su reproceso; informar a M16 la confirmación de acreditación por empleado. | BASE §104 (paso 4: "Tesorería confirma la acreditación"); CAT `SU_AUDIT_TRA_INTERBANKING` | Estándar | O9 | Informado | Un rechazo de un empleado no reabre todo el lote; M16 marca pagado solo lo confirmado. |
| RF-TES-164 | Restringir la visualización de importes individuales de haberes a usuarios con permiso específico. | BASE §104; RN-08 §15.7 P2653 | Estándar | O9 | Adoptado | Un tesorero sin `tes.haberes.verDetalle` ve totales del lote, no importes por persona. |
| RF-TES-165 | Anular un pago de haberes revirtiendo los movimientos de tesorería e informando a M16. | RN-08 §15.6 `AnularPago` (no revierte tesorería: defecto) | Estándar | O9 | Adoptado | La anulación revierte el movimiento bancario y M16 reabre el pago. |

### 5.18 Informes de tesorería

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-TES-166 | Planilla diaria de tesorería agrupada por tipo de movimiento con saldo anterior y neto. | RN-08 §15.1 `GetPlanillaDiaria` | Núcleo | O5 | Informado | Saldo anterior + neto del día = saldo final. |
| RF-TES-167 | Composición de cartera: efectivo, valores, cupones, retenciones, más cupones presentados no cobrados a la fecha. | RN-08 §15.1 `GetComposicionCartera` | Estándar | O8 | Informado | Coincide con la suma de saldos de cartera de las cajas de tesorería. |
| RF-TES-168 | Disponibilidades: cajas de tesorería y bancos marcados, con saldo contable y operativo y moneda extranjera convertida. Debajo del total, la línea separada "en cajas sin rendir" de RF-TES-145, con el mismo detalle por caja y antigüedad, leída de M07 (RF-COB-195) y fuera del total de disponibilidades. (DEC-101) | RN-08 §15.1 `GetDisponibilidades`; DEC-101 | Núcleo | O5 | Informado | Solo incluye cuentas marcadas "incluir en disponibilidades"; el total no cambia por el efectivo de cajas de cobranza sin rendir, que se informa aparte. |
| RF-TES-169 | Saldos de bancos (operativo y contable) y saldos a futuro. | RN-08 §15.1 `GetSaldosBancos`, `GetSaldosaFuturo` | Núcleo | O5 | Informado | Lo vencido se agrupa en hoy. |
| RF-TES-170 | Libro de bancos por cuenta y período. | RN-08 §15.1 `GetLibroBancos` | Núcleo | O5 | Informado | Ver RF-TES-030. |
| RF-TES-171 | Cheques propios y transferencias de OP no debitados, agrupados por semana. | RN-08 §15.1 `GetChequesNoDebitados` | Estándar | O8 | Informado | Excluye los conciliados. |
| RF-TES-172 | Previsiones agrupadas y detalladas (flujo de fondos). | RN-08 §15.1 `GetPrevisiones_Agrupado`, `_Detallado` | Estándar | O8 | Informado | Coincide con la proyección base. |
| RF-TES-173 | Cupones por estado (en tesorería, presentados, pendientes de cobro, cobrados) y cobranza de tarjetas (con retención de Seguridad Social calculada por diferencia cuando no viene informada). | RN-08 §15.1 `Imprimir_CuponesPorEstado`, `GetCobranzaTarjetas` | Estándar | O8 | Informado | Los cuatro estados suman el total de cupones del período. |
| RF-TES-174 | Listado de valores con seis tipos de fecha (emisión, pago, recepción, depósito, rechazo, recupero), valores depositados (estados 4 a 7), valores recibidos, rechazados no recuperados, disponibles para pago, transferidos desde caja. | RN-08 §15.1 `GetListadoValores`, `GetValores`, `GetValoresRecibidos`, filtros 100–102 | Estándar | O8 | Informado | Cada filtro reproduce el universo de ProCoop. |
| RF-TES-175 | Movimientos de cuentas conciliados, no conciliados y por fecha de conciliación. | RN-08 §15.1 `GetMovimientosCuentas` | Núcleo | O5 | Informado | Filtros 1, 2 y 3 equivalentes. |
| RF-TES-176 | Depósitos a acreditar por fecha probable. | RN-08 §15.1 `GetDepositos_ACreditaciones` | Núcleo | O5 | Informado | Lista depósitos no conciliados con fecha probable ≤ fecha de consulta. |
| RF-TES-177 | Retenciones recibidas por tipo, período, agente, estado. | RN-08 §15.1 `GetRetenciones` | Estándar | O8 | Informado | Totales por tipo coinciden con la cartera. |
| RF-TES-178 | Cajas abiertas y cerradas (cobranza, pagos, tesorería) por rango. | RN-08 §15.1 `GetCajasAbiertasCerradas` | Estándar | O5 | Informado | El listado para un rango de fechas muestra cada caja de cobranza, de pagos y de tesorería con apertura, cierre y estado; una caja sin cierre al final del rango figura como abierta y la cantidad de cajas coincide con las sesiones registradas en ese rango. |
| RF-TES-179 | Gastos financieros por clase, cuenta y período. | BASE §21 | Estándar | O5 | Adoptado | Suma por clase igual a movimientos de esas categorías. |
| RF-TES-180 | Conciliación bancaria (reporte firmado) y antigüedad de partidas pendientes. | BASE §75 | Núcleo | O5 | Adoptado | El reporte de conciliación a una fecha de corte muestra saldo según extracto, saldo según libros y partidas pendientes agrupadas por antigüedad; saldo del extracto más o menos las partidas pendientes es igual al saldo según libros, y el PDF lleva quién cerró y quién aprobó la conciliación. |
| RF-TES-181 | Exportar todo informe a XLSX, CSV y PDF desde `DataTable`, y exponer vistas de tesorería a T10 (BI) con fecha de corte y universo declarados. | CNX (DataTable); AGR-022 | Estándar | O5 | Adoptado | Cada exportación incluye fecha de corte, filtros y usuario. |
| RF-TES-182 | Movimientos de tesorería y bancos genéricos por filtros (listados de ProCoop sin regla propia). | RN-08 §15.1 `GetMovimientos`, `GetTarjetas`, `GetListados` | Estándar | O5 | Informado | El listado filtrado por cuenta, rango de fechas, tipo de movimiento e instrumento devuelve los mismos movimientos que el libro de tesorería con esos filtros, y su total es igual a la suma de entradas menos salidas. |

### 5.19 Transversales del módulo

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-TES-183 | Toda operación económica de TES por API exige `Idempotency-Key` y devuelve el mismo resultado al repetirse. | AGR-016; guía §5 | Núcleo | O5 | Informado | Dos POST iguales con la misma clave generan un único efecto. |
| RF-TES-184 | Auditar altas, cambios, anulaciones, aprobaciones, conciliaciones, desconciliaciones, cambios de configuración y accesos a credenciales. | BASE §21; T02 | Núcleo | O5 | Informado | La auditoría muestra antes/después, usuario, fecha, IP y `requestId`. |
| RF-TES-185 | Aislar datos por tenant y limitar por alcance de cuentas financieras asignadas al usuario. | DEC-002; CNX §2.4 | Núcleo | O5 | Informado | Un usuario del tenant A no ve ni por API ni por exportación datos del tenant B; un auxiliar sin la cuenta X no la ve. |
| RF-TES-186 | Notificar a responsables: rendiciones pendientes, conciliaciones atrasadas, valores por vencer, eCheq por aceptar, pagos por firmar, saldo proyectado bajo mínimo, errores de integración. | BASE §21; T09 | Estándar | O5 | Adoptado | Cada notificación lleva enlace a la pantalla y respeta preferencias del usuario. |
| RF-TES-187 | Ofrecer en la PWA de empleado la firma de pagos y la consulta de posición diaria para firmantes y gerencia. | CNX (PWA empleado); BASE §21 (gerencia) | Extensión | O8 | Adoptado | La firma desde la PWA exige 2FA reciente (T02). |
| RF-TES-188 | Bandeja técnica/operativa de excepciones de tesorería: eventos no procesados, archivos sin respuesta, líneas sin clasificar, acreditaciones no identificadas, diferencias de rendición. | AGR-016 | Núcleo | O5 | Informado | Ningún caso se pierde; cada caso tiene responsable y estado. |

## 6. Reglas de negocio

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-TES-001 | Un cobro esperado no es disponibilidad: los importes en tránsito, a acreditar o en cartera no suman al disponible de la cuenta bancaria. Tampoco suman el efectivo y los valores en cajas de cobranza sin rendir (sesiones de M07 que no están `handedOver`): se informan en su línea propia y entran al disponible solo al aceptarse la rendición (DEC-101). Las cajas virtuales de entes y canales digitales no forman parte de esa línea: su neto ya figura como "a acreditar" (RF-TES-134). | ProCoop "Disponibilidades" suma tesorería y bancos marcados; previsiones mezclan valores en cartera (RN-08 §15.1) | **Mejorar**: posición con columnas separadas (BASE §21) | — | — |
| RN-TES-002 | El saldo de cada cuenta se deriva de sus movimientos válidos (no anulados); no existe saldo editable. | `BANKOS.SALDO`, `SAL_INI` guardados como campos (CAT) | **Reemplazar**: saldo materializado recalculable y verificado por job (AGR-011) | — | — |
| RN-TES-003 | Todo movimiento pertenece a una operación; una operación balancea ingresos y egresos (o es unilateral por definición de su tipo: depósito, extracción, gasto). | `COD_INT` agrupa `TESORE`/`RESBAN` (RN-08 §2.1) | **Replicar** con validación de balance | — | — |
| RN-TES-004 | El número de operación se toma del talonario "Operación de tesorería" de forma atómica. | Mayor entre `TESORE.COD_INT` y `RESBAN.NUM_MOVT` + 1 (RN-08 §15.1) | **Reemplazar** por secuencia atómica por tenant/sucursal | — | — |
| RN-TES-005 | En movimientos bancarios un importe positivo es ingreso (haber del banco) y uno negativo es egreso. | `RESBAN`: negativo → `DEBE`, positivo → `HABER` (RN-08 §15.1) | **Replicar** semántica con campos `direction` (`in`/`out`) e importe siempre positivo | — | — |
| RN-TES-006 | Si la fecha del ítem no es válida se usa la del movimiento; concepto y observación tienen longitud máxima validada (no truncada en silencio). | Fecha < 1950 → fecha del movimiento; trunca a 50/150 (RN-08 §15.1) | **Mejorar**: validación explícita con error, sin truncar | — | — |
| RN-TES-007 | La cotización es 1 en moneda local; en moneda extranjera se guarda la cotización usada. | `COT_PES` en ME, nula en local (RN-08 §15.1) | **Replicar** | PRM-TES-010 | — |
| RN-TES-008 | Los importes históricos (debe/haber en moneda de origen) se guardan con el mismo signo en toda vía de registro. | Segunda sobrecarga carga `DEBE_HIS`/`HABER_HIS` invertidos (RN-08 §15.1, defecto) | **Descartar defecto** | — | Sí: impacto en datos migrados (ver §19) |
| RN-TES-009 | No se registra ni anula un movimiento con fecha en período cerrado de Bancos o Tesorería. | P502 (Bancos), P506 (Tesorería), `Nucleo.ModuloCerrado` (RN-08 §1.1) | **Mejorar**: entidad de períodos unificada (RN-08 §13.3) | PRM-TES-001, PRM-TES-002 | — |
| RN-TES-010 | Las acciones sensibles exigen capability; las masivas también, y siempre registran usuario y fecha. | `Valida_Controles` (`Anula_OP`, `Firma_OP`, `Entrega_OP`); masivo sin permisos (RN-08 §1.4, §4.3) | **Mejorar** (CTR-TES-08) | — | — |
| RN-TES-011 | La anulación revierte con movimientos espejo vinculados y nunca borra. | `Anular` pone `ENTRADA + SALIDA = 0` y anula (RN-08 §15.1) | **Mejorar**: reversa explícita | — | — |
| RN-TES-012 | Anular una operación no anula los cheques propios salvo elección explícita. | `Anular` sin anular cheques propios (RN-08 §15.1); `Anular` de OP opcionalmente (RN-08 §4.4) | **Replicar** como opción del usuario | — | — |
| RN-TES-013 | Las consultas de saldo excluyen movimientos anulados y sus reversas de forma consistente. | Excluyen `ENTRADA + SALIDA = 0` (RN-08 §15.1) | **Replicar** por estado | — | — |
| RN-TES-014 | Cada movimiento lleva tipo (catálogo cerrado) y categoría (configurable) que determina la regla contable. | `Tipos_Movimientos_Tesoreria` + `CAT_BANC` (RN-08 §2.1) | **Replicar**; la cuenta contable la resuelve M15 por regla | — | — |
| RN-TES-015 | Los medios de pago son: efectivo, cheque propio, eCheq propio, cheque de terceros, eCheq de terceros, transferencia (banco, tarjeta, QR), retención, cupón de tarjeta, débito automático, VEP. | Enum fijo `MediosDePago` y tipos de transferencia Banco/Tarjeta/QR (RN-08 §2.1) | **Mejorar**: agrega eCheq, débito, VEP | — | — |
| RN-TES-016 | La fecha probable de acreditación solo aplica a depósitos de valores (y a cupones presentados en la proyección). | `FEPROACRE` solo en depósito de valores (RN-08 §15.1) | **Replicar** y extender a cupones | PRM-TES-033 | — |
| RN-TES-017 | Una transferencia interna con fechas valor distintas pasa por cuenta de tránsito. | Tipo 70 directo (RN-08 §2.1) | **Mejorar** | — | — |
| RN-TES-018 | Cambio de valores solo con los medios de entrada y salida habilitados. | P2058–P2062 sin lectura directa en código (RN-09) | **Replicar** como validación | PRM-TES-015…019 | Sí: uso real |
| RN-TES-019 | Al cerrar una caja de cobranza todo su contenido pasa a tesorería en una única operación: efectivo teórico, diferencia como quebranto, valores Recibido → En cartera, cupones (débito autopresentados), retenciones (autopresentadas con P2952), transferencias recibidas (ingreso y egreso en tesorería y un movimiento por transferencia en el banco destino), caja en cero si no hubo operaciones. | `CerrarCaja` pasos 1–8 (RN-08 §2.2) | **Mejorar**: el cierre es de M07; TES genera la rendición y la acepta (doble control, PA-TES-06) | PRM-TES-028, PRM-TES-029 | — |
| RN-TES-020 | El cierre de caja de cobranza no registra pagos de capital social. | Con P2543 desactivado registra pagos de capital (RN-08 §2.2 paso 6) | **Reemplazar**: M17 consume el evento de cobro (CTR-TES-15) | PRM-TES-030 (solo migración) | — |
| RN-TES-021 | Con cierre multi-día solo se consolida efectivo; anular el cierre reabre las cajas de las otras fechas. | P2688, `AnularCierreCajas` (RN-08 §2.2) | **Replicar** | PRM-TES-031 | — |
| RN-TES-022 | Un número de caja está ocupado si se usó ese día, si es el de un banco o si está asignado a un usuario; se asigna el primero libre; el número 0 no es válido. | `Get_CAJAS_NoDisponible`, `AbrirCajaWeb` (RN-08 §15.1) | **Replicar en M07** (dueño de cajas de cobranza); TES solo asocia caja ↔ cuenta | — | — |
| RN-TES-023 | La caja de pagos del día es única por fecha; si no existe o está cerrada y la apertura automática está activa, se reabre o se crea con tope y medios del parámetro; sin apertura automática el pago se rechaza. | `GetCajaPagoDelDia`, `ValidarAperturadeCajaAutomatica` (RN-08 §15.1) | **Mejorar**: una caja por fecha **y** responsable/sucursal | PRM-TES-040…045 | Sí: valores de LAG |
| RN-TES-024 | Saldo de caja de pagos = tope − pagos en efectivo del día. | `GetSaldo_CajaPagos` (RN-08 §2.3) | **Replicar** | PRM-TES-041 | — |
| RN-TES-025 | Efectivo disponible para pagos desde una caja de cobranza = efectivo cobrado − neto de movimientos de esa caja y fecha. | `GetCajaCobranza_CajaPagos` (RN-08 §15.1) | **A validar** (PA-TES-12) | PRM-TES-046 | — |
| RN-TES-026 | Un pago en efectivo con importe ≤ máximo (o sin máximo) queda como salida pendiente cuando el pago desde caja está activo. | P144 = 1 y P2025 (RN-08 §4.2) | **Replicar** | PRM-TES-046, PRM-TES-047 | — |
| RN-TES-027 | Un cheque de terceros solo se entrega a un proveedor si está En cartera y habilitado para pagos. | `ID_ESTA = 2 AND PERPAGPRO` (RN-08 §2.4) | **Replicar** | — | — |
| RN-TES-028 | No se admiten dos cheques con la misma entidad + sucursal + cuenta + número salvo que el anterior esté anulado. | Solo bloquea si está en cartera (RN-08 §15.1, posible defecto) | **Mejorar** (CTR-TES-11) | — | Sí |
| RN-TES-029 | Si el librador está bloqueado no se reciben sus cheques; si tiene rechazados sin recuperar se advierte. | `CTASUCE.RECIBIR`, `ValidarChequesRechazados` (RN-08 §15.1) | **Replicar** | — | — |
| RN-TES-030 | Un cheque vencido (fecha de pago + N días < hoy) no se recibe o se advierte; N por defecto 30. | P2536 (RN-09, sin lectura directa) | **Replicar** con política configurable | PRM-TES-026 | Sí |
| RN-TES-031 | Transiciones de valores de terceros según §8; cada cambio registra historial. | `RegistrarCambioDeEstado`, `CambiarEstadoCheque` solo para egresos (RN-08 §2.4, §15.1) | **Replicar** | — | — |
| RN-TES-032 | Rechazo de cheque depositado: movimiento en cuenta de rechazados (tipo 60) y reverso en el banco del depósito (tipo 59); rechazo de cheque entregado: tipo 72 con fecha de hoy; recupero: tipo 61. | `Registrar_Movimiento` (RN-08 §15.1) | **Replicar** con cuenta de movimientos configurable | PRM-TES-020 | Sí: P2067 configurada |
| RN-TES-033 | Rechazo de valor entregado a proveedor: comprobante al proveedor por el importe con concepto exento obligatorio y gasto opcional. | `RechazoDeValoresEntregados` (RN-08 §2.4) | **Replicar**: TES solicita a M12 el comprobante | PRM-TES-021, PRM-TES-022, PRM-TES-023 | — |
| RN-TES-034 | Habilitar un valor para pago registra fecha y usuario. | `FECPERPAG`, `USUPERPAG` (RN-08 §15.1) | **Replicar** | — | — |
| RN-TES-035 | Un valor solo se modifica en sus datos identificatorios mientras está En cartera. | `ModificarValor` sin restricción explícita (RN-08 §15.1) | **Mejorar** | — | — |
| RN-TES-036 | Un cheque propio se usa solo en estado Disponible; en eCheq se toma el primer registro libre y se valida que el número no se haya usado en la cuenta y chequera. | `SetEgreso`, `ValidarChequeParaPago` (RN-08 §2.5) | **Replicar** | — | — |
| RN-TES-037 | Anular un cheque propio solo desde Disponible; desmarcar solo de Anulado a Disponible; rechazar pasa a Rechazado salvo que ya lo esté. | `AnularCheque`, `DesmarcarCheque`, `SetRechazado` (RN-08 §15.1) | **Replicar** | — | — |
| RN-TES-038 | Modificar un cheque emitido cambia fecha y observación y replica la fecha en su movimiento bancario. | `ActualizarCheque` (RN-08 §15.1) | **Replicar** con evento contable | — | — |
| RN-TES-039 | Al crear una chequera física se genera un cheque por número; en eCheq la cantidad con número 0; eliminar completa la borra, la parcial anula disponibles. | `GuardarChequeras` (RN-08 §15.1) | **Mejorar**: nunca se borra una chequera con historia; solo se anula | — | — |
| RN-TES-040 | Impresión de cheques: beneficiario = nombre de pago de la OP, si no "a la orden" del proveedor, si no razón social; importe en letras; rango obligatorio, desde ≤ hasta, correlativo y coincidente con los usados en pagos; reporte de la chequera o del tenant, variante para un solo cheque. | `GetChequesAImprimir`, `ValidarChequesImprimir`, P370 (RN-08 §15.1) | **Replicar** | PRM-TES-003 | Sí: formato del banco |
| RN-TES-041 | Los cheques propios emitidos se imputan a "pendiente de débito" de la cuenta si está configurada; si no, a la cuenta del banco. | `GetCuentaBanco` (RN-08 §2.5, §15.2) | **Replicar** (resuelve M15) | — | — |
| RN-TES-042 | Cupones: ciclo cobrado → en tesorería → presentado → cobrado/liquidado; "pendiente de presentación" = no presentado con fecha de tesorería; "pendiente de pago" = presentado no pagado. | `PresentarCupones`, `CobrarCupones`, `GetCuponesTarjeta` (RN-08 §2.6, §15.1) | **Replicar** | — | — |
| RN-TES-043 | Al liquidar cupones se registra el neto en banco y se genera comprobante de gastos al procesador con comisiones, IVA diferencial, exento, impuestos y retenciones con certificado. | `CobrarCupones` (RN-08 §2.6) | **Replicar**: comprobante en M12, retenciones en TES | PRM-TES-004…007 | — |
| RN-TES-044 | Anular una presentación de cupones solo con cupones no pagados y si la suma coincide con el movimiento de presentación; igual criterio para retenciones. | `AnularPresentarCupones`, `AnularPresentarRetenciones` (RN-08 §15.1) | **Replicar** | — | — |
| RN-TES-045 | El rechazo de un cupón genera anticipo o deuda al socio (con vendedor y tipo de cuota por defecto, concepto del rechazo, opción de comprobante formal). | `CrearAnticipoRechazoCupones`, `Crear_Anticipo` (RN-08 §2.6, §15.1) | **Mejorar**: TES emite evento; M07/M05 generan el documento (PA-TES-13) | PRM-TES-008, PRM-TES-009 | — |
| RN-TES-046 | Retenciones sufridas pendientes = no presentadas y sin fecha de salida; presentar genera un único movimiento por la suma y marca con control de concurrencia; si alguna ya fue presentada, se revierte todo. | `PresentarRetenciones` (RN-08 §2.7, §15.1) | **Replicar** con transacción y versión optimista | — | — |
| RN-TES-047 | Presentar retenciones no equivale a que M06 las haya computado en una DDJJ presentada; el estado de cómputo lo informa M06. | ProCoop "presentado" = salida de cartera (RN-08 §2.7) | **Mejorar** (BASE §52 "no marcar Presentado por exportar") | — | — |
| RN-TES-048 | La rendición de una caja se crea una sola vez y su aceptación produce una sola operación. | `CerrarCaja` bajo un `COD_INT` (RN-08 §2.2) | **Replicar** con idempotencia (AGR-016) | — | — |
| RN-TES-049 | La diferencia de efectivo de la rendición se registra como quebranto de ingreso (sobrante) o egreso (faltante), nunca ajustando cobros. | Tipos 50/51 (RN-08 §2.2) | **Replicar** con aprobación | PRM-TES-062 | — |
| RN-TES-050 | Ejecución de pago: la suma de medios = neto a pagar; cada medio genera su movimiento (efectivo/valores en tesorería, transferencia/cheque/VEP en banco). | `ProcesarMediosDePago` (RN-08 §4.2) | **Replicar** | PRM-TES-034…039 | — |
| RN-TES-051 | Una transferencia con CBU queda marcada para archivo bancario. | `GEN_ARCHIVO` (RN-08 §4.2) | **Replicar** | — | — |
| RN-TES-052 | Firmar requiere permiso, pago no anulado y no firmado; entregar requiere permiso y pago firmado. | `FirmarOP`, `EntregarOP` (RN-08 §4.3) | **Replicar** y extender a N firmas | PRM-TES-048 | — |
| RN-TES-053 | En firma/entrega masiva se informan los rechazados con causa. | Hasta 20 rechazados (RN-08 §15.3) | **Mejorar**: todos los rechazados | — | — |
| RN-TES-054 | No se anula un pago cuyo efectivo salió de una caja sin anular primero esa salida; la anulación revierte medios, cheques y valores, y notifica a M12. | `Anular` OP (RN-08 §4.4) | **Replicar** repartiendo responsabilidades M12/TES | — | — |
| RN-TES-055 | Un pago a proveedor está pendiente de salida cuando su importe menos lo movido en tesorería y bancos es distinto de cero. | `PagosPendientes` (RN-08 §15.3) | **Replicar** | — | — |
| RN-TES-056 | Un pago es diferido cuando la fecha del movimiento difiere de la fecha de pago; se clasifica en T (tesorería) y P (pago). | `PagosDiferidos` (RN-08 §15.3) | **Replicar** | — | — |
| RN-TES-057 | El pago neto al tercero y el ingreso de la retención al organismo son movimientos distintos; emitir una instrucción no es pagar. | BASE §52 | **Informado** | — | — |
| RN-TES-058 | Un archivo generado no es un pago ejecutado: el estado "Ejecutado" requiere débito conciliado o respuesta aceptada del banco. | BASE §52 (control) | **Informado** | — | — |
| RN-TES-059 | El CBU de origen de un archivo es el de la cuenta seleccionada en el lote. | P2573 (proveedores) y P2262 (sueldos y transferencias de tesorería) (RN-13 §16.4) | **Reemplazar** (CTR-TES-03) | PRM-TES-050 (solo migración) | — |
| RN-TES-060 | Movimientos de Interbanking: se deduplican por cuenta + importe + correlativo + fechas; se traducen códigos de operación a categorías. | `getMovimientosCuentaInterbanking`, `getCodConCom` (RN-13 §16.2) | **Replicar** | — | — |
| RN-TES-061 | Un grupo de conciliación debe cuadrar (Σ extracto = Σ libro) o la diferencia debe explicarse con un movimiento del mismo acto. | N:M sin validar importes (RN-08 §15.1, defecto) | **Mejorar** (CTR-TES-12) | — | — |
| RN-TES-062 | Desconciliar deshace el grupo completo. | `EliminarConciliacion` borra solo filas del movimiento elegido (RN-08 §15.1) | **Mejorar** | — | — |
| RN-TES-063 | La conciliación tiene cabecera con saldo de extracto y fecha de corte; marcar movimientos sin saldo de extracto no es conciliar. | Marca `CONCILIAC` por movimiento (RN-08 §2.9) | **Reemplazar** (CTR-TES-06) | — | — |
| RN-TES-064 | Un crédito bancario no identificado no se imputa a un socio por inferencia; va a pendientes de identificación. | — | **Informado** (AGR-012, ESC-01) | — | — |
| RN-TES-065 | La acreditación neta de una pasarela se concilia contra el neto esperado de M07; la comisión ya fue registrada por M07 como gasto separado del cobro del socio. | BASE §13 CU-13 | **Informado** | — | — |
| RN-TES-066 | Saldo operativo por fecha valor, contable por fecha de emisión; a futuro, lo vencido se agrupa en hoy. | `GetSaldosBancos`, `GetSaldosaFuturo` (RN-08 §15.1) | **Replicar** | — | — |
| RN-TES-067 | La moneda extranjera se valúa con la última cotización ≤ fecha; las cuentas de tipo caja de tesorería se informan como "Tesorería". | `GetDisponibilidades` (RN-08 §15.1) | **Replicar** | — | — |
| RN-TES-068 | Proyección de pagos: previsiones fijas expandidas por periodicidad (1 mensual, 2 bimestral, 3 trimestral, 4 semanal, 5 quincenal), facturas con saldo por vencimiento y cheques propios emitidos no debitados por su importe. | `GetPrevisionesCompras`, `AgregarPrev`, `ValidarFechas` (RN-08 §15.3) | **Replicar** y ampliar orígenes | — | — |
| RN-TES-069 | Proyección de tesorería: compras pendientes con saldo a la fecha, cheques propios a pagar con fecha futura y valores en cartera no depositados. | `GetPrevisiones_*` (RN-08 §15.1) | **Replicar** | — | — |
| RN-TES-070 | Los pagos a proveedores que son empleados se ocultan en la proyección a quien no tiene permiso de sueldos. | P2653 + `frm_Su_Sueldo` (RN-08 §15.3, §15.7) | **Replicar** con agregación | PRM-TES-065 | Sí |
| RN-TES-071 | Un compromiso se crea por decisión aprobada, se consume al devengar/pagar y se libera al cancelar sin generar ingreso. | — | **Adoptado** (AGR-028) | — | — |
| RN-TES-072 | El lote de haberes se ejecuta sin simular facturas al empleado-proveedor. | `GenerarPago` crea factura de compra al empleado y OP (RN-08 §11.5) | **Reemplazar** (A validar PA-TES-07) | — | — |
| RN-TES-073 | Varias cuentas por empleado: el neto se reparte por porcentaje; Banco Nación puede usar la cuenta asignada al empleado. | P3129, P2468 (RN-08 §12.5) | **Replicar** (datos de cuentas en M16) | PRM-TES-070…078 | — |
| RN-TES-074 | Anular un pago de haberes revierte tesorería. | `AnularPago` no revierte tesorería (RN-08 §15.6, defecto) | **Mejorar** | — | — |
| RN-TES-075 | Las credenciales de integraciones (Interbanking, bancos, eCheq) se guardan en la bóveda por tenant; nunca en tablas, parámetros ni logs. | Tabla `INTERBANKING` con `CLIENT_SECRET`, `ACCESS_TOKEN`, `PASS_SISTEMA` en claro (RN-13 §17; CAT) | **Reemplazar** (DEC-001) | — | — |
| RN-TES-076 | Las consultas con datos variables usan parámetros (sin SQL/consultas armadas por concatenación). | `ReemplazarCuit_cta` concatena SQL (RN-08 §15.1) | **Reemplazar** | — | — |
| RN-TES-077 | La cuenta bancaria del proveedor se identifica por CUIT y CBU validado; el reemplazo de CUIT se hace por operación auditada de M12. | `GetCta_bancaria`, `ReemplazarCuit_cta` (RN-08 §15.1) | **Mejorar** (dueño de datos del proveedor: M12) | — | — |
| RN-TES-078 | La planilla diaria agrupa por tipo con neto y saldo anterior; el comprobante de operación vacía los ingresos en depósitos (tipos 1 y 2). | `GetPlanillaDiaria`, `GetDatosReporte` (RN-08 §15.1) | **Replicar** | — | — |
| RN-TES-079 | Recargos por cuotas por tarjeta: tipo (porcentaje o importe) y valor por cantidad de cuotas. | `TARJETAS_RECARGO`, `Presave` (RN-08 §15.1); INV `TipoRecargo` | **Replicar** | — | — |
| RN-TES-080 | La conciliación por Interbanking registra fecha de conciliación propia; los cheques no debitados se calculan sin vínculo con Interbanking cuando está activo. | `FEC_CONC_INT`, `GetChequesNoDebitados` (RN-08 §15.1) | **Mejorar**: una sola conciliación por cuenta, cualquiera sea el origen de la línea | — | — |
| RN-TES-081 | Las fechas en días no hábiles se validan contra el calendario del tenant según política. | P2456 (3 opciones), P2604 (RN-09) | **Replicar** | PRM-TES-025, PRM-TES-027 | Sí |
| RN-TES-082 | Las líneas de extracto importadas son inmutables; una corrección del banco llega como nueva línea. | — | **Adoptado** (AGR-010) | — | — |
| RN-TES-083 | Una rendición observada no puede aceptarse parcialmente sin registrar la diferencia; el cajero que la entregó no puede aceptarla. | — | **Adoptado** (segregación) | — | — |
| RN-TES-084 | Los gastos financieros se clasifican; el impuesto sobre débitos y créditos bancarios y otros cargos no tienen alícuota fija en código. | TipoCuenta 2118/2119 | **Adoptado** | — | — |
| RN-TES-085 | Ningún efecto financiero se aplica dos veces por reintentos de eventos, archivos o API. | Sin idempotencia (IDs `MAX + 1`) | **Reemplazar** (AGR-016) | — | — |
| RN-TES-086 | Una rendición de caja con cobros de varias entidades jurídicas se acepta con una operación de tesorería por entidad, cada una sobre una cuenta de esa entidad; nunca se mezclan fondos de entidades distintas en una misma operación ni en una misma cuenta. La diferencia de arqueo se imputa a la entidad que indique el receptor (por defecto, la de mayor importe rendido). | Rendición única por caja sin entidad (`CAJAS`). | **Adoptar** (DEC-064, DEC-087) | — | — |

## 7. Modelo de datos

Convenciones comunes (guía §5), no repetidas en cada colección: todo documento lleva `tenantId` (ObjectId, obligatorio, primer campo de todo índice compuesto), `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `version`; los económicos además `recordedAt` y nunca se borran (`status: voided` + vínculo de reversión). Importes en `Decimal128` (aritmética `decimal.js`), a 2 decimales salvo cotizaciones (6 decimales). Fechas en UTC; las fechas "de negocio" (`issueDate`, `valueDate`, `paymentDate`) se guardan como fecha civil en la zona del tenant (`YYYY-MM-DD`). Las etiquetas visibles se resuelven por `dict:`.

> **Corrección 05-11-2026 (tablas de campos):** las colecciones que este §7 describía solo en texto corrido o en tablas resumen tienen ahora su tabla de campos (Campo, Tipo, Oblig., Descripción, Referencia), debajo de su descripción original, que se conserva. Tipos y obligatoriedad se deducen del texto del anexo y de T05 §7.7; donde no se pueden deducir figura `[VERIFICAR]`. La columna Referencia declara la colección destino y su anexo dueño. Cuando T05 usa otro nombre para el campo, la tabla usa el de T05 y anota "Antes `x`". Las tablas de campos que ya existían incorporan también la columna Referencia. En los índices y en el texto corrido de este §7, `accountId` referido a una cuenta de tesorería se lee `treasuryAccountId` (nombre de T05 §7.2; `accountId` es en T05 la cuenta de servicios de M01).

### 7.1 `financialInstitutions` (catálogo; dueño TES, ámbito plataforma + tenant)

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `scope` | enum `platform`/`tenant` | Sí | `platform` usa `tenantId = PLATFORM`. | — |
| `bcraCode` | string(5) | Sí | Código de entidad BCRA (3 dígitos en CBU). | — |
| `name`, `shortName` | string | Sí | Nombre y abreviatura. | — |
| `cuit` | string(11) | No | CUIT de la entidad. | — |
| `interbankingBankNumber` | string | No | Número de banco en Interbanking. | — |
| `supportsEcheq` | bool | No | Informativo. | — |
| `active` | bool | Sí | — | — |

Índices: `{tenantId, bcraCode}` único. Origen: `ENTFIN` (`COD_BAN`, `NOM_BAN`).

### 7.2 `bankBranches`

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `institutionId` | ObjectId → `financialInstitutions` | Sí | — | `financialInstitutions` (M14) |
| `branchCode` | string | Sí | Código de sucursal. | — |
| `name` | string | Sí | — | — |
| `locality`, `province`, `address` | string | No | Referencia geográfica (catálogo T04 cuando exista). | — |
| `notes` | string | No | — | — |

Índices: `{tenantId, institutionId, branchCode}` único. Origen: `SUCENT` (`COD_SUC`, `COD_BAN`, `NOM_SUC`, `DES_LOC`, `DES_PRV`, `DIRECCION`, `OBSERVA`).

### 7.3 `treasuryAccounts`

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | Sí | Código visible (ej. `BAN-DEMO-01`). | — |
| `name` | string | Sí | — | — |
| `kind` | enum `bankChecking`, `bankSavings`, `virtualWallet`, `treasuryCash`, `paymentCash`, `movementAccount`, `transitAccount`, `cardClearing`, `gatewayClearing`, `investment` | Sí | Tipo de cuenta financiera. | — |
| `currency` | string ISO 4217 | Sí | Default `ARS`. | — |
| `institutionId`, `bankBranchId` | ObjectId | Cond. | Obligatorios en cuentas bancarias; `bankBranchId` → `bankBranches` (§7.2), antes `branchId`, renombrado para no confundir con `branches` de T04. | `financialInstitutions` (M14) / `bankBranches` (M14) |
| `accountNumber` | string | Cond. | — | — |
| `cbu` | string(22) | Cond. | Validado (dígitos verificadores). Único por tenant entre activas. | — |
| `alias` | string | No | — | — |
| `holderCuit` | string(11) | Cond. | — | — |
| `openingDate`, `openingBalance` | date, Decimal128 | Sí | Generan el movimiento de apertura. | — |
| `accountingRef` | `{ accountKey, pendingDebitAccountKey }` | No | Claves de regla contable para M15 (`COD_CTA`, `CTA_PENDEB`). | — (claves de rol contable embebidas; la cuenta la resuelve M15 en `entityAccountAssignments`; no es referencia) |
| `branchId` | ObjectId → `branches` (T04, sucursal del tenant) | No | Antes `branchOfficeId` (nombre canónico de T05 §7.2). | `branches` (T04) |
| `legalEntityId` | ObjectId → `legalEntities` (T04) | Sí | Entidad jurídica titular de la cuenta (DEC-064). Una cuenta pertenece a una sola entidad; los movimientos heredan su entidad. | `legalEntities` (T04) |
| `defaultDimensions` | `{ serviceId, costCenterId }` | No | — | — |
| `enabledInstruments` | array enum (`physicalCheck`, `echeq`, `transfer`, `vep`, `directDebit`, `cashDeposit`, `valuesDeposit`, `paymentFile`) | Sí | RF-TES-009. | — |
| `checkPrintTemplateKey` | string | No | `INF_CHEQUE`. | — |
| `includeInAvailability` | bool | Sí | `INF_DISPO`. | — |
| `bankAsSupplierId` | ObjectId → `suppliers` (M12) | No | `COD_PROV`. | `suppliers` (M12) |
| `interbanking` | `{ connectionId, ibAccountId, linkedAt, linkedBy }` | No | `CTA_INTERBANKING`. | — |
| `movementAccountRole` | enum `rejectedChecks`, `instrumentExchange` | Cond. | Para `movementAccount` (P2067, P2076). | — |
| `treasuryCashConfig` | `{ responsibleUserId, acceptedCurrencies[] }` | Cond. | Para `treasuryCash`. | — |
| `minBalanceAlert` | Decimal128 | No | RF-TES-153. | — |
| `balance` | `{ operational, book, asOf, verifiedAt }` | Sí | Materializado, derivado; nunca editable (RN-TES-002). | — |
| `status` | enum `active`, `blocked`, `closed` | Sí | — | — |

Índices: `{tenantId, code}` único; `{tenantId, cbu}` único parcial (`status != closed`); `{tenantId, kind, status}`. Origen: `BANKOS` (`COD_BAN`, `COD_CTA`, `NOM_BAN`, `SAL_INI`, `FECHA`, `CHEQUE`, `IMP_SYS`, `ULT_NUM`, `DIFERIDO`, `SALDO`, `FEC_ULTMOV`, `REPORTE`, `COD_PROV`, `CTA_PENDEB`, `CTA_INTERBANKING`, `INF_CHEQUE`, `INF_DISPO`, `BIC`, `CAJA` y restantes).

### 7.4 `treasuryAccountSigners`

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `treasuryAccountId` | ObjectId | Sí | Antes `accountId` (nombre de T05). | `treasuryAccounts` (M14) |
| `userId` | ObjectId (T02) | Sí | — | `memberships` (T02) |
| `employeeId` | ObjectId (M16) | No | `COD_EMP`. | `employees` (M16) |
| `personId` | ObjectId | Sí | Persona firmante; clave de unicidad `{treasuryAccountId, personId, validFrom}` de T05 (PA-TES-19). | `persons` (M01) |
| `legalEntityId` | ObjectId | Sí | Entidad jurídica de la cuenta (copia de `treasuryAccounts.legalEntityId`, DEC-064; PA-TES-19). | `legalEntities` (T04) |
| `validFrom`, `validTo` | date | Sí/No | Vigencia. | — |
| `maxAmountPerSignature` | Decimal128 | No | Tope. | — |
| `signatureGroup` | enum `A`, `B` | No | Para reglas "una A + una B". | — |
| `status` | enum `active`, `revoked` | Sí | — | — |

Reglas de firmas: se definen en `treasurySettings.signatureRules[]` = `{ accountId?, fromAmount, toAmount, requiredSignatures, requiredGroups[] }`. Origen: `PPAGOS_FIRMANTES` (`COD_FRMTES`, `COD_EMP`, `COD_MOD`, `FECHA_DESDE`, `FECHA_HASTA`).

### 7.5 `treasuryCategories`

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | Sí | `CAT_COMP`. | — |
| `name`, `shortName` | string | Sí | `DES_CAT`, `DES_CATR`. | — |
| `documentTypeKey` | string | No | `COMP`. | — |
| `accountingRuleKey` | string | Sí | Clave de regla para M15 (`CTA_CONTA`). | — |
| `allowedMovementTypes` | array enum (catálogo §7.10) | Sí | `CATB_MOVS`. | — |
| `financialChargeClass` | enum `commission`, `maintenance`, `bankDebitCreditTax`, `vatOnCharges`, `perception`, `interestExpense`, `interestIncome`, `otherCharge` | No | RF-TES-025. | — |
| `system` | bool | Sí | No editable si `true`. | — |
| `active` | bool | Sí | — | — |

Índices: `{tenantId, code}` único. Origen: `CAT_BANC`, `CATB_MOVS` (`COD_CATMOV`, `COD_CATC`, `COD_MOV`).

### 7.6 `treasuryConcepts`

Campos: `code`, `name`, `shortName`, `direction` (`in`/`out`, `ING_EGR`), `system` (bool), `defaultText` (`CON_DEFA`), `defaultNotes` (`OBS_DEFA`), `operational` (bool, `OPERATIVO`), `closingType` (enum, `TIP_CIERRE`), `active`. Índice `{tenantId, code}` único. Origen: `CONTES` (`COD_MOV`, `DES_MOV`, `DES_MOVR`, `ING_EGR`, `SISTEMA`, `USUARIO`, `FEC_REG`, `HOR_REG`, `CON_DEFA`, `OBS_DEFA`, `OPERATIVO`, `TIP_CIERRE`).

Campos de `treasuryConcepts`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | String | Sí | — | — |
| `name` | String | Sí | — | — |
| `shortName` | String | [VERIFICAR] | — | — |
| `direction` | Enum | [VERIFICAR] | `in`/`out`, `ING_EGR`. | — |
| `system` | Bool | [VERIFICAR] | — | — |
| `defaultText` | String | [VERIFICAR] | `CON_DEFA`. | — |
| `defaultNotes` | String | [VERIFICAR] | `OBS_DEFA`. | — |
| `operational` | Bool | [VERIFICAR] | `OPERATIVO`. | — |
| `closingType` | Enum | [VERIFICAR] | `TIP_CIERRE`. | — |
| `active` | Bool | [VERIFICAR] | — | — |

### 7.7 `instrumentTypes`

Campos: `code`, `name`, `instrumentClass` (enum `cash`, `thirdPartyCheck`, `thirdPartyEcheq`, `ownCheck`, `ownEcheq`, `transfer`, `card`, `withholding`, `directDebit`, `vep`, `other`), `accountingRuleKey` (`CTA_CONTA`), `manualDataEntry` (bool, `DATO_MANUAL`), `allowsChange` (bool, `VUELTO`), `enabledInCollection` (bool), `active`. Índice `{tenantId, code}` único. Origen: `TIP_VAL` (`COD_TIP`, `DES_TIP`, `CTA_CONTA`, `DATO_MANUAL`, `VUELTO`).

Campos de `instrumentTypes`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | String | Sí | — | — |
| `name` | String | Sí | — | — |
| `instrumentClass` | Enum | [VERIFICAR] | `cash`, `thirdPartyCheck`, `thirdPartyEcheq`, `ownCheck`, `ownEcheq`, `transfer`, `card`, `withholding`, `directDebit`, `vep`, `other`. | — |
| `accountingRuleKey` | Int | [VERIFICAR] | `CTA_CONTA`. | — |
| `manualDataEntry` | Bool | [VERIFICAR] | `DATO_MANUAL`. | — |
| `allowsChange` | Bool | [VERIFICAR] | `VUELTO`. | — |
| `enabledInCollection` | Bool | [VERIFICAR] | — | — |
| `active` | Bool | [VERIFICAR] | — | — |

### 7.8 `checkDrawerAccounts`

Campos: `institutionId`, `bankBranchId`, `accountNumber`, `holderName` (`NOM_CTA`), `holderCuit` (`CUIT_CTA`), `blocked` (bool; `RECIBIR`), `blockedReason`, `blockedAt`, `blockedBy`. Índice `{tenantId, institutionId, bankBranchId, accountNumber}` único (antes `branchId`, CTR-DAT-80). Origen: `CTASUCE` (`ID_CTA`, `COD_BAN`, `COD_SUC`, `CTA_BAN`, `NOM_CTA`, `RECIBIR`, `CUIT_CTA`).

Campos de `checkDrawerAccounts`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `institutionId` | ObjectId | Sí | — | `financialInstitutions` (M14) |
| `bankBranchId` | ObjectId | Sí | — | `bankBranches` (M14) |
| `accountNumber` | String | Sí | — | — |
| `holderName` | String | [VERIFICAR] | `NOM_CTA`. | — |
| `holderCuit` | String | [VERIFICAR] | `CUIT_CTA`. | — |
| `blocked` | Bool | [VERIFICAR] | `RECIBIR`. | — |
| `blockedReason` | String | [VERIFICAR] | — | — |
| `blockedAt` | Date (fecha y hora) | Cond. | — | — |
| `blockedBy` | ObjectId | Cond. | — | `memberships` (T02) |

### 7.9 `treasuryOperations`

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `number` | string | Sí | Talonario "Operación de tesorería" (`COD_INT`/`NUM_MOVT`). | — |
| `operationType` | enum §7.10 | Sí | — | — |
| `issueDate` | date | Sí | — | — |
| `branchId` | ObjectId | Sí | — | `branches` (T04) |
| `legalEntityId` | ObjectId | Sí | Entidad jurídica de la operación, la de sus cuentas (DEC-064; clave de T05; PA-TES-19). | `legalEntities` (T04) |
| `conceptId` | ObjectId | No | — | `billableConcepts` (M02) |
| `description`, `notes` | string | No | Longitud máx. 120 / 500 (validada). | — |
| `origin` | `{ module, docType, docId, docNumber }` | Sí | RF-TES-017 (`cob`, `cmp`, `fis`, `sue`, `tes`). | — |
| `totals` | `{ in, out, difference }` Decimal128 | Sí | `difference` = 0 salvo tipos unilaterales. | — |
| `approval` | `{ required, workflowId, status }` | No | T11. | — |
| `printed` | `{ at, by, count }` | No | `IMPRESO`. | — |
| `status` | enum `draft`, `pendingApproval`, `posted`, `voided` | Sí | §8. | — |
| `reversal` | `{ reversedById, reversesId, reason }` | No | — | — |
| `idempotencyKey` | string | No | AGR-016. | — |

Índices: `{tenantId, number}` único; `{tenantId, origin.module, origin.docId}`; `{tenantId, issueDate}`; `{tenantId, idempotencyKey}` único parcial.

### 7.10 Catálogo cerrado de tipos de operación y movimiento (`movementType`)

| Código CoopApps | Tipo ProCoop | Descripción |
|---|---|---|
| `opening` | — | Saldo de apertura. |
| `cashDeposit` | 1 | Depósito de efectivo. |
| `valuesDeposit` | 2 | Depósito de valores. |
| `remittanceCash` | 3 | Rendición/cierre caja: efectivo. |
| `remittanceChecks` | 4 | Rendición: valores. |
| `cashTransferOut`, `cashTransferIn` | 5–8 | Transferencias desde caja. |
| `remittanceTransfers` | 9 | Rendición: transferencias recibidas. |
| `remittanceCards` | 6 (cierre) | Rendición: cupones. |
| `remittanceWithholdings` | 7 (cierre) | Rendición: retenciones. |
| `shortageIn`, `shortageOut` | 50, 51 | Quebranto de caja (sobrante/faltante). |
| `exceptionalIn`, `exceptionalOut` | 55, 56 | Ingreso/egreso excepcional. |
| `exchangeIn`, `exchangeOut` | 57, 58 | Cambio de valores. |
| `checkRejectionBankReversal` | 59 | Reverso en banco por cheque depositado rechazado. |
| `checkRejectedIn` | 60 | Ingreso de cheque rechazado a cuenta de rechazados. |
| `checkRecovery` | 61 | Recupero de valor. |
| `cardPresentation` | 62 | Presentación de cupones. |
| `cardSettlement` | 63 | Cobro/liquidación de cupones. |
| `withholdingPresentation` | 64 | Presentación de retenciones. |
| `withholdingOut` | — | Salida de retenciones (otro destino). |
| `supplierPayThirdPartyValues` | 65 | Pago a proveedor con valores de terceros. |
| `supplierPayCash` | 66 | Pago a proveedor en efectivo. |
| `supplierPayTransfer` | 67 | Pago a proveedor con transferencia. |
| `supplierPayOwnCheck`, `supplierPayEcheq` | 68 | Pago con cheque propio / eCheq. |
| `interAccountTransfer` | 70 | Transferencia entre cuentas propias. |
| `cashBoxPaymentLink` | 71 | Vínculo de OP de caja (libro de bancos). |
| `deliveredCheckRejected` | 72 | Rechazo de valor entregado. |
| `vepPayment` | 73 | Pago con VEP / a organismo. |
| `withdrawal` | — | Extracción. |
| `financialCharge`, `interestIncome` | — | Gasto financiero / interés ganado. |
| `directDebit` | — | Débito automático. |
| `gatewayCredit` | — | Acreditación de pasarela/red/ente. |
| `cardRejection` | — | Rechazo de cupón. |
| `refundPayment` | — | Reintegro a socio (AGR-013). |
| `payrollPayment` | — | Pago de haberes. |
| `transitIn`, `transitOut` | — | Movimientos de tránsito. |
| `negotiation` | — | Negociación/descuento de valores. |

### 7.11 `treasuryMovements` (libro único; reemplaza `TESORE` y `RESBAN`)

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `operationId` | ObjectId | Sí | — | `operations` (T11) |
| `treasuryAccountId` | ObjectId | Sí | Antes `accountId` (nombre de T05). | `treasuryAccounts` (M14) |
| `legalEntityId` | ObjectId → `legalEntities` (T04) | Sí | Copia de la entidad de la cuenta (DEC-064); una operación entre cuentas de distintas entidades genera un movimiento por entidad con contrapartida en cuentas de tránsito. | `legalEntities` (T04) |
| `book` | enum `bank`, `treasury` | Sí | Derivado de `accountKind` (vistas "libro de bancos" y "libro de tesorería"). | — |
| `movementType` | enum §7.10 | Sí | — | — |
| `categoryId` | ObjectId | Sí | — | `serviceCategories` (M02) |
| `conceptId` | ObjectId | No | — | `billableConcepts` (M02) |
| `direction` | enum `in`, `out` | Sí | RN-TES-005. | — |
| `instrument` | enum (RN-TES-015) | Sí | — | — |
| `amount` | Decimal128 | Sí | Positivo, en moneda de la cuenta. | — |
| `currency`, `exchangeRate`, `amountArs` | string, Decimal128, Decimal128 | Sí | RN-TES-007. | — |
| `historicalAmount` | Decimal128 | No | `DEBE_HIS`/`HABER_HIS`. | — |
| `issueDate`, `valueDate`, `expectedCreditDate` | date | Sí/Sí/No | RF-TES-018. | — |
| `documentNumber` | string | No | Número de boleta, transferencia, cheque. | — |
| `counterparty` | `{ kind (member, supplier, employee, agency, bank, other), id, name, cuit, cbu }` | No | — | — |
| `refs` | `{ thirdPartyCheckIds[], ownCheckId, cardVoucherIds[], withholdingIds[], depositId, paymentExecutionId, cashRemittanceId, paymentFileId, payrollBatchId, statementLineIds[] }` | No | Vínculos. | — |
| `dimensions` | `{ serviceId, costCenterId, branchId }` | No | — | — |
| `pendingCashOut` | bool | No | `SALIDA_PEN`. | — |
| `reconciliation` | `{ status (unreconciled, suggested, reconciled), matchId, reconciledAt, reconciledBy, method }` | Sí (bank) | `CONCILIAC`, `FEC_CONC`, `USU_CONC`, `FEC_CONC_INT`. | — |
| `journalEntryId` | ObjectId (M15) | No | RF-TES-031. | `journalEntries` (M15) |
| `status` | enum `pendingApproval`, `posted`, `voided` | Sí | — | — |
| `reversal` | `{ reversesId, reversedById }` | No | — | — |
| `notes` | string | No | — | — |

Índices: `{tenantId, accountId, valueDate}`; `{tenantId, accountId, issueDate}`; `{tenantId, operationId}`; `{tenantId, accountId, reconciliation.status, valueDate}`; `{tenantId, refs.paymentExecutionId}`. Origen: `TESORE` (`ID_TESO`, `COD_BAN`, `FECHA`, `FEC_EMI`, `COD_MOV`, `NUMERO`, `CONCEPTO`, `OBSERVAC`, `ENTRADA`, `SALIDA`, `IMPRESO`, `USUARIO`, `FEC_REG`, `COD_INT`, `COD_TIPO`, `ID_PPAGOS`, `SALIDA_PEN` y restantes) y `RESBAN` (`COD_RES`, `COD_BAN`, `FECHA`, `COMP`, `CAT_COMP`, `NUMERO`, `CONCEPTO`, `OBSERVAC`, `DEBE`, `HABER`, `COD_COM`, `SUC_COM`, `NUM_COM`, `FEC_EMI`, `FEPROACRE`, `CONCILIAC`, `FEC_CONC`, `USU_CONC`, `FEC_CONC_INT`, `GEN_ARCHIVO`, `NUMDEPRECH`, `NUMDEPRECU`, `DEBE_HIS`, `HABER_HIS`, `TIP_MOV`, `ESTADO`, `NUM_MOVT` y restantes).

### 7.12 `bankDeposits`

Campos: `number` (boleta), `accountId` (destino), `sourceAccountId` (caja de tesorería), `depositDate`, `expectedCreditDate`, `cashAmount`, `checks[]` (`thirdPartyCheckId`, `amount`), `total`, `operationId`, `status` (`registered`, `partiallyCredited`, `credited`, `rejected`, `voided`), `creditedAt`, `statementLineIds[]`. Índices `{tenantId, accountId, depositDate}`, `{tenantId, status, expectedCreditDate}`. Origen: tipos 1/2 de `RESBAN`/`TESORE`, `TRAN_OP.FEC_DEP`/`NUM_DEP`.

Campos de `bankDeposits`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `number` | String | Sí | Boleta. | — |
| `treasuryAccountId` | ObjectId | Sí | Antes `accountId` (nombre de T05). Destino. | `treasuryAccounts` (M14) |
| `sourceAccountId` | ObjectId | [VERIFICAR] | Caja de tesorería. | `treasuryAccounts` (M14) |
| `depositDate` | Date | [VERIFICAR] | — | — |
| `expectedCreditDate` | Date | [VERIFICAR] | — | — |
| `cashAmount` | Decimal128 | [VERIFICAR] | — | — |
| `checks` | [Object] | [VERIFICAR] | `thirdPartyCheckId`, `amount`. | — |
| `total` | Decimal128 | [VERIFICAR] | — | — |
| `operationId` | ObjectId | [VERIFICAR] | — | `treasuryOperations` (M14) |
| `status` | Enum | Sí | `registered`, `partiallyCredited`, `credited`, `rejected`, `voided`. | — |
| `creditedAt` | Date (fecha y hora) | Cond. | — | — |
| `statementLineIds` | [ObjectId] | [VERIFICAR] | — | `bankStatementLines` (M14) |

### 7.13 `statementImportProfiles`

Campos: `name`, `institutionId`, `format` (`csv`, `xlsx`, `fixedWidth`, `interbanking`), `delimiter`, `encoding`, `headerRows`, `footerRows`, `dateFormat`, `decimalSeparator`, `columns` (`{ field, sourceColumn|start,length }[]` con `field` ∈ `date`, `valueDate`, `description`, `reference`, `amount`, `debit`, `credit`, `balance`, `operationCode`, `counterpartyCuit`, `checkNumber`, `bankSequence`), `signConvention`, `active`. Índice `{tenantId, name}` único.

Campos de `statementImportProfiles`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `name` | String | Sí | — | — |
| `institutionId` | ObjectId | Sí | — | `financialInstitutions` (M14) |
| `format` | Enum | [VERIFICAR] | `csv`, `xlsx`, `fixedWidth`, `interbanking`. | — |
| `delimiter` | String | [VERIFICAR] | — | — |
| `encoding` | String | [VERIFICAR] | — | — |
| `headerRows` | Int | [VERIFICAR] | — | — |
| `footerRows` | Int | [VERIFICAR] | — | — |
| `dateFormat` | Enum | [VERIFICAR] | — | — |
| `decimalSeparator` | String | [VERIFICAR] | — | — |
| `columns` | [Object] | [VERIFICAR] | `{ field, sourceColumn\|start,length }[]` con `field` ∈ `date`, `valueDate`, `description`, `reference`, `amount`, `debit`, `credit`, `balance`, `operationCode`, `counterpartyCuit`, `checkNumber`, `bankSequence`. | — |
| `signConvention` | Enum | [VERIFICAR] | Convención de signo de importes [VERIFICAR] valores. | — |
| `active` | Bool | [VERIFICAR] | — | — |

### 7.14 `bankStatementImports`

Campos: `accountId`, `source` (`file`, `interbanking`, `manual`), `profileId`, `fileRef` (almacenamiento privado, hash SHA-256), `periodFrom`, `periodTo`, `openingBalance`, `closingBalance`, `lineCount`, `totalDebits`, `totalCredits`, `duplicatesSkipped`, `continuity` (`ok`, `gap`, `justified` + `justification`), `syncRunId`, `status` (`previewed`, `imported`, `rejected`), `importedAt`, `importedBy`. Índice `{tenantId, accountId, periodFrom}`; `{tenantId, fileRef.hash}` único parcial.

Campos de `bankStatementImports`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `treasuryAccountId` | ObjectId | Sí | Antes `accountId` (nombre de T05). | `treasuryAccounts` (M14) |
| `source` | Enum | [VERIFICAR] | `file`, `interbanking`, `manual`. | — |
| `profileId` | ObjectId | [VERIFICAR] | — | `statementImportProfiles` (M14) |
| `storedFileId` | ObjectId | Sí | Antes `fileRef` (nombre de T05). Almacenamiento privado, hash SHA-256. | `storedFiles` (T01) |
| `periodFrom` | Date | [VERIFICAR] | — | — |
| `periodTo` | Date | [VERIFICAR] | — | — |
| `openingBalance` | Decimal128 | [VERIFICAR] | — | — |
| `closingBalance` | Decimal128 | [VERIFICAR] | — | — |
| `lineCount` | Int | [VERIFICAR] | — | — |
| `totalDebits` | Decimal128 | [VERIFICAR] | — | — |
| `totalCredits` | Decimal128 | [VERIFICAR] | — | — |
| `duplicatesSkipped` | Int | [VERIFICAR] | — | — |
| `continuity` | Enum | [VERIFICAR] | `ok`, `gap`, `justified` + `justification`. | — |
| `syncRunId` | ObjectId | [VERIFICAR] | — | `interbankingSyncRuns` (M14) |
| `status` | Enum | Sí | `previewed`, `imported`, `rejected`. | — |
| `importedAt` | Date (fecha y hora) | Cond. | — | — |
| `importedBy` | ObjectId | Cond. | — | `memberships` (T02) |

### 7.15 `bankStatementLines`

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `importId`, `treasuryAccountId` | ObjectId | Sí | Antes `accountId` (nombre de T05). | `bankStatementImports` (M14) / `treasuryAccounts` (M14) |
| `source` | enum `file`, `interbanking`, `manual` | Sí | — | — |
| `bookingDate`, `valueDate` | date | Sí | — | — |
| `description` | string | Sí | — | — |
| `reference`, `voucherNumber`, `bankSequence` | string | No | `voucher_number`, correlativo. | — |
| `direction`, `amount`, `currency` | enum, Decimal128, string | Sí | — | — |
| `runningBalance` | Decimal128 | No | — | — |
| `operationCodeBank`, `operationCodeIb`, `codeDescriptionBank`, `codeDescriptionIb`, `groupingCodeIb` | string | No | `MOV_INTERBANKING`. | — |
| `depositorCode`, `depositorDescription`, `customerCuit` | string | No | Ordenante. | — |
| `fingerprint` | string | Sí | RF-TES-034. | — |
| `suggestedCategoryId` | ObjectId | No | Por regla o código IB. | `treasuryCategories` (M14) |
| `reconciliation` | `{ status, matchId, reconciledAt, reconciledBy, method }` | Sí | — | — |
| `unidentifiedCaseId` | ObjectId (M07) | No | RF-TES-040. | `unidentifiedReceipts` (M07) (antes "M07, colección [VERIFICAR]"; PA-TES-19) |

Índices: `{tenantId, accountId, fingerprint}` único; `{tenantId, accountId, reconciliation.status, valueDate}`. Inmutable salvo `reconciliation`, `suggestedCategoryId` y `unidentifiedCaseId` (RN-TES-082). Origen: `MOV_INTERBANKING` (`COD_MOV`, `id`, `account_cbu`, `depositor_code`, `operation_code_ib`, `operation_code_bank`, `code_description_ib`, `customer_cuit`, `depositor_description`, `code_description_bank`, `amount`, `voucher_number`, `grouping_code_ib` y restantes).

### 7.16 `reconciliations`

Campos: `accountId`, `cutoffDate`, `periodFrom`, `statementClosingBalance`, `bookBalance`, `items` (calculados al cerrar: `bankCreditsNotInBook`, `bankDebitsNotInBook`, `bookInNotInBank`, `bookOutNotInBank` con lista de ids y antigüedad), `unexplainedDifference` (debe ser 0 para cerrar), `status` (`open`, `inReview`, `closed`, `reopened`), `closedAt`, `closedBy`, `approvedBy`, `reopenReason`, `reportRef`. Índice `{tenantId, accountId, cutoffDate}` único.

Campos de `reconciliations`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `treasuryAccountId` | ObjectId | Sí | Antes `accountId` (nombre de T05). | `treasuryAccounts` (M14) |
| `cutoffDate` | Date | Sí | — | — |
| `periodFrom` | Date | [VERIFICAR] | — | — |
| `statementClosingBalance` | Decimal128 | [VERIFICAR] | — | — |
| `bookBalance` | Decimal128 | [VERIFICAR] | — | — |
| `items` | Object | [VERIFICAR] | Calculados al cerrar: `bankCreditsNotInBook`, `bankDebitsNotInBook`, `bookInNotInBank`, `bookOutNotInBank` con lista de ids y antigüedad. | — |
| `unexplainedDifference` | Decimal128 | [VERIFICAR] | Debe ser 0 para cerrar. | — |
| `status` | Enum | Sí | `open`, `inReview`, `closed`, `reopened`. | — |
| `closedAt` | Date (fecha y hora) | Cond. | — | — |
| `closedBy` | ObjectId | Cond. | — | `memberships` (T02) |
| `approvedBy` | ObjectId | Cond. | — | `memberships` (T02) |
| `reopenReason` | String | [VERIFICAR] | — | — |
| `reportRef` | ObjectId | [VERIFICAR] | Reporte de conciliación cerrado (PDF versionado). | `storedFiles` (T01) (antes con `[VERIFICAR]`) |

### 7.17 `reconciliationMatches`

Campos: `accountId`, `reconciliationId`, `statementLineIds[]`, `movementIds[]`, `statementTotal`, `bookTotal`, `differenceMovementId` (si se creó en el acto), `method` (`manual`, `suggestedConfirmed`, `auto`), `ruleId`, `score`, `status` (`active`, `undone`), `undoneAt`, `undoneBy`, `undoReason`. Validación: `statementTotal = bookTotal` (RN-TES-061). Índices `{tenantId, accountId, status}`. Origen: `RESBAN_MOVINT` (`COD_REL`, `COD_RESBAN`, `COD_MOVINT`, `FEC_CONC`, `COD_CONC`).

Campos de `reconciliationMatches`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `treasuryAccountId` | ObjectId | [VERIFICAR] | Antes `accountId` (nombre de T05). | `treasuryAccounts` (M14) |
| `reconciliationId` | ObjectId | Sí | — | `reconciliations` (M14) |
| `statementLineIds` | [ObjectId] | [VERIFICAR] | — | `bankStatementLines` (M14) |
| `movementIds` | [ObjectId] | [VERIFICAR] | — | `treasuryMovements` (M14) |
| `statementTotal` | Decimal128 | [VERIFICAR] | — | — |
| `bookTotal` | Decimal128 | [VERIFICAR] | — | — |
| `differenceMovementId` | ObjectId | Cond. | Si se creó en el acto. | `treasuryMovements` (M14) |
| `method` | Enum | [VERIFICAR] | `manual`, `suggestedConfirmed`, `auto`. | — |
| `ruleId` | ObjectId | [VERIFICAR] | — | `reconciliationRules` (M14) |
| `score` | Decimal128 | [VERIFICAR] | — | — |
| `status` | Enum | Sí | `active`, `undone`. | — |
| `undoneAt` | Date (fecha y hora) | Cond. | — | — |
| `undoneBy` | ObjectId | Cond. | — | `memberships` (T02) |
| `undoReason` | String | [VERIFICAR] | — | — |

### 7.18 `reconciliationRules`

Campos: `name`, `accountIds[]` (vacío = todas), `priority`, `conditions` (`descriptionPattern`, `operationCodes[]`, `amountFrom`, `amountTo`, `counterpartyCuit`, `direction`, `dateToleranceDays`, `referenceMatch` (`exact`, `contains`, `none`)), `action` (`match`, `suggestCategory`, `createMovement`), `categoryId`, `conceptId`, `autoConfirm` (bool), `active`, `lastTestedAt`. Índice `{tenantId, priority}`.

Campos de `reconciliationRules`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `name` | String | Sí | — | — |
| `accountIds` | [ObjectId] | [VERIFICAR] | Vacío = todas. | `treasuryAccounts` (M14) |
| `priority` | Int | [VERIFICAR] | — | — |
| `conditions` | Object | [VERIFICAR] | `descriptionPattern`, `operationCodes[]`, `amountFrom`, `amountTo`, `counterpartyCuit`, `direction`, `dateToleranceDays`, `referenceMatch` (`exact`, `contains`, `none`). | — |
| `action` | Enum | [VERIFICAR] | `match`, `suggestCategory`, `createMovement`. | — |
| `categoryId` | ObjectId | [VERIFICAR] | — | `serviceCategories` (M02) |
| `conceptId` | ObjectId | [VERIFICAR] | — | `billableConcepts` (M02) |
| `autoConfirm` | Bool | [VERIFICAR] | — | — |
| `active` | Bool | [VERIFICAR] | — | — |
| `lastTestedAt` | Date (fecha y hora) | Cond. | — | — |
| `code` | String | Sí | Código de la regla; T05 lo declara único y este anexo no lo describía. | — |

### 7.19 `interbankingConnections`

Campos: `customerId` (no secreto), `vaultSecretRef` (referencia a la bóveda T06; nunca el secreto), `scope` (`info-financiera`), `environment` (`prod`, `test`), `status` (`active`, `error`, `disabled`), `lastTokenAt`, `lastError` (sin datos sensibles), `paymentApiEnabled` (bool, PA-TES-02). Origen: `INTERBANKING` (`CLIENT_ID`, `CLIENT_SECRET`, `CUSTOMER_ID`, `ACCESS_TOKEN`, `EXP_TOKEN`, `CLAVE_SISTEMA`, `USUARIO_SISTEMA`, `PASS_SISTEMA`) → **todos los secretos a la bóveda; `ACCESS_TOKEN`, `EXP_TOKEN`, `PASS_SISTEMA` no se migran**.

Campos de `interbankingConnections`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `customerId` | String | [VERIFICAR] | No secreto. Identificador de cliente de Interbanking (dato externo, no es referencia). | — (dato externo, no es referencia) |
| `credentialRef` | String | Sí | Antes `vaultSecretRef` (nombre de T05). Referencia a la bóveda T06; nunca el secreto. | Bóveda de secretos de T06 |
| `scope` | Enum | [VERIFICAR] | `info-financiera`. | — |
| `environment` | Enum | [VERIFICAR] | `prod`, `test`. | — |
| `status` | Enum | Sí | `active`, `error`, `disabled`. | — |
| `lastTokenAt` | Date (fecha y hora) | Cond. | — | — |
| `lastError` | String | [VERIFICAR] | Sin datos sensibles. | — |
| `paymentApiEnabled` | Bool | [VERIFICAR] | PA-TES-02. | — |
| `connectionId` | [VERIFICAR] | [VERIFICAR] | Declarado en T05 (claves de `interbankingConnections`); este anexo no lo describía. [VERIFICAR] si es la conexión de T06. | `integrationConnections` (T06) [VERIFICAR] |
| `legalEntityId` | ObjectId | [VERIFICAR] | Entidad jurídica titular de la conexión; declarado en T05 y no descrito en este anexo. | `legalEntities` (T04) |

### 7.20 `interbankingSyncRuns`

Campos: `connectionId`, `kind` (`accounts`, `balances`, `movements`), `accountId`, `dateSince`, `pages` (`{ page, status, fetched, inserted, duplicates }[]`), `status` (`running`, `completed`, `partial`, `failed`), `startedAt`, `finishedAt`, `error`. Índice `{tenantId, connectionId, startedAt}`.

Campos de `interbankingSyncRuns`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `connectionId` | ObjectId | Sí | — | `interbankingConnections` (M14) |
| `kind` | Enum | [VERIFICAR] | `accounts`, `balances`, `movements`. | — |
| `treasuryAccountId` | ObjectId | [VERIFICAR] | Antes `accountId` (nombre de T05). | `treasuryAccounts` (M14) |
| `dateSince` | Date | [VERIFICAR] | — | — |
| `pages` | [Object] | [VERIFICAR] | `{ page, status, fetched, inserted, duplicates }[]`. | — |
| `status` | Enum | Sí | `running`, `completed`, `partial`, `failed`. | — |
| `startedAt` | Date (fecha y hora) | Cond. | — | — |
| `finishedAt` | Date (fecha y hora) | Cond. | — | — |
| `error` | String | [VERIFICAR] | — | — |

### 7.21 `interbankingBalanceSnapshots`

Campos: `accountId`, `takenAt`, `bankBalance`, `bookBalance`, `difference`, `availableBalance` (si informado). Índice `{tenantId, accountId, takenAt}`.

Campos de `interbankingBalanceSnapshots`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `treasuryAccountId` | ObjectId | Sí | Antes `accountId` (nombre de T05). | `treasuryAccounts` (M14) |
| `at` | Date (fecha y hora) | Sí | Antes `takenAt` (nombre de T05). | — |
| `bankBalance` | Decimal128 | [VERIFICAR] | — | — |
| `bookBalance` | Decimal128 | [VERIFICAR] | — | — |
| `difference` | Decimal128 | [VERIFICAR] | — | — |
| `availableBalance` | Decimal128 | Cond. | Si informado. | — |

### 7.22 `paymentFiles`

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `purpose` | enum `supplierPayments`, `treasuryTransfers`, `payroll`, `refunds` | Sí | — | — |
| `format` | string (`interbanking`, `credicoopSheet`, `bnaPayroll`, …) | Sí | Adaptador T06. | — |
| `originTreasuryAccountId` | ObjectId | Sí | Antes `originAccountId`. RN-TES-059; nombre canónico de T05 COL-TES-21 (PA-TES-19). | `treasuryAccounts` (M14) |
| `executionDate` | date | Sí | — | — |
| `lines` | `{ lineNo, beneficiaryName, beneficiaryCuit, cbu, amount, concept, docType, docBranch, docNumber, withholdingAmount, paymentExecutionId | payrollItemId | refundId, status (pending, sent, accepted, rejected, debited), rejectionCode, rejectionText }[]` | — |
| `totals` | `{ count, amount }` | Sí | — | — |
| `storedFileId` | ObjectId | Sí | Antes `fileRef` `{ storageKey, sha256, generatedAt }`. Archivo generado; el hash y la fecha quedan en `storedFiles` (nombre de T05; PA-TES-19). | `storedFiles` (T01) |
| `transmission` | `{ channel (manualUpload, api), sentAt, sentBy, requestRef, responseRef, acknowledgedAt }` | No | `JSON_ENVIO`, `JSON_RESPUESTA`. | — |
| `status` | enum `generated`, `sent`, `partiallyAccepted`, `accepted`, `rejected`, `debited`, `voided` | Sí | §8. | — |

Índices: `{tenantId, purpose, executionDate}`; `{tenantId, status}`. Origen: `SU_AUDIT_TRA_INTERBANKING` (`COD_TRA`, `DESC_TRA`, `TOTAL`, `COD_BAN`, `ESTADO`, `JSON_ENVIO`, `JSON_RESPUESTA`, `FEC_REG`, `USUARIO`), `RESBAN.GEN_ARCHIVO`.

### 7.23 `thirdPartyChecks`

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `format` | enum `physical`, `echeq` | Sí | — | — |
| `instrumentTypeId` | ObjectId | Sí | — | `instrumentTypes` (M14) |
| `institutionId`, `bankBranchId`, `accountNumber`, `checkNumber` | — | Sí | Identidad (RN-TES-028). | `financialInstitutions` (M14) / `bankBranches` (M14) |
| `echeqId` | string | Cond. | Para eCheq. | — (identificador del eCheq en el banco, externo; no es referencia) |
| `cmc7` | string | No | Lectora. | — |
| `drawer` | `{ name, cuit, drawerAccountId }` | Sí | — | — |
| `issueDate`, `paymentDate` | date | Sí | — | — |
| `deferred` | bool | Sí | — | — |
| `amount`, `currency` | Decimal128, string | Sí | — | — |
| `endorsements` | `{ name, cuit }[]` | No | — | — |
| `echeqFlags` | `{ toOrder, crossed, custody, aval }` | No | — | — |
| `origin` | `{ module, docId, memberAccountId, customerId, supplierId, cashSessionId }` | Sí | — | — |
| `custodyAccountId` | ObjectId | Sí | Caja de tesorería, cuenta de rechazados, etc. | `treasuryAccounts` (M14) |
| `state` | enum `received`, `pendingAcceptance`, `inPortfolio`, `deliveredToSupplier`, `deposited`, `credited`, `rejected`, `recovered`, `returned`, `voided`, `manualOut`, `inCustody`, `negotiated`, `repudiated` | Sí | §8 (estados 1–10 de ProCoop + eCheq). | — |
| `availableForPayments` | `{ enabled, at, by }` | Sí | `PERPAGPRO`, `FECPERPAG`, `USUPERPAG`. | — |
| `depositId`, `deliveredPaymentExecutionId`, `rejection` (`{ date, reason, bankCode, depositAccountId, recoveredById }`) | — | No | — | `bankDeposits` (M14) / `paymentExecutions` (M14) |
| `treasuryMovementIds[]` | ObjectId | Sí | `NUM_TES`, `ID_TESO`. | `treasuryMovements` (M14) |

Índices: `{tenantId, institutionId, bankBranchId, accountNumber, checkNumber}` único parcial (`state != voided`); `{tenantId, state, paymentDate}`; `{tenantId, echeqId}` único parcial. Origen: `VALORES` (`INTERNO`, `ID_PLA`, `COD_CJ`, `SUC_CJ`, `NUM_CJ`, `FECHA`, `COD_SOC`, `COD_PER`, `COD_SUM`, `NUM_CHEQ`, `BAN_CHEQ`, `SUC_CHEQ`, `FEC_CHEQ`, `ID_ESTA`, `PERPAGPRO`, `FECPERPAG`, `USUPERPAG`, `NUM_TES` y restantes hasta 44 columnas), `VALORES1` (sentido de egreso), `VAL_ESTA`.

### 7.24 `checkEvents`

Campos: `checkKind` (`thirdParty`, `own`), `checkId`, `fromState`, `toState`, `at`, `userId`, `notes`, `accountId`, `movementId`, `externalRef` (operación eCheq del banco). Índice `{tenantId, checkKind, checkId, at}`. Origen: `VAL_MVTO` (`ID_MVTO`, `INTERNO`, `FECHA`, `HORA`, `COD_USER`, `ID_ESTA`, `OBSE`, `COD_BAN`, `ID_TESO`).

Campos de `checkEvents`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `checkKind` | Enum | [VERIFICAR] | `thirdParty`, `own`. | — |
| `checkId` | ObjectId | Sí | — | `thirdPartyChecks` u `ownChecks` (M14), según `checkKind` |
| `fromState` | Enum | [VERIFICAR] | Estado de §8.4 o §8.5 según el tipo de cheque (campo checkKind); vacío en el evento de alta del cheque. `checkEvents` registra transiciones y no tiene máquina propia (§8.16.12; PA-TES-19). | — |
| `toState` | Enum | Sí | Estado de §8.4 o §8.5 según el tipo de cheque (campo checkKind). | — |
| `at` | Date (fecha y hora) | Sí | — | — |
| `userId` | ObjectId | [VERIFICAR] | — | `memberships` (T02) |
| `notes` | String | [VERIFICAR] | — | — |
| `treasuryAccountId` | ObjectId | [VERIFICAR] | Antes `accountId` (nombre de T05). | `treasuryAccounts` (M14) |
| `movementId` | ObjectId | [VERIFICAR] | — | `treasuryMovements` (M14) |
| `externalRef` | String | [VERIFICAR] | Operación eCheq del banco. | — (identificador externo del banco; no es referencia) |

### 7.25 `checkbooks`

Campos: `accountId`, `format` (`physical`, `echeq`), `description` (`DES_CHEQ`), `fromNumber`, `quantity`, `printTemplateKey`, `status` (`active`, `exhausted`, `voided`), `createdBy`. Índice `{tenantId, accountId, format}`. Origen: `CHEQUERAS.ID_CHEQUERA`, `DES_CHEQ`.

Campos de `checkbooks`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `treasuryAccountId` | ObjectId | Sí | Antes `accountId` (nombre de T05). | `treasuryAccounts` (M14) |
| `format` | Enum | [VERIFICAR] | `physical`, `echeq`. | — |
| `description` | String | [VERIFICAR] | `DES_CHEQ`. | — |
| `fromNumber` | Int | [VERIFICAR] | — | — |
| `quantity` | Int | [VERIFICAR] | — | — |
| `printTemplateKey` | String | [VERIFICAR] | — | — |
| `status` | Enum | Sí | `active`, `exhausted`, `voided`. | — |
| `createdBy` | ObjectId | [VERIFICAR] | — | `memberships` (T02) |
| `code` | String | Sí | Código de la chequera; T05 lo declara único y este anexo no lo describía ([VERIFICAR] formato). | — |

### 7.26 `ownChecks`

Campos: `checkbookId`, `accountId`, `format`, `number` (0 hasta emitir en eCheq), `state` (`available`, `issued`, `pendingAcceptance`, `accepted`, `repudiated`, `debited`, `voided`, `rejected`, `recovered`), `stateAt` (`FESTADO`), `issueDate`, `paymentDate`, `amount`, `beneficiary` (`{ name, cuit, supplierId }`), `flags` (`bearer`, `crossed`, `notToOrder`), `paymentExecutionId` (`ID_PPAGO`), `movementId` (`COD_RES`), `printed` (`{ at, by, count }`), `echeqId`, `notes`, `generatedBy` (`USU_GEN`). Índices `{tenantId, accountId, number}` único parcial (`number > 0`); `{tenantId, state, paymentDate}`. Origen: `CHEQUERAS` (`ID_CHEQUE`, `ID_CHEQUERA`, `DES_CHEQ`, `COD_BAN`, `NUMERO`, `ESTADO`, `FESTADO`, `USU_GEN`, `FECHA`, `ID_PPAGO`, `OBSERVAC`, `COD_RES`, `CRUZADO`, al portador, no a la orden, electrónico, impreso).

Campos de `ownChecks`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `checkbookId` | ObjectId | Sí | — | `checkbooks` (M14) |
| `treasuryAccountId` | ObjectId | Sí | Antes `accountId` (nombre de T05). | `treasuryAccounts` (M14) |
| `format` | Enum | [VERIFICAR] | — | — |
| `number` | String | Sí | 0 hasta emitir en eCheq. | — |
| `state` | Enum | Sí | `available`, `issued`, `pendingAcceptance`, `accepted`, `repudiated`, `debited`, `voided`, `rejected`, `recovered`. | — |
| `stateAt` | Date (fecha y hora) | Cond. | `FESTADO`. | — |
| `issueDate` | Date | [VERIFICAR] | — | — |
| `paymentDate` | Date | [VERIFICAR] | — | — |
| `amount` | Decimal128 | [VERIFICAR] | — | — |
| `beneficiary` | Object | [VERIFICAR] | `{ name, cuit, supplierId }`. | — |
| `flags` | Object | [VERIFICAR] | `bearer`, `crossed`, `notToOrder`. Marcas booleanas `bearer`, `crossed`, `notToOrder`. | — |
| `paymentExecutionId` | ObjectId | Sí | `ID_PPAGO`. | `paymentExecutions` (M14) |
| `movementId` | ObjectId | [VERIFICAR] | `COD_RES`. | `treasuryMovements` (M14) |
| `printed` | Object | [VERIFICAR] | `{ at, by, count }`. | — |
| `echeqId` | String | [VERIFICAR] | Identificador del eCheq en el banco (externo). | — (externo; no es referencia) |
| `notes` | String | [VERIFICAR] | — | — |
| `generatedBy` | ObjectId | Cond. | `USU_GEN`. | `memberships` (T02) |

### 7.27 `cardPlans`

> **Reemplazado por `cardPlans` de M07 (COL-COB-15, CTR-DAT-08).** M07 es dueño del plan (lo usa el cobro en caja con sus recargos); M14 solo lo lee para cupones, presentaciones y liquidaciones. Los campos siguientes quedan como requisitos que M14 necesita del plan de M07.

Campos: `code` (único, `COD_TARJ`), `name`, `processorSupplierId` (`COD_PROV`), `fileCode` (`COD_ARC`), `merchantNumber` (`COMERCIO`), `cardType` (`credit`, `debit`, `prepaid`; `PER_DEB`), `requiresPresentation` (`PRESEN`), `usableInCash` (`USO_CAJA`), `cashSurchargePercent` (`POR_CAJA`), `cashSurchargeAmount` (`IMP_CAJA`), `productId` (`COD_PRO`), `settlementTreasuryAccountId` (cuenta de acreditación → `treasuryAccounts`; nombre del campo en M07 §7.15; antes `settlementAccountId`, alias), `settlementDays`, `installmentSurcharges` (`{ description, installments, surchargeType (percent, amount), value }[]`), `active`. Origen: `TARJETAS`, `TARJETAS_RECARGO` (`COD_TARJREC`, `DESCRIPCION`, `CUOTAS`, `RECARGO_TIPO`, `RECARGO_VALOR`).

### 7.28 `cardVouchers`

Campos: `cardPlanId`, `voucherNumber` (`CUP_TARJ`), `authorizationCode` (`AUT_TARJ`), `installments`, `amount`, `currency`, `collectionDate`, `origin` (`{ module, receiptId, memberAccountId, cashSessionId }`; `ID_PLA`, `COD_CJ`, `SUC_CJ`, `NUM_CJ`, `COD_SOC`, `COD_PER`, `COD_SUM`), `treasuryDate`, `state` (`collected`, `inTreasury`, `presented`, `settled`, `rejected`, `voided`), `presentationId`, `settlementId`, `rejection` (`{ date, reason, memberDocumentRef }`; `RECHAZADO`, `FEC_RECHAZO`). Índices `{tenantId, cardPlanId, voucherNumber, authorizationCode}` único; `{tenantId, state}`. **No** se guardan número de tarjeta, vencimiento ni código de seguridad (RN-13 §17). Origen: `CUPONTAR`.

Campos de `cardVouchers`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `cardPlanId` | ObjectId | Sí | — | `cardPlans` (M07) |
| `voucherNumber` | String | Sí | `CUP_TARJ`. | — |
| `authorizationCode` | String | Sí | `AUT_TARJ`. | — |
| `installments` | Int | [VERIFICAR] | — | — |
| `amount` | Decimal128 | [VERIFICAR] | — | — |
| `currency` | String | [VERIFICAR] | — | — |
| `collectionDate` | Date | [VERIFICAR] | — | — |
| `origin` | Object | [VERIFICAR] | `{ module, receiptId, memberAccountId, cashSessionId }`; `ID_PLA`, `COD_CJ`, `SUC_CJ`, `NUM_CJ`, `COD_SOC`, `COD_PER`, `COD_SUM`. | — |
| `treasuryDate` | Date | [VERIFICAR] | — | — |
| `state` | Enum | Sí | `collected`, `inTreasury`, `presented`, `settled`, `rejected`, `voided`. | — |
| `presentationId` | ObjectId | [VERIFICAR] | — | `cardPresentations` (M14) |
| `settlementId` | ObjectId | [VERIFICAR] | — | `cardSettlements` (M14) |
| `rejection` | Object | [VERIFICAR] | `{ date, reason, memberDocumentRef }`; `RECHAZADO`, `FEC_RECHAZO`. | — |

### 7.29 `cardPresentations`

Campos: `cardPlanId`, `presentedAt`, `voucherIds[]`, `total`, `movementId`, `automatic` (bool, débito), `status` (`presented`, `voided`). Origen: movimientos tipo 62.

Campos de `cardPresentations`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `cardPlanId` | ObjectId | Sí | — | `cardPlans` (M07) |
| `presentedAt` | Date (fecha y hora) | Cond. | — | — |
| `voucherIds` | [ObjectId] | [VERIFICAR] | — | `cardVouchers` (M14) |
| `total` | Decimal128 | [VERIFICAR] | — | — |
| `movementId` | ObjectId | [VERIFICAR] | — | `treasuryMovements` (M14) |
| `automatic` | Bool | [VERIFICAR] | Débito. | — |
| `status` | Enum | Sí | `presented`, `voided`. | — |
| `number` | String | Sí | Número de la presentación; T05 lo declara único y este anexo no lo describía ([VERIFICAR] formato). | — |

### 7.30 `cardSettlements`

Campos: `cardPlanId`, `settlementDate` (`FEC_PAG`), `settlementNumber`, `voucherIds[]`, `grossAmount` (`IMP_PRE`), `netAmount` (`IMP_PAG`), `commission` (`COMISIO`), `commissionVat` (`IVA`), `commissionDiffVat`, `exemptAmount`, `taxes`, `withholdings` (`{ type (vat, incomeTax, grossIncome, socialSecurity), amount, certificateNumber, receivedWithholdingId }[]`; `RET_IVA`, `RET_GAN`, `RET_IBR`), `treasuryAccountId` (antes `bankAccountId`, T05 §7.2), `expenseDocumentRef` (M12), `movementId`, `status` (`registered`, `credited`, `voided`). Validación: bruto = neto + comisiones + IVA + impuestos + retenciones. Origen: `PAGOTAR` (`ID_PAGO`, `COD_TAR`, `FEC_PAG`, `COD_COM`, `SUC_COM`, `NUM_COM`, `IMP_PRE`, `IMP_PAG`, `RET_IVA`, `RET_GAN`, `RET_IBR`, `COMISIO`, `IVA` y restantes).

Campos de `cardSettlements`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `cardPlanId` | ObjectId | Sí | — | `cardPlans` (M07) |
| `settlementDate` | Date | [VERIFICAR] | `FEC_PAG`. | — |
| `settlementNumber` | String | Sí | — | — |
| `voucherIds` | [ObjectId] | [VERIFICAR] | — | `cardVouchers` (M14) |
| `grossAmount` | Decimal128 | [VERIFICAR] | `IMP_PRE`. | — |
| `netAmount` | Decimal128 | [VERIFICAR] | `IMP_PAG`. | — |
| `commission` | Decimal128 | [VERIFICAR] | `COMISIO`. | — |
| `commissionVat` | Decimal128 | [VERIFICAR] | `IVA`. | — |
| `commissionDiffVat` | Decimal128 | [VERIFICAR] | — | — |
| `exemptAmount` | Decimal128 | [VERIFICAR] | — | — |
| `taxes` | Decimal128 | [VERIFICAR] | — | — |
| `withholdings` | [Object] | [VERIFICAR] | `{ type (vat, incomeTax, grossIncome, socialSecurity), amount, certificateNumber, receivedWithholdingId }[]`; `RET_IVA`, `RET_GAN`, `RET_IBR`. | — |
| `treasuryAccountId` | ObjectId | [VERIFICAR] | Antes `bankAccountId`, T05 §7.2. | `treasuryAccounts` (M14) |
| `expenseDocumentRef` | ObjectId | [VERIFICAR] | M12. | `supplierInvoices` (M12) [VERIFICAR] |
| `treasuryMovementId` | ObjectId | Sí | Antes `movementId` (nombre de T05). | `treasuryMovements` (M14) |
| `status` | Enum | Sí | `registered`, `credited`, `voided`. | — |

### 7.31 `receivedWithholdings`

Campos: `withholdingType` (`grossIncome` 1, `vat` 2, `incomeTax` 3, `socialSecurity` 4), `regimeId` (M06), `jurisdiction`, `agent` (`{ name, cuit, memberAccountId, supplierId }`), `certificateNumber` (`NUM_RETE`), `certificateDate` (`FEC_RETE`), `amount`, `taxBase`, `attachmentRef`, `origin` (`{ module, docId, cashSessionId, cardSettlementId }`; `ID_PLA`, `COD_CJ`, `SUC_CJ`, `NUM_CJ`, `COD_SOC`, `COD_PER`, `COD_SUM`), `state` (`received`, `inPortfolio`, `presented`, `out`, `voided`), `presentationId`, `out` (`{ date, destination, reason }`; `FEC_SALIDA`), `fiscalComputation` (`{ status, ddjjRef }` informado por M06). Índices `{tenantId, agent.cuit, withholdingType, certificateNumber}` único parcial; `{tenantId, state}`. Origen: `RETENCIO` (`ID_RETEN`, `TIP_RETE`, `NUM_RETE`, `FEC_RETE`, `IMPORTE`, `PRESENTADO`, `FEC_SALIDA` y restantes), `RETS_TIPO` (catálogo → M06).

Campos de `receivedWithholdings`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `withholdingType` | Enum | Sí | `grossIncome` 1, `vat` 2, `incomeTax` 3, `socialSecurity` 4. | — |
| `withholdingSufferedTypeId` | ObjectId | Sí | Antes `regimeId` (nombre de T05). M06. | `withholdingSufferedTypes` (M06) |
| `jurisdiction` | String | [VERIFICAR] | — | — |
| `agent` | Object | [VERIFICAR] | `{ name, cuit, memberAccountId, supplierId }`. | — |
| `certificateNumber` | String | Sí | `NUM_RETE`. | — |
| `certificateDate` | Date | [VERIFICAR] | `FEC_RETE`. | — |
| `amount` | Decimal128 | [VERIFICAR] | — | — |
| `taxBase` | Decimal128 | [VERIFICAR] | — | — |
| `attachmentRef` | ObjectId | [VERIFICAR] | — | `storedFiles` (T01) |
| `origin` | Object | Sí | `{ module, docId, cashSessionId, cardSettlementId }`; `ID_PLA`, `COD_CJ`, `SUC_CJ`, `NUM_CJ`, `COD_SOC`, `COD_PER`, `COD_SUM`. | — |
| `state` | Enum | Sí | `received`, `inPortfolio`, `presented`, `out`, `voided`. | — |
| `presentationId` | ObjectId | [VERIFICAR] | — | `withholdingPresentations` (M14) |
| `out` | Object | [VERIFICAR] | `{ date, destination, reason }`; `FEC_SALIDA`. | — |
| `fiscalComputation` | Object | [VERIFICAR] | `{ status, ddjjRef }` informado por M06. | — |

### 7.32 `withholdingPresentations`

Campos: `kind` (`presentation`, `out`), `date`, `withholdingIds[]`, `total`, `movementId`, `automatic` (bool), `status` (`posted`, `voided`). Validación de anulación: Σ retenciones = salida del movimiento.

Campos de `withholdingPresentations`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `number` | String | Sí | Número de la presentación, único por tenant (T05; PA-TES-19). | — |
| `kind` | Enum | [VERIFICAR] | `presentation`, `out`. | — |
| `date` | Date | [VERIFICAR] | — | — |
| `receivedWithholdingIds` | [ObjectId] | [VERIFICAR] | Antes `withholdingIds` (nombre de T05). | `receivedWithholdings` (M14) |
| `total` | Decimal128 | [VERIFICAR] | — | — |
| `movementId` | ObjectId | [VERIFICAR] | — | `treasuryMovements` (M14) |
| `automatic` | Bool | [VERIFICAR] | — | — |
| `status` | Enum | Sí | `posted`, `voided`. | — |

### 7.33 `paymentCashSessions`

Campos: `accountId` (caja de pagos), `date`, `branchId`, `responsibleUserId` (`USUARIO`), `openedAt` (`APERTURA`), `closedAt` (`CIERRE`), `maxCash` (`MAXEFEC`), `allowed` (`{ ownChecks (PAGACHEQ), values (PAGAVALO), cash (PAGAEFEC), transfers (PAGATRANSF) }`), `autoOpened` (bool), `cashPaidToday` (derivado), `count` (`{ counted, theoretical, difference, shortageMovementId }`), `status` (`open`, `closed`, `reopened`). Índice `{tenantId, accountId, date}` único. Origen: `CAJAPAGO` (`FECHA`, `USUARIO`, `APERTURA`, `CIERRE`, `PAGACHEQ`, `PAGAVALO`, `PAGAEFEC`, `MAXEFEC`, `PAGATRANSF`).

Campos de `paymentCashSessions`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `treasuryAccountId` | ObjectId | Sí | Antes `accountId` (nombre de T05). Caja de pagos. | `treasuryAccounts` (M14) |
| `date` | Date | Sí | — | — |
| `branchId` | ObjectId | [VERIFICAR] | — | `branches` (T04) |
| `userId` | ObjectId | Sí | Antes `responsibleUserId` (nombre de T05). `USUARIO`. | `memberships` (T02) |
| `openedAt` | Date (fecha y hora) | [VERIFICAR] | `APERTURA`. | — |
| `closedAt` | Date (fecha y hora) | Cond. | `CIERRE`. | — |
| `maxCash` | Decimal128 | [VERIFICAR] | `MAXEFEC`. | — |
| `allowed` | Object | [VERIFICAR] | `{ ownChecks (PAGACHEQ), values (PAGAVALO), cash (PAGAEFEC), transfers (PAGATRANSF) }`. | — |
| `autoOpened` | Bool | [VERIFICAR] | — | — |
| `cashPaidToday` | Decimal128 | No | Derivado. | — |
| `count` | Object | [VERIFICAR] | `{ counted, theoretical, difference, shortageMovementId }`. | — |
| `status` | Enum | Sí | `open`, `closed`, `reopened`. | — |

### 7.34 `cashRemittances`

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `cashSessionId` | ObjectId (M07) | Sí | Único: una rendición por caja (`CAJAS.ID_CAJ`). | `cashSessions` (M07) |
| `treasuryHandoverId` | ObjectId → `treasuryHandovers` (M07) | Sí | Entrega de caja de M07 que esta rendición recibe: M07 registra la entrega y M14 la recepción (CTR-DAT-64). | `treasuryHandovers` (M07) |
| `legalEntityTotals` | `{ legalEntityId, declaredTotal, theoreticalTotal, countedTotal, treasuryAccountId, operationId }[]` | Sí | Apertura de la rendición por entidad jurídica (DEC-064, DEC-087: un cobro de caja puede cubrir varias entidades y M07 emite un recibo por entidad). Con una sola entidad tiene un elemento. Al aceptar se genera una operación por entidad sobre una cuenta de tesorería de esa entidad (RN-TES-086). | — |
| `cashSessionNumber`, `sessionDate`, `cashierUserId`, `branchId` | — | Sí | `NUM_CAJ`, `FECHA`, `USUARIO`. | `memberships` (T02) / `branches` (T04) |
| `multiDay` | `{ enabled, sessionIds[] }` | No | P2688. | — |
| `declared` | `{ cashByCurrency[], checks[], cardVouchers[], withholdings[], transfers[], other[] }` | Sí | Según cierre de M07 (`TOT_EFE`, `TOT_CHE`, `TOT_RET`, `TOT_TAR`). | — |
| `theoretical` | igual estructura | Sí | Según operaciones de M07. | — |
| `counted` | `{ cashByCurrency[] (con denominaciones opcionales), verifiedCheckIds[], verifiedVoucherIds[], verifiedWithholdingIds[] }` | Cond. | Al recibir. | — |
| `differences` | `{ cash, missingItems[] }` | Sí | `TOT_DIF`. | — |
| `treasuryAccountId` | ObjectId | Sí | Caja de tesorería receptora. | `treasuryAccounts` (M14) |
| `operationId` | ObjectId | Cond. | Al aceptar. | `operations` (T11) |
| `shortageMovementId` | ObjectId | No | — | `treasuryMovements` (M14) |
| `observation` | `{ reason, at, by, resolution }` | No | — | — |
| `status` | enum `pendingReception`, `inReview`, `observed`, `accepted`, `acceptedWithDifference`, `voided` | Sí | §8. | — |
| `zeroCash` | bool | Sí | Caja en cero. | — |

Índices: `{tenantId, cashSessionId}` único; `{tenantId, status, sessionDate}`. Origen: `CAJAS` (`ID_CAJ`, `FECHA`, `NUM_CAJ`, `USUARIO`, `OBS_CAJ`, `TOT_EFE`, `TOT_CHE`, `TOT_RET`, `TOT_TAR`, `TOT_DIF`, `TOTAL`, `FEC_REG`, `USU_REG` y restantes), `EFEC_OP`, `TRAN_OP` (`ID_TRN`, `IMP_TRAN`, `COD_BAN`, `FEC_TES`, `NUM_TES`, `FEC_DEP`, `NUM_DEP`, `ID_CHEQUE`, `NUM_TRAN`, `OBSERVAC`).

### 7.35 `treasuryCashClosings`

Campos: `accountId` (caja de tesorería), `date`, `openingBalance` (por moneda), `totalIn`, `totalOut`, `theoretical`, `counted` (por moneda y denominación), `difference`, `shortageMovementId`, `closedAt`, `closedBy`, `approvedBy`, `status` (`open`, `closed`, `reopened`), `reopen` (`{ at, by, reason }`). Índice `{tenantId, accountId, date}` único.

Campos de `treasuryCashClosings`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `treasuryAccountId` | ObjectId | Sí | Antes `accountId` (nombre de T05). Caja de tesorería. | `treasuryAccounts` (M14) |
| `date` | Date | Sí | — | — |
| `openingBalance` | Object | [VERIFICAR] | Por moneda. | — |
| `totalIn` | Decimal128 | [VERIFICAR] | — | — |
| `totalOut` | Decimal128 | [VERIFICAR] | — | — |
| `theoretical` | Object | [VERIFICAR] | Saldo teórico por moneda. | — |
| `counted` | Object | [VERIFICAR] | Por moneda y denominación. | — |
| `difference` | Decimal128 | [VERIFICAR] | — | — |
| `shortageMovementId` | ObjectId | [VERIFICAR] | — | `treasuryMovements` (M14) |
| `closedAt` | Date (fecha y hora) | Cond. | — | — |
| `closedBy` | ObjectId | Cond. | — | `memberships` (T02) |
| `approvedBy` | ObjectId | Cond. | — | `memberships` (T02) |
| `status` | Enum | Sí | `open`, `closed`, `reopened`. | — |
| `reopen` | Object | [VERIFICAR] | `{ at, by, reason }`. | — |

### 7.36 `paymentExecutions`

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `kind` | enum `supplierPaymentOrder`, `agencyObligation`, `memberRefund`, `payroll`, `other` | Sí | — | — |
| `sourceRef` | `{ module (cmp, fis, cob, sue), docId, docNumber }` | Sí | OP (`ID_PPAGO`), obligación fiscal, reintegro. Con `module = fis`, `docId` es el `_id` de la obligación de `taxObligations` de M06 que el pago cancela (DEC-095). | Polimórfica según `module`: `paymentOrders` (M12), `taxObligations` (M06), reintegro de M07 o `payrollRuns` (M16) |
| `taxObligation` | `{ taxObligationId, ownTaxObligationId, taxAgentRegistrationId, legalEntityId, tax, period }` | Cond. | Obligatorio si `kind = agencyObligation` (DEC-095): identifica la obligación de M06 que cancela el pago (`taxObligationId` = `sourceRef.docId`) y copia de ella, al crear la ejecución, `ownTaxObligationId` (obligación propia de la cooperativa como contribuyente) **o** `taxAgentRegistrationId` (obligación como agente), excluyentes como en M06, más entidad jurídica, impuesto y período. Un pago a organismo sin obligación identificada no se puede instrumentar. M14 no recalcula el importe: lo informa M06. | `taxObligations`, `ownTaxObligations`, `taxAgentRegistrations` (M06); `legalEntities` (T04) |
| `payee` | `{ kind, id, name, cuit, payName (NOM_PAG), toOrder (OPAGO) }` | Sí | — | — |
| `grossAmount`, `withholdingsAmount`, `netAmount`, `currency` | Decimal128 | Sí | Informados por el origen; TES no los recalcula. | — |
| `dueDate`, `scheduledDate` | date | No/No | RF-TES-149. | — |
| `instruments` | `{ instrument, accountId, amount, currency, exchangeRate, valueDate, issueDate, cbu, ownCheckId, thirdPartyCheckIds[], vepNumber, pendingCashOut, paymentFileLineRef, movementId }[]` | Sí | Σ = `netAmount`. | — |
| `signatures` | `{ userId, signerId, at, channel (admin, pwa), amountCovered }[]` | No | `PPAGOS_FIRMAS` (`COD_FIRM`, `ID_PAGO`, `COD_USER`, `FECHA`). | — |
| `requiredSignatures` | int | Sí | Por regla. | — |
| `delivery` | `{ at, by, receivedByName, receivedByDoc, evidenceRef }` | No | `ENTREGA`. | — |
| `status` | enum `pending`, `instrumented`, `partiallySigned`, `signed`, `delivered`, `sentToBank`, `executed`, `rejected`, `voided` | Sí | §8. | — |
| `operationId` | ObjectId | Cond. | — | `operations` (T11) |
| `idempotencyKey` | string | Sí | — | — |

Índices: `{tenantId, sourceRef.module, sourceRef.docId}` único parcial (`status != voided`); `{tenantId, status, scheduledDate}`. Origen: `PPAGOS` (`ID_PPAGO`, `FEC_PAG`, `COD_PROV`, `COD_COM`, `SUC_COM`, `NUM_COM`, `COD_VEN`, `PAGO`, `POR_DES`, `IMP_DES`, `SIN_DES`, `RETG`, `RETB`, `FIRMA`, `ENTREGA`, `NOM_PAG` y restantes: **la cabecera de OP y `PPITEMS` migran a M12**; TES migra firma, entrega y medios), `PPAGOS_FIRMAS`, `FIRMASELECTRONICAS` (`COD_FIRM_ELEC`, `COD_USER`, `TIPO`, `ID_TIPO`, `FEC_REG`, `COD_DOC`), `FIRMASELECTRONICAS_DOCUMENTOS` (posiciones de firma en el PDF → plantilla de comprobante).

### 7.37 `tenantCurrencySettings` (sobre catálogo `currencies` de plataforma, T04)

Campos: `currency` (ISO), `enabled`, `name`, `shortName`, `symbol`, `divisible`, `perceptionPercent` (`POR_PER`, [VERIFICAR] uso), `roundingRule` (`REDONDEO`), `allowsChange` (`PER_VUELTO`), `allowedInCash` (`PERMITIDO`), `system` (`SISTEMA`), `defaultInCash` (P186). Índice `{tenantId, currency}` único. Origen: `TIP_MON`.

Campos de `tenantCurrencySettings`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `currency` | String | Sí | ISO. | — |
| `enabled` | Bool | [VERIFICAR] | — | — |
| `name` | String | Sí | — | — |
| `shortName` | String | [VERIFICAR] | — | — |
| `symbol` | String | [VERIFICAR] | — | — |
| `divisible` | Bool | [VERIFICAR] | — | — |
| `perceptionPercent` | Decimal128 | [VERIFICAR] | `POR_PER`, [VERIFICAR] uso. | — |
| `roundingRule` | Enum | [VERIFICAR] | `REDONDEO`. Valores [VERIFICAR]. | — |
| `allowsChange` | Bool | [VERIFICAR] | `PER_VUELTO`. | — |
| `allowedInCash` | Bool | [VERIFICAR] | `PERMITIDO`. | — |
| `system` | Bool | [VERIFICAR] | `SISTEMA`. | — |
| `defaultInCash` | Bool | [VERIFICAR] | P186. | — |

### 7.38 `exchangeRates`

Campos: `currency`, `quotedAt` (fecha y hora), `buyRate`, `sellRate` (`COT_DOLAR`, `COTIZACION_VENTA`), `source` (`arca`, `bna`, `manual`), `sourceRef`, `approvedBy` (manual). Índice `{tenantId, currency, source, quotedAt}` único. Origen: `COT_DOL` (`COD_COT`, `FEC_COT`, `HOR_COT`, `COT_DOLAR`, `COD_MON`, `COTIZACION_VENTA`), `TIP_MON.COT_PES` (cotización vigente).

Campos de `exchangeRates`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `currency` | String | Sí | — | — |
| `quotedAt` | Date (fecha y hora) | Sí | Fecha y hora. | — |
| `buyRate` | Decimal128 | [VERIFICAR] | — | — |
| `sellRate` | Decimal128 | [VERIFICAR] | `COT_DOLAR`, `COTIZACION_VENTA`. | — |
| `source` | Enum | Sí | `arca`, `bna`, `manual`. | — |
| `sourceRef` | String | [VERIFICAR] | Referencia de la publicación de origen. | — (texto de la fuente de la cotización, p. ej. BCRA; no es referencia) |
| `approvedBy` | ObjectId | Cond. | Manual. | `memberships` (T02) |

### 7.39 `plannedCashItems`

Campos: `direction`, `counterparty` (`{ kind, id, name }`; `COD_PROV`), `conceptRef` (`COD_CON`, `COD_PRO`), `amount`, `currency`, `periodicity` (`once`, `monthly` 1, `bimonthly` 2, `quarterly` 3, `weekly` 4, `biweekly` 5), `startDate` (`FEC_INI`), `endDate` (`FEC_FIN`), `accountId`, `dimensions`, `scenarioId` (null = base), `active`. Origen: `PREV_COM` (`ID_PREVISION`, `COD_PROV`, `FEC_INI`, `FEC_FIN`, `PERIODICIDAD`, `COD_CON`, `COD_PRO`, `IMPORTE`).

Campos de `plannedCashItems`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `direction` | Enum | [VERIFICAR] | — | — |
| `counterparty` | Object | [VERIFICAR] | `{ kind, id, name }`; `COD_PROV`. | — |
| `conceptRef` | ObjectId | [VERIFICAR] | `COD_CON`, `COD_PRO`. | `treasuryConcepts` (M14) |
| `amount` | Decimal128 | [VERIFICAR] | — | — |
| `currency` | String | [VERIFICAR] | — | — |
| `periodicity` | Enum | [VERIFICAR] | `once`, `monthly` 1, `bimonthly` 2, `quarterly` 3, `weekly` 4, `biweekly` 5. | — |
| `startDate` | Date | [VERIFICAR] | `FEC_INI`. | — |
| `endDate` | Date | [VERIFICAR] | `FEC_FIN`. | — |
| `treasuryAccountId` | ObjectId | [VERIFICAR] | Antes `accountId` (nombre de T05). | `treasuryAccounts` (M14) |
| `dimensions` | Object | [VERIFICAR] | — | — |
| `scenarioId` | ObjectId | [VERIFICAR] | Null = base. | `cashFlowScenarios` (M14) |
| `active` | Bool | [VERIFICAR] | — | — |
| `sourceRef` | Object | No | Documento de origen `{ module, docId }`; T05 lo declara como referencia y este anexo no lo describía [VERIFICAR]. | Documento del módulo de origen (polimórfica) |

### 7.40 `fundCommitments`

Campos: `sourceRef` (`{ module (cmp, tes, manual), docId }`), `commitmentRef` (compartida con M15), `amount`, `currency`, `expectedPaymentDate`, `accountId`, `dimensions` (`serviceId`, `costCenterId`), `consumed` (`{ accrued, paid }`), `remaining` (derivado), `status` (`active`, `partiallyConsumed`, `consumed`, `released`, `cancelled`), `releases` (`{ at, amount, reason }[]`). Índice `{tenantId, sourceRef.module, sourceRef.docId}` único; `{tenantId, status, expectedPaymentDate}`.

Campos de `fundCommitments`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `sourceRef` | Object | [VERIFICAR] | `{ module (cmp, tes, manual), docId }`. | Polimórfica según `module`: `purchaseOrders` (M12) o documento de M14; `manual` sin referencia |
| `commitmentRef` | ObjectId | Sí | Compartida con M15. | `commitments` (M15) |
| `amount` | Decimal128 | [VERIFICAR] | — | — |
| `currency` | String | [VERIFICAR] | — | — |
| `expectedPaymentDate` | Date | [VERIFICAR] | — | — |
| `treasuryAccountId` | ObjectId | [VERIFICAR] | Antes `accountId` (nombre de T05). | `treasuryAccounts` (M14) |
| `dimensions` | Object | [VERIFICAR] | `serviceId`, `costCenterId`. | — |
| `consumed` | Object | [VERIFICAR] | `{ accrued, paid }`. | — |
| `remaining` | Decimal128 | No | Derivado. | — |
| `status` | Enum | Sí | `active`, `partiallyConsumed`, `consumed`, `released`, `cancelled`. | — |
| `releases` | [Object] | [VERIFICAR] | `{ at, amount, reason }[]`. | — |

### 7.41 `cashFlowScenarios` y `cashFlowSnapshots`

`cashFlowScenarios`: `name`, `description`, `baseDate`, `horizonDays`, `assumptions` (`collectibilityCurve[]` por antigüedad, `creditDelayDays`, `postponedPayments[]`, `extraItems[]`), `ownerUserId`, `isSimulation: true` (fijo), `status`. `cashFlowSnapshots`: `scenarioId` (null = base), `takenAt`, `granularity`, `rows` (`{ date, accountId, currency, openingBalance, inflowsBySource{}, outflowsBySource{}, closingBalance }[]`), `parametersHash`. Índice `{tenantId, takenAt}`.

Campos de `cashFlowScenarios`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `name` | String | Sí | — | — |
| `description` | String | [VERIFICAR] | — | — |
| `baseDate` | Date | [VERIFICAR] | — | — |
| `horizonDays` | Int | [VERIFICAR] | — | — |
| `assumptions` | Object | [VERIFICAR] | `collectibilityCurve[]` por antigüedad, `creditDelayDays`, `postponedPayments[]`, `extraItems[]`. | — |
| `ownerUserId` | ObjectId | [VERIFICAR] | — | `memberships` (T02) |
| `isSimulation` | Bool | [VERIFICAR] | Valor fijo `true`. | — |
| `status` | Enum | Sí | `draft`, `active`, `archived` (valores de §8.16.10, asumidos en PA-TES-18; antes propuestos `[VERIFICAR]` y, antes de eso, sin valores). | — |
| `code` | String | Sí | Código del escenario; T05 lo declara único y este anexo no lo describía. | — |

**`cashFlowSnapshots`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `scenarioId` | ObjectId | Sí | Null = base. | `cashFlowScenarios` (M14) |
| `takenAt` | Date (fecha y hora) | Cond. | — | — |
| `granularity` | Enum | [VERIFICAR] | — | — |
| `rows` | [Object] | [VERIFICAR] | `{ date, accountId, currency, openingBalance, inflowsBySource{}, outflowsBySource{}, closingBalance }[]`. | — |
| `parametersHash` | String | [VERIFICAR] | — | — |

### 7.42 `payrollPaymentBatches`

Campos: `payrollRunRef` (M16), `period`, `companyRef`, `originTreasuryAccountId` (antes `originAccountId`), `transferDate`, `items` (`{ employeeRef, accountSplits[{ cbu, institutionId, percent, amount }], netAmount, status (pending, sent, accepted, rejected, debited), rejection }[]`; datos de `SU_EMP_CBU` informados por M16), `totals`, `paymentFileIds[]`, `movementIds[]`, `status` (`received`, `fileGenerated`, `sent`, `partiallyExecuted`, `executed`, `voided`), `confidential: true`. Índice `{tenantId, payrollRunRef}` único.

Campos de `payrollPaymentBatches`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `payrollRunId` | ObjectId | Sí | Antes `payrollRunRef` (nombre de T05). M16. | `payrollRuns` (M16) |
| `period` | String | [VERIFICAR] | — | — |
| `legalEntityId` | ObjectId | [VERIFICAR] | Antes `companyRef`. Empleador del lote (DEC-064; nombre canónico de T05 §7.2; PA-TES-19). | `legalEntities` (T04) |
| `originTreasuryAccountId` | ObjectId | Sí | Antes `originAccountId`; nombre canónico de T05 §7.2.1 (PA-DAT-04). | `treasuryAccounts` (M14) |
| `transferDate` | Date | [VERIFICAR] | — | — |
| `items` | [Object] | [VERIFICAR] | `{ employeeRef, accountSplits[{ cbu, institutionId, percent, amount }], netAmount, status (pending, sent, accepted, rejected, debited), rejection }[]`; datos de `SU_EMP_CBU` informados por M16. | — |
| `totals` | Object | [VERIFICAR] | — | — |
| `paymentFileIds` | [ObjectId] | [VERIFICAR] | — | `paymentFiles` (M14) |
| `movementIds` | [ObjectId] | [VERIFICAR] | — | `treasuryMovements` (M14) |
| `status` | Enum | Sí | `received`, `fileGenerated`, `sent`, `partiallyExecuted`, `executed`, `voided`. | — |
| `confidential` | Bool | [VERIFICAR] | Valor fijo `true`. | — |

### 7.43 `treasurySettings`

Documento único por tenant con los parámetros de §14, `signatureRules[]`, umbrales de aprobación, horarios de jobs y mapeo de códigos Interbanking (`ibCodeMappings[]` = `{ operationCodeIb, categoryId, conceptId }`; origen `CON_COM.COD_IB`). Versionado por T04 (configuración publicada).

Campos de `treasurySettings`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `signatureRules` | [Object] | No | Reglas de firma `{ treasuryAccountId?, fromAmount, toAmount, requiredSignatures, requiredGroups[] }` (§7.4; antes `accountId?`). | — |
| `approvalThresholds` | Object | No | Umbrales de aprobación; [VERIFICAR] nombre y estructura (el anexo no los detalla). | — |
| `jobSchedules` | Object | No | Horarios de jobs del §12.3; [VERIFICAR] nombre y estructura (el anexo no los detalla). | — |
| `ibCodeMappings` | [Object] | No | Mapeo de códigos Interbanking `{ operationCodeIb, categoryId, conceptId }`; origen `CON_COM.COD_IB`. | `treasuryCategories` y `treasuryConcepts` (M14) |
| `parameters` | Object | Sí | Valores de los parámetros PRM-TES del §14, versionados por T04. | — |

### 7.44 Relaciones principales

`treasuryOperations 1─N treasuryMovements N─1 treasuryAccounts`; `treasuryMovements N─M bankStatementLines` (vía `reconciliationMatches`); `cashRemittances 1─1 cob.cashSessions` y `1─1 cob.treasuryHandovers` (CTR-DAT-64) y `1─1 treasuryOperations`; `paymentExecutions N─1 cmp.paymentOrders` (vigente 1─1); `thirdPartyChecks 1─N checkEvents`; `checkbooks 1─N ownChecks`; `cardVouchers N─1 cardPresentations`, `N─1 cardSettlements`; `receivedWithholdings N─1 withholdingPresentations`; `paymentFiles 1─N lines → paymentExecutions | payrollPaymentBatches.items`; `fundCommitments N─1 cmp.purchaseOrders`.

## 8. Estados y transiciones

### 8.1 Operación de tesorería (`treasuryOperations.status`)

Estado inicial: alta → `draft` (PA-TES-19).

| Origen → Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|
| `draft` → `posted` | Tesorero / sistema | Balance correcto; período abierto; medios válidos; no requiere aprobación | Movimientos `posted`; saldos; evento `tes.operation.posted` | Anulación |
| `draft` → `pendingApproval` | Tesorero | Supera umbral (PRM-TES-061/062) | Workflow T11; no afecta saldo | Rechazo → `draft` |
| `pendingApproval` → `posted` | Supervisor | Aprobación; período abierto | Igual que arriba | Anulación |
| `posted` → `voided` | Tesorero con `tes.movimientos.anular` | Período abierto; movimientos no conciliados (o desconciliados antes); valores en estado reversible | Operación espejo `posted` con `reversesId`; eventos de reversa a M15 | No se "desanula": se registra una operación nueva |

### 8.2 Movimiento — conciliación (`treasuryMovements.reconciliation.status`)

Estado inicial: alta → `unreconciled` (PA-TES-19).

`unreconciled` → `suggested` (regla) → `reconciled` (confirmación o autoconfirmación); `suggested` → `unreconciled` (rechazo de la sugerencia); `reconciled` → `unreconciled` (desconciliar grupo completo, con conciliación abierta o reabierta).

### 8.3 Conciliación (`reconciliations.status`)

| Origen → Destino | Actor | Precondición | Efectos |
|---|---|---|---|
| — → `open` | Tesorero/auxiliar | Cuenta y fecha de corte posterior a la última cerrada | Calcula saldos |
| `open` → `inReview` | Auxiliar | — | Solicita cierre |
| `inReview` → `closed` | Tesorero/supervisor | `unexplainedDifference = 0`; continuidad de extracto ok o justificada | Bloquea grupos; genera reporte; `tes.reconciliation.closed` |
| `inReview` → `open` | Tesorero | Observación | — |
| `closed` → `reopened` | Supervisor | Período no cerrado; motivo | Habilita cambios; auditoría |
| `reopened` → `closed` | Tesorero/supervisor | Ídem cierre (otro usuario si hubo desconciliación) | Nuevo reporte versionado |

### 8.4 Valor de terceros (`thirdPartyChecks.state`)

| Origen | Destino | Actor | Precondición | Efectos |
|---|---|---|---|---|
| — | `received` | M07 (cobro) / tesorero | Validaciones RN-TES-028…030 | Custodia en la caja de cobranza |
| — | `pendingAcceptance` | Sistema (eCheq recibido) | eCheq informado | No está en cartera |
| `pendingAcceptance` | `inPortfolio` / `repudiated` | Tesorero | Dentro del plazo | Repudio notifica a M07 |
| `received` | `inPortfolio` | Aceptación de rendición | Rendición `accepted` | Custodia caja de tesorería |
| `inPortfolio` | `deliveredToSupplier` | Ejecución de pago | `availableForPayments.enabled` | Movimiento tipo 65 |
| `inPortfolio` | `deposited` | Depósito | Cuenta habilita depósito de valores | Movimiento tipo 2; fecha probable |
| `inPortfolio` | `inCustody` / `negotiated` | Tesorero | eCheq o valor habilitado | Movimiento de negociación |
| `inPortfolio` | `manualOut` | Supervisor | Motivo | Egreso manual |
| `inPortfolio` / `received` | `voided` | Tesorero | Error de carga, sin movimientos posteriores | — |
| `deposited` / `negotiated` | `credited` | Conciliación | Línea bancaria | Disponible |
| `deposited` / `credited` | `rejected` | Tesorero | Aviso bancario | Tipos 59 y 60; `tes.thirdPartyCheck.rejected` |
| `deliveredToSupplier` | `rejected` | Tesorero | Devuelto por proveedor | Tipo 72; comprobante al proveedor (M12) |
| `rejected` | `recovered` | Tesorero | Cobro del recupero | Tipo 61 |
| `rejected` | `returned` | Tesorero | Devolución física al librador | — |
| `deliveredToSupplier` | `inPortfolio` | Anulación de ejecución | Pago anulado | Reversa tipo 65 |

### 8.5 Cheque propio / eCheq emitido (`ownChecks.state`)

| Origen | Destino | Actor | Precondición | Efectos |
|---|---|---|---|---|
| — | `available` | Alta de chequera | — | — |
| `available` | `issued` | Ejecución de pago | Número válido | Movimiento banco (fecha valor = fecha de pago) |
| `issued` (eCheq) | `pendingAcceptance` → `accepted` / `repudiated` | Banco (importación/adaptador) | — | Repudio reabre el pago |
| `issued` / `accepted` | `debited` | Conciliación | Línea de débito | Reclasificación pendiente de débito (M15) |
| `issued` / `accepted` | `recovered` | Tesorero | Devuelto antes del débito | Reversa; cheque físico pasa a `voided` |
| `issued` / `accepted` | `rejected` | Tesorero | Rechazo bancario | Alerta; pago reabierto en M12 |
| `available` | `voided` | Tesorero | — | — |
| `voided` | `available` | Tesorero | Nunca emitido | Desmarcar |

### 8.6 Cupón (`cardVouchers.state`)

Estado inicial: alta → `collected` (PA-TES-19).

`collected` → `inTreasury` (rendición aceptada) → `presented` (lote o automático) → `settled` (liquidación); `presented` → `inTreasury` (anular presentación); `settled` → `presented` (anular liquidación); `collected`/`inTreasury`/`presented` → `rejected` (evento a M07); `collected` → `voided` (anulación del cobro en M07).

### 8.7 Retención recibida (`receivedWithholdings.state`)

Estado inicial: alta → `received` (PA-TES-19).

`received` → `inPortfolio` (rendición aceptada o registro directo) → `presented` (lote o automático) | `out` (salida con destino); `presented` → `inPortfolio` (anular presentación si M06 no la computó en DDJJ presentada); `received`/`inPortfolio` → `voided` (anulación del cobro). `fiscalComputation.status` lo actualiza M06 (`pending`, `included`, `filed`, `rejected`).

### 8.8 Rendición (`cashRemittances.status`)

| Origen → Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|
| — → `pendingReception` | Sistema (`cob.cashSession.closed`) | Caja cerrada en M07 | Rendición creada (idempotente) | — |
| `pendingReception` → `inReview` | Auxiliar/tesorero | No es el cajero | Inicia conteo | — |
| `inReview` → `accepted` | Tesorero | Contado = declarado | Operación de aceptación (RF-TES-128) | Anulación con reapertura en M07 (supervisor) |
| `inReview` → `acceptedWithDifference` | Tesorero + aprobación | Diferencia ≤ tope o aprobada | Aceptación + quebranto | Ídem |
| `inReview` → `observed` | Tesorero | Diferencia o faltante | Notifica a M07 (`tes.cashRemittance.observed`) | M07 corrige y reenvía → `pendingReception` |
| `pendingReception` → `accepted` | Sistema | `zeroCash` | Movimiento "caja en cero" | — |
| `accepted*` → `voided` | Supervisor | Período abierto; valores sin movimientos posteriores | Reversa de la operación; M07 reabre la caja | — |

### 8.9 Ejecución de pago (`paymentExecutions.status`)

| Origen → Destino | Actor | Precondición | Efectos |
|---|---|---|---|
| — → `pending` | Sistema (`cmp.paymentOrder.approved`, obligación M06, reintegro M07, lote M16) | Origen aprobado | En bandeja |
| `pending` → `instrumented` | Tesorero | Σ medios = neto; caja de pagos abierta si hay efectivo | Reserva cheques/valores; movimientos en `pendingApproval` |
| `instrumented` → `partiallySigned` → `signed` | Firmantes | Firmante vigente ≠ quien instrumentó; tope | Firma registrada |
| `signed` → `delivered` | Tesorero/cajero de pagos | Firmado | Movimientos `posted` (efectivo, cheques, valores) |
| `signed` → `sentToBank` | Tesorero | Transferencias en archivo enviado | Archivo `sent` |
| `delivered` / `sentToBank` → `executed` | Sistema (conciliación / respuesta) | Débito conciliado o aceptación del banco | `tes.paymentExecution.executed` a M12 |
| `sentToBank` → `rejected` | Sistema/tesorero | Rechazo de línea | `tes.paymentExecution.rejected`; reinstrumentar |
| cualquiera excepto `executed` → `voided` | Tesorero con `tes.pagos.anular` | Sin salida de caja pendiente sin anular; período abierto | Reversas; `tes.paymentExecution.voided` |
| `pending` / `instrumented` / `partiallySigned` / `signed` → `voided` | Sistema (`fis.obligation.cancelled`, EVT-FIS-26) | `kind = agencyObligation` de la obligación anulada; no salió dinero | Motivo `taxObligationCancelled`; reversa de reservas de medios; `tes.paymentExecution.voided`. Con `delivered` o `sentToBank` no hay transición automática: aviso `taxObligationCancelled` en la bandeja de pagos del tesorero, que decide según la fila anterior (DEC-095, RF-TES-122; 10-11-2026). Se dispara con EVT-FIS-26 `cancellationStatus = pendingPaymentReconciliation`, o con `final` si no hubo publicación previa para la obligación; el `final` posterior es idempotente y solo marca resuelto el aviso. El resultado vuelve a M06 con `tes.paymentExecution.voided` (anulación sin pago) o `tes.paymentExecution.executed` (el pago salió: M06 registra `creditBalanceAmount`); `rejected` no resuelve y el aviso indica anular en lugar de reinstrumentar (M06 RN-FIS-133 punto 9; 10-11-2026, última ronda) |
| `executed` → `voided` | Supervisor | Devolución del banco o error documentado | Reversas; M12 repone saldos |

### 8.10 Archivo de pago (`paymentFiles.status`)

Estado inicial: alta → `generated` (PA-TES-19).

`generated` → `sent` (carga manual con acuse o envío por API) → `accepted` | `partiallyAccepted` | `rejected` → `debited` (conciliación); `generated` → `voided` (no enviado). Un archivo `sent` no se anula: sus líneas rechazadas vuelven a la ejecución.

### 8.11 Caja de pagos (`paymentCashSessions.status`)

Estado inicial: alta → `open` (PA-TES-19).

`open` → `closed` (arqueo) → `reopened` (supervisor) → `closed`.

### 8.12 Cierre de caja de tesorería (`treasuryCashClosings.status`)

Estado inicial: alta → `open` (PA-TES-19).

`open` → `closed` (arqueo y, si hay diferencia, aprobación del quebranto) → `reopened` (supervisor, período abierto; revierte quebranto) → `closed`.

### 8.13 Depósito (`bankDeposits.status`)

Estado inicial: alta → `registered` (PA-TES-19).

`registered` → `partiallyCredited` → `credited`; `registered` → `rejected` (algún cheque rechazado: los demás siguen); `registered` → `voided` (antes de acreditación).

### 8.14 Compromiso (`fundCommitments.status`)

Estado inicial: alta → `active` (PA-TES-19).

`active` → `partiallyConsumed` → `consumed`; `active`/`partiallyConsumed` → `released` (cancelación de OC: libera el remanente); `active` → `cancelled` (error de carga, manual).

### 8.15 Lote de haberes (`payrollPaymentBatches.status`)

`received` → `fileGenerated` → `sent` → `partiallyExecuted` | `executed`; rechazos por ítem → reproceso en nuevo archivo; `received`/`fileGenerated` → `voided` (M16 anula); `executed` → `voided` solo por reversa bancaria documentada.

### 8.16 Colecciones con estados sin transiciones (corrección 05-11-2026)

> **Corrección 05-11-2026 (estados):** el §7 enumeraba los estados de estas colecciones sin declarar sus transiciones. Las tablas siguientes las declaran a partir de los valores del §7 y de los RF, RN y eventos de este anexo; "—" en Guarda o Evento indica que el anexo no declara una RN o un evento para ese paso. Las transiciones que no tienen respaldo explícito en un RF o RN llevan `[VERIFICAR]` y quedan para confirmación del responsable del anexo.

#### 8.16.1 Cuenta de tesorería (`treasuryAccounts.status`)

Estado inicial: `active`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `active` | Alta de la cuenta (RF-TES-001) | — | EVT-TES-03 `tes.account.created` |
| `active` | `blocked` | Bloqueo manual de la cuenta `[VERIFICAR]` | — | — |
| `blocked` | `active` | Desbloqueo manual `[VERIFICAR]` | — | — |
| `active`, `blocked` | `closed` | Cierre de la cuenta | RN-TES-002 (saldo materializado; sin saldo pendiente `[VERIFICAR]`) | EVT-TES-03 `tes.account.closed` |

#### 8.16.2 Firmante de cuenta (`treasuryAccountSigners.status`)

Estado inicial: `active`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `active` | Alta del firmante con vigencia `validFrom` | — | — |
| `active` | `revoked` | Revocación manual o vencimiento de `validTo` `[VERIFICAR]` | — | — |

#### 8.16.3 Importación de extracto (`bankStatementImports.status`)

Estado inicial: `previewed`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta: carga del archivo) | `previewed` | Lectura del archivo y vista previa | — | — |
| `previewed` | `imported` | Confirmación de la importación | RN-TES-060 (deduplicación), RN-TES-082 (líneas inmutables) | EVT-TES-04 `tes.statement.imported` |
| `previewed` | `rejected` | Rechazo del usuario o del validador | — | — |

#### 8.16.4 Vínculo de conciliación (`reconciliationMatches.status`)

Estado inicial: `active`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `active` | Conciliación manual o automática de un grupo | RN-TES-061 (el grupo cuadra o la diferencia se explica) | — |
| `active` | `undone` | Desconciliación del grupo | RN-TES-062 (se deshace el grupo completo) | — |

#### 8.16.5 Conexión Interbanking (`interbankingConnections.status`)

Estado inicial: `active`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `active` | Alta de la conexión con credencial en bóveda | RN-TES-075 | — |
| `active` | `error` | Falla de autenticación o de sincronización `[VERIFICAR]` | — | — |
| `error` | `active` | Reintento exitoso o credencial renovada `[VERIFICAR]` | RN-TES-075 | — |
| `active`, `error` | `disabled` | Desactivación manual | — | — |
| `disabled` | `active` | Reactivación manual `[VERIFICAR]` | RN-TES-075 | — |

#### 8.16.6 Chequera (`checkbooks.status`)

Estado inicial: `active`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `active` | Alta de la chequera (genera un cheque por número) | RN-TES-039 | — |
| `active` | `exhausted` | Último cheque disponible usado | RN-TES-036 | — |
| `active` | `voided` | Anulación de la chequera (anula los cheques disponibles) | RN-TES-039 | — |

#### 8.16.7 Presentación de cupones (`cardPresentations.status`)

Estado inicial: `presented`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `presented` | Presentación de cupones a la procesadora | RN-TES-042 | EVT-TES-13 `tes.cardVoucher.presented` |
| `presented` | `voided` | Anulación de la presentación | RN-TES-044 (solo con cupones no pagados y suma coincidente) | — |

#### 8.16.8 Liquidación de tarjeta (`cardSettlements.status`)

Estado inicial: `registered`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `registered` | Registro de la liquidación de la procesadora | RN-TES-042 | EVT-TES-13 `tes.cardSettlement.recorded` |
| `registered` | `credited` | Acreditación en la cuenta de destino `[VERIFICAR]` | — | — |
| `registered` | `voided` | Anulación de la liquidación `[VERIFICAR]` | — | — |

#### 8.16.9 Presentación de retenciones (`withholdingPresentations.status`)

Estado inicial: `posted`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `posted` | Presentación de retenciones recibidas | — | EVT-TES-14 `tes.receivedWithholding.presented` |
| `posted` | `voided` | Anulación de la presentación | RN-TES-044 (mismo criterio que cupones) | EVT-TES-14 `tes.receivedWithholding.presentationVoided` |

#### 8.16.10 Escenario de flujo de fondos (`cashFlowScenarios.status`)

Valores: `draft`, `active`, `archived` (asumidos en PA-TES-18, DEC-072; antes "valores propuestos `[VERIFICAR]`"; el §7 declaraba `status` sin valores). Estado inicial: `draft`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `draft` | Creación del escenario de simulación | — | — |
| `draft` | `active` | Uso del escenario en la proyección | — | — |
| `draft`, `active` | `archived` | Archivo del escenario | — | — |

Un escenario `archived` no se reactiva: se copia como escenario nuevo. El escenario nunca modifica datos reales (`isSimulation = true`).

#### 8.16.11 Corrida de sincronización Interbanking (`interbankingSyncRuns.status`)

Estado inicial: `running` (corrección del 05-11-2026, PA-TES-19).

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `running` | Inicio de la sincronización (programada o manual) | — | — |
| `running` | `completed` | Todas las páginas procesadas | — | — |
| `running` | `partial` | Alguna página con error; la corrida es reanudable | — | — |
| `partial` | `running` | Reanudación desde la última página procesada | — | — |
| `running` | `failed` | Error de conexión o de credenciales | — | — |

#### 8.16.12 Evento de cheque (`checkEvents.fromState`, `checkEvents.toState`)

`checkEvents` es la bitácora inmutable de las transiciones de §8.4 (`thirdPartyChecks.state`) y §8.5 (`ownChecks.state`): cada documento registra un paso de `fromState` a `toState` de esas máquinas. Estado inicial: el alta del cheque se registra con `fromState` vacío (alta → `received`, `pendingAcceptance` o `available`, según la máquina). No tiene transiciones propias.

## 9. Procesos y flujos

### 9.1 P-TES-01 — Rendición de caja de cobranza, aceptación y depósito (O5)

1. M07 cierra la caja del cajero (arqueo propio) y publica `cob.cashSession.closed` con declarado, teórico y detalle.
2. TES consume el evento y crea `cashRemittances` en `pendingReception` (clave `cashSessionId`; un reenvío no crea otra), vinculada a la entrega `treasuryHandoverId` de M07 (CTR-DAT-64).
3. El auxiliar/tesorero (distinto del cajero) abre PAN-TES-28, cuenta efectivo por moneda (denominaciones opcionales), tilda cada cheque, cupón y retención recibidos.
4. Si coincide: **Aceptar** → en una transacción: movimiento `remittanceCash` a la caja de tesorería; valores `received → inPortfolio` (`remittanceChecks`); cupones `collected → inTreasury` (`remittanceCards`) y autopresentación de débito; retenciones `received → inPortfolio` (`remittanceWithholdings`) y autopresentación si PRM-TES-014; transferencias recibidas (`remittanceTransfers`) registradas en la cuenta bancaria destino como ingreso pendiente de conciliación. Evento `tes.cashRemittance.accepted`.
5. Si difiere: **Observar** (vuelve a M07) o **Aceptar con diferencia** (requiere aprobación si supera PRM-TES-062) → quebranto `shortageIn/Out`.
6. Caja sin operaciones: aceptación automática "caja en cero".
7. Depósito: el tesorero arma la boleta (PAN-TES-17) con efectivo y/o valores → movimiento de salida de la caja de tesorería y de entrada a la cuenta de tránsito; el banco no suma disponible.
8. Al conciliar la acreditación (P-TES-03), el tránsito se cancela, el banco suma y los cheques pasan a `credited`.
9. Recuperación: si el paso 4 falla a mitad, la transacción se revierte completa; el evento consumido se reintenta (idempotente). Casos no recuperables → bandeja técnica (RF-TES-188).

### 9.2 P-TES-02 — Importación de extracto (O5)

1. Usuario elige cuenta y perfil, sube el archivo (almacenamiento privado, hash).
2. `JOB-TES-02 tes:importar-extracto` parsea, valida filas, calcula huellas y detecta duplicados; muestra vista previa con errores, duplicados y continuidad de saldo.
3. Confirmación → crea `bankStatementImports` y líneas; si el mismo hash ya se importó, rechaza.
4. Encola `JOB-TES-03 tes:conciliar-automatico` para la cuenta.

### 9.3 P-TES-03 — Conciliación asistida (O5)

1. `tes:conciliar-automatico` aplica reglas por prioridad: (a) 1:1 por referencia exacta (número de cheque, transferencia, boleta, id de rendición de pasarela) e importe; (b) 1:1 importe exacto y fecha ± tolerancia (PRM-TES-056) con contraparte coincidente; (c) N:1 lote de pago/archivo contra débito total; (d) reglas del tenant (`reconciliationRules`) con acción `suggestCategory`/`createMovement`.
2. Resultado: grupos `suggested` con puntaje; los de reglas `autoConfirm` (si PRM-TES-057) quedan `reconciled` con método `auto`.
3. Usuario en PAN-TES-09: confirma sugerencias, arma grupos N:M manuales (debe cuadrar), crea movimientos desde líneas (gastos, intereses, débitos), envía créditos no identificados a M07.
4. Al cumplirse fecha de corte: calcula partidas pendientes y diferencia no explicada; si es cero, pasa a `inReview` y luego `closed` con reporte.
5. Efectos de conciliar: depósitos → `credited`; cheques propios → `debited`; ejecuciones → `executed`; archivos → `debited`; liquidaciones de tarjeta → `credited`; acreditación de pasarela → evento `tes.gatewayCredit.reconciled` a M07.

### 9.4 P-TES-04 — Sincronización Interbanking (O8)

1. `JOB-TES-04 tes:sincronizar-interbanking` diario (PRM-TES-058) por tenant con conexión activa: obtiene token (T06, bóveda), lista cuentas, consulta saldos (`interbankingBalanceSnapshots`) y descarga movimientos de días anteriores desde la última fecha sincronizada − PRM-TES-059 días, paginando.
2. Cada página se procesa de forma idempotente (huella); el progreso queda en `interbankingSyncRuns` y la corrida es reanudable.
3. Las líneas nuevas se traducen por `ibCodeMappings`; luego se encola la conciliación automática.
4. Errores de autenticación: alerta al tesorero y estado `error` de la conexión; no se reintenta en bucle (backoff T06).

### 9.5 P-TES-05 — Ejecución de pago a proveedor (O8)

1. M12 aprueba la OP y publica `cmp.paymentOrder.approved` (neto, retenciones, proveedor, CBU validado, vencimiento).
2. TES crea `paymentExecutions` `pending` (idempotente por OP).
3. Tesorero instrumenta medios (PAN-TES-26): efectivo (caja de pagos abierta, dentro de tope, o salida pendiente), valores de cartera habilitados, cheque propio/eCheq (número disponible), transferencia (cuenta habilitada, CBU del proveedor), VEP. Σ = neto.
4. Firma: firmantes según regla (PAN-TES-27 o PWA); segregación.
5. Entrega/envío: efectivo y cheques físicos se entregan con constancia; transferencias se agrupan en `paymentFiles` (`JOB-TES-05 tes:generar-archivo-pago`); eCheq se emite (manual con registro del id o adaptador).
6. Confirmación: débito conciliado o aceptación del banco → `executed`; evento a M12 (`tes.paymentExecution.executed`) que marca la OP pagada; evento contable a M15.
7. Rechazo de línea: `rejected`, aviso a M12 y reinstrumentación sin duplicar.
8. Anulación: ver §8.9; M12 repone saldos.

### 9.6 P-TES-06 — Ciclo del cheque de terceros (O8)

Recepción (M07 o tesorería) → rendición → cartera → (habilitar para pago → entrega a proveedor) o (depósito → acreditación) → rechazo (si ocurre) → recupero o devolución. Cada paso registra `checkEvents` y movimiento. Rechazo de depositado: tipos 59 + 60, evento `tes.thirdPartyCheck.rejected` (M07 genera ND al socio con gastos según PA-TES-15). Rechazo de entregado: tipo 72, TES solicita a M12 el comprobante al proveedor (concepto P2384, gasto P2517).

### 9.7 P-TES-07 — Cupones de tarjeta (O8)

Cobro en caja (M07 crea `cardVouchers` vía servicio TES) → rendición (`inTreasury`) → presentación (lote o automática débito) → liquidación: el tesorero (o `JOB-TES-12` de importación de liquidaciones, Extensión) registra neto, comisiones, IVA, impuestos y retenciones; TES crea las retenciones recibidas y solicita a M12 el comprobante de gastos del procesador; la línea bancaria se concilia → `credited`. Rechazo → evento a M07 (anticipo/ND).

### 9.8 P-TES-08 — Retenciones recibidas (O8)

Registro (cobranza, tarjeta, tesorería) → cartera → presentación por lote (PAN-TES-24) con transacción y control de versión → evento `tes.receivedWithholding.presented` a M06 → M06 informa cómputo. Salida con destino alternativo (`withholdingOut`). Anulación de presentación solo si M06 no la incluyó en una DDJJ presentada.

### 9.9 P-TES-09 — Caja de pagos (O8)

`JOB-TES-07 tes:abrir-caja-pagos` (si PRM-TES-040) a las 00:05 hora del tenant crea o reabre la sesión del día con tope y medios. Pagos en efectivo reducen disponible; salidas pendientes se entregan luego con constancia. Cierre con arqueo; diferencia → quebranto; sobrante rendido a la caja de tesorería.

### 9.10 P-TES-10 — Cierre diario de caja de tesorería (O5)

Al fin del día: verificación de rendiciones del día aceptadas u observadas, arqueo, comparación, quebranto con aprobación, cierre. `JOB-TES-08 tes:verificar-cajas-abiertas` alerta a primera hora sobre cajas abiertas de días anteriores (cobranza, pagos, tesorería) y rendiciones pendientes (PRM-TES-067).

### 9.11 P-TES-11 — Cotizaciones (O8)

`JOB-TES-09 tes:actualizar-cotizaciones` diario (y a demanda) obtiene de la fuente configurada (PA-TES-09) las cotizaciones de las monedas habilitadas; si falla, alerta y habilita carga manual con aprobación.

### 9.12 P-TES-12 — Flujo de fondos proyectado (O8)

1. `JOB-TES-10 tes:proyectar-flujo` nocturno (y a demanda) arma la proyección base: saldos operativos de hoy + ingresos (vencimientos de cuenta corriente de M07 por fecha con curva de cobrabilidad, acreditaciones pendientes, depósitos a acreditar, valores en cartera por fecha de pago, cupones presentados por fecha estimada, previsiones de ingreso) − egresos (OP aprobadas por fecha programada, facturas de proveedor con saldo por vencimiento, cheques propios y eCheq no debitados por fecha de pago, obligaciones fiscales de M06, lotes de haberes de M16, previsiones de egreso, compromisos activos por fecha esperada).
2. Lo vencido y no realizado se agrupa en hoy.
3. Guarda snapshot; evalúa alertas de saldo mínimo (`JOB-TES-11`).
4. Escenarios: copia de la base con supuestos; nunca crea movimientos.

### 9.13 P-TES-13 — Compromisos (O8, coordinado con M15)

`cmp.purchaseOrder.approved` → `fundCommitments` `active` con `commitmentRef` (mismo id que usa M15 para el comprometido presupuestario); `cmp.supplierInvoice.registered` consume por devengado; `tes.paymentExecution.executed` consume por pagado; `cmp.purchaseOrder.cancelled` libera remanente.

### 9.14 P-TES-14 — Pago de haberes (O9)

1. M16 aprueba la liquidación y publica `sue.paymentRequest.created` (EVT-SUE-17; ítems con cuentas y porcentajes).
2. TES crea `payrollPaymentBatches` (`received`); el tesorero elige cuenta de origen y fecha (modificable si PRM-TES-079) y genera archivos por banco/formato (`JOB-TES-05`).
3. Envío (manual con acuse o API si PA-TES-02 lo habilita) → `sent`.
4. Respuesta/rechazos por empleado; reproceso de rechazados en nuevo archivo.
5. Conciliación del débito → `executed`; evento `tes.payrollPayment.confirmed` por empleado a M16 (que habilita el recibo como pagado en el portal del empleado).

### 9.15 P-TES-15 — Cierre de período de Tesorería y Bancos

Validaciones: cajas cerradas (RF-TES-139), conciliaciones de todas las cuentas bancarias cerradas hasta la fecha (o justificación), rendiciones del período resueltas, eventos contables confirmados por M15 (sin pendientes en outbox). Cierre registrado en `modulePeriods` (`tes.bancos`, `tes.tesoreria`). Reapertura con permiso y auditoría.

### 9.16 Reintentos, cancelación y recuperación (todos los jobs)

Todos los jobs son idempotentes, reanudables y registran progreso (guía §5). Reintento con backoff exponencial (T06/T11); tras N fallos → bandeja técnica. La cancelación de un job de importación deja la importación en `rejected` sin líneas parciales. ESC-04 (restauración): al restaurar datos, `tes:reconciliar-externos` compara archivos enviados, respuestas y líneas de extracto con los registros locales y nunca reenvía un archivo cuya transmisión consta en el banco.

## 10. Pantallas

Todas las pantallas admin usan AdminShell, `AdminStickyHeader`, `ScreenHelp` (qué, quién, cuándo, dónde, por qué, cómo + caso de uso), `DataTable` (columnas configurables, orden, filtros, paginación, exportar XLSX/CSV/PDF, selección masiva, vistas guardadas), modales `sm/md/lg/xl`, `ConfirmDialog`, toasts, importes en IBM Plex Mono, tema oscuro con tokens CNX §4.1. Grupo del mapa del sitio: **Administración → Tesorería y bancos**. Estados vacíos con texto `dict:` y acción principal.

| PAN-ID | App | Ruta | Capability | Propósito | Layout / contenido principal | Acciones y modales | Equivalencia ProCoop (INV/REL) |
|---|---|---|---|---|---|---|---|
| PAN-TES-01 | admin | `/admin/tes/tablero` | `tes.posicion.ver` | Posición diaria y alertas | Tarjetas: disponible total, en tránsito, a acreditar, cartera, no debitados, proyección 7/30 días; tarjeta aparte "En cajas sin rendir" (fuera del total, DEC-101) que abre el detalle por caja con antigüedad y estado de la rendición (RF-TES-145); gráfico de saldo proyectado; lista de alertas (rendiciones pendientes, conciliaciones atrasadas, valores por vencer, pagos por firmar) | Ir a cada bandeja; exportar | REL Tesorería "Informes"; Disponibilidades |
| PAN-TES-02 | admin | `/admin/tes/cuentas` | `tes.cuentas.ver` | Listado de cuentas financieras | DataTable: código, nombre, tipo, entidad, CBU (enmascarado parcial), moneda, saldo operativo, saldo contable, última conciliación, estado. Filtros: tipo, moneda, estado, sucursal | Nueva cuenta (modal xl PAN-TES-03), bloquear, cerrar, ver libro | Configuración `abm_bankos` (Cuentas Propias) |
| PAN-TES-03 | admin | modal en PAN-TES-02 | `tes.cuentas.crear/editar` | Ficha de cuenta | Pestañas: Datos (RF-TES-002), Medios habilitados, Firmantes (`treasuryAccountSigners`), Interbanking, Contabilidad (claves de regla), Alertas | Guardar, validar CBU, vincular IB | `abm_bankos`; `PPAGOS_FIRMANTES` |
| PAN-TES-04 | admin | `/admin/tes/entidades` | `tes.cuentas.configurar` | Entidades financieras y sucursales | Dos DataTables maestro-detalle | Alta/edición (modal md) | `abm_EntFin`, `abm_SucEnt` |
| PAN-TES-05 | admin | `/admin/tes/categorias` | `tes.categorias.configurar` | Categorías y conceptos | Pestañas Categorías (con tipos permitidos y clase de gasto) y Conceptos | Alta/edición (modal md); importar con ExcelImportWizard | `abm_Cat_Banc`; `CONTES` |
| PAN-TES-06 | admin | `/admin/tes/movimientos` | `tes.movimientos.ver` | Libro unificado de movimientos y operaciones | DataTable con filtros de RF-TES-032; columna estado de conciliación; agrupación por operación | Nueva operación (asistente modal xl: tipo → ingresos → egresos → cupones/retenciones → datos de comprobante → confirmar, con componente "medio de pago" reutilizable); anular; imprimir comprobante | `frmWizardMovimientos`, `frmCargaMedioDePago_Simple`, `frmTesoreriaHandler.Anular/Imprimir`; REL "Movimientos" |
| PAN-TES-07 | admin | `/admin/tes/cuentas/:id/libro` | `tes.movimientos.ver` | Libro de bancos / tesorería | Saldo inicial, movimientos, saldo acumulado, selector tipo de fecha (emisión, valor, registro, conciliación) | Exportar; ir a origen | REL "Movimientos Bancarios"; `GetLibroBancos` |
| PAN-TES-08 | admin | `/admin/tes/extractos` | `tes.extractos.importar` | Importaciones de extractos | DataTable de importaciones (cuenta, período, saldos, líneas, duplicados, continuidad) | Importar (ExcelImportWizard + perfil), administrar perfiles (modal lg), ver líneas | FIC 11.2 (`clsCuentas.ImportarMovTesore`) |
| PAN-TES-09 | admin | `/admin/tes/conciliacion/:cuenta` | `tes.conciliacion.conciliar` | Conciliación asistida | Encabezado: cuenta, fecha de corte, saldo extracto, saldo libro, diferencia. Panel izquierdo líneas de banco, derecho movimientos de libro; filtros conciliado/no conciliado/por fecha de conciliación, débito/crédito; totales de seleccionados | Conciliar automático, confirmar sugerencias, conciliar selección (N:M), crear movimiento desde línea (crédito/débito bancario), enviar a no identificados, desconciliar, cerrar conciliación, imprimir reporte | `frmConciliacion`, `frmConciliacionInterbanking` (`ConciliarAutomatico`, `btnCreditoDebitoBancario`) |
| PAN-TES-10 | admin | `/admin/tes/reglas-conciliacion` | `tes.reglasConciliacion.configurar` | Reglas de conciliación | DataTable con prioridad (arrastrar) | Alta/edición, probar sobre extracto (simulación) | Nuevo |
| PAN-TES-11 | admin | `/admin/tes/interbanking` | `tes.interbanking.configurar` | Conexión y cuentas IB | Estado de conexión, último token, cuentas IB y vínculo, mapeo de códigos, corridas | Probar conexión, sincronizar ahora, vincular, editar mapeos | `abm_bankos` (CTA_INTERBANKING); `INTERBANKING` |
| PAN-TES-12 | admin | `/admin/tes/interbanking/saldos` | `tes.interbanking.sincronizar` | Saldos IB vs libro | DataTable: cuenta, saldo banco, saldo libro, diferencia, fecha/hora | Actualizar | `frmSaldosCuentasInterbanking` |
| PAN-TES-13 | admin | `/admin/tes/archivos-pago` | `tes.archivosPago.generar` | Archivos de pago | DataTable: propósito, formato, cuenta origen, fecha, líneas, total, estado | Generar (desde selección), descargar, registrar envío/acuse, importar respuesta, anular no enviado | `frmExportadorInterBanking`; `GenerarArchivosInterbanking` |
| PAN-TES-14 | admin | `/admin/tes/valores` | `tes.valores.ver` | Cartera de valores de terceros | DataTable: formato, banco, número, librador, CUIT, fecha de pago, importe, estado, custodia, habilitado para pago; filtros por estado y especiales (disponibles para pago, rechazados no recuperados, transferidos desde caja), por seis tipos de fecha | Nuevo valor (PAN-TES-15), habilitar/deshabilitar para pago (masivo), depositar (→PAN-TES-17), rechazar, recuperar, devolver, egreso manual, ver historial | `frmValores_Seleccion`, `Valores_ModoEdicion`, `frmTesoreriaHandler.MarcarValoresParaPago/ModificarCheque`; REL "Valores de Terceros" |
| PAN-TES-15 | admin | modal lg | `tes.valores.crear` | Alta/edición de valor | Campos de RF-TES-061, lectura CMC-7, cálculo de valor actual, aviso de rechazados del librador | Guardar, ver rechazados | `frmNuevoCheque` |
| PAN-TES-16 | admin | `/admin/tes/libradores` | `tes.valores.editar` | Cuentas de libradores | DataTable con bloqueo | Bloquear/desbloquear | `abm_CtaSuce` |
| PAN-TES-17 | admin | `/admin/tes/depositos` | `tes.depositos.crear` | Depósitos bancarios | DataTable de boletas con estado y fecha probable | Nuevo depósito (modal lg: cuenta, efectivo, selección de valores), imprimir boleta, anular | Tipos 1/2 en `frmWizardMovimientos` |
| PAN-TES-18 | admin | `/admin/tes/chequeras` | `tes.chequeras.ver` | Chequeras y cheques propios | Maestro (chequeras) / detalle (cheques con estado, número, beneficiario, fecha de pago, pago vinculado) | Nueva chequera, anular/desmarcar cheque, reemplazar en pago, recuperar, baja parcial | `frmTesoreriaHandler.AnularCheque/RecuperaCheque/ReemplazarChequeEnOP`; REL "Cheques Propios" |
| PAN-TES-19 | admin | `/admin/tes/echeq` | `tes.echeq.ver` | Bandeja eCheq | Pestañas Emitidos y Recibidos con estado bancario; alertas de aceptación | Aceptar/repudiar recibido, endosar, depositar, custodia, negociar, importar estados | Nuevo (DFA M18 mejora) |
| PAN-TES-20 | admin | modal xl en PAN-TES-18 | `tes.chequeras.imprimir` | Impresión de cheques | Rango desde/hasta, vista previa, formato | Imprimir, marcar impresos | `ImprimirValores` (P370) |
| PAN-TES-21 | admin | `/admin/tes/tarjetas` | `tes.tarjetas.configurar` | Tarjetas y planes | DataTable; ficha con recargos por cuotas | Alta/edición, agregar/quitar cuota | `abm_Tarjetas`, `abm_Tarjetas_Recargo` |
| PAN-TES-22 | admin | `/admin/tes/cupones` | `tes.cupones.ver` | Cupones | DataTable por estado (en tesorería, presentados, pendientes de cobro, cobrados, rechazados) | Presentar (lote), anular presentación, corregir datos, rechazar (modal), liquidar (→PAN-TES-23) | `frmCargaCuponesSimple`, `frmRechazarCupon`, `frmTesoreriaHandler.ValidarCuponesPresentacion`; REL "Cupones de Tarjetas" |
| PAN-TES-23 | admin | `/admin/tes/liquidaciones-tarjeta` | `tes.cupones.liquidar` | Liquidaciones de tarjeta | DataTable; formulario de liquidación con desglose y control de cuadre | Registrar, anular, importar archivo (Extensión) | `CobrarCupones`; `PAGOTAR` |
| PAN-TES-24 | admin | `/admin/tes/retenciones-recibidas` | `tes.retencionesRecibidas.ver` | Cartera de retenciones recibidas | DataTable con tipo, agente, certificado, importe, estado, cómputo M06 | Nueva (modal md con adjunto), editar, presentar (lote), salida, anular presentación | `frmCargaRetenciones`; REL "Retenciones Recibidas" |
| PAN-TES-25 | admin | `/admin/tes/cajas-pago` | `tes.cajasPago.abrir` | Cajas para pagos a proveedores | Sesiones por fecha con tope, medios, pagado, disponible, estado | Abrir, cerrar con arqueo, reabrir, consultar por mes/12 meses | `abm_CajaPago`, `frmApertura_Cierre_Cajas_Comprs`; REL "Cajas para Pagos a Proveedores" |
| PAN-TES-26 | admin | `/admin/tes/pagos` | `tes.pagos.ver` | Bandeja de pagos a ejecutar | DataTable: origen (OP/obligación/reintegro/haberes), beneficiario, vencimiento, programado, neto, estado, firmas | Instrumentar (modal xl con componente medio de pago), programar fecha, anular, imprimir comprobante; pestañas Pendientes de salida y Diferidos | `frmCargaMedioDePago_Simple` (`chkPagoVep`, chequeras, moneda, retenciones); `frmTesoreriaHandler.DatosOP/ImprimirOP`; REL Compras "Pago a Proveedores" |
| PAN-TES-27 | admin | `/admin/tes/pagos/firma` | `tes.pagos.firmar` | Firma y entrega | Lista de pagos firmables por el usuario con total seleccionado | Firmar (individual/masivo, 2FA), entregar (registrar receptor), ver rechazos con causa | `Firmar_Entragar_MasivaOP` |
| PAN-TES-28 | admin | `/admin/tes/rendiciones` | `tes.rendiciones.recibir` | Rendiciones de cajas de cobranza | DataTable: caja, cajero, fecha, declarado, estado, antigüedad. Detalle (modal xl): conteo de efectivo por moneda/denominación, check de valores, cupones y retenciones, diferencias | Recibir, aceptar, aceptar con diferencia (aprobación), observar, anular (supervisor) | `clsCajas.CerrarCaja` (lado tesorería); REL Tesorería "Cierre de Cajas" |
| PAN-TES-29 | admin | `/admin/tes/cierre-caja` | `tes.cierreCaja.cerrar` | Arqueo y cierre de caja de tesorería | Saldo inicial, ingresos, egresos, teórico, contado, diferencia por moneda; planilla diaria | Cerrar, reabrir, imprimir planilla | REL "Cierre de Cajas"; `GetPlanillaDiaria` |
| PAN-TES-30 | admin | `/admin/tes/monedas` | `tes.monedas.configurar` | Monedas y cotizaciones | Pestañas Monedas habilitadas y Cotizaciones (DataTable por moneda/fuente/fecha) | Habilitar, editar reglas, cargar cotización (aprobación), actualizar desde fuente | `TIP_MON`, `COT_DOL` (Configuración) |
| PAN-TES-31 | admin | `/admin/tes/tipos-valor` | `tes.configuracion.configurar` | Tipos de instrumento | DataTable | Alta/edición | `abm_TipVal` |
| PAN-TES-32 | admin | `/admin/tes/flujo` | `tes.flujo.ver` | Flujo de fondos proyectado | Selector horizonte y granularidad; tabla por fecha con ingresos/egresos por origen y saldo; gráfico; drill-down a documentos; comparar con escenario o snapshot | Recalcular, guardar snapshot, exportar | Previsiones (`GetPrevisiones_*`, `GetPrevisionesCompras`) |
| PAN-TES-33 | admin | `/admin/tes/previsiones` | `tes.previsiones.crear` | Previsiones y compromisos | Pestañas Previsiones (con periodicidad) y Compromisos (con consumo y liberación) | Alta/edición, liberar compromiso | `PREV_COM` |
| PAN-TES-34 | admin | `/admin/tes/escenarios` | `tes.flujo.simular` | Escenarios de liquidez | Lista de escenarios con supuestos; comparación con base | Crear, duplicar, archivar | Nuevo (BASE §21) |
| PAN-TES-35 | admin | `/admin/tes/haberes` | `tes.haberes.ejecutar` | Lotes de pago de haberes | DataTable de lotes (período, total, estado); detalle por empleado solo con `tes.haberes.verDetalle` | Generar archivo(s), registrar envío, importar respuesta, reprocesar rechazados | `frmExportadorInterBanking` (sueldos); `GenerarPago` (lado tesorería) |
| PAN-TES-36 | admin | `/admin/tes/informes` | `tes.informes.ver` | Catálogo de informes | Lista de informes de §15 con parámetros (fecha de corte, cuentas, monedas) | Ejecutar, exportar, programar envío | REL Tesorería "Informes"; `clsInformes_Tesoreria` |
| PAN-TES-37 | admin | `/admin/tes/operaciones/:id` | `tes.movimientos.ver` | Detalle de operación | Cabecera, movimientos, medios, valores, origen, asiento, auditoría | Imprimir comprobante, anular, ir a conciliación | `frmTesoreriaHandler.ImprimirTesore/ImprimirResBan` |
| PAN-TES-38 | admin | `/admin/tes/excepciones` | `tes.movimientos.ver` | Bandeja de excepciones | Pestañas: no identificados enviados a M07, líneas sin clasificar, archivos sin respuesta, eventos no procesados, diferencias de rendición | Asignar responsable, resolver, reintentar | Nuevo (AGR-016) |
| PAN-TES-39 | admin | `/admin/tes/configuracion` | `tes.configuracion.configurar` | Parámetros de tesorería | Formulario agrupado de §14, reglas de firmas, umbrales de aprobación, horarios de jobs | Guardar (versión T04), publicar | Parámetros del Sistema (sección TESORERÍA) |
| PAN-TES-40 | pwa-empleado | `/app/tesoreria/firmas` | `tes.pagos.firmar` | Firma móvil de pagos | Cards de pagos pendientes de firma (beneficiario, importe, vencimiento, cuenta) con skeleton y FAB deshabilitado | Firmar (2FA), rechazar con motivo | Nuevo |
| PAN-TES-41 | pwa-empleado | `/app/tesoreria/posicion` | `tes.posicion.ver` | Posición diaria móvil | Cards por cuenta: disponible, tránsito; proyección 7 días | Ver detalle | Nuevo |
| PAN-TES-42 | admin | `/admin/tes/periodos` | `tes.periodos.cerrar` | Cierre de períodos de Tesorería y Bancos | Fechas de cierre por módulo, bloqueantes (cajas abiertas, conciliaciones abiertas, eventos pendientes) | Cerrar, reabrir (motivo) | P502, P506 |

**Ayuda contextual (ejemplo PAN-TES-09):** qué: explicar la diferencia entre banco y libro; quién: tesorero/auxiliar; cuándo: diariamente tras sincronizar o importar; dónde: Tesorería → Conciliación; por qué: AGR-011 (cada peso explicado); cómo: confirmar sugerencias, armar grupos, crear movimientos de gastos, cerrar al llegar a diferencia cero; caso de uso: CU-21.

## 11. API

> **Corrección 05-11-2026 (capabilities):** las filas que tenían un rol, un texto libre o un patrón (`<acción>`, "Autenticado", "Pública", "según acción") en la columna Capability usan ahora una capability `modulo.recurso.accion` de la convención de T02, o `public: true` para los endpoints públicos (RF-IAM-061 de T02). El valor anterior queda entre paréntesis como "antes: …".

Prefijo admin: `/api/admin/tes`. Paginación `?page=&size=` → `{ items, total, page, size }`. Errores RFC 9457. Validación Zod compartida. `Idempotency-Key` obligatorio donde se indica "Sí".

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-TES-01 | GET | `/api/admin/tes/accounts` | `tes.cuentas.ver` | Listar cuentas financieras | — |
| API-TES-02 | POST | `/api/admin/tes/accounts` | `tes.cuentas.crear` | Crear cuenta (genera apertura) | Sí |
| API-TES-03 | GET | `/api/admin/tes/accounts/:id` | `tes.cuentas.ver` | Detalle con saldos | — |
| API-TES-04 | PATCH | `/api/admin/tes/accounts/:id` | `tes.cuentas.editar` | Editar (control optimista `version`) | — |
| API-TES-05 | POST | `/api/admin/tes/accounts/:id/block` · `/close` | `tes.cuentas.configurar` | Bloquear / cerrar | Sí |
| API-TES-06 | GET | `/api/admin/tes/accounts/:id/balance?date=&basis=operational\|book\|future` | `tes.cuentas.ver` | Saldo a fecha | — |
| API-TES-07 | GET/POST/PATCH | `/api/admin/tes/accounts/:id/signers` | `tes.cuentas.configurar` | Firmantes | Sí (POST) |
| API-TES-08 | GET/POST/PATCH | `/api/admin/tes/institutions` · `/branches` | `tes.cuentas.configurar` | Entidades y sucursales | Sí (POST) |
| API-TES-09 | GET/POST/PATCH | `/api/admin/tes/categories` · `/concepts` · `/instrument-types` | `tes.categorias.configurar` | Maestros | Sí (POST) |
| API-TES-10 | GET/POST/PATCH | `/api/admin/tes/drawer-accounts` | `tes.valores.editar` | Libradores | Sí (POST) |
| API-TES-11 | GET | `/api/admin/tes/movements` | `tes.movimientos.ver` | Buscar movimientos | — |
| API-TES-12 | POST | `/api/admin/tes/operations` | `tes.movimientos.crear` | Registrar operación (asistente) | Sí |
| API-TES-13 | GET | `/api/admin/tes/operations/:id` | `tes.movimientos.ver` | Detalle | — |
| API-TES-14 | POST | `/api/admin/tes/operations/:id/void` | `tes.movimientos.anular` | Anular con motivo | Sí |
| API-TES-15 | POST | `/api/admin/tes/operations/:id/approve` · `/reject` | `tes.movimientos.aprobar` | Aprobar/rechazar | Sí |
| API-TES-16 | GET | `/api/admin/tes/operations/:id/pdf` | `tes.movimientos.ver` | Comprobante | — |
| API-TES-17 | PATCH | `/api/admin/tes/movements/:id` | `tes.movimientos.editar` | Cambiar fecha valor/observación | Sí |
| API-TES-18 | GET | `/api/admin/tes/accounts/:id/book` | `tes.movimientos.ver` | Libro con saldo inicial | — |
| API-TES-19 | GET/POST/PATCH | `/api/admin/tes/statement-profiles` | `tes.extractos.importar` | Perfiles de importación | Sí (POST) |
| API-TES-20 | POST | `/api/admin/tes/statement-imports/preview` | `tes.extractos.importar` | Subir y previsualizar | — |
| API-TES-21 | POST | `/api/admin/tes/statement-imports/:id/confirm` | `tes.extractos.importar` | Confirmar importación | Sí |
| API-TES-22 | GET | `/api/admin/tes/statement-lines` | `tes.conciliacion.ver` | Líneas por cuenta/estado | — |
| API-TES-23 | POST | `/api/admin/tes/reconciliations` | `tes.conciliacion.conciliar` | Abrir conciliación | Sí |
| API-TES-24 | GET | `/api/admin/tes/reconciliations/:id` | `tes.conciliacion.ver` | Estado, saldos, partidas | — |
| API-TES-25 | POST | `/api/admin/tes/reconciliations/:id/auto-match` | `tes.conciliacion.conciliar` | Ejecutar reglas (job) | Sí |
| API-TES-26 | POST | `/api/admin/tes/reconciliations/:id/matches` | `tes.conciliacion.conciliar` | Crear grupo N:M (con movimiento de diferencia opcional) | Sí |
| API-TES-27 | POST | `/api/admin/tes/reconciliations/:id/matches/confirm` | `tes.conciliacion.conciliar` | Confirmar sugerencias en bloque | Sí |
| API-TES-28 | DELETE | `/api/admin/tes/reconciliation-matches/:id` | `tes.conciliacion.desconciliar` | Desconciliar grupo (motivo en cuerpo; borrado lógico) | Sí |
| API-TES-29 | POST | `/api/admin/tes/statement-lines/:id/create-movement` | `tes.conciliacion.conciliar` | Crear movimiento y conciliar | Sí |
| API-TES-30 | POST | `/api/admin/tes/statement-lines/:id/send-unidentified` | `tes.conciliacion.conciliar` | Enviar a no identificados (M07) | Sí |
| API-TES-31 | POST | `/api/admin/tes/reconciliations/:id/close` · `/reopen` | `tes.conciliacion.cerrar` · `tes.conciliacion.reabrir` | Cerrar / reabrir | Sí |
| API-TES-32 | GET | `/api/admin/tes/reconciliations/:id/report` | `tes.conciliacion.ver` | Reporte PDF/XLSX | — |
| API-TES-33 | GET/POST/PATCH | `/api/admin/tes/reconciliation-rules` (+ `/:id/test`) | `tes.reglasConciliacion.configurar` | Reglas y prueba | Sí (POST) |
| API-TES-34 | GET/PUT | `/api/admin/tes/interbanking/connection` | `tes.interbanking.configurar` | Configurar conexión (secreto solo de escritura → bóveda) | Sí |
| API-TES-35 | POST | `/api/admin/tes/interbanking/test` | `tes.interbanking.configurar` | Probar conexión | — |
| API-TES-36 | GET | `/api/admin/tes/interbanking/accounts` | `tes.interbanking.sincronizar` | Cuentas IB | — |
| API-TES-37 | POST | `/api/admin/tes/interbanking/sync` | `tes.interbanking.sincronizar` | Sincronizar ahora (job) | Sí |
| API-TES-38 | GET | `/api/admin/tes/interbanking/balances` | `tes.interbanking.sincronizar` | Saldos banco vs libro | — |
| API-TES-39 | GET/PUT | `/api/admin/tes/interbanking/code-mappings` | `tes.interbanking.configurar` | Mapeo de códigos | Sí |
| API-TES-40 | POST | `/api/admin/tes/payment-files` | `tes.archivosPago.generar` | Generar archivo desde selección | Sí |
| API-TES-41 | GET | `/api/admin/tes/payment-files/:id/download` | `tes.archivosPago.generar` | Descargar (URL firmada) | — |
| API-TES-42 | POST | `/api/admin/tes/payment-files/:id/sent` · `/response` · `/void` | `tes.archivosPago.enviar` | Registrar envío / importar respuesta / anular | Sí |
| API-TES-43 | GET | `/api/admin/tes/third-party-checks` | `tes.valores.ver` | Cartera | — |
| API-TES-44 | POST | `/api/admin/tes/third-party-checks` | `tes.valores.crear` | Alta de valor | Sí |
| API-TES-45 | PATCH | `/api/admin/tes/third-party-checks/:id` | `tes.valores.editar` | Modificar (en cartera) | — |
| API-TES-46 | POST | `/api/admin/tes/third-party-checks/:id/{enable-payment\|disable-payment\|reject\|recover\|return\|manual-out\|void\|accept\|repudiate\|custody\|negotiate}` | `tes.valores.editar` (antes: `tes.valores.<acción>`) | Transiciones | Sí |
| API-TES-47 | GET | `/api/admin/tes/third-party-checks/:id/events` | `tes.valores.ver` | Historial | — |
| API-TES-48 | POST | `/api/admin/tes/deposits` · `/:id/void` | `tes.depositos.crear` | Depósito / anular | Sí |
| API-TES-49 | GET/POST | `/api/admin/tes/checkbooks` | `tes.chequeras.crear` | Chequeras | Sí (POST) |
| API-TES-50 | POST | `/api/admin/tes/own-checks/:id/{void\|unmark\|replace\|recover\|reject}` | `tes.chequeras.anular` | Transiciones de cheque propio | Sí |
| API-TES-51 | POST | `/api/admin/tes/own-checks/print` | `tes.chequeras.imprimir` | Imprimir rango (PDF) y marcar | Sí |
| API-TES-52 | POST | `/api/admin/tes/echeqs/import-status` | `tes.echeq.gestionar` | Importar estados eCheq | Sí |
| API-TES-53 | GET/POST/PATCH | `/api/admin/tes/card-plans` | `tes.tarjetas.configurar` | Tarjetas y recargos | Sí (POST) |
| API-TES-54 | GET | `/api/admin/tes/card-vouchers` | `tes.cupones.ver` | Cupones | — |
| API-TES-55 | PATCH | `/api/admin/tes/card-vouchers/:id` | `tes.cupones.editar` | Corregir datos | — |
| API-TES-56 | POST | `/api/admin/tes/card-presentations` · `/:id/void` | `tes.cupones.presentar` | Presentar / anular | Sí |
| API-TES-57 | POST | `/api/admin/tes/card-settlements` · `/:id/void` | `tes.cupones.liquidar` | Liquidar / anular | Sí |
| API-TES-58 | POST | `/api/admin/tes/card-vouchers/:id/reject` | `tes.cupones.rechazar` | Rechazo de cupón | Sí |
| API-TES-59 | GET/POST/PATCH | `/api/admin/tes/received-withholdings` | `tes.retencionesRecibidas.crear` | Retenciones recibidas | Sí (POST) |
| API-TES-60 | POST | `/api/admin/tes/withholding-presentations` · `/:id/void` | `tes.retencionesRecibidas.presentar` | Presentar / salida / anular | Sí |
| API-TES-61 | GET/POST | `/api/admin/tes/payment-cash-sessions` (+ `/:id/close`, `/:id/reopen`) | `tes.cajasPago.abrir` | Caja de pagos | Sí |
| API-TES-62 | GET | `/api/admin/tes/payment-executions` | `tes.pagos.ver` | Bandeja | — |
| API-TES-63 | PUT | `/api/admin/tes/payment-executions/:id/instruments` | `tes.pagos.ejecutar` | Instrumentar medios | Sí |
| API-TES-64 | POST | `/api/admin/tes/payment-executions/sign` | `tes.pagos.firmar` | Firmar (lista de ids; 2FA reciente) | Sí |
| API-TES-65 | POST | `/api/admin/tes/payment-executions/:id/deliver` | `tes.pagos.entregar` | Entregar | Sí |
| API-TES-66 | POST | `/api/admin/tes/payment-executions/:id/void` | `tes.pagos.anular` | Anular | Sí |
| API-TES-67 | PATCH | `/api/admin/tes/payment-executions/:id/schedule` | `tes.pagos.ejecutar` | Programar fecha | — |
| API-TES-68 | GET | `/api/admin/tes/cash-remittances` | `tes.rendiciones.recibir` | Rendiciones | — |
| API-TES-69 | POST | `/api/admin/tes/cash-remittances/:id/{start-review\|accept\|accept-with-difference\|observe\|void}` | `tes.rendiciones.recibir` (antes: `tes.rendiciones.<acción>`) | Transiciones de rendición | Sí |
| API-TES-70 | POST | `/api/admin/tes/treasury-cash-closings` · `/:id/reopen` | `tes.cierreCaja.cerrar` | Cierre / reapertura de caja de tesorería | Sí |
| API-TES-71 | GET/PATCH | `/api/admin/tes/currencies` | `tes.monedas.configurar` | Monedas del tenant | — |
| API-TES-72 | GET/POST | `/api/admin/tes/exchange-rates` (+ `/refresh`) | `tes.cotizaciones.crear` | Cotizaciones | Sí |
| API-TES-73 | GET | `/api/admin/tes/position?date=` | `tes.posicion.ver` | Posición diaria; la respuesta incluye `unremittedCash` `{ totalsByMethod [{ method, currency, amount }], registers [{ cashRegisterId, branchId, cashierUserId, sessionStatus, businessDate, ageDays, handoverStatus, totalsByMethod }] }` obtenido de `cob.service.getUnremittedCash` (RF-COB-195), separado de `available` (DEC-101) | — |
| API-TES-74 | GET | `/api/admin/tes/cash-flow?from=&to=&granularity=&scenarioId=` | `tes.flujo.ver` | Proyección | — |
| API-TES-75 | POST | `/api/admin/tes/cash-flow/snapshots` | `tes.flujo.ver` | Guardar snapshot | Sí |
| API-TES-76 | GET/POST/PATCH | `/api/admin/tes/scenarios` | `tes.flujo.simular` | Escenarios | Sí (POST) |
| API-TES-77 | GET/POST/PATCH | `/api/admin/tes/planned-items` | `tes.previsiones.crear` | Previsiones | Sí (POST) |
| API-TES-78 | GET/POST | `/api/admin/tes/commitments` (+ `/:id/release`) | `tes.compromisos.ver` / `tes.compromisos.liberar` | Compromisos | Sí |
| API-TES-79 | GET | `/api/admin/tes/payroll-batches` (+ `/:id`) | `tes.haberes.ejecutar` | Lotes de haberes (detalle con `tes.haberes.verDetalle`) | — |
| API-TES-80 | POST | `/api/admin/tes/payroll-batches/:id/{generate-files\|sent\|response\|reprocess\|void}` | `tes.haberes.ejecutar` | Acciones del lote | Sí |
| API-TES-81 | GET | `/api/admin/tes/reports/:reportKey` | `tes.informes.ver` | Ejecutar informe (formato por `Accept`) | — |
| API-TES-82 | GET/PUT | `/api/admin/tes/settings` | `tes.configuracion.configurar` | Parámetros (versionados T04) | Sí |
| API-TES-83 | POST | `/api/admin/tes/periods/:module/close` · `/reopen` | `tes.periodos.cerrar` | Cierre de períodos | Sí |
| API-TES-84 | GET | `/api/admin/tes/exceptions` | `tes.movimientos.ver` | Bandeja de excepciones | — |
| API-TES-85 | GET | `/api/tes/signatures/pending` · POST `/api/tes/signatures` | `tes.pagos.firmar` | PWA empleado: pendientes y firma | Sí (POST) |
| API-TES-86 | GET | `/api/tes/position` | `tes.posicion.ver` | PWA empleado: posición | — |
| API-TES-87 | GET | `/api/v1/ext/tes/position` · `/cash-flow` · `/movements` | `tes.posicion.ver` (token BI; antes alcance `tes.read`, que no es capability de T02; PA-TES-19) | APIs para terceros/BI (T10) sin datos de haberes individuales | — |

**Servicios internos (no HTTP; invocados por otros módulos, DEC-003):** `tes.registerReceivedInstrument({ kind: check|cardVoucher|withholding|transfer, ... })` (M07), `tes.voidReceivedInstrument` (M07, anulación de cobro), `tes.getAccountsForCollection` (M07), `tes.getProjectedReceivablesInput` (lectura a M07), `tes.requestPaymentExecution` (M12/M06/M07/M16, alternativa síncrona a eventos), `tes.getPaymentStatus` (M12, portal proveedor), `tes.getBalancesForAccounting` (M15).

## 12. Eventos y jobs

### 12.1 Eventos emitidos (outbox, misma transacción)

| EVT-ID | Evento | Cuándo | Consumidores |
|---|---|---|---|
| EVT-TES-01 | `tes.operation.posted` | Operación registrada | M15 (asiento), T10 |
| EVT-TES-02 | `tes.operation.voided` | Operación anulada | M15 (reversa) |
| EVT-TES-03 | `tes.account.created` / `tes.account.closed` | Alta/cierre de cuenta | M15, T10 |
| EVT-TES-04 | `tes.statement.imported` | Extracto importado | Job de conciliación |
| EVT-TES-05 | `tes.reconciliation.closed` / `tes.reconciliation.reopened` | Cierre/reapertura | M15 (conciliación contable) |
| EVT-TES-06 | `tes.statementLine.unidentified` | Crédito no identificado enviado | M07 (bandeja de identificación) |
| EVT-TES-07 | `tes.gatewayCredit.reconciled` | Acreditación de pasarela conciliada | M07 (cierre de conciliación comercial) |
| EVT-TES-08 | `tes.cashRemittance.accepted` / `tes.cashRemittance.observed` / `tes.cashRemittance.voided` | Rendición. Payload: `cashRemittanceId`, `treasuryHandoverId` (entrega de M07 que se recibe, CTR-DAT-64), `cashSessionId`, `legalEntityTotals[] { legalEntityId, countedTotal, operationId }`, `receivedBy`, `receivedAt`, `differences` (si `observed`), motivo (si `observed` o `voided`) | M07 (estado de caja y `receivedBy`/`receivedAt` de la entrega `treasuryHandoverId`), M15 |
| EVT-TES-09 | `tes.deposit.registered` / `tes.deposit.credited` | Depósito | M15 |
| EVT-TES-10 | `tes.thirdPartyCheck.stateChanged` / `tes.thirdPartyCheck.rejected` | Valores | M07 (ND al socio), M12 (rechazo entregado), M15 |
| EVT-TES-11 | `tes.ownCheck.issued` / `tes.ownCheck.debited` / `tes.ownCheck.voided` | Cheques propios | M15 (pendiente de débito), M12 |
| EVT-TES-12 | `tes.echeq.stateChanged` | eCheq | M12 (repudio), M07 |
| EVT-TES-13 | `tes.cardVoucher.presented` / `tes.cardSettlement.recorded` / `tes.cardVoucher.rejected` | Tarjetas | M12 (comprobante de gastos), M07 (rechazo), M15 |
| EVT-TES-14 | `tes.receivedWithholding.registered` / `tes.receivedWithholding.presented` / `tes.receivedWithholding.presentationVoided` | Retenciones recibidas | M06 (cómputo), M15 |
| EVT-TES-15 | `tes.paymentExecution.signed` / `tes.paymentExecution.executed` / `tes.paymentExecution.rejected` / `tes.paymentExecution.voided` | Pagos. Payload: `paymentExecutionId`, `kind`, `sourceRef { module, docId, docNumber }`, `netAmount`, `currency`, `instruments[] { instrument, accountId, amount, movementId }`, `executedAt` (en `.executed`), motivo (en `.rejected` y `.voided`); con `kind = agencyObligation`, además `taxObligation { taxObligationId, ownTaxObligationId, taxAgentRegistrationId, legalEntityId, tax, period }` (DEC-095) | M12 (OP), M06 (obligación pagada: pasa `taxObligations` a `paid`; con la obligación en `cancellationPending`, `.voided` la cierra como anulada y `.executed` la cierra con `creditBalanceAmount`, M06 RN-FIS-133 punto 9, 10-11-2026), M07 (reintegro ejecutado), M15 (M-51 o, con `ownTaxObligationId`, M-138 de RF-CON-163) |
| EVT-TES-16 | `tes.paymentFile.generated` / `tes.paymentFile.sent` / `tes.paymentFile.responseReceived` | Archivos | T06 (auditoría), M16 |
| EVT-TES-17 | `tes.payrollPayment.confirmed` / `tes.payrollPayment.rejected` | Haberes por empleado | M16 |
| EVT-TES-18 | `tes.cashClosing.closed` / `tes.cashClosing.reopened` | Cierre de caja de tesorería | M15 |
| EVT-TES-19 | `tes.exchangeRate.published` | Nueva cotización | M05, M07, M12, M15 |
| EVT-TES-20 | `tes.commitment.created` / `tes.commitment.consumed` / `tes.commitment.released` | Compromisos | M15 (presupuesto) |
| EVT-TES-21 | `tes.cashFlow.alertRaised` | Saldo proyectado bajo mínimo | T09 (notificación) |
| EVT-TES-22 | `tes.period.closed` / `tes.period.reopened` | Períodos | M15, T04 |
| EVT-TES-23 | `tes.advance.paid` | Adelanto de sueldo pagado (payload: `advanceId`, `employeeId`, `amount`, `paidAt`) | M16 (plan de descuento del adelanto, RN-SUE-049) |
| EVT-TES-24 | `tes.bankSync.requested` | Inicio de una corrida de sincronización Interbanking, programada (JOB-TES-04) o manual (`interbankingSyncRuns` en `running`, §8.16.11; payload: `interbankingSyncRunId`, `connectionId`, `treasuryAccountId`, `kind`, `dateSince`) | T06 (consulta saldos y movimientos; responde `int.bank.movementsReceived` / `int.bank.balancesReceived`, EVT-INT-12) |
| EVT-TES-25 | `tes.paymentFile.requested` | Archivo de pago generado para entrega por conector (`paymentFiles` en `generated`, JOB-TES-05, §8.10; payload: `paymentFileId`, `purpose`, `format`, `originTreasuryAccountId`, `executionDate`) | T06 (aplica el layout de Interbanking o del banco y lo entrega, FI-INT-59) |

### 12.2 Eventos consumidos

| Evento | Origen | Efecto en TES |
|---|---|---|
| `cob.cashSession.closed` | M07 | Crea rendición (P-TES-01) |
| `cob.cashSession.reopened` (EVT-COB-25) | M07 | Anula rendición no aceptada |
| `cob.receipt.voided` (EVT-COB-05) | M07 | Revierte instrumentos recibidos aún en caja/cartera |
| `cob.settlement.expected` (EVT-COB-11) | M07 | Registra neto a acreditar (RF-TES-134) |
| `cob.unidentified.resolved` (EVT-COB-26) | M07 | Concilia el crédito con el cobro |
| `cob.refund.approved` (EVT-COB-27) | M07 | Crea ejecución de reintegro |
| `cmp.paymentOrder.approved` / `cmp.paymentOrder.cancelled` | M12 | Crea / anula ejecución pendiente |
| `cmp.purchaseOrder.approved` / `cmp.purchaseOrder.cancelled` | M12 | Crea / libera compromiso |
| `cmp.supplierInvoice.registered` | M12 | Consume compromiso (devengado) y alimenta proyección |
| `fis.obligation.created` (EVT-FIS-13) | M06 | Crea ejecución de pago a organismo (`kind = agencyObligation`) con `sourceRef.docId` = obligación y `taxObligation` (incluido `ownTaxObligationId` si es propia; DEC-095, RF-TES-122); idempotente por obligación |
| `fis.obligation.cancelled` (EVT-FIS-26) | M06 | Anula la ejecución de pago a organismo de la obligación que todavía no se ejecutó (`pending`, `instrumented`, `partiallySigned`, `signed` → `voided`, motivo `taxObligationCancelled`); con `delivered` o `sentToBank` la marca con el aviso `taxObligationCancelled` en la bandeja de pagos del tesorero; nunca toca una `executed`. Idempotente por obligación (DEC-095, RF-TES-122; 10-11-2026). Lee `cancellationStatus`: actúa con `pendingPaymentReconciliation` (o con `final` si no hubo publicación previa para la obligación); el `final` posterior es idempotente por `{obligationId, cancellationStatus}`, no repite la anulación ni el aviso y muestra `creditBalanceAmount` si viene (M06 RN-FIS-133 punto 9; 10-11-2026, última ronda). *Reemplazado (10-11-2026, última ronda): "Idempotente por obligación".* |
| `fis.withholdingComputation.updated` (EVT-FIS-23) | M06 | Actualiza `fiscalComputation` |
| `sue.paymentRequest.created` / `sue.paymentRequest.cancelled` (EVT-SUE-17/27) | M16 | Crea / anula lote |
| `con.entry.posted` (EVT-CON-01) | M15 | Guarda `journalEntryId` |
| `con.period.closed` | M15 | Bloquea fechas |

### 12.3 Jobs

| JOB-ID | Nombre | Frecuencia | Descripción |
|---|---|---|---|
| JOB-TES-01 | `tes:recalcular-saldos` | Nocturno | Recalcula saldos desde movimientos y alerta diferencias con el materializado (AGR-011). |
| JOB-TES-02 | `tes:importar-extracto` | A demanda | Parseo, validación y alta de líneas. |
| JOB-TES-03 | `tes:conciliar-automatico` | Tras importación/sincronización y a demanda | Reglas de conciliación. |
| JOB-TES-04 | `tes:sincronizar-interbanking` | Diario (PRM-TES-058) | Cuentas, saldos y movimientos. |
| JOB-TES-05 | `tes:generar-archivo-pago` | A demanda | Archivo por formato. |
| JOB-TES-06 | `tes:procesar-respuesta-banco` | A demanda / al recibir | Aplica respuestas y rechazos por línea. |
| JOB-TES-07 | `tes:abrir-caja-pagos` | Diario 00:05 (si PRM-TES-040) | Apertura automática. |
| JOB-TES-08 | `tes:verificar-cajas-abiertas` | Diario 07:00 | Alertas de cajas y rendiciones pendientes. |
| JOB-TES-09 | `tes:actualizar-cotizaciones` | Diario (hora configurable) | Cotizaciones. |
| JOB-TES-10 | `tes:proyectar-flujo` | Nocturno y a demanda | Proyección base y snapshot. |
| JOB-TES-11 | `tes:alertas-vencimientos` | Diario | Valores por vencer, vencidos, eCheq por aceptar, cheques propios a debitar, depósitos no acreditados. |
| JOB-TES-12 | `tes:importar-liquidaciones-tarjeta` | A demanda (Extensión) | Liquidaciones de procesadores. |
| JOB-TES-13 | `tes:reconciliar-externos` | A demanda (recuperación, ESC-04) | Compara transmisiones y extractos con registros locales. |
| JOB-TES-14 | `tes:reintentar-eventos` | — | **Retirado.** Los reintentos de eventos consumidos los hace T01 (`deadLetters`) y los agotados van a la bandeja operativa de T11. Ver `deadLetters` de T01 (dueño). |

## 13. Integraciones

Marco general, adaptadores, bóveda de credenciales, reintentos y auditoría técnica: **T06 INT**. Particularidades de TES:

| Integración | Ficha | Dirección / medio | Particularidades funcionales |
|---|---|---|---|
| Interbanking — API de información financiera | FIC 11.1; RN-13 §16.1–16.3 | Entrante, API REST con token `client_credentials` y alcance `info-financiera`; cuentas, saldos, movimientos de días anteriores paginados | Token reutilizado hasta su vencimiento (7200 s) dentro de T06, nunca persistido en colecciones de negocio. Movimientos del día no se usan (solo "anteriores"). El header de identificación de aplicación ante Interbanking es propio de CoopApps (no se reutiliza el del proveedor de ProCoop). |
| Interbanking — archivos de pago | FIC 11.1; RN-13 §16.4 | Saliente, archivo para carga en banca electrónica | Formato cabecera `*U*` y detalle `*M*` (layout del proveedor, versionado en el adaptador). Transferencias por API: solo si PA-TES-02 lo habilita. |
| Extractos bancarios | FIC 11.2 | Entrante, archivo (CSV, Excel, TXT del banco) | Perfiles por banco; formatos de los bancos de la piloto a relevar (PA-TES-04). |
| Cotizaciones | FIC 11.3 | Entrante, web service ARCA (`FEParamGetCotizacion`) u otra fuente | Reutiliza la conexión WSAA del tenant de M06/T06. |
| eCheq | Nuevo (DFA M18) | Entrante/saliente, archivos o API del banco/Interbanking | Ver PA-TES-03. |
| Archivos de acreditación de haberes | RN-08 §12.5; RN-13 §16.4 | Saliente | Formatos por banco como adaptadores; parámetros de empresa por banco en `treasurySettings.payrollBankFormats[]`. |
| Liquidaciones de tarjetas | Nuevo | Entrante, archivo del adquirente | Extensión. |
| Lectora de cheques CMC-7 | INV `frmNuevoCheque.ctrlLectora1` | Hardware local vía agente (T06/M10 agente de hardware) | Opcional; O10 para el agente, O8 con carga manual. |

Hallazgos de seguridad de ProCoop que no se replican (RN-13 §17, aplicables a TES): credenciales y token de Interbanking en tabla sin cifrar → bóveda (RN-TES-075); SQL por concatenación (`ReemplazarCuit_cta`) → consultas parametrizadas (RN-TES-076); logs con encabezados de autorización → prohibido registrar secretos (RF-TES-060). Los demás hallazgos de RN-13 §17 (Pagos360, Macro, tótem PCI, ProvinciaNet, BancoSangre, SQL de pasarelas) pertenecen a M07/M18 y se registran allí.

## 14. Parámetros de configuración

Todos en `treasurySettings` (versionado y publicado por T04), ámbito tenant salvo indicación. Los parámetros ProCoop que guardaban una **cuenta contable** o un **concepto de compra** se migran como referencia a la regla contable de M15 o al concepto de M12, no como número suelto (RN-08 §13.2). "Sin lectura directa" = el parámetro existe en el catálogo de ProCoop pero no se encontró uso en el código analizado (RN-09).

| PRM-ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 #n |
|---|---|---|---|---|---|---|
| PRM-TES-001 | `tes.periods.banksClosedUntil` | fecha (en `modulePeriods`) | tenant | vacío | Fecha de cierre de Bancos | P502 |
| PRM-TES-002 | `tes.periods.treasuryClosedUntil` | fecha (en `modulePeriods`) | tenant | vacío | Fecha de cierre de Tesorería | P506 |
| PRM-TES-003 | `tes.checks.printTemplateKey` | texto (plantilla) | tenant / cuenta | `tes-cheque-estandar` | Informe para imprimir valores (cheques); la cuenta puede sobrescribir | P370 |
| PRM-TES-004 | `tes.cards.commissionConceptRef` | ref. concepto M12 | tenant | — | Concepto para comisiones en liquidación de tarjeta | P2046 |
| PRM-TES-005 | `tes.cards.commissionDiffVatConceptRef` | ref. concepto M12 | tenant | — | Concepto para comisiones con IVA diferencial | P813 |
| PRM-TES-006 | `tes.cards.exemptConceptRef` | ref. concepto M12 | tenant | — | Concepto para importe exento en liquidación | P490 |
| PRM-TES-007 | `tes.cards.taxesConceptRef` | ref. concepto M12 | tenant | — | Concepto para impuestos en liquidación (solo impuestos) | P498 |
| PRM-TES-008 | `tes.cards.rejection.defaultSellerRef` / `tes.cards.rejection.installmentTypeRef` | ref. M11 / M07 | tenant | — | Vendedor por defecto y tipo de cuota del anticipo en rechazo de cupones | P1008, P2409 |
| PRM-TES-009 | `tes.cards.rejection.conceptRef` / `tes.cards.rejection.formalDocument` | ref. concepto M05 / lógico | tenant | — / `true` | Concepto del rechazo; generar comprobante formal en rechazo de cupones | P3177, P3178 |
| PRM-TES-010 | `tes.currency.defaultInCash` | moneda ISO | tenant | `ARS` | Moneda por defecto en caja y tesorería | P186 |
| PRM-TES-011 | `tes.cards.allowSettlementWithoutCommission` | lógico | tenant | `false` | Permitir cobros de cupones sin comisiones | P2378 |
| PRM-TES-012 | `tes.cards.allowOtherBanksVouchers` | lógico | tenant | `false` | Permitir al cobrar cupones seleccionar cupones de otros bancos | P2454 (sin lectura directa) |
| PRM-TES-013 | `tes.cards.showExtraCheck` | lógico | tenant | `false` | Mostrar marca adicional en cobro de cupones [VERIFICAR significado] | P2732 (sin lectura directa) |
| PRM-TES-014 | `tes.withholdings.autoPresent` | lógico | tenant | `false` | Presentar retenciones automáticamente al aceptar rendición o al registrarlas | P2952 |
| PRM-TES-015 | `tes.exchange.allowCashOut` | lógico | tenant | `true` | Cambio de valores: permitir salida de efectivo | P2058 (sin lectura directa) |
| PRM-TES-016 | `tes.exchange.allowValuesOut` | lógico | tenant | `true` | Cambio de valores: permitir salida de valores | P2059 (sin lectura directa) |
| PRM-TES-017 | `tes.exchange.allowOwnChecksAndTransfersOut` | lógico | tenant | `false` | Cambio de valores: permitir salida de cheques propios y transferencias | P2060 (sin lectura directa) |
| PRM-TES-018 | `tes.exchange.allowCashIn` | lógico | tenant | `true` | Cambio de valores: permitir entrada de efectivo | P2061 (sin lectura directa) |
| PRM-TES-019 | `tes.exchange.allowValuesIn` | lógico | tenant | `true` | Cambio de valores: permitir entrada de valores | P2062 (sin lectura directa) |
| PRM-TES-020 | `tes.accounts.rejectedChecksAccountId` | ref. cuenta financiera | tenant | — | Cuenta de movimientos para cheques rechazados (obligatoria si se reciben cheques) | P2067 |
| PRM-TES-021 | `tes.checks.rejectedDelivered.exemptConceptRef` | ref. concepto M12 | tenant | — | Concepto para importe exento en cheques rechazados entregados (obligatorio) | P2384 |
| PRM-TES-022 | `tes.checks.rejectedDelivered.expenseConceptRef` | ref. concepto M12 | tenant | — | Concepto para gastos en cheques rechazados | P2517 |
| PRM-TES-023 | `tes.checks.rejectedDelivered.allowSelectPurchaseDoc` | lógico | tenant | `false` | Permitir seleccionar comprobante de compra en rechazo de valores entregados | P2516 (sin lectura directa) |
| PRM-TES-024 | `tes.checks.defaultInstrumentTypeId` | ref. `instrumentTypes` | tenant | Cheque común | Tipo de valor por defecto al cargar valores de terceros | P2486 (sin lectura directa) |
| PRM-TES-025 | `tes.checks.holidayPolicy` | enum `none`, `ask`, `require` | tenant | `none` | Validar feriados al cargar cheque propio o valores de terceros (ni preguntar ni exigir / preguntar / exigir) | P2456 (sin lectura directa) |
| PRM-TES-026 | `tes.checks.staleDays` | entero | tenant | 30 | Máxima cantidad de días para considerar vencido un cheque | P2536 (sin lectura directa) |
| PRM-TES-027 | `tes.payments.skipNonBusinessDayValidation` | lógico | tenant | `false` | No validar días no hábiles al cargar cheque propio o transferencia | P2604 (sin lectura directa) |
| PRM-TES-028 | `tes.remittance.requireAcceptance` | lógico | tenant | `true` | Exigir aceptación de tesorería para cada rendición (doble control) | Nuevo (PA-TES-06) |
| PRM-TES-029 | `tes.remittance.autoPresentDebitVouchers` | lógico | tenant | `true` | Presentar automáticamente cupones de débito al aceptar la rendición | Comportamiento fijo de ProCoop (`CerrarCaja` paso 4) |
| PRM-TES-030 | `tes.cashClosing.registerCapitalPayments` | lógico | — | — | **Descartado** en TES: el capital lo registra M17 (CTR-TES-15). Se lee solo para migración | P2543 |
| PRM-TES-031 | `tes.remittance.allowMultiDayCash` | lógico | tenant | `false` | Habilitar rendición/cierre de varios días (solo efectivo) | P2688 |
| PRM-TES-032 | `tes.accounts.instrumentExchangeAccountId` | ref. cuenta financiera | tenant | — | Cuenta de movimiento para cambio de valores | P2076 |
| PRM-TES-033 | `tes.deposits.clearingDays` | entero por tipo (`sameBank`, `otherBank`, `deferred`) | tenant / cuenta | 1 / 2 / 2 | Días hábiles para la fecha probable de acreditación | Nuevo (`FEPROACRE`) |
| PRM-TES-034 | `tes.categories.transferPaymentId` | ref. categoría | tenant | — | Categoría para pago con transferencias | P146 |
| PRM-TES-035 | `tes.categories.valuesDepositPaymentOutId` | ref. categoría | tenant | — | Categoría de depósito de valores en OP (salida) | P2066 |
| PRM-TES-036 | `tes.categories.thirdPartyValuesPaymentId` | ref. categoría | tenant | — | Categoría para pagos con valores de terceros | P2065 |
| PRM-TES-037 | `tes.categories.cashPaymentId` | ref. categoría | tenant | — | Categoría para pagos en efectivo | P2079 |
| PRM-TES-038 | `tes.payments.allowFutureTransferDate` | lógico | tenant | `false` | Permitir fechas posteriores en pagos con transferencia | P3044 |
| PRM-TES-039 | `tes.payments.transferIssueDateIsMovementDate` | lógico | tenant | `false` | Usar la fecha del movimiento como fecha de emisión en pagos con transferencia | P2433 |
| PRM-TES-040 | `tes.paymentCash.autoOpen` | lógico | tenant / sucursal | `false` | Abrir automáticamente la caja de pagos del día | P134 |
| PRM-TES-041 | `tes.paymentCash.maxCash` | decimal | tenant / sucursal | 0 (sin efectivo) | Tope de efectivo de la caja de pagos | P135 |
| PRM-TES-042 | `tes.paymentCash.allowOwnChecks` | lógico | tenant | `true` | Caja de pagos admite cheques | P2000 |
| PRM-TES-043 | `tes.paymentCash.allowValues` | lógico | tenant | `true` | Caja de pagos admite valores de terceros | P2001 |
| PRM-TES-044 | `tes.paymentCash.allowCash` | lógico | tenant | `true` | Caja de pagos admite efectivo | P2002 |
| PRM-TES-045 | `tes.paymentCash.allowTransfers` | lógico | tenant | `true` | Caja de pagos admite transferencias | P2004 |
| PRM-TES-046 | `tes.payments.fromCollectionCash` | lógico | tenant | `false` | Pago a proveedores desde caja de cobranza: el efectivo de la ejecución queda como salida pendiente para la caja | P144 (A validar PA-TES-12) |
| PRM-TES-047 | `tes.payments.cashFromBoxMaxAmount` | decimal | tenant | 0 (sin tope) | Importe máximo para pagos a proveedores por caja | P2025 |
| PRM-TES-048 | `tes.payments.signatureRules` | lista de reglas | tenant / cuenta | 1 firma | Reglas de firmas por monto y grupo | Nuevo (RN-08 §13.7; PA-TES-01) |
| PRM-TES-049 | `tes.payments.printedSigners` | lista de textos | tenant | vacío | Firmantes impresos en el comprobante/archivo exportado para el banco (reemplaza la lista separada por coma) | P2372 |
| PRM-TES-050 | `tes.paymentFiles.legacyOriginCbu` | texto (CBU) | — | — | Solo migración: CBU de origen de pagos a proveedores por Interbanking; en CoopApps el origen es la cuenta del lote | P2573 |
| PRM-TES-051 | `tes.categories.cashDepositId` | ref. categoría | tenant | — | Categoría de depósito de efectivo | P2063 (sin lectura directa) |
| PRM-TES-052 | `tes.categories.valuesDepositId` | ref. categoría | tenant | — | Categoría de depósito de valores | P2064 (sin lectura directa) |
| PRM-TES-053 | `tes.categories.exchangeOutId` | ref. categoría | tenant | — | Categoría de cambio de valores – egreso | P2074 (sin lectura directa) |
| PRM-TES-054 | `tes.categories.exchangeInId` | ref. categoría | tenant | — | Categoría de cambio de valores – ingreso | P2075 (sin lectura directa) |
| PRM-TES-055 | `tes.reconciliation.minMonthsForConciliationDate` | entero | tenant | 0 | Mínima cantidad de meses para la fecha de conciliación de cuentas bancarias [VERIFICAR semántica] | P2578 (sin lectura directa) |
| PRM-TES-056 | `tes.reconciliation.dateToleranceDays` | entero | tenant / cuenta | 3 | Tolerancia de fecha para emparejar | Nuevo |
| PRM-TES-057 | `tes.reconciliation.autoConfirmEnabled` | lógico | tenant | `false` | Permite que reglas marcadas confirmen sin intervención | Nuevo (PA-TES-05) |
| PRM-TES-058 | `tes.interbanking.syncTime` | hora | tenant | 06:30 | Hora de sincronización diaria | Nuevo (FIC 11.1 frecuencia diaria) |
| PRM-TES-059 | `tes.interbanking.lookbackDays` | entero | tenant | 3 | Días hacia atrás que se vuelven a consultar | Nuevo |
| PRM-TES-060 | `tes.segregation.signerCannotReconcile` | lógico | tenant | `false` | Quien firma un pago no puede conciliar su débito | Nuevo |
| PRM-TES-061 | `tes.approvals.exceptionalThreshold` | decimal | tenant | 0 (siempre) | Umbral para aprobar ingresos/egresos excepcionales | Nuevo |
| PRM-TES-062 | `tes.approvals.shortageThreshold` | decimal | tenant | 0 (siempre) | Umbral para aprobar quebrantos | Nuevo |
| PRM-TES-063 | `tes.cashFlow.horizonDays` | entero | tenant | 90 | Horizonte de proyección por defecto | Nuevo |
| PRM-TES-064 | `tes.cashFlow.minBalanceAlert` | decimal | tenant / cuenta | — | Saldo mínimo para alerta | Nuevo |
| PRM-TES-065 | `tes.cashFlow.hideEmployeePayments` | lógico | tenant | `true` | No mostrar facturas/pagos de empleados en previsiones salvo permiso | P2653 |
| PRM-TES-066 | `tes.cashFlow.collectibilityCurve` | lista (`ageFromDays`, `percent`, `delayDays`) | tenant / servicio | 100 % al vencimiento | Curva de cobrabilidad para proyectar cobros | Nuevo (PA-TES-14) |
| PRM-TES-067 | `tes.remittance.pendingAlertHours` | entero | tenant | 24 | Horas para alertar rendiciones no recibidas | Nuevo |
| PRM-TES-068 | `tes.exchangeRates.source` | enum `arca`, `bna`, `manual` | tenant | `arca` | Fuente de cotizaciones | Nuevo (FIC 11.3; PA-TES-09) |
| PRM-TES-069 | `tes.alerts.checksDueDays` | entero | tenant | 3 | Días de anticipación para alertar valores a depositar y cheques propios a debitar | Nuevo |
| PRM-TES-070 | `tes.payroll.originAccountId` | ref. cuenta financiera | tenant | — | Cuenta de origen por defecto para haberes (reemplaza el CBU de sueldos) | P2262 |
| PRM-TES-071 | `tes.payroll.bankFormats[].param2406` | texto/número | tenant / banco | — | Dato para archivo de acreditación bancaria [VERIFICAR significado por banco] | P2406 |
| PRM-TES-072 | `tes.payroll.bankFormats[].param2449` | texto/número | tenant / banco | — | Ídem [VERIFICAR] | P2449 |
| PRM-TES-073 | `tes.payroll.bankFormats[].param2671` | texto/número | tenant / banco | — | Ídem [VERIFICAR] | P2671 |
| PRM-TES-074 | `tes.payroll.bankFormats[].param2672` | texto/número | tenant / banco | — | Ídem [VERIFICAR] | P2672 |
| PRM-TES-075 | `tes.payroll.bankFormats[].param2944` | texto/número | tenant / banco | — | Ídem [VERIFICAR] | P2944 |
| PRM-TES-076 | `tes.payroll.bankFormats[].param326` | texto/número | tenant / banco | — | Ídem [VERIFICAR] | P326 |
| PRM-TES-077 | `tes.payroll.bnaUseEmployeeAssignedAccount` | lógico | tenant | `false` | Banco Nación: usar la cuenta bancaria asignada al empleado | P2468 |
| PRM-TES-078 | `tes.payroll.multipleAccountsPerEmployee` | lógico | tenant | `false` | Exportación bancaria por varias cuentas del empleado (`SU_EMP_CBU`) | P3129 |
| PRM-TES-079 | `tes.payroll.allowChangeTransferDate` | lógico | tenant | `false` | Permitir modificar fecha de transferencia de haberes (advierte efecto contable) | P2288 |
| PRM-TES-080 | `tes.closing.requireClosedCashBoxes` | lógico | tenant | `true` | Validar cajas cerradas antes del cierre de período y del asiento de cobranzas | P3100 |
| PRM-TES-081 | `tes.echeq.acceptanceAlertDays` | entero | tenant | 2 | Días para alertar eCheq recibidos pendientes de aceptación | Nuevo |
| PRM-TES-082 | `tes.reconciliation.requireStatementContinuity` | lógico | tenant | `true` | Exigir continuidad de saldos entre extractos para cerrar | Nuevo |

Parámetros de RN-08 §12.1 que **no** son de TES y se registran en su anexo: P2034 y P2538 (adelanto de sueldo → M16/M12), P2035 y P2017 (anticipos a proveedores → M12), P2201 y P2457 (permitir pago de facturas → M12). Cuentas contables por defecto vinculadas a tesorería (P2101 cierre de caja, P2118/P2119 créditos/débitos bancarios, P2120 retención IVA de cobro, P2121 tarjetas, P2122 valores en cartera, P2123/P2124 retenciones de cobro, P2136 retenciones en asiento de cobranza, P2148/P2149 pago a proveedores en efectivo/valores) → reglas contables de **M15** referenciadas por `accountingRuleKey` de las categorías y tipos de instrumento.

## 15. Reportes, indicadores y exportaciones

Todos con fecha de corte, universo y filtros declarados en el encabezado (AGR-022); exportación XLSX/CSV/PDF.

| Reporte / indicador | Fórmula y universo | Fecha de corte | RF |
|---|---|---|---|
| Planilla diaria | Por caja de tesorería: saldo anterior + Σ ingresos por tipo − Σ egresos por tipo = saldo final | Día de la planilla (fecha valor) | RF-TES-166 |
| Composición de cartera | Efectivo + valores en cartera + cupones en tesorería + retenciones en cartera + cupones presentados no cobrados | Fecha de consulta | RF-TES-167 |
| Disponibilidades | Cuentas con `includeInAvailability`: saldo operativo y contable; ME × última cotización ≤ fecha | Fecha de consulta | RF-TES-168 |
| En cajas sin rendir (línea de la posición y de disponibilidades) | Por caja de cobranza física de M07 (no `agencyVirtual` ni `digitalChannel`) con sesión `open`, `closing`, `closed` o `reopened`: teórico por medio y moneda si la sesión está abierta, declarado del arqueo si está cerrada; antigüedad = fecha de consulta − `businessDate`; ME × última cotización ≤ fecha. Fuente: `cob.service.getUnremittedCash` (RF-COB-195). No suma al disponible (RN-TES-001) | Fecha de consulta | RF-TES-145, RF-TES-168 (DEC-101) |
| Saldos de bancos y a futuro | Operativo (fecha valor) y contable (fecha emisión); a futuro con lo vencido en hoy | Fecha / rango | RF-TES-169 |
| Libro de bancos | Saldo inicial + movimientos no anulados ordenados por fecha elegida | Rango | RF-TES-170 |
| Cheques y transferencias no debitados | Cheques propios emitidos y transferencias de pagos sin conciliar, por semana de fecha de pago | Fecha de consulta | RF-TES-171 |
| Previsiones / flujo de fondos | §9.12 | Fecha base + horizonte | RF-TES-172 |
| Cupones por estado y cobranza de tarjetas | Conteo e importe por estado; retención SUSS = bruto − neto − comisión − IVA − impuestos − otras retenciones cuando no viene informada | Rango de cobro | RF-TES-173 |
| Listados de valores | Por estado y tipo de fecha | Rango | RF-TES-174 |
| Movimientos conciliados/no conciliados/por fecha de conciliación | — | Rango | RF-TES-175 |
| Depósitos a acreditar | Depósitos `registered` con fecha probable ≤ corte | Fecha | RF-TES-176 |
| Retenciones recibidas | Por tipo, agente, estado y cómputo | Rango | RF-TES-177 |
| Cajas abiertas y cerradas | Cobranza (M07), pagos y tesorería | Rango | RF-TES-178 |
| Gastos financieros | Σ por clase y cuenta | Rango | RF-TES-179 |
| Reporte de conciliación | Fórmula de RF-TES-036 con partidas y antigüedad | Fecha de corte | RF-TES-180 |
| Pagos pendientes de salida y diferidos | RN-TES-055, RN-TES-056 | Fecha | RF-TES-121 |
| Indicador: días de caja | Disponible ÷ promedio de egresos diarios de los últimos 90 días | Fecha | Nuevo |
| Indicador: antigüedad de partidas pendientes | Promedio y máximo de días de partidas sin conciliar por cuenta | Fecha | Nuevo |
| Indicador: tiempo de rendición | Promedio de horas entre cierre de caja (M07) y aceptación | Rango | Nuevo |
| Indicador: desvío del flujo | (real − proyectado) ÷ proyectado por semana | Snapshot vs real | RF-TES-155 |
| Indicador: bruto cobrado vs neto acreditado | Σ cobros por pasarelas (M07) vs Σ acreditaciones conciliadas; diferencia = comisiones + retenciones + pendientes | Rango | BASE §13 |
| Indicador: evolución de cobranza caja vs banco | Cobros por canal (dato de M07) vs acreditaciones | Rango | RN-08 §15.2 (indicadores de gestión, compartido con M15) |
| Comprometido / devengado / pagado | Por servicio/centro, sin sumar estados (AGR-028) | Rango | RF-TES-158 |

## 16. Casos de uso

### CU-21 (BASE) — Posición actual y proyectada tras una acreditación

- **Actor:** Tesorero. **Precondición:** BAN-DEMO-01 con ARS 100.000; acreditación neta ARS 7.840 confirmada (TX-DEMO-001, conciliada comercialmente por M07: bruto 8.000, comisión 160).
- **Flujo:** 1) El tesorero concilia la línea bancaria de 7.840 con el neto esperado de TX-DEMO-001 (RF-TES-043). 2) Registra/recibe la ejecución programada de un pago a proveedor de ARS 30.000 para el día siguiente (RF-TES-149). 3) Consulta PAN-TES-01.
- **Resultado:** saldo actual ARS 107.840; proyección ARS 77.840 (sin otros movimientos).
- **Excepción:** si el banco aún no acredita, los 7.840 figuran "a acreditar" y el disponible sigue en 100.000 (RN-TES-001).

### CU-TES-17 (antes CU-13; BASE §13, parte tesorería) — Conciliación de cobro por pasarela

M07 registra una sola vez el pago de 8.000 y la comisión 160; TES concilia los 7.840 netos contra el banco; una notificación repetida no crea otra acreditación esperada (idempotencia). Un contracargo posterior lo trata M07; si el banco debita, TES registra el débito y lo concilia contra el contracargo.

### CU-FIS-01 (BASE, paso 6) — Ingreso de retenciones al organismo

**Definición dueña:** M06 «CU-FIS-01 — Retención en un pago a proveedor». Aquí solo el tramo de tesorería.

M06 determina la obligación de 2.000; TES ejecuta el pago a organismo (VEP) como movimiento distinto del pago neto de 98.000 al proveedor (RF-TES-122). No se marca "Pagado" por generar el VEP: se confirma con el débito conciliado.

### CU-OPE-01 (BASE, parte tesorería) — Pago de la compra de módems

**Definición dueña:** M12 «CU-OPE-01 — Compra de módems por servicio». Aquí solo el tramo de tesorería.

OC-DEMO-002 (40.000) aprobada → compromiso de 40.000 (RF-TES-156). Factura registrada → compromiso consumido como devengado. OP aprobada → ejecución por transferencia → archivo → débito conciliado → `executed`; compromiso consumido como pagado.

### CU-CON-01 (BASE, parte tesorería) — Banco/Caja del cobro de Ana

**Definición dueña:** M15 «CU-CON-01 Resultado por servicio con costos comunes». Aquí solo el tramo de tesorería.

El cobro de 5.000 en caja ingresa a tesorería por la rendición aceptada y se deposita; la cuenta contable Banco/Caja de M15 se concilia con el saldo de TES (RF-TES-049).

### CU-SUE (BASE §104, paso 4) — Tesorería confirma la acreditación de haberes

Ver CU-TES-12.

### CU-TES-01 — Rendición de caja de cobranza y depósito (O5)

- **Actor:** Auxiliar de tesorería; Cajero (M07).
- **Precondición:** CAJA-DEMO-03 cerrada en M07 con efectivo declarado ARS 52.300 y una transferencia recibida de ARS 8.000.
- **Flujo:** recibe → cuenta 52.300 → acepta → efectivo a TES-CAJA-01; transferencia registrada en BAN-DEMO-01 pendiente de conciliación → arma depósito de 50.000 → al día siguiente concilia la acreditación.
- **Resultado:** TES-CAJA-01 queda con 2.300; BAN-DEMO-01 suma 58.000 al conciliar ambas líneas.
- **Excepción:** contado 52.200 → aceptar con diferencia: quebranto de egreso 100 con aprobación del supervisor; los cobros de los socios no cambian.

### CU-TES-02 — Importación de extracto y conciliación asistida (O5)

Extracto CSV de BAN-DEMO-01 con 6 líneas: acreditación de pasarela 7.840, depósito 50.000, transferencia recibida 8.000, comisión de mantenimiento 1.200, impuesto sobre débitos y créditos 300, crédito no identificado 4.000. Resultado: 3 emparejamientos automáticos sugeridos (referencias), 2 movimientos creados desde líneas (gasto financiero: mantenimiento e impuesto), 1 enviado a no identificados de M07; diferencia no explicada 0; se cierra la conciliación.

### CU-TES-03 — Sincronización Interbanking (O8)

El job diario trae saldos y movimientos; el saldo banco difiere del libro en 4.000 por un crédito aún no registrado; la línea aparece en PAN-TES-09; una segunda corrida no la duplica.

### CU-TES-04 — Pago a proveedor por transferencia con archivo Interbanking (O8)

OP-DEMO-010 (neto 98.000; retenciones 2.000 calculadas en M12/M06) → instrumentar transferencia desde BAN-DEMO-01 → firma de dos firmantes (regla > 50.000) → lote → archivo → carga en banca electrónica (acuse) → débito conciliado → `executed`; M12 marca la OP pagada.

### CU-TES-05 — Pago con cheque propio diferido y con eCheq (O8)

Pago de 30.000 con cheque físico n.º 00012345 a 30 días (estado `issued`; cuenta pendiente de débito); al debitarse, conciliación → `debited`. Variante eCheq: emitido → aceptado por el proveedor → presentado → debitado; si el proveedor repudia, el pago vuelve a pendiente en M12 y el cupo se libera.

### CU-TES-06 — Cheque de tercero: recepción, depósito y rechazo (O8)

Cheque CH-DEMO-001 de 15.000 recibido en caja → rendición → cartera → depósito → rechazo bancario: tipos 59 y 60 en BAN-DEMO-01 y cuenta de rechazados; evento a M07 que genera la ND al socio con gasto configurado; posterior recupero en efectivo (tipo 61).

### CU-TES-07 — Cupones: presentación y liquidación (O8)

10 cupones de crédito por 100.000 → presentación → liquidación: neto 95.890, comisión 3.000, IVA 630, retención IIBB 480; cuadre verificado; comprobante de gastos al procesador (M12); retención IIBB en cartera; línea bancaria conciliada.

### CU-TES-08 — Presentación de retenciones recibidas (O8)

Retenciones del mes (IIBB 480 de tarjeta, IIBB 1.200 de un gran usuario) → lote de presentación → M06 las computa en la DDJJ; intento simultáneo de otro usuario → rechazado por "ya fue presentada".

### CU-TES-09 — Caja de pagos en efectivo (O8)

Caja de pagos del día abierta automáticamente con tope 20.000; pago de 5.000 a un proveedor como salida pendiente; el cajero de pagos entrega con constancia; cierre con arqueo sin diferencias.

### CU-TES-10 — Cierre diario de caja de tesorería (O5)

Saldo inicial 2.300 + rendiciones 120.000 − depósitos 115.000 = teórico 7.300; contado 7.300; cierre sin diferencia; el día cerrado no admite movimientos.

### CU-TES-11 — Flujo de fondos y escenario de liquidez (O8)

Proyección a 30 días con cobros por vencimientos (curva 90 % a 10 días, 7 % a 40 días), pagos a proveedores, cheques diferidos, haberes y compromisos; alerta de saldo bajo mínimo el día 18; escenario "postergar pago de obra 15 días" elimina la alerta sin modificar datos reales.

### CU-TES-12 — Pago de haberes (O9)

M16 aprueba el lote de marzo (3 empleados ficticios, total 1.350.000; un empleado con dos cuentas 70/30) → TES genera archivo Banco Nación y archivo Interbanking → envío → un rechazo por CBU inválido → reproceso → débito conciliado → M16 marca recibos pagados.

### CU-TES-13 — Transferencia entre cuentas propias con tránsito (O5)

Transferencia de 200.000 de BAN-DEMO-01 a BAN-DEMO-02 con fecha valor distinta: 200.000 en tránsito; ninguna de las dos cuentas lo cuenta como disponible hasta la acreditación.

### CU-TES-14 — Cotización y saldo en dólares (O8)

Cuenta BAN-DEMO-USD con USD 1.000; cotización ARCA del día 1.000,00 (ficticia); disponibilidades muestran ARS 1.000.000 equivalente; al cierre de mes con cotización 1.050,00 se informa a M15 diferencia de cambio 50.000.

### CU-TES-15 — Reintegro a socio (O5)

M07 aprueba devolución de un excedente de 2.000 (ESC-01) → ejecución por transferencia → débito conciliado → M07 marca reintegro ejecutado. Reenviar la orden con la misma clave no genera otra transferencia (AGR-013).

### CU-TES-16 — Compromiso liberado (O8)

OC aprobada de 40.000 → compromiso; OC cancelada → compromiso liberado; la proyección deja de mostrarlo y no aparece ningún ingreso.

## 17. Criterios de aceptación y escenarios de prueba

| ID | Escenario | Resultado esperado |
|---|---|---|
| T-TES-01 | CU-21 completo | Saldo 107.840; proyección 77.840; sin acreditación, disponible 100.000 y 7.840 "a acreditar". |
| T-TES-02 | Reenvío de `cob.cashSession.closed` | Una sola rendición. |
| T-TES-03 | Aceptación de rendición que falla a mitad (error simulado) | Nada parcial; reintento exitoso con una sola operación. |
| T-TES-04 | Reimportar el mismo extracto | 0 líneas nuevas; mensaje de duplicados. |
| T-TES-05 | Extracto con saldo inicial discontinuo | No se puede cerrar la conciliación sin justificación. |
| T-TES-06 | Grupo N:M descuadrado en 0,01 | Rechazado. |
| T-TES-07 | Desconciliar un movimiento de un grupo de 3 | Se desconcilia el grupo completo. |
| T-TES-08 | Cargar cheque con mismo banco/sucursal/cuenta/número que uno depositado | Rechazado indicando estado. |
| T-TES-09 | Entregar a proveedor un cheque no habilitado | Rechazado. |
| T-TES-10 | Rechazo de cheque depositado | Tipos 59/60; evento a M07; disponibilidad reducida. |
| T-TES-11 | Rechazo de cheque entregado sin concepto exento configurado | Bloqueo previo con mensaje. |
| T-TES-12 | Emitir eCheq con número ya usado en la cuenta | Rechazado. |
| T-TES-13 | Imprimir rango de cheques no correlativo | Rechazado. |
| T-TES-14 | Liquidación de tarjeta que no cuadra | Rechazada salvo diferencia explicada. |
| T-TES-15 | Presentación concurrente de la misma retención | Una se rechaza "ya fue presentada". |
| T-TES-16 | Pago en efectivo sin caja de pagos y sin apertura automática | "No se encontró una caja habilitada". |
| T-TES-17 | Pago que supera el tope de caja | Rechazado. |
| T-TES-18 | Ejecución con Σ medios ≠ neto | No se guarda. |
| T-TES-19 | Firma por quien instrumentó | Rechazada (segregación). |
| T-TES-20 | Firma masiva con un pago sobre el tope del firmante | Ese pago rechazado con causa; los demás firmados con usuario y fecha. |
| T-TES-21 | Entregar pago no firmado | Rechazado. |
| T-TES-22 | Archivo generado y no enviado | Ejecución en `signed`; OP no figura pagada en M12. |
| T-TES-23 | Respuesta de banco con 1 rechazo de 10 líneas | 9 `executed`, 1 `rejected` reinstrumentable. |
| T-TES-24 | Anular pago con salida de caja | Bloqueado hasta anular la salida. |
| T-TES-25 | Movimiento con fecha en período cerrado | Rechazado `dict:tes.error.periodClosed`. |
| T-TES-26 | Cierre de período con una caja abierta | Bloqueado con la lista. |
| T-TES-27 | **Permiso negativo:** auxiliar sin `tes.conciliacion.cerrar` intenta cerrar | 403 problem+json con `requestId`. |
| T-TES-28 | **Permiso negativo:** usuario sin la cuenta X en su alcance lista movimientos | La cuenta X no aparece (ni por API ni exportación). |
| T-TES-29 | **Aislamiento de tenant:** token del tenant A consulta id de cuenta del tenant B | 404; sin filtración en logs ni métricas. |
| T-TES-30 | **Idempotencia:** dos POST de ejecución de reintegro con la misma `Idempotency-Key` | Una ejecución; la segunda respuesta devuelve la misma. |
| T-TES-31 | **Reintentos Interbanking:** fallo en página 3 de 5 | Reanuda en página 3; sin duplicados. |
| T-TES-32 | **Credenciales:** consultar conexión IB por API | El secreto nunca se devuelve; logs sin encabezados de autorización. |
| T-TES-33 | **Conciliación contable:** saldo de TES vs cuenta contable de M15 | Diferencias explicadas por corte o clasificación. |
| T-TES-34 | **ESC-01:** pago excedente de 2.000 | El excedente queda a favor o pendiente en M07; si se reintegra, TES ejecuta una vez. |
| T-TES-35 | **ESC-04:** restauración posterior a un archivo enviado | `tes:reconciliar-externos` detecta la transmisión y no reenvía. |
| T-TES-36 | **ESC-02/05:** no aplican directamente a TES (corrección de documentos y cambio de condiciones son de M05/M04); se verifica que una ND correctiva de M05 no altera movimientos de TES ya conciliados | Sin efecto en TES. |
| T-TES-37 | **ESC-03:** no aplica (técnica offline) | — |
| T-TES-38 | Proyección con previsión mensual de 10.000 enero–marzo | Tres apariciones. |
| T-TES-39 | Escenario de liquidez | Ningún movimiento ni compromiso creado. |
| T-TES-40 | Lote de haberes visto por tesorero sin `tes.haberes.verDetalle` | Solo totales. |
| T-TES-41 | Recalcular saldos nocturno | Saldo materializado = recalculado; si no, alerta. |
| T-TES-42 | Transferencia interna con fechas valor distintas | Importe en tránsito no suma a ninguna cuenta. |
| T-TES-43 | Cotización faltante para una cuenta USD | Usa la última ≤ fecha con advertencia; si no hay ninguna, bloquea. |
| T-TES-44 | Rendición observada | Vuelve a M07; caja de tesorería sin cambios. |
| T-TES-45 | Compromiso liberado al cancelar OC | Sin ingreso inventado. |

## 18. Datos de precarga de demostración (ficticios)

| Entidad | Valores |
|---|---|
| Tenant | TEN-001 "Cooperativa Demo Ltda." |
| Entidades | BCO-DEMO-A (código 999), BCO-DEMO-B (código 998); sucursales SUC-001 "Centro", SUC-002 "Norte" |
| Cuentas | BAN-DEMO-01 cuenta corriente ARS, saldo inicial 100.000 (BASE §21); BAN-DEMO-02 caja de ahorro ARS, 0; BAN-DEMO-USD cuenta en USD, 1.000; TES-CAJA-01 caja de tesorería sede central; CAJA-PAGOS-01 caja de pagos (tope 20.000); MOV-RECH-01 cuenta de rechazados; TRANS-01 tránsito |
| CBU | Ficticios con dígitos verificadores válidos, generados por script de precarga (no reales) |
| Firmantes | FIRM-A1 "Tesorero Demo" (grupo A, tope 500.000), FIRM-B1 "Presidente Demo" (grupo B); regla: > 50.000 requiere A + B |
| Categorías | Depósito de efectivo, Depósito de valores, Transferencia entre cuentas, Pago a proveedores – transferencia, Pago a proveedores – cheque, Pago a proveedores – efectivo, Gasto bancario – mantenimiento, Impuesto sobre débitos y créditos, Comisión de pasarela, Quebranto de caja, Ingreso excepcional |
| Rendición | CAJA-DEMO-03: efectivo 52.300, transferencia 8.000 |
| Acreditación | TX-DEMO-001: bruto 8.000, comisión 160, neto 7.840 |
| Compromiso | Pago a proveedor 30.000 para mañana (CU-21); OC-DEMO-002 40.000 |
| Valores | CH-DEMO-001 15.000 (BCO-DEMO-B, librador "Comercio Ejemplo SA", CUIT ficticia 30-00000000-0 marcada demo), CH-DEMO-002 25.000 diferido a 30 días |
| Chequera | CHQ-DEMO-01 BAN-DEMO-01 números 00012340–00012389; ECHQ-DEMO-01 cupo 20 |
| Tarjetas | TARJ-DEMO-CRED (crédito, requiere presentación; recargos 3 cuotas 5 %, 6 cuotas 10 %), TARJ-DEMO-DEB (débito, sin presentación) |
| Cupones | 10 cupones de 10.000 c/u |
| Retenciones | RET-REC-DEMO-001 IIBB 1.200 (agente "Gran Usuario Demo") |
| Monedas y cotizaciones | ARS (sistema), USD con cotizaciones ficticias 1.000,00 / 1.050,00 |
| Previsiones | Alquiler de depósito 10.000 mensual; seguro 30.000 trimestral |
| Lote de haberes | NOM-DEMO-03: 3 empleados ficticios, total 1.350.000 |
| Reglas de conciliación | "Mantenimiento de cuenta" (descripción contiene "MANT"), "Impuesto Ley 25.413" (código de operación configurable) |

## 19. Migración desde ProCoop

Ejecución por T07 (repetible, con tablas de mapeo de claves compuestas e IDs `MAX + 1`, RN-08 §13.11). Datos personales de la DEMO no se usan en ambientes de prueba.

| Origen ProCoop | Destino | Transformación | Validación de conciliación |
|---|---|---|---|
| `ENTFIN` | `financialInstitutions` (tenant) | Homologar con catálogo de plataforma por código BCRA | Toda cuenta y valor apunta a una entidad |
| `SUCENT` | `bankBranches` | — | Ídem |
| `BANKOS` | `treasuryAccounts` | `BIC` → `kind`; `SAL_INI` → movimiento de apertura; `SALDO` **no** se migra (se recalcula); `CTA_INTERBANKING` (JSON) → `interbanking`; `COD_CTA`/`CTA_PENDEB` → claves de regla M15 | Saldo recalculado a fecha de corte = `SALDO` de ProCoop (o diferencia explicada) |
| `CAT_BANC`, `CATB_MOVS` | `treasuryCategories` | `CTA_CONTA` → regla M15 | Toda categoría usada en movimientos existe |
| `CONTES` | `treasuryConcepts` | — | — |
| `TIP_VAL` | `instrumentTypes` | — | — |
| `VAL_ESTA` | enum de estados | Mapeo 1–10 | — |
| `CTASUCE` | `checkDrawerAccounts` | `RECIBIR` → `blocked` | — |
| `TESORE` | `treasuryMovements` (`book = treasury`) + `treasuryOperations` (por `COD_INT`) | `ENTRADA`/`SALIDA` → `direction`/`amount`; anulados (`ENTRADA + SALIDA = 0`) → `voided` | Σ por caja = saldo de cartera de ProCoop |
| `RESBAN` | `treasuryMovements` (`book = bank`) | `DEBE`/`HABER` → `direction` (HABER = ingreso); `DEBE_HIS`/`HABER_HIS` revisados por el defecto de signo (RN-TES-008) [VERIFICAR]; `CONCILIAC`, `FEC_CONC`, `USU_CONC` → `reconciliation` con grupo histórico 1:1 sintético | Σ por cuenta = saldo de ProCoop; cantidad de conciliados igual |
| `MOV_INTERBANKING` | `bankStatementLines` (`source = interbanking`) | Huella recalculada | Cantidad igual |
| `RESBAN_MOVINT` | `reconciliationMatches` | Grupo por `COD_CONC`; grupos descuadrados se marcan `legacyUnbalanced` para revisión | Lista de grupos descuadrados entregada al tesorero |
| `INTERBANKING` | `interbankingConnections` | Secretos → bóveda (carga manual por el tenant recomendada); `ACCESS_TOKEN`, `EXP_TOKEN`, `PASS_SISTEMA` **no se migran** | Prueba de conexión exitosa |
| `VALORES`, `VALORES1`, `VAL_MVTO` | `thirdPartyChecks`, `checkEvents` | Estados 1–10; duplicados detectados por RN-TES-028 se reportan | Σ en cartera = composición de cartera ProCoop |
| `CHEQUERAS` | `checkbooks` + `ownChecks` | Agrupar por `ID_CHEQUERA`; e-cheq número 0 → `number = 0` | Cheques no debitados coinciden con informe ProCoop |
| `TARJETAS`, `TARJETAS_RECARGO` | `cardPlans` de M07 (CTR-DAT-08; M14 solo lee) | — | — |
| `CUPONTAR` | `cardVouchers` | Estados por presentado/pagado/rechazado | Cupones por estado = informe ProCoop |
| `PAGOTAR` | `cardSettlements` | — | — |
| `RETENCIO` | `receivedWithholdings` | `TIP_RETE` 1–4; `PRESENTADO`/`FEC_SALIDA` → estado | Pendientes = informe ProCoop |
| `RETS_TIPO` | catálogo M06 | Referenciado | — |
| `CAJAPAGO` | `paymentCashSessions` | Una por fecha | — |
| `CAJAS`, `PLAN_CAJ`, `EFEC_OP`, `TRAN_OP` | `cashRemittances` (solo cajas con cierre; histórico aceptado) — las cajas son de M07 | Cierres históricos → rendiciones `accepted` | Σ rendido = Σ movimientos de cierre (tipos 3–9) |
| `PPAGOS` (firma, entrega, medios) | `paymentExecutions` (cabecera y `PPITEMS` → `paymentOrders` de M12, CTR-DAT-52) | `ID_PPAGO` en tabla de mapeo; `SALIDA_PEN` | OP con medios = ejecuciones `executed` |
| `PPAGOS_FIRMANTES` | `treasuryAccountSigners` | Vigencias | — |
| `PPAGOS_FIRMAS`, `FIRMASELECTRONICAS`, `FIRMASELECTRONICAS_DOCUMENTOS` | `paymentExecutions.signatures`; plantilla de comprobante | — | — |
| `TIP_MON` | `tenantCurrencySettings` | — | — |
| `COT_DOL` | `exchangeRates` (`source = manual` histórica) | — | — |
| `PREV_COM` | `plannedCashItems` | Periodicidad 1–5 | — |
| `SU_AUDIT_TRA_INTERBANKING` | `paymentFiles` (`purpose = payroll`) histórico | JSON de envío/respuesta → archivo en almacenamiento privado (sin datos sensibles fuera del tenant) | — |
| Parámetros TESORERÍA (33) y §12.1 | `treasurySettings` | Ver §14 | Reporte de parámetros sin equivalente |
| P502, P506 | `modulePeriods` | — | — |

Paralelo (O11): durante el paralelo con ProCoop, los saldos diarios por cuenta, la cartera y los cheques no debitados se comparan cada día; diferencias en bandeja de T07.

## 20. Contraposiciones resueltas

| CTR-ID | Fuentes | Conflicto | Resolución | Regla de prevalencia |
|---|---|---|---|---|
| CTR-TES-01 | RN-13 §16.3 vs INV `frmConciliacionInterbanking` | RN-13 afirma "no hay conciliación automática por reglas"; el inventario muestra `ConciliarAutomatico` y `btnConciliarAuto_Click` en la pantalla de conciliación Interbanking (probablemente emparejamiento simple en la capa de UI, no en `ReglasNegocio`). | CoopApps incluye conciliación automática por reglas con confirmación (RF-TES-037, RF-TES-048), sea cual fuere el alcance real de ProCoop. [VERIFICAR] en demo qué criterio usa el botón, solo para documentar. | 5 (DFA "conciliación asistida" como mejora) + 1–2 sin conflicto; el benchmark nunca reduce alcance |
| CTR-TES-02 | RN-13 §16 vs CAT `SU_AUDIT_TRA_INTERBANKING` | RN-13: "No hay transferencias por API"; CAT: tabla de transferencias de sueldos por Interbanking con `JSON_ENVIO`/`JSON_RESPUESTA`, que sugiere un envío por servicio. | Mecanismo base: archivo de pagos con registro de envío y respuesta (RF-TES-056…059); envío por API como adaptador opcional sujeto a PA-TES-02. | No resoluble por jerarquía (ambas son benchmark) → PA-TES-02 |
| CTR-TES-03 | RN-13 §16.4 (P2573 vs P2262); BASE §39.6 | ProCoop usa P2573 como CBU de origen de pagos a proveedores y P2262 (CBU de sueldos) para transferencias desde tesorería, lo que parece una inconsistencia. | El CBU de origen es siempre el de la cuenta propia elegida explícitamente en el lote (RN-TES-059); P2573 y P2262 solo se leen en migración (PRM-TES-050, PRM-TES-070). | 2 (BASE §39.6: Tesorería opera con "cuenta seleccionada explícitamente") |
| CTR-TES-04 | DFA M18 (tablas) vs CAT | DFA lista en Tesorería `BANCOS`, `BANKOS`, `Banco`, `BANCLA`, `TIPOBAN`, `MOV_TRH`; según CAT, `BANCOS` son entes de cobranza (M07), `BANCLA`/`TIPOBAN` son bandas de tarifación telefónica (M10) y `MOV_TRH` es trazabilidad de stock (M13). `Banco` no figura en CAT. | Se reasignan: `BANCOS` → M07; `BANCLA`, `TIPOBAN` → M10; `MOV_TRH` → M13; `Banco` → se asume alias/vista de `ENTFIN`/`BANKOS` [VERIFICAR] y se mapea a `financialInstitutions`. | 5 (CAT es el modelo de datos testigo, más preciso que la lista de DFA) |
| CTR-TES-05 | RN-08 §2.1/§13.6 vs AGR-011 | ProCoop usa dos libros (`TESORE` y `RESBAN`); RN-08 los considera razonables. | Una sola colección `treasuryMovements` con campo `book` y vistas "libro de bancos" / "libro de tesorería"; se conserva la semántica de dos libros sin duplicar estructuras. | 3 (AGR-011, única fuente del saldo) compatible con 5 |
| CTR-TES-06 | RN-08 §2.9 vs BASE §21/§75, DFA M18 | La conciliación de ProCoop es una marca por movimiento, sin cabecera ni saldo de extracto. | Conciliación con cabecera, fecha de corte, saldo de extracto, partidas pendientes y diferencia cero para cerrar (RF-TES-035, RF-TES-036, RF-TES-042). | 2 (BASE "Conciliar extractos", "conciliar caja y banco") |
| CTR-TES-07 | RN-08 §1.2 vs DEC-009 | ProCoop contabiliza tesorería en lote (Cierre automático por rango de fechas). | Asiento en línea por evento (RF-TES-031); el resumen diario, si se quiere, es agregación en M15. | 1 (DEC-009) |
| CTR-TES-08 | RN-08 §4.3 vs BASE SUE-013, guía §5 | Firma y entrega masiva sin validar permisos ni guardar usuario. | Permisos y registro de usuario/fecha en toda firma y entrega, individual o masiva; N firmantes por monto; segregación (RF-TES-117). | 2 (BASE SUE-013 separación de funciones) |
| CTR-TES-09 | RN-13 §17, CAT `INTERBANKING` vs DEC-001 | Credenciales y token de Interbanking en tabla sin cifrar. | Bóveda de credenciales por tenant; token no persistido en datos de negocio (RN-TES-075). | 1 (DEC-001, bóveda) |
| CTR-TES-10 | RN-08 §1.3 vs AGR-016, guía §5 | Claves compuestas de texto e IDs `MAX + 1` sin bloqueo. | ObjectId + talonarios atómicos + tablas de mapeo en migración (RN-TES-004). | 3 (AGR-016) y 4 (CNX) |
| CTR-TES-11 | RN-08 §2.4 vs §15.1 | §2.4 dice que el alta impide duplicar banco + sucursal + cuenta + número; §15.1 precisa que solo lo impide si el cheque está en cartera. | Se impide siempre salvo cheque anulado (RN-TES-028). | Mejora de control sobre defecto ProCoop (guía §3 punto 5) |
| CTR-TES-12 | RN-13 §16.3, RN-08 §15.1 vs AGR-011 | Grupos N:M de conciliación sin validar que los importes cuadren; desconciliar borra filas sueltas. | Cuadre obligatorio o diferencia explicada en el acto; desconciliación del grupo completo (RN-TES-061, RN-TES-062). | 3 (AGR-011: cada peso explicado) |
| CTR-TES-13 | RN-08 §15.1 (`GetDisponibilidades`, previsiones) vs BASE §21 | ProCoop mezcla en informes de disponibilidad y previsión importes en cartera, no depositados o no acreditados. | Posición con columnas separadas: disponible, en tránsito, a acreditar, cartera, proyectado (RN-TES-001). | 2 (BASE §21 "un cobro esperado no es disponibilidad") |
| CTR-TES-14 | RN-08 §2.2 (`clsCajas` en ReglasNegocio.Tesoreria) vs guía §5 (M07 incluye cajas) | En ProCoop el cierre de caja de cobranza vive en Tesorería y transfiere los fondos en el mismo acto. | M07 es dueño de la caja de cobranza y su cierre; TES es dueño de la rendición, su aceptación y la custodia posterior (doble control, PA-TES-06). | 1 (estructura de anexos del maestro, DEC-003 fronteras de módulos) |
| CTR-TES-15 | RN-08 §2.2 paso 6 (P2543) vs fronteras M17 | El cierre de caja registra pagos de capital social si P2543 está desactivado. | TES no registra capital; M17 consume el evento de cobro de M07 (RN-TES-020); P2543 solo se usa para interpretar datos migrados. | 1 (DEC-003, cada módulo dueño de su dato) |
| CTR-TES-16 | RN-08 §2.7 (`PresentarRetenciones`), P2952 vs BASE §52 | "Presentar" retenciones en ProCoop solo es sacarlas de la cartera; la BASE exige no marcar Presentado por exportar o emitir. | TES registra "Presentada a M06" (transferencia al cómputo); el estado fiscal real (`fiscalComputation`) lo informa M06 (RN-TES-047). La autopresentación queda como parámetro sujeto a PA-TES-11. | 2 (BASE §52) |
| CTR-TES-17 | RN-09 P2288 (advertencia "puede generar diferencias contables") vs DEC-009 | Modificar la fecha de transferencia de haberes desalinea tesorería y contabilidad. | Se permite solo con período abierto y con reemisión del evento contable (reversa + nuevo) (RF-TES-026, RF-TES-162). | 1 (DEC-009) |
| CTR-TES-18 | RN-08 §15.1 (defectos `DEBE_HIS`/`HABER_HIS` invertidos; `ConsultarCajas` con `AddYears` descartado; truncado silencioso de concepto/observación) vs guía §3 punto 5 | Defectos de ProCoop. | No se replican (RN-TES-006, RN-TES-008, RF-TES-110); la migración revisa los históricos afectados [VERIFICAR]. | 5 (deuda técnica → mejora) |
| CTR-TES-19 | RN-08 §4.4 y §15.6 vs guía §5 (nada se borra) y AGR-013 | Anular una OP que pagaba sueldos borra las facturas de sueldo; anular un pago de sueldos no revierte tesorería. | Toda anulación revierte con vínculo y sin borrado; anular un pago de haberes revierte los movimientos de TES (RF-TES-165, RN-TES-074). | 3 (AGR-013) y guía §5 |
| CTR-TES-20 | RN-08 §11.5 vs BASE §104 SUE-009 | ProCoop paga sueldos creando una factura de compra al empleado-proveedor y una OP estándar; BASE pide archivo de acreditación, órdenes de pago a tesorería y conciliación. | Lote de pago de haberes ejecutado directamente por TES, sin simular proveedores (RN-TES-072), sujeto a PA-TES-07. | 2 (BASE §104) con validación del solicitante |
| CTR-TES-21 | RN-08 §4.3 (firma en la OP) vs límite del encargo (la OP la origina M12) | En ProCoop la firma y entrega son atributos de la OP de Compras. | M12 aprueba la OP (obligación a pagar); TES firma (autorización de egreso de fondos con firmantes de la cuenta) y entrega (PA-TES-01). | 1 (fronteras de módulos) → PA-TES-01 para el detalle |
| CTR-TES-22 | RN-08 §12.1 P144 (pagar a proveedores desde caja de cobranza) vs BASE §78 (cobranza y tesorería como hitos distintos) | ProCoop permite que la caja de cobranza entregue efectivo de pagos a proveedores. | Por defecto los pagos en efectivo salen de la caja de pagos; pagar desde caja de cobranza queda como opción del tenant sujeta a PA-TES-12. | No resoluble por jerarquía → PA-TES-12 |
| CTR-TES-23 | RN-08 §2.6 (`CrearAnticipoRechazoCupones` crea anticipo al socio desde Tesorería) vs fronteras M07/M05 | Tesorería genera directamente deuda del socio. | TES publica el rechazo; M07/M05 generan el documento (anticipo o ND) según PA-TES-13 (RN-TES-045). | 1 (DEC-003) |
| CTR-TES-24 | Este anexo (`cardPlans` §7.27, `branchId` bancario, `branchOfficeId`, `bankAccountId`) vs T05 (CTR-DAT-08, §7.2) y DEC-064 | Colección duplicada con M07 y nombres de campo no canónicos; cuentas sin entidad jurídica. | `cardPlans` es de M07; `bankBranchId` para la sucursal bancaria, `branchId` (antes `branchOfficeId`) para la sucursal del tenant (T04), `treasuryAccountId` en liquidaciones de tarjeta; `legalEntityId` obligatorio en `treasuryAccounts` y `treasuryMovements`. | T05 (modelo canónico); DEC-064 |
| CTR-TES-25 | `cashRemittances` (M14) vs `treasuryHandovers` (M07), ambos con origen `CAJAS` | Dos registros del mismo traspaso. | Se conservan los dos: entrega (M07) y recepción (M14), vinculados por `treasuryHandoverId`. | CTR-DAT-64 |
| CTR-TES-26 | Documento externo `NucleoTransversal-Modelo` §11.1 (aporte A9: caja de cobranza como cuenta de fondos del libro único) vs frontera M07/M14 (CTR-TES-14, RN-DAT-003) | El documento pide ver en la posición diaria los fondos de cajas abiertas o sin rendir; en este anexo la caja de cobranza no es cuenta de M14 y la posición no los mostraba. | Se mantiene la frontera: la caja de cobranza sigue en M07 y entra al libro de M14 al aceptarse la rendición. La posición (RF-TES-145) y las disponibilidades (RF-TES-168) muestran una línea separada "en cajas sin rendir" leída del servicio de M07 (RF-COB-195), con detalle por caja y antigüedad, sin sumarla al disponible (RN-TES-001). | 1 (DEC-101) |
| CTR-TES-27 | DEC-095 (obligaciones y exenciones propias del tenant; M06 `ownTaxObligations`, M15 RF-CON-163 y M-138) vs RF-TES-122 y `paymentExecutions.sourceRef` | El pago a organismos citaba "impuestos propios" sin identificar la obligación de M06 que cancelaba, y EVT-TES-15 no declaraba payload: M06 no podía marcar la obligación pagada ni M15 distinguir el pago de una obligación propia (M-138) del de una como agente (M-51). | La ejecución `agencyObligation` guarda `sourceRef.docId` = `taxObligations._id` y el subdocumento `taxObligation` (`ownTaxObligationId` o `taxAgentRegistrationId`, entidad jurídica, impuesto, período); EVT-TES-15 lo publica (RF-TES-122, §7.36, §12). M14 no calcula ni decide la obligación. Desde el 10-11-2026 consume `fis.obligation.cancelled` (EVT-FIS-26) para anular la ejecución todavía no ejecutada de una obligación anulada (§8.9, §12.2). 10-11-2026 (última ronda; M06 RN-FIS-133 punto 9): M14 lee `cancellationStatus` de EVT-FIS-26 (`pendingPaymentReconciliation` y luego `final`, el segundo idempotente); el aviso al tesorero explica que si el pago se ejecuta M06 lo registra como saldo a favor (`creditBalanceAmount`); el resultado vuelve a M06 con EVT-TES-15 `.voided` o `.executed` (RF-TES-122, §8.9, §12.1, §12.2). Nota para T03: el texto base de `tes.paymentInbox.alert.taxObligationCancelled` (§10.9.14) lleva el saldo a favor solo en la nota; corresponde sumar al texto "Si se ejecutó, el importe queda como saldo a favor ante el organismo." | 1 (DEC-095) |

## 21. Preguntas abiertas

### PA-TES-01 — Firma de pagos: dónde y cuántos firmantes
- **Pregunta:** ¿La firma de los pagos se hace en Tesorería con N firmantes configurables por monto y cuenta, o se mantiene una única firma ligada a la OP como en ProCoop?
- **Contexto:** RN-08 §4.3 y §14 duda 6 (relación entre `PPAGOS.FIRMA`, `PPAGOS_FIRMANTES` y `FIRMASELECTRONICAS` no aclarada); BASE SUE-013 exige separación liquidador/aprobador/tesorero.
- **Opciones:**
  - A) M12 aprueba la OP; TES firma con N firmantes por monto y grupo (A + B) según la cuenta, y entrega **(Recomendada)** — segregación real y control bancario de firmas conjuntas.
  - B) Una sola firma por OP, en TES — más simple, menor control.
  - C) Firma en M12 como parte de la aprobación de la OP — mezcla obligación y egreso de fondos.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-TES-008, RF-TES-117, PRM-TES-048 (O8).

### PA-TES-02 — Alcance de Interbanking
- **Pregunta:** ¿Qué capacidades de Interbanking se implementan en O8?
- **Contexto:** RN-13 §16 (API solo de información, pagos por archivo) vs CAT `SU_AUDIT_TRA_INTERBANKING` (indicios de envío por servicio) (CTR-TES-02); RN-08 §14 duda 12 (cuántas cooperativas lo usan).
- **Opciones:**
  - A) API de información (cuentas, saldos, movimientos) + archivos de pago con registro de envío y respuesta; transferencias por API como adaptador posterior si Interbanking lo habilita para el tenant **(Recomendada)** — cubre ProCoop sin depender de un servicio no confirmado.
  - B) Solo archivos (extractos y pagos), sin API — menor costo, conciliación menos automática.
  - C) API de información y de pagos desde O8 — mayor automatización, requiere convenio y certificación.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-TES-051…060, RF-TES-161 (O8, O9).

### PA-TES-03 — Integración de eCheq
- **Pregunta:** ¿Cómo se integra el eCheq?
- **Contexto:** DFA M18 lo propone como mejora; ProCoop solo registra el número del e-cheq en la chequera (RN-08 §2.5). Cada banco ofrece canales distintos.
- **Opciones:**
  - A) Registro en CoopApps del ciclo completo con carga manual o importación de listados del banco, y adaptadores de API por banco/Interbanking cuando estén disponibles **(Recomendada)** — funciona desde el día uno con cualquier banco.
  - B) Integración directa por API con los bancos de la piloto desde O8 — más automático, depende de cada banco.
  - C) Solo registro manual del número (como ProCoop) — sin seguimiento de aceptación ni endosos.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-TES-085…090 (O8).

### PA-TES-04 — Formatos de extracto prioritarios
- **Pregunta:** ¿Qué formatos de extracto deben estar disponibles en O5 para la piloto?
- **Contexto:** FIC 11.2 (CSV, Excel o formato del banco); no se relevó qué bancos usa la piloto.
- **Opciones:**
  - A) Perfil genérico CSV/XLSX configurable + perfiles predefinidos de los dos bancos principales de la piloto **(Recomendada)** — cubre O5 sin esperar Interbanking.
  - B) Solo perfil genérico — el tenant configura todo.
  - C) Esperar a Interbanking (O8) — la piloto concilia a mano en O5.
- **Impacto si no se responde:** se asume A; requiere muestras anonimizadas de extractos.
- **Bloquea:** RF-TES-033 (O5).

### PA-TES-05 — Autoconfirmación de conciliaciones
- **Pregunta:** ¿Puede el sistema confirmar conciliaciones sin intervención humana?
- **Contexto:** DFA pide conciliación asistida; AGR-011 exige explicar cada peso.
- **Opciones:**
  - A) El sistema solo propone; el tenant puede habilitar autoconfirmación para reglas 1:1 con referencia exacta e importe exacto **(Recomendada)** — ahorro de tiempo con riesgo acotado.
  - B) Siempre confirmación humana — máximo control, más trabajo.
  - C) Autoconfirmar toda propuesta con puntaje alto — riesgo de errores silenciosos.
- **Impacto si no se responde:** se asume A con PRM-TES-057 en `false` por defecto.
- **Bloquea:** RF-TES-037 (O5).

### PA-TES-06 — Aceptación de rendiciones
- **Pregunta:** ¿La rendición de cada caja de cobranza requiere aceptación expresa de Tesorería?
- **Contexto:** En ProCoop el cierre de caja transfiere los fondos automáticamente (RN-08 §2.2); BASE §102.8 menciona procedimientos de arqueo; CTR-TES-14.
- **Opciones:**
  - A) Sí: M07 cierra y arquea; Tesorería recibe, cuenta y acepta u observa (doble control), configurable por tenant **(Recomendada)** — trazabilidad de faltantes y responsables.
  - B) No: el cierre de M07 transfiere automáticamente como ProCoop — más rápido, sin segundo control.
  - C) Aceptación solo para cajas con diferencias — control parcial.
- **Impacto si no se responde:** se asume A (PRM-TES-028 = `true`).
- **Bloquea:** RF-TES-126…129 (O5).

### PA-TES-07 — Pago de haberes
- **Pregunta:** ¿El pago de haberes se ejecuta como lote directo de Tesorería o replicando la OP de Compras al empleado como ProCoop?
- **Contexto:** RN-08 §11.5 (factura de compra ficticia al empleado + OP); BASE §104 SUE-009 (archivo bancario, órdenes a tesorería, conciliación); CTR-TES-20.
- **Opciones:**
  - A) Lote directo: M16 envía el lote aprobado y TES genera archivos, ejecuta y concilia **(Recomendada)** — sin proveedores ficticios, mejor confidencialidad.
  - B) Replicar el circuito ProCoop (factura y OP por empleado) — continuidad, pero contamina compras y libros.
  - C) Una OP global por el total del lote en M12 — intermedio, menos detalle por empleado.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-TES-160…165 (O9).

### PA-TES-08 — Compromisos de fondos y presupuesto
- **Pregunta:** ¿Cómo se reparten los compromisos entre Tesorería (M14) y Presupuesto (M15)?
- **Contexto:** AGR-028 (P2, "mantener este alcance como decisión explícita"); BASE §21.
- **Opciones:**
  - A) M15 es dueño del registro presupuestario (crédito, comprometido, devengado, pagado); TES es dueño del compromiso de fondos con fecha y cuenta esperadas; ambos se alimentan del mismo evento con un `commitmentRef` común **(Recomendada)** — cada módulo con su dato, sin doble cómputo.
  - B) Solo TES registra compromisos y M15 los lee — presupuesto depende de tesorería.
  - C) Sin compromisos en O8 (solo proyección por vencimientos) — más simple, se pierde AGR-028.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-TES-156…159 (O8).

### PA-TES-09 — Fuente de cotizaciones
- **Pregunta:** ¿De qué fuente se toman las cotizaciones de moneda extranjera?
- **Contexto:** FIC 11.3 (se puede tomar de ARCA); ProCoop guarda cotizaciones manuales (`COT_DOL`).
- **Opciones:**
  - A) ARCA (`FEParamGetCotizacion`) diaria, con carga manual aprobada como respaldo **(Recomendada)** — fuente oficial y la misma que usa la factura electrónica.
  - B) Banco Nación (cotización vendedor) — práctica contable habitual, requiere otra integración.
  - C) Solo carga manual — sin integración.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-TES-142 (O8).

### PA-TES-10 — Cuentas en moneda extranjera
- **Pregunta:** ¿Se admiten cuentas y movimientos en moneda extranjera en O8?
- **Contexto:** CAT `TIP_MON`, `COT_DOL`; RN-08 §15.1 (disponibilidades convierten ME); no hay evidencia de uso en la piloto.
- **Opciones:**
  - A) Sí, con valuación a cotización y diferencia de cambio informada a M15 **(Recomendada)** — cubre ProCoop.
  - B) Solo ARS en O8 y ME en una ola posterior — menor alcance inicial.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-TES-019, RF-TES-143 (O8).

### PA-TES-11 — Presentación automática de retenciones recibidas
- **Pregunta:** ¿Las retenciones recibidas se transfieren automáticamente al cómputo fiscal al aceptarse la rendición?
- **Contexto:** RN-09 P2952; CTR-TES-16.
- **Opciones:**
  - A) Configurable por tenant, desactivado por defecto: Tesorería verifica certificados y presenta por lote **(Recomendada)** — evita computar certificados no recibidos.
  - B) Siempre automática — menos trabajo, riesgo de cómputo sin certificado.
  - C) Siempre manual — sin opción.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-TES-106 (O8).

### PA-TES-12 — Pagos en efectivo desde caja de cobranza
- **Pregunta:** ¿Se permite pagar a proveedores con efectivo de una caja de cobranza?
- **Contexto:** RN-08 §4.2 (P144, P2025), §15.1 (`GetCajaCobranza_CajaPagos`); CTR-TES-22.
- **Opciones:**
  - A) No por defecto: los pagos en efectivo salen de la caja de pagos; el tenant puede habilitarlo con tope y registro de salida pendiente **(Recomendada)** — separa recaudación y pagos sin perder la práctica de ProCoop.
  - B) Prohibido siempre — más control, puede no reflejar la operatoria de cooperativas pequeñas.
  - C) Permitido sin tope como ProCoop — menor control.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-TES-108, RF-TES-109 (O8).

### PA-TES-13 — Efecto de un cupón rechazado sobre el socio
- **Pregunta:** ¿Qué documento se genera al socio cuando el procesador rechaza un cupón?
- **Contexto:** RN-08 §2.6 (anticipo/deuda), P3177/P3178 (comprobante formal opcional); CTR-TES-23.
- **Opciones:**
  - A) Nota de débito formal (M05/M07) que reabre la obligación cancelada, con gasto configurable **(Recomendada)** — trazable y fiscalmente consistente.
  - B) Anticipo/deuda informal como ProCoop — sin comprobante fiscal.
  - C) Revertir el recibo original — altera la historia (prohibido por guía §5 salvo reversa vinculada).
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-TES-098 (O8).

### PA-TES-14 — Método de proyección de cobros
- **Pregunta:** ¿Cómo se proyectan los cobros de cuenta corriente en el flujo de fondos?
- **Contexto:** DFA M18 (flujo desde vencimientos a cobrar); BASE §21 (un cobro esperado no es disponibilidad).
- **Opciones:**
  - A) Por vencimiento aplicando una curva de cobrabilidad configurable por servicio (calculable desde el historial) **(Recomendada)** — proyección realista.
  - B) 100 % al vencimiento — simple, sobreestima ingresos.
  - C) Solo lo ya cobrado o en tránsito — subestima, inútil para planificar.
- **Impacto si no se responde:** se asume A con curva inicial 100 % al vencimiento hasta calibrarla.
- **Bloquea:** RF-TES-146, PRM-TES-066 (O8).

### PA-TES-15 — Cheque de socio rechazado
- **Pregunta:** ¿Qué se hace con la deuda del socio cuando su cheque es rechazado?
- **Contexto:** RN-08 §15.1 (registro en cuenta de rechazados); BASE §13 (contracargo reabre obligación sin borrar el recibo).
- **Opciones:**
  - A) ND automática al socio por el importe más gastos bancarios configurables, con revisión previa del tesorero **(Recomendada)** — reabre la deuda de forma trazable y recupera costos.
  - B) ND solo por el importe, gastos a cargo de la cooperativa.
  - C) Gestión manual caso por caso.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-TES-069 (O8).

### PA-TES-16 — Alcance de Tesorería en O5 (piloto)
- **Pregunta:** ¿Qué parte de Tesorería debe estar operativa en O5 para cerrar el circuito de cobranza del piloto Internet?
- **Contexto:** Guía §7 (O5 cuenta corriente y cobranza; O8 tesorería); el encargo fija rendición, depósito y conciliación de cobranzas en O5.
- **Opciones:**
  - A) O5: cuentas, entidades, categorías, movimientos básicos, rendición y aceptación (efectivo y transferencias), caja de tesorería, depósito, extractos, conciliación asistida de depósitos y acreditaciones de pasarelas, reintegros; valores, cupones, retenciones, Interbanking y el resto en O8 **(Recomendada)** — mínimo suficiente si la piloto no cobra con cheques ni tarjeta en caja.
  - B) Igual que A, sumando cupones de tarjeta en O5 — si la piloto cobra con POS en caja.
  - C) Igual que A, sumando Interbanking en O5 — si la piloto ya lo usa.
- **Impacto si no se responde:** se asume A; M07 no habilitará cheques ni tarjetas en caja hasta O8.
- **Bloquea:** asignación de olas de §5 (O5/O8).
- **Estado:** Respondida (DEC-059): en O5 cuentas, rendición, depósitos, extractos y conciliación; en O8 valores, cupones de tarjeta, retenciones e Interbanking (opción A).

### PA-TES-17 — Diferencia de arqueo en una rendición con varias entidades jurídicas
- **Pregunta:** cuando una rendición de caja cubre cobros de varias entidades jurídicas (DEC-064, DEC-087) y el arqueo da diferencia, ¿a qué entidad se imputa?
- **Contexto:** RN-TES-086 exige una operación de tesorería por entidad; la diferencia de arqueo no tiene entidad propia.
- **Opciones:**
  - A) A la entidad que indique el receptor, con default la de mayor importe rendido, y asiento entre entidades si corresponde (M15 M-136) **(Recomendada)**.
  - B) Prorrateada por importe rendido de cada entidad.
  - C) Siempre a la entidad por defecto del tenant (T04 RF-CFG-134).
- **Impacto si no se responde:** se asume A; validar con el contador de la cooperativa piloto.
- **Bloquea:** RN-TES-086 (O5).
- **Estado:** Asumida la recomendada (DEC-072).

### PA-TES-18 — Estados de `cashFlowScenarios` (PA 19 del pendiente de cierre)
- **Pregunta:** ¿Se confirman los estados propuestos del escenario de flujo de fondos?
- **Contexto:** el §7.41 declaraba `status` sin valores; la corrección del 05-11-2026 propuso `draft`, `active`, `archived` con `[VERIFICAR]` (§8.16.10).
- **Opciones:**
  - A) Confirmar `draft` → `active` → `archived` (§8.16.10); un escenario archivado se copia para reutilizarlo **(Recomendada)**.
  - B) Sin estado: el escenario existe o se elimina.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §7.41, §8.16.10; CU-TES-11.
- **Estado:** Asumida la recomendada (DEC-072); se quitan los `[VERIFICAR]` de §8.16.10.

### PA-TES-19 - Residuales del 05-11-2026 (estados, referencias, nombres de campo, CU duplicado y capability de API)
- **Pregunta:** ¿Cómo se cierran los residuales de M14 que detectaron los entregables regenerados?
- **Contexto:** el índice de estados marcó máquinas sin estado inicial y `interbankingSyncRuns` y `checkEvents` con valores sin transiciones; el modelo entidad-relación dejó referencias sin destino; T05 nombra `originTreasuryAccountId`, `storedFileId`, `personId`, `legalEntityId` y `number` donde este §7 no los tenía o los llamaba distinto; el §16 usaba CU-13, que es de M07; API-TES-87 exigía el alcance `tes.read`, que no es capability de T02.
- **Opciones:**
  - A) Estado inicial explícito; tablas de §8.16.11 y §8.16.12; destinos y "no es referencia" en cada campo; nombres de T05 con "antes"; el caso de uso pasa a CU-TES-17 (antes CU-13); API-TES-87 exige `tes.posicion.ver` **(Recomendada)**.
  - B) Mantener el texto y resolver en los entregables.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §7.4, §7.8, §7.9, §7.15, §7.16, §7.22, §7.32, §7.42, §8, §15 (API-TES-87), §16.
- **Estado:** Asumida la recomendada (DEC-072). T05 debe expresar la unicidad de `bankStatementImports` sobre el hash de `storedFiles` (hoy `fileRef.hash`) y la de `payrollPaymentBatches` sobre `payrollRunId` (hoy `payrollRunRef`).
- **Sincronización (5-11-2026), Asumida (DEC-072):** `payrollPaymentBatches.originAccountId` pasa a `originTreasuryAccountId` (antes `originAccountId`), como `paymentFiles`; la clave de parámetro `tes.payroll.originAccountId` (PRM-TES-070) no cambia. El §3 cita los servicios internos de M06 `fis.service.calculateWithholdings`, `fis.service.confirmWithholdings` y `fis.service.cancelWithholdings` (M06 §11.1): los invoca M12 al preparar, aprobar o anular la OP; TES ejecuta el pago neto y no recalcula retenciones.
- **Eventos de solicitud para T06 (5-11-2026), Asumida (DEC-072):** M14 declara en §12.1 EVT-TES-24 `tes.bankSync.requested` (antes `tes.bank-sync.requested`) y EVT-TES-25 `tes.paymentFile.requested` (antes `tes.payment-file.requested`), que T06 §12 consumía sin que M14 los publicara; se publican al iniciar una `interbankingSyncRuns` y al generar un `paymentFiles`; payload mínimo con `interbankingSyncRunId` y `paymentFileId`; consumidor T06. T11 §12.4 registra los alias.

## 22. Trazabilidad

Rangos de RF por subsección de §5: 5.1 = 001–013; 5.2 = 014–032; 5.3 = 033–050; 5.4 = 051–060; 5.5 = 061–075; 5.6 = 076–084; 5.7 = 085–090; 5.8 = 091–100; 5.9 = 101–106; 5.10 = 107–112; 5.11 = 113–125; 5.12 = 126–135; 5.13 = 136–139; 5.14 = 140–144; 5.15 = 145–155; 5.16 = 156–159; 5.17 = 160–165; 5.18 = 166–182; 5.19 = 183–188.

### 22.1 BASE

| Requisito BASE | Destino en este anexo |
|---|---|
| §21 Objetivo / "Resultado esperado" (ver disponible, en tránsito, compromisos y posición proyectada) | §1; RF-TES-145, RF-TES-153; RN-TES-001 |
| §21 "Administrar cuentas financieras" | RF-TES-001…013; §7.3 |
| §21 "Registrar transferencias internas" (y excepción de tránsito) | RF-TES-022; RF-TES-132 |
| §21 "Relacionar cada movimiento con su origen" | RF-TES-017; §7.11 (`origin`) |
| §21 "Clasificar gastos financieros" | RF-TES-025, RF-TES-179 |
| §21 "Conciliar extractos" / "Identificar movimientos sin registrar" | RF-TES-033…050; P-TES de conciliación (§9) |
| §21 "Consultar posición diaria" | RF-TES-145; PAN-TES-01; línea "en cajas sin rendir" (DEC-101, CTR-TES-26) |
| §21 "Proyectar cobros y pagos" | RF-TES-146…148, RF-TES-152; PA-TES-14 |
| §21 "Programar obligaciones" | RF-TES-149 |
| §21 "Controlar vencimientos de instrumentos" | RF-TES-150; JOB de alertas (§12) |
| §21 "Elaborar escenarios de liquidez" | RF-TES-151; §7.41; PAN-TES-34 |
| §21 "Establecer autorizaciones" | RF-TES-024, RF-TES-028; §4 segregación |
| §21 Excepción "un cobro esperado no es disponibilidad" | RN-TES-001; CTR-TES-13 |
| §21 Compromisos ("qué compromisos podrían consumirlo") | RF-TES-156…159; PA-TES-08 |
| §21 Auditoría y notificaciones | RF-TES-184, RF-TES-186 |
| §21 CU-21 (100.000 + 7.840 = 107.840; proyección 77.840) | RF-TES-043, RF-TES-145; §16 CU-21 |
| §13 CU-13 (bruto 8.000, comisión 160, neto 7.840) | RF-TES-043, RF-TES-134; §16 CU-TES-17 (antes CU-13) |
| §39.6 Rol Tesorería (cuenta seleccionada explícitamente) | §4; RN-TES-059; CTR-TES-03 |
| §40.3 pasos 10–12 (acreditación y conciliación) | RF-TES-043, RF-TES-134 |
| §52 Interfaz Tesorería; CU-FIS-01 (neto 98.000 / retención 2.000) | RF-TES-122; RN-TES-047; RF-TES-059 ("no marcar Pagado por emitir"); §16 CU-FIS-01; CTR-TES-16 |
| §75 Conciliaciones y controles; CU-CON-01 | RF-TES-036, RF-TES-042, RF-TES-049, RF-TES-180; §16 CU-CON-01; CTR-TES-06 |
| §76 Pendiente "Conciliación y cuentas de control de caja y bancos" | RF-TES-049 |
| §78 OPE-004, circuito financiero integrado, CU-OPE-01 | RF-TES-113…125, RF-TES-126…135, RF-TES-152; §16 CU-OPE-01; CTR-TES-22 |
| §80 Indicadores | §15 |
| §98 Seguridad y auditoría | RF-TES-184; RN-TES-075, RN-TES-076; §13 hallazgos |
| §101 Calidad y pruebas | §17 (T-TES-01…45) |
| §102.6 ESC-01 y ESC-04 | §16 (CU de escenarios); §17 |
| §102.8 Agenda Caja/tesorería (procedimientos de arqueo) | RF-TES-127, RF-TES-136…139; PA-TES-06 |
| §104 SUE-009 (archivo de acreditación, órdenes a tesorería, conciliación) | RF-TES-160…165; PA-TES-07; CTR-TES-20 |
| §104 SUE-013 (separación de funciones) | §4; RF-TES-117; RN-TES-010; CTR-TES-08 |
| §105 Solución (ERP, pasarelas, APIs) | Encabezado; §13 |
| §106 Olas | Encabezado; columna Ola de §5; PA-TES-16 |

### 22.2 Acuerdos (AGR)

| AGR | Destino |
|---|---|
| AGR-011 (saldo derivado de movimientos; cada peso explicado) | §7.11 libro único; RN-TES-061; CTR-TES-05, CTR-TES-12 |
| AGR-012 | §7 (estructura de documentos y vínculos de origen); RF-TES-017 |
| AGR-013 (sin borrado; anulación por reversa vinculada) | RF-TES-120, RF-TES-165; RN-TES-074; CTR-TES-19 |
| AGR-016 (idempotencia, bandeja técnica) | RF-TES-183, RF-TES-060; RN-TES-004; CTR-TES-10 |
| AGR-028 (compromisos de fondos) | RF-TES-156…159; §7.40; PA-TES-08 |

### 22.3 DFA M18 (Tesorería) y REL

| Elemento | Destino |
|---|---|
| Bancos / cuentas propias | RF-TES-001…013 |
| Movimientos de tesorería y bancos | RF-TES-014…032 |
| Valores de terceros | RF-TES-061…075 |
| Cheques propios y chequeras | RF-TES-076…084 |
| Tarjetas y cupones | RF-TES-091…100 |
| Retenciones recibidas | RF-TES-101…106 |
| Cajas para pagos a proveedores | RF-TES-107…112 |
| Cierre de cajas | RF-TES-126…139 (rendición en TES; caja de cobranza en M07, CTR-TES-14) |
| Monedas y cotizaciones | RF-TES-140…144 |
| Informes | RF-TES-166…182; §15 |
| Mejora: importación de extractos con conciliación asistida | RF-TES-033…048; CTR-TES-01 |
| Mejora: eCheq | RF-TES-085…090; PA-TES-03 |
| Mejora: flujo de fondos proyectado desde vencimientos | RF-TES-145…155 |
| Mejora: Interbanking | RF-TES-051…060; PA-TES-02 |
| Tablas listadas en DFA: `BANKOS` | §7.3 |
| `BANCOS`, `BANCLA`, `TIPOBAN`, `MOV_TRH`, `Banco` | Reasignadas (CTR-TES-04): M07, M10, M10, M13, alias de `ENTFIN`/`BANKOS` [VERIFICAR] |
| REL §1 fila Tesorería (Cuentas Propias, Movimientos, Movimientos Bancarios, Valores de Terceros, Cheques Propios, Cupones de Tarjetas, Retenciones Recibidas, Cajas para Pagos a Proveedores, Cierre de Cajas, Informes) | PAN-TES-02, 06, 07, 14, 18, 22, 24, 25, 28/29, 36 (informes) |

### 22.4 RN-08 (reglas de negocio ProCoop)

| Sección | Destino |
|---|---|
| §1.1 Períodos (P502, P506) | RF-TES-027; RN-TES-009; PRM-TES-001, 002 |
| §1.2 Contabilización por lote | RF-TES-031; CTR-TES-07 |
| §1.3 Numeración `MAX + 1` y claves compuestas | RF-TES-016; RN-TES-004; CTR-TES-10; §19 |
| §1.4 Controles y permisos | RF-TES-028; RN-TES-010 |
| §2.1 Movimientos, tipos y medios | RF-TES-014…032; §7.10 |
| §2.2 Cierre de caja (`CerrarCaja` pasos 1–8) | RF-TES-126…135; RN-TES-020; CTR-TES-14, CTR-TES-15 |
| §2.3 Caja de pagos | RF-TES-107…112 |
| §2.4 Valores de terceros | RF-TES-061…075; CTR-TES-11 |
| §2.5 Cheques propios y e-cheq | RF-TES-076…090 |
| §2.6 Cupones y rechazo | RF-TES-091…100; RN-TES-045; CTR-TES-23 |
| §2.7 Retenciones recibidas | RF-TES-101…106; RN-TES-047; CTR-TES-16 |
| §2.8 Movimientos extraordinarios | RF-TES-014, RF-TES-024 |
| §2.9 Conciliación | RF-TES-035…050; CTR-TES-06 |
| §4.1–4.2 Pago a proveedores (medios, `SALIDA_PEN`, archivos) | RF-TES-113…116, RF-TES-109, RF-TES-056 |
| §4.3 Firma y entrega | RF-TES-117, RF-TES-118; CTR-TES-08, CTR-TES-21; PA-TES-01 |
| §4.4 Anulación de OP | RF-TES-112, RF-TES-120; RN-TES-054; CTR-TES-19 |
| §11.5 Pago de sueldos | RF-TES-160…165; RN-TES-072; CTR-TES-20 |
| §12.1 Parámetros de pagos | §14 (PRM-TES-034…050) y nota de parámetros de otros anexos |
| §12.5 Archivos bancarios de sueldos | RF-TES-161; PRM-TES-070…078 |
| §13 puntos 1–11 (mejoras propuestas) | 1 asiento en línea → RF-TES-031; 2 parámetros contables como reglas → §14 nota; 3 períodos unificados → RN-TES-009; 4 segregación → §4; 5 bóveda → RN-TES-075; 6 conciliación con extracto y e-cheq → RF-TES-035, RF-TES-086; 7 firmas conjuntas → RF-TES-008, PRM-TES-048; 8 auditoría → RF-TES-184; 9 posición separada → RN-TES-001; 10 idempotencia → RF-TES-183; 11 migración con mapeo → §19 |
| §14 duda 6 (firmas) | PA-TES-01 |
| §14 duda 12 (uso de Interbanking) | PA-TES-02 |
| §14 restantes dudas | No aplican a TES (corresponden a M07, M12, M15, M16) |
| §15.1 `clsMovimientos` / tesorería y bancos (alta, anulación, `NuevoNroTesoreria`, `GetLibroBancos`, `GetPlanillaDiaria`, `GetDisponibilidades`, `GetComposicionCartera`) | RF-TES-014…032, RF-TES-166…170; RN-TES-004…012 |
| §15.1 `clsValores` (`ValidarNuevoCheque`, `ValidarChequesRechazados`, `ModificarValor`, `MarcarPerPagPro`, `Registrar_Movimiento` rechazos) | RF-TES-061…075; RN-TES-028; RF-TES-069 |
| §15.1 `clsChequeras` (`GuardarChequeras`, `AnularCheque`, `DesmarcarCheque`, `SetRechazado`, `ReemplazarChequeEnOp`, `RecuperaCheque`) | RF-TES-076…084 |
| §15.1 `clsTarjetas`, `clsCupones` (`Presave`, `CobrarCupones`, `Crear_Anticipo`) | RF-TES-091…100; RN-TES-079 |
| §15.1 `clsRetenciones` | RF-TES-101…106 |
| §15.1 `clsCajaPago` (`ValidarAperturadeCajaAutomatica`, `GetSaldo_CajaPagos`, `GetCajaCobranza_CajaPagos`, `ConsultarCajas`) | RF-TES-107…111; CTR-TES-18 |
| §15.1 `clsConciliacion` (N:M, `EliminarConciliacion`) | RN-TES-061, RN-TES-062; CTR-TES-12 |
| §15.1 `clsTipMon` / cotizaciones | RF-TES-140…144 |
| §15.1 Previsiones (`GetPrevisiones_*`) | RF-TES-146…155; CTR-TES-13 |
| §15.1 Defectos (`DEBE_HIS`/`HABER_HIS`, truncado, `AddYears`) | RN-TES-006, RN-TES-008; RF-TES-110; CTR-TES-18 |
| §15.3 `clsPagoFacturas` (complementos: `GetMediosDePago`, salida pendiente, impresión) | RF-TES-109, RF-TES-114, RF-TES-124 |
| §15.3 Informes de pagos y previsiones (`GetPrevisionesCompras`, P2653) | RF-TES-147, RF-TES-154; RN-TES-070 |
| §15.6 `AnularPago` de sueldos | RF-TES-165; RN-TES-074 |
| §15.7 Permisos de sueldos (P2653, P3129) | RF-TES-154, RF-TES-164; PRM-TES-065, PRM-TES-078 |

### 22.5 RN-13 (integraciones) y FIC

| Elemento | Destino |
|---|---|
| RN-13 §16.1 Autenticación Interbanking (token `client_credentials`, 7200 s) | RF-TES-051, RF-TES-060; §13 |
| RN-13 §16.2 Consultas (cuentas, saldos, movimientos, `COD_IB`) | RF-TES-052…055, RF-TES-039 |
| RN-13 §16.3 Conciliación Interbanking (N:M, sin reglas) | RF-TES-037, RF-TES-048; CTR-TES-01, CTR-TES-12 |
| RN-13 §16.4 Archivos de pago (P2573, P2262) | RF-TES-056…059, RF-TES-161; CTR-TES-02, CTR-TES-03 |
| RN-13 §17 Credenciales sin cifrar | RN-TES-075; CTR-TES-09 |
| RN-13 §17 SQL por concatenación (`ReemplazarCuit_cta`) | RN-TES-076 |
| RN-13 §17 Logs con encabezados de autorización | RF-TES-060 |
| RN-13 §17 Datos de tarjeta | §7.28 (no se guardan PAN, vencimiento ni código) |
| RN-13 §17 Pagos360, Macro, tótem, ProvinciaNet, BancoSangre, SQL de pasarelas | No aplica a TES → M07/M18 (§13) |
| FIC 11.1 Interbanking (frecuencia diaria) | RF-TES-051…060; PRM-TES-058 |
| FIC 11.2 Extractos (CSV/Excel/formato banco) | RF-TES-033; PA-TES-04 |
| FIC 11.3 Cotizaciones ARCA | RF-TES-142; PRM-TES-068; PA-TES-09 |

### 22.6 CAT §16 (23 tablas) y tablas relacionadas

| Tabla | Destino |
|---|---|
| `BANKOS` | §7.3 `treasuryAccounts` |
| `CAJAPAGO` | §7.33 `paymentCashSessions` |
| `CATB_MOVS` | §7.5 (tipos permitidos por categoría) |
| `CAT_BANC` | §7.5 `treasuryCategories` |
| `CHEQUERAS` | §7.25 `checkbooks`, §7.26 `ownChecks` |
| `CONTES` | §7.6 `treasuryConcepts` |
| `COT_DOL` | §7.38 `exchangeRates` |
| `CTASUCE` | §7.8 `checkDrawerAccounts` |
| `ENTFIN` | §7.1 `financialInstitutions` |
| `INTERBANKING` | §7.19 `interbankingConnections` (secretos → bóveda) |
| `MOV_INTERBANKING` | §7.15 `bankStatementLines` |
| `PAGOTAR` | §7.30 `cardSettlements` |
| `PPAGOS` | §7.36 `paymentExecutions` (cabecera de OP → M12) |
| `PPAGOS_FIRMANTES` | §7.4 `treasuryAccountSigners` |
| `PPAGOS_FIRMAS` | §7.36 (`signatures`) |
| `PPITEMS` | M12 (ítems de la OP); TES referencia |
| `RESBAN` | §7.11 `treasuryMovements` (`book = bank`) |
| `RESBAN_MOVINT` | §7.17 `reconciliationMatches` |
| `SUCENT` | §7.2 `bankBranches` |
| `TESORE` | §7.9 `treasuryOperations`, §7.11 (`book = treasury`) |
| `TIP_MON` | §7.37 `tenantCurrencySettings` |
| `VAL_ESTA` | §8.4 (enum de estados) |
| `VAL_MVTO` | §7.24 `checkEvents` |
| `VALORES` (y `VALORES1`) | §7.23 `thirdPartyChecks` |
| `CUPONTAR` | §7.28 `cardVouchers` |
| `RETENCIO` | §7.31 `receivedWithholdings` |
| `RETS_TIPO` | Catálogo M06 (referenciado) |
| `TARJETAS`, `TARJETAS_RECARGO` | §7.27 `cardPlans` (dueño M07, CTR-DAT-08) |
| `TIP_VAL` | §7.7 `instrumentTypes` |
| `TRAN_OP`, `EFEC_OP` | §7.34 `cashRemittances` (detalle por medio); cajas en M07 |
| `CAJAS`, `PLAN_CAJ` | M07 (caja de cobranza); TES §7.34 rendición |
| `PREV_COM` | §7.39 `plannedCashItems` |
| `SU_AUDIT_TRA_INTERBANKING` | §7.22 `paymentFiles` (`purpose = payroll`) |
| `SU_EMP_CBU` | M16 (cuentas del empleado); TES las lee para RF-TES-161 |
| `FIRMASELECTRONICAS`, `FIRMASELECTRONICAS_DOCUMENTOS` | §7.36 (`signatures`) y plantilla de comprobante |
| `BANCOS` | M07 (entes de cobranza) — CTR-TES-04 |
| `BANCLA`, `TIPOBAN` | M10 (bandas de tarifación telefónica) — CTR-TES-04 |
| `MOV_TRH` | M13 (trazabilidad de stock) — CTR-TES-04 |

### 22.7 RN-09 parámetros TESORERÍA (33)

| Parámetro | PRM | Parámetro | PRM |
|---|---|---|---|
| P370 | PRM-TES-003 | P2378 | PRM-TES-011 |
| P490 | PRM-TES-006 | P2384 | PRM-TES-021 |
| P498 | PRM-TES-007 | P2454 | PRM-TES-012 |
| P813 | PRM-TES-005 | P2456 | PRM-TES-025 |
| P2046 | PRM-TES-004 | P2486 | PRM-TES-024 |
| P2058 | PRM-TES-015 | P2516 | PRM-TES-023 |
| P2059 | PRM-TES-016 | P2517 | PRM-TES-022 |
| P2060 | PRM-TES-017 | P2536 | PRM-TES-026 |
| P2061 | PRM-TES-018 | P2543 | PRM-TES-030 (descartado en TES; CTR-TES-15) |
| P2062 | PRM-TES-019 | P2578 | PRM-TES-055 |
| P2063 | PRM-TES-051 | P2604 | PRM-TES-027 |
| P2064 | PRM-TES-052 | P2688 | PRM-TES-031 |
| P2066 | PRM-TES-035 | P2732 | PRM-TES-013 |
| P2067 | PRM-TES-020 | P2952 | PRM-TES-014 (PA-TES-11) |
| P2074 | PRM-TES-053 | P3178 | PRM-TES-009 |
| P2075 | PRM-TES-054 | | |
| P2076 | PRM-TES-032 | | |
| P2288 | PRM-TES-079 (CTR-TES-17) | | |

Parámetros de otras secciones usados por TES (P134, P135, P144, P146, P186, P326, P502, P506, P1008, P2000–P2004, P2025, P2065, P2079, P2262, P2372, P2406, P2409, P2433, P2449, P2468, P2573, P2653, P2671, P2672, P2944, P3044, P3100, P3129, P3177): ver columna "Origen" de §14.

### 22.8 INV ProMod_Tesoreria (21 formularios y tipos auxiliares)

| Formulario | Destino |
|---|---|
| `Valores_ModoEdicion` | PAN-TES-14; RF-TES-061 |
| `abm_CajaPago` | PAN-TES-25; RF-TES-107 |
| `abm_Cat_Banc` | PAN-TES-05; RF-TES-004 |
| `abm_CtaSuce` | PAN-TES-16; RF-TES-007 |
| `abm_EntFin` | PAN-TES-04; RF-TES-003 |
| `abm_SucEnt` | PAN-TES-04; RF-TES-003 |
| `abm_Tarjetas` | PAN-TES-21; RF-TES-091 |
| `abm_Tarjetas_Recargo` | PAN-TES-21; RF-TES-091; RN-TES-079 |
| `abm_TipVal` | PAN-TES-31; RF-TES-006 |
| `frmApertura_Cierre_Cajas_Comprs` | PAN-TES-25; RF-TES-107, RF-TES-111 |
| `frmCargaCuponesSimple` | PAN-TES-22; RF-TES-092 |
| `frmCargaMedioDePago_Simple` | PAN-TES-06, PAN-TES-26 (componente de medio de pago); RF-TES-014, RF-TES-078, RF-TES-114 |
| `frmCargaRetenciones` | PAN-TES-24; RF-TES-101 |
| `frmConciliacion` | PAN-TES-09; RF-TES-036…042 |
| `frmConciliacionInterbanking` (`ConciliarAutomatico`, `btnCreditoDebitoBancario`) | PAN-TES-09; RF-TES-037, RF-TES-039; CTR-TES-01 |
| `frmNuevoCheque` (lectora CMC-7, `CalcularVAN`, rechazados, fecha futura) | PAN-TES-15; RF-TES-061, RF-TES-063, RF-TES-064, RF-TES-073 |
| `frmRechazarCupon` | PAN-TES-22; RF-TES-098 |
| `frmSaldosCuentasInterbanking` | PAN-TES-12; RF-TES-053 |
| `frmTesoreriaHandler` (anular, imprimir, valores para pago, modificar cheque, cheques propios, datos e impresión de OP, validar presentación de cupones) | PAN-TES-06, 14, 18, 22, 26; RF-TES-021, RF-TES-066, RF-TES-072, RF-TES-079…081 |
| `frmValores_Seleccion` | PAN-TES-14 (selector de valores en medios de pago y depósitos) |
| `frmWizardMovimientos` | PAN-TES-06 (asistente de operación), PAN-TES-17 (depósitos); RF-TES-014 |
| Enum `TipoRecargo` | RN-TES-079; §7.27 (`installmentSurcharges.surchargeType`) |
| `Properties.Resources` / `Settings` | Descartado (recursos de UI WinForms, sin regla funcional) |
| Tipos generados por compilador (`<>c`, clausuras) | Descartados (no funcionales) |
