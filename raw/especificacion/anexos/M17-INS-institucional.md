# M17 INS — Gestión institucional (asociados, capital, asambleas, consejo, INAES)

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Estado | Especificación consolidada — pendiente de validar preguntas abiertas |
| Solución (BASE §105) | ERP (núcleo institucional); Landing-autogestión (vistas del asociado); Impuestos (retenciones de honorarios, vía M06); APIs (exportaciones INAES) |
| Olas | **O2** (registro mínimo de la relación institucional, prerrequisito de M01 y del portal); **O4–O5** (capital como concepto facturable e integración por pago: mínimo en O5 — rubros, regla, facturado/pagado, estado de cuenta —, DEC-019; antes "solo si la cooperativa piloto lo cobra — PA-INS-03"); **O10** (resto: libro de asociados, capital completo, rescates, excedentes, órganos, reuniones, asambleas, padrones, votaciones, actas, honorarios, INAES) |
| Dueño de datos | `associateMemberships` (CTR-DAT-09 de T05; antes `memberships`, que es de T02), `membershipEvents`, ~~`insNumberingSeries`~~ (absorbida por `numberingSequences` de T11, CTR-DAT-16), `electoralDistricts`, `capitalItems`, `capitalSubscriptionRules`, `capitalShareValues`, `capitalMovements`, `capitalReserves`, `capitalBalances` (proyección, HUECO-CAP-03), `capitalTransfers`, `capitalRefunds`, `capitalClosings`, `shareCertificates`, `surplusDistributions`, `surplusAllocations`, `governanceBodies`, `bodyMandates`, `meetings`, `meetingAgendaItems`, `meetingParticipants`, `meetingPermissions`, `minutes`, `resolutions`, `rosters`, `rosterEntries`, `proxies`, `electoralLists`, `votingSessions`, `voteTallies`, `institutionalFees`, `institutionalFeeSettlements`, `inaesCategories`, `inaesReports`, `associateRegisterEditions`, `memberCredentials` |
| Fuentes consolidadas | BASE §3, §27 (CU-27), §33 (entidades Asociado), §97.1, §97.7, §98, §100 (matriz de mercado, filas capital/Libro de asociados), MER-011, MER-014 (patrón de informes a organismos), §102.8 (responsable Secretaría institucional), §104.3 (honorarios no son sueldo), §105, §106; AGR-007, AGR-029, AGR-033; DFA M24 (§25) y tabla de módulos (líneas 64–66, 536); RN-06 §2, §5, §7, §9; RN-02 (capitalización en facturación masiva, anulaciones, ajustes; parámetros 2736, 2855); RN-04 (capital social en financiaciones y su anulación); RN-05 (capital en cobranza y cierre de caja, parámetro 2543); RN-08 §6.4, §5 (rubros de capitalización), cierre diario de capital (73/2636/2916); RN-09 TITULARES (parámetros 32, 50, 73, 240, 337, 340, 734, 741, 753, 754, 2314, 2324, 2428, 2429, 2430, 2552, 2571, 2575, 2576, 2580, 2591, 2606, 2608, 2616, 2633, 2636, 2660, 2673, 2716, 2785, 2792, 2855, 3027, 3091, 3193); CAT §1 (`SOCIOS`, `CAPITAL`, `CAPITAL_RES`, `RUBCAPI`), CAT §24 (`ACTAS`, `CAT_INAES`, `CONSEJO`, `REUNIONES`, `REUNIONES_ASIST`, `REUNIONES_PERMISOS`, `REUNIONES_TEMAS`), CAT §30 (códigos INAES de `DEPTO`, `LOCALIDA`, `PROVINC`, `DOCUMENT`), CAT §18 (`SU_ANTIGUE`, ver CTR-INS-02); INV ProMod_Titulares (`abm_Capital`, `abm_Consejo`, `frmCredencialAsociado`, `frmDistribucionCapital`, `frmPadronTitulares`, `frmPadronTitulares_Columnas`, `frmPadronTitulares_Credenciales`, `frmPadronTitulares_Filtros`, `Fecha_Padron`, `Filtros_Padron`, `frmRecuperoCapital`, `frmTranferenciaCapital`, `frmTitulares` [solicitud de ingreso, solicitud de baja, movimientos de capital], `frmImpresiones` [solicitud de alta/baja], `frmTitular_Fallecimiento`, `detalleAsociados`, `nCapital`, `tipoCapital`), INV Configuracion (`frmSelectFechaCapital`, `frmCapitalManual`, `frmMigracionCapital`), INV ReglasNegocio (`clsSocios_Capital`, `clsPadronTitular`, `ActaInternaReporte`, `ActaMesaEntradaResult`, `ActaReporte`, `ActaResult`, `ActaTemaReporte`, `ConsejoResult`, `ReclamoConsejoResult`, `Reunion*Request/Result`, `ReunionReclamoInfo`, `ReunionMesaEntradaResult`, `EstadoReunion`, `ResolucionReunion`, `ResolucionTemaActa`, `Distribucion`, `DetalleDistribucion`, `FiltrosDistribucion`, `ResultadoDistribucion`, `Capital_ReservaSocio`, `Credencial_Tipo`, `Fecha_Padron`, `Filtro_Padron`, `Modo_Padron`, `Padron_Titular`); CNX (layouts, DataTable, ScreenHelp, permisos, muro y notificaciones vía T09) |


> **Norma de implementación (DEC-111, DEC-112, DEC-110, DEC-113).** Construcción GoodApps: **.NET 10**, **ASP.NET Core**, **EF Core**, **Azure SQL** (base compartida, `TenantId` en tablas de negocio), front **React 19**, **Microsoft Azure** (Container Apps, Blob, Queue, Key Vault, Application Insights), identidad **OpenIddict**. Modelo físico: `07-modelo-relacional-azure-sql.md` y `07-catalogo-tablas-sql.md`. Checklist e impacto: `06-impacto-adaptacion-stack-goodapps.md` (**DIR-13**).
>
> **Lectura:** «colección» en este anexo = **entidad lógica**; tablas, columnas y FK en `07-*`. RF/RN/CU del anexo **no cambian** por el stack.


## 1. Objetivo

Gestionar la **relación institucional** entre cada persona y su cooperativa (Ley 20.337 y normativa del INAES), de forma trazable y separada de la relación comercial por servicios:

- el **registro de asociados** (número, antigüedad, estado institucional, ingreso aprobado por acta, egreso con causa) y el **Libro de Registro de Asociados** (MER-011);
- el **capital social** (cuotas sociales suscriptas, facturadas, integradas, comprometidas, reservadas, transferidas y reembolsadas), con su auxiliar propio y distinto de la deuda por servicios (AGR-029), incluido su cobro dentro de la factura cuando el tenant lo habilite (BASE §97.7);
- la **distribución de excedentes y retornos** aprobada por asamblea;
- los **órganos sociales** (consejo de administración, sindicatura, comisiones, junta electoral) con sus mandatos;
- **reuniones, asambleas, convocatorias, padrones, asistencia, poderes, delegados, votaciones formales, actas y resoluciones**;
- los **honorarios institucionales** de consejeros y síndicos (no son sueldo, BASE §104.3);
- las **categorías e informes al INAES**.

El módulo prepara información y deja evidencia; **no certifica validez legal** ni reemplaza las decisiones de los órganos de la cooperativa (BASE §27).

## 2. Límite y responsabilidades

### 2.1 Qué hace

| Responsabilidad | Detalle |
|---|---|
| Relación institucional | Alta (solicitud, aprobación, número), estados, egreso, reingreso, fallecimiento, credencial, antigüedad, distrito electoral. |
| Libro de asociados | Emisión versionada, foliada e inmutable; exportación de altas y bajas al INAES. |
| Capital social | Rubros capitalizables, reglas de suscripción, valor de la cuota social, libro mayor de capital por asociado, reservas, transferencias, rescates/reembolsos, cierres de capital, certificados. |
| Excedentes | Simulación, aprobación vinculada a resolución de asamblea, ejecución por asociado (capitalización, crédito o pago). |
| Gobierno | Órganos, cargos, mandatos, vencimientos, firmantes. |
| Reuniones y asambleas | Programación, orden del día, permisos, asistencia, quórum, convocatoria, padrón, poderes, delegados, listas, votación formal, actas, resoluciones y su seguimiento. |
| Honorarios | Registro de la retribución aprobada, liquidación periódica como obligación institucional. |
| INAES | Categorías, catálogo de informes, generación, validación, presentación y acuse. |

### 2.2 Qué NO hace

- No es dueño de la **persona**, sus documentos, domicilios ni vínculos personales: eso es M01 PER.
- No **calcula** el importe facturable de la cuota social ni **emite** comprobantes: M04 TAR calcula y M05 FAC emite; M17 define rubros, reglas y recibe los hechos.
- No **cobra** ni imputa pagos: M07 COB. No **paga** reembolsos ni honorarios: M14 TES.
- No **contabiliza**: publica eventos que M15 CON transforma en asientos.
- No calcula **retenciones**: M06 FIS.
- No gestiona **encuestas** de opinión ni comunicaciones masivas: T09 COM (la votación formal de asamblea sí es de M17, ver RF-INS-083).
- No liquida **sueldos** (M16 SUE) ni retiros de asociados de cooperativas de trabajo (fuera de alcance salvo decisión posterior, BASE §104.3).
- No resuelve la **baja de servicios**: M01/M02/M09/M10 según el servicio; M17 solo recibe el evento y alerta (AGR-029).

### 2.3 Qué delega y a quién

| Necesidad | Módulo | Mecanismo |
|---|---|---|
| Persona, identidad, fallecimiento, representación legal | M01 PER | Servicio `per.persons.get`; evento `per.person.deceased` |
| Ficha 360 que muestra el estado institucional | M01 PER / M19 POR | Consumen `GET /api/admin/ins/memberships/:id/summary` |
| Concepto "cuota social" en el catálogo | M02 CAT | Marca `capitalizable` del concepto y vínculo con `capitalItems` |
| Cálculo de cuota social en factura | M04 TAR | Regla de cálculo que consulta `capitalSubscriptionRules` |
| Emisión, anulación, notas de crédito | M05 FAC | Eventos `fac.invoice.issued`, `fac.invoice.annulled`, `fac.creditNote.issued` / `fac.debitNote.issued` |
| Pago, imputación, reversión | M07 COB | Eventos `cob.payment.confirmed` (incluye la imputación), `cob.receipt.voided`, `cob.allocation.reversed` |
| Convenios de pago con capital incluido | M08 MOR | Eventos `mor.agreement.created`, `mor.agreement.annulled` |
| Compensación de reembolso con deuda | M07 COB | Comando `cob.credits.applyInstitutionalCredit` |
| Pago de reembolsos, retornos y honorarios | M14 TES | Comando `tes.paymentOrders.create` |
| Retenciones de Ganancias sobre honorarios | M06 FIS | Cálculo en la orden de pago |
| Contribuciones propias del tenant calculadas sobre el capital (registro de obligaciones y exenciones propias, DEC-095) | M06 FIS | M17 provee la base: servicio `ins.capitalBase.get({ legalEntityId, asOf })`, API-INS-071 y eventos `ins.capitalBase.closed` / `.reopened` (EVT-INS-22; RF-INS-109). M06 calcula y registra la obligación; M15 la contabiliza. |
| Entidad jurídica de la membresía y su resolución por servicio | T04 CFG | `legalEntities` (RF-CFG-134) y `legalEntities.resolve` (RF-CFG-137); ámbito `legalEntity` de parámetros (RF-CFG-018/019) (DEC-096) |
| Asientos de capital, excedentes, honorarios | M15 CON | Eventos `ins.capitalMovement.recorded` (antes `ins.capital.movement.recorded`), `ins.surplusDistribution.executed` (antes `ins.surplus.distribution.executed`), `ins.fee.settled` |
| Resultado del ejercicio por sección | M15 CON | Servicio `con.results.bySection` |
| Convocatorias, publicaciones, avisos | T09 COM | Comando `com.communications.emit` (API-COM-75) con audiencia por padrón |
| Workflow de aprobación, expediente, firma | T11 WFL | Motor de autorizaciones y expediente documental |
| Casos CRM y mesa de entradas vinculados a temas | M09 CRM | Referencia `crmCaseId` en `meetingAgendaItems` (nombre canónico de T05 §7.2; antes `caseId`) |
| Códigos INAES de geografía y documentos | T04 CFG | Tablas maestras con `inaesCode` |
| Diccionario, marca | T03 UXD | Claves `dict:ins.*` |

## 3. Glosario del módulo

| Término | Definición | Clave de diccionario | Término ProCoop equivalente |
|---|---|---|---|
| Asociado | Persona (física o jurídica) con relación institucional vigente con la cooperativa, aprobada por el consejo. | `dict:ins.associate` | Socio / Titular "activo" (`SOCIOS.ACTIVO = 1`) |
| Cliente no asociado | Persona con servicios contratados sin relación institucional. | `dict:ins.nonMemberCustomer` | Titular "no activo" / cliente (V2 32, V2 2591) |
| Relación institucional (membresía) | Registro de la condición de asociado con su historia de estados. | `dict:ins.membership` | `SOCIOS` (campos institucionales) |
| Número de asociado | Identificador visible, único y no reutilizable dentro de la entidad jurídica de la membresía (DEC-096; antes "en el tenant"). | `dict:ins.memberNumber` | `NUM_SOC` |
| Antigüedad institucional | Tiempo transcurrido desde la fecha de ingreso aprobada, descontando períodos de egreso si el estatuto lo exige. | `dict:ins.seniority` | Calculada desde `SOCIOS.ALTA` (no `SU_ANTIGUE`, ver CTR-INS-02) |
| Solicitud de ingreso | Pedido de asociación con adhesión al estatuto y suscripción propuesta. | `dict:ins.admissionRequest` | "Solicitud de ingreso" (`frmTitulares`) |
| Egreso | Fin de la relación institucional por renuncia, exclusión, fallecimiento o extinción de la persona jurídica. | `dict:ins.exit` | Baja de socio (`BAJA`, `CAU_BAJA`) |
| Cuota social | Unidad de capital, de igual valor nominal e indivisible, representada en acciones o certificados. | `dict:ins.share` | Acción (`SOCIOS.ACCIONES`) |
| Capital suscripto | Compromiso de aporte asumido por el asociado. | `dict:ins.capitalSubscribed` | Suscripto (`CAPITAL_RES.SUSCRIPTO`) |
| Capital facturado | Porción del capital suscripto incluida en un comprobante para su cobro. | `dict:ins.capitalBilled` | Facturado / "Vendido" (`CAPITAL.FACTURADO`, V2 2314) |
| Capital integrado | Capital efectivamente pagado. | `dict:ins.capitalPaid` | Pagado / integrado (`PAGADO`) |
| Capital comprometido | Capital incluido en un comprobante de venta todavía no facturado ni pagado. | `dict:ins.capitalCommitted` | `COMPVEN` |
| Rubro de capital | Agrupación contable del capital con su cuenta. | `dict:ins.capitalItem` | `RUBCAPI` |
| Reserva de capital | Afectación de capital integrado a un destino (aplicación o devolución) pendiente de ejecutar. | `dict:ins.capitalReserve` | `CAPITAL_RES` (según RN-06 §9, ver CTR-INS-03) |
| Rescate / reembolso | Devolución del capital integrado al egreso, según estatuto. | `dict:ins.capitalRefund` | Rescate de acciones (`Rescate_Acciones`) |
| Transferencia de capital | Traspaso de cuotas sociales entre asociados con aprobación. | `dict:ins.capitalTransfer` | `TRANSFER` tipo 3 |
| Cierre de capital | Fecha hasta la cual el capital queda cerrado y no admite movimientos. | `dict:ins.capitalClosing` | Fecha de cierre de capital (V2 2785) |
| Excedente repartible | Resultado positivo del ejercicio proveniente de operaciones con asociados, sujeto a distribución por asamblea. | `dict:ins.surplus` | — (no relevado en ProCoop; `frmDistribucionCapital` [VERIFICAR]) |
| Retorno | Parte del excedente asignada a cada asociado en proporción al uso de los servicios u otro criterio aprobado. | `dict:ins.patronageRefund` | — |
| Órgano social | Consejo de administración, sindicatura, comisión fiscalizadora, junta electoral o comisión interna. | `dict:ins.governanceBody` | `CONSEJO.TIP_CSJ` |
| Mandato | Ocupación de un cargo de un órgano por un asociado durante un período. | `dict:ins.mandate` | Fila de `CONSEJO` (sin vigencia) |
| Reunión | Sesión de un órgano o asamblea, con orden del día, asistencia y acta. | `dict:ins.meeting` | `REUNIONES` |
| Tema del orden del día | Punto a tratar con su resolución y estado de tratamiento. | `dict:ins.agendaItem` | `REUNIONES_TEMAS` |
| Acta | Documento numerado que registra lo tratado y resuelto en una reunión, con firmantes. | `dict:ins.minute` | `ACTAS` |
| Resolución | Decisión de un órgano con responsable y seguimiento. | `dict:ins.resolution` | `REUNIONES_TEMAS.RESOLUCION` |
| Padrón | Lista versionada de asociados habilitados para una asamblea con criterios y fecha de corte. | `dict:ins.roster` | Padrón de titulares (`clsPadronTitular`) |
| Poder / representación | Autorización de un asociado a otro para votar en su nombre, si el estatuto lo admite. | `dict:ins.proxy` | Representados (`Get_Informe_Representados`) |
| Delegado | Asociado elegido en asamblea de distrito para integrar la asamblea de delegados. | `dict:ins.delegate` | `Get_Informe_Delegados`, `SOCIOS.REP_ASAMBLEA` |
| Votación formal | Acto de votación de asamblea u órgano con padrón, mayorías y escrutinio; distinta de una encuesta. | `dict:ins.vote` | Informe de votación (`Get_Informe_Votacion`) |
| Honorario institucional | Retribución de consejeros o síndicos aprobada por asamblea. | `dict:ins.institutionalFee` | — |
| Categoría INAES | Clasificación exigida por el INAES para informes. | `dict:ins.inaesCategory` | `CAT_INAES` |
| Libro de Registro de Asociados | Libro obligatorio con los datos de cada asociado y sus cuotas sociales. | `dict:ins.associateRegister` | Registro de asociados (`Get_Informe_RegistroAsociados`) |
| Credencial de asociado | Constancia impresa o digital de la condición de asociado. | `dict:ins.memberCard` | Credencial (`frmCredencialAsociado`) |

**Nota terminológica:** en ProCoop "capital" también designa el principal de una financiación (subtipo 24, concepto 310, RN-04) y el crédito acreditado en prepago (RN-10). En CoopApps, `capital*` dentro de M17 significa **exclusivamente capital social** (CTR-INS-09).

## 4. Actores, permisos y alcance

| Rol | Capabilities | Alcance de datos |
|---|---|---|
| Secretaría institucional | `ins.asociados.ver/crear/editar/aprobar/egresar/exportar`, `ins.libro.emitir`, `ins.padrones.ver/generar`, `ins.reuniones.ver/gestionar/reabrir`, `ins.organos.gestionar`, `ins.actas.ver/editar`, `ins.credenciales.emitir`, `ins.inaes.exportar`, `ins.reportes.ver` | Tenant |
| Consejo de administración (presidente, secretario, tesorero, vocales) | `ins.reuniones.ver`, `ins.actas.ver/firmar`, `ins.asociados.aprobar`, `ins.padrones.aprobar`, `ins.rescates.aprobar`, `ins.honorarios.aprobar` (solo ejecución de lo resuelto por asamblea), `ins.reportes.ver` | Tenant; reuniones reservadas según `meetingPermissions` |
| Síndico | Lectura de todo el módulo (`ins.*.ver`), `ins.actas.firmar` (actas de sindicatura), `ins.reportes.ver` | Tenant (solo lectura salvo sus actas) |
| Administración de capital (contable/administrativo) | `ins.capital.ver/ajustar/importar`, `ins.reservas.gestionar`, `ins.transferencias.crear`, `ins.rescates.gestionar`, `ins.cierres.crear` | Tenant |
| Contador | `ins.capital.ver`, `ins.excedentes.calcular/ejecutar`, `ins.honorarios.gestionar`, `ins.reportes.ver` | Tenant |
| Tesorería | Lectura de rescates, honorarios y excedentes (paga vía M14) | Tenant |
| Junta electoral | `ins.listas.gestionar`, `ins.votaciones.gestionar`, `ins.padrones.ver` | Asambleas asignadas |
| Acreditador de asamblea | `ins.asistencia.registrar`, `ins.poderes.validar` | Asamblea asignada, solo durante la sesión |
| Operador de atención | `ins.asociados.ver` (resumen), `ins.asociados.crear` (solicitudes) | Sucursales asignadas |
| Asociado (PWA) | `ins.mi.ver` (estado, número, antigüedad, capital, credencial, convocatorias, documentos públicos, padrón propio), `ins.mi.solicitar` (ingreso, egreso, poder, reclamo de padrón) | Propios |
| Auditor externo | `ins.*.ver`, `ins.reportes.ver`, `ins.asociados.exportar` | Tenant, acceso temporal |
| Administrador del tenant | `ins.config.configurar` (parámetros, rubros, valores, plantillas, distritos), `ins.asociados.renumerar` (con aprobación) | Tenant |
| Sistema externo (API key) | Scope `ins.status.ver` (antes `ins.status.read`) | Solo estado y número |
| Soporte de plataforma | Sin acceso por defecto; acceso temporal auditado (AGR-034) | Tenant autorizado |

Reglas de separación de tareas (AGR-008): quien registra un rescate no puede aprobarlo; quien carga capital manual no puede aprobar el ajuste; los firmantes de un acta deben tener mandato vigente o haber presidido la reunión.

## 5. Requisitos funcionales

### 5.1 Registro de asociados

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-INS-001 | Registrar la relación institucional de una persona del tenant como entidad propia, distinta de persona, titular, cliente, pagador, usuario y empleado. **Cada membresía pertenece a una entidad jurídica del tenant** (`legalEntityId`, `legalEntities` de T04; DEC-096): una persona tiene a lo sumo una membresía vigente **por entidad jurídica**, de modo que puede ser a la vez asociada de la cooperativa y afiliada de la mutual del mismo tenant, con dos membresías independientes (número, estado, antigüedad, capital, padrón y órganos propios de cada entidad). Con una sola entidad (PRM-CFG-039 = `false`) la membresía toma la entidad por defecto y el selector no se muestra. (Antes: "Una persona tiene a lo sumo una membresía vigente por tenant".) | BASE §3 (regla de diseño), §33 "Asociado", AGR-029, DFA M24, CAT `SOCIOS`; DEC-064; DEC-096 | Núcleo | O2 | Adoptado | Una persona con tres servicios tiene una sola membresía por entidad; un cliente sin membresía puede contratar servicios si el servicio lo admite (RF-INS-009). La misma persona puede tener una membresía `active` en COOP y otra en MUTUAL; una segunda solicitud vigente en COOP se rechaza con `ins.membership.duplicated`. |
| RF-INS-002 | Asignar un **número de asociado** visible, único **dentro de la entidad jurídica** de la membresía (DEC-096; antes "único en el tenant"), correlativo y nunca reutilizado, independiente del identificador interno y del número de cuenta; se asigna al aprobar el ingreso. Cada entidad tiene su propia secuencia (`numberingSequences` de T11 con clave `ins.memberNumber:<legalEntityCode>`), porque cada una lleva su Libro de Registro de Asociados. Opción de asignación manual autorizada. | RN-06 §2 (`NUM_SOC`, `Get_NumeroSiguiente`, `ValidarNumeroAsociado`), V2 2660; DEC-096 | Núcleo | O2 | Adoptado | Dos aprobaciones simultáneas en la misma entidad obtienen números distintos; un número asignado manualmente que ya existe en la entidad se rechaza; el N.º 1001 puede existir a la vez en COOP y en MUTUAL. |
| RF-INS-003 | Registrar fecha de solicitud, fecha de aprobación (alta institucional), acta y reunión de consejo que aprobó el ingreso, y calcular la **antigüedad** a cualquier fecha. | CAT `SOCIOS.ALTA`, `SOCIOS.ACTA`, DFA M24 | Núcleo | O2 | Adoptado | La antigüedad a una fecha de corte coincide con el cálculo manual; sin acta de aprobación el estado no pasa a `active` salvo PRM-INS-005. |
| RF-INS-004 | Mantener el **estado institucional** con su historial (`membershipEvents`): solicitante, pendiente de aprobación, activo, suspendido, renuncia solicitada, egresado por renuncia, excluido, fallecido, rechazado, extinguido (persona jurídica). | BASE §3 "Gestionar ingreso, baja y situación", AGR-029 | Núcleo | O2 | Adoptado | Cada cambio guarda fecha efectiva, fecha de registro, actor, causa y documento; se puede reconstruir el estado a cualquier fecha. |
| RF-INS-005 | Gestionar la **solicitud de ingreso** desde admin, mesa de entradas o PWA, con datos de la persona (de M01), **entidad jurídica a la que se asocia** (DEC-096: solo entidades con PRM-INS-058 = `true`; con una sola habilitada se completa sola), aceptación del estatuto y reglamentos vigentes de esa entidad (versión), suscripción de capital propuesta según las reglas de esa entidad y documentos. | INV `frmTitulares` (solicitud de ingreso), BASE §67, §97.1; DEC-096 | Estándar | O10 | Adoptado | La solicitud conserva la entidad y la versión del estatuto aceptado y queda en estado `pendingApproval`; una solicitud a una entidad con PRM-INS-058 = `false` se rechaza. |
| RF-INS-006 | Llevar las solicitudes pendientes al **orden del día del consejo** (individual o en lote) y registrar la resolución (aprobada, rechazada con motivo, observada), actualizando el estado y el número. | DFA M24, CAT `REUNIONES_TEMAS`, `SOCIOS.ACTA` | Estándar | O10 | Adoptado | Al cerrar el acta con el tema "ingreso de asociados" aprobado, las membresías incluidas pasan a `active` con número y referencia al acta. |
| RF-INS-007 | Registrar el **representante de asamblea / delegado** y el **distrito electoral** del asociado. | RN-06 §2 (`REP_ASAMBLEA`), INV `clsPadronTitular.Get_Informe_Delegados`, `cbDistritos` | Estándar | O10 | Adoptado | El padrón por distrito lista solo asociados del distrito; el informe de delegados muestra titulares y suplentes vigentes. |
| RF-INS-008 | Asociados **personas jurídicas** con representante legal designado (persona de M01) y vigencia de la representación. | CAT `SOCIOS.JURIDICO`, AGR-007 | Estándar | O10 | Adoptado | Sin representante vigente, la persona jurídica figura en el padrón con la observación "sin representante acreditado". |
| RF-INS-009 | Distinguir **cliente no asociado**: persona con servicios y sin membresía. Configurar por servicio si exige membresía activa para contratar. La membresía exigida es la de la **entidad emisora del servicio** (`legalEntities.resolve` de T04, RF-CFG-137; DEC-096): un servicio de la mutual exige ser afiliado de la mutual, no asociado de la cooperativa. | BASE §3, V2 32, V2 734, V2 2591; DEC-096 | Núcleo | O2 | Adoptado | Un servicio con `requiresActiveMembership = true` rechaza el alta de un cliente no asociado con error `ins.membership.required`; un asociado activo de COOP sin membresía en MUTUAL recibe el mismo error al contratar un servicio emitido por MUTUAL. |
| RF-INS-010 | Registrar el **egreso**: renuncia, exclusión, fallecimiento, extinción; causa catalogada, fecha efectiva, acta y documentos; aplicar validaciones configurables (servicios activos, capital integrado, cuentas). | CAT `SOCIOS.BAJA/CAUSA/CAU_BAJA`, RN-06 §5, V2 337, 340, 2633 | Núcleo | O10 | Adoptado | Con PRM-INS-008 activo, un egreso con servicios activos se rechaza listando los servicios; con capital integrado se exige rescate iniciado (RN-INS-008). |
| RF-INS-011 | **Reingreso** de un ex asociado: nueva membresía o reactivación; conservar o no el número anterior según configuración. | V2 2673 (`ACTIVOBAJA`), RN-06 §5 | Estándar | O10 | Adoptado | Con PRM-INS-010 = conservar, el reingresado recupera su número; si no, recibe uno nuevo y el anterior queda reservado. |
| RF-INS-012 | **Exclusión** con notificación fehaciente, plazo de apelación ante la asamblea y registro de la resolución final. | Ley 20.337 (exclusión y apelación) [VERIFICAR artículo], BASE §27 | Estándar | O10 | Adoptado | Durante el plazo de apelación el estado es `exclusionPending`; si la asamblea revoca, vuelve a `active` sin perder antigüedad. |
| RF-INS-013 | Procesar el **fallecimiento** informado por M01: membresía `deceased`, alerta a secretaría, inicio de trámite de reembolso a derechohabientes y efectos en M18 (adherentes, sepelio). | INV `frmTitular_Fallecimiento`, RN-06 §10 (`SetFechaFallecimiento`) | Estándar | O10 | Adoptado | El evento `per.person.deceased` deja la membresía en `deceased` con fecha de fallecimiento como fecha efectiva. |
| RF-INS-014 | Emitir la **credencial de asociado** (individual o masiva desde padrón), impresa y digital en PWA, con número, nombre, antigüedad, foto opcional y QR verificable de validez. | INV `frmCredencialAsociado`, `frmPadronTitulares_Credenciales`, `Credencial_Tipo`, `clsPadronTitular.Get_Informe_Credenciales` | Estándar | O10 | Adoptado | El QR leído por la app del acreditador devuelve "vigente" o "no vigente" sin exponer datos adicionales. |
| RF-INS-015 | Exponer el **resumen institucional** para la ficha 360 (M01) y el portal (M19): estado, número, antigüedad, capital por tipo, saldo de capital, cargos, asistencias, **con un bloque por cada membresía de la persona y su entidad jurídica** (DEC-096), filtrado por la dimensión entidad jurídica del alcance del usuario (T02 RF-IAM-065). | BASE §3 "Consultar todos sus contratos… desde una ficha", INV `detalleAsociados`; DEC-096 | Núcleo | O2 | Adoptado | El endpoint responde en menos de 500 ms y solo con datos permitidos al rol; una persona socia de COOP y afiliada de MUTUAL muestra dos bloques, y un usuario con alcance `[MUTUAL]` ve solo el de MUTUAL. |
| RF-INS-016 | **Renumeración controlada** de asociados (corrección): solicitud, aprobación, auditoría y conservación del número anterior como alias; nunca reasignar un número a otra persona. | RN-06 §5 (`ModificacionEspecial_Socio`) | Extensión | O10 | Reemplazado por RF-INS-016 (mejora de la herramienta SQL de ProCoop) | Tras renumerar, las búsquedas por número anterior encuentran al asociado y la auditoría muestra ambos números. |
| RF-INS-017 | Historial con **fecha efectiva** y **fecha de registro** de todo cambio institucional. | AGR-010, CAT `SOCIOS.OBSERVA` (recortado a 1000 caracteres en ProCoop) | Núcleo | O2 | Adoptado | No se pierde historial por longitud; cada cambio es un evento consultable. |
| RF-INS-018 | **Solicitud de egreso** del asociado (PWA o mesa) con plantilla configurable e impresión. | V2 2580, INV `frmTitulares.Imprimir_SolicitudBaja`, `frmImpresiones.Imprimir_SolicitudAltaBaja` | Estándar | O10 | Adoptado | La solicitud genera trámite en T11 y la membresía pasa a `withdrawalRequested`. |
| RF-INS-019 | Asignar **categoría INAES** a cada membresía cuando el informe la requiera. | CAT `CAT_INAES` | Estándar | O10 | A validar (PA-INS-09) | El informe INAES agrupa por categoría sin valores vacíos. |
| RF-INS-020 | Administrar **distritos electorales** (para asambleas de distrito) con regla de asignación por zona, localidad o manual. | INV `frmPadronTitulares.cbDistritos_EditValueChanged`, Ley 20.337 (asambleas de distrito) [VERIFICAR] | Estándar | O10 | Adoptado | Todo asociado activo queda en un distrito cuando la asamblea es de delegados. |

