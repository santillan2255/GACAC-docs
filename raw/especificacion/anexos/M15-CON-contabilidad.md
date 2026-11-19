# M15 CON — Contabilidad, centros de costo, múltiples planes de cuentas, escenarios simulados y presupuestos

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Estado | Especificación consolidada — pendiente de validar preguntas abiertas |
| Solución (BASE §105) | ERP |
| Olas | **O5** núcleo contable (configuración, plan de cuentas, ejercicios y períodos, centros de costo, motor de asientos automáticos para facturación y cobranza, asientos manuales, mayor y sumas y saldos, guarda de períodos para todos los módulos, exportación externa básica para el paralelo) · **O6** asientos de mora, intereses, convenios, previsiones, incobrables y prescripción · **O7** asientos de servicios medidos y compra de energía (reglas por servicio) · **O8** contabilidad completa (compras, stock, bienes de uso, tesorería y bancos, fiscal, fabricación, cierres de ejercicio, balances, estados contables INAES, ajuste por inflación, libros rubricados, múltiples planes, equivalencias, simulaciones, distribución de costos, conciliaciones completas, presupuestos y compromisos, anulación masiva y renumeración, importación/exportación externa completa) · **O8/O9** asientos de sueldos: en O8 desde la liquidación importada del liquidador externo y en O9 desde la liquidación propia de M16 (DEC-058) · **O10** asientos de capital social, excedentes y servicios sociales · **O11** reportes avanzados, BI y migración repetible |
| Dueño de datos | Configuración contable del tenant, planes de cuentas, rubros y subrubros contables, cuentas contables, roles de cuenta (cuentas por defecto), reglas de imputación, bandeja de eventos contables, asientos y renglones, plantillas de asiento, lotes de contabilización ("Cierre automático"), ejercicios, períodos y bloqueos por módulo, cuentas de resultado para cierre, centros de costo, grupos, reglas, modelos de centro de costo (`costCenterModels`, PA-CON-18) y modelos de asignación, corridas de distribución de costos, equivalencias entre planes, escenarios de simulación y sus movimientos simulados, presupuestos, líneas presupuestarias y compromisos, tablas e índices de inflación, corridas de ajuste por inflación, corridas de conciliación, libros rubricados, plantillas de estados contables y estados emitidos, mapeos y lotes de exportación/importación a sistemas contables externos, proyección de saldos |
| Fuentes consolidadas | BASE §22 (CU-22), §33 (glosario contable), §34 (escenarios 27, 40, 71, 74), §39.6, §40.3 paso 12, §42.6 (perfil Contable, MT-006), §55 (ERP-001 a ERP-003, CU-ERP-01), §57, §61 (contabilidad de retenciones), §75 (CON-001 a CON-005, CU-CON-01), §76, §78 (OPE-001 a OPE-004, CU-OPE-01), §87 (compra de energía y costos), §97.4, §97.7, §97.12, §98, §100 MER-006, MER-009, MER-011, §101, §102.5.3, §104 (SUE-010, SUE-014), §105, §106, §107 P-016; AGR-002, AGR-009, AGR-011, AGR-015, AGR-022, AGR-026, AGR-028, AGR-029; DFA Módulo 19 (líneas 890–927) y nota de etapas (líneas 1250–1253); FIC 18.2; RN-08 §1.1, §1.2, §1.3, §1.4, §5 (5.1–5.5), §6 (6.1–6.7), §9, §10.4, §11.5, §12.3, §13, §14, §15.2 y partes contables de §15.1, §15.3, §15.4, §15.6; RN-05 (registración bancaria por ente); RN-09 §2.1 (`TIP_CTRL = 6`), sección CONTABILIDAD (87 parámetros) y parámetros contables de TITULARES, COBRANZA, VENTAS_Y_FACTURACION, FINANCIACIONES, TECNICA, COMPRAS, TESORERIA, SUELDOS y VIVIENDA; CAT §17 (26 tablas), `BIENES_USO_CTSEC`, `RUBCAPI`, `ALI_IVA`, `RETS_TIPO`, `TIP_VAL`, `TIPO_FAC`, `CAT_INCI`, `GRPOBRA`, `RUB_PYS`, `BANKOS`, `CAT_BANC`, `SU_ASIENTOS`, `SU_CONCEPTOS`, `SU_SINDICATO`, `CAPITAL`, `CAPITAL_RES`, `BIENES_USO_AMORT`, `CAT_INAES` (CAT §24); INV `ProMod_Contabilidad.md` (24 formularios y tipos auxiliares); CNX (layouts AdminShell, DataTable, ExcelImportWizard, permisos) |


> **Norma de implementación (DEC-111, DEC-112, DEC-110, DEC-113).** Construcción GoodApps: **.NET 10**, **ASP.NET Core**, **EF Core**, **Azure SQL** (base compartida, `TenantId` en tablas de negocio), front **React 19**, **Microsoft Azure** (Container Apps, Blob, Queue, Key Vault, Application Insights), identidad **OpenIddict**. Modelo físico: `07-modelo-relacional-azure-sql.md` y `07-catalogo-tablas-sql.md`. Checklist e impacto: `06-impacto-adaptacion-stack-goodapps.md` (**DIR-13**).
>
> **Lectura:** «colección» en este anexo = **entidad lógica**; tablas, columnas y FK en `07-*`. RF/RN/CU del anexo **no cambian** por el stack.


## 1. Objetivo

Registrar, explicar y exponer el efecto económico de **todas** las operaciones de cada cooperativa (tenant), de modo que:

1. Cada evento económico de cualquier módulo (facturación, cobranza, pagos, compras, stock, bienes de uso, sueldos, mora e intereses, financiaciones, capital social, tesorería, fiscal, fabricación, vivienda y obras, ajustes) genere su asiento en partida doble **una sola vez**, con reglas de imputación configurables por servicio, concepto, medio de pago, centro de costo y demás dimensiones, en tiempo real o mediante un resumen diario que reemplaza el "Cierre automático" de ProCoop sin sus defectos (DEC-009, BASE §22, §75; RN-08 §6, §13.1).
2. La contabilidad pueda reconciliarse siempre con los auxiliares comerciales (cuenta corriente por asociado y servicio), financieros (caja, bancos, valores), de proveedores, fiscales, de stock, de bienes de uso, de sueldos y de capital, y se pueda recorrer desde un informe hasta el asiento, el documento y la operación de origen, y en sentido inverso (BASE §22, §75, §78; AGR-011).
3. Cada cooperativa administre su plan de cuentas, sus ejercicios y períodos con bloqueo y reapertura controlada, sus centros de costo (secciones) con asignaciones, grupos y distribución de costos comunes, y obtenga mayor, sumas y saldos, balances, estados contables en formato INAES, estado de resultados por sección, ajuste por inflación y libros para rubricar (DFA M19; RN-08 §5).
4. Se puedan mantener **varios planes de cuentas** por cooperativa con equivalencias y **escenarios simulados** completamente separados de los registros oficiales (BASE §55, §75).
5. Se presupueste por cuenta, centro de costo y servicio, se controlen los compromisos de fondos y se compare presupuesto, comprometido, devengado y pagado sin mezclarlos (AGR-028).
6. El capital social y los excedentes cooperativos tengan su tratamiento contable diferenciado del precio de los servicios, en coordinación con M17 (BASE §97.7, MER-011, AGR-029).

DEC-009 fija la secuencia: el **núcleo contable** (plan de cuentas, ejercicios, centros de costo y motor de asientos automáticos) se construye en **O5**, junto con la cuenta corriente y la cobranza; los reportes completos, los cierres, los estados INAES, los planes múltiples y las simulaciones se completan en **O8**.

## 2. Límite y responsabilidades

### 2.1 Qué hace este módulo

- Es **dueño del asiento y del plan de cuentas**: ningún otro módulo escribe asientos ni elige cuentas contables. Los módulos emiten **eventos económicos** con importes clasificados y dimensiones; CON resuelve las cuentas con sus reglas y registra el asiento (AGR-002; BASE §102.5.1).
- Administra planes, cuentas, rubros, roles de cuenta, reglas de imputación, centros de costo, ejercicios, períodos y bloqueos por módulo.
- Provee el servicio de **guarda de períodos** (`periodGuard`) que todos los módulos consultan antes de registrar una operación con fecha (reemplaza las 11 fechas de cierre por módulo y P2528 de ProCoop; RN-08 §1.1, §13.3).
- Genera asientos manuales, automáticos, de ajuste, de cierre, de apertura, de ajuste por inflación, importados y de reversión; los asientos simulados viven en colecciones separadas.
- Concilia los auxiliares de otros módulos con sus cuentas de control y explica las diferencias.
- Emite libros, balances, estados contables, reportes contables y de gestión contable.
- Administra presupuestos y compromisos, y su ejecución.
- Exporta e importa asientos con sistemas contables externos.

### 2.2 Qué NO hace

- No emite comprobantes, no confirma cobros, no recibe mercadería, no paga, no liquida sueldos, no calcula tarifas, impuestos, intereses de mora, amortizaciones ni costos de stock: **recibe** esos importes ya calculados en los eventos de los módulos dueños (BASE §22 "no sustituye aprobación comercial, confirmación de cobros ni recepción física").
- No es dueño del auxiliar de cuenta corriente del asociado (M07 COB), del de proveedores (M12 CMP), de caja/bancos/valores (M14 TES), del registro de bienes de uso ni de la valorización de stock (M13 STK), del registro de capital por asociado (M17 INS) ni de los libros IVA y regímenes informativos (M06 FIS). Los consulta para conciliar.
- No convierte resultados simulados en asientos reales (BASE §55).
- No es el motor de workflow (T11 WFL), ni de reportes genéricos/BI (T10 BIA), ni de exportadores genéricos (T06 INT): los usa.

### 2.3 Qué delega y a quién

| Tema | Delegado a | Qué recibe CON |
|---|---|---|
| Documentos de venta, NC, ND, anulación, grupos de facturación | M05 FAC | Eventos `fac.*` con importes por concepto, servicio, alícuota, percepción, tasa de terceros, capital |
| Imputación de pagos, saldos a favor, no identificados, devoluciones, contracargos, conciliación de entes | M07 COB | Eventos `cob.*` con medio, caja, ente, grupo contable, imputación por servicio |
| Intereses de mora, recargos, convenios, cuotas, incobrables, prescripción, gestión judicial | M08 MOR | Eventos `mor.*` con capital, intereses, IVA a devengar |
| IVA, percepciones, retenciones, liquidaciones de impuestos y terceros | M06 FIS | Eventos `fis.*` con DDJJ y pagos |
| Compras, recepciones, facturas de proveedor, órdenes de pago, retenciones practicadas | M12 CMP | Eventos `cmp.*`; compromisos al aprobar OC |
| Stock, costo, vales, OT/OM, comodato, revaluación, bienes de uso, amortización, fabricación, RMA | M13 STK | Eventos `stk.*` con costo ya valuado |
| Caja central, bancos, valores, tarjetas, transferencias, préstamos | M14 TES | Eventos `tes.*` |
| Liquidación de sueldos, contribuciones, pagos | M16 SUE | Eventos `sue.*` con conceptos, sindicato, empresa, centro |
| Capital social, excedentes, retornos, reembolsos, libro de asociados, categorías INAES | M17 INS | Eventos `ins.*`; catálogo `inaesCategories` |
| Vivienda, sepelio, salud, obras de vivienda | M18 SOC | Eventos `soc.*` (vía FAC/STK cuando corresponda) |
| Órdenes técnicas, obras, incidentes | M10 TEC | Costos vía `stk.*` y `tec.construction.*` |
| Aprobaciones (ajustes, reaperturas, excesos presupuestarios) | T11 WFL | Resultado de la aprobación |
| Indicadores de gestión no contables (servicios conectados, productividad de cajas, etc.) | T10 BIA | Definiciones de saldos contables certificados |
| Layouts de exportación (externo, reguladores) | T06 INT | Datos contables |
| Migración desde ProCoop | T07 MIG | Reglas de transformación de este anexo |
| Parámetros versionados y publicación | T04 CFG | Versionado de reglas y roles |

## 3. Glosario del módulo

| Término | Definición | Clave de diccionario | Término ProCoop equivalente |
|---|---|---|---|
| Plan de cuentas | Estructura de clasificación contable de una cooperativa; admite versiones y alternativas (BASE §33, §55). | `dict:con.chart` | Plan de cuentas (`CTPLAN`) |
| Plan operativo | Único plan oficial con el que se registran los libros de un ejercicio. | `dict:con.chart.operative` | — (ProCoop tiene un solo plan) |
| Plan alternativo | Plan analítico que representa los mismos hechos mediante equivalencias, sin libros propios. | `dict:con.chart.alternative` | — |
| Plan de simulación | Plan usado solo en escenarios. | `dict:con.chart.simulation` | — |
| Plan regulatorio | Plan o plantilla para informar a un organismo (INAES, regulador) por equivalencias. | `dict:con.chart.regulatory` | Mapeo FEDECOBA/SUBCUENTA |
| Cuenta contable | Clasificación imputable o agrupadora dentro de un plan; su identidad incluye el plan (BASE §33, §75). | `dict:con.account` | Cuenta (`COD_CTA`, 11 dígitos) |
| Cuenta imputable | Cuenta que admite movimientos. | `dict:con.account.postable` | Imputable = "S" |
| Cuenta agrupadora | Cuenta padre que solo totaliza. | `dict:con.account.group` | Cuenta no imputable |
| Cuenta ajustable | Cuenta no monetaria alcanzada por el ajuste por inflación. | `dict:con.account.adjustable` | `AJU_CTA` |
| Naturaleza | Activo, pasivo, patrimonio neto, ingresos, egresos, orden. | `dict:con.account.nature` | Prefijos P514, P508, P509, P510, P511, P512 |
| Rubro contable | Agrupación de exposición (ej. Disponibilidades, Créditos por servicios). | `dict:con.rubric` | `CTSRUBROS` |
| Subrubro contable | Nivel inferior del rubro. | `dict:con.subrubric` | `CTPLAN_SUBRUBROS` |
| Rol de cuenta | Cuenta por defecto tipada para un propósito del motor (ej. IVA débito fiscal). | `dict:con.accountRole` | Parámetros-cuenta P513, P2101–P2167, P3141 (`TipoCuenta`) |
| Regla de imputación | Regla versionada que asigna cuenta (y centro) a un rol de importe según condiciones. | `dict:con.postingRule` | `CTCUENTA_ASIGNA`, `SISCONT`, cuentas en entidades |
| Evento económico | Hecho de otro módulo con efecto contable, recibido en la bandeja de CON. | `dict:con.accountingEvent` | Movimiento leído por rango de fechas |
| Asiento | Registro en partida doble con cabecera y renglones. | `dict:con.entry` | `CTASIEN` + `CTITASIE` |
| Renglón | Línea de debe o haber de un asiento. | `dict:con.entryLine` | `CTITASIE` |
| Asiento resumen | Asiento que agrega varios eventos de un día o rango. | `dict:con.entry.summary` | "CIERRE DE COMPRAS dd/mm – dd/mm" |
| Asiento por operación | Un asiento por documento. | `dict:con.entry.perOperation` | `DetalleXOperacion` |
| Lote de contabilización | Corrida que prepara, previsualiza y confirma asientos resumen o reprocesos. | `dict:con.postingBatch` | Cierre automático (`frmCierreDiario`) |
| Contraasiento | Asiento que revierte otro, vinculado a él. | `dict:con.entry.reversal` | — (ProCoop elimina) |
| Asiento personalizado | Plantilla de asiento definida por el usuario. | `dict:con.entryTemplate` | `abm_Asiento_Personalizado`, `SU_ASIENTOS` |
| Ejercicio | Período anual contable con inicio, fin y estado. | `dict:con.fiscalYear` | `CTEJER` |
| Período | Mes contable dentro del ejercicio, con bloqueos por módulo. | `dict:con.period` | Fechas de cierre por módulo (P67, P432, P500…) |
| Bloqueo de módulo | Fecha/período hasta el cual un módulo no puede registrar operaciones. | `dict:con.period.moduleLock` | `Nucleo.ModuloCerrado` |
| Asiento de refundición | Asiento de cierre que salda resultados contra la cuenta de resultados. | `dict:con.entry.resultClosing` | `CierreResultados` |
| Asiento patrimonial de cierre | Asiento que salda activo, pasivo y patrimonio neto. | `dict:con.entry.balanceClosing` | `CierreCtasPatrimoniales` |
| Asiento de apertura | Inverso del patrimonial al día siguiente. | `dict:con.entry.opening` | `AperturaEjercicio` |
| Cuenta de resultado de cierre | Destino de refundición por prefijo/rango. | `dict:con.resultTarget` | `RESULTA` |
| Centro de costo / sección | Unidad interna de análisis; no equivale necesariamente a un servicio (BASE §75). | `dict:con.costCenter` | Sección (`CTSECCION`) |
| Grupo de centros | Agrupación de centros para informes. | `dict:con.costCenterGroup` | `CTSECCION_GRUPOS` |
| Regla de asignación | Distribución por defecto a centros por tipo de operación y elemento. | `dict:con.allocationRule` | `CTSECCION_ASIGNA` |
| Modelo de distribución | Plantilla de porcentajes reutilizable. | `dict:con.distributionModel` | `MODELO` en `CTSECCION_ASIGNA` |
| Distribución analítica | Reparto de costos comunes sin crear otro gasto (BASE §75). | `dict:con.costDistribution` | Gastos/ingresos por sección |
| Equivalencia | Correspondencia entre cuentas de dos planes (1:1, 1:N, N:1). | `dict:con.accountMapping` | — |
| Escenario | Conjunto de hipótesis, plan, universo y corte con resultados simulados (BASE §55). | `dict:con.scenario` | — |
| Cuenta de control | Cuenta contable que debe explicar el saldo de un auxiliar. | `dict:con.controlAccount` | Deudores por tipo de factura |
| Conciliación | Comparación auxiliar vs cuenta de control con diferencias explicadas. | `dict:con.reconciliation` | — |
| Presupuesto | Proyección de importes por cuenta, centro, servicio y mes (BASE §55). | `dict:con.budget` | — |
| Compromiso | Reserva de presupuesto por una OC u obligación aprobada aún no devengada (AGR-028). | `dict:con.commitment` | — |
| Devengado | Gasto o ingreso registrado contablemente. | `dict:con.accrued` | — |
| RECPAM | Resultado por exposición al cambio del poder adquisitivo de la moneda, contrapartida del ajuste por inflación. | `dict:con.recpam` | Cuenta P2139 |
| Índice de inflación | Valor mensual de una serie de índices económicos de T04 (`economicIndexSeries`, CTR-DAT-29). | `dict:con.inflationIndex` | `INFLACIO` / `TABINFL` |
| Libro rubricado | Libro con hojas rubricadas por el organismo de registro. | `dict:con.rubricatedBook` | Hojas a rubricar (`frmImprimirHojasRubricar`) |
| Estados contables | ESP, ER, EEPN, EFE, notas y anexos en formato INAES/RT. | `dict:con.financialStatements` | Balance general |
| Categoría INAES | Clasificación del catálogo del INAES usada en informes al organismo. | `dict:con.inaesCategory` | `CAT_INAES` |
| Grupo contable | Agrupación de cuentas corrientes que define cuentas de cobranza (caja, valores, tarjetas, capital). | `dict:con.collectionAccountingGroup` | `GRU_CON` |
| Sistema contable externo | Software contable de terceros con el que se intercambian asientos. | `dict:con.externalLedger` | `SISCONT` |

## 4. Actores, permisos y alcance

| Rol (ejemplo de perfil del tenant) | Capabilities | Alcance de datos |
|---|---|---|
| Contador / responsable contable (BASE §42.6 "Contable", MT-006) | `con.config.ver`, `con.config.configurar`, `con.planes.*`, `con.cuentas.*`, `con.reglas.*`, `con.eventos.ver`, `con.eventos.reprocesar`, `con.eventos.ignorar`, `con.asientos.*`, `con.lotes.*`, `con.ejercicios.*`, `con.periodos.*`, `con.centros.*`, `con.distribuciones.*`, `con.conciliaciones.*`, `con.reportes.*`, `con.libros.*`, `con.estados.generar`, `con.inflacion.*`, `con.simulaciones.*`, `con.presupuestos.*`, `con.compromisos.*`, `con.externo.*` | Tenant |
| Auxiliar contable | `con.asientos.ver`, `con.asientos.crear`, `con.asientos.editar` (solo borradores propios), `con.asientos.importar`, `con.eventos.ver`, `con.reportes.ver`, `con.conciliaciones.ver`, `con.centros.ver` | Tenant |
| Responsable de costos | `con.centros.ver`, `con.centros.configurar`, `con.distribuciones.*`, `con.reportes.ver`, `con.reportes.exportar` | Tenant o servicios asignados |
| Responsable de presupuesto / gerente | `con.presupuestos.ver`, `con.presupuestos.crear`, `con.presupuestos.editar`, `con.compromisos.ver`, `con.reportes.ver` | Tenant o centros/servicios asignados |
| Aprobador de presupuesto y excesos (gerente, tesorero) | `con.presupuestos.aprobar`, `con.compromisos.autorizarExceso`, `con.compromisos.liberar` | Tenant |
| Consejo de administración / tesorero | `con.estados.ver`, `con.estados.aprobar`, `con.reportes.ver` | Tenant |
| Síndico / auditor / estudio contable externo | `con.*.ver`, `con.reportes.exportar`, `con.estados.ver` (solo lectura) | Tenant (acceso con vencimiento, T02) |
| Analista de simulación | `con.simulaciones.ver`, `con.simulaciones.crear`, `con.simulaciones.ejecutar`, `con.simulaciones.exportar`, `con.planes.ver` | Tenant (solo escenarios) |
| Administrador de la cooperativa | `con.config.ver`, `con.periodos.ver`, `con.reportes.ver`; asigna perfiles | Tenant |
| Operadores de otros módulos | Ninguna capability de CON; ven el asiento vinculado a su documento con `con.asientos.verVinculado` | Documentos de su alcance |
| Worker del sistema (principal técnico) | `con.eventos.procesar`, `con.lotes.ejecutar` | Tenant del evento (nunca cruza tenants) |
| Soporte de plataforma | Lectura con acceso temporal autorizado (T02) | Tenant asistido |

Capabilities adicionales con riesgo (segregación de funciones, AGR-034 y MER-012): `con.asientos.aprobar`, `con.asientos.anularMasivo`, `con.asientos.renumerar`, `con.periodos.reabrir`, `con.ejercicios.cerrar`, `con.ejercicios.reabrir`, `con.cuentas.unificar`, `con.cuentas.renumerar`, `con.planes.promover`, `con.estados.emitir`. Quien carga un asiento manual por encima del umbral no puede aprobarlo; la reapertura de un ejercicio exige aprobación de un segundo usuario (RN-CON-082).

## 5. Requisitos funcionales

### 5.1 Configuración general

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CON-001 | Configuración contable por tenant: plan operativo vigente, moneda funcional ARS, zona horaria, formato de numeración de asientos, decimales de porcentajes de centros, activación de centros de costo (general o solo sueldos), tolerancia de redondeo, fecha base contable por módulo y modo de contabilización por módulo. | BASE §22; RN-08 §12.3; RN-09 CONTABILIDAD (P2547, P2714, P2978) | Núcleo | O5 | Adoptado | La configuración se publica versionada (T04) y cada asiento registra la versión aplicada. |
| RF-CON-002 | Modo de contabilización por módulo de origen: **tiempo real** (un asiento por operación al recibir el evento), **resumen diario** o **resumen por rango** (los eventos quedan en bandeja y un lote los agrega), sin que ningún evento pueda contabilizarse dos veces. | DFA M19 mejoras; RN-08 §1.2, §6.1, §13.1 | Núcleo | O5 | A validar (PA-CON-01) | Con modo resumen diario, 1.000 facturas del día generan un asiento por servicio y concepto vinculado a los 1.000 eventos; reprocesar el día no duplica. |
| RF-CON-003 | Fecha contable base por módulo: emisión, fecha contable del comprobante de compra (`FEC_CON`), fecha de acreditación, fecha de confirmación del pago o cierre de caja; opción de usar fecha de emisión en ventas. | INV `frmCierreDiario.chkFechaEmisionVentas`; RN-08 §6.2 | Estándar | O5 | Adoptado | Cambiar la base solo afecta eventos no contabilizados y queda auditado. |
| RF-CON-004 | Roles de cuenta tipados por plan (cuentas por defecto del motor) que reemplazan los parámetros-cuenta P513, P2101–P2167 y P3141, más roles nuevos de CoopApps (§14.2). | RN-08 §6.1, §13.2, §15.2 `TipoCuenta`; RN-09 CONTABILIDAD | Núcleo | O5 | Adoptado | Cada rol apunta a una cuenta imputable del plan; un rol sin cuenta aparece en el validador. |
| RF-CON-005 | Validador de salud de la configuración contable ("cuentas sin asignar"): lista cada rol, regla, entidad o combinación de dimensiones sin cuenta resoluble, con el enlace a la pantalla donde se configura; corre a demanda, al publicar configuración y cada noche. | RN-08 §6.1, §13.2 (`GetCuenta` agrega a "cuentas sin asignar" con la ruta del menú) | Núcleo | O5 | Adoptado | Un servicio nuevo sin cuenta de ingresos aparece en el validador antes de su primera factura. |
| RF-CON-006 | La publicación de configuración de un servicio, concepto, impuesto, medio de pago, banco, caja o grupo contable nuevo advierte (o bloquea, según política) si no tiene regla de imputación resuelta en el plan operativo. | BASE §102 AGR-009 (ejemplo: "la publicación se detiene si no hay equivalencia contable") | Estándar | O5 | Adoptado | Copiar Internet a otro tenant sin equivalencia contable detiene la publicación con el detalle faltante. |

### 5.2 Planes de cuentas y cuentas

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CON-007 | Crear, copiar, versionar y administrar varios planes de cuentas por tenant, identificados y versionados. | BASE §55 ERP-002; §22 | Núcleo (uno) / Estándar (varios) | O5 / O8 | Informado | Se crea PC-OPER-01 en O5; en O8 se copia a PC-ALT-01 conservando estructura. |
| RF-CON-008 | Propósito del plan: operativo, alternativo, simulación, regulatorio o externo. | BASE §55, §75 | Estándar | O8 | Adoptado | Un plan alternativo no puede recibir asientos oficiales. |
| RF-CON-009 | Estados del plan: borrador, aprobado, operativo, alternativo, archivado; un único plan operativo por ejercicio. | BASE §55 | Núcleo | O5 | Informado | Intentar marcar dos planes operativos para el mismo ejercicio se rechaza. |
| RF-CON-010 | Árbol jerárquico de cuentas con código, nombre, nivel, cuenta padre y máscara de código configurable por plan (ej. `1.1.01.01.001` o el formato de 11 dígitos de ProCoop 6+5 con prefijos de 5, 3 y 1). | RN-08 §5.1, §15.2 (`GetCuentaPadre`) | Núcleo | O5 | Adoptado | El árbol se arma por `parentId`; la máscara solo valida el formato visible. |
| RF-CON-011 | Cuenta imputable o agrupadora; solo las imputables reciben renglones. | RN-08 §5.1 (`validarImputable`); BASE §55 | Núcleo | O5 | Informado | Un renglón contra una agrupadora se rechaza. |
| RF-CON-012 | Naturaleza explícita de cada cuenta (activo, pasivo, patrimonio neto, ingresos, egresos, orden deudora, orden acreedora) y saldo normal, en lugar de prefijos. | RN-08 §5.1 (P514, P508, P509, P510, P511, P512) | Núcleo | O5 | Reemplazado por atributo `nature` | El cierre de ejercicio y los estados usan `nature`, no el primer dígito. |
| RF-CON-013 | Rubro y subrubro contable por cuenta para la exposición en estados contables. | CAT `CTSRUBROS`, `CTPLAN_SUBRUBROS`; INV `abm_CtsRubros` | Núcleo | O5 | Adoptado | El ESP agrupa por rubro (ej. "Créditos por servicios"). |
| RF-CON-014 | Atributo "ajustable por inflación" (partida no monetaria) por cuenta. | CAT `CTPLAN.AJU_CTA`; INV `abm_CtPlan.cboAjustable` | Estándar | O8 | Adoptado | Solo las cuentas ajustables entran en la corrida de ajuste. |
| RF-CON-015 | Política de centro de costo por cuenta: prohibido, opcional u obligatorio; centros habilitados por cuenta; distribución por defecto de la cuenta. | CAT `CTSECC_X_CTA`; RN-08 §5.3 (`CargarSeccionesDefault`) | Núcleo | O5 | Adoptado | Un renglón de una cuenta con centro obligatorio sin distribución se rechaza; un centro no habilitado para la cuenta se rechaza. |
| RF-CON-016 | Subcuenta o código auxiliar visible y dígito verificador opcional. | RN-09 P2814; CAT `CTPLAN.COD_SCC`, `DIG_VER` | Extensión | O8 | Adoptado | La columna subcuenta se muestra si la configuración lo indica. |
| RF-CON-017 | Vigencia de la cuenta; inactivación sin borrado si tiene movimientos; borrado físico solo sin movimientos ni referencias. | Guía §5; RN-08 §15.2 (`contieneAsientos`, `existeCuenta`) | Núcleo | O5 | Adoptado | Una cuenta con movimientos solo puede inactivarse. |
| RF-CON-018 | Moneda de la cuenta (ARS por defecto; otra para bancos o deudas en moneda extranjera) con reexpresión a ARS. | CAT `TIP_MON`; RN-08 §15.1 (`RegistrarResBan` cotización) | Estándar | O8 | Adoptado | Un renglón en USD guarda moneda, cotización e importe en ARS. |
| RF-CON-019 | Mapeo de cada cuenta a líneas de las plantillas de estados contables (INAES/RT) y, cuando corresponda, a categorías INAES. | DFA M19 (`CAT_INAES`, estados INAES); CAT §24 | Estándar | O8 | Adoptado | Ninguna cuenta imputable con saldo queda fuera del ESP o ER; se informa en el control previo. |
| RF-CON-020 | Renumerar una cuenta (cambiar su código visible) conservando identidad, historial y referencias. | RN-08 §5.1, §15.2 (`Renumerar_Cuenta`); INV `frmRenumerarCuentas` | Estándar | O8 | Reemplazado por cambio de atributo `code` | Tras renumerar, roles, reglas y movimientos siguen apuntando a la cuenta (por id) y el historial muestra código anterior y nuevo. |
| RF-CON-021 | Unificar cuentas: fusionar una cuenta origen en una destino del mismo plan y naturaleza; las referencias de configuración pasan a la destino; los movimientos de períodos abiertos se reclasifican con asiento; los de períodos cerrados se conservan y los informes muestran la vista unificada. | INV `abm_CtPlan.btnUinificar` | Estándar | O8 | Adoptado | Después de unificar, el mayor de la destino incluye los movimientos de la origen con marca de procedencia y la origen queda inactiva. |
| RF-CON-022 | Visualizar el plan en árbol o lista, imprimir y exportar. | INV `abm_CtPlan` (`chkVista`, `Show_Imprimir`, `ShowPrintPreview`) | Núcleo | O5 | Adoptado | Exportación XLSX/PDF con código, nombre, naturaleza, imputable, ajustable, rubro. |
| RF-CON-023 | Importar plan de cuentas desde Excel con el asistente de importación y ofrecer un plan modelo para cooperativas de servicios públicos. | CNX ExcelImportWizard; BASE §39 | Núcleo | O5 | Adoptado | El asistente muestra errores (padre inexistente, código duplicado) antes de confirmar. |
| RF-CON-024 | Reasignación masiva de cuentas y rubros: cambiar en bloque el rubro de productos, servicios, impuestos y conceptos de compra, o la cuenta de bancos, roles de cuenta, proveedores y tipos de factura; filtro "sin asignar"; agrupación; auditoría "Reasignar cuentas y rubros". | RN-08 §15.2 (`clsAsignarCuentasYRubros`); INV `frmAsignarCuentasYRubros` | Estándar | O8 | Adoptado | Reasignar 50 proveedores a otra cuenta deja 50 registros de auditoría y no altera asientos ya registrados. |
| RF-CON-025 | Cuentas de capital social por rubro de capital; un rubro de producto pertenece a un solo rubro de capitalización. | CAT `RUBCAPI`; RN-08 §15.2 (`Exist_Rubro_Rubcapi`); INV `abm_Rubcapi` | Estándar | O10 | Adoptado | Asignar un rubro a dos rubros de capital se rechaza. |
| RF-CON-026 | Cuentas de resultado para el cierre: por prefijo o rango de cuentas de resultado, la cuenta de resultados destino, con marca de ganancias/pérdidas; la regla de mayor especificidad (prefijo más largo) gana; si no hay, se usa el rol "asignación de resultados". | CAT `RESULTA`; RN-08 §5.4; RN-09 P513; INV `abm_Resulta` | Estándar | O8 | Adoptado | Un ejercicio con ingresos de agua refunde contra "Resultado sección Agua" si así se configuró. |

### 5.3 Ejercicios y períodos

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CON-027 | ABM de ejercicios: número, fecha desde, fecha hasta, estado; desde < hasta; número único; sin solapamiento ni contención de otro ejercicio. | CAT `CTEJER`; RN-08 §5.1, §15.2 (`ValidarEjercicio`); INV `abm_CtEjer` | Núcleo | O5 | Adoptado | Un ejercicio que contiene por completo a otro se rechaza (corrige el defecto de ProCoop). |
| RF-CON-028 | Generación automática de períodos mensuales por ejercicio, incluidos ejercicios irregulares. | RN-08 §13.3 | Núcleo | O5 | Adoptado | Un ejercicio 01-07-2026 a 30-06-2027 genera 12 períodos. |
| RF-CON-029 | Bloqueo por módulo dentro de cada período: comprobantes de venta, facturación, cobranza, compras, bancos, tesorería, financiaciones, viviendas, stock, sueldos, titulares, bienes de uso y contable, reemplazando las fechas de cierre P67, P500, P501, P502, P504, P505, P506, P432, P2376, P2785, P2778 y P2528. | RN-08 §1.1, §13.3; RN-09 CONTABILIDAD | Núcleo | O5 | Reemplazado por `accountingPeriods.moduleLocks` | Con cobranza bloqueada hasta 31-10-2026, un pago con fecha 30-10-2026 se rechaza con el mensaje de período cerrado. |
| RF-CON-030 | Servicio de guarda de período (`periodGuard`) consultado por todos los módulos antes de registrar o modificar una operación con fecha; responde permitido/rechazado y motivo. | RN-08 §1.1 (`Nucleo.ModuloCerrado`, `EjercicioAbiertoALaFecha`); RN-09 P2528 (`clsModificacionFacturas`) | Núcleo | O5 | Adoptado | Modificar una factura de un período contable cerrado se rechaza aunque facturación esté abierta. |
| RF-CON-031 | Cierre mensual de período con lista de control: eventos pendientes de configuración = 0, asientos en borrador = 0, cajas cerradas, conciliaciones sin diferencias no explicadas, amortizaciones y provisiones registradas, ajuste por inflación si es mensual. | BASE §22 (bloquear períodos cerrados), §76 | Núcleo | O5 | Adoptado | El cierre no se habilita mientras haya un evento pendiente; el sistema lista los bloqueantes. |
| RF-CON-032 | Reapertura controlada de período: solicitud con motivo, aprobación (T11), plazo opcional de reapertura, auditoría y recierre. | BASE §22 (reaperturas autorizadas), §75 | Núcleo | O5 | Informado | La reapertura sin aprobación es imposible; queda constancia de quién, cuándo y por qué. |
| RF-CON-033 | Varios ejercicios abiertos a la vez (anterior en cierre y nuevo en curso). | RN-08 §1.1 (`EjercicioAbiertoALaFecha`) | Núcleo | O5 | Adoptado | Se registran asientos de enero del ejercicio nuevo mientras se ajusta diciembre del anterior. |
| RF-CON-034 | Ejercicios irregulares (primer ejercicio, cambio de fecha de cierre por asamblea). | Práctica contable cooperativa | Estándar | O8 | Adoptado | Se crea un ejercicio de 6 meses sin error. |

### 5.4 Asientos manuales, personalizados e importados

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CON-035 | Alta de asiento manual: fecha, descripción, renglones (cuenta, debe, haber, observación), distribución por centro de costo por porcentaje o importe, adjuntos de respaldo y referencia opcional a documento. | INV `frmAsientos`, `frmAsientos_Detalle` (`CargarAsignaciones`, `ClickAdjuntos`); BASE §22 | Núcleo | O5 | Informado | Se graba un asiento con adjunto PDF y dos centros 60/40. |
| RF-CON-036 | Validaciones del asiento: al menos dos renglones, debe = haber exacto, cuentas imputables y vigentes, período y módulo contable abiertos, descripción obligatoria, centros según la política de la cuenta y distribución al 100 %. | RN-08 §5.2 (`Validar`); INV `frmAsientos.Validar_CierreContable` | Núcleo | O5 | Adoptado | Un asiento de un solo renglón se rechaza (ProCoop admite uno). |
| RF-CON-037 | Estados del asiento: borrador, pendiente de aprobación, contabilizado, anulado, revertido. | RN-08 §15.2; Guía §5; AGR-003 | Núcleo | O5 | Adoptado | Solo los contabilizados afectan mayores y saldos. |
| RF-CON-038 | Aprobación de asientos manuales y de ajuste según tipo e importe, con registro de quién grabó, revisó y autorizó. | BASE §22 ("Revisar y aprobar ajustes"); CAT `CTASIEN.GRABO`, `REVISO`, `AUTORI` | Núcleo | O5 | Informado | Un ajuste de ARS 500.000 con umbral ARS 100.000 queda pendiente hasta que otro usuario lo apruebe. |
| RF-CON-039 | Numeración interna global e inmutable y número visible correlativo por ejercicio; si cambia la fecha a otro ejercicio, cambia el número visible; formato configurable (incluido prefijo de 4 dígitos + correlativo de 4). | RN-08 §5.2 (`COD_ASI`, `COD_AS`), §15.2 (`RenumerarAsientos`) | Núcleo | O5 | Adoptado | El primer asiento del ejercicio 2027 es el 1 aunque existan miles de 2026. |
| RF-CON-040 | Tipos de asiento: manual, automático, ajuste, apertura, refundición de resultados, patrimonial de cierre, ajuste por inflación, importado, reversión, distribución de excedentes, reclasificación. | RN-08 §5.2, §5.4, §15.2 (`EsAsientoCierre`, `MarcarAsientoApertura_Cierre`) | Núcleo | O5 | Adoptado | Filtrar el diario por tipo devuelve solo los de ese tipo. |
| RF-CON-041 | Plantillas de asiento personalizado y recurrente: cuentas o roles, lado, porcentaje o fórmula sobre un importe base, centro, periodicidad y reversión automática; incluye la plantilla de sueldos formato 3 (`SU_ASIENTOS`). | INV `abm_Asiento_Personalizado` (`cboTipoCuenta`); RN-08 §6.6; CAT `SU_ASIENTOS` | Estándar | O8 | Adoptado | Una plantilla "Devengamiento de seguros" genera cada mes un asiento de ARS 12.000 en borrador. |
| RF-CON-042 | Copiar asiento, revertir asiento (contraasiento con fecha elegida) y reversión automática el primer día del período siguiente (provisiones). | Práctica contable; Guía §5 | Núcleo | O5 | Adoptado | El contraasiento queda vinculado al original y ambos se ven en el mayor. |
| RF-CON-043 | Compresión de renglones de igual cuenta, centro y lado en asientos resumen. | RN-08 §5.2 (`Comprimir`, P2978) | Estándar | O5 | Adoptado | Un resumen con 300 renglones de la misma cuenta y centro se comprime en uno. |
| RF-CON-044 | Documentación de origen y adjuntos por asiento, con expediente documental (T11). | BASE §22; AGR-023 | Núcleo | O5 | Informado | El adjunto se descarga con URL firmada y queda auditado el acceso. |
| RF-CON-045 | Importación de asientos desde Excel/CSV, con y sin centros de costo y en modalidad "asiento único", con validación previa de cuentas, balance por asiento, ejercicio abierto, período no bloqueado y numeración por ejercicio. | RN-08 §5.2, §15.2 (`ImportarAsientos`, `ImportarAsientosConSeccion`, `ImportarAsientoUnico`, `ValidarImportacion`); FIC 18.2 | Estándar | O5 | Adoptado | Un archivo con un asiento desbalanceado no importa ninguno y muestra la fila en error. |
| RF-CON-046 | Anulación masiva de asientos por filtros (rango, origen, lote, módulo), con permiso específico, excluyendo apertura y cierre, validando período abierto y no rubricado, y revirtiendo los efectos dependientes (amortizaciones). | RN-08 §5.2, §15.2 (`EliminacionMasiva`, permiso `CTAsientoElimMas`); INV `frmEliminacionMasiva` | Estándar | O8 | A validar (PA-CON-04) | Anular un lote de amortización notifica a STK y los acumulados de los bienes vuelven al valor previo. |
| RF-CON-047 | Renumeración de asientos de un ejercicio por fecha, con apertura primero, cierre al final y luego orden de registro, desde un número inicial o continuando el último, solo para el rango no transcripto a libro rubricado. | RN-08 §15.2 (`RenumerarAsientos`); INV `frmRenumerar` | Estándar | O8 | Adoptado | Renumerar un rango ya impreso en hojas rubricadas se rechaza. |
| RF-CON-048 | Consulta del diario con filtros por fecha de asiento o de registro, tipo, origen (automático/manual), módulo, estado, cuenta, centro, usuario, importe y documento; navegación al documento. | RN-08 §15.2 (`GetAsientos`) | Núcleo | O5 | Adoptado | Desde un asiento resumen de cobranza se llega a cada recibo incluido. |
| RF-CON-049 | Asientos en moneda extranjera: renglón con moneda, cotización e importe en ARS; diferencias de cambio por eventos de TES. | CAT `TIP_MON`; RN-08 §15.1 | Estándar | O8 | Adoptado | Un depósito en USD 100 a 1.000 se registra ARS 100.000 con moneda y cotización. |
| RF-CON-050 | Auditoría de altas, modificaciones, aprobaciones, anulaciones y reversiones con antes y después. | RN-08 §5.2 (`RegistrarAuditodia`) | Núcleo | O5 | Adoptado | La auditoría muestra el renglón modificado de un borrador con usuario y hora. |

### 5.5 Motor de asientos automáticos

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CON-051 | Recepción de los eventos económicos de todos los módulos vía outbox en una bandeja (`accountingEvents`), idempotente por identificador del evento de origen. | DEC-003; BASE §75 ("No contabilizar de nuevo un documento porque se reenvía una integración"); AGR-016 | Núcleo | O5 | Informado | Recibir dos veces el mismo `fac.invoice.issued` crea un solo evento y un solo asiento. |
| RF-CON-052 | Contrato del evento económico: tipo, documento de origen, fecha contable, moneda, renglones económicos con **rol de importe** (neto, descuento, IVA por alícuota y condición, percepción, retención, impuesto interno, tasa de terceros, capital, interés, recargo, costo, comisión, redondeo, etc.) y **dimensiones** (servicio, concepto, producto, rubro, grupo contable, tipo de factura, zona, medio de pago, banco, caja, ente, proveedor, empleado, concepto de sueldo, sindicato, empresa, obra, incidente, bien de uso, depósito, sucursal, centro sugerido). El emisor no elige cuentas. | AGR-002; RN-08 §6.1; BASE §75 | Núcleo | O5 | Adoptado | Un evento sin rol de importe válido se rechaza con error de contrato y alerta técnica. |
| RF-CON-053 | Reglas de imputación configurables por tipo de evento y rol de importe con condiciones por cualquier dimensión, vigencia, versión y prioridad; cuenta y, opcionalmente, centro o modelo de distribución. | DFA M19 mejoras; CAT `CTCUENTA_ASIGNA`, `SISCONT`; RN-08 §6.4 | Núcleo | O5 | Adoptado | Una regla "Ingresos Internet zona Norte" vigente desde 01-11-2026 se aplica solo a eventos con esa fecha o posterior. |
| RF-CON-054 | Resolución en cascada: cuenta asignada en la entidad (proveedor, banco, alícuota, rubro, tipo de factura, grupo contable, concepto de sueldo, sindicato, obra, tipo de retención, tipo de valor, categoría de movimiento) → regla con más coincidencias (empate por prioridad; empate total es error de configuración) → rol por defecto; el renglón guarda la ruta de resolución. | RN-08 §6.1, §6.4, §15.2 (`clsCuentas_Asignadas`, `GetCuentaAsig`) | Núcleo | O5 | Adoptado | En el renglón se ve "regla R-104 (3 coincidencias: servicio, zona, rubro)". |
| RF-CON-055 | Simulador de reglas: con un evento de ejemplo, mostrar las cuentas y centros resultantes y la ruta de resolución, sin registrar nada. | Mejora (validar configuración antes de operar, RN-08 §13.2) | Estándar | O5 | Adoptado | El contador prueba un cobro con tarjeta y ve las cuentas sin generar asiento. |
| RF-CON-056 | Asiento por operación o resumen diario/por rango por módulo, con agrupación configurable por cuenta, centro y dimensiones (grupo contable, tipo de comprobante, zona, rubro, servicio). | RN-08 §6.1 (`DetalleXOperacion`, `EjecutarProcesoEntreFechas`), §6.4 | Núcleo | O5 | Adoptado | El resumen de ventas del 03-11-2026 agrupa por servicio y concepto. |
| RF-CON-057 | Vínculo bidireccional documento ↔ evento ↔ asiento ↔ renglón. | BASE §75 (recorrer en ambos sentidos); RN-08 §13.1 | Núcleo | O5 | Informado | Desde la factura se abre su asiento; desde el renglón resumen, las facturas que lo componen. |
| RF-CON-058 | Reversión automática al anular el documento o evento de origen: contraasiento vinculado en el período del origen si está abierto, o en el período abierto actual con referencia si está cerrado. | RN-08 §13.1 ("reversión automática al anular") | Núcleo | O5 | Adoptado | Anular una NC del 05-11 genera el contraasiento del 05-11. |
| RF-CON-059 | Evento sin cuenta resuelta: queda "pendiente de configuración", genera alerta y bloquea el cierre del período, sin bloquear la operación de origen. | RN-08 §6.1 (`GuardarAsientos` no guarda si hay cuentas inexistentes) | Núcleo | O5 | A validar (PA-CON-02) | Cobrar en un medio nuevo sin cuenta no impide el cobro; el evento aparece en la bandeja de pendientes. |
| RF-CON-060 | Reprocesar eventos pendientes o con error luego de corregir la configuración, de a uno o masivamente. | RN-08 §6.1 | Núcleo | O5 | Adoptado | Tras asignar la cuenta, el reproceso contabiliza los 35 eventos pendientes. |
| RF-CON-061 | Tolerancia de redondeo configurable en asientos automáticos: la diferencia dentro de la tolerancia va al rol de redondeo del módulo; fuera de ella, el evento queda en error. | RN-08 §5.2 (0,001 % contra P2111), §6.2; RN-09 P2163, P2164 | Núcleo | O5 | Adoptado | Una diferencia de ARS 0,01 en un resumen de cobranza va a "Redondeo cierre de caja". |
| RF-CON-062 | Lote de contabilización (reemplazo del "Cierre automático"): rango de fechas, módulos a incluir (ventas, pagos de otros períodos, cobranzas, tesorería, bancos, financiaciones, compras, stock, capital, sueldos, fabricación, bienes de uso, cierre de ejercicio, ajuste por inflación), detalle diario o por rango, resumen o por operación, composición, filtro por tipos de factura, fecha de emisión en ventas, método de valuación de stock para informar; aplica a eventos en modo resumen y a reprocesos, nunca duplica. | RN-08 §6.1; INV `frmCierreDiario` (todas sus opciones) | Núcleo | O5 | Adoptado | Correr el lote dos veces para el mismo día no crea asientos nuevos: informa "0 eventos pendientes". |
| RF-CON-063 | Previsualización del lote (borrador) con mayor y composición de ventas, stock y ajustes; confirmación o descarte; si mientras tanto se registraron otros asientos, la numeración se recalcula al confirmar. | RN-08 §6.1 (`GuardarAsientos`); INV `frmCierreDiario_Resultado`, `ImprimirComposicion*`, `ImprimirMayor`, `ImprimirAjustes` | Núcleo | O5 | Adoptado | El contador descarta un lote y los eventos vuelven a pendientes. |
| RF-CON-064 | Aviso de cajas abiertas en el rango y opción de exigir cajas cerradas antes de contabilizar cobranzas en resumen. | RN-08 §15.2 (`GetCajasAbiertas`); RN-09 P3100 | Estándar | O5 | A validar (PA-CON-10) | Con la opción activa, el lote del día con una caja abierta se detiene y la lista. |
| RF-CON-065 | Matriz de eventos económicos de todos los módulos con su asiento tipo (§9.1). | Tarea; DFA M19; RN-08 §6 | Núcleo | O5–O10 | Adoptado | Cada evento de la matriz tiene regla por defecto en el plan modelo. |
| RF-CON-066 | Facturación: contabilizar por concepto, servicio, rubro, zona, tipo de factura y grupo contable, con modalidad de deudores configurable (por tipo de factura o por concepto, con o sin IVA separado), opción de no usar grupos contables y separación de deudores por refinanciación. | RN-08 §6.4; RN-09 P2190, P2191, P2619, P3061 | Núcleo | O5 | Adoptado | El asiento de facturación de Agua acredita Ingresos Agua y debita Créditos por servicios – Agua. |
| RF-CON-067 | Cobranza: contabilizar por medio de pago, caja, grupo contable, ente y banco, con cuenta transitoria de acreditaciones pendientes y registración separada de comisiones y retenciones sufridas. | RN-08 §6.4; RN-05 (registración por ente); RN-09 P2165; BASE CU-22 | Núcleo | O5 | Adoptado | El cobro digital de ARS 8.000 acreditado neto 7.840 con comisión 160 cuadra (CU-22). |
| RF-CON-068 | Compras: distribución por centro de costo por ítem, IVA computable por centro (porcentaje de IVA compras de la sección), IVA no tomado como gasto, ítems pendientes de recepción, remitos, obras y retenciones. | RN-08 §6.2, §5.3; RN-09 P2890, P2902, P2162, P2982, P543; CAT `CTSECCION.Porc_IVA_Compras`, `FPITEMS_CTSEC` | Estándar | O8 | Adoptado | Una factura de ARS 121.000 (neto 100.000) imputada 50 % a una sección con 60 % de IVA computable y 50 % a una sección con 100 % registra IVA CF 16.800 y gasto IVA 4.200 (ver CU-CON-05). |
| RF-CON-069 | Pagos a proveedores: medios de pago (efectivo de caja de pagos, valores de terceros, cheques propios, transferencias, VEP, transferencias diferidas), descuentos obtenidos y cuentas puente de pago con devengamiento. | RN-08 §6.2 (`Compras_Pagos`); RN-09 P2141, P2148, P2149, P2155, P2156 | Estándar | O8 | Adoptado | Una OP con cheque propio diferido acredita "Cheques diferidos a pagar" del banco, no el banco. |
| RF-CON-070 | Tesorería y bancos: cambio de valores, transferencias entre bancos, ingresos y egresos excepcionales por categoría, rechazo y recupero de valores, quebrantos, presentación y cobro de tarjetas con comisiones, presentación de retenciones, créditos y débitos bancarios, depósitos, extracciones, rechazo y débito de cheques propios. | RN-08 §6.3; RN-09 P2076, P2118, P2119, P2121, P2127, P2128, P2134, P2136, P2137, P2384 | Estándar | O8 | Adoptado | Un débito bancario sin categoría contable va a "Débitos bancarios sin subcategoría". |
| RF-CON-071 | Stock: materiales en OT y OM con horas de participantes valuadas, conciliaciones, vales (incluidos los de vivienda con obra por defecto), costo de mercadería vendida, entregas y retiros de comodato, revaluación y altas en orden, con el costo informado por STK. | RN-08 §6.5; RN-09 P2150–P2154, P2161, P2166, P2167, P2548, P2722, P2723, P2734, P755, P2670 | Estándar | O3 (comodato de equipos) / O8 | Adoptado | La instalación de un módem en comodato registra el activo en comodato sin gasto (CU-OPE-01). |
| RF-CON-072 | Bienes de uso: alta, amortización por centro de costo del bien, mejoras, disminuciones, bajas, ventas y ajuste por inflación con cuentas de revalúo separadas y valores históricos. | RN-08 §9; RN-09 P2936, P3076; CAT `BIENES_USO_CTSEC`, `RUB_PYS` | Estándar | O8 | Adoptado | La amortización mensual de un camión 70 % Distribución / 30 % Administración se registra con esa distribución. |
| RF-CON-073 | Sueldos: devengamiento por concepto, centro de costo, servicio y plan, con formatos recibos + contribuciones, por sindicato o personalizado; pago; anticipos; descuento de deuda de servicios. | RN-08 §6.6, §11.5; RN-09 P2207; BASE §104 SUE-010 | Estándar | O9 | Informado | El asiento de octubre 2026 distribuye costo laboral en Distribución, Administración e Internet (CU-104). |
| RF-CON-074 | Mora y financiación: intereses y recargos facturados, convenios y refinanciaciones con intereses e IVA a devengar por cuota, previsión y castigo de incobrables, prescripción de deuda, recuperos. | RN-09 P2103, P2109, P2125, P2126, P2135, P2138, P2158, P2619; BASE MER-006, §14; AGR-014 | Estándar | O6 | Adoptado | Un convenio de ARS 30.000 + 3.000 de interés reconoce el interés como ganado solo al vencer cada cuota. |
| RF-CON-075 | Capital social: suscripción al facturar o en la afiliación, integración en el pago, capital a devolver, reembolso, rescate por socios incobrables, transferencias, capitalización de retornos y distribución de excedentes, con M17. | RN-08 §6.4; RN-09 P73, P2636, P2916, P2129, P2130, P2131, P2133; BASE §97.7, MER-011; AGR-029 | Estándar | O10 | Informado | Cobrar ARS 1.000 de cuota social con la factura no aumenta ingresos por servicios. La suscripción, la integración y su conciliación se adelantan a O5 por RF-CON-150, RF-CON-151 y RF-CON-098; el resto queda en O10 por RF-CON-161 (HUECO-CAP-01). |
| RF-CON-076 | Fabricación: productos en proceso con costo de componentes PEPS y productos terminados por proporción de cantidades. | RN-08 §10.4; RN-09 P3141 | Extensión | O10 | Adoptado | Al finalizar una orden, "Productos en proceso" queda en cero para esa orden. |
| RF-CON-077 | Fiscal: liquidación de IVA (compensación débito/crédito, saldo a pagar o a favor), pago de impuestos, retenciones y percepciones a organismos, rendición de tasas de terceros cobradas. | BASE §61 ("Contabilidad: obligación por retenciones y su cancelación"), §97.4 | Estándar | O8 | Informado | El pago de ARS 2.000 de retenciones cancela el pasivo (CU-FIS-01). |
| RF-CON-078 | Ventas de productos y ventas financiadas con costo de mercadería vendida e intereses a devengar. | RN-09 P2138; BASE §23 | Estándar | O8 | Adoptado | Una venta en 6 cuotas reconoce intereses mes a mes. |
| RF-CON-079 | Tesorería financiera: préstamos recibidos, plazos fijos, intereses y gastos financieros, diferencias de cambio. | Práctica ERP; BASE §21 | Extensión | O8 | Adoptado | Un plazo fijo registra el interés devengado al vencimiento. |
| RF-CON-080 | Asientos de ajuste de cierre como plantillas con reversión: provisión de SAC y vacaciones, previsión de incobrables, ingresos devengados no facturados, gastos devengados no facturados. | Práctica contable (RT FACPCE); RN-09 P2126 | Estándar | O8 | A validar (PA-CON-11, PA-CON-14) | La provisión de ingresos devengados no facturados del 31-12 se revierte el 01-01. |

### 5.6 Centros de costo (secciones)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CON-081 | ABM de centros de costo propios del tenant: código, nombre, jerarquía opcional, porcentaje de IVA compras computable, vigencia y relación opcional con servicio, área, sucursal o zona, sin imponer equivalencia con servicios. **Entidad jurídica (DEC-096):** cada centro tiene una **entidad dueña** (`costCenters.legalEntityId`, obligatoria) y puede **compartirse** con otras entidades del tenant (`sharedWithLegalEntityIds`; vacío = solo la dueña), con la misma regla que el plan de cuentas (RF-CFG-136 de T04, CTR-CON-21): un renglón de asiento solo admite centros cuya dueña o lista compartida incluya la entidad del asiento (RN-CON-127). Así la mutual tiene sus secciones propias, la cooperativa las suyas, y un centro común (por ejemplo, administración central) puede usarse en ambas sin duplicarse. | BASE §22, §75 CON-001; CAT `CTSECCION`, `SECCION`; INV `abm_CtSeccion`; DEC-064; DEC-096 | Núcleo | O5 | Informado | Se crean CC-AG, CC-INT, CC-ADM; CC-ADM no se asocia a ningún servicio. CC-SEP de MUTUAL sin compartir se rechaza en un asiento de COOP; CC-ADM de COOP compartido con MUTUAL se acepta en ambas. |
| RF-CON-082 | Grupos de centros (un centro puede integrar varios grupos) para informes. | CAT `CTSECCION_GRUPOS`, `CTSECCION_GP_ASIGNA`; RN-08 §15.2 | Estándar | O8 | Adoptado | El grupo "Servicios técnicos" suma Agua e Internet. |
| RF-CON-083 | Reglas de asignación por defecto por tipo de operación (ingresos/facturación, compras, ajuste por inflación, asiento manual, costo de mercadería vendida, sección por defecto de cuenta) y tipo de elemento (servicio, producto, concepto, impuesto, cuenta), con porcentajes. | CAT `CTSECCION_ASIGNA`; RN-08 §5.3, §15.2 (`Get_Secciones`); INV `frm_AsignarSeccion` | Núcleo | O5 | Adoptado | El concepto "Abono Internet" se asigna 100 % a CC-INT sin carga manual. |
| RF-CON-084 | Modelos de distribución reutilizables (plantillas) seleccionables al asignar. | RN-08 §15.2 (`CargarModelos`, `Get_Modelo_Grilla`); INV `frm_AsignarSeccion.chkPlantilla`, `cboModelo` | Estándar | O5 | Adoptado | El modelo "DIST-DEMO-25-75" se aplica a varias cuentas de gastos comunes. |
| RF-CON-085 | Distribuciones propias de bienes de uso, empleados, categorías de incidentes, grupos de obras e ítems de compra, recibidas en los eventos de cada módulo. | CAT `BIENES_USO_CTSEC`, `CAT_INCI_CTSEC`, `GRPOBRA_CTSEC`, `FPITEMS_CTSEC`; RN-08 §5.3 | Estándar | O8 | Adoptado | El evento de amortización trae la distribución del bien y el asiento la respeta. |
| RF-CON-086 | Al contabilizar, cualquier renglón sin centro de una cuenta que lo admite toma la distribución por defecto de su cuenta. | RN-08 §5.3 (`CargarSeccionesDefault`) | Núcleo | O5 | Adoptado | Un gasto sin centro de una cuenta con defecto 100 % CC-ADM queda en CC-ADM. |
| RF-CON-087 | Redondeo de distribución: la suma de importes distribuidos iguala el importe del renglón; el último centro absorbe la diferencia; decimales de porcentaje configurables. | RN-08 §5.2; RN-09 P2978; BASE §75 | Núcleo | O5 | Adoptado | ARS 100 en tres partes iguales da 33,33 / 33,33 / 33,34. |
| RF-CON-088 | Distribución analítica de costos comunes con reglas versionadas (porcentaje fijo o driver: cantidad de suministros activos, kWh, m³, horas, metros de red, ingresos), sin duplicar el gasto; importes no asignados identificados. | BASE §22, §75; §76 | Estándar | O8 | Informado | Con DIST-DEMO-25-75 los ARS 4.000 comunes se reparten 1.000/3.000 y el gasto total sigue en 4.000. |
| RF-CON-089 | Reclasificación contable opcional entre centros (asiento neutro de reclasificación) cuando la cooperativa decide exponer la distribución en libros. | BASE §75 (distribución sin duplicar) | Extensión | O8 | Adoptado | El asiento de reclasificación tiene efecto neto cero por cuenta. |
| RF-CON-090 | Estado de resultados por sección/servicio con ingresos directos, costos directos, comunes distribuidos y resultado. | BASE §22 ("Analizar resultados por prestación"), §75 | Estándar | O8 | Informado | La tabla de CU-CON-01 se reproduce: Agua 6.000, Internet 10.000, total 16.000. |
| RF-CON-091 | Activación de centros de costo general o solo para sueldos. | RN-09 P2547, P2714 | Núcleo | O5 | Adoptado | Con "solo sueldos", las compras no exigen centro. |

### 5.7 Cuentas corrientes por servicio y conciliaciones

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CON-092 | Cuentas de control de créditos por servicios con dimensión servicio obligatoria (subcuenta o dimensión) para explicar el saldo por servicio. | BASE §75 CON-005, §78 OPE-003 | Núcleo | O5 | Informado | El saldo contable de Créditos por servicios – Agua iguala la suma de saldos Agua del auxiliar. |
| RF-CON-093 | Conciliación del auxiliar de asociados (COB) contra la cuenta de control, por servicio y total, a una fecha de corte, con diferencias clasificadas por corte, estado o clasificación. | BASE §75 (Conciliaciones y controles), §22 | Núcleo | O5 | Informado | En CU-CON-01 el auxiliar (33.000) y la cuenta de control (33.000) coinciden. |
| RF-CON-094 | Conciliación caja/bancos/valores (TES) contra cuentas, distinguiendo comisiones y retenciones. | BASE §75; §78 | Núcleo | O5 (caja) / O8 (bancos) | Informado | Una comisión no registrada aparece como diferencia "clasificación". |
| RF-CON-095 | Conciliación proveedores (CMP) contra cuenta de proveedores y anticipos. | BASE §78; RN-09 P2112 (deuda proveedor) | Estándar | O8 | Adoptado | Un anticipo pendiente se explica en la conciliación. |
| RF-CON-096 | Conciliación fiscal: IVA débito/crédito contra libros IVA (FIS), retenciones y percepciones a depositar contra declaraciones. | BASE §61; §76 | Estándar | O8 | Informado | El IVA DF contable de octubre coincide con el libro IVA ventas. |
| RF-CON-097 | Conciliación de stock valorizado y bienes de uso (STK) contra sus cuentas. | BASE §78; AGR-026 | Estándar | O8 | Informado | Existencias valorizadas = saldo de Bienes de cambio al corte. |
| RF-CON-098 | Conciliación de capital (M17) contra cuentas de capital. Se adelanta a O5 junto con la contabilización del capital mínimo (DEC-019); durante la convivencia concilia el plan no oficial (DEC-068, DEC-069) (HUECO-CAP-01). | AGR-029; MER-011; HUECO-CAP-01 | Estándar | O5 (antes O10) | Adoptado | Capital suscripto del auxiliar = cuenta contable. |
| RF-CON-099 | Conciliación de sueldos a pagar y cargas sociales (SUE) contra cuentas. | BASE §104 | Estándar | O9 | Adoptado | El neto a pagar de la liquidación iguala la cuenta antes del pago. |
| RF-CON-100 | Consulta contable de la cuenta corriente por asociado y servicio, vista unificada y detallada, con navegación al auxiliar de COB, sin duplicarlo. | BASE §75 (Seguimiento), CON-005 | Núcleo | O5 | Informado | La vista unificada muestra ARS 33.000 con el detalle Agua 8.000 e Internet 25.000. |
| RF-CON-101 | Informe de anticipos y saldos a favor de clientes a una fecha, con deuda reconstruida y prorrateo por ítem. | RN-08 §15.2 (`Get_InformeAnticiposAFecha`); INV `frmInformeAnticiposAUnaFecha` | Estándar | O5 | Adoptado | Al 31-10-2026 lista ARS 2.000 a favor del ESC-01 y coincide con la cuenta de anticipos. |
| RF-CON-102 | Justificación de cada diferencia de conciliación con responsable, causa y, si corresponde, ajuste trazable autorizado. | BASE §75; AGR-011 | Núcleo | O5 | Informado | Ningún ajuste de conciliación carece de operación, causa, autor y contrapartida. |

### 5.8 Múltiples planes, equivalencias y simulaciones

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CON-103 | Equivalencias de cuentas entre planes (1:1, 1:N con porcentajes que suman 100 %, N:1), con vigencia y validación de completitud. | BASE §55 | Estándar | O8 | Informado | Una equivalencia 1:N al 60/40 no duplica importes. |
| RF-CON-104 | Proyección automática de los asientos oficiales a planes alternativos y regulatorios mediante equivalencias, como representación sin libros propios. | BASE §55, §75 | Estándar | O8 | A validar (PA-CON-05) | El balance en PC-ALT-01 suma igual que en PC-OPER-01. |
| RF-CON-105 | Detección de cuentas sin equivalencia, asignaciones ambiguas y asientos desequilibrados antes de aceptar resultados. | BASE §55 | Estándar | O8 | Informado | Sin mapeo completo, el escenario queda "no comparable". |
| RF-CON-106 | Escenarios de simulación con plan elegido, período, universo de operaciones, supuestos (cambio de estructura, reparto de comunes, variación tarifaria, variación de costos) y fecha de corte. | BASE §55 ERP-003, CU-ERP-01; §75 SIM-CON-001 | Estándar | O8 | Informado | SIM-CON-001 reparte 50/50 y muestra Agua 5.000 e Internet 11.000. |
| RF-CON-107 | Copiar una base de simulación para comparar hipótesis identificables y repetibles. | BASE §55 | Estándar | O8 | Informado | Re-ejecutar el mismo escenario con el mismo corte da el mismo resultado. |
| RF-CON-108 | Comparar escenarios entre sí y contra el real con el mismo universo, distinguiendo diferencias de clasificación de cambios de valores. | BASE §55 | Estándar | O8 | Informado | La comparación +10 % tarifa muestra 41.800 como diferencia de valores, no de clasificación. |
| RF-CON-109 | Aislamiento total: una simulación no emite facturas, no genera deuda, no mueve fondos, no envía órdenes a terceros ni contabiliza oficialmente; sus movimientos viven en colecciones separadas. | BASE §22, §55, §75 CON-002 | Núcleo (regla) | O8 | Informado | Ninguna consulta del mayor oficial lee `simulatedJournalLines`. |
| RF-CON-110 | Exportar resultados de simulación identificados como tales en cada hoja y archivo. | BASE §55 | Estándar | O8 | Informado | El XLSX lleva la marca "SIMULACIÓN SIM-CON-001" en encabezado y nombre. |
| RF-CON-111 | Promoción de un plan o configuración aprobada (alternativo → operativo) solo por acción explícita, con aprobación, nueva vigencia (inicio de ejercicio), traspaso de saldos de apertura por equivalencias y auditoría; nunca conversión de resultados simulados en asientos. | BASE §55 | Estándar | O8 | Informado | La promoción crea el asiento de apertura en el plan nuevo y deja el anterior archivado. |

### 5.9 Mayor, balances, estados contables e informes

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CON-112 | Libro diario en pantalla e impresión, con renumeración solo de impresión desde un número N y detalle por sección con porcentaje. | RN-08 §5.5, §15.2 (`GetLibroDiario`) | Núcleo | O5 | Adoptado | Imprimir desde 1.001 no cambia la numeración guardada. |
| RF-CON-113 | Libro diario rubricado (apertura primero), libro inventario y balances, y transcripción sobre hojas rubricadas. | RN-08 §15.2 (`GetLibroDiarioRubricado`); INV `frmImprimirHojasRubricar` | Estándar | O8 | Adoptado | El folio continúa desde la última hoja usada. |
| RF-CON-114 | Mayor de una cuenta o de varias: rango, saldo anterior, movimientos, saldo acumulado, centro, ver asiento y navegar al documento. | RN-08 §5.5 (`GetMayor`, `GetMayores`); INV `frmMayor` (`oVerAsiento`) | Núcleo | O5 | Adoptado | Desde un movimiento del mayor se abre el asiento y desde allí la factura. |
| RF-CON-115 | Sumas y saldos / balance de comprobación por período, por meses o acumulado, por nivel, con detalle por sección y acceso al mayor. | RN-08 §5.5 (`GetSumasYSaldos`); INV `frmSumasySaldos` (`btnDetalleSeccion`, `oVerMayor`) | Núcleo | O5 | Adoptado | Total debe = total haber; diferencia cero siempre. |
| RF-CON-116 | Transacciones por cuenta. | RN-08 §5.5 | Estándar | O8 | Adoptado | Lista renglones con documento de origen. |
| RF-CON-117 | Balance diario por niveles, balance general, balance entre períodos (dos subperíodos con padres acumulados) y saldos de cuentas por nivel. | RN-08 §5.5, §15.2 (`GetBalanceDiario`, `GetBalanceEntrePeriodos`, `GetSaldosCuentas`) | Estándar | O8 | Adoptado | El balance entre períodos muestra 1er y 2do semestre y el total. |
| RF-CON-118 | Distribución por secciones y rubros; gastos e ingresos por sección y por grupos de secciones, mensual hasta 12 meses, exportable a Excel. | RN-08 §5.5, §15.2 (`GetSeccionesSumasYSaldos`, `Get_Datos_GastosIngreso`, `Get_Ingresos_Egresos_Secciones_Grupos`) | Estándar | O8 | Adoptado | El informe usa la naturaleza de la cuenta, no los dígitos "4" y "5". |
| RF-CON-119 | Estados contables en formato INAES/normas profesionales (ESP, ER, EEPN, EFE, notas y anexos: bienes de uso, previsiones, gastos por función y sección, inversiones, resultados por sección), comparativos con el ejercicio anterior, con plantilla versionada por tenant y exportación PDF/XLSX. | DFA M19 mejoras ("Estados contables en formato INAES"); BASE §76 | Estándar | O8 | A validar (PA-CON-06) | Los estados del ejercicio 2026 se generan desde los saldos y cuadran con sumas y saldos. |
| RF-CON-120 | Cuadro de distribución de excedentes propuesto a la asamblea y resultado por operaciones con asociados y no asociados. | BASE MER-011; Ley 20.337 [VERIFICAR] | Estándar | O10 | A validar (PA-CON-06) | El cuadro parte del excedente del ER y suma 100 %. |
| RF-CON-121 | Control previo a balances: cuentas no imputables con saldo (hasta todas, no solo 20), cuentas sin naturaleza o sin línea de estado, eventos pendientes, borradores y diferencias de conciliación. | RN-08 §15.2 (`CuentasNoImputables_ConSaldo`) | Núcleo | O5 | Adoptado | El control lista cada problema con enlace. |
| RF-CON-122 | Cuadro de bienes de uso (origen + mejoras − disminuciones) y cuadro de amortizaciones (apertura, ejercicio, cierre) para el anexo de estados contables, con datos de STK conciliados. | RN-08 §15.2 (`Get_Cuadro_BienUso`, `Get_Cuadro_Amortizacion`) | Estándar | O8 | Adoptado | El cuadro coincide con las cuentas de bienes de uso. |
| RF-CON-123 | Informes de gestión contable: resultado y costo por servicio y centro, evolución mensual, ejecución presupuestaria; los indicadores de gestión no contables se definen en T10 con el contrato semántico de §15. | RN-08 §15.2 (indicadores de gestión); AGR-022 | Estándar | O8 / O11 | Adoptado | Cada indicador indica fórmula, universo y corte. |
| RF-CON-124 | Todo reporte declara fecha de corte, universo, estados incluidos y separación real/simulado. | AGR-022 | Núcleo | O5 | Informado | El encabezado de cada reporte muestra corte y universo. |
| RF-CON-125 | Trazabilidad informe → asiento → documento → operación de origen y viceversa. | BASE §22, §75 | Núcleo | O5 | Informado | Desde la línea "Ingresos Internet" del ER se llega a las facturas. |
| RF-CON-126 | Exportación XLSX, CSV y PDF de todos los reportes, según permiso. | CNX DataTable | Núcleo | O5 | Adoptado | Sin `con.reportes.exportar` el botón no aparece y la API responde 403. |

### 5.10 Ajuste por inflación

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CON-127 | Tablas de índices (por ejemplo IPC/FACPCE) con valores mensuales; carga manual, importación y actualización. | CAT `TABINFL`, `INFLACIO`; INV `abm_Tabinfl` (`GuardarInflacio`, `btnActualizar`, `btnEliminar`) | Estándar | O8 | Adoptado | Se importa la serie 2025–2026 y se edita un mes. |
| RF-CON-128 | Ajuste por inflación contable de las cuentas ajustables por coeficiente (índice de cierre / índice del mes de origen de cada partida), contra RECPAM, con previsualización y distribución a centros. | RN-08 §5.5 (`clsCierreDiario` 6747–7065, P2139); RN-08 §15.2 (op 3/elem 8) | Estándar | O8 | A validar (PA-CON-07) | Una partida de ARS 100.000 de enero con coeficiente 1,25 se ajusta en ARS 25.000. |
| RF-CON-129 | Ajuste de bienes de uso y amortizaciones con cuentas de revalúo separadas y valores históricos (cálculo en STK con índices de CON). | RN-08 §9; RN-09 P2936, P3076 | Estándar | O8 | Adoptado | El asiento separa "Bienes de uso – ajuste" de "valor de origen" si la opción está activa. |
| RF-CON-130 | Contabilización de la revaluación de stock por índice del rubro calculada por STK. | RN-08 §8.4, §15.4 (`clsRevaluacion`) | Estándar | O8 | Adoptado | La revaluación genera el asiento contra la cuenta configurada. |
| RF-CON-131 | Si falta un índice del rango, la corrida no se ejecuta y lista los meses faltantes. | RN-08 §15.4 (`RevaluarAutomaticamente`) | Estándar | O8 | Adoptado | Falta marzo: la corrida se detiene con "Falta índice 03-2026". |

### 5.11 Cierre y reapertura de ejercicio, distribución de excedentes

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CON-132 | Cierre de ejercicio: validar que no existan asientos de cierre previos ni pendientes; asiento de refundición de resultados contra cuentas de resultado por prefijo o rol "asignación de resultados"; asiento patrimonial de cierre; asiento de apertura al día siguiente; vínculo de los tres asientos al ejercicio; usuario y fecha de cierre. | RN-08 §5.4, §15.2 (`ValidarCierre`, `GenerarCierreEjercicio`) | Estándar | O8 | Adoptado | Tras cerrar 2026, todas las cuentas de resultado quedan en cero y la apertura 2027 iguala el patrimonial invertido. |
| RF-CON-133 | Reapertura de ejercicio controlada: solicitud, doble aprobación, reversión (no borrado) de los tres asientos, auditoría y nuevo cierre. | RN-08 §5.2 (eliminación en cascada de los tres asientos y reapertura) | Estándar | O8 | Reemplazado por reversión con aprobación | La reapertura deja visibles los asientos de cierre originales y sus reversiones. |
| RF-CON-134 | Asiento de distribución de excedentes según resolución de asamblea (reservas, fondos, interés a cuotas sociales, retornos, capitalización) con evento de M17. | BASE MER-011; AGR-029 | Estándar | O10 | Informado | El asiento usa la resolución de asamblea como documento de origen. |
| RF-CON-135 | Tratamiento configurable de cuentas de orden en el cierre (incluir en cierre y apertura o exigir saldo cero). | RN-08 §5.4 (P512) | Estándar | O8 | A validar (PA-CON-13) | Con la opción recomendada, las cuentas de orden se trasladan al ejercicio nuevo. |

### 5.12 Libros rubricados

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CON-136 | Registro de libros rubricados (diario, inventario y balances): organismo, número de rúbrica, fecha, hojas desde-hasta, líneas por hoja, última hoja usada; impresión de hojas numeradas para rubricar. | INV `frmImprimirHojasRubricar` (`GuardarLineas`, `Imprimir`) | Estándar | O8 | Adoptado | Se imprimen las hojas 1 a 200 con encabezado y numeración. |
| RF-CON-137 | Transcripción del diario sobre hojas rubricadas con continuidad de folio; los asientos transcriptos quedan bloqueados para anular, renumerar o modificar. | RN-08 §15.2 (`GetLibroDiarioRubricado`) | Estándar | O8 | Adoptado | Un asiento transcripto solo admite contraasiento. |
| RF-CON-138 | Libros en formato digital con huella (hash) e índice cuando el organismo de registro lo admita. | Práctica actual [VERIFICAR] | Extensión | O8 | A validar (PA-CON-08) | El archivo exportado incluye hash SHA-256 verificable. |

### 5.13 Sistema contable externo

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CON-139 | Mapeo de operaciones y cuentas propias a cuentas y rubros de un sistema contable externo (operación, cuenta, rubro, observación). | CAT `SISCONT`; DFA M19; FIC 18.2 | Estándar | O5 | Adoptado | Cada cuenta del plan operativo tiene correspondencia o aparece como faltante. |
| RF-CON-140 | Exportación de asientos y mayores al sistema externo con layouts configurables (CSV, TXT posicional, XLSX) mediante el exportador de T06, incremental, idempotente y con marca de exportado. | FIC 18.2 (saliente); RN-08 §15.2 (`ExportarArchivos`) | Estándar | O5 | Adoptado (PA-CON-03 respondida, DEC-069) | Reexportar el mismo rango sin cambios no duplica asientos en el destino. |
| RF-CON-141 | Importación de asientos del sistema externo (contabilidad llevada fuera durante el paralelo) con validaciones y marca de origen. | FIC 18.2 (entrante); RN-08 §5.2 | Estándar | O5 | Adoptado | Los asientos importados se identifican como origen "importado – sistema X". |
| RF-CON-142 | Provisión de saldos y mapeos contables para exportaciones a reguladores y organismos (OCEBA con mapeo FEDECOBA/SUBCUENTA, SilarPib, archivos DGR), cuyos layouts y envío pertenecen a M06 FIS / T06. | RN-08 §5.5, §15.2 (`ExportarArchivo_OCEBA`, `Exportar_ArchivoDGR`) | Extensión | O8 | Adoptado | FIS obtiene los saldos por cuenta mapeada desde la API de CON. |

### 5.14 Presupuestos y compromisos

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CON-143 | Presupuesto económico por ejercicio y versión, por cuenta, centro de costo, servicio y mes; carga manual, importación Excel, copia del ejercicio anterior con porcentaje de ajuste y distribución estacional. | AGR-028; BASE §55 | Estándar | O8 | A validar (PA-CON-12) | Se copia 2026 a 2027 con +30 % y estacionalidad de energía. |
| RF-CON-144 | Aprobación y versionado del presupuesto (original y reformulaciones) con vigencia y auditoría. | AGR-028 | Estándar | O8 | Adoptado | La reformulación de julio conserva el original para comparar. |
| RF-CON-145 | Compromisos: la OC aprobada (y opcionalmente contratos y SA autorizadas) compromete presupuesto; se libera al cancelar; se reduce al devengar la factura. | AGR-028 (ejemplo: OC compromete; cancelarla libera sin inventar un ingreso) | Estándar | O8 | Informado | Cancelar una OC de ARS 40.000 libera ARS 40.000 de compromiso. |
| RF-CON-146 | Control presupuestario al aprobar la OC: disponible = presupuesto − comprometido − devengado sin compromiso; política advertir, exigir autorización o bloquear. | AGR-028 (límites de autorización y excepciones) | Estándar | O8 | A validar (PA-CON-09) | Una OC que excede requiere autorización del aprobador. |
| RF-CON-147 | Ejecución presupuestaria: presupuesto, comprometido, devengado y pagado como columnas separadas que no se suman entre sí, por cuenta, centro, servicio y mes, con desvíos. | AGR-028 (criterio de aceptación) | Estándar | O8 | Informado | El total de gastos no suma comprometido + devengado. |
| RF-CON-148 | Vínculo con el flujo de fondos proyectado de TES (TES proyecta; CON aporta el presupuesto financiero). | BASE §21; DFA M18 (flujo de fondos) | Extensión | O8 | Adoptado | El flujo de TES muestra columna "presupuestado". |
| RF-CON-149 | Proyección de costo laboral de SUE como fuente del presupuesto de sueldos. | BASE §104 SUE-014 | Extensión | O9 | Informado | Se importa la proyección de SUE como versión borrador. |

### 5.15 Capital social contable

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CON-150 | Cuentas de capital por rubro de capital y roles: movimientos de capital, capital a devolver, capital rescatado por socios incobrables, capital integrado, capital suscripto, ajuste de capital. | CAT `RUBCAPI`, `GRU_CON.CTA_CAPS/CTA_CAPI`; RN-09 P2129, P2130, P2131, P2133 | Estándar | O5 (antes O10) para capital suscripto, capital integrado y movimientos de capital; O10 para el resto (RF-CON-161) — HUECO-CAP-01 | Adoptado | Cada rubro de capital tiene cuenta o aparece en el validador. |
| RF-CON-151 | Asientos de suscripción, integración, reembolso, rescate, capitalización de retornos y ajuste de capital desde eventos de M17; las transferencias de capital entre asociados no generan asiento si la cuenta es la misma. | RN-06 (`ConservarCapital`); RN-08 §6.4; BASE §97.7 | Estándar | O5 (antes O10) para suscripción, integración y transferencias (M-02, M-105, M-106, M-111, M-112); O10 para el resto (RF-CON-161) — HUECO-CAP-01 | Adoptado | Transferir capital de un socio a otro no genera asiento; queda en el auxiliar de M17. |
| RF-CON-161 | Capital fuera del mínimo de O5: cuentas y asientos de capital a devolver, reembolso y rescate (también por socios incobrables), ajuste de capital, reservas, distribución de excedentes y capitalización de retornos (M-107…M-110, M-113, M-114). | HUECO-CAP-01; DEC-019 | Estándar | O10 | Adoptado | En O5 un evento de rescate de M17 queda pendiente de configuración y no se contabiliza con una regla provisoria. |
| RF-CON-162 | **Contabilidad por entidad jurídica** (DEC-064, DEC-087): ejercicios, períodos, numeración de asientos, libro diario, mayores, sumas y saldos, libros rubricados, estados contables, ajuste por inflación y conciliaciones se llevan por `legalEntityId`; cada evento económico se contabiliza en la entidad del documento de origen; el cobro de una entidad en la caja de otra genera la cuenta entre entidades (M-136, RN-CON-125); los informes del tenant pueden consolidar entidades sin alterar los libros de cada una. | DEC-064; DEC-087; RN-COB-153 (M07) | Núcleo | O5 | Adoptado | Con dos entidades A y B, el asiento N.º 1 del ejercicio 2027 existe una vez en cada entidad; un cobro en la caja de A por ARS 5.000 de B deja en A deuda con B por 5.000 y en B crédito contra A por 5.000, y sumas y saldos de cada entidad balancean por separado. |
| RF-CON-163 | **Contabilización de obligaciones propias del tenant** (DEC-095): provisión al crearse en M06 una obligación propia (`taxObligations.ownTaxObligationId`, evento `fis.obligation.created`), reversión al anularse o recalcularse, y cancelación al pagarse por M14 (EVT-TES-15 `tes.paymentExecution.executed`, cuyo payload trae `taxObligation { taxObligationId, ownTaxObligationId, taxAgentRegistrationId, legalEntityId, tax, period }`; M15 toma la entidad jurídica y la obligación de ese bloque; DEC-095), en la entidad jurídica de la obligación (RN-CON-128, M-137, M-138). Incluye las contribuciones calculadas sobre la base de capital de M17 (RF-INS-109): M15 concilia el importe provisionado con la obligación de M06 y expone en la conciliación contable-fiscal las obligaciones propias sin asiento. Las exenciones no generan asiento. | DEC-095; M06 RF-FIS-169, RN-FIS-133; M17 RF-INS-109 | Estándar | O8 | Adoptado | Una obligación propia de ARS 150.000 de COOP del período 2026-06 genera el 30-06-2026 debe `ownTaxExpense` 150.000 / haber `ownTaxPayable` 150.000 en COOP y nada en MUTUAL; su pago cancela `ownTaxPayable` contra banco; reprocesar el evento no duplica; anularla en M06 genera el contraasiento. |
| RF-CON-152 | Conciliación del auxiliar de capital con contabilidad y exposición del capital en el EEPN. | AGR-029; MER-011 | Estándar | O10 | Adoptado | El EEPN muestra capital suscripto, integrado y a devolver. |

### 5.16 Transversales

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-CON-153 | Aislamiento por tenant de planes, asientos, simulaciones, presupuestos y exportaciones; todo índice comienza por `tenantId`. | DEC-002; BASE §55 ("escenarios y datos permanecen aislados por tenant") | Núcleo | O5 | Informado | Un usuario de TEN-002 recibe 404 al pedir un asiento de TEN-001. |
| RF-CON-154 | Todas las etiquetas por clave de diccionario y renombrables por tenant (ej. "Sección" en lugar de "Centro de costo"). | BASE §65 | Núcleo | O5 | Informado | El tenant cambia `dict:con.costCenter` a "Sección" y se refleja en todas las pantallas. |
| RF-CON-155 | Única fuente de saldos: los renglones contabilizados; los saldos por cuenta/período/centro son una proyección reconstruible; no existen saldos editables. | AGR-011; CAT `CTPLAN.SDO_CTA`, `SAL_ACT` | Núcleo | O5 | Adoptado | Reconstruir la proyección produce los mismos saldos. |
| RF-CON-156 | Rendimiento: contabilizar el lote de 100.000 facturas del ciclo en resumen dentro de la ventana operativa; mayores y sumas y saldos paginados con respuesta interactiva. | DEC-003; T08 | Núcleo | O5 | Adoptado | El resumen de 100.000 eventos termina sin bloquear la operación (job reanudable). |
| RF-CON-157 | Tablero contable con estado de períodos, eventos pendientes, borradores, conciliaciones con diferencias, alertas de configuración y vencimientos de cierre. | CNX dashboards; BASE §54 | Estándar | O5 | Adoptado | El tablero muestra "12 eventos pendientes de configuración" con enlace. |
| RF-CON-158 | IA solo propone: sugerir cuenta para un concepto nuevo, detectar asientos atípicos; nunca contabiliza ni aprueba. | CNX (IA solo propone); AGR-030 | Extensión | O11 | Adoptado | La sugerencia requiere confirmación humana y se audita. |
| RF-CON-159 | Segregación de funciones: quien carga un ajuste por encima del umbral no lo aprueba; reapertura de ejercicio con doble autorización; anulación masiva con permiso específico. | RN-08 §1.4, §13.7 (controles); MER-012 | Núcleo | O5 | Adoptado | El mismo usuario no puede cargar y aprobar un ajuste de ARS 500.000. |
| RF-CON-160 | Migración repetible desde ProCoop de plan de cuentas, rubros, ejercicios, asientos, centros, reglas y parámetros-cuenta, con conciliación de sumas y saldos. | RN-08 §13.11; T07 | Estándar | O5 (parte en O11) | Adoptado | Las sumas y saldos migradas coinciden con ProCoop a la fecha de corte. Ola: los saldos de apertura migran en O5 y el resto del historial en O11 (antes `O11 (O5 para saldos de apertura)`). |

## 6. Reglas de negocio

Decisión: **Replicar** (igual que ProCoop), **Mejorar** (mismo propósito con mejor diseño), **Reemplazar** (otro mecanismo), **Descartar**.

### 6.1 Asientos, numeración y validaciones

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-CON-001 | Partida doble: en todo asiento la suma del debe iguala la del haber. En asientos manuales la igualdad es exacta. | Debe = Haber obligatorio en manuales (`clsAsiento.Validar`, RN-08 §5.2). | Replicar. | — | — |
| RN-CON-002 | En asientos automáticos, una diferencia menor o igual a la tolerancia configurada se imputa al rol de redondeo del módulo (facturación, caja) o al rol "conceptos desconocidos"; mayor a la tolerancia deja el evento en error. | Diferencia < 0,001 % contra "Conceptos desconocidos" P2111; en compras toda diferencia final a P2111 (RN-08 §5.2, §6.2). | Mejorar: tolerancia absoluta por asiento (default ARS 0,05) y porcentual (default 0,001 %), la menor; nunca ocultar diferencias grandes. | PRM-CON-008, PRM-CON-009; roles 2111, 2163, 2164 | — |
| RN-CON-003 | Un asiento tiene al menos dos renglones, descripción obligatoria, fecha dentro de un ejercicio abierto, período contable no bloqueado y módulo contable abierto. | Al menos un renglón, descripción, ejercicio abierto y fecha posterior a P2528 (RN-08 §5.2). | Mejorar (mínimo dos renglones; guarda por período). | P2528 → `moduleLocks.con` | — |
| RN-CON-004 | Numeración: id interno inmutable; número visible correlativo por ejercicio (máximo del ejercicio + 1, asignado con contador atómico, no `MAX+1`); si la fecha cambia de ejercicio, se asigna número del nuevo ejercicio. | `COD_ASI` global y `COD_AS` por ejercicio con `GetMaxValue + 1`; cambio de fecha renumera (RN-08 §1.3, §5.2). | Mejorar (contador atómico por tenant/ejercicio, sin carreras). | PRM-CON-005 | — |
| RN-CON-005 | Un renglón sin cuenta resuelta invalida solo el evento al que pertenece; los demás eventos del lote se contabilizan. | Un renglón con cuenta 0 deja el asiento "no válido" y bloquea el guardado del lote; informa variables mal configuradas (RN-08 §5.2, §6.1). | Mejorar. | — | — |
| RN-CON-006 | Solo cuentas imputables, vigentes y del plan operativo del ejercicio reciben renglones oficiales. | `validarImputable` = "S" (RN-08 §5.1, §15.2). | Replicar y ampliar. | — | — |
| RN-CON-007 | Antes de emitir balances se controla que ninguna cuenta no imputable tenga movimientos o saldo; se listan todas. | `CuentasNoImputables_ConSaldo` avisa hasta 20 (RN-08 §15.2). | Mejorar (sin límite de 20). | — | — |
| RN-CON-008 | En asientos resumen se comprimen renglones de igual cuenta, centro, dimensiones y lado; la distribución por centros se recalcula con los decimales configurados. | `Comprimir` agrupa por cuenta con decimales P2978 (RN-08 §5.2). | Replicar. | PRM-CON-006 | — |
| RN-CON-009 | Toda alta, modificación, aprobación, anulación y reversión se audita con antes/después, usuario, fecha y origen. | `RegistrarAuditodia` en altas, modificaciones y bajas (RN-08 §5.2). | Replicar. | — | — |
| RN-CON-010 | El origen del asiento es un atributo explícito (`sourceType`: manual, automático, importado, cierre, apertura, ajuste, inflación, reversión, reclasificación, excedentes). | "Automático" = sin usuario de alta ni modificación (RN-08 §15.2 `GetAsientos`). | Reemplazar. | — | — |
| RN-CON-011 | Cada evento económico se contabiliza como máximo una vez: clave única (`tenantId`, `sourceEventId`) en la bandeja y vínculo explícito evento → asiento; reenvíos, reprocesos y lotes repetidos no duplican. | No hay marca de "contabilizado"; se relee por fecha; `existeAsiento` busca por descripción (RN-08 §6.1, §13.1); P3028 "Validar asientos ya generados" sin uso directo. | Reemplazar. | P3028 → Descartado (cubierto por idempotencia) | — |
| RN-CON-012 | Anular o revertir el documento de origen genera un contraasiento vinculado; si el período del original está cerrado, el contraasiento se fecha en el primer período abierto con referencia al original. Nunca se borra un asiento contabilizado de un período cerrado. | ProCoop elimina asientos (`clsAsiento.Eliminar`); la anulación de factura de compra borra la factura (RN-08 §5.2, §7.6). | Reemplazar. | — | — |
| RN-CON-013 | Un asiento contabilizado de período abierto no transcripto en libro rubricado puede anularse lógicamente (queda visible, excluido de saldos); los transcriptos o de períodos cerrados solo admiten contraasiento. Los borradores pueden eliminarse. | Eliminación física individual y masiva (RN-08 §5.2, §15.2). | Reemplazar. | PRM-CON-007 | A validar (PA-CON-04) |
| RN-CON-014 | Los asientos de un lote se preparan en borrador, se revisan y se confirman; al confirmar se asigna la numeración definitiva. | Se arman en memoria, el usuario revisa y `GuardarAsientos` persiste; renumera si hubo cargas mientras tanto (RN-08 §6.1). | Mejorar (borrador persistido y reanudable). | — | — |
| RN-CON-015 | Asientos de apertura y cierre se identifican por tipo y por su vínculo con el ejercicio; un asiento ya marcado no se remarca. | `EsAsientoCierre`, `MarcarAsientoApertura_Cierre` (1 apertura, 2 cierre) (RN-08 §15.2). | Replicar. | — | — |
| RN-CON-016 | Al registrar los centros de un renglón se descartan distribuciones con importe cero y se agrupan las del mismo centro. | `AgregarAConexion` (RN-08 §15.2). | Replicar. | — | — |
| RN-CON-017 | Los asientos importados se numeran por ejercicio igual que los manuales y deben cumplir ejercicio abierto y período no bloqueado; se agrupan por código + descripción + fecha; con centros, una distribución por renglón; en modalidad asiento único, por cuenta + centro + lado; las cuentas se buscan por código del plan. | `COD_AS` = máximo global + 1; no valida ejercicio ni P2528 (defectos); columnas Código_Asiento, Descripción, Fecha, Cuenta, Debe, Haber (RN-08 §15.2). | Mejorar (corrige defectos). | — | — |
| RN-CON-018 | La anulación masiva excluye apertura y cierre, exige permiso `con.asientos.anularMasivo`, período abierto y no transcripto, valida solo lo seleccionado y revierte los efectos dependientes (amortizaciones de bienes, acumulados) mediante eventos a los módulos dueños. | Permiso `CTAsientoElimMas`; rechaza apertura/cierre; valida P2528 y ejercicio; defectos: validación invertida con selección parcial y no revierte amortizaciones (RN-08 §15.2). | Mejorar. | — | A validar (PA-CON-04) |
| RN-CON-019 | Renumeración de asientos: por ejercicio, ordenando por fecha con apertura primero, cierre al final y luego orden de registro; formato opcional prefijo de 4 dígitos + correlativo de 4; puede continuar desde el último; prohibida para asientos transcriptos. | `RenumerarAsientos` (RN-08 §15.2). | Replicar con restricción de rúbrica. | PRM-CON-005 | — |
| RN-CON-020 | La renumeración del libro diario para impresión no modifica la numeración guardada. | `GetLibroDiario` renumera solo para imprimir (RN-08 §15.2). | Replicar. | — | — |
| RN-CON-021 | Un asiento manual o de ajuste cuyo importe supera el umbral, o de tipos definidos, requiere aprobación de un usuario distinto del que lo cargó. | Campos `GRABO`, `REVISO`, `AUTORI` en `CTASIEN` (CAT §17); sin regla de aprobación documentada. | Mejorar (workflow T11). | PRM-CON-010 | — |

### 6.2 Resolución de cuentas e imputación automática

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-CON-022 | Cascada de resolución: (1) cuenta asignada en la entidad de la dimensión; (2) regla de imputación con mayor cantidad de condiciones coincidentes (empate: prioridad; empate total: error de configuración); (3) rol por defecto del plan. Faltante → "cuenta sin asignar" con ruta de configuración. | `clsCuentas_Asignadas`: cuenta de la entidad → cuenta genérica del parámetro; `GetCuentaAsig` elige la regla con más coincidencias; faltantes con el menú exacto (RN-08 §6.1, §6.4, §15.2). | Mejorar (tablas tipadas, validación previa). | Roles §14.2 | — |
| RN-CON-023 | Proveedor: cuenta del proveedor → rol "proveedores / compras". | `PROVEED.CTA_CONTA` → P2112 (RN-08 §15.2). | Replicar. | Rol 2112 | — |
| RN-CON-024 | IVA por alícuota: rol IVA crédito fiscal (compras) o IVA débito inscripto/no inscripto (ventas) → cuenta de compras/ventas de la alícuota → rubro. | P2113 o P2104 → `ALI_IVA.CTA_COMPRAS`/`CTA_VENTAS` → rubro (RN-08 §15.2). | Replicar (orden: alícuota más específica primero; el rol es último recurso). | Roles 2104, 2105, 2113 | Orden exacto rol→alícuota en ProCoop |
| RN-CON-025 | Percepciones: compras → rol percepciones en productos; ventas → cuenta de percepción de la alícuota → rol percepción de ventas de productos → rol percepciones no categorizados → rubro. | P2106 (compras) o P2107 (ventas) → `CTA_VENTAS_PER` → P2160 → rubro (RN-08 §15.2). | Replicar. | Roles 2106, 2107, 2160 | — |
| RN-CON-026 | Banco: cuenta pendiente de débito del banco (cheques propios diferidos) → cuenta del banco. | `CTA_PENDEB` → `CTA_CONTA` (RN-08 §15.2). | Replicar. | — | — |
| RN-CON-027 | Tipo de factura (deudores): cuenta del tipo de factura → cuenta de referencia. | `TIPO_FAC.COD_CTA` → `CTA_REF` (RN-08 §15.2; CAT `TIPO_FAC`). | Replicar como dimensión `billingTypeId`. | — | Significado de `CTA_REF` |
| RN-CON-028 | Grupo contable de cobranza: grupo 0 → roles facturación, refinanciaciones, cierre de caja, valores en cartera, tarjetas, capital integrado; grupo ≠ 0 → cuentas del grupo (cobranza facturación, cobranza refinanciación, caja, valores, tarjetas, capital suscripto, capital integrado, descuentos/recargos, intereses, IVA). | `GetCuentaGrupoContable` (RN-08 §15.2); CAT `GRU_CON` (`CTA_COBF`, `CTA_COBR`, `CTA_CAJ`, `CTA_CAPS`, `CTA_CAPI`, `CTA_DESR`, `CTA_TAR`, `CTA_VAL`, `CTA_INT`, `CTA_IVA`). | Replicar como entidad `collectionAccountingGroups` (dueño COB, cuentas asignadas aquí). | Roles 2101, 2102, 2103, 2121, 2122, 2133; P2191 | — |
| RN-CON-029 | Rubro de producto/servicio por uso: compras, ventas, otros, costo de venta, costo de baja, amortización anual, amortización acumulada, valor de origen, disminución, revalúo. | `GetCuentaRubro_ProdYSer` (RN-08 §15.2); CAT `RUB_PYS` (`COD_CTAV`, `COD_CTAC`, `COD_CTAO`, …). | Replicar. | — | — |
| RN-CON-030 | Venta personalizada por rubro afectado: regla con rubro afectado; si no hay regla, sigue la cascada. | `GetCuentaRubroVenta_Personalizada` (−1 si no hay regla) (RN-08 §15.2). | Replicar dentro de `postingRules`. | — | — |
| RN-CON-031 | Retenciones: sufridas (cobranza) → cuenta del tipo de retención de cobro; practicadas (pagos) → cuenta del tipo de retención de pago. | `RETS_TIPO.CTA_CONT`; `RETE_TIPO.CTA_PROV` (RN-08 §15.2). | Replicar. | Roles 2120, 2123, 2124, 2136 | Nombres de 2123/2124 |
| RN-CON-032 | Sueldos: cuenta del concepto; contribuciones → cuenta de contribuciones de la empresa o su cuenta general; personalizado → cuentas debe/haber de la plantilla; sindicato → cuenta general y de cargas. | `SU_CONCEPTOS.COD_CTA`; `CTA_CONTRI`/`COD_CTA` de empresa; `SU_ASIENTOS.CTA_DEBE/CTA_HABER`; `SU_SINDICATO.CTA_GRAL/CTA_CARGAS` (RN-08 §15.2). | Replicar. | P2207 | — |
| RN-CON-033 | Obras: cuenta del grupo de obra (debe) y su contrapartida (haber); incidentes: cuenta de la categoría de incidente. | `GRPOBRA.COD_CTA`, `COD_CTH`; `CAT_INCI.COD_CTA`, `COD_CTH` (RN-08 §15.2; CAT §10). | Replicar. | — | Significado de `COD_CTH` |
| RN-CON-034 | Tipos de valor (medios de pago) y categorías de movimientos bancarios y de tesorería tienen cuenta propia; sin cuenta, rol genérico. | `TIP_VAL.CTA_CONTA`, `CAT_BANC.CTA_CONTA`; P2118/P2119 (RN-08 §6.3). | Replicar. | Roles 2118, 2119 | — |
| RN-CON-035 | Ventas: agrupación por grupo contable, tipo de comprobante, zona y rubro; la regla con más coincidencias define la cuenta; se puede desactivar el uso de grupos contables. | `CTCUENTA_ASIGNA` (`COD_GRU`, `COD_TPFC`, `ZON_FAC`, `COD_RUB`, `RUBRO_AFECTADO`); P2191 (RN-08 §6.4). | Replicar. | P2191 → PRM-CON-021 | — |
| RN-CON-036 | Modalidad de deudores por servicios: por tipo de factura (1) o por concepto (3, 5, 6); la 5 separa IVA. | P2190 (RN-08 §6.4). | Replicar como enum `receivableGrouping`. | P2190 → PRM-CON-020 | Significado de 3 y 6 |
| RN-CON-037 | Deudores por refinanciación: separar o no por tipo de deudor. | P2619 (RN-09). | Replicar. | P2619 → PRM-CON-022 | — |
| RN-CON-038 | Financiaciones: tomar el rubro del producto de financiación (variable 308) en asientos de ventas y cobranza. | P3061 (RN-09). | Replicar. | P3061 → PRM-CON-023 | Contenido de la variable 308 |
| RN-CON-039 | Los pagos de capital y servicios a contabilizar excluyen anulados y prescriptos y filtran por titulares activos/no activos y por el grupo contable del parámetro recibido. | `GetPagos` filtra por el grupo contable "actual" del objeto (defecto) (RN-08 §15.2). | Mejorar (corrige defecto). | — | — |
| RN-CON-040 | Validar la configuración antes de operar: la publicación de configuración y el validador nocturno detectan faltantes; al contabilizar, un faltante deja el evento pendiente. | La falta se detecta al contabilizar (RN-08 §13.2). | Mejorar. | — | A validar (PA-CON-02) |
| RN-CON-041 | El emisor del evento no elige cuentas; si un módulo necesita mostrar "asiento contable" (ej. en la OP), consulta a CON el asiento vinculado o la previsualización por reglas. | P2308 "Mostrar asiento contable en orden de pago" (sin uso directo, RN-09 COMPRAS). | Reemplazar por API de previsualización. | P2308 | — |

### 6.3 Asientos por módulo (detalle de imputación; matriz completa en §9.1)

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-CON-042 | Factura de compra: debe compras del rubro por neto + descuento (distribuido por sección); IVA crédito fiscal (rol o alícuota); ítems recibidos sin stock a "compras productos pendientes"; haber proveedor por neto + IVA y descuentos. Fecha: fecha contable de la factura. NC invierte signos. | `GererarAsiento_Compras_Facturacion` (RN-08 §6.2). | Replicar. | Roles 2112, 2113, 2159, 2162 | — |
| RN-CON-043 | IVA no tomado (factura con porcentaje de IVA computable menor a 100 o ítems marcados) se registra como gasto; con centros, el porcentaje de IVA puede cargarse por ítem. | P2890, P2902 (RN-08 §6.2). | Replicar. | P2890 → PRM-CON-030, P2902 → PRM-CON-031 | — |
| RN-CON-044 | IVA de compras por centro: según la asignación del impuesto IVA o, si no existe, proporcional a los ítems; el porcentaje de IVA computable de cada sección define la parte que va a crédito fiscal y la que va a gasto (prorrateo de crédito fiscal por actividades exentas). | `clsCierreDiario` 2328–2358 (P543); `CTSECCION.Porc_IVA_Compras` (RN-08 §5.3; CAT §17). | Replicar y explicitar. | P543 | Uso exacto de `Porc_IVA_Compras` |
| RN-CON-045 | Ítems de compra sin rubro no se contabilizan: el evento queda pendiente con el detalle del ítem. | Se imputan a cuenta 0 y se informan como faltantes (RN-08 §6.2). | Mejorar. | — | — |
| RN-CON-046 | Remitos de proveedor: asiento de entrega de materiales con stock contra "compras productos pendientes" solo si ese rol tiene cuenta; opción de incluir todos los remitos; la factura posterior cancela la cuenta de pendientes. | P2162 activa el asiento; P2982 todos los remitos (RN-08 §6.2). | Replicar. | P2162, P2982 → PRM-CON-032 | — |
| RN-CON-047 | Ítems de compra con obra: se imputan a la cuenta de la obra. | Obras con `COD_OBR` (RN-08 §6.2). | Replicar. | — | — |
| RN-CON-048 | Retenciones practicadas a proveedores: debe proveedor, haber cuenta del tipo de retención. | RN-08 §6.2. | Replicar. | — | — |
| RN-CON-049 | Pago a proveedores: debe proveedor (pago + descuento); haber descuentos obtenidos, caja de pagos (efectivo), valores en cartera o cuenta puente de pago con valores (cheques de terceros), cuenta del banco o su cuenta pendiente de débito (cheques propios), transferencias y VEP; con cuentas puente de efectivo/valores se genera además el devengamiento puente contra caja o valores en cartera. | `Compras_Pagos` (RN-08 §6.2). | Replicar. | Roles 2101, 2122, 2141, 2148, 2149, 2155, 2156 | — |
| RN-CON-050 | Tesorería y bancos generan asientos por tipo de movimiento: cambio de valores (cuenta de movimiento P2076), transferencias entre bancos, ingresos/egresos excepcionales contra la cuenta de la categoría, rechazo y recupero de valores (con concepto exento P2384 y gasto P2517), quebrantos (diferencias de caja), presentación y cobro de tarjetas con comisiones, presentación de retenciones, créditos y débitos bancarios, depósitos, extracciones, rechazos y débito de cheques propios. | `GenerarAsientoTesoreria`, `GenerarAsientoBancos` (RN-08 §6.3). | Replicar. | Roles 2118, 2119, 2121, 2127, 2128, 2134, 2136, 2137; P2076, P2384, P2517 | — |
| RN-CON-051 | Cobranza: debe caja/valores/tarjetas según grupo contable, retenciones sufridas, bancos de las transferencias y acreditaciones pendientes de entes; haber deudores por tipo de factura (y servicio) o deudores por refinanciación; excedentes a anticipos de clientes; no identificados a cuenta transitoria. | `GenerarAsiento_Cobranza` (RN-08 §6.4); AGR-012. | Replicar y ampliar. | Roles 2101, 2102, 2103, 2121, 2122, 2136, 2165 | — |
| RN-CON-052 | El cobro digital se registra en dos pasos: al confirmar el pago, debe "acreditaciones pendientes" del ente; al acreditar, debe banco, comisiones (y su IVA) y retenciones, haber acreditaciones pendientes. El ejemplo simplificado de CU-22 es el efecto neto. | Registración en `RESBAN` por comprobante, fecha de acreditación, caja o pago (RN-05). | Mejorar. | Rol 2165 | — |
| RN-CON-053 | Capital social: se suscribe al facturar o en la afiliación según configuración de M17, y se integra en el pago si así está configurado; el aporte nunca es ingreso por servicios. | P73, P2636, P2916 (RN-08 §6.4); BASE §97.7; AGR-029. | Replicar. | P73, P2636, P2916 (dueño M17) | — |
| RN-CON-054 | Stock en OT y OM: materiales al costo informado; horas de participantes valuadas a hora normal/extra contra las cuentas de mano de obra; opción de usar la cuenta de compras del rubro en lugar de la cuenta de stock de OT/OM. | `Stock_OT`, `Stock_OM` (RN-08 §6.5). | Replicar. | P2150, P2151, P2166, P2167, P2548, P2722, P2723 | — |
| RN-CON-055 | Conciliaciones de stock, vales (incluidos retiros de materiales de viviendas con obra por defecto), costo de mercadería vendida, entregas y retiros de comodato (si se muestra el asiento de comodato) y altas en orden. | RN-08 §6.5. | Replicar. | P2152, P2153, P2154, P2161, P2734, P755, P2670 | — |
| RN-CON-056 | El costo de los movimientos de stock lo informa STK en el evento (costo perpetuo); CON no valoriza. | Valorización a demanda que reescribe precios (`clsValorizarStock`, `_SegunValuacion`) (RN-08 §6.5, §8.4). | Reemplazar. | P2341 (dueño STK) | — |
| RN-CON-057 | Sueldos: formato 1 = asiento de recibos + asiento de contribuciones; 2 = asiento por sindicato; 3 = asiento personalizado por plantilla. | P2207 (RN-08 §6.6). | Replicar. | P2207 → PRM-CON-040 | — |
| RN-CON-058 | Pago de sueldos: el neto se cancela con la orden de pago generada (el empleado es proveedor en ProCoop); los adelantos pendientes se descuentan. | `GenerarPago` (RN-08 §11.5). | Mejorar (sin crear facturas de compra ficticias: evento `sue.payroll.paid`). | P2034, P2538, P2288 | — |
| RN-CON-059 | Fabricación: partes en producción → debe productos en proceso, haber cuenta de compras del rubro de cada componente costeado por PEPS (o cantidad × costo); finalizado → reparte el costo entre productos terminados por proporción de cantidades contra productos en proceso. | `Fabricacion_EnProduccion`, `Fabricacion_Finalizado` (RN-08 §10.4). | Replicar (costo desde STK). | Rol 3141 | — |
| RN-CON-060 | Bienes de uso: amortización lineal (tasa anual = porcentaje a amortizar / vida útil; mensual = anual / 12; prorrateo por días en meses parciales; mejoras y productos en asientos separados); asientos de disminución, baja y ajuste por inflación; cuentas por rubro (origen, amortización acumulada, del ejercicio, costo de venta, costo de baja, disminución, revalúo); el cálculo lo hace STK y CON contabiliza. | `BienesDeUso_Amortizacion` y siguientes (RN-08 §9). | Replicar (cálculo en STK). | P2936, P3076 | — |
| RN-CON-061 | Revertir o anular un asiento de amortización emite `con.entry.reversed` y STK revierte los acumulados del bien; un bien con amortizaciones contabilizadas no se elimina, se da de baja. | `clsAsiento.Eliminar` revierte acumulados; la eliminación masiva no (defecto); eliminar un bien pide registrar ajustes a mano (RN-08 §5.2, §15.2, §15.3). | Mejorar. | — | — |
| RN-CON-062 | Intereses de financiaciones y ventas en cuotas se reconocen como ganados al vencer/facturar cada cuota; hasta entonces están en "intereses a devengar"; el IVA de los intereses de refinanciaciones se devenga con la cuota. | Roles P2135, P2138, P2125 (RN-09). | Replicar. | Roles 2125, 2135, 2138 | Momento exacto de devengamiento de IVA en ProCoop |
| RN-CON-063 | Previsión para deudores incobrables y castigo: la previsión se constituye por asiento de ajuste; la declaración de incobrable aplica la previsión contra créditos sin borrar la deuda del historial; recuperos posteriores se imputan a la deuda original. | Rol P2126 (RN-09); MER-006. | Replicar. | Rol 2126 | — |
| RN-CON-064 | Prescripción de deuda: baja de créditos contra la cuenta de prescripción. | Rol P2158 (RN-09). | Replicar. | Rol 2158 | Cuenta usada (resultado o previsión) |
| RN-CON-065 | Intereses en segundo y tercer vencimiento facturados se acreditan a la cuenta de intereses. | Rol P2109 "Intereses en vencimientos dos y tres" (RN-09). | Replicar. | Rol 2109 | — |
| RN-CON-066 | Conceptos cobrados por cuenta y orden de terceros se registran como pasivo con el tercero y no como ingreso; la rendición cancela el pasivo. | BASE §97.4. | Replicar (regla obligatoria). | — | — |
| RN-CON-067 | El resumen de cuenta o el grupo de facturación no genera obligación ni asiento adicional; solo los documentos fiscales individuales o el comprobante multiservicio. | BASE §34 escenario 27, §44, §75, §103. | Replicar (invariante). | — | — |
| RN-CON-068 | Ingreso devengado, costo/gasto y cobro son magnitudes distintas: un pago parcial no reduce el ingreso registrado. | BASE §75. | Replicar (invariante). | — | — |
| RN-CON-069 | Compra de energía, cargos de abastecimiento, red y pérdidas se registran como costos y no como recargo del usuario. | BASE §87 (compras y costos versus tarifa). | Replicar. | Rol 2108 | Uso de P2108 "Energía eléctrica" (ingreso o costo) |
| RN-CON-121 | La factura del mayorista de energía o gas (M-126, M-127) y la liquidación de derechos de señales (M-128) se imputan a roles de costo del servicio (`wholesaleEnergyCost`, `wholesaleGasCost`, `signalRightsCost`) con servicio y zona o paquete en la dimensión; la factura de la programadora cancela el devengado de su liquidación y solo la diferencia afecta el costo. Amplía RN-CON-069. | Sin circuito relevado (FACT_EPEC informado en M06 §2). | Adoptar (HUE-ELE-01, HUE-GAS-04, HUE-TV-01). | PRM-CON-186, PRM-CON-187, PRM-CON-188 | Cuentas de costo de abastecimiento del piloto |
| RN-CON-122 | El subsidio social aprobado (EVT-SOC-04) se registra con rol `socialSubsidy` contra el fondo de subsidio (`socialSubsidyFund`) hasta su saldo y genera el pasivo con los beneficiarios (`socialSubsidyPayable`); el excedente sobre el fondo va a gasto o queda pendiente de revisión según PRM-CON-194; el pago lo cancela (M-129…M-131). | Sin regla relevada (BASE §92). | Adoptar (HUECO-SEP-03). | PRM-CON-189, PRM-CON-190, PRM-CON-191, PRM-CON-194 | Reglamento y naturaleza del fondo (PA-SOC-10) |
| RN-CON-123 | El depósito en garantía cobrado al socio (por ejemplo, el del préstamo ortopédico) es pasivo con el depositante (`guaranteesHeld`) y nunca ingreso; su devolución se registra como crédito a la cuenta del socio (saldo a favor de M07) y su aplicación a daños o faltantes sigue M-45 (M-132, M-133). | Sin rol de importe propio (RN-MOR-132 lo define como pasivo). | Adoptar (HUECO-OTR-04). | PRM-CON-169 | — |
| RN-CON-124 | La venta del derecho de sepultura se reconoce como ingreso del período al otorgarse el derecho y el mantenimiento como ingreso periódico (opción recomendada de PA-CON-17); si el tenant configura `deferredOverTerm`, el ingreso se difiere y devenga durante la vigencia del derecho (M-134, M-135). El IVA sigue la clase del concepto en M06; M15 no decide el tratamiento fiscal. | Sin tratamiento relevado. | Adoptar configurable (HUECO-CEM-04, PA-CON-17). | PRM-CON-193, PRM-CON-192 | Validar con el contador de la cooperativa piloto |
| RN-CON-125 | Un asiento pertenece a una sola entidad jurídica: todas sus líneas, su ejercicio y su período llevan el mismo `legalEntityId`; un evento cuyo documento de origen involucra dos entidades (cobro multi-entidad de M07, pago de una entidad por cuenta de otra) produce un asiento por entidad contra `rol:interEntityAccount` (PRM-CON-195), y la suma de las cuentas entre entidades del tenant es siempre cero. | `EMPRESAS` en ProCoop [VERIFICAR] si la contabilidad separa empresas. | Adoptar (DEC-064, DEC-087). | PRM-CON-195 | Tratamiento de la cuenta entre entidades con el contador de la piloto |
| RN-CON-127 | **Centros de costo por entidad jurídica (DEC-096).** Un centro de costo tiene entidad dueña (`legalEntityId`) y, opcionalmente, entidades con las que se comparte (`sharedWithLegalEntityIds`, sin repetir la dueña, todas activas y del mismo tenant). Se valida en cada renglón de `journalLines.costAllocations`, en `postingRules`, `accountRoles`, `costCenterModels`, `distributionModels`, `costAllocationRules`, `budgetLines` y `commitments`: el centro debe ser usable por la entidad del documento (dueña o compartida). El padre de un centro tiene la misma dueña y su lista compartida incluye la del hijo. Las corridas de distribución (`costDistributionRuns`) y el estado de resultados por sección (RF-CON-090) se calculan por entidad: un centro compartido acumula por separado lo imputado en cada entidad y nunca traslada costos entre entidades sin asiento con `rol:interEntityAccount` (RN-CON-125). **Alcance por entidad (dimensión `scope.legalEntities[]` de T02 RF-IAM-065; DEC-096):** ningún centro queda sin `legalEntityId`, tampoco los compartidos; un usuario ve y puede imputar un centro si su dueña o alguna entidad de `sharedWithLegalEntityIds` está en su alcance (y siempre para la entidad del documento), y solo lo edita, comparte o da de baja si la dueña está en su alcance; la auditoría (T02 RF-IAM-130) guarda la `legalEntityId` de la dueña. Se eligió este modelo, y no un `legalEntityId` opcional donde "vacío = compartido", porque es el mismo que M15 ya aplica al plan de cuentas (CTR-CON-21) y porque los ejercicios y asientos ya son siempre de una entidad. | `CTSECCION` sin empresa: las secciones valen para toda la base. | Mejorar (DEC-064, DEC-096). | — | — |
| RN-CON-128 | **Obligaciones propias del tenant como contribuyente (DEC-095).** Cuando M06 registra en `taxObligations` una obligación con `ownTaxObligationId` (contribución propia, por ejemplo una calculada sobre la base de capital que provee M17, o un impuesto propio no trasladable) y publica `fis.obligation.created`, M15 contabiliza la **provisión** (M-137) en la entidad jurídica de la obligación: debe al gasto del impuesto o contribución, haber a la deuda fiscal propia. El **pago** (M-138) cancela esa deuda contra el banco o la caja cuando M14 ejecuta el pago de la obligación (EVT-TES-15 `tes.paymentExecution.executed` con `taxObligation.ownTaxObligationId`). La anulación o recálculo de la obligación en M06 (por ejemplo, tras `ins.capitalBase.reopened` de M17) revierte la provisión y, si corresponde, registra la nueva: M15 lee la anulación de EVT-FIS-26 `fis.obligation.cancelled` (`obligationId`, `legalEntityId`, `ownTaxObligationId`, `reason`, `replacedByObligationId`, `cancellationStatus`, `creditBalanceAmount`) y, solo con `cancellationStatus = final`, registra el contraasiento de M-137 en la misma entidad jurídica, idempotente por `obligationId` (con `pendingPaymentReconciliation` espera; si trae `creditBalanceAmount`, el pago M-138 ya asentado no se revierte y queda como saldo a favor; M06 RN-FIS-133 punto 9); un recálculo llega como `fis.obligation.cancelled` de la anterior seguido de `fis.obligation.created` de la nueva con `replacesObligationId` (DEC-095, 10-11-2026). Las **exenciones** y regímenes especiales del registro de M06 no generan asiento. La fecha contable es el último día del período de la obligación (`period`) si el período contable de la entidad está abierto; si está cerrado, se aplica la política de período cerrado del módulo (§9.2 paso 5). Las cuentas salen de `entityAccountAssignments` con `entityType: ownTaxObligation` (cuenta de gasto y de deuda por registro) y, si no hay asignación, de los roles `ownTaxExpense` y `ownTaxPayable` (PRM-CON-196, PRM-CON-197). M15 no calcula el importe ni decide si la contribución corresponde: usa el importe de M06. | Sin equivalente en ProCoop (se registraba con asiento manual). | Adoptar (DEC-095). | PRM-CON-196, PRM-CON-197 | Cuentas y criterio de devengamiento de cada contribución con el contador de la piloto |
| RN-CON-126 | **Rol contable por clase de ítem** (`itemClass` de M05, RF-FAC-176, RN-FAC-156; llega en el renglón de `fac.invoice.issued` y en las imputaciones de `cob.payment.confirmed`): `guaranteeDeposit` → haber `rol:guaranteesHeld` (M-132; RN-CON-123); `subsidyFundContribution` → haber `rol:socialSubsidyFund` si el reglamento constituye el fondo con aportes, si no ingreso por M-01 (M-129; RN-CON-122); `burialRightAcquisition` → M-134 o M-135 según PRM-CON-193 (RN-CON-124); `burialRightMaintenance` → `rol:serviceRevenue` del servicio CEM por M-01; `standard` → cascada general (RN-CON-022). La clase prevalece sobre la regla por concepto: un renglón con clase especial nunca cae en `rol:serviceRevenue` por la cascada. Un renglón con clase desconocida queda pendiente de configuración, sin asiento provisorio. | Sin clase de ítem en ProCoop. | Adoptar (HUECO-OTR-04, HUECO-SEP-03, HUECO-CEM-04). | PRM-CON-169, PRM-CON-190, PRM-CON-192, PRM-CON-193 | Validar con el contador de la piloto |

### 6.4 Centros de costo

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-CON-070 | Los centros de costo se activan para todo el sistema o solo para sueldos. | P2547 general, P2714 sueldos (RN-08 §5.3). | Replicar. | PRM-CON-003, PRM-CON-004 | — |
| RN-CON-071 | Asignación por defecto por tipo de operación y tipo de elemento con porcentaje; tipos de operación: 1 ingresos/facturación, 2 compras, 3 ajuste por inflación, 4 asiento; tipos de elemento: producto, concepto, impuesto, cuenta, 8 ajuste por inflación, 9 asiento manual, 10 costo de mercadería vendida, 11 sección por defecto. | `CTSECCION_ASIGNA` (`TIPO_OPERACION`, `TIPO_ELEMENTO`, `COD_SER`, `COD_PRO`, `COD_IMP`, `COD_CON`, `COD_SEC`, `POR_ASIGNACION`, `COD_VAR`, `MODELO`, `COD_CTA`) (RN-08 §5.3, §15.2). | Replicar con enums con nombre. | — | Uso de `COD_VAR` |
| RN-CON-072 | Si un elemento no tiene asignación específica, la interfaz ofrece todos los centros con 0 % y exige completar 100 % antes de guardar. | `Get_Secciones` devuelve todas con 0 % (RN-08 §15.2). | Replicar. | — | — |
| RN-CON-073 | Porcentaje de sección = valor absoluto de (importe redondeado × 100 / importe del ítem); importes distribuidos suman el importe del renglón; el último centro absorbe la diferencia. | `CalcularPorcentaje` (RN-08 §15.2). | Replicar. | P2978 | — |
| RN-CON-074 | Al final de la contabilización, cualquier renglón sin centro de una cuenta que lo admite toma la distribución por defecto de la cuenta; si la cuenta exige centro y no hay defecto, el evento queda pendiente. | `CargarSeccionesDefault` (RN-08 §5.3). | Mejorar. | — | — |
| RN-CON-075 | Los centros habilitados por cuenta restringen los centros aceptados en sus renglones. | `CTSECC_X_CTA` (CAT §17). | Replicar. | — | — |
| RN-CON-076 | Bienes de uso, empleados, categorías de incidentes, grupos de obra e ítems de compra tienen distribución propia que prevalece sobre la asignación por defecto; en bienes de uso se muestran primero las asignadas y el resto con 0 %. | `Get_Secciones_Bienes`, `Get_Secciones_Emp`, `CAT_INCI_CTSEC`, `GRPOBRA_CTSEC`, `FPITEMS_CTSEC` (RN-08 §5.3, §15.3). | Replicar. | — | — |
| RN-CON-077 | La distribución analítica de costos comunes conserva importe, base, fecha, regla y destinos; el total distribuido iguala el importe asignado; los no asignados quedan identificados; no se vuelve a sumar como gasto. | BASE §75 (Costos), CU-CON-01. | Replicar (invariante). | — | — |
| RN-CON-078 | Ingresos por sección = ítems facturados × porcentaje de asignación de ingresos; egresos por sección = renglones de cuentas de naturaleza egresos con su distribución. | Ingresos por `CTSECCION_ASIGNA` tipo 1; egresos = cuentas que empiezan con "5" (fijo en código) (RN-08 §15.2). | Mejorar (por naturaleza). | — | — |
| RN-CON-079 | El servicio puede ser una dimensión o coincidir con un centro, pero no se impone esa equivalencia; la pertenencia al tenant es obligatoria. | BASE §75 (Límite y conceptos). | Replicar. | — | — |

### 6.5 Ejercicios, períodos y cierres

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-CON-080 | Ejercicio válido: desde < hasta, número único, sin solapamiento con otro y sin contener a otro. | `ValidarEjercicio`: mensaje de fechas invertido y no detecta contención (defectos) (RN-08 §15.2). | Mejorar. | — | — |
| RN-CON-081 | Toda operación de cualquier módulo con fecha en un período bloqueado para ese módulo, o anterior o igual a su fecha de bloqueo, se rechaza con "La fecha de la operación es anterior a la fecha de cierre de <módulo>". El módulo contable exige además ejercicio abierto. | `Nucleo.ModuloCerrado` con 11 fechas de cierre; contable exige `CTEJER.ABIERTO` y P2528 (RN-08 §1.1). | Reemplazar (`periodGuard`). | P67, P432, P500, P501, P502, P504, P505, P506, P2376, P2778, P2785, P2528 | — |
| RN-CON-082 | Reapertura de período o ejercicio: solicitud con motivo, aprobación (dos usuarios para ejercicio), auditoría; en ejercicio se revierten los asientos de cierre/apertura, no se borran. | Eliminar un asiento de cierre/apertura puede eliminar en cascada los tres y reabrir (RN-08 §5.2). | Reemplazar. | PRM-CON-011 | — |
| RN-CON-083 | Cierre de ejercicio: sin asientos de cierre previos; resultados (naturaleza ingresos y egresos) se saldan contra la cuenta de resultados de prefijo más largo coincidente o el rol asignación de resultados; luego el asiento patrimonial salda activo, pasivo y patrimonio neto incluyendo el resultado; la apertura invierte el patrimonial al día siguiente; se guardan los tres asientos con fecha y usuario. | `ValidarCierre`, `CierreResultados`, `CierreCtasPatrimoniales`, `AperturaEjercicio` (RN-08 §5.4). | Replicar (naturaleza en lugar de prefijos). | Rol 513; P508–P514 (migración) | — |
| RN-CON-084 | Cuentas de orden en el cierre según configuración. | El ejercicio no debe tener cuentas de orden (P512) con saldo (RN-08 §5.4). | A validar. | PRM-CON-012 | A validar (PA-CON-13) |
| RN-CON-085 | Saldos por ejercicio: el saldo de una cuenta a una fecha considera la apertura del ejercicio y los movimientos del ejercicio; el histórico total solo se usa para cuentas sin cierre. | `GetCuentas`: Σ debe − haber de todo el histórico (RN-08 §15.2). | Mejorar. | — | — |
| RN-CON-086 | Cierre de período mensual solo si no hay eventos pendientes, borradores, cajas abiertas (si la política lo exige) ni diferencias de conciliación sin justificar. | — (no existe en ProCoop). | Adoptar (BASE §22, §76). | PRM-CON-013 | — |

### 6.6 Planes múltiples, simulaciones, saldo único

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-CON-087 | Un solo plan operativo por ejercicio; los demás planes son representaciones (alternativo, regulatorio) o de simulación. La capacidad de varios planes no implica varios registros oficiales contradictorios. | Un único plan (`CTPLAN`). | Adoptar BASE §55. | — | A validar (PA-CON-05) |
| RN-CON-088 | Equivalencias: toda cuenta imputable con movimientos del período debe tener equivalencia para que la proyección o el escenario sea "comparable"; los repartos 1:N suman 100 %; ninguna cuenta destino recibe dos veces el mismo importe. | — | Adoptar BASE §55. | — | — |
| RN-CON-089 | Una cuenta alternativa puede reutilizar un código visible; su identidad incluye plan, versión y ámbito (real o simulado). | — | Adoptar BASE §75. | — | — |
| RN-CON-090 | Una simulación no emite comprobantes, no genera deuda, no mueve fondos, no envía órdenes a terceros ni contabiliza oficialmente; resultados identificados como simulación. | — | Adoptar BASE §55. | — | — |
| RN-CON-091 | La promoción de una configuración simulada o alternativa requiere acción explícita, nueva vigencia y auditoría; no convierte resultados simulados en asientos reales. | — | Adoptar BASE §55. | — | — |
| RN-CON-092 | El saldo contable se deriva exclusivamente de renglones contabilizados; no hay campos de saldo editables; el total no depende de la pantalla o proceso que lo consulte. | `CTPLAN` guarda `SDO_CTA`, `SAL_INI`, `SAL_ACT`, `FEC_MOV` (CAT §17). | Reemplazar (AGR-011). | — | — |
| RN-CON-093 | Ningún ajuste de saldo carece de operación, causa, autor y contrapartida. | — | Adoptar AGR-011. | — | — |

### 6.7 Plan de cuentas, rubros, renumeración y unificación

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-CON-094 | La jerarquía se define por cuenta padre explícita; la máscara de código es solo formato. Para migrar desde ProCoop, la jerarquía se deriva de los prefijos (11 dígitos = 6 + 5, luego prefijos de 5, 3 y 1, quitando ceros a la derecha). | `GetCuentaPadre`, `GetPrefijoCuenta` (RN-08 §5.1, §15.2). | Reemplazar (migración replica la derivación). | — | — |
| RN-CON-095 | La naturaleza de cada cuenta es un atributo; para migrar se deriva de los prefijos configurados (Activo P514 "1", Pasivo P508 "2", PN P509 "3", Ganancias P510 "4", Pérdidas P511 "5", Orden P512 "6"). | Prefijos de texto en parámetros (RN-08 §5.1). | Reemplazar. | P508–P514 | Valores en la cooperativa piloto |
| RN-CON-096 | Renumerar una cuenta cambia solo su código visible; como toda referencia es por id, no se reescriben tablas ni parámetros. | `Renumerar_Cuenta` clona, actualiza por SQL todas las columnas de cuentas y borra el origen; los parámetros 2101–2164 no se persisten (defecto) (RN-08 §5.1, §15.2). | Reemplazar. | — | — |
| RN-CON-097 | Unificar dos cuentas exige mismo plan y naturaleza, origen sin hijos o con hijos reasignados, aprobación y auditoría; no altera períodos cerrados. | `btnUinificar` en `abm_CtPlan` (INV). | Adoptar con controles. | — | Comportamiento exacto en ProCoop |
| RN-CON-098 | La reasignación masiva cambia en bloque rubros (productos, servicios, impuestos, conceptos de compra) o cuentas (bancos, roles, proveedores, tipos de factura); cuenta vacía se guarda como nula; cambiar un rubro genera una versión nueva auditada; no modifica asientos ya registrados. | `Reasignacion`, `ActualizarRubro` (clona como alta nueva) (RN-08 §15.2). | Replicar. | — | — |
| RN-CON-099 | Un rubro de producto pertenece como máximo a un rubro de capitalización. | `Exist_Rubro_Rubcapi` (RN-08 §15.2). | Replicar. | — | — |

### 6.8 Ajuste por inflación, libros, presupuesto, capital

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-CON-100 | Ajuste por inflación: coeficiente = índice del mes de cierre / índice del mes de origen de cada partida (o del inicio del ejercicio para saldos de apertura); diferencia contra RECPAM; solo cuentas ajustables. Falta de índice aborta. | `GenerarAsientoAjustesPorInflacion` (P2139) (RN-08 §5.5). | Replicar con método configurable. | Rol 2139 | Método exacto (anticuación) en ProCoop |
| RN-CON-101 | Revaluación de stock por índice: factor = índice del mes hasta / índice del mes del movimiento (o del mes desde si es anterior); en enero se toma el índice de diciembre del año anterior; productos sin rubro o rubro sin índice impiden revaluar. | `clsRevaluacion` (RN-08 §15.4). | Replicar (cálculo STK). | — | Criterio de enero |
| RN-CON-102 | Hojas rubricadas: folios correlativos sin saltos; líneas por hoja configurables; una vez transcripto un asiento, solo contraasiento. | `frmImprimirHojasRubricar.GuardarLineas` (INV). | Replicar y ampliar. | PRM-CON-050 | — |
| RN-CON-103 | Presupuesto, comprometido, devengado y pagado son estados distintos y no se suman como gastos independientes; el compromiso se libera al cancelar la OC sin generar ingresos. | — | Adoptar AGR-028. | — | — |
| RN-CON-104 | Capital y servicios se explican por separado; la baja de un servicio no produce egreso de asociado ni devolución de capital; cobrar un aporte no lo convierte en ingreso por consumo. El aporte de capital facturado (concepto con clase fiscal `capitalContribution`, RN-FIS-124 de M06) genera el asiento a capital social (M-02) y nunca a ingreso del servicio, aunque viaje en el mismo comprobante. | `ConservarCapital` genera asientos compensatorios en `CAPITAL` (RN-06). | Adoptar AGR-029. | — | — |
| RN-CON-105 | Excedentes: la distribución se contabiliza solo con resolución de asamblea registrada en M17; el cuadro propuesto aplica la normativa vigente validada por el contador (reservas y fondos legales, interés a cuotas sociales, retornos; resultados con no asociados a reserva especial). | — | Adoptar MER-011. | PRM-CON-060 | Porcentajes y art. 42 Ley 20.337 vigentes |

### 6.9 Reglas transversales del motor y de los datos contables

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-CON-106 | Si un evento económico llega con fecha contable dentro de un período ya bloqueado para el módulo contable (por ejemplo, una acreditación bancaria tardía cuyo módulo de origen seguía abierto), el asiento se fecha el primer día del primer período abierto, conserva `originalAccountingDate` y la leyenda `dict:con.entry.lateEvent`; nunca reabre el período automáticamente. | El proceso lee por rango de fechas: lo que cae en un rango ya contabilizado queda fuera o se duplica (RN-08 §6.1). | Mejorar. | PRM-CON-015 | — |
| RN-CON-107 | Todo renglón en moneda extranjera guarda moneda, cotización, importe en moneda original e importe en ARS; el equilibrio del asiento se controla en ARS; las diferencias de cambio de saldos monetarios en moneda extranjera se reconocen al cierre de cada período con la cotización publicada por TES. | `RESBAN` con cotización `COT_PES` en moneda extranjera (RN-08 §15.1 `RegistrarResBan`); sin revaluación contable de saldos. | Mejorar. | PRM-CON-016 | — |
| RN-CON-108 | Las cuentas marcadas `requiresService` (cuentas de control de créditos, ingresos por servicios, costos directos) exigen la dimensión servicio en cada renglón; un renglón sin servicio deja el evento pendiente. | Separación por tipo de factura o concepto (P2190), no por servicio explícito (RN-08 §6.4). | Mejorar (BASE §75 CON-005). | — | A validar (PA-CON-16) |
| RN-CON-109 | Planes, roles, reglas, centros y simulaciones pertenecen a un único tenant. Copiar un servicio a otro tenant (AGR-009) no copia cuentas ni reglas: la publicación en el destino exige reglas resueltas en el plan operativo del destino. | Una base por cooperativa. | Adoptar (DEC-002). | — | — |
| RN-CON-110 | El plan modelo y las reglas por defecto se ofrecen como plantilla de plataforma (`PLATFORM`); al aplicarla se copian al tenant y desde ese momento son del tenant. | — | Adoptar. | — | A validar (PA-CON-15) |
| RN-CON-111 | Una simulación congela (por versión y fecha de corte) las reglas, el plan, el universo de eventos y los supuestos; re-ejecutarla con los mismos insumos produce el mismo resultado. | — | Adoptar (BASE §55 "hipótesis identificables y repetibles"). | — | — |
| RN-CON-112 | La proyección de saldos (`ledgerBalances`) se actualiza en la misma transacción que el asiento; un job nocturno la reconstruye desde los renglones y una diferencia genera alerta crítica sin corregir en silencio. | Saldos guardados en `CTPLAN` (`SDO_CTA`, `SAL_ACT`) (CAT §17). | Reemplazar (AGR-011). | — | — |
| RN-CON-113 | Un asiento automático no es editable. Su corrección es: corregir la configuración, revertir y reprocesar el evento (nuevo asiento vinculado). Los asientos manuales en borrador son editables solo por su autor o por quien tenga `con.asientos.editar`. | Los asientos automáticos se pueden modificar o borrar como cualquier otro (RN-08 §5.2). | Reemplazar. | — | — |
| RN-CON-114 | La cuenta puente del rol `unmappedConceptSuspense` (P2111) solo recibe importes por tolerancia de redondeo; si al cerrar el período tiene saldo distinto de cero, el cierre exige justificación aprobada. | Recibe toda diferencia de compras y la de redondeo de asientos (RN-08 §5.2, §6.2). | Mejorar (T04b observación V2 2111). | PRM-CON-018 | — |
| RN-CON-115 | Un compromiso presupuestario no genera asiento oficial; vive solo en el registro presupuestario. | — | Adoptar AGR-028. | — | — |
| RN-CON-116 | La IA puede sugerir cuentas, centros y anomalías; nunca contabiliza, aprueba, cierra ni modifica reglas sin confirmación humana auditada. | — | Adoptar (CNX, AGR-030). | — | — |
| RN-CON-117 | Cada asiento guarda fecha contable (`accountingDate`) y fecha de registro (`recordedAt`); todos los reportes permiten elegir cualquiera de las dos, y la de registro nunca se modifica. | `FEC_ASI` y `FEC_REG` en `CTASIEN`; listado por cualquiera de las dos (RN-08 §15.2 `GetAsientos`). | Replicar (AGR-010). | — | — |
| RN-CON-118 | Los cobros en exceso se registran como anticipos o saldos a favor del asociado y los cobros no identificados en una cuenta transitoria; nunca como ingreso. | No hay circuito explícito (BASE §102 AGR-012). | Adoptar AGR-012. | Roles `customerAdvances`, `unidentifiedCollections` | — |
| RN-CON-119 | Las retenciones sufridas en cobros se reconocen como crédito fiscal al confirmarse el cobro, no al presentarlas; la presentación solo cambia su ubicación de cartera (TES) y el cómputo (FIS). | Retenciones en `TESORE` tipo 5; asiento al presentar (RN-08 §6.3). | Mejorar. | Rol `withholdingsSuffered` (P2136) | — |
| RN-CON-120 | Libros, asientos y documentación respaldatoria se conservan íntegros como mínimo durante el plazo legal (art. 328 del Código Civil y Comercial: diez años) y no se purgan aunque el tenant se dé de baja; la baja del tenant entrega una exportación completa (T01). | Sin política explícita. | Adoptar (T08, AGR-023). | — | Plazo y alcance con el área contable y legal |

## 7. Modelo de datos

Convenciones comunes a todas las colecciones (Guía §5): `tenantId` (ObjectId, obligatorio), `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `version` (control optimista); importes `Decimal128` con `decimal.js`; fechas UTC con zona del tenant; los documentos económicos (asientos contabilizados, lotes confirmados, corridas de ajuste, estados emitidos) **nunca se borran**: se anulan o revierten. Todos los índices compuestos empiezan por `tenantId`. Las colecciones de simulación (`simulatedJournalLines`) están físicamente separadas de las oficiales.

> **Corrección 05-11-2026 (tablas de campos):** las colecciones que este §7 describía solo en texto corrido o en tablas resumen tienen ahora su tabla de campos (Campo, Tipo, Oblig., Descripción, Referencia), debajo de su descripción original, que se conserva. Tipos y obligatoriedad se deducen del texto del anexo y de T05 §7.7; donde no se pueden deducir figura `[VERIFICAR]`. La columna Referencia declara la colección destino y su anexo dueño. Cuando T05 usa otro nombre para el campo, la tabla usa el de T05 y anota "Antes `x`". Las tablas de campos que ya existían incorporan también la columna Referencia.

**Entidad jurídica (DEC-064, DEC-087):** la contabilidad se lleva por entidad jurídica del tenant (`legalEntities` de T04, equivalente a `EMPRESAS` de ProCoop). Llevan `legalEntityId` obligatorio: `fiscalYears`, `accountingPeriods`, `journalEntries` (y desnormalizado en `journalLines`), `postingBatches`, `ledgerBalances`, `ledgerProjections`, `inflationAdjustmentRuns`, `reconciliationRuns`, `rubricatedBooks`, `financialStatementRuns`, `budgets`, `commitments` y `externalLedgerTransfers`; `costCenters` lleva `legalEntityId` obligatorio (entidad dueña) y `sharedWithLegalEntityIds`, con el mismo criterio que el plan de cuentas (DEC-096, RN-CON-127). Cada entidad tiene sus ejercicios, su numeración de asientos por ejercicio, sus libros rubricados y sus estados contables; `chartOfAccounts` puede compartirse entre entidades o ser propio. **Corregido (RF-CFG-136 de T04, que incluye `chartOfAccounts`, `journalEntries` y `fiscalYears` en el esquema base con `legalEntityId` obligatorio):** el plan lleva `legalEntityId` obligatorio (entidad dueña del plan) y `sharedWithLegalEntityIds` [ObjectId] para las demás entidades que lo usan (antes `legalEntityIds` vacío = todas); el validador del esquema base rechaza asientos, ejercicios o planes sin entidad o con entidad inactiva a su fecha. Un asiento nunca mezcla entidades: el evento económico trae `legalEntityId` del documento de origen y, si un hecho afecta a dos entidades (por ejemplo, un cobro de caja de la entidad A por deuda de B, RN-COB-153 de M07), se generan dos asientos con la cuenta entre entidades (`rol:interEntityAccount`). Los informes consolidados del tenant suman entidades sin alterar los libros.

**Nombres canónicos (T05 §7.2, CTR-DAT-30 y 31):** `ledgerAccountId` (antes `accountId` en este anexo), `accountId` para la cuenta del asociado de M01 en dimensiones (antes `memberAccountId`), `legalEntityId` (antes `companyId`), `treasuryAccountId` (antes `bankAccountId`), `storedFileId(s)` (antes `fileId(s)`); subdocumento `legacy` de T05 (antes `legacyCode`); períodos como `period` (`YYYY-MM`) + `sequence` (antes `year`, `month`).

### 7.1 `accountingSettings` (una por tenant, versionada vía T04)

Propósito: configuración contable general. Origen: RN-09 CONTABILIDAD; `VARIABLE`.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `operativeChartByFiscalYear` | `[{ fiscalYearId, chartId }]` | Sí | Plan operativo por ejercicio. | — |
| `functionalCurrency` | String | Sí | `ARS`. | — |
| `entryNumberFormat` | `{ mode: 'sequential'\|'prefix4seq4', startAt }` | Sí | PRM-CON-005. | — |
| `costCenters` | `{ enabled: Boolean, scope: 'all'\|'payrollOnly', percentDecimals: Int }` | Sí | P2547, P2714, P2978. | — |
| `rounding` | `{ toleranceAbs: Decimal128, tolerancePct: Decimal128 }` | Sí | PRM-CON-008/009. | — |
| `postingModes` | `[{ sourceModule: enum, mode: 'realtime'\|'dailySummary'\|'rangeSummary', granularity: 'perOperation'\|'summary', groupBy: [String], dateBasis: enum }]` | Sí | Por módulo (fac, cob, mor, fis, cmp, tes, stk, sue, ins, soc, tec, ven). | — |
| `receivableGrouping` | enum `byBillingType`\|`byConcept`\|`byConceptSplitVat`\|`byConceptAlt3`\|`byConceptAlt6` | Sí | P2190. | — |
| `useCollectionAccountingGroups` | Boolean | Sí | Inverso de P2191. | — |
| `splitRefinancingDebtorsByType` | Boolean | Sí | P2619. | — |
| `unpostablePolicy` | enum `pendingNoBlock`\|`blockSource`\|`suspenseAccount` | Sí | PA-CON-02. | — |
| `cashPostingTrigger` | enum `onPaymentConfirmed`\|`onCashboxClosed` | Sí | P3100, PA-CON-10. | — |
| `voidPolicy` | enum `draftDeleteVoidOpenReverseClosed`\|`physicalDeleteOpen`\|`reverseOnly` | Sí | PA-CON-04. | — |
| `manualEntryApproval` | `{ thresholdAmount: Decimal128, types: [String] }` | No | PRM-CON-010. | — |
| `periodCloseChecklist` | `{ requireCashboxesClosed, requireReconciliations, requireDepreciation, requireProvisions }` Booleans | Sí | PRM-CON-013. | — |
| `closing` | `{ memorandumAccounts: 'carryForward'\|'requireZero', reopenApprovers: Int }` | Sí | PA-CON-13. | — |
| `inflation` | `{ enabled, indexSeriesId, frequency: 'annual'\|'monthly', method: enum }` | No | PA-CON-07. | — |
| `budgetControl` | `{ policy: 'warn'\|'authorize'\|'block'\|'info', sources: [String] }` | No | PA-CON-09. | — |
| `externalLedger` | `{ enabled, systemName, layoutId, mode: 'incremental'\|'full' }` | No | SISCONT. | — |
| `lateEventPolicy` | enum `firstOpenDay`\|`error` | Sí | PRM-CON-015 (RN-CON-106). | — |
| `fxRevaluation` | `{ enabled, source: 'tes' }` | Sí | PRM-CON-016 (RN-CON-107). | — |
| `publicationPolicyOnMissingRule` | enum `warn`\|`block` | Sí | PRM-CON-017 (RF-CON-006). | — |
| `suspenseTolerance` | Decimal128 | Sí | PRM-CON-018 (RN-CON-114). | — |
| `healthCheckSchedule` | String cron | Sí | PRM-CON-019. | — |
| `configVersionId` | ObjectId | Sí | Versión T04 publicada. | `configVersions` (T04) |

Índice: `{ tenantId: 1 }` único.

### 7.2 `chartOfAccounts`

Propósito: planes de cuentas. Origen: `CTPLAN` (plan único implícito).

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | String | Sí | Ej. `PC-OPER-01`. | — |
| `name` | String | Sí | — | — |
| `legalEntityId` | ObjectId → T04 | Sí | Entidad dueña del plan (RF-CFG-136 de T04; DEC-064). | `legalEntities` (T04) |
| `sharedWithLegalEntityIds` | [ObjectId → T04] | No | Otras entidades del tenant que usan este plan; vacío = solo la dueña. | `legalEntities` (T04) |
| `purpose` | enum `operative`\|`alternative`\|`simulation`\|`regulatory`\|`external` | Sí | RF-CON-008. | — |
| `status` | enum `draft`\|`approved`\|`operative`\|`alternative`\|`archived` | Sí | §8.2. | — |
| `versionNumber` | Int | Sí | — | — |
| `copiedFromChartId` | ObjectId | No | Origen de la copia. | `chartOfAccounts` (M15) |
| `codeMask` | String | Sí | Ej. `9.9.99.99.999` o `99999999999`. | — |
| `validFrom` / `validTo` | Date | Sí / No | Vigencia. | — |
| `regulatoryTarget` | enum `INAES`\|`OCEBA`\|`ERSEP`\|`other` | No | Para plan regulatorio. | — |
| `scenarioId` | ObjectId | No | Si `purpose = simulation`. | `simulationScenarios` (M15) |
| `approvedBy` / `approvedAt` | ObjectId / Date | No | — | `memberships` (T02) |

Índices: `{ tenantId, code, versionNumber }` único; `{ tenantId, status }`; `{ tenantId, legalEntityId, purpose, status }`.

### 7.3 `accountRubrics`

Propósito: rubros y subrubros contables. Origen: `CTSRUBROS` (`COD_RUB`, `DES_RUB`, `TIP_RUB`), `CTPLAN_SUBRUBROS` (`COD_SUBRUBRO`, `DESCRIPCION`).

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `chartId` | ObjectId | Sí | — | `chartOfAccounts` (M15) |
| `kind` | enum `rubric`\|`subrubric` | Sí | — | — |
| `parentRubricId` | ObjectId | No | Para subrubros. | `accountRubrics` (M15) |
| `code`, `name` | String | Sí | — | — |
| `rubricType` | enum `asset`\|`liability`\|`equity`\|`income`\|`expense`\|`memorandum` | Sí | `TIP_RUB`. | — |
| `statementLine` | String | No | Línea por defecto en estados. | — |
| `currentNonCurrent` | enum `current`\|`nonCurrent`\|`na` | No | Exposición corriente/no corriente. | — |
| `legacy` | Object (T05) | No | Migración: `{system: 'procoop', table: 'CTSRUBROS', key, displayKey, ...}` (antes `legacyCode`). | — |

Índice: `{ tenantId, chartId, kind, code }` único.

### 7.4 `ledgerAccounts`

Propósito: cuentas contables. Origen: `CTPLAN` (`COD_PLAN`, `COD_CTA`, `CON_CTA`, `NOM_CTA`, `TIP_CTA`, `AJU_CTA`, `SDO_CTA`, `SAL_INI`, `SAL_ACT`, `FEC_MOV`, `DIG_VER`, `COD_SCC`, `COD_RUB` y 7 más), `CTSECC_X_CTA`.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `chartId` | ObjectId | Sí | Identidad incluye el plan (RN-CON-089). | `chartOfAccounts` (M15) |
| `code` | String | Sí | Código visible según máscara. | — |
| `codeHistory` | `[{ code, changedAt, changedBy }]` | No | Renumeraciones (RF-CON-020). | — |
| `name` | String | Sí | `NOM_CTA`. | — |
| `parentId` | ObjectId | No | Árbol. | `ledgerAccounts` (M15) |
| `path` | [ObjectId] | Sí | Ancestros (consultas por rama). | `ledgerAccounts` (M15) |
| `level` | Int | Sí | — | — |
| `postable` | Boolean | Sí | Imputable. | — |
| `nature` | enum `asset`\|`liability`\|`equity`\|`income`\|`expense`\|`memoDebit`\|`memoCredit` | Sí | RF-CON-012. | — |
| `normalBalance` | enum `debit`\|`credit` | Sí | — | — |
| `rubricId` / `subrubricId` | ObjectId | No / No | RF-CON-013. | `accountRubrics` (M15) |
| `inflationAdjustable` | Boolean | Sí | `AJU_CTA`. | — |
| `monetary` | Boolean | Sí | Partida monetaria (para RECPAM). | — |
| `currency` | String | Sí | `ARS` por defecto. | — |
| `costCenterPolicy` | enum `forbidden`\|`optional`\|`required` | Sí | RF-CON-015. | — |
| `allowedCostCenterIds` | [ObjectId] | No | `CTSECC_X_CTA`; vacío = todos. | `costCenters` (M15) |
| `defaultAllocation` | `{ modelId \| splits: [{ costCenterId, pct }] }` | No | Sección por defecto (elem 11). | — |
| `requiredDimensions` | [enum `service`\|`supplier`\|`member`\|`bank`\|`employee`\|`asset`\|`work`] | No | Ej. créditos por servicios exige `service`; `service` en la lista equivale a `requiresService` de RN-CON-108. | — |
| `controlAccountOf` | enum `memberReceivables`\|`suppliers`\|`cash`\|`bank`\|`valuesPortfolio`\|`stock`\|`fixedAssets`\|`capital`\|`payroll`\|`vat`\|`thirdParty`\|`none` | Sí | Para conciliaciones. | — |
| `subaccountCode` | String | No | `COD_SCC` (P2814). | — |
| `checkDigit` | String | No | `DIG_VER`. | — |
| `statementLines` | `[{ templateId, lineCode }]` | No | RF-CON-019. | — |
| `inaesCategoryId` | ObjectId | No | Catálogo de M17. | `inaesCategories` (M17) |
| `mergedIntoAccountId` | ObjectId | No | Unificación (RF-CON-021). | `ledgerAccounts` (M15) |
| `status` | enum `active`\|`inactive` | Sí | — | — |
| `validFrom` / `validTo` | Date | Sí / No | — | — |
| `legacy` | Object (T05) | No | `{system: 'procoop', table: 'CTPLAN', key, displayKey}`; `displayKey` = código de 11 dígitos ProCoop (antes `legacyCode`). | — |

Índices: `{ tenantId, chartId, code }` único; `{ tenantId, chartId, parentId }`; `{ tenantId, chartId, nature, postable }`. No guarda saldos (RN-CON-092).

### 7.5 `accountRoles`

Propósito: cuentas por defecto tipadas (reemplazo de parámetros-cuenta). Origen: `VARIABLE` P513, P2101–P2167, P3141; enum `TipoCuenta`.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `chartId` | ObjectId | Sí | — | `chartOfAccounts` (M15) |
| `roleKey` | String (catálogo §14.2) | Sí | Ej. `vatOutputRegistered`. | — |
| `ledgerAccountId` | ObjectId | No | Vacío = sin asignar (aparece en validador). | `ledgerAccounts` (M15) |
| `costCenterModelId` | ObjectId | No | Modelo de centro de costo por defecto del rol (PA-CON-18). | `costCenterModels` (M15) (antes `distributionModels` (M15) [VERIFICAR]) |
| `overrides` | `[{ dimension: enum service, branch, costCenter, cashDesk, tax, card, agency, supplier, project; value; ledgerAccountId }]` | No | Override por dimensión (T04b: "override por servicio / centro de costo"). | — |
| `legacyVariable` | Int | No | Ej. 2104. | — |
| `prmId` | String | No | PRM-ID de T04b (ej. `PRM-CON-P4-015`). | — (código del catálogo de parámetros de T04b, no es referencia a una colección) |
| `validFrom` | Date | Sí | — | — |

Índice: `{ tenantId, chartId, roleKey, validFrom }` único.

### 7.6 `postingRules`

Propósito: reglas de imputación. Origen: `CTCUENTA_ASIGNA` (`COD_CTA`, `TIP_CTA`, `COD_GRU`, `COD_TPFC`, `ZON_FAC`, `COD_RUB`, `RUBRO_AFECTADO`), `SISCONT` (`DES_OPEINT`, `COD_CTA`, `COD_RUB`, `OPERACION`, `OBSERVAC`), cuentas en entidades.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `chartId` | ObjectId | Sí | — | `chartOfAccounts` (M15) |
| `code`, `name` | String | Sí | Ej. `R-104`. | — |
| `eventType` | String | Sí | Ej. `fac.invoice.issued` o `*`. | — |
| `amountRole` | String | Sí | Ej. `net`, `vat`, `perception`, `receivable`, `cash`. | — |
| `side` | enum `debit`\|`credit`\|`bySign` | Sí | — | — |
| `conditions` | `{ serviceId, conceptId, productId, rubricId, accountingGroupId, billingTypeId, zoneId, paymentMethodId, valueTypeId, treasuryAccountId, cashboxId, collectorEntityId, supplierId, supplierCategoryId, employeeId, payrollConceptId, unionId, legalEntityId, workId, incidentCategoryId, assetId, warehouseId, branchId, taxId, vatRateId, taxCondition, memberType }` (cada uno opcional, valor o lista) | Sí | Más coincidencias gana. | — |
| `ledgerAccountId` | ObjectId | Sí | Destino. | `ledgerAccounts` (M15) |
| `costCenterModelId` / `costCenterId` | ObjectId | No | Centro o modelo (PA-CON-18). | `costCenterModels` (M15) (antes `distributionModels` (M15) [VERIFICAR]) / `costCenters` (M15) |
| `priority` | Int | Sí | Desempate. | — |
| `validFrom` / `validTo` | Date | Sí / No | — | — |
| `status` | enum `active`\|`inactive` | Sí | — | — |
| `ruleVersion` | Int | Sí | — | — |
| `legacySource` | `{ table, id }` | No | Migración. | — |

Índices: `{ tenantId, chartId, eventType, amountRole, status }`; `{ tenantId, code }` único.

### 7.7 `accountingEvents` (bandeja)

Propósito: eventos económicos recibidos. Origen: nuevo (ProCoop relee movimientos por fecha).

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `sourceEventId` | String | Sí | Id del evento outbox (idempotencia). | `outboxEvents` (T01) |
| `eventType` | String | Sí | `<modulo>.<entidad>.<hecho>`. | — |
| `sourceModule` | enum | Sí | — | — |
| `sourceDocument` | `{ type, id, number, issuedAt }` | Sí | Documento de origen. | — |
| `accountingDate` | Date | Sí | Según base del módulo. | — |
| `currency`, `fxRate` | String, Decimal128 | Sí | — | — |
| `lines` | `[{ amountRole, amount: Decimal128, sign: +1\|-1, dimensions: {...}, costAllocation: [{ costCenterId, pct, amount }], memo }]` | Sí | Renglones económicos (sin cuentas). | — |
| `reversesEventId` | String | No | Para anulaciones. | `accountingEvents` (M15) |
| `originalAccountingDate` | Date | No | Fecha original de un evento tardío (RN-CON-106). | — |
| `status` | enum `received`\|`posted`\|`pendingConfiguration`\|`error`\|`ignored`\|`reversed` | Sí | §8.3. | — |
| `issues` | `[{ code, message, amountRole, missing: { roleKey \| entity }, configPath }]` | No | Faltantes con ruta de configuración. | — |
| `journalEntryId` / `journalLineIds` | ObjectId / [ObjectId] | No | Vínculo. | `journalEntries` (M15) / `journalLines` (M15) |
| `postingBatchId` | ObjectId | No | Si fue por lote. | `postingBatches` (M15) |
| `attempts` | Int | Sí | — | — |
| `receivedAt`, `postedAt` | Date | Sí / No | — | — |

Índices: `{ tenantId, sourceEventId }` único; `{ tenantId, status, accountingDate }`; `{ tenantId, sourceModule, accountingDate }`; `{ tenantId, 'sourceDocument.type', 'sourceDocument.id' }`.

### 7.8 `journalEntries`

Propósito: cabecera de asiento. Origen: `CTASIEN` (`COD_ASI`, `COD_AS`, `DES_ASI`, `FEC_REG`, `FEC_ASI`, `GRABO`, `REVISO`, `AUTORI`, `APERTURA`, `CIERRE`, `USER_ADD`, `USER_MOD`, `FEC_REG_MANUAL`), `CIERRE`.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `legalEntityId` | ObjectId → T04 | Sí | Entidad jurídica del asiento (DEC-064); igual a la del ejercicio. | `legalEntities` (T04) |
| `chartId`, `fiscalYearId`, `periodId` | ObjectId | Sí | — | `chartOfAccounts` (M15) / `fiscalYears` (M15) / `accountingPeriods` (M15) |
| `internalNumber` | Long | Sí | Global inmutable (`COD_ASI`). | — |
| `entryNumber` | Int | Sí (al contabilizar) | Por entidad jurídica y ejercicio (`COD_AS`). | — |
| `entryDate` | Date | Sí | `FEC_ASI`. | — |
| `recordedAt` | Date | Sí | `FEC_REG` (AGR-010). | — |
| `description` | String | Sí | `DES_ASI`. | — |
| `type` | enum `manual`\|`automatic`\|`adjustment`\|`opening`\|`resultClosing`\|`balanceClosing`\|`inflation`\|`imported`\|`reversal`\|`surplusDistribution`\|`reclassification`\|`provision` | Sí | — | — |
| `sourceType` | enum `user`\|`event`\|`batch`\|`import`\|`template`\|`closing` | Sí | RN-CON-010. | — |
| `status` | enum `draft`\|`pendingApproval`\|`posted`\|`voided`\|`reversed` | Sí | §8.1. | — |
| `totalDebit` / `totalCredit` | Decimal128 | Sí | Iguales. | — |
| `sourceEventIds` | [String] | No | Eventos incluidos (si son muchos, solo en renglones y bandeja). | `outboxEvents` (T01) |
| `sourceDocuments` | `[{ type, id, number }]` | No | Para asientos por operación. | — |
| `postingBatchId` | ObjectId | No | — | `postingBatches` (M15) |
| `templateId` | ObjectId | No | — | `entryTemplates` (M15) |
| `reversesEntryId` / `reversedByEntryId` | ObjectId | No | — | `journalEntries` (M15) |
| `autoReverseOn` | Date | No | Provisiones. | — |
| `originalAccountingDate` | Date | No | RN-CON-106. | — |
| `recordedBy` / `reviewedBy` / `approvedBy` | ObjectId | Sí / No / No | `GRABO`, `REVISO`, `AUTORI`. | `memberships` (T02) |
| `approvalRequestId` | ObjectId | No | T11. | `workflowInstances` (T11) |
| `attachments` | [ObjectId] | No | Expediente T11. | `documents` (T11) |
| `rubricatedBookId` | ObjectId | No | Transcripción (antes en una fila conjunta con `folio`, PA-CON-19). | `rubricatedBooks` (M15) |
| `folio` | Int | No | Folio del libro rubricado donde se transcribió. | — (número, no es referencia) |
| `voidReason` | String | No | — | — |
| `configVersionId` | ObjectId | Sí | Reglas aplicadas. | `configVersions` (T04) |
| `exported` | `[{ externalSystem, exportBatchId, at }]` | No | SISCONT. | — |
| `importSource` | `{ fileName, row, externalId }` | No | — | — |

Índices: `{ tenantId, legalEntityId, fiscalYearId, entryNumber }` único parcial (status posted/voided/reversed; antes sin `legalEntityId`); `{ tenantId, internalNumber }` único; `{ tenantId, entryDate, status }`; `{ tenantId, type }`; `{ tenantId, 'sourceDocuments.id' }`.

### 7.9 `journalLines`

Propósito: renglones. Origen: `CTITASIE` (`COD_ITA`, `COD_ASI`, `COD_LIN`, `COD_CTA`, `DEB_CTA`, `CRE_CTA`, `OBS_LIN`), `CTITASIE_SECCIONES` (`COD_ITS`, `COD_ITA`, `COD_SEC`, `IMPORTE`).

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `entryId` | ObjectId | Sí | — | `journalEntries` (M15) |
| `lineNo` | Int | Sí | `COD_LIN`. | — |
| `chartId`, `ledgerAccountId` | ObjectId | Sí | — | `chartOfAccounts` (M15) / `ledgerAccounts` (M15) |
| `legalEntityId`, `entryDate`, `fiscalYearId`, `periodId`, `entryStatus` | desnormalizados | Sí | Para mayores por entidad jurídica (DEC-064). `entryStatus` copia `journalEntries.status` (§8.1: `draft`, `pendingApproval`, `posted`, `voided`, `reversed`; antes sin valores). | `legalEntities` (T04) / `fiscalYears` (M15) / `accountingPeriods` (M15) |
| `debit` / `credit` | Decimal128 | Sí | Uno es cero. | — |
| `currency`, `fxRate`, `amountCurrency` | — | No | Moneda extranjera. | — |
| `memo` | String | No | `OBS_LIN`. | — |
| `dimensions` | `{ serviceId, accountId, supplierId, treasuryAccountId, employeeId, assetId, workId, conceptId, ... }` | No | Explicabilidad y conciliación. | — |
| `costAllocations` | `[{ costCenterId, pct: Decimal128, amount: Decimal128 }]` | Según cuenta | Suma = importe del renglón. | — |
| `resolution` | `{ path: 'entity'\|'rule'\|'role', ruleId, roleKey, matches: Int }` | No | RF-CON-054. | — |
| `sourceEventIds` | [String] | No | Eventos agregados. | `outboxEvents` (T01) |
| `sourceDocumentRefs` | `[{ type, id }]` | No | Drill-down (hasta N; si excede, vía bandeja). | — |

Índices: `{ tenantId, ledgerAccountId, entryDate }`; `{ tenantId, entryId, lineNo }` único; `{ tenantId, 'costAllocations.costCenterId', entryDate }`; `{ tenantId, 'dimensions.serviceId', ledgerAccountId, entryDate }`.

### 7.10 `entryTemplates`

Propósito: asientos personalizados, recurrentes y de sueldos formato 3. Origen: `abm_Asiento_Personalizado`, `SU_ASIENTOS` (`ID_ASIENTO`, `DES_ASIENTO`, `DES_GRAL`, `CTA_DEBE`, `CTA_HABER`, `COD_EMPR`, `COD_SIN`, `COD_CATS`, `EMPLEADOS`, `COD_SEC`, `COD_CAR`, `COD_DEPTO` y 16 más).

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `chartId` | ObjectId | Sí | Plan de cuentas de las líneas (clave de T05 COL-CON; PA-CON-19). | `chartOfAccounts` (M15) |
| `code`, `name`, `description` | String | Sí | — | — |
| `usage` | enum `manual`\|`recurring`\|`payroll`\|`provision`\|`closingAdjustment` | Sí | — | — |
| `lines` | `[{ ledgerAccountId \| roleKey, side, basis: 'fixed'\|'pctOfBase'\|'formula', value, formula, costCenterModelId, filters: { legalEntityId, unionId, categoryIds, employeeIds, costCenterId, positionId, departmentId } }]` | Sí | — | — |
| `recurrence` | `{ frequency, dayOfPeriod, autoReverse: Boolean }` | No | — | — |
| `status` | enum `active`\|`inactive` | Sí | — | — |

### 7.11 `postingBatches` (lotes de contabilización, "Cierre automático")

Origen: `frmCierreDiario`, `frmCierreDiario_Resultado`, `clsCierreDiario`.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `number` | Int | Sí | Antes `batchNumber`. Único por tenant (T05; PA-CON-19). | — |
| `dateFrom` / `dateTo` | Date | Sí | — | — |
| `modules` | [enum `sales`\|`otherPeriodPayments`\|`collections`\|`treasury`\|`banks`\|`financing`\|`purchases`\|`stock`\|`capital`\|`payroll`\|`manufacturing`\|`fixedAssets`\|`yearClosing`\|`inflationAdjustment`] | Sí | Orden de ProCoop. | — |
| `options` | `{ dailyDetail: Boolean, perOperation: Boolean, composition: Boolean, salesUseIssueDate: Boolean, billingTypeFilter: [ObjectId], stockValuationMethod: String, fiscalYearId }` | Sí | Opciones del formulario. | — |
| `status` | enum `preparing`\|`preview`\|`confirming`\|`confirmed`\|`discarded`\|`failed` | Sí | §8.5. | — |
| `progress` | `{ total, processed, failed }` | Sí | Job reanudable. | — |
| `draftEntryIds` / `postedEntryIds` | [ObjectId] | No | — | `journalEntries` (M15) |
| `warnings` | `[{ code, message }]` | No | Cajas abiertas, eventos pendientes. | — |
| `requestedBy`, `confirmedBy` | ObjectId | Sí / No | — | `memberships` (T02) |

### 7.12 `fiscalYears`

Origen: `CTEJER` (`COD_EJE`, `FEC_INI`, `FEC_FIN`, `ABIERTO`, `FEC_CIE`, `USER_CIE`, `NUM_EJE`, `ID_ASIENTO_CIERRE1`, `ID_ASIENTO_CIERRE2`, `ID_ASIENTO_APERTURA`).

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `legalEntityId` | ObjectId → T04 | Sí | Entidad jurídica del ejercicio (DEC-064); en la migración, la empresa de ProCoop (`EMPRESAS`) que T07 asigne, o la única del tenant [VERIFICAR] cómo separa ProCoop los ejercicios por empresa. | `legalEntities` (T04) |
| `number` | Int | Sí | `NUM_EJE`. | — |
| `startDate` / `endDate` | Date | Sí | — | — |
| `status` | enum `planned`\|`open`\|`closing`\|`closed`\|`reopened` | Sí | §8.4. | — |
| `irregular` | Boolean | Sí | — | — |
| `closingEntries` | `{ resultClosingId, balanceClosingId, openingId }` | No | Cierre1, cierre2, apertura. | — |
| `closedAt` / `closedBy` | Date / ObjectId | No | `FEC_CIE`, `USER_CIE`. | `memberships` (T02) |
| `history` | `[{ action, at, by, reason, approvalRequestId }]` | Sí | Cierres y reaperturas. | — |
| `nextEntryNumber` | Int | Sí | Contador atómico. | — |

Índice: `{ tenantId, legalEntityId, number }` único (antes `{ tenantId, number }`); `{ tenantId, legalEntityId, startDate, endDate }`.

### 7.13 `accountingPeriods`

Origen: fechas de cierre P67, P432, P500, P501, P502, P504, P505, P506, P2376, P2778, P2785, P2528.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `legalEntityId` | ObjectId → T04 | Sí | Igual a la del ejercicio (DEC-064). | `legalEntities` (T04) |
| `fiscalYearId` | ObjectId | Sí | — | `fiscalYears` (M15) |
| `period` | String `YYYY-MM` | Sí | Mes calendario del período (CTR-DAT-31; antes `year`, `month`). | — |
| `sequence` | Int | Sí | Orden del período dentro del ejercicio (1..n; admite ejercicios irregulares). | — |
| `startDate` / `endDate` | Date | Sí | — | — |
| `status` | enum `open`\|`softLocked`\|`closed`\|`reopened` | Sí | §8.6. | — |
| `moduleLocks` | `[{ module: enum 'salesDocuments'\|'billing'\|'collections'\|'purchases'\|'banks'\|'treasury'\|'financing'\|'housing'\|'stock'\|'payroll'\|'members'\|'fixedAssets'\|'accounting', lockedUntil: Date, lockedAt, lockedBy }]` | Sí | Bloqueo por módulo. | — |
| `checklist` | `[{ item, status, detail }]` | No | Cierre mensual. | — |
| `history` | `[{ action, at, by, reason, approvalRequestId, reopenUntil }]` | Sí | — | — |

Índice: `{ tenantId, legalEntityId, period }` único; `{ tenantId, fiscalYearId, sequence }` único (antes `{ tenantId, year, month }`).

### 7.14 `resultTargets`

Origen: `RESULTA` (`COD_RES`, `DES_RES`, `COD_CTA`, `GANANCIAS`, `PERDIDAS`).

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `chartId` | ObjectId | Sí | — | `chartOfAccounts` (M15) |
| `name` | String | Sí | — | — |
| `match` | `{ codePrefix \| ledgerAccountIds \| rubricIds }` | Sí | Prefijo más largo gana. | — |
| `ledgerAccountId` | ObjectId | Sí | Antes `targetAccountId`. Cuenta de resultado destino (nombre canónico de T05 §7.2; PA-CON-19). | `ledgerAccounts` (M15) |
| `appliesTo` | enum `gains`\|`losses`\|`both` | Sí | `GANANCIAS`/`PERDIDAS`. | — |

### 7.15 `capitalRubricAccounts`

**Reemplazado por `entityAccountAssignments` con `entityType: capitalRubric` (CTR-DAT-57).** El rubro de capital (código, nombre, rubros de producto incluidos) es `capitalItems` de M17, sin cuentas; las cuentas viven en §7.39 con `entityId` = rubro de M17 y `usage` `capitalSubscribed` (suscripto), `capitalPaidIn` (integrado), `capitalReceivable` (asociados cuenta suscripción) y `capitalRefundPayable` (devolución a pagar). La descripción siguiente queda como mapeo del origen `RUBCAPI`.

Origen: `RUBCAPI` (`COD_RCC`, `COD_RUB`, `DES_RCC`, `COD_CTA`). Rubros de capital con cuentas: `chartId`, `capitalRubricCode`, `name`, `productRubricIds` [ObjectId] (cada rubro de producto en un solo rubro de capital), `subscribedAccountId`, `integratedAccountId`, `receivableAccountId` (asociados cuenta suscripción), `refundPayableAccountId`. Índice `{ tenantId, chartId, capitalRubricCode }` único.

### 7.16 `costCenters`

Origen: `CTSECCION` (`COD_SEC`, `DES_SEC`, `ID_GRUPO_CTSECCION`, `Porc_IVA_Compras`), `SECCION` (`COD_SEC`, `DES_SEC`).

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code`, `name` | String | Sí | Ej. `CC-AG`. | — |
| `parentId` | ObjectId | No | Jerarquía. | `costCenters` (M15) |
| `kind` | enum `service`\|`support`\|`administration`\|`commercial`\|`project`\|`other` | Sí | Para distribución. | — |
| `relatedServiceIds` / `branchIds` / `areaIds` / `zoneIds` | [ObjectId] | No | Sin imponer equivalencia. | `tenantServices` (M02) / `branches` (T04) / `crmAreas` (M09) / `zones` (T04) |
| `vatCreditablePct` | Decimal128 | Sí | Default 100 (`Porc_IVA_Compras`). | — |
| `groupIds` | [ObjectId] | No | `CTSECCION_GP_ASIGNA`. | `costCenterGroups` (M15) |
| `legalEntityId` | ObjectId | Sí | Entidad jurídica dueña del centro (DEC-096, RN-CON-127). | `legalEntities` (T04) |
| `sharedWithLegalEntityIds` | [ObjectId] | No | Otras entidades del tenant que pueden imputar al centro; vacío = solo la dueña; no repite la dueña (DEC-096, RN-CON-127). | `legalEntities` (T04) |
| `status`, `validFrom`, `validTo` | Enum / Date / Date | Sí / Sí / No `[VERIFICAR]` | `status`: `active`, `inactive` (§8.11.8; antes sin valores). | — |

Índices: `{ tenantId, code }` único (el código no se repite entre entidades, para que un centro compartido sea uno solo); `{ tenantId, legalEntityId, status }`; `{ tenantId, sharedWithLegalEntityIds }` (DEC-096). Migración: `CTSECCION` no tiene empresa; cada sección se crea con la entidad por defecto como dueña y compartida con las demás entidades del tenant (conserva el comportamiento de ProCoop); la cooperativa puede luego restringirla o pasarla a otra dueña antes del primer asiento que la use (RN-CON-127).

### 7.17 `costCenterGroups`

Origen: `CTSECCION_GRUPOS` (`ID_GRUPO_CTSECCION`, `DES_GRUPO_CTSECCION`), `CTSECCION_GP_ASIGNA` (`COD_CGA`, `COD_SEC`, `ID_GRUPO_CTSECCION`). Campos: `code`, `name`, `costCenterIds` [ObjectId], `status`. Índice `{ tenantId, code }` único.

Campos de `costCenterGroups`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | String | Sí | — | — |
| `name` | String | Sí | — | — |
| `costCenterIds` | [ObjectId] | [VERIFICAR] | Lista: ObjectId. | `costCenters` (M15) |
| `status` | Enum | Sí | `active`, `inactive` (§8.11.8; antes sin valores). | — |

### 7.18 `costAllocationRules`

Origen: `CTSECCION_ASIGNA`, `FPITEMS_CTSEC` (por ítem de compra, guardado en CMP y recibido en el evento), `BIENES_USO_CTSEC`, `CAT_INCI_CTSEC`, `GRPOBRA_CTSEC`, distribución de empleados.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `operationType` | enum `revenue`\|`purchases`\|`inflationAdjustment`\|`manualEntry`\|`costOfSales`\|`accountDefault`\|`payroll`\|`fixedAsset`\|`incident`\|`work` | Sí | `TIPO_OPERACION`. | — |
| `elementType` | enum `service`\|`product`\|`concept`\|`tax`\|`account`\|`employee`\|`asset`\|`incidentCategory`\|`workGroup` | Sí | `TIPO_ELEMENTO`. | — |
| `elementId` | ObjectId | Sí | `COD_SER`/`COD_PRO`/`COD_IMP`/`COD_CON`/`COD_CTA`. | `networkElements` (M10) |
| `modelId` | ObjectId | No | `MODELO`. | `distributionModels` (M15) |
| `splits` | `[{ costCenterId, pct }]` | Sí (si no hay modelo) | Suman 100. | — |
| `legacyVariable` | Int | No | `COD_VAR`. | — |
| `validFrom` / `validTo` | Date | Sí / No | — | — |

Índice: `{ tenantId, operationType, elementType, elementId, validFrom }` único.

### 7.19 `distributionModels`

Plantillas de reparto: `code`, `name`, `splits` [{ costCenterId, pct }] o `driver` { type: `fixedPct`\|`activeSupplies`\|`kwh`\|`m3`\|`hours`\|`networkMeters`\|`revenue`\|`custom`, sourceQuery, period }, `status`, `version`. Índice `{ tenantId, code, version }` único.

Campos de `distributionModels`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | String | Sí | — | — |
| `name` | String | Sí | — | — |
| `splits` | [Object] | [VERIFICAR] | Lista; subcampos: costCenterId, pct. Subcampos `costCenterId`, `pct`; alternativo a `driver`. | — |
| `driver` | Object | [VERIFICAR] | Subcampos: type, sourceQuery, period. `type` (`fixedPct`, `activeSupplies`, `kwh`, `m3`, `hours`, `networkMeters`, `revenue`, `custom`), `sourceQuery`, `period`; alternativo a `splits`. | — |
| `status` | Enum | Sí | `active`, `inactive` (§8.11.8; antes sin valores). | — |
| `version` | Int | Sí | — | — |

### 7.19.1 `costCenterModels` — modelos de centro de costo (PA-CON-18)

Propósito: modelo con nombre que define cómo se reparte entre centros de costo un importe imputado a una cuenta. Lo citan `accountRoles.costCenterModelId`, `postingRules.costCenterModelId` y las líneas de plantillas de asiento (`lines[].costCenterModelId`); antes esas referencias no tenían colección destino (T05 §7.2 lo marcaba `[VERIFICAR]`). Se distingue de `distributionModels`, que reparte costos comunes en la corrida analítica (§7.20): un modelo de centro de costo puede delegar en un modelo de distribución para el reparto dinámico.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | String | Sí | Ej. `MCC-COMUN-01`. | — |
| `name` | String | Sí | — | — |
| `splits` | `[{ costCenterId, pct }]` | Cond. | Reparto fijo; los porcentajes suman 100. Obligatorio si no hay `distributionModelId`. | `costCenters` (M15) (solo `costCenterId`) |
| `distributionModelId` | ObjectId | Cond. | Reparto dinámico delegado; alternativo a `splits`. | `distributionModels` (M15) |
| `validFrom` / `validTo` | Date | Sí / No | Vigencia. | — |
| `status` | Enum | Sí | `active`, `inactive` (§8.11.8). | — |
| `version` | Int | Sí | — | — |

Índice: `{ tenantId, code, version }` único.

### 7.20 `costDistributionRuns`

Distribución analítica de comunes (BASE §75).

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `number` | Int | Sí | Número de corrida, único por tenant (T05; PA-CON-19). | — |
| `distributionModelId` | ObjectId | No | Modelo de distribución principal de la corrida (T05; las reglas pueden usar otros en `rules[].modelId`). | `distributionModels` (M15) |
| `periodFrom` / `periodTo` | Date | Sí | — | — |
| `scope` | enum `real`\|`scenario` | Sí | — | — |
| `scenarioId` | ObjectId | No | — | `simulationScenarios` (M15) |
| `rules` | `[{ sourceCostCenterIds, ledgerAccountIds, modelId, driverValues: [{ costCenterId, value }] }]` | Sí | Reglas versionadas usadas. | — |
| `results` | `[{ sourceCostCenterId, ledgerAccountId, amount, targetCostCenterId, allocated, basis }]` | Sí | — | — |
| `unallocated` | `[{ ledgerAccountId, amount, reason }]` | No | Identificados, no ocultos. | — |
| `totals` | `{ source, allocated, unallocated }` | Sí | `source = allocated + unallocated`. | — |
| `status` | enum `draft`\|`final`\|`superseded` | Sí | — | — |
| `reclassificationEntryId` | ObjectId | No | Si se expone en libros (RF-CON-089). | `journalEntries` (M15) |

### 7.21 `accountMappings` (equivalencias)

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `sourceChartId` / `targetChartId` | ObjectId | Sí | — | `chartOfAccounts` (M15) |
| `sourceAccountId` | ObjectId | Sí | — | `ledgerAccounts` (M15) |
| `targets` | `[{ ledgerAccountId, pct }]` | Sí | 1:1 o 1:N (suma 100). | — |
| `conditions` | `{ serviceId, costCenterId }` | No | Equivalencia condicionada por dimensión. | — |
| `validFrom` / `validTo` | Date | Sí / No | — | — |

Índice: `{ tenantId, sourceChartId, targetChartId, sourceAccountId, validFrom }` único. N:1 se obtiene con varias filas al mismo destino.

### 7.22 `simulationScenarios`

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code`, `name` | String | Sí | Ej. `SIM-CON-001`. | — |
| `kind` | enum `chartStructure`\|`costDistribution`\|`tariffHypothesis`\|`costHypothesis`\|`budget`\|`combined` | Sí | BASE §57 (contables, económicas, presupuestarias). | — |
| `chartId` | ObjectId | Sí | Plan usado. | `chartOfAccounts` (M15) |
| `baseScenarioId` | ObjectId | No | Copia. | `simulationScenarios` (M15) |
| `universe` | `{ dateFrom, dateTo, cutoffAt, modules, serviceIds, filters }` | Sí | Mismo universo que el real. | — |
| `assumptions` | `[{ type, target, value, description }]` | Sí | Ej. tarifa +10 %. | — |
| `status` | enum `draft`\|`running`\|`completed`\|`failed`\|`archived` | Sí | §8.8. | — |
| `comparable` | Boolean | Sí | Equivalencias completas y balanceado. | — |
| `checks` | `[{ code, result, detail }]` | No | Sin equivalencia, ambiguas, desequilibrios. | — |
| `results` | `{ totalsByNature, byAccount: [...], byCostCenter: [...], byService: [...] }` | No | — | — |
| `runHash` | String | No | Repetibilidad. | — |

### 7.23 `simulatedJournalLines`

Igual estructura que `journalLines` más `scenarioId` (obligatorio), `simulatedEntryKey`, `originRealLineId`. Índices `{ tenantId, scenarioId, ledgerAccountId }`. **Nunca** consultada por reportes oficiales.

Campos de `simulatedJournalLines`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `scenarioId` | ObjectId | Sí | Obligatorio. Además de los campos de `journalLines` (misma estructura). | `simulationScenarios` (M15) |
| `simulatedEntryKey` | String | [VERIFICAR] | — | — |
| `originRealLineId` | ObjectId | [VERIFICAR] | — | `journalLines` (M15) |

### 7.24 `ledgerProjections`

Representación de asientos oficiales en planes alternativos/regulatorios: `targetChartId`, `sourceLineId`, `ledgerAccountId`, `debit`, `credit`, `entryDate`, `costAllocations`, `mappingId`. Reconstruible. Índice `{ tenantId, targetChartId, ledgerAccountId, entryDate }`.

Campos de `ledgerProjections`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `chartId` | ObjectId | [VERIFICAR] | Antes `targetChartId`. Plan alternativo o regulatorio (nombre canónico de T05; PA-CON-19). | `chartOfAccounts` (M15) |
| `sourceLineId` | ObjectId | [VERIFICAR] | — | `journalLines` (M15) |
| `ledgerAccountId` | ObjectId | [VERIFICAR] | — | `ledgerAccounts` (M15) |
| `debit` | [VERIFICAR] | [VERIFICAR] | — | — |
| `credit` | [VERIFICAR] | [VERIFICAR] | — | — |
| `entryDate` | Date | [VERIFICAR] | — | — |
| `costAllocations` | Decimal128 | [VERIFICAR] | — | — |
| `mappingId` | ObjectId | [VERIFICAR] | — | `accountMappings` (M15) |

### 7.25 `ledgerBalances`

Proyección de saldos (reconstruible; única fuente = `journalLines`): `chartId`, `ledgerAccountId`, `fiscalYearId`, `periodId`, `costCenterId` (opcional), `serviceId` (opcional), `openingDebit`, `openingCredit`, `periodDebit`, `periodCredit`, `closingBalance`, `rebuiltAt`. Índice `{ tenantId, chartId, ledgerAccountId, periodId, costCenterId, serviceId }` único.

Campos de `ledgerBalances`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `chartId` | ObjectId | Sí | — | `chartOfAccounts` (M15) |
| `ledgerAccountId` | ObjectId | Sí | — | `ledgerAccounts` (M15) |
| `fiscalYearId` | ObjectId | [VERIFICAR] | — | `fiscalYears` (M15) |
| `periodId` | ObjectId | Sí | — | `accountingPeriods` (M15) |
| `costCenterId` | ObjectId | Sí | Opcional. | `costCenters` (M15) |
| `serviceId` | ObjectId | Sí | Opcional. | `tenantServices` (M02) |
| `openingDebit` | [VERIFICAR] | [VERIFICAR] | — | — |
| `openingCredit` | [VERIFICAR] | [VERIFICAR] | — | — |
| `periodDebit` | String | [VERIFICAR] | — | — |
| `periodCredit` | String | [VERIFICAR] | — | — |
| `closingBalance` | Decimal128 | [VERIFICAR] | — | — |
| `rebuiltAt` | Date (fecha y hora) | Cond. | — | — |

### 7.26 `budgets` y 7.27 `budgetLines`

`budgets`: `fiscalYearId`, `code`, `name`, `versionNumber`, `versionKind` (`original`\|`reformulation`\|`draft`), `baseBudgetId`, `adjustmentPct`, `status` (`draft`\|`submitted`\|`approved`\|`active`\|`closed`\|`superseded`), `approvedBy`, `approvedAt`, `currency`. Índice `{ tenantId, fiscalYearId, code, versionNumber }` único.

Campos de `budgets`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `fiscalYearId` | ObjectId | Sí | — | `fiscalYears` (M15) |
| `code` | String | Sí | — | — |
| `name` | String | Sí | — | — |
| `versionNumber` | String | Sí | — | — |
| `versionKind` | Enum | [VERIFICAR] | `original`\|`reformulation`\|`draft`. | — |
| `baseBudgetId` | ObjectId | [VERIFICAR] | — | `budgets` (M15) |
| `adjustmentPct` | Decimal128 | [VERIFICAR] | — | — |
| `status` | Enum | Sí | `draft`\|`submitted`\|`approved`\|`active`\|`closed`\|`superseded`. | — |
| `approvedBy` | ObjectId | Cond. | — | `memberships` (T02) |
| `approvedAt` | Date (fecha y hora) | Cond. | — | — |
| `currency` | String | [VERIFICAR] | — | — |

`budgetLines`: `budgetId`, `ledgerAccountId`, `costCenterId`, `serviceId`, `month` (1–12, mes del ejercicio; el mes calendario se expone como `period` `YYYY-MM`, CTR-DAT-31), `amount`, `seasonalityKey`, `notes`, `source` (`manual`\|`import`\|`copy`\|`payrollProjection`). Índice `{ tenantId, budgetId, ledgerAccountId, costCenterId, serviceId, month }` único.

**`budgetLines`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `budgetId` | ObjectId | Sí | — | `budgets` (M15) |
| `ledgerAccountId` | ObjectId | Sí | — | `ledgerAccounts` (M15) |
| `costCenterId` | ObjectId | Sí | — | `costCenters` (M15) |
| `serviceId` | ObjectId | Sí | — | `tenantServices` (M02) |
| `month` | Int | Sí | 1–12, mes del ejercicio; el mes calendario se expone como `period` `YYYY-MM`, CTR-DAT-31. | — |
| `amount` | Decimal128 | [VERIFICAR] | — | — |
| `seasonalityKey` | String | [VERIFICAR] | — | — |
| `notes` | String | [VERIFICAR] | — | — |
| `source` | Enum | [VERIFICAR] | `manual`\|`import`\|`copy`\|`payrollProjection`. | — |

### 7.28 `commitments`

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `sourceDocument` | `{ type: 'purchaseOrder'\|'contract'\|'supplyRequest', id, number }` | Sí | — | — |
| `budgetId` | ObjectId | Sí | — | `budgets` (M15) |
| `lines` | `[{ ledgerAccountId, costCenterId, serviceId, month, committed, accrued, released }]` | Sí | — | — |
| `status` | enum `open`\|`partiallyAccrued`\|`accrued`\|`released`\|`cancelled` | Sí | §8.9. | — |
| `exceedAuthorization` | `{ requestId, approvedBy, amount }` | No | — | — |

Índice: `{ tenantId, 'sourceDocument.type', 'sourceDocument.id' }` único.

### 7.29 `inflationIndexSeries` y 7.30 `inflationIndexValues`

**Reemplazado por `economicIndexSeries` / `economicIndexValues` de T04 (CTR-DAT-29).** M15 no es dueño de las series de índices: el ajuste por inflación lee la serie configurada (PRM-CON-036, `economicIndexSeriesId`) de T04, la misma que usa M08 para ajuste de cuotas. Los valores se identifican por `period` `YYYY-MM` (CTR-DAT-31). La descripción siguiente queda como mapeo del origen.

`inflationIndexSeries` (origen `TABINFL`: `COD_TAB`, `DES_TAB`): `code`, `name`, `source` (ej. FACPCE/INDEC), `base`. `inflationIndexValues` (origen `INFLACIO`: `COD_INF`, `COD_TAB`, `MES_TAB`, `ANO_TAB`, `IND_TAB`): `seriesId`, `year`, `month`, `value` (Decimal128, 6+ decimales), `loadedBy`. Índice `{ tenantId, seriesId, year, month }` único.

### 7.31 `inflationAdjustmentRuns`

`fiscalYearId`, `periodTo`, `seriesId`, `method`, `status` (`preview`\|`posted`\|`reversed`), `lines` [{ ledgerAccountId, originMonth, historicalAmount, coefficient, adjustedAmount, adjustment, costCenterId }], `recpamTotal`, `entryId`.

Campos de `inflationAdjustmentRuns`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `fiscalYearId` | ObjectId | Sí | — | `fiscalYears` (M15) |
| `periodTo` | Date | [VERIFICAR] | — | — |
| `seriesId` | ObjectId | [VERIFICAR] | Serie configurada en PRM-CON-036. | `economicIndexSeries` (T04) (antes `inflationIndexSeries` (M15), reemplazada en §7.29; PA-CON-19) |
| `version` | Int | Sí | Versión de la corrida del ejercicio; `{fiscalYearId, version}` único (T05; PA-CON-19). | — |
| `method` | Enum | [VERIFICAR] | — | — |
| `status` | Enum | Sí | `preview`\|`posted`\|`reversed`. | — |
| `lines` | [Object] | [VERIFICAR] | Lista; subcampos: ledgerAccountId, originMonth, historicalAmount, coefficient, adjustedAmount, adjustment, costCenterId. | — |
| `recpamTotal` | Decimal128 | [VERIFICAR] | — | — |
| `entryId` | ObjectId | [VERIFICAR] | — | `journalEntries` (M15) |

### 7.32 `reconciliationRuns`

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `fiscalYearId` | ObjectId | Sí | Ejercicio conciliado (clave de T05; PA-CON-19). | `fiscalYears` (M15) |
| `kind` | enum `memberReceivables`\|`cashBanks`\|`suppliers`\|`vat`\|`withholdings`\|`stock`\|`fixedAssets`\|`capital`\|`payroll`\|`thirdParty`\|`advances` | Sí | — | — |
| `cutoffAt` | Date | Sí | — | — |
| `dimensionBreakdown` | enum `total`\|`byService`\|`byBank`\|`bySupplier` | Sí | — | — |
| `subledgerTotals` / `ledgerTotals` | `[{ key, amount }]` | Sí | — | — |
| `differences` | `[{ key, amount, category: 'cutoff'\|'status'\|'classification'\|'unexplained', explanation, responsibleId, adjustmentEntryId }]` | No | — | — |
| `status` | enum `running`\|`balanced`\|`withDifferences`\|`explained`\|`closed` | Sí | §8.10. | — |

### 7.33 `rubricatedBooks`

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `bookType` | enum `journal`\|`inventoryAndBalances`\|`other` | Sí | — | — |
| `registry` | String | Sí | Organismo de rúbrica [VERIFICAR]. | — |
| `rubricNumber`, `rubricDate` | String, Date | Sí | — | — |
| `sheetFrom` / `sheetTo` / `lastUsedSheet` | Int | Sí | — | — |
| `linesPerSheet` | Int | Sí | `GuardarLineas`. | — |
| `fiscalYearId` | ObjectId | Sí | Ejercicio del libro; `{bookType, fiscalYearId, volume}` único (T05; PA-CON-19). | `fiscalYears` (M15) |
| `volume` | Int | Sí | Número de tomo. | — |
| `storedFileId` | ObjectId | No | Archivo del libro digital o del escaneo de la rúbrica. | `storedFiles` (T01) |
| `format` | enum `paper`\|`digital` | Sí | PA-CON-08. | — |
| `transcriptions` | `[{ fiscalYearId, entryFrom, entryTo, sheetFrom, sheetTo, printedAt, printedBy, fileHash }]` | No | — | — |
| `status` | enum `active`\|`exhausted`\|`closed` | Sí | — | — |

### 7.34 `statementTemplates` y 7.35 `financialStatementRuns`

`statementTemplates`: `code`, `name`, `framework` (`INAES-RT`\|`regulator`\|`custom`), `statement` (`balanceSheet`\|`incomeStatement`\|`equityChanges`\|`cashFlow`\|`notes`\|`annexFixedAssets`\|`annexExpenses`\|`resultsBySection`\|`surplusDistribution`), `lines` [{ lineCode, label: dict, order, formula: { ledgerAccountIds \| rubricIds \| natures \| sumOf }, sign, bold }], `version`, `validFrom`. `financialStatementRuns`: `fiscalYearId`, `templateIds`, `comparativeFiscalYearId`, `status` (`draft`\|`approved`\|`issued`), `snapshot` (valores congelados), `storedFileIds`, `approvedBy` (consejo), `issuedAt`, `hash`.

Campos de `statementTemplates`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | String | Sí | — | — |
| `name` | String | Sí | — | — |
| `framework` | Enum | [VERIFICAR] | `INAES-RT`\|`regulator`\|`custom`. | — |
| `statement` | Enum | [VERIFICAR] | `balanceSheet`\|`incomeStatement`\|`equityChanges`\|`cashFlow`\|`notes`\|`annexFixedAssets`\|`annexExpenses`\|`resultsBySection`\|`surplusDistribution`. | — |
| `lines` | [Object] | [VERIFICAR] | Lista; subcampos: lineCode, label: dict, order, formula: { ledgerAccountIds \| rubricIds \| natures \| sumOf }, sign, bold. | — |
| `version` | Int | Sí | — | — |
| `validFrom` | Date | [VERIFICAR] | — | — |

**`financialStatementRuns`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `fiscalYearId` | ObjectId | Sí | — | `fiscalYears` (M15) |
| `templateIds` | [ObjectId] | [VERIFICAR] | — | `statementTemplates` (M15) |
| `comparativeFiscalYearId` | ObjectId | [VERIFICAR] | — | `fiscalYears` (M15) |
| `status` | Enum | Sí | `draft`\|`approved`\|`issued`. | — |
| `snapshot` | Object | [VERIFICAR] | Valores congelados. | — |
| `storedFileIds` | [ObjectId] | [VERIFICAR] | — | `storedFiles` (T01) |
| `approvedBy` | ObjectId | Cond. | Consejo. | `memberships` (T02) |
| `issuedAt` | Date (fecha y hora) | Cond. | — | — |
| `hash` | String | [VERIFICAR] | — | — |

### 7.36 `externalLedgerMappings` y 7.37 `externalLedgerTransfers`

`externalLedgerMappings` (origen `SISCONT`: `COD_OPEINT`, `DES_OPEINT`, `COD_CTA`, `COD_RUB`, `OPERACION`, `OBSERVAC`): `externalSystem`, `operationCode`, `operationName`, `ledgerAccountId`, `externalAccountCode`, `externalRubric`, `notes`. `externalLedgerTransfers`: `direction` (`export`\|`import`), `dateFrom`, `dateTo`, `layoutId`, `storedFileId`, `entryIds`, `status` (`running`\|`completed`\|`failed`\|`partially`), `errors`, `idempotencyKey`.

Campos de `externalLedgerMappings`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `externalSystem` | [VERIFICAR] | Sí | — | — |
| `operationCode` | String | Sí | — | — |
| `operationName` | String | [VERIFICAR] | — | — |
| `ledgerAccountId` | ObjectId | Sí | — | `ledgerAccounts` (M15) |
| `externalAccountCode` | Int | [VERIFICAR] | — | — |
| `externalRubric` | [VERIFICAR] | [VERIFICAR] | — | — |
| `notes` | String | [VERIFICAR] | — | — |

**`externalLedgerTransfers`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `direction` | Enum | [VERIFICAR] | `export`\|`import`. | — |
| `dateFrom` | Date | [VERIFICAR] | — | — |
| `dateTo` | Date | [VERIFICAR] | — | — |
| `fileLayoutId` | ObjectId | [VERIFICAR] | Antes `layoutId`. Layout del archivo (nombre canónico de T05 §7.2; PA-CON-19). | `fileLayouts` (T06) |
| `storedFileId` | ObjectId | Sí | — | `storedFiles` (T01) |
| `entryIds` | [ObjectId] | [VERIFICAR] | — | `journalEntries` (M15) |
| `status` | Enum | Sí | `running`\|`completed`\|`failed`\|`partially`. | — |
| `errors` | [Object] | [VERIFICAR] | [VERIFICAR] estructura (el anexo no la detalla). | — |
| `idempotencyKey` | String | Sí | — | — |

### 7.38 Relación con catálogos de otros módulos

CON lee (no posee) y guarda solo la asignación contable cuando corresponde: `collectionAccountingGroups` (COB, origen `GRU_CON`), `vatRates` (FIS, `ALI_IVA`), `taxDefinitions` (FIS, `IMPUESTO`, `ALI_IBR`), `withholdingTypes` (FIS, `RETS_TIPO`, `RETE_TIPO`), `valueTypes` (COB/TES, `TIP_VAL`), `bankAccounts` (TES, `BANKOS`; cuentas de tesorería referenciadas por `treasuryAccountId`, CTR-DAT-30), `bankMovementCategories` (TES, `CAT_BANC`), `billingTypes` (FAC, `TIPO_FAC`), `productRubrics` (CAT/STK, `RUB_PYS`), `incidentCategories` (TEC, `CAT_INCI`), `workGroups` (TEC, `GRPOBRA`), `payrollConcepts`/`unions` (SUE), `legalEntities` (T04; antes `companies` de SUE, DEC-064), `inaesCategories` (INS, `CAT_INAES`), `fixedAssets` (STK, `BIENES_USO`, `BIENES_USO_AMORT`, `BIENES_USO_DISM`, `BIENES_USO_HST`), `capitalLedger` (INS, `CAPITAL`, `CAPITAL_RES`). Las cuentas asignadas a esas entidades viven en `entityAccountAssignments` (§7.39): los módulos dueños no guardan `ledgerAccountId`, solo claves de dimensión, y la cascada de resolución consulta esta colección en su primer paso.

### 7.39 `entityAccountAssignments` (cuentas asignadas a entidades de otros módulos)

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `chartId` | ObjectId | Sí | — | `chartOfAccounts` (M15) |
| `entityType` | enum `supplier`, `treasuryAccount`, `vatRate`, `perceptionRate`, `billingType`, `collectionAccountingGroup`, `productCategory`, `capitalRubric`, `suppliedWithholdingType`, `practicedWithholdingType`, `payrollConcept`, `employer`, `union`, `payrollTemplate`, `projectGroup`, `incidentCategory`, `instrumentType`, `treasuryCategory`, `taxDefinition` (antes `tax`), `ownTaxObligation`, `thirdPartyAgreement`, `service`, `product` | Sí | Dimensión de la cascada (RN-CON-022, paso 1). `vatRate` → `vatRates` (M06; `usage` `sales`, `purchases`, `salesPerception`) y `taxDefinition` → `taxDefinitions` (M06): M06 no guarda cuentas en esas colecciones (T05 COL-FIS-16 y COL-FIS-18, PA-DAT-04). `ownTaxObligation` → `ownTaxObligations` (M06 §7.39; `usage` `expense`, `payable`; DEC-095, RN-CON-128). | — |
| `entityId` | ObjectId (de la colección del módulo dueño) | Sí | — | Polimórfica según `entityType` (p. ej. `vatRates` y `taxDefinitions` de M06, `suppliers` de M12, `treasuryAccounts` de M14); antes `identities` (T02) |
| `usage` | enum (`main`, `pendingDebit`, `purchases`, `sales`, `salesPerception`, `other`, `costOfSales`, `disposalCost`, `annualDepreciation`, `accumulatedDepreciation`, `originValue`, `decrease`, `revaluation`, `collectionBilling`, `collectionRefinancing`, `cash`, `capitalSubscribed`, `capitalPaidIn`, `capitalReceivable`, `capitalRefundPayable` (los dos últimos para `capitalRubric`, CTR-DAT-57), `discountsSurcharges`, `cards`, `checks`, `interest`, `vat`, `debit`, `credit`, `contributions`, `generalPayroll`, `socialCharges`, `expense`, `payable` (los dos últimos para `ownTaxObligation`, DEC-095)) | Sí | Uso de la cuenta dentro de la entidad. | — |
| `ledgerAccountId` | ObjectId | Sí | Imputable del plan. | `ledgerAccounts` (M15) |
| `validFrom`, `validTo` | date | Sí/No | — | — |

Índices: `{tenantId, chartId, entityType, entityId, usage, validFrom}` único. Origen (columna de cuenta de cada tabla ProCoop): `PROVEED.CTA_CONTA`; `BANKOS.COD_CTA`, `CTA_PENDEB`; `ALI_IVA.CTA_COMPRAS`, `CTA_VENTAS`, `CTA_VENTAS_PER`; `TIPO_FAC.COD_CTA`, `CTA_REF`; `GRU_CON.CTA_COBF`, `CTA_COBR`, `CTA_CAJ`, `CTA_CAPS`, `CTA_CAPI`, `CTA_DESR`, `CTA_TAR`, `CTA_VAL`, `CTA_INT`, `CTA_IVA`; `RUB_PYS.COD_CTAV`, `COD_CTAC`, `COD_CTAO` y cuentas de amortización, origen, disminución, revalúo; `RUBCAPI.COD_CTA`; `RETS_TIPO.CTA_CONT`; `RETE_TIPO.CTA_PROV`; `SU_CONCEPTOS.COD_CTA`; `SU_EMPRESAS` (`CTA_CONTRI`, `COD_CTA`); `SU_SINDICATO.CTA_GRAL`, `CTA_CARGAS`; `SU_ASIENTOS.CTA_DEBE`, `CTA_HABER`; `GRPOBRA.COD_CTA`, `COD_CTH`; `CAT_INCI.COD_CTA`, `COD_CTH`; `TIP_VAL.CTA_CONTA`; `CAT_BANC.CTA_CONTA`.

## 8. Estados y transiciones

### 8.1 Asiento (`journalEntries.status`)

| Origen | Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|---|
| — | `draft` | Usuario, lote, plantilla | — | No afecta saldos | Eliminar (permitido en borrador) |
| `draft` | `pendingApproval` | Usuario | Supera umbral o tipo requiere aprobación | Solicitud T11 | Rechazo → `draft` |
| `draft` / `pendingApproval` | `posted` | Usuario con `con.asientos.contabilizar` / aprobador / worker | RN-CON-001…006, período abierto | Número por ejercicio; actualiza `ledgerBalances`; emite `con.entry.posted` | Contraasiento o anulación |
| `posted` | `voided` | Contador con `con.asientos.anular` | Período abierto, no transcripto, no apertura/cierre (RN-CON-013) | Excluido de saldos; emite `con.entry.voided`; módulos dependientes revierten | No (se crea uno nuevo) |
| `posted` | `reversed` | Contador / worker por anulación de origen | — | Crea contraasiento vinculado; emite `con.entry.reversed` | Revertir el contraasiento |

### 8.2 Plan de cuentas (`chartOfAccounts.status`)

Estado inicial: alta → `draft` (PA-CON-19).

`draft` → `approved` (contador; validaciones de árbol y naturaleza) → `operative` (asignado a un ejercicio; solo uno) o `alternative` → `archived` (sin ejercicios abiertos que lo usen). `operative` → `archived` solo tras promoción de otro plan para un ejercicio nuevo (RF-CON-111).

### 8.3 Evento contable (`accountingEvents.status`)

| Origen | Destino | Actor | Precondición | Efectos |
|---|---|---|---|---|
| — | `received` | Consumidor outbox | Contrato válido, `sourceEventId` nuevo | — |
| `received` | `posted` | Worker | Modo tiempo real y cuentas resueltas, o lote confirmado | Asiento/renglones vinculados |
| `received` | `pendingConfiguration` | Worker | Falta cuenta, centro o equivalencia | Alerta; bloquea cierre del período |
| `received` | `error` | Worker | Contrato inválido, período bloqueado sin regla de traslado, desequilibrio fuera de tolerancia | Alerta técnica |
| `received` | `ignored` | Contador con `con.eventos.ignorar` | Evento sin efecto contable definido (ej. transferencia entre depósitos de igual cuenta) | Motivo obligatorio |
| `pendingConfiguration` / `error` | `received` | Reproceso | Configuración corregida | Reintento |
| `posted` | `reversed` | Worker | Llega evento de anulación | Contraasiento |

### 8.4 Ejercicio (`fiscalYears.status`)

Estado inicial: alta → `planned` (PA-CON-19).

`planned` → `open` (contador) → `closing` (inicia cierre; bloquea asientos de usuarios salvo ajustes de cierre) → `closed` (tres asientos registrados) → `reopened` (doble aprobación; revierte los tres) → `closing` …

### 8.5 Lote de contabilización (`postingBatches.status`)

Estado inicial: alta → `preparing` (PA-CON-19).

`preparing` → `preview` (borradores listos) → `confirming` → `confirmed`; `preview` → `discarded` (eventos vuelven a `received`); cualquier estado de proceso → `failed` (reanudable desde el último evento procesado).

### 8.6 Período (`accountingPeriods.status`)

Estado inicial: alta → `open` (al abrir el ejercicio; PA-CON-19).

`open` → `softLocked` (bloqueados módulos operativos, contable abierto para ajustes) → `closed` (checklist completa; todos los módulos bloqueados) → `reopened` (aprobación; plazo) → `closed`. Cada `moduleLocks[]` se mueve individualmente (bloquear/desbloquear con permiso y auditoría).

### 8.7 Corrida de distribución, ajuste por inflación y estados contables

Distribución (`costDistributionRuns.status`): `draft` → `final` → `superseded` (nueva corrida del mismo período).

Ajuste por inflación (`inflationAdjustmentRuns.status`): `preview` → `posted` → `reversed`.

Estados contables (`financialStatementRuns.status`): `draft` → `approved` (consejo) → `issued` (congelado con hash; nueva emisión = nueva corrida).

### 8.8 Escenario (`simulationScenarios.status`)

`draft` → `running` → `completed` (con `comparable` verdadero o falso) / `failed`; `completed` → `running` (re-ejecución); cualquier estado → `archived`.

### 8.9 Presupuesto y compromiso

Estado inicial de `budgets.status`: alta → `draft` (PA-CON-19).

Presupuesto (`budgets.status`): `draft` → `submitted` → `approved` → `active` → `closed`; `active` → `superseded` por reformulación aprobada.

Compromiso (`commitments.status`): `open` → `partiallyAccrued` → `accrued`; `open`/`partiallyAccrued` → `released` (cancelación de OC: libera el saldo no devengado) / `cancelled`.

### 8.10 Conciliación (`reconciliationRuns.status`)

Estado inicial: alta → `running` (PA-CON-19).

`running` → `balanced` | `withDifferences` → `explained` (todas justificadas) → `closed`.

### 8.11 Tablas de transiciones agregadas (corrección 05-11-2026)

> **Corrección 05-11-2026 (estados):** se agregan tablas de transiciones para las colecciones cuyo §7 enumeraba estados sin transiciones (`inflationAdjustmentRuns`, `rubricatedBooks`, `financialStatementRuns`, `externalLedgerTransfers`), para las que no tenían valores (`costCenters`, `costCenterGroups`, `distributionModels`) y para las máquinas del §8.7 a §8.9 que el texto corrido mezclaba o dejaba ambiguas (`costDistributionRuns`, `simulationScenarios`, `commitments`). El texto de §8.7 a §8.9 se conserva; las tablas lo explicitan sin cambiarlo. "—" en Guarda o Evento indica que el anexo no declara una RN o un evento para ese paso; las transiciones sin respaldo explícito llevan `[VERIFICAR]`. `journalLines.entryStatus` no tiene máquina propia: es copia desnormalizada de `journalEntries.status` (§8.1).

#### 8.11.1 Corrida de distribución (`costDistributionRuns.status`)

Estado inicial: `draft`. Los valores `preview`, `posted`, `reversed`, `approved` e `issued` del §8.7 pertenecen a `inflationAdjustmentRuns` y `financialStatementRuns`, no a esta colección.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `draft` | Ejecución de la distribución del período | RN-CON-077 | — |
| `draft` | `final` | Confirmación de la corrida | RN-CON-077 (total distribuido = importe asignado) | — |
| `final` | `superseded` | Nueva corrida del mismo período | — | — |

#### 8.11.2 Ajuste por inflación (`inflationAdjustmentRuns.status`)

Estado inicial: `preview`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `preview` | Cálculo del ajuste | RN-CON-100 | — |
| `preview` | `posted` | Contabilización del asiento de ajuste | RN-CON-100 | EVT-CON-12 `con.inflationAdjustment.posted` |
| `posted` | `reversed` | Reversión del ajuste (contraasiento) `[VERIFICAR]` | — | EVT-CON-02 `con.entry.reversed` |

#### 8.11.3 Estados contables (`financialStatementRuns.status`)

Estado inicial: `draft`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `draft` | Generación de los estados contables | — | — |
| `draft` | `approved` | Aprobación del consejo | — | — |
| `approved` | `issued` | Emisión (valores congelados con `hash`); una nueva emisión es una nueva corrida | — | EVT-CON-18 `con.statements.issued` |

#### 8.11.4 Escenario (`simulationScenarios.status`)

Estado inicial: `draft`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `draft` | Creación del escenario | — | — |
| `draft` | `running` | Ejecución de la simulación | — | — |
| `running` | `completed` | Fin de la simulación (con `comparable` verdadero o falso) | RN-CON-088 | EVT-CON-16 `con.simulation.completed` |
| `running` | `failed` | Error de la simulación | — | — |
| `completed` | `running` | Re-ejecución | — | — |
| cualquiera | `archived` | Archivo del escenario | — | — |

#### 8.11.5 Compromiso (`commitments.status`)

Estado inicial: `open`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `open` | Registro del compromiso presupuestario | RN-CON-115 (sin asiento oficial) | — |
| `open` | `partiallyAccrued` | Devengamiento parcial | RN-CON-103 | — |
| `open`, `partiallyAccrued` | `accrued` | Devengamiento total | RN-CON-103 | — |
| `open`, `partiallyAccrued` | `released` | Cancelación de la OC (libera el saldo no devengado) | RN-CON-103 | — |
| `open`, `partiallyAccrued` | `cancelled` | Anulación del compromiso | — | — |

#### 8.11.6 Libro rubricado (`rubricatedBooks.status`)

Estado inicial: `active`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `active` | Alta del libro con su rango de folios | RN-CON-102 | — |
| `active` | `exhausted` | Uso del último folio | RN-CON-102 | — |
| `active`, `exhausted` | `closed` | Cierre del libro `[VERIFICAR]` | — | — |

#### 8.11.7 Transferencia a sistema contable externo (`externalLedgerTransfers.status`)

Estado inicial: `running`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `running` | Inicio de la exportación o importación | — | — |
| `running` | `completed` | Fin sin errores | — | EVT-CON-17 `con.export.completed` |
| `running` | `partially` | Fin con errores en parte de los asientos | — | EVT-CON-17 `con.export.completed` `[VERIFICAR]` |
| `running` | `failed` | Error que impide la transferencia | — | EVT-CON-17 `con.export.failed` |

#### 8.11.8 Centros de costo, grupos y modelos de reparto (`costCenters.status`, `costCenterGroups.status`, `distributionModels.status`, `costCenterModels.status`)

Valores: `active`, `inactive`, como los demás maestros de este §7 (`ledgerAccounts`, `postingRules`, `entryTemplates`; antes sin valores). Estado inicial: `active`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `active` | Alta del maestro | — | — |
| `active` | `inactive` | Baja lógica | — | — |
| `inactive` | `active` | Reactivación | — | — |

#### 8.11.9 Renglón de asiento (`journalLines.entryStatus`)

Copia desnormalizada de `journalEntries.status` (§8.1): el worker la actualiza en todos los renglones cuando cambia el estado del asiento; no hay comando propio sobre el renglón (PA-CON-19). Estado inicial: `draft`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `draft` | Alta del renglón con el asiento | — | — |
| `draft` | `pendingApproval` | El asiento pasa a aprobación (§8.1) | — | — |
| `draft`, `pendingApproval` | `posted` | Contabilización del asiento (§8.1) | RN-CON-001 | EVT-CON-01 `con.entry.posted` |
| `posted` | `voided` | Anulación del asiento (§8.1) | RN-CON-013 | EVT-CON-03 `con.entry.voided` |
| `posted` | `reversed` | Contraasiento del asiento (§8.1) | — | EVT-CON-02 `con.entry.reversed` |

## 9. Procesos y flujos

### 9.1 Matriz evento económico → asiento tipo

Lectura: cada fila es la **regla por defecto** del asiento tipo; la cuenta concreta sale de la cascada de RN-CON-022 (cuenta de la entidad → regla más específica de `postingRules` → rol de `accountRoles`, §14.2). `rol:x` indica la clave de rol. Las dimensiones (servicio, centro de costo, socio, proveedor, banco, bien, obra, empleado) viajan en el renglón. Los nombres de eventos son los publicados por los anexos dueños; los marcados "(a confirmar en Mxx)" son contratos que CON necesita y el anexo dueño debe publicar. Importes en positivo; el signo de anulación genera el asiento inverso (contraasiento) salvo indicación.

#### 9.1.1 Facturación y ventas (M05 FAC, M11 VEN)

| N.º | Evento | Hecho económico | Debe | Haber | Dimensiones / notas | Origen ProCoop |
|---|---|---|---|---|---|---|
| M-01 | `fac.invoice.issued` (FA/FB/FC servicios) | Facturación a socio o usuario | `rol:billingReceivable` (Deudores por facturación; por servicio, tipo de factura o concepto según P2190) | Ventas por concepto/servicio (cuenta del concepto o `CTCUENTA_ASIGNA` por grupo, tipo, zona, rubro); `rol:vatOutputRegistered` / `rol:vatOutputNonRegistered`; `rol:salesPerceptionsByProduct` / `rol:salesPerceptionsUncategorized`; impuestos y tasas de terceros a pasivo `rol:thirdPartyCollections`; `rol:billingRounding` (debe o haber según signo) | Servicio obligatorio en el renglón de deudores y ventas; centro de costo por `costAllocationRules` (revenue). Conceptos sin cuenta → `rol:unmappedConceptSuspense` y evento `pendingConfiguration` | `clsCierreDiario` Ventas; P2190, P2104, P2105, P2106, P2107, P2108 (`rol:serviceRevenue` del servicio electricidad), P2111, P2163 |
| M-02 | `fac.invoice.issued` con cuota de capital | Suscripción/integración de capital facturada | `rol:billingReceivable` | `rol:capitalMovements` o cuenta del rubro de capital (`entityAccountAssignments` `entityType: capitalRubric`, CTR-DAT-57; antes `capitalRubricAccounts`) | No es ingreso (RN-CON-104, AGR-029): el renglón con clase fiscal `capitalContribution` va **a capital social**, fuera del neto gravado y de la base de percepciones (RN-FIS-124 de M06), nunca a `rol:serviceRevenue`; el tratamiento suscripto/integrado lo define M17 (P73, P2636, P2916) | `RUBCAPI`, P2129, P2133 |
| M-03 | `fac.invoice.issued` con cuotas de financiación/refinanciación | Cuota de un plan financiado | `rol:billingReceivable` | `rol:refinancingReceivable` (capital de la cuota); `rol:deferredFinancingInterest` → se devenga en M-38 | P3061 usa cuenta del rubro del producto financiado | P2103, P2135 |
| M-04 | `fac.creditNote.issued` / `fac.invoice.reversed` | Nota de crédito | Ventas / IVA DF / percepciones (inverso de M-01 por los conceptos acreditados) | `rol:billingReceivable` | Misma resolución de cuentas que el original; período del NC | `clsCierreDiario` Ventas |
| M-05 | `fac.debitNote.issued` | Nota de débito (intereses, recargos, cargos) | `rol:billingReceivable` | Ingresos del concepto (intereses `rol:interestIncome`, recargos, cargos técnicos), IVA DF | — | P2109 |
| M-06 | `fac.invoice.annulled` | Anulación de comprobante (antes de autorización o en período abierto) | Inverso de M-01 | Inverso de M-01 | Si el asiento original está en período cerrado → contraasiento con fecha del período abierto | — |
| M-07 | `fis.invoice.authorized` / `fis.authorization.reconciled` | Autorización fiscal | Sin asiento | Sin asiento | Solo marca de estado; si la política es contabilizar al autorizar (PA-CON-01), dispara M-01 | — |
| M-08 | `fac.billableItem.billed` (energía comprada a terceros, aportes, tasas municipales) | Recupero de cargos de terceros facturados | `rol:billingReceivable` | `rol:thirdPartyCollections` (pasivo con el tercero) | Se cancela al rendir (M-50) | BASE §87, §97.4 |
| M-09 | `ven.salesOrder.delivered` + `fac.invoice.issued` (venta de productos) | Venta de productos / equipos | `rol:billingReceivable` o caja (contado) | Ventas del rubro del producto; IVA DF; `rol:salesProductPerceptions`; descuentos de remito en `rol:deliveryNoteDiscounts` (debe) | CMV en M-65 | P2160, P2110 |
| M-10 | `ven.installmentPlan.created` | Venta en cuotas | `rol:refinancingReceivable` | Ventas; `rol:installmentSaleInterest` (intereses a devengar) ; IVA DF o `rol:refinancingVatAccrual` | Intereses se devengan por cuota (M-38) | P2138, P2125 |
| M-11 | `ven.salesOrder.cancelled` | Cancelación de venta antes de entrega | Sin asiento (compromiso) / inverso si hubo anticipo | — | — | — |
| M-12 | `ven.posSession.closed` | Cierre de punto de venta de mostrador | Caja / `rol:chequesInPortfolio` | `rol:billingReceivable` o ventas contado | Igual que M-20 | — |
| M-13 | Provisión de ingresos devengados no facturados (cierre) | Consumo de período no facturado | `rol:revenueAccrued` | Ventas del servicio | Reversión automática el primer día del período siguiente (PA-CON-14) | Nuevo |

#### 9.1.2 Cobranza y cuenta corriente (M07 COB)

| N.º | Evento | Hecho económico | Debe | Haber | Dimensiones / notas | Origen ProCoop |
|---|---|---|---|---|---|---|
| M-20 | `cob.payment.confirmed` (caja propia, efectivo) | Cobro en caja | Caja de la sesión (cuenta de la caja; `rol:cashClose` por defecto) | `rol:billingReceivable` por servicio/componente imputado; capital a `rol:capitalMovements`; recargos cobrados a `rol:interestIncome` | Grupo contable (`GRU_CON`) define cuentas si P2191 lo habilita; momento según `cashPostingTrigger` (P3100) | `clsCierreDiario` Cobranza; P2101, P2191 |
| M-21 | `cob.payment.confirmed` (cheque, tarjeta, transferencia en caja) | Cobro con valores | `rol:chequesInPortfolio` (cheques); `rol:cardCouponsInPortfolio` (cupones); banco (transferencias) | `rol:billingReceivable` | Por tipo de valor (`TIP_VAL`) | P2121, P2122 |
| M-22 | `cob.payment.confirmed` (ente externo, débito automático, pasarela) | Cobro por ente/canal digital | `rol:collectionsPendingBankCredit` (acreditaciones pendientes por canal) | `rol:billingReceivable` | Registración en dos pasos (RN-05); CU-22 | P2165, RN-05 |
| M-23 | `cob.settlement.expected` + `tes.deposit.credited` / `tes.operation.posted` (acreditación) | Acreditación neta del canal | Banco (neto); `rol:gatewayCommissions` (comisión); `rol:vatInput` (IVA de la comisión); retenciones sufridas `rol:withholdingsSuffered` | `rol:collectionsPendingBankCredit` (bruto) | Diferencia neta vs esperado → conciliación TES | CU-22: Banco 7.840 + Comisiones 160 / Créditos 8.000 (forma condensada) |
| M-24 | `cob.agencyFee.recorded` | Comisión de ente sin acreditación simultánea | `rol:gatewayCommissions`; `rol:vatInput` | Pasivo con el ente o `rol:collectionsPendingBankCredit` | — | — |
| M-25 | `cob.payment.confirmed` sin imputar / `cob.creditBalance.created` | Cobro no identificado o pago en exceso | Caja/banco/acreditaciones | `rol:unidentifiedCollections` o `rol:customerAdvances` | ESC-01 (ARS 2.000 a favor) | `frmInformeAnticiposAUnaFecha` |
| M-26 | `cob.creditBalance.consumed` / imputación posterior de no identificado | Aplicación de saldo a favor | `rol:customerAdvances` / `rol:unidentifiedCollections` | `rol:billingReceivable` | — | — |
| M-27 | `cob.receipt.voided` / `cob.allocation.reversed` | Anulación de recibo o reimputación | Inverso de M-20…M-22 | Inverso | Reimputación entre servicios: deudores servicio A / deudores servicio B | — |
| M-28 | `cob.chargeback.applied` | Contracargo de tarjeta o pasarela | `rol:billingReceivable` (restituye deuda); gastos de contracargo | Banco / `rol:collectionsPendingBankCredit` | — | — |
| M-29 | `cob.refund.executed` | Devolución al socio | `rol:customerAdvances` | Banco / caja | Pago ejecutado por TES | — |
| M-30 | `cob.cashSession.closed` / `cob.cashDifference.recorded` | Faltante o sobrante de caja | Faltante: `rol:cashDifferences` (pérdida) / Sobrante: caja | Faltante: caja / Sobrante: `rol:cashDifferences` (ganancia) | Redondeo de caja a `rol:cashCloseRounding` | P2137, P2164 |
| M-31 | `cob.thirdPartyCollection.recorded` | Cobranza por cuenta de terceros | Caja/banco | `rol:thirdPartyCollections` (neto) ; comisión ganada a ingresos | — | BASE §97.4 |
| M-32 | `cob.retention.received` | Retención sufrida en cobro (IVA, Ganancias, IIBB) | `rol:withholdingsSuffered` / `rol:withholdingsSuffered` | `rol:billingReceivable` | Certificado en el renglón | TipoCuenta 2120, 2123, 2124 |

#### 9.1.3 Mora, financiación e incobrables (M08 MOR)

| N.º | Evento | Hecho económico | Debe | Haber | Dimensiones / notas | Origen ProCoop |
|---|---|---|---|---|---|---|
| M-35 | `mor.interest.settled` (facturado por ND) | Intereses por mora | Contabiliza vía M-05 | — | Sin asiento propio si se factura | P2109 |
| M-36 | `mor.deferredInterest.created` / `.billed` / `.cancelled` | Interés diferido a próxima factura | Sin asiento hasta facturar (cuentas de orden opcionales) | — | — | — |
| M-37 | `mor.agreement.created` / `.activated` | Convenio de pago / refinanciación | `rol:refinancingReceivable` (por tipo si P2619) | `rol:billingReceivable` (deuda sustituida por servicio); `rol:deferredFinancingInterest`; `rol:refinancingVatAccrual` | Preserva servicio de origen en dimensión | P2103, P2125, P2135, P2619 |
| M-38 | Devengamiento de cuota (`fac.invoice.issued` de cuota) | Interés de financiación devengado | `rol:deferredFinancingInterest`; `rol:refinancingVatAccrual` | `rol:interestIncome`; `rol:vatOutputRegistered` | — | P2135, P2125 |
| M-39 | `mor.agreement.defaulted` / `.annulled` / `.refinanced` | Caída o anulación de convenio | `rol:billingReceivable`; `rol:deferredFinancingInterest` (intereses no devengados) | `rol:refinancingReceivable` | Restituye deuda original | — |
| M-40 | Provisión de incobrables (corrida de cierre, `mor.writeOff.approved` en modalidad previsión) | Previsión | `rol:badDebtExpense` | `rol:badDebtAllowance` | Por servicio | P2126, MER-006 |
| M-41 | `mor.writeOff.approved` | Baja de crédito incobrable | `rol:badDebtAllowance` (hasta su saldo) / `rol:badDebtExpense` | `rol:billingReceivable` / `rol:refinancingReceivable` | Si se compensa con capital: ver M-110 | MER-006 |
| M-42 | `mor.writeOff.reverted` / recupero posterior | Recupero de incobrable | `rol:billingReceivable` | `rol:recoveryIncome` | — | — |
| M-43 | `mor.prescription.executed` | Prescripción de deuda | `rol:debtPrescription` (pérdida) | `rol:billingReceivable` | — | P2158 |
| M-44 | `mor.collectionCase.costRegistered` | Gastos de gestión judicial/extrajudicial | `rol:judicialCostsReceivable` (si se recuperan) o gasto | Proveedor / banco | — | — |
| M-45 | `mor.guarantee.executed` / `.applied` / `.refunded` | Garantías y depósitos en garantía | Aplicación: `rol:guaranteesHeld` / Devolución: `rol:guaranteesHeld` | Aplicación: `rol:billingReceivable` / Devolución: banco | Con `refundMode = accountCredit` (por defecto, HUECO-OTR-04) `.refunded` no genera asiento aquí: lo registra M-133 al crearse el saldo a favor en M07, para no duplicar | — |

#### 9.1.4 Fiscal (M06 FIS)

| N.º | Evento | Hecho económico | Debe | Haber | Dimensiones / notas | Origen ProCoop |
|---|---|---|---|---|---|---|
| M-48 | `fis.withholding.confirmed` / `.cancelled` | Retención practicada a proveedor | `rol:accountsPayable` | `rol:withholdingsPayable` (por régimen) | Integra M-58 (pago); CU-FIS-01 (ARS 2.000) | P2136, BASE §61 |
| M-49 | `fis.obligation.created` (posición mensual IVA) | Liquidación de IVA | `rol:vatOutputRegistered`, `rol:vatOutputNonRegistered` | `rol:vatInput`; retenciones/percepciones sufridas; saldo a `rol:vatPayable` o `rol:vatCreditBalance` | Asiento de cierre de posición; requiere `fis.vatLedger.closed` | Nuevo |
| M-50 | `fis.remittance.approved` / `.paid` y `fis.thirdPartyCharge.collected` | Rendición a terceros (tasas, aportes, energía) | `rol:thirdPartyCollections` | Banco / proveedor (tercero); comisión de cobranza a ingresos | — | BASE §97.4 |
| M-51 | Pago de obligación fiscal (`tes.paymentExecution.executed` con obligación FIS) | Pago de impuestos | `rol:vatPayable` / `rol:withholdingsPayable` / impuestos a pagar | Banco | — | — |
| M-52 | `fis.vatLedger.closed` / `.reopened` | Cierre de libro IVA | Sin asiento; habilita/inhabilita M-49 | — | — | — |
| M-137 | `fis.obligation.created` (EVT-FIS-13) con `ownTaxObligationId` (obligación propia como contribuyente; DEC-095); reversión al anularse o recalcularse la obligación en M06 (EVT-FIS-26 `fis.obligation.cancelled` con `cancellationStatus = final`, contraasiento idempotente por `obligationId`; 10-11-2026) | Provisión de un impuesto o contribución propia del tenant, incluida la calculada sobre la base de capital de M17 (RF-INS-109) | Gasto del impuesto o contribución: cuenta de `entityAccountAssignments` (`entityType: ownTaxObligation`, `usage: expense`) o `rol:ownTaxExpense` (PRM-CON-196) | Deuda fiscal propia: cuenta de `entityAccountAssignments` (`usage: payable`) o `rol:ownTaxPayable` (PRM-CON-197) | En la `legalEntityId` de la obligación; fecha = fin del `period` de la obligación (RN-CON-128); dimensiones: impuesto, jurisdicción, servicio o sección si el registro de M06 los indica; idempotente por `obligationId`; con M-49 no se duplica: la posición de IVA no lleva `ownTaxObligationId` | Nuevo (DEC-095) |
| M-138 | EVT-TES-15 `tes.paymentExecution.executed` / `.voided` de una obligación propia (`taxObligation.ownTaxObligationId` del payload, con `taxObligation.legalEntityId` como entidad del asiento; DEC-095) | Pago de la obligación propia | `ownTaxPayable` (misma cuenta usada en M-137) | Banco o caja según el medio de pago de M14 | Variante de M-51 para obligaciones propias; `.voided` revierte; si la obligación no tiene provisión previa (M-137 pendiente), el evento queda `pendingConfiguration` | Nuevo (DEC-095) |

#### 9.1.5 Compras y proveedores (M12 CMP)

| N.º | Evento | Hecho económico | Debe | Haber | Dimensiones / notas | Origen ProCoop |
|---|---|---|---|---|---|---|
| M-55 | `cmp.purchaseOrder.approved` / `.cancelled` (a confirmar en M12) | Orden de compra | Sin asiento: crea/libera `commitments` | — | AGR-028; CU-OPE-01 (OC-DEMO-002 ARS 40.000) | — |
| M-56 | `stk.goods.received` sin factura | Recepción de bienes | Stock (cuenta del rubro/artículo) o gasto | `rol:goodsPendingDelivery` (facturas/recepciones pendientes) | Si P2982 todos los remitos se contabilizan | P2162, P2982 |
| M-57 | `cmp.supplierInvoice.registered` (EVT-CMP-08) | Factura de proveedor | Gasto/stock/bien de uso por ítem (cuenta del ítem, `FPITEMS_CTSEC` para centros); `rol:vatInput` (parte computable por centro); IVA no computable al gasto (P2890); `rol:purchaseOtherTaxes`; `rol:goodsPendingDelivery` (si hubo recepción) | `rol:accountsPayable` (o cuenta del proveedor, exigida por P3068); descuentos a `rol:purchaseDiscounts` | Porcentaje IVA por ítem (P2902) y por sección (`Porc_IVA_Compras`); CU-CON-05 | P2112, P2113, P2114, P2159, P2890, P2902 |
| M-58 | `cmp.paymentOrder.paid` / `tes.paymentExecution.executed` | Pago a proveedor | `rol:accountsPayable` | Banco / caja (`rol:supplierPaymentFromCashDesk`) / cheque propio diferido (`rol:ownChecksPending`) / valores de cartera entregados; retenciones (M-48); descuentos `rol:supplierPaymentDiscounts` | Puentes `rol:supplierPaymentCash` / `rol:supplierPaymentValues` cuando la OP y la salida de tesorería son pasos distintos; transferencias diferidas `rol:supplierPaymentDeferredTransfer` | P2141, P2148, P2149, P2155, P2156 |
| M-59 | `cmp.advance.paid` (a confirmar en M12) | Anticipo a proveedor | `rol:supplierAdvances` | Banco/caja | Se aplica al imputar factura | P2035 [VERIFICAR] |
| M-60 | `cmp.supplierInvoice.registered` con `kind = creditNote` (EVT-CMP-08) / `cmp.supplierInvoice.voided` (EVT-CMP-09) / `cmp.matchException.raised` (EVT-CMP-10) | NC de proveedor, anulación, diferencia de precio | Inverso de M-57 / diferencia a stock o resultado | Inverso | — | — |
| M-126 | `cmp.supplierInvoice.registered` con `wholesaleSupply.kind = energy` (EVT-CMP-08) | Compra de energía al mayorista (HUE-ELE-01) | `rol:wholesaleEnergyCost` por servicio ELE y zona/centro del punto de compra; `rol:vatInput`; `rol:purchaseOtherTaxes` | `rol:accountsPayable` | Costo de abastecimiento, nunca recargo del usuario (RN-CON-069); anulación y NC por M-60 | P2108 (uso como costo) |
| M-127 | `cmp.supplierInvoice.registered` con `wholesaleSupply.kind = gas` (EVT-CMP-08) | Compra de gas a la distribuidora (HUE-GAS-04) | `rol:wholesaleGasCost` por servicio GAS y zona/centro; `rol:vatInput`; `rol:purchaseOtherTaxes` | `rol:accountsPayable` | Igual que M-126 (RN-CON-069) | Nuevo |
| M-128 | `cmp.signalRightsSettlement.approved` / `.voided` (EVT-CMP-17) | Devengamiento de derechos de señales de TV (HUE-TV-01) | `rol:signalRightsCost` (servicio TV, por paquete en dimensión) | `rol:signalRightsAccrued` | La factura posterior de la programadora (M-57 con `signalRightsSettlementId`) debita `rol:signalRightsAccrued` en lugar del gasto; la diferencia con la liquidación va a `rol:signalRightsCost`; `.voided` revierte | Nuevo |

#### 9.1.6 Stock, bienes de uso y fabricación (M13 STK)

| N.º | Evento | Hecho económico | Debe | Haber | Dimensiones / notas | Origen ProCoop |
|---|---|---|---|---|---|---|
| M-61 | `stk.materials.consumed` (destino OT/OM/obra) | Consumo de materiales | Costo de la OT/OM (`rol:stockWorkOrders` / `rol:stockMaintenanceOrders`), obra (`GRPOBRA_CTSEC`) o gasto del servicio | Stock del rubro | P2548 usa cuenta de compras del artículo; servicio y centro en el renglón | P2150, P2151, P2548 |
| M-62 | `stk.materials.consumed` (vale de consumo interno) | Vales | Gasto del destino (vivienda P755/P2670 si aplica) | Stock / `rol:stockVouchers` | — | P2153, P755, P2670 |
| M-63 | Horas de mano de obra en OT (`tec.workOrder.closed` con horas) | Mano de obra imputada a OT | Costo OT / obra / `rol:workOrderValuedHours` | `rol:workOrderLaborHours` | Tarifas P2722/P2723 | P2166, P2167, P2722, P2723 |
| M-64 | `stk.physicalCount.closed` | Ajuste de inventario | Faltante: `rol:stockCountAdjustments` / Sobrante: stock | Faltante: stock / Sobrante: `rol:stockCountAdjustments` | — | P2152 |
| M-65 | Costo de ventas (con M-09) (`stk.goods.issued` a confirmar en M13) | CMV | `rol:costOfSales` | Stock | Valuación perpetua de STK | `btnValuacion` |
| M-66 | `stk.equipment.applied` (EVT-STK-04, comodato) / `stk.equipment.retrieved` (EVT-STK-05) | Equipos entregados en comodato | `rol:loanedEquipment` (si P2734 los muestra) | Stock | Cuentas de orden opcional | P2161, P2734 |
| M-67 | Altas de stock en orden (sin factura) | Ingreso a stock no facturado | Stock | `rol:stockActivationOrders` | — | P2154 |
| M-68 | Revaluación de stock (`stk.valuation.changed`, EVT-STK-14) | Revaluación por índice | Stock | `rol:inflationAdjustment` (RECPAM) o reserva | RN-CON-101 | `clsRevaluacion` |
| M-69 | Alta de bien de uso (`stk.fixedAsset.registered`, EVT-STK-17) | Activación (compra u obra terminada) | Bien de uso (rubro) | `rol:accountsPayable` / obra en curso / `rol:workInProgress` | Centro por `BIENES_USO_CTSEC` | `BIENES_USO`, `BIENES_USO_CTSEC` |
| M-70 | `stk.depreciation.posted` | Amortización del período | Amortización (gasto) por rubro y centro | Amortización acumulada del rubro | Devuelve `journalRef` a STK; revertir revierte acumulados (RN-CON-061) | `BIENES_USO_AMORT`, P2936, P3076 |
| M-71 | Mejora / disminución / revalúo de bien (`stk.fixedAsset.valueChanged`, EVT-STK-17, con el tipo de cambio en el payload) | Mejoras y revalúos | Bien de uso / pérdida por desvalorización | Proveedor / bien de uso / reserva por revalúo (separada si P2936) | — | `BIENES_USO_DISM`, `BIENES_USO_HST`, P2936 |
| M-72 | Baja o venta de bien (`stk.fixedAsset.disposed`, a confirmar en M13) | Baja | Amortización acumulada; deudores/caja (venta); `rol:assetDisposalResult` (pérdida) | Bien de uso; `rol:assetDisposalResult` (ganancia) | — | — |
| M-73 | Ajuste por inflación de bienes (`stk.fixedAsset.valueChanged`, EVT-STK-17, tipo ajuste por inflación) | Reexpresión | Bien de uso / amortización | `rol:inflationAdjustment` | Valores históricos según P3076 | P3076 |
| M-74 | Fabricación: inicio / fin (`stk.manufacturing.inProcess` / `.finished`, EVT-STK-20) | Productos en proceso | Inicio: `rol:workInProgress` / Fin: stock de producto terminado | Inicio: stock de insumos, `rol:workOrderLaborHours` / Fin: `rol:workInProgress` | — | P3141 |
| M-75 | `stk.equipment.swapped` (EVT-STK-06) / RMA | Reemplazo de unidad en garantía | Stock (unidad nueva) / pérdida si no hay reposición | Stock (unidad defectuosa) / proveedor | — | — |

#### 9.1.7 Técnica y obras (M10 TEC)

| N.º | Evento | Hecho económico | Debe | Haber | Dimensiones / notas | Origen ProCoop |
|---|---|---|---|---|---|---|
| M-78 | `tec.workOrder.closed` | Costo de OT | Ver M-61 y M-63; costo a servicio y centro según `CAT_INCI_CTSEC` (por categoría de incidencia) | — | Sin importe propio: agrega materiales y horas | `CAT_INCI_CTSEC` |
| M-79 | Obra finalizada (`tec.work.completed`, EVT-TEC-34) | Obra en curso → bien de uso o gasto | Bien de uso / gasto de mantenimiento | Obra en curso (`GRPOBRA_CTSEC`) | — | `GRPOBRA_CTSEC` |
| M-80 | `tec.levy.approved` | Contribución de obra a frentistas | Facturación vía M-01 | — | — | — |

#### 9.1.8 Tesorería y bancos (M14 TES)

| N.º | Evento | Hecho económico | Debe | Haber | Dimensiones / notas | Origen ProCoop |
|---|---|---|---|---|---|---|
| M-82 | `tes.operation.posted` (movimiento bancario con categoría) | Créditos/débitos bancarios (gastos, intereses, impuesto a débitos y créditos) | Gasto de la categoría (`CAT_BANC`) / banco | Banco / ingreso de la categoría | Sin categoría: `rol:bankCreditsUncategorized` / `rol:bankDebitsUncategorized` | P2118, P2119 |
| M-83 | `tes.deposit.registered` / `.credited` | Depósito de efectivo y valores | Banco | Caja / `rol:chequesInPortfolio` | Valores depositados pendientes de acreditar según TES | — |
| M-84 | `tes.cashRemittance.accepted` | Rendición de caja a tesorería | Caja de tesorería | Caja de cobranza (`rol:cashClose`) | — | P2101 |
| M-85 | `tes.thirdPartyCheck.rejected` | Cheque de tercero rechazado | `rol:rejectedCheques` (luego ND al socio) | Banco / `rol:chequesInPortfolio` | Gastos de rechazo según P2517/P2384 | P2134, P2517, P2384 |
| M-86 | `tes.thirdPartyCheck.stateChanged` (entregado a proveedor, recuperado) | Endoso o recupero | Proveedor / `rol:chequesInPortfolio` | `rol:chequesInPortfolio` / `rol:rejectedCheques` | — | — |
| M-87 | `tes.ownCheck.issued` / `.debited` / `.voided` | Cheque propio diferido | Emisión: proveedor; Débito: `rol:ownChecksPending` | Emisión: `rol:ownChecksPending`; Débito: banco | — | — |
| M-88 | `tes.cardVoucher.presented` / `tes.cardSettlement.recorded` / `tes.cardVoucher.rejected` | Cupones de tarjeta | Presentación: `rol:cardCouponsSubmitted` / Liquidación: banco, `rol:cardCommissions`, `rol:vatInput` / Rechazo: `rol:customerAdvances` o deudores | Presentación: `rol:cardCouponsInPortfolio` / Liquidación: `rol:cardCouponsSubmitted` / Rechazo: `rol:cardCouponsSubmitted` | — | P2121, P2127, P2128 |
| M-89 | `tes.receivedWithholding.presented` / `.presentationVoided` | Retenciones sufridas presentadas | Crédito fiscal (cuenta del impuesto) | `rol:withholdingsSuffered` | — | P2136; TipoCuenta 2120, 2123, 2124 |
| M-90 | `tes.operation.posted` (canje de valores, transferencia interna, préstamos, plazo fijo) | Movimientos entre cuentas de tesorería | Cuenta destino | Cuenta origen | Canje según P2076; diferencia de cambio a `rol:fxDifferences` | P2076 |
| M-91 | `tes.cashClosing.closed` | Cierre de caja de tesorería | Diferencias como M-30 | — | Habilita checklist de período (PRM-CON-013) | P3100 |
| M-92 | `tes.operation.voided` | Anulación de operación de tesorería | Inverso | Inverso | — | — |
| M-93 | `tes.exchangeRate.published` + revaluación al cierre | Diferencia de cambio en saldos en moneda extranjera | Cuenta en moneda / `rol:fxDifferences` | `rol:fxDifferences` / cuenta en moneda | Job de cierre mensual | — |
| M-94 | `tes.commitment.created` / `.consumed` / `.released` | Compromisos de tesorería | Sin asiento: alimenta presupuesto financiero | — | — | — |

#### 9.1.9 Sueldos (M16 SUE)

Estrategia de sueldos (DEC-058): en O8 M16 importa la liquidación del liquidador externo y publica los mismos eventos de esta tabla; en O9 los publica al aprobar la liquidación propia (con dos períodos en paralelo). M15 contabiliza ambos orígenes con las mismas reglas y por entidad jurídica empleadora (`legalEntityId`, DEC-064).

| N.º | Evento | Hecho económico | Debe | Haber | Dimensiones / notas | Origen ProCoop |
|---|---|---|---|---|---|---|
| M-96 | `sue.payrollRun.approved` | Devengamiento de sueldos | Remuneraciones y contribuciones por concepto/empleado/centro (formato P2207: por concepto, por empleado o plantilla `SU_ASIENTOS`) | `rol:payrollPayable` (neto); `rol:socialSecurityPayable` (aportes y contribuciones); `rol:payrollWithholdingsPayable` (sindicato, ganancias, embargos); adelantos a `rol:employeeAdvances` | Centros según distribución del empleado; P2714 limita centros a sueldos; CU-104 | P2207, P2714, `SU_ASIENTOS`, `SU_CONCEPTOS`, `SU_SINDICATO` |
| M-97 | `sue.payrollRun.voided` | Anulación de liquidación | Contraasiento de M-96 | — | — | — |
| M-98 | Pago de sueldos (`tes.paymentExecution.executed` de la solicitud `sue.paymentRequest.created`) | Pago del neto | `rol:payrollPayable` | Banco / caja | Sin factura de compra ficticia (RN-CON-058) | P2034, P2538, P2288 |
| M-99 | Pago de cargas sociales y sindicales (`sue.filing.filed` + pago TES) | Pago F.931 y sindicatos | `rol:socialSecurityPayable` / `rol:payrollWithholdingsPayable` | Banco | — | — |
| M-100 | Provisión de SAC y vacaciones (corrida mensual) | Devengamiento proporcional | Gasto SAC / vacaciones (por centro) | `rol:sacProvision` / `rol:vacationProvision` | Al liquidar SAC se aplica la provisión (PA-CON-11) | Nuevo |
| M-101 | `sue.lawsuit.provisionChanged` | Juicios laborales | Gasto por juicios | Previsión para juicios | — | — |
| M-102 | `sue.externalPayroll.approved` | Liquidación externa | Igual a M-96 | Igual a M-96 | — | — |
| M-103 | `sue.serviceDebt.deducted` | Descuento de deuda de servicios en recibo | `rol:payrollPayable` | `rol:billingReceivable` | Solo con PA-SUE-06 | — |

#### 9.1.10 Institucional y capital (M17 INS)

| N.º | Evento | Hecho económico | Debe | Haber | Dimensiones / notas | Origen ProCoop |
|---|---|---|---|---|---|---|
| M-105 | `ins.capitalMovement.recorded` (antes `ins.capital.movement.recorded`) (suscripción) | Suscripción de cuotas sociales | `rol:capitalSubscribedReceivable` (asociados, cuenta suscripción) | `rol:capitalMovements` (capital suscripto) | Momento según P73/P2636 | P73, P2636, P2129 |
| M-106 | `ins.capitalMovement.recorded` (antes `ins.capital.movement.recorded`) (integración) | Integración (facturada o directa) | Caja/banco o deudores (si facturado, M-02) | `rol:capitalSubscribedReceivable`; reclasificación a `rol:capitalPaidIn` | P2916 integra al cobrar | P2133, P2916 |
| M-107 | `ins.capitalMovement.recorded` (antes `ins.capital.movement.recorded`) (ajuste de capital) | Ajuste de capital por inflación | `rol:inflationAdjustment` | Ajuste de capital | — | — |
| M-108 | `ins.capitalRefund.approved` (antes `ins.capital.refund.approved`) | Rescate aprobado | `rol:capitalPaidIn` | `rol:capitalToRefund` | — | P2130 |
| M-109 | `ins.capitalRefund.paid` (antes `ins.capital.refund.paid`) | Pago de rescate | `rol:capitalToRefund` | Banco / caja | — | P2130 |
| M-110 | `ins.capitalMovement.recorded` (antes `ins.capital.movement.recorded`) (compensación con incobrables) | Capital rescatado aplicado a deuda | `rol:capitalPaidIn` / `rol:capitalRedeemedBadDebtors` | `rol:billingReceivable` | — | P2131 |
| M-111 | `ins.capitalTransfer.executed` (antes `ins.capital.transfer.executed`) | Transferencia de capital entre asociados | Sin asiento (cambio de titular en el auxiliar) | — | Solo cambia dimensión socio; si el plan lleva subcuenta por socio, reclasificación | — |
| M-112 | `ins.capitalMovement.reversed` (antes `ins.capital.movement.reversed`) | Reverso de movimiento | Inverso | Inverso | — | — |
| M-113 | `ins.surplusDistribution.approved` (antes `ins.surplus.distribution.approved`) | Distribución de excedentes (asamblea) | `rol:unassignedSurplus` | `rol:legalReserve`; `rol:educationFund` (educación y capacitación); `rol:mutualAidFund` (acción asistencial) [VERIFICAR fondos vigentes]; `rol:capitalInterestPayable`; `rol:surplusReturnsPayable`; `rol:specialReserve` (resultados con no asociados) | Art. 42 Ley 20.337 [VERIFICAR] (RN-CON-105, MER-011) | — |
| M-114 | `ins.surplusDistribution.executed` (antes `ins.surplus.distribution.executed`) | Pago o capitalización de retornos e intereses | `rol:surplusReturnsPayable` / `rol:capitalInterestPayable` | Banco / caja / `rol:capitalSubscribedReceivable` o capital (capitalización) / acreditación en cuenta (`rol:customerAdvances`) | — | — |
| M-115 | `ins.fee.settled` | Honorarios de consejeros/síndicos | Gasto de honorarios | Honorarios a pagar | Retenciones vía FIS | — |

#### 9.1.11 Contabilidad propia (M15 CON)

| N.º | Evento / acción | Hecho económico | Debe | Haber | Notas | Origen ProCoop |
|---|---|---|---|---|---|---|
| M-118 | Asiento manual / plantilla | Cualquier hecho no automatizado | Según usuario | Según usuario | RN-CON-001…006, aprobación sobre umbral | `frmAsientos`, `abm_Asiento_Personalizado` |
| M-119 | Ajuste por inflación (JOB-CON-06) | Reexpresión | Cuentas ajustables (no monetarias) / `rol:inflationAdjustment` | `rol:inflationAdjustment` / cuentas ajustables | Diferencia neta = RECPAM | P2139, `TABINFL`, `INFLACIO` |
| M-120 | Cierre de cuentas de resultado (refundición) | Asiento de cierre 1 | Cuentas de ingresos | Cuentas de egresos; diferencia a `rol:resultAllocation` (o destinos de `resultTargets`) | — | `RESULTA`, `CTEJER.ID_ASIENTO_CIERRE1`, P513 |
| M-121 | Cierre patrimonial | Asiento de cierre 2 | Pasivo y patrimonio | Activo | Cuentas de orden según PA-CON-13 | `CTEJER.ID_ASIENTO_CIERRE2` |
| M-122 | Apertura | Asiento de apertura | Activo | Pasivo y patrimonio; resultado a `rol:unassignedSurplus` hasta asamblea | — | `CTEJER.ID_ASIENTO_APERTURA` |
| M-123 | Reclasificación de distribución de costos (opcional) | Exposición de comunes en servicios | Costos del centro destino | Costos del centro común | RF-CON-089 | Nuevo |
| M-124 | Provisiones recurrentes | Gastos devengados no documentados | Gasto | Provisión / acreedores | Reversión automática | Nuevo |
| M-125 | Reapertura de ejercicio | — | Contraasientos de M-120…M-122 | — | Doble aprobación | Nuevo |

#### 9.1.12 Servicios sociales y otros servicios (M18 SOC, M05, M07)

| N.º | Evento | Hecho económico | Debe | Haber | Dimensiones / notas | Origen ProCoop |
|---|---|---|---|---|---|---|
| M-129 | `fac.invoice.issued` con concepto de clase "aporte al fondo de subsidio" (`itemClass = subsidyFundContribution`, RN-CON-126) | Constitución del fondo de subsidio con aportes facturados (HUECO-SEP-03) | `rol:billingReceivable` | `rol:socialSubsidyFund` | Solo si el reglamento del subsidio constituye el fondo con aportes (PA-SOC-10); si no, el aporte es ingreso por M-01. Servicio SEP en dimensión | Nuevo |
| M-130 | `soc.deathSubsidy.approved` (EVT-SOC-04) | Subsidio por fallecimiento aprobado (HUECO-SEP-03) | `rol:socialSubsidyFund` hasta su saldo disponible; excedente a `rol:socialSubsidy` (o pendiente según PRM-CON-194) | `rol:socialSubsidyPayable` por beneficiario | `caseId` y servicio SEP en dimensión; un evento repetido no duplica (RN-CON-122) | Nuevo |
| M-131 | `tes.paymentExecution.executed` de la orden de pago del subsidio | Pago del subsidio a beneficiarios (HUECO-SEP-03) | `rol:socialSubsidyPayable` | Banco / caja | Vínculo por `caseId` | Nuevo |
| M-132 | `fac.invoice.issued` con ítem facturable de clase "depósito en garantía" (M05; `itemClass = guaranteeDeposit`, RN-CON-126) | Depósito en garantía cobrado al socio, por ejemplo el del préstamo ortopédico (HUECO-OTR-04) | `rol:billingReceivable` | `rol:guaranteesHeld` | No es ingreso (RN-CON-123); su tratamiento fiscal sigue la clase del concepto en M06 | Nuevo |
| M-133 | `cob.creditBalance.created` con `origin = guaranteeRefund` (EVT-COB-09) | Devolución del depósito como crédito a la cuenta (HUECO-OTR-04) | `rol:guaranteesHeld` | `rol:customerAdvances` (saldo a favor) | Aplicación posterior a deuda por M-26 o reintegro en dinero por M-29; la retención por daño o faltante usa M-45 | Nuevo |
| M-134 | `fac.invoice.issued` con concepto "derecho de sepultura" (`itemClass = burialRightAcquisition`, RN-CON-126) y PRM-CON-193 = `atGrant` | Venta del derecho de sepultura, opción por defecto (HUECO-CEM-04) | `rol:billingReceivable` | Ingreso del período del concepto (`rol:serviceRevenue` del servicio CEM); IVA según la clase del concepto en M06 | El mantenimiento se reconoce como ingreso periódico por M-01 (RN-CON-124) | Nuevo |
| M-135 | `fac.invoice.issued` con concepto "derecho de sepultura" (`itemClass = burialRightAcquisition`, RN-CON-126) y PRM-CON-193 = `deferredOverTerm`; devengamiento por JOB-CON-23; `soc.burialRight.extinguished` (EVT-SOC-05) | Venta del derecho con ingreso diferido, opción B de PA-CON-17 (HUECO-CEM-04) | Al facturar: `rol:billingReceivable` / Al devengar: `rol:burialRightDeferredRevenue` | Al facturar: `rol:burialRightDeferredRevenue`; IVA según M06 / Al devengar: `rol:serviceRevenue` del servicio CEM | Prorrateo mensual por la vigencia del derecho de EVT-SOC-05; la extinción anticipada devenga el saldo remanente | Nuevo |
| M-136 | `cob.payment.confirmed` (EVT-COB-04) con recibos de una entidad jurídica distinta de la de la caja (RN-COB-153 de M07) | Cobro en la caja de la entidad A de deuda de la entidad B (DEC-087) | En A: caja o valores según el medio (el dinero ingresó en A) / En B: `rol:interEntityAccount` (crédito contra A) | En A: `rol:interEntityAccount` (deuda con B) / En B: `rol:billingReceivable` (cancela la deuda del asociado) | Dos asientos, uno por entidad, con el mismo `sourceEventId`; idempotente por recibo; el traspaso de fondos entre entidades cancela ambas cuentas | Nuevo (DEC-064, DEC-087) |

### 9.2 P-CON-01 Contabilización en tiempo real (JOB-CON-01 `con:contabilizar-evento`)

1. El consumidor outbox recibe el evento; verifica `tenantId` y contrato; si `sourceEventId` existe, responde OK sin efecto (RN-CON-011).
2. Persiste en `accountingEvents` (`received`).
3. Determina el modo del módulo (`postingModes`); si es resumen, deja el evento en `received` para el lote.
4. Resuelve cada renglón por la cascada (entidad → regla → rol). Si falta cuenta, centro obligatorio o equivalencia: `pendingConfiguration` con `issues[]`; emite `con.event.pendingConfiguration` (EVT-CON-04); fin.
5. Consulta `periodGuard` para la fecha contable; si el período del módulo está bloqueado, aplica la política del módulo (fecha del primer día abierto con nota, o `error`).
6. Arma el asiento, valida balance y tolerancia de redondeo (diferencia ≤ PRM-CON-008 a `rol:billingRounding`/`rol:cashCloseRounding`, si no `error`).
7. En una transacción: inserta `journalEntries` y `journalLines`, actualiza `ledgerBalances`, marca el evento `posted`, escribe outbox `con.entry.posted`.
8. Reintentos con backoff exponencial (5 intentos); luego `error` y alerta. Reanudable.

Reversión: un evento con `reversesEventId` busca el asiento original; si su período está abierto y la política lo permite, anula; si no, contraasiento con fecha del evento.

### 9.3 P-CON-02 Contabilización por lote ("Cierre automático", JOB-CON-02 `con:cierre-diario`)

Reemplaza `frmCierreDiario`. Entrada: rango de fechas, módulos (orden ProCoop: ventas, pagos de otros períodos, cobranza, tesorería, bancos, financiaciones, compras, stock, capital, sueldos, fabricación, bienes de uso), opciones (detalle diario, detalle por operación, composición de stock, fecha de emisión en ventas, filtro de tipos de factura, valuación). Pasos: (1) bloquea el rango contra otro lote concurrente; (2) toma eventos `received` del rango y módulos; (3) agrupa según `groupBy` (por día, servicio, concepto, tipo de factura, caja); (4) genera borradores (`preview`) y advertencias (cajas abiertas, eventos pendientes de configuración); (5) el usuario revisa en PAN-CON-17 y confirma o descarta; (6) al confirmar, contabiliza los borradores y marca los eventos `posted`. Es idempotente: re-ejecutar un rango ya contabilizado no duplica (RN-CON-011). Reanudable por evento.

### 9.4 P-CON-03 Reproceso de pendientes (JOB-CON-03 `con:reprocesar-pendientes`)

Al publicar una versión de configuración contable (T04) o a demanda, toma los eventos `pendingConfiguration`/`error` cuyas `issues` referencian lo corregido y los reprocesa. Informe de resultado por causa.

### 9.5 P-CON-04 Cierre mensual (checklist)

1. Bloqueo blando de módulos operativos (`softLocked`) a la fecha de corte.
2. Checklist: eventos pendientes = 0; cajas cerradas (PRM-CON-013); corrida de amortización contabilizada (STK); provisiones (SAC, incobrables, ingresos no facturados) corridas; posición IVA; conciliaciones obligatorias (`memberReceivables`, `cashBanks`, `suppliers`, `vat`) en `balanced` o `explained`; diferencia de cambio.
3. Asientos de ajuste manuales (solo contador).
4. Cierre del período (`closed`): todos los `moduleLocks` a la fecha; emite `con.period.closed`.
5. Reapertura (`con.periodos.reabrir`) con motivo, aprobación T11 y plazo; emite `con.period.reopened`.

### 9.6 P-CON-05 Cierre de ejercicio (JOB-CON-05 `con:cierre-ejercicio`)

1. Precondición: todos los períodos `closed`, ajuste por inflación contabilizado si corresponde.
2. Ejercicio a `closing`.
3. Genera en borrador cierre de resultados (M-120, con `resultTargets`), cierre patrimonial (M-121) y apertura del ejercicio siguiente (M-122), con fechas último/primer día.
4. Vista previa con sumas y saldos post cierre (todas las cuentas de resultado en cero).
5. Confirmación por `con.ejercicios.cerrar`; ejercicio a `closed`; guarda `closingEntries`; emite `con.fiscalYear.closed`.
6. Reapertura (`con.ejercicios.reabrir`): doble aprobación; contraasientos de los tres; `reopened`.

### 9.7 P-CON-06 Ajuste por inflación (JOB-CON-06 `con:ajuste-inflacion`)

Verifica índices de todos los meses involucrados (si falta uno, aborta con lista); calcula por cuenta ajustable y mes de origen (o saldo de apertura) el coeficiente; genera `inflationAdjustmentRuns` en `preview`; el contador revisa y contabiliza (M-119); el bien de uso y el stock se reexpresan con sus eventos STK (M-68, M-73) para no duplicar: el job excluye las cuentas cuyo ajuste emite STK.

### 9.8 P-CON-07 Distribución de costos (JOB-CON-07 `con:distribuir-costos`)

Toma costos de los centros comunes del período (solo asientos `posted`), aplica modelos/drivers (porcentaje fijo o base medida: suministros activos, kWh, m³, horas, metros de red), escribe `costDistributionRuns` con totales y no asignados; opcionalmente genera asiento de reclasificación (M-123). CU-CON-01: comunes 4.000 con DIST-DEMO-25-75 → Agua 1.000, Internet 3.000.

### 9.9 P-CON-08 Conciliaciones (JOB-CON-08 `con:conciliar`)

Programado (diario para deudores y bancos; mensual para resto). Compara el auxiliar del módulo dueño a la fecha de corte (API de solo lectura de COB, TES, CMP, STK, INS, SUE, FIS) con el saldo contable de las cuentas de control, por la dimensión elegida; clasifica diferencias (corte, estado, clasificación, sin explicar); emite `con.reconciliation.differenceDetected` si hay diferencias sin explicar.

### 9.10 P-CON-09 Simulación (JOB-CON-09 `con:simular-escenario`)

Copia el universo real (líneas `posted` del rango y corte), aplica supuestos (equivalencias de plan, distribución alternativa, variaciones de tarifa o costos), escribe `simulatedJournalLines`, verifica balance y equivalencias completas (`comparable`), calcula `results` y `runHash`. No escribe en colecciones oficiales ni emite `con.entry.*`. CU-ERP-01: tarifa +10 % sobre 38.000 → 41.800.

### 9.11 Otros procesos

| ID | Job | Disparo | Descripción |
|---|---|---|---|
| JOB-CON-10 | `con:proyectar-planes` | Evento `con.entry.posted` / reconstrucción | Proyecta asientos oficiales a planes alternativos y regulatorios por `accountMappings`; marca sin equivalencia. |
| JOB-CON-11 | `con:reconstruir-saldos` | A demanda / nocturno | Recalcula `ledgerBalances` desde `journalLines` y compara (RN-CON-092). |
| JOB-CON-12 | `con:exportar-externo` | Programado / a demanda | Exporta asientos a sistema contable externo (layout, idempotente por rango y versión; marca `exported`). |
| JOB-CON-13 | `con:importar-asientos` | Carga de archivo | Valida (cuentas, balance, período, duplicados por `externalId`), vista previa y contabiliza o deja borradores (`ExcelImportWizard`). |
| JOB-CON-14 | `con:presupuesto-ejecucion` | Nocturno / eventos | Recalcula ejecución (presupuestado, comprometido, devengado, pagado) y alertas de exceso. |
| JOB-CON-15 | `con:generar-estados` | A demanda | Genera estados contables con plantilla, comparativo y anexos; congela snapshot y hash al emitir. |
| JOB-CON-16 | `con:renumerar-asientos` | A demanda | Renumera asientos de un ejercicio por fecha en períodos no transcriptos (`frmRenumerar`). |
| JOB-CON-17 | `con:anular-masivo` | A demanda | Anulación/contraasiento masivo de lo seleccionado, con validación por asiento y eventos de reversión a módulos dueños (`frmEliminacionMasiva`, mejorado). |
| JOB-CON-18 | `con:transcribir-rubricado` | A demanda | Genera PDF de hojas rubricadas con folios correlativos y registra transcripción. |
| JOB-CON-19 | `con:salud-configuracion` | Diario y al publicar config | Detecta roles sin cuenta, cuentas no imputables usadas, reglas solapadas, conceptos/productos/bancos/proveedores sin cuenta, centros obligatorios faltantes. |
| JOB-CON-20 | `con:asientos-recurrentes` | Diario | Genera asientos de plantillas recurrentes y reversiones automáticas de provisiones. |
| JOB-CON-21 | `con:provisiones-cierre` | Cierre mensual | Provisiones de SAC/vacaciones (con datos SUE), incobrables (con antigüedad de MOR/COB) e ingresos no facturados (con consumo aprobado de MED y cuadro tarifario). |
| JOB-CON-22 | `con:diferencia-cambio` | Cierre mensual | Revalúa saldos en moneda extranjera con cotización de TES. |
| JOB-CON-23 | `con:devengar-derechos-sepultura` | Cierre mensual | Con PRM-CON-193 = `deferredOverTerm`, devenga la porción del período del ingreso diferido por derechos de sepultura (M-135; HUECO-CEM-04). |

## 10. Pantallas

Todas en `apps/admin` bajo `AdminShell`, con `AdminStickyHeader` (título, migas, acciones primarias), `ScreenHelp` (texto `dict:con.help.<pantalla>`), `DataTable` (columnas configurables, filtros persistentes, exportación según `con.reportes.exportar`, paginación de servidor `{items,total,page,size}`), modales `sm`/`md`/`lg`/`xl`, `ConfirmDialog` para acciones destructivas o de cierre, y `ExcelImportWizard` para importaciones. Los importes se muestran con separador de miles y coma decimal; fechas `dd-mm-yyyy`. Los operadores de otros módulos ven el asiento vinculado desde el documento de origen en un modal `lg` de solo lectura (`con.asientos.verVinculado`). La IA, cuando está habilitada, solo **propone** (cuenta sugerida, anomalía), con aceptación explícita.

### PAN-CON-01 Tablero contable

- Ruta `/con`; capability `con.asientos.ver`. Propósito: estado del mes y alertas.
- Layout: tarjetas (eventos pendientes de configuración, eventos en error, borradores, períodos abiertos, conciliaciones con diferencias, roles sin cuenta, último lote, ejecución presupuestaria del mes) + lista de tareas del cierre mensual.
- Acciones: ir a bandeja, ir a cierre de período, ejecutar lote. Vacío: `dict:con.dashboard.empty` ("Todavía no hay movimientos contables en este ejercicio"). Equivalencia INV: — (nuevo).

### PAN-CON-02 Configuración contable

- Ruta `/con/configuracion`; capability `con.config.ver` / `con.config.configurar`.
- Layout: formulario por pestañas (General, Numeración, Centros de costo, Modo por módulo, Fechas base, Tolerancias, Aprobaciones, Cierre, Inflación, Presupuesto, Sistema externo) con borrador y publicación versionada (T04); historial de versiones en modal `lg` con diferencias.
- Acciones: guardar borrador, validar, publicar (ConfirmDialog con resultado del validador de salud). Equivalencia INV: parámetros de `VARIABLE` sección CONTABILIDAD (sin formulario propio en ProCoop).

### PAN-CON-03 Planes de cuentas

- Ruta `/con/planes`; capability `con.planes.ver`.
- Filtros: propósito, estado, vigencia. Columnas: código, nombre, propósito, estado, versión, vigencia, ejercicios que lo usan, cuentas.
- Acciones: nuevo, copiar (modal `md`), aprobar, promover a operativo para un ejercicio (`con.planes.promover`, ConfirmDialog), archivar, aplicar plantilla de plataforma. Vacío: `dict:con.charts.empty` con botón "Aplicar plan modelo". Equivalencia INV: — (ProCoop tiene un solo plan).

### PAN-CON-04 Árbol y ficha de cuentas

- Ruta `/con/planes/:chartId/cuentas`; capability `con.cuentas.ver` / `con.cuentas.editar`.
- Layout: árbol a la izquierda (expandir/colapsar, búsqueda por código o nombre) y ficha a la derecha. Filtros: imputable, naturaleza, rubro, ajustable, estado, con movimientos, "sin rubro".
- Ficha: código, nombre, padre, imputable, naturaleza, saldo normal, regularizadora, rubro/subrubro, ajustable, monetaria, política de centros y centros permitidos, distribución por defecto, dimensiones requeridas, moneda, cuenta de control, subcuenta y dígito verificador (columna opcional, ex P2814), líneas de estados, categoría INAES, código externo, vigencia, historial de códigos. Pestaña "Uso": roles, reglas y entidades que apuntan a la cuenta.
- Acciones: alta, edición, inactivar, imprimir plan (PDF), exportar, unificar y renumerar (PAN-CON-06). Modales: alta rápida `md`. Equivalencia INV: `abm_CtPlan` (`cboAjustable` → ajustable, `cboImputable` → imputable, `chkVista` → vista árbol/lista, `Show_Imprimir` → imprimir plan, `btnUinificar` → PAN-CON-06).

### PAN-CON-05 Rubros y subrubros contables

- Ruta `/con/planes/:chartId/rubros`; capability `con.cuentas.editar`.
- Columnas: código, nombre, tipo, sección de estados, orden, cuentas asociadas. Acciones: alta/edición en modal `md`, ordenar, inactivar. Equivalencia INV: `abm_CtsRubros`.

### PAN-CON-06 Renumerar y unificar cuentas

- Ruta `/con/planes/:chartId/cuentas/mantenimiento`; capability `con.cuentas.renumerar` / `con.cuentas.unificar`.
- Renumerar: cuenta, código nuevo, vista previa de hijos afectados. Unificar: cuenta origen(es), destino, vista previa de movimientos, roles, reglas y asignaciones que se redirigen; confirmación con motivo. Equivalencia INV: `frmRenumerarCuentas`; botón `btnUinificar` de `abm_CtPlan`.

### PAN-CON-07 Roles de cuenta

- Ruta `/con/planes/:chartId/roles`; capability `con.reglas.ver` / `con.reglas.editar`.
- Columnas: rol (etiqueta `dict:con.role.<roleKey>`), grupo (ventas, cobranza, compras, tesorería, stock, capital, sueldos, cierre), cuenta, overrides, número V2 de origen, PRM-ID, estado ("sin asignar" resaltado). Filtro "solo sin asignar".
- Acciones: asignar cuenta (selector de imputables), agregar override por dimensión (modal `md`). Equivalencia INV: cuentas por defecto de `VARIABLE` (`TIP_CTRL = 6`).

### PAN-CON-08 Reglas de imputación y simulador

- Ruta `/con/reglas`; capability `con.reglas.ver` / `con.reglas.editar`.
- Filtros: tipo de evento, rol de importe, cuenta, dimensión, estado, vigencia. Columnas: código, nombre, evento, rol de importe, condiciones (chips), cuenta, centro/modelo, prioridad, vigencia, versión, estado.
- Acciones: alta/edición (modal `xl` con constructor de condiciones), retirar, duplicar, detectar solapamientos. **Simulador** (modal `xl`): elegir un tipo de evento y dimensiones o un documento real; muestra el asiento resultante y la ruta de resolución por renglón sin contabilizar. Equivalencia INV: — (en ProCoop, `CTCUENTA_ASIGNA` sin pantalla propia identificada [VERIFICAR] y `SISCONT`).

### PAN-CON-09 Asignación y reasignación masiva de cuentas

- Ruta `/con/asignaciones`; capability `con.reglas.editar`.
- Selector de tipo de entidad (productos, servicios, alícuotas, tipos de factura, grupos contables, proveedores, bancos, tipos de valor, categorías bancarias, retenciones, conceptos de sueldo, sindicatos, obras, categorías de incidencia, rubros de capital); grilla con la cuenta por uso; filtro "sin asignar"; agrupación; selección múltiple y "asignar cuenta/rubro a seleccionados" con vista previa. Auditoría "Reasignar cuentas y rubros". Equivalencia INV: `frmAsignarCuentasYRubros`.

### PAN-CON-10 Ejercicios

- Ruta `/con/ejercicios`; capability `con.ejercicios.ver`.
- Columnas: número, desde, hasta, estado, irregular, plan operativo, asientos de cierre/apertura, cerrado por, fecha de cierre. Acciones: nuevo (modal `md` con validación de solapamiento), abrir, ir a cierre (PAN-CON-31). Equivalencia INV: `abm_CtEjer`.

### PAN-CON-11 Períodos y bloqueos por módulo

- Ruta `/con/periodos`; capability `con.periodos.ver` / `con.periodos.bloquear` / `con.periodos.reabrir`.
- Matriz meses × módulos (facturación, comprobantes de venta, cobranza, compras, bancos, tesorería, financiaciones, vivienda, stock, bienes de uso, sueldos, capital, contabilidad) con estado y fecha "bloqueado hasta"; panel de checklist del cierre mensual con bloqueantes enlazados.
- Acciones: bloquear/desbloquear módulo hasta fecha, cerrar período (ConfirmDialog), solicitar reapertura (modal `md` con motivo y plazo; workflow T11). Equivalencia INV: fechas de cierre en parámetros (P67, P432, P500, P501, P502, P504, P505, P506, P2376, P2528, P2778, P2785).

### PAN-CON-12 Diario (asientos)

- Ruta `/con/asientos`; capability `con.asientos.ver`.
- Filtros: rango por fecha contable o de registro, tipo, origen (manual/automático/importado/lote), módulo, estado, cuenta, centro, usuario, importe, documento, transcripto. Columnas: número, fecha, tipo, descripción, origen, debe, haber, estado, usuario, folio.
- Acciones: nuevo, abrir, duplicar, anular/revertir (ConfirmDialog con motivo), imprimir (PDF diario), exportar. Vacío: `dict:con.entries.empty`. Equivalencia INV: `frmAsientos`.

### PAN-CON-13 Asiento (alta, edición y detalle)

- Ruta `/con/asientos/:id`; capability `con.asientos.crear` / `con.asientos.editar` / `con.asientos.contabilizar` / `con.asientos.aprobar`.
- Cabecera: fecha, descripción, tipo, ejercicio/período (derivados), número (al contabilizar), adjuntos. Grilla de renglones: cuenta (autocompletar por código/nombre, solo imputables), debe, haber, detalle, dimensiones, distribución por centros (modal `md` con porcentajes y decimales de PRM-CON-006). Totales y diferencia en vivo; botón "Balancear" no existe (el usuario corrige).
- Detalle de automáticos: solo lectura, ruta de resolución por renglón, documentos y eventos de origen (enlaces), versión de configuración, contraasiento vinculado. Línea de tiempo de estados y aprobaciones (grabó/revisó/autorizó).
- Acciones: guardar borrador, enviar a aprobación, contabilizar, aprobar/rechazar, anular, revertir, imprimir. Equivalencia INV: `frmAsientos_Detalle`, `Estado_AsientoDetalle` (estado y detalle del asiento).

### PAN-CON-14 Plantillas de asiento

- Ruta `/con/plantillas`; capability `con.asientos.crear`.
- Columnas: código, nombre, uso (manual, recurrente, sueldos, provisión, ajuste de cierre), recurrencia, reversión automática, estado. Editor en modal `xl` con renglones por cuenta o rol, base (fijo, porcentaje, fórmula) y filtros de sueldos (empresa, sindicato, categorías, empleados, sección, cargo, departamento). Acción "Generar asiento desde plantilla". Equivalencia INV: `abm_Asiento_Personalizado`.

### PAN-CON-15 Importación de asientos

- Ruta `/con/asientos/importar`; capability `con.asientos.importar`.
- `ExcelImportWizard`: plantilla descargable (con centros, sin centros, asiento único), mapeo de columnas, validación (cuentas, balance por asiento, ejercicio, período, duplicados por identificador externo), vista previa, resultado (borradores o contabilizados). Equivalencia INV: importación de `clsAsiento` (`ImportarAsientos`, `ImportarAsientosConSeccion`, `ImportarAsientoUnico`).

### PAN-CON-16 Bandeja de eventos contables

- Ruta `/con/eventos`; capability `con.eventos.ver` / `con.eventos.reprocesar` / `con.eventos.ignorar`.
- Filtros: estado, módulo, tipo de evento, rango, causa del faltante. Columnas: fecha contable, módulo, tipo, documento, importe, estado, faltante (con enlace directo a la configuración: rol, regla, entidad), intentos, asiento.
- Acciones: reprocesar seleccionados, ignorar con motivo (modal `sm`), ver contrato del evento (modal `lg`). Vacío: `dict:con.events.empty` ("No hay eventos pendientes"). Equivalencia INV: — (nuevo; en ProCoop los faltantes se veían como errores del cierre).

### PAN-CON-17 Lote de contabilización ("Cierre automático")

- Ruta `/con/lotes`; capability `con.lotes.ver` / `con.lotes.ejecutar` / `con.lotes.confirmar`.
- Formulario de lote: rango, ejercicio, módulos (ventas, pagos de otros períodos, cobranza, tesorería, bancos, financiaciones, compras, stock, capital, sueldos, fabricación, bienes de uso), detalle diario o por operación, composición de stock, fecha de emisión en ventas, filtro de tipos de factura (modal `md`), método de valuación de stock (informativo: la valuación es de STK). Advertencias previas: cajas abiertas, eventos pendientes de configuración en el rango, períodos bloqueados.
- Resultado (vista previa): asientos borradores por módulo con totales, diferencias y renglones; acciones confirmar, descartar, imprimir resultado. Lista de lotes anteriores con estado y progreso. Equivalencia INV: `frmCierreDiario` (`chkVentas`, `chkCobranza`, `chkBancos`, `chkCompras`, `chkStock`, `chkFinanciaciones`, `chkAjusteInflacion` → JOB-CON-06, `chkComposicionStock`, `chkDetalleXOperacion`, `chkFechaEmisionVentas`, `btnFiltroFactura`, `btnValuacion`, `cboTipo`, `oEjercicio`, botones `Imprimir*`) y `frmCierreDiario_Resultado`.

### PAN-CON-18 Anulación masiva

- Ruta `/con/asientos/anulacion-masiva`; capability `con.asientos.anularMasivo`.
- Filtros (rango, origen, lote, módulo, tipo); grilla con selección; validación por asiento (apertura/cierre excluidos, período cerrado, transcripto) con motivo de rechazo; acción ejecutar (ConfirmDialog con resumen y motivo); resultado con efectos dependientes notificados (STK amortizaciones). Equivalencia INV: `frmEliminacionMasiva`.

### PAN-CON-19 Renumeración de asientos

- Ruta `/con/asientos/renumerar`; capability `con.asientos.renumerar`.
- Ejercicio, número inicial o "continuar el último", rango; vista previa (número actual → nuevo); rechaza rangos transcriptos. Equivalencia INV: `frmRenumerar`.

### PAN-CON-20 Mayor

- Ruta `/con/reportes/mayor`; capability `con.reportes.ver`.
- Filtros: plan, cuenta o rango de cuentas, rama, período, fecha contable o de registro, centro, servicio, estado (contabilizados por defecto). Columnas: fecha, asiento, descripción, documento, debe, haber, saldo acumulado; saldo anterior al inicio. Clic en renglón → asiento y documento. Equivalencia INV: `frmMayor`.

### PAN-CON-21 Sumas y saldos

- Ruta `/con/reportes/sumas-saldos`; capability `con.reportes.ver`.
- Filtros: plan (operativo o alternativo vía proyección), ejercicio, rango, nivel, con/sin movimientos, centro, servicio, incluir asientos de cierre. Columnas: cuenta, saldo inicial, debe, haber, saldo final (deudor/acreedor). Totales iguales en debe y haber. Equivalencia INV: `frmSumasySaldos`.

### PAN-CON-22 Catálogo de informes contables

- Ruta `/con/reportes`; capability `con.reportes.ver`.
- Tarjetas por informe (§15) con parámetros en modal `md` y salida PDF/XLSX/CSV; informes regulatorios exportables (OCEBA, FEDECOBA) cuando el tenant los habilita. Equivalencia INV: `frmImpresiones`.

### PAN-CON-23 Libros rubricados

- Ruta `/con/libros`; capability `con.libros.ver` / `con.libros.transcribir`.
- Lista de libros (tipo, rúbrica, hojas desde/hasta, última usada, formato, estado) y transcripciones; acción transcribir (ejercicio, rango de asientos, vista previa de folios, PDF con hash). Equivalencia INV: `frmImprimirHojasRubricar`.

### PAN-CON-24 Centros de costo y grupos

- Ruta `/con/centros`; capability `con.centros.ver` / `con.centros.configurar`.
- Árbol de centros con tipo, servicios y sucursales relacionados, porcentaje de IVA computable en compras, grupos; pestaña de grupos con miembros. Cada centro muestra su entidad jurídica dueña (`legalEntityId`, obligatoria) y las entidades con las que se comparte (`sharedWithLegalEntityIds`); filtro por entidad que lista los centros propios y los compartidos con ella (DEC-096, RN-CON-127). Equivalencia INV: `abm_CtSeccion` (`cmdCategorias` → grupos y categorías de sección).

### PAN-CON-25 Reglas de asignación a centros

- Ruta `/con/centros/asignaciones`; capability `con.centros.configurar`.
- Filtros: tipo de operación (ingresos, compras, ajuste por inflación, asiento manual, costo de ventas, defecto de cuenta, sueldos, bien de uso, incidente, obra), tipo de elemento. Grilla: elemento, modelo o reparto (porcentajes que suman 100), vigencia. Asignación masiva a seleccionados. Equivalencia INV: `frm_AsignarSeccion`.

### PAN-CON-26 Modelos y corridas de distribución

- Ruta `/con/distribuciones`; capability `con.distribuciones.ver` / `con.distribuciones.ejecutar`.
- Modelos (porcentaje fijo o driver), corridas por período con totales origen/distribuido/no asignado, detalle por centro y cuenta, generar reclasificación opcional. Equivalencia INV: — (nuevo; ProCoop solo reparte en el renglón).

### PAN-CON-27 Resultado por servicio y sección

- Ruta `/con/reportes/resultado-servicio`; capability `con.reportes.ver`.
- Filtros: período, servicio, centro, corrida de distribución (o "sin distribuir"), plan. Columnas: servicio/centro, ingresos directos, costos directos, comunes distribuidos, resultado, margen %. Drill-down a mayor. Equivalencia INV: informes "Gastos e ingresos por sección" y "por grupos de secciones" de `frmImpresiones`.

### PAN-CON-28 Conciliaciones

- Ruta `/con/conciliaciones`; capability `con.conciliaciones.ver` / `con.conciliaciones.ejecutar`.
- Lista de corridas por tipo y fecha de corte; detalle: auxiliar vs contable por clave (servicio, banco, proveedor), diferencias con categoría, explicación, responsable y asiento de ajuste; acción explicar (modal `md`), cerrar. Equivalencia INV: — (nuevo).

### PAN-CON-29 Índices de inflación

- Ruta `/con/inflacion/indices`; capability `con.inflacion.ver` / `con.inflacion.editar`.
- Series (código, nombre, fuente) y grilla año × mes de valores; importación desde planilla; alerta de meses faltantes. Equivalencia INV: `abm_Tabinfl`.

### PAN-CON-30 Ajuste por inflación

- Ruta `/con/inflacion/corridas`; capability `con.inflacion.ejecutar`.
- Parámetros (ejercicio, hasta, serie, método); vista previa por cuenta y mes de origen (histórico, coeficiente, ajustado, ajuste), total RECPAM; contabilizar o revertir. Equivalencia INV: opción `chkAjusteInflacion` de `frmCierreDiario`.

### PAN-CON-31 Cierre y reapertura de ejercicio; cuentas de resultado

- Ruta `/con/ejercicios/:id/cierre`; capability `con.ejercicios.cerrar` / `con.ejercicios.reabrir`.
- Pestaña "Cuentas de resultado" (destinos por prefijo, cuentas o rubros; ganancias/pérdidas) ; pestaña "Cierre": precondiciones, vista previa de los tres asientos y sumas y saldos post cierre, confirmar (ConfirmDialog); pestaña "Reapertura" con doble aprobación. Equivalencia INV: `abm_Resulta`; cierre de ejercicio de `clsCierreDiario`.

### PAN-CON-32 Equivalencias entre planes

- Ruta `/con/equivalencias`; capability `con.planes.editar`.
- Selector plan origen y destino; grilla cuenta origen → destinos con porcentaje y condición; indicadores "sin equivalencia" y "ambiguas"; importación por planilla; reconstruir proyección. Equivalencia INV: — (nuevo).

### PAN-CON-33 Escenarios de simulación

- Ruta `/con/simulaciones`; capability `con.simulaciones.ver` / `con.simulaciones.crear` / `con.simulaciones.ejecutar`.
- Lista (código, tipo, plan, universo, estado, comparable, último resultado); editor de supuestos; ejecución; comparación lado a lado con el real (por cuenta, servicio y centro) con marca visual permanente "SIMULACIÓN — no oficial". Equivalencia INV: — (nuevo, BASE §55).

### PAN-CON-34 Presupuestos

- Ruta `/con/presupuestos`; capability `con.presupuestos.ver` / `con.presupuestos.editar` / `con.presupuestos.aprobar`.
- Lista de versiones por ejercicio; editor de líneas cuenta × centro × servicio × mes (grilla editable con copiar de real/presupuesto anterior ± %, estacionalidad, importación); enviar, aprobar, reformular. Equivalencia INV: — (nuevo).

### PAN-CON-35 Ejecución presupuestaria y compromisos

- Ruta `/con/presupuestos/:id/ejecucion`; capability `con.presupuestos.ver` / `con.compromisos.ver` / `con.compromisos.autorizarExceso`.
- Columnas: cuenta/centro/servicio, presupuestado, comprometido, devengado, pagado, disponible, % ejecución; detalle de compromisos con documento de origen; solicitudes de exceso pendientes con aprobar/rechazar. Equivalencia INV: — (nuevo).

### PAN-CON-36 Estados contables y plantillas

- Ruta `/con/estados`; capability `con.estados.generar` / `con.estados.aprobar` / `con.estados.emitir`.
- Plantillas (marco INAES-RT, regulador, propia) con editor de líneas; corridas por ejercicio con comparativo, anexos (bienes de uso, gastos), notas, cuadro de distribución de excedentes; aprobar (consejo), emitir (congela y firma hash). Equivalencia INV: — (ProCoop emite balances desde `frmImpresiones`).

### PAN-CON-37 Sistema contable externo

- Ruta `/con/externo`; capability `con.externo.ver` / `con.externo.ejecutar`.
- Mapeo de operaciones y cuentas externas (`externalLedgerMappings`), layouts, exportaciones e importaciones con estado, archivo y errores. Equivalencia INV: — (`SISCONT` sin formulario identificado [VERIFICAR]); exportación SIRCAR absorbida por M06 FIS.

### PAN-CON-38 Rubros de capital

- Ruta `/con/capital-rubros`; capability `con.cuentas.editar`.
- Rubro de capital, rubros de producto incluidos (exclusivos), cuentas de suscripto, integrado, a cobrar y a devolver. Equivalencia INV: `abm_Rubcapi`.

### PAN-CON-39 Anticipos y saldos a favor a una fecha

- Ruta `/con/reportes/anticipos`; capability `con.reportes.ver`.
- Fecha de corte, servicio, socio; columnas: socio, cuenta, servicio, anticipo/saldo a favor, origen, antigüedad; total conciliado con la cuenta de `customerAdvances`. Equivalencia INV: `frmInformeAnticiposAUnaFecha`.

### PAN-CON-40 Salud de la configuración contable

- Ruta `/con/salud`; capability `con.config.ver`.
- Lista de hallazgos del JOB-CON-19 por severidad (bloqueante, advertencia): roles sin cuenta, entidades sin cuenta, reglas solapadas, cuentas inactivas referenciadas, centros obligatorios faltantes, equivalencias incompletas; enlace directo a la corrección. Equivalencia INV: — (nuevo).

## 11. API

> **Corrección 05-11-2026 (capabilities):** las filas que tenían un rol, un texto libre o un patrón (`<acción>`, "Autenticado", "Pública", "según acción") en la columna Capability usan ahora una capability `modulo.recurso.accion` de la convención de T02, o `public: true` para los endpoints públicos (RF-IAM-061 de T02). El valor anterior queda entre paréntesis como "antes: …".

Prefijos: administración `/api/admin/con/...`; consulta para otros módulos y portal interno `/api/con/...`; externa de solo lectura `/api/v1/ext/con/...` (token de integración T06). Listas paginadas `{items,total,page,size}`; errores RFC 9457; todas las mutaciones económicas aceptan `Idempotency-Key`. El servicio interno `periodGuard` (paquete de dominio, no HTTP) lo consumen todos los módulos antes de registrar operaciones con fecha.

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-CON-01 | GET | `/api/admin/con/settings` | `con.config.ver` | Configuración vigente y versiones | Sí |
| API-CON-02 | PUT | `/api/admin/con/settings/draft` | `con.config.configurar` | Guardar borrador | Sí |
| API-CON-03 | POST | `/api/admin/con/settings/publish` | `con.config.configurar` | Validar y publicar versión | Sí (Idempotency-Key) |
| API-CON-04 | GET | `/api/admin/con/charts` | `con.planes.ver` | Listar planes | Sí |
| API-CON-05 | POST | `/api/admin/con/charts` | `con.planes.crear` | Crear plan (vacío, copia o plantilla) | Sí (Idempotency-Key) |
| API-CON-06 | PATCH | `/api/admin/con/charts/:id` | `con.planes.editar` | Editar plan en borrador | Sí (`version`) |
| API-CON-07 | POST | `/api/admin/con/charts/:id/approve` | `con.planes.aprobar` | Aprobar | Sí |
| API-CON-08 | POST | `/api/admin/con/charts/:id/promote` | `con.planes.promover` | Promover a operativo para un ejercicio | Sí |
| API-CON-09 | POST | `/api/admin/con/charts/:id/archive` | `con.planes.editar` | Archivar | Sí |
| API-CON-10 | GET | `/api/admin/con/charts/:id/accounts` | `con.cuentas.ver` | Árbol o lista de cuentas con filtros | Sí |
| API-CON-11 | POST | `/api/admin/con/charts/:id/accounts` | `con.cuentas.crear` | Alta de cuenta | Sí (Idempotency-Key) |
| API-CON-12 | PATCH | `/api/admin/con/accounts/:id` | `con.cuentas.editar` | Editar / inactivar cuenta | Sí (`version`) |
| API-CON-13 | POST | `/api/admin/con/accounts/:id/renumber` | `con.cuentas.renumerar` | Cambiar código visible | Sí |
| API-CON-14 | POST | `/api/admin/con/accounts/merge` | `con.cuentas.unificar` | Unificar cuentas (vista previa con `dryRun`) | Sí (Idempotency-Key) |
| API-CON-15 | GET/POST/PATCH | `/api/admin/con/charts/:id/rubrics` | `con.cuentas.ver` / `con.cuentas.editar` | Rubros y subrubros | Sí |
| API-CON-16 | GET | `/api/admin/con/charts/:id/roles` | `con.reglas.ver` | Roles de cuenta con estado | Sí |
| API-CON-17 | PUT | `/api/admin/con/charts/:id/roles/:roleKey` | `con.reglas.editar` | Asignar cuenta y overrides | Sí |
| API-CON-18 | GET | `/api/admin/con/posting-rules` | `con.reglas.ver` | Listar reglas | Sí |
| API-CON-19 | POST | `/api/admin/con/posting-rules` | `con.reglas.editar` | Crear regla | Sí (Idempotency-Key) |
| API-CON-20 | PATCH | `/api/admin/con/posting-rules/:id` | `con.reglas.editar` | Nueva versión / retirar | Sí (`version`) |
| API-CON-21 | POST | `/api/admin/con/posting-rules/simulate` | `con.reglas.ver` | Simular asiento para un evento o documento | Sí (sin efectos) |
| API-CON-22 | GET | `/api/admin/con/posting-rules/overlaps` | `con.reglas.ver` | Detectar solapamientos | Sí |
| API-CON-23 | GET | `/api/admin/con/entity-accounts` | `con.reglas.ver` | Cuentas asignadas por tipo de entidad (filtro sin asignar) | Sí |
| API-CON-24 | POST | `/api/admin/con/entity-accounts/bulk` | `con.reglas.editar` | Asignación/reasignación masiva (`dryRun`) | Sí (Idempotency-Key) |
| API-CON-25 | GET/POST | `/api/admin/con/fiscal-years` | `con.ejercicios.ver` / `con.ejercicios.crear` | Ejercicios | Sí |
| API-CON-26 | POST | `/api/admin/con/fiscal-years/:id/open` | `con.ejercicios.crear` | Abrir ejercicio | Sí |
| API-CON-27 | POST | `/api/admin/con/fiscal-years/:id/closing-preview` | `con.ejercicios.cerrar` | Generar borradores de cierre y apertura | Sí |
| API-CON-28 | POST | `/api/admin/con/fiscal-years/:id/close` | `con.ejercicios.cerrar` | Confirmar cierre | Sí (Idempotency-Key) |
| API-CON-29 | POST | `/api/admin/con/fiscal-years/:id/reopen` | `con.ejercicios.reabrir` | Solicitar/ejecutar reapertura (doble aprobación) | Sí (Idempotency-Key) |
| API-CON-30 | GET/POST/PATCH | `/api/admin/con/result-targets` | `con.ejercicios.ver` / `con.ejercicios.cerrar` | Cuentas de resultado | Sí |
| API-CON-31 | GET | `/api/admin/con/periods` | `con.periodos.ver` | Matriz de períodos y bloqueos | Sí |
| API-CON-32 | POST | `/api/admin/con/periods/:id/locks` | `con.periodos.bloquear` | Bloquear/desbloquear módulo hasta fecha | Sí |
| API-CON-33 | POST | `/api/admin/con/periods/:id/close` | `con.periodos.cerrar` | Cerrar período (valida checklist) | Sí |
| API-CON-34 | POST | `/api/admin/con/periods/:id/reopen` | `con.periodos.reabrir` | Solicitar reapertura con motivo y plazo | Sí (Idempotency-Key) |
| API-CON-35 | GET | `/api/con/period-guard?module=&date=` | `con.periodos.ver` (antes: Autenticado (cualquier módulo)) | Consulta si una fecha está abierta para un módulo | Sí |
| API-CON-36 | GET | `/api/admin/con/entries` | `con.asientos.ver` | Diario con filtros | Sí |
| API-CON-37 | GET | `/api/admin/con/entries/:id` | `con.asientos.ver` | Asiento con renglones, resolución y vínculos | Sí |
| API-CON-38 | POST | `/api/admin/con/entries` | `con.asientos.crear` | Crear asiento manual (borrador) | Sí (Idempotency-Key) |
| API-CON-39 | PATCH | `/api/admin/con/entries/:id` | `con.asientos.editar` | Editar borrador | Sí (`version`) |
| API-CON-40 | DELETE | `/api/admin/con/entries/:id` | `con.asientos.editar` | Eliminar borrador (solo `draft`) | Sí |
| API-CON-41 | POST | `/api/admin/con/entries/:id/submit` | `con.asientos.crear` | Enviar a aprobación | Sí |
| API-CON-42 | POST | `/api/admin/con/entries/:id/post` | `con.asientos.contabilizar` | Contabilizar | Sí (Idempotency-Key) |
| API-CON-43 | POST | `/api/admin/con/entries/:id/approve` | `con.asientos.aprobar` | Aprobar o rechazar | Sí |
| API-CON-44 | POST | `/api/admin/con/entries/:id/void` | `con.asientos.anular` | Anular (período abierto, no transcripto) | Sí (Idempotency-Key) |
| API-CON-45 | POST | `/api/admin/con/entries/:id/reverse` | `con.asientos.anular` | Contraasiento con fecha | Sí (Idempotency-Key) |
| API-CON-46 | POST | `/api/admin/con/entries/:id/attachments` | `con.asientos.editar` | Adjuntar respaldo (URL firmada) | No |
| API-CON-47 | POST | `/api/admin/con/entries/import` | `con.asientos.importar` | Importar archivo (validar / confirmar) | Sí (Idempotency-Key) |
| API-CON-48 | POST | `/api/admin/con/entries/bulk-void` | `con.asientos.anularMasivo` | Anulación masiva (`dryRun`) → JOB-CON-17 | Sí (Idempotency-Key) |
| API-CON-49 | POST | `/api/admin/con/entries/renumber` | `con.asientos.renumerar` | Renumeración → JOB-CON-16 | Sí (Idempotency-Key) |
| API-CON-50 | GET/POST/PATCH | `/api/admin/con/entry-templates` | `con.asientos.crear` | Plantillas | Sí |
| API-CON-51 | POST | `/api/admin/con/entry-templates/:id/generate` | `con.asientos.crear` | Generar asiento desde plantilla | Sí (Idempotency-Key) |
| API-CON-52 | GET | `/api/admin/con/events` | `con.eventos.ver` | Bandeja de eventos | Sí |
| API-CON-53 | GET | `/api/admin/con/events/:id` | `con.eventos.ver` | Evento con contrato y faltantes | Sí |
| API-CON-54 | POST | `/api/admin/con/events/reprocess` | `con.eventos.reprocesar` | Reprocesar seleccionados o por causa | Sí |
| API-CON-55 | POST | `/api/admin/con/events/:id/ignore` | `con.eventos.ignorar` | Ignorar con motivo | Sí |
| API-CON-56 | POST | `/api/admin/con/posting-batches` | `con.lotes.ejecutar` | Crear lote (vista previa) → JOB-CON-02 | Sí (Idempotency-Key) |
| API-CON-57 | GET | `/api/admin/con/posting-batches[/:id]` | `con.lotes.ver` | Lotes y resultado | Sí |
| API-CON-58 | POST | `/api/admin/con/posting-batches/:id/confirm` | `con.lotes.confirmar` | Confirmar | Sí (Idempotency-Key) |
| API-CON-59 | POST | `/api/admin/con/posting-batches/:id/discard` | `con.lotes.ejecutar` | Descartar | Sí |
| API-CON-60 | GET | `/api/admin/con/reports/:reportKey` | `con.reportes.ver` | Informes (§15) con parámetros; `format=json\|pdf\|xlsx\|csv` (exportar exige `con.reportes.exportar`) | Sí |
| API-CON-61 | POST | `/api/admin/con/rubricated-books[/:id/transcriptions]` | `con.libros.transcribir` | Libros y transcripción → JOB-CON-18 | Sí (Idempotency-Key) |
| API-CON-62 | GET/POST/PATCH | `/api/admin/con/cost-centers` · `/cost-center-groups` | `con.centros.ver` / `con.centros.configurar` | Centros y grupos | Sí |
| API-CON-63 | GET/POST/PATCH | `/api/admin/con/cost-allocation-rules` (+ `/bulk`) | `con.centros.configurar` | Reglas de asignación a centros | Sí |
| API-CON-64 | GET/POST/PATCH | `/api/admin/con/distribution-models` | `con.distribuciones.ver` / `con.distribuciones.editar` | Modelos de distribución | Sí |
| API-CON-65 | POST | `/api/admin/con/distribution-runs` (+ `/:id/finalize`) | `con.distribuciones.ejecutar` | Corrida de distribución → JOB-CON-07 | Sí (Idempotency-Key) |
| API-CON-66 | POST/GET | `/api/admin/con/reconciliations` | `con.conciliaciones.ejecutar` / `con.conciliaciones.ver` | Ejecutar y consultar conciliaciones → JOB-CON-08 | Sí |
| API-CON-67 | PATCH | `/api/admin/con/reconciliations/:id/differences/:diffId` | `con.conciliaciones.ejecutar` | Explicar diferencia | Sí |
| API-CON-68 | GET/POST/PUT | `/api/admin/con/inflation-series` (+ `/values`) | `con.inflacion.ver` / `con.inflacion.editar` | Series e índices (importación) | Sí |
| API-CON-69 | POST | `/api/admin/con/inflation-runs` (+ `/:id/post`, `/:id/reverse`) | `con.inflacion.ejecutar` | Ajuste por inflación → JOB-CON-06 | Sí (Idempotency-Key) |
| API-CON-70 | GET/POST/PUT | `/api/admin/con/account-mappings` (+ `/import`, `/rebuild`) | `con.planes.editar` | Equivalencias y reconstrucción de proyección | Sí |
| API-CON-71 | GET/POST/PATCH | `/api/admin/con/scenarios` | `con.simulaciones.ver` / `con.simulaciones.crear` | Escenarios | Sí |
| API-CON-72 | POST | `/api/admin/con/scenarios/:id/run` | `con.simulaciones.ejecutar` | Ejecutar simulación → JOB-CON-09 | Sí (por `runHash`) |
| API-CON-73 | GET | `/api/admin/con/scenarios/:id/compare` | `con.simulaciones.ver` | Comparar con real | Sí |
| API-CON-74 | GET/POST/PATCH | `/api/admin/con/budgets` (+ `/lines`, `/import`) | `con.presupuestos.ver` / `con.presupuestos.editar` | Presupuestos | Sí |
| API-CON-75 | POST | `/api/admin/con/budgets/:id/submit` · `/approve` · `/reformulate` | `con.presupuestos.editar` / `con.presupuestos.aprobar` | Ciclo de aprobación | Sí (Idempotency-Key) |
| API-CON-76 | GET | `/api/admin/con/budgets/:id/execution` | `con.presupuestos.ver` | Ejecución presupuestaria | Sí |
| API-CON-77 | GET | `/api/con/budget-check` | `con.presupuestos.ver` (antes: Autenticado (CMP, TES, SUE)) | Disponible para una imputación prevista (cuenta, centro, servicio, mes, importe) | Sí |
| API-CON-78 | POST | `/api/admin/con/commitments/:id/authorize-excess` · `/release` | `con.compromisos.autorizarExceso` / `con.compromisos.liberar` | Autorizar exceso / liberar | Sí |
| API-CON-79 | GET/POST/PATCH | `/api/admin/con/statement-templates` | `con.estados.generar` | Plantillas de estados | Sí |
| API-CON-80 | POST | `/api/admin/con/statement-runs` (+ `/:id/approve`, `/:id/issue`) | `con.estados.generar` / `con.estados.aprobar` / `con.estados.emitir` | Estados contables → JOB-CON-15 | Sí (Idempotency-Key) |
| API-CON-81 | GET/PUT | `/api/admin/con/external/mappings` | `con.externo.ver` / `con.externo.configurar` | Mapeo sistema externo | Sí |
| API-CON-82 | POST | `/api/admin/con/external/exports` · `/imports` | `con.externo.ejecutar` | Exportar / importar → JOB-CON-12 / JOB-CON-13 | Sí (Idempotency-Key) |
| API-CON-83 | GET/PUT | `/api/admin/con/capital-rubrics` | `con.cuentas.editar` | Rubros de capital | Sí |
| API-CON-84 | GET | `/api/admin/con/health` | `con.config.ver` | Hallazgos de salud de configuración | Sí |
| API-CON-85 | GET | `/api/con/linked-entry?module=&docType=&docId=` | `con.asientos.verVinculado` | Asiento(s) vinculado(s) a un documento | Sí |
| API-CON-86 | GET | `/api/con/accounts/lookup` | `con.cuentas.ver` (antes: Autenticado (selectores de otros módulos)) | Búsqueda de cuentas imputables del plan operativo (para asignaciones) | Sí |
| API-CON-87 | GET | `/api/admin/con/dashboard` | `con.asientos.ver` | Indicadores del tablero | Sí |
| API-CON-88 | GET | `/api/v1/ext/con/balances` | Token externo `con.ext.saldos` | Sumas y saldos por período (solo lectura, para estudio contable o BI) | Sí |
| API-CON-89 | GET | `/api/v1/ext/con/entries` | Token externo `con.ext.asientos` | Asientos contabilizados por rango (solo lectura, paginado) | Sí |

## 12. Eventos y jobs

### 12.1 Eventos emitidos (outbox)

| EVT-ID | Evento | Disparo | Payload mínimo | Consumidores |
|---|---|---|---|---|
| EVT-CON-01 | `con.entry.posted` | Asiento contabilizado | `entryId`, `number`, `fiscalYearId`, `accountingDate`, `entryType`, `sourceEventIds[]`, `documentRefs[]` | Módulos de origen (guardan `journalRef`: STK amortizaciones, CMP, TES, SUE), T10, JOB-CON-10 |
| EVT-CON-02 | `con.entry.reversed` | Contraasiento registrado | `entryId`, `reversalEntryId`, `reason` | STK (revierte acumulados, RN-CON-061), módulos de origen, T10 |
| EVT-CON-03 | `con.entry.voided` | Asiento anulado | `entryId`, `reason` | Ídem EVT-CON-02 |
| EVT-CON-04 | `con.event.pendingConfiguration` | Evento sin cuenta/centro/equivalencia | `eventId`, `eventType`, `sourceModule`, `missing[]` | T09 (alerta al contador), PAN-CON-01 |
| EVT-CON-05 | `con.event.failed` | Evento en error tras reintentos | `eventId`, `errorCode` | T09, soporte (T08) |
| EVT-CON-06 | `con.period.locked` / `con.period.unlocked` | Bloqueo por módulo | `periodId`, `module`, `lockedUntil` | Todos los módulos (cachean `periodGuard`), T04 |
| EVT-CON-07 | `con.period.closed` | Cierre mensual | `periodId`, `legalEntityId`, `period` (`YYYY-MM`), `sequence` (CTR-DAT-31; antes `year`, `month`) | Todos los módulos, M06 (cierre fiscal), T10 |
| EVT-CON-08 | `con.period.reopened` | Reapertura | `periodId`, `reopenUntil`, `reason`, `approvedBy` | Todos los módulos, T10 (auditoría) |
| EVT-CON-09 | `con.fiscalYear.closed` / `con.fiscalYear.reopened` | Cierre/reapertura de ejercicio | `fiscalYearId`, `resultAmount`, `closingEntries` | M17 (resultado a distribuir en asamblea), T10 |
| EVT-CON-10 | `con.chart.approved` / `con.chart.promoted` | Plan aprobado/promovido | `chartId`, `fiscalYearId` | Selectores de cuentas de otros módulos (invalidan caché) |
| EVT-CON-11 | `con.config.published` | Versión de configuración publicada | `configVersionId`, `changes` | JOB-CON-03 (reproceso), JOB-CON-19 |
| EVT-CON-12 | `con.inflationAdjustment.posted` | Ajuste contabilizado | `runId`, `entryId`, `recpam` | T10 |
| EVT-CON-13 | `con.reconciliation.differenceDetected` | Diferencia sin explicar | `runId`, `kind`, `amount` | T09 (responsable), PAN-CON-01 |
| EVT-CON-14 | `con.budget.approved` / `con.budget.reformulated` | Presupuesto aprobado | `budgetId`, `version` | CMP, TES, SUE (control de disponibilidad), T10 |
| EVT-CON-15 | `con.commitment.exceeded` / `con.commitment.excessAuthorized` | Exceso de presupuesto | `commitmentId`, `amount`, `policy` | CMP (bloquea o continúa la OC), T11 |
| EVT-CON-16 | `con.simulation.completed` | Simulación terminada | `scenarioId`, `comparable`, `runHash` | T09 (aviso al analista) |
| EVT-CON-17 | `con.export.completed` / `con.export.failed` | Exportación a sistema externo | `transferId`, `entries`, `storedFileId` | T06 (bandeja de operaciones) |
| EVT-CON-18 | `con.statements.issued` | Estados contables emitidos | `runId`, `fiscalYearId`, `hash` | M17 (memoria y asamblea), M19 (publicación si se decide), T10 |

### 12.2 Eventos consumidos

Todos los eventos de la matriz §9.1 (filas M-01 a M-115 y M-126 a M-136; estas últimas agregan `cmp.signalRightsSettlement.approved` EVT-CMP-17, `soc.deathSubsidy.approved` EVT-SOC-04, `soc.burialRight.formalized`/`.extinguished` EVT-SOC-05 y `cob.creditBalance.created` EVT-COB-09 con origen `guaranteeRefund`; M15 es consumidor declarado de EVT-SOC-04 y EVT-SOC-05 de M18, filas M-130 y M-135), más: `tes.period.closed`/`reopened` y `fis.vatLedger.closed`/`reopened` (checklist de período), `tes.reconciliation.closed` (conciliación de bancos), `tes.exchangeRate.published` (cotización), `sue.salaryScale.published` y `sue.laborCost.projected` (presupuesto), `tes.commitment.*` (presupuesto financiero), `ins.resolution.created` (resolución de asamblea para distribución de excedentes), `cat.tenantService.published` y `fac.billingRun.issued` (validación de reglas resueltas, RF-CON-006), `cfg.legalEntity.created` / `.updated` / `.deactivated` (EVT-CFG-19 de T04: alta de la entidad sin libros hasta que el contador abra su primer ejercicio; con `.deactivated` no se aceptan asientos nuevos con fecha posterior a la inactivación y los períodos abiertos quedan en el checklist de cierre), EVT-FIS-26 `fis.obligation.cancelled` de M06 (contraasiento de la provisión M-137 de una obligación propia anulada o recalculada, en su `legalEntityId`, solo con `cancellationStatus = final`; con `pendingPaymentReconciliation` la obligación espera la confirmación de M14 y no se asienta nada; si llega con `creditBalanceAmount` porque el pago se ejecutó igual (M06 RN-FIS-133 punto 9), el pago M-138 no se revierte y el saldo deudor que queda en `ownTaxPayable` representa el saldo a favor ante el organismo, visible en la conciliación contable-fiscal; [VERIFICAR] con el contador si se reclasifica a una cuenta de crédito fiscal propia; RN-CON-128, DEC-095, 10-11-2026). Contrato común: RF-CON-052; idempotencia por `sourceEventId`.

### 12.3 Jobs

> **Corrección 05-11-2026 (colas):** la columna Cola usa ahora las ocho clases de cola de T01 §7.6 (`interactive`, `integration`, `events`, `notifications`, `batch`, `export`, `ai`, `maintenance`); T01 establece que ningún job puede declararse fuera de esas ocho clases. Las colas anteriores pasan así: `con-realtime` a `events`; `con-batch`, `con-closing` y `con-sim` a `batch` (los trabajos de cierre y de simulación se distinguen por la prioridad del job dentro de la cola y por la concurrencia por tenant de `PRM-PLA-023`); `con-integration` a `integration`.

| Job | Cola | Frecuencia | Reanudable | Idempotencia |
|---|---|---|---|---|
| JOB-CON-01 `con:contabilizar-evento` | `events` (antes `con-realtime`) | Por evento | Sí | `sourceEventId` |
| JOB-CON-02 `con:cierre-diario` | `batch` (antes `con-batch`) | Diario 02:00 (por defecto) o a demanda | Sí (por evento) | Rango + módulo + versión de configuración |
| JOB-CON-03 `con:reprocesar-pendientes` | `batch` (antes `con-batch`) | Al publicar configuración / a demanda | Sí | `eventId` |
| JOB-CON-05 `con:cierre-ejercicio` | `batch` (antes `con-closing`) | A demanda | Sí | `fiscalYearId` |
| JOB-CON-06 `con:ajuste-inflacion` | `batch` (antes `con-closing`) | A demanda (anual o mensual) | Sí | `runId` |
| JOB-CON-07 `con:distribuir-costos` | `batch` (antes `con-batch`) | Mensual / a demanda | Sí | `runId` |
| JOB-CON-08 `con:conciliar` | `batch` (antes `con-batch`) | Diario (deudores, bancos) y mensual (resto) | Sí | `kind` + `cutoffAt` |
| JOB-CON-09 `con:simular-escenario` | `batch` con prioridad de job baja (antes `con-sim`) | A demanda | Sí | `runHash` |
| JOB-CON-10 `con:proyectar-planes` | `batch` (antes `con-batch`) | Por asiento / reconstrucción | Sí | `sourceLineId` + `targetChartId` |
| JOB-CON-11 `con:reconstruir-saldos` | `batch` (antes `con-batch`) | Nocturno | Sí | Período |
| JOB-CON-12 `con:exportar-externo` | `integration` (antes `con-integration`) | Programado / a demanda | Sí | Rango + layout + versión |
| JOB-CON-13 `con:importar-asientos` | `batch` (antes `con-batch`) | Carga de archivo | Sí | Hash del archivo + `externalId` |
| JOB-CON-14 `con:presupuesto-ejecucion` | `batch` (antes `con-batch`) | Nocturno y por evento | Sí | Presupuesto + fecha |
| JOB-CON-15 `con:generar-estados` | `batch` (antes `con-closing`) | A demanda | Sí | `runId` |
| JOB-CON-16 `con:renumerar-asientos` | `batch` (antes `con-closing`) | A demanda | Sí | Ejercicio + rango |
| JOB-CON-17 `con:anular-masivo` | `batch` (antes `con-batch`) | A demanda | Sí | Lista de `entryId` |
| JOB-CON-18 `con:transcribir-rubricado` | `batch` (antes `con-closing`) | A demanda | Sí | Libro + rango |
| JOB-CON-19 `con:salud-configuracion` | `batch` (antes `con-batch`) | Diario y al publicar | Sí | — (lectura) |
| JOB-CON-20 `con:asientos-recurrentes` | `batch` (antes `con-batch`) | Diario | Sí | Plantilla + fecha |
| JOB-CON-21 `con:provisiones-cierre` | `batch` (antes `con-closing`) | Mensual | Sí | Tipo + período |
| JOB-CON-22 `con:diferencia-cambio` | `batch` (antes `con-closing`) | Mensual | Sí | Período |
| JOB-CON-23 `con:devengar-derechos-sepultura` | `batch` (antes `con-closing`) | Mensual (solo con PRM-CON-193 = `deferredOverTerm`) | Sí | Derecho + período |

(El identificador JOB-CON-04 queda reservado al checklist de cierre mensual P-CON-04, que no es un job sino una secuencia guiada.)

## 13. Integraciones

| Integración | Dirección | Uso | Conector / estándar | Anexo |
|---|---|---|---|---|
| Sistema contable externo del estudio (ej. Tango, Holistor, Bejerman u otro) | Saliente (asientos, plan, sumas y saldos) y entrante (asientos de ajuste) | Coexistencia cuando el estudio lleva la contabilidad legal o durante el paralelo (PA-CON-03) | Layouts configurables CSV/TXT/XLSX con mapeo `externalLedgerMappings`; API de solo lectura API-CON-88/89 | T06 (bandeja de operaciones, credenciales en bóveda), FIC 18.2 |
| Índices de precios (FACPCE / INDEC) | Entrante | Ajuste por inflación | Carga manual o importación de planilla; conector opcional a publicación oficial [VERIFICAR fuente estable] | T06 |
| Bancos (extractos) | Entrante (vía TES) | Conciliación bancaria contable | No directo: CON consume eventos de TES | M14 |
| Organismos de control (INAES, OCEBA, ERSEP, DGR) | Saliente (vía FIS / INS) | Estados y anexos regulatorios, exportaciones OCEBA y FEDECOBA | Plantillas y exportadores; la presentación es de M06/M17 | M06, M17 |
| Libros digitales (rúbrica digital de la jurisdicción) | Saliente | Libro Diario e Inventarios y Balances digitales cuando el organismo lo admita | PDF/A con hash; formato del organismo [VERIFICAR] | T06, PA-CON-08 |
| BI | Saliente | Indicadores y tableros | Proyecciones de lectura (T10) | T10 |

Toda integración se registra en la bandeja de operaciones de T06 con reintentos, estado y reproceso; ningún error de integración externa bloquea la contabilización interna.

## 14. Parámetros

Columnas: PRM-ID del anexo; clave; tipo; ámbito; default para tenants nuevos (los migrados conservan su valor ProCoop); descripción; origen V2 (número `COD_VAR`) y PRM-ID del catálogo T04b cuando existe.

### 14.1 Parámetros generales del módulo

| PRM-ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 # / T04b |
|---|---|---|---|---|---|---|
| PRM-CON-001 | `con.operativeChartByFiscalYear` | `map(fiscalYearId → ref:chartOfAccounts)` | tenant | — (al crear ejercicio) | Plan operativo de cada ejercicio. | Nuevo |
| PRM-CON-002 | `con.functionalCurrency` | `string` | tenant | `ARS` | Moneda funcional. | Nuevo |
| PRM-CON-003 | `con.costCenter.mode` | `enum(off, all, payrollOnly)` | tenant | `off` | Usar centros de costo (secciones) en todos los asientos. | V2 2547 / PRM-CON-P4-057 (compartido) |
| PRM-CON-004 | `con.costCenter.mode` = `payrollOnly` | (valor del anterior) | tenant | — | Centros solo en sueldos; se fusiona con PRM-CON-003. | V2 2714 / PRM-CON-P4-057 (compartido) |
| PRM-CON-005 | `con.entryNumbering.format` | `enum(perFiscalYear, prefixed4plus4)` | tenant | `perFiscalYear` | Formato del número visible. | RN-08 §5.2 |
| PRM-CON-006 | `con.costCenter.percentDecimals` | `integer (0–6)` | tenant | 2 | Decimales de porcentajes de centros. | V2 2978 / PRM-CON-P4-062 |
| PRM-CON-007 | `con.entries.voidPolicy` | `enum(logicalVoidInOpenPeriod, reversalOnly)` | tenant | `logicalVoidInOpenPeriod` | Política de anulación (PA-CON-04). | Nuevo |
| PRM-CON-008 | `con.rounding.toleranceAbsolute` | `money` | tenant | 0,05 | Diferencia máxima por asiento a la cuenta de redondeo. | Nuevo |
| PRM-CON-009 | `con.rounding.tolerancePercent` | `decimal` | tenant | 0,001 % | Tope porcentual adicional. | Nuevo |
| PRM-CON-010 | `con.manualEntry.approvalThreshold` | `money` + `enum[]` tipos | tenant | ARS 1.000.000; tipos `adjustment`, `reclassification` | Asientos manuales que requieren aprobación. | Nuevo |
| PRM-CON-011 | `con.reopen.requiredApprovers` | `integer` | tenant | 2 (ejercicio), 1 (período) | Aprobadores para reabrir. | Nuevo |
| PRM-CON-012 | `con.closing.memorandumAccounts` | `enum(carryForward, requireZero)` | tenant | `carryForward` | Cuentas de orden en el cierre (PA-CON-13). | V2 512 (validación de cierre) |
| PRM-CON-013 | `con.periodClose.checklist` | `enum[]` | tenant | todos | Bloqueantes del cierre mensual. | Nuevo |
| PRM-CON-014 | `con.posting.modeByModule` | `map(module → {mode, groupBy[]})` | tenant / módulo | ERP: `realTime`; FAC y COB masivos: `dailySummary` | Modo de contabilización (PA-CON-01). | Reemplaza "Cierre automático" |
| PRM-CON-015 | `con.posting.dateBasisByModule` + `con.posting.lateEventPolicy` | `map` + `enum(firstOpenDay, error)` | tenant / módulo | Ventas: emisión; compras: fecha contable; cobranza: confirmación; bancos: acreditación; tardíos: `firstOpenDay` | Fecha base y eventos tardíos (RN-CON-106). | V2 580 (descartado en T04b; se reemplaza por este) |
| PRM-CON-016 | `con.fx.revaluation` | `object {enabled, rateSource}` | tenant | `{true, tes}` | Diferencia de cambio al cierre (RN-CON-107). | Nuevo |
| PRM-CON-017 | `con.config.publicationPolicyOnMissingRule` | `enum(warn, block)` | tenant | `block` | Publicación de servicios/conceptos sin regla (RF-CON-006). | Nuevo |
| PRM-CON-018 | `con.suspense.tolerance` | `money` | tenant | 0 | Saldo admitido en la cuenta puente de conceptos desconocidos al cerrar (RN-CON-114). | V2 2111 (observación T04b) |
| PRM-CON-019 | `con.health.schedule` | `string (cron)` | tenant | diario 06:00 | Salud de configuración. | Nuevo |
| PRM-CON-020 | `con.posting.receivablesGrouping` | `enum(opciones ProCoop: por tipo de factura, por concepto, por concepto con IVA separado, alternativas 3 y 6)` [VERIFICAR opciones] | tenant | por concepto | Agrupación de deudores por servicios. | V2 2190 / PRM-CON-P4-055 |
| PRM-CON-021 | `con.posting.useAccountingGroups` | `boolean` (invertido) | tenant | `true` | Usar grupos contables (`GRU_CON`) en asientos. | V2 2191 / PRM-CON-P4-056 |
| PRM-CON-022 | `con.posting.refinancingReceivablesByDebtorType` | `boolean` | tenant | `false` | Separar deudores por refinanciación por tipo de deudor. | V2 2619 / PRM-CON-P4-059 |
| PRM-CON-023 | `con.posting.financing.useProductCategory` | `boolean` | tenant | `false` | Tomar el rubro del producto de financiación (V2 308). | V2 3061 / PRM-CON-P4-064 |
| PRM-CON-024 | `con.posting.collections.requireClosedCashDesks` | `boolean` | tenant | `true` | Exigir cajas cerradas para contabilizar cobranza en resumen. | V2 3100 / PRM-CON-P4-066 |
| PRM-CON-025 | `con.posting.cashTrigger` | `enum(onPaymentConfirmed, onCashboxClosed)` | tenant | `onPaymentConfirmed` | Momento del asiento de cobros en caja (PA-CON-10). | Nuevo |
| PRM-CON-026 | `con.posting.workOrders.useProductPurchaseAccount` | `boolean` | tenant | `false` | Usar cuenta de compras del rubro en OT y OM. | V2 2548 / PRM-CON-P4-058 |
| PRM-CON-027 | `con.posting.loanedEquipmentEntries` | `boolean` | tenant | `true` | Generar asiento de productos en comodato. | V2 2734 / PRM-CON-P4-060 |
| PRM-CON-028 | `con.posting.unpostablePolicy` | `enum(pendingNoBlock, blockSource, suspenseAccount)` | tenant | `pendingNoBlock` | Qué hacer si falta cuenta (PA-CON-02). | Nuevo |
| PRM-CON-029 | `con.posting.summaryGroupBy` | `enum[]` (día, servicio, concepto, tipo de factura, caja, ente) | tenant / módulo | día + servicio + concepto | Agrupación del resumen. | `chkDetalleXOperacion` |
| PRM-CON-030 | `con.posting.purchases.nonCreditableVatAsExpense` | `boolean` | tenant | `true` | Registrar como gasto el IVA no tomado. | V2 2890 / PRM-CON-P4-001 |
| PRM-CON-031 | `con.posting.purchases.vatByCostCenterLine` | lectura de `cmp.invoice.vatRateByCostCenterLine` | tenant | (de CMP) | IVA computable por renglón de centro en compras; CON lo aplica al resolver IVA CF/gasto. | V2 2902 / PRM-CMP-P4-051 |
| PRM-CON-032 | `con.posting.purchases.allReceipts` | `boolean` | tenant | `false` | Generar asiento con todos los remitos. | V2 2982 / PRM-CON-P4-063 |
| PRM-CON-033 | `con.fixedAssets.separateRevaluationAccounts` | `boolean` | tenant | `false` | Separar cuentas de revalúo. | V2 2936 / PRM-CON-P4-061 |
| PRM-CON-034 | `con.fixedAssets.useHistoricalValues` | `boolean` | tenant | `false` | Valores históricos para amortización e inflación. | V2 3076 / PRM-CON-P4-065 |
| PRM-CON-035 | `con.inflation.settings` | `object {enabled, frequency: enum(annual, monthly), method}` | tenant | `{true, annual, integral}` | Ajuste por inflación (PA-CON-07). | `chkAjusteInflacion`; V2 2139 (cuenta) |
| PRM-CON-036 | `con.inflation.seriesId` | `ref:economicIndexSeries` (T04; antes `inflationIndexSeries`, CTR-DAT-29) | tenant | serie FACPCE | Serie de índices. | `TABINFL` |
| PRM-CON-037 | `con.provisions` | `object {sac, vacations, badDebts: {enabled, method}}` | tenant | todos `true` | Provisiones automáticas (PA-CON-11). | Nuevo |
| PRM-CON-038 | `con.unbilledRevenue.enabled` | `boolean` | tenant | `false` | Provisión de ingresos devengados no facturados (PA-CON-14). | Nuevo |
| PRM-CON-039 | `con.reconciliation.settings` | `object {kinds[], schedule, tolerance: money, blocking: enum[]}` | tenant | deudores y bancos diarios; tolerancia 0 | Conciliaciones. | Nuevo |
| PRM-CON-040 | `con.posting.payrollEntryFormat` | lectura de `sue.posting.entryFormat` (1 recibos + contribuciones, 2 por sindicato, 3 personalizado) | tenant | (de SUE) | Formato del asiento de sueldos. | V2 2207 / PRM-SUE-P4-002 |
| PRM-CON-041 | `con.budget.controlPolicy` | `enum(info, warn, authorize, block)` | tenant / centro | `authorize` | Control presupuestario (PA-CON-09). | Nuevo |
| PRM-CON-042 | `con.budget.commitmentSources` | `enum[]` (OC, contratos, solicitudes) | tenant | OC | Qué compromete presupuesto. | Nuevo (AGR-028) |
| PRM-CON-043 | `con.budget.scope` | `enum(economic, economicAndFinancial)` | tenant | `economic` | Alcance del presupuesto (PA-CON-12). | Nuevo |
| PRM-CON-044 | `con.simulation.retentionDays` | `integer` | tenant | 365 | Conservación de escenarios no archivados. | Nuevo |
| PRM-CON-045 | `con.ai.suggestions.enabled` | `boolean` | tenant | `false` | Sugerencias de IA (solo propone). | Nuevo (AGR-030) |
| PRM-CON-046 | `con.externalLedger` | `object {enabled, systemName, layoutId, mode}` | tenant | `{false}` | Sistema contable externo. | `SISCONT`; FIC 18.2 |
| PRM-CON-047 | `con.statements.framework` | `enum(inaesRt, regulator, custom)` + `ref:statementTemplates` | tenant | `inaesRt` | Marco de estados (PA-CON-06). | Nuevo |
| PRM-CON-048 | `con.rubricatedBooks.format` | `enum(paper, digital, both)` | tenant | `paper` | Formato de libros (PA-CON-08). | Nuevo |
| PRM-CON-049 | `con.reopen.maxDays` | `integer` | tenant | 5 | Plazo máximo de una reapertura de período. | Nuevo |
| PRM-CON-050 | `con.rubricatedBooks.linesPerSheet` | `integer` | libro | 50 | Líneas por hoja rubricada. | `frmImprimirHojasRubricar.GuardarLineas` |
| PRM-CON-051 | `con.dashboard.alertThresholds` | `object` | tenant | eventos pendientes > 0; diferencias > 0 | Umbrales del tablero. | Nuevo |
| PRM-CON-052 | `con.events.retryPolicy` | `object {attempts, backoff}` | plataforma (override tenant) | 5, exponencial | Reintentos del consumidor. | Nuevo |
| PRM-CON-053 | `con.batch.maxRangeDays` | `integer` | tenant | 31 | Rango máximo de un lote. | `frmCierreDiario` |
| PRM-CON-054 | `con.manualEntry.attachmentRequiredAbove` | `money` | tenant | ARS 500.000 | Respaldo obligatorio en asientos manuales. | Nuevo |
| PRM-CON-055 | `con.multiCurrency.enabled` | `boolean` | tenant | `false` | Cuentas en moneda extranjera. | `TIP_MON` |
| PRM-CON-056 | `con.closing.resultDestination` | `enum(unassignedSurplus, resultAllocationRole, resultTargets)` | tenant | `resultTargets` | Destino del resultado en la refundición. | V2 513; `RESULTA` |
| PRM-CON-057 | `con.costDistribution.defaultDrivers` | `enum[]` | tenant | porcentaje fijo | Drivers habilitados. | Nuevo |
| PRM-CON-058 | `con.platformTemplate.chartId` | `ref:platformChartTemplates` | plataforma | Plan modelo cooperativa de servicios | Plan y reglas modelo (RN-CON-110, PA-CON-15). | Nuevo |
| PRM-CON-059 | `con.posting.requireServiceDimension` | `boolean` | tenant | `true` | Exigir servicio en cuentas `requiresService` (RN-CON-108, PA-CON-16). | Nuevo (BASE §75 CON-005) |
| PRM-CON-060 | `con.surplus.distributionTemplate` | `object {legalReservePct, educationFundPct, mutualAidFundPct, capitalInterestMaxRate, nonMemberToSpecialReserve}` | tenant | Valores de la normativa vigente cargados por el contador [VERIFICAR] | Cuadro propuesto de distribución de excedentes (RN-CON-105). | MER-011; Ley 20.337 art. 42 |
| PRM-CON-193 | `con.burialRight.revenueRecognition` | `enum atGrant, deferredOverTerm` | tenant | `atGrant` | Reconocimiento del ingreso por venta del derecho de sepultura: del período al otorgar (M-134) o diferido durante la vigencia (M-135) (RN-CON-124, PA-CON-17). | HUECO-CEM-04 |
| PRM-CON-194 | `con.socialSubsidy.fundShortfall` | `enum expense, block` | tenant | `expense` | Si el fondo de subsidio no alcanza: imputar el excedente a `rol:socialSubsidy` o dejar el evento pendiente de revisión (RN-CON-122). | HUECO-SEP-03 |

### 14.2 Roles de cuenta (las 54 cuentas por defecto de ProCoop y los roles nuevos)

Cada rol es una regla de imputación por defecto del motor (último paso de la cascada, RN-CON-022): evento económico + rol de importe → cuenta, con override por servicio, centro de costo u otra dimensión (T04b §5.8, decisión "Cuenta contable"). Tipo `accountRef` (cuenta imputable del plan); ámbito tenant con override por la dimensión indicada; default: "— (mapear del plan migrado)" para migrados y la cuenta del plan modelo para tenants nuevos. El migrador (T07) traduce el código ProCoop de 11 dígitos a la cuenta migrada. Filas de la matriz que lo usan entre paréntesis.

| PRM-ID | Rol (`con.postingRule.<rol>`) | Descripción ProCoop | Override | Usado en | Origen V2 # / T04b |
|---|---|---|---|---|---|
| PRM-CON-101 | `resultAllocation` | Cuenta para asignación de resultados | — | M-120, M-122; exportación OCEBA | 513 / PRM-CON-P4-002 |
| PRM-CON-102 | `cashClose` | Cierre de caja | sucursal, caja | M-20, M-84 | 2101 / P4-003 |
| PRM-CON-103 | `billingReceivable` | Facturación (deudores por servicios) | servicio | M-01…M-05, M-20…M-28, M-37, M-41…M-43, M-103, M-110 | 2102 / P4-004 |
| PRM-CON-104 | `refinancingReceivable` | Refinanciaciones | tipo de deudor (PRM-CON-022) | M-03, M-10, M-37, M-39 | 2103 / P4-005 |
| PRM-CON-105 | `vatOutputRegistered` | IVA inscripto (débito fiscal) | alícuota | M-01, M-38, M-49 | 2104 / P4-006 |
| PRM-CON-106 | `vatOutputNonRegistered` | IVA no inscripto | alícuota | M-01, M-49 | 2105 / P4-007 |
| PRM-CON-107 | `salesPerceptionsByProduct` | Percepciones en productos | impuesto | M-01 | 2106 / P4-008 |
| PRM-CON-108 | `salesPerceptionsUncategorized` | Percepciones a no categorizados | impuesto | M-01 | 2107 / P4-009 |
| PRM-CON-109 | `serviceRevenue` | Energía eléctrica (ingreso del servicio) | servicio | M-01 | 2108 / P4-010 |
| PRM-CON-110 | `lateDueDateInterest` | Intereses en 2.º y 3.er vencimiento | servicio | M-05, M-35 (ingreso por intereses; `interestIncome` es su override para intereses de mora generales) | 2109 / P4-011 |
| PRM-CON-111 | `deliveryNoteDiscounts` | Descuentos en remitos | — | M-09 | 2110 / P4-012 |
| PRM-CON-112 | `unmappedConceptSuspense` | Conceptos desconocidos (cuenta puente con alerta) | — | M-01 (solo con PRM-CON-028 = `suspenseAccount`), RN-CON-114 | 2111 / P4-013 |
| PRM-CON-113 | `accountsPayable` | Compras / proveedores | proveedor, categoría de proveedor | M-48, M-57, M-58, M-60, M-69, M-86, M-87 | 2112 / P4-014 |
| PRM-CON-114 | `vatInput` | IVA crédito fiscal | alícuota, centro (porcentaje computable) | M-23, M-24, M-49, M-57, M-88 | 2113 / P4-015 |
| PRM-CON-115 | `purchaseOtherTaxes` | Impuestos varios en compras | impuesto | M-57 | 2114 / P4-016 |
| PRM-CON-116 | `bankCreditsUncategorized` | Créditos bancarios sin subcategoría | cuenta bancaria | M-82 | 2118 / P4-017 |
| PRM-CON-117 | `bankDebitsUncategorized` | Débitos bancarios sin subcategoría | cuenta bancaria | M-82 | 2119 / P4-018 |
| PRM-CON-118 | `cardCouponsInPortfolio` | Tarjetas de crédito (cupones en cartera) | tarjeta | M-21, M-88 | 2121 / P4-019 |
| PRM-CON-119 | `chequesInPortfolio` | Valores en cartera | — | M-12, M-21, M-83, M-85, M-86 | 2122 / P4-020 |
| PRM-CON-120 | `refinancingVatAccrual` | Devengamiento de IVA en refinanciaciones | — | M-10, M-37, M-38 | 2125 / P4-021 |
| PRM-CON-121 | `badDebtAllowance` | Previsión para deudores incobrables | servicio | M-40, M-41 | 2126 / P4-022 |
| PRM-CON-122 | `cardCouponsSubmitted` | Tarjetas de crédito presentadas | tarjeta | M-88 | 2127 / P4-023 |
| PRM-CON-123 | `cardCommissions` | Comisiones de tarjetas | tarjeta | M-88 | 2128 / P4-024 |
| PRM-CON-124 | `capitalMovements` | Movimientos de capital (capital suscripto) | rubro de capital | M-02, M-20, M-105 | 2129 / P4-025 |
| PRM-CON-125 | `capitalToRefund` | Capital a devolver | — | M-108, M-109 | 2130 / P4-026 |
| PRM-CON-126 | `capitalRedeemedBadDebtors` | Capital rescatado por socios incobrables | — | M-110 | 2131 / P4-027 |
| PRM-CON-127 | `capitalPaidIn` | Capital integrado | rubro de capital | M-106, M-108, M-110 | 2133 / P4-028 |
| PRM-CON-128 | `rejectedCheques` | Valores rechazados | — | M-85, M-86 | 2134 / P4-029 |
| PRM-CON-129 | `deferredFinancingInterest` | Intereses a futuro por financiaciones | — | M-03, M-37…M-39 | 2135 / P4-030 |
| PRM-CON-130 | `withholdingsSuffered` | Retenciones en tesorería (sufridas) | impuesto, régimen | M-32, M-89; incluye TipoCuenta 2120 (IVA en cobro), 2123 y 2124 (retenciones en cobro) como overrides por impuesto | 2136 / P4-031 |
| PRM-CON-131 | `cashDifferences` | Diferencias en cajas | sucursal, caja | M-30, M-91 | 2137 / P4-032 |
| PRM-CON-132 | `installmentSaleInterest` | Intereses por venta en cuotas | — | M-10 | 2138 / P4-033 |
| PRM-CON-133 | `inflationAdjustment` | Ajuste por inflación (RECPAM) | — | M-68, M-73, M-107, M-119 | 2139 / P4-034 |
| PRM-CON-134 | `supplierPaymentDiscounts` | Descuentos en pagos a proveedores | — | M-58 | 2141 / P4-035 |
| PRM-CON-135 | `supplierPaymentCash` | Pago a proveedores en efectivo (puente) | sucursal | M-58 | 2148 / P4-036 |
| PRM-CON-136 | `supplierPaymentValues` | Pago a proveedores con valores (puente) | — | M-58 | 2149 / P4-037 |
| PRM-CON-137 | `stockWorkOrders` | Stock asociado a OT | servicio | M-61 | 2150 / P4-038 |
| PRM-CON-138 | `stockMaintenanceOrders` | Stock asociado a OM | — | M-61 | 2151 / P4-039 |
| PRM-CON-139 | `stockCountAdjustments` | Stock — conciliaciones (inventario) | depósito | M-64 | 2152 / P4-040 |
| PRM-CON-140 | `stockVouchers` | Stock — vales | obra | M-62 | 2153 / P4-041 |
| PRM-CON-141 | `stockActivationOrders` | Stock — altas en orden | servicio | M-67 | 2154 / P4-042 |
| PRM-CON-142 | `supplierPaymentFromCashDesk` | Pagos en efectivo desde caja | sucursal, caja | M-58 | 2155 / P4-043 |
| PRM-CON-143 | `supplierPaymentDeferredTransfer` | Pagos con transferencia diferida | cuenta bancaria | M-58 | 2156 / P4-044 |
| PRM-CON-144 | `debtPrescription` | Prescripción de deuda | servicio | M-43 | 2158 / P4-045 |
| PRM-CON-145 | `purchaseDiscounts` | Descuento de productos/conceptos en compras | — | M-57 | 2159 / P4-046 |
| PRM-CON-146 | `salesProductPerceptions` | Percepción en ventas de productos | impuesto | M-09 | 2160 / P4-047 |
| PRM-CON-147 | `loanedEquipment` | Productos en comodato | servicio | M-66 (si PRM-CON-027) | 2161 / P4-048 |
| PRM-CON-148 | `goodsPendingDelivery` | Productos pendientes de entrega (vacío = no se genera asiento de remitos) | — | M-56, M-57 | 2162 / P4-049 |
| PRM-CON-149 | `billingRounding` | Redondeo de facturación | servicio | M-01, P-CON-01 paso 6 | 2163 / P4-050 |
| PRM-CON-150 | `cashCloseRounding` | Redondeo de cierre de caja | caja | M-30 | 2164 / P4-051 |
| PRM-CON-151 | `collectionsPendingBankCredit` | Acreditaciones pendientes de bancos | ente, canal | M-22, M-23, M-28 | 2165 / P4-052 |
| PRM-CON-152 | `workOrderLaborHours` | Horas normales y extra de participantes de OT | — | M-63, M-74 | 2166 / P4-053 |
| PRM-CON-153 | `workOrderValuedHours` | Horas valuadas de participantes de OT | — | M-63 | 2167 / P4-054 |
| PRM-CON-154 | `workInProgress` | Productos en producción | — | M-69, M-74 | 3141 / P4-067 |

Roles nuevos de CoopApps (sin parámetro ProCoop; mismo tipo y ámbito):

| PRM-ID | Rol | Uso | Filas |
|---|---|---|---|
| PRM-CON-160 | `unidentifiedCollections` | Cobros no identificados (AGR-012) | M-25, M-26 |
| PRM-CON-161 | `customerAdvances` | Anticipos y saldos a favor de asociados | M-25, M-26, M-29, M-88, M-114 |
| PRM-CON-162 | `gatewayCommissions` | Comisiones de entes y pasarelas (override por ente) | M-23, M-24 |
| PRM-CON-163 | `thirdPartyCollections` | Cobranzas por cuenta de terceros (override por convenio) | M-01, M-08, M-31, M-50 |
| PRM-CON-164 | `interestIncome` | Intereses ganados por mora y financiación | M-05, M-20, M-38 |
| PRM-CON-165 | `revenueAccrued` | Ingresos devengados no facturados | M-13 |
| PRM-CON-166 | `badDebtExpense` | Cargo por incobrables | M-40, M-41 |
| PRM-CON-167 | `recoveryIncome` | Recupero de incobrables | M-42 |
| PRM-CON-168 | `judicialCostsReceivable` | Gastos judiciales a recuperar | M-44 |
| PRM-CON-169 | `guaranteesHeld` | Depósitos en garantía recibidos (pasivo con el depositante; incluye el depósito del préstamo ortopédico, HUECO-OTR-04, RN-CON-123) | M-45, M-132, M-133 |
| PRM-CON-170 | `withholdingsPayable` | Retenciones practicadas a depositar (override por régimen; la cuenta del tipo de retención en `entityAccountAssignments` prevalece) | M-48, M-51 |
| PRM-CON-171 | `vatPayable` / `vatCreditBalance` | IVA a pagar / saldo técnico a favor | M-49, M-51 |
| PRM-CON-172 | `supplierAdvances` | Anticipos a proveedores (concepto V2 2035 en CMP) | M-59 |
| PRM-CON-173 | `ownChecksPending` | Cheques propios diferidos pendientes de débito | M-58, M-87 |
| PRM-CON-174 | `fxDifferences` | Diferencias de cambio | M-90, M-93 |
| PRM-CON-175 | `costOfSales` | Costo de mercaderías vendidas (override por rubro) | M-65 |
| PRM-CON-176 | `assetDisposalResult` | Resultado por baja/venta de bienes de uso | M-72 |
| PRM-CON-177 | `payrollPayable` | Sueldos a pagar | M-96, M-98, M-103 |
| PRM-CON-178 | `socialSecurityPayable` | Cargas sociales a pagar | M-96, M-99 |
| PRM-CON-179 | `payrollWithholdingsPayable` | Retenciones al personal a depositar (sindicato, ganancias, embargos) | M-96, M-99 |
| PRM-CON-180 | `employeeAdvances` | Adelantos al personal (concepto V2 2034 en CMP) | M-96 |
| PRM-CON-181 | `sacProvision` / `vacationProvision` | Provisiones de SAC y vacaciones | M-100 |
| PRM-CON-182 | `capitalSubscribedReceivable` | Asociados — cuenta suscripción | M-105, M-106, M-114 |
| PRM-CON-183 | `unassignedSurplus` | Excedentes no asignados (resultado a distribuir) | M-113, M-122 |
| PRM-CON-184 | `legalReserve`, `educationFund`, `mutualAidFund`, `specialReserve` | Reservas y fondos de la distribución de excedentes [VERIFICAR fondos vigentes] | M-113 |
| PRM-CON-185 | `capitalInterestPayable`, `surplusReturnsPayable` | Interés a cuotas sociales y retornos a pagar | M-113, M-114 |
| PRM-CON-186 | `wholesaleEnergyCost` | Compra de energía al mayorista: costo de abastecimiento del servicio ELE (RN-CON-069; HUE-ELE-01) | M-126 |
| PRM-CON-187 | `wholesaleGasCost` | Compra de gas a la distribuidora: costo de abastecimiento del servicio GAS (RN-CON-069; HUE-GAS-04) | M-127 |
| PRM-CON-188 | `signalRightsCost` / `signalRightsAccrued` | Derechos de señales de TV: costo del servicio TV / derechos devengados a pagar (HUE-TV-01) | M-128, M-57 |
| PRM-CON-189 | `socialSubsidy` | Subsidio social aprobado no cubierto por el fondo (gasto del servicio social; HUECO-SEP-03) | M-130 |
| PRM-CON-190 | `socialSubsidyFund` | Fondo de subsidio (contrapartida del subsidio social; pasivo o fondo según reglamento, puede apuntar a la misma cuenta que `mutualAidFund`; HUECO-SEP-03) | M-129, M-130 |
| PRM-CON-191 | `socialSubsidyPayable` | Subsidios a pagar a beneficiarios (HUECO-SEP-03) | M-130, M-131 |
| PRM-CON-192 | `burialRightDeferredRevenue` | Ingreso diferido por venta del derecho de sepultura; solo con PRM-CON-193 = `deferredOverTerm` (HUECO-CEM-04, PA-CON-17) | M-135 |
| PRM-CON-195 | `interEntityAccount` | Cuenta entre entidades jurídicas del tenant (crédito en la que recibe dinero por cuenta de otra, deuda en la otra; DEC-064, DEC-087) | M-136 |
| PRM-CON-196 | `ownTaxExpense` | Gasto por impuestos y contribuciones propias del tenant como contribuyente, cuando el registro de M06 no tiene cuenta asignada (DEC-095, RN-CON-128); admite ámbito `legalEntity` | M-137 |
| PRM-CON-197 | `ownTaxPayable` | Deuda por impuestos y contribuciones propias a pagar (DEC-095, RN-CON-128); admite ámbito `legalEntity` | M-137, M-138 |

### 14.3 Parámetros de otros módulos que afectan la contabilización

El dueño del parámetro es el anexo indicado; CON los lee al construir o resolver el asiento.

| V2 # | Descripción | PRM-ID T04b / clave | Dueño | Efecto contable |
|---|---|---|---|---|
| 73 / 2636 | Momento de suscripción del capital (al facturar / en la afiliación) | PRM-INS-P1-001 `ins.capital.momentoSuscripcion` | M17 | Fecha de M-105 |
| 2916 | Integrar capital en el pago | PRM-INS-P2-003 `ins.capital.integrarAlCobrar` | M17 | Dispara M-106 con el cobro |
| 2738 | Exigir grupo contable en alta de cuenta | PRM-PER-P1-049 `per.cuentas.exigirGrupoContable` | M01 | Garantiza dimensión grupo contable para PRM-CON-021 |
| 308 / 310 | Concepto de cuota y de capital de financiación | PRM-MOR-P3-048 / P3-049 | M08 | Clasifica roles de importe en M-03, M-38 (con PRM-CON-023) |
| 110 / 2388 | Fecha contable de facturas de compra | PRM-CMP-P4-001 / P4-028 | M12 | Fecha base de M-57 |
| 2034 / 2035 | Conceptos de anticipos de sueldos y a proveedores | PRM-CMP-P4-013 / P4-014 | M12 | Roles `employeeAdvances` y `supplierAdvances` |
| 2902 | % de IVA en compras por sección | PRM-CMP-P4-051 | M12 | PRM-CON-031 |
| 3068 | Exigir cuenta contable al cargar proveedor | PRM-CMP-P4-057 | M12 | Asignación en `entityAccountAssignments` obligatoria |
| 2341 | Método de valorización de stock | PRM-STK-P4-010 | M13 | Importe del costo en M-61, M-65 |
| 2722 / 2723 | Importe de horas normales y extras | PRM-TEC-P4-051 / P4-052 | M10 | Valuación de M-63 |
| 2076 | Cuenta de movimiento para cambio de valores | PRM-TES-P4-029 | M14 | Clasifica M-90 |
| 2288 | Permitir modificar fecha de transferencia | PRM-TES-P4-030 | M14 | Puede generar evento tardío (RN-CON-106) |
| 2384 / 2517 | Conceptos de importe exento y gastos en cheques rechazados | PRM-TES-P4-032 / P4-037 | M14 | ND al socio y gasto en M-85 |
| 2207 | Formato de asiento de sueldos | PRM-SUE-P4-002 | M16 | PRM-CON-040 |
| 2538 | Novedad de adelanto de sueldo desde compras | PRM-SUE-P4-006 | M16 | M-96 |
| 755 / 2670 | Comprobante de retiro de materiales de vivienda y obra por defecto de vales | PRM-SOC-P4-007 / P4-013 | M18 | Destino de M-62 |
| 543 | Código de impuesto IVA | Reemplazado (`taxes.kind = 'IVA'`) | M06 | Identifica roles de importe IVA |
| 2008, 2010, 2445, 2446, 2924, 2935, 2353 | Datos de agente de retención y archivos DGR/percepciones | PRM-FIS-P1-005, P1-007, P2-021, P4-002, P4-003; PRM-PER-P1-004 | M06 / M01 | Informes de `clsInformes_Contabilidad` pasan a FIS |
| 519, 2823 | CUIT y código de distribuidora OCEBA | PRM-PLA-P1-003, PRM-FIS-P1-021 | T01 / M06 | Exportación OCEBA (con PRM-CON-101) |
| 2264 | Sigla del tenant | PRM-PLA-P1-014 | T01 | Encabezados de reportes |

### 14.4 Parámetros ProCoop de CONTABILIDAD reemplazados o descartados

| V2 # | Descripción | Decisión | Mecanismo |
|---|---|---|---|
| 67, 432, 500, 501, 502, 504, 505, 506, 2376, 2528, 2778, 2785 | Fechas de cierre de comprobantes de venta, stock, compras, facturación, bancos, financiaciones, viviendas, tesorería, sueldos, contabilidad, bienes de uso y capital | Reemplazado | `accountingPeriods.moduleLocks` (en T04b, `con.periodLocks`); T07 migra cada fecha como bloqueo inicial (PA-CFG-P4-03); `periodGuard` (API-CON-35) |
| 508, 509, 510, 511, 512, 514 | Prefijos de pasivo, patrimonio, ganancias, pérdidas, orden y activo | Reemplazado | Atributo `nature` de la cuenta (T04b `accountType`); cierres y exportación OCEBA usan la naturaleza |
| 2814 | Mostrar columna subcuenta | Reemplazado | Columnas configurables del `DataTable` |
| 3028 | Validar asientos ya generados | Reemplazado | Idempotencia por evento (RN-CON-011) |
| 2924, 2935 | Códigos de impuesto para archivos de percepciones IIBB y DGR | Migrado a M06 | PRM-FIS-P4-002, PRM-FIS-P4-003 |
| 580 | Fecha de imputación contable | Descartado en T04b (sin lectura) | Cubierto por PRM-CON-015 |
| 2308 | Mostrar asiento en orden de pago | Reemplazado | Pestaña "Asiento" estándar (API-CON-85) |

## 15. Reportes

Todos los reportes: universo = asientos `posted` (y `voided`/`reversed` solo si se pide "incluir anulados"); fecha de corte por fecha contable o de registro; plan elegido (operativo o alternativo vía proyección, nunca simulación salvo en PAN-CON-33); exportación PDF/XLSX/CSV; corte de datos según AGR-022 (la consulta indica fecha y hora de corte y versión de configuración). Los indicadores derivados se publican a T10 con su fórmula aquí (contrato semántico).

| Reporte | Fórmula / contenido | Universo y filtros | Origen ProCoop |
|---|---|---|---|
| Libro diario | Asientos en orden de número con renglones; totales debe = haber por asiento y por página | Ejercicio, rango, tipo | `frmAsientos`, `frmImpresiones` |
| Libro diario rubricado | Ídem con folio, encabezado de rúbrica y transporte de totales | Libro y rango | `frmImprimirHojasRubricar` |
| Mayor | Saldo anterior + Σ debe − Σ haber por movimiento (signo según saldo normal) | Cuenta o rama, centro, servicio | `frmMayor` |
| Sumas y saldos | Por cuenta: saldo inicial, Σ debe, Σ haber, saldo final; Σ debe total = Σ haber total | Ejercicio, rango, nivel | `frmSumasySaldos` |
| Balance de saldos por rubro | Saldos agrupados por rubro y subrubro | Fecha de corte | `frmImpresiones` (secciones y rubros) |
| Transacciones por cuenta / documento | Renglones con documento de origen y evento | Rango, módulo | `clsInformes_Contabilidad` |
| Estado de situación patrimonial | Plantilla de estados: activo = pasivo + patrimonio neto, corriente/no corriente | Ejercicio y comparativo | `frmImpresiones` (balance) |
| Estado de resultados | Ingresos − costos − gastos ± resultados financieros y RECPAM = resultado | Ejercicio | Ídem |
| Estado de evolución del patrimonio neto | Capital, ajustes, reservas, resultados no asignados: saldo inicial + movimientos = saldo final | Ejercicio | Nuevo |
| Estado de flujo de efectivo | Método indirecto: resultado ± partidas sin movimiento de fondos ± variación de capital de trabajo | Ejercicio | Nuevo |
| Anexo de bienes de uso | Por rubro: valor de origen inicial + altas − bajas = final; amortización acumulada inicial + del ejercicio − bajas = final; neto | Ejercicio (datos de STK conciliados) | `BIENES_USO_*` |
| Anexo de gastos | Gastos por naturaleza y función (costo de servicios, administración, comercialización) | Ejercicio | Nuevo |
| Resultado por servicio / sección | Ingresos directos − costos directos − comunes distribuidos | Período, corrida de distribución | Gastos e ingresos por sección y por grupos |
| Ejecución presupuestaria | Presupuestado, comprometido, devengado (real), pagado, disponible = presupuestado − comprometido − devengado no comprometido; % = devengado / presupuestado | Presupuesto, período, centro, servicio | Nuevo |
| Conciliación de auxiliares | Auxiliar − cuenta de control = diferencia por clave, clasificada | Tipo, fecha de corte | Nuevo |
| Anticipos y saldos a favor a una fecha | Σ saldos a favor por socio y servicio a la fecha, reconstruidos | Fecha | `frmInformeAnticiposAUnaFecha` |
| Control previo al cierre | Lista de bloqueantes del checklist | Período | Nuevo |
| Cuadro de distribución de excedentes | Resultado del ejercicio − resultados con no asociados (a reserva especial) = excedente repartible; reservas y fondos por porcentaje; interés a cuotas ≤ tope; retornos por proporción de operaciones | Ejercicio, resolución de asamblea | MER-011 |
| Exportaciones regulatorias OCEBA y FEDECOBA | Mapeo de cuentas (`regulatoryMapping`) y resultado asignado (rol `resultAllocation`) | Ejercicio | `ExportarExcel_OCEBA`, `ExportarCSV_OCEBA` |

Indicadores de gestión de ProCoop (`clsInformes_Contabilidad`) que se publican a T10 con fórmula: servicios conectados (contratos en estado conectado o suspendido al corte, condición 2/3 de SERSOC); servicio tomado vs facturado (contratos activos − contratos con factura en el período); cobranza por caja vs banco (Σ cobros por canal / Σ cobros); cobranza vs facturado al primer vencimiento (Σ cobrado hasta el 1.er vencimiento / Σ facturado del período); composición de deuda por servicio y antigüedad; productividad de cajas por franja horaria (cobros por caja y hora). Se calculan sobre datos de COB/FAC, no sobre asientos; CON solo garantiza que el total cobrado y facturado concilia con las cuentas de control.

## 16. Casos de uso

Importes ficticios en ARS; IVA omitido salvo que el caso lo trate.

### CU-22 Pago digital con comisión (BASE §22)

1. Ana Pérez (ASO-001) paga ARS 8.000 por pasarela; COB publica `cob.payment.confirmed` (M-22). Asiento: Debe `collectionsPendingBankCredit` 8.000 / Haber `billingReceivable` (servicio de la factura) 8.000.
2. TES registra la acreditación neta (M-23): Debe Banco 7.840, `gatewayCommissions` 160 / Haber `collectionsPendingBankCredit` 8.000. ASI-DEMO-001 en la precarga muestra la forma condensada (Debe Banco 7.840 + Comisiones 160 / Haber Créditos por servicios 8.000) que resulta de sumar ambos pasos.
3. Resultado: la cuenta puente queda en cero; desde el asiento se abre el recibo y la liquidación de la pasarela. Si la acreditación no llega, la cuenta puente muestra el pendiente por canal y la conciliación lo lista.

### CU-ERP-01 Planes alternativos y simulación de tarifa (BASE §55)

**Definición dueña:** este anexo (planes de cuentas y simulación son de M15). T10 la cita para el reporte REP-CON-004.

1. En PC-OPER-01 los ingresos del mes suman 38.000 en "Ingresos por servicios".
2. En PC-ALT-01 la equivalencia separa por servicio: Agua 13.000, Internet 25.000 (proyección JOB-CON-10).
3. SIM-ERP-001 aplica tarifa +10 %: Agua 14.300, Internet 27.500, total 41.800, con marca de simulación; los libros oficiales siguen en 38.000.

### CU-CON-01 Resultado por servicio con costos comunes (BASE §75)

1. Facturas de ASO-001: Agua 13.000 y Internet 25.000 (M-01). Cobro de 5.000 imputado a Agua (M-20). Saldo del auxiliar 33.000 = cuenta de control 33.000 (conciliación `balanced`).
2. Costos directos: Agua 6.000 (CC-AG), Internet 12.000 (CC-INT); comunes 4.000 en CC-ADM.
3. Corrida con DIST-DEMO-25-75: Agua recibe 1.000, Internet 3.000. Resultado: Agua 13.000 − 6.000 − 1.000 = 6.000; Internet 25.000 − 12.000 − 3.000 = 10.000; total 16.000 (igual al resultado contable 38.000 − 22.000).
4. SIM-CON-001 con reparto 50/50: Agua 5.000, Internet 11.000, total 16.000 sin tocar libros.

### CU-OPE-01 Compra de módems con compromiso (BASE §78, parte contable)

**Definición dueña:** M12 «CU-OPE-01 — Compra de módems por servicio». Aquí solo el tramo contable.

1. OC-DEMO-002 por 2 módems × 20.000 = 40.000 aprobada: compromiso 40.000 en el presupuesto de CC-INT (sin asiento, M-55).
2. Recepción (M-56): Debe Stock módems 40.000 / Haber `goodsPendingDelivery` 40.000.
3. Factura del proveedor neto 40.000 + IVA 8.400 (M-57): Debe `goodsPendingDelivery` 40.000, `vatInput` 8.400 / Haber `accountsPayable` 48.400. El compromiso pasa a devengado; la ejecución muestra comprometido 0, devengado 40.000.

### CU-104 Asiento de sueldos (BASE §104, parte contable)

**Definición dueña:** M16 «CU-104 — Liquidación mensual de una cooperativa eléctrica». Aquí solo el asiento; los importes son un ejemplo de la forma del asiento y no reemplazan los datos ficticios de M16.

1. SUE aprueba la liquidación de octubre 2026 (`sue.payrollRun.approved`, M-96) con imputación por centro: Distribución 60 %, Administración 30 %, Internet 10 %.
2. Ejemplo: remuneraciones 1.000.000, contribuciones patronales 240.000, aportes y retenciones 170.000, sindicato 20.000. Asiento: Debe Sueldos 1.000.000 y Cargas sociales 240.000 (distribuidos 60/30/10) / Haber `payrollPayable` 810.000, `socialSecurityPayable` 410.000 (aportes 170.000 + contribuciones 240.000), `payrollWithholdingsPayable` 20.000.
3. El pago del neto (M-98) cancela `payrollPayable` contra banco; el F.931 (M-99) cancela `socialSecurityPayable`.

### CU-FIS-01 Pago a proveedor con retención (BASE §61, parte contable)

**Definición dueña:** M06 «CU-FIS-01 — Retención en un pago a proveedor». Aquí solo el tramo contable, con los importes de M06 y M12 (corrección 05-11-2026: antes factura de 121.000 y pago de 119.000).

Factura de 100.000 de PROV-DEMO-001; la OP aplica la retención RET-DEMO-001 de 2.000 (M-48) y paga 98.000 (M-58): Debe `accountsPayable` 100.000 / Haber Banco 98.000, `withholdingsPayable` 2.000. El depósito de la retención (M-51) cancela el pasivo.

### CU-CON-02 Pago en exceso (ESC-01)

ASO-001 paga 10.000 con una deuda de 8.000: Debe Caja 10.000 / Haber `billingReceivable` 8.000, `customerAdvances` 2.000 (M-20, M-25). El informe de anticipos al 31-10-2026 lista 2.000 y coincide con la cuenta. La factura siguiente consume el saldo (M-26).

### CU-CON-03 Resumen diario de cobranza

Modo `dailySummary` para COB. El 15-10-2026 llegan 1.200 cobros en 3 cajas y 2 entes. JOB-CON-02 agrupa por día, servicio y medio: genera un asiento con un renglón por servicio en `billingReceivable` y uno por caja/ente; el usuario revisa en PAN-CON-17 y confirma. Re-ejecutar el día no duplica (los eventos ya están `posted`). Con PRM-CON-024 activo y una caja abierta, el lote se detiene y la muestra.

### CU-CON-04 Servicio nuevo sin cuenta

Se publica el servicio "TV" sin regla de ventas: con PRM-CON-017 = `block` la publicación se detiene con el faltante. Si se publicó con `warn`, la primera factura emitida deja su evento en `pendingConfiguration` (EVT-CON-04), la factura sigue válida para el socio, el contador asigna la cuenta desde el enlace de la bandeja, JOB-CON-03 reprocesa y el período puede cerrarse.

### CU-CON-05 Compra con IVA computable por sección

Factura de proveedor neto 100.000 + IVA 21.000 = 121.000, imputada 50 % a Distribución (IVA computable 60 %) y 50 % a Administración (100 %). Con PRM-CON-030 activo: Debe Gastos Distribución 50.000 + IVA no computable 4.200 (40 % de 10.500), Gastos Administración 50.000, `vatInput` 16.800 (6.300 + 10.500) / Haber `accountsPayable` 121.000.

### CU-CON-06 Convenio de pago con intereses

Deuda vencida 30.000 refinanciada en 3 cuotas con interés total 3.000 (M-37): Debe `refinancingReceivable` 33.000 / Haber `billingReceivable` 30.000, `deferredFinancingInterest` 3.000. Al facturar cada cuota (M-38): Debe `deferredFinancingInterest` 1.000 / Haber `interestIncome` 1.000. Si el convenio cae tras la primera cuota (M-39), se restituye la deuda y se revierte el interés no devengado (2.000).

### CU-CON-07 Cierre del ejercicio 2026

1. Los doce períodos están cerrados; el ajuste por inflación está contabilizado.
2. JOB-CON-05 genera la refundición (cierra todas las cuentas de ingresos y egresos del ejercicio y lleva la diferencia a `resultAllocation` o a los destinos de `resultTargets`), el cierre patrimonial y la apertura 2027.
3. Vista previa: todas las cuentas de resultado en cero; el contador confirma; EVT-CON-09 informa el resultado a M17 para la asamblea.

### CU-CON-08 Reapertura de período

El 10-11-2026 aparece una factura de compra de octubre. El contador solicita reabrir octubre para compras con motivo y plazo 2 días; el gerente aprueba (T11); se registra; el período vuelve a `closed` al vencer el plazo o a mano. Todo queda en el historial.

### CU-CON-09 Ajuste por inflación

Un terreno de 100.000 incorporado con índice 100; índice al cierre 150. Coeficiente 1,5; ajuste 50.000: Debe Terreno 50.000 / Haber `inflationAdjustment` 50.000. Si falta el índice de un mes, la corrida aborta indicando el mes.

### CU-CON-10 Capital social

Suscripción de 10 cuotas de 1.000 al afiliarse (M-105): Debe `capitalSubscribedReceivable` 10.000 / Haber `capitalMovements` 10.000. Integración de 2.000 en la factura (M-02, M-106) y cobro: el capital integrado no aparece como ingreso. Rescate aprobado de 2.000 (M-108) y pago (M-109).

### CU-CON-11 Exceso presupuestario

CC-INT tiene disponible 30.000; una OC de 40.000 dispara `con.commitment.exceeded`; con política `authorize` la OC queda esperando la autorización del gerente; aprobada, el compromiso registra el exceso autorizado.

### CU-CON-12 Importación del estudio contable

El estudio envía un XLSX con 3 asientos de ajuste; uno desbalanceado: la importación rechaza el archivo completo indicando la fila. Corregido, se importan como borradores y el contador los contabiliza.

### CU-CON-13 Transcripción a libro rubricado

Libro Diario N.º 3, hojas 1 a 500, 50 líneas por hoja. Se transcriben los asientos 1 a 420 de 2026 en las hojas 1 a 37; los asientos transcriptos ya no admiten anulación (solo contraasiento) ni renumeración.

### CU-CON-14 Amortización y reversión

STK publica la amortización de octubre (M-70) de un camión 70 % Distribución / 30 % Administración por 30.000: Debe Amortizaciones 21.000 (CC-DIS) y 9.000 (CC-ADM) / Haber Amortización acumulada rodados 30.000. Al revertir la corrida, CON registra el contraasiento y emite EVT-CON-02; STK devuelve los acumulados al 30-09.

### CU-CON-15 Distribución de excedentes

Excedente repartible aprobado por asamblea (M-113): Debe `unassignedSurplus` / Haber reservas y fondos con los porcentajes de PRM-CON-060, interés a cuotas y retornos a pagar; el resultado con no asociados va a `specialReserve`. Los retornos capitalizados (M-114) aumentan el capital del asociado en M17.

### CU-CON-16 Diferencia en conciliación de bancos

La conciliación diaria muestra banco contable 500.000 vs auxiliar TES 499.000: diferencia de corte (gasto bancario registrado en TES al día siguiente). El contador la clasifica como `cutoff` y queda `explained`; al día siguiente la diferencia desaparece.

## 17. Criterios de aceptación y escenarios

| ESC-ID | Escenario | Resultado esperado |
|---|---|---|
| ESC-01 | Pago en exceso de ARS 2.000 | Saldo a favor en `customerAdvances`, nunca ingreso; informe de anticipos coincide (CU-CON-02). |
| ESC-02 | Reenvío del mismo evento económico (reintento del outbox) | Un solo evento y un solo asiento (RF-CON-051). |
| ESC-03 | Asiento manual en período cerrado | 409 con `dict:con.errors.periodClosed`; nada se graba. |
| ESC-04 | Usuario sin `con.asientos.contabilizar` intenta contabilizar | 403; la acción no aparece en la UI. |
| ESC-05 | Usuario del tenant A consulta un asiento del tenant B por id | 404 (no revela existencia); los índices y consultas incluyen `tenantId`. |
| ESC-CON-06 | Evento con concepto sin cuenta | Evento `pendingConfiguration`, documento de origen válido, cierre del período bloqueado hasta resolver. |
| ESC-CON-07 | Asiento automático intentado editar | Rechazado; solo revertir y reprocesar (RN-CON-113). |
| ESC-CON-08 | Anulación de una factura de período cerrado | Contraasiento con fecha del período abierto; el original intacto. |
| ESC-CON-09 | Lote de un rango ya contabilizado | Sin asientos nuevos; informe "0 eventos pendientes". |
| ESC-CON-10 | Simulación ejecutada dos veces con los mismos insumos | Mismo `runHash` y resultados; ningún registro en `journalEntries`. |
| ESC-CON-11 | Reporte oficial con escenario existente | Los importes simulados no aparecen en mayor, sumas y saldos ni estados. |
| ESC-CON-12 | Reconstrucción de saldos | `ledgerBalances` reconstruido = proyección vigente; si difiere, alerta crítica. |
| ESC-CON-13 | Conciliación de deudores al cierre del mes | Auxiliar COB por servicio = cuenta de control por servicio, o diferencias clasificadas. |
| ESC-CON-14 | Reapertura de ejercicio sin segundo aprobador | Imposible; la solicitud queda pendiente. |
| ESC-CON-15 | Unificación de cuentas | Movimientos, roles y reglas pasan al destino; mayor del destino = suma de ambos; origen `merged`. |
| ESC-CON-16 | Distribución con modelo que no suma 100 % | Rechazo en la configuración. |
| ESC-CON-17 | Amortización revertida | STK revierte acumulados (EVT-CON-02); el bien no puede eliminarse si tiene amortizaciones contabilizadas. |
| ESC-CON-18 | Cobro en caja con PRM-CON-025 = `onCashboxClosed` | El asiento se genera al cerrar la caja, con el detalle de sus cobros. |
| ESC-CON-19 | Falla de la base durante la contabilización | Transacción revertida; el evento queda `received` y se reintenta sin duplicar. |
| ESC-CON-20 | Diferencia de redondeo de 0,03 en un resumen | Va a `billingRounding`; 0,06 con tolerancia 0,05 deja el evento en `error`. |
| ESC-CON-21 | Token externo con `con.ext.saldos` pide asientos | 403. |
| ESC-CON-22 | Importación de asientos con cuenta agrupadora | Rechazo con fila y cuenta. |
| ESC-CON-23 | Factura mayorista de energía ficticia por ARS 1.000.000 neto + IVA (HUE-ELE-01) | Debe `wholesaleEnergyCost` 1.000.000 (servicio ELE) y `vatInput`; haber `accountsPayable`; ningún ingreso ni cargo al usuario. |
| ESC-CON-24 | Liquidación de derechos de señales aprobada por ARS 180.000 y factura de la programadora por ARS 182.000 (HUE-TV-01) | M-128 devenga 180.000; la factura cancela 180.000 de `signalRightsAccrued` y 2.000 van a `signalRightsCost`. |
| ESC-CON-25 | Subsidio aprobado por ARS 300.000 con fondo de ARS 250.000 y PRM-CON-194 = `expense` (HUECO-SEP-03) | Debe `socialSubsidyFund` 250.000 y `socialSubsidy` 50.000; haber `socialSubsidyPayable` 300.000; reprocesar EVT-SOC-04 no duplica. |
| ESC-CON-26 | Depósito ORT-DEMO-01 de ARS 20.000 facturado y luego devuelto como crédito (HUECO-OTR-04) | Al facturar: haber `guaranteesHeld` 20.000 (sin ingreso); al devolver: debe `guaranteesHeld` 20.000, haber `customerAdvances` 20.000. |
| ESC-CON-27 | Derecho de sepultura facturado por ARS 600.000 con vigencia de 10 años y PRM-CON-193 = `deferredOverTerm` (HUECO-CEM-04) | Al facturar: haber `burialRightDeferredRevenue` 600.000; JOB-CON-23 devenga ARS 5.000 por mes; con `atGrant` todo es ingreso del período. |
| ESC-CON-28 | Tenant con entidades A y B; cobro único en la caja de A de ARS 8.000 de A y ARS 5.000 de B (DEC-087, M-136) | En A: debe caja 13.000, haber créditos por servicios 8.000 y `interEntityAccount` 5.000; en B: debe `interEntityAccount` 5.000, haber créditos por servicios 5.000; reprocesar el evento no duplica; cada entidad balancea sola. |
| ESC-CON-29 | Factura con abono de ARS 10.000 y aporte de capital de ARS 2.000 (clase `capitalContribution`, RN-FIS-124) | El asiento M-01 imputa 10.000 a ingreso del servicio y el M-02 imputa 2.000 a capital social; ningún importe del aporte va a `rol:serviceRevenue`. |
| ESC-CON-30 | Cierre del período `2027-03` de la entidad A (CTR-DAT-31) | EVT-CON-07 con `legalEntityId` de A, `period = 2027-03` y `sequence = 3` (ejercicio que inicia en enero); el período de B sigue abierto. |
| ESC-CON-31 | Factura con servicio ARS 12.100, aporte al fondo ARS 1.000 (`subsidyFundContribution`) y depósito ARS 50.000 (`guaranteeDeposit`), valores ficticios, con reglamento que constituye el fondo con aportes (RN-CON-126) | Haber `rol:serviceRevenue` (neto) e IVA, `rol:socialSubsidyFund` 1.000 y `rol:guaranteesHeld` 50.000; ninguna clase especial cae en ingreso por la cascada; un renglón con clase desconocida queda pendiente sin asiento provisorio. |
| ESC-CON-32 | Tenant con COOP y MUTUAL; CC-ADM de COOP compartido con MUTUAL y CC-SEP de MUTUAL sin compartir (DEC-096, RN-CON-127) | Un asiento de MUTUAL imputa a CC-ADM y a CC-SEP; un asiento de COOP con CC-SEP se rechaza; el estado de resultados de CC-ADM muestra por separado lo imputado en COOP y en MUTUAL; tras migrar `CTSECCION`, todas las secciones quedan con dueña COOP (entidad por defecto) y compartidas con MUTUAL. |
| ESC-CON-33 | M06 crea una obligación propia de COOP por ARS 150.000, período 2026-06, con `ownTaxObligationId` (valores ficticios; DEC-095, RN-CON-128) | M-137 asienta el 30-06-2026 en COOP debe gasto (cuenta asignada al registro o `ownTaxExpense`) / haber `ownTaxPayable` 150.000; el pago por M14 asienta M-138; reprocesar `fis.obligation.created` no duplica; si M06 anula y recalcula la obligación por ARS 140.000 tras reabrirse la base de capital en M17, se registra el contraasiento y la nueva provisión; una exención del registro no genera asiento. |

## 18. Datos de precarga (demo, ficticios)

- Tenant **TEN-001** "Cooperativa Demo de Servicios" con ejercicio 2026 (01-01-2026 a 31-12-2026) abierto y 2027 planificado; períodos enero–septiembre cerrados.
- **PC-OPER-01** (operativo) con esqueleto: 1 Activo (1.1 Caja y bancos: Caja, Banco Demo cuenta corriente; 1.2 Créditos: Créditos por servicios, Deudores por refinanciación, Acreditaciones pendientes, Valores en cartera, Cupones de tarjeta, IVA crédito fiscal, Retenciones sufridas; 1.3 Bienes de cambio: Stock módems y materiales; 1.4 Bienes de uso: Rodados, Redes, Amortización acumulada); 2 Pasivo (Proveedores, Sueldos a pagar, Cargas sociales a pagar, IVA débito fiscal, Retenciones a depositar, Cobranzas por cuenta de terceros, Anticipos de asociados, Cobros no identificados, Capital a devolver, Intereses a devengar); 3 Patrimonio neto (Capital suscripto, Capital integrado, Ajuste de capital, Reserva legal, Fondos cooperativos, Reserva especial, Excedentes no asignados); 4 Ingresos (Ingresos Agua, Ingresos Internet, Intereses ganados, Recuperos); 5 Egresos (Costos operativos, Sueldos, Cargas sociales, Amortizaciones, Comisiones, Incobrables, RECPAM); 6 Orden (Equipos en comodato).
- **PC-ALT-01** (alternativo) con equivalencias a nivel de ingresos por servicio.
- Todos los roles de §14.2 asignados en PC-OPER-01.
- Centros **CC-AG**, **CC-INT**, **CC-ADM**, **CC-DIS** (Distribución; IVA computable 60 %); modelo **DIST-DEMO-25-75** (CC-ADM → CC-AG 25 %, CC-INT 75 %).
- Asociado **ASO-001** Ana Pérez con las facturas, cobros y saldo a favor de CU-CON-01 y CU-CON-02; **ASI-DEMO-001** (CU-22).
- Escenarios **SIM-ERP-001** (tarifa +10 %) y **SIM-CON-001** (reparto 50/50).
- Serie de índices "Índice demo" con valores ficticios 2025–2026 (base 100 en enero 2025).
- Presupuesto 2026 v1 aprobado por centro y mes; OC-DEMO-002 comprometida.
- Libro Diario N.º 3 rubricado ficticio.
- Usuarios demo con perfiles Contador, Auxiliar, Responsable de costos y Aprobador (sin credenciales reales).

## 19. Migración desde ProCoop

| Origen ProCoop | Destino | Transformación | Conciliación |
|---|---|---|---|
| `CTPLAN` | `chartOfAccounts` (`PC-PROCOOP`, operativo) + `ledgerAccounts` | Código de 11 dígitos → `code` y `legacy.displayKey` (antes `legacyCode`); jerarquía derivada de prefijos (5, 3, 1 dígitos) a `parentId`; naturaleza por prefijo (P508–P514) a `nature`; `AJU_CTA` → `inflationAdjustable`; `COD_SCC`, `DIG_VER` conservados; **no** se migran `SDO_CTA`, `SAL_INI`, `SAL_ACT`, `FEC_MOV` | Cantidad de cuentas; cuentas sin padre detectable listadas |
| `CTSRUBROS`, `CTPLAN_SUBRUBROS` | `accountRubrics` | Directo; `TIP_RUB` → `rubricType` | Conteo |
| `CTSECC_X_CTA` | `ledgerAccounts.allowedCostCenterIds` | Agrupar por cuenta | Conteo |
| `CTEJER` | `fiscalYears` | Estado por `ABIERTO`; `ID_ASIENTO_CIERRE1/2/APERTURA` → `closingEntries` | Ejercicios sin solapamiento (los que se solapan o contienen se informan) |
| `CTASIEN` + `CTITASIE` + `CTITASIE_SECCIONES` | `journalEntries` (`sourceType = migration`, `entryType` según `APERTURA`/`CIERRE` o `imported`) + `journalLines.allocations` | `COD_ASI` → `internalNumber`; `COD_AS` → `number`; `GRABO/REVISO/AUTORI` → `approval`; `FEC_REG` → `recordedAt`; renglones con secciones → `allocations` (porcentaje recalculado) | **Sumas y saldos por cuenta y ejercicio idénticos** entre ProCoop y CoopApps; asientos desbalanceados listados (no se corrigen en silencio) |
| `CIERRE` | `journalEntries` de cierre históricos | Vincular al ejercicio | Conteo |
| `CTSECCION`, `SECCION` | `costCenters` | `Porc_IVA_Compras` → `vatCreditablePct` | Conteo |
| `CTSECCION_GRUPOS`, `CTSECCION_GP_ASIGNA` | `costCenterGroups` | Directo | Conteo |
| `CTSECCION_ASIGNA`, `FPITEMS_CTSEC`, `BIENES_USO_CTSEC`, `CAT_INCI_CTSEC`, `GRPOBRA_CTSEC` | `costAllocationRules` (los `FPITEMS_CTSEC` de documentos históricos quedan en los renglones migrados) | `TIPO_OPERACION`/`TIPO_ELEMENTO` → enums | Porcentajes suman 100 por elemento |
| `CTCUENTA_ASIGNA` | `postingRules` | Una regla por fila con condiciones `grupo`, `tipo de factura`, `zona`, `rubro`, `rubro afectado` | Simulador sobre una muestra de facturas reproduce la cuenta de ProCoop |
| `SISCONT` | `externalLedgerMappings` o `postingRules` | Según `OPERACION` | Conteo |
| `RESULTA` | `resultTargets` | Prefijo → `match.codePrefix` | — |
| `RUBCAPI` | `capitalItems` (M17) + `entityAccountAssignments` `entityType: capitalRubric` (CTR-DAT-57; antes `capitalRubricAccounts`) | Directo | Rubro de producto en un solo rubro de capital |
| `TABINFL`, `INFLACIO` | `economicIndexSeries`, `economicIndexValues` de T04 (CTR-DAT-29; antes `inflationIndexSeries`, `inflationIndexValues`) | Directo | Meses faltantes listados |
| `VARIABLE` (54 cuentas `TIP_CTRL = 6`) | `accountRoles` (§14.2) | Código ProCoop → cuenta migrada; vacío queda sin asignar (validador) | 54 roles con estado |
| `VARIABLE` (fechas de cierre) | `accountingPeriods.moduleLocks` | Cada fecha → bloqueo inicial del módulo (PA-CFG-P4-03) | Fechas iguales |
| `VARIABLE` (resto CONTABILIDAD) | `accountingSettings` (§14.1) | Según T04b §5.8 | — |
| Columnas de cuenta de `PROVEED`, `BANKOS`, `ALI_IVA`, `TIPO_FAC`, `GRU_CON`, `RUB_PYS`, `RETS_TIPO`, `RETE_TIPO`, `TIP_VAL`, `CAT_BANC`, `SU_CONCEPTOS`, `SU_EMPRESAS`, `SU_SINDICATO`, `SU_ASIENTOS`, `GRPOBRA`, `CAT_INCI`, `RUBCAPI` | `entityAccountAssignments` | Por uso (§7.39) | Entidades sin cuenta listadas |
| `SU_ASIENTOS` | `entryTemplates` (`usage = payroll`) | Filtros de sueldos | — |
| `CTRLCNC` | Validaciones de M02/M05 (control de conceptos y productos por tipo) | Fuera de CON [VERIFICAR uso contable] | — |
| `CAT_INAES` | `inaesCategories` (M17) y `ledgerAccounts.inaesCategoryId` | Directo | — |

Corte: se migra el plan, la configuración y **todos los ejercicios históricos** disponibles (o desde el ejercicio que defina el tenant, mínimo el anterior al de arranque, para comparativos); el ejercicio en curso se migra hasta la fecha de corte y continúa en CoopApps (o en ProCoop durante el paralelo, según PA-CON-03). Prueba de aceptación: sumas y saldos al cierre de cada ejercicio migrado y al corte, por cuenta, con diferencia cero; mayor de 10 cuentas de control coincide movimiento a movimiento.

## 20. Contraposiciones

| CTR-ID | Fuente A | Fuente B | Resolución (prevalencia de la guía) |
|---|---|---|---|
| CTR-CON-01 | ProCoop contabiliza en lote desacoplado ("Cierre automático", RN-08 §6.1, §13.1) | BASE §22 y §75 piden asiento trazable de cada evento, sin duplicar | Tiempo real por evento con modo resumen configurable (PRM-CON-014); el lote se conserva como modo, idempotente (RN-CON-011). PA-CON-01. |
| CTR-CON-02 | ProCoop elimina asientos física e individualmente o en masa (RN-08 §5.2, §15.2) | Guía §5: los documentos económicos no se borran | Anulación lógica o contraasiento (RN-CON-013); solo borradores se eliminan. PA-CON-04. |
| CTR-CON-03 | Once fechas de cierre por módulo + P2528 (RN-09) | BASE §22 "bloquear períodos cerrados" con reapertura autorizada | Períodos con bloqueo por módulo (`accountingPeriods.moduleLocks`) y `periodGuard` (T04b §5.8 `con.periodLocks`). |
| CTR-CON-04 | 54 parámetros-cuenta globales (`TIP_CTRL = 6`) | Reglas por dimensión de BASE §75 | Roles de cuenta con overrides + reglas + asignaciones por entidad (T04b "Cuenta contable" → `postingRules`). |
| CTR-CON-05 | BASE §55 pide varios planes por cooperativa | Un libro oficial exige un único plan de registración | Un plan operativo por ejercicio; los demás son proyecciones (RN-CON-087). PA-CON-05. |
| CTR-CON-06 | DFA M19 ubica estados INAES en contabilidad | CAT §24 ubica `CAT_INAES` en institucional | `inaesCategories` es de M17; CON solo lo referencia en cuentas y plantillas. |
| CTR-CON-07 | Importación de ProCoop acepta asientos parciales y no valida período (RN-08 §15.2) | AGR-011 (integridad) | Todo o nada por archivo con validación previa (RF-CON-045). |
| CTR-CON-08 | Código de cuenta de 11 dígitos con jerarquía por prefijos (RN-08 §5.1) | Árbol explícito y máscara por plan | `parentId` explícito; el código es atributo visible y renumerable. |
| CTR-CON-09 | Naturaleza de la cuenta por prefijo (P508–P514) | Clasificación tipada | Atributo `nature` (T04b `accountType`). |
| CTR-CON-10 | Secciones "4" y "5" fijas como resultados en ProCoop (RN-08 §6.5) [VERIFICAR] | Centros configurables | Política de centros por cuenta (`costCenterPolicy`). |
| CTR-CON-11 | DEC-009 y maestro: núcleo contable en O5 | DFA nota (líneas 1250–1253): administración en etapa 4 (by-pass 01-07-2027), paralelo desde 01-03-2027 | Núcleo construido en O5 operando en plan no oficial durante el paralelo; oficialización en el by-pass. PA-CON-03. |
| CTR-CON-12 | BASE §57 deja activos, amortizaciones, presupuesto y personal como pendientes | DEC-007: todo ProCoop está en alcance | Se incluyen (presupuesto y compromisos O8; amortización en STK con asiento en CON). |
| CTR-CON-13 | FIC 18.2: sistema contable externo prioridad C (sube a B) | Nota DFA: posible exportación durante el paralelo | Exportación/importación en O8, adelantable si PA-CON-03 elige contabilidad externa. |
| CTR-CON-14 | ProCoop valoriza stock a demanda en el cierre (`btnValuacion`) | Costo perpetuo de STK (M13) | El costo llega en el evento de STK; el lote no revaloriza. |
| CTR-CON-15 | Eliminación masiva no revierte amortizaciones (defecto RN-08 §15.2) | Integridad de auxiliares (AGR-011) | Reversión con evento a STK (RN-CON-061). |
| CTR-CON-16 | Distribución por centros solo dentro del renglón (`CTITASIE_SECCIONES`) | BASE §75: distribución analítica de comunes sin duplicar gasto | Ambas: reparto en renglón + corridas analíticas con reclasificación opcional. |
| CTR-CON-17 | CU-22 muestra el asiento de pago digital en un paso | RN-05 (registración bancaria por ente en dos pasos) | Dos pasos con cuenta puente; el ejemplo de CU-22 es la suma (CU-22 §16). |
| CTR-CON-18 | T04b §5.8 llama `con.postingRules` a las 54 cuentas por defecto | Este anexo separa `accountRoles` (defecto) de `postingRules` (reglas condicionadas) | Misma semántica: el rol es una regla sin condiciones; las claves `con.postingRule.<rol>` de T04b se conservan como `roleKey`. |
| CTR-CON-19 | T05 §7.2 y §20 (CTR-DAT-29, 30, 31, 57) | Nombres de este anexo (`accountId` para cuenta contable, `companyId`, `bankAccountId`, `fileId`, `legacyCode`, `year`/`month`, `inflationIndexSeries`, `capitalRubricAccounts`) | Renombrados a `ledgerAccountId`, `legalEntityId`, `treasuryAccountId`, `storedFileId`, `legacy`, `period` + `sequence`; índices a `economicIndexSeries` de T04; rubros de capital a `capitalItems` (M17) + `entityAccountAssignments` (`capitalRubric`). T05 prevalece. |
| CTR-CON-20 | DEC-064 (contabilidad por entidad jurídica desde O0) | Modelo de este anexo con un solo juego de ejercicios y numeración por tenant | `legalEntityId` en ejercicios, períodos, asientos y libros; numeración por entidad y ejercicio; cuenta entre entidades (RF-CON-162, RN-CON-125, M-136). DEC prevalece. |
| CTR-CON-21 | T04 RF-CFG-136 (`legalEntityId` obligatorio en `chartOfAccounts`) y M05 RF-FAC-176 (`itemClass`) | Plan de cuentas compartido con `legalEntityIds` vacío = todas; roles de clase especial resueltos por concepto | `chartOfAccounts.legalEntityId` obligatorio + `sharedWithLegalEntityIds`; rol contable por `itemClass` (RN-CON-126, M-129, M-132, M-134, M-135); consumo de EVT-CFG-19. T04 y M05 prevalecen. |
| CTR-CON-22 | DEC-096 (entidad jurídica en `costCenters`) | Centros de costo del tenant sin entidad, usables en cualquier asiento | `costCenters.legalEntityId` obligatorio (dueña) + `sharedWithLegalEntityIds`, validado en cada imputación; migración de `CTSECCION` como compartida (RF-CON-081, RN-CON-127, ESC-CON-32). DEC prevalece. 10-11-2026: RN-CON-127 explicita cómo aplica el alcance por entidad de T02 a los centros (ningún centro sin dueña) y PAN-CON-24 muestra dueña y entidades compartidas. T02 RF-IAM-065 todavía describe "centros de costo compartidos sin `legalEntityId`", que contradice este modelo: queda para alinear en T02. |
| CTR-CON-23 | DEC-095 (obligaciones propias del tenant; base de capital de M17) | Sin contabilización de impuestos y contribuciones propias; solo M-51 genérico para el pago | Provisión M-137 desde `fis.obligation.created` con `ownTaxObligationId`, pago M-138, roles `ownTaxExpense`/`ownTaxPayable` y `entityType: ownTaxObligation` (RF-CON-163, RN-CON-128, ESC-CON-33). M06 decide importe y corresponde; DEC prevalece. 10-11-2026: el pago se lee de EVT-TES-15 `tes.paymentExecution.executed`, cuyo payload trae `taxObligation { taxObligationId, ownTaxObligationId, taxAgentRegistrationId, legalEntityId, tax, period }` (M14 CTR-TES-27, T11 §12.3); RF-CON-163, RN-CON-128 y M-138 citan el ID. 10-11-2026 (cierre): la reversión de M-137 se lee de EVT-FIS-26 `fis.obligation.cancelled` de M06; RN-CON-128, M-137 y §12.2 citan el ID. |

## 21. Preguntas abiertas

### PA-CON-01 — Modo y granularidad de contabilización

- **Pregunta**: ¿cada módulo contabiliza por operación en tiempo real o por resumen diario?
- **Contexto**: la facturación y la cobranza masivas generan decenas de miles de documentos por mes; ProCoop resume por lote (RN-08 §6.1); BASE §75 exige trazabilidad documento ↔ asiento.
- **Opciones**: A) Todo por operación en tiempo real. B) **(Recomendada)** Tiempo real por operación en ERP administrativo (compras, tesorería, stock, sueldos, capital) y resumen diario por servicio y concepto en facturación y cobranza masivas, con vínculo renglón → documentos. C) Todo por lote como ProCoop.
- **Impacto si no se responde**: se aplica B como default de PRM-CON-014.
- **Bloquea**: RF-CON-002, P-CON-02 (no bloquea el desarrollo).

### PA-CON-02 — Evento sin cuenta configurada

- **Pregunta**: ¿qué pasa con la operación de origen si falta una cuenta?
- **Opciones**: A) **(Recomendada)** No se bloquea el origen; el evento queda pendiente y bloquea el cierre del período. B) Se bloquea la operación de origen. C) Se imputa a una cuenta puente.
- **Impacto si no se responde**: A (PRM-CON-028). **Bloquea**: RN-CON-022, P-CON-01.

### PA-CON-03 — Contabilidad durante el paralelo con ProCoop

- **Contexto**: DEC-009 adelanta el núcleo contable a O5; la nota del DFA prevé el by-pass administrativo el 01-07-2027 con paralelo desde el 01-03-2027.
- **Opciones**: A) **(Recomendada)** La contabilidad oficial sigue en ProCoop hasta el by-pass; CoopApps contabiliza todo en un plan marcado no oficial y concilia contra ProCoop; se oficializa en el by-pass. B) CoopApps es oficial desde O5 y exporta a ProCoop. C) Exportar a un sistema externo del estudio durante el paralelo.
- **Impacto si no se responde**: A. **Bloquea**: plan de corte de T07, CTR-CON-11.
- **Estado**: Respondida (DEC-069): opción A. La contabilidad oficial sigue en ProCoop hasta el corte administrativo; CoopApps contabiliza en un plan marcado no oficial, concilia contra ProCoop y se oficializa en el corte.

### PA-CON-04 — Anulación y eliminación de asientos

- **Opciones**: A) **(Recomendada)** Borradores eliminables; contabilizados de período abierto no transcripto → anulación lógica; resto → contraasiento. B) Solo contraasiento siempre. C) Eliminación física en período abierto (como ProCoop).
- **Impacto si no se responde**: A (PRM-CON-007). **Bloquea**: RN-CON-013, RF-CON-046.

### PA-CON-05 — Más de un plan oficial

- **Opciones**: A) **(Recomendada)** Un plan operativo por ejercicio; los demás analíticos por equivalencias. B) Doble registración oficial en dos planes. C) Plan regulatorio como oficial.
- **Impacto si no se responde**: A. **Bloquea**: RF-CON-103–RF-CON-111.

### PA-CON-06 — Marco normativo de estados contables

- **Opciones**: A) **(Recomendada)** Normas contables profesionales FACPCE aplicables a cooperativas (RT 24 y vigentes [VERIFICAR]) y requisitos INAES, en plantilla versionada validada por el contador. B) Solo formato INAES. C) Plantilla libre por tenant.
- **Impacto si no se responde**: A con plantilla editable (PRM-CON-047). **Bloquea**: RF-CON-112–RF-CON-126 (estados).

### PA-CON-07 — Ajuste por inflación

- **Opciones**: A) **(Recomendada)** Ajuste integral al cierre del ejercicio en CoopApps, con opción mensual. B) Solo mensual. C) No se calcula en CoopApps (lo hace el estudio).
- **Impacto si no se responde**: A (PRM-CON-035). **Bloquea**: RF-CON-127–RF-CON-131.

### PA-CON-08 — Libros rubricados

- **Opciones**: A) **(Recomendada)** Hojas rubricadas en papel y libros digitales cuando el organismo de la jurisdicción lo admita. B) Solo papel. C) Solo digital.
- **Impacto si no se responde**: A con papel por defecto (PRM-CON-048). **Bloquea**: RF-CON-136–RF-CON-138.

### PA-CON-09 — Control presupuestario

- **Opciones**: A) Solo informativo. B) **(Recomendada)** Advertir y exigir autorización para exceder. C) Bloquear.
- **Impacto si no se responde**: B (PRM-CON-041). **Bloquea**: RF-CON-143–RF-CON-149.

### PA-CON-10 — Momento del asiento de cobros en caja

- **Opciones**: A) **(Recomendada)** Al confirmar el pago; el cierre de período exige cajas cerradas. B) Al cerrar la caja (como ProCoop con P3100). C) Al rendir a tesorería.
- **Impacto si no se responde**: A (PRM-CON-025, PRM-CON-024). **Bloquea**: RF-CON-064.

### PA-CON-11 — Provisiones automáticas

- **Opciones**: A) **(Recomendada)** SAC, vacaciones e incobrables automáticos y configurables. B) Solo manuales. C) Solo incobrables.
- **Impacto si no se responde**: A (PRM-CON-037). **Bloquea**: JOB-CON-21.

### PA-CON-12 — Alcance del presupuesto

- **Opciones**: A) **(Recomendada)** Presupuesto económico por cuenta, centro y servicio con compromisos de compras en O8; financiero (flujo de fondos) en una etapa posterior. B) Económico y financiero en O8. C) Solo informes de comparación.
- **Impacto si no se responde**: A (PRM-CON-043). **Bloquea**: RF-CON-143–RF-CON-149.

### PA-CON-13 — Cuentas de orden en el cierre

- **Opciones**: A) **(Recomendada)** Se incluyen en el cierre patrimonial y se reabren en la apertura. B) Deben estar en cero para cerrar (como la validación de ProCoop). C) Se excluyen del cierre.
- **Impacto si no se responde**: A (PRM-CON-012). **Bloquea**: P-CON-05.

### PA-CON-14 — Ingresos devengados no facturados

- **Opciones**: A) **(Recomendada)** Provisión al cierre configurable (desactivada por defecto) con reversión automática. B) Siempre. C) Nunca.
- **Impacto si no se responde**: A (PRM-CON-038). **Bloquea**: M-13.

### PA-CON-15 — Plan y reglas modelo de plataforma

- **Pregunta**: ¿CoopApps ofrece un plan de cuentas y reglas modelo para cooperativas de servicios?
- **Opciones**: A) **(Recomendada)** Sí, plantilla de plataforma validada por un contador, copiada al tenant y luego propia. B) Cada tenant arma su plan. C) Plan único obligatorio para todos.
- **Impacto si no se responde**: A (PRM-CON-058). **Bloquea**: RN-CON-110, precarga de tenants nuevos.

### PA-CON-16 — Servicio obligatorio en cuentas de control

- **Opciones**: A) **(Recomendada)** Obligatorio en créditos por servicios, ingresos y costos directos. B) Opcional. C) Obligatorio en todas las cuentas de resultado.
- **Impacto si no se responde**: A (PRM-CON-059). **Bloquea**: RN-CON-108, conciliación por servicio (RF-CON-093).

### PA-CON-17 — Venta del derecho de sepultura: ingreso del período o diferido (HUECO-CEM-04)

- **Pregunta**: ¿Cómo se reconoce el ingreso por la venta (adquisición) del derecho de sepultura, y cómo el mantenimiento?
- **Contexto**: el derecho se formaliza en M18 (EVT-SOC-05) y se factura por M05 con un concepto del catálogo; la ficha CEM de T12 parte 2 deja sin definir si el ingreso es del período o diferido. El tratamiento de IVA lo define M06 por la clase del concepto; M15 no lo decide. ProCoop no tiene un tratamiento relevado.
- **Opciones**: A) **(Recomendada)** Ingreso del período al otorgar el derecho (M-134); el mantenimiento como ingreso periódico por la facturación general (M-01); IVA según la clase del concepto en M06. Requiere validación con el contador de la cooperativa piloto. B) Ingreso diferido (`rol:burialRightDeferredRevenue`) devengado mensualmente durante la vigencia del derecho (M-135, JOB-CON-23); la extinción anticipada devenga el saldo.
- **Estado**: Asumida la recomendada (DEC-072) salvo respuesta del solicitante. Se implementa como comportamiento configurable: PRM-CON-193 = `atGrant` por defecto; `deferredOverTerm` habilita la opción B sin cambios de código (RN-CON-124).
- **Impacto si no se responde**: A (PRM-CON-193). **Bloquea**: M-134, M-135, RN-CON-124, ficha CEM de T12 parte 2.

### PA-CON-18 — Colección del modelo de centro de costo (PA 10 del pendiente de cierre)

- **Pregunta**: ¿`costCenterModelId` (en `accountRoles`, `postingRules` y plantillas de asiento) apunta a una colección propia o es un código?
- **Contexto**: el campo existía sin colección destino; T05 §7.2 lo marcaba `[VERIFICAR]` y este anexo apuntaba a `distributionModels` con duda.
- **Opciones**: A) **(Recomendada)** M15 declara la colección `costCenterModels` (§7.19.1) con reparto fijo o delegado en un modelo de distribución. B) `costCenterModelId` como código sin colección.
- **Estado**: Asumida la recomendada (DEC-072). T05 agrega la colección `costCenterModels` (M15) y la referencia de `costCenterModelId`. No cambia ninguna ola de RF.
- **Impacto si no se responde**: A. **Bloquea**: §7.5, §7.6, §7.19.1; T05 §7.2.

### PA-CON-19 — Residuales del 05-11-2026 (estados, referencias, nombres de campo y eventos de M17)

- **Pregunta**: ¿Cómo se cierran los residuales de M15 que detectaron los entregables regenerados?
- **Contexto**: el índice de estados marcó sin estado inicial a `chartOfAccounts`, `fiscalYears`, `postingBatches`, `accountingPeriods`, `budgets` y `reconciliationRuns`, mezcló en `costDistributionRuns` los valores del §8.7 de otras dos colecciones y dejó `journalLines.entryStatus` sin transiciones; T05 nombra `ledgerAccountId`, `number`, `chartId`, `fileLayoutId` y otros campos clave que este §7 no tenía o llamaba distinto; M17 renombró sus eventos de capital y excedentes a camelCase (PA-INS-13).
- **Opciones**: A) **(Recomendada)** Declarar el estado inicial de cada máquina; calificar con su colección cada frase del §8.7 y §8.9; tabla de `journalLines.entryStatus` como copia de §8.1; adoptar los nombres de T05 con "antes"; `seriesId` → `economicIndexSeries` (T04); consumir los eventos de M17 con el nombre nuevo (el viejo queda como alias). B) Mantener el texto y resolver en los entregables.
- **Estado**: Asumida la recomendada (DEC-072). Los campos nuevos de `rubricatedBooks` (`fiscalYearId`, `volume`, `storedFileId`) y de `costDistributionRuns` (`number`, `distributionModelId`) siguen a T05; `volume` y la semántica de `distributionModelId` deben validarse con el contador piloto.
- **Sincronización (5-11-2026), Asumida (DEC-072):** `entityAccountAssignments.entityType` admite `vatRate` y `taxDefinition` (antes `tax`) con las cuentas que M06 deja de guardar en `vatRates` y `taxDefinitions`; `entityId` es polimórfica según `entityType` (antes `identities` de T02).
- **Impacto si no se responde**: A. **Bloquea**: §7.10, §7.11, §7.14, §7.20, §7.24, §7.31 a §7.33, §7.37, §8, §9.1 (M-105 a M-114).

## 22. Trazabilidad

### 22.1 BASE y acuerdos

| Fuente | IDs de este anexo |
|---|---|
| BASE §22 (CU-22, asiento por prestación, bloqueo de períodos) | RF-CON-001, RF-CON-031, RF-CON-032, RF-CON-051–RF-CON-080, RF-CON-090; RN-CON-001–RN-CON-021; CU-22; M-22, M-23; CTR-CON-01, CTR-CON-17 |
| BASE §33 (glosario contable) | §3 |
| BASE §34 (escenarios 27, 40, 71, 74) | §17 ESC-01–ESC-05, ESC-CON-06–ESC-CON-22 (ESC-CON-23–ESC-CON-27 provienen de huecos de cobertura) |
| BASE §39.6, §42.6 (perfil Contable, MT-006), USR-CON-A | §4 |
| BASE §40.3 paso 12 | P-CON-04 (cierre mensual) |
| BASE §55 (ERP-001–ERP-003, CU-ERP-01) | RF-CON-007–RF-CON-011, RF-CON-103–RF-CON-111; CU-ERP-01; CTR-CON-05 |
| BASE §57 (pendientes) | RF-CON-143–RF-CON-149; CTR-CON-12 |
| BASE §61 (contabilidad de retenciones, CU-FIS-01) | M-48, M-51; CU-FIS-01 |
| BASE §75 (CON-001–CON-005, CU-CON-01) | RF-CON-081–RF-CON-102; RN-CON-070–RN-CON-079, RN-CON-108; CU-CON-01; P-CON-07, P-CON-08 |
| BASE §76 (pendientes) | PA-CON-01–PA-CON-16 (PA-CON-17 proviene de HUECO-CEM-04) |
| BASE §78 (OPE-001–OPE-004, CU-OPE-01) | M-55–M-60; CU-OPE-01; RF-CON-143–RF-CON-149 |
| BASE §87 (compra de energía y costos) | M-08, M-50, M-57, M-126, M-127; RN-CON-121 |
| HUE-ELE-01, HUE-GAS-04 (compra mayorista de energía y gas) | M-126, M-127; RN-CON-121; PRM-CON-186, PRM-CON-187 |
| HUE-TV-01 (derechos de señales) | M-128; RN-CON-121; PRM-CON-188 |
| HUECO-SEP-03 (subsidio por fallecimiento) | M-129–M-131; RN-CON-122; PRM-CON-189–PRM-CON-191, PRM-CON-194 |
| HUECO-OTR-04 (depósito en garantía) | M-132, M-133; RN-CON-123; PRM-CON-169 |
| HUECO-CEM-04 (venta del derecho de sepultura) | PA-CON-17; M-134, M-135; RN-CON-124; PRM-CON-192, PRM-CON-193; JOB-CON-23 |
| DEC-058 (estrategia de sueldos) | Encabezado (olas O8/O9); nota de §9.1.9 |
| DEC-064 / DEC-087 (entidad jurídica) | §7 (convenciones), §7.2, §7.8, §7.9, §7.12, §7.13; RF-CON-162; RN-CON-125; M-136; PRM-CON-195; ESC-CON-28, ESC-CON-30; CTR-CON-20, CTR-CON-21; EVT-CFG-19 consumido |
| M05 RF-FAC-176 / RN-FAC-156 (`itemClass`) | RN-CON-126; M-129, M-132, M-134, M-135; ESC-CON-31; CTR-CON-21 |
| DEC-096 (entidad jurídica en centros de costo) | §7 (convenciones), §7.16; RF-CON-081; RN-CON-127 (incluye alcance por entidad de T02); PAN-CON-24; ESC-CON-32; CTR-CON-22 |
| DEC-095 (obligaciones propias; base de capital de M17) | §7.39 (`entityType: ownTaxObligation`); RF-CON-163; RN-CON-128; M-137, M-138; §12.2 (EVT-FIS-26 `fis.obligation.cancelled`); PRM-CON-196, PRM-CON-197; ESC-CON-33; CTR-CON-23 |
| DEC-069 (contabilidad durante la convivencia) | PA-CON-03 (Respondida); RF-CON-140 |
| RN-FIS-124 (aporte de capital, M06) | M-02; RN-CON-104; ESC-CON-29 |
| EVT-SOC-04 / EVT-SOC-05 (M18) | M-130, M-135; §12.2 |
| T05 §20 (CTR-DAT-29, 30, 31, 57) | §7, §7.13, §7.15, §7.29/7.30, EVT-CON-07, §19; CTR-CON-19 |
| HUECO-CAP-01 (ola del capital) | RF-CON-098, RF-CON-150, RF-CON-151 (O5); RF-CON-161 (O10) |
| BASE §97.4 (terceros), §97.7 (capital), §97.12 | M-31, M-50, M-105–M-115; RF-CON-150–RF-CON-152 |
| BASE §98, §101, §106 (pendientes) | PA-CON-03, PA-CON-06; M-26 (imputación de pagos parciales agrupados, FAC-008) |
| BASE §100 MER-006 (incobrables), MER-009, MER-011 (excedentes) | M-40–M-43, M-113, M-114; RN-CON-105; PRM-CON-060; CU-CON-15 |
| BASE §102.5.1, §102.5.3 | §2; RF-CON-052 |
| BASE §104 (SUE-010, SUE-014, CU-104) | M-96–M-103; CU-104; PRM-CON-040 |
| BASE §105 (solución ERP), §107 P-016 | Encabezado; PA-CON-03 |
| AGR-002 | RF-CON-052; §2 |
| AGR-009 | RF-CON-006; RN-CON-109; PRM-CON-017 |
| AGR-011 | RN-CON-092, RN-CON-112; P-CON-08; CTR-CON-07, CTR-CON-15 |
| AGR-012 | RN-CON-118; M-25 |
| AGR-015 | P-CON-05 |
| AGR-022 | §15 (corte de datos) |
| AGR-026 | §10 (pantallas CNX) |
| AGR-028 | RN-CON-103, RN-CON-115; M-55, M-94; PRM-CON-042 |
| AGR-029 | RN-CON-104; M-02 |
| AGR-030 | RN-CON-116; PRM-CON-045 |

### 22.2 DFA, FIC y reglas de negocio ProCoop

| Fuente | IDs |
|---|---|
| DFA M19 asientos (`CTASIEN`, `CTITASIE`, `CTITASIE_SECCIONES`), Mayor, Balance, Sumas y saldos | RF-CON-035–RF-CON-050, RF-CON-112–RF-CON-126; PAN-CON-12, PAN-CON-13, PAN-CON-20, PAN-CON-21 |
| DFA M19 plan (`CTPLAN`, `CTPLAN_SUBRUBROS`, `CTSRUBROS`), ejercicios (`CTEJER`), secciones | RF-CON-007–RF-CON-034, RF-CON-081–RF-CON-091 |
| DFA M19 asientos automáticos (`CTCUENTA_ASIGNA`, `*_CTSEC`) | RF-CON-051–RF-CON-080; §9.1 |
| DFA M19 `CAT_INAES`, herramientas, informes, `SISCONT`; mejoras (tiempo real, cierre con bloqueo, estados INAES) | RF-CON-019, RF-CON-139–RF-CON-142; CTR-CON-01, CTR-CON-03, CTR-CON-06 |
| DFA nota de etapas (líneas 1250–1253) | PA-CON-03; CTR-CON-11 |
| FIC 18.2 (sistema contable externo) | RF-CON-139–RF-CON-142; JOB-CON-12, JOB-CON-13; §13; CTR-CON-13 |
| RN-08 §1.1–§1.4 (fechas de cierre, prefijos, parámetros) | RF-CON-027–RF-CON-034; §14.4 |
| RN-08 §5.1–§5.5 (plan, asientos, cierres, ajuste por inflación) | RF-CON-007–RF-CON-050, RF-CON-127–RF-CON-135; RN-CON-001–RN-CON-021, RN-CON-080–RN-CON-086, RN-CON-100 |
| RN-08 §6.1–§6.7 (cierre automático por módulo) | RF-CON-051–RF-CON-080; RN-CON-022–RN-CON-069; §9.1, P-CON-02 |
| RN-08 §9 (bienes de uso) | M-69–M-73; RF-CON-072 |
| RN-08 §10.4, §11.5, §12.3 (financiaciones, sueldos, parámetros) | M-37–M-39, M-96–M-99; RN-CON-058; §14 |
| RN-08 §13 (implicancias 1–11) | CTR-CON-01–CTR-CON-17 |
| RN-08 §14 (dudas 1, 7, 8, 13, 14) | PA-CON-01, PA-CON-07, PA-CON-10; CTR-CON-14; [VERIFICAR] de §6 |
| RN-08 §15.2 clases (`clsAsiento`, `clsAsignarCuentasYRubros`, `clsCtEjer`, `clsCuentas_Asignadas`, `clsContabilidad`, `clsCierreDiario`, `clsInformes_Contabilidad` con DGR y OCEBA e indicadores) | RF-CON-020, RF-CON-024, RF-CON-027, RF-CON-045–RF-CON-047, RF-CON-054; RN-CON-022; §15 (indicadores y OCEBA); informes DGR → M06 (§14.3) |
| RN-08 §15.1, §15.3, §15.4 (`RegistrarResBan`, eliminación de bienes, `clsRevaluacion`), §15.6 | RF-CON-049; RN-CON-061, RN-CON-101, RN-CON-107 |
| RN-05 (registración bancaria por ente) | M-22, M-23; CTR-CON-17 |
| RN-06 (`ConservarCapital`) | RN-CON-104; M-111 |

### 22.3 Parámetros RN-09 / T04b §5.8 CONTABILIDAD (87)

| V2 # | Destino |
|---|---|
| 67, 432, 500, 502, 504, 505, 506, 2376, 2528, 2778 | `accountingPeriods.moduleLocks` (§7.13, §14.4); PAN-CON-11; API-CON-31–API-CON-35 |
| 508, 509, 510, 511, 512, 514 | Atributo `nature` (§7.4, §14.4); 512 también PRM-CON-012 |
| 513 | PRM-CON-101 `resultAllocation` |
| 2101, 2102, 2103, 2104, 2105, 2106, 2107, 2108, 2109, 2110, 2111, 2112, 2113, 2114 | PRM-CON-102 a PRM-CON-115 (una fila por número en §14.2) |
| 2118, 2119, 2121, 2122 | PRM-CON-116 a PRM-CON-119 |
| 2125, 2126, 2127, 2128, 2129, 2130, 2131 | PRM-CON-120 a PRM-CON-126 |
| 2133, 2134, 2135, 2136, 2137, 2138, 2139 | PRM-CON-127 a PRM-CON-133 |
| 2141 | PRM-CON-134 |
| 2148, 2149, 2150, 2151, 2152, 2153, 2154, 2155, 2156 | PRM-CON-135 a PRM-CON-143 |
| 2158, 2159, 2160, 2161, 2162, 2163, 2164, 2165, 2166, 2167 | PRM-CON-144 a PRM-CON-153 |
| 3141 | PRM-CON-154 |
| 2190 | PRM-CON-020 |
| 2191 | PRM-CON-021 |
| 2547 | PRM-CON-003 |
| 2548 | PRM-CON-026 |
| 2619 | PRM-CON-022 |
| 2714 | PRM-CON-004 |
| 2734 | PRM-CON-027 |
| 2814 | §14.4 (Reemplazado: columnas del `DataTable`) |
| 2924, 2935 | §14.3, §14.4 (migrados a M06) |
| 2936 | PRM-CON-033 |
| 2978 | PRM-CON-006 |
| 2982 | PRM-CON-032 |
| 3028 | §14.4 (Reemplazado: idempotencia, RN-CON-011) |
| 3061 | PRM-CON-023 |
| 3076 | PRM-CON-034 |
| 3100 | PRM-CON-024 |

Total: 10 fechas + 6 prefijos + 54 cuentas + 17 de comportamiento = 87. Parámetros de otras secciones con efecto contable: §14.3 (73, 2636, 2916, 2738, 308, 310, 110, 2388, 2034, 2035, 2902, 3068, 2341, 2722, 2723, 2076, 2288, 2384, 2517, 2207, 2538, 755, 2670, 543, 2008, 2010, 2445, 2446, 2353, 519, 2823, 2264), 2890 → PRM-CON-030, 580 y 2308 → §14.4; fechas 501 y 2785 → `moduleLocks` (facturación y capital). `TipoCuenta` 2120, 2123, 2124 → overrides de PRM-CON-130. `TIP_CTRL = 6` (RN-09 §2.1) → tipo `accountRef` de §14.2.

### 22.4 Tablas CAT

| Tabla | Destino | Requisitos |
|---|---|---|
| `CAT_INCI_CTSEC` | `costAllocationRules` (incidente) | RF-CON-085; RN-CON-076; M-78 |
| `CIERRE` | `journalEntries` de cierre históricos (§19) | RF-CON-132; P-CON-05 |
| `CTASIEN` | `journalEntries` (§7.8) | RF-CON-035–RF-CON-040; RN-CON-021, RN-CON-117 |
| `CTCUENTA_ASIGNA` | `postingRules` (§7.6) | RF-CON-053; RN-CON-035 |
| `CTEJER` | `fiscalYears` (§7.12) | RF-CON-027; RN-CON-081 |
| `CTITASIE` | `journalLines` (§7.9) | RF-CON-035–RF-CON-037 |
| `CTITASIE_SECCIONES` | `journalLines.costAllocations` | RF-CON-081–RF-CON-084; RN-CON-073 |
| `CTPLAN` | `chartOfAccounts` + `ledgerAccounts` (§7.2, §7.4) | RF-CON-010–RF-CON-016, RF-CON-155; RN-CON-087, RN-CON-092, RN-CON-112 |
| `CTPLAN_SUBRUBROS` | `accountRubrics` (subrubro) | RF-CON-013 |
| `CTRLCNC` | Fuera de CON: control de conceptos/productos por tipo en M02/M05 [VERIFICAR uso contable] | §19 |
| `CTSECCION` | `costCenters` (§7.16) | RF-CON-068, RF-CON-081; RN-CON-044 |
| `CTSECCION_ASIGNA` | `costAllocationRules` (§7.18) | RF-CON-083; RN-CON-071, RN-CON-078 |
| `CTSECCION_GP_ASIGNA` | `costCenterGroups.costCenterIds` | RF-CON-082 |
| `CTSECCION_GRUPOS` | `costCenterGroups` (§7.17) | RF-CON-082 |
| `CTSECC_X_CTA` | `ledgerAccounts.allowedCostCenterIds` | RF-CON-015; RN-CON-075 |
| `CTSRUBROS` | `accountRubrics` (rubro) | RF-CON-013 |
| `FPITEMS_CTSEC` | Centros por ítem de compra (en el evento de CMP) | RF-CON-068, RF-CON-085; RN-CON-076; M-57 |
| `GRPOBRA_CTSEC` | `costAllocationRules` (obra) | RF-CON-085; RN-CON-076; M-79 |
| `GRU_CON` | `entityAccountAssignments` (`collectionAccountingGroup`) | RF-CON-150; RN-CON-028; PRM-CON-021 |
| `INFLACIO` | `economicIndexValues` de T04 (§7.30, CTR-DAT-29) | RF-CON-127 |
| `RESULTA` | `resultTargets` (§7.14) | RF-CON-026; PRM-CON-056 |
| `SECCION` | `costCenters` | RF-CON-081 |
| `SISCONT` | `externalLedgerMappings` / `postingRules` | RF-CON-053, RF-CON-139 |
| `TABINFL` | `economicIndexSeries` de T04 (§7.29, CTR-DAT-29) | RF-CON-127 |
| `BIENES_USO_CTSEC` | `costAllocationRules` (bien de uso) | RF-CON-072, RF-CON-085; M-69, M-70 |
| `RUBCAPI` | `capitalItems` de M17 (rubro) + `entityAccountAssignments` `entityType: capitalRubric` (§7.15, §7.39; CTR-DAT-57) | RF-CON-025, RF-CON-150 |
| `CAT_INAES` | `inaesCategories` (M17) | RF-CON-019; CTR-CON-06 |
| `SU_ASIENTOS`, `SU_CONCEPTOS`, `SU_SINDICATO`, `SU_EMPRESAS` | `entryTemplates`, `entityAccountAssignments` | RF-CON-041; RN-CON-032; M-96 |
| `ALI_IVA`, `RETS_TIPO`, `RETE_TIPO`, `TIP_VAL`, `TIPO_FAC`, `CAT_INCI`, `GRPOBRA`, `RUB_PYS`, `BANKOS`, `CAT_BANC`, `PROVEED` | `entityAccountAssignments` (§7.39) | RN-CON-022–RN-CON-041 |
| `CAPITAL`, `CAPITAL_RES` | Auxiliar de M17 | M-105–M-112 |
| `BIENES_USO`, `BIENES_USO_AMORT`, `BIENES_USO_DISM`, `BIENES_USO_HST` | Auxiliar de M13 | M-69–M-73 |

### 22.5 Inventario ProMod_Contabilidad

| Formulario / tipo | Destino |
|---|---|
| `Estado_AsientoDetalle` | PAN-CON-13 (estado y detalle); RF-CON-037 |
| `abm_Asiento_Personalizado` | PAN-CON-14; RF-CON-041 |
| `abm_CtEjer` | PAN-CON-10; RF-CON-027 |
| `abm_CtPlan` (`btnUinificar`, `cboAjustable`, `cboImputable`, `chkVista`, `Show_Imprimir`) | PAN-CON-04, PAN-CON-06; RF-CON-014, RF-CON-021, RF-CON-022 |
| `abm_CtSeccion` (`cmdCategorias`) | PAN-CON-24; RF-CON-081 |
| `abm_CtsRubros` | PAN-CON-05; RF-CON-013 |
| `abm_Resulta` | PAN-CON-31; RF-CON-026 |
| `abm_Rubcapi` | PAN-CON-38; RF-CON-025 |
| `abm_Tabinfl` | PAN-CON-29; RF-CON-127 |
| `frmAsientos` | PAN-CON-12; RF-CON-035, RF-CON-036 |
| `frmAsientos_Detalle` | PAN-CON-13; RF-CON-035 |
| `frmAsignarCuentasYRubros` | PAN-CON-09; RF-CON-024 |
| `frmCierreDiario` (todas sus opciones) | PAN-CON-17, PAN-CON-30; RF-CON-003, RF-CON-062; JOB-CON-02 |
| `frmCierreDiario_Resultado` | PAN-CON-17; RF-CON-063 |
| `frmEliminacionMasiva` | PAN-CON-18; RF-CON-046; JOB-CON-17 |
| `frmExportarSIRCAR` | Absorbido por M06 FIS (exportación fiscal) |
| `frmImpresiones` | PAN-CON-22; RF-CON-112–RF-CON-126 |
| `frmImprimirHojasRubricar` | PAN-CON-23; RF-CON-113, RF-CON-136; RN-CON-102 |
| `frmInformeAnticiposAUnaFecha` | PAN-CON-39; RF-CON-101 |
| `frmMayor` | PAN-CON-20; RF-CON-114 |
| `frmRenumerar` | PAN-CON-19; RF-CON-047 |
| `frmRenumerarCuentas` | PAN-CON-06; RF-CON-020 |
| `frmSumasySaldos` | PAN-CON-21; RF-CON-115 |
| `frm_AsignarSeccion` | PAN-CON-25; RF-CON-083, RF-CON-084 |
| `TipoCambio` | Absorbido por M14 TES (cotizaciones); CON consume `tes.exchangeRate.published` (RF-CON-049) |
| `Resources` | Descartado (recursos técnicos de WinForms) |
| Tipos anónimos y `<>c` | Descartado (artefactos del compilador) |

### 22.6 Dependencias con otros anexos

T01 (tenant, plataforma, plantillas), T02 (capabilities, accesos externos con vencimiento), T03 (diccionario, marca de reportes), T04 y T04b (configuración versionada; catálogo de parámetros §5.8), T06 (outbox, integraciones, bandeja), T07 (migración §19), T08 (no funcionales, conservación), T09 (notificaciones), T10 (reportes e indicadores), T11 (workflow de aprobaciones y expediente); M01 (grupo contable de cuentas), M02 (servicios y conceptos), M04 (tarifas para provisiones e hipótesis), M05 (facturación), M06 (IVA, retenciones, terceros, regulatorios), M07 (cobranza y auxiliar de asociados), M08 (mora, convenios, incobrables), M10 (OT, obras, horas), M11 (ventas), M12 (compras y compromisos), M13 (stock, costos, bienes de uso, fabricación), M14 (tesorería, bancos, cotizaciones, períodos de caja), M16 (sueldos), M17 (capital, excedentes, asamblea, `inaesCategories`), M18 (vivienda), M19 (publicación de estados si se decide).
