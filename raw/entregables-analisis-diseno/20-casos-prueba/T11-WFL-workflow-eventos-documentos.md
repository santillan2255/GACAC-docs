# Casos de prueba de aceptación — T11 WFL — Workflow, eventos, tareas, aprobaciones y documentos

Parte de [`20-casos-prueba.md`](../20-casos-prueba.md) (artefacto 9.2). Fuente: [`T11-WFL-workflow-eventos-documentos.md`](../../especificacion/anexos/T11-WFL-workflow-eventos-documentos.md) (solo lectura). Generado por `_trabajo/gen_casos_prueba.py` y revisado; ante diferencias prevalece el anexo.

Resumen: 157 CP de requisitos funcionales, 42 CP de escenarios ESC y 18 CP de casos de uso CU.

Convenciones: el formato Dado / Cuando / Entonces sigue `07-estrategia-pruebas.md` §13; la ola de un CP de RF es la del prompt que lo implementa en `03` (prevalece sobre la columna del anexo); la de un CP de escenario es la última ola de los RF que cita o la que el escenario declara. Prioridad Extensión del anexo se agrupa como Estándar. Todos los datos son ficticios (TEN-001, TEN-002 y semillas del §18 del anexo).

## 1. Casos por requisito funcional

Precondiciones comunes de esta sección: ola indicada desplegada en `staging` o `sandbox`; tenant ficticio TEN-001 con la configuración publicada y las semillas del T11 §18; usuario con la capability que exige el RF (el caso negativo sin capability lo cubre la suite de permisos negativos, `07` §4.3). Resultado esperado: el criterio de aceptación del RF se cumple, la prueba automatizada cita el RF y el CP en su nombre, y quedan auditoría y evento cuando hay cambio persistente.