### 5.2 Libro de Registro de Asociados e INAES

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-INS-021 | Generar el **Libro de Registro de Asociados** a una fecha o período: número, nombre o razón social, documento/CUIT, domicilio, fecha de ingreso, fecha y causa de egreso, cuotas sociales suscriptas e integradas, transferencias y reembolsos, con opción de informar capital anterior al período. El libro es **de una entidad jurídica** (`associateRegisterEditions.legalEntityId`; DEC-096): incluye solo las membresías y el capital de esa entidad. | MER-011, CAT `SOCIOS`, `clsPadronTitular.Get_Informe_RegistroAsociados`, V2 3027, INV `frmSelectFechaCapital`; DEC-096 | Estándar | O10 | Adoptado | El total de capital integrado del libro a una fecha coincide con el saldo del rubro en M15 a esa fecha para la misma entidad. |
| RF-INS-022 | Emitir el libro como **edición versionada inmutable**: folios correlativos, hash SHA-256 del contenido, PDF/A; las correcciones se registran como asientos rectificativos en la edición siguiente. **Folios por entidad jurídica (DEC-096):** cada entidad lleva su propio Libro de Registro de Asociados, así que ediciones y folios son correlativos dentro de la entidad (`numberingSequences` de T11 con clave `ins.registerFolio:<legalEntityCode>`; antes una sola serie `registerFolio` por tenant). | MER-011, AGR-033 | Estándar | O10 | Adoptado | Una edición emitida no puede modificarse; recalcular el hash da el mismo valor. |
| RF-INS-023 | Preparar el libro para **rubricación o registro digital** según el formato que exija el INAES. | MER-011 ("formato que exija el INAES, a verificar") | Estándar | O10 | A validar (PA-INS-09) | Se genera el archivo en el formato configurado con validación previa. |
| RF-INS-024 | **Exportar altas y bajas al INAES** por lotes con cantidad de registros por lote configurable, por entidad jurídica (cada entidad tiene su matrícula, `legalEntities.inaesRegistration` de T04; `inaesReports.legalEntityId`; DEC-096). | INV `ExportarAltasYBajas_INAES`, V2 3091; DEC-096 | Estándar | O10 | Adoptado | Un período con 2.500 movimientos y lote de 1.000 genera 3 archivos numerados. |
| RF-INS-025 | Usar los **códigos INAES** de provincia, departamento, localidad y tipo de documento mantenidos en T04. | CAT §30 (`PROVINC.COD_INAES`, `DEPTO.COD_INAES`, `LOCALIDA.COD_INAES`, `DOCUMENT.COD_INA`) | Estándar | O10 | Adoptado | Un asociado con localidad sin código INAES bloquea la exportación con el detalle del faltante. |
| RF-INS-026 | Emitir **certificados de cuotas sociales** (acciones) por asociado, numerados, con cantidad, valor nominal y estado de integración. **Por entidad jurídica (DEC-096):** el certificado es de la entidad de la membresía (`shareCertificates.legalEntityId`) y su número es correlativo dentro de esa entidad (`numberingSequences` de T11 con clave `ins.shareCertificate:<legalEntityCode>`; antes una sola serie `shareCertificate` por tenant). | INV `clsPadronTitular.Get_Certificados_Acciones`, CAT `SOCIOS.ACCIONES` | Estándar | O10 | Adoptado | Un certificado anulado conserva número y motivo; el nuevo referencia al anterior. |
| RF-INS-027 | **Etiquetas** y listados postales de asociados para convocatorias y comunicaciones. | INV `clsPadronTitular.Get_Informe_Etiqueta` | Extensión | O10 | Adoptado | Se exporta PDF de etiquetas por distrito y orden postal. |
| RF-INS-028 | **Catálogo de informes INAES** (padrón, registro, altas/bajas, nómina de autoridades, documentación de asamblea, otros) con período, vencimiento, generación, validación, presentación y acuse. | MER-014 (patrón), MER-011, CAT `CAT_INAES` | Estándar | O10 | Adoptado | Cada presentación guarda archivo, fecha, usuario y acuse; vencimientos aparecen en la bandeja de alertas. |

### 5.3 Capital social

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-INS-029 | ABM de **rubros de capital** con código y descripción; la cuenta contable se asigna en M15 (`entityAccountAssignments`, `entityType: capitalRubric`; CTR-DAT-57, antes "y cuenta contable (mapeo a M15)"). Un rubro de productos solo puede pertenecer a un rubro de capitalización. | CAT `RUBCAPI` (`COD_RCC`, `COD_RUB`, `DES_RCC`, `COD_CTA`), RN-08 §5 (`Exist_Rubro_Rubcapi`) | Núcleo | O5 | Adoptado (DEC-019; antes A validar PA-INS-03) | Asignar un rubro ya vinculado a otro rubro de capitalización se rechaza. |
| RF-INS-030 | Definir qué **conceptos/productos o servicios del catálogo** generan capital y en qué proporción (por producto o por servicio). | INV `abm_Capital` (`TipoDeCapital`, `rbProducto`, `rbServicio`), RN-06 §9 (`RUBCAPI`) | Núcleo | O5 | Adoptado (DEC-019; antes A validar PA-INS-03) | Facturar un concepto capitalizable genera movimiento `billed` por el importe configurado. |
| RF-INS-031 | **Importe de capital al alta de un servicio**: monto o cantidad de cuotas sociales a suscribir cuando se contrata un servicio. | RN-06 §9 (`SERSOC.IMP_CAPITAL`, `_Servicio`), INV `abm_Socios.GuardarCapitalServicio`, `clsSocios_Capital.Generar_ImporteCapital_Sersoc` | Estándar | O5 | Adoptado (DEC-019; antes A validar PA-INS-03) | Al activarse el contrato (evento de M01/M10) se registra la suscripción una única vez. |
| RF-INS-032 | **Reglas de suscripción** versionadas: cuotas sociales mínimas al ingreso, por servicio, por categoría; plan de integración (contado, cuotas en factura, cuotas en documento propio). | BASE §97.7, MER-011 | Estándar | O10 | A validar (PA-INS-01) | La regla vigente a la fecha de ingreso es la que se aplica; cambiar la regla no altera suscripciones previas. |
| RF-INS-033 | **Valor nominal de la cuota social** versionado **por entidad jurídica** (`capitalShareValues.legalEntityId`; DEC-096) y cantidad de cuotas por asociado. Las reglas de suscripción (RF-INS-032, `capitalSubscriptionRules.legalEntityId`) también son de una entidad. | CAT `SOCIOS.ACCIONES`, Ley 20.337 (cuotas iguales e indivisibles); DEC-096 | Estándar | O10 | Adoptado | La cantidad de cuotas × valor nominal vigente a la suscripción = capital suscripto. |
| RF-INS-034 | Configurar el **momento de suscripción**: en la afiliación o al facturar. | V2 2636, V2 73, RN-08 §6.4 | Núcleo | O5 | A validar (PA-INS-01) | Con "al facturar" no hay movimiento `subscribed` hasta la emisión; con "afiliación" se registra al aprobar el ingreso. |
| RF-INS-035 | Registrar la **integración** al confirmarse el pago, en proporción pago/total del comprobante. | RN-06 §9 (`_Pagos`), V2 2916 | Núcleo | O5 | Adoptado (DEC-019; antes A validar PA-INS-03) | Pago parcial del 40 % de un comprobante con ARS 1.000 de capital integra ARS 400. |
| RF-INS-036 | **Libro mayor de capital** por asociado, cuenta y servicio (`capitalMovements`) con tipos: suscripción, facturación, comprometido, integración, ajuste, reversión, transferencia (entrada/salida), reserva, recupero de reserva, rescate, capitalización de retornos, carga manual, migración. Cada movimiento lleva el `legalEntityId` del documento origen (comprobante, pago, convenio) o, si no lo hay, el de la membresía, y se imputa a la membresía de la persona **en esa entidad**; si la persona no es asociada de esa entidad, queda como capital a regularizar de esa entidad (CTR-INS-06), nunca en la membresía de otra entidad (RN-INS-053; DEC-096). | RN-06 §9, CAT `CAPITAL` (`FACTURADO`, `COMPVEN`, `EMISION`, `VTO1`, `ID_FAC`); DEC-096 | Núcleo | O5 | Adoptado | La suma de movimientos por tipo reproduce suscripto, facturado, integrado y comprometido de cualquier asociado. |
| RF-INS-037 | Registrar capital desde todas las **fuentes**: ítems facturados, comprobantes de venta (comprometido), importe del servicio al alta, pagos, convenios/financiaciones, recálculo por fecha. | RN-06 §9 (`Guardar_CAPITAL`, `_CompVen`, `_Servicio`, `_Pagos`, `_Reccon`, `Guardar_CAPITAL_Comprometido`, `Relacionar_CompVen_OT`), RN-04 (`RegistrarFinanciacion`) | Núcleo | O5 | Adoptado | Cada fuente produce exactamente un movimiento por documento origen (clave de idempotencia). |
| RF-INS-038 | **Job de registración de capital** idempotente por lote de facturación y por pagos, con progreso, reanudación y reporte de excepciones. | RN-06 §9 (`Guardar_CAPITAL_Th`, `Tipo_Registracion_Capital`: remito, factura, pago, pago y facturas, financiación, revisión), RN-02 (masiva) | Núcleo | O5 | Reemplazado por JOB-INS-01 (mejora del hilo de fondo) | Ejecutar dos veces el job sobre el mismo lote no duplica movimientos. |
| RF-INS-039 | **Modo revisión**: recalcular el capital de un período comparando movimientos esperados con registrados y proponer ajustes sin duplicar. | RN-06 §9 (modo "revisión", movimientos de más de 20 días), V2 2855 | Estándar | O10 | Adoptado | La revisión de un período ya correcto no propone ajustes. |
| RF-INS-040 | Cobrar **cuotas sociales en la factura del servicio** o en documento propio, con exhibición diferenciada del aporte respecto del precio del servicio, en documento, cuenta corriente y contabilidad. | BASE §97.7, MER-010, DFA M24 ("cobrada en la factura"), CAT `FACTURAS`/`SERVICIO` ↔ `CAPITAL` | Estándar | O5 | Adoptado (DEC-061; antes A validar PA-INS-02) | El comprobante muestra la cuota social en renglón propio con leyenda configurable y sin mezclarla con el abono. |
| RF-INS-041 | Registrar capital social incluido en **convenios y financiaciones** y su reversión si el convenio se anula. | RN-04 (`RegistrarFinanciacion` registra capital social; anulación borra `CAPITAL`) | Estándar | O6 | Adoptado | Anular un convenio genera contramovimientos de capital; no se borra ningún movimiento. |
| RF-INS-042 | **Reversión por anulación** de factura, nota de crédito o reversión de pago mediante contramovimientos vinculados. | RN-02 (anulación borra `CAPITAL`; `ValidarCapitalizacionEnFacturas`), RN-05 (anulación de pago borra `CAPITAL`) | Núcleo | O5 | Reemplazado por contramovimiento (mejora) | Después de anular, el saldo vuelve al previo y existen ambos movimientos con referencia cruzada. |
| RF-INS-043 | **Ajuste de capital** al modificar un comprobante (cambio de importe de producto). | RN-02 (`RegistrarCambios` inserta movimiento `CAPITAL` de ajuste) | Estándar | O5 | Adoptado | El ajuste referencia al comprobante y al cambio que lo originó. |
| RF-INS-044 | **Exclusión mutua** entre registración de capital y emisión de un lote sobre el mismo universo. | RN-02 (`IniciarProceso_Th` rechaza si `registracionCapitalEnProceso`) | Núcleo | O5 | Reemplazado por lock por universo (mejora) | Un lote no se bloquea por una registración de otro universo. |
| RF-INS-045 | **Estado de cuenta de capital** por asociado (pantalla, PDF, PWA) con descripciones configurables de los tipos. | RN-06 §9 (`Capital_CuentaSocio.cs`), INV `frmTitulares.VerMovimientosCapital`, `clsSocios_Capital.GetCapita_CuentaSocio`, V2 2314 | Núcleo | O5 | Adoptado | Las etiquetas "Vendido/Facturado/Pagado" son claves de diccionario editables por tenant. |
| RF-INS-046 | **Resumen de capital** por asociado, cuenta y servicio: suscripto, facturado, integrado, comprometido, reservado, pendiente de integrar, vencido. | CAT `CAPITAL_RES` (descripción de catálogo), DFA M24 | Núcleo | O5 | Adoptado | Pendiente = suscripto − integrado; vencido = pendiente con vencimiento < fecha de corte. |
| RF-INS-047 | Determinar **deuda de capital** a una fecha con umbral tolerado, para padrón y elegibilidad. | RN-06 §9 (`TieneDeudaCapital`), V2 2606, V2 2429, V2 240 | Estándar | O10 | A validar (PA-INS-07) | Un asociado con ARS 50 vencidos y umbral ARS 100 no tiene deuda de capital a efectos del padrón. |
| RF-INS-048 | **Reserva de capital** y su **recupero**: afectar capital integrado a un destino con concepto y comprobante configurables; tope = integrado salvo autorización. | RN-06 §9 (`Reserva`, `Recuperar`), CAT `CAPITAL_RES`, V2 753, 754, 2716, INV `frmRecuperoCapital`, `Capital_ReservaSocio`, `clsSocios_Capital.Registrar_CapitalReserva/Recuperar_CapitalReserva/GetCapitalReserva_Socio` | Estándar | O10 | Adoptado | Reservar más que lo integrado se rechaza salvo PRM-INS-023 activo y aprobación. |
| RF-INS-049 | **Transferencia de capital** entre asociados **de la misma entidad jurídica** (DEC-096) con aprobación del consejo, movimientos espejo y opción de transferir servicios y egresar al cedente. | RN-06 §7 (`TransferirCapital`), INV `frmTranferenciaCapital` (`TranferirCapital`, `Transferir_Servicios`, `cbDarBaja`), CAT `TRANSFER` tipo 3, `clsSocios_Capital.GetTransferencia` | Estándar | O10 | Adoptado | El capital total del tenant no cambia; el cedente baja y el cesionario sube el mismo importe. |
| RF-INS-050 | **Conservar capital al transferir una cuenta** (M01) a otra persona: el capital queda en el asociado origen con movimientos compensatorios si se elige conservar. | RN-06 §7 (`TransferirCuenta`, `ConservarCapital`) | Estándar | O10 | Adoptado | Transferir una cuenta no mueve capital salvo decisión explícita registrada. |
| RF-INS-051 | **Rescate / reembolso de capital** al egreso: solicitud, cálculo (integrado − compensaciones), aplicación del límite anual del estatuto, cola por orden de solicitud, aprobación del consejo, comprobante (tipo y concepto configurables), orden de pago en M14 y asiento en M15. | BASE §97.7, MER-011, AGR-029, RN-06 §9 (`Rescate_Acciones`), V2 2575, 2576, 2792 | Estándar | O10 | A validar (PA-INS-04) | Con límite anual agotado, la solicitud queda `queued` con su posición; al nuevo ejercicio se libera según orden. |
| RF-INS-052 | **Compensación** del reembolso con deuda exigible del asociado, previa autorización y constancia. | BASE §97.7, AGR-029 | Estándar | O10 | A validar (PA-INS-04) | Se genera crédito institucional imputado en M07 y el remanente va a pago. |
| RF-INS-053 | **Cierre de capital** por entidad jurídica (`capitalClosings.legalEntityId`; DEC-096): fecha hasta la cual no se admiten movimientos de esa entidad; reapertura solo con autorización. Al cerrar se congela la base de capital de la entidad a esa fecha (RF-INS-109). | V2 2785, INV `frmOpcionesEspeciales`; DEC-095; DEC-096 | Estándar | O10 | Adoptado | Un movimiento con fecha efectiva ≤ cierre se rechaza con `ins.capital.closed`. |
| RF-INS-054 | **Carga manual** de capital con motivo, adjunto y aprobación. | INV `frmCapitalManual` | Estándar | O10 | Adoptado | Sin aprobación, el movimiento queda `pending` y no afecta saldos. |
| RF-INS-055 | **Importación masiva** de saldos/movimientos de capital (migración o regularización) mediante ExcelImportWizard. | INV `frmMigracionCapital` | Estándar | O10 | Adoptado | La vista previa muestra errores por fila; confirmar crea movimientos `migration` conciliables. |
| RF-INS-056 | **Contabilización** de cada movimiento de capital vía evento hacia M15 según rubro y modo (suscribir al facturar o en la afiliación; integrar en el pago). | RN-08 §6.4 (73/2636/2916), RN-05 (2543: registrar capital al cerrar caja), RN-08 (`GetPagos` de capital) | Núcleo | O5 | Reemplazado por evento en línea (mejora del cierre diario) | Cada movimiento confirmado tiene un asiento asociado en M15 o figura como pendiente en la conciliación. |
| RF-INS-057 | **Distribución masiva de capital** entre asociados (por ejemplo, capitalización de un importe) según facturación del período o por asociado. | INV `frmDistribucionCapital` (`DistribuirCapital`, `chkFacturacion`, `chkSocios`), `Distribucion`, `DetalleDistribucion`, `FiltrosDistribucion`, `ResultadoDistribucion` | Estándar | O10 | A validar (PA-INS-11) [VERIFICAR semántica en ProCoop] | La suma distribuida es igual al importe a distribuir con redondeo asignado al último asociado. |
| RF-INS-058 | Validar **pendientes** antes de rescatar o transferir: comprobantes pendientes y servicios conectados. | `clsSocios_Capital.Existe_ComprobantePendiente`, `Posee_Servicios_Conectados`, `Cuenta_Posee_Servicio`, `GetCuentas_Socio` | Estándar | O10 | Adoptado | El rescate muestra comprobantes pendientes y exige decisión de compensar o esperar. |
| RF-INS-059 | **Exportar** capital por asociado y período (XLSX/CSV/PDF). | `clsSocios_Capital.Get_InfoExportar` | Estándar | O10 | Adoptado | La exportación respeta filtros y permisos. |
| RF-INS-109 | **Base de capital por entidad jurídica y fecha** (DEC-095, DEC-096), consumible por M06 para calcular las contribuciones propias del tenant que se liquidan sobre el capital (registro de obligaciones y exenciones propias de M06). M17 expone el servicio interno `ins.capitalBase.get({ legalEntityId, asOf })` y API-INS-071, que devuelven, para la entidad y la fecha: capital suscripto, integrado, pendiente de integrar, reservado, reembolsado en el ejercicio, rescates aprobados y no pagados (capital de egresados a devolver), cantidad de membresías activas, apertura por rubro (`capitalItemId`) y el estado de conciliación con M15 a esa fecha (REP-INS-06: diferencia por rubro y movimientos con `accountingStatus ≠ posted`). Si existe un cierre de capital de la entidad en `asOf` (RF-INS-053), devuelve la **base congelada** guardada en `capitalClosings.capitalBase` con `final = true` y `closingId`; si no, la calcula desde `capitalMovements` confirmados con `final = false`. Al cerrar (o volver a cerrar tras una reapertura) se publica EVT-INS-22 `ins.capitalBase.closed`, y al reabrir, `ins.capitalBase.reopened`, para que M06 recalcule o marque para revisión la obligación que usó esa base. M17 **no** decide qué componente es la base imponible ni calcula la contribución: eso lo define el contador en el registro de M06 (DEC-095, PA-FIS-25); M17 no precarga normas. | DEC-095; DEC-096; MER-011; REP-INS-05, REP-INS-06 | Estándar | O8 (prerrequisito del registro de obligaciones propias de M06; ver Guía §7) | Adoptado | Para COOP al 30-06-2026 con cierre registrado, el servicio devuelve `final = true` y los mismos importes en cada llamada aunque después se registren movimientos con fecha posterior; sin cierre devuelve `final = false`; los importes de MUTUAL no se mezclan con los de COOP; la suma por rubro coincide con el total; reabrir el cierre publica `ins.capitalBase.reopened`. |

### 5.4 Excedentes y retornos

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-INS-060 | Obtener el **excedente repartible** del ejercicio desde M15 por sección/servicio, separando operaciones con asociados y con no asociados. El ejercicio y la distribución son de una entidad jurídica (`fiscalYears.legalEntityId` de M15; `surplusDistributions.legalEntityId`; DEC-096) y los retornos se asignan solo a membresías de esa entidad. | MER-011, Ley 20.337 (distribución de excedentes); DEC-096 | Estándar | O10 | Adoptado | El excedente con no asociados se informa por separado y no genera retornos. |
| RF-INS-061 | Aplicar el **esquema de distribución** configurable: reserva legal, fondo de acción asistencial y laboral, fondo de educación y capacitación cooperativas, interés a cuotas sociales (si el estatuto lo autoriza, con tope), retorno a asociados y otros destinos aprobados. | Ley 20.337 (distribución de excedentes) [VERIFICAR porcentajes y topes], MER-011 | Estándar | O10 | Adoptado | Con excedente ARS 1.000.000 y 5 %/5 %/5 %, los fondos reciben ARS 50.000 cada uno antes del retorno. |
| RF-INS-062 | **Simular** la distribución (escenario aislado) con criterio de retorno: proporcional a facturación/uso por servicio, a capital integrado o a otro criterio aprobado. | MER-011, BASE §33 "Escenario de simulación" | Estándar | O10 | Adoptado | La simulación no genera movimientos y puede exportarse para la asamblea. |
| RF-INS-063 | Vincular la distribución con la **resolución de asamblea** que la aprueba; sin resolución no se ejecuta. | MER-011 ("según lo resuelva la asamblea") | Núcleo | O10 | Adoptado | Ejecutar sin `resolutionId` aprobado se rechaza. |
| RF-INS-064 | **Ejecutar** la distribución por asociado: capitalización (movimiento de capital), crédito en cuenta corriente (M07) o pago (M14), con constancia individual y asiento. | MER-011 | Estándar | O10 | A validar (PA-INS-11) | La suma de asignaciones = importe aprobado para retornos; cada asociado tiene una constancia. |
| RF-INS-065 | Tratamiento de **retornos de egresados o no localizables** (a pagar, a reserva, prescripción configurable). | MER-011 | Extensión | O10 | A validar (PA-INS-11) | Los retornos no cobrados quedan en una cuenta de pasivo identificada por asociado. |
| RF-INS-066 | **Informe de distribución** por asociado, servicio y destino. | MER-011 | Estándar | O10 | Adoptado | El informe concilia con el asiento de distribución. |

### 5.5 Órganos sociales y mandatos

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-INS-067 | ABM de **órganos** de cada entidad jurídica (`governanceBodies.legalEntityId`; DEC-096: el consejo de la cooperativa y el consejo directivo de la mutual son órganos distintos; los mandatos exigen membresía activa en la misma entidad): consejo de administración, sindicatura, comisión fiscalizadora, junta electoral, comisiones internas; con composición estatutaria (cantidad de titulares y suplentes por cargo). | CAT `CONSEJO.TIP_CSJ`, INV `abm_Consejo`, BASE §27 "Autoridades y mandatos" | Estándar | O10 | Adoptado | Un órgano no admite más mandatos vigentes que los cargos definidos. |
| RF-INS-068 | Registrar **mandatos**: persona asociada (de M01), cargo (presidente, vicepresidente, secretario, prosecretario, tesorero, protesorero, vocal titular, vocal suplente, síndico titular, síndico suplente, otros), fecha de inicio y fin, asamblea y acta que lo eligió, renovación parcial. | CAT `CONSEJO` (`DOC_CSJ`, `CAR_CSJ`, `NOM_CSJ`), `ConsejoResult` | Estándar | O10 | Adoptado | Todo mandato referencia una persona existente (no texto libre) y una resolución de elección. |
| RF-INS-069 | **Validaciones** de mandato: asociado activo; sin superposición del mismo cargo; incompatibilidades configurables (síndico y consejero; empleado y consejero). | Ley 20.337 (incompatibilidades) [VERIFICAR], AGR-008 | Estándar | O10 | Adoptado | Designar como síndico a un consejero vigente se rechaza con `ins.mandate.incompatible`. |
| RF-INS-070 | **Alertas** de vencimiento de mandatos y de asamblea de renovación. | BASE §27 | Estándar | O10 | Adoptado | 60 días antes del vencimiento se notifica a secretaría (PRM-INS-030). |
| RF-INS-071 | **Nómina de autoridades** vigente e histórica exportable (INAES, bancos, organismos) y **firmantes autorizados** derivados de los cargos. | BASE §27, MER-014 | Estándar | O10 | Adoptado | La nómina a una fecha muestra solo mandatos vigentes a esa fecha. |

### 5.6 Reuniones, asambleas, padrones, votaciones y actas

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-INS-072 | ABM de **reuniones** de una entidad jurídica (`meetings.legalEntityId`, igual a la del órgano; DEC-096) por tipo: consejo (ordinaria/extraordinaria), sindicatura, comisión, asamblea ordinaria, asamblea extraordinaria, asamblea de distrito, asamblea de delegados; con fecha de registro, fecha programada, inicio, fin, estado, asunto, modalidad (presencial, a distancia, mixta), lugar o enlace y observaciones. | CAT `REUNIONES` (`FECHA`, `COD_USER`, `FECHA_REU`, `FECHA_INICIO`, `FECHA_FIN`, `ESTADO`, `ASUNTO`, `OBSERVACION`), `EstadoReunion`, `ReunionConsejoRequest/Result`, `GetReunionesConsejoRequest` | Estándar | O10 | Adoptado | Una reunión cerrada no admite cambios salvo reapertura autorizada. |
| RF-INS-073 | **Orden del día**: temas ordenados con observaciones, resolución, marca de tratado y vínculo opcional a un caso CRM, reclamo o expediente de mesa de entradas. | CAT `REUNIONES_TEMAS` (`ORDEN_DIA`, `OBSERVACIONES`, `RESOLUCION`, `TRATADO`, `COD_REC`), `ReunionTemaRequest/Result`, `EditarReunionTemaRequest`, `ReunionReclamoInfo`, `ReunionMesaEntradaResult`, `ReclamoConsejoResult`, `ResolucionTemaActa`, `ResolucionReunion` | Estándar | O10 | Adoptado | Un reclamo elevado al consejo muestra en el CRM el tema, la reunión y la resolución. |
| RF-INS-074 | **Participantes y asistencia** de reuniones: integrante de órgano (mandato), empleado, invitado externo o asociado; presente/ausente/justificado. | CAT `REUNIONES_ASIST` (`ID_CSJ`, `COD_EMP`, `NOM_EXT`, `ASISTIO`), `ReunionAsistenteRequest/Result`, `EditarReunionAsistenteRequest` | Estándar | O10 | Adoptado | El quórum del consejo se calcula sobre mandatos titulares vigentes. |
| RF-INS-075 | **Permisos por reunión**: usuarios habilitados a ver o editar una reunión reservada. | CAT `REUNIONES_PERMISOS` (`COD_EMP`, `COD_REU`) | Estándar | O10 | Adoptado | Un usuario sin permiso no ve la reunión aunque tenga `ins.reuniones.ver`. |
| RF-INS-076 | **Convocatoria de asamblea**: orden del día, documentación (memoria, estados contables de M15, informe del síndico, informe del auditor, proyecto de distribución de excedentes, padrón), plazos mínimos, comunicación al INAES y al órgano local, publicación por canales (T09: muro, landing, correo, WhatsApp, cartelera). | BASE §27 (CU-27), DFA M24 (mejora "convocatoria y registro de asistencia"), Ley 20.337 (convocatoria) [VERIFICAR plazos] | Estándar | O10 | Adoptado | Publicar una convocatoria con menos días que PRM-INS-033 se bloquea con advertencia. |
| RF-INS-077 | **Asamblea a distancia o mixta**: plataforma y enlace, validación de identidad, registro de conexión y constancias, según la resolución del INAES vigente. | Normativa INAES de asambleas a distancia [VERIFICAR], DEC-007 | Extensión | O10 | A validar (PA-INS-05) | Cada participante remoto queda registrado con hora de ingreso y egreso. |
| RF-INS-078 | **Padrón** versionado **de una entidad jurídica** (`rosters.legalEntityId`, igual a la de la asamblea; solo incluye membresías de esa entidad, y la deuda de capital del criterio se mide sobre el capital de esa entidad; DEC-096): fecha de corte, criterios de elegibilidad (versión), estado preliminar → observado → definitivo aprobado; nueva versión ante cambio de criterio conservando la anterior. | BASE §27 (CU-27), DFA M24 (mejora "padrón de asociados para asambleas"), `clsPadronTitular.Get_Padron/Get_Padron2/Get_Informe_Padron`, `Padron_Titular`, `Modo_Padron` | Estándar | O10 | Adoptado | Cambiar un criterio luego de aprobar crea la versión 2 y deja la 1 consultable. |
| RF-INS-079 | **Filtros del padrón**: fecha límite de alta, deuda de capital con umbral y fecha, deuda anterior, sin factura desde, servicio desde/hasta, baja posterior al corte, más de N facturas impagas (con o sin marca), distrito, estado del titular, solo titulares/asociados, importar lista, y columnas configurables. | INV `frmPadronTitulares` (filtros `chMarcarCapital`, `chMarcarDeudaAnterior`, `chMarcarFactura`, `chMarcarServicioDesde/Hasta`, `chNoIncluirConBajaPosterior`, `chNoIncluirFactura`, `chNoIncluirServicio`, `chSoloDeudaCapital`, `chkImportar`, `chkNoIncluirDeudaMasDeXFacturasMarca`, `chkNoIncluirDeudaMasDeXFacturas`, `cbDistritos`, `cbEstadoTitular`, `cbIncluirDeuda`, `txtFechaDeuda`), `Filtros_Padron` (`chFechaAltaAnterior`, `chNoIncluirConDeudaAnterior`, `chNoIncluirSinFacturaDesde`, `chNoIncluirSinServicioDesde`), `frmPadronTitulares_Columnas`, V2 2428, 2429, 2430, 2606 | Estándar | O10 | A validar (PA-INS-07) | Cada asociado excluido muestra el criterio que lo excluyó. |
| RF-INS-080 | **Guardar conjuntos de filtros** del padrón por tenant y reutilizarlos. | V2 50 (`GuardarFiltros`), INV `frmPadronTitulares_Filtros.Save` | Estándar | O10 | Adoptado | Un conjunto guardado reproduce el mismo padrón sobre los mismos datos. |
| RF-INS-081 | **Exhibición y observaciones** del padrón: consulta por el asociado en PWA ("¿estoy habilitado?"), reclamo de inclusión con plazo, resolución de la junta electoral o secretaría. | BASE §27 ("revisar observaciones"), AGR-032 | Estándar | O10 | Adoptado | Un reclamo resuelto favorablemente genera la versión siguiente del padrón con la inclusión. |
| RF-INS-082 | **Acreditación y asistencia** a asamblea: lectura de credencial QR o documento, hora, firma en libro de asistencia (digital o impresa), poderes presentados, cálculo de quórum en vivo, primer y segundo llamado. | DFA M24 (mejora "registro de asistencia"), `GetDatosInforme.Imprimir_AsistenciaAsamblea`, `clsPadronTitular.Get_Informe_Asamblea`, Ley 20.337 (quórum) [VERIFICAR] | Estándar | O10 | Adoptado | Al alcanzar el quórum configurado, la pantalla lo indica; un asociado no habilitado no se acredita con voto. |
| RF-INS-083 | **Poderes / representaciones**: registro, validación (estatuto lo admite, mandatario habilitado, tope de representados), revocación. | `clsPadronTitular.Get_Informe_Representados`, AGR-007 | Estándar | O10 | Adoptado | Un mandatario con el tope alcanzado no puede recibir otro poder. |
| RF-INS-084 | **Delegados**: elección en asambleas de distrito, nómina de titulares y suplentes por distrito, mandato hasta la asamblea siguiente, informe. | `clsPadronTitular.Get_Informe_Delegados`, `SOCIOS.REP_ASAMBLEA`, Ley 20.337 (asambleas de distrito) [VERIFICAR] | Estándar | O10 | Adoptado | La asamblea de delegados usa como padrón la nómina de delegados vigentes. |
| RF-INS-085 | **Junta electoral y listas**: presentación de listas de candidatos, avales, oficialización, impugnaciones y resolución. | BASE §27 "Autoridades y mandatos" | Estándar | O10 | Adoptado | Solo listas oficializadas se presentan a votación. |
| RF-INS-086 | **Votación formal** por tema o elección: modalidad (mano alzada, nominal, secreta con urna, electrónica si se habilita), mayoría requerida (simple, absoluta, dos tercios), votos afirmativos, negativos, abstenciones, en blanco y nulos; escrutinio por lista; informe de votación. Es independiente de las encuestas de T09. | `clsPadronTitular.Get_Informe_Votacion`, BASE §27 "Asambleas… Actas y resoluciones" | Estándar | O10 | A validar (PA-INS-05) | Un resultado que no alcanza la mayoría configurada queda "no aprobado"; un asociado vota una sola vez (más sus poderes válidos). |
| RF-INS-087 | **Actas**: número correlativo por libro (consejo, asamblea, sindicatura) **y por entidad jurídica** (DEC-096: el acta hereda `meetings.legalEntityId` y cada entidad lleva sus propios libros de actas; `numberingSequences` de T11 con clave `ins.minuteBook:<bookType>:<legalEntityCode>`; antes `ins.minuteBook:<libro>` por tenant; [VERIFICAR] con el asesor legal si la norma permite que alguno de estos libros, por ejemplo el de asistencia o el de actas internas, se comparta entre entidades del mismo tenant), fecha de registro, reunión, contenido generado desde el orden del día y resoluciones, PDF, estado de firma y firmantes; actas internas y de mesa de entradas. | CAT `ACTAS` (`FECHA_REG`, `COD_REU`, `NUM_ACT`, `ESTADO_FIRMA`, `CONTENIDO_PDF`), `ActaReporte`, `ActaResult`, `ActaTemaReporte`, `ActaInternaReporte`, `ActaMesaEntradaResult`, `FiltroInformeActa` | Estándar | O10 | Adoptado | El número de acta no se repite dentro de su libro y entidad; el acta N.º 15 del libro de consejo puede existir a la vez en COOP y en MUTUAL; el PDF incluye todos los temas tratados. |
| RF-INS-088 | **Firma** de actas por los firmantes requeridos y bloqueo posterior; correcciones solo mediante acta posterior o fe de erratas vinculada. La firma la ejecuta T11 con el perfil **SIG-ACTA-INSTITUCIONAL** (nivel `digital`, T11 §18.5, DEC-078; O8/O9); M17 solo pide la firma, guarda la referencia y bloquea el acta al recibir el resultado. | CAT `ACTAS.ESTADO_FIRMA`; DEC-078; T11 §18.5 | Estándar | O10 | Adoptado (DEC-078; antes A validar PA-INS-08) | Un acta firmada no se puede editar; la corrección referencia el acta original. La solicitud de firma de un acta de consejo usa el perfil SIG-ACTA-INSTITUCIONAL. |
| RF-INS-089 | **Resoluciones y seguimiento de decisiones**: responsable, plazo, estado, vínculo con objetos afectados (ingresos de asociados, rescates, distribución, honorarios, tarifas, reglamentos). | BASE §27 "Seguimiento de decisiones" | Estándar | O10 | Adoptado | La bandeja muestra resoluciones vencidas sin cumplir. |
| RF-INS-090 | **Documentación institucional** versionada: estatuto, reglamentos, memoria, estados contables, informes; expediente por asamblea (T11). | BASE §27 "Documentación institucional", "Documentos e informes institucionales" | Estándar | O10 | Adoptado | Cada asamblea tiene expediente con todos los documentos y sus versiones. |
| RF-INS-091 | **Presentación post-asamblea** al INAES y órgano local dentro del plazo configurado, con acuse. | Normativa INAES [VERIFICAR plazo] | Estándar | O10 | Adoptado | La tarea vence según PRM-INS-036 y aparece en la bandeja. |
| RF-INS-092 | **Libros de actas digitales** (consejo, asamblea, sindicatura, asistencia) exportables en PDF/A foliado con hash. Cada libro es **de una entidad jurídica** (DEC-096): la edición incluye solo actas de esa entidad y su foliado es correlativo dentro de ella (`ins.minuteBook:<bookType>:<legalEntityCode>`). [VERIFICAR] con el asesor legal si algún libro social puede compartirse entre entidades del tenant; mientras no se confirme, ninguno se comparte. | Ley 20.337 (libros obligatorios) [VERIFICAR], MER-011 | Estándar | O10 | A validar (PA-INS-09) | La edición del libro incluye todas las actas firmadas del período en orden. |
| RF-INS-093 | **Publicar resultados** (autoridades electas, resoluciones públicas) en muro, landing y PWA según audiencia (T09). | DEC-008, BASE §27 | Extensión | O10 | Adoptado | Una resolución marcada reservada no se publica. |
| RF-INS-094 | **Informe de asistencia** a asamblea por asociado y distrito. | `GetDatosInforme.Imprimir_AsistenciaAsamblea`, V2 2428, 2429 | Estándar | O10 | Adoptado | El informe coincide con los registros de acreditación. |

