# Catálogo de endpoints · T01 · Plataforma SaaS: arquitectura de referencia, stack, multitenancy, tenants, licencias, soporte, ambientes y backups

Parte del [catálogo de endpoints](../18-catalogo-endpoints.md) (artefacto 7.1). Generado el 05-11-2026 con `_trabajo/gen_18_catalogo_endpoints.py` a partir de `18-openapi/`; no se edita a mano.

## Para qué sirve esta API

Definir, de forma desarrollable sin consultar otra fuente, la plataforma SaaS multitenant sobre la que corre GoodApps Cooperativas:

1. La arquitectura de referencia y el stack (DEC-001 a DEC-004): monorepo derivado de Connectia, adaptado como monolito modular Node.js 20 + Express + MongoDB 7 + Mongoose 8 + Vue 3.5, con módulos de dominio de fronteras estrictas, packages compartidos, outbox de eventos, workers BullMQ/Redis, almacenamiento de objetos privado, contenedores Docker y entornos.
2. El multitenancy en base única con tenantId obligatorio y su aislamiento extremo a extremo: consultas, índices, jobs, archivos, caché, exportaciones, búsquedas, IA y logs; y el tenant especial PLATFORM.
3. El ciclo de vida de la cooperativa como tenant (Preparación, Prueba, Listo para habilitar, Operativo, Suspendido administrativo, Cierre/salida — AGR-004), con checklists de habilitación por capacidad, y el alta asistida con IA que propone logo, colores y textos (patrón Connectia).
4. El licenciamiento en tres capas (licencia de módulos de plataforma, activación, pantallas), el catálogo de módulos vendibles (moduleCatalog) y el contrato comercial SaaS con cupos y medición de uso (AGR-005, BASE §97.11).
5. Los dashboards y alertas de plataforma (BASE §54, lado plataforma), el soporte con acceso temporal auditado (AGR-034), los ambientes y la prueba de configuración por tenant (BASE §97.9, AGR-035), los backups y la restauración por tenant (AGR-019), la capacidad y el aislamiento de carga (AGR-020), la operación (monitoreo, logs, salud de jobs) y las actualizaciones sin intervención del usuario, que…
6. El posicionamiento competitivo SaaS (BASE §64, §99) y la materialización del mapa de soluciones (BASE §105) en módulos del monolito.

Detalle completo en el anexo T01, sección 1. Contrato navegable: [Swagger](../18-swagger/index.html?api=t01-pla).

| Dato | Valor |
|---|---|
| Endpoints | 106 |
| Por método | GET 44, PATCH 8, POST 52, PUT 2 |
| Grupos funcionales | 1 |
| Con requisito citado en el anexo | 0 |
| Con requisito inferido (a confirmar) | 102 |
| Sin requisito identificable | 4 |

## Grupos funcionales

