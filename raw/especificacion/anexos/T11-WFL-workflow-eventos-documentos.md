# T11 WFL — Workflow, eventos, tareas, aprobaciones y documentos

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Estado | Especificación consolidada — pendiente de validar preguntas abiertas |
| Solución (BASE §105) | Plataforma — núcleo compartido por ERP, CRM, Landing-autogestión, Cobranza, Pasarelas, Impuestos y APIs ("eventos entre componentes", autorizaciones, expediente) |
| Olas | **O0**: contrato y catálogo de eventos de dominio sobre el outbox de T01, catálogo de jobs y programación por tenant, patrón de operaciones (núcleo), repositorio documental base, plantillas y render HTML → PDF, numeración de documentos. **O1**: librería de máquinas de estado, motor de aprobaciones (simple, multinivel, por monto, separación de funciones), bandeja unificada, expediente digital, delegaciones. **O2**: workflow configurable de trámites con formularios dinámicos tipados, SLA y escalamiento, agenda unificada, "Mis documentos" y "Mis trámites" en la PWA. **O3**: firma manuscrita digitalizada de conformidad en campo. **O4**: plantillas fiscales (factura, NC, ND, Liquidación de Servicios Públicos) y numeración coordinada con M05/M06. **O5**: recibos, constancias de cobro y libre deuda. **O8**: firma conjunta de órdenes de pago y doble firma de compras. **O9**: firma de recibos de sueldo. **O10**: actas y documentación institucional, plantillas de mesa de entradas, votación del consejo. **O11**: migración de adjuntos y autorizaciones históricas, reproceso masivo de eventos, eventos públicos (vía T10). |
| Dueño de datos | Contrato de eventos: `eventTypes`, `eventSubscriptions`. Jobs funcionales: `jobDefinitions`, `jobSchedules`, `bulkRuns`, `bulkRunItems`, `operationalInboxItems`. Operaciones: `operationTypes`, `operations`, `operationSteps`. Estados y workflow: `stateMachineRegistry`, `workflowDefinitions`, `workflowVersions`, `workflowInstances`, `workflowInstanceEvents`, `slaPolicies`, `slaTimers`, `formDefinitions`, `formVersions`, `formSubmissions`, `actionCatalog`, `dataSourceCatalog`. Aprobaciones: `approvalPolicies`, `approvalRequests`, `approvalSteps`, `approvalDecisions`, `delegations`. Tareas: `tasks`, `taskComments`, `workItems` (proyección), `agendaEntries` (proyección), `agendaFeeds`. Documentos: `documentTypes`, `documents`, `documentVersions`, `documentLinks`, `shareLinks`, `retentionPolicies`, `legalHolds`, `documentAccessLogs`. Plantillas: `documentTemplates`, `templateVersions`, `templateDataContracts`, `renderRequests`. Numeración: `numberingSequences`, `numberingAssignments`. Firma: `signatureProfiles`, `signatureRequests`, `signatureParticipants`, `signatureEvidences`. Expediente: `dossiers`, `dossierEntries`. **No** es dueño de `outboxEvents`, `inboxReceipts`, `deadLetters`, `jobRuns`, `idempotencyKeys` ni `storedFiles` (mecánica técnica de T01 §7.6–7.7; ver CTR-WFL-01). |
| Fuentes consolidadas | BASE §2, §15, §16, §26 (tareas, atención, comunicaciones), §27 (institucional), §29 (aprobaciones), §33 (entidades), §39.5 (estados de ejemplo), §47, §52.3, §53, §54 (GOB-001..004, CU-GOB-01), §58 (CU-ARQ-01), §65, §69 (LOT-001..004, CU-LOT-01), §73 (firma capturada), §97.1, §97.2, §97.8, §97.10, §100 (MER-012, MER-013, MER-016), §102, §105 · AGR-002, AGR-003, AGR-009, AGR-010, AGR-016, AGR-017, AGR-019, AGR-020, AGR-021, AGR-022, AGR-023, AGR-024, AGR-025, AGR-031, AGR-034, AGR §5.1–5.6, ESC-01..05 · CNX §2.2–2.7, §4.3–4.4 (Trámites: Solicitudes, Tipos, Estados, Workflows), §4.6, §10 V-01 · DFA M1, M2, M3, M7, M8, M13, M14, M20, M21, M22, M24, §31 · FIC 13.1, 14.1, 15, 21, 22 · RN-06 §23.3 · RN-07 §5 (`TRANSAC`, `RESPONSA_NOTIFICA`), §6 (`TICKETS`), §7 (actividades) · RN-08 §7.2, §15.3 · RN-09 §4.2–4.3 · RN-10 §2, §3.5, §16.2–16.4 · CAT §27 y tablas `TRAMITES`, `TRAMITES_ACCIONES`, `PTRAMITES`, `EXPEDIENTES`, `EXPEDIENTES_TRAM`, `CLAS_INC`, `RESPONSA_NOTIFICA`, `TRANSAC`, `SAPROV`, `OCOMPRA`, `PPAGOS_FIRMANTES`, `PPAGOS_FIRMAS`, `SU_LICENCIAS`, `SU_EMPLEADOS_DOCUMENTOS`, `ACTAS`, `REQUISITOS`, `REQUISITOS_ITEMS`, `AUTORIZACIONES`, `FIRMADIGITAL*`, `FIRMASDIGITALES`, `FIRMASELECTRONICAS*`, `ENTIDA_ESTADOS`, `ENTIDADCIR`, `ENTIDAEST`, `ADJUNTOS`, `PROCOOPAR_ADJUNTOS`, `BLOQUEO_FILAS`, `ESTADOS`, `OPERACIONES`, `OPE_COM`, `RELACION_ENTIDADES`, `PLANTILLA`, `PLANTILLA_WSP`, `VARIABLEPLANT`, `CIRCULAR`, `PROMAIL`, `AUDIT_MAIL`, `CALENDARIO`, `COMPROB`, `COMPPOS`, `PTOVENTA` · INV `Configuracion.md` (`frmAutorizaciones`, `frmAdjuntos`, `frmAdjuntos_Nuevo`, `frmAdjuntarPdfs`, `frmAdjuntoProcoopar`, `frmCalendario`, `frmAgenda`, `frmCorreo`, `frmCorreo_Editor`, `frmNotificacion`, `frmPlantillaEditor`, `frmFirmaElectronica`, `frmUbicacionFirma`, `frmRequisitos`, `frmRequisito_Detalles`, `frmRequisito_Adherentes`, `frmPTramites`, `frmSelectNumero`, `frmEnvioMail`, `frmTransicion_Vistas`), `ProMod_Titulares.md` (`frmTramite`, `frmTramiteCambioSevicio`, `frmCirculares`), `ProcoopNet.md` (`frmTransicion`), `ProMod_Tecnica.md` (`frmTecnica_AutorizarNecesidad`, `frmOT_Notificaciones`), `ProMod_GestionMora.md` (`frmGestionMora_Notificar`), `ProMod_Cobranzas.md` (`frmPrescripcionDeuda_Confirmar`, `frmConfirmarPago`) · Secciones 12 de los anexos M01–M19 y de T01, T02, T04, T06, T07, T10 (catálogos de eventos y jobs consolidados en §12). |


> **Norma de implementación (DEC-111, DEC-112, DEC-110, DEC-113).** Construcción GoodApps: **.NET 10**, **ASP.NET Core**, **EF Core**, **Azure SQL** (base compartida, `TenantId` en tablas de negocio), front **React 19**, **Microsoft Azure** (Container Apps, Blob, Queue, Key Vault, Application Insights), identidad **OpenIddict**. Modelo físico: `07-modelo-relacional-azure-sql.md` y `07-catalogo-tablas-sql.md`. Checklist e impacto: `06-impacto-adaptacion-stack-goodapps.md` (**DIR-13**).
>
> **Lectura:** «colección» en este anexo = **entidad lógica**; tablas, columnas y FK en `07-*`. RF/RN/CU del anexo **no cambian** por el stack.


## 1. Objetivo

Definir el **núcleo de coordinación** de CoopApps, es decir, la infraestructura funcional que todos los módulos usan para:

1. **Comunicarse por eventos de dominio**. Cada cambio confirmado publica un evento por el outbox transaccional (DEC-003, AGR-016). T11 fija el **contrato**: sobre, versionado, catálogo, suscripciones, semántica de entrega al menos una vez, consumidores idempotentes, bandeja operativa y reproceso. Además, consolida en §12 el **catálogo completo de eventos** de M01–M19 y de los transversales, con productor, payload mínimo y consumidores, y concilia los nombres que hoy no coinciden entre productores y consumidores.
2. **Ejecutar procesos masivos y programados** como jobs BullMQ. T11 aporta el catálogo consolidado de jobs (`JOB-`), la programación cron **por tenant y con su zona horaria**, las ventanas permitidas, la visibilidad funcional de las corridas (progreso, pausa, reanudación, excepciones; BASE §69 LOT-001..004) y la bandeja de excepciones de lote.
3. **Aplicar el patrón de "operaciones"** de BASE §100 MER-012. Toda acción sensible (anular un recibo, reintegrar, condonar intereses, publicar una tarifa, reabrir un período, fusionar personas) se registra como una operación con identificador, aprobación según importe o riesgo, orden y plazo. Ninguna produce efectos antes de aprobarse. La ejecuta el módulo dueño de forma idempotente, con reparación de pasos y estados observables: Pendiente, Confirmado, Fallido e Incierto (AGR §5.5).
4. **Modelar estados y transiciones** en dos capas:
   - la **máquina de estados canónica** de cada entidad, que declara el módulo dueño con la librería común de T11 (AGR-003);
   - el **workflow configurable de trámites** (estados, transiciones, responsables por rol o área, SLA, vencimientos, escalamiento, formularios dinámicos tipados, adjuntos, acciones tipadas).

   Juntas reemplazan `TRANSAC`, `ENTIDA_ESTADOS`, los estados de `TICKETS`, `REQUISITOS`/`REQUISITOS_ITEMS`, `TRAMITES_ACCIONES` (scripts SQL) y los Trámites y Workflows de Connectia.
5. **Aprobar** de forma simple, secuencial (multinivel), paralela N de M, por tramos de monto, por atributos de riesgo, con doble firma o firma conjunta, separación de funciones, vencimiento, escalamiento y delegación. La autorización puntual de un solo paso queda en T02.
6. Ofrecer al empleado una **bandeja unificada** (tareas, aprobaciones, casos asignados, OT, excepciones de lote, operaciones detenidas) y una **agenda** que integra los calendarios de los módulos.
7. **Gestionar documentos**: repositorio privado por tenant sobre el almacenamiento de T01, tipos documentales, versionado con versión aceptada fijada, metadatos, sensibilidad, retención y legal hold, y enlaces revocables (AGR-023). También cubre:
   - **plantillas con variables** que generan PDF (facturas, recibos, notas, certificados, contratos, actas, intimaciones, constancias);
   - **numeración** de documentos;
   - **firma** en tres niveles: manuscrita digitalizada, electrónica y digital.
8. Mantener el **expediente digital** de cualquier sujeto (persona, titular, cuenta, suministro, contrato, empleado, proveedor, asamblea, caso), con línea de tiempo, exportación auditada y vista del socio. Además, **coordinar la mesa de entradas** de M09 (MER-016) con numeración, expediente, workflow y plantillas de acuse.

## 2. Límite y responsabilidades

### 2.1 Qué hace T11

| Ámbito | Responsabilidad |
|---|---|
| Contrato de eventos | Sobre estándar, convención de nombres, versionado de esquema, catálogo `eventTypes` (fuente: `packages/shared/events`), registro de suscripciones por consumidor, reglas de datos personales en payload, conciliación de nombres, reproceso funcional y bandeja operativa para el tenant. |
| Catálogo de jobs | Catálogo `jobDefinitions` con clase de cola, prioridad, concurrencia por tenant, reintentos e idempotencia. Programación por tenant (`jobSchedules`) con cron, zona horaria, ventanas y suspensión. Corridas masivas funcionales (`bulkRuns`) con progreso, pausa, excepciones y reanudación. |
| Operaciones | Tipos de operación, solicitudes, aprobación, ejecución delegada al módulo dueño, pasos de saga, reparación, conciliación de resultados inciertos y bandeja de operaciones detenidas (AGR-021). |
| Estados | Librería `defineStateMachine` (transiciones, guardas, efectos, reversión), registro de máquinas por módulo y vista de diagramas. El historial lo guarda el módulo dueño. |
| Workflow y trámites | Definiciones versionadas, instancias, tareas humanas, acciones tipadas, temporizadores, SLA en días hábiles (calendarios de T04), escalamiento, formularios dinámicos tipados, fuentes de datos tipadas y adjuntos obligatorios. |
| Aprobaciones | Políticas por tipo de operación, por importe y por riesgo. Pasos, quórum, separación de funciones, delegación, vencimiento, escalamiento y evidencia. |
| Bandeja y agenda | Proyección `workItems` de todas las fuentes, reglas de prioridad y agrupación por vencimiento, reasignación, supervisión de carga, agenda unificada y feed iCal de solo lectura. |
| Documentos | Tipos documentales, documentos, versiones, vínculos a cualquier entidad, clasificación, retención, legal hold, enlaces compartidos, registro de accesos, borrado lógico y purga controlada. |
| Plantillas y PDF | Plantillas versionadas por tipo documental, contrato de datos tipado provisto por el módulo dueño, render HTML → PDF en worker, copias, marcas de agua, códigos QR y de barras, PDF/A, inmutabilidad del emitido. |
| Numeración | Secuencias con alcance, máscara, reinicio por período, sin huecos donde se exige, reserva y anulación trazable. |
| Firma | Perfiles de firma, solicitudes con uno o varios firmantes (en orden o en paralelo), posiciones, evidencias y verificación. Firma electrónica propia; firma digital mediante conector T06. |
| Expediente | Expediente por sujeto (vista sobre vínculos) y expediente formal numerado, con línea de tiempo, foliatura opcional, exportación y vista del socio. |

### 2.2 Qué NO hace T11

| No hace | Lo hace | Cómo se relaciona |
|---|---|---|
| Relay del outbox, colecciones `outboxEvents`, `inboxReceipts` y `deadLetters`, colas BullMQ, `jobRuns`, scheduler líder, semáforo por tenant e idempotencia HTTP | **T01 PLA** (§7.6) | T11 define el contrato y el catálogo; T01 los ejecuta. La bandeja técnica (`deadLetters`) es de T01 y la bandeja operativa del tenant, de T11. |
| Almacenamiento físico, `storedFiles`, URL firmadas, antivirus (`pla:escanear-archivo`) y buckets | **T01 PLA** (§7.7) | `documentVersions.storedFileId` apunta a `storedFiles`. T11 decide quién ve qué y T01 sirve el binario. |
| Autorización puntual de supervisor, en el momento o diferida, de un solo paso (reemplazo de `FormBase.ValidarPermiso` y de `AUTORIZACIONES`), roles, capabilities, alcance, SoD estática y auditoría genérica | **T02 IAM** | Los pasos de aprobación de T11 llaman al mismo `authorize()` (RF-IAM-096). Las solicitudes de T02 se ven en la bandeja de T11 como `workItems`. |
| Plantillas de comunicación (email, SMS, push, WhatsApp), notificaciones, preferencias, constancias de entrega | **T09 COM** | T11 emite eventos (`wfl.task.assigned`, `wfl.approval.stepAssigned`, `wfl.sla.warning`) y T09 decide canal y contenido. Un PDF de T11 puede viajar como adjunto de T09. |
| Calendarios laborales y feriados | **T04 CFG** | T11 calcula SLA y vencimientos con los calendarios de T04 (`cfg.holiday.changed`). |
| Casos, reclamos, solicitudes, mesa de entradas (`crmCases.kind = deskEntry`), trámites presentados (`PTRAMITES`), tipos de trámite, actividades internas, circulares y calendario interno | **M09 CRM** | M09 usa el motor de workflow, las aprobaciones, el expediente, la numeración y las plantillas de T11; T11 proyecta sus ocurrencias, casos y citas en bandeja y agenda (PA-WFL-07, PA-WFL-08). |
| Lógica de negocio de cada operación (qué hace "anular recibo") | Módulo dueño | El módulo registra un handler para cada `operationType`; T11 orquesta y nunca escribe colecciones ajenas (ARQ-01). |
| Numeración fiscal ante ARCA (CAE, CAEA, CAI, puntos de venta) | **M05 FAC / M06 FIS** | M05 usa las secuencias de T11 con alcance de punto de venta y tipo de comprobante; el control de correlatividad con ARCA es de M06. |
| Reportes, tableros, eventos públicos y webhooks a terceros | **T10 BIA** | T11 provee la fuente (eventos marcados `public`); T10 entrega (`bia:despachar-eventos-publicos`). |
| Conectores de firma digital y proveedores externos | **T06 INT** | `int.signature.completed` y `int.signature.rejected` alimentan `signatureRequests`. |
| Migración de datos y archivos | **T07 MIG** | `mig:migrar-adjuntos` usa el servicio de importación documental de T11. |
| Votación del consejo y actas como objeto institucional | **M17 INS** | T11 aporta la capability `wfl.consejo.votar` (T02), las aprobaciones de tipo comité, la plantilla de acta y la firma. |

### 2.3 Qué expone T11 a los demás módulos (API interna `modules/wfl/index.js`)

| Servicio | Uso típico |
|---|---|
| `wfl.events.define(type, schema, options)` | Registrar un tipo de evento en el catálogo (en tiempo de compilación, desde `packages/shared/events`). |
| `wfl.operations.request({type, subject, payload, amount, risk}, {session})` | Solicitar una operación sensible; devuelve `operationId` y estado (`pendingApproval` o `approved` si la política no exige aprobación). |
| `wfl.operations.registerHandler(type, {validate, execute, compensate, reconcile})` | El módulo dueño declara cómo se ejecuta cada tipo. |
| `wfl.services.requestApproval({policyCode, subjectRef, amount, attributes})` | Aprobación sin operación (publicar versión de configuración, restauración de T01). |
| `defineStateMachine(spec)` | Máquina canónica de una entidad (en `packages/shared/state`). |
| `wfl.workflow.start(definitionCode, subjectRef, input)` | Iniciar un trámite configurable. |
| `wfl.tasks.create({...})` | Crear una tarea humana (incluidas las tareas de revisión que piden otros módulos). |
| `wfl.documents.attach({subjectRefs, documentTypeCode, storedFileId, metadata})` | Registrar un documento o una nueva versión. |
| `wfl.templates.render({templateCode, dataContractVersion, data, options})` | Generar un PDF (sincrónico para uno, job para lotes). |
| `wfl.numbering.next(sequenceCode, scope, {session})` | Obtener el próximo número dentro de la transacción del llamador. |
| `wfl.signatures.request({documentVersionId, profileCode, participants})` | Iniciar una firma. |
| `wfl.dossier.timeline(subjectRef)` | Línea de tiempo del expediente. |

## 3. Glosario del módulo

| Término | Definición | Clave de diccionario | Término ProCoop / Connectia equivalente |
|---|---|---|---|
| Evento de dominio | Hecho de negocio confirmado, inmutable, nombrado `<mod>.<entidad>.<hecho en pasado>`, publicado por outbox en la misma transacción que el cambio. | `dict:wfl.event` | No existe; acoplamiento por tablas compartidas y `TRANSAC.ENVIO_SMS`. |
| Sobre del evento | Metadatos comunes de todo evento (identificador, tipo, versión, tenant, agregado, correlación, causa, actor). | `dict:wfl.eventEnvelope` | — |
| Consumidor | Handler suscripto a un tipo de evento; idempotente por (`consumer`, `eventId`). | `dict:wfl.consumer` | — |
| Bandeja operativa | Lista del tenant con eventos, jobs u operaciones detenidas que tienen impacto de negocio, explicada en términos funcionales (AGR-021, AGR §5.5). | `dict:wfl.operationalInbox` | Errores en `LogProcoop.txt` y mails (RN-09 §4.3). |
| Job | Proceso asíncrono `<mod>:<proceso>` que corre en un worker BullMQ, es idempotente, reanudable y registra su progreso. | `dict:wfl.job` | Servicio de Windows y procesos automáticos (FIC 22); `setInterval` de Connectia. |
| Programación | Ejecución periódica de un job para un tenant, con cron, zona horaria y ventana permitida. | `dict:wfl.jobSchedule` | `IconoNotificacion.btnTareasProgramadas`. |
| Corrida masiva | Ejecución de un job sobre un universo de ítems, con progreso, pausa, excepciones y reanudación (BASE §69). | `dict:wfl.bulkRun` | `frmProgressBar_WithLog`, `frmProcesoAutomatico`. |
| Operación | Solicitud registrada de una acción sensible con identificador propio, aprobación, ejecución idempotente y resultado observable (MER-012, AGR-016). | `dict:wfl.operation` | `OPERACIONES`, `AUTORIZACIONES` (parcial). |
| Tipo de operación | Definición de una operación: módulo dueño, política de aprobación, handler, compensación, plazo. | `dict:wfl.operationType` | `TIPO_AUTORIZACION` de `AUTORIZACIONES`. |
| Resultado incierto | Estado de una operación o paso cuyo efecto externo no se pudo confirmar ni descartar; exige conciliación (AGR §5.5). | `dict:wfl.uncertain` | No existe. |
| Máquina de estados canónica | Conjunto cerrado de estados y transiciones de una entidad, definido en código por el módulo dueño. | `dict:wfl.stateMachine` | `ESTADOS`, `ENTIDA_ESTADOS`, `TRANSAC` (códigos 1–8). |
| Estado operativo | Estado configurable por el tenant que se mapea a un estado canónico (por ejemplo, "Rehabilitación en trámite" → `reactivationPending`). | `dict:wfl.operationalState` | `TICKETS_ESTADOS` mapeado a estado base 1–4. |
| Workflow (definición) | Diagrama versionado de un trámite: estados, transiciones, tareas, acciones, formularios, SLA y responsables. | `dict:wfl.workflowDefinition` | Workflows de Connectia; `TRAMITES` + `TRAMITES_ACCIONES`. |
| Instancia | Ejecución de una definición sobre un sujeto concreto. | `dict:wfl.workflowInstance` | Solicitud de Connectia; `PTRAMITES`. |
| Acción tipada | Paso automático de un workflow que invoca un comando registrado de un módulo, con parámetros validados por Zod. | `dict:wfl.action` | Script SQL de `TRAMITES_ACCIONES` y procedimiento almacenado de `REQUISITOS`. |
| Formulario dinámico | Formulario versionado de campos tipados con validaciones, visibilidad condicional y fuentes de datos tipadas. | `dict:wfl.form` | `REQUISITOS_ITEMS` (tipos 0, 1, 2, 3, 4, 7 y 9). |
| Fuente de datos tipada | Lista o consulta registrada por un módulo (por ejemplo, "adherentes del contrato") que alimenta un campo de formulario. | `dict:wfl.dataSource` | Tipo 4 "consulta SQL genérica". |
| SLA | Plazo objetivo de una tarea, aprobación o instancia, calculado en días hábiles o corridos según calendario. | `dict:wfl.sla` | `DIAS_VENCE` de `TRAMITES`; `MARGEN_ANT`/`MARGEN_POS` de `ACT_TIPOS`. |
| Escalamiento | Acción automática al alcanzar un umbral de SLA: avisar, reasignar, sumar aprobador, elevar prioridad o expirar. | `dict:wfl.escalation` | `RESPONSA_NOTIFICA` (guardia por día, horario y feriado). |
| Política de aprobación | Regla que determina, para un tipo de operación, quién aprueba, en qué orden, con qué quórum, por qué tramo de importe o riesgo y con qué plazo. | `dict:wfl.approvalPolicy` | `DOBLE_AUTO`, P2377, P2382, P2640, P2867. |
| Separación de funciones | Regla que impide que la misma persona solicite y apruebe, o que apruebe dos pasos de la misma solicitud. | `dict:wfl.sod` | `USU_AUTO` ≠ `USU_AUTO2` en `SAPROV`. |
| Delegación | Transferencia temporal y auditada de la capacidad de aprobar o ejecutar tareas a otra persona con permisos equivalentes. | `dict:wfl.delegation` | No existe. |
| Ítem de bandeja | Elemento de la bandeja unificada que apunta a una tarea, aprobación, caso, OT, excepción u operación. | `dict:wfl.workItem` | `frmAutorizaciones`, `IconoNotificacion`, tickets "tomados". |
| Agenda | Vista de calendario del empleado que integra citas internas, visitas, turnos, reuniones, licencias, vencimientos y feriados. | `dict:wfl.agenda` | `frmCalendario`, `frmAgenda`, `CALENDARIO`. |
| Documento | Registro con metadatos, tipo, sujeto y versiones de un archivo de negocio. | `dict:wfl.document` | `ADJUNTOS`. |
| Versión aceptada | Versión de un documento que quedó fijada como válida para un acto (firma, aprobación, presentación) y no se reemplaza (AGR-023). | `dict:wfl.acceptedVersion` | No existe (los adjuntos se sobrescriben). |
| Tipo documental | Clasificación de documentos con sensibilidad, retención, extensiones admitidas, visibilidad para el socio y obligatoriedad. | `dict:wfl.documentType` | `ADJUNTOS.TIPO` (1, 2, 3, 4, 5, 7, 12, 15, 24, 25, 26, 30). |
| Legal hold | Bloqueo que impide purgar un documento aunque venza su retención (por ejemplo, ante un juicio). | `dict:wfl.legalHold` | No existe. |
| Enlace compartido | URL con token revocable y vencimiento que da acceso de solo lectura a un documento a un tercero sin cuenta. | `dict:wfl.shareLink` | "Archivos en la Web" de CoopOnline (FIC 14.1). |
| Plantilla de documento | Diseño versionado (HTML/CSS de impresión con variables) que, con un contrato de datos, produce un PDF. | `dict:wfl.documentTemplate` | `PLANTILLA`, `VARIABLEPLANT`, reportes Crystal/DevExpress, plantillas Word de `ACT_TIPOS`. |
| Contrato de datos | Esquema tipado (Zod) de las variables que el módulo dueño entrega a una plantilla; de él se genera el catálogo de variables. | `dict:wfl.dataContract` | `VARIABLEPLANT`. |
| Secuencia de numeración | Contador con alcance (tenant, sucursal, punto de venta, tipo, período), máscara y política de huecos. | `dict:wfl.numberingSequence` | `CLAS_INC.ULT_NUM`, `PTOVENTA`, `COMPPOS`, `frmSelectNumero`. |
| Firma manuscrita digitalizada | Trazo capturado en pantalla con evidencias (hash, fecha, geolocalización, dispositivo); es conformidad, no firma digital (BASE §73). | `dict:wfl.handwrittenSignature` | Firma del cliente en la app (DFA M14). |
| Firma electrónica | Firma de la Ley 25.506 art. 5 con identificación por cuenta, segundo factor, hash y constancia. | `dict:wfl.electronicSignature` | `FIRMASELECTRONICAS*`. |
| Firma digital | Firma de la Ley 25.506 art. 2 con certificado de un certificador licenciado, en formato PAdES, mediante conector. | `dict:wfl.digitalSignature` | `FIRMADIGITAL*`, `FIRMASDIGITALES`, `clsFirmaDigital`. |
| Expediente digital | Conjunto ordenado de documentos, eventos, trámites y decisiones de un sujeto, con línea de tiempo. | `dict:wfl.dossier` | `EXPEDIENTES`, `EXPEDIENTES_TRAM`, `RELACION_ENTIDADES`. |
| Expediente formal | Expediente con número propio, carátula, foliatura opcional y estado (abierto, cerrado, archivado). | `dict:wfl.formalDossier` | `EXPEDIENTES` (mesa de entradas, DFA M21). |
| Acuse | Constancia de recepción numerada que se entrega al presentante. | `dict:wfl.receipt` | Constancia de mesa de entradas. |

## 4. Actores, permisos y alcance

Las capabilities `wfl.*` del catálogo de T02 (§ "T11 WFL") se conservan con su nombre. Las que agrega este anexo se proponen a T02 para su catálogo (marca **N**). Las marcas siguen la convención de T02: **S** sensible (MFA reciente), **D** sujeta a SoD, **U** admite autorización de supervisor, **$** limitada por importe.

### 4.1 Capabilities

| Capability | Descripción | Marcas | Origen |
|---|---|---|---|
| `wfl.flujos.configurar` | Diseñar workflows, políticas de aprobación y tipos de operación del tenant | S | T02 |
| `wfl.flujos.ver` | Ver definiciones y diagramas | — | N |
| `wfl.flujos.publicar` | Publicar una versión de workflow o de política (con aprobación si PRM-WFL-030) | S D | N |
| `wfl.formularios.configurar` | Diseñar formularios dinámicos | — | N |
| `wfl.tareas.ver` | Ver la bandeja propia | — | T02 |
| `wfl.tareas.ejecutar` | Completar tareas asignadas | — | T02 |
| `wfl.tareas.reasignar` | Reasignar tareas y aprobaciones de su área | — | T02 |
| `wfl.tareas.crear` | Crear tareas ad hoc a otras personas o áreas | — | N |
| `wfl.bandeja.supervisar` | Ver la bandeja de su área o tenant, la carga y los vencidos | — | N |
| `wfl.aprobaciones.decidir` | Decidir pasos de aprobación asignados (además de la capability del dominio) | S D $ | N |
| `wfl.aprobaciones.delegar` | Crear delegaciones propias | S | N |
| `wfl.aprobaciones.administrar` | Reasignar o cancelar aprobaciones ajenas y crear delegaciones por otros | S | N |
| `wfl.operaciones.ver` | Ver operaciones y su historial | — | N |
| `wfl.operaciones.reintentar` | Reintentar pasos fallidos y resolver inciertos con evidencia | S U | N |
| `wfl.expedientes.ver` | Ver expedientes | — | T02 |
| `wfl.expedientes.adjuntar` | Adjuntar documentos | — | T02 |
| `wfl.expedientes.exportar` | Exportar un expediente completo | S | N |
| `wfl.expedientes.gestionar` | Abrir, cerrar, archivar y foliar expedientes formales | — | N |
| `wfl.documentos.descargar` | Descargar documentos (la referencia T04b V2 3093) | — | T04b |
| `wfl.documentos.anular` | Anular un documento o versión (borrado lógico con motivo) | S | N |
| `wfl.documentos.verSensibles` | Ver documentos de sensibilidad `restricted` o `health` | S | N |
| `wfl.documentos.compartir` | Crear y revocar enlaces compartidos | S | N |
| `wfl.documentos.retener` | Aplicar y liberar legal hold y configurar retención | S | N |
| `wfl.documentos.firmar` | Firmar digital o electrónicamente | S | T02 |
| `wfl.firmas.configurar` | Perfiles de firma, certificados y firmantes vigentes | S | T02 |
| `wfl.firmas.solicitar` | Solicitar una firma (además de la capability del dominio del acto; API-WFL-75) | — | T02 |
| `wfl.instancias.iniciar` | Iniciar una instancia de workflow desde admin (además de la capability del dominio; API-WFL-27) | — | T02 |
| `wfl.instancias.administrar` | Cancelar, suspender y reanudar instancias (API-WFL-31) | S | T02 |
| `wfl.plantillas.ver` | Ver plantillas y previsualizar | — | N |
| `wfl.plantillas.editar` | Editar borradores de plantillas | — | N |
| `wfl.plantillas.publicar` | Publicar plantillas (las fiscales exigen aprobación) | S D | N |
| `wfl.numeracion.configurar` | Crear y ajustar secuencias | S | N |
| `wfl.agenda.ver` | Ver agenda propia y de su equipo según alcance | — | N |
| `wfl.jobs.ver` | Ver jobs y progreso | — | T02 |
| `wfl.jobs.reintentar` | Reintentar o cancelar jobs | U | T02 |
| `wfl.jobs.programar` | Reprogramar cron y ventanas de jobs del tenant | S | N |
| `wfl.eventos.ver` | Ver eventos y la bandeja operativa | — | T02 |
| `wfl.eventos.reprocesar` | Reprocesar eventos de la bandeja operativa del tenant | S | N |
| `wfl.consejo.votar` | Votación del consejo | S | T02 |

### 4.2 Roles y alcance

| Rol (T02) | Capabilities principales | Alcance de datos |
|---|---|---|
| T-ADM Administrador del tenant | `wfl.flujos.*`, `wfl.formularios.configurar`, `wfl.plantillas.*`, `wfl.numeracion.configurar`, `wfl.firmas.configurar`, `wfl.jobs.*`, `wfl.eventos.*`, `wfl.aprobaciones.administrar`, `wfl.documentos.retener` | Tenant |
| T-GER Gerencia | `wfl.aprobaciones.decidir`, `wfl.bandeja.supervisar`, `wfl.expedientes.ver`, `wfl.agenda.ver` | Tenant, con límites de importe de su asignación |
| Responsables de área (T-FAC, T-TES, T-CON, T-CMP, T-STE, T-SAT, T-RRHH, T-SEC) | `wfl.aprobaciones.decidir`, `wfl.tareas.reasignar`, `wfl.bandeja.supervisar`, `wfl.operaciones.ver`, `wfl.jobs.ver` | Área, sucursal o servicios asignados |
| Personal en general (staff) | `wfl.tareas.ver`, `wfl.tareas.ejecutar`, `wfl.tareas.crear`, `wfl.expedientes.ver`, `wfl.expedientes.adjuntar`, `wfl.documentos.descargar`, `wfl.agenda.ver` | Propios y alcance del objeto vinculado |
| Firmantes habilitados | `wfl.documentos.firmar` | Documentos que los designan |
| T-CJO Consejo | `wfl.consejo.votar`, `wfl.aprobaciones.decidir` (comité) | Tenant |
| T-SIN Síndico / Auditor | `wfl.flujos.ver`, `wfl.operaciones.ver`, `wfl.expedientes.ver`, `wfl.eventos.ver` | Tenant, solo lectura |
| C-SOC Socio / titular / representante (PWA) | Ver "Mis documentos" y "Mis trámites", iniciar trámites habilitados, adjuntar, firmar conformidades | Sus cuentas y representaciones (T02 / M01) |
| C-EMP Empleado (PWA) | Ver recibos y documentos laborales propios, firmar recibos | Propios |
| P-OPS Operaciones de plataforma | Bandeja técnica de T01; en T11 solo lectura de catálogos y reproceso si el soporte tiene acceso temporal (AGR-034) | Tenant con acceso de soporte vigente |
| Sistema (cuenta técnica por módulo) | Publicar eventos, solicitar operaciones, registrar documentos, renderizar, numerar | Tenant del contexto |

Reglas de alcance:

- Para ver un documento, una tarea o una aprobación hacen falta dos condiciones: la capability de T11 y el permiso del usuario sobre el **objeto vinculado**. Este último lo valida el módulo dueño mediante `canAccess(subjectRef, user)`.
- Un documento vinculado a varios sujetos es visible si el usuario tiene acceso a **alguno** de ellos, salvo los de sensibilidad `restricted` o `health`, que exigen además `wfl.documentos.verSensibles`.
- El alcance de un aprobador se valida al decidir, no al asignar. Si al decidir perdió el alcance o el límite de importe, la decisión se rechaza con 403 y el paso se reasigna (RN-WFL-041).

## 5. Requisitos funcionales

### 5.1 Bus de eventos de dominio

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-WFL-001 | Todo cambio de estado de negocio que interese a otro módulo se publica como evento de dominio vía outbox en la **misma transacción** del cambio (servicio `publish()` de T01). | DEC-003; AGR-016; BASE §105; T01 RF-PLA-009 | Núcleo | O0 | Informado | Si la transacción aborta, no existe evento; si confirma, el evento existe aunque el relay esté caído. |
| RF-WFL-002 | Sobre estándar obligatorio (§12.1): `eventId` UUIDv7, `type`, `schemaVersion`, `tenantId`, `occurredAt`, `recordedAt`, `aggregateType`, `aggregateId`, `aggregateVersion`, `correlationId`, `causationId`, `actor`, `sourceModule`, `requestId`, `piiLevel`, `visibility`. | AGR-016; T01 §7.11.23 | Núcleo | O0 | Adoptado | Un evento sin `correlationId` o con `type` fuera del catálogo es rechazado por `publish()` en pruebas y en ejecución. |
| RF-WFL-003 | Nombre `<mod>.<entidad>.<hecho en pasado>` en camelCase. El módulo es el código de tres letras del anexo dueño y el hecho es un verbo en pasado o un sustantivo de resultado. | Guía §5; maestro | Núcleo | O0 | Adoptado | `npm run check:events` falla ante nombres en kebab-case, prefijos inexistentes (`cli`, `pag`, `inv`, `col`, `ten`) o duplicados. |
| RF-WFL-004 | Catálogo único de eventos `eventTypes` generado desde `packages/shared/events` (esquema Zod por tipo y versión), con productor, consumidores registrados, sensibilidad, visibilidad (`internal`, `public`) y estado (`active`, `deprecated`). | Pedido T11; T01 §7.5 | Núcleo | O0 | Adoptado | La pantalla PAN-WFL-20 lista los tipos de §12 con su esquema, productor y consumidores. |
| RF-WFL-005 | Versionado de esquema compatible hacia atrás: agregar campos opcionales no cambia la versión; quitar o cambiar semántica crea `schemaVersion` nueva y ambas versiones conviven durante `PRM-WFL-003` días. | AGR-016 | Núcleo | O0 | Adoptado | Un consumidor de v1 sigue recibiendo v1 mientras el productor publica v2 en paralelo. |
| RF-WFL-006 | Payload mínimo: identificadores y datos necesarios para decidir, **sin datos personales** salvo los imprescindibles y marcados (`piiLevel`). Los importes viajan como string decimal con `currency` y nunca como `Number`. | BASE §97.1; Guía §5 (dinero); AGR-031 | Núcleo | O0 | Adoptado | Prueba de catálogo: ningún esquema declara `number` para un campo de importe; los eventos con `piiLevel = personal` no son `public`. |
| RF-WFL-007 | Suscripciones declaradas por manifiesto de módulo (`eventSubscriptions`): consumidor, tipo, versión aceptada, cola, filtro opcional y política de reintentos. | T01 RF-PLA-005 (manifiestos) | Núcleo | O0 | Adoptado | Un consumidor no declarado no recibe eventos; el arranque falla si un consumidor apunta a un tipo inexistente. |
| RF-WFL-008 | Entrega **al menos una vez**: el consumidor es idempotente por (`consumer`, `eventId`) registrando `inboxReceipts` en la misma transacción que su efecto. | AGR-016 (no presumir entrega única); T01 RN-PLA-026 | Núcleo | O0 | Adoptado | Entregar el mismo evento dos veces produce un solo efecto (ESC-02). |
| RF-WFL-009 | Orden por agregado: los eventos de un mismo `aggregateId` se procesan por consumidor en orden de `aggregateVersion`. Si llega un evento con versión mayor a la esperada, se reencola con espera breve hasta `PRM-WFL-004` intentos y luego pasa a la bandeja operativa. | AGR-016 | Núcleo | O0 | Adoptado | `cat.contract.activated` (v3) no se aplica antes que `cat.contract.requested` (v1) en el mismo consumidor. |
| RF-WFL-010 | Bandeja operativa del tenant (`operationalInboxItems`): eventos agotados con `businessImpact`, jobs fallidos, operaciones `failed`/`uncertain`, excepciones de lote y referencias rotas del verificador de integridad de T08 (`kind = referentialIntegrity`, EVT-NFR-18; 10-11-2026, DEC-100), explicados en lenguaje funcional, con responsable, acción sugerida y estado. | AGR-021; AGR §5.5; T01 RF-PLA-141 | Núcleo | O1 | Adoptado | Un evento de `cob.payment.confirmed` que no pudo imputar en M15 aparece como "Cobro sin asiento contable" en la bandeja del contador. |
| RF-WFL-011 | Reproceso funcional: desde la bandeja operativa, un usuario con `wfl.eventos.reprocesar` reencola el evento al mismo consumidor con la misma clave; el descarte exige motivo y queda auditado. | AGR-016; T01 §9 (deadLetters) | Núcleo | O1 | Adoptado | Reprocesar no duplica efectos; descartar sin motivo devuelve 422. |
| RF-WFL-012 | Reproducción (*replay*) de eventos de un rango para **un** consumidor y **un** tenant, en job de clase `export`, para reconstruir proyecciones (bandeja, BI, saldos). | AGR-016; T10 JOB-BIA-12 | Estándar | O11 | Adoptado | La reconstrucción de `workItems` desde eventos coincide con la proyección en línea. |
| RF-WFL-013 | Trazabilidad punta a punta: `correlationId` heredado de la request o job origen y `causationId` = `eventId` causante; la vista de un agregado muestra la cadena de eventos y efectos. | T01 RF-PLA-138; AGR-016 | Estándar | O1 | Adoptado | Desde una factura se navega a sus eventos, al asiento contable y a la obligación de cuenta corriente. |
| RF-WFL-014 | Eventos `public`: un subconjunto curado del catálogo se expone a terceros por T10 (webhooks y `/api/v1/ext`), con esquema estable y sin datos personales. | AGR-021; T10 JOB-BIA-14 | Extensión | O11 | A validar (PA-WFL-14) | Solo los tipos marcados `public` aparecen en el catálogo de suscripciones de terceros. |
| RF-WFL-015 | Conciliación de nombres: el catálogo registra los **alias** que hoy usan algunos consumidores (§12.4) y el chequeo de CI los rechaza a partir de la ola en la que el consumidor se implementa. | Consolidación de anexos M01–M19 | Núcleo | O0 | Adoptado | Un consumidor que se suscribe a `fac.batch.issued` falla en CI con sugerencia `fac.billingRun.issued`. |
| RF-WFL-016 | Sin event sourcing: el estado vigente se guarda en las colecciones del módulo; los eventos son notificación y evidencia, no la fuente de verdad. | AGR §5.3; T01 ARQ-PLA-06 | Núcleo | O0 | Adoptado | Borrar eventos publicados por TTL no altera estados de negocio. |
| RF-WFL-017 | Eventos de auditoría de negocio separados: la auditoría de cambios es de T02; un evento de dominio no reemplaza el registro de auditoría ni viceversa. | BASE §54; T02 | Núcleo | O0 | Adoptado | Un cambio sin consumidores igual queda en auditoría. |

### 5.2 Jobs, programación y corridas masivas

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-WFL-020 | Catálogo `jobDefinitions` (§12.6–12.7) con nombre `<mod>:<proceso>`, módulo dueño, clase de cola de T01 (`interactive`, `integration`, `events`, `notifications`, `batch`, `export`, `ai`, `maintenance`), prioridad, concurrencia por tenant, reintentos, clave de idempotencia y si es cancelable o reanudable. | DEC-003; T01 §7.6; ARQ-03 | Núcleo | O0 | Adoptado | Un job sin entrada en el catálogo no se puede encolar. |
| RF-WFL-021 | Todo proceso masivo corre como job, nunca en la request HTTP; la API devuelve `202` con `bulkRunId` o `jobRunId`. | ARQ-03; BASE §69 LOT-001 | Núcleo | O0 | Informado | Emitir 10.000 facturas no bloquea la interfaz; la pantalla muestra progreso. |
| RF-WFL-022 | Programación por tenant (`jobSchedules`): cron de 5 campos evaluado en la **zona horaria del tenant** (default `America/Argentina/Cordoba`), ventana permitida (por ejemplo 22:00–06:00), días hábiles opcionales según calendario T04, fecha de pausa y motivo. | AGR-017; pedido T11 | Núcleo | O0 | Adoptado | Un cron "0 2 * * *" corre a las 02:00 de Córdoba para TEN-001 y a las 02:00 de la zona de otro tenant. |
| RF-WFL-023 | El administrador del tenant puede reprogramar los jobs marcados `tenantSchedulable` dentro de la ventana permitida por plataforma; no puede programar fuera de ella ni cambiar la clase de cola. | AGR-020 | Estándar | O1 | A validar (PA-WFL-18) | Intentar programar `fac:programar-ciclos` a las 14:00 si la ventana es nocturna devuelve 422 con la ventana válida. |
| RF-WFL-024 | Fan-out por tenant: los jobs programados se materializan por tenant activo con el módulo habilitado; un tenant suspendido no recibe ejecuciones (`pla.tenant.suspended`). | T01 RN-PLA-028; EVT-PLA-03 | Núcleo | O0 | Adoptado | Con TEN-002 suspendido, `mor:evaluar-mora` no corre para él. |
| RF-WFL-025 | Equidad entre tenants: la concurrencia por tenant y clase de cola se limita (semáforo de T01) para que un tenant grande no demore a los demás. | AGR-020; T01 RN-PLA-029 | Núcleo | O0 | Adoptado | Con TEN-001 corriendo 2 lotes `batch`, un lote de TEN-002 arranca sin esperar. |
| RF-WFL-026 | Corridas masivas (`bulkRuns`) con universo congelado, total, procesados, exitosos, excepciones, progreso porcentual, tiempo estimado, pausa, reanudación desde cursor y cancelación cooperativa. | BASE §69 LOT-001..004 | Núcleo | O0 | Informado | CU-LOT-01: de 100 obligaciones se emiten 98 y 2 quedan en excepciones; reanudar no reemite las 98. |
| RF-WFL-027 | Pausa automática ante fallo global (credencial ARCA vencida, conector caído): la corrida pasa a `paused` con motivo sistémico; se reanuda al recuperarse o manualmente. | BASE §69 LOT-003; EVT-FIS-21 | Núcleo | O4 | Informado | Con `fis.authorization.globalFailure`, los lotes en autorización del tenant pausan; con `globalRecovered`, se reanudan. |
| RF-WFL-028 | Bandeja de excepciones de lote: cada ítem fallido con motivo codificado, módulo y rol responsable, acción (corregir, excluir, reintentar) y reproceso solo de excepciones. | BASE §69 LOT-004; EVT-FAC-16 | Núcleo | O4 | Informado | Resolver 2 excepciones y reprocesar crea una corrida `reprocess` con 2 ítems. |
| RF-WFL-029 | Resultado de corrida descargable (XLSX/CSV) con detalle por ítem y resumen; el archivo vive en `ga-<env>-exports` con vencimiento. | BASE §69; T01 RF-PLA-027 | Estándar | O1 | Adoptado | El responsable descarga el detalle; otro usuario sin permiso recibe 404. |
| RF-WFL-030 | Pantalla de jobs del tenant (PAN-WFL-21): corridas, programaciones, próximas ejecuciones en hora local, últimas fallas y acciones permitidas. | CNX §4.6; T01 PAN-PLA-09 | Estándar | O1 | Adoptado | Un T-ADM ve solo sus corridas; P-OPS ve la vista global en T01. |
| RF-WFL-031 | Los jobs con efecto externo (pagos, ARCA, aprovisionamiento) nunca reintentan a ciegas un envío de resultado desconocido: pasan a `uncertain` y se concilian antes de reenviar. | AGR-016; AGR §5.5; ESC-01 | Núcleo | O4 | Adoptado | Un timeout de ARCA deja la factura `uncertain` y `fis:conciliar-incierto` consulta antes de reintentar. |

### 5.3 Patrón de operaciones (MER-012)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-WFL-040 | Toda acción sensible se modela como **operación** con número propio (`OPE-AAAA-NNNNNN`), tipo, sujeto, solicitante, motivo, importe, atributos de riesgo, estado y vínculo a la aprobación. | BASE §100 MER-012; AGR-016 | Núcleo | O0 | Informado | Anular un recibo crea `OPE-2026-000123` antes de cualquier efecto. |
| RF-WFL-041 | **Sin efectos hasta aprobar**: el módulo dueño no ejecuta el handler mientras la operación no esté `approved`; las lecturas muestran "pendiente de aprobación". | MER-012 | Núcleo | O1 | Informado | El recibo sigue vigente y cobrable hasta la aprobación; la caja ve la marca "anulación solicitada". |
| RF-WFL-042 | Catálogo de tipos de operación (`operationTypes`) con módulo dueño, política de aprobación por defecto, plazo de decisión, plazo de ejecución, compensación disponible, si admite lote y si requiere evidencia (§7.3, semilla de 45 tipos). | MER-012; AGR-002 | Núcleo | O1 | Adoptado | El tipo `cob.receipt.void` exige aprobación de T-TES si el importe supera PRM-COB y evidencia del motivo. |
| RF-WFL-043 | Ejecución idempotente: el handler recibe `operationId` como clave; reintentar una operación ya completada devuelve el mismo resultado. | AGR-016; CU-ARQ-01 | Núcleo | O0 | Adoptado | Doble clic en "Ejecutar" produce un solo efecto. |
| RF-WFL-044 | Pasos de saga (`operationSteps`) cuando la operación toca varios módulos: cada paso con comando, estado, intentos, resultado y compensación; los pasos se confirman de a uno y se reparan desde el último confirmado. | AGR-016; T10 JOB-TEC-04 (patrón) | Núcleo | O1 | Adoptado | Una transferencia de titularidad que falla en M07 repara solo M07 y no repite M02. |
| RF-WFL-045 | Estados observables Pendiente, Confirmado, Fallido e Incierto en la interfaz, con traducción funcional (`dict:wfl.operationState.*`). | AGR §5.5 | Núcleo | O1 | Adoptado | El operador ve "Resultado incierto: se está verificando con el banco" y no un código técnico. |
| RF-WFL-046 | Conciliación de inciertos: job por tipo con consulta al sistema externo; si no se resuelve en `PRM-WFL-012` horas, pasa a la bandeja operativa para resolución manual con evidencia. | AGR §5.5; ESC-01 | Núcleo | O4 | Adoptado | Un reintegro incierto por 48 h aparece con la acción "Registrar resultado verificado". |
| RF-WFL-047 | Operaciones en lote: una solicitud agrupa N sujetos (por ejemplo, condonar intereses a 30 cuentas) con una sola aprobación y ejecución por ítem con resultado individual. | BASE §69; RN-08 (autorización masiva) | Estándar | O4 | Adoptado | 30 ítems aprobados juntos generan 30 resultados; 1 falla sin afectar a los otros 29. |
| RF-WFL-048 | Vencimiento: una operación no decidida en su plazo pasa a `expired`; una aprobada no ejecutada en `PRM-WFL-011` horas exige revalidación. | MER-012 (plazo) | Estándar | O1 | Adoptado | Una anulación aprobada hace 3 días se revalida antes de ejecutar. |
| RF-WFL-049 | Cancelación por el solicitante mientras esté `pendingApproval`; cancelación administrativa con motivo en cualquier estado no terminal previo a la ejecución. | MER-012 | Estándar | O1 | Adoptado | Cancelar una operación `executing` devuelve 409. |
| RF-WFL-050 | Revalidación al ejecutar: el handler revalida precondiciones del dominio (saldo, estado, período abierto); si cambiaron, la operación pasa a `failed` con motivo y no se aplica parcialmente. | AGR-003 | Núcleo | O1 | Adoptado | Si el período contable se cerró entre la aprobación y la ejecución, la anulación falla con `con/period-closed`. |
| RF-WFL-051 | Toda operación genera eventos `wfl.operation.*` (§12.2) y su historia es visible en el expediente del sujeto. | MER-012 (auditado) | Núcleo | O1 | Adoptado | El expediente de la cuenta muestra solicitud, aprobaciones y resultado. |

### 5.4 Máquinas de estado canónicas

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-WFL-060 | Librería común `defineStateMachine` con estados, transiciones, actor permitido (capability), guardas (precondiciones puras), efectos (comandos y eventos), reversión y si requiere operación aprobada. | AGR-003; BASE §39.5 | Núcleo | O1 | Adoptado | Una transición no declarada lanza `wfl/invalid-transition` (409). |
| RF-WFL-061 | Cada módulo declara sus máquinas (contrato, factura, OT, caso, lote, liquidación, OP) y las registra en `stateMachineRegistry` al desplegar; T11 no guarda el estado de la entidad. | ARQ-01; AGR-002 | Núcleo | O1 | Adoptado | El estado del contrato vive en `serviceContracts` de M02; T11 solo conoce la definición. |
| RF-WFL-062 | Historial de transiciones en la colección del módulo dueño con estado anterior, nuevo, fecha efectiva, fecha de registro, actor, motivo y `operationId` si aplica. | AGR-003; AGR-010 | Núcleo | O1 | Adoptado | La línea de tiempo del contrato muestra cada cambio con quién y por qué. |
| RF-WFL-063 | Estados operativos configurables por el tenant, mapeados a un canónico y con banderas (visible al socio, notificar, pausa de SLA, requiere aprobación). | RN-07 §6 (`TICKETS_ESTADOS`); M02 PAN-CAT-10; M09 RF-CRM-043 | Estándar | O2 | Adoptado | No se puede guardar un conjunto que deje un estado canónico obligatorio sin operativo. |
| RF-WFL-064 | Transiciones que requieren aprobación se declaran como tales en la máquina y crean una operación; la tabla de estados define cuáles, el workflow las ejecuta. | BASE §102 (AGR-003 ↔ MER-012) | Núcleo | O1 | Informado | `active → terminated` forzado por supervisor genera la operación `cat.contract.forceStatus`. |
| RF-WFL-065 | Diagrama de solo lectura de cada máquina en la administración (PAN-WFL-05), generado desde la definición. | CNX §4.4 | Estándar | O1 | Adoptado | El diagrama coincide con la definición desplegada. |
| RF-WFL-066 | Reemplazo de `TRANSAC` (códigos 1–8 con efectos al cerrar OT): los efectos por tipo de operación técnica se declaran en la máquina de OT de M10 y en reglas de M02, no en una tabla global. | RN-07 §5; CAT `TRANSAC` | Núcleo | O3 | Reemplazado por RF-WFL-060 | El cierre de una OT de reconexión publica `tec.workOrder.closed` y M02 activa el contrato. |

### 5.5 Workflow configurable de trámites

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-WFL-070 | Diseñador de workflows (PAN-WFL-06) con nodos: inicio, tarea humana, aprobación, acción automática, espera de evento, temporizador, decisión (condición), paralelo y unión, subproceso y fin; validación estructural antes de publicar. | CNX §4.4 Workflows; DFA M3 | Núcleo | O2 | Informado | No se publica un workflow con nodos sin salida o ciclos sin temporizador. |
| RF-WFL-071 | Definiciones versionadas (`workflowVersions`): borrador, en revisión, publicada, retirada; las instancias en curso siguen su versión; la migración de instancias a versión nueva es explícita y auditada. | ARQ-05; AGR-009 | Núcleo | O2 | Adoptado | Publicar v2 no cambia el recorrido de 40 instancias abiertas en v1. |
| RF-WFL-072 | Responsables por rol, área, sucursal, relación con el sujeto (por ejemplo, "responsable de la zona del suministro"), usuario concreto o expresión de fuente de datos; reparto por cola, ronda o menor carga. | BASE §26; RN-07 §6 | Núcleo | O2 | Informado | Una tarea asignada al área "Atención Villa Ficticia" la toma el primer agente libre según PRM-WFL-022. |
| RF-WFL-073 | Acciones tipadas (`actionCatalog`): cada módulo registra comandos invocables desde workflows con esquema de parámetros, permisos del actor técnico, idempotencia y compensación; reemplazan los scripts SQL. | RN-06 §23.3 (`TRAMITES_ACCIONES`); RN-10 §3.5 (procedimiento almacenado) | Núcleo | O2 | Reemplazado por acciones tipadas | Un workflow de tarifa social llama `tar.enrollment.create` con parámetros validados; no existe forma de ejecutar SQL. |
| RF-WFL-074 | Espera de eventos: un nodo puede esperar un evento correlacionado (por ejemplo, `tec.workOrder.closed` de la OT creada en el paso anterior) con timeout. | AGR-016 | Núcleo | O2 | Adoptado | La instancia avanza sola cuando M10 cierra la OT. |
| RF-WFL-075 | Vencimiento del trámite y acciones al vencer (equivalente a `DIAS_VENCE` y acción de vencimiento con marca `ACCIONADO`), ejecutadas una sola vez. | RN-06 §23.3 | Estándar | O2 | Informado | Una constancia de tarifa social vencida dispara una sola vez `tar.enrollment.end`. |
| RF-WFL-076 | Plantillas de workflow de plataforma (semilla §18.3) que el tenant adopta y ajusta dentro de puntos de extensión (responsables, SLA, formularios, textos), sin romper las acciones obligatorias del dominio. | AGR-009; CNX §4.4 | Estándar | O2 | Adoptado (DEC-079; antes "A validar (PA-WFL-04)") | Un tenant no puede quitar el paso "verificar identidad" del workflow de cambio de titularidad. |
| RF-WFL-077 | Instancias con sujeto principal y sujetos relacionados, datos de entrada, formulario, adjuntos, historial de nodos, tareas, comentarios internos y públicos. | CNX §4.4 Solicitudes; BASE §33 | Núcleo | O2 | Informado | El socio ve los comentarios públicos y el estado; no ve las notas internas. |
| RF-WFL-078 | Suspensión y reanudación de instancias (por ejemplo, "esperando documentación del socio") con pausa de SLA. | RN-07 §6 (`ESPERA_CLIENTE`) | Estándar | O2 | Adoptado | El SLA no corre mientras la instancia está en `waitingRequester`. |
| RF-WFL-079 | Reasignación manual y automática de tareas por baja, licencia o suspensión del responsable. | T02 P-IAM-26; EVT-IAM-03; EVT-SUE-08 | Núcleo | O1 | Adoptado | Al suspender a un usuario, sus tareas pasan a su área en menos de 5 minutos. |
| RF-WFL-080 | Iniciación de trámites desde la PWA del socio, el admin, la API interna de módulos o un evento; los trámites habilitados para el socio se publican en "Mis trámites". | CNX `/solicitudes`; FIC 14.1 | Núcleo | O2 | Informado | El socio inicia "Solicitud de tarifa social" desde la PWA y recibe número y constancia. |
| RF-WFL-081 | Simulación de workflow: recorrer una definición en borrador con datos de prueba sin efectos (acciones en modo simulación). | AGR-009 | Estándar | O2 | Adoptado | La simulación muestra el camino y los responsables que resolverían cada tarea. |
| RF-WFL-082 | Indicadores por definición: abiertas, vencidas, tiempo medio por nodo, tasa de rechazo (§15). | BASE §54 | Estándar | O2 | Adoptado | El tablero muestra el cuello de botella del workflow. |

### 5.6 Formularios dinámicos tipados

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-WFL-090 | Diseñador de formularios versionados con tipos de campo: texto corto, texto largo, número entero, número decimal, importe (Decimal128 y moneda), fecha, fecha y hora, selección, selección múltiple, sí/no, referencia a entidad (persona, cuenta, contrato, suministro), domicilio normalizado, punto geográfico, archivo (con tipo documental), firma manuscrita, tabla repetible, campo calculado, CUIT/CUIL/DNI con validación, email y teléfono verificados por código, aceptación de términos con versión. | RN-10 §3.5 (tipos 0, 1, 2, 3, 7, 9); CNX §4.4 | Núcleo | O2 | Informado | Un campo CUIT con dígito verificador inválido no permite enviar. |
| RF-WFL-091 | Validaciones declarativas: obligatoriedad, rangos, longitud, patrón, unicidad dentro del trámite, comparaciones entre campos; validación compartida cliente-servidor generada como esquema Zod. | Guía §5 (Zod) | Núcleo | O2 | Adoptado | La misma regla rechaza en la PWA y en la API. |
| RF-WFL-092 | Visibilidad y obligatoriedad condicional por valor de otros campos, por canal (PWA socio, admin, campo) y por rol; campos que completa solo el operador (equivalente a `REGISTRA_USER`). | RN-10 §3.5 (`VISIBLE`, `REGISTRA_USER`) | Núcleo | O2 | Informado | El socio no ve "Observación de verificación"; el operador sí. |
| RF-WFL-093 | Fuentes de datos tipadas registradas por módulos (por ejemplo, "adherentes del contrato", "categorías del servicio", "sucursales") en lugar de consultas SQL libres. | RN-10 §3.5 (tipo 4 SQL genérica; tipo 9 adherentes) | Núcleo | O2 | Reemplazado por fuentes tipadas | No existe campo que acepte SQL. |
| RF-WFL-094 | Comparación contra fuentes oficiales mediante conectores (por ejemplo, datos de identidad validados), como paso de verificación y no como bloqueo silencioso. | RN-10 §3.5 (`COMPARAR_DOCUMENTO` contra CiDi) | Estándar | O2 | A validar (PA-WFL-20) | Una diferencia queda marcada para el operador con el valor de cada fuente. |
| RF-WFL-095 | Envío del formulario: snapshot inmutable (`formSubmissions`) con la versión del formulario, valores, adjuntos y huella; las correcciones generan una nueva presentación vinculada. | AGR-023 | Núcleo | O2 | Adoptado | Editar un dato después del envío crea la presentación 2 y conserva la 1. |
| RF-WFL-096 | Borradores del socio con vencimiento y aviso previo (coordinado con M19 `JOB-POR-01`). | M19 RF; CNX offline | Estándar | O2 | Adoptado | Un borrador sin actividad 30 días se purga con sus adjuntos no confirmados. |
| RF-WFL-097 | Formularios disponibles offline en la PWA de campo con `clientMutationId` y resolución de conflictos al sincronizar. | CNX §2.7; AGR-025 | Estándar | O3 | Adoptado | Un acta de inspección cargada sin señal se sincroniza una sola vez. |
| RF-WFL-098 | Declaraciones juradas como formularios con aceptación y firma (por ejemplo, DDJJ de artefactos de gas, M02 PAN-CAT-25). | RN-10 §3.5 (DDJJ de artefactos) | Estándar | O7 | Informado | La DDJJ queda como documento firmado en el expediente del contrato. |

### 5.7 SLA, vencimientos y escalamiento

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-WFL-100 | Políticas de SLA (`slaPolicies`) por definición, nodo, tipo de operación o tipo de tarea, en horas o días, hábiles o corridos, con calendario de T04 y horario laboral del área. | BASE §26; AGR-017; T04 | Núcleo | O2 | A validar (PA-WFL-10) | Un SLA de 2 días hábiles iniciado el viernes 17:00 vence el martes 17:00 si el lunes no es feriado. |
| RF-WFL-101 | Umbrales de alerta (por ejemplo, 75 % y 100 %) con acciones: avisar al responsable, avisar al supervisor, reasignar, sumar aprobador, elevar prioridad, expirar o ejecutar una acción tipada. | RN-07 §5 (`RESPONSA_NOTIFICA`); RN-07 §7 | Núcleo | O2 | A validar (PA-WFL-09) | Al 100 % de una aprobación de compra, se agrega el gerente como aprobador alternativo. |
| RF-WFL-102 | Pausa y reanudación de SLA por estados que la declaran (espera del socio, espera de un tercero) con registro del tiempo pausado. | RN-07 §6 (`ESPERA_CLIENTE`) | Núcleo | O2 | Adoptado | El informe muestra tiempo efectivo y tiempo en pausa. |
| RF-WFL-103 | Guardias de escalamiento por día, franja horaria y feriado (quién recibe fuera de horario). | RN-07 §5 (`RESPONSA_NOTIFICA`) | Estándar | O3 | Informado | Un vencimiento el domingo escala a la guardia del domingo. |
| RF-WFL-104 | Recalcular temporizadores al cambiar feriados (`cfg.holiday.changed`) solo para los no vencidos. | EVT-CFG-11 | Estándar | O2 | Adoptado | Agregar un feriado puente corre los vencimientos futuros, no los ya vencidos. |
| RF-WFL-105 | Un solo motor de temporizadores (`slaTimers`) para workflow, tareas y aprobaciones; M09 usa sus propias políticas de SLA de casos sobre el mismo cálculo de calendario (`wfl.calendar.addBusinessTime`). | M09 JOB-CRM-01 | Núcleo | O2 | Adoptado | El cálculo de días hábiles de un caso y de una tarea da el mismo resultado. |

### 5.8 Aprobaciones

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-WFL-110 | Políticas de aprobación (`approvalPolicies`) por tipo de operación o código de política, con versión y vigencia, que resuelven pasos según importe, moneda, área, sucursal, servicio, categoría, riesgo y atributos del sujeto. | BASE §29; MER-012; M12 RF-CMP-052 | Núcleo | O1 | Informado | Con tramo "≥ ARS 500.000 requiere gerencia", una OC de ARS 600.000 suma el paso de gerencia. |
| RF-WFL-111 | Modalidades: simple (un aprobador), secuencial multinivel, paralela todos, paralela N de M (quórum), comité con votación, doble firma (dos personas distintas) y firma conjunta (firmantes vigentes de un registro). | RN-08 §7.2 (`DOBLE_AUTO`); FIC 15 (`PPAGOS_FIRMANTES`); DFA M7 | Núcleo | O1 | Informado | Una OP de ARS 3.000.000 exige 2 de los 3 firmantes vigentes. |
| RF-WFL-112 | Separación de funciones dinámica: el solicitante nunca aprueba su solicitud; una persona no aprueba dos pasos de la misma solicitud; reglas de SoD de T02 (por ejemplo, quien registra el CBU no aprueba el pago). | DFA M1 ("quien crea no puede aprobar"); T02 `sodRules`; M12 RN-CMP-007 | Núcleo | O1 | Informado | El servidor rechaza con 403 `wfl/sod-violation` la aprobación del solicitante, aun con permiso. |
| RF-WFL-113 | Prohibición de autoaprobación implícita: ninguna acción de proceso (por ejemplo, "procesar ítem de solicitud") aprueba por efecto secundario; la política "sin aprobación" es explícita, versionada y auditada. | RN-08 §7.2 (autoaprobación con `autoriz_sa` y P2640); CTR-CMP-06 | Núcleo | O1 | Adoptado | Con política "sin aprobación hasta ARS 50.000", el registro muestra la regla aplicada. |
| RF-WFL-114 | Límites de importe del aprobador desde su asignación de rol (T02, marca $) validados al decidir. | T02 RF-IAM; BASE §29 | Núcleo | O1 | Adoptado | Un aprobador con límite ARS 200.000 no puede aprobar ARS 250.000; se escala. |
| RF-WFL-115 | Decisión con comentario (obligatorio al rechazar y configurable al aprobar), adjuntos de evidencia y autenticación reforzada (MFA reciente) en tipos sensibles. | T02 marca S; BASE §54 | Núcleo | O1 | Adoptado | Rechazar sin motivo devuelve 422. |
| RF-WFL-116 | Aprobación ligada al **contenido**: la solicitud guarda una huella (hash de importe, destino y parámetros relevantes); si cambia, las aprobaciones previas caducan. | T02 RN-IAM-043 (mismo principio) | Núcleo | O1 | Adoptado | Cambiar el CBU de una OP aprobada exige aprobarla de nuevo. |
| RF-WFL-117 | Aprobación diferida multipaso desde la bandeja (web y PWA del empleado con push de T09), incluida la decisión masiva de solicitudes homogéneas con validación por ítem. | RN-08 (autorización masiva SAPROV); M12 JOB-CMP-08 | Núcleo | O1 | Informado | Aprobar 15 solicitudes en bloque deja 15 decisiones individuales auditadas. |
| RF-WFL-118 | Delegación temporal (`delegations`) con desde/hasta, alcance (tipos, áreas, límite de importe ≤ al del delegante), motivo; el delegado decide en nombre propio "por delegación de". | Pedido T11; BASE §29 | Estándar | O1 | A validar (PA-WFL-08) | Una delegación vencida no permite decidir; la decisión muestra ambos nombres. |
| RF-WFL-119 | Vencimiento y escalamiento de pasos (RF-WFL-101); al expirar la solicitud, la operación pasa a `expired` y el solicitante es notificado. | MER-012 (plazo) | Núcleo | O1 | Adoptado | Una solicitud no decidida en 5 días hábiles expira. |
| RF-WFL-120 | Retiro de la solicitud por el solicitante mientras ningún paso fue decidido, o con motivo si ya hubo decisiones parciales. | MER-012 | Estándar | O1 | Adoptado | Retirar tras la primera aprobación exige motivo. |
| RF-WFL-121 | Co-autorización presencial (supervisor que se autentica en el mismo dispositivo) y autorización puntual diferida de un paso: se resuelven en T02 (`authorizationRequests`); T11 las muestra en la bandeja y no las duplica. | RN-09 §4.2 (`ShowLogin`, `AUTORIZACIONES`); T02 RF-IAM-092/093 | Núcleo | O1 | Adoptado | Una autorización de T02 pendiente aparece en la bandeja del supervisor con origen "Autorización puntual". |
| RF-WFL-122 | Votación de comité (consejo): quórum, mayoría, abstención, voto registrado y acta generada con plantilla. | DFA M24; M17 | Estándar | O10 | Adoptado | Una resolución con 4 de 7 votos favorables y quórum 5 se aprueba y queda en el acta. |
| RF-WFL-123 | Evidencia de cada decisión: aprobador, delegante, fecha, método de autenticación, huella de contenido, versión de la política aplicada y comentario. | BASE §54; MER-012 (auditado) | Núcleo | O1 | Informado | La auditoría muestra la versión de política vigente al decidir. |
| RF-WFL-124 | Simulador de política: dado un tipo, importe y atributos, muestra quiénes aprobarían y en qué orden. | AGR-009 | Estándar | O1 | Adoptado | El administrador verifica la política antes de publicarla. |

### 5.9 Bandeja unificada del empleado

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-WFL-130 | Bandeja única (`workItems`) que proyecta: tareas de T11, pasos de aprobación, autorizaciones puntuales de T02, casos de M09 asignados, OT y visitas de M10 asignadas, excepciones de lote, operaciones detenidas, conflictos de sincronización, ocurrencias de actividades de M09, documentos por firmar y tareas de revisión de otros módulos. | BASE §26; MER-012 (bandeja única); CNX `/aprobaciones` | Núcleo | O1 | A validar (PA-WFL-15) | Un supervisor ve en una sola lista 3 aprobaciones, 5 casos y 2 excepciones. |
| RF-WFL-131 | Agrupación por vencimiento: Vencidos, Hoy, Mañana, Próximos 7 días, Futuro, Sin fecha; orden por prioridad y vencimiento. | RN-07 §6 (agrupación de tickets) | Núcleo | O1 | Informado | Un ítem vencido ayer aparece primero en "Vencidos". |
| RF-WFL-132 | Prioridad normalizada en la escala 0, 1, 25, 50, 75, 100 (ninguna, baja, media, alta, urgente, crítica) heredada de la fuente o calculada por SLA. | RN-07 §6 (gravedad) | Estándar | O1 | Adoptado | Una aprobación al 100 % de SLA sube a 75. |
| RF-WFL-133 | Filtros: tipo, módulo, estado, prioridad, área, sujeto, vencimiento; vistas guardadas; contador por grupo en tiempo real. | CNX DataTable | Núcleo | O1 | Adoptado | El contador se actualiza al decidir sin recargar. |
| RF-WFL-134 | Tomar un ítem de cola (exclusivo, con límite configurable de ítems tomados en simultáneo) y liberarlo. | RN-07 §6 (un ticket "tomado" por usuario) | Estándar | O1 | Adoptado | Con límite 1, tomar un segundo ítem pide liberar el primero. |
| RF-WFL-135 | Acciones en línea según tipo: aprobar, rechazar, completar, abrir, reasignar, posponer (con fecha), comentar. | CNX §4.4 | Núcleo | O1 | Adoptado | Aprobar desde la tarjeta exige el mismo MFA que desde el detalle. |
| RF-WFL-136 | Vista de supervisión: carga por persona, vencidos por área, reasignación masiva. | BASE §26 | Estándar | O1 | Adoptado | Reasignar 20 ítems de un agente de licencia a otro en una acción. |
| RF-WFL-137 | Bandeja en PWA del empleado con tarjetas CNX, FAB "+" para crear tarea y push de T09. | CNX §3; DFA M20 | Núcleo | O2 | Informado | La tarjeta muestra tipo, sujeto, vencimiento y acción principal. |
| RF-WFL-138 | Tareas ad hoc: crear, asignar a persona o área, vencimiento, recurrencia (RRULE), checklist, evidencias obligatorias al completar, comentarios con menciones y vínculo a cualquier entidad. | BASE §26 (TAR-001, responsables, recurrencias, evidencias) | Núcleo | O1 | Informado | TAR-001 "Revisar padrón de tarifa social" mensual exige adjuntar el informe al completar. |
| RF-WFL-139 | Reemplazo del correo interno `PROMAIL` por comentarios en tareas y casos con menciones y notificación T09. | RN-10 §16.3 (`PROMAIL`) | Estándar | O1 | A validar (PA-WFL-17) | No existe "correo interno"; una mención crea notificación. |

### 5.10 Agenda y calendario

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-WFL-140 | Agenda unificada del empleado (`agendaEntries`, proyección) con vistas día, semana, mes y lista: citas del calendario interno de M09, visitas de M10, turnos reservados de M09, reuniones y asambleas de M17, licencias de M16, vencimientos de tareas y aprobaciones de T11, feriados de T04. | RN-10 §16.3; DFA M2; CNX `/agenda` | Estándar | O2 | A validar (PA-WFL-07) | Un técnico ve sus visitas y su licencia aprobada en la misma semana. |
| RF-WFL-141 | Recurrencias RRULE con excepciones y edición "solo esta / esta y siguientes / todas". | RN-10 §16.3 (`INFO_RECUR`) | Estándar | O2 | Mejorar | Editar "esta y siguientes" divide la serie sin perder las anteriores. |
| RF-WFL-142 | Eventos de todo el día con fin exclusivo correcto y búsqueda por asunto. | RN-10 §16.3 (bug de fin de eventos de todo el día y búsqueda por asunto) | Estándar | O2 | Mejorar (corrige bug) | Un evento de todo el día del 10-11-2026 no aparece el 11-11-2026. |
| RF-WFL-143 | Agenda de equipo según alcance (área, cuadrilla) con disponibilidad para coordinar. | DFA M22 | Estándar | O2 | Adoptado | El supervisor ve la ocupación de su cuadrilla. |
| RF-WFL-144 | Feed iCal privado de solo lectura por usuario con token revocable, sin datos personales de socios en el título. | Pedido T11 | Extensión | O2 | A validar (PA-WFL-16) | Revocar el token deja de servir el feed en 5 minutos. |
| RF-WFL-145 | Eliminación de eventos propios; los de otros solo con permiso del dueño del calendario (M09). | RN-10 §16.3 (`EliminarEventosCalendario`) | Estándar | O2 | Replicar | Sin permiso, el botón eliminar no está y la API devuelve 403. |

### 5.11 Gestión documental

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-WFL-150 | Repositorio privado por tenant: todo archivo de negocio se registra como `document` con versiones sobre `storedFiles` de T01 (clave `tenants/<tenantId>/...`), nunca servido por estático público. | CNX §10 V-01; FIC 21; T01 RF-PLA-012/025 | Núcleo | O0 | Informado | Pedir un documento de TEN-001 con sesión de TEN-002 devuelve 404. |
| RF-WFL-151 | Subida en dos pasos con URL prefirmada, verificación de tipo real, tamaño máximo, antivirus (JOB-PLA-21), hash SHA-256 y miniatura; el documento queda `available` solo con `scanStatus = clean`. | T01 RN-PLA-031; BASE §97.8 | Núcleo | O0 | Adoptado | Un archivo infectado queda `quarantined` y no se puede descargar. |
| RF-WFL-152 | Tipos documentales (`documentTypes`) con código, nombre (diccionario), sujetos admitidos, extensiones, tamaño, sensibilidad (`internal`, `personal`, `restricted`, `health`, `fiscal`), retención, visibilidad para el socio, obligatoriedad por trámite y si exige versión aceptada. | RN-10 §16.2 (`ADJUNTOS.TIPO`); AGR-023 | Núcleo | O0 | Informado | El tipo "Constancia de CUIT" acepta PDF/JPG hasta 10 MB y es visible para el socio. |
| RF-WFL-153 | Versionado inmutable: nunca se sobrescribe un archivo; cada reemplazo crea versión nueva; la versión aceptada queda fijada a los actos que la usaron. | AGR-023; M09 RN-CRM-028 | Núcleo | O0 | Adoptado | Subir una constancia nueva no cambia la que se usó para aprobar el beneficio en marzo. |
| RF-WFL-154 | Vínculos múltiples (`documentLinks`): un documento se asocia a uno o varios sujetos (persona, cuenta, contrato, suministro, caso, OT, factura, OP, asamblea) con rol del vínculo. | BASE §33 (adjunto de caso); CAT `RELACION_ENTIDADES` | Núcleo | O0 | Informado | El DNI del titular vinculado a persona y al trámite de alta aparece en ambos expedientes. |
| RF-WFL-155 | Metadatos tipados por tipo documental (fecha de emisión, vencimiento, emisor, número, importe) con búsqueda; extracción asistida por IA solo como propuesta. | ARQ-08; CNX (IA solo propone) | Estándar | O2 | Adoptado | La IA propone el vencimiento de un seguro; el operador lo confirma. |
| RF-WFL-156 | Vencimiento de documentos con aviso previo y efecto configurable por el módulo dueño (por ejemplo, documentación del proveedor vencida bloquea nuevas OC). | M12 RF-CMP-013; M01 JOB-PER-04 | Estándar | O2 | Adoptado | Un evento `wfl.document.expired` llega a M12. |
| RF-WFL-157 | Descarga con URL firmada de vida corta tras verificar permiso del objeto dueño; registro de cada acceso (`documentAccessLogs`) para documentos `personal`, `restricted`, `health` y `fiscal`. | T01 §7.7; BASE §97.1 | Núcleo | O0 | Adoptado | La auditoría muestra quién descargó un recibo de sueldo. |
| RF-WFL-158 | Enlaces compartidos con token, vencimiento, límite de descargas, contraseña opcional y revocación inmediata. | AGR-023 (enlaces revocables); FIC 14.1 ("Archivos en la Web") | Estándar | O2 | Adoptado | Revocar un enlace deja de servir el archivo en la siguiente solicitud. |
| RF-WFL-159 | Borrado lógico con motivo; nunca borrado físico por el usuario; la purga física solo por retención cumplida sin legal hold, con certificado de purga. | RN-10 §16.2 (borrado físico, huérfanos); BASE §97.1 | Núcleo | O0 | Reemplazado por borrado lógico y retención | Anular un adjunto lo oculta pero se conserva hasta el fin de retención. |
| RF-WFL-160 | Políticas de retención por tipo documental y categoría (fiscal, laboral, contractual, atención, salud), configurables por tenant dentro de mínimos de plataforma; sin inventar plazos: las de plataforma se cargan como `A validar` hasta confirmación legal. | AGR-023 (no inventar plazos); BASE §97.1 | Núcleo | O1 | A validar (PA-WFL-03) | Un documento fiscal no se purga antes de su plazo mínimo de plataforma. |
| RF-WFL-161 | Legal hold por sujeto, expediente o documento, con motivo, responsable y fecha; bloquea la purga y la anulación. | AGR-023 | Estándar | O1 | Adoptado | Con hold activo, la anulación devuelve 409 `wfl/legal-hold`. |
| RF-WFL-162 | Visibilidad para el socio: solo tipos marcados visibles y versiones aceptadas o emitidas; los internos nunca se exponen. | AGR-023; M19 | Núcleo | O2 | A validar (PA-WFL-11) | En "Mis documentos" no aparece la nota interna del verificador. |
| RF-WFL-163 | Importación de adjuntos de ProCoop (`ADJUNTOS`, `PROCOOPAR_ADJUNTOS`, carpetas) con hash, tipo mapeado y vínculo; los huérfanos se informan. | RN-10 §16.2; T07 JOB-MIG-16 | Estándar | O11 | Adoptado | La conciliación informa cantidad y hash por tipo y lista de archivos sin registro. |
| RF-WFL-164 | Adjuntar múltiples PDF y combinarlos en un único documento cuando el trámite lo pide. | INV `frmAdjuntarPdfs` | Extensión | O2 | Adoptado | Tres PDF se combinan en uno con índice. |

### 5.12 Plantillas de documentos y generación de PDF

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-WFL-170 | Plantillas versionadas (`documentTemplates`, `templateVersions`) por tipo documental con HTML restringido, CSS de impresión, encabezado y pie, marca del tenant (T03) y variables. | DFA M21 (`PLANTILLA`, `VARIABLEPLANT`); maestro (HTML → PDF) | Núcleo | O0 | Informado | La factura de TEN-001 muestra su logo y paleta. |
| RF-WFL-171 | Lenguaje de plantilla sin lógica arbitraria (Handlebars restringido) con ayudantes: `formatMoney`, `formatDate` (zona del tenant, dd-mm-yyyy), `dict`, `qr`, `barcode` (Interleaved 2 of 5 y Code 128), `numberToWords`, `pluralize`, `if`/`each` sobre el contrato. | Guía §5; M05 (QR, código de barras) | Núcleo | O0 | Adoptado | Una plantilla que intenta acceder a una variable fuera del contrato falla al publicar. |
| RF-WFL-172 | Contrato de datos tipado provisto por el módulo dueño (Zod) y catálogo de variables generado del contrato, con descripción y ejemplo. | `VARIABLEPLANT`; ARQ-01 | Núcleo | O0 | Reemplazado por contrato tipado | El editor autocompleta variables del contrato de "Recibo". |
| RF-WFL-173 | Editor con vista previa con datos de ejemplo y datos reales (con permiso), comparación entre versiones y prueba de impresión. | INV `frmPlantillaEditor` | Estándar | O1 | Replicar | La vista previa muestra el recibo de prueba en A4 y en ticket 80 mm. |
| RF-WFL-174 | Publicación con aprobación para plantillas de documentos fiscales y legales (factura, NC, ND, recibo, intimación, contrato, acta). | BASE §97.2; MER-012 | Núcleo | O4 | Adoptado | Publicar la plantilla de factura sin aprobación devuelve 409. |
| RF-WFL-175 | Render HTML → PDF en worker (cola `interactive` para uno, `batch` para lotes) con fuentes embebidas, PDF/A-2b para documentos de archivo, tamaños A4, Carta, Oficio y ticket. | Maestro (motor PDF); FIC 21 | Núcleo | O0 | Adoptado (DEC-080; antes "A validar (PA-WFL-05)") | El PDF de factura valida como PDF/A-2b. |
| RF-WFL-176 | Inmutabilidad del emitido: el PDF de un documento emitido se genera una vez, se guarda con hash y se sirve siempre el mismo; regenerar crea una "reimpresión" marcada, nunca reemplaza. | BASE §97.2; AGR-023 | Núcleo | O4 | Adoptado | Cambiar la plantilla no altera facturas ya emitidas. |
| RF-WFL-177 | Copias (original, duplicado, triplicado), marcas de agua (BORRADOR, ANULADO, COPIA, SIMULACIÓN) y talones desprendibles. | M05 (talones); RN-04 | Estándar | O4 | Adoptado | Un comprobante anulado se descarga con marca "ANULADO". |
| RF-WFL-178 | Generación masiva para lotes (facturas, intimaciones, recibos de sueldo, credenciales) con idempotencia por (`subjectId`, `templateVersion`) y unión opcional en un PDF para impresión. | M05 JOB-FAC-04; M08; M16 JOB-SUE-03 | Núcleo | O4 | Adoptado | Reintentar el lote no duplica PDF. |
| RF-WFL-179 | Plantillas semilla de plataforma (§18.4, 46 plantillas) que el tenant adopta y personaliza en zonas editables. | DFA M21; BASE §26 | Estándar | O0 | Adoptado | El tenant edita el pie y el texto legal sin tocar el bloque fiscal. |
| RF-WFL-180 | Reemplazo de plantillas Word de actividades y de circulares (`CIRCULAR`) por plantillas HTML con salida PDF o DOCX opcional. | RN-07 §7 (plantilla Word); CAT `CIRCULAR` | Estándar | O10 | Reemplazado por RF-WFL-170 | La circular de asamblea se genera en PDF por destinatario. |

### 5.13 Numeración de documentos

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-WFL-185 | Secuencias (`numberingSequences`) con código, alcance (tenant, sucursal, punto de venta, tipo de documento, servicio, año o mes), máscara (`{PREFIX}-{YYYY}-{N:6}`), valor inicial, salto, máximo y reinicio por período. | CAT `CLAS_INC.ULT_NUM`, `PTOVENTA`, `COMPPOS`; INV `frmSelectNumero` | Núcleo | O0 | Informado | El expediente de mesa de entradas toma `ME-2026-000045`. |
| RF-WFL-186 | Obtención atómica dentro de la transacción del llamador (incremento atómico en Mongo); si la transacción aborta, el número no se consume en secuencias "sin huecos". | BASE §97.2; AGR-016 | Núcleo | O0 | Adoptado | 50 emisiones concurrentes no repiten ni saltean números en una secuencia `gapless`. |
| RF-WFL-187 | Políticas de huecos: `gapless` (comprobantes, recibos, actas, expedientes formales), `allowGaps` (tareas, operaciones, constancias internas) y `external` (número asignado por un tercero, por ejemplo CAEA). | BASE §97.2 | Núcleo | O0 | A validar (PA-WFL-13) | Una secuencia `allowGaps` no toma bloqueo de transacción. |
| RF-WFL-188 | Anulación trazable: un número asignado a un documento anulado queda `voided` con motivo; nunca se reutiliza. | BASE §97.2 | Núcleo | O0 | Adoptado | El libro de numeración muestra el 000046 anulado. |
| RF-WFL-189 | Numeración fiscal: M05 usa secuencias por punto de venta y tipo de comprobante con política `gapless` y sincronización con el último autorizado de ARCA (M06); T11 no decide correlatividad fiscal. | M05; M06 JOB-FIS-09 | Núcleo | O4 | Adoptado | Si ARCA informa último 1.234 y la secuencia está en 1.230, M06 bloquea la emisión hasta conciliar. |
| RF-WFL-190 | Ajuste manual de secuencia solo con operación aprobada (`wfl.sequence.adjust`) y motivo. | BASE §97.2; MER-012 | Estándar | O1 | Adoptado | Saltar el próximo número a 2.000 exige aprobación de T-ADM y T-CON. |
| RF-WFL-191 | Alerta de secuencia cercana al máximo o rango asignado por terceros a punto de agotarse. | DFA M8 | Estándar | O4 | Adoptado | Al 90 % del máximo se emite `wfl.sequence.thresholdReached`. |

### 5.14 Firma

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-WFL-195 | Tres niveles de firma en `signatureProfiles`: **manuscrita digitalizada** (conformidad), **electrónica** (art. 5 Ley 25.506) y **digital** (art. 2, certificador licenciado). | BASE §73; FIC 15; DFA M1 | Núcleo | O3 | Informado | El perfil "Conformidad de instalación" es manuscrita; "Recibo de sueldo" es electrónica; "OP conjunta" puede ser digital. |
| RF-WFL-196 | Firma manuscrita digitalizada con evidencias: imagen del trazo, hash del documento firmado, fecha y hora, geolocalización si se autoriza, dispositivo, identificación declarada (nombre y DNI) y foto opcional; declarada como conformidad, no como firma digital. | BASE §73; DFA M14; M10 EVT-TEC-15 | Núcleo | O3 | Informado | La constancia de conformidad muestra "Conformidad con firma manuscrita digitalizada". |
| RF-WFL-197 | Firma electrónica propia: firmante autenticado en CoopApps con segundo factor (OTP por SMS, email o app), aceptación del texto, hash SHA-256 del PDF, sello de tiempo del servidor y constancia anexa con datos de verificación. | FIC 15 (`EnviarSmsFirmados`); DFA M20 | Núcleo | O9 | Adoptado | Un recibo de sueldo firmado muestra en la constancia el hash y el código de verificación. |
| RF-WFL-198 | Firma digital mediante conector T06 (proveedor licenciado) en PAdES con posición de firma, estado y descarga del firmado. | FIC 15 (`clsFirmaDigital`: enviar, estado, documentos firmados); CAT `FIRMASDIGITALES` | Estándar | O8 | A validar (PA-WFL-06) | `int.signature.completed` deja la versión firmada como aceptada. |
| RF-WFL-199 | Varios firmantes en orden o en paralelo, firmantes por rol o registro de firmantes vigentes (por ejemplo, apoderados bancarios), con vencimiento y recordatorios. | FIC 15 (`PPAGOS_FIRMANTES`, `FIRMAS`); M14 | Núcleo | O8 | Informado | Una OP con firma conjunta queda `partiallySigned` hasta el segundo firmante. |
| RF-WFL-200 | Ubicación de la firma en el PDF por coordenadas o marcador en la plantilla. | INV `frmUbicacionFirma` | Estándar | O8 | Replicar | La firma aparece en el recuadro definido. |
| RF-WFL-201 | Verificación pública de documentos firmados o emitidos por código o QR (`/api/public/<slug>/verify/:code`) que muestra tipo, fecha, emisor y hash, sin datos personales. | BASE §52.3 (código de verificación) | Estándar | O2 | Adoptado | Un tercero valida un libre deuda escaneando el QR. |
| RF-WFL-202 | Rechazo de firma con motivo y nueva versión del documento si corresponde. | M16 EVT-SUE-15 | Estándar | O9 | Adoptado | Un empleado que no acepta su recibo deja `signatureRejected` con motivo y RRHH recibe la tarea. |

### 5.15 Expediente digital

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-WFL-210 | Expediente por sujeto: persona, titular, cuenta, suministro/punto de servicio, contrato, inmueble, empleado, proveedor, asociado, asamblea, caso, OT; jerarquía navegable persona → titular → cuenta → contrato → punto. | AGR-023; BASE §33; DFA M3 | Núcleo | O1 | Informado | Desde la persona se ven los documentos de sus cuentas y contratos. |
| RF-WFL-211 | Línea de tiempo del expediente que combina documentos, eventos de dominio relevantes (marcados `timeline`), operaciones, aprobaciones, trámites, comunicaciones (resumen T09) y notas, con filtros. | BASE §16; AGR-023 | Núcleo | O1 | Adoptado | La línea de tiempo de la cuenta muestra alta, facturas, pagos, intimación y convenio. |
| RF-WFL-212 | Expediente formal numerado (`dossiers`) con carátula, tipo, estado (abierto, en trámite, cerrado, archivado), responsable, foliatura opcional e índice. | CAT `EXPEDIENTES`, `EXPEDIENTES_TRAM`; MER-016 | Estándar | O10 | A validar (PA-WFL-07) | El expediente ME-2026-000045 tiene carátula y 12 folios. |
| RF-WFL-213 | Exportación de expediente (ZIP con PDF índice y documentos, o PDF unificado) como job con permiso `wfl.expedientes.exportar`, auditoría y vencimiento del archivo. | AGR-023; BASE §97.1 (derecho de acceso) | Estándar | O1 | Adoptado | La exportación queda registrada con usuario, motivo y contenido. |
| RF-WFL-214 | "Mis documentos" en la PWA del socio y del empleado con documentos visibles por tipo y por cuenta. | CNX `/docs`; FIC 14.1; DFA M20 | Núcleo | O2 | Informado | El socio descarga su última factura y su contrato firmado. |
| RF-WFL-215 | Documentos obligatorios por trámite y sujeto (checklist) con estado presentado, validado, vencido, faltante. | M01 RF (documentación); BASE §15 | Núcleo | O2 | Informado | El alta de servicio muestra "Falta: constancia de domicilio". |

### 5.16 Mesa de entradas (coordinación con M09)

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RF-WFL-220 | M09 registra la mesa de entradas como caso `kind = deskEntry`; T11 aporta la secuencia del registro (`ME-{YYYY}-{N:6}`), el expediente formal, la plantilla de acuse y la carátula, y el workflow de pases internos. | MER-016; DFA M21; M09 §7 | Estándar | O10 | A validar (PA-WFL-07) | Registrar una nota del ente regulador entrega acuse numerado y abre expediente. |
| RF-WFL-221 | Pases entre áreas con acuse de recepción del área destino, plazo de respuesta en días hábiles y salida (respuesta) vinculada con su propio número. | MER-016; M09 `deskEntry.transfers` | Estándar | O10 | Adoptado | Un pase no acusado en 1 día hábil escala al jefe del área. |
| RF-WFL-222 | Digitalización de la documentación recibida como documentos del expediente con tipo y folios. | DFA M21 | Estándar | O10 | Adoptado | El escaneo queda como versión aceptada con hash. |

### 5.17 Requisitos no funcionales propios

| ID | Requisito | Origen | Prioridad | Ola | Estado | Criterio de aceptación |
|---|---|---|---|---|---|---|
| RNF-WFL-001 | Latencia de publicación a consumo p95 ≤ 5 s en condiciones normales (lag de outbox alertado por T01 a 60 s). | BASE §97.8; T01 PRM-PLA-030 | Núcleo | O0 | Adoptado | Prueba de carga con 200 eventos/s. |
| RNF-WFL-002 | Render de un PDF individual p95 ≤ 3 s; lote de 10.000 facturas ≤ 60 min con 4 workers por tenant. | BASE §97.8 | Núcleo | O4 | Adoptado | Prueba con lote ficticio. |
| RNF-WFL-003 | Bandeja: carga inicial ≤ 1 s con hasta 500 ítems; actualización por evento ≤ 3 s. | CNX | Estándar | O1 | Adoptado | Prueba con usuario de 500 ítems. |
| RNF-WFL-004 | Aislamiento por tenant en eventos, jobs, documentos, plantillas, numeración y proyecciones (prefijo `tenantId` en todo índice; pruebas cruzadas). | DEC-002; ARQ-04 | Núcleo | O0 | Informado | Suite de aislamiento §17.2. |
| RNF-WFL-005 | Ningún secreto en payloads, `lastError`, plantillas ni metadatos documentales. | BASE §97.1; T06 | Núcleo | O0 | Adoptado | Escáner de CI de patrones de secretos sobre esquemas y fixtures. |

## 6. Reglas de negocio

### 6.1 Eventos y jobs

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-WFL-001 | Un evento se publica solo si la transacción del cambio confirma; nunca se publica "antes" ni "por las dudas". | Avisos por `TRANSAC.ENVIO_SMS` y mails disparados dentro del proceso aunque falle (RN-07 §5; RN-10 §2). | Reemplazar | — | — |
| RN-WFL-002 | Los eventos son inmutables; una corrección se expresa con un evento nuevo (`.corrected`, `.reversed`, `.voided`), nunca editando el anterior. | — | Nueva (AGR-016) | — | — |
| RN-WFL-003 | Un consumidor no escribe colecciones de otro módulo: si necesita un efecto ajeno, invoca un comando de `index.js` del dueño. | Procedimientos que actualizan tablas de varios módulos (RN-06 §23.3). | Reemplazar (ARQ-01) | — | — |
| RN-WFL-004 | Un consumidor que falla `PRM-PLA-027` veces envía el evento a `deadLetters` (T01); si el tipo está marcado `businessImpact`, se crea además un ítem de bandeja operativa para el rol responsable declarado en el catálogo. | Errores a `LogProcoop.txt` y mail (RN-09 §4.3). | Reemplazar | PRM-PLA-027, PRM-WFL-005 | — |
| RN-WFL-005 | Los payloads `public` no contienen datos personales; los `internal` solo los imprescindibles y declarados en el esquema con `piiLevel`. | — | Nueva (BASE §97.1) | — | — |
| RN-WFL-006 | Un evento con `schemaVersion` no soportada por el consumidor se rechaza a la bandeja operativa; no se interpreta "lo que se pueda". | — | Nueva | — | — |
| RN-WFL-007 | Un job programado no corre fuera de su ventana: si el disparo cae fuera (por ejemplo, tras una caída), se ejecuta al abrirse la próxima ventana o se omite si `skipIfMissed`. | Servicio de Windows que corría al reiniciar sin control (FIC 22). | Reemplazar | PRM-WFL-007 | — |
| RN-WFL-008 | Dos ejecuciones del mismo job con la misma clave de negocio no corren en paralelo para un tenant (clave única parcial de `jobRuns`). | Procesos lanzados dos veces desde dos PC (FIC 22). | Reemplazar | — | — |
| RN-WFL-009 | Un tenant suspendido o en mantenimiento no ejecuta jobs programados; los jobs en curso pausan en el próximo punto de control. | — | Nueva (EVT-PLA-03) | — | — |
| RN-WFL-010 | Las corridas masivas congelan su universo al prepararse; cambios posteriores del universo no entran salvo nueva versión del universo. | Lotes que leían datos vivos durante la emisión (RN-04). | Mejorar (BASE §69) | — | — |
| RN-WFL-011 | Una corrida con más de `PRM-WFL-008` % de excepciones del mismo motivo en los primeros `PRM-WFL-009` ítems se pausa por sospecha de fallo global. | — | Nueva (BASE §69 LOT-003) | PRM-WFL-008, PRM-WFL-009 | — |
| RN-WFL-012 | La programación de jobs se expresa siempre en hora local del tenant y se guarda con su zona; los cambios de horario oficial no desplazan la hora local de ejecución. | `setInterval` de Connectia sin zona; Timer de servicio Windows. | Reemplazar (AGR-017) | — | — |

### 6.2 Operaciones

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-WFL-020 | Una operación sensible no produce efecto alguno antes de su aprobación; las lecturas pueden mostrar la intención como marca. | Autorizaciones que se pedían después de aplicar el cambio en algunos formularios (RN-09 §4.2). | Mejorar (MER-012) | — | [VERIFICAR] en INV qué formularios aplicaban antes de autorizar |
| RN-WFL-021 | Una operación aprobada se ejecuta una sola vez: la clave de idempotencia es `operationId` y el módulo dueño la registra en su efecto. | — | Nueva (AGR-016) | — | — |
| RN-WFL-022 | El resultado de una operación con efecto externo desconocido es `uncertain`; no se reintenta el envío sin consultar antes. | Reintentos manuales de pagos y ARCA sin consulta (DFA M8). | Reemplazar (AGR §5.5) | PRM-WFL-012 | — |
| RN-WFL-023 | Una operación en lote se aprueba como unidad, pero se ejecuta y responde por ítem; un ítem fallido no revierte los exitosos salvo que el tipo declare atomicidad de lote. | Autorización masiva de SAPROV (RN-08 §7.2). | Mejorar | — | — |
| RN-WFL-024 | Toda operación revalida las precondiciones del dominio al ejecutar; si no se cumplen, falla sin efecto parcial. | — | Nueva (AGR-003) | — | — |
| RN-WFL-025 | Una operación aprobada que no se ejecuta en `PRM-WFL-011` horas exige revalidación de la aprobación (los aprobadores la confirman en un clic con la misma huella). | — | Nueva | PRM-WFL-011 | — |
| RN-WFL-026 | Una operación revertida no se borra: la reversión es otra operación vinculada (`reversesOperationId`). | Anulaciones que borraban registros (RN-10 §16.2). | Reemplazar | — | — |
| RN-WFL-027 | Los pasos de una saga se compensan en orden inverso solo si el tipo lo declara; si un paso no es compensable, la operación queda `failed` en bandeja operativa con el detalle de lo ya aplicado. | — | Nueva (AGR-016) | — | — |

### 6.3 Estados y workflow

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-WFL-030 | No hay edición libre de estado: cada cambio es una transición declarada con actor, guarda y efecto. | Cambio directo de `ESTADO` en grillas; bandera `VUELVE` para volver atrás (RN-07 §6). | Reemplazar (AGR-003) | — | — |
| RN-WFL-031 | La reversión de una transición es otra transición declarada (con su permiso), nunca un "deshacer" que borra historia. | `VUELVE` sin traza (RN-07 §6). | Mejorar | — | — |
| RN-WFL-032 | Un estado operativo siempre mapea a un único estado canónico; los efectos dependen del canónico, no del nombre configurable. | `TICKETS_ESTADOS` mapeados a base 1–4 (RN-07 §6). | Replicar | — | — |
| RN-WFL-033 | Las instancias en curso conservan su versión de workflow; migrar instancias exige operación `wfl.instances.migrate` con mapa de nodos. | — | Nueva (ARQ-05) | — | — |
| RN-WFL-034 | Las acciones automáticas de workflow ejecutan comandos con la identidad técnica del módulo y el `actor` iniciador en el contexto; nunca SQL ni código provisto por el tenant. | Scripts SQL en `TRAMITES_ACCIONES` y procedimiento almacenado con nombre derivado de la descripción (RN-06 §23.3; RN-10 §3.5). | Reemplazar | — | — |
| RN-WFL-035 | La acción de vencimiento de un trámite se ejecuta exactamente una vez (marca de ejecución con idempotencia). | Marca `ACCIONADO` (RN-06 §23.3). | Replicar | — | — |
| RN-WFL-036 | Un trámite iniciado por el socio no puede pedir datos que el sistema ya tiene validados; los muestra precargados con opción de "informar cambio". | `REQUISITOS_ITEMS` pedía datos existentes. | Mejorar | — | — |
| RN-WFL-037 | Una tarea asignada a una persona que pierde el acceso (baja, suspensión, licencia aprobada) vuelve a la cola de su área en el mismo minuto, con aviso al supervisor. | Tareas huérfanas de usuarios dados de baja. | Nueva (EVT-IAM-03, EVT-SUE-03, EVT-SUE-08) | — | — |
| RN-WFL-038 | El SLA se calcula con el calendario del área responsable (T04) y la zona del tenant; los feriados regionales aplican según la sucursal del área. | `DIAS_VENCE` en días corridos (RN-06 §23.3). | Mejorar | PRM-WFL-020 | — |
| RN-WFL-039 | Las ocurrencias recurrentes que vencen se cuentan "en término" o "fuera de término" según su fecha de cierre real contra el vencimiento; los filtros usan esa clasificación sin invertirla. | Filtros invertidos de "Cerrada en término / fuera de término" (RN-07 §7). | Mejorar (corrige bug) | — | — |

### 6.4 Aprobaciones

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-WFL-040 | El solicitante nunca aprueba su solicitud, aunque tenga la capability y el límite; tampoco quien la creó en su nombre. | Autoaprobación de SA con `autoriz_sa` y P2640 desactivado; `Procesar` autoriza (RN-08 §7.2). | Reemplazar (DFA M1, BASE §29) | — | — |
| RN-WFL-041 | El permiso, alcance, límite y SoD del aprobador se verifican al **decidir** con `authorize()` de T02; si falla, el paso se reasigna según la política. | Permiso validado solo al abrir el formulario (`FormBase.ValidarPermiso`). | Mejorar | — | — |
| RN-WFL-042 | Una persona no decide dos pasos de la misma solicitud (doble firma = dos personas distintas). | `USU_AUTO` ≠ `USU_AUTO2` (RN-08 §7.2). | Replicar | — | — |
| RN-WFL-043 | Cambiar el contenido relevante de una solicitud invalida las decisiones previas (huella de contenido). | — | Nueva (T02 RN-IAM-043) | — | — |
| RN-WFL-044 | La política vigente al **enviar** la solicitud es la que rige; una nueva versión de política no altera solicitudes ya enviadas. | — | Nueva (ARQ-05) | — | — |
| RN-WFL-045 | El importe que define el tramo es el total de la solicitud en moneda del tenant, convertido con la cotización del día de envío (M14 `tes.exchangeRate.published`) si viene en otra moneda. | P2382 (monto) sin moneda. | Mejorar | — | — |
| RN-WFL-046 | Una delegación nunca amplía permisos: el delegado debe tener la capability base del dominio y el límite delegado no supera el del delegante ni el propio. | — | Nueva | PRM-WFL-031 | — |
| RN-WFL-047 | Una delegación no permite aprobar solicitudes donde el delegado es solicitante o beneficiario. | — | Nueva | — | — |
| RN-WFL-048 | El rechazo de cualquier paso obligatorio rechaza la solicitud completa; en paralelo N de M, la solicitud se rechaza cuando ya no es posible alcanzar el quórum. | — | Nueva | — | — |
| RN-WFL-049 | El escalamiento por SLA nunca aprueba automáticamente: puede sumar aprobadores, reasignar o expirar. | — | Nueva | — | — |
| RN-WFL-050 | Las firmas conjuntas toman los firmantes **vigentes** a la fecha de la decisión desde el registro de firmantes (M14), con sus límites. | `PPAGOS_FIRMANTES` sin vigencia (FIC 15). | Mejorar | — | — |
| RN-WFL-051 | Una política "sin aprobación" es explícita por tramo y queda registrada como decisión automática con la versión de la política; no hay ausencia silenciosa de control. | P2377 "autorizada por defecto" (M12). | Mejorar | — | — |

### 6.5 Documentos, plantillas, numeración y firma

| ID | Regla | Comportamiento ProCoop (fuente) | Decisión en CoopApps | Parámetros | [VERIFICAR] |
|---|---|---|---|---|---|
| RN-WFL-060 | Ningún archivo de negocio se sirve por URL pública ni ruta estática; toda descarga verifica permiso y emite URL firmada de vida corta. | `/uploads` público de Connectia (CNX §10 V-01); carpetas compartidas de ProCoop (FIC 21). | Reemplazar | PRM-PLA-020 | — |
| RN-WFL-061 | Un archivo nunca se sobrescribe; reemplazar crea versión. | Adjuntos guardados solo por nombre y sobrescritos (RN-10 §2, §16.2). | Reemplazar (AGR-023) | — | — |
| RN-WFL-062 | La versión aceptada usada en un acto (firma, aprobación, presentación, emisión) queda fijada; anular el documento no la borra mientras dure su retención. | — | Nueva (AGR-023) | — | — |
| RN-WFL-063 | La purga física solo procede con retención cumplida, sin legal hold, sin vínculo a documentos económicos vigentes y con registro de purga. | Borrado físico y archivos huérfanos (RN-10 §16.2). | Reemplazar | PRM-WFL-040 | — |
| RN-WFL-064 | Los plazos de retención de plataforma no se inventan: se cargan como "a validar" con el fundamento normativo pendiente y el valor conservador por defecto (no purgar). | — | Nueva (AGR-023) | PRM-WFL-041 | — |
| RN-WFL-065 | Un documento emitido (factura, recibo, constancia, certificado, acta firmada) es inmutable: su PDF se genera una vez y la reimpresión se marca como tal. | Reimpresión regenerada con datos actuales (RN-04). | Reemplazar | — | — |
| RN-WFL-066 | Una plantilla solo accede a variables de su contrato de datos; el contrato lo provee el módulo dueño y la plantilla no consulta datos por sí misma. | `VARIABLEPLANT` con SQL (DFA M21). | Reemplazar | — | — |
| RN-WFL-067 | Una plantilla de documento fiscal o legal publicada no se edita: se crea versión nueva con aprobación y vigencia desde. | Edición directa de reportes (RN-04). | Reemplazar | — | — |
| RN-WFL-068 | Una secuencia `gapless` toma número dentro de la transacción del documento; si la transacción aborta, el número vuelve a estar disponible. | `ULT_NUM + 1` con bloqueo de fila (`BLOQUEO_FILAS`). | Mejorar | — | — |
| RN-WFL-069 | Un número asignado nunca se reutiliza aunque el documento se anule. | — | Replicar (BASE §97.2) | — | — |
| RN-WFL-070 | La firma manuscrita digitalizada se presenta siempre como conformidad y nunca se rotula como firma digital. | — | Nueva (BASE §73) | — | — |
| RN-WFL-071 | Un documento firmado electrónica o digitalmente no admite nuevas versiones sobre la misma solicitud de firma; un cambio exige nueva solicitud. | — | Nueva | — | — |
| RN-WFL-072 | El socio solo ve documentos de tipos visibles, en versiones aceptadas o emitidas, de cuentas sobre las que tiene acceso vigente (M19, M01). | Archivos en la Web de CoopOnline por cuenta (FIC 14.1). | Mejorar | — | — |
| RN-WFL-073 | El acceso a documentos `health` (servicios de salud, ambulancias, banco de sangre) requiere `wfl.documentos.verSensibles` y queda siempre registrado. | — | Nueva (BASE §97.1; M18) | — | — |
| RN-WFL-074 | Los enlaces compartidos vencen como máximo a los `PRM-WFL-045` días y se revocan al anular el documento o al revocar el acceso del sujeto. | — | Nueva (AGR-023) | PRM-WFL-045 | — |

## 7. Modelo de datos
> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueidentifier`, `DECIMAL`, `DATETIME2`, etc.; ver `07-ddl`). Menciones puntuales de Mongo/Mongoose/BullMQ sin tipo de columna = **comparativa histórica** Connectia, sin efecto en build.


Convenciones de la guía §5: todos los documentos llevan `TenantId`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy` y `version`; los índices empiezan por `TenantId`; los importes son `DECIMAL(18,4)`; las fechas se guardan en UTC. Las colecciones técnicas `outboxEvents`, `inboxReceipts`, `deadLetters`, `jobRuns`, `idempotencyKeys` y `storedFiles` son de T01 (§7.11.23–7.11.25 de T01) y aquí solo se referencian.

### 7.1 Contrato de eventos

**`eventTypes`** (plataforma, `ownerScope: platform`; sincronizado desde `packages/shared/events` en cada despliegue)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `type` | string | Sí | `<mod>.<entidad>.<hecho>`; único por `schemaVersion`. |
| `catalogId` | string | Sí | `EVT-<COD>-NN[N]` (§12). Identificador de documentación; no es referencia a otra colección. |
| `schemaVersion` | int | Sí | Versión del esquema. |
| `producerModule` | string | Sí | Código del módulo productor. |
| `aggregateType` | string | Sí | Entidad. |
| `jsonSchema` | object | Sí | Esquema derivado de Zod. |
| `piiLevel` | enum | Sí | `none`, `pseudonymous`, `personal`. |
| `visibility` | enum | Sí | `internal`, `public`. |
| `timeline` | bool | Sí | Si aparece en la línea de tiempo del expediente. |
| `businessImpact` | bool | Sí | Si un fallo de consumo crea ítem de bandeja operativa. |
| `responsibleRole` | string | No | Rol que atiende fallos con impacto. |
| `aliases` | string[] | No | Nombres alternativos a rechazar en CI (§12.4). |
| `status` | enum | Sí | `active`, `deprecated`, `retired`. |
| `deprecatedAt`, `sunsetAt` | date | No | Convivencia de versiones. |

Índices: `{ type: 1, schemaVersion: 1 }` único; `{ producerModule: 1 }`.

**`eventSubscriptions`** (plataforma; desde manifiestos)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `consumer` | string | Sí | `<mod>:<handler>`. |
| `consumerModule` | string | Sí | Módulo. |
| `type` | string | Sí | Tipo suscripto. |
| `acceptedVersions` | int[] | Sí | Versiones soportadas. |
| `queue` | enum | Sí | Clase de cola de T01 (por defecto `events`). |
| `ordering` | enum | Sí | `none`, `perAggregate`. |
| `filter` | object | No | Filtro declarativo sobre el payload. |
| `retry` | object | No | Override de `PRM-PLA-027`. |
| `requiresModuleActive` | bool | Sí | Solo entrega si el consumidor está activo en el tenant. |

Índices: `{ type: 1, consumer: 1 }` único.

**`operationalInboxItems`** (tenant)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `number` | string | Sí | `BOP-AAAA-NNNNN`. |
| `kind` | enum | Sí | `eventConsumption`, `jobFailure`, `operationFailed`, `operationUncertain`, `bulkException`, `syncConflict`, `integrationFailure`, `referentialIntegrity` (10-11-2026, DEC-100: hallazgo del verificador nocturno de T08, RNF-NFR-260, recibido por EVT-NFR-18; `dedupeKey` = `<colección>:<campo>:<_id de origen>`; se cierra solo cuando la corrida siguiente ya no lo informa; solo `openSource` y `resolveWithEvidence`, porque el verificador no corrige). |
| `sourceRef` | object | Sí | `{ type, id }` (eventId + consumer, jobRunId, operationId, bulkRunItemId, deadLetterId; en `referentialIntegrity`, la huella del hallazgo). |
| `businessTitleKey` | string | Sí | `dict:` del título funcional. |
| `businessContext` | object | Sí | Sujeto, importe, módulo, sin secretos. |
| `responsibleRole`, `responsibleAreaId` | string / uniqueidentifier | Sí / No | Responsable. `responsibleRole` es el código de `roles` (T02); `responsibleAreaId` → `crmAreas` (M09) (PA-WFL-nn, Asumida DEC-072; antes "`crmAreas` (M09) o `workAreas` (M16) [VERIFICAR: T05 §7.2 no declara el destino de las áreas responsables genéricas]"). |
| `severity` | enum | Sí | `low`, `medium`, `high`, `critical`. |
| `suggestedActions` | string[] | Sí | `retry`, `resolveWithEvidence`, `discard`, `openSource`, `contactSupport`. |
| `status` | enum | Sí | `open`, `inProgress`, `resolved`, `discarded`. |
| `resolution` | object | No | `{ action, by, at, note, evidenceDocumentIds[] }`. |
| `dedupeKey` | string | Sí | Evita duplicados por la misma causa. |

Índices: `{ tenantId: 1, status: 1, severity: -1, createdAt: 1 }`; `{ tenantId: 1, dedupeKey: 1 }` único parcial para `status ∈ {open, inProgress}`.

### 7.2 Jobs funcionales

**`jobDefinitions`** (plataforma; desde manifiestos)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `name` | string | Sí | `<mod>:<proceso>`; único. |
| `catalogId` | string | Sí | `JOB-<COD>-NN`. Identificador de documentación; no es referencia a otra colección. |
| `module` | string | Sí | Dueño. |
| `queue` | enum | Sí | Clase de cola T01. |
| `priority` | int | Sí | 1 (más alta) a 6. |
| `tenantConcurrency` | int | Sí | Máximo simultáneo por tenant. |
| `retry` | object | Sí | `{ maxAttempts, backoff: exponential/fixed, baseMs }`. |
| `jobKeyTemplate` | string | Sí | Clave de idempotencia (por ejemplo `fac:emitir-lote:{batchId}`). |
| `trigger` | enum[] | Sí | `schedule`, `event`, `command`, `manual`. |
| `defaultCron` | string | No | Cron por defecto (hora local del tenant). |
| `allowedWindow` | object | No | `{ from: "22:00", to: "06:00", businessDaysOnly }`. |
| `tenantSchedulable` | bool | Sí | Si el tenant puede reprogramar. |
| `cancellable`, `resumable`, `pausable` | bool | Sí | Capacidades. |
| `externalEffect` | bool | Sí | Si aplica la regla de inciertos (RF-WFL-031). |
| `ola` | string | Sí | Ola de entrada. |

**`jobSchedules`** (tenant)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `jobName` | string | Sí | Ref. `jobDefinitions.name`. |
| `cron` | string | Sí | Expresión de 5 campos. |
| `timezone` | string | Sí | IANA; por defecto la del tenant. |
| `window` | object | No | Override dentro de `allowedWindow`. |
| `calendarCode` | string | No | Calendario T04 para `businessDaysOnly`. |
| `params` | object | No | Parámetros validados por el esquema del job. |
| `status` | enum | Sí | `active`, `paused`, `disabled`. |
| `pausedReason`, `pausedUntil` | string / date | No | Pausa. |
| `nextRunAt`, `lastRunAt`, `lastRunStatus` | date / date / enum | No | Calculados. |
| `skipIfMissed` | bool | Sí | Comportamiento ante disparos perdidos. |

Índices: `{ tenantId: 1, jobName: 1 }` único; `{ status: 1, nextRunAt: 1 }` (lectura del scheduler de T01 con `runAsPlatform`, lista blanca).

**`bulkRuns`** (tenant)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `number` | string | Sí | `LOT-AAAA-NNNNN`. |
| `jobName` | string | Sí | Job que la ejecuta. |
| `module`, `kind` | string | Sí | Por ejemplo `fac`, `billingRunIssue`. |
| `sourceRef` | object | Sí | Entidad dueña (lote de facturación, corrida de mora). |
| `universe` | object | Sí | `{ version, frozenAt, total, criteriaSummary }`. |
| `progress` | object | Sí | `{ processed, succeeded, failed, skipped, percent, etaSeconds }`. |
| `status` | enum | Sí | §8.3. |
| `pauseReason` | object | No | `{ code, source: manual/systemic/threshold, at }`. |
| `cursor` | object | No | Punto de reanudación. |
| `resultStoredFileId` | uniqueidentifier | No | `storedFiles` del detalle (antes `resultFileId`; nombre con rol de T05 §7.2, `<rol>StoredFileId`). |
| `requestedBy`, `approvedOperationId` | uniqueidentifier | No | Origen. `requestedBy` → `memberships` (T02); `approvedOperationId` → `operations`. |
| `idempotencyKey` | string | Sí | Clave de la corrida (`<module>:<kind>:<sourceRef.id>[:<universe.version>]`); única por tenant (§12.6 regla 4; T05 COL-WFL-06). |

Índices: `{ tenantId: 1, number: 1 }` único; `{ tenantId: 1, idempotencyKey: 1 }` único; `{ tenantId: 1, module: 1, status: 1 }`.

**`bulkRunItems`** (tenant; solo ítems con excepción o resultado relevante)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `bulkRunId` | uniqueidentifier | Sí | Ref. `bulkRuns`. |
| `itemKey` | string | Sí | Clave del ítem en la corrida (`<subjectRef.type>:<subjectRef.id>`); única con `bulkRunId` (T05 COL-WFL-07). |
| `subjectRef` | object | Sí | `{ type, id }` del sujeto procesado; `id` apunta a la colección del módulo dueño según `type`. |
| `status` | enum | Sí | `succeeded`, `failed`, `skipped`, `excluded`, `reprocessed` (§8.11). |
| `reasonCode` | string | No | Motivo codificado de la excepción. |
| `ownerModule`, `ownerRole` | string | Sí | Módulo y rol (código de `roles` de T02) que resuelven la excepción. |
| `message` | string | No | Detalle sin datos personales. |
| `attempts` | int | Sí | Intentos. |
| `reprocessRunId` | uniqueidentifier | No | Ref. `bulkRuns`: corrida hija de reproceso. |

Índices: `{ tenantId: 1, bulkRunId: 1, status: 1 }`; `{ tenantId: 1, ownerRole: 1, status: 1 }`; `{ tenantId: 1, bulkRunId: 1, itemKey: 1 }` único.

### 7.3 Operaciones

**`operationTypes`** (plataforma con override de política por tenant)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `code` | string | Sí | `<mod>.<entidad>.<acción>` (por ejemplo `cob.receipt.void`). |
| `ownerModule` | string | Sí | Ejecuta el handler. |
| `nameKey` | string | Sí | `dict:`. |
| `defaultPolicyCode` | string | Sí | Política de aprobación por defecto. |
| `riskAttributes` | string[] | No | Atributos que la política puede evaluar. |
| `decisionDeadline`, `executionDeadline` | object | Sí | `{ amount, unit: hours/businessDays }`. |
| `supportsBatch`, `atomicBatch` | bool | Sí | Lote. |
| `compensable` | bool | Sí | Si declara compensación. |
| `externalEffect` | bool | Sí | Si puede quedar `uncertain`. |
| `evidenceRequired` | bool | Sí | Exige adjunto. |
| `requiresStrongAuth` | bool | Sí | MFA reciente para solicitar o decidir. |

Semilla de tipos (45). La política por defecto la ajusta cada tenant:

| Código | Dueño | Política por defecto (resumen) | Ola |
|---|---|---|---|
| `per.person.merge` | M01 | Supervisor de atención + revisión de datos | O2 |
| `per.transfer.execute` | M01 | Supervisor; doble si hay deuda transferida | O2 |
| `per.person.anonymize` | M01 | Responsable de datos personales | O2 |
| `cat.contract.forceStatus` | M02 | Supervisor comercial | O2 |
| `cat.bulkOperation.execute` | M02 | Supervisor comercial; gerencia si > N contratos | O2 |
| `cat.configVersion.publish` | M02 | Administrador + responsable comercial | O2 |
| `med.consumption.adjust` | M03 | Responsable de medición por tramo de kWh/m³ | O7 |
| `med.estimate.approve` | M03 | Responsable de medición | O7 |
| `med.demandReset.approve` | M03 | Responsable de medición | O7 |
| `tar.schedule.publish` | M04 | Doble firma (DFA M7) | O4 |
| `tar.retroactiveDiff.approve` | M04 | Gerencia + contador | O4 |
| `fac.billingRun.approveEmission` | M05 | Responsable de facturación; doble sobre PRM-FAC-072 | O4 |
| `fac.invoice.annul` | M05 | Responsable de facturación | O4 |
| `fac.adjustment.commercial` | M05 | Por tramo de importe | O4 |
| `fac.billingCycle.close` / `fac.billingCycle.reopen` | M05 | Responsable de facturación / gerencia | O4 |
| `fis.authorization.reconcileManual` | M06 | Contador | O4 |
| `cob.receipt.void` | M07 | Tesorería por tramo; siempre ≠ cajero | O5 |
| `cob.refund.execute` | M07 | Tesorería + gerencia sobre tramo | O5 |
| `cob.allocation.manual` | M07 | Supervisor de cobranzas | O5 |
| `cob.unidentified.apply` | M07 | Supervisor de cobranzas | O5 |
| `cob.cashSession.reopen` | M07 | Tesorería | O5 |
| `mor.interest.waive` | M08 | Por tramo de importe | O6 |
| `mor.agreement.outOfPolicy` | M08 | Gerencia | O6 |
| `mor.interruption.override` | M08 | Gerencia; nunca con protección legal vigente | O6 |
| `mor.writeOff.approve` | M08 | Gerencia + contador | O6 |
| `mor.debt.sendToLegal` | M08 | Gerencia | O6 |
| `mor.prescription.execute` | M08 | Gerencia + asesor legal | O6 |
| `crm.request.approve` | M09 | Según tipo de solicitud | O2 |
| `tec.damageClaim.approve` | M10 | Responsable técnico + gerencia sobre tramo | O3 |
| `tec.inspection.recoveryApprove` | M10 | Responsable técnico + comercial | O7 |
| `ven.discount.outOfRange` | M11 | Supervisor comercial por tramo | O4 |
| `cmp.supplyRequest.approve` | M12 | Por área y monto; doble opcional (P2867) | O8 |
| `cmp.purchaseOrder.approve` | M12 | Bandas de monto y categoría | O8 |
| `cmp.supplier.bankAccountApprove` | M12 | Responsable ≠ quien paga | O8 |
| `cmp.paymentOrder.approve` | M12 | Bandas de monto | O8 |
| `tes.paymentExecution.sign` | M14 | Firma conjunta con firmantes vigentes | O8 |
| `stk.adjustment.approve` | M13 | Responsable de depósito + contador sobre tramo | O8 |
| `con.period.reopen` | M15 | Contador + gerencia | O5 |
| `con.entry.manualPost` | M15 | Contador | O5 |
| `sue.payrollRun.approve` | M16 | RRHH ≠ liquidador + gerencia | O9 |
| `sue.leave.approve` | M16 | Jefe directo | O9 |
| `ins.capital.refund` | M17 | Consejo (comité) | O10 |
| `soc.benefit.approve` | M18 | Responsable del servicio social | O10 |
| `cfg.configVersion.publish` | T04 | Administrador + responsable del dominio de la clave | O1 |
| `pla.restore.execute` / `iam.supportAccess.grant` | T01 / T02 | Operaciones + Seguridad / administrador del tenant | O1 |
| `iam.personalData.export` | T02 | Responsable de datos personales | O1 |
| `mig.cutover.execute` | T07 | Gerencia + responsable de proyecto | O11 |
| `wfl.sequence.adjust` | T11 | Administrador + contador | O1 |

**`operations`** (tenant)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `number` | string | Sí | `OPE-AAAA-NNNNNN` (secuencia `allowGaps`). |
| `typeCode` | string | Sí | Ref. `operationTypes.code`. |
| `subjectRefs` | object[] | Sí | `{ type, id, role }`; en lote, ver `items`. |
| `items` | object[] | No | Lote: `{ subjectRef, payload, status, result, error }` (hasta `PRM-WFL-013`; más allá, `bulkRuns`). |
| `payload` | object | Sí | Parámetros validados por el esquema del tipo. |
| `contentHash` | string | Sí | Huella para RN-WFL-043. |
| `amount` | DECIMAL(18,4) | No | Importe que define tramos. |
| `currency` | string | No | `ARS` por defecto. |
| `riskAttributes` | object | No | Valores evaluados por la política. |
| `reason` | string | Sí | Motivo. |
| `evidenceDocumentIds` | uniqueidentifier[] | Cond. | Si `evidenceRequired`. |
| `requestedBy`, `requestedAt` | uniqueidentifier / date | Sí | Solicitante. |
| `approvalRequestId` | uniqueidentifier | No | Aprobación. |
| `status` | enum | Sí | §8.1. |
| `executionAttempts`, `lastError` | int / object | No | Sin secretos. |
| `result` | object | No | Resumen funcional del efecto. |
| `reversesOperationId` | uniqueidentifier | No | Reversión. |
| `correlationId` | string | Sí | Traza. |
| `deadlines` | object | Sí | `{ decisionDueAt, executionDueAt }`. |

Índices: `{ tenantId: 1, number: 1 }` único; `{ tenantId: 1, typeCode: 1, status: 1, createdAt: -1 }`; `{ tenantId: 1, "subjectRefs.type": 1, "subjectRefs.id": 1 }`; `{ tenantId: 1, status: 1, "deadlines.decisionDueAt": 1 }`.

**`operationSteps`** (tenant)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `operationId` | uniqueidentifier | Sí | Ref. `operations`. |
| `order` | int | Sí | Orden del paso. |
| `module`, `command` | string | Sí | Módulo y comando que ejecuta el paso (`actionCatalog.code`). |
| `params` | object | Sí | Parámetros validados por `actionCatalog.paramsSchema`. |
| `status` | enum | Sí | `pending`, `running`, `succeeded`, `failed`, `uncertain`, `compensated`, `skipped` (§8.11). |
| `attempts` | int | Sí | Intentos. |
| `idempotencyKey` | string | Sí | `<operationId>:<order>`. |
| `result` | object | No | Resumen del efecto. |
| `compensation` | object | No | `{ command, status }`. |
| `startedAt`, `finishedAt` | date | No | Ejecución. |

Índice `{ tenantId: 1, operationId: 1, order: 1 }` único.

### 7.4 Estados y workflow

**`stateMachineRegistry`** (plataforma; desde código)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `module`, `entity` | string | Sí | Módulo dueño y entidad. |
| `version` | int | Sí | Versión de la máquina. |
| `states[]` | object[] | Sí | `{ code, nameKey, terminal, canonical, initial }`. |
| `transitions[]` | object[] | Sí | `{ code, from[], to, actorCapability, guards[], effects[], requiresOperationType, reversibleBy }`; `requiresOperationType` → `operationTypes.code`. |
| `diagram` | string | No | Generado. |

Índice `{ module: 1, entity: 1, version: 1 }` único.

**`workflowDefinitions`** (plataforma y tenant)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `code` | string | Sí | Único por tenant (`WF-<COD>-<nombre>`). |
| `scope` | enum | Sí | `platformTemplate`, `tenant`. |
| `basedOnTemplateId` | uniqueidentifier | No | Plantilla adoptada: ref. `workflowDefinitions` con `scope = platformTemplate`. |
| `nameKey`, `descriptionKey` | string | Sí | Diccionario. |
| `ownerModule` | string | Sí | Módulo funcional (por ejemplo `crm`). |
| `subjectTypes` | string[] | Sí | Sujetos admitidos. |
| `channels` | enum[] | Sí | `admin`, `pwaMember`, `pwaEmployee`, `pwaField`, `public`, `api`. |
| `currentVersionId`, `draftVersionId` | uniqueidentifier | No | Ref. `workflowVersions`. |
| `status` | enum | Sí | `active`, `retired` (§8.11). |
| `extensionPoints` | string[] | No | Partes editables si viene de plantilla. |

**`workflowVersions`**

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `workflowDefinitionId`, `number` | uniqueidentifier / int | Sí | `workflowDefinitionId` → `workflowDefinitions` (antes `definitionId`; nombre canónico de T05 §7.2 y §7.4.6); `number` es el número de versión (no es referencia). Únicos juntos. |
| `status` | enum | Sí | `draft`, `inReview`, `published`, `retired`. |
| `nodes[]` | object[] | Sí | `{ id, kind: start/humanTask/approval/action/waitEvent/timer/decision/parallelSplit/parallelJoin/subprocess/end, nameKey, assignment, formVersionId, slaPolicyId, actionCode, actionParams, eventType, correlation, timeout, conditions, approvalPolicyCode, visibleToRequester, publicStatusKey }`. |
| `edges[]` | object[] | Sí | `{ from, to, condition, nameKey }`. |
| `requiredDocuments[]` | object[] | No | `{ documentTypeCode, atNodeId, mandatory }`. |
| `numberingSequenceCode` | string | Sí | Numeración de instancias. |
| `validFrom` | date | Sí | Vigencia. |
| `publishedBy`, `publishedAt`, `approvalRequestId` | — | No | Publicación. |
| `validationReport` | object | No | Resultado de la validación estructural. |

**`workflowInstances`** (tenant)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `number` | string | Sí | Según secuencia de la definición. |
| `workflowDefinitionId`, `workflowVersionId` | uniqueidentifier | Sí | Versión fija: ref. `workflowDefinitions` y `workflowVersions` (antes `definitionId`, `versionId`; nombres canónicos de T05 §7.2 y §7.4.6). |
| `subjectRef`, `relatedRefs[]` | object | Sí / No | Sujetos. |
| `requester` | object | Sí | `{ kind: member/employee/system/public, userId, personId }`. |
| `channel` | enum | Sí | Canal de inicio. |
| `status` | enum | Sí | §8.2. |
| `currentNodes[]` | object[] | Sí | `{ nodeId, enteredAt, taskIds[], timerIds[] }`. |
| `data` | object | Sí | Variables de la instancia (validadas). |
| `formSubmissionIds[]`, `documentIds[]` | uniqueidentifier[] | No | Presentaciones y adjuntos. |
| `sla` | object | No | `{ policyId, dueAt, pausedMs, breached }`. |
| `dueAt`, `expiredActionsExecutedAt` | date | No | Vencimiento del trámite (RN-WFL-035). |
| `publicStatusKey` | string | No | Estado visible al socio. |
| `outcome` | enum | No | `approved`, `rejected`, `completed`, `cancelled`, `expired`. |
| `correlationId` | string | Sí | Traza. |

Índices: `{ tenantId: 1, number: 1 }` único; `{ tenantId: 1, workflowDefinitionId: 1, status: 1 }`; `{ tenantId: 1, "subjectRef.type": 1, "subjectRef.id": 1 }`; `{ tenantId: 1, "requester.personId": 1, createdAt: -1 }`; `{ tenantId: 1, status: 1, dueAt: 1 }`.

**`workflowInstanceEvents`** (tenant; inmutable)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `workflowInstanceId` | uniqueidentifier | Sí | Ref. `workflowInstances` (antes `instanceId`; nombre canónico de T05 §7.2 y §7.4.6). |
| `at` | date | Sí | Momento. |
| `kind` | enum | Sí | `nodeEntered`, `nodeCompleted`, `transition`, `comment`, `documentAdded`, `slaPaused`, `slaResumed`, `reassigned`, `migrated`. |
| `nodeId` | string | No | Nodo de `workflowVersions.nodes[]`. |
| `actor` | object | Sí | `{ kind: user/system/member, id }`. |
| `visibility` | enum | Sí | `internal`, `public`. |
| `data` | object | No | Detalle del hecho. |

Índice `{ tenantId: 1, workflowInstanceId: 1, at: 1 }`.

**`slaPolicies`** (tenant)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `code` | string | Sí | Único por tenant. |
| `target` | object | Sí | `{ amount, unit: minutes/hours/businessHours/days/businessDays }`. |
| `calendarSource` | string | Sí | `area`, `tenant`, `fixed:<calendarCode>` (calendario de T04). |
| `thresholds[]` | object[] | Sí | `{ percent, actions[] { kind: notifyAssignee/notifySupervisor/reassign/addApprover/raisePriority/expire/runAction, params } }`. |
| `pauseOnStates[]` | string[] | No | Estados del objeto que pausan el reloj. |
| `escalationRoster` | object | No | Guardias por día, franja y feriado. |

Índice `{ tenantId: 1, code: 1 }` único.

**`slaTimers`** (tenant)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `targetRef` | object | Sí | `{ type: instance/task/approvalStep, id }` → `workflowInstances`, `tasks` o `approvalSteps`. |
| `slaPolicyId` | uniqueidentifier | Sí | Ref. `slaPolicies` (antes `policyId`; nombre canónico de T05 §7.2 y §7.4.6); mismo nombre que en `workflowVersions.nodes[]` y `approvalPolicies.rules[].steps[]`. |
| `startedAt`, `dueAt` | date | Sí | Inicio y vencimiento. |
| `nextThresholdAt` | date | No | Próximo umbral. |
| `thresholdsFired[]` | object[] | No | `{ percent, at }`. |
| `pausedAt`, `pausedMs` | date / long | No | Pausa acumulada. |
| `status` | enum | Sí | `running`, `paused`, `completed`, `breached`, `cancelled` (§8.11). |

Índice `{ tenantId: 1, status: 1, nextThresholdAt: 1 }`; `{ tenantId: 1, "targetRef.type": 1, "targetRef.id": 1, slaPolicyId: 1 }` único parcial para `status ∈ {running, paused}`; global `{ status: 1, nextThresholdAt: 1 }` en lista blanca para `wfl:sla-monitor`.

**`formDefinitions`** / **`formVersions`** (tenant y plataforma)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `code`, `nameKey` | string | Sí | Identificación (en `formDefinitions`; `code` único por tenant). |
| `formDefinitionId` | uniqueidentifier | Sí | Solo en `formVersions`: ref. `formDefinitions` (T05 COL-WFL-18; antes decía COL-WFL-17, que es otra colección). |
| `version`, `status` | int / enum | Sí | Solo en `formVersions`: número de versión y `draft`, `published`, `retired`. Únicos `{ formDefinitionId, version }`. |
| `fields[]` | object[] | Sí | `{ key, kind (§5.6), labelKey, helpKey, required, requiredWhen, visibleWhen, editableBy: requester/operator/both, validations, dataSourceCode, dataSourceParams, documentTypeCode, currency, decimals, min, max, pattern, options[], calculated (expresión declarativa), piiLevel }`. |
| `sections[]` | object[] | No | Agrupación y orden. |
| `zodSchemaHash` | string | Sí | Esquema generado. |

Tabla combinada conservada como registro; desde el 5-11-2026 cada colección tiene su propia tabla (PA-WFL-23):

**`formDefinitions`** (tenant y plataforma; COL-WFL-18)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `code`, `nameKey` | string | Sí | Identificación; `code` único por tenant. |

**`formVersions`** (tenant y plataforma; COL-WFL-19)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `formDefinitionId` | uniqueidentifier | Sí | Ref. `formDefinitions` (COL-WFL-18). |
| `version` | int | Sí | Número de versión. Único `{ formDefinitionId, version }`. |
| `status` | enum | Sí | `draft`, `published`, `retired` (§8.11). |
| `fields[]` | object[] | Sí | Igual que en la tabla anterior (§5.6). |
| `sections[]` | object[] | No | Agrupación y orden. |
| `zodSchemaHash` | string | Sí | Esquema generado. |

Sujetos que usan `formVersions` (verificado el 5-11-2026; antes el anexo solo lo dejaba implícito en T05 COL-WFL-19): los workflows de T11 (presentaciones en `formSubmissions`), los formularios de campo de M10 (`fieldForms`, COL-TEC-27) y los formularios del portal de M19 (`portalForms`, COL-POR-06). Según PA-POR-21 de M19 (Asumida DEC-072), `portalForms` guarda `formVersionId` de la versión publicada vigente; `portalFormSubmissions` y `portalDrafts` guardan el `formVersionId` usado; `portalForms.versions` y `currentVersion` quedan reemplazados por `formVersions`. Publicar un formulario del portal crea una versión `published` inmutable aquí; los pasos de M19 se expresan con `sections[]` y los campos con `fields[]`.

**`formSubmissions`** (tenant)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `formVersionId` | uniqueidentifier | Sí | Ref. `formVersions`. |
| `workflowInstanceId` | uniqueidentifier | No | Ref. `workflowInstances` (antes `instanceId`; nombre canónico de T05 §7.2 y §7.4.6). |
| `submittedBy` | object | Sí | `{ kind: member/employee/public, userId, personId }`; `userId` → `memberships` (T02), `personId` → `persons` (M01). |
| `channel` | enum | Sí | Canal (los de `workflowDefinitions.channels`). |
| `values` | object | Sí | Valores tipados; importes `DECIMAL(18,4)`. |
| `documentIds` | uniqueidentifier[] | No | Ref. `documents`. |
| `hash` | string | Sí | Huella de la presentación. |
| `supersedesSubmissionId` | uniqueidentifier | No | Ref. `formSubmissions` (presentación que reemplaza). |
| `verification[]` | object[] | No | `{ fieldKey, source, status, detail }`. |
| `clientMutationId` | string | No | Idempotencia del cliente. |

Índice `{ tenantId: 1, workflowInstanceId: 1, createdAt: 1 }`; `{ tenantId: 1, clientMutationId: 1 }` único parcial.

**`actionCatalog`** (plataforma; desde manifiestos)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `code` | string | Sí | `<mod>.<comando>`; único. |
| `module` | string | Sí | Dueño. |
| `paramsSchema`, `resultSchema` | object | Sí | Esquemas. |
| `requiresCapability` | string | Sí | Capability de la identidad técnica (catálogo de T02). |
| `idempotent` | bool | Sí | Idempotente. |
| `compensationCode` | string | No | Ref. `actionCatalog.code` de la compensación. |
| `externalEffect` | bool | Sí | Si puede quedar `uncertain`. |
| `availableInNodes` | enum[] | Sí | `action`, `onExpire`, `onEnter`. |
| `ola` | string | Sí | Ola de entrada. |

Índice `{ code: 1 }` único.

**`dataSourceCatalog`** (plataforma; desde manifiestos)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `code` | string | Sí | Único. |
| `module` | string | Sí | Dueño de la fuente. |
| `paramsSchema` | object | No | Parámetros. |
| `itemSchema` | object | Sí | `{ value, labelKey o label }`. |
| `scopeAware` | bool | Sí | Filtra por alcance del usuario. |
| `cacheSeconds` | int | No | Caché. |

Índice `{ code: 1 }` único.

### 7.5 Aprobaciones

**`approvalPolicies`** (tenant, con semilla de plataforma)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `code`, `nameKey` | string | Sí | Identificación. |
| `version`, `status`, `validFrom` | int / enum / date | Sí | Versionado. `status`: `draft`, `inReview`, `published`, `retired` (§8.11). |
| `appliesTo` | object | Sí | `{ operationTypeCodes[], policyCodes[] }`. |
| `rules[]` | object[] | Sí | Evaluadas en orden: `{ when: { amountFrom, amountTo, currency, areaIds, branchIds, serviceIds, categoryIds, risk: { attribute, op, value } }, mode: none/single/sequential/parallelAll/parallelQuorum/committee/dualControl/jointSignature, steps[] { order, assignees: { roles[], areaRole, users[], signerRegistryCode, relation }, quorum, amountLimitCheck, slaPolicyId, strongAuth }, autoDecisionReasonKey }`. |
| `sod` | object | Sí | `{ requesterCannotApprove: true, distinctPerStep: true, extraRules[] (ref T02 sodRules) }`. |
| `onExpire` | enum | Sí | `expire`, `escalate`. |
| `approvalRequestId` | uniqueidentifier | No | Aprobación de la política (PRM-WFL-030). |

**`approvalRequests`** (tenant)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `number` | string | Sí | `APR-AAAA-NNNNNN`. |
| `approvalPolicyId`, `policyVersion`, `ruleIndex` | uniqueidentifier / int / int | Sí | Regla aplicada; `approvalPolicyId` → `approvalPolicies` (antes `policyId`; nombre canónico de T05 §7.2 y §7.4.6). |
| `sourceRef` | object | Sí | `{ type: operation/workflowInstance/configVersion/document/other, id }`. |
| `summary` | object | Sí | Resumen funcional (`titleKey`, importe, sujeto, motivo). |
| `contentHash` | string | Sí | Huella. |
| `amount`, `currency` | DECIMAL(18,4) / string | No | Tramo. |
| `requestedBy` | uniqueidentifier | Sí | Solicitante. |
| `status` | enum | Sí | §8.4. |
| `currentStepOrder` | int | No | Secuencial. |
| `decidedAt`, `outcome` | date / enum | No | `approved`, `rejected`, `expired`, `withdrawn`. |
| `dueAt` | date | Sí | Plazo total. |

Índices: `{ tenantId: 1, number: 1 }` único; `{ tenantId: 1, status: 1, dueAt: 1 }`; `{ tenantId: 1, "sourceRef.type": 1, "sourceRef.id": 1 }`.

**`approvalSteps`** (tenant)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `approvalRequestId` | uniqueidentifier | Sí | Ref. `approvalRequests`. |
| `order` | int | Sí | Orden. |
| `mode` | enum | Sí | Modo de `approvalPolicies.rules[].mode`. |
| `assigneeResolution` | object | Sí | Snapshot de candidatos. |
| `quorum` | int | No | Quórum. |
| `status` | enum | Sí | `waiting`, `active`, `approved`, `rejected`, `expired`, `skipped` (§8.11). |
| `activatedAt`, `dueAt` | date | No | Plazos. |
| `slaTimerId` | uniqueidentifier | No | Ref. `slaTimers`. |
| `escalations[]` | object[] | No | `{ at, kind, addedAssignees }`. |

Índice `{ tenantId: 1, approvalRequestId: 1, order: 1 }`.

**`approvalDecisions`** (tenant; inmutable)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `approvalRequestId` | uniqueidentifier | Sí | Ref. `approvalRequests`. |
| `approvalStepId` | uniqueidentifier | Sí | Ref. `approvalSteps` (antes `stepId`; nombre canónico de T05 §7.2 y §7.4.6). |
| `decidedBy`, `onBehalfOf` | uniqueidentifier | Sí / No | Aprobador y delegante; ref. `memberships` (T02). |
| `delegationId` | uniqueidentifier | No | Ref. `delegations`. |
| `decision` | enum | Sí | `approve`, `reject`, `abstain`. |
| `comment` | string | No | Comentario. |
| `evidenceDocumentIds` | uniqueidentifier[] | No | Ref. `documents`. |
| `contentHash` | string | Sí | Huella decidida. |
| `authMethod` | enum | Sí | `password+totp`, `webauthn`, `pwaStepUp`. |
| `ip` | string | No | Seudonimizada. |
| `at` | date | Sí | Momento. |
| `policyVersion` | int | Sí | Versión de la política. |

Índice `{ tenantId: 1, approvalRequestId: 1, at: 1 }`; único `{ tenantId: 1, approvalStepId: 1, decidedBy: 1 }`.

**`delegations`** (tenant)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `delegatorUserId`, `delegateUserId` | uniqueidentifier | Sí | Delegante y delegado; ref. `memberships` (T02). |
| `from`, `to` | date | Sí | Vigencia. |
| `scope` | object | Sí | `{ operationTypeCodes[], policyCodes[], areaIds[], maxAmount, currency }`. |
| `reason` | string | Sí | Motivo. |
| `status` | enum | Sí | `scheduled`, `active`, `ended`, `revoked` (§8.10). |
| `createdBy` | uniqueidentifier | Sí | Ref. `memberships` (T02). |

Índice `{ tenantId: 1, delegateUserId: 1, status: 1, to: 1 }`.

### 7.6 Tareas, bandeja y agenda

**`tasks`** (tenant)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `number` | string | Sí | `TAR-AAAA-NNNNNN`. |
| `kind` | enum | Sí | `adHoc`, `workflow`, `review` (pedida por un módulo), `recurring`. Uso de `review` por M08 (RN-MOR-144, RF-MOR-224; HUECO-SAN-02): revisión del aporte impago de banco de sangre, asignada al rol de PRM-MOR-205 (responsable del servicio social), con `origin = { module: "M08", ref: <caso de mora> }`, una sola tarea por contrato y período y resultado en `completion.outcome` (`keepCoverage`, `manageDebt`, `reviewAgreement`); la tarea nunca suspende la cobertura. |
| `titleKey` o `title` | string | Sí | Diccionario o texto del usuario. |
| `description` | string | No | Texto. |
| `subjectRefs` | object[] | No | Vínculos. |
| `workflowInstanceId`, `nodeId` | uniqueidentifier / string | No | Workflow: ref. `workflowInstances` (antes `instanceId`; nombre canónico de T05 §7.2 y §7.4.6) y nodo de la versión. |
| `assignee` | object | Sí | `{ kind: user/area/role/queue, id }`. |
| `claimedBy`, `claimedAt` | uniqueidentifier / date | No | Toma de cola. |
| `priority` | int | Sí | 0, 1, 25, 50, 75, 100. |
| `dueAt`, `startAt` | date | No | Plazos. |
| `recurrence` | object | No | `{ rrule, timezone, seriesId, occurrenceDate }`. |
| `checklist[]` | object[] | No | `{ key, labelKey, done, doneBy, doneAt }`. |
| `evidenceRequired` | object | No | `{ documentTypeCodes[], minCount }`. |
| `formVersionId`, `formSubmissionId` | uniqueidentifier | No | Formulario de la tarea. |
| `status` | enum | Sí | §8.5. |
| `completion` | object | No | `{ by, at, outcome, comment, documentIds[] }`. |
| `slaTimerId` | uniqueidentifier | No | SLA. |
| `origin` | object | Sí | `{ module, ref }`. Las tareas `review` llevan además `origin.dedupKey` (p. ej. `contractId + period` en RN-MOR-144) para que el módulo que la pide no cree dos tareas por el mismo motivo. |

Índices: `{ tenantId: 1, "origin.module": 1, "origin.dedupKey": 1 }` único parcial (solo tareas `review` abiertas con `dedupKey`; HUECO-SAN-02); `{ tenantId: 1, number: 1 }` único; `{ tenantId: 1, "assignee.kind": 1, "assignee.id": 1, status: 1, dueAt: 1 }`; `{ tenantId: 1, "recurrence.seriesId": 1, "recurrence.occurrenceDate": 1 }` único parcial.

**`taskComments`** (tenant)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `taskId`, `workflowInstanceId` | uniqueidentifier | Cond. | Uno de los dos: ref. `tasks` o `workflowInstances` (antes `instanceId`; nombre canónico de T05 §7.2 y §7.4.6). |
| `body` | string | Sí | Texto plano con menciones `@userId`. |
| `mentions[]` | uniqueidentifier[] | No | Ref. `memberships` (T02). |
| `visibility` | enum | Sí | `internal`, `public`. |
| `documentIds` | uniqueidentifier[] | No | Ref. `documents`. |
| `editedAt` | date | No | Edición. |

Índice `{ tenantId: 1, taskId: 1, createdAt: 1 }`.

**`workItems`** (tenant; proyección reconstruible)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `sourceType` | enum | Sí | `task`, `approvalStep`, `iamAuthorization`, `crmCase`, `workOrder`, `visit`, `bulkException`, `operationalInbox`, `syncConflict`, `activityOccurrence`, `signature`, `deskTransfer`. |
| `sourceModule`, `sourceId` | string / uniqueidentifier | Sí | Origen; `sourceModule` es el código de tres letras del módulo (no es referencia); `sourceId` apunta a la colección del módulo dueño según `sourceType` (por ejemplo `tasks`, `approvalSteps`, `authorizationRequests` de T02, `crmCases` de M09, `workOrders` de M10). |
| `titleKey`, `titleParams` | string / object | Sí | Diccionario. |
| `subjectSummary` | object | No | Sujeto resumido (sin datos sensibles innecesarios). |
| `assignees` | object[] | Sí | `{ kind: user/area/role/queue, id }`. |
| `claimedBy` | uniqueidentifier | No | Toma. |
| `priority`, `dueAt` | int / date | No | Orden. |
| `dueBucket` | enum | Sí | `overdue`, `today`, `tomorrow`, `next7`, `future`, `none` (recalculado por job y al leer). |
| `actions` | string[] | Sí | Acciones en línea permitidas. |
| `deepLink` | string | Sí | Ruta del detalle. |
| `status` | enum | Sí | `open`, `snoozed`, `done`, `cancelled` (§8.11). |
| `snoozedUntil` | date | No | Posponer. |
| `sourceVersion` | int | Sí | Para descartar eventos fuera de orden. |

Índices: `{ tenantId: 1, "assignees.kind": 1, "assignees.id": 1, status: 1, dueAt: 1 }`; `{ tenantId: 1, sourceType: 1, sourceId: 1 }` único.

**`agendaEntries`** (tenant; proyección)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `userId`, `teamRef` | uniqueidentifier / object | Cond. | Uno de los dos; `userId` → `memberships` (T02); `teamRef` `{ kind: area/crew, id }`. |
| `sourceType` | enum | Sí | `crmCalendar`, `visit`, `queueAppointment`, `meeting`, `leave`, `taskDue`, `approvalDue`, `holiday`, `activityOccurrence`. |
| `sourceId` | uniqueidentifier | Sí | Colección del módulo dueño según `sourceType`. |
| `start`, `end` | date | Sí | `end` exclusivo si `allDay`. |
| `allDay` | bool | Sí | Día completo. |
| `titleKey`, `title` | string | Sí | Uno de los dos. |
| `location` | string | No | Lugar. |
| `status` | enum | Sí | `confirmed`, `tentative`, `cancelled` (espejo del origen; mismos valores que iCal `STATUS`). Valores declarados el 5-11-2026: antes el campo no tenía valores. |
| `deepLink` | string | Sí | Ruta del detalle. |
| `privacy` | enum | Sí | `normal`, `private`. |

Índice `{ tenantId: 1, userId: 1, start: 1 }`; `{ tenantId: 1, sourceType: 1, sourceId: 1, userId: 1 }` único.

**`agendaFeeds`** (tenant)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `userId` | uniqueidentifier | Sí | Ref. `memberships` (T02). |
| `tokenHash` | string | Sí | Hash del token del feed. |
| `scope` | enum | Sí | `own`, `team`. |
| `includeSources[]` | enum[] | No | Valores de `agendaEntries.sourceType`. |
| `status` | enum | Sí | `active`, `revoked` (§8.11). |
| `lastAccessAt` | date | No | Último acceso. |

Índice `{ tokenHash: 1 }` único (lista blanca; lectura pública por token).

### 7.7 Documentos

**`documentTypes`** (plataforma + tenant)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `code`, `nameKey` | string | Sí | Por ejemplo `DOC-ID-DNI`. |
| `category` | enum | Sí | `identity`, `fiscal`, `contract`, `technical`, `billing`, `collection`, `legal`, `labor`, `institutional`, `health`, `purchase`, `evidence`, `communication`, `other`. |
| `allowedSubjects` | string[] | Sí | Sujetos. |
| `mimeTypes`, `maxSizeMb` | string[] / int | Sí | Restricciones. |
| `sensitivity` | enum | Sí | `internal`, `personal`, `restricted`, `health`, `fiscal`. |
| `retentionPolicyCode` | string | Sí | Retención: ref. `retentionPolicies.code` (T08 COL-NFR-06). |
| `visibleToMember` | bool | Sí | "Mis documentos". |
| `requiresAcceptedVersion` | bool | Sí | Fija versión aceptada en actos. |
| `metadataSchema` | object | No | Campos tipados. |
| `expires` | object | No | `{ field, noticeDays }`. |
| `legacyAdjuntosTipo` | int | No | Mapeo `ADJUNTOS.TIPO`. |

**`documents`** (tenant)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `number` | string | No | Si el tipo numera (secuencia). |
| `documentTypeId` | uniqueidentifier | Sí | Ref. `documentTypes` (T05 §7.2). |
| `documentTypeCode` | string | Sí | Copia desnormalizada de `documentTypes.code` para filtros e índices. |
| `title` | string | Sí | Título (sin datos sensibles innecesarios). |
| `currentVersionId`, `acceptedVersionIds[]` | uniqueidentifier | Sí / No | Versiones; ref. `documentVersions`. Los vínculos con sujetos van en `documentLinks`. |
| `metadata` | object | No | Validado por `metadataSchema`. |
| `sensitivity` | enum | Sí | Heredada o elevada. |
| `origin` | enum | Sí | `upload`, `generated`, `signed`, `imported`, `scanned`, `email`. |
| `generatedFrom` | object | No | `{ templateVersionId, dataContractVersion, renderRequestId, sourceRef }`. |
| `status` | enum | Sí | §8.6. |
| `expiresAt` | date | No | Vencimiento del contenido. |
| `retention` | object | Sí | `{ policyCode, retainUntil, basisDate }`. |
| `legalHoldIds[]` | uniqueidentifier[] | No | Holds; ref. `legalHolds` (T08 COL-NFR-07). |
| `voided` | object | No | `{ at, by, reason }`. |
| `legacy` | object | No | `{ source: ADJUNTOS/PROCOOPAR_ADJUNTOS/folder, key, path }`. |

Índices: `{ tenantId: 1, documentTypeCode: 1, status: 1 }`; `{ tenantId: 1, number: 1 }` único parcial; `{ tenantId: 1, "retention.retainUntil": 1, status: 1 }`; `{ tenantId: 1, expiresAt: 1 }`.

**`documentVersions`** (tenant; inmutable)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `documentId` | uniqueidentifier | Sí | Ref. `documents`. |
| `number` | int | Sí | Número de versión. |
| `storedFileId`, `thumbnailStoredFileId` | uniqueidentifier | Sí / No | Ref. `storedFiles` (T01) (antes `thumbnailFileId`; nombre con rol de T05 §7.2). |
| `sha256`, `sizeBytes`, `mimeType`, `pages` | string / long / string / int | Sí | Huella y metadatos del binario. |
| `scanStatus` | enum | Sí | Espejo de `storedFiles.scanStatus` de T01: `pending`, `clean`, `infected`, `failed`. Valores declarados el 5-11-2026: antes el campo no tenía valores. |
| `uploadedBy`, `uploadedAt` | uniqueidentifier / date | Sí | `uploadedBy` → `memberships` (T02). |
| `channel` | enum | Sí | Canal de carga. |
| `note` | string | No | Nota. |
| `accepted` | object | No | `{ at, by, act: { type, id } }`. |
| `signatures[]` | uniqueidentifier[] | No | Ref. `signatureRequests`. |
| `pdfa` | bool | Sí | PDF/A. |

Índice `{ tenantId: 1, documentId: 1, number: 1 }` único; `{ tenantId: 1, sha256: 1 }`.

**`documentLinks`** (tenant)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `documentId` | uniqueidentifier | Sí | Ref. `documents`. |
| `subjectType`, `subjectId` | string / uniqueidentifier | Sí | Sujeto vinculado; `subjectType` es el tipo de sujeto (no es referencia); `subjectId` apunta a la colección del módulo dueño según `subjectType`. |
| `role` | enum | Sí | `main`, `evidence`, `attachment`, `generatedFor`, `signedBy`. |
| `linkedBy`, `linkedAt` | uniqueidentifier / date | Sí | `linkedBy` → `memberships` (T02). |
| `unlinkedAt` | date | No | Desvinculación. |

Índices: `{ tenantId: 1, subjectType: 1, subjectId: 1, linkedAt: -1 }`; `{ tenantId: 1, documentId: 1, subjectType: 1, subjectId: 1 }` único (T05 COL-WFL-35).

**`shareLinks`** (tenant)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `documentId` | uniqueidentifier | Sí | Ref. `documents`. |
| `versionId` | uniqueidentifier | No | Ref. `documentVersions` (fija la versión). |
| `tokenHash` | string | Sí | Hash del token. |
| `expiresAt` | date | Sí | Vencimiento. |
| `maxDownloads`, `downloads` | int | No / Sí | Límite y contador. |
| `passwordHash` | string | No | Contraseña opcional. |
| `recipientNote` | string | No | Nota para el destinatario. |
| `status` | enum | Sí | `active`, `expired`, `revoked` (§8.11). |
| `createdBy` | uniqueidentifier | Sí | Ref. `memberships` (T02). |

Índice `{ tokenHash: 1 }` único (lista blanca).

**`retentionPolicies`** (plataforma + tenant; T05 la cataloga como COL-WFL-38 absorbida en COL-NFR-06 de T08, que define la ficha; T11 la lee): `code`, `nameKey`, `basis` (`createdAt`, `documentDate`, `subjectClosedAt`, `fiscalYearEnd`), `minYears` (plataforma), `tenantYears` (≥ mínimo), `action` (`purge`, `anonymize`, `archiveCold`), `legalBasisRef`, `status` (`validated`, `toValidate`).

**`legalHolds`** (tenant; T05 la cataloga como COL-WFL-39 absorbida en COL-NFR-07 de T08, que define la ficha; T11 la aplica): `scope` `{ type: document/subject/dossier, id }`, `reason`, `caseRef`, `appliedBy`, `appliedAt`, `releasedBy`, `releasedAt`, `status`.

**`documentAccessLogs`** (tenant; TTL según PRM-WFL-046)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `documentId` | uniqueidentifier | Sí | Ref. `documents`. |
| `versionId` | uniqueidentifier | No | Ref. `documentVersions`. |
| `action` | enum | Sí | `view`, `download`, `shareLinkAccess`, `export`. |
| `actor` | object | Sí | `{ userId }` (→ `memberships` de T02) o `{ shareLinkId }` (→ `shareLinks`). |
| `at` | date | Sí | Momento. |
| `ip` | string | No | Seudonimizada. |
| `channel` | enum | Sí | Canal. |

Índice `{ tenantId: 1, documentId: 1, at: -1 }`; TTL sobre `at`.

### 7.8 Plantillas y render

**`documentTemplates`** (plataforma + tenant)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `code` | string | Sí | `TPL-<COD>-NN`; único por tenant. |
| `nameKey` | string | Sí | Diccionario. |
| `documentTypeCode` | string | Sí | Ref. `documentTypes.code`. |
| `ownerModule` | string | Sí | Dueño. |
| `dataContractCode` | string | Sí | Ref. `templateDataContracts.code`. |
| `scope` | enum | Sí | `platformTemplate`, `tenant`. |
| `basedOnTemplateId` | uniqueidentifier | No | Ref. `documentTemplates` con `scope = platformTemplate`. |
| `currentVersionId` | uniqueidentifier | No | Ref. `templateVersions`. |
| `requiresApproval` | bool | Sí | Fiscales y legales. |
| `paper` | enum | Sí | `A4`, `Letter`, `Legal`, `ticket80`. |
| `copies[]` | enum[] | Sí | `original`, `duplicate`, `triplicate`. |
| `editableZones[]` | string[] | No | Zonas editables si viene de plantilla. |
| `status` | enum | Sí | `active`, `retired` (§8.11); las versiones llevan su propio estado. Valores declarados el 5-11-2026: antes el campo no tenía valores. |

Índice `{ tenantId: 1, code: 1 }` único.

**`templateVersions`** (plataforma + tenant)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `documentTemplateId` | uniqueidentifier | Sí | Ref. `documentTemplates` (antes `templateId`; nombre de T05 COL-WFL-45). |
| `number` | int | Sí | Número de versión; único con `documentTemplateId`. |
| `status` | enum | Sí | `draft`, `inReview`, `published`, `retired`. |
| `html`, `css`, `header`, `footer` | string | Sí / Sí / No / No | Contenido. |
| `assets[]` | uniqueidentifier[] | No | Ref. `storedFiles` (T01). |
| `dataContractVersion` | int | Sí | Versión de `templateDataContracts`. |
| `validFrom` | date | No | Vigencia. |
| `pdfa` | bool | Sí | PDF/A. |
| `watermarkRules[]` | object[] | No | Marcas de agua. |
| `approvalRequestId` | uniqueidentifier | No | Ref. `approvalRequests`. |
| `previewStoredFileId` | uniqueidentifier | No | Ref. `storedFiles` (T01) (antes `previewFileId`; nombre con rol de T05 §7.2). |
| `changeNote` | string | No | Nota de cambio. |

Índice `{ tenantId: 1, documentTemplateId: 1, number: 1 }` único.

**`templateDataContracts`** (plataforma; desde `packages/shared/documents`)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `code`, `version` | string / int | Sí | Únicos juntos. |
| `module` | string | Sí | Dueño del contrato. |
| `jsonSchema` | object | Sí | Esquema. |
| `variables[]` | object[] | Sí | `{ path, type, descriptionKey, example }`. |
| `status` | enum | Sí | `active`, `deprecated`, `retired` (§8.11; mismo ciclo que `eventTypes`). Valores declarados el 5-11-2026: antes el campo no tenía valores. |

Índice `{ code: 1, version: 1 }` único.

**`renderRequests`** (tenant)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `templateVersionId` | uniqueidentifier | Sí | Ref. `templateVersions`. |
| `dataContractVersion` | int | Sí | Versión del contrato. |
| `sourceRef` | object | Sí | `{ type, id }` del acto que pide el render. |
| `idempotencyKey` | string | Sí | `<sourceType>:<sourceId>:<templateVersionId>:<copy>`. |
| `mode` | enum | Sí | `sync`, `job`. |
| `bulkRunId` | uniqueidentifier | No | Ref. `bulkRuns`. |
| `status` | enum | Sí | `queued`, `rendering`, `succeeded`, `failed` (§8.11). |
| `documentId`, `versionId` | uniqueidentifier | No | Resultado: ref. `documents` y `documentVersions`. |
| `durationMs` | int | No | Duración. |
| `error` | object | No | Sin secretos. |

Índice `{ tenantId: 1, idempotencyKey: 1 }` único.

### 7.9 Numeración

**`numberingSequences`** (tenant)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `code` | string | Sí | Por ejemplo `wfl.deskEntry`, `fac.voucher`. |
| `scopeKeys` | string[] | Sí | Dimensiones del alcance (`branchId`, `posNumber`, `voucherTypeId`, `year`). |
| `scopeValues` | object | Sí | Valores de esta instancia de secuencia. |
| `scopeHash` | string | Sí | Hash estable de `scopeValues` (claves ordenadas); forma el índice único con `code`. Campo declarado el 5-11-2026: el índice lo usaba sin declararlo. |
| `mask` | string | Sí | `{PREFIX}-{YYYY}-{N:6}`. |
| `next` | long | Sí | Próximo valor. |
| `step`, `min`, `max` | long | Sí | Límites. |
| `resetPolicy` | enum | Sí | `never`, `yearly`, `monthly`. |
| `gapPolicy` | enum | Sí | `gapless`, `allowGaps`, `external`. |
| `ownerModule` | string | Sí | Dueño funcional. |
| `thresholdPercent` | int | No | Alerta. |
| `status` | enum | Sí | `active`, `closed` (§8.11). |

Índice: `{ tenantId: 1, code: 1, scopeHash: 1 }` único.

**`numberingAssignments`** (tenant; solo para `gapless` y documentos con trazabilidad)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `numberingSequenceId` | uniqueidentifier | Sí | Ref. `numberingSequences` (antes `sequenceId`; nombre canónico de T05 §7.2 y §7.4.6). |
| `value` | long | Sí | Valor asignado. |
| `formatted` | string | Sí | Valor con máscara. |
| `assignedTo` | object | Sí | `{ type, id }` del documento o acto numerado. |
| `assignedAt` | date | Sí | Momento. |
| `status` | enum | Sí | `assigned`, `voided` (§8.11). |
| `voidReason` | string | Cond. | Obligatorio si `voided`. |

Índice `{ tenantId: 1, numberingSequenceId: 1, value: 1 }` único.

### 7.10 Firma

**`signatureProfiles`** (tenant)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `code` | string | Sí | Único por tenant. |
| `level` | enum | Sí | `handwritten`, `electronic`, `digital`. |
| `providerConnectionId` | uniqueidentifier | Cond. | Ref. `integrationConnections` (T06); obligatorio para `digital`. |
| `otpChannels[]` | enum[] | No | Canales de OTP. |
| `evidence` | object | Sí | `{ geo, photo, deviceInfo, idDocument }`. |
| `legalTextKey` | string | Sí | Texto legal (`dict:`). |
| `appearance` | object | No | Posición por defecto y texto. |
| `expiresAfterHours` | int | Sí | Vencimiento del pedido. |
| `reminders[]` | object[] | No | Recordatorios. |

Índice `{ tenantId: 1, code: 1 }` único.

**`signatureRequests`** (tenant)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `number` | string | Sí | `FIR-AAAA-NNNNNN`. |
| `documentId` | uniqueidentifier | Sí | Ref. `documents`. |
| `versionId`, `signedVersionId` | uniqueidentifier | Sí / No | Versión a firmar y versión firmada: ref. `documentVersions`. |
| `signatureProfileId` | uniqueidentifier | Sí | Ref. `signatureProfiles` (COL-WFL-47) (antes `profileId`; T05 §7.2: la referencia usa el nombre de la tabla). |
| `order` | enum | Sí | `sequential`, `parallel`. |
| `status` | enum | Sí | §8.7. |
| `requestedBy` | uniqueidentifier | Sí | Ref. `memberships` (T02). |
| `sourceRef` | object | Sí | `{ type, id }` del acto. |
| `expiresAt` | date | Sí | Vencimiento. |
| `externalRef` | string | No | Identificador del proveedor (T06); no es referencia interna. |
| `correlationId` | string | Sí | Traza. |

Índice `{ tenantId: 1, number: 1 }` único; `{ tenantId: 1, documentId: 1, status: 1 }`.

**`signatureParticipants`** (tenant)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `signatureRequestId` | uniqueidentifier | Sí | Ref. `signatureRequests`. |
| `order` | int | Sí | Orden. |
| `party` | object | Sí | `{ kind: user/member/employee/external/signerRegistry, id, name, taxId (enmascarado en vistas) }`; `id` → `memberships` (T02), `persons` (M01), `employees` (M16) o `treasuryAccountSigners` (M14) según `kind`; `taxId` es un dato, no una referencia. |
| `role` | enum | Sí | `signer`, `approver`, `witness`. |
| `position`, `anchor` | object / string | No | `{ page, x, y, w, h }` o ancla. |
| `status` | enum | Sí | `pending`, `notified`, `signed`, `rejected`, `expired` (§8.11). |
| `signedAt` | date | No | Firma. |
| `rejectReason` | string | Cond. | Obligatorio si `rejected`. |

Índice `{ tenantId: 1, signatureRequestId: 1, order: 1 }`.

**`signatureEvidences`** (tenant; inmutable)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `signatureParticipantId` | uniqueidentifier | Sí | Ref. `signatureParticipants` (antes `participantId`; nombre canónico de T05 §7.2 y §7.4.6). |
| `level` | enum | Sí | Nivel de `signatureProfiles.level`. |
| `documentSha256` | string | Sí | Huella firmada. |
| `signatureImageStoredFileId` | uniqueidentifier | Cond. | Ref. `storedFiles` (T01); manuscrita (antes `signatureImageFileId`; nombre con rol de T05 §7.2). |
| `otp` | object | No | `{ channel, verifiedAt }`. |
| `geo`, `device` | object | No | Evidencias. |
| `ip` | string | No | Seudonimizada. |
| `serverTimestamp` | date | Sí | Sello del servidor. |
| `providerEvidence` | object | Cond. | Digital: certificado, emisor, número de serie, sello de tiempo. |
| `verificationCode` | string | Sí | Código de verificación pública. |

Índice `{ tenantId: 1, signatureParticipantId: 1 }` único; `{ verificationCode: 1 }` único (lista blanca).

### 7.11 Expediente

**`dossiers`** (tenant; expedientes formales)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `number` | string | Sí | Según secuencia del tipo. |
| `kind` | enum | Sí | `deskEntry`, `assembly`, `legal`, `purchaseTender`, `employee`, `custom`. |
| `subjectRef` | object | No | `{ type, id }` del sujeto principal. |
| `title` | string | Sí | Carátula. |
| `status` | enum | Sí | `open`, `inProgress`, `closed`, `archived` (§8.8). |
| `responsibleAreaId` | uniqueidentifier | No | Ref. `crmAreas` (M09) (PA-WFL-22, antes "PA-WFL-nn"; Asumida DEC-072; antes "`crmAreas` (M09) o `workAreas` (M16) [VERIFICAR: T05 §7.2 no declara el destino de las áreas responsables genéricas]"). |
| `openedAt`, `closedAt` | date | Sí / No | Apertura y cierre. |
| `foliation` | object | No | `{ enabled, lastFolio }`. |
| `coverDocumentId` | uniqueidentifier | No | Ref. `documents`. |
| `legalHoldIds` | uniqueidentifier[] | No | Ref. `legalHolds` (T08). |

Índice `{ tenantId: 1, number: 1 }` único; `{ tenantId: 1, status: 1, kind: 1 }`.

**`dossierEntries`** (tenant)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `dossierId` | uniqueidentifier | Sí | Ref. `dossiers`. |
| `order` | int | Sí | Orden. |
| `entryType` | enum | Sí | `document`, `note`, `transfer`, `decision`, `instance`, `operation`. |
| `ref` | object | Cond. | `{ type, id }` → `documents`, `workflowInstances` u `operations` según `entryType`. |
| `folioFrom`, `folioTo` | int | No | Folios. |
| `addedBy`, `addedAt` | uniqueidentifier / date | Sí | `addedBy` → `memberships` (T02). |

Índice `{ tenantId: 1, dossierId: 1, order: 1 }` único.

El **expediente por sujeto** no tiene colección propia: es una vista sobre `documentLinks`, `workflowInstances`, `operations`, `approvalRequests` y los eventos `timeline` del sujeto, que proyecta `dossierTimeline` (proyección reconstruible por `wfl:reconstruir-proyecciones`).

**`dossierTimeline`** (tenant; proyección reconstruible; ficha agregada el 5-11-2026: antes solo se mencionaba)

| Campo | Tipo | Oblig. | Descripción |
|---|---|---|---|
| `subjectRef` | object | Sí | `{ type, id }` del sujeto del expediente. |
| `dossierId` | uniqueidentifier | No | Ref. `dossiers` si el hecho pertenece a un expediente formal. |
| `eventId` | string | Sí | `eventId` del evento de origen (`outboxEvents` de T01); único con `subjectRef`. |
| `type` | string | Sí | Tipo de evento (`eventTypes.type` con `timeline = true`). |
| `sourceRef` | object | Sí | `{ module, type, id }` del objeto que produjo el hecho. |
| `occurredAt` | date | Sí | Momento del hecho. |
| `titleKey`, `titleParams` | string / object | Sí | Diccionario. |
| `visibility` | enum | Sí | `internal`, `public` (de `eventTypes.visibility`). |
| `deepLink` | string | No | Ruta del detalle. |
| `retainUntil` | date | No | [VERIFICAR] heredado de la retención del sujeto. |

Índice `{ tenantId: 1, "subjectRef.type": 1, "subjectRef.id": 1, occurredAt: -1 }`; `{ tenantId: 1, eventId: 1, "subjectRef.id": 1 }` único.

### 7.12 Mapeo de tablas ProCoop

| Tabla ProCoop | Colección destino | Nota |
|---|---|---|
| `AUTORIZACIONES` | T02 `authorizationRequests` (histórico) | Las multipaso se migran como `approvalRequests` con `legacy: true` solo si siguen abiertas (§19). |
| `SAPROV` (`USU_AUTO`, `USU_AUTO2`), `OCOMPRA` (`AUTORIZADO`) | Evidencia `approval.legacy` en M12 | Sin convertir en aprobaciones T11 (M12 §19). |
| `PPAGOS_FIRMANTES`, `PPAGOS_FIRMAS` | Registro de firmantes (M14) + `signatureEvidences` históricas — **Reemplazado** (CTR-DAT-78 de T05): `PPAGOS_FIRMANTES` → `treasuryAccountSigners` de M14 (firmantes autorizados vigentes por entidad y módulo) y `PPAGOS_FIRMAS` → `paymentExecutions` de M14. Ninguna de las dos es origen de `signatureParticipants` ni de `signatureEvidences`: T11 toma los firmantes vigentes del registro de M14 al crear cada pedido de firma (RN-WFL-050). `paymentOrderSigners` no se crea | T11 no migra estas tablas. |
| `FIRMADIGITAL`, `FIRMADIGITAL_ITEMS`, `FIRMADIGITAL_USUARIOS` | `signatureRequests`, `signatureParticipants`; capability `wfl.documentos.firmar` | — |
| `FIRMASDIGITALES` | `signatureProfiles` + secreto en bóveda T06 | `CLIENT_SECRET` nunca en T11. |
| `FIRMASELECTRONICAS`, `FIRMASELECTRONICAS_DOCUMENTOS`, `FIRMASELECTRONICAS_DOC_USUARIOS` | `signatureRequests`, `documents`, `signatureParticipants` | — |
| `ADJUNTOS`, `PROCOOPAR_ADJUNTOS` | `documents`, `documentVersions`, `documentLinks` (+ `storedFiles` de T01) | `TIPO` → `documentTypes.legacyAdjuntosTipo`. |
| `RELACION_ENTIDADES` | `documentLinks` y vínculos del módulo dueño | — |
| `EXPEDIENTES`, `EXPEDIENTES_TRAM` | `dossiers`, `dossierEntries` — **Reemplazado** (CTR-DAT-62 de T05): van a `technicalProcedures` de M10 (expedientes técnicos, contenido técnico); `dossiers` no tiene origen ProCoop directo y se crea en CoopApps (COL-WFL-51) | M10 vincula cada `technicalProcedures` a un `dossiers` de T11 por `dossierId` cuando se abre el expediente formal. Mesa de entradas coordinada con M09. |
| `CLAS_INC` (`ULT_NUM`) | `numberingSequences` | — |
| `PTOVENTA`, `COMPPOS`, `COMPROB` (numeración) | `numberingSequences` con alcance fiscal (M05/M06) | Correlatividad fiscal en M06. |
| `PLANTILLA`, `VARIABLEPLANT` | `documentTemplates`, `templateDataContracts` | Las variables se remapean al contrato tipado. |
| `PLANTILLA_WSP`, `AUDIT_MAIL`, `PROMAIL` | T09 (plantillas y comunicaciones); `PROMAIL` → `taskComments` | — |
| `CIRCULAR` | M09 (corridas de circulares) + `documentTemplates` | — |
| `TRANSAC` | Máquinas de estado de M10/M02 (`stateMachineRegistry`) | Sin datos a migrar; solo definición. |
| `ENTIDA_ESTADOS`, `ENTIDADCIR`, `ENTIDAEST`, `ESTADOS` | Estados operativos de cada módulo dueño | — |
| `TRAMITES`, `TRAMITES_ACCIONES`, `PTRAMITES` | M09 (tipos y trámites presentados) + `workflowDefinitions`/`actionCatalog` | Los scripts SQL no se migran: se reescriben como acciones tipadas. |
| `REQUISITOS`, `REQUISITOS_ITEMS` | `formDefinitions`, `formVersions` | Tipos 0/1/2/3/7/9 → campos tipados; tipo 4 → fuente tipada. |
| `OPERACIONES`, `OPE_COM` | `operations` (histórico, `legacy`) | — |
| `BLOQUEO_FILAS` | Descartado | Control optimista (`version`) e índices únicos. |
| `CALENDARIO`, `CALENDARIO_TIPO`, `TIP_EVEN` | M09 calendario interno; proyección `agendaEntries` | — |

## 8. Estados y transiciones

### 8.1 Operación (`operations.status`)

| Origen | Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|---|
| — | `draft` | Usuario | Tipo activo | Guarda borrador (sin número) | Borrar borrador |
| `draft` / — | `pendingApproval` | Solicitante o módulo | Payload válido; evidencia si se exige | Número `OPE-`; `approvalRequests`; EVT-WFL-001 | `cancelled` |
| — | `approved` | Sistema | Política resuelve "sin aprobación" para el tramo | Decisión automática registrada (RN-WFL-051); EVT-WFL-002 | — |
| `pendingApproval` | `approved` | Motor de aprobación | `wfl.approval.decided` = `approved` | Encola `wfl:ejecutar-operacion`; EVT-WFL-002 | Operación de reversión |
| `pendingApproval` | `rejected` | Motor de aprobación | Decisión `rejected` | Aviso al solicitante; EVT-WFL-002 | Nueva solicitud |
| `pendingApproval` | `expired` | `wfl:vencer-aprobaciones` | `decisionDueAt` vencido | Aviso; EVT-WFL-002 | Nueva solicitud |
| `pendingApproval` / `approved` | `cancelled` | Solicitante / administrador | No iniciada la ejecución | EVT-WFL-002 | — |
| `approved` | `executing` | Worker | Revalidación de aprobación si superó PRM-WFL-011 | Pasos en curso; EVT-WFL-003 | — |
| `executing` | `completed` | Handler | Todos los pasos `succeeded` | `result`; EVT-WFL-004; línea de tiempo | Operación de reversión vinculada |
| `executing` | `failed` | Handler | Precondición de dominio no cumplida o paso no compensable fallido | Bandeja operativa; EVT-WFL-005 | Reintento manual (`wfl.operaciones.reintentar`) → `executing` |
| `executing` | `uncertain` | Handler | Efecto externo sin confirmar | `wfl:conciliar-inciertas`; EVT-WFL-005 | `reconciled` |
| `uncertain` | `reconciled` | Job o usuario con evidencia | Resultado verificado (aplicado o no aplicado) | Si aplicado → `completed`; si no → `failed` o `approved` para reintento; EVT-WFL-006 | — |
| `failed` | `compensated` | Worker | Tipo `compensable` y compensación exitosa | Efectos revertidos; EVT-WFL-005 | — |

### 8.2 Instancia de workflow (`workflowInstances.status`)

| Origen | Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|---|
| — | `draft` | Socio o empleado | Definición publicada en el canal | Borrador con vencimiento PRM-WFL-024 | Descartar |
| `draft` / — | `submitted` | Solicitante | Formulario válido; adjuntos obligatorios | Número; constancia; EVT-WFL-014 | `cancelled` |
| `submitted` | `inProgress` | Motor | Primer nodo activo | Tareas, temporizadores | — |
| `inProgress` | `waitingRequester` | Responsable | Falta información o documentación | Pausa SLA; aviso al solicitante (T09) | `inProgress` al responder |
| `inProgress` | `waitingThirdParty` | Motor / responsable | Espera de evento externo u otro módulo | Pausa SLA si la política lo declara | `inProgress` |
| `inProgress` | `inApproval` | Motor | Nodo de aprobación | `approvalRequests` | `inProgress` |
| `inProgress` / `inApproval` | `completed` | Motor | Nodo fin alcanzado | `outcome`; EVT-WFL-016 | Reapertura (si la definición la admite) → `inProgress` |
| `inApproval` | `rejected` | Motor | Aprobación rechazada y el diagrama termina en rechazo | `outcome = rejected`; EVT-WFL-016 | Nueva instancia |
| Cualquier no terminal | `cancelled` | Solicitante (si permitido) / administrador | Motivo | Cancela tareas y temporizadores; compensaciones declaradas; EVT-WFL-017 | — |
| No terminal | `expired` | `wfl:sla-monitor` | `dueAt` vencido y acción `expire` | Acciones de vencimiento (una vez); EVT-WFL-016 | — |
| No terminal | `suspended` | Administrador | Motivo (por ejemplo, orden judicial) | Congela temporizadores; EVT-WFL-017 | `inProgress` |

### 8.3 Corrida masiva (`bulkRuns.status`)

`draft` → `preparing` (congela universo) → `ready` → `running` → `succeeded` | `succeededWithExceptions` | `failed` | `cancelled`. Además:

- `running` → `paused`, con motivo `manual`, `systemic` o `threshold`;
- `paused` → `running`, al reanudar desde el cursor;
- `succeededWithExceptions` → `reprocess`, que crea una corrida hija con solo las excepciones resueltas.

Una corrida `cancelled` conserva los ítems ya confirmados; no se deshacen salvo con una operación de reversión del módulo dueño.

Tabla agregada el 5-11-2026 (PA-WFL-23); repite en formato de tabla lo que dice el texto anterior.

| Desde | Hacia | Disparador | Guarda (RN) | Evento |
|---|---|---|---|---|
| — | `draft` | Alta de la corrida por el módulo dueño | — | — |
| `draft` | `preparing` | Inicio de la preparación | — | — |
| `preparing` | `ready` | Universo congelado | — | — |
| `ready` | `running` | Ejecución (job de clase `batch`, §12.8) | — | — |
| `running` | `paused` | Pausa `manual`, `systemic` o `threshold` | Motivo obligatorio | EVT-WFL-048 `.paused` |
| `paused` | `running` | Reanudación desde el cursor | — | — |
| `running` | `succeeded` / `succeededWithExceptions` | Fin del universo | Con excepciones si hay ítems `failed` | EVT-WFL-048 `.completed` |
| `running` | `failed` | Error que impide seguir | — | EVT-WFL-048 `.failed` |
| `draft` / `preparing` / `ready` / `running` / `paused` | `cancelled` | Cancelación por el solicitante o un administrador | Conserva los ítems confirmados | EVT-WFL-048 `.cancelled` |
| `succeededWithExceptions` | `succeededWithExceptions` (corrida hija `reprocess`) | Reproceso de las excepciones resueltas | La corrida madre no cambia; la hija nace en `draft` | — |

### 8.4 Solicitud de aprobación (`approvalRequests.status`) y paso (`approvalSteps.status`)

| Origen | Destino | Actor | Precondición | Efectos |
|---|---|---|---|---|
| — | `pending` | Motor | Política resuelta con pasos | Activa el primer paso o todos los paralelos; EVT-WFL-007; `workItems` |
| `pending` | `pending` (paso siguiente) | Aprobador | Paso secuencial aprobado | EVT-WFL-009; activa el siguiente; EVT-WFL-008 |
| `pending` | `approved` | Motor | Todos los pasos obligatorios cumplidos (quórum) | EVT-WFL-010 `wfl.approval.decided` (`approved`) |
| `pending` | `rejected` | Aprobador / motor | Rechazo de paso obligatorio o quórum imposible (RN-WFL-048) | EVT-WFL-010 (`rejected`) |
| `pending` | `expired` | `wfl:vencer-aprobaciones` | `dueAt` vencido y `onExpire = expire` | EVT-WFL-012; EVT-WFL-010 (`expired`) |
| `pending` | `withdrawn` | Solicitante | RF-WFL-120 | EVT-WFL-012; EVT-WFL-010 (`withdrawn`) |
| `pending` | `invalidated` | Motor | Cambió `contentHash` (RN-WFL-043) | Decisiones previas caducan; nueva solicitud |

Paso: `waiting` → `active` → `approved` | `rejected` | `expired` | `skipped` (regla condicional). Un escalamiento no cambia el estado del paso: agrega candidatos o reasigna.

### 8.5 Tarea (`tasks.status`)

`open` → `inProgress` (tomada o iniciada) → `completed`. Además:

- `open`/`inProgress` → `blocked` (espera) → `inProgress`;
- `open`/`inProgress` → `cancelled` (con motivo);
- `completed` → `reopened` → `inProgress` (si el origen lo admite y dentro de PRM-WFL-026 días).

Completar exige checklist y evidencias obligatorias. Las ocurrencias recurrentes vencidas pasan a la vista "Vencida" sin cambiar de estado y se cierran "en término" o "fuera de término" según la fecha real de cierre (RN-WFL-039).

Tabla agregada el 5-11-2026 (PA-WFL-23); repite en formato de tabla lo que dice el texto anterior.

| Desde | Hacia | Disparador | Guarda (RN) | Evento |
|---|---|---|---|---|
| — | `open` | Creación de la tarea | — | EVT-WFL-023 |
| `open` | `inProgress` | La toma o la inicia el asignado | — | EVT-WFL-024 `.claimed` |
| `open` / `inProgress` | `blocked` | Espera de un tercero | — | — |
| `blocked` | `inProgress` | Fin de la espera | — | — |
| `inProgress` | `completed` | Cierre por el asignado | Checklist y evidencias obligatorias (RN-WFL-039) | EVT-WFL-025 `.completed` |
| `open` / `inProgress` | `cancelled` | Cancelación con motivo | Motivo obligatorio | EVT-WFL-025 `.cancelled` |
| `completed` | `reopened` | Reapertura | El origen la admite y dentro de PRM-WFL-026 días | EVT-WFL-025 `.reopened` |
| `reopened` | `inProgress` | El asignado retoma la tarea | — | — |

### 8.6 Documento (`documents.status`) y versión

| Origen | Destino | Actor | Precondición | Efectos | Reversión |
|---|---|---|---|---|---|
| — | `uploading` | Usuario o sistema | URL firmada emitida | — | Vence y se limpia (JOB-PLA-17) |
| `uploading` | `scanning` | Callback | Objeto confirmado | `pla:escanear-archivo` | — |
| `scanning` | `available` | Escaneo | `clean` | EVT-WFL-028; miniatura | — |
| `scanning` | `quarantined` | Escaneo | `infected` o tipo real no admitido | Aviso al que subió; no descargable | Anular |
| `available` | `available` (nueva versión) | Usuario | Tipo no bloqueado por firma (RN-WFL-071) | `documentVersions` nueva; EVT-WFL-028 | — |
| `available` | `voided` | `wfl.documentos.anular` | Sin legal hold; no es emitido inmutable o la anulación la decide el módulo dueño | Oculto en vistas; conserva versiones; EVT-WFL-031 | Restaurar con motivo dentro de PRM-WFL-042 días |
| `available` / `voided` | `retentionExpired` | `wfl:aplicar-retencion` | `retainUntil` cumplido | Candidato a purga; EVT-WFL-032 | Extender retención |
| `retentionExpired` | `purged` | `wfl:purgar-documentos` | Sin hold, sin vínculo económico vigente | Borra binarios (T01); deja lápida con hash; EVT-WFL-032 | No reversible |

Versión aceptada: una versión `available` pasa a `accepted` al ser usada en un acto (RN-WFL-062). Es inmutable mientras dure la retención.

### 8.7 Solicitud de firma (`signatureRequests.status`)

`draft` → `sent` → `partiallySigned` → `completed`. Además:

- `sent`/`partiallySigned` → `rejected` (un firmante rechaza);
- `sent`/`partiallySigned` → `expired` (vence `expiresAt`);
- `draft`/`sent` → `cancelled` (lo cancela el solicitante);
- para firma digital: `sent` → `providerPending` → `completed` o `failed`, según `int.signature.*`.

Con `completed` se crea la versión firmada (`signedVersionId`) y se marca como aceptada (EVT-WFL-042).

Tabla agregada el 5-11-2026 (PA-WFL-23); repite en formato de tabla lo que dice el texto anterior.

| Desde | Hacia | Disparador | Guarda (RN) | Evento |
|---|---|---|---|---|
| — | `draft` | Alta del pedido de firma | — | — |
| `draft` | `sent` | Envío a los firmantes | Al menos un participante | EVT-WFL-041 `.requested` |
| `sent` | `partiallySigned` | Firma de un participante sin completar el circuito | RN-WFL-050 (firmante vigente) | EVT-WFL-041 `.participantSigned` |
| `sent` / `partiallySigned` | `completed` | Firma del último participante | — | EVT-WFL-042 |
| `sent` | `providerPending` | Firma digital enviada al proveedor (T06) | Perfil de firma digital | — |
| `providerPending` | `completed` / `failed` | `int.signature.completed` / `int.signature.rejected` (EVT-INT-18) | — | EVT-WFL-042 / EVT-WFL-043 |
| `sent` / `partiallySigned` | `rejected` | Un firmante rechaza | Motivo obligatorio | EVT-WFL-043 `.rejected` |
| `sent` / `partiallySigned` | `expired` | Vence `expiresAt` | — | EVT-WFL-043 `.expired` |
| `draft` / `sent` | `cancelled` | Cancelación por el solicitante | — | EVT-WFL-043 `.cancelled` |

### 8.8 Expediente formal (`dossiers.status`)

`open` → `inProgress` (primer pase) → `closed` (respuesta final o resolución) → `archived` (tras PRM-WFL-050 días). Además:

- `closed` → `inProgress`: reapertura con motivo;
- `archived` → `inProgress`: solo por operación aprobada.

Tabla agregada el 5-11-2026 (PA-WFL-23); repite en formato de tabla lo que dice el texto anterior.

| Desde | Hacia | Disparador | Guarda (RN) | Evento |
|---|---|---|---|---|
| — | `open` | Apertura del expediente | — | EVT-WFL-044 `.opened` |
| `open` | `inProgress` | Primer pase | — | — |
| `inProgress` | `closed` | Respuesta final o resolución | — | EVT-WFL-044 `.closed` |
| `closed` | `archived` | Pasan PRM-WFL-050 días | — | EVT-WFL-044 `.archived` |
| `closed` | `inProgress` | Reapertura | Motivo obligatorio | — |
| `archived` | `inProgress` | Reapertura de un archivado | Operación aprobada (§8.1) | — |

### 8.9 Ítem de bandeja operativa (`operationalInboxItems.status`)

`open` → `inProgress` (lo toma alguien) → `resolved` | `discarded` (con motivo). Si la misma causa reaparece después de `resolved`, se reabre el ítem (`dedupeKey`). (Título con la colección agregado el 5-11-2026; antes "8.9 Ítem de bandeja operativa".)

Tabla agregada el 5-11-2026 (PA-WFL-23); repite en formato de tabla lo que dice el texto anterior.

| Desde | Hacia | Disparador | Guarda (RN) | Evento |
|---|---|---|---|---|
| — | `open` | Excepción de un proceso (corrida, operación, render, conector) | `dedupeKey` sin ítem abierto | EVT-WFL-046 `.itemOpened` |
| `open` | `inProgress` | Lo toma un responsable | — | — |
| `open` / `inProgress` | `resolved` | Causa resuelta | — | EVT-WFL-046 `.itemResolved` |
| `open` / `inProgress` | `discarded` | Descarte | Motivo obligatorio | EVT-WFL-046 `.itemResolved` |
| `resolved` | `open` | La misma causa reaparece | Mismo `dedupeKey` | EVT-WFL-046 `.itemOpened` |

### 8.10 Delegación (`delegations.status`)

`scheduled` → `active` (al llegar `from`) → `ended` (al llegar `to`). Además, `scheduled`/`active` → `revoked` (por el delegante o un administrador). (Título con la colección agregado el 5-11-2026; antes "8.10 Delegación".)

Tabla agregada el 5-11-2026 (PA-WFL-23); repite en formato de tabla lo que dice el texto anterior.

| Desde | Hacia | Disparador | Guarda (RN) | Evento |
|---|---|---|---|---|
| — | `scheduled` / `active` | Alta de la delegación | `active` si `from` ya llegó | EVT-WFL-013 `.activated` (si nace activa) |
| `scheduled` | `active` | Llega `from` | — | EVT-WFL-013 `.activated` |
| `active` | `ended` | Llega `to` | — | EVT-WFL-013 `.ended` |
| `scheduled` / `active` | `revoked` | Revocación por el delegante o un administrador | — | EVT-WFL-013 `.revoked` |

### 8.11 Máquinas de estado de catálogos, proyecciones y colecciones auxiliares

Agregado el 5-11-2026: estas colecciones declaraban estados en el §7 sin tabla de transiciones. En el cierre de residuales del mismo día los subtítulos en negrita pasaron a encabezados numerados (8.11.1 a 8.11.14) y se agregaron 8.11.15 y 8.11.16. "—" en Desde indica el estado inicial al crear el documento; "—" en Evento indica que la transición no publica evento propio.

#### 8.11.1 `eventTypes.status` y `templateDataContracts.status` (sincronizados desde código)

| Desde | Hacia | Disparador | Guarda (RN) | Evento |
|---|---|---|---|---|
| — | `active` | Despliegue que sincroniza el esquema | RN-WFL-003 (nombre canónico) | — |
| `active` | `deprecated` | Despliegue con nueva `schemaVersion` o versión del contrato | Convivencia de versiones (RF-WFL-005) | — |
| `deprecated` | `retired` | Llega `sunsetAt` | Sin consumidores en la versión vieja (CTR-WFL-03) | — |

#### 8.11.2 `jobSchedules.status`

| Desde | Hacia | Disparador | Guarda (RN) | Evento |
|---|---|---|---|---|
| — | `active` | Alta del módulo (EVT-PLA-06) o despliegue | Job `trigger` incluye `schedule` | EVT-WFL-047 |
| `active` | `paused` | Tenant suspendido (EVT-PLA-03) o pausa manual | §12.6 regla 7 | EVT-WFL-047 |
| `paused` | `active` | Tenant reactivado (EVT-PLA-04) o reanudación manual | Sin recuperación de disparos salvo `catchUp: true` (§12.6 regla 7) | EVT-WFL-047 |
| `active` / `paused` | `disabled` | Módulo desactivado (EVT-PLA-07) o tenant cerrado (EVT-PLA-05) | — | EVT-WFL-047 |
| `disabled` | `active` | Módulo reactivado (EVT-PLA-06) | — | EVT-WFL-047 |

#### 8.11.3 `bulkRunItems.status`

| Desde | Hacia | Disparador | Guarda (RN) | Evento |
|---|---|---|---|---|
| — | `succeeded` / `failed` / `skipped` | Resultado del procesamiento del ítem | Solo se guardan ítems con excepción o resultado relevante | — |
| `failed` | `excluded` | Acción "excluir" en la bandeja | RF-WFL-028 | — |
| `failed` | `reprocessed` | Corrida hija `reprocess` (§8.3) | Excepción resuelta (RF-WFL-028) | EVT-WFL-048 (de la corrida hija) |

#### 8.11.4 `operationSteps.status`

| Desde | Hacia | Disparador | Guarda (RN) | Evento |
|---|---|---|---|---|
| — | `pending` | Operación pasa a `executing` | — | — |
| `pending` | `running` | Worker toma el paso | Paso anterior `succeeded` | EVT-WFL-003 |
| `pending` | `skipped` | Paso condicional que no aplica | Condición del tipo de operación | — |
| `running` | `succeeded` | Handler confirma | — | — |
| `running` | `failed` | Handler falla | Reintentos agotados | EVT-WFL-005 |
| `running` | `uncertain` | Efecto externo sin confirmar | `externalEffect = true` (RF-WFL-031) | EVT-WFL-005 |
| `uncertain` | `succeeded` / `failed` | Conciliación o resultado verificado | RF-WFL-046 | EVT-WFL-006 |
| `failed` | `compensated` | Compensación ejecutada | Tipo `compensable` | EVT-WFL-005 |

#### 8.11.5 `workflowDefinitions.status` y `documentTemplates.status`

| Desde | Hacia | Disparador | Guarda (RN) | Evento |
|---|---|---|---|---|
| — | `active` | Alta de la definición o plantilla (las versiones nacen en `draft`) | Código único | — |
| `active` | `retired` | Retiro por el administrador | Sin instancias o renders en curso con la versión vigente | EVT-WFL-018 (definición), EVT-WFL-036 `.retired` (plantilla) |

#### 8.11.6 `approvalPolicies.status` (por versión)

| Desde | Hacia | Disparador | Guarda (RN) | Evento |
|---|---|---|---|---|
| — | `draft` | Edición (API-WFL-38) | — | — |
| `draft` | `inReview` | Publicar con PRM-WFL-030 activo | Simulación sin errores | EVT-WFL-007 (aprobación de la política) |
| `draft` / `inReview` | `published` | Publicación (API-WFL-39) o aprobación decidida | Aprobada si PRM-WFL-030 | — |
| `inReview` | `draft` | Aprobación rechazada | — | — |
| `published` | `retired` | Se publica otra versión con `validFrom` posterior | — | — |

#### 8.11.7 `slaTimers.status`

| Desde | Hacia | Disparador | Guarda (RN) | Evento |
|---|---|---|---|---|
| — | `running` | Objeto con política de SLA entra en un estado medido | — | — |
| `running` | `paused` | Objeto entra en un estado de `pauseOnStates` | — | — |
| `paused` | `running` | Objeto sale del estado de pausa | — | — |
| `running` | `breached` | `wfl:sla-monitor`: vence `dueAt` | — | EVT-WFL-021 |
| `running` / `paused` / `breached` | `completed` | Objeto cerrado | — | — |
| `running` / `paused` | `cancelled` | Objeto cancelado | — | — |

#### 8.11.8 `approvalSteps.status` (amplía §8.4)

| Desde | Hacia | Disparador | Guarda (RN) | Evento |
|---|---|---|---|---|
| — | `waiting` | Creación de la solicitud | — | — |
| `waiting` | `active` | Paso anterior aprobado o modo paralelo | — | EVT-WFL-008 |
| `active` | `approved` | Quórum alcanzado | SoD (RN-WFL-048) | EVT-WFL-009 |
| `active` | `rejected` | Rechazo de un aprobador obligatorio | — | EVT-WFL-009 |
| `active` | `expired` | Vence `dueAt` con `onExpire = expire` | — | EVT-WFL-012 |
| `waiting` / `active` | `skipped` | Regla condicional que no aplica | — | — |

#### 8.11.9 `workItems.status` (proyección)

| Desde | Hacia | Disparador | Guarda (RN) | Evento |
|---|---|---|---|---|
| — | `open` | Evento del origen (tarea, paso de aprobación, caso, orden) | `sourceVersion` mayor que la guardada | — |
| `open` | `snoozed` | Usuario pospone (API-WFL-05) | — | — |
| `snoozed` | `open` | Llega `snoozedUntil` | — | — |
| `open` / `snoozed` | `done` | Origen completado | — | — |
| `open` / `snoozed` | `cancelled` | Origen cancelado | — | — |

#### 8.11.10 `agendaFeeds.status`, `shareLinks.status`

| Desde | Hacia | Disparador | Guarda (RN) | Evento |
|---|---|---|---|---|
| — | `active` | Alta del feed (API-WFL-14) o del enlace (API-WFL-57) | — | EVT-WFL-034 (enlace) |
| `active` | `revoked` | Revocación por el usuario o un administrador | — | EVT-WFL-034 (enlace) |
| `active` | `expired` | Solo `shareLinks`: vence `expiresAt` o se alcanza `maxDownloads` | — | — |

#### 8.11.11 `renderRequests.status`

| Desde | Hacia | Disparador | Guarda (RN) | Evento |
|---|---|---|---|---|
| — | `queued` | Pedido de render | `idempotencyKey` no usada | — |
| `queued` | `rendering` | Worker toma el pedido | — | — |
| `rendering` | `succeeded` | Documento generado | — | EVT-WFL-037 |
| `rendering` | `failed` | Error de render | Reintentos agotados | EVT-WFL-038 |
| `failed` | `queued` | Reintento manual con la misma clave | — | — |

#### 8.11.12 `numberingSequences.status` y `numberingAssignments.status`

| Desde | Hacia | Disparador | Guarda (RN) | Evento |
|---|---|---|---|---|
| — | `active` | Alta de la secuencia | Índice único `{ code, scopeHash }` | — |
| `active` | `closed` | Cambio de período según `resetPolicy` o cierre manual | — | — |
| — | `assigned` | Asignación de un número `gapless` o trazable | — | — |
| `assigned` | `voided` | Anulación con `voidReason` | — | EVT-WFL-039 |

#### 8.11.13 `signatureParticipants.status`

| Desde | Hacia | Disparador | Guarda (RN) | Evento |
|---|---|---|---|---|
| — | `pending` | Creación del pedido de firma | — | — |
| `pending` | `notified` | Pedido enviado y turno del participante | — | EVT-WFL-041 `.requested` |
| `notified` | `signed` | Firma válida | RN-WFL-050 (firmante vigente) | EVT-WFL-041 `.participantSigned` |
| `notified` | `rejected` | Rechazo con motivo | — | EVT-WFL-043 |
| `pending` / `notified` | `expired` | Vence `expiresAt` | — | EVT-WFL-043 |

#### 8.11.14 `agendaEntries.status` (proyección)

Copia el estado del origen (`confirmed`, `tentative`, `cancelled`); no tiene transiciones propias.

#### 8.11.15 `workflowVersions.status`, `templateVersions.status` y `formVersions.status`

Agregado el 5-11-2026 (PA-WFL-23). `formVersions` no tiene `inReview` (§7.4).

| Desde | Hacia | Disparador | Guarda (RN) | Evento |
|---|---|---|---|---|
| — | `draft` | Nueva versión de la definición, plantilla o formulario | — | — |
| `draft` | `inReview` | Envío a revisión (solo `workflowVersions` y `templateVersions`) | La publicación exige aprobación | EVT-WFL-007 |
| `inReview` | `draft` | Aprobación rechazada | — | — |
| `draft` / `inReview` | `published` | Publicación o aprobación decidida | Validación sin errores; `formVersions` queda inmutable | EVT-WFL-018 `.published` (workflow), EVT-WFL-036 `.published` (plantilla); — (formulario) |
| `published` | `retired` | Se publica otra versión o se retira la definición | Sin instancias, renders ni presentaciones en curso con esa versión | EVT-WFL-018 `.retired` (workflow), EVT-WFL-036 `.retired` (plantilla); — (formulario) |

#### 8.11.16 `documentVersions.scanStatus`

Agregado el 5-11-2026 (PA-WFL-23). Espejo de `storedFiles.scanStatus` (T01); mueve `documents.status` según §8.6.

| Desde | Hacia | Disparador | Guarda (RN) | Evento |
|---|---|---|---|---|
| — | `pending` | Alta de la versión | — | — |
| `pending` | `clean` | Escaneo sin hallazgos (`pla:escanear-archivo`) | — | EVT-WFL-028 |
| `pending` | `infected` | Escaneo con hallazgos o tipo real no admitido | — | — (el documento pasa a `quarantined`, §8.6) |
| `pending` | `failed` | Error del escáner | Reintentos agotados | — |
| `failed` | `pending` | Reintento del escaneo | — | — |

`operationTypes` no tiene campo de estado: `cat.contract.forceStatus` (§7.3) es un código de operación, no un estado (aclarado el 5-11-2026).

### 8.12 Estado inicial de cada máquina

| Colección y campo | Estado inicial | Fuente |
|---|---|---|
| `operations.status` | `draft` o `pendingApproval` (o `approved` si la política no exige aprobación) | §8.1 |
| `workflowInstances.status` | `draft` o `submitted` | §8.2 |
| `bulkRuns.status` | `draft` | §8.3 |
| `approvalRequests.status` | `pending` | §8.4 |
| `approvalSteps.status` | `waiting` | §8.11 |
| `tasks.status` | `open` | §8.5 |
| `documents.status` | `uploading` | §8.6 |
| `documentVersions.scanStatus` | `pending` | §8.11.16; espejo de `storedFiles` (T01) |
| `signatureRequests.status` | `draft` | §8.7 |
| `signatureParticipants.status` | `pending` | §8.11 |
| `dossiers.status` | `open` | §8.8 |
| `operationalInboxItems.status` | `open` | §8.9 |
| `delegations.status` | `scheduled` (o `active` si `from` ya llegó) | §8.10 |
| `eventTypes.status`, `templateDataContracts.status` | `active` | §8.11 |
| `jobSchedules.status` | `active` | §8.11 |
| `bulkRunItems.status` | El del resultado (`succeeded`, `failed` o `skipped`) | §8.11 |
| `operationSteps.status` | `pending` | §8.11 |
| `workflowDefinitions.status`, `documentTemplates.status` | `active` | §8.11 |
| `workflowVersions.status`, `templateVersions.status`, `formVersions.status` | `draft` | §8.11.15 (antes §7.4, §7.8) |
| `approvalPolicies.status` | `draft` | §8.11 |
| `slaTimers.status` | `running` | §8.11 |
| `workItems.status` | `open` | §8.11 |
| `agendaEntries.status` | El del origen | §8.11 |
| `agendaFeeds.status`, `shareLinks.status` | `active` | §8.11 |
| `renderRequests.status` | `queued` | §8.11 |
| `numberingSequences.status` | `active` | §8.11 |
| `numberingAssignments.status` | `assigned` | §8.11 |

## 9. Procesos y flujos

### 9.1 Publicación y consumo de eventos (P-WFL-01)

1. El servicio del módulo productor abre la transacción, aplica el cambio y llama a `publish(event, { session })`. T01 valida el tipo contra `eventTypes` (RF-WFL-002/003) e inserta en `outboxEvents`.
2. El relay de T01 (JOB-PLA-01) encola un job en la cola del consumidor por cada suscripción activa (`eventSubscriptions`) con `jobId = <eventId>:<consumer>`. No encola si el módulo consumidor no está activo en el tenant.
3. El handler corre con el contexto del evento. Si la suscripción es `perAggregate`, verifica que `aggregateVersion` sea la siguiente esperada; si es mayor, reencola con espera (RF-WFL-009).
4. Aplica el efecto e inserta `inboxReceipts` en la misma transacción. Si ya existía, termina sin efecto.
5. Ante un error, reintenta con backoff (PRM-PLA-027). Agotados los reintentos, el evento va a `deadLetters` (T01). Si el tipo tiene `businessImpact`, T11 crea u actualiza `operationalInboxItems` con `dedupeKey = <type>:<consumer>:<aggregateId>` y responsable (RN-WFL-004).
6. Desde la bandeja operativa (PAN-WFL-22), el usuario corrige la causa y reprocesa. T11 reencola por la API de T01 con la misma clave y marca `resolved` cuando el consumidor confirma.

**Recuperación:** si el relay se cae, los `pending` se entregan al volver (sondeo de respaldo). Tras una restauración del tenant (EVT-PLA-14), los consumidores con `restoreHooks` reconcilian. Los eventos ya publicados no se vuelven a entregar salvo con *replay* explícito.

### 9.2 Programación de jobs por tenant (P-WFL-02)

1. Al desplegar, `jobDefinitions` se sincroniza desde los manifiestos.
2. Al activar un módulo en un tenant (EVT-PLA-06), T11 crea `jobSchedules` con `defaultCron`, `timezone` del tenant y `status = active`. Al desactivarlo (EVT-PLA-07), pasan a `disabled`.
3. El scheduler líder de T01 lee `jobSchedules` con `nextRunAt <= now`, verifica la ventana, el calendario y el estado del tenant, encola el job con `jobKey = <job>:<tenantId>:<fechaLocal>` y recalcula `nextRunAt` en la zona del tenant.
4. Si el disparo quedó fuera de ventana (caída, mantenimiento), aplica `skipIfMissed` o difiere a la próxima apertura (RN-WFL-007).
5. Reprogramar (PAN-WFL-21) valida el cron, la ventana y el permiso `wfl.jobs.programar`, audita el cambio y emite EVT-WFL-047.

### 9.3 Corrida masiva con excepciones (P-WFL-03; BASE §69, CU-LOT-01)

1. El módulo dueño crea `bulkRuns` en `draft` con criterio y fuente.
2. `preparing`: el job congela el universo (lista de ids y versión) y calcula `total`.
3. Si el tipo exige aprobación (por ejemplo, `fac.billingRun.approveEmission`), se crea la operación y se espera `approved`.
4. `running`: procesa en bloques de PRM-WFL-010 ítems. Cada ítem va en su transacción con idempotencia `<run>:<item>`; actualiza el progreso cada bloque y revisa `cancelRequested` y `pauseRequested`.
5. Las excepciones se registran en `bulkRunItems` con `reasonCode`, `ownerModule` y `ownerRole`, y crean `workItems` agrupados por motivo y responsable.
6. Umbral de fallo global (RN-WFL-011) o evento sistémico (`fis.authorization.globalFailure`, `int.circuit.opened`): `paused` con motivo; aviso al responsable.
7. Fin: `succeeded` o `succeededWithExceptions`; archivo de resultado; EVT-WFL-048.
8. Reproceso: tras resolver las excepciones, se crea una corrida `reprocess` solo con ellas. Los ya procesados no se tocan.

Ejemplo CU-LOT-01: la corrida `LOT-2026-00012` de 100 obligaciones termina con 98 `succeeded` y 2 `failed` (motivos `missingTaxData` y `addressNotNormalized`), asignadas a T-FAC y T-ATE. El reproceso de las 2 crea `LOT-2026-00013`.

### 9.4 Operación sensible (P-WFL-04; MER-012)

1. El usuario inicia la acción en la pantalla del módulo (por ejemplo, "Anular recibo"). La pantalla pide motivo y evidencia según el tipo.
2. El módulo llama a `wfl.operations.request` dentro de su transacción. T11 calcula `contentHash`, resuelve la política (regla según importe y riesgo), crea `operations` y `approvalRequests` y emite EVT-WFL-001 y EVT-WFL-007. El módulo marca la entidad como "con operación pendiente" (lectura) sin cambiar su estado de negocio.
3. Los aprobadores reciben `workItems` y aviso (T09). Cada decisión verifica `authorize()`, SoD, límite, MFA y huella (RN-WFL-040 a 043).
4. Con `approved`, se encola `wfl:ejecutar-operacion` en la cola declarada por el tipo. El worker llama al handler del módulo con `operationId` como clave; el handler revalida y aplica (RN-WFL-024).
5. Si son varios pasos, cada uno se registra en `operationSteps` y se confirma de a uno. Ante una falla, `wfl:reparar-operaciones` reintenta desde el último confirmado; si no se puede, `failed` y bandeja operativa.
6. Con un efecto externo sin confirmar, el estado es `uncertain` y `wfl:conciliar-inciertas` consulta. Vencido PRM-WFL-012, la resolución es manual con evidencia.
7. Al completar se emite EVT-WFL-004, se registra en el expediente del sujeto y se avisa al solicitante.

Ejemplo CU-29 (BASE §29): el cajero USR-CAJ-01 solicita anular el recibo R-0001-00004567 de ARS 18.450,00 por error de cuenta. La política de `cob.receipt.void` para importes de hasta ARS 50.000 exige un paso de T-TES distinto del cajero. La tesorera aprueba con MFA. M07 anula el recibo, revierte las imputaciones y publica `cob.receipt.voided`. M15 contabiliza la reversión.

### 9.5 Aprobación multinivel por monto con firma conjunta (P-WFL-05)

1. M12 envía la OP `OP-2026-000210` de ARS 3.200.000 a aprobación con `cmp.paymentOrder.approve`.
2. La política `POL-CMP-OP` tiene estas reglas:
   - hasta ARS 500.000: responsable de compras;
   - de ARS 500.000 a 2.000.000: responsable de compras y luego gerencia;
   - más de ARS 2.000.000: responsable de compras, luego gerencia y luego firma conjunta de 2 de 3 firmantes vigentes de M14.
3. T11 crea 3 pasos. Activa el paso 1; al aprobarse, el paso 2; al aprobarse, el paso 3 en paralelo con quórum 2 entre los firmantes vigentes a la fecha (RN-WFL-050).
4. Si el tesorero que registró el CBU es firmante, la SoD de T02 (`cmp.proveedores.datosBancarios.editar` ≠ quien paga) lo excluye.
5. Con quórum, `wfl.approval.decided` (`approved`). M12 pasa la OP a `approved` y publica `cmp.paymentOrder.approved`. M14 ejecuta y, si el perfil lo exige, firma digital por T06.

### 9.6 Trámite configurable iniciado por el socio (P-WFL-06)

1. El socio elige en "Mis trámites" la opción "Solicitud de tarifa social" (`WF-TAR-TARIFA-SOCIAL`). El formulario precarga los datos validados (RN-WFL-036) y pide la constancia de ingresos (tipo documental `DOC-INC-CONST`) y la declaración jurada.
2. Envío: `formSubmissions` inmutable, número `TRM-2026-000318` y constancia PDF (plantilla `TPL-CRM-02`). Se emite EVT-WFL-014 y EVT-WFL-019. M09 crea o vincula el caso, según la definición.
3. Nodo "Verificar documentación", asignado al área "Atención Comercial". El SLA es de 3 días hábiles. Al 75 % se avisa al responsable; al 100 % se escala al supervisor.
4. Si falta documentación, la instancia pasa a `waitingRequester` (pausa el SLA) y el socio recibe el aviso. Al adjuntar, se reanuda.
5. Nodo de aprobación del supervisor comercial.
6. Acción tipada `tar.enrollment.create` (M04) con vigencia y vencimiento a 12 meses. Se espera el evento `tar.enrollment.changed`.
7. Fin `completed`. Al vencer el trámite, la acción `tar.enrollment.end` se ejecuta una sola vez (RN-WFL-035) y se avisa 30 días antes.

### 9.7 Tarea ad hoc recurrente (P-WFL-07; BASE §26)

1. El supervisor crea TAR-001 "Revisar padrón de tarifa social":
   - recurrencia `FREQ=MONTHLY;BYMONTHDAY=5`, en la zona del tenant;
   - asignada al área "Atención Comercial";
   - evidencia obligatoria: un documento de tipo "Informe de control".
2. `wfl:generar-tareas-recurrentes` crea cada ocurrencia el día anterior (`recurrence.seriesId` + `occurrenceDate`, única).
3. Recordatorio el día de vencimiento (`wfl:recordatorios-tareas`). Si vence, aparece en "Vencidos" y escala según SLA.
4. Completar exige el adjunto. El cierre se clasifica "en término" o "fuera de término".

### 9.8 Documento generado por plantilla (P-WFL-08)

1. El módulo dueño arma el view-model según su contrato (por ejemplo, `fac.invoice.v3`) y llama a `wfl.templates.render`.
2. T11 elige la versión publicada vigente a la fecha del documento, valida los datos contra el contrato y renderiza HTML → PDF (cola `interactive` si es uno; `batch` si es lote). Aplica PDF/A si el tipo lo exige, copias y marcas de agua.
3. Guarda `storedFiles` (T01), `documents` y `documentVersions` con `generatedFrom`. Vincula al sujeto y numera si el tipo lo exige.
4. Idempotencia `renderRequests.idempotencyKey`: un reintento devuelve el mismo documento.
5. Documento emitido: queda `accepted` e inmutable (RN-WFL-065). La reimpresión agrega una marca y un registro, pero no un documento nuevo.

### 9.9 Firma electrónica de recibos de sueldo (P-WFL-09; FIC 15, DFA M20)

1. M16 emite los recibos (`sue:emitir-recibos-pdf` usa el render de T11) y pide a T11 la firma del empleador (JOB-SUE-04 llama a API-WFL-75; T11 la ejecuta con JOB-WFL-17). El perfil `SIG-SUE-EMPLEADOR` es firma digital con proveedor licenciado por T06 (DEC-078).
2. Con la firma del empleador, T11 crea `signatureRequests` por empleado con el perfil `SIG-SUE-EMPLEADO` (electrónica, OTP por SMS o email).
3. El empleado abre el recibo en la PWA, lo lee, acepta el texto legal, ingresa el OTP y firma. Se generan las evidencias (hash, hora del servidor, OTP verificado, dispositivo) y se emite EVT-WFL-041.
4. M16 recibe `wfl.signature.completed` y marca `sue.payslip.acknowledged`. Ante un rechazo con motivo, RRHH recibe una tarea.
5. `wfl:consultar-estado-firma` sondea los proveedores en firma digital. `wfl:vencer-firmas` aplica vencimientos y recordatorios. JOB-SUE-06 y JOB-SUE-19 de M16 se retiraron en favor de estos jobs (CTR-WFL-12).

### 9.10 Conformidad de instalación en campo (P-WFL-10; BASE §73, DFA M14)

1. El técnico cierra la OT en la PWA de campo (offline admitido). T11 genera el "Acta de conformidad de instalación" (`TPL-TEC-02`) localmente, con los datos de la OT y el equipo en comodato.
2. El socio firma en pantalla (manuscrita digitalizada) con nombre y DNI declarados. Se capturan geolocalización (si se autoriza), fecha y hora, y dispositivo.
3. Al sincronizar (`clientMutationId`), se crean el documento, la versión aceptada y las evidencias. M10 publica `tec.conformity.signed`.
4. Si el socio se niega, se registra `tec.conformity.refused` con motivo y foto opcional.

### 9.11 Retención y purga (P-WFL-11)

1. `wfl:aplicar-retencion` (diario, 03:00 en la zona del tenant) calcula `retainUntil` para los documentos sin fecha y marca `retentionExpired` cuando vence. Excluye los que tienen legal hold o un vínculo económico vigente.
2. Los documentos vencidos quedan `PRM-WFL-043` días en "pendientes de purga", visibles para T-ADM, que puede extender la retención.
3. `wfl:purgar-documentos` borra los binarios por medio de T01, deja una lápida (hash, tipo, fechas, motivo) y emite EVT-WFL-032.
4. Las políticas `toValidate` no purgan (RN-WFL-064): solo informan.

### 9.12 Expediente: consulta y exportación (P-WFL-12)

1. El usuario abre el expediente de un sujeto. T11 consulta `documentLinks` y `dossierTimeline` con el alcance del usuario y filtra la sensibilidad.
2. Al exportar, se crea un job de clase `export` (`wfl:exportar-expediente`) que arma un ZIP con un PDF índice (plantilla `TPL-WFL-01`) y los documentos visibles. El job audita y deja el archivo con vencimiento (PRM-PLA-024). Se emite EVT-WFL-045.

### 9.13 Mesa de entradas coordinada (P-WFL-13; MER-016, DFA M21)

1. El operador de M09 registra la entrada (`crmCases.kind = deskEntry`): remitente, tipo de documento, folios y plazo de respuesta.
2. T11 asigna el número `ME-2026-000045` (secuencia `gapless`), abre `dossiers` (kind `deskEntry`), genera el acuse (`TPL-CRM-04`) y la carátula (`TPL-WFL-02`) y digitaliza los documentos recibidos.
3. Cada pase a otra área crea un `workItem` de tipo `deskTransfer` que el área destino debe acusar; el plazo de respuesta corre en días hábiles.
4. La respuesta se registra como salida con su número (`MS-2026-000019`) vinculado. Al cerrar, el expediente queda `closed`.

### 9.14 Proyección de la bandeja (P-WFL-14)

1. `wfl:proyectar-bandeja` consume los eventos de las fuentes (§12.5): `wfl.task.*`, `wfl.approval.*`, `iam.authorization.*`, `crm.case.assigned`/`statusChanged`, `tec.workOrder.statusChanged`, `tec.visit.statusChanged`, `fac.billingException.*`, `crm.activityOccurrence.*`, `tec.syncConflict.*`, `stk.fieldConflict.*`, `med.syncConflict.raised`, `wfl.signature.*` y `wfl.operationalInbox.*`.
2. Hace un upsert por (`sourceType`, `sourceId`) y descarta los eventos con `sourceVersion` menor a la guardada.
3. La lectura recalcula `dueBucket` con la hora local. `wfl:recalcular-vencimientos-bandeja` lo hace en bloque a las 00:05 para que los contadores sean exactos.
4. La reconstrucción completa (`wfl:reconstruir-proyecciones`) compara los resultados con las fuentes y corrige las diferencias.

### 9.15 Reasignación por baja o licencia (P-WFL-15)

Los eventos `iam.membership.suspended`/`revoked` (EVT-IAM-03), `sue.employee.terminated` (EVT-SUE-03) y `sue.leave.approved` (EVT-SUE-08, con vigencia) disparan `wfl:reasignar-huerfanos`. El job:

- mueve las tareas y los pasos de aprobación del usuario a su área o al reemplazo definido;
- suspende sus delegaciones;
- avisa al supervisor;
- publica EVT-WFL-027.

### 9.16 Jobs propios de T11

Los jobs propios se listan en §12.6. Todos usan la clase de cola de T01, son idempotentes por la clave indicada y registran progreso en `jobRuns`. Para los cancelables, la cancelación es cooperativa entre ítems.

## 10. Pantallas

Todas las pantallas siguen el patrón Connectia (guía §8):

- **Admin:** `AdminStickyHeader` y `ScreenHelp`, `DataTable` con vistas guardadas y exportación, modales `sm`/`md`/`lg`/`xl`, `ConfirmDialog` y toasts.
- **PWA:** tarjetas de anatomía fija, FAB "+", 3 skeleton cards y cola offline.

Las etiquetas usan claves `dict:wfl.*`.

| PAN-ID | App | Ruta | Capability | Propósito y contenido | Equivalencia ProCoop / CNX |
|---|---|---|---|---|---|
| PAN-WFL-01 | admin | `/inicio/bandeja` | `wfl.tareas.ver` | **Bandeja unificada.** Zona de filtros (tipo, módulo, prioridad, área, sujeto). Grupos Vencidos, Hoy, Mañana, Próximos 7 días, Futuro y Sin fecha, con contadores. Tarjeta o fila con tipo, título, sujeto, vencimiento, prioridad y acción principal. Acciones en línea: aprobar o rechazar (modal md con comentario y MFA si corresponde), completar, tomar o liberar, posponer, reasignar. Estado vacío: `dict:wfl.inbox.empty` ("No tenés pendientes"). Ayuda contextual con CU-WFL-03. | `frmAutorizaciones`, `IconoNotificacion`, tickets "tomados"; CNX `/aprobaciones` |
| PAN-WFL-02 | admin | `/inicio/bandeja/equipo` | `wfl.bandeja.supervisar` | Supervisión: carga por persona, vencidos por área, gráfico de antigüedad, reasignación masiva (modal lg). | `frmDatosTicketsSimple` |
| PAN-WFL-03 | admin | `/inicio/tareas/:id` | `wfl.tareas.ver` | Detalle de tarea: datos, sujeto vinculado, checklist, formulario, adjuntos, comentarios con menciones, historial, SLA con barra de tiempo. Acciones: completar (exige evidencias), bloquear, reasignar, comentar. | `PROMAIL` (reemplazo) |
| PAN-WFL-04 | admin | `/inicio/agenda` | `wfl.agenda.ver` | Agenda unificada con vistas día, semana, mes y lista; capas por fuente con colores; equipo según alcance; crear cita del calendario interno (M09) en modal md; feed iCal (modal sm con token y revocación). | `frmCalendario`, `frmAgenda`; CNX `/agenda` |
| PAN-WFL-05 | admin | `/configuracion/estados` | `wfl.flujos.ver` | Catálogo de máquinas de estado por módulo, con diagrama de solo lectura, transiciones, capability, guardas y operación requerida. Desde aquí se va a los estados operativos de cada módulo. | `frmTransicion_Vistas` (navegador, no máquina; RN-10 §16.4) |
| PAN-WFL-06 | admin | `/configuracion/workflows` | `wfl.flujos.configurar` | Lista de definiciones (código, módulo, canal, versión vigente, borrador, instancias abiertas). Diseñador (xl): lienzo de nodos y aristas, panel de propiedades del nodo (asignación, formulario, SLA, acción tipada con parámetros, condición), validación estructural, simulación (RF-WFL-081), enviar a revisión, publicar con vigencia. Adopción de plantilla de plataforma. | Workflows de Connectia (CNX §4.4); `frmPTramites`; `TRAMITES` |
| PAN-WFL-07 | admin | `/configuracion/formularios` | `wfl.formularios.configurar` | Diseñador de formularios: paleta de tipos de campo, propiedades (validaciones, visibilidad, editable por, fuente de datos, tipo documental), vista previa "celular" de la PWA y de escritorio, versiones. | `frmRequisitos`, `frmRequisito_Detalles`, `frmRequisito_Adherentes` |
| PAN-WFL-08 | admin | `/tramites/instancias` | `wfl.tareas.ver` (+ capability del dominio) | Instancias de trámites: número, definición, sujeto, solicitante, estado, nodo actual, responsable, vencimiento. Filtros. Detalle con línea de tiempo, formulario, documentos y comentarios internos y públicos. | Solicitudes de Connectia; `frmTramite`, `frmTramiteCambioSevicio` |
| PAN-WFL-09 | admin | `/configuracion/aprobaciones` | `wfl.flujos.configurar` | Políticas de aprobación: lista y editor de reglas (tramos de importe, atributos de riesgo, modo, pasos y quórum, SoD, SLA). Simulador "¿quién aprobaría?". Publicación versionada. | Parámetros P2377, P2382, P2640, P2867; `DOBLE_AUTO` |
| PAN-WFL-10 | admin | `/inicio/aprobaciones/:id` | `wfl.aprobaciones.decidir` | Detalle de aprobación: resumen funcional, comparación antes/después cuando aplica, pasos con estado, decisiones previas, documentos, huella; decidir (modal md con MFA). | `frmAutorizaciones`; `frmTecnica_AutorizarNecesidad`; `frmPrescripcionDeuda_Confirmar`; `frmConfirmarPago` |
| PAN-WFL-11 | admin | `/inicio/delegaciones` | `wfl.aprobaciones.delegar` | Mis delegaciones (dadas y recibidas); nueva delegación (modal md: delegado, desde/hasta, alcance, límite, motivo); revocar. | — (nuevo) |
| PAN-WFL-12 | admin | `/configuracion/operaciones` | `wfl.flujos.configurar` | Tipos de operación del tenant: política asignada, plazos, evidencia, MFA. | `TIPO_AUTORIZACION` |
| PAN-WFL-13 | admin | `/operaciones` | `wfl.operaciones.ver` | Operaciones: número, tipo, sujeto, importe, solicitante, estado (Pendiente, Confirmado, Fallido, Incierto), fechas. Detalle con pasos, aprobación, resultado y errores funcionales. Acciones: reintentar, registrar resultado verificado (modal md con evidencia), cancelar. | `OPERACIONES` |
| PAN-WFL-14 | admin | `/expedientes/:subjectType/:id` | `wfl.expedientes.ver` | Expediente por sujeto: cabecera del sujeto, pestañas Documentos (por tipo, con versión vigente y aceptadas), Línea de tiempo (filtros por fuente), Trámites, Operaciones, Firmas y Vínculos (jerarquía). Acciones: adjuntar (modal md con tipo documental y metadatos), nueva versión, anular, compartir (modal sm), legal hold, exportar. | `frmAdjuntos`, `frmAdjuntos_Nuevo`, `frmAdjuntarPdfs`, `frmAdjuntoProcoopar` |
| PAN-WFL-15 | admin | `/expedientes/formales` | `wfl.expedientes.gestionar` | Expedientes formales: número, tipo, carátula, estado, responsable, folios. Detalle con índice foliado, pases y acuses. | `EXPEDIENTES`, mesa de entradas (DFA M21) |
| PAN-WFL-16 | admin | `/configuracion/documentos/tipos` | `wfl.flujos.configurar` | Tipos documentales: sensibilidad, retención, extensiones, visibilidad para el socio, metadatos, vencimientos. Retención y holds (pestaña). | `ADJUNTOS.TIPO` |
| PAN-WFL-17 | admin | `/configuracion/plantillas` | `wfl.plantillas.ver` | Plantillas: código, tipo documental, módulo, versión vigente, borrador, requiere aprobación. Editor (xl) con HTML y CSS, catálogo de variables del contrato (autocompletar), vista previa con datos de ejemplo o reales, comparación entre versiones, prueba de impresión A4 y ticket, publicación. | `frmPlantillaEditor`; `PLANTILLA`, `VARIABLEPLANT` |
| PAN-WFL-18 | admin | `/configuracion/numeracion` | `wfl.numeracion.configurar` | Secuencias: código, alcance, máscara, próximo, política de huecos, umbral. Libro de asignaciones con anulados. Ajuste por operación aprobada. | `frmSelectNumero`; `CLAS_INC` |
| PAN-WFL-19 | admin | `/configuracion/firmas` | `wfl.firmas.configurar` | Perfiles de firma (nivel, proveedor T06, OTP, evidencias, texto legal, apariencia) y firmantes habilitados. Ubicación de firma por plantilla. | `abm_FirmaDigital`, `abm_FirmasElectronicas`, `abm_Firmas_Digitales`, `frmFirmaElectronica`, `frmUbicacionFirma` |
| PAN-WFL-20 | admin | `/configuracion/eventos` | `wfl.eventos.ver` | Catálogo de eventos del tenant: tipo, productor, consumidores activos, versión, sensibilidad, visibilidad pública. Búsqueda de eventos de un agregado con su cadena de causas (sin payload sensible). | — (nuevo) |
| PAN-WFL-21 | admin | `/configuracion/procesos` | `wfl.jobs.ver` | Jobs del tenant: pestañas Programaciones (cron en hora local, ventana, próxima ejecución, último resultado; editar cron en modal md con `wfl.jobs.programar`), Corridas (progreso, pausar, reanudar, cancelar, descargar resultado), Excepciones de lote (agrupadas por motivo y responsable; reprocesar). | `IconoNotificacion.btnTareasProgramadas`, `frmProgressBar_WithLog`, `frmProcesoAutomatico` |
| PAN-WFL-22 | admin | `/inicio/bandeja-operativa` | `wfl.eventos.ver` | Bandeja operativa: ítems con título funcional, severidad, responsable, sujeto y acción sugerida. Acciones: reprocesar (`wfl.eventos.reprocesar`), registrar resolución con evidencia, descartar con motivo, abrir el origen. | Errores de `LogProcoop.txt` (RN-09 §4.3) |
| PAN-WFL-23 | pwa-empleado | `/bandeja` | `wfl.tareas.ver` | Bandeja en tarjetas con grupos por vencimiento, FAB "+" (nueva tarea), aprobación con step-up en PWA, push. | CNX `/aprobaciones` |
| PAN-WFL-24 | pwa-empleado | `/agenda` | `wfl.agenda.ver` | Agenda del día y de la semana en tarjetas. | CNX `/agenda` |
| PAN-WFL-25 | pwa-socio | `/tramites` | `por.tramites.iniciar` (sesión de socio; antes "Sesión de socio") | "Mis trámites": iniciar (FAB "+", modal con formulario dinámico por pasos), seguir el estado público, responder observaciones, adjuntar, descargar la constancia. | CNX `/solicitudes`; CoopOnline "Requisitos y Trámites" (FIC 14.1) |
| PAN-WFL-26 | pwa-socio / pwa-empleado | `/documentos` | `por.comprobantes.descargar` (C-SOC) o `wfl.documentos.descargar` (C-EMP); antes "Sesión" | "Mis documentos" por cuenta y tipo; descarga con URL firmada; firmar pendientes (conformidad, recibo). | CNX `/docs`; CoopOnline "Archivos en la Web" |
| PAN-WFL-27 | pwa-socio / pwa-empleado | `/firmar/:id` | Sesión + `wfl.documentos.firmar` (C-EMP, C-SOC) | Lectura del documento, texto legal, OTP y firma; constancia. | DFA M20 |
| PAN-WFL-28 | pwa-campo | `/ot/:id/conformidad` | `tec.ordenes.ejecutar` (rol T-TEC; antes "Técnico") | Acta de conformidad: previsualización, firma manuscrita, datos declarados, foto opcional, offline. | DFA M14 |
| PAN-WFL-29 | landing | `/verificar` | Público | Verificación de documento por código o QR: tipo, fecha, emisor y hash, sin datos personales. | — (nuevo; BASE §52.3) |
| PAN-WFL-30 | landing | `/d/:token` | Público con token | Descarga por enlace compartido (contraseña si corresponde, vencimiento visible). | "Archivos en la Web" |

Formularios ProCoop sin pantalla propia (cobertura):

- `frmCorreo`, `frmCorreo_Editor`, `frmEnvioMail` y `frmNotificacion` pasan a T09.
- `frmOT_Notificaciones` pasa a T09, con eventos de M10.
- `frmGestionMora_Notificar` pasa a M08 y T09.
- `frmCirculares` pasa a M09, con plantillas de T11.
- `frmTransicion` (navegador de entidades) se reemplaza por el expediente PAN-WFL-14 y los vínculos de cada ficha.

## 11. API

Errores RFC 9457 con `requestId`; paginación `?page=&size=`. Rutas de administración con el prefijo `/api/admin/wfl`, de PWA con `/api/wfl`, públicas con `/api/public/<tenantSlug>/wfl` y de plataforma con `/api/platform/wfl`.

| API-ID | Método | Ruta | Capability | Descripción | Idempotente |
|---|---|---|---|---|---|
| API-WFL-01 | GET | `/api/admin/wfl/inbox` | `wfl.tareas.ver` | Bandeja con filtros y grupos | — |
| API-WFL-02 | GET | `/api/admin/wfl/inbox/summary` | `wfl.tareas.ver` | Contadores por grupo | — |
| API-WFL-03 | POST | `/api/admin/wfl/inbox/:workItemId/claim` | `wfl.tareas.ejecutar` | Tomar ítem | Sí |
| API-WFL-04 | POST | `/api/admin/wfl/inbox/:workItemId/release` | `wfl.tareas.ejecutar` | Liberar | Sí |
| API-WFL-05 | POST | `/api/admin/wfl/inbox/:workItemId/snooze` | `wfl.tareas.ver` | Posponer | Sí |
| API-WFL-06 | POST | `/api/admin/wfl/inbox/reassign` | `wfl.tareas.reasignar` | Reasignación masiva | Sí (`Idempotency-Key`) |
| API-WFL-07 | GET | `/api/admin/wfl/inbox/team` | `wfl.bandeja.supervisar` | Carga por persona y área | — |
| API-WFL-08 | POST | `/api/admin/wfl/tasks` | `wfl.tareas.crear` | Crear tarea ad hoc o recurrente | Sí |
| API-WFL-09 | GET | `/api/admin/wfl/tasks/:id` | `wfl.tareas.ver` | Detalle | — |
| API-WFL-10 | PATCH | `/api/admin/wfl/tasks/:id` | `wfl.tareas.ejecutar` | Editar (`If-Match`) | Sí |
| API-WFL-11 | POST | `/api/admin/wfl/tasks/:id/complete` | `wfl.tareas.ejecutar` | Completar con evidencias | Sí |
| API-WFL-12 | POST | `/api/admin/wfl/tasks/:id/comments` | `wfl.tareas.ver` | Comentar con menciones | Sí |
| API-WFL-13 | GET | `/api/admin/wfl/agenda` | `wfl.agenda.ver` | Agenda por rango y capas | — |
| API-WFL-14 | POST | `/api/admin/wfl/agenda/feeds` | `wfl.agenda.ver` | Crear o rotar feed iCal | Sí |
| API-WFL-15 | DELETE | `/api/admin/wfl/agenda/feeds/:id` | `wfl.agenda.ver` | Revocar feed | Sí |
| API-WFL-16 | GET | `/api/public/:tenantSlug/wfl/ical/:token.ics` | `public: true` (token del feed, RF-IAM-061; antes "Token") | Feed iCal de solo lectura | — |
| API-WFL-17 | GET | `/api/admin/wfl/state-machines` | `wfl.flujos.ver` | Catálogo de máquinas | — |
| API-WFL-18 | GET | `/api/admin/wfl/workflows` | `wfl.flujos.ver` | Definiciones | — |
| API-WFL-19 | POST | `/api/admin/wfl/workflows` | `wfl.flujos.configurar` | Crear o adoptar plantilla | Sí |
| API-WFL-20 | PUT | `/api/admin/wfl/workflows/:id/draft` | `wfl.flujos.configurar` | Guardar borrador (`If-Match`) | Sí |
| API-WFL-21 | POST | `/api/admin/wfl/workflows/:id/validate` | `wfl.flujos.configurar` | Validación estructural | Sí |
| API-WFL-22 | POST | `/api/admin/wfl/workflows/:id/simulate` | `wfl.flujos.configurar` | Simulación sin efectos | Sí |
| API-WFL-23 | POST | `/api/admin/wfl/workflows/:id/publish` | `wfl.flujos.publicar` | Publicar con vigencia (aprobación si PRM-WFL-030) | Sí |
| API-WFL-24 | POST | `/api/admin/wfl/workflows/:id/migrate-instances` | `wfl.flujos.publicar` | Migrar instancias (crea operación `wfl.instances.migrate`) | Sí |
| API-WFL-25 | GET/POST | `/api/admin/wfl/forms` · `/api/admin/wfl/forms/:id/publish` | `wfl.formularios.configurar` | Formularios y publicación | Sí (POST) |
| API-WFL-26 | GET | `/api/admin/wfl/data-sources/:code` | `wfl.flujos.ver`; el alcance de datos lo filtra la fuente según su atributo `dataSourceCatalog.scopeAware`, que no es una capability (T02 §4.4.3; antes "`wfl.flujos.ver` (más el alcance de la fuente, `dataSourceCatalog.scopeAware`)" y, antes, "Según fuente (alcance)") | Valores de una fuente tipada | — |
| API-WFL-27 | POST | `/api/admin/wfl/instances` | `wfl.instancias.iniciar` (nueva; más la capability del dominio de la definición; antes "Capability del dominio") | Iniciar instancia desde admin | Sí |
| API-WFL-28 | GET | `/api/admin/wfl/instances` · `/:id` | `wfl.tareas.ver` + dominio | Listado y detalle | — |
| API-WFL-29 | POST | `/api/admin/wfl/instances/:id/transition` | `wfl.tareas.ejecutar` (más la capability del nodo; antes "Según nodo") | Completar nodo o tomar decisión de ruta | Sí |
| API-WFL-30 | POST | `/api/admin/wfl/instances/:id/request-info` | `wfl.tareas.ejecutar` (más la capability del nodo; antes "Según nodo") | Pasar a `waitingRequester` con pedido | Sí |
| API-WFL-31 | POST | `/api/admin/wfl/instances/:id/cancel` · `/suspend` · `/resume` | `wfl.instancias.administrar` (nueva; antes "Según definición") | Ciclo de la instancia | Sí |
| API-WFL-32 | GET | `/api/wfl/procedures/catalog` | `por.tramites.iniciar` (rol C-SOC; antes "Socio") | Trámites habilitados para el socio | — |
| API-WFL-33 | POST | `/api/wfl/procedures` | `por.tramites.iniciar` (rol C-SOC; antes "Socio") | Iniciar o guardar borrador | Sí (`clientMutationId`) |
| API-WFL-34 | POST | `/api/wfl/procedures/:id/submit` | `por.tramites.iniciar` (rol C-SOC; antes "Socio") | Enviar | Sí |
| API-WFL-35 | GET | `/api/wfl/procedures` · `/:id` | `por.tramites.iniciar` (rol C-SOC, solo los propios; antes "Socio") | Mis trámites y estado público | — |
| API-WFL-36 | POST | `/api/wfl/procedures/:id/reply` | `por.tramites.iniciar` (rol C-SOC; antes "Socio") | Responder observación con adjuntos | Sí |
| API-WFL-37 | GET | `/api/admin/wfl/approval-policies` | `wfl.flujos.ver` | Políticas | — |
| API-WFL-38 | PUT | `/api/admin/wfl/approval-policies/:id/draft` | `wfl.flujos.configurar` | Editar borrador | Sí |
| API-WFL-39 | POST | `/api/admin/wfl/approval-policies/:id/publish` | `wfl.flujos.publicar` | Publicar | Sí |
| API-WFL-40 | POST | `/api/admin/wfl/approval-policies/simulate` | `wfl.flujos.ver` | Simular quién aprueba | Sí |
| API-WFL-41 | GET | `/api/admin/wfl/approvals/:id` | `wfl.aprobaciones.decidir` o solicitante | Detalle | — |
| API-WFL-42 | POST | `/api/admin/wfl/approvals/:id/decide` | `wfl.aprobaciones.decidir` + dominio | Aprobar, rechazar o abstenerse (MFA si corresponde; valida huella) | Sí |
| API-WFL-43 | POST | `/api/admin/wfl/approvals/decide-batch` | `wfl.aprobaciones.decidir` | Decisión masiva con resultado por ítem | Sí |
| API-WFL-44 | POST | `/api/admin/wfl/approvals/:id/withdraw` | `wfl.tareas.ejecutar` (solo el solicitante; antes "Solicitante") | Retirar | Sí |
| API-WFL-45 | GET/POST/DELETE | `/api/admin/wfl/delegations` | `wfl.aprobaciones.delegar` / `administrar` | Delegaciones | Sí |
| API-WFL-46 | GET | `/api/admin/wfl/operation-types` | `wfl.flujos.ver` | Tipos de operación | — |
| API-WFL-47 | GET | `/api/admin/wfl/operations` · `/:id` | `wfl.operaciones.ver` | Operaciones | — |
| API-WFL-48 | POST | `/api/admin/wfl/operations/:id/retry` | `wfl.operaciones.reintentar` | Reintentar paso fallido | Sí |
| API-WFL-49 | POST | `/api/admin/wfl/operations/:id/resolve` | `wfl.operaciones.reintentar` | Registrar resultado verificado de incierto | Sí |
| API-WFL-50 | POST | `/api/admin/wfl/operations/:id/cancel` | `wfl.operaciones.reintentar` (solicitante o administrador; antes "Solicitante / administrador") | Cancelar | Sí |
| API-WFL-51 | POST | `/api/admin/wfl/documents/uploads` | `wfl.expedientes.adjuntar` | Pedir URL de subida (delegado a T01) con tipo documental | Sí |
| API-WFL-52 | POST | `/api/admin/wfl/documents` | `wfl.expedientes.adjuntar` | Confirmar y registrar documento o versión con vínculos y metadatos | Sí |
| API-WFL-53 | GET | `/api/admin/wfl/documents/:id` | `wfl.expedientes.ver` + objeto | Metadatos y versiones | — |
| API-WFL-54 | GET | `/api/admin/wfl/documents/:id/versions/:v/url` | `wfl.documentos.descargar` + objeto | URL firmada de descarga (registra acceso) | — |
| API-WFL-55 | POST | `/api/admin/wfl/documents/:id/void` | `wfl.documentos.anular` | Anular con motivo | Sí |
| API-WFL-56 | POST | `/api/admin/wfl/documents/:id/links` | `wfl.expedientes.adjuntar` | Vincular a otro sujeto | Sí |
| API-WFL-57 | POST/DELETE | `/api/admin/wfl/documents/:id/share-links` | `wfl.documentos.compartir` | Crear y revocar enlaces | Sí |
| API-WFL-58 | POST/DELETE | `/api/admin/wfl/legal-holds` | `wfl.documentos.retener` | Aplicar y liberar hold | Sí |
| API-WFL-59 | GET/PUT | `/api/admin/wfl/document-types` · `/retention-policies` | `wfl.flujos.configurar` / `wfl.documentos.retener` | Tipos y retención | Sí (PUT) |
| API-WFL-60 | GET | `/api/admin/wfl/dossiers/:subjectType/:id` | `wfl.expedientes.ver` | Expediente por sujeto (documentos y línea de tiempo) | — |
| API-WFL-61 | POST | `/api/admin/wfl/dossiers/:subjectType/:id/export` | `wfl.expedientes.exportar` | Exportar (job) | Sí |
| API-WFL-62 | GET/POST/PATCH | `/api/admin/wfl/formal-dossiers` | `wfl.expedientes.gestionar` | Expedientes formales (abrir, cerrar, foliar, archivar) | Sí |
| API-WFL-63 | GET | `/api/wfl/documents` · `/:id/url` | `por.comprobantes.descargar` (C-SOC) o `wfl.documentos.descargar` (C-EMP); antes "Socio o empleado" | Mis documentos y descarga | — |
| API-WFL-64 | GET | `/api/public/:tenantSlug/wfl/share/:token` | `public: true` (token del enlace, RF-IAM-061; antes "Token") | Descarga por enlace compartido | — |
| API-WFL-65 | GET | `/api/public/:tenantSlug/wfl/verify/:code` | `public: true` (rate limit, RF-IAM-061; antes "Público (rate limit)") | Verificación de documento | — |
| API-WFL-66 | GET | `/api/admin/wfl/templates` · `/:id` | `wfl.plantillas.ver` | Plantillas y versiones | — |
| API-WFL-67 | PUT | `/api/admin/wfl/templates/:id/draft` | `wfl.plantillas.editar` | Guardar borrador | Sí |
| API-WFL-68 | POST | `/api/admin/wfl/templates/:id/preview` | `wfl.plantillas.ver` | Vista previa con datos de ejemplo o reales | Sí |
| API-WFL-69 | POST | `/api/admin/wfl/templates/:id/publish` | `wfl.plantillas.publicar` | Publicar (aprobación si `requiresApproval`) | Sí |
| API-WFL-70 | GET | `/api/admin/wfl/data-contracts/:code` | `wfl.plantillas.ver` | Catálogo de variables | — |
| API-WFL-71 | GET/POST | `/api/admin/wfl/numbering/sequences` | `wfl.numeracion.configurar` | Secuencias | Sí (POST) |
| API-WFL-72 | GET | `/api/admin/wfl/numbering/sequences/:id/assignments` | `wfl.numeracion.configurar` | Libro de asignaciones | — |
| API-WFL-73 | POST | `/api/admin/wfl/numbering/sequences/:id/adjust` | `wfl.numeracion.configurar` | Solicitar ajuste (operación `wfl.sequence.adjust`) | Sí |
| API-WFL-74 | GET/PUT | `/api/admin/wfl/signature-profiles` | `wfl.firmas.configurar` | Perfiles de firma | Sí (PUT) |
| API-WFL-75 | POST | `/api/admin/wfl/signatures` | `wfl.firmas.solicitar` (nueva; más la capability del dominio del acto; antes "Capability del dominio") | Solicitar firma | Sí |
| API-WFL-76 | GET | `/api/admin/wfl/signatures/:id` | `wfl.expedientes.ver` | Estado y evidencias | — |
| API-WFL-77 | POST | `/api/wfl/signatures/:id/otp` | `wfl.documentos.firmar` (firmante del pedido; antes "Firmante") | Enviar OTP | Sí (ventana) |
| API-WFL-78 | POST | `/api/wfl/signatures/:id/sign` | `wfl.documentos.firmar` | Firmar (electrónica o manuscrita) | Sí |
| API-WFL-79 | POST | `/api/wfl/signatures/:id/reject` | `wfl.documentos.firmar` (firmante del pedido; antes "Firmante") | Rechazar con motivo | Sí |
| API-WFL-80 | GET | `/api/admin/wfl/jobs/definitions` | `wfl.jobs.ver` | Catálogo de jobs | — |
| API-WFL-81 | GET/PATCH | `/api/admin/wfl/jobs/schedules` · `/:id` | `wfl.jobs.ver` / `wfl.jobs.programar` | Programaciones y reprogramación | Sí (PATCH) |
| API-WFL-82 | GET | `/api/admin/wfl/bulk-runs` · `/:id` | `wfl.jobs.ver` | Corridas y progreso | — |
| API-WFL-83 | POST | `/api/admin/wfl/bulk-runs/:id/pause` · `/resume` · `/cancel` | `wfl.jobs.reintentar` | Control de corrida | Sí |
| API-WFL-84 | POST | `/api/admin/wfl/bulk-runs/:id/reprocess` | `wfl.jobs.reintentar` | Reprocesar excepciones resueltas | Sí |
| API-WFL-85 | GET | `/api/admin/wfl/bulk-runs/:id/items` | `wfl.jobs.ver` | Excepciones por motivo | — |
| API-WFL-86 | GET | `/api/admin/wfl/event-types` | `wfl.eventos.ver` | Catálogo de eventos | — |
| API-WFL-87 | GET | `/api/admin/wfl/events/by-aggregate` | `wfl.eventos.ver` | Cadena de eventos de un agregado (metadatos) | — |
| API-WFL-88 | GET | `/api/admin/wfl/operational-inbox` | `wfl.eventos.ver` | Bandeja operativa | — |
| API-WFL-89 | POST | `/api/admin/wfl/operational-inbox/:id/reprocess` · `/resolve` · `/discard` | `wfl.eventos.reprocesar` | Acciones de la bandeja operativa | Sí |
| API-WFL-90 | POST | `/api/platform/wfl/replay` | `wfl.eventos.reprocesar` (rol P-OPS con acceso de soporte vigente; antes solo el rol) | *Replay* de eventos para un consumidor y tenant | Sí |
| API-WFL-91 | GET | `/api/platform/wfl/catalog/health` | `wfl.eventos.ver` (rol P-OPS; antes solo el rol) | Tipos sin consumidores, consumidores sin productor, alias en uso | — |

API interna entre módulos (sin HTTP; `modules/wfl/index.js`): ver §2.3.

## 12. Eventos y jobs

### 12.1 Sobre estándar y reglas del catálogo

| Campo del sobre | Tipo | Regla |
|---|---|---|
| `eventId` | UUIDv7 | Único global; orden temporal. |
| `type` | string | `<mod>.<entidad>.<hecho>`, camelCase, del catálogo. |
| `schemaVersion` | int | Versión del payload. |
| `tenantId` | ObjectId | Siempre; `PLATFORM` para eventos de plataforma. |
| `occurredAt` / `recordedAt` | date UTC | Fecha efectiva del hecho y fecha de registro (AGR-010). |
| `aggregateType` / `aggregateId` / `aggregateVersion` | string / string / int | Orden por agregado (RF-WFL-009). |
| `correlationId` / `causationId` | string | Traza (RF-WFL-013). |
| `actor` | object | `{ type: user/member/system/integration/support, id }`. |
| `sourceModule` | string | Código de tres letras. |
| `requestId`, `idempotencyKey` | string | Si el origen fue HTTP. |
| `piiLevel`, `visibility` | enum | RN-WFL-005. |
| `payload` | object | Mínimo; importes como string decimal con `currency`. |

**Convenciones del catálogo consolidado:**

- **ID:** se conserva el que declaró cada anexo. Los eventos propios de T11 usan `EVT-WFL-NNN`. M02, que publicaba sus eventos sin ID, adoptó EVT-CAT-01..25 en el orden de su §12.1 y agregó EVT-CAT-26/27 (CTR-WFL-04 resuelto). T12 (fichas verticales) no declara eventos ni jobs propios: usa los de los módulos.
- **Nombres agrupados:** cuando un ID cubre varios hechos (`/`), cada hecho es un tipo distinto en `eventTypes` que comparte ID de documentación.
- **Productor:** es siempre el módulo del bloque, salvo indicación en contrario.
- **Consumidores:** son los que declaró el productor más los que declararon consumirlo en sus propias secciones 12, ya normalizados con §12.4. "BI" equivale a T10.

### 12.2 Eventos emitidos por T11 (productor: T11 WFL)

| ID | Evento(s) | Payload mínimo | Consumidores |
|---|---|---|---|
| EVT-WFL-001 | `wfl.operation.submitted` | `operationId`, `number`, `typeCode`, `subjectRefs`, `amount`, `currency`, `requestedBy` | Dueño del tipo de operación (`operationTypes.ownerModule`, semilla §7.3: M01, M02, M03, M04, M05, M06, M07, M08, M09, M10, M11, M12, M13, M14, M15, M16, M17, M18, T01, T02, T04, T07; marca "operación pendiente"), T09 (aviso a aprobadores vía EVT-WFL-008), T10 |
| EVT-WFL-002 | `wfl.operation.approved` / `.rejected` / `.expired` / `.cancelled` | `operationId`, `typeCode`, `outcome`, `approvalRequestId` | Dueño del tipo de operación (`operationTypes.ownerModule`: M01, M02, M03, M04, M05, M06, M07, M08, M09, M10, M11, M12, M13, M14, M15, M16, M17, M18, T01, T02, T04, T07), T09 (aviso al solicitante), T10 |
| EVT-WFL-003 | `wfl.operation.executionStarted` | `operationId`, `typeCode` | T10 |
| EVT-WFL-004 | `wfl.operation.completed` | `operationId`, `typeCode`, `resultSummary` | Dueño del tipo de operación (`operationTypes.ownerModule`: M01, M02, M03, M04, M05, M06, M07, M08, M09, M10, M11, M12, M13, M14, M15, M16, M17, M18, T01, T02, T04, T07), T09, expediente (línea de tiempo), T10 |
| EVT-WFL-005 | `wfl.operation.failed` / `.uncertain` / `.compensated` | `operationId`, `typeCode`, `errorCode`, `stepOrder` | Bandeja operativa (T11), T09 (aviso al responsable), T10 |
| EVT-WFL-006 | `wfl.operation.reconciled` | `operationId`, `verifiedOutcome`, `evidenceDocumentIds` | Dueño del tipo de operación (`operationTypes.ownerModule`: M01, M02, M03, M04, M05, M06, M07, M08, M09, M10, M11, M12, M13, M14, M15, M16, M17, M18, T01, T02, T04, T07), T10 |
| EVT-WFL-007 | `wfl.approval.requested` | `approvalRequestId`, `sourceRef`, `policyCode`, `amount`, `currency`, `dueAt` | Bandeja (T11), T10 |
| EVT-WFL-008 | `wfl.approval.stepAssigned` | `approvalRequestId`, `stepOrder`, `assigneeRefs`, `dueAt` | T09 (push y email a aprobadores), bandeja |
| EVT-WFL-009 | `wfl.approval.stepDecided` | `approvalRequestId`, `stepOrder`, `decision`, `decidedBy`, `onBehalfOf` | T09 (aviso al solicitante si lo configura), T10 |
| EVT-WFL-010 | `wfl.approval.decided` | `approvalRequestId`, `sourceRef`, `outcome` (`approved`, `rejected`, `expired`, `withdrawn`), `policyVersion` | M03, M09, M11, M12, M16, M17, M18 (declarados), M02, M04, M05, M07, M08, M10, M13, M14, M15 (transiciones con aprobación), T04 (vía EVT-WFL-016), T09, T10 |
| EVT-WFL-011 | `wfl.approval.escalated` | `approvalRequestId`, `stepOrder`, `action`, `threshold` | T09 (aviso al supervisor), T10 |
| EVT-WFL-012 | `wfl.approval.expired` / `.withdrawn` / `.invalidated` | `approvalRequestId`, `reason` | Dueño del origen de la aprobación (`approvalRequests.sourceRef`: tipos de operación de M02, M03, M04, M05, M07, M08, M09, M10, M11, M12, M13, M14, M15, M16, M17, M18; versiones de configuración de T04; documentos de T09 y T10), T09 |
| EVT-WFL-013 | `wfl.delegation.activated` / `.ended` / `.revoked` | `delegationId`, `delegatorUserId`, `delegateUserId`, `to` | Bandeja (recalcula asignaciones), T09 (aviso), T02 (auditoría) |
| EVT-WFL-014 | `wfl.instance.started` | `workflowInstanceId` (antes `instanceId`), `number`, `definitionCode`, `versionId`, `subjectRef`, `channel` | Dueño de la definición (`workflowDefinitions.ownerModule`, semilla §18.3: M01, M02, M04, M07, M08, M09, M10, M16, M17, M18, T04, T08, T09; por ejemplo, M09 crea o vincula el caso), T09 (constancia), M19 (Mis trámites), T10 |
| EVT-WFL-015 | `wfl.instance.transitioned` | `workflowInstanceId` (antes `instanceId`), `fromNodeId`, `toNodeId`, `publicStatusKey` | M19 (estado público), T09 (aviso si el nodo es notificable), T10 |
| EVT-WFL-016 | `wfl.instance.completed` | `workflowInstanceId` (antes `instanceId`), `definitionCode`, `outcome`, `subjectRef` | T04 (aprueba o rechaza `configVersion`), dueño de la definición (`workflowDefinitions.ownerModule`: M01, M02, M04, M07, M08, M09, M10, M16, M17, M18, T04, T08, T09), M19, T09, T10 |
| EVT-WFL-017 | `wfl.instance.cancelled` / `.suspended` / `.resumed` | `workflowInstanceId` (antes `instanceId`), `reason` | Dueño de la definición (`workflowDefinitions.ownerModule`: M01, M02, M04, M07, M08, M09, M10, M16, M17, M18, T04, T08, T09), M19, T09 |
| EVT-WFL-018 | `wfl.definition.published` / `.retired` | `definitionId`, `code`, `version`, `validFrom` | M19 (catálogo de trámites), T10 |
| EVT-WFL-019 | `wfl.form.submitted` | `submissionId`, `workflowInstanceId` (antes `instanceId`), `formVersionId`, `hash` | Dueño de la definición (`workflowDefinitions.ownerModule`: M01, M02, M04, M07, M08, M09, M10, M16, M17, M18, T04, T08, T09), T10 |
| EVT-WFL-020 | `wfl.sla.warning` | `targetRef`, `percent`, `dueAt` | T09 (aviso al responsable), bandeja (prioridad) |
| EVT-WFL-021 | `wfl.sla.breached` | `targetRef`, `dueAt`, `overdueMinutes` | T09, T10, bandeja |
| EVT-WFL-022 | `wfl.sla.escalated` | `targetRef`, `action`, `newAssignee` | T09, T10 |
| EVT-WFL-023 | `wfl.task.created` | `taskId`, `number`, `kind`, `assignee`, `dueAt`, `subjectRefs` | Bandeja, agenda, T09 |
| EVT-WFL-024 | `wfl.task.assigned` / `.reassigned` / `.claimed` / `.released` | `taskId`, `assignee`, `previousAssignee` | Bandeja, T09 (aviso al asignado) |
| EVT-WFL-025 | `wfl.task.completed` / `.cancelled` / `.reopened` | `taskId`, `outcome`, `onTime` | M08 (tareas `review`, RN-MOR-144), T11 (bandeja), T10 |
| EVT-WFL-026 | `wfl.task.overdue` | `taskId`, `dueAt` | T09, bandeja, T10 |
| EVT-WFL-027 | `wfl.workItem.orphaned` / `.reassigned` | `userId`, `count`, `targetAssignee` | T09 (aviso al supervisor), T02 (auditoría) |
| EVT-WFL-028 | `wfl.document.added` / `.versionAdded` | `documentId`, `versionId`, `documentTypeCode`, `subjectRefs`, `sha256` | Dueños del sujeto vinculado (`documentLinks.subjectType`: M01, M02, M05, M07, M09, M10, M12, M16, M17, M18; por ejemplo, M01 checklist documental), expediente, T10 |
| EVT-WFL-029 | `wfl.document.versionAccepted` | `documentId`, `versionId`, `act` | Dueños del acto que acepta la versión (`act.type`): M02, M08, M10, M12, M14, M16, M17 |
| EVT-WFL-030 | `wfl.document.classified` / `.sensitivityChanged` | `documentId`, `documentTypeCode`, `sensitivity` | T10 |
| EVT-WFL-031 | `wfl.document.voided` / `.restored` | `documentId`, `reason` | Dueños del sujeto vinculado (`documentLinks.subjectType`: M01, M02, M05, M07, M09, M10, M12, M16, M17, M18), M19 (oculta en Mis documentos) |
| EVT-WFL-032 | `wfl.document.retentionExpired` / `.purged` | `documentId`, `documentTypeCode`, `retainUntil` | T10, T02 (auditoría de purga) |
| EVT-WFL-033 | `wfl.document.expired` / `.expiring` | `documentId`, `documentTypeCode`, `expiresAt`, `subjectRefs` | M01 (documentación de personas), M12 (documentos de proveedor), M16 (documentación laboral), M18, T09 |
| EVT-WFL-034 | `wfl.shareLink.created` / `.revoked` / `.accessed` | `shareLinkId`, `documentId` | T02 (auditoría), T10 |
| EVT-WFL-035 | `wfl.legalHold.applied` / `.released` | `holdId`, `scope` | T02, T10 |
| EVT-WFL-036 | `wfl.template.published` / `.retired` | `templateId`, `code`, `version`, `validFrom` | Dueños de plantillas y de su contrato de datos (§18.4: M02, M05, M06, M07, M08, M09, M10, M11, M12, M13, M16, M17, M18; invalidan caché), T10 |
| EVT-WFL-037 | `wfl.render.completed` | `renderRequestId`, `documentId`, `versionId`, `sourceRef` | Solicitante del render (`renderRequests.sourceRef`, dueños de plantillas de §18.4: M02, M05, M06, M07, M08, M09, M10, M11, M12, M13, M16, M17, M18; por ejemplo, M05 distribución) |
| EVT-WFL-038 | `wfl.render.failed` | `renderRequestId`, `sourceRef`, `errorCode` | Solicitante del render (`renderRequests.sourceRef`: M02, M05, M06, M07, M08, M09, M10, M11, M12, M13, M16, M17, M18), T11 (bandeja operativa) |
| EVT-WFL-039 | `wfl.number.voided` | `sequenceCode`, `formatted`, `reason` | Dueño de la secuencia (`numberingSequences.ownerModule`: M09, M17, M05, M06), T10 |
| EVT-WFL-040 | `wfl.sequence.thresholdReached` / `.adjusted` | `numberingSequenceId` (antes `sequenceId`), `code`, `percent`, `newNext` | T09 (aviso a T-ADM), M05/M06 (secuencias fiscales) |
| EVT-WFL-041 | `wfl.signature.requested` / `.participantSigned` | `signatureRequestId`, `documentId`, `participantId`, `level` | T09 (aviso al firmante), T11 (bandeja), M16 (recibo de sueldo pendiente de firma; firma del empleado, M16 §12) |
| EVT-WFL-042 | `wfl.signature.completed` | `signatureRequestId`, `documentId`, `signedVersionId`, `sourceRef` | M16 (recibo firmado), M10 (conformidad), M14 (OP firmada), M17 (acta firmada), M08 (convenio firmado), M02 (contrato firmado), M12 |
| EVT-WFL-043 | `wfl.signature.rejected` / `.expired` / `.cancelled` | `signatureRequestId`, `reason`, `participantId` | Dueño del acto firmado (`signatureRequests.sourceRef`): M02, M08, M10, M12, M14, M16 (rechazo o vencimiento del recibo de sueldo, M16 §12), M17; T09 |
| EVT-WFL-044 | `wfl.dossier.opened` / `.closed` / `.archived` | `dossierId`, `number`, `kind`, `subjectRef` | M09 (mesa de entradas), M17 (asamblea), T10 |
| EVT-WFL-045 | `wfl.dossier.exported` | `subjectRef`, `exportId`, `requestedBy` | T02 (auditoría), T10 |
| EVT-WFL-046 | `wfl.operationalInbox.itemOpened` / `.itemResolved` | `itemId`, `kind`, `severity`, `responsibleRole` | T09 (alerta al responsable), bandeja, T01 (indicadores) |
| EVT-WFL-047 | `wfl.jobSchedule.changed` | `jobName`, `cron`, `timezone`, `status` | T01 (scheduler), T02 (auditoría) |
| EVT-WFL-048 | `wfl.bulkRun.completed` / `.paused` / `.failed` / `.cancelled` | `bulkRunId`, `module`, `kind`, `progress`, `pauseReason` | Dueño de la corrida (`bulkRuns.module`, jobs de clase `batch` de §12.8: M01–M19, T02, T04, T06, T07, T08, T09, T10, T11), T09 (aviso al solicitante), T10 |

### 12.3 Catálogo consolidado de eventos de dominio por módulo

#### M01 PER — productor M01

| ID | Evento(s) | Payload mínimo | Consumidores |
|---|---|---|---|
| EVT-PER-01 | `per.person.created` | `personId`, `personType`, `identifiersSummary` | M17, M19, T10 |
| EVT-PER-02 | `per.person.updated` | `personId`, `changedFields`, `validFrom` | M05, M06, M16, T09 |
| EVT-PER-03 | `per.person.deceased` | `personId`, `deathDate` | M02, M08, M09, M17, M18, M19, T09 (suspende comunicaciones `community`, `marketing` y recordatorios; mantiene `regulatory`, T09 §12) |
| EVT-PER-04 | `per.person.deathReverted` | `personId` | M02, M09, M17 |
| EVT-PER-05 | `per.person.mergeRequested` | `survivorPersonId`, `absorbedPersonId`, `caseId` | Colecciones con `personId` (T05 §7.2): M04, M07, M08, M09, M10, M12, M14, M16, M17, M18, T02, T08, T09, T10, T11 |
| EVT-PER-06 | `per.person.merged` / `per.person.mergeReverted` | ídem EVT-PER-05 | Colecciones con `personId` (T05 §7.2): M04, M07, M08, M09, M10, M12, M14, M16, M17, M18, T02, T08, T09 (comunicaciones al sobreviviente, T09 §12), T10, T11 (T02, M09, M17 declarados) |
| EVT-PER-07 | `per.person.anonymized` | `personId` | T10, T09, M19 |
| EVT-PER-08 | `per.taxId.verified` / `per.taxId.mismatch` | `personId`, `identifierId`, `status`, `arcaIvaCondition` | M05, M06 |
| EVT-PER-09 | `per.holder.created` / `per.holder.activated` | `holderId`, `personId`, `holderNumber` | M04, M17, M19 |
| EVT-PER-10 | `per.holder.closed` / `per.holder.reopened` | `holderId`, `effectiveDate`, `reasonId` | M02, M05, M17, M19 |
| EVT-PER-11 | `per.account.created` | `accountId`, `holderId`, `localityId`, `isMember` | M02, M04, M05, M07 |
| EVT-PER-12 | `per.account.updated` | `accountId`, `changedFields`, `validFrom` | M05, M06, M07, T09 |
| EVT-PER-13 | `per.account.principalChanged` | `holderId`, `fromAccountId`, `toAccountId` | M05, M17 |
| EVT-PER-14 | `per.account.closed` | `accountId` | M02, M05, M07 |
| EVT-PER-15 | `per.address.geoConfirmed` / `per.address.changed` | `addressId`, `geo`, `refs[]` | M10, M03, M09 |
| EVT-PER-16 | `per.premises.created` / `per.premises.updated` | `premisesId`, `cadastreKey` | M02, M10, M04 |
| EVT-PER-17 | `per.servicePoint.created` / `per.servicePoint.relocated` | `servicePointId`, `addressId` | M02, M03, M10 |
| EVT-PER-18 | `per.relationship.granted` / `.revoked` / `.expired` | `relationshipId`, `subjectPersonId`, `target`, `scopeActions` | T02, M19, M07, T09 (recalcula los alcances de `clampAudienceToGrant`, T09 §12) |
| EVT-PER-19 | `per.adherent.added` / `per.adherent.removed` | `adherentId`, `contractId` (antes `serviceContractId`, T05 §7.2), `reason` | M04, M05, M17 — **Reemplazado por EVT-SOC-01** `soc.dependent.added` / `.ended` (productor M18; DEC-071, HUECO-TRV-01): M01 no lo publica |
| EVT-PER-20 | `per.block.applied` / `.lifted` / `.expired` | `blockId`, `target`, `effects`, `effectMode` | M02, M05, M07, M08, M19 |
| EVT-PER-21 | `per.document.presented` / `.validated` / `.expired` | `submissionId`, `requirementTypeId`, `target` | M02, M04, M09 |
| EVT-PER-22 | `per.transfer.executed` / `per.transfer.reverted` | `transferId`, `type`, `origin`, `destination`, `items`, `effectiveDate` | M02, M04, M05, M07, M17 |
| EVT-PER-23 | `per.ownership.changed` | `contractId`, `fromHolderId`, `toHolderId`, `effectiveDate` (M01 §12; T05 §7.2). Texto anterior: `serviceContractId`, `fromHolderId`, `toHolderId`, `effectiveDate` | M02, M05, M07, M09, M19 |
| EVT-PER-24 | `per.userLink.verified` / `per.userLink.revoked` | `userId`, `personId` | T02, M16, M19 |
| EVT-PER-25 | `per.contact.changed` | `personId` o `accountId`, `type`, `verification` | T09, M19 |
| EVT-PER-26 | `per.person.fiscalLookupRequested` (antes `per.person.fiscal-lookup-requested`, nombre con guion que T06 consumía sin productor; 5-11-2026, pendientes de la sincronización, PA-WFL-24) | `personId`, `identifierId` (alta o cambio de CUIT/CUIL, o verificación manual, JOB-PER-01) | T06 (consulta el padrón de ARCA con `getPersona`; con el resultado M01 publica EVT-PER-08) |
| EVT-PER-27 | `per.person.identificationRegularized` (10-11-2026, DEC-099; M01 §12.1 y §8.15) | `personId`, `fromStatus`, `toStatus`, `identifierId` (una persona migrada con `identificationStatus = documentPending` pasa a `identified` o `approvedException`) | M05 (habilita los comprobantes que exigen documento), M09 (cierra el caso `identityDocumentRegularization`, RF-CRM-261), T07 (informe de migración), M02 (refresca `serviceContracts.holderIdentifierSnapshot`; M02 §12.2, 10-11-2026) |

#### M02 CAT — productor M02

| ID | Evento(s) | Payload mínimo | Consumidores |
|---|---|---|---|
| EVT-CAT-01 | `cat.tenantService.enabled` / `.disabled` | `serviceId`, `capabilityId` (CTR-DAT-30; antes `tenantServiceId`) | T01, T03 (menú), M19 |
| EVT-CAT-02 | `cat.tenantService.published` | `serviceId`, `configVersionId`, `effectiveFrom` (CTR-DAT-30; antes `tenantServiceId`) | M19 (portal y landing), M09, M04 |
| EVT-CAT-03 | `cat.tenantService.withdrawn` | `serviceId`, `scope` (CTR-DAT-30; antes `tenantServiceId`) | M19, M09 |
| EVT-CAT-04 | `cat.configVersion.published` | `configVersionId`, `diffSummary` | M04, M05, M08, M10, M09, M11 |
| EVT-CAT-05 | `cat.plan.published` / `.discontinued` | `planId`, `planVersionId` | M19, M09, M04 |
| EVT-CAT-06 | `cat.contract.requested` | `contractId`, `accountId`, `holderId`, `planVersionId`, `requestId` | M09, M10 (si factibilidad) |
| EVT-CAT-07 | `cat.contract.feasibilityRequested` | `contractId`, `serviceAddress` | M10 |
| EVT-CAT-08 | `cat.contract.installationRequested` | `contractId`, `requirements`, `equipment` | M10, M13 |
| EVT-CAT-09 | `cat.contract.activated` | `contractId`, `effectiveStart`, `planVersionId`, `categoryId`, `billingGroupId`, `eventCharges[]` | M05, M04, M03, M07, M09, M01, M17, M18, M19, M02 (altas automáticas) |
| EVT-CAT-10 | `cat.contract.suspended` | `contractId`, `reason`, `mode`, `effectiveAt` | M05, M10, M08, M09, M19, M04, M03, M18 (suspende beneficios ligados al contrato, RN-SOC-008 a RN-SOC-013) |
| EVT-CAT-11 | `cat.contract.reactivationRequested` | `contractId` | M10 |
| EVT-CAT-12 | `cat.contract.reactivated` | `contractId`, `effectiveAt`, `startDateRule` | M05, M08, M09, M04, M19 |
| EVT-CAT-13 | `cat.contract.terminationRequested` | `contractId`, `requestedAt`, `reason` | M10, M09 |
| EVT-CAT-14 | `cat.contract.terminationWithdrawn` | `contractId` | M10, M09 |
| EVT-CAT-15 | `cat.contract.terminated` | `contractId`, `effectiveEnd`, `pendingEquipment[]` | M05, M03, M07, M01, M17, M18, M09, M13, M04, M19, M02 |
| EVT-CAT-16 | `cat.contract.cancelled` | `contractId`, `reason` | M09, M10, M13 |
| EVT-CAT-17 | `cat.contract.transferred` | `fromContractId`, `toContractId`, `mode` | M05, M07, M01, M03, M18, T06 |
| EVT-CAT-18 | `cat.contract.planChanged` | `contractId`, `fromPlanVersionId`, `toPlanVersionId`, `validFrom` | M04, M05, M10, M19, M09, M13 |
| EVT-CAT-19 | `cat.contract.categoryChanged` | `contractId`, `from`, `to`, `validFrom`, `mode` | M04, M05, M06, M01, M03, M02 |
| EVT-CAT-20 | `cat.contract.addressChanged` | `contractId`, `validFrom` | M10, M03, M06, M02 |
| EVT-CAT-21 | `cat.contract.flagChanged` | `contractId`, `flag`, `value`, `validTo` | M05, M04, M03 |
| EVT-CAT-22 | `cat.contract.equipmentAssigned` / `.equipmentReturned` / `.equipmentLost` | `assignmentId`, `contractId`, `inventoryItemId`, `serialUnitId` (CTR-DAT-30; antes `stockUnitId`) | M13 (movimiento de la unidad serializada `serialUnitId`; reemplaza la ex §7.17 de M13 por `contractEquipmentAssignments` de M02), M05, M15 (vía M13) |
| EVT-CAT-23 | `cat.contract.memberAdded` / `.memberRemoved` | `contractId`, `memberId`, `role` | M04, M05, M18 — **Reemplazado por EVT-SOC-01** `soc.dependent.*` (DEC-071, HUECO-TRV-01): los adherentes y beneficiarios son de M18; M02 no publica este evento |
| EVT-CAT-24 | `cat.bulkOperation.completed` | `operationId`, `counts` | T09 (solicitante), M04/M08 (origen) |
| EVT-CAT-25 | `cat.serviceCopy.completed` | `copyRunId`, `pendingItems` | T01, T04 (tenant destino) |
| EVT-CAT-26 | `cat.serviceCopy.prepared` | `copyRunId`, `sourceTenantId`, `targetTenantId`, `components[]` | T04 (tenant destino) |
| EVT-CAT-27 | `cat.command.rejected` | `commandRequestId`, `command`, `contractId`, `errorCode`, `errors[]` | M09 |
| EVT-CAT-28 | `cat.contract.meteringRegimeChanged` | `contractId`, `serviceId` (CTR-DAT-30; antes `tenantServiceId`), `fromRegime`, `toRegime`, `effectiveAt`, `meteringPointId` (si existe), `commandId` | M03 (crea el punto de medición o registra el retiro), M04 (base de cálculo), M05, M19 (HUE-AG-03; RF-CAT-114) |

#### M03 MED — productor M03

M03 no declara payload. El mínimo propuesto es el sobre más los identificadores indicados.

| ID | Evento(s) | Payload mínimo | Consumidores |
|---|---|---|---|
| EVT-MED-01 | `med.meter.installed` | `installationId`, `meterId`, `servicePointId`, `effectiveAt` | M13, M01, T06 |
| EVT-MED-02 | `med.meter.removed` | `installationId`, `meterId`, `effectiveAt`, `finalReading` | M13, M01 |
| EVT-MED-03 | `med.installation.voided` | `installationId`, `reason` | M13, M01 |
| EVT-MED-04 | `med.installation.categoryChangeRequested` | `installationId`, `contractId`, `toCategoryId` | M01, M02 |
| EVT-MED-05 | `med.readingBatch.generated` | `batchId`, `routeId`, `readerId`, `count` | T09 |
| EVT-MED-06 | `med.readingBatch.confirmed` | `batchId`, `counts` | M05, T10 |
| EVT-MED-07 | `med.readingBatch.closed` | `batchId`, `cycleId`, `counts` | M05, M16 (tareas extra del lecturista), T10 |
| EVT-MED-08 | `med.reading.captured` | `readingId`, `servicePointId`, `source` | T10 (tablero) |
| EVT-MED-09 | `med.reading.corrected` | `readingId`, `version`, `reason` | M04, M05 |
| EVT-MED-10 | `med.readingObservation.workOrderRequested` | `readingId`, `observationCode`, `servicePointId` | M10 |
| EVT-MED-11 | `med.consumption.approved` | `consumptionId`, `contractId`, `period`, `quantity`, `unit` | M04, M05, M15 (ingresos no facturados) |
| EVT-MED-12 | `med.consumption.blocked` | `consumptionId`, `reasonCode` | M05 |
| EVT-MED-13 | `med.consumption.voided` | `consumptionId`, `reason` | M04, M05 |
| EVT-MED-14 | `med.consumptionException.raised` | `exceptionId`, `consumptionId`, `code` | T09, T10, bandeja |
| EVT-MED-15 | `med.consumptionAdjustment.approved` | `adjustmentId`, `consumptionId`, `delta` | M04, M05 |
| EVT-MED-16 | `med.point.inspectionRequested` | `servicePointId`, `reason` | M10 |
| EVT-MED-17 | `med.point.suspicionRaised` | `servicePointId`, `patternCode` | M10, M09 |
| EVT-MED-18 | `med.demand.transgressionDetected` | `contractId`, `period`, `measured`, `contracted` | M09, M04 |
| EVT-MED-19 | `med.injectionBalance.approved` | `balanceId`, `contractId`, `period`, `kwhInjected`, `kwhConsumed` | M04, M05, M07, M06 |
| EVT-MED-20 | `med.dgContract.statusChanged` | `dgContractId`, `from`, `to` | M01, M06 |
| EVT-MED-21 | `med.remoteOperation.succeeded` | `remoteOperationId`, `contractId`, `action` | M08, M10, M01 |
| EVT-MED-22 | `med.remoteOperation.failed` | `remoteOperationId`, `contractId`, `action`, `errorCode` | M08, M10, T06 |
| EVT-MED-23 | `med.prepaidTopUp.delivered` | `topUpId`, `contractId`, `amount`, `currency`, `token` (enmascarado) | M07, M19, T09 |
| EVT-MED-24 | `med.prepaidTopUp.failed` | `topUpId`, `paymentRef`, `errorCode` | M07, T09 |
| EVT-MED-25 | `med.prepaidAccount.lowBalance` | `contractId`, `balance` | T09 |
| EVT-MED-26 | `med.selfReadingWindow.opened` | `windowId`, `cycleId`, `from`, `to` | T09 |
| EVT-MED-27 | `med.selfReading.accepted` / `med.selfReading.rejected` | `selfReadingId`, `contractId`, `reason` | T09, M19 |
| EVT-MED-28 | `med.syncConflict.raised` | `conflictId`, `readingId` | T09, bandeja |
| EVT-MED-29 | `med.meteringSystem.healthChanged` | `systemId`, `status` | T06, T01 |
| EVT-MED-30 | `med.readingRoute.published` (antes `med.reading-route.published`, nombre con guion que T06 consumía sin productor; 5-11-2026, pendientes de la sincronización, PA-WFL-24) | `readingRouteId`, `readingBatchId`, `meteringSystemId`, `period` (lote exportado a telemedición o colectora de terceros, §8.3 de M03) | T06 (entrega la ruta al sistema remoto o colectora) |

#### M04 TAR — productor M04

| ID | Evento(s) | Payload mínimo | Consumidores |
|---|---|---|---|
| EVT-TAR-001 | `tar.schedule.submitted` | `scheduleId`, `version`, `serviceId`, `diffSummary`, `simulationRunId` | T11 (aprobación), T09 |
| EVT-TAR-002 | `tar.schedule.approved` | `scheduleId`, `approvals[]` | T11, T02 |
| EVT-TAR-003 | `tar.schedule.rejected` | `scheduleId`, `reason` | T09 |
| EVT-TAR-004 | `tar.schedule.published` | `scheduleId`, `validFrom`, `contentHash` | M05, M19, T10 |
| EVT-TAR-005 | `tar.schedule.activated` | `scheduleId`, `previousScheduleId` | M05, M19, T10 |
| EVT-TAR-006 | `tar.schedule.superseded` | `scheduleId`, `validTo` | T10 |
| EVT-TAR-007 | `tar.rule.published` | `ruleId`, `code`, `version`, `phase` | T10, T02 |
| EVT-TAR-008 | `tar.calculation.completed` | `runId`, `batchId`, contadores, exclusiones | M05 |
| EVT-TAR-009 | `tar.simulation.completed` | `simulationRunId`, `summary` | T09 |
| EVT-TAR-010 | `tar.promotion.assigned` | `assignmentId`, `contractId`, `promotionId` | M09, M19 |
| EVT-TAR-011 | `tar.promotion.consumed` | `assignmentId`, `cyclesConsumed`, `invoiceId` | M19 |
| EVT-TAR-012 | `tar.promotion.ended` | `assignmentId`, `reason` | T09, M19, M02 (JOB-CAT-10) |
| EVT-TAR-013 | `tar.subsidyRoll.imported` | `rollImportId`, `regimeId`, altas/bajas/cambios | M06, T10 |
| EVT-TAR-014 | `tar.enrollment.changed` | `enrollmentId`, `contractId`, `status`, `validFrom` | M02, M19, T11 (espera de evento en workflow) |
| EVT-TAR-015 | `tar.retroactiveDiff.computed` | `runId`, totales | T11 |
| EVT-TAR-016 | `tar.retroactiveDiff.approved` | `runId`, `adjustments[]` | M05 |
| EVT-TAR-017 | `tar.contractedDemand.updateProposed` | `contractId`, `newValue`, `firstExceedanceDate` | M02, M03 |
| EVT-TAR-018 | `tar.category.changeProposed` | `contractId`, `fromCategoryId`, `toCategoryId`, `effectiveDate` | M02 |
| EVT-TAR-019 | `tar.calls.rated` | `batchId`, contadores, errores | M10 |
| EVT-TAR-020 | `tar.roundingCarry.confirmed` | `accountId`, `amount`, `invoiceId` | M07 |
| EVT-TAR-021 | `tar.injectedCredit.recorded` | `contractId`, `kwh`, `amount`, `invoiceId` | M07, M06 |

#### M05 FAC — productor M05

| ID | Evento(s) | Payload mínimo | Consumidores |
|---|---|---|---|
| EVT-FAC-01 | `fac.billingRun.prepared` | `runId`, `universeVersion`, `counts` | T10 |
| EVT-FAC-02 | `fac.billingRun.prebilled` | `runId`, `totals`, `exceptionsCount` | T09, T07 (dispara la comparación en paralelo, T07 §12) |
| EVT-FAC-03 | `fac.billingRun.approved` | `runId`, `approvedBy` | T02 |
| EVT-FAC-04 | `fac.billingRun.paused` | `runId`, `code`, `source` | T09 |
| EVT-FAC-05 | `fac.billingRun.issued` | `runId`, `counters`, `numberRanges` | M06, M07 (resúmenes, QR masivo), M17 (capital por lote), T10 |
| EVT-FAC-06 | `fac.billingRun.closed` | `runId`, `cycleId`, `period`, `totalsByCapitalItem` | M17, T10 |
| EVT-FAC-07 | `fac.invoice.issued` | `invoiceId`, `legalEntityId` (DEC-064, DEC-087), `voucherTypeId`, `letter`, `posNumber`, `number`, `issueAttempt` (DEC-107: se reemite con `issueAttempt` + 1 al reemitir un comprobante devuelto a borrador), `authorizationType` (DEC-107), `accountId`, `holderId`, `issueDate`, `dueDates`, `dueDateCap` (DEC-106), `lateAuthorizationGraceDays` (10-11-2026, DEC-107; M05 RN-FAC-165), `obligations[]` (cada una con `itemClass`, RN-FAC-156), `requiresAuthorization` (M05 §12.1; `issueAttempt`, `authorizationType` y `dueDateCap` sumados el 10-11-2026, última ronda). Texto anterior: sin `legalEntityId` ni `obligations[].itemClass` | M06, M07, M03, M04, M08, M11, M13, M17, M18, M19, M09 |
| EVT-FAC-08 | `fac.invoice.annulled` | `invoiceId`, `reason`, `releases` | M07, M06, M03, M04, M08, M11, M17, M18 |
| EVT-FAC-09 | `fac.invoice.reversed` | `invoiceId`, `creditNoteId`, `amount`, `affectedBlocks` | M07, M06, M17 |
| EVT-FAC-10 | `fac.creditNote.issued` | `invoiceId`, `originInvoiceIds`, `amount` | M06, M07, M08, M11, M09, M17 (contramovimiento o ajuste de la cuenta del asociado, M17 §12) |
| EVT-FAC-11 | `fac.debitNote.issued` | `invoiceId`, `originInvoiceIds`, `amount` | M06, M07, M09 |
| EVT-FAC-12 | `fac.invoice.blocked` / `fac.invoice.unblocked` | `invoiceId`, `reasonId` | M07, M14, M08 |
| EVT-FAC-13 | `fac.invoice.dueDatesChanged` | `invoiceId`, `dueDates`, `reason` (`massModification`, `lateAuthorization`), `lateAuthorizationShift` (si `reason = lateAuthorization`) (10-11-2026, DEC-107; M05 §12.1 y RN-FAC-165: vencimientos corridos cuando la autorización llega después del primero) | M07, M08, M19, T09 (tipos `fac.invoice.dueDatesChanged` y, con `reason = lateAuthorization`, `fac.invoice.dueDatesShifted`; T09 §9.6.4, 10-11-2026) |
| EVT-FAC-14 | `fac.invoice.published` | `invoiceId`, `accountId` | M19, T09 |
| EVT-FAC-15 | `fac.invoice.delivered` / `fac.invoice.deliveryFailed` | `invoiceId`, `channel`, `status` | M01, T10, T09 (cierra comunicaciones `print_invoice` y `print_letter` con constancia física, T09 §12) |
| EVT-FAC-16 | `fac.billingException.opened` / `fac.billingException.resolved` | `exceptionId`, `reasonCode`, `ownerModule`, `ownerRole` | Dueño del motivo (`billingExceptionReasons.ownerModule`: M01, M02, M03, M04, M06, M07), T09, T11 (bandeja) |
| EVT-FAC-17 | `fac.billingCycle.closed` | `closureId`, `cycleId`, `period`, `reconciliation` | M17, T10, M06, M02 (fin de promociones, cuotas de obra) |
| EVT-FAC-18 | `fac.paymentSlip.generated` / `fac.paymentSlip.cancelled` | `slipId`, `invoiceIds`, `codes` | M07, M19 |
| EVT-FAC-19 | `fac.recategorization.confirmed` | `operationId`, `contractId`, `fromCategory`, `toCategory`, `validFrom` | M02, M04 |
| EVT-FAC-20 | `fac.billableItem.billed` | `billableItemId`, `invoiceId`, `sourceRef` | Origen del ítem facturable (`sourceRef`): M08, M11, M13, M09 (horas facturadas) |
| EVT-FAC-21 | `fac.billingRun.discarded` | `runId`, `cycleId`, `reason`, `discardedBy` | M04, T10 |
| EVT-FAC-22 | `fac.invoice.returnedToDraft` (10-11-2026, DEC-107; M05 §12.1, RN-FAC-164) | `invoiceId`, `legalEntityId`, `numberSequenceId`, `releasedNumber`, `kind` (`returnedToDraft` por rechazo de ARCA o `requeued` detrás de un número liberado), `reason`, `arcaCode`, `issueAttempt`, `billingRunId` | M06 (cancela la solicitud de autorización con motivo `numberReleased`), M07 (la obligación queda sin publicar ni cobrar, RN-COB-158), M19, T02 (auditoría) |
| EVT-FAC-23 | `fac.invoice.renumbered` (10-11-2026, DEC-107; M05 §12.1, RN-FAC-164) | `invoiceId`, `legalEntityId`, `numberSequenceId`, `previousNumber`, `number`, `fullNumber`, `issueAttempt` (un comprobante `requeued` recibe número nuevo al reenviarse) | M06 (nueva solicitud de autorización), M07 (actualiza el número visible de la obligación), M19, T02 (auditoría) |

#### M06 FIS — productor M06

| ID | Evento(s) | Payload mínimo | Consumidores |
|---|---|---|---|
| EVT-FIS-01 | `fis.invoice.authorized` | `documentId`, `authorizationKind` (`cae`, `caea`, `cai`, `cesp`), `authorizationCode`, `caeExpiresAt`, `observations[]`, `qrData`, `barcodeData` (nombres de M06 §12 adoptados el 5-11-2026; antes `documentId`, kind, CAE/CAEA/CAI/CESP, vencimiento, observaciones, `qrData`, `barcodeData`) | M05, M07, M15, M19, T10, T09 (comunicaciones según catálogo, T09 §12) |
| EVT-FIS-02 | `fis.authorization.rejected` | `documentId`, `errors[]` (`{ code, message }`), `rejectionKind` (`dataError`, `sequenceOnly`), `pointOfSaleId`, `arcaCbteType`, `number`, `issueAttempt`, `lastAuthorizedNumber` (10-11-2026, DEC-107; M06 §12.1, RF-FIS-053: con `dataError` M05 devuelve el comprobante a borrador y libera el número, con `sequenceOnly` lo devuelve a la cola, RN-FAC-164. Antes `documentId`, `errors[]`; nombres de M06 §12 adoptados el 5-11-2026; antes `documentId`, códigos y mensajes) | M05 (vuelve a borrador o a la cola, libera y renumera), M07 (solo registra el rechazo; la obligación espera EVT-FAC-22), T09 |
| EVT-FIS-03 | `fis.authorization.detained` | `documentId`, `prevalidationReasons[]` (nombres de M06 §12 adoptados el 5-11-2026; antes `documentId`, motivos de prevalidación) | M05, M01, T09 |
| EVT-FIS-04 | `fis.authorization.uncertain` | `documentId`, `submissionId` | T06, M05 |
| EVT-FIS-05 | `fis.authorization.reconciled` | `documentId`, `appliedChange`, `approvedBy` (nombres de M06 §12 adoptados el 5-11-2026; antes `documentId`, cambio aplicado, aprobador) | M05, M15, T02 |
| EVT-FIS-06 | `fis.caea.obtained` / `fis.caea.reported` | `period`, `order` (quincena 1 o 2), `pointOfSaleIds[]`. Texto anterior: período, orden, puntos | M05 |
| EVT-FIS-07 | `fis.contingency.activated` / `.deactivated` | `pointOfSaleIds[]`, `reason`. Texto anterior: puntos, motivo | M05, T09 |
| EVT-FIS-08 | `fis.credential.expiring` / `.expired` | `environment` (`homologation`, `production`), `daysLeft`. Texto anterior: ambiente, días | T09, T01 |
| EVT-FIS-09 | `fis.normativeVersion.published` | `tableCode`, `version`, `validFrom`. Texto anterior: tabla, versión, vigencia | Tenants (bandeja de adopción) |
| EVT-FIS-10 | `fis.normativeAdoption.approved` | `tableCode`, `version`, `effectiveDate`. Texto anterior: tabla, versión, fecha efectiva | M04, M05, M12 |
| EVT-FIS-11 | `fis.registry.activated` | `jurisdiction`, `regimeCode`, `validFrom`, `validTo` (`validTo` agregado el 5-11-2026 según M06 §12). Texto anterior: jurisdicción, régimen, vigencia | M05 |
| EVT-FIS-12 | `fis.withholding.confirmed` / `.cancelled` | `withholdingId`, `paymentOrderId`, `supplierId`, `withholdingTypeId` (nombre de T05 y M06 §12, adoptado el 5-11-2026; antes `withholdingType`), `amount`, `currency`, `certificateNumber`. Texto anterior: OP, proveedor, tipo, importe, certificado | M12, M14, M15 |
| EVT-FIS-13 | `fis.obligation.created` | `obligationId`, `legalEntityId`, `ownTaxObligationId` o `taxAgentRegistrationId` (exactamente uno), `regimeCode`, `period`, `amount`, `currency`, `dueDate`, `replacesObligationId` (si nace de un recálculo) (10-11-2026, DEC-095; M06 §12.1: se agregan `legalEntityId`, `ownTaxObligationId`, `taxAgentRegistrationId` y `replacesObligationId`, que M14 RF-TES-122 y M15 RN-CON-128 leen. Antes `obligationId`, `regimeCode`, `period`, `amount`, `currency`, `dueDate`. Texto anterior: régimen, período, importe, vencimiento) | M14 (pago), M15 (provisión M-137 si es propia; agregado el 10-11-2026 según M06 §12.1), T09 |
| EVT-FIS-14 | `fis.filing.generated` / `.submitted` / `.accepted` / `.rejected` | `filingId`, `regimeCode`, `period`, `isRectification`. Texto anterior: régimen, período, rectificativa | T09, T02, T10 |
| EVT-FIS-15 | `fis.vatLedger.closed` / `.reopened` | `period`, `hash`. Texto anterior: período, hash | M15, T10 |
| EVT-FIS-16 | `fis.thirdPartyCharge.collected` | `thirdPartyAgreementId`, `documentId`, `allocatedAmount`, `currency`. Texto anterior: convenio, documento, importe imputado | M15 |
| EVT-FIS-17 | `fis.remittance.approved` / `.paid` | `thirdPartyAgreementId`, `period`, `netAmount`, `currency`. Texto anterior: convenio, período, neto | M14, M15 |
| EVT-FIS-18 | `fis.regulatoryReport.generated` / `.submitted` | `regulatoryReportId`, `period`. Texto anterior: informe, período | T09 |
| EVT-FIS-19 | `fis.padron.differenceDetected` | `personId`, `currentCondition`, `padronCondition`. Texto anterior: persona, condición actual y de padrón | M01, M12 |
| EVT-FIS-20 | `fis.taxCalculation.blocked` | `documentId`, `reasonCode`. Texto anterior: documento, motivo | M04, M05 |
| EVT-FIS-21 | `fis.authorization.globalFailure` / `.globalRecovered` | `cause`, `scope` (`pointOfSaleIds[]` o `all`). Texto anterior: causa, alcance | M05, T09, T11 (pausa de corridas) |
| EVT-FIS-22 | `fis.misComprobantes.reconciled` | `period`, `supplierTaxId`, `reconciledCount`, `differenceCount`. Texto anterior: período, CUIT del proveedor, conciliados, con diferencia | M12 |
| EVT-FIS-23 | `fis.withholdingComputation.updated` | `paymentOrderId` o `paymentExecutionId`, `withholdingsByRegime[]` (`regimeCode`, `base`, `amount`). Texto anterior: orden o ejecución de pago, retenciones por régimen, base, importe | M14 |
| EVT-FIS-24 | `fis.thirdPartyAgreement.published` | `agreementId`, `legalEntityId`, vigencia, `moraPolicy` (`includeInEligibleBalance`, `surcharge`, `allowServiceCut`, `cutNormativeRef.validationStatus`), conceptos | M08 (saldo elegible, recargos y restricción `thirdPartyDebtNoCut`, RN-MOR-141/142), M05 (convenio vigente, RF-FAC-120), M15 (pasivo con el tercero) (RN-FIS-129; HUECO-ALU-01) |
| EVT-FIS-25 | `fis.regimeFile.requested` (antes `fis.regime-file.requested`, nombre con guion que T06 consumía sin productor; 5-11-2026, pendientes de la sincronización, PA-WFL-24) | `filingId`, `legalEntityId`, `regimeCode`, `period`, `storedFileIds[]` (`regimeFilings` en `approved` con entrega por conector, §8.7 de M06; PA-FIS-22) | T06 (entrega el archivo al organismo y registra el acuse) |
| EVT-FIS-26 | `fis.obligation.cancelled` (10-11-2026, DEC-095; M06 §12.1, RN-FIS-133 puntos 7 y 8) | `obligationId`, `legalEntityId`, `ownTaxObligationId` o `taxAgentRegistrationId`, `period`, `amount`, `currency`, `reason` (`manual`, `ownObligationRevoked`, `capitalBaseReopened`, `recalculated`), `replacedByObligationId` (si se recalculó), `cancellationStatus` (`pendingPaymentReconciliation` o `final`), `creditBalanceAmount` (con `final`, si el pago se ejecutó igual). Un recálculo se publica como EVT-FIS-26 de la anterior seguido de EVT-FIS-13 de la nueva con `replacesObligationId`. Una obligación `ordered` lo publica dos veces: `pendingPaymentReconciliation` al pedirse la anulación y `final` al confirmarse el resultado del pago en M14; idempotencia por `{obligationId, cancellationStatus}` (10-11-2026, cierre; M06 RN-FIS-133 punto 9) | M15 (contraasiento de la provisión M-137 solo con `final`, RN-CON-128), M14 (anula la ejecución de pago no ejecutada de la obligación o avisa al tesorero si está `delivered` o `sentToBank`), T09 |

#### M07 COB — productor M07

| ID | Evento(s) | Payload mínimo | Consumidores |
|---|---|---|---|
| EVT-COB-01 | `cob.obligation.registered` | `obligationId`, `currentAccountId`, `serviceId`, `dueSchedule[]` (alineado a M07 §12 el 5-11-2026; antes en T11: `obligationId`, `accountId`, `serviceId`, `dueDates[]`) | M07 (publicación a entes), M19, T09 (comunicaciones según catálogo, T09 §12) |
| EVT-COB-02 | `cob.obligation.settled` | `obligationId`, `settledAt`, `channel`. Texto anterior: obligación, fecha, canal | M08, M05, M07, T09 (aviso por correo o WhatsApp; antes M10) |
| EVT-COB-03 | `cob.obligation.reopened` | `obligationId`, `cause`. Texto anterior: obligación, causa | M08, M07 |
| EVT-COB-04 | `cob.payment.confirmed` | `cashOperationId`, `receipts[]` (`{ receiptId, legalEntityId }`; uno por entidad, RF-COB-193), `allocations[]` (`{ allocationId, obligationId, component, itemClass, amount }`; RN-COB-157), `channel`, `tendersByReceipt[]` (`{ receiptId, method, amount }`), `paymentDate`, `legalEntityId` (de la caja) (alineado a M07 §12 el 5-11-2026; antes en T11: operación, recibos (cada uno con su `legalEntityId`; uno por entidad, RF-COB-193), imputaciones por componente (cada una con el `itemClass` de su obligación, RN-COB-157), canal, medios por recibo, fecha de cobro, `legalEntityId` de la caja) | M15 (asiento por entidad, M-136), M08, T09 (aviso por correo o WhatsApp; antes M10), M19, M14, M03, M05, M06, M09, M17, M18, M11, T07 (resolutor de alias, RF-MIG-083) |
| EVT-COB-05 | `cob.receipt.voided` | `receiptId`, `reversedAllocationIds[]` (alineado a M07 §12 el 5-11-2026; antes en T11: `receiptId`, `reversalIds[]`) | M15, M08, M05, M14, M17, M18 |
| EVT-COB-06 | `cob.allocation.reversed` | `allocationIds[]`. Texto anterior: imputaciones | M15, M08, M06 |
| EVT-COB-07 | `cob.surcharge.deferred` | `obligationId`, `components[]`, `paymentDate` (alineado a M07 §12 el 5-11-2026; antes en T11: `obligationId`, `components[]`, `chargeDate`) | M08 |
| EVT-COB-08 | `cob.minimumPayment.evaluated` | `currentAccountId`, `minimumPayment`, `paidAmount`, `fulfilled` (alineado a M07 §12 el 5-11-2026; antes en T11: `accountId`, `minimumAmount`, `paidAmount`, `fulfilled`, `currency`) | M08 |
| EVT-COB-09 | `cob.creditBalance.created` / `.consumed` | `creditBalanceId`, `origin` (alineado a M07 §12 el 5-11-2026; antes en T11: `creditBalanceId`, `amount`, `origin`) | M15, M05 |
| EVT-COB-10 | `cob.retention.received` | `certificateNumber`, `regime`, `amount` (alineado a M07 §12 el 5-11-2026; antes en T11: `certificateNumber`, `regimeCode`, `amount`, `currency`) | M06 |
| EVT-COB-11 | `cob.settlement.expected` | `channel`, `netAmount`, `feeAmount`, `expectedCreditDate`, `treasuryAccountId` (alineado a M07 §12 el 5-11-2026; antes en T11: `channel`, `netAmount`, `feeAmount`, `creditDate`, `treasuryAccountId`, `currency`) | M14 |
| EVT-COB-12 | `cob.cashSession.closed` | `cashSessionId` (nombre canónico de T05 §7.2, antes `sessionId`), `expected[]`, `declared[]`, `differences[]` (alineado a M07 §12 el 5-11-2026; antes en T11: `cashSessionId`, `theoreticalAmount`, `declaredAmount`, `differences[]`) | M14, M15, T10 (programaciones por evento y snapshots de cierre, T10 §9.3) |
| EVT-COB-13 | `cob.treasuryHandover.delivered` | `treasuryHandoverId`, `legalEntityId`, sesiones o rendición de cobrador, contenido por medio y moneda. Texto anterior: contenido | M14 (crea `cashRemittances` vinculadas por `treasuryHandoverId`, CTR-DAT-64) |
| EVT-COB-14 | `cob.cashDifference.recorded` | `cashSessionId` (nombre canónico de T05 §7.2, antes `sessionId`), `amount` (alineado a M07 §12 el 5-11-2026; antes en T11: `cashSessionId`, `amount`, `currency`) | M15 |
| EVT-COB-15 | `cob.agencyFee.recorded` | `channel`, `grossFee`, `feeVat` (alineado a M07 §12 el 5-11-2026; antes en T11: `channel`, `grossAmount`, `vatAmount`, `currency`) | M15, M14 |
| EVT-COB-16 | `cob.directDebit.rejected` | `obligationId`, `rejectCode`, `definitive` (alineado a M07 §12 el 5-11-2026; antes en T11: `obligationId`, `rejectionCode`, `isDefinitive`) | T09 (aviso por correo o WhatsApp; antes M10), M08 |
| EVT-COB-17 | `cob.directDebitMandate.changed` | `directDebitMandateId` (alineado a M07 §12 el 5-11-2026; antes en T11: `directDebitMandateId`, `accountId`, `status`) | M05, T09 (aviso por correo o WhatsApp; antes M10), M19 |
| EVT-COB-18 | `cob.chargeback.applied` | `gatewayTransactionId` (nombre canónico de T05 §7.2, antes `transactionId`), `currentAccountIds[]` (alineado a M07 §12 el 5-11-2026; antes en T11: `chargebackId`, `gatewayTransactionId`, `accountIds[]`) | M08, M15, T09 (aviso por correo o WhatsApp; antes M10) |
| EVT-COB-19 | `cob.refund.executed` | `refundCaseId`. Texto anterior: expediente | M14, M15, M09, M03 |
| EVT-COB-20 | `cob.paymentIntent.statusChanged` | `paymentIntentId`, `status`. Texto anterior: intención | M19, T09 (aviso por correo o WhatsApp; antes M10), M08 |
| EVT-COB-21 | `cob.thirdPartyCollection.recorded` | `thirdPartyBillerId`, `amount`, `fee` (alineado a M07 §12 el 5-11-2026; antes en T11: `thirdPartyBillerId`, `amount`, `feeAmount`, `currency`) | M14, M15 |
| EVT-COB-22 | `cob.exception.opened` | `collectionExceptionId`, `type`, `severity`. Texto anterior: tipo, severidad | T09, T11 (bandeja) |
| EVT-COB-23 | `cob.audit.*` | `actorId`, `before`, `after` (alineado a M07 §12 el 5-11-2026; antes en T11: `actor`, `before`, `after`) | T02 |
| EVT-COB-24 | `cob.payment.informed` | `informedOperationRef`, `currentAccountId`, `amount`, `channel`, `evidenceStoredFileIds[]` (alineado a M07 §12 el 5-11-2026; antes en T11: `informedPaymentRef`, `accountId`, `amount`, `currency`, `channel`, `evidenceDocumentIds[]`) | M08, M19 |
| EVT-COB-25 | `cob.cashSession.reopened` | `cashSessionId` (nombre canónico de T05 §7.2, antes `sessionId`), `reason`, `authorizedBy` (alineado a M07 §12 el 5-11-2026; antes en T11: `cashSessionId`, `reason`, `authorizedBy`) | M14 |
| EVT-COB-26 | `cob.unidentified.resolved` | `unidentifiedReceiptId`, `currentAccountId`, `cashOperationId` (alineado a M07 §12 el 5-11-2026; antes en T11: `unidentifiedReceiptId`, `accountId`, `cashOperationId`) | M14 |
| EVT-COB-27 | `cob.refund.approved` | `refundCaseId`, `currentAccountId`, `amount`, `paymentMethod` (alineado a M07 §12 el 5-11-2026; antes en T11: `refundCaseId`, `accountId`, `amount`, `currency`, `paymentMethodId`) | M14, T06 |
| EVT-COB-28 | `cob.paymentIntent.requested` (antes `cob.payment-intent.requested`, nombre con guion que T06 consumía sin productor; 5-11-2026, pendientes de la sincronización, PA-WFL-24) | `paymentIntentId`, `gatewayConnectorId`, `currentAccountId`, `amount`, `expiresAt` (intención en `draft` a emitir en el proveedor, §8.4 de M07) | T06 (crea la intención en la pasarela; responde `int.paymentIntent.created`, EVT-INT-08) |
| EVT-COB-29 | `cob.debtPublication.requested` (antes `cob.debt-publication.requested`, nombre con guion que T06 consumía sin productor; 5-11-2026, pendientes de la sincronización, PA-WFL-24) | `agencyDebtExportId`, `agencyId`, `operation`, `period` (exportación de deuda en `generated` con entrega por conector, §8.6 de M07) | T06 (aplica el layout y entrega al ente; responde `int.debtPublication.acknowledged` / `.rejected`, EVT-INT-09) |
| EVT-COB-30 | `cob.directDebit.batchRequested` (antes `cob.direct-debit.batch-requested`, nombre con guion que T06 consumía sin productor; 5-11-2026, pendientes de la sincronización, PA-WFL-24) | `directDebitBatchId`, `agencyId` o `connectorId`, `exportId`, `debitDate` (lote de débito de `draft` a `presented`, §8.8 de M07) | T06 (presenta el lote; responde `int.directDebit.resultReceived`, EVT-INT-11) |

#### M08 MOR — productor M08

| ID | Evento(s) | Payload mínimo | Consumidores |
|---|---|---|---|
| EVT-MOR-01 | `mor.policy.published` | `policyType` (interés, mora, esquema, plan), `policyId`, `version` (alineado a M08 §12 el 5-11-2026; antes en T11: `policyType` (`interest`, `delinquency`, `scheme`, `plan`), `policyId`, `version`) | T04, M05, M07 |
| EVT-MOR-02 | `mor.interest.settled` | `calculationId`, documentos, componentes, modo, `receiptRef` | M05, M15, M07 |
| EVT-MOR-03 | `mor.deferredInterest.created` / `.billed` / `.cancelled` | id, cuenta, neto, `pendingChargeId` | M05, M15, M07 |
| EVT-MOR-04 | `mor.interestRun.completed` / `.failed` | `runId`, `totals` (alineado a M08 §12 el 5-11-2026; antes en T11: `runId`, totales) | M05, M15, T10 |
| EVT-MOR-05 | `mor.hold.applied` / `.released` | `documentId`, `holdReasonId`, `origin` (alineado a M08 §12 el 5-11-2026; antes en T11: `documentHoldId`, `documentId`, `cause`, `origin`) | M07, M19 |
| EVT-MOR-06 | `mor.evaluation.closed` | `accountId`, `decisionsByService[]` (alineado a M08 §12 el 5-11-2026; antes en T11: `delinquencyEvaluationId`, `accountId`, `serviceDecisions[]`) | T10, M09, M19 |
| EVT-MOR-07 | `mor.batch.generated` / `.annulled` | `delinquencyBatchId` (nombre canónico de T05 §7.2, antes `batchId`), `stageId`, `count`, `debtAmount` (alineado a M08 §12 el 5-11-2026; antes en T11: `delinquencyBatchId`, `instance`, `count`, `debtAmount`, `currency`) | T10 |
| EVT-MOR-08 | `mor.notice.created` / `.processed` / `.paid` / `.excluded` / `.closed` | `noticeId`, `accountId`, `stageId` (alineado a M08 §12 el 5-11-2026; antes en T11: `noticeId`, cuenta, instancia) | M07, M19, M09, T09 (registra el acuse físico `physical_ack`, T09 §12) |
| EVT-MOR-09 | `mor.notice.dispatchRequested` | `noticeId`, canal, destinatarios, modelo, variables, `evidenceRequired` | T09 |
| EVT-MOR-10 | `mor.notice.evidenceMissing` | `noticeId`, `reason` (alineado a M08 §12 el 5-11-2026; antes en T11: `noticeId`, motivo) | M09 |
| EVT-MOR-11 | `mor.promise.registered` / `.broken` / `.kept` | `noticeId`, `promisedDate`, `amount` (alineado a M08 §12 el 5-11-2026; antes en T11: `noticeId`, fecha, importe) | M09 |
| EVT-MOR-12 | `mor.interruption.requested` / `.blocked` / `.approved` / `.scheduled` | `caseId`, tipo, servicio, decisión, `serviceMode` (`restricted` / `interrupted`), `restrictionProfile` (`kind`, `lineupPackageId`, `minFlow`, `unit`; RN-MOR-137 a RN-MOR-139). Texto anterior: `caseId`, tipo, servicio, decisión | M10 (ejecuta el modo y el perfil recibidos), M09, M19, M02, M03 |
| EVT-MOR-13 | `mor.interruption.executed` / `.executionFailed` / `.cancelled` | `caseId`, resultado, fecha real | M01, M02, M05, T09, M19, M09, M16 |
| EVT-MOR-14 | `mor.agreement.created` / `.activated` / `.completed` / `.defaulted` / `.rehabilitated` / `.refinanced` / `.annulled` | `agreementId`, `amounts` (alineado a M08 §12 el 5-11-2026; antes en T11: `agreementId`, importes) | M05, M07, M15, M17, M19 |
| EVT-MOR-15 | `mor.installment.due` / `.overdue` | `installmentId` | M05, T09 |
| EVT-MOR-16 | `mor.guarantee.executed` / `.applied` / `.refunded` | `guaranteeId`, importes; en `.refunded` suma `refundMode` (`accountCredit` o `treasury`; HUECO-OTR-04) | M07 (saldo a favor con `refundMode = accountCredit`, RF-COB-190), M14 (solo con `refundMode = treasury`), M15 |
| EVT-MOR-17 | `mor.collectionCase.opened` / `.closed` / `.costRegistered` | `caseId` | M15, T10, M01 (indicador de proceso judicial) |
| EVT-MOR-18 | `mor.writeOff.approved` / `.reverted` | `writeOffId`, documentos, importes | M15, M07 |
| EVT-MOR-19 | `mor.prescription.executed` | `runId`, documentos, importes | M05, M07, M15 |
| EVT-MOR-20 | `mor.protection.expiring` / `.expired` | `protectionId` | M09 |
| EVT-MOR-21 | `mor.socialCoverage.suspended` / `.restored` | `contractId`, `accountId`, `holderId`, `serviceId`, `legalEntityId`, `unpaidMonths`, `restrictionRuleId`; `suspendedFrom` en `.suspended`; `restoredAt` y `paymentRef` en `.restored` | M18 (verificación de cobertura y carencia de rehabilitación, RF-SOC-032), M19 (estado de cobertura del socio), T09 (aviso de cobertura suspendida o rehabilitada) (RN-MOR-143, RF-MOR-224; HUECO-SEP-01) |

#### M09 CRM — productor M09

| ID | Evento(s) | Payload mínimo | Consumidores |
|---|---|---|---|
| EVT-CRM-01 | `crm.case.created` | `caseId`, `number`, `kind`, `typeId`, `context` | T09, T10, IA |
| EVT-CRM-02 | `crm.case.classified` | `caseId`, `typeId`, `subtypeId`, `source` | T10 |
| EVT-CRM-03 | `crm.case.derived` | `caseId`, `toAreaId` | T09, T11 (bandeja) |
| EVT-CRM-04 | `crm.case.assigned` | `caseId`, `assigneeUserId` | T09, T11 (bandeja) |
| EVT-CRM-05 | `crm.case.statusChanged` | `caseId`, `from`, `to`, `publicStatusKey` | T09, T10, M19, T11 (bandeja), M08 (libera la protección temporal al resolverse, cerrarse o cancelarse el reclamo, M08 §12) |
| EVT-CRM-06 | `crm.case.slaWarning` | `caseId`, `percent` | T09 |
| EVT-CRM-07 | `crm.case.slaBreached` | `caseId`, `dueAt` | T09, T10 |
| EVT-CRM-08 | `crm.case.resolved` | `caseId`, `resolutionCode` | T09, M19 |
| EVT-CRM-09 | `crm.case.closed` | `caseId` | T09, T10, M10 |
| EVT-CRM-10 | `crm.case.reopened` | `caseId`, `reason` | T10 |
| EVT-CRM-11 | `crm.case.cancelled` | `caseId`, `reason` | M11, T10, M02 (anula el contrato no activado o desiste la baja, M02 §12) |
| EVT-CRM-12 | `crm.case.merged` | `survivorCaseId`, `mergedCaseIds` | T10 |
| EVT-CRM-13 | `crm.commandRequest.requested` | `commandRequestId`, `caseId`, `targetModule`, `command` (código del comando de M09 §7, p. ej. `tec.workOrder.request`, antes `tec.workOrder.create`, M10 PA-TEC-23; `tec.workOrder.create` queda solo como alias de la capability `tec.ordenes.crear` de T02), `params` | Módulo destino (M02, M04, M05, M07, M08, M10, M11) |
| EVT-CRM-14 | `crm.cancellationRequest.received` | `caseId`, `receiptCode`, `channel` | T09, T10 |
| EVT-CRM-15 | `crm.cancellationRequest.receiptDelivered` / `.receiptFailed` | `caseId`, `channel` | T10 |
| EVT-CRM-16 | `crm.incident.confirmed` / `.updated` / `.restored` / `.closed` | `incidentId`, `zone`, `affectedCount` | T09, M10, T10, M19 |
| EVT-CRM-17 | `crm.message.received` / `crm.message.sent` | `messageId`, `conversationId`, `channel` | T10, M19 (línea de tiempo, avisos y observaciones a responder, M19 §12) |
| EVT-CRM-18 | `crm.conversation.handedOff` | `conversationId`, `toUserId` | T10 |
| EVT-CRM-19 | `crm.aiSuggestion.recorded` / `.decided` | `suggestionId`, `decision` | T08, T10 |
| EVT-CRM-20 | `crm.queueTicket.issued` / `.called` / `.finished` | `ticketId`, `branchId`, `boxId` | T09, T10 |
| EVT-CRM-21 | `crm.activityOccurrence.generated` / `.overdue` / `.closed` | `occurrenceId`, `activityId`, `dueAt`, `assignee` | T09, T10, T11 (bandeja y agenda) |
| EVT-CRM-22 | `crm.deskEntry.registered` / `.transferred` / `.answered` | `caseId`, `registerNumber`, `toAreaId` | T10, T11 (expediente formal y pases) |
| EVT-CRM-23 | `crm.procedureRecord.expired` | `procedureRecordId`, `procedureTypeId`, `accountId` | M02, M04, M07 |
| EVT-CRM-24 | `crm.circularRun.generated` | `runId`, `count` | T09 |
| EVT-CRM-25 | `crm.survey.negativeReceived` | `caseId`, `score` | Supervisión (T11 bandeja) |

#### M10 TEC — productor M10

| ID | Evento(s) | Payload mínimo | Consumidores |
|---|---|---|---|
| EVT-TEC-01 | `tec.feasibility.requested` | `feasibilityId`, `serviceType`, `personId`, `addressId` | M09, T09 |
| EVT-TEC-02 | `tec.feasibility.verdictIssued` | `feasibilityId`, `verdict`, `validUntil`, `estimateId` | M09, M11, T09, M02 |
| EVT-TEC-03 | `tec.feasibility.cancelled` | `feasibilityId`, `reason` | M09 |
| EVT-TEC-04 | `tec.workOrder.created` | `workOrderId`, `operationTypeId`, `contractId?`, `origin`, `crmCaseId?` (M10 §12; antes `caseId`) | M09, M15, T09, M19, M02 |
| EVT-TEC-05 | `tec.workOrder.statusChanged` | `workOrderId`, `from`, `to`, `at` | M09, M19, M13, M18, T11 (bandeja) |
| EVT-TEC-06 | `tec.workOrder.executed` | `workOrderId`, `executedAt`, `resourceId` | M09, M13 |
| EVT-TEC-07 | `tec.workOrder.closed` | `workOrderId`, `effect`, `contractId?`, `closedAt`, `resolutionCodeId`, `billableItemIds[]?` (cargos "luego" ya creados con `fac.service.upsertBillableItem`, RF-TEC-062); solo en OT `bottledGasDelivery` (RF-TEC-239, DEC-082): `bottledGas` `{ deliveryId, warehouseId?, vehicleId?, delivered[{ inventoryItemId, serialUnitId?, containerType, quantity }], retrievedEmpties[{ inventoryItemId, serialUnitId?, containerType, quantity, condition (ok\|damaged\|foreign) }], receiptDocumentId, deliveredAt }` (M10 §12). Texto anterior del bloque: `{ warehouseId?, vehicleId?, delivered[{ itemId, quantity, serialUnitId? }], emptiesReturned[{ itemId, quantity, serialUnitId? }] }` | M09, M05 (solo confirma: los cargos "luego" ya los recibió por `fac.service.upsertBillableItem`), M03, M15, M01, M02, M04, M08, M11, M13 (egreso de envases llenos e ingreso de vacíos, RF-STK-139), M16, M18, M19 |
| EVT-TEC-08 | `tec.workOrder.cancelled` | `workOrderId`, `reason` | M09, M13, M03, M08 |
| EVT-TEC-09 | `tec.workOrder.reopened` | `workOrderId`, `reason` | M09, M05, M16 |
| EVT-TEC-10 | `tec.charge.proposed` | `workOrderId`, `contractId`, `conceptId`, `moment`, `quantity` | M04 (cotiza según regla). M05 ya no lo consume: el cargo aceptado lo crea M10 con `fac.service.upsertBillableItem` (RF-TEC-062). Texto anterior: "M04, M05" |
| EVT-TEC-11 | `tec.material.requested` / `.returned` / `.used` | `workOrderId`, `itemId`, `serial`, `qty` | M13, M12 |
| EVT-TEC-12 | `tec.equipment.installed` / `tec.equipment.retrieved` | `workOrderId`, `serial`, `contractId`, `premiseId` (antes `propertyId`, M10 §12), `modality` | M13, M02 |
| EVT-TEC-13 | `tec.visit.statusChanged` | `visitId`, `status`, `eta` | T09, M19, M09, T11 (bandeja y agenda) |
| EVT-TEC-14 | `tec.visit.failed` | `visitId`, `reason`, `chargeable` | M09, M04, M05, M13, M02, M19, M08 (transición del caso de interrupción, M08 §12) |
| EVT-TEC-15 | `tec.conformity.signed` / `tec.conformity.refused` | `workOrderId`, `documentHash` | M09, M02 |
| EVT-TEC-16 | `tec.installation.activationConfirmed` | `contractId`, `workOrderId`, `effectiveAt` | M02, M05, M09, T09, M04 |
| EVT-TEC-17 | `tec.survey.requested` | `workOrderId`, `personId`, `channel` | T09 |
| EVT-TEC-18 | `tec.disconnection.executed` | `contractId`, `orderId` (M08), `mode` (`interrupted` \| `restricted`), `restrictionProfile?` (`reducedFlow` con caudal resultante medido, `outgoingBar`, `minimumLineup`; solo con `mode = restricted`, RF-TEC-238), `at`. Texto anterior: `contractId`, `orderId`, `mode`, `at` | M08, M05, M04, M02 |
| EVT-TEC-19 | `tec.reconnection.executed` | `contractId`, `orderId`, `mode`, `at` | M08, M05, M04, M02, M16 |
| EVT-TEC-20 | `tec.dependentDisconnection.requested` | `parentContractId`, `dependentContractIds` | M08, M02 |
| EVT-TEC-21 | `tec.provisioning.confirmed` / `tec.provisioning.failed` | `commandId`, `contractId`, `action`, `systemId` | M08, M09, M02 |
| EVT-TEC-22 | `tec.meter.changed` | `contractId`, `oldMeterId`, `newMeterId`, `readings`, `at` | M03, M13 |
| EVT-TEC-23 | `tec.outage.notified` / `tec.outage.finished` | `outagePlanId`, `affectedCount`, `window` | T09, T10, M09 |
| EVT-TEC-24 | `tec.networkDevice.down` | `deviceId`, `since`, `affectedCount` | M09, T09 |
| EVT-TEC-25 | `tec.levy.approved` | `workId`, `levyVersion`, `installments`, `firstDueDate?`, `beneficiaries[{beneficiaryId, premiseId, accountId, holderId, amount}]` (sin `contractId`: el contrato lo crea M02; HUECO-OBR-01; `premiseId` es la clave de JOB-CAT-13). Textos anteriores: `beneficiaries[{beneficiaryId, propertyId, accountId, holderPersonId, amount}]` (reemplazados `propertyId` por `premiseId` y `holderPersonId` por `holderId`, M10 §12); `workId`, `beneficiaries[{contractId, amount}]` | M02 (JOB-CAT-13, contrato tipo 17 por beneficiario), M04 (JOB-TAR-14, `worksInstallmentPlans`), T09 (aviso al frentista `tec.levy.approved`). Salen M05 (factura las cuotas por el contrato) y M08 (RN-TEC-115). Texto anterior: M05, M08 |
| EVT-TEC-26 | `tec.inspection.recoveryApproved` | `caseId`, `contractId`, `method`, `period` | M04, M05 |
| EVT-TEC-27 | `tec.cdr.attributed` | `importId`, `count`, `period` | M04 |
| EVT-TEC-28 | `tec.mobileUsage.imported` | `importId`, `operator`, `period` | M04, M05 |
| EVT-TEC-29 | `tec.syncConflict.opened` / `tec.syncConflict.resolved` | `conflictId`, `workOrderId`, `resolution` | M09, T09, T11 (bandeja) |
| EVT-TEC-30 | `tec.geo.pointUpdated` | `addressId`, `location`, `confidence` | M01, M03 |
| EVT-TEC-31 | `tec.phoneLine.changed` | `contractId`, `number`, `portId`, `at` | M04 |
| EVT-TEC-32 | `tec.crewTimesheet.approved` | `timesheetId`, `crewId`, `workOrderIds`, horas normales, extra y guardias | M16 |
| EVT-TEC-33 | `tec.provisioning.requested` | `commandId`, `contractId`, `action`, `systemId`, `profile` | T06 |
| EVT-TEC-34 | `tec.work.completed` | `workId`, `completedAt`, `costTotal`, destino | M15, M13 |
| EVT-TEC-35 | `tec.emergency.declared` / `tec.emergency.closed` | `workOrderId`, `crmCaseId?` (antes `caseId?`), `kind`, `serviceId` (antes `serviceCode`, CTR-DAT-30), `contractId?`, `zoneId?`, `onCallResourceId`, `protocolVersion`, `declaredAt`; al cerrar: `arrivedAt`, `safeAt`, `preventiveCutoff?` | T09 (`tec.emergency.notice`, `tec.emergency.onCallAlert`, `tec.emergency.closed`), M09 (SLA de seguridad RF-CRM-260), T10 (HUE-GAS-05) |
| EVT-TEC-36 | `tec.onCall.escalated` | `workOrderId`, `level` (`backup` o `chief`), `notifiedResourceId`, `at` | T09 (alerta al nuevo nivel), M09 (HUE-GAS-05; JOB-TEC-17) |
| EVT-TEC-37 | `tec.waterSample.outOfLimit` | `sampleId`, `samplingPointId`, `parameters[{code, value, limit}]`, `takenAt` | M09, T09, M06 (informe al regulador); solo si PRM-TEC-157 = true (HUE-AG-01) |
| EVT-TEC-38 | `tec.quotaUsage.reported` | `importId`, `contractId`, `serviceId`, `period`, `unit` (`sms`\|`mailbox`\|`gb`), `quantity`, `revision`, `reportedAt` (RF-TEC-195; DEC-084) | M04 (exceso sobre el cupo, RN-TAR-251; descarta revisiones de períodos ya facturados y lo registra en la traza) |

#### M11 VEN — productor M11

| ID | Evento(s) | Payload mínimo | Consumidores |
|---|---|---|---|
| EVT-VEN-01 | `ven.operationCharge.created` | `chargeId`, `accountId`, `contractId`, `conceptId`, `amount`, `billingMode`, `billableItemId?` (presente si `billingMode = nextServiceInvoice`) | M09 (ficha). M05 ya no lo consume para crear pendientes: M11 crea el ítem con `fac.service.upsertBillableItem` (M11 §8.1). Texto anterior: "M09, M05" |
| EVT-VEN-02 | `ven.operationCharge.cancelled` | `chargeId`, `reason`, `billableItemId?` | M09; M05 solo como aviso (la cancelación ya se hizo con `fac.service.cancelBillableItem`). Texto anterior: "M05, M09" |
| EVT-VEN-03 | `ven.operationCharge.invoiced` | `chargeId`, `invoiceIds` | M09 |
| EVT-VEN-04 | `ven.quote.created` / `ven.quote.sent` | `quoteId`, `version`, `channels` | T09, M09 |
| EVT-VEN-05 | `ven.quote.accepted` | `quoteId`, `version`, `acceptanceId`, `items` | M10, M09, M13, T09 |
| EVT-VEN-06 | `ven.quote.rejected` / `.expired` / `.cancelled` | `quoteId`, `reason` | M09, M13, T09 |
| EVT-VEN-07 | `ven.salesOrder.confirmed` | `salesOrderId`, `items`, `paymentTerms` | M13, M05, M15, M17, M18 |
| EVT-VEN-08 | `ven.salesOrder.delivered` | `salesOrderId`, `deliveryId`, `items`, `serials` | M13, M15 |
| EVT-VEN-09 | `ven.salesOrder.returned` | `salesOrderId`, `returnId`, `items`, `installmentActions` | M13, M05, M07 |
| EVT-VEN-10 | `ven.salesOrder.cancelled` | `salesOrderId`, `reason` | M13, M05, M15, M17 |
| EVT-VEN-11 | `ven.installmentPlan.created` | `originType`, `originId`, `installments[]` | M07, M15, M05 |
| EVT-VEN-12 | `ven.installment.updated` | `installmentIds`, `batchId`, `type` | M07, M15, M05 |
| EVT-VEN-13 | `ven.posSession.closed` | `sessionId`, `totals` | M07, M15 |
| EVT-VEN-14 | `ven.priceList.updated` | `priceListId`, `batchId` | M09, PWA de campo (caché) |
| EVT-VEN-15 | `ven.salesOrder.invoiced` | `salesOrderId`, `invoiceId` | M13, T10 |

#### M12 CMP — productor M12

| ID | Evento(s) | Payload mínimo | Consumidores |
|---|---|---|---|
| EVT-CMP-01 | `cmp.supplier.created` / `cmp.supplier.updated` | `supplierId`, `taxId`, `changes` | M06, M14, M15 |
| EVT-CMP-02 | `cmp.supplier.bankAccountApproved` | `supplierId`, `accountId`, `cbu` (enmascarado) | M14 |
| EVT-CMP-03 | `cmp.supplyRequest.approved` / `.cancelled` | `requestId`, `items` | M10, M13, T09 |
| EVT-CMP-04 | `cmp.purchaseOrder.approved` | `orderId`, `supplierId`, `total`, `currency`, `estimatedPaymentDate`, `allocations` | M14, M15, T09 |
| EVT-CMP-05 | `cmp.purchaseOrder.cancelled` / `.closed` | `orderId`, `remainingAmount` | M14, M15 |
| EVT-CMP-06 | `cmp.receipt.confirmed` | `receiptId`, `items`, `warehouseId`, `serials` | M13, M15 |
| EVT-CMP-07 | `cmp.receipt.voided` | `receiptId` | M13, M15 |
| EVT-CMP-08 | `cmp.supplierInvoice.registered` | `invoiceId`, `supplierId`, `amounts`, `items`, `allocations` | M06, M15, M14, M13, M18 |
| EVT-CMP-09 | `cmp.supplierInvoice.released` / `.voided` | `invoiceId`, `releasedAmount` | M14, M06, M15, M18 |
| EVT-CMP-10 | `cmp.matchException.raised` / `.decided` | `exceptionId`, `type`, `amount` | T11, T09, M13 (diferencia de precio) |
| EVT-CMP-11 | `cmp.paymentOrder.approved` | `paymentOrderId`, `supplierId`, `gross`, `withholdings`, `net`, `bankAccount`, `dueDate` | M14, M06, M15 |
| EVT-CMP-12 | `cmp.paymentOrder.cancelled` | `paymentOrderId`, `reason` | M14, M06, M15 |
| EVT-CMP-13 | `cmp.paymentOrder.paid` | `paymentOrderId`, `paidAt` | T09, M16 |
| EVT-CMP-14 | `cmp.portalSubmission.received` / `.decided` | `submissionId`, `status`, `reason` | T09 |
| EVT-CMP-15 | `cmp.paymentOrder.prepared` | `paymentOrderId`, `supplierId`, `items`, `amount` | M06 |
| EVT-CMP-16 | `cmp.supplyBalance.approved` | `balanceId`, `kind`, `serviceId`, `zoneId`, `period`, `purchasedQty`, `boundaryMeasuredQty`, `billedToUsersQty`, `lossQty`, `lossPct` | M03 (informe de pérdidas), M06 (informes al regulador), T10 (HUE-ELE-01, HUE-GAS-04; RF-CMP-151) |
| EVT-CMP-17 | `cmp.signalRightsSettlement.approved` / `.voided` | `settlementId`, `contractId`, `supplierId`, `period`, `lines[{packageId, activeSubscribers, amount}]`, `total`, `currency`, `serviceId` | M15 (devengamiento del costo, M-128), M14 (previsión de pago), T10 (HUE-TV-01; RF-CMP-155) |

#### M13 STK — productor M13

| ID | Evento(s) | Payload mínimo | Consumidores |
|---|---|---|---|
| EVT-STK-01 | `stk.goods.received` | `movementId`, `items`, `warehouseId`, `sourceRef` | M15, M12, M18 |
| EVT-STK-02 | `stk.materials.consumed` | `movementId`, `items`, `costRef` (OT, OM, obra) | M15, M10, T10, M18 |
| EVT-STK-03 | `stk.custody.transferred` | `movementId`, `fromCustody`, `toCustody`, `items` | M10, T10 |
| EVT-STK-04 | `stk.equipment.applied` | `unitId`, `serial`, `contractId` | M10, M02, M19, M15, M03 (proyección del estado del medidor, M03 §12) |
| EVT-STK-05 | `stk.equipment.retrieved` | `unitId`, `serial`, `contractId` | M10, M02, M15 |
| EVT-STK-06 | `stk.equipment.swapped` | `oldUnitId`, `newUnitId`, `contractId` | M10, M02 |
| EVT-STK-07 | `stk.equipment.returnOverdue` | `assignmentId`, `contractId`, `dueAt` | M09, T09, M02 (JOB-CAT-09), M04 (cargo por equipo no devuelto, RF-TAR-115; HUE-INT-01) |
| EVT-STK-08 | `stk.equipment.chargeProposed` / `stk.equipment.chargeApproved` | `assignmentId`, `contractId`, `amount` | M05, T11, M04 (`chargeApproved`: cargo por equipo no devuelto, RF-TAR-115; HUE-INT-01) |
| EVT-STK-09 | `stk.equipment.sold` | `unitId`, `salesOrderId` | M15 |
| EVT-STK-10 | `stk.reservation.created` / `.released` / `.expired` | `reservationId`, `sourceRef`, `items` | M10, M11 |
| EVT-STK-11 | `stk.adjustment.posted` | `adjustmentId`, `items`, `valueDelta` | M15 |
| EVT-STK-12 | `stk.item.belowMinimum` (antes `stk.item.below-minimum`; M13 PA-STK-11) | `itemId`, `warehouseId`, `balance`, `minimum` | M12, T09 |
| EVT-STK-13 | `stk.reorder.suggested` | `suggestionIds` | M12 |
| EVT-STK-14 | `stk.valuation.changed` | `itemId`, `method`, `delta` | M15 |
| EVT-STK-15 | `stk.period.closed` / `.reopened` | `periodId` | M15, T04 |
| EVT-STK-16 | `stk.physicalCount.closed` | `countId`, `differences` | M15, T10 |
| EVT-STK-17 | `stk.fixedAsset.registered` / `.disposed` / `.valueChanged` | `assetId`, `value` | M15 |
| EVT-STK-18 | `stk.depreciation.posted` / `.reversed` | `runId`, `period`, `total` | M15 |
| EVT-STK-19 | `stk.rma.statusChanged` | `rmaId`, `from`, `to` | T09, M12 |
| EVT-STK-20 | `stk.manufacturing.inProcess` / `.finished` | `manufacturingOrderId` | M15, M11 |
| EVT-STK-21 | `stk.fieldConflict.raised` / `.resolved` | `conflictId`, `mutationRef` | M10, T11 (bandeja) |
| EVT-STK-22 | `stk.crewSettlement.closed` | `settlementId`, `crewId`, `differences` | M15, M16 |
| EVT-STK-23 | `stk.reservation.failed` | `reservationRequestId`, `sourceRef`, `itemId`, `missingQty` | M10, M11 |
| EVT-STK-24 | `stk.goods.rejected` | `receiptId`, `items`, `reason` | M12 |

#### M14 TES — productor M14

| ID | Evento(s) | Payload mínimo | Consumidores |
|---|---|---|---|
| EVT-TES-01 | `tes.operation.posted` | `operationId`, `accountId`, `amount`, `currency`, `kind` | M15, T10, M06 |
| EVT-TES-02 | `tes.operation.voided` | `operationId`, `reason` | M15 |
| EVT-TES-03 | `tes.account.created` / `tes.account.closed` | `accountId` | M15, T10 |
| EVT-TES-04 | `tes.statement.imported` | `statementId`, `accountId`, `lines` | M14 (job de conciliación) |
| EVT-TES-05 | `tes.reconciliation.closed` / `.reopened` | `reconciliationId`, `accountId`, `period` | M15 |
| EVT-TES-06 | `tes.statementLine.unidentified` | `lineId`, `amount`, `date` | M07 |
| EVT-TES-07 | `tes.gatewayCredit.reconciled` | `lineId`, `settlementRef` | M07 |
| EVT-TES-08 | `tes.cashRemittance.accepted` / `.observed` / `.voided` | `cashRemittanceId` (antes `remittanceId`), `treasuryHandoverId` (entrega de M07 que la rendición recibe, CTR-DAT-64, CTR-TES-25), `cashSessionId`, `legalEntityTotals[] { legalEntityId, countedTotal, operationId }`, `receivedBy`, `receivedAt`, `differences` (si `observed`), `reason` (si `observed` o `voided`) (M14 §12) | M07 (estado de caja y `receivedBy`/`receivedAt` de la entrega `treasuryHandoverId`), M15 |
| EVT-TES-09 | `tes.deposit.registered` / `tes.deposit.credited` | `depositId` | M15 |
| EVT-TES-10 | `tes.thirdPartyCheck.stateChanged` / `.rejected` | `checkId`, `state` | M07, M12, M15 |
| EVT-TES-11 | `tes.ownCheck.issued` / `.debited` / `.voided` | `checkId` | M15, M12 |
| EVT-TES-12 | `tes.echeq.stateChanged` | `echeqId`, `state` | M12, M07 |
| EVT-TES-13 | `tes.cardVoucher.presented` / `tes.cardSettlement.recorded` / `tes.cardVoucher.rejected` | `voucherId` o `settlementId` | M12, M07, M15 |
| EVT-TES-14 | `tes.receivedWithholding.registered` / `.presented` / `.presentationVoided` | `withholdingId` | M06, M15 |
| EVT-TES-15 | `tes.paymentExecution.signed` / `.executed` / `.rejected` / `.voided` | `paymentExecutionId`, `kind`, `sourceRef { module, docId, docNumber }`, `netAmount`, `currency`, `instruments[]`, `executedAt` (en `.executed`), motivo (en `.rejected` y `.voided`); con `kind = agencyObligation`, además `taxObligation { taxObligationId, ownTaxObligationId, taxAgentRegistrationId, legalEntityId, tax, period }`, que identifica la obligación cancelada, sea de agente o propia (10-11-2026, DEC-095; M14 §12.1, CTR-TES-27). *Reemplazado (10-11-2026, DEC-095): "`executionId`, `sourceRef`, `amount`"* | M12, M06 (pasa `taxObligations` a `paid`), M07, M15 (M-51 para obligaciones de agente; M-138 de RF-CON-163 con `ownTaxObligationId`), M17, M18 |
| EVT-TES-16 | `tes.paymentFile.generated` / `.sent` / `.responseReceived` | `fileId`, `bank`, `lines` | T06, M16 |
| EVT-TES-17 | `tes.payrollPayment.confirmed` / `.rejected` | `payrollRunId`, `employeeId` | M16 |
| EVT-TES-18 | `tes.cashClosing.closed` / `.reopened` | `closingId` | M15 |
| EVT-TES-19 | `tes.exchangeRate.published` | `currency`, `date`, `rate` | M05, M07, M12, M15, M04, T11 (tramos en moneda) |
| EVT-TES-20 | `tes.commitment.created` / `.consumed` / `.released` | `commitmentId`, `amount` | M15 |
| EVT-TES-21 | `tes.cashFlow.alertRaised` | `accountId`, `projectedBalance` | T09 |
| EVT-TES-22 | `tes.period.closed` / `.reopened` | `periodId` | M15, T04 |
| EVT-TES-23 | `tes.advance.paid` | `advanceId`, `employeeId`, `amount`, `paidAt` | M16 |
| EVT-TES-24 | `tes.bankSync.requested` (antes `tes.bank-sync.requested`, nombre con guion que T06 consumía sin productor; 5-11-2026, pendientes de la sincronización, PA-WFL-24) | `interbankingSyncRunId`, `connectionId`, `treasuryAccountId`, `kind`, `dateSince` (corrida Interbanking en `running`, JOB-TES-04, §8.16.11 de M14) | T06 (consulta saldos y movimientos; responde `int.bank.movementsReceived` / `int.bank.balancesReceived`, EVT-INT-12) |
| EVT-TES-25 | `tes.paymentFile.requested` (antes `tes.payment-file.requested`, nombre con guion que T06 consumía sin productor; 5-11-2026, pendientes de la sincronización, PA-WFL-24) | `paymentFileId`, `purpose`, `format`, `originTreasuryAccountId`, `executionDate` (`paymentFiles` en `generated`, JOB-TES-05, §8.10 de M14) | T06 (aplica el layout de Interbanking o del banco y lo entrega, FI-INT-59) |

#### M15 CON — productor M15

| ID | Evento(s) | Payload mínimo | Consumidores |
|---|---|---|---|
| EVT-CON-01 | `con.entry.posted` | `entryId`, `number`, `fiscalYearId`, `accountingDate`, `entryType`, `sourceEventIds[]`, `documentRefs[]` | M13, M12, M14, M16, M17, M06, T10, M15 (JOB-CON-10) |
| EVT-CON-02 | `con.entry.reversed` | `entryId`, `reversalEntryId`, `reason` | M13, módulos de origen del asiento (`documentRefs`: M02, M03, M06, M07, M08, M10, M11, M12, M13, M14, M16, M17, M18), T10 |
| EVT-CON-03 | `con.entry.voided` | `entryId`, `reason` | Los mismos de EVT-CON-02: M13, módulos de origen del asiento (M02, M03, M06, M07, M08, M10, M11, M12, M13, M14, M16, M17, M18), T10 |
| EVT-CON-04 | `con.event.pendingConfiguration` | `eventId`, `eventType`, `sourceModule`, `missing[]` | T09, T11 (bandeja operativa) |
| EVT-CON-05 | `con.event.failed` | `eventId`, `errorCode` | T09, T08, M16, M17, T11 (bandeja operativa) |
| EVT-CON-06 | `con.period.locked` / `con.period.unlocked` | `periodId`, `module`, `lockedUntil` | Módulos que registran hechos contables (M02, M03, M06, M07, M08, M10, M11, M12, M13, M14, M16, M17, M18), T04 |
| EVT-CON-07 | `con.period.closed` | `periodId`, `legalEntityId`, `period` (`YYYY-MM`), `sequence` (CTR-DAT-31; M15 §12). Texto anterior: `periodId`, `year`, `month` | Módulos que registran hechos contables (M02, M03, M06, M07, M08, M10, M11, M12, M13, M14, M16, M17, M18; M13, M14, M16 declarados), M06, T10 |
| EVT-CON-08 | `con.period.reopened` | `periodId`, `reopenUntil`, `reason`, `approvedBy` | Módulos que registran hechos contables (M02, M03, M06, M07, M08, M10, M11, M12, M13, M14, M16, M17, M18), T10 |
| EVT-CON-09 | `con.fiscalYear.closed` / `con.fiscalYear.reopened` | `fiscalYearId`, `resultAmount`, `closingEntries` | M17, T10 |
| EVT-CON-10 | `con.chart.approved` / `con.chart.promoted` | `chartId`, `fiscalYearId` | Selectores de cuentas de M06, M07, M08, M10, M16, M17 (`ledgerAccountId` en sus reglas contables) |
| EVT-CON-11 | `con.config.published` | `configVersionId`, `changes` | M15 (JOB-CON-03, JOB-CON-19) |
| EVT-CON-12 | `con.inflationAdjustment.posted` | `runId`, `entryId`, `recpam` | T10 |
| EVT-CON-13 | `con.reconciliation.differenceDetected` | `runId`, `kind`, `amount` | T09 |
| EVT-CON-14 | `con.budget.approved` / `con.budget.reformulated` | `budgetId`, `version` | M12, M14, M16, T10 |
| EVT-CON-15 | `con.commitment.exceeded` / `con.commitment.excessAuthorized` | `commitmentId`, `amount`, `policy` | M12, T11 |
| EVT-CON-16 | `con.simulation.completed` | `scenarioId`, `comparable`, `runHash` | T09 |
| EVT-CON-17 | `con.export.completed` / `con.export.failed` | `transferId`, `entries`, `fileId` | T06 |
| EVT-CON-18 | `con.statements.issued` | `runId`, `fiscalYearId`, `hash` | M17, M19, T10 |

#### M16 SUE — productor M16

| ID | Evento(s) | Payload mínimo | Consumidores |
|---|---|---|---|
| EVT-SUE-01 | `sue.employee.hired` | `employeeId`, `personId`, `areaId`, `hiredAt` | T02, M10, T09 |
| EVT-SUE-02 | `sue.employee.assignmentChanged` | `employeeId`, `areaId`, `validFrom` | M10, T10, T11 (responsables) |
| EVT-SUE-03 | `sue.employee.terminated` | `employeeId`, `terminationDate` | T02, M13, M10, T09, T11 (reasignación) |
| EVT-SUE-04 | `sue.employee.reinstated` | `employeeId`, `validFrom` | T02, M10 |
| EVT-SUE-05 | `sue.payrollConfig.published` | `configVersionId` | T10 |
| EVT-SUE-06 | `sue.salaryScale.published` | `scaleId`, `validFrom` | M16, M15 |
| EVT-SUE-07 | `sue.novelty.approved` | `noveltyId`, `employeeId`, `period` | T10 |
| EVT-SUE-08 | `sue.leave.requested` / `.approved` / `.rejected` | `leaveId`, `employeeId`, `from`, `to` | T09, M10, T11 (agenda y reasignación) |
| EVT-SUE-09 | `sue.payrollRun.calculated` | `payrollRunId`, `period`, `totals` | T09 |
| EVT-SUE-10 | `sue.payrollRun.submitted` | `payrollRunId` | T11 |
| EVT-SUE-11 | `sue.payrollRun.approved` | `payrollRunId`, `allocations` | M15, T10 |
| EVT-SUE-12 | `sue.payrollRun.voided` | `payrollRunId`, `reason` | M15 |
| EVT-SUE-13 | `sue.payrollRun.closed` | `payrollRunId`, `period` | T10, M06 |
| EVT-SUE-14 | `sue.payslip.issued` | `payslipId`, `employeeId`, `documentId` | T09, M19 |
| EVT-SUE-15 | `sue.payslip.acknowledged` | `payslipId`, `signatureRequestId` | T10 |
| EVT-SUE-16 | `sue.payslip.voided` | `payslipId`, `reason` | T09 |
| EVT-SUE-17 | `sue.paymentRequest.created` | `paymentRequestId`, `items` | M14 |
| EVT-SUE-18 | `sue.filing.generated` / `sue.filing.filed` | `filingId`, `kind`, `period` | M14, T10 |
| EVT-SUE-19 | `sue.incomeTax.annualSettled` | `employeeId`, `year` | T09 |
| EVT-SUE-20 | `sue.termination.approved` | `employeeId`, `terminationDate` | M13, T02, M16 |
| EVT-SUE-21 | `sue.certificate.issued` | `certificateId`, `employeeId`, `kind` | T09 |
| EVT-SUE-22 | `sue.accident.reported` | `accidentId`, `employeeId` | T09, T10 |
| EVT-SUE-23 | `sue.lawsuit.provisionChanged` | `lawsuitId`, `amount` | M15, M08 |
| EVT-SUE-24 | `sue.externalPayroll.approved` | `importId`, `period` | M15, M14 |
| EVT-SUE-25 | `sue.laborCost.projected` | `projectionId`, `period` | M15 |
| EVT-SUE-26 | `sue.serviceDebt.deducted` | `payslipId`, `accountId`, `amount` | M07 (solo con PA-SUE-06) |
| EVT-SUE-27 | `sue.paymentRequest.cancelled` | `paymentRequestId`, `reason` | M14 |
| EVT-SUE-28 | `sue.payrollFiles.requested` (antes `sue.payroll-files.requested`, nombre con guion que T06 consumía sin productor; 5-11-2026, pendientes de la sincronización, PA-WFL-24) | `statutoryFilingId`, `legalEntityId`, `kind`, `periodKey`, `payrollRunIds` (LSD, SICOSS/F.931 u otro `kind` de `statutoryFilings`; JOB-SUE-10, API-SUE-63) | T06 (aplica el diseño oficial vigente y deja el archivo descargable, FI-INT-16; la presentación en ARCA sigue manual, RN-SUE-080) |

#### M17 INS — productor M17

| ID | Evento(s) | Payload mínimo | Consumidores |
|---|---|---|---|
| EVT-INS-01 | `ins.membership.requested` | `associateMembershipId`, `legalEntityId`, `personId`, `channel` (antes `membershipId`; PA 9, Asumida DEC-072) | T09, T11 |
| EVT-INS-02 | `ins.membership.approved` | `associateMembershipId`, `legalEntityId`, `personId`, `memberNumber`, `admissionDate` (antes `membershipId`; PA 9, Asumida DEC-072) | M01, M04, M05, M19, T09 |
| EVT-INS-03 | `ins.membership.rejected` | `associateMembershipId`, `legalEntityId`, `reason` (antes `membershipId`; PA 9, Asumida DEC-072) | T09 |
| EVT-INS-04 | `ins.membership.suspended` / `ins.membership.reinstated` | `associateMembershipId`, `legalEntityId`, `date` (antes `membershipId`; PA 9, Asumida DEC-072) | M19, M01 |
| EVT-INS-05 | `ins.membership.exitRequested` | `associateMembershipId`, `legalEntityId`, `cause` (antes `membershipId`; PA 9, Asumida DEC-072) | T11 |
| EVT-INS-06 | `ins.membership.exited` | `associateMembershipId`, `legalEntityId`, `cause`, `effectiveDate` (antes `membershipId`; PA 9, Asumida DEC-072) | M01, M04, M05, M18, M19 |
| EVT-INS-07 | `ins.member.withoutServices` | `associateMembershipId`, `legalEntityId` (antes `membershipId`; PA 9, Asumida DEC-072) | T11 (bandeja de secretaría) |
| EVT-INS-08 | `ins.capitalMovement.recorded` (antes `ins.capital.movement.recorded`) | `movementId`, `legalEntityId`, `type`, `amount`, `item`, `accountRef` | M15, M19 |
| EVT-INS-09 | `ins.capitalMovement.reversed` (antes `ins.capital.movement.reversed`) | `movementId`, `legalEntityId`, `reversesId` | M15 |
| EVT-INS-10 | `ins.capitalTransfer.executed` (antes `ins.capital.transfer.executed`) | `transferId`, `legalEntityId` | M15, M01 |
| EVT-INS-11 | `ins.capitalRefund.approved` (antes `ins.capital.refund.approved`) | `refundId`, `legalEntityId`, `amount` | M14, M05 |
| EVT-INS-12 | `ins.capitalRefund.paid` (antes `ins.capital.refund.paid`) | `refundId`, `legalEntityId` | M15, T09 |
| EVT-INS-13 | `ins.surplusDistribution.approved` / `.executed` (antes `ins.surplus.distribution.approved` / `.executed`) | `distributionId`, `legalEntityId`, totales | M15, M07, M14 |
| EVT-INS-14 | `ins.meeting.convened` | `meetingId`, `legalEntityId`, `type`, `date` | T09, M19, landing, T11 (agenda) |
| EVT-INS-15 | `ins.meeting.closed` | `meetingId`, `legalEntityId` | T11 (expediente de asamblea) |
| EVT-INS-16 | `ins.minute.signed` | `minuteId`, `meetingId`, `legalEntityId`, `bookType`, `number` (10-11-2026, DEC-096; M17 §12.1: identifican el acta dentro del libro de su entidad, RF-INS-087) | T11, objetos vinculados |
| EVT-INS-17 | `ins.resolution.created` | `resolutionId`, `legalEntityId`, `category`, `affectedRefs` | M09, mesa de entradas, M17 |
| EVT-INS-18 | `ins.roster.finalized` | `rosterId`, `legalEntityId`, totales | M19, T09 (dimensión "asociado activo" y padrón de consultas, T09 §12) |
| EVT-INS-19 | `ins.mandate.started` / `ins.mandate.ended` | `mandateId`, `legalEntityId`, `personId`, `position` | T02, M17, T11 (comités) |
| EVT-INS-20 | `ins.fee.settled` | `settlementId`, `legalEntityId`, `amount` | M14, M15, M06 |
| EVT-INS-21 | `ins.inaesReport.submitted` (antes `ins.inaes.report.submitted`) | `reportId`, `legalEntityId` | T11 (expediente) |
| EVT-INS-22 | `ins.capitalBase.closed` / `ins.capitalBase.reopened` (10-11-2026, DEC-095; M17 §12.1, RF-INS-109) | `closingId`, `legalEntityId`, `asOf`, `subscribed`, `paid`, `pendingToPay`, `reserved`, `refundsApprovedUnpaid`, `byCapitalItem`, `reconciliationStatus`; en `.reopened`: `closingId`, `legalEntityId`, `asOf`, `reopenApprovalId` | M06 (recalcula o marca para revisión las obligaciones propias que usaron esa base), M15 (conciliación), T10 |

Nota (10-11-2026, DEC-096; M17 §12.1, nota al pie de la tabla): todos los eventos EVT-INS-01 a EVT-INS-22 llevan `legalEntityId` en el payload, copiado del objeto que los origina (todos los objetos de M17 que emiten eventos lo tienen obligatorio), y las filas de arriba lo declaran; EVT-INS-16 suma `bookType` y `number` para identificar el acta dentro del libro de su entidad (RF-INS-087). *Reemplazado (10-11-2026, cierre): "los eventos EVT-INS-01 a EVT-INS-21 llevan además `legalEntityId` en el payload cuando el objeto lo tiene (membresías, movimientos, transferencias, rescates, distribuciones, reuniones, padrones, honorarios, informes INAES), aunque las filas de arriba no lo repitan."* M01 lo usa para mantener una entrada por entidad en `holders.memberships` (M01 §12.2); M15, M19 y T09 separan por entidad.

#### M18 SOC — productor M18

| ID | Evento(s) | Payload mínimo | Consumidores |
|---|---|---|---|
| EVT-SOC-01 | `soc.dependent.added` / `.ended` / `.categoryChanged` / `.restored` | `dependentId`, `contractId`, `date`, `cause` | M04, M19, M17 |
| EVT-SOC-02 | `soc.dependent.majorityReached` | `dependentId` | T09 |
| EVT-SOC-03 | `soc.benefitRequest.decided` | `requestId`, `outcome`, `costs` | M04, M05, T09, M19 |
| EVT-SOC-04 | `soc.deathSubsidy.approved` | `caseId`, `beneficiaries`, `amounts` | M14, M15 (fondo de subsidio `socialSubsidyFund`, RN-CON-122; HUECO-SEP-03) |
| EVT-SOC-05 | `soc.burialRight.formalized` / `.holderChanged` / `.extinguished` | `rightId` | M02 (contrato de mantenimiento; HUECO-TRV-06, antes M01), M04, M19, M15 (devengamiento del derecho, M-135, JOB-CON-23; HUECO-CEM-04). Texto anterior: M01, M04, M19 |
| EVT-SOC-06 | `soc.cemeteryAct.performed` | `actId`, `type`, `unit` | M05, M19, M04 (cargo por acto, disparador `social_act`, RF-TAR-117; HUECO-CEM-01), T09 (`soc.cemeteryAct.performed`) |
| EVT-SOC-07 | `soc.trip.completed` | `tripId`, `km`, `amount`, `covered`, `characteristicCode`, `memberStatus`, `originalTripId` (los tres últimos para RN-TAR-249; HUECO-SAL-01) | M04, M05, M15 |
| EVT-SOC-08 | `soc.housing.allocated` / `.delivered` / `.terminated` / `.transferred` / `.planChanged` | `unitId` | M04, M05, M07, M19 |
| EVT-SOC-09 | `soc.housing.materialWithdrawn` / `.materialReturned` | `withdrawalId`, `items` | M13, M15 |
| EVT-SOC-10 | `soc.housing.certificateLiquidated` | `certificateId`, `supplierId`, `total` | M12, M14, M15 |
| EVT-SOC-11 | `soc.housing.priceUpdated` | `planId`, `category`, `date` | M04 |
| EVT-SOC-12 | `soc.vehicle.usageRecorded` | `usageId`, `vehicleId`, `driverId`, `km`, `hours`, `cost`, `workOrderId` (`vehicleId`, `driverId` y `hours` agregados el 5-11-2026 para alinear con M18; antes `usageId`, `km`, `cost`, `workOrderId`) | M15, M10, M16 |
| EVT-SOC-13 | `soc.vehicle.unfit` / `.fit` | `vehicleId`, `reason` | M10 |
| EVT-SOC-14 | `soc.tripSettlement.approved` | `settlementId`, `allowances`, `costs` | M16, M15 |
| EVT-SOC-15 | `soc.driver.timeReported` | `driverId`, `hours`, `period` | M16 |
| EVT-SOC-16 | `soc.agreementCost.recorded` | `agreementId`, `period`, `amount` | M12, M15 |
| EVT-SOC-17 | `soc.vehicle.usageVoided` | `usageId`, `vehicleId`, `reason`, `voidedBy`, `replacedByUsageId` (opcional; agregado el 5-11-2026 para alinear con M18; antes sin `replacedByUsageId`) | M15, M16, M10 |

#### M19 POR — productor M19

| ID | Evento(s) | Payload mínimo | Consumidores |
|---|---|---|---|
| EVT-POR-01 | `por.accountAccess.granted` | `accessId`, `userId`, `accountId`, `role` | T09, T02, T10 |
| EVT-POR-02 | `por.accountAccess.revoked` | `accessId`, `reason` | T09, caché de sesiones, T10 |
| EVT-POR-03 | `por.accountAccess.expired` | `accessId` | T09 |
| EVT-POR-04 | `por.accountAccess.suspended` | `accessId`, `reason` | T09 |
| EVT-POR-05 | `por.linkAttempt.blocked` | `userId`, `attempts` | T02, T09 |
| EVT-POR-06 | `por.delegation.invited` / `.accepted` / `.revoked` | `delegationId`, `accountId` | T09 |
| EVT-POR-07 | `por.formSubmission.submitted` | `submissionId`, `formCode`, `accountId` | M09, T09, T10 |
| EVT-POR-08 | `por.formSubmission.accepted` / `.rejected` / `.cancelled` | `submissionId`, `reason` | T09, T10 |
| EVT-POR-09 | `por.publicSubmission.received` | `publicSubmissionId`, `kind` | M09, T09 |
| EVT-POR-10 | `por.publicSubmission.receiptIssued` | `publicSubmissionId`, `receiptCode` | T09, T10 |
| EVT-POR-11 | `por.publicSubmission.deadlineAtRisk` | `publicSubmissionId`, `hoursLeft` | M09, T09 |
| EVT-POR-12 | `por.landing.published` | `landingVersionId` | CDN, T10 |
| EVT-POR-13 | `por.legacyImport.completed` | `importId`, `counts` | T07, T10 |
| EVT-POR-14 | `por.legacyUser.activated` | `userId` | T10 |
| EVT-POR-15 | `por.memberView.opened` | `userId`, `accountId` | T02 |
| EVT-POR-16 | `por.kiosk.statusChanged` | `kioskId`, `status` | M07, T09 |

#### T01 PLA — productor T01

| ID | Evento(s) | Payload mínimo | Consumidores |
|---|---|---|---|
| EVT-PLA-01 | `pla.tenant.created` | `tenantId`, `code`, `kind`, `planCode`, `legalName`, `cuit`, `legalForm`, `inaesRegistration`, `fiscalAddress` (T01 §12; DEC-064). Texto anterior: `tenantId`, `code`, `kind`, `planCode` | T02, T03, T09, T01, T04 (`cfg`: crea la entidad jurídica por defecto y la casa central, T04 §9.16, DEC-064), M01 |
| EVT-PLA-02 | `pla.tenant.statusChanged` | `from`, `to`, `reason` | T02, core/http, T10, T09 |
| EVT-PLA-03 | `pla.tenant.suspended` | `mode`, `portalMode`, `reasonCode` | core/jobs (T11 pausa programaciones), T09, M19 |
| EVT-PLA-04 | `pla.tenant.reactivated` | `tenantId`, `previousReasonCode`, `suspendedSince`, `skippedJobsCount` (definidos para T01 §8 y RN-PLA-013: la reactivación es `suspended` → `operational`; T11 reanuda las programaciones). Contraste con T01 del 5-11-2026: T01 §12.1 todavía declara el payload como "—"; T11 mantiene estos campos y T01 debe adoptarlos (pendiente de T01) | core/jobs (T11 reanuda), T09 |
| EVT-PLA-05 | `pla.tenant.closed` | `stage` | T02, T06, T09 |
| EVT-PLA-06 | `pla.capability.activated` | `moduleCode`, `mode` | Módulo activado, T03, T09, T04, T02, T11 (crea `jobSchedules`) |
| EVT-PLA-07 | `pla.capability.deactivated` | `moduleCode`, `newMode` | Módulo afectado, T03, T04, T02, M02, T11 (deshabilita `jobSchedules`) |
| EVT-PLA-08 | `pla.license.updated` | `moduleCode`, `validFrom`, `validTo`, `status` | T01, T09, T02, M02, T03 (invalida caché del mapa del sitio, T03 §12), T10 (recalcula catálogo visible, scopes y OpenAPI filtrado, T10 §12) |
| EVT-PLA-09 | `pla.saasContract.approved` | `contractId`, `version` | T01, M15 de `PLATFORM` |
| EVT-PLA-10 | `pla.usage.thresholdReached` | `dimension`, `pct`, `level` | T01, módulos, T09 |
| EVT-PLA-11 | `pla.supportCase.opened` / `.updated` / `.resolved` | `caseId`, `status`, `priority` | T09, T01 |
| EVT-PLA-12 | `pla.supportGrant.requested` / `.approved` / `.activated` / `.revoked` / `.expired` | `grantId`, `mode`, `breakGlass` | T02, T09, T01 |
| EVT-PLA-13 | `pla.backup.completed` / `pla.backup.failed` | `runId`, `type`, `tenantId` | T01 |
| EVT-PLA-14 | `pla.restore.requested` / `.completed` | `requestId`, `mode`, `point` | Módulos con `restoreHooks` (M06 JOB-FIS-05, M10 JOB-TEC-11), T09 |
| EVT-PLA-15 | `pla.sandbox.created` | `sandboxTenantId`, `environment` | T09 |
| EVT-PLA-16 | `pla.release.deployed` | `version`, `environment`, `ring` | T09, PWA |
| EVT-PLA-17 | `pla.alert.raised` / `pla.alert.resolved` | `alertId`, `ruleCode`, `severity` | T09 |
| EVT-PLA-18 | `pla.tenantExport.ready` | `exportId`, `purpose` | T09 |
| EVT-PLA-19 | `pla.incident.updated` | `incidentId`, `status`, `affectedTenantIds` | T01, T09 |
| EVT-PLA-20 | `pla.checklist.changed` | `capabilityCode`, `overallStatus`, `itemsChanged` | T09, T10 |
| EVT-PLA-21 | `pla.branch.created` / `.updated` | `branchId`, `code`, `name`, `status` | T03, T04 — **Reemplazado por EVT-CFG-20** `cfg.branch.created` / `.updated` / `.deactivated` de T04, dueño de `branches` (DEC-064; CTR-PLA-17, CTR-CFG-22). Se conserva como alias hasta el cierre de O2 (§12.4) |
| EVT-PLA-22 | `pla.tenantProfile.updated` | `tenantId`, `changedFields` | T03, T11, M06 |

#### T02 IAM — productor T02

| ID | Evento(s) | Payload mínimo | Consumidores |
|---|---|---|---|
| EVT-IAM-01 | `iam.identity.created` / `iam.identity.activated` | `identityId` | T09, M01, M19 |
| EVT-IAM-02 | `iam.identity.locked` / `iam.identity.unlocked` | `identityId`, `reason` | T09, alertas |
| EVT-IAM-03 | `iam.membership.invited` / `.activated` / `.suspended` / `.revoked` | `membershipId`, `identityId`, `context` | T09, T11 (reasignación), M19, M10, M16 (`employees.userAccountId`, M16 §12), T10 (revalida programaciones y presets compartidos, RF-BIA-038) |
| EVT-IAM-04 | `iam.role.assigned` / `iam.role.unassigned` | `assignmentId`, `roleId`, `membershipId` | T02 (caché de permisos), T09, T11 (candidatos de aprobación), T03 (invalida caché del mapa por usuario y rol, T03 §12), T10 (revalida programaciones y presets, RF-BIA-038) |
| EVT-IAM-05 | `iam.role.changed` / `iam.profile.changed` | `roleId` o `profileId` | T02 (caché de permisos), T03 (invalida caché del mapa por usuario y rol, T03 §12), T10 (revalida programaciones y presets, RF-BIA-038), T11 (recalcula candidatos de pasos activos, §12.5) |
| EVT-IAM-06 | `iam.session.started` / `iam.session.revoked` | `sessionId` | T10 (analítica de uso) |
| EVT-IAM-07 | `iam.login.failed` | `windowStart`, `windowEnd`, `failedCount`, `identityIds[]` [VERIFICAR]. Texto anterior: agregado por ventana | T08 (alertas de seguridad) |
| EVT-IAM-08 | `iam.mfa.enrolled` / `iam.mfa.removed` | `identityId`, `factorType` | T09 |
| EVT-IAM-09 | `iam.password.changed` / `iam.password.resetCompleted` | `identityId` | T09 |
| EVT-IAM-10 | `iam.authorization.requested` / `.granted` / `.rejected` / `.expired` / `.consumed` | `authorizationRequestId`, `capability`, `requesterId`, `approverId` | T09, dueño de la capability autorizada (prefijo de `authorizationRequests.capability`; T02 §7.13 y §12: "módulo dueño, ejecución automática"). Identificados al 5-11-2026: M01 (pago en efectivo con autorización de supervisor, PA-PER-16), M02 (deuda en el domicilio, RN-CAT-030), M07 (anulación con sesión cerrada, RN-COB-073), M08 (dispensa del recargo, RN-MOR-021, y condonación en convenios, CU-IAM-04 de T02) [VERIFICAR: T02 no lista todos los módulos que usan autorización diferida], T11 (bandeja) |
| EVT-IAM-11 | `iam.supportAccess.requested` / `.granted` / `.started` / `.ended` / `.revoked` | `grantId` | T09, T01 |
| EVT-IAM-12 | `iam.apiClient.created` / `.credentialRotated` / `.revoked` | `apiClientId` | T10 |
| EVT-IAM-13 | `iam.idp.activated` / `iam.idp.disabled` | `idpConfigId` | Sin consumidor (auditoría/BI) |
| EVT-IAM-14 | `iam.securityAlert.raised` | `alertId`, `kind` | T09, T01 |
| EVT-IAM-15 | `iam.portal.accountLinked` / `iam.portal.accountUnlinked` | `identityId`, `personId` | M01, M19, M16 |
| EVT-IAM-16 | `iam.audit.integrityFailed` | `partitionId` | T08 (incidente de seguridad), T09 (aviso a P-SEC y T-ADM) |

#### T04 CFG — productor T04

| ID | Evento(s) | Payload mínimo | Consumidores |
|---|---|---|---|
| EVT-CFG-01 | `cfg.configVersion.created` | `versionId`, `origin` | T10 |
| EVT-CFG-02 | `cfg.configVersion.submitted` | `versionId`, clases | T11 |
| EVT-CFG-03 | `cfg.configVersion.approved` / `.rejected` | `versionId`, decisor | T09 |
| EVT-CFG-04 | `cfg.configVersion.scheduled` | `versionId`, `scheduledAt` | Sin consumidor (auditoría/BI) |
| EVT-CFG-05 | `cfg.configVersion.published` | `versionId`, ítems, `effectiveAt`, `contractPolicy` | M01–M19, T01, T02, T03, T06, T07, T08, T09, T10 (invalida cachés de diccionario y calendario, T10 §12), T11 (caché de claves PRM; M02, M04, M05, T02 declarados) |
| EVT-CFG-06 | `cfg.configVersion.failed` / `.cancelled` / `.rolledBack` | `versionId`, motivo | T09 |
| EVT-CFG-07 | `cfg.parameter.changed` | `key`, `scope`, `validFrom`, `retroactive` | Dueño de la clave PRM (prefijo `PRM-<COD>`): M01–M19, T01, T02, T03, T06, T07, T08, T09, T10, T11 (M04 declarado) |
| EVT-CFG-08 | `cfg.masterRecord.changed` | `tableCode`, `recordId`, `op` | Módulos que cachean la tabla `tableCode` (M01–M19, T09, T10; suscripción con filtro por `tableCode`) |
| EVT-CFG-09 | `cfg.masterRecord.merged` | `tableCode`, `survivorId`, `mergedIds` | M01, M03, M10 |
| EVT-CFG-10 | `cfg.platformTable.updated` | `tableCode`, `releaseNumber`, `affectsCalculation` | Tenants, M06, M08, M16 |
| EVT-CFG-11 | `cfg.holiday.changed` | `calendarCode`, `date` | M05, M08, M09, M10, T11 (SLA) |
| EVT-CFG-12 | `cfg.economicIndex.valuePublished` / `.valueRevised` | `seriesId`, `date`, `value` (nombre de T05 §7.2.1 adoptado por T04 el 5-11-2026; antes `seriesCode`) | M08, M15, M05, M14, M04, M13 |
| EVT-CFG-13 | `cfg.taxRegistry.imported` | `registryCode`, período, filas | M06 |
| EVT-CFG-14 | `cfg.geo.streetProposed` / `.streetDecided` | `streetId` | M01 (resuelve `addresses.streetRequestId` al decidirse), T09 (aviso al curador de plataforma y al tenant) |
| EVT-CFG-15 | `cfg.geoReference.updated` | `subjectType`, `subjectId`, `status` | M01, M10, T10 |
| EVT-CFG-16 | `cfg.customField.defined` / `.deprecated` | `entity`, `key` | Dueño de la entidad extendida según el enum `customFieldDefinitions.entity` de T04 §7: M01 (`person`, `account`, `property`), M02 (`serviceContract`, `category`, `product` comercial), M09 (`ticket`), M10 (`workOrder`), M12 (`supplier`), M13 (`product` de stock, `fixedAsset`), M16 (`employee`); T10, T11 (formularios). Antes "M01–M19 [VERIFICAR: T04 no lista las entidades extensibles]" |
| EVT-CFG-17 | `cfg.seedPack.applied` / `.removed` | `tenantId`, paquete | T01 |
| EVT-CFG-18 | `cfg.integrity.issueDetected` | `tenantId`, hallazgos | T01, T09 |
| EVT-CFG-19 | `cfg.legalEntity.created` / `.updated` / `.deactivated` | `legalEntityId`, `code`, `cuit`, `legalName`, `isDefault`, `status`, `changedFields`, `validFrom` | M06 (perfil fiscal y puntos de venta, RN-FIS-131), M05, M15 (libros por entidad, CTR-CON-21), M14, M16, T03 (pie de documentos), T10 (RF-CFG-134 a 138; DEC-064) |
| EVT-CFG-20 | `cfg.branch.created` / `.updated` / `.deactivated` | `branchId`, `code`, `name`, `legalEntityId`, `uses`, `status` | T02 (alcance por sucursal), T03 (slots de marca por sucursal), M06 (puntos de venta de la sucursal), M07 (cajas, RN-COB-153), M09, M13 (DEC-064; reemplaza a EVT-PLA-21) |

#### T06 INT — productor T06

T06 usa kebab-case en el hecho. Los nombres canónicos en camelCase propuestos van entre corchetes (CTR-WFL-05).

| ID | Evento(s) | Payload mínimo | Consumidores |
|---|---|---|---|
| EVT-INT-01 | `int.connection.activated` / `.suspended` / `.modeChanged` (antes `.mode-changed` [`modeChanged`]) | `connectionId`, `mode` | Dueños de conexiones de dominio (`connectionId`): M03, M06, M07, M09, M10, M14, T09, T11 (firma digital); T01, T02 |
| EVT-INT-02 | `int.connection.blocked` | `connectionId`, `reason` | M05, M06, M07, T09 |
| EVT-INT-03 | `int.operation.succeeded` / `.failed` / `.uncertain` / `.manuallyResolved` (antes `.manually-resolved` [`manuallyResolved`]) / `.cancelled` | `integrationOperationId`, `businessRef` | Dueño de `businessRef` (los dueños de conexión de EVT-INT-01: M03, M06, M07, M09, M10, M14, T09), T11 (pasos de operación) |
| EVT-INT-04 | `int.circuit.opened` / `int.circuit.closed` | `connectionId` | T11 (pausa de corridas), M07 (salud del conector; excepción `connectorDown`, M07 §12), T09 (pausa y reanuda colas del canal, T09 §12); tableros y alertas de T06 |
| EVT-INT-05 | `int.certificate.expiring` / `.expired` / `int.credential.expiring` / `.rotated` | `connectionId`, `daysLeft` | Alertas, T09, T04 |
| EVT-INT-06 | `int.arca.caeObtained` / `.caeRejected` / `.caeaObtained` / `.caeaInformed` / `.paramsSynced` (antes `int.arca.cae-obtained` [`caeObtained`] / `cae-rejected` / `caea-obtained` / `caea-informed` / `params-synced`) | `documentRef`, `result` | M05, M06 |
| EVT-INT-07 | `int.padron.personaRetrieved` (antes `int.padron.persona-retrieved` [`personaRetrieved`]) | `taxId` (enmascarado), `result` | M01, M12 |
| EVT-INT-08 | `int.paymentIntent.created` (antes `int.payment-intent.created` [`paymentIntent.created`]) / `int.payment.confirmed` / `.rejected` / `.reversed` / `.refunded` / `.unmatched` | `externalPaymentId`, `intentId`, `amount` | M07, M19 |
| EVT-INT-09 | `int.debtPublication.acknowledged` / `.rejected` (antes `int.debt-publication.acknowledged` / `.rejected` [`debtPublication.*`]) | `publicationId` | M07 |
| EVT-INT-10 | `int.remittance.lineReceived` / `.fileApplied` (antes `int.remittance.line-received` / `.file-applied`) | `remittanceId` | M07 |
| EVT-INT-11 | `int.directDebit.adhesionUpdated` / `.resultReceived` (antes `int.direct-debit.adhesion-updated` / `.result-received`) | `mandateRef` | M07, M01 |
| EVT-INT-12 | `int.bank.movementsReceived` / `.balancesReceived` (antes `int.bank.movements-received` / `.balances-received`) | `accountRef`, `date` | M14 |
| EVT-INT-13 | `int.message.sent` / `.delivered` / `.read` / `.bounced` / `.failed` / `.inboundReceived` (antes `.inbound-received`) | `messageRef`, `channel` | T09, M09 |
| EVT-INT-14 | `int.meter.readingReceived` / `.commandResult` / `int.prepaid.creditIssued` (antes `int.meter.reading-received` / `.command-result` / `int.prepaid.credit-issued`) | `meterRef`, `result` | M03, M08, M10 |
| EVT-INT-15 | `int.network.provisioningResult` (antes `int.network.provisioning-result`) | `commandId`, `result` | M10, M08 |
| EVT-INT-16 | `int.cdr.batchReceived` (antes `int.cdr.batch-received`) | `batchId`, `centralId` | M10 (importa), M04 |
| EVT-INT-17 | `int.fleet.positionsReceived` (antes `int.fleet.positions-received`) | `deviceId`, `count` | M18 |
| EVT-INT-18 | `int.signature.completed` / `int.signature.rejected` | `externalRef`, `documentRef` | T11 (firma digital), M16, M08, M12 |
| EVT-INT-19 | `int.file.generated` / `.delivered` / `.received` / `.rejected` | `fileId`, `connectionId` | Dueño del lote (`businessBatchRef`): M03, M06, M07, M14 (M07 declarado) |
| EVT-INT-20 | `int.reconciliation.closed` / `.differencesFound` (antes `.differences-found`) | `runId` | M07, M14, M06 |
| EVT-INT-21 | `int.contingency.started` / `int.contingency.ended` | `connectionId` | M05, M06, M07 |
| EVT-INT-22 | `int.agent.online` / `.offline` / `.commandResult` (antes `.command-result`) | `agentId` | M09, M07, M11 |
| EVT-INT-23 | `int.ai.completionReady` (antes `int.ai.completion-ready`) | `requestId` | T09 (resultado de moderación y borradores IA, T09 §12); M09 y T10 cuando pidan completitudes (`crmAiSuggestions`, `aiQuestions`) [VERIFICAR] |
| EVT-INT-24 | `int.serviceUsage.received` | `connectionId`, `providerCode`, `period` (`YYYY-MM`), `receivedAt`, `fileExchangeId?`, `lines[{ externalRef, unit (sms\|mailbox\|gb), quantity, measuredFrom, measuredTo }]`, `messageId` (DEC-084; T06 no resuelve contratos) | M10 (atribuye cada línea al contrato, RF-TEC-195, y publica EVT-TEC-38 hacia M04) |

#### T07 MIG — productor T07

| ID | Evento(s) | Payload mínimo | Consumidores |
|---|---|---|---|
| EVT-MIG-01 | `mig.snapshot.ready` | `snapshotId` | T07 (perfilado), T04 (JOB-CFG-10) |
| EVT-MIG-02 | `mig.run.started` / `.loaded` / `.failed` / `.accepted` | `runId` | T09, T02 |
| EVT-MIG-03 | `mig.issue.assigned` | `issueId`, `assignee` | T11 (bandeja) |
| EVT-MIG-04 | `mig.reconciliation.approved` / `.rejected` | `runId` | Sin consumidor (auditoría/BI): tablero del proyecto de T07 |
| EVT-MIG-05 | `mig.parallel.compared` / `.approved` | `cycleId` | Sin consumidor (auditoría/BI): tablero del proyecto de T07 |
| EVT-MIG-06 | `mig.domain.switched` | `domain`, `mode` | Dueños del dominio migrado (M01–M19), M07, T06 |
| EVT-MIG-07 | `mig.cutover.completed` | `tenantId`, `at` | M05, M06, M07, M19, T09 |
| EVT-MIG-08 | `mig.rollback.executed` | `scope` | Módulos del alcance de la corrida revertida (M01–M19, T02, T04) |
| EVT-MIG-09 | `mig.person.merged` | `survivorPersonId`, `mergedPersonIds` | M01 y módulos con referencias a personas |
| EVT-MIG-10 | `mig.snapshot.blocked` (10-11-2026, DEC-103; T07 §12, RN-MIG-013) | `snapshotId`, cantidad de hallazgos por tipo y tablas afectadas; nunca valores (el escaneo previo encontró números de tarjeta o columnas con apariencia de credencial no listadas) | T09 (aviso al líder de migración y al responsable de seguridad del proyecto), T02 (auditoría) |

#### T03 UXD — productor T03

| ID | Evento(s) | Payload mínimo | Consumidores |
|---|---|---|---|
| EVT-UXD-01 | `uxd.branding.published` | `tenantId`, `releaseNumber`, `changedSlots[]` | Clientes, M05, T09, T11 (plantillas: invalidan logos en caché de render), CDN |
| EVT-UXD-02 | `uxd.branding.reverted` | `tenantId`, `releaseNumber`, `revertedFrom` | Los mismos de EVT-UXD-01: clientes, M05, T09, T11 (invalida logos en caché de render), CDN |
| EVT-UXD-03 | `uxd.asset.processed` | `tenantId`, `assetId`, `status` | Sin consumidor (auditoría/BI): lo lee el editor de marca de T03 |
| EVT-UXD-04 | `uxd.dictionary.published` | `tenantId`, `releaseNumber`, `changedKeys[]` | Clientes, T09, M05, T10, M09, T11 (etiquetas `dict:` de plantillas y formularios) |
| EVT-UXD-05 | `uxd.dictionary.reverted` | `tenantId`, `releaseNumber`, `revertedFrom` | Los mismos de EVT-UXD-04: clientes, T09, M05, T10, M09, T11 (etiquetas `dict:` de plantillas y formularios) |
| EVT-UXD-06 | `uxd.dictionary.missingKeyDetected` | `tenantId`, `key`, `channel`, `count` | Sin consumidor (auditoría/BI): tablero de plataforma de T03 |
| EVT-UXD-07 | `uxd.flag.changed` | `scope`, `tenantId`, `key`, `enabled`, `reason` | Clientes, T02 |
| EVT-UXD-08 | `uxd.catalog.updated` | `catalogVersion`, `added[]`, `renamed[]`, `deprecated[]` | T03 (JOB-UXD-03), administradores |

#### T08 NFR — productor T08

T08 no declara payload. El mínimo propuesto es el sobre más los identificadores indicados.

| ID | Evento(s) | Payload mínimo | Consumidores |
|---|---|---|---|
| EVT-NFR-01 | `nfr.privacyNotice.published` | `noticeId`, `version` | M19, T09 |
| EVT-NFR-02 | `nfr.consent.granted` | `personId`, `purpose`, `channel` | T09, M09 |
| EVT-NFR-03 | `nfr.consent.revoked` | `personId`, `purpose`, `channel` | T09, T10 |
| EVT-NFR-04 | `nfr.dataSubjectRequest.received` | `requestId`, `kind` | T09 (responsable de datos), T11 (bandeja) |
| EVT-NFR-05 | `nfr.dataSubjectRequest.completed` / `.rejected` | `requestId`, `outcome` | M19, T02 |
| EVT-NFR-06 | `nfr.personData.erasureRequested` | `requestId`, `personId`, `mode` | Módulos con colecciones `x-pii` (T05 §7.1.12): M01–M19, T01, T02, T04, T07, T08, T09, T10, T11 (documentos y formularios; responde `wfl.personData.erased`) |
| EVT-NFR-07 | `nfr.legalHold.activated` / `.released` | `holdId`, `scope` | Dueños de datos (M01–M19, T02, T09, T10), T11 (aplica `legalHolds` documentales) |
| EVT-NFR-08 | `nfr.retentionRun.completed` | `runId`, `counts` | Tablero, T02 |
| EVT-NFR-09 | `nfr.securityIncident.notified` | `incidentId`, `severity` | T09 (aviso al administrador del tenant) |
| EVT-NFR-10 | `nfr.restoreDrill.completed` | `drillId`, `result` | Sin consumidor (auditoría/BI): tablero de plataforma |
| EVT-NFR-11 | `nfr.key.rotated` | `keyId`, `scope` | Workers, T08 (JOB-NFR-08) |
| EVT-NFR-12 | `nfr.alert.fired` / `.resolved` | `alertId`, `severity` | T01 (página de estado), T09 (aviso a la guardia) |
| EVT-NFR-13 | `nfr.invariant.violated` | `invariantCode`, `fingerprint` | Tablero del tenant, T11 (bandeja operativa) |
| EVT-NFR-14 | `nfr.quota.exceeded` | `dimension`, `value`, `limit` | Tablero del tenant, T01 |
| EVT-NFR-15 | `nfr.subprocessor.added` | `subprocessorId` | T09 (aviso a los administradores de cada tenant) |
| EVT-NFR-16 | `nfr.file.infected` | `objectKey`, `storedFileId`, `uploadedBy` | Seguridad, usuario que subió, T11 (rechaza la versión documental) |
| EVT-NFR-17 | `nfr.auditChain.broken` | `partitionId` | T09 (aviso a la guardia y al oficial de seguridad) |
| EVT-NFR-18 | `nfr.referentialIntegrity.broken` (10-11-2026, DEC-100; T08 §12, RNF-NFR-260) | Huella de la referencia rota: colección y campo de origen, documento de origen, colección destino; una vez por hallazgo nuevo de JOB-NFR-25 | T11 (ítem de la bandeja de integridad), guardia de operaciones (alerta SEV3; SEV2 si apunta a otro tenant), tablero del tenant |

#### T09 COM — productor T09

| ID | Evento(s) | Payload mínimo | Consumidores |
|---|---|---|---|
| EVT-COM-01 | `com.post.published` | `postId`, `type`, `channels`, `audienceSnapshotId`, `notify` | M19, T10, T09 |
| EVT-COM-02 | `com.post.reviewRequested` | `postId`, `wflRequestId` | T11 (aprobación editorial), T09 |
| EVT-COM-03 | `com.post.decided` | `postId`, `decision`, `note` | T09 |
| EVT-COM-04 | `com.post.archived` | `postId` | M19 |
| EVT-COM-05 | `com.comment.created` | `commentId`, `postId`, `status` | T10 |
| EVT-COM-06 | `com.comment.replied` | `commentId`, `parentId`, `authorUserId` | T09 |
| EVT-COM-07 | `com.comment.moderated` | `commentId`, `action`, `reasonCode`, `matchedAi` | T09, T10 |
| EVT-COM-08 | `com.mention.created` | `commentId`, `mentionedUserIds[]` | T09 |
| EVT-COM-09 | `com.report.created` | `reportId`, `commentId`, `reasonCode` | T09 (cola de moderación) |
| EVT-COM-10 | `com.report.resolved` | `reportId`, `result` | T09 |
| EVT-COM-11 | `com.sanction.applied` / `.revoked` / `.expired` | `sanctionId`, `userId`, `kind`, `endsAt` | T09, T02 |
| EVT-COM-12 | `com.sanction.appealDecided` | `sanctionId`, `decision` | T09 |
| EVT-COM-13 | `com.newsletter.issued` | `newsletterId`, `totals` | T10 |
| EVT-COM-14 | `com.survey.published` / `.closed` | `surveyId`, `kind`, `audienceSnapshotId` | M19, T10 |
| EVT-COM-15 | `com.survey.responseSubmitted` | `surveyId`, `responseId`, `context`, `scoreBand`, `alerts[]` | M09, M10, T10 |
| EVT-COM-16 | `com.survey.criticalAlertRaised` | `surveyId`, `responseId`, `questionId`, `action`, `context` | M09 |
| EVT-COM-17 | `com.event.registrationChanged` | `eventId`, `registrationId`, `status` | T09, T10, T11 (agenda del inscripto) |
| EVT-COM-18 | `com.event.changed` / `.cancelled` | `eventId`, `changes` | T09, M19, T11 (agenda) |
| EVT-COM-19 | `com.event.finished` | `eventId`, `counters` | T10 |
| EVT-COM-20 | `com.benefit.redemptionIssued` | `benefitId`, `redemptionId`, `personId` | T09, T10 |
| EVT-COM-21 | `com.benefit.redeemed` | `benefitId`, `redemptionId`, `partnerId` | T10 |
| EVT-COM-22 | `com.outage.published` | `outageNoticeId`, `kind`, `serviceIds`, `window`, `affected` | M09, M19, T10 |
| EVT-COM-23 | `com.outage.started` | `outageNoticeId` | M09, M19 |
| EVT-COM-24 | `com.outage.rescheduled` / `.cancelled` | `outageNoticeId`, `newNoticeId` | M09, M19 |
| EVT-COM-25 | `com.outage.restored` | `outageNoticeId`, `restoredAt` | M09, M19, T10 |
| EVT-COM-26 | `com.outage.criticalAffected` | `outageNoticeId`, `contractIds[]` | M01, M08, M09 |
| EVT-COM-27 | `com.communication.accepted` / `.delivered` / `.read` / `.failed` / `.bounced` / `.expired` / `.undeliverable`, y `com.communication.statusChanged` | `communicationId`, `typeCode`, `channel`, `status`, `failureClass`, `businessRef`, `at` | M05, M08, M09, M01, T02, T10, T11 (firma por OTP y acuses de mesa de entradas) |
| EVT-COM-28 | `com.communication.milestoneReached` | `communicationId`, `businessRef`, `milestone`, `proofRef` | Módulo emisor (M08 habilita el siguiente paso), T11 (pasos `waitEvent`) |
| EVT-COM-29 | `com.communication.allChannelsFailed` | `businessRef`, `typeCode`, `attemptedChannels[]` | Emisor de la comunicación (`businessRef`): M08 (evidencia de avisos de mora, M08 §12), M05, M09, T02; T11 (tarea de canal alternativo) |
| EVT-COM-30 | `com.consent.changed` | `personId`, `channel`, `purpose`, `action`, `source` | M01, T10 |
| EVT-COM-31 | `com.preference.changed` | `personId`, `changes`, `invoiceDigital` | M05, M19 |
| EVT-COM-32 | `com.suppression.added` / `.lifted` | `channel`, `contactPointId`, `reason` | M01 |
| EVT-COM-33 | `com.campaign.statusChanged` | `campaignId`, `status` | T11 (aprobación), T10 |
| EVT-COM-34 | `com.campaign.completed` | `campaignId`, `metrics` | T10 |
| EVT-COM-35 | `com.template.published` | `templateId`, `versionNumber`, `typeCode`, `channel` | T02 |
| EVT-COM-36 | `com.messagingUsage.thresholdReached` | `channel`, `pct`, `period` | T01, T09 |
| EVT-COM-37 | `com.comment.derivedToCrm` | `commentId`, `personId`, `text` | M09 |
| EVT-COM-38 | `com.platformNotice.published` | `noticeId`, `targetTenants` | Sin consumidor modular (auditoría/BI): T09 lo muestra en la bandeja de cada tenant destino |
| EVT-COM-39 | `com.invoiceMessage.activated` / `.expired` | `invoiceMessageId`, `validFrom`, `validTo` | M05 |
| EVT-COM-40 | `com.message.dispatchRequested` (antes `com.message.dispatch-requested`, nombre con guion que T06 consumía sin productor; 5-11-2026, pendientes de la sincronización, PA-WFL-24) | `communicationId`, `communicationAttemptId`, `channel`, `providerConnectorId`, `idempotencyKey` (comunicación `queued` lista para un canal con conector, §8.10 de T09) | T06 (envía por el conector del canal; devuelve `int.message.*`) |

#### T10 BIA — productor T10

| ID | Evento(s) | Payload mínimo | Consumidores |
|---|---|---|---|
| EVT-BIA-01 | `bia.report.published` | `reportId`, `version` | T10 (programaciones), T02 |
| EVT-BIA-02 | `bia.report.deprecated` | `reportId` | T09 (aviso a los propietarios de programaciones) |
| EVT-BIA-03 | `bia.reportRun.completed` | `runId`, `reportId` | T09, T10 |
| EVT-BIA-04 | `bia.reportRun.failed` | `runId`, `reportId`, `retriable` | T09, T01 |
| EVT-BIA-05 | `bia.export.ready` | `exportId`, `expiresAt` | T09 |
| EVT-BIA-06 | `bia.export.downloaded` | `exportId`, `userId` | T02 |
| EVT-BIA-07 | `bia.schedule.suspended` | `scheduleId`, `reason` | T09 |
| EVT-BIA-08 | `bia.indicator.certified` | `indicatorId`, `version` | Sin consumidor (auditoría/BI): tableros de T10 |
| EVT-BIA-09 | `bia.kpiAlert.opened` | `alertId`, `indicatorId` | T09, webhooks públicos |
| EVT-BIA-10 | `bia.kpiAlert.resolved` | `alertId` | T09 |
| EVT-BIA-11 | `bia.apiClient.activated` / `.suspended` / `.revoked` | `apiClientId` | T02 |
| EVT-BIA-12 | `bia.webhookSubscription.disabled` | `subscriptionId`, `reason` | T09 (aviso al contacto técnico) |
| EVT-BIA-13 | `bia.dataset.freshnessBreached` | `datasetId`, `lagMinutes` | T01 |
| EVT-BIA-14 | `bia.reconciliation.mismatch` | `indicatorId`, `difference` | T01, dueño del indicador |
| EVT-BIA-15 | `bia.customReport.submitted` / `.published` | `customReportId` | T11 (bandeja de aprobaciones) |
| EVT-BIA-16 | `bia.bulkExport.ready` | `bulkExportId` | Webhook público, T01 |
| EVT-BIA-17 | `bia.openData.published` / `.withdrawn` | `publicationId` | M19 |
| EVT-BIA-18 | `bia.exitExport.delivered` | `exportId` | T01 |

### 12.4 Conciliación de nombres consumidos sin productor declarado

Consolidar las secciones 12 mostró que varios consumidores usan nombres que su productor **no publica**. El nombre canónico es el del productor (RN-WFL-003, RF-WFL-015). Los alias se registran en `eventTypes.aliases` y el chequeo de CI los rechaza (CTR-WFL-03). Los casos marcados **brecha** no tienen equivalente y exigen que el productor agregue el evento (PA-WFL-01).

Estado de la conciliación (4/11/2026): las 12 brechas tienen productor declarado y los consumidores usan el nombre canónico con su EVT-ID. La tabla se conserva como registro de `eventTypes.aliases` hasta su vencimiento (cierre de O2). Desde el 5-11-2026 cada fila tiene un solo canónico: las filas que agrupaban varios se separaron (el texto entre paréntesis indica qué caso del alias corresponde a cada canónico). En el cierre de residuales del mismo día (PA-WFL-23, Asumida DEC-072) cada alias quedó con un solo canónico: de cada grupo se conserva una fila y las demás figuran como "retirado como alias" (el consumidor se suscribe directamente a ese canónico); al final de la tabla se agregan los alias de los eventos renombrados por la convención de nombres (INC-06-11).

| Nombre usado por el consumidor | Consumidor(es) | Canónico | Observación |
|---|---|---|---|
| `fac.batch.issued` | M07, M17, M07 JOB-COB-11/16, M17 JOB-INS-01 | `fac.billingRun.issued` (EVT-FAC-05) | Alias |
| `fac.invoice.voided` | M03, M04, M07, M11, M17, M18, M07 JOB-COB-22 | `fac.invoice.annulled` (EVT-FAC-08) | Alias |
| `fac.invoice.adjusted` (ajuste a favor) | M17 | `fac.creditNote.issued` (EVT-FAC-10) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072: único canónico del alias) |
| fac.invoice.adjusted (ajuste en contra), retirado como alias | M17 | `fac.debitNote.issued` (EVT-FAC-11) | Retirado como alias el 5-11-2026 (PA-WFL-23, Asumida DEC-072): un alias resuelve a un solo canónico y fac.invoice.adjusted queda en `fac.creditNote.issued`; para este caso el consumidor se suscribe directamente al canónico de esta fila. Antes "Alias" |
| `fac.batch.discarded` | M04 | `fac.billingRun.discarded` (EVT-FAC-21) | Brecha resuelta: M05 lo declara; M04 consume el canónico |
| `fac.cycle.closed` | M02 | `fac.billingCycle.closed` (EVT-FAC-17) | Alias |
| `fac.fiscal.authorized` | M07 | `fis.invoice.authorized` (EVT-FIS-01) | Productor es M06 |
| `fac.fiscal.failed` | M07 | `fis.authorization.rejected` (EVT-FIS-02) | Productor es M06 |
| `fac.estimate.accepted` | M10 | `ven.quote.accepted` (EVT-VEN-05) | Productor es M11 |
| `fac.adjustment.issued` (ajuste a favor) | M09 | `fac.creditNote.issued` (EVT-FAC-10) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072: único canónico del alias) |
| fac.adjustment.issued (ajuste en contra), retirado como alias | M09 | `fac.debitNote.issued` (EVT-FAC-11) | Retirado como alias el 5-11-2026 (PA-WFL-23, Asumida DEC-072): un alias resuelve a un solo canónico y fac.adjustment.issued queda en `fac.creditNote.issued`; para este caso el consumidor se suscribe directamente al canónico de esta fila. Antes "Alias" |
| `fac.hours.billed` | M09 | `fac.billableItem.billed` (EVT-FAC-20) | Alias |
| `fis.invoice.observed` | M05 | `fis.authorization.detained` (EVT-FIS-03) | Alias |
| `fis.invoice.rejected` | M05 | `fis.authorization.rejected` (EVT-FIS-02) | Alias |
| `fis.invoice.uncertain` | M05 | `fis.authorization.uncertain` (EVT-FIS-04) | Alias |
| `fis.taxConfig.published` | M04 | `fis.normativeAdoption.approved` (EVT-FIS-10) | Alias |
| `fis.obligation.dueRegistered` | M14 | `fis.obligation.created` (EVT-FIS-13) | Alias |
| `fis.withholding.voided` | M12 | `fis.withholding.cancelled` (EVT-FIS-12) | Alias |
| `fis.withholdingComputation.updated` | M14 | `fis.withholdingComputation.updated` (EVT-FIS-23) | Brecha resuelta: M06 lo declara |
| `fis.misComprobantes.reconciled` | M12 | `fis.misComprobantes.reconciled` (EVT-FIS-22) | Brecha resuelta: M06 lo declara |
| `med.consumption.revoked` | M05 | `med.consumption.voided` (EVT-MED-13) | Alias |
| `med.selfReading.validated` | M19 | `med.selfReading.accepted` (EVT-MED-27) | Alias |
| `med.prepaid.credited` | M19 | `med.prepaidTopUp.delivered` (EVT-MED-23) | Alias |
| `med.anomaly.detected` (sospecha) | M10 | `med.point.suspicionRaised` (EVT-MED-17) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072: único canónico del alias) |
| med.anomaly.detected (pedido de inspección), retirado como alias | M10 | `med.point.inspectionRequested` (EVT-MED-16) | Retirado como alias el 5-11-2026 (PA-WFL-23, Asumida DEC-072): un alias resuelve a un solo canónico y med.anomaly.detected queda en `med.point.suspicionRaised`; para este caso el consumidor se suscribe directamente al canónico de esta fila. Antes "Alias" |
| `med.readingRoute.completed` | M16 | `med.readingBatch.closed` (EVT-MED-07) | Alias |
| `cat.serviceContract.*`, `per.serviceContract.*`, `per.contract.*` | M01, M03, M13, M17, M18, M19 | `cat.contract.*` (EVT-CAT-09..23) | Productor es M02; cada hecho se mapea al canónico del mismo nombre |
| `cat.serviceContract.terminated` | M13 (§9.4, recupero de equipos) | `cat.contract.terminated` (EVT-CAT-15) | Alias. M02 ya publica el evento canónico de terminación (EVT-CAT-15 incluye a M13 como consumidor): no se crea un EVT nuevo (5-11-2026) |
| `cat.contract.created` | M09, M05 | `cat.contract.requested` (EVT-CAT-06) | Alias |
| `cat.contract.updated` (plan) | M09, M05 | `cat.contract.planChanged` (EVT-CAT-18) | Alias; `updated` genérico no existe (5-11-2026, PA-WFL-23, Asumida DEC-072: único canónico del alias) |
| cat.contract.updated (categoría), retirado como alias | M09, M05 | `cat.contract.categoryChanged` (EVT-CAT-19) | Retirado como alias el 5-11-2026 (PA-WFL-23, Asumida DEC-072): un alias resuelve a un solo canónico y cat.contract.updated queda en `cat.contract.planChanged`; para este caso el consumidor se suscribe directamente al canónico de esta fila. Antes "Alias; updated genérico no existe" |
| cat.contract.updated (domicilio), retirado como alias | M09, M05 | `cat.contract.addressChanged` (EVT-CAT-20) | Retirado como alias el 5-11-2026 (PA-WFL-23, Asumida DEC-072): un alias resuelve a un solo canónico y cat.contract.updated queda en `cat.contract.planChanged`; para este caso el consumidor se suscribe directamente al canónico de esta fila. Antes "Alias; updated genérico no existe" |
| cat.contract.updated (marca), retirado como alias | M09, M05 | `cat.contract.flagChanged` (EVT-CAT-21) | Retirado como alias el 5-11-2026 (PA-WFL-23, Asumida DEC-072): un alias resuelve a un solo canónico y cat.contract.updated queda en `cat.contract.planChanged`; para este caso el consumidor se suscribe directamente al canónico de esta fila. Antes "Alias; updated genérico no existe" |
| `cat.plan.changed` | M04 | `cat.contract.planChanged` (EVT-CAT-18) | Alias |
| `cat.category.changed` | M03 | `cat.contract.categoryChanged` (EVT-CAT-19) | Alias |
| `cat.offer.changed` (alta de servicio) | M19 | `cat.tenantService.published` (EVT-CAT-02) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072: único canónico del alias) |
| cat.offer.changed (baja de servicio), retirado como alias | M19 | `cat.tenantService.withdrawn` (EVT-CAT-03) | Retirado como alias el 5-11-2026 (PA-WFL-23, Asumida DEC-072): un alias resuelve a un solo canónico y cat.offer.changed queda en `cat.tenantService.published`; para este caso el consumidor se suscribe directamente al canónico de esta fila. Antes "Alias" |
| cat.offer.changed (alta de plan), retirado como alias | M19 | `cat.plan.published` (EVT-CAT-05) | Retirado como alias el 5-11-2026 (PA-WFL-23, Asumida DEC-072): un alias resuelve a un solo canónico y cat.offer.changed queda en `cat.tenantService.published`; para este caso el consumidor se suscribe directamente al canónico de esta fila. Antes "Alias" |
| cat.offer.changed (baja de plan), retirado como alias | M19 | `cat.plan.discontinued` (EVT-CAT-05) | Retirado como alias el 5-11-2026 (PA-WFL-23, Asumida DEC-072): un alias resuelve a un solo canónico y cat.offer.changed queda en `cat.tenantService.published`; para este caso el consumidor se suscribe directamente al canónico de esta fila. Antes "Alias" |
| `cat.concept.versionPublished` | M11 | `cat.configVersion.published` (EVT-CAT-04) | Alias |
| `cat.serviceCopy.prepared` | T04 | `cat.serviceCopy.prepared` (EVT-CAT-26) | Brecha resuelta: M02 lo declara |
| `tar.version.published` | M05 | `tar.schedule.published` (EVT-TAR-004) | Alias |
| `tar.call.rated` | M10 | `tar.calls.rated` (EVT-TAR-019) | Alias |
| `tec.cdr.imported` | M04 | `tec.cdr.attributed` (EVT-TEC-27) | Alias |
| `tec.installation.completed` | M02, M04 | `tec.installation.activationConfirmed` (EVT-TEC-16) | Alias |
| `tec.workOrder.completed` / `.confirmed` | M04, M08, M11 | `tec.workOrder.closed` (EVT-TEC-07) | Alias |
| tec.workOrder.failed (orden cancelada), retirado como alias | M04, M08, M11 | `tec.workOrder.cancelled` (EVT-TEC-08) | Retirado como alias el 5-11-2026 (PA-WFL-23, Asumida DEC-072): un alias resuelve a un solo canónico y tec.workOrder.failed queda en `tec.visit.failed`; para este caso el consumidor se suscribe directamente al canónico de esta fila. Antes "Alias" |
| `tec.workOrder.failed` (visita fallida) | M04, M08, M11 | `tec.visit.failed` (EVT-TEC-14) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072: único canónico del alias) |
| `tec.feasibility.completed` / `.resolved` | M02, M09 | `tec.feasibility.verdictIssued` (EVT-TEC-02) | Alias |
| `tec.workOrder.scheduled` / `.rescheduled` / `.assigned` | M09, M13, M18 | `tec.workOrder.statusChanged` (EVT-TEC-05) | Alias |
| `tec.workOrder.onTheWay` | M09, M13, M18 | `tec.visit.statusChanged` (EVT-TEC-13) | Alias |
| `tec.workOrder.failedVisit` | M09, M13, M18 | `tec.visit.failed` (EVT-TEC-14) | Alias |
| `tec.workOrder.conformityRecorded` | M09, M13, M18 | `tec.conformity.signed` (EVT-TEC-15) | Alias |
| `tec.visit.scheduled` / `.technicianEnRoute` / `.completed` | M19 | `tec.visit.statusChanged` (EVT-TEC-13) | Alias |
| `tec.visit.noAccess` | M19 | `tec.visit.failed` (EVT-TEC-14) | Alias |
| `tec.network.outageDetected` (equipo caído) | M09 | `tec.networkDevice.down` (EVT-TEC-24) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072: único canónico del alias) |
| tec.network.outageDetected (corte comunicado), retirado como alias | M09 | `tec.outage.notified` (EVT-TEC-23) | Retirado como alias el 5-11-2026 (PA-WFL-23, Asumida DEC-072): un alias resuelve a un solo canónico y tec.network.outageDetected queda en `tec.networkDevice.down`; para este caso el consumidor se suscribe directamente al canónico de esta fila. Antes "Alias" |
| `tec.network.outageRestored` | M09 | `tec.outage.finished` (EVT-TEC-23) | Alias |
| `tec.location.proposed` | M01 | `tec.geo.pointUpdated` (EVT-TEC-30) | Alias |
| `tec.workOrder.materialsRequested` | M12 | `tec.material.requested` (EVT-TEC-11) | Alias |
| `tec.crewTimesheet.approved` | M16 | `tec.crewTimesheet.approved` (EVT-TEC-32) | Brecha resuelta: M10 lo declara |
| `crm.case.workOrderRequested` / `.feasibilityRequested` | M02, M08, M10, M11 | `crm.commandRequest.requested` (EVT-CRM-13) | M09 integra por comandos; consumidores por evento deben migrar (PA-WFL-01) |
| `crm.request.cancelled` | M02, M08, M10, M11 | `crm.case.cancelled` (EVT-CRM-11) | M09 integra por comandos; consumidores por evento deben migrar (PA-WFL-01) |
| `crm.request.admitted` / `.created` / `.approved`, `crm.billingClaim.opened` / `.resolved` | M02, M08, M10, M11 | `crm.case.statusChanged` (EVT-CRM-05) | M09 integra por comandos; consumidores por evento deben migrar (PA-WFL-01) |
| `crm.case.messageAdded` | M19 | `crm.message.sent` (EVT-CRM-17) | Alias |
| `crm.case.observed` | M19 | `crm.case.statusChanged` (EVT-CRM-05) | Alias |
| `mor.suspension.ordered`, `mor.disconnection.ordered`, `mor.reconnection.ordered`, `mor.prepaidConversion.ordered` | M02, M03, M09, M10, M16 | `mor.interruption.approved` (EVT-MOR-12) | Alias (el tipo de interrupción va en el payload) |
| `mor.suspension.revoked` | M02, M03, M09, M10, M16 | `mor.interruption.cancelled` (EVT-MOR-13) | Alias (el tipo de interrupción va en el payload) |
| `mor.suspension.executed`, `mor.reconnection.executed`, `mor.cutOrder.executed` | M02, M03, M09, M10, M16 | `mor.interruption.executed` (EVT-MOR-13) | Alias (el tipo de interrupción va en el payload) |
| `mor.charge.created` | M07, M05 | `mor.interest.settled` (EVT-MOR-02) | Alias |
| `mor.interestCharge.requested` | M07, M05 | `mor.deferredInterest.created` (EVT-MOR-03) | Alias |
| `mor.agreement.voided` / `.cancelled` | M07, M17 | `mor.agreement.annulled` (EVT-MOR-14) | Alias |
| `mor.debt.writtenOff` | M07 | `mor.writeOff.approved` (EVT-MOR-18) | Alias |
| `mor.debt.prescribed` | M07 | `mor.prescription.executed` (EVT-MOR-19) | Alias |
| `mor.account.delinquent` | M19 | `mor.evaluation.closed` (EVT-MOR-06) | Alias |
| `mor.account.suspended` / `.reconnected` | M19 | `mor.interruption.executed` (EVT-MOR-13) | Alias |
| `mor.reconnection.requested` | M11 | `mor.interruption.requested` (EVT-MOR-12) | Alias |
| `col.legalStatus.changed` (inicio) | M01 | `mor.collectionCase.opened` (EVT-MOR-17) | Prefijo inexistente (5-11-2026, PA-WFL-23, Asumida DEC-072: único canónico del alias) |
| col.legalStatus.changed (fin), retirado como alias | M01 | `mor.collectionCase.closed` (EVT-MOR-17) | Retirado como alias el 5-11-2026 (PA-WFL-23, Asumida DEC-072): un alias resuelve a un solo canónico y col.legalStatus.changed queda en `mor.collectionCase.opened`; para este caso el consumidor se suscribe directamente al canónico de esta fila. Antes "Prefijo inexistente" |
| `cob.payment.voided` | M08, M14, M17, M18 | `cob.receipt.voided` (EVT-COB-05) | Alias |
| `cob.payment.reversed` | M08, M14, M17, M18 | `cob.allocation.reversed` (EVT-COB-06) | Alias |
| `cob.chargeback.registered` | M08 | `cob.chargeback.applied` (EVT-COB-18) | Alias |
| `cob.payment.allocated`, `cob.allocation.applied`, `pag.payment.applied` | M06, M10, M11, M19 | `cob.payment.confirmed` (EVT-COB-04) | Alias; `pag` es prefijo inexistente |
| `cob.payment.rejected` / `.uncertain` | M06, M10, M11, M19 | `cob.paymentIntent.statusChanged` (EVT-COB-20) | Alias |
| `cob.payment.informed` | M08 | `cob.payment.informed` (EVT-COB-24) | Brecha resuelta: M07 lo declara |
| `cob.directDebit.adhered` / `.cancelled` | M19 | `cob.directDebitMandate.changed` (EVT-COB-17) | Alias |
| `cob.cashSession.reopened` | M14 | `cob.cashSession.reopened` (EVT-COB-25) | Brecha resuelta: M07 lo declara |
| `cob.unidentified.resolved` | M14 | `cob.unidentified.resolved` (EVT-COB-26) | Brecha resuelta: M07 lo declara |
| `cob.refund.approved` | M14 | `cob.refund.approved` (EVT-COB-27) | Brecha resuelta: M07 lo declara (deriva de `wfl.operation.approved` con `typeCode = cob.refund.execute`) |
| `cob.gatewaySettlement.expected` | M14 | `cob.settlement.expected` (EVT-COB-11) | Alias |
| `cli.accountNote.changed` | M05, M07 | `per.block.applied` (EVT-PER-20) | Prefijo inexistente |
| `cli.holder.changed` | M05, M07 | `per.ownership.changed` (EVT-PER-23) | Prefijo inexistente |
| `cli.holder.taxDataChanged` (datos) | M05, M07 | `per.person.updated` (EVT-PER-02) | Prefijo inexistente (5-11-2026, PA-WFL-23, Asumida DEC-072: único canónico del alias) |
| cli.holder.taxDataChanged (CUIT verificado), retirado como alias | M05, M07 | `per.taxId.verified` (EVT-PER-08) | Retirado como alias el 5-11-2026 (PA-WFL-23, Asumida DEC-072): un alias resuelve a un solo canónico y cli.holder.taxDataChanged queda en `per.person.updated`; para este caso el consumidor se suscribe directamente al canónico de esta fila. Antes "Prefijo inexistente" |
| `per.account.ownerChanged` / `.ownerTransferred` | M09, M19 | `per.ownership.changed` (EVT-PER-23) | Alias |
| `per.relation.validated` | M19 | `per.relationship.granted` (EVT-PER-18) | Alias |
| `per.relation.ended` (revocada) | M19 | `per.relationship.revoked` (EVT-PER-18) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072: único canónico del alias) |
| per.relation.ended (vencida), retirado como alias | M19 | `per.relationship.expired` (EVT-PER-18) | Retirado como alias el 5-11-2026 (PA-WFL-23, Asumida DEC-072): un alias resuelve a un solo canónico y per.relation.ended queda en `per.relationship.revoked`; para este caso el consumidor se suscribe directamente al canónico de esta fila. Antes "Alias" |
| `per.address.updated` | M09 | `per.address.changed` (EVT-PER-15) | Alias |
| `per.holder.deactivated` | M02 | `per.holder.closed` (EVT-PER-10) | Alias |
| `per.person.fiscalDataChanged` (datos) | M06 | `per.person.updated` (EVT-PER-02) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072: único canónico del alias) |
| per.person.fiscalDataChanged (CUIT verificado), retirado como alias | M06 | `per.taxId.verified` (EVT-PER-08) | Retirado como alias el 5-11-2026 (PA-WFL-23, Asumida DEC-072): un alias resuelve a un solo canónico y per.person.fiscalDataChanged queda en `per.person.updated`; para este caso el consumidor se suscribe directamente al canónico de esta fila. Antes "Alias" |
| per.person.fiscalDataChanged (CUIT con diferencia), retirado como alias | M06 | `per.taxId.mismatch` (EVT-PER-08) | Retirado como alias el 5-11-2026 (PA-WFL-23, Asumida DEC-072): un alias resuelve a un solo canónico y per.person.fiscalDataChanged queda en `per.person.updated`; para este caso el consumidor se suscribe directamente al canónico de esta fila. Antes "Alias" |
| `ven.salesDocument.issued` | M05, M17, M18 | `ven.salesOrder.confirmed` (EVT-VEN-07) | Alias |
| `ven.salesDocument.voided` | M05, M17, M18 | `ven.salesOrder.cancelled` (EVT-VEN-10) | Alias |
| `ven.installments.created` | M05, M17, M18 | `ven.installmentPlan.created` (EVT-VEN-11) | Alias |
| `ven.installments.cancelled` | M05, M17, M18 | `ven.installment.updated` (EVT-VEN-12) | Alias |
| `stk.movement.confirmed` (ingreso) | M11, M12, M18 | `stk.goods.received` (EVT-STK-01) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072: único canónico del alias) |
| stk.movement.confirmed / .posted (consumo), retirado como alias | M11, M12, M18 | `stk.materials.consumed` (EVT-STK-02) | Retirado como alias el 5-11-2026 (PA-WFL-23, Asumida DEC-072): un alias resuelve a un solo canónico y stk.movement.confirmed queda en `stk.goods.received`; para este caso el consumidor se suscribe directamente al canónico de esta fila. Antes "Alias" |
| `stk.movement.rejected` | M11, M12, M18 | `stk.goods.rejected` (EVT-STK-24) | Alias; brecha cerrada con EVT-STK-24 (M13) |
| `stk.reorderPoint.reached` | M12 | `stk.item.belowMinimum` (EVT-STK-12) | Alias |
| `stk.reservation.failed`, `inv.reservation.failed` | M10, M11 | `stk.reservation.failed` (EVT-STK-23) | Brecha resuelta: M13 lo declara; `inv.reservation.failed` es alias |
| `stk.serialItem.statusChanged` (instalado) | M02, M03, M10 | `stk.equipment.applied` (EVT-STK-04) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072: único canónico del alias) |
| stk.serialItem.statusChanged (retirado), stk.unit.returned, retirado como alias | M02, M03, M10 | `stk.equipment.retrieved` (EVT-STK-05) | Retirado como alias el 5-11-2026 (PA-WFL-23, Asumida DEC-072): un alias resuelve a un solo canónico y stk.serialItem.statusChanged queda en `stk.equipment.applied`; para este caso el consumidor se suscribe directamente al canónico de esta fila. Antes "Alias" |
| stk.serialItem.statusChanged (reemplazado), stk.unit.replaced, retirado como alias | M02, M03, M10 | `stk.equipment.swapped` (EVT-STK-06) | Retirado como alias el 5-11-2026 (PA-WFL-23, Asumida DEC-072): un alias resuelve a un solo canónico y stk.serialItem.statusChanged queda en `stk.equipment.applied`; para este caso el consumidor se suscribe directamente al canónico de esta fila. Antes "Alias" |
| `inv.custody.changed` | M02, M03, M10 | `stk.custody.transferred` (EVT-STK-03) | Alias; `inv` es prefijo inexistente |
| `cmp.purchaseInvoice.posted` | M13, M18 | `cmp.supplierInvoice.registered` (EVT-CMP-08) | Alias |
| `cmp.purchaseInvoice.voided` | M13, M18 | `cmp.supplierInvoice.voided` (EVT-CMP-09) | Alias |
| `cmp.invoice.priceVarianceDetected` | M13, M18 | `cmp.matchException.raised` (EVT-CMP-10) | Alias |
| `cmp.paymentOrder.prepared` | M06 | `cmp.paymentOrder.prepared` (EVT-CMP-15) | Brecha resuelta: M12 lo declara |
| `tes.paymentOrder.paid` | M06, M17, M18 | `tes.paymentExecution.executed` (EVT-TES-15) | Alias |
| `tes.paymentOrder.voided` | M06, M17, M18 | `tes.paymentExecution.voided` (EVT-TES-15) | Alias |
| `tes.movement.confirmed` | M06, M17, M18 | `tes.operation.posted` (EVT-TES-01) | Alias |
| `tes.bankMovement.matched` | M07 | `tes.gatewayCredit.reconciled` (EVT-TES-07) | Alias |
| `tes.bankMovement.unmatched` | M07 | `tes.statementLine.unidentified` (EVT-TES-06) | Alias |
| `tes.treasuryHandover.received` | M07 | `tes.cashRemittance.accepted` (EVT-TES-08) | Alias |
| `tes.paymentRequest.accepted` / `.settled` | M16 | `tes.payrollPayment.confirmed` (EVT-TES-17) | Alias |
| `tes.paymentRequest.rejected` / `.cancelled` | M16 | `tes.payrollPayment.rejected` (EVT-TES-17) | Alias |
| `tes.advance.paid` | M16 | `tes.advance.paid` (EVT-TES-23) | Brecha cerrada con EVT-TES-23 (M14) |
| `con.journalEntry.posted` / `.created` | M06, M14, M16, M17 | `con.entry.posted` (EVT-CON-01) | Alias |
| `con.entry.failed` | M06, M14, M16, M17 | `con.event.failed` (EVT-CON-05) | Alias |
| `sue.payroll.closed` | M06, M14, M19 | `sue.payrollRun.closed` (EVT-SUE-13) | Alias |
| `sue.payslip.published` | M06, M14, M19 | `sue.payslip.issued` (EVT-SUE-14) | Alias |
| `sue.payrollPayment.requested` | M06, M14, M19 | `sue.paymentRequest.created` (EVT-SUE-17) | Alias |
| `sue.payrollPayment.cancelled` | M06, M14, M19 | `sue.paymentRequest.cancelled` (EVT-SUE-27) | Alias; brecha cerrada con EVT-SUE-27 (M16) |
| `soc.vehicleUsage.closed` | M16 | `soc.vehicle.usageRecorded` (EVT-SOC-12) | Alias |
| `soc.vehicleUsage.voided` | M16 | `soc.vehicle.usageVoided` (EVT-SOC-17) | Alias; brecha cerrada con EVT-SOC-17 (M18) |
| `soc.dependent.cameOfAge` | T09 (catálogo de notificaciones) | `soc.dependent.majorityReached` (EVT-SOC-02) | Alias (T12 HUECO-TRV-02) |
| `ins.membership.changed` (alta) | M01 | `ins.membership.approved` (EVT-INS-02) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072: único canónico del alias) |
| ins.membership.changed (suspensión), retirado como alias | M01 | `ins.membership.suspended` (EVT-INS-04) | Retirado como alias el 5-11-2026 (PA-WFL-23, Asumida DEC-072): un alias resuelve a un solo canónico y ins.membership.changed queda en `ins.membership.approved`; para este caso el consumidor se suscribe directamente al canónico de esta fila. Antes "Alias" |
| ins.membership.changed (rehabilitación), retirado como alias | M01 | `ins.membership.reinstated` (EVT-INS-04) | Retirado como alias el 5-11-2026 (PA-WFL-23, Asumida DEC-072): un alias resuelve a un solo canónico y ins.membership.changed queda en `ins.membership.approved`; para este caso el consumidor se suscribe directamente al canónico de esta fila. Antes "Alias" |
| ins.membership.changed (egreso), retirado como alias | M01 | `ins.membership.exited` (EVT-INS-06) | Retirado como alias el 5-11-2026 (PA-WFL-23, Asumida DEC-072): un alias resuelve a un solo canónico y ins.membership.changed queda en `ins.membership.approved`; para este caso el consumidor se suscribe directamente al canónico de esta fila. Antes "Alias" |
| `cfg.parameter.published` | M04, M13, M16, T02 | `cfg.parameter.changed` (EVT-CFG-07) | Alias |
| `cfg.config.published` | M04, M13, M16, T02 | `cfg.configVersion.published` (EVT-CFG-05) | Alias |
| `cfg.officialTable.published` | M04, M13, M16, T02 | `cfg.platformTable.updated` (EVT-CFG-10) | Alias |
| `cfg.index.published`, `cfg.inflationIndex.published` | M04, M13, M16, T02 | `cfg.economicIndex.valuePublished` (EVT-CFG-12) | Alias |
| `cfg.fxRate.published` | M04 | `tes.exchangeRate.published` (EVT-TES-19) | Productor es M14 |
| `iam.user.registered` | M01, M10, M16, M19 | `iam.identity.created` (EVT-IAM-01) | Alias |
| `iam.user.deleted` / `.deactivated`, `iam.membership.changed` | M01, M10, M16, M19 | `iam.membership.*` (EVT-IAM-03) | Alias |
| `iam.user.linked` | M01, M10, M16, M19 | `iam.portal.accountLinked` (EVT-IAM-15) | Alias |
| `pla.license.changed` / `.expired` | M01, M02, M06, T02, T04 | `pla.license.updated` (EVT-PLA-08) | Alias |
| `pla.module.activationChanged` (activación), `pla.tenant.moduleActivated` | M01, M02, M06, T02, T04 | `pla.capability.activated` (EVT-PLA-06) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072: único canónico del alias) |
| pla.module.activationChanged (desactivación), pla.tenant.moduleDeactivated, pla.capability.revoked, retirado como alias | M01, M02, M06, T02, T04 | `pla.capability.deactivated` (EVT-PLA-07) | Retirado como alias el 5-11-2026 (PA-WFL-23, Asumida DEC-072): un alias resuelve a un solo canónico y pla.module.activationChanged queda en `pla.capability.activated`; para este caso el consumidor se suscribe directamente al canónico de esta fila. Antes "Alias" |
| `pla.tenant.restored` | M01, M02, M06, T02, T04 | `pla.restore.completed` (EVT-PLA-14) | Alias |
| `ten.tenant.provisioned` | M01, M02, M06, T02, T04 | `pla.tenant.created` (EVT-PLA-01) | Alias; `ten` es prefijo inexistente |
| `int.provisioning.succeeded` / `.failed` | M07, M08, M09, T04 | `int.network.provisioningResult` (EVT-INT-15; antes `int.network.provisioning-result`) | Alias |
| `int.connector.health` (circuito) | M07, M08, M09, T04 | `int.circuit.*` (EVT-INT-04) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072: único canónico del alias) |
| int.connector.health (conexión), retirado como alias | M07, M08, M09, T04 | `int.connection.*` (EVT-INT-01) | Retirado como alias el 5-11-2026 (PA-WFL-23, Asumida DEC-072): un alias resuelve a un solo canónico y int.connector.health queda en `int.circuit.*`; para este caso el consumidor se suscribe directamente al canónico de esta fila. Antes "Alias" |
| `int.sftp.fileReceived` | M07, M08, M09, T04 | `int.file.received` (EVT-INT-19) | Alias |
| `int.secret.updated` | M07, M08, M09, T04 | `int.credential.rotated` (EVT-INT-05) | Alias |
| `int.secret.expiring` | M07, M08, M09, T04 | `int.credential.expiring` (EVT-INT-05) | Alias |
| `int.localAgent.statusChanged` (en línea) | M07, M08, M09, T04 | `int.agent.online` (EVT-INT-22) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072: único canónico del alias) |
| int.localAgent.statusChanged (fuera de línea), retirado como alias | M07, M08, M09, T04 | `int.agent.offline` (EVT-INT-22) | Retirado como alias el 5-11-2026 (PA-WFL-23, Asumida DEC-072): un alias resuelve a un solo canónico y int.localAgent.statusChanged queda en `int.agent.online`; para este caso el consumidor se suscribe directamente al canónico de esta fila. Antes "Alias" |
| `mig.legacyDump.ready` | T04 | `mig.snapshot.ready` (EVT-MIG-01) | Alias |
| `pla.branch.created` | T03, T04 | `cfg.branch.created` (EVT-CFG-20) | Alias: EVT-PLA-21 reemplazado por EVT-CFG-20 (DEC-064, CTR-CFG-22); T03 debe suscribirse al canónico |
| `pla.branch.updated` | T03, T04 | `cfg.branch.updated` (EVT-CFG-20) | Alias: EVT-PLA-21 reemplazado por EVT-CFG-20 (DEC-064, CTR-CFG-22); T03 debe suscribirse al canónico |
| `com.message.*` (accepted, delivered, read, failed, bounced, statusChanged) | M05, M08, M09, T02 | `com.communication.*` (EVT-COM-27) | Alias. Fila movida el 5-11-2026 desde la tabla de alias de campos, donde estaba por error; `com.communication.delivered` / `.failed` / `.read` ya son canónicos de EVT-COM-27 |
| `com.message.failed` / `.bounced` (sin canal restante) | M05, M08, M09, T02 | `com.communication.allChannelsFailed` (EVT-COM-29) | Alias |
| `ins.capital.movement.recorded` | M15, M17 (productor), M19, T12 | `ins.capitalMovement.recorded` (EVT-INS-08) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072): renombrado por la convención `<mod>.<agregado>.<hecho>` (INC-06-11; guiones a camelCase, cuatro segmentos a tres). El productor y los consumidores deben adoptar el nombre nuevo |
| `ins.capital.movement.reversed` | M15, M17 (productor), T12 | `ins.capitalMovement.reversed` (EVT-INS-09) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072): renombrado por la convención `<mod>.<agregado>.<hecho>` (INC-06-11; guiones a camelCase, cuatro segmentos a tres). El productor y los consumidores deben adoptar el nombre nuevo |
| `ins.capital.transfer.executed` | M15, M17 (productor), T12 | `ins.capitalTransfer.executed` (EVT-INS-10) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072): renombrado por la convención `<mod>.<agregado>.<hecho>` (INC-06-11; guiones a camelCase, cuatro segmentos a tres). El productor y los consumidores deben adoptar el nombre nuevo |
| `ins.capital.refund.approved` | M15, M17 (productor), T12 | `ins.capitalRefund.approved` (EVT-INS-11) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072): renombrado por la convención `<mod>.<agregado>.<hecho>` (INC-06-11; guiones a camelCase, cuatro segmentos a tres). El productor y los consumidores deben adoptar el nombre nuevo |
| `ins.capital.refund.paid` | M15, M17 (productor), T09, T12 | `ins.capitalRefund.paid` (EVT-INS-12) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072): renombrado por la convención `<mod>.<agregado>.<hecho>` (INC-06-11; guiones a camelCase, cuatro segmentos a tres). El productor y los consumidores deben adoptar el nombre nuevo |
| `ins.surplus.distribution.approved` | M15, M17 (productor) | `ins.surplusDistribution.approved` (EVT-INS-13) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072): renombrado por la convención `<mod>.<agregado>.<hecho>` (INC-06-11; guiones a camelCase, cuatro segmentos a tres). El productor y los consumidores deben adoptar el nombre nuevo |
| `ins.surplus.distribution.executed` | M15, M17 (productor) | `ins.surplusDistribution.executed` (EVT-INS-13) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072): renombrado por la convención `<mod>.<agregado>.<hecho>` (INC-06-11; guiones a camelCase, cuatro segmentos a tres). El productor y los consumidores deben adoptar el nombre nuevo |
| `ins.inaes.report.submitted` | M17 (productor) | `ins.inaesReport.submitted` (EVT-INS-21) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072): renombrado por la convención `<mod>.<agregado>.<hecho>` (INC-06-11; guiones a camelCase, cuatro segmentos a tres). El productor y los consumidores deben adoptar el nombre nuevo |
| `int.connection.mode-changed` | T06 (productor) | `int.connection.modeChanged` (EVT-INT-01) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072): renombrado por la convención `<mod>.<agregado>.<hecho>` (INC-06-11; guiones a camelCase, cuatro segmentos a tres). El productor y los consumidores deben adoptar el nombre nuevo |
| `int.operation.manually-resolved` | T06 (productor) | `int.operation.manuallyResolved` (EVT-INT-03) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072): renombrado por la convención `<mod>.<agregado>.<hecho>` (INC-06-11; guiones a camelCase, cuatro segmentos a tres). El productor y los consumidores deben adoptar el nombre nuevo |
| `int.arca.cae-obtained` | T06 (productor) | `int.arca.caeObtained` (EVT-INT-06) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072): renombrado por la convención `<mod>.<agregado>.<hecho>` (INC-06-11; guiones a camelCase, cuatro segmentos a tres). El productor y los consumidores deben adoptar el nombre nuevo |
| `int.arca.cae-rejected` | T06 (productor) | `int.arca.caeRejected` (EVT-INT-06) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072): renombrado por la convención `<mod>.<agregado>.<hecho>` (INC-06-11; guiones a camelCase, cuatro segmentos a tres). El productor y los consumidores deben adoptar el nombre nuevo |
| `int.arca.caea-obtained` | T06 (productor) | `int.arca.caeaObtained` (EVT-INT-06) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072): renombrado por la convención `<mod>.<agregado>.<hecho>` (INC-06-11; guiones a camelCase, cuatro segmentos a tres). El productor y los consumidores deben adoptar el nombre nuevo |
| `int.arca.caea-informed` | T06 (productor) | `int.arca.caeaInformed` (EVT-INT-06) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072): renombrado por la convención `<mod>.<agregado>.<hecho>` (INC-06-11; guiones a camelCase, cuatro segmentos a tres). El productor y los consumidores deben adoptar el nombre nuevo |
| `int.arca.params-synced` | M06, T06 (productor) | `int.arca.paramsSynced` (EVT-INT-06) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072): renombrado por la convención `<mod>.<agregado>.<hecho>` (INC-06-11; guiones a camelCase, cuatro segmentos a tres). El productor y los consumidores deben adoptar el nombre nuevo |
| `int.padron.persona-retrieved` | T06 (productor) | `int.padron.personaRetrieved` (EVT-INT-07) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072): renombrado por la convención `<mod>.<agregado>.<hecho>` (INC-06-11; guiones a camelCase, cuatro segmentos a tres). El productor y los consumidores deben adoptar el nombre nuevo |
| `int.payment-intent.created` | T06 (productor) | `int.paymentIntent.created` (EVT-INT-08) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072): renombrado por la convención `<mod>.<agregado>.<hecho>` (INC-06-11; guiones a camelCase, cuatro segmentos a tres). El productor y los consumidores deben adoptar el nombre nuevo |
| `int.debt-publication.acknowledged` | T06 (productor) | `int.debtPublication.acknowledged` (EVT-INT-09) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072): renombrado por la convención `<mod>.<agregado>.<hecho>` (INC-06-11; guiones a camelCase, cuatro segmentos a tres). El productor y los consumidores deben adoptar el nombre nuevo |
| `int.debt-publication.rejected` | T06 (productor) | `int.debtPublication.rejected` (EVT-INT-09) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072): renombrado por la convención `<mod>.<agregado>.<hecho>` (INC-06-11; guiones a camelCase, cuatro segmentos a tres). El productor y los consumidores deben adoptar el nombre nuevo |
| `int.remittance.line-received` | T06 (productor) | `int.remittance.lineReceived` (EVT-INT-10) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072): renombrado por la convención `<mod>.<agregado>.<hecho>` (INC-06-11; guiones a camelCase, cuatro segmentos a tres). El productor y los consumidores deben adoptar el nombre nuevo |
| `int.remittance.file-applied` | T06 (productor) | `int.remittance.fileApplied` (EVT-INT-10) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072): renombrado por la convención `<mod>.<agregado>.<hecho>` (INC-06-11; guiones a camelCase, cuatro segmentos a tres). El productor y los consumidores deben adoptar el nombre nuevo |
| `int.direct-debit.adhesion-updated` | T06 (productor) | `int.directDebit.adhesionUpdated` (EVT-INT-11) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072): renombrado por la convención `<mod>.<agregado>.<hecho>` (INC-06-11; guiones a camelCase, cuatro segmentos a tres). El productor y los consumidores deben adoptar el nombre nuevo |
| `int.direct-debit.result-received` | T06 (productor) | `int.directDebit.resultReceived` (EVT-INT-11) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072): renombrado por la convención `<mod>.<agregado>.<hecho>` (INC-06-11; guiones a camelCase, cuatro segmentos a tres). El productor y los consumidores deben adoptar el nombre nuevo |
| `int.bank.movements-received` | T06 (productor) | `int.bank.movementsReceived` (EVT-INT-12) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072): renombrado por la convención `<mod>.<agregado>.<hecho>` (INC-06-11; guiones a camelCase, cuatro segmentos a tres). El productor y los consumidores deben adoptar el nombre nuevo |
| `int.bank.balances-received` | T06 (productor) | `int.bank.balancesReceived` (EVT-INT-12) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072): renombrado por la convención `<mod>.<agregado>.<hecho>` (INC-06-11; guiones a camelCase, cuatro segmentos a tres). El productor y los consumidores deben adoptar el nombre nuevo |
| `int.message.inbound-received` | T06 (productor), T09 | `int.message.inboundReceived` (EVT-INT-13) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072): renombrado por la convención `<mod>.<agregado>.<hecho>` (INC-06-11; guiones a camelCase, cuatro segmentos a tres). El productor y los consumidores deben adoptar el nombre nuevo |
| `int.meter.reading-received` | T06 (productor) | `int.meter.readingReceived` (EVT-INT-14) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072): renombrado por la convención `<mod>.<agregado>.<hecho>` (INC-06-11; guiones a camelCase, cuatro segmentos a tres). El productor y los consumidores deben adoptar el nombre nuevo |
| `int.meter.command-result` | T06 (productor) | `int.meter.commandResult` (EVT-INT-14) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072): renombrado por la convención `<mod>.<agregado>.<hecho>` (INC-06-11; guiones a camelCase, cuatro segmentos a tres). El productor y los consumidores deben adoptar el nombre nuevo |
| `int.prepaid.credit-issued` | T06 (productor) | `int.prepaid.creditIssued` (EVT-INT-14) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072): renombrado por la convención `<mod>.<agregado>.<hecho>` (INC-06-11; guiones a camelCase, cuatro segmentos a tres). El productor y los consumidores deben adoptar el nombre nuevo |
| `int.network.provisioning-result` | M08, T06 (productor), T12 | `int.network.provisioningResult` (EVT-INT-15) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072): renombrado por la convención `<mod>.<agregado>.<hecho>` (INC-06-11; guiones a camelCase, cuatro segmentos a tres). El productor y los consumidores deben adoptar el nombre nuevo |
| `int.cdr.batch-received` | M10, T06 (productor), T12 | `int.cdr.batchReceived` (EVT-INT-16) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072): renombrado por la convención `<mod>.<agregado>.<hecho>` (INC-06-11; guiones a camelCase, cuatro segmentos a tres). El productor y los consumidores deben adoptar el nombre nuevo |
| `int.fleet.positions-received` | M18, T06 (productor) | `int.fleet.positionsReceived` (EVT-INT-17) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072): renombrado por la convención `<mod>.<agregado>.<hecho>` (INC-06-11; guiones a camelCase, cuatro segmentos a tres). El productor y los consumidores deben adoptar el nombre nuevo |
| `int.reconciliation.differences-found` | T06 (productor) | `int.reconciliation.differencesFound` (EVT-INT-20) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072): renombrado por la convención `<mod>.<agregado>.<hecho>` (INC-06-11; guiones a camelCase, cuatro segmentos a tres). El productor y los consumidores deben adoptar el nombre nuevo |
| `int.agent.command-result` | T06 (productor) | `int.agent.commandResult` (EVT-INT-22) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072): renombrado por la convención `<mod>.<agregado>.<hecho>` (INC-06-11; guiones a camelCase, cuatro segmentos a tres). El productor y los consumidores deben adoptar el nombre nuevo |
| `int.ai.completion-ready` | T06 (productor), T09 | `int.ai.completionReady` (EVT-INT-23) | Alias (5-11-2026, PA-WFL-23, Asumida DEC-072): renombrado por la convención `<mod>.<agregado>.<hecho>` (INC-06-11; guiones a camelCase, cuatro segmentos a tres). El productor y los consumidores deben adoptar el nombre nuevo |
| `stk.item.below-minimum` | M13 (productor), M12, T09 | `stk.item.belowMinimum` (EVT-STK-12) | Alias (5-11-2026, PA-WFL-24, Asumida DEC-072): renombrado por la convención `<mod>.<agregado>.<hecho>` (INC-06-11; guiones a camelCase) en M13 RF-STK-029 (PA-STK-11). El productor y los consumidores deben adoptar el nombre nuevo |
| `per.person.fiscal-lookup-requested` | M01 (productor), T06 | `per.person.fiscalLookupRequested` (EVT-PER-26) | Alias (5-11-2026, pendientes de la sincronización, PA-WFL-24, Asumida DEC-072): nombre con guion que T06 §12 consumía; M01 §12.1 declara el canónico en camelCase (convención `<mod>.<agregado>.<hecho>`, INC-06-11). El productor y T06 ya usan el nombre nuevo |
| `med.reading-route.published` | M03 (productor), T06 | `med.readingRoute.published` (EVT-MED-30) | Alias (5-11-2026, pendientes de la sincronización, PA-WFL-24, Asumida DEC-072): nombre con guion que T06 §12 consumía; M03 §12.1 declara el canónico en camelCase (convención `<mod>.<agregado>.<hecho>`, INC-06-11). El productor y T06 ya usan el nombre nuevo |
| `fis.regime-file.requested` | M06 (productor), T06 | `fis.regimeFile.requested` (EVT-FIS-25) | Alias (5-11-2026, pendientes de la sincronización, PA-WFL-24, Asumida DEC-072): nombre con guion que T06 §12 consumía; M06 §12.1 declara el canónico en camelCase (convención `<mod>.<agregado>.<hecho>`, INC-06-11). El productor y T06 ya usan el nombre nuevo |
| `cob.payment-intent.requested` | M07 (productor), T06 | `cob.paymentIntent.requested` (EVT-COB-28) | Alias (5-11-2026, pendientes de la sincronización, PA-WFL-24, Asumida DEC-072): nombre con guion que T06 §12 consumía; M07 §12.1 declara el canónico en camelCase (convención `<mod>.<agregado>.<hecho>`, INC-06-11). El productor y T06 ya usan el nombre nuevo |
| `cob.debt-publication.requested` | M07 (productor), T06 | `cob.debtPublication.requested` (EVT-COB-29) | Alias (5-11-2026, pendientes de la sincronización, PA-WFL-24, Asumida DEC-072): nombre con guion que T06 §12 consumía; M07 §12.1 declara el canónico en camelCase (convención `<mod>.<agregado>.<hecho>`, INC-06-11). El productor y T06 ya usan el nombre nuevo |
| `cob.direct-debit.batch-requested` | M07 (productor), T06 | `cob.directDebit.batchRequested` (EVT-COB-30) | Alias (5-11-2026, pendientes de la sincronización, PA-WFL-24, Asumida DEC-072): nombre con guion que T06 §12 consumía; M07 §12.1 declara el canónico en camelCase (convención `<mod>.<agregado>.<hecho>`, INC-06-11). El productor y T06 ya usan el nombre nuevo |
| `tes.bank-sync.requested` | M14 (productor), T06 | `tes.bankSync.requested` (EVT-TES-24) | Alias (5-11-2026, pendientes de la sincronización, PA-WFL-24, Asumida DEC-072): nombre con guion que T06 §12 consumía; M14 §12.1 declara el canónico en camelCase (convención `<mod>.<agregado>.<hecho>`, INC-06-11). El productor y T06 ya usan el nombre nuevo |
| `tes.payment-file.requested` | M14 (productor), T06 | `tes.paymentFile.requested` (EVT-TES-25) | Alias (5-11-2026, pendientes de la sincronización, PA-WFL-24, Asumida DEC-072): nombre con guion que T06 §12 consumía; M14 §12.1 declara el canónico en camelCase (convención `<mod>.<agregado>.<hecho>`, INC-06-11). El productor y T06 ya usan el nombre nuevo |
| `sue.payroll-files.requested` | M16 (productor), T06 | `sue.payrollFiles.requested` (EVT-SUE-28) | Alias (5-11-2026, pendientes de la sincronización, PA-WFL-24, Asumida DEC-072): nombre con guion que T06 §12 consumía; M16 §12.1 declara el canónico en camelCase (convención `<mod>.<agregado>.<hecho>`, INC-06-11). El productor y T06 ya usan el nombre nuevo |
| `com.message.dispatch-requested` | T09 (productor), T06 | `com.message.dispatchRequested` (EVT-COM-40) | Alias (5-11-2026, pendientes de la sincronización, PA-WFL-24, Asumida DEC-072): nombre con guion que T06 §12 consumía; T09 §12.1 declara el canónico en camelCase (convención `<mod>.<agregado>.<hecho>`, INC-06-11). El productor y T06 ya usan el nombre nuevo |

Alias de campos de payload (5/11/2026). Los consumidores que lean el nombre viejo fallan en el chequeo de esquema de CI (RN-WFL-003); el nombre viejo se acepta en lectura hasta el cierre de O2:

| Campo anterior | Campo canónico | Eventos o jobs | Origen |
|---|---|---|---|
| `tenantServiceId` | `serviceId` | EVT-CAT-01, EVT-CAT-02, EVT-CAT-03, EVT-CAT-28 | CTR-DAT-30; M02 §12 |
| `stockUnitId` | `inventoryItemId` + `serialUnitId` | EVT-CAT-22 | CTR-DAT-30; M02 §12, M13 |
| `propertyId` | `premiseId` | EVT-TEC-25, JOB-CAT-13, JOB-TAR-14 | M10 §12 |
| `holderPersonId` | `holderId` | EVT-TEC-25 | M10 §12 |
| `caseId` | `crmCaseId` | EVT-TEC-04, EVT-TEC-35 | M10 §12 |
| `serviceCode` | `serviceId` | EVT-TEC-35 | CTR-DAT-30; M10 §12 |
| `serviceContractId` | `contractId` | EVT-PER-23 | T05 §7.2; M01 §12 |
| `year`, `month` | `period` (`YYYY-MM`) + `sequence` | EVT-CON-07 | CTR-DAT-31; M15 §12 |
| `instanceId` | `workflowInstanceId` | EVT-WFL-014, EVT-WFL-015, EVT-WFL-016, EVT-WFL-017, EVT-WFL-019 | T05 §7.2; T11 §7.4 |

#### 12.4.1 Nombres consumidos sin productor declarado: estado de conciliación

Además de la tabla anterior, el cruce automático de los catálogos de todos los anexos encontró los siguientes tipos de evento que algún anexo consume o menciona y que ningún productor declara. El candidato es una **sugerencia generada por coincidencia de módulo y entidad y debe confirmarse**. Regla para la construcción por olas: en la ola en que se implementa el consumidor, el equipo confirma el canónico y lo registra como alias en `eventTypes.aliases`, o el anexo productor agrega el evento a su §12 si es una brecha real; si no hay equivalente, el consumidor retira la suscripción. El chequeo de CI (CTR-WFL-03) rechaza toda suscripción a un tipo no registrado, por lo que ningún consumidor puede quedar escuchando un evento inexistente.

Resultado de la conciliación: 66 filas conciliadas (22 son códigos de tipo de comunicación de T09 que dispara un evento canónico), 7 brechas resueltas con un evento nuevo del productor, 34 retiradas porque ningún anexo las usa ya y 23 descartadas porque no son eventos (códigos de error, claves PRM, plantillas o métricas).

| ID | Nombre usado por el consumidor | Anexos que lo consumen o mencionan | Candidato sugerido (a confirmar) | Estado (4/11/2026) |
|---|---|---|---|---|
| CNC-WFL-001 | `iam.user.disabled` | T01 | `iam.idp.disabled` | Conciliado: `iam.membership.suspended` (EVT-IAM-03). Un solo canónico desde el 5-11-2026 (PA-WFL-23, Asumida DEC-072); la revocación se consume directamente; antes "Conciliado: iam.membership.suspended / .revoked (EVT-IAM-03)" |
| CNC-WFL-002 | `cfg.package.published` | T01 | `cfg.configVersion.published` | Conciliado: `cfg.configVersion.published` (EVT-CFG-05) |
| CNC-WFL-003 | `tar.tariffVersion.published` | T01 | `tar.schedule.published` o `tar.rule.published` | Conciliado: `tar.schedule.published` (EVT-TAR-004) |
| CNC-WFL-004 | `int.credential.revoked` | T01 | `int.credential.expiring` o `int.credential.rotated` | Conciliado: `int.credential.rotated` (EVT-INT-05). Un solo canónico desde el 5-11-2026 (PA-WFL-23, Asumida DEC-072); antes "Conciliado: int.credential.expiring / .rotated (EVT-INT-05)" |
| CNC-WFL-005 | `int.connector.healthChanged` | T01 | — | Conciliado: `int.circuit.opened` (EVT-INT-04). Un solo canónico desde el 5-11-2026 (PA-WFL-23, Asumida DEC-072); el cierre del circuito se consume directamente; antes "Conciliado: int.circuit.opened / .closed (EVT-INT-04)" |
| CNC-WFL-006 | `int.webhook.verified` | T01 | — | Conciliado: `int.connection.activated` (EVT-INT-01) |
| CNC-WFL-007 | `fac.invoice.reissued` | T03 | `fac.invoice.issued` o `fac.invoice.dueDatesChanged` | Descartado: no es evento (ejemplo de RF-UXD-103) |
| CNC-WFL-008 | `pla.tenant.licenseChanged` | T03 | `pla.tenant.statusChanged` o `pla.tenant.reactivated` | Conciliado: `pla.license.updated` (EVT-PLA-08) |
| CNC-WFL-009 | `pla.tenant.capabilityToggled` | T03 | `pla.tenant.statusChanged` o `pla.tenant.reactivated` | Conciliado: `pla.capability.activated` (EVT-PLA-06). Un solo canónico desde el 5-11-2026 (PA-WFL-23, Asumida DEC-072); la desactivación (EVT-PLA-07) se consume directamente; antes "Conciliado: pla.capability.activated (EVT-PLA-06), pla.capability.deactivated (EVT-PLA-07)" |
| CNC-WFL-010 | `iam.role.updated` | T03 | `iam.role.changed` o `iam.role.unassigned` | Conciliado: `iam.role.changed` (EVT-IAM-05) |
| CNC-WFL-011 | `iam.user.rolesChanged` | T03 | — | Conciliado: `iam.role.assigned` (EVT-IAM-04) |
| CNC-WFL-012 | `iam.screenProfile.updated` | T03 | — | Conciliado: `iam.profile.changed` (EVT-IAM-05) |
| CNC-WFL-013 | `cfg.branch.created` | T03 | `cfg.configVersion.created` | Brecha resuelta: `pla.branch.created` (EVT-PLA-21), hoy `cfg.branch.created` / `.updated` (EVT-CFG-20; EVT-PLA-21 reemplazado) |
| CNC-WFL-014 | `cfg.branch.updated` | T03 | `cfg.platformTable.updated` o `cfg.geoReference.updated` | Brecha resuelta: `pla.branch.created` (EVT-PLA-21), hoy `cfg.branch.created` / `.updated` (EVT-CFG-20; EVT-PLA-21 reemplazado) |
| CNC-WFL-015 | `cfg.organization.updated` | T03 | `cfg.platformTable.updated` o `cfg.geoReference.updated` | Brecha resuelta: `pla.tenantProfile.updated` (EVT-PLA-22) |
| CNC-WFL-016 | `fac.batch.approved` | T06 | `fac.billingRun.approved` | Conciliado: `fac.billingRun.approved` (EVT-FAC-03) |
| CNC-WFL-017 | `tec.provisioning.requested` | T06 | `tec.survey.requested` o `tec.material.requested` | Brecha resuelta: `tec.provisioning.requested` (EVT-TEC-33) |
| CNC-WFL-018 | `cob.payment.received` | T07 | `cob.retention.received` | Conciliado: `cob.payment.confirmed` (EVT-COB-04) |
| CNC-WFL-019 | `fac.batch.simulated` | T07 | — | Conciliado: `fac.billingRun.prebilled` (EVT-FAC-02) |
| CNC-WFL-020 | `iam.auth.loginFailed` | T08 | — | Conciliado: `iam.login.failed` (EVT-IAM-07) |
| CNC-WFL-021 | `iam.authz.crossTenantDenied` | T08 | — | Conciliado: `iam.securityAlert.raised` (EVT-IAM-14) |
| CNC-WFL-022 | `iam.support.accessGranted` | T08 | — | Conciliado: `iam.supportAccess.requested` (EVT-IAM-11) |
| CNC-WFL-023 | `ins.assembly.convened` | T09 | `ins.meeting.convened` | Conciliado: `ins.meeting.convened` (EVT-INS-14) |
| CNC-WFL-024 | `crm.claim.closed` | T09 | `crm.case.closed` o `crm.activityOccurrence.closed` | Conciliado: `crm.case.closed` (EVT-CRM-09) |
| CNC-WFL-025 | `tec.outage.scheduled` | T09 | `tec.outage.notified` o `tec.outage.finished` | Conciliado: `tec.outage.notified` (EVT-TEC-23) |
| CNC-WFL-026 | `cob.prepaidSale.confirmed` | T09 | `cob.payment.confirmed` | Conciliado: tipo de comunicación de T09 disparado por `cob.payment.confirmed` (EVT-COB-04) |
| CNC-WFL-027 | `ven.sale.registered` | T09 | — | Conciliado: tipo de comunicación de T09 disparado por `ven.salesOrder.confirmed` (EVT-VEN-07) |
| CNC-WFL-028 | `com.survey.invited` | T09 | — | Conciliado: tipo de comunicación de T09 disparado por `com.survey.published` (EVT-COM-14) |
| CNC-WFL-029 | `iam.otp.requested` | T09 | `iam.authorization.requested` o `iam.supportAccess.requested` | Retirado: el consumidor ya no lo usa |
| CNC-WFL-030 | `iam.password.resetRequested` | T09 | `iam.password.changed` o `iam.password.resetCompleted` | Retirado: el consumidor ya no lo usa |
| CNC-WFL-031 | `iam.user.invited` | T09 | `iam.membership.invited` | Retirado: el consumidor ya no lo usa |
| CNC-WFL-032 | `per.contact.verificationRequested` | T09 | `per.contact.changed` | Retirado: el consumidor ya no lo usa |
| CNC-WFL-033 | `por.registration.completed` | T09 | `por.legacyImport.completed` | Retirado: el consumidor ya no lo usa |
| CNC-WFL-034 | `por.account.linked` | T09 | — | Retirado: el consumidor ya no lo usa |
| CNC-WFL-035 | `por.authorization.granted` | T09 | `por.accountAccess.granted` | Retirado: el consumidor ya no lo usa |
| CNC-WFL-036 | `crm.request.received` | T09 | `crm.message.received` o `crm.cancellationRequest.received` | Retirado: el consumidor ya no lo usa |
| CNC-WFL-037 | `crm.request.statusChanged` | T09 | `crm.case.statusChanged` | Retirado: el consumidor ya no lo usa |
| CNC-WFL-038 | `crm.claim.registered` | T09 | `crm.deskEntry.registered` | Retirado: el consumidor ya no lo usa |
| CNC-WFL-039 | `crm.claim.updated` | T09 | `crm.incident.updated` | Retirado: el consumidor ya no lo usa |
| CNC-WFL-040 | `crm.claim.resolved` | T09 | `crm.case.resolved` | Retirado: el consumidor ya no lo usa |
| CNC-WFL-041 | `crm.claim.reopened` | T09 | `crm.case.reopened` | Retirado: el consumidor ya no lo usa |
| CNC-WFL-042 | `crm.appointment.confirmed` | T09 | `crm.incident.confirmed` | Retirado: el consumidor ya no lo usa |
| CNC-WFL-043 | `crm.appointment.called` | T09 | `crm.queueTicket.called` | Retirado: el consumidor ya no lo usa |
| CNC-WFL-044 | `crm.webRequest.registered` | T09 | `crm.deskEntry.registered` | Retirado: el consumidor ya no lo usa |
| CNC-WFL-045 | `tec.visit.rescheduled` | T09 | `tec.visit.failed` o `tec.visit.statusChanged` | Retirado: el consumidor ya no lo usa |
| CNC-WFL-046 | `cat.service.activated` | T09 | `cat.contract.activated` | Retirado: el consumidor ya no lo usa |
| CNC-WFL-047 | `tec.workOrder.responsibleNotified` | T09 | `tec.workOrder.created` o `tec.workOrder.statusChanged` | Retirado: el consumidor ya no lo usa |
| CNC-WFL-048 | `tec.outage.started` | T09 | `tec.outage.notified` o `tec.outage.finished` | Retirado: el consumidor ya no lo usa |
| CNC-WFL-049 | `tec.outage.restored` | T09 | `tec.outage.notified` o `tec.outage.finished` | Conciliado: `tec.outage.finished` (EVT-TEC-23). Un solo canónico desde el 5-11-2026 (PA-WFL-23, Asumida DEC-072): el restablecimiento del corte es el fin del corte de M10; antes "Conciliado: tec.outage.notified (EVT-TEC-23), com.outage.restored (EVT-COM-25)" |
| CNC-WFL-050 | `med.meter.changed` | T09 | `med.meter.installed` o `med.meter.removed` | Conciliado: tipo de comunicación de T09 disparado por `tec.meter.changed` (EVT-TEC-22) |
| CNC-WFL-051 | `med.reading.estimated` | T09 | `med.reading.captured` o `med.reading.corrected` | Retirado: el consumidor ya no lo usa |
| CNC-WFL-052 | `med.prepaid.recharged` | T09 | — | Retirado: el consumidor ya no lo usa |
| CNC-WFL-053 | `cob.paymentLink.requested` | T09 | — | Retirado: el consumidor ya no lo usa |
| CNC-WFL-054 | `cob.refund.processed` | T09 | `cob.refund.executed` | Retirado: el consumidor ya no lo usa |
| CNC-WFL-055 | `mor.suspension.scheduled` | T09 | `mor.interruption.scheduled` | Retirado: el consumidor ya no lo usa |
| CNC-WFL-056 | `mor.service.suspended` | T09 | — | Retirado: el consumidor ya no lo usa |
| CNC-WFL-057 | `mor.service.reconnected` | T09 | — | Retirado: el consumidor ya no lo usa |
| CNC-WFL-058 | `mor.agreement.installmentDue` | T09 | `mor.agreement.completed` o `mor.agreement.activated` | Retirado: el consumidor ya no lo usa |
| CNC-WFL-059 | `per.service.terminated` | T09 | — | Retirado: el consumidor ya no lo usa |
| CNC-WFL-060 | `pla.supportTicket.created` | T09 | `pla.sandbox.created` o `pla.tenant.created` | Retirado: el consumidor ya no lo usa |
| CNC-WFL-061 | `pla.notice.published` | T09 | — | Retirado: el consumidor ya no lo usa |
| CNC-WFL-062 | `cmp.quote.requested` | T09 | — | Retirado: el consumidor ya no lo usa |
| CNC-WFL-063 | `ins.member.admitted` | T09 | `ins.member.withoutServices` | Retirado: el consumidor ya no lo usa |
| CNC-WFL-064 | `com.benefit.published` | T09 | `com.post.published` | Retirado: el consumidor ya no lo usa |
| CNC-WFL-065 | `com.outage.scheduled` | T09 | — | Conciliado: tipo de comunicación de T09 disparado por `com.outage.published` (EVT-COM-22) |
| CNC-WFL-066 | `iam.mfa.changed` | T09 | `iam.role.changed` o `iam.profile.changed` | Conciliado: tipo de comunicación de T09 disparado por `iam.mfa.enrolled` (EVT-IAM-08) |
| CNC-WFL-067 | `por.delegation.changed` | T09 | `por.delegation.accepted` o `por.delegation.invited` | Conciliado: tipo de comunicación de T09 disparado por `por.delegation.invited` (EVT-POR-06) |
| CNC-WFL-068 | `por.formSubmission.received` | T09 | `por.publicSubmission.received` | Conciliado: tipo de comunicación de T09 disparado por `por.formSubmission.submitted` (EVT-POR-07) |
| CNC-WFL-069 | `por.formSubmission.decided` | T09 | `por.formSubmission.submitted` o `por.formSubmission.accepted` | Conciliado: tipo de comunicación de T09 disparado por `por.formSubmission.accepted` (EVT-POR-08) |
| CNC-WFL-070 | `crm.circular.issued` | T09 | `crm.queueTicket.issued` | Conciliado: tipo de comunicación de T09 disparado por `crm.circularRun.generated` (EVT-CRM-24) |
| CNC-WFL-071 | `com.benefit.issued` | T09 | — | Conciliado: tipo de comunicación de T09 disparado por `com.benefit.redemptionIssued` (EVT-COM-20) |
| CNC-WFL-072 | `com.preference.unsubscribed` | T09 | `com.preference.changed` | Conciliado: tipo de comunicación de T09 disparado por `com.consent.changed` (EVT-COM-30) |
| CNC-WFL-073 | `tec.installation.activated` | T09 | `tec.installation.activationConfirmed` | Conciliado: tipo de comunicación de T09 disparado por `tec.installation.activationConfirmed` (EVT-TEC-16) |
| CNC-WFL-074 | `ven.quote.closed` | T09 | `ven.posSession.closed` | Conciliado: tipo de comunicación de T09 disparado por `ven.quote.rejected` (EVT-VEN-06) |
| CNC-WFL-075 | `tar.schedule.approvalRequested` | T09 | `tar.schedule.activated` o `tar.schedule.approved` | Conciliado: tipo de comunicación de T09 disparado por `tar.schedule.submitted` (EVT-TAR-001) |
| CNC-WFL-076 | `cob.paymentLink.statusChanged` | T09 | `cob.paymentIntent.statusChanged` | Conciliado: tipo de comunicación de T09 disparado por `cob.paymentIntent.statusChanged` (EVT-COB-20) |
| CNC-WFL-077 | `cob.remittanceImport.failed` | T09 | — | Conciliado: tipo de comunicación de T09 disparado por `cob.exception.opened` (EVT-COB-22) |
| CNC-WFL-078 | `mor.promise.changed` | T09 | `mor.promise.broken` o `mor.promise.kept` | Conciliado: tipo de comunicación de T09 disparado por `mor.promise.registered` (EVT-MOR-11) |
| CNC-WFL-079 | `mor.agreement.changed` | T09 | `mor.agreement.completed` o `mor.agreement.activated` | Conciliado: tipo de comunicación de T09 disparado por `mor.agreement.created` (EVT-MOR-14) |
| CNC-WFL-080 | `cmp.supplyRequest.decided` | T09 | `cmp.portalSubmission.decided` o `cmp.matchException.decided` | Conciliado: tipo de comunicación de T09 disparado por `cmp.supplyRequest.approved` (EVT-CMP-03) |
| CNC-WFL-081 | `cmp.portalSubmission.changed` | T09 | `cmp.portalSubmission.received` o `cmp.portalSubmission.decided` | Conciliado: tipo de comunicación de T09 disparado por `cmp.portalSubmission.received` (EVT-CMP-14) |
| CNC-WFL-082 | `sue.leave.changed` | T09 | `sue.leave.rejected` o `sue.leave.requested` | Conciliado: tipo de comunicación de T09 disparado por `sue.leave.requested` (EVT-SUE-08) |
| CNC-WFL-083 | `cob.ledgerEntry.posted` | T10 | — | Conciliado: `cob.obligation.registered` (EVT-COB-01). Un solo canónico desde el 5-11-2026 (PA-WFL-23, Asumida DEC-072); T10 se suscribe directamente a EVT-COB-04, EVT-COB-05 y EVT-COB-06; antes "Conciliado: cob.obligation.registered (EVT-COB-01), cob.payment.confirmed (EVT-COB-04), cob.receipt.voided (EVT-COB-05), cob.allocation.reversed (EVT-COB-06)" |
| CNC-WFL-084 | `fac.billingBatch.closed` | T10 | `fac.billingCycle.closed` o `fac.billingRun.closed` | Conciliado: `fac.billingRun.closed` (EVT-FAC-06) |
| CNC-WFL-085 | `cob.cashbox.closed` | T10 | `cob.cashSession.closed` | Conciliado: `cob.cashSession.closed` (EVT-COB-12) |
| CNC-WFL-086 | `mor.notificationBatch.generated` | T10 | `mor.batch.generated` | Conciliado: `mor.batch.generated` (EVT-MOR-07) |
| CNC-WFL-087 | `med.readingCycle.closed` | T10 | `med.readingBatch.closed` | Conciliado: `med.readingBatch.closed` (EVT-MED-07) |
| CNC-WFL-088 | `iam.roleAssignment.revoked` | T10 | `iam.session.revoked` o `iam.apiClient.revoked` | Conciliado: `iam.role.unassigned` (EVT-IAM-04) |
| CNC-WFL-089 | `iam.roleAssignment.changed` | T10 | `iam.role.changed` o `iam.profile.changed` | Conciliado: `iam.role.assigned` (EVT-IAM-04). Un solo canónico desde el 5-11-2026 (PA-WFL-23, Asumida DEC-072); T10 se suscribe directamente a EVT-IAM-05; antes "Conciliado: iam.role.assigned (EVT-IAM-04), iam.role.changed (EVT-IAM-05)" |
| CNC-WFL-090 | `cfg.version.published` | T10 | `cfg.configVersion.published` | Conciliado: `cfg.configVersion.published` (EVT-CFG-05) |
| CNC-WFL-091 | `crm.request.processed` | T10 | — | Conciliado: `crm.case.statusChanged` (EVT-CRM-05) |
| CNC-WFL-092 | `bia.webhook.disabled` | T10 | `bia.webhookSubscription.disabled` | Descartado: no es evento (plantilla de correo; el evento es EVT-BIA-12) |
| CNC-WFL-093 | `bia.api.legacyRefsExposed` | T10 | — | Descartado: no es evento (clave `bia.api.legacyKeyExposed` de PRM-BIA-070; `bia.api.legacyRefsExposed` era el nombre anterior de la clave, T10) |
| CNC-WFL-094 | `bia.sem.billed` | T10 | — | Descartado: no es evento (métrica de la capa semántica de T10) |
| CNC-WFL-095 | `bia.sem.collected` | T10 | — | Descartado: no es evento (métrica de la capa semántica de T10) |
| CNC-WFL-096 | `bia.sem.credited` | T10 | — | Descartado: no es evento (métrica de la capa semántica de T10) |
| CNC-WFL-097 | `bia.sem.connected` | T10 | — | Descartado: no es evento (métrica de la capa semántica de T10) |
| CNC-WFL-098 | `bia.sem.committed` | T10 | — | Descartado: no es evento (métrica de la capa semántica de T10) |
| CNC-WFL-099 | `med.meter.alreadyInstalled` | M03 | `med.meter.installed` o `med.meter.removed` | Descartado: no es evento (código de error de M03) |
| CNC-WFL-100 | `cob.treasuryHandover.received` | M07 | `cob.retention.received` | Conciliado: `tes.cashRemittance.accepted` (EVT-TES-08) |
| CNC-WFL-101 | `cat.command.rejected` | M09 | — | Brecha resuelta: `cat.command.rejected` (EVT-CAT-27) |
| CNC-WFL-102 | `crm.priority.defaultUnclassified` | M09 | — | Descartado: no es evento (clave PRM-CRM-011) |
| CNC-WFL-103 | `crm.notify.onCreated` | M09 | — | Descartado: no es evento (clave PRM-CRM-050) |
| CNC-WFL-104 | `crm.queue.called` | M09 | `crm.queueTicket.called` | Conciliado: `crm.queueTicket.called` (EVT-CRM-20) |
| CNC-WFL-105 | `tec.feasibility.expired` | M10 | `tec.feasibility.verdictIssued` o `tec.feasibility.requested` | Descartado: no es evento (código de error de M10) |
| CNC-WFL-106 | `tec.feasibility.alreadyUsed` | M10 | `tec.feasibility.verdictIssued` o `tec.feasibility.requested` | Descartado: no es evento (código de error de M10) |
| CNC-WFL-107 | `tec.workOrder.locked` | M10 | `tec.workOrder.created` o `tec.workOrder.statusChanged` | Descartado: no es evento (código de error de M10) |
| CNC-WFL-108 | `tec.booking.expired` | M10 | — | Descartado: no es evento (código de error de M10) |
| CNC-WFL-109 | `tec.material.exceedsAuthorized` | M10 | `tec.material.returned` o `tec.material.used` | Descartado: no es evento (código de error de M10) |
| CNC-WFL-110 | `con.contract.created` | M10 | — | Conciliado: `cat.contract.installationRequested` (EVT-CAT-08) |
| CNC-WFL-111 | `con.contract.planChanged` | M10 | — | Conciliado: `cat.contract.planChanged` (EVT-CAT-18) |
| CNC-WFL-112 | `con.contract.terminated` | M10 | — | Conciliado: `cat.contract.terminationRequested` (EVT-CAT-13) |
| CNC-WFL-113 | `ven.salesOrder.invoiced` | M11 | `ven.operationCharge.invoiced` | Brecha resuelta: `ven.salesOrder.invoiced` (EVT-VEN-15) |
| CNC-WFL-114 | `stk.consumption.recorded` | M13 | — | Conciliado: `stk.materials.consumed` (EVT-STK-02) |
| CNC-WFL-115 | `cmp.supplierInvoice.posted` | M15 | `cmp.supplierInvoice.registered` o `cmp.supplierInvoice.released` | Conciliado: `cmp.supplierInvoice.registered` (EVT-CMP-08) |
| CNC-WFL-116 | `cmp.creditNote.posted` | M15 | — | Conciliado: EVT-CMP-08 con `kind = creditNote` |
| CNC-WFL-117 | `stk.revaluation.posted` | M15 | `stk.adjustment.posted` o `stk.depreciation.posted` | Conciliado: `stk.valuation.changed` (EVT-STK-14) |
| CNC-WFL-118 | `stk.fixedAsset.capitalized` | M15 | `stk.fixedAsset.valueChanged` o `stk.fixedAsset.disposed` | Conciliado: `stk.fixedAsset.registered` (EVT-STK-17) |
| CNC-WFL-119 | `stk.fixedAsset.improved` | M15 | `stk.fixedAsset.valueChanged` o `stk.fixedAsset.disposed` | Conciliado: `stk.fixedAsset.valueChanged` (EVT-STK-17) |
| CNC-WFL-120 | `stk.fixedAsset.inflationAdjusted` | M15 | `stk.fixedAsset.valueChanged` o `stk.fixedAsset.disposed` | Conciliado: `stk.fixedAsset.valueChanged` (EVT-STK-17) |
| CNC-WFL-121 | `stk.productionOrder.started` | M15 | — | Conciliado: `stk.manufacturing.inProcess` (EVT-STK-20) |
| CNC-WFL-122 | `tec.work.completed` | M15 | — | Brecha resuelta: `tec.work.completed` (EVT-TEC-34) |
| CNC-WFL-123 | `ins.capital.closed` | M17 | `ins.meeting.closed` | Descartado: no es evento (código de error de M17) |
| CNC-WFL-124 | `ins.refund.annualLimitReached` | M17 | — | Descartado: no es evento (código de error de M17) |
| CNC-WFL-125 | `ins.meeting.reserved` | M17 | `ins.meeting.closed` o `ins.meeting.convened` | Descartado: no es evento (código de error de M17) |
| CNC-WFL-126 | `ins.vote.closed` | M17 | `ins.meeting.closed` | Descartado: no es evento (código de error de M17) |
| CNC-WFL-127 | `per.relationship.changed` | M18 | `per.ownership.changed` o `per.address.changed` | Conciliado: `per.relationship.granted` (EVT-PER-18) |
| CNC-WFL-128 | `soc.act.unauthorized` | M18 | — | Descartado: no es evento (código de error de M18) |
| CNC-WFL-129 | `soc.housing.cashRegisterClosed` | M18 | `soc.housing.priceUpdated` o `soc.housing.allocated` | Descartado: no es evento (código de error de M18) |
| CNC-WFL-130 | `soc.driver.licenseExpired` | M18 | `soc.driver.timeReported` | Descartado: no es evento (código de error de M18) |

### 12.5 Eventos consumidos por T11

| Evento | Productor | Efecto en T11 |
|---|---|---|
| `pla.tenant.suspended` / `.reactivated` / `.closed` | T01 | Pausa o reanuda `jobSchedules`; pausa corridas en curso; al cerrar, deshabilita programaciones. |
| `pla.capability.activated` / `.deactivated` | T01 | Crea o deshabilita `jobSchedules` y workflows del módulo. |
| `pla.restore.completed` | T01 | Reconstruye proyecciones (`workItems`, `agendaEntries`, `dossierTimeline`) y verifica integridad documental del tenant. |
| `iam.membership.suspended` / `.revoked` | T02 | Reasignación de tareas y pasos; suspende delegaciones (P-WFL-15). |
| `iam.role.assigned` / `.unassigned`, `iam.role.changed` | T02 | Recalcula candidatos de pasos activos. |
| `iam.authorization.requested` / `.granted` / `.rejected` / `.expired` / `.consumed` | T02 | Proyecta en bandeja. |
| `sue.employee.terminated`, `sue.leave.approved`, `sue.employee.assignmentChanged` | M16 | Reasignación, agenda, responsables por área. |
| `cfg.holiday.changed` | T04 | Recalcula temporizadores no vencidos (RF-WFL-104). |
| `cfg.configVersion.submitted` | T04 | Inicia la aprobación de la versión (política `cfg.configVersion.publish`). |
| `cfg.customField.defined` / `.deprecated` | T04 | Disponibles en formularios dinámicos. |
| `tes.exchangeRate.published` | M14 | Conversión de importes para tramos (RN-WFL-045). |
| `int.signature.completed` / `.rejected` | T06 | Completa o rechaza la firma digital. |
| `int.operation.succeeded` / `.failed` / `.uncertain` / `.manuallyResolved` (antes `.manually-resolved`) | T06 | Actualiza pasos de operaciones con efecto externo. |
| `int.circuit.opened`, `fis.authorization.globalFailure` / `.globalRecovered` | T06, M06 | Pausa y reanuda corridas dependientes (RF-WFL-027). |
| `crm.case.assigned` / `.statusChanged` / `.derived`, `crm.activityOccurrence.*`, `crm.deskEntry.*`, `crm.survey.negativeReceived` | M09 | Bandeja, agenda, expediente formal y pases. |
| `tec.workOrder.statusChanged`, `tec.visit.statusChanged`, `tec.syncConflict.*` | M10 | Bandeja y agenda. |
| `fac.billingException.opened` / `.resolved`, `cob.exception.opened`, `med.consumptionException.raised`, `med.syncConflict.raised`, `stk.fieldConflict.*`, `cmp.matchException.raised` | M05, M07, M03, M13, M12 | Bandeja (excepciones). |
| `con.event.pendingConfiguration` / `con.event.failed` | M15 | Bandeja operativa con título funcional. |
| `ins.meeting.convened` / `.closed`, `ins.minute.signed`, `ins.mandate.started` / `.ended` | M17 | Agenda, expediente de asamblea, comités de aprobación. |
| `tar.enrollment.changed`, `tec.workOrder.closed` y todo evento referenciado en nodos `waitEvent` | Varios | Avance de instancias en espera (RF-WFL-074). |
| `mig.issue.assigned` | T07 | Bandeja. |
| Todos los eventos marcados `timeline` | Todos | Proyección `dossierTimeline`. |
| `nfr.personData.erasureRequested`, `nfr.legalHold.activated` / `.released`, `nfr.file.infected` | T08 | Supresión de PII en formularios y documentos, retenciones legales, rechazo de versiones infectadas. |
| `nfr.referentialIntegrity.broken` (EVT-NFR-18) | T08 | Crea o actualiza el ítem `operationalInboxItems` con `kind = referentialIntegrity` en la bandeja de integridad del tenant, deduplicado por `<colección>:<campo>:<_id de origen>`; se cierra cuando la corrida siguiente ya no lo informa (RF-WFL-010; DEC-100, T08 RNF-NFR-260; 10-11-2026). |
| `uxd.branding.published`, `uxd.dictionary.published` | T03 | Invalida la caché de render de plantillas. |
| `com.communication.*`, `com.communication.milestoneReached`, `com.event.*` | T09 | Evidencia de firma OTP y acuses, nodos `waitEvent`, agenda. |
| `com.post.reviewRequested`, `com.campaign.statusChanged`, `bia.customReport.submitted` | T09, T10 | Inicia la aprobación configurada. |

### 12.6 Reglas de los jobs y de la programación por tenant

1. **Cola y prioridad:** todo job declara una de las clases de cola de T01. La prioridad y la concurrencia global son las de T01 (`interactive` 1, `integration` 1–2, `events` 2, `notifications` 3, `batch` 4, `export` 5, `ai` 5, `maintenance` 6). Las colas propias de un módulo (M15: `con-realtime`, `con-batch`, `con-closing`, `con-sim`, `con-integration`; T08: `critical`) se mapean a esas clases (CTR-WFL-06).
2. **Concurrencia por tenant:** el límite de la clase (T01) se puede bajar por job en `jobDefinitions.tenantConcurrency` (antes `perTenantConcurrency`, nombre que no existe en §7.2), nunca subir por encima de la clase. Los jobs con `lockScope` (por ejemplo, "por par punto de venta + tipo" en JOB-FIS-01) serializan además por clave.
3. **Reintentos:** por defecto, los de PRM-PLA-028 (5 intentos, backoff exponencial desde 5.000 ms). El job puede declarar otra política. Al agotar los intentos, el ítem va a `deadLetters` y a la bandeja operativa (RF-WFL-024) con el responsable del tipo.
4. **Idempotencia:** toda corrida declara `idempotencyKey`. Las corridas masivas registran avance por ítem en `bulkRunItems` y son reanudables desde el último lote confirmado (RN-WFL-008).
5. **Programación:** cada job programado tiene un `jobSchedules` por tenant con `cron`, `timezone` (por defecto, la del tenant, `America/Argentina/Cordoba`), `status` y ventana de ejecución. Los cron "diario HH:MM" de los anexos se interpretan en la zona del tenant, salvo que digan "zona plataforma" o "UTC". Los jobs de plataforma (`fan-out`) se programan una vez y encolan un hijo por tenant con dispersión aleatoria de PRM-WFL-051 minutos para no saturar.
6. **Reprogramación:** el administrador del tenant puede cambiar hora y días de los jobs marcados `tenantSchedulable`, dentro de la ventana permitida. No puede cambiar la cola ni la concurrencia (PA-WFL-18). Cada cambio emite EVT-WFL-047.
7. **Suspensión:** con el tenant suspendido o el módulo desactivado, sus programaciones pasan a `paused` y no se encolan corridas (EVT-PLA-03/07). Al reactivar, no se recuperan las ejecuciones perdidas salvo los jobs marcados `catchUp: true`.
8. **Gatillo por evento:** los jobs disparados por evento se suscriben en `eventSubscriptions` y usan la clave `eventId + jobName` como idempotencia mínima.
9. **Ejecuciones fuera de las clases de cola de T01:** tres casos del catálogo no usan una clase de cola de T01 y no lo necesitan:
   - JOB-PLA-01 (relay de la outbox) es un proceso dedicado y continuo de T01, no un job encolado: es el que encola a los demás.
   - JOB-POR-08 se resuelve con un índice TTL de MongoDB: no encola ni tiene `jobDefinitions`; se conserva en el catálogo solo para trazabilidad del requisito (vencimiento de datos efímeros de M19).
   - JOB-NFR-12 usaba la cola `critical` de T08, que no es clase de T01; el job figura como retirado en §12.8 y la cola `critical` no se crea.

   Las colas propias de M15 (`con-realtime`, `con-batch`, `con-closing`, `con-sim`, `con-integration`) son nombres lógicos que se mapean a clases de T01 según la tabla de §12.8 (regla 1; CTR-WFL-06). Cualquier otra cola que aparezca en un anexo sin clase de T01 se trata como error de catálogo.

### 12.7 Jobs propios de T11

| ID | Nombre | Cola | Disparo / cron (zona del tenant) | Concurrencia por tenant | Reintentos | Idempotencia y reanudación |
|---|---|---|---|---|---|---|
| JOB-WFL-01 | `wfl:ejecutar-operacion` | `events` | Al aprobar (EVT-WFL-002) o por pedido directo | 4; serializa por `subjectRef` | 5, exponencial; luego `failed` + bandeja operativa | `operationId + stepOrder`; cada paso registrado en `operationSteps` |
| JOB-WFL-02 | `wfl:reparar-operaciones` | `maintenance` | Cada 5 min | 1 | Sin límite por corrida; cada paso hasta PRM-WFL-014 intentos | Reanuda pasos `pending` o `retrying` de operaciones en `executing` |
| JOB-WFL-03 | `wfl:conciliar-inciertas` | `integration` | Cada 15 min | 2 | Hasta PRM-WFL-012 horas; luego bandeja | Consulta el efecto externo antes de reintentar (sin reenvíos ciegos) |
| JOB-WFL-04 | `wfl:sla-monitor` | `events` | Cada minuto | 1 | 3 | `targetRef + threshold`; un aviso por umbral |
| JOB-WFL-05 | `wfl:vencer-aprobaciones` | `events` | Cada 5 min | 1 | 3 | `approvalStepId + action` |
| JOB-WFL-06 | `wfl:proyectar-bandeja` | `events` | Por evento proyectable | 6 | 5 | `eventId`; descarta eventos con `aggregateVersion` menor |
| JOB-WFL-07 | `wfl:recalcular-vencimientos-bandeja` | `batch` | Al cambiar feriados, calendarios o políticas SLA; diario 00:30 | 1 | 3 | Por `slaTimerId` no vencido |
| JOB-WFL-08 | `wfl:reconstruir-proyecciones` | `maintenance` | A demanda, tras restauración (EVT-PLA-14) | 1 | 3 | Colección sombra y swap atómico |
| JOB-WFL-09 | `wfl:recordatorios-tareas` | `notifications` | Cada 15 min | 2 | 3 | `taskId + reminderKind` |
| JOB-WFL-10 | `wfl:generar-tareas-recurrentes` | `batch` | Diario 01:15 | 1 | 3 | `recurrenceId + dueDate` |
| JOB-WFL-11 | `wfl:renderizar-documento` | `interactive` | Por pedido (`wfl.templates.render`) | 4 | 3 | `templateVersionId + dataHash`; resultado reutilizable |
| JOB-WFL-12 | `wfl:renderizar-lote` | `batch` | Por pedido masivo (facturas de un lote, recibos de sueldo) | 2 | 3 por ítem | `bulkRunId + sourceRef`; reanudable |
| JOB-WFL-13 | `wfl:procesar-subida` | `interactive` | Tras JOB-PLA-21 limpio | 4 | 3 | `storedFileId`; extrae metadatos, miniatura y huella |
| JOB-WFL-14 | `wfl:aplicar-retencion` | `maintenance` | Diario 03:30 | 1 | 3 | Por `documentId`; respeta `legalHolds` |
| JOB-WFL-15 | `wfl:purgar-documentos` | `maintenance` | Diario 04:00, tras la aprobación de purga | 1 | 3 | Por `documentId`; constancia en T02 |
| JOB-WFL-16 | `wfl:exportar-expediente` | `export` | A demanda | 1 | 3 | `exportId`; regenera desde cero si falla |
| JOB-WFL-17 | `wfl:enviar-a-firma` | `integration` | Al pedir firma digital (EVT-WFL-041) | 2 | 5 | `signatureRequestId + participantId` |
| JOB-WFL-18 | `wfl:consultar-estado-firma` | `integration` | Cada 15 min mientras haya solicitudes abiertas con proveedor sin webhook | 2 | 5 | `signatureRequestId` |
| JOB-WFL-19 | `wfl:vencer-firmas` | `events` | Cada hora | 1 | 3 | `signatureRequestId` |
| JOB-WFL-20 | `wfl:sellar-documento` | `interactive` | Al completar la firma | 2 | 5 | `documentId + signatureRequestId`; versión firmada única |
| JOB-WFL-21 | `wfl:proyectar-agenda` | `events` | Por evento agendable | 4 | 5 | `eventId` |
| JOB-WFL-22 | `wfl:replay-eventos` | `maintenance` | A demanda (T-SOP con aprobación) | 1 | 1 | `replayId + eventId`; consumidores idempotentes |
| JOB-WFL-23 | `wfl:verificar-integridad-documentos` | `maintenance` | Semanal, domingo 04:30 | 1 | 3 | Solo lectura; abre ítem en bandeja operativa por diferencia |
| JOB-WFL-24 | `wfl:importar-definiciones` | `batch` | A demanda (paquetes de T04, migración T07) | 1 | 1 | Por `definitionCode + version` |
| JOB-WFL-25 | `wfl:indicadores-bandeja` | `batch` | Cada hora | 1 | 3 | Recalculable por hora |
| JOB-WFL-26 | `wfl:vencer-enlaces-compartidos` | `maintenance` | Cada hora | 1 | 3 | `shareLinkId` |
| JOB-WFL-27 | `wfl:alertar-secuencias` | `maintenance` | Diario 06:00 | 1 | 3 | `sequenceId + threshold` |
| JOB-WFL-28 | `wfl:delegaciones-vigencia` | `events` | Cada 15 min | 1 | 3 | `delegationId + transition` |
| JOB-WFL-29 | `wfl:reasignar-huerfanos` | `events` | Por EVT-IAM-03, EVT-SUE-03 y EVT-SUE-08 | 2 | 5 | `userId + eventId` |
| JOB-WFL-30 | `wfl:vencer-documentos` | `maintenance` | Diario 05:30 | 1 | 3 | `documentId + kind` (por vencer o vencido) |
| JOB-WFL-31 | `wfl:programador` | `maintenance` (proceso dedicado) | Continuo | — (plataforma) | — | Encola corridas de `jobSchedules` vencidas con clave `scheduleId + plannedAt` |
| JOB-WFL-32 | `wfl:purgar-corridas` | `maintenance` | Diario 02:30 | 1 | 3 | Purga `jobRuns` y `bulkRunItems` vencidos según PRM-WFL-052 |

### 12.8 Catálogo consolidado de jobs por módulo

**Lectura:** "Disparo" resume el cron o el gatillo que declaró el anexo dueño (en la zona del tenant salvo indicación). "Cola" es la clase de T01 que T11 asigna cuando el anexo no la declaró: evento → `events`; sistema externo → `integration`; masivo → `batch`; archivo de descarga → `export`; IA → `ai`; limpieza, vencimientos y salud → `maintenance`; aviso → `notifications`. La política de reintentos y la idempotencia son las del anexo dueño. Si el anexo no las declara, rigen las de §12.6.

#### M01 PER

| ID | Nombre | Disparo | Cola |
|---|---|---|---|
| JOB-PER-01 | `per:verificar-cuit-arca` | Alta o cambio de CUIT/CUIL; manual | `integration` |
| JOB-PER-02 | `per:geocodificar-domicilios` | Alta o cambio de domicilio; lote nocturno | `integration` — Reacción a EVT-CFG-15. Ver JOB-CFG-09 (dueño) |
| JOB-PER-03 | `per:detectar-duplicados` | Diario 02:00; al importar | `batch` |
| JOB-PER-04 | `per:vencimientos` | Diario 01:00 | `maintenance` |
| JOB-PER-05 | `per:mayoria-edad-adherentes` | Diario | `maintenance` (duplicado; §12.9) — Reemplazado por JOB-SOC-01 |
| JOB-PER-06 | `per:adherentes-condicion` | Manual o programado | `batch` |
| JOB-PER-07 | `per:ejecutar-transferencia` | Transferencia aprobada (EVT-WFL-002) | `events` |
| JOB-PER-08 | `per:fusionar-personas` | Fusión aprobada | `events` |
| JOB-PER-09 | `per:importar` | Importación confirmada | `batch` |
| JOB-PER-10 | `per:revalidar-padron-arca` | Mensual (PRM-PER-014) | `integration` — Retirado. Ver JOB-CFG-08 (dueño) |
| JOB-PER-11 | `per:anonimizar` | Supresión resuelta; plazo cumplido | `maintenance` |
| JOB-PER-12 | `per:exportar-padron` | Pedido de exportación | `export` |

#### M02 CAT

| ID | Nombre | Disparo | Cola |
|---|---|---|---|
| JOB-CAT-01 | `cat:altas-automaticas` | Evento | `events` |
| JOB-CAT-02 | `cat:tramite-masivo` | Aprobación | `batch` |
| JOB-CAT-03 | `cat:copiar-servicio` | Comando | `batch` |
| JOB-CAT-04 | `cat:publicar-version-programada` | Diario 00:05 | `maintenance` |
| JOB-CAT-05 | `cat:vencimiento-provisorios` | Diario | `maintenance` |
| JOB-CAT-06 | `cat:vencimiento-no-facturar` | Diario | `maintenance` |
| JOB-CAT-07 | `cat:mayoria-edad-adherentes` | Diario | `maintenance` (duplicado; §12.9) — Reemplazado por JOB-SOC-01 |
| JOB-CAT-08 | `cat:fin-suspension-voluntaria` | Diario | `maintenance` (duplicado; §12.9) — Dueño del fin de suspensión voluntaria; publica EVT-CAT-12 |
| JOB-CAT-09 | `cat:devoluciones-vencidas` | Evento EVT-STK-07 | `maintenance` (duplicado; §12.9) — Reacción a EVT-STK-07. Ver JOB-STK-05 (dueño) |
| JOB-CAT-10 | `cat:fin-promociones` | Evento EVT-TAR-012 | `events` — Reacción a EVT-TAR-012. Ver JOB-TAR-11 (dueño) |
| JOB-CAT-11 | `cat:carencias` | Diario | `maintenance` — Reemplazado por M18 (RF-SOC-005, RF-SOC-032; DEC-071, HUECO-TRV-01): no se ejecuta |
| JOB-CAT-12 | `cat:fin-cuotas-obra` | Última cuota facturada (EVT-FAC-20) | `events` |
| JOB-CAT-13 | `cat:crear-contratos-obra` | Evento EVT-TEC-25 `tec.levy.approved` | `events` — Un contrato tipo 17 por beneficiario; idempotente por (`workId`, `premiseId`) (RF-CAT-115; HUECO-OBR-01; antes `propertyId`) |

#### M03 MED

| ID | Nombre | Disparo | Cola |
|---|---|---|---|
| JOB-MED-01 | `med:generar-lotes` | Diario según cronograma; a pedido | `batch` |
| JOB-MED-02 | `med:asignar-automatica` | A pedido | `interactive` |
| JOB-MED-03 | `med:confirmar-lote` | A pedido; al completar la recepción | `batch` |
| JOB-MED-04 | `med:importar-lecturas` | A pedido | `batch` |
| JOB-MED-05 | `med:estimar` | A pedido; al cerrar lote | `batch` |
| JOB-MED-06 | `med:dividir-consumos` | A pedido; al confirmar lote | `batch` |
| JOB-MED-07 | `med:distribuir-consumos` | Al aprobar el padre; a pedido | `batch` |
| JOB-MED-08 | `med:regularizar-estimados` | Al validar lectura real; diario | `batch` |
| JOB-MED-09 | `med:detectar-transgresiones` | Al aprobar demanda; mensual | `batch` |
| JOB-MED-10 | `med:toma-estado` | Según cronograma; a pedido | `integration` |
| JOB-MED-11 | `med:importar-ami` | Horario o diario por sistema | `integration` |
| JOB-MED-12 | `med:ejecutar-operaciones-remotas` | Continuo | `integration` |
| JOB-MED-13 | `med:solicitar-credito-prepago` | Continuo | `integration` |
| JOB-MED-14 | `med:conciliar-prepago` | Diario (PRM-MED-135) | `integration` |
| JOB-MED-15 | `med:balance-inyeccion` | Al aprobar consumos de generación distribuida | `batch` |
| JOB-MED-16 | `med:abrir-ventanas-autolectura` | Diario | `maintenance` |
| JOB-MED-17 | `med:detectar-sin-lectura` | Al cerrar la ventana del cronograma | `batch` |
| JOB-MED-18 | `med:detectar-consumo-no-registrado` | Mensual tras aprobación | `batch` |
| JOB-MED-19 | `med:verificar-salud-conectores` | Cada 15 min | `maintenance` |
| JOB-MED-20 | `med:depurar-logs-conector` | Diario | `maintenance` |
| JOB-MED-21 | `med:archivar-fotos` | Mensual | `maintenance` |
| JOB-MED-22 | `med:importar-curvas` | Diario (extensión) | `integration` |

#### M04 TAR

| ID | Nombre | Disparo | Cola |
|---|---|---|---|
| JOB-TAR-01 | `tar:activar-versiones` | Diario 00:05 y al publicar | `maintenance` |
| JOB-TAR-02 | `tar:simular-masivo` | A pedido | `batch` |
| JOB-TAR-03 | `tar:calcular-lote` | A pedido de M05 | `batch` |
| JOB-TAR-04 | `tar:importar-padron` | A pedido | `batch` |
| JOB-TAR-05 | `tar:recategorizar` | A pedido | `batch` (duplicado; §12.9) |
| JOB-TAR-06 | `tar:diferencias-retroactivas` | Al publicar con vigencia pasada; a pedido | `batch` |
| JOB-TAR-07 | `tar:migrar-cuadros` | Migración (T07) | `batch` |
| JOB-TAR-08 | `tar:traducir-formulas` | Migración; a pedido | `batch` |
| JOB-TAR-09 | `tar:tasar-llamadas` | EVT-TEC-27; cada hora (PRM-TAR-083) | `events` |
| JOB-TAR-10 | `tar:retasar` | A pedido | `batch` |
| JOB-TAR-11 | `tar:aviso-fin-promociones` | Diario | `notifications` |
| JOB-TAR-12 | `tar:purgar-simulaciones` | Semanal | `maintenance` |
| JOB-TAR-13 | `tar:exportar-padron` | A pedido | `export` |
| JOB-TAR-14 | `tar:crear-planes-obra` | Eventos EVT-TEC-25 `tec.levy.approved` y EVT-CAT-09 de contratos tipo 17 | `events` — Un `worksInstallmentPlans` por beneficiario (o `pendingContract`); idempotente por (`workId`, `premiseId`) (RF-TAR-116; HUECO-OBR-01; antes `propertyId`) |

#### M05 FAC

| ID | Nombre | Disparo | Cola |
|---|---|---|---|
| JOB-FAC-01 | `fac:preparar-lote` | API de preparación | `batch` — Ordena el cálculo por dependencias de servicios relacionados: **CLO después de AG** y, en general, el servicio dependiente después de su base; una dependencia no resuelta genera `RELATED_SERVICE_MISSING` sin detener el lote (RF-FAC-175, RN-FAC-155; HUE-CLO-02) |
| JOB-FAC-02 | `fac:prefacturar-lote` | API de prefacturación; nueva versión de universo | `batch` |
| JOB-FAC-03 | `fac:emitir-lote` | API de emisión o reanudación | `batch` |
| JOB-FAC-04 | `fac:generar-pdf` | EVT-FIS-01 o emisión sin autorización | `batch` (usa JOB-WFL-12) |
| JOB-FAC-05 | `fac:generar-codigos` | Emisión | `batch` |
| JOB-FAC-06 | `fac:distribuir-lote` | API o automático al autorizar | `notifications` |
| JOB-FAC-07 | `fac:reprocesar-excepciones` | API o al resolver excepciones | `batch` |
| JOB-FAC-08 | `fac:conciliar-inciertos` | Cada 15 min | `integration` |
| JOB-FAC-09 | `fac:anular-masivo` | Solicitud aprobada (EVT-WFL-002) | `batch` |
| JOB-FAC-10 | `fac:recategorizar` | Operación aprobada | `batch` (duplicado; §12.9) |
| JOB-FAC-11 | `fac:retroactivos` | Operación aprobada | `batch` |
| JOB-FAC-12 | `fac:modificacion-masiva` | Operación aprobada | `batch` |
| JOB-FAC-13 | `fac:importar-terceros` | Importación confirmada | `batch` |
| JOB-FAC-14 | `fac:generar-talones` | API | `batch` |
| JOB-FAC-15 | `fac:cerrar-ciclo` | Acta aprobada | `batch` |
| JOB-FAC-16 | `fac:alerta-pendientes-autorizacion` | Diario | `maintenance` |
| JOB-FAC-17 | `fac:programar-ciclos` | Diario 02:00 | `maintenance` |
| JOB-FAC-18 | `fac:aplicar-resultado-fiscal` | Eventos `fis.*` | `events` |

#### M06 FIS

| ID | Nombre | Disparo | Cola |
|---|---|---|---|
| JOB-FIS-01 | `fis:autorizar-cola` | Por evento y cada minuto; serializa por punto de venta + tipo | `integration` |
| JOB-FIS-02 | `fis:renovar-ticket` | A demanda; preventivo cada 30 min | `integration` |
| JOB-FIS-03 | `fis:probar-conector` | A demanda; cada 15 min | `maintenance` |
| JOB-FIS-04 | `fis:conciliar-incierto` | Tras timeout; cada 5 min | `integration` |
| JOB-FIS-05 | `fis:conciliar-arca` | Diario 02:00; tras restauración | `integration` |
| JOB-FIS-06 | `fis:solicitar-caea` | N días antes de cada quincena | `integration` |
| JOB-FIS-07 | `fis:informar-caea` | Diario; al cierre de quincena | `integration` |
| JOB-FIS-08 | `fis:importar-padron` | A demanda; mensual | `batch` (duplicado; §12.9) — Retirado. Ver JOB-CFG-08 (dueño) |
| JOB-FIS-09 | `fis:sincronizar-puntos-venta` | Diario | `integration` |
| JOB-FIS-10 | `fis:generar-libro-iva` | A demanda | `export` |
| JOB-FIS-11 | `fis:generar-lid` | A demanda; mensual | `export` |
| JOB-FIS-12 | `fis:conciliar-mis-comprobantes` | A demanda | `batch` |
| JOB-FIS-13 | `fis:generar-regimen` | A demanda; según calendario | `export` |
| JOB-FIS-14 | `fis:calendario-fiscal` | Diario | `maintenance` |
| JOB-FIS-15 | `fis:rendicion-terceros` | Según convenio | `batch` |
| JOB-FIS-16 | `fis:generar-informe-regulatorio` | A demanda; según calendario | `export` |
| JOB-FIS-17 | `fis:sincronizar-parametros-arca` | Semanal (plataforma) | `integration` (duplicado; §12.9) — Reacción a EVT-INT-06. Ver JOB-INT-18 (dueño) |
| JOB-FIS-18 | `fis:alertas-credenciales` | Diario | `maintenance` |
| JOB-FIS-19 | `fis:revalidar-condicion` | Mensual | `integration` (duplicado; §12.9) |
| JOB-FIS-20 | `fis:pasarela-importar` | Por carga o API | `batch` |

#### M07 COB

| ID | Nombre | Disparo | Cola |
|---|---|---|---|
| JOB-COB-01 | `cob:exportar-deuda-ente` | Programado por ente; manual | `integration` |
| JOB-COB-02 | `cob:importar-rendicion` | Archivo nuevo en SFTP (T06); cada 30 min en ventana | `integration` |
| JOB-COB-03 | `cob:sondear-rendicion-api` | Diario y a demanda | `integration` |
| JOB-COB-04 | `cob:procesar-webhook` | Webhook recibido (tras JOB-INT-03) | `integration` |
| JOB-COB-05 | `cob:resolver-inciertos` | Intención incierta; backoff 1-5-15-60 min y luego 6 h hasta 72 h | `integration` |
| JOB-COB-06 | `cob:conciliar-pasarelas-diario` | Diario 06:00 | `integration` |
| JOB-COB-07 | `cob:presentar-debitos` | Diario (evalúa fechas de corte) | `integration` |
| JOB-COB-08 | `cob:importar-rechazos-debito` | Diario | `integration` |
| JOB-COB-09 | `cob:sincronizar-adhesiones` | Diario | `integration` |
| JOB-COB-10 | `cob:cancelacion-automatica-creditos` | Diario tras facturación; manual | `batch` |
| JOB-COB-11 | `cob:emitir-resumenes` | EVT-FAC-05; cierre de ciclo | `batch` |
| JOB-COB-12 | `cob:vencer-intenciones` | Cada hora | `maintenance` (duplicado; §12.9) |
| JOB-COB-13 | `cob:recordatorio-cierre-caja` | Fin de jornada configurable | `notifications` |
| JOB-COB-14 | `cob:verificar-integridad-auxiliar` | Diario 03:00 | `maintenance` |
| JOB-COB-15 | `cob:reparar-pendientes` | Cada 10 min | `maintenance` |
| JOB-COB-16 | `cob:qr-masivo-facturas` | EVT-FAC-05 | `integration` |
| JOB-COB-17 | `cob:liquidar-comisiones-cobradores` | Mensual; manual | `batch` |
| JOB-COB-18 | `cob:procesar-novedades-adhesion` | Archivo de novedades | `batch` |
| JOB-COB-19 | `cob:importar-contracargos` | Diario | `integration` |
| JOB-COB-20 | `cob:conciliacion-cobranzas` | Diario | `batch` |
| JOB-COB-21 | `cob:escalar-no-identificados` | Diario | `maintenance` |
| JOB-COB-22 | `cob:actualizar-deuda-publicada` | EVT-COB-02, EVT-FAC-08; lote diario | `integration` |

#### M08 MOR

| ID | Nombre | Disparo | Cola |
|---|---|---|---|
| JOB-MOR-01 | `mor:intereses-facturar` (`:preview`, `:generate`) | A demanda | `batch` |
| JOB-MOR-02 | `mor:evaluar-mora` | Diario 03:00 | `batch` |
| JOB-MOR-03 | `mor:generar-candidatos` | A demanda o programado por política | `batch` |
| JOB-MOR-04 | `mor:procesar-instancia` | A demanda o programado (`autoAdvance`) | `batch` |
| JOB-MOR-05 | `mor:vencer-promesas` | Diario | `maintenance` |
| JOB-MOR-06 | `mor:alertas-protecciones` | Diario | `maintenance` |
| JOB-MOR-07 | `mor:evaluar-reconexion` | Por evento (EVT-COB-04, EVT-MOR-14) | `events` |
| JOB-MOR-08 | `mor:fin-suspension-voluntaria` | Diario | `maintenance` (duplicado; §12.9) |
| JOB-MOR-09 | `mor:vencer-anticipos` | Diario | `maintenance` |
| JOB-MOR-10 | `mor:emitir-cuotas` | Diario | `batch` |
| JOB-MOR-11 | `mor:control-convenios` | Diario | `batch` |
| JOB-MOR-12 | `mor:recalcular-cuotas-fiscal` | Mensual; a demanda | `batch` |
| JOB-MOR-13 | `mor:deuda-a-prescribir` | Mensual | `batch` |
| JOB-MOR-14 | `mor:exportacion-regulatoria` | Según regulador | `export` |
| JOB-MOR-15 | `mor:ajuste-indices` | Mensual | `maintenance` |
| JOB-MOR-16 | `mor:actualizar-depositos` | Mensual | `batch` |
| JOB-MOR-17 | `mor:segmentar-deuda` | Diario | `batch` |
| JOB-MOR-18 | `mor:ejecutar-ventana` | Cada 15 min | `events` |

#### M09 CRM

| ID | Nombre | Disparo | Cola |
|---|---|---|---|
| JOB-CRM-01 | `crm:sla-monitor` | Cada minuto | `events` (convergencia con JOB-WFL-04; §12.9) — Reacción a EVT-WFL-020/021. Ver JOB-WFL-04 (dueño) |
| JOB-CRM-02 | `crm:ai-classify` | Por evento | `ai` |
| JOB-CRM-03 | `crm:auto-close-resolved` | Diario 02:00 | `maintenance` |
| JOB-CRM-04 | `crm:stale-cases` | Diario 07:00 | `notifications` |
| JOB-CRM-05 | `crm:incident-detect` | Cada 5 min | `events` |
| JOB-CRM-06 | `crm:cancellation-receipts` | Cada 15 min | `notifications` |
| JOB-CRM-07 | `crm:procedure-expiry` | Diario 03:00 | `maintenance` |
| JOB-CRM-08 | `crm:queue-day-close` | Diario al cierre de sucursal | `maintenance` |
| JOB-CRM-09 | `crm:activity-generate` | Diario 01:00 | `batch` |
| JOB-CRM-10 | `crm:activity-reminders` | Diario 08:00 | `notifications` |
| JOB-CRM-11 | `crm:circular-generate` | A demanda | `batch` (render con JOB-WFL-12) |
| JOB-CRM-12 | `crm:email-ingest` | Cada minuto o por webhook | `integration` |
| JOB-CRM-13 | `crm:bot-step` | Por mensaje | `interactive` |
| JOB-CRM-14 | `crm:conversation-expire` | Cada 5 min | `maintenance` |
| JOB-CRM-15 | `crm:appointment-reminders` | Cada 15 min | `notifications` |
| JOB-CRM-16 | `crm:command-retry` | Cada minuto | `events` |
| JOB-CRM-17 | `crm:metrics-snapshot` | Cada hora | `batch` |
| JOB-CRM-18 | `crm:whatsapp-templates-sync` | Diario | `integration` (duplicado con JOB-COM-14; §12.9) — Retirado. Ver JOB-COM-14 (dueño) |

#### M10 TEC

| ID | Nombre | Disparo | Cola |
|---|---|---|---|
| JOB-TEC-01 | `tec:liberar-reservas` | Cada minuto | `maintenance` |
| JOB-TEC-02 | `tec:generar-ot-masivas` | A demanda | `batch` |
| JOB-TEC-03 | `tec:cerrar-ot-masivas` | A demanda | `batch` |
| JOB-TEC-04 | `tec:reparar-efectos` | Cada 5 min | `maintenance` |
| JOB-TEC-05 | `tec:generar-mantenimiento` | Diario 02:00 | `batch` |
| JOB-TEC-06 | `tec:aprovisionar` | Continuo | `integration` |
| JOB-TEC-07 | `tec:monitorear-equipos` | Cada 5 min | `integration` |
| JOB-TEC-08 | `tec:recordatorios-visitas` | Cada 15 min | `notifications` — Retirado. Ver JOB-COM-13 (dueño) |
| JOB-TEC-09 | `tec:importar-cdr` | A demanda; programado | `batch` (duplicado; §12.9) |
| JOB-TEC-10 | `tec:geocodificar-pendientes` | Cada hora | `integration` (duplicado; §12.9) — Reacción a EVT-CFG-15. Ver JOB-CFG-09 (dueño) |
| JOB-TEC-11 | `tec:conciliar-aprovisionamiento` | Diario; tras restauración | `integration` |
| JOB-TEC-12 | `tec:escalar-conflictos` | Cada hora | `events` |
| JOB-TEC-13 | `tec:exportar-gis` | A demanda; programado | `export` |
| JOB-TEC-14 | `tec:vencer-factibilidades` | Diario | `maintenance` |
| JOB-TEC-15 | `tec:impacto-interrupcion` | A demanda | `batch` |
| JOB-TEC-16 | `tec:alertas-ot-vencidas` | Cada 30 min | `notifications` |
| JOB-TEC-17 | `tec:escalar-guardia` | Cada minuto | `notifications` — Escala OT de emergencia sin aceptación y publica EVT-TEC-36; idempotente por (`workOrderId`, `level`) (RF-TEC-232; HUE-GAS-05) |

#### M11 VEN

| ID | Nombre | Disparo | Cola |
|---|---|---|---|
| JOB-VEN-01 | `ven:vencer-presupuestos` | Diario 00:30 | `maintenance` |
| JOB-VEN-02 | `ven:recordar-presupuestos` | Diario | `notifications` |
| JOB-VEN-03 | `ven:preparar-cuotas-corrida` | A demanda de M05 | `batch` |
| JOB-VEN-04 | `ven:modificacion-masiva-cuotas` | A demanda | `batch` |
| JOB-VEN-05 | `ven:actualizacion-masiva-precios` | A demanda | `batch` |
| JOB-VEN-06 | `ven:importar-ventas-terceros` | A demanda desde M05 | `batch` |
| JOB-VEN-07 | `ven:sincronizar-campo` | Al sincronizar | `interactive` |

#### M12 CMP

| ID | Nombre | Disparo | Cola |
|---|---|---|---|
| JOB-CMP-01 | `cmp:vencer-cotizaciones` | Diario 01:00 | `maintenance` |
| JOB-CMP-02 | `cmp:conciliar-tres-vias` | Al registrar factura o recepción; nocturno | `events` |
| JOB-CMP-03 | `cmp:alertas-vencimientos` | Diario | `notifications` |
| JOB-CMP-04 | `cmp:borradores-mis-comprobantes` | Tras JOB-FIS-12 | `batch` |
| JOB-CMP-05 | `cmp:lectura-ia` | A demanda | `ai` |
| JOB-CMP-06 | `cmp:desempeno-proveedores` | Semanal | `batch` |
| JOB-CMP-07 | `cmp:expandir-previsiones` | Diario | `batch` |
| JOB-CMP-08 | `cmp:aprobacion-masiva` | A demanda (usa `wfl.services.requestApproval` por documento) | `batch` |
| JOB-CMP-09 | `cmp:liquidar-derechos-senales` | Mensual (PRM-CMP-116) y a demanda | `batch` — Idempotente por (contrato, período); publica EVT-CMP-17 al aprobarse (RF-CMP-155; HUE-TV-01) |
| JOB-CMP-10 | `cmp:controlar-compra-mayorista` | Al registrar una factura mayorista; diario de repaso | `batch` — Idempotente por factura; publica EVT-CMP-16 al aprobarse el balance (RF-CMP-150, RF-CMP-151; HUE-ELE-01, HUE-GAS-04) |

#### M13 STK

| ID | Nombre | Disparo | Cola |
|---|---|---|---|
| JOB-STK-01 | `stk:verificar-saldos` | Diario; antes del cierre | `maintenance` |
| JOB-STK-02 | `stk:vencer-reservas` | Cada hora | `maintenance` |
| JOB-STK-03 | `stk:sugerir-reposicion` | Diario | `batch` |
| JOB-STK-04 | `stk:rendicion-cuadrillas` | Semanal configurable | `batch` |
| JOB-STK-05 | `stk:devoluciones-vencidas` | Diario | `maintenance` (duplicado; §12.9) |
| JOB-STK-06 | `stk:preparar-cierre` | Mensual; a demanda | `batch` |
| JOB-STK-07 | `stk:amortizar-bienes` | Mensual o anual | `batch` |
| JOB-STK-08 | `stk:mrp` | A demanda; diario | `batch` |
| JOB-STK-09 | `stk:vencimientos` | Diario | `maintenance` |
| JOB-STK-10 | `stk:procesar-sync-campo` | Continuo | `interactive` |
| JOB-STK-11 | `stk:importar` | A demanda | `batch` |
| JOB-STK-12 | `stk:migrar-procoop` | A demanda (O11) | `batch` |

#### M14 TES

| ID | Nombre | Disparo | Cola |
|---|---|---|---|
| JOB-TES-01 | `tes:recalcular-saldos` | Nocturno | `maintenance` |
| JOB-TES-02 | `tes:importar-extracto` | A demanda | `batch` |
| JOB-TES-03 | `tes:conciliar-automatico` | Tras importación o sincronización; a demanda | `batch` |
| JOB-TES-04 | `tes:sincronizar-interbanking` | Diario (PRM-TES-058) | `integration` |
| JOB-TES-05 | `tes:generar-archivo-pago` | A demanda | `export` |
| JOB-TES-06 | `tes:procesar-respuesta-banco` | Al recibir; a demanda | `integration` |
| JOB-TES-07 | `tes:abrir-caja-pagos` | Diario 00:05 (PRM-TES-040) | `maintenance` |
| JOB-TES-08 | `tes:verificar-cajas-abiertas` | Diario 07:00 | `notifications` |
| JOB-TES-09 | `tes:actualizar-cotizaciones` | Diario, hora configurable | `integration` |
| JOB-TES-10 | `tes:proyectar-flujo` | Nocturno; a demanda | `batch` |
| JOB-TES-11 | `tes:alertas-vencimientos` | Diario | `notifications` |
| JOB-TES-12 | `tes:importar-liquidaciones-tarjeta` | A demanda (extensión) | `batch` |
| JOB-TES-13 | `tes:reconciliar-externos` | A demanda (recuperación) | `integration` |
| JOB-TES-14 | `tes:reintentar-eventos` | Cada 5 min | `events` (convergencia con `deadLetters` de T01; §12.9) — Retirado. Ver `deadLetters` de T01 |

#### M15 CON

M15 declara colas propias; T11 las mapea así: `con-realtime` → `events`, `con-batch` → `batch`, `con-closing` → `batch` con concurrencia 1 por tenant, `con-sim` → `batch` con prioridad 5, `con-integration` → `integration`.

| ID | Nombre | Disparo | Cola M15 → T01 |
|---|---|---|---|
| JOB-CON-01 | `con:contabilizar-evento` | Por evento | `con-realtime` → `events` |
| JOB-CON-02 | `con:cierre-diario` | Diario 02:00; a demanda | `con-batch` → `batch` |
| JOB-CON-03 | `con:reprocesar-pendientes` | Al publicar configuración; a demanda | `con-batch` → `batch` |
| JOB-CON-05 | `con:cierre-ejercicio` | A demanda | `con-closing` → `batch` |
| JOB-CON-06 | `con:ajuste-inflacion` | A demanda (anual o mensual) | `con-closing` → `batch` |
| JOB-CON-07 | `con:distribuir-costos` | Mensual; a demanda | `con-batch` → `batch` |
| JOB-CON-08 | `con:conciliar` | Diario y mensual | `con-batch` → `batch` |
| JOB-CON-09 | `con:simular-escenario` | A demanda | `con-sim` → `batch` |
| JOB-CON-10 | `con:proyectar-planes` | Por asiento; reconstrucción | `con-batch` → `batch` |
| JOB-CON-11 | `con:reconstruir-saldos` | Nocturno | `con-batch` → `batch` |
| JOB-CON-12 | `con:exportar-externo` | Programado; a demanda | `con-integration` → `integration` |
| JOB-CON-13 | `con:importar-asientos` | Carga de archivo | `con-batch` → `batch` |
| JOB-CON-14 | `con:presupuesto-ejecucion` | Nocturno y por evento | `con-batch` → `batch` |
| JOB-CON-15 | `con:generar-estados` | A demanda | `con-closing` → `batch` |
| JOB-CON-16 | `con:renumerar-asientos` | A demanda | `con-closing` → `batch` |
| JOB-CON-17 | `con:anular-masivo` | A demanda | `con-batch` → `batch` |
| JOB-CON-18 | `con:transcribir-rubricado` | A demanda | `con-closing` → `batch` |
| JOB-CON-19 | `con:salud-configuracion` | Diario y al publicar | `con-batch` → `maintenance` |
| JOB-CON-20 | `con:asientos-recurrentes` | Diario | `con-batch` → `batch` |
| JOB-CON-21 | `con:provisiones-cierre` | Mensual | `con-closing` → `batch` |
| JOB-CON-22 | `con:diferencia-cambio` | Mensual | `con-closing` → `batch` |
| JOB-CON-23 | `con:devengar-derechos-sepultura` | Mensual, solo con PRM-CON-193 = `deferredOverTerm` (M-135; HUECO-CEM-04) | `con-closing` → `batch` |

M15 no define JOB-CON-04: el ID quedó reservado en su anexo.

#### M16 SUE

| ID | Nombre | Disparo | Cola |
|---|---|---|---|
| JOB-SUE-01 | `sue:calcular-liquidacion` | A pedido | `batch` |
| JOB-SUE-02 | `sue:simular-configuracion` | A pedido | `batch` |
| JOB-SUE-03 | `sue:emitir-recibos-pdf` | Al aprobar | `batch` (render con JOB-WFL-12) |
| JOB-SUE-04 | `sue:firmar-recibos-empleador` | Al emitir | `integration` (solo pide la firma a T11; ejecuta JOB-WFL-17; CTR-WFL-12) |
| JOB-SUE-05 | `sue:notificar-recibos` | Al firmar el empleador | `notifications` |
| JOB-SUE-06 | `sue:consultar-estado-firma` | — | `integration` — Retirado. Ver JOB-WFL-18 (dueño) |
| JOB-SUE-07 | `sue:proponer-novedades-operativas` | Por evento; a pedido | `events` |
| JOB-SUE-08 | `sue:importar-siradig` | A pedido | `batch` |
| JOB-SUE-09 | `sue:liquidacion-anual-ganancias` | Anual; por egreso | `batch` |
| JOB-SUE-10 | `sue:generar-lsd` | A pedido | `export` |
| JOB-SUE-11 | `sue:generar-sicoss` | A pedido | `export` |
| JOB-SUE-12 | `sue:recalcular-saldos-vacaciones` | Diario 02:00; por evento de licencia | `batch` |
| JOB-SUE-13 | `sue:generar-sicore-sueldos` | A pedido | `export` |
| JOB-SUE-14 | `sue:generar-archivos-sindicales` | A pedido | `export` |
| JOB-SUE-15 | `sue:alertas-legajo` | Diario 06:00 | `notifications` |
| JOB-SUE-16 | `sue:importar-liquidacion-externa` | A pedido | `batch` |
| JOB-SUE-17 | `sue:procesar-fichadas` | Diario 03:00; a pedido | `batch` |
| JOB-SUE-18 | `sue:aplicar-aumento` | A pedido | `batch` |
| JOB-SUE-19 | `sue:recordatorios-firma` | — | `notifications` — Retirado. Ver JOB-WFL-09 (dueño) |
| JOB-SUE-20 | `sue:proyeccion-costo` | Mensual; a pedido | `batch` |
| JOB-SUE-21 | `sue:purgar-simulaciones` | Semanal | `maintenance` |
| JOB-SUE-22 | `sue:importar-novedades-excel` | A pedido | `batch` |
| JOB-SUE-23 | `sue:paralelo-comparar` | A pedido | `batch` |

#### M17 INS

| ID | Nombre | Disparo | Cola |
|---|---|---|---|
| JOB-INS-01 | `ins:registrar-capital-lote` | EVT-FAC-05 | `events` |
| JOB-INS-02 | `ins:revisar-capital` | Manual; nocturno | `batch` |
| JOB-INS-03 | `ins:generar-padron` | API-INS-046 | `batch` |
| JOB-INS-04 | `ins:emitir-libro-asociados` | API-INS-011 | `export` |
| JOB-INS-05 | `ins:exportar-inaes` | API-INS-057 | `export` |
| JOB-INS-06 | `ins:calcular-distribucion-excedentes` | API-INS-033 | `batch` |
| JOB-INS-07 | `ins:ejecutar-distribucion` | API-INS-034 | `batch` |
| JOB-INS-08 | `ins:emitir-credenciales-masivas` | API-INS-059 | `batch` |
| JOB-INS-09 | `ins:alertas-institucionales` | Diario 06:00 | `notifications` |
| JOB-INS-10 | `ins:liquidar-honorarios` | Mensual; API-INS-055 | `batch` |
| JOB-INS-11 | `ins:procesar-cola-rescates` | EVT-CON-09; manual | `batch` |
| JOB-INS-12 | `ins:conciliar-capital-contable` | Diario; manual | `maintenance` |

#### M18 SOC

| ID | Nombre | Disparo | Cola |
|---|---|---|---|
| JOB-SOC-01 | `soc:mayoria-edad` | Diario 05:00 | `maintenance` (dueño único según T12; §12.9) |
| JOB-SOC-02 | `soc:revision-condiciones` | Manual; mensual | `batch` |
| JOB-SOC-03 | `soc:vencimiento-subsidios` | Diario | `maintenance` |
| JOB-SOC-04 | `soc:vencer-reservas` | Cada hora | `maintenance` |
| JOB-SOC-05 | `soc:actualizar-precios-vivienda` | API-SOC-034 tras aprobación | `batch` |
| JOB-SOC-06 | `soc:vencimientos-flota` | Diario | `maintenance` |
| JOB-SOC-07 | `soc:mantenimiento-preventivo` | Diario | `notifications` |
| JOB-SOC-08 | `soc:ingestar-gps` | Cada PRM-SOC-051 min; webhook | `integration` (duplicado; §12.9) |
| JOB-SOC-09 | `soc:resumir-recorridos` | Nocturno | `batch` |
| JOB-SOC-10 | `soc:vencimiento-prestamos` | Diario | `maintenance` |
| JOB-SOC-11 | `soc:costo-convenios` | Mensual | `batch` |

#### M19 POR

| ID | Nombre | Disparo | Cola |
|---|---|---|---|
| JOB-POR-01 | `por:vencer-borradores` | Diario 03:00 | `maintenance` |
| JOB-POR-02 | `por:vencer-accesos` | Cada hora | `maintenance` |
| JOB-POR-03 | `por:identificar-bajas-publicas` | Al recibir; cada 15 min | `events` |
| JOB-POR-04 | `por:controlar-plazos-baja-publica` | Cada 15 min | `notifications` |
| JOB-POR-05 | `por:importar-usuarios-cooponline` | A demanda | `batch` |
| JOB-POR-06 | `por:invitar-usuarios-migrados` | A demanda, tandas de 500 por hora | `notifications` |
| JOB-POR-07 | `por:publicar-landing-programada` | Cada minuto | `maintenance` |
| JOB-POR-08 | `por:purgar-intentos-vinculacion` | TTL de MongoDB (no encola) | — |
| JOB-POR-09 | `por:metricas-portal` | Diario 04:00 | `batch` |
| JOB-POR-10 | `por:vencer-banners` | Cada hora | `maintenance` |
| JOB-POR-11 | `por:heartbeat-totems` | Cada minuto | `maintenance` |
| JOB-POR-12 | `por:recordar-acciones-pendientes` | Diario 10:00 | `notifications` |

#### T01 PLA

T01 declara la cola de cada job. La tabla la reproduce.

| ID | Nombre | Disparo | Cola |
|---|---|---|---|
| JOB-PLA-01 | `pla:outbox-relay` | Continuo + sondeo (PRM-PLA-029) | Proceso dedicado |
| JOB-PLA-02 | `pla:evaluar-checklist` | Por evento; diario 03:00 | `events` |
| JOB-PLA-03 | `pla:vencimientos-contratos-licencias` | Diario 02:00 (fan-out) | `maintenance` |
| JOB-PLA-04 | `pla:expirar-accesos-soporte` | Cada minuto | `maintenance` (duplicado; §12.9) — Reacción a EVT-IAM-11. Ver JOB-IAM-02 (dueño) |
| JOB-PLA-05 | `pla:medir-uso` | Diario 01:00 (fan-out) | `maintenance` |
| JOB-PLA-06 | `pla:evaluar-cupos` | Tras JOB-PLA-05 | `maintenance` |
| JOB-PLA-07 | `pla:evaluar-alertas` | Cada minuto | `maintenance` |
| JOB-PLA-08 | `pla:recolectar-salud` | Cada PRM-PLA-043 s | `maintenance` |
| JOB-PLA-09 | `pla:backup-logico-tenant` | Diario escalonado (fan-out) | `maintenance` |
| JOB-PLA-10 | `pla:verificar-backups` | Diario | `maintenance` |
| JOB-PLA-11 | `pla:restaurar-tenant` | A demanda | `maintenance` (worker dedicado) |
| JOB-PLA-12 | `pla:conciliar-post-restauracion` | Tras JOB-PLA-11 | `integration` |
| JOB-PLA-13 | `pla:ensayo-restauracion` | Cada PRM-PLA-014 días | `maintenance` |
| JOB-PLA-14 | `pla:cerrar-y-purgar-tenant` | Diario | `maintenance` |
| JOB-PLA-15 | `pla:crear-sandbox` | A demanda | `maintenance` |
| JOB-PLA-16 | `pla:propuesta-ia-alta` | A demanda | `interactive` |
| JOB-PLA-17 | `pla:limpiar-borradores-y-temporales` | Diario | `maintenance` |
| JOB-PLA-18 | `pla:sincronizar-config-sandbox` | A demanda | `maintenance` |
| JOB-PLA-19 | `pla:copia-anonimizada` | A demanda aprobada | `maintenance` |
| JOB-PLA-20 | `pla:exportar-tenant` | A demanda; salida | `export` |
| JOB-PLA-21 | `pla:escanear-archivo` | Por subida | `interactive` (duplicado con JOB-NFR-12; §12.9) |
| JOB-PLA-22 | `pla:sla-soporte` | Cada 5 min | `maintenance` |

#### T02 IAM

| ID | Nombre | Disparo | Cola |
|---|---|---|---|
| JOB-IAM-01 | `iam:expirar-autorizaciones` | Cada 5 min | `maintenance` |
| JOB-IAM-02 | `iam:expirar-accesos-soporte` | Cada minuto | `maintenance` (duplicado; §12.9) |
| JOB-IAM-03 | `iam:purgar-transitorios` | Cada hora | `maintenance` |
| JOB-IAM-04 | `iam:sellar-auditoria` | Diario 00:15 | `maintenance` |
| JOB-IAM-05 | `iam:verificar-integridad` | Diario; a demanda | `maintenance` (convergencia con JOB-NFR-05; §12.9) |
| JOB-IAM-06 | `iam:recertificacion` | Según PRM-IAM-061 | `batch` |
| JOB-IAM-07 | `iam:suspender-inactivos` | Diario | `maintenance` |
| JOB-IAM-08 | `iam:detectar-anomalias` | Cada 5 min | `events` |
| JOB-IAM-09 | `iam:enviar-invitaciones` | A demanda | `notifications` |
| JOB-IAM-10 | `iam:expirar-asignaciones` | Cada hora | `maintenance` |
| JOB-IAM-11 | `iam:verificar-contrasenas-comprometidas` | Semanal | `maintenance` |
| JOB-IAM-12 | `iam:sincronizar-catalogos` | Al desplegar | `maintenance` |

#### T03 UXD

| ID | Nombre | Disparo | Cola |
|---|---|---|---|
| JOB-UXD-01 | `uxd:procesar-recurso` | Subida de recurso | `interactive` |
| JOB-UXD-02 | `uxd:compilar-marca` | EVT-UXD-01/02 | `events` |
| JOB-UXD-03 | `uxd:compilar-diccionario` | EVT-UXD-04/05/08 | `events` |
| JOB-UXD-04 | `uxd:sembrar-tenant` | EVT-PLA-01 | `events` |
| JOB-UXD-05 | `uxd:sincronizar-catalogo` | Despliegue | `maintenance` |
| JOB-UXD-06 | `uxd:resumen-claves-faltantes` | Diario 03:00 (zona plataforma) | `maintenance` |
| JOB-UXD-07 | `uxd:auditar-contraste` | Semanal; al cambiar tokens base | `maintenance` |

#### T04 CFG

| ID | Nombre | Disparo | Cola |
|---|---|---|---|
| JOB-CFG-01 | `cfg:sincronizar-registro` | En cada despliegue | `maintenance` |
| JOB-CFG-02 | `cfg:publicar-version-programada` | Cada minuto | `maintenance` |
| JOB-CFG-03 | `cfg:importar-maestro` | A demanda | `batch` |
| JOB-CFG-04 | `cfg:unificar-maestro` | A demanda | `batch` |
| JOB-CFG-05 | `cfg:ingesta-georef` | Mensual; manual | `integration` |
| JOB-CFG-06 | `cfg:ingesta-feriados` | Anual; manual ante decreto | `integration` |
| JOB-CFG-07 | `cfg:ingesta-indices` | Diaria 18:00 (cotizaciones y tasas); mensual (IPC) | `integration` |
| JOB-CFG-08 | `cfg:ingesta-padron:<registro>` | Según fuente | `integration` (duplicado; §12.9) |
| JOB-CFG-09 | `cfg:geocodificar-pendientes` | Cada 15 min | `integration` (duplicado; §12.9) |
| JOB-CFG-10 | `cfg:migrar-variables` | A demanda (T07) | `batch` |
| JOB-CFG-11 | `cfg:aplicar-semilla` | A demanda | `batch` |
| JOB-CFG-12 | `cfg:activar-vigencias` | Cada minuto | `maintenance` |
| JOB-CFG-13 | `cfg:verificar-integridad` | Diario 03:00 | `maintenance` |
| JOB-CFG-14 | `cfg:purgar-geocache` | Diario | `maintenance` |

#### T06 INT

| ID | Nombre | Disparo | Cola |
|---|---|---|---|
| JOB-INT-01 | `int:ejecutar-operacion` | Por operación | `integration` |
| JOB-INT-02 | `int:resolver-incierto` | Por operación incierta, con backoff | `integration` |
| JOB-INT-03 | `int:procesar-webhook` | Por webhook | `integration` |
| JOB-INT-04 | `int:generar-archivo` | A pedido del módulo dueño | `integration` |
| JOB-INT-05 | `int:procesar-archivo-entrante` | Carga o buzón | `integration` |
| JOB-INT-06 | `int:conciliar` | Diario por conexión | `integration` |
| JOB-INT-07 | `int:recuperar-pendientes` | Cada PRM-INT-025 min | `integration` |
| JOB-INT-08 | `int:health-check` | Cada PRM-INT-013 min | `maintenance` |
| JOB-INT-09 | `int:alertar-vencimientos` | Diario | `maintenance` |
| JOB-INT-10 | `int:rotar-credencial` | Manual; programado | `maintenance` |
| JOB-INT-11 | `int:refrescar-tokens` | Antes de vencer | `integration` |
| JOB-INT-12 | `int:cerrar-contingencia` | Al recuperar conexión | `integration` |
| JOB-INT-13 | `int:entregar-mensaje` | Por lote de T09 | `notifications` |
| JOB-INT-14 | `int:despachar-comando-agente` | Por comando | `integration` |
| JOB-INT-15 | `int:purgar-bitacora` | Diario | `maintenance` |
| JOB-INT-16 | `int:leer-buzon-sftp` | Cron por conexión | `integration` |
| JOB-INT-17 | `int:entregar-sftp` | Por archivo | `integration` |
| JOB-INT-18 | `int:sincronizar-parametros-arca` | Semanal; a demanda | `integration` (duplicado; §12.9) |
| JOB-INT-19 | `int:polling-cobranzas` | Cron por conexión | `integration` |
| JOB-INT-20 | `int:sincronizar-estados-debito` | Diario | `integration` |
| JOB-INT-21 | `int:importar-movimientos-bancarios` | Diario por cuenta | `integration` |
| JOB-INT-22 | `int:leer-telemedicion` | Cron por sistema | `integration` |
| JOB-INT-23 | `int:recibir-cdr` | Cron o buzón por central | `integration` (recibe y publica EVT-INT-16; M10 parsea con JOB-TEC-09; §12.9) |
| JOB-INT-24 | `int:importar-posiciones-gps` | Cada N min | `integration` (duplicado; §12.9) |
| JOB-INT-25 | `int:revalidar-padron` | Mensual (opcional) | `integration` (duplicado; §12.9) |
| JOB-INT-26 | `int:importar-padron-provincial` | Mensual; al publicarse | `integration` (duplicado; §12.9) |
| JOB-INT-27 | `int:vencer-intenciones` | Cada hora | `maintenance` (duplicado; §12.9) |
| JOB-INT-28 | `int:consumo-mensual` | Mensual | `batch` |

#### T07 MIG

| ID | Nombre | Disparo | Cola |
|---|---|---|---|
| JOB-MIG-01 | `mig:extraer-snapshot` | A demanda; delta diario | `batch` |
| JOB-MIG-02 | `mig:perfilar` | Tras snapshot | `batch` |
| JOB-MIG-03 | `mig:transformar` | Por corrida | `batch` |
| JOB-MIG-04 | `mig:validar` | Por corrida | `batch` |
| JOB-MIG-05 | `mig:cargar-dominio` | Por corrida | `batch` |
| JOB-MIG-06 | `mig:conciliar` | Tras carga | `batch` |
| JOB-MIG-07 | `mig:reprocesar` | A demanda | `batch` |
| JOB-MIG-08 | `mig:paralelo-simular` | Por ciclo | `batch` |
| JOB-MIG-09 | `mig:paralelo-comparar` | Tras simular e importar | `batch` |
| JOB-MIG-10 | `mig:sync-convivencia` | Según `coexistenceSyncs.schedule` | `integration` |
| JOB-MIG-11 | `mig:exportar-asientos-procoop` | Diario en convivencia E2 | `export` |
| JOB-MIG-12 | `mig:anonimizar` | A demanda | `batch` |
| JOB-MIG-13 | `mig:archivar-historico` | O11, tras corte | `batch` |
| JOB-MIG-14 | `mig:vencer-alias` | Diario | `maintenance` |
| JOB-MIG-15 | `mig:purgar-staging` | Diario | `maintenance` |
| JOB-MIG-16 | `mig:migrar-adjuntos` | Por corrida | `batch` (escribe en `documents` vía `wfl.documents.attach`) |

#### T08 NFR

T08 usa una cola `critical` para el antivirus. T11 la mapea a `interactive`.

| ID | Nombre | Disparo | Cola |
|---|---|---|---|
| JOB-NFR-01 | `nfr:informe-acceso` | Solicitud verificada | `export` |
| JOB-NFR-02 | `nfr:localizar-titular` | Solicitud verificada | `batch` |
| JOB-NFR-03 | `nfr:ejecutar-solicitud` | Aprobación | `events` |
| JOB-NFR-04 | `nfr:aplicar-conservacion` | Diario 03:00 | `maintenance` (convergencia con JOB-WFL-14; §12.9) |
| JOB-NFR-05 | `nfr:verificar-cadena-auditoria` | Diario 04:00 UTC | `maintenance` — Retirado. Ver JOB-IAM-05 (dueño) |
| JOB-NFR-06 | `nfr:verificar-invariantes` | Diario 05:00; a demanda | `maintenance` |
| JOB-NFR-07 | `nfr:simulacro-restauracion` | Mensual (plataforma), trimestral (tenant) | `maintenance` |
| JOB-NFR-08 | `nfr:recifrar` | Tras rotación de clave | `maintenance` |
| JOB-NFR-09 | `nfr:vencimientos-credenciales` | Diario 08:00 | `maintenance` |
| JOB-NFR-10 | `nfr:escanear-patrones` | Semanal | `maintenance` |
| JOB-NFR-11 | `nfr:limpiar-exportaciones` | Cada hora | `maintenance` |
| JOB-NFR-12 | `nfr:antivirus-analizar` | Por archivo subido | `critical` → `interactive` (duplicado con JOB-PLA-21; §12.9) — Retirado. Ver JOB-PLA-21 (dueño) |
| JOB-NFR-13 | `nfr:actualizar-firmas-av` | Cada 6 h | `maintenance` |
| JOB-NFR-14 | `nfr:destruir-tenant` | EVT-PLA-05 + plazo | `maintenance` |
| JOB-NFR-15 | `nfr:reaplicar-supresiones` | Tras cada restauración | `maintenance` |
| JOB-NFR-16 | `nfr:agregar-csp` | Cada 5 min | `maintenance` |
| JOB-NFR-17 | `nfr:informe-sla` | Mensual, día 1 | `export` |
| JOB-NFR-18 | `nfr:inventario-backups` | Cada hora | `maintenance` |
| JOB-NFR-19 | `nfr:conciliar-tras-restauracion` | Tras restauración selectiva | `integration` (convergencia con JOB-PLA-12; §12.9) — Retirado. Ver JOB-PLA-12 (dueño) |
| JOB-NFR-20 | `nfr:evaluar-slo` | Cada 60 s | `maintenance` |
| JOB-NFR-21 | `nfr:medir-consumo` | Cada hora; cierre mensual | `maintenance` (convergencia con JOB-PLA-05; §12.9) — Reacción a EVT-PLA-10. Ver JOB-PLA-05 (dueño) |
| JOB-NFR-22 | `nfr:informe-accesos-sensibles` | Mensual | `export` |
| JOB-NFR-23 | `nfr:anonimizar-dataset-bi` | Al publicar cubo certificado; diario | `batch` |
| JOB-NFR-24 | `nfr:escaneo-configuracion` | Semanal | `maintenance` |
| JOB-NFR-25 | `nfr:verificar-referencias` | Diario 01:00 hora del tenant y bajo demanda | `maintenance` (10-11-2026, DEC-100; T08 RNF-NFR-260): solo lectura, checkpoint por colección, emite EVT-NFR-18 |

#### T09 COM

| ID | Nombre | Disparo | Cola |
|---|---|---|---|
| JOB-COM-01 | `com:publicar-programadas` | Cada minuto | `maintenance` |
| JOB-COM-02 | `com:expirar-publicaciones` | Cada 5 min | `maintenance` |
| JOB-COM-03 | `com:generar-boletines` | Cada 15 min | `batch` |
| JOB-COM-04 | `com:enviar-boletin` | A demanda (aprobado por T11) | `notifications` |
| JOB-COM-05 | `com:vencer-sanciones` | Cada hora | `maintenance` |
| JOB-COM-06 | `com:recordatorios-encuestas` | Cada hora | `notifications` |
| JOB-COM-07 | `com:cerrar-encuestas` | Cada 15 min | `maintenance` |
| JOB-COM-08 | `com:encuestas-periodicas` | Diario 03:00 | `batch` |
| JOB-COM-09 | `com:eventos` | Cada 15 min | `notifications` |
| JOB-COM-10 | `com:beneficios` | Diario 02:00 | `maintenance` |
| JOB-COM-11 | `com:saludos` | Diario a la hora configurada | `notifications` |
| JOB-COM-12 | `com:vencer-mensajes` | Cada 10 min | `notifications` |
| JOB-COM-13 | `com:recordatorios-agenda` | Cada 15 min | `notifications` (convergencia con JOB-CRM-15 y JOB-TEC-08; §12.9) |
| JOB-COM-14 | `com:sincronizar-plantillas-whatsapp` | Cada 6 h; a demanda | `integration` |
| JOB-COM-15 | `com:ejecutar-campanas` | Cada minuto | `notifications` |
| JOB-COM-16 | `com:recordatorios-vencimiento` | Diario 08:00 | `notifications` |
| JOB-COM-17 | `com:constancias` | Cada 5 min | `batch` (render con JOB-WFL-11) |
| JOB-COM-18 | `com:purgar-bandeja` | Diario 04:00 | `maintenance` |
| JOB-COM-19 | `com:retencion` | Diario 04:30 | `maintenance` |
| JOB-COM-20 | `com:metricas` | Cada 5 min | `batch` |
| JOB-COM-21 | `com:segmentos-dinamicos` | Diario 01:00 | `batch` |
| JOB-COM-22 | `com:inteligencia-encuestas` | Cada 24 h o cada 15 respuestas | `ai` |
| JOB-COM-23 | `com:salud-canales` | Cada 5 min | `maintenance` |
| JOB-COM-24 | `com:moderar-comentario` | Por comentario | `ai` |
| JOB-COM-34 | `com:generar-comunicaciones` | Por evento (antes citado como `com:consumir-eventos`) | `events` |
| JOB-COM-35 | `com:despachar` | Continuo, cola por canal (antes citado como `com:enviar-mensajes`) | `notifications` |
| JOB-COM-36 | `com:reintentar` | Cada minuto | `notifications` |
| JOB-COM-37 | `com:verificar-hitos` | Cada 15 min | `maintenance` |
| JOB-COM-38 | `com:notificar-publicacion` | Por evento | `notifications` |
| JOB-COM-39 | `com:informe-encuesta` | Según `reportSchedule` | `notifications` |
| JOB-COM-40 | `com:evaluar-audiencia` | A pedido | `batch` |
| JOB-COM-41 | `com:avisos-interrupcion` | Cada 5 min | `notifications` |

T09 no usa JOB-COM-25 a JOB-COM-33, para no confundirlos con la numeración de borrador; la equivalencia está en T09 §9.12 (HUE-SRV-06).

#### T10 BIA

| ID | Nombre | Disparo | Cola |
|---|---|---|---|
| JOB-BIA-01 | `bia:ejecutar-reporte` | A demanda | `export` |
| JOB-BIA-02 | `bia:generar-exportacion` | A demanda | `export` |
| JOB-BIA-03 | `bia:programador` | Cada minuto | `maintenance` (usa `jobSchedules` de T11 para el cron por tenant) |
| JOB-BIA-04 | `bia:entregar-reporte` | A demanda | `notifications` |
| JOB-BIA-05 | `bia:purgar-exportaciones` | Diario 03:00 | `maintenance` |
| JOB-BIA-06 | `bia:snapshot-indicadores` | Diario 02:00 | `batch` |
| JOB-BIA-07 | `bia:cierre-mensual-indicadores` | Mensual, día hábil PRM-BIA-028 | `batch` |
| JOB-BIA-08 | `bia:evaluar-alertas` | Cada 15 min y tras snapshot | `batch` |
| JOB-BIA-09 | `bia:proyectar-<dominio>` | Continuo | `events` |
| JOB-BIA-10 | `bia:snapshot-saldos` | Diario 01:30 | `batch` |
| JOB-BIA-11 | `bia:reconciliar-bi` | Diario 05:00 | `batch` |
| JOB-BIA-12 | `bia:reconstruir-proyeccion` | Manual | `maintenance` |
| JOB-BIA-13 | `bia:analisis-ia-auto` | Cada PRM-BIA-034 h por sala con cambios | `ai` |
| JOB-BIA-14 | `bia:despachar-eventos-publicos` | Continuo | `events` |
| JOB-BIA-15 | `bia:entregar-webhook` | Por entrega | `integration` |
| JOB-BIA-16 | `bia:expirar-credenciales` | Cada hora | `maintenance` |
| JOB-BIA-17 | `bia:agregar-uso-api` | Horario y diario | `batch` |
| JOB-BIA-18 | `bia:benchmark-agregar` | Mensual, día 10 | `batch` |
| JOB-BIA-19 | `bia:publicar-datos-abiertos` | Según publicación | `export` |
| JOB-BIA-20 | `bia:exportacion-masiva` | A demanda | `export` |
| JOB-BIA-21 | `bia:exportacion-salida` | A demanda (T01) | `export` |
| JOB-BIA-22 | `bia:verificar-frescura` | Cada 5 min | `maintenance` |

### 12.9 Jobs duplicados o convergentes

En la consolidación aparecieron jobs que hacen lo mismo en más de un anexo. Si los dos corren, producen avisos o efectos dobles. T11 propone un dueño único; el resto se elimina o pasa a ser un consumidor del evento del dueño (CTR-WFL-07, PA-WFL-19).

| Función | Jobs | Dueño propuesto | Tratamiento del resto |
|---|---|---|---|
| Vencer accesos de soporte | JOB-PLA-04, JOB-IAM-02 | T02 (JOB-IAM-02): revoca sesiones | Aplicado: JOB-PLA-04 reacciona a EVT-IAM-11 y emite EVT-PLA-12 `expired` |
| Mayoría de edad de adherentes | JOB-PER-05, JOB-CAT-07, JOB-SOC-01 | M18 (JOB-SOC-01; T12 HUECO-TRV-01) | Aplicado: JOB-PER-05 y JOB-CAT-07 marcados "Reemplazado por JOB-SOC-01" |
| Fin de suspensión voluntaria | JOB-CAT-08, JOB-MOR-08 | M02 (el contrato es suyo) | Aplicado: JOB-CAT-08 vence y publica EVT-CAT-12; JOB-MOR-08 es consumidor |
| Devoluciones de equipos vencidas | JOB-CAT-09, JOB-STK-05 | M13 (dueño de asignaciones de equipos) | Aplicado: JOB-CAT-09 reacciona a EVT-STK-07 |
| Parámetros de ARCA | JOB-FIS-17, JOB-INT-18 | T06 (JOB-INT-18) transporta | Aplicado: JOB-FIS-17 reacciona a EVT-INT-06 |
| Padrones fiscales | JOB-FIS-08, JOB-CFG-08, JOB-INT-26; JOB-PER-10, JOB-FIS-19, JOB-INT-25 | T04 (JOB-CFG-08) guarda el padrón; T06 lo descarga; M06 (JOB-FIS-19) revalida condición | Aplicado: JOB-FIS-08 y JOB-PER-10 retirados; JOB-INT-25/26 quedan como transporte |
| Importación de CDR | JOB-TEC-09, JOB-INT-23 | T06 recibe (JOB-INT-23 `int:recibir-cdr`, EVT-INT-16); M10 parsea y atribuye (JOB-TEC-09) | Aplicado: JOB-INT-23 renombrado `int:recibir-cdr` (recibe); M10 parsea y atribuye |
| Vencer intenciones de pago | JOB-COB-12, JOB-INT-27 | M07 (estado de negocio) | Aplicado: JOB-INT-27 solo limpia su bitácora técnica |
| Geocodificación | JOB-PER-02, JOB-TEC-10, JOB-CFG-09 | T04 (JOB-CFG-09; cuota única) | Aplicado: JOB-PER-02 y JOB-TEC-10 reaccionan a EVT-CFG-15 |
| Recategorización | JOB-TAR-05, JOB-FAC-10 | M04 propone; M02 aplica; M05 solo factura | Aplicado: JOB-FAC-10 limitado a la simulación |
| Fin de promociones | JOB-TAR-11, JOB-CAT-10 | M04 (JOB-TAR-11; publica EVT-TAR-012) | Aplicado: JOB-CAT-10 reacciona a EVT-TAR-012 |
| Posiciones GPS | JOB-SOC-08, JOB-INT-24 | T06 recibe (EVT-INT-17); M18 resume | Aplicado: JOB-SOC-08 es consumidor de EVT-INT-17 |
| Webhooks de pagos | JOB-COB-04, JOB-INT-03 | En capas: T06 valida firma y deduplica; M07 aplica | Sin cambio |
| Antivirus | JOB-PLA-21, JOB-NFR-12 | T01 (JOB-PLA-21) ejecuta; T08 fija la política | Aplicado: JOB-NFR-12 retirado |
| Firma de recibos | JOB-SUE-04/06/19, JOB-WFL-17/18/09 | T11 | Aplicado (DEC-078): JOB-SUE-04 solo pide la firma a T11; JOB-SUE-06 y JOB-SUE-19 retirados (CTR-WFL-12) |
| SLA | JOB-CRM-01, JOB-WFL-04, JOB-PLA-22 | T11 para casos y trámites del tenant; T01 para soporte de plataforma | Aplicado: JOB-CRM-01 reacciona a EVT-WFL-020/021 (PA-WFL-12) |
| Retención | JOB-NFR-04, JOB-WFL-14, JOB-COM-19 | T08 fija la política; T11 aplica a documentos; T09 a comunicaciones | Sin solapamiento si cada uno se limita a sus colecciones |
| Recordatorios de agenda | JOB-COM-13, JOB-CRM-15, JOB-TEC-08 | T09 (JOB-COM-13) envía | Aplicado: JOB-CRM-15 solo marca ausencias; JOB-TEC-08 retirado |
| Plantillas de WhatsApp | JOB-CRM-18, JOB-COM-14 | T09 | Aplicado: JOB-CRM-18 retirado |
| Conciliación tras restauración | JOB-PLA-12, JOB-NFR-19 | T01 (JOB-PLA-12) | Aplicado: JOB-NFR-19 retirado |
| Medición de uso | JOB-PLA-05, JOB-NFR-21 | T01 | Aplicado: JOB-NFR-21 reacciona a EVT-PLA-10 |
| Integridad de auditoría | JOB-IAM-05, JOB-NFR-05 | T02 | Aplicado: JOB-NFR-05 retirado |
| Reintento de eventos consumidos | JOB-TES-14, `deadLetters` de T01 | T01 + bandeja operativa de T11 | Aplicado: JOB-TES-14 retirado |

### 12.10 Totales del catálogo

| Concepto | Cantidad |
|---|---|
| IDs de eventos de M01–M19 | 451 (10-11-2026, última ronda de DEC-095: suma EVT-FIS-26; antes 450. 10-11-2026, decisiones DEC-095, DEC-099 y DEC-107: suma EVT-PER-27, EVT-FAC-22, EVT-FAC-23 y EVT-INS-22; antes 446. 5-11-2026, pendientes de la sincronización: suma EVT-PER-26, EVT-MED-30, EVT-FIS-25, EVT-COB-28 a 30, EVT-TES-24 y 25 y EVT-SUE-28; antes 437. Antes 436; suma EVT-TEC-38. Antes 428; el pase de huecos de nov-2026 suma EVT-CAT-28, EVT-MOR-21, EVT-TEC-35 a 37, EVT-CMP-16 y 17; el cierre del 5-11-2026 suma EVT-FIS-24) |
| IDs de eventos de T01, T02, T03, T04, T06, T07, T08, T09, T10 | 176 (10-11-2026, DEC-100 y DEC-103: MIG pasa a 10 con EVT-MIG-10 y NFR a 18 con EVT-NFR-18; antes 174. 5-11-2026, pendientes de la sincronización: COM pasa a 40 con EVT-COM-40; antes 173. Antes 172; PLA 22, IAM 16, UXD 8, CFG 20, INT 24 (suma EVT-INT-24), MIG 9, NFR 17, COM 39, BIA 18; CFG suma EVT-CFG-19 y 20; PLA conserva EVT-PLA-21 como reemplazado) |
| IDs de eventos propios de T11 | 48 |
| **Total de IDs EVT** | **675** (10-11-2026, suma EVT-FIS-26; antes 674; antes 668; antes 658; antes 656; antes 653) |
| Filas de conciliación en §12.4 | 214, una por canónico (5-11-2026, pendientes de la sincronización: suma los 10 alias con guion de EVT-PER-26, EVT-MED-30, EVT-FIS-25, EVT-COB-28 a 30, EVT-TES-24 y 25, EVT-SUE-28 y EVT-COM-40, PA-WFL-24; antes 204. 5-11-2026, sincronización posterior a los residuales: suma el alias `stk.item.below-minimum` → EVT-STK-12, PA-WFL-24; antes 203. 5-11-2026, residuales: se agregan 35 alias de eventos renombrados por INC-06-11 y 25 filas quedan como "retirado como alias" para que cada alias tenga un solo canónico; antes 168. 5-11-2026; antes 84, cifra que no coincidía con las 83 filas que tenía la tabla: se separaron las filas con varios canónicos, se movió a esta tabla la fila `com.message.*` que estaba en la de alias de campos y se agregó `cat.serviceContract.terminated`). Incluye el alias `pla.branch.*` → EVT-CFG-20; las 12 brechas tienen productor declarado. Más 9 alias de campos de payload (antes 8; suma `instanceId` → `workflowInstanceId`) |
| Jobs de M01–M19 | 297 (antes 291; suma JOB-CAT-13, JOB-TAR-14, JOB-TEC-17, JOB-CMP-09 y 10, JOB-CON-23) |
| Jobs de T01, T02, T03, T04, T06, T07, T08, T09, T10 | 178 (10-11-2026, DEC-100: NFR pasa a 25 con JOB-NFR-25; antes 177. PLA 22, IAM 12, UXD 7, CFG 14, INT 28, MIG 16, NFR 25, COM 32, BIA 22; COM suma JOB-COM-34 a 41) |
| Jobs propios de T11 | 32 |
| **Total de IDs JOB** | **507** (10-11-2026; antes 506; antes 492) |
| Grupos de jobs duplicados o convergentes | 22 |

## 13. Integraciones

T11 no habla directamente con sistemas externos: usa los conectores de T06 y los servicios técnicos de T01 (DEC-003, AGR-016).

| ID | Contraparte | Dirección | Qué intercambia | Mecanismo | Ante falla | Ola |
|---|---|---|---|---|---|---|
| INT-WFL-01 | T01: bus y outbox | Ambas | Publicación y entrega de eventos, `deadLetters`, `jobRuns`, `idempotencyKeys` | `core/events`, `core/jobs` (JOB-PLA-01) | Reintento PRM-PLA-027; `deadLetters` + bandeja operativa (RN-WFL-004) | O0 |
| INT-WFL-02 | T01: almacenamiento S3 privado | Salida | Objetos de `documentVersions` con clave `tenants/<tenantId>/wfl/...`; URLs firmadas de PRM-PLA-020 s | `core/storage` | La versión queda `uploading` y se reintenta; sin objeto confirmado no se acepta | O0 |
| INT-WFL-03 | T01 y T08: antivirus | Ambas | Resultado del escaneo (JOB-PLA-21) | Evento interno; `nfr.file.infected` | Versión `quarantined`, nunca `available`; aviso a quien subió | O0 |
| INT-WFL-04 | T02: autorización | Entrada | `authorize()`, capabilities, alcance por sucursal o área, separación de funciones, `authorizationRequests` | Llamada en proceso | Sin respuesta, se deniega (falla cerrada) | O0 |
| INT-WFL-05 | T02: auditoría | Salida | Decisiones, publicaciones de definiciones, descargas, purgas, cambios de programación | `auditLog` | Transacción; sin auditoría no hay cambio | O0 |
| INT-WFL-06 | T03: diccionario y marca | Entrada | Etiquetas `dict:` de formularios, plantillas y estados; logos y colores | Paquete de diccionario; EVT-UXD-01/04 | Se usa la versión anterior del paquete | O0 |
| INT-WFL-07 | T04: configuración | Entrada | Calendarios y feriados (EVT-CFG-11), campos personalizados (EVT-CFG-16), parámetros PRM-WFL, versiones de configuración que requieren aprobación (EVT-CFG-02) | API interna + eventos | Sin calendario, se usan días corridos y se marca el temporizador como "aproximado" | O0 |
| INT-WFL-08 | T06: firma digital | Ambas | Envío del PDF, posición de firma, estado, documento firmado (EVT-INT-18) | Conector de firma (proveedor licenciado, PA-WFL-06) | Firma `pendingProvider`; JOB-WFL-18 consulta; tras PRM-WFL-049 días vence | O8 |
| INT-WFL-09 | T06: sello de tiempo | Salida | Huella SHA-256 del documento firmado | Conector TSA (si el proveedor no lo incluye) | Firma válida sin sello; el sello se agrega al recuperarse | O8 |
| INT-WFL-10 | T06: validación contra fuentes oficiales | Salida | Datos de identidad para comparar (RF-WFL-094) | Conector configurado por tenant | El paso queda `needsManualCheck` (no bloquea en silencio) | O2 |
| INT-WFL-11 | T08: privacidad y retención | Entrada | Política de retención, legal holds, supresión (EVT-NFR-06/07) | Eventos | Sin política confirmada, no se purga (RN-WFL-064) | O1 |
| INT-WFL-12 | T09: notificaciones | Salida | Tipos `wfl.*` (§13.1) con variables y destinatarios | `com.notify()` (T09 §11.7; capability `com.communications.emit`) | T09 aplica sus reintentos y su alternativa; T11 no reenvía | O1 |
| INT-WFL-13 | T09: firma electrónica por OTP | Ambas | Envío del código (SMS, email o WhatsApp) y entrega (EVT-COM-27) | `com.notify()` + evento | El firmante puede pedir otro código; tras PRM-WFL-059 intentos se bloquea | O1 |
| INT-WFL-14 | T10: reportes y eventos públicos | Salida | Proyecciones de bandeja, SLA, operaciones y documentos; tipos `public` del catálogo | Proyección (JOB-BIA-09); despacho de webhooks (JOB-BIA-14/15) | T10 reintenta; T11 no participa en la entrega | O2 / O11 |
| INT-WFL-15 | T07: migración | Entrada | Definiciones de estados de ProCoop, trámites, expedientes, adjuntos, plantillas y secuencias | JOB-WFL-24, JOB-MIG-16 | Por lote, reanudable; diferencias en la bandeja de migración | O11 |
| INT-WFL-16 | M19: portal | Ambas | Catálogo de trámites, formularios, estado público, documentos visibles, firma del socio | API pública de T11 vía M19 | Borradores conservados PRM-WFL-024 días | O2 |
| INT-WFL-17 | PWA de campo (M10) | Ambas | Conformidades firmadas sin conexión, fotos y adjuntos con `clientMutationId` | `/field/sync` de M10 → `wfl.documents.attach` | Conflictos a la bandeja (EVT-TEC-29) | O3 |

### 13.1 Tipos de notificación que T11 entrega a T09

| Código | Disparo | Destinatario | Canal por defecto |
|---|---|---|---|
| `wfl.approval.pending` | EVT-WFL-008 | Aprobadores del paso | In-app + push; email si PRM-WFL-023 lo indica |
| `wfl.approval.reminder` | 50 % del plazo del paso | Aprobadores pendientes | In-app + email |
| `wfl.approval.decided` | EVT-WFL-010 | Solicitante | In-app |
| `wfl.approval.escalated` | EVT-WFL-011 | Supervisor o aprobador alternativo | In-app + email |
| `wfl.operation.failed` | EVT-WFL-005 | Rol responsable del tipo | In-app + email |
| `wfl.task.assigned` | EVT-WFL-024 | Asignado | In-app + push |
| `wfl.task.dueSoon` | JOB-WFL-09 | Asignado | In-app |
| `wfl.task.overdue` | EVT-WFL-026 | Asignado y supervisor | In-app + email |
| `wfl.mention` | Comentario con mención | Mencionado | In-app + push |
| `wfl.sla.warning` / `wfl.sla.breached` | EVT-WFL-020/021 | Responsable / supervisor | In-app + email |
| `wfl.procedure.received` | EVT-WFL-014 (canal portal) | Socio | Email + in-app del portal, con la constancia TPL-CRM-02 |
| `wfl.procedure.statusChanged` | EVT-WFL-015 (nodo notificable) | Socio | Según preferencias (T09) |
| `wfl.procedure.observed` | Nodo de observación | Socio | Email + push |
| `wfl.signature.requested` | EVT-WFL-041 | Firmante | Email o SMS con enlace |
| `wfl.signature.otp` | Pedido de firma electrónica | Firmante | SMS, email o WhatsApp según el perfil |
| `wfl.signature.completed` | EVT-WFL-042 | Solicitante y firmantes | Email con el documento firmado (enlace de PRM-WFL-045 días) |
| `wfl.document.expiring` | EVT-WFL-033 | Dueño del sujeto y responsable del tipo | Email |
| `wfl.delegation.activated` | EVT-WFL-013 | Delegado y delegante | In-app + email |
| `wfl.bulkRun.finished` | EVT-WFL-048 | Solicitante | In-app |
| `wfl.sequence.threshold` | EVT-WFL-040 | T-ADM | Email |
| `wfl.deskEntry.receipt` | Registro en la mesa de entradas | Presentante | Email con el acuse TPL-CRM-04 |

## 14. Parámetros de configuración

Todos los parámetros se publican en T04 con vigencia, alcance (plataforma, tenant, área o tipo) y auditoría. Los marcados **A validar** necesitan confirmación funcional o legal antes de pasar a producción.

| ID | Nombre | Tipo | Defecto | Alcance | Rango / valores | Estado |
|---|---|---|---|---|---|---|
| PRM-WFL-001 | Tamaño máximo del payload de un evento | int (KB) | 64 | Plataforma | 8–256 | Adoptado |
| PRM-WFL-002 | Retención de eventos entregados en `outboxEvents` | int (días) | 30 | Plataforma | 7–365 | Adoptado |
| PRM-WFL-003 | Convivencia de dos versiones de esquema | int (días) | 90 | Plataforma | 30–365 | Adoptado |
| PRM-WFL-004 | Reencolados por evento fuera de orden | int | 5 | Plataforma | 1–20 | Adoptado |
| PRM-WFL-005 | Rol responsable por defecto de la bandeja operativa | ref rol | `T-SOP` (plataforma), `T-ADM` (tenant) | Tenant | Roles de T02 | Adoptado |
| PRM-WFL-006 | Retención de `inboxReceipts` | int (días) | 30 | Plataforma | ≥ PRM-WFL-002 | Adoptado |
| PRM-WFL-007 | Tolerancia de disparo omitido | int (min) | 60 | Job | 0–1.440 | Adoptado |
| PRM-WFL-008 | Porcentaje de excepciones del mismo motivo que pausa una corrida | decimal (%) | 20 | Tipo de corrida | 1–100 | Adoptado |
| PRM-WFL-009 | Ítems de muestra para evaluar PRM-WFL-008 | int | 200 | Tipo de corrida | 50–5.000 | Adoptado |
| PRM-WFL-010 | Tamaño de bloque de las corridas masivas | int | 500 | Tipo de corrida | 50–5.000 | Adoptado |
| PRM-WFL-011 | Horas máximas entre aprobación y ejecución sin revalidar | int (h) | 24 | Tipo de operación | 1–720 | Adoptado |
| PRM-WFL-012 | Horas máximas de resolución automática de un incierto | int (h) | 48 | Tipo de operación | 1–168 | Adoptado |
| PRM-WFL-013 | Ítems máximos dentro de una operación de lote | int | 1.000 | Plataforma | 10–10.000 | Adoptado |
| PRM-WFL-014 | Intentos por paso de operación | int | 10 | Tipo de operación | 1–50 | Adoptado |
| PRM-WFL-015 | Plazo por defecto para decidir una operación | int (h) | 72 | Tipo de operación | 1–720 | Adoptado |
| PRM-WFL-016 | Zona horaria por defecto de programaciones | string IANA | `America/Argentina/Cordoba` | Tenant | IANA | Adoptado |
| PRM-WFL-017 | Ventana nocturna para jobs `batch` del tenant | rango horario | 22:00–06:00 | Tenant | Ventana de plataforma | Adoptado |
| PRM-WFL-020 | Tipo de días por defecto del SLA | enum | `business` | Tenant / política | `business`, `calendar` | A validar (PA-WFL-10) |
| PRM-WFL-021 | Umbral de aviso del SLA | decimal (%) | 75 | Política | 10–99 | Adoptado |
| PRM-WFL-022 | Reparto por defecto de tareas de grupo | enum | `queue` | Área | `queue`, `roundRobin`, `leastLoaded` | Adoptado |
| PRM-WFL-023 | Canales de aviso de aprobaciones | enum[] | `inApp`, `push` | Tenant | `inApp`, `push`, `email` | Adoptado |
| PRM-WFL-024 | Vida de un borrador de trámite | int (días) | 30 | Definición | 1–180 | Adoptado |
| PRM-WFL-025 | Horas sin asignar antes de escalar una tarea de grupo | int (h) | 24 | Área | 1–168 | Adoptado |
| PRM-WFL-026 | Días para reabrir una tarea completada | int (días) | 7 | Tipo de tarea | 0–90 | Adoptado |
| PRM-WFL-027 | Niveles máximos de una política de aprobación | int | 5 | Plataforma | 1–10 | Adoptado |
| PRM-WFL-028 | Acción por defecto al vencer un paso de aprobación | enum | `escalate` | Política | `escalate`, `addApprover`, `expire`, `notifyOnly` | A validar (PA-WFL-09) |
| PRM-WFL-029 | Importe de referencia para tramos | enum | `gross` | Tipo de operación | `gross`, `net` | A validar (PA-WFL-21) |
| PRM-WFL-030 | La publicación de definiciones y políticas requiere aprobación | bool | `true` | Tenant | — | Adoptado |
| PRM-WFL-031 | Duración máxima de una delegación | int (días) | 90 | Tenant | 1–365 | A validar (PA-WFL-08) |
| PRM-WFL-032 | Cotización para convertir tramos en moneda extranjera | enum | `bnaSeller` | Tenant | Series de EVT-TES-19 | Adoptado |
| PRM-WFL-033 | Comité: quórum por defecto | decimal (%) | 51 | Política | 1–100 | Adoptado |
| PRM-WFL-040 | La purga física requiere aprobación | bool | `true` | Plataforma | No desactivable por el tenant | Adoptado |
| PRM-WFL-041 | Retención por defecto de un tipo documental sin política | enum | `keepForever` | Plataforma | `keepForever` (hasta confirmación legal) | A validar (PA-WFL-03) |
| PRM-WFL-042 | Días para restaurar un documento anulado | int (días) | 30 | Tenant | 0–365 | Adoptado |
| PRM-WFL-043 | Días en "pendientes de purga" | int (días) | 30 | Tenant | 7–180 | Adoptado |
| PRM-WFL-044 | Tamaño máximo por archivo | int (MB) | 25 | Tenant / tipo | 1–200 (tope de licencia de T01) | Adoptado |
| PRM-WFL-045 | Vida máxima de un enlace compartido | int (días) | 30 | Tenant | 1–90 | Adoptado |
| PRM-WFL-046 | Retención de `documentAccessLogs` | int (días) | 730 | Tenant | 365–3.650 | A validar (PA-WFL-03) |
| PRM-WFL-047 | Tipos MIME admitidos | string[] | PDF, JPG, PNG, HEIC, DOCX, XLSX, CSV, TXT, XML, ZIP firmado | Tenant / tipo | Subconjunto de la lista de plataforma | Adoptado |
| PRM-WFL-048 | Nivel de firma por defecto de cada tipo | enum | Según §18.5 | Tipo documental | `simple`, `electronic`, `digital` | A validar (PA-WFL-06) |
| PRM-WFL-049 | Vencimiento de una solicitud de firma | int (días) | 15 | Perfil | 1–90 | Adoptado |
| PRM-WFL-050 | Días para archivar un expediente cerrado | int (días) | 365 | Tipo de expediente | 30–3.650 | Adoptado |
| PRM-WFL-051 | Dispersión de fan-out de jobs de plataforma | int (min) | 30 | Plataforma | 0–180 | Adoptado |
| PRM-WFL-052 | Retención de `jobRuns` y `bulkRunItems` | int (días) | 90 | Plataforma | 30–730 | Adoptado |
| PRM-WFL-053 | Umbral de alerta de secuencia | decimal (%) | 80 | Secuencia | 50–99 | Adoptado |
| PRM-WFL-054 | Tiempo máximo de un render | int (s) | 60 | Plataforma | 10–300 | Adoptado |
| PRM-WFL-055 | Páginas máximas por documento renderizado | int | 200 | Plataforma | 1–2.000 | Adoptado |
| PRM-WFL-056 | Horizonte de proyección de la agenda | int (días) | 90 | Tenant | 30–365 | Adoptado |
| PRM-WFL-057 | Feed iCal habilitado | bool | `false` | Tenant | — | A validar (PA-WFL-16) |
| PRM-WFL-058 | Antigüedad máxima de un replay | int (días) | 30 | Plataforma | 1–PRM-WFL-002 | Adoptado |
| PRM-WFL-059 | Intentos de código OTP de firma | int | 3 | Perfil | 1–10 | Adoptado |
| PRM-WFL-060 | Vigencia de un código OTP de firma | int (min) | 10 | Perfil | 2–60 | Adoptado |
| PRM-WFL-061 | El replay requiere aprobación de T-SOP | bool | `true` | Plataforma | — | Adoptado |
| PRM-WFL-062 | Máximo de ítems visibles por página de la bandeja | int | 50 | Usuario | 10–200 | Adoptado |
| PRM-WFL-063 | Huecos admitidos en secuencias de tareas y operaciones | enum | `allowGaps` | Secuencia | `gapless`, `allowGaps` | A validar (PA-WFL-13) |

## 15. Reportes, indicadores y exportaciones

Los reportes se publican en T10 sobre proyecciones de T11. La consulta respeta el alcance del usuario (sucursal, área) y los datos personales se enmascaran según la capability.

### 15.1 Reportes operativos

| ID | Reporte | Contenido | Filtros | Capability | Exporta |
|---|---|---|---|---|---|
| REP-WFL-01 | Pendientes por responsable | Ítems de bandeja por usuario y área, con antigüedad y vencidos | Área, tipo, módulo, prioridad, rango | `wfl.tareas.ver` + alcance de supervisor | XLSX, CSV |
| REP-WFL-02 | Aprobaciones por política | Solicitadas, aprobadas, rechazadas, vencidas, escaladas, tiempo medio por paso | Política, tramo, aprobador, período | `wfl.flujos.ver` | XLSX, PDF |
| REP-WFL-03 | Separación de funciones | Intentos bloqueados de autoaprobación, decisiones por delegación, excepciones SoD vigentes | Período, usuario, política | `iam.auditoria.ver` | XLSX |
| REP-WFL-04 | Operaciones por tipo y estado | Total, ejecutadas, fallidas, inciertas, revertidas, tiempo hasta ejecución | Tipo, módulo, período | `wfl.jobs.ver` | XLSX |
| REP-WFL-05 | Trámites por definición | Abiertos, por nodo, tiempo medio por nodo, rechazados, vencidos | Definición, versión, canal, período | `wfl.flujos.ver` | XLSX, PDF |
| REP-WFL-06 | Cumplimiento de SLA | Porcentaje en término por política, área y tipo; vencidos por motivo | Política, área, período | `wfl.flujos.ver` | XLSX, PDF |
| REP-WFL-07 | Corridas masivas | Universo, procesados, excepciones por motivo, pausas, duración | Módulo, tipo, período | `wfl.jobs.ver` | XLSX |
| REP-WFL-08 | Salud del bus y de los jobs | Eventos pendientes, `deadLetters`, latencia por consumidor, jobs fallidos y en espera por cola | Cola, tipo, tenant (plataforma) | `wfl.eventos.ver`, `wfl.jobs.ver` | CSV |
| REP-WFL-09 | Documentos por tipo | Cantidad, tamaño, vencidos, por vencer, sin clasificar, en cuarentena | Tipo, sujeto, período | `wfl.expedientes.ver` | XLSX |
| REP-WFL-10 | Accesos a documentos sensibles | Vistas y descargas de documentos `restricted`, `health` o `fiscal` | Usuario, tipo, período | `iam.auditoria.ver` | XLSX |
| REP-WFL-11 | Retención y purga | Pendientes de purga, purgados, bajo legal hold | Tipo, período | `wfl.documentos.purgar` | XLSX, PDF |
| REP-WFL-12 | Secuencias de numeración | Próximo número, uso, anulados, huecos detectados por secuencia | Secuencia, período | `wfl.numeracion.ver` | XLSX |
| REP-WFL-13 | Firmas | Solicitadas, firmadas, rechazadas, vencidas, por perfil y nivel | Perfil, período | `wfl.firmas.configurar` | XLSX |
| REP-WFL-14 | Mesa de entradas | Entradas por origen, área, estado y tiempo de respuesta; salidas | Área, período | `crm.mesaEntradas.ver` (M09) | XLSX, PDF |
| REP-WFL-15 | Libro de registro de entradas y salidas | Número, fecha, presentante, asunto, destino y respuesta, en orden correlativo | Período | `crm.mesaEntradas.ver` | PDF foliado |

### 15.2 Indicadores

| ID | Indicador | Fórmula | Meta orientativa |
|---|---|---|---|
| KPI-WFL-01 | Aprobaciones en término | Decididas antes del vencimiento / decididas | ≥ 90 % |
| KPI-WFL-02 | Tiempo medio de aprobación | Promedio de (`decidedAt` − `requestedAt`) en horas hábiles | ≤ 8 h |
| KPI-WFL-03 | Trámites en término | Cerrados dentro del SLA / cerrados | ≥ 85 % |
| KPI-WFL-04 | Antigüedad de la bandeja | Mediana de días de los pendientes abiertos | ≤ 3 días |
| KPI-WFL-05 | Operaciones inciertas abiertas | Cantidad en `uncertain` a fin del día | 0 con más de PRM-WFL-012 h |
| KPI-WFL-06 | Latencia del bus | Percentil 95 entre `recordedAt` y primer consumo | ≤ 5 s |
| KPI-WFL-07 | `deadLetters` abiertos | Cantidad no resuelta | 0 con más de 24 h |
| KPI-WFL-08 | Éxito de corridas masivas | Ítems `succeeded` / ítems del universo | ≥ 98 % |
| KPI-WFL-09 | Documentos sin clasificar | Documentos sin tipo / documentos subidos en el período | ≤ 2 % |
| KPI-WFL-10 | Firmas completas en término | Completas antes de vencer / solicitadas | ≥ 90 % |
| KPI-WFL-11 | Autoservicio | Trámites iniciados por portal / trámites iniciados | Tendencia creciente |

### 15.3 Exportaciones

Toda exportación va por la cola `export`, queda auditada y vence a los PRM-PLA-024 días. Los listados con datos personales exigen `wfl.documentos.descargar` o la capability de exportación del dominio. El expediente digital se exporta con el índice TPL-WFL-01 (P-WFL-12).

## 16. Casos de uso

### 16.1 Casos de uso de BASE cubiertos

| ID | Nombre | Actor | Resultado esperado | Requisitos |
|---|---|---|---|---|
| CU-26 (dueño T09) | Comunicar al asociado con constancia | Sistema, operador | T11 aporta el render de la constancia (JOB-COM-17 usa JOB-WFL-11), su guardado como documento del expediente con huella y la línea de tiempo; "notificado" solo se marca con el hito de EVT-COM-28 | RF-WFL-170..180, RF-WFL-211 |
| CU-27 (dueño M17) | Convocar y realizar la asamblea | Secretaría, consejo | Para ASM-DEMO-001, T11 aporta el expediente de la asamblea, la numeración de actas, la plantilla de convocatoria TPL-INS-03, el acta TPL-INS-04 con firma conjunta de presidente y secretario, y la agenda | RF-WFL-195..202, RF-WFL-212, EVT-INS-14..16 |
| CU-29 (dueño T02) | Operar con permisos y aprobación | Cajero, tesorera | USR-CAJ-01 no puede anular el recibo R-0001-00004567 de ARS 18.450,00 sin la aprobación de otra persona con MFA; T02 deniega la acción directa y T11 gestiona la aprobación | RF-WFL-040..051, RF-WFL-110..124, P-WFL-04 |
| BASE §26 (tareas) | Tarea recurrente con evidencia | Supervisor, empleado | La tarea TAR-001 "Revisar padrón de tarifa social" se genera cada mes y no se completa sin el informe adjunto | RF-WFL-138, JOB-WFL-10, P-WFL-07 |
| CU-GOB-01 (dueño T11) | Cambio de configuración aprobado | Administrador, aprobador | Una versión de configuración de T04 no se publica sin aprobación y queda auditada | RF-WFL-110, EVT-CFG-02, EVT-WFL-016 |
| CU-ARQ-01 (dueño T11; decisión del coordinador del 5-11-2026: T01 renumera el suyo) | Reintento seguro | Sistema | Un doble envío o un reintento de un consumidor no duplica efectos | RF-WFL-008, RF-WFL-043, RN-WFL-004 |
| CU-LOT-01 (dueño M05) | Corrida masiva con excepciones | Operador | 98 de 100 ítems emitidos; 2 en excepciones asignadas; el reproceso no reemite. M05 define el caso; T11 aporta el motor de corridas (`bulkRuns`) y la bandeja de excepciones | RF-WFL-026, RN-WFL-008, P-WFL-03 |

### 16.2 Casos de uso nuevos

**CU-WFL-01 — Aprobar una orden de pago por monto con firma conjunta**

- **Actor:** tesorero (solicita), gerente y presidente (aprueban).
- **Precondiciones:** la política `tes.paymentExecution.execute` tiene tramos: hasta ARS 1.000.000, un paso T-TES; hasta ARS 5.000.000, T-TES + T-GER; más, T-GER + consejo con quórum.
- **Flujo principal:**
  1. El tesorero pide ejecutar la OP-2026-000210 de ARS 3.200.000.
  2. T11 resuelve el tramo 2 y crea dos pasos en serie.
  3. El gerente aprueba con MFA desde la bandeja.
  4. T11 emite EVT-WFL-010 `approved`.
  5. M14 ejecuta el pago y la OP queda firmada conjuntamente.
- **Alternativos:**
  - El gerente está de licencia y tiene una delegación vigente al subgerente con límite ARS 5.000.000: el subgerente decide "por delegación de".
  - El paso vence: se aplica PRM-WFL-028.
- **Excepciones:**
  - El tesorero intenta aprobar su propio pedido: 403 `wfl/sod-violation`.
  - El importe cambió después de la aprobación: la huella no coincide y se exige una aprobación nueva.
- **Postcondiciones:** quedan la decisión, la huella del pedido, la versión de la política y la auditoría.
- **Requisitos:** RF-WFL-110..124, RN-WFL-040..051.

**CU-WFL-02 — Reasignar pendientes de un empleado que se va**

- **Actor:** supervisor; sistema.
- **Flujo:**
  1. M16 emite EVT-SUE-03.
  2. JOB-WFL-29 detecta 7 tareas y 3 pasos de aprobación del empleado.
  3. Según la regla del área, los pasa al supervisor o a la cola del área y emite EVT-WFL-027.
  4. El supervisor recibe el aviso y redistribuye.
- **Excepción:** si no hay supervisor configurado, se crea un ítem en la bandeja operativa para T-ADM.
- **Requisitos:** P-WFL-15, RF-WFL-119.

**CU-WFL-03 — Trabajar la bandeja del día**

- **Actor:** agente de atención.
- **Flujo:**
  1. Abre PAN-WFL-01 y ve 2 vencidos, 5 de hoy y 3 de mañana.
  2. Toma una tarea de grupo y la deja asignada a su nombre.
  3. Aprueba, con comentario, el cambio de la regla BON-VAR-30 del 30 % al 20 % (CU-GOB-01).
  4. Pospone una tarea con motivo.
  5. Abre un caso de M09 desde la tarjeta y vuelve a la bandeja con el contador actualizado.
- **Excepción:** otro agente tomó la tarea un segundo antes: 409 `wfl/task-claimed` y la tarjeta se refresca.
- **Requisitos:** RF-WFL-130..139.

**CU-WFL-04 — Diseñar y publicar un trámite**

- **Actor:** administrador del tenant y aprobador.
- **Flujo:**
  1. Duplica la plantilla de plataforma `WF-CAT-CAMBIO-TITULAR`.
  2. Cambia el área responsable y el SLA a 5 días hábiles.
  3. Agrega un campo al formulario.
  4. Simula con datos ficticios.
  5. Envía a publicar. El aprobador aprueba y la versión 2 queda vigente desde el 01-12-2026.
  6. Las instancias abiertas siguen en la versión 1.
- **Excepción:** intenta quitar el paso obligatorio "verificar identidad": la validación lo impide (RF-WFL-076).
- **Requisitos:** RF-WFL-070..082, PAN-WFL-08..12.

**CU-WFL-05 — Generar y firmar recibos de sueldo**

- **Actor:** liquidador, empleador, empleado.
- **Flujo:**
  1. Se aprueba la liquidación.
  2. JOB-SUE-03 pide a JOB-WFL-12 el render de 85 recibos.
  3. JOB-WFL-17 envía el lote a la firma del empleador.
  4. Con la firma completa, cada empleado recibe el pedido de firma electrónica.
  5. El empleado firma con OTP y queda la evidencia.
- **Excepción:** 3 recibos vencen sin firma. JOB-WFL-19 los marca vencidos y M16 los informa como "no firmados".
- **Requisitos:** P-WFL-09, RF-WFL-195..202.

**CU-WFL-06 — Registrar una nota en la mesa de entradas y responderla**

- **Actor:** mesa de entradas (M09), área destino.
- **Flujo:**
  1. Ingresa la nota del ente regulador.
  2. M09 crea el caso `deskEntry`.
  3. T11 numera ME-2026-000045, abre el expediente, emite el acuse TPL-CRM-04 y la carátula TPL-WFL-02.
  4. El pase a Técnica genera una tarea con SLA de 10 días hábiles.
  5. La respuesta se numera como MS-2026-000019 y se vincula.
  6. El expediente se cierra.
- **Requisitos:** P-WFL-13, RF-WFL-210..222.

**CU-WFL-07 — Resolver una operación incierta**

- **Actor:** operador de soporte del tenant.
- **Flujo:**
  1. Un reintegro a una pasarela quedó `uncertain`.
  2. JOB-WFL-03 consulta durante 48 h sin respuesta.
  3. La bandeja operativa muestra el ítem.
  4. El operador verifica en el portal del proveedor, registra "resultado verificado: acreditado" con la captura como evidencia.
  5. T11 emite EVT-WFL-006.
  6. M07 completa el reintegro sin reenviarlo.
- **Requisitos:** RF-WFL-046, RN-WFL-022.

**CU-WFL-08 — Ver el expediente digital de una cuenta**

- **Actor:** agente; socio (vista limitada).
- **Flujo:**
  1. Abre la línea de tiempo de la cuenta 10234.
  2. Filtra por documentos y ve la constancia de CUIT, el contrato firmado y tres facturas.
  3. Descarga una factura (queda registrado en `documentAccessLogs`).
- **Vista del socio:** en el portal, el socio solo ve los tipos visibles.
- **Requisitos:** RF-WFL-210..215, RF-WFL-162.

**CU-WFL-09 — Programar un job del tenant**

- **Actor:** administrador del tenant.
- **Flujo:**
  1. Cambia `fac:programar-ciclos` de 02:00 a 03:30.
  2. T11 valida que está dentro de la ventana nocturna (PRM-WFL-017).
  3. Guarda y emite EVT-WFL-047.
- **Excepción:** programarlo a las 14:00 devuelve 422.
- **Requisitos:** RF-WFL-020..023.

**CU-WFL-10 — Reprocesar eventos fallidos**

- **Actor:** T-SOP.
- **Flujo:**
  1. Un consumidor de M15 falló 10 veces por configuración contable faltante y hay 34 eventos en `deadLetters`.
  2. Se corrige la configuración.
  3. T-SOP pide el replay de esos eventos para ese consumidor y T-ADM del tenant lo aprueba.
  4. JOB-WFL-22 los reentrega. Los consumidores idempotentes no duplican.
- **Requisitos:** RF-WFL-012, PRM-WFL-061.

**CU-WFL-11 — Delegar aprobaciones por vacaciones**

- **Actor:** gerente.
- **Flujo:**
  1. Crea una delegación del 05-01-2027 al 20-01-2027 para compras, con límite de ARS 2.000.000 y a favor del subgerente.
  2. JOB-WFL-28 la activa el día 5 y avisa a ambos.
  3. Los pasos nuevos se asignan al subgerente.
  4. El día 21 vuelve todo al gerente.
- **Excepción:** el subgerente no tiene la capability base, y la delegación se rechaza (RN-WFL-046).
- **Requisitos:** RF-WFL-118.

**CU-WFL-12 — Conformidad firmada en campo sin conexión**

- **Actor:** técnico, socio.
- **Flujo:**
  1. Al cerrar la OT, la PWA genera el acta TPL-TEC-02.
  2. El socio firma en pantalla y la PWA toma la geolocalización.
  3. Al sincronizar, T11 guarda la versión con huella y emite EVT-WFL-042 (nivel simple). M10 registra EVT-TEC-15.
- **Requisitos:** P-WFL-10.

## 17. Criterios de aceptación y escenarios de prueba

### 17.1 Funcionales

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| CA-WFL-01 | Una operación `cob.receipt.void` con política de un paso | El cajero la pide | Queda `pendingApproval`, aparece en la bandeja de T-TES y el recibo sigue vigente |
| CA-WFL-02 | La misma operación | La aprueba otra persona con MFA | Se ejecuta una sola vez; EVT-WFL-004 y `cob.receipt.voided` con el mismo `correlationId` |
| CA-WFL-03 | Política con tramos | Se pide por ARS 3.200.000 | Se crean los pasos del tramo 2, no los del 1 ni los del 3 |
| CA-WFL-04 | Un paso con SLA de 24 h hábiles | Pasan 18 h hábiles | EVT-WFL-020 y aviso al aprobador; a las 24 h, la acción de PRM-WFL-028 |
| CA-WFL-05 | Un trámite en versión 1 | Se publica la versión 2 | La instancia abierta sigue en la 1; las nuevas usan la 2 |
| CA-WFL-06 | Un formulario con campo CUIT obligatorio | Se envía con CUIT inválido | 422 con el error en el campo; no se crea `formSubmissions` |
| CA-WFL-07 | Una secuencia `gapless` | Dos emisiones concurrentes | Números consecutivos sin repetir ni saltar |
| CA-WFL-08 | Una secuencia `gapless` | La transacción que tomó el número falla | El número no se consume |
| CA-WFL-09 | Un documento con versión 1 | Se sube un archivo nuevo | Se crea la versión 2; la 1 se conserva |
| CA-WFL-10 | Un archivo infectado | Termina el escaneo | La versión queda `quarantined` y no se puede descargar |
| CA-WFL-11 | Una plantilla con variable obligatoria faltante | Se pide el render | `wfl/template-data-missing` con la variable; no se genera el PDF |
| CA-WFL-12 | Una firma conjunta de dos | Firma uno | El documento sigue `inSignature`; con el segundo, EVT-WFL-042 |
| CA-WFL-13 | Una tarea de grupo | Dos agentes la toman a la vez | Uno la obtiene; el otro recibe 409 |
| CA-WFL-14 | Un feriado agregado en T04 | Hay temporizadores abiertos | Los no vencidos recalculan su vencimiento |
| CA-WFL-15 | Una delegación vencida | El delegado intenta decidir | 403 `wfl/delegation-expired` |
| CA-WFL-16 | Un documento bajo legal hold | Llega su fecha de purga | No se purga y queda en el reporte REP-WFL-11 |
| CA-WFL-17 | El socio en "Mis documentos" | Existe una nota interna en su expediente | No la ve; la API pública no la devuelve |
| CA-WFL-18 | Un evento de M02 con alias consumido por M04 | Se publica `cat.contract.planChanged` | El consumidor suscripto a `cat.plan.changed` lo recibe mientras el alias está vigente |

### 17.2 Permisos negativos y aislamiento

| ID | Caso | Resultado |
|---|---|---|
| CA-WFL-30 | Un usuario de TEN-001 pide un documento de TEN-002 con el ID correcto | 404, sin revelar la existencia; auditado como intento cruzado |
| CA-WFL-31 | Un consumidor de eventos de TEN-001 recibe un evento con `tenantId` de TEN-002 | Rechazado por el middleware; alerta de seguridad |
| CA-WFL-32 | Un job de TEN-001 intenta leer `workItems` de TEN-002 | Falla por el filtro obligatorio de `tenantId` (prueba automática) |
| CA-WFL-33 | Un usuario sin `wfl.tareas.reasignar` intenta reasignar | 403 |
| CA-WFL-34 | Un usuario sin `wfl.documentos.descargar` pide la URL firmada | 403; sin URL generada |
| CA-WFL-35 | El solicitante intenta aprobar su propia operación con otra sesión | 403 `wfl/sod-violation` |
| CA-WFL-36 | Un aprobador de sucursal A decide un pedido de la sucursal B | 403 por alcance |
| CA-WFL-37 | Un enlace compartido revocado | 410 en ≤ 1 min |
| CA-WFL-38 | Un administrador del tenant intenta cambiar la cola de un job | 422; solo se permite hora y días |
| CA-WFL-39 | Soporte de plataforma sin acceso concedido consulta la bandeja de un tenant | 403 (T02 RF de acceso de soporte) |

### 17.3 Reintentos, concurrencia y conciliación

| ID | Caso | Resultado |
|---|---|---|
| CA-WFL-50 | El relay de outbox se cae después de publicar y antes de marcar | El evento se entrega otra vez; el consumidor lo ignora por `inboxReceipts` |
| CA-WFL-51 | Un consumidor falla 10 veces | El evento va a `deadLetters` y a la bandeja operativa si es `businessImpact` |
| CA-WFL-52 | Una corrida masiva se interrumpe en el ítem 4.500 de 10.000 | Al reanudar, sigue desde el último bloque confirmado; no repite ítems `succeeded` |
| CA-WFL-53 | 20 % de excepciones del mismo motivo en los primeros 200 ítems | La corrida se pausa con EVT-WFL-048 `paused` |
| CA-WFL-54 | Timeout al ejecutar un paso externo | El paso queda `uncertain`; no se reenvía sin consultar |
| CA-WFL-55 | Dos decisiones simultáneas sobre el mismo paso | Una gana; la otra recibe 409 y ve la decisión tomada |
| CA-WFL-56 | Eventos de un mismo agregado llegan desordenados | Se aplican en orden de `aggregateVersion` |
| CA-WFL-57 | Un tenant encola 50.000 trabajos `batch` | Los demás tenants mantienen su latencia (concurrencia por tenant de T01) |
| CA-WFL-58 | Restauración del tenant | JOB-WFL-08 reconstruye la bandeja y la agenda; los contadores coinciden con las fuentes |

### 17.4 Escenarios integrales del maestro

| Escenario | Aporte de T11 | Verificación |
|---|---|---|
| ESC-01 (timeout con ARCA o pasarela) | Paso `uncertain`, JOB-WFL-03, bandeja operativa | Ningún comprobante o pago duplicado |
| ESC-02 (evento duplicado) | `inboxReceipts`, idempotencia de consumidores | Un solo efecto contable y de cuenta corriente |
| ESC-03 (corrida masiva interrumpida) | `bulkRuns` reanudable, pausa por sospecha global | Universo congelado; totales conciliados |
| ESC-04 (restauración selectiva) | Reconstrucción de proyecciones, conciliación de operaciones abiertas | Ninguna operación aprobada se ejecuta dos veces |
| ESC-05 (cambio de configuración con aprobación) | Política de T04 por T11, auditoría | La configuración no rige antes de aprobada |

### 17.5 Códigos de error del módulo

| Código | HTTP | Significado |
|---|---|---|
| `wfl/sod-violation` | 403 | El usuario participó antes en la misma solicitud (solicitante, ejecutor o aprobador de otro paso) |
| `wfl/out-of-scope` | 403 | El pedido está fuera del alcance de sucursal o área del aprobador |
| `wfl/delegation-expired` | 403 | La delegación no está vigente |
| `wfl/step-already-decided` | 409 | El paso ya fue decidido |
| `wfl/task-claimed` | 409 | La tarea ya fue tomada por otra persona |
| `wfl/fingerprint-mismatch` | 409 | El pedido cambió después de aprobado; se necesita una aprobación nueva |
| `wfl/invalid-transition` | 409 | Transición no permitida desde el estado actual |
| `wfl/legal-hold` | 409 | El documento está bajo retención legal |
| `wfl/sequence-exhausted` | 409 | La secuencia llegó a su máximo |
| `wfl/form-invalid` | 422 | El formulario no valida (detalle por campo) |
| `wfl/mandatory-node` | 422 | La definición quita un nodo obligatorio del dominio |
| `wfl/schedule-window` | 422 | Programación fuera de la ventana permitida |
| `wfl/template-data-missing` | 422 | Falta una variable obligatoria del contrato de datos de la plantilla |
| `wfl/file-not-allowed` | 422 | Tipo o tamaño de archivo no admitido para el tipo documental |
| `wfl/quarantined` | 423 | La versión está en cuarentena por el antivirus |
| `wfl/otp-invalid` | 401 | Código OTP de firma inválido o vencido |
| `wfl/share-link-gone` | 410 | El enlace compartido venció o fue revocado |

## 18. Datos de precarga de demostración (ficticios)

Todos los datos son ficticios. No se usan personas, CUIT ni domicilios reales.

### 18.1 Tenants, usuarios y roles

| Tenant | Código | Usuarios de demostración |
|---|---|---|
| Cooperativa Demo Villa Ficticia | TEN-001 | USR-ADM-01 (T-ADM), USR-CAJ-01 (cajero, sucursal Centro), USR-TES-01 (tesorera), USR-GER-01 (gerente), USR-SGE-01 (subgerente), USR-ATE-01 y USR-ATE-02 (atención), USR-TEC-01 (técnico), USR-SEC-01 (secretaría institucional), USR-PRE-01 (presidente), USR-LIQ-01 (liquidador de sueldos) |
| Cooperativa Ejemplo Sur | TEN-002 | USR-ADM-B (T-ADM); se usa para las pruebas de aislamiento |

### 18.2 Tipos de operación y políticas de aprobación semilla

Los tipos de operación semilla están en §7.3. Las políticas de aprobación que se precargan son estas:

| Código de política | Tipo de operación | Tramos (ARS) | Pasos | SoD |
|---|---|---|---|---|
| POL-COB-ANULAR-RECIBO | `cob.receipt.void` | Hasta 50.000 / más | T-TES / T-TES + T-GER | Solicitante ≠ aprobador |
| POL-TES-EJECUTAR-PAGO | `tes.paymentExecution.execute` | Hasta 1.000.000 / hasta 5.000.000 / más | T-TES / T-TES + T-GER / T-GER + consejo (quórum PRM-WFL-033) | Firma conjunta; preparador ≠ aprobador |
| POL-CMP-APROBAR-OC | `cmp.purchaseOrder.approve` | Hasta 500.000 / hasta 3.000.000 / más | Jefe de área / + T-GER / + consejo | Solicitante ≠ aprobador |
| POL-CMP-APROBAR-OP | `cmp.paymentOrder.approve` | Único | T-GER | Quien registró la factura ≠ aprobador |
| POL-FAC-ANULAR-MASIVO | `fac.invoice.annulBulk` | Único | T-FAC + T-GER | Solicitante ≠ aprobador |
| POL-FAC-APROBAR-LOTE | `fac.billingRun.approve` | Único | T-FAC supervisor | Operador del lote ≠ aprobador |
| POL-MOR-CASTIGO | `mor.writeOff.approve` | Hasta 200.000 / más | T-GER / T-GER + consejo | Solicitante ≠ aprobador |
| POL-MOR-CONVENIO-EXCEPCION | `mor.agreement.exception` | Único | T-COB supervisor | Solicitante ≠ aprobador |
| POL-MOR-CORTE | `mor.interruption.approve` | Único | T-COB supervisor | — |
| POL-TAR-PUBLICAR-CUADRO | `tar.schedule.publish` | Único | T-TAR + T-GER | Quien simuló ≠ aprobador |
| POL-SUE-APROBAR-LIQUIDACION | `sue.payrollRun.approve` | Único | T-GER | Calculador ≠ aprobador (RN-SUE-065) |
| POL-CFG-PUBLICAR-VERSION | `cfg.configVersion.publish` | Por clase de cambio (T04) | T-ADM o T-GER | Autor ≠ aprobador (CU-GOB-01) |
| POL-INS-REINTEGRO-CAPITAL | `ins.capital.refund.approve` | Único | Consejo (quórum) | — |
| POL-INS-INGRESO-ASOCIADO | `ins.membership.approve` | Único | Consejo (quórum) | — |
| POL-PER-FUSION | `per.person.merge` | Único | T-ADM | Quien propuso ≠ aprobador |
| POL-PER-TRANSFERENCIA | `per.transfer.execute` | Único | T-ATE supervisor | Solicitante ≠ aprobador |
| POL-CAT-TRAMITE-MASIVO | `cat.bulkOperation.execute` | Único | T-ADM | Solicitante ≠ aprobador |
| POL-STK-AJUSTE | `stk.adjustment.post` | Hasta 100.000 / más | Jefe de depósito / + T-GER | Contador ≠ aprobador |
| POL-COM-CAMPANA | `com.campaign.launch` | Único | Responsable de comunicaciones | Autor ≠ aprobador |
| POL-BIA-REPORTE | `bia.customReport.publish` | Único | T-ADM | Autor ≠ aprobador |

### 18.3 Workflows semilla de plataforma

Cada workflow semilla define nodos obligatorios del dominio (no removibles) y puntos de extensión (responsables, SLA, campos adicionales, textos).

| Código | Trámite | Dueño funcional | Canal | Nodos (resumen) | SLA por defecto |
|---|---|---|---|---|---|
| WF-TAR-TARIFA-SOCIAL | Solicitud de tarifa social | M04 | Portal, atención | Recepción → verificación documental → verificación de padrón (espera EVT-TAR-014) → resolución → aviso | 10 días hábiles |
| WF-CAT-ALTA-SERVICIO | Alta de servicio | M02 | Portal, atención | Solicitud → documentación → factibilidad (M10) → aprobación → instalación (M10) → activación | 15 días hábiles |
| WF-CAT-BAJA-SERVICIO | Baja de servicio | M02 | Portal, atención, baja pública (M19) | Solicitud → constancia en 24 h → retiro de equipos → baja efectiva | 5 días hábiles |
| WF-CAT-CAMBIO-TITULAR | Cambio de titularidad | M01 / M02 | Atención | Solicitud → verificar identidad (obligatorio) → libre deuda → firma de ambos → transferencia | 10 días hábiles |
| WF-CAT-CAMBIO-PLAN | Cambio de plan | M02 | Portal, atención | Solicitud → validación de permanencia → aprobación → cambio con vigencia | 3 días hábiles |
| WF-PER-ACTUALIZAR-DATOS | Actualización de datos personales y fiscales | M01 | Portal | Solicitud → validación documental → verificación ARCA → aplicación | 3 días hábiles |
| WF-PER-REPRESENTANTE | Alta de representante o apoderado | M01 | Atención | Solicitud → poder o documentación → verificación → vigencia | 5 días hábiles |
| WF-COB-ADHESION-DEBITO | Adhesión a débito automático | M07 | Portal | Solicitud → validación de CBU → mandato → confirmación | 5 días hábiles |
| WF-COB-REINTEGRO | Pedido de reintegro | M07 | Atención | Solicitud → verificación de saldo → aprobación (POL-TES-EJECUTAR-PAGO) → pago | 10 días hábiles |
| WF-MOR-CONVENIO | Solicitud de convenio de pago | M08 | Portal, atención | Simulación → solicitud → aprobación de excepción si corresponde → firma del convenio → activación | 2 días hábiles |
| WF-CRM-RECLAMO-FACTURACION | Reclamo de facturación | M09 | Todos | Recepción → análisis (M05) → resolución (NC o rechazo) → respuesta | 10 días hábiles |
| WF-CRM-MESA-ENTRADAS | Registro y pase de mesa de entradas | M09 | Presencial, email | Registro → acuse → pase al área → respuesta → salida numerada → cierre | 10 días hábiles |
| WF-TEC-RECLAMO-TECNICO | Reclamo técnico con OT | M09 / M10 | Todos | Recepción → diagnóstico → OT → visita → conformidad → cierre | Según tipo de servicio |
| WF-INS-INGRESO-ASOCIADO | Solicitud de ingreso como asociado | M17 | Portal, atención | Solicitud → documentación → aporte de capital → aprobación del consejo → alta | 30 días |
| WF-INS-RENUNCIA | Renuncia de asociado | M17 | Atención | Solicitud → verificación de servicios y deudas → aprobación del consejo → baja | 30 días |
| WF-SOC-SUBSIDIO-SEPELIO | Subsidio por fallecimiento | M18 | Atención | Solicitud → certificado de defunción → beneficiarios → aprobación → pago (M14) | 5 días hábiles |
| WF-SUE-LICENCIA | Pedido de licencia | M16 | App del empleado | Solicitud → aprobación del jefe → registro → agenda | 2 días hábiles |
| WF-CFG-PUBLICAR-CONFIG | Publicación de configuración | T04 | Admin | Borrador → simulación → aprobación (POL-CFG-PUBLICAR-VERSION) → programación | 2 días hábiles |
| WF-COM-PUBLICACION | Aprobación editorial de publicación | T09 | Admin | Borrador → revisión → aprobación → publicación programada | 1 día hábil |
| WF-NFR-DERECHOS-TITULAR | Solicitud de acceso, rectificación o supresión de datos | T08 | Portal, email | Recepción → verificación de identidad → localización (JOB-NFR-02) → decisión → ejecución → respuesta | 10 días hábiles (a validar con T08) |

### 18.4 Plantillas de documentos semilla (46)

T11 aloja y versiona las plantillas; el módulo dueño define el contrato de datos y el texto obligatorio. Los bloques fiscales (CAE, QR, leyendas de ARCA) no son editables por el tenant.

| Código | Plantilla | Dueño del contrato de datos | Formato | Ola |
|---|---|---|---|---|
| TPL-FAC-01 | Factura de servicios (A, B, C; A4 y ticket) | M05 | PDF/A-2b | O4 |
| TPL-FAC-02 | Nota de crédito | M05 | PDF/A-2b | O4 |
| TPL-FAC-03 | Nota de débito | M05 | PDF/A-2b | O4 |
| TPL-FAC-04 | Talón y cupón de pago | M05 | PDF | O4 |
| TPL-FAC-05 | Acta de cierre de ciclo de facturación | M05 | PDF/A-2b | O4 |
| TPL-FAC-06 | Factura de venta de bienes y servicios eventuales | M05 / M11 | PDF/A-2b | O4 |
| TPL-FIS-01 | Certificado de retención | M06 | PDF/A-2b | O4 |
| TPL-FIS-02 | Constancia de percepción | M06 | PDF/A-2b | O4 |
| TPL-COB-01 | Recibo de cobro | M07 | PDF/A-2b y ticket | O5 |
| TPL-COB-02 | Resumen de cuenta | M07 | PDF | O5 |
| TPL-COB-03 | Constancia de libre deuda | M07 | PDF/A-2b | O5 |
| TPL-MOR-01 | Aviso de deuda | M08 | PDF | O5 |
| TPL-MOR-02 | Intimación de pago | M08 | PDF/A-2b | O5 |
| TPL-MOR-03 | Aviso de suspensión o corte | M08 | PDF/A-2b | O5 |
| TPL-MOR-04 | Convenio de pago | M08 | PDF/A-2b | O5 |
| TPL-MOR-05 | Certificado de deuda para gestión judicial | M08 | PDF/A-2b | O5 |
| TPL-CRM-01 | Constancia de reclamo | M09 | PDF | O2 |
| TPL-CRM-02 | Constancia de trámite | M09 | PDF | O2 |
| TPL-CRM-03 | Constancia de solicitud de baja | M09 | PDF/A-2b | O2 |
| TPL-CRM-04 | Acuse de mesa de entradas | M09 | PDF/A-2b | O10 |
| TPL-CRM-05 | Circular | M09 | PDF | O2 |
| TPL-CAT-01 | Solicitud y contrato de servicio | M02 | PDF/A-2b | O2 |
| TPL-CAT-02 | Constancia de alta de servicio | M02 | PDF | O2 |
| TPL-CAT-03 | Constancia de baja de servicio | M02 | PDF/A-2b | O2 |
| TPL-TEC-01 | Orden de trabajo | M10 | PDF | O3 |
| TPL-TEC-02 | Acta de conformidad de instalación o reparación | M10 | PDF/A-2b | O3 |
| TPL-TEC-03 | Contrato de comodato de equipo | M10 / M13 | PDF/A-2b | O3 |
| TPL-VEN-01 | Presupuesto | M11 | PDF | O8 |
| TPL-VEN-02 | Remito de entrega | M11 | PDF | O8 |
| TPL-CMP-01 | Orden de compra | M12 | PDF | O8 |
| TPL-CMP-02 | Orden de pago | M12 | PDF/A-2b | O8 |
| TPL-STK-01 | Vale de salida y remito interno | M13 | PDF | O3 |
| TPL-SUE-01 | Recibo de sueldo | M16 | PDF/A-2b | O9 |
| TPL-SUE-02 | Certificado de trabajo (art. 80 LCT) | M16 | PDF/A-2b | O9 |
| TPL-SUE-03 | Constancia de licencia | M16 | PDF | O9 |
| TPL-INS-01 | Certificado de aportes de capital | M17 | PDF/A-2b | O10 |
| TPL-INS-02 | Credencial de asociado | M17 | PDF | O10 |
| TPL-INS-03 | Convocatoria a asamblea | M17 | PDF/A-2b | O10 |
| TPL-INS-04 | Acta de asamblea | M17 | PDF/A-2b | O10 |
| TPL-INS-05 | Acta de reunión de consejo | M17 | PDF/A-2b | O10 |
| TPL-SOC-01 | Constancia de beneficio o subsidio | M18 | PDF | O10 |
| TPL-SOC-02 | Título de derecho de sepultura | M18 | PDF/A-2b | O10 |
| TPL-WFL-01 | Índice del expediente digital | T11 | PDF/A-2b | O1 |
| TPL-WFL-02 | Carátula de expediente | T11 | PDF/A-2b | O10 |
| TPL-WFL-03 | Constancia de firma electrónica (evidencia) | T11 | PDF/A-2b | O1 |
| TPL-WFL-04 | Certificado de purga documental | T11 | PDF/A-2b | O1 |

La ola de cada plantilla es la del módulo dueño del contrato de datos. T11 ofrece el motor desde O0.

### 18.5 Perfiles de firma y nivel por tipo documental

| Perfil | Nivel | Firmantes | Uso |
|---|---|---|---|
| SIG-SIMPLE-CAMPO | `simple` (trazo en pantalla + geolocalización + huella) | Socio | Actas de conformidad (TPL-TEC-02) |
| SIG-SOCIO-OTP | `electronic` (OTP por SMS, email o WhatsApp) | Socio | Convenios de pago, solicitudes de servicio, cambio de titularidad |
| SIG-SUE-EMPLEADOR | `digital` (proveedor licenciado por conector T06) | Representante legal | Recibos de sueldo (DEC-078; O8) |
| SIG-SUE-EMPLEADO | `electronic` (OTP) | Empleado | Recepción de recibos de sueldo |
| SIG-OP-CONJUNTA | `electronic` con MFA | Dos firmantes autorizados de M14 | Órdenes de pago (O8) |
| SIG-ACTA-INSTITUCIONAL | `digital` (proveedor licenciado por conector T06) | Presidente y secretario (actas de asamblea y de consejo); síndico titular, o el suplente en ejercicio, en las actas e informes de sindicatura. Los firmantes salen del cargo vigente en M17 a la fecha del acta (RF-INS-088, PRM-INS-052) | Actas de asamblea, de consejo y de sindicatura (DEC-078; O8/O9) |
| SIG-CERT-FISCAL | `digital` (certificado de la cooperativa) | Representante legal | Certificados de retención y libre deuda, cuando el tenant lo habilita |

### 18.6 Secuencias, tipos documentales y expedientes semilla

| Elemento | Datos de demostración (TEN-001) |
|---|---|
| Secuencias | `TRM-{YYYY}-{N:6}` (trámites, `allowGaps`), `ME-{YYYY}-{N:6}` y `MS-{YYYY}-{N:6}` (mesa de entradas y salidas, `gapless`), `EXP-{YYYY}-{N:6}` (expedientes, `gapless`), `ACT-ASM-{N:4}` y `ACT-CON-{N:4}` (actas, `gapless`), `OPR-{YYYY}-{N:7}` (operaciones, `allowGaps`), `TAR-{N:3}` (tareas, `allowGaps`) |
| Secuencias de M17 (`ownerModule = ins`; CTR-DAT-16, reemplazan a `insNumberingSeries`; todas `gapless`, `resetPolicy = never`, sin reutilizar números, RN-INS-002) | `ins.memberNumber:<legalEntityCode>` (número de asociado, `{N:6}`; **una secuencia por entidad jurídica** con `scopeValues = { legalEntityId }`, porque cada entidad lleva su Libro de Registro de Asociados y el número es único dentro de la entidad, no en el tenant: el N.º 1001 puede existir en COOP y en MUTUAL; M17 RF-INS-002, DEC-096; con una sola entidad, una única secuencia con el código de la entidad por defecto; carga inicial por entidad: máximo de ProCoop de esa entidad + 1. *Reemplazado (10-11-2026, DEC-096): "`ins.memberNumber` (número de asociado, `{N:6}`)"*), `ins.minuteBook:<bookType>:<legalEntityCode>` con `bookType` en `board`, `assembly`, `supervisory`, `attendance`, `internal` (libros de actas del consejo, asamblea, sindicatura, asistencia e internas, una secuencia por libro y entidad jurídica; de ellas toman número `ACT-CON-{N:4}` y `ACT-ASM-{N:4}`; M17 RF-INS-087, RF-INS-092, índice único `minutes {tenantId, legalEntityId, bookType, number}`), `ins.shareCertificate:<legalEntityCode>` (certificados de cuotas sociales, correlativos por entidad; M17 RF-INS-026), `ins.registerFolio:<legalEntityCode>` (folios del Libro de Registro de Asociados de cada entidad; M17 RF-INS-022) y `ins.refundRequest` (solicitudes de reintegro de capital, `{YYYY}-{N:6}`; **sigue por tenant**: es un número interno, no un libro legal). Las secuencias por entidad usan `scopeValues = { legalEntityId }`, como `ins.memberNumber`; con una sola entidad, una única secuencia con el código de la entidad por defecto. [VERIFICAR] con el asesor legal si algún libro puede compartirse entre entidades (M17 PA-INS-09); hasta que se confirme, ninguno se comparte (M17 §7.3; DEC-096, 10-11-2026). *Reemplazado (10-11-2026, DEC-096): "`ins.minuteBook:board`, `ins.minuteBook:assembly`, `ins.minuteBook:supervisory`, `ins.minuteBook:internal` (libros de actas del consejo, asamblea, sindicatura e internas; ...), `ins.shareCertificate` (certificados de aportaciones), `ins.registerFolio` (folio del registro de asociados)"*. Carga inicial: `next` = máximo de ProCoop + 1, por entidad en las secuencias por entidad (§19) |
| Tipos documentales | `DOC-ID-DNI`, `DOC-CUIT-CONST`, `DOC-DOM-CONST`, `DOC-INC-CONST`, `DOC-PODER`, `DOC-DEFUNCION`, `DOC-ESCRITURA`, `DOC-CONTRATO-SERV`, `DOC-CONFORMIDAD`, `DOC-FAC`, `DOC-REC`, `DOC-REC-SUELDO`, `DOC-ACTA`, `DOC-NOTA-ENTRADA`, `DOC-FOTO-OT`, `DOC-NOTA-INTERNA`, `DOC-ACTA-MIG` |
| Tipo documental `acta` de migración (plataforma; agregado el 5-11-2026 por PA-MIG-20 de T07, Asumida DEC-072) | `DOC-ACTA-MIG` "Acta de aceptación de la migración": `category = legal`, `allowedSubjects = [migrationProject]`, `mimeTypes = [application/pdf]`, `sensitivity = internal`, `retentionPolicyCode` = PRM-NFR-041 de T08 (contratos y conformidades firmadas, 10 años; el acta de migración se trata como conformidad firmada, asumido con PA-MIG-20 y DEC-072; antes [VERIFICAR: T08 no tiene una política específica para actas de migración]), `visibleToMember = false`, `requiresAcceptedVersion = true`. Es el tipo `acta` que cita T07 en `migrationProjects.acceptanceActId` (RF-MIG-087, PAN-MIG-23, API-MIG-03); la firma la exige la capability `mig.actaAceptacion.firmar` y el documento firmado habilita la transición del proyecto a `live`. Se distingue de `DOC-ACTA` (actas institucionales de M17) |
| Trámites | TRM-2026-000318 (tarifa social, en verificación), TRM-2026-000319 (cambio de plan, aprobado) |
| Operaciones | Anulación del recibo R-0001-00004567 (ARS 18.450,00, aprobada y ejecutada), ejecución de la OP-2026-000210 (ARS 3.200.000,00, pendiente del segundo paso) |
| Tareas | TAR-001 "Revisar padrón de tarifa social" (mensual, con evidencia obligatoria) |
| Configuración pendiente | Cambio de BON-VAR-30 del 30 % al 20 % pendiente de aprobación (CU-GOB-01), con la alerta ALT-DEMO-001 de T01 y la evidencia AUD-DEMO-001 de T02 |
| Mesa de entradas | ME-2026-000045 (nota del ente regulador, con pase a Técnica) y la salida MS-2026-000019 |
| Asamblea | Expediente de ASM-DEMO-001 con convocatoria TPL-INS-03 y padrón preliminar con fecha de corte 30-11-2026 (M17) |
| Corrida | LOT-2026-00012 (98 ítems emitidos y 2 excepciones) y su reproceso LOT-2026-00013 |
| Delegación | USR-GER-01 → USR-SGE-01, compras, límite de ARS 2.000.000, del 05-01-2027 al 20-01-2027 |

## 19. Migración desde ProCoop

T07 conduce la migración; T11 define destino, reglas y conciliación de lo propio.

| Origen ProCoop / Connectia | Destino T11 | Regla | Conciliación |
|---|---|---|---|
| `TRAMITES`, `TRAMITES_ACCIONES` (tipos y acciones de trámite) | `workflowDefinitions` + `actionCatalog` (con M09 para `procedureTypes`) | Cada tipo pasa a una definición `legacy` de una versión; las acciones SQL no se migran: se mapean a acciones tipadas del catálogo o se listan como brecha | Cantidad de tipos y de acciones mapeadas o en brecha |
| `PTRAMITES` (trámites presentados) | M09 `procedureRecords`; `workflowInstances` solo para los abiertos | Los cerrados se migran como historia de M09 sin instancia; los abiertos se recrean en el nodo equivalente con `legacyState` | Abiertos en origen = instancias creadas |
| `frmTransicion` y estados por módulo | `stateMachineRegistry` | No se migran datos: se usan para validar que las máquinas de estado nuevas cubren las transiciones usadas en los últimos 24 meses | Matriz de cobertura de transiciones |
| `AUTORIZACIONES` | T02 `authorizationRequests` (histórico) y `approvalRequests` con `legacy: true` (solo abiertas multipaso) | Las cerradas se migran como evidencia de T02 | Abiertas en origen = solicitudes abiertas |
| Trámites y workflows de Connectia | `workflowDefinitions` (como propuesta en borrador) | Se importan como borrador para revisión; no se publican automáticamente | Lista de definiciones importadas |
| `ADJUNTOS`, `PROCOOPAR_ADJUNTOS` y carpetas en disco | `documents` + `documentVersions` + `documentLinks` | Copia con SHA-256 (JOB-MIG-16); tipo mapeado por extensión y origen; sin tipo → `DOC-SIN-CLASIFICAR`; archivos sin registro → informe de huérfanos | Cantidad y huella por tipo; huérfanos listados |
| `EXPEDIENTES`, `EXPEDIENTES_TRAM` | `dossiers` + `dossierEntries` — **Reemplazado** (CTR-DAT-62 de T05): destino `technicalProcedures` de M10; T11 no migra estas tablas y `dossiers` nace vacío | Conservan número, carátula y pases; los cerrados quedan `archived` (regla aplicada por M10 a `technicalProcedures`) | Cantidad por estado (la concilia M10) |
| Plantillas de reportes de ProCoop (facturas, recibos, notas) | `documentTemplates` en borrador | Se rediseñan en el motor nuevo; el PDF histórico se conserva como documento con su huella, no se regenera | Comparación visual de muestras por plantilla |
| Numeradores (`max + 1` y tablas de último número) | `numberingSequences` | Se carga `next` = último usado + 1 en el corte, validado contra el máximo real de cada tabla | Último número origen = `next − 1` |
| `TICKETS` de soporte del proveedor | T01 (soporte de plataforma) | No se migran a T11 | — |
| `CALENDARIO` interno | M09 (dueño); T11 proyecta en la agenda | Se migran eventos futuros y recurrencias; se corrige el fin de eventos de todo el día | Eventos futuros origen = destino |
| `PROMAIL` (correo interno) | Comentarios de tarea o caso (solo lectura) | Se migran los últimos 12 meses como historial vinculado si el tenant lo pide (PA-WFL-17) | Cantidad migrada |
| `AUDIT_MAIL` | T09 (historial de comunicaciones) | No se migra a T11 | — |
| Servicio de Windows, `setInterval` y tareas programadas | `jobSchedules` | Se relevan las tareas y su horario; cada una pasa a un job del catálogo §12.8 o se descarta con justificación | Inventario de tareas origen → job destino |

**Corte y convivencia:** durante la convivencia (T07), las secuencias `gapless` tienen un solo emisor: o ProCoop o CoopApps, nunca los dos. Las aprobaciones abiertas en ProCoop se terminan en ProCoop si el corte cae dentro de PRM-WFL-015 horas. Si no, se recrean.

## 20. Contraposiciones resueltas

| CTR-ID | Fuentes | Conflicto | Resolución | Regla de prevalencia |
|---|---|---|---|---|
| CTR-WFL-01 | T01 §7.5–7.7 (`outboxEvents`, relay JOB-PLA-01) vs maestro (T11 dueño del bus de eventos) | Ambos parecen dueños del outbox. | T01 es dueño de la mecánica técnica (colecciones, relay, `deadLetters`, `jobRuns`). T11 es dueño del contrato: catálogo `eventTypes`, suscripciones, esquemas, alias, catálogo de jobs y programación por tenant. | Dueño del recurso (DEC-003) |
| CTR-WFL-02 | Guía §5 (`EVT-<MOD>-NN`, `JOB-<MOD>-NN` de dos dígitos) vs M04 (`EVT-TAR-001`) y T11 (más de 99 IDs posibles) | Formato del ID. | Se conservan los IDs de cada anexo. T11 usa tres dígitos en eventos (`EVT-WFL-NNN`) y dos en jobs. El ID es de documentación; el identificador técnico es el nombre `<mod>.<entidad>.<hecho>`. | Coherencia interna |
| CTR-WFL-03 | Secciones 12 de M01–M19 y transversales (consumidores) vs productores | Más de 80 nombres consumidos no coinciden con lo que el productor publica. | El canónico es el del productor; los alias se registran en `eventTypes.aliases` con vencimiento (§12.4). El chequeo de CI falla si un consumidor se suscribe a un nombre que no existe ni es alias. Las brechas vuelven al productor (PA-WFL-01). | Dueño del evento (DEC-003) |
| CTR-WFL-04 | M02 §12 (25 eventos sin ID) y T12 HUECO-TRV-03 vs guía §5 | Eventos sin ID. | Resuelto: M02 adoptó EVT-CAT-01..25 en el mismo orden y con los mismos nombres, y agregó EVT-CAT-26/27. | Guía §5 |
| CTR-WFL-05 | T06 (`int.connection.mode-changed`, hechos en kebab-case) vs guía §5 (camelCase) | Convención de nombres. | Canónico en camelCase; los nombres de T06 quedan como alias durante O0–O2. Aplicado el 5-11-2026 en §12.3 (EVT-INT-01, 03, 06 a 17, 20, 22 y 23; también EVT-INS-08 a 13 y 21, que tenían cuatro segmentos) con alias en §12.4 (PA-WFL-23). | Guía §5 |
| CTR-WFL-06 | M15 (colas `con-realtime`, `con-batch`, `con-closing`, `con-sim`, `con-integration`) y T08 (`critical`) vs T01 (clases de cola) | Colas propias fuera del catálogo de T01. | Se mapean a las clases de T01 (§12.8); el nombre propio queda como etiqueta del job. No se crean colas fuera de las clases. | Dueño del recurso (T01) |
| CTR-WFL-07 | 22 grupos de jobs con la misma función en varios anexos (§12.9) | Efectos o avisos dobles. | Dueño único por función según §12.9; el resto se elimina o pasa a consumir el evento del dueño (PA-WFL-19). | Dueño de datos (DEC-003) |
| CTR-WFL-08 | ProCoop (servicio de Windows, `setInterval`, Azure Queue Storage para ARCA) vs DEC-006 (BullMQ + Redis) | Mecanismo de tareas en segundo plano. | Todo pasa a jobs BullMQ con `jobSchedules` por tenant y zona horaria; ARCA usa JOB-FIS-01 con serialización por punto de venta. | 1 (DEC) |
| CTR-WFL-09 | ProCoop `TRAMITES_ACCIONES` (scripts SQL configurables por tipo de trámite) vs guía §3.5 y T08 | Ejecución de SQL arbitrario configurado por el usuario. | Se reemplaza por acciones tipadas del `actionCatalog`, que llaman a la API interna del módulo dueño con validación y permisos. No hay SQL ni código configurable. | Guía §3.5 (deuda técnica) |
| CTR-WFL-10 | ProCoop (`AUTORIZACIONES`, `ShowLogin` con usuario y clave de un supervisor en la misma terminal, autoaprobación posible) vs BASE §29, AGR-019 | Modelo de autorización. | Autorización puntual en el momento y diferida: T02 (RF-IAM-092/093). Circuitos multipaso, por monto, comités y delegaciones: T11 (RF-IAM-096). La autoaprobación está prohibida (RN-WFL-040). No se pide la clave de otro usuario en la sesión ajena. | 3 (AGR) + T02 |
| CTR-WFL-11 | ProCoop `frmTransicion` (navegador de pantallas) vs pedido "reemplazar la máquina de estados de ProCoop" | `frmTransicion` no es una máquina de estados. | Las máquinas de estado reales están repartidas en el código de cada formulario; T11 las declara en `stateMachineRegistry` (RF-WFL-060..066) y `frmTransicion` solo inspira la vista PAN-WFL-05. | 5 (lectura del código) |
| CTR-WFL-12 | M16 (JOB-SUE-04/06/19: firma de recibos propia, `clsFirmaDigital`) y BASE §73 (firma capturada en pantalla) vs FIC 15 (firma digital con proveedor) vs T11 (firma centralizada) | Dónde y con qué nivel se firma. | Resuelto por DEC-078: T11 centraliza la firma en tres niveles (`simple`, `electronic`, `digital`) con perfiles (§18.5). Electrónica con OTP por defecto; digital con proveedor licenciado (conector T06) solo para recibos de sueldo y actas, en O8/O9. M16 no tiene lógica de firma: JOB-SUE-04 solo pide la firma a T11 (JOB-WFL-17); JOB-SUE-06 y JOB-SUE-19 se retiraron en favor de JOB-WFL-18 y JOB-WFL-09. | Dueño del recurso (DEC-003) |
| CTR-WFL-13 | ProCoop (carpeta `/uploads` pública, borrado físico, archivos sobrescritos por nombre) vs AGR-023 | Seguridad y conservación de documentos. | Repositorio privado por tenant con URL firmada, versionado inmutable, borrado lógico y purga solo por retención (RF-WFL-150..164). | 3 (AGR) |
| CTR-WFL-14 | ProCoop (numeración `max + 1` y tablas de último número) vs BASE §97.2 | Concurrencia y huecos. | Contador atómico por secuencia en la misma transacción; políticas `gapless`, `allowGaps` y `external` (RF-WFL-185..191). | 3 (BASE) + mejora |
| CTR-WFL-15 | M09 (calendario interno, actividades y turnos como dueño) vs pedido T11 (agenda/calendario) | Dos calendarios. | M09 es dueño de los datos de calendario, actividades y turnos; T11 ofrece la agenda unificada como proyección de solo lectura (más tareas y aprobaciones) (RF-WFL-140). | Dueño de datos (DEC-003) |
| CTR-WFL-16 | ProCoop (bugs del calendario: fin de eventos de todo el día, búsqueda por asunto; actividades sin escalamiento) vs RN-10 §16.3 | Comportamiento heredado erróneo. | Se corrige (RF-WFL-141, RF-WFL-142) y se migra con la corrección. | Guía §3.5 |
| CTR-WFL-17 | AGR-016 (bus "agnóstico del transporte") vs DEC-003/DEC-006 (outbox + BullMQ) | Neutralidad tecnológica. | Se implementa con outbox + BullMQ; el contrato de eventos no depende del transporte, por lo que cambiarlo no cambia productores ni consumidores. | 1 (DEC) |
| CTR-WFL-18 | ProCoop (`AUDIT_MAIL`, `PROMAIL` como correo interno) vs T09 | Mensajería. | `AUDIT_MAIL` es historial de T09; `PROMAIL` se reemplaza por comentarios y menciones (RF-WFL-139, PA-WFL-17). | Dueño (T09) |
| CTR-WFL-19 | ProCoop `TICKETS` (soporte del proveedor de software) vs pedido T11 (tareas) | Qué son los tickets. | Son soporte de plataforma (T01 `supportCases`), no tareas del tenant. | Dueño (T01) |
| CTR-WFL-20 | Pedido T11 ("aprobaciones ... diferidas") vs T02 RF-IAM-093 (autorización diferida) | Superposición. | La autorización diferida de un solo paso es de T02. T11 cubre la aprobación diferida multipaso, por monto o con comité. La bandeja muestra las dos (PA-WFL-02). | Dueño (T02) + RF-IAM-096 |
| CTR-WFL-21 | Pedido T11 ("mesa de entradas, si M09 no la cubre") vs M09 (`crmCases.kind = deskEntry`) | Dueño de la mesa de entradas. | M09 la cubre como caso. T11 aporta numeración, expediente formal, acuse, carátula y pases (RF-WFL-220..222, PA-WFL-07). | Dueño de datos (DEC-003) |
| CTR-WFL-22 | M09 JOB-CRM-01 (`crm:sla-monitor` propio) vs T11 JOB-WFL-04 (SLA general) | Dos motores de SLA. | Un solo motor (T11); M09 conserva sus eventos de SLA derivados de EVT-WFL-020/021 durante O2 (PA-WFL-12). | Dueño del recurso |
| CTR-WFL-23 | T08 JOB-NFR-12 (antivirus) vs T01 JOB-PLA-21 (escaneo) | Duplicado. | Ejecuta T01; T08 define la política y consume el resultado (EVT-NFR-16). | Dueño del recurso (T01) |

## 21. Preguntas abiertas

### PA-WFL-01 — Tratamiento de eventos consumidos sin productor
- **Pregunta:** ¿Cómo se resuelven los nombres de eventos que un consumidor usa y el productor no publica (§12.4)?
- **Contexto:** la consolidación encontró 83 discrepancias: la mayoría son alias de un evento existente y 12 son brechas, donde ningún productor publica el hecho que el consumidor espera.
- **Opciones:**
  - A) Alias con vencimiento al cierre de O2 y, para las brechas, el productor agrega el evento en su anexo **(Recomendada)**: convive sin romper y corrige la fuente.
  - B) Corregir todos los consumidores ahora y no admitir alias: más limpio, pero bloquea varios anexos a la vez.
  - C) Admitir alias permanentes: no bloquea, pero deja dos nombres para siempre.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-WFL-015, CTR-WFL-03; O0.

### PA-WFL-02 — Aprobaciones diferidas: frontera con T02
- **Pregunta:** ¿Una aprobación de un solo paso, pedida para después, la gestiona T02 o T11?
- **Contexto:** T02 RF-IAM-093 ofrece la autorización diferida; T11 tiene el motor de aprobaciones. Si los dos la ofrecen, aparecen dos bandejas y dos auditorías.
- **Opciones:**
  - A) Un paso sin monto: T02. Multipaso, por monto, comité o delegación: T11. La bandeja muestra ambas **(Recomendada)**.
  - B) Todo lo diferido va a T11; T02 solo resuelve lo inmediato en la sesión.
  - C) Todo en T02, y T11 solo ofrece trámites.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-WFL-110, RF-WFL-130; O1.

### PA-WFL-03 — Plazos de retención documental
- **Pregunta:** ¿Qué plazos mínimos de retención rigen para cada categoría documental (fiscal, laboral, contractual, atención, salud, accesos)?
- **Contexto:** AGR-023 prohíbe inventar plazos. Sin confirmación, nada se purga (PRM-WFL-041), lo que hace crecer el almacenamiento.
- **Opciones:**
  - A) Cargar como "a validar" la propuesta de un asesor legal de la cooperativa piloto y no purgar hasta que se confirme **(Recomendada)**.
  - B) No purgar nunca en la primera etapa y revisarlo en O11.
  - C) Que cada tenant fije sus plazos sin mínimos de plataforma.
- **Impacto si no se responde:** no se purga ningún documento; se acumula almacenamiento.
- **Bloquea:** RF-WFL-160, PRM-WFL-041, PRM-WFL-046, JOB-WFL-14/15; O1.

### PA-WFL-04 — Alcance del diseñador de workflows para el tenant
- **Pregunta:** ¿El tenant puede crear workflows desde cero o solo adoptar y ajustar las plantillas de plataforma?
- **Contexto:** Connectia permitía diseñar trámites libremente; abrirlo por completo arriesga circuitos que saltan controles del dominio.
- **Opciones:**
  - A) Adoptar y ajustar plantillas en los puntos de extensión, y crear trámites nuevos solo de tipo "solicitud genérica" que terminan en una tarea o un caso **(Recomendada)**.
  - B) Diseñador libre con acciones tipadas y nodos obligatorios por dominio.
  - C) Solo plantillas de plataforma sin edición.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-WFL-076, PAN-WFL-08..12; O2.

### PA-WFL-05 — Motor de render PDF
- **Pregunta:** ¿Con qué motor se generan los PDF?
- **Contexto:** se necesita PDF/A-2b, fuentes embebidas, códigos de barras y QR, y lotes de miles de facturas por hora.
- **Opciones:**
  - A) HTML + CSS con un navegador sin interfaz en workers dedicados, y validación PDF/A posterior **(Recomendada)**: plantillas editables por el tenant y buen diseño.
  - B) Una biblioteca de composición PDF programática: más rápida, pero la plantilla deja de ser editable por el tenant.
  - C) Un servicio externo de render: menos operación, pero con costo por documento y datos personales fuera.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-WFL-175, JOB-WFL-11/12; O0.

### PA-WFL-06 — Proveedor y nivel de firma por documento
- **Pregunta:** ¿Qué proveedor de firma digital se usa y qué nivel exige cada tipo documental (recibos de sueldo, actas, órdenes de pago, convenios)?
- **Contexto:** FIC 15 muestra firma digital con proveedor para recibos de sueldo, pero el proveedor está pendiente. BASE §73 pide firma capturada en campo. La firma digital tiene costo por firma.
- **Opciones:**
  - A) Electrónica (OTP) por defecto en todo, y digital con un proveedor licenciado por T06 solo para los recibos de sueldo del empleador y las actas, en O8 y O9 **(Recomendada)**.
  - B) Digital en todo lo que firma la cooperativa desde O1.
  - C) Solo electrónica interna, sin proveedor.
- **Impacto si no se responde:** se asume A, sin proveedor hasta que se elija.
- **Bloquea:** RF-WFL-198, PRM-WFL-048, perfiles de §18.5, JOB-SUE-04; O8.
- **Estado:** Resuelta por DEC-078 (opción A).

### PA-WFL-07 — Calendario, agenda y mesa de entradas entre M09 y T11
- **Pregunta:** ¿Se confirma que M09 es dueño del calendario interno y de la mesa de entradas, y que T11 aporta la agenda unificada, la numeración y el expediente formal?
- **Contexto:** el pedido de T11 incluye agenda y mesa de entradas "si M09 no la cubre". M09 ya la cubre como caso `deskEntry`.
- **Opciones:**
  - A) M09 es dueño de los datos y T11 aporta la proyección de agenda, la numeración, el expediente, la carátula y el acuse **(Recomendada)**.
  - B) T11 es dueño de la agenda completa, incluidos los eventos manuales.
  - C) La mesa de entradas pasa a T11 como módulo propio.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-WFL-140, RF-WFL-212, RF-WFL-220; O2 y O10.

### PA-WFL-08 — Delegaciones: duración y alcance
- **Pregunta:** ¿Cuál es la duración máxima de una delegación, y si puede delegarse la decisión de un comité?
- **Opciones:**
  - A) Hasta 90 días, con límite de importe ≤ al del delegante y sin delegar votos de comité ni consejo **(Recomendada)**.
  - B) Sin tope, con renovación manual.
  - C) Hasta 30 días y solo para aprobaciones de un paso.
- **Impacto si no se responde:** se asume A (PRM-WFL-031 = 90).
- **Bloquea:** RF-WFL-118; O1.

### PA-WFL-09 — Qué pasa cuando vence un paso de aprobación
- **Pregunta:** ¿Qué acción por defecto se aplica cuando vence el SLA de un paso?
- **Contexto:** expirar en silencio deja operaciones sin resolver; aprobar en forma automática no es aceptable.
- **Opciones:**
  - A) Escalar al supervisor del aprobador y avisar al solicitante; nunca aprobar automáticamente **(Recomendada)**.
  - B) Sumar un aprobador alternativo del mismo rol.
  - C) Expirar y obligar a pedir de nuevo.
- **Impacto si no se responde:** se asume A (PRM-WFL-028 = `escalate`).
- **Bloquea:** RF-WFL-101; O1.

### PA-WFL-10 — Días hábiles o corridos en los SLA
- **Pregunta:** ¿Los SLA por defecto se cuentan en días hábiles o corridos, y con qué calendario?
- **Contexto:** ProCoop usaba días corridos (`DIAS_VENCE`). Algunos plazos regulados (por ejemplo, la constancia de baja en 24 h) son corridos.
- **Opciones:**
  - A) Hábiles con el calendario de T04 por defecto, y corridos cuando la norma lo exige, marcado en la política **(Recomendada)**.
  - B) Corridos siempre, como ProCoop.
  - C) Hábiles siempre.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-WFL-100, PRM-WFL-020; O2.

### PA-WFL-11 — Documentos visibles para el socio
- **Pregunta:** ¿Qué tipos documentales ve el socio en "Mis documentos" por defecto?
- **Opciones:**
  - A) Comprobantes emitidos, contratos y convenios firmados, constancias de trámite y documentos que el propio socio subió; nunca notas internas ni documentos de verificación **(Recomendada)**.
  - B) Solo comprobantes y constancias.
  - C) Todo lo vinculado a su cuenta, salvo lo que se marque interno.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-WFL-162; O2.

### PA-WFL-12 — Convergencia del SLA de M09 con el motor de T11
- **Pregunta:** ¿M09 deja su `crm:sla-monitor` y usa el motor de SLA de T11?
- **Contexto:** dos motores de SLA producen avisos dobles y cálculos distintos de días hábiles.
- **Opciones:**
  - A) Un solo motor en T11 desde O2; M09 sigue publicando EVT-CRM-06/07, que deriva de EVT-WFL-020/021 **(Recomendada)**.
  - B) M09 conserva su motor para casos y T11 para trámites y aprobaciones.
  - C) M09 adopta el motor y deja de publicar sus eventos.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** JOB-CRM-01, JOB-WFL-04; O2.

### PA-WFL-13 — Huecos en la numeración
- **Pregunta:** ¿Qué secuencias deben ser sin huecos?
- **Contexto:** sin huecos exige bloqueo en la transacción y limita la concurrencia. Los comprobantes fiscales lo exigen; las tareas no.
- **Opciones:**
  - A) Sin huecos en comprobantes, recibos, actas, mesa de entradas y expedientes formales; con huecos en el resto **(Recomendada)**.
  - B) Sin huecos en todo.
  - C) Que cada tenant decida por secuencia.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-WFL-187, PRM-WFL-063; O0.

### PA-WFL-14 — Eventos públicos para terceros
- **Pregunta:** ¿Qué tipos del catálogo se exponen a terceros por webhooks de T10?
- **Opciones:**
  - A) Un subconjunto curado sin datos personales (factura emitida, pago confirmado, estado de trámite, interrupción de servicio), en O11 **(Recomendada)**.
  - B) Todos los eventos del tenant con filtro por permiso.
  - C) Ninguno hasta tener un caso de negocio.
- **Impacto si no se responde:** se asume C hasta O11.
- **Bloquea:** RF-WFL-014, JOB-BIA-14; O11.

### PA-WFL-15 — Fuentes de la bandeja unificada
- **Pregunta:** ¿Qué pendientes de otros módulos entran en la bandeja del empleado desde O1?
- **Opciones:**
  - A) Desde O1: tareas, aprobaciones, autorizaciones de T02 y excepciones de corridas. Desde O2: casos de M09 y OT de M10. Más adelante, el resto **(Recomendada)**.
  - B) Todas las fuentes desde O1.
  - C) Solo tareas y aprobaciones de T11.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-WFL-130; O1.

### PA-WFL-16 — Feed iCal de la agenda
- **Pregunta:** ¿Se ofrece un feed iCal privado de la agenda para que el empleado la vea en su calendario personal?
- **Contexto:** es cómodo, pero saca información de la plataforma.
- **Opciones:**
  - A) Deshabilitado por defecto; habilitable por tenant, sin datos de socios en el título **(Recomendada)**.
  - B) Habilitado para todos.
  - C) No se ofrece.
- **Impacto si no se responde:** se asume A (PRM-WFL-057 = false).
- **Bloquea:** RF-WFL-144; O2.

### PA-WFL-17 — Correo interno PROMAIL
- **Pregunta:** ¿Se migra el historial de `PROMAIL` y se reemplaza por comentarios con menciones?
- **Opciones:**
  - A) Se reemplaza por comentarios y menciones; el historial se migra solo si el tenant lo pide (últimos 12 meses) **(Recomendada)**.
  - B) Se mantiene un correo interno equivalente.
  - C) Se descarta sin migrar.
- **Impacto si no se responde:** se asume A sin migración.
- **Bloquea:** RF-WFL-139; O1.

### PA-WFL-18 — Quién reprograma los jobs
- **Pregunta:** ¿El administrador del tenant puede cambiar el horario de los jobs?
- **Opciones:**
  - A) Sí, solo la hora y los días de los jobs `tenantSchedulable`, dentro de la ventana de plataforma **(Recomendada)**.
  - B) Solo T-SOP de plataforma.
  - C) Libre, incluida la cola.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** RF-WFL-023; O1.

### PA-WFL-19 — Dueño único de los jobs duplicados
- **Pregunta:** ¿Se aceptan los dueños propuestos en §12.9 para los 22 grupos de jobs duplicados o convergentes?
- **Opciones:**
  - A) Sí, y cada anexo afectado elimina o convierte su job en el siguiente ciclo de revisión **(Recomendada)**.
  - B) Se mantienen los duplicados y se desactiva uno por configuración.
  - C) Se decide caso por caso al implementar.
- **Impacto si no se responde:** se asume A; hasta corregir los anexos, el catálogo de `jobDefinitions` registra solo el job del dueño.
- **Bloquea:** CTR-WFL-07; O0.

### PA-WFL-20 — Comparación contra fuentes oficiales
- **Pregunta:** ¿Qué fuentes oficiales se consultan para validar datos en los trámites, y si una diferencia bloquea?
- **Contexto:** ProCoop comparaba documentos contra CiDi (`COMPARAR_DOCUMENTO`). Cada fuente necesita convenio y conector de T06.
- **Opciones:**
  - A) Padrón de ARCA desde O2 y otras fuentes (identidad provincial o nacional) a demanda del tenant; una diferencia marca el paso para revisión, no bloquea **(Recomendada)**.
  - B) Ninguna fuente automática; revisión manual.
  - C) Bloquear el trámite ante cualquier diferencia.
- **Impacto si no se responde:** se asume A con solo ARCA.
- **Bloquea:** RF-WFL-094; O2.

### PA-WFL-21 — Importe de referencia para los tramos de aprobación
- **Pregunta:** ¿Los tramos por monto se evalúan sobre el importe bruto (con impuestos) o el neto?
- **Opciones:**
  - A) Bruto, que es lo que sale de caja, con opción de neto por tipo de operación **(Recomendada)**.
  - B) Neto siempre.
  - C) Que el tenant lo decida para todas las políticas.
- **Impacto si no se responde:** se asume A (PRM-WFL-029 = `gross`).
- **Bloquea:** RF-WFL-110, RF-WFL-114; O1.

### PA-WFL-22 — Destino de `responsibleAreaId`
- **Pregunta:** ¿A qué colección apunta `responsibleAreaId` en los nodos de workflow (§7.4) y en los expedientes (§7.11)?
- **Contexto:** T05 §7.2 no declaraba el destino de las áreas responsables genéricas; T11 dejaba dos opciones (PA 11 del pendiente de cierre de la corrección de inconsistencias).
- **Opciones:**
  - A) `crmAreas` de M09, que ya modela las áreas que atienden trámites y casos **(Recomendada)**.
  - B) `workAreas` de M16.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §7.4 y §7.11 (`responsibleAreaId`); O2.
- **Estado:** Asumida (DEC-072), opción A. Aplicada en §7.4 y §7.11 el 5-11-2026.

### PA-WFL-23 — Cierre de residuales: nombres de eventos, alias con un solo canónico y máquinas de estado
- **Pregunta:** ¿cómo se cierran los residuales de T11: los tipos de evento fuera de la convención `<mod>.<agregado>.<hecho>` (INC-06-11), los alias de §12.4 y §12.4.1 que resuelven a más de un canónico, las máquinas de estado descritas solo en texto y la tabla combinada de `formDefinitions`/`formVersions`?
- **Contexto:** `docs/entregables-analisis-diseno/06a-*.md` §7 (INC-06-11: 31 tipos en 24 eventos con guiones o cuatro segmentos, de T06 y M17) y `19-catalogo-eventos.md` (24 alias con varios canónicos). Cierre de residuales del 5-11-2026 (`_trabajo/residuales-instrucciones.md`, categorías 1, 3, 4, 5 y 6).
- **Opciones:**
  - A) Renombrar en el catálogo de §12.3 (guiones a camelCase; cuatro segmentos uniendo el 2.º y el 3.º en camelCase), registrar el nombre viejo como alias en §12.4, dejar un solo canónico por alias (el resto de los casos se suscribe directamente al canónico) y pasar a tabla todas las máquinas de §8 **(Recomendada)**.
  - B) Mantener los nombres actuales y los alias múltiples — el chequeo de CI (CTR-WFL-03) no puede resolver un alias a un único tipo.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §12.3 (EVT-INS-08 a 13 y 21; EVT-INT-01, 03, 06 a 17, 20, 22 y 23), §12.4, §12.4.1, §8; O0 a O2 (registro de `eventTypes`).
- **Estado:** **Asumida (DEC-072)**, opción A. Aplicada el 5-11-2026:
  - 35 nombres de evento renombrados en §12.3 (24 filas EVT), con su alias en §12.4; M17 (productor de EVT-INS), T06 (productor de EVT-INT) y los consumidores (M06, M08, M10, M15, M18, M19, T09, T12) deben adoptar el nombre nuevo.
  - 24 alias con un solo canónico: 17 de §12.4 (25 filas pasan a "retirado como alias") y 7 de §12.4.1 (CNC-WFL-001, 004, 005, 009, 049, 083 y 089).
  - §8: tablas de transición para §8.3, §8.5, §8.7, §8.8, §8.9 y §8.10; subtítulos de §8.11 como encabezados 8.11.1 a 8.11.14; nuevas 8.11.15 (versiones de workflow, plantilla y formulario) y 8.11.16 (`documentVersions.scanStatus`); `operationTypes` no tiene estado.
  - §7: tablas propias de `formDefinitions` y `formVersions`; nombres con rol de T05 §7.2 (`resultStoredFileId`, `thumbnailStoredFileId`, `previewStoredFileId`, `signatureImageStoredFileId`, `signatureProfileId`) y `numberingSequenceId` en EVT-WFL-040; `sourceModule` y `subjectType` declarados como códigos, no referencias.
  - API-WFL-16, 64 y 65 con `public: true` (RF-IAM-061).
  - CU-ARQ-01 queda con dueño T11 (decisión del coordinador del 5-11-2026); T01 renumera el suyo.
  - Ya no bloquea.

### PA-WFL-24 - Sincronización posterior a la ronda de residuales: alias de M13 y comando de OT en EVT-CRM-13

- **Pregunta:** ¿qué falta en el catálogo de eventos después de la ronda de residuales de los anexos de módulo (`_trabajo/residuales-sincronizacion.md`)?
- **Contexto:** se verificó §12.3 y §12.4 contra los anexos dueños: los 27 tipos renombrados por T06 (PA-INT-27), los 8 de M17 (PA-INS-13) y los alias de M06 (`int.arca.params-synced`, PA-FIS-22), M08 (`int.network.provisioning-result`, PA-MOR-22) y M10 (`int.cdr.batch-received`, PA-TEC-23) ya estaban registrados con un solo canónico. Faltaban el alias `stk.item.below-minimum` de M13 (PA-STK-11; §12.3 ya usaba `stk.item.belowMinimum`) y el comando `tec.workOrder.request` (antes `tec.workOrder.create`) en el payload de EVT-CRM-13 (M10 PA-TEC-23).
- **Opciones:**
  - A) Agregar la fila de alias en §12.4, citar el nombre anterior en EVT-STK-12, nombrar el comando en el campo `command` de EVT-CRM-13 y actualizar §12.10. **(Recomendada)**.
  - B) No registrar el alias porque §12.3 ya tenía el nombre nuevo - el chequeo de CI (CTR-WFL-03) rechazaría a un consumidor que todavía use el nombre con guion.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** §12.3 (EVT-STK-12, EVT-CRM-13), §12.4 y §12.10.
- **Estado:** **Asumida (DEC-072)**, opción A. Aplicada el 5-11-2026: §12.4 pasa a 204 filas (36 alias de eventos renombrados por INC-06-11); cada alias sigue con un solo canónico. Los comandos no son tipos de evento: `tec.workOrder.request` no se registra en `eventTypes.aliases`. Ya no bloquea.
  - 5-11-2026, pendientes de la sincronización: §12.3 suma 10 eventos que T06 consumía con guion y sin productor (EVT-PER-26, EVT-MED-30, EVT-FIS-25, EVT-COB-28 a 30, EVT-TES-24 y 25, EVT-SUE-28 y EVT-COM-40), con nombre, payload y consumidor tomados del §12.1 de M01, M03, M06, M07, M14, M16 y T09; §12.4 registra los 10 alias con guion (una fila por canónico); §12.10 pasa a 446, 174 y 668 IDs EVT y a 214 filas de conciliación.
  - 10-11-2026, decisiones DEC-093 a DEC-108: §12.3 suma EVT-PER-27 (DEC-099), EVT-FAC-22 y EVT-FAC-23 (DEC-107), EVT-INS-22 (DEC-095), EVT-MIG-10 (DEC-103) y EVT-NFR-18 (DEC-100), con nombre, payload y consumidores tomados del §12 de M01, M05, M17, T07 y T08; agrega la nota de `legalEntityId` en los eventos de M17 (DEC-096) y declara el payload de EVT-TES-15 con `taxObligation` (DEC-095, M14 CTR-TES-27); §12.8 suma JOB-NFR-25 (DEC-100); §18.6 pasa `ins.memberNumber` a una secuencia por entidad jurídica, `ins.memberNumber:<legalEntityCode>` (DEC-096, M17 RF-INS-002); §12.10 pasa a 450, 176 y 674 IDs EVT y a 178 y 507 IDs JOB; RF-WFL-010 y `operationalInboxItems.kind` suman `referentialIntegrity` para la bandeja de integridad de T08 RNF-NFR-260 (DEC-100). Ninguno es un renombre, así que §12.4 no cambia.
  - 10-11-2026, última ronda de DEC-093 a DEC-108 (verificado en M06 §12.1): §12.3 suma EVT-FIS-26 `fis.obligation.cancelled` (DEC-095) con consumidores M15, M14 y T09; EVT-FIS-02 suma `rejectionKind`, `pointOfSaleId`, `arcaCbteType`, `number`, `issueAttempt` y `lastAuthorizedNumber` (DEC-107); EVT-FIS-13 suma `legalEntityId`, `ownTaxObligationId`, `taxAgentRegistrationId` y `replacesObligationId`, y M15 como consumidor (DEC-095). EVT-FAC-22 y EVT-FAC-23 ya estaban con consumidores M06, M07, M19 y T02. §12.5 suma el consumo de EVT-NFR-18 (bandeja de integridad, DEC-100), con lo que T05 CTR-DAT-81 queda aplicada en T11. §12.10 pasa a 451 y 675 IDs EVT (antes 450 y 674); IDs JOB sin cambio (507). Ninguno es un renombre, así que §12.4 no cambia.
  - 10-11-2026, ronda de cierre (verificado en M17 §7.3 y §12.1; DEC-096): §18.6 pasa a series por entidad jurídica `ins.registerFolio:<legalEntityCode>`, `ins.minuteBook:<bookType>:<legalEntityCode>` (incluido el libro de asistencia, `attendance`) e `ins.shareCertificate:<legalEntityCode>`; `ins.refundRequest` sigue por tenant. §12.3 declara `legalEntityId` en el payload de EVT-INS-01 a EVT-INS-21 y suma `bookType` y `number` en EVT-INS-16; la nota al pie deja de decir "cuando el objeto lo tiene". En la misma ronda: EVT-FIS-26 suma `cancellationStatus` y `creditBalanceAmount` (M06 RN-FIS-133 punto 9, DEC-095); EVT-FAC-07 suma `lateAuthorizationGraceDays` y EVT-FAC-13 suma `reason` y `lateAuthorizationShift` (M05 RN-FAC-165, DEC-107); EVT-PER-27 suma a M02 como consumidor (M02 §12.2, DEC-099). Sin IDs nuevos ni renombres; §12.4 y §12.10 no cambian.
  - 10-11-2026, última ronda de sincronización (verificado en M05 §12.1): EVT-FAC-07 suma `issueAttempt` y `authorizationType` (DEC-107) y `dueDateCap` (DEC-106), con lo que el payload queda igual al de M05; EVT-FAC-13 suma a T09 como consumidor (tipos `fac.invoice.dueDatesChanged` y `fac.invoice.dueDatesShifted` de T09 §9.6.4). Nota para M05: su §12.1 todavía no lista a T09 entre los consumidores de EVT-FAC-13, y T11 lista para EVT-FAC-07 más consumidores (M04, M08, M09, M13, M17, M18) que M05. Sin IDs nuevos ni renombres; §12.4 y §12.10 no cambian.

## 22. Trazabilidad de fuentes

### 22.1 BASE, AGR y escenarios

| Fuente | Dónde se cubre |
|---|---|
| BASE §2, §15, §16 (expediente, documentación por trámite) | RF-WFL-210..215; P-WFL-12; CU-WFL-08 |
| BASE §26 (tareas, responsables, recurrencias, evidencias, TAR-001) | RF-WFL-130..139; JOB-WFL-09/10; P-WFL-07 |
| BASE §27 (institucional, CU-27) | §16.1; TPL-INS-03..05; SIG-ACTA-INSTITUCIONAL |
| BASE §29 (aprobaciones, permisos, CU-29) | RF-WFL-110..124; RN-WFL-040..051; P-WFL-04; CU-WFL-01 |
| BASE §39.5 (estados de ejemplo) | RF-WFL-060..066; §8 |
| BASE §54 (GOB-001..004, CU-GOB-01) | §16.1; POL-CFG-PUBLICAR-VERSION; WF-CFG-PUBLICAR-CONFIG; RF-WFL-082 |
| BASE §58 (CU-ARQ-01) | RF-WFL-008, RF-WFL-043; CA-WFL-50 |
| BASE §69 (LOT-001..004, CU-LOT-01) | RF-WFL-026; RN-WFL-008, RN-WFL-011; P-WFL-03; CA-WFL-52/53 |
| BASE §73 (firma capturada en pantalla) | RF-WFL-195..202; SIG-SIMPLE-CAMPO; CU-WFL-12 |
| BASE §97.1 (retención y borrado) | RF-WFL-159..161; RN-WFL-063/064; PA-WFL-03 |
| BASE §97.2 (numeración) | RF-WFL-185..191; CTR-WFL-14; PA-WFL-13 |
| BASE §100 MER-012 (patrón de operaciones) | RF-WFL-040..051; §7.3; P-WFL-04/05 |
| BASE §100 MER-013 (corridas masivas) | RF-WFL-026..027; `bulkRuns` |
| BASE §100 MER-016 (mesa de entradas y expediente) | RF-WFL-212, RF-WFL-220..222; CU-WFL-06 |
| AGR-003 (máquinas de estado declaradas) | RF-WFL-060..066 |
| AGR-009 (configuración versionada y simulada) | RF-WFL-076..078 |
| AGR-010 (fecha efectiva y de registro) | §12.1 (`occurredAt`, `recordedAt`) |
| AGR-016 (eventos, idempotencia, entrega al menos una vez) | RF-WFL-001..017; CTR-WFL-17 |
| AGR-017 (SLA y calendarios) | RF-WFL-100..105 |
| AGR-019 (separación de funciones) | RF-WFL-112..113; CTR-WFL-10 |
| AGR-020 (jobs programados por tenant) | RF-WFL-020..031; §12.6 |
| AGR-021 (API y eventos públicos) | RF-WFL-014; PA-WFL-14 |
| AGR-023 (documentos privados, versionado, retención) | RF-WFL-150..164; CTR-WFL-13 |
| AGR-024 (estados de comunicación con constancia) | §13.1; EVT-COM-27/28 |
| AGR §5.5 (inciertos y conciliación) | RF-WFL-031, RF-WFL-046; RN-WFL-022; CU-WFL-07 |
| ESC-01..05 | §17.4 |

### 22.2 ProCoop, Connectia y relevamiento

| Fuente | Dónde se cubre |
|---|---|
| CNX §4.3–4.4 (Trámites: solicitudes, tipos, estados, workflows) | RF-WFL-070..082; §19 |
| CNX `/aprobaciones`, `/agenda` | PAN-WFL-01; RF-WFL-140 |
| DFA M1 ("quien crea no puede aprobar") | RF-WFL-112 |
| DFA M7, FIC 15 (`PPAGOS_FIRMANTES`, `clsFirmaDigital`) | RF-WFL-111, RF-WFL-198; CTR-WFL-12; PA-WFL-06 |
| DFA M21 (plantillas, mesa de entradas) | RF-WFL-170..180, RF-WFL-220; §18.4 |
| FIC 21 (PDF) | RF-WFL-175; PA-WFL-05 |
| FIC 22 (servicio de Windows, tareas programadas) | RN-WFL-007; CTR-WFL-08; §19 |
| RN-06 §23.3 (`DIAS_VENCE`) | RN-WFL-038; PA-WFL-10 |
| RN-07 §5 (`TRANSAC`, `RESPONSA_NOTIFICA`), §6 (`TICKETS`), §7 (actividades) | RF-WFL-072, RF-WFL-101; CTR-WFL-19; RF-WFL-140 |
| RN-08 §7.2 (`DOBLE_AUTO`, autoaprobación) | RF-WFL-111, RF-WFL-113 |
| RN-09 §4.2–4.3 (errores por archivo y mail) | RN-WFL-004 |
| RN-10 §2, §16.2 (`ADJUNTOS`, borrado físico) | RF-WFL-150..164; RN-WFL-061, RN-WFL-063; §19 |
| RN-10 §3.5 (`COMPARAR_DOCUMENTO`) | RF-WFL-094; PA-WFL-20 |
| RN-10 §16.3 (`CALENDARIO`, `PROMAIL`, `INFO_RECUR`) | RF-WFL-139..145; CTR-WFL-15/16/18 |
| RN-10 §16.4 (`frmTransicion`) | CTR-WFL-11; PAN-WFL-05 |
| CAT `TRAMITES`, `TRAMITES_ACCIONES`, `PTRAMITES`, `EXPEDIENTES`, `EXPEDIENTES_TRAM`, `AUTORIZACIONES`, `FIRMASDIGITALES` | §7.12; §19 |

### 22.3 Anexos consolidados

| Anexo | Qué toma T11 |
|---|---|
| M01–M19 §12 | Catálogos de eventos (§12.3) y jobs (§12.8); alias (§12.4); duplicados (§12.9) |
| T01 | Mecánica del outbox, colas, almacenamiento, antivirus; EVT-PLA, JOB-PLA; CTR-WFL-01 |
| T02 | `authorize()`, autorización puntual y diferida, capabilities `wfl.*`, SoD; EVT-IAM, JOB-IAM; CTR-WFL-10/20 |
| T03 | Diccionario y marca de las plantillas; EVT-UXD, JOB-UXD |
| T04 | Calendarios, campos personalizados, aprobación de configuración; EVT-CFG, JOB-CFG |
| T06 | Conectores de firma y de fuentes oficiales; EVT-INT, JOB-INT; CTR-WFL-05 |
| T07 | Migración; EVT-MIG, JOB-MIG; §19 |
| T08 | Retención, supresión, legal hold, antivirus; EVT-NFR, JOB-NFR; CTR-WFL-23 |
| T09 | Notificaciones (§13.1), OTP, constancias; EVT-COM, JOB-COM |
| T10 | Reportes (§15), eventos públicos; EVT-BIA, JOB-BIA |
| T12 | HUECO-TRV-01 (adherentes), HUECO-TRV-02 (alias), HUECO-TRV-03 (IDs de M02) |

### 22.4 Dependencias

- **T11 depende de:**
  - T01: outbox, colas BullMQ, almacenamiento S3 y antivirus.
  - T02: autorización, capabilities, SoD y auditoría.
  - T03: diccionario y marca.
  - T04: calendarios, parámetros y campos personalizados.
  - T06: conectores de firma y de fuentes oficiales.
  - T08: políticas de retención y privacidad.
  - T09: entrega de notificaciones.
- **Dependen de T11:**
  - M01–M19, para operaciones aprobadas, aprobaciones, documentos, plantillas, numeración, firma y expediente.
  - M09, para el workflow de trámites, la mesa de entradas y el SLA.
  - M19, para "Mis trámites" y "Mis documentos".
  - T04, para la aprobación de versiones de configuración.
  - T07, para la carga de adjuntos y definiciones.
  - T10, para las proyecciones y los eventos públicos.
- **Cambios que T11 pide a otros anexos (sin modificarlos):**
  - M02: adoptar EVT-CAT-01..25.
  - Los consumidores de §12.4: corregir los alias.
  - Los productores de las brechas: declarar los eventos que faltan.
  - Los anexos de §12.9: eliminar o convertir los jobs duplicados.
  - M16: delegar en T11 la firma de recibos (CTR-WFL-12).
  - M09: converger el SLA (PA-WFL-12).