### 5.7 Honorarios institucionales

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-INS-095 | Registrar la **retribución aprobada** por asamblea: cargos alcanzados, importe o fórmula, periodicidad, vigencia y resolución. | BASE §104.3, Ley 20.337 (retribución de consejeros) [VERIFICAR] | Estándar | O10 | Adoptado | No se liquida un honorario sin resolución vigente. |
| RF-INS-096 | **Liquidar** honorarios por período y mandato vigente, generando obligación a pagar (orden de pago M14) con retenciones de M06 y asiento M15; no se procesan como sueldo. | BASE §104.3 | Estándar | O10 | A validar (PA-INS-10) | El honorario de un consejero con mandato terminado a mitad de mes se prorratea según PRM-INS-038. |
| RF-INS-097 | **Reintegro de gastos** de consejeros y síndicos con comprobantes y aprobación. | BASE §104.3 | Extensión | O10 | Adoptado | Un reintegro sin comprobante adjunto no se aprueba. |
| RF-INS-098 | **Informe de honorarios** por período, persona y cargo. | BASE §104.3 | Estándar | O10 | Adoptado | Concilia con pagos de M14. |

### 5.8 Relación entre baja de servicio y egreso (AGR-029)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-INS-099 | La **baja de un servicio no produce egreso** ni devolución de capital. | AGR-029 (ejemplo Internet) | Núcleo | O2 | Adoptado | Dar de baja Internet deja la membresía `active` y el capital intacto. |
| RF-INS-100 | Al quedar un asociado **sin servicios**, alertar a secretaría e informar si es adherente, beneficiario o garante en otros contratos; ofrecer, sin ejecutar, el inicio de un trámite de egreso. | V2 2571, V2 2324 | Estándar | O10 | Adoptado | Se crea una alerta `ins.member.withoutServices`; no cambia el estado. |
| RF-INS-101 | El **egreso no da de baja servicios** automáticamente; según configuración, exige baja o transferencia previa de los servicios o permite egresar conservando la condición de cliente. | V2 340, V2 741, V2 734 | Núcleo | O10 | Adoptado | Con PRM-INS-008 = permitir, el ex asociado continúa como cliente no asociado y M05 sigue facturando si PRM-INS-009 lo permite. |
| RF-INS-102 | Egreso con **capital integrado**: bloquear o exigir trámite de rescate iniciado. | V2 337 | Estándar | O10 | Adoptado | Con PRM-INS-007 activo, el egreso sin rescate iniciado se rechaza. |

### 5.9 Transversales

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-INS-103 | **Privacidad**: inventario de datos institucionales con finalidad y conservación; padrones exhibidos con minimización (documento enmascarado); exportaciones con permiso específico. | BASE §97.1, AGR-033 | Núcleo | O10 | Adoptado | El padrón publicado al asociado muestra solo número, nombre y habilitación. |
| RF-INS-104 | **Auditoría** completa de altas, cambios de estado, movimientos de capital, aprobaciones, firmas y exportaciones. | T02 IAM, AGR-010 | Núcleo | O2 | Adoptado | Cada operación tiene evento de auditoría con actor, tenant, antes/después. |
| RF-INS-105 | **Aislamiento por tenant** de membresías, capital, padrones y actas. | DEC-002, BASE §3 (requisito multitenant), MT-004 | Núcleo | O2 | Adoptado | Un usuario de A no obtiene registros de B por ningún endpoint. |
| RF-INS-106 | **Portal del asociado** (renderizado por M19): estado, número, antigüedad, capital, credencial digital, convocatorias, documentos públicos, padrón propio, solicitudes de ingreso, egreso, poder y reclamo de padrón. | BASE §25, §27, §97.7 | Estándar | O10 | Adoptado | Un cliente no asociado ve la opción "Asociarme" y no ve capital. |
| RF-INS-107 | Términos visibles por **diccionario** (asociado/socio/titular, cuota social/acción). | BASE §65 | Núcleo | O2 | Adoptado | Cambiar `dict:ins.associate` a "Socio" se refleja en admin y PWA. |
| RF-INS-108 | **Recordatorios institucionales**: asamblea ordinaria dentro del plazo legal desde el cierre de ejercicio, mandatos, presentaciones INAES, rescates en cola. | Ley 20.337 (plazo de asamblea ordinaria) [VERIFICAR], BASE §27 | Estándar | O10 | Adoptado | Con cierre de ejercicio 30-06, la alerta de asamblea aparece según PRM-INS-035. |

## 6. Reglas de negocio

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | Verificación |
|---|---|---|---|---|---|
| RN-INS-001 | Asociado, titular, cliente, pagador, usuario y empleado son relaciones distintas; la membresía no activa servicios ni la baja de servicio extingue la membresía. | `SOCIOS` mezcla titular y asociado mediante `ACTIVO` (RN-06 §2). | **Mejorar**: membresía como entidad propia (M17) vinculada a la persona (M01). | — | — |
| RN-INS-002 | El número de asociado es único, correlativo y no reutilizable. | `NUM_SOC` = máximo entre activos + 1 (`Get_NumeroSiguiente`); se reutilizan números si el máximo baja; `ValidarNumeroAsociado` controla unicidad. | **Mejorar**: secuencia monotónica por entidad jurídica (`numberingSequences` de T11 con clave `ins.memberNumber:<legalEntityCode>`, CTR-DAT-16; antes `insNumberingSeries`; DEC-096, RF-INS-002), sin reutilizar. *Reemplazado (10-11-2026, DEC-096): "secuencia monotónica por tenant"* | PRM-INS-001, PRM-INS-002 | — |
| RN-INS-003 | Doble numeración socio/cliente. | V2 32: numeración de activos separada de no activos (`GetIdSocio`). | **Reemplazar**: el cliente no asociado no recibe número de asociado; su identificador es el de cuenta (M01). | V2 32 → Descartado | — |
| RN-INS-004 | La persona registrada no es asociado hasta la aprobación. | V2 2591 carga nuevos socios como no activos por defecto. | **Replicar** como estado `applicant`/`pendingApproval`. | PRM-INS-005 | — |
| RN-INS-005 | Servicios que exigen membresía activa. | V2 734 "NO permitir servicios en titulares NO activos". | **Replicar** por servicio (configurable en M02). | PRM-INS-006 | — |
| RN-INS-006 | No facturar a ex asociados. | V2 741 "No permitir Facturar a Titulares dados de baja". | **Replicar** como política que M05 consulta; M17 publica `ins.membership.exited`. | PRM-INS-009 | — |
| RN-INS-007 | Egreso con servicios activos. | `PermiteDardeBaja`: no por defecto; V2 340 lo permite. | **Replicar**. | PRM-INS-008 | — |
| RN-INS-008 | Egreso con capital integrado. | V2 337 bloquea la baja si hay capital integrado. | **Mejorar**: bloquea salvo que exista rescate iniciado o renuncia expresa documentada al reembolso cuando el estatuto lo admita. | PRM-INS-007 | [VERIFICAR] renuncia al reembolso |
| RN-INS-009 | Egreso de personas sin cuenta. | V2 2633 permite dar de baja a socios sin cuenta. | **Replicar** (default permitido: la membresía no depende de cuentas). | PRM-INS-011 | — |
| RN-INS-010 | Transferencias de cuentas a ex asociados. | V2 2552. | **Replicar** configurable (default no permitido). | PRM-INS-012 | — |
| RN-INS-011 | Asociado sin cuentas. | V2 2324 impide socios sin cuentas y pregunta si dar de baja al origen. | **Mejorar**: el asociado puede no tener servicios; se alerta (RF-INS-100) sin bloquear. | PRM-INS-013 | — |
| RN-INS-012 | Un rubro de productos pertenece a un solo rubro de capitalización. | `Exist_Rubro_Rubcapi` (RN-08 §5). | **Replicar**. | — | — |
| RN-INS-013 | Capitalización automática. | Se capitaliza si existen rubros `RUBCAPI` y no V2 2736 (RN-02). | **Replicar** con interruptor por tenant. | PRM-INS-014 | — |
| RN-INS-014 | Momento de suscripción e integración. | V2 73 suscribe al facturar; V2 2636 suscribe en la afiliación; V2 2916 integra en el pago (RN-08 §6.4). | **Replicar** configurable. | PRM-INS-015, PRM-INS-016, PRM-INS-017 | — |
| RN-INS-015 | Integración proporcional al pago. | `_Pagos`: proporción pago/total del comprobante (RN-06 §9). | **Replicar** con `decimal.js`, redondeo a 2 decimales y ajuste en el último pago para cerrar el capital del comprobante. | — | — |
| RN-INS-016 | Registración asincrónica de capital. | `Guardar_CAPITAL_Th` en hilo de fondo por `Tipo_Registracion_Capital`; V2 2855 desactiva el registro automático salvo modo revisión o movimientos de más de 20 días. | **Reemplazar**: registro en línea por evento (outbox) + JOB-INS-02 de revisión. | PRM-INS-018 | — |
| RN-INS-017 | Registración de integración al cerrar la caja. | Cierre de caja registra capital pagado salvo V2 2543. | **Reemplazar**: integración al evento `cob.payment.confirmed`; el cierre de caja solo concilia. RF-COB-176 de M07 es únicamente esa conciliación de cierre (capital cobrado en la sesión contra integraciones registradas por M17) y nunca registra integraciones (HUECO-CAP-02). | V2 2543 → Reemplazado | — |
| RN-INS-018 | Exclusión entre emisión y registración de capital. | Facturación masiva no inicia si hay registración en curso (RN-02). | **Mejorar**: lock por universo y período. | — | — |
| RN-INS-019 | Reversión de comprobantes con capital. | `ValidarCapitalizacionEnFacturas`; la anulación **borra** filas de `CAPITAL` (RN-02), igual que la anulación de pagos (RN-05) y de convenios (RN-04). | **Reemplazar**: contramovimiento; nunca borrar. | — | — |
| RN-INS-020 | Ajuste de capital al cambiar un comprobante. | `RegistrarCambios` inserta movimiento de ajuste (RN-02). | **Replicar**. | — | — |
| RN-INS-021 | Deuda de capital para votar. | `TieneDeudaCapital`: deuda de capital > V2 2606 a la fecha de la próxima asamblea (V2 2429). | **Replicar** como criterio configurable del padrón (no universal). | PRM-INS-019, PRM-INS-020 | PA-INS-07 |
| RN-INS-022 | Reserva de capital. | `Reserva`/`Recuperar`; V2 2716 permite reservar más que lo integrado; concepto V2 753 y comprobante V2 754. | **Replicar**. | PRM-INS-021, PRM-INS-022, PRM-INS-023 | — |
| RN-INS-023 | Rescate de acciones. | `Rescate_Acciones` genera comprobante de tipo V2 2792 por el capital a devolver; concepto V2 2575 y comprobante V2 2576. | **Mejorar**: rescate con cálculo, límite anual, cola, aprobación y pago (RF-INS-051). | PRM-INS-024, PRM-INS-025, PRM-INS-026, PRM-INS-027, PRM-INS-028 | PA-INS-04 |
| RN-INS-024 | Cierre de capital. | V2 2785 "Fecha de Cierre de Capital" (`Nucleo.GetFechaCierre`). | **Replicar** como `capitalClosings` versionado. | PRM-INS-029 | — |
| RN-INS-025 | Fecha del movimiento de capital facturado. | V2 240 "Capital procesado por fecha de vencimiento" (sin uso directo relevado). | **Replicar** como opción: fecha efectiva = vencimiento 1 en lugar de emisión. | PRM-INS-031 | [VERIFICAR] uso en CoopOnline/Agente |
| RN-INS-026 | Descripciones de movimientos. | V2 2314 "Vendido\|Facturado\|Pagado". | **Reemplazar** por claves de diccionario. | — | — |
| RN-INS-027 | Transferencia de capital. | `TransferirCapital` con movimientos espejo; `ConservarCapital` al transferir cuenta. | **Replicar** con aprobación (T11). | — | — |
| RN-INS-028 | Límite de reembolso anual y orden. | No relevado en ProCoop. | **Adoptar**: límite anual configurable (por defecto 5 % del capital integrado según último balance aprobado) y orden por fecha de solicitud; saldo pendiente devenga interés si el estatuto lo prevé. | PRM-INS-026, PRM-INS-027 | Ley 20.337 [VERIFICAR] |
| RN-INS-029 | Cuotas sociales iguales e indivisibles; integración mínima al suscribir y plazo máximo de integración. | No relevado. | **Adoptar** como validación configurable (por defecto 5 % al suscribir y 5 años). | PRM-INS-039, PRM-INS-040 | Ley 20.337 [VERIFICAR] |
| RN-INS-030 | Un asociado, un voto, con independencia del capital. | Implícito en padrón. | **Adoptar**. | — | Ley 20.337 |
| RN-INS-031 | Fecha límite de alta para votar. | V2 2428 "Fecha Límite de Alta de Titular para asistencia a la Asamblea". | **Replicar** como criterio del padrón. | PRM-INS-032 | — |
| RN-INS-032 | Solo titulares asisten. | V2 2430 "Permitir solo Titulares para la asistencia". | **Mejorar**: solo membresías habilitadas en el padrón (excluye adherentes, beneficiarios y clientes). | — | — |
| RN-INS-033 | Versión anterior del padrón. | V2 2608 "Obtener el padrón con la versión anterior". | **Descartar** (algoritmo legado); la versión anterior del padrón CoopApps se conserva por diseño. | — | — |
| RN-INS-034 | Fecha de asamblea en el título del padrón. | V2 2616. | **Replicar** tomando la fecha de la reunión vinculada (no parámetro libre). | — | — |
| RN-INS-035 | Quórum de asamblea. | No relevado. | **Adoptar**: mitad más uno de los asociados habilitados; transcurrido el tiempo configurado (por defecto 60 min) se sesiona con los presentes, según estatuto. | PRM-INS-034 | Ley 20.337 [VERIFICAR] |
| RN-INS-036 | Anticipación de la convocatoria y comunicación al INAES. | No relevado. | **Adoptar** por defecto 15 días corridos. | PRM-INS-033 | [VERIFICAR] |
| RN-INS-037 | Asamblea ordinaria dentro del plazo desde el cierre del ejercicio. | No relevado. | **Adoptar** alerta (por defecto 4 meses). | PRM-INS-035 | [VERIFICAR] |
| RN-INS-038 | Asambleas de distrito/delegados cuando el número de asociados supera el umbral. | `Get_Informe_Delegados`. | **Adoptar** alerta y modelo de distritos (umbral por defecto 5.000). | PRM-INS-041 | [VERIFICAR] |
| RN-INS-039 | Distribución de excedentes. | No relevado. | **Adoptar** esquema configurable: 5 % reserva legal, 5 % fondo de acción asistencial y laboral, 5 % fondo de educación y capacitación, interés a cuotas sociales si lo autoriza el estatuto (tope configurable), retorno a asociados; excedente de operaciones con no asociados a reserva especial. | PRM-INS-042 a PRM-INS-045 | Ley 20.337 [VERIFICAR] |
| RN-INS-040 | Honorarios requieren resolución de asamblea y no son sueldo. | — | **Adoptar** (BASE §104.3). | PRM-INS-038 | — |
| RN-INS-041 | Actas firmadas son inmutables. | `ACTAS.ESTADO_FIRMA`. | **Mejorar**: bloqueo, hash y fe de erratas. | — | — |
| RN-INS-042 | Mandatos sin superposición; mandatario asociado activo; incompatibilidades. | `CONSEJO` sin vigencia ni vínculo a persona. | **Mejorar**: mandato con vigencia y `personId` obligatorio. | PRM-INS-046 | [VERIFICAR] incompatibilidades legales |
| RN-INS-043 | La baja de un servicio no es egreso ni reembolso; cobrar un aporte no es ingreso por consumo. | — | **Adoptar** (AGR-029). | — | — |
| RN-INS-044 | El padrón preliminar no certifica validez legal ni reemplaza decisiones de órganos. | — | **Adoptar** (BASE §27): leyenda obligatoria en padrones no aprobados. | — | — |
| RN-INS-045 | Si cambia una condición de elegibilidad, se conserva la versión previa y se requiere revisión. | — | **Adoptar** (CU-27). | — | — |
| RN-INS-046 | Exportación INAES por lotes. | V2 3091 "INAES - Cantidad de registros por lote". | **Replicar**. | PRM-INS-047 | — |
| RN-INS-047 | Capital anterior en el registro de asociados. | V2 3027 "Informar capital anterior en registro de asociados". | **Replicar** como opción del libro. | PRM-INS-048 | — |
| RN-INS-048 | Fallecimiento extingue la membresía; derechohabientes acreditados pueden solicitar el reembolso. | `SetFechaFallecimiento` da de baja vínculos (RN-06 §10). | **Mejorar** con trámite de reembolso a derechohabientes. | — | [VERIFICAR] requisitos sucesorios |
| RN-INS-049 | Validar deuda en el domicilio al ingresar (anti "cambio de titular para esquivar deuda"). | `clsSocios_Capital.Validar_DeudaDomicilio`, V2 2669 (RN-06 §3.1). | **Delegar** a M01 (regla de titularidad); M17 solo muestra el aviso en la solicitud de ingreso. | V2 2669 → M01 | — |
| RN-INS-050 | Reingreso y numeración. | `ACTIVOBAJA` conserva numeración de activo (V2 2673); `ModificacionEspecial_Socio` "recupera" al socio borrando la baja. | **Mejorar**: reingreso como evento con historia (no se borra el egreso). | PRM-INS-010 | — |
| RN-INS-051 | Un asociado con membresía `suspended` no vota ni es elegible, pero conserva capital y antigüedad. | — | **Adoptar**. | — | Estatuto |
| RN-INS-052 | Importes con `Decimal128`; capital en ARS salvo configuración. | — | **Adoptar** (convenciones). | — | — |
| RN-INS-053 | **Membresía por entidad jurídica (DEC-096).** Toda membresía tiene `legalEntityId` obligatorio, fijado en la solicitud e inmutable (cambiar de entidad es egresar de una y solicitar ingreso en otra). Solo admiten membresías las entidades con PRM-INS-058 = `true` (por defecto `true` para `legalForm` `cooperativa`, `mutual` y `asociacionCivil`, y `false` para `sociedad` y `otra`). Todo registro derivado hereda la entidad y debe coincidir con la de la membresía: `capitalMovements`, `capitalReserves`, `capitalTransfers` (cedente y cesionario de la misma entidad), `capitalRefunds`, `shareCertificates`, `surplusAllocations`, `bodyMandates` (órgano y membresía de la misma entidad), `rosterEntries` (padrón y membresía de la misma entidad), `memberCredentials` e `institutionalFeeSettlements`. Los parámetros de M17 se resuelven con la entidad de la membresía o de la reunión (ámbito `legalEntity` de T04, RF-CFG-019). | `SOCIOS` sin empresa: un socio por base de datos. | **Mejorar** (DEC-064, DEC-096). | PRM-INS-058; PRM-CFG-039 | — |
| RN-INS-054 | **Base de capital (DEC-095).** La base de capital de una entidad a una fecha sale solo de `capitalMovements` confirmados de esa entidad con `effectiveDate ≤ asOf`; con cierre de capital en `asOf` se usa la copia congelada del cierre. La reapertura de un cierre no borra la copia anterior: la conserva en el historial del cierre y publica `ins.capitalBase.reopened`. | ProCoop no expone base de capital; `CAPITAL_RES` da suscripto y vendido. | **Adoptar**. | PRM-INS-029 | PA-FIS-25 (componente de base que usa cada contribución) |

## 7. Modelo de datos