### 1.1 Bus de eventos de dominio (T11 §5.1)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-WFL-0001 | RF-WFL-001; T11 §5.1; PRO-O0-07 | O0 | Núcleo | integración | TEN-001 con WF-CAT-ALTA-SERVICIO: Alta de servicio M02 Portal, atención Solicitud → documentación → factibilidad (M10) → aprobación → instalación (M10) → activación 15 días hábiles | Todo cambio de estado de negocio que interese a otro módulo se publica como evento de dominio vía outbox en la **misma transacción** del cambio (servicio `publish()` de T01). | Si la transacción aborta, no existe evento; si confirma, el evento existe aunque el relay esté caído. |
| CP-WFL-0002 | RF-WFL-002; T11 §5.1; PRO-O0-07 | O0 | Núcleo | funcional | TEN-001 con Cooperativa Ejemplo Sur: TEN-002 USR-ADM-B (T-ADM); se usa para las pruebas de aislamiento | Sobre estándar obligatorio (§12.1): `eventId` UUIDv7, `type`, `schemaVersion`, `tenantId`, `occurredAt`, `recordedAt`, `aggregateType`, `aggregateId`, `aggregateVersion`, `correlationId`, `causationId`, `actor`, `sourceModule`… | Un evento sin `correlationId` o con `type` fuera del catálogo es rechazado por `publish()` en pruebas y en ejecución. |
| CP-WFL-0003 | RF-WFL-003; T11 §5.1; PRO-O0-07 | O0 | Núcleo | funcional | TEN-001 con Cooperativa Demo Villa Ficticia: TEN-001 USR-ADM-01 (T-ADM), USR-CAJ-01 (cajero, sucursal Centro), USR-TES-01 (tesorera), USR-GER-01 (gerente), USR-SGE-01 (subgerente), USR-ATE-01 y… | Nombre `<mod>.<entidad>.<hecho en pasado>` en camelCase. El módulo es el código de tres letras del anexo dueño y el hecho es un verbo en pasado o un sustantivo de resultado. | `npm run check:events` falla ante nombres en kebab-case, prefijos inexistentes (`cli`, `pag`, `inv`, `col`, `ten`) o duplicados. |
| CP-WFL-0004 | RF-WFL-004; T11 §5.1; PRO-O0-07 | O0 | Núcleo | funcional | TEN-001 con Tipo documental `acta` de migración (plataforma; agregado el 5-11-2026 por PA-MIG-20 de T07, Asumida DEC-072): `DOC-ACTA-MIG` "Acta de aceptación de la migración": `category = legal`, `allowedSubjects = [migrationProject]`, `mimeTypes = [application/pdf]`… | Catálogo único de eventos `eventTypes` generado desde `packages/shared/events` (esquema Zod por tipo y versión), con productor, consumidores registrados, sensibilidad, visibilidad (`internal`, `public`) y estado (`active`, `deprecated`). | La pantalla PAN-WFL-20 lista los tipos de §12 con su esquema, productor y consumidores. |
| CP-WFL-0005 | RF-WFL-005; T11 §5.1; PRO-O0-07 | O0 | Núcleo | funcional | TEN-001 con WF-TAR-TARIFA-SOCIAL: Solicitud de tarifa social M04 Portal, atención Recepción → verificación documental → verificación de padrón (espera EVT-TAR-014) → resolución →… | Versionado de esquema compatible hacia atrás: agregar campos opcionales no cambia la versión; quitar o cambiar semántica crea `schemaVersion` nueva y ambas versiones conviven durante `PRM-WFL-003` días. | Un consumidor de v1 sigue recibiendo v1 mientras el productor publica v2 en paralelo. |
| CP-WFL-0006 | RF-WFL-006; T11 §5.1; PRO-O0-07 | O0 | Núcleo | regla | TEN-001 con SIG-SIMPLE-CAMPO: `simple` (trazo en pantalla + geolocalización + huella) Socio Actas de conformidad (TPL-TEC-02) | Payload mínimo: identificadores y datos necesarios para decidir, **sin datos personales** salvo los imprescindibles y marcados (`piiLevel`). Los importes viajan como string decimal con `currency` y nunca como `Number`. | Prueba de catálogo: ningún esquema declara `number` para un campo de importe; los eventos con `piiLevel = personal` no son `public`. |
| CP-WFL-0007 | RF-WFL-007; T11 §5.1; PRO-O0-07 | O0 | Núcleo | integración | TEN-001 con Tipo documental `acta` de migración (plataforma; agregado el 5-11-2026 por PA-MIG-20 de T07, Asumida DEC-072): `DOC-ACTA-MIG` "Acta de aceptación de la migración": `category = legal`, `allowedSubjects = [migrationProject]`, `mimeTypes = [application/pdf]`… | Suscripciones declaradas por manifiesto de módulo (`eventSubscriptions`): consumidor, tipo, versión aceptada, cola, filtro opcional y política de reintentos. | Un consumidor no declarado no recibe eventos; el arranque falla si un consumidor apunta a un tipo inexistente. |
| CP-WFL-0008 | RF-WFL-008; T11 §5.1; PRO-O0-07 | O0 | Núcleo | integración | TEN-001 con TPL-VEN-02: Remito de entrega M11 PDF O8 | Entrega **al menos una vez**: el consumidor es idempotente por (`consumer`, `eventId`) registrando `inboxReceipts` en la misma transacción que su efecto. | Entregar el mismo evento dos veces produce un solo efecto (ESC-02). |
| CP-WFL-0009 | RF-WFL-009; T11 §5.1; PRO-O0-07 | O0 | Núcleo | funcional | TEN-001 con Tipo documental `acta` de migración (plataforma; agregado el 5-11-2026 por PA-MIG-20 de T07, Asumida DEC-072): `DOC-ACTA-MIG` "Acta de aceptación de la migración": `category = legal`, `allowedSubjects = [migrationProject]`, `mimeTypes = [application/pdf]`… | Orden por agregado: los eventos de un mismo `aggregateId` se procesan por consumidor en orden de `aggregateVersion`. Si llega un evento con versión mayor a la esperada, se reencola con espera breve hasta `PRM-WFL-004` intentos y luego pasa… | `cat.contract.activated` (v3) no se aplica antes que `cat.contract.requested` (v1) en el mismo consumidor. |
| CP-WFL-0010 | RF-WFL-010; T11 §5.1; PRO-O1-15 | O1 | Núcleo | regla | TEN-001 con POL-FAC-APROBAR-LOTE: `fac.billingRun.approve` Único T-FAC supervisor Operador del lote ≠ aprobador | Bandeja operativa del tenant (`operationalInboxItems`): eventos agotados con `businessImpact`, jobs fallidos, operaciones `failed`/`uncertain` y excepciones de lote, explicados en lenguaje funcional, con responsable, acción sugerida y… | Un evento de `cob.payment.confirmed` que no pudo imputar en M15 aparece como "Cobro sin asiento contable" en la bandeja del contador. |
| CP-WFL-0011 | RF-WFL-011; T11 §5.1; PRO-O1-15 | O1 | Núcleo | funcional | TEN-001 con Tipo documental `acta` de migración (plataforma; agregado el 5-11-2026 por PA-MIG-20 de T07, Asumida DEC-072): `DOC-ACTA-MIG` "Acta de aceptación de la migración": `category = legal`, `allowedSubjects = [migrationProject]`, `mimeTypes = [application/pdf]`… | Reproceso funcional: desde la bandeja operativa, un usuario con `wfl.eventos.reprocesar` reencola el evento al mismo consumidor con la misma clave; el descarte exige motivo y queda auditado. | Reprocesar no duplica efectos; descartar sin motivo devuelve 422. |
| CP-WFL-0012 | RF-WFL-012; T11 §5.1; PRO-O11-05 | O11 | Estándar | funcional | TEN-001 con POL-CFG-PUBLICAR-VERSION: `cfg.configVersion.publish` Por clase de cambio (T04) T-ADM o T-GER Autor ≠ aprobador (CU-GOB-01) | Reproducción (*replay*) de eventos de un rango para **un** consumidor y **un** tenant, en job de clase `export`, para reconstruir proyecciones (bandeja, BI, saldos). | La reconstrucción de `workItems` desde eventos coincide con la proyección en línea. |
| CP-WFL-0013 | RF-WFL-013; T11 §5.1; PRO-O1-15 | O1 | Estándar | regla | TEN-001 con Tipo documental `acta` de migración (plataforma; agregado el 5-11-2026 por PA-MIG-20 de T07, Asumida DEC-072): `DOC-ACTA-MIG` "Acta de aceptación de la migración": `category = legal`, `allowedSubjects = [migrationProject]`, `mimeTypes = [application/pdf]`… | Trazabilidad punta a punta: `correlationId` heredado de la request o job origen y `causationId` = `eventId` causante; la vista de un agregado muestra la cadena de eventos y efectos. | Desde una factura se navega a sus eventos, al asiento contable y a la obligación de cuenta corriente. |
| CP-WFL-0014 | RF-WFL-014; T11 §5.1; PRO-O11-03 | O11 | Estándar | integración | TEN-001 con Tipos documentales: `DOC-ID-DNI`, `DOC-CUIT-CONST`, `DOC-DOM-CONST`, `DOC-INC-CONST`, `DOC-PODER`, `DOC-DEFUNCION`, `DOC-ESCRITURA`, `DOC-CONTRATO-SERV`… | Eventos `public`: un subconjunto curado del catálogo se expone a terceros por T10 (webhooks y `/api/v1/ext`), con esquema estable y sin datos personales. | Solo los tipos marcados `public` aparecen en el catálogo de suscripciones de terceros. |
| CP-WFL-0015 | RF-WFL-015; T11 §5.1; PRO-O0-07 | O0 | Núcleo | funcional | TEN-001 con POL-FAC-APROBAR-LOTE: `fac.billingRun.approve` Único T-FAC supervisor Operador del lote ≠ aprobador | Conciliación de nombres: el catálogo registra los **alias** que hoy usan algunos consumidores (§12.4) y el chequeo de CI los rechaza a partir de la ola en la que el consumidor se implementa. | Un consumidor que se suscribe a `fac.batch.issued` falla en CI con sugerencia `fac.billingRun.issued`. |
| CP-WFL-0016 | RF-WFL-016; T11 §5.1; PRO-O0-07 | O0 | Núcleo | funcional | TEN-001 con TPL-WFL-03: Constancia de firma electrónica (evidencia) T11 PDF/A-2b O1 | Sin event sourcing: el estado vigente se guarda en las colecciones del módulo; los eventos son notificación y evidencia, no la fuente de verdad. | Borrar eventos publicados por TTL no altera estados de negocio. |
| CP-WFL-0017 | RF-WFL-017; T11 §5.1; PRO-O0-07 | O0 | Núcleo | funcional | TEN-001 con WF-CAT-CAMBIO-TITULAR: Cambio de titularidad M01 / M02 Atención Solicitud → verificar identidad (obligatorio) → libre deuda → firma de ambos → transferencia 10 días hábiles | Eventos de auditoría de negocio separados: la auditoría de cambios es de T02; un evento de dominio no reemplaza el registro de auditoría ni viceversa. | Un cambio sin consumidores igual queda en auditoría. |
### 1.2 Jobs, programación y corridas masivas (T11 §5.2)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-WFL-0020 | RF-WFL-020; T11 §5.2; PRO-O0-08 | O0 | Núcleo | integración | TEN-001 con POL-CFG-PUBLICAR-VERSION: `cfg.configVersion.publish` Por clase de cambio (T04) T-ADM o T-GER Autor ≠ aprobador (CU-GOB-01) | Catálogo `jobDefinitions` (§12.6–12.7) con nombre `<mod>:<proceso>`, módulo dueño, clase de cola de T01 (`interactive`, `integration`, `events`, `notifications`, `batch`, `export`, `ai`, `maintenance`), prioridad, concurrencia por tenant… | Un job sin entrada en el catálogo no se puede encolar. |
| CP-WFL-0021 | RF-WFL-021; T11 §5.2; PRO-O0-08 | O0 | Núcleo | funcional | TEN-001 con POL-FAC-ANULAR-MASIVO: `fac.invoice.annulBulk` Único T-FAC + T-GER Solicitante ≠ aprobador | Todo proceso masivo corre como job, nunca en la request HTTP; la API devuelve `202` con `bulkRunId` o `jobRunId`. | Emitir 10.000 facturas no bloquea la interfaz; la pantalla muestra progreso. |
| CP-WFL-0022 | RF-WFL-022; T11 §5.2; PRO-O0-08 | O0 | Núcleo | seguridad | TEN-001 con Cooperativa Ejemplo Sur: TEN-002 USR-ADM-B (T-ADM); se usa para las pruebas de aislamiento | Programación por tenant (`jobSchedules`): cron de 5 campos evaluado en la **zona horaria del tenant** (default `America/Argentina/Cordoba`), ventana permitida (por ejemplo 22:00–06:00), días hábiles opcionales según calendario T04, fecha… | Un cron "0 2 * * *" corre a las 02:00 de Córdoba para TEN-001 y a las 02:00 de la zona de otro tenant. |
| CP-WFL-0023 | RF-WFL-023; T11 §5.2; PRO-O1-15 | O1 | Estándar | funcional | TEN-001 con Tipo documental `acta` de migración (plataforma; agregado el 5-11-2026 por PA-MIG-20 de T07, Asumida DEC-072): `DOC-ACTA-MIG` "Acta de aceptación de la migración": `category = legal`, `allowedSubjects = [migrationProject]`, `mimeTypes = [application/pdf]`… | El administrador del tenant puede reprogramar los jobs marcados `tenantSchedulable` dentro de la ventana permitida por plataforma; no puede programar fuera de ella ni cambiar la clase de cola. | Intentar programar `fac:programar-ciclos` a las 14:00 si la ventana es nocturna devuelve 422 con la ventana válida. |
| CP-WFL-0024 | RF-WFL-024; T11 §5.2; PRO-O0-08 | O0 | Núcleo | funcional | TEN-001 con Cooperativa Demo Villa Ficticia: TEN-001 USR-ADM-01 (T-ADM), USR-CAJ-01 (cajero, sucursal Centro), USR-TES-01 (tesorera), USR-GER-01 (gerente), USR-SGE-01 (subgerente), USR-ATE-01 y… | Fan-out por tenant: los jobs programados se materializan por tenant activo con el módulo habilitado; un tenant suspendido no recibe ejecuciones (`pla.tenant.suspended`). | Con TEN-002 suspendido, `mor:evaluar-mora` no corre para él. |
| CP-WFL-0025 | RF-WFL-025; T11 §5.2; PRO-O0-08 | O0 | Núcleo | funcional | TEN-001 con POL-FAC-APROBAR-LOTE: `fac.billingRun.approve` Único T-FAC supervisor Operador del lote ≠ aprobador | Equidad entre tenants: la concurrencia por tenant y clase de cola se limita (semáforo de T01) para que un tenant grande no demore a los demás. | Con TEN-001 corriendo 2 lotes `batch`, un lote de TEN-002 arranca sin esperar. |
| CP-WFL-0026 | RF-WFL-026; T11 §5.2; PRO-O0-08 | O0 | Núcleo | funcional | TEN-001 con Cooperativa Demo Villa Ficticia: TEN-001 USR-ADM-01 (T-ADM), USR-CAJ-01 (cajero, sucursal Centro), USR-TES-01 (tesorera), USR-GER-01 (gerente), USR-SGE-01 (subgerente), USR-ATE-01 y… | Corridas masivas (`bulkRuns`) con universo congelado, total, procesados, exitosos, excepciones, progreso porcentual, tiempo estimado, pausa, reanudación desde cursor y cancelación cooperativa. | CU-LOT-01: de 100 obligaciones se emiten 98 y 2 quedan en excepciones; reanudar no reemite las 98. |
| CP-WFL-0027 | RF-WFL-027; T11 §5.2; PRO-O4-08 | O4 | Núcleo | integración | TEN-001 con Corrida: LOT-2026-00012 (98 ítems emitidos y 2 excepciones) y su reproceso LOT-2026-00013 | Pausa automática ante fallo global (credencial ARCA vencida, conector caído): la corrida pasa a `paused` con motivo sistémico; se reanuda al recuperarse o manualmente. | Con `fis.authorization.globalFailure`, los lotes en autorización del tenant pausan; con `globalRecovered`, se reanudan. |
| CP-WFL-0028 | RF-WFL-028; T11 §5.2; PRO-O4-08 | O4 | Núcleo | funcional | TEN-001 con Corrida: LOT-2026-00012 (98 ítems emitidos y 2 excepciones) y su reproceso LOT-2026-00013 | Bandeja de excepciones de lote: cada ítem fallido con motivo codificado, módulo y rol responsable, acción (corregir, excluir, reintentar) y reproceso solo de excepciones. | Resolver 2 excepciones y reprocesar crea una corrida `reprocess` con 2 ítems. |
| CP-WFL-0029 | RF-WFL-029; T11 §5.2; PRO-O1-15 | O1 | Estándar | seguridad | TEN-001 con Corrida: LOT-2026-00012 (98 ítems emitidos y 2 excepciones) y su reproceso LOT-2026-00013 | Resultado de corrida descargable (XLSX/CSV) con detalle por ítem y resumen; el archivo vive en `ga-<env>-exports` con vencimiento. | El responsable descarga el detalle; otro usuario sin permiso recibe 404. |
| CP-WFL-0030 | RF-WFL-030; T11 §5.2; PRO-O1-15 | O1 | Estándar | funcional | TEN-001 con SIG-SIMPLE-CAMPO: `simple` (trazo en pantalla + geolocalización + huella) Socio Actas de conformidad (TPL-TEC-02) | Pantalla de jobs del tenant (PAN-WFL-21): corridas, programaciones, próximas ejecuciones en hora local, últimas fallas y acciones permitidas. | Un T-ADM ve solo sus corridas; P-OPS ve la vista global en T01. |
| CP-WFL-0031 | RF-WFL-031; T11 §5.2; PRO-O4-08 | O4 | Núcleo | integración | TEN-001 con POL-CMP-APROBAR-OP: `cmp.paymentOrder.approve` Único T-GER Quien registró la factura ≠ aprobador | Los jobs con efecto externo (pagos, ARCA, aprovisionamiento) nunca reintentan a ciegas un envío de resultado desconocido: pasan a `uncertain` y se concilian antes de reenviar. | Un timeout de ARCA deja la factura `uncertain` y `fis:conciliar-incierto` consulta antes de reintentar. |
### 1.3 Patrón de operaciones (MER-012) (T11 §5.3)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-WFL-0040 | RF-WFL-040; T11 §5.3; PRO-O0-08 | O0 | Núcleo | funcional | TEN-001 con POL-COB-ANULAR-RECIBO: `cob.receipt.void` Hasta 50.000 / más T-TES / T-TES + T-GER Solicitante ≠ aprobador | Toda acción sensible se modela como **operación** con número propio (`OPE-AAAA-NNNNNN`), tipo, sujeto, solicitante, motivo, importe, atributos de riesgo, estado y vínculo a la aprobación. | Anular un recibo crea `OPE-2026-000123` antes de cualquier efecto. |
| CP-WFL-0041 | RF-WFL-041; T11 §5.3; PRO-O1-15 | O1 | Núcleo | funcional | TEN-001 con Configuración pendiente: Cambio de BON-VAR-30 del 30 % al 20 % pendiente de aprobación (CU-GOB-01), con la alerta ALT-DEMO-001 de T01 y la evidencia AUD-DEMO-001 de T02 | **Sin efectos hasta aprobar**: el módulo dueño no ejecuta el handler mientras la operación no esté `approved`; las lecturas muestran "pendiente de aprobación". | El recibo sigue vigente y cobrable hasta la aprobación; la caja ve la marca "anulación solicitada". |
| CP-WFL-0042 | RF-WFL-042; T11 §5.3; PRO-O1-15 | O1 | Núcleo | funcional | TEN-001 con Tipo documental `acta` de migración (plataforma; agregado el 5-11-2026 por PA-MIG-20 de T07, Asumida DEC-072): `DOC-ACTA-MIG` "Acta de aceptación de la migración": `category = legal`, `allowedSubjects = [migrationProject]`, `mimeTypes = [application/pdf]`… | Catálogo de tipos de operación (`operationTypes`) con módulo dueño, política de aprobación por defecto, plazo de decisión, plazo de ejecución, compensación disponible, si admite lote y si requiere evidencia (§7.3, semilla de 45 tipos). | El tipo `cob.receipt.void` exige aprobación de T-TES si el importe supera PRM-COB y evidencia del motivo. |
| CP-WFL-0043 | RF-WFL-043; T11 §5.3; PRO-O0-08 | O0 | Núcleo | integración | TEN-001 con POL-TES-EJECUTAR-PAGO: `tes.paymentExecution.execute` Hasta 1.000.000 / hasta 5.000.000 / más T-TES / T-TES + T-GER / T-GER + consejo (quórum PRM-WFL-033) Firma conjunta… | Ejecución idempotente: el handler recibe `operationId` como clave; reintentar una operación ya completada devuelve el mismo resultado. | Doble clic en "Ejecutar" produce un solo efecto. |
| CP-WFL-0044 | RF-WFL-044; T11 §5.3; PRO-O1-15 | O1 | Núcleo | funcional | TEN-001 con POL-PER-TRANSFERENCIA: `per.transfer.execute` Único T-ATE supervisor Solicitante ≠ aprobador | Pasos de saga (`operationSteps`) cuando la operación toca varios módulos: cada paso con comando, estado, intentos, resultado y compensación; los pasos se confirman de a uno y se reparan desde el último confirmado. | Una transferencia de titularidad que falla en M07 repara solo M07 y no repite M02. |
| CP-WFL-0045 | RF-WFL-045; T11 §5.3; PRO-O1-15 | O1 | Núcleo | funcional | TEN-001 con Configuración pendiente: Cambio de BON-VAR-30 del 30 % al 20 % pendiente de aprobación (CU-GOB-01), con la alerta ALT-DEMO-001 de T01 y la evidencia AUD-DEMO-001 de T02 | Estados observables Pendiente, Confirmado, Fallido e Incierto en la interfaz, con traducción funcional (`dict:wfl.operationState.*`). | El operador ve "Resultado incierto: se está verificando con el banco" y no un código técnico. |
| CP-WFL-0046 | RF-WFL-046; T11 §5.3; PRO-O4-09 | O4 | Núcleo | funcional | TEN-001 con POL-INS-REINTEGRO-CAPITAL: `ins.capital.refund.approve` Único Consejo (quórum) — | Conciliación de inciertos: job por tipo con consulta al sistema externo; si no se resuelve en `PRM-WFL-012` horas, pasa a la bandeja operativa para resolución manual con evidencia. | Un reintegro incierto por 48 h aparece con la acción "Registrar resultado verificado". |
| CP-WFL-0047 | RF-WFL-047; T11 §5.3; PRO-O4-09 | O4 | Estándar | funcional | TEN-001 con Operaciones: Anulación del recibo R-0001-00004567 (ARS 18.450,00, aprobada y ejecutada), ejecución de la OP-2026-000210 (ARS 3.200.000,00, pendiente del segundo… | Operaciones en lote: una solicitud agrupa N sujetos (por ejemplo, condonar intereses a 30 cuentas) con una sola aprobación y ejecución por ítem con resultado individual. | 30 ítems aprobados juntos generan 30 resultados; 1 falla sin afectar a los otros 29. |
| CP-WFL-0048 | RF-WFL-048; T11 §5.3; PRO-O1-15 | O1 | Estándar | regla | TEN-001 con POL-TES-EJECUTAR-PAGO: `tes.paymentExecution.execute` Hasta 1.000.000 / hasta 5.000.000 / más T-TES / T-TES + T-GER / T-GER + consejo (quórum PRM-WFL-033) Firma conjunta… | Vencimiento: una operación no decidida en su plazo pasa a `expired`; una aprobada no ejecutada en `PRM-WFL-011` horas exige revalidación. | Una anulación aprobada hace 3 días se revalida antes de ejecutar. |
| CP-WFL-0049 | RF-WFL-049; T11 §5.3; PRO-O1-15 | O1 | Estándar | funcional | TEN-001 con POL-COB-ANULAR-RECIBO: `cob.receipt.void` Hasta 50.000 / más T-TES / T-TES + T-GER Solicitante ≠ aprobador | Cancelación por el solicitante mientras esté `pendingApproval`; cancelación administrativa con motivo en cualquier estado no terminal previo a la ejecución. | Cancelar una operación `executing` devuelve 409. |
| CP-WFL-0050 | RF-WFL-050; T11 §5.3; PRO-O1-15 | O1 | Núcleo | funcional | TEN-001 con POL-TES-EJECUTAR-PAGO: `tes.paymentExecution.execute` Hasta 1.000.000 / hasta 5.000.000 / más T-TES / T-TES + T-GER / T-GER + consejo (quórum PRM-WFL-033) Firma conjunta… | Revalidación al ejecutar: el handler revalida precondiciones del dominio (saldo, estado, período abierto); si cambiaron, la operación pasa a `failed` con motivo y no se aplica parcialmente. | Si el período contable se cerró entre la aprobación y la ejecución, la anulación falla con `con/period-closed`. |
| CP-WFL-0051 | RF-WFL-051; T11 §5.3; PRO-O1-15 | O1 | Núcleo | funcional | TEN-001 con WF-TAR-TARIFA-SOCIAL: Solicitud de tarifa social M04 Portal, atención Recepción → verificación documental → verificación de padrón (espera EVT-TAR-014) → resolución →… | Toda operación genera eventos `wfl.operation.*` (§12.2) y su historia es visible en el expediente del sujeto. | El expediente de la cuenta muestra solicitud, aprobaciones y resultado. |
### 1.4 Máquinas de estado canónicas (T11 §5.4)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-WFL-0060 | RF-WFL-060; T11 §5.4; PRO-O1-15 | O1 | Núcleo | seguridad | TEN-001 con Tipo documental `acta` de migración (plataforma; agregado el 5-11-2026 por PA-MIG-20 de T07, Asumida DEC-072): `DOC-ACTA-MIG` "Acta de aceptación de la migración": `category = legal`, `allowedSubjects = [migrationProject]`, `mimeTypes = [application/pdf]`… | Librería común `defineStateMachine` con estados, transiciones, actor permitido (capability), guardas (precondiciones puras), efectos (comandos y eventos), reversión y si requiere operación aprobada. | Una transición no declarada lanza `wfl/invalid-transition` (409). |
| CP-WFL-0061 | RF-WFL-061; T11 §5.4; PRO-O1-15 | O1 | Núcleo | funcional | TEN-001 con POL-FAC-APROBAR-LOTE: `fac.billingRun.approve` Único T-FAC supervisor Operador del lote ≠ aprobador | Cada módulo declara sus máquinas (contrato, factura, OT, caso, lote, liquidación, OP) y las registra en `stateMachineRegistry` al desplegar; T11 no guarda el estado de la entidad. | El estado del contrato vive en `serviceContracts` de M02; T11 solo conoce la definición. |
| CP-WFL-0062 | RF-WFL-062; T11 §5.4; PRO-O1-15 | O1 | Núcleo | funcional | TEN-001 con WF-CAT-CAMBIO-TITULAR: Cambio de titularidad M01 / M02 Atención Solicitud → verificar identidad (obligatorio) → libre deuda → firma de ambos → transferencia 10 días hábiles | Historial de transiciones en la colección del módulo dueño con estado anterior, nuevo, fecha efectiva, fecha de registro, actor, motivo y `operationId` si aplica. | La línea de tiempo del contrato muestra cada cambio con quién y por qué. |
| CP-WFL-0063 | RF-WFL-063; T11 §5.4; PRO-O2-01 | O2 | Estándar | funcional | TEN-001 con SIG-SOCIO-OTP: `electronic` (OTP por SMS, email o WhatsApp) Socio Convenios de pago, solicitudes de servicio, cambio de titularidad | Estados operativos configurables por el tenant, mapeados a un canónico y con banderas (visible al socio, notificar, pausa de SLA, requiere aprobación). | No se puede guardar un conjunto que deje un estado canónico obligatorio sin operativo. |
| CP-WFL-0064 | RF-WFL-064; T11 §5.4; PRO-O1-15 | O1 | Núcleo | funcional | TEN-001 con POL-FAC-APROBAR-LOTE: `fac.billingRun.approve` Único T-FAC supervisor Operador del lote ≠ aprobador | Transiciones que requieren aprobación se declaran como tales en la máquina y crean una operación; la tabla de estados define cuáles, el workflow las ejecuta. | `active → terminated` forzado por supervisor genera la operación `cat.contract.forceStatus`. |
| CP-WFL-0065 | RF-WFL-065; T11 §5.4; PRO-O1-15 | O1 | Estándar | funcional | TEN-001 con Cooperativa Demo Villa Ficticia: TEN-001 USR-ADM-01 (T-ADM), USR-CAJ-01 (cajero, sucursal Centro), USR-TES-01 (tesorera), USR-GER-01 (gerente), USR-SGE-01 (subgerente), USR-ATE-01 y… | Diagrama de solo lectura de cada máquina en la administración (PAN-WFL-05), generado desde la definición. | El diagrama coincide con la definición desplegada. |
| CP-WFL-0066 | RF-WFL-066; T11 §5.4; PRO-O3-05 | O3 | Núcleo | regla | TEN-001 con Tipo documental `acta` de migración (plataforma; agregado el 5-11-2026 por PA-MIG-20 de T07, Asumida DEC-072): `DOC-ACTA-MIG` "Acta de aceptación de la migración": `category = legal`, `allowedSubjects = [migrationProject]`, `mimeTypes = [application/pdf]`… | Reemplazo de `TRANSAC` (códigos 1–8 con efectos al cerrar OT): los efectos por tipo de operación técnica se declaran en la máquina de OT de M10 y en reglas de M02, no en una tabla global. | El cierre de una OT de reconexión publica `tec.workOrder.closed` y M02 activa el contrato. |
### 1.5 Workflow configurable de trámites (T11 §5.5)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-WFL-0070 | RF-WFL-070; T11 §5.5; PRO-O2-01 | O2 | Núcleo | funcional | TEN-001 con WF-CFG-PUBLICAR-CONFIG: Publicación de configuración T04 Admin Borrador → simulación → aprobación (POL-CFG-PUBLICAR-VERSION) → programación 2 días hábiles | Diseñador de workflows (PAN-WFL-06) con nodos: inicio, tarea humana, aprobación, acción automática, espera de evento, temporizador, decisión (condición), paralelo y unión, subproceso y fin; validación estructural antes de publicar. | No se publica un workflow con nodos sin salida o ciclos sin temporizador. |
| CP-WFL-0071 | RF-WFL-071; T11 §5.5; PRO-O2-01 | O2 | Núcleo | migración | TEN-001 con WF-CFG-PUBLICAR-CONFIG: Publicación de configuración T04 Admin Borrador → simulación → aprobación (POL-CFG-PUBLICAR-VERSION) → programación 2 días hábiles | Definiciones versionadas (`workflowVersions`): borrador, en revisión, publicada, retirada; las instancias en curso siguen su versión; la migración de instancias a versión nueva es explícita y auditada. | Publicar v2 no cambia el recorrido de 40 instancias abiertas en v1. |
| CP-WFL-0072 | RF-WFL-072; T11 §5.5; PRO-O2-01 | O2 | Núcleo | funcional | TEN-001 con Cooperativa Demo Villa Ficticia: TEN-001 USR-ADM-01 (T-ADM), USR-CAJ-01 (cajero, sucursal Centro), USR-TES-01 (tesorera), USR-GER-01 (gerente), USR-SGE-01 (subgerente), USR-ATE-01 y… | Responsables por rol, área, sucursal, relación con el sujeto (por ejemplo, "responsable de la zona del suministro"), usuario concreto o expresión de fuente de datos; reparto por cola, ronda o menor carga. | Una tarea asignada al área "Atención Villa Ficticia" la toma el primer agente libre según PRM-WFL-022. |
| CP-WFL-0073 | RF-WFL-073; T11 §5.5; PRO-O2-01 | O2 | Núcleo | integración | TEN-001 con WF-TAR-TARIFA-SOCIAL: Solicitud de tarifa social M04 Portal, atención Recepción → verificación documental → verificación de padrón (espera EVT-TAR-014) → resolución →… | Acciones tipadas (`actionCatalog`): cada módulo registra comandos invocables desde workflows con esquema de parámetros, permisos del actor técnico, idempotencia y compensación; reemplazan los scripts SQL. | Un workflow de tarifa social llama `tar.enrollment.create` con parámetros validados; no existe forma de ejecutar SQL. |
| CP-WFL-0074 | RF-WFL-074; T11 §5.5; PRO-O2-01 | O2 | Núcleo | integración | TEN-001 con Cooperativa Ejemplo Sur: TEN-002 USR-ADM-B (T-ADM); se usa para las pruebas de aislamiento | Espera de eventos: un nodo puede esperar un evento correlacionado (por ejemplo, `tec.workOrder.closed` de la OT creada en el paso anterior) con timeout. | La instancia avanza sola cuando M10 cierra la OT. |
| CP-WFL-0075 | RF-WFL-075; T11 §5.5; PRO-O2-01 | O2 | Estándar | regla | TEN-001 con WF-TAR-TARIFA-SOCIAL: Solicitud de tarifa social M04 Portal, atención Recepción → verificación documental → verificación de padrón (espera EVT-TAR-014) → resolución →… | Vencimiento del trámite y acciones al vencer (equivalente a `DIAS_VENCE` y acción de vencimiento con marca `ACCIONADO`), ejecutadas una sola vez. | Una constancia de tarifa social vencida dispara una sola vez `tar.enrollment.end`. |
| CP-WFL-0076 | RF-WFL-076; T11 §5.5; PRO-O2-01 | O2 | Estándar | funcional | TEN-001 con WF-CAT-CAMBIO-TITULAR: Cambio de titularidad M01 / M02 Atención Solicitud → verificar identidad (obligatorio) → libre deuda → firma de ambos → transferencia 10 días hábiles | Plantillas de workflow de plataforma (semilla §18.3) que el tenant adopta y ajusta dentro de puntos de extensión (responsables, SLA, formularios, textos), sin romper las acciones obligatorias del dominio. | Un tenant no puede quitar el paso "verificar identidad" del workflow de cambio de titularidad. |
| CP-WFL-0077 | RF-WFL-077; T11 §5.5; PRO-O2-01 | O2 | Núcleo | funcional | TEN-001 con SIG-SOCIO-OTP: `electronic` (OTP por SMS, email o WhatsApp) Socio Convenios de pago, solicitudes de servicio, cambio de titularidad | Instancias con sujeto principal y sujetos relacionados, datos de entrada, formulario, adjuntos, historial de nodos, tareas, comentarios internos y públicos. | El socio ve los comentarios públicos y el estado; no ve las notas internas. |
| CP-WFL-0078 | RF-WFL-078; T11 §5.5; PRO-O2-01 | O2 | Estándar | funcional | TEN-001 con Cooperativa Ejemplo Sur: TEN-002 USR-ADM-B (T-ADM); se usa para las pruebas de aislamiento | Suspensión y reanudación de instancias (por ejemplo, "esperando documentación del socio") con pausa de SLA. | El SLA no corre mientras la instancia está en `waitingRequester`. |
| CP-WFL-0079 | RF-WFL-079; T11 §5.5; PRO-O1-15 | O1 | Núcleo | funcional | TEN-001 con WF-CAT-BAJA-SERVICIO: Baja de servicio M02 Portal, atención, baja pública (M19) Solicitud → constancia en 24 h → retiro de equipos → baja efectiva 5 días hábiles | Reasignación manual y automática de tareas por baja, licencia o suspensión del responsable. | Al suspender a un usuario, sus tareas pasan a su área en menos de 5 minutos. |
| CP-WFL-0080 | RF-WFL-080; T11 §5.5; PRO-O2-01 | O2 | Núcleo | regla | TEN-001 con WF-TAR-TARIFA-SOCIAL: Solicitud de tarifa social M04 Portal, atención Recepción → verificación documental → verificación de padrón (espera EVT-TAR-014) → resolución →… | Iniciación de trámites desde la PWA del socio, el admin, la API interna de módulos o un evento; los trámites habilitados para el socio se publican en "Mis trámites". | El socio inicia "Solicitud de tarifa social" desde la PWA y recibe número y constancia. |
| CP-WFL-0081 | RF-WFL-081; T11 §5.5; PRO-O2-01 | O2 | Estándar | funcional | TEN-001 con WF-CFG-PUBLICAR-CONFIG: Publicación de configuración T04 Admin Borrador → simulación → aprobación (POL-CFG-PUBLICAR-VERSION) → programación 2 días hábiles | Simulación de workflow: recorrer una definición en borrador con datos de prueba sin efectos (acciones en modo simulación). | La simulación muestra el camino y los responsables que resolverían cada tarea. |
| CP-WFL-0082 | RF-WFL-082; T11 §5.5; PRO-O2-01 | O2 | Estándar | funcional | TEN-001 con WF-CRM-RECLAMO-FACTURACION: Reclamo de facturación M09 Todos Recepción → análisis (M05) → resolución (NC o rechazo) → respuesta 10 días hábiles | Indicadores por definición: abiertas, vencidas, tiempo medio por nodo, tasa de rechazo (§15). | El tablero muestra el cuello de botella del workflow. |
### 1.6 Formularios dinámicos tipados (T11 §5.6)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-WFL-0090 | RF-WFL-090; T11 §5.6; PRO-O2-01 | O2 | Núcleo | regla | TEN-001 con Tipo documental `acta` de migración (plataforma; agregado el 5-11-2026 por PA-MIG-20 de T07, Asumida DEC-072): `DOC-ACTA-MIG` "Acta de aceptación de la migración": `category = legal`, `allowedSubjects = [migrationProject]`, `mimeTypes = [application/pdf]`… | Diseñador de formularios versionados con tipos de campo: texto corto, texto largo, número entero, número decimal, importe (Decimal128 y moneda), fecha, fecha y hora, selección, selección múltiple, sí/no, referencia a entidad (persona… | Un campo CUIT con dígito verificador inválido no permite enviar. |
| CP-WFL-0091 | RF-WFL-091; T11 §5.6; PRO-O2-01 | O2 | Núcleo | regla | TEN-001 con WF-CAT-CAMBIO-PLAN: Cambio de plan M02 Portal, atención Solicitud → validación de permanencia → aprobación → cambio con vigencia 3 días hábiles | Validaciones declarativas: obligatoriedad, rangos, longitud, patrón, unicidad dentro del trámite, comparaciones entre campos; validación compartida cliente-servidor generada como esquema Zod. | La misma regla rechaza en la PWA y en la API. |
| CP-WFL-0092 | RF-WFL-092; T11 §5.6; PRO-O2-01 | O2 | Núcleo | funcional | TEN-001 con SIG-SIMPLE-CAMPO: `simple` (trazo en pantalla + geolocalización + huella) Socio Actas de conformidad (TPL-TEC-02) | Visibilidad y obligatoriedad condicional por valor de otros campos, por canal (PWA socio, admin, campo) y por rol; campos que completa solo el operador (equivalente a `REGISTRA_USER`). | El socio no ve "Observación de verificación"; el operador sí. |
| CP-WFL-0093 | RF-WFL-093; T11 §5.6; PRO-O2-01 | O2 | Núcleo | funcional | TEN-001 con Cooperativa Ejemplo Sur: TEN-002 USR-ADM-B (T-ADM); se usa para las pruebas de aislamiento | Fuentes de datos tipadas registradas por módulos (por ejemplo, "adherentes del contrato", "categorías del servicio", "sucursales") en lugar de consultas SQL libres. | No existe campo que acepte SQL. |
| CP-WFL-0094 | RF-WFL-094; T11 §5.6; PRO-O2-01 | O2 | Estándar | integración | TEN-001 con Cooperativa Ejemplo Sur: TEN-002 USR-ADM-B (T-ADM); se usa para las pruebas de aislamiento | Comparación contra fuentes oficiales mediante conectores (por ejemplo, datos de identidad validados), como paso de verificación y no como bloqueo silencioso. | Una diferencia queda marcada para el operador con el valor de cada fuente. |
| CP-WFL-0095 | RF-WFL-095; T11 §5.6; PRO-O2-01 | O2 | Núcleo | funcional | TEN-001 con SIG-SIMPLE-CAMPO: `simple` (trazo en pantalla + geolocalización + huella) Socio Actas de conformidad (TPL-TEC-02) | Envío del formulario: snapshot inmutable (`formSubmissions`) con la versión del formulario, valores, adjuntos y huella; las correcciones generan una nueva presentación vinculada. | Editar un dato después del envío crea la presentación 2 y conserva la 1. |
| CP-WFL-0096 | RF-WFL-096; T11 §5.6; PRO-O2-01 | O2 | Estándar | regla | TEN-001 con SIG-SOCIO-OTP: `electronic` (OTP por SMS, email o WhatsApp) Socio Convenios de pago, solicitudes de servicio, cambio de titularidad | Borradores del socio con vencimiento y aviso previo (coordinado con M19 `JOB-POR-01`). | Un borrador sin actividad 30 días se purga con sus adjuntos no confirmados. |
| CP-WFL-0097 | RF-WFL-097; T11 §5.6; PRO-O3-06 | O3 | Estándar | integración | TEN-001 con SIG-SIMPLE-CAMPO: `simple` (trazo en pantalla + geolocalización + huella) Socio Actas de conformidad (TPL-TEC-02) | Formularios disponibles offline en la PWA de campo con `clientMutationId` y resolución de conflictos al sincronizar. | Un acta de inspección cargada sin señal se sincroniza una sola vez. |
| CP-WFL-0098 | RF-WFL-098; T11 §5.6; PRO-O7-05 | O7 | Estándar | funcional | TEN-001 con Tipo documental `acta` de migración (plataforma; agregado el 5-11-2026 por PA-MIG-20 de T07, Asumida DEC-072): `DOC-ACTA-MIG` "Acta de aceptación de la migración": `category = legal`, `allowedSubjects = [migrationProject]`, `mimeTypes = [application/pdf]`… | Declaraciones juradas como formularios con aceptación y firma (por ejemplo, DDJJ de artefactos de gas, M02 PAN-CAT-25). | La DDJJ queda como documento firmado en el expediente del contrato. |
### 1.7 SLA, vencimientos y escalamiento (T11 §5.7)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-WFL-0100 | RF-WFL-100; T11 §5.7; PRO-O2-01 | O2 | Núcleo | funcional | TEN-001 con WF-CRM-MESA-ENTRADAS: Registro y pase de mesa de entradas M09 Presencial, email Registro → acuse → pase al área → respuesta → salida numerada → cierre 10 días hábiles | Políticas de SLA (`slaPolicies`) por definición, nodo, tipo de operación o tipo de tarea, en horas o días, hábiles o corridos, con calendario de T04 y horario laboral del área. | Un SLA de 2 días hábiles iniciado el viernes 17:00 vence el martes 17:00 si el lunes no es feriado. |
| CP-WFL-0101 | RF-WFL-101; T11 §5.7; PRO-O2-01 | O2 | Núcleo | funcional | TEN-001 con POL-TES-EJECUTAR-PAGO: `tes.paymentExecution.execute` Hasta 1.000.000 / hasta 5.000.000 / más T-TES / T-TES + T-GER / T-GER + consejo (quórum PRM-WFL-033) Firma conjunta… | Umbrales de alerta (por ejemplo, 75 % y 100 %) con acciones: avisar al responsable, avisar al supervisor, reasignar, sumar aprobador, elevar prioridad, expirar o ejecutar una acción tipada. | Al 100 % de una aprobación de compra, se agrega el gerente como aprobador alternativo. |
| CP-WFL-0102 | RF-WFL-102; T11 §5.7; PRO-O2-01 | O2 | Núcleo | funcional | TEN-001 con SIG-SOCIO-OTP: `electronic` (OTP por SMS, email o WhatsApp) Socio Convenios de pago, solicitudes de servicio, cambio de titularidad | Pausa y reanudación de SLA por estados que la declaran (espera del socio, espera de un tercero) con registro del tiempo pausado. | El informe muestra tiempo efectivo y tiempo en pausa. |
| CP-WFL-0103 | RF-WFL-103; T11 §5.7; PRO-O3-05 | O3 | Estándar | regla | TEN-001 con Cooperativa Demo Villa Ficticia: TEN-001 USR-ADM-01 (T-ADM), USR-CAJ-01 (cajero, sucursal Centro), USR-TES-01 (tesorera), USR-GER-01 (gerente), USR-SGE-01 (subgerente), USR-ATE-01 y… | Guardias de escalamiento por día, franja horaria y feriado (quién recibe fuera de horario). | Un vencimiento el domingo escala a la guardia del domingo. |
| CP-WFL-0104 | RF-WFL-104; T11 §5.7; PRO-O2-01 | O2 | Estándar | regla | TEN-001 con Cooperativa Demo Villa Ficticia: TEN-001 USR-ADM-01 (T-ADM), USR-CAJ-01 (cajero, sucursal Centro), USR-TES-01 (tesorera), USR-GER-01 (gerente), USR-SGE-01 (subgerente), USR-ATE-01 y… | Recalcular temporizadores al cambiar feriados (`cfg.holiday.changed`) solo para los no vencidos. | Agregar un feriado puente corre los vencimientos futuros, no los ya vencidos. |
| CP-WFL-0105 | RF-WFL-105; T11 §5.7; PRO-O2-01 | O2 | Núcleo | regla | TEN-001 con Tareas: TAR-001 "Revisar padrón de tarifa social" (mensual, con evidencia obligatoria) | Un solo motor de temporizadores (`slaTimers`) para workflow, tareas y aprobaciones; M09 usa sus propias políticas de SLA de casos sobre el mismo cálculo de calendario (`wfl.calendar.addBusinessTime`). | El cálculo de días hábiles de un caso y de una tarea da el mismo resultado. |
### 1.8 Aprobaciones (T11 §5.8)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-WFL-0110 | RF-WFL-110; T11 §5.8; PRO-O1-16 | O1 | Núcleo | regla | TEN-001 con WF-CAT-ALTA-SERVICIO: Alta de servicio M02 Portal, atención Solicitud → documentación → factibilidad (M10) → aprobación → instalación (M10) → activación 15 días hábiles | Políticas de aprobación (`approvalPolicies`) por tipo de operación o código de política, con versión y vigencia, que resuelven pasos según importe, moneda, área, sucursal, servicio, categoría, riesgo y atributos del sujeto. | Con tramo "≥ ARS 500.000 requiere gerencia", una OC de ARS 600.000 suma el paso de gerencia. |
| CP-WFL-0111 | RF-WFL-111; T11 §5.8; PRO-O1-16 | O1 | Núcleo | funcional | TEN-001 con POL-TES-EJECUTAR-PAGO: `tes.paymentExecution.execute` Hasta 1.000.000 / hasta 5.000.000 / más T-TES / T-TES + T-GER / T-GER + consejo (quórum PRM-WFL-033) Firma conjunta… | Modalidades: simple (un aprobador), secuencial multinivel, paralela todos, paralela N de M (quórum), comité con votación, doble firma (dos personas distintas) y firma conjunta (firmantes vigentes de un registro). | Una OP de ARS 3.000.000 exige 2 de los 3 firmantes vigentes. |
| CP-WFL-0112 | RF-WFL-112; T11 §5.8; PRO-O1-16 | O1 | Núcleo | seguridad | TEN-001 con Cooperativa Ejemplo Sur: TEN-002 USR-ADM-B (T-ADM); se usa para las pruebas de aislamiento | Separación de funciones dinámica: el solicitante nunca aprueba su solicitud; una persona no aprueba dos pasos de la misma solicitud; reglas de SoD de T02 (por ejemplo, quien registra el CBU no aprueba el pago). | El servidor rechaza con 403 `wfl/sod-violation` la aprobación del solicitante, aun con permiso. |
| CP-WFL-0113 | RF-WFL-113; T11 §5.8; PRO-O1-16 | O1 | Núcleo | regla | TEN-001 con Cooperativa Ejemplo Sur: TEN-002 USR-ADM-B (T-ADM); se usa para las pruebas de aislamiento | Prohibición de autoaprobación implícita: ninguna acción de proceso (por ejemplo, "procesar ítem de solicitud") aprueba por efecto secundario; la política "sin aprobación" es explícita, versionada y auditada. | Con política "sin aprobación hasta ARS 50.000", el registro muestra la regla aplicada. |
| CP-WFL-0114 | RF-WFL-114; T11 §5.8; PRO-O1-16 | O1 | Núcleo | funcional | TEN-001 con POL-CMP-APROBAR-OC: `cmp.purchaseOrder.approve` Hasta 500.000 / hasta 3.000.000 / más Jefe de área / + T-GER / + consejo Solicitante ≠ aprobador | Límites de importe del aprobador desde su asignación de rol (T02, marca $) validados al decidir. | Un aprobador con límite ARS 200.000 no puede aprobar ARS 250.000; se escala. |
| CP-WFL-0115 | RF-WFL-115; T11 §5.8; PRO-O1-16 | O1 | Núcleo | seguridad | TEN-001 con POL-CMP-APROBAR-OC: `cmp.purchaseOrder.approve` Hasta 500.000 / hasta 3.000.000 / más Jefe de área / + T-GER / + consejo Solicitante ≠ aprobador | Decisión con comentario (obligatorio al rechazar y configurable al aprobar), adjuntos de evidencia y autenticación reforzada (MFA reciente) en tipos sensibles. | Rechazar sin motivo devuelve 422. |
| CP-WFL-0116 | RF-WFL-116; T11 §5.8; PRO-O1-16 | O1 | Núcleo | funcional | TEN-001 con WF-CAT-ALTA-SERVICIO: Alta de servicio M02 Portal, atención Solicitud → documentación → factibilidad (M10) → aprobación → instalación (M10) → activación 15 días hábiles | Aprobación ligada al **contenido**: la solicitud guarda una huella (hash de importe, destino y parámetros relevantes); si cambia, las aprobaciones previas caducan. | Cambiar el CBU de una OP aprobada exige aprobarla de nuevo. |
| CP-WFL-0117 | RF-WFL-117; T11 §5.8; PRO-O1-16 | O1 | Núcleo | funcional | TEN-001 con POL-CMP-APROBAR-OC: `cmp.purchaseOrder.approve` Hasta 500.000 / hasta 3.000.000 / más Jefe de área / + T-GER / + consejo Solicitante ≠ aprobador | Aprobación diferida multipaso desde la bandeja (web y PWA del empleado con push de T09), incluida la decisión masiva de solicitudes homogéneas con validación por ítem. | Aprobar 15 solicitudes en bloque deja 15 decisiones individuales auditadas. |
| CP-WFL-0118 | RF-WFL-118; T11 §5.8; PRO-O1-16 | O1 | Estándar | regla | TEN-001 con Delegación: USR-GER-01 → USR-SGE-01, compras, límite de ARS 2.000.000, del 05-01-2027 al 20-01-2027 | Delegación temporal (`delegations`) con desde/hasta, alcance (tipos, áreas, límite de importe ≤ al del delegante), motivo; el delegado decide en nombre propio "por delegación de". | Una delegación vencida no permite decidir; la decisión muestra ambos nombres. |
| CP-WFL-0119 | RF-WFL-119; T11 §5.8; PRO-O1-16 | O1 | Núcleo | regla | TEN-001 con WF-TAR-TARIFA-SOCIAL: Solicitud de tarifa social M04 Portal, atención Recepción → verificación documental → verificación de padrón (espera EVT-TAR-014) → resolución →… | Vencimiento y escalamiento de pasos (RF-WFL-101); al expirar la solicitud, la operación pasa a `expired` y el solicitante es notificado. | Una solicitud no decidida en 5 días hábiles expira. |
| CP-WFL-0120 | RF-WFL-120; T11 §5.8; PRO-O1-16 | O1 | Estándar | funcional | TEN-001 con WF-CAT-ALTA-SERVICIO: Alta de servicio M02 Portal, atención Solicitud → documentación → factibilidad (M10) → aprobación → instalación (M10) → activación 15 días hábiles | Retiro de la solicitud por el solicitante mientras ningún paso fue decidido, o con motivo si ya hubo decisiones parciales. | Retirar tras la primera aprobación exige motivo. |
| CP-WFL-0121 | RF-WFL-121; T11 §5.8; PRO-O1-16 | O1 | Núcleo | funcional | TEN-001 con Configuración pendiente: Cambio de BON-VAR-30 del 30 % al 20 % pendiente de aprobación (CU-GOB-01), con la alerta ALT-DEMO-001 de T01 y la evidencia AUD-DEMO-001 de T02 | Co-autorización presencial (supervisor que se autentica en el mismo dispositivo) y autorización puntual diferida de un paso: se resuelven en T02 (`authorizationRequests`); T11 las muestra en la bandeja y no las duplica. | Una autorización de T02 pendiente aparece en la bandeja del supervisor con origen "Autorización puntual". |
| CP-WFL-0122 | RF-WFL-122; T11 §5.8; PRO-O10-03 | O10 | Estándar | funcional | TEN-001 con SIG-ACTA-INSTITUCIONAL: `digital` (proveedor licenciado por conector T06) Presidente y secretario (actas de asamblea y de consejo); síndico titular, o el suplente en… | Votación de comité (consejo): quórum, mayoría, abstención, voto registrado y acta generada con plantilla. | Una resolución con 4 de 7 votos favorables y quórum 5 se aprueba y queda en el acta. |
| CP-WFL-0123 | RF-WFL-123; T11 §5.8; PRO-O1-16 | O1 | Núcleo | funcional | TEN-001 con SIG-ACTA-INSTITUCIONAL: `digital` (proveedor licenciado por conector T06) Presidente y secretario (actas de asamblea y de consejo); síndico titular, o el suplente en… | Evidencia de cada decisión: aprobador, delegante, fecha, método de autenticación, huella de contenido, versión de la política aplicada y comentario. | La auditoría muestra la versión de política vigente al decidir. |
| CP-WFL-0124 | RF-WFL-124; T11 §5.8; PRO-O1-16 | O1 | Estándar | funcional | TEN-001 con Tipo documental `acta` de migración (plataforma; agregado el 5-11-2026 por PA-MIG-20 de T07, Asumida DEC-072): `DOC-ACTA-MIG` "Acta de aceptación de la migración": `category = legal`, `allowedSubjects = [migrationProject]`, `mimeTypes = [application/pdf]`… | Simulador de política: dado un tipo, importe y atributos, muestra quiénes aprobarían y en qué orden. | El administrador verifica la política antes de publicarla. |
### 1.9 Bandeja unificada del empleado (T11 §5.9)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-WFL-0130 | RF-WFL-130; T11 §5.9; PRO-O1-16 | O1 | Núcleo | integración | TEN-001 con POL-FAC-APROBAR-LOTE: `fac.billingRun.approve` Único T-FAC supervisor Operador del lote ≠ aprobador | Bandeja única (`workItems`) que proyecta: tareas de T11, pasos de aprobación, autorizaciones puntuales de T02, casos de M09 asignados, OT y visitas de M10 asignadas, excepciones de lote, operaciones detenidas, conflictos de sincronización… | Un supervisor ve en una sola lista 3 aprobaciones, 5 casos y 2 excepciones. |
| CP-WFL-0131 | RF-WFL-131; T11 §5.9; PRO-O1-16 | O1 | Núcleo | regla | TEN-001 con WF-TAR-TARIFA-SOCIAL: Solicitud de tarifa social M04 Portal, atención Recepción → verificación documental → verificación de padrón (espera EVT-TAR-014) → resolución →… | Agrupación por vencimiento: Vencidos, Hoy, Mañana, Próximos 7 días, Futuro, Sin fecha; orden por prioridad y vencimiento. | Un ítem vencido ayer aparece primero en "Vencidos". |
| CP-WFL-0132 | RF-WFL-132; T11 §5.9; PRO-O1-16 | O1 | Estándar | regla | TEN-001 con WF-CAT-ALTA-SERVICIO: Alta de servicio M02 Portal, atención Solicitud → documentación → factibilidad (M10) → aprobación → instalación (M10) → activación 15 días hábiles | Prioridad normalizada en la escala 0, 1, 25, 50, 75, 100 (ninguna, baja, media, alta, urgente, crítica) heredada de la fuente o calculada por SLA. | Una aprobación al 100 % de SLA sube a 75. |
| CP-WFL-0133 | RF-WFL-133; T11 §5.9; PRO-O1-16 | O1 | Núcleo | regla | TEN-001 con Tipo documental `acta` de migración (plataforma; agregado el 5-11-2026 por PA-MIG-20 de T07, Asumida DEC-072): `DOC-ACTA-MIG` "Acta de aceptación de la migración": `category = legal`, `allowedSubjects = [migrationProject]`, `mimeTypes = [application/pdf]`… | Filtros: tipo, módulo, estado, prioridad, área, sujeto, vencimiento; vistas guardadas; contador por grupo en tiempo real. | El contador se actualiza al decidir sin recargar. |
| CP-WFL-0134 | RF-WFL-134; T11 §5.9; PRO-O1-16 | O1 | Estándar | funcional | TEN-001 con Operaciones: Anulación del recibo R-0001-00004567 (ARS 18.450,00, aprobada y ejecutada), ejecución de la OP-2026-000210 (ARS 3.200.000,00, pendiente del segundo… | Tomar un ítem de cola (exclusivo, con límite configurable de ítems tomados en simultáneo) y liberarlo. | Con límite 1, tomar un segundo ítem pide liberar el primero. |
| CP-WFL-0135 | RF-WFL-135; T11 §5.9; PRO-O1-16 | O1 | Núcleo | seguridad | TEN-001 con Tipo documental `acta` de migración (plataforma; agregado el 5-11-2026 por PA-MIG-20 de T07, Asumida DEC-072): `DOC-ACTA-MIG` "Acta de aceptación de la migración": `category = legal`, `allowedSubjects = [migrationProject]`, `mimeTypes = [application/pdf]`… | Acciones en línea según tipo: aprobar, rechazar, completar, abrir, reasignar, posponer (con fecha), comentar. | Aprobar desde la tarjeta exige el mismo MFA que desde el detalle. |
| CP-WFL-0136 | RF-WFL-136; T11 §5.9; PRO-O1-16 | O1 | Estándar | funcional | TEN-001 con WF-SUE-LICENCIA: Pedido de licencia M16 App del empleado Solicitud → aprobación del jefe → registro → agenda 2 días hábiles | Vista de supervisión: carga por persona, vencidos por área, reasignación masiva. | Reasignar 20 ítems de un agente de licencia a otro en una acción. |
| CP-WFL-0137 | RF-WFL-137; T11 §5.9; PRO-O2-01 | O2 | Núcleo | regla | TEN-001 con SIG-SUE-EMPLEADO: `electronic` (OTP) Empleado Recepción de recibos de sueldo | Bandeja en PWA del empleado con tarjetas CNX, FAB "+" para crear tarea y push de T09. | La tarjeta muestra tipo, sujeto, vencimiento y acción principal. |
| CP-WFL-0138 | RF-WFL-138; T11 §5.9; PRO-O1-16 | O1 | Núcleo | regla | TEN-001 con Tareas: TAR-001 "Revisar padrón de tarifa social" (mensual, con evidencia obligatoria) | Tareas ad hoc: crear, asignar a persona o área, vencimiento, recurrencia (RRULE), checklist, evidencias obligatorias al completar, comentarios con menciones y vínculo a cualquier entidad. | TAR-001 "Revisar padrón de tarifa social" mensual exige adjuntar el informe al completar. |
| CP-WFL-0139 | RF-WFL-139; T11 §5.9; PRO-O1-16 | O1 | Estándar | funcional | TEN-001 con Tareas: TAR-001 "Revisar padrón de tarifa social" (mensual, con evidencia obligatoria) | Reemplazo del correo interno `PROMAIL` por comentarios en tareas y casos con menciones y notificación T09. | No existe "correo interno"; una mención crea notificación. |
### 1.10 Agenda y calendario (T11 §5.10)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-WFL-0140 | RF-WFL-140; T11 §5.10; PRO-O2-01 | O2 | Estándar | regla | TEN-001 con WF-SUE-LICENCIA: Pedido de licencia M16 App del empleado Solicitud → aprobación del jefe → registro → agenda 2 días hábiles | Agenda unificada del empleado (`agendaEntries`, proyección) con vistas día, semana, mes y lista: citas del calendario interno de M09, visitas de M10, turnos reservados de M09, reuniones y asambleas de M17, licencias de M16, vencimientos de… | Un técnico ve sus visitas y su licencia aprobada en la misma semana. |
| CP-WFL-0141 | RF-WFL-141; T11 §5.10; PRO-O2-01 | O2 | Estándar | funcional | TEN-001 con Corrida: LOT-2026-00012 (98 ítems emitidos y 2 excepciones) y su reproceso LOT-2026-00013 | Recurrencias RRULE con excepciones y edición "solo esta / esta y siguientes / todas". | Editar "esta y siguientes" divide la serie sin perder las anteriores. |
| CP-WFL-0142 | RF-WFL-142; T11 §5.10; PRO-O2-01 | O2 | Estándar | funcional | TEN-001 con Cooperativa Demo Villa Ficticia: TEN-001 USR-ADM-01 (T-ADM), USR-CAJ-01 (cajero, sucursal Centro), USR-TES-01 (tesorera), USR-GER-01 (gerente), USR-SGE-01 (subgerente), USR-ATE-01 y… | Eventos de todo el día con fin exclusivo correcto y búsqueda por asunto. | Un evento de todo el día del 10-11-2026 no aparece el 11-11-2026. |
| CP-WFL-0143 | RF-WFL-143; T11 §5.10; PRO-O2-01 | O2 | Estándar | funcional | TEN-001 con POL-CMP-APROBAR-OC: `cmp.purchaseOrder.approve` Hasta 500.000 / hasta 3.000.000 / más Jefe de área / + T-GER / + consejo Solicitante ≠ aprobador | Agenda de equipo según alcance (área, cuadrilla) con disponibilidad para coordinar. | El supervisor ve la ocupación de su cuadrilla. |
| CP-WFL-0144 | RF-WFL-144; T11 §5.10; PRO-O2-01 | O2 | Estándar | seguridad | TEN-001 con WF-PER-ACTUALIZAR-DATOS: Actualización de datos personales y fiscales M01 Portal Solicitud → validación documental → verificación ARCA → aplicación 3 días hábiles | Feed iCal privado de solo lectura por usuario con token revocable, sin datos personales de socios en el título. | Revocar el token deja de servir el feed en 5 minutos. |
| CP-WFL-0145 | RF-WFL-145; T11 §5.10; PRO-O2-01 | O2 | Estándar | seguridad | TEN-001 con Cooperativa Demo Villa Ficticia: TEN-001 USR-ADM-01 (T-ADM), USR-CAJ-01 (cajero, sucursal Centro), USR-TES-01 (tesorera), USR-GER-01 (gerente), USR-SGE-01 (subgerente), USR-ATE-01 y… | Eliminación de eventos propios; los de otros solo con permiso del dueño del calendario (M09). | Sin permiso, el botón eliminar no está y la API devuelve 403. |
### 1.11 Gestión documental (T11 §5.11)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-WFL-0150 | RF-WFL-150; T11 §5.11; PRO-O0-09 | O0 | Núcleo | seguridad | TEN-001 con Tipo documental `acta` de migración (plataforma; agregado el 5-11-2026 por PA-MIG-20 de T07, Asumida DEC-072): `DOC-ACTA-MIG` "Acta de aceptación de la migración": `category = legal`, `allowedSubjects = [migrationProject]`, `mimeTypes = [application/pdf]`… | Repositorio privado por tenant: todo archivo de negocio se registra como `document` con versiones sobre `storedFiles` de T01 (clave `tenants/<tenantId>/...`), nunca servido por estático público. | Pedir un documento de TEN-001 con sesión de TEN-002 devuelve 404. |
| CP-WFL-0151 | RF-WFL-151; T11 §5.11; PRO-O0-09 | O0 | Núcleo | regla | TEN-001 con Tipo documental `acta` de migración (plataforma; agregado el 5-11-2026 por PA-MIG-20 de T07, Asumida DEC-072): `DOC-ACTA-MIG` "Acta de aceptación de la migración": `category = legal`, `allowedSubjects = [migrationProject]`, `mimeTypes = [application/pdf]`… | Subida en dos pasos con URL prefirmada, verificación de tipo real, tamaño máximo, antivirus (JOB-PLA-21), hash SHA-256 y miniatura; el documento queda `available` solo con `scanStatus = clean`. | Un archivo infectado queda `quarantined` y no se puede descargar. |
| CP-WFL-0152 | RF-WFL-152; T11 §5.11; PRO-O0-09 | O0 | Núcleo | regla | TEN-001 con Tipos documentales: `DOC-ID-DNI`, `DOC-CUIT-CONST`, `DOC-DOM-CONST`, `DOC-INC-CONST`, `DOC-PODER`, `DOC-DEFUNCION`, `DOC-ESCRITURA`, `DOC-CONTRATO-SERV`… | Tipos documentales (`documentTypes`) con código, nombre (diccionario), sujetos admitidos, extensiones, tamaño, sensibilidad (`internal`, `personal`, `restricted`, `health`, `fiscal`), retención, visibilidad para el socio, obligatoriedad… | El tipo "Constancia de CUIT" acepta PDF/JPG hasta 10 MB y es visible para el socio. |
| CP-WFL-0153 | RF-WFL-153; T11 §5.11; PRO-O0-09 | O0 | Núcleo | funcional | TEN-001 con POL-CMP-APROBAR-OC: `cmp.purchaseOrder.approve` Hasta 500.000 / hasta 3.000.000 / más Jefe de área / + T-GER / + consejo Solicitante ≠ aprobador | Versionado inmutable: nunca se sobrescribe un archivo; cada reemplazo crea versión nueva; la versión aceptada queda fijada a los actos que la usaron. | Subir una constancia nueva no cambia la que se usó para aprobar el beneficio en marzo. |
| CP-WFL-0154 | RF-WFL-154; T11 §5.11; PRO-O0-09 | O0 | Núcleo | funcional | TEN-001 con WF-CAT-CAMBIO-TITULAR: Cambio de titularidad M01 / M02 Atención Solicitud → verificar identidad (obligatorio) → libre deuda → firma de ambos → transferencia 10 días hábiles | Vínculos múltiples (`documentLinks`): un documento se asocia a uno o varios sujetos (persona, cuenta, contrato, suministro, caso, OT, factura, OP, asamblea) con rol del vínculo. | El DNI del titular vinculado a persona y al trámite de alta aparece en ambos expedientes. |
| CP-WFL-0155 | RF-WFL-155; T11 §5.11; PRO-O2-01 | O2 | Estándar | regla | TEN-001 con Tipo documental `acta` de migración (plataforma; agregado el 5-11-2026 por PA-MIG-20 de T07, Asumida DEC-072): `DOC-ACTA-MIG` "Acta de aceptación de la migración": `category = legal`, `allowedSubjects = [migrationProject]`, `mimeTypes = [application/pdf]`… | Metadatos tipados por tipo documental (fecha de emisión, vencimiento, emisor, número, importe) con búsqueda; extracción asistida por IA solo como propuesta. | La IA propone el vencimiento de un seguro; el operador lo confirma. |
| CP-WFL-0156 | RF-WFL-156; T11 §5.11; PRO-O2-01 | O2 | Estándar | regla | TEN-001 con Cooperativa Ejemplo Sur: TEN-002 USR-ADM-B (T-ADM); se usa para las pruebas de aislamiento | Vencimiento de documentos con aviso previo y efecto configurable por el módulo dueño (por ejemplo, documentación del proveedor vencida bloquea nuevas OC). | Un evento `wfl.document.expired` llega a M12. |
| CP-WFL-0157 | RF-WFL-157; T11 §5.11; PRO-O0-09 | O0 | Núcleo | funcional | TEN-001 con POL-COB-ANULAR-RECIBO: `cob.receipt.void` Hasta 50.000 / más T-TES / T-TES + T-GER Solicitante ≠ aprobador | Descarga con URL firmada de vida corta tras verificar permiso del objeto dueño; registro de cada acceso (`documentAccessLogs`) para documentos `personal`, `restricted`, `health` y `fiscal`. | La auditoría muestra quién descargó un recibo de sueldo. |
| CP-WFL-0158 | RF-WFL-158; T11 §5.11; PRO-O2-01 | O2 | Estándar | seguridad | TEN-001 con WF-TAR-TARIFA-SOCIAL: Solicitud de tarifa social M04 Portal, atención Recepción → verificación documental → verificación de padrón (espera EVT-TAR-014) → resolución →… | Enlaces compartidos con token, vencimiento, límite de descargas, contraseña opcional y revocación inmediata. | Revocar un enlace deja de servir el archivo en la siguiente solicitud. |
| CP-WFL-0159 | RF-WFL-159; T11 §5.11; PRO-O0-09 | O0 | Núcleo | regla | TEN-001 con POL-COB-ANULAR-RECIBO: `cob.receipt.void` Hasta 50.000 / más T-TES / T-TES + T-GER Solicitante ≠ aprobador | Borrado lógico con motivo; nunca borrado físico por el usuario; la purga física solo por retención cumplida sin legal hold, con certificado de purga. | Anular un adjunto lo oculta pero se conserva hasta el fin de retención. |
| CP-WFL-0160 | RF-WFL-160; T11 §5.11; PRO-O1-16 | O1 | Núcleo | regla | TEN-001 con Tipo documental `acta` de migración (plataforma; agregado el 5-11-2026 por PA-MIG-20 de T07, Asumida DEC-072): `DOC-ACTA-MIG` "Acta de aceptación de la migración": `category = legal`, `allowedSubjects = [migrationProject]`, `mimeTypes = [application/pdf]`… | Políticas de retención por tipo documental y categoría (fiscal, laboral, contractual, atención, salud), configurables por tenant dentro de mínimos de plataforma; sin inventar plazos: las de plataforma se cargan como `A validar` hasta… | Un documento fiscal no se purga antes de su plazo mínimo de plataforma. |
| CP-WFL-0161 | RF-WFL-161; T11 §5.11; PRO-O1-16 | O1 | Estándar | funcional | TEN-001 con Tipo documental `acta` de migración (plataforma; agregado el 5-11-2026 por PA-MIG-20 de T07, Asumida DEC-072): `DOC-ACTA-MIG` "Acta de aceptación de la migración": `category = legal`, `allowedSubjects = [migrationProject]`, `mimeTypes = [application/pdf]`… | Legal hold por sujeto, expediente o documento, con motivo, responsable y fecha; bloquea la purga y la anulación. | Con hold activo, la anulación devuelve 409 `wfl/legal-hold`. |
| CP-WFL-0162 | RF-WFL-162; T11 §5.11; PRO-O2-01 | O2 | Núcleo | funcional | TEN-001 con Tipos documentales: `DOC-ID-DNI`, `DOC-CUIT-CONST`, `DOC-DOM-CONST`, `DOC-INC-CONST`, `DOC-PODER`, `DOC-DEFUNCION`, `DOC-ESCRITURA`, `DOC-CONTRATO-SERV`… | Visibilidad para el socio: solo tipos marcados visibles y versiones aceptadas o emitidas; los internos nunca se exponen. | En "Mis documentos" no aparece la nota interna del verificador. |
| CP-WFL-0163 | RF-WFL-163; T11 §5.11; PRO-O11-06 | O11 | Estándar | migración | TEN-001 con Tipo documental `acta` de migración (plataforma; agregado el 5-11-2026 por PA-MIG-20 de T07, Asumida DEC-072): `DOC-ACTA-MIG` "Acta de aceptación de la migración": `category = legal`, `allowedSubjects = [migrationProject]`, `mimeTypes = [application/pdf]`… | Importación de adjuntos de ProCoop (`ADJUNTOS`, `PROCOOPAR_ADJUNTOS`, carpetas) con hash, tipo mapeado y vínculo; los huérfanos se informan. | La conciliación informa cantidad y hash por tipo y lista de archivos sin registro. |
| CP-WFL-0164 | RF-WFL-164; T11 §5.11; PRO-O2-01 | O2 | Estándar | funcional | TEN-001 con POL-CMP-APROBAR-OP: `cmp.paymentOrder.approve` Único T-GER Quien registró la factura ≠ aprobador | Adjuntar múltiples PDF y combinarlos en un único documento cuando el trámite lo pide. | Tres PDF se combinan en uno con índice. |
### 1.12 Plantillas de documentos y generación de PDF (T11 §5.12)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-WFL-0170 | RF-WFL-170; T11 §5.12; PRO-O0-18 | O0 | Núcleo | funcional | TEN-001 con Tipo documental `acta` de migración (plataforma; agregado el 5-11-2026 por PA-MIG-20 de T07, Asumida DEC-072): `DOC-ACTA-MIG` "Acta de aceptación de la migración": `category = legal`, `allowedSubjects = [migrationProject]`, `mimeTypes = [application/pdf]`… | Plantillas versionadas (`documentTemplates`, `templateVersions`) por tipo documental con HTML restringido, CSS de impresión, encabezado y pie, marca del tenant (T03) y variables. | La factura de TEN-001 muestra su logo y paleta. |
| CP-WFL-0171 | RF-WFL-171; T11 §5.12; PRO-O0-18 | O0 | Núcleo | funcional | TEN-001 con POL-TAR-PUBLICAR-CUADRO: `tar.schedule.publish` Único T-TAR + T-GER Quien simuló ≠ aprobador | Lenguaje de plantilla sin lógica arbitraria (Handlebars restringido) con ayudantes: `formatMoney`, `formatDate` (zona del tenant, dd-mm-yyyy), `dict`, `qr`, `barcode` (Interleaved 2 of 5 y Code 128), `numberToWords`, `pluralize`… | Una plantilla que intenta acceder a una variable fuera del contrato falla al publicar. |
| CP-WFL-0172 | RF-WFL-172; T11 §5.12; PRO-O0-18 | O0 | Núcleo | funcional | TEN-001 con Cooperativa Ejemplo Sur: TEN-002 USR-ADM-B (T-ADM); se usa para las pruebas de aislamiento | Contrato de datos tipado provisto por el módulo dueño (Zod) y catálogo de variables generado del contrato, con descripción y ejemplo. | El editor autocompleta variables del contrato de "Recibo". |
| CP-WFL-0173 | RF-WFL-173; T11 §5.12; PRO-O1-16 | O1 | Estándar | funcional | TEN-001 con Cooperativa Ejemplo Sur: TEN-002 USR-ADM-B (T-ADM); se usa para las pruebas de aislamiento | Editor con vista previa con datos de ejemplo y datos reales (con permiso), comparación entre versiones y prueba de impresión. | La vista previa muestra el recibo de prueba en A4 y en ticket 80 mm. |
| CP-WFL-0174 | RF-WFL-174; T11 §5.12; PRO-O4-12 | O4 | Núcleo | funcional | TEN-001 con WF-CFG-PUBLICAR-CONFIG: Publicación de configuración T04 Admin Borrador → simulación → aprobación (POL-CFG-PUBLICAR-VERSION) → programación 2 días hábiles | Publicación con aprobación para plantillas de documentos fiscales y legales (factura, NC, ND, recibo, intimación, contrato, acta). | Publicar la plantilla de factura sin aprobación devuelve 409. |
| CP-WFL-0175 | RF-WFL-175; T11 §5.12; PRO-O0-18 | O0 | Núcleo | funcional | TEN-001 con TPL-FAC-01: Factura de servicios (A, B, C; A4 y ticket) M05 PDF/A-2b O4 | Render HTML → PDF en worker (cola `interactive` para uno, `batch` para lotes) con fuentes embebidas, PDF/A-2b para documentos de archivo, tamaños A4, Carta, Oficio y ticket. | El PDF de factura valida como PDF/A-2b. |
| CP-WFL-0176 | RF-WFL-176; T11 §5.12; PRO-O4-12 | O4 | Núcleo | funcional | TEN-001 con Tipo documental `acta` de migración (plataforma; agregado el 5-11-2026 por PA-MIG-20 de T07, Asumida DEC-072): `DOC-ACTA-MIG` "Acta de aceptación de la migración": `category = legal`, `allowedSubjects = [migrationProject]`, `mimeTypes = [application/pdf]`… | Inmutabilidad del emitido: el PDF de un documento emitido se genera una vez, se guarda con hash y se sirve siempre el mismo; regenerar crea una "reimpresión" marcada, nunca reemplaza. | Cambiar la plantilla no altera facturas ya emitidas. |
| CP-WFL-0177 | RF-WFL-177; T11 §5.12; PRO-O4-12 | O4 | Estándar | funcional | TEN-001 con WF-CFG-PUBLICAR-CONFIG: Publicación de configuración T04 Admin Borrador → simulación → aprobación (POL-CFG-PUBLICAR-VERSION) → programación 2 días hábiles | Copias (original, duplicado, triplicado), marcas de agua (BORRADOR, ANULADO, COPIA, SIMULACIÓN) y talones desprendibles. | Un comprobante anulado se descarga con marca "ANULADO". |
| CP-WFL-0178 | RF-WFL-178; T11 §5.12; PRO-O4-12 | O4 | Núcleo | integración | TEN-001 con POL-FAC-APROBAR-LOTE: `fac.billingRun.approve` Único T-FAC supervisor Operador del lote ≠ aprobador | Generación masiva para lotes (facturas, intimaciones, recibos de sueldo, credenciales) con idempotencia por (`subjectId`, `templateVersion`) y unión opcional en un PDF para impresión. | Reintentar el lote no duplica PDF. |
| CP-WFL-0179 | RF-WFL-179; T11 §5.12; PRO-O0-18 | O0 | Estándar | funcional | TEN-001 con SIG-CERT-FISCAL: `digital` (certificado de la cooperativa) Representante legal Certificados de retención y libre deuda, cuando el tenant lo habilita | Plantillas semilla de plataforma (§18.4, 46 plantillas) que el tenant adopta y personaliza en zonas editables. | El tenant edita el pie y el texto legal sin tocar el bloque fiscal. |
| CP-WFL-0180 | RF-WFL-180; T11 §5.12; PRO-O10-03 | O10 | Estándar | funcional | TEN-001 con Asamblea: Expediente de ASM-DEMO-001 con convocatoria TPL-INS-03 y padrón preliminar con fecha de corte 30-11-2026 (M17) | Reemplazo de plantillas Word de actividades y de circulares (`CIRCULAR`) por plantillas HTML con salida PDF o DOCX opcional. | La circular de asamblea se genera en PDF por destinatario. |
### 1.13 Numeración de documentos (T11 §5.13)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-WFL-0185 | RF-WFL-185; T11 §5.13; PRO-O0-18 | O0 | Núcleo | funcional | TEN-001 con WF-CRM-MESA-ENTRADAS: Registro y pase de mesa de entradas M09 Presencial, email Registro → acuse → pase al área → respuesta → salida numerada → cierre 10 días hábiles | Secuencias (`numberingSequences`) con código, alcance (tenant, sucursal, punto de venta, tipo de documento, servicio, año o mes), máscara (`{PREFIX}-{YYYY}-{N:6}`), valor inicial, salto, máximo y reinicio por período. | El expediente de mesa de entradas toma `ME-2026-000045`. |
| CP-WFL-0186 | RF-WFL-186; T11 §5.13; PRO-O0-18 | O0 | Núcleo | funcional | TEN-001 con Secuencias de M17 (`ownerModule = ins`; CTR-DAT-16, reemplazan a `insNumberingSeries`; todas `gapless`, `resetPolicy = never`, sin reutilizar números, RN-INS-002): `ins.memberNumber` (número de asociado, `{N:6}`), `ins.minuteBook:board`, `ins.minuteBook:assembly`, `ins.minuteBook:supervisory`… | Obtención atómica dentro de la transacción del llamador (incremento atómico en Mongo); si la transacción aborta, el número no se consume en secuencias "sin huecos". | 50 emisiones concurrentes no repiten ni saltean números en una secuencia `gapless`. |
| CP-WFL-0187 | RF-WFL-187; T11 §5.13; PRO-O0-18 | O0 | Núcleo | funcional | TEN-001 con Secuencias: `TRM-{YYYY}-{N:6}` (trámites, `allowGaps`), `ME-{YYYY}-{N:6}` y `MS-{YYYY}-{N:6}` (mesa de entradas y salidas, `gapless`), `EXP-{YYYY}-{N:6}`… | Políticas de huecos: `gapless` (comprobantes, recibos, actas, expedientes formales), `allowGaps` (tareas, operaciones, constancias internas) y `external` (número asignado por un tercero, por ejemplo CAEA). | Una secuencia `allowGaps` no toma bloqueo de transacción. |
| CP-WFL-0188 | RF-WFL-188; T11 §5.13; PRO-O0-18 | O0 | Núcleo | funcional | TEN-001 con Secuencias de M17 (`ownerModule = ins`; CTR-DAT-16, reemplazan a `insNumberingSeries`; todas `gapless`, `resetPolicy = never`, sin reutilizar números, RN-INS-002): `ins.memberNumber` (número de asociado, `{N:6}`), `ins.minuteBook:board`, `ins.minuteBook:assembly`, `ins.minuteBook:supervisory`… | Anulación trazable: un número asignado a un documento anulado queda `voided` con motivo; nunca se reutiliza. | El libro de numeración muestra el 000046 anulado. |
| CP-WFL-0189 | RF-WFL-189; T11 §5.13; PRO-O4-10 | O4 | Núcleo | integración | TEN-001 con Secuencias de M17 (`ownerModule = ins`; CTR-DAT-16, reemplazan a `insNumberingSeries`; todas `gapless`, `resetPolicy = never`, sin reutilizar números, RN-INS-002): `ins.memberNumber` (número de asociado, `{N:6}`), `ins.minuteBook:board`, `ins.minuteBook:assembly`, `ins.minuteBook:supervisory`… | Numeración fiscal: M05 usa secuencias por punto de venta y tipo de comprobante con política `gapless` y sincronización con el último autorizado de ARCA (M06); T11 no decide correlatividad fiscal. | Si ARCA informa último 1.234 y la secuencia está en 1.230, M06 bloquea la emisión hasta conciliar. |
| CP-WFL-0190 | RF-WFL-190; T11 §5.13; PRO-O1-16 | O1 | Estándar | funcional | TEN-001 con POL-STK-AJUSTE: `stk.adjustment.post` Hasta 100.000 / más Jefe de depósito / + T-GER Contador ≠ aprobador | Ajuste manual de secuencia solo con operación aprobada (`wfl.sequence.adjust`) y motivo. | Saltar el próximo número a 2.000 exige aprobación de T-ADM y T-CON. |
| CP-WFL-0191 | RF-WFL-191; T11 §5.13; PRO-O4-10 | O4 | Estándar | funcional | TEN-001 con Secuencias de M17 (`ownerModule = ins`; CTR-DAT-16, reemplazan a `insNumberingSeries`; todas `gapless`, `resetPolicy = never`, sin reutilizar números, RN-INS-002): `ins.memberNumber` (número de asociado, `{N:6}`), `ins.minuteBook:board`, `ins.minuteBook:assembly`, `ins.minuteBook:supervisory`… | Alerta de secuencia cercana al máximo o rango asignado por terceros a punto de agotarse. | Al 90 % del máximo se emite `wfl.sequence.thresholdReached`. |
### 1.14 Firma (T11 §5.14)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-WFL-0195 | RF-WFL-195; T11 §5.14; PRO-O3-07 | O3 | Núcleo | funcional | TEN-001 con POL-COB-ANULAR-RECIBO: `cob.receipt.void` Hasta 50.000 / más T-TES / T-TES + T-GER Solicitante ≠ aprobador | Tres niveles de firma en `signatureProfiles`: **manuscrita digitalizada** (conformidad), **electrónica** (art. 5 Ley 25.506) y **digital** (art. 2, certificador licenciado). | El perfil "Conformidad de instalación" es manuscrita; "Recibo de sueldo" es electrónica; "OP conjunta" puede ser digital. |
| CP-WFL-0196 | RF-WFL-196; T11 §5.14; PRO-O3-07 | O3 | Núcleo | funcional | TEN-001 con Tipo documental `acta` de migración (plataforma; agregado el 5-11-2026 por PA-MIG-20 de T07, Asumida DEC-072): `DOC-ACTA-MIG` "Acta de aceptación de la migración": `category = legal`, `allowedSubjects = [migrationProject]`, `mimeTypes = [application/pdf]`… | Firma manuscrita digitalizada con evidencias: imagen del trazo, hash del documento firmado, fecha y hora, geolocalización si se autoriza, dispositivo, identificación declarada (nombre y DNI) y foto opcional; declarada como conformidad, no… | La constancia de conformidad muestra "Conformidad con firma manuscrita digitalizada". |
| CP-WFL-0197 | RF-WFL-197; T11 §5.14; PRO-O9-06 | O9 | Núcleo | funcional | TEN-001 con POL-COB-ANULAR-RECIBO: `cob.receipt.void` Hasta 50.000 / más T-TES / T-TES + T-GER Solicitante ≠ aprobador | Firma electrónica propia: firmante autenticado en GoodApps con segundo factor (OTP por SMS, email o app), aceptación del texto, hash SHA-256 del PDF, sello de tiempo del servidor y constancia anexa con datos de verificación. | Un recibo de sueldo firmado muestra en la constancia el hash y el código de verificación. |
| CP-WFL-0198 | RF-WFL-198; T11 §5.14; PRO-O8-14 | O8 | Estándar | integración | TEN-001 con SIG-SUE-EMPLEADOR: `digital` (proveedor licenciado por conector T06) Representante legal Recibos de sueldo (DEC-078; O8) | Firma digital mediante conector T06 (proveedor licenciado) en PAdES con posición de firma, estado y descarga del firmado. | `int.signature.completed` deja la versión firmada como aceptada. |
| CP-WFL-0199 | RF-WFL-199; T11 §5.14; PRO-O8-14 | O8 | Núcleo | regla | TEN-001 con SIG-OP-CONJUNTA: `electronic` con MFA Dos firmantes autorizados de M14 Órdenes de pago (O8) | Varios firmantes en orden o en paralelo, firmantes por rol o registro de firmantes vigentes (por ejemplo, apoderados bancarios), con vencimiento y recordatorios. | Una OP con firma conjunta queda `partiallySigned` hasta el segundo firmante. |
| CP-WFL-0200 | RF-WFL-200; T11 §5.14; PRO-O8-14 | O8 | Estándar | funcional | TEN-001 con POL-TES-EJECUTAR-PAGO: `tes.paymentExecution.execute` Hasta 1.000.000 / hasta 5.000.000 / más T-TES / T-TES + T-GER / T-GER + consejo (quórum PRM-WFL-033) Firma conjunta… | Ubicación de la firma en el PDF por coordenadas o marcador en la plantilla. | La firma aparece en el recuadro definido. |
| CP-WFL-0201 | RF-WFL-201; T11 §5.14; PRO-O2-01 | O2 | Estándar | funcional | TEN-001 con Tipo documental `acta` de migración (plataforma; agregado el 5-11-2026 por PA-MIG-20 de T07, Asumida DEC-072): `DOC-ACTA-MIG` "Acta de aceptación de la migración": `category = legal`, `allowedSubjects = [migrationProject]`, `mimeTypes = [application/pdf]`… | Verificación pública de documentos firmados o emitidos por código o QR (`/api/public/<slug>/verify/:code`) que muestra tipo, fecha, emisor y hash, sin datos personales. | Un tercero valida un libre deuda escaneando el QR. |
| CP-WFL-0202 | RF-WFL-202; T11 §5.14; PRO-O9-06 | O9 | Estándar | funcional | TEN-001 con POL-COB-ANULAR-RECIBO: `cob.receipt.void` Hasta 50.000 / más T-TES / T-TES + T-GER Solicitante ≠ aprobador | Rechazo de firma con motivo y nueva versión del documento si corresponde. | Un empleado que no acepta su recibo deja `signatureRejected` con motivo y RRHH recibe la tarea. |
### 1.15 Expediente digital (T11 §5.15)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-WFL-0210 | RF-WFL-210; T11 §5.15; PRO-O1-16 | O1 | Núcleo | funcional | TEN-001 con Asamblea: Expediente de ASM-DEMO-001 con convocatoria TPL-INS-03 y padrón preliminar con fecha de corte 30-11-2026 (M17) | Expediente por sujeto: persona, titular, cuenta, suministro/punto de servicio, contrato, inmueble, empleado, proveedor, asociado, asamblea, caso, OT; jerarquía navegable persona → titular → cuenta → contrato → punto. | Desde la persona se ven los documentos de sus cuentas y contratos. |
| CP-WFL-0211 | RF-WFL-211; T11 §5.15; PRO-O1-16 | O1 | Núcleo | funcional | TEN-001 con POL-MOR-CONVENIO-EXCEPCION: `mor.agreement.exception` Único T-COB supervisor Solicitante ≠ aprobador | Línea de tiempo del expediente que combina documentos, eventos de dominio relevantes (marcados `timeline`), operaciones, aprobaciones, trámites, comunicaciones (resumen T09) y notas, con filtros. | La línea de tiempo de la cuenta muestra alta, facturas, pagos, intimación y convenio. |
| CP-WFL-0212 | RF-WFL-212; T11 §5.15; PRO-O10-03 | O10 | Estándar | funcional | TEN-001 con Tipo documental `acta` de migración (plataforma; agregado el 5-11-2026 por PA-MIG-20 de T07, Asumida DEC-072): `DOC-ACTA-MIG` "Acta de aceptación de la migración": `category = legal`, `allowedSubjects = [migrationProject]`, `mimeTypes = [application/pdf]`… | Expediente formal numerado (`dossiers`) con carátula, tipo, estado (abierto, en trámite, cerrado, archivado), responsable, foliatura opcional e índice. | El expediente ME-2026-000045 tiene carátula y 12 folios. |
| CP-WFL-0213 | RF-WFL-213; T11 §5.15; PRO-O1-16 | O1 | Estándar | regla | TEN-001 con TPL-WFL-01: Índice del expediente digital T11 PDF/A-2b O1 | Exportación de expediente (ZIP con PDF índice y documentos, o PDF unificado) como job con permiso `wfl.expedientes.exportar`, auditoría y vencimiento del archivo. | La exportación queda registrada con usuario, motivo y contenido. |
| CP-WFL-0214 | RF-WFL-214; T11 §5.15; PRO-O2-01 | O2 | Núcleo | funcional | TEN-001 con Tipo documental `acta` de migración (plataforma; agregado el 5-11-2026 por PA-MIG-20 de T07, Asumida DEC-072): `DOC-ACTA-MIG` "Acta de aceptación de la migración": `category = legal`, `allowedSubjects = [migrationProject]`, `mimeTypes = [application/pdf]`… | "Mis documentos" en la PWA del socio y del empleado con documentos visibles por tipo y por cuenta. | El socio descarga su última factura y su contrato firmado. |
| CP-WFL-0215 | RF-WFL-215; T11 §5.15; PRO-O2-01 | O2 | Núcleo | funcional | TEN-001 con WF-CAT-ALTA-SERVICIO: Alta de servicio M02 Portal, atención Solicitud → documentación → factibilidad (M10) → aprobación → instalación (M10) → activación 15 días hábiles | Documentos obligatorios por trámite y sujeto (checklist) con estado presentado, validado, vencido, faltante. | El alta de servicio muestra "Falta: constancia de domicilio". |
### 1.16 Mesa de entradas (coordinación con M09) (T11 §5.16)

| CP | Cubre | Ola | Prioridad | Tipo | Dado | Cuando | Entonces (resultado esperado) |
|---|---|---|---|---|---|---|---|
| CP-WFL-0220 | RF-WFL-220; T11 §5.16; PRO-O10-11 | O10 | Estándar | regla | TEN-001 con Mesa de entradas: ME-2026-000045 (nota del ente regulador, con pase a Técnica) y la salida MS-2026-000019 | M09 registra la mesa de entradas como caso `kind = deskEntry`; T11 aporta la secuencia del registro (`ME-{YYYY}-{N:6}`), el expediente formal, la plantilla de acuse y la carátula, y el workflow de pases internos. | Registrar una nota del ente regulador entrega acuse numerado y abre expediente. |
| CP-WFL-0221 | RF-WFL-221; T11 §5.16; PRO-O10-11 | O10 | Estándar | funcional | TEN-001 con WF-CRM-MESA-ENTRADAS: Registro y pase de mesa de entradas M09 Presencial, email Registro → acuse → pase al área → respuesta → salida numerada → cierre 10 días hábiles | Pases entre áreas con acuse de recepción del área destino, plazo de respuesta en días hábiles y salida (respuesta) vinculada con su propio número. | Un pase no acusado en 1 día hábil escala al jefe del área. |
| CP-WFL-0222 | RF-WFL-222; T11 §5.16; PRO-O10-11 | O10 | Estándar | funcional | TEN-001 con Tipo documental `acta` de migración (plataforma; agregado el 5-11-2026 por PA-MIG-20 de T07, Asumida DEC-072): `DOC-ACTA-MIG` "Acta de aceptación de la migración": `category = legal`, `allowedSubjects = [migrationProject]`, `mimeTypes = [application/pdf]`… | Digitalización de la documentación recibida como documentos del expediente con tipo y folios. | El escaneo queda como versión aceptada con hash. |

## 2. Casos por escenario y criterio de aceptación con ID

**CP-WFL-6001 — CA-WFL-01. El cajero la pide**

- Cubre: CA-WFL-01; T11 §17.1
- Ola: O1 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: POL-COB-ANULAR-RECIBO: `cob.receipt.void` Hasta 50.000 / más T-TES / T-TES + T-GER Solicitante ≠ aprobador
- Dado Una operación `cob.receipt.void` con política de un paso
- Cuando El cajero la pide
- Entonces Queda `pendingApproval`, aparece en la bandeja de T-TES y el recibo sigue vigente

**CP-WFL-6002 — CA-WFL-02. La aprueba otra persona con MFA**

- Cubre: CA-WFL-02; T11 §17.1
- Ola: O1 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de T11 §18.
- Datos de prueba: POL-COB-ANULAR-RECIBO: `cob.receipt.void` Hasta 50.000 / más T-TES / T-TES + T-GER Solicitante ≠ aprobador
- Dado La misma operación
- Cuando La aprueba otra persona con MFA
- Entonces Se ejecuta una sola vez; EVT-WFL-004 y `cob.receipt.voided` con el mismo `correlationId`

**CP-WFL-6003 — CA-WFL-03. Se pide por ARS 3.200.000**

- Cubre: CA-WFL-03; T11 §17.1
- Ola: O1 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: Tipo documental `acta` de migración (plataforma; agregado el 5-11-2026 por PA-MIG-20 de T07, Asumida DEC-072): `DOC-ACTA-MIG` "Acta de aceptación de la migración": `category = legal`, `allowedSubjects = [migrationProject]`, `mimeTypes = [application/pdf]`, `sensitivity = internal`, `retentionPolicyCode` = PRM-NFR-041 de T08…
- Dado Política con tramos
- Cuando Se pide por ARS 3.200.000
- Entonces Se crean los pasos del tramo 2, no los del 1 ni los del 3

**CP-WFL-6004 — CA-WFL-04. Pasan 18 h hábiles**

- Cubre: CA-WFL-04; T11 §17.1
- Ola: O1 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: WF-TAR-TARIFA-SOCIAL: Solicitud de tarifa social M04 Portal, atención Recepción → verificación documental → verificación de padrón (espera EVT-TAR-014) → resolución → aviso 10 días hábiles
- Dado Un paso con SLA de 24 h hábiles
- Cuando Pasan 18 h hábiles
- Entonces EVT-WFL-020 y aviso al aprobador; a las 24 h, la acción de PRM-WFL-028

**CP-WFL-6005 — CA-WFL-05. Se publica la versión 2**

- Cubre: CA-WFL-05; T11 §17.1
- Ola: O1 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: TPL-CRM-02: Constancia de trámite M09 PDF O2
- Dado Un trámite en versión 1
- Cuando Se publica la versión 2
- Entonces La instancia abierta sigue en la 1; las nuevas usan la 2

**CP-WFL-6006 — CA-WFL-06. Se envía con CUIT inválido**

- Cubre: CA-WFL-06; T11 §17.1
- Ola: O1 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: SIG-SIMPLE-CAMPO: `simple` (trazo en pantalla + geolocalización + huella) Socio Actas de conformidad (TPL-TEC-02)
- Dado Un formulario con campo CUIT obligatorio
- Cuando Se envía con CUIT inválido
- Entonces 422 con el error en el campo; no se crea `formSubmissions`

**CP-WFL-6007 — CA-WFL-07. Dos emisiones concurrentes**

- Cubre: CA-WFL-07; T11 §17.1
- Ola: O1 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: Secuencias de M17 (`ownerModule = ins`; CTR-DAT-16, reemplazan a `insNumberingSeries`; todas `gapless`, `resetPolicy = never`, sin reutilizar números, RN-INS-002): `ins.memberNumber` (número de asociado, `{N:6}`), `ins.minuteBook:board`, `ins.minuteBook:assembly`, `ins.minuteBook:supervisory`, `ins.minuteBook:internal` (libros de actas del consejo, asamblea, sindicatura e…
- Dado Una secuencia `gapless`
- Cuando Dos emisiones concurrentes
- Entonces Números consecutivos sin repetir ni saltar

**CP-WFL-6008 — CA-WFL-08. La transacción que tomó el número falla**

- Cubre: CA-WFL-08; T11 §17.1
- Ola: O1 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: Secuencias de M17 (`ownerModule = ins`; CTR-DAT-16, reemplazan a `insNumberingSeries`; todas `gapless`, `resetPolicy = never`, sin reutilizar números, RN-INS-002): `ins.memberNumber` (número de asociado, `{N:6}`), `ins.minuteBook:board`, `ins.minuteBook:assembly`, `ins.minuteBook:supervisory`, `ins.minuteBook:internal` (libros de actas del consejo, asamblea, sindicatura e…
- Dado Una secuencia `gapless`
- Cuando La transacción que tomó el número falla
- Entonces El número no se consume

**CP-WFL-6009 — CA-WFL-09. Se sube un archivo nuevo**

- Cubre: CA-WFL-09; T11 §17.1
- Ola: O1 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: Tipo documental `acta` de migración (plataforma; agregado el 5-11-2026 por PA-MIG-20 de T07, Asumida DEC-072): `DOC-ACTA-MIG` "Acta de aceptación de la migración": `category = legal`, `allowedSubjects = [migrationProject]`, `mimeTypes = [application/pdf]`, `sensitivity = internal`, `retentionPolicyCode` = PRM-NFR-041 de T08…
- Dado Un documento con versión 1
- Cuando Se sube un archivo nuevo
- Entonces Se crea la versión 2; la 1 se conserva

**CP-WFL-6010 — CA-WFL-10. Termina el escaneo**

- Cubre: CA-WFL-10; T11 §17.1
- Ola: O1 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: Cooperativa Demo Villa Ficticia: TEN-001 USR-ADM-01 (T-ADM), USR-CAJ-01 (cajero, sucursal Centro), USR-TES-01 (tesorera), USR-GER-01 (gerente), USR-SGE-01 (subgerente), USR-ATE-01 y USR-ATE-02 (atención), USR-TEC-01 (técnico), USR-SEC-01 (secretaría…
- Dado Un archivo infectado
- Cuando Termina el escaneo
- Entonces La versión queda `quarantined` y no se puede descargar

**CP-WFL-6011 — CA-WFL-11. Se pide el render**

- Cubre: CA-WFL-11; T11 §17.1
- Ola: O1 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: Tareas: TAR-001 "Revisar padrón de tarifa social" (mensual, con evidencia obligatoria)
- Dado Una plantilla con variable obligatoria faltante
- Cuando Se pide el render
- Entonces `wfl/template-data-missing` con la variable; no se genera el PDF

**CP-WFL-6012 — CA-WFL-12. Firma uno**

- Cubre: CA-WFL-12; T11 §17.1
- Ola: O1 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: SIG-OP-CONJUNTA: `electronic` con MFA Dos firmantes autorizados de M14 Órdenes de pago (O8)
- Dado Una firma conjunta de dos
- Cuando Firma uno
- Entonces El documento sigue `inSignature`; con el segundo, EVT-WFL-042

**CP-WFL-6013 — CA-WFL-13. Dos agentes la toman a la vez**

- Cubre: CA-WFL-13; T11 §17.1
- Ola: O1 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: Secuencias de M17 (`ownerModule = ins`; CTR-DAT-16, reemplazan a `insNumberingSeries`; todas `gapless`, `resetPolicy = never`, sin reutilizar números, RN-INS-002): `ins.memberNumber` (número de asociado, `{N:6}`), `ins.minuteBook:board`, `ins.minuteBook:assembly`, `ins.minuteBook:supervisory`, `ins.minuteBook:internal` (libros de actas del consejo, asamblea, sindicatura e…
- Dado Una tarea de grupo
- Cuando Dos agentes la toman a la vez
- Entonces Uno la obtiene; el otro recibe 409

**CP-WFL-6014 — CA-WFL-14. Hay temporizadores abiertos**

- Cubre: CA-WFL-14; T11 §17.1
- Ola: O1 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: Tipo documental `acta` de migración (plataforma; agregado el 5-11-2026 por PA-MIG-20 de T07, Asumida DEC-072): `DOC-ACTA-MIG` "Acta de aceptación de la migración": `category = legal`, `allowedSubjects = [migrationProject]`, `mimeTypes = [application/pdf]`, `sensitivity = internal`, `retentionPolicyCode` = PRM-NFR-041 de T08…
- Dado Un feriado agregado en T04
- Cuando Hay temporizadores abiertos
- Entonces Los no vencidos recalculan su vencimiento

**CP-WFL-6015 — CA-WFL-15. El delegado intenta decidir**

- Cubre: CA-WFL-15; T11 §17.1
- Ola: O1 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de T11 §18.
- Datos de prueba: Delegación: USR-GER-01 → USR-SGE-01, compras, límite de ARS 2.000.000, del 05-01-2027 al 20-01-2027
- Dado Una delegación vencida
- Cuando El delegado intenta decidir
- Entonces 403 `wfl/delegation-expired`

**CP-WFL-6016 — CA-WFL-16. Llega su fecha de purga**

- Cubre: CA-WFL-16; T11 §17.1
- Ola: O1 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: POL-BIA-REPORTE: `bia.customReport.publish` Único T-ADM Autor ≠ aprobador
- Dado Un documento bajo legal hold
- Cuando Llega su fecha de purga
- Entonces No se purga y queda en el reporte REP-WFL-11

**CP-WFL-6017 — CA-WFL-17. Existe una nota interna en su expediente**

- Cubre: CA-WFL-17; T11 §17.1
- Ola: O1 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: SIG-SOCIO-OTP: `electronic` (OTP por SMS, email o WhatsApp) Socio Convenios de pago, solicitudes de servicio, cambio de titularidad
- Dado El socio en "Mis documentos"
- Cuando Existe una nota interna en su expediente
- Entonces No la ve; la API pública no la devuelve

**CP-WFL-6018 — CA-WFL-18. Se publica `cat.contract.planChanged`**

- Cubre: CA-WFL-18; T11 §17.1
- Ola: O1 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: WF-CAT-CAMBIO-PLAN: Cambio de plan M02 Portal, atención Solicitud → validación de permanencia → aprobación → cambio con vigencia 3 días hábiles
- Dado Un evento de M02 con alias consumido por M04
- Cuando Se publica `cat.contract.planChanged`
- Entonces El consumidor suscripto a `cat.plan.changed` lo recibe mientras el alias está vigente

**CP-WFL-6019 — CA-WFL-30. Un usuario de TEN-001 pide un documento de TEN-002 con el ID correcto**

- Cubre: CA-WFL-30; T11 §17.2
- Ola: O1 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de T11 §18.
- Datos de prueba: Cooperativa Ejemplo Sur: TEN-002 USR-ADM-B (T-ADM); se usa para las pruebas de aislamiento
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Un usuario de TEN-001 pide un documento de TEN-002 con el ID correcto
- Entonces 404, sin revelar la existencia; auditado como intento cruzado.

**CP-WFL-6020 — CA-WFL-31. Un consumidor de eventos de TEN-001 recibe un evento con `tenantId` de TEN-002**

- Cubre: CA-WFL-31; T11 §17.2
- Ola: O1 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: Cooperativa Ejemplo Sur: TEN-002 USR-ADM-B (T-ADM); se usa para las pruebas de aislamiento
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Un consumidor de eventos de TEN-001 recibe un evento con `tenantId` de TEN-002
- Entonces Rechazado por el middleware; alerta de seguridad.

**CP-WFL-6021 — CA-WFL-32. Un job de TEN-001 intenta leer `workItems` de TEN-002**

- Cubre: CA-WFL-32; T11 §17.2
- Ola: O1 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: Cooperativa Ejemplo Sur: TEN-002 USR-ADM-B (T-ADM); se usa para las pruebas de aislamiento
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Un job de TEN-001 intenta leer `workItems` de TEN-002
- Entonces Falla por el filtro obligatorio de `tenantId` (prueba automática).

**CP-WFL-6022 — CA-WFL-33. Un usuario sin `wfl.tareas.reasignar` intenta reasignar**

- Cubre: CA-WFL-33; T11 §17.2
- Ola: O1 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de T11 §18.
- Datos de prueba: Tareas: TAR-001 "Revisar padrón de tarifa social" (mensual, con evidencia obligatoria)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Un usuario sin `wfl.tareas.reasignar` intenta reasignar
- Entonces 403.

**CP-WFL-6023 — CA-WFL-34. Un usuario sin `wfl.documentos.descargar` pide la URL firmada**

- Cubre: CA-WFL-34; T11 §17.2
- Ola: O1 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de T11 §18.
- Datos de prueba: Cooperativa Ejemplo Sur: TEN-002 USR-ADM-B (T-ADM); se usa para las pruebas de aislamiento
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Un usuario sin `wfl.documentos.descargar` pide la URL firmada
- Entonces 403; sin URL generada.

**CP-WFL-6024 — CA-WFL-35. El solicitante intenta aprobar su propia operación con otra sesión**

- Cubre: CA-WFL-35; T11 §17.2
- Ola: O1 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de T11 §18.
- Datos de prueba: POL-CMP-APROBAR-OC: `cmp.purchaseOrder.approve` Hasta 500.000 / hasta 3.000.000 / más Jefe de área / + T-GER / + consejo Solicitante ≠ aprobador
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando El solicitante intenta aprobar su propia operación con otra sesión
- Entonces 403 `wfl/sod-violation`.

**CP-WFL-6025 — CA-WFL-36. Un aprobador de sucursal A decide un pedido de la sucursal B**

- Cubre: CA-WFL-36; T11 §17.2
- Ola: O1 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de T11 §18.
- Datos de prueba: Cooperativa Demo Villa Ficticia: TEN-001 USR-ADM-01 (T-ADM), USR-CAJ-01 (cajero, sucursal Centro), USR-TES-01 (tesorera), USR-GER-01 (gerente), USR-SGE-01 (subgerente), USR-ATE-01 y USR-ATE-02 (atención), USR-TEC-01 (técnico), USR-SEC-01 (secretaría…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Un aprobador de sucursal A decide un pedido de la sucursal B
- Entonces 403 por alcance.

**CP-WFL-6026 — CA-WFL-37. Un enlace compartido revocado**

- Cubre: CA-WFL-37; T11 §17.2
- Ola: O1 · Prioridad: Núcleo · Tipo: regla
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: Cooperativa Ejemplo Sur: TEN-002 USR-ADM-B (T-ADM); se usa para las pruebas de aislamiento
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Un enlace compartido revocado
- Entonces 410 en ≤ 1 min.

**CP-WFL-6027 — CA-WFL-38. Un administrador del tenant intenta cambiar la cola de un job**

- Cubre: CA-WFL-38; T11 §17.2
- Ola: O1 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: Cooperativa Ejemplo Sur: TEN-002 USR-ADM-B (T-ADM); se usa para las pruebas de aislamiento
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Un administrador del tenant intenta cambiar la cola de un job
- Entonces 422; solo se permite hora y días.

**CP-WFL-6028 — CA-WFL-39. Soporte de plataforma sin acceso concedido consulta la bandeja de un tenant**

- Cubre: CA-WFL-39; T11 §17.2
- Ola: O1 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de T11 §18.
- Datos de prueba: Tipo documental `acta` de migración (plataforma; agregado el 5-11-2026 por PA-MIG-20 de T07, Asumida DEC-072): `DOC-ACTA-MIG` "Acta de aceptación de la migración": `category = legal`, `allowedSubjects = [migrationProject]`, `mimeTypes = [application/pdf]`, `sensitivity = internal`, `retentionPolicyCode` = PRM-NFR-041 de T08…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Soporte de plataforma sin acceso concedido consulta la bandeja de un tenant
- Entonces 403 (T02 RF de acceso de soporte).

**CP-WFL-6029 — CA-WFL-50. El relay de outbox se cae después de publicar y antes de marcar**

- Cubre: CA-WFL-50; T11 §17.3
- Ola: O1 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: POL-TAR-PUBLICAR-CUADRO: `tar.schedule.publish` Único T-TAR + T-GER Quien simuló ≠ aprobador
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando El relay de outbox se cae después de publicar y antes de marcar
- Entonces El evento se entrega otra vez; el consumidor lo ignora por `inboxReceipts`.

**CP-WFL-6030 — CA-WFL-51. Un consumidor falla 10 veces**

- Cubre: CA-WFL-51; T11 §17.3
- Ola: O1 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: Cooperativa Demo Villa Ficticia: TEN-001 USR-ADM-01 (T-ADM), USR-CAJ-01 (cajero, sucursal Centro), USR-TES-01 (tesorera), USR-GER-01 (gerente), USR-SGE-01 (subgerente), USR-ATE-01 y USR-ATE-02 (atención), USR-TEC-01 (técnico), USR-SEC-01 (secretaría…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Un consumidor falla 10 veces
- Entonces El evento va a `deadLetters` y a la bandeja operativa si es `businessImpact`.

**CP-WFL-6031 — CA-WFL-52. Una corrida masiva se interrumpe en el ítem 4.500 de 10.000**

- Cubre: CA-WFL-52; T11 §17.3
- Ola: O1 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: Corrida: LOT-2026-00012 (98 ítems emitidos y 2 excepciones) y su reproceso LOT-2026-00013
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Una corrida masiva se interrumpe en el ítem 4.500 de 10.000
- Entonces Al reanudar, sigue desde el último bloque confirmado; no repite ítems `succeeded`.

**CP-WFL-6032 — CA-WFL-53. 20 % de excepciones del mismo motivo en los primeros 200 ítems**

- Cubre: CA-WFL-53; T11 §17.3
- Ola: O1 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: Corrida: LOT-2026-00012 (98 ítems emitidos y 2 excepciones) y su reproceso LOT-2026-00013
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando 20 % de excepciones del mismo motivo en los primeros 200 ítems
- Entonces La corrida se pausa con EVT-WFL-048 `paused`.

**CP-WFL-6033 — CA-WFL-54. Timeout al ejecutar un paso externo**

- Cubre: CA-WFL-54; T11 §17.3
- Ola: O1 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: POL-TES-EJECUTAR-PAGO: `tes.paymentExecution.execute` Hasta 1.000.000 / hasta 5.000.000 / más T-TES / T-TES + T-GER / T-GER + consejo (quórum PRM-WFL-033) Firma conjunta; preparador ≠ aprobador
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Timeout al ejecutar un paso externo
- Entonces El paso queda `uncertain`; no se reenvía sin consultar.

**CP-WFL-6034 — CA-WFL-55. Dos decisiones simultáneas sobre el mismo paso**

- Cubre: CA-WFL-55; T11 §17.3
- Ola: O1 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: WF-NFR-DERECHOS-TITULAR: Solicitud de acceso, rectificación o supresión de datos T08 Portal, email Recepción → verificación de identidad → localización (JOB-NFR-02) → decisión → ejecución → respuesta 10 días hábiles (a validar con T08)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Dos decisiones simultáneas sobre el mismo paso
- Entonces Una gana; la otra recibe 409 y ve la decisión tomada.

**CP-WFL-6035 — CA-WFL-56. Eventos de un mismo agregado llegan desordenados**

- Cubre: CA-WFL-56; T11 §17.3
- Ola: O1 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: Tipo documental `acta` de migración (plataforma; agregado el 5-11-2026 por PA-MIG-20 de T07, Asumida DEC-072): `DOC-ACTA-MIG` "Acta de aceptación de la migración": `category = legal`, `allowedSubjects = [migrationProject]`, `mimeTypes = [application/pdf]`, `sensitivity = internal`, `retentionPolicyCode` = PRM-NFR-041 de T08…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Eventos de un mismo agregado llegan desordenados
- Entonces Se aplican en orden de `aggregateVersion`.

**CP-WFL-6036 — CA-WFL-57. Un tenant encola 50.000 trabajos `batch`**

- Cubre: CA-WFL-57; T11 §17.3
- Ola: O1 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: Cooperativa Demo Villa Ficticia: TEN-001 USR-ADM-01 (T-ADM), USR-CAJ-01 (cajero, sucursal Centro), USR-TES-01 (tesorera), USR-GER-01 (gerente), USR-SGE-01 (subgerente), USR-ATE-01 y USR-ATE-02 (atención), USR-TEC-01 (técnico), USR-SEC-01 (secretaría…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Un tenant encola 50.000 trabajos `batch`
- Entonces Los demás tenants mantienen su latencia (concurrencia por tenant de T01).

**CP-WFL-6037 — CA-WFL-58. Restauración del tenant**

- Cubre: CA-WFL-58; T11 §17.3
- Ola: O1 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: WF-SUE-LICENCIA: Pedido de licencia M16 App del empleado Solicitud → aprobación del jefe → registro → agenda 2 días hábiles
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Restauración del tenant
- Entonces JOB-WFL-08 reconstruye la bandeja y la agenda; los contadores coinciden con las fuentes.

**CP-WFL-5001 — ESC-01. (timeout con ARCA o pasarela) ESC-01..05 (timeout con ARCA o pasarela) ESC-01..05**

- Cubre: ESC-01; T11 §17.4
- Ola: O5 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: POL-TES-EJECUTAR-PAGO: `tes.paymentExecution.execute` Hasta 1.000.000 / hasta 5.000.000 / más T-TES / T-TES + T-GER / T-GER + consejo (quórum PRM-WFL-033) Firma conjunta; preparador ≠ aprobador
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando (timeout con ARCA o pasarela) ESC-01..05
- Entonces Paso `uncertain`, JOB-WFL-03, bandeja operativa. Ningún comprobante o pago duplicado.

**CP-WFL-5002 — ESC-02. (evento duplicado) (evento duplicado)**

- Cubre: ESC-02; T11 §17.4
- Ola: O4 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: TPL-COB-02: Resumen de cuenta M07 PDF O5
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando (evento duplicado)
- Entonces `inboxReceipts`, idempotencia de consumidores. Un solo efecto contable y de cuenta corriente.

**CP-WFL-5003 — ESC-03. (corrida masiva interrumpida) (corrida masiva interrumpida)**

- Cubre: ESC-03; T11 §17.4
- Ola: O3 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O3 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: Corrida: LOT-2026-00012 (98 ítems emitidos y 2 excepciones) y su reproceso LOT-2026-00013
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando (corrida masiva interrumpida)
- Entonces `bulkRuns` reanudable, pausa por sospecha global. Universo congelado; totales conciliados.

**CP-WFL-5004 — ESC-04. (restauración selectiva) (restauración selectiva)**

- Cubre: ESC-04; T11 §17.4
- Ola: O5 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O5 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: Operaciones: Anulación del recibo R-0001-00004567 (ARS 18.450,00, aprobada y ejecutada), ejecución de la OP-2026-000210 (ARS 3.200.000,00, pendiente del segundo paso)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando (restauración selectiva)
- Entonces Reconstrucción de proyecciones, conciliación de operaciones abiertas. Ninguna operación aprobada se ejecuta dos veces.

**CP-WFL-5005 — ESC-05. (cambio de configuración con aprobación) (cambio de configuración con aprobación)**

- Cubre: ESC-05; T11 §17.4
- Ola: O4 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O4 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: Configuración pendiente: Cambio de BON-VAR-30 del 30 % al 20 % pendiente de aprobación (CU-GOB-01), con la alerta ALT-DEMO-001 de T01 y la evidencia AUD-DEMO-001 de T02
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando (cambio de configuración con aprobación)
- Entonces Política de T04 por T11, auditoría. La configuración no rige antes de aprobada.

## 3. Casos por caso de uso (CU)

**CP-WFL-8001 — CU-26. Comunicar al asociado con constancia**

- Cubre: CU-26; RF-WFL-170, RF-WFL-211; T11 §16.1
- Ola: O1 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: POL-INS-INGRESO-ASOCIADO: `ins.membership.approve` Único Consejo (quórum) —
- Dado actor: Sistema, operador, autenticado en TEN-001 con las capabilities de su rol
- Cuando Comunicar al asociado con constancia
- Entonces T11 aporta el render de la constancia (JOB-COM-17 usa JOB-WFL-11), su guardado como documento del expediente con huella y la línea de tiempo; "notificado" solo se marca con el hito de EVT-COM-28.

**CP-WFL-8002 — CU-27. Convocar y realizar la asamblea**

- Cubre: CU-27; RF-WFL-195, RF-WFL-212; T11 §16.1
- Ola: O10 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O10 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: SIG-ACTA-INSTITUCIONAL: `digital` (proveedor licenciado por conector T06) Presidente y secretario (actas de asamblea y de consejo); síndico titular, o el suplente en ejercicio, en las actas e informes de sindicatura. Los firmantes salen del…
- Dado actor: Secretaría, consejo, autenticado en TEN-001 con las capabilities de su rol
- Cuando Convocar y realizar la asamblea
- Entonces Para ASM-DEMO-001, T11 aporta el expediente de la asamblea, la numeración de actas, la plantilla de convocatoria TPL-INS-03, el acta TPL-INS-04 con firma conjunta de presidente y secretario, y la agenda.

**CP-WFL-8003 — CU-29. Operar con permisos y aprobación**

- Cubre: CU-29; RF-WFL-040, RF-WFL-110; T11 §16.1
- Ola: O1 · Prioridad: Núcleo · Tipo: seguridad
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001 y TEN-002; semillas de T11 §18.
- Datos de prueba: POL-COB-ANULAR-RECIBO: `cob.receipt.void` Hasta 50.000 / más T-TES / T-TES + T-GER Solicitante ≠ aprobador
- Dado actor: Cajero, tesorera, autenticado en TEN-001 con las capabilities de su rol
- Cuando Operar con permisos y aprobación
- Entonces USR-CAJ-01 no puede anular el recibo R-0001-00004567 de ARS 18.450,00 sin la aprobación de otra persona con MFA; T02 deniega la acción directa y T11 gestiona la aprobación.

**CP-WFL-8004 — CU-GOB-01. Cambio de configuración aprobado**

- Cubre: CU-GOB-01; RF-WFL-110; T11 §16.1
- Ola: O1 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: Configuración pendiente: Cambio de BON-VAR-30 del 30 % al 20 % pendiente de aprobación (CU-GOB-01), con la alerta ALT-DEMO-001 de T01 y la evidencia AUD-DEMO-001 de T02
- Dado actor: Administrador, aprobador, autenticado en TEN-001 con las capabilities de su rol
- Cuando Cambio de configuración aprobado
- Entonces Una versión de configuración de T04 no se publica sin aprobación y queda auditada.

**CP-WFL-8005 — CU-ARQ-01. Reintento seguro**

- Cubre: CU-ARQ-01; RF-WFL-008, RF-WFL-043; RN-WFL-004; T11 §16.1
- Ola: O0 · Prioridad: Núcleo · Tipo: integración
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: WF-NFR-DERECHOS-TITULAR: Solicitud de acceso, rectificación o supresión de datos T08 Portal, email Recepción → verificación de identidad → localización (JOB-NFR-02) → decisión → ejecución → respuesta 10 días hábiles (a validar con T08)
- Dado actor: Sistema, autenticado en TEN-001 con las capabilities de su rol
- Cuando Reintento seguro
- Entonces Un doble envío o un reintento de un consumidor no duplica efectos.

**CP-WFL-8006 — CU-LOT-01. Corrida masiva con excepciones**

- Cubre: CU-LOT-01; RF-WFL-026; RN-WFL-008; T11 §16.1
- Ola: O0 · Prioridad: Núcleo · Tipo: funcional
- Precondiciones: ola O0 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: Corrida: LOT-2026-00012 (98 ítems emitidos y 2 excepciones) y su reproceso LOT-2026-00013
- Dado actor: Operador, autenticado en TEN-001 con las capabilities de su rol
- Cuando Corrida masiva con excepciones
- Entonces 98 de 100 ítems emitidos; 2 en excepciones asignadas; el reproceso no reemite. M05 define el caso; T11 aporta el motor de corridas (`bulkRuns`) y la bandeja de excepciones.

**CP-WFL-8007 — CU-WFL-01. Aprobar una orden de pago por monto con firma conjunta**

- Cubre: CU-WFL-01; T11 §16.2
- Ola: O1 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: POL-TES-EJECUTAR-PAGO: `tes.paymentExecution.execute` Hasta 1.000.000 / hasta 5.000.000 / más T-TES / T-TES + T-GER / T-GER + consejo (quórum PRM-WFL-033) Firma conjunta; preparador ≠ aprobador
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Aprobar una orden de pago por monto con firma conjunta
- Entonces Se completa «Aprobar una orden de pago por monto con firma conjunta» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio

**CP-WFL-8008 — CU-WFL-02. Reasignar pendientes de un empleado que se va**

- Cubre: CU-WFL-02; T11 §16.2
- Ola: O1 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: SIG-SUE-EMPLEADO: `electronic` (OTP) Empleado Recepción de recibos de sueldo
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Reasignar pendientes de un empleado que se va
- Entonces Se completa «Reasignar pendientes de un empleado que se va» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio

**CP-WFL-8009 — CU-WFL-03. Trabajar la bandeja del día**

- Cubre: CU-WFL-03; T11 §16.2
- Ola: O1 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: Cooperativa Demo Villa Ficticia: TEN-001 USR-ADM-01 (T-ADM), USR-CAJ-01 (cajero, sucursal Centro), USR-TES-01 (tesorera), USR-GER-01 (gerente), USR-SGE-01 (subgerente), USR-ATE-01 y USR-ATE-02 (atención), USR-TEC-01 (técnico), USR-SEC-01 (secretaría…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Trabajar la bandeja del día
- Entonces Se completa «Trabajar la bandeja del día» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio

**CP-WFL-8010 — CU-WFL-04. Diseñar y publicar un trámite**

- Cubre: CU-WFL-04; T11 §16.2
- Ola: O1 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: POL-TAR-PUBLICAR-CUADRO: `tar.schedule.publish` Único T-TAR + T-GER Quien simuló ≠ aprobador
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Diseñar y publicar un trámite
- Entonces Se completa «Diseñar y publicar un trámite» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio

**CP-WFL-8011 — CU-WFL-05. Generar y firmar recibos de sueldo**

- Cubre: CU-WFL-05; T11 §16.2
- Ola: O1 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: SIG-SUE-EMPLEADOR: `digital` (proveedor licenciado por conector T06) Representante legal Recibos de sueldo (DEC-078; O8)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Generar y firmar recibos de sueldo
- Entonces Se completa «Generar y firmar recibos de sueldo» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio

**CP-WFL-8012 — CU-WFL-06. Registrar una nota en la mesa de entradas y responderla**

- Cubre: CU-WFL-06; T11 §16.2
- Ola: O1 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: Mesa de entradas: ME-2026-000045 (nota del ente regulador, con pase a Técnica) y la salida MS-2026-000019
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Registrar una nota en la mesa de entradas y responderla
- Entonces Se completa «Registrar una nota en la mesa de entradas y responderla» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio

**CP-WFL-8013 — CU-WFL-07. Resolver una operación incierta**

- Cubre: CU-WFL-07; T11 §16.2
- Ola: O1 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: Cooperativa Demo Villa Ficticia: TEN-001 USR-ADM-01 (T-ADM), USR-CAJ-01 (cajero, sucursal Centro), USR-TES-01 (tesorera), USR-GER-01 (gerente), USR-SGE-01 (subgerente), USR-ATE-01 y USR-ATE-02 (atención), USR-TEC-01 (técnico), USR-SEC-01 (secretaría…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Resolver una operación incierta
- Entonces Se completa «Resolver una operación incierta» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio

**CP-WFL-8014 — CU-WFL-08. Ver el expediente digital de una cuenta**

- Cubre: CU-WFL-08; T11 §16.2
- Ola: O1 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: TPL-WFL-01: Índice del expediente digital T11 PDF/A-2b O1
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Ver el expediente digital de una cuenta
- Entonces Se completa «Ver el expediente digital de una cuenta» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio

**CP-WFL-8015 — CU-WFL-09. Programar un job del tenant**

- Cubre: CU-WFL-09; T11 §16.2
- Ola: O1 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: Cooperativa Demo Villa Ficticia: TEN-001 USR-ADM-01 (T-ADM), USR-CAJ-01 (cajero, sucursal Centro), USR-TES-01 (tesorera), USR-GER-01 (gerente), USR-SGE-01 (subgerente), USR-ATE-01 y USR-ATE-02 (atención), USR-TEC-01 (técnico), USR-SEC-01 (secretaría…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Programar un job del tenant
- Entonces Se completa «Programar un job del tenant» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio

**CP-WFL-8016 — CU-WFL-10. Reprocesar eventos fallidos**

- Cubre: CU-WFL-10; T11 §16.2
- Ola: O1 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: Cooperativa Demo Villa Ficticia: TEN-001 USR-ADM-01 (T-ADM), USR-CAJ-01 (cajero, sucursal Centro), USR-TES-01 (tesorera), USR-GER-01 (gerente), USR-SGE-01 (subgerente), USR-ATE-01 y USR-ATE-02 (atención), USR-TEC-01 (técnico), USR-SEC-01 (secretaría…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Reprocesar eventos fallidos
- Entonces Se completa «Reprocesar eventos fallidos» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio

**CP-WFL-8017 — CU-WFL-11. Delegar aprobaciones por vacaciones**

- Cubre: CU-WFL-11; T11 §16.2
- Ola: O1 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: Cooperativa Demo Villa Ficticia: TEN-001 USR-ADM-01 (T-ADM), USR-CAJ-01 (cajero, sucursal Centro), USR-TES-01 (tesorera), USR-GER-01 (gerente), USR-SGE-01 (subgerente), USR-ATE-01 y USR-ATE-02 (atención), USR-TEC-01 (técnico), USR-SEC-01 (secretaría…
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Delegar aprobaciones por vacaciones
- Entonces Se completa «Delegar aprobaciones por vacaciones» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio

**CP-WFL-8018 — CU-WFL-12. Conformidad firmada en campo sin conexión**

- Cubre: CU-WFL-12; T11 §16.2
- Ola: O1 · Prioridad: Estándar · Tipo: funcional
- Precondiciones: ola O1 desplegada; tenant ficticio TEN-001; semillas de T11 §18.
- Datos de prueba: SIG-SIMPLE-CAMPO: `simple` (trazo en pantalla + geolocalización + huella) Socio Actas de conformidad (TPL-TEC-02)
- Dado el tenant ficticio TEN-001 con los datos de prueba indicados
- Cuando Conformidad firmada en campo sin conexión
- Entonces Se completa «Conformidad firmada en campo sin conexión» sin errores, con el resultado que describe el anexo, y quedan auditoría y evento del cambio
