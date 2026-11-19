# Catálogo de endpoints · T06 · Integraciones externas: marco común de conectores y fichas

Parte del [catálogo de endpoints](../18-catalogo-endpoints.md) (artefacto 7.1). Generado el 05-11-2026 con `_trabajo/gen_18_catalogo_endpoints.py` a partir de `18-openapi/`; no se edita a mano.

## Para qué sirve esta API

Definir una sola arquitectura de integración para todo GoodApps Cooperativas y la ficha completa de cada integración externa que el sistema necesita para reemplazar a ProCoop y cumplir la BASE. El marco común resuelve, una vez y para todos los conectores:

1. Catálogo de proveedores y conector por tipo con capacidades declaradas.
2. Conexión por tenant con configuración propia, alcance y modo prueba / producción.
3. Bóveda de credenciales cifrada por tenant, con rotación, vencimientos y auditoría de uso.
4. Certificados X.509 con generación de CSR, vencimiento y alertas escalonadas.
5. Ejecución confiable: outbox + cola BullMQ con reintentos, backoff, timeouts, idempotencia, circuit breaker, límites de tasa, prioridades y bandeja de operaciones detenidas.
6. Bitácora de mensajes con petición y respuesta sin secretos.
7. Webhooks entrantes firmados, con bandeja de entrada durable, deduplicación y reconsulta.
8. Intercambio de archivos por layouts declarativos (en lugar de las ~504 clases de ProCoop).
9. Conciliación por conector, monitoreo y alertas, contingencia y reemplazo manual.
10. Agente local para hardware (turnero, impresoras, lectores, balanza).

Detalle completo en el anexo T06, sección 1. Contrato navegable: [Swagger](../18-swagger/index.html?api=t06-int).

| Dato | Valor |
|---|---|
| Endpoints | 74 |
| Por método | GET 28, PATCH 1, POST 42, PUT 3 |
| Grupos funcionales | 1 |
| Con requisito citado en el anexo | 0 |
| Con requisito inferido (a confirmar) | 63 |
| Sin requisito identificable | 11 |

## Grupos funcionales