Todas las colecciones llevan además `tenantId` (ObjectId, obligatorio, primer campo de todo índice compuesto), `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `version` (control optimista) y, cuando aplica, `recordedAt` y `deletedAt`. Los movimientos económicos (`capitalMovements`, `capitalRefunds`, `surplusAllocations`, `institutionalFeeSettlements`) **nunca se borran**: se revierten o anulan. Importes en `Decimal128` con `decimal.js`.

> **Corrección 05-11-2026 (tablas de campos):** las colecciones que este §7 describía solo en texto corrido o en tablas resumen tienen ahora su tabla de campos (Campo, Tipo, Oblig., Descripción, Referencia), debajo de su descripción original, que se conserva. Tipos y obligatoriedad se deducen del texto del anexo y de T05 §7.7; donde no se pueden deducir figura `[VERIFICAR]`. La columna Referencia declara la colección destino y su anexo dueño. Cuando T05 usa otro nombre para el campo, la tabla usa el de T05 y anota "Antes `x`". Las tablas de campos que ya existían incorporan también la columna Referencia.

### 7.1 `associateMemberships` — relación institucional

Nombre de colección canónico de T05 (CTR-DAT-09): `memberships` queda para la relación usuario–tenant de T02. Los campos que apuntan a `associateMemberships` se llaman `associateMembershipId` (PA-INS-12; antes `membershipId`, que se confundía con `memberships` de T02).

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `personId` | ObjectId → M01 `persons` | Sí | Persona física o jurídica. | `persons` (M01) |
| `legalEntityId` | ObjectId | Sí | Entidad jurídica con la que existe la relación institucional (cooperativa, mutual u otra del tenant con PRM-INS-058 = `true`); inmutable (RN-INS-053; DEC-096). En migración, la entidad por defecto salvo indicación de la cooperativa. | `legalEntities` (T04) |
| `memberNumber` | String | Cond. | Número visible; obligatorio desde `active`; único dentro de la entidad (RF-INS-002). | — |
| `memberNumberAliases` | [String] | No | Números anteriores tras renumeración (RF-INS-016). | — |
| `status` | Enum | Sí | `applicant`, `pendingApproval`, `active`, `suspended`, `withdrawalRequested`, `exclusionPending`, `withdrawn`, `excluded`, `deceased`, `rejected`, `dissolved`. | — |
| `statusEffectiveAt` | Date | Sí | Fecha efectiva del estado actual. | — |
| `applicationDate` | Date | Sí | Fecha de la solicitud de ingreso. | — |
| `admissionDate` | Date | Cond. | Fecha de alta institucional (aprobación). | — |
| `admissionMinuteId` / `admissionResolutionId` | ObjectId | Cond. | Acta y resolución que aprobaron (CAT `SOCIOS.ACTA`). | `minutes` (M17) / `resolutions` (M17) |
| `exitDate` | Date | Cond. | Egreso (antes en una fila conjunta con `exitCause`, `exitCauseDetail` y `exitMinuteId`). | — |
| `exitCause` | Enum | Cond. | `resignation`, `exclusion`, `death`, `dissolution`, `transferOfAllShares`, `other`. | — (valor enumerado, no es referencia) |
| `exitCauseDetail` | String | Cond. | Detalle libre de la causa. | — (texto, no es referencia) |
| `exitMinuteId` | ObjectId | Cond. | Acta que resolvió el egreso. | `minutes` (M17) |
| `seniorityStartDate` | Date | Cond. | Base de antigüedad (admisión o la anterior si el estatuto la conserva al reingresar). | — |
| `reentryOfAssociateMembershipId` | ObjectId | No | Membresía anterior en reingresos. Antes `reentryOfMembershipId` (PA-INS-12, PA-INS-13). | `associateMemberships` (M17) |
| `inaesCategoryId` | ObjectId → `inaesCategories` | No | Categoría INAES. | `inaesCategories` (M17) |
| `electoralDistrictId` | ObjectId → `electoralDistricts` | No | Distrito electoral. | `electoralDistricts` (M17) |
| `legalRepresentative` | { `personId`, `validFrom`, `validTo`, `documentId` } | Cond. | Obligatorio para personas jurídicas (`SOCIOS.JURIDICO`). | — |
| `bylawsVersionAccepted` | String | Sí | Versión del estatuto aceptada en la solicitud. | — |
| `sharesSubscribed` | Int32 | No | Cuotas sociales suscriptas (cache de `SOCIOS.ACCIONES`; la verdad está en `capitalMovements`). | — |
| `capitalSummary` | { `subscribed`, `billed`, `committed`, `paid`, `reserved`, `refunded`, `pending`, `overdue`, `asOf` } (Decimal128) | No | Proyección recalculada por evento; nunca se edita a mano. | — |
| `flags` | { `isDelegate`, `isAlternateDelegate`, `hasActiveMandate` } | No | Derivados (`SOCIOS.REP_ASAMBLEA`). | — |
| `notes` | String | No | Observaciones (sin límite de 1000 caracteres). | — |
| `legacy` | { `codSoc`, `numSoc`, `activoBaja` } | No | Trazabilidad de migración. | — |

Índices: `{tenantId, legalEntityId, memberNumber}` único parcial (si existe); `{tenantId, legalEntityId, personId}` único parcial para estados no terminales; `{tenantId, personId}` (no único: lista las membresías de la persona en todas las entidades); `{tenantId, legalEntityId, status, electoralDistrictId}`; `{tenantId, legalEntityId, admissionDate}`; `{tenantId, "legacy.codSoc"}`. (DEC-096; antes `{tenantId, memberNumber}` único parcial, `{tenantId, personId}` único parcial para estados no terminales, `{tenantId, status, electoralDistrictId}` y `{tenantId, admissionDate}`, que impedían ser socio de la cooperativa y afiliado de la mutual a la vez.)
Origen ProCoop: `SOCIOS` (`COD_SOC`, `NUM_SOC`, `ALTA`, `BAJA`, `CAUSA`, `CAU_BAJA`, `ACTIVO`, `ACTIVOBAJA`, `ACTA`, `JURIDICO`, `ACCIONES`, `REP_ASAMBLEA`, `OBSERVA`); `CUIT`, `IBRUTOS`, `COD_PER` → M01; `COD_GAR` → M01/M08 (garantías).

### 7.2 `membershipEvents`

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `associateMembershipId` | ObjectId | Sí | Antes `membershipId` (PA-INS-12). | `associateMemberships` (M17) |
| `type` | Enum | Sí | `requested`, `approved`, `rejected`, `numberAssigned`, `renumbered`, `suspended`, `reinstated`, `exitRequested`, `exclusionNotified`, `exclusionAppealed`, `exited`, `deceased`, `districtChanged`, `categoryChanged`, `representativeChanged`, `reentered`. | — |
| `fromStatus` / `toStatus` | Enum | No | Valores de `associateMemberships.status` (§7.1); registran la transición de §8.1, sin máquina propia (PA-INS-13). | — |
| `effectiveAt` / `recordedAt` | Date | Sí | AGR-010. | — |
| `actorUserId` | ObjectId | Sí | — | `memberships` (T02) |
| `reason` | String | Cond. | Obligatorio en rechazos, suspensiones, exclusiones y egresos. | — |
| `minuteId`, `resolutionId`, `documentIds` | ObjectId / [ObjectId] | No | Evidencia (T11). | `minutes` (M17) / `resolutions` (M17) / `documents` (T11) |
| `payload` | Object | No | Datos del cambio (antes/después). | — |

Índices: `{tenantId, associateMembershipId, effectiveAt}` (antes `membershipId`).

### 7.3 `insNumberingSeries`

**Reemplazada por `numberingSequences` de T11** (CTR-DAT-16 de T05: la numeración no fiscal es de T11). M17 no persiste esta colección: usa secuencias de T11 con las claves de abajo y conserva la regla de no reutilizar números (RN-INS-002). **Claves por entidad jurídica (DEC-096):** los libros sociales y los certificados son de cada entidad, porque cada una lleva sus propios libros legales, así que sus secuencias llevan el código de la entidad: `ins.memberNumber:<legalEntityCode>` (número de asociado y Libro de Registro de Asociados, RF-INS-002), `ins.registerFolio:<legalEntityCode>` (folios del registro, RF-INS-022), `ins.minuteBook:<bookType>:<legalEntityCode>` (libros de actas de consejo, asamblea, sindicatura, asistencia e internas, RF-INS-087, RF-INS-092) e `ins.shareCertificate:<legalEntityCode>` (certificados de cuotas sociales, RF-INS-026). `ins.refundRequest` (número interno de la solicitud de rescate, no es libro legal) queda por tenant. [VERIFICAR] con el asesor legal si la norma permite compartir algún libro entre entidades del mismo tenant; hasta que lo confirme, ninguno se comparte. *Reemplazado (10-11-2026, DEC-096): "(`ins.memberNumber`, `ins.minuteBook:<libro>`, etc.)"*. Diseño original:

Campos: `key` (Enum: `memberNumber`, `minuteBook:board`, `minuteBook:assembly`, `minuteBook:supervisory`, `minuteBook:internal`, `shareCertificate`, `registerFolio`, `refundRequest`), `prefix`, `padding`, `lastValue` (Int64), `allowManual` (Bool). Índice único `{tenantId, key}`. Incremento atómico con `findOneAndUpdate`. Sin origen directo (ProCoop calcula máximo + 1).

### 7.4 `electoralDistricts`

Campos: `code`, `name`, `assignmentRule` { `type`: `zone`/`locality`/`manual`, `refIds`: [ObjectId] }, `delegateSeats` { `titular`, `alternate` }, `active`. Índice único `{tenantId, code}`. Origen: filtros de distrito de `frmPadronTitulares`.

Campos de `electoralDistricts`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | String | Sí | — | — |
| `name` | String | Sí | — | — |
| `assignmentRule` | Object | [VERIFICAR] | Subcampos: `type`: `zone`/`locality`/`manual`, `refIds`: [ObjectId]. | — |
| `delegateSeats` | Object | [VERIFICAR] | Subcampos: `titular`, `alternate`. | — |
| `active` | Bool | [VERIFICAR] | — | — |

### 7.5 `capitalItems` — rubros de capital

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | String | Sí | `RUBCAPI.COD_RCC`. | — |
| `name` | String (dict) | Sí | `DES_RCC`. | — |
| `ledgerAccountId` | ObjectId → M15 | — | **Reemplazado** (CTR-DAT-57 de T05): el rubro no guarda la cuenta; `COD_CTA` migra a `entityAccountAssignments` de M15 con `entityType: capitalRubric` y `entityId` = este rubro. Texto original: "Sí · `COD_CTA`." | `ledgerAccounts` (M15) |
| `productGroupIds` | [ObjectId] → M02 rubros | No | `COD_RUB`; cada rubro de producto aparece en un solo `capitalItem` (RN-INS-012). | `accountRubrics` (M15): el mismo rubro que `billableConcepts.accountingRubricId` de M02 (ex `COD_RUB`); antes `[VERIFICAR]` (PA-INS-13) |
| `active` | Bool | Sí | — | — |

Índices: `{tenantId, code}` único; `{tenantId, productGroupIds}` único multiclave.

### 7.6 `capitalSubscriptionRules`

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `name` | String | Sí | — | — |
| `legalEntityId` | ObjectId | Sí | Entidad cuyo capital regula la regla (DEC-096). | `legalEntities` (T04) |
| `trigger` | Enum | Sí | `admission`, `serviceActivation`, `billing`. | — |
| `serviceId`, `categoryId`, `conceptIds` | ObjectId / [ObjectId] → M02 | Cond. | Alcance (por producto o por servicio, `abm_Capital`). | `tenantServices` (M02) / `serviceCategories` (M02) / `billableConcepts` (M02) |
| `shares` | Int32 | Cond. | Cuotas sociales a suscribir. | — |
| `amount` | Decimal128 | Cond. | Alternativa a `shares` (`SERSOC.IMP_CAPITAL`). | — |
| `integrationPlan` | { `mode`: `upfront`/`installmentsInInvoice`/`installmentsOwnDocument`, `installments`, `minInitialPct`, `maxYears` } | Sí | Plan de integración. | — |
| `capitalItemId` | ObjectId | Sí | Rubro. | `capitalItems` (M17) |
| `validFrom` / `validTo` | Date | Sí | Vigencia. | — |

Índice: `{tenantId, legalEntityId, trigger, serviceId, validFrom}` (DEC-096; antes `{tenantId, trigger, serviceId, validFrom}`).

### 7.7 `capitalShareValues`

Campos: `nominalValue` (Decimal128), `currency`, `validFrom`, `validTo`, `resolutionId`. Índice `{tenantId, validFrom}`. Sin origen ProCoop (valor implícito).

Campos de `capitalShareValues`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `legalEntityId` | ObjectId | Sí | Entidad a la que corresponde el valor nominal; índice `{tenantId, legalEntityId, validFrom}` (DEC-096; antes `{tenantId, validFrom}`). | `legalEntities` (T04) |
| `nominalValue` | Decimal128 | [VERIFICAR] | — | — |
| `currency` | String | [VERIFICAR] | — | — |
| `validFrom` | Date | Sí | — | — |
| `validTo` | Date | [VERIFICAR] | — | — |
| `resolutionId` | ObjectId | Sí | — | `resolutions` (M17) |

### 7.8 `capitalMovements` — libro mayor de capital

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `associateMembershipId` | ObjectId | Cond. | Obligatorio salvo movimientos de clientes no asociados (que se tratan como capital a regularizar, ver CTR-INS-06). Antes `membershipId` (PA-INS-12). | `associateMemberships` (M17) |
| `personId` | ObjectId | Sí | — | `persons` (M01) |
| `accountId`, `contractId` | ObjectId → M01 / M02 | No | `COD_SUM`, `COD_SER`/`ID_SERSOC` (la cuenta es de M01 y el contrato de M02, DEC-011/012). | `accounts` (M01) / `serviceContracts` (M02) |
| `capitalItemId` | ObjectId | Sí | Rubro. | `capitalItems` (M17) |
| `type` | Enum | Sí | `subscribed`, `billed`, `committed`, `paid`, `adjustment`, `reversal`, `transferIn`, `transferOut`, `reserved`, `reserveReleased`, `refunded`, `surplusCapitalized`, `manual`, `migration`. | — |
| `amount` | Decimal128 | Sí | Con signo según tipo (reversión con signo opuesto). | — |
| `shares` | Decimal128 | No | Cuotas equivalentes. | — |
| `effectiveDate` | Date | Sí | `FECHA` / `EMISION` / `VTO1` según PRM-INS-031. | — |
| `source` | { `kind`, `id`, `lineId`, `number` } | Sí | `kind`: `invoice`, `invoiceLine`, `salesDocument`, `payment`, `agreement`, `serviceActivation`, `admission`, `transfer`, `reserve`, `refund`, `surplus`, `manual`, `migration`, `review`. (`ID_FAC`, `COD_PRO`). | — |
| `idempotencyKey` | String | Sí | `<kind>:<id>:<lineId>:<type>`. | — |
| `reversesMovementId` / `reversedByMovementId` | ObjectId | No | Contramovimientos. | `capitalMovements` (M17) |
| `status` | Enum | Sí | `pending`, `confirmed`, `rejected`. | — |
| `approvalId` | ObjectId → T11 | Cond. | Manuales, ajustes, transferencias. | `approvalRequests` (T11) |
| `accountingStatus` | Enum | Sí | `pending`, `posted`, `error`, `notApplicable`. | — |
| `journalEntryRef` | ObjectId → M15 | No | — | `journalEntries` (M15) |
| `legalEntityId` | ObjectId | Sí | Entidad jurídica del movimiento (T05 §7.2 y regla de `legalEntityId` obligatorio en `capitalMovements`; agregado en PA-INS-13). Debe coincidir con `associateMemberships.legalEntityId` cuando hay membresía (RN-INS-053; DEC-096). | `legalEntities` (T04) |
| `legacy` | { `codCap`, `codCapRes` } | No | — | — |

Índices: `{tenantId, idempotencyKey}` único; `{tenantId, associateMembershipId, effectiveDate}` (antes `membershipId`); `{tenantId, "source.kind", "source.id"}`; `{tenantId, accountingStatus, effectiveDate}`; `{tenantId, capitalItemId, effectiveDate}`; `{tenantId, legalEntityId, status, effectiveDate}` (base de capital por entidad, RF-INS-109; DEC-095/096).
Origen ProCoop: `CAPITAL` (`COD_CAP`, `COD_SOC`, `COD_SUM`, `COD_PRO`, `COD_SER`, `FECHA`, `FACTURADO`, `COMPVEN`, `EMISION`, `VTO1`, `FEC_REG`, `USU_REG`, `ID_FAC`, `PAGADO` y 5 columnas adicionales no detalladas en CAT [VERIFICAR]).

### 7.9 `capitalReserves`

Campos: `associateMembershipId` (antes `membershipId`), `amount` (Decimal128), `purpose` (`debtApplication`, `refund`, `other`), `conceptId` (PRM-INS-021), `documentRef` { `typeId` (PRM-INS-022), `pointOfSale`, `number` }, `receiptRef` { `pointOfSale`, `number` }, `status` (`active`, `released`, `applied`, `voided`), `releasedAt`, `movementIds`. Índice `{tenantId, associateMembershipId, status}`.
Origen: `CAPITAL_RES` (`COD_CAPRES`, `COD_SUM`, `COD_SOC`, `COD_SER`, `FECHA`, `SUSCRIPTO`, `VENDIDO`, `COD_COM`/`SUC_COM`/`NUM_COM`, `COD_R`/`SUC_R`/`NUM_R` y 9 columnas más) — ver CTR-INS-03.

Campos de `capitalReserves`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `associateMembershipId` | ObjectId | Sí | Asociado (padrón de M17); no es `memberships` de T02 (ver §7.1). Antes `membershipId` (PA-INS-12). | `associateMemberships` (M17) |
| `amount` | Decimal128 | [VERIFICAR] | — | — |
| `purpose` | Enum | [VERIFICAR] | `debtApplication`, `refund`, `other`. | — |
| `conceptId` | ObjectId | [VERIFICAR] | PRM-INS-021. | `billableConcepts` (M02) |
| `documentRef` | Object | [VERIFICAR] | Subcampos: `typeId` (PRM-INS-022), `pointOfSale`, `number`. | No es referencia: número del comprobante; `typeId` → `voucherTypes` (M05) |
| `receiptRef` | Object | [VERIFICAR] | Subcampos: `pointOfSale`, `number`. | No es referencia: número del recibo de M07 |
| `status` | Enum | Sí | `active`, `released`, `applied`, `voided`. | — |
| `releasedAt` | Date (fecha y hora) | Cond. | — | — |
| `movementIds` | [ObjectId] | [VERIFICAR] | — | `capitalMovements` (M17) |

### 7.10 `capitalTransfers`

Campos: `fromAssociateMembershipId` (antes `fromMembershipId`), `toAssociateMembershipId` (antes `toMembershipId`), `amount`, `shares`, `transferServices` (Bool), `contractIds`, `exitTransferor` (Bool), `status` (`draft`, `pendingApproval`, `approved`, `executed`, `rejected`, `voided`), `resolutionId`, `movementIds`, `legacy.idTrans`. Índice `{tenantId, status}`. Origen: `TRANSFER` (`TIPO_TRA = 3`, `ORIGEN`, `DESTINO`, `SERVICIO`, `FECHA`, `OBSERVAC`, `USU_REG`, `FEC_REG`, `ID_TRANS_CUENTA`).

Campos de `capitalTransfers`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `legalEntityId` | ObjectId | Sí | Entidad de cedente y cesionario, que debe ser la misma (RN-INS-053; DEC-096). | `legalEntities` (T04) |
| `fromAssociateMembershipId` | ObjectId | Sí | Asociado cedente; no es `memberships` de T02. Antes `fromMembershipId` (T05 §7.2, PA-INS-12). | `associateMemberships` (M17) |
| `toAssociateMembershipId` | ObjectId | Sí | Asociado cesionario; no es `memberships` de T02. Antes `toMembershipId` (T05 §7.2, PA-INS-12). | `associateMemberships` (M17) |
| `amount` | Decimal128 | [VERIFICAR] | — | — |
| `shares` | Int | [VERIFICAR] | Cantidad de cuotas sociales [VERIFICAR] tipo. | — |
| `transferServices` | Bool | [VERIFICAR] | — | — |
| `contractIds` | [ObjectId] | [VERIFICAR] | — | `serviceContracts` (M02) |
| `exitTransferor` | Bool | [VERIFICAR] | — | — |
| `status` | Enum | Sí | `draft`, `pendingApproval`, `approved`, `executed`, `rejected`, `voided`. | — |
| `resolutionId` | ObjectId | [VERIFICAR] | — | `resolutions` (M17) |
| `movementIds` | [ObjectId] | [VERIFICAR] | — | `capitalMovements` (M17) |
| `legacy.idTrans` | String | No | — | — |

### 7.11 `capitalRefunds`

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `number` | String | Sí | Serie `refundRequest`. | — |
| `legalEntityId` | ObjectId | Sí | Entidad de la membresía; la cola y el límite anual de rescates se aplican por entidad (RN-INS-053; DEC-096). | `legalEntities` (T04) |
| `associateMembershipId` | ObjectId | Sí | Antes `membershipId` (PA-INS-12). | `associateMemberships` (M17) |
| `requestDate` | Date | Sí | Orden de la cola. | — |
| `reason` | Enum | Sí | `exit`, `death`, `exclusion`, `partialStatutory`. | — |
| `beneficiaries` | [{ `personId`, `sharePct`, `documentIds` }] | Cond. | Derechohabientes (fallecimiento). | — |
| `paidCapital` | Decimal128 | Sí | Integrado a la fecha de cálculo. | — |
| `offsets` | [{ `receivableRef`, `amount` }] | No | Compensaciones (M07). | — |
| `refundableAmount` | Decimal128 | Sí | `paidCapital − Σ offsets`. | — |
| `fiscalYear`, `queuePosition` | String / Int32 | Cond. | Cola por límite anual. | — |
| `interestAccrued` | Decimal128 | No | Si el estatuto lo prevé. | — |
| `status` | Enum | Sí | `requested`, `calculated`, `pendingApproval`, `approved`, `queued`, `scheduled`, `paid`, `rejected`, `cancelled`. | — |
| `resolutionId` | ObjectId | Cond. | Aprobación del consejo. | `resolutions` (M17) |
| `documentRef` | { `typeId`, `number` } | Cond. | Comprobante de rescate (PRM-INS-025). | No es referencia: número del comprobante; `typeId` → `voucherTypes` (M05) |
| `paymentOrderRef` | ObjectId → M14 | Cond. | — | `paymentOrders` (M12) |

Índices: `{tenantId, status, fiscalYear, queuePosition}`; `{tenantId, associateMembershipId}` (antes `membershipId`). Origen: `Rescate_Acciones` (no hay tabla propia; ProCoop emite un comprobante).

### 7.12 `capitalClosings`

Campos: `closingDate`, `reason`, `closedBy`, `reopenedAt`, `reopenApprovalId`, `status` (`closed`, `reopened`). Índice `{tenantId, closingDate}`. Origen: V2 2785.

Campos de `capitalClosings`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `legalEntityId` | ObjectId | Sí | Entidad cuyo capital se cierra (RF-INS-053; DEC-096). Índice `{tenantId, legalEntityId, closingDate}` (antes `{tenantId, closingDate}`). | `legalEntities` (T04) |
| `closingDate` | Date | Sí | — | — |
| `capitalBase` | Object | Sí | Base de capital congelada al cerrar (RF-INS-109, RN-INS-054; DEC-095): `asOf` (= `closingDate`), `subscribed`, `paid`, `pendingToPay`, `reserved`, `refundedInFiscalYear`, `refundsApprovedUnpaid`, `activeMembers` (Int), `byCapitalItem` [{ `capitalItemId`, `subscribed`, `paid`, `pendingToPay`, `reserved` }], `reconciliation` { `status` (`reconciled`, `differences`, `notRun`), `differenceTotal`, `pendingPostingCount` }, `computedAt`, `lastMovementId`. Importes en Decimal128. | `capitalItems` (M17), `capitalMovements` (M17) |
| `capitalBaseHistory` | [Object] | No | Copias anteriores de `capitalBase` reemplazadas al volver a cerrar tras una reapertura, con `reopenedAt` y `reopenApprovalId` (RN-INS-054). | — |
| `reason` | String | [VERIFICAR] | — | — |
| `closedBy` | ObjectId | Cond. | — | `memberships` (T02) |
| `reopenedAt` | Date (fecha y hora) | Cond. | — | — |
| `reopenApprovalId` | ObjectId | [VERIFICAR] | — | `approvalRequests` (T11) |
| `status` | Enum | Sí | `closed`, `reopened`. | — |

### 7.13 `shareCertificates`

Campos: `number`, `associateMembershipId` (antes `membershipId`), `shares`, `nominalValue`, `integratedPct`, `issueDate`, `status` (`issued`, `voided`, `replaced`), `replacesCertificateId`, `pdfObjectKey`. Índice único `{tenantId, legalEntityId, number}` (DEC-096; antes `{tenantId, number}`). Origen: `Get_Certificados_Acciones`.

Campos de `shareCertificates`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `legalEntityId` | ObjectId | Sí | Entidad emisora; igual a la de la membresía (RN-INS-053, RF-INS-026; DEC-096). | `legalEntities` (T04) |
| `number` | String | Sí | Correlativo por entidad, secuencia `ins.shareCertificate:<legalEntityCode>` (DEC-096). | — |
| `associateMembershipId` | ObjectId | Sí | Asociado (padrón de M17); no es `memberships` de T02 (ver §7.1). Antes `membershipId` (PA-INS-12). | `associateMemberships` (M17) |
| `shares` | Int | [VERIFICAR] | Cantidad de cuotas sociales [VERIFICAR] tipo. | — |
| `nominalValue` | Decimal128 | [VERIFICAR] | — | — |
| `integratedPct` | Decimal128 | [VERIFICAR] | — | — |
| `issueDate` | Date | [VERIFICAR] | — | — |
| `status` | Enum | Sí | `issued`, `voided`, `replaced`. | — |
| `replacesCertificateId` | ObjectId | [VERIFICAR] | — | `shareCertificates` (M17) |
| `storedFileId` | ObjectId | No | PDF del título. Antes `pdfObjectKey` (T05 §7.2, PA-INS-13). | `storedFiles` (T01) |

### 7.14 `surplusDistributions`

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `legalEntityId` | ObjectId | Sí | Entidad cuyo ejercicio se distribuye; los retornos van solo a sus membresías (RF-INS-060; DEC-096). | `legalEntities` (T04) |
| `fiscalYear` | String | Sí | Ejercicio. | — |
| `resultRef` | ObjectId → M15 | Sí | Resultado del ejercicio aprobado. | `reportRunResults` (T10) |
| `surplusTotal`, `surplusFromMembers`, `surplusFromNonMembers` | Decimal128 | Sí | — | — |
| `appropriations` | [{ `code` (`legalReserve`, `welfareFund`, `educationFund`, `shareInterest`, `specialReserve`, `other`), `pct`, `amount`, `ledgerAccountId` }] | Sí | Esquema aplicado. | — |
| `refundCriterion` | { `basis`: `billing`/`usage`/`paidCapital`/`custom`, `serviceIds`, `periodFrom`, `periodTo` } | Sí | Base de retorno. | — |
| `refundForm` | Enum | Sí | `capitalization`, `accountCredit`, `payment`, `mixed`. | — |
| `status` | Enum | Sí | `draft`, `simulated`, `approved`, `executing`, `executed`, `voided`. | — |
| `resolutionId` | ObjectId | Cond. | Obligatorio desde `approved`. | `resolutions` (M17) |
| `totals` | { `members`, `refundTotal`, `roundingAdjustment` } | No | — | — |

Índice `{tenantId, legalEntityId, fiscalYear}` único parcial (no anuladas) (DEC-096; antes `{tenantId, fiscalYear}`).

### 7.15 `surplusAllocations`

Campos: `distributionId`, `associateMembershipId` (antes `membershipId`), `basisAmount`, `refundAmount`, `interestAmount`, `form`, `movementId` / `creditRef` / `paymentOrderRef`, `status` (`pending`, `executed`, `unclaimed`, `prescribed`, `voided`). Índices `{tenantId, distributionId}`, `{tenantId, associateMembershipId}`.

Campos de `surplusAllocations`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `distributionId` | ObjectId | Sí | — | `surplusDistributions` (M17) |
| `associateMembershipId` | ObjectId | Sí | Asociado (padrón de M17); no es `memberships` de T02 (ver §7.1). Antes `membershipId` (PA-INS-12). | `associateMemberships` (M17) |
| `basisAmount` | Decimal128 | [VERIFICAR] | — | — |
| `refundAmount` | Decimal128 | [VERIFICAR] | — | — |
| `interestAmount` | Decimal128 | [VERIFICAR] | — | — |
| `form` | Enum | [VERIFICAR] | Forma de imputación [VERIFICAR] valores. | — |
| `movementId` | ObjectId | [VERIFICAR] | — | `capitalMovements` (M17) |
| `creditRef` | ObjectId | [VERIFICAR] | Crédito en cuenta corriente cuando la forma es `accountCredit`. | `creditBalances` (M07); antes `[VERIFICAR]` (PA-INS-13) |
| `paymentOrderRef` | ObjectId | [VERIFICAR] | — | `paymentOrders` (M12) |
| `status` | Enum | Sí | `pending`, `executed`, `unclaimed`, `prescribed`, `voided`. | — |

### 7.16 `governanceBodies`

Campos: `type` (`board`, `supervisory`, `auditCommittee`, `electoralBoard`, `committee`), `name`, `positions` [{ `code`, `labelKey`, `titularSeats`, `alternateSeats`, `isSigner`, `signerOrder` }], `termYears`, `partialRenewal` { `enabled`, `fraction` }, `active`. Índice `{tenantId, type}`. Origen: `CONSEJO.TIP_CSJ`.

Campos de `governanceBodies`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `legalEntityId` | ObjectId | Sí | Entidad a la que pertenece el órgano; índice `{tenantId, legalEntityId, type}` (RF-INS-067; DEC-096; antes `{tenantId, type}`). | `legalEntities` (T04) |
| `type` | Enum | Sí | `board`, `supervisory`, `auditCommittee`, `electoralBoard`, `committee`. | — |
| `name` | String | Sí | — | — |
| `positions` | [Object] | [VERIFICAR] | Lista; subcampos: `code`, `labelKey`, `titularSeats`, `alternateSeats`, `isSigner`, `signerOrder`. | — |
| `termYears` | Int | [VERIFICAR] | — | — |
| `partialRenewal` | Object | [VERIFICAR] | Subcampos: `enabled`, `fraction`. | — |
| `active` | Bool | [VERIFICAR] | — | — |

### 7.17 `bodyMandates`

Campos: `bodyId`, `positionCode`, `role` (`titular`, `alternate`), `personId`, `associateMembershipId` (antes `membershipId`), `startDate`, `endDate`, `electedAtMeetingId`, `resolutionId`, `status` (`active`, `ended`, `resigned`, `removed`, `replaced`), `endReason`, `legacy.idCsj`. Índices `{tenantId, bodyId, positionCode, status}`, `{tenantId, personId}`. Origen: `CONSEJO` (`ID_CSJ`, `TIP_CSJ`, `DOC_CSJ`, `CAR_CSJ`, `NOM_CSJ`).

Campos de `bodyMandates`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `legalEntityId` | ObjectId | Sí | Copia de `governanceBodies.legalEntityId`; igual a la de la membresía (RN-INS-053; DEC-096). | `legalEntities` (T04) |
| `bodyId` | ObjectId | Sí | — | `governanceBodies` (M17) |
| `positionCode` | String | [VERIFICAR] | — | — |
| `role` | Enum | [VERIFICAR] | `titular`, `alternate`. | — |
| `personId` | ObjectId | Sí | — | `persons` (M01) |
| `associateMembershipId` | ObjectId | Sí | Asociado (padrón de M17); no es `memberships` de T02 (ver §7.1). Antes `membershipId` (PA-INS-12). | `associateMemberships` (M17) |
| `startDate` | Date | [VERIFICAR] | — | — |
| `endDate` | Date | [VERIFICAR] | — | — |
| `electedAtMeetingId` | ObjectId | [VERIFICAR] | — | `meetings` (M17) |
| `resolutionId` | ObjectId | [VERIFICAR] | — | `resolutions` (M17) |
| `status` | Enum | Sí | `active`, `ended`, `resigned`, `removed`, `replaced`. | — |
| `endReason` | String | [VERIFICAR] | — | — |
| `legacy.idCsj` | String | No | — | — |

### 7.18 `meetings`

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `legalEntityId` | ObjectId | Sí | Entidad de la reunión; igual a la del órgano (`bodyId`) cuando lo hay (RF-INS-072; DEC-096). | `legalEntities` (T04) |
| `type` | Enum | Sí | `boardOrdinary`, `boardExtraordinary`, `supervisory`, `committee`, `assemblyOrdinary`, `assemblyExtraordinary`, `assemblyDistrict`, `assemblyDelegates`. | — |
| `bodyId` | ObjectId | Cond. | Para reuniones de órganos. | `governanceBodies` (M17) |
| `number` | String | No | Número de reunión/asamblea. | — |
| `subject` | String | Sí | `ASUNTO`. | — |
| `registeredAt` | Date | Sí | `FECHA`. | — |
| `scheduledAt` | Date | Sí | `FECHA_REU`. | — |
| `startedAt` / `endedAt` | Date | No | `FECHA_INICIO` / `FECHA_FIN`. | — |
| `secondCallAt` | Date | No | Segundo llamado. | — |
| `modality` | Enum | Sí | `inPerson`, `remote`, `hybrid`. | — |
| `location`, `remotePlatform`, `remoteUrl` | String | Cond. | — | — |
| `status` | Enum | Sí | `draft`, `convened`, `inProgress`, `recess`, `closed`, `cancelled` (`ESTADO`, `EstadoReunion`). | — |
| `reserved` | Bool | Sí | Acceso solo por `meetingPermissions`. | — |
| `rosterId`, `electoralDistrictId` | ObjectId | Cond. | Asambleas. | `rosters` (M17) / `electoralDistricts` (M17) |
| `quorum` | { `required`, `reached`, `reachedAt`, `presentCount`, `proxiesCount` } | No | — | — |
| `notice` | { `publishedAt`, `channels`, `inaesNotifiedAt`, `localAuthorityNotifiedAt` } | No | Convocatoria. | — |
| `dossierId` | ObjectId → T11 | No | Expediente. | `dossiers` (T11) |
| `notes` | String | No | `OBSERVACION`. | — |
| `createdByUserId` | ObjectId | Sí | `COD_USER`. | `memberships` (T02) |

Índices `{tenantId, legalEntityId, type, scheduledAt}` (DEC-096; antes `{tenantId, type, scheduledAt}`), `{tenantId, status}`. Origen: `REUNIONES`.

### 7.19 `meetingAgendaItems`

Campos: `meetingId`, `order` (`ORDEN_DIA`), `title`, `description`, `observations` (`OBSERVACIONES`), `resolutionText` (`RESOLUCION`), `treated` (`TRATADO`), `outcome` (`approved`, `rejected`, `deferred`, `informative`, `withdrawn`), `linkedRefs` [{ `kind`: `crmCase`, `deskFile`, `membershipBatch`, `refund`, `transfer`, `surplus`, `fee`, `tariff`, `other`; `id` }] (`COD_REC`), `votingSessionId`, `resolutionId`. Índice `{tenantId, meetingId, order}` único. Origen: `REUNIONES_TEMAS`.

Campos de `meetingAgendaItems`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `meetingId` | ObjectId | Sí | — | `meetings` (M17) |
| `order` | Int | Sí | `ORDEN_DIA`. | — |
| `title` | String | [VERIFICAR] | — | — |
| `description` | String | [VERIFICAR] | — | — |
| `observations` | String | [VERIFICAR] | `OBSERVACIONES`. | — |
| `resolutionText` | String | [VERIFICAR] | `RESOLUCION`. | — |
| `treated` | Bool | [VERIFICAR] | `TRATADO`. | — |
| `outcome` | Enum | [VERIFICAR] | `approved`, `rejected`, `deferred`, `informative`, `withdrawn`. | — |
| `linkedRefs` | [Object] | [VERIFICAR] | Lista; subcampos: `kind`: `crmCase`, `deskFile`, `membershipBatch`, `refund`, `transfer`, `surplus`, `fee`, `tariff`, `other`; `id`. `COD_REC`. | — |
| `votingSessionId` | ObjectId | [VERIFICAR] | — | `votingSessions` (M17) |
| `resolutionId` | ObjectId | [VERIFICAR] | — | `resolutions` (M17) |

### 7.20 `meetingParticipants`

Campos: `meetingId`, `kind` (`mandate`, `employee`, `external`, `member`), `mandateId` (`ID_CSJ`), `employeeId` (`COD_EMP`), `associateMembershipId` (antes `membershipId`), `externalName` (`NOM_EXT`), `attendance` (`present`, `absent`, `excused`, `remote`) (`ASISTIO`), `checkInAt`, `checkOutAt`, `checkInMethod` (`qr`, `document`, `manual`), `hasVote`, `proxyIds`, `signatureRef`. Índices `{tenantId, meetingId, associateMembershipId}` único parcial, `{tenantId, meetingId, attendance}`. Origen: `REUNIONES_ASIST`.

Campos de `meetingParticipants`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `meetingId` | ObjectId | Sí | — | `meetings` (M17) |
| `kind` | Enum | [VERIFICAR] | `mandate`, `employee`, `external`, `member`. | — |
| `mandateId` | ObjectId | Sí | `ID_CSJ`. | `bodyMandates` (M17) |
| `employeeId` | ObjectId | Sí | `COD_EMP`. | `employees` (M16) |
| `associateMembershipId` | ObjectId | Sí | Asociado (padrón de M17); no es `memberships` de T02 (ver §7.1). Antes `membershipId` (PA-INS-12). | `associateMemberships` (M17) |
| `externalName` | String | [VERIFICAR] | `NOM_EXT`. | — |
| `attendance` | Enum | [VERIFICAR] | `present`, `absent`, `excused`, `remote` (`ASISTIO`). | — |
| `checkInAt` | Date (fecha y hora) | Cond. | — | — |
| `checkOutAt` | Date (fecha y hora) | Cond. | — | — |
| `checkInMethod` | Enum | [VERIFICAR] | `qr`, `document`, `manual`. | — |
| `hasVote` | Bool | [VERIFICAR] | — | — |
| `proxyIds` | [ObjectId] | [VERIFICAR] | — | `proxies` (M17) |
| `signatureRef` | ObjectId | [VERIFICAR] | — | `signatureRequests` (T11) [VERIFICAR] |

### 7.21 `meetingPermissions`

Campos: `meetingId`, `userId` (`COD_EMP` en ProCoop referencia al empleado; se mapea al usuario vinculado), `level` (`view`, `edit`). Índice único `{tenantId, meetingId, userId}`. Origen: `REUNIONES_PERMISOS`.

Campos de `meetingPermissions`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `meetingId` | ObjectId | Sí | — | `meetings` (M17) |
| `userId` | ObjectId | Sí | `COD_EMP` en ProCoop referencia al empleado; se mapea al usuario vinculado. | `memberships` (T02) |
| `level` | Enum | [VERIFICAR] | `view`, `edit`. | — |

### 7.22 `minutes` — actas

Campos: `bookType` (`board`, `assembly`, `supervisory`, `attendance`, `internal`, `deskFile`), `number` (`NUM_ACT`), `meetingId` (`COD_REU`), `recordedDate` (`FECHA_REG`), `contentHtml`, `pdfObjectKey` (`CONTENIDO_PDF` se migra a almacenamiento de objetos), `hash`, `signatureStatus` (`draft`, `pendingSignatures`, `signed`, `voided`) (`ESTADO_FIRMA`), `signers` [{ `personId`, `mandateId`, `required`, `signedAt`, `method` }], `signatureProfileCode` (default `SIG-ACTA-INSTITUCIONAL`, T11 §18.5, DEC-078), `signatureRequestRef` (ObjectId → T11), `correctsMinuteId`. Índice único `{tenantId, legalEntityId, bookType, number}` (DEC-096; antes `{tenantId, bookType, number}`). Origen: `ACTAS`.

Campos de `minutes`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `legalEntityId` | ObjectId | Sí | Copia de `meetings.legalEntityId`; el acta pertenece al libro de esa entidad (RF-INS-087; DEC-096). En migración, la entidad por defecto salvo indicación de la cooperativa. | `legalEntities` (T04) |
| `bookType` | Enum | Sí | `board`, `assembly`, `supervisory`, `attendance`, `internal`, `deskFile`. | — |
| `number` | String | Sí | `NUM_ACT`. Correlativo por libro y entidad, secuencia `ins.minuteBook:<bookType>:<legalEntityCode>` (DEC-096). | — |
| `meetingId` | ObjectId | Sí | `COD_REU`. | `meetings` (M17) |
| `recordedDate` | Date | [VERIFICAR] | `FECHA_REG`. | — |
| `contentHtml` | String | [VERIFICAR] | — | — |
| `storedFileId` | ObjectId | No | PDF del acta; `CONTENIDO_PDF` se migra a almacenamiento de objetos. Antes `pdfObjectKey` (T05 §7.2, PA-INS-13). | `storedFiles` (T01) |
| `hash` | String | [VERIFICAR] | — | — |
| `signatureStatus` | Enum | [VERIFICAR] | `draft`, `pendingSignatures`, `signed`, `voided` (`ESTADO_FIRMA`). | — |
| `signers` | [Object] | [VERIFICAR] | Lista; subcampos: `personId`, `mandateId`, `required`, `signedAt`, `method`. | — |
| `signatureProfileCode` | String | [VERIFICAR] | Default `SIG-ACTA-INSTITUCIONAL`, T11 §18.5, DEC-078. | — |
| `signatureRequestRef` | ObjectId | [VERIFICAR] | ObjectId → T11. | `signatureRequests` (T11) |
| `correctsMinuteId` | ObjectId | [VERIFICAR] | — | `minutes` (M17) |

### 7.23 `resolutions`

Campos: `number`, `meetingId`, `agendaItemId`, `minuteId`, `text`, `category` (`admission`, `exit`, `capital`, `refund`, `surplus`, `fees`, `election`, `bylaws`, `tariff`, `other`), `responsibleUserId`, `dueDate`, `status` (`open`, `inProgress`, `done`, `cancelled`), `affectedRefs`. Índices `{tenantId, status, dueDate}`. Origen: `RESOLUCION` de `REUNIONES_TEMAS`, `ResolucionReunion`.

Campos de `resolutions`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `legalEntityId` | ObjectId | Sí | Copia de `meetings.legalEntityId` (DEC-096). | `legalEntities` (T04) |
| `number` | String | Sí | — | — |
| `meetingId` | ObjectId | Sí | — | `meetings` (M17) |
| `agendaItemId` | ObjectId | Sí | — | `meetingAgendaItems` (M17) |
| `minuteId` | ObjectId | Sí | — | `minutes` (M17) |
| `text` | String | [VERIFICAR] | — | — |
| `category` | Enum | [VERIFICAR] | `admission`, `exit`, `capital`, `refund`, `surplus`, `fees`, `election`, `bylaws`, `tariff`, `other`. | — |
| `responsibleUserId` | ObjectId | [VERIFICAR] | — | `memberships` (T02) |
| `dueDate` | Date | [VERIFICAR] | — | — |
| `status` | Enum | Sí | `open`, `inProgress`, `done`, `cancelled`. | — |
| `affectedRefs` | [Object] | [VERIFICAR] | — | Polimórfica (`{ collection, id }`) [VERIFICAR] |

### 7.24 `rosters` y `rosterEntries` — padrones

`rosters`: `meetingId`, `version`, `cutoffDate`, `criteria` (objeto versionado con: `admissionCutoffDate`, `capitalDebt` { `enabled`, `threshold`, `asOfDate` }, `previousDebt`, `noInvoiceSince`, `serviceFrom`, `serviceTo`, `excludeExitAfterCutoff`, `maxUnpaidInvoices` { `n`, `onlyMarked` }, `districtIds`, `statuses`, `onlyMembers`, `importedListId`), `columns`, `savedFilterSetId`, `status` (`preliminary`, `observed`, `final`, `superseded`), `exhibition` { `from`, `to` }, `approvedAt`, `approvedBy`, `supersedesRosterId`, `totals` { `eligible`, `excluded` }. Índice `{tenantId, meetingId, version}` único.
`rosterEntries`: `rosterId`, `associateMembershipId` (antes `membershipId`), `memberNumber`, `displayName`, `maskedDocument`, `districtId`, `eligible`, `exclusionReasons` [Enum], `capitalDebt`, `claims` [{ `at`, `text`, `resolution`, `resolvedBy` }]. Índices `{tenantId, rosterId, memberNumber}`, `{tenantId, rosterId, eligible}`.
Origen: `clsPadronTitular` (`Get_Padron`, `Get_Padron2`, `GuardarFiltros` con V2 50), `Filtro_Padron`, `Modo_Padron`, `Fecha_Padron`.

Campos de `rosters`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `meetingId` | ObjectId | Sí | — | `meetings` (M17) |
| `legalEntityId` | ObjectId | Sí | Copia de `meetings.legalEntityId`; el padrón solo incluye membresías de esa entidad (RF-INS-078; DEC-096). | `legalEntities` (T04) |
| `version` | Int | Sí | — | — |
| `cutoffDate` | Date | [VERIFICAR] | — | — |
| `criteria` | Object | [VERIFICAR] | Objeto versionado con: `admissionCutoffDate`, `capitalDebt` { `enabled`, `threshold`, `asOfDate` }, `previousDebt`, `noInvoiceSince`, `serviceFrom`, `serviceTo`, `excludeExitAfterCutoff`, `maxUnpaidInvoices` { `n`, `onlyMarked` }, `districtIds`, `statuses`, `onlyMembers`, `importedListId`. | — |
| `columns` | [String] | [VERIFICAR] | Columnas exportadas [VERIFICAR]. | — |
| `savedFilterSetId` | ObjectId | [VERIFICAR] | Conjunto de filtros guardado del padrón (PRM-INS-049). | `dataTableViews` (T03), vista compartida de la grilla del padrón; antes `[VERIFICAR] filtro guardado (T03)` (PA-INS-13) |
| `status` | Enum | Sí | `preliminary`, `observed`, `final`, `superseded`. | — |
| `exhibition` | Object | [VERIFICAR] | Subcampos: `from`, `to`. | — |
| `approvedAt` | Date (fecha y hora) | Cond. | — | — |
| `approvedBy` | ObjectId | Cond. | — | `memberships` (T02) |
| `supersedesRosterId` | ObjectId | [VERIFICAR] | — | `rosters` (M17) |
| `totals` | Object | [VERIFICAR] | Subcampos: `eligible`, `excluded`. | — |

**`rosterEntries`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `rosterId` | ObjectId | Sí | — | `rosters` (M17) |
| `associateMembershipId` | ObjectId | Sí | Asociado (padrón de M17); no es `memberships` de T02 (ver §7.1). Antes `membershipId` (PA-INS-12). | `associateMemberships` (M17) |
| `memberNumber` | String | [VERIFICAR] | — | — |
| `displayName` | String | [VERIFICAR] | — | — |
| `maskedDocument` | String | [VERIFICAR] | — | — |
| `districtId` | ObjectId | [VERIFICAR] | — | `electoralDistricts` (M17) |
| `eligible` | Bool | [VERIFICAR] | — | — |
| `exclusionReasons` | String | [VERIFICAR] | Lista: Enum. | — |
| `capitalDebt` | Decimal128 | [VERIFICAR] | — | — |
| `claims` | [Object] | [VERIFICAR] | Lista; subcampos: `at`, `text`, `resolution`, `resolvedBy`. | — |

### 7.25 `proxies`

Campos: `meetingId`, `grantorAssociateMembershipId` (antes `grantorMembershipId`), `proxyAssociateMembershipId` (antes `proxyMembershipId`), `documentId`, `status` (`submitted`, `validated`, `rejected`, `revoked`), `validatedBy`, `rejectionReason`. Índice `{tenantId, meetingId, grantorAssociateMembershipId}` único parcial (no revocados; antes `grantorMembershipId`).

Campos de `proxies`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `meetingId` | ObjectId | Sí | — | `meetings` (M17) |
| `grantorAssociateMembershipId` | ObjectId | Sí | Asociado que otorga el poder; no es `memberships` de T02. Antes `grantorMembershipId` (T05 §7.2, PA-INS-12). | `associateMemberships` (M17) |
| `proxyAssociateMembershipId` | ObjectId | Sí | Asociado apoderado; no es `memberships` de T02. Antes `proxyMembershipId` (T05 §7.2, PA-INS-12). | `associateMemberships` (M17) |
| `documentId` | ObjectId | [VERIFICAR] | — | `storedFiles` (T01) |
| `status` | Enum | Sí | `submitted`, `validated`, `rejected`, `revoked`. | — |
| `validatedBy` | ObjectId | Cond. | — | `memberships` (T02) |
| `rejectionReason` | String | [VERIFICAR] | — | — |

### 7.26 `electoralLists`

Campos: `meetingId`, `name`, `number`, `candidates` [{ `bodyId`, `positionCode`, `role`, `personId` }], `endorsements` [{ `associateMembershipId` (antes `membershipId`), `at` }], `status` (`submitted`, `observed`, `officialized`, `rejected`, `withdrawn`), `challenges` [{ `by`, `text`, `resolution` }]. Índice `{tenantId, meetingId, number}`.

Campos de `electoralLists`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `meetingId` | ObjectId | Sí | — | `meetings` (M17) |
| `name` | String | Sí | — | — |
| `number` | String | Sí | — | — |
| `candidates` | [Object] | [VERIFICAR] | Lista; subcampos: `bodyId`, `positionCode`, `role`, `personId`. | — |
| `endorsements` | [Object] | [VERIFICAR] | Lista; subcampos: `associateMembershipId` (antes `membershipId`), `at`. | — |
| `status` | Enum | Sí | `submitted`, `observed`, `officialized`, `rejected`, `withdrawn`. | — |
| `challenges` | [Object] | [VERIFICAR] | Lista; subcampos: `by`, `text`, `resolution`. | — |

### 7.27 `votingSessions` y `voteTallies`

`votingSessions`: `meetingId`, `agendaItemId`, `type` (`motion`, `election`), `method` (`showOfHands`, `nominal`, `secret`, `electronic`), `majority` (`simple`, `absolute`, `twoThirds`, `custom` con `customPct`), `eligibleVoters`, `status` (`open`, `closed`, `tallied`, `voided`), `result` (`approved`, `rejected`, `tie`, `elected`).
`voteTallies`: `votingSessionId`, `option` (`yes`, `no`, `abstain`, `blank`, `null` o `listId`), `count`, `nominalVotes` [{ `associateMembershipId` (antes `membershipId`), `viaProxyId`, `option` }] (solo método nominal; nunca en secreto), `talliedBy`, `talliedAt`.
Índices `{tenantId, meetingId}`. Origen: `Get_Informe_Votacion`.

Campos de `votingSessions`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `meetingId` | ObjectId | Sí | — | `meetings` (M17) |
| `agendaItemId` | ObjectId | Sí | — | `meetingAgendaItems` (M17) |
| `type` | Enum | [VERIFICAR] | `motion`, `election`. | — |
| `method` | Enum | [VERIFICAR] | `showOfHands`, `nominal`, `secret`, `electronic`. | — |
| `majority` | Enum | [VERIFICAR] | `simple`, `absolute`, `twoThirds`, `custom` con `customPct`. | — |
| `eligibleVoters` | Int | [VERIFICAR] | — | — |
| `status` | Enum | Sí | `open`, `closed`, `tallied`, `voided`. | — |
| `result` | Enum | [VERIFICAR] | `approved`, `rejected`, `tie`, `elected`. | — |

**`voteTallies`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `votingSessionId` | ObjectId | Sí | — | `votingSessions` (M17) |
| `option` | Enum | [VERIFICAR] | `yes`, `no`, `abstain`, `blank`, `null` o `listId`. | — |
| `count` | Int | [VERIFICAR] | — | — |
| `nominalVotes` | [Object] | [VERIFICAR] | Lista; subcampos: `associateMembershipId` (antes `membershipId`), `viaProxyId`, `option`. solo método nominal; nunca en secreto. | — |
| `talliedBy` | ObjectId | Cond. | — | `memberships` (T02) |
| `talliedAt` | Date (fecha y hora) | Cond. | — | — |

### 7.28 `institutionalFees` y `institutionalFeeSettlements`

`institutionalFees`: `resolutionId`, `bodyId`, `positionCodes`, `amount` o `formula`, `periodicity` (`monthly`, `perMeeting`, `annual`), `validFrom`, `validTo`, `currency`.
`institutionalFeeSettlements`: `feeId`, `period`, `mandateId`, `personId`, `grossAmount`, `proratedDays`, `expenseReimbursements` [{ `documentId`, `amount`, `approved` }], `withholdingRef` (M06), `paymentOrderRef` (M14), `journalEntryRef`, `status` (`draft`, `approved`, `paid`, `voided`). Índice `{tenantId, period, personId}`.

Campos de `institutionalFees`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `resolutionId` | ObjectId | Sí | — | `resolutions` (M17) |
| `bodyId` | ObjectId | Sí | — | `governanceBodies` (M17) |
| `positionCodes` | String | [VERIFICAR] | — | — |
| `amount` | Decimal128 | [VERIFICAR] | — | — |
| `formula` | String | [VERIFICAR] | — | — |
| `periodicity` | Enum | [VERIFICAR] | `monthly`, `perMeeting`, `annual`. | — |
| `validFrom` | Date | [VERIFICAR] | — | — |
| `validTo` | Date | [VERIFICAR] | — | — |
| `currency` | String | [VERIFICAR] | — | — |

**`institutionalFeeSettlements`** — campos:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `legalEntityId` | ObjectId | Sí | Entidad del órgano y del mandato; el honorario se contabiliza y paga en esa entidad (RN-INS-053; DEC-096). | `legalEntities` (T04) |
| `feeId` | ObjectId | Sí | — | `institutionalFees` (M17) |
| `period` | String | [VERIFICAR] | — | — |
| `mandateId` | ObjectId | Sí | — | `bodyMandates` (M17) |
| `personId` | ObjectId | Sí | — | `persons` (M01) |
| `grossAmount` | Decimal128 | [VERIFICAR] | — | — |
| `proratedDays` | Int | [VERIFICAR] | — | — |
| `expenseReimbursements` | [Object] | [VERIFICAR] | Lista; subcampos: `documentId`, `amount`, `approved`. | — |
| `withholdingRef` | ObjectId | [VERIFICAR] | M06. | `withholdingsApplied` (M06); antes "M06, colección [VERIFICAR]" (PA-INS-13) |
| `paymentOrderRef` | ObjectId | [VERIFICAR] | M14. | `paymentOrders` (M12); M14 ejecuta el pago (antes `[VERIFICAR] (el anexo cita M14)`, PA-INS-13) |
| `journalEntryRef` | ObjectId | [VERIFICAR] | — | `journalEntries` (M15) |
| `status` | Enum | Sí | `draft`, `approved`, `paid`, `voided`. | — |

### 7.29 `inaesCategories`

Campos: `code` (`COD_CAT`), `name` (`DES_CAT`), `scope` (`platform`, `tenant`), `active`. Índice `{tenantId, code}` único (tenant `PLATFORM` para el catálogo base).

Campos de `inaesCategories`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `code` | String | Sí | `COD_CAT`. | — |
| `name` | String | Sí | `DES_CAT`. | — |
| `scope` | Enum | [VERIFICAR] | `platform`, `tenant`. | — |
| `active` | Bool | [VERIFICAR] | — | — |

### 7.30 `inaesReports`

Campos: `reportType` (`associateRegister`, `entriesAndExits`, `authorities`, `assemblyDocs`, `other`), `period`, `dueDate`, `batchIndex`, `batchCount`, `files` [{ `objectKey`, `hash` }], `validation` { `errors`, `warnings` }, `status` (`draft`, `validated`, `submitted`, `acknowledged`, `rejected`), `submittedAt`, `submittedBy`, `acknowledgementRef`. Índice `{tenantId, reportType, period}`.

Campos de `inaesReports`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `legalEntityId` | ObjectId | Sí | Entidad presentante (matrícula INAES de `legalEntities`); índice `{tenantId, legalEntityId, reportType, period}` (RF-INS-024; DEC-096; antes `{tenantId, reportType, period}`). | `legalEntities` (T04) |
| `reportType` | Enum | [VERIFICAR] | `associateRegister`, `entriesAndExits`, `authorities`, `assemblyDocs`, `other`. | — |
| `period` | String | [VERIFICAR] | — | — |
| `dueDate` | Date | [VERIFICAR] | — | — |
| `batchIndex` | Decimal128 | [VERIFICAR] | — | — |
| `batchCount` | Int | [VERIFICAR] | — | — |
| `files` | [Object] | [VERIFICAR] | Lista; subcampos: `objectKey`, `hash`. El archivo se referencia por `storedFileIds` (antes `files[].objectKey`); `hash` se conserva para control. | — |
| `storedFileIds` | [ObjectId] | No | Archivos del lote presentado (T05 §7.2, PA-INS-13). | `storedFiles` (T01) |
| `validation` | Object | [VERIFICAR] | Subcampos: `errors`, `warnings`. | — |
| `status` | Enum | Sí | `draft`, `validated`, `submitted`, `acknowledged`, `rejected`. | — |
| `submittedAt` | Date (fecha y hora) | Cond. | — | — |
| `submittedBy` | ObjectId | Cond. | — | `memberships` (T02) |
| `acknowledgementRef` | ObjectId | [VERIFICAR] | — | `storedFiles` (T01) |

### 7.31 `associateRegisterEditions`

Campos: `periodFrom`, `periodTo`, `cutoffDate`, `includePreviousCapital` (V2 3027), `folioFrom`, `folioTo`, `pdfObjectKey`, `hash`, `status` (`draft`, `issued`, `rubricated`), `corrections` [{ `associateMembershipId` (antes `membershipId`), `text` }]. Índice `{tenantId, periodTo}`.

Campos de `associateRegisterEditions`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `legalEntityId` | ObjectId | Sí | Entidad dueña del libro; folios y ediciones son correlativos por entidad (secuencia `ins.registerFolio:<legalEntityCode>`, RF-INS-022); índice `{tenantId, legalEntityId, periodTo}` (RF-INS-021; DEC-096; antes `{tenantId, periodTo}`). | `legalEntities` (T04) |
| `periodFrom` | Date | [VERIFICAR] | — | — |
| `periodTo` | Date | [VERIFICAR] | — | — |
| `cutoffDate` | Date | [VERIFICAR] | — | — |
| `includePreviousCapital` | Bool | [VERIFICAR] | V2 3027. | — |
| `folioFrom` | Date | [VERIFICAR] | — | — |
| `folioTo` | Date | [VERIFICAR] | — | — |
| `storedFileId` | ObjectId | No | PDF de la edición. Antes `pdfObjectKey` (T05 §7.2, PA-INS-13). | `storedFiles` (T01) |
| `hash` | String | [VERIFICAR] | — | — |
| `status` | Enum | Sí | `draft`, `issued`, `rubricated`. | — |
| `corrections` | [Object] | [VERIFICAR] | Lista; subcampos: `associateMembershipId` (antes `membershipId`), `text`. | — |

### 7.32 `memberCredentials`

Campos: `associateMembershipId` (antes `membershipId`), `issueNumber`, `issuedAt`, `templateId` (`Credencial_Tipo`), `qrTokenHash`, `channel` (`print`, `digital`), `status` (`active`, `revoked`). Índice `{tenantId, associateMembershipId, status}`; `{qrTokenHash}` único.

Campos de `memberCredentials`:

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `associateMembershipId` | ObjectId | Sí | Asociado (padrón de M17); no es `memberships` de T02 (ver §7.1). Antes `membershipId` (PA-INS-12). | `associateMemberships` (M17) |
| `issueNumber` | String | [VERIFICAR] | — | — |
| `issuedAt` | Date (fecha y hora) | Cond. | — | — |
| `templateId` | ObjectId | [VERIFICAR] | `Credencial_Tipo`. | `documentTemplates` (T11), según T05 §7.2.1; antes `[VERIFICAR] plantilla de credencial` (PA-INS-13) |
| `qrTokenHash` | String | Sí | — | — |
| `channel` | Enum | [VERIFICAR] | `print`, `digital`. | — |
| `status` | Enum | Sí | `active`, `revoked`. | — |

### 7.33 `capitalBalances` — saldo de capital por asociado (proyección)

Proyección materializada del libro mayor (`capitalMovements`, §7.8) que sirve al resumen de capital (RF-INS-046), a la ficha 360 y al portal (RF-INS-015) y a la conciliación de migración (HUECO-CAP-03). **No es fuente de verdad**: se recalcula desde los movimientos confirmados y nunca se edita a mano.

| Campo | Tipo | Oblig. | Descripción | Referencia |
|---|---|---|---|---|
| `associateMembershipId` | ObjectId | Cond. | Asociado (nulo para capital a regularizar de no asociados, CTR-INS-06). Antes `membershipId` (PA-INS-12). | `associateMemberships` (M17) |
| `personId` | ObjectId → M01 | Sí | — | `persons` (M01) |
| `legalEntityId` | ObjectId | Sí | Entidad del saldo (la de los movimientos; RN-INS-053; DEC-096). | `legalEntities` (T04) |
| `accountId`, `contractId` | ObjectId → M01 / M02 | No | Apertura opcional por cuenta y contrato. | `accounts` (M01) / `serviceContracts` (M02) |
| `capitalItemId` | ObjectId | Sí | Rubro (`capitalItems`, §7.5; origen `RUBCAPI`). | `capitalItems` (M17) |
| `subscribed`, `billed`, `committed`, `paid`, `reserved`, `refunded` | Decimal128 | Sí | Σ de movimientos confirmados por tipo. | — |
| `pendingToPay` | Decimal128 | Sí | `subscribed − paid`. | — |
| `overdue` | Decimal128 | Sí | Pendiente con vencimiento < `asOf`. | — |
| `asOf` | Date | Sí | Fecha del último movimiento aplicado. | — |
| `lastMovementId` | ObjectId | Sí | Control de recálculo idempotente. | `capitalMovements` (M17) |

Índices: `{tenantId, legalEntityId, associateMembershipId, capitalItemId, accountId, contractId}` único (DEC-096; antes `{tenantId, associateMembershipId, capitalItemId, accountId, contractId}`, y antes `membershipId`); `{tenantId, legalEntityId, capitalItemId}` (antes `{tenantId, capitalItemId}`). Origen: derivado; en migración se compara con `CAPITAL_RES.SUSCRIPTO`/`VENDIDO` (CTR-INS-03, REP-INS-05).

## 8. Estados y transiciones

### 8.1 Membresía (`associateMemberships.status`)

Estado inicial: `applicant` (PRM-INS-005 define si al aprobar pasa a `active` o queda en `pendingApproval`; PA-INS-13).

| Origen | Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|---|
| — | `applicant` | Operador / asociado PWA | Persona en M01 | Evento `ins.membership.requested` | Anular solicitud |
| `applicant` | `pendingApproval` | Secretaría | Documentación completa, estatuto aceptado | Tema propuesto para el próximo consejo | Volver a `applicant` |
| `pendingApproval` | `active` | Consejo (vía acta) / Secretaría con PRM-INS-005 = `active` | Resolución aprobada | Número asignado, suscripción si PRM-INS-015 = afiliación, `ins.membership.approved` | Solo por exclusión o egreso posterior |
| `pendingApproval` | `rejected` | Consejo | Resolución con motivo | Notificación | Nueva solicitud |
| `active` | `suspended` | Consejo | Resolución | Sin voto ni elegibilidad | `reinstated` → `active` |
| `active` | `withdrawalRequested` | Asociado / Secretaría | Solicitud de egreso | Trámite T11 | Desistimiento → `active` |
| `withdrawalRequested` | `withdrawn` | Consejo / Secretaría | Validaciones RN-INS-007/008 | `ins.membership.exited`, rescate si corresponde | Reingreso (nueva membresía) |
| `active` | `exclusionPending` | Consejo | Resolución y notificación | Plazo de apelación | Revocación por asamblea → `active` |
| `exclusionPending` | `excluded` | Sistema al vencer el plazo / Asamblea | Sin apelación o apelación rechazada | `ins.membership.exited` | Reingreso |
| cualquiera no terminal | `deceased` | Sistema (evento M01) | `per.person.deceased` | Alertas, M18 | Corrección de identidad en M01 revierte con auditoría |
| `active` | `dissolved` | Secretaría | Persona jurídica extinguida | `ins.membership.exited` | — |

### 8.2 Movimiento de capital

Estado inicial de `capitalMovements.status`: alta → `pending` (PA-INS-13).

`pending` → `confirmed` (aprobación o evento confirmado) → (contramovimiento) `reversed` es una marca derivada por `reversedByMovementId`; `pending` → `rejected`. Un `confirmed` nunca se edita.

### 8.3 Rescate de capital

`requested` → `calculated` (sistema) → `pendingApproval` (T11) → `approved` → `queued` (si supera el límite anual) o `scheduled` → `paid` (evento `tes.paymentExecution.executed`, EVT-TES-15). Desde `requested`/`calculated`/`pendingApproval`: `cancelled` o `rejected`. `paid` solo se revierte con anulación de la orden de pago en M14 (vuelve a `scheduled`).

### 8.4 Transferencia de capital

Estado inicial de `capitalTransfers.status`: alta → `draft` (PA-INS-13).

`draft` → `pendingApproval` → `approved` → `executed` (movimientos espejo) ; `pendingApproval` → `rejected`; `executed` → `voided` con contramovimientos y aprobación.

### 8.5 Distribución de excedentes

Estado inicial de `surplusDistributions.status`: alta → `draft` (PA-INS-13).

`draft` → `simulated` → `approved` (requiere `resolutionId`) → `executing` (JOB-INS-07) → `executed`; `approved`/`simulated` → `voided`. Una distribución `executed` solo se corrige con una distribución complementaria.

### 8.6 Reunión

Estado inicial de `meetings.status`: alta → `draft` (PA-INS-13).

`draft` → `convened` (publicada convocatoria) → `inProgress` → (`recess` ↔ `inProgress`) → `closed`; `draft`/`convened` → `cancelled`. Reapertura de `closed` solo si el acta no está firmada y con permiso `ins.reuniones.reabrir`.

### 8.7 Acta (`minutes.signatureStatus`)

Estado inicial de `minutes.signatureStatus`: alta → `draft` (PA-INS-13).

`draft` → `pendingSignatures` → `signed` (bloqueo, hash) ; `draft` → `voided`. Corrección de `signed`: acta nueva con `correctsMinuteId`.

### 8.8 Padrón

`preliminary` → `observed` (exhibición con reclamos) → `final` (aprobado); cualquier cambio de criterio o resolución de reclamo sobre un `final` crea versión nueva y deja la anterior en `superseded`.

### 8.9 Votación

Estado inicial de `votingSessions.status`: alta → `open` (PA-INS-13).

`open` → `closed` → `tallied` (resultado); `open`/`closed` → `voided` (con motivo y resolución).

### 8.10 Mandato

`active` → `ended` (fin de período), `resigned`, `removed`, `replaced` (asume suplente: se crea un mandato nuevo para el suplente).

### 8.11 Honorario liquidado

Estado inicial de `institutionalFeeSettlements.status`: alta → `draft` (PA-INS-13).

`draft` → `approved` → `paid` (evento M14); `draft`/`approved` → `voided`.

### 8.12 Informe INAES

Estado inicial de `inaesReports.status`: alta → `draft` (PA-INS-13).

`draft` → `validated` → `submitted` → `acknowledged` | `rejected` (→ nueva versión `draft`).

### 8.13 Tablas de transiciones agregadas (corrección 05-11-2026)

> **Corrección 05-11-2026 (estados):** se agregan tablas de transiciones para las colecciones cuyo §7 enumeraba estados sin transiciones y para las máquinas del §8.3, §8.8 y §8.10 cuyo texto corrido dejaba estados del §7 sin una transición identificable (`capitalRefunds`: `cancelled`, `rejected`; `rosters`: `superseded`; `bodyMandates`: `resigned`, `removed`, `replaced`). El texto de esas subsecciones se conserva; las tablas lo explicitan sin cambiarlo. "—" en Guarda o Evento indica que el anexo no declara una RN o un evento para ese paso; las transiciones sin respaldo explícito llevan `[VERIFICAR]`.

#### 8.13.1 Rescate de capital (`capitalRefunds.status`)

Estado inicial: `requested`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `requested` | Solicitud de rescate | RN-INS-023 | — |
| `requested` | `calculated` | Cálculo del sistema | RN-INS-023 | — |
| `calculated` | `pendingApproval` | Envío a aprobación (T11) | — | — |
| `pendingApproval` | `approved` | Aprobación | — | EVT-INS-11 `ins.capitalRefund.approved` (antes `ins.capital.refund.approved`) |
| `approved` | `queued` | El rescate supera el límite anual | — | — |
| `approved`, `queued` | `scheduled` | Programación del pago | — | — |
| `scheduled` | `paid` | `tes.paymentExecution.executed` (EVT-TES-15) | — | EVT-INS-12 `ins.capitalRefund.paid` (antes `ins.capital.refund.paid`) |
| `paid` | `scheduled` | Anulación de la orden de pago en M14 | — | — |
| `requested`, `calculated`, `pendingApproval` | `cancelled` | Cancelación por el asociado o el operador | — | — |
| `requested`, `calculated`, `pendingApproval` | `rejected` | Rechazo | — | — |

#### 8.13.2 Padrón (`rosters.status`)

Estado inicial: `preliminary`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `preliminary` | Generación del padrón con sus criterios | RN-INS-031, RN-INS-044 | — |
| `preliminary` | `observed` | Exhibición con reclamos | — | — |
| `preliminary`, `observed` | `final` | Aprobación del padrón | — | EVT-INS-18 `ins.roster.finalized` |
| `final` | `superseded` | Cambio de criterio o resolución de reclamo (crea versión nueva) | — | — |

#### 8.13.3 Mandato (`bodyMandates.status`)

Estado inicial: `active`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `active` | Inicio del mandato | RN-INS-042 | EVT-INS-19 `ins.mandate.started` |
| `active` | `ended` | Fin del período | — | EVT-INS-19 `ins.mandate.ended` |
| `active` | `resigned` | Renuncia | — | EVT-INS-19 `ins.mandate.ended` |
| `active` | `removed` | Remoción | — | EVT-INS-19 `ins.mandate.ended` |
| `active` | `replaced` | Asume el suplente (se crea un mandato nuevo para él) | RN-INS-042 | EVT-INS-19 `ins.mandate.ended` |

#### 8.13.4 Reserva de capital (`capitalReserves.status`)

Estado inicial: `active`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `active` | Reserva de capital | RN-INS-022 | EVT-INS-08 `ins.capitalMovement.recorded` (antes `ins.capital.movement.recorded`) `[VERIFICAR]` |
| `active` | `released` | Recupero de la reserva | RN-INS-022 | — |
| `active` | `applied` | Aplicación de la reserva a un rescate o egreso `[VERIFICAR]` | — | — |
| `active` | `voided` | Anulación | — | EVT-INS-09 `ins.capitalMovement.reversed` (antes `ins.capital.movement.reversed`) `[VERIFICAR]` |

#### 8.13.5 Cierre de capital (`capitalClosings.status`)

Estado inicial: `closed`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `closed` | Cierre de capital a la fecha | RN-INS-024 | — |
| `closed` | `reopened` | Reapertura aprobada (`reopenApprovalId`) | — | — |
| `reopened` | `closed` | Nuevo cierre (nueva versión) `[VERIFICAR]` | RN-INS-024 | — |

#### 8.13.6 Título de capital (`shareCertificates.status`)

Estado inicial: `issued`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `issued` | Emisión del título | — | — |
| `issued` | `replaced` | Emisión de un título que lo reemplaza (`replacesCertificateId`) | — | — |
| `issued` | `voided` | Anulación | — | — |

#### 8.13.7 Asignación de excedentes (`surplusAllocations.status`)

Estado inicial: `pending`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `pending` | Aprobación de la distribución | RN-INS-039 | EVT-INS-13 `ins.surplusDistribution.approved` (antes `ins.surplus.distribution.approved`) |
| `pending` | `executed` | Ejecución (capitalización, crédito o pago) | RN-INS-039 | EVT-INS-13 `ins.surplusDistribution.executed` (antes `ins.surplus.distribution.executed`) |
| `pending` | `unclaimed` | Vence el plazo de cobro sin reclamo `[VERIFICAR]` | — | — |
| `unclaimed` | `prescribed` | Prescripción `[VERIFICAR]` | — | — |
| `unclaimed` | `executed` | Cobro tardío dentro del plazo de prescripción `[VERIFICAR]` | — | — |
| `pending` | `voided` | Anulación de la distribución `[VERIFICAR]` | — | — |

#### 8.13.8 Resolución (`resolutions.status`)

Estado inicial: `open`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `open` | Registro de la resolución del órgano | — | EVT-INS-17 `ins.resolution.created` |
| `open` | `inProgress` | Inicio del cumplimiento `[VERIFICAR]` | — | — |
| `open`, `inProgress` | `done` | Cumplimiento registrado | — | — |
| `open`, `inProgress` | `cancelled` | Dejada sin efecto por el órgano | — | — |

#### 8.13.9 Poder (`proxies.status`)

Estado inicial: `submitted`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `submitted` | Presentación del poder para la reunión | — | — |
| `submitted` | `validated` | Validación (otorgante y apoderado habilitados en el padrón) | RN-INS-032 | — |
| `submitted` | `rejected` | Rechazo de la validación | — | — |
| `submitted`, `validated` | `revoked` | Revocación por el otorgante | — | — |

#### 8.13.10 Lista electoral (`electoralLists.status`)

Estado inicial: `submitted`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `submitted` | Presentación de la lista | — | — |
| `submitted` | `observed` | Observación de la junta electoral | — | — |
| `observed` | `submitted` | Subsanación de las observaciones `[VERIFICAR]` | — | — |
| `submitted`, `observed` | `officialized` | Oficialización | — | — |
| `submitted`, `observed` | `rejected` | Rechazo | — | — |
| `submitted`, `observed`, `officialized` | `withdrawn` | Retiro por los apoderados `[VERIFICAR]` | — | — |

#### 8.13.11 Edición del registro de asociados (`associateRegisterEditions.status`)

Estado inicial: `draft`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `draft` | Generación de la edición | RN-INS-047 | — |
| `draft` | `issued` | Emisión del libro (PDF en `storedFiles`) | — | — |
| `issued` | `rubricated` | Registro de la rúbrica | — | — |

#### 8.13.12 Credencial de asociado (`memberCredentials.status`)

Estado inicial: `active`.

| Desde | Hacia | Disparador | Guarda (RN) | Evento (EVT) |
|---|---|---|---|---|
| (alta) | `active` | Emisión de la credencial | — | — |
| `active` | `revoked` | Revocación (egreso, suspensión o reemisión) `[VERIFICAR]` | — | — |

## 9. Procesos y flujos

### 9.1 Ingreso de asociado

1. La persona existe o se crea en M01 (identidad verificada según política de M01).
2. Se carga la solicitud (admin, mesa o PWA): estatuto aceptado (versión), suscripción propuesta según `capitalSubscriptionRules` (`trigger = admission`), documentos. M01 informa avisos (deuda en el domicilio, RN-INS-049).
3. Secretaría valida y pasa a `pendingApproval`; el sistema agrupa solicitudes en un tema `membershipBatch` del próximo consejo.
4. Al firmarse el acta con el tema aprobado: número desde `numberingSequences` de T11 (CTR-DAT-16; antes `insNumberingSeries`), `active`, credencial digital, suscripción de capital si PRM-INS-015 = `admission`, evento `ins.membership.approved` (M01, M19, T09 bienvenida).
5. Rechazo: notificación con motivo.

### 9.2 Egreso

1. Solicitud (renuncia), resolución (exclusión) o evento (fallecimiento, extinción).
2. Validaciones: servicios activos (PRM-INS-008), capital integrado (PRM-INS-007), cuentas (PRM-INS-011), mandatos vigentes (se finalizan).
3. Resolución del consejo; registro del egreso; `ins.membership.exited`.
4. Si hay capital integrado: se crea el rescate (9.5).
5. M05 aplica PRM-INS-009; los servicios no se tocan (RF-INS-101).

### 9.3 Registración de capital desde facturación y cobranza (O5 si se habilita)

1. M05 publica `fac.invoice.issued` (por comprobante) o `fac.billingRun.issued` (por lote).
2. Consumidor de M17: para cada renglón con concepto capitalizable crea `capitalMovements` tipo `billed` (y `subscribed` si PRM-INS-015 = `billing`) con `idempotencyKey`.
3. JOB-INS-01 `ins:registrar-capital-lote`: procesa lotes grandes por páginas de 1.000 renglones, registra progreso, reanuda desde el último cursor, y publica `ins.capitalMovement.recorded` (antes `ins.capital.movement.recorded`) por movimiento (o resumen por lote para M15 según PRM de M15).
4. M07 publica `cob.payment.confirmed` con la imputación por comprobante → `paid` = capital del comprobante × imputado / total (RN-INS-015).
5. Reversiones: `fac.invoice.annulled`, `cob.receipt.voided` / `cob.allocation.reversed`, `mor.agreement.annulled` → contramovimientos.
6. Lock: mientras JOB-INS-01 procesa un universo, M05 no puede re-emitir ese mismo universo (RF-INS-044).
7. Errores: movimiento con rubro inexistente queda `rejected` con motivo en la bandeja de excepciones; reintento manual tras corregir configuración.

### 9.4 Revisión y cierre de capital

1. JOB-INS-02 `ins:revisar-capital` (manual o nocturno): recorre comprobantes y pagos del período, calcula movimientos esperados y compara; propone ajustes `review` para aprobación.
2. JOB-INS-12 `ins:conciliar-capital-contable`: compara saldos por rubro con M15 y lista diferencias.
3. Cierre (`capitalClosings`): bloquea movimientos con fecha ≤ cierre; reapertura con aprobación.

### 9.5 Rescate / reembolso

1. Origen: egreso, fallecimiento (derechohabientes) o rescate parcial estatutario.
2. Cálculo: integrado − compensaciones autorizadas (deuda exigible de M07) + interés si corresponde.
3. Aprobación del consejo (tema `refund`).
4. Límite anual: si el total aprobado del ejercicio supera PRM-INS-026 × capital integrado del último balance, queda `queued` con posición (orden PRM-INS-027). JOB-INS-11 al aprobarse un nuevo balance libera la cola.
5. Emisión del comprobante de rescate (tipo y concepto configurados) vía M05; orden de pago vía M14; movimiento `refunded`; asiento vía M15.

### 9.6 Distribución de excedentes

1. M15 cierra el ejercicio y publica `con.fiscalYear.closed`.
2. Contador crea la distribución y ejecuta JOB-INS-06 `ins:calcular-distribucion-excedentes` (simulación por asociado con base de retorno elegida).
3. Se incorpora como documento del expediente de la asamblea ordinaria.
4. La asamblea aprueba (resolución) → `approved`.
5. JOB-INS-07 `ins:ejecutar-distribucion`: por asociado genera capitalización, crédito (M07) u orden de pago (M14); asientos; constancias. Reanudable por asociado; idempotente por `distributionId + associateMembershipId` (antes `membershipId`).

### 9.7 Asamblea

1. Consejo resuelve convocar (tema en reunión de consejo).
2. Secretaría crea la reunión de asamblea, orden del día, expediente (memoria, estados contables, informes, proyecto de distribución), modalidad.
3. JOB-INS-03 `ins:generar-padron` con criterios → padrón preliminar; exhibición en PWA; reclamos; versión final aprobada.
4. Publicación de convocatoria (T09) con anticipación PRM-INS-033 y registro de comunicación al INAES/órgano local.
5. Listas (si hay elección): presentación, oficialización por junta electoral.
6. Día de la asamblea: acreditación (PAN-INS-20), poderes, quórum; primer/segundo llamado.
7. Tratamiento por tema; votaciones (`votingSessions`); resoluciones.
8. Cierre; acta generada desde temas y resultados; firmas; libro de actas.
9. Efectos: mandatos electos (`bodyMandates`), distribución aprobada, honorarios aprobados, reglamentos.
10. Presentación post-asamblea (RF-INS-091) dentro de PRM-INS-036.

### 9.8 Reunión de consejo

Programación → orden del día (incluye temas desde CRM/mesa de entradas y lotes de ingresos, rescates, transferencias) → asistencia y quórum → resoluciones → acta → firmas → efectos sobre objetos vinculados (cada `linkedRef` recibe la decisión vía evento `ins.resolution.created`).

### 9.9 Honorarios

JOB-INS-10 `ins:liquidar-honorarios` (mensual): por `institutionalFees` vigente y mandatos activos en el período calcula importe (prorrateo PRM-INS-038), crea `institutionalFeeSettlements` en `draft`; aprobación; orden de pago M14 con retención M06; evento `ins.fee.settled` a M15.

### 9.10 Informes INAES y libro

JOB-INS-04 `ins:emitir-libro-asociados` y JOB-INS-05 `ins:exportar-inaes` (lotes por PRM-INS-047) generan archivos con hash; validación previa de códigos INAES; registro de presentación y acuse.

### 9.11 Alertas

JOB-INS-09 `ins:alertas-institucionales` (diario): mandatos por vencer, asamblea ordinaria pendiente, presentaciones INAES, rescates en cola, resoluciones vencidas, asociados sin servicios (RF-INS-100).

### 9.12 Credenciales masivas

JOB-INS-08 `ins:emitir-credenciales-masivas` desde un padrón o filtro; PDF imprimible y activación de credencial digital.

## 10. Pantallas

> **Corrección 05-11-2026 (capabilities de pantallas):** las fichas que indicaban "Pública", "Sesión", "Dispositivo" o una regla en texto libre en la columna Capability usan ahora `public: true` o una capability `modulo.recurso.accion` de la convención de T02. El valor anterior queda entre paréntesis como "antes: …". Según la regla AL-01 de T03, prevalece este anexo y T03 se ajusta.

Convenciones comunes (CNX): listados con `DataTable` (filtros arriba, columnas configurables, exportación CSV/XLSX según permiso, paginación `{items,total,page,size}`), fichas con pestañas, acciones primarias a la derecha, modales de confirmación con motivo obligatorio para operaciones irreversibles, estados vacíos con acción sugerida y ayuda contextual (`?`) enlazada al glosario. Fechas `dd-mm-yyyy`.

| ID | App | Ruta | Capability | Propósito | Layout / filtros / columnas | Acciones y modales | Estado vacío / ayuda | Equivalencia ProCoop (INV) |
|---|---|---|---|---|---|---|---|---|
| PAN-INS-01 | admin | `/ins/asociados` | `ins.asociados.ver` | Listado de asociados | Filtros: estado, número, nombre/CUIT, distrito, categoría INAES, fecha de alta desde/hasta, con deuda de capital, con mandato. Columnas: número, nombre, documento enmascarado, estado, alta, antigüedad, distrito, capital integrado, saldo de capital. | Nuevo ingreso, exportar, credenciales masivas, abrir ficha | "No hay asociados con esos filtros" + "Registrar solicitud" | `frmTitulares` (búsqueda), `abm_Socios` |
| PAN-INS-02 | admin | `/ins/asociados/:id` | `ins.asociados.ver` | Ficha institucional | Cabecera: número, estado, antigüedad, categoría, distrito. Pestañas: Datos institucionales, Historia de estados, Capital (resumen y movimientos), Órganos y mandatos, Asambleas y asistencias, Documentos, Credencial, Auditoría. Enlace a ficha 360 (M01). | Cambiar estado (modal con motivo y acta), asignar distrito, emitir credencial, iniciar egreso, iniciar rescate, transferir capital, imprimir ficha | — | `frmTitulares` (pestañas socio), `detalleAsociados`, `frmTitulares.VerMovimientosCapital` |
| PAN-INS-03 | admin | `/ins/solicitudes` | `ins.asociados.aprobar` | Bandeja de solicitudes de ingreso | Filtros: estado, canal, fecha. Columnas: solicitante, fecha, canal, documentación completa, suscripción propuesta, reunión asignada. | Validar, pasar a consejo (lote), aprobar con acta, rechazar con motivo | "Sin solicitudes pendientes" | `Imprimir_SolicitudAltaBaja` |
| PAN-INS-04 | admin | `/ins/egresos` | `ins.asociados.egresar` | Trámites de egreso y exclusión | Columnas: asociado, causa, fecha, servicios activos, capital integrado, rescate, estado del trámite. | Registrar egreso, notificar exclusión, registrar apelación, imprimir solicitud | — | `frmTitulares.Imprimir_SolicitudBaja` |
| PAN-INS-05 | admin | `/ins/libro` | `ins.libro.emitir` | Libro de Registro de Asociados | Selector de período y fecha de corte, opción capital anterior. Historial de ediciones (folios, hash, estado). | Generar, marcar rubricado, descargar, registrar corrección | "Aún no se emitió el libro" | `Get_Informe_RegistroAsociados`, `frmSelectFechaCapital` |
| PAN-INS-06 | admin | `/ins/config/capital` | `ins.config.configurar` | Rubros, reglas de suscripción y valor de cuota social | Tres secciones: rubros (código, nombre, cuenta contable, rubros de producto), reglas (disparador, servicio, cuotas/importe, plan de integración, vigencia), valor nominal versionado. | Alta/edición/inactivación, versionar | Ayuda: "Un rubro de productos pertenece a un solo rubro de capital" | `abm_RubrosCapital`, `abm_Capital` |
| PAN-INS-07 | admin | `/ins/capital/movimientos` | `ins.capital.ver` | Movimientos de capital | Filtros: asociado, rubro, tipo, origen, fecha, estado contable. Columnas: fecha, asociado, tipo, origen (enlace), importe, estado, asiento. | Movimiento manual (modal con aprobación), revertir (motivo), reintentar contabilización, importar (PAN-INS-13) | — | `frmTitulares.VerMovimientosCapital`, `Capital_CuentaSocio` |
| PAN-INS-08 | admin | `/ins/asociados/:id/capital` | `ins.capital.ver` | Estado de cuenta de capital | Resumen por tipo (suscripto, facturado, comprometido, integrado, reservado, reembolsado, pendiente, vencido) y movimientos a una fecha de corte. | PDF, enviar por T09 | "Sin movimientos de capital" | `GetCapita_CuentaSocio` |
| PAN-INS-09 | admin | `/ins/capital/reservas` | `ins.reservas.gestionar` | Reservas y recuperos | Columnas: asociado, importe, destino, comprobante, estado. | Reservar, recuperar, anular | — | `frmRecuperoCapital`, `Capital_ReservaSocio` |
| PAN-INS-10 | admin | `/ins/capital/transferencias` | `ins.transferencias.crear` | Transferencias de capital entre asociados | Columnas: cedente, cesionario, cuotas, importe, servicios, estado. | Nueva (asistente: partes, capital, servicios, egreso del cedente), enviar a aprobación, ejecutar, anular | — | `frmTranferenciaCapital` |
| PAN-INS-11 | admin | `/ins/capital/rescates` | `ins.rescates.gestionar` | Rescates/reembolsos | Filtros: estado, ejercicio. Columnas: número, asociado, motivo, integrado, compensaciones, a reembolsar, posición en cola, estado, orden de pago. Indicador de límite anual usado/disponible. | Calcular, enviar a consejo, aprobar, programar, emitir comprobante, cancelar | "Sin rescates en curso" | `Rescate_Acciones` |
| PAN-INS-12 | admin | `/ins/capital/cierres` | `ins.cierres.crear` | Cierres, revisión y conciliación | Secciones: cierres (fecha, estado), revisión (período, propuesta de ajustes), conciliación con M15 (rubro, saldo M17, saldo M15, diferencia). | Cerrar, solicitar reapertura, ejecutar revisión, aprobar ajustes | — | `frmOpcionesEspeciales` (fecha cierre), modo revisión |
| PAN-INS-13 | admin | `/ins/capital/importar` | `ins.capital.importar` | Importación de capital (`ExcelImportWizard` de T07) | Pasos: plantilla, carga, mapeo, validación, simulación, confirmación. | Descargar plantilla, confirmar | — | `frmMigracionCapital`, `frmCapitalManual` |
| PAN-INS-14 | admin | `/ins/excedentes` | `ins.excedentes.calcular` | Distribución de excedentes | Cabecera: ejercicio, resultado, apropiaciones. Grilla por asociado: base, retorno, interés, forma. | Simular, adjuntar a asamblea, aprobar (con resolución), ejecutar, anular | "Esperando cierre del ejercicio en Contabilidad" | `frmDistribucionCapital`, `Distribucion`, `DetalleDistribucion`, `FiltrosDistribucion`, `ResultadoDistribucion` [VERIFICAR alcance real en ProCoop] |
| PAN-INS-15 | admin | `/ins/organos` | `ins.organos.gestionar` | Órganos, cargos y mandatos | Por órgano: cargos y ocupantes vigentes; histórico; vencimientos. | Alta de mandato, finalizar, reemplazar por suplente, imprimir nómina de autoridades | "Configure el Consejo de Administración" | `abm_Consejo`, CAT `CONSEJO` |
| PAN-INS-16 | admin | `/ins/reuniones` | `ins.reuniones.ver` | Agenda de reuniones | Vista calendario y lista. Filtros: tipo, estado, órgano, fecha. Solo reuniones permitidas si son reservadas. | Nueva reunión, duplicar, cancelar | "Sin reuniones programadas" | `frmReuniones`, `GetReuniones` |
| PAN-INS-17 | admin | `/ins/reuniones/:id` | `ins.reuniones.ver` | Detalle de reunión | Pestañas: Datos, Orden del día (temas con vínculos), Participantes y asistencia, Permisos, Resoluciones, Acta, Documentos. | Agregar tema desde CRM/mesa/lote, iniciar, registrar asistencia, cuarto intermedio, cerrar, generar acta | — | `frmReunion`, `abm_ReunionTemas`, `abm_ReunionAsistentes`, `abm_ReunionPermisos` |
| PAN-INS-18 | admin | `/ins/asambleas/:id` | `ins.reuniones.gestionar` | Expediente de asamblea | Línea de tiempo: resolución de convocatoria, documentación, padrón, publicación, listas, acto, acta, presentación post-asamblea; semáforo de plazos. | Publicar convocatoria (bloqueo por plazo), adjuntar documentos, registrar comunicación INAES | — | Sin equivalente (BASE §27) |
| PAN-INS-19 | admin | `/ins/padrones` | `ins.padrones.generar` | Padrones | Selección de asamblea, criterios (todos los filtros de RF-INS-079), conjunto guardado, columnas. Resultado: habilitados/excluidos con motivo; reclamos. | Generar preliminar, publicar exhibición, resolver reclamo, aprobar final, exportar PDF/XLSX | "Genere un padrón preliminar" | `frmPadronTitulares`, `Filtros_Padron`, `frmPadronTitulares_Columnas`, `frmPadronTitulares_Filtros` |
| PAN-INS-20 | pwa-empleado | `/app/ins/acreditacion/:meetingId` | `ins.asistencia.registrar` | Acreditación en el acto | Lector QR de credencial o búsqueda por número/documento; muestra habilitación, poderes que porta; contador de presentes y quórum en vivo. Funciona con conectividad intermitente (cola local y sincronización). | Acreditar, registrar retiro, validar poder | "Escanee una credencial" | `Imprimir_AsistenciaAsamblea` |
| PAN-INS-21 | admin | `/ins/asambleas/:id/votaciones` | `ins.votaciones.gestionar` | Votaciones y escrutinio | Por tema: método, mayoría, habilitados, opciones, recuento. | Abrir, cerrar, cargar recuento, anular con motivo, imprimir resultado | — | `Get_Informe_Votacion` |
| PAN-INS-22 | admin | `/ins/asambleas/:id/listas` | `ins.listas.gestionar` | Listas y junta electoral | Listas con candidatos por cargo, avales, observaciones, impugnaciones. | Registrar lista, observar, oficializar, rechazar | — | Sin equivalente |
| PAN-INS-23 | admin | `/ins/actas` | `ins.actas.ver` | Libros de actas | Filtros: libro, número, fecha, estado de firma. | Editar borrador, enviar a firma, firmar, generar PDF, corregir (acta nueva) | — | CAT `ACTAS`, `ActaReunion` |
| PAN-INS-24 | admin | `/ins/resoluciones` | `ins.reuniones.ver` | Seguimiento de resoluciones | Columnas: número, reunión, categoría, responsable, vencimiento, estado. | Cambiar estado, reasignar | "Sin resoluciones abiertas" | `ResolucionReunion` |
| PAN-INS-25 | admin | `/ins/honorarios` | `ins.honorarios.gestionar` | Honorarios institucionales | Definiciones vigentes (resolución, cargos, importe); liquidaciones por período. | Liquidar período, aprobar, enviar a pago, anular | — | Sin equivalente |
| PAN-INS-26 | admin | `/ins/inaes` | `ins.inaes.exportar` | Presentaciones INAES | Lista por tipo y período con vencimiento, lotes, validaciones, acuse. Catálogo de categorías. | Generar, validar, marcar presentado, registrar acuse | — | `ExportarAltasYBajas_INAES`, CAT `CAT_INAES` |
| PAN-INS-27 | admin | `/ins/credenciales` | `ins.credenciales.emitir` | Credenciales | Selección por padrón o filtro, plantilla. | Emitir masivo, revocar | — | `frmCredencialAsociado`, `frmPadronTitulares_Credenciales`, `Credencial_Tipo` |
| PAN-INS-28 | admin | `/ins/config` | `ins.config.configurar` | Configuración institucional | Formularios por grupo de parámetros (§14), estatuto vigente (versión y PDF), series de numeración, plantillas. | Guardar con auditoría | — | `frmOpcionesEspeciales`, parámetros TITULARES |
| PAN-INS-29 | admin | `/ins/config/distritos` | `ins.config.configurar` | Distritos electorales | Código, nombre, regla de asignación, bancas. | Alta, edición, reasignación masiva | — | Filtro distrito de `frmPadronTitulares` |
| PAN-INS-30 | pwa-socio | `/app/mi-asociacion` | `ins.mi.ver` | Mi asociación — **Componente embebido en PAN-POR-102** de M19 (M19 es dueño de la ruta y la tarjeta; M17 aporta el componente y las API-INS-063 a 066; HUE-SRV-04) | Tarjetas: estado, número, antigüedad, capital (resumen), credencial digital con QR, documentos (estatuto, memoria). Si no es asociado: "Asociarme". | Descargar estado de capital, mostrar credencial, solicitar egreso | "Todavía no sos asociado" | Sin equivalente |
| PAN-INS-31 | pwa-socio | `/app/asambleas` | `ins.mi.ver` | Convocatorias y padrón propio | Próximas asambleas, orden del día, documentación, mi habilitación y motivo. | Reclamar padrón, cargar poder | "No hay convocatorias vigentes" | Sin equivalente |
| PAN-INS-32 | pwa-socio | `/app/asociarme` | `ins.mi.solicitar` | Solicitud de ingreso | Pasos: datos (de M01), estatuto (aceptación), suscripción propuesta, documentos, confirmación. | Enviar solicitud | — | Sin equivalente |
| PAN-INS-33 | landing | `/<tenantSlug>/asambleas` | `public: true` (antes: público) | Convocatorias públicas | Convocatoria y documentación pública (sin datos personales). | Descargar | "Sin convocatorias" | Sin equivalente |

**Entidad jurídica en pantallas (DEC-096).** Con PRM-CFG-039 = `true`, PAN-INS-01, 03, 04, 05, 06, 07, 11, 12, 14, 15, 16 y las de padrón, asambleas e INAES muestran el filtro y la columna "Entidad" (`dict:ins.legalEntity`), limitados a las entidades del alcance del usuario (T02 RF-IAM-065); las altas (solicitud, regla, valor nominal, cierre, órgano, reunión, libro, informe INAES, distribución) piden la entidad o la heredan del registro padre. PAN-INS-02 muestra en la cabecera la entidad de la membresía y un enlace a las demás membresías de la persona. PAN-INS-12 suma la sección "Base de capital" (RF-INS-109, REP-INS-21) con la base congelada de cada cierre. Con una sola entidad nada de esto se muestra.

## 11. API

> **Corrección 05-11-2026 (capabilities):** las filas que tenían un rol, un texto libre o un patrón (`<acción>`, "Autenticado", "Pública", "según acción") en la columna Capability usan ahora una capability `modulo.recurso.accion` de la convención de T02, o `public: true` para los endpoints públicos (RF-IAM-061 de T02). El valor anterior queda entre paréntesis como "antes: …".

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-INS-001 | GET | `/api/admin/ins/memberships` | `ins.asociados.ver` | Listado paginado con filtros | Sí |
| API-INS-002 | POST | `/api/admin/ins/memberships` | `ins.asociados.crear` | Crear solicitud de ingreso | Sí (Idempotency-Key) |
| API-INS-003 | GET | `/api/admin/ins/memberships/:id` | `ins.asociados.ver` | Ficha institucional | Sí |
| API-INS-004 | GET | `/api/admin/ins/memberships/:id/summary` | `ins.asociados.ver` | Resumen para ficha 360 y M19 | Sí |
| API-INS-005 | PATCH | `/api/admin/ins/memberships/:id` | `ins.asociados.editar` | Editar datos institucionales (distrito, categoría, representante) | Sí (version) |
| API-INS-006 | POST | `/api/admin/ins/memberships/:id/transitions` | `ins.asociados.aprobar` / `ins.asociados.egresar` según destino | Cambio de estado (`toStatus`, motivo, acta, fecha efectiva) | Sí (Idempotency-Key) |
| API-INS-007 | POST | `/api/admin/ins/memberships/:id/renumber` | `ins.asociados.renumerar` | Solicitar renumeración | Sí |
| API-INS-008 | GET | `/api/admin/ins/memberships/:id/events` | `ins.asociados.ver` | Historia de estados | Sí |
| API-INS-009 | GET | `/api/admin/ins/membership-requests` | `ins.asociados.aprobar` | Bandeja de solicitudes | Sí |
| API-INS-010 | POST | `/api/admin/ins/membership-requests/batch-to-board` | `ins.asociados.aprobar` | Agrupar solicitudes como tema de consejo | Sí |
| API-INS-011 | POST | `/api/admin/ins/register-editions` | `ins.libro.emitir` | Generar Libro de Registro de Asociados (job) | Sí |
| API-INS-012 | GET | `/api/admin/ins/register-editions/:id/file` | `ins.libro.emitir` | Descargar edición | Sí |
| API-INS-013 | GET/POST/PATCH | `/api/admin/ins/capital-items` | `ins.config.configurar` | Rubros de capital | Sí |
| API-INS-014 | GET/POST/PATCH | `/api/admin/ins/capital-rules` | `ins.config.configurar` | Reglas de suscripción | Sí |
| API-INS-015 | GET/POST | `/api/admin/ins/share-values` | `ins.config.configurar` | Valor nominal versionado | Sí |
| API-INS-016 | GET | `/api/admin/ins/capital-movements` | `ins.capital.ver` | Movimientos con filtros | Sí |
| API-INS-017 | POST | `/api/admin/ins/capital-movements` | `ins.capital.ajustar` | Movimiento manual (queda `pending` hasta aprobación) | Sí (Idempotency-Key) |
| API-INS-018 | POST | `/api/admin/ins/capital-movements/:id/reverse` | `ins.capital.ajustar` | Contramovimiento | Sí |
| API-INS-019 | GET | `/api/admin/ins/memberships/:id/capital-statement` | `ins.capital.ver` | Estado de cuenta a fecha (`?asOf=`) | Sí |
| API-INS-020 | POST | `/api/admin/ins/capital-imports` | `ins.capital.importar` | Importación (simular/confirmar) | Sí |
| API-INS-021 | GET/POST | `/api/admin/ins/capital-reserves` | `ins.reservas.gestionar` | Reservas | Sí |
| API-INS-022 | POST | `/api/admin/ins/capital-reserves/:id/release` | `ins.reservas.gestionar` | Recupero | Sí |
| API-INS-023 | GET/POST | `/api/admin/ins/capital-transfers` | `ins.transferencias.crear` | Transferencias | Sí |
| API-INS-024 | POST | `/api/admin/ins/capital-transfers/:id/execute` | `ins.transferencias.crear` | Ejecutar transferencia aprobada | Sí |
| API-INS-025 | GET/POST | `/api/admin/ins/capital-refunds` | `ins.rescates.gestionar` | Rescates | Sí |
| API-INS-026 | POST | `/api/admin/ins/capital-refunds/:id/calculate` | `ins.rescates.gestionar` | Calcular importe | Sí |
| API-INS-027 | POST | `/api/admin/ins/capital-refunds/:id/transitions` | `ins.rescates.aprobar` | Aprobar, programar, rechazar, cancelar | Sí |
| API-INS-028 | GET/POST | `/api/admin/ins/capital-closings` | `ins.cierres.crear` | Cierres y reapertura | Sí |
| API-INS-029 | POST | `/api/admin/ins/capital-reviews` | `ins.capital.ajustar` | Ejecutar revisión (job) | Sí |
| API-INS-030 | GET | `/api/admin/ins/capital-reconciliation` | `ins.capital.ver` | Conciliación con M15 | Sí |
| API-INS-031 | GET/POST | `/api/admin/ins/share-certificates` | `ins.capital.ver` / `ins.capital.ajustar` | Títulos/certificados | Sí |
| API-INS-032 | GET/POST | `/api/admin/ins/surplus-distributions` | `ins.excedentes.calcular` | Distribuciones | Sí |
| API-INS-033 | POST | `/api/admin/ins/surplus-distributions/:id/simulate` | `ins.excedentes.calcular` | Simular | Sí |
| API-INS-034 | POST | `/api/admin/ins/surplus-distributions/:id/execute` | `ins.excedentes.ejecutar` | Ejecutar (job) | Sí |
| API-INS-035 | GET/POST/PATCH | `/api/admin/ins/bodies` | `ins.organos.gestionar` | Órganos y cargos | Sí |
| API-INS-036 | GET/POST/PATCH | `/api/admin/ins/mandates` | `ins.organos.gestionar` | Mandatos | Sí |
| API-INS-037 | GET/POST/PATCH | `/api/admin/ins/meetings` | `ins.reuniones.gestionar` | Reuniones y asambleas | Sí |
| API-INS-038 | POST | `/api/admin/ins/meetings/:id/transitions` | `ins.reuniones.gestionar` | Convocar, iniciar, cuarto intermedio, cerrar, cancelar | Sí |
| API-INS-039 | GET/POST/PATCH | `/api/admin/ins/meetings/:id/agenda-items` | `ins.reuniones.gestionar` | Orden del día | Sí |
| API-INS-040 | GET/POST/PATCH | `/api/admin/ins/meetings/:id/participants` | `ins.asistencia.registrar` | Participantes y asistencia | Sí |
| API-INS-041 | POST | `/api/admin/ins/meetings/:id/check-in` | `ins.asistencia.registrar` | Acreditación por QR/documento (lote offline) | Sí (clave por dispositivo + secuencia) |
| API-INS-042 | GET/PUT | `/api/admin/ins/meetings/:id/permissions` | `ins.reuniones.gestionar` | Permisos de reunión reservada | Sí |
| API-INS-043 | GET/POST/PATCH | `/api/admin/ins/minutes` | `ins.actas.editar` | Actas | Sí |
| API-INS-044 | POST | `/api/admin/ins/minutes/:id/sign` | `ins.actas.firmar` | Firmar | Sí |
| API-INS-045 | GET/PATCH | `/api/admin/ins/resolutions` | `ins.reuniones.ver` | Resoluciones y seguimiento | Sí |
| API-INS-046 | POST | `/api/admin/ins/rosters` | `ins.padrones.generar` | Generar padrón (job) | Sí |
| API-INS-047 | GET | `/api/admin/ins/rosters/:id/entries` | `ins.padrones.ver` | Entradas con motivo | Sí |
| API-INS-048 | POST | `/api/admin/ins/rosters/:id/transitions` | `ins.padrones.aprobar` | Publicar, aprobar final | Sí |
| API-INS-049 | POST | `/api/admin/ins/rosters/:id/claims/:entryId/resolve` | `ins.padrones.aprobar` | Resolver reclamo | Sí |
| API-INS-050 | GET/POST | `/api/admin/ins/roster-filter-sets` | `ins.padrones.generar` | Conjuntos de filtros guardados | Sí |
| API-INS-051 | GET/POST/PATCH | `/api/admin/ins/meetings/:id/proxies` | `ins.poderes.validar` | Poderes | Sí |
| API-INS-052 | GET/POST/PATCH | `/api/admin/ins/meetings/:id/electoral-lists` | `ins.listas.gestionar` | Listas | Sí |
| API-INS-053 | GET/POST/PATCH | `/api/admin/ins/voting-sessions` | `ins.votaciones.gestionar` | Votaciones y recuentos | Sí |
| API-INS-054 | GET/POST/PATCH | `/api/admin/ins/fees` | `ins.honorarios.gestionar` | Definiciones de honorarios | Sí |
| API-INS-055 | POST | `/api/admin/ins/fee-settlements/run` | `ins.honorarios.gestionar` | Liquidar período (job) | Sí |
| API-INS-056 | POST | `/api/admin/ins/fee-settlements/:id/transitions` | `ins.honorarios.aprobar` | Aprobar, anular | Sí |
| API-INS-057 | GET/POST | `/api/admin/ins/inaes-reports` | `ins.inaes.exportar` | Generar, validar, registrar presentación y acuse | Sí |
| API-INS-058 | GET/POST/PATCH | `/api/admin/ins/inaes-categories` | `ins.config.configurar` | Categorías INAES | Sí |
| API-INS-059 | POST | `/api/admin/ins/credentials/batch` | `ins.credenciales.emitir` | Credenciales masivas (job) | Sí |
| API-INS-060 | GET/POST/PATCH | `/api/admin/ins/districts` | `ins.config.configurar` | Distritos | Sí |
| API-INS-061 | GET/PUT | `/api/admin/ins/settings` | `ins.config.configurar` | Parámetros del módulo | Sí (version) |
| API-INS-062 | GET | `/api/admin/ins/reports/:reportId` | `ins.reportes.ver` | Reportes de §15 (`?format=json\|csv\|xlsx\|pdf`) | Sí |
| API-INS-063 | GET | `/api/ins/me` | `ins.mi.ver` | Mi asociación (PWA) | Sí |
| API-INS-064 | GET | `/api/ins/me/capital-statement` | `ins.mi.ver` | Mi estado de capital | Sí |
| API-INS-065 | GET | `/api/ins/me/credential` | `ins.mi.ver` | Credencial digital (QR rotativo) | Sí |
| API-INS-066 | POST | `/api/ins/me/requests` | `ins.mi.solicitar` | Solicitud de ingreso, egreso, poder o reclamo de padrón | Sí (Idempotency-Key) |
| API-INS-067 | GET | `/api/ins/me/meetings` | `ins.mi.ver` | Convocatorias y habilitación propia | Sí |
| API-INS-068 | GET | `/api/public/<tenantSlug>/ins/assemblies` | `public: true` (RF-IAM-061) (antes: público) | Convocatorias públicas | Sí |
| API-INS-069 | GET | `/api/v1/ext/ins/memberships/:memberNumber/status` | API key con scope `ins.status.ver` (antes `ins.status.read`) | Verificación externa de condición de asociado (sin datos personales) | Sí |
| API-INS-070 | GET | `/api/platform/ins/inaes-categories` | `ins.catalogosBase.gestionar` (capability de plataforma; antes `plataforma.catalogos.gestionar`) | Catálogo base de categorías INAES | Sí |
| API-INS-071 | GET | `/api/admin/ins/capital-base?legalEntityId=&asOf=` | `ins.capital.ver` | Base de capital de una entidad a una fecha (RF-INS-109; DEC-095): componentes, apertura por rubro, conciliación con M15, `final` y `closingId`. M06 usa el servicio interno equivalente `ins.capitalBase.get({ legalEntityId, asOf })`, que no es endpoint HTTP. | Sí |

Las listas y fichas de API-INS-001 a API-INS-062 aceptan `?legalEntityId=` y aplican la dimensión entidad jurídica del alcance del usuario (T02 RF-IAM-065); las altas exigen `legalEntityId` salvo con una sola entidad (DEC-096).

Errores RFC 9457 propios: `ins.membership.duplicated` (segunda membresía vigente de la persona en la misma entidad, DEC-096), `ins.membership.legalEntityMismatch` (registro derivado con entidad distinta de la membresía, RN-INS-053), `ins.membership.required`, `ins.membership.invalidTransition`, `ins.membership.hasActiveServices`, `ins.membership.hasPaidCapital`, `ins.number.duplicated`, `ins.capital.closed`, `ins.capital.itemNotFound`, `ins.capital.reserveExceedsPaid`, `ins.capital.registrationInProgress`, `ins.refund.annualLimitReached`, `ins.meeting.noticeTooShort`, `ins.meeting.reserved`, `ins.minute.signed`, `ins.roster.final`, `ins.vote.closed`, `ins.mandate.overlap`.

## 12. Eventos y jobs

### 12.1 Eventos emitidos

> **Corrección 05-11-2026 (payloads):** la columna Payload mínimo usa ahora nombres de campo en lugar de texto libre (por ejemplo `reason` en lugar de "motivo"), con los mismos nombres que la tabla de eventos de T11.

| ID | Evento | Payload mínimo | Consumidores |
|---|---|---|---|
| EVT-INS-01 | `ins.membership.requested` | `associateMembershipId` (antes `membershipId`), `legalEntityId`, `personId`, `channel` | T09, T11 |
| EVT-INS-02 | `ins.membership.approved` | `associateMembershipId` (antes `membershipId`), `legalEntityId`, `personId`, `memberNumber`, `admissionDate` | M01, M04 (beneficios por condición de asociado), M05, M19, T09 |
| EVT-INS-03 | `ins.membership.rejected` | `associateMembershipId` (antes `membershipId`), `legalEntityId`, `reason` | T09 |
| EVT-INS-04 | `ins.membership.suspended` / `ins.membership.reinstated` | `associateMembershipId` (antes `membershipId`), `legalEntityId`, `date` | M19, M01 (antes solo M19; alineado con T11 §12) |
| EVT-INS-05 | `ins.membership.exitRequested` | `associateMembershipId` (antes `membershipId`), `legalEntityId`, `cause` | T11 |
| EVT-INS-06 | `ins.membership.exited` | `associateMembershipId` (antes `membershipId`), `legalEntityId`, `cause`, `effectiveDate` | M01, M04, M05, M18, M19 |
| EVT-INS-07 | `ins.member.withoutServices` | `associateMembershipId` (antes `membershipId`), `legalEntityId` | T11 (bandeja de secretaría; antes "Bandeja secretaría", alineado con T11 §12) |
| EVT-INS-08 | `ins.capitalMovement.recorded` (antes `ins.capital.movement.recorded`) | `movementId`, `legalEntityId`, `type`, `amount`, `item`, `accountRef` | M15, M19 |
| EVT-INS-09 | `ins.capitalMovement.reversed` (antes `ins.capital.movement.reversed`) | `movementId`, `legalEntityId`, `reversesId` | M15 |
| EVT-INS-10 | `ins.capitalTransfer.executed` (antes `ins.capital.transfer.executed`) | `transferId`, `legalEntityId` | M15, M01 (si transfiere servicios) |
| EVT-INS-11 | `ins.capitalRefund.approved` (antes `ins.capital.refund.approved`) | `refundId`, `legalEntityId`, `amount` | M14, M05 (comprobante de rescate) |
| EVT-INS-12 | `ins.capitalRefund.paid` (antes `ins.capital.refund.paid`) | `refundId`, `legalEntityId` | M15, T09 |
| EVT-INS-13 | `ins.surplusDistribution.approved` / `.executed` (antes `ins.surplus.distribution.approved` / `.executed`) | `distributionId`, `legalEntityId`, `totals` | M15, M07, M14 |
| EVT-INS-14 | `ins.meeting.convened` | `meetingId`, `legalEntityId`, `type`, `date` | T09, M19, landing |
| EVT-INS-15 | `ins.meeting.closed` | `meetingId`, `legalEntityId` | T11 |
| EVT-INS-16 | `ins.minute.signed` | `minuteId`, `meetingId`, `legalEntityId`, `bookType`, `number` | T11, objetos vinculados |
| EVT-INS-17 | `ins.resolution.created` | `resolutionId`, `legalEntityId`, `category`, `affectedRefs` | M09, mesa de entradas, M17 (lotes de ingreso/egreso) |
| EVT-INS-18 | `ins.roster.finalized` | `rosterId`, `legalEntityId`, `totals` | M19 |
| EVT-INS-19 | `ins.mandate.started` / `ins.mandate.ended` | `mandateId`, `legalEntityId`, `personId`, `position` | T02 (asignación de roles institucionales), M17 honorarios |
| EVT-INS-20 | `ins.fee.settled` | `settlementId`, `legalEntityId`, `amount` | M14, M15, M06 |
| EVT-INS-21 | `ins.inaesReport.submitted` (antes `ins.inaes.report.submitted`) | `reportId`, `legalEntityId` | T11 |
| EVT-INS-22 | `ins.capitalBase.closed` / `ins.capitalBase.reopened` (DEC-095; RF-INS-109) | `closingId`, `legalEntityId`, `asOf`, `subscribed`, `paid`, `pendingToPay`, `reserved`, `refundsApprovedUnpaid`, `byCapitalItem`, `reconciliationStatus`; en `.reopened`: `closingId`, `legalEntityId`, `asOf`, `reopenApprovalId` | M06 (recalcula o marca para revisión las obligaciones propias que usaron esa base), M15 (conciliación), T10 |

Todos los eventos EVT-INS-01 a EVT-INS-22 llevan `legalEntityId` en el payload (DEC-096), copiado del objeto que los origina: todos los objetos de M17 que emiten eventos tienen ese campo obligatorio (§7.1, §7.8, §7.10, §7.11, §7.14, §7.17, §7.18, §7.22, §7.23, §7.24, §7.28, §7.30, §7.12), así que M01, M15, M19 y T09 separan por entidad sin consultar a M17. EVT-INS-16 suma `bookType` y `number` para identificar el acta dentro del libro de su entidad (RF-INS-087). *Reemplazado (10-11-2026, DEC-096): "Los eventos EVT-INS-01 a EVT-INS-21 incluyen además `legalEntityId` en el payload cuando el objeto lo tiene (membresías, movimientos, transferencias, rescates, distribuciones, reuniones, padrones, honorarios, informes INAES; DEC-096), para que M01, M15, M19 y T09 separen por entidad."*

### 12.2 Eventos consumidos

| Evento | Origen | Efecto en M17 |
|---|---|---|
| `per.person.deceased` | M01 | Estado `deceased`, finaliza mandatos, inicia rescate a derechohabientes (borrador). |
| `per.person.merged` | M01 | Reapunta `personId` en membresías y mandatos con auditoría. |
| `cat.contract.activated` / `cat.contract.terminated` (EVT-CAT-09/15) | M02 | Suscripción por `serviceActivation`; alerta "sin servicios". |
| `fac.invoice.issued` / `fac.billingRun.issued` (EVT-FAC-07/05) | M05 | Capital `billed` (y `subscribed` según PRM-INS-015). |
| `fac.invoice.annulled` (EVT-FAC-08) / `fac.creditNote.issued` / `fac.debitNote.issued` (EVT-FAC-10/11) | M05 | Contramovimiento o ajuste del capital de la cuenta del asociado. M17 se suscribe directamente a `fac.debitNote.issued` (EVT-FAC-11) para el ajuste en contra: el alias `fac.invoice.adjusted` resuelve solo a `fac.creditNote.issued` (T11 §12.4, PA-WFL-23). Para EVT-FAC-10 usa `invoiceId`, `originInvoiceIds` y `amount`: el contramovimiento se calcula sobre los renglones capitalizables de los comprobantes de `originInvoiceIds`. |
| `ven.salesOrder.confirmed` / `ven.salesOrder.cancelled` (EVT-VEN-07/10) | M11 | Capital `committed` / reversión. |
| `cob.payment.confirmed` (EVT-COB-04) / `cob.receipt.voided` / `cob.allocation.reversed` (EVT-COB-05/06) | M07 | Integración proporcional / reversión. |
| `mor.agreement.created` / `mor.agreement.annulled` (EVT-MOR-14) | M08 | Capital incluido en financiación / reversión. |
| `con.fiscalYear.closed` | M15 | Habilita distribución de excedentes y alerta de asamblea ordinaria; recalcula límite anual de rescates. Todo para la `legalEntityId` del ejercicio (DEC-096). |
| `con.entry.posted` (EVT-CON-01) / `con.event.failed` (EVT-CON-05) | M15 | Actualiza `accountingStatus`. |
| `tes.paymentExecution.executed` / `tes.paymentExecution.voided` (EVT-TES-15) | M14 | Rescate/honorario `paid` o vuelta a `scheduled`/`approved`. |
| `wfl.approval.decided` | T11 | Avanza transiciones pendientes de aprobación. |

Nota de alias (T11 §12.4): los nombres usados antes en este anexo quedan como alias en `eventTypes.aliases` y no se usan en suscripciones nuevas: `cat.serviceContract.*` → `cat.contract.*`; `fac.batch.issued` → `fac.billingRun.issued`; `fac.invoice.voided` → `fac.invoice.annulled`; `fac.invoice.adjusted` → `fac.creditNote.issued` (el ajuste en contra se consume directamente como `fac.debitNote.issued`, EVT-FAC-11; antes "`fac.invoice.adjusted` → `fac.creditNote.issued` / `fac.debitNote.issued`"); `ven.salesDocument.issued` / `.voided` → `ven.salesOrder.confirmed` / `.cancelled`; `cob.payment.voided` → `cob.receipt.voided`; `cob.payment.reversed` → `cob.allocation.reversed` (antes "`cob.payment.reversed` → `cob.receipt.voided` / `cob.allocation.reversed`"); `cob.allocation.applied` → `cob.payment.confirmed`; `mor.agreement.voided` → `mor.agreement.annulled`; `con.entry.failed` → `con.event.failed`; `tes.paymentOrder.paid` / `.voided` → `tes.paymentExecution.executed` / `.voided`. El comando de envío a T09 es `com.communications.emit` (API-COM-75); `com.messages.send` es alias del mismo endpoint (CTR-COM-10).

Los identificadores `ins.capital.closed`, `ins.refund.annualLimitReached`, `ins.meeting.reserved` e `ins.vote.closed` son **códigos de error RFC 9457** de §11, no tipos de evento; las entradas CNC-WFL-123 a CNC-WFL-126 de T11 §12.4.1 no requieren alias ni evento nuevo.

Tipos de evento renombrados a la convención `<mod>.<agregado>.<hecho>` (residuales del 05-11-2026, PA-INS-13): los de cuatro segmentos unen el 2.º y el 3.º en camelCase. `ins.capitalMovement.recorded` / `.reversed` (EVT-INS-08/09), `ins.capitalTransfer.executed` (EVT-INS-10), `ins.capitalRefund.approved` / `.paid` (EVT-INS-11/12), `ins.surplusDistribution.approved` / `.executed` (EVT-INS-13) e `ins.inaesReport.submitted` (EVT-INS-21); los nombres anteriores (`ins.capital.movement.*`, `ins.capital.transfer.executed`, `ins.capital.refund.*`, `ins.surplus.distribution.*`, `ins.inaes.report.submitted`) quedan como alias en T11 §12.4 y no se usan en suscripciones nuevas.

### 12.3 Jobs

| ID | Cola / nombre | Disparo | Reintentos | Cancelación / recuperación |
|---|---|---|---|---|
| JOB-INS-01 | `ins:registrar-capital-lote` | `fac.billingRun.issued` (EVT-FAC-05) | 5, backoff exponencial | Reanuda desde cursor; idempotente por `idempotencyKey`; lock por universo. |
| JOB-INS-02 | `ins:revisar-capital` | Manual / nocturno | 3 | Solo propone; no aplica sin aprobación. |
| JOB-INS-03 | `ins:generar-padron` | API-INS-046 | 3 | Se descarta la versión incompleta; reintento crea la misma versión. |
| JOB-INS-04 | `ins:emitir-libro-asociados` | API-INS-011 | 3 | Edición `draft` hasta completar. |
| JOB-INS-05 | `ins:exportar-inaes` | API-INS-057 | 3 | Por lote; lote fallido se regenera solo. |
| JOB-INS-06 | `ins:calcular-distribucion-excedentes` | API-INS-033 | 3 | Simulación reemplazable. |
| JOB-INS-07 | `ins:ejecutar-distribucion` | API-INS-034 | 5 | Por asociado; idempotente por `distributionId+associateMembershipId` (antes `membershipId`); cancelable deja `executing` reanudable. |
| JOB-INS-08 | `ins:emitir-credenciales-masivas` | API-INS-059 | 3 | Por asociado. |
| JOB-INS-09 | `ins:alertas-institucionales` | Cron diario 06:00 (America/Argentina/Cordoba) | 3 | Sin efecto económico. |
| JOB-INS-10 | `ins:liquidar-honorarios` | Cron mensual / API-INS-055 | 3 | Crea en `draft`; reejecución reemplaza borradores. |
| JOB-INS-11 | `ins:procesar-cola-rescates` | `con.fiscalYear.closed` / manual | 3 | Propone programación según límite. |
| JOB-INS-12 | `ins:conciliar-capital-contable` | Cron diario / manual | 3 | Solo lectura; publica diferencias en bandeja. |

## 13. Integraciones

| Integración | Tipo (T06) | Uso | Notas |
|---|---|---|---|
| INAES (presentaciones) | Exportación de archivos | Libro de asociados, altas/bajas, autoridades, documentación de asamblea | Formato y canal a confirmar (PA-INS-09); se diseña como adaptador de exportación versionado. |
| Órgano local de contralor | Exportación de archivos / registro manual de presentación | Documentación post-asamblea | Varía por provincia. |
| Firma electrónica/digital | Adaptador T06 | Firma de actas y libros | PA-INS-08; la firma la ejecuta T11 con el perfil de actas institucionales (T11 §18.5, CTR-WFL-12, DEC-078; O8/O9); T06 provee el adaptador desacoplado (sin proveedor fijo). |
| Plataforma de videoconferencia | Enlace | Asamblea a distancia o híbrida | Solo enlace y registro; la votación electrónica depende de PA-INS-05. |
| Mensajería T09 | Interna | Convocatorias, notificaciones de estado, credenciales | Plantillas por tenant. |
| Almacenamiento de objetos | Interna (T01) | PDF de actas, libros, credenciales, documentos | Hash SHA-256 y retención por política de T05. |
| API externa de verificación | `/api/v1/ext` | Terceros verifican condición de asociado (por ejemplo, convenios) | Solo estado y número; scope dedicado. |

## 14. Parámetros

Ámbitos: `tenant` (configuración general), `servicio` (por servicio del catálogo M02), `órgano` (por órgano social), `asamblea` (por reunión). Todos versionados con auditoría (T04). **Entidad jurídica (DEC-096):** todo parámetro de esta tabla con ámbito `tenant` admite también el ámbito `legalEntity` de T04 (RF-CFG-018/019, precedencia `branch` → `legalEntity` → `tenant`), porque cada entidad tiene su estatuto, su numeración, su capital, sus asambleas y su presentación al INAES; M17 los lee con la entidad de la membresía, de la reunión o del cierre. Con una sola entidad rige el valor de `tenant`.

| ID | Clave | Tipo | Ámbito | Default | Descripción | Origen V2 #n |
|---|---|---|---|---|---|---|
| PRM-INS-001 | `ins.memberNumber.format` | Objeto { prefijo, relleno } | tenant | sin prefijo, relleno 0 | Formato visible del número de asociado. | — (`NUM_SOC`) |
| PRM-INS-002 | `ins.memberNumber.allowManual` | Bool | tenant | false | Permite asignar número manual autorizado (validando unicidad). | 2660 |
| PRM-INS-003 | `ins.memberNumber.start` | Int | tenant, `legalEntity` | 1 (o máximo migrado + 1 de la entidad) | Valor inicial de la serie `ins.memberNumber:<legalEntityCode>` de cada entidad (DEC-096; antes ámbito solo tenant). | — |
| PRM-INS-004 | `ins.membership.applicationChannels` | Lista | tenant | `admin`, `desk`, `pwa` | Canales habilitados para solicitar ingreso. | — |
| PRM-INS-005 | `ins.membership.initialState` | Enum `pendingApproval`/`active` | tenant | `pendingApproval` | Estado al registrar: requiere acta (default) o activación directa con regularización posterior por acta. | 2591 |
| PRM-INS-006 | `ins.service.requiresActiveMembership` | Bool | servicio | false | El servicio solo se contrata con membresía activa. Es un parámetro, no un servicio interno: lo consulta M02 al dar de alta el contrato (RF-INS-009, PA-INS-13). | 734 |
| PRM-INS-007 | `ins.exit.blockWithPaidCapital` | Bool | tenant | true | Bloquea el egreso con capital integrado sin rescate iniciado. | 337 |
| PRM-INS-008 | `ins.exit.allowWithActiveServices` | Bool | tenant | false | Permite egresar con servicios activos (continúa como cliente). | 340 |
| PRM-INS-009 | `ins.billing.blockExMembers` | Bool | tenant | false | M05 no factura a ex asociados (política consultada). | 741 |
| PRM-INS-010 | `ins.reentry.keepNumber` | Bool | tenant | true | Reingreso conserva el número anterior. | 2673 |
| PRM-INS-011 | `ins.exit.allowWithoutAccounts` | Bool | tenant | true | Egreso de asociados sin cuentas. | 2633 |
| PRM-INS-012 | `ins.transfer.allowToExMembers` | Bool | tenant | false | Transferir cuentas o capital a ex asociados. | 2552 |
| PRM-INS-013 | `ins.alert.memberWithoutServices` | Bool | tenant | true | Alerta al quedar sin servicios (sin bloquear). | 2324, 2571 |
| PRM-INS-014 | `ins.capital.autoCapitalization` | Bool | tenant | true si hay rubros | Capitalización automática desde comprobantes. | 2736 (inverso) |
| PRM-INS-015 | `ins.capital.subscriptionMoment` | Enum `admission`/`serviceActivation`/`billing` | tenant | `admission` | Momento de la suscripción. | 2636, 73 |
| PRM-INS-016 | `ins.capital.integrationMoment` | Enum `payment`/`billing` | tenant | `payment` | Momento de la integración. | 2916 |
| PRM-INS-017 | `ins.capital.billingMode` | Enum `inServiceInvoice`/`ownDocument`/`none` | tenant | `inServiceInvoice` | Cómo se cobra la cuota social (DEC-061: renglón identificado en la factura del servicio con auxiliar separado y leyenda; antes PA-INS-02). | — (BASE §97.7) |
| PRM-INS-018 | `ins.capital.reviewWindowDays` | Int | tenant | 20 | Antigüedad a partir de la cual JOB-INS-02 revisa movimientos. | 2855 |
| PRM-INS-019 | `ins.capital.debtThreshold` | Decimal | tenant | 0 | Deuda de capital tolerada para el padrón. | 2606 |
| PRM-INS-020 | `ins.roster.capitalDebtAsOf` | Enum `meetingDate`/`cutoffDate`/`fixedDate` | asamblea | `cutoffDate` | Fecha a la que se mide la deuda de capital. | 2429 |
| PRM-INS-021 | `ins.capital.reserveConceptId` | Ref M02 | tenant | — | Concepto de reserva de capital. | 753 |
| PRM-INS-022 | `ins.capital.reserveDocumentTypeId` | Ref M05 | tenant | — | Comprobante de reserva. | 754 |
| PRM-INS-023 | `ins.capital.allowReserveAbovePaid` | Bool | tenant | false | Reservar más que lo integrado (con aprobación). | 2716 |
| PRM-INS-024 | `ins.capital.refundConceptId` | Ref M02 | tenant | — | Concepto de reembolso. | 2575 |
| PRM-INS-025 | `ins.capital.refundDocumentTypeId` | Ref M05 | tenant | — | Comprobante de rescate. | 2576, 2792 |
| PRM-INS-026 | `ins.capital.refundAnnualLimitPct` | Decimal | tenant | 5 | % del capital integrado del último balance destinable a reembolsos por ejercicio. | — |
| PRM-INS-027 | `ins.capital.refundQueueOrder` | Enum `requestDate`/`exitDate` | tenant | `requestDate` | Orden de la cola. | — |
| PRM-INS-028 | `ins.capital.refundAllowOffset` | Bool | tenant | true | Compensar deuda exigible antes de reembolsar. | — |
| PRM-INS-029 | `ins.capital.closingDate` | Date | tenant | — | Fecha de cierre vigente (gestionada en `capitalClosings`). | 2785 |
| PRM-INS-030 | `ins.mandate.expiryAlertDays` | Int | órgano | 60 | Anticipación de alerta de vencimiento. | — |
| PRM-INS-031 | `ins.capital.billedDateBasis` | Enum `issueDate`/`dueDate` | tenant | `issueDate` | Fecha efectiva del capital facturado. | 240 |
| PRM-INS-032 | `ins.roster.admissionCutoffDays` | Int | asamblea | 0 | Días antes de la asamblea como fecha límite de alta para votar (o fecha fija en la asamblea). | 2428 |
| PRM-INS-033 | `ins.assembly.noticeDays` | Int | tenant | 15 | Anticipación mínima de convocatoria. | — |
| PRM-INS-034 | `ins.assembly.quorum` | Objeto { pct, esperaMin } | tenant | 50 % + 1, 60 min | Quórum y espera para sesionar con presentes. | — |
| PRM-INS-035 | `ins.assembly.ordinaryDeadlineMonths` | Int | tenant | 4 | Plazo desde el cierre del ejercicio. | — |
| PRM-INS-036 | `ins.assembly.postFilingDays` | Int | tenant | 30 | Plazo de presentación post-asamblea. | — |
| PRM-INS-037 | `ins.proxy.policy` | Objeto { habilitado, topePorMandatario } | tenant | { false, 1 } | Poderes admitidos y tope por mandatario. | — |
| PRM-INS-038 | `ins.fees.prorationRule` | Enum `days`/`fullMonth`/`none` | tenant | `days` | Prorrateo de honorarios. | — |
| PRM-INS-039 | `ins.capital.minInitialIntegrationPct` | Decimal | tenant | 5 | Integración mínima al suscribir. | — |
| PRM-INS-040 | `ins.capital.maxIntegrationYears` | Int | tenant | 5 | Plazo máximo de integración. | — |
| PRM-INS-041 | `ins.assembly.delegatesThreshold` | Int | tenant | 5000 | Umbral que activa la alerta de asambleas de distrito. | — |
| PRM-INS-042 | `ins.surplus.legalReservePct` | Decimal | tenant | 5 | Reserva legal. | — |
| PRM-INS-043 | `ins.surplus.welfareFundPct` | Decimal | tenant | 5 | Fondo de acción asistencial y laboral. | — |
| PRM-INS-044 | `ins.surplus.educationFundPct` | Decimal | tenant | 5 | Fondo de educación y capacitación. | — |
| PRM-INS-045 | `ins.surplus.shareInterestCapPct` | Decimal | tenant | 0 | Tope de interés a cuotas sociales (0 = no se paga). | — |
| PRM-INS-046 | `ins.mandate.incompatibilities` | Lista de reglas | órgano | consejero ≠ síndico; consejero ≠ empleado | Incompatibilidades validadas al alta de mandato. | — |
| PRM-INS-047 | `ins.inaes.batchSize` | Int | tenant | 1000 | Registros por lote de exportación INAES. | 3091 |
| PRM-INS-048 | `ins.register.includePreviousCapital` | Bool | tenant | true | Informar capital anterior al período en el libro. | 3027 |
| PRM-INS-049 | `ins.roster.savedFilterSets` | Lista | tenant | — | Conjuntos de filtros guardados del padrón. | 50 |
| PRM-INS-050 | `ins.exit.requestTemplateId` | Ref plantilla | tenant | plantilla base | Plantilla de solicitud de egreso. | 2580 |
| PRM-INS-051 | `ins.voting.electronicEnabled` | Bool | tenant | false | Votación electrónica (PA-INS-05). | — |
| PRM-INS-052 | `ins.minutes.signatureMode` | Enum `handwrittenScan`/`electronic`/`digital` | tenant | `digital` (DEC-078; antes `handwrittenScan`) | Modo de firma de actas (PA-INS-08, resuelta por DEC-078). `digital` usa el perfil SIG-ACTA-INSTITUCIONAL de T11 §18.5; `handwrittenScan` queda como contingencia hasta que el proveedor licenciado esté habilitado (O8/O9). | — |
| PRM-INS-053 | `ins.credential.templateId` | Ref plantilla | tenant | plantilla base | Diseño de credencial. | — (`Credencial_Tipo`) |
| PRM-INS-054 | `ins.roster.onlyMembers` | Bool | tenant | true | Solo membresías habilitadas asisten (excluye adherentes, beneficiarios y clientes). | 2430 |
| PRM-INS-055 | `ins.capital.registrationEnabled` | Bool | tenant | false | Interruptor de la registración de capital desde facturación (O5 si el piloto lo requiere). | — |
| PRM-INS-056 | `ins.capital.invoiceLegendKey` | Clave dict | tenant | `dict:ins.capitalInvoiceLegend` | Leyenda del renglón de cuota social en la factura. | — |
| PRM-INS-057 | `ins.assembly.districtsEnabled` | Bool | tenant | false | Habilita asambleas de distrito y delegados (PA-INS-06). | — |
| PRM-INS-058 | `ins.membership.enabled` | Bool | legalEntity | `true` si `legalEntities.legalForm` es `cooperativa`, `mutual` o `asociacionCivil`; `false` si es `sociedad` u `otra` | La entidad admite membresías (asociados o afiliados) propias (RN-INS-053; DEC-096). | — |

Parámetros relevados **no adoptados como parámetro**: V2 32 (doble numeración, Descartado — RN-INS-003); V2 2314 (etiquetas, reemplazado por diccionario — RN-INS-026); V2 2543 (capital al cerrar caja, Reemplazado — RN-INS-017); V2 2608 (padrón versión anterior, Descartado — RN-INS-033); V2 2616 (fecha de asamblea en título, se toma de la reunión — RN-INS-034); V2 2669 (deuda en domicilio, delegado a M01 — RN-INS-049); V2 3193 (cuenta principal de no activos, delegado a M01).

## 15. Reportes

Todos con fecha de corte explícita (AGR-022), universo declarado y exportación CSV/XLSX/PDF según permiso.

| ID | Reporte | Universo | Fórmula / contenido | Fecha de corte |
|---|---|---|---|---|
| REP-INS-01 | Libro de Registro de Asociados | Membresías con alta ≤ corte | Por asociado: número, nombre, documento, domicilio, ingreso, egreso y causa, cuotas suscriptas e integradas, transferencias, reembolsos. | `periodTo` |
| REP-INS-02 | Altas y bajas del período (INAES) | Eventos `approved`/`exited` en el período | Conteo y detalle por causa. | Período |
| REP-INS-03 | Padrón de asociados | Padrón final de la asamblea | Habilitados por distrito; excluidos con motivo. | `cutoffDate` del padrón |
| REP-INS-04 | Estado de cuenta de capital | Un asociado | Saldos por tipo: pendiente = suscripto − integrado − reembolsado + ajustes; vencido = facturado con vencimiento < corte y no integrado. | Parámetro `asOf` |
| REP-INS-05 | Resumen de capital social | Todas las membresías | Totales suscripto / facturado ("vendido") / integrado / reservado / reembolsado por rubro (equivale a `CAPITAL_RES` SUSCRIPTO/VENDIDO). | `asOf` |
| REP-INS-06 | Conciliación capital vs contabilidad | Rubros con cuenta contable | Saldo M17 − saldo M15 por rubro = diferencia; detalle de movimientos `accountingStatus ≠ posted`. | `asOf` |
| REP-INS-07 | Deuda de capital | Membresías activas | Capital vencido no integrado > umbral PRM-INS-019. | `asOf` |
| REP-INS-08 | Rescates y cola | Rescates no terminales | Por estado; límite anual usado = Σ aprobados del ejercicio / (PRM-INS-026 × integrado del balance). | Ejercicio |
| REP-INS-09 | Distribución de excedentes | Una distribución | Apropiaciones; retorno por asociado = base del asociado / Σ bases × importe a retornar. | Ejercicio |
| REP-INS-10 | Nómina de autoridades | Mandatos activos | Órgano, cargo, titular/suplente, vigencia. | Fecha |
| REP-INS-11 | Vencimientos de mandatos | Mandatos activos | `endDate` dentro de los próximos N días. | Fecha |
| REP-INS-12 | Asistencia a asamblea | Una asamblea | Presentes por distrito; poderes; quórum alcanzado y hora. | Fecha de la asamblea |
| REP-INS-13 | Representados (poderes) | Una asamblea | Mandatario y representados. | Fecha de la asamblea |
| REP-INS-14 | Delegados | Asamblea de distrito | Delegados electos por distrito. | Fecha |
| REP-INS-15 | Resultado de votación | Una votación | Votos por opción; resultado según mayoría. | Cierre de la votación |
| REP-INS-16 | Resoluciones abiertas | Resoluciones `open`/`inProgress` | Por responsable y vencimiento. | Fecha |
| REP-INS-17 | Honorarios liquidados | Liquidaciones del período | Bruto, retención, neto, estado de pago. | Período |
| REP-INS-18 | Asociados por categoría INAES y antigüedad | Membresías activas | Conteos por categoría y tramos de antigüedad. | `asOf` |
| REP-INS-19 | Asociados sin servicios / clientes no asociados | Membresías activas sin contratos; personas con contratos sin membresía | Conteos y listados. | `asOf` |
| REP-INS-20 | Certificados de cuotas sociales emitidos | Certificados | Número, asociado, cuotas, estado. | Fecha |
| REP-INS-21 | Base de capital por entidad jurídica (DEC-095) | Movimientos confirmados de una entidad con `effectiveDate ≤ asOf`, o la base congelada del cierre | Suscripto, integrado, pendiente = suscripto − integrado, reservado, reembolsado en el ejercicio, rescates aprobados no pagados, membresías activas, apertura por rubro, estado de conciliación con M15; indica si es base final (cierre) o provisoria (RF-INS-109). | `asOf` |

Todos los reportes de esta tabla son de una entidad jurídica o se agrupan por ella (filtro `legalEntityId`, oculto con PRM-CFG-039 = `false`); nunca suman capital ni asociados de entidades distintas sin mostrar la apertura (DEC-096).

## 16. Casos de uso

| ID | Nombre | Actor | Flujo principal | Alternativos / excepciones | RF |
|---|---|---|---|---|---|
| CU-27 (BASE) | Preparar asamblea y padrón | Secretaría institucional | Selecciona asamblea → aplica criterios → genera padrón preliminar → revisa excluidos con motivo → aprueba versión → publica convocatoria y documentación. | Cambio de criterio: versión nueva, la anterior se conserva. Persona no asociada: no entra al padrón. | RF-INS-072 a RF-INS-082 |
| CU-INS-15 (antes CU-INS-01; ese ID es de M10, «CU-INS-01 (BASE §73, parte técnica) — Instalación integral») | Solicitar ingreso como asociado (PWA) | Cliente / persona | Abre "Asociarme" → confirma datos → acepta estatuto → ve suscripción propuesta → adjunta documentos → envía. | Persona con aviso de deuda en domicilio: se informa, no bloquea. | RF-INS-001 a RF-INS-005 |
| CU-INS-02 | Aprobar ingresos en reunión de consejo | Secretaría + Consejo | Agrupa solicitudes → tema de consejo → resolución → acta firmada → membresías `active` con número. | Rechazo individual con motivo. | RF-INS-003, RF-INS-071 |
| CU-INS-03 | Registrar egreso por renuncia | Secretaría | Recibe solicitud → valida servicios y capital → resolución → egreso → inicia rescate. | Servicios activos con PRM-INS-008 = false: rechaza y lista servicios. | RF-INS-010, RF-INS-101, RF-INS-102 |
| CU-INS-04 | Registrar fallecimiento de asociado | Sistema / Secretaría | Evento M01 → `deceased` → mandatos finalizados → rescate borrador a derechohabientes. | Derechohabientes no acreditados: rescate queda en `requested`. | RF-INS-012, RN-INS-048 |
| CU-INS-05 | Cobrar cuota social en la factura | Sistema (M04/M05/M07) | Factura con renglón capitalizable → `billed` → pago → `paid` proporcional. | Anulación: contramovimiento. | RF-INS-033 a RF-INS-038 |
| CU-INS-06 | Rescatar capital al egreso | Administración de capital + Consejo + Tesorería | Calcula → aprueba → cola/programa → comprobante → orden de pago → `paid`. | Límite anual agotado: `queued`. | RF-INS-051 |
| CU-INS-07 | Transferir cuotas sociales | Administración de capital | Asistente → aprobación → ejecución con movimientos espejo. | Cesionario ex asociado con PRM-INS-012 = false: rechazo. | RF-INS-049 |
| CU-INS-08 | Distribuir excedentes | Contador + Asamblea | Simula → adjunta a expediente → asamblea aprueba → ejecuta. | Asamblea modifica proyecto: nueva simulación. | RF-INS-060 a RF-INS-066 |
| CU-INS-09 | Realizar asamblea | Secretaría, acreditadores, junta electoral | Acreditación → quórum → temas → votaciones → cierre → acta. | Sin quórum al primer llamado: segundo llamado tras espera. | RF-INS-076 a RF-INS-093 |
| CU-INS-10 | Registrar reunión de consejo y acta | Secretaría + Consejo | Programa → temas → asistencia → resoluciones → acta → firmas. | Reunión reservada: solo usuarios permitidos. | RF-INS-072 a RF-INS-075, RF-INS-087 a RF-INS-089 |
| CU-INS-11 | Liquidar honorarios | Contador | Liquida período → aprueba → orden de pago. | Mandato terminado a mitad de mes: prorrateo. | RF-INS-095 a RF-INS-098 |
| CU-INS-12 | Emitir libro y presentar al INAES | Secretaría | Genera libro / exportación → valida → presenta → registra acuse. | Rechazo: nueva versión. | RF-INS-021 a RF-INS-028 |
| CU-INS-13 | Baja de un servicio de un asociado (AGR-029) | Operador | Da de baja Internet en M01/M02 → M17 recibe evento → la membresía y el capital no cambian → si queda sin servicios, alerta. | — | RF-INS-099 a RF-INS-102 |
| CU-INS-14 | Consultar mi asociación (PWA) | Asociado | Ve estado, número, antigüedad, capital, credencial y convocatorias. | Cliente no asociado: ve "Asociarme". | RF-INS-106 |

## 17. Criterios de aceptación y escenarios

| ID | Escenario | Dado / Cuando / Entonces |
|---|---|---|
| ESC-INS-01 | Número único concurrente | Dadas dos aprobaciones simultáneas, cuando se confirman, entonces reciben números consecutivos distintos y ninguno se reutiliza tras un egreso. |
| ESC-INS-02 | Baja de servicio ≠ egreso | Dado un asociado con electricidad e Internet, cuando da de baja Internet, entonces sigue `active`, su capital no cambia y no se crea rescate (AGR-029). |
| ESC-INS-03 | Integración proporcional | Dada una factura de ARS 20.000 con ARS 1.000 de cuota social, cuando se pagan ARS 8.000, entonces se integran ARS 400; al pagar el saldo, el total integrado es ARS 1.000 exactos. |
| ESC-INS-04 | Anulación de factura | Dada una factura con capital facturado, cuando M05 la anula, entonces se crea un contramovimiento y el movimiento original permanece visible. |
| ESC-INS-05 | Reintento idempotente | Dado que `fac.invoice.issued` se entrega dos veces, cuando se procesa, entonces existe un solo movimiento `billed` (misma `idempotencyKey`). |
| ESC-INS-06 | Cierre de capital | Dado un cierre al 30-06-2026, cuando se intenta un ajuste con fecha 15-06-2026, entonces se rechaza con `ins.capital.closed`. |
| ESC-INS-07 | Límite anual de rescates | Dado un capital integrado de ARS 10.000.000 y límite 5 %, cuando los rescates aprobados suman ARS 500.000, entonces el siguiente queda `queued`. |
| ESC-INS-08 | Padrón versionado | Dado un padrón final, cuando se cambia el umbral de deuda, entonces se crea una versión nueva y la final previa pasa a `superseded`. |
| ESC-INS-09 | Excluido con motivo | Dado un asociado con alta posterior a la fecha límite, cuando se genera el padrón, entonces figura excluido con motivo "alta posterior a la fecha límite". |
| ESC-INS-10 | Convocatoria fuera de plazo | Dada una asamblea a 10 días y PRM-INS-033 = 15, cuando se publica, entonces se bloquea con `ins.meeting.noticeTooShort`. |
| ESC-INS-11 | Acta firmada inmutable | Dada un acta `signed`, cuando se intenta editar, entonces se rechaza y se ofrece crear acta correctiva. |
| ESC-INS-12 | Votación secreta | Dada una votación secreta, cuando se consulta el detalle, entonces no existen votos nominales. |
| ESC-INS-13 | Permiso negativo: reunión reservada | Dado un usuario de secretaría sin permiso en una reunión reservada, cuando la consulta, entonces recibe 403 `ins.meeting.reserved` y no aparece en listados. |
| ESC-INS-14 | Permiso negativo: separación de tareas | Dado un usuario que registró un rescate, cuando intenta aprobarlo, entonces se rechaza (AGR-008). |
| ESC-INS-15 | Permiso negativo: operador | Dado un operador de atención, cuando abre la ficha, entonces ve el resumen sin movimientos de capital ni actas. |
| ESC-INS-16 | Aislamiento de tenant | Dado un usuario del tenant A, cuando solicita `/api/admin/ins/memberships/:id` de un registro de B, entonces recibe 404 sin revelar existencia. |
| ESC-INS-17 | Conciliación | Dado un movimiento con `accountingStatus = error`, cuando se ejecuta JOB-INS-12, entonces aparece en la conciliación con la diferencia y la acción "reintentar". |
| ESC-INS-18 | Lote reanudable | Dado JOB-INS-01 interrumpido en el renglón 4.000 de 10.000, cuando se reanuda, entonces procesa desde 4.001 sin duplicar. |
| ESC-INS-19 | Lock por universo | Dada una registración de capital en curso para la ruta 3, cuando M05 emite un lote de la ruta 5, entonces no se bloquea; un lote de la ruta 3 sí. |
| ESC-INS-20 | Acreditación offline | Dada la PWA sin conexión, cuando se acreditan 50 asociados, entonces se sincronizan al reconectar sin duplicados. |
| ESC-INS-21 | Mandato superpuesto | Dado un presidente vigente, cuando se carga otro presidente titular con vigencia superpuesta, entonces se rechaza con `ins.mandate.overlap`. |
| ESC-INS-23 | Socia de la cooperativa y afiliada de la mutual (DEC-096) | Dada una persona con membresía `active` N.º 1001 en COOP, cuando solicita ingreso a MUTUAL, entonces se crea una segunda membresía con su propio número (puede ser también 1001), su padrón y su capital; una tercera solicitud vigente en COOP se rechaza con `ins.membership.duplicated`. |
| ESC-INS-24 | Padrón y mandatos por entidad (DEC-096) | Dada una asamblea de MUTUAL, cuando se genera el padrón, entonces solo incluye membresías de MUTUAL; designar en el consejo de MUTUAL a un asociado de COOP sin membresía en MUTUAL se rechaza con `ins.membership.legalEntityMismatch`. |
| ESC-INS-25 | Base de capital congelada (DEC-095) | Dado un cierre de capital de COOP al 30-06-2026 con integrado ARS 10.000.000, cuando después se registra un ajuste con fecha 01-07-2026 y M06 consulta `ins.capitalBase.get({ COOP, 30-06-2026 })`, entonces recibe ARS 10.000.000 con `final = true`; si el cierre se reabre, se publica `ins.capitalBase.reopened` y la copia anterior queda en `capitalBaseHistory`. |
| ESC-INS-22 | Escenarios transversales ESC-01 a ESC-05 (BASE §102.6) | Reintentos y duplicados de pago (ESC-01, ESC-04) no generan integración de capital duplicada; los demás escenarios aplican en lo que afecten eventos consumidos por M17. |

## 18. Precarga ficticia

Datos inventados; ningún dato real de la DEMO.

| Elemento | Datos |
|---|---|
| Asociados | 5 membresías ficticias: N.º 1001 "Asociada Demo Uno" (activa, alta 15-03-2010), N.º 1002 "Asociado Demo Dos" (activo, alta 02-08-2018), N.º 1003 "Cooperativa Escolar Demo" (persona jurídica activa con representante), N.º 1004 "Asociado Demo Cuatro" (egresado por renuncia 10-01-2026, rescate en cola), solicitante "Persona Demo Cinco" (`pendingApproval`). Más 1 cliente no asociado. |
| Distritos | DIST-01 "Centro", DIST-02 "Rural". |
| Capital | Rubro CAP-01 "Cuotas sociales servicio eléctrico" (cuenta contable ficticia 3.1.01); valor nominal ARS 1.000 desde 01-01-2026; regla de suscripción en la afiliación: 10 cuotas, integración en 10 cuotas mensuales en factura. |
| Movimientos | Asociada 1001: suscripto ARS 10.000, integrado ARS 10.000. Asociado 1002: suscripto ARS 10.000, facturado ARS 6.000, integrado ARS 5.000. Asociado 1004: integrado ARS 8.000, rescate ARS 8.000 `queued`. |
| Órganos | Consejo de administración (presidente, secretario, tesorero, 2 vocales titulares, 2 suplentes); Sindicatura (síndico titular y suplente) con mandatos ficticios vigentes hasta 30-11-2027. |
| Reuniones | Reunión de consejo RC-DEMO-001 (cerrada, acta N.º 1 firmada, tema "Aprobación de ingresos"); ASM-DEMO-001 asamblea ordinaria convocada con padrón preliminar con fecha de corte 30-11-2026 (BASE §27). |
| Excedentes | Distribución ejercicio 2025-2026 en `simulated`: excedente ARS 2.000.000; 5 % reserva legal, 5 % asistencial, 5 % educación; retorno por facturación. |
| Honorarios | Definición ficticia ARS 150.000 mensuales para presidente por resolución de asamblea demo. |
| Categorías INAES | Catálogo base de plataforma (códigos ficticios de ejemplo hasta confirmar PA-INS-09). |

## 19. Migración

| Origen ProCoop | Destino | Transformación | Conciliación |
|---|---|---|---|
| `SOCIOS` | `associateMemberships` (CTR-DAT-09; antes `memberships`) + `membershipEvents` | `ACTIVO`/`BAJA`/`CAUSA`/`ACTIVOBAJA` → `status` y eventos sintéticos `approved`/`exited` con fechas; `NUM_SOC` → `memberNumber` (de activos y de `ACTIVOBAJA`); no activos sin `ACTA` → clientes no asociados (sin membresía) o `pendingApproval` según decisión de la cooperativa; `ACTA` → texto en `admissionMinuteId` si el acta migra, si no en `payload`. Personas → M01. `legalEntityId`: `SOCIOS` no tiene empresa, por lo que toda membresía migra a la entidad por defecto salvo que la cooperativa indique, por lista o por regla (por ejemplo, servicios de la mutual), que corresponde a otra entidad (DEC-096). | Cantidad de asociados activos y egresados por año y por entidad = conteos ProCoop; ningún número duplicado dentro de una entidad. |
| `CAPITAL` | `capitalMovements` | `FACTURADO`/`PAGADO`/`COMPVEN` → tipos `billed`/`paid`/`committed`; opción de migrar solo **saldo de apertura** por asociado y rubro (`type = migration`, `source.kind = migration`, carga por RF-INS-055) más detalle histórico como solo lectura. T07 §19.1 usa este mismo destino (HUECO-CAP-03). | Σ por asociado y tipo = Σ ProCoop; Σ por rubro = saldo contable M15 a la fecha de corte. |
| `CAPITAL_RES` | `capitalReserves` y validación del resumen | Reservas activas → `capitalReserves`; columnas `SUSCRIPTO`/`VENDIDO` se usan para validar REP-INS-05 y la proyección `capitalBalances` (§7.33) recalculada tras la carga (CTR-INS-03, HUECO-CAP-03). No se crea saldo a mano: el saldo sale de `capitalMovements`. | Diferencias listadas por asociado y rubro. |
| `RUBCAPI` | `capitalItems` | `COD_CTA` → `entityAccountAssignments` de M15 (`entityType: capitalRubric`, CTR-DAT-57; antes "cuenta de M15 por mapeo del plan de cuentas" guardada en el rubro); `COD_RUB` → rubros de M02. | Cada rubro de producto en un único `capitalItem`. |
| `TRANSFER` (`TIPO_TRA = 3`) | `capitalTransfers` (`executed`) | Histórico. | Conteo. |
| `CONSEJO` | `governanceBodies` + `bodyMandates` | `TIP_CSJ` → órgano; `CAR_CSJ` → cargo; `DOC_CSJ`/`NOM_CSJ` → búsqueda de persona en M01 (si no existe, se crea persona mínima marcada para revisión). Vigencias a completar por la cooperativa. | Nómina vigente validada por secretaría. |
| `REUNIONES`, `REUNIONES_TEMAS`, `REUNIONES_ASIST`, `REUNIONES_PERMISOS` | `meetings`, `meetingAgendaItems`, `meetingParticipants`, `meetingPermissions` | Estados → enum; `COD_REC` → `linkedRefs` (caso M09) si el caso migró. | Conteos por año. |
| `ACTAS` | `minutes` | `CONTENIDO_PDF` → almacenamiento de objetos con hash; `ESTADO_FIRMA` → `signatureStatus`. | Hash por acta; conteo por libro. |
| `CAT_INAES` | `inaesCategories` | Directo. | — |
| Filtros guardados de padrón (V2 50) | `rosters.criteria` / PRM-INS-049 | Se recrean como conjuntos con nombre. | Revisión manual. |
| Parámetros TITULARES (§14) | Parámetros M17 | Mapeo según columna "Origen V2". | Checklist firmado. |

Herramienta: `ExcelImportWizard` / pipeline de T07 con simulación, rechazos con motivo y reversión del lote.

## 20. Contraposiciones

| ID | Fuentes | Conflicto | Resolución | Regla de prevalencia |
|---|---|---|---|---|
| CTR-INS-01 | DFA (M01 Titulares/Socios) vs DFA M24 | Ambos módulos reclaman al "asociado". | M01 es dueño de la persona y la cuenta; M17 de la relación institucional (`associateMemberships`, CTR-DAT-09; antes `memberships`). | DEC > DFA (separación de dominios de la guía) |
| CTR-INS-02 | DFA M24 vs CAT §18 | DFA ubica `SU_ANTIGUE` en institucional; CAT la describe como tabla de sueldos (antigüedad de empleados). | Se asigna a M16; la antigüedad del asociado se calcula en M17. | CAT > DFA en estructura de datos |
| CTR-INS-03 | CAT `CAPITAL_RES` vs RN-06 §9 | CAT muestra columnas de resumen (suscripto/vendido); RN-06 la usa como reserva/recupero. | Dos conceptos: `capitalReserves` y REP-INS-05. | RN = CAT; se adoptan ambos usos |
| CTR-INS-04 | BASE §27 ("no confirmado en ProCoop") vs CAT §24 e INV | BASE no confirma asambleas en ProCoop; CAT/INV muestran reuniones, actas y padrón. | Se especifica completo por DEC-007 tomando la evidencia como referencia. | DEC > BASE |
| CTR-INS-05 | MER-010 / BASE §52 vs BASE §97.7 | Separación estricta de conceptos vs cobro de capital dentro de la factura del servicio. | Renglón identificado y auxiliar separado; modo configurable (PRM-INS-017, DEC-061; antes PA-INS-02). | BASE más reciente (§97.7) |
| CTR-INS-06 | RN-06 §2 vs BASE §3 | ProCoop trata al cliente como "socio no activo"; BASE distingue cliente de asociado. | Cliente sin membresía; sin número de asociado. | BASE > RN |
| CTR-INS-07 | RN-02/RN-04/RN-05 vs convenciones | ProCoop borra físicamente `CAPITAL` al anular. | Contramovimientos; nunca borrar. | DEC/convenciones > RN |
| CTR-INS-08 | RN-06 §5 (`ModificacionEspecial_Socio`) vs AGR-003/AGR-010 | Edición directa de números y bajas. | Renumeración controlada y reingreso como evento. | AGR > RN |
| CTR-INS-09 | Glosario ProCoop vs Ley 20.337 | "Capital" designa también prepagos y aportes; "acciones" vs "cuotas sociales". | Término "cuota social" en diccionario; "capital" solo para capital social. | BASE §65 (diccionario) |
| CTR-INS-10 | RN-06 §9 (hilo de fondo, V2 2855) y RN-02 (bloqueo de masiva) vs T08 | Proceso en hilo de UI y bloqueo global. | Evento + JOB-INS-01/02 + lock por universo. | Convenciones > RN |
| CTR-INS-11 | AGR-029 vs RN-06 §5 | ProCoop puede impedir la baja del titular por servicios o capital; AGR-029 separa baja de servicio y egreso. | Validaciones configurables sobre el egreso; la baja de servicio nunca egresa. | AGR > RN |
| CTR-INS-12 | CAT `CONSEJO` vs RN-INS-042 | Integrantes por texto libre (documento, nombre). | `personId` obligatorio y vigencias. | Convenciones > CAT |
| CTR-INS-13 | Normativa INAES citada en materiales previos | Referencias a resoluciones INAES sin confirmar vigencia. | No se citan números de resolución; los plazos quedan como parámetros [VERIFICAR]. | BASE (no certifica validez legal) |
| CTR-INS-14 | RF-INS-001, RF-INS-002 y §7.1 de este anexo vs DEC-064 y DEC-096 | La membresía era única por persona y tenant (`{tenantId, personId}`) y el número único en el tenant, lo que impedía ser socio de la cooperativa y afiliado de la mutual del mismo tenant; `capitalMovements` ya llevaba `legalEntityId` pero la membresía no. | `legalEntityId` obligatorio en `associateMemberships`, unicidad `{tenantId, legalEntityId, personId}` y `{tenantId, legalEntityId, memberNumber}`; reglas de suscripción, valor nominal, cierres, órganos, reuniones, padrones, libro, informes INAES, distribuciones y saldos por entidad (RN-INS-053). 10-11-2026: los libros sociales y los certificados son de cada entidad, con secuencias `ins.registerFolio:<legalEntityCode>`, `ins.minuteBook:<bookType>:<legalEntityCode>` e `ins.shareCertificate:<legalEntityCode>` (§7.3; RF-INS-022, 026, 087, 092; RN-INS-002), `legalEntityId` en `shareCertificates`, `minutes`, `resolutions`, `capitalTransfers`, `capitalRefunds`, `bodyMandates` e `institutionalFeeSettlements`, y `legalEntityId` en el payload de cada EVT-INS-01 a 22 (§12.1). Queda [VERIFICAR] con el asesor legal si algún libro puede compartirse (PA-INS-09). | DEC > anexo |
| CTR-INS-15 | DEC-095 (M17 provee la base de capital) vs alcance anterior de M17 | M17 no exponía una base de capital por fecha consumible por otro módulo; `capitalClosings` solo bloqueaba movimientos. | Servicio `ins.capitalBase.get`, API-INS-071, base congelada en `capitalClosings.capitalBase` y EVT-INS-22; M17 no calcula la contribución ni define la base imponible (RF-INS-109, RN-INS-054). | DEC > anexo |

## 21. Preguntas abiertas

### PA-INS-01 — Momento de la suscripción de capital

**Pregunta:** ¿Cuándo se registra la suscripción de cuotas sociales?
**Contexto:** ProCoop admite suscripción en la afiliación (V2 2636) o al facturar (V2 73).
**Opciones:**
- A) **(Recomendada)** En la afiliación (aprobación del ingreso), con plan de integración en cuotas: refleja el compromiso legal desde el ingreso.
- B) Al facturar cada cuota: más simple, pero el libro no muestra suscripción completa hasta terminar de facturar.
- C) Al activar el primer servicio: útil si el ingreso se tramita junto con el servicio, pero desacopla de la aprobación.
**Impacto si no se responde:** se usa A; el libro de asociados podría diferir del criterio histórico.
**Bloquea:** RF-INS-034, JOB-INS-01, migración de `CAPITAL`.

### PA-INS-02 — Cobro de cuotas sociales en la factura del servicio

**Pregunta:** ¿La cuota social se cobra dentro de la factura del servicio o en un documento propio?
**Contexto:** BASE §97.7 la admite en la factura; MER-010/§52 exige separación de conceptos.
**Opciones:**
- A) **(Recomendada)** En la factura del servicio como renglón identificado, con auxiliar separado y leyenda: aprovecha la cobranza existente.
- B) Documento propio de capital (no fiscal o fiscal según asesoría): máxima separación, más costo de cobranza.
- C) Sin cobro periódico (integración al ingreso).
**Impacto si no se responde:** se usa A; M04/M05 deben soportar renglón capitalizable.
**Bloquea:** PRM-INS-017, M04/M05 en O5.
**Estado:** Respondida (DEC-061): opción A, renglón identificado en la factura del servicio con auxiliar separado y leyenda.

### PA-INS-03 — Ola del capital social

**Pregunta:** ¿El piloto necesita cobrar cuotas sociales desde la primera facturación?
**Contexto:** Si la cooperativa piloto factura capital, M05 en O5 debe registrar el movimiento; si no, todo el capital va a O10.
**Opciones:**
- A) **(Recomendada)** O5 mínimo (rubros, regla, `billed`/`paid`, estado de cuenta) y O10 el resto: evita reprocesar facturas.
- B) Todo en O10 con migración de saldos de apertura: menos alcance temprano, requiere reconstrucción posterior de movimientos.
**Impacto si no se responde:** se planifica A con PRM-INS-055 apagado hasta confirmar.
**Bloquea:** RF-INS-035, plan de olas.
**Estado:** Respondida (DEC-019): opción A, mínimo en O5 (rubros, regla, facturado/pagado, estado de cuenta) y el resto en O10.

### PA-INS-04 — Política de reembolso de capital

**Pregunta:** ¿Qué límite anual, orden, compensaciones e intereses establece el estatuto?
**Contexto:** ProCoop solo emite un comprobante de rescate; la ley permite limitar el reembolso anual.
**Opciones:**
- A) **(Recomendada)** Límite 5 % del capital integrado del último balance, orden por fecha de solicitud, compensación de deuda exigible, sin interés salvo estatuto.
- B) Sin límite: reembolso inmediato aprobado por consejo.
- C) Configurable por estatuto con valores cargados por la cooperativa al implementar.
**Impacto si no se responde:** se aplica A, que podría contradecir el estatuto.
**Bloquea:** RF-INS-051, JOB-INS-11.

### PA-INS-05 — Votación electrónica y asamblea a distancia

**Pregunta:** ¿Se habilita votación electrónica o solo registro de votaciones presenciales?
**Contexto:** BASE §27 pide votación formal fuera de encuestas; el estatuto y el INAES condicionan la modalidad a distancia.
**Opciones:**
- A) **(Recomendada)** Registro de votaciones presenciales/híbridas (recuento por escrutadores), con votación electrónica como extensión habilitable por tenant cuando el estatuto la admita.
- B) Votación electrónica desde el inicio con identidad fuerte.
- C) Solo registro del resultado en el acta.
**Impacto si no se responde:** se aplica A.
**Bloquea:** PRM-INS-051, RF-INS-086.

### PA-INS-06 — Asambleas de distrito y delegados

**Pregunta:** ¿La cooperativa realiza asambleas de distrito con elección de delegados?
**Contexto:** ProCoop tiene informe de delegados; la ley lo exige superado cierto número de asociados.
**Opciones:**
- A) **(Recomendada)** Modelo de distritos disponible y desactivado por defecto (PRM-INS-057), con alerta por umbral.
- B) Siempre asamblea directa.
- C) Siempre por distritos.
**Impacto si no se responde:** se aplica A.
**Bloquea:** RF-INS-084, RN-INS-038, PAN-INS-29.

### PA-INS-07 — Criterios de elegibilidad del padrón

**Pregunta:** ¿Qué deudas inhabilitan para votar: capital vencido, servicios, ambas o ninguna?
**Contexto:** ProCoop filtra por deuda de capital (V2 2606/2429) y por facturas impagas; la condición depende del estatuto.
**Opciones:**
- A) **(Recomendada)** Solo deuda de capital vencida por encima del umbral, más fecha límite de alta; deuda de servicios solo si el estatuto lo prevé expresamente.
- B) Capital y servicios.
- C) Sin restricción por deuda.
**Impacto si no se responde:** se aplica A con leyenda de padrón preliminar.
**Bloquea:** RF-INS-047, RF-INS-079, RN-INS-021.

### PA-INS-08 — Firma de actas y libros

**Pregunta:** ¿Cómo se firman las actas y se llevan los libros?
**Contexto:** ProCoop guarda PDF y estado de firma; los libros pueden requerir rúbrica o medios digitales autorizados.
**Opciones:**
- A) **(Recomendada)** Firma ológrafa escaneada con hash y registro de firmantes; adaptador de firma electrónica/digital para cuando el organismo lo admita.
- B) Firma digital obligatoria desde el inicio.
- C) Solo PDF sin control de firmas.
**Impacto si no se responde:** se aplica A.
**Bloquea:** PRM-INS-052, RF-INS-087, RF-INS-088, RF-INS-092.
**Estado:** Resuelta por DEC-078: firma digital con proveedor licenciado mediante el perfil SIG-ACTA-INSTITUCIONAL de T11 §18.5 (O8/O9); la opción A queda como contingencia (`handwrittenScan`) mientras no haya proveedor.

### PA-INS-09 — Formato del libro digital y presentaciones INAES

**Pregunta:** ¿Qué formato y canal exige el INAES y qué categorías usa la cooperativa? Además (10-11-2026, DEC-096; para el asesor legal): con varias entidades jurídicas en el tenant, ¿la norma permite que alguno de los libros sociales (actas de consejo, asamblea, sindicatura, asistencia, Registro de Asociados) se comparta entre entidades? El anexo asume que no: cada entidad lleva sus libros y numera actas, folios y certificados por separado (§7.3) [VERIFICAR].
**Contexto:** ProCoop exporta altas y bajas por lotes; no hay especificación de formato en las fuentes.
**Opciones:**
- A) **(Recomendada)** Adaptador de exportación versionado; primera versión CSV/XLSX según plantilla que provea la cooperativa; categorías desde catálogo de plataforma editable.
- B) Solo PDF del libro.
**Impacto si no se responde:** se entrega A con plantilla genérica.
**Bloquea:** RF-INS-021 a RF-INS-028, RF-INS-092.

### PA-INS-10 — Canal de pago de honorarios

**Pregunta:** ¿Los honorarios se pagan por orden de pago de tesorería o por un circuito de liquidación tipo nómina?
**Contexto:** BASE §104.3: no son sueldo.
**Opciones:**
- A) **(Recomendada)** Orden de pago en M14 con retención de M06 y comprobante del perceptor cuando corresponda.
- B) Liquidación en M16 con concepto no remunerativo: mezcla dominios.
**Impacto si no se responde:** se aplica A.
**Bloquea:** RF-INS-096.

### PA-INS-11 — Forma del retorno de excedentes

**Pregunta:** ¿Cómo se entrega el retorno: capitalización, crédito en cuenta, pago o mixto?
**Contexto:** La asamblea decide; afecta M07 y M14.
**Opciones:**
- A) **(Recomendada)** Capitalización por defecto con opción de crédito en cuenta, definida en cada distribución.
- B) Pago en efectivo/transferencia.
- C) Crédito en la próxima factura.
**Impacto si no se responde:** se aplica A.
**Bloquea:** RF-INS-064, JOB-INS-07.

### PA-INS-12 — Nombre del campo que apunta al padrón de asociados (PA 9 del pendiente de cierre)

**Pregunta:** ¿Cómo se llama el campo que referencia a `associateMemberships` en las colecciones de M17 y en los eventos `ins.membership.*`?
**Contexto:** el anexo usaba `membershipId`, que coincide con la referencia a `memberships` (relación usuario–tenant) de T02 y produce ambigüedad en T05 y en los consumidores de eventos.
**Opciones:**
- A) **(Recomendada)** `associateMembershipId`, alineado con el nombre de la colección `associateMemberships`.
- B) Mantener `membershipId` y aclarar el destino en cada referencia.
**Impacto si no se responde:** se aplica A.
**Bloquea:** §7, EVT-INS-01 a EVT-INS-07, JOB-INS-07; T05 §7.7.
**Estado:** Asumida la recomendada (DEC-072). Se renombra en todo el anexo con la nota "antes `membershipId`"; T05 y los consumidores de `ins.membership.*` (M01, M04, M05, M18, M19, T09, T11) adoptan el nombre nuevo.

### PA-INS-13 — Residuales del 05-11-2026 (estados, referencias, nombres de campo y tipos de evento)

**Pregunta:** ¿Cómo se cierran los residuales que detectaron los entregables regenerados (estados, referencias sin destino, nombres de T05 y tipos de evento fuera de convención)?
**Contexto:** el índice de secuencias y estados, el modelo entidad-relación y el catálogo de eventos marcaron en M17 máquinas sin estado inicial, `associateMemberships` sin transiciones (el §8.1 no nombraba la colección), referencias sin destino, nombres que difieren de T05 §7.2 y ocho tipos de evento de cuatro segmentos.
**Opciones:**
- A) **(Recomendada)** Explicitar el estado inicial de cada máquina; titular el §8.1 con `associateMemberships.status`; declarar destinos (`productGroupIds` → `accountRubrics` de M15, como `billableConcepts.accountingRubricId` de M02; `creditRef` → `creditBalances` de M07; `withholdingRef` → `withholdingsApplied` de M06; `savedFilterSetId` → `dataTableViews` de T03; `templateId` → `documentTemplates` de T11; `documentRef`/`receiptRef` no son referencias); adoptar los nombres de T05 (`fromAssociateMembershipId`, `toAssociateMembershipId`, `grantorAssociateMembershipId`, `proxyAssociateMembershipId`, `reentryOfAssociateMembershipId`, `storedFileId`/`storedFileIds` en lugar de `pdfObjectKey`/`files[].objectKey`, `legalEntityId` en `capitalMovements`); renombrar los eventos a `ins.capitalMovement.*`, `ins.capitalTransfer.executed`, `ins.capitalRefund.*`, `ins.surplusDistribution.*` e `ins.inaesReport.submitted`, con el nombre anterior como alias.
- B) Mantener los nombres actuales y documentar las diferencias en T05 y T11.
**Impacto si no se responde:** se aplica A.
**Bloquea:** §7, §8, §12.1; consumidores de EVT-INS-08 a 13 (M01, M05, M07, M14, M15, M19, T09) y de EVT-INS-21 (T11).
**Estado:** Asumida la recomendada (DEC-072). `fromStatus`/`toStatus` de `membershipEvents` toman los valores de `associateMemberships.status`. PRM-INS-006 es un parámetro que consulta M02, no un servicio interno. T05 debe reflejar `reentryOfAssociateMembershipId`, `storedFileId` en `shareCertificates`, `minutes` y `associateRegisterEditions`, y los destinos nuevos; T11 debe registrar los alias de evento en §12.4.
**Sincronización (5-11-2026), Asumida (DEC-072):** cada alias de evento resuelve a un solo canónico (T11 §12.4, PA-WFL-23): M17 se suscribe directamente a `fac.debitNote.issued` (EVT-FAC-11) y la nota de alias de §12 se corrige con "antes".

## 22. Trazabilidad

### 22.1 BASE y acuerdos

| Fuente | Cobertura |
|---|---|
| BASE §3 (asociado vs cliente, ficha, multitenant) | RF-INS-009, RF-INS-015, RF-INS-105; CTR-INS-06 |
| BASE §25 (portal) | RF-INS-106, PAN-INS-30 a PAN-INS-32 |
| BASE §27 + CU-27 + precarga ASM-DEMO-001 | RF-INS-072 a RF-INS-094; CU-27; §18; CTR-INS-04 |
| BASE §33 (entidad Asociado) | §7.1 |
| BASE §52 / MER-010 | CTR-INS-05; PA-INS-02 |
| BASE §65 (diccionario) | RF-INS-107; §3 |
| BASE §97.1 (datos sensibles) | RF-INS-103 |
| BASE §97.7 (capital social) | RF-INS-029 a RF-INS-059; PA-INS-01 a PA-INS-04 |
| BASE §98 (pendiente "tratamiento de capital social") | PA-INS-01, PA-INS-02, PA-INS-03 |
| BASE §100 (matriz: capital, Libro de asociados) / MER-011 | RF-INS-021, RF-INS-029 y siguientes |
| MER-014 (informes a organismos) | RF-INS-024 a RF-INS-028 |
| BASE §101 (pendientes) | §21 |
| BASE §102 (AGR-029 consolidado) | §5.8, RN-INS-043, CU-INS-13 |
| BASE §102.6 (ESC-01 a ESC-05) | ESC-INS-22 |
| BASE §102.8 (Secretaría institucional) | §4 |
| BASE §104.3 (honorarios) | RF-INS-095 a RF-INS-098; RN-INS-040; PA-INS-10 |
| BASE §105 / §106 (solución y olas) | Encabezado |
| AGR-003, AGR-008, AGR-010, AGR-022, AGR-034 | §8, §4, RF-INS-104, §15, §4 |
| AGR-007 (representaciones, fallecimiento) | RF-INS-083, RN-INS-048 |
| AGR-029 | §5.8, ESC-INS-02 |
| AGR-033 (privacidad) | RF-INS-103 |
| DEC-007 (todo en alcance) | CTR-INS-04 |
| DEC-095 (10-11-2026; obligaciones propias del tenant, M17 provee la base de capital; aporte A3 de `NucleoTransversal-contraste.md`) | RF-INS-109, RF-INS-053, RN-INS-054, §7.12 `capitalBase`, API-INS-071, EVT-INS-22, REP-INS-21, ESC-INS-25, CTR-INS-15 |
| DEC-096 (10-11-2026; varias entidades jurídicas por tenant, completa DEC-064; aporte A4 y sección 6 punto 4 de `NucleoTransversal-contraste.md`; `_trabajo/contraste-01-04.md` filas 2.6 y 3.2) | RF-INS-001, 002, 005, 009, 015, 021, 022, 024, 026, 033, 036, 049, 053, 060, 067, 072, 078, 087, 092; RN-INS-002, RN-INS-053; §3 (glosario); §7.1, §7.3 (claves por entidad), §7.6, §7.7, §7.8, §7.10, §7.11, §7.12, §7.13, §7.14, §7.16, §7.17, §7.18, §7.22, §7.23, §7.24, §7.28, §7.30, §7.31, §7.33; §11 (filtro y errores); §12.1 (`legalEntityId` en cada EVT-INS-01 a 22); PRM-INS-003; PA-INS-09; §14 (ámbito `legalEntity`, PRM-INS-058); §15; §19 `SOCIOS`; ESC-INS-23, ESC-INS-24; CTR-INS-14 |
| DFA M24 | Todo el anexo; CTR-INS-01, CTR-INS-02 |

### 22.2 Reglas de negocio ProCoop

| Fuente | Cobertura |
|---|---|
| RN-06 §2 (jerarquía, `NUM_SOC`, `ACTIVO`, `REP_ASAMBLEA`) | RF-INS-001, RF-INS-002, RN-INS-002, RN-INS-003 |
| RN-06 §3.1 (deuda en domicilio) | RN-INS-049 |
| RN-06 §5 (bajas, `ACTIVOBAJA`, `ModificacionEspecial_Socio`) | RF-INS-010, RF-INS-011, RF-INS-016, RN-INS-007 a RN-INS-011, RN-INS-050; CTR-INS-08 |
| RN-06 §7 (transferencias, `ConservarCapital`) | RF-INS-049, RN-INS-027 |
| RN-06 §9 (capital: tipos, rubros, fuentes, registración, revisión, deuda, reserva, rescate, estado de cuenta) | RF-INS-029 a RF-INS-059; RN-INS-012 a RN-INS-026 |
| RN-06 §10 (`SetFechaFallecimiento`) | RN-INS-048 |
| RN-02 (capitalización masiva, bloqueo, anulación, `RegistrarCambios`, V2 2736, 2855) | RN-INS-013, RN-INS-016, RN-INS-018 a RN-INS-020; CTR-INS-07, CTR-INS-10 |
| RN-04 (capital en financiación y su anulación) | RF-INS-036, RN-INS-019 (convenios de M08) |
| RN-05 (capital en caja, V2 2543, anulación) | RN-INS-017, RN-INS-019 |
| RN-08 §5 (`Exist_Rubro_Rubcapi`) y §6.4 (V2 73/2636/2916) | RN-INS-012, RN-INS-014 |

### 22.3 Tablas CAT

| Tabla | Destino |
|---|---|
| `SOCIOS` | `associateMemberships` (§7.1; CTR-DAT-09) |
| `CAPITAL` | `capitalMovements` (§7.8) |
| `CAPITAL_RES` | `capitalReserves` + REP-INS-05 (CTR-INS-03) |
| `RUBCAPI` | `capitalItems` |
| `TRANSFER` (tipo 3) | `capitalTransfers` (tabla compartida con M01) |
| `CONSEJO` | `governanceBodies`, `bodyMandates` |
| `REUNIONES` | `meetings` |
| `REUNIONES_TEMAS` | `meetingAgendaItems` |
| `REUNIONES_ASIST` | `meetingParticipants` |
| `REUNIONES_PERMISOS` | `meetingPermissions` |
| `ACTAS` | `minutes` |
| `CAT_INAES` | `inaesCategories` |
| CAT §30 (códigos INAES de `DEPTO`, `LOCALIDA`, `PROVINC`, `DOCUMENT`) | Usados por JOB-INS-05 desde catálogos geográficos de T04/M01 |
| `SU_ANTIGUE` | No asignada: M16 (CTR-INS-02) |

### 22.4 Parámetros V2 (RN-09 TITULARES)

| V2 | Destino | V2 | Destino |
|---|---|---|---|
| 32 | Descartado (RN-INS-003) | 2552 | PRM-INS-012 |
| 50 | PRM-INS-049 | 2571 | PRM-INS-013 |
| 73 | PRM-INS-015 | 2575 | PRM-INS-024 |
| 240 | PRM-INS-031 | 2576 | PRM-INS-025 |
| 337 | PRM-INS-007 | 2580 | PRM-INS-050 |
| 340 | PRM-INS-008 | 2591 | PRM-INS-005 |
| 734 | PRM-INS-006 | 2606 | PRM-INS-019 |
| 741 | PRM-INS-009 | 2608 | Descartado (RN-INS-033) |
| 753 | PRM-INS-021 | 2616 | RN-INS-034 (sin parámetro) |
| 754 | PRM-INS-022 | 2633 | PRM-INS-011 |
| 2314 | Diccionario (RN-INS-026) | 2636 | PRM-INS-015 |
| 2324 | PRM-INS-013 | 2660 | PRM-INS-002 |
| 2428 | PRM-INS-032 | 2669 | M01 (RN-INS-049) |
| 2429 | PRM-INS-020 | 2673 | PRM-INS-010 |
| 2430 | PRM-INS-054 | 2716 | PRM-INS-023 |
| 2543 | Reemplazado (RN-INS-017) | 2736 | PRM-INS-014 |
| 2785 | PRM-INS-029 | 2792 | PRM-INS-025 |
| 2855 | PRM-INS-018 | 2916 | PRM-INS-016 |
| 3027 | PRM-INS-048 | 3091 | PRM-INS-047 |
| 3193 | M01 | — | — |

### 22.5 Inventario de pantallas y clases ProCoop

| Elemento INV | Destino |
|---|---|
| `frmTitulares` (solicitudes, movimientos de capital), `detalleAsociados`, `abm_Socios` | PAN-INS-01 a PAN-INS-04, PAN-INS-08 |
| `frmImpresiones` (solicitud alta/baja) | PAN-INS-03, PAN-INS-04 |
| `abm_Capital`, `abm_RubrosCapital`, `nCapital`, `tipoCapital` | PAN-INS-06 |
| `frmCapitalManual`, `frmMigracionCapital` | PAN-INS-07, PAN-INS-13 |
| `frmSelectFechaCapital` | PAN-INS-05 |
| `frmRecuperoCapital`, `Capital_ReservaSocio` | PAN-INS-09 |
| `frmTranferenciaCapital` | PAN-INS-10 |
| `frmDistribucionCapital`, `Distribucion`, `DetalleDistribucion`, `FiltrosDistribucion`, `ResultadoDistribucion` | PAN-INS-14 |
| `abm_Consejo`, `ConsejoResult` | PAN-INS-15 |
| `Reunion*Request/Result`, `EstadoReunion`, `ReunionReclamoInfo`, `ReunionMesaEntradaResult`, `ReclamoConsejoResult` | PAN-INS-16, PAN-INS-17 |
| `ActaReporte`, `ActaResult`, `ActaTemaReporte`, `ActaInternaReporte`, `ActaMesaEntradaResult` | PAN-INS-23 |
| `ResolucionReunion`, `ResolucionTemaActa` | PAN-INS-24 |
| `frmPadronTitulares`, `_Columnas`, `_Filtros`, `Filtros_Padron`, `Fecha_Padron`, `Filtro_Padron`, `Modo_Padron`, `Padron_Titular`, `clsPadronTitular` | PAN-INS-19, RF-INS-079, RF-INS-080 |
| `frmCredencialAsociado`, `frmPadronTitulares_Credenciales`, `Credencial_Tipo` | PAN-INS-27, PAN-INS-30 |
| `frmTitular_Fallecimiento` | CU-INS-04 |
| `clsSocios_Capital` | §7.8, §9.3 a §9.5 |
| `frmOpcionesEspeciales` | PAN-INS-12, PAN-INS-28 |

### 22.6 Checklist

- [x] 22 secciones de la plantilla.
- [x] Todas las tablas CAT asignadas mapeadas (22.3).
- [x] Todos los parámetros TITULARES asignados con destino (22.4).
- [x] Todas las reglas RN asignadas con decisión (§6, 22.2).
- [x] Requisitos BASE con RF o PA (22.1).
- [x] Contraposiciones con regla de prevalencia (§20).
- [x] Preguntas abiertas con opción recomendada (§21).
- [x] Sin código ni datos personales reales.
