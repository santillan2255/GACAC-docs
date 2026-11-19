# Catálogo de endpoints · T11 · Workflow, eventos, tareas, aprobaciones y documentos

Parte del [catálogo de endpoints](../18-catalogo-endpoints.md) (artefacto 7.1). Generado el 05-11-2026 con `_trabajo/gen_18_catalogo_endpoints.py` a partir de `18-openapi/`; no se edita a mano.

## Para qué sirve esta API

Definir el núcleo de coordinación de GoodApps, es decir, la infraestructura funcional que todos los módulos usan para:

1. Comunicarse por eventos de dominio. Cada cambio confirmado publica un evento por el outbox transaccional (DEC-003, AGR-016). T11 fija el contrato: sobre, versionado, catálogo, suscripciones, semántica de entrega al menos una vez, consumidores idempotentes, bandeja operativa y reproceso. Además, consolida en §12 el catálogo completo de eventos de M01–M19 y de los transversales, con productor…
2. Ejecutar procesos masivos y programados como jobs BullMQ. T11 aporta el catálogo consolidado de jobs (JOB-), la programación cron por tenant y con su zona horaria, las ventanas permitidas, la visibilidad funcional de las corridas (progreso, pausa, reanudación, excepciones; BASE §69 LOT-001..004) y la bandeja de excepciones de lote.
3. Aplicar el patrón de "operaciones" de BASE §100 MER-012. Toda acción sensible (anular un recibo, reintegrar, condonar intereses, publicar una tarifa, reabrir un período, fusionar personas) se registra como una operación con identificador, aprobación según importe o riesgo, orden y plazo. Ninguna produce efectos antes de aprobarse. La ejecuta el módulo dueño de forma idempotente, con reparación de…
4. Modelar estados y transiciones en dos capas:
5. la máquina de estados canónica de cada entidad, que declara el módulo dueño con la librería común de T11 (AGR-003);
6. el workflow configurable de trámites (estados, transiciones, responsables por rol o área, SLA, vencimientos, escalamiento, formularios dinámicos tipados, adjuntos, acciones tipadas).

Detalle completo en el anexo T11, sección 1. Contrato navegable: [Swagger](../18-swagger/index.html?api=t11-wfl).

| Dato | Valor |
|---|---|
| Endpoints | 120 |
| Por método | DELETE 4, GET 49, PATCH 4, POST 57, PUT 6 |
| Grupos funcionales | 1 |
| Con requisito citado en el anexo | 0 |
| Con requisito inferido (a confirmar) | 114 |
| Sin requisito identificable | 6 |

## Grupos funcionales

