# M08 MOR — Mora, intereses, suspensión, corte, reconexión, financiación y convenios, garantías, incobrables, gestión judicial y prescripción

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Estado | Especificación consolidada — pendiente de validar preguntas abiertas |
| Solución (BASE §105) | ERP (núcleo de mora y financiación) / Cobranza (cotización de recargo en caja, entes y pasarelas) / CRM (expedientes de gestión, promesas, contactos) / Landing-autogestión (deuda, avisos, simulador y aceptación de convenios, suspensión y reactivación) / APIs |
| Olas | **O6** (principal; cierre del piloto Internet extremo a extremo). Prerrequisitos adelantados: O4 (recargo entre vencimientos al emitir), O5 (cotización de recargo por mora en caja y diferimiento). Extensiones: O7 (particularidades de servicios medidos: electricidad, agua, gas, telemedición), O8 (interés sobre valores diferidos, efectos contables completos de incobrables), O10 (telefonía/TV), O11 (BI avanzado y migración repetible). |
| Dueño de datos | Políticas de interés y de mora; tablas de tasas e índices de recargo; esquemas de recargo entre vencimientos; descuentos por pronto pago; cálculos de interés (cotizaciones y liquidaciones con detalle por tramo); intereses diferidos; corridas de intereses a facturar; bloqueos de comprobantes y sus causas; instancias, lotes, notificaciones de mora y su bitácora; promesas de pago; excepciones de mora; protecciones normativas acreditadas; matriz de restricciones de suspensión; causas; evaluaciones de mora; casos de interrupción del servicio (suspensión, corte, reconexión, baja por mora, suspensión voluntaria, reactivación); reglas de cargos de suspensión/reconexión; planes de pago y tipos de financiación; planes de las entidades financieras (la entidad es `financialInstitutions` de M14, CTR-DAT-43); simulaciones y convenios con sus obligaciones incluidas, cuotas, firmantes y firmas; garantías y garantes; expedientes de gestión externa y judicial; estudios/agencias; incobrables; reglas y corridas de prescripción. |
| Fuentes consolidadas | BASE §14 (gestión de deuda y acuerdos, CU-14), §23 (criterio venta financiada vs. regularización), §52.3 (bajas y costos), §53 (CIC-001 a CIC-004, CU-CIC-01), §57, §68 (CTA-001 a CTA-004, CU-CTA-01), §70, §71, §86 a §91 (suspensión/corte/baja propios de Internet, electricidad, agua, gas, cementerio parque, banco de sangre), §97.3, §98, §101, §106, MER-005, MER-006, MER-019; AGR-003, AGR-011, AGR-014, AGR-024; DFA Módulo 11 y Módulo 12, DFA proceso "Mora" (§ procesos 4.1 a 4.6); REL §6 "Tablas relacionadas a Gestión de Mora"; RN-04 §1 a §14 completo; RN-07 §4 (cortes y reconexiones desde técnica); CAT §8 (mora y notificaciones) y §9 (financiación y convenios); V2 grupos GESTION_DE_MORA (23 parámetros) y FINANCIACIONES (21 parámetros) completos, y de COBRANZA los de recargos, intereses, notificados, bloqueos y reconexión; V2 sueltos citados por RN-04 (74, 578, 273, 2292, 1008, 2283, 733, 339, 2109, 713, 2089, 2289, 2512, 2607, 2624, 757, 2086, 2330, 2440, 2531, 2483, 2485, 2661, 2694, 2707, 2787, 2907, 3112, 3113, 3116, 3135, 3138, 3162, 2770, 2771, 2984, 2301, 388); INV `ProMod_GestionMora.md` (16 formularios); CNX §2.4 (alcance), §3.1 y §4.1 (tokens de PWA y admin). |


> **Norma de implementación (DEC-111, DEC-112, DEC-110, DEC-113).** Construcción GoodApps: **.NET 10**, **ASP.NET Core**, **EF Core**, **Azure SQL** (base compartida, `TenantId` en tablas de negocio), front **React 19**, **Microsoft Azure** (Container Apps, Blob, Queue, Key Vault, Application Insights), identidad **OpenIddict**. Modelo físico: `07-modelo-relacional-azure-sql.md` y `07-catalogo-tablas-sql.md`. Checklist e impacto: `06-impacto-adaptacion-stack-goodapps.md` (**DIR-13**).
>
> **Lectura:** «colección» en este anexo = **entidad lógica**; tablas, columnas y FK en `07-*`. RF/RN/CU del anexo **no cambian** por el stack.


## 1. Objetivo

Especificar, sin necesidad de otra fuente, el módulo que:

1. **Calcula intereses y recargos** con un único motor parametrizable y auditable, en los tres momentos en que ProCoop los calcula (RN-04 §1): (a) al **emitir** (importes de los vencimientos 2 a 4, "recargo entre vencimientos"), (b) al **cobrar o consultar deuda** en caja, entes, pasarelas y portal (recargo por mora por tasa fija diaria, tabla de tasas por vigencia —`MORATAS`— o índices —`TABMORA`/`INDICESMORA`—, por servicio, categoría y tipo de documento), y (c) en un **proceso masivo** de "intereses a facturar" sobre deuda vencida impaga o pagada fuera de término.
2. **Gestiona la mora** como una máquina de estados configurable por servicio y categoría: política de mora (BASE §68), instancias (Candidatos, 1.ª, 2.ª, sensible, corte y las que defina el tenant), lotes, notificaciones con contenido, canal, plantilla y **constancia de entrega** (AGR-024), promesas de pago, calificación, excepciones y protecciones normativas (electrodependientes, entidades públicas y demás), causas de baja y tratamiento de morosos.
3. **Orquesta la suspensión, el corte, la reconexión, la baja por mora, la suspensión voluntaria y la reactivación** (BASE §53) respetando los **límites normativos por servicio y jurisdicción** (BASE §52.3, §68, §70, §86–§91): evalúa cada servicio afectado, bloquea o deriva a revisión, genera las órdenes hacia Técnica (M10) y el aprovisionamiento remoto (T06: MikroTik/RADIUS/OLT para Internet; telemedición y prepago para servicios medidos), y solo registra la prestación como suspendida o reactivada cuando la ejecución real está confirmada.
4. **Formaliza la regularización de deuda**: planes de pago y convenios con simulador (anticipo, cuotas, tasa, CFT), sistemas de amortización (sin interés, directo, francés, alemán, americano, cuotas con saldo), quitas, sellado, ajuste por índice, firmantes y firma, caída automática, reexigibilidad, refinanciación, cancelación anticipada y anulación, sin doble exigencia (AGR-014); planes de cuotas y entidades financieras.
5. **Administra garantías y garantes** (MER-005), **incobrables y gestión externa/judicial** (MER-006) y la **prescripción** de deuda, sin borrar jamás la historia económica.
6. Publica **informes y tableros de mora y financiación** con fórmula, universo y fecha de corte (AGR-022).

El módulo cierra el piloto Internet (DEC-005) en su tramo "pago → mora/suspensión → reconexión → baja" y deja la base para todos los servicios (DEC-007).

## 2. Límite y responsabilidades

### 2.1 Qué hace M08

| Capacidad | Detalle |
|---|---|
| Motor de interés | Servicio de dominio `mor.interestEngine` puro y determinista: recibe documento(s), fecha de cálculo y política vigente; devuelve importes separados (recargo entre vencimientos, interés por mora, gastos administrativos, descuento por pronto pago), cada uno con neto, IVA, percepción e IIBB, y el detalle por tramo. Lo consumen M05 (emisión), M07 (caja, entes, pasarelas, débitos, reversiones), M19 (portal), M08 (proceso masivo, convenios, gestión de mora). |
| Política y tablas | Políticas de interés por servicio, categoría y tipo de documento con vigencia; tablas de tasas por rango de fechas; tablas de índices; esquemas de recargo entre vencimientos; descuentos por pronto pago; conceptos base del interés. |
| Diferimiento | Decide, por política y por ente, qué parte del interés se cobra en el acto y qué se difiere a la próxima factura; registra el interés diferido y su destino. |
| Intereses a facturar | Corrida masiva con preliminar, selección/deselección de tramos y generación de cargos por cuenta. |
| Bloqueos | Bloqueo y desbloqueo de comprobantes por causa, con historial; bloqueo de sistema no editable; desbloqueo con interés. |
| Gestión de mora | Política de mora, instancias, candidatos, lotes, notificaciones (contenido, destinatarios, evidencia exigida), entrega, vencimiento de la notificación, promesas, calificación, bajas de notificación con causa, cierre, anulación de lote, operaciones especiales auditadas, tratamiento de morosos. |
| Excepciones y protecciones | Excepciones comerciales de mora (no reclamar / no cobrar interés) con vigencia y alcance; protecciones normativas acreditadas (electrodependencia, entidad pública, establecimiento de salud o educación, régimen temporal de emergencia y demás de la matriz) con evidencia y vigencia. |
| Interrupción del servicio | Casos de suspensión por mora, corte, baja por mora, cambio de estado o de categoría por mora, suspensión voluntaria temporal, suspensión por otro motivo, reactivación y reconexión; evaluación por servicio con matriz normativa; aprobación; órdenes hacia M10/T06; confirmación de ejecución; cargos admisibles. |
| Financiación | Planes de pago, tipos/métodos de cálculo, entidades financieras, simulador, convenios, cuotas, firmantes, firma, caducidad, reexigibilidad, refinanciación, cancelación anticipada, anulación y recálculo fiscal de cuotas. |
| Garantías | Garantes, depósitos en garantía, avales y otros instrumentos, su aplicación o devolución. |
| Recupero | Expedientes de gestión externa y judicial, estudios, gastos, estados; incobrables con aprobación; prescripción con informe y registro. |
| Informes | Informes operativos de mora, financiación, prescripción, excepciones, promesas, servicios a cortar y exportaciones regulatorias (ERSeP). |

### 2.2 Qué NO hace y a quién delega

| Tema | Responsable | Qué recibe de M08 / qué le pide M08 |
|---|---|---|
| Emisión fiscal de la factura o nota de débito de intereses, cargos de reconexión, cuotas, sellado y costos admitidos; numeración; CAE | **M05 FAC** (con **M06 FIS** para IVA, percepciones e IIBB) | M08 entrega `chargeRequests` (cargos a emitir en el acto o a incorporar en la próxima factura) con concepto, neto, base imponible y documento de origen relacionado. M05 imprime los importes por vencimiento calculados por M08. |
| Imputación de pagos, cuenta corriente, saldos, recibos, caja, entes, pasarelas, débitos, reversiones y contracargos | **M07 COB** | M07 pide a M08 la cotización de recargo (`quote`) y, al confirmar el pago, M08 consume `cob.payment.confirmed` para cerrar notificaciones, evaluar reconexión y actualizar cuotas. El saldo es único y lo calcula M07 (AGR-011). |
| Ejecución física del corte, reconexión, retiro/colocación de medidor, inspección de rehabilitación, órdenes de trabajo y cuadrillas | **M10 TEC** | M08 emite órdenes de interrupción/reconexión (`tec.workOrder` con origen `delinquency`) y espera confirmación de ejecución. |
| Aprovisionamiento remoto (MikroTik, RADIUS, OLT/SmartOLT, telemedición, prepago, SITSA, Discar, AION y demás) | **T06 INT** (operado desde M10) | M08 solicita la acción de red; T06 devuelve resultado; sin confirmación no se cambia el estado real. |
| Envío por canales (correo, SMS, WhatsApp, push, carta, impresión), proveedores, reintentos, acuses | **T09 COM** | M08 define contenido (variables), instancia, destinatarios y **evidencia requerida**; T09 devuelve estados creado/encolado/aceptado/entregado/fallido y evidencia (AGR-024). |
| Solicitudes del socio (baja, suspensión voluntaria, reactivación), reclamos de facturación, contactos y actividades | **M09 CRM** (y M19 POR para el canal) | La solicitud ingresa por CRM/portal/landing; M08 aplica la política de costos y restricciones y orquesta la ejecución. Un reclamo de facturación abierto se consulta como protección temporal. |
| Contrato de servicio, estado contractual, categoría y particularidades por servicio | **M02 CAT** (servicios, categorías) y **M01 PER** (personas, cuentas, contratos, inmuebles) | M08 cambia el estado de prestación únicamente mediante el servicio de M01/M02 y con un caso de interrupción confirmado. |
| Tarifas y precios de conceptos (cargo de reconexión, sellado, costos) | **M04 TAR** | M08 define la regla de admisibilidad; el importe sale del concepto tarifado vigente. |
| Asientos contables (intereses ganados, previsión y castigo de incobrables, prescripción, gastos judiciales) | **M15 CON** | M08 publica eventos económicos; M15 los contabiliza. |
| Venta financiada de productos y factura en cuotas de ventas | **M11 VEN** | Usa el **motor de amortización** de M08 (`mor.amortizationEngine`); el convenio de regularización es exclusivo de M08 (BASE §23: no mezclar venta nueva con regularización). |
| Expediente documental, workflow de aprobaciones, plantillas de documentos | **T11 WFL** | M08 declara las aprobaciones (condiciones especiales, excepciones, cortes de entidades sensibles, incobrables, prescripción) y adjunta documentos (convenio firmado, constancias). |
| Parámetros versionados y publicación | **T04 CFG** | Los parámetros de §14 se registran en el catálogo versionado de T04. |
| BI, cubos y APIs de terceros | **T10 BIA** | M08 publica vistas de lectura certificadas; T10 las expone. |

### 2.3 Invariantes que el módulo garantiza

1. Un mismo tramo de interés de un mismo documento **nunca** se cobra dos veces, cualquiera sea el canal que lo calcule (caja, ente, portal, proceso masivo, convenio): cada documento lleva la marca `interestSettledUntil` (interés liquidado hasta la fecha) y el motor calcula siempre desde esa marca.
2. Una deuda incluida en un convenio vigente no se reclama ni se notifica como deuda original (AGR-014); se reclaman las cuotas.
3. Ningún servicio pasa a suspendido, cortado, reconectado o reactivado por la sola emisión de una orden o la sola confirmación de un pago: se requiere confirmación de ejecución (BASE §53, §89).
4. Ninguna regla de tenant puede desactivar una restricción normativa marcada como `normative` (BASE §52.4: "el tenant puede configurar sus condiciones autorizadas, pero no desactivar restricciones normativas por ser administrador").
5. La solicitud de baja nunca genera cargo ni se condiciona a pagar deuda (BASE §52.3).
6. Los documentos económicos (cálculos, cargos, convenios, cuotas, notificaciones, incobrables, prescripciones) no se borran: se anulan o revierten con causa, autor y contrapartida (AGR-011).

## 3. Glosario del módulo

| Término | Definición | Clave de diccionario | Término ProCoop equivalente |
|---|---|---|---|
| Recargo entre vencimientos | Diferencia entre el importe a pagar en el vencimiento k (k = 2, 3, 4) y el importe del primer vencimiento. Se calcula al emitir y se informa en la factura. | `dict:mor.term.dueDateSurcharge` | Interés entre vencimientos, `TOTAL2..TOTAL4`, "Intereses en Vto" |
| Recargo por mora | Interés por pago posterior al último vencimiento, calculado a la fecha de pago o consulta. | `dict:mor.term.lateInterest` | Recargo por mora, interés por mora, punitorio |
| Gastos administrativos | Importe fijo por documento en mora, solo si su procedencia está validada. | `dict:mor.term.adminFee` | Gastos administrativos (V2 #372) |
| Descuento por pronto pago | Bonificación por pagar antes del primer vencimiento según días desde la emisión. | `dict:mor.term.earlyPaymentDiscount` | `DESCUENTO_CAJA` |
| Política de interés | Conjunto versionado de reglas de cálculo (método, tasa, base, mínimo, redondeo, fiscalidad, diferimiento) aplicable por servicio, categoría y tipo de documento. | `dict:mor.term.interestPolicy` | Parámetros VAR de cobranza + `TIPO_FAC.COD_CON/COD_CON2` |
| Tabla de tasas | Tasas diarias por rango de fechas con alcance por servicio, tipo de documento y categorías. | `dict:mor.term.rateTable` | `MORATAS` + `MORATAS_CATSER` |
| Tabla de índices | Serie fecha → valor para calcular el recargo por cociente de índices. | `dict:mor.term.indexTable` | `TABMORA` + `INDICESMORA` |
| Esquema de recargo entre vencimientos | Regla que define cómo se calculan los importes de los vencimientos 2 a 4. | `dict:mor.term.surchargeScheme` | V2 #74 + #578 + `TRAMASREC` |
| Base del interés | Importe sobre el que se aplica la tasa: total del primer vencimiento, saldo, o suma de conceptos configurados, menos impuestos excluidos. | `dict:mor.term.interestBase` | `CONCEPTOS_INT`, V2 #2300, #3167 |
| Interés liquidado hasta | Fecha hasta la cual el interés de un documento ya fue cobrado o facturado. | `dict:mor.term.interestSettledUntil` | `NOINTERES`, `COD_FAC='Punitorio'` (aproximación) |
| Diferimiento | Decisión de cobrar el interés en el acto o trasladarlo a la próxima factura. | `dict:mor.term.deferral` | V2 #1011 `DiferirInteres` |
| Interés diferido | Interés calculado al cobrar que se incorpora como cargo en la próxima factura. | `dict:mor.term.deferredInterest` | `INT_DIFE`, `DEUDAVTA` `TPCUOTA=1` |
| Corrida de intereses a facturar | Proceso masivo que calcula intereses sobre deuda vencida impaga o pagada fuera de término. | `dict:mor.term.interestBillingRun` | `clsFacturarIntereses` |
| Bloqueo de comprobante | Marca que impide o condiciona el cobro de un documento por una causa. | `dict:mor.term.documentHold` | `ID_BLO`, `CAUBLOQ`, `HISBLOQ` |
| Política de mora | Reglas por servicio y categoría: plazos, montos mínimos, instancias, canales, afectación, reactivación y excepciones (BASE §68). | `dict:mor.term.delinquencyPolicy` | Sin equivalente único (parámetros dispersos) |
| Instancia de mora | Etapa configurable del circuito: Candidatos, 1.ª, 2.ª, sensible, corte y otras. | `dict:mor.term.stage` | `INSTANCI` |
| Candidato | Cuenta seleccionada por deuda vencida que aún no recibió aviso. | `dict:mor.term.candidate` | Instancia de candidatos (V2 #2202), "Circulares" |
| Lote | Conjunto de notificaciones generadas en una misma operación e instancia. | `dict:mor.term.batch` | `NOTIFICA.LOTE` |
| Notificación de mora | Aviso a una cuenta por su deuda en una instancia, con documentos incluidos, vencimiento, entrega y resolución. | `dict:mor.term.notice` | `NOTIFICA` + `COMPNOTI` |
| Vencimiento de la notificación | Fecha a partir de la cual la notificación puede avanzar de instancia. | `dict:mor.term.noticeDueDate` | `VTO_CIR` |
| Constancia de entrega | Evidencia de que el aviso llegó al destinatario verificado (acuse, firma, lectura, carta con aviso de recibo). | `dict:mor.term.deliveryEvidence` | `RECIBIO`/`FEC_REC` |
| Promesa de pago | Compromiso del deudor de pagar en una fecha, que suspende el avance mientras está vigente. | `dict:mor.term.paymentPromise` | `NOTIFICA.PROMESA` |
| Calificación | Valoración del comportamiento de pago: Sin calificar, Buena, Regular, Mala. | `dict:mor.term.rating` | `NOTIFICA.CALIFICA` |
| Tratamiento de morosos | Etapa final del circuito: acciones sobre servicios (suspensión, corte, cambio de estado o categoría, reclamo, baja). | `dict:mor.term.delinquentTreatment` | `frmTratamientoMorosos` |
| Excepción de mora | Exclusión comercial de una cuenta del reclamo o del cobro de interés, con vigencia y alcance. | `dict:mor.term.exception` | `EXC_MORA` |
| Protección normativa | Condición acreditada que impide o condiciona la suspensión de un servicio (electrodependencia, entidad pública, salud, educación, emergencia). | `dict:mor.term.protection` | Excepciones de mora usadas para electrodependientes/entidades públicas (DFA M11) |
| Matriz de restricciones | Catálogo de restricciones de suspensión por servicio y jurisdicción (preaviso, días y horarios, protecciones, reclamos en trámite). | `dict:mor.term.restrictionMatrix` | Sin equivalente (mejora) |
| Evaluación de mora | Resultado, para una cuenta y fecha, de la política: obligaciones elegibles, servicios afectables y acción permitida, pendiente de revisión o bloqueada. | `dict:mor.term.evaluation` | Sin equivalente (BASE §68 CU-CTA-01) |
| Caso de interrupción | Expediente de suspensión, corte, baja por mora, suspensión voluntaria, reactivación o reconexión de un servicio. | `dict:mor.term.interruptionCase` | OT de desconexión/reconexión con `GEST_MORA`, `MOROSO` |
| Causa | Motivo codificado de baja de notificación, de corte, de baja, de bloqueo o de excepción. | `dict:mor.term.reason` | `CAUSAS`, `CAUBLOQ` |
| Plan de pago | Plantilla de condiciones de financiación (cuotas, tasa, método, mínimos, quitas). | `dict:mor.term.paymentPlan` | `PLAN_CUO` |
| Método de amortización | Fórmula de cuotas: sin interés, directo, francés, alemán, americano, cuotas con saldo. | `dict:mor.term.amortizationMethod` | `TIP_FIN`, `COD_CAL` |
| Convenio | Acuerdo de regularización de deuda existente con obligaciones incluidas, cuotas y firmantes. | `dict:mor.term.agreement` | `REC_CON` + `IT_RECCO` (`PPAGOS` + `PPITEMS` solo por discriminador de T07; CTR-DAT-52) |
| Anticipo / entrega | Pago inicial del convenio (cuota 0). | `dict:mor.term.downPayment` | Cuota 0, `MIN_ENT` |
| CFT | Costo financiero total del convenio: tasa que iguala lo recibido con todos los pagos, incluidos intereses, impuestos sobre intereses, sellado y cargos. | `dict:mor.term.cft` | Sin equivalente (mejora DFA M12) |
| Modalidad de cuotas | Cuota incorporada a la factura mensual o cuota emitida como documento propio (chequera). | `dict:mor.term.installmentMode` | V2 #306 (chequera / factura mensual) |
| Caducidad del convenio | Caída del convenio por incumplimiento según la regla del plan, con reexigibilidad del saldo. | `dict:mor.term.agreementDefault` | No existe en ProCoop (RN-04 §8.13) |
| Refinanciación | Nuevo convenio que incluye cuotas impagas de otro convenio. | `dict:mor.term.refinancing` | Convenio con `FACTURAS.CLASE=1` incluidas |
| Firmante | Persona que debe firmar el convenio: titular, codeudor, garante, representante de la cooperativa. | `dict:mor.term.signer` | `REC_CON.COD_GAR` (`PPAGOS_FIRMANTES` solo por discriminador de T07; CTR-DAT-52) |
| Entidad financiera | Tercero que financia cuotas (tarjeta, banco) con sus condiciones. | `dict:mor.term.financialEntity` | `ENTFIN` |
| Garantía | Garante, depósito en garantía, aval u otro instrumento que respalda obligaciones. | `dict:mor.term.guarantee` | MER-005 (sin tabla ProCoop específica salvo `COD_GAR`) |
| Gestión externa / judicial | Derivación de deuda a un estudio o agencia, o a juicio, con expediente, gastos y estado. | `dict:mor.term.collectionCase` | MER-006 (sin equivalente ProCoop) |
| Incobrable | Deuda declarada de cobro improbable con aprobación y efecto contable, sin borrar el historial. | `dict:mor.term.writeOff` | MER-006 |
| Prescripción | Extinción de la exigibilidad por el transcurso del plazo legal aplicable a la obligación. | `dict:mor.term.prescription` | Informe "Deuda a Prescribir" + `clsPrescripcionDeuda` (V2 #104, #2158) |

## 4. Actores, permisos y alcance

| Rol | Capabilities (`mor.recurso.accion`) | Alcance de datos |
|---|---|---|
| Configurador de mora y financiación | `mor.politicasInteres.ver/configurar`, `mor.tasas.ver/crear/editar/anular`, `mor.indices.ver/crear/editar/importar`, `mor.tramasRecargo.configurar`, `mor.descuentosProntoPago.configurar`, `mor.politicasMora.ver/configurar`, `mor.instancias.configurar`, `mor.modelosAviso.configurar`, `mor.causas.configurar`, `mor.restricciones.ver/configurar` (solo restricciones de tipo `tenantPolicy`), `mor.cargosInterrupcion.configurar`, `mor.planesPago.configurar`, `mor.entidadesFinancieras.configurar`, `mor.prescripcion.configurar` | Tenant; servicios habilitados |
| Responsable normativo (plataforma o tenant con rol legal) | `mor.restricciones.configurarNormativas`, `mor.protecciones.aprobar` | Plataforma (catálogo base por jurisdicción) y tenant |
| Gestor de mora | `mor.candidatos.generar`, `mor.notificaciones.ver/generar/procesar/marcarEntrega/promesa/calificar/darBaja/cerrar/imprimir/exportar`, `mor.tratamiento.ver/ejecutar`, `mor.evaluaciones.ver/ejecutar`, `mor.excepciones.ver/crear`, `mor.deuda.ver`, `mor.cotizacion.ver` | Sucursales, zonas y servicios asignados |
| Supervisor de mora | Todo lo del gestor + `mor.lotes.anular`, `mor.operacionesEspeciales.ejecutar`, `mor.excepciones.aprobar/anular`, `mor.interrupciones.aprobar`, `mor.interrupciones.aprobarSensible`, `mor.bloqueos.crear/liberar`, `mor.dispensaRecargo.aprobar` | Tenant o sucursales |
| Cajero / operador de cobranza (M07) | `mor.cotizacion.ver`, `mor.notificaciones.ver` (aviso de notificado), `mor.dispensaRecargo.solicitar`, `mor.recargoDiario.cambiar` (solo si V2 #1030 equivalente habilitado) | Caja/sucursal propia |
| Gestor de convenios | `mor.simulador.usar`, `mor.convenios.ver/crear/editar/imprimir`, `mor.convenios.enviarFirma`, `mor.convenios.registrarFirma`, `mor.convenios.cancelarAnticipado`, `mor.convenios.refinanciar`, `mor.garantias.ver/crear/editar` | Sucursales y servicios asignados |
| Aprobador de condiciones especiales | `mor.convenios.aprobar` (fuera de plan, quitas mayores, más cuotas), `mor.convenios.anular`, `mor.convenios.declararCaducidad`, `mor.convenios.rehabilitar` | Tenant |
| Responsable de recupero / legal | `mor.gestionExterna.ver/crear/editar/cerrar`, `mor.estudios.configurar`, `mor.incobrables.proponer`, `mor.prescripcion.proponer`, `mor.gastosJudiciales.registrar` | Tenant |
| Contador / aprobador económico | `mor.incobrables.aprobar/revertir`, `mor.prescripcion.aprobar`, `mor.interesesFacturar.aprobar` | Tenant |
| Operador de corridas | `mor.interesesFacturar.ver/simular/ejecutar/cancelar`, `mor.bloqueos.aplicarMasivo` (antes `mor.bloqueos.masivos`) | Tenant |
| Coordinador técnico (M10) | `mor.interrupciones.ver` (lectura), recibe órdenes; confirma ejecución con capabilities de M10 | Cuadrillas/zonas propias |
| Estudio o agencia externa | `mor.gestionExterna.verAsignados`, `mor.gestionExterna.registrarAvance` (portal de terceros con token, `/api/v1/ext`) | Solo expedientes asignados (alcance `propios`) |
| Auditor | `mor.informes.ver` y la capability `ver` de cada recurso de M08 (antes `mor.*.ver`), `mor.auditoria.ver`, `mor.informes.exportar` (antes `mor.*.exportar`) | Tenant, solo lectura |
| Socio (PWA) | `mor.miDeuda.ver`, `mor.misAvisos.ver`, `mor.simulador.usar`, `mor.convenios.solicitar/aceptar/firmar`, `mor.promesa.registrar` (si la política lo habilita), `mor.interrupciones.solicitar` (suspensión voluntaria, reactivación) | Cuentas propias y de las que es autorizado |
| Sistema (jobs) | Identidad técnica por tenant (cuenta técnica S-SYS, RF-IAM-115) con las capabilities `mor.<recurso>.<acción>` que ejecuta cada job (antes `mor:*`, sintaxis fuera de la convención de T02) | Tenant del job |

Reglas de permisos: las capabilities de aprobación nunca coinciden con las de solicitud en la misma persona para el mismo caso cuando la política exige doble control (BASE §14 "aprobar condiciones especiales"); el permiso `mor.restricciones.configurarNormativas` no se concede a administradores de tenant salvo que la plataforma lo delegue expresamente (§2.3 invariante 4).

## 5. Requisitos funcionales

### 5.1 Motor común de interés

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-MOR-001 | Proveer un **único motor de cálculo de interés** consumido por emisión, caja, entes, pasarelas, portal, proceso masivo, convenios y gestión de mora, con la misma política y el mismo resultado para la misma entrada. | RN-04 §12.1; AGR-011 | Núcleo | O5 | Adoptado | Para un documento y fecha dados, caja, portal y proceso masivo devuelven importes idénticos al centavo. |
| RF-MOR-002 | El motor recibe documento(s), fecha de cálculo, canal, ente (opcional), y devuelve componentes separados: recargo entre vencimientos, interés por mora, gastos administrativos y descuento, cada uno con neto, IVA, percepción de IVA e IIBB, más el detalle por tramo (desde, hasta, días, tasa, base, interés, IVA, percepción, tipo). | RN-04 §4.3 `InfoRecargo`/`InfoImporte`; CAT `IT_PAGSO_INTERES`, `IT_PAGSO_INTERES_TRAMAS` | Núcleo | O5 | Adoptado | La respuesta contiene los cuatro componentes y la lista de tramos; la suma de tramos coincide con el componente. |
| RF-MOR-003 | Persistir cada cálculo usado en una operación económica (cobro, cargo, convenio) como **cálculo de interés** inmutable con los parámetros aplicados (método, tasa, mínimo, redondeo, excluidos, jubilado, crédito, último vencimiento, gastos). | CAT `IT_PAGSO_INTERES`, `IT_PAGSO_INTERES_TRAMAS` | Núcleo | O5 | Adoptado | Desde un recibo se puede abrir el cálculo y reproducirlo con la versión de política registrada. |
| RF-MOR-004 | Permitir **cotizaciones** sin efecto (consulta de deuda, portal, simulador) con validez hasta el fin del día del tenant. | RN-04 §4; BASE §97.3 | Núcleo | O5 | Adoptado | Una cotización no modifica documentos; expira a las 23:59 de la zona del tenant. |
| RF-MOR-005 | Resolver la política aplicable por **servicio, categoría, tipo de documento y vigencia**, con prioridad explícita y visible (más específica primero). | RN-04 §4.3 (MORATAS/MORATAS_CATSER); DFA M11 "tasa por servicio y categoría"; BASE §68 | Núcleo | O5 | Adoptado | Con políticas general y por categoría vigentes, el cálculo usa la de la categoría y lo informa en el detalle. |
| RF-MOR-006 | Soportar los métodos de cálculo **tasa fija diaria**, **tabla de tasas por vigencia** e **índices**, elegidos explícitamente en la política (sin prioridades implícitas). | RN-04 §4.3 a/b/c | Núcleo | O6 | Adoptado | Una política sin método configurado no se puede publicar. |
| RF-MOR-007 | Calcular siempre **interés simple diario** sobre la base, salvo el método de índices (que trae la composición del índice); no capitalizar. | RN-04 §4.3 conclusión, §12.2 | Núcleo | O5 | A validar (PA-MOR-01) | El interés de 30 días al 0,1 % diario sobre ARS 10.000 es ARS 300,00. |
| RF-MOR-008 | Tomar la **fecha de cálculo** como fecha efectiva de pago informada por el canal (fecha de cobro del ente o pasarela) o fecha de consulta; permitir fecha fija de cálculo para caja local con permiso. | RN-04 §4.2 (Pagos360 fecha de cobro); V2 #2487 | Estándar | O5 | Adoptado | Un pago rendido por ente con fecha de pago anterior a la rendición calcula interés a la fecha de pago. |
| RF-MOR-009 | Registrar la marca **interés liquidado hasta** por documento y calcular siempre desde ella, para impedir doble cobro entre canales y procesos. | RN-04 §13.8; §5.5 (`NOINTERES`, `Punitorio`) | Núcleo | O5 | Adoptado | Tras facturar interés masivo al 31-10, un cobro en caja el 15-11 calcula solo 15 días. |
| RF-MOR-010 | Exponer el detalle del cálculo en caja, portal y factura en lenguaje claro (dict), con tasa, días y base. | RN-04 §4.3 (tasa diaria equivalente); V2 #2562, #2566 | Estándar | O5 | Adoptado | El socio ve "interés por mora: 15 días × 0,10 % × ARS 8.000 = ARS 120 + IVA". |

### 5.2 Recargo entre vencimientos al emitir

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-MOR-011 | Configurar por servicio, ciclo y tipo de documento un **esquema de recargo entre vencimientos** con variantes: ninguno, porcentaje variable por días, porcentaje fijo por escalón (cascada), importe fijo por escalón, trama por importe, trama por vencimiento. | RN-04 §3.1; V2 #74, #578; BASE §97.3 | Núcleo | O4 | Adoptado | Cada variante calcula `TOTAL2..TOTAL4` según RN-MOR-011 a RN-MOR-016 con los ejemplos de §17. |
| RF-MOR-012 | Calcular al emitir los importes de cada vencimiento y entregarlos a M05 para imprimirlos en la factura y mostrarlos en la app. | RN-04 §3.1; BASE §97.3 "Exhibir en la factura y en la app" | Núcleo | O4 | Adoptado | La factura emitida muestra cuatro importes que coinciden con la cotización del motor en cada fecha. |
| RF-MOR-013 | Administrar **tramas de recargo** por tipo de documento y rango de importe (desde, hasta, valor, tipo de valor por día o fijo) y tramas por número de vencimiento. | CAT `TRAMASREC`; RN-04 §3.3 | Estándar | O4 | Adoptado | No se pueden cargar dos tramas del mismo tipo de documento con rangos de importe superpuestos. |
| RF-MOR-014 | Calcular el IVA del recargo con el concepto de interés entre vencimientos y la situación de IVA del titular, más percepción si corresponde; si el concepto no está configurado, **impedir la publicación** del esquema. | RN-04 §3.3 `CalcularIVA_Interes` (V2 #606); §6 | Núcleo | O4 | Adoptado | Publicar un esquema sin concepto fiscal devuelve error de validación. |
| RF-MOR-015 | Permitir recargo por **cambio de trama** con concepto propio (prepago). | V2 #2283 | Extensión | O7 | Adoptado | Un cambio de trama de prepago genera el ítem con el concepto configurado. |
| RF-MOR-016 | Cuotas de convenio emitidas como documento propio tienen un solo vencimiento (sin recargo entre vencimientos); la mora corre desde ese vencimiento. | RN-04 §8.9 | Núcleo | O6 | Adoptado | Una cuota emitida tiene VTO1=VTO2=VTO3=VTO4 y TOTALk iguales. |
| RF-MOR-017 | Al cobrar entre el VTO1 y el último vencimiento, el recargo cobrado es la diferencia del vencimiento vigente menos lo ya absorbido por pagos previos, tratado con IVA incluido. | RN-04 §3.2, §4.3 | Núcleo | O5 | Adoptado | Un pago parcial previo reduce proporcionalmente el recargo entre vencimientos a cobrar. |
| RF-MOR-018 | El recargo entre vencimientos puede ser **proporcional al saldo** cuando hubo pagos parciales. | V2 #2363 | Estándar | O5 | Adoptado | Con saldo 50 % del TOTAL1, el recargo es la mitad. |
| RF-MOR-019 | Discriminar el **IIBB** del recargo entre vencimientos cuando la jurisdicción lo exige. | V2 #2826 | Estándar | O5 | Adoptado | Con la opción activa, el detalle muestra IIBB separado. |
| RF-MOR-020 | Registrar el recargo entre vencimientos efectivamente cobrado en un **documento posterior** (ND o factura según política), sin modificar la factura original. | BASE §97.3; RN-04 §4.4 | Núcleo | O5 | Adoptado | La factura original permanece intacta; se emite un documento relacionado con el ítem "Intereses en Vto – {nro}". |

### 5.3 Recargo por mora al cobrar o consultar

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-MOR-021 | Calcular el recargo por mora desde la **fecha base** (VTO1, o último vencimiento si la política lo indica; con pagos parciales, el vencimiento que corresponde a la fecha del último pago) hasta la fecha de cálculo. | RN-04 §4.3; V2 #621 | Núcleo | O5 | Adoptado | Con la opción "desde último vencimiento", una factura con VTO4 al 20-10 pagada el 30-10 genera 10 días. |
| RF-MOR-022 | Tomar como **base**: sin pagos, el TOTAL1 (o TOTAL del último vencimiento si así está configurado) menos impuestos excluidos; con pagos parciales, el saldo; con base por conceptos, la suma de ítems de los conceptos/impuestos configurados por servicio. | RN-04 §4.2, §4.3; V2 #2300, #3167; CAT `CONCEPTOS_INT` | Núcleo | O5 | Adoptado | Excluir el impuesto municipal reduce la base por exactamente su importe prorrateado al saldo. |
| RF-MOR-023 | Método tasa fija diaria: `base × tasa × días / 100`; la tasa puede sobrescribirse por ente recaudador. | RN-04 §4.3 a); V2 #600 | Núcleo | O5 | Adoptado | Ver ejemplo numérico en §17 ESC-MOR-01. |
| RF-MOR-024 | Método índices: `base × (índice(≤ fecha de cálculo) / índice(≥ fecha base) − 1)`, con la tabla de índices de la política y filtro por tipo de documento; mostrar tasa diaria equivalente. | RN-04 §4.3 b), detalle índices; CAT `TABMORA`, `INDICESMORA` | Estándar | O6 | Adoptado | Con índices 100 y 103, base ARS 10.000 → ARS 300. |
| RF-MOR-025 | Método tabla de tasas: sumar, por cada tramo de vigencia que se solapa con el período, `base × tasa diaria × días solapados / 100`, filtrando por tipo de documento y categoría (la categoría coincidente tiene prioridad sobre las tasas generales). | RN-04 §4.3 c), detalle MORATAS | Núcleo | O6 | Adoptado | Un período de 40 días que cruza dos tramos usa cada tasa por sus días. |
| RF-MOR-026 | Separar el interés entre vencimientos del interés por mora cuando la política lo indica. | V2 #2356, #621 | Estándar | O5 | Adoptado | El recibo muestra ambos ítems por separado. |
| RF-MOR-027 | Aplicar **mínimo** de recargo según el modo configurado. | V2 #609; RN-04 §13.3 | Estándar | O5 | A validar (PA-MOR-02) | Con mínimo ARS 50 en modo "umbral de exención", un recargo de ARS 40 vale 0. |
| RF-MOR-028 | Sumar **gastos administrativos** por documento pasado el último vencimiento, solo si el concepto está habilitado con fundamento. | V2 #372; BASE §52.2 consecuencia de diseño | Estándar | O6 | A validar (PA-MOR-12) | Un tenant sin habilitación no puede activar el importe. |
| RF-MOR-029 | Aplicar regla de **redondeo** explícita al recargo total (incluye opción a 1 decimal). | V2 #608; AGR-011 | Estándar | O5 | Adoptado | Con redondeo a 1 decimal, ARS 120,46 → ARS 120,50 según regla "half-up". |
| RF-MOR-030 | Inhabilitar el interés para: documento marcado sin interés, cuenta sin recargo (si la política respeta esa marca), beneficiario de condición eximida (jubilados u otra condición configurable), y documentos de crédito salvo política contraria. | RN-04 §4.2; V2 #1002, #299, #3135, #625 | Núcleo | O5 | Adoptado | Una NC con saldo no genera interés salvo opción activa. |
| RF-MOR-031 | Aplicar **descuento por pronto pago** antes del VTO1 según tramos de días desde la emisión por tipo de documento, solo para socios. | RN-04 §4.3; CAT `DESCUENTO_CAJA`; §4.5 | Estándar | O5 | Adoptado | Pagar a los 3 días con tramo 0–5 días al 2 % descuenta 2 % del neto. |
| RF-MOR-032 | Calcular el IVA, la percepción y el IIBB del interés con el **concepto de interés por tipo de documento** (o el general, o el de modo financiación) y la situación fiscal del titular (con situación por defecto si falta). | RN-04 §4.1 (V2 #606, #307, `TIPO_FAC.COD_CON`, #2086) | Núcleo | O5 | Adoptado | Un titular responsable inscripto recibe IVA 21 % sobre el neto del interés (alícuota ilustrativa del concepto). |
| RF-MOR-033 | Permitir que el **ente recaudador** sobrescriba: recargo desde último vencimiento, modo de diferimiento y cobro al VTO1. | RN-04 §4.1 (`RECARGO3VTO`, `DIFERIR`, `COBVTO1`) | Estándar | O5 | Adoptado | El ente X configurado "cobra al VTO1" no genera recargo entre vencimientos. |
| RF-MOR-034 | Permitir la **dispensa del recargo** en caja con solicitud del cajero y aprobación del supervisor, motivo y registro. | V2 #3162 | Estándar | O5 | Adoptado | Sin aprobación no se puede confirmar un cobro con recargo dispensado. |
| RF-MOR-035 | Permitir al operador cambiar el **recargo diario** en modo financiación solo si la política lo habilita, con capability y motivo. | V2 #1030 | Extensión | O6 | Adoptado | El cambio queda en el cálculo con autor y motivo. |
| RF-MOR-036 | Calcular **interés por reversión** (contracargo) entre la fecha del pago revertido y la fecha de reversión, con tasa propia. | V2 #3052; AGR-013 | Estándar | O5 | Adoptado | Una reversión a los 20 días con 0,1 % diario sobre ARS 5.000 calcula ARS 100. |
| RF-MOR-037 | Calcular **interés por valores a fecha** recibidos en caja (cheques) con tasa diaria y concepto propio. | V2 #486, #487 | Extensión | O8 | Adoptado | Un cheque a 30 días genera el interés configurado. |
| RF-MOR-038 | Informar a la cobranza de **prepago** si corresponde retener intereses, respetando excepciones con "no retener". | RN-04 §6 `clsPrepaga.EsExcepcion`; V2 #713 | Estándar | O7 | Adoptado | Una cuenta con excepción vigente "no retener" no retiene intereses en la venta de prepago. |
| RF-MOR-039 | Permitir **punitorios específicos por servicio** (ej. energía) como política del servicio. | V2 #3138 | Extensión | O7 | A validar ([VERIFICAR] semántica) | La política de electricidad puede definir un punitorio distinto del general. |
| RF-MOR-040 | Proveer a M07 la lista de documentos **notificados**, bloqueados o incluidos en notificación abierta para sus validaciones de caja (pago completo de deuda notificada, antigüedad, avisos). | RN-04 §6 (V2 #321, #324, #462, #375, #302, #2453, #2586, #2596) | Núcleo | O6 | Adoptado | La caja recibe la marca "notificado" y aplica su regla. |

### 5.4 Diferimiento y documentación del interés

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-MOR-041 | Soportar tres modos: **no diferir** (se cobra todo), **diferir interés por mora** (se cobra el entre vencimientos), **diferir todo**; por política, por ente y por canal. En el pago online de una factura vencida el interés se difiere a la próxima factura por defecto, configurable por canal (DEC-051). | RN-04 §4.4; V2 #1011; MER-019 | Núcleo | O5 | Adoptado | En modo "diferir todo" la caja cobra solo el saldo de la factura. |
| RF-MOR-042 | Lo cobrado en el acto genera una solicitud de cargo a M05 por cuenta, situación de IVA, situación de IIBB y opcionalmente por tipo de documento, con ítems "Intereses – {comprobante}" e "Intereses en Vto – {comprobante}", relacionada con las facturas pagadas. | RN-04 §4.4; V2 #1056, #2249 | Núcleo | O5 | Adoptado | Un cobro de 3 facturas con interés emite un documento con 3 ítems relacionados. |
| RF-MOR-043 | Tipo del documento del interés cobrado en el acto: factura o nota de débito según política; si el total es negativo (descuento), se emite crédito. | V2 #273; RN-04 §4.4 | Núcleo | O5 | A validar (PA-MOR-04) | Con ND configurada, se emite ND asociada; con descuento neto, NC. |
| RF-MOR-044 | Lo diferido genera un **interés diferido** que se incorpora como cargo en la próxima factura del servicio de origen (si la política lo relaciona) o de la cuenta. | RN-04 §4.4; V2 #2828; CAT `INT_DIFE` | Núcleo | O5 | Adoptado | La próxima factura incluye el ítem del interés diferido y lo marca consumido. |
| RF-MOR-045 | En cuotas de convenio, los ítems de interés se copian por subtipo (financiación actual, anterior, mora) y se relacionan con el convenio. | RN-04 §4.4, §4.2 (subtipos 21–24) | Estándar | O6 | Adoptado | El documento de interés de una cuota referencia el convenio. |
| RF-MOR-046 | Recargos por medio de pago (cheque de terceros, transferencia, tarjeta) se documentan con sus conceptos; la regla pertenece a M07 y el cálculo de interés por valores a M08. | RN-04 §4.4; V2 #487, #2070, #2069 | Estándar | O5 | Adoptado | El recargo por tarjeta usa el concepto de tarjeta. |
| RF-MOR-047 | Recargo por **cobranza remota** (concepto e importe) se agrega solo si la política de M07 lo habilita y es admisible. | V2 #718, #719 | Extensión | O5 | Adoptado (regla en M07) | M08 solo lo muestra en la cotización. |
| RF-MOR-048 | El vendedor/origen del cargo de intereses es configurable. | V2 #1008 | Estándar | O6 | Adoptado | Los cargos de la corrida masiva llevan el origen configurado. |

### 5.5 Proceso masivo de intereses a facturar

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-MOR-049 | Ejecutar una **corrida de intereses a facturar** con filtros: tipo de documento, rango de fechas, cuenta, titular, grupo (incluir/excluir), tasa diaria, solo servicios conectados, procesar pagos entre fechas, no calcular interés sobre interés, concepto, servicio, solo impagas, solo sobre cargos. | RN-04 §5.1 | Estándar | O6 | Adoptado | Cada filtro está disponible y queda registrado en la corrida. |
| RF-MOR-050 | Seleccionar documentos de débito no anulados sin marca "sin interés"; según opción, con saldo, o pagados fuera de término (pagos posteriores al vencimiento dentro del rango). | RN-04 §5.2, §5.6 | Estándar | O6 | Adoptado | Una factura pagada 10 días tarde entra con opción "pagos fuera de término". |
| RF-MOR-051 | Calcular el interés por **tramos entre pagos sucesivos** con el saldo vigente en cada tramo: escalones entre vencimientos dentro del tramo y, luego del último vencimiento, `saldo × días × tasa`. | RN-04 §5.3 | Estándar | O6 | Adoptado | Una factura con dos pagos parciales tiene tres tramos con saldos decrecientes. |
| RF-MOR-052 | Opción **no calcular interés sobre interés**: descontar de la base la proporción del interés ya facturado. | RN-04 §5.3 `NoCalcularInteresAnterior` | Estándar | O6 | Adoptado | La base excluye el interés ya facturado del documento. |
| RF-MOR-053 | Opción de interés por **valores diferidos** (cheques posteriores al último vencimiento) hasta la fecha promedio de los valores. | RN-04 §5.3 (cheques), variantes Cheques y AL | Extensión | O8 | A validar (PA-MOR-14) | Un pago con cheque a 30 días genera interés hasta la fecha del cheque. |
| RF-MOR-054 | Opción **punitorio único** sobre saldo (sin días) y opción **solo sobre cargos** con tasa configurable, como variantes declaradas de la corrida (sin valores fijos en código). | RN-04 §5.4 (CAU) | Extensión | O6 | A validar (PA-MOR-14) | El 3 % de CAU se configura como tasa, no está fijo. |
| RF-MOR-055 | Generar **preliminar** con detalle por documento y tramo; el operador puede destildar tramos o documentos; solo lo seleccionado se factura. | RN-04 §5.6 `Get_Reporte` | Estándar | O6 | Adoptado | Destildar un tramo lo excluye del total y del cargo. |
| RF-MOR-056 | Generar **un cargo por cuenta** (agrupado por situación de IVA, cuenta y titular) con un ítem por documento, destinado a la próxima factura; procesar en bloques con progreso, reanudable e idempotente. | RN-04 §5.5 | Estándar | O6 | Adoptado | Reejecutar la corrida no duplica cargos. |
| RF-MOR-057 | Actualizar la marca "interés liquidado hasta" de cada documento incluido. | RN-04 §5.5 (`NOINTERES`, `Punitorio`) | Núcleo | O6 | Adoptado | Un cobro posterior en caja no vuelve a cobrar el período facturado. |
| RF-MOR-058 | La numeración de los documentos la asigna M05 en forma atómica; la corrida no reserva números en memoria. | RN-04 §5.6 [VERIFICAR] numeración | Núcleo | O6 | Adoptado | Dos corridas concurrentes no duplican números. |

### 5.6 Bloqueos de comprobantes

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-MOR-059 | Bloquear y desbloquear documentos por **causa** (catálogo), individual o masivamente, con historial (causa, fecha, usuario). | RN-04 §6 `Asignar_Bloqueo`; CAT `CAUBLOQ`/`HISBLOQ` | Estándar | O6 | Adoptado | Cada cambio de bloqueo genera un registro de historial con el identificador del usuario. |
| RF-MOR-060 | Existir **bloqueos de sistema** no editables por usuarios (equivalente a `ID_BLO = -1`). | RN-04 §6 [VERIFICAR] | Estándar | O6 | Adoptado | Un intento de liberar un bloqueo de sistema devuelve error 409. |
| RF-MOR-061 | **Desbloquear con interés**: al liberar, calcular un porcentaje configurado y generar el cargo con concepto y tipo de documento propios. | RN-04 §6 `Asignar_Bloqueo_ConIntereses`; V2 #2770, #2771, #2984 | Extensión | O6 | Adoptado | Desbloquear con 5 % sobre ARS 10.000 genera un cargo de ARS 500 más impuestos. |
| RF-MOR-062 | Informar a M07 si se permite cobrar documentos o talones bloqueados en caja, y ocultarlos en autogestión si así se configura. | V2 #2586, #2596, #3102 | Estándar | O6 | Adoptado | Con la opción desactivada, la caja no permite seleccionar un bloqueado. |
| RF-MOR-063 | Bloquear opcionalmente los documentos notificados al generar o procesar una notificación. | RN-04 §7.3 paso 6 | Estándar | O6 | Adoptado | La notificación con "bloquear" marca sus documentos con la causa elegida. |
| RF-MOR-064 | Bloquear la caja (cobro de documentos del servicio) mientras exista una orden de cambio de estado por mora pendiente, si la política lo indica. | V2 #2458 [VERIFICAR] | Extensión | O6 | A validar | Con la opción activa, el cobro advierte o bloquea según configuración. |

### 5.7 Política de mora configurable por servicio y categoría (BASE §68)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-MOR-065 | Definir **políticas de mora** versionadas por servicio y categoría con: días desde vencimiento para ser candidato, monto mínimo de deuda, cantidad mínima de documentos, instancias y su orden, canales por instancia, plazos de gracia e intimación, fecha de evaluación, acción final permitida y reactivación. | BASE §68 "Parámetros propuestos"; DFA M11 mejoras | Núcleo | O6 | Informado | Una política publicada se aplica solo a las cuentas de su servicio y categoría vigentes. |
| RF-MOR-066 | Soportar **cuenta separada por servicio o unificada** del socio; la evaluación de mora conserva la deuda por servicio y documento. | BASE §68 CTA-001 | Núcleo | O6 | Informado | En cuenta unificada, la evaluación muestra la deuda por servicio. |
| RF-MOR-067 | Configurar **pago mínimo** (importe, porcentaje, obligaciones exigibles o fórmula) con finalidad explícita; nunca se infiere que el mínimo cancela el resto. | BASE §68 CTA-002; §71 | Estándar | O6 | A validar (PA-MOR-09) | Pagar el mínimo no reduce el saldo de las demás facturas. |
| RF-MOR-068 | Definir el **saldo elegible** para mora: capital vencido, cargos autorizados, exclusiones, convenios y créditos. Los conceptos de terceros se excluyen por defecto y solo se incluyen si el convenio con el tercero lo autoriza (RN-MOR-142; HUECO-TAS-02), según la marca `thirdPartyAgreements.moraPolicy` del convenio de M06 (RN-FIS-127): inclusión en saldo elegible, recargos e intereses y habilitación de corte. **Solo obligaciones habilitadas por la compuerta fiscal (DEC-107; 10-11-2026):** el saldo elegible, la evaluación de interrupción y el cálculo de recargo e interés parten solo de obligaciones de M07 con `fiscalGate` `authorized` o `notRequired` (M07 RN-COB-158), que son las únicas con débito en el auxiliar; una obligación `pendingAuthorization` o `released` (comprobante sin CAE, CAEA vigente o CESP, o devuelto a borrador por ARCA) no integra el saldo elegible, no genera interés ni recargo y no cuenta para candidatos, instancias ni corte. **Autorización tardía (M05 RN-FAC-165, M07 RN-COB-158 punto 3; DEC-107, 10-11-2026):** si el comprobante se autorizó después de su primer vencimiento, la obligación se considera vencida y genera mora solo desde los vencimientos corridos de `obligations.dueSchedule` (el primero, fecha de autorización más los días de gracia), nunca desde las fechas originales guardadas en `dueScheduleShift`; los días entre la fecha original y la corrida no devengan interés ni cuentan para antigüedad de deuda, candidatos, instancias ni corte. [VERIFICAR con el contador] si la norma o el ente regulador imponen otro criterio. | BASE §68 "Saldo elegible"; HUECO-TAS-02; RN-FIS-127 (M06); DEC-107; M07 RN-COB-158 | Núcleo | O6 | Informado | Las cuotas no vencidas de un convenio no integran el saldo elegible. Una factura con ARS 10.000 de servicio vencido y ARS 1.500 de tasa municipal da saldo elegible ARS 10.000 sin convenio que lo autorice. |
| RF-MOR-069 | Evaluar los **efectos de incumplimiento en cuenta unificada** por servicio: permitido, pendiente de revisión o bloqueado, con motivo; la afectación cruzada está deshabilitada por defecto. | BASE §68 CTA-003, CU-CTA-01 | Núcleo | O6 | A validar (PA-MOR-08) | La deuda de cementerio parque no habilita por sí sola suspender agua o electricidad. |
| RF-MOR-070 | Configurar **reactivación** por servicio, causa y condición: pago o condición necesaria, intervención técnica, costo habilitado o gratuidad. | BASE §68 CTA-004; §53 CIC-003/004 | Núcleo | O6 | Informado | La regla de reactivación de Internet sin costo se aplica al confirmar el pago. |
| RF-MOR-071 | Registrar **excepciones de la política**: reclamos, pagos a verificar, situaciones protegidas, acuerdos y autorizaciones, que detienen o condicionan la evaluación. | BASE §68 "Excepciones" | Núcleo | O6 | Informado | Un pago informado pendiente de acreditar detiene la suspensión. |
| RF-MOR-072 | Ejecutar la **evaluación de mora** (job o a demanda) por cuenta y fecha, conservando obligaciones consideradas, pagos confirmados e imputación exacta por factura. | BASE §68 CU-CTA-01 pasos 1–3 | Núcleo | O6 | Informado | La evaluación de ESC-MOR-06 reproduce el ejemplo de ARS 40.000. |
| RF-MOR-073 | La evaluación **no ejecuta cortes**: genera candidatos, notificaciones o propuestas de interrupción según la política. | BASE §14 límite; §68 paso 2 | Núcleo | O6 | Informado | Ninguna evaluación cambia el estado de un servicio. |
| RF-MOR-074 | Versionar, auditar y publicar la política con fecha efectiva; un cambio no altera evaluaciones ya cerradas. | BASE §52.4; T04 | Núcleo | O6 | Adoptado | La evaluación cerrada conserva la versión con la que se hizo. |

### 5.8 Instancias y candidatos

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-MOR-075 | Administrar **instancias** configurables (código, nombre, orden, días, tipo: candidatos, aviso, intimación, sensible, corte, tratamiento, cierre), sin límite de cantidad. | DFA M11; REL §6; CAT `INSTANCI`; V2 #2202, #2203, #2204 | Núcleo | O6 | Adoptado | Se precargan Candidatos, Primera instancia y Segunda instancia, y el tenant puede agregar Sensible y Corte. |
| RF-MOR-076 | Marcar en las instancias cuál es la de **candidatos**, la **inicial** de mora, la **sensible** (riesgo de corte) y la **de corte**. | V2 #2202, #2203, #2204; RN-04 §7.3 | Núcleo | O6 | Adoptado | La exportación ERSeP usa las marcas sensible y corte. |
| RF-MOR-077 | **Generar candidatos** con filtros de cuenta (geografía, zona, sector, recorrido), servicio, estado y categoría del servicio, clase de deuda (financiación o no), tipos de documento, fecha de deuda por emisión o VTO1, rango de montos, tipo de comprobante, opción "sin deuda". | RN-04 §7.2 paso 1–2 | Núcleo | O6 | Adoptado | Cada filtro reduce el universo según lo esperado. |
| RF-MOR-078 | Excluir cuentas con **excepción de mora** vigente con "no reclamar": la cuenta entera si no tiene fecha de deuda, o la deuda anterior a esa fecha. | RN-04 §7.2 paso 3 | Núcleo | O6 | Adoptado | Una excepción con fecha de deuda 01-06 deja fuera los documentos vencidos antes del 01-06. |
| RF-MOR-079 | Excluir cuentas ya notificadas con notificación abierta, salvo opciones de ignorar notificación previa, ignorar candidato previo, verificar solo la instancia inicial o excluir por el mismo tipo de notificación. | RN-04 §7.2 paso 4; V2 #39, #384, #2467, #3050 | Estándar | O6 | Adoptado | Con "ignorar notificación previa" desactivado, una cuenta notificada no se vuelve a cargar e informa el motivo. |
| RF-MOR-080 | Crear la notificación de candidato con **lote** nuevo, documentos incluidos con su saldo, deuda (suma de saldos) y deuda actualizada (con intereses sin diferir); no crear si la deuda es 0. | RN-04 §7.2 paso 5 | Núcleo | O6 | Adoptado | Una cuenta con deuda 0 no genera notificación. |
| RF-MOR-081 | Excluir de candidatos las deudas incluidas en convenios vigentes (se consideran las cuotas) y los documentos con reclamo de facturación en trámite sobre el importe reclamado. | AGR-014; BASE §68 excepciones | Núcleo | O6 | Adoptado | La deuda original de un convenio vigente no aparece como candidata. |
| RF-MOR-082 | Incluir o no titulares dados de baja en el informe de candidatos/circulares por defecto. | V2 #2306 | Estándar | O6 | Adoptado | La opción cambia el universo del informe. |

### 5.9 Notificaciones, entrega y constancias

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-MOR-083 | **Procesar** notificaciones abiertas hacia la instancia destino con filtros: vencidas al (vencimiento de la notificación), fecha, lote, cuenta, servicio, tipo de documento, barrio, localidad, empresa postal, deuda anterior a una fecha, deuda mayor a, cantidad mínima de documentos, clase, entregadas, con o sin promesa. | RN-04 §7.3 | Núcleo | O6 | Adoptado | Solo se procesan notificaciones abiertas con vencimiento cumplido y sin promesa vigente. |
| RF-MOR-084 | Al procesar: crear nueva notificación con nuevo lote, instancia destino, vencimiento, modelo/plantilla y entrega automática según configuración; incluir los documentos impagos de la anterior o toda la deuda vencida; recalcular deuda actualizada; dejar la anterior en Procesada si hay deuda o Pagada si no. | RN-04 §7.3 pasos 2–5 | Núcleo | O6 | Adoptado | La anterior queda Procesada y vinculada a la nueva. |
| RF-MOR-085 | Agregar una **nota en la cuenta** "Notificación de mora" (y "Notificación cerrada" al cerrar) visible en la ficha del titular. | RN-04 §7.3 paso 4, `Cerrar_Notificaciones` | Estándar | O6 | Adoptado | La ficha del titular muestra la nota con fecha e instancia. |
| RF-MOR-086 | Generar opcionalmente un **comprobante de deuda notificada** por titular o por cuenta, con el tipo de documento por defecto. | RN-04 §7.3 paso 6; V2 #2304, #2305 | Estándar | O6 | Adoptado | Con la opción por defecto activa, cada notificación genera su comprobante de deuda. |
| RF-MOR-087 | Generar opcionalmente un **costo de envío** de la notificación con concepto e importe (de la plantilla o del parámetro), solo si el cargo está habilitado con fundamento. | RN-04 §7.3 paso 1; V2 #295, #296 | Extensión | O6 | A validar (PA-MOR-12) | Sin habilitación normativa el costo no puede activarse. |
| RF-MOR-088 | Definir **modelos de aviso** por instancia (texto con variables, deuda mínima, firma del gerente/auditor, detalle por servicio, servicios incluidos, versión SMS/WhatsApp, plantilla de T09) con versión. | CAT `CIRCULAR`; RN-04 §7.1 `TipoNotificacion` | Núcleo | O6 | Adoptado | Cada notificación conserva la versión del modelo utilizada. |
| RF-MOR-089 | Canales: documento impreso, correo electrónico, SMS, WhatsApp, push de la app, aviso telefónico y talón de pago; el envío lo hace T09. El **aviso telefónico** (`phoneCall`) no es una llamada que haga CoopApps: se sirve por la exportación de contactos al discador de T09 (canal `ivr_export`, RF-COM-148) o, si el tenant la habilita, por la conexión opcional con un discador o IVR externo (FI-INT-66 de T06), que devuelve el resultado de cada llamada; no existe canal de voz propio (DEC-104). Sin conexión, la notificación queda "exportada" (no cuenta como entregada, RF-MOR-091) y su entrega se marca a mano con evidencia (RF-MOR-092). | RN-04 §7.1; DFA M11 mejoras; INV `GenerarAvisoTelefonico`, `GenerarNotificacion_MailSMS`; DEC-104 | Núcleo | O6 | Adoptado | Una notificación por correo crea un mensaje en T09 con referencia a la notificación. Un lote con aviso telefónico genera una exportación `ivr_export` en T09 con las cuentas del lote; con FI-INT-66 activa, una llamada atendida actualiza `delivery.status` de la notificación a `delivered`. |
| RF-MOR-090 | Antes de enviar por correo o SMS, listar las cuentas **sin dirección o sin celular** (por defecto, sin ambos correos: el de la cuenta y el del portal) y permitir descartarlas o derivarlas a otro canal. | RN-04 §7.6 `GetDatosCuentaSinMail`, `GetDatosPersonasSinNumero`; V2 #2327 | Estándar | O6 | Adoptado | La lista muestra las cuentas sin destinatario antes de confirmar. |
| RF-MOR-091 | Registrar estados del mensaje (creado, encolado, aceptado por el proveedor, entregado, leído, fallido, rebotado) y la **evidencia requerida** por instancia; una instancia que exige constancia no se considera notificada solo con "aceptado". | AGR-024 | Núcleo | O6 | Adoptado | Una intimación con correo rebotado queda "Sin constancia" y genera tarea de canal alternativo. |
| RF-MOR-092 | **Marcar entrega** manual o automática (y "todas entregadas"); con la entrega, el vencimiento de la notificación pasa a fecha de entrega + días configurados, solo extendiéndolo; desmarcar no revierte el vencimiento. | RN-04 §7.3 `Set_Entrega`; V2 #2205, #2206, #2279; INV `frmGestionMora_MarcarEntrega` | Núcleo | O6 | Adoptado | Entregada el 10-11 con 10 días, el vencimiento pasa a 20-11 si antes era menor. |
| RF-MOR-093 | Permitir fijar un vencimiento de notificación anterior a hoy solo si la política lo habilita. | V2 #2919 | Estándar | O6 | Adoptado | Sin la opción, la fecha pasada se rechaza. |
| RF-MOR-094 | Registrar **promesas de pago** con fecha e importe, que suspenden el avance hasta esa fecha; una promesa vencida incumplida retoma el circuito y se registra. | RN-04 §7.3 `Set_PromesaPago`; §10 informe de promesas | Núcleo | O6 | Adoptado | Con promesa al 25-11, la notificación no avanza antes de esa fecha. |
| RF-MOR-095 | **Calificar** al deudor (Sin calificar, Buena, Regular, Mala) y consultar el historial de notificaciones calificadas como antecedente. | RN-04 §7.1, §7.6 `Get_Notificaciones(cuenta)`; INV `frmGestionMora_Antecedentes` | Estándar | O6 | Adoptado | La pantalla de antecedentes muestra las calificaciones previas. |
| RF-MOR-096 | **Dar de baja** una notificación con causa (Excluida), **cerrar** notificaciones (con bloqueo de caja opcional), **anular un lote** (reabre el anterior) y **eliminar** notificaciones sin efectos económicos, todo auditado. | RN-04 §7.3; INV `frmGestionMora_BajaNotificacion`, `AnularGrupo`, `Cerrar_Notificacion` | Núcleo | O6 | Adoptado | Anular un lote reabre las notificaciones anteriores y deja rastro. |
| RF-MOR-097 | Registrar la **bitácora estructurada** de cada notificación (fecha, usuario, proceso, observación, estado anterior y nuevo). | RN-04 §7.3 `OBSERVA2` | Núcleo | O6 | Reemplazado por bitácora estructurada | El informe de promesas no parsea texto. |
| RF-MOR-098 | Avisar si cambió la **composición de la deuda** notificada (abonada o con saldo distinto) al consultar o procesar; distinguir documentos notificados de deuda nueva. | RN-04 §7.6 `ValidarNotificaciones`, `Get_DetalleComprobantes`; V2 #53 | Estándar | O6 | Adoptado | La grilla marca "abonada" o "composición cambió" sin cambiar el estado. |

### 5.10 Tratamiento de morosos

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-MOR-099 | Listar, para notificaciones abiertas con vencimiento cumplido y sin promesa vigente, los **servicios conectados** de la cuenta, con filtros de pagos parciales y cantidad de pagados. | RN-04 §7.3 `Get_Notificaciones_Mora`, §7.4 | Núcleo | O6 | Adoptado | Solo aparecen servicios en estado conectado. |
| RF-MOR-100 | Acciones disponibles por servicio: **suspensión/desconexión**, **cambio de estado** (restricción, reducción de velocidad u otro estado sin corte físico), **cambio de categoría**, **reclamo/incidente técnico**, **baja administrativa por mora** y **no facturar**. | RN-04 §7.4, §7.6; INV `frmTratamientoMorosos` | Núcleo | O6 | Adoptado | Cada acción crea un caso de interrupción con su tipo. |
| RF-MOR-101 | Rechazar la acción si ya existe una orden pendiente de la misma operación para el servicio. | RN-04 §7.4 | Núcleo | O6 | Adoptado | La segunda solicitud devuelve error "orden pendiente". |
| RF-MOR-102 | Toda acción pasa por la **evaluación normativa** del servicio (matriz de restricciones, protecciones, reclamos, ventanas) y, si corresponde, por aprobación. | BASE §14 criterio, §68, §70 | Núcleo | O6 | Informado | Una suspensión de un electrodependiente acreditado queda bloqueada. |
| RF-MOR-103 | Si el servicio **requiere técnica**, generar orden de trabajo hacia M10 con origen "gestión de mora", marca de moroso y vínculo a la notificación y al caso; si no requiere técnica, ejecutar el cambio directo (servicio, adherentes y beneficiarios) con confirmación. | RN-04 §7.4 `Guardar_OT_Desconexion`; RN-07 §4 | Núcleo | O6 | Adoptado | Internet con aprovisionamiento remoto genera orden con acción de red. |
| RF-MOR-104 | Armar los datos de la orden desde el servicio (medidor, domicilio del servicio, catastro, GPS, categoría, certificado) o desde la cuenta si el tratamiento es a nivel cuenta. | RN-04 §7.6 `Get_InfoOT` | Estándar | O6 | Adoptado | La orden muestra el domicilio del servicio. |
| RF-MOR-105 | Exigir observación técnica en la orden salvo que la política permita omitirla. | V2 #2694 | Estándar | O6 | Adoptado | Sin observación y sin permiso, la orden no se genera. |
| RF-MOR-106 | Marcar la notificación en estado **En técnica** al generar la orden, si la política lo indica. | RN-04 §7.1; V2 #2379 | Estándar | O6 | Adoptado | La notificación pasa a En técnica. |
| RF-MOR-107 | Generar desde tratamiento de morosos **comprobantes** (cargos admitidos) e **incidentes técnicos**, y notificar titulares. | INV `frmTratamientoMorosos.GenerarComprobantes`, `Generar_IncidenteTecnico`, `NotificarTitulares`, `frmTratamientoMorosos_Comprobantes` | Estándar | O6 | Adoptado | Los cargos solo pueden usar conceptos habilitados. |
| RF-MOR-108 | Para baja administrativa por mora: requerir política que la habilite para el servicio, instancia de corte cumplida y aprobación; nunca masiva por saldo agregado. | RN-04 §7.4 `Baja_Servicio`; BASE §68 límite | Estándar | O6 | Adoptado | Un lote de bajas exige aprobación individual o por lote con revisión por servicio. |

### 5.11 Excepciones y protecciones

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-MOR-109 | Administrar **excepciones de mora** por cuenta (o titular, o persona) con motivo, "no reclamar", "no retener/no cobrar interés", fecha hasta la que rige, deuda anterior a una fecha, fecha de cancelación, usuario que registra y que autoriza. | CAT `EXC_MORA`; RN-04 §7.2 paso 3, §6 prepaga; INV `abm_Exc_Mora` | Núcleo | O6 | Adoptado | Una excepción solo rige luego de ser autorizada. |
| RF-MOR-110 | **Autorizar y desautorizar** excepciones (doble control), con nota en la cuenta e impresión opcional del informe al confirmar. | INV `abm_Exc_Mora.Autorizar_Excepcion`, `Desautorizar_Excepcion`, `Guardar_Nota`, `Imprimir`; V2 #2328 | Estándar | O6 | Adoptado | Quien registra no puede autorizar la misma excepción si la política exige doble control. |
| RF-MOR-111 | Administrar **protecciones normativas** acreditadas por servicio y persona/suministro: electrodependencia, entidad pública, establecimiento de salud, establecimiento educativo, régimen temporal de emergencia, tarifa social u otras de la matriz; con evidencia, vigencia, fuente y verificación. | DFA M11 "electrodependientes, entidades públicas"; BASE §87 [ESP8–ESP9] | Núcleo | O6 | A validar (PA-MOR-07) | Una protección vencida deja de bloquear y genera alerta previa a su vencimiento. |
| RF-MOR-112 | Una protección de tipo **bloqueante** impide suspender, cortar o dar de baja por mora el servicio; una de tipo **revisión** exige aprobación específica. | BASE §52.4, §87 controles | Núcleo | O6 | A validar (PA-MOR-07) | El intento de suspender queda Bloqueado con el motivo. |
| RF-MOR-113 | Alertar al vencer o a N días de vencer una protección o excepción. | BASE §87 "vigencia" | Estándar | O6 | Adoptado | Se genera tarea al responsable 30 días antes (configurable). |
| RF-MOR-114 | Informe de excepciones por mora con motivo, vigencia, usuarios y deuda calculada en modo "diferir todo". | RN-04 §10; `Get_InformeExepcionMora` | Estándar | O6 | Adoptado | El informe lista cada excepción y su deuda. |
| RF-MOR-115 | Reconocer como protección temporal los **reclamos de facturación** en trámite (M09) sobre el importe reclamado y los **pagos informados** pendientes de acreditar (M07). | BASE §68 "Excepciones"; AGR-012 | Núcleo | O6 | Adoptado | Un reclamo abierto excluye el documento reclamado de la evaluación. |
| RF-MOR-116 | Administrar **causas** codificadas por tipo (baja de notificación, corte, baja de servicio, bloqueo, excepción, caducidad, incobrable). | CAT `CAUSAS`; DFA M11 "Causas de Baja"; REL §6 | Núcleo | O6 | Adoptado | Cada acción con causa exige una del tipo correcto. |

### 5.12 Corte y reconexión

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-MOR-117 | Crear **casos de interrupción** por servicio con tipo, motivo, instancia que lo origina, evaluación, aprobación, orden, confirmación y comunicación al socio. | BASE §53; MER-019; AGR-003 | Núcleo | O6 | Adoptado | Cada caso puede explicarse por sus transiciones (§8). |
| RF-MOR-118 | Generar la **orden de corte** al cumplirse la instancia de corte y enviarla a la cuadrilla o al aprovisionamiento remoto, siempre con los controles de la política. | MER-019; DFA M11 flujo | Núcleo | O6 | Informado | La orden llega a M10 con origen `delinquency` y referencia al caso. |
| RF-MOR-119 | Respetar **ventanas de ejecución** por servicio y jurisdicción (días y horarios permitidos, feriados y vísperas, condiciones climáticas o de emergencia declaradas). La plantilla por defecto de electricidad en Córdoba (ERSeP) se define en RF-MOR-221 (HUE-ELE-05). | BASE §70; matriz | Núcleo | O6 | A validar (PA-MOR-10) | Una orden fuera de ventana queda programada para la próxima ventana válida. |
| RF-MOR-120 | Exigir **preaviso** mínimo con constancia de entrega antes de suspender, por servicio. | BASE §70 [CTA-F2]; AGR-024 | Núcleo | O6 | A validar (PA-MOR-06) | Sin constancia de la intimación previa, la suspensión queda Pendiente de evidencia. |
| RF-MOR-121 | **Cancelar la orden de corte pendiente** si se confirma el pago de la deuda que la originó antes de su ejecución; quitar la marca de moroso si no hay reconexión pendiente. | V2 #2917, #3033 | Núcleo | O6 | Adoptado | Un pago confirmado antes de la visita cancela la orden y avisa a la cuadrilla. |
| RF-MOR-122 | **Reconexión automática** al regularizar: evaluar con el criterio de deuda configurado (toda, vencida al VTO1, vencida al último vencimiento, solo del mismo servicio/tipo, o sin notificaciones abiertas con deuda del servicio). | RN-04 §7.5; V2 #3147, #3113, #3163 | Núcleo | O6 | A validar (PA-MOR-11) | Saldada la deuda del servicio, se crea el caso de reconexión. |
| RF-MOR-123 | La reconexión automática aplica solo a servicios **suspendidos por mora** vinculados a un caso de interrupción (no por ventana de días). | RN-04 §7.5 ventana 15 días; §13.9 | Núcleo | O6 | Adoptado | Un servicio dado de baja por pedido del socio no se reconecta por un pago. |
| RF-MOR-124 | Para servicios sin técnica, reconectar directamente; con técnica, generar orden de reconexión y, si la política lo permite y hay aprovisionamiento remoto confirmable, confirmarla automáticamente con la respuesta de T06. | V2 #3112, #3106, #2713, #2926; RN-07 §4 `Confirmar_OT_Reconectar` | Núcleo | O6 | Adoptado | Internet: pago confirmado → acción MikroTik → respuesta OK → servicio activo. |
| RF-MOR-125 | Si el sistema remoto devuelve error o no hay sistema vigente, la orden **vuelve a pendiente** y el servicio no se marca reconectado. | RN-07 §4 (error de telemedición, OT vuelve a Pendiente) | Núcleo | O6 | Adoptado | Un error de red deja el caso "Ejecución fallida" con tarea al técnico. |
| RF-MOR-126 | Generar el **cargo de reconexión** según reglas (servicio, socio activo, moroso, prepago, zona, localidad, categoría, clase, estado, propiedad; una sola vez; antes o después de ejecutar), solo si el cargo está habilitado con fundamento; por defecto gratuito. | RN-04 §7.5 `Get_CONEXION`; BASE §52.3, §53 | Estándar | O6 | A validar (PA-MOR-12) | Sin habilitación, la reconexión no genera cargo. |
| RF-MOR-127 | Al reconectar servicios de cargo proporcional, generar **crédito por días sin servicio** o débito por días restantes según política, con confirmación opcional y concepto propio; actualizar fecha de alta para no medidos reconectados en el mismo mes; tomar el día de reconexión para el proporcional. | RN-04 §7.5; V2 #2483, #2485, #2661, #2907, #2707, #2787 | Estándar | O6 | Adoptado | Reconexión el día 20 de un abono mensual con crédito por días: crédito de 19 días. |
| RF-MOR-128 | Validar la reconexión: titular fallecido (permitida o no), factibilidad exigida en servicios que informan a técnica, inspección de rehabilitación en gas. | V2 #2301, #388; BASE §89 | Núcleo | O6 | Adoptado | Gas: la reconexión exige inspección aprobada. |
| RF-MOR-129 | Al confirmar la desconexión, marcar medidor retirado por defecto o preguntar al técnico, según política (servicios medidos). | V2 #2440, #2531 | Estándar | O7 | Adoptado | La confirmación muestra la pregunta si está configurada. |
| RF-MOR-130 | Impactar las operaciones de cambio de estado (desconexión y reconexión) en sistemas externos (Discar, SITSA, AION, MikroTik, RADIUS, SmartOLT) mediante T06. | V2 #3116, #3034, #3035; RN-07 §4 | Núcleo (Internet) / Estándar (resto) | O6 (Internet) / O7 (medidos) | Adoptado | La acción de red queda registrada con su respuesta. |
| RF-MOR-221 | Precargar en el catálogo normativo de plataforma (API-MOR-51) la **plantilla de ventana de corte ERSeP** para electricidad en Córdoba (días hábiles, sin vísperas ni feriados, horario configurable, suspensión por alerta meteorológica o temperatura extrema), marcada `toValidate` hasta su validación legal; el tenant la adopta o la reemplaza. | HUE-ELE-05; RF-MOR-119; PA-MOR-10 | Núcleo | O7 | A validar (PA-MOR-10) | Con la plantilla adoptada y sin validar, una orden de corte de ELE pasa a `review`; ya validada, una orden generada un viernes víspera de feriado se reprograma al siguiente día hábil (RN-MOR-145). |
| RF-MOR-222 | Configurar por servicio el **modo de suspensión por mora** (`restricted` o `interrupted`) y su perfil (bloqueo saliente en TEL, grilla mínima en TV, reducción de caudal en AG), validado contra los modos admitidos de la matriz; CLO no admite ninguno. Habilitable por tenant (TEL, TV) o por concesión (AG, CLO). | HUE-TEL-04; HUE-TV-03; HUE-AG-02; HUE-CLO-01 | Estándar | O10 (TEL, TV) / O7 (AG, CLO) | Adoptado | Guardar una política de CLO con `finalAction.type = suspend` falla con `mor/mode-not-allowed`; una política TEL con `interrupted` sin habilitación del tenant también. |
| RF-MOR-223 | Excluir de la evaluación de interrupción la deuda de conceptos de terceros (RN-MOR-141) y del saldo elegible e intereses salvo convenio (RN-MOR-142), mostrando en la evaluación el importe excluido y su motivo. | HUE-ALU-01; HUECO-TAS-02 | Núcleo | O6 (saldo elegible) / O7 (corte) | Adoptado | Un socio que solo adeuda la tasa de alumbrado no llega a instancia de corte del servicio ELE; la evaluación muestra "deuda de terceros excluida". |
| RF-MOR-224 | Informar a M18 la condición "cobertura suspendida por mora" según la restricción `socialCoverageSuspension` (RN-MOR-143), mediante EVT-MOR-21 `mor.socialCoverage.suspended` / `.restored` (idempotente por contrato y fecha de cambio) y crear la tarea de revisión del aporte impago de banco de sangre en la bandeja del responsable del servicio social (RN-MOR-144), sin generar casos de interrupción. | HUECO-SEP-01; HUECO-SAN-02 | Estándar | O10 | Adoptado | Con 3 meses impagos y la restricción activa, M18 consulta la condición y la verificación de cobertura la rechaza; un aporte impago de banco de sangre crea una sola tarea por contrato y período y ningún caso de interrupción. |

### 5.13 Baja, suspensión y reactivación (BASE §53)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-MOR-131 | Recibir la **baja** desde el canal del usuario (portal, app, landing pública sin registro cuando corresponda), con registro, constancia, seguimiento y ejecución **sin cargo por solicitarla**. | BASE §53 CIC-001; §52.3 | Núcleo | O6 | Informado | Una baja de Internet desde la landing devuelve código identificador al instante y por el mismo medio dentro de 24 h. |
| RF-MOR-132 | No supeditar la solicitud de baja a pagar deuda, completar un registro o aceptar un cargo; conservar deuda previa y documentos históricos. | BASE §52.3, §53 | Núcleo | O6 | Informado | Una cuenta con deuda puede solicitar la baja. |
| RF-MOR-133 | **Suspensión temporal** solicitada por el socio con duración, motivo y fecha efectiva, si el servicio la admite. | BASE §53 CIC-002 | Estándar | O6 | Informado | Internet permite suspender de 1 a N meses según configuración del servicio. |
| RF-MOR-134 | **Suspensión por otro motivo** (técnico, seguridad, orden de autoridad, uso indebido) distinta de la suspensión por mora. | BASE §53 límite | Estándar | O6 | Informado | El tipo de caso queda distinguido en informes. |
| RF-MOR-135 | **Reactivación** por condiciones y actuaciones correspondientes; reactivar un contrato cerrado puede requerir nueva alta según el servicio. | BASE §53 CIC-003, límite | Núcleo | O6 | Informado | Internet dado de baja exige nueva alta; Internet suspendido se reactiva. |
| RF-MOR-136 | **Modalidades con y sin costo**: política configurable y validada por servicio y jurisdicción; la baja siempre gratuita; costos admisibles solo con respaldo; la regla arancelada de demostración está deshabilitada para producción. | BASE §53 CIC-004, precargas | Núcleo | O6 | Informado | La regla REACT-DEMO-ARANCEL no puede activarse en un tenant productivo sin aprobación del responsable normativo. |
| RF-MOR-137 | Presentar las opciones disponibles según servicio y situación; informar fecha solicitada, plazo de respuesta, efecto esperado y eventual costo habilitado; conservar la aceptación de condiciones para operaciones aranceladas. | BASE §53 | Núcleo | O6 | Informado | La app muestra costo ARS 0 o el costo habilitado y guarda la aceptación. |
| RF-MOR-138 | Ingresar la gestión al CRM con orden técnica si se requiere; registrar el momento real de suspensión o reactivación y su comunicación al socio. | BASE §53 | Núcleo | O6 | Informado | El caso registra fecha real de ejecución distinta de la de solicitud. |
| RF-MOR-139 | Determinar cargos recurrentes, pausas, mínimos y prorrateo durante la suspensión a partir de reglas aprobadas (sin presumir que todo abono se detiene). | BASE §53 | Estándar | O6 | Informado | Una suspensión voluntaria de Internet aplica la regla de pausa de abono configurada. |
| RF-MOR-140 | Evitar cobros o ejecuciones duplicadas por reintentos (idempotencia) y no anunciar "reactivado" por la sola confirmación del pago de un cargo. | BASE §53 control; AGR-016 | Núcleo | O6 | Informado | Dos clics de "reactivar" generan un único caso. |

### 5.14 Planes de pago y convenios (AGR-014)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-MOR-141 | **Segmentar deuda** por antigüedad, monto y situación y administrar **expedientes de seguimiento** con contactos, compromisos, respuestas y próximos pasos. | BASE §14 | Estándar | O6 | Informado | El tablero de deuda segmenta por tramos de antigüedad 0–30, 31–60, 61–90, 91–180, >180 días. |
| RF-MOR-142 | **Simulador** de plan: deuda seleccionable, anticipo, cantidad de cuotas, tasa, método, quitas, sellado, primer vencimiento, con cronograma, total, intereses, impuestos, TNA, TEM, TEA y **CFT**. | DFA M12 mejoras; BASE §14 "simular alternativas" | Núcleo | O6 | Adoptado | El simulador muestra el CFT y el cronograma completo antes de confirmar. |
| RF-MOR-143 | Calcular cuotas con los métodos **sin interés, interés directo, francés, alemán, americano y cuotas con saldo**. | RN-04 §8.1, §8.5; MER-019 | Núcleo | O6 | Adoptado | Las fórmulas reproducen los ejemplos de §17. |
| RF-MOR-144 | Calcular la **cantidad de cuotas para un importe de cuota objetivo** respetando mínimos y máximos del plan, con avisos. | RN-04 §8.6 `GetCantidadCuotas` | Estándar | O6 | Adoptado | Pedir cuota de ARS 10.000 sobre ARS 45.000 devuelve 5 cuotas. |
| RF-MOR-145 | Seleccionar las **obligaciones incluidas** verificando que no estén en otro convenio vigente ni bloqueadas por gestión judicial sin autorización; respetar mínimo y máximo de documentos. | BASE §14 CU-14; V2 #672, #2208 | Núcleo | O6 | Informado | Un documento ya incluido en otro convenio no puede seleccionarse. |
| RF-MOR-146 | Componer el convenio: capital, interés anterior (de financiaciones previas), interés por mora a la fecha, quitas, entrega, sellado y tasas, conservando por documento capital, interés entre vencimientos e interés por mora. | RN-04 §8.3 `GetRecCon`, `GetItRecco`; §8.7 | Núcleo | O6 | Adoptado | La suma de componentes iguala la deuda total incluida. |
| RF-MOR-147 | **Aprobar condiciones especiales** fuera del plan (más cuotas, mayor quita, menor anticipo, tasa distinta) mediante workflow T11. | BASE §14 | Núcleo | O6 | Informado | Un convenio fuera de plan queda Pendiente de aprobación. |
| RF-MOR-148 | Registrar el convenio en forma **transaccional**: sustituir/bloquear las obligaciones de origen, cerrar notificaciones abiertas, generar cuotas y cargos de entrega/sellado, y registrar capital social si corresponde. | RN-04 §8.3 `RegistrarFinanciacion`, §8.9 | Núcleo | O6 | Adoptado | Un fallo intermedio revierte todo; no quedan cuotas huérfanas. |
| RF-MOR-149 | Modalidad de cuotas: **cuota en factura mensual** (cargo pendiente) o **cuota como documento propio** (chequera), con modalidad por defecto y permiso para cambiarla. | RN-04 §8.3; V2 #306, #2299 | Núcleo | O6 | Adoptado | En modo factura mensual, la cuota aparece en la factura del período de su vencimiento. |
| RF-MOR-150 | Anticipo (cuota 0) con vencimiento hoy; el convenio queda **Pendiente de anticipo** hasta su pago confirmado y no se marca cumplido ni vigente. | BASE §14 CU-14 excepción; RN-04 §8.6 | Núcleo | O6 | Informado | Sin pago del anticipo en el plazo, el convenio pasa a Caído sin anticipo y las obligaciones de origen se restituyen. |
| RF-MOR-151 | Validar límites: máximo de convenios por período (con fechas del período de control), una sola financiación activa del mismo tipo, importe mínimo de cuota, mínimo y máximo financiable, entrega mínima (opcionalmente sobre total con IVA), capital no negativo, submódulo de facturación no cerrado. | RN-04 §8.9; V2 #671, #674, #675, #735, #673 | Núcleo | O6 | Adoptado | Superar el máximo de convenios bloquea o advierte según política. |
| RF-MOR-152 | Permitir imputar el convenio a **otra cuenta** (con titular y situación fiscal de la cuenta destino) solo si la política lo habilita. | RN-04 §8.7; V2 #2634 | Extensión | O6 | Adoptado | La cuota se emite a la cuenta destino. |
| RF-MOR-153 | Generar el **texto del convenio** desde plantilla con y sin garante (el plan puede sobrescribirla), imprimirlo automáticamente si se configura, y conservar el PDF con hash. | RN-04 §8.3; V2 #507, #214, #2252; `NRO_CONRE`/`NRO_CN2` | Núcleo | O6 | Adoptado | El PDF del convenio se archiva en el expediente de T11. |
| RF-MOR-154 | Registrar **firmantes** (titular, codeudor, garantes, representante) y sus **firmas** (presencial en tableta, aceptación electrónica con OTP y evidencia, firma digital como extensión). | DFA M12 `PPAGOS_FIRMANTES`, `PPAGOS_FIRMAS` (modelo de referencia; esas tablas son de órdenes de pago, CTR-DAT-52); mejora "firma digital" | Núcleo | O6 | A validar (PA-MOR-16) | El convenio pasa a Vigente solo con todas las firmas exigidas. |
| RF-MOR-155 | **Controlar cumplimiento e incumplimiento** de cuotas y anticipo; informar estado de cuotas (vencidas impagas, cantidad e importe). | BASE §14; RN-04 §8.12 `GetEstadoCuotas` | Núcleo | O6 | Informado | El convenio muestra 2 cuotas vencidas impagas por ARS 30.000. |
| RF-MOR-156 | **Caída automática** del convenio por incumplimiento según la regla del plan, con aviso previo, y **reexigibilidad** del saldo pendiente. | DFA M12 mejoras; AGR-014; RN-04 §8.13 | Núcleo | O6 | A validar (PA-MOR-13) | Con 3 cuotas impagas el convenio pasa a Caído y el saldo pendiente queda exigible. |
| RF-MOR-157 | **Rehabilitar** un convenio caído con aprobación si se regulariza dentro del plazo de la política. | AGR-014 (derivado) | Estándar | O6 | Adoptado | Pagando las cuotas atrasadas dentro de 15 días se rehabilita con aprobación. |
| RF-MOR-158 | **Refinanciación**: incluir cuotas impagas de otro convenio descomponiéndolas en capital, interés anterior y mora anterior; cerrar el convenio anterior como Refinanciado. | RN-04 §8.7; BASE §14 | Núcleo | O6 | Adoptado | El convenio refinanciado queda vinculado al nuevo. |
| RF-MOR-159 | **Cancelación anticipada** total o parcial con bonificación del interés de financiación no devengado (cuotas adelantadas), según conceptos configurados. | BASE §23 "cancelación anticipada"; RN-04 §8.8; V2 #2607, #2624 | Núcleo | O6 | Adoptado | Cancelar 3 cuotas antes de su vencimiento bonifica su interés de financiación. |
| RF-MOR-160 | **Anular** un convenio solo sin cuotas pagas ni facturadas, sin pago del sellado y sin notificaciones asociadas (o tras resolverlas), con permiso y confirmación; restituir obligaciones de origen (saldo y fecha de saldo), anular cuotas, cargos y sellado; nunca borrar. | RN-04 §8.10 | Núcleo | O6 | Adoptado | Un convenio anulado conserva su historia y las facturas originales recuperan su saldo. |
| RF-MOR-161 | **Ajuste por índice** de cuotas (tabla de índices del plan con rezago configurable y concepto de ajuste) y aviso si falta el índice. | RN-04 §8.8; CAT `INFLACIO`/`TABINFL` (series de T04, CTR-DAT-29) | Estándar | O6 | Adoptado | Si falta el índice se genera alerta y la cuota no se emite sin decisión. |
| RF-MOR-162 | **Recalcular cuotas** impagas por cambio de situación de IVA o de alícuota de percepción IIBB del padrón: manteniendo netos (cambia el total) o manteniendo el total (reajusta netos). | RN-04 §8.11; V2 #757 | Estándar | O6 | Adoptado | El recálculo genera ajuste trazable por cuota. |
| RF-MOR-163 | **Mora de cuotas**: tasa general o recargo diario propio del plan. | RN-04 §8.4 `MORA_PARTI`/`REC_DIAMF` | Estándar | O6 | Adoptado | Una cuota de un plan con recargo propio usa esa tasa. |
| RF-MOR-164 | **Quitas** sobre interés anterior y sobre interés por mora (porcentaje), con opción de **no capitalizar** la mora. | RN-04 §8.1, §8.6 | Núcleo | O6 | Adoptado | Quita 50 % de mora sobre ARS 2.000 → ARS 1.000. |
| RF-MOR-165 | **Sellado** (tasa por mil) en la cuota 0 o en documento propio, con concepto propio. | RN-04 §8.6 sellado; V2 #676 | Estándar | O6 | Adoptado | Sellado 10 ‰ sobre ARS 60.000 = ARS 600 (valor ilustrativo). |
| RF-MOR-166 | Separar el IVA del capital y del interés de cada cuota con los conceptos de capital, interés por mora, interés anterior, interés de financiación y sellado; tratar tasa con IVA incluido. | RN-04 §8.3, §8.6; V2 #310, #307, #311, #607, #676, #308 | Núcleo | O6 | Adoptado | La cuota muestra capital, intereses e IVA por concepto. |
| RF-MOR-167 | Efecto de la **baja del servicio** sobre un convenio vigente: el convenio sigue exigible salvo política distinta; la baja no se condiciona al convenio. | AGR-014 "efecto de baja del servicio"; BASE §52.3 | Estándar | O6 | Adoptado | Dar de baja Internet no anula el convenio. |
| RF-MOR-168 | Aplicación de pagos a cuotas (orden por vencimiento) coordinada con M07; pagos que exceden la cuota se imputan a la siguiente o quedan a favor según AGR-012. | AGR-014; AGR-012 | Núcleo | O6 | Adoptado | Un pago de 1,5 cuotas cancela la vencida y deja media cuota imputada a la siguiente. |
| RF-MOR-169 | Consultas: cuotas del convenio (todas o a pagar), liquidación de crédito o talonario de cuotas, comprobantes financiados del convenio, conceptos financiados. | RN-04 §8.12 | Estándar | O6 | Adoptado | La ficha imprime el talonario. |
| RF-MOR-170 | **Conciliar** deuda de origen, pagos, capital pendiente y cargos del acuerdo sin doble exigencia ni cuotas huérfanas. | AGR-014 criterio | Núcleo | O6 | Adoptado | El reporte de conciliación cierra a cero diferencias. |

### 5.15 Planes de cuotas y entidades financieras

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-MOR-171 | ABM de **planes de pago**: tipo de pago (entrega y cuotas / cuotas sin entrega), período entre cuotas, cantidad sugerida/mínima/máxima, tasas (TNA, TEM, tasa por período), método, mínimos y máximos financiables, mínimo para modificar, entrega mínima, sellado, tasa con IVA, quitas, mora particular, ajuste por índice, no capitalizar, plantillas del convenio, regla de caducidad, finalidad (regularización / venta). | RN-04 §8.1, §8.4; CAT `PLAN_CUO` | Núcleo | O6 | Adoptado | Un plan no se publica con mínimo de cuotas mayor que el máximo. |
| RF-MOR-172 | Cargar la tasa en una unidad declarada (TNA o TEM) y derivar la **tasa por período**; las tasas informativas se calculan, no se copian. | RN-04 §8.4 [VERIFICAR] unidad de `TASA`; §13.15 | Núcleo | O6 | A validar (PA-MOR-15) | Con TNA 60 % y período mensual, la tasa por período es 5 %. |
| RF-MOR-173 | Catálogo de **métodos de cálculo** (tipos de financiación) con fórmula y descripción. | CAT `TIP_FIN` | Núcleo | O6 | Adoptado | Los seis métodos están disponibles. |
| RF-MOR-174 | ABM de **entidades financieras** (tarjetas, bancos, financieras) con planes de cuotas, coeficientes, comisiones, plazos de acreditación y vigencia. | DFA M12 `ENTFIN`, `TIP_FIN` | Estándar | O6 | Adoptado | Un plan de tarjeta en 3 cuotas aplica su coeficiente. |
| RF-MOR-175 | Tipo de documento por defecto para emitir la financiación. | V2 #2471 | Estándar | O6 | Adoptado | La cuota usa el tipo por defecto si no se indica otro. |
| RF-MOR-176 | Ofrecer el motor de amortización a M11 para venta financiada y factura en cuotas (conceptos de interés de venta, diferencia de cotización), sin mezclarlo con la regularización. | BASE §23 criterio; RN-04 §8.8; V2 #2089, #2289, #2512, #733 | Estándar | O6 | Adoptado | Una venta en cuotas no figura en informes de convenios de regularización. |

### 5.16 Garantías y garantes (MER-005)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-MOR-177 | Registrar **garantes** (persona de M01) y **garantías** (depósito en garantía, aval, pagaré, fianza, seguro de caución) asociados a contratos, convenios o cuentas, con monto, vigencia y documentación. | MER-005; RN-04 §8.12 `ModificarGarante` | Estándar | O6 | Adoptado | Un convenio con garante usa la plantilla con garante. |
| RF-MOR-178 | Exigir garantía en ciertas contrataciones por regla (inquilinos, grandes usuarios, categoría, servicio), habilitable por tenant. | MER-005 | Estándar | O6 | A validar (PA-MOR-19) | Un alta de gran usuario con regla activa queda pendiente de garantía. |
| RF-MOR-179 | **Aplicar o devolver** el depósito en la baja con liquidación e imputación trazables (contra deuda o devolución por M14). **Ampliado (HUECO-OTR-04):** la devolución se hace por defecto como crédito a la cuenta del socio en M07 (`refundMode = accountCredit`, RF-COB-190); el pago por M14 queda para `refundMode = treasury` o para el reintegro que pida el titular. Aplica también al depósito del préstamo ortopédico de M18 (RF-SOC-113). | MER-005; HUECO-OTR-04 | Estándar | O6 | Adoptado | La liquidación muestra deuda aplicada y saldo a devolver; con `accountCredit`, EVT-MOR-16 `.refunded` lleva `refundMode` y M07 crea el saldo a favor. |
| RF-MOR-180 | Cambiar el garante de un convenio con validación (persona válida, firma del nuevo garante) y regenerar la plantilla si cambia el tipo con/sin garante. | RN-04 §8.12 `ModificarGarante` (sin validación) | Estándar | O6 | Adoptado (Mejorar) | Cambiar el garante exige su firma. |
| RF-MOR-181 | Ejecutar la garantía ante incumplimiento (notificación al garante como destinatario adicional de la gestión de mora). | MER-005; BASE §14 | Estándar | O6 | Adoptado | La instancia configurada notifica también al garante. |
| RF-MOR-182 | Actualizar el depósito en garantía por índice o regla, si la política lo indica. | MER-005 (derivado) | Extensión | O8 | Adoptado | La actualización genera documento trazable. |

### 5.17 Incobrables y gestión externa o judicial (MER-006)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-MOR-183 | **Derivar deuda a gestión externa o judicial** con expediente: documentos incluidos, estudio o agencia a cargo, fecha, estado, gastos, honorarios, movimientos procesales y vencimientos. | MER-006 | Estándar | O6 | Adoptado | El expediente lista sus documentos y su estudio. |
| RF-MOR-184 | La deuda derivada queda marcada y excluida de la gestión de mora interna mientras el expediente esté activo; los pagos se siguen imputando a la deuda original (M07). | MER-006 "recuperos posteriores imputados a la deuda original" | Estándar | O6 | Adoptado | Un pago parcial actualiza el expediente. |
| RF-MOR-185 | Portal o API para **estudios externos** con alcance a sus expedientes: consultar deuda actualizada, registrar avances y gastos. | MER-006; CNX §2.4 (alcance propios) | Extensión | O6 | Adoptado | El estudio A no ve expedientes del estudio B. |
| RF-MOR-186 | Registrar **gastos y honorarios** con su tratamiento: a cargo de la cooperativa o trasladables al deudor solo con título (sentencia o convenio). | MER-006 | Estándar | O6 | A validar (PA-MOR-18) | Un gasto sin título no se carga al deudor. |
| RF-MOR-187 | Cerrar el expediente por pago, convenio, incobrable, prescripción o desistimiento, con causa. | MER-006 | Estándar | O6 | Adoptado | El cierre exige causa. |
| RF-MOR-188 | **Declarar incobrables** con propuesta, criterio (antigüedad, gestión agotada, monto, fallecimiento, insolvencia, prescripción), aprobación y efecto contable, sin borrar la deuda del historial. | MER-006 | Estándar | O6 | A validar (PA-MOR-17) | El documento declarado incobrable conserva su saldo histórico y queda en estado Incobrable. |
| RF-MOR-189 | Revertir un incobrable ante recupero, imputando el recupero a la deuda original y publicando el evento contable. | MER-006 | Estándar | O6 | Adoptado | Un recupero genera asiento de recupero. |
| RF-MOR-190 | Previsión por antigüedad (informe para contabilidad) separada del castigo. | MER-006 (efecto contable) | Estándar | O8 | Adoptado | El informe de previsión por tramos alimenta M15. |
| RF-MOR-191 | Excluir incobrables de la evaluación de mora y de los informes operativos, manteniéndolos en informes históricos. | MER-006 | Estándar | O6 | Adoptado | La deuda incobrable no genera candidatos. |
| RF-MOR-192 | Mantener la relación de incobrables y expedientes con la persona, de modo que un alta nueva advierta deuda incobrable previa (sin bloquear la baja ni un alta exigible). | MER-006; BASE §52.3 | Estándar | O6 | Adoptado | Un alta de la misma persona muestra aviso de deuda castigada. |

### 5.18 Prescripción

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-MOR-193 | Configurar **plazos de prescripción** por tipo de obligación (servicio, tipo de documento, cuota de convenio) con fecha de cómputo (emisión o VTO1) y causales de interrupción/suspensión (reconocimiento de deuda, convenio, gestión judicial). | MER-006 "según el plazo legal que corresponda a cada obligación"; V2 #104 | Estándar | O6 | A validar (PA-MOR-20) | Un convenio firmado reinicia el cómputo de las obligaciones incluidas. |
| RF-MOR-194 | Informe **Deuda a prescribir**: documentos con saldo cuyo cómputo supera el plazo, agrupados por cuenta, con fecha por defecto hoy menos el plazo. | RN-04 §9, §14 | Estándar | O6 | Adoptado | El informe lista los documentos con VTO1 anterior al corte. |
| RF-MOR-195 | **Registrar la prescripción** con propuesta y aprobación: emitir el documento de signo contrario con el concepto elegido e imputarlo (M05/M07), con cuenta contable de prescripción; la deuda queda en estado Prescripta en el historial. | RN-04 §9 `Registrar_PrescripcionDeuda`; V2 #2158 | Estándar | O6 | Adoptado | La factura prescripta conserva su historia y su saldo queda cancelado por el documento de prescripción. |
| RF-MOR-196 | Alertar documentos próximos a prescribir con gestión pendiente (para interrumpir el plazo con acciones válidas). | MER-006 "controlar la antigüedad" | Estándar | O6 | Adoptado | 60 días antes se genera alerta al responsable de recupero. |
| RF-MOR-197 | No calcular interés ni notificar deuda prescripta. | MER-006 (derivado) | Estándar | O6 | Adoptado | La deuda prescripta no genera candidatos. |

### 5.19 Informes, tableros y exportaciones

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-MOR-198 | Informes de gestión de mora: deuda a prescribir, notificaciones pendientes (sin candidatos), titulares notificados (deuda notificada, actualizada o detalle), excepciones por mora, servicios del lote notificado, promesas de pago, resumen de notificaciones. | RN-04 §10; V2 #2322 | Estándar | O6 | Adoptado | Cada informe declara fórmula, universo y fecha de corte (§15). |
| RF-MOR-199 | **Informe de servicios a cortar** (lote, cuenta, medidor, meses de deuda, deuda) y **totales por servicio**. | RN-04 §10 `Get_CortarServicio`, `Get_TotalesServicio`; INV `Imprimir_CortarServicio`, `Imprimir_TotalesServicio` | Núcleo | O6 | Adoptado | Meses de deuda = días desde el VTO1 más antiguo / 30, truncado. |
| RF-MOR-200 | Informe de deuda (`Get_InformeDeuda`) y composición por antigüedad. | RN-04 §10 | Estándar | O6 | Adoptado | Coincide con el saldo de M07 a la fecha de corte. |
| RF-MOR-201 | Informes de financiación: financiaciones del período, por plan, comprobantes y conceptos financiados, cuotas de un convenio, estado general de cuotas, cuotas facturadas y cuotas adeudadas a una fecha. | RN-04 §8.3, §8.12 | Estándar | O6 | Adoptado | "Cuotas adeudadas a fecha" incluye las cuotas anuladas en sección aparte. |
| RF-MOR-202 | **Exportación regulatoria** de condición de mora por cuenta (ej. ERSeP: "R/C" en riesgo de corte o "A"), parametrizable por regulador. | RN-04 §7.3 (DNU 311/2020) | Estándar | O7 | Adoptado | La exportación marca R/C las cuentas en instancia sensible o de corte. |
| RF-MOR-203 | **Exportación a herramientas de envío masivo** (cuenta, cantidad de comprobantes, deuda, deuda actualizada, correo) cuando el envío no se haga por T09. | RN-04 §10 `ExportarDopler`; INV `ExportarCirculares` | Extensión | O6 | Adoptado | El archivo respeta el consentimiento de comunicaciones. |
| RF-MOR-204 | Tablero de mora: deuda vencida por tramo, cuentas por instancia, tasa de recupero por instancia, promesas cumplidas, cortes ejecutados/cancelados/bloqueados, tiempos de reconexión, convenios vigentes/caídos. | BASE §14; AGR-022 | Estándar | O6 | Adoptado | Cada indicador tiene fórmula en §15. |
| RF-MOR-205 | Impresión de notificaciones agrupadas por **titular** (domicilio de la cuenta principal) con ordenamientos: cuenta, titular, deuda, lote, fecha, calle y número, zona/sector/recorrido, empresa postal. | RN-04 §7.6 `Get_NotificacionesAgrupadasTitular`; INV `frmImprimirNotificacion` | Estándar | O6 | Adoptado | Un titular con 3 cuentas recibe una sola carta. |
| RF-MOR-206 | Reimprimir notificaciones y consultar notificaciones por cuenta con deuda notificada. | INV `frmConsultaNotificaciones` | Estándar | O6 | Adoptado | La reimpresión usa la misma versión de modelo. |

### 5.20 Portal y app del socio

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-MOR-207 | El socio ve su **deuda vencida** con recargo cotizado a hoy, el detalle del cálculo y los importes por vencimiento. | BASE §97.3; RN-04 §4 | Núcleo | O6 | Adoptado | El importe del portal coincide con la caja. |
| RF-MOR-208 | El socio ve sus **avisos de mora**, instancia, vencimiento y constancia, y el riesgo de suspensión con fecha estimada. | AGR-024; BASE §53 | Núcleo | O6 | Adoptado | La app muestra "Riesgo de suspensión desde 20-11" si la instancia es sensible. |
| RF-MOR-209 | El socio **simula y solicita** un plan dentro de los planes habilitados para autogestión; acepta y firma; paga el anticipo en línea. | DFA M12 mejoras; BASE §14 | Estándar | O6 | Adoptado | El convenio aceptado por app queda Pendiente de anticipo. |
| RF-MOR-210 | El socio registra una **promesa de pago** si la política lo permite. | RN-04 §7.3 | Extensión | O6 | Adoptado | La promesa queda en la bitácora con canal "app". |
| RF-MOR-211 | El socio solicita **suspensión voluntaria** o **reactivación** y ve el estado real del caso ("Reactivación en trámite" hasta confirmación). La suspensión voluntaria se habilita por servicio en M02 y está deshabilitada por defecto (DEC-031). | BASE §53 CU-CIC-01; §89 | Núcleo | O6 | Informado | No muestra Activo hasta la confirmación técnica. |
| RF-MOR-212 | El socio ve sus convenios, cuotas, próximas a vencer, y puede cancelar anticipadamente. | BASE §23; AGR-014 | Estándar | O6 | Adoptado | La cancelación anticipada muestra la bonificación. |
| RF-MOR-213 | Pagar la deuda notificada en línea con la regla de pago completo si la política lo exige. | V2 #321 | Estándar | O6 | Adoptado | Con la regla activa, la app preselecciona todos los documentos de la notificación. |
| RF-MOR-214 | Mensajes y textos del portal por clave de diccionario; nada de texto fijo. | BASE §65 | Núcleo | O6 | Adoptado | Todos los textos tienen clave `dict:`. |

### 5.21 Auditoría, operación y migración

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-MOR-215 | **Operaciones especiales** auditadas: consultar notificaciones por instancia, lote y estado; resolver o eliminar lotes que impiden anular un convenio; nunca borrado total. | RN-04 §7.6 `Get_Notificaciones_Especial`, §8.10; INV `frmGestionMora_OperEspeciales` | Estándar | O6 | Adoptado | Eliminar un lote exige motivo y deja registro; "Restablecer" no existe. |
| RF-MOR-216 | Auditoría de cada cambio de política, tasa, índice, excepción, protección, notificación, caso, convenio, incobrable y prescripción (quién, cuándo, antes/después). | BASE §54; T02 | Núcleo | O6 | Adoptado | La auditoría muestra el diff. |
| RF-MOR-217 | Importar tablas de tasas e índices por planilla (ExcelImportWizard) con preview de errores. | CNX ExcelImportWizard | Estándar | O6 | Adoptado | Un índice duplicado por fecha se marca como error. |
| RF-MOR-218 | Migrar desde ProCoop tasas, índices, tramas, conceptos base, descuentos, excepciones, instancias, notificaciones abiertas, convenios vigentes con cuotas e intereses diferidos pendientes. | RN-04 §12.10 | Núcleo | O6 (O11 repetible) | Adoptado | La conciliación de §19 cierra. |
| RF-MOR-219 | Paralelo: comparar cálculo de recargo CoopApps vs ProCoop por documento en un universo de muestra y reportar diferencias explicadas (variantes con [VERIFICAR]). | DEC-005; T07 | Estándar | O7 (DEC-089; antes O11) | Adoptado | El reporte clasifica diferencias por causa. |
| RF-MOR-220 | Aislamiento de tenant en todas las colecciones, jobs y exportaciones del módulo. | DEC-002 | Núcleo | O6 | Adoptado | Un token del tenant A no accede a convenios del tenant B (404). |

## 6. Reglas de negocio

Notación de decisión: **Replicar** (igual que ProCoop), **Mejorar** (misma intención con corrección o generalización), **Reemplazar** (otro mecanismo), **Descartar**.

### 6.1 Motor de interés y recargo al cobrar

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-MOR-001 | Único motor de interés para todos los canales. | Tres motores con criterios distintos: `clsComprobanteFactura`, `clsCobranzas.Get_Recargo`, `clsFacturarIntereses` (RN-04 §1, §12.1). | **Mejorar**: servicio único `mor.interestEngine` con modos `dueDateSchedule`, `quote`, `settle`, `batch`. | — | — |
| RN-MOR-002 | El interés se habilita por documento salvo: documento sin interés; cuenta sin recargo cuando la política respeta esa marca; titular con condición eximida (jubilado u otra condición configurable) cuando la política lo exime; documento de crédito salvo política "interés sobre créditos"; saldo cero; obligación de M07 con `fiscalGate` `pendingAuthorization` o `released` (comprobante todavía sin autorización fiscal o devuelto a borrador; M07 RN-COB-158; DEC-107, 10-11-2026). Una vez habilitada la compuerta, el interés corre desde el vencimiento de `obligations.dueSchedule` que corresponda según la política (primero o último, `lateInterest.fromLastDueDate`), y si el comprobante se autorizó después de su primer vencimiento esas fechas son las corridas (M05 RN-FAC-165, M07 RN-COB-158 punto 3; DEC-107, 10-11-2026): el período entre la fecha original y la corrida no devenga interés. | `Get_Recargo` `CalcularInteres=false` por jubilado (`Tipo_Ocupacion=2` + #1002), `NOINTERES`, `SIN_RECARGO` + #3135; créditos sin #625 → 0 (RN-04 §4.2, §4.3). | **Mejorar**: las condiciones eximidas son una lista configurable (`exemptConditions`) en vez de un código fijo de ocupación. | PRM-MOR-020, -021, -022, -023 | — |
| RN-MOR-003 | Descuento por pronto pago: si la fecha de cálculo es anterior al VTO1 y existe tramo para el tipo de documento, aplicar tasa negativa por días desde la emisión; solo a socios. Los tramos de un tipo no se superponen; la suma de porcentajes de todos los tramos de un tipo no supera 100 % (regla de carga). | `DESCUENTO_CAJA`, `Exist_Descuento`, `Get_MaxDescuentoCaja` (RN-04 §4.3, §4.5). | **Replicar** la no superposición; **Mejorar**: el tope por tramo es "≤ 100 %" individual (la suma no tiene sentido financiero, RN-04 §4.5); se conserva la regla de suma como advertencia en migración. | PRM-MOR-030 | — |
| RN-MOR-004 | Entre VTO1 y último vencimiento: `entreVto = TOTAL_k(vigente) − TOTAL1 − absorbido`, donde absorbido es el recargo ya cobrado en pagos previos según la fecha del último pago; si jubilado y política "sin recargo VTO2", restar (TOTAL2 − TOTAL1); si "proporcional al saldo", `entreVto × SALDO / TOTAL1`. | RN-04 §4.3 pseudocódigo. | **Replicar**. | PRM-MOR-024, -025 | — |
| RN-MOR-005 | Pasado el último vencimiento: fecha base sin pagos = VTO1 (o último vencimiento con la opción "desde último vencimiento"); con pagos parciales = vencimiento que corresponde a la fecha del último pago. Días = fecha de cálculo − fecha base. | RN-04 §4.3. | **Replicar**. | PRM-MOR-026 | — |
| RN-MOR-006 | Base sin pagos = TOTAL1 (o TOTAL del último vencimiento con la opción) − impuestos excluidos; con pagos = SALDO − impuestos excluidos × SALDO / TOTAL1; con base por conceptos = suma de ítems de conceptos/impuestos configurados (`TIPO > 0`). | `Get_Datos_Factura`; la línea de excluidos con pagos divide por `Total1 × Saldo` (RN-04 §13.2). | **Mejorar**: prorrateo `× SALDO / TOTAL1` (se corrige el probable error). Diferencias se reportan en paralelo (RF-MOR-219). | PRM-MOR-027, -028 | Sí: confirmar con datos reales el efecto de la corrección. |
| RN-MOR-007 | Método **tasa fija diaria**: `interés = base × tasa × días / 100`. La tasa puede venir del ente recaudador. | Prioridad a) de `Get_Recargo` con #600. | **Replicar** como método explícito. | PRM-MOR-010 | — |
| RN-MOR-008 | Método **índices**: factor = índice "anterior o igual" a la fecha de cálculo / índice "siguiente o igual" a la fecha base − 1; `interés = base × factor`; tasa diaria equivalente = factor / días × 100 (informativa). La tabla puede restringirse a tipos de documento. Si falta índice para alguna fecha, el cálculo falla con error de configuración (no se cae a otro método en silencio). | `CalcularRecargoMoraPorIndice`, `GetIndiceMora`; prioridad b) solo si `INDICESMORA` tiene filas y el tipo está alcanzado (RN-04 §4.3). | **Mejorar**: sin caída implícita a la tabla de tasas; el método lo fija la política. | PRM-MOR-011 | Sí: qué índice usan (tasa activa BNA, BCRA) — RN-04 §13.4. |
| RN-MOR-009 | Método **tabla de tasas**: por cada tramo `[desde, hasta]` vigente que se solapa con `[fecha base, fecha de cálculo]`, filtrado por tipo de documento (exacto o general) y servicio, `interés += base × tasa diaria × días solapados / 100`. Si hay tasas para la categoría del servicio, se usan **solo** esas; si no, las sin categoría. | `MORATAS` por tramos, `MORATAS_CATSER` prioridad (RN-04 §4.3 detalle). | **Replicar**. | PRM-MOR-012 | Sí: unidad de `TASA_CASO` (diaria) — RN-04 §13.5. |
| RN-MOR-010 | No se admiten dos tasas del mismo servicio, tipo de documento y alcance de categorías (incluido "sin categorías") con vigencias superpuestas. | `Hay_Moratas` solo detecta conflicto si hay categorías comunes; dos generales superpuestas suman interés (RN-04 §4.5, §13.14). | **Mejorar**: validación completa al publicar; en migración se reportan superposiciones existentes. | — | Sí: revisar bases con tramos duplicados. |
| RN-MOR-011 | El IVA del interés usa el concepto de interés por tipo de documento, o el general, o el de modo financiación; percepción con la del producto; IIBB con el régimen vigente. Si no hay concepto configurado para un documento alcanzado, la política no se publica. | `CalcularIVA_Interes` deja el recargo sin IVA "sin avisar" si falta el concepto (RN-04 §3.3). | **Mejorar**: error de configuración bloqueante. | PRM-MOR-040, -041, -042 | — |
| RN-MOR-012 | Con la opción "discriminar" o "desde último vencimiento": `entreVto = (TOTAL4 − TOTAL1 − absorbido) × SALDO / TOTAL1`; si no es "desde último vencimiento", se descuenta del recargo por mora para no duplicar. | RN-04 §4.3. | **Replicar**. | PRM-MOR-029 | — |
| RN-MOR-013 | Mínimo de recargo por mora: por defecto, si el recargo calculado es menor que el mínimo, vale 0 ("umbral de exención"); alternativa configurable "piso" (se cobra al menos el mínimo). | #609: menor que el mínimo → 0 (RN-04 §4.3, §13.3). | **Mejorar**: dos modos explícitos. | PRM-MOR-031, -032 | Sí (PA-MOR-02). |
| RN-MOR-014 | Gastos administrativos fijos por documento cuando pasó el último vencimiento, solo con concepto habilitado y fundamento registrado. | #372 se suma siempre que pasó VTO4 (RN-04 §4.3). | **Mejorar**: sujeto a admisibilidad (BASE §52.2). | PRM-MOR-033 | — |
| RN-MOR-015 | Recargo total = mora + entre vencimientos + gastos; redondeo según regla explícita (1 decimal opcional, modo half-up por defecto). | #608 redondea a 1 decimal (RN-04 §4.3). | **Mejorar**: regla de redondeo por concepto (AGR-011). | PRM-MOR-034 | — |
| RN-MOR-016 | El interés es simple y diario; no se capitaliza; la base nunca incluye interés ya facturado del mismo documento. | RN-04 §4.3 conclusión; §5.3 `NoCalcularInteresAnterior`. | **Replicar** (por defecto); método compuesto solo si PA-MOR-01 lo decide. | PRM-MOR-013 | — |
| RN-MOR-017 | El motor calcula desde `interestSettledUntil` del documento; cada liquidación (cobro en el acto, diferido, corrida masiva, convenio) actualiza esa marca en la misma transacción que el cargo. | ProCoop usa `NOINTERES` (corta todo interés futuro) y `COD_FAC='Punitorio'`; riesgo de doble cobro caja vs masivo (RN-04 §13.8). | **Reemplazar** por marca temporal. | — | — |
| RN-MOR-018 | Ente recaudador puede fijar: recargo desde último vencimiento, modo de diferimiento y cobro al VTO1, y una tasa diaria propia. | `RECARGO3VTO`, `DIFERIR`, `COBVTO1` (RN-04 §4.1). | **Replicar** (atributos del ente en M07 consultados por el motor). | — | — |
| RN-MOR-019 | Comprobantes con VTO2 anterior a hoy menos N días se excluyen de caja y consulta salvo permiso. | #2385 + permiso `ExcluirComprobVto2` (RN-04 §4.1). | **Replicar** en M07 con dato de M08 (antigüedad). | PRM-MOR-035 (referencia) | — |
| RN-MOR-020 | Fecha de cálculo fija para caja local: solo con capability `mor.cotizacion.fechaFija` y registrada en el cálculo. | #2487 (RN-04 §6). | **Mejorar**: con permiso y auditoría. | PRM-MOR-036 | — |
| RN-MOR-021 | Dispensa del recargo en caja: requiere aprobación de supervisor con motivo; el documento conserva el interés como "dispensado" (no lo libera para cobrarlo después). | #3162 (RN-04 §6). | **Mejorar**. | PRM-MOR-037 | — |
| RN-MOR-022 | Interés en reversiones: `saldo revertido × tasa reversión × días(fecha reversión − fecha pago) / 100`. | #3052 (RN-04 §6). | **Replicar**. | PRM-MOR-038 | — |
| RN-MOR-023 | Comprobante de intereses adelantados en facturas: tipo de documento configurable para facturar por adelantado intereses de cuotas. | #339 sin uso visible (RN-04 §6). | **Replicar** como atributo del plan [VERIFICAR]. | PRM-MOR-039 | Sí. |
| RN-MOR-024 | Forma de cobro del interés entre vencimientos y presentación (columna separada en caja, interés completo en consulta). | #2078, #2562, #2566 sin uso en RN (RN-04 §6). | **Replicar** como opciones de presentación de M07/M19. | PRM-MOR-043, -044, -045 | Sí: semántica de #2078. |
| RN-MOR-025 | Punitorios sobre energía: política específica del servicio eléctrico. | #3138 sin uso visible. | **Replicar** como política por servicio [VERIFICAR]. | PRM-MOR-046 | Sí. |
| RN-MOR-026 | Prepago: al vender crédito, retener intereses de deuda salvo excepción con "no retener" vigente. | `clsPrepaga.EsExcepcion` + #713 (RN-04 §6). | **Replicar** (O7). | PRM-MOR-047 | — |
| RN-MOR-027 | Interés por valores a fecha: tasa diaria × días entre la fecha de cobro y la fecha del valor, con concepto propio. | #486 (sin uso visible), #487 (RN-04 §4.4). | **Replicar** (O8). | PRM-MOR-048, -049 | — |

### 6.2 Recargo entre vencimientos al emitir

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-MOR-028 | Variante **ninguno**: `TOTALk = TOTAL1`. | #74 = Ninguno. | **Replicar**. | PRM-MOR-001 | — |
| RN-MOR-029 | Variante **porcentaje variable**: `TOTALk = TOTAL1 + IVA(TOTAL1 × p% × días(VTOk − VTO1))` (interés simple sobre TOTAL1). | `CalcularTotalFactura_VariablePorcentaje` (#578). | **Replicar**. | PRM-MOR-001, -002 | — |
| RN-MOR-030 | Variante **porcentaje fijo por escalón**: VTO2 = TOTAL1 + IVA(TOTAL1 × p%); VTO3 sobre el total del VTO2; VTO4 sobre el del VTO3 (compuesto por escalón, base con IVA del escalón anterior). | `CalcularTotalFactura_FijoPorcentaje`. | **Replicar** (es explícito en el nombre de la variante). | PRM-MOR-001, -002 | — |
| RN-MOR-031 | Variante **importe fijo**: suma `v × 1`, `× 2`, `× 3` para VTO2/3/4. ProCoop no aplica IVA. | `CalcularTotalFactura_FijoPesos` sin IVA. | **Mejorar**: el IVA se aplica según el concepto configurado (si el concepto está exento, queda sin IVA); se decide en PA-MOR-03. | PRM-MOR-001, -002 | Sí. |
| RN-MOR-032 | Variante **trama por importe**: se elige la trama del tipo de documento (exacto antes que general, luego por código) cuyo rango contiene el TOTAL1; `interés = importe × valor% × días(VTOk − VTO1)` o `× 1` si el valor es fijo. | `CalcularTotalFactura_TramaImporte`; en VTO3/VTO4 ProCoop aplica la trama dos/tres veces con días acumulados (interés sobre interés). | **Mejorar**: modo "simple" por defecto (sin doble cómputo) y modo "cascada" explícito para quien lo use; PA-MOR-03. | PRM-MOR-001; colección `dueDateSurchargeSchemes` | Sí (RN-04 §3.3, §13.13). |
| RN-MOR-033 | Variante **trama por vencimiento**: la trama con desde = hasta = 1/2/3 corresponde a VTO2/3/4; si falta, primera trama del tipo; sin cascada. Con DEC-106 se generaliza: la trama con `dueDateNumber = k` corresponde al VTOk, para k = 2..N (N = tope efectivo del comprobante, PRM-FAC-163 de M05; 10-11-2026). | `CalcularTotalFactura_TramaVencimiento`. | **Replicar**; si falta la trama del vencimiento, **error de configuración** en vez de tomar la primera. | — | — |
| RN-MOR-034 | El recargo entre vencimientos se informa en la factura pero se documenta fiscalmente al cobrarse (RF-MOR-020); al cobrar se separa el IVA del importe embebido. | RN-04 §3.2 `Calcular_TasasIVA_Total`. | **Replicar**. | — | — |
| RN-MOR-035 | `ExisteMoratas` solo informa tasas específicas del tipo de documento con descripción y sin mirar vigencia. | RN-04 §3.3, §6. | **Reemplazar** por validación completa de cobertura de la política (RN-MOR-010, -011). | — | — |
| RN-MOR-036 | Cuenta contable de intereses en vencimientos 2 y 3 la define M15 por concepto. | #2109 es cuenta contable. | **Reemplazar** por mapeo contable de M15. | — (M15) | — |

### 6.3 Diferimiento y documentación

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-MOR-037 | Modo de diferimiento: 1 no diferir; 2 diferir interés por mora; 3 diferir todo (0 = 1). El ente puede sobrescribirlo. | `InfoCobranza`, enum `DiferirInteres` (RN-04 §4.4). | **Replicar**. | PRM-MOR-050 | — |
| RN-MOR-038 | Lo cobrado en el acto se documenta en un comprobante nuevo por cuenta + situación IVA + situación IIBB (+ tipo de documento si se agrupa), con ítems por documento de origen, subtipo "intereses cobrados en caja" y relación con las facturas pagadas; tipo factura o ND; total negativo → crédito. | `RegistrarIntereses`, `NuevaFactura` (#273, #1056) (RN-04 §4.4). | **Replicar**; emisión en M05. | PRM-MOR-051, -052, -053 | — |
| RN-MOR-039 | Lo diferido crea un interés diferido (operación débito o crédito si el neto es negativo) con cuota de tipo "intereses diferidos" para la próxima factura, opcionalmente relacionada con el servicio. | `COMP_VEN` + `DEUDAVTA TPCUOTA=1`; `InteresesDiferidos` en facturación masiva; #2828 (RN-04 §4.4). | **Replicar** con cargo pendiente en M05. | PRM-MOR-054 | — |
| RN-MOR-040 | Bloquear con intereses genera siempre factura (aunque la política diga ND) con ítem con IVA incluido. | `Asignar_Bloqueo_ConIntereses` (RN-04 §6). | **Mejorar**: usa el tipo de documento propio de desbloqueo (#2984) y el concepto (#2771); sin forzar factura. | PRM-MOR-060, -061, -062 | — |

### 6.4 Proceso masivo de intereses a facturar

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-MOR-041 | Selección: documentos de débito, no anulados, sin marca "sin interés"; con "solo sobre cargos": VTO1 en rango; con "pagos entre fechas": VTO1 anterior a hasta (y en la variante con valores, saldados en rango con valores); con "solo impagas": saldo > 0 y VTO1 en rango; sin opciones: saldo > 0 o fecha de saldo ≥ hasta. Filtros por tipo, cuenta, titular, grupo y servicios conectados. | `Get_Facturas` (RN-04 §5.2, §5.6). | **Replicar**. | — | — |
| RN-MOR-042 | Variante estándar: historia de pagos (la emisión cuenta como primer evento, pagos agrupados por día); por tramo: escalones de vencimientos dentro del tramo (IVA incluido) y, pasado el último vencimiento, `SALDO × días × tasa / 100` con IVA agregado. | `Get_ComprobanteIteres`, `Get_InteresEstandar` (RN-04 §5.3). | **Replicar** con el motor común (modo `batch`). | PRM-MOR-055 | — |
| RN-MOR-043 | Variante "fecha de pago según valores" (AL): ajustes por pagos y valores anteriores al rango, proporciones acotadas entre 0 % y 100 %. Variante "cheques": interés por cada valor desde la fecha desde hasta la fecha del valor. | `Get_InteresEstandarAL`, `Get_ComprobanteIteresCheques` (RN-04 §5.3). | **Mejorar**: opción `valuesDeferral` del modo batch (O8). | PRM-MOR-055 | Sí: identificar cooperativa AL (RN-04 §13.7). |
| RN-MOR-044 | Variante CAU: con "solo impagas", punitorio único `SALDO × tasa / 100` sin días; sin esa opción, tramo VTO1→VTO2 sobre conceptos base × % entre vencimientos y desde VTO2 `(TOTAL2 o SALDO) × días × tasa`; "solo sobre cargos" aplica **3 % fijo en código** sobre comprobantes 96/97 no punitorios, proporcional al saldo. | `Get_ComprobanteIteresCAU` (RN-04 §5.4). | **Mejorar**: punitorio único y solo-cargos como opciones con tasa configurable; **Descartar** el 3 % fijo y los códigos 96/97 fijos (se configuran tipos de documento alcanzados). | PRM-MOR-055, -056 | Sí (RN-04 §13.6). |
| RN-MOR-045 | Preliminar con tramos seleccionables; solo lo seleccionado se factura; totales por documento suman solo tramos seleccionados. | `Get_Reporte` (RN-04 §5.6). | **Replicar**. | — | — |
| RN-MOR-046 | Generación: agrupa por situación IVA, cuenta y titular; un cargo por cuenta; un ítem por documento con el **neto** del interés (el IVA se recalcula al facturar con el concepto elegido); forma de pago "próxima facturación"; procesamiento en bloques. | `Guardar_Comprobantes` (lotes de 100, numeración en memoria, un lote SQL) (RN-04 §5.5, §5.6). | **Mejorar**: job idempotente por bloques con checkpoint; numeración en M05; sin lote SQL único. | PRM-MOR-057 | — |
| RN-MOR-047 | Al generar, actualizar `interestSettledUntil` = fecha hasta de la corrida para los documentos incluidos (reemplaza `NOINTERES = 1` y `COD_FAC='Punitorio'`). | RN-04 §5.5. | **Reemplazar**. | — | — |

### 6.5 Bloqueos y caja

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-MOR-048 | Asignar o quitar bloqueo por causa en lotes, registrando historial con causa, fecha e **identificador** de usuario; los bloqueos de sistema no se tocan. | `Asignar_Bloqueo` (lotes de 500, nombre de usuario, `ID_BLO=-1` intocable) (RN-04 §6). | **Mejorar**: identificador de usuario (no nombre); bloqueo de sistema como tipo `system`. | — | Sí: qué proceso asigna -1 → mapear a causa de sistema en migración. |
| RN-MOR-049 | Si la política lo indica, la caja no permite pagar en forma parcial la deuda de una notificación abierta: deben incluirse todos sus documentos. | #321 (`clsCobranzaCaja.cs:1660`). | **Replicar** (M07 con dato de M08). | PRM-MOR-070 | — |
| RN-MOR-050 | Si la política lo indica, la caja exige cobrar primero los documentos más antiguos (por VTO1 o por último vencimiento; general o del mismo servicio). | #324, #462, #375. | **Replicar** (M07). | PRM-MOR-071, -072, -073 | — |
| RN-MOR-051 | Aviso en caja y consulta de deuda si el titular está notificado; advertencia si el documento pertenece a un servicio desconectado; control de deuda vencida del titular. | #302, #2453, #2411, #187. | **Replicar** (M07 con dato de M08). | PRM-MOR-074, -075, -076 | — |
| RN-MOR-052 | Bloqueo de caja al generar orden de cambio de estado por mora. | #2458 (solo pantallas). | **Replicar** como bloqueo con causa de sistema "orden de mora pendiente" mientras la orden esté pendiente [VERIFICAR alcance]. | PRM-MOR-110 | Sí. |

### 6.6 Gestión de mora: candidatos, notificaciones, instancias

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-MOR-053 | Estados de la notificación: Abierta (0), Pagada (1), Procesada (2, pasó a otra instancia), Excluida (3, baja con causa), En técnica (4). Se agregan: Cerrada y Anulada (por anulación de lote). | `EstadoResolucion` (RN-04 §7.1). | **Mejorar** (estados adicionales para trazabilidad; §8). | PRM-MOR-111 | — |
| RN-MOR-054 | Calificación: Sin calificar, Buena, Regular, Mala. | `Calificacion` (RN-04 §7.1). | **Replicar**. | — | — |
| RN-MOR-055 | Tipos de notificación: documento impreso, correo, SMS, aviso telefónico, talón de pago; se agregan WhatsApp y push. El aviso telefónico se sirve por la exportación `ivr_export` de T09 o por la conexión FI-INT-66 de T06 con un discador o IVR externo, como en ProCoop, que no hace llamadas y solo genera archivos para discadores externos (`clsIVR`, FIC 13.4) (DEC-104). | `TipoNotificacion` (RN-04 §7.1); DFA M11 mejoras. | **Mejorar**. | — | — |
| RN-MOR-056 | Tipos de operación: Generar (desde candidatos) y Procesar (instancias siguientes). | `TipoOperacion`. | **Replicar**. | — | — |
| RN-MOR-057 | Deudas candidatas: documentos no anulados con saldo; opcionalmente excluir créditos y créditos bloqueados; aplicar clase, tipo y rango; opción "sin deuda" invierte el criterio. | `FiltrarDeudas` (RN-04 §7.2). | **Replicar**; los créditos bloqueados se identifican por causa (no por código 83 fijo). | — | — |
| RN-MOR-058 | Excepciones que excluyen: vigentes (autorizada, no cancelada o cancelación futura, fecha hasta futura o nula) con "no reclamar"; sin fecha de deuda excluye la cuenta entera; con fecha de deuda, excluye la deuda con vencimiento anterior. | `FiltrarExcepcionesMora` (RN-04 §7.2). | **Replicar**. | — | — |
| RN-MOR-059 | Cuentas con notificación abierta no se vuelven a cargar salvo opciones (ignorar notificación previa; ignorar candidato previo; verificar solo instancia inicial; excluir por mismo tipo de notificación); se informa el motivo de cada exclusión (reemplaza `MOROSO_TEMPORAL`). | `GetMorososExistentes`, `MOROSO_TEMPORAL` (RN-04 §7.2). | **Mejorar**: resultado estructurado de exclusiones en la corrida, sin tabla temporal. | PRM-MOR-080, -081, -082, -083 | — |
| RN-MOR-060 | Generar candidatos: notificación en la instancia de candidatos, lote = siguiente número del tenant, un ítem por documento con saldo, deuda = suma de saldos, deuda actualizada = deuda + intereses en modo no diferir a la fecha; solo si deuda > 0. | `Guarda_Candidatos` (RN-04 §7.2). | **Replicar**; numeración de lote atómica por tenant. | PRM-MOR-084 | — |
| RN-MOR-061 | Procesar: solo abiertas; en Generar se toman las de candidatos, en Procesar las demás; filtros de §5.9. | `Get_Notificaciones(Filtros)` (RN-04 §7.3). | **Replicar**. | — | — |
| RN-MOR-062 | Al procesar: (1) costo de envío opcional (solo si habilitado); (2) nueva notificación con nuevo lote, instancia destino, vencimiento, modelo, entrega automática según configuración; (3) documentos impagos de la anterior o toda la deuda vencida a la fecha si "incluir deuda vencida"; deuda actualizada recalculada; (4) nota en la cuenta; (5) anterior Procesada si hay deuda, Pagada si no; (6) bloqueo opcional y comprobante de deuda opcional por titular o cuenta. | `Guardar_Notificaciones`, `Guardar_Comprobante` (RN-04 §7.3). | **Replicar** con transacción única y eventos. | PRM-MOR-085 a -090 | — |
| RN-MOR-063 | Entrega: vencimiento = máx(vencimiento actual, fecha de entrega + días); desmarcar entrega no revierte el vencimiento; entrega automática por configuración o "todas entregadas". | `Set_Entrega` (#2205, #2206, #2279). | **Replicar**; además, la entrega puede venir de la evidencia de T09 (acuse). | PRM-MOR-086, -087, -088 | — |
| RN-MOR-064 | Una instancia que exige **constancia** (`evidenceRequired`) solo cuenta como notificada con evidencia válida: acuse de entrega del proveedor, lectura en app, firma de recepción, carta con aviso de recibo o constancia de notificador; "aceptado por el proveedor" no alcanza; un fallo genera tarea y canal alternativo. | No existe (ProCoop solo `RECIBIO`). | **Mejorar** (AGR-024). | PRM-MOR-091 | — |
| RN-MOR-065 | Promesa de pago vigente impide el avance de la notificación hasta su fecha; promesa vencida e incumplida se marca incumplida y la notificación vuelve a estar disponible para procesar. | `Set_PromesaPago`; `Get_Notificaciones_Mora` excluye promesa vigente. | **Replicar** + estado de cumplimiento. | PRM-MOR-092 | — |
| RN-MOR-066 | Bitácora estructurada: cada acción registra fecha, usuario, proceso, observación, estado anterior y nuevo. | `OBSERVA2` con separadores `¦¦` y `«»`. | **Reemplazar**. | — | — |
| RN-MOR-067 | Anular lote: deshace el lote (notificaciones Anuladas) y reabre las anteriores; solo si no hay efectos posteriores irreversibles (órdenes ejecutadas, cargos emitidos) o tras revertirlos. | `Anular_Grupo` (RN-04 §7.3). | **Mejorar** con validación de efectos. | — | — |
| RN-MOR-068 | Eliminar notificaciones: solo sin efectos económicos ni técnicos y con motivo; "restablecer" (borrar todas) **no existe**. | `Eliminar_Notificaciones`; `Restablecer_Notificaciones` borra todo `NOTIFICA` y `COMPNOTI`. | **Descartar** restablecer; **Mejorar** eliminar (borrado lógico). | — | — |
| RN-MOR-069 | Pago: si se pagaron todos los documentos de una notificación abierta o En técnica, pasa a Pagada con fecha y usuario de sistema, en la misma transacción del pago (evento consumido). | `RegistrarPagoNotificacion`. | **Replicar** vía evento `cob.payment.confirmed` con idempotencia. | — | — |
| RN-MOR-070 | Validar notificaciones: con la opción activa, marcar "abonada" (deuda actual 0) o "composición cambió" (difiere de la notificada); solo avisa. | `ValidarNotificaciones` (#53). | **Replicar**. | PRM-MOR-093 | — |
| RN-MOR-071 | Deuda actualizada de la notificación: recalcula toda la deuda de la cuenta con intereses en modo no diferir y sin créditos; se distinguen documentos notificados y nuevos. | `Get_Notificaciones` proyección; `Get_DetalleComprobantes`. | **Replicar**. | — | — |
| RN-MOR-072 | Impresión agrupada por titular: domicilio, zona, sector, recorrido y empresa postal de la cuenta principal (o menor número); fecha y lote mínimos; deuda sumada; 8 ordenamientos. | `Get_NotificacionesAgrupadasTitular`. | **Replicar**. | — | — |
| RN-MOR-073 | Cuentas sin correo: por defecto faltan ambos (correo de la cuenta y del portal); con "solo correo de la cuenta" mira solo el de la cuenta. Sin celular: falta el móvil de la cuenta y el celular alternativo de la persona. | `GetDatosCuentaSinMail`, `GetDatosPersonasSinNumero` (`PERSONAS.FAX` como celular). | **Mejorar**: celulares en M01 con tipo y verificación; en migración, `FAX` se importa como teléfono alternativo [VERIFICAR]. | PRM-MOR-094 | Sí. |
| RN-MOR-074 | Instancias marcadas sensible y de corte determinan la condición regulatoria de la cuenta ("R/C" o "A") en exportaciones. | #2203/#2204 usados por ERSeP DNU 311/2020. | **Replicar** con marcas explícitas por instancia. | PRM-MOR-095, -096, -097 | — |
| RN-MOR-075 | Plantilla de información del servicio: ignorar valores nulos en la variable de plantilla. | #2359. | **Replicar** como opción de render del modelo (T09). | PRM-MOR-098 | — |
| RN-MOR-076 | Incluir resumen de notificaciones al imprimir/generar. | #2322 (solo pantallas). | **Replicar**. | PRM-MOR-099 | — |

### 6.7 Tratamiento de morosos, corte y reconexión

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-MOR-077 | Servicios elegibles para tratamiento: conectados de las cuentas notificadas; error si hay orden pendiente (estado 1 o 2) de la misma transacción. | `Get_ServiciosTratamientoMorosos`. | **Replicar**. | — | — |
| RN-MOR-078 | Despacho por acción: categoría nueva → cambio de categoría (efectivo al cumplir la orden); desconexión → con técnica: baja administrativa + orden de desconexión (origen gestión de mora, moroso, vínculo a notificación), sin técnica: desconexión directa de servicio, adherentes y beneficiarios; cambio de estado → con técnica: orden con estado destino, sin técnica: cambio directo; reclamo/incidente o acción propia del tenant → reclamo; alta, traslado, cambio de medidor, reconexión y retiro de medidor **no** se generan desde tratamiento. | `Guardar_OT` y variantes; transacciones 1, 2, 4, 5, 8 no generan nada **sin error**. | **Mejorar**: acciones no admitidas devuelven error explícito; los cambios directos registran historial (ProCoop no lo hace en cambio de estado sin técnica). | PRM-MOR-112 | — |
| RN-MOR-079 | La descripción de la orden de reclamo usa la descripción recibida (no la observación técnica) y marca gestión de mora. | `Guardar_OT_Reclamo` usa la observación (posible error) y no marca `GEST_MORA`. | **Mejorar**. | — | — |
| RN-MOR-080 | La orden de cambio de estado lleva origen "gestión de mora" (ProCoop: Titulares) con marcas de moroso. | `Guardar_OT_CambioEstado`. | **Mejorar** (origen coherente). | — | — |
| RN-MOR-081 | Toda acción de interrupción por mora requiere, antes de emitir la orden: (a) política del servicio que la habilite; (b) instancia previa con constancia si se exige; (c) sin protección bloqueante; (d) sin reclamo de facturación en trámite sobre la deuda que la motiva; (e) sin pago informado pendiente; (f) sin convenio vigente al día que cubra la deuda; (g) aprobación si la protección o el tipo de cuenta lo exigen. Resultado: Permitida, Pendiente de revisión o Bloqueada con motivo. | No existe (ProCoop genera la OT directamente). | **Mejorar** (BASE §14, §68, §70). | PRM-MOR-113 a -118 | — |
| RN-MOR-082 | Matriz normativa: cada servicio y jurisdicción tiene restricciones de tipo `normative` (no editables por el tenant) o `tenantPolicy`; tipos: preaviso mínimo (días y canal con constancia), ventana de ejecución (días/horarios/feriados/vísperas), protección por condición (electrodependencia, salud, educación, entidad pública), régimen temporal (emergencia con vigencia), deuda mínima o antigüedad mínima, prohibición de afectación cruzada, inspección previa a rehabilitación (gas), restricción de cancelación de derechos (cementerio parque), prohibición de suspensión de prestación sanitaria por deuda (banco de sangre). Se amplía con (huecos de cobertura): modos de suspensión admitidos por servicio (`allowedModes`: telefonía RN-MOR-137, TV RN-MOR-138, agua RN-MOR-139, cloacas RN-MOR-140), servicios de emergencia siempre habilitados (`emergencyAlwaysEnabled`, RN-MOR-137), deuda de conceptos de terceros que no habilita el corte (`thirdPartyDebtNoCut`, RN-MOR-141), suspensión de cobertura social por cuotas impagas (`socialCoverageSuspension`, `tenantPolicy`, RN-MOR-143), solo tarea de revisión (`reviewTaskOnly`, RN-MOR-144) y la plantilla de plataforma de ventanas ERSeP (RN-MOR-145). | No existe. | **Mejorar** (BASE §52.4, §70, §86–§91). | Colección `suspensionRestrictionRules` | Sí: contenido por jurisdicción (PA-MOR-06, -07, -10). |
| RN-MOR-083 | Internet (piloto): suspensión por mora = restricción o suspensión del acceso vía aprovisionamiento remoto (perfil de suspensión o portal cautivo), sin retiro de equipo; baja por mora no retira el equipo automáticamente; el equipo en comodato se gestiona en M13 con la baja. | BASE §86; RN-07 §4 MikroTik. | **Mejorar**. | PRM-MOR-119 | — |
| RN-MOR-084 | Electricidad: no se suspende un suministro con electrodependencia acreditada; la evaluación de mora unificada no impone baja definitiva sin verificar el servicio. | BASE §87 controles; [ESP8–ESP9]. | **Mejorar**. | — | Sí: régimen provincial. |
| RN-MOR-085 | Agua: baja/desconexión, cargos remanentes y rehabilitación según el marco del servicio, sin copiar la suspensión de Internet. Los modos operativos (reducción de caudal o interrupción) se definen en RN-MOR-139 (HUE-AG-02). | BASE §88. | **Mejorar** (política propia del servicio). | PRM-MOR-201 | Sí. |
| RN-MOR-086 | Gas: la reconexión exige inspección de rehabilitación aprobada; la app muestra "Rehabilitación en trámite" hasta la confirmación; el pago no acredita instalación segura. | BASE §89. | **Mejorar**. | — | — |
| RN-MOR-087 | Cementerio parque: la mora no autoriza cancelar derechos ni disponer de restos; requiere revisión jurídica/operativa específica; no se habilita "corte". | BASE §90 controles. | **Mejorar** (acción `cancelRight` inexistente; solo expediente de recupero). | — | — |
| RN-MOR-088 | Banco de sangre: la deuda no puede condicionar la disponibilidad clínica ni la respuesta urgente; no hay suspensión de cobertura sanitaria por mora sin revisión del convenio. La revisión del convenio ante un aporte impago se hace con una tarea en la bandeja del responsable del servicio social (RN-MOR-144; HUECO-SAN-02). | BASE §91 límites. | **Mejorar** (restricción `normative` bloqueante por defecto). | PRM-MOR-205 | — |
| RN-MOR-089 | Retiro de medidor en la desconexión: por defecto marcado o preguntar al técnico. | #2440, #2531. | **Replicar** (M10, O7). | PRM-MOR-120, -121 | — |
| RN-MOR-090 | No facturar: marcar el servicio para no facturar con causa y vigencia. | `Operacion_NoFacturar` (`NOFACTURAR = 1`). | **Mejorar** (con causa y vigencia; M05 lo respeta). | — | — |
| RN-MOR-091 | Al confirmarse un pago: si existe orden de desconexión por mora pendiente y la deuda que la motivó quedó cancelada según el criterio de reconexión, cancelar la orden; si no se reconecta, quitar la marca de moroso según política. | #2917, #3033 (solo pantallas). | **Replicar**. | PRM-MOR-122, -123 | — |
| RN-MOR-092 | Reconexión automática: servicios suspendidos/desconectados **por un caso de mora** sin orden de reconexión pendiente; deuda que impide reconectar según criterio: 0 toda la deuda, 1 vencida al VTO2 (ProCoop "pasadas del primer vencimiento"), 2 vencida al último vencimiento; opción solo deuda del mismo tipo/servicio; opción alternativa: sin notificaciones abiertas con deuda del servicio. | `GetServiciosDesconectadosSinDeuda` con ventana fija de 15 días alrededor de la fecha de baja (#3147, #3113, #3163). | **Mejorar**: vínculo explícito al caso de mora en vez de ventana de 15 días. DEC-014: en servicios remotos la reconexión es automática al confirmarse el pago (`cob.payment.confirmed`) sin deuda vencida del servicio; si requiere técnico se crea la OT automáticamente en M10. | PRM-MOR-124, -125, -126 | Sí: diferencia "VTO1/VTO2" entre RN-04 (VTO2) y descripción V2 ("primer vencimiento") — CTR-MOR-12. |
| RN-MOR-093 | Reconexión sin técnica: marca moroso falso, estado conectado, fecha de alta = hoy (o se conserva según #2707 para no medidos en el mismo mes). | `ReconectarServicioSinTecnica`; #2707. | **Replicar** con historial. | PRM-MOR-127, -128 | — |
| RN-MOR-094 | Reconexión con técnica: orden "Reconexión generada automáticamente por cobranza"; con confirmación automática solo si existe aprovisionamiento remoto confirmable y la respuesta es exitosa; sin sistema vigente o con error, la orden vuelve a pendiente. | `GenerarConfirmarOrdenTrabajo` (#3106, #2713); RN-07 §4. | **Mejorar** (la confirmación automática se basa en la respuesta del sistema remoto, no en un parámetro ciego). | PRM-MOR-129, -130 | — |
| RN-MOR-095 | Cargo de reconexión: regla por servicio, socio activo o no, moroso o no, prepago, zona, localidad, categoría, clase, estado y propiedad; una sola vez; cobrar antes (requisito para emitir la orden) o después de ejecutar; habilitado solo con fundamento normativo/contractual registrado; por defecto gratuito. | `Get_CONEXION` (`TIPO_CON` 4/5/6, `UNA_VEZ`). | **Mejorar** (admisibilidad BASE §52.3/§53). | PRM-MOR-131 | — |
| RN-MOR-096 | Ajuste por días sin servicio: al reconectar servicios de cargo proporcional, crédito por días desconectados del mes o débito por días restantes si el servicio no fue facturado en el período; confirmación opcional; tomar día de reconexión para el proporcional. | `Generar_DescuentoReconexion` (#2483, #2485, #2661, #2907, #2787). | **Replicar** (M05 emite). | PRM-MOR-132 a -136 | — |
| RN-MOR-097 | Validaciones de reconexión: titular fallecido solo si se permite; factibilidad exigida en servicios que informan a técnica. | `Validar_OrdenTrabajo_Reconexion` (#2301, #388). | **Replicar**. | PRM-MOR-137, -138 | — |
| RN-MOR-098 | Integraciones remotas: Discar (conectar/desconectar; operaciones con fecha que, si el usuario la omite, devuelven "éxito" sin impactar), SITSA (contrato por cuenta, suspendido/habilitado), MikroTik (corte masivo en confirmación), AION (cambio de categoría). | RN-07 §4. | **Mejorar**: una operación remota sin impacto real nunca devuelve éxito; la acción queda Pendiente. | PRM-MOR-139 | — |
| RN-MOR-137 | Telefonía (TEL): la suspensión por mora es un **bloqueo de llamadas salientes** (`restricted`, por defecto) que conserva las entrantes; la interrupción total (`interrupted`) solo si la política del tenant lo habilita y la norma lo admite. En todos los modos, incluida la baja en trámite, los números de emergencia de la jurisdicción quedan habilitados: restricción `normative` `emergencyAlwaysEnabled`, no editable; si la central o el aprovisionamiento remoto no confirman que el perfil conserva la emergencia, la acción queda Pendiente (RN-MOR-098). Habilitable por tenant. | No existe regla propia (BASE §86 solo Internet). | **Nuevo** (HUE-TEL-04). | PRM-MOR-199 | Sí: requiere validación legal (régimen de servicios TIC y números de emergencia de la jurisdicción). |
| RN-MOR-138 | TV: modos de suspensión por mora `restricted` (**grilla mínima**: el abonado conserva solo el paquete mínimo configurado por el tenant) e `interrupted` (corte total de la señal o deshabilitación del decodificador); por defecto `restricted`. El decodificador en comodato no se retira por la suspensión (se gestiona en M13 con la baja, como RN-MOR-083). Habilitable por tenant. | No existe regla propia. | **Nuevo** (HUE-TV-03). | PRM-MOR-200 | Sí: requiere validación legal de la grilla mínima exigible. |
| RN-MOR-139 | Agua (AG): modos de mora `restricted` (**reducción de caudal** con limitador o válvula, sin bajar del caudal mínimo vital configurado) e `interrupted` (corte, solo si la concesión lo admite); por defecto `restricted`. Ambos se habilitan por concesión (`allowedModes` en `suspensionRestrictionRules` con `origin = normative` de la concesión) y respetan las protecciones por condición (salud, establecimientos educativos, entidades públicas). La ejecución es una OT de M10; la rehabilitación sigue RN-MOR-085. | BASE §88 (sin modos operativos). | **Nuevo** (HUE-AG-02), complementa RN-MOR-085. | PRM-MOR-201 | Sí: requiere validación legal por concesión (marco regulatorio del servicio de agua). |
| RN-MOR-140 | Cloacas (CLO): **sin suspensión física** por mora; solo gestión de deuda: avisos, intereses, convenio de pago y gestión extrajudicial o judicial. Restricción `normative` `noSuspension` para `serviceKind = sewage`, activa por defecto en toda concesión con servicio de cloacas; un caso de mora sobre CLO nunca genera orden de interrupción ni restricción, y la acción final de la política se limita a `claim` o `none`. Habilitable por concesión solo para ajustar los parámetros de gestión de deuda. | No existe regla propia. | **Nuevo** (HUE-CLO-01). | — | Sí: requiere validación legal por concesión. |
| RN-MOR-141 | La deuda de **conceptos facturados por cuenta de terceros** (por ejemplo, tasa de alumbrado público u otras tasas municipales) no habilita la suspensión ni el corte del servicio principal con el que se factura: restricción `normative` `thirdPartyDebtNoCut`. Por DEC-083 el concepto cuelga siempre de un contrato accesorio propio del socio con perfil "convenio de terceros" (M02): M08 identifica esa deuda por el `contractId` del contrato accesorio y su `thirdPartyAgreementId` (M06), y la restricción aplica al contrato principal del mismo socio. Excepción: solo si el convenio con el tercero (M06) lo prevé **y** existe norma que lo habilite, registradas como restricción con `normativeRef` y `validationStatus = validated`; sin ambas, esa deuda se excluye de la evaluación de interrupción. Las dos marcas llegan de M06 en EVT-FIS-24 `fis.thirdPartyAgreement.published` (`moraPolicy.allowServiceCut` y `moraPolicy.cutNormativeRef.validationStatus`, RN-FIS-129): M08 las guarda como restricción del convenio y recalcula los casos abiertos del convenio al recibir una versión nueva. | No existe (ProCoop evalúa la deuda total). | **Nuevo** (HUE-ALU-01). | PRM-MOR-202 | Sí: requiere validación legal (convenio con el municipio y norma local). |
| RN-MOR-142 | El saldo de conceptos de terceros **se excluye por defecto del saldo elegible** de mora (RF-MOR-068) y de la base de intereses y recargos propios; se incluye solo si el convenio con el tercero lo autoriza (PRM-MOR-202 = `includeIfAgreement` y convenio vigente de M06 con la marca correspondiente), y los recargos o intereses sobre ese saldo solo proceden si el mismo convenio los autoriza (PRM-MOR-203), con la tasa y el destinatario que el convenio defina. Las marcas son las de `thirdPartyAgreements.moraPolicy` (RN-FIS-127 de M06); el saldo se reconoce por el contrato accesorio "convenio de terceros" del socio (DEC-083). | No existe. | **Nuevo** (HUECO-TAS-02). | PRM-MOR-202, PRM-MOR-203 | Sí: texto de cada convenio con terceros. |
| RN-MOR-143 | **Cobertura social** (sepelio, salud y prestaciones sociales de M18): restricción `tenantPolicy` `socialCoverageSuspension` con los meses de cuotas impagas que habilitan **suspender la cobertura** (no la baja del contrato). M08 solo informa la condición "cobertura suspendida por mora" con fecha, publicando EVT-MOR-21 `mor.socialCoverage.suspended` al cumplirse los meses y `mor.socialCoverage.restored` al regularizarse la deuda (pago, convenio activado o excepción); M18 la evalúa en la verificación de cobertura (RF-SOC-032) y define la carencia de rehabilitación al regularizar (parámetro de M18). Nunca afecta urgencias ni prestaciones sanitarias (RN-SOC-022, RN-MOR-088). Deshabilitada por defecto. | No existe. | **Nuevo** (HUECO-SEP-01). | PRM-MOR-204 | Sí: requiere validación del reglamento del servicio social. |
| RN-MOR-144 | Banco de sangre, modalidad "aporte del socio": un aporte impago con la antigüedad configurada crea una **tarea de revisión** (T11, tipo `review`) en la bandeja del responsable del servicio social, con la cuenta, el convenio, la deuda y la antigüedad; **nunca** hay suspensión automática (restricción `normative` `reviewTaskOnly`, refuerza RN-MOR-088). La tarea es una por contrato y período (idempotente); su resultado (mantener, gestionar deuda, revisar convenio) queda en el caso de mora. | No existe. | **Nuevo** (HUECO-SAN-02). | PRM-MOR-205 | — |
| RN-MOR-145 | **Plantilla de plataforma de ventanas de corte** para electricidad en la jurisdicción Córdoba (ERSeP), cargada como restricciones `normative` de `executionWindow` del catálogo de plataforma (API-MOR-51): solo días hábiles; sin ejecución en vísperas de feriado ni en feriados; horario de ejecución configurable; suspensión de la ventana ante alerta meteorológica oficial o temperaturas extremas para la zona. Se precarga con `validationStatus = toValidate` (**requiere validación legal**): hasta validarse, su efecto es `review` (§7.18). El tenant la adopta o la reemplaza por la de su jurisdicción; otras jurisdicciones usan el mismo formato. | No existe. | **Nuevo** (HUE-ELE-05), concreta RF-MOR-119 y PA-MOR-10. | PRM-MOR-206 | Sí: requiere validación legal (días, horarios y condiciones climáticas exactas del régimen ERSeP vigente). |

### 6.8 Baja, suspensión y reactivación (BASE §53)

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-MOR-099 | Se distinguen: baja contractual, suspensión temporal solicitada por el socio, suspensión por mora, suspensión por otro motivo, reactivación y reconexión; la suspensión no extingue el contrato. | No distingue (estados de `SERSOC.CONDICION`). | **Mejorar** (BASE §53). | — | — |
| RN-MOR-100 | La solicitud de baja no genera cargo, no exige registro previo para servicios comprendidos (Internet: botón visible, sin trámite previo, código identificador dentro de 24 h por el mismo medio) y no se condiciona a pagar deuda; la facturación de prestaciones devengadas se trata por separado. | — | **Informado** (BASE §52.3). | PRM-MOR-140 | — |
| RN-MOR-101 | Costos de suspensión y reactivación solo con regla habilitada, respaldada para el servicio y jurisdicción, y aprobada por el responsable normativo; la aceptación del socio se conserva con versión de condiciones. | `CONEXION` sin validación de admisibilidad. | **Mejorar**. | PRM-MOR-141 | — |
| RN-MOR-102 | El estado real del servicio cambia solo con la confirmación de ejecución; sin confirmación técnica el caso queda en trámite. | ProCoop reconecta en la cobranza sin técnica. | **Mejorar** (BASE §53 control). | — | — |
| RN-MOR-103 | Durante una suspensión voluntaria, los cargos recurrentes siguen la regla de pausa aprobada del servicio (pausa total, cargo reducido, mínimo); por defecto, si no hay regla, el abono **no** se pausa automáticamente y se informa. | — | **Informado** (BASE §53). | PRM-MOR-142 | — |
| RN-MOR-104 | Reactivar un contrato cerrado requiere nueva alta cuando el servicio así lo define (Internet: sí). | — | **Informado**. | — | — |

### 6.9 Financiación y convenios

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-MOR-105 | Fórmulas por método (C capital a financiar, C' = C − interés por mora si no capitaliza, n cuotas, i tasa por período): 1 sin interés: capital C/n, interés 0; 2 directo: capital C/n, interés fijo `(C − importe sin interés) × i` (con no capitalizar, C'); 3 francés: cuota = base / ((1 − (1+i)^−n) / i), interés_k = saldo_k × i, capital = cuota − interés (+ (C − C')/n si no capitaliza); 4 alemán: capital base/n (+ (C−C')/n), interés saldo_k × i; 5 americano: capital 0 en 1..n−1 y C en n, interés base × i constante; 6 cuotas con saldo: capital fijo = importe máximo − IVA embebido (`máx × IVA/(C+IVA)`), la última absorbe el resto, interés 0. | `clsCaidaCuotas` (RN-04 §8.5). | **Replicar** las fórmulas; **Mejorar**: redondeo de importes a 2 decimales con ajuste de la última cuota en todos los métodos (ProCoop redondea a 5 decimales sin ajuste); validar que la última cuota de "cuotas con saldo" no sea negativa. | — | — |
| RN-MOR-106 | Interés directo con quita: la base del interés es el capital **neto** de quita en todos los métodos. | En directo ProCoop calcula sobre capital antes de la quita (asimetría, RN-04 §8.5, §13.16). | **Mejorar**. | — | Sí: comparar convenios migrados. |
| RN-MOR-107 | Vencimiento de la cuota k = primer vencimiento + período × (k − 1) meses; la cuota 0 (entrega) vence hoy (o la fecha fijada en la política de anticipo). | RN-04 §8.1, §8.4, §8.6. | **Replicar**. | — | — |
| RN-MOR-108 | IVA e IIBB del interés por cuota con concepto de financiación (o de venta); con "tasa con IVA" el interés se toma con IVA incluido y se separa; percepción de IVA solo en factura en cuotas con intereses; IIBB si la cuenta es conocida. Valor de cuota = capital + interés + IVA del interés + otros impuestos; el IVA del capital se agrega proporcionalmente al capital. | `GetCaida`, `GetCuotas` (RN-04 §8.5, §8.6). | **Replicar**. | PRM-MOR-150, -151 | — |
| RN-MOR-109 | Capital a financiar `C = Neto − Entrega − Quita`; en factura en cuotas con intereses se parte del total con IVA. Entrega en plan de pago: IVA proporcional `entrega × (Total − Percepción)/Neto − entrega`. | RN-04 §8.6. | **Replicar**. | — | — |
| RN-MOR-110 | Distribución del interés anterior y de la mora en las cuotas: proporción sobre `Neto − Quita` aplicada al capital de cada cuota; la quita de interés anterior aplica sobre su porción; la quita de mora se calcula sobre la mora **actual** (no alcanza la mora ya refinanciada); IVA separado con conceptos 311/307; tolerancias de 1 a 3 centavos en la redistribución del IVA. | `DistribuirInteresEnCuotas`, `Distribuir_IntAnterior`, `Distribuir_IntMora`, `DistribuirIVA`. | **Replicar** la proporción; la quita sobre mora refinanciada se decide en el plan (`moraDiscountScope`: actual / total) con default "actual" (replica). | PRM-MOR-152 a -155 | — |
| RN-MOR-111 | Concepto de cuota en factura mensual con alícuota exenta: la cuota se factura exenta con el IVA dentro del neto. | #308 con `COD_ALI = 4`. | **Replicar** si M06 lo valida [VERIFICAR alícuota 4]. | PRM-MOR-156 | Sí. |
| RN-MOR-112 | Quita del 100 % con entrega 0: la quita se reparte en partes iguales al calcular el IVA y la cuota 0 no recibe distribución. | RN-04 §8.6. | **Replicar**. | — | — |
| RN-MOR-113 | Cantidad de cuotas para importe objetivo: `n₀ = piso((Neto − Entrega)/importe)`, acotado a [mín, máx] con aviso; buscar el primer n desde n₀ cuya cuota máxima (más IVA del capital) no supere el importe; si ninguno, aviso y máximo. Máximo 0 = sin tope (999). | `GetCantidadCuotas`. | **Replicar**. | — | — |
| RN-MOR-114 | Registro del convenio en una transacción: validar submódulo de facturación abierto y capital ≥ 0 (con rollback explícito en error); sustituir obligaciones de origen (quedan "Incluidas en convenio" con saldo trasladado), cerrar notificaciones, crear convenio, obligaciones incluidas, cuotas, capital social y saldado de documentos. | `RegistrarFinanciacion` (sin rollback explícito al rechazar capital negativo). | **Mejorar** (transacción Mongo multi-documento, DEC-001). | — | — |
| RN-MOR-115 | Obligaciones incluidas: por documento capital (saldo o capital si es cuota), recargo, total, interés entre vencimientos y de mora por separado, saldo y fecha de saldo originales para revertir. Notas de crédito incluidas restan. | `GetItRecco` (RN-04 §8.3, §8.7). | **Replicar**. | — | — |
| RN-MOR-116 | Refinanciación: una cuota impaga incluida se descompone en capital (concepto capital), interés anterior (financiación actual + anterior; vuelve a generar interés salvo quita) y mora anterior (se suma a la mora nueva; ítem solo si neto > 0,01). | RN-04 §8.7. | **Replicar**. | — | — |
| RN-MOR-117 | Modalidad cuota en factura mensual: cargo pendiente por cuota que la facturación incorpora; entrega y sellado se emiten de inmediato. Modalidad chequera: un documento por cuota con un solo vencimiento, más la cuota 0 de entrega o sellado. | `RegistrarComprobantes`, `GetFacturaCuota`, `clsComprobanteVenta.Guardar`. | **Replicar**. | PRM-MOR-157, -158 | — |
| RN-MOR-118 | Límites: máximo de convenios por período de control (o en total si las fechas no son válidas); una sola financiación activa del mismo tipo; cuotas mensuales facturadas vencidas impagas del tipo informadas; mínimo/máximo de documentos; importe mínimo de cuota. Cada límite es **bloqueante** o **advertencia** según política. | `GetConveniosEnPeriodo`, `GetConveniosActivosPorTipo`, `GetConveniosInactivosImpagosPorTipo` (#671, #674, #675, #735, #672, #2208, #673). | **Mejorar** (comportamiento explícito). | PRM-MOR-159 a -165 | Sí: mensajes de ProCoop. |
| RN-MOR-119 | Ajuste por índice al facturar la cuota: factor = índice de hace R meses / índice del mes anterior a la fecha del convenio (R configurable, default 2 como ProCoop); ítem `(capital + interés + IVA) × (factor − 1)`, puede ser negativo; si falta un índice, **alerta y retención** de la cuota hasta decisión (ProCoop no ajusta y no avisa). | `ItemsComprobanteCollection.AddRange` (RN-04 §8.8). | **Mejorar**. | PRM-MOR-166 | Sí: índice usado. |
| RN-MOR-120 | Bonificación por adelanto: si la cuota se factura por adelantado, ítem negativo igual al interés de financiación completo de la cuota con el mismo IVA; concepto de financiación o de venta; concepto vacío = no bonifica. | #2607, #2624. | **Replicar** como base de la cancelación anticipada. | PRM-MOR-167, -168 | — |
| RN-MOR-121 | Anulación: requiere permiso y confirmación; convenio existente; submódulo de financiaciones abierto a la fecha del convenio; en chequera ninguna cuota con pagos (si hay factura de entrega no anulada, confirmar); en factura mensual ninguna cuota facturada; sellado sin pagos; ninguna cuota en notificaciones (se listan los lotes a resolver). Efectos: restituir saldo y fecha de saldo de los documentos de origen; anular cuotas; anular documento de venta; anular sellado; **no** borrar físicamente convenio ni ítems (ProCoop borra `REC_CON`, `IT_RECCO`, `CAPITAL`, y copia cuotas a tablas de anulados). | `AnularFinanciacion`, `ValidarAnular` (RN-04 §8.10). | **Mejorar** (anulación lógica). | — | Sí: destino de la factura de entrega (RN-04 §13.18). |
| RN-MOR-122 | Recalcular cuotas por situación fiscal: cuotas de chequera emitidas en rango sin ningún pago cuya situación de IVA difiere de la actual (y una es la situación "7") o cuya alícuota de percepción IIBB difiere del padrón (régimen P) con conceptos de interés gravados; modo "recalcular cuota" mantiene netos; modo "recalcular interés" mantiene el total con factor `(100 + IVA + perc + IIBB ant.)/(100 + nuevos)`. | `GetCuotas_SitIvaDistinto`, `AjustarIVA_Cuotas` (#757). | **Mejorar**: cualquier cambio de situación (no solo la "7") con decisión explícita del usuario; emisión de ajustes trazables (M05/M06). | PRM-MOR-169 | Sí: situación 7. |
| RN-MOR-123 | Caducidad (no existe en ProCoop): el plan define el disparador (N cuotas impagas consecutivas o alternadas, o D días de atraso de la cuota más antigua, o anticipo impago en P días), aviso previo con plazo de regularización y efecto: el convenio pasa a Caído; las cuotas no vencidas se aceleran y el **saldo de capital pendiente** + intereses devengados + mora de las cuotas vencidas queda exigible como deuda del convenio; las obligaciones de origen **no** se reviven; las quitas condicionadas se pierden en la proporción impaga si el plan lo indica. | RN-04 §8.13 (no existe; operativamente anulan y refinancian). | **Mejorar** (DFA M12, AGR-014). | PRM-MOR-170, -171 | Sí (PA-MOR-13). |
| RN-MOR-124 | Anticipo impago: el convenio no entra en vigencia; vencido el plazo, se cae sin anticipo y se restituyen las obligaciones de origen a su estado previo (sin intereses de financiación). | BASE §14 CU-14 excepción. | **Informado**. | PRM-MOR-172 | — |
| RN-MOR-125 | CFT: tasa i por período que iguala el capital neto recibido (deuda incluida − anticipo) con el flujo de cuotas (capital + interés + IVA del interés + sellado + cargos); se informa CFT efectivo anual con y sin IVA; TEA = (1 + i)^(períodos por año) − 1. | No existe. | **Mejorar** (DFA M12). | — | Sí: exigencias de información al consumidor (PA-MOR-15). |
| RN-MOR-126 | Un convenio vigente no puede convivir con la exigencia íntegra de su deuda de origen: la deuda de origen no se notifica, no genera interés propio desde la fecha del convenio y no se cobra por separado; solo se exigen cuotas (y, si cae, el saldo exigible). | AGR-014 ejemplo. | **Adoptado**. | — | — |
| RN-MOR-127 | Imputación de pagos a cuotas: por orden de vencimiento, primero cuota más antigua; dentro de la cuota: mora de la cuota, interés, IVA, capital (orden configurable por política fiscal, M07). | AGR-014 "aplicación de pagos". | **Adoptado**. | PRM-MOR-173 | — |
| RN-MOR-128 | Cambiar el garante: exige persona válida y su firma; si cambia de "sin garante" a "con garante" (o al revés), se regenera el texto con la plantilla correspondiente como adenda. | `ModificarGarante` sin validar ni regenerar plantilla. | **Mejorar**. | PRM-MOR-174, -175 | — |
| RN-MOR-129 | Heurística de cuotas hermanas de factura en cuotas (misma cuenta, fecha, total y cantidad) se reemplaza por vínculo explícito al documento de venta. | `GetDatosDeudaCuotas` heurístico. | **Reemplazar**. | — | — |
| RN-MOR-130 | Informe de financiaciones "no incluir cancelados": excluye convenios sin cuotas pendientes en **ambas** modalidades (ProCoop deja visibles chequeras totalmente pagas). | `GetFinanciaciones`. | **Mejorar**. | — | Sí. |
| RN-MOR-131 | Informe de cuotas facturadas: la columna de interés anterior se rotula como tal (ProCoop rotula `InteresPorM` con `IAN_FIN`). | `GetCuotasFinanciacionFacturadas`. | **Mejorar**. | — | — |
| RN-MOR-146 | Contribución de obra (OBR): el cobro normal de la obra es el plan de cuotas tipo 17 de M04 (`worksInstallmentPlans`; regla de M10). El convenio de M08 **solo** se usa para refinanciar cuotas de obra vencidas e impagas (RF-MOR-158): incluye únicamente cuotas vencidas, conserva el vínculo con la obra y el inmueble en las obligaciones incluidas y no admite cuotas de obra no vencidas; un intento de financiar la obra completa por convenio se rechaza con `mor/works-levy-not-eligible`. | No distinguido (RF-TEC-173 "en cuotas o plan de pago"). | **Nuevo** (HUECO-OBR-02, parte M08). | PRM-MOR-207 | — |
| RN-MOR-147 | Cambio de titularidad (DEC-045): la deuda, las notificaciones, los casos de interrupción y los convenios vigentes quedan en la cuenta del **titular saliente**; el nuevo titular solo asume esa deuda mediante un convenio de M08 donde figura como deudor (`signers[].role = holder`) y el saliente como codeudor opcional. Sin ese convenio, la deuda del saliente no integra la evaluación de mora del nuevo titular ni habilita interrumpir su contrato; solo se muestra como advertencia (DEC-029). | Sin regla explícita relevada. | **Nuevo** (DEC-045). | — | Sí: cómo trata ProCoop la deuda del suministro al cambiar el titular. |

### 6.10 Garantías, incobrables, gestión judicial y prescripción

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-MOR-132 | Un depósito en garantía es un pasivo con el socio: se aplica contra deuda solo en la baja o ante incumplimiento con causa y liquidación, y el remanente se devuelve (M14). | MER-005 (no hay en ProCoop). | **Adoptado**. | PRM-MOR-180 | — |
| RN-MOR-133 | La deuda en gestión externa/judicial no se notifica por la gestión interna ni se incluye en convenios sin autorización del responsable de recupero; los pagos se imputan a la deuda original y actualizan el expediente. | MER-006. | **Adoptado**. | — | — |
| RN-MOR-134 | Gastos y honorarios: a cargo de la cooperativa salvo título que los traslade (sentencia, convenio firmado); los trasladados se documentan como cargo propio (no como interés). | MER-006. | **A validar (PA-MOR-18)**. | PRM-MOR-181 | — |
| RN-MOR-135 | Incobrable: propuesta con criterio → aprobación (doble control) → estado Incobrable del documento con saldo histórico conservado → evento contable de castigo (M15); recupero posterior revierte parcial o totalmente. | MER-006. | **Adoptado**. | PRM-MOR-182, -183 | — |
| RN-MOR-136 | Prescripción: plazo por tipo de obligación desde la fecha de cómputo; se interrumpe por reconocimiento (convenio, pago parcial si la política lo considera, promesa firmada) o por demanda; el informe sugiere y la aprobación registra; el documento de prescripción es de signo contrario, con concepto y cuenta contable configurados, imputado al documento. | RN-04 §9 (#104, #2158). | **Mejorar** (interrupción y aprobación). | PRM-MOR-184, -185, -186 | Sí (PA-MOR-20). |

## 7. Modelo de datos
> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueidentifier`, `DECIMAL`, `DATETIME2`, etc.; ver `07-ddl`). Menciones puntuales de Mongo/Mongoose/BullMQ sin tipo de columna = **comparativa histórica** Connectia, sin efecto en build.


Todas las colecciones llevan además los campos comunes obligatorios: `TenantId` (uniqueidentifier, obligatorio), `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `version` (control optimista) y, salvo indicación, `deletedAt` solo en catálogos (los documentos económicos no se borran). Importes en `DECIMAL(18,4)`; tasas en `DECIMAL(18,4)` con 8 decimales; fechas en UTC con interpretación en la zona del tenant. Todos los índices comienzan por `TenantId`. Las referencias a colecciones de otros módulos se indican con el módulo dueño entre corchetes.

Entidad jurídica (DEC-064, DEC-087): los documentos económicos del módulo (`interestCalculations`, `deferredInterests`, `interestBillingRunItems`, `agreements`, `agreementInstallments`, `guarantees`, `collectionCases.costs`, `writeOffs`, `prescriptionRuns` por documento) llevan `legalEntityId` [T04 `legalEntities`], heredado de la cuenta corriente (`currentAccounts.legalEntityId` de M07) o del documento de origen. Un convenio solo incluye obligaciones de una misma entidad jurídica; si la deuda del socio abarca varias, se genera un convenio por entidad (error `mor/agreement-mixed-legal-entities` si se intenta mezclar). Los nombres de campos siguen T05 §7.2 (CTR-DAT-30): `contractId`, `voucherTypeId`, `storedFileId`, `workflowInstanceId`, `ledgerAccountId`, `holderId`, subdocumento `legacy`.

### 7.1 `interestPolicies` — Políticas de interés

**Propósito:** reglas versionadas del motor por alcance. **Origen ProCoop:** parámetros VAR de COBRANZA/FACTURACIÓN de §14, `TIPO_FAC.COD_CON`, `TIPO_FAC.COD_CON2`, `CONCEPTOS_INT`, `TABMORA.TIPO_FAC`.

| Campo | Tipo | Obl. | Descripción |
|---|---|---|---|
| `code` | String | Sí | Código único por tenant. |
| `name` | String | Sí | Nombre (clave `dict` opcional). |
| `scope.serviceId` | uniqueidentifier [M02] | No | Vacío = todos los servicios. |
| `scope.categoryIds` | [uniqueidentifier] [M02] | No | Vacío = todas las categorías. |
| `scope.voucherTypeIds` | [uniqueidentifier] [M05] | No | Tipos de documento alcanzados (tipo de factura/cuota). |
| `priority` | Int | Sí | Calculado por especificidad (servicio+categoría+tipo = 3 … general = 0); empate → error al publicar. |
| `validFrom` / `validTo` | Date | Sí / No | Vigencia. |
| `status` | Enum | Sí | `draft`, `published`, `retired`. |
| `lateInterest.method` | Enum | Sí | `fixedDaily`, `rateTable`, `index`, `none`. |
| `lateInterest.fixedDailyRate` | DECIMAL(18,4) | Cond. | % diario (método `fixedDaily`). |
| `lateInterest.rateTableId` | uniqueidentifier → `interestRateTables` | Cond. | Método `rateTable`. |
| `lateInterest.indexTableId` | uniqueidentifier → `interestIndexTables` | Cond. | Método `index`. |
| `lateInterest.compounding` | Enum | Sí | `simple` (default), `compound` (solo si PA-MOR-01). |
| `lateInterest.fromLastDueDate` | Boolean | Sí | Equivale a V2 #621. |
| `lateInterest.separateBetweenDueDates` | Boolean | Sí | V2 #2356. |
| `base.mode` | Enum | Sí | `total1`, `balance`, `concepts`. |
| `base.conceptIds` | [uniqueidentifier] [M04] | Cond. | Conceptos que forman la base (CONCEPTOS_INT TIPO > 0). |
| `base.taxIds` | [uniqueidentifier] [M06] | No | Impuestos incluidos en la base por conceptos. |
| `base.excludedTaxIds` | [uniqueidentifier] [M06] | No | V2 #2300. |
| `base.excludePreviouslyBilledInterest` | Boolean | Sí | Default `true`. |
| `betweenDueDates.proportionalToBalance` | Boolean | Sí | V2 #2363. |
| `betweenDueDates.iibbSeparate` | Boolean | Sí | V2 #2826. |
| `exemptions.respectAccountNoSurcharge` | Boolean | Sí | V2 #3135. |
| `exemptions.exemptConditions` | [{ conditionCode, scope: `all`/`betweenDueDate2` }] | No | Ej. jubilado: `all` (#1002) o solo VTO2 (#299). |
| `exemptions.interestOnCredits` | Boolean | Sí | V2 #625. |
| `minimum.amount` | DECIMAL(18,4) | No | V2 #609. |
| `minimum.mode` | Enum | Cond. | `exemptBelow` (default), `floor`. |
| `adminFee.amount` / `adminFee.conceptId` / `adminFee.admissibilityRef` | DECIMAL(18,4) / uniqueidentifier / String | No | V2 #372; requiere referencia de admisibilidad para activar. |
| `rounding` | { mode: `halfUp`/`halfEven`/`down`, decimals: 0–2, step: DECIMAL(18,4) } | Sí | V2 #608 (paso 0,1). |
| `earlyPaymentDiscountEnabled` | Boolean | Sí | Usa `earlyPaymentDiscountRules`. |
| `fiscal.lateInterestConceptId` | uniqueidentifier [M04] | Sí | V2 #606 o por tipo de documento. |
| `fiscal.betweenDueDatesConceptId` | uniqueidentifier [M04] | Sí | V2 #2080. |
| `fiscal.financingModeLateConceptId` | uniqueidentifier [M04] | No | V2 #307. |
| `fiscal.defaultVatSituationId` | uniqueidentifier [M06] | No | V2 #2086. |
| `deferral.mode` | Enum | Sí | `none`, `lateOnly`, `all` (V2 #1011). |
| `deferral.relateToService` | Boolean | Sí | V2 #2828. |
| `settlement.documentKind` | Enum | Sí | `debitNote`, `invoice` (V2 #273, PA-MOR-04). |
| `settlement.groupByDocumentType` | Boolean | Sí | V2 #1056. |
| `settlement.forcedDocumentTypeId` | uniqueidentifier [M05] | No | V2 #2249. |
| `settlement.originCode` | String | No | V2 #1008 (vendedor/origen). |
| `waiver.requiresApproval` | Boolean | Sí | V2 #3162. |
| `reversal.dailyRate` | DECIMAL(18,4) | No | V2 #3052. |
| `values.dailyRate` / `values.conceptId` | DECIMAL(18,4) / uniqueidentifier | No | V2 #486/#487. |
| `prepaid.retainInterest` | Boolean | No | V2 #713. |
| `servicePunitive` | { enabled, rate, conceptId } | No | V2 #3138. |
| `publishedVersionId` | uniqueidentifier [T04] | No | Versión publicada. |

Índices: `{tenantId, code}` único; `{tenantId, status, scope.serviceId, validFrom}`.

### 7.2 `interestRateTables` — Tablas de tasas por vigencia

**Origen:** `MORATAS` + `MORATAS_CATSER`.

| Campo | Tipo | Obl. | Descripción |
|---|---|---|---|
| `code`, `name` | String | Sí | `DES_MOT`. |
| `serviceId` | uniqueidentifier [M02] | No | `COD_SER`. |
| `voucherTypeId` | uniqueidentifier [M05] | No | `TIPO` (vacío = todos). |
| `rates[]` | Array | Sí | Tramos. |
| `rates[].rateId` | uniqueidentifier | Sí | `COD_MOT`. |
| `rates[].from` / `rates[].to` | Date | Sí | `FEDESDE`/`FEHASTA` (inclusive). |
| `rates[].dailyRate` | DECIMAL(18,4) | Sí | `TASA_CASO` (% diario). |
| `rates[].categoryIds` | [uniqueidentifier] [M02] | No | `MORATAS_CATSER`; vacío = general. |
| `rates[].sourceRef` | String | No | Fuente de la tasa (ej. resolución, tasa activa). |
| `status` | Enum | Sí | `draft`, `published`, `retired`. |

Validación: sin superposición de `[from, to]` para el mismo `serviceId` + `voucherTypeId` + conjunto de categorías con intersección no vacía (incluido vacío con vacío) (RN-MOR-010). Índices: `{tenantId, code}` único; `{tenantId, serviceId, voucherTypeId}`.

### 7.3 `interestIndexTables` e `interestIndexValues` — Índices de recargo

**Origen:** `TABMORA` (cabecera) e `INDICESMORA` (valores); `INFLACIO`/`TABINFL` para ajuste de cuotas (se modelan igual con `purpose`). **Corregido (CTR-DAT-29):** `interestIndexTables` queda solo para los índices de mora propios (`purpose = lateInterest`); los índices económicos de ajuste de cuotas y garantías (`INFLACIO`/`TABINFL`) son series de T04 (`economicIndexSeries`/`economicIndexValues`) y se referencian con `economicIndexSeriesId`. Los valores `installmentAdjustment` y `guaranteeAdjustment` del enum quedan sin uso.

`interestIndexTables`: `code` (String, Sí; `COD_TAB`), `name` (`NOM_TAB`), `purpose` (Enum: `lateInterest`, `installmentAdjustment`, `guaranteeAdjustment` — los dos últimos reemplazados por `economicIndexSeries` de T04, CTR-DAT-29), `periodicity` (Enum: `daily`, `monthly`), `voucherTypeIds` ([uniqueidentifier]; `TABMORA.TIPO_FAC`), `sourceRef` (String), `status`.

`interestIndexValues`: `tableId` (uniqueidentifier, Sí), `date` (Date, Sí; de `DIA_TAB`/`MES_TAB`/`ANO_TAB` o `FECHA`), `value` (DECIMAL(18,4), Sí; `IND_TAB`), `importBatchId` (uniqueidentifier, No). Índice único `{tenantId, tableId, date}`.

### 7.4 `dueDateSurchargeSchemes` — Recargo entre vencimientos

**Origen:** V2 #74, #578, `TRAMASREC`.

| Campo | Tipo | Obl. | Descripción |
|---|---|---|---|
| `code`, `name` | String | Sí | |
| `scope.serviceId`, `scope.cycleIds`, `scope.voucherTypeIds` | uniqueidentifier/[uniqueidentifier] | No | Alcance (BASE §97.3 "por servicio y ciclo"). |
| `type` | Enum | Sí | `none`, `variablePercent`, `fixedPercentCascade`, `fixedAmount`, `trameByAmount`, `trameByDueDate`. |
| `value` | DECIMAL(18,4) | Cond. | V2 #578 para `variablePercent`, `fixedPercentCascade`, `fixedAmount`. |
| `trameMode` | Enum | Cond. | `simple` (default), `cascade` (PA-MOR-03). |
| `trames[]` | Array | Cond. | `TRAMASREC`: `trameId` (`COD_TRM`), `description` (`DES_TRM`), `voucherTypeId` (`TIPO`), `amountFrom` (`IMP_DES`), `amountTo` (`IMP_HAS`), `value` (`VAL_TRAMA`), `valueType` (`perDay`/`fixed`; `TIPOVALOR`), `dueDateNumber` (2..N; para `trameByDueDate`; N = tope efectivo de vencimientos del comprobante, PRM-FAC-163 de M05, 4 por defecto; DEC-106, 10-11-2026; *antes "2/3/4"*). |
| `fixedAmountVatApplies` | Boolean | Sí | PA-MOR-03 (ProCoop: `false`). |
| `conceptId` | uniqueidentifier [M04] | Sí | Concepto fiscal del recargo (obligatorio para publicar). |
| `changeOfTrameConceptId` | uniqueidentifier [M04] | No | V2 #2283. |
| `validFrom`, `validTo`, `status` | | Sí | |

**Consumidor M05 (CTR-DAT-37 de T05):** M05 conserva el espaciado de vencimientos (`dueDateSchemes.dueCount`, `spacing[]`) y, al emitir, invoca el servicio interno de M08 `mor.service.computeDueDateSurcharge` (antes "el servicio interno de M08", sin nombre) con el esquema vigente por servicio, ciclo y tipo de comprobante para obtener los importes de Vto2 a VtoN (`dueDates[].totalK`, §7.36; flujo §9.1); el resultado se congela en el comprobante con `schemeId` y versión. **Cantidad de vencimientos (DEC-106; 10-11-2026):** el esquema admite de 1 a N vencimientos, con N = tope efectivo del comprobante (`invoices.dueDateCap.effective`, PRM-FAC-163 de M05; 4 por defecto) que M05 envía en la llamada; las variantes se generalizan al vencimiento k = 2..N sin cambiar su fórmula (escalón sobre el anterior en `fixedPercentCascade`, `v × (k − 1)` en `fixedAmount`, días `VTOk − VTO1` en `variablePercent` y `trameByAmount`, trama con `dueDateNumber = k` en `trameByDueDate`), y un esquema `trameByDueDate` sin trama para algún k ≤ N es error de configuración (RN-MOR-033). M08 no fija el tope: lo valida M05 (RN-FAC-163). *Reemplazado (10-11-2026, DEC-106): "para obtener los importes de Vto2 a Vto4".* Absorbe de `dueDateSchemes` de M05 los campos `mode` → `type`, `rows[]` → `trames[]`, `compounding` → `trameMode = cascade` e `interestConceptId` → `conceptId`.

### 7.5 `earlyPaymentDiscountRules` — Descuento por pronto pago

**Origen:** `DESCUENTO_CAJA`. Campos: `voucherTypeId` (Sí), `dayFrom` (Int, Sí; `DIA_DESDE`), `dayTo` (Int, Sí; `DIA_HASTA`), `percent` (DECIMAL(18,4), Sí, 0 < p ≤ 100), `membersOnly` (Boolean, default `true`), `conceptId`, `validFrom`, `validTo`, `status`. Validación: sin superposición de días por tipo (RN-MOR-003). Índice `{tenantId, voucherTypeId, dayFrom}`.

### 7.6 `interestCalculations` — Cálculos de interés

**Propósito:** registro inmutable de cada cálculo aplicado a una operación económica (no se persisten cotizaciones efímeras salvo las del simulador o las que el socio acepta). **Origen:** `IT_PAGSO_INTERES`, `IT_PAGSO_INTERES_TRAMAS`.

| Campo | Tipo | Obl. | Descripción |
|---|---|---|---|
| `purpose` | Enum | Sí | `collection`, `entityCollection`, `gateway`, `batch`, `agreement`, `reversal`, `unlock`, `quoteAccepted`. |
| `documentRef` | { module: `fac`, id, number, type } | Sí | Documento de origen. |
| `accountId` | uniqueidentifier [M01] | Sí | |
| `calculationDate` | Date | Sí | Fecha de cálculo. |
| `baseDate` | Date | Sí | Fecha base. |
| `policyId` / `policyVersion` | uniqueidentifier / Int | Sí | |
| `parameters` | Object | Sí | Snapshot: `excludedTaxes`, `minimum`, `onCredits`, `fromLastDueDate`, `retiree`, `rounding`, `retireeNoVto2`, `adminFee`, `deferralMode`, `entityOverrides`. |
| `components.lateInterest` / `components.betweenDueDates` / `components.adminFee` / `components.discount` | { net, vat1, vat2, vatPerception, iibb, total } DECIMAL(18,4) | Sí | `InfoImporte`. |
| `tranches[]` | [{ from, to, days, rate, base, interest, vat, perception, type: `betweenDueDates`/`late`/`index`/`check`/`punitive` }] | Sí | `IT_PAGSO_INTERES_TRAMAS`. |
| `settledUntilBefore` / `settledUntilAfter` | Date | Sí | Marca de interés liquidado. |
| `operationRef` | { module, id } | Sí | Recibo, corrida, convenio. |
| `waived` | { byUserId, approvedByUserId, reason } | No | Dispensa. |
| `overriddenRate` | { rate, byUserId, reason } | No | V2 #1030. |

Índices: `{tenantId, documentRef.id, calculationDate}`; `{tenantId, operationRef.id}`.

### 7.7 `deferredInterests` — Intereses diferidos

**Origen:** `INT_DIFE`, `DEUDAVTA` (`TPCUOTA = 1`). Campos: `accountId` (Sí), `contractId` (No; V2 #2828), `sourceReceiptRef` (Sí; `COD_REC/SUC_REC/NUM_REC`), `sourceDocumentRefs` ([…], Sí), `calculationId` (Sí), `netAmount` (DECIMAL(18,4), Sí), `direction` (`debit`/`credit`), `billableItemId` (antes `pendingChargeId`) (uniqueidentifier [M05], Sí), `billedDocumentRef` (No; `COD_COMF/SUC_COMF/NUM_COMF`), `status` (`pending`, `billed`, `cancelled`). Índice `{tenantId, accountId, status}`.

### 7.8 `interestBillingRuns` e `interestBillingRunItems` — Corridas de intereses a facturar

`interestBillingRuns`: `number` (Int, Sí), `filters` (Object, Sí: `voucherTypeIds`, `dateFrom`, `dateTo`, `accountId`, `holderId`, `groupIds`, `groupMode` include/exclude, `dailyRate`, `onlyConnected`, `processPaymentsBetweenDates`, `excludePreviousInterest`, `conceptId`, `serviceId`, `onlyUnpaid`, `onlyCharges`, `valuesDeferral`, `punitiveOnce`), `variant` (`standard`, `values`, `punitive`, `chargesOnly`), `status` (§8.4), `progress` ({ total, processed, failed, checkpoint }), `totals` ({ documents, accounts, net, vat }), `approvedBy`, `jobId`, `idempotencyKey`.

`interestBillingRunItems`: `runId`, `accountId`, `documentRef`, `tranches[]` (como `interestCalculations.tranches` + `selected: Boolean`), `selected` (Boolean), `interestNet`, `interestVat`, `days`, `chargeRequestId` (uniqueidentifier [M05]), `status` (`preview`, `excluded`, `charged`, `failed`), `error`. Índices `{tenantId, runId, accountId}`; `{tenantId, documentRef.id, status}`.

### 7.9 `holdReasons` y `documentHolds` — Bloqueos

**Origen:** `CAUBLOQ`, `HISBLOQ`, `FACTURAS.ID_BLO`.

`holdReasons`: `code`, `name`, `type` (`user`, `system`), `effect` (`blockCollection`, `warnOnly`, `hideInPortal`), `blocksChannels[]` (`cashDesk`, `gateway`, `directDebit`; absorbe `invoiceBlockReasons.blocksChannels` de M05, CTR-DAT-36), `unlockInterest` ({ rate, conceptId, voucherTypeId }; V2 #2770/#2771/#2984), `status` (`active`, `inactive`; catálogo).

`documentHolds`: `documentRef` (Sí), `reasonId` (Sí), `origin` (`manual`, `notice`, `stateChangeOrder`, `legalCase`, `system`), `originRef`, `appliedAt`, `appliedBy`, `releasedAt`, `releasedBy`, `releaseCalculationId`, `status` (`active`, `released`). Historial = documentos sucesivos (nunca se edita uno liberado). Índice `{tenantId, documentRef.id, status}`. `origin` admite además `mass`, `propagation` e `interestUnblock` con `massOperationId` en `originRef` (absorbe `invoiceBlockHistory.source` de M05, CTR-DAT-36).

**Consumidor M05 (CTR-DAT-36 de T05):** M05 aplica y libera bloqueos (RF-FAC-093 a RF-FAC-097) llamando a los servicios internos de M08 `mor.service.applyHold` y `mor.service.releaseHold` (antes "el servicio interno de M08", sin nombre), que crean o liberan el `documentHold` y devuelve la proyección vigente (`reasonId`, `effect`, `blocksChannels[]`); M05 la guarda en `invoices.block` y M07 la respeta en caja, pasarelas y débito.

### 7.10 `delinquencyPolicies` — Políticas de mora (BASE §68)

| Campo | Tipo | Obl. | Descripción |
|---|---|---|---|
| `code`, `name` | String | Sí | |
| `scope.serviceId` | uniqueidentifier [M02] | Sí | Una política por servicio (y categorías). |
| `scope.categoryIds` | [uniqueidentifier] | No | |
| `accountMode` | Enum | Sí | `separate`, `unified` (CTA-001). |
| `eligibleBalance` | { includeCapital: true, includeAuthorizedCharges: Boolean, excludeConceptIds, excludeAgreementInstallmentsNotDue: true, netCredits: Boolean, thirdPartyConcepts (`exclude`/`includeIfAgreement`, default `exclude`; RN-MOR-142, HUECO-TAS-02) } | Sí | "Saldo elegible". |
| `candidate` | { daysAfterDueDate (Int), dueDateReference (`vto1`/`lastVto`), minDebt (DECIMAL(18,4)), minDocuments (Int), voucherTypeIds } | Sí | |
| `minimumPayment` | { enabled, kind (`amount`/`percent`/`exigibleObligations`/`formula`), value, purpose (`avoidSuspension`/`avoidDelinquency`/`agreement`) } | No | CTA-002 (PA-MOR-09). |
| `stages[]` | [{ stageId, order, waitDays, channels[], noticeModelId, evidenceRequired (Boolean), evidenceTypes[], autoAdvance (Boolean), includeOverdueDebt (Boolean), holdReasonId, debtDocument (Boolean), costEnabled (Boolean) }] | Sí | Secuencia de instancias. |
| `finalAction` | { type (`suspend`/`restrict`/`disconnect`/`changeCategory`/`claim`/`none`), targetStateCode, targetCategoryId, requiresApproval (Boolean), administrativeTerminationAllowed (Boolean), terminationAfterDays (Int), serviceMode (`restricted`/`interrupted`), restrictionProfile ({ kind: `outgoingBarred`/`minimumLineup`/`reducedFlow`/`speedReduction`, lineupPackageId [M02], minFlow, unit }) } | Sí | `serviceMode` y `restrictionProfile` por servicio: TEL RN-MOR-137, TV RN-MOR-138, AG RN-MOR-139; deben estar entre los `allowedModes` de la matriz (§7.18). |
| `crossServiceAffectation` | Boolean | Sí | Default `false` (CTA-003, PA-MOR-08). |
| `reactivation` | { condition (`debtCriterion`/`agreementSigned`/`downPaymentPaid`), debtCriterion (`all`/`overdueVto2`/`overdueLastVto`), sameServiceOnly, noOpenNotices, requiresTechnical (Boolean), remoteAutoConfirm (Boolean), chargeRuleId } | Sí | CTA-004, V2 #3147/#3113/#3163/#3106/#3112/#2713. |
| `exceptionsHonored` | { billingClaims: true, informedPayments: true, protections: true, agreements: true } | Sí | |
| `promise` | { allowed (Boolean), maxDays (Int), allowFromPortal (Boolean) } | Sí | |
| `validFrom`, `validTo`, `status` | | Sí | Versionada (T04). |

### 7.11 `delinquencyStages` — Instancias

**Origen:** `INSTANCI` (`COD_INS`, `DES_INS`, `DIAS`), V2 #2202/#2203/#2204. Campos: `code` (Sí), `name` (Sí), `order` (Int, Sí), `days` (Int; `DIAS`), `kind` (`candidates`, `notice`, `summons`, `sensitive`, `cut`, `treatment`, `closure`), `flags` ({ isCandidates, isInitial, isSensitive, isCut }), `regulatoryCode` (ej. `R/C`), `status` (`active`, `inactive`; catálogo). Validación: exactamente una con `isCandidates`; a lo sumo una `isCut` por política. Precarga: `1 CANDIDATOS`, `2 PRIMER INSTANCIA DE MORA`, `3 SEGUNDA INSTANCIA DE MORA`.

### 7.12 `delinquencyNoticeModels` — Modelos de aviso

**Origen:** `CIRCULAR` (`DES_CIR`, `TEXTO`, `TDEUDA`, `DEUDA`, `ADHER`, `FIR_GTE`, `FIR_AUD`, `DET_SER`, `COD_SER`, `SMS`, `PLANTILLA`). Campos: `code`, `name`, `serviceIds`, `stageIds`, `minDebtType` (`TDEUDA`), `minDebt` (`DEUDA`), `includeAdherents` (`ADHER`), `signatures` ({ manager: Boolean, auditor: Boolean }; `FIR_GTE`, `FIR_AUD`), `serviceDetail` (Boolean; `DET_SER`), `channels` ([{ channel, templateId [T09], shortText (SMS) }]), `variables` ([String]: cuenta, titular, domicilio, deuda, deuda actualizada, detalle de documentos, servicios, vencimiento de la notificación, fecha estimada de suspensión, medios de pago, código de pago), `ignoreNullServiceInfo` (V2 #2359), `includeSummary` (V2 #2322), `costAmount` (opcional; V2 #296 por plantilla), `legalText` (texto normativo obligatorio por servicio), `version`, `status` (`draft`, `published`, `retired`; catálogo versionado, §8.1).

### 7.13 `delinquencyBatches` — Lotes

Campos: `number` (Int, Sí; `LOTE`, secuencia por tenant), `operation` (`generate`, `process`), `stageId` (Sí), `policyId`, `filters` (Object), `noticeCount`, `totalDebt`, `status` (`running`, `completed`, `failed`, `annulled`), `exclusions` ([{ accountId, reason: `exception`/`alreadyNotified`/`alreadyCandidate`/`sameType`/`zeroDebt`/`agreement`/`claim`/`legalCase`/`noRecipient` }]) — reemplaza `MOROSO_TEMPORAL`; `previousBatchIds`, `jobId`, `idempotencyKey`. Índice `{tenantId, number}` único.

### 7.14 `delinquencyNotices` — Notificaciones de mora

**Origen:** `NOTIFICA`, `COMPNOTI`, `CIRCUCTA`, `RESPONSA_NOTIFICA`, `NOTI_COOP`.

| Campo | Tipo | Obl. | Descripción (origen) |
|---|---|---|---|
| `delinquencyBatchId` / `batchNumber` | uniqueidentifier / Int | Sí | `LOTE`. `delinquencyBatchId` → `delinquencyBatches`; nombre canónico de T05 §7.2 (antes `batchId`). |
| `accountId` | uniqueidentifier [M01] | Sí | `COD_SUM`. |
| `holderId` | uniqueidentifier [M01] | Sí | `COD_SOC`. |
| `contractIds` | [uniqueidentifier] | No | Servicios de la deuda. |
| `stageId` | uniqueidentifier | Sí | `COD_INS`. |
| `date` | Date | Sí | `FECHA`. |
| `dueDate` | Date | Sí | `VTO_CIR`. |
| `noticeModelId` / `noticeModelVersion` | uniqueidentifier / Int | Sí | `COD_PLA`. |
| `channel` | Enum | Sí | `printed`, `email`, `sms`, `whatsapp`, `push`, `phoneCall`, `paymentStub`. `phoneCall` se envía a T09 como canal `ivr_export` (exportación al discador o conexión FI-INT-66; DEC-104). |
| `recipients[]` | [{ personId, role (`holder`/`guarantor`/`codebtor`/`responsible`), address, verified }] | Sí | `RESPONSA_NOTIFICA` (responsables), garantes. |
| `items[]` | [{ documentRef, balanceAtNotice, voucherTypeId, settled (Boolean) }] | Sí | `COMPNOTI` (`ID_FAC`, `SALDO`, `COD_TPFC`). |
| `debt` | DECIMAL(18,4) | Sí | `DEUDA`. |
| `debtUpdated` | DECIMAL(18,4) | Sí | `DEUDA_AC`. |
| `delivery` | { status (`pending`/`queued`/`accepted`/`delivered`/`read`/`failed`/`bounced`/`manualDelivered`), deliveredAt, evidence[]: [{ type (`providerAck`/`readReceipt`/`signature`/`postalReceipt`/`courierReport`/`manual`), storedFileId, externalRef, recordedBy }], messageIds [T09] } | Sí | `RECIBIO`, `FEC_REC` + AGR-024. |
| `evidenceSatisfied` | Boolean | Sí | Según `stages[].evidenceRequired`. |
| `promise` | { date, amount, registeredAt, registeredBy, channel, status (`active`/`kept`/`broken`) } | No | `PROMESA`. |
| `rating` | Enum | Sí | `unrated`, `good`, `regular`, `bad` (`CALIFICA`). |
| `resolution` | { status, at, byUserId, reasonId } | Sí | `RESUELTA`, `FEC_RES`, `USU_RES`, `COD_CAU`. |
| `previousNoticeId` / `nextNoticeId` | uniqueidentifier | No | Encadenamiento entre instancias. |
| `costChargeRequestId` | uniqueidentifier [M05] | No | Costo de envío. |
| `debtDocumentRef` | Object | No | Comprobante de deuda notificada. |
| `holdIds` | [uniqueidentifier] | No | Bloqueos aplicados. |
| `interruptionCaseIds` | [uniqueidentifier] | No | Casos derivados (`TECNICA.CNT_NOT`). |
| `warnings` | [`settled`, `compositionChanged`] | No | V2 #53. |
| `observation` | String | No | `OBSERVA`. |
| `cooperativeNoticeRef` | String | No | `NOTI_COOP` [VERIFICAR contenido]. |

Índices: `{tenantId, accountId, resolution.status}`; `{tenantId, delinquencyBatchId}` (antes `{tenantId, batchId}`); `{tenantId, stageId, resolution.status, dueDate}`; `{tenantId, items.documentRef.id}`.

### 7.15 `delinquencyNoticeEvents` — Bitácora de notificaciones

Reemplaza `OBSERVA2`. Campos: `noticeId` (Sí), `at` (Sí), `userId` (Sí o `system`), `process` (`generate`, `process`, `delivery`, `promise`, `rating`, `exclude`, `close`, `annulBatch`, `payment`, `technical`, `note`), `fromStatus`, `toStatus`, `observation`, `data` (Object). Índice `{tenantId, noticeId, at}`.

### 7.16 `delinquencyExceptions` — Excepciones de mora

**Origen:** `EXC_MORA` (`COD_EXC`, `COD_SOC`, `COD_SUM`, `COD_PER`, `FEC_REG`, `USU_REG`, `MOTIVO`, `RECLAMAR`, `RETENER`, `FEC_DEUDA`, `VIGENCIA`, `FEC_VIG`, `USU_VIG`, `FECHA`).

| Campo | Tipo | Obl. | Descripción |
|---|---|---|---|
| `scope` | { accountId, holderId, personId, contractId } | Sí | Al menos uno. |
| `reasonId` / `reasonText` | uniqueidentifier / String | Sí | `MOTIVO`. |
| `doNotClaim` | Boolean | Sí | `RECLAMAR` (no reclamar). |
| `doNotChargeInterest` | Boolean | Sí | `RETENER` (no retener/no cobrar interés). |
| `validUntil` | Date | No | `FECHA`. |
| `debtBefore` | Date | No | `FEC_DEUDA` (nula = toda la cuenta). |
| `authorization` | { status (`pending`/`authorized`/`revoked`), by, at } | Sí | `VIGENCIA`, `USU_VIG`. |
| `cancelledAt` / `cancelledBy` | Date / uniqueidentifier | No | `FEC_VIG`. |
| `registeredBy` / `registeredAt` | | Sí | `USU_REG`, `FEC_REG`. |
| `noteId` | uniqueidentifier [M01] | No | Nota en la cuenta. |

### 7.17 `serviceProtections` — Protecciones normativas acreditadas

| Campo | Tipo | Obl. | Descripción |
|---|---|---|---|
| `type` | Enum | Sí | `electroDependency`, `publicEntity`, `healthFacility`, `educationFacility`, `emergencyRegime`, `socialTariff`, `judicialOrder`, `other`. |
| `effect` | Enum | Sí | `block` (no suspender), `review` (aprobación especial), `delay` (posponer N días). |
| `scope` | { personId, accountId, contractId, serviceId, zoneIds (para regímenes temporales) } | Sí | |
| `evidence` | [{ storedFileId, issuer, documentNumber, issuedAt }] | Sí (salvo `emergencyRegime`) | Certificado, padrón, resolución. |
| `validFrom` / `validTo` | Date | Sí / No | |
| `verification` | { status (`pending`/`verified`/`rejected`), by, at, source (`registry`/`document`/`regulator`) } | Sí | |
| `normativeRef` | String | Sí | Norma o régimen invocado. |
| `alertDaysBefore` | Int | No | Default 30. |
| `personSensitiveDataId` | uniqueidentifier → M01 `personSensitiveData` | No | Condición sensible acreditada (electrodependencia, salud) cuando `type` la requiere. Declarado en T05 (COL-MOR-20); no figuraba en el anexo (PA-MOR-22). |

### 7.18 `suspensionRestrictionRules` — Matriz de restricciones

| Campo | Tipo | Obl. | Descripción |
|---|---|---|---|
| `origin` | Enum | Sí | `normative` (cargada por plataforma/responsable normativo; no editable por el tenant) o `tenantPolicy`. |
| `code` | String | Sí | Código único de la regla en el tenant. Declarado en T05 (único `code`, COL-MOR-21); no figuraba en el anexo (PA-MOR-22). |
| `jurisdiction` | { country: `AR`, province, municipality } | Sí | |
| `serviceKind` | Enum [M02] | Sí | `internet`, `electricity`, `water`, `sewage`, `gas`, `telephony`, `tv`, `cemetery`, `bloodBank`, `health`, `burial`, `other`. |
| `restriction` | Enum | Sí | `minNotice`, `executionWindow`, `protectedCondition`, `temporaryRegime`, `minDebtOrAge`, `noCrossAffectation`, `inspectionBeforeReconnection`, `noRightCancellation`, `noSuspension`, `billingClaimSuspends`, `allowedModes`, `emergencyAlwaysEnabled`, `thirdPartyDebtNoCut`, `socialCoverageSuspension`, `reviewTaskOnly` (los cinco últimos por huecos de cobertura: RN-MOR-137 a RN-MOR-144). |
| `params` | Object | Sí | Ej. `minNotice`: { days, evidenceRequired, channels }; `executionWindow`: { weekdays, hoursFrom, hoursTo, excludeHolidays, excludeHolidayEves, excludeFridays, weatherAlertSuspends, extremeTemperature: { min, max } }; `temporaryRegime`: { from, to, zones }; `allowedModes`: { modes: [`restricted`/`interrupted`], defaultMode }; `emergencyAlwaysEnabled`: { numbers[] }; `thirdPartyDebtNoCut`: { thirdPartyBillerIds[], exceptionAgreementRef }; `socialCoverageSuspension`: { unpaidMonths, coverageKinds[] }; `reviewTaskOnly`: { afterMonths, assigneeRole }. |
| `effect` | Enum | Sí | `block`, `review`, `reschedule`, `task` (`task`: crea una tarea de revisión en T11 y no suspende; RN-MOR-144). |
| `templateId` | String | No | Plantilla de plataforma de la que proviene (por ejemplo, `ersep-cba-electricity-window`, RN-MOR-145). |
| `normativeRef` / `validationStatus` | String / Enum (`validated`/`toValidate`) | Sí | Las `toValidate` aplican como `review`. |
| `validFrom`, `validTo` | Date | Sí / No | |

### 7.19 `delinquencyReasons` — Causas

**Origen:** `CAUSAS` (`COD_CAU`, `DES_CAU`, `TIPO`). Campos: `code`, `name`, `type` (`noticeExclusion`, `cut`, `serviceTermination`, `hold`, `exception`, `agreementDefault`, `writeOff`, `prescription`, `legalClosure`, `interruptionCancel`), `requiresNote` (Boolean), `status` (`active`, `inactive`; catálogo).

### 7.20 `delinquencyEvaluations` — Evaluaciones de mora

Campos: `accountId` (Sí), `evaluationDate` (Sí), `policyVersions` ([{ serviceId, policyId, version }]), `obligations[]` ([{ documentRef, contractId, dueDate, balance, eligible (Boolean), excludedReason }]), `confirmedPayments[]`, `minimumPayment` ({ required, paid, met }), `perService[]` ([{ contractId, debt, stageReached, decision (`allowed`/`review`/`blocked`/`notApplicable`), reasons[], restrictionRuleIds[], protectionIds[] }]), `resultingActions[]` (candidatos, propuestas de caso), `status` (`open`, `closed`). Índice `{tenantId, accountId, evaluationDate}`.

### 7.21 `interruptionCases` — Casos de interrupción del servicio

| Campo | Tipo | Obl. | Descripción |
|---|---|---|---|
| `number` | Int | Sí | Secuencia por tenant. |
| `type` | Enum | Sí | `delinquencySuspension`, `delinquencyRestriction`, `delinquencyDisconnection`, `delinquencyCategoryChange`, `delinquencyClaim`, `delinquencyTermination`, `voluntarySuspension`, `otherSuspension`, `reactivation`, `reconnection`, `noBilling`. |
| `contractId` | uniqueidentifier [M01/M02] | Sí | |
| `accountId`, `holderId` | uniqueidentifier | Sí | |
| `origin` | { kind (`delinquency`/`portal`/`crm`/`technical`/`authority`), noticeId, evaluationId, crmCaseId [M09], paymentId [M07] } | Sí | |
| `serviceMode` / `restrictionProfile` | Enum / Object | No | Copia de `finalAction` al crear el caso (`restricted` con `outgoingBarred`, `minimumLineup` o `reducedFlow`; `interrupted`). RN-MOR-137 a RN-MOR-139. |
| `parentCaseId` | uniqueidentifier | No | Reconexión → caso de corte que revierte. |
| `requestedAt` / `requestedEffectiveDate` / `durationDays` | Date / Date / Int | Sí / No / No | Suspensión voluntaria. |
| `evaluation` | { decision, reasons[], restrictionRuleIds, protectionIds, evaluatedAt } | Sí | |
| `approval` | { required, workflowInstanceId [T11], status, by, at } | No | |
| `schedule` | { earliestAt, windowRuleId } | No | Ventana de ejecución. |
| `execution` | { mode (`technical`/`remote`/`direct`), workOrderId [M10], remoteActionIds [M10 `provisioningCommands`; antes "[T06]"; PA-MOR-22], confirmedAt, confirmedBy, result (`ok`/`failed`/`partial`) } | No | |
| `charges[]` | [{ chargeRuleId, chargeRequestId [M05], timing (`before`/`after`), amount }] | No | |
| `proration` | { creditDays, debitDays, chargeRequestId } | No | V2 #2483/#2661. |
| `communications[]` | [{ messageId [T09], at, status }] | No | Comunicación al socio. |
| `acceptance` | { termsVersion, acceptedAt, channel, evidence } | No | Operaciones aranceladas (BASE §53). |
| `status` | Enum | Sí | §8.6. |
| `cancellation` | { reasonId, at, by } | No | |
| `idempotencyKey` | String | Sí | |

Índices: `{tenantId, contractId, status}`; `{tenantId, number}` único; `{tenantId, origin.noticeId}`.

### 7.22 `interruptionChargeRules` — Reglas de cargos de suspensión y reconexión

**Origen:** `CONEXION` (`TIPO_CON` 4 reconexión, 5 después, 6 antes, `UNA_VEZ`), BASE §53 precargas. Campos: `code`, `name`, `caseType` (`reactivation`, `reconnection`, `voluntarySuspension`, `otherSuspension`), `serviceId`, `filters` ({ memberActive, delinquent, prepaid, zoneIds, localityIds, categoryIds, classIds, statusCodes, ownership }), `conceptId` [M04], `timing` (`before`, `after`), `oncePerCase` (Boolean; `UNA_VEZ`), `free` (Boolean), `admissibility` ({ basis (`regulation`/`contract`/`tariffResolution`), reference, approvedBy, approvedAt, productionEnabled (Boolean) }), `status`. Validación: `productionEnabled` exige `admissibility.approvedBy` con capability normativa; las reglas de baja (`termination`) no admiten cargo (RN-MOR-100).

### 7.23 `paymentPlans` — Planes de pago

**Origen:** `PLAN_CUO` (todos sus campos) y `TIP_FIN`.

| Campo | Tipo | Obl. | Origen |
|---|---|---|---|
| `code`, `name` | String | Sí | `COD_PLA`, `DES_PLA` |
| `purpose` | Enum | Sí | `regularization`, `sale`, `both` |
| `paymentType` | Enum | Sí | `downPaymentAndInstallments` (1), `installmentsOnly` (2) — `TIP_PAG` |
| `periodMonths` | Int | Sí | `PER_CUO` |
| `installments` | { suggested, min, max } | Sí | `CAN_CUO`, `MIN_CUO`, `MAX_CUO` (0 = sin tope) |
| `rate` | { inputUnit (`TNA`/`TEM`/`periodRate`), inputValue, periodRate (calculado), tna, tem, tea } | Sí | `TASA`, `INT_TNA`, `INT_TEM` |
| `rateIncludesVat` | Boolean | Sí | `TASACONIVA` |
| `amortizationMethod` | Enum | Sí | `noInterest` (1), `direct` (2), `french` (3), `german` (4), `american` (5), `balanceInstallments` (6) — `COD_CAL` |
| `financeableAmount` | { min, max, minToModify } | No | `MIN_VTA`, `MAX_VTA`, `MOD_VTA` |
| `downPayment` | { minPercent (≤ 100), onTotalWithVat (Boolean), dueDays } | No | `MIN_ENT`, `ENTMIN_IVATOTAL` |
| `stampTaxPerMille` | DECIMAL(18,4) | No | `TASASELLADO` |
| `discounts` | { previousInterestPercent, lateInterestPercent, lateDiscountScope (`current`/`all`), conditional (Boolean) } | No | `QUITA_INTR`, `QUITA_INTM` |
| `ownLateRate` | { enabled, dailyRate } | No | `MORA_PARTI`, `REC_DIAMF` |
| `indexAdjustment` | { currencyCode, economicIndexSeriesId [T04] (antes `indexTableId`, CTR-DAT-29), conceptId, lagMonths (default 2) } | No | `COD_MON_AJUSTE`, `COD_TAB`, `COD_PRO_INFLACION` |
| `noCapitalizeLateInterest` | Boolean | Sí | `NOCAP_INTMORA` |
| `templates` | { withoutGuarantor, withGuarantor } [T11] | No | `NRO_CONRE`, `NRO_CN2` |
| `defaultRule` | { trigger (`consecutiveUnpaid`/`totalUnpaid`/`daysLate`), threshold, noticeDaysBeforeDefault, rehabilitationDays, loseConditionalDiscounts (Boolean) } | Sí | Mejora (PA-MOR-13) |
| `installmentMode` | Enum | Sí | `monthlyInvoice`, `ownDocument` (V2 #306) |
| `allowPortal` | Boolean | Sí | Autogestión |
| `requiresGuarantor` | Boolean | No | |
| `requiresApprovalAbove` | { installments, discountPercent, amount } | No | Condiciones especiales |
| `validFrom`, `validTo`, `status` | | Sí | |

### 7.24 `financingInstitutionPlans` — Planes de entidades financieras (antes `financialEntities`)

**Corregido (CTR-DAT-43):** la entidad (banco, tarjeta, financiera) es `financialInstitutions` de M14; M08 no crea una colección propia de entidades y solo guarda sus planes de financiación como `financingInstitutionPlans` con `financialInstitutionId` [M14]. El nombre `financialEntities` queda como alias histórico de esta sección.

**Origen:** `ENTFIN`, `TIP_FIN`. Campos: `financialInstitutionId` [M14] (antes `code`, `name`, `kind` (`card`, `bank`, `finance`) propios), `plans[]` ([{ installments, coefficient, entityRate, cft, commissionPercent, settlementDays }]), `collectionEntityId` [M07] (si también es ente), `validFrom`, `validTo`, `status` (`active`, `inactive`; catálogo).

### 7.25 `agreementSimulations` — Simulaciones

Campos: `accountId`, `requestedBy` (usuario o socio), `channel` (`admin`, `portal`), `planId`, `obligations[]` (documentRef, capital, betweenDueDateInterest, lateInterest), `inputs` ({ downPayment, installments, targetInstallmentAmount, firstDueDate, discounts, rateOverride }), `result` ({ schedule[], totals, cft, tea, tem, tna, warnings[] }), `calculationIds`, `expiresAt` (fin del día), `convertedAgreementId`. TTL de 90 días para simulaciones no convertidas (se conservan las convertidas).

### 7.26 `agreements` — Convenios

**Origen:** `REC_CON` (cabecera; `NRO_REF`, `FECHA`, `COD_SUM`, `COD_SOC`, `COD_PER`, `CAP_A_REF`, `INT_A_REF`, `INT_A_FEC`, `INT_X_REF`, `DEU_REF`, `PER_CUO`, `INT_TEM`, `INT_TNA`, `SELLXMIL`, `ID_FAC_SELL`, `COD_GAR`, `ESTADO`), `PPAGOS`.

**Corregido (CTR-DAT-52):** `PPAGOS`, `PPITEMS` y `PPAGOS_FIRMANTES`/`PPAGOS_FIRMAS` son órdenes de pago a proveedores (`paymentOrders` de M12, `paymentExecutions` de M14), no convenios. Los convenios migran **solo** desde `REC_CON` + `IT_RECCO`; si la cooperativa piloto registró convenios en `PPAGOS`, T07 los separa por discriminador y los entrega a esta colección con `origin = cashPaymentPlan`. Las menciones a `PPAGOS` en este anexo como origen de convenios, cuotas o firmantes quedan condicionadas a ese discriminador.

| Campo | Tipo | Obl. | Descripción |
|---|---|---|---|
| `number` | Int | Sí | `NRO_REF`. |
| `kind` | Enum | Sí | `regularization`, `refinancing` (`PPAGOS` y `REC_CON` unificados). |
| `accountId` / `targetAccountId` | uniqueidentifier | Sí / No | Cuenta de origen y destino (V2 #2634). |
| `holderId`, `personId` | uniqueidentifier | Sí | `COD_SOC`, `COD_PER`. |
| `planId` / `planSnapshot` | uniqueidentifier / Object | Sí | Condiciones congeladas. |
| `date` | Date | Sí | `FECHA`. |
| `amounts` | { capital (`CAP_A_REF`), previousInterest (`INT_A_REF`), lateInterestToDate (`INT_A_FEC`), financingInterest (`INT_X_REF`), discounts, stampTax, downPayment, totalDebt (`DEU_REF`), totalToPay } | Sí | |
| `rates` | { periodRate, tem (`INT_TEM`), tna (`INT_TNA`), tea, cft, cftWithVat } | Sí | |
| `installmentMode` | Enum | Sí | `monthlyInvoice`, `ownDocument`. |
| `installmentCount`, `periodMonths`, `firstDueDate` | Int / Int / Date | Sí | `PER_CUO`. |
| `templateId` / `documentStoredFileId` (antes `documentFileId`) / `documentHash` | | Sí | PDF del convenio. |
| `signers[]` | [{ personId, role (`holder`/`codebtor`/`guarantor`/`representative`), required (Boolean) }] | Sí | `PPAGOS_FIRMANTES`, `COD_GAR`. |
| `signatures[]` | [{ signerIndex, method (`inPersonTablet`/`electronicOtp`/`digitalCertificate`/`wetScanned`), signedAt, evidence { ip, device, otpRef, storedFileId, hash } }] | No | `PPAGOS_FIRMAS`. |
| `signatureRequestId` | uniqueidentifier → T11 `signatureRequests` | No | Pedido de firma de los firmantes. Declarado en T05 (COL-MOR-29); no figuraba en el anexo (PA-MOR-22). |
| `guaranteeIds` | [uniqueidentifier] | No | |
| `approval` | { required, workflowInstanceId, status, by, at, reasons[] } | No | Condiciones especiales. |
| `status` | Enum | Sí | §8.8 (`ESTADO`). |
| `default` | { triggeredAt, reason, exigibleAmount, noticeId } | No | Caducidad. |
| `refinancedByAgreementId` / `refinancesAgreementIds` | | No | |
| `earlyCancellations[]` | [{ at, installmentNumbers, bonus, chargeRequestIds }] | No | |
| `annulment` | { at, by, reasonId, effects } | No | |
| `capitalSocialRef` | Object [M17] | No | Capital social registrado. |
| `idempotencyKey` | String | Sí | |

Índices: `{tenantId, number}` único; `{tenantId, accountId, status}`.

### 7.27 `agreementObligations` — Obligaciones incluidas

**Origen:** `IT_RECCO` (`NRO_REF`, `COD_COM`, `SUC_COM`, `NUM_COM`, `CAP_A_REF`, `INT_A_REF`, `VTO`, `TOT_COM`, `NRO_CUO`, `DE_CUO`, `CAP_CUO`, `INT_CUO`, `INT_23`, `INT_FT`, saldo y fecha de saldo originales), `PPITEMS`.

Campos: `agreementId`, `documentRef`, `sign` (+1/−1 créditos), `dueDate` (`VTO`), `capital` (`CAP_A_REF`), `recharge` (`INT_A_REF`), `total` (`TOT_COM`), `betweenDueDateInterest` (`INT_23`), `lateInterest` (`INT_FT`), `isInstallmentOf` ({ agreementId, number, of }; `NRO_CUO`, `DE_CUO`), `installmentBreakdown` ({ capital (`CAP_CUO`), currentInterest, previousInterest (`INT_CUO`), lateInterest }), `originalBalance`, `originalBalanceDate` (para revertir), `status` (`included`, `restored`).

### 7.28 `agreementInstallments` — Cuotas

**Origen:** `DEUDAVTA` (`COD_CVC`, `NRO_CUO`, `DE_CUO`, `FEC_VTO`, `CAP_CUO`, `INT_CUO`, `CAP_RES`, `FAC_AUT`, `FAC_COD`, `TPCUOTA`, `CAP_FIN`, `IAN_FIN`, `IAF_FIN`, `IVA_TOT`), `FACTURAS` con `CLASE = 1` y `NRO_REF` (chequera), `IVAVTA`.

Campos: `agreementId` (o `saleRef` [M11] para venta), `number` (0 = anticipo), `of`, `dueDate`, `components` ({ capital (`CAP_FIN`), previousInterest (`IAN_FIN`), lateInterest (`IAF_FIN`), financingInterest (`INT_CUO`), vat [{ rate, net, vat, interestType }], iibb, stampTax, indexAdjustment, advanceBonus }), `total`, `remainingPlanBalance` (`CAP_RES`/`Saldo`), `mode` (`monthlyInvoice`/`ownDocument`), `billableItemId` (antes `pendingChargeId`) [M05] o `documentRef` [M05], `billedAt`, `status` (`scheduled`, `billed`, `due`, `paid`, `partiallyPaid`, `overdue`, `accelerated`, `cancelledEarly`, `annulled`, `refinanced`), `paidAt`.

### 7.29 `guarantees` — Garantías y garantes

Campos: `kind` (`guarantor`, `securityDeposit`, `promissoryNote`, `suretyInsurance`, `bankGuarantee`, `other`), `guarantorPersonId` [M01] (si `guarantor`), `securedRef` ({ type: `serviceContract`/`agreement`/`account`, id }), `amount`, `currency`, `economicIndexSeriesId` [T04] (actualización; antes `indexTableId`, CTR-DAT-29), `documents` ([storedFileId]), `validFrom`, `validTo`, `status` (`requested`, `active`, `executed`, `applied`, `refunded`, `released`, `expired`), `liquidation` ({ at, appliedToDebt, refundAmount, refundMode (`accountCredit`/`treasury`, default `accountCredit`; HUECO-OTR-04), treasuryRef [M14] }), `requirementRuleId`, `sourceRef` ({ module: `soc`, loanId } para el depósito del préstamo ortopédico de M18).

### 7.30 `guaranteeRequirementRules` — Reglas de exigencia de garantía

Campos: `serviceId`, `categoryIds`, `condition` (`tenantOccupant`, `largeUser`, `debtHistory`, `custom`), `kind`, `amountFormula` (`fixed`/`monthsOfAverageBill`), `value`, `status`.

### 7.31 `debtCollectionAgencies` — Estudios y agencias

Nombre corregido por CTR-DAT-07 (antes `collectionAgencies`, que es la colección de entes recaudadores de M07).

Campos: `name`, `kind` (`lawFirm`, `collectionAgency`), `taxId`, `contacts[]`, `commissionPercent`, `apiClientId` [T02] (acceso `/api/v1/ext`), `status`.

### 7.32 `collectionCases` — Expedientes de gestión externa y judicial

Campos: `number`, `kind` (`external`, `judicial`, `extrajudicial`), `accountId`, `holderId`, `agencyId`, `documents[]` ([{ documentRef, balanceAtAssignment }]), `assignedAt`, `court` ({ jurisdiction, courtName, caseNumber }) (judicial), `status` (`open`, `inNegotiation`, `lawsuitFiled`, `judgment`, `enforcement`, `closedPaid`, `closedAgreement`, `closedWriteOff`, `closedPrescribed`, `withdrawn`), `events[]` ([{ at, type, description, nextDueDate, storedFileId, by }]), `costs[]` ([{ at, kind (`courtFee`/`fees`/`expenses`), amount, chargeableToDebtor (Boolean), titleRef, chargeRequestId }]), `recoveries[]` ([{ paymentRef [M07], amount }]), `closure` ({ at, reasonId }).

### 7.33 `writeOffs` — Incobrables

Campos: `number`, `accountId`, `documents[]` ([{ documentRef, balance }]), `criteria` (`age`, `exhaustedCollection`, `amountBelowCost`, `deceased`, `insolvency`, `prescribed`, `other`), `proposal` ({ by, at, notes }), `approval` ({ workflowInstanceId, by, at }), `status` (`proposed`, `approved`, `rejected`, `partiallyRecovered`, `reverted`), `accountingEventIds`, `recoveries[]`.

### 7.34 `prescriptionRules` y `prescriptionRuns` — Prescripción

`prescriptionRules`: `obligationType` ({ serviceId, voucherTypeIds, isInstallment }), `termMonths` (V2 #104), `computeFrom` (`issueDate`, `vto1`), `interruptionEvents` ([`agreementSigned`, `partialPayment`, `signedPromise`, `lawsuitFiled`]), `conceptId`, `ledgerAccountId` (V2 #2158, M15), `alertDaysBefore`, `normativeRef`, `validationStatus`, `status`.

`prescriptionRuns`: `cutoffDate`, `ruleIds`, `items[]` ([{ accountId, documentRef, balance, computedFrom, eligible, interruptedBy }]), `proposal`, `approval`, `status` (`draft`, `proposed`, `approved`, `executed`, `rejected`), `executionRefs` (documentos de signo contrario [M05] e imputaciones [M07]).

### 7.35 `collectionFollowUps` — Expedientes de seguimiento de deuda (BASE §14)

Campos: `accountId`, `segment` ({ ageBucket, amountBucket, situation }), `assignedToUserId`, `contacts[]` ([{ at, channel, result, commitment, nextStepAt, by }]), `nextStep` ({ action, dueAt }), `requiresHumanReview` (Boolean, motivo), `status` (`open`, `closed`). Se integra con la agenda de actividades de M09.

### 7.36 Campos que M08 agrega o exige en colecciones de otros módulos

| Colección (dueño) | Campo | Uso |
|---|---|---|
| `invoices` / documentos de deuda [M05] | `interestSettledUntil` (Date), `noInterest` (Boolean), `holdStatus` (derivado de `documentHolds`), `inAgreementId`, `inCollectionCaseId`, `writeOffId`, `prescribedRunId`, `dueDates[]` con `totalK` | Invariantes §2.3. |
| `accounts` [M01] | `noSurcharge` (`SUMSOC.SIN_RECARGO`), `principal` (`SUMSOC.PRINCIPAL`), `delinquencyRating` | RN-MOR-002, -072. |
| `serviceContracts` [M01/M02] | `serviceStatus` (`active`, `suspended`, `restricted`, `disconnected`, `terminated`), `delinquent` (`MOROSO`), `noBilling` (`NOFACTURAR`), `administrativeTermination` (`BAJA_ADM`), `lastInterruptionCaseId` | Cambiado solo por el servicio de M01/M02 a pedido de M08. |
| `workOrders` [M10] | `origin = delinquency`, `delinquent`, `delinquencyManagement`, `noticeId` (`TECNICA.CNT_NOT`), `interruptionCaseId` | RN-MOR-078. |

### 7.37 Tablas de campos normalizadas y referencias declaradas

Corrección de consistencia (categorías 2, 3 y 4 de `_trabajo/correccion-inconsistencias-instrucciones.md`). Para cada colección cuyo §7 lista los campos en texto se da la tabla normalizada; para las que ya tienen tabla, solo las referencias cuyo destino estaba implícito o faltaba. Fuentes: la lista del anexo y el catálogo de T05. La lista original sigue vigente como descripción; para nombres de campo y referencias prevalece esta tabla, alineada con T05. `[VERIFICAR]` marca tipo, obligatoriedad o destino no deducibles del anexo ni de T05. Referencia: colección destino (anexo dueño).

#### 7.37.1 `interestPolicies` (COL-MOR-01) — referencias declaradas

| Campo | Tipo | Referencia |
|---|---|---|
| `base.taxIds` | uniqueidentifier[] | → M06 `taxDefinitions` (T05 §7.2.1, `taxIds`) (PA-MOR-22; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `base.excludedTaxIds` | uniqueidentifier[] | → M06 `taxDefinitions` (T05 §7.2.1, `taxIds`) (PA-MOR-22; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `adminFee.amount` | DECIMAL(18,4) | No es referencia: importe del cargo administrativo (PA-MOR-22; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `adminFee.admissibilityRef` | string | No es referencia: cita normativa de admisibilidad (texto) (PA-MOR-22; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `fiscal.defaultVatSituationId` | uniqueidentifier | → M06 `vatConditionSettings` (condición IVA por defecto, COL-FIS-15) (PA-MOR-22; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `values.dailyRate` | DECIMAL(18,4) | No es referencia: tasa diaria (PA-MOR-22; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `publishedVersionId` | uniqueidentifier | → T04 `configVersions` (versión publicada del paquete de configuración, COL-CFG-03) (PA-MOR-22; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |

#### 7.37.2 `interestRateTables` (COL-MOR-02) — referencias declaradas

| Campo | Tipo | Referencia |
|---|---|---|
| `rates[].rateId` | uniqueidentifier | No es referencia: identificador del tramo dentro de la tabla (`COD_MOT`) (PA-MOR-22; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |

#### 7.37.3 `interestIndexTables` (COL-MOR-03)

Lista original: §7.3.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | Sí | `COD_TAB` | — |
| `name` | string | [VERIFICAR] | `NOM_TAB` | — |
| `purpose` | enum | [VERIFICAR] | Enum: `lateInterest`, `installmentAdjustment`, `guaranteeAdjustment` — los dos últimos reemplazados por `economicIndexSeries` de T04, CTR-DAT-29 | — |
| `periodicity` | enum | [VERIFICAR] | Enum: `daily`, `monthly` | — |
| `voucherTypeIds` | array | [VERIFICAR] | [uniqueidentifier]; `TABMORA.TIPO_FAC` | `voucherTypes` (M05) |
| `sourceRef` | string | [VERIFICAR] | — | — |
| `status` | enum | Sí | Valores: `active`, `inactive` (§8.15; PA-MOR-22); antes sin valores. | — |

#### 7.37.4 `interestIndexValues` (COL-MOR-04)

Lista original: §7.3.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `tableId` | uniqueidentifier | Sí | Sí | → M08 `interestIndexTables` (PA-MOR-22; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `date` | Date | Sí | de `DIA_TAB`/`MES_TAB`/`ANO_TAB` o `FECHA` | — |
| `value` | DECIMAL(18,4) | Sí | `IND_TAB` | — |
| `importBatchId` | uniqueidentifier | No | (uniqueidentifier, No). Índice único `{tenantId, tableId, date}` | → T04 `masterImportJobs` (importación de índices desde planilla; T05 §7.2.1) (PA-MOR-22; antes "[VERIFICAR] destino no deducible (lote de importación)") |

#### 7.37.5 `dueDateSurchargeSchemes` (COL-MOR-05) — referencias declaradas

| Campo | Tipo | Referencia |
|---|---|---|
| `scope.cycleIds` | uniqueidentifier[] | → M05 `billingCycles` (ciclo de facturación, COL-FAC-01) (PA-MOR-22; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |

#### 7.37.6 `earlyPaymentDiscountRules` (COL-MOR-06)

Lista original: §7.5.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `voucherTypeId` | uniqueidentifier | Sí | — | `voucherTypes` (M05) |
| `dayFrom` | int | Sí | `DIA_DESDE` | — |
| `dayTo` | int | Sí | `DIA_HASTA` | — |
| `percent` | DECIMAL(18,4) | Sí | Sí, 0 < p ≤ 100 | — |
| `membersOnly` | bool | [VERIFICAR] | default `true` | — |
| `conceptId` | uniqueidentifier | [VERIFICAR] | — | `billableConcepts` (M02) |
| `validFrom` | Date | [VERIFICAR] | — | — |
| `validTo` | Date | [VERIFICAR] | — | — |
| `status` | [VERIFICAR] | [VERIFICAR] | — | — |

#### 7.37.7 `interestCalculations` (COL-MOR-07) — referencias declaradas

| Campo | Tipo | Referencia |
|---|---|---|
| `policyId` | uniqueidentifier | `interestPolicies` (M08); antes implícita por el nombre |
| `policyVersion` | int | No es referencia: número de versión de `interestPolicies` usado en el cálculo (PA-MOR-22; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `operationRef` | uniqueidentifier | `operations` (T11); antes implícita por el nombre |

#### 7.37.8 `deferredInterests` (COL-MOR-08)

Lista original: §7.7.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `accountId` | uniqueidentifier | Sí | — | `accounts` (M01) |
| `contractId` | uniqueidentifier | No | V2 #2828 | `serviceContracts` (M02) |
| `sourceReceiptRef` | string | Sí | `COD_REC/SUC_REC/NUM_REC` | `receipts` (M07) |
| `sourceDocumentRefs` | array | Sí | […], Sí | — |
| `calculationId` | uniqueidentifier | Sí | — | `interestCalculations` (M08); antes implícita por el nombre |
| `netAmount` | DECIMAL(18,4) | Sí | Sí | — |
| `direction` | enum | [VERIFICAR] | `debit`/`credit` | — |
| `billableItemId` | uniqueidentifier | Sí | uniqueidentifier [M05], Sí | → M05 `billableItems`. Nombre canónico de T05 §7.2.1 `billableItemId` (antes `pendingChargeId`) (PA-MOR-22; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `billedDocumentRef` | string | No | `COD_COMF/SUC_COMF/NUM_COMF` | `documents` (T11) |
| `status` | enum | [VERIFICAR] | `pending`, `billed`, `cancelled` | — |
| `billableItemId` | uniqueidentifier | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `billableItems` (M05); antes implícita por el nombre |

#### 7.37.9 `interestBillingRuns` (COL-MOR-09)

Lista original: §7.8.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `number` | int | Sí | Sí | — |
| `filters` | object | Sí | Sí: `voucherTypeIds`, `dateFrom`, `dateTo`, `accountId`, `holderId`, `groupIds`, `groupMode` include/exclude, `dailyRate`, `onlyConnected`,… | — |
| `variant` | enum | [VERIFICAR] | `standard`, `values`, `punitive`, `chargesOnly` | — |
| `status` | [VERIFICAR] | [VERIFICAR] | §8.4 | — |
| `progress` | object | [VERIFICAR] | { total, processed, failed, checkpoint } | — |
| `totals` | object | [VERIFICAR] | { documents, accounts, net, vat } | — |
| `approvedBy` | uniqueidentifier | [VERIFICAR] | — | `memberships` (T02) |
| `jobId` | uniqueidentifier | [VERIFICAR] | — | → T01 `jobRuns` (ejecución del job) (PA-MOR-22; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `idempotencyKey` | string | [VERIFICAR] | — | — |

#### 7.37.10 `interestBillingRunItems` (COL-MOR-10)

Lista original: §7.8.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `runId` | uniqueidentifier | [VERIFICAR] | — | `interestBillingRuns` (M08); antes implícita por el nombre |
| `accountId` | uniqueidentifier | [VERIFICAR] | — | `accounts` (M01) |
| `documentRef` | string | [VERIFICAR] | — | — |
| `tranches` | array | [VERIFICAR] | como `interestCalculations.tranches` + `selected: Boolean` | — |
| `selected` | bool | [VERIFICAR] | — | — |
| `interestNet` | [VERIFICAR] | [VERIFICAR] | — | — |
| `interestVat` | [VERIFICAR] | [VERIFICAR] | — | — |
| `days` | int | [VERIFICAR] | — | — |
| `chargeRequestId` | uniqueidentifier | [VERIFICAR] | Cargo pedido a M05. | → M05 `billableItems` (cargo pendiente; T05 §7.2.1, `pendingChargeId`) (PA-MOR-22; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `status` | enum | [VERIFICAR] | `preview`, `excluded`, `charged`, `failed` | — |
| `error` | [VERIFICAR] | [VERIFICAR] | — | — |

#### 7.37.11 `holdReasons` (COL-MOR-11)

Lista original: §7.9.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | [VERIFICAR] | — | — |
| `name` | string | [VERIFICAR] | — | — |
| `type` | enum | [VERIFICAR] | `user`, `system` | — |
| `effect` | enum | [VERIFICAR] | `blockCollection`, `warnOnly`, `hideInPortal` | — |
| `blocksChannels` | enum | [VERIFICAR] | `cashDesk`, `gateway`, `directDebit`; absorbe `invoiceBlockReasons.blocksChannels` de M05, CTR-DAT-36 | — |
| `unlockInterest` | object | [VERIFICAR] | { rate, conceptId, voucherTypeId }; V2 #2770/#2771/#2984 | — |
| `status` | enum | [VERIFICAR] | `active`, `inactive`; catálogo | — |
| `appliesTo` | any[] | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.37.12 `documentHolds` (COL-MOR-12)

Lista original: §7.9.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `documentRef` | string | Sí | — | — |
| `reasonId` | uniqueidentifier | Sí | Mismo dato que `holdReasonId` (nombre de T05, fila final); se usa `holdReasonId`. | → M08 `holdReasons` (T05 §7.2.1, `reasonId`) (PA-MOR-22; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `origin` | enum | [VERIFICAR] | `manual`, `notice`, `stateChangeOrder`, `legalCase`, `system` | — |
| `originRef` | string | [VERIFICAR] | — | — |
| `appliedAt` | Date | [VERIFICAR] | — | — |
| `appliedBy` | uniqueidentifier | [VERIFICAR] | — | `memberships` (T02) |
| `releasedAt` | Date | [VERIFICAR] | — | — |
| `releasedBy` | uniqueidentifier | [VERIFICAR] | — | `memberships` (T02) |
| `releaseCalculationId` | uniqueidentifier | [VERIFICAR] | — | `interestCalculations` (M08); antes implícita por el nombre |
| `status` | enum | [VERIFICAR] | `active`, `released`). Historial = documentos sucesivos (nunca se edita uno liberado | — |
| `holdReasonId` | uniqueidentifier | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `holdReasons` (M08); antes implícita por el nombre |

#### 7.37.13 `delinquencyStages` (COL-MOR-14)

Lista original: §7.11.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | Sí | — | — |
| `name` | string | Sí | — | — |
| `order` | int | Sí | Sí | — |
| `days` | int | [VERIFICAR] | Int; `DIAS` | — |
| `kind` | enum | [VERIFICAR] | `candidates`, `notice`, `summons`, `sensitive`, `cut`, `treatment`, `closure` | — |
| `flags` | object | [VERIFICAR] | { isCandidates, isInitial, isSensitive, isCut } | — |
| `regulatoryCode` | string | [VERIFICAR] | ej. `R/C` | — |
| `status` | enum | [VERIFICAR] | `active`, `inactive`; catálogo | — |
| `policyId` | uniqueidentifier | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `delinquencyPolicies` (M08); antes implícita por el nombre |

#### 7.37.14 `delinquencyNoticeModels` (COL-MOR-15)

Lista original: §7.12.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | [VERIFICAR] | — | — |
| `name` | string | [VERIFICAR] | — | — |
| `serviceIds` | uniqueidentifier[] | [VERIFICAR] | — | `tenantServices` (M02) |
| `stageIds` | uniqueidentifier[] | [VERIFICAR] | — | `delinquencyStages` (M08); antes implícita por el nombre |
| `minDebtType` | [VERIFICAR] | [VERIFICAR] | `TDEUDA` | — |
| `minDebt` | DECIMAL(18,4) | [VERIFICAR] | `DEUDA` | — |
| `includeAdherents` | bool | [VERIFICAR] | `ADHER` | — |
| `signatures` | object | [VERIFICAR] | { manager: Boolean, auditor: Boolean }; `FIR_GTE`, `FIR_AUD` | — |
| `serviceDetail` | bool | [VERIFICAR] | Boolean; `DET_SER` | — |
| `channels` | array | [VERIFICAR] | [{ channel, templateId [T09], shortText (SMS) }] | — |
| `variables` | array | [VERIFICAR] | [String]: cuenta, titular, domicilio, deuda, deuda actualizada, detalle de documentos, servicios, vencimiento de la notificación, fecha estimada de suspensión, medios… | — |
| `ignoreNullServiceInfo` | [VERIFICAR] | [VERIFICAR] | V2 #2359 | — |
| `includeSummary` | bool | [VERIFICAR] | V2 #2322 | — |
| `costAmount` | DECIMAL(18,4) | No | opcional; V2 #296 por plantilla | — |
| `legalText` | string | [VERIFICAR] | texto normativo obligatorio por servicio | — |
| `version` | [VERIFICAR] | [VERIFICAR] | — | — |
| `status` | enum | [VERIFICAR] | `draft`, `published`, `retired`; catálogo versionado, §8.1 | — |
| `templateVersionId` | uniqueidentifier | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `templateVersions` (T11); antes implícita por el nombre |

#### 7.37.15 `delinquencyBatches` (COL-MOR-16)

Lista original: §7.13.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `number` | int | Sí | `LOTE`, secuencia por tenant | — |
| `operation` | enum | [VERIFICAR] | `generate`, `process` | — |
| `stageId` | uniqueidentifier | Sí | — | `delinquencyStages` (M08); antes implícita por el nombre |
| `policyId` | uniqueidentifier | [VERIFICAR] | — | `delinquencyPolicies` (M08); antes implícita por el nombre |
| `filters` | object | [VERIFICAR] | Object | — |
| `noticeCount` | int | [VERIFICAR] | — | — |
| `totalDebt` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `status` | enum | [VERIFICAR] | `running`, `completed`, `failed`, `annulled` | — |
| `exclusions` | array | [VERIFICAR] | ([{ accountId, reason: `exception`/`alreadyNotified`/`alreadyCandidate`/`sameType`/`zeroDebt`/`agreement`/`claim`/`legalCase`/`noRecipient` }]) — reemplaza… | — |
| `previousBatchIds` | uniqueidentifier[] | [VERIFICAR] | — | `delinquencyBatches` (M08); antes implícita por el nombre |
| `jobId` | uniqueidentifier | [VERIFICAR] | — | → T01 `jobRuns` (ejecución del job) (PA-MOR-22; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `idempotencyKey` | string | [VERIFICAR] | — | — |

#### 7.37.16 `delinquencyNotices` (COL-MOR-17) — referencias declaradas

| Campo | Tipo | Referencia |
|---|---|---|
| `delinquencyBatchId` | uniqueidentifier | → M08 `delinquencyBatches`. Nombre canónico de T05 §7.2 (antes `batchId`; antes "`delinquencyBatches` (M08); antes implícita por el nombre") |
| `stageId` | uniqueidentifier | `delinquencyStages` (M08); antes implícita por el nombre |
| `noticeModelId` | uniqueidentifier | `delinquencyNoticeModels` (M08); antes implícita por el nombre |
| `noticeModelVersion` | int | No es referencia: número de versión de `delinquencyNoticeModels` usado (PA-MOR-22; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `previousNoticeId` | uniqueidentifier | `delinquencyNotices` (M08); antes implícita por el nombre |
| `nextNoticeId` | uniqueidentifier | `delinquencyNotices` (M08); antes implícita por el nombre |
| `costChargeRequestId` | uniqueidentifier | → M05 `billableItems` (cargo del costo de envío; T05 §7.2.1, `pendingChargeId`) (PA-MOR-22; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `holdIds` | uniqueidentifier | `documentHolds` (M08); antes implícita por el nombre |
| `interruptionCaseIds` | uniqueidentifier | `interruptionCases` (M08); antes implícita por el nombre |

#### 7.37.17 `delinquencyNoticeEvents` (COL-MOR-18)

Lista original: §7.15.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `noticeId` | uniqueidentifier | Sí | — | `delinquencyNotices` (M08); antes implícita por el nombre |
| `at` | [VERIFICAR] | Sí | — | — |
| `userId` | uniqueidentifier | Sí | Sí o `system` | `memberships` (T02) |
| `process` | enum | [VERIFICAR] | `generate`, `process`, `delivery`, `promise`, `rating`, `exclude`, `close`, `annulBatch`, `payment`, `technical`, `note` | — |
| `fromStatus` | enum | No | Valores de `delinquencyNotices.status` (§8.6): `open`, `processed`, `paid`, `excluded`, `inTechnical`, `closed`, `annulled`; nulo en el alta (§8.15; PA-MOR-22); antes sin valores. | — |
| `toStatus` | enum | Sí | Mismos valores que `fromStatus` (§8.15; PA-MOR-22); antes sin valores. | — |
| `observation` | [VERIFICAR] | [VERIFICAR] | — | — |
| `data` | object | [VERIFICAR] | Object | — |

#### 7.37.18 `delinquencyExceptions` (COL-MOR-19) — referencias declaradas

| Campo | Tipo | Referencia |
|---|---|---|
| `reasonId` | uniqueidentifier | `delinquencyReasons` (M08); antes implícita por el nombre |
| `reasonText` | string | No es referencia: motivo en texto libre (PA-MOR-22; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `noteId` | uniqueidentifier | `notes` (M01); antes implícita por el nombre |

#### 7.37.19 `suspensionRestrictionRules` (COL-MOR-21) — referencias declaradas

| Campo | Referencia |
|---|---|
| `templateId` | No es referencia: clave natural `code` de la fila de plataforma de la misma colección (T05 §7.2.1) (PA-MOR-22; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |

#### 7.37.20 `delinquencyReasons` (COL-MOR-22)

Lista original: §7.19.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | [VERIFICAR] | — | — |
| `name` | string | [VERIFICAR] | — | — |
| `type` | enum | [VERIFICAR] | `noticeExclusion`, `cut`, `serviceTermination`, `hold`, `exception`, `agreementDefault`, `writeOff`, `prescription`, `legalClosure`, `interruptionCancel` | — |
| `requiresNote` | bool | [VERIFICAR] | — | — |
| `status` | enum | [VERIFICAR] | `active`, `inactive`; catálogo | — |

#### 7.37.21 `delinquencyEvaluations` (COL-MOR-23)

Lista original: §7.20.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `accountId` | uniqueidentifier | Sí | — | `accounts` (M01) |
| `evaluationDate` | Date | Sí | — | — |
| `policyVersions` | array | [VERIFICAR] | [{ serviceId, policyId, version }] | — |
| `obligations` | array | [VERIFICAR] | [{ documentRef, contractId, dueDate, balance, eligible (Boolean), excludedReason }] | — |
| `confirmedPayments` | array | [VERIFICAR] | — | — |
| `minimumPayment` | object | [VERIFICAR] | { required, paid, met } | — |
| `perService` | array | [VERIFICAR] | [{ contractId, debt, stageReached, decision (`allowed`/`review`/`blocked`/`notApplicable`), reasons[], restrictionRuleIds[], protectionIds[] }] | — |
| `resultingActions` | array | [VERIFICAR] | candidatos, propuestas de caso | — |
| `status` | enum | [VERIFICAR] | `open`, `closed` | — |

#### 7.37.22 `interruptionCases` (COL-MOR-24) — referencias declaradas

| Campo | Referencia |
|---|---|
| `parentCaseId` | → M08 `interruptionCases` (caso padre) (PA-MOR-22; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |

#### 7.37.23 `interruptionChargeRules` (COL-MOR-25)

Lista original: §7.22.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | string | [VERIFICAR] | — | — |
| `name` | string | [VERIFICAR] | — | — |
| `caseType` | enum | [VERIFICAR] | `reactivation`, `reconnection`, `voluntarySuspension`, `otherSuspension` | — |
| `serviceId` | uniqueidentifier | [VERIFICAR] | — | `tenantServices` (M02) |
| `filters` | object | [VERIFICAR] | { memberActive, delinquent, prepaid, zoneIds, localityIds, categoryIds, classIds, statusCodes, ownership } | — |
| `conceptId` | array | [VERIFICAR] | [M04] | `billableConcepts` (M02) |
| `timing` | enum | [VERIFICAR] | `before`, `after` | — |
| `oncePerCase` | bool | [VERIFICAR] | Boolean; `UNA_VEZ` | — |
| `free` | bool | [VERIFICAR] | — | — |
| `admissibility` | object | [VERIFICAR] | { basis (`regulation`/`contract`/`tariffResolution`), reference, approvedBy, approvedAt, productionEnabled (Boolean) } | — |
| `status` | [VERIFICAR] | [VERIFICAR] | — | — |
| `eventChargeId` | uniqueidentifier | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `eventCharges` (M04); antes implícita por el nombre |

#### 7.37.24 `financingInstitutionPlans` (COL-MOR-27)

Lista original: §7.24.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `financialInstitutionId` | array | [VERIFICAR] | [M14] (antes `code`, `name`, `kind` (`card`, `bank`, `finance`) propios) | `financialInstitutions` (M14); antes implícita por el nombre |
| `plans` | array | [VERIFICAR] | [{ installments, coefficient, entityRate, cft, commissionPercent, settlementDays }] | — |
| `collectionEntityId` | uniqueidentifier | [VERIFICAR] | Ente recaudador de M07 cuando la entidad también cobra (antes tipo `array`). | → M07 `collectionAgencies` (ente recaudador, no `debtCollectionAgencies` de M08; PA-MOR-22; antes "`collectionAgencies` (M07); antes implícita por el nombre") |
| `validFrom` | Date | [VERIFICAR] | — | — |
| `validTo` | Date | [VERIFICAR] | — | — |
| `status` | enum | [VERIFICAR] | `active`, `inactive`; catálogo | — |

#### 7.37.25 `agreementSimulations` (COL-MOR-28)

Lista original: §7.25.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `accountId` | uniqueidentifier | [VERIFICAR] | — | `accounts` (M01) |
| `requestedBy` | uniqueidentifier | [VERIFICAR] | usuario o socio | `memberships` (T02) |
| `channel` | enum | [VERIFICAR] | `admin`, `portal` | — |
| `planId` | uniqueidentifier | [VERIFICAR] | — | `servicePlans` (M02) |
| `obligations` | array | [VERIFICAR] | documentRef, capital, betweenDueDateInterest, lateInterest | — |
| `inputs` | object | [VERIFICAR] | { downPayment, installments, targetInstallmentAmount, firstDueDate, discounts, rateOverride } | — |
| `result` | object | [VERIFICAR] | { schedule[], totals, cft, tea, tem, tna, warnings[] } | — |
| `calculationIds` | uniqueidentifier[] | [VERIFICAR] | — | `interestCalculations` (M08); antes implícita por el nombre |
| `expiresAt` | Date | [VERIFICAR] | fin del día | — |
| `convertedAgreementId` | uniqueidentifier | [VERIFICAR] | . TTL de 90 días para simulaciones no convertidas (se conservan las convertidas) | `agreements` (M08); antes implícita por el nombre |

#### 7.37.26 `agreements` (COL-MOR-29) — referencias declaradas

| Campo | Tipo | Referencia |
|---|---|---|
| `targetAccountId` | uniqueidentifier | → M01 `accounts` (cuenta de destino, V2 #2634; T05 §7.2.1) (PA-MOR-22; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `planSnapshot` | object | No es referencia: condiciones del plan congeladas (PA-MOR-22; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `templateId` | uniqueidentifier | → T11 `documentTemplates` (plantilla del convenio; T05 §7.2.1) (PA-MOR-22; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `guaranteeIds` | uniqueidentifier[] | `guarantees` (M08); antes implícita por el nombre |
| `refinancedByAgreementId` | uniqueidentifier | `agreements` (M08); antes implícita por el nombre |
| `refinancesAgreementIds` | uniqueidentifier[] | `agreements` (M08); antes implícita por el nombre |
| `signatureRequestId` | uniqueidentifier | → T11 `signatureRequests` (pedido de firma de `signers[]`; COL-WFL-48 cita los convenios de M08). Declarado en T05; no figuraba en el anexo (PA-MOR-22). |

#### 7.37.27 `agreementObligations` (COL-MOR-30)

Lista original: §7.27.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `agreementId` | uniqueidentifier | [VERIFICAR] | — | `agreements` (M08); antes implícita por el nombre |
| `documentRef` | string | [VERIFICAR] | — | — |
| `sign` | [VERIFICAR] | [VERIFICAR] | +1/−1 créditos | — |
| `dueDate` | Date | [VERIFICAR] | `VTO` | — |
| `capital` | [VERIFICAR] | [VERIFICAR] | `CAP_A_REF` | — |
| `recharge` | [VERIFICAR] | [VERIFICAR] | `INT_A_REF` | — |
| `total` | DECIMAL(18,4) | [VERIFICAR] | `TOT_COM` | — |
| `betweenDueDateInterest` | [VERIFICAR] | [VERIFICAR] | `INT_23` | — |
| `lateInterest` | [VERIFICAR] | [VERIFICAR] | `INT_FT` | — |
| `isInstallmentOf` | object | [VERIFICAR] | { agreementId, number, of }; `NRO_CUO`, `DE_CUO` | — |
| `installmentBreakdown` | object | [VERIFICAR] | { capital (`CAP_CUO`), currentInterest, previousInterest (`INT_CUO`), lateInterest } | — |
| `originalBalance` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `originalBalanceDate` | Date | [VERIFICAR] | para revertir | — |
| `status` | enum | [VERIFICAR] | `included`, `restored` | — |
| `obligationId` | uniqueidentifier | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `obligations` (M07) |

#### 7.37.28 `agreementInstallments` (COL-MOR-31)

Lista original: §7.28.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `agreementId` | uniqueidentifier | [VERIFICAR] | o `saleRef` [M11] para venta | `agreements` (M08); antes implícita por el nombre |
| `number` | int / string [VERIFICAR] | [VERIFICAR] | 0 = anticipo | — |
| `of` | [VERIFICAR] | [VERIFICAR] | — | — |
| `dueDate` | Date | [VERIFICAR] | — | — |
| `components` | object | [VERIFICAR] | { capital (`CAP_FIN`), previousInterest (`IAN_FIN`), lateInterest (`IAF_FIN`), financingInterest (`INT_CUO`), vat [{ rate, net, vat, interestType }], iibb, stampTax, i… | — |
| `total` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `remainingPlanBalance` | DECIMAL(18,4) | [VERIFICAR] | `CAP_RES`/`Saldo` | — |
| `mode` | enum | [VERIFICAR] | `monthlyInvoice`/`ownDocument` | — |
| `billableItemId` | array | [VERIFICAR] | [M05] o `documentRef` [M05] | → M05 `billableItems`. Nombre canónico de T05 §7.2.1 `billableItemId` (antes `pendingChargeId`) (PA-MOR-22; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `billedAt` | Date | [VERIFICAR] | — | — |
| `status` | enum | [VERIFICAR] | `scheduled`, `billed`, `due`, `paid`, `partiallyPaid`, `overdue`, `accelerated`, `cancelledEarly`, `annulled`, `refinanced` (transiciones en §8.14) | — |
| `paidAt` | Date | [VERIFICAR] | — | — |
| `billableItemId` | uniqueidentifier | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `billableItems` (M05); antes implícita por el nombre |

#### 7.37.29 `guarantees` (COL-MOR-32)

Lista original: §7.29.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `kind` | enum | [VERIFICAR] | `guarantor`, `securityDeposit`, `promissoryNote`, `suretyInsurance`, `bankGuarantee`, `other` | — |
| `guarantorPersonId` | array | [VERIFICAR] | [M01] (si `guarantor`) | `persons` (M01) |
| `securedRef` | object | [VERIFICAR] | { type: `serviceContract`/`agreement`/`account`, id } | — |
| `amount` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `currency` | [VERIFICAR] | [VERIFICAR] | — | — |
| `economicIndexSeriesId` | array | [VERIFICAR] | [T04] (actualización; antes `indexTableId`, CTR-DAT-29) | `economicIndexSeries` (T04); antes implícita por el nombre |
| `documents` | array | [VERIFICAR] | [storedFileId] | — |
| `validFrom` | Date | [VERIFICAR] | — | — |
| `validTo` | Date | [VERIFICAR] | — | — |
| `status` | enum | [VERIFICAR] | `requested`, `active`, `executed`, `applied`, `refunded`, `released`, `expired` | — |
| `liquidation` | object | [VERIFICAR] | { at, appliedToDebt, refundAmount, refundMode (`accountCredit`/`treasury`, default `accountCredit`; HUECO-OTR-04), treasuryRef [M14] } | — |
| `requirementRuleId` | uniqueidentifier | [VERIFICAR] | — | `guaranteeRequirementRules` (M08); antes implícita por el nombre |
| `sourceRef` | object | [VERIFICAR] | { module: `soc`, loanId } para el depósito del préstamo ortopédico de M18 | — |
| `agreementId` | uniqueidentifier | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `agreements` (M08); antes implícita por el nombre |
| `personId` | uniqueidentifier | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `persons` (M01) |

#### 7.37.30 `guaranteeRequirementRules` (COL-MOR-33)

Lista original: §7.30.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `serviceId` | uniqueidentifier | [VERIFICAR] | — | `tenantServices` (M02) |
| `categoryIds` | uniqueidentifier[] | [VERIFICAR] | — | `serviceCategories` (M02) |
| `condition` | enum | [VERIFICAR] | `tenantOccupant`, `largeUser`, `debtHistory`, `custom` | — |
| `kind` | [VERIFICAR] | [VERIFICAR] | — | — |
| `amountFormula` | enum | [VERIFICAR] | `fixed`/`monthsOfAverageBill` | — |
| `value` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `status` | [VERIFICAR] | [VERIFICAR] | — | — |
| `code` | string | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.37.31 `debtCollectionAgencies` (COL-MOR-34)

Lista original: §7.31.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `name` | string | [VERIFICAR] | — | — |
| `kind` | enum | [VERIFICAR] | `lawFirm`, `collectionAgency` | — |
| `taxId` | string | [VERIFICAR] | CUIT del estudio o agencia (antes tipo `uniqueidentifier`). | No es referencia (T05 §7.2.1, `taxId`) (PA-MOR-22; antes "[VERIFICAR] destino no deducible (identificador externo o interno)") |
| `contacts` | array | [VERIFICAR] | — | — |
| `commissionPercent` | DECIMAL(18,4) | [VERIFICAR] | — | — |
| `apiClientId` | array | [VERIFICAR] | [T02] (acceso `/api/v1/ext`) | `apiClients` (T02); antes implícita por el nombre |
| `status` | enum | Sí | Valores: `active`, `suspended`, `inactive` (§8.15; PA-MOR-22); antes sin valores. | — |
| `supplierId` | uniqueidentifier | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `suppliers` (M12) |
| `code` | string | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.37.32 `collectionCases` (COL-MOR-35)

Lista original: §7.32.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `number` | int / string [VERIFICAR] | [VERIFICAR] | — | — |
| `kind` | enum | [VERIFICAR] | `external`, `judicial`, `extrajudicial` | — |
| `accountId` | uniqueidentifier | [VERIFICAR] | — | `accounts` (M01) |
| `holderId` | uniqueidentifier | [VERIFICAR] | — | `holders` (M01) |
| `debtCollectionAgencyId` | uniqueidentifier | [VERIFICAR] | Nombre de T05; antes `agencyId` en este anexo. | `debtCollectionAgencies` (M08); antes implícita por el nombre |
| `documents` | array | [VERIFICAR] | [{ documentRef, balanceAtAssignment }] | — |
| `assignedAt` | Date | [VERIFICAR] | — | — |
| `court` | object | [VERIFICAR] | { jurisdiction, courtName, caseNumber }) (judicial | — |
| `status` | enum | [VERIFICAR] | `open`, `inNegotiation`, `lawsuitFiled`, `judgment`, `enforcement`, `closedPaid`, `closedAgreement`, `closedWriteOff`, `closedPrescribed`, `withdrawn` | — |
| `events` | array | [VERIFICAR] | [{ at, type, description, nextDueDate, storedFileId, by }] | — |
| `costs` | array | [VERIFICAR] | [{ at, kind (`courtFee`/`fees`/`expenses`), amount, chargeableToDebtor (Boolean), titleRef, chargeRequestId }] | — |
| `recoveries` | array | [VERIFICAR] | [{ paymentRef [M07], amount }] | — |
| `closure` | object | [VERIFICAR] | { at, reasonId } | — |
| `dossierId` | uniqueidentifier | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `dossiers` (T11); antes implícita por el nombre |

#### 7.37.33 `writeOffs` (COL-MOR-36)

Lista original: §7.33.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `number` | int / string [VERIFICAR] | [VERIFICAR] | — | — |
| `accountId` | uniqueidentifier | [VERIFICAR] | — | `accounts` (M01) |
| `documents` | array | [VERIFICAR] | [{ documentRef, balance }] | — |
| `criteria` | enum | [VERIFICAR] | `age`, `exhaustedCollection`, `amountBelowCost`, `deceased`, `insolvency`, `prescribed`, `other` | — |
| `proposal` | object | [VERIFICAR] | { by, at, notes } | — |
| `approval` | object | [VERIFICAR] | { workflowInstanceId, by, at } | — |
| `status` | enum | [VERIFICAR] | `proposed`, `approved`, `rejected`, `partiallyRecovered`, `reverted` | — |
| `accountingEventIds` | uniqueidentifier[] | [VERIFICAR] | — | `accountingEvents` (M15); antes implícita por el nombre |
| `recoveries` | array | [VERIFICAR] | — | — |
| `obligationIds` | uniqueidentifier[] | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `obligations` (M07) |
| `journalEntryId` | uniqueidentifier | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `journalEntries` (M15); antes implícita por el nombre |

#### 7.37.34 `prescriptionRules` (COL-MOR-37)

Lista original: §7.34.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `obligationType` | object | [VERIFICAR] | { serviceId, voucherTypeIds, isInstallment } | — |
| `termMonths` | [VERIFICAR] | [VERIFICAR] | V2 #104 | — |
| `computeFrom` | enum | [VERIFICAR] | `issueDate`, `vto1` | — |
| `interruptionEvents` | array | [VERIFICAR] | [`agreementSigned`, `partialPayment`, `signedPromise`, `lawsuitFiled`] | — |
| `conceptId` | uniqueidentifier | [VERIFICAR] | — | `billableConcepts` (M02) |
| `ledgerAccountId` | uniqueidentifier | [VERIFICAR] | V2 #2158, M15 | `ledgerAccounts` (M15) |
| `alertDaysBefore` | [VERIFICAR] | [VERIFICAR] | — | — |
| `normativeRef` | string | [VERIFICAR] | — | — |
| `validationStatus` | [VERIFICAR] | [VERIFICAR] | — | — |
| `status` | [VERIFICAR] | [VERIFICAR] | — | — |
| `serviceId` | uniqueidentifier | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `tenantServices` (M02) |
| `validFrom` | Date | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.37.35 `prescriptionRuns` (COL-MOR-38)

Lista original: §7.34.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `cutoffDate` | Date | [VERIFICAR] | — | — |
| `prescriptionRuleIds` | uniqueidentifier[] | [VERIFICAR] | Nombre de T05; antes `ruleIds` en este anexo. | `prescriptionRules` (M08); antes implícita por el nombre |
| `items` | array | [VERIFICAR] | [{ accountId, documentRef, balance, computedFrom, eligible, interruptedBy }] | — |
| `proposal` | [VERIFICAR] | [VERIFICAR] | — | — |
| `approval` | [VERIFICAR] | [VERIFICAR] | — | — |
| `status` | enum | [VERIFICAR] | `draft`, `proposed`, `approved`, `executed`, `rejected` | — |
| `executionRefs` | [VERIFICAR] | [VERIFICAR] | documentos de signo contrario [M05] e imputaciones [M07] | — |
| `number` | string | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | — |

#### 7.37.36 `collectionFollowUps` (COL-MOR-39)

Lista original: §7.35.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `accountId` | uniqueidentifier | [VERIFICAR] | — | `accounts` (M01) |
| `segment` | object | [VERIFICAR] | { ageBucket, amountBucket, situation } | — |
| `assignedToUserId` | uniqueidentifier | [VERIFICAR] | — | `memberships` (T02) |
| `contacts` | array | [VERIFICAR] | [{ at, channel, result, commitment, nextStepAt, by }] | — |
| `nextStep` | object | [VERIFICAR] | { action, dueAt } | — |
| `requiresHumanReview` | bool | [VERIFICAR] | motivo | — |
| `status` | enum | [VERIFICAR] | (`open`, `closed`). Se integra con la agenda de actividades de M09 | — |
| `crmCaseId` | uniqueidentifier | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `crmCases` (M09) |

### 7.38 Residuales del 5-11-2026: referencias, nombres canónicos y valores de estado (PA-MOR-22)

Ronda de residuales detectados al regenerar los entregables (categorías 1, 2 y 4 de `_trabajo/residuales-instrucciones.md`). Las filas de §7.37 quedaron corregidas en su lugar con "antes" (las tablas de "referencias declaradas" que se tocaron ganan la columna Tipo); esta tabla las resume. Referencia: colección destino precedida de →; "no es referencia" indica un dato.

| Colección | Campo | Tipo | Referencia | Antes |
|---|---|---|---|---|
| `interestPolicies` | `base.taxIds`, `base.excludedTaxIds` | uniqueidentifier[] | → M06 `taxDefinitions` | sin destino |
| `interestPolicies` | `fiscal.defaultVatSituationId` | uniqueidentifier | → M06 `vatConditionSettings` | sin destino |
| `interestPolicies` | `publishedVersionId` | uniqueidentifier | → T04 `configVersions` | sin destino |
| `interestPolicies` | `adminFee.amount`, `adminFee.admissibilityRef`, `values.dailyRate` | DECIMAL(18,4) / string / DECIMAL(18,4) | No es referencia | sin destino |
| `interestRateTables` | `rates[].rateId` | uniqueidentifier | No es referencia (identificador del tramo) | sin destino |
| `dueDateSurchargeSchemes` | `scope.cycleIds` | uniqueidentifier[] | → M05 `billingCycles` | sin destino |
| `interestCalculations` | `policyVersion` | int | No es referencia (número de versión) | sin destino |
| `interestBillingRunItems` | `chargeRequestId` | uniqueidentifier | → M05 `billableItems` | sin destino |
| `documentHolds` | `reasonId` (usar `holdReasonId`) | uniqueidentifier | → M08 `holdReasons` | `[VERIFICAR]` |
| `delinquencyNotices` | `delinquencyBatchId` | uniqueidentifier | → M08 `delinquencyBatches` | `batchId` |
| `delinquencyNotices` | `noticeModelVersion` | int | No es referencia (número de versión) | sin destino |
| `delinquencyNotices` | `costChargeRequestId` | uniqueidentifier | → M05 `billableItems` | sin destino |
| `delinquencyExceptions` | `reasonText` | string | No es referencia | sin destino |
| `financingInstitutionPlans` | `collectionEntityId` | uniqueidentifier | → M07 `collectionAgencies` | tipo `array` |
| `agreements` | `targetAccountId` | uniqueidentifier | → M01 `accounts` | sin destino |
| `agreements` | `templateId` | uniqueidentifier | → T11 `documentTemplates` | sin destino |
| `agreements` | `planSnapshot` | object | No es referencia | sin destino |
| `agreements` | `signatureRequestId` | uniqueidentifier | → T11 `signatureRequests` | solo en T05 |
| `serviceProtections` | `personSensitiveDataId` | uniqueidentifier | → M01 `personSensitiveData` | solo en T05 |
| `suspensionRestrictionRules` | `code` | string | — (único por tenant) | solo en T05 |
| `debtCollectionAgencies` | `taxId` | string | No es referencia (CUIT) | tipo `uniqueidentifier` |

Campos que T05 cita con otro nombre (prevalece el anexo; T05 debe reflejarlo): `interestRateTables.policyId` no existe (la relación es `interestPolicies.lateInterest.rateTableId`) y `validFrom` es la vigencia por tramo `rates[].from`; `delinquencyPolicies.scope` = `scope.serviceId` y `scope.categoryIds`; `delinquencyExceptions.accountId`/`contractId` = `scope.accountId`/`scope.contractId`; `serviceProtections.contractId` = `scope.contractId`; `interruptionCases.noticeId` = `origin.noticeId`, `workOrderId` = `execution.workOrderId` y `provisioningCommandId` = `execution.remoteActionIds` (→ M10 `provisioningCommands`, que ejecuta T06; antes "[T06]"); `paymentPlans.financialInstitutionId` corresponde a `financingInstitutionPlans` (COL-MOR-27), no a `paymentPlans`. Valores de estado agregados: `interestIndexTables` (`active`, `inactive`), `debtCollectionAgencies` (`active`, `suspended`, `inactive`) y los de historial de `delinquencyNoticeEvents` (§8.15).

## 8. Estados y transiciones (AGR-003)

Toda transición registra actor, fecha, causa cuando corresponde y evento. Las transiciones no listadas están prohibidas (no existe edición libre de estado).

### 8.1 Políticas, tablas, esquemas, planes y reglas (catálogos versionados)

Estado inicial: `draft`.

| Origen | Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|---|
| `draft` | `published` | Configurador (+ aprobación si `normative` o cargos) | Validaciones de §7 sin errores; cobertura fiscal; sin superposición | Evento `mor.policy.published`; vigente desde `validFrom` | Nueva versión; la publicada pasa a `retired` al vencer |
| `published` | `retired` | Configurador / sistema al reemplazar | Existe versión sucesora o fin de vigencia | No afecta cálculos ya registrados | No |
| `draft` | eliminado lógico | Configurador | Nunca publicado | — | — |

### 8.2 Cálculo de interés (`interestCalculations`)

Estado inicial: `recorded` (registro inmutable).

Inmutable: `recorded` al confirmar la operación; `reverted` si la operación económica se anula (con referencia a la reversión). Nunca se edita.

### 8.3 Interés diferido

Estado inicial: `pending`.

| Origen | Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|---|
| — | `pending` | Sistema (cobro) | Modo de diferimiento ≠ `none` | Cargo pendiente en M05 | — |
| `pending` | `billed` | Sistema (M05 emite) | Factura emitida con el cargo | Evento `mor.deferredInterest.billed` | Anulación de la factura → `pending` |
| `pending` | `cancelled` | Supervisor / anulación del recibo | Recibo anulado o dispensa aprobada | Cargo pendiente anulado | No |

### 8.4 Corrida de intereses a facturar

Estado inicial: `draft`.

| Origen | Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|---|
| — | `draft` | Operador | Filtros válidos | — | — |
| `draft` | `previewing` → `previewed` | Sistema (job) | — | Ítems en `preview` | — |
| `previewed` | `approved` | Contador (si la política exige) | Totales revisados | — | Volver a `draft` |
| `previewed`/`approved` | `generating` → `completed` | Operador / sistema | Selección confirmada | Cargos por cuenta, marcas `interestSettledUntil`, evento `mor.interestRun.completed` | Anulación por cargo en M05 antes de facturar (revierte marcas) |
| `generating` | `failed` / `partiallyCompleted` | Sistema | Error | Reanudable desde checkpoint | Reintento idempotente |
| cualquiera no terminado | `cancelled` | Operador | Sin cargos generados | — | No |

### 8.5 Bloqueo de documento

Estado inicial: `active`.

`active` → `released` (usuario con capability; si la causa tiene interés de desbloqueo, genera cargo). Los bloqueos `system` solo los libera el proceso que los creó.

### 8.6 Notificación de mora

Estado inicial: `open`.

| Origen | Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|---|
| — | `open` | Gestor / job | Deuda > 0, sin exclusión | Ítems con saldo; nota en cuenta (salvo candidatos) | Anular lote |
| `open` | `open` (entregada) | Gestor / T09 evidencia | — | Extiende `dueDate`; `evidenceSatisfied` | Desmarcar entrega (no revierte fecha) |
| `open` | `processed` | Gestor / job | `dueDate` cumplida, sin promesa vigente, evidencia satisfecha si se exige, deuda > 0 | Nueva notificación en instancia destino | Anular lote destino → `open` |
| `open`/`inTechnical` | `paid` | Sistema (pago) | Todos los ítems saldados | Evento `mor.notice.paid` | Anulación del pago → `open` |
| `open` | `excluded` | Gestor | Causa de tipo `noticeExclusion` | — | Supervisor reabre con motivo |
| `open` | `inTechnical` | Sistema (tratamiento) | Caso de interrupción creado y política "En técnica" | — | Cancelación del caso → `open` |
| `open`/`inTechnical` | `closed` | Gestor | Motivo | Nota "Notificación cerrada", bloqueo de caja opcional | Supervisor |
| cualquiera de un lote sin efectos irreversibles | `annulled` | Supervisor | Lote anulable | Reabre anteriores | No |
| `open` | `open` (promesa activa) → promesa `kept`/`broken` | Gestor / socio / job | Fecha de promesa | Bloquea avance hasta la fecha | — |
| `open` | `open` (convenio) → `paid` | Sistema | Convenio vigente que incluye todos los ítems | Ítems marcados "incluidos en convenio" | Anulación/caída del convenio sin anticipo → `open` |

### 8.7 Caso de interrupción

Estado inicial: `requested`.

| Origen | Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|---|
| — | `requested` | Gestor / socio / CRM / sistema | Servicio en estado compatible | — | `cancelled` |
| `requested` | `evaluated` | Sistema | — | Decisión `allowed`/`review`/`blocked` con motivos | — |
| `evaluated` (`blocked`) | `blocked` | Sistema | Restricción o protección `block` | Comunicación interna; no orden | Se reevalúa si cambia la condición |
| `evaluated` (`review`) | `pendingApproval` | Sistema | Requiere aprobación | Workflow T11 | Rechazo → `rejected` |
| `pendingApproval` | `approved` / `rejected` | Supervisor (`aprobarSensible` para protecciones) | — | — | No |
| `evaluated` (`allowed`) / `approved` | `pendingEvidence` | Sistema | Preaviso con constancia no satisfecho | Espera evidencia o plazo | — |
| `evaluated`/`approved`/`pendingEvidence` | `scheduled` | Sistema | Evidencia y cargos previos ("antes") cumplidos | Orden a M10 o acción a T06 programada en ventana | `cancelled` |
| `scheduled` | `inExecution` | M10 / T06 | Ventana válida | — | — |
| `inExecution` | `executed` | M10 (confirmación) / T06 (respuesta OK) | Confirmación real | Estado del servicio actualizado en M01/M02; cargos "después"; prorrateo; comunicación al socio; evento `mor.interruption.executed` | Caso inverso (reconexión/reactivación) |
| `inExecution` | `executionFailed` | M10 / T06 | Error o sin sistema | Orden vuelve a pendiente; tarea al técnico | Reintento → `scheduled` |
| `requested`…`scheduled` | `cancelled` | Sistema (pago confirmado, V2 #2917) / gestor / socio | Deuda regularizada, desistimiento | Cancela orden en M10; quita marca de moroso si corresponde | No |
| `executed` | `reverted` | Solo mediante caso `reconnection`/`reactivation` vinculado | — | — | — |

### 8.8 Convenio

Estado inicial: `draft`.

| Origen | Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|---|
| — | `draft` | Gestor / socio | Simulación válida | — | Descartar |
| `draft` | `pendingApproval` | Sistema | Condiciones fuera de plan | Workflow T11 | Rechazo → `rejected` |
| `draft`/`approved` | `pendingSignature` | Gestor | Firmantes definidos | Envío a firma | `draft` |
| `pendingSignature` | `pendingDownPayment` | Sistema | Todas las firmas requeridas | Registro transaccional (RN-MOR-114): obligaciones sustituidas, notificaciones cerradas, cuotas y cargo de anticipo | — |
| `pendingSignature` | `active` | Sistema | Plan sin anticipo | Igual sin anticipo | — |
| `pendingDownPayment` | `active` | Sistema (pago confirmado) | Anticipo pagado | Evento `mor.agreement.activated`; reconexión si la política lo prevé | — |
| `pendingDownPayment` | `lapsedNoDownPayment` | Job | Plazo vencido | Obligaciones de origen restituidas | No (nuevo convenio) |
| `active` | `inArrears` | Job | Cuota vencida impaga | Mora de cuota; posible notificación de mora sobre cuotas | Pago → `active` |
| `inArrears` | `defaultWarning` | Job | Alcanza umbral −1 o umbral con aviso previo | Aviso al titular y garante | Regularización → `active` |
| `defaultWarning`/`inArrears` | `defaulted` | Job / aprobador | Umbral alcanzado y plazo de aviso vencido | Aceleración, saldo exigible, pérdida de quitas condicionadas | `rehabilitated` → `active` con aprobación dentro del plazo |
| `active`/`inArrears`/`defaulted` | `refinanced` | Gestor | Nuevo convenio que incluye sus cuotas | Cuotas `refinanced` | Anulación del nuevo → estado previo |
| `active` | `completed` | Sistema | Todas las cuotas pagas | Evento `mor.agreement.completed` | Reversión de pago → `active` |
| `active` | `cancelledEarly` → `completed` | Socio / gestor | Pago de cancelación anticipada | Bonificación de interés | — |
| `draft`…`active` | `annulled` | Aprobador | RN-MOR-121 | Restituye obligaciones; anula cuotas y cargos | No |

### 8.9 Garantía

Estado inicial: `requested`.

`requested` → `active` (documentación válida) → `executed` (incumplimiento con causa) → `applied` (aplicada a deuda) / `refunded` (devuelta) / `released` (liberada sin uso) / `expired` (vencida).

### 8.10 Expediente de gestión externa o judicial

Estado inicial: `open`.

`open` → `inNegotiation` → `lawsuitFiled` → `judgment` → `enforcement`; desde cualquiera no cerrado → `closedPaid` / `closedAgreement` / `closedWriteOff` / `closedPrescribed` / `withdrawn` (con causa). Reapertura solo por supervisor de recupero con motivo.

### 8.11 Incobrable

Estado inicial: `proposed`.

`proposed` → `approved` (doble control; evento `mor.writeOff.approved`) / `rejected`; `approved` → `partiallyRecovered` → `reverted` (recupero total).

Transiciones explícitas (`writeOffs.status`; el texto anterior dejaba `rejected` sin origen claro):

| Desde | Hacia | Disparador | Guarda | Evento |
|---|---|---|---|---|
| (nuevo) | `proposed` | Propuesta de incobrable | — | — |
| `proposed` | `approved` | Aprobación del segundo usuario | Doble control: aprobador distinto del proponente | `mor.writeOff.approved` |
| `proposed` | `rejected` | Rechazo del aprobador | Motivo obligatorio | — |
| `approved` | `partiallyRecovered` | Imputación de un cobro posterior | Recupero menor al saldo dado de baja | — |
| `approved` · `partiallyRecovered` | `reverted` | Recupero total | Recupero igual al saldo dado de baja | — |

### 8.12 Prescripción

Estado inicial: `draft`.

`draft` → `proposed` → `approved` → `executed` (documentos de signo contrario emitidos e imputados; evento `mor.prescription.executed`) / `rejected`.

Transiciones explícitas (`prescriptionRuns.status`; el texto anterior dejaba `rejected` sin origen claro):

| Desde | Hacia | Disparador | Guarda | Evento |
|---|---|---|---|---|
| (nuevo) | `draft` | Alta de la corrida con fecha de corte y reglas | — | — |
| `draft` | `proposed` | Cálculo de ítems elegibles | Al menos un ítem elegible | — |
| `proposed` | `approved` | Aprobación | Aprobador con capability de aprobación (`approval`) | — |
| `proposed` | `rejected` | Rechazo del aprobador | Motivo obligatorio | — |
| `approved` | `executed` | Emisión e imputación de documentos de signo contrario | Documentos emitidos en M05 e imputados en M07 | `mor.prescription.executed` |

### 8.13 Otras colecciones con estado (lotes, evaluaciones, obligaciones de convenio, seguimientos)

Los valores ya estaban en §7; se explicitan las transiciones.

Estado inicial: ver las filas `(nuevo)`.

| Colección | Desde | Hacia | Disparador | Guarda | Evento |
|---|---|---|---|---|---|
| `delinquencyBatches` | (nuevo) | `running` | Generación o proceso de un lote de instancia | — | — |
| `delinquencyBatches` | `running` | `completed` | Fin del proceso sin error | — | `mor.batch.generated` (EVT-MOR-07) |
| `delinquencyBatches` | `running` | `failed` | Error del job | — | — |
| `delinquencyBatches` | `completed` | `annulled` | Anulación del lote | Notificaciones del lote no procesadas | `mor.batch.annulled` (EVT-MOR-07) |
| `delinquencyEvaluations` | (nuevo) | `open` | Evaluación de la cuenta a una fecha | — | — |
| `delinquencyEvaluations` | `open` | `closed` | Decisión por servicio registrada | Todas las decisiones de `perService[]` cargadas | `mor.evaluation.closed` (EVT-MOR-06) |
| `agreementObligations` | (nuevo) | `included` | Alta del convenio con la obligación | — | — |
| `agreementObligations` | `included` | `restored` | Anulación o caducidad del convenio | — | — |
| `collectionFollowUps` | (nuevo) | `open` | Alta del seguimiento de gestión | — | — |
| `collectionFollowUps` | `open` | `closed` | Resultado registrado por el gestor | — | — |

### 8.14 Cuotas de convenio (`agreementInstallments.status`)

Los valores ya estaban en §7.28; se explicitan las transiciones (pendiente 8 del cierre, asumido en PA-COB-19 de M07, DEC-072).

Estado inicial: `scheduled`.

| Desde | Hacia | Disparador | Guarda | Evento |
|---|---|---|---|---|
| (nuevo) | `scheduled` | Registro transaccional del convenio (RN-MOR-114) | Convenio con todas las firmas requeridas | `mor.agreement.created` (EVT-MOR-14) |
| `scheduled` | `billed` | Facturación de la cuota: cargo pendiente en M05 (`mode` = `monthlyInvoice`) o documento propio (`ownDocument`) | Convenio en `pendingDownPayment` (solo la cuota 0) o `active` | — |
| `billed` | `due` | Llega `dueDate` | — | `mor.installment.due` (EVT-MOR-15) |
| `billed` · `due` | `partiallyPaid` | Imputación de M07 | Importe pagado menor que `total` | `cob.payment.confirmed` (EVT-COB-04) |
| `billed` · `due` · `partiallyPaid` · `overdue` | `paid` | Imputación de M07 que cancela la cuota | Importe pagado igual a `total` | `cob.obligation.settled` (EVT-COB-02) |
| `due` · `partiallyPaid` | `overdue` | Job de vencimientos | Vencida con saldo | `mor.installment.overdue` (EVT-MOR-15) |
| `scheduled` · `billed` · `due` · `partiallyPaid` · `overdue` | `accelerated` | Caducidad del convenio (`defaulted`, §8.8) | Saldo del plan exigible | `mor.agreement.defaulted` (EVT-MOR-14) |
| `accelerated` | `scheduled` | Rehabilitación del convenio | Aprobación dentro del plazo (§8.8) | `mor.agreement.rehabilitated` (EVT-MOR-14) |
| `scheduled` · `billed` | `cancelledEarly` | Cancelación anticipada del convenio | Pago de cancelación confirmado | `mor.agreement.completed` (EVT-MOR-14) |
| `scheduled` · `billed` · `due` · `partiallyPaid` · `overdue` · `accelerated` | `refinanced` | Nuevo convenio que incluye la cuota | — | `mor.agreement.refinanced` (EVT-MOR-14) |
| `scheduled` · `billed` · `due` · `overdue` | `annulled` | Anulación del convenio (RN-MOR-121) | Cuota sin pagos imputados | `mor.agreement.annulled` (EVT-MOR-14) |
| `paid` | `partiallyPaid` · `due` · `overdue` | Reverso de imputación en M07 (anulación, contracargo, rechazo) | — | `cob.allocation.reversed` (EVT-COB-06) |

### 8.15 Máquinas completadas y altas explícitas (residuales del 5-11-2026, PA-MOR-22)

Completa las colecciones que los entregables marcaron sin valores (`interestIndexTables`, `debtCollectionAgencies`, `delinquencyNoticeEvents`), con estados sin transiciones (`interestBillingRunItems`), con patrón general sin tabla (`holdReasons`, `delinquencyStages`, `delinquencyReasons`, `financingInstitutionPlans`, `delinquencyNoticeModels`), las máquinas que decían el estado inicial solo en texto (§8.1, §8.5, §8.9, §8.10) y la garantía, cuyo §8.9 no daba origen a `released`, `refunded` y `expired` (INC-06-03). Las filas `(nuevo)` fijan el estado inicial. Valores asumidos en PA-MOR-22 (DEC-072); coinciden con §7.37.

`delinquencyNoticeEvents` es el historial inmutable de `delinquencyNotices`: cada documento se escribe con su estado final y no cambia; `fromStatus` y `toStatus` toman los valores de `delinquencyNotices.status` (§8.6) y no forman una máquina propia.

| Colección | Desde | Hacia | Disparador | Guarda | Evento |
|---|---|---|---|---|---|
| `interestPolicies` | (nuevo) | `draft` | Configurador crea una versión (vale para las colecciones de la máquina común de §8.1) | — | — |
| `interestIndexTables` | (nuevo) | `active` | Alta de la tabla de índice propio por el configurador | `code` no repetido | — |
| `interestIndexTables` | `active` | `inactive` | Baja por el configurador | Ninguna política vigente la usa; no se borra (T05 §7.1.5) | — |
| `interestIndexTables` | `inactive` | `active` | Reactivación por el configurador | — | — |
| `interestBillingRunItems` | (nuevo) | `preview` | Corrida en `previewing` (§8.4) calcula el ítem | — | — |
| `interestBillingRunItems` | `preview` | `excluded` | Operador desmarca el ítem (`selected = false`) | Corrida en `previewed` | — |
| `interestBillingRunItems` | `excluded` | `preview` | Operador vuelve a marcar el ítem | Corrida en `previewed` | — |
| `interestBillingRunItems` | `preview` | `charged` | Corrida en `generating` crea el cargo en M05 (`chargeRequestId`) | Ítem seleccionado | `mor.interestRun.completed` al terminar la corrida |
| `interestBillingRunItems` | `preview` | `failed` | Error al crear el cargo | — | — (`error` registrado) |
| `interestBillingRunItems` | `failed` | `charged` | Reintento idempotente de la corrida | — | — |
| `documentHolds` | (nuevo) | `active` | Bloqueo manual, de notificación, de orden de cambio de estado, de expediente o de sistema (`origin`) | Causa `holdReasonId` activa | — |
| `guarantees` | (nuevo) | `requested` | Alta de la garantía exigida por el convenio, el contrato o la regla (`requirementRuleId`) | — | — |
| `guarantees` | `active` | `released` | Liberación sin uso al cumplirse la obligación garantizada | Sin incumplimiento | — |
| `guarantees` | `active` | `refunded` | Devolución del depósito en garantía (`liquidation.refundMode`) | Obligación garantizada cumplida; garantía de tipo `securityDeposit` | — |
| `guarantees` | `active` | `expired` | Job de vencimientos | `validTo` cumplido sin incumplimiento | — |
| `guarantees` | `executed` | `applied` | Aplicación del importe a la deuda | Incumplimiento con causa | — |
| `guarantees` | `applied` | `refunded` | Devolución del remanente | `liquidation.refundAmount` mayor que cero | — |
| `collectionCases` | (nuevo) | `open` | Asignación de documentos a un estudio o agencia (`debtCollectionAgencyId`) | — | — |
| `debtCollectionAgencies` | (nuevo) | `active` | Alta del estudio o agencia | Proveedor (`supplierId`) registrado en M12 | — |
| `debtCollectionAgencies` | `active` | `suspended` | Supervisor de recupero suspende nuevas asignaciones | Motivo registrado | — |
| `debtCollectionAgencies` | `suspended` | `active` | Supervisor de recupero rehabilita | — | — |
| `debtCollectionAgencies` | `active` · `suspended` | `inactive` | Baja | Sin expedientes abiertos asignados | — |
| `debtCollectionAgencies` | `inactive` | `active` | Reactivación | — | — |
| `holdReasons` | (nuevo) | `active` | Alta por el configurador | Validación del esquema (T04 §8.3) | — |
| `holdReasons` | `active` | `inactive` | Baja por el configurador | Si está referenciado se informa el conteo; no se borra (T05 §7.1.5) | — |
| `holdReasons` | `inactive` | `active` | Reactivación por el configurador | — | — |
| `delinquencyStages` | (nuevo) | `active` | Alta por el configurador | Validación del esquema (T04 §8.3) | — |
| `delinquencyStages` | `active` | `inactive` | Baja por el configurador | Si está referenciado se informa el conteo; no se borra (T05 §7.1.5) | — |
| `delinquencyStages` | `inactive` | `active` | Reactivación por el configurador | — | — |
| `delinquencyReasons` | (nuevo) | `active` | Alta por el configurador | Validación del esquema (T04 §8.3) | — |
| `delinquencyReasons` | `active` | `inactive` | Baja por el configurador | Si está referenciado se informa el conteo; no se borra (T05 §7.1.5) | — |
| `delinquencyReasons` | `inactive` | `active` | Reactivación por el configurador | — | — |
| `financingInstitutionPlans` | (nuevo) | `active` | Alta por el configurador | Validación del esquema (T04 §8.3) | — |
| `financingInstitutionPlans` | `active` | `inactive` | Baja por el configurador | Si está referenciado se informa el conteo; no se borra (T05 §7.1.5) | — |
| `financingInstitutionPlans` | `inactive` | `active` | Reactivación por el configurador | — | — |
| `delinquencyNoticeModels` | (nuevo) | `draft` | Configurador crea una versión del modelo | — | — |
| `delinquencyNoticeModels` | `draft` | `published` | Configurador publica | Plantilla validada; publicada queda inmutable (T05 §7.1.5) | — |
| `delinquencyNoticeModels` | `published` | `retired` | Sistema al publicar la versión sucesora | Existe versión sucesora | — |

## 9. Procesos y flujos

### 9.1 Cálculo de importes por vencimiento al emitir (O4)

1. M05, al armar cada factura, llama a `mor.interestEngine.dueDateSchedule(document, scheme)` con TOTAL1, VTO1..VTON (N = tope efectivo del comprobante, PRM-FAC-163; DEC-106; antes VTO1..VTO4), tipo de documento, servicio, ciclo y situación fiscal.
2. El motor resuelve el esquema vigente (servicio + ciclo + tipo), aplica la variante (RN-MOR-028 a RN-MOR-033) y calcula el IVA del recargo con el concepto del esquema.
3. Devuelve `[{ dueDate, total, surchargeNet, surchargeVat }]`; M05 lo imprime y lo expone al portal.
4. Error de configuración (sin esquema o sin concepto) → la factura queda observada en el lote de M05 (no se emite con recargo incorrecto).

### 9.2 Cotización y liquidación al cobrar (O5)

1. M07 (caja, importador de entes, webhook de pasarela, débito, portal) pide `quote(documents[], calculationDate, channel, entityId)`.
2. Para cada documento: habilitación (RN-MOR-002) → descuento (RN-MOR-003) o recargo entre vencimientos (RN-MOR-004) o mora (RN-MOR-005 a -016) desde `interestSettledUntil` → fiscalidad → mínimo → gastos → redondeo.
3. El motor aplica el modo de diferimiento (política o ente) y separa `collectNow` y `defer`.
4. Al confirmar el cobro (transacción de M07), M07 invoca `settle(quoteId, receiptRef)`: M08 registra `interestCalculations`, actualiza `interestSettledUntil`, crea `chargeRequests` a M05 (cobrado en el acto) y `deferredInterests` (diferido) en la **misma transacción** vía servicio de dominio; publica `mor.interest.settled`.
5. Reintento con el mismo `Idempotency-Key` devuelve el mismo resultado.
6. Si la cotización venció (cambio de día), M07 debe recotizar.

### 9.3 JOB-MOR-01 `mor:intereses-facturar` (O6)

1. Operador crea la corrida (`draft`) con filtros; el job `mor:intereses-facturar:preview` selecciona documentos (RN-MOR-041) en bloques de 500, calcula tramos (RN-MOR-042 a -044) y crea ítems `preview`.
2. El operador revisa el preliminar (PAN-MOR-08), destilda tramos o documentos; si la política lo exige, el contador aprueba.
3. `mor:intereses-facturar:generate` agrupa por cuenta + situación IVA + titular, crea un `chargeRequest` por cuenta a M05 (forma "próxima facturación") y actualiza `interestSettledUntil` por documento, en transacción por cuenta; checkpoint cada bloque.
4. Reanudación tras caída: continúa desde el checkpoint; ítems ya `charged` se omiten (idempotencia por `runId + documentId`).
5. Cancelación: solo antes de generar. Anulación posterior: se anulan los cargos pendientes en M05 y se restituyen las marcas.

### 9.4 JOB-MOR-02 `mor:evaluar-mora` (diario, O6)

1. Por tenant y servicio con política publicada, a la hora configurada (zona del tenant), toma cuentas con documentos vencidos según `candidate.daysAfterDueDate`.
2. Construye `delinquencyEvaluations`: saldo elegible (excluye convenios no vencidos, reclamos, pagos informados, deuda en gestión judicial, incobrable, prescripta), mínimo de pago, instancia alcanzada y decisión por servicio (matriz, protecciones).
3. Acciones según política: proponer candidatos (si `autoGenerate`), proponer avance de instancias con `autoAdvance`, proponer casos de interrupción (siempre en estado `requested`, nunca ejecutados).
4. Resultado en tablero; sin efectos sobre servicios.

### 9.5 Generar candidatos (manual o JOB-MOR-03 `mor:generar-candidatos`)

1. Filtros (RF-MOR-077) → universo de cuentas con deuda (RN-MOR-057).
2. Exclusiones con motivo (RN-MOR-058, -059, RF-MOR-081) guardadas en el lote.
3. Crear lote y notificaciones en la instancia de candidatos (RN-MOR-060).
4. Evento `mor.batch.generated`.

### 9.6 Procesar instancia (manual o JOB-MOR-04 `mor:procesar-instancia`)

1. Selección de notificaciones abiertas con filtros (RF-MOR-083), vencidas, sin promesa vigente, con evidencia satisfecha si la instancia origen la exige.
2. Validación de composición (RN-MOR-070) y listado de cuentas sin destinatario para el canal elegido (RN-MOR-073), con opción de descartar o cambiar canal.
3. Confirmación: lote nuevo; por cada notificación, transacción con RN-MOR-062 (costo si habilitado, nueva notificación, ítems, nota, anterior `processed`/`paid`, bloqueo y comprobante de deuda opcionales).
4. Envío: por cada notificación se crea el mensaje en T09 con el modelo y variables (`mor.notice.dispatchRequested`); impresión agrupada por titular para canal impreso (RN-MOR-072).
5. Seguimiento de entrega: T09 publica `com.communication.delivered` / `.failed` / `.bounced` (EVT-COM-27), `com.communication.milestoneReached` (EVT-COM-28) y `com.communication.allChannelsFailed` (EVT-COM-29); M08 actualiza `delivery` y `evidenceSatisfied` (la evidencia solo se da por satisfecha con el hito de EVT-COM-28); un fallo en instancia con evidencia obligatoria crea tarea "canal alternativo" (M09) y deja la notificación sin evidencia.
6. Reintentos de envío: los gestiona T09; M08 solo cambia de canal por decisión del gestor o por regla de la política (`fallbackChannels`).

### 9.7 Tratamiento de morosos e interrupción

1. El gestor abre PAN-MOR-19 con notificaciones de la instancia de corte (o tratamiento) vencidas.
2. Selecciona servicios y acción (RF-MOR-100). Validación de orden pendiente (RN-MOR-077).
3. Se crea `interruptionCase` (`requested`) → evaluación (RN-MOR-081, -082) → `blocked` / `pendingApproval` / `pendingEvidence` / `scheduled`.
4. `scheduled`: si requiere técnica → `tec.workOrder.request` (M10; antes `tec.workOrders.create`: nombre del comando que emite M09 y consume M10, sin chocar con la capability `tec.ordenes.crear` de T02) con origen `delinquency`; si es remoto (Internet) → M10 crea orden con acción de red y T06 ejecuta en la ventana; si no requiere técnica → cambio directo con confirmación del operador.
5. Confirmación (`tec.workOrder.closed` EVT-TEC-07, `tec.disconnection.executed` / `tec.reconnection.executed` EVT-TEC-18/19, o `int.network.provisioningResult` (antes `int.network.provisioning-result`) EVT-INT-15 con resultado exitoso) → `executed`: M01/M02 cambia `serviceStatus`, se registran cargos "después", prorrateo, comunicación al socio (T09, plantilla "Servicio suspendido" con medios de pago y cómo reactivar), notificación `inTechnical` → se mantiene abierta hasta pago.
6. Falla (`tec.visit.failed` EVT-TEC-14, `tec.workOrder.cancelled` EVT-TEC-08, o `int.network.provisioningResult` (antes `int.network.provisioning-result`) EVT-INT-15 con resultado fallido) → `executionFailed`; tarea al coordinador; reintento.
7. Pago confirmado antes de ejecución → JOB-MOR-07 cancela la orden (RN-MOR-091).

### 9.8 JOB-MOR-07 `mor:evaluar-reconexion` (por evento `cob.payment.confirmed`, `mor.agreement.activated`)

1. Para la cuenta pagadora, busca casos `executed` de tipo `delinquency*` sin reconexión, y casos `scheduled`/`pendingEvidence` de mora.
2. Aplica el criterio de deuda de la política (RN-MOR-092) con el saldo de M07 tras la imputación.
3. Casos no ejecutados: cancelar y avisar a M10; quitar marca de moroso (RN-MOR-091).
4. Casos ejecutados: crear caso `reconnection` (padre = caso de corte) → evaluación de reconexión (titular fallecido, factibilidad, inspección de gas, cargo "antes") → ejecución directa, orden técnica o acción remota; confirmación automática solo con respuesta exitosa de T06 (RN-MOR-094).
5. Ejecutada la reconexión: estado activo, prorrateo (RN-MOR-096), cargo "después" si habilitado, comunicación al socio.
6. Idempotencia: clave `paymentId + caseId`.

### 9.9 Suspensión voluntaria, baja y reactivación (BASE §53)

1. El socio (PWA/landing) o CRM inicia la solicitud; para baja, M09/M19 registra y emite el código identificador; M08 aplica RN-MOR-100 (sin cargo) y crea el caso de ejecución si hay que desactivar el servicio.
2. Suspensión voluntaria: muestra condiciones habilitadas (duración mínima/máxima, pausa de cargos, costo habilitado o ARS 0), conserva aceptación, crea caso `voluntarySuspension` → orden/acción → `executed` en la fecha efectiva.
3. Reactivación: verifica estado, reglas, cargo habilitado o gratuidad y necesidad de intervención; la app muestra "Reactivación en trámite" hasta `executed`.
4. Fin automático de suspensión voluntaria por duración: el vencimiento lo detecta M02 (JOB-CAT-08, dueño del contrato; T11 §12.9); M08 consume `cat.contract.reactivated` (EVT-CAT-12) y cierra el caso `voluntarySuspension`, creando el caso `reactivation` solo si el servicio requiere intervención técnica o remota (JOB-MOR-08 queda como manejador del evento, sin programación propia).

### 9.10 Convenio de punta a punta

1. Selección de obligaciones (RF-MOR-145) → simulación (PAN-MOR-30) con plan, anticipo, cuotas, quitas → cronograma, CFT.
2. Validaciones de límites (RN-MOR-118) → si fuera de plan, aprobación (T11).
3. Firmantes y firma (RF-MOR-154): presencial en tableta o electrónica por enlace con OTP; el PDF se genera desde plantilla con/ sin garante y se guarda con hash.
4. Con todas las firmas: registro transaccional (RN-MOR-114) → `pendingDownPayment` o `active`.
5. Anticipo: cargo inmediato (M05) y cobro (M07); confirmación → `active`; plazo vencido → JOB-MOR-09 `mor:vencer-anticipos` → `lapsedNoDownPayment` con restitución.
6. Cuotas: modo factura mensual → cargos pendientes por período (M05 los toma al facturar, con ajuste por índice y bonificación por adelanto); modo documento propio → JOB-MOR-10 `mor:emitir-cuotas` solicita a M05 la emisión de cada cuota con anticipación configurable.
7. Seguimiento: JOB-MOR-11 `mor:control-convenios` (diario) marca `inArrears`, emite aviso previo de caducidad y declara `defaulted` según la regla del plan (RN-MOR-123).
8. Cancelación anticipada: cotización de saldo con bonificación → pago → cuotas `cancelledEarly` → `completed`.
9. Anulación (RN-MOR-121) o refinanciación (RN-MOR-116).

### 9.11 Otros jobs

| Job | Frecuencia | Descripción |
|---|---|---|
| JOB-MOR-05 `mor:vencer-promesas` | Diario | Marca promesas vencidas como `kept` (si se pagó lo prometido) o `broken`; libera la notificación para procesar. |
| JOB-MOR-06 `mor:alertas-protecciones` | Diario | Alertas de protecciones y excepciones por vencer o vencidas; las vencidas dejan de bloquear. |
| JOB-MOR-12 `mor:recalcular-cuotas-fiscal` | A demanda / mensual | Detecta cuotas con situación fiscal distinta (RN-MOR-122) y propone el recálculo. |
| JOB-MOR-13 `mor:deuda-a-prescribir` | Mensual | Prepara la corrida de prescripción en `draft` y alertas de próximas a prescribir. |
| JOB-MOR-14 `mor:exportacion-regulatoria` | Según regulador | Genera el archivo de condición de mora (ERSeP). |
| JOB-MOR-15 `mor:ajuste-indices` | Mensual | Verifica disponibilidad de índices para cuotas con ajuste del mes; alerta faltantes. |
| JOB-MOR-16 `mor:actualizar-depositos` | Mensual | Propone actualización de depósitos en garantía indexados. |
| JOB-MOR-17 `mor:segmentar-deuda` | Diario | Recalcula segmentos de los expedientes de seguimiento (BASE §14). |

Todos los jobs: idempotentes, reanudables, con progreso, aislados por tenant, con `jobRunId` y reintentos exponenciales (máx. 5) en BullMQ; errores de negocio no se reintentan, se registran por ítem.

## 10. Pantallas

Patrón CNX: AdminShell, `AdminStickyHeader`, `ScreenHelp` (qué/quién/cuándo/dónde/por qué/cómo + caso de uso), `DataTable` con columnas configurables, filtros, vistas guardadas, exportación XLSX/CSV/PDF y selección masiva; modales `sm/md/lg/xl`; `ConfirmDialog`; toasts; importes en IBM Plex Mono. Menú `siteMapGroups`: cluster **Cobranza y mora** → grupos **Intereses**, **Gestión de mora**, **Interrupciones**, **Financiación**, **Recupero**, **Configuración de mora**, **Informes de mora**. Todos los textos por `dict:mor.*`.

| PAN-ID | App | Ruta | Capability | Propósito | Layout / contenido | Acciones y modales | Estado vacío / ayuda | Equivalencia ProCoop (INV/REL/DFA) |
|---|---|---|---|---|---|---|---|---|
| PAN-MOR-01 | admin | `/admin/mor/tablero` | `mor.deuda.ver` | Tablero de mora | Tarjetas: deuda vencida por tramo, cuentas por instancia, promesas, casos por estado, convenios vigentes/caídos, recupero; filtros servicio, sucursal, zona, fecha de corte | Ir a cada bandeja; exportar | "Sin deuda vencida a la fecha"; ScreenHelp con fórmulas de §15 | Nuevo (BASE §14) |
| PAN-MOR-02 | admin | `/admin/mor/politicas-interes` | `mor.politicasInteres.ver`, `mor.politicasInteres.configurar` (antes `mor.politicasInteres.ver/configurar`) | Políticas de interés | DataTable: código, alcance (servicio, categorías, tipos), método, vigencia, estado; editor `xl` por secciones (método, base, exenciones, mínimo, gastos, redondeo, fiscal, diferimiento, documentación, dispensa) con vista previa de cálculo | Nueva versión, publicar (ConfirmDialog con diff), retirar, duplicar | Ayuda con ejemplo numérico por método | Parámetros VAR de COBRANZA (Configuración) |
| PAN-MOR-03 | admin | `/admin/mor/tasas` | `mor.tasas.ver`, `mor.tasas.editar` (antes `mor.tasas.*`) | Tablas de tasas por vigencia | DataTable de tablas; detalle con tramos (desde, hasta, % diario, categorías, fuente); línea de tiempo de vigencias con superposiciones resaltadas | Agregar tramo (modal `md`), asignar categorías, importar Excel, publicar | "Cargue al menos un tramo" | "Administración de Tasas de Mora" — `MORATAS`, `MORATAS_CATSER` (DFA M11; pantalla no descompilada) |
| PAN-MOR-04 | admin | `/admin/mor/indices` | `mor.indices.ver`, `mor.indices.importar` (antes `mor.indices.*`) | Tablas de índices | DataTable de tablas (código, nombre, propósito, tipos); detalle con serie (fecha, valor) y gráfico | ExcelImportWizard (fecha, valor), alta manual, validar huecos | Alerta de meses sin índice | "Tablas de Índices para Recargo por Mora" — `TABMORA`, `INDICESMORA` |
| PAN-MOR-05 | admin | `/admin/mor/recargo-vencimientos` | `mor.tramasRecargo.configurar` | Esquemas de recargo entre vencimientos | DataTable; editor con tipo de variante, valor, tramas (rango de importe, valor, por día/fijo, vencimiento), modo simple/cascada, concepto; simulador TOTAL1→TOTAL2..4 | Publicar, duplicar | Ayuda de cada variante | "Tramas de vencimientos" (REL; BASE §97.3) — `TRAMASREC`, V2 #74/#578 |
| PAN-MOR-06 | admin | `/admin/mor/pronto-pago` | `mor.descuentosProntoPago.configurar` | Descuentos por pronto pago | DataTable por tipo de documento: días desde/hasta, %, solo socios | Alta/edición `md`; validación de superposición | — | `DESCUENTO_CAJA` (pantalla no descompilada) |
| PAN-MOR-07 | admin | `/admin/mor/calculadora` | `mor.cotizacion.ver` | Cotizar recargo | Buscador de cuenta/documentos; fecha de cálculo; resultado por documento con componentes y tramos | Exportar detalle PDF; "explicar cálculo" | Estado vacío "Seleccione documentos" | Consulta de deuda de caja (M07) |
| PAN-MOR-08 | admin | `/admin/mor/intereses-facturar` | `mor.interesesFacturar.ver`, `mor.interesesFacturar.simular`, `mor.interesesFacturar.ejecutar`, `mor.interesesFacturar.aprobar`, `mor.interesesFacturar.cancelar` (antes `mor.interesesFacturar.*`) | Corridas de intereses a facturar | Lista de corridas; asistente: 1 filtros (RF-MOR-049), 2 preliminar (DataTable por cuenta/documento/tramo con checkbox), 3 aprobación, 4 generación con progreso | Simular, aprobar, generar, cancelar, descargar preliminar ("Facturación — Interés a facturar") | "Sin documentos para los filtros" | `clsFacturarIntereses` (Facturación) |
| PAN-MOR-09 | admin | `/admin/mor/bloqueos` | `mor.bloqueos.ver` (nueva), `mor.bloqueos.crear`, `mor.bloqueos.aplicarMasivo` (antes `mor.bloqueos.masivos`), `mor.bloqueos.liberar` (antes `mor.bloqueos.*`) | Bloqueos de documentos | DataTable de documentos con bloqueo activo e historial; filtros causa, origen, cuenta | Bloquear/desbloquear (individual y masivo), desbloquear con interés (modal con cálculo) | — | `Asignar_Bloqueo`, `CAUBLOQ`, `HISBLOQ` |
| PAN-MOR-10 | admin | `/admin/mor/politicas-mora` | `mor.politicasMora.ver`, `mor.politicasMora.configurar` (antes `mor.politicasMora.*`) | Políticas de mora por servicio y categoría | Editor `xl` en pestañas: alcance y modo de cuenta, saldo elegible, candidatos, pago mínimo, instancias (lista ordenable con días, canales, modelo, evidencia), acción final, afectación cruzada (bloqueada si no hay validación), reactivación, excepciones, promesas | Publicar con diff, simular sobre cuenta de prueba | Aviso "La afectación cruzada requiere validación normativa" | Nuevo (BASE §68; DFA M11 mejoras) |
| PAN-MOR-11 | admin | `/admin/mor/instancias` | `mor.instancias.configurar` | Instancias de mora | DataTable: código, nombre, orden, días, tipo, marcas (candidatos, inicial, sensible, corte) | Alta/edición `sm` | — | `abm_Instanci` (INV), "Instancias de Mora" (REL captura 27) |
| PAN-MOR-12 | admin | `/admin/mor/modelos-aviso` | `mor.modelosAviso.configurar` | Modelos de aviso | DataTable; editor con texto y variables, versión SMS/WhatsApp, plantilla T09, firmas, detalle por servicio, deuda mínima, texto legal; preview celular y carta | Versionar, previsualizar con cuenta de prueba | — | `CIRCULAR` |
| PAN-MOR-13 | admin | `/admin/mor/candidatos` | `mor.candidatos.generar` | Generar candidatos | Formulario de filtros (RF-MOR-077); resultado previo con incluidas y excluidas (motivo) | Generar lote (ConfirmDialog con totales), exportar excluidas | "Ninguna cuenta cumple los filtros" | "Circulares" (`clsCirculares`), "Generar Notificaciones" (REL) |
| PAN-MOR-14 | admin | `/admin/mor/notificaciones` | `mor.notificaciones.ver` | Gestión de notificaciones | Selector de instancia origen; filtros (RF-MOR-083); dos grillas origen/destino con agregar, agregar todas, quitar, quitar todas; columnas: lote, cuenta, titular, fecha, vencimiento, deuda, deuda actualizada, entrega, promesa, calificación, avisos; ordenamientos (cuenta, titular, deuda, lote, fecha, calle, zona/sector/recorrido, empresa postal) | Notificar (PAN-MOR-15), marcar entrega (PAN-MOR-16), promesa (modal `sm`), dar de baja (modal `sm` con causa), cerrar, anular lote, reprocesar lote, ver antecedentes (PAN-MOR-17), ver deuda notificada/actualizada (PAN-MOR-18), aviso telefónico (genera la exportación `ivr_export` de T09 para el discador o la entrega por FI-INT-66 si está activa, y registra el resultado de la llamada; DEC-104; antes "registro de llamada"), exportar circulares, imprimir notificación y por titular, informes "Servicios a cortar" y "Totales por servicio", limpiar selección | "No hay notificaciones abiertas en la instancia" | `frmGestionMora` (todos sus métodos), `frmGestionMora_Grupo` (selección de lote) |
| PAN-MOR-15 | admin (modal `lg`) | — | `mor.notificaciones.procesar` | Notificar/avanzar instancia | Instancia destino, canal, modelo, vencimiento, incluir deuda vencida, generar comprobante de deuda, costo de envío (si habilitado), bloqueo; validación de teléfonos/correos con lista de faltantes | Confirmar; descargar PDF | — | `frmGestionMora_Notificar` (`Confirmar`, `GenerarNotificacion_Documento`, `GenerarNotificacion_MailSMS`, `ValidarTelefonos`, `chGenerarCompVen`) |
| PAN-MOR-16 | admin (modal `md`) | — | `mor.notificaciones.marcarEntrega` | Marcar entrega y constancias | Operación (entregar/desmarcar), fecha, tipo de evidencia, adjunto | Confirmar | — | `frmGestionMora_MarcarEntrega` |
| PAN-MOR-17 | admin (modal `lg`) | — | `mor.notificaciones.calificar` | Antecedentes y calificación | Historial de notificaciones calificadas, servicios, accesos a cuenta corriente, deuda y resumen de pagos | Calificar | — | `frmGestionMora_Antecedentes` |
| PAN-MOR-18 | admin (modal `lg`) | — | `mor.deuda.ver` | Deuda notificada / actualizada | Documentos notificados vs nuevos, saldo notificado vs actual, avisos | Imprimir | — | `frmGestionMora_VisualizarDeuda` |
| PAN-MOR-19 | admin | `/admin/mor/tratamiento` | `mor.tratamiento.ver`, `mor.tratamiento.ejecutar` (antes `mor.tratamiento.*`) | Tratamiento de morosos | Filtros (instancia, servicio, pagos parciales, cantidad de pagados, deuda actualizada); grilla notificaciones con servicios conectados; columna "evaluación" (permitida/revisión/bloqueada con motivo) | Suspender/desconectar, cambiar estado (uno o varios servicios), cambiar categoría, incidente técnico, baja de servicios, no facturar, generar comprobantes (modal), cerrar notificaciones, notificar titulares; modal de orden (PAN-MOR-20) | "Sin notificaciones vencidas en la instancia de corte" | `frmTratamientoMorosos` (todos sus métodos), `frmTratamientoMorosos_Comprobantes` |
| PAN-MOR-20 | admin (modal `lg`) | — | `mor.tratamiento.ejecutar` | Orden de interrupción | Datos del servicio, vía de ingreso, observación técnica (obligatoria salvo política), ventana prevista, restricciones aplicadas | Confirmar (crea caso) | — | `frmTratamientoMorosos_OT` (`Get_ViaIngreso`, `Guadar`, `Validar`) |
| PAN-MOR-21 | admin | `/admin/mor/notificaciones/consulta` | `mor.notificaciones.ver` | Consulta de notificaciones por cuenta | Buscador de cuenta; historial completo en cualquier estado con bitácora | Ver deuda notificada, reimprimir | — | `frmConsultaNotificaciones` |
| PAN-MOR-22 | admin | `/admin/mor/operaciones-especiales` | `mor.operacionesEspeciales.ejecutar` | Operaciones especiales | Consulta por instancia, lote y estado; resultados con efectos asociados | Resolver, eliminar (con motivo; solo sin efectos); **no** existe "restablecer" | Ayuda: cuándo usar (anular convenios con cuotas notificadas) | `frmGestionMora_OperEspeciales` (`Restablecer_Notificaciones` descartado) |
| PAN-MOR-23 | admin | `/admin/mor/excepciones` | `mor.excepciones.ver`, `mor.excepciones.editar` (nueva), `mor.excepciones.aprobar` (antes `mor.excepciones.*`) | Excepciones de mora | DataTable: cuenta, motivo, no reclamar, no cobrar interés, vigencia, deuda anterior a, estado de autorización, usuarios | Alta `md`, autorizar, desautorizar, nota en cuenta, imprimir (y al confirmar alta si V2 #2328) | — | `abm_Exc_Mora` (todos sus métodos) |
| PAN-MOR-24 | admin | `/admin/mor/protecciones` | `mor.protecciones.ver` (nueva), `mor.protecciones.editar` (nueva), `mor.protecciones.aprobar` (antes `mor.protecciones.*`) | Protecciones normativas | DataTable: tipo, persona/suministro, efecto, vigencia, verificación, norma | Alta con evidencia, verificar, renovar | Alertas por vencer | Nuevo (DFA M11 excepciones normativas) |
| PAN-MOR-25 | admin / plataforma | `/admin/mor/restricciones` | `mor.restricciones.ver`, `mor.restricciones.configurar` (nueva), `mor.restricciones.configurarNormativas` (antes `mor.restricciones.*`) | Matriz de restricciones | DataTable por jurisdicción y servicio; filas `normative` en solo lectura para el tenant | Alta/edición (según origen), marcar validada | — | Nuevo |
| PAN-MOR-26 | admin | `/admin/mor/causas` | `mor.causas.configurar` | Causas | DataTable por tipo | Alta/edición `sm` | — | "Causas de Baja" — `CAUSAS` (REL, DFA M11) |
| PAN-MOR-27 | admin | `/admin/mor/interrupciones` | `mor.interrupciones.ver` | Casos de interrupción | DataTable: número, tipo, servicio, cuenta, estado, decisión, ventana, orden, confirmación; filtros | Ver ficha (`xl`: línea de tiempo, evaluación, aprobaciones, orden, acciones remotas, cargos, comunicaciones), aprobar/rechazar, reprogramar, cancelar, reintentar ejecución | — | OT de desconexión/reconexión con `GEST_MORA` (M10) |
| PAN-MOR-28 | admin | `/admin/mor/cargos-interrupcion` | `mor.cargosInterrupcion.configurar` | Reglas de cargos de suspensión/reconexión | DataTable; editor con filtros (RN-MOR-095), concepto, antes/después, una vez, admisibilidad | Solicitar habilitación productiva (workflow) | Aviso "Deshabilitada para producción hasta validar" | `CONEXION` (`TIPO_CON` 4/5/6) |
| PAN-MOR-29 | admin | `/admin/mor/planes-pago` | `mor.planesPago.configurar` | Planes de pago | DataTable: código, finalidad, método, cuotas, tasa, vigencia; editor `xl` (RF-MOR-171) con simulador lateral | Publicar, duplicar | — | "Planes de Cuotas" — `PLAN_CUO`, `TIP_FIN` (DFA M12) |
| PAN-MOR-30 | admin | `/admin/mor/convenios/nuevo` | `mor.simulador.usar`, `mor.convenios.crear` | Simulador y alta de convenio | Asistente: 1 cuenta y obligaciones (con marca de excluidas y motivo), 2 plan y condiciones (anticipo, cuotas o importe objetivo, primer vencimiento, quitas, modalidad, cuenta destino), 3 resultado (cronograma, totales, TNA/TEM/TEA/CFT, avisos de límites), 4 firmantes y garantías, 5 firma, 6 confirmación | Guardar simulación, enviar a aprobación, enviar a firma, imprimir | — | "Emitir Plan de Financiación" (DFA M12), financiación en caja (`Cargar_FinanciacionDeuda`) |
| PAN-MOR-31 | admin | `/admin/mor/convenios` | `mor.convenios.ver` | Convenios | DataTable: número, cuenta, fecha, plan, deuda, cuotas pagas/vencidas, estado; ficha `xl` con pestañas: resumen, obligaciones incluidas, cuotas, pagos, firmantes y firmas, garantías, documentos, eventos | Imprimir convenio y talonario/liquidación, cancelar anticipadamente, refinanciar, declarar caducidad, rehabilitar, anular, cambiar garante, recalcular cuotas fiscales | — | "Informes de Financiaciones" (DFA M12), `clsFinanciacion` |
| PAN-MOR-32 | admin | `/admin/mor/entidades-financieras` | `mor.entidadesFinancieras.configurar` | Entidades financieras | DataTable; editor con planes (cuotas, coeficiente, CFT, comisión, acreditación) | — | — | "Entidades financieras" — `ENTFIN` (DFA M12) |
| PAN-MOR-33 | admin | `/admin/mor/garantias` | `mor.garantias.ver`, `mor.garantias.editar` (antes `mor.garantias.*`) | Garantías y garantes | DataTable; ficha con documentos y liquidación; reglas de exigencia | Alta, ejecutar, aplicar, devolver, liberar | — | Nuevo (MER-005) |
| PAN-MOR-34 | admin | `/admin/mor/gestion-externa` | `mor.gestionExterna.ver`, `mor.gestionExterna.editar`, `mor.gestionExterna.registrarAvance` (antes `mor.gestionExterna.*`) | Gestión externa y judicial | DataTable de expedientes; ficha con documentos, eventos, costos, recuperos; ABM de estudios | Derivar deuda (desde cuenta o informe), registrar evento/costo, cerrar | — | Nuevo (MER-006) |
| PAN-MOR-35 | admin | `/admin/mor/incobrables` | `mor.incobrables.ver` (nueva), `mor.incobrables.proponer`, `mor.incobrables.aprobar` (antes `mor.incobrables.*`) | Incobrables | Propuestas con criterio y documentos; aprobados; recuperos | Proponer, aprobar/rechazar, revertir | — | Nuevo (MER-006) |
| PAN-MOR-36 | admin | `/admin/mor/prescripcion` | `mor.prescripcion.configurar`, `mor.prescripcion.proponer`, `mor.prescripcion.aprobar` (antes `mor.prescripcion.*`) | Prescripción | Reglas por tipo de obligación; corrida con fecha de corte, ítems elegibles e interrumpidos | Proponer, aprobar, ejecutar | — | Informe "Deuda a Prescribir" (`clsInformes_Mora`), `clsPrescripcionDeuda` |
| PAN-MOR-37 | admin | `/admin/mor/informes` | `mor.informes.ver` (nueva), `mor.informes.exportar` (nueva) (antes `mor.*.ver` + `exportar`) | Informes de mora y financiación | Catálogo con los informes de §15; filtros por informe (con fecha de corte); vista previa y exportación | Exportar XLSX/CSV/PDF, programar envío | — | Grupo "1- Gestión de Mora" (`clsInformes_Mora`), `clsInformes_Financiacion`, `ExportarDopler`, exportación ERSeP |
| PAN-MOR-38 | admin | `/admin/mor/seguimiento` | `mor.deuda.ver` | Expedientes de seguimiento de deuda | Bandeja por segmento y responsable; contactos, compromisos y próximos pasos | Registrar contacto, programar paso, derivar a convenio o a gestión externa | — | Nuevo (BASE §14) |
| PAN-MOR-39 | pwa-socio | **Componente embebido en PAN-POR-46** (M19 es dueño de la ruta y la composición; ruta original `/app/deuda`; HUE-SRV-04) | `mor.miDeuda.ver` | Mi deuda y avisos | Cards por documento vencido con importe a hoy y detalle del recargo; banner de instancia y riesgo de suspensión; lista de avisos recibidos con constancia; FAB "+" → simular plan / promesa | Pagar (M07/M19), ver detalle, descargar aviso | 3 skeleton cards; "No tenés deuda vencida" | CoopOnline/Autogestión (consulta de deuda) |
| PAN-MOR-40 | pwa-socio | **Componente embebido en PAN-POR-46** (M19 es dueño de la ruta `/app/convenios` y la composición; HUE-SRV-04) | `mor.simulador.usar`, `mor.convenios.ver`, `mor.convenios.aceptar`, `mor.convenios.cancelarAnticipado` (antes `mor.convenios.*`) | Simular, aceptar y firmar convenio | Simulador con planes habilitados para portal; cronograma y CFT; aceptación con OTP; pago del anticipo; lista de convenios con cuotas | Simular, aceptar, firmar, pagar anticipo, cancelar anticipadamente | — | Nuevo |
| PAN-MOR-41 | pwa-socio | **Componente embebido en PAN-POR-37** (M19 es dueño de la ruta `/app/servicios/:contractId/:accion` y la composición; ruta original `/app/servicios/:id/suspension`; HUE-SRV-04) | `mor.interrupciones.solicitar` | Suspensión voluntaria y reactivación | Opciones habilitadas del servicio, condiciones, costo (ARS 0 o habilitado), fecha efectiva, estado del caso | Solicitar, aceptar condiciones, cancelar solicitud | Estado "Reactivación en trámite" | Nuevo (BASE §53 CU-CIC-01) |
| PAN-MOR-42 | ext (estudios) | `/api/v1/ext/mor/...` + vista web mínima | `mor.gestionExterna.verAsignados` | Portal de estudios | Expedientes asignados, deuda actualizada, registro de avances | Registrar avance/costo | — | Nuevo |

**Pantallas del socio (HUE-SRV-04):** PAN-MOR-39, PAN-MOR-40 y PAN-MOR-41 no definen rutas propias: M08 aporta el componente (contenido, acciones y estados descritos arriba) y su API (API-MOR-86 a API-MOR-95, sin cambios); M19 decide la ruta, la navegación y la composición en `pwa-socio` (PAN-POR-46 para deuda y convenios; PAN-POR-37 para suspensión voluntaria y reactivación).

## 11. API

Convenciones: paginación `?page=&size=` → `{ items, total, page, size }`; errores RFC 9457 con `requestId`; validación Zod compartida; `Idempotency-Key` obligatorio en las marcadas "Sí". Las rutas internas de servicio a servicio (M05, M07, M10) se exponen como servicios de dominio dentro del monolito; las rutas REST siguientes son para las apps y terceros.

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-MOR-01 | GET | `/api/admin/mor/interest-policies` | `mor.politicasInteres.ver` | Listar políticas de interés | — |
| API-MOR-02 | POST | `/api/admin/mor/interest-policies` | `mor.politicasInteres.configurar` | Crear borrador / nueva versión | Sí |
| API-MOR-03 | PATCH | `/api/admin/mor/interest-policies/:id` | `mor.politicasInteres.configurar` | Editar borrador | — |
| API-MOR-04 | POST | `/api/admin/mor/interest-policies/:id/publish` | `mor.politicasInteres.configurar` | Publicar (valida cobertura fiscal y prioridades) | Sí |
| API-MOR-05 | GET/POST | `/api/admin/mor/rate-tables` | `mor.tasas.ver` / `crear` | Listar / crear tablas de tasas | Sí (POST) |
| API-MOR-06 | PUT | `/api/admin/mor/rate-tables/:id/rates` | `mor.tasas.editar` | Reemplazar tramos (valida superposición) | Sí |
| API-MOR-07 | POST | `/api/admin/mor/rate-tables/:id/publish` | `mor.tasas.editar` | Publicar | Sí |
| API-MOR-08 | GET/POST | `/api/admin/mor/index-tables` | `mor.indices.ver` / `crear` | Listar / crear tablas de índices | Sí (POST) |
| API-MOR-09 | POST | `/api/admin/mor/index-tables/:id/values/import` | `mor.indices.importar` | Importar valores (preview y confirmación) | Sí |
| API-MOR-10 | GET/POST/PATCH | `/api/admin/mor/due-date-schemes[/:id]` | `mor.tramasRecargo.configurar` | ABM de esquemas de recargo entre vencimientos | Sí (POST) |
| API-MOR-11 | POST | `/api/admin/mor/due-date-schemes/:id/simulate` | `mor.tramasRecargo.configurar` | Simular TOTAL2..4 para un importe | — |
| API-MOR-12 | GET/POST/PATCH | `/api/admin/mor/early-payment-discounts[/:id]` | `mor.descuentosProntoPago.configurar` | ABM de descuentos por pronto pago | Sí (POST) |
| API-MOR-13 | POST | `/api/admin/mor/quotes` | `mor.cotizacion.ver` | Cotizar recargo de documentos a una fecha | — |
| API-MOR-14 | GET | `/api/admin/mor/calculations/:id` | `mor.cotizacion.ver` | Ver cálculo registrado con tramos | — |
| API-MOR-15 | POST | `/api/admin/mor/quotes/:id/waiver` | `mor.dispensaRecargo.solicitar` | Solicitar dispensa del recargo | Sí |
| API-MOR-16 | POST | `/api/admin/mor/waivers/:id/approve` | `mor.dispensaRecargo.aprobar` | Aprobar/rechazar dispensa | Sí |
| API-MOR-17 | GET/POST | `/api/admin/mor/interest-runs` | `mor.interesesFacturar.ver` / `simular` | Listar / crear corrida (draft + preview) | Sí (POST) |
| API-MOR-18 | GET | `/api/admin/mor/interest-runs/:id/items` | `mor.interesesFacturar.ver` | Preliminar paginado | — |
| API-MOR-19 | PATCH | `/api/admin/mor/interest-runs/:id/items/selection` | `mor.interesesFacturar.simular` | Tildar/destildar documentos o tramos | — |
| API-MOR-20 | POST | `/api/admin/mor/interest-runs/:id/approve` | `mor.interesesFacturar.aprobar` | Aprobar corrida | Sí |
| API-MOR-21 | POST | `/api/admin/mor/interest-runs/:id/generate` | `mor.interesesFacturar.ejecutar` | Generar cargos (job) | Sí |
| API-MOR-22 | POST | `/api/admin/mor/interest-runs/:id/cancel` | `mor.interesesFacturar.cancelar` | Cancelar corrida | Sí |
| API-MOR-23 | GET/POST | `/api/admin/mor/holds` | `mor.bloqueos.crear` | Listar / aplicar bloqueos (individual o masivo) | Sí (POST) |
| API-MOR-24 | POST | `/api/admin/mor/holds/:id/release` | `mor.bloqueos.liberar` | Liberar bloqueo (opcional con interés) | Sí |
| API-MOR-25 | GET/POST/PATCH | `/api/admin/mor/hold-reasons[/:id]` | `mor.causas.configurar` | ABM de causas de bloqueo | Sí (POST) |
| API-MOR-26 | GET/POST/PATCH | `/api/admin/mor/delinquency-policies[/:id]` | `mor.politicasMora.ver` (GET), `mor.politicasMora.configurar` (POST, PATCH) (antes `mor.politicasMora.*`) | ABM de políticas de mora | Sí (POST) |
| API-MOR-27 | POST | `/api/admin/mor/delinquency-policies/:id/publish` | `mor.politicasMora.configurar` | Publicar política | Sí |
| API-MOR-28 | POST | `/api/admin/mor/evaluations` | `mor.evaluaciones.ejecutar` | Evaluar una cuenta o universo a una fecha | Sí |
| API-MOR-29 | GET | `/api/admin/mor/evaluations[/:id]` | `mor.evaluaciones.ver` | Consultar evaluaciones | — |
| API-MOR-30 | GET/POST/PATCH | `/api/admin/mor/stages[/:id]` | `mor.instancias.configurar` | ABM de instancias | Sí (POST) |
| API-MOR-31 | GET/POST/PATCH | `/api/admin/mor/notice-models[/:id]` | `mor.modelosAviso.configurar` | ABM de modelos de aviso (versionados) | Sí (POST) |
| API-MOR-32 | POST | `/api/admin/mor/candidates/preview` | `mor.candidatos.generar` | Previsualizar candidatos con exclusiones | — |
| API-MOR-33 | POST | `/api/admin/mor/batches` | `mor.candidatos.generar` / `mor.notificaciones.procesar` | Crear lote (generar candidatos o procesar instancia) | Sí |
| API-MOR-34 | POST | `/api/admin/mor/batches/:id/annul` | `mor.lotes.anular` | Anular lote | Sí |
| API-MOR-35 | GET | `/api/admin/mor/notices` | `mor.notificaciones.ver` | Buscar notificaciones (filtros de RF-MOR-083) | — |
| API-MOR-36 | GET | `/api/admin/mor/notices/:id` | `mor.notificaciones.ver` | Ficha con ítems, deuda actualizada, bitácora | — |
| API-MOR-37 | POST | `/api/admin/mor/notices/delivery` | `mor.notificaciones.marcarEntrega` | Marcar/desmarcar entrega con evidencia (lote de ids) | Sí |
| API-MOR-38 | POST | `/api/admin/mor/notices/:id/promise` | `mor.notificaciones.promesa` | Registrar promesa de pago | Sí |
| API-MOR-39 | POST | `/api/admin/mor/notices/:id/rating` | `mor.notificaciones.calificar` | Calificar | — |
| API-MOR-40 | POST | `/api/admin/mor/notices/exclude` | `mor.notificaciones.darBaja` | Dar de baja con causa (lote) | Sí |
| API-MOR-41 | POST | `/api/admin/mor/notices/close` | `mor.notificaciones.cerrar` | Cerrar notificaciones (lote, bloqueo opcional) | Sí |
| API-MOR-42 | POST | `/api/admin/mor/notices/print` | `mor.notificaciones.imprimir` | Generar PDF agrupado por titular u individual | — |
| API-MOR-43 | POST | `/api/admin/mor/notices/export` | `mor.notificaciones.exportar` | Exportar circulares / archivo para envío masivo | — |
| API-MOR-44 | GET | `/api/admin/mor/notices/missing-recipients` | `mor.notificaciones.procesar` | Cuentas sin correo o celular para un canal | — |
| API-MOR-45 | POST | `/api/admin/mor/special-operations/notices/:id/resolve` · `/delete` | `mor.operacionesEspeciales.ejecutar` | Resolver o eliminar (lógico) notificación sin efectos | Sí |
| API-MOR-46 | GET/POST/PATCH | `/api/admin/mor/exceptions[/:id]` | `mor.excepciones.ver` (GET), `mor.excepciones.editar` (POST, PATCH; nueva) (antes `mor.excepciones.*`) | ABM de excepciones | Sí (POST) |
| API-MOR-47 | POST | `/api/admin/mor/exceptions/:id/authorize` · `/revoke` | `mor.excepciones.aprobar` | Autorizar / desautorizar | Sí |
| API-MOR-48 | GET/POST/PATCH | `/api/admin/mor/protections[/:id]` | `mor.protecciones.ver` (GET; nueva), `mor.protecciones.editar` (POST, PATCH; nueva) (antes `mor.protecciones.*`) | ABM de protecciones normativas | Sí (POST) |
| API-MOR-49 | POST | `/api/admin/mor/protections/:id/verify` | `mor.protecciones.aprobar` | Verificar protección | Sí |
| API-MOR-50 | GET/POST/PATCH | `/api/admin/mor/restriction-rules[/:id]` | `mor.restricciones.ver` (GET), `mor.restricciones.configurar` (POST, PATCH; nueva); filas `normative`: `mor.restricciones.configurarNormativas` (antes `mor.restricciones.*`) | ABM de matriz (las `normative` solo con capability normativa) | Sí (POST) |
| API-MOR-51 | GET/POST/PATCH | `/api/platform/mor/restriction-rules[/:id]` | `mor.plataforma.restricciones.configurar` (rol de plataforma; antes "plataforma") | Catálogo normativo base por jurisdicción | Sí (POST) |
| API-MOR-52 | GET/POST/PATCH | `/api/admin/mor/reasons[/:id]` | `mor.causas.configurar` | ABM de causas | Sí (POST) |
| API-MOR-53 | GET | `/api/admin/mor/treatment/services` | `mor.tratamiento.ver` | Servicios elegibles de notificaciones vencidas | — |
| API-MOR-54 | POST | `/api/admin/mor/interruption-cases` | `mor.tratamiento.ejecutar` | Crear caso(s) de interrupción (evalúa) | Sí |
| API-MOR-55 | GET | `/api/admin/mor/interruption-cases[/:id]` | `mor.interrupciones.ver` | Listar / ficha | — |
| API-MOR-56 | POST | `/api/admin/mor/interruption-cases/:id/approve` · `/reject` | `mor.interrupciones.aprobar` | Aprobar / rechazar | Sí |
| API-MOR-57 | POST | `/api/admin/mor/interruption-cases/:id/cancel` · `/reschedule` · `/retry` | `mor.interrupciones.aprobar` | Cancelar, reprogramar, reintentar | Sí |
| API-MOR-58 | POST | `/api/admin/mor/interruption-cases/:id/confirm-direct` | `mor.tratamiento.ejecutar` | Confirmar ejecución directa (servicios sin técnica) | Sí |
| API-MOR-59 | GET/POST/PATCH | `/api/admin/mor/interruption-charge-rules[/:id]` | `mor.cargosInterrupcion.configurar` | ABM de reglas de cargos | Sí (POST) |
| API-MOR-60 | GET/POST/PATCH | `/api/admin/mor/payment-plans[/:id]` | `mor.planesPago.configurar` | ABM de planes | Sí (POST) |
| API-MOR-61 | GET/POST/PATCH | `/api/admin/mor/financial-entities[/:id]` | `mor.entidadesFinancieras.configurar` | ABM de entidades financieras | Sí (POST) |
| API-MOR-62 | POST | `/api/admin/mor/simulations` | `mor.simulador.usar` | Simular convenio | — |
| API-MOR-63 | POST | `/api/admin/mor/agreements` | `mor.convenios.crear` | Crear convenio desde simulación | Sí |
| API-MOR-64 | GET | `/api/admin/mor/agreements[/:id]` | `mor.convenios.ver` | Listar / ficha | — |
| API-MOR-65 | POST | `/api/admin/mor/agreements/:id/submit-approval` · `/approve` · `/reject` | `mor.convenios.crear` / `aprobar` | Workflow de condiciones especiales | Sí |
| API-MOR-66 | POST | `/api/admin/mor/agreements/:id/send-for-signature` | `mor.convenios.enviarFirma` | Enviar enlace de firma (OTP) | Sí |
| API-MOR-67 | POST | `/api/admin/mor/agreements/:id/signatures` | `mor.convenios.registrarFirma` | Registrar firma presencial | Sí |
| API-MOR-68 | POST | `/api/admin/mor/agreements/:id/early-cancellation/quote` · `/confirm` | `mor.convenios.cancelarAnticipado` | Cotizar y confirmar cancelación anticipada | Sí (confirm) |
| API-MOR-69 | POST | `/api/admin/mor/agreements/:id/default` · `/rehabilitate` | `mor.convenios.declararCaducidad` / `rehabilitar` | Declarar caducidad / rehabilitar | Sí |
| API-MOR-70 | POST | `/api/admin/mor/agreements/:id/annul` | `mor.convenios.anular` | Anular (valida RN-MOR-121) | Sí |
| API-MOR-71 | POST | `/api/admin/mor/agreements/:id/guarantor` | `mor.convenios.editar` | Cambiar garante | Sí |
| API-MOR-72 | POST | `/api/admin/mor/agreements/fiscal-recalculation` | `mor.convenios.editar` | Detectar y recalcular cuotas por cambio fiscal | Sí |
| API-MOR-73 | GET | `/api/admin/mor/agreements/:id/documents/:kind` | `mor.convenios.imprimir` | PDF convenio, talonario o liquidación | — |
| API-MOR-74 | GET/POST/PATCH | `/api/admin/mor/guarantees[/:id]` | `mor.garantias.ver` (GET), `mor.garantias.editar` (POST, PATCH) (antes `mor.garantias.*`) | ABM y acciones de garantías | Sí (POST) |
| API-MOR-75 | POST | `/api/admin/mor/guarantees/:id/execute` · `/apply` · `/refund` · `/release` | `mor.garantias.editar` | Acciones sobre garantía | Sí |
| API-MOR-76 | GET/POST/PATCH | `/api/admin/mor/collection-agencies[/:id]` | `mor.estudios.configurar` | ABM de estudios | Sí (POST) |
| API-MOR-77 | GET/POST/PATCH | `/api/admin/mor/collection-cases[/:id]` | `mor.gestionExterna.ver` (GET), `mor.gestionExterna.editar` (POST, PATCH) (antes `mor.gestionExterna.*`) | Expedientes externos/judiciales | Sí (POST) |
| API-MOR-78 | POST | `/api/admin/mor/collection-cases/:id/events` · `/costs` · `/close` | `mor.gestionExterna.editar` / `mor.gastosJudiciales.registrar` / `cerrar` | Movimientos del expediente | Sí |
| API-MOR-79 | GET/POST | `/api/admin/mor/write-offs` | `mor.incobrables.proponer` | Proponer incobrables | Sí |
| API-MOR-80 | POST | `/api/admin/mor/write-offs/:id/approve` · `/reject` · `/revert` | `mor.incobrables.aprobar` / `revertir` | Aprobar / rechazar / revertir | Sí |
| API-MOR-81 | GET/POST/PATCH | `/api/admin/mor/prescription-rules[/:id]` | `mor.prescripcion.configurar` | Reglas de prescripción | Sí (POST) |
| API-MOR-82 | POST | `/api/admin/mor/prescription-runs` · `/:id/propose` · `/:id/approve` · `/:id/execute` | `mor.prescripcion.proponer` / `aprobar` | Corridas de prescripción | Sí |
| API-MOR-83 | GET | `/api/admin/mor/reports/:reportCode` | `mor.informes.ver` (nueva) (antes `mor.*.ver`) | Ejecutar informe con filtros y fecha de corte | — |
| API-MOR-84 | POST | `/api/admin/mor/reports/:reportCode/export` | `mor.informes.exportar` (nueva) (antes `mor.*.exportar`) | Exportar informe (asíncrono) | Sí |
| API-MOR-85 | GET/POST | `/api/admin/mor/follow-ups[/:id/contacts]` | `mor.deuda.ver` | Expedientes de seguimiento y contactos | Sí (POST) |
| API-MOR-86 | GET | `/api/mor/my-debt` | `mor.miDeuda.ver` | Deuda vencida del socio con cotización a hoy | — |
| API-MOR-87 | GET | `/api/mor/my-notices` | `mor.misAvisos.ver` | Avisos del socio con constancias | — |
| API-MOR-88 | POST | `/api/mor/simulations` | `mor.simulador.usar` | Simular con planes habilitados para portal | — |
| API-MOR-89 | POST | `/api/mor/agreements` · `/:id/accept` · `/:id/sign` | `mor.convenios.solicitar` (POST `/api/mor/agreements`), `mor.convenios.aceptar` (`/:id/accept`), `mor.convenios.firmar` (`/:id/sign`) | Solicitar, aceptar (OTP) y firmar convenio | Sí |
| API-MOR-90 | GET | `/api/mor/agreements[/:id]` | `mor.convenios.ver` (propios) | Convenios y cuotas del socio | — |
| API-MOR-91 | POST | `/api/mor/agreements/:id/early-cancellation` | `mor.convenios.cancelarAnticipado` (propios) | Cancelación anticipada desde app | Sí |
| API-MOR-92 | POST | `/api/mor/notices/:id/promise` | `mor.promesa.registrar` | Promesa de pago del socio | Sí |
| API-MOR-93 | GET | `/api/mor/services/:id/interruption-options` | `mor.interrupciones.solicitar` | Opciones de suspensión/reactivación habilitadas y costos | — |
| API-MOR-94 | POST | `/api/mor/services/:id/interruption-requests` | `mor.interrupciones.solicitar` | Solicitar suspensión voluntaria o reactivación | Sí |
| API-MOR-95 | GET | `/api/mor/interruption-requests/:id` | `mor.interrupciones.solicitar` (propios) | Estado del caso | — |
| API-MOR-96 | GET | `/api/v1/ext/mor/collection-cases` | `mor.ext.expedientes.ver` (scope del cliente API del estudio de cobranza; antes "token de estudio") | Expedientes asignados | — |
| API-MOR-97 | POST | `/api/v1/ext/mor/collection-cases/:id/events` | `mor.ext.expedientes.registrar` (scope del cliente API del estudio de cobranza; antes "token de estudio") | Registrar avance/costo | Sí |
| API-MOR-98 | GET | `/api/v1/ext/mor/delinquency-status` | `mor.ext.condicionMora.ver` (scope del cliente API de regulador o BI, T10; antes "token de regulador/BI (T10)") | Condición de mora por cuenta (exportación regulatoria) | — |

## 12. Eventos y jobs

### 12.1 Eventos emitidos (outbox, misma transacción)

| EVT-ID | Evento | Payload principal | Consumidores |
|---|---|---|---|
| EVT-MOR-01 | `mor.policy.published` | `policyType` (interés, mora, esquema, plan), `policyId`, `version` (antes: "tipo (interés/mora/esquema/plan), id, versión") | T04 (auditoría), M05/M07 (cachés) |
| EVT-MOR-02 | `mor.interest.settled` | `calculationId`, documentos, componentes, modo, `receiptRef` | M05 (emitir cargo), M15 |
| EVT-MOR-03 | `mor.deferredInterest.created` · `.billed` · `.cancelled` | id, cuenta, neto, `billableItemId` (antes `pendingChargeId`) | M05, M15 |
| EVT-MOR-04 | `mor.interestRun.completed` · `.failed` | `runId`, `totals` (antes: "runId, totales") | M05, M15, T10 |
| EVT-MOR-05 | `mor.hold.applied` · `.released` | `documentId`, `holdReasonId`, `origin` (antes: "documento, causa, origen") | M07, M19 |
| EVT-MOR-06 | `mor.evaluation.closed` | `accountId`, `decisionsByService[]` (antes: "cuenta, decisiones por servicio") | T10, M09 |
| EVT-MOR-07 | `mor.batch.generated` · `.annulled` | `delinquencyBatchId` (antes `batchId`; nombre canónico de T05 §7.2), `stageId`, `count`, `debtAmount` (antes: "lote, instancia, cantidad, deuda") | T10 |
| EVT-MOR-08 | `mor.notice.created` · `.processed` · `.paid` · `.excluded` · `.closed` | `noticeId`, `accountId`, `stageId` (antes: "noticeId, cuenta, instancia") | M07 (aviso de notificado), M19, M09 |
| EVT-MOR-09 | `mor.notice.dispatchRequested` | `noticeId`, canal, destinatarios, modelo, variables, `evidenceRequired` | T09 |
| EVT-MOR-10 | `mor.notice.evidenceMissing` | `noticeId`, `reason` (antes: "noticeId, motivo") | M09 (tarea canal alternativo) |
| EVT-MOR-11 | `mor.promise.registered` · `.broken` · `.kept` | `noticeId`, `promisedDate`, `amount` (antes: "noticeId, fecha, importe") | M09 |
| EVT-MOR-12 | `mor.interruption.requested` · `.blocked` · `.approved` · `.scheduled` | `caseId`, tipo, servicio, decisión, `serviceMode` (`restricted` / `interrupted`), `restrictionProfile` (`kind`, `lineupPackageId`, `minFlow`, `unit`; RN-MOR-137 a RN-MOR-139) | M10 (orden: ejecuta el modo y el perfil recibidos), M09, M19 |
| EVT-MOR-13 | `mor.interruption.executed` · `.executionFailed` · `.cancelled` | `caseId`, resultado, fecha real | M01/M02 (estado), M05 (prorrateo, no facturar), T09 (aviso), M19 |
| EVT-MOR-14 | `mor.agreement.created` · `.activated` · `.completed` · `.defaulted` · `.rehabilitated` · `.refinanced` · `.annulled` | `agreementId`, `amounts` (antes: "agreementId, importes") | M05 (cuotas, cargos), M07 (sustitución de obligaciones), M15, M17 (capital social) |
| EVT-MOR-15 | `mor.installment.due` · `.overdue` | `installmentId` | M05, T09 |
| EVT-MOR-16 | `mor.guarantee.executed` · `.applied` · `.refunded` | `guaranteeId`, importes; en `.refunded` suma `refundMode` (`accountCredit` o `treasury`; HUECO-OTR-04) | M07 (saldo a favor con `refundMode = accountCredit`, RF-COB-190), M14 (solo con `refundMode = treasury`), M15 |
| EVT-MOR-17 | `mor.collectionCase.opened` · `.closed` · `.costRegistered` | `caseId` (antes: "caseId") | M15, T10 |
| EVT-MOR-18 | `mor.writeOff.approved` · `.reverted` | `writeOffId`, documentos, importes | M15, M07 |
| EVT-MOR-19 | `mor.prescription.executed` | `runId`, documentos, importes | M05, M07, M15 |
| EVT-MOR-20 | `mor.protection.expiring` · `.expired` | `protectionId` | M09 (tarea) |
| EVT-MOR-21 | `mor.socialCoverage.suspended` · `.restored` | `contractId` [M02], `accountId`, `holderId`, `serviceId`, `legalEntityId`, `unpaidMonths`, `restrictionRuleId`; `suspendedFrom` en `.suspended`; `restoredAt` y `paymentRef` [M07] en `.restored` | M18 (RF-SOC-032: verificación de cobertura y carencia de rehabilitación), M19 (estado de cobertura del socio), T09 (aviso "cobertura suspendida" / "cobertura rehabilitada") |

### 12.2 Eventos consumidos

| Evento | Productor | Acción en M08 |
|---|---|---|
| `fac.invoice.issued` | M05 | Registra fechas de vencimiento y totales por vencimiento para el motor; marca deferredInterests/cuotas como facturados. |
| `fac.invoice.annulled` / `fac.creditNote.issued` | M05 | Recalcula notificaciones abiertas (composición); revierte marcas de interés si corresponde. |
| `cob.payment.confirmed` | M07 | Cierra notificaciones pagadas (RN-MOR-069), cumple promesas, evalúa cancelación de cortes y reconexión (JOB-MOR-07), activa convenios por anticipo, actualiza expedientes e incobrables. |
| `cob.receipt.voided` (EVT-COB-05) / `cob.allocation.reversed` (EVT-COB-06) / `cob.chargeback.applied` (EVT-COB-18) | M07 | Reabre notificaciones y cuotas; interés por reversión (RN-MOR-022). |
| `cob.payment.informed` | M07 | Protección temporal "pago a verificar" (RF-MOR-115). Evento EVT-COB-24, declarado por M07 (brecha de T11 §12.4 resuelta). |
| `crm.commandRequest.requested` (EVT-CRM-13, `targetModule = M08`; comandos de reclamo de facturación, baja, suspensión y reactivación) | M09/M19 | Protección temporal sobre documentos reclamados; crea caso de interrupción con política de costos. |
| `crm.case.statusChanged` / `crm.case.cancelled` (EVT-CRM-05/11) | M09 | Libera la protección temporal al resolverse, cerrarse o cancelarse el reclamo. |
| `tec.workOrder.closed` · `tec.workOrder.cancelled` (EVT-TEC-07/08), `tec.visit.failed` (EVT-TEC-14), `tec.disconnection.executed` · `tec.reconnection.executed` (EVT-TEC-18/19) | M10 | Transición del caso de interrupción. `tec.disconnection.executed` trae `mode` (`restricted`/`interrupted`): M08 lo compara con el `serviceMode` del caso; si difiere, registra la diferencia en el caso y aplica los cargos del modo realmente ejecutado. |
| `fis.thirdPartyAgreement.published` (EVT-FIS-24) | M06 | Actualiza las marcas del convenio de terceros (`includeInEligibleBalance`, `surcharge`, `allowServiceCut`, `cutNormativeRef.validationStatus`): saldo elegible y recargos (RN-MOR-142) y restricción `thirdPartyDebtNoCut` (RN-MOR-141). |
| `int.network.provisioningResult` (EVT-INT-15; antes `int.network.provisioning-result`) | T06 | Transición del caso (acción remota) según `result`. |
| `com.communication.accepted` · `.delivered` · `.read` · `.failed` · `.bounced` (EVT-COM-27), `com.communication.milestoneReached` (EVT-COM-28), `com.communication.allChannelsFailed` (EVT-COM-29) | T09 | Actualiza entrega y evidencia de notificaciones; el hito habilita el siguiente paso; el fallo total crea la tarea "canal alternativo". |
| `cat.contract.reactivated` (EVT-CAT-12) | M02 | Cierra el caso `voluntarySuspension` al vencer la suspensión voluntaria (JOB-MOR-08 convertido en manejador; T11 §12.9). |
| `per.person.deceased` | M01 | Señala reconexiones a titular fallecido (RN-MOR-097). |

**Consumos pendientes de registro en T11 (INC-06-06):** T11 §12.3 no lista a M08 como consumidor de los siguientes eventos, que M08 consume según la tabla anterior; T11 debe agregarlo: EVT-COM-29 `com.communication.allChannelsFailed` (T09; tarea "canal alternativo"), EVT-CRM-05 `crm.case.statusChanged` (M09; libera la protección temporal) y EVT-TEC-14 `tec.visit.failed` (M10; transición del caso de interrupción).

Nota (HUECO-OBR-01, HUECO-OBR-02): M08 **no consume** EVT-TEC-25 `tec.levy.approved`; lo consumen M02 (contratos tipo 17), M04 (`worksInstallmentPlans`) y T09 (aviso al frentista). Las cuotas de obra llegan a M08 como deuda facturada por M05 sobre el contrato tipo 17, y el convenio de M08 solo refinancia cuotas vencidas (RN-TEC-115, RN-MOR-146). Toda referencia anterior a que M08 "consume la contribución aprobada" queda reemplazada por esta nota.

Nota de alias (T11 §12.4, CTR-COM-11): los nombres usados antes en este anexo quedan como alias en `eventTypes.aliases` solo durante la transición de O6 y no se usan en suscripciones nuevas: `com.message.*` → `com.communication.*`; `cob.payment.reversed` → `cob.receipt.voided` / `cob.allocation.reversed`; `cob.chargeback.registered` → `cob.chargeback.applied`; `crm.billingClaim.opened` / `.resolved` y `crm.request.created` → `crm.commandRequest.requested` / `crm.case.statusChanged`; `tec.workOrder.completed` / `.failed` → `tec.workOrder.closed` / `tec.visit.failed`; `int.provisioning.succeeded` / `.failed` → `int.network.provisioningResult` (antes `int.network.provisioning-result`).

### 12.3 Jobs

| JOB-ID | Nombre | Frecuencia | Detalle |
|---|---|---|---|
| JOB-MOR-01 | `mor:intereses-facturar` (`:preview`, `:generate`) | A demanda | §9.3 |
| JOB-MOR-02 | `mor:evaluar-mora` | Diario (hora del tenant, default 03:00) | §9.4 |
| JOB-MOR-03 | `mor:generar-candidatos` | A demanda o programado por política | §9.5 |
| JOB-MOR-04 | `mor:procesar-instancia` | A demanda o programado (`autoAdvance`) | §9.6 |
| JOB-MOR-05 | `mor:vencer-promesas` | Diario | §9.11 |
| JOB-MOR-06 | `mor:alertas-protecciones` | Diario | §9.11 |
| JOB-MOR-07 | `mor:evaluar-reconexion` | Por evento | §9.8 |
| JOB-MOR-08 | `mor:fin-suspension-voluntaria` | Por evento `cat.contract.reactivated` (EVT-CAT-12) | Convertido en consumidor (T11 §12.9): el dueño del vencimiento es M02 (JOB-CAT-08); M08 no programa corrida propia. §9.9 |
| JOB-MOR-09 | `mor:vencer-anticipos` | Diario | §9.10 |
| JOB-MOR-10 | `mor:emitir-cuotas` | Diario | §9.10 |
| JOB-MOR-11 | `mor:control-convenios` | Diario | §9.10 |
| JOB-MOR-12 | `mor:recalcular-cuotas-fiscal` | Mensual / a demanda | §9.11 |
| JOB-MOR-13 | `mor:deuda-a-prescribir` | Mensual | §9.11 |
| JOB-MOR-14 | `mor:exportacion-regulatoria` | Según regulador | §9.11 |
| JOB-MOR-15 | `mor:ajuste-indices` | Mensual | §9.11 |
| JOB-MOR-16 | `mor:actualizar-depositos` | Mensual | §9.11 |
| JOB-MOR-17 | `mor:segmentar-deuda` | Diario | §9.11 |
| JOB-MOR-18 | `mor:ejecutar-ventana` | Cada 15 min | Libera casos `scheduled` cuya ventana de ejecución se abrió y los envía a M10/T06. |

## 13. Integraciones

Todas pasan por el marco de T06 (conector, bóveda de credenciales por tenant, reintentos, idempotencia, registro de intercambio) o por T09 (comunicaciones).

| Integración | Ficha T06/T09 | Uso en M08 | Particularidades |
|---|---|---|---|
| MikroTik / RADIUS / OLT-SmartOLT (Internet) | T06 aprovisionamiento | Suspensión (perfil de suspensión o portal cautivo), reactivación, reconexión, baja | Piloto O6. La acción solo se considera ejecutada con respuesta exitosa; la confirmación masiva de desconexión (RN-07 §4 `clsTecnica.cs:843-860`) se reemplaza por acciones individuales idempotentes agrupables. |
| Telemedición y prepago (Discar, AION, NEXO, CashPower, Hexing y demás de `Sistemas_Telemedicion`) | T06 telemedición | Corte/reconexión remotos, cambio de categoría, impacto de cambios de estado (V2 #3116) | O7. Las operaciones que requieren fecha nunca devuelven éxito si no impactaron (RN-MOR-098). |
| SITSA (API REST) | T06 | Contrato `suspendido` / `habilitado`, baja de contrato | O7. Credenciales (V2 #3034/#3035) en bóveda, nunca en query string; identificador por cuenta [VERIFICAR] un servicio por cuenta. |
| Canales de comunicación (correo, SMS, WhatsApp, push, impresión, carta documento/postal) | T09 | Envío de notificaciones de mora, avisos de suspensión, recordatorios de cuota y promesa, enlaces de firma | Evidencia por canal (AGR-024); consentimiento y horarios de envío; plantillas versionadas. |
| Doppler u otra herramienta de mail masivo | T09 (exportación) | Exportación alternativa (RF-MOR-203) | Solo si el tenant no usa T09 para el envío. |
| ERSeP (exportación de condición de mora) | T06 regulatorios / T10 | Archivo por cuenta con R/C o A | O7; el formato por regulador se parametriza. |
| Firma electrónica / digital | T06 (proveedor de firma) | Firma de convenios | Extensión: firma digital con certificado (PA-MOR-16). |
| Pasarelas y entes (Pagos360, Mercado Pago, SIRO, Red Link y demás) | T06 / M07 | Fecha efectiva de pago y sobrescrituras de ente (RN-MOR-018); deuda informada con importes por vencimiento | M08 no conversa con ellos: lo hace M07. |
| Estudios externos | `/api/v1/ext` (T10) | Expedientes asignados | Tokens por estudio con alcance a sus expedientes. |

## 14. Parámetros de configuración

Columna "Origen V2" con el número ProCoop. Ámbito: P = plataforma, T = tenant, S = servicio, C = categoría, D = tipo de documento, E = ente recaudador, PL = plan. En CoopApps la mayoría vive dentro de las colecciones de política (§7); la clave indica su ruta.

### 14.1 Recargo entre vencimientos e interés por mora

| PRM-ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 |
|---|---|---|---|---|---|---|
| PRM-MOR-001 | `dueDateSurchargeSchemes.type` | Enum | T/S/ciclo/D | `none` | Tipo de interés entre vencimientos (ninguno, porcentaje variable, porcentaje fijo en cascada, importe fijo, trama por importe, trama por vencimiento) | #74 |
| PRM-MOR-002 | `dueDateSurchargeSchemes.value` | Decimal | T/S/D | — (sin tasa productiva precargada, BASE §97.3) | Porcentaje o importe de recargo entre vencimientos; también tasa del tramo VTO1→VTO2 en la variante punitiva | #578 |
| PRM-MOR-003 | `dueDateSurchargeSchemes.changeOfTrameConceptId` | Ref | T/S | — | Concepto para recargo en cambio de trama (prepago) | #2283 |
| PRM-MOR-004 | `interestPolicies.betweenDueDates.iibbSeparate` | Bool | T/S | `false` | Discriminar IIBB en interés entre vencimientos | #2826 |
| PRM-MOR-010 | `interestPolicies.lateInterest.fixedDailyRate` | Decimal | T/S/C/D/E | — | Recargo diario fijo (% diario) | #600 |
| PRM-MOR-011 | `interestPolicies.lateInterest.indexTableId` | Ref | T/S/D | — | Tabla de índices de recargo | `TABMORA` |
| PRM-MOR-012 | `interestPolicies.lateInterest.rateTableId` | Ref | T/S/C/D | — | Tabla de tasas por vigencia | `MORATAS` |
| PRM-MOR-013 | `interestPolicies.lateInterest.compounding` | Enum | T | `simple` | Interés simple o compuesto (PA-MOR-01) | — |
| PRM-MOR-020 | `interestPolicies.exemptions.exemptConditions` | Lista | T/S | `[]` | Condiciones sin recargo (ej. jubilados) | #1002 |
| PRM-MOR-021 | `interestPolicies.exemptions.respectAccountNoSurcharge` | Bool | T | `false` | Permitir no cobrar recargo a una cuenta marcada | #3135 |
| PRM-MOR-022 | `interestPolicies.exemptions.interestOnCredits` | Bool | T | `false` | Calcular intereses en créditos | #625 |
| PRM-MOR-023 | `invoices.noInterest` (respetado) | Bool | Documento | `false` | Documento sin interés | `FACTURAS.NOINTERES` |
| PRM-MOR-024 | `interestPolicies.exemptions.exemptConditions[].scope=betweenDueDate2` | Enum | T | — | Cobrar/no cobrar recargo del VTO2 a jubilados | #299 |
| PRM-MOR-025 | `interestPolicies.betweenDueDates.proportionalToBalance` | Bool | T/S | `false` | Proporcionalidad del recargo entre vencimientos al saldo | #2363 |
| PRM-MOR-026 | `interestPolicies.lateInterest.fromLastDueDate` | Bool | T/S/E | `false` | Recargo desde último vencimiento | #621 |
| PRM-MOR-027 | `interestPolicies.base.excludedTaxIds` | Lista | T/S | `[]` | Impuestos excluidos de la base | #2300 |
| PRM-MOR-028 | `interestPolicies.base.mode=concepts` + `conceptIds` | Enum/Lista | T/S | `total1` | Base por conceptos configurados | #3167, `CONCEPTOS_INT` |
| PRM-MOR-029 | `interestPolicies.lateInterest.separateBetweenDueDates` | Bool | T/S | `false` | Discriminar interés entre vencimientos e interés por mora | #2356 |
| PRM-MOR-030 | `interestPolicies.earlyPaymentDiscountEnabled` | Bool | T/S | `false` | Habilitar descuento por pronto pago | `DESCUENTO_CAJA` |
| PRM-MOR-031 | `interestPolicies.minimum.amount` | Decimal | T/S | `0` | Interés mínimo a cobrar | #609 |
| PRM-MOR-032 | `interestPolicies.minimum.mode` | Enum | T | `exemptBelow` | Umbral de exención o piso (PA-MOR-02) | — |
| PRM-MOR-033 | `interestPolicies.adminFee` | Objeto | T/S | deshabilitado | Gastos administrativos (requiere admisibilidad) | #372 |
| PRM-MOR-034 | `interestPolicies.rounding` | Objeto | T | `halfUp`, 2 decimales | Redondeo del recargo (opción paso 0,1) | #608 |
| PRM-MOR-035 | `cob.cash.excludeAfterVto2Days` (M07, dato de M08) | Int | T | `0` (no excluye) | Días desde VTO2 para excluir comprobantes en caja/consulta | #2385 |
| PRM-MOR-036 | `interestPolicies.fixedCalculationDate` | Fecha | T (caja local) | — | Fecha fija de cálculo de intereses (con permiso) | #2487 |
| PRM-MOR-037 | `interestPolicies.waiver.requiresApproval` | Bool | T | `true` | Solicitar autorización para no cobrar recargo | #3162 |
| PRM-MOR-038 | `interestPolicies.reversal.dailyRate` | Decimal | T | — | % diario entre fecha de pago y de reversión | #3052 |
| PRM-MOR-039 | `paymentPlans.advanceInterestDocumentTypeId` | Ref | T | — | Comprobante para intereses adelantados en facturas [VERIFICAR] | #339 |
| PRM-MOR-040 | `interestPolicies.fiscal.lateInterestConceptId` | Ref | T/D | — (obligatorio para publicar) | Concepto para interés por mora (general o por tipo de documento `TIPO_FAC.COD_CON`) | #606 |
| PRM-MOR-041 | `interestPolicies.fiscal.financingModeLateConceptId` | Ref | T | — | Concepto para interés por mora en modo financiación | #307 |
| PRM-MOR-042 | `interestPolicies.fiscal.betweenDueDatesConceptId` | Ref | T/D | — | Concepto para interés entre vencimientos (`TIPO_FAC.COD_CON2`) | #2080 |
| PRM-MOR-043 | `interestPolicies.betweenDueDates.collectionMode` | Enum | T | [VERIFICAR] | Forma de cobro del interés entre vencimientos | #2078 |
| PRM-MOR-044 | `cob.cash.showBetweenDueDatesSeparate` (M07) | Bool | T | `false` | Mostrar interés entre vencimientos en columna separada | #2562 |
| PRM-MOR-045 | `cob.debtQuery.showFullInterest` (M07/M19) | Bool | T | `false` | Mostrar interés completo en consulta de deuda | #2566 |
| PRM-MOR-046 | `interestPolicies.servicePunitive` | Objeto | S (electricidad) | deshabilitado | Intereses punitorios sobre energía [VERIFICAR] | #3138 |
| PRM-MOR-047 | `interestPolicies.prepaid.retainInterest` | Bool | S | `false` | Calcular y retener intereses en venta de prepago | #713 |
| PRM-MOR-048 | `interestPolicies.values.dailyRate` | Decimal | T | — | Interés diario para valores recibidos en caja | #486 |
| PRM-MOR-049 | `interestPolicies.values.conceptId` | Ref | T | — | Concepto para interés por pago con valores a fecha | #487 |

### 14.2 Diferimiento, documentación y corrida masiva

| PRM-ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 |
|---|---|---|---|---|---|---|
| PRM-MOR-050 | `interestPolicies.deferral.mode` | Enum | T/S/E | `none` | Forma de diferir intereses (no diferir / diferir mora / diferir todo) | #1011 |
| PRM-MOR-051 | `interestPolicies.settlement.documentKind` | Enum | T | `debitNote` (PA-MOR-04) | Emitir factura o nota de débito por intereses | #273 |
| PRM-MOR-052 | `interestPolicies.settlement.groupByDocumentType` | Bool | T | `false` | Agrupar documentos de interés por tipo | #1056 |
| PRM-MOR-053 | `interestPolicies.settlement.forcedDocumentTypeId` | Ref | T | — | Tipo de cuota para comprobantes generados desde caja | #2249 |
| PRM-MOR-054 | `interestPolicies.deferral.relateToService` | Bool | T | `true` | Relacionar servicio a la cuota de intereses diferidos | #2828 |
| PRM-MOR-055 | `interestBillingRuns.variant` (default) | Enum | T | `standard` | Tipo de interés para facturas impagas (estándar, valores, punitivo, solo cargos) | #2292 |
| PRM-MOR-056 | `interestBillingRuns.chargesOnlyRate` / `chargesOnlyDocumentTypeIds` | Decimal/Lista | T | — | Reemplaza el 3 % fijo y los códigos 96/97 de CAU | RN-04 §5.4 |
| PRM-MOR-057 | `interestPolicies.settlement.originCode` | Ref | T | — | Vendedor/origen por defecto de comprobantes de interés y costos de notificación | #1008 |

### 14.3 Bloqueos y caja (datos de M08 usados por M07/M19)

| PRM-ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 |
|---|---|---|---|---|---|---|
| PRM-MOR-060 | `holdReasons.unlockInterest.rate` | Decimal | T/causa | — | % de interés al desbloquear | #2770 |
| PRM-MOR-061 | `holdReasons.unlockInterest.conceptId` | Ref | T/causa | — | Concepto de intereses por desbloqueo | #2771 |
| PRM-MOR-062 | `holdReasons.unlockInterest.voucherTypeId` | Ref | T/causa | — | Tipo de comprobante de intereses por desbloqueo | #2984 |
| PRM-MOR-070 | `cob.cash.notifiedFullPayment` | Bool | T | `false` | Bloquear comprobantes notificados para cobrar en grupo | #321 |
| PRM-MOR-071 | `cob.cash.oldestFirst` | Bool | T | `false` | Exigir cobrar facturas más antiguas | #324 |
| PRM-MOR-072 | `cob.cash.oldestFirstByLastDueDate` | Bool | T | `false` | Tomar último vencimiento para exigir comprobantes viejos | #462 |
| PRM-MOR-073 | `cob.cash.oldestFirstSameService` | Bool | T | `false` | Exigir más antiguas del mismo servicio | #375 |
| PRM-MOR-074 | `cob.cash.warnNotified` | Bool | T | `true` | Aviso en caja si el titular está notificado | #302 |
| PRM-MOR-075 | `cob.debtQuery.warnNotified` | Bool | T | `true` | Aviso en consulta de deuda si el titular está notificado | #2453 |
| PRM-MOR-076 | `cob.cash.warnDisconnectedService` | Bool | T | `true` | Advertencia al pagar un documento de servicio desconectado | #2411 |
| PRM-MOR-077 | `cob.cash.controlOverdueDebt` | Bool | T | `false` | Controlar deuda vencida del titular en caja | #187 |
| PRM-MOR-078 | `cob.cash.allowBlockedDocuments` / `allowBlockedStubs` | Bool | T | `false` | Permitir cobrar facturas / talones bloqueados en caja | #2586, #2596 |
| PRM-MOR-079 | `por.portal.hideBlockedDocuments` | Bool | T | `false` | Autogestión: no mostrar comprobantes bloqueados | #3102 |

### 14.4 Gestión de mora (grupo GESTION_DE_MORA completo)

| PRM-ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 |
|---|---|---|---|---|---|---|
| PRM-MOR-080 | `delinquencyPolicies.candidate.ignorePreviousNotices` | Bool | T/S | `false` | Ignorar notificaciones previas al incluir una cuenta | #39 |
| PRM-MOR-081 | `delinquencyPolicies.candidate.ignorePreviousCandidates` | Bool | T/S | `false` | Ignorar si ya está en lista de candidatos | #384 |
| PRM-MOR-082 | `delinquencyPolicies.candidate.checkOnlyInitialStage` | Bool | T/S | `false` | Solo verificar instancia inicial al chequear ya notificados | #2467 |
| PRM-MOR-083 | `delinquencyPolicies.candidate.excludeSameNoticeType` | Bool | T/S | `false` | Excluir si ya es candidato con el mismo tipo de notificación | #3050 |
| PRM-MOR-084 | `delinquencyStages.flags.isCandidates` | Ref | T | instancia "1 CANDIDATOS" | Instancia inicial por defecto de los candidatos | #2202 |
| PRM-MOR-085 | `delinquencyPolicies.stages[].costEnabled` + `noticeCost.conceptId` | Bool/Ref | T/S | deshabilitado (PA-MOR-12) | Concepto por cobranza de envío de notificación | #295 |
| PRM-MOR-086 | `delinquencyPolicies.noticeDueDaysFromDelivery` | Int | T/S/instancia | `10` (ilustrativo, a validar) | Días para el vencimiento de notificaciones entregadas | #2205 |
| PRM-MOR-087 | `delinquencyPolicies.stages[].autoDelivered` | Bool | T/instancia | `false` | Recepción automática según configuración | #2206 (RN-04 §7.3) |
| PRM-MOR-088 | `delinquencyPolicies.allDelivered` | Bool | T | `false` | Generar todas las notificaciones como entregadas (no válido en instancias con evidencia exigida) | #2279 |
| PRM-MOR-089 | `delinquencyNoticeModels.costAmount` / `noticeCost.amount` | Decimal | T/modelo | — | Costo de envío de notificación | #296 |
| PRM-MOR-090 | `delinquencyPolicies.stages[].debtDocument` | Bool | T/instancia | `false` | Generar comprobante de deuda por notificación por defecto | #2304 |
| PRM-MOR-091 | `delinquencyPolicies.stages[].evidenceRequired` / `evidenceTypes` | Bool/Lista | T/S/instancia | `true` en instancias de intimación y corte | Constancia exigida (AGR-024) | — |
| PRM-MOR-092 | `delinquencyPolicies.promise` | Objeto | T/S | permitido, 15 días máx. (ilustrativo) | Reglas de promesas de pago | — |
| PRM-MOR-093 | `delinquencyPolicies.validateNoticeComposition` | Bool | T | `true` | Avisar si cambió la composición de la deuda notificada | #53 |
| PRM-MOR-094 | `delinquencyPolicies.discardWithoutEmail` / `emailSource` | Bool/Enum | T | `false` / `accountOrPortal` | Descartar cuentas sin correo al generar por correo electrónico | #2327 |
| PRM-MOR-095 | `delinquencyStages.flags.isInitial` | Ref | T | "2 PRIMER INSTANCIA" | Instancia inicial por defecto de la gestión de mora | #2203 |
| PRM-MOR-096 | `delinquencyStages.flags.isCut` | Ref | T | — | Instancia final (de corte) por defecto | #2204 |
| PRM-MOR-097 | `delinquencyStages.flags.isSensitive` / `regulatoryCode` | Bool/String | T | — | Instancia sensible (riesgo de corte) y código regulatorio | #2203/#2204 (uso ERSeP) |
| PRM-MOR-098 | `delinquencyNoticeModels.ignoreNullServiceInfo` | Bool | T/modelo | `true` | Ignorar valores nulos en la variable de información del servicio | #2359 |
| PRM-MOR-099 | `delinquencyNoticeModels.includeSummary` | Bool | T/modelo | `false` | Incluir resumen de las notificaciones | #2322 |
| PRM-MOR-100 | `delinquencyPolicies.stages[].debtDocumentTypeId` | Ref | T | — | Tipo de cuota por defecto para comprobante de deuda notificada | #2305 |
| PRM-MOR-101 | `reports.circulars.includeTerminatedHolders` | Bool | T | `false` | Incluir titulares dados de baja en el informe de circulares | #2306 |
| PRM-MOR-102 | `delinquencyExceptions.printOnConfirm` | Bool | T | `false` | Imprimir informe de excepción por mora al confirmar alta | #2328 |
| PRM-MOR-103 | `delinquencyPolicies.allowPastNoticeDueDate` | Bool | T | `false` | Permitir vencimiento de notificación anterior a hoy | #2919 |

### 14.5 Tratamiento, interrupción y reconexión

| PRM-ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 |
|---|---|---|---|---|---|---|
| PRM-MOR-110 | `delinquencyPolicies.finalAction.cashLockWhilePending` | Bool | T/S | `false` | Bloquear caja al realizar orden de cambio de estado [VERIFICAR] | #2458 |
| PRM-MOR-111 | `delinquencyPolicies.inTechnicalStatus` | Bool | T | `true` | Asignar estado "En técnica" a notificaciones procesadas en tratamiento | #2379 |
| PRM-MOR-112 | `delinquencyPolicies.allowOrderWithoutObservation` | Bool | T | `false` | Generar orden de tratamiento de morosos sin observación técnica | #2694 |
| PRM-MOR-113 | `delinquencyPolicies.requireEvidenceBeforeSuspension` | Bool | T/S | `true` (no desactivable si hay restricción `normative` de preaviso) | Exigir constancia de preaviso | — |
| PRM-MOR-114 | `delinquencyPolicies.requireApproval` (sensibles) | Bool | T/S | `true` | Aprobación de cortes de cuentas con protección `review` | — |
| PRM-MOR-115 | `delinquencyPolicies.exceptionsHonored.billingClaims` | Bool | T | `true` (no desactivable) | Reclamo de facturación protege el documento | — |
| PRM-MOR-116 | `delinquencyPolicies.exceptionsHonored.informedPayments` | Bool | T | `true` | Pago informado protege hasta su acreditación | — |
| PRM-MOR-117 | `delinquencyPolicies.crossServiceAffectation` | Bool | T/S | `false` (PA-MOR-08) | Afectación cruzada en cuenta unificada | CTA-003 |
| PRM-MOR-118 | `delinquencyPolicies.minimumPayment` | Objeto | T/S | deshabilitado (PA-MOR-09) | Pago mínimo y su finalidad | CTA-002 |
| PRM-MOR-119 | `delinquencyPolicies.finalAction.internetMode` | Enum | S (Internet) | `suspendProfile` | Modo de suspensión de Internet (perfil de suspensión, portal cautivo, reducción de velocidad) | — |
| PRM-MOR-120 | `tec.disconnection.meterRemovedDefault` (M10) | Bool | S | `false` | Marcar medidor como retirado por defecto al confirmar desconexión | #2440 |
| PRM-MOR-121 | `tec.disconnection.askMeterRemoval` (M10) | Bool | S | `false` | Preguntar si se retira medidor al confirmar desconexión | #2531 |
| PRM-MOR-122 | `delinquencyPolicies.cancelPendingCutOnPayment` | Bool | T/S | `true` | Cancelar desconexión por mora pendiente al cobrar | #2917 |
| PRM-MOR-123 | `delinquencyPolicies.clearDelinquentFlagOnPayment` | Bool | T/S | `true` | Quitar marca de moroso al no reconectar en el pago | #3033 |
| PRM-MOR-124 | `delinquencyPolicies.reactivation.debtCriterion` | Enum | T/S | `overdueLastVto` (PA-MOR-11) | Deuda a considerar para reconectar | #3147 |
| PRM-MOR-125 | `delinquencyPolicies.reactivation.sameServiceOnly` | Bool | T/S | `true` | Tomar deuda por tipo de servicio para reconexiones automáticas | #3113 |
| PRM-MOR-126 | `delinquencyPolicies.reactivation.noOpenNotices` | Bool | T/S | `false` | Validar deuda notificada al generar reconexión | #3163 |
| PRM-MOR-127 | `delinquencyPolicies.reactivation.autoNoTechnical` | Bool | T/S | `true` | Reconexión automática de servicios sin técnica al pagar | #3112 |
| PRM-MOR-128 | `delinquencyPolicies.reactivation.keepAltaDateSameMonth` | Bool | S (no medidos) | `false` | Actualizar fecha de alta al reconectar no medido en el mismo mes | #2707 |
| PRM-MOR-129 | `delinquencyPolicies.reactivation.autoOrder` | Bool | T/S | `true` | Generar orden de reconexión tras cobranza de servicio desconectado | #3106 |
| PRM-MOR-130 | `delinquencyPolicies.reactivation.remoteAutoConfirm` | Bool | T/S | `true` para Internet con aprovisionamiento | Generar y confirmar la orden (solo con respuesta remota exitosa) | #2713 |
| PRM-MOR-131 | `interruptionChargeRules.*` | Colección | T/S | gratuidad | Cargos de reconexión/suspensión | `CONEXION` |
| PRM-MOR-132 | `delinquencyPolicies.reactivation.creditDisconnectedDays` | Bool | S | `false` | Crédito por días de servicio desconectado | #2483 |
| PRM-MOR-133 | `delinquencyPolicies.reactivation.creditConceptId` | Ref | S | — | Concepto por días desconectados | #2485 |
| PRM-MOR-134 | `delinquencyPolicies.reactivation.debitRemainingDays` | Bool | S | `false` | Débito al reconectar servicio no facturado en el período | #2661 |
| PRM-MOR-135 | `delinquencyPolicies.reactivation.allowCloseWithoutCharge` | Bool | S | `false` | Permitir cerrar órdenes sin generar comprobantes por reconexión (preguntar) | #2907 |
| PRM-MOR-136 | `fac.proration.useReconnectionDay` (M05) | Bool | S | `true` | Tomar día de reconexión para el proporcional | #2787 |
| PRM-MOR-137 | `delinquencyPolicies.reactivation.allowDeceasedHolder` | Bool | T | `false` | Permitir reconexión a titulares fallecidos | #2301 |
| PRM-MOR-138 | `tec.reconnection.requireFeasibility` (M10) | Bool | S | `false` | Exigir factibilidad en altas y reconexiones que informan a técnica | #388 |
| PRM-MOR-139 | `int.remoteSystems.*` (T06) | Objeto | T/S | — | Impactar cambios de estado en sistemas externos; credenciales en bóveda | #3116, #3034, #3035 |
| PRM-MOR-140 | `interruption.publicCancellationChannel` | Bool | S | `true` para servicios comprendidos (Internet) | Baja pública sin registro previo | BASE §52.3 |
| PRM-MOR-141 | `interruptionChargeRules.admissibility.productionEnabled` | Bool | T/S | `false` | Habilitación productiva de cargos | BASE §53 |
| PRM-MOR-142 | `serviceInterruption.voluntarySuspension` | Objeto | S | Internet: min 1, max 3 meses, pausa de abono según regla (ilustrativo) | Suspensión voluntaria: duración y efecto en cargos | BASE §53 |
| PRM-MOR-143 | `delinquencyPolicies.reactivation.directForNoTechnicalAtCash` | Bool | T | `true` | Tener en cuenta servicios que no requieren técnica y reconectar directamente | #2926 |
| PRM-MOR-144 | `delinquencyPolicies.reactivation.newConnectionOrderOnPayment` | Bool | T/S | `false` | Generar orden de alta luego de cobrar un servicio desconectado (para servicios dados de baja) | #2420 |
| PRM-MOR-145 | `cob.cash.actionsOnServicePayment` | Bool | T | `true` | Tener en cuenta acciones a realizar al cobrar el servicio | #3153 |
| PRM-MOR-146 | `cob.cash.payDebitAdheredMode` (M07) | Enum | T | `never` | Permitir pagar facturas con débito automático (nunca / siempre / solo con recargo de mora) | #63 |
| PRM-MOR-147 | `cob.debtQuery.excludeAgreementsCheck` (M07) | Bool | T | `false` | Habilitar "Excluir financiaciones" en consulta de deuda | #2910 |
| PRM-MOR-148 | `cob.barcode.controlOverdueByAccount` (M07) | Bool | T | `false` | Controlar deuda vencida por cuenta al leer código de barras | #2932 |
| PRM-MOR-149 | `tec.categoryChangeTransactionId` (M10) | Ref | T | — | Operación técnica por cambio de categoría | #2330 |
| PRM-MOR-199 | `delinquencyPolicies.finalAction.telephonyMode` | Enum (`restricted`/`interrupted`) | T/S (Telefonía) | `restricted` (bloqueo saliente; entrantes y emergencias habilitadas) | Modo de suspensión por mora de telefonía (RN-MOR-137). Default propuesto `restricted`; la lista de números de emergencia siempre habilitados se toma del plan de numeración de la jurisdicción (propuesta: 100, 101, 103, 107, 911). **Requiere validación legal** (régimen TIC y emergencias). | HUE-TEL-04 |
| PRM-MOR-200 | `delinquencyPolicies.finalAction.tvMode` / `.tvMinimumLineupPackageId` | Enum (`restricted`/`interrupted`) / Ref [M02] | T/S (TV) | `restricted` / el producto del servicio TV con `serviceProducts.tvMinimumLineup = true` (M02, RN-CAT-079) | Modo de suspensión por mora de TV y paquete de grilla mínima (RN-MOR-138). Default propuesto `restricted` con el paquete marcado en M02; sin paquete marcado, la política no puede usar `restricted`. **Requiere validación legal** (contenido de la grilla mínima exigible). | HUE-TV-03 |
| PRM-MOR-201 | `delinquencyPolicies.finalAction.waterMode` / `.waterMinFlow` | Enum (`restricted`/`interrupted`) / Decimal | C/S (Agua) | `restricted` / `50` litros por persona y por día (default propuesto; la concesión puede fijar otro) | Modo de mora de agua y caudal mínimo vital (RN-MOR-139). **Requiere validación legal** por concesión (marco regulatorio del servicio de agua). | HUE-AG-02 |
| PRM-MOR-202 | `delinquencyPolicies.eligibleBalance.thirdPartyConcepts` | Enum (`exclude`/`includeIfAgreement`) | T/S | `exclude` | Conceptos de terceros en el saldo elegible y en la evaluación de corte (RN-MOR-141, RN-MOR-142) | HUECO-TAS-02; HUE-ALU-01 |
| PRM-MOR-203 | `interestPolicies.thirdPartySurchargeAllowed` | Bool | T (por convenio con el tercero) | `false` | Recargos o intereses sobre saldo de terceros solo si el convenio los autoriza (RN-MOR-142) | HUECO-TAS-02 |
| PRM-MOR-204 | `suspensionRestrictionRules.socialCoverageSuspension.unpaidMonths` | Int | T/S (sepelio, salud) | deshabilitado; al habilitar, default propuesto `3` meses (el reglamento del servicio puede fijar otro) | Meses de cuotas impagas que habilitan suspender la cobertura social (RN-MOR-143). La carencia de rehabilitación es parámetro de M18 (PRM-SOC-052). **Requiere validación legal** (reglamento del servicio social). | HUECO-SEP-01 |
| PRM-MOR-205 | `suspensionRestrictionRules.reviewTaskOnly.afterMonths` / `.assigneeRole` | Int / Ref rol | T/S (Banco de sangre) | `2` / responsable del servicio social | Antigüedad del aporte impago que crea la tarea de revisión y rol que la recibe (RN-MOR-144) | HUECO-SAN-02 |
| PRM-MOR-206 | `platform.restrictionTemplates.ersepElectricityWindow` | Plantilla (plataforma) | Plataforma | `toValidate`; contenido propuesto: lunes a jueves hábiles, de 8 a 14 h, sin vísperas de feriado ni feriados, y suspensión con alerta meteorológica oficial o temperatura menor a 5 °C o mayor a 35 °C en la zona | Plantilla de ventana de corte ERSeP para electricidad en Córdoba (RN-MOR-145, RF-MOR-221). **Requiere validación legal** (días, horarios y umbrales del régimen ERSeP vigente); hasta validarse su efecto es `review`. | HUE-ELE-05 |

### 14.6 Financiación (grupo FINANCIACIONES completo y relacionados)

| PRM-ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 |
|---|---|---|---|---|---|---|
| PRM-MOR-150 | `financing.concepts.financingInterestId` | Ref | T | — | Concepto para interés por financiación | #607 |
| PRM-MOR-151 | `financing.concepts.saleInterestId` | Ref | T | — | Concepto para interés de comprobante de venta (M11) | #2089 |
| PRM-MOR-152 | `financing.concepts.capitalId` | Ref | T | — | Concepto para deuda de financiación (capital) | #310 |
| PRM-MOR-153 | `financing.concepts.previousInterestId` | Ref | T | — | Concepto para interés anterior | #311 |
| PRM-MOR-154 | `paymentPlans.discounts.lateDiscountScope` | Enum | PL | `current` | Alcance de la quita de mora (actual / total) | RN-04 §8.6 |
| PRM-MOR-155 | `financing.concepts.stampTaxId` | Ref | T | — | Concepto para sellado de convenio | #676 |
| PRM-MOR-156 | `financing.concepts.monthlyInstallmentId` | Ref | T | — | Concepto para cuota en factura mensual (alícuota exenta → cuota exenta) | #308 |
| PRM-MOR-157 | `financing.installmentMode` | Enum | T/PL | `monthlyInvoice` | Forma de registración de cuotas (chequera / factura mensual) | #306 |
| PRM-MOR-158 | `financing.allowChangeInstallmentMode` | Bool | T | `false` | Permitir modificar la forma de registración | #2299 |
| PRM-MOR-159 | `financing.limits.maxAgreementsPerPeriod` | Int | T | `0` (sin límite) | Máxima cantidad de convenios en un período | #671 |
| PRM-MOR-160 | `financing.limits.controlPeriodFrom` | Fecha | T | — | Período de control (desde) | #674 |
| PRM-MOR-161 | `financing.limits.controlPeriodTo` | Fecha | T | — | Período de control (hasta) | #675 |
| PRM-MOR-162 | `financing.limits.minDocuments` | Int | T | `1` | Mínima cantidad de comprobantes a financiar | #672 |
| PRM-MOR-163 | `financing.limits.maxDocuments` | Int | T | `0` (sin límite) | Máxima cantidad de comprobantes a financiar | #2208 |
| PRM-MOR-164 | `financing.limits.minInstallmentAmount` | Decimal | T | `0` | Importe mínimo de cada cuota | #673 |
| PRM-MOR-165 | `financing.limits.oneActivePerType` | Bool | T | `false` | No permitir más de una financiación activa del mismo tipo | #735 |
| PRM-MOR-165b | `financing.limits.mode` | Enum | T | `block` | Comportamiento de los límites (bloquear / advertir) | RN-MOR-118 |
| PRM-MOR-166 | `paymentPlans.indexAdjustment.lagMonths` | Int | PL | `2` | Rezago del índice de ajuste de cuotas | RN-04 §8.8 |
| PRM-MOR-167 | `financing.concepts.advanceBonusFinancingId` | Ref | T | — (vacío = no bonifica) | Bonificación de interés por adelanto de cuotas — financiación | #2607 |
| PRM-MOR-168 | `financing.concepts.advanceBonusSaleId` | Ref | T | — | Bonificación por adelanto — ventas (M11) | #2624 |
| PRM-MOR-169 | `financing.fiscalRecalc.iibbRegimeEnabled` | Bool | T (Córdoba) | `false` | Liquidar percepciones IIBB RN 01/2017 y recalcular cuotas | #757 |
| PRM-MOR-170 | `paymentPlans.defaultRule` | Objeto | PL | 3 cuotas impagas consecutivas, aviso 10 días (PA-MOR-13) | Regla de caducidad | — |
| PRM-MOR-171 | `paymentPlans.defaultRule.rehabilitationDays` | Int | PL | `15` | Plazo para rehabilitar | — |
| PRM-MOR-172 | `paymentPlans.downPayment.dueDays` | Int | PL | `3` | Plazo de pago del anticipo | — |
| PRM-MOR-173 | `financing.installmentPaymentOrder` | Lista | T | mora, interés, IVA, capital | Orden de imputación dentro de la cuota | AGR-014 |
| PRM-MOR-174 | `financing.templates.withoutGuarantor` | Ref | T | — | Texto para convenio sin garante | #507 |
| PRM-MOR-175 | `financing.templates.withGuarantor` | Ref | T | — | Texto para convenio con garante | #214 |
| PRM-MOR-176 | `financing.autoPrintAgreement` | Bool | T | `false` | Imprimir automáticamente el convenio al generarlo | #2252 |
| PRM-MOR-177 | `financing.defaultDocumentTypeId` | Ref | T | — | Tipo de cuota por defecto para emitir financiación | #2471 |
| PRM-MOR-178 | `financing.allowOtherAccount` | Bool | T | `false` | Permitir imputar financiaciones a otra cuenta | #2634 |
| PRM-MOR-179 | `financing.operatorCanChangeDailyRate` | Bool | T | `false` | Permitir al operador cambiar el recargo diario (modo financiación) | #1030 |
| PRM-MOR-190 | `ven.saleQuotes.fxDifferenceConceptId` (M11) | Ref | T | — | Producto para diferencia de cotización en ventas | #2289 |
| PRM-MOR-191 | `ven.saleQuotes.fxDifferenceBillingGroup` (M11) | Int | T | — | Grupo de facturación para ítems de diferencia de cotización | #2512 |
| PRM-MOR-192 | `ven.installmentsWithInterestDocumentTypeId` (M11) | Ref | T | — | Tipo de comprobante para factura en cuotas con intereses | #733 |
| PRM-MOR-207 | `paymentPlans.worksLevy.refinanceOverdueOnly` | Bool | T | `true` | El convenio solo admite cuotas de obra vencidas; el cobro normal es el plan tipo 17 (RN-MOR-146) | HUECO-OBR-02 |

### 14.7 Garantías, recupero, incobrables y prescripción

| PRM-ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 |
|---|---|---|---|---|---|---|
| PRM-MOR-180 | `guaranteeRequirementRules.*` | Colección | T/S/C | deshabilitado (PA-MOR-19) | Exigencia de garantías | MER-005 |
| PRM-MOR-181 | `collection.legalCosts.transferRequiresTitle` | Bool | T | `true` | Gastos judiciales trasladables solo con título (PA-MOR-18) | MER-006 |
| PRM-MOR-182 | `writeOff.approval.doubleControl` | Bool | T | `true` | Doble control en incobrables | MER-006 |
| PRM-MOR-183 | `writeOff.criteria` | Objeto | T | antigüedad ≥ 365 días y gestión agotada (ilustrativo, PA-MOR-17) | Criterios sugeridos | MER-006 |
| PRM-MOR-184 | `prescriptionRules.termMonths` | Int | T/S/D | `24` facturas periódicas de servicios; `60` resto (DEC-052); requiere validación legal antes de la primera corrida | Meses para prescripción de deuda | #104 |
| PRM-MOR-185 | `prescriptionRules.ledgerAccountId` (M15) | Ref | T | — | Cuenta contable de prescripción | #2158 |
| PRM-MOR-186 | `prescriptionRules.alertDaysBefore` | Int | T | `60` | Días de alerta previa | — |

### 14.8 Parámetros citados que pertenecen a otros módulos (referencia)

| PRM-ID | Clave destino | Módulo dueño | Descripción | Origen V2 |
|---|---|---|---|---|
| PRM-MOR-193 | mapeo contable "intereses en vencimientos 2 y 3" | M15 | Cuenta contable de intereses entre vencimientos | #2109 |
| PRM-MOR-194 | `fis.defaultVatSituationId` | M06 | Situación IVA por defecto (usada por el motor) | #2086 |
| PRM-MOR-195 | `cob.remote.surchargeAmount` | M07 | Importe de recargo por cobranza remota | #718 |
| PRM-MOR-196 | `cob.remote.surchargeConceptId` | M07 | Concepto por cobranza remota | #719 |
| PRM-MOR-197 | `cob.paymentMethods.cardSurchargeConceptId` | M07 | Concepto para recargo con tarjeta de crédito | #2069 |
| PRM-MOR-198 | `cob.paymentMethods.transferSurchargeConceptId` | M07 | Concepto para recargo por transferencia | #2070 |

## 15. Reportes, indicadores y exportaciones

Reglas comunes (AGR-022): todo informe declara **universo**, **fecha de corte** (por defecto, fin del día anterior en la zona del tenant), **fórmula** y **fuente**; los importes salen de las colecciones de M08 y de los saldos de M07 a la fecha de corte (no del saldo actual); se exportan a CSV/XLSX/PDF por job asíncrono (API-MOR-84) con la fecha de corte impresa; los datos personales solo se muestran a quien tiene la capability y la exportación queda auditada.

| REP-ID | Informe / indicador | Universo | Fecha de corte | Fórmula / contenido | Origen |
|---|---|---|---|---|---|
| REP-MOR-01 | Deuda vencida por antigüedad | Documentos con saldo > 0 y VTO1 < corte, por servicio y categoría | Elegible | Saldo por tramo 0–30, 31–60, 61–90, 91–180, 181–365, > 365 días desde el VTO1; deuda actualizada = saldo + recargo cotizado al corte (cálculo no registrado) | RN-04 §10 `Get_InformeDeuda`; RF-MOR-200 |
| REP-MOR-02 | Titulares notificados (deuda notificada / actualizada / detalle) | Notificaciones en estados abiertos o En técnica | Elegible | Deuda notificada = suma de saldos de los ítems al crear; deuda actualizada = saldo actual + recargo al corte; detalle por documento | RN-04 §10; RF-MOR-198 |
| REP-MOR-03 | Notificaciones pendientes (sin candidatos) | Notificaciones no pagadas, no cerradas, excluida la instancia de candidatos | Elegible | Conteo e importe por instancia, lote y estado de entrega | RN-04 §10 |
| REP-MOR-04 | Servicios a cortar | Servicios de notificaciones vencidas de instancia de corte con evaluación `allowed` | Fecha del informe | Lote, cuenta, servicio, medidor/equipo, meses de deuda = ⌊(corte − VTO1 más antiguo) / 30⌋, deuda; se excluyen los bloqueados y se listan aparte con motivo | RN-04 §10 `Get_CortarServicio`; RF-MOR-199 |
| REP-MOR-05 | Totales por servicio del lote | Ítems del lote | Fecha del lote | Cantidad de cuentas, documentos e importe por servicio | `Get_TotalesServicio` |
| REP-MOR-06 | Excepciones por mora | Excepciones vigentes y vencidas | Elegible | Cuenta, tipo, alcance, vigencia, autorizado por, motivo | RN-04 §7.2; V2 #2328 |
| REP-MOR-07 | Promesas de pago | Promesas registradas | Rango | Cumplidas = pago confirmado ≥ importe prometido antes de la fecha; tasa de cumplimiento = cumplidas / vencidas | RN-04 §7.3 |
| REP-MOR-08 | Resumen de notificaciones | Lote o rango | Rango | Por instancia: generadas, entregadas con evidencia, sin evidencia, pagadas, dadas de baja, cerradas | V2 #2322 |
| REP-MOR-09 | Circulares | Notificaciones del modelo seleccionado | Fecha de impresión | Lista para impresión/envío postal; incluye titulares de baja solo con PRM-MOR-101 | INV `ExportarCirculares` |
| REP-MOR-10 | Deuda a prescribir | Documentos con saldo cuya fecha de prescripción cae dentro de N días | Elegible | Fecha de prescripción = exigibilidad + plazo de la regla ± suspensiones/interrupciones registradas | RN-04 §10; RF-MOR-193 |
| REP-MOR-11 | Casos de interrupción | `interruptionCases` | Rango | Por tipo y estado: solicitados, bloqueados (motivo), aprobados, ejecutados, fallidos, cancelados; tiempo medio solicitud→ejecución | BASE §53, §14 |
| REP-MOR-12 | Tiempo de reconexión | Casos de reconexión ejecutados | Rango | Mediana y p90 de (ejecución confirmada − pago confirmado que la habilitó) | BASE §14; AGR-022 |
| REP-MOR-13 | Bloqueos por protección | Evaluaciones con decisión `blocked`/`review` | Rango | Cantidad por causa (electrodependiente, entidad pública, reclamo, pago informado, falta de evidencia, ventana) | BASE §68, §86–91 |
| REP-MOR-14 | Recupero por instancia | Notificaciones procesadas en el rango | Rango | Tasa de recupero = importe cobrado sobre ítems de la notificación hasta 30 días después del vencimiento / deuda notificada | BASE §14 |
| REP-MOR-15 | Intereses cobrados y facturados | `interestCalculations` liquidados y corridas | Rango | Neto, IVA, percepciones por tipo (entre vencimientos, mora, financiación, reversión, valores); dispensas aparte | RN-04 §4, §5 |
| REP-MOR-16 | Intereses diferidos pendientes | `deferredInterests` en `pending` | Elegible | Cuenta, servicio, neto, antigüedad | RN-04 §4.4 |
| REP-MOR-17 | Financiaciones del período | Convenios creados en el rango | Rango | Por plan: cantidad, deuda incluida, quitas, anticipo, capital financiado, interés total, CFT promedio ponderado | RN-04 §8.12 |
| REP-MOR-18 | Comprobantes y conceptos financiados | `agreementObligations` | Rango | Documento de origen, concepto, importe incluido, convenio | RN-04 §8.12 |
| REP-MOR-19 | Cuotas de un convenio / estado general de cuotas | `agreementInstallments` | Elegible | Por cuota: vencimiento, capital, interés, IVA, total, pagado, saldo, estado | RN-04 §8.12 |
| REP-MOR-20 | Cuotas adeudadas a fecha | Cuotas vencidas impagas al corte | Elegible | Incluye en sección aparte las cuotas anuladas (RF-MOR-201) | RN-04 §8.12 |
| REP-MOR-21 | Cartera de convenios | Convenios vigentes | Elegible | Vigentes, en atraso, aviso de caducidad, caídos, rehabilitados; tasa de caída = caídos en el rango / activados 12 meses antes | DFA M12; AGR-014 |
| REP-MOR-22 | Garantías | `guarantees` | Elegible | Vigentes, ejecutadas, devueltas; depósitos actualizados | MER-005 |
| REP-MOR-23 | Gestión externa y judicial | `collectionCases` | Rango | Por estudio: asignados, recuperado, costos, honorarios, antigüedad | MER-006 |
| REP-MOR-24 | Incobrables | `writeOffs` | Rango | Previsionado, castigado, recuperado post castigo, revertido | MER-006 |
| REP-MOR-25 | Exportación regulatoria de condición de mora | Cuentas del servicio regulado | Fecha requerida por el regulador | Código por cuenta: "R/C" si está en instancia sensible o de corte; "A" en otro caso; formato por regulador | RN-04 §7.3 (DNU 311/2020); RF-MOR-202 |
| REP-MOR-26 | Exportación a envío masivo | Notificaciones del lote seleccionado | Fecha de exportación | Cuenta, cantidad de comprobantes, deuda, deuda actualizada, correo; excluye sin consentimiento | `ExportarDopler`; RF-MOR-203 |
| REP-MOR-27 | Tablero de mora | Tenant (filtro por servicio, zona, categoría) | Diario | Deuda vencida y su variación, cuentas por instancia, recupero, promesas, casos, convenios; cada tarjeta enlaza al informe fuente | BASE §14, §54; RF-MOR-204 |
| REP-MOR-28 | Conciliación del módulo | Tenant | Diario | (a) interés liquidado = cargos emitidos por M05 con origen M08; (b) obligaciones sustituidas por convenios = capital + quitas del convenio; (c) casos ejecutados = acciones confirmadas por M10/T06; diferencias a bandeja | AGR-011, AGR-021 |
| REP-MOR-29 | Paralelo de recargo ProCoop vs CoopApps | Muestra de documentos | Fecha del paralelo | Diferencia por documento y causa (corrección de prorrateo, superposición de tasas, redondeo, [VERIFICAR]) | RF-MOR-219 |

## 16. Casos de uso

### CU-14 — Acuerdo de deuda con anticipo (BASE §14)

**Actor:** gestor de deuda. **Situación inicial:** un titular ficticio tiene deuda confirmada de ARS 60.000 y está autorizado un plan sin interés (PLAN-DEMO-0).
1. El gestor abre PAN-MOR-30 (simulador), busca la cuenta y selecciona las obligaciones; el sistema verifica que ninguna esté en otro convenio vigente, bloqueada por gestión judicial ni reclamada (RF-MOR-145).
2. Elige el plan, que propone un anticipo de ARS 15.000 y tres cuotas de ARS 15.000 con 0 % de interés, CFT 0 %.
3. Confirma: se crea ACU-001 en `pendingSignature`; el titular firma con OTP (o firma presencial en tableta) y el convenio pasa a `pendingDownPayment` con la cuota 0 vencida hoy.
4. M07 confirma el pago del anticipo → `cob.payment.confirmed` → el convenio pasa a `active`; las obligaciones de origen quedan **sustituidas** (dejan de exigirse y de generar mora, RN-MOR-126) y se emiten las cuotas según la modalidad.
5. El gestor sigue pagos y vencimientos en PAN-MOR-31.
**Resultado:** convenio por ARS 60.000 con obligaciones de origen identificadas y sin doble exigencia. **Excepción:** si el anticipo no se paga en el plazo PRM-MOR-172, JOB-MOR-09 lo pasa a `lapsedNoDownPayment` y restituye las obligaciones; nunca queda cumplido. **Requisitos:** RF-MOR-142–157, 170; RN-MOR-105–127.

### CU-CIC-01 — Suspensión temporal y reactivación de Internet (BASE §53)

Definición dueña: este anexo (PA-MOR-21, Asumida DEC-072). M02 cita el cambio de estado del contrato, M09 el tramo de atención y M19 la pantalla del portal. Antes: «Definición dueña pendiente de decisión (pregunta abierta en el informe de corrección de inconsistencias; propuesta: este anexo, que define el caso de suspensión y reactivación).»

**Actor:** Ana (socia ficticia) desde la PWA; operador de atención; M10/T06. 
1. Ana abre PAN-MOR-41 en su contrato de Internet; ve las modalidades habilitadas (SUS-DEMO-GRATIS, duración 1–3 meses, costo ARS 0) y sus condiciones.
2. Solicita la suspensión desde el 01-12; se crea un caso `voluntarySuspension` en `requested`; la evaluación verifica que no haya restricciones; el caso queda `scheduled`.
3. En la fecha, JOB-MOR-18 envía la acción a T06 (perfil de suspensión); con respuesta exitosa el caso pasa a `executed` y M02 cambia el contrato a Suspendido; M05 aplica la pausa de cargos definida.
4. Ana pide la reactivación: el sistema verifica estado, reglas e intervención técnica necesaria y muestra REACT-DEMO-GRATIS, ARS 0.
5. La app muestra "Reactivación en trámite" hasta que T06 confirma; recién entonces el contrato vuelve a Activo.
**Control:** si T06 falla, el caso queda `executionFailed` con reintento y la app no anuncia reactivado aunque se hubiera pagado un cargo admisible. REACT-DEMO-ARANCEL (ARS 5.000) existe deshabilitada. **Requisitos:** RF-MOR-131–140, 211; RN-MOR-099–104. (M09 registra la solicitud cuando entra por atención y cita este CU en su §16; antes «CU-CIC-01 de M09».)

### CU-CTA-01 — Evaluación de mora en cuenta unificada (BASE §68)

Definición dueña: M07 «CU-CTA-01 — Cuenta unificada con mínimo (BASE §68)». Aquí solo la evaluación de mora posterior.

**Situación:** Ana tiene facturas pendientes de agua ARS 13.000, electricidad ARS 20.000 y cementerio parque ARS 7.000 (total ARS 40.000) en una cuenta unificada; la política de prueba usa un umbral interno de ARS 10.000 (no es norma).
1. JOB-MOR-02 evalúa obligaciones, vencimientos y pagos confirmados; con un pago de ARS 8.000 imputado por M07 a la factura de agua, la evaluación registra el saldo exacto por factura y que no se alcanzó el umbral de cumplimiento.
2. Genera una **evaluación de mora** (`delinquencyEvaluations`), no un corte automático.
3. Por cada servicio verifica fundamento, avisos con constancia, restricciones y excepciones: agua → `review` (servicio esencial con restricción normativa de preaviso); electricidad → `allowed` si tiene aviso con evidencia y no hay protección; cementerio → acción `allowed` solo dentro de su propio servicio (no tiene suspensión física).
4. Solo los servicios con acción habilitada generan casos de interrupción; la ejecución efectiva se registra al confirmarse.
5. Un pago posterior dispara JOB-MOR-07; la reactivación aplica su regla de cargo o gratuidad, sin duplicar cargos ni reactivar por presunción.
**Control:** la deuda de cementerio parque no habilita por sí sola la suspensión de agua o electricidad (afectación cruzada deshabilitada, PA-MOR-08). **Requisitos:** RF-MOR-065–074; RN-MOR-081–088.

### CU-MOR-01 — Recargo cotizado en caja y liquidado una sola vez

El cajero (M07) consulta la deuda de una factura de ARS 10.000 vencida hace 30 días; M08 cotiza ARS 300 de interés (0,1 % diario) más IVA; al confirmar el cobro M07 llama a `settle`; M08 registra el cálculo, marca `interestSettledUntil` = fecha de pago y emite `mor.interest.settled`; M05 emite la ND. Una segunda consulta al día siguiente solo calcula desde esa fecha. **Requisitos:** RF-MOR-001–010, 021–034; RN-MOR-001–013.

### CU-MOR-02 — Corrida masiva de intereses a facturar

El analista crea una corrida estándar con fecha de cálculo fin de mes, revisa el preliminar, destilda dos documentos reclamados, la aprueba un supervisor y la genera; JOB-MOR-01 emite los cargos por cuenta a M05 y la corrida cierra con totales conciliados (REP-MOR-28). **Requisitos:** RF-MOR-049–058.

### CU-MOR-03 — Ciclo de mora del piloto Internet

Con la política PA-MOR-05: JOB-MOR-03 genera candidatos (deuda ≥ umbral, 15 días de atraso); el operador procesa la instancia Aviso (T09 por WhatsApp y correo); tras el vencimiento, procesa la Intimación con preaviso (evidencia exigida); las cuentas sin constancia de entrega generan tarea de canal alternativo; al vencer la intimación, PAN-MOR-19 lista los servicios elegibles; los casos se programan en la ventana hábil y T06 suspende; un pago confirmado reactiva automáticamente. **Requisitos:** RF-MOR-075–130.

### CU-MOR-04 — Bloqueo por protección normativa

Un servicio eléctrico tiene una protección de electrodependiente acreditada; la cuenta llega a la instancia de corte; la evaluación devuelve `blocked` con motivo; el caso no se crea, queda una alerta a supervisión y el informe REP-MOR-13 lo cuenta. No existe capability que permita forzarlo. **Requisitos:** RF-MOR-109–116; RN-MOR-081–086.

### CU-MOR-05 — Pago entre la orden y la ejecución

Con un caso `scheduled` de suspensión, M07 confirma el pago total; JOB-MOR-07 cancela el caso (PRM-MOR-122), pide a M10 cancelar la OT y, si M10 informa que la OT ya estaba ejecutada, abre la reconexión inmediata sin cargo. **Requisitos:** RF-MOR-121–126; RN-MOR-091, -092.

### CU-MOR-06 — Convenio con interés, caída y rehabilitación

Un convenio de ARS 100.000 en 6 cuotas al 60 % TNA (sistema francés) entra en atraso con dos cuotas impagas; JOB-MOR-11 lo pasa a `defaultWarning` y T09 avisa; con la tercera impaga se declara `defaulted`: el saldo de capital es exigible, se pierden las quitas proporcionales y las obligaciones de origen no reviven (PA-MOR-13). Dentro de los 15 días el socio paga lo vencido y un supervisor lo rehabilita. **Requisitos:** RF-MOR-143, 155–157, 163; RN-MOR-105, -123.

### CU-MOR-07 — Cancelación anticipada desde la app

El socio cotiza la cancelación de su convenio tras pagar dos cuotas: el sistema muestra el saldo de capital, sin intereses futuros, más la bonificación configurada; paga en línea; el convenio pasa a `cancelledEarly` y las cuotas futuras se anulan. **Requisitos:** RF-MOR-159, 212; RN-MOR-120.

### CU-MOR-08 — Derivación a estudio externo e incobrable

Una cuenta de baja con deuda de 400 días se deriva al estudio ESTUDIO-DEMO; el estudio registra avances por `/api/v1/ext`; sin recupero, el analista propone el castigo; dos aprobadores lo aprueban; M15 registra el asiento y la deuda sigue visible como castigada (no se borra). Un pago posterior revierte parcialmente. **Requisitos:** RF-MOR-183–192.

### CU-MOR-09 — Prescripción

JOB-MOR-13 alerta deuda a prescribir; el responsable legal crea una corrida, revisa interrupciones registradas (reconocimiento, convenio, reclamo judicial) y la aprueba; la deuda prescripta deja de ser exigible por M07 y queda con estado y asiento. **Requisitos:** RF-MOR-193–197.

### CU-MOR-10 — Baja pública de Internet sin cargo

Un socio pide la baja desde el botón público; se crea un caso `cancellation` con costo ARS 0 (BAJA-DEMO); T06 ejecuta y M02 registra la baja; no se condiciona a la deuda (que sigue su curso por M07/M08). **Requisitos:** RF-MOR-131–133; RN-MOR-100.

## 17. Criterios de aceptación y escenarios de prueba

Todos los importes son ficticios; IVA del concepto de interés al 21 % y redondeo half-up a 2 decimales, salvo que se diga otra cosa.

### 17.1 Motor de interés

| ESC-ID | Escenario | Datos | Resultado esperado |
|---|---|---|---|
| ESC-MOR-01 | Tasa fija diaria | Base ARS 10.000; 0,1 % diario; 30 días | Interés neto ARS 300; IVA ARS 63 (RI); total ARS 363. |
| ESC-MOR-02 | Recargo entre vencimientos porcentaje fijo | TOTAL1 ARS 10.000; 5 % por escalón | Modo simple: TOTAL2 10.500, TOTAL3 11.000, TOTAL4 11.500. Modo cascada: 10.500, 11.025, 11.576,25 (PA-MOR-03). |
| ESC-MOR-03 | Índices | Base ARS 10.000; índice a la fecha base 100, al cálculo 103 | ARS 300; tasa diaria equivalente informada. Si falta un índice → error de configuración, sin fallback. |
| ESC-MOR-04 | Tabla de tasas con dos tramos | Base ARS 10.000; 40 días: 25 al 0,10 % y 15 al 0,12 % diario | 250 + 180 = ARS 430. |
| ESC-MOR-05 | Prioridad de categoría | Tasa general 0,10 % y de categoría "Residencial" 0,08 % vigentes | Para Residencial solo se usa 0,08 %; publicar dos tasas generales superpuestas falla. |
| ESC-MOR-06 | Pago parcial y prorrateo de excluidos | TOTAL1 10.000 con impuesto excluido 1.000; saldo 5.000 | Base = 5.000 − 1.000 × 5.000 / 10.000 = 4.500 (corrige el error de RN-04 §13.2). |
| ESC-MOR-07 | Mínimo | Mínimo ARS 50 | "Umbral": recargo 40 → 0. "Piso": recargo 40 → 50. |
| ESC-MOR-08 | Sin doble cobro | Pago parcial con interés liquidado al 10-11; nueva consulta el 20-11 | Días = 10 desde el 10-11; la cotización no repite el interés anterior. |
| ESC-MOR-09 | Reversión | Pago de ARS 5.000 revertido a los 20 días; 0,1 % diario | Interés por reversión ARS 100. |
| ESC-MOR-10 | Exenciones | Documento NC; titular jubilado con condición eximida; documento sin interés | Interés 0 en los tres, con motivo en el cálculo. |
| ESC-MOR-11 | Ente sobrescribe | Ente con "cobro al VTO1" | Sin recargo entre vencimientos para pagos por ese ente. |
| ESC-MOR-12 | Dispensa | Cajero solicita dispensa | Sin aprobación del supervisor no se confirma el cobro; con aprobación queda motivo y autor. |
| ESC-MOR-13 | Corrida masiva | 1.000 documentos; 2 destildados | Cargos para 998; totales de corrida = cargos emitidos por M05 (REP-MOR-28); reejecutar `generate` no duplica. |
| ESC-MOR-14 | Coherencia de canales | Misma factura cotizada en caja, PWA y consulta | Mismo importe en los tres al mismo instante. |

### 17.2 Gestión de mora, corte y reconexión

| ESC-ID | Escenario | Datos | Resultado esperado |
|---|---|---|---|
| ESC-MOR-15 | CU-CTA-01 | Agua 13.000, electricidad 20.000, cementerio 7.000; pago 8.000 | Evaluación con decisión por servicio, sin corte automático; cementerio no habilita suspender agua ni electricidad. |
| ESC-MOR-16 | Sin evidencia no hay suspensión | Intimación con evidencia exigida y correo rebotado | La cuenta no aparece como elegible; se crea tarea de canal alternativo. |
| ESC-MOR-17 | Electrodependiente | Protección acreditada vigente | Evaluación `blocked`; ningún rol puede crear el caso. |
| ESC-MOR-18 | Entidad pública | Protección `review` | Caso en `pendingApproval`; sin aprobación no se programa. |
| ESC-MOR-19 | Ventana de ejecución | Caso aprobado un viernes 16:00 | Se programa para el lunes hábil dentro del horario (PA-MOR-10). |
| ESC-MOR-20 | Pago antes de ejecutar | Caso `scheduled`; pago total confirmado | Caso cancelado; OT cancelada en M10; contrato sigue Activo. |
| ESC-MOR-21 | Reconexión con falla remota | Pago confirmado; T06 responde error | Caso `executionFailed`, reintentos con backoff, alerta; contrato sigue Suspendido hasta éxito. |
| ESC-MOR-22 | Reconexión vinculada al caso | Servicio desconectado hace 40 días por mora | Se reconecta por el caso, sin la ventana de 15 días de ProCoop. |
| ESC-MOR-23 | Reclamo de facturación | Documento reclamado en M09 | Excluido de candidatos y de la deuda que habilita la suspensión mientras el reclamo esté abierto. |
| ESC-MOR-24 | Composición cambiada | NC posterior sobre un documento notificado | Aviso de composición al procesar la siguiente instancia (PRM-MOR-093). |
| ESC-MOR-25 | Pago completo de notificada | PRM-MOR-070 activo | Caja y PWA preseleccionan todos los documentos de la notificación. |
| ESC-MOR-26 | Cargos de interrupción | REACT-DEMO-ARANCEL deshabilitada | Reactivación con costo ARS 0; activar la regla sin admisibilidad aprobada falla. |
| ESC-MOR-27 | Baja | Socio pide baja de Internet con deuda | Baja sin cargo ni condicionamiento; la deuda sigue en gestión. |
| ESC-MOR-28 | Restricción normativa | Tenant intenta editar una regla `normative` | 403 por falta de capability normativa. |
| ESC-MOR-51 | Telefonía en mora (HUE-TEL-04) | Línea TEL-DEMO-01 llega a instancia de corte con `telephonyMode = restricted` | Caso `delinquencyRestriction` con perfil `outgoingBarred`; entrantes y números de emergencia habilitados; si la central no confirma la emergencia, la acción queda Pendiente. |
| ESC-MOR-52 | TV en mora (HUE-TV-03) | Abonado TV-DEMO-01 con `tvMode = restricted` y paquete mínimo configurado | El abonado conserva solo la grilla mínima; el decodificador no se retira. |
| ESC-MOR-53 | Agua en mora (HUE-AG-02) | Concesión con `allowedModes = [restricted]` y política con `waterMode = interrupted` | Guardar la política falla con `mor/mode-not-allowed`; con `restricted` se genera OT de reducción de caudal en M10. |
| ESC-MOR-54 | Cloacas en mora (HUE-CLO-01) | Cuenta con 6 meses impagos de CLO | Avisos, intereses y oferta de convenio; ningún caso de interrupción ni restricción. |
| ESC-MOR-55 | Deuda solo de tasa de alumbrado (HUE-ALU-01, HUECO-TAS-02) | Socio al día con ELE y ARS 1.500 vencidos de tasa municipal, sin convenio que habilite el corte | Saldo elegible ARS 0; sin instancia de corte de ELE; la evaluación muestra "deuda de terceros excluida". |
| ESC-MOR-56 | Cobertura social (HUECO-SEP-01) | Restricción `socialCoverageSuspension` con 3 meses; adherente con 3 cuotas impagas de sepelio | M18 recibe "cobertura suspendida por mora" y RF-SOC-032 rechaza la cobertura; el contrato no se da de baja; urgencias sanitarias no se ven afectadas. |
| ESC-MOR-57 | Banco de sangre (HUECO-SAN-02) | Aporte del socio impago hace 2 meses | Se crea una tarea de revisión en la bandeja del responsable del servicio social; reprocesar la evaluación no crea otra; no hay caso de interrupción. |
| ESC-MOR-58 | Ventana ERSeP (HUE-ELE-05) | Plantilla adoptada y validada; orden de corte de ELE aprobada un jueves víspera de feriado | Se reprograma al siguiente día hábil dentro del horario; con la plantilla sin validar, el caso queda en `review`. |

### 17.3 Financiación y recupero

| ESC-ID | Escenario | Datos | Resultado esperado |
|---|---|---|---|
| ESC-MOR-29 | CU-14 | ACU-001: 60.000, anticipo 15.000, 3 × 15.000, 0 % | Convenio activo solo tras el pago del anticipo; origen sustituido; suma de cuotas + anticipo = 60.000. |
| ESC-MOR-30 | Anticipo impago | ACU-001 sin pago en 3 días | `lapsedNoDownPayment`; obligaciones restituidas sin intereses de financiación. |
| ESC-MOR-31 | Sistema francés | Capital 100.000; TNA 60 % (5 % mensual); 6 cuotas | Cuota 19.701,75; cuota 1: interés 5.000, capital 14.701,75, saldo 85.298,25; total pagado 118.210,48; última cuota ajusta el redondeo. CFT/TEA informados (PA-MOR-15). |
| ESC-MOR-32 | Sistema alemán | Mismo caso | Capital 16.666,67 por cuota (última 16.666,65); interés cuota 1 = 5.000, cuota 2 = 4.166,67. |
| ESC-MOR-33 | Cancelación anticipada | ESC-MOR-31 tras 2 cuotas pagadas | Saldo de capital 69.861,41 sin interés futuro, menos bonificación si aplica. |
| ESC-MOR-34 | Caducidad | 3 cuotas consecutivas impagas | `defaultWarning` a la segunda, `defaulted` a la tercera con aviso previo cumplido; no revive la deuda original. |
| ESC-MOR-35 | Límites de convenio | Máximo 1 por período y ya hay uno | Bloqueo (modo `block`) o advertencia (modo `warn`). |
| ESC-MOR-36 | Documento en otro convenio | Selección de un documento ya incluido | No seleccionable. |
| ESC-MOR-37 | Anulación | Convenio con cuota facturada | Rechazada con motivo; sin cuotas facturadas → anulación lógica y restitución. |
| ESC-MOR-38 | Quita de mora | Plan con quita 50 % del interés de mora, alcance `current` | La quita se calcula sobre el interés cotizado a la fecha del convenio. |
| ESC-MOR-39 | Incobrable | Propuesta con doble control | Un solo aprobador no la confirma; aprobada, la deuda queda castigada y visible. |
| ESC-MOR-40 | Prescripción | Regla con plazo default sin validación legal | La corrida no se puede aprobar hasta que la regla quede validada (DEC-052). |
| ESC-MOR-41 | Garantía | Depósito en garantía al dar de baja con deuda | Se aplica a la deuda con aprobación; el remanente se devuelve vía M07. |

### 17.4 Permisos, aislamiento, reintentos y conciliación

| ESC-ID | Escenario | Resultado esperado |
|---|---|---|
| ESC-MOR-42 | Permiso negativo: cajero intenta aprobar una corrida | 403 con `type` RFC 9457 y auditoría del intento. |
| ESC-MOR-43 | Permiso negativo: operador sin `mor.interrupciones.aprobar` aprueba un caso | 403. |
| ESC-MOR-44 | Socio consulta convenio ajeno por la PWA | 404 (no revela existencia). |
| ESC-MOR-45 | Aislamiento: token del tenant A sobre un convenio del tenant B | 404; los jobs de A no leen documentos de B; las exportaciones se filtran por `tenantId`. |
| ESC-MOR-46 | Reintento de `POST /agreements` con la misma `Idempotency-Key` | Devuelve el mismo convenio; no crea otro. |
| ESC-MOR-47 | Evento `cob.payment.confirmed` entregado dos veces | La notificación se cierra y el convenio se activa una sola vez. |
| ESC-MOR-48 | `int.network.provisioningResult` (antes `int.network.provisioning-result`) exitoso tardío tras cancelación | El caso pasa a conflicto para supervisión con ambas evidencias. |
| ESC-MOR-49 | Caída del worker durante JOB-MOR-01 | Reanuda por ítem; no hay cargos duplicados. |
| ESC-MOR-50 | Conciliación diaria (REP-MOR-28) | Sin diferencias en el juego canónico; una diferencia forzada aparece en bandeja. |
| ESC-MOR-59 | Refinanciación de cuotas de obra (HUECO-OBR-02). Dado: Contrato tipo 17 con 2 cuotas de obra vencidas y 10 no vencidas | El convenio admite solo las 2 vencidas; incluir las no vencidas falla con `mor/works-levy-not-eligible`. |
| ESC-MOR-61 | Cobertura social suspendida y rehabilitada (EVT-MOR-21). Dado: Restricción `socialCoverageSuspension` con 3 meses; contrato de sepelio SEP-DEMO-07 con 3 cuotas impagas; luego pago total en caja | Se publica una sola vez `mor.socialCoverage.suspended` con `unpaidMonths = 3`; al confirmarse el pago se publica `mor.socialCoverage.restored` con `paymentRef`; reprocesar la evaluación no duplica eventos. |
| ESC-MOR-62 | Convenio con deuda de dos entidades jurídicas (DEC-064, DEC-087). Dado: Socio con deuda de ELE (entidad A) e Internet (entidad B) | El simulador propone un convenio por entidad; un convenio que mezcle ambas falla con `mor/agreement-mixed-legal-entities`. |
| ESC-MOR-63 | Cambio de titularidad con deuda (DEC-045). Dado: Suministro con ARS 20.000 vencidos del titular saliente; alta del nuevo titular | La deuda queda en la cuenta del saliente; el nuevo titular no tiene instancia de mora; solo un convenio firmado por el nuevo titular la traslada. |
| ESC-MOR-60 | Devolución de depósito (HUECO-OTR-04). Dado: Depósito ORT-DEMO-01 de ARS 20.000 devuelto sin daños | EVT-MOR-16 `.refunded` con `refundMode = accountCredit`; M07 crea saldo a favor de ARS 20.000; M14 no recibe orden de pago. |

### 17.5 Escenarios transversales ESC-01 a ESC-05

| ESC | Aplicación en M08 |
|---|---|
| ESC-01 Pago excedente de un hermano | El pago excedente de A no cierra notificaciones ni evita la suspensión de B; la evaluación de B usa solo pagos imputados a B. |
| ESC-02 Corrección después de emitir | Un ajuste por ND/NC sobre un documento notificado recalcula la deuda actualizada de la notificación y avisa el cambio de composición (RN-MOR-070, -071) y el interés usa el saldo corregido; no se reescribe el cálculo liquidado. |
| ESC-03 Instalación offline en conflicto | Una OT de corte ejecutada offline después de cancelada abre conflicto en el caso (ESC-MOR-48); no se marca Activo ni Suspendido por presunción. |
| ESC-04 Restauración con operaciones externas | Tras restaurar, se concilian acciones de T06 y mensajes de T09 ya ejecutados por id externo; no se reenvían notificaciones ni cortes. |
| ESC-05 Cambio de condiciones en período procesado | Una nueva versión de política de interés o mora no reescribe cálculos, notificaciones ni convenios ya registrados; aplica a los nuevos (versionado de §8.1). |

## 18. Datos de precarga de demostración (ficticios)

Todos los nombres, cuentas e importes son ficticios; ninguna tasa ni arancel se presenta como real. Las reglas de cargo quedan deshabilitadas para producción.

| Elemento | Valor de demostración |
|---|---|
| Política de interés `POL-INT-DEMO` | Método tasa fija diaria 0,1 % (ilustrativa); mínimo ARS 0 en modo umbral; redondeo half-up 2 decimales; concepto fiscal "Interés por mora DEMO" |
| Tabla de tasas `TASAS-DEMO` | 01-01-2026 a 30-06-2026: 0,10 % diario; 01-07-2026 en adelante: 0,12 % diario; categoría "Residencial": 0,08 % |
| Tabla de índices `IDX-DEMO` | Valores mensuales 100, 101,5, 103 (ilustrativos) |
| Esquema entre vencimientos `ESQ-DEMO` | Porcentaje fijo 5 % por escalón, modo simple, VTO1/VTO2/VTO3 a 10/20/30 días |
| Instancias | 1 CANDIDATOS (`isCandidates`); 2 PRIMER INSTANCIA – Aviso (`isInitial`); 3 INTIMACIÓN con preaviso (`isSensitive`, evidencia exigida); 4 SUSPENSIÓN (`isCut`); 5 BAJA POR MORA |
| Política de mora Internet `POL-MORA-INT-DEMO` | Umbral ARS 10.000 (ilustrativo, no normativo); 15 días de atraso para candidato; aviso por WhatsApp y correo; intimación con preaviso de 10 días; acción final perfil de suspensión; reconexión automática al pago |
| Restricciones | Electrodependiente (`normative`, bloqueo); entidad pública (`tenantPolicy`, revisión); sin ejecución viernes, vísperas y feriados (a validar) |
| Reglas de interrupción | BAJA-DEMO ARS 0; SUS-DEMO-GRATIS ARS 0 (1–3 meses); REACT-DEMO-GRATIS ARS 0; REACT-DEMO-ARANCEL ARS 5.000 **deshabilitada para producción** |
| Planes | PLAN-DEMO-0: anticipo 25 %, hasta 3 cuotas, 0 % interés; PLAN-DEMO-6: hasta 6 cuotas, TNA 60 % (ilustrativa), sistema francés; caducidad 3 cuotas impagas |
| Convenio ACU-001 | Deuda incluida ARS 60.000; anticipo ARS 15.000; 3 cuotas de ARS 15.000 sin interés |
| Cuenta unificada de Ana (CU-CTA-01) | Agua ARS 13.000; electricidad ARS 20.000; cementerio parque ARS 7.000; pago ARS 8.000 |
| Protección | Servicio eléctrico ficticio con electrodependiente acreditado hasta 31-12-2026 |
| Estudio | ESTUDIO-DEMO con token de prueba de alcance limitado |
| Modelos de aviso | MOD-AVISO-DEMO y MOD-INTIMACION-DEMO con variables `{cuenta}`, `{deuda}`, `{vencimiento}`, `{fechaSuspension}` en `dict:` |

## 19. Migración desde ProCoop

Principios: la migración es **repetible** (O11), idempotente por clave de origen (subdocumento `legacy = {system: 'procoop', table, key, displayKey, runId, hash, readOnly, priorMigration}` de T05; antes `legacyRef = {tabla, clave}`), por tenant y con informe de conciliación que debe cerrar antes del corte. Los importes se convierten a Decimal128 sin redondeo intermedio; las fechas se interpretan en la zona del tenant. No se migran datos de tablas temporales ni historia que pueda regenerarse desde M05/M07. Los registros que no pasan validación van a una bandeja de excepciones con motivo, no se descartan en silencio.

### 19.1 Configuración

| Origen ProCoop | Destino CoopApps | Transformación | Validación de conciliación |
|---|---|---|---|
| `MORATAS` (FEDESDE, FEHASTA, TASA_CASO, TIPO, DES_MOT, COD_SER) | `interestRateTables.rates[]` (una tabla por servicio) | `TASA_CASO` → `dailyRatePct` (unidad diaria, PA-MOR-15 confirma); `TIPO` → filtro de tipo de documento | Cantidad de tramos por servicio; **reporte de superposiciones** (RN-MOR-010) que bloquea la publicación hasta resolverlas |
| `MORATAS_CATSER` | `interestRateTables.rates[].categoryIds` | Relación N:N a categorías migradas por M04 | Toda categoría referida existe |
| `TABMORA` (NOM_TAB, TIPO_FAC) | `interestIndexTables` | `TIPO_FAC` → `voucherTypeIds` | Cantidad de tablas |
| `INDICESMORA` (DIA/MES/ANO_TAB, IND_TAB, FECHA) | `interestIndexValues` | Fecha compuesta → `date`; valor Decimal128 | Sin duplicados por fecha; sin huecos en el rango usado por documentos abiertos |
| `TRAMASREC` (IMP_DES, IMP_HAS, VAL_TRAMA, TIPO, TIPOVALOR) | `dueDateSurchargeSchemes.trames[]` | `TIPOVALOR` → `perDay`/`fixed`; `TIPO` → por importe / por vencimiento | Sin rangos superpuestos por tipo de documento |
| `CONCEPTOS_INT` (COD_PRO, COD_SER, COD_IMP, TIPO) | `interestPolicies.base.conceptIds` / `taxIds` | Por servicio | Conceptos e impuestos existen en M04/M06 |
| `DESCUENTO_CAJA` | `earlyPaymentDiscountRules` | Tramos de días por tipo de documento | Advertencia si la suma por tipo supera 100 % (RN-MOR-003) |
| Parámetros V2 de §14 | `interestPolicies`, `delinquencyPolicies`, `paymentPlans`, `financing.*` | Un valor de parámetro → atributo de la política del tenant/servicio | Cada parámetro de §14 con origen V2 tiene valor migrado o "sin valor" explícito |
| `INSTANCI` (DES_INS, DIAS) | `delinquencyStages` | Flags `isCandidates/isInitial/isCut` desde #2202/#2203/#2204; `isSensitive` a confirmar (CTR-MOR-01) | Las instancias referidas por notificaciones abiertas existen |
| `CIRCULAR` (TEXTO, TDEUDA, DEUDA, ADHER, FIR_GTE, FIR_AUD, DET_SER, COD_SER, SMS, PLANTILLA) | `delinquencyNoticeModels` | Texto → plantilla con variables `dict:` (revisión manual de variables) | Cantidad de modelos; plantillas que no compilan van a bandeja |
| `CAUSAS` (DES_CAU, TIPO) | `delinquencyReasons` / `holdReasons` | Por `TIPO` | Causas referidas existen |
| `EXC_MORA` (MOTIVO, RECLAMAR, RETENER, FEC_DEUDA, VIGENCIA…) | `delinquencyExceptions` | `RECLAMAR`/`RETENER` → `noClaim`/`noInterestRetention` (CTR-MOR-22); `FEC_DEUDA` → alcance "deuda anterior a" | Vigentes en origen = vigentes en destino |
| `PLAN_CUO` (TIP_PAG, PER_CUO, CAN_CUO, MIN/MAX_CUO, INT_TEM, INT_TNA, TASA, COD_CAL, MIN_VTA, MIN_ENT…) | `paymentPlans` | `TASA` (fracción por período) → `periodRate`; `INT_TNA` informativo → `rateUnit = TNA` cuando coincide (PA-MOR-15); `COD_CAL` → método | Recalcular la cuota de un convenio vigente con el plan migrado reproduce la cuota original |
| `TIP_FIN` (DES_CAL, FOR_CAL) | Catálogo fijo de métodos (RF-MOR-173) | Mapeo por código; métodos desconocidos a bandeja | Todo plan migrado tiene método |
| `ENTFIN` | `financialInstitutions` (M14) + `financingInstitutionPlans` (CTR-DAT-43; antes `financialEntities`) | Directo | Cantidad |
| `FORMAPA` (DES_FPG, DIA_FPG) | Catálogo de plazos de pago de M07/M11 (referencia) | M08 solo lo consume | — |
| `CONEXION` (reglas de cargo de reconexión) | `interruptionChargeRules` | Migran **deshabilitadas** (`productionEnabled = false`) hasta validar admisibilidad (BASE §53) | Cantidad; ninguna habilitada |
| `INFLACIO` / `TABINFL` (índices de ajuste de planes) | `economicIndexSeries` / `economicIndexValues` de T04 (CTR-DAT-29; antes `interestIndexTables` con uso `installmentAdjustment`) | Directo | Valores por mes |
| `RESPONSA_NOTIFICA` | Destinatarios internos de alertas de M08 (T09) | Por evento | — |

### 19.2 Estado operativo

| Origen ProCoop | Destino CoopApps | Transformación | Validación de conciliación |
|---|---|---|---|
| `NOTIFICA` abiertas, procesadas recientes y En técnica (LOTE, COD_INS, DEUDA, DEUDA_AC, CALIFICA, VTO_CIR, PROMESA, RESUELTA, OBSERVA, OBSERVA2…) | `delinquencyNotices` + `delinquencyBatches` | Estados numéricos → enum (RN-MOR-053); `OBSERVA2` → eventos de bitácora `legacyNote` (texto, sin parseo) | Cantidad y deuda notificada por instancia y lote = origen |
| `NOTIFICA` históricas cerradas | `delinquencyNotices` (estado final, solo lectura) | Opcional por tenant (últimos 24 meses por defecto) | Cantidad por año |
| `COMPNOTI` (LOTE, CNT_NOT, SALDO, ID_FAC, COD_TPFC) | `delinquencyNotices.items[]` | Documento → `invoiceId` migrado por M05 | Suma de `SALDO` por notificación = `DEUDA` |
| `CIRCUCTA` | `delinquencyNoticeEvents` (`printed`) | Por cuenta y fecha | — |
| `NOTI_COOP` | `delinquencyNoticeEvents` (envíos) | Canal y fecha | — |
| `MOROSO_TEMPORAL` | — | **Descartada**: tabla temporal | — |
| `CAUBLOQ` / `HISBLOQ` | `documentHolds` (vigentes y su historial) | Causa e identificador de operación | Documentos bloqueados en origen = bloqueos activos en destino |
| `INT_DIFE` pendientes (ESTADO pendiente) y `DEUDAVTA` con `TPCUOTA = 1` | `deferredInterests` `pending` + cargo pendiente en M05 | Recibo de origen y servicio relacionado | Suma de intereses diferidos pendientes = origen |
| `REC_CON` vigentes (CAP_A_REF, INT_A_REF, INT_A_FEC, INT_X_REF, DEU_REF, PER_CUO, INT_TEM, INT_TNA…); `PPAGOS` solo los registros que T07 identifique como convenio por discriminador (CTR-DAT-52; el resto son órdenes de pago de M12/M14) | `agreements` (un solo modelo, CTR-MOR-20) | Estado derivado de cuotas: con cuotas impagas vencidas → `inArrears`; sin pendientes → `completed`; sin regla de caducidad en origen: se asigna la del plan migrado **sin aplicar caducidad retroactiva** | Capital, interés y deuda por convenio = origen |
| `IT_RECCO` (comprobantes incluidos y cuotas) y `PPITEMS` (solo por discriminador, CTR-DAT-52) | `agreementObligations` + `agreementInstallments` | Documentos de origen → sustituidos; cuotas con su capital/interés/IVA | Suma de capital de cuotas + anticipo = capital del convenio; cada documento de origen sustituido una sola vez |
| `DEUDAVTA` (cuotas de convenio/venta: FEC_VTO, CAP_CUO, INT_CUO, CAP_RES, FAC_AUT…) | `agreementInstallments` (convenios) o M11 (ventas financiadas) | Por origen del documento | Saldo de cuotas = saldo en M07 |
| `PPAGOS_FIRMANTES`, `PPAGOS_FIRMAS` (solo por discriminador, CTR-DAT-52; las firmas de órdenes de pago van a M14) | `agreements.signers[]`, `signatures[]` | Firmas como evidencia histórica `legacy` (sin hash) | Cantidad |
| `FACTURAS` (NOINTERES, `COD_FAC = 'Punitorio'`, fecha de último interés, bloqueo) | `invoices.noInterest`, `invoices.interestSettledUntil`, holds (§7.36) | `interestSettledUntil` = fecha hasta del último punitorio o recibo con interés del documento; [VERIFICAR] RN-04 §13.8 | Paralelo RF-MOR-219: ningún documento recibe dos veces el mismo período de interés |
| `SUMINISTRO`/servicios con marca de moroso, `NOFACTURAR`, fecha de baja | `serviceContracts.delinquencyFlags` (M02) + `interruptionCases` `executed` (origen `legacy`) | Un caso de interrupción `legacy` por servicio desconectado por mora (para habilitar la reconexión vinculada, ESC-MOR-22) | Servicios desconectados por mora = casos `legacy` |
| Órdenes técnicas de corte/reconexión pendientes | M10 (`workOrders`) + `interruptionCases` `scheduled` | Se revisan en el corte: las pendientes se re-evalúan con las restricciones de CoopApps antes de ejecutar | Ninguna orden migrada se ejecuta sin evaluación |

### 19.3 Conciliación del corte

Se considera aprobada la migración cuando: (1) deuda notificada por instancia = origen; (2) convenios vigentes, capital y cuotas = origen; (3) intereses diferidos pendientes = origen; (4) bloqueos activos = origen; (5) el paralelo de recargo sobre la muestra explica el 100 % de las diferencias por causa (RN-MOR-006, RN-MOR-010, redondeo, [VERIFICAR]); (6) superposiciones de tasas resueltas. El informe queda firmado por el responsable del tenant (T07).

## 20. Contraposiciones resueltas

| CTR-ID | Fuentes | Conflicto | Resolución | Regla de prevalencia |
|---|---|---|---|---|
| CTR-MOR-01 | RN-04 §11 (#2203 "sensible", #2204 "corte") vs. V2 09-parámetros (#2203 "instancia inicial", #2204 "instancia final") | El nombre oficial del parámetro y su uso en código difieren. | Se modelan como flags independientes: `isInitial`, `isCut` (nombre oficial) e `isSensitive` (uso regulatorio); la migración asigna ambos y pide confirmación. | Código relevado (RN) + parámetro oficial, a confirmar en migración |
| CTR-MOR-02 | DFA M11 (3 instancias fijas) vs. RN-04 §7 (instancias configurables) y BASE §68 | Cantidad de instancias. | Instancias configurables por política; las 3 del DFA quedan como precarga sugerida (PA-MOR-05). | BASE > DFA |
| CTR-MOR-03 | ProCoop (corte directo al procesar tratamiento) vs. BASE §14, §68, §86–91 | ProCoop emite la orden sin verificar restricciones normativas ni evidencia. | Toda interrupción pasa por evaluación, restricciones, evidencia, aprobación y ventana (RN-MOR-081). | BASE > RN |
| CTR-MOR-04 | ProCoop (cargo de reconexión automático, `CONEXION`) vs. BASE §52.3/§53 | BASE exige costo habilitado, respaldado y aprobado. | Reglas migran deshabilitadas; gratuidad por defecto (PA-MOR-12). | BASE > RN |
| CTR-MOR-05 | ProCoop (#295/#296 costo de notificación) vs. BASE §52.2 | Cobrar el envío de avisos puede no ser admisible. | Deshabilitado por defecto; habilitable con respaldo (PA-MOR-12). | BASE > RN |
| CTR-MOR-06 | ProCoop (reconecta y marca conectado al cobrar) vs. BASE §53 ("solo con ejecución confirmada") | Cambio de estado por presunción. | El estado cambia solo con confirmación de M10/T06 (RN-MOR-102). | BASE > RN |
| CTR-MOR-07 | ProCoop (sin caducidad de convenios) vs. DFA M12 y AGR-014 | Falta regla de caída. | Caducidad configurable por plan (RN-MOR-123, PA-MOR-13). | AGR > DFA > RN |
| CTR-MOR-08 | ProCoop (anulación con borrado de `REC_CON`/`IT_RECCO`) vs. convención de no borrar (AGR-003, BASE §54) | Pérdida de historia. | Anulación lógica (RN-MOR-121). | AGR/BASE > RN |
| CTR-MOR-09 | ProCoop "Restablecer" (borra todas las notificaciones) vs. auditoría BASE §54 | Borrado masivo. | Descartado; solo anulación de lote o eliminación lógica con motivo (RN-MOR-067, -068). | BASE > RN |
| CTR-MOR-10 | ProCoop `OBSERVA2` (string concatenado) vs. AGR-003 (bitácora estructurada) | Formato de bitácora. | Bitácora estructurada (RN-MOR-066); el histórico migra como `legacyNote`. | AGR > RN |
| CTR-MOR-11 | RN-04 (#2907 "cerrar orden sin comprobante") vs. 09-parámetros (descripción oficial "permitir cerrar órdenes sin generar comprobantes por reconexión") | Descripción. | Se adopta la descripción oficial y se pide confirmación al migrar (PRM-MOR-135). | Parámetro oficial |
| CTR-MOR-12 | RN-04 (#2713 "OT de alta", #3147 "VTO2") vs. V2 ("confirmar OT de reconexión", "primer vencimiento") | Semántica de la deuda para reconectar y de la OT. | #2713 = confirmar la OT de reconexión; #3147 se modela con criterios explícitos `allDebt`/`overdueVto2`/`overdueLastVto` (PRM-MOR-124, PA-MOR-11). | Código relevado + confirmación |
| CTR-MOR-13 | ProCoop CAU (3 % fijo sobre comprobantes 96/97 en código) vs. AGR-011 (configurable y explicable) | Valor hardcodeado. | Variante "solo sobre cargos" con tasa y tipos parametrizados (PRM-MOR-056). | AGR > RN |
| CTR-MOR-14 | BASE MER-019 ("ND diferida") vs. RN-04 §4.4 (diferimiento como cuota pendiente en la próxima factura) | Forma del diferimiento. | Diferimiento como cargo pendiente que M05 incorpora; el tipo de documento sigue la política (PA-MOR-04). | BASE (resultado) + RN (mecánica) |
| CTR-MOR-15 | BASE §97.3 (recargo cobrado en documento posterior) vs. ProCoop (TOTAL2..4 impresos en la factura) | Aparente conflicto. | No es conflicto: los TOTALk se informan en la factura y el recargo efectivamente cobrado se documenta al cobrar (RF-MOR-020). | BASE |
| CTR-MOR-16 | ProCoop (`MORATAS` generales superpuestas suman) vs. AGR-011 | Doble interés. | Validación de no superposición al publicar (RN-MOR-010). | AGR > RN |
| CTR-MOR-17 | ProCoop (numeración de lotes y convenios en memoria) vs. DEC-003/AGR-011 | Concurrencia. | Numeración atómica por tenant (contador transaccional). | DEC > RN |
| CTR-MOR-18 | V2 #2158 (prescripción con asiento contable) vs. MER-006 ("sin borrar") | Efecto sobre la deuda. | La prescripción cambia el estado y genera asiento en M15; el documento conserva su saldo histórico. | BASE |
| CTR-MOR-19 | BASE §68 (pedido "afectar todos los servicios") vs. BASE §68 control y §86–91 | Afectación cruzada. | Deshabilitada por defecto; solo con elegibilidad de cada servicio validada (PA-MOR-08). | BASE (control) |
| CTR-MOR-20 | ProCoop `PPAGOS` (planes de pago de caja) vs. `REC_CON` (convenios) | Dos modelos para lo mismo. | Unificados en `agreements` con `origin`. **Precisado por CTR-DAT-52:** `PPAGOS` son órdenes de pago a proveedores (M12/M14); solo entran a `agreements` los registros que T07 identifique como convenio por discriminador. | AGR-014; CTR-DAT-52 |
| CTR-MOR-21 | ProCoop (interés directo sobre capital antes de la quita) vs. resto de los métodos | Inconsistencia de base. | La base es siempre el capital neto de quita (RN-MOR-106). | AGR-011 |
| CTR-MOR-22 | `EXC_MORA.RECLAMAR`/`RETENER` (RN-04 vs. uso en prepago) | Semántica ambigua. | Se separan `noClaim` (no gestiona mora) y `noInterestRetention` (no retiene interés en prepago); se confirman al migrar. | Código relevado + confirmación |
| CTR-MOR-23 | Nombres de este anexo vs. T05 §7.2 y §20 (CTR-DAT-07, 14, 29, 30, 37, 43, 52) | Nombres de campos y colecciones distintos del modelo canónico. | Renombrados: `serviceContractId` → `contractId`, `documentTypeId(s)` → `voucherTypeId(s)`, `fileId` → `storedFileId` (y `documentFileId` → `documentStoredFileId` en `agreements`), `workflowId` → `workflowInstanceId`, `accountingAccountRef` → `ledgerAccountId`, `legacyRef` → `legacy`; `collectionAgencies` → `debtCollectionAgencies` (§7.31); `financialEntities` → `financialInstitutions` de M14 + `financingInstitutionPlans` (§7.24); índices de ajuste → `economicIndexSeries` de T04 (§7.3); `dueDateSurchargeSchemes` ya era canónico; `PPAGOS` precisado (CTR-MOR-20). | T05 > anexo |
| CTR-MOR-24 | RF-MOR-089 y RN-MOR-055 ("aviso telefónico" como canal) vs. T09 RF-COM-148 (`ivr_export`), T06 FI-INT-66 y FIC 13.4 (ProCoop solo exporta archivos para discadores) | El canal de mora no decía cómo se hace la llamada y los anexos trataban el IVR de forma distinta. | El aviso telefónico (`phoneCall`) se sirve por la exportación `ivr_export` de T09 o por la conexión opcional FI-INT-66 con un discador o IVR externo; sin canal de voz propio. | DEC-104 |

## 21. Preguntas abiertas

### PA-MOR-01 — Interés simple o compuesto
- **Pregunta:** ¿El interés por mora se calcula como interés simple diario o admite capitalización?
- **Contexto:** ProCoop usa interés simple (tasa diaria × días) y evita el interés sobre interés (RN-04 §12.2). AGR-011 exige que el cálculo sea explicable. Algunas tablas de índices implican capitalización de hecho.
- **Opciones:**
  - A) Interés simple diario para todos los métodos, sin interés sobre interés **(Recomendada)**: es compatible con ProCoop y fácil de explicar en la factura.
  - B) Simple por defecto y compuesto habilitable por política: más flexible, pero exige una explicación adicional al socio y validación legal.
  - C) Compuesto mensual: diferencias con el histórico y riesgo de reclamo.
- **Impacto si no se responde:** se asume A; `compounding = simple` no editable.
- **Bloquea:** RF-MOR-007, RN-MOR-016, PRM-MOR-013 (O5).

### PA-MOR-02 — Significado del mínimo de recargo (#609)
- **Pregunta:** Cuando el recargo calculado es menor que el mínimo, ¿se cobra 0 o se cobra el mínimo?
- **Contexto:** En ProCoop, un recargo menor que el mínimo vale 0 (RN-04 §13.3). El nombre del parámetro sugiere un piso.
- **Opciones:**
  - A) Ofrecer los dos modos, con "umbral de exención" (se cobra 0) por defecto **(Recomendada)**: mantiene el comportamiento actual y permite el piso.
  - B) Solo umbral de exención.
  - C) Solo piso: cambia los importes cobrados respecto de ProCoop.
- **Impacto si no se responde:** se asume A con modo `exemptBelow`.
- **Bloquea:** RF-MOR-027, RN-MOR-013, PRM-MOR-031/032 (O5).

### PA-MOR-03 — Tramas en cascada e IVA del importe fijo
- **Pregunta:** En el recargo entre vencimientos por porcentaje o trama, ¿VTO3 y VTO4 aplican el recargo sobre el importe anterior (cascada) o sobre el TOTAL1? ¿Y el importe fijo lleva IVA?
- **Contexto:** `Tramas_Importe` aplica la trama dos o tres veces con días acumulados, y `Fijo_Pesos` no calcula IVA (RN-04 §3.3, §13.13).
- **Opciones:**
  - A) Modo simple (sobre TOTAL1) por defecto, cascada como opción explícita, e IVA según el concepto también en el importe fijo **(Recomendada)**: es transparente y fiscalmente consistente.
  - B) Replicar la cascada y el importe fijo sin IVA: coincide con lo que hoy se imprime, pero mantiene el problema fiscal.
  - C) Solo modo simple.
- **Impacto si no se responde:** se asume A; la migración marca los esquemas en cascada.
- **Bloquea:** RN-MOR-031, RN-MOR-032, RF-MOR-011 (O4).

### PA-MOR-04 — Documento y momento de facturación del interés
- **Pregunta:** ¿El interés cobrado se documenta con nota de débito asociada o con factura? ¿Se difiere a la próxima factura por defecto?
- **Contexto:** El parámetro #273 permite elegir factura o ND; el #1011 define el diferimiento; MER-019 habla de "ND diferida" (CTR-MOR-14).
- **Opciones:**
  - A) ND asociada al documento de origen, sin diferir por defecto, y diferimiento configurable por servicio y ente **(Recomendada)**: es trazable y sigue el uso más común.
  - B) Factura por defecto.
  - C) Diferir siempre a la próxima factura: reduce documentos, pero demora la registración.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-MOR-041–048, RF-MOR-043, PRM-MOR-050/051 (O5).

### PA-MOR-05 — Instancias por defecto del piloto Internet
- **Pregunta:** ¿Qué instancias y plazos se precargan para el piloto Internet?
- **Contexto:** El DFA define 3 instancias (CTR-MOR-02); BASE §86 y §53 exigen preaviso y una suspensión antes de la baja.
- **Opciones:**
  - A) Candidato → Aviso → Intimación con preaviso (evidencia exigida) → Suspensión → Baja por mora **(Recomendada)**: es gradual y cumple el preaviso.
  - B) Las 3 instancias del DFA (Candidatos, 1ª, 2ª), con corte en la 2ª.
  - C) Definirlas con cada cooperativa, sin precarga.
- **Impacto si no se responde:** se asume A como precarga editable.
- **Bloquea:** RF-MOR-075–082, CU-MOR-03, §18 (O6).

### PA-MOR-06 — Preaviso y constancia exigidos por servicio
- **Pregunta:** ¿Qué preaviso mínimo y qué tipo de constancia se exigen antes de suspender, por servicio y jurisdicción?
- **Contexto:** AGR-024 pide evidencia de entrega; la normativa por servicio (Internet, electricidad ERSeP, agua) no está relevada con precisión.
- **Opciones:**
  - A) Preaviso mínimo configurable como restricción `normative` y evidencia digital aceptada (acuse del proveedor, lectura, OTP), a validar legalmente por servicio **(Recomendada)**.
  - B) Solo constancia física (carta documento o firma).
  - C) Sin constancia obligatoria: no recomendable.
- **Impacto si no se responde:** se asume A con 10 días ilustrativos y bloqueo sin evidencia.
- **Bloquea:** RF-MOR-120, RN-MOR-082, PRM-MOR-091/113 (O6).

### PA-MOR-07 — Protecciones (electrodependientes, entidades públicas, salud, educación)
- **Pregunta:** ¿Qué protecciones bloquean la suspensión y cuáles solo requieren revisión?
- **Contexto:** BASE §87 protege a los electrodependientes; las entidades públicas y los servicios esenciales para salud o educación no tienen regla relevada.
- **Opciones:**
  - A) Bloqueo duro para las protecciones normativas acreditadas, y revisión con aprobación para entidades públicas, salud y educación **(Recomendada)**.
  - B) Bloqueo duro para todas.
  - C) Solo electrodependientes.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-MOR-111, RF-MOR-112, RN-MOR-084 (O6).

### PA-MOR-08 — Afectación cruzada en cuenta unificada
- **Pregunta:** ¿La deuda de un servicio puede habilitar la suspensión de otro servicio de la misma cuenta unificada?
- **Contexto:** BASE §68 recibió el pedido de "afectar todos", pero lo condiciona a que cada servicio sea elegible (CTR-MOR-19).
- **Opciones:**
  - A) Deshabilitada; cada servicio se evalúa solo con su propia deuda **(Recomendada)**.
  - B) Habilitable por par de servicios, con validación jurídica y aprobación.
  - C) Habilitada por defecto: contraria al control de BASE.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-MOR-069, PRM-MOR-117 (O6).

### PA-MOR-09 — Significado del pago mínimo
- **Pregunta:** ¿Qué efecto tiene alcanzar el pago mínimo definido por la política?
- **Contexto:** BASE §68 CTA-002 menciona un pago mínimo sin definir su efecto.
- **Opciones:**
  - A) Solo evita la suspensión del período; la deuda restante sigue en mora con interés **(Recomendada)**.
  - B) Además detiene el avance de las instancias.
  - C) Equivale a regularizar (cierra la notificación).
- **Impacto si no se responde:** se asume A, deshabilitado por defecto.
- **Bloquea:** RF-MOR-067, PRM-MOR-118 (O6).

### PA-MOR-10 — Ventanas de ejecución de suspensiones
- **Pregunta:** ¿En qué días y horarios se pueden ejecutar suspensiones por mora?
- **Contexto:** La práctica regulatoria suele restringir los cortes en viernes, vísperas de feriado y feriados; no está relevado por servicio.
- **Opciones:**
  - A) Solo días hábiles, sin viernes, vísperas ni feriados, en horario restringido configurable, a validar por servicio **(Recomendada)**.
  - B) Días hábiles sin más restricción.
  - C) Sin restricción.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-MOR-119, JOB-MOR-18 (O6).
- **Avance (HUE-ELE-05):** la opción A se concreta para electricidad en Córdoba como plantilla de plataforma ERSeP (RF-MOR-221, RN-MOR-145, PRM-MOR-206), precargada como `toValidate` hasta su validación legal.

### PA-MOR-11 — Criterio de deuda para reconectar
- **Pregunta:** ¿Qué deuda debe estar cancelada para reconectar automáticamente?
- **Contexto:** ProCoop ofrece toda la deuda, la vencida al VTO2 y la vencida al último vencimiento (#3147, CTR-MOR-12).
- **Opciones:**
  - A) La deuda vencida exigible del servicio afectado (al último vencimiento), con pago confirmado **(Recomendada)**.
  - B) Toda la deuda de la cuenta.
  - C) Solo la deuda que motivó el caso.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-MOR-122, PRM-MOR-124/125 (O6).

### PA-MOR-12 — Cargos admisibles por mora e interrupción
- **Pregunta:** ¿Se habilitan gastos administrativos, costo de notificación y cargo de reconexión? ¿Con qué respaldo?
- **Contexto:** BASE §52.2, §52.3 y §53 exigen fundamento; ProCoop los cobra automáticamente (CTR-MOR-04, CTR-MOR-05).
- **Opciones:**
  - A) Deshabilitados o gratuitos por defecto; habilitables por servicio con respaldo documentado y aprobación **(Recomendada)**.
  - B) Habilitar el cargo de reconexión por defecto y los demás deshabilitados.
  - C) Replicar ProCoop.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-MOR-028, RF-MOR-087, RF-MOR-126, PRM-MOR-033/085/131/141 (O6).

### PA-MOR-13 — Caducidad del convenio
- **Pregunta:** ¿Cuándo cae un convenio y qué efectos tiene la caída?
- **Contexto:** ProCoop no tiene caducidad (CTR-MOR-07); AGR-014 pide definirla.
- **Opciones:**
  - A) Cae con 3 cuotas impagas o 60 días de atraso, con aviso previo; el saldo de capital es exigible; no revive la deuda original; se pierden las quitas proporcionales **(Recomendada)**.
  - B) Cae con 2 cuotas impagas y revive la deuda original con sus intereses.
  - C) Sin caducidad automática; la decide un supervisor.
- **Impacto si no se responde:** se asume A, configurable por plan.
- **Bloquea:** RF-MOR-156, RN-MOR-123, PRM-MOR-170/171 (O6).

### PA-MOR-14 — Variantes del proceso masivo de intereses
- **Pregunta:** ¿Se mantienen las variantes estándar, CAU, cheques y AL del proceso masivo?
- **Contexto:** Son variantes por cooperativa (RN-04 §5.4, dudas 6 y 7), con valores hardcodeados.
- **Opciones:**
  - A) Unificarlas como opciones parametrizadas de una sola corrida (estándar, valores, solo cargos), sin valores fijos **(Recomendada)**.
  - B) Replicar las cuatro variantes.
  - C) Solo la estándar.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-MOR-053, RF-MOR-054, PRM-MOR-055/056 (O6).

### PA-MOR-15 — Unidad de la tasa y CFT
- **Pregunta:** ¿En qué unidad se carga la tasa de los planes y qué se muestra al socio?
- **Contexto:** `PLAN_CUO.TASA` se usa como fracción por período, y `INT_TEM`/`INT_TNA` son informativas (RN-04 §13.15). La información al consumidor exige CFT.
- **Opciones:**
  - A) Cargar la TNA, derivar la tasa por período y mostrar CFT y TEA en el simulador y el convenio, con validación legal de la información al consumidor **(Recomendada)**.
  - B) Cargar la tasa por período (como ProCoop) y calcular la TNA.
  - C) Sin CFT.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-MOR-172, RN-MOR-125 (O6).

### PA-MOR-16 — Firma del convenio
- **Pregunta:** ¿Qué mecanismos de firma se aceptan para los convenios?
- **Contexto:** ProCoop guarda firmas en `PPAGOS_FIRMAS`; la PWA permite aceptación remota.
- **Opciones:**
  - A) Aceptación electrónica con OTP, evidencia y hash del documento, más firma presencial en tableta; firma digital con certificado como extensión **(Recomendada)**.
  - B) Solo firma presencial.
  - C) Firma digital obligatoria.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-MOR-154, RF-MOR-209 (O6).

### PA-MOR-17 — Incobrables
- **Pregunta:** ¿Cómo se tratan los incobrables?
- **Contexto:** MER-006 pide no borrar la deuda; no hay criterio de previsión relevado.
- **Opciones:**
  - A) Previsión por antigüedad y castigo con doble aprobación, sin borrar la deuda **(Recomendada)**.
  - B) Solo castigo manual.
  - C) Sin incobrables: la deuda queda abierta indefinidamente.
- **Impacto si no se responde:** se asume A con criterios ilustrativos.
- **Bloquea:** RF-MOR-188, PRM-MOR-182/183 (O6).

### PA-MOR-18 — Gastos y honorarios judiciales
- **Pregunta:** ¿Se trasladan al deudor los gastos y honorarios de la gestión externa o judicial?
- **Contexto:** MER-006; su procedencia depende de un título.
- **Opciones:**
  - A) Solo con título (sentencia o convenio firmado); en otro caso, a cargo de la cooperativa **(Recomendada)**.
  - B) Trasladar siempre un porcentaje.
  - C) Nunca trasladar.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-MOR-186, RN-MOR-134, PRM-MOR-181 (O6).

### PA-MOR-19 — Garantías y depósitos
- **Pregunta:** ¿Se exigen garantías o depósitos en garantía? ¿En qué servicios?
- **Contexto:** MER-005; la exigencia puede ser restrictiva para servicios esenciales.
- **Opciones:**
  - A) Habilitable por servicio y categoría, deshabilitada por defecto **(Recomendada)**.
  - B) Exigida por defecto en los servicios no esenciales.
  - C) No soportar garantías.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-MOR-177–182, RF-MOR-178, PRM-MOR-180 (O6/O8).

### PA-MOR-20 — Plazos de prescripción
- **Pregunta:** ¿Qué plazos de prescripción se aplican por tipo de obligación?
- **Contexto:** #104 es un único plazo en meses; el CCyC (art. 2562 inc. c) fija 2 años para prestaciones periódicas, a validar por servicio.
- **Opciones:**
  - A) Plazos configurables por tipo de obligación con aprobación, sin default productivo, sugiriendo 2 años para las periódicas, a validar **(Recomendada)**.
  - B) Un plazo único por tenant (como ProCoop).
  - C) Sin prescripción automática.
- **Impacto si no se responde:** se asume A; no se ejecutan corridas sin plazo cargado.
- **Bloquea:** RF-MOR-193, RN-MOR-136, PRM-MOR-184 (O6).
- **Estado:** Respondida (DEC-052): 24 meses para facturas periódicas de servicios y 60 meses para el resto, editables y con validación legal previa.

### PA-MOR-21 — Anexo dueño de CU-CIC-01
- **Pregunta:** ¿Qué anexo define CU-CIC-01 (suspensión temporal y reactivación, BASE §53)?
- **Contexto:** CU-CIC-01 aparece en M02 (cambio de estado del contrato), M08, M09 (tramo de atención) y M19 (portal) con flujos distintos. PA-CAT-20 de M02 proponía M09; la pasada de cierre (pendiente 5) recomienda M08, porque el caso de suspensión y reactivación, sus estados y la confirmación técnica están en este anexo (§8.7; RF-MOR-131–140, 211).
- **Opciones:**
  - A) M08 es dueño; M02, M09 y M19 citan su parte **(Recomendada)**.
  - B) M02 es dueño (ciclo de vida del contrato).
  - C) M09 es dueño (trámite).
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §16 de M08, M02, M09 y M19; PA-CAT-20 de M02; 04-matriz.
- **Estado:** Asumida (DEC-072): opción A. Para este CU reemplaza la opción A de PA-CAT-20 (que decía M09). M02 y M09 citan la definición de §16; M19 debe citarla.

### PA-MOR-22 — Residuales de los entregables: referencias, nombres canónicos, estados y alias (5-11-2026)
- **Pregunta**: ¿Qué destino tienen las referencias que los entregables marcaron sin colección en M08 (§7.38), qué nombres se adoptan (`delinquencyBatchId`, `holdReasonId`), qué campos de T05 se incorporan (`personSensitiveDataId`, `signatureRequestId`, `code`), qué valores y transiciones tienen `interestIndexTables`, `debtCollectionAgencies`, `interestBillingRunItems` y las garantías, y cómo se nombran el evento `int.network.provisioning-result` y el comando de OT que M08 pide a M10?
- **Contexto**: residuales de `docs/entregables-analisis-diseno/03-er/M08-MOR-mora-financiacion.md` §7, de `06a-indice-cobertura-secuencias-estados.md` §7 (INC-06-01, 02, 03, 08, 11) y de `_trabajo/correccion-inconsistencias-pendientes-cierre.md` (`delinquencyNotices.batchId`).
- **Opciones**: A) **(Recomendada)** Destinos de §7.38 (T05 §7.2.1 cuando existe; `configVersions` de T04 para la versión publicada; `billingCycles` para los ciclos; `billableItems` para los pedidos de cargo), campos de T05 incorporados, máquinas de §8.15, evento `int.network.provisioningResult` (regla de guiones a camelCase; alias `int.network.provisioning-result`) y comando `tec.workOrder.request` (el que emite M09). B) Mantener `[VERIFICAR]` y los nombres anteriores.
- **Impacto si no se responde**: A.
- **Bloquea**: diagrama ER y diagramas de estados de M08; T05 COL-MOR-02, 13, 19, 20, 21, 24, 26, 29 y §7.2.1; alias de T11 §12.4.
- **Estado**: Asumida (DEC-072): opción A. Aplicado en §7.37 (filas corregidas con "antes"), §7.17, §7.18, §7.26, §7.38, §8.15, §9 y §12. T05 debe reflejar las equivalencias de §7.38 (subcampos `scope.*`, `origin.noticeId`, `execution.*`; `policyId`/`validFrom` de COL-MOR-02; `financialInstitutionId` en COL-MOR-27) y en §7.2.1 `planSnapshot`, `noticeModelVersion`, `policyVersion`, `rates[].rateId` y `adminFee.*` como "no es referencia". T11 debe registrar el alias `int.network.provisioning-result` → `int.network.provisioningResult` en §12.4. Se adopta además el nombre canónico `billableItemId` (antes `pendingChargeId`) de T05 §7.2.1 en `deferredInterests` y `agreementInstallments`, y se cierran las referencias restantes de §7.37 con los destinos de T05 §7.2.1 (`interestIndexTables`, `masterImportJobs`, `jobRuns`, `interruptionCases`).


## 22. Trazabilidad de fuentes

### 22.1 RN-04 `04-mora-intereses-y-corte.md`

| Sección fuente | Dónde quedó en M08 |
|---|---|
| §1 Mapa general | §2.1, RF-MOR-001, RN-MOR-001 |
| §2 Modelo de datos involucrado | §7 (colecciones), §7.36, §19 |
| §3.1 Cálculo de `TOTAL2..TOTAL4` | RF-MOR-011, -012, RN-MOR-028–030, ESC-MOR-02 |
| §3.2 Qué pasa con ese recargo al cobrar | RF-MOR-017, -020, RN-MOR-004, CTR-MOR-15 |
| §3.3 Detalle de cada variante | RF-MOR-013, -014, RN-MOR-031–036, PA-MOR-03 |
| §4.1 Variables de cálculo | RF-MOR-032, -033, RN-MOR-011, -018, PRM-MOR-040–042, -194 |
| §4.2 Habilitación del interés por factura | RF-MOR-030, RN-MOR-002, ESC-MOR-10 |
| §4.3 Algoritmo `Get_Recargo` | RF-MOR-021–031, RN-MOR-003–015, ESC-MOR-01, -03–08 |
| §4.4 Diferimiento del interés | RF-MOR-041–048, RN-MOR-037–039, `deferredInterests`, CTR-MOR-14 |
| §4.5 Validaciones de carga de tasas y descuentos | RN-MOR-003, -010, RF-MOR-013, CTR-MOR-16 |
| §5.1 Filtros y variantes | RF-MOR-049–053, PRM-MOR-055, PA-MOR-14 |
| §5.2 Selección de facturas | RN-MOR-041 |
| §5.3 Variante estándar | RN-MOR-042 |
| §5.4 Variante CAU | RN-MOR-044, PRM-MOR-056, CTR-MOR-13 |
| §5.5 Generación de comprobantes de interés | RN-MOR-046, -047, JOB-MOR-01 |
| §5.6 Precisiones | RN-MOR-043, -045, RF-MOR-054–058 |
| §6 Otros puntos de interés y bloqueo | RF-MOR-036–038, -059–064, RN-MOR-022, -040, -048–052, PRM-MOR-060–062 |
| §7.1 Estados y enums | §8.6, RN-MOR-053–056; aviso telefónico por T09 `ivr_export` / T06 FI-INT-66 (DEC-104, CTR-MOR-24) |
| §7.2 Selección de candidatos | RF-MOR-075–082, RN-MOR-057–060, PRM-MOR-080–084 |
| §7.3 Avance de instancias | RF-MOR-083–098, RN-MOR-061–069, -074, JOB-MOR-04, REP-MOR-25 |
| §7.4 Tratamiento de morosos: corte | RF-MOR-099–108, -117–121, RN-MOR-077–081, -089, -090, CTR-MOR-03 |
| §7.5 Reconexión | RF-MOR-122–130, RN-MOR-091–098, JOB-MOR-07, CTR-MOR-06, -12 |
| §7.6 Consultas, canales y órdenes de trabajo | RF-MOR-083, -205, -206, -215, RN-MOR-070–073, -075, -076 |
| §8.1 Planes | RF-MOR-171–173, `paymentPlans`, PAN-MOR-29 |
| §8.2 Armado de cuotas | RF-MOR-142–144, RN-MOR-113 |
| §8.3 Registro del convenio | RF-MOR-145–148, RN-MOR-114, -115, CTR-MOR-17 |
| §8.4 Datos del plan | RF-MOR-163, -172, PA-MOR-15 |
| §8.5 Fórmulas de amortización | RF-MOR-143, RN-MOR-105, -106, ESC-MOR-31, -32, CTR-MOR-21 |
| §8.6 Entrega, quitas, IVA y sellado | RF-MOR-150, -164–166, RN-MOR-107–112, PRM-MOR-154–156 |
| §8.7 Refinanciación | RF-MOR-158, RN-MOR-116 |
| §8.8 Ajustes de cuota al facturarla | RF-MOR-161, RN-MOR-119, -120, PRM-MOR-166–168, -190, -191 |
| §8.9 Validaciones y parámetros de financiación | RF-MOR-151, RN-MOR-118, PRM-MOR-157–179 |
| §8.10 Anulación de convenios | RF-MOR-160, RN-MOR-121, CTR-MOR-08 |
| §8.11 Recalcular cuotas por situación fiscal | RF-MOR-162, RN-MOR-122, JOB-MOR-12 |
| §8.12 Consultas e informes de financiación | RF-MOR-169, -201, RN-MOR-130, -131, REP-MOR-17–20 |
| §8.13 Caída o caducidad del plan | RF-MOR-156, -157, RN-MOR-123, PA-MOR-13, CTR-MOR-07 |
| §9 Prescripción de deuda | RF-MOR-193–197, RN-MOR-136, PA-MOR-20, CTR-MOR-18 |
| §10 Informes de mora | RF-MOR-198–203, REP-MOR-01–10, -25, -26 |
| §11 Tabla de parámetros | §14 completo (ver 22.4) |
| §12 Implicancias 1–10 | 1 → RN-MOR-001; 2 → RN-MOR-007–009, PA-MOR-01; 3 → RF-MOR-041–048; 4 → RF-MOR-032; 5 → §8.6, RN-MOR-066; 6 → RF-MOR-109, CTR-MOR-22; 7 → RF-MOR-117–130, RN-MOR-082–088; 8 → RF-MOR-141–170; 9 → CTR-MOR-09, -13, PA-MOR-02, -03; 10 → §19 |
| §13 Dudas 1–18 | 1 → §10 (pantallas rediseñadas) y [VERIFICAR] en PRM-MOR-036, -046, -060, -110, -122, -123; 2 → RN-MOR-006, ESC-MOR-06; 3 → PA-MOR-02; 4 → RN-MOR-008; 5 → PA-MOR-15, §19.1; 6–7 → PA-MOR-14; 8 → RN-MOR-047, §19.2 (`interestSettledUntil`); 9 → RN-MOR-092, ESC-MOR-22; 10 → RF-MOR-126, PA-MOR-12; 11 → PA-MOR-05; 12 → PA-MOR-20; 13 → PA-MOR-03; 14 → RN-MOR-010; 15 → PA-MOR-15; 16 → RN-MOR-106; 17 → PA-MOR-13; 18 → RN-MOR-121 |
| §14 Revisión de métodos | Consultas e informes → REP-MOR-01–20; `clsSCotiz.GetDetalles_PlanillAdjudicacion` → Descartado: pertenece a Compras, fuera de alcance de M08; ABM no descompilados → PAN-MOR-03, -06, -11, -23, -29 |

### 22.2 CAT §8 Mora y notificaciones

| Tabla | Destino |
|---|---|
| `CAUSAS` | `delinquencyReasons`, `holdReasons`, PAN-MOR-26, §19.1 |
| `CIRCUCTA` | `delinquencyNoticeEvents`, §19.2 |
| `CIRCULAR` | `delinquencyNoticeModels`, PAN-MOR-12, §19.1 |
| `COMPNOTI` | `delinquencyNotices.items[]`, §19.2 |
| `CONCEPTOS_INT` | `interestPolicies.base`, PRM-MOR-028, §19.1 |
| `EXC_MORA` | `delinquencyExceptions`, PAN-MOR-23, CTR-MOR-22, §19.1 |
| `INDICESMORA` | `interestIndexValues`, RN-MOR-008, §19.1 |
| `INSTANCI` | `delinquencyStages`, PAN-MOR-11, CTR-MOR-01, §19.1 |
| `INT_DIFE` | `deferredInterests`, §19.2 |
| `IT_PAGSO_INTERES` | `interestCalculations` (parámetros aplicados), §7.6 |
| `IT_PAGSO_INTERES_TRAMAS` | `interestCalculations.segments[]`, §7.6 |
| `MORATAS` | `interestRateTables.rates[]`, RN-MOR-009, -010, §19.1 |
| `MORATAS_CATSER` | `interestRateTables.rates[].categoryIds`, §19.1 |
| `MOROSO_TEMPORAL` | Descartado: tabla temporal (§19.2) |
| `NOTIFICA` | `delinquencyNotices`, `delinquencyBatches`, §19.2 |
| `TABMORA` | `interestIndexTables`, §19.1 |
| `TRAMASREC` | `dueDateSurchargeSchemes.trames[]`, RF-MOR-013, §19.1 |

### 22.3 CAT §9 Financiación y convenios y tablas relacionadas

| Tabla | Destino |
|---|---|
| `DEUDAVTA` | `agreementInstallments`, `deferredInterests` (`TPCUOTA = 1`), M11 para ventas, §19.2 |
| `FORMAPA` | Catálogo de M07/M11 (referencia), §19.1 |
| `IT_RECCO` | `agreementObligations`, `agreementInstallments`, §19.2 |
| `PLAN_CUO` | `paymentPlans`, PAN-MOR-29, §19.1 |
| `REC_CON` | `agreements`, CTR-MOR-20, §19.2 |
| `TIP_FIN` | Catálogo de métodos (RF-MOR-173), §19.1 |
| `PPAGOS`, `PPITEMS` | `paymentOrders` (M12) / `paymentExecutions` (M14); a `agreements`, `agreementObligations` solo por discriminador de T07 (CTR-DAT-52, CTR-MOR-20) |
| `PPAGOS_FIRMANTES`, `PPAGOS_FIRMAS` | M14 (firmas de órdenes de pago); `agreements.signers[]`, `signatures[]` solo por discriminador (CTR-DAT-52), PA-MOR-16 |
| `ENTFIN` | `financialInstitutions` (M14), `financingInstitutionPlans` (CTR-DAT-43), PAN-MOR-32 |
| `DESCUENTO_CAJA` | `earlyPaymentDiscountRules`, PAN-MOR-06 |
| `CAUBLOQ`, `HISBLOQ` | `documentHolds`, PAN-MOR-09 |
| `CONEXION` | `interruptionChargeRules`, PAN-MOR-28, CTR-MOR-04 |
| `INFLACIO`, `TABINFL` | `economicIndexSeries`/`economicIndexValues` de T04 (ajuste de cuotas; CTR-DAT-29) |
| `RESPONSA_NOTIFICA` | Destinatarios de alertas (T09) |
| `NOTI_COOP` | `delinquencyNoticeEvents` |
| Campos de `FACTURAS` (`NOINTERES`, punitorio, bloqueo) | §7.36, §19.2 |

### 22.4 Parámetros V2

Cada número V2 citado por RN-04 y por los grupos GESTION_DE_MORA y FINANCIACIONES, y los de COBRANZA de recargos, notificados, bloqueos y reconexión, tiene su PRM:

#39 → PRM-MOR-080 · #53 → -093 · #63 → -146 · #74 → -001 · #104 → -184 · #187 → -077 · #214 → -175 · #273 → -051 · #295 → -085 · #296 → -089 · #299 → -024 · #302 → -074 · #306 → -157 · #307 → -041 · #308 → -156 · #310 → -152 · #311 → -153 · #321 → -070 · #324 → -071 · #339 → -039 · #372 → -033 · #375 → -073 · #384 → -081 · #388 → -138 · #462 → -072 · #486 → -048 · #487 → -049 · #507 → -174 · #578 → -002 · #600 → -010 · #606 → -040 · #607 → -150 · #608 → -034 · #609 → -031 · #621 → -026 · #625 → -022 · #671 → -159 · #672 → -162 · #673 → -164 · #674 → -160 · #675 → -161 · #676 → -155 · #713 → -047 · #718 → -195 · #719 → -196 · #733 → -192 · #735 → -165 · #757 → -169 · #1002 → -020 · #1008 → -057 · #1011 → -050 · #1030 → -179 · #1056 → -052 · #2069 → -197 · #2070 → -198 · #2078 → -043 · #2080 → -042 · #2086 → -194 · #2089 → -151 · #2109 → -193 · #2158 → -185 · #2202 → -084 · #2203 → -095, -097 · #2204 → -096, -097 · #2205 → -086 · #2206 → -087 · #2208 → -163 · #2249 → -053 · #2252 → -176 · #2279 → -088 · #2283 → -003 · #2289 → -190 · #2292 → -055 · #2299 → -158 · #2300 → -027 · #2301 → -137 · #2304 → -090 · #2305 → -100 · #2306 → -101 · #2322 → -099 · #2327 → -094 · #2328 → -102 · #2330 → -149 · #2356 → -029 · #2359 → -098 · #2363 → -025 · #2379 → -111 · #2385 → -035 · #2411 → -076 · #2420 → -144 · #2440 → -120 · #2453 → -075 · #2458 → -110 · #2467 → -082 · #2471 → -177 · #2483 → -132 · #2485 → -133 · #2487 → -036 · #2512 → -191 · #2531 → -121 · #2562 → -044 · #2566 → -045 · #2586 → -078 · #2596 → -078 · #2607 → -167 · #2624 → -168 · #2634 → -178 · #2661 → -134 · #2694 → -112 · #2707 → -128 · #2713 → -130 · #2770 → -060 · #2771 → -061 · #2787 → -136 · #2826 → -004 · #2828 → -054 · #2907 → -135 · #2910 → -147 · #2917 → -122 · #2919 → -103 · #2926 → -143 · #2932 → -148 · #2984 → -062 · #3033 → -123 · #3034 → -139 · #3035 → -139 · #3050 → -083 · #3052 → -038 · #3102 → -079 · #3106 → -129 · #3112 → -127 · #3113 → -125 · #3116 → -139 · #3135 → -021 · #3138 → -046 · #3147 → -124 · #3153 → -145 · #3162 → -037 · #3163 → -126 · #3167 → -028.

Total: 140 números V2. Los parámetros sin número V2 (PRM-MOR-011–013, -023, -030, -032, -056, -091, -092, -113–119, -131, -140–142, -154, -165b, -166, -170–173, -180–183, -186) nacen de BASE, AGR o de la regla de RN-04 que citan en su columna "Origen".

### 22.5 Formularios ProCoop (INV `ProMod_GestionMora.md`)

| Formulario / tipo | Métodos relevantes | Destino |
|---|---|---|
| `abm_Exc_Mora` | Autorizar/Desautorizar_Excepcion, Guardar_Nota, Imprimir, Imprimir_Aceptar, ValidFields | PAN-MOR-23, API-MOR-46/47, RF-MOR-109, PRM-MOR-102 |
| `abm_Instanci` | ValidFields | PAN-MOR-11, API-MOR-30 |
| `frmConsultaNotificaciones` | Buscar, Imprimir, VisualizarDeudaNotificada, Reimprimir | PAN-MOR-21, RF-MOR-206 |
| `frmGestionMora` | Buscar, Add/Remove(All)_Notificacion, AnularGrupo, ReprocesarGrupo, CambiarEstado, Cerrar_Notificacion, ExportarCirculares, GenerarAvisoTelefonico, MarcarEntraga, NotificarTitulares, Ordenar_Notificaciones, QuitarNotificacion, RegistrarPromesa, Imprimir_CortarServicio, Imprimir_TotalesServicio, VerAntecedentes, VisualizarDeuda* | PAN-MOR-14, API-MOR-33–43, RF-MOR-083–098, -199, REP-MOR-04, -05, -09 |
| `frmGestionMora_Antecedentes` | Calificar, CambioCalificacion, cuenta corriente, deuda, resumen de pago | PAN-MOR-17, API-MOR-39, RN-MOR-054 |
| `frmGestionMora_BajaNotificacion` | Aceptar (baja con causa) | Modal de PAN-MOR-14, API-MOR-40, RF-MOR-096 |
| `frmGestionMora_Grupo` | Selección de lote | Filtro de lote en PAN-MOR-14 |
| `frmGestionMora_MarcarEntrega` | Operación marcar/desmarcar | PAN-MOR-16, API-MOR-37, RN-MOR-063, -064 |
| `frmGestionMora_Notificar` | Confirmar, GenerarNotificacion_Documento, GenerarNotificacion_MailSMS, ValidarTelefonos, chGenerarCompVen | PAN-MOR-15, API-MOR-33, -44, RN-MOR-062, PRM-MOR-090 |
| `frmGestionMora_OperEspeciales` | Buscar, Resolver_Notificaciones, Eliminar_Notificacion(es), Restablecer_Notificaciones | PAN-MOR-22, API-MOR-45, RF-MOR-215; `Restablecer` → Descartado: borrado masivo (CTR-MOR-09) |
| `frmGestionMora_PromesaPago` | Aceptar (promesa) | Modal de PAN-MOR-14, API-MOR-38, RF-MOR-094 |
| `frmGestionMora_VisualizarDeuda` | Imprimir, detalle | PAN-MOR-18, RN-MOR-071 |
| `frmImprimirNotificacion` | GenerarComprobante, Imprimir_Normal, Imprimir_Titular | Impresión de PAN-MOR-14/15, API-MOR-42, RF-MOR-205, RN-MOR-072 |
| `frmTratamientoMorosos` | Buscar, CambiarCategoria, CambiarEstado(MultServicios), Carga_Servicios, Cerrar_Notificacion, GenerarComprobantes, Generar_IncidenteTecnico, RealizarBajaServicio, Seleccionar_* | PAN-MOR-19, API-MOR-53, -54, RF-MOR-099–108, RN-MOR-077–079 |
| `frmTratamientoMorosos_Comprobantes` | Confirmar, NuevoItem_Producto, Eliminar | PAN-MOR-19 (cargos asociados, sujetos a PA-MOR-12) |
| `frmTratamientoMorosos_OT` | Get_ViaIngreso, Guadar, Validar | PAN-MOR-20, RN-MOR-080, PRM-MOR-112 |
| `ModoImpresion` | Enum de impresión | Opciones de impresión de API-MOR-42 |
| `Properties.Resources` | Recursos de UI | Descartado: reemplazado por diccionario `dict:` (RF-MOR-214) |

### 22.6 BASE, AGR y demás fuentes

| Fuente | Destino |
|---|---|
| BASE §14 Gestión de deuda y acuerdos (cada viñeta) | Segmentar → RF-MOR-141, JOB-MOR-17; expedientes, contactos y próximos pasos → `collectionFollowUps`, PAN-MOR-38, API-MOR-85; propuestas y simulación → RF-MOR-142; condiciones especiales → RF-MOR-147; acuerdos → RF-MOR-148; cumplimiento → RF-MOR-155; refinanciación → RF-MOR-158; no doble exigencia → RN-MOR-126; revisión humana → RF-MOR-111; criterio de suspensión con controles → RN-MOR-081; CU-14 → §16, ESC-MOR-29, §18 |
| BASE §23 Venta financiada vs. regularización | §2.2 (M11), RF-MOR-176 |
| BASE §52.3 Bajas y costos | RF-MOR-131, -132, RN-MOR-100, PRM-MOR-140, CTR-MOR-04 |
| BASE §53 CIC-001 | RF-MOR-131, -132 |
| BASE §53 CIC-002 | RF-MOR-133, -134 |
| BASE §53 CIC-003 | RF-MOR-135, RN-MOR-102 |
| BASE §53 CIC-004 | RF-MOR-136, RN-MOR-101, PRM-MOR-141 |
| BASE §53 CU-CIC-01 y precargas | §16, §18, ESC-MOR-26 |
| BASE §57 Definiciones pendientes | PA-MOR-06, -10, -12 |
| BASE §68 CTA-001 | §2.2 (M01/M07), RF-MOR-065 |
| BASE §68 CTA-002 | RF-MOR-067, PA-MOR-09 |
| BASE §68 CTA-003 | RF-MOR-069, PA-MOR-08, CTR-MOR-19 |
| BASE §68 CTA-004 | RF-MOR-126, -136, `interruptionChargeRules` |
| BASE §68 CU-CTA-01 | §16, ESC-MOR-15, §18 |
| BASE §70 Precisiones normativas | `suspensionRestrictionRules`, RN-MOR-082 |
| BASE §71 Pendientes de cuentas y lotes | PA-MOR-08, -09 |
| BASE §86 Internet | RN-MOR-083, PRM-MOR-119, piloto O6 |
| BASE §87 Electricidad | RN-MOR-084, PA-MOR-07, REP-MOR-25 |
| BASE §88 Agua | RN-MOR-085 |
| BASE §89 Gas | RN-MOR-086 |
| BASE §90 Cementerio parque | RN-MOR-087, CU-CTA-01 |
| BASE §91 Banco de sangre | RN-MOR-088 |
| BASE §97.3 Vencimientos múltiples, recargos e intereses | RF-MOR-011, -012, -020, -207, CTR-MOR-15 |
| BASE §98, §101, §106 Pendientes | PA-MOR-01–20 |
| BASE §54 Auditoría | RF-MOR-216 |
| MER-005 Garantías | RF-MOR-177–182, RN-MOR-132, PA-MOR-19 |
| MER-006 Incobrables y judicial | RF-MOR-183–192, RN-MOR-133–135, PA-MOR-17, -18 |
| MER-019 ND diferida | RF-MOR-041–048, CTR-MOR-14 |
| AGR-003 Estados | §8, RN-MOR-066, CTR-MOR-08, -10 |
| AGR-011 Cálculos explicables | RN-MOR-001, -010, CTR-MOR-13, -16, -21 |
| AGR-012 / AGR-013 Pagos y reversiones | RF-MOR-036, §12.2 |
| AGR-014 Convenios | RF-MOR-141–170, CTR-MOR-07, -20 |
| AGR-022 Indicadores | §15 |
| AGR-024 Evidencia de notificación | RN-MOR-064, PRM-MOR-091, PA-MOR-06 |
| DFA Módulo 11 (mora) y proceso "Mora" 4.1–4.6 | §5.7–§5.12, §9.4–§9.8, CTR-MOR-02 |
| DFA Módulo 12 (financiación) | §5.14–§5.15, PAN-MOR-29–32, CTR-MOR-07 |
| REL §6 Tablas de gestión de mora | §7, §19 |
| RN-07 §4 Cortes y reconexiones desde técnica | RN-MOR-098, §13, RF-MOR-130 |
| ESC-01 a ESC-05 | §17.5 |
| HUE-SRV-04 Pantallas del socio | PAN-MOR-39, -40, -41 (componentes embebidos en PAN-POR-46 y PAN-POR-37), API-MOR-86–95 |
| HUE-TEL-04 Telefonía | RN-MOR-137, RF-MOR-222, PRM-MOR-199, ESC-MOR-51 |
| HUE-TV-03 TV | RN-MOR-138, RF-MOR-222, PRM-MOR-200, ESC-MOR-52 |
| HUE-AG-02 Agua | RN-MOR-139, RN-MOR-085, RF-MOR-222, PRM-MOR-201, ESC-MOR-53 |
| HUE-CLO-01 Cloacas | RN-MOR-140, RF-MOR-222, ESC-MOR-54 |
| HUE-ALU-01 Deuda de terceros y corte | RN-MOR-141, RF-MOR-223, PRM-MOR-202, ESC-MOR-55 |
| HUECO-TAS-02 Saldo elegible de terceros | RN-MOR-142, RF-MOR-068, RF-MOR-223, PRM-MOR-202, -203, ESC-MOR-55 |
| HUECO-SEP-01 Cobertura social | RN-MOR-143, RF-MOR-224, PRM-MOR-204, ESC-MOR-56, EVT-MOR-21, ESC-MOR-61 |
| HUECO-SAN-02 Aporte impago de banco de sangre | RN-MOR-144, RN-MOR-088, RF-MOR-224, PRM-MOR-205, ESC-MOR-57 |
| HUE-ELE-05 Ventana ERSeP | RN-MOR-145, RF-MOR-221, RF-MOR-119, PRM-MOR-206, PA-MOR-10, ESC-MOR-58 |
| HUECO-OBR-02 Convenio de obra | RN-MOR-146, PRM-MOR-207, ESC-MOR-59 |
| HUECO-OTR-04 Devolución de depósito | RF-MOR-179, EVT-MOR-16, `guarantees.liquidation.refundMode`, ESC-MOR-60 |
| HUECO-OBR-01 Consumidores de EVT-TEC-25 | Nota de §12.2 (M08 no consume `tec.levy.approved`) |
| DEC-014 Reconexión al pagar | RN-MOR-092, RF-MOR-122 |
| DEC-031 Suspensión voluntaria | RF-MOR-211 |
| DEC-045 Deuda en cambio de titularidad | RN-MOR-147, ESC-MOR-63 |
| DEC-051 Interés en pago online | RF-MOR-041 |
| DEC-052 Plazos de prescripción | PRM-MOR-184, ESC-MOR-40, PA de prescripción |
| DEC-064 / DEC-087 Entidad jurídica | §7 (nota de `legalEntityId`), EVT-MOR-21, ESC-MOR-62 |
| DEC-083 Conceptos de terceros en contrato accesorio | RN-MOR-141, RN-MOR-142 |
| DEC-106 Tope de vencimientos por tenant, tipo de comprobante o servicio | §7.4 `dueDateSurchargeSchemes` (1..N vencimientos, `trames[].dueDateNumber` 2..N, consumidor M05), RN-MOR-033, §9.1 paso 1 (10-11-2026) |
| DEC-107 Comprobante rechazado por ARCA; nada se cobra antes de la autorización | RF-MOR-068 (saldo elegible solo con `fiscalGate` `authorized` o `notRequired`), RN-MOR-002 (10-11-2026). Ronda de cierre (10-11-2026; M05 RN-FAC-165, M07 RN-COB-158 punto 3): RF-MOR-068 y RN-MOR-002 cuentan la mora desde los vencimientos corridos cuando la autorización llega después del primer vencimiento |
| T05 §20 (CTR-DAT-07, 14, 29, 30, 37, 43, 52) | CTR-MOR-23, §7.3, §7.24, §7.26, §7.31, §19 |