| Grupo | Endpoints | Qué agrupa (primeros endpoints) |
|---|---|---|
| [API](#grupo-1) | 106 | Lista paginada con filtros.; Alta directa (sin asistente); Ficha.… |

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

106 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-PLA-01](#API-PLA-01) | GET | `/api/platform/tenants` | Lista paginada con filtros. |
| [API-PLA-02](#API-PLA-02) | POST | `/api/platform/tenants` | Alta directa (sin asistente) |
| [API-PLA-03](#API-PLA-03) | GET | `/api/platform/tenants/{id}` | Ficha. |
| [API-PLA-04](#API-PLA-04) | PATCH | `/api/platform/tenants/{id}` | Editar identidad, contactos, zona, anillo (con version) |
| [API-PLA-05](#API-PLA-05) | POST | `/api/platform/tenants/{id}/transitions` | Transición de estado {to, reason, suspension?, closing?}. |
| [API-PLA-06](#API-PLA-06) | GET | `/api/platform/tenants/{id}/checklists` | Checklists del tenant. |
| [API-PLA-07](#API-PLA-07) | POST | `/api/platform/tenants/{id}/checklists/{capability}/evaluate` | Reevaluar ahora. |
| [API-PLA-08](#API-PLA-08) | POST | `/api/platform/tenants/{id}/checklists/{capability}/items/{code}` | Verificar/dispensar ítem manual con evidencia. |
| [API-PLA-09](#API-PLA-09) | GET | `/api/platform/tenants/{id}/modules` | Licencias + activaciones + efectivos. |
| [API-PLA-10](#API-PLA-10) | PUT | `/api/platform/tenants/{id}/licenses/{moduleCode}` | Alta/edición de licencia. |
| [API-PLA-11](#API-PLA-11) | POST | `/api/platform/tenants/{id}/modules/{moduleCode}/activate` | Cambio de modo {mode, newSalesBlocked?, reason}. |
| [API-PLA-12](#API-PLA-12) | POST | `/api/platform/onboarding/drafts` | Crear borrador. |
| [API-PLA-13](#API-PLA-13) | PATCH | `/api/platform/onboarding/drafts/{id}` | Guardar paso. |
| [API-PLA-14](#API-PLA-14) | POST | `/api/platform/onboarding/drafts/{id}/ai-proposal` | Encola propuesta IA; devuelve jobRunId. |
| [API-PLA-15](#API-PLA-15) | POST | `/api/platform/onboarding/drafts/{id}/confirm` | Confirma alta. |
| [API-PLA-16](#API-PLA-16) | GET | `/api/platform/module-catalog` | Catálogo de módulos. |
| [API-PLA-16-b](#API-PLA-16-b) | POST | `/api/platform/module-catalog` | Catálogo de módulos. |
| [API-PLA-16-c](#API-PLA-16-c) | GET | `/api/platform/module-catalog/{code}` | Catálogo de módulos. |
| [API-PLA-16-d](#API-PLA-16-d) | PATCH | `/api/platform/module-catalog/{code}` | Catálogo de módulos. |
| [API-PLA-17](#API-PLA-17) | GET | `/api/platform/plans` | Planes. |
| [API-PLA-17-b](#API-PLA-17-b) | POST | `/api/platform/plans` | Planes. |
| [API-PLA-17-c](#API-PLA-17-c) | GET | `/api/platform/plans/{code}` | Planes. |
| [API-PLA-17-d](#API-PLA-17-d) | PATCH | `/api/platform/plans/{code}` | Planes. |
| [API-PLA-18](#API-PLA-18) | GET | `/api/platform/saas-contracts` | Lista / alta. |
| [API-PLA-18-b](#API-PLA-18-b) | POST | `/api/platform/saas-contracts` | Lista / alta. |
| [API-PLA-19](#API-PLA-19) | PATCH | `/api/platform/saas-contracts/{id}` | Edición de borrador o nueva versión. |
| [API-PLA-20](#API-PLA-20) | POST | `/api/platform/saas-contracts/{id}/transitions` | Enviar, aprobar, rechazar, terminar. |
| [API-PLA-21](#API-PLA-21) | GET | `/api/platform/usage` | Uso por tenant y dimensión. |
| [API-PLA-22](#API-PLA-22) | GET | `/api/platform/saas-contracts/{id}/pre-invoice` | Prefactura exportable. |
| [API-PLA-23](#API-PLA-23) | GET | `/api/platform/support/cases` | Bandeja global. |
| [API-PLA-24](#API-PLA-24) | PATCH | `/api/platform/support/cases/{id}` | Asignar, prioridad, estado, incidente. |
| [API-PLA-25](#API-PLA-25) | POST | `/api/platform/support/cases/{id}/messages` | Mensaje público/interno. |
| [API-PLA-26](#API-PLA-26) | POST | `/api/platform/support/grants` | Solicitar acceso temporal. |
| [API-PLA-27](#API-PLA-27) | POST | `/api/platform/support/grants/{id}/decision` | Aprobación de plataforma (observe sin PII, break-glass) |
| [API-PLA-28](#API-PLA-28) | POST | `/api/platform/support/grants/{id}/sessions` | Inicia sesión de soporte y emite token. |
| [API-PLA-29](#API-PLA-29) | POST | `/api/platform/support/grants/{id}/revoke` | Revoca. |
| [API-PLA-30](#API-PLA-30) | GET | `/api/platform/incidents` | Incidentes. |
| [API-PLA-30-b](#API-PLA-30-b) | POST | `/api/platform/incidents` | Incidentes. |
| [API-PLA-30-c](#API-PLA-30-c) | GET | `/api/platform/incidents/{id}` | Incidentes. |
| [API-PLA-30-d](#API-PLA-30-d) | PATCH | `/api/platform/incidents/{id}` | Incidentes. |
| [API-PLA-31](#API-PLA-31) | GET | `/api/platform/dashboard/summary` | KPIs §15.1. |
| [API-PLA-32](#API-PLA-32) | GET | `/api/platform/alerts` | Alertas. |
| [API-PLA-33](#API-PLA-33) | POST | `/api/platform/alerts/{id}/ack` | Ciclo de alerta. |
| [API-PLA-33-b](#API-PLA-33-b) | POST | `/api/platform/alerts/{id}/resolve` | Ciclo de alerta. |
| [API-PLA-33-c](#API-PLA-33-c) | POST | `/api/platform/alerts/{id}/silence` | Ciclo de alerta. |
| [API-PLA-34](#API-PLA-34) | GET | `/api/platform/alert-rules` | Reglas de plataforma. |
| [API-PLA-34-b](#API-PLA-34-b) | POST | `/api/platform/alert-rules` | Reglas de plataforma. |
| [API-PLA-34-c](#API-PLA-34-c) | GET | `/api/platform/alert-rules/{code}` | Reglas de plataforma. |
| [API-PLA-34-d](#API-PLA-34-d) | PATCH | `/api/platform/alert-rules/{code}` | Reglas de plataforma. |
| [API-PLA-35](#API-PLA-35) | GET | `/api/platform/ops/queues` | Métricas de colas por tenant. |
| [API-PLA-36](#API-PLA-36) | GET | `/api/platform/ops/job-runs` | Jobs. |
| [API-PLA-37](#API-PLA-37) | POST | `/api/platform/ops/job-runs/{id}/retry` | Reintento/cancelación. |
| [API-PLA-37-b](#API-PLA-37-b) | POST | `/api/platform/ops/job-runs/{id}/cancel` | Reintento/cancelación. |
| [API-PLA-38](#API-PLA-38) | POST | `/api/platform/ops/queues/{name}/pause` | Pausa de cola. |
| [API-PLA-38-b](#API-PLA-38-b) | POST | `/api/platform/ops/queues/{name}/resume` | Pausa de cola. |
| [API-PLA-39](#API-PLA-39) | GET | `/api/platform/ops/outbox` | Lag y pendientes. |
| [API-PLA-40](#API-PLA-40) | GET | `/api/platform/ops/dead-letters` | Bandeja técnica. |
| [API-PLA-40-b](#API-PLA-40-b) | POST | `/api/platform/ops/dead-letters` | Bandeja técnica. |
| [API-PLA-40-c](#API-PLA-40-c) | POST | `/api/platform/ops/dead-letters/{id}/reprocess` | Bandeja técnica. |
| [API-PLA-40-d](#API-PLA-40-d) | POST | `/api/platform/ops/dead-letters/{id}/discard` | Bandeja técnica. |
| [API-PLA-41](#API-PLA-41) | GET | `/api/platform/backups/runs` | Ejecuciones. |
| [API-PLA-42](#API-PLA-42) | POST | `/api/platform/backups/tenants/{id}/run` | Backup lógico a demanda. |
| [API-PLA-43](#API-PLA-43) | GET | `/api/platform/restores` | Lista / solicitud. |
| [API-PLA-43-b](#API-PLA-43-b) | POST | `/api/platform/restores` | Lista / solicitud. |
| [API-PLA-44](#API-PLA-44) | POST | `/api/platform/restores/{id}/approve` | Ciclo de restauración. |
| [API-PLA-44-b](#API-PLA-44-b) | POST | `/api/platform/restores/{id}/execute` | Ciclo de restauración. |
| [API-PLA-44-c](#API-PLA-44-c) | POST | `/api/platform/restores/{id}/cancel` | Ciclo de restauración. |
| [API-PLA-45](#API-PLA-45) | GET | `/api/platform/restore-tests` | Ensayos. |
| [API-PLA-46](#API-PLA-46) | POST | `/api/platform/tenants/{id}/sandboxes` | Crear sandbox. |
| [API-PLA-47](#API-PLA-47) | POST | `/api/platform/tenants/{id}/sandboxes/{sbx}/sync` | Transferir paquete de configuración / copia anonimizada. |
| [API-PLA-48](#API-PLA-48) | GET | `/api/platform/releases` | Releases. |
| [API-PLA-48-b](#API-PLA-48-b) | POST | `/api/platform/releases` | Releases. |
| [API-PLA-48-c](#API-PLA-48-c) | POST | `/api/platform/releases/{version}/promote` | Releases. |
| [API-PLA-48-d](#API-PLA-48-d) | POST | `/api/platform/releases/{version}/rollback` | Releases. |
| [API-PLA-49](#API-PLA-49) | GET | `/api/platform/feature-flags` | Flags. |
| [API-PLA-49-b](#API-PLA-49-b) | GET | `/api/platform/feature-flags/{key}` | Flags. |
| [API-PLA-49-c](#API-PLA-49-c) | PUT | `/api/platform/feature-flags/{key}` | Flags. |
| [API-PLA-50](#API-PLA-50) | GET | `/api/platform/system/modules` | Inventario técnico. |
| [API-PLA-50-b](#API-PLA-50-b) | GET | `/api/platform/system/routes` | Inventario técnico. |
| [API-PLA-50-c](#API-PLA-50-c) | GET | `/api/platform/system/events` | Inventario técnico. |
| [API-PLA-50-d](#API-PLA-50-d) | GET | `/api/platform/system/jobs` | Inventario técnico. |
| [API-PLA-51](#API-PLA-51) | POST | `/api/platform/tenants/{id}/exports` | Exportación de salida/legal. |
| [API-PLA-52](#API-PLA-52) | GET | `/api/admin/pla/subscription` | Mi suscripción (proyección sin datos internos) |
| [API-PLA-53](#API-PLA-53) | GET | `/api/admin/pla/enablement` | Estado y checklists propios. |
| [API-PLA-54](#API-PLA-54) | POST | `/api/admin/pla/enablement/{capability}/items/{code}` | Verificar ítem manual propio. |
| [API-PLA-55](#API-PLA-55) | GET | `/api/admin/pla/support-cases` | Casos propios. |
| [API-PLA-55-b](#API-PLA-55-b) | POST | `/api/admin/pla/support-cases` | Casos propios. |
| [API-PLA-56](#API-PLA-56) | POST | `/api/admin/pla/support-cases/{id}/messages` | Interacción. |
| [API-PLA-56-b](#API-PLA-56-b) | POST | `/api/admin/pla/support-cases/{id}/reopen` | Interacción. |
| [API-PLA-56-c](#API-PLA-56-c) | POST | `/api/admin/pla/support-cases/{id}/close` | Interacción. |
| [API-PLA-56-d](#API-PLA-56-d) | POST | `/api/admin/pla/support-cases/{id}/survey` | Interacción. |
| [API-PLA-57](#API-PLA-57) | GET | `/api/admin/pla/support-grants` | Accesos a mi tenant y sesiones. |
| [API-PLA-58](#API-PLA-58) | POST | `/api/admin/pla/support-grants/{id}/approve` | Decisión del tenant. |
| [API-PLA-58-b](#API-PLA-58-b) | POST | `/api/admin/pla/support-grants/{id}/reject` | Decisión del tenant. |
| [API-PLA-58-c](#API-PLA-58-c) | POST | `/api/admin/pla/support-grants/{id}/revoke` | Decisión del tenant. |
| [API-PLA-59](#API-PLA-59) | GET | `/api/admin/pla/exports` | Exportación completa. |
| [API-PLA-59-b](#API-PLA-59-b) | POST | `/api/admin/pla/exports` | Exportación completa. |
| [API-PLA-60](#API-PLA-60) | GET | `/api/admin/pla/release-notes` | Lo nuevo y avisos. |
| [API-PLA-61](#API-PLA-61) | GET | `/api/admin/pla/status` | Estado del tenant (banda, suspensión, mantenimiento) |
| [API-PLA-62](#API-PLA-62) | GET | `/api/files/{id}/url` | URL firmada de descarga. |
| [API-PLA-63](#API-PLA-63) | POST | `/api/files/uploads` | URL firmada de subida y confirmación. |
| [API-PLA-63-b](#API-PLA-63-b) | POST | `/api/files/uploads/{id}/complete` | URL firmada de subida y confirmación. |
| [API-PLA-65](#API-PLA-65) | GET | `/api/public/platform/status` | Estado de servicio (PAN-PLA-24) |
| [API-PLA-66](#API-PLA-66) | GET | `/health/live` | Salud para el orquestador. |
| [API-PLA-66-b](#API-PLA-66-b) | GET | `/health/ready` | Salud para el orquestador. |
| [API-PLA-67](#API-PLA-67) | GET | `/api/me/job-runs/{id}` | Progreso de un job lanzado por el usuario. |

<a id="API-PLA-01"></a>
#### API-PLA-01 · `GET /api/platform/tenants`

- **Qué hace:** Lista paginada con filtros. Lista, con filtros y paginación, los registros de registro del tenant (`tenants`).
- **Para qué sirve:** RF-PLA-144: Incidentes de plataforma con severidad, estado, tenants y módulos afectados, mensaje público (página de estado) y postmortem. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.tenants.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de registro del tenant (`tenants`) con `total`.
- **Pantallas:** PAN-PLA-02 (Listado de tenants), PAN-PLA-03 (Ficha del tenant).
- **Ola:** O0 · **Fuente:** T01 §11. API, línea 1877 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-01)

<a id="API-PLA-02"></a>
#### API-PLA-02 · `POST /api/platform/tenants`

- **Qué hace:** Alta directa (sin asistente) Da de alta un registro de registro del tenant (`tenants`).
- **Para qué sirve:** RF-PLA-056: Asistente de alta de cooperativa en pasos: identidad → contactos → marca → módulos/plan → dominio y región → administrador inicial → resumen y confirmación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.tenants.crear`.
- **Recibe:** los datos de registro del tenant (`tenants`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de registro del tenant (`tenants`).
- **Ola:** O0 · **Fuente:** T01 §11. API, línea 1878 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-02)

<a id="API-PLA-03"></a>
#### API-PLA-03 · `GET /api/platform/tenants/{id}`

- **Qué hace:** Ficha. Obtiene el detalle de un registro de registro del tenant (`tenants`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.tenants.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de registro del tenant (`tenants`).
- **Pantallas:** PAN-PLA-02 (Listado de tenants), PAN-PLA-03 (Ficha del tenant).
- **Ola:** O0 · **Fuente:** T01 §11. API, línea 1879 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-03)

<a id="API-PLA-04"></a>
#### API-PLA-04 · `PATCH /api/platform/tenants/{id}`

- **Qué hace:** Editar identidad, contactos, zona, anillo (con version) Modifica algunos campos de un registro de registro del tenant (`tenants`) (solo los enviados).
- **Para qué sirve:** RF-PLA-041: El administrador de plataforma registra cooperativas como tenants (alta, edición de identidad, contactos, región, zona horaria, dominio). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.tenants.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de registro del tenant (`tenants`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de registro del tenant (`tenants`).
- **Ola:** O0 · **Fuente:** T01 §11. API, línea 1880 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-04)

<a id="API-PLA-05"></a>
#### API-PLA-05 · `POST /api/platform/tenants/{id}/transitions`

- **Qué hace:** Transición de estado {to, reason, suspension?, closing?}. Cambia de estado (transición) un registro de `transitions`.
- **Para qué sirve:** RF-PLA-033: Cambiar un identificador de cooperativa o de documento en una solicitud no permite acceder a datos de otro tenant (respuesta 404, no 403, para no revelar existencia). · RF-PLA-050: Reactivación desde Suspendido a Operativo, reanudando jobs pausados sin ejecutar “recuperaciones” duplicadas (recalcula desde el estado actual). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.tenants.cambiarEstado`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1881 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-05)

<a id="API-PLA-06"></a>
#### API-PLA-06 · `GET /api/platform/tenants/{id}/checklists`

- **Qué hace:** Checklists del tenant. Lista, con filtros y paginación, los registros de lista de puesta en marcha (`tenantChecklists`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.checklists.ver`.
- **Recibe:** en la ruta `id`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de lista de puesta en marcha (`tenantChecklists`) con `total`.
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-06)

<a id="API-PLA-07"></a>
#### API-PLA-07 · `POST /api/platform/tenants/{id}/checklists/{capability}/evaluate`

- **Qué hace:** Reevaluar ahora. Evalúa un registro de lista de puesta en marcha (`tenantChecklists`).
- **Para qué sirve:** RF-PLA-054: Dos tenants de prueba (TEN-001 y TEN-002) para verificar aislamiento y configuración propia, desde la ola O1. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.checklists.verificar`.
- **Recibe:** en la ruta `id`, `capability`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1883 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-07)

<a id="API-PLA-08"></a>
#### API-PLA-08 · `POST /api/platform/tenants/{id}/checklists/{capability}/items/{code}`

- **Qué hace:** Verificar/dispensar ítem manual con evidencia. Registra un nuevo elemento u operación en lista de puesta en marcha (`tenantChecklists`).
- **Para qué sirve:** RF-PLA-046: Checklists de habilitación por capacidad (§9.2): identidad, servicio, tarifas, emisión, pagos, usuarios, contactos, saldos iniciales, comunicaciones, landing, legales; ítems automáticos (provistos por cada módulo) y manuales (con… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.checklists.verificar`.
- **Recibe:** en la ruta `id`, `capability`, `code`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1884 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-08)

<a id="API-PLA-09"></a>
#### API-PLA-09 · `GET /api/platform/tenants/{id}/modules`

- **Qué hace:** Licencias + activaciones + efectivos. Consulta «modules» de un registro de `modules`.
- **Para qué sirve:** RF-PLA-066: Capa 2 — Activación: qué módulo licenciado está encendido hoy y en qué modo (off, test, production, historyReadOnly), por tenant. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.licencias.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1885 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-09)

<a id="API-PLA-10"></a>
#### API-PLA-10 · `PUT /api/platform/tenants/{id}/licenses/{moduleCode}`

- **Qué hace:** Alta/edición de licencia. Reemplaza o configura un registro de licencia vigente y cupos (`tenantLicenses`).
- **Para qué sirve:** RF-PLA-041: El administrador de plataforma registra cooperativas como tenants (alta, edición de identidad, contactos, región, zona horaria, dominio). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.licencias.editar`.
- **Recibe:** en la ruta `id`, `moduleCode`; los datos de licencia vigente y cupos (`tenantLicenses`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de licencia vigente y cupos (`tenantLicenses`).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1886 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-10)

<a id="API-PLA-11"></a>
#### API-PLA-11 · `POST /api/platform/tenants/{id}/modules/{moduleCode}/activate`

- **Qué hace:** Cambio de modo {mode, newSalesBlocked?, reason}. Activa un registro de `activate`.
- **Para qué sirve:** RF-PLA-066: Capa 2 — Activación: qué módulo licenciado está encendido hoy y en qué modo (off, test, production, historyReadOnly), por tenant. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.licencias.editar`.
- **Recibe:** en la ruta `id`, `moduleCode`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1887 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-11)

<a id="API-PLA-12"></a>
#### API-PLA-12 · `POST /api/platform/onboarding/drafts`

- **Qué hace:** Crear borrador. Da de alta un registro de alta asistida antes de crear el tenant (`onboardingDrafts`).
- **Para qué sirve:** RF-PLA-062: Un borrador de alta descartado no deja tenant ni usuarios creados; los archivos subidos se eliminan por job. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.altaAsistida.usar`.
- **Recibe:** los datos de alta asistida antes de crear el tenant (`onboardingDrafts`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de alta asistida antes de crear el tenant (`onboardingDrafts`).
- **Pantallas:** PAN-PLA-04 (Alta asistida de tenant).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1888 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-12)

<a id="API-PLA-13"></a>
#### API-PLA-13 · `PATCH /api/platform/onboarding/drafts/{id}`

- **Qué hace:** Guardar paso. Modifica algunos campos de un registro de alta asistida antes de crear el tenant (`onboardingDrafts`) (solo los enviados).
- **Para qué sirve:** RF-PLA-040: El tenant PLATFORM puede usar los módulos funcionales del propio sistema para su gestión (facturación del SaaS, CRM de soporte), como cualquier tenant y con el mismo aislamiento. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.altaAsistida.usar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de alta asistida antes de crear el tenant (`onboardingDrafts`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de alta asistida antes de crear el tenant (`onboardingDrafts`).
- **Pantallas:** PAN-PLA-04 (Alta asistida de tenant).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1889 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-13)

<a id="API-PLA-14"></a>
#### API-PLA-14 · `POST /api/platform/onboarding/drafts/{id}/ai-proposal`

- **Qué hace:** Encola propuesta IA; devuelve jobRunId. Registra «ai-proposal» sobre un registro de alta asistida antes de crear el tenant (`onboardingDrafts`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-PLA-011: Cada job es idempotente, reanudable y con progreso persistido en jobRuns; nombre <modulo>:<proceso>. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.altaAsistida.usar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-PLA-04 (Alta asistida de tenant).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1890 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-14)

<a id="API-PLA-15"></a>
#### API-PLA-15 · `POST /api/platform/onboarding/drafts/{id}/confirm`

- **Qué hace:** Confirma alta. Confirma un registro de alta asistida antes de crear el tenant (`onboardingDrafts`).
- **Para qué sirve:** RF-PLA-056: Asistente de alta de cooperativa en pasos: identidad → contactos → marca → módulos/plan → dominio y región → administrador inicial → resumen y confirmación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.tenants.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1891 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-15)

<a id="API-PLA-16"></a>
#### API-PLA-16 · `GET /api/platform/module-catalog`

- **Qué hace:** Catálogo de módulos. Lista, con filtros y paginación, los registros de módulos y capabilities licenciables (`moduleCatalog`).
- **Para qué sirve:** RF-PLA-147: Migraciones de esquema y de catálogos (parámetros, capabilities, módulos, menú) forman parte del despliegue, idempotentes, ejecutadas por el pipeline, nunca por el primer usuario que entra. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.catalogo.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de módulos y capabilities licenciables (`moduleCatalog`) con `total`.
- **Pantallas:** PAN-PLA-05 (Catálogo de módulos vendibles).
- **Ola:** O0 · **Fuente:** T01 §11. API, línea 1892 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-16)

<a id="API-PLA-16-b"></a>
#### API-PLA-16-b · `POST /api/platform/module-catalog`

- **Qué hace:** Catálogo de módulos. Da de alta un registro de módulos y capabilities licenciables (`moduleCatalog`).
- **Para qué sirve:** RF-PLA-147: Migraciones de esquema y de catálogos (parámetros, capabilities, módulos, menú) forman parte del despliegue, idempotentes, ejecutadas por el pipeline, nunca por el primer usuario que entra. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.catalogo.editar`.
- **Recibe:** los datos de módulos y capabilities licenciables (`moduleCatalog`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de módulos y capabilities licenciables (`moduleCatalog`).
- **Ola:** O0 · **Fuente:** T01 §11. API, línea 1892 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-16-b)

<a id="API-PLA-16-c"></a>
#### API-PLA-16-c · `GET /api/platform/module-catalog/{code}`

- **Qué hace:** Catálogo de módulos. Obtiene el detalle de un registro de módulos y capabilities licenciables (`moduleCatalog`).
- **Para qué sirve:** RF-PLA-147: Migraciones de esquema y de catálogos (parámetros, capabilities, módulos, menú) forman parte del despliegue, idempotentes, ejecutadas por el pipeline, nunca por el primer usuario que entra. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.catalogo.ver`.
- **Recibe:** en la ruta `code`.
- **Devuelve:** 200: el registro de módulos y capabilities licenciables (`moduleCatalog`).
- **Pantallas:** PAN-PLA-05 (Catálogo de módulos vendibles).
- **Ola:** O0 · **Fuente:** T01 §11. API, línea 1892 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-16-c)

<a id="API-PLA-16-d"></a>
#### API-PLA-16-d · `PATCH /api/platform/module-catalog/{code}`

- **Qué hace:** Catálogo de módulos. Modifica algunos campos de un registro de módulos y capabilities licenciables (`moduleCatalog`) (solo los enviados).
- **Para qué sirve:** RF-PLA-147: Migraciones de esquema y de catálogos (parámetros, capabilities, módulos, menú) forman parte del despliegue, idempotentes, ejecutadas por el pipeline, nunca por el primer usuario que entra. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.catalogo.editar`.
- **Recibe:** en la ruta `code`; solo los campos a cambiar de módulos y capabilities licenciables (`moduleCatalog`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de módulos y capabilities licenciables (`moduleCatalog`).
- **Ola:** O0 · **Fuente:** T01 §11. API, línea 1892 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-16-d)

<a id="API-PLA-17"></a>
#### API-PLA-17 · `GET /api/platform/plans`

- **Qué hace:** Planes. Lista, con filtros y paginación, los registros de packs y complementos comerciales (`platformPlans`).
- **Para qué sirve:** RF-PLA-072: Packs/planes (platformPlans) agrupan módulos y cupos por defecto; un tenant puede tener plan + complementos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.planes.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de packs y complementos comerciales (`platformPlans`) con `total`.
- **Pantallas:** PAN-PLA-06 (Licencias y packs).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1893 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-17)

<a id="API-PLA-17-b"></a>
#### API-PLA-17-b · `POST /api/platform/plans`

- **Qué hace:** Planes. Da de alta un registro de packs y complementos comerciales (`platformPlans`).
- **Para qué sirve:** RF-PLA-072: Packs/planes (platformPlans) agrupan módulos y cupos por defecto; un tenant puede tener plan + complementos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.planes.editar`.
- **Recibe:** los datos de packs y complementos comerciales (`platformPlans`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de packs y complementos comerciales (`platformPlans`).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1893 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-17-b)

<a id="API-PLA-17-c"></a>
#### API-PLA-17-c · `GET /api/platform/plans/{code}`

- **Qué hace:** Planes. Obtiene el detalle de un registro de packs y complementos comerciales (`platformPlans`).
- **Para qué sirve:** RF-PLA-072: Packs/planes (platformPlans) agrupan módulos y cupos por defecto; un tenant puede tener plan + complementos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.planes.ver`.
- **Recibe:** en la ruta `code`.
- **Devuelve:** 200: el registro de packs y complementos comerciales (`platformPlans`).
- **Pantallas:** PAN-PLA-06 (Licencias y packs).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1893 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-17-c)

<a id="API-PLA-17-d"></a>
#### API-PLA-17-d · `PATCH /api/platform/plans/{code}`

- **Qué hace:** Planes. Modifica algunos campos de un registro de packs y complementos comerciales (`platformPlans`) (solo los enviados).
- **Para qué sirve:** RF-PLA-072: Packs/planes (platformPlans) agrupan módulos y cupos por defecto; un tenant puede tener plan + complementos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.planes.editar`.
- **Recibe:** en la ruta `code`; solo los campos a cambiar de packs y complementos comerciales (`platformPlans`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de packs y complementos comerciales (`platformPlans`).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1893 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-17-d)

<a id="API-PLA-18"></a>
#### API-PLA-18 · `GET /api/platform/saas-contracts`

- **Qué hace:** Lista / alta. Lista, con filtros y paginación, los registros de contrato SaaS GoodApps–cooperativa (`saasContracts`).
- **Para qué sirve:** RF-PLA-076: Registrar por tenant el contrato SaaS: plan, módulos, cupos, vigencia, renovación, región, objetivos de servicio (SLA/RPO/RTO), condiciones de salida y documento firmado, con el contrato tipo de encargo de tratamiento (GoodApps… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.contratos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de contrato SaaS GoodApps–cooperativa (`saasContracts`) con `total`.
- **Pantallas:** PAN-PLA-07 (Contratos SaaS).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1894 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-18)

<a id="API-PLA-18-b"></a>
#### API-PLA-18-b · `POST /api/platform/saas-contracts`

- **Qué hace:** Lista / alta. Da de alta un registro de contrato SaaS GoodApps–cooperativa (`saasContracts`).
- **Para qué sirve:** RF-PLA-076: Registrar por tenant el contrato SaaS: plan, módulos, cupos, vigencia, renovación, región, objetivos de servicio (SLA/RPO/RTO), condiciones de salida y documento firmado, con el contrato tipo de encargo de tratamiento (GoodApps… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.contratos.crear`.
- **Recibe:** los datos de contrato SaaS GoodApps–cooperativa (`saasContracts`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de contrato SaaS GoodApps–cooperativa (`saasContracts`).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1894 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-18-b)

<a id="API-PLA-19"></a>
#### API-PLA-19 · `PATCH /api/platform/saas-contracts/{id}`

- **Qué hace:** Edición de borrador o nueva versión. Modifica algunos campos de un registro de contrato SaaS GoodApps–cooperativa (`saasContracts`) (solo los enviados).
- **Para qué sirve:** RF-PLA-076: Registrar por tenant el contrato SaaS: plan, módulos, cupos, vigencia, renovación, región, objetivos de servicio (SLA/RPO/RTO), condiciones de salida y documento firmado, con el contrato tipo de encargo de tratamiento (GoodApps… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.contratos.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de contrato SaaS GoodApps–cooperativa (`saasContracts`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de contrato SaaS GoodApps–cooperativa (`saasContracts`).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1895 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-19)

<a id="API-PLA-20"></a>
#### API-PLA-20 · `POST /api/platform/saas-contracts/{id}/transitions`

- **Qué hace:** Enviar, aprobar, rechazar, terminar. Cambia de estado (transición) un registro de `transitions`.
- **Para qué sirve:** RF-PLA-143: Errores no controlados se registran en el sistema de errores de la plataforma; prohibido enviar excepciones a casillas personales o externas no contratadas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.contratos.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T01 §11. API, línea 1896 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-20)

<a id="API-PLA-21"></a>
#### API-PLA-21 · `GET /api/platform/usage`

- **Qué hace:** Uso por tenant y dimensión. Lista, con filtros y paginación, los registros de consumo agregado de IA por tenant y período (`aiUsage`).
- **Para qué sirve:** RF-PLA-079: Medición de uso diaria por tenant y dimensión (usageSnapshots), consultable por plataforma y por el tenant. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.uso.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de consumo agregado de IA por tenant y período (`aiUsage`) con `total`.
- **Pantallas:** PAN-PLA-22 (Uso por tenant).
- **Ola:** O2 · **Fuente:** T01 §11. API, línea 1897 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-21)

<a id="API-PLA-22"></a>
#### API-PLA-22 · `GET /api/platform/saas-contracts/{id}/pre-invoice`

- **Qué hace:** Prefactura exportable. Consulta «pre-invoice» de un registro de `pre-invoice`.
- **Para qué sirve:** RF-PLA-082: Facturación de la plataforma a las cooperativas, separada de la facturación que cada cooperativa hace a sus socios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.facturacionSaas.exportar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1898 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-22)

<a id="API-PLA-23"></a>
#### API-PLA-23 · `GET /api/platform/support/cases`

- **Qué hace:** Bandeja global. Lista, con filtros y paginación, los registros de casos de soporte del tenant (`supportCases`).
- **Para qué sirve:** RF-PLA-087: Indicadores de plataforma: tenants por estado; errores de procesos e integraciones; trabajos pendientes; disponibilidad operativa; configuraciones/checklists incompletos; además: lag de outbox, bandeja técnica, uso vs cupo… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.soporte.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de casos de soporte del tenant (`supportCases`) con `total`.
- **Pantallas:** PAN-PLA-17 (Casos de soporte de plataforma), PAN-PLA-21 (Bandeja de soporte de plataforma).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1899 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-23)

<a id="API-PLA-24"></a>
#### API-PLA-24 · `PATCH /api/platform/support/cases/{id}`

- **Qué hace:** Asignar, prioridad, estado, incidente. Modifica algunos campos de un registro de casos de soporte del tenant (`supportCases`) (solo los enviados).
- **Para qué sirve:** RF-PLA-098: Asignar responsable, prioridad (P1–P4) y estado; conversación e historial de actuaciones; SLA de primera respuesta y resolución por prioridad (valores a acordar). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.soporte.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de casos de soporte del tenant (`supportCases`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de casos de soporte del tenant (`supportCases`).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1900 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-24)

<a id="API-PLA-25"></a>
#### API-PLA-25 · `POST /api/platform/support/cases/{id}/messages`

- **Qué hace:** Mensaje público/interno. Da de alta un registro de mensajes del caso (`supportCaseMessages`).
- **Para qué sirve:** RF-PLA-144: Incidentes de plataforma con severidad, estado, tenants y módulos afectados, mensaje público (página de estado) y postmortem. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.soporte.editar`.
- **Recibe:** en la ruta `id`; los datos de mensajes del caso (`supportCaseMessages`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de mensajes del caso (`supportCaseMessages`).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1901 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-25)

<a id="API-PLA-26"></a>
#### API-PLA-26 · `POST /api/platform/support/grants`

- **Qué hace:** Solicitar acceso temporal. Da de alta un registro de (duplicada con T02) (`supportAccessGrants`).
- **Para qué sirve:** RF-PLA-101: Acceso temporal de soporte: solicitud vinculada a un caso, alcance mínimo (módulos/capabilities/entidades), modo (observar, operar, configurar), justificación, aprobación cuando corresponda, vencimiento, registro y revocación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.soporte.accesos.solicitar`.
- **Recibe:** los datos de (duplicada con T02) (`supportAccessGrants`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de (duplicada con T02) (`supportAccessGrants`).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1902 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-26)

<a id="API-PLA-27"></a>
#### API-PLA-27 · `POST /api/platform/support/grants/{id}/decision`

- **Qué hace:** Aprobación de plataforma (observe sin PII, break-glass) Registra la decisión sobre un registro de (duplicada con T02) (`supportAccessGrants`).
- **Para qué sirve:** RF-PLA-105: Break-glass para incidentes P1: acceso sin aprobación previa del tenant solo con doble aprobación de plataforma (Soporte N2 + Seguridad), duración máxima corta y notificación inmediata al tenant. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.soporte.accesos.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1903 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-27)

<a id="API-PLA-28"></a>
#### API-PLA-28 · `POST /api/platform/support/grants/{id}/sessions`

- **Qué hace:** Inicia sesión de soporte y emite token. Da de alta un registro de sesiones de soporte con acceso temporal (`supportSessions`).
- **Para qué sirve:** RF-PLA-038: Los usuarios de PLATFORM no tienen acceso a datos de negocio de los tenants por pertenecer a la plataforma; solo mediante acceso temporal de soporte (§5.I). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.soporte.accesos.solicitar`.
- **Recibe:** en la ruta `id`; los datos de sesiones de soporte con acceso temporal (`supportSessions`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de sesiones de soporte con acceso temporal (`supportSessions`).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1904 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-28)

<a id="API-PLA-29"></a>
#### API-PLA-29 · `POST /api/platform/support/grants/{id}/revoke`

- **Qué hace:** Revoca. Revoca un registro de (duplicada con T02) (`supportAccessGrants`).
- **Para qué sirve:** RF-PLA-101: Acceso temporal de soporte: solicitud vinculada a un caso, alcance mínimo (módulos/capabilities/entidades), modo (observar, operar, configurar), justificación, aprobación cuando corresponda, vencimiento, registro y revocación. · RF-PLA-104: El tenant consulta todas las intervenciones de soporte (grants, sesiones, acciones) y puede revocar un grant activo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.soporte.accesos.revocar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1905 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-29)

<a id="API-PLA-30"></a>
#### API-PLA-30 · `GET /api/platform/incidents`

- **Qué hace:** Incidentes. Lista, con filtros y paginación, los registros de incidentes operativos de plataforma (`platformIncidents`).
- **Para qué sirve:** RF-PLA-099: Comunicar avances, solución y eventual vinculación con un incidente general de plataforma (INC-…). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.incidentes.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de incidentes operativos de plataforma (`platformIncidents`) con `total`.
- **Pantallas:** PAN-PLA-13 (Incidentes de plataforma).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1906 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-30)

<a id="API-PLA-30-b"></a>
#### API-PLA-30-b · `POST /api/platform/incidents`

- **Qué hace:** Incidentes. Da de alta un registro de incidentes operativos de plataforma (`platformIncidents`).
- **Para qué sirve:** RF-PLA-099: Comunicar avances, solución y eventual vinculación con un incidente general de plataforma (INC-…). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.incidentes.editar`.
- **Recibe:** los datos de incidentes operativos de plataforma (`platformIncidents`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de incidentes operativos de plataforma (`platformIncidents`).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1906 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-30-b)

<a id="API-PLA-30-c"></a>
#### API-PLA-30-c · `GET /api/platform/incidents/{id}`

- **Qué hace:** Incidentes. Obtiene el detalle de un registro de incidentes operativos de plataforma (`platformIncidents`).
- **Para qué sirve:** RF-PLA-099: Comunicar avances, solución y eventual vinculación con un incidente general de plataforma (INC-…). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.incidentes.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de incidentes operativos de plataforma (`platformIncidents`).
- **Pantallas:** PAN-PLA-13 (Incidentes de plataforma).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1906 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-30-c)

<a id="API-PLA-30-d"></a>
#### API-PLA-30-d · `PATCH /api/platform/incidents/{id}`

- **Qué hace:** Incidentes. Modifica algunos campos de un registro de incidentes operativos de plataforma (`platformIncidents`) (solo los enviados).
- **Para qué sirve:** RF-PLA-099: Comunicar avances, solución y eventual vinculación con un incidente general de plataforma (INC-…). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.incidentes.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de incidentes operativos de plataforma (`platformIncidents`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de incidentes operativos de plataforma (`platformIncidents`).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1906 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-30-d)

<a id="API-PLA-31"></a>
#### API-PLA-31 · `GET /api/platform/dashboard/summary`

- **Qué hace:** KPIs §15.1. Consulta `summary`.
- **Para qué sirve:** RF-PLA-086: Dashboard del administrador de plataforma con visión global autorizada de la solución y sus tenants. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.dashboard.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PLA-01 (Dashboard global).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1907 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-31)

<a id="API-PLA-32"></a>
#### API-PLA-32 · `GET /api/platform/alerts`

- **Qué hace:** Alertas. Lista, con filtros y paginación, los registros de alertas disparadas (`alerts`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.alertas.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de alertas disparadas (`alerts`) con `total`.
- **Pantallas:** PAN-PLA-12 (Alertas y reglas).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1908 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-32)

<a id="API-PLA-33"></a>
#### API-PLA-33 · `POST /api/platform/alerts/{id}/ack`

- **Qué hace:** Ciclo de alerta. Toma conocimiento de un registro de `ack`.
- **Para qué sirve:** RF-PLA-089: Motor genérico de alertas: reglas con condición, severidad, destinatarios, deduplicación, ventana de enfriamiento; alertas con estado (abierta, reconocida, resuelta, silenciada), reconocimiento, resolución y vínculo al objeto de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.alertas.reconocer`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1909 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-33)

<a id="API-PLA-33-b"></a>
#### API-PLA-33-b · `POST /api/platform/alerts/{id}/resolve`

- **Qué hace:** Ciclo de alerta. Resuelve un registro de `resolve`.
- **Para qué sirve:** RF-PLA-089: Motor genérico de alertas: reglas con condición, severidad, destinatarios, deduplicación, ventana de enfriamiento; alertas con estado (abierta, reconocida, resuelta, silenciada), reconocimiento, resolución y vínculo al objeto de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.alertas.reconocer`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1909 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-33-b)

<a id="API-PLA-33-c"></a>
#### API-PLA-33-c · `POST /api/platform/alerts/{id}/silence`

- **Qué hace:** Ciclo de alerta. Silencia un registro de `silence`.
- **Para qué sirve:** RF-PLA-089: Motor genérico de alertas: reglas con condición, severidad, destinatarios, deduplicación, ventana de enfriamiento; alertas con estado (abierta, reconocida, resuelta, silenciada), reconocimiento, resolución y vínculo al objeto de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.alertas.reconocer`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1909 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-33-c)

<a id="API-PLA-34"></a>
#### API-PLA-34 · `GET /api/platform/alert-rules`

- **Qué hace:** Reglas de plataforma. Lista, con filtros y paginación, los registros de reglas de alerta operativas y de SLO (`alertRules`).
- **Para qué sirve:** RF-PLA-090: Las alertas de ámbito plataforma se dirigen a roles de PLATFORM; el motor expone API para que los módulos (T10) definan reglas de ámbito tenant. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.alertas.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de reglas de alerta operativas y de SLO (`alertRules`) con `total`.
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1910 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-34)

<a id="API-PLA-34-b"></a>
#### API-PLA-34-b · `POST /api/platform/alert-rules`

- **Qué hace:** Reglas de plataforma. Da de alta un registro de reglas de alerta operativas y de SLO (`alertRules`).
- **Para qué sirve:** RF-PLA-090: Las alertas de ámbito plataforma se dirigen a roles de PLATFORM; el motor expone API para que los módulos (T10) definan reglas de ámbito tenant. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.alertas.configurar`.
- **Recibe:** los datos de reglas de alerta operativas y de SLO (`alertRules`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de reglas de alerta operativas y de SLO (`alertRules`).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1910 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-34-b)

<a id="API-PLA-34-c"></a>
#### API-PLA-34-c · `GET /api/platform/alert-rules/{code}`

- **Qué hace:** Reglas de plataforma. Obtiene el detalle de un registro de reglas de alerta operativas y de SLO (`alertRules`).
- **Para qué sirve:** RF-PLA-090: Las alertas de ámbito plataforma se dirigen a roles de PLATFORM; el motor expone API para que los módulos (T10) definan reglas de ámbito tenant. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.alertas.configurar`.
- **Recibe:** en la ruta `code`.
- **Devuelve:** 200: el registro de reglas de alerta operativas y de SLO (`alertRules`).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1910 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-34-c)

<a id="API-PLA-34-d"></a>
#### API-PLA-34-d · `PATCH /api/platform/alert-rules/{code}`

- **Qué hace:** Reglas de plataforma. Modifica algunos campos de un registro de reglas de alerta operativas y de SLO (`alertRules`) (solo los enviados).
- **Para qué sirve:** RF-PLA-090: Las alertas de ámbito plataforma se dirigen a roles de PLATFORM; el motor expone API para que los módulos (T10) definan reglas de ámbito tenant. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.alertas.configurar`.
- **Recibe:** en la ruta `code`; solo los campos a cambiar de reglas de alerta operativas y de SLO (`alertRules`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de reglas de alerta operativas y de SLO (`alertRules`).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1910 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-34-d)

<a id="API-PLA-35"></a>
#### API-PLA-35 · `GET /api/platform/ops/queues`

- **Qué hace:** Métricas de colas por tenant. Consulta `queues`.
- **Para qué sirve:** RF-PLA-137: Métricas (OpenTelemetry/Prometheus): latencia y errores por ruta y tenant, profundidad y edad de colas, jobs fallidos/estancados, lag de outbox, conexiones Mongo, uso de Redis, tamaño de almacenamiento por tenant. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.jobs.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PLA-09 (Salud de colas, jobs, outbox y bandeja técnica).
- **Ola:** O0 · **Fuente:** T01 §11. API, línea 1911 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-35)

<a id="API-PLA-36"></a>
#### API-PLA-36 · `GET /api/platform/ops/job-runs`

- **Qué hace:** Jobs. Lista, con filtros y paginación, los registros de ejecuciones de jobs BullMQ; TTL (`jobRuns`).
- **Para qué sirve:** RF-PLA-021: Contexto de ejecución con AsyncLocalStorage (tenantId, userId, actorType, requestId, correlationId, supportGrantId, environment) propagado a servicios, eventos, jobs, logs y auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.jobs.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ejecuciones de jobs BullMQ; TTL (`jobRuns`) con `total`.
- **Pantallas:** PAN-PLA-09 (Salud de colas, jobs, outbox y bandeja técnica).
- **Ola:** O0 · **Fuente:** T01 §11. API, línea 1912 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-36)

<a id="API-PLA-37"></a>
#### API-PLA-37 · `POST /api/platform/ops/job-runs/{id}/retry`

- **Qué hace:** Reintento/cancelación. Reintenta un registro de ejecuciones de jobs BullMQ; TTL (`jobRuns`).
- **Para qué sirve:** RF-PLA-140: Salud de jobs: vista por cola y por tenant (en espera, activos, demorados, fallidos, estancados), reintento, cancelación, pausa de cola; jobRuns con progreso visible también al usuario que lanzó el job. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.jobs.reintentar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T01 §11. API, línea 1913 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-37)

<a id="API-PLA-37-b"></a>
#### API-PLA-37-b · `POST /api/platform/ops/job-runs/{id}/cancel`

- **Qué hace:** Reintento/cancelación. Cancela un registro de ejecuciones de jobs BullMQ; TTL (`jobRuns`).
- **Para qué sirve:** RF-PLA-140: Salud de jobs: vista por cola y por tenant (en espera, activos, demorados, fallidos, estancados), reintento, cancelación, pausa de cola; jobRuns con progreso visible también al usuario que lanzó el job. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.jobs.reintentar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T01 §11. API, línea 1913 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-37-b)

<a id="API-PLA-38"></a>
#### API-PLA-38 · `POST /api/platform/ops/queues/{name}/pause`

- **Qué hace:** Pausa de cola. Pausa un registro de `pause`.
- **Para qué sirve:** RF-PLA-129: Un lote o una API de BI de un tenant no degrada a otros: colas por clase de carga, concurrencia máxima por tenant y por cola, prioridades, rate limiting por tenant y token. · RF-PLA-140: Salud de jobs: vista por cola y por tenant (en espera, activos, demorados, fallidos, estancados), reintento, cancelación, pausa de cola; jobRuns con progreso visible también al usuario que lanzó el job. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.colas.pausar`.
- **Recibe:** en la ruta `name`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1914 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-38)

<a id="API-PLA-38-b"></a>
#### API-PLA-38-b · `POST /api/platform/ops/queues/{name}/resume`

- **Qué hace:** Pausa de cola. Reanuda un registro de `resume`.
- **Para qué sirve:** RF-PLA-129: Un lote o una API de BI de un tenant no degrada a otros: colas por clase de carga, concurrencia máxima por tenant y por cola, prioridades, rate limiting por tenant y token. · RF-PLA-140: Salud de jobs: vista por cola y por tenant (en espera, activos, demorados, fallidos, estancados), reintento, cancelación, pausa de cola; jobRuns con progreso visible también al usuario que lanzó el job. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.colas.pausar`.
- **Recibe:** en la ruta `name`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1914 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-38-b)

<a id="API-PLA-39"></a>
#### API-PLA-39 · `GET /api/platform/ops/outbox`

- **Qué hace:** Lag y pendientes. Lista, con filtros y paginación, los registros de outbox transaccional; TTL tras publicar (`outboxEvents`).
- **Para qué sirve:** RF-PLA-009: Outbox de eventos: todo evento de dominio se graba en outboxEvents en la misma transacción; un relay lo entrega a los suscriptores registrados vía BullMQ; los consumidores son idempotentes (inboxReceipts). · RF-PLA-006: Convención interna de cada módulo (maestro §5.2 ampliado): index.js (API pública), manifest.js, model/ (esquemas Mongoose), domain/ (lógica pura, sin IO), service/ (casos de uso, transacciones, outbox), adapters/ (IO externo… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.jobs.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de outbox transaccional; TTL tras publicar (`outboxEvents`) con `total`.
- **Pantallas:** PAN-PLA-09 (Salud de colas, jobs, outbox y bandeja técnica).
- **Ola:** O0 · **Fuente:** T01 §11. API, línea 1915 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-39)

<a id="API-PLA-40"></a>
#### API-PLA-40 · `GET /api/platform/ops/dead-letters`

- **Qué hace:** Bandeja técnica. Lista, con filtros y paginación, los registros de mensajes fallidos para reproceso (`deadLetters`).
- **Para qué sirve:** RF-PLA-141: Bandeja técnica (deadLetters) para eventos/jobs agotados: causa, payload resumido (sin secretos), reintento manual, descarte justificado; los casos con impacto de negocio se muestran también al tenant en su bandeja operativa… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.deadLetters.reprocesar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de mensajes fallidos para reproceso (`deadLetters`) con `total`.
- **Ola:** O0 · **Fuente:** T01 §11. API, línea 1916 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-40)

<a id="API-PLA-40-b"></a>
#### API-PLA-40-b · `POST /api/platform/ops/dead-letters`

- **Qué hace:** Bandeja técnica. Da de alta un registro de mensajes fallidos para reproceso (`deadLetters`).
- **Para qué sirve:** RF-PLA-141: Bandeja técnica (deadLetters) para eventos/jobs agotados: causa, payload resumido (sin secretos), reintento manual, descarte justificado; los casos con impacto de negocio se muestran también al tenant en su bandeja operativa… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.deadLetters.reprocesar`.
- **Recibe:** los datos de mensajes fallidos para reproceso (`deadLetters`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de mensajes fallidos para reproceso (`deadLetters`).
- **Ola:** O0 · **Fuente:** T01 §11. API, línea 1916 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-40-b)

<a id="API-PLA-40-c"></a>
#### API-PLA-40-c · `POST /api/platform/ops/dead-letters/{id}/reprocess`

- **Qué hace:** Bandeja técnica. Reprocesa un registro de mensajes fallidos para reproceso (`deadLetters`).
- **Para qué sirve:** RF-PLA-141: Bandeja técnica (deadLetters) para eventos/jobs agotados: causa, payload resumido (sin secretos), reintento manual, descarte justificado; los casos con impacto de negocio se muestran también al tenant en su bandeja operativa… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.deadLetters.reprocesar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T01 §11. API, línea 1916 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-40-c)

<a id="API-PLA-40-d"></a>
#### API-PLA-40-d · `POST /api/platform/ops/dead-letters/{id}/discard`

- **Qué hace:** Bandeja técnica. Descarta un registro de mensajes fallidos para reproceso (`deadLetters`).
- **Para qué sirve:** RF-PLA-141: Bandeja técnica (deadLetters) para eventos/jobs agotados: causa, payload resumido (sin secretos), reintento manual, descarte justificado; los casos con impacto de negocio se muestran también al tenant en su bandeja operativa… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.deadLetters.reprocesar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T01 §11. API, línea 1916 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-40-d)

<a id="API-PLA-41"></a>
#### API-PLA-41 · `GET /api/platform/backups/runs`

- **Qué hace:** Ejecuciones. Lista, con filtros y paginación, los registros de ejecuciones de jobs BullMQ; TTL (`jobRuns`).
- **Para qué sirve:** RF-PLA-021: Contexto de ejecución con AsyncLocalStorage (tenantId, userId, actorType, requestId, correlationId, supportGrantId, environment) propagado a servicios, eventos, jobs, logs y auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.backups.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ejecuciones de jobs BullMQ; TTL (`jobRuns`) con `total`.
- **Pantallas:** PAN-PLA-10 (Respaldos y restauración).
- **Ola:** O0 · **Fuente:** T01 §11. API, línea 1917 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-41)

<a id="API-PLA-42"></a>
#### API-PLA-42 · `POST /api/platform/backups/tenants/{id}/run`

- **Qué hace:** Backup lógico a demanda. Ejecuta un registro de registro del tenant (`tenants`).
- **Para qué sirve:** RF-PLA-159: Purga definitiva del tenant: colecciones, objetos, cachés, índices de búsqueda, backups lógicos fuera de retención; con certificado de purga. · RF-PLA-119: Backup lógico por tenant diario (export de todas las colecciones del tenant + manifiesto de objetos), cifrado y con checksum, para restauraciones selectivas y portabilidad. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.backups.ejecutar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T01 §11. API, línea 1918 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-42)

<a id="API-PLA-43"></a>
#### API-PLA-43 · `GET /api/platform/restores`

- **Qué hace:** Lista / solicitud. Lista, con filtros y paginación, los registros de `restores`.
- **Para qué sirve:** RF-PLA-033: Cambiar un identificador de cooperativa o de documento en una solicitud no permite acceder a datos de otro tenant (respuesta 404, no 403, para no revelar existencia). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.restauraciones.solicitar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ResultadoGenerico (`ResultadoGenerico`) con `total`.
- **Pantallas:** PAN-PLA-11 (Restauraciones).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1919 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-43)

<a id="API-PLA-43-b"></a>
#### API-PLA-43-b · `POST /api/platform/restores`

- **Qué hace:** Lista / solicitud. Registra un nuevo elemento u operación en `restores`.
- **Para qué sirve:** RF-PLA-033: Cambiar un identificador de cooperativa o de documento en una solicitud no permite acceder a datos de otro tenant (respuesta 404, no 403, para no revelar existencia). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.restauraciones.solicitar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PLA-11 (Restauraciones).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1919 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-43-b)

<a id="API-PLA-44"></a>
#### API-PLA-44 · `POST /api/platform/restores/{id}/approve`

- **Qué hace:** Ciclo de restauración. Aprueba un registro de `approve`.
- **Para qué sirve:** RF-PLA-125: Restaurar exige doble aprobación (Operaciones + Seguridad) y, para reemplazo completo, conformidad del administrador del tenant; queda expediente con motivo, punto, alcance y evidencias. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.restauraciones.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1920 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-44)

<a id="API-PLA-44-b"></a>
#### API-PLA-44-b · `POST /api/platform/restores/{id}/execute`

- **Qué hace:** Ciclo de restauración. Ejecuta un registro de `execute`.
- **Para qué sirve:** RF-PLA-125: Restaurar exige doble aprobación (Operaciones + Seguridad) y, para reemplazo completo, conformidad del administrador del tenant; queda expediente con motivo, punto, alcance y evidencias. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.restauraciones.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1920 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-44-b)

<a id="API-PLA-44-c"></a>
#### API-PLA-44-c · `POST /api/platform/restores/{id}/cancel`

- **Qué hace:** Ciclo de restauración. Cancela un registro de `cancel`.
- **Para qué sirve:** RF-PLA-125: Restaurar exige doble aprobación (Operaciones + Seguridad) y, para reemplazo completo, conformidad del administrador del tenant; queda expediente con motivo, punto, alcance y evidencias. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.restauraciones.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1920 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-44-c)

<a id="API-PLA-45"></a>
#### API-PLA-45 · `GET /api/platform/restore-tests`

- **Qué hace:** Ensayos. Lista, con filtros y paginación, los registros de simulacros de restauración (`restoreTests`).
- **Para qué sirve:** RF-PLA-126: Ensayos periódicos de restauración con evidencia: recuperación del tenant, integridad de documentos (hashes de PDFs/XML), conciliación externa; no basta comprobar que existe el archivo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.backups.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de simulacros de restauración (`restoreTests`) con `total`.
- **Pantallas:** PAN-PLA-10 (Respaldos y restauración).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1921 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-45)

<a id="API-PLA-46"></a>
#### API-PLA-46 · `POST /api/platform/tenants/{id}/sandboxes`

- **Qué hace:** Crear sandbox. Registra «sandboxes» sobre un registro de `sandboxes`.
- **Para qué sirve:** RF-PLA-128: Restauración a sandbox para inspección (“¿qué tenía el tenant ayer?”) sin tocar producción. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.sandbox.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PLA-14 (Ambientes).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1922 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-46)

<a id="API-PLA-47"></a>
#### API-PLA-47 · `POST /api/platform/tenants/{id}/sandboxes/{sbx}/sync`

- **Qué hace:** Transferir paquete de configuración / copia anonimizada. Sincroniza un registro de `sync`.
- **Para qué sirve:** RF-PLA-116: Datos personales reales no se copian a ambientes no productivos salvo copia anonimizada aprobada (PA-PLA-07). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.sandbox.crear`.
- **Recibe:** en la ruta `id`, `sbx`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PLA-14 (Ambientes).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1923 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-47)

<a id="API-PLA-48"></a>
#### API-PLA-48 · `GET /api/platform/releases`

- **Qué hace:** Releases. Lista, con filtros y paginación, los registros de versiones desplegadas y notas (`releases`).
- **Para qué sirve:** RF-PLA-152: Notas de versión (“Lo nuevo”) por release, con claves de diccionario, publicadas automáticamente al desplegar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.releases.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de versiones desplegadas y notas (`releases`) con `total`.
- **Pantallas:** PAN-PLA-20 (Releases y feature flags).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1924 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-48)

<a id="API-PLA-48-b"></a>
#### API-PLA-48-b · `POST /api/platform/releases`

- **Qué hace:** Releases. Da de alta un registro de versiones desplegadas y notas (`releases`).
- **Para qué sirve:** RF-PLA-152: Notas de versión (“Lo nuevo”) por release, con claves de diccionario, publicadas automáticamente al desplegar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.releases.publicar`.
- **Recibe:** los datos de versiones desplegadas y notas (`releases`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de versiones desplegadas y notas (`releases`).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1924 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-48-b)

<a id="API-PLA-48-c"></a>
#### API-PLA-48-c · `POST /api/platform/releases/{version}/promote`

- **Qué hace:** Releases. Promueve un registro de `promote`.
- **Para qué sirve:** RF-PLA-152: Notas de versión (“Lo nuevo”) por release, con claves de diccionario, publicadas automáticamente al desplegar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.releases.publicar`.
- **Recibe:** en la ruta `version`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1924 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-48-c)

<a id="API-PLA-48-d"></a>
#### API-PLA-48-d · `POST /api/platform/releases/{version}/rollback`

- **Qué hace:** Releases. Deshace (rollback) un registro de `rollback`.
- **Para qué sirve:** RF-PLA-152: Notas de versión (“Lo nuevo”) por release, con claves de diccionario, publicadas automáticamente al desplegar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.releases.publicar`.
- **Recibe:** en la ruta `version`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1924 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-48-d)

<a id="API-PLA-49"></a>
#### API-PLA-49 · `GET /api/platform/feature-flags`

- **Qué hace:** Flags. Lista, con filtros y paginación, los registros de banderas funcionales y de UI (`featureFlags`).
- **Para qué sirve:** RF-PLA-149: Anillos de actualización (interno, piloto, general) y feature flags por tenant para habilitar gradualmente funcionalidades; todas las cooperativas corren la misma versión de código. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.flags.editar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de banderas funcionales y de UI (`featureFlags`) con `total`.
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1925 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-49)

<a id="API-PLA-49-b"></a>
#### API-PLA-49-b · `GET /api/platform/feature-flags/{key}`

- **Qué hace:** Flags. Obtiene el detalle de un registro de banderas funcionales y de UI (`featureFlags`).
- **Para qué sirve:** RF-PLA-149: Anillos de actualización (interno, piloto, general) y feature flags por tenant para habilitar gradualmente funcionalidades; todas las cooperativas corren la misma versión de código. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.flags.editar`.
- **Recibe:** en la ruta `key`.
- **Devuelve:** 200: el registro de banderas funcionales y de UI (`featureFlags`).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1925 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-49-b)

<a id="API-PLA-49-c"></a>
#### API-PLA-49-c · `PUT /api/platform/feature-flags/{key}`

- **Qué hace:** Flags. Reemplaza o configura un registro de banderas funcionales y de UI (`featureFlags`).
- **Para qué sirve:** RF-PLA-149: Anillos de actualización (interno, piloto, general) y feature flags por tenant para habilitar gradualmente funcionalidades; todas las cooperativas corren la misma versión de código. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.flags.editar`.
- **Recibe:** en la ruta `key`; los datos de banderas funcionales y de UI (`featureFlags`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de banderas funcionales y de UI (`featureFlags`).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1925 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-49-c)

<a id="API-PLA-50"></a>
#### API-PLA-50 · `GET /api/platform/system/modules`

- **Qué hace:** Inventario técnico. Consulta `modules`.
- **Para qué sirve:** RF-PLA-048: Distinguir tres dimensiones independientes: disponibilidad técnica (estado del tenant y salud), situación comercial SaaS (contrato) y prestación al socio (servicios del tenant, M02). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.salud.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PLA-25 (Inventario técnico).
- **Ola:** O0 · **Fuente:** T01 §11. API, línea 1926 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-50)

<a id="API-PLA-50-b"></a>
#### API-PLA-50-b · `GET /api/platform/system/routes`

- **Qué hace:** Inventario técnico. Consulta `routes`.
- **Para qué sirve:** RF-PLA-048: Distinguir tres dimensiones independientes: disponibilidad técnica (estado del tenant y salud), situación comercial SaaS (contrato) y prestación al socio (servicios del tenant, M02). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.salud.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PLA-25 (Inventario técnico).
- **Ola:** O0 · **Fuente:** T01 §11. API, línea 1926 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-50-b)

<a id="API-PLA-50-c"></a>
#### API-PLA-50-c · `GET /api/platform/system/events`

- **Qué hace:** Inventario técnico. Lista, con filtros y paginación, los registros de outbox transaccional; TTL tras publicar (`outboxEvents`).
- **Para qué sirve:** RF-PLA-048: Distinguir tres dimensiones independientes: disponibilidad técnica (estado del tenant y salud), situación comercial SaaS (contrato) y prestación al socio (servicios del tenant, M02). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.salud.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de outbox transaccional; TTL tras publicar (`outboxEvents`) con `total`.
- **Pantallas:** PAN-PLA-25 (Inventario técnico).
- **Ola:** O0 · **Fuente:** T01 §11. API, línea 1926 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-50-c)

<a id="API-PLA-50-d"></a>
#### API-PLA-50-d · `GET /api/platform/system/jobs`

- **Qué hace:** Inventario técnico. Consulta `jobs`.
- **Para qué sirve:** RF-PLA-048: Distinguir tres dimensiones independientes: disponibilidad técnica (estado del tenant y salud), situación comercial SaaS (contrato) y prestación al socio (servicios del tenant, M02). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.salud.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PLA-25 (Inventario técnico).
- **Ola:** O0 · **Fuente:** T01 §11. API, línea 1926 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-50-d)

<a id="API-PLA-51"></a>
#### API-PLA-51 · `POST /api/platform/tenants/{id}/exports`

- **Qué hace:** Exportación de salida/legal. Da de alta un registro de exportaciones completas del tenant (`tenantExports`).
- **Para qué sirve:** RF-PLA-160: Exportación de auditoría y registros de acceso del tenant como parte de la salida. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.tenants.editar`.
- **Recibe:** en la ruta `id`; los datos de exportaciones completas del tenant (`tenantExports`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de exportaciones completas del tenant (`tenantExports`).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1927 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-51)

<a id="API-PLA-52"></a>
#### API-PLA-52 · `GET /api/admin/pla/subscription`

- **Qué hace:** Mi suscripción (proyección sin datos internos) Consulta `subscription`.
- **Para qué sirve:** RF-PLA-009: Outbox de eventos: todo evento de dominio se graba en outboxEvents en la misma transacción; un relay lo entrega a los suscriptores registrados vía BullMQ; los consumidores son idempotentes (inboxReceipts). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `pla.miSuscripcion.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PLA-15 (Mi suscripción).
- **Ola:** O0 · **Fuente:** T01 §11. API, línea 1928 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-52)

<a id="API-PLA-53"></a>
#### API-PLA-53 · `GET /api/admin/pla/enablement`

- **Qué hace:** Estado y checklists propios. Consulta `enablement`.
- **Para qué sirve:** RF-PLA-055: Tablero de habilitación del tenant (lado cooperativa): estado del tenant, checklist por capacidad, pendientes y responsables. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `pla.habilitacion.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PLA-16 (Habilitación de la cooperativa).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1929 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-53)

<a id="API-PLA-54"></a>
#### API-PLA-54 · `POST /api/admin/pla/enablement/{capability}/items/{code}`

- **Qué hace:** Verificar ítem manual propio. Registra un nuevo elemento u operación en `items`.
- **Para qué sirve:** RF-PLA-046: Checklists de habilitación por capacidad (§9.2): identidad, servicio, tarifas, emisión, pagos, usuarios, contactos, saldos iniciales, comunicaciones, landing, legales; ítems automáticos (provistos por cada módulo) y manuales (con… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `pla.habilitacion.verificar`.
- **Recibe:** en la ruta `capability`, `code`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1930 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-54)

<a id="API-PLA-55"></a>
#### API-PLA-55 · `GET /api/admin/pla/support-cases`

- **Qué hace:** Casos propios. Lista, con filtros y paginación, los registros de casos de soporte del tenant (`supportCases`).
- **Para qué sirve:** RF-PLA-040: El tenant PLATFORM puede usar los módulos funcionales del propio sistema para su gestión (facturación del SaaS, CRM de soporte), como cualquier tenant y con el mismo aislamiento. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `pla.soporte.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de casos de soporte del tenant (`supportCases`) con `total`.
- **Pantallas:** PAN-PLA-17 (Casos de soporte de plataforma), PAN-PLA-21 (Bandeja de soporte de plataforma).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1931 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-55)

<a id="API-PLA-55-b"></a>
#### API-PLA-55-b · `POST /api/admin/pla/support-cases`

- **Qué hace:** Casos propios. Da de alta un registro de casos de soporte del tenant (`supportCases`).
- **Para qué sirve:** RF-PLA-040: El tenant PLATFORM puede usar los módulos funcionales del propio sistema para su gestión (facturación del SaaS, CRM de soporte), como cualquier tenant y con el mismo aislamiento. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `pla.soporte.crear`.
- **Recibe:** los datos de casos de soporte del tenant (`supportCases`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de casos de soporte del tenant (`supportCases`).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1931 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-55-b)

<a id="API-PLA-56"></a>
#### API-PLA-56 · `POST /api/admin/pla/support-cases/{id}/messages`

- **Qué hace:** Interacción. Agrega un elemento («messages») a un registro de casos de soporte del tenant (`supportCases`).
- **Para qué sirve:** RF-PLA-130: Separar trabajos pesados del uso interactivo: el API no ejecuta procesos batch; los workers batch corren en réplicas separadas de los integration y notifications. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `pla.soporte.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1932 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-56)

<a id="API-PLA-56-b"></a>
#### API-PLA-56-b · `POST /api/admin/pla/support-cases/{id}/reopen`

- **Qué hace:** Interacción. Reabre un registro de casos de soporte del tenant (`supportCases`).
- **Para qué sirve:** RF-PLA-130: Separar trabajos pesados del uso interactivo: el API no ejecuta procesos batch; los workers batch corren en réplicas separadas de los integration y notifications. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `pla.soporte.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1932 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-56-b)

<a id="API-PLA-56-c"></a>
#### API-PLA-56-c · `POST /api/admin/pla/support-cases/{id}/close`

- **Qué hace:** Interacción. Cierra un registro de casos de soporte del tenant (`supportCases`).
- **Para qué sirve:** RF-PLA-130: Separar trabajos pesados del uso interactivo: el API no ejecuta procesos batch; los workers batch corren en réplicas separadas de los integration y notifications. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `pla.soporte.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1932 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-56-c)

<a id="API-PLA-56-d"></a>
#### API-PLA-56-d · `POST /api/admin/pla/support-cases/{id}/survey`

- **Qué hace:** Interacción. Registra «survey» sobre un registro de casos de soporte del tenant (`supportCases`).
- **Para qué sirve:** RF-PLA-130: Separar trabajos pesados del uso interactivo: el API no ejecuta procesos batch; los workers batch corren en réplicas separadas de los integration y notifications. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `pla.soporte.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1932 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-56-d)

<a id="API-PLA-57"></a>
#### API-PLA-57 · `GET /api/admin/pla/support-grants`

- **Qué hace:** Accesos a mi tenant y sesiones. Consulta `support-grants`.
- **Para qué sirve:** RF-PLA-104: El tenant consulta todas las intervenciones de soporte (grants, sesiones, acciones) y puede revocar un grant activo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `pla.soporte.accesos.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PLA-08 (Accesos temporales), PAN-PLA-18 (Accesos de soporte a mi cooperativa).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1933 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-57)

<a id="API-PLA-58"></a>
#### API-PLA-58 · `POST /api/admin/pla/support-grants/{id}/approve`

- **Qué hace:** Decisión del tenant. Aprueba un registro de `approve`.
- **Para qué sirve:** RF-PLA-101: Acceso temporal de soporte: solicitud vinculada a un caso, alcance mínimo (módulos/capabilities/entidades), modo (observar, operar, configurar), justificación, aprobación cuando corresponda, vencimiento, registro y revocación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `pla.soporte.accesos.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1934 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-58)

<a id="API-PLA-58-b"></a>
#### API-PLA-58-b · `POST /api/admin/pla/support-grants/{id}/reject`

- **Qué hace:** Decisión del tenant. Rechaza un registro de `reject`.
- **Para qué sirve:** RF-PLA-101: Acceso temporal de soporte: solicitud vinculada a un caso, alcance mínimo (módulos/capabilities/entidades), modo (observar, operar, configurar), justificación, aprobación cuando corresponda, vencimiento, registro y revocación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `pla.soporte.accesos.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1934 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-58-b)

<a id="API-PLA-58-c"></a>
#### API-PLA-58-c · `POST /api/admin/pla/support-grants/{id}/revoke`

- **Qué hace:** Decisión del tenant. Revoca un registro de `revoke`.
- **Para qué sirve:** RF-PLA-101: Acceso temporal de soporte: solicitud vinculada a un caso, alcance mínimo (módulos/capabilities/entidades), modo (observar, operar, configurar), justificación, aprobación cuando corresponda, vencimiento, registro y revocación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `pla.soporte.accesos.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1934 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-58-c)

<a id="API-PLA-59"></a>
#### API-PLA-59 · `GET /api/admin/pla/exports`

- **Qué hace:** Exportación completa. Lista, con filtros y paginación, los registros de exportaciones completas del tenant (`tenantExports`).
- **Para qué sirve:** RF-PLA-027: Aislamiento en exportaciones (XLSX/CSV/PDF/ZIP): se generan como job con tenantId, se guardan bajo el prefijo del tenant y solo las descarga el solicitante o quien tenga permiso. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `pla.exportacion.solicitar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de exportaciones completas del tenant (`tenantExports`) con `total`.
- **Pantallas:** PAN-PLA-23 (Exportación completa de datos).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1935 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-59)

<a id="API-PLA-59-b"></a>
#### API-PLA-59-b · `POST /api/admin/pla/exports`

- **Qué hace:** Exportación completa. Da de alta un registro de exportaciones completas del tenant (`tenantExports`).
- **Para qué sirve:** RF-PLA-027: Aislamiento en exportaciones (XLSX/CSV/PDF/ZIP): se generan como job con tenantId, se guardan bajo el prefijo del tenant y solo las descarga el solicitante o quien tenga permiso. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `pla.exportacion.solicitar`.
- **Recibe:** los datos de exportaciones completas del tenant (`tenantExports`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de exportaciones completas del tenant (`tenantExports`).
- **Pantallas:** PAN-PLA-23 (Exportación completa de datos).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1935 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-59-b)

<a id="API-PLA-60"></a>
#### API-PLA-60 · `GET /api/admin/pla/release-notes`

- **Qué hace:** Lo nuevo y avisos. Consulta `release-notes`.
- **Para qué sirve:** RF-PLA-108: Novedades del proveedor (“Lo nuevo”, notas de versión, avisos de mantenimiento) visibles en el admin del tenant, reemplazando RSS/encuestas/adjuntos del proveedor de ProCoop. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `pla.novedadesPlataforma.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PLA-19 (Lo nuevo y avisos).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1936 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-60)

<a id="API-PLA-61"></a>
#### API-PLA-61 · `GET /api/admin/pla/status`

- **Qué hace:** Estado del tenant (banda, suspensión, mantenimiento) Consulta `status`.
- **Para qué sirve:** RF-PLA-050: Reactivación desde Suspendido a Operativo, reanudando jobs pausados sin ejecutar “recuperaciones” duplicadas (recalcula desde el estado actual). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `pla.estado.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1937 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-61)

<a id="API-PLA-62"></a>
#### API-PLA-62 · `GET /api/files/{id}/url`

- **Qué hace:** URL firmada de descarga. Consulta «url» de un registro de `url`.
- **Para qué sirve:** RF-PLA-062: Un borrador de alta descartado no deja tenant ni usuarios creados; los archivos subidos se eliminan por job. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `pla.archivos.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T01 §11. API, línea 1938 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-62)

<a id="API-PLA-63"></a>
#### API-PLA-63 · `POST /api/files/uploads`

- **Qué hace:** URL firmada de subida y confirmación. Registra un nuevo elemento u operación en `uploads`.
- **Para qué sirve:** RF-PLA-025: Aislamiento en archivos: claves de objeto tenants/<tenantId>/<modulo>/...; metadatos en storedFiles con tenantId; la URL firmada solo se emite tras verificar tenant y permiso sobre el objeto dueño. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `pla.archivos.subir`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T01 §11. API, línea 1939 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-63)

<a id="API-PLA-63-b"></a>
#### API-PLA-63-b · `POST /api/files/uploads/{id}/complete`

- **Qué hace:** URL firmada de subida y confirmación. Completa un registro de `complete`.
- **Para qué sirve:** RF-PLA-025: Aislamiento en archivos: claves de objeto tenants/<tenantId>/<modulo>/...; metadatos en storedFiles con tenantId; la URL firmada solo se emite tras verificar tenant y permiso sobre el objeto dueño. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `pla.archivos.subir`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T01 §11. API, línea 1939 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-63-b)

<a id="API-PLA-65"></a>
#### API-PLA-65 · `GET /api/public/platform/status`

- **Qué hace:** Estado de servicio (PAN-PLA-24) Consulta `status`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T01 §11. API, línea 1941 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-65)

<a id="API-PLA-66"></a>
#### API-PLA-66 · `GET /health/live`

- **Qué hace:** Salud para el orquestador. Consulta `live`.
- **Para qué sirve:** RF-PLA-139: Endpoints de salud /health/live y /health/ready (Mongo, Redis, almacenamiento) para el orquestador; sin datos sensibles. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Monitoreo e infraestructura; permiso `pla.salud.sondear`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T01 §11. API, línea 1942 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-66)

<a id="API-PLA-66-b"></a>
#### API-PLA-66-b · `GET /health/ready`

- **Qué hace:** Salud para el orquestador. Consulta `ready`.
- **Para qué sirve:** RF-PLA-139: Endpoints de salud /health/live y /health/ready (Mongo, Redis, almacenamiento) para el orquestador; sin datos sensibles. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Monitoreo e infraestructura; permiso `pla.salud.sondear`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T01 §11. API, línea 1942 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-66-b)

<a id="API-PLA-67"></a>
#### API-PLA-67 · `GET /api/me/job-runs/{id}`

- **Qué hace:** Progreso de un job lanzado por el usuario. Obtiene el detalle de un registro de ejecuciones de jobs BullMQ; TTL (`jobRuns`).
- **Para qué sirve:** RF-PLA-140: Salud de jobs: vista por cola y por tenant (en espera, activos, demorados, fallidos, estancados), reintento, cancelación, pausa de cola; jobRuns con progreso visible también al usuario que lanzó el job. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `pla.misProcesos.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de ejecuciones de jobs BullMQ; TTL (`jobRuns`).
- **Ola:** O0 · **Fuente:** T01 §11. API, línea 1943 · [Ver en Swagger](../18-swagger/index.html?api=t01-pla#/API/API-PLA-67)