| Grupo | Endpoints | Qué agrupa (primeros endpoints) |
|---|---|---|
| [API](#grupo-1) | 120 | Bandeja con filtros y grupos.; Contadores por grupo.; Tomar ítem.… |

## Cómo leer cada ficha

Cada endpoint tiene una ficha con estos datos:

| Dato | De dónde sale |
|---|---|
| **Qué hace** | La descripción de la fila API del anexo (§11), seguida de una frase armada con el método HTTP, la forma de la ruta y el nombre de la colección en T05. |
| **Para qué sirve** | El requisito funcional (RF) que el endpoint implementa, con su texto del §5 del anexo. Si la fila API o el anexo lo vinculan, se cita tal cual. Si no, se elige el RF del anexo con más palabras en común y se marca *a confirmar*. |
| **Quién lo usa** | El canal, según el prefijo de la ruta (backoffice, portal del socio, app de campo, consola de plataforma, terceros, público), y el permiso (capability) de T02. |
| **Recibe / Devuelve** | Parámetros, cuerpo y respuesta exitosa del contrato OpenAPI. |
| **Pantallas** | Pantallas del catálogo 4.5 que exigen el mismo permiso. |
| **Ola y fuente** | Ola de construcción y línea de la fila API en el anexo. |

<a id="grupo-1"></a>

## API

120 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-WFL-01](#API-WFL-01) | GET | `/api/admin/wfl/inbox` | Bandeja con filtros y grupos. |
| [API-WFL-02](#API-WFL-02) | GET | `/api/admin/wfl/inbox/summary` | Contadores por grupo. |
| [API-WFL-03](#API-WFL-03) | POST | `/api/admin/wfl/inbox/{workItemId}/claim` | Tomar ítem. |
| [API-WFL-04](#API-WFL-04) | POST | `/api/admin/wfl/inbox/{workItemId}/release` | Liberar. |
| [API-WFL-05](#API-WFL-05) | POST | `/api/admin/wfl/inbox/{workItemId}/snooze` | Posponer. |
| [API-WFL-06](#API-WFL-06) | POST | `/api/admin/wfl/inbox/reassign` | Reasignación masiva. |
| [API-WFL-07](#API-WFL-07) | GET | `/api/admin/wfl/inbox/team` | Carga por persona y área. |
| [API-WFL-08](#API-WFL-08) | POST | `/api/admin/wfl/tasks` | Crear tarea ad hoc o recurrente. |
| [API-WFL-09](#API-WFL-09) | GET | `/api/admin/wfl/tasks/{id}` | Detalle. |
| [API-WFL-10](#API-WFL-10) | PATCH | `/api/admin/wfl/tasks/{id}` | Editar (If-Match) |
| [API-WFL-11](#API-WFL-11) | POST | `/api/admin/wfl/tasks/{id}/complete` | Completar con evidencias. |
| [API-WFL-12](#API-WFL-12) | POST | `/api/admin/wfl/tasks/{id}/comments` | Comentar con menciones. |
| [API-WFL-13](#API-WFL-13) | GET | `/api/admin/wfl/agenda` | Agenda por rango y capas. |
| [API-WFL-14](#API-WFL-14) | POST | `/api/admin/wfl/agenda/feeds` | Crear o rotar feed iCal. |
| [API-WFL-15](#API-WFL-15) | DELETE | `/api/admin/wfl/agenda/feeds/{id}` | Revocar feed. |
| [API-WFL-16](#API-WFL-16) | GET | `/api/public/{tenantSlug}/wfl/ical/{token}.ics` | Feed iCal de solo lectura. |
| [API-WFL-17](#API-WFL-17) | GET | `/api/admin/wfl/state-machines` | Catálogo de máquinas. |
| [API-WFL-18](#API-WFL-18) | GET | `/api/admin/wfl/workflows` | Definiciones. |
| [API-WFL-19](#API-WFL-19) | POST | `/api/admin/wfl/workflows` | Crear o adoptar plantilla. |
| [API-WFL-20](#API-WFL-20) | PUT | `/api/admin/wfl/workflows/{id}/draft` | Guardar borrador (If-Match) |
| [API-WFL-21](#API-WFL-21) | POST | `/api/admin/wfl/workflows/{id}/validate` | Validación estructural. |
| [API-WFL-22](#API-WFL-22) | POST | `/api/admin/wfl/workflows/{id}/simulate` | Simulación sin efectos. |
| [API-WFL-23](#API-WFL-23) | POST | `/api/admin/wfl/workflows/{id}/publish` | Publicar con vigencia (aprobación si PRM-WFL-030) |
| [API-WFL-24](#API-WFL-24) | POST | `/api/admin/wfl/workflows/{id}/migrate-instances` | Migrar instancias (crea operación wfl.instances.migrate) |
| [API-WFL-25](#API-WFL-25) | GET | `/api/admin/wfl/forms` | Formularios y publicación. |
| [API-WFL-25-b](#API-WFL-25-b) | POST | `/api/admin/wfl/forms` | Formularios y publicación. |
| [API-WFL-25-c](#API-WFL-25-c) | GET | `/api/admin/wfl/forms/{id}/publish` | Formularios y publicación. |
| [API-WFL-25-d](#API-WFL-25-d) | POST | `/api/admin/wfl/forms/{id}/publish` | Formularios y publicación. |
| [API-WFL-26](#API-WFL-26) | GET | `/api/admin/wfl/data-sources/{code}` | Valores de una fuente tipada. |
| [API-WFL-28](#API-WFL-28) | GET | `/api/admin/wfl/instances` | Listado y detalle. |
| [API-WFL-27](#API-WFL-27) | POST | `/api/admin/wfl/instances` | Iniciar instancia desde admin. |
| [API-WFL-28-b](#API-WFL-28-b) | GET | `/api/admin/wfl/instances/{id}` | Listado y detalle. |
| [API-WFL-29](#API-WFL-29) | POST | `/api/admin/wfl/instances/{id}/transition` | Completar nodo o tomar decisión de ruta. |
| [API-WFL-30](#API-WFL-30) | POST | `/api/admin/wfl/instances/{id}/request-info` | Pasar a waitingRequester con pedido. |
| [API-WFL-31](#API-WFL-31) | POST | `/api/admin/wfl/instances/{id}/cancel` | Ciclo de la instancia. |
| [API-WFL-31-b](#API-WFL-31-b) | POST | `/api/admin/wfl/instances/{id}/suspend` | Ciclo de la instancia. |
| [API-WFL-31-c](#API-WFL-31-c) | POST | `/api/admin/wfl/instances/{id}/resume` | Ciclo de la instancia. |
| [API-WFL-32](#API-WFL-32) | GET | `/api/wfl/procedures/catalog` | Trámites habilitados para el socio. |
| [API-WFL-35](#API-WFL-35) | GET | `/api/wfl/procedures` | Mis trámites y estado público. |
| [API-WFL-33](#API-WFL-33) | POST | `/api/wfl/procedures` | Iniciar o guardar borrador. |
| [API-WFL-34](#API-WFL-34) | POST | `/api/wfl/procedures/{id}/submit` | Enviar. |
| [API-WFL-35-b](#API-WFL-35-b) | GET | `/api/wfl/procedures/{id}` | Mis trámites y estado público. |
| [API-WFL-36](#API-WFL-36) | POST | `/api/wfl/procedures/{id}/reply` | Responder observación con adjuntos. |
| [API-WFL-37](#API-WFL-37) | GET | `/api/admin/wfl/approval-policies` | Políticas. |
| [API-WFL-38](#API-WFL-38) | PUT | `/api/admin/wfl/approval-policies/{id}/draft` | Editar borrador. |
| [API-WFL-39](#API-WFL-39) | POST | `/api/admin/wfl/approval-policies/{id}/publish` | Publicar. |
| [API-WFL-40](#API-WFL-40) | POST | `/api/admin/wfl/approval-policies/simulate` | Simular quién aprueba. |
| [API-WFL-41](#API-WFL-41) | GET | `/api/admin/wfl/approvals/{id}` | Detalle. |
| [API-WFL-42](#API-WFL-42) | POST | `/api/admin/wfl/approvals/{id}/decide` | Aprobar, rechazar o abstenerse (MFA si corresponde; valida huella) |
| [API-WFL-43](#API-WFL-43) | POST | `/api/admin/wfl/approvals/decide-batch` | Decisión masiva con resultado por ítem. |
| [API-WFL-44](#API-WFL-44) | POST | `/api/admin/wfl/approvals/{id}/withdraw` | Retirar. |
| [API-WFL-45](#API-WFL-45) | GET | `/api/admin/wfl/delegations` | Delegaciones. |
| [API-WFL-45-b](#API-WFL-45-b) | POST | `/api/admin/wfl/delegations` | Delegaciones. |
| [API-WFL-45-c](#API-WFL-45-c) | DELETE | `/api/admin/wfl/delegations` | Delegaciones. |
| [API-WFL-46](#API-WFL-46) | GET | `/api/admin/wfl/operation-types` | Tipos de operación. |
| [API-WFL-47](#API-WFL-47) | GET | `/api/admin/wfl/operations` | Operaciones. |
| [API-WFL-47-b](#API-WFL-47-b) | GET | `/api/admin/wfl/operations/{id}` | Operaciones. |
| [API-WFL-48](#API-WFL-48) | POST | `/api/admin/wfl/operations/{id}/retry` | Reintentar paso fallido. |
| [API-WFL-49](#API-WFL-49) | POST | `/api/admin/wfl/operations/{id}/resolve` | Registrar resultado verificado de incierto. |
| [API-WFL-50](#API-WFL-50) | POST | `/api/admin/wfl/operations/{id}/cancel` | Cancelar. |
| [API-WFL-51](#API-WFL-51) | POST | `/api/admin/wfl/documents/uploads` | Pedir URL de subida (delegado a T01) con tipo documental. |
| [API-WFL-52](#API-WFL-52) | POST | `/api/admin/wfl/documents` | Confirmar y registrar documento o versión con vínculos y metadatos. |
| [API-WFL-53](#API-WFL-53) | GET | `/api/admin/wfl/documents/{id}` | Metadatos y versiones. |
| [API-WFL-54](#API-WFL-54) | GET | `/api/admin/wfl/documents/{id}/versions/{v}/url` | URL firmada de descarga (registra acceso) |
| [API-WFL-55](#API-WFL-55) | POST | `/api/admin/wfl/documents/{id}/void` | Anular con motivo. |
| [API-WFL-56](#API-WFL-56) | POST | `/api/admin/wfl/documents/{id}/links` | Vincular a otro sujeto. |
| [API-WFL-57](#API-WFL-57) | POST | `/api/admin/wfl/documents/{id}/share-links` | Crear y revocar enlaces. |
| [API-WFL-57-b](#API-WFL-57-b) | DELETE | `/api/admin/wfl/documents/{id}/share-links` | Crear y revocar enlaces. |
| [API-WFL-58](#API-WFL-58) | POST | `/api/admin/wfl/legal-holds` | Aplicar y liberar hold. |
| [API-WFL-58-b](#API-WFL-58-b) | DELETE | `/api/admin/wfl/legal-holds` | Aplicar y liberar hold. |
| [API-WFL-59](#API-WFL-59) | GET | `/api/admin/wfl/document-types` | Tipos y retención. |
| [API-WFL-59-b](#API-WFL-59-b) | PUT | `/api/admin/wfl/document-types` | Tipos y retención. |
| [API-WFL-59-c](#API-WFL-59-c) | GET | `/api/admin/wfl/retention-policies` | Tipos y retención. |
| [API-WFL-59-d](#API-WFL-59-d) | PUT | `/api/admin/wfl/retention-policies` | Tipos y retención. |
| [API-WFL-60](#API-WFL-60) | GET | `/api/admin/wfl/dossiers/{subjectType}/{id}` | Expediente por sujeto (documentos y línea de tiempo) |
| [API-WFL-61](#API-WFL-61) | POST | `/api/admin/wfl/dossiers/{subjectType}/{id}/export` | Exportar (job) |
| [API-WFL-62](#API-WFL-62) | GET | `/api/admin/wfl/formal-dossiers` | Expedientes formales (abrir, cerrar, foliar, archivar) |
| [API-WFL-62-b](#API-WFL-62-b) | POST | `/api/admin/wfl/formal-dossiers` | Expedientes formales (abrir, cerrar, foliar, archivar) |
| [API-WFL-62-c](#API-WFL-62-c) | PATCH | `/api/admin/wfl/formal-dossiers` | Expedientes formales (abrir, cerrar, foliar, archivar) |
| [API-WFL-63](#API-WFL-63) | GET | `/api/wfl/documents` | Mis documentos y descarga. |
| [API-WFL-63-b](#API-WFL-63-b) | GET | `/api/wfl/documents/{id}/url` | Mis documentos y descarga. |
| [API-WFL-64](#API-WFL-64) | GET | `/api/public/{tenantSlug}/wfl/share/{token}` | Descarga por enlace compartido. |
| [API-WFL-65](#API-WFL-65) | GET | `/api/public/{tenantSlug}/wfl/verify/{code}` | Verificación de documento. |
| [API-WFL-66](#API-WFL-66) | GET | `/api/admin/wfl/templates` | Plantillas y versiones. |
| [API-WFL-66-b](#API-WFL-66-b) | GET | `/api/admin/wfl/templates/{id}` | Plantillas y versiones. |
| [API-WFL-67](#API-WFL-67) | PUT | `/api/admin/wfl/templates/{id}/draft` | Guardar borrador. |
| [API-WFL-68](#API-WFL-68) | POST | `/api/admin/wfl/templates/{id}/preview` | Vista previa con datos de ejemplo o reales. |
| [API-WFL-69](#API-WFL-69) | POST | `/api/admin/wfl/templates/{id}/publish` | Publicar (aprobación si requiresApproval) |
| [API-WFL-70](#API-WFL-70) | GET | `/api/admin/wfl/data-contracts/{code}` | Catálogo de variables. |
| [API-WFL-71](#API-WFL-71) | GET | `/api/admin/wfl/numbering/sequences` | Secuencias. |
| [API-WFL-71-b](#API-WFL-71-b) | POST | `/api/admin/wfl/numbering/sequences` | Secuencias. |
| [API-WFL-72](#API-WFL-72) | GET | `/api/admin/wfl/numbering/sequences/{id}/assignments` | Libro de asignaciones. |
| [API-WFL-73](#API-WFL-73) | POST | `/api/admin/wfl/numbering/sequences/{id}/adjust` | Solicitar ajuste (operación wfl.sequence.adjust) |
| [API-WFL-74](#API-WFL-74) | GET | `/api/admin/wfl/signature-profiles` | Perfiles de firma. |
| [API-WFL-74-b](#API-WFL-74-b) | PUT | `/api/admin/wfl/signature-profiles` | Perfiles de firma. |
| [API-WFL-75](#API-WFL-75) | POST | `/api/admin/wfl/signatures` | Solicitar firma. |
| [API-WFL-76](#API-WFL-76) | GET | `/api/admin/wfl/signatures/{id}` | Estado y evidencias. |
| [API-WFL-77](#API-WFL-77) | POST | `/api/wfl/signatures/{id}/otp` | Enviar OTP. |
| [API-WFL-78](#API-WFL-78) | POST | `/api/wfl/signatures/{id}/sign` | Firmar (electrónica o manuscrita) |
| [API-WFL-79](#API-WFL-79) | POST | `/api/wfl/signatures/{id}/reject` | Rechazar con motivo. |
| [API-WFL-80](#API-WFL-80) | GET | `/api/admin/wfl/jobs/definitions` | Catálogo de jobs. |
| [API-WFL-81](#API-WFL-81) | GET | `/api/admin/wfl/jobs/schedules` | Programaciones y reprogramación. |
| [API-WFL-81-b](#API-WFL-81-b) | PATCH | `/api/admin/wfl/jobs/schedules` | Programaciones y reprogramación. |
| [API-WFL-81-c](#API-WFL-81-c) | GET | `/api/admin/wfl/jobs/schedules/{id}` | Programaciones y reprogramación. |
| [API-WFL-81-d](#API-WFL-81-d) | PATCH | `/api/admin/wfl/jobs/schedules/{id}` | Programaciones y reprogramación. |
| [API-WFL-82](#API-WFL-82) | GET | `/api/admin/wfl/bulk-runs` | Corridas y progreso. |
| [API-WFL-82-b](#API-WFL-82-b) | GET | `/api/admin/wfl/bulk-runs/{id}` | Corridas y progreso. |
| [API-WFL-83](#API-WFL-83) | POST | `/api/admin/wfl/bulk-runs/{id}/pause` | Control de corrida. |
| [API-WFL-83-b](#API-WFL-83-b) | POST | `/api/admin/wfl/bulk-runs/{id}/resume` | Control de corrida. |
| [API-WFL-83-c](#API-WFL-83-c) | POST | `/api/admin/wfl/bulk-runs/{id}/cancel` | Control de corrida. |
| [API-WFL-84](#API-WFL-84) | POST | `/api/admin/wfl/bulk-runs/{id}/reprocess` | Reprocesar excepciones resueltas. |
| [API-WFL-85](#API-WFL-85) | GET | `/api/admin/wfl/bulk-runs/{id}/items` | Excepciones por motivo. |
| [API-WFL-86](#API-WFL-86) | GET | `/api/admin/wfl/event-types` | Catálogo de eventos. |
| [API-WFL-87](#API-WFL-87) | GET | `/api/admin/wfl/events/by-aggregate` | Cadena de eventos de un agregado (metadatos) |
| [API-WFL-88](#API-WFL-88) | GET | `/api/admin/wfl/operational-inbox` | Bandeja operativa. |
| [API-WFL-89](#API-WFL-89) | POST | `/api/admin/wfl/operational-inbox/{id}/reprocess` | Acciones de la bandeja operativa. |
| [API-WFL-89-b](#API-WFL-89-b) | POST | `/api/admin/wfl/operational-inbox/{id}/resolve` | Acciones de la bandeja operativa. |
| [API-WFL-89-c](#API-WFL-89-c) | POST | `/api/admin/wfl/operational-inbox/{id}/discard` | Acciones de la bandeja operativa. |
| [API-WFL-90](#API-WFL-90) | POST | `/api/platform/wfl/replay` | *Replay* de eventos para un consumidor y tenant. |
| [API-WFL-91](#API-WFL-91) | GET | `/api/platform/wfl/catalog/health` | Tipos sin consumidores, consumidores sin productor, alias en uso. |

<a id="API-WFL-01"></a>
#### API-WFL-01 · `GET /api/admin/wfl/inbox`

- **Qué hace:** Bandeja con filtros y grupos. Lista, con filtros y paginación, los registros de `inbox`.
- **Para qué sirve:** RF-WFL-133: Filtros: tipo, módulo, estado, prioridad, área, sujeto, vencimiento; vistas guardadas; contador por grupo en tiempo real. · RF-WFL-130: Bandeja única (workItems) que proyecta: tareas de T11, pasos de aprobación, autorizaciones puntuales de T02, casos de M09 asignados, OT y visitas de M10 asignadas, excepciones de lote, operaciones detenidas, conflictos de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.tareas.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ResultadoGenerico (`ResultadoGenerico`) con `total`.
- **Pantallas:** PAN-WFL-01 (Mi bandeja de tareas), PAN-WFL-03 (Detalle de tarea), PAN-WFL-08 (Instancias de trámites) y 1 más.
- **Ola:** O1 · **Fuente:** T11 §11. API, línea 2056 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-01)

<a id="API-WFL-02"></a>
#### API-WFL-02 · `GET /api/admin/wfl/inbox/summary`

- **Qué hace:** Contadores por grupo. Consulta `summary`.
- **Para qué sirve:** RF-WFL-133: Filtros: tipo, módulo, estado, prioridad, área, sujeto, vencimiento; vistas guardadas; contador por grupo en tiempo real. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.tareas.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-WFL-01 (Mi bandeja de tareas), PAN-WFL-03 (Detalle de tarea), PAN-WFL-08 (Instancias de trámites) y 1 más.
- **Ola:** O1 · **Fuente:** T11 §11. API, línea 2057 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-02)

<a id="API-WFL-03"></a>
#### API-WFL-03 · `POST /api/admin/wfl/inbox/{workItemId}/claim`

- **Qué hace:** Tomar ítem. Registra «claim» sobre un registro de `claim`.
- **Para qué sirve:** RF-WFL-134: Tomar un ítem de cola (exclusivo, con límite configurable de ítems tomados en simultáneo) y liberarlo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.tareas.ejecutar`.
- **Recibe:** en la ruta `workItemId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T11 §11. API, línea 2058 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-03)

<a id="API-WFL-04"></a>
#### API-WFL-04 · `POST /api/admin/wfl/inbox/{workItemId}/release`

- **Qué hace:** Liberar. Libera un registro de `release`.
- **Para qué sirve:** RF-WFL-134: Tomar un ítem de cola (exclusivo, con límite configurable de ítems tomados en simultáneo) y liberarlo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.tareas.ejecutar`.
- **Recibe:** en la ruta `workItemId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T11 §11. API, línea 2059 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-04)

<a id="API-WFL-05"></a>
#### API-WFL-05 · `POST /api/admin/wfl/inbox/{workItemId}/snooze`

- **Qué hace:** Posponer. Registra «snooze» sobre un registro de `snooze`.
- **Para qué sirve:** RF-WFL-135: Acciones en línea según tipo: aprobar, rechazar, completar, abrir, reasignar, posponer (con fecha), comentar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.tareas.ver`.
- **Recibe:** en la ruta `workItemId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-WFL-01 (Mi bandeja de tareas), PAN-WFL-03 (Detalle de tarea), PAN-WFL-08 (Instancias de trámites) y 1 más.
- **Ola:** O1 · **Fuente:** T11 §11. API, línea 2060 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-05)

<a id="API-WFL-06"></a>
#### API-WFL-06 · `POST /api/admin/wfl/inbox/reassign`

- **Qué hace:** Reasignación masiva. Registra un nuevo elemento u operación en `reassign`.
- **Para qué sirve:** RF-WFL-136: Vista de supervisión: carga por persona, vencidos por área, reasignación masiva. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.tareas.reasignar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T11 §11. API, línea 2061 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-06)

<a id="API-WFL-07"></a>
#### API-WFL-07 · `GET /api/admin/wfl/inbox/team`

- **Qué hace:** Carga por persona y área. Consulta `team`.
- **Para qué sirve:** RF-WFL-136: Vista de supervisión: carga por persona, vencidos por área, reasignación masiva. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.bandeja.supervisar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-WFL-02 (Supervisión de bandejas).
- **Ola:** O1 · **Fuente:** T11 §11. API, línea 2062 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-07)

<a id="API-WFL-08"></a>
#### API-WFL-08 · `POST /api/admin/wfl/tasks`

- **Qué hace:** Crear tarea ad hoc o recurrente. Da de alta un registro de tareas (`tasks`).
- **Para qué sirve:** RF-WFL-138: Tareas ad hoc: crear, asignar a persona o área, vencimiento, recurrencia (RRULE), checklist, evidencias obligatorias al completar, comentarios con menciones y vínculo a cualquier entidad. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.tareas.crear`.
- **Recibe:** los datos de tareas (`tasks`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de tareas (`tasks`).
- **Ola:** O1 · **Fuente:** T11 §11. API, línea 2063 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-08)

<a id="API-WFL-09"></a>
#### API-WFL-09 · `GET /api/admin/wfl/tasks/{id}`

- **Qué hace:** Detalle. Obtiene el detalle de un registro de tareas (`tasks`).
- **Para qué sirve:** RF-WFL-029: Resultado de corrida descargable (XLSX/CSV) con detalle por ítem y resumen; el archivo vive en ga-<env>-exports con vencimiento. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.tareas.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de tareas (`tasks`).
- **Pantallas:** PAN-WFL-01 (Mi bandeja de tareas), PAN-WFL-03 (Detalle de tarea), PAN-WFL-08 (Instancias de trámites) y 1 más.
- **Ola:** O1 · **Fuente:** T11 §11. API, línea 2064 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-09)

<a id="API-WFL-10"></a>
#### API-WFL-10 · `PATCH /api/admin/wfl/tasks/{id}`

- **Qué hace:** Editar (If-Match) Modifica algunos campos de un registro de tareas (`tasks`) (solo los enviados).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.tareas.ejecutar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de tareas (`tasks`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de tareas (`tasks`).
- **Ola:** O1 · **Fuente:** T11 §11. API, línea 2065 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-10)

<a id="API-WFL-11"></a>
#### API-WFL-11 · `POST /api/admin/wfl/tasks/{id}/complete`

- **Qué hace:** Completar con evidencias. Completa un registro de tareas (`tasks`).
- **Para qué sirve:** RF-WFL-138: Tareas ad hoc: crear, asignar a persona o área, vencimiento, recurrencia (RRULE), checklist, evidencias obligatorias al completar, comentarios con menciones y vínculo a cualquier entidad. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.tareas.ejecutar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T11 §11. API, línea 2066 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-11)

<a id="API-WFL-12"></a>
#### API-WFL-12 · `POST /api/admin/wfl/tasks/{id}/comments`

- **Qué hace:** Comentar con menciones. Agrega un elemento («comments») a un registro de tareas (`tasks`).
- **Para qué sirve:** RF-WFL-139: Reemplazo del correo interno PROMAIL por comentarios en tareas y casos con menciones y notificación T09. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.tareas.ver`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-WFL-01 (Mi bandeja de tareas), PAN-WFL-03 (Detalle de tarea), PAN-WFL-08 (Instancias de trámites) y 1 más.
- **Ola:** O1 · **Fuente:** T11 §11. API, línea 2067 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-12)

<a id="API-WFL-13"></a>
#### API-WFL-13 · `GET /api/admin/wfl/agenda`

- **Qué hace:** Agenda por rango y capas. Consulta `agenda`.
- **Para qué sirve:** RF-WFL-191: Alerta de secuencia cercana al máximo o rango asignado por terceros a punto de agotarse. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.agenda.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-WFL-04 (Agenda unificada con vistas día, semana, mes y lista), PAN-WFL-24 (Agenda del día y de la semana en tarjetas).
- **Ola:** O4 · **Fuente:** T11 §11. API, línea 2068 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-13)

<a id="API-WFL-14"></a>
#### API-WFL-14 · `POST /api/admin/wfl/agenda/feeds`

- **Qué hace:** Crear o rotar feed iCal. Da de alta un registro de feeds de calendario externos (`agendaFeeds`).
- **Para qué sirve:** RF-WFL-144: Feed iCal privado de solo lectura por usuario con token revocable, sin datos personales de socios en el título. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.agenda.ver`.
- **Recibe:** los datos de feeds de calendario externos (`agendaFeeds`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de feeds de calendario externos (`agendaFeeds`).
- **Pantallas:** PAN-WFL-04 (Agenda unificada con vistas día, semana, mes y lista), PAN-WFL-24 (Agenda del día y de la semana en tarjetas).
- **Ola:** O2 · **Fuente:** T11 §11. API, línea 2069 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-14)

<a id="API-WFL-15"></a>
#### API-WFL-15 · `DELETE /api/admin/wfl/agenda/feeds/{id}`

- **Qué hace:** Revocar feed. Elimina o da de baja un registro de feeds de calendario externos (`agendaFeeds`).
- **Para qué sirve:** RF-WFL-144: Feed iCal privado de solo lectura por usuario con token revocable, sin datos personales de socios en el título. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.agenda.ver`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-WFL-04 (Agenda unificada con vistas día, semana, mes y lista), PAN-WFL-24 (Agenda del día y de la semana en tarjetas).
- **Ola:** O2 · **Fuente:** T11 §11. API, línea 2070 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-15)

<a id="API-WFL-16"></a>
#### API-WFL-16 · `GET /api/public/{tenantSlug}/wfl/ical/{token}.ics`

- **Qué hace:** Feed iCal de solo lectura. Obtiene el detalle de un registro de `ical`.
- **Para qué sirve:** RF-WFL-144: Feed iCal privado de solo lectura por usuario con token revocable, sin datos personales de socios en el título. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`, `token`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T11 §11. API, línea 2071 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-16)

<a id="API-WFL-17"></a>
#### API-WFL-17 · `GET /api/admin/wfl/state-machines`

- **Qué hace:** Catálogo de máquinas. Lista, con filtros y paginación, los registros de `state-machines`.
- **Para qué sirve:** RF-WFL-065: Diagrama de solo lectura de cada máquina en la administración (PAN-WFL-05), generado desde la definición. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.flujos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ResultadoGenerico (`ResultadoGenerico`) con `total`.
- **Pantallas:** PAN-WFL-05 (Catálogo de máquinas de estado por módulo).
- **Ola:** O1 · **Fuente:** T11 §11. API, línea 2072 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-17)

<a id="API-WFL-18"></a>
#### API-WFL-18 · `GET /api/admin/wfl/workflows`

- **Qué hace:** Definiciones. Consulta `workflows`.
- **Para qué sirve:** RF-WFL-065: Diagrama de solo lectura de cada máquina en la administración (PAN-WFL-05), generado desde la definición. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.flujos.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-WFL-05 (Catálogo de máquinas de estado por módulo).
- **Ola:** O1 · **Fuente:** T11 §11. API, línea 2073 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-18)

<a id="API-WFL-19"></a>
#### API-WFL-19 · `POST /api/admin/wfl/workflows`

- **Qué hace:** Crear o adoptar plantilla. Registra un nuevo elemento u operación en `workflows`.
- **Para qué sirve:** RF-WFL-179: Plantillas semilla de plataforma (§18.4, 46 plantillas) que el tenant adopta y personaliza en zonas editables. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.flujos.configurar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-WFL-06 (Lista de definiciones), PAN-WFL-09 (Políticas de aprobación), PAN-WFL-12 (Tipos de operación del tenant) y 1 más.
- **Ola:** O2 · **Fuente:** T11 §11. API, línea 2074 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-19)

<a id="API-WFL-20"></a>
#### API-WFL-20 · `PUT /api/admin/wfl/workflows/{id}/draft`

- **Qué hace:** Guardar borrador (If-Match) Reemplaza o configura `draft`.
- **Para qué sirve:** RF-WFL-081: Simulación de workflow: recorrer una definición en borrador con datos de prueba sin efectos (acciones en modo simulación). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.flujos.configurar`.
- **Recibe:** en la ruta `id`; un cuerpo JSON cuya estructura detalla el anexo; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-WFL-06 (Lista de definiciones), PAN-WFL-09 (Políticas de aprobación), PAN-WFL-12 (Tipos de operación del tenant) y 1 más.
- **Ola:** O2 · **Fuente:** T11 §11. API, línea 2075 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-20)

<a id="API-WFL-21"></a>
#### API-WFL-21 · `POST /api/admin/wfl/workflows/{id}/validate`

- **Qué hace:** Validación estructural. Valida un registro de `validate`.
- **Para qué sirve:** RF-WFL-070: Diseñador de workflows (PAN-WFL-06) con nodos: inicio, tarea humana, aprobación, acción automática, espera de evento, temporizador, decisión (condición), paralelo y unión, subproceso y fin; validación estructural antes de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.flujos.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-WFL-06 (Lista de definiciones), PAN-WFL-09 (Políticas de aprobación), PAN-WFL-12 (Tipos de operación del tenant) y 1 más.
- **Ola:** O2 · **Fuente:** T11 §11. API, línea 2076 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-21)

<a id="API-WFL-22"></a>
#### API-WFL-22 · `POST /api/admin/wfl/workflows/{id}/simulate`

- **Qué hace:** Simulación sin efectos. Simula sin efectos un registro de `simulate`.
- **Para qué sirve:** RF-WFL-081: Simulación de workflow: recorrer una definición en borrador con datos de prueba sin efectos (acciones en modo simulación). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.flujos.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-WFL-06 (Lista de definiciones), PAN-WFL-09 (Políticas de aprobación), PAN-WFL-12 (Tipos de operación del tenant) y 1 más.
- **Ola:** O2 · **Fuente:** T11 §11. API, línea 2077 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-22)

<a id="API-WFL-23"></a>
#### API-WFL-23 · `POST /api/admin/wfl/workflows/{id}/publish`

- **Qué hace:** Publicar con vigencia (aprobación si PRM-WFL-030) Publica un registro de `publish`.
- **Para qué sirve:** RF-WFL-110: Políticas de aprobación (approvalPolicies) por tipo de operación o código de política, con versión y vigencia, que resuelven pasos según importe, moneda, área, sucursal, servicio, categoría, riesgo y atributos del sujeto. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.flujos.publicar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T11 §11. API, línea 2078 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-23)

<a id="API-WFL-24"></a>
#### API-WFL-24 · `POST /api/admin/wfl/workflows/{id}/migrate-instances`

- **Qué hace:** Migrar instancias (crea operación wfl.instances.migrate) Registra «migrate-instances» sobre un registro de `migrate-instances`.
- **Para qué sirve:** RF-WFL-077: Instancias con sujeto principal y sujetos relacionados, datos de entrada, formulario, adjuntos, historial de nodos, tareas, comentarios internos y públicos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.flujos.publicar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T11 §11. API, línea 2079 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-24)

<a id="API-WFL-25"></a>
#### API-WFL-25 · `GET /api/admin/wfl/forms`

- **Qué hace:** Formularios y publicación. Consulta `forms`.
- **Para qué sirve:** RF-WFL-077: Instancias con sujeto principal y sujetos relacionados, datos de entrada, formulario, adjuntos, historial de nodos, tareas, comentarios internos y públicos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.formularios.configurar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-WFL-07 (Diseñador de formularios).
- **Ola:** O2 · **Fuente:** T11 §11. API, línea 2080 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-25)

<a id="API-WFL-25-b"></a>
#### API-WFL-25-b · `POST /api/admin/wfl/forms`

- **Qué hace:** Formularios y publicación. Registra un nuevo elemento u operación en `forms`.
- **Para qué sirve:** RF-WFL-077: Instancias con sujeto principal y sujetos relacionados, datos de entrada, formulario, adjuntos, historial de nodos, tareas, comentarios internos y públicos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.formularios.configurar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-WFL-07 (Diseñador de formularios).
- **Ola:** O2 · **Fuente:** T11 §11. API, línea 2080 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-25-b)

<a id="API-WFL-25-c"></a>
#### API-WFL-25-c · `GET /api/admin/wfl/forms/{id}/publish`

- **Qué hace:** Formularios y publicación. Consulta «publish» de un registro de `publish`.
- **Para qué sirve:** RF-WFL-077: Instancias con sujeto principal y sujetos relacionados, datos de entrada, formulario, adjuntos, historial de nodos, tareas, comentarios internos y públicos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.formularios.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-WFL-07 (Diseñador de formularios).
- **Ola:** O2 · **Fuente:** T11 §11. API, línea 2080 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-25-c)

<a id="API-WFL-25-d"></a>
#### API-WFL-25-d · `POST /api/admin/wfl/forms/{id}/publish`

- **Qué hace:** Formularios y publicación. Publica un registro de `publish`.
- **Para qué sirve:** RF-WFL-077: Instancias con sujeto principal y sujetos relacionados, datos de entrada, formulario, adjuntos, historial de nodos, tareas, comentarios internos y públicos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.formularios.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-WFL-07 (Diseñador de formularios).
- **Ola:** O2 · **Fuente:** T11 §11. API, línea 2080 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-25-d)

<a id="API-WFL-26"></a>
#### API-WFL-26 · `GET /api/admin/wfl/data-sources/{code}`

- **Qué hace:** Valores de una fuente tipada. Obtiene el detalle de un registro de `data-sources`.
- **Para qué sirve:** RF-WFL-093: Fuentes de datos tipadas registradas por módulos (por ejemplo, "adherentes del contrato", "categorías del servicio", "sucursales") en lugar de consultas SQL libres. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.flujos.ver`.
- **Recibe:** en la ruta `code`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-WFL-05 (Catálogo de máquinas de estado por módulo).
- **Ola:** O2 · **Fuente:** T11 §11. API, línea 2081 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-26)

<a id="API-WFL-28"></a>
#### API-WFL-28 · `GET /api/admin/wfl/instances`

- **Qué hace:** Listado y detalle. Lista, con filtros y paginación, los registros de instancias en curso (`workflowInstances`).
- **Para qué sirve:** RF-WFL-071: Definiciones versionadas (workflowVersions): borrador, en revisión, publicada, retirada; las instancias en curso siguen su versión; la migración de instancias a versión nueva es explícita y auditada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.tareas.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de instancias en curso (`workflowInstances`) con `total`.
- **Pantallas:** PAN-WFL-01 (Mi bandeja de tareas), PAN-WFL-03 (Detalle de tarea), PAN-WFL-08 (Instancias de trámites) y 1 más.
- **Ola:** O2 · **Fuente:** T11 §11. API, línea 2083 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-28)

<a id="API-WFL-27"></a>
#### API-WFL-27 · `POST /api/admin/wfl/instances`

- **Qué hace:** Iniciar instancia desde admin. Da de alta un registro de instancias en curso (`workflowInstances`).
- **Para qué sirve:** RF-WFL-080: Iniciación de trámites desde la PWA del socio, el admin, la API interna de módulos o un evento; los trámites habilitados para el socio se publican en "Mis trámites". *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.instancias.iniciar`.
- **Recibe:** los datos de instancias en curso (`workflowInstances`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de instancias en curso (`workflowInstances`).
- **Ola:** O2 · **Fuente:** T11 §11. API, línea 2082 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-27)

<a id="API-WFL-28-b"></a>
#### API-WFL-28-b · `GET /api/admin/wfl/instances/{id}`

- **Qué hace:** Listado y detalle. Obtiene el detalle de un registro de instancias en curso (`workflowInstances`).
- **Para qué sirve:** RF-WFL-071: Definiciones versionadas (workflowVersions): borrador, en revisión, publicada, retirada; las instancias en curso siguen su versión; la migración de instancias a versión nueva es explícita y auditada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.tareas.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de instancias en curso (`workflowInstances`).
- **Pantallas:** PAN-WFL-01 (Mi bandeja de tareas), PAN-WFL-03 (Detalle de tarea), PAN-WFL-08 (Instancias de trámites) y 1 más.
- **Ola:** O2 · **Fuente:** T11 §11. API, línea 2083 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-28-b)

<a id="API-WFL-29"></a>
#### API-WFL-29 · `POST /api/admin/wfl/instances/{id}/transition`

- **Qué hace:** Completar nodo o tomar decisión de ruta. Cambia de estado (transición) un registro de instancias en curso (`workflowInstances`).
- **Para qué sirve:** RF-WFL-071: Definiciones versionadas (workflowVersions): borrador, en revisión, publicada, retirada; las instancias en curso siguen su versión; la migración de instancias a versión nueva es explícita y auditada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.tareas.ejecutar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T11 §11. API, línea 2084 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-29)

<a id="API-WFL-30"></a>
#### API-WFL-30 · `POST /api/admin/wfl/instances/{id}/request-info`

- **Qué hace:** Pasar a waitingRequester con pedido. Registra «request-info» sobre un registro de instancias en curso (`workflowInstances`).
- **Para qué sirve:** RF-WFL-071: Definiciones versionadas (workflowVersions): borrador, en revisión, publicada, retirada; las instancias en curso siguen su versión; la migración de instancias a versión nueva es explícita y auditada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.tareas.ejecutar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T11 §11. API, línea 2085 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-30)

<a id="API-WFL-31"></a>
#### API-WFL-31 · `POST /api/admin/wfl/instances/{id}/cancel`

- **Qué hace:** Ciclo de la instancia. Cancela un registro de instancias en curso (`workflowInstances`).
- **Para qué sirve:** RF-WFL-071: Definiciones versionadas (workflowVersions): borrador, en revisión, publicada, retirada; las instancias en curso siguen su versión; la migración de instancias a versión nueva es explícita y auditada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.instancias.administrar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T11 §11. API, línea 2086 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-31)

<a id="API-WFL-31-b"></a>
#### API-WFL-31-b · `POST /api/admin/wfl/instances/{id}/suspend`

- **Qué hace:** Ciclo de la instancia. Suspende un registro de instancias en curso (`workflowInstances`).
- **Para qué sirve:** RF-WFL-071: Definiciones versionadas (workflowVersions): borrador, en revisión, publicada, retirada; las instancias en curso siguen su versión; la migración de instancias a versión nueva es explícita y auditada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.instancias.administrar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T11 §11. API, línea 2086 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-31-b)

<a id="API-WFL-31-c"></a>
#### API-WFL-31-c · `POST /api/admin/wfl/instances/{id}/resume`

- **Qué hace:** Ciclo de la instancia. Reanuda un registro de instancias en curso (`workflowInstances`).
- **Para qué sirve:** RF-WFL-071: Definiciones versionadas (workflowVersions): borrador, en revisión, publicada, retirada; las instancias en curso siguen su versión; la migración de instancias a versión nueva es explícita y auditada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.instancias.administrar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T11 §11. API, línea 2086 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-31-c)

<a id="API-WFL-32"></a>
#### API-WFL-32 · `GET /api/wfl/procedures/catalog`

- **Qué hace:** Trámites habilitados para el socio. Lista, con filtros y paginación, los registros de acciones invocables desde workflows (`actionCatalog`).
- **Para qué sirve:** RF-WFL-080: Iniciación de trámites desde la PWA del socio, el admin, la API interna de módulos o un evento; los trámites habilitados para el socio se publican en "Mis trámites". *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `por.tramites.iniciar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de acciones invocables desde workflows (`actionCatalog`) con `total`.
- **Pantallas:** PAN-WFL-25 (Trámites).
- **Ola:** O2 · **Fuente:** T11 §11. API, línea 2087 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-32)

<a id="API-WFL-35"></a>
#### API-WFL-35 · `GET /api/wfl/procedures`

- **Qué hace:** Mis trámites y estado público. Consulta `procedures`.
- **Para qué sirve:** RF-WFL-080: Iniciación de trámites desde la PWA del socio, el admin, la API interna de módulos o un evento; los trámites habilitados para el socio se publican en "Mis trámites". *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `por.tramites.iniciar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-WFL-25 (Trámites).
- **Ola:** O2 · **Fuente:** T11 §11. API, línea 2090 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-35)

<a id="API-WFL-33"></a>
#### API-WFL-33 · `POST /api/wfl/procedures`

- **Qué hace:** Iniciar o guardar borrador. Registra un nuevo elemento u operación en `procedures`.
- **Para qué sirve:** RF-WFL-080: Iniciación de trámites desde la PWA del socio, el admin, la API interna de módulos o un evento; los trámites habilitados para el socio se publican en "Mis trámites". *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `por.tramites.iniciar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-WFL-25 (Trámites).
- **Ola:** O2 · **Fuente:** T11 §11. API, línea 2088 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-33)

<a id="API-WFL-34"></a>
#### API-WFL-34 · `POST /api/wfl/procedures/{id}/submit`

- **Qué hace:** Enviar. Envía a revisión o presenta un registro de `submit`.
- **Para qué sirve:** RF-WFL-080: Iniciación de trámites desde la PWA del socio, el admin, la API interna de módulos o un evento; los trámites habilitados para el socio se publican en "Mis trámites". *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `por.tramites.iniciar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-WFL-25 (Trámites).
- **Ola:** O2 · **Fuente:** T11 §11. API, línea 2089 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-34)

<a id="API-WFL-35-b"></a>
#### API-WFL-35-b · `GET /api/wfl/procedures/{id}`

- **Qué hace:** Mis trámites y estado público. Obtiene el detalle de un registro de `procedures`.
- **Para qué sirve:** RF-WFL-080: Iniciación de trámites desde la PWA del socio, el admin, la API interna de módulos o un evento; los trámites habilitados para el socio se publican en "Mis trámites". *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `por.tramites.iniciar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-WFL-25 (Trámites).
- **Ola:** O2 · **Fuente:** T11 §11. API, línea 2090 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-35-b)

<a id="API-WFL-36"></a>
#### API-WFL-36 · `POST /api/wfl/procedures/{id}/reply`

- **Qué hace:** Responder observación con adjuntos. Responde un registro de `reply`.
- **Para qué sirve:** RF-WFL-080: Iniciación de trámites desde la PWA del socio, el admin, la API interna de módulos o un evento; los trámites habilitados para el socio se publican en "Mis trámites". · RF-WFL-164: Adjuntar múltiples PDF y combinarlos en un único documento cuando el trámite lo pide. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `por.tramites.iniciar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-WFL-25 (Trámites).
- **Ola:** O2 · **Fuente:** T11 §11. API, línea 2091 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-36)

<a id="API-WFL-37"></a>
#### API-WFL-37 · `GET /api/admin/wfl/approval-policies`

- **Qué hace:** Políticas. Lista, con filtros y paginación, los registros de políticas de aprobación (`approvalPolicies`).
- **Para qué sirve:** RF-WFL-124: Simulador de política: dado un tipo, importe y atributos, muestra quiénes aprobarían y en qué orden. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.flujos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de políticas de aprobación (`approvalPolicies`) con `total`.
- **Pantallas:** PAN-WFL-05 (Catálogo de máquinas de estado por módulo).
- **Ola:** O1 · **Fuente:** T11 §11. API, línea 2092 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-37)

<a id="API-WFL-38"></a>
#### API-WFL-38 · `PUT /api/admin/wfl/approval-policies/{id}/draft`

- **Qué hace:** Editar borrador. Reemplaza o configura políticas de aprobación (`approvalPolicies`).
- **Para qué sirve:** RF-WFL-124: Simulador de política: dado un tipo, importe y atributos, muestra quiénes aprobarían y en qué orden. · RF-WFL-081: Simulación de workflow: recorrer una definición en borrador con datos de prueba sin efectos (acciones en modo simulación). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.flujos.configurar`.
- **Recibe:** en la ruta `id`; los datos de políticas de aprobación (`approvalPolicies`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de políticas de aprobación (`approvalPolicies`).
- **Pantallas:** PAN-WFL-06 (Lista de definiciones), PAN-WFL-09 (Políticas de aprobación), PAN-WFL-12 (Tipos de operación del tenant) y 1 más.
- **Ola:** O1 · **Fuente:** T11 §11. API, línea 2093 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-38)

<a id="API-WFL-39"></a>
#### API-WFL-39 · `POST /api/admin/wfl/approval-policies/{id}/publish`

- **Qué hace:** Publicar. Publica un registro de políticas de aprobación (`approvalPolicies`).
- **Para qué sirve:** RF-WFL-124: Simulador de política: dado un tipo, importe y atributos, muestra quiénes aprobarían y en qué orden. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.flujos.publicar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T11 §11. API, línea 2094 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-39)

<a id="API-WFL-40"></a>
#### API-WFL-40 · `POST /api/admin/wfl/approval-policies/simulate`

- **Qué hace:** Simular quién aprueba. Simula sin efectos sobre políticas de aprobación (`approvalPolicies`).
- **Para qué sirve:** RF-WFL-112: Separación de funciones dinámica: el solicitante nunca aprueba su solicitud; una persona no aprueba dos pasos de la misma solicitud; reglas de SoD de T02 (por ejemplo, quien registra el CBU no aprueba el pago). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.flujos.ver`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-WFL-05 (Catálogo de máquinas de estado por módulo).
- **Ola:** O1 · **Fuente:** T11 §11. API, línea 2095 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-40)

<a id="API-WFL-41"></a>
#### API-WFL-41 · `GET /api/admin/wfl/approvals/{id}`

- **Qué hace:** Detalle. Obtiene el detalle de un registro de `approvals`.
- **Para qué sirve:** RF-WFL-114: Límites de importe del aprobador desde su asignación de rol (T02, marca $) validados al decidir. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.aprobaciones.decidir`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-WFL-10 (Detalle de aprobación).
- **Ola:** O1 · **Fuente:** T11 §11. API, línea 2096 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-41)

<a id="API-WFL-42"></a>
#### API-WFL-42 · `POST /api/admin/wfl/approvals/{id}/decide`

- **Qué hace:** Aprobar, rechazar o abstenerse (MFA si corresponde; valida huella) Registra la decisión sobre un registro de `decide`.
- **Para qué sirve:** RF-WFL-114: Límites de importe del aprobador desde su asignación de rol (T02, marca $) validados al decidir. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.aprobaciones.decidir`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-WFL-10 (Detalle de aprobación).
- **Ola:** O1 · **Fuente:** T11 §11. API, línea 2097 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-42)

<a id="API-WFL-43"></a>
#### API-WFL-43 · `POST /api/admin/wfl/approvals/decide-batch`

- **Qué hace:** Decisión masiva con resultado por ítem. Registra un nuevo elemento u operación en `decide-batch`.
- **Para qué sirve:** RF-WFL-117: Aprobación diferida multipaso desde la bandeja (web y PWA del empleado con push de T09), incluida la decisión masiva de solicitudes homogéneas con validación por ítem. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.aprobaciones.decidir`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-WFL-10 (Detalle de aprobación).
- **Ola:** O1 · **Fuente:** T11 §11. API, línea 2098 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-43)

<a id="API-WFL-44"></a>
#### API-WFL-44 · `POST /api/admin/wfl/approvals/{id}/withdraw`

- **Qué hace:** Retirar. Retira un registro de `withdraw`.
- **Para qué sirve:** RF-WFL-071: Definiciones versionadas (workflowVersions): borrador, en revisión, publicada, retirada; las instancias en curso siguen su versión; la migración de instancias a versión nueva es explícita y auditada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.tareas.ejecutar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T11 §11. API, línea 2099 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-44)

<a id="API-WFL-45"></a>
#### API-WFL-45 · `GET /api/admin/wfl/delegations`

- **Qué hace:** Delegaciones. Lista, con filtros y paginación, los registros de delegaciones de aprobación (`delegations`).
- **Para qué sirve:** RF-WFL-123: Evidencia de cada decisión: aprobador, delegante, fecha, método de autenticación, huella de contenido, versión de la política aplicada y comentario. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.aprobaciones.delegar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de delegaciones de aprobación (`delegations`) con `total`.
- **Pantallas:** PAN-WFL-11 (Mis delegaciones).
- **Ola:** O1 · **Fuente:** T11 §11. API, línea 2100 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-45)

<a id="API-WFL-45-b"></a>
#### API-WFL-45-b · `POST /api/admin/wfl/delegations`

- **Qué hace:** Delegaciones. Da de alta un registro de delegaciones de aprobación (`delegations`).
- **Para qué sirve:** RF-WFL-123: Evidencia de cada decisión: aprobador, delegante, fecha, método de autenticación, huella de contenido, versión de la política aplicada y comentario. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.aprobaciones.delegar`.
- **Recibe:** los datos de delegaciones de aprobación (`delegations`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de delegaciones de aprobación (`delegations`).
- **Pantallas:** PAN-WFL-11 (Mis delegaciones).
- **Ola:** O1 · **Fuente:** T11 §11. API, línea 2100 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-45-b)

<a id="API-WFL-45-c"></a>
#### API-WFL-45-c · `DELETE /api/admin/wfl/delegations`

- **Qué hace:** Delegaciones. Elimina o da de baja un registro de delegaciones de aprobación (`delegations`).
- **Para qué sirve:** RF-WFL-123: Evidencia de cada decisión: aprobador, delegante, fecha, método de autenticación, huella de contenido, versión de la política aplicada y comentario. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.aprobaciones.delegar`.
- **Recibe:** cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-WFL-11 (Mis delegaciones).
- **Ola:** O1 · **Fuente:** T11 §11. API, línea 2100 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-45-c)

<a id="API-WFL-46"></a>
#### API-WFL-46 · `GET /api/admin/wfl/operation-types`

- **Qué hace:** Tipos de operación. Lista, con filtros y paginación, los registros de tipos de operación de negocio (`operationTypes`).
- **Para qué sirve:** RF-WFL-017: Eventos de auditoría de negocio separados: la auditoría de cambios es de T02; un evento de dominio no reemplaza el registro de auditoría ni viceversa. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.flujos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de tipos de operación de negocio (`operationTypes`) con `total`.
- **Pantallas:** PAN-WFL-05 (Catálogo de máquinas de estado por módulo).
- **Ola:** O0 · **Fuente:** T11 §11. API, línea 2101 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-46)

<a id="API-WFL-47"></a>
#### API-WFL-47 · `GET /api/admin/wfl/operations`

- **Qué hace:** Operaciones. Lista, con filtros y paginación, los registros de operaciones de negocio con pasos (`operations`).
- **Para qué sirve:** RF-WFL-119: Vencimiento y escalamiento de pasos (RF-WFL-101); al expirar la solicitud, la operación pasa a expired y el solicitante es notificado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.operaciones.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de operaciones de negocio con pasos (`operations`) con `total`.
- **Pantallas:** PAN-WFL-13 (Operaciones).
- **Ola:** O0 · **Fuente:** T11 §11. API, línea 2102 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-47)

<a id="API-WFL-47-b"></a>
#### API-WFL-47-b · `GET /api/admin/wfl/operations/{id}`

- **Qué hace:** Operaciones. Obtiene el detalle de un registro de operaciones de negocio con pasos (`operations`).
- **Para qué sirve:** RF-WFL-119: Vencimiento y escalamiento de pasos (RF-WFL-101); al expirar la solicitud, la operación pasa a expired y el solicitante es notificado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.operaciones.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de operaciones de negocio con pasos (`operations`).
- **Pantallas:** PAN-WFL-13 (Operaciones).
- **Ola:** O0 · **Fuente:** T11 §11. API, línea 2102 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-47-b)

<a id="API-WFL-48"></a>
#### API-WFL-48 · `POST /api/admin/wfl/operations/{id}/retry`

- **Qué hace:** Reintentar paso fallido. Reintenta un registro de operaciones de negocio con pasos (`operations`).
- **Para qué sirve:** RF-WFL-028: Bandeja de excepciones de lote: cada ítem fallido con motivo codificado, módulo y rol responsable, acción (corregir, excluir, reintentar) y reproceso solo de excepciones. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.operaciones.reintentar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T11 §11. API, línea 2103 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-48)

<a id="API-WFL-49"></a>
#### API-WFL-49 · `POST /api/admin/wfl/operations/{id}/resolve`

- **Qué hace:** Registrar resultado verificado de incierto. Resuelve un registro de operaciones de negocio con pasos (`operations`).
- **Para qué sirve:** RF-WFL-043: Ejecución idempotente: el handler recibe operationId como clave; reintentar una operación ya completada devuelve el mismo resultado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.operaciones.reintentar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T11 §11. API, línea 2104 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-49)

<a id="API-WFL-50"></a>
#### API-WFL-50 · `POST /api/admin/wfl/operations/{id}/cancel`

- **Qué hace:** Cancelar. Cancela un registro de operaciones de negocio con pasos (`operations`).
- **Para qué sirve:** RF-WFL-020: Catálogo jobDefinitions (§12.6–12.7) con nombre <mod>:<proceso>, módulo dueño, clase de cola de T01 (interactive, integration, events, notifications, batch, export, ai, maintenance), prioridad, concurrencia por tenant… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.operaciones.reintentar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T11 §11. API, línea 2105 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-50)

<a id="API-WFL-51"></a>
#### API-WFL-51 · `POST /api/admin/wfl/documents/uploads`

- **Qué hace:** Pedir URL de subida (delegado a T01) con tipo documental. Registra un nuevo elemento u operación en documentos del expediente (`documents`).
- **Para qué sirve:** RF-WFL-151: Subida en dos pasos con URL prefirmada, verificación de tipo real, tamaño máximo, antivirus (JOB-PLA-21), hash SHA-256 y miniatura; el documento queda available solo con scanStatus = clean. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.expedientes.adjuntar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T11 §11. API, línea 2106 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-51)

<a id="API-WFL-52"></a>
#### API-WFL-52 · `POST /api/admin/wfl/documents`

- **Qué hace:** Confirmar y registrar documento o versión con vínculos y metadatos. Da de alta un registro de documentos del expediente (`documents`).
- **Para qué sirve:** RF-WFL-095: Envío del formulario: snapshot inmutable (formSubmissions) con la versión del formulario, valores, adjuntos y huella; las correcciones generan una nueva presentación vinculada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.expedientes.adjuntar`.
- **Recibe:** los datos de documentos del expediente (`documents`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de documentos del expediente (`documents`).
- **Ola:** O0 · **Fuente:** T11 §11. API, línea 2107 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-52)

<a id="API-WFL-53"></a>
#### API-WFL-53 · `GET /api/admin/wfl/documents/{id}`

- **Qué hace:** Metadatos y versiones. Obtiene el detalle de un registro de documentos del expediente (`documents`).
- **Para qué sirve:** RF-WFL-155: Metadatos tipados por tipo documental (fecha de emisión, vencimiento, emisor, número, importe) con búsqueda; extracción asistida por IA solo como propuesta. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.expedientes.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de documentos del expediente (`documents`).
- **Pantallas:** PAN-WFL-14 (Expediente por sujeto).
- **Ola:** O0 · **Fuente:** T11 §11. API, línea 2108 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-53)

<a id="API-WFL-54"></a>
#### API-WFL-54 · `GET /api/admin/wfl/documents/{id}/versions/{v}/url`

- **Qué hace:** URL firmada de descarga (registra acceso) Consulta «url» de un registro de documentos del expediente (`documents`).
- **Para qué sirve:** RF-WFL-157: Descarga con URL firmada de vida corta tras verificar permiso del objeto dueño; registro de cada acceso (documentAccessLogs) para documentos personal, restricted, health y fiscal. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.documentos.descargar`.
- **Recibe:** en la ruta `id`, `v`.
- **Devuelve:** 200: el registro de documentos del expediente (`documents`).
- **Pantallas:** PAN-WFL-26 ("Mis documentos" por cuenta y tipo).
- **Ola:** O0 · **Fuente:** T11 §11. API, línea 2109 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-54)

<a id="API-WFL-55"></a>
#### API-WFL-55 · `POST /api/admin/wfl/documents/{id}/void`

- **Qué hace:** Anular con motivo. Anula un registro de documentos del expediente (`documents`).
- **Para qué sirve:** RF-WFL-161: Legal hold por sujeto, expediente o documento, con motivo, responsable y fecha; bloquea la purga y la anulación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.documentos.anular`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T11 §11. API, línea 2110 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-55)

<a id="API-WFL-56"></a>
#### API-WFL-56 · `POST /api/admin/wfl/documents/{id}/links`

- **Qué hace:** Vincular a otro sujeto. Agrega un elemento («links») a un registro de documentos del expediente (`documents`).
- **Para qué sirve:** RF-WFL-163: Importación de adjuntos de ProCoop (ADJUNTOS, PROCOOPAR_ADJUNTOS, carpetas) con hash, tipo mapeado y vínculo; los huérfanos se informan. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.expedientes.adjuntar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T11 §11. API, línea 2111 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-56)

<a id="API-WFL-57"></a>
#### API-WFL-57 · `POST /api/admin/wfl/documents/{id}/share-links`

- **Qué hace:** Crear y revocar enlaces. Da de alta un registro de enlaces firmados de acceso (`shareLinks`).
- **Para qué sirve:** RF-WFL-158: Enlaces compartidos con token, vencimiento, límite de descargas, contraseña opcional y revocación inmediata. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.documentos.compartir`.
- **Recibe:** en la ruta `id`; los datos de enlaces firmados de acceso (`shareLinks`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de enlaces firmados de acceso (`shareLinks`).
- **Ola:** O1 · **Fuente:** T11 §11. API, línea 2112 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-57)

<a id="API-WFL-57-b"></a>
#### API-WFL-57-b · `DELETE /api/admin/wfl/documents/{id}/share-links`

- **Qué hace:** Crear y revocar enlaces. Elimina o da de baja un registro de enlaces firmados de acceso (`shareLinks`).
- **Para qué sirve:** RF-WFL-158: Enlaces compartidos con token, vencimiento, límite de descargas, contraseña opcional y revocación inmediata. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.documentos.compartir`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O1 · **Fuente:** T11 §11. API, línea 2112 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-57-b)

<a id="API-WFL-58"></a>
#### API-WFL-58 · `POST /api/admin/wfl/legal-holds`

- **Qué hace:** Aplicar y liberar hold. Registra un nuevo elemento u operación en `legal-holds`.
- **Para qué sirve:** RF-WFL-161: Legal hold por sujeto, expediente o documento, con motivo, responsable y fecha; bloquea la purga y la anulación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.documentos.retener`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T11 §11. API, línea 2113 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-58)

<a id="API-WFL-58-b"></a>
#### API-WFL-58-b · `DELETE /api/admin/wfl/legal-holds`

- **Qué hace:** Aplicar y liberar hold. Elimina o da de baja un registro de `legal-holds`.
- **Para qué sirve:** RF-WFL-161: Legal hold por sujeto, expediente o documento, con motivo, responsable y fecha; bloquea la purga y la anulación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.documentos.retener`.
- **Recibe:** cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O0 · **Fuente:** T11 §11. API, línea 2113 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-58-b)

<a id="API-WFL-59"></a>
#### API-WFL-59 · `GET /api/admin/wfl/document-types`

- **Qué hace:** Tipos y retención. Lista, con filtros y paginación, los registros de clases documentales del expediente (`documentTypes`).
- **Para qué sirve:** RF-WFL-222: Digitalización de la documentación recibida como documentos del expediente con tipo y folios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.flujos.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de clases documentales del expediente (`documentTypes`) con `total`.
- **Pantallas:** PAN-WFL-06 (Lista de definiciones), PAN-WFL-09 (Políticas de aprobación), PAN-WFL-12 (Tipos de operación del tenant) y 1 más.
- **Ola:** O0 · **Fuente:** T11 §11. API, línea 2114 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-59)

<a id="API-WFL-59-b"></a>
#### API-WFL-59-b · `PUT /api/admin/wfl/document-types`

- **Qué hace:** Tipos y retención. Reemplaza o configura clases documentales del expediente (`documentTypes`).
- **Para qué sirve:** RF-WFL-222: Digitalización de la documentación recibida como documentos del expediente con tipo y folios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.flujos.configurar`.
- **Recibe:** los datos de clases documentales del expediente (`documentTypes`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de clases documentales del expediente (`documentTypes`).
- **Pantallas:** PAN-WFL-06 (Lista de definiciones), PAN-WFL-09 (Políticas de aprobación), PAN-WFL-12 (Tipos de operación del tenant) y 1 más.
- **Ola:** O0 · **Fuente:** T11 §11. API, línea 2114 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-59-b)

<a id="API-WFL-59-c"></a>
#### API-WFL-59-c · `GET /api/admin/wfl/retention-policies`

- **Qué hace:** Tipos y retención. Consulta `retention-policies`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.flujos.configurar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-WFL-06 (Lista de definiciones), PAN-WFL-09 (Políticas de aprobación), PAN-WFL-12 (Tipos de operación del tenant) y 1 más.
- **Ola:** O0 · **Fuente:** T11 §11. API, línea 2114 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-59-c)

<a id="API-WFL-59-d"></a>
#### API-WFL-59-d · `PUT /api/admin/wfl/retention-policies`

- **Qué hace:** Tipos y retención. Reemplaza o configura `retention-policies`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.flujos.configurar`.
- **Recibe:** un cuerpo JSON cuya estructura detalla el anexo; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-WFL-06 (Lista de definiciones), PAN-WFL-09 (Políticas de aprobación), PAN-WFL-12 (Tipos de operación del tenant) y 1 más.
- **Ola:** O0 · **Fuente:** T11 §11. API, línea 2114 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-59-d)

<a id="API-WFL-60"></a>
#### API-WFL-60 · `GET /api/admin/wfl/dossiers/{subjectType}/{id}`

- **Qué hace:** Expediente por sujeto (documentos y línea de tiempo) Obtiene el detalle de un registro de expedientes digitales (`dossiers`).
- **Para qué sirve:** RF-WFL-211: Línea de tiempo del expediente que combina documentos, eventos de dominio relevantes (marcados timeline), operaciones, aprobaciones, trámites, comunicaciones (resumen T09) y notas, con filtros. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.expedientes.ver`.
- **Recibe:** en la ruta `subjectType`, `id`.
- **Devuelve:** 200: el registro de expedientes digitales (`dossiers`).
- **Pantallas:** PAN-WFL-14 (Expediente por sujeto).
- **Ola:** O1 · **Fuente:** T11 §11. API, línea 2115 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-60)

<a id="API-WFL-61"></a>
#### API-WFL-61 · `POST /api/admin/wfl/dossiers/{subjectType}/{id}/export`

- **Qué hace:** Exportar (job) Exporta un registro de expedientes digitales (`dossiers`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-WFL-213: Exportación de expediente (ZIP con PDF índice y documentos, o PDF unificado) como job con permiso wfl.expedientes.exportar, auditoría y vencimiento del archivo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.expedientes.exportar`.
- **Recibe:** en la ruta `subjectType`, `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Ola:** O1 · **Fuente:** T11 §11. API, línea 2116 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-61)

<a id="API-WFL-62"></a>
#### API-WFL-62 · `GET /api/admin/wfl/formal-dossiers`

- **Qué hace:** Expedientes formales (abrir, cerrar, foliar, archivar) Consulta `formal-dossiers`.
- **Para qué sirve:** RF-WFL-212: Expediente formal numerado (dossiers) con carátula, tipo, estado (abierto, en trámite, cerrado, archivado), responsable, foliatura opcional e índice. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.expedientes.gestionar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-WFL-15 (Expedientes formales).
- **Ola:** O10 · **Fuente:** T11 §11. API, línea 2117 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-62)

<a id="API-WFL-62-b"></a>
#### API-WFL-62-b · `POST /api/admin/wfl/formal-dossiers`

- **Qué hace:** Expedientes formales (abrir, cerrar, foliar, archivar) Registra un nuevo elemento u operación en `formal-dossiers`.
- **Para qué sirve:** RF-WFL-212: Expediente formal numerado (dossiers) con carátula, tipo, estado (abierto, en trámite, cerrado, archivado), responsable, foliatura opcional e índice. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.expedientes.gestionar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-WFL-15 (Expedientes formales).
- **Ola:** O10 · **Fuente:** T11 §11. API, línea 2117 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-62-b)

<a id="API-WFL-62-c"></a>
#### API-WFL-62-c · `PATCH /api/admin/wfl/formal-dossiers`

- **Qué hace:** Expedientes formales (abrir, cerrar, foliar, archivar) Modifica algunos campos de un registro de `formal-dossiers` (solo los enviados).
- **Para qué sirve:** RF-WFL-212: Expediente formal numerado (dossiers) con carátula, tipo, estado (abierto, en trámite, cerrado, archivado), responsable, foliatura opcional e índice. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.expedientes.gestionar`.
- **Recibe:** solo los campos a cambiar; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-WFL-15 (Expedientes formales).
- **Ola:** O10 · **Fuente:** T11 §11. API, línea 2117 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-62-c)

<a id="API-WFL-63"></a>
#### API-WFL-63 · `GET /api/wfl/documents`

- **Qué hace:** Mis documentos y descarga. Lista, con filtros y paginación, los registros de documentos del expediente (`documents`).
- **Para qué sirve:** RF-WFL-187: Políticas de huecos: gapless (comprobantes, recibos, actas, expedientes formales), allowGaps (tareas, operaciones, constancias internas) y external (número asignado por un tercero, por ejemplo CAEA). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `por.comprobantes.descargar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de documentos del expediente (`documents`) con `total`.
- **Pantallas:** PAN-WFL-26 ("Mis documentos" por cuenta y tipo).
- **Ola:** O0 · **Fuente:** T11 §11. API, línea 2118 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-63)

<a id="API-WFL-63-b"></a>
#### API-WFL-63-b · `GET /api/wfl/documents/{id}/url`

- **Qué hace:** Mis documentos y descarga. Consulta «url» de un registro de documentos del expediente (`documents`).
- **Para qué sirve:** RF-WFL-187: Políticas de huecos: gapless (comprobantes, recibos, actas, expedientes formales), allowGaps (tareas, operaciones, constancias internas) y external (número asignado por un tercero, por ejemplo CAEA). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `por.comprobantes.descargar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de documentos del expediente (`documents`).
- **Pantallas:** PAN-WFL-26 ("Mis documentos" por cuenta y tipo).
- **Ola:** O0 · **Fuente:** T11 §11. API, línea 2118 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-63-b)

<a id="API-WFL-64"></a>
#### API-WFL-64 · `GET /api/public/{tenantSlug}/wfl/share/{token}`

- **Qué hace:** Descarga por enlace compartido. Obtiene el detalle de un registro de `share`.
- **Para qué sirve:** RF-WFL-158: Enlaces compartidos con token, vencimiento, límite de descargas, contraseña opcional y revocación inmediata. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`, `token`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T11 §11. API, línea 2119 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-64)

<a id="API-WFL-65"></a>
#### API-WFL-65 · `GET /api/public/{tenantSlug}/wfl/verify/{code}`

- **Qué hace:** Verificación de documento. Obtiene el detalle de un registro de `verify`.
- **Para qué sirve:** RF-WFL-201: Verificación pública de documentos firmados o emitidos por código o QR (/api/public/<slug>/verify/:code) que muestra tipo, fecha, emisor y hash, sin datos personales. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`, `code`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T11 §11. API, línea 2120 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-65)

<a id="API-WFL-66"></a>
#### API-WFL-66 · `GET /api/admin/wfl/templates`

- **Qué hace:** Plantillas y versiones. Lista, con filtros y paginación, los registros de plantillas de documentos (`documentTemplates`).
- **Para qué sirve:** RF-WFL-170: Plantillas versionadas (documentTemplates, templateVersions) por tipo documental con HTML restringido, CSS de impresión, encabezado y pie, marca del tenant (T03) y variables. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.plantillas.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de plantillas de documentos (`documentTemplates`) con `total`.
- **Pantallas:** PAN-WFL-17 (Plantillas).
- **Ola:** O0 · **Fuente:** T11 §11. API, línea 2121 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-66)

<a id="API-WFL-66-b"></a>
#### API-WFL-66-b · `GET /api/admin/wfl/templates/{id}`

- **Qué hace:** Plantillas y versiones. Obtiene el detalle de un registro de plantillas de documentos (`documentTemplates`).
- **Para qué sirve:** RF-WFL-170: Plantillas versionadas (documentTemplates, templateVersions) por tipo documental con HTML restringido, CSS de impresión, encabezado y pie, marca del tenant (T03) y variables. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.plantillas.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de plantillas de documentos (`documentTemplates`).
- **Pantallas:** PAN-WFL-17 (Plantillas).
- **Ola:** O0 · **Fuente:** T11 §11. API, línea 2121 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-66-b)

<a id="API-WFL-67"></a>
#### API-WFL-67 · `PUT /api/admin/wfl/templates/{id}/draft`

- **Qué hace:** Guardar borrador. Reemplaza o configura plantillas de documentos (`documentTemplates`).
- **Para qué sirve:** RF-WFL-176: Inmutabilidad del emitido: el PDF de un documento emitido se genera una vez, se guarda con hash y se sirve siempre el mismo; regenerar crea una "reimpresión" marcada, nunca reemplaza. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.plantillas.editar`.
- **Recibe:** en la ruta `id`; los datos de plantillas de documentos (`documentTemplates`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de plantillas de documentos (`documentTemplates`).
- **Ola:** O0 · **Fuente:** T11 §11. API, línea 2122 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-67)

<a id="API-WFL-68"></a>
#### API-WFL-68 · `POST /api/admin/wfl/templates/{id}/preview`

- **Qué hace:** Vista previa con datos de ejemplo o reales. Previsualiza sin efectos un registro de plantillas de documentos (`documentTemplates`).
- **Para qué sirve:** RF-WFL-173: Editor con vista previa con datos de ejemplo y datos reales (con permiso), comparación entre versiones y prueba de impresión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.plantillas.ver`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-WFL-17 (Plantillas).
- **Ola:** O0 · **Fuente:** T11 §11. API, línea 2123 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-68)

<a id="API-WFL-69"></a>
#### API-WFL-69 · `POST /api/admin/wfl/templates/{id}/publish`

- **Qué hace:** Publicar (aprobación si requiresApproval) Publica un registro de plantillas de documentos (`documentTemplates`).
- **Para qué sirve:** RF-WFL-174: Publicación con aprobación para plantillas de documentos fiscales y legales (factura, NC, ND, recibo, intimación, contrato, acta). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.plantillas.publicar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T11 §11. API, línea 2124 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-69)

<a id="API-WFL-70"></a>
#### API-WFL-70 · `GET /api/admin/wfl/data-contracts/{code}`

- **Qué hace:** Catálogo de variables. Obtiene el detalle de un registro de contratos de datos de plantillas (`templateDataContracts`).
- **Para qué sirve:** RF-WFL-172: Contrato de datos tipado provisto por el módulo dueño (Zod) y catálogo de variables generado del contrato, con descripción y ejemplo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.plantillas.ver`.
- **Recibe:** en la ruta `code`.
- **Devuelve:** 200: el registro de contratos de datos de plantillas (`templateDataContracts`).
- **Pantallas:** PAN-WFL-17 (Plantillas).
- **Ola:** O0 · **Fuente:** T11 §11. API, línea 2125 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-70)

<a id="API-WFL-71"></a>
#### API-WFL-71 · `GET /api/admin/wfl/numbering/sequences`

- **Qué hace:** Secuencias. Lista, con filtros y paginación, los registros de numeración no fiscal (`numberingSequences`).
- **Para qué sirve:** RF-WFL-189: Numeración fiscal: M05 usa secuencias por punto de venta y tipo de comprobante con política gapless y sincronización con el último autorizado de ARCA (M06); T11 no decide correlatividad fiscal. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.numeracion.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de numeración no fiscal (`numberingSequences`) con `total`.
- **Pantallas:** PAN-WFL-18 (Secuencias).
- **Ola:** O0 · **Fuente:** T11 §11. API, línea 2126 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-71)

<a id="API-WFL-71-b"></a>
#### API-WFL-71-b · `POST /api/admin/wfl/numbering/sequences`

- **Qué hace:** Secuencias. Da de alta un registro de numeración no fiscal (`numberingSequences`).
- **Para qué sirve:** RF-WFL-189: Numeración fiscal: M05 usa secuencias por punto de venta y tipo de comprobante con política gapless y sincronización con el último autorizado de ARCA (M06); T11 no decide correlatividad fiscal. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.numeracion.configurar`.
- **Recibe:** los datos de numeración no fiscal (`numberingSequences`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de numeración no fiscal (`numberingSequences`).
- **Pantallas:** PAN-WFL-18 (Secuencias).
- **Ola:** O0 · **Fuente:** T11 §11. API, línea 2126 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-71-b)

<a id="API-WFL-72"></a>
#### API-WFL-72 · `GET /api/admin/wfl/numbering/sequences/{id}/assignments`

- **Qué hace:** Libro de asignaciones. Lista, con filtros y paginación, los registros de números asignados (`numberingAssignments`).
- **Para qué sirve:** RF-WFL-188: Anulación trazable: un número asignado a un documento anulado queda voided con motivo; nunca se reutiliza. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.numeracion.configurar`.
- **Recibe:** en la ruta `id`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de números asignados (`numberingAssignments`) con `total`.
- **Pantallas:** PAN-WFL-18 (Secuencias).
- **Ola:** O0 · **Fuente:** T11 §11. API, línea 2127 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-72)

<a id="API-WFL-73"></a>
#### API-WFL-73 · `POST /api/admin/wfl/numbering/sequences/{id}/adjust`

- **Qué hace:** Solicitar ajuste (operación wfl.sequence.adjust) Ajusta un registro de numeración no fiscal (`numberingSequences`).
- **Para qué sirve:** RF-WFL-190: Ajuste manual de secuencia solo con operación aprobada (wfl.sequence.adjust) y motivo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.numeracion.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-WFL-18 (Secuencias).
- **Ola:** O0 · **Fuente:** T11 §11. API, línea 2128 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-73)

<a id="API-WFL-74"></a>
#### API-WFL-74 · `GET /api/admin/wfl/signature-profiles`

- **Qué hace:** Perfiles de firma. Lista, con filtros y paginación, los registros de perfiles de firma (`signatureProfiles`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.firmas.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de perfiles de firma (`signatureProfiles`) con `total`.
- **Pantallas:** PAN-WFL-19 (Perfiles de firma y firmantes habilitados).
- **Ola:** O3 · **Fuente:** T11 §11. API, línea 2129 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-74)

<a id="API-WFL-74-b"></a>
#### API-WFL-74-b · `PUT /api/admin/wfl/signature-profiles`

- **Qué hace:** Perfiles de firma. Reemplaza o configura perfiles de firma (`signatureProfiles`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.firmas.configurar`.
- **Recibe:** los datos de perfiles de firma (`signatureProfiles`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de perfiles de firma (`signatureProfiles`).
- **Pantallas:** PAN-WFL-19 (Perfiles de firma y firmantes habilitados).
- **Ola:** O3 · **Fuente:** T11 §11. API, línea 2129 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-74-b)

<a id="API-WFL-75"></a>
#### API-WFL-75 · `POST /api/admin/wfl/signatures`

- **Qué hace:** Solicitar firma. Registra un nuevo elemento u operación en `signatures`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.firmas.solicitar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T11 §11. API, línea 2130 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-75)

<a id="API-WFL-76"></a>
#### API-WFL-76 · `GET /api/admin/wfl/signatures/{id}`

- **Qué hace:** Estado y evidencias. Obtiene el detalle de un registro de `signatures`.
- **Para qué sirve:** RF-WFL-016: Sin event sourcing: el estado vigente se guarda en las colecciones del módulo; los eventos son notificación y evidencia, no la fuente de verdad. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.expedientes.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-WFL-14 (Expediente por sujeto).
- **Ola:** O0 · **Fuente:** T11 §11. API, línea 2131 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-76)

<a id="API-WFL-77"></a>
#### API-WFL-77 · `POST /api/wfl/signatures/{id}/otp`

- **Qué hace:** Enviar OTP. Registra «otp» sobre un registro de `otp`.
- **Para qué sirve:** RF-WFL-130: Bandeja única (workItems) que proyecta: tareas de T11, pasos de aprobación, autorizaciones puntuales de T02, casos de M09 asignados, OT y visitas de M10 asignadas, excepciones de lote, operaciones detenidas, conflictos de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `wfl.documentos.firmar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-WFL-27 (Lectura del documento, texto legal, OTP y firma).
- **Ola:** O1 · **Fuente:** T11 §11. API, línea 2132 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-77)

<a id="API-WFL-78"></a>
#### API-WFL-78 · `POST /api/wfl/signatures/{id}/sign`

- **Qué hace:** Firmar (electrónica o manuscrita) Firma un registro de `sign`.
- **Para qué sirve:** RF-WFL-195: Tres niveles de firma en signatureProfiles: manuscrita digitalizada (conformidad), electrónica (art. 5 Ley 25.506) y digital (art. 2, certificador licenciado). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `wfl.documentos.firmar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-WFL-27 (Lectura del documento, texto legal, OTP y firma).
- **Ola:** O3 · **Fuente:** T11 §11. API, línea 2133 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-78)

<a id="API-WFL-79"></a>
#### API-WFL-79 · `POST /api/wfl/signatures/{id}/reject`

- **Qué hace:** Rechazar con motivo. Rechaza un registro de `reject`.
- **Para qué sirve:** RF-WFL-202: Rechazo de firma con motivo y nueva versión del documento si corresponde. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `wfl.documentos.firmar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-WFL-27 (Lectura del documento, texto legal, OTP y firma).
- **Ola:** O1 · **Fuente:** T11 §11. API, línea 2134 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-79)

<a id="API-WFL-80"></a>
#### API-WFL-80 · `GET /api/admin/wfl/jobs/definitions`

- **Qué hace:** Catálogo de jobs. Lista, con filtros y paginación, los registros de catálogo de jobs (`jobDefinitions`).
- **Para qué sirve:** RF-WFL-024: Fan-out por tenant: los jobs programados se materializan por tenant activo con el módulo habilitado; un tenant suspendido no recibe ejecuciones (pla.tenant.suspended). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.jobs.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de catálogo de jobs (`jobDefinitions`) con `total`.
- **Pantallas:** PAN-WFL-21 (Jobs del tenant).
- **Ola:** O0 · **Fuente:** T11 §11. API, línea 2135 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-80)

<a id="API-WFL-81"></a>
#### API-WFL-81 · `GET /api/admin/wfl/jobs/schedules`

- **Qué hace:** Programaciones y reprogramación. Lista, con filtros y paginación, los registros de programación por tenant (`jobSchedules`).
- **Para qué sirve:** RF-WFL-023: El administrador del tenant puede reprogramar los jobs marcados tenantSchedulable dentro de la ventana permitida por plataforma; no puede programar fuera de ella ni cambiar la clase de cola. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.jobs.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de programación por tenant (`jobSchedules`) con `total`.
- **Pantallas:** PAN-WFL-21 (Jobs del tenant).
- **Ola:** O0 · **Fuente:** T11 §11. API, línea 2136 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-81)

<a id="API-WFL-81-b"></a>
#### API-WFL-81-b · `PATCH /api/admin/wfl/jobs/schedules`

- **Qué hace:** Programaciones y reprogramación. Modifica algunos campos de un registro de programación por tenant (`jobSchedules`) (solo los enviados).
- **Para qué sirve:** RF-WFL-023: El administrador del tenant puede reprogramar los jobs marcados tenantSchedulable dentro de la ventana permitida por plataforma; no puede programar fuera de ella ni cambiar la clase de cola. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.jobs.programar`.
- **Recibe:** solo los campos a cambiar de programación por tenant (`jobSchedules`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de programación por tenant (`jobSchedules`).
- **Ola:** O0 · **Fuente:** T11 §11. API, línea 2136 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-81-b)

<a id="API-WFL-81-c"></a>
#### API-WFL-81-c · `GET /api/admin/wfl/jobs/schedules/{id}`

- **Qué hace:** Programaciones y reprogramación. Obtiene el detalle de un registro de programación por tenant (`jobSchedules`).
- **Para qué sirve:** RF-WFL-023: El administrador del tenant puede reprogramar los jobs marcados tenantSchedulable dentro de la ventana permitida por plataforma; no puede programar fuera de ella ni cambiar la clase de cola. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.jobs.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de programación por tenant (`jobSchedules`).
- **Pantallas:** PAN-WFL-21 (Jobs del tenant).
- **Ola:** O0 · **Fuente:** T11 §11. API, línea 2136 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-81-c)

<a id="API-WFL-81-d"></a>
#### API-WFL-81-d · `PATCH /api/admin/wfl/jobs/schedules/{id}`

- **Qué hace:** Programaciones y reprogramación. Modifica algunos campos de un registro de programación por tenant (`jobSchedules`) (solo los enviados).
- **Para qué sirve:** RF-WFL-023: El administrador del tenant puede reprogramar los jobs marcados tenantSchedulable dentro de la ventana permitida por plataforma; no puede programar fuera de ella ni cambiar la clase de cola. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.jobs.programar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de programación por tenant (`jobSchedules`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de programación por tenant (`jobSchedules`).
- **Ola:** O0 · **Fuente:** T11 §11. API, línea 2136 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-81-d)

<a id="API-WFL-82"></a>
#### API-WFL-82 · `GET /api/admin/wfl/bulk-runs`

- **Qué hace:** Corridas y progreso. Lista, con filtros y paginación, los registros de corridas masivas (`bulkRuns`).
- **Para qué sirve:** RF-WFL-026: Corridas masivas (bulkRuns) con universo congelado, total, procesados, exitosos, excepciones, progreso porcentual, tiempo estimado, pausa, reanudación desde cursor y cancelación cooperativa. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.jobs.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de corridas masivas (`bulkRuns`) con `total`.
- **Pantallas:** PAN-WFL-21 (Jobs del tenant).
- **Ola:** O0 · **Fuente:** T11 §11. API, línea 2137 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-82)

<a id="API-WFL-82-b"></a>
#### API-WFL-82-b · `GET /api/admin/wfl/bulk-runs/{id}`

- **Qué hace:** Corridas y progreso. Obtiene el detalle de un registro de corridas masivas (`bulkRuns`).
- **Para qué sirve:** RF-WFL-026: Corridas masivas (bulkRuns) con universo congelado, total, procesados, exitosos, excepciones, progreso porcentual, tiempo estimado, pausa, reanudación desde cursor y cancelación cooperativa. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.jobs.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de corridas masivas (`bulkRuns`).
- **Pantallas:** PAN-WFL-21 (Jobs del tenant).
- **Ola:** O0 · **Fuente:** T11 §11. API, línea 2137 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-82-b)

<a id="API-WFL-83"></a>
#### API-WFL-83 · `POST /api/admin/wfl/bulk-runs/{id}/pause`

- **Qué hace:** Control de corrida. Pausa un registro de corridas masivas (`bulkRuns`).
- **Para qué sirve:** RF-WFL-031: Los jobs con efecto externo (pagos, ARCA, aprovisionamiento) nunca reintentan a ciegas un envío de resultado desconocido: pasan a uncertain y se concilian antes de reenviar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.jobs.reintentar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T11 §11. API, línea 2138 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-83)

<a id="API-WFL-83-b"></a>
#### API-WFL-83-b · `POST /api/admin/wfl/bulk-runs/{id}/resume`

- **Qué hace:** Control de corrida. Reanuda un registro de corridas masivas (`bulkRuns`).
- **Para qué sirve:** RF-WFL-031: Los jobs con efecto externo (pagos, ARCA, aprovisionamiento) nunca reintentan a ciegas un envío de resultado desconocido: pasan a uncertain y se concilian antes de reenviar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.jobs.reintentar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T11 §11. API, línea 2138 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-83-b)

<a id="API-WFL-83-c"></a>
#### API-WFL-83-c · `POST /api/admin/wfl/bulk-runs/{id}/cancel`

- **Qué hace:** Control de corrida. Cancela un registro de corridas masivas (`bulkRuns`).
- **Para qué sirve:** RF-WFL-031: Los jobs con efecto externo (pagos, ARCA, aprovisionamiento) nunca reintentan a ciegas un envío de resultado desconocido: pasan a uncertain y se concilian antes de reenviar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.jobs.reintentar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T11 §11. API, línea 2138 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-83-c)

<a id="API-WFL-84"></a>
#### API-WFL-84 · `POST /api/admin/wfl/bulk-runs/{id}/reprocess`

- **Qué hace:** Reprocesar excepciones resueltas. Reprocesa un registro de corridas masivas (`bulkRuns`).
- **Para qué sirve:** RF-WFL-028: Bandeja de excepciones de lote: cada ítem fallido con motivo codificado, módulo y rol responsable, acción (corregir, excluir, reintentar) y reproceso solo de excepciones. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.jobs.reintentar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T11 §11. API, línea 2139 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-84)

<a id="API-WFL-85"></a>
#### API-WFL-85 · `GET /api/admin/wfl/bulk-runs/{id}/items`

- **Qué hace:** Excepciones por motivo. Consulta «items» de un registro de corridas masivas (`bulkRuns`).
- **Para qué sirve:** RF-WFL-026: Corridas masivas (bulkRuns) con universo congelado, total, procesados, exitosos, excepciones, progreso porcentual, tiempo estimado, pausa, reanudación desde cursor y cancelación cooperativa. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.jobs.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de corridas masivas (`bulkRuns`).
- **Pantallas:** PAN-WFL-21 (Jobs del tenant).
- **Ola:** O0 · **Fuente:** T11 §11. API, línea 2140 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-85)

<a id="API-WFL-86"></a>
#### API-WFL-86 · `GET /api/admin/wfl/event-types`

- **Qué hace:** Catálogo de eventos. Lista, con filtros y paginación, los registros de catálogo de eventos de dominio (`eventTypes`).
- **Para qué sirve:** RF-WFL-014: Eventos public: un subconjunto curado del catálogo se expone a terceros por T10 (webhooks y /api/v1/ext), con esquema estable y sin datos personales. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.eventos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de catálogo de eventos de dominio (`eventTypes`) con `total`.
- **Pantallas:** PAN-WFL-20 (Catálogo de eventos del tenant), PAN-WFL-22 (Bandeja operativa de eventos).
- **Ola:** O0 · **Fuente:** T11 §11. API, línea 2141 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-86)

<a id="API-WFL-87"></a>
#### API-WFL-87 · `GET /api/admin/wfl/events/by-aggregate`

- **Qué hace:** Cadena de eventos de un agregado (metadatos) Consulta bitácora de la instancia (`workflowInstanceEvents`).
- **Para qué sirve:** RF-WFL-013: Trazabilidad punta a punta: correlationId heredado de la request o job origen y causationId = eventId causante; la vista de un agregado muestra la cadena de eventos y efectos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.eventos.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: el registro de bitácora de la instancia (`workflowInstanceEvents`).
- **Pantallas:** PAN-WFL-20 (Catálogo de eventos del tenant), PAN-WFL-22 (Bandeja operativa de eventos).
- **Ola:** O2 · **Fuente:** T11 §11. API, línea 2142 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-87)

<a id="API-WFL-88"></a>
#### API-WFL-88 · `GET /api/admin/wfl/operational-inbox`

- **Qué hace:** Bandeja operativa. Lista, con filtros y paginación, los registros de `operational-inbox`.
- **Para qué sirve:** RF-WFL-011: Reproceso funcional: desde la bandeja operativa, un usuario con wfl.eventos.reprocesar reencola el evento al mismo consumidor con la misma clave; el descarte exige motivo y queda auditado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.eventos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ResultadoGenerico (`ResultadoGenerico`) con `total`.
- **Pantallas:** PAN-WFL-20 (Catálogo de eventos del tenant), PAN-WFL-22 (Bandeja operativa de eventos).
- **Ola:** O0 · **Fuente:** T11 §11. API, línea 2143 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-88)

<a id="API-WFL-89"></a>
#### API-WFL-89 · `POST /api/admin/wfl/operational-inbox/{id}/reprocess`

- **Qué hace:** Acciones de la bandeja operativa. Reprocesa un registro de `reprocess`.
- **Para qué sirve:** RF-WFL-011: Reproceso funcional: desde la bandeja operativa, un usuario con wfl.eventos.reprocesar reencola el evento al mismo consumidor con la misma clave; el descarte exige motivo y queda auditado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.eventos.reprocesar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T11 §11. API, línea 2144 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-89)

<a id="API-WFL-89-b"></a>
#### API-WFL-89-b · `POST /api/admin/wfl/operational-inbox/{id}/resolve`

- **Qué hace:** Acciones de la bandeja operativa. Resuelve un registro de `resolve`.
- **Para qué sirve:** RF-WFL-011: Reproceso funcional: desde la bandeja operativa, un usuario con wfl.eventos.reprocesar reencola el evento al mismo consumidor con la misma clave; el descarte exige motivo y queda auditado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.eventos.reprocesar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T11 §11. API, línea 2144 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-89-b)

<a id="API-WFL-89-c"></a>
#### API-WFL-89-c · `POST /api/admin/wfl/operational-inbox/{id}/discard`

- **Qué hace:** Acciones de la bandeja operativa. Descarta un registro de `discard`.
- **Para qué sirve:** RF-WFL-011: Reproceso funcional: desde la bandeja operativa, un usuario con wfl.eventos.reprocesar reencola el evento al mismo consumidor con la misma clave; el descarte exige motivo y queda auditado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `wfl.eventos.reprocesar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T11 §11. API, línea 2144 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-89-c)

<a id="API-WFL-90"></a>
#### API-WFL-90 · `POST /api/platform/wfl/replay`

- **Qué hace:** *Replay* de eventos para un consumidor y tenant. Reproduce sobre `replay`.
- **Para qué sirve:** RF-WFL-012: Reproducción (*replay*) de eventos de un rango para un consumidor y un tenant, en job de clase export, para reconstruir proyecciones (bandeja, BI, saldos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `wfl.eventos.reprocesar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O11 · **Fuente:** T11 §11. API, línea 2145 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-90)

<a id="API-WFL-91"></a>
#### API-WFL-91 · `GET /api/platform/wfl/catalog/health`

- **Qué hace:** Tipos sin consumidores, consumidores sin productor, alias en uso. Consulta acciones invocables desde workflows (`actionCatalog`).
- **Para qué sirve:** RF-WFL-015: Conciliación de nombres: el catálogo registra los alias que hoy usan algunos consumidores (§12.4) y el chequeo de CI los rechaza a partir de la ola en la que el consumidor se implementa. · RF-WFL-004: Catálogo único de eventos eventTypes generado desde packages/shared/events (esquema Zod por tipo y versión), con productor, consumidores registrados, sensibilidad, visibilidad (internal, public) y estado (active, deprecated). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `wfl.eventos.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: el registro de acciones invocables desde workflows (`actionCatalog`).
- **Pantallas:** PAN-WFL-20 (Catálogo de eventos del tenant), PAN-WFL-22 (Bandeja operativa de eventos).
- **Ola:** O2 · **Fuente:** T11 §11. API, línea 2146 · [Ver en Swagger](../18-swagger/index.html?api=t11-wfl#/API/API-WFL-91)