| Grupo | Endpoints | Qué agrupa (primeros endpoints) |
|---|---|---|
| [API](#grupo-1) | 74 | Listar catálogo.; Alta/edición de proveedor.; Proveedores disponibles para la licencia del tenant.… |

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

74 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-INT-01](#API-INT-01) | GET | `/api/platform/int/providers` | Listar catálogo. |
| [API-INT-02](#API-INT-02) | POST | `/api/platform/int/providers` | Alta/edición de proveedor. |
| [API-INT-02-b](#API-INT-02-b) | PUT | `/api/platform/int/providers/{code}` | Alta/edición de proveedor. |
| [API-INT-03](#API-INT-03) | GET | `/api/admin/int/catalog` | Proveedores disponibles para la licencia del tenant. |
| [API-INT-04](#API-INT-04) | GET | `/api/admin/int/connections` | Listar conexiones. |
| [API-INT-05](#API-INT-05) | POST | `/api/admin/int/connections` | Crear conexión (borrador) |
| [API-INT-06](#API-INT-06) | GET | `/api/admin/int/connections/{id}` | Detalle (sin secretos) |
| [API-INT-07](#API-INT-07) | PATCH | `/api/admin/int/connections/{id}` | Editar configuración (versión optimista) |
| [API-INT-08](#API-INT-08) | POST | `/api/admin/int/connections/{id}/test` | Probar conexión. |
| [API-INT-09](#API-INT-09) | POST | `/api/admin/int/connections/{id}/activate` | Activar (puede generar solicitud de aprobación) |
| [API-INT-10](#API-INT-10) | POST | `/api/admin/int/connections/{id}/pause` | Pausar/reanudar/suspender. |
| [API-INT-10-b](#API-INT-10-b) | POST | `/api/admin/int/connections/{id}/resume` | Pausar/reanudar/suspender. |
| [API-INT-10-c](#API-INT-10-c) | POST | `/api/admin/int/connections/{id}/suspend` | Pausar/reanudar/suspender. |
| [API-INT-11](#API-INT-11) | POST | `/api/admin/int/connections/{id}/mode` | Solicitar cambio de modo. |
| [API-INT-12](#API-INT-12) | POST | `/api/admin/int/connections/{id}/copy` | Copiar configuración a tenant autorizado (sin secretos) |
| [API-INT-13](#API-INT-13) | GET | `/api/admin/int/connections/{id}/secrets` | Metadatos de credenciales. |
| [API-INT-14](#API-INT-14) | PUT | `/api/admin/int/connections/{id}/secrets/{name}` | Cargar nueva versión (solo escritura; el cuerpo nunca se registra) |
| [API-INT-15](#API-INT-15) | POST | `/api/admin/int/connections/{id}/secrets/{name}/rotate` | Activar versión pendiente / revocar. |
| [API-INT-15-b](#API-INT-15-b) | POST | `/api/admin/int/connections/{id}/secrets/{name}/revoke` | Activar versión pendiente / revocar. |
| [API-INT-16](#API-INT-16) | GET | `/api/admin/int/secrets/access-log` | Accesos a secretos. |
| [API-INT-17](#API-INT-17) | POST | `/api/admin/int/certificates/csr` | Generar par de claves y CSR. |
| [API-INT-18](#API-INT-18) | POST | `/api/admin/int/certificates/{id}/upload` | Subir certificado emitido y validar. |
| [API-INT-19](#API-INT-19) | POST | `/api/admin/int/certificates/pfx` | Importar PFX/P12 con contraseña. |
| [API-INT-20](#API-INT-20) | GET | `/api/admin/int/certificates` | Listar certificados. |
| [API-INT-21](#API-INT-21) | POST | `/api/admin/int/certificates/{id}/activate` | Activar como vigente. |
| [API-INT-22](#API-INT-22) | GET | `/api/admin/int/operations` | Listar/detallar operaciones. |
| [API-INT-22-b](#API-INT-22-b) | GET | `/api/admin/int/operations/{id}` | Listar/detallar operaciones. |
| [API-INT-23](#API-INT-23) | POST | `/api/admin/int/operations/{id}/retry` | Reintentar. |
| [API-INT-24](#API-INT-24) | POST | `/api/admin/int/operations/{id}/cancel` | Cancelar. |
| [API-INT-25](#API-INT-25) | POST | `/api/admin/int/operations/{id}/manual-resolution` | Registrar resultado externo con evidencia. |
| [API-INT-26](#API-INT-26) | POST | `/api/admin/int/operations/{id}/manual-resolution/approve` | Aprobar resolución manual. |
| [API-INT-27](#API-INT-27) | POST | `/api/admin/int/operations/bulk-retry` | Reintento masivo por filtro. |
| [API-INT-28](#API-INT-28) | GET | `/api/admin/int/messages` | Bitácora (metadatos) |
| [API-INT-28-b](#API-INT-28-b) | GET | `/api/admin/int/messages/{id}` | Bitácora (metadatos) |
| [API-INT-29](#API-INT-29) | GET | `/api/admin/int/messages/{id}/payload` | Cuerpos saneados (auditado) |
| [API-INT-31](#API-INT-31) | GET | `/api/public/{tenantSlug}/webhooks/{endpointKey}` | Desafío de verificación (Meta) |
| [API-INT-30](#API-INT-30) | POST | `/api/public/{tenantSlug}/webhooks/{endpointKey}` | Recepción de webhooks. |
| [API-INT-32](#API-INT-32) | GET | `/api/admin/int/webhooks` | Bandeja y reproceso. |
| [API-INT-32-b](#API-INT-32-b) | POST | `/api/admin/int/webhooks` | Bandeja y reproceso. |
| [API-INT-32-c](#API-INT-32-c) | POST | `/api/admin/int/webhooks/{id}/reprocess` | Bandeja y reproceso. |
| [API-INT-33](#API-INT-33) | POST | `/api/admin/int/connections/{id}/webhook/rotate` | Rotar endpointKey/secreto. |
| [API-INT-34](#API-INT-34) | GET | `/api/admin/int/files` | Intercambios de archivos. |
| [API-INT-34-b](#API-INT-34-b) | GET | `/api/admin/int/files/{id}` | Intercambios de archivos. |
| [API-INT-35](#API-INT-35) | POST | `/api/admin/int/files/{id}/approve` | Aprobar y entregar saliente. |
| [API-INT-35-b](#API-INT-35-b) | POST | `/api/admin/int/files/{id}/deliver` | Aprobar y entregar saliente. |
| [API-INT-36](#API-INT-36) | GET | `/api/admin/int/files/{id}/download` | URL firmada de descarga. |
| [API-INT-37](#API-INT-37) | POST | `/api/admin/int/files/inbound` | Carga entrante en 3 pasos. |
| [API-INT-37-b](#API-INT-37-b) | POST | `/api/admin/int/files/inbound/{id}/preview` | Carga entrante en 3 pasos. |
| [API-INT-37-c](#API-INT-37-c) | POST | `/api/admin/int/files/inbound/{id}/confirm` | Carga entrante en 3 pasos. |
| [API-INT-38](#API-INT-38) | GET | `/api/admin/int/layouts` | Ver layouts y probar con archivo. |
| [API-INT-38-b](#API-INT-38-b) | POST | `/api/admin/int/layouts` | Ver layouts y probar con archivo. |
| [API-INT-38-c](#API-INT-38-c) | POST | `/api/admin/int/layouts/{code}/test` | Ver layouts y probar con archivo. |
| [API-INT-39](#API-INT-39) | GET | `/api/admin/int/reconciliations` | Conciliaciones. |
| [API-INT-39-b](#API-INT-39-b) | GET | `/api/admin/int/reconciliations/{id}` | Conciliaciones. |
| [API-INT-40](#API-INT-40) | POST | `/api/admin/int/reconciliations/{id}/differences/{diffId}` | Resolver diferencia / cerrar. |
| [API-INT-40-b](#API-INT-40-b) | POST | `/api/admin/int/reconciliations/{id}/differences/{diffId}/close` | Resolver diferencia / cerrar. |
| [API-INT-41](#API-INT-41) | GET | `/api/admin/int/alerts` | Alertas. |
| [API-INT-41-b](#API-INT-41-b) | POST | `/api/admin/int/alerts` | Alertas. |
| [API-INT-41-c](#API-INT-41-c) | POST | `/api/admin/int/alerts/{id}/ack` | Alertas. |
| [API-INT-41-d](#API-INT-41-d) | POST | `/api/admin/int/alerts/{id}/resolve` | Alertas. |
| [API-INT-41-e](#API-INT-41-e) | POST | `/api/admin/int/alerts/{id}/mute` | Alertas. |
| [API-INT-42](#API-INT-42) | POST | `/api/admin/int/contingencies` | Declarar/cerrar contingencia. |
| [API-INT-42-b](#API-INT-42-b) | POST | `/api/admin/int/contingencies/{id}/close` | Declarar/cerrar contingencia. |
| [API-INT-43](#API-INT-43) | GET | `/api/admin/int/dashboard` | Tableros. |
| [API-INT-43-b](#API-INT-43-b) | GET | `/api/platform/int/dashboard` | Tableros. |
| [API-INT-44](#API-INT-44) | GET | `/api/admin/int/usage` | Consumo y cuotas. |
| [API-INT-45](#API-INT-45) | GET | `/api/admin/int/external-references` | Buscar identificador externo. |
| [API-INT-46](#API-INT-46) | POST | `/api/admin/int/agents` | Emparejar/revocar agente local. |
| [API-INT-46-b](#API-INT-46-b) | POST | `/api/admin/int/agents/{id}/revoke` | Emparejar/revocar agente local. |
| [API-INT-47](#API-INT-47) | GET | `/api/v1/ext/agents/connect` | Canal del agente local (latido, comandos, resultados) |
| [API-INT-48](#API-INT-48) | POST | `/api/v1/ext/agents/pair` | Emparejamiento inicial del agente. |
| [API-INT-49](#API-INT-49) | GET | `/api/admin/int/ai-usage` | Uso de IA. |
| [API-INT-50](#API-INT-50) | GET | `/api/admin/int/connections/{id}/schedules` | Calendario de ejecuciones. |
| [API-INT-50-b](#API-INT-50-b) | PUT | `/api/admin/int/connections/{id}/schedules` | Calendario de ejecuciones. |

<a id="API-INT-01"></a>
#### API-INT-01 · `GET /api/platform/int/providers`

- **Qué hace:** Listar catálogo. Lista, con filtros y paginación, los registros de catálogo de proveedores y adaptadores (`integrationProviders`).
- **Para qué sirve:** RF-INT-001: Catálogo de plataforma de proveedores (integrationProviders): código, nombre, tipo de conector, capacidades, protocolos, ambientes (test/production) con URLs base, esquema de configuración y de credenciales (solo nombres y tipo)… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `int.proveedores.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de catálogo de proveedores y adaptadores (`integrationProviders`) con `total`.
- **Ola:** O0 · **Fuente:** T06 §11. API, línea 1061 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-01)

<a id="API-INT-02"></a>
#### API-INT-02 · `POST /api/platform/int/providers`

- **Qué hace:** Alta/edición de proveedor. Da de alta un registro de catálogo de proveedores y adaptadores (`integrationProviders`).
- **Para qué sirve:** RF-INT-001: Catálogo de plataforma de proveedores (integrationProviders): código, nombre, tipo de conector, capacidades, protocolos, ambientes (test/production) con URLs base, esquema de configuración y de credenciales (solo nombres y tipo)… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `int.proveedores.configurar`.
- **Recibe:** los datos de catálogo de proveedores y adaptadores (`integrationProviders`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de catálogo de proveedores y adaptadores (`integrationProviders`).
- **Pantallas:** PAN-INT-01 (Catálogo de proveedores y versiones de adaptadores), PAN-INT-13 (Layouts).
- **Ola:** O0 · **Fuente:** T06 §11. API, línea 1062 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-02)

<a id="API-INT-02-b"></a>
#### API-INT-02-b · `PUT /api/platform/int/providers/{code}`

- **Qué hace:** Alta/edición de proveedor. Reemplaza o configura un registro de catálogo de proveedores y adaptadores (`integrationProviders`).
- **Para qué sirve:** RF-INT-001: Catálogo de plataforma de proveedores (integrationProviders): código, nombre, tipo de conector, capacidades, protocolos, ambientes (test/production) con URLs base, esquema de configuración y de credenciales (solo nombres y tipo)… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `int.proveedores.configurar`.
- **Recibe:** en la ruta `code`; los datos de catálogo de proveedores y adaptadores (`integrationProviders`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de catálogo de proveedores y adaptadores (`integrationProviders`).
- **Pantallas:** PAN-INT-01 (Catálogo de proveedores y versiones de adaptadores), PAN-INT-13 (Layouts).
- **Ola:** O0 · **Fuente:** T06 §11. API, línea 1062 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-02-b)

<a id="API-INT-03"></a>
#### API-INT-03 · `GET /api/admin/int/catalog`

- **Qué hace:** Proveedores disponibles para la licencia del tenant. Consulta `catalog`.
- **Para qué sirve:** RF-INT-003: Un conector solo se ofrece si la licencia del tenant lo incluye (capability de plataforma, T01) y el servicio asociado está habilitado (BASE §66). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.conexiones.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INT-02 (Ver integraciones disponibles para la licencia del tenant y su ficha), PAN-INT-03 (Alta y gestión de conexiones).
- **Ola:** O1 · **Fuente:** T06 §11. API, línea 1063 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-03)

<a id="API-INT-04"></a>
#### API-INT-04 · `GET /api/admin/int/connections`

- **Qué hace:** Listar conexiones. Lista, con filtros y paginación, los registros de conexión del tenant con un proveedor (`integrationConnections`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.conexiones.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de conexión del tenant con un proveedor (`integrationConnections`) con `total`.
- **Pantallas:** PAN-INT-02 (Ver integraciones disponibles para la licencia del tenant y su ficha), PAN-INT-03 (Alta y gestión de conexiones).
- **Ola:** O1 · **Fuente:** T06 §11. API, línea 1064 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-04)

<a id="API-INT-05"></a>
#### API-INT-05 · `POST /api/admin/int/connections`

- **Qué hace:** Crear conexión (borrador) Da de alta un registro de conexión del tenant con un proveedor (`integrationConnections`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.conexiones.crear`.
- **Recibe:** los datos de conexión del tenant con un proveedor (`integrationConnections`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de conexión del tenant con un proveedor (`integrationConnections`).
- **Ola:** O1 · **Fuente:** T06 §11. API, línea 1065 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-05)

<a id="API-INT-06"></a>
#### API-INT-06 · `GET /api/admin/int/connections/{id}`

- **Qué hace:** Detalle (sin secretos) Obtiene el detalle de un registro de conexión del tenant con un proveedor (`integrationConnections`).
- **Para qué sirve:** RF-INT-072: Tablero de plataforma (todas las conexiones de todos los tenants, sin secretos) y tablero del tenant. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.conexiones.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de conexión del tenant con un proveedor (`integrationConnections`).
- **Pantallas:** PAN-INT-02 (Ver integraciones disponibles para la licencia del tenant y su ficha), PAN-INT-03 (Alta y gestión de conexiones).
- **Ola:** O1 · **Fuente:** T06 §11. API, línea 1066 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-06)

<a id="API-INT-07"></a>
#### API-INT-07 · `PATCH /api/admin/int/connections/{id}`

- **Qué hace:** Editar configuración (versión optimista) Modifica algunos campos de un registro de conexión del tenant con un proveedor (`integrationConnections`) (solo los enviados).
- **Para qué sirve:** RF-INT-007: Cambios de configuración versionados con vigencia y auditoría (antes/después sin secretos). Cambios en conexiones production de tipo fiscal, pagos, débito o red requieren aprobación (T11). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.conexiones.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de conexión del tenant con un proveedor (`integrationConnections`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de conexión del tenant con un proveedor (`integrationConnections`).
- **Pantallas:** PAN-INT-03 (Alta y gestión de conexiones).
- **Ola:** O1 · **Fuente:** T06 §11. API, línea 1067 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-07)

<a id="API-INT-08"></a>
#### API-INT-08 · `POST /api/admin/int/connections/{id}/test`

- **Qué hace:** Probar conexión. Prueba un registro de conexión del tenant con un proveedor (`integrationConnections`).
- **Para qué sirve:** RF-INT-006: "Probar conexión" por conexión: ejecuta la operación de salud del proveedor (ej. FEDummy, Healthcheck ProvinciaNet, login OAuth, GET account/balances) y registra resultado en bitácora. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.conexiones.probar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INT-03 (Alta y gestión de conexiones).
- **Ola:** O1 · **Fuente:** T06 §11. API, línea 1068 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-08)

<a id="API-INT-09"></a>
#### API-INT-09 · `POST /api/admin/int/connections/{id}/activate`

- **Qué hace:** Activar (puede generar solicitud de aprobación) Activa un registro de conexión del tenant con un proveedor (`integrationConnections`).
- **Para qué sirve:** RF-INT-062: Generación de archivo saliente: previsualización, totales de control, hash, aprobación cuando el tipo lo exige, descarga con URL firmada o entrega SFTP/API; regeneración crea nueva versión, no sobrescribe. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.conexiones.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INT-03 (Alta y gestión de conexiones).
- **Ola:** O1 · **Fuente:** T06 §11. API, línea 1069 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-09)

<a id="API-INT-10"></a>
#### API-INT-10 · `POST /api/admin/int/connections/{id}/pause`

- **Qué hace:** Pausar/reanudar/suspender. Pausa un registro de conexión del tenant con un proveedor (`integrationConnections`).
- **Para qué sirve:** RF-INT-042: Pausar/reanudar manualmente una conexión, una operación tipo o un punto de venta (equivalente a PTOVENTA.PAUSAR). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.conexiones.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INT-03 (Alta y gestión de conexiones).
- **Ola:** O1 · **Fuente:** T06 §11. API, línea 1070 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-10)

<a id="API-INT-10-b"></a>
#### API-INT-10-b · `POST /api/admin/int/connections/{id}/resume`

- **Qué hace:** Pausar/reanudar/suspender. Reanuda un registro de conexión del tenant con un proveedor (`integrationConnections`).
- **Para qué sirve:** RF-INT-042: Pausar/reanudar manualmente una conexión, una operación tipo o un punto de venta (equivalente a PTOVENTA.PAUSAR). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.conexiones.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INT-03 (Alta y gestión de conexiones).
- **Ola:** O1 · **Fuente:** T06 §11. API, línea 1070 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-10-b)

<a id="API-INT-10-c"></a>
#### API-INT-10-c · `POST /api/admin/int/connections/{id}/suspend`

- **Qué hace:** Pausar/reanudar/suspender. Suspende un registro de conexión del tenant con un proveedor (`integrationConnections`).
- **Para qué sirve:** RF-INT-042: Pausar/reanudar manualmente una conexión, una operación tipo o un punto de venta (equivalente a PTOVENTA.PAUSAR). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.conexiones.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INT-03 (Alta y gestión de conexiones).
- **Ola:** O1 · **Fuente:** T06 §11. API, línea 1070 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-10-c)

<a id="API-INT-11"></a>
#### API-INT-11 · `POST /api/admin/int/connections/{id}/mode`

- **Qué hace:** Solicitar cambio de modo. Registra «mode» sobre un registro de conexión del tenant con un proveedor (`integrationConnections`).
- **Para qué sirve:** RF-INT-028: Modo test / production por conexión, con URLs del catálogo; cambio de modo auditado, con aprobación y prueba de conexión obligatoria. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.modo.cambiar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T06 §11. API, línea 1071 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-11)

<a id="API-INT-12"></a>
#### API-INT-12 · `POST /api/admin/int/connections/{id}/copy`

- **Qué hace:** Copiar configuración a tenant autorizado (sin secretos) Copia un registro de conexión del tenant con un proveedor (`integrationConnections`).
- **Para qué sirve:** RF-INT-008: Copiar configuración de una conexión entre tenants autorizados sin secretos, certificados, identificadores externos ni estados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.conexiones.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T06 §11. API, línea 1072 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-12)

<a id="API-INT-13"></a>
#### API-INT-13 · `GET /api/admin/int/connections/{id}/secrets`

- **Qué hace:** Metadatos de credenciales. Lista, con filtros y paginación, los registros de bóveda: secretos cifrados por sobre con KMS (`integrationSecrets`).
- **Para qué sirve:** RF-INT-015: Bóveda por tenant con cifrado de sobre (*envelope encryption*): clave de datos por tenant cifrada por una clave maestra en un KMS; el secreto se guarda cifrado (AES-256-GCM) con keyId y versión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.credenciales.gestionar`.
- **Recibe:** en la ruta `id`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de bóveda: secretos cifrados por sobre con KMS (`integrationSecrets`) con `total`.
- **Pantallas:** PAN-INT-06 (Vista consolidada de la bóveda).
- **Ola:** O0 · **Fuente:** T06 §11. API, línea 1073 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-13)

<a id="API-INT-14"></a>
#### API-INT-14 · `PUT /api/admin/int/connections/{id}/secrets/{name}`

- **Qué hace:** Cargar nueva versión (solo escritura; el cuerpo nunca se registra) Reemplaza o configura un registro de bóveda: secretos cifrados por sobre con KMS (`integrationSecrets`).
- **Para qué sirve:** RF-INT-015: Bóveda por tenant con cifrado de sobre (*envelope encryption*): clave de datos por tenant cifrada por una clave maestra en un KMS; el secreto se guarda cifrado (AES-256-GCM) con keyId y versión. · RF-INT-016: Secretos de solo escritura: UI y API devuelven nombre, tipo, huella (HMAC), últimos 4 caracteres cuando el tipo lo permite, fecha de carga, autor, vencimiento y estado. Nunca el valor. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.credenciales.gestionar`.
- **Recibe:** en la ruta `id`, `name`; los datos de bóveda: secretos cifrados por sobre con KMS (`integrationSecrets`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de bóveda: secretos cifrados por sobre con KMS (`integrationSecrets`).
- **Pantallas:** PAN-INT-06 (Vista consolidada de la bóveda).
- **Ola:** O0 · **Fuente:** T06 §11. API, línea 1074 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-14)

<a id="API-INT-15"></a>
#### API-INT-15 · `POST /api/admin/int/connections/{id}/secrets/{name}/rotate`

- **Qué hace:** Activar versión pendiente / revocar. Rota las credenciales de un registro de bóveda: secretos cifrados por sobre con KMS (`integrationSecrets`).
- **Para qué sirve:** RF-INT-015: Bóveda por tenant con cifrado de sobre (*envelope encryption*): clave de datos por tenant cifrada por una clave maestra en un KMS; el secreto se guarda cifrado (AES-256-GCM) con keyId y versión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.credenciales.gestionar`.
- **Recibe:** en la ruta `id`, `name`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INT-06 (Vista consolidada de la bóveda).
- **Ola:** O0 · **Fuente:** T06 §11. API, línea 1075 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-15)

<a id="API-INT-15-b"></a>
#### API-INT-15-b · `POST /api/admin/int/connections/{id}/secrets/{name}/revoke`

- **Qué hace:** Activar versión pendiente / revocar. Revoca un registro de bóveda: secretos cifrados por sobre con KMS (`integrationSecrets`).
- **Para qué sirve:** RF-INT-015: Bóveda por tenant con cifrado de sobre (*envelope encryption*): clave de datos por tenant cifrada por una clave maestra en un KMS; el secreto se guarda cifrado (AES-256-GCM) con keyId y versión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.credenciales.gestionar`.
- **Recibe:** en la ruta `id`, `name`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INT-06 (Vista consolidada de la bóveda).
- **Ola:** O0 · **Fuente:** T06 §11. API, línea 1075 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-15-b)

<a id="API-INT-16"></a>
#### API-INT-16 · `GET /api/admin/int/secrets/access-log`

- **Qué hace:** Accesos a secretos. Consulta bóveda: secretos cifrados por sobre con KMS (`integrationSecrets`).
- **Para qué sirve:** RF-INT-015: Bóveda por tenant con cifrado de sobre (*envelope encryption*): clave de datos por tenant cifrada por una clave maestra en un KMS; el secreto se guarda cifrado (AES-256-GCM) con keyId y versión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.credenciales.gestionar`.
- **Recibe:** nada.
- **Devuelve:** 200: el registro de bóveda: secretos cifrados por sobre con KMS (`integrationSecrets`).
- **Pantallas:** PAN-INT-06 (Vista consolidada de la bóveda).
- **Ola:** O0 · **Fuente:** T06 §11. API, línea 1076 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-16)

<a id="API-INT-17"></a>
#### API-INT-17 · `POST /api/admin/int/certificates/csr`

- **Qué hace:** Generar par de claves y CSR. Registra un nuevo elemento u operación en metadatos de certificados (`integrationCertificates`).
- **Para qué sirve:** RF-INT-024: Generar par de claves (RSA 2048 o superior) y CSR en el servidor con los datos del tenant (CUIT en el *subject*, alias); la clave privada nunca sale de la bóveda. Alternativa: subir PFX/P12 con contraseña. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.certificados.gestionar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INT-07 (Certificados y asistente ARCA).
- **Ola:** O1 · **Fuente:** T06 §11. API, línea 1077 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-17)

<a id="API-INT-18"></a>
#### API-INT-18 · `POST /api/admin/int/certificates/{id}/upload`

- **Qué hace:** Subir certificado emitido y validar. Sube un archivo a un registro de metadatos de certificados (`integrationCertificates`).
- **Para qué sirve:** RF-INT-080: TLS 1.2+ con validación de certificados del servidor siempre activa; no existe opción para desactivarla. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.certificados.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INT-07 (Certificados y asistente ARCA).
- **Ola:** O1 · **Fuente:** T06 §11. API, línea 1078 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-18)

<a id="API-INT-19"></a>
#### API-INT-19 · `POST /api/admin/int/certificates/pfx`

- **Qué hace:** Importar PFX/P12 con contraseña. Registra un nuevo elemento u operación en metadatos de certificados (`integrationCertificates`).
- **Para qué sirve:** RF-INT-024: Generar par de claves (RSA 2048 o superior) y CSR en el servidor con los datos del tenant (CUIT en el *subject*, alias); la clave privada nunca sale de la bóveda. Alternativa: subir PFX/P12 con contraseña. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.certificados.gestionar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INT-07 (Certificados y asistente ARCA).
- **Ola:** O1 · **Fuente:** T06 §11. API, línea 1079 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-19)

<a id="API-INT-20"></a>
#### API-INT-20 · `GET /api/admin/int/certificates`

- **Qué hace:** Listar certificados. Lista, con filtros y paginación, los registros de metadatos de certificados (`integrationCertificates`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.certificados.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de metadatos de certificados (`integrationCertificates`) con `total`.
- **Pantallas:** PAN-INT-07 (Certificados y asistente ARCA).
- **Ola:** O1 · **Fuente:** T06 §11. API, línea 1080 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-20)

<a id="API-INT-21"></a>
#### API-INT-21 · `POST /api/admin/int/certificates/{id}/activate`

- **Qué hace:** Activar como vigente. Activa un registro de metadatos de certificados (`integrationCertificates`).
- **Para qué sirve:** RF-INT-080: TLS 1.2+ con validación de certificados del servidor siempre activa; no existe opción para desactivarla. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.certificados.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INT-07 (Certificados y asistente ARCA).
- **Ola:** O1 · **Fuente:** T06 §11. API, línea 1081 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-21)

<a id="API-INT-22"></a>
#### API-INT-22 · `GET /api/admin/int/operations`

- **Qué hace:** Listar/detallar operaciones. Lista, con filtros y paginación, los registros de bitácora de operaciones con proveedores (`integrationOperations`).
- **Para qué sirve:** RF-INT-051: Búsqueda y exportación de bitácora por conexión, operación, entidad de negocio, estado, fecha y correlación. · RF-INT-006: "Probar conexión" por conexión: ejecuta la operación de salud del proveedor (ej. FEDummy, Healthcheck ProvinciaNet, login OAuth, GET account/balances) y registra resultado en bitácora. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.operaciones.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de bitácora de operaciones con proveedores (`integrationOperations`) con `total`.
- **Pantallas:** PAN-INT-08 (Seguimiento de operaciones), PAN-INT-19 (Búsqueda de identificadores externos).
- **Ola:** O0 · **Fuente:** T06 §11. API, línea 1082 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-22)

<a id="API-INT-22-b"></a>
#### API-INT-22-b · `GET /api/admin/int/operations/{id}`

- **Qué hace:** Listar/detallar operaciones. Obtiene el detalle de un registro de bitácora de operaciones con proveedores (`integrationOperations`).
- **Para qué sirve:** RF-INT-051: Búsqueda y exportación de bitácora por conexión, operación, entidad de negocio, estado, fecha y correlación. · RF-INT-006: "Probar conexión" por conexión: ejecuta la operación de salud del proveedor (ej. FEDummy, Healthcheck ProvinciaNet, login OAuth, GET account/balances) y registra resultado en bitácora. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.operaciones.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de bitácora de operaciones con proveedores (`integrationOperations`).
- **Pantallas:** PAN-INT-08 (Seguimiento de operaciones), PAN-INT-19 (Búsqueda de identificadores externos).
- **Ola:** O0 · **Fuente:** T06 §11. API, línea 1082 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-22-b)

<a id="API-INT-23"></a>
#### API-INT-23 · `POST /api/admin/int/operations/{id}/retry`

- **Qué hace:** Reintentar. Reintenta un registro de bitácora de operaciones con proveedores (`integrationOperations`).
- **Para qué sirve:** RF-INT-051: Búsqueda y exportación de bitácora por conexión, operación, entidad de negocio, estado, fecha y correlación. · RF-INT-006: "Probar conexión" por conexión: ejecuta la operación de salud del proveedor (ej. FEDummy, Healthcheck ProvinciaNet, login OAuth, GET account/balances) y registra resultado en bitácora. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.operaciones.reintentar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INT-09 (Bandeja de operaciones detenidas).
- **Ola:** O0 · **Fuente:** T06 §11. API, línea 1083 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-23)

<a id="API-INT-24"></a>
#### API-INT-24 · `POST /api/admin/int/operations/{id}/cancel`

- **Qué hace:** Cancelar. Cancela un registro de bitácora de operaciones con proveedores (`integrationOperations`).
- **Para qué sirve:** RF-INT-043: Bandeja de operaciones detenidas (fallidas permanentes, inciertas no resueltas, bloqueadas por credencial) con filtros, causa, acción sugerida, reintentar, cancelar y resolver manualmente con evidencia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.operaciones.reintentar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INT-09 (Bandeja de operaciones detenidas).
- **Ola:** O0 · **Fuente:** T06 §11. API, línea 1084 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-24)

<a id="API-INT-25"></a>
#### API-INT-25 · `POST /api/admin/int/operations/{id}/manual-resolution`

- **Qué hace:** Registrar resultado externo con evidencia. Registra «manual-resolution» sobre un registro de bitácora de operaciones con proveedores (`integrationOperations`).
- **Para qué sirve:** RF-INT-075: Reemplazo manual con doble control: un usuario con int.operaciones.resolverManual registra el resultado externo con evidencia adjunta; otro lo aprueba cuando la ficha lo exige; queda marcado manual_resolved y se concilia después. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.operaciones.resolverManual`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INT-09 (Bandeja de operaciones detenidas).
- **Ola:** O0 · **Fuente:** T06 §11. API, línea 1085 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-25)

<a id="API-INT-26"></a>
#### API-INT-26 · `POST /api/admin/int/operations/{id}/manual-resolution/approve`

- **Qué hace:** Aprobar resolución manual. Aprueba sobre bitácora de operaciones con proveedores (`integrationOperations`).
- **Para qué sirve:** RF-INT-075: Reemplazo manual con doble control: un usuario con int.operaciones.resolverManual registra el resultado externo con evidencia adjunta; otro lo aprueba cuando la ficha lo exige; queda marcado manual_resolved y se concilia después. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.operaciones.resolverManual`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INT-09 (Bandeja de operaciones detenidas).
- **Ola:** O0 · **Fuente:** T06 §11. API, línea 1086 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-26)

<a id="API-INT-27"></a>
#### API-INT-27 · `POST /api/admin/int/operations/bulk-retry`

- **Qué hace:** Reintento masivo por filtro. Registra un nuevo elemento u operación en bitácora de operaciones con proveedores (`integrationOperations`).
- **Para qué sirve:** RF-INT-043: Bandeja de operaciones detenidas (fallidas permanentes, inciertas no resueltas, bloqueadas por credencial) con filtros, causa, acción sugerida, reintentar, cancelar y resolver manualmente con evidencia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.operaciones.reintentar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INT-09 (Bandeja de operaciones detenidas).
- **Ola:** O0 · **Fuente:** T06 §11. API, línea 1087 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-27)

<a id="API-INT-28"></a>
#### API-INT-28 · `GET /api/admin/int/messages`

- **Qué hace:** Bitácora (metadatos) Lista, con filtros y paginación, los registros de mensajes saneados de request/response (`integrationMessages`).
- **Para qué sirve:** RF-INT-044: Correlación: correlationId desde la acción del usuario/job hasta operación, mensajes, eventos y auditoría; requestId en errores RFC 9457. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.bitacora.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de mensajes saneados de request/response (`integrationMessages`) con `total`.
- **Pantallas:** PAN-INT-10 (Bitácora de mensajes).
- **Ola:** O0 · **Fuente:** T06 §11. API, línea 1088 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-28)

<a id="API-INT-28-b"></a>
#### API-INT-28-b · `GET /api/admin/int/messages/{id}`

- **Qué hace:** Bitácora (metadatos) Obtiene el detalle de un registro de mensajes saneados de request/response (`integrationMessages`).
- **Para qué sirve:** RF-INT-044: Correlación: correlationId desde la acción del usuario/job hasta operación, mensajes, eventos y auditoría; requestId en errores RFC 9457. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.bitacora.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de mensajes saneados de request/response (`integrationMessages`).
- **Pantallas:** PAN-INT-10 (Bitácora de mensajes).
- **Ola:** O0 · **Fuente:** T06 §11. API, línea 1088 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-28-b)

<a id="API-INT-29"></a>
#### API-INT-29 · `GET /api/admin/int/messages/{id}/payload`

- **Qué hace:** Cuerpos saneados (auditado) Consulta «payload» de un registro de mensajes saneados de request/response (`integrationMessages`).
- **Para qué sirve:** RF-INT-050: Ver cuerpos requiere int.bitacora.verPayload y queda auditado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.bitacora.verPayload`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de mensajes saneados de request/response (`integrationMessages`).
- **Pantallas:** PAN-INT-10 (Bitácora de mensajes).
- **Ola:** O0 · **Fuente:** T06 §11. API, línea 1089 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-29)

<a id="API-INT-31"></a>
#### API-INT-31 · `GET /api/public/{tenantSlug}/webhooks/{endpointKey}`

- **Qué hace:** Desafío de verificación (Meta) Obtiene el detalle de un registro de webhooks recibidos crudos; TTL (`webhookInbox`).
- **Para qué sirve:** RF-INT-058: Webhooks de verificación de suscripción (ej. hub.challenge de Meta) resueltos por el conector. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`, `endpointKey`.
- **Devuelve:** 200: el registro de webhooks recibidos crudos; TTL (`webhookInbox`).
- **Ola:** O1 · **Fuente:** T06 §11. API, línea 1091 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-31)

<a id="API-INT-30"></a>
#### API-INT-30 · `POST /api/public/{tenantSlug}/webhooks/{endpointKey}`

- **Qué hace:** Recepción de webhooks. Registra un nuevo elemento u operación en webhooks recibidos crudos; TTL (`webhookInbox`).
- **Para qué sirve:** RF-INT-063: Recepción de archivo entrante por carga manual (ExcelImportWizard), buzón SFTP, API o email dedicado; rechazo de duplicados por hash y por identificadores de pago; preview con errores por línea; aplicación idempotente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`, `endpointKey`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T06 §11. API, línea 1090 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-30)

<a id="API-INT-32"></a>
#### API-INT-32 · `GET /api/admin/int/webhooks`

- **Qué hace:** Bandeja y reproceso. Lista, con filtros y paginación, los registros de webhooks recibidos crudos; TTL (`webhookInbox`).
- **Para qué sirve:** RF-INT-055: Bandeja de entrada durable: se persiste el evento, se responde 2xx en < 2 s y se procesa en cola int-webhooks; deduplicación por id de evento del proveedor o hash. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.webhooks.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de webhooks recibidos crudos; TTL (`webhookInbox`) con `total`.
- **Pantallas:** PAN-INT-11 (Bandeja de webhooks).
- **Ola:** O1 · **Fuente:** T06 §11. API, línea 1092 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-32)

<a id="API-INT-32-b"></a>
#### API-INT-32-b · `POST /api/admin/int/webhooks`

- **Qué hace:** Bandeja y reproceso. Da de alta un registro de webhooks recibidos crudos; TTL (`webhookInbox`).
- **Para qué sirve:** RF-INT-055: Bandeja de entrada durable: se persiste el evento, se responde 2xx en < 2 s y se procesa en cola int-webhooks; deduplicación por id de evento del proveedor o hash. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.webhooks.configurar`.
- **Recibe:** los datos de webhooks recibidos crudos; TTL (`webhookInbox`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de webhooks recibidos crudos; TTL (`webhookInbox`).
- **Pantallas:** PAN-INT-11 (Bandeja de webhooks).
- **Ola:** O1 · **Fuente:** T06 §11. API, línea 1092 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-32-b)

<a id="API-INT-32-c"></a>
#### API-INT-32-c · `POST /api/admin/int/webhooks/{id}/reprocess`

- **Qué hace:** Bandeja y reproceso. Reprocesa un registro de webhooks recibidos crudos; TTL (`webhookInbox`).
- **Para qué sirve:** RF-INT-055: Bandeja de entrada durable: se persiste el evento, se responde 2xx en < 2 s y se procesa en cola int-webhooks; deduplicación por id de evento del proveedor o hash. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.webhooks.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INT-11 (Bandeja de webhooks).
- **Ola:** O1 · **Fuente:** T06 §11. API, línea 1092 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-32-c)

<a id="API-INT-33"></a>
#### API-INT-33 · `POST /api/admin/int/connections/{id}/webhook/rotate`

- **Qué hace:** Rotar endpointKey/secreto. Rota las credenciales de sobre webhooks recibidos crudos; TTL (`webhookInbox`).
- **Para qué sirve:** RF-INT-053: Endpoint de webhook por conexión en /api/public/{tenantSlug}/webhooks/{endpointKey} con endpointKey aleatorio no adivinable; rotación del endpoint. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.webhooks.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INT-11 (Bandeja de webhooks).
- **Ola:** O1 · **Fuente:** T06 §11. API, línea 1093 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-33)

<a id="API-INT-34"></a>
#### API-INT-34 · `GET /api/admin/int/files`

- **Qué hace:** Intercambios de archivos. Consulta `files`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.archivos.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INT-12 (Intercambio de archivos), PAN-INT-13 (Layouts).
- **Ola:** O4 · **Fuente:** T06 §11. API, línea 1094 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-34)

<a id="API-INT-34-b"></a>
#### API-INT-34-b · `GET /api/admin/int/files/{id}`

- **Qué hace:** Intercambios de archivos. Obtiene el detalle de un registro de `files`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.archivos.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INT-12 (Intercambio de archivos), PAN-INT-13 (Layouts).
- **Ola:** O4 · **Fuente:** T06 §11. API, línea 1094 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-34-b)

<a id="API-INT-35"></a>
#### API-INT-35 · `POST /api/admin/int/files/{id}/approve`

- **Qué hace:** Aprobar y entregar saliente. Aprueba un registro de `approve`.
- **Para qué sirve:** RF-INT-062: Generación de archivo saliente: previsualización, totales de control, hash, aprobación cuando el tipo lo exige, descarga con URL firmada o entrega SFTP/API; regeneración crea nueva versión, no sobrescribe. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.archivos.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INT-12 (Intercambio de archivos).
- **Ola:** O5 · **Fuente:** T06 §11. API, línea 1095 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-35)

<a id="API-INT-35-b"></a>
#### API-INT-35-b · `POST /api/admin/int/files/{id}/deliver`

- **Qué hace:** Aprobar y entregar saliente. Entrega un registro de `deliver`.
- **Para qué sirve:** RF-INT-062: Generación de archivo saliente: previsualización, totales de control, hash, aprobación cuando el tipo lo exige, descarga con URL firmada o entrega SFTP/API; regeneración crea nueva versión, no sobrescribe. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.archivos.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INT-12 (Intercambio de archivos).
- **Ola:** O5 · **Fuente:** T06 §11. API, línea 1095 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-35-b)

<a id="API-INT-36"></a>
#### API-INT-36 · `GET /api/admin/int/files/{id}/download`

- **Qué hace:** URL firmada de descarga. Descarga un archivo de `download`.
- **Para qué sirve:** RF-INT-062: Generación de archivo saliente: previsualización, totales de control, hash, aprobación cuando el tipo lo exige, descarga con URL firmada o entrega SFTP/API; regeneración crea nueva versión, no sobrescribe. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.archivos.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un archivo (application/octet-stream).
- **Pantallas:** PAN-INT-12 (Intercambio de archivos), PAN-INT-13 (Layouts).
- **Ola:** O5 · **Fuente:** T06 §11. API, línea 1096 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-36)

<a id="API-INT-37"></a>
#### API-INT-37 · `POST /api/admin/int/files/inbound`

- **Qué hace:** Carga entrante en 3 pasos. Registra un nuevo elemento u operación en `inbound`.
- **Para qué sirve:** RF-INT-063: Recepción de archivo entrante por carga manual (ExcelImportWizard), buzón SFTP, API o email dedicado; rechazo de duplicados por hash y por identificadores de pago; preview con errores por línea; aplicación idempotente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.archivos.importar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INT-12 (Intercambio de archivos).
- **Ola:** O5 · **Fuente:** T06 §11. API, línea 1097 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-37)

<a id="API-INT-37-b"></a>
#### API-INT-37-b · `POST /api/admin/int/files/inbound/{id}/preview`

- **Qué hace:** Carga entrante en 3 pasos. Previsualiza sin efectos un registro de `preview`.
- **Para qué sirve:** RF-INT-063: Recepción de archivo entrante por carga manual (ExcelImportWizard), buzón SFTP, API o email dedicado; rechazo de duplicados por hash y por identificadores de pago; preview con errores por línea; aplicación idempotente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.archivos.importar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INT-12 (Intercambio de archivos).
- **Ola:** O5 · **Fuente:** T06 §11. API, línea 1097 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-37-b)

<a id="API-INT-37-c"></a>
#### API-INT-37-c · `POST /api/admin/int/files/inbound/{id}/confirm`

- **Qué hace:** Carga entrante en 3 pasos. Confirma un registro de `confirm`.
- **Para qué sirve:** RF-INT-063: Recepción de archivo entrante por carga manual (ExcelImportWizard), buzón SFTP, API o email dedicado; rechazo de duplicados por hash y por identificadores de pago; preview con errores por línea; aplicación idempotente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.archivos.importar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INT-12 (Intercambio de archivos).
- **Ola:** O5 · **Fuente:** T06 §11. API, línea 1097 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-37-c)

<a id="API-INT-38"></a>
#### API-INT-38 · `GET /api/admin/int/layouts`

- **Qué hace:** Ver layouts y probar con archivo. Lista, con filtros y paginación, los registros de motor declarativo de layouts (`fileLayouts`).
- **Para qué sirve:** RF-INT-059: Layouts declarativos versionados (fileLayouts): ancho fijo, CSV (separador configurable), XLSX, XML, JSON, TXT de ARCA, lectura DBF/Access para migración; registros de cabecera/detalle/pie; campos con posición, largo, tipo… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.archivos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de motor declarativo de layouts (`fileLayouts`) con `total`.
- **Pantallas:** PAN-INT-12 (Intercambio de archivos), PAN-INT-13 (Layouts).
- **Ola:** O1 · **Fuente:** T06 §11. API, línea 1098 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-38)

<a id="API-INT-38-b"></a>
#### API-INT-38-b · `POST /api/admin/int/layouts`

- **Qué hace:** Ver layouts y probar con archivo. Da de alta un registro de motor declarativo de layouts (`fileLayouts`).
- **Para qué sirve:** RF-INT-059: Layouts declarativos versionados (fileLayouts): ancho fijo, CSV (separador configurable), XLSX, XML, JSON, TXT de ARCA, lectura DBF/Access para migración; registros de cabecera/detalle/pie; campos con posición, largo, tipo… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.proveedores.configurar`.
- **Recibe:** los datos de motor declarativo de layouts (`fileLayouts`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de motor declarativo de layouts (`fileLayouts`).
- **Pantallas:** PAN-INT-01 (Catálogo de proveedores y versiones de adaptadores), PAN-INT-13 (Layouts).
- **Ola:** O1 · **Fuente:** T06 §11. API, línea 1098 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-38-b)

<a id="API-INT-38-c"></a>
#### API-INT-38-c · `POST /api/admin/int/layouts/{code}/test`

- **Qué hace:** Ver layouts y probar con archivo. Prueba un registro de motor declarativo de layouts (`fileLayouts`).
- **Para qué sirve:** RF-INT-059: Layouts declarativos versionados (fileLayouts): ancho fijo, CSV (separador configurable), XLSX, XML, JSON, TXT de ARCA, lectura DBF/Access para migración; registros de cabecera/detalle/pie; campos con posición, largo, tipo… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.proveedores.configurar`.
- **Recibe:** en la ruta `code`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INT-01 (Catálogo de proveedores y versiones de adaptadores), PAN-INT-13 (Layouts).
- **Ola:** O1 · **Fuente:** T06 §11. API, línea 1098 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-38-c)

<a id="API-INT-39"></a>
#### API-INT-39 · `GET /api/admin/int/reconciliations`

- **Qué hace:** Conciliaciones. Lista, con filtros y paginación, los registros de conciliaciones técnicas con proveedores (`integrationReconciliations`).
- **Para qué sirve:** RF-INT-014: Ficha técnica y ayuda contextual por conector (qué hace, qué pide, cómo obtener credenciales, ambiente de prueba). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.conciliaciones.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de conciliaciones técnicas con proveedores (`integrationReconciliations`) con `total`.
- **Pantallas:** PAN-INT-14 (Conciliaciones por conector).
- **Ola:** O4 · **Fuente:** T06 §11. API, línea 1099 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-39)

<a id="API-INT-39-b"></a>
#### API-INT-39-b · `GET /api/admin/int/reconciliations/{id}`

- **Qué hace:** Conciliaciones. Obtiene el detalle de un registro de conciliaciones técnicas con proveedores (`integrationReconciliations`).
- **Para qué sirve:** RF-INT-014: Ficha técnica y ayuda contextual por conector (qué hace, qué pide, cómo obtener credenciales, ambiente de prueba). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.conciliaciones.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de conciliaciones técnicas con proveedores (`integrationReconciliations`).
- **Pantallas:** PAN-INT-14 (Conciliaciones por conector).
- **Ola:** O4 · **Fuente:** T06 §11. API, línea 1099 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-39-b)

<a id="API-INT-40"></a>
#### API-INT-40 · `POST /api/admin/int/reconciliations/{id}/differences/{diffId}`

- **Qué hace:** Resolver diferencia / cerrar. Registra un nuevo elemento u operación en conciliaciones técnicas con proveedores (`integrationReconciliations`).
- **Para qué sirve:** RF-INT-075: Reemplazo manual con doble control: un usuario con int.operaciones.resolverManual registra el resultado externo con evidencia adjunta; otro lo aprueba cuando la ficha lo exige; queda marcado manual_resolved y se concilia después. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.conciliaciones.aprobar`.
- **Recibe:** en la ruta `id`, `diffId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INT-14 (Conciliaciones por conector).
- **Ola:** O4 · **Fuente:** T06 §11. API, línea 1100 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-40)

<a id="API-INT-40-b"></a>
#### API-INT-40-b · `POST /api/admin/int/reconciliations/{id}/differences/{diffId}/close`

- **Qué hace:** Resolver diferencia / cerrar. Cierra un registro de conciliaciones técnicas con proveedores (`integrationReconciliations`).
- **Para qué sirve:** RF-INT-075: Reemplazo manual con doble control: un usuario con int.operaciones.resolverManual registra el resultado externo con evidencia adjunta; otro lo aprueba cuando la ficha lo exige; queda marcado manual_resolved y se concilia después. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.conciliaciones.aprobar`.
- **Recibe:** en la ruta `id`, `diffId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INT-14 (Conciliaciones por conector).
- **Ola:** O4 · **Fuente:** T06 §11. API, línea 1100 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-40-b)

<a id="API-INT-41"></a>
#### API-INT-41 · `GET /api/admin/int/alerts`

- **Qué hace:** Alertas. Lista, con filtros y paginación, los registros de alertas de integración (`integrationAlerts`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.alertas.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de alertas de integración (`integrationAlerts`) con `total`.
- **Pantallas:** PAN-INT-15 (Alertas).
- **Ola:** O1 · **Fuente:** T06 §11. API, línea 1101 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-41)

<a id="API-INT-41-b"></a>
#### API-INT-41-b · `POST /api/admin/int/alerts`

- **Qué hace:** Alertas. Da de alta un registro de alertas de integración (`integrationAlerts`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.alertas.gestionar`.
- **Recibe:** los datos de alertas de integración (`integrationAlerts`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de alertas de integración (`integrationAlerts`).
- **Pantallas:** PAN-INT-15 (Alertas).
- **Ola:** O1 · **Fuente:** T06 §11. API, línea 1101 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-41-b)

<a id="API-INT-41-c"></a>
#### API-INT-41-c · `POST /api/admin/int/alerts/{id}/ack`

- **Qué hace:** Alertas. Toma conocimiento de un registro de alertas de integración (`integrationAlerts`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.alertas.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INT-15 (Alertas).
- **Ola:** O1 · **Fuente:** T06 §11. API, línea 1101 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-41-c)

<a id="API-INT-41-d"></a>
#### API-INT-41-d · `POST /api/admin/int/alerts/{id}/resolve`

- **Qué hace:** Alertas. Resuelve un registro de alertas de integración (`integrationAlerts`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.alertas.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INT-15 (Alertas).
- **Ola:** O1 · **Fuente:** T06 §11. API, línea 1101 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-41-d)

<a id="API-INT-41-e"></a>
#### API-INT-41-e · `POST /api/admin/int/alerts/{id}/mute`

- **Qué hace:** Alertas. Silencia un registro de alertas de integración (`integrationAlerts`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.alertas.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INT-15 (Alertas).
- **Ola:** O1 · **Fuente:** T06 §11. API, línea 1101 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-41-e)

<a id="API-INT-42"></a>
#### API-INT-42 · `POST /api/admin/int/contingencies`

- **Qué hace:** Declarar/cerrar contingencia. Da de alta un registro de contingencias declaradas (`integrationContingencies`).
- **Para qué sirve:** RF-INT-074: Declarar contingencia por conexión (manual o sugerida por circuito abierto prolongado) con el modo alternativo de su ficha: CAEA (fiscal), archivo manual (redes/entes), cola diferida (mensajería), proveedor alternativo… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.contingencias.declarar`.
- **Recibe:** los datos de contingencias declaradas (`integrationContingencies`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de contingencias declaradas (`integrationContingencies`).
- **Pantallas:** PAN-INT-16 (Contingencias).
- **Ola:** O4 · **Fuente:** T06 §11. API, línea 1102 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-42)

<a id="API-INT-42-b"></a>
#### API-INT-42-b · `POST /api/admin/int/contingencies/{id}/close`

- **Qué hace:** Declarar/cerrar contingencia. Cierra un registro de contingencias declaradas (`integrationContingencies`).
- **Para qué sirve:** RF-INT-074: Declarar contingencia por conexión (manual o sugerida por circuito abierto prolongado) con el modo alternativo de su ficha: CAEA (fiscal), archivo manual (redes/entes), cola diferida (mensajería), proveedor alternativo… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.contingencias.declarar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INT-16 (Contingencias).
- **Ola:** O4 · **Fuente:** T06 §11. API, línea 1102 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-42-b)

<a id="API-INT-43"></a>
#### API-INT-43 · `GET /api/admin/int/dashboard`

- **Qué hace:** Tableros. Lista, con filtros y paginación, los registros de `dashboard`.
- **Para qué sirve:** RF-INT-072: Tablero de plataforma (todas las conexiones de todos los tenants, sin secretos) y tablero del tenant. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.monitoreo.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ResultadoGenerico (`ResultadoGenerico`) con `total`.
- **Pantallas:** PAN-INT-04 (Tablero del tenant), PAN-INT-05 (Tablero global), PAN-INT-18 (Consumo y cuotas) y 1 más.
- **Ola:** O1 · **Fuente:** T06 §11. API, línea 1103 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-43)

<a id="API-INT-43-b"></a>
#### API-INT-43-b · `GET /api/platform/int/dashboard`

- **Qué hace:** Tableros. Lista, con filtros y paginación, los registros de `dashboard`.
- **Para qué sirve:** RF-INT-072: Tablero de plataforma (todas las conexiones de todos los tenants, sin secretos) y tablero del tenant. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `int.monitoreo.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ResultadoGenerico (`ResultadoGenerico`) con `total`.
- **Pantallas:** PAN-INT-04 (Tablero del tenant), PAN-INT-05 (Tablero global), PAN-INT-18 (Consumo y cuotas) y 1 más.
- **Ola:** O1 · **Fuente:** T06 §11. API, línea 1103 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-43-b)

<a id="API-INT-44"></a>
#### API-INT-44 · `GET /api/admin/int/usage`

- **Qué hace:** Consumo y cuotas. Consulta `usage`.
- **Para qué sirve:** RF-INT-013: Consumo y costo por tenant (mensajes, consultas de mapas, tokens IA, consultas ARCA) para facturación de plataforma y cuotas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.monitoreo.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INT-04 (Tablero del tenant), PAN-INT-05 (Tablero global), PAN-INT-18 (Consumo y cuotas) y 1 más.
- **Ola:** O1 · **Fuente:** T06 §11. API, línea 1104 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-44)

<a id="API-INT-45"></a>
#### API-INT-45 · `GET /api/admin/int/external-references`

- **Qué hace:** Buscar identificador externo. Lista, con filtros y paginación, los registros de identificadores externos de entidades propias (`externalReferences`).
- **Para qué sirve:** RF-INT-078: Registro de identificadores externos (externalReferences) por entidad, único por tenantId + system + externalId, con historia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.operaciones.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de identificadores externos de entidades propias (`externalReferences`) con `total`.
- **Pantallas:** PAN-INT-08 (Seguimiento de operaciones), PAN-INT-19 (Búsqueda de identificadores externos).
- **Ola:** O1 · **Fuente:** T06 §11. API, línea 1105 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-45)

<a id="API-INT-46"></a>
#### API-INT-46 · `POST /api/admin/int/agents`

- **Qué hace:** Emparejar/revocar agente local. Da de alta un registro de agentes de hardware local registrados (`localAgents`).
- **Para qué sirve:** RF-INT-084: Agente local GoodApps (Windows/Linux) emparejado por código de un solo uso, con canal saliente WebSocket TLS, identidad de dispositivo, capacidades por dispositivo, comandos firmados con expiración, cola local y reporte de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.agentes.gestionar`.
- **Recibe:** los datos de agentes de hardware local registrados (`localAgents`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de agentes de hardware local registrados (`localAgents`).
- **Pantallas:** PAN-INT-17 (Agentes locales).
- **Ola:** O10 · **Fuente:** T06 §11. API, línea 1106 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-46)

<a id="API-INT-46-b"></a>
#### API-INT-46-b · `POST /api/admin/int/agents/{id}/revoke`

- **Qué hace:** Emparejar/revocar agente local. Revoca un registro de agentes de hardware local registrados (`localAgents`).
- **Para qué sirve:** RF-INT-084: Agente local GoodApps (Windows/Linux) emparejado por código de un solo uso, con canal saliente WebSocket TLS, identidad de dispositivo, capacidades por dispositivo, comandos firmados con expiración, cola local y reporte de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.agentes.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INT-17 (Agentes locales).
- **Ola:** O10 · **Fuente:** T06 §11. API, línea 1106 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-46-b)

<a id="API-INT-47"></a>
#### API-INT-47 · `GET /api/v1/ext/agents/connect`

- **Qué hace:** Canal del agente local (latido, comandos, resultados) Abre un canal en tiempo real (WebSocket) para recibir novedades de `connect`.
- **Para qué sirve:** RF-INT-084: Agente local GoodApps (Windows/Linux) emparejado por código de un solo uso, con canal saliente WebSocket TLS, identidad de dispositivo, capacidades por dispositivo, comandos firmados con expiración, cola local y reporte de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); permiso `int.agentes.ejecutar`.
- **Recibe:** nada.
- **Devuelve:** —.
- **Ola:** O10 · **Fuente:** T06 §11. API, línea 1107 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-47)

<a id="API-INT-48"></a>
#### API-INT-48 · `POST /api/v1/ext/agents/pair`

- **Qué hace:** Emparejamiento inicial del agente. Registra un nuevo elemento u operación en `pair`.
- **Para qué sirve:** RF-INT-084: Agente local GoodApps (Windows/Linux) emparejado por código de un solo uso, con canal saliente WebSocket TLS, identidad de dispositivo, capacidades por dispositivo, comandos firmados con expiración, cola local y reporte de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «public: true».
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O10 · **Fuente:** T06 §11. API, línea 1108 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-48)

<a id="API-INT-49"></a>
#### API-INT-49 · `GET /api/admin/int/ai-usage`

- **Qué hace:** Uso de IA. Consulta `ai-usage`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.monitoreo.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INT-04 (Tablero del tenant), PAN-INT-05 (Tablero global), PAN-INT-18 (Consumo y cuotas) y 1 más.
- **Ola:** O0 · **Fuente:** T06 §11. API, línea 1109 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-49)

<a id="API-INT-50"></a>
#### API-INT-50 · `GET /api/admin/int/connections/{id}/schedules`

- **Qué hace:** Calendario de ejecuciones. Consulta «schedules» de un registro de conexión del tenant con un proveedor (`integrationConnections`).
- **Para qué sirve:** RF-INT-077: Calendario de ejecuciones programadas por conexión (cron en zona horaria del tenant), con historial, saltos y ejecución manual. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.conexiones.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de conexión del tenant con un proveedor (`integrationConnections`).
- **Pantallas:** PAN-INT-03 (Alta y gestión de conexiones).
- **Ola:** O1 · **Fuente:** T06 §11. API, línea 1110 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-50)

<a id="API-INT-50-b"></a>
#### API-INT-50-b · `PUT /api/admin/int/connections/{id}/schedules`

- **Qué hace:** Calendario de ejecuciones. Reemplaza o configura conexión del tenant con un proveedor (`integrationConnections`).
- **Para qué sirve:** RF-INT-077: Calendario de ejecuciones programadas por conexión (cron en zona horaria del tenant), con historial, saltos y ejecución manual. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `int.conexiones.configurar`.
- **Recibe:** en la ruta `id`; los datos de conexión del tenant con un proveedor (`integrationConnections`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de conexión del tenant con un proveedor (`integrationConnections`).
- **Pantallas:** PAN-INT-03 (Alta y gestión de conexiones).
- **Ola:** O1 · **Fuente:** T06 §11. API, línea 1110 · [Ver en Swagger](../18-swagger/index.html?api=t06-int#/API/API-INT-50-b)
