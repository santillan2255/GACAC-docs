# Catálogo de endpoints · T09 · Comunidad y comunicaciones (muro, novedades, encuestas, eventos, beneficios, audiencias, notificaciones y campañas)

Parte del [catálogo de endpoints](../18-catalogo-endpoints.md) (artefacto 7.1). Generado el 05-11-2026 con `_trabajo/gen_18_catalogo_endpoints.py` a partir de `18-openapi/`; no se edita a mano.

## Para qué sirve esta API

Dar a cada cooperativa (tenant) un único sistema de relación con su comunidad —socios, titulares, adherentes, empleados, consejeros y público de la landing— que cubra:

1. Comunicación editorial (DEC-008): un muro donde publica la cooperativa y sus empleados autorizados; los socios leen, reaccionan y comentan con moderación IA + humana, habilitable por tenant y por publicación, con reglas, cola de revisión, reportes de contenido, sanciones y auditoría completa. Incluye noticias públicas en la landing (NOT-001), muro del socio (NOT-002) y muro del empleado (NOT-003).
2. Participación no vinculante: encuestas (satisfacción, calidad, censo, post-reclamo, post-instalación), votaciones rápidas y consultas no vinculantes. Las votaciones vinculantes de asamblea pertenecen al módulo institucional (M17 INS).
3. Agenda y beneficios: eventos de la cooperativa con inscripción y recordatorios; beneficios para socios con condiciones de elegibilidad y canje.
4. Motor único de audiencias: una sola definición de “a quién” para publicaciones, encuestas, eventos, beneficios, boletines, campañas y avisos de interrupción, con dimensiones propias de la cooperativa (servicio, zona, localidad, categoría tarifaria, estado de deuda/instancia de mora, rol, sucursal, atributos), recorte obligatorio al alcance del emisor (clampAudienceToGrant) y vista previa de…
5. Motor único de comunicaciones multicanal (email, SMS, WhatsApp, push PWA, in-app e impreso en factura): plantillas versionadas por tenant con variables tipadas, respeto de preferencias y consentimientos por canal y finalidad, horarios de no molestar, throttling, reintentos y alternativa de canal, y constancia de entrega diferenciada (creado, encolado, aceptado por proveedor, entregado, leído…
6. Notificaciones transaccionales: catálogo cerrado y completo de avisos disparados por eventos de dominio de todos los módulos (factura emitida, vencimiento, pago acreditado, corte programado, reclamo actualizado, turno, visita, instalador en camino, etc.), cada uno con evento disparador, canales, plantilla, finalidad y regla de opt-out.
7. Campañas masivas programadas, con throttling, métricas (enviados, entregados, abiertos, clics, rebotes, bajas, fallidos) y control de costo por canal.
8. Bandeja in-app del usuario (socio y empleado) con tipos (notifKinds), lectura, descarte con deshacer y badge global.
9. Avisos de interrupción del servicio por zona (programados y no programados) con notificación solo a los afectados.
10. Reemplazar todo el módulo SMS y de mensajería de ProCoop (envío manual y masivo de SMS/WhatsApp/mail, plantillas y variables, cola AUDIT_MAIL, MENSAJES, módems, NOTI_COOP, novedades web, encuestas) con un diseño seguro y multitenant (DEC-002, RN-10 §14.4).

Detalle completo en el anexo T09, sección 1. Contrato navegable: [Swagger](../18-swagger/index.html?api=t09-com).

| Dato | Valor |
|---|---|
| Endpoints | 326 |
| Por método | DELETE 29, GET 120, PATCH 28, POST 144, PUT 5 |
| Grupos funcionales | 5 |
| Con requisito citado en el anexo | 0 |
| Con requisito inferido (a confirmar) | 326 |
| Sin requisito identificable | 0 |

## Grupos funcionales

| Grupo | Endpoints | Qué agrupa (primeros endpoints) |
|---|---|---|
| [Muro, comentarios y moderación](#grupo-1) | 98 | Feed por audiencia (audienceFilterForUser), canal según rol.; Detalle (404 si fuera de audiencia; versión pública si…; Guardados.… |
| [Boletines, encuestas, eventos y beneficios](#grupo-2) | 93 | Boletines recibidos.; Reglas.; Boletines.… |
| [Audiencias](#grupo-3) | 13 | Dimensiones y valores permitidos (recortados al grant y a…; Normaliza y recorta (clampAudienceToGrant); devuelve diff y…; Vista previa de alcance (conteos por canal, excluidos por…… |
| [Motor de comunicaciones, campañas y canales](#grupo-4) | 95 | Estado de las comunicaciones de un objeto (M05, M08, M09).; Comando de envío: { typeCode, recipients[], businessRef…; Constancia PDF (URL firmada).… |
| [Preferencias, bandeja, push, enlaces y plataforma](#grupo-5) | 27 | Mis preferencias (registra consentimiento).; Baja de un clic y gestión sin login; también endpoint…; Bandeja y badge.… |

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

## Muro, comentarios y moderación

98 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-COM-01](#API-COM-01) | GET | `/api/com/posts/feed` | Feed por audiencia (audienceFilterForUser), canal según rol. |
| [API-COM-02](#API-COM-02) | GET | `/api/com/posts/{id}` | Detalle (404 si fuera de audiencia; versión pública si landing). |
| [API-COM-03](#API-COM-03) | GET | `/api/com/posts/saved` | Guardados. |
| [API-COM-04](#API-COM-04) | GET | `/api/com/posts/sections` | Secciones/hashtags vigentes. |
| [API-COM-05](#API-COM-05) | POST | `/api/com/posts/{id}/reaction` | Reaccionar / quitar (body { reaction }). |
| [API-COM-05-b](#API-COM-05-b) | DELETE | `/api/com/posts/{id}/reaction` | Reaccionar / quitar (body { reaction }). |
| [API-COM-06](#API-COM-06) | POST | `/api/com/posts/{id}/save` | Guardar / ocultar y deshacer. |
| [API-COM-06-b](#API-COM-06-b) | DELETE | `/api/com/posts/{id}/save` | Guardar / ocultar y deshacer. |
| [API-COM-06-c](#API-COM-06-c) | POST | `/api/com/posts/{id}/hide` | Guardar / ocultar y deshacer. |
| [API-COM-07](#API-COM-07) | POST | `/api/com/posts/{id}/share` | Registra y devuelve enlace profundo. |
| [API-COM-08](#API-COM-08) | POST | `/api/com/posts/{id}/views` | Telemetría impresión/detalle (lote). |
| [API-COM-09](#API-COM-09) | GET | `/api/com/posts/{id}/comments` | Comentarios visibles (+ propios en revisión). |
| [API-COM-10](#API-COM-10) | GET | `/api/com/posts/{id}/mention-candidates` | Solo usuarios que pueden ver la publicación. |
| [API-COM-11](#API-COM-11) | POST | `/api/com/comments` | Crear comentario (con clientMutationId). 403 si deshabilitado/sanción; 428 si faltan reglas aceptadas. |
| [API-COM-12-b](#API-COM-12-b) | DELETE | `/api/com/comments/{id}` | Editar (ventana) / borrar propio. |
| [API-COM-12](#API-COM-12) | PATCH | `/api/com/comments/{id}` | Editar (ventana) / borrar propio. |
| [API-COM-13](#API-COM-13) | POST | `/api/com/comments/upload` | Subida de imagen/GIF (URL firmada de subida). |
| [API-COM-14](#API-COM-14) | POST | `/api/com/comments/{id}/reports` | Reportar (409 si ya reportó). |
| [API-COM-15](#API-COM-15) | GET | `/api/com/community/guidelines` | Reglas vigentes y aceptación. |
| [API-COM-15-b](#API-COM-15-b) | POST | `/api/com/community/guidelines` | Reglas vigentes y aceptación. |
| [API-COM-15-c](#API-COM-15-c) | GET | `/api/com/community/accept` | Reglas vigentes y aceptación. |
| [API-COM-15-d](#API-COM-15-d) | POST | `/api/com/community/accept` | Reglas vigentes y aceptación. |
| [API-COM-16](#API-COM-16) | GET | `/api/com/community/sanctions/me` | Mis sanciones y apelación. |
| [API-COM-16-b](#API-COM-16-b) | POST | `/api/com/community/sanctions/me` | Mis sanciones y apelación. |
| [API-COM-16-c](#API-COM-16-c) | POST | `/api/com/community/sanctions/me/{id}/appeal` | Mis sanciones y apelación. |
| [API-COM-17](#API-COM-17) | GET | `/api/admin/com/posts` | Listado (DataTable) / alta. |
| [API-COM-17-b](#API-COM-17-b) | POST | `/api/admin/com/posts` | Listado (DataTable) / alta. |
| [API-COM-18](#API-COM-18) | GET | `/api/admin/com/posts/{id}` | Detalle / edición (control optimista version) / borrado lógico. |
| [API-COM-18-c](#API-COM-18-c) | DELETE | `/api/admin/com/posts/{id}` | Detalle / edición (control optimista version) / borrado lógico. |
| [API-COM-18-b](#API-COM-18-b) | PATCH | `/api/admin/com/posts/{id}` | Detalle / edición (control optimista version) / borrado lógico. |
| [API-COM-19](#API-COM-19) | POST | `/api/admin/com/posts/{id}/submit` | Transiciones §8.1. |
| [API-COM-19-b](#API-COM-19-b) | POST | `/api/admin/com/posts/{id}/approve` | Transiciones §8.1. |
| [API-COM-19-c](#API-COM-19-c) | POST | `/api/admin/com/posts/{id}/reject` | Transiciones §8.1. |
| [API-COM-19-d](#API-COM-19-d) | POST | `/api/admin/com/posts/{id}/schedule` | Transiciones §8.1. |
| [API-COM-19-e](#API-COM-19-e) | POST | `/api/admin/com/posts/{id}/publish` | Transiciones §8.1. |
| [API-COM-19-f](#API-COM-19-f) | POST | `/api/admin/com/posts/{id}/archive` | Transiciones §8.1. |
| [API-COM-19-g](#API-COM-19-g) | POST | `/api/admin/com/posts/{id}/republish` | Transiciones §8.1. |
| [API-COM-19-h](#API-COM-19-h) | POST | `/api/admin/com/posts/{id}/pin` | Transiciones §8.1. |
| [API-COM-19-i](#API-COM-19-i) | POST | `/api/admin/com/posts/{id}/unpin` | Transiciones §8.1. |
| [API-COM-19-j](#API-COM-19-j) | POST | `/api/admin/com/posts/{id}/duplicate` | Transiciones §8.1. |
| [API-COM-20](#API-COM-20) | POST | `/api/admin/com/posts/{id}/to-kb` | Promover a KB (M09). |
| [API-COM-21](#API-COM-21) | POST | `/api/admin/com/posts/ai/draft` | Borrador IA (propuesta). |
| [API-COM-22](#API-COM-22) | POST | `/api/admin/com/posts/pii-check` | Detección de datos personales. |
| [API-COM-23](#API-COM-23) | GET | `/api/admin/com/posts/engagement` | Métricas, conflictos, exportación. |
| [API-COM-23-b](#API-COM-23-b) | GET | `/api/admin/com/posts/engagement/{id}/engagement` | Métricas, conflictos, exportación. |
| [API-COM-23-c](#API-COM-23-c) | GET | `/api/admin/com/posts/schedule-conflicts` | Métricas, conflictos, exportación. |
| [API-COM-23-d](#API-COM-23-d) | GET | `/api/admin/com/posts/export-media` | Métricas, conflictos, exportación. |
| [API-COM-24](#API-COM-24) | GET | `/api/admin/com/post-categories` | Maestros del muro. |
| [API-COM-24-b](#API-COM-24-b) | POST | `/api/admin/com/post-categories` | Maestros del muro. |
| [API-COM-24-c](#API-COM-24-c) | GET | `/api/admin/com/post-categories/{id}` | Maestros del muro. |
| [API-COM-24-e](#API-COM-24-e) | DELETE | `/api/admin/com/post-categories/{id}` | Maestros del muro. |
| [API-COM-24-d](#API-COM-24-d) | PATCH | `/api/admin/com/post-categories/{id}` | Maestros del muro. |
| [API-COM-24-f](#API-COM-24-f) | GET | `/api/admin/com/post-templates` | Maestros del muro. |
| [API-COM-24-g](#API-COM-24-g) | POST | `/api/admin/com/post-templates` | Maestros del muro. |
| [API-COM-24-h](#API-COM-24-h) | GET | `/api/admin/com/post-templates/{id}` | Maestros del muro. |
| [API-COM-24-j](#API-COM-24-j) | DELETE | `/api/admin/com/post-templates/{id}` | Maestros del muro. |
| [API-COM-24-i](#API-COM-24-i) | PATCH | `/api/admin/com/post-templates/{id}` | Maestros del muro. |
| [API-COM-24-k](#API-COM-24-k) | GET | `/api/admin/com/greeting-rules` | Maestros del muro. |
| [API-COM-24-l](#API-COM-24-l) | POST | `/api/admin/com/greeting-rules` | Maestros del muro. |
| [API-COM-24-m](#API-COM-24-m) | GET | `/api/admin/com/greeting-rules/{id}` | Maestros del muro. |
| [API-COM-24-o](#API-COM-24-o) | DELETE | `/api/admin/com/greeting-rules/{id}` | Maestros del muro. |
| [API-COM-24-n](#API-COM-24-n) | PATCH | `/api/admin/com/greeting-rules/{id}` | Maestros del muro. |
| [API-COM-24-p](#API-COM-24-p) | GET | `/api/admin/com/reactions-catalog` | Maestros del muro. |
| [API-COM-24-q](#API-COM-24-q) | POST | `/api/admin/com/reactions-catalog` | Maestros del muro. |
| [API-COM-24-r](#API-COM-24-r) | GET | `/api/admin/com/reactions-catalog/{id}` | Maestros del muro. |
| [API-COM-24-t](#API-COM-24-t) | DELETE | `/api/admin/com/reactions-catalog/{id}` | Maestros del muro. |
| [API-COM-24-s](#API-COM-24-s) | PATCH | `/api/admin/com/reactions-catalog/{id}` | Maestros del muro. |
| [API-COM-25](#API-COM-25) | GET | `/api/admin/com/moderation/cases` | Cola. |
| [API-COM-26](#API-COM-26) | POST | `/api/admin/com/moderation/cases/{id}/assign` | Decisiones (body con acción, motivo, respuesta). |
| [API-COM-26-b](#API-COM-26-b) | POST | `/api/admin/com/moderation/cases/{id}/decide` | Decisiones (body con acción, motivo, respuesta). |
| [API-COM-26-c](#API-COM-26-c) | POST | `/api/admin/com/moderation/cases/{id}/escalate` | Decisiones (body con acción, motivo, respuesta). |
| [API-COM-27](#API-COM-27) | POST | `/api/admin/com/comments/{id}/reply` | Acciones directas. |
| [API-COM-27-b](#API-COM-27-b) | POST | `/api/admin/com/comments/{id}/hide` | Acciones directas. |
| [API-COM-27-c](#API-COM-27-c) | POST | `/api/admin/com/comments/{id}/approve` | Acciones directas. |
| [API-COM-27-d](#API-COM-27-d) | POST | `/api/admin/com/comments/{id}/analyze` | Acciones directas. |
| [API-COM-27-e](#API-COM-27-e) | POST | `/api/admin/com/comments/{id}/derive-crm` | Acciones directas. |
| [API-COM-28](#API-COM-28) | POST | `/api/admin/com/comments/{id}/evidence-removal` | Solicita WFL de eliminación de evidencia. |
| [API-COM-29](#API-COM-29) | GET | `/api/admin/com/moderation/policy` | Política versionada. |
| [API-COM-29-b](#API-COM-29-b) | PUT | `/api/admin/com/moderation/policy` | Política versionada. |
| [API-COM-29-c](#API-COM-29-c) | GET | `/api/admin/com/moderation/policy/versions` | Política versionada. |
| [API-COM-30](#API-COM-30) | GET | `/api/admin/com/moderation/rules` | Reglas y prueba sobre texto. |
| [API-COM-30-b](#API-COM-30-b) | POST | `/api/admin/com/moderation/rules` | Reglas y prueba sobre texto. |
| [API-COM-30-c](#API-COM-30-c) | GET | `/api/admin/com/moderation/rules/{id}` | Reglas y prueba sobre texto. |
| [API-COM-30-e](#API-COM-30-e) | DELETE | `/api/admin/com/moderation/rules/{id}` | Reglas y prueba sobre texto. |
| [API-COM-30-d](#API-COM-30-d) | PATCH | `/api/admin/com/moderation/rules/{id}` | Reglas y prueba sobre texto. |
| [API-COM-30-f](#API-COM-30-f) | POST | `/api/admin/com/moderation/rules/{id}/test` | Reglas y prueba sobre texto. |
| [API-COM-31](#API-COM-31) | GET | `/api/admin/com/community/guidelines` | Reglas de comunidad versionadas. |
| [API-COM-31-b](#API-COM-31-b) | POST | `/api/admin/com/community/guidelines` | Reglas de comunidad versionadas. |
| [API-COM-31-c](#API-COM-31-c) | GET | `/api/admin/com/community/guidelines/{id}` | Reglas de comunidad versionadas. |
| [API-COM-31-e](#API-COM-31-e) | DELETE | `/api/admin/com/community/guidelines/{id}` | Reglas de comunidad versionadas. |
| [API-COM-31-d](#API-COM-31-d) | PATCH | `/api/admin/com/community/guidelines/{id}` | Reglas de comunidad versionadas. |
| [API-COM-31-f](#API-COM-31-f) | POST | `/api/admin/com/community/guidelines/{id}/publish` | Reglas de comunidad versionadas. |
| [API-COM-32](#API-COM-32) | GET | `/api/admin/com/sanctions` | Sanciones y apelaciones. |
| [API-COM-32-b](#API-COM-32-b) | POST | `/api/admin/com/sanctions` | Sanciones y apelaciones. |
| [API-COM-32-c](#API-COM-32-c) | POST | `/api/admin/com/sanctions/{id}/revoke` | Sanciones y apelaciones. |
| [API-COM-32-d](#API-COM-32-d) | POST | `/api/admin/com/sanctions/{id}/appeal/decide` | Sanciones y apelaciones. |
| [API-COM-33](#API-COM-33) | GET | `/api/admin/com/moderation/dashboard` | Tablero y auditoría. |
| [API-COM-33-b](#API-COM-33-b) | GET | `/api/admin/com/moderation/audit.csv` | Tablero y auditoría. |

<a id="API-COM-01"></a>
#### API-COM-01 · `GET /api/com/posts/feed`

- **Qué hace:** Feed por audiencia (audienceFilterForUser), canal según rol. Consulta publicaciones del muro y novedades (`posts`).
- **Para qué sirve:** RF-COM-009: Opciones por publicación: notificar a la audiencia (in-app, push, email), permitir reacciones, permitir comentarios, modo de moderación de comentarios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.wall.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: el registro de publicaciones del muro y novedades (`posts`).
- **Pantallas:** PAN-POR-55 (Muro), PAN-POR-56 (Novedades y boletines), PAN-POR-105 (Comunidad) y 4 más.
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2377 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-01)

<a id="API-COM-02"></a>
#### API-COM-02 · `GET /api/com/posts/{id}`

- **Qué hace:** Detalle (404 si fuera de audiencia; versión pública si landing). Obtiene el detalle de un registro de publicaciones del muro y novedades (`posts`).
- **Para qué sirve:** RF-COM-009: Opciones por publicación: notificar a la audiencia (in-app, push, email), permitir reacciones, permitir comentarios, modo de moderación de comentarios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.wall.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de publicaciones del muro y novedades (`posts`).
- **Pantallas:** PAN-POR-55 (Muro), PAN-POR-56 (Novedades y boletines), PAN-POR-105 (Comunidad) y 4 más.
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2378 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-02)

<a id="API-COM-03"></a>
#### API-COM-03 · `GET /api/com/posts/saved`

- **Qué hace:** Guardados. Consulta publicaciones del muro y novedades (`posts`).
- **Para qué sirve:** RF-COM-009: Opciones por publicación: notificar a la audiencia (in-app, push, email), permitir reacciones, permitir comentarios, modo de moderación de comentarios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.wall.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: el registro de publicaciones del muro y novedades (`posts`).
- **Pantallas:** PAN-POR-55 (Muro), PAN-POR-56 (Novedades y boletines), PAN-POR-105 (Comunidad) y 4 más.
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2379 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-03)

<a id="API-COM-04"></a>
#### API-COM-04 · `GET /api/com/posts/sections`

- **Qué hace:** Secciones/hashtags vigentes. Consulta publicaciones del muro y novedades (`posts`).
- **Para qué sirve:** RF-COM-054: Tablero de moderación: volumen, tiempo de primera decisión, % ocultos, % coincidencia IA vs humano, reportes abiertos, sanciones vigentes. · RF-COM-009: Opciones por publicación: notificar a la audiencia (in-app, push, email), permitir reacciones, permitir comentarios, modo de moderación de comentarios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.wall.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: el registro de publicaciones del muro y novedades (`posts`).
- **Pantallas:** PAN-POR-55 (Muro), PAN-POR-56 (Novedades y boletines), PAN-POR-105 (Comunidad) y 4 más.
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2380 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-04)

<a id="API-COM-05"></a>
#### API-COM-05 · `POST /api/com/posts/{id}/reaction`

- **Qué hace:** Reaccionar / quitar (body { reaction }). Registra «reaction» sobre un registro de publicaciones del muro y novedades (`posts`).
- **Para qué sirve:** RF-COM-009: Opciones por publicación: notificar a la audiencia (in-app, push, email), permitir reacciones, permitir comentarios, modo de moderación de comentarios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.reactions.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2381 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-05)

<a id="API-COM-05-b"></a>
#### API-COM-05-b · `DELETE /api/com/posts/{id}/reaction`

- **Qué hace:** Reaccionar / quitar (body { reaction }). Elimina o da de baja un registro de publicaciones del muro y novedades (`posts`).
- **Para qué sirve:** RF-COM-009: Opciones por publicación: notificar a la audiencia (in-app, push, email), permitir reacciones, permitir comentarios, modo de moderación de comentarios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.reactions.crear`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2381 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-05-b)

<a id="API-COM-06"></a>
#### API-COM-06 · `POST /api/com/posts/{id}/save`

- **Qué hace:** Guardar / ocultar y deshacer. Registra «save» sobre un registro de publicaciones del muro y novedades (`posts`).
- **Para qué sirve:** RF-COM-013: Guardados y “no me interesa” (ocultar) por usuario. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.wall.ver`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-55 (Muro), PAN-POR-56 (Novedades y boletines), PAN-POR-105 (Comunidad) y 4 más.
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2382 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-06)

<a id="API-COM-06-b"></a>
#### API-COM-06-b · `DELETE /api/com/posts/{id}/save`

- **Qué hace:** Guardar / ocultar y deshacer. Elimina o da de baja un registro de publicaciones del muro y novedades (`posts`).
- **Para qué sirve:** RF-COM-013: Guardados y “no me interesa” (ocultar) por usuario. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.wall.ver`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-POR-55 (Muro), PAN-POR-56 (Novedades y boletines), PAN-POR-105 (Comunidad) y 4 más.
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2382 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-06-b)

<a id="API-COM-06-c"></a>
#### API-COM-06-c · `POST /api/com/posts/{id}/hide`

- **Qué hace:** Guardar / ocultar y deshacer. Oculta un registro de publicaciones del muro y novedades (`posts`).
- **Para qué sirve:** RF-COM-013: Guardados y “no me interesa” (ocultar) por usuario. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.wall.ver`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-55 (Muro), PAN-POR-56 (Novedades y boletines), PAN-POR-105 (Comunidad) y 4 más.
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2382 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-06-c)

<a id="API-COM-07"></a>
#### API-COM-07 · `POST /api/com/posts/{id}/share`

- **Qué hace:** Registra y devuelve enlace profundo. Comparte un registro de publicaciones del muro y novedades (`posts`).
- **Para qué sirve:** RF-COM-014: Compartir publicación por enlace profundo; si el receptor no tiene acceso, ve aviso sin contenido (o la versión pública si es landing). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.wall.ver`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-55 (Muro), PAN-POR-56 (Novedades y boletines), PAN-POR-105 (Comunidad) y 4 más.
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2383 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-07)

<a id="API-COM-08"></a>
#### API-COM-08 · `POST /api/com/posts/{id}/views`

- **Qué hace:** Telemetría impresión/detalle (lote). Registra «views» sobre un registro de publicaciones del muro y novedades (`posts`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-COM-016: Telemetría de lectura (impresión, detalle) única por usuario y día, y métricas de engagement por publicación y ranking. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.wall.ver`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-POR-55 (Muro), PAN-POR-56 (Novedades y boletines), PAN-POR-105 (Comunidad) y 4 más.
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2384 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-08)

<a id="API-COM-09"></a>
#### API-COM-09 · `GET /api/com/posts/{id}/comments`

- **Qué hace:** Comentarios visibles (+ propios en revisión). Lista, con filtros y paginación, los registros de comentarios moderados (`comments`).
- **Para qué sirve:** RF-COM-045: Cola de revisión única (comentarios, imágenes, reportes) con filtros (riesgo, categoría, publicación, antigüedad, origen: IA/regla/reporte), SLA visible, asignación a moderador, acciones: aprobar, ocultar, ocultar y responder… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.wall.ver`.
- **Recibe:** en la ruta `id`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de comentarios moderados (`comments`) con `total`.
- **Pantallas:** PAN-POR-55 (Muro), PAN-POR-56 (Novedades y boletines), PAN-POR-105 (Comunidad) y 4 más.
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2385 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-09)

<a id="API-COM-10"></a>
#### API-COM-10 · `GET /api/com/posts/{id}/mention-candidates`

- **Qué hace:** Solo usuarios que pueden ver la publicación. Consulta «mention-candidates» de un registro de publicaciones del muro y novedades (`posts`).
- **Para qué sirve:** RF-COM-035: Los socios no pueden crear publicaciones propias (sin endpoint UGC en PWA para rol socio). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.comments.crear`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de publicaciones del muro y novedades (`posts`).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2386 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-10)

<a id="API-COM-11"></a>
#### API-COM-11 · `POST /api/com/comments`

- **Qué hace:** Crear comentario (con clientMutationId). 403 si deshabilitado/sanción; 428 si faltan reglas aceptadas. Da de alta un registro de comentarios moderados (`comments`).
- **Para qué sirve:** RF-COM-032: Habilitación de comentarios en dos niveles: tenant (PRM-COM-001) y publicación (commentsEnabled); por defecto deshabilitado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.comments.crear`.
- **Recibe:** los datos de comentarios moderados (`comments`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de comentarios moderados (`comments`).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2387 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-11)

<a id="API-COM-12-b"></a>
#### API-COM-12-b · `DELETE /api/com/comments/{id}`

- **Qué hace:** Editar (ventana) / borrar propio. Elimina o da de baja un registro de comentarios moderados (`comments`).
- **Para qué sirve:** RF-COM-035: Los socios no pueden crear publicaciones propias (sin endpoint UGC en PWA para rol socio). · RF-COM-032: Habilitación de comentarios en dos niveles: tenant (PRM-COM-001) y publicación (commentsEnabled); por defecto deshabilitado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.comments.crear`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2388 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-12-b)

<a id="API-COM-12"></a>
#### API-COM-12 · `PATCH /api/com/comments/{id}`

- **Qué hace:** Editar (ventana) / borrar propio. Modifica algunos campos de un registro de comentarios moderados (`comments`) (solo los enviados).
- **Para qué sirve:** RF-COM-035: Los socios no pueden crear publicaciones propias (sin endpoint UGC en PWA para rol socio). · RF-COM-032: Habilitación de comentarios en dos niveles: tenant (PRM-COM-001) y publicación (commentsEnabled); por defecto deshabilitado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.comments.crear`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de comentarios moderados (`comments`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de comentarios moderados (`comments`).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2388 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-12)

<a id="API-COM-13"></a>
#### API-COM-13 · `POST /api/com/comments/upload`

- **Qué hace:** Subida de imagen/GIF (URL firmada de subida). Sube un archivo a sobre comentarios moderados (`comments`).
- **Para qué sirve:** RF-COM-032: Habilitación de comentarios en dos niveles: tenant (PRM-COM-001) y publicación (commentsEnabled); por defecto deshabilitado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.comments.crear`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2389 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-13)

<a id="API-COM-14"></a>
#### API-COM-14 · `POST /api/com/comments/{id}/reports`

- **Qué hace:** Reportar (409 si ya reportó). Registra «reports» sobre un registro de comentarios moderados (`comments`).
- **Para qué sirve:** RF-COM-035: Los socios no pueden crear publicaciones propias (sin endpoint UGC en PWA para rol socio). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.reports.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2390 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-14)

<a id="API-COM-15"></a>
#### API-COM-15 · `GET /api/com/community/guidelines`

- **Qué hace:** Reglas vigentes y aceptación. Lista, con filtros y paginación, los registros de normas de convivencia versionadas (`communityGuidelines`).
- **Para qué sirve:** RF-COM-055: Reglas de comunidad (texto versionado) visibles al socio y aceptación previa al primer comentario. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.wall.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de normas de convivencia versionadas (`communityGuidelines`) con `total`.
- **Pantallas:** PAN-POR-55 (Muro), PAN-POR-56 (Novedades y boletines), PAN-POR-105 (Comunidad) y 4 más.
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2391 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-15)

<a id="API-COM-15-b"></a>
#### API-COM-15-b · `POST /api/com/community/guidelines`

- **Qué hace:** Reglas vigentes y aceptación. Da de alta un registro de normas de convivencia versionadas (`communityGuidelines`).
- **Para qué sirve:** RF-COM-055: Reglas de comunidad (texto versionado) visibles al socio y aceptación previa al primer comentario. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.wall.ver`.
- **Recibe:** los datos de normas de convivencia versionadas (`communityGuidelines`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de normas de convivencia versionadas (`communityGuidelines`).
- **Pantallas:** PAN-POR-55 (Muro), PAN-POR-56 (Novedades y boletines), PAN-POR-105 (Comunidad) y 4 más.
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2391 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-15-b)

<a id="API-COM-15-c"></a>
#### API-COM-15-c · `GET /api/com/community/accept`

- **Qué hace:** Reglas vigentes y aceptación. Consulta `accept`.
- **Para qué sirve:** RF-COM-055: Reglas de comunidad (texto versionado) visibles al socio y aceptación previa al primer comentario. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.wall.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-55 (Muro), PAN-POR-56 (Novedades y boletines), PAN-POR-105 (Comunidad) y 4 más.
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2391 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-15-c)

<a id="API-COM-15-d"></a>
#### API-COM-15-d · `POST /api/com/community/accept`

- **Qué hace:** Reglas vigentes y aceptación. Acepta sobre `accept`.
- **Para qué sirve:** RF-COM-055: Reglas de comunidad (texto versionado) visibles al socio y aceptación previa al primer comentario. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.wall.ver`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-55 (Muro), PAN-POR-56 (Novedades y boletines), PAN-POR-105 (Comunidad) y 4 más.
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2391 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-15-d)

<a id="API-COM-16"></a>
#### API-COM-16 · `GET /api/com/community/sanctions/me`

- **Qué hace:** Mis sanciones y apelación. Consulta sanciones de comunidad (`communitySanctions`).
- **Para qué sirve:** RF-COM-050: Apelación del sancionado (una por sanción) con revisión por otro moderador. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.sanctions.apelar`.
- **Recibe:** nada.
- **Devuelve:** 200: el registro de sanciones de comunidad (`communitySanctions`).
- **Pantallas:** PAN-COM-51 (Reglas de comunidad vigentes).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2392 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-16)

<a id="API-COM-16-b"></a>
#### API-COM-16-b · `POST /api/com/community/sanctions/me`

- **Qué hace:** Mis sanciones y apelación. Registra un nuevo elemento u operación en sanciones de comunidad (`communitySanctions`).
- **Para qué sirve:** RF-COM-050: Apelación del sancionado (una por sanción) con revisión por otro moderador. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.sanctions.apelar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-51 (Reglas de comunidad vigentes).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2392 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-16-b)

<a id="API-COM-16-c"></a>
#### API-COM-16-c · `POST /api/com/community/sanctions/me/{id}/appeal`

- **Qué hace:** Mis sanciones y apelación. Registra «appeal» sobre un registro de sanciones de comunidad (`communitySanctions`).
- **Para qué sirve:** RF-COM-050: Apelación del sancionado (una por sanción) con revisión por otro moderador. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.sanctions.apelar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-51 (Reglas de comunidad vigentes).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2392 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-16-c)

<a id="API-COM-17"></a>
#### API-COM-17 · `GET /api/admin/com/posts`

- **Qué hace:** Listado (DataTable) / alta. Lista, con filtros y paginación, los registros de publicaciones del muro y novedades (`posts`).
- **Para qué sirve:** RF-COM-009: Opciones por publicación: notificar a la audiencia (in-app, push, email), permitir reacciones, permitir comentarios, modo de moderación de comentarios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.posts.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de publicaciones del muro y novedades (`posts`) con `total`.
- **Pantallas:** PAN-COM-01 (Publicaciones).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2393 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-17)

<a id="API-COM-17-b"></a>
#### API-COM-17-b · `POST /api/admin/com/posts`

- **Qué hace:** Listado (DataTable) / alta. Da de alta un registro de publicaciones del muro y novedades (`posts`).
- **Para qué sirve:** RF-COM-035: Los socios no pueden crear publicaciones propias (sin endpoint UGC en PWA para rol socio). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.posts.crear`.
- **Recibe:** los datos de publicaciones del muro y novedades (`posts`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de publicaciones del muro y novedades (`posts`).
- **Pantallas:** PAN-COM-02 (Editor de publicación).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2393 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-17-b)

<a id="API-COM-18"></a>
#### API-COM-18 · `GET /api/admin/com/posts/{id}`

- **Qué hace:** Detalle / edición (control optimista version) / borrado lógico. Obtiene el detalle de un registro de publicaciones del muro y novedades (`posts`).
- **Para qué sirve:** RF-COM-031: Comentarios con un nivel de respuestas, foto/GIF opcional (si el tenant lo habilita), edición y borrado propio (con historial), emojis, deep-link a comentario. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.posts.editar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de publicaciones del muro y novedades (`posts`).
- **Pantallas:** PAN-COM-02 (Editor de publicación).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2394 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-18)

<a id="API-COM-18-c"></a>
#### API-COM-18-c · `DELETE /api/admin/com/posts/{id}`

- **Qué hace:** Detalle / edición (control optimista version) / borrado lógico. Elimina o da de baja un registro de publicaciones del muro y novedades (`posts`).
- **Para qué sirve:** RF-COM-031: Comentarios con un nivel de respuestas, foto/GIF opcional (si el tenant lo habilita), edición y borrado propio (con historial), emojis, deep-link a comentario. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.posts.editar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-COM-02 (Editor de publicación).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2394 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-18-c)

<a id="API-COM-18-b"></a>
#### API-COM-18-b · `PATCH /api/admin/com/posts/{id}`

- **Qué hace:** Detalle / edición (control optimista version) / borrado lógico. Modifica algunos campos de un registro de publicaciones del muro y novedades (`posts`) (solo los enviados).
- **Para qué sirve:** RF-COM-031: Comentarios con un nivel de respuestas, foto/GIF opcional (si el tenant lo habilita), edición y borrado propio (con historial), emojis, deep-link a comentario. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.posts.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de publicaciones del muro y novedades (`posts`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de publicaciones del muro y novedades (`posts`).
- **Pantallas:** PAN-COM-02 (Editor de publicación).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2394 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-18-b)

<a id="API-COM-19"></a>
#### API-COM-19 · `POST /api/admin/com/posts/{id}/submit`

- **Qué hace:** Transiciones §8.1. Envía a revisión o presenta un registro de publicaciones del muro y novedades (`posts`).
- **Para qué sirve:** RF-COM-035: Los socios no pueden crear publicaciones propias (sin endpoint UGC en PWA para rol socio). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.posts.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-02 (Editor de publicación).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2395 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-19)

<a id="API-COM-19-b"></a>
#### API-COM-19-b · `POST /api/admin/com/posts/{id}/approve`

- **Qué hace:** Transiciones §8.1. Aprueba un registro de publicaciones del muro y novedades (`posts`).
- **Para qué sirve:** RF-COM-035: Los socios no pueden crear publicaciones propias (sin endpoint UGC en PWA para rol socio). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.posts.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-02 (Editor de publicación).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2395 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-19-b)

<a id="API-COM-19-c"></a>
#### API-COM-19-c · `POST /api/admin/com/posts/{id}/reject`

- **Qué hace:** Transiciones §8.1. Rechaza un registro de publicaciones del muro y novedades (`posts`).
- **Para qué sirve:** RF-COM-035: Los socios no pueden crear publicaciones propias (sin endpoint UGC en PWA para rol socio). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.posts.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-02 (Editor de publicación).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2395 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-19-c)

<a id="API-COM-19-d"></a>
#### API-COM-19-d · `POST /api/admin/com/posts/{id}/schedule`

- **Qué hace:** Transiciones §8.1. Programa un registro de publicaciones del muro y novedades (`posts`).
- **Para qué sirve:** RF-COM-035: Los socios no pueden crear publicaciones propias (sin endpoint UGC en PWA para rol socio). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.posts.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-02 (Editor de publicación).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2395 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-19-d)

<a id="API-COM-19-e"></a>
#### API-COM-19-e · `POST /api/admin/com/posts/{id}/publish`

- **Qué hace:** Transiciones §8.1. Publica un registro de publicaciones del muro y novedades (`posts`).
- **Para qué sirve:** RF-COM-035: Los socios no pueden crear publicaciones propias (sin endpoint UGC en PWA para rol socio). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.posts.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-02 (Editor de publicación).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2395 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-19-e)

<a id="API-COM-19-f"></a>
#### API-COM-19-f · `POST /api/admin/com/posts/{id}/archive`

- **Qué hace:** Transiciones §8.1. Archiva un registro de publicaciones del muro y novedades (`posts`).
- **Para qué sirve:** RF-COM-035: Los socios no pueden crear publicaciones propias (sin endpoint UGC en PWA para rol socio). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.posts.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-02 (Editor de publicación).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2395 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-19-f)

<a id="API-COM-19-g"></a>
#### API-COM-19-g · `POST /api/admin/com/posts/{id}/republish`

- **Qué hace:** Transiciones §8.1. Registra «republish» sobre un registro de publicaciones del muro y novedades (`posts`).
- **Para qué sirve:** RF-COM-035: Los socios no pueden crear publicaciones propias (sin endpoint UGC en PWA para rol socio). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.posts.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-02 (Editor de publicación).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2395 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-19-g)

<a id="API-COM-19-h"></a>
#### API-COM-19-h · `POST /api/admin/com/posts/{id}/pin`

- **Qué hace:** Transiciones §8.1. Registra «pin» sobre un registro de publicaciones del muro y novedades (`posts`).
- **Para qué sirve:** RF-COM-035: Los socios no pueden crear publicaciones propias (sin endpoint UGC en PWA para rol socio). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.posts.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-02 (Editor de publicación).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2395 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-19-h)

<a id="API-COM-19-i"></a>
#### API-COM-19-i · `POST /api/admin/com/posts/{id}/unpin`

- **Qué hace:** Transiciones §8.1. Registra «unpin» sobre un registro de publicaciones del muro y novedades (`posts`).
- **Para qué sirve:** RF-COM-035: Los socios no pueden crear publicaciones propias (sin endpoint UGC en PWA para rol socio). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.posts.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-02 (Editor de publicación).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2395 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-19-i)

<a id="API-COM-19-j"></a>
#### API-COM-19-j · `POST /api/admin/com/posts/{id}/duplicate`

- **Qué hace:** Transiciones §8.1. Duplica un registro de publicaciones del muro y novedades (`posts`).
- **Para qué sirve:** RF-COM-035: Los socios no pueden crear publicaciones propias (sin endpoint UGC en PWA para rol socio). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.posts.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-02 (Editor de publicación).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2395 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-19-j)

<a id="API-COM-20"></a>
#### API-COM-20 · `POST /api/admin/com/posts/{id}/to-kb`

- **Qué hace:** Promover a KB (M09). Registra «to-kb» sobre un registro de publicaciones del muro y novedades (`posts`).
- **Para qué sirve:** RF-COM-022: Promover publicación a base de conocimiento del asistente (M09). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.posts.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-02 (Editor de publicación).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2396 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-20)

<a id="API-COM-21"></a>
#### API-COM-21 · `POST /api/admin/com/posts/ai/draft`

- **Qué hace:** Borrador IA (propuesta). Registra un nuevo elemento u operación en publicaciones del muro y novedades (`posts`).
- **Para qué sirve:** RF-COM-035: Los socios no pueden crear publicaciones propias (sin endpoint UGC en PWA para rol socio). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.posts.crear`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-02 (Editor de publicación).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2397 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-21)

<a id="API-COM-22"></a>
#### API-COM-22 · `POST /api/admin/com/posts/pii-check`

- **Qué hace:** Detección de datos personales. Registra un nuevo elemento u operación en publicaciones del muro y novedades (`posts`).
- **Para qué sirve:** RF-COM-052: Imágenes de comentarios: análisis IA de imagen + detección de rostros/documentos (aviso de datos personales en fotos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.posts.crear`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-02 (Editor de publicación).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2398 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-22)

<a id="API-COM-23"></a>
#### API-COM-23 · `GET /api/admin/com/posts/engagement`

- **Qué hace:** Métricas, conflictos, exportación. Consulta publicaciones del muro y novedades (`posts`).
- **Para qué sirve:** RF-COM-026: Exportar medios de una publicación y métricas (XLSX/CSV). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.posts.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: el registro de publicaciones del muro y novedades (`posts`).
- **Pantallas:** PAN-COM-01 (Publicaciones).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2399 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-23)

<a id="API-COM-23-b"></a>
#### API-COM-23-b · `GET /api/admin/com/posts/engagement/{id}/engagement`

- **Qué hace:** Métricas, conflictos, exportación. Consulta «engagement» de un registro de publicaciones del muro y novedades (`posts`).
- **Para qué sirve:** RF-COM-026: Exportar medios de una publicación y métricas (XLSX/CSV). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.posts.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de publicaciones del muro y novedades (`posts`).
- **Pantallas:** PAN-COM-01 (Publicaciones).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2399 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-23-b)

<a id="API-COM-23-c"></a>
#### API-COM-23-c · `GET /api/admin/com/posts/schedule-conflicts`

- **Qué hace:** Métricas, conflictos, exportación. Consulta publicaciones del muro y novedades (`posts`).
- **Para qué sirve:** RF-COM-026: Exportar medios de una publicación y métricas (XLSX/CSV). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.posts.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: el registro de publicaciones del muro y novedades (`posts`).
- **Pantallas:** PAN-COM-01 (Publicaciones).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2399 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-23-c)

<a id="API-COM-23-d"></a>
#### API-COM-23-d · `GET /api/admin/com/posts/export-media`

- **Qué hace:** Métricas, conflictos, exportación. Consulta publicaciones del muro y novedades (`posts`).
- **Para qué sirve:** RF-COM-026: Exportar medios de una publicación y métricas (XLSX/CSV). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.posts.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: el registro de publicaciones del muro y novedades (`posts`).
- **Pantallas:** PAN-COM-01 (Publicaciones).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2399 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-23-d)

<a id="API-COM-24"></a>
#### API-COM-24 · `GET /api/admin/com/post-categories`

- **Qué hace:** Maestros del muro. Lista, con filtros y paginación, los registros de categorías (`postCategories`).
- **Para qué sirve:** RF-COM-009: Opciones por publicación: notificar a la audiencia (in-app, push, email), permitir reacciones, permitir comentarios, modo de moderación de comentarios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.posts.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de categorías (`postCategories`) con `total`.
- **Pantallas:** PAN-COM-03 (Categorías, plantillas y reacciones).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2400 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-24)

<a id="API-COM-24-b"></a>
#### API-COM-24-b · `POST /api/admin/com/post-categories`

- **Qué hace:** Maestros del muro. Da de alta un registro de categorías (`postCategories`).
- **Para qué sirve:** RF-COM-009: Opciones por publicación: notificar a la audiencia (in-app, push, email), permitir reacciones, permitir comentarios, modo de moderación de comentarios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.posts.configurar`.
- **Recibe:** los datos de categorías (`postCategories`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de categorías (`postCategories`).
- **Pantallas:** PAN-COM-03 (Categorías, plantillas y reacciones).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2400 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-24-b)

<a id="API-COM-24-c"></a>
#### API-COM-24-c · `GET /api/admin/com/post-categories/{id}`

- **Qué hace:** Maestros del muro. Obtiene el detalle de un registro de categorías (`postCategories`).
- **Para qué sirve:** RF-COM-009: Opciones por publicación: notificar a la audiencia (in-app, push, email), permitir reacciones, permitir comentarios, modo de moderación de comentarios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.posts.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de categorías (`postCategories`).
- **Pantallas:** PAN-COM-03 (Categorías, plantillas y reacciones).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2400 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-24-c)

<a id="API-COM-24-e"></a>
#### API-COM-24-e · `DELETE /api/admin/com/post-categories/{id}`

- **Qué hace:** Maestros del muro. Elimina o da de baja un registro de categorías (`postCategories`).
- **Para qué sirve:** RF-COM-009: Opciones por publicación: notificar a la audiencia (in-app, push, email), permitir reacciones, permitir comentarios, modo de moderación de comentarios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.posts.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-COM-03 (Categorías, plantillas y reacciones).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2400 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-24-e)

<a id="API-COM-24-d"></a>
#### API-COM-24-d · `PATCH /api/admin/com/post-categories/{id}`

- **Qué hace:** Maestros del muro. Modifica algunos campos de un registro de categorías (`postCategories`) (solo los enviados).
- **Para qué sirve:** RF-COM-009: Opciones por publicación: notificar a la audiencia (in-app, push, email), permitir reacciones, permitir comentarios, modo de moderación de comentarios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.posts.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de categorías (`postCategories`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de categorías (`postCategories`).
- **Pantallas:** PAN-COM-03 (Categorías, plantillas y reacciones).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2400 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-24-d)

<a id="API-COM-24-f"></a>
#### API-COM-24-f · `GET /api/admin/com/post-templates`

- **Qué hace:** Maestros del muro. Lista, con filtros y paginación, los registros de plantillas de publicación (`postTemplates`).
- **Para qué sirve:** RF-COM-009: Opciones por publicación: notificar a la audiencia (in-app, push, email), permitir reacciones, permitir comentarios, modo de moderación de comentarios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.posts.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de plantillas de publicación (`postTemplates`) con `total`.
- **Pantallas:** PAN-COM-03 (Categorías, plantillas y reacciones).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2400 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-24-f)

<a id="API-COM-24-g"></a>
#### API-COM-24-g · `POST /api/admin/com/post-templates`

- **Qué hace:** Maestros del muro. Da de alta un registro de plantillas de publicación (`postTemplates`).
- **Para qué sirve:** RF-COM-009: Opciones por publicación: notificar a la audiencia (in-app, push, email), permitir reacciones, permitir comentarios, modo de moderación de comentarios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.posts.configurar`.
- **Recibe:** los datos de plantillas de publicación (`postTemplates`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de plantillas de publicación (`postTemplates`).
- **Pantallas:** PAN-COM-03 (Categorías, plantillas y reacciones).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2400 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-24-g)

<a id="API-COM-24-h"></a>
#### API-COM-24-h · `GET /api/admin/com/post-templates/{id}`

- **Qué hace:** Maestros del muro. Obtiene el detalle de un registro de plantillas de publicación (`postTemplates`).
- **Para qué sirve:** RF-COM-009: Opciones por publicación: notificar a la audiencia (in-app, push, email), permitir reacciones, permitir comentarios, modo de moderación de comentarios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.posts.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de plantillas de publicación (`postTemplates`).
- **Pantallas:** PAN-COM-03 (Categorías, plantillas y reacciones).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2400 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-24-h)

<a id="API-COM-24-j"></a>
#### API-COM-24-j · `DELETE /api/admin/com/post-templates/{id}`

- **Qué hace:** Maestros del muro. Elimina o da de baja un registro de plantillas de publicación (`postTemplates`).
- **Para qué sirve:** RF-COM-009: Opciones por publicación: notificar a la audiencia (in-app, push, email), permitir reacciones, permitir comentarios, modo de moderación de comentarios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.posts.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-COM-03 (Categorías, plantillas y reacciones).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2400 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-24-j)

<a id="API-COM-24-i"></a>
#### API-COM-24-i · `PATCH /api/admin/com/post-templates/{id}`

- **Qué hace:** Maestros del muro. Modifica algunos campos de un registro de plantillas de publicación (`postTemplates`) (solo los enviados).
- **Para qué sirve:** RF-COM-009: Opciones por publicación: notificar a la audiencia (in-app, push, email), permitir reacciones, permitir comentarios, modo de moderación de comentarios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.posts.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de plantillas de publicación (`postTemplates`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de plantillas de publicación (`postTemplates`).
- **Pantallas:** PAN-COM-03 (Categorías, plantillas y reacciones).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2400 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-24-i)

<a id="API-COM-24-k"></a>
#### API-COM-24-k · `GET /api/admin/com/greeting-rules`

- **Qué hace:** Maestros del muro. Lista, con filtros y paginación, los registros de saludos automáticos (`greetingRules`).
- **Para qué sirve:** RF-COM-020: Saludos automáticos (cumpleaños, aniversario de socio) por reglas, con idempotencia por runKey. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.posts.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de saludos automáticos (`greetingRules`) con `total`.
- **Pantallas:** PAN-COM-03 (Categorías, plantillas y reacciones).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2400 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-24-k)

<a id="API-COM-24-l"></a>
#### API-COM-24-l · `POST /api/admin/com/greeting-rules`

- **Qué hace:** Maestros del muro. Da de alta un registro de saludos automáticos (`greetingRules`).
- **Para qué sirve:** RF-COM-020: Saludos automáticos (cumpleaños, aniversario de socio) por reglas, con idempotencia por runKey. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.posts.configurar`.
- **Recibe:** los datos de saludos automáticos (`greetingRules`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de saludos automáticos (`greetingRules`).
- **Pantallas:** PAN-COM-03 (Categorías, plantillas y reacciones).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2400 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-24-l)

<a id="API-COM-24-m"></a>
#### API-COM-24-m · `GET /api/admin/com/greeting-rules/{id}`

- **Qué hace:** Maestros del muro. Obtiene el detalle de un registro de saludos automáticos (`greetingRules`).
- **Para qué sirve:** RF-COM-020: Saludos automáticos (cumpleaños, aniversario de socio) por reglas, con idempotencia por runKey. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.posts.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de saludos automáticos (`greetingRules`).
- **Pantallas:** PAN-COM-03 (Categorías, plantillas y reacciones).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2400 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-24-m)

<a id="API-COM-24-o"></a>
#### API-COM-24-o · `DELETE /api/admin/com/greeting-rules/{id}`

- **Qué hace:** Maestros del muro. Elimina o da de baja un registro de saludos automáticos (`greetingRules`).
- **Para qué sirve:** RF-COM-020: Saludos automáticos (cumpleaños, aniversario de socio) por reglas, con idempotencia por runKey. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.posts.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-COM-03 (Categorías, plantillas y reacciones).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2400 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-24-o)

<a id="API-COM-24-n"></a>
#### API-COM-24-n · `PATCH /api/admin/com/greeting-rules/{id}`

- **Qué hace:** Maestros del muro. Modifica algunos campos de un registro de saludos automáticos (`greetingRules`) (solo los enviados).
- **Para qué sirve:** RF-COM-020: Saludos automáticos (cumpleaños, aniversario de socio) por reglas, con idempotencia por runKey. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.posts.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de saludos automáticos (`greetingRules`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de saludos automáticos (`greetingRules`).
- **Pantallas:** PAN-COM-03 (Categorías, plantillas y reacciones).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2400 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-24-n)

<a id="API-COM-24-p"></a>
#### API-COM-24-p · `GET /api/admin/com/reactions-catalog`

- **Qué hace:** Maestros del muro. Consulta `reactions-catalog`.
- **Para qué sirve:** RF-COM-009: Opciones por publicación: notificar a la audiencia (in-app, push, email), permitir reacciones, permitir comentarios, modo de moderación de comentarios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.posts.configurar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-03 (Categorías, plantillas y reacciones).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2400 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-24-p)

<a id="API-COM-24-q"></a>
#### API-COM-24-q · `POST /api/admin/com/reactions-catalog`

- **Qué hace:** Maestros del muro. Registra un nuevo elemento u operación en `reactions-catalog`.
- **Para qué sirve:** RF-COM-009: Opciones por publicación: notificar a la audiencia (in-app, push, email), permitir reacciones, permitir comentarios, modo de moderación de comentarios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.posts.configurar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-03 (Categorías, plantillas y reacciones).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2400 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-24-q)

<a id="API-COM-24-r"></a>
#### API-COM-24-r · `GET /api/admin/com/reactions-catalog/{id}`

- **Qué hace:** Maestros del muro. Obtiene el detalle de un registro de `reactions-catalog`.
- **Para qué sirve:** RF-COM-009: Opciones por publicación: notificar a la audiencia (in-app, push, email), permitir reacciones, permitir comentarios, modo de moderación de comentarios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.posts.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-03 (Categorías, plantillas y reacciones).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2400 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-24-r)

<a id="API-COM-24-t"></a>
#### API-COM-24-t · `DELETE /api/admin/com/reactions-catalog/{id}`

- **Qué hace:** Maestros del muro. Elimina o da de baja un registro de `reactions-catalog`.
- **Para qué sirve:** RF-COM-009: Opciones por publicación: notificar a la audiencia (in-app, push, email), permitir reacciones, permitir comentarios, modo de moderación de comentarios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.posts.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-COM-03 (Categorías, plantillas y reacciones).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2400 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-24-t)

<a id="API-COM-24-s"></a>
#### API-COM-24-s · `PATCH /api/admin/com/reactions-catalog/{id}`

- **Qué hace:** Maestros del muro. Modifica algunos campos de un registro de `reactions-catalog` (solo los enviados).
- **Para qué sirve:** RF-COM-009: Opciones por publicación: notificar a la audiencia (in-app, push, email), permitir reacciones, permitir comentarios, modo de moderación de comentarios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.posts.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-03 (Categorías, plantillas y reacciones).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2400 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-24-s)

<a id="API-COM-25"></a>
#### API-COM-25 · `GET /api/admin/com/moderation/cases`

- **Qué hace:** Cola. Lista, con filtros y paginación, los registros de cola de revisión (`moderationCases`).
- **Para qué sirve:** RF-COM-040: Modos de moderación por tenant/publicación: pre (todo comentario a revisión), ai_assisted (publica si riesgo bajo; medio/alto a cola), post (publica y revisa después). Default ai_assisted. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.moderation.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de cola de revisión (`moderationCases`) con `total`.
- **Pantallas:** PAN-COM-04 (Cola de moderación), PAN-COM-07 (Tablero de moderación).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2401 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-25)

<a id="API-COM-26"></a>
#### API-COM-26 · `POST /api/admin/com/moderation/cases/{id}/assign`

- **Qué hace:** Decisiones (body con acción, motivo, respuesta). Asigna un registro de cola de revisión (`moderationCases`).
- **Para qué sirve:** RF-COM-045: Cola de revisión única (comentarios, imágenes, reportes) con filtros (riesgo, categoría, publicación, antigüedad, origen: IA/regla/reporte), SLA visible, asignación a moderador, acciones: aprobar, ocultar, ocultar y responder… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.moderation.decidir`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2402 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-26)

<a id="API-COM-26-b"></a>
#### API-COM-26-b · `POST /api/admin/com/moderation/cases/{id}/decide`

- **Qué hace:** Decisiones (body con acción, motivo, respuesta). Registra la decisión sobre un registro de cola de revisión (`moderationCases`).
- **Para qué sirve:** RF-COM-045: Cola de revisión única (comentarios, imágenes, reportes) con filtros (riesgo, categoría, publicación, antigüedad, origen: IA/regla/reporte), SLA visible, asignación a moderador, acciones: aprobar, ocultar, ocultar y responder… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.moderation.decidir`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2402 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-26-b)

<a id="API-COM-26-c"></a>
#### API-COM-26-c · `POST /api/admin/com/moderation/cases/{id}/escalate`

- **Qué hace:** Decisiones (body con acción, motivo, respuesta). Registra «escalate» sobre un registro de cola de revisión (`moderationCases`).
- **Para qué sirve:** RF-COM-045: Cola de revisión única (comentarios, imágenes, reportes) con filtros (riesgo, categoría, publicación, antigüedad, origen: IA/regla/reporte), SLA visible, asignación a moderador, acciones: aprobar, ocultar, ocultar y responder… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.moderation.decidir`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2402 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-26-c)

<a id="API-COM-27"></a>
#### API-COM-27 · `POST /api/admin/com/comments/{id}/reply`

- **Qué hace:** Acciones directas. Responde un registro de comentarios moderados (`comments`).
- **Para qué sirve:** RF-COM-045: Cola de revisión única (comentarios, imágenes, reportes) con filtros (riesgo, categoría, publicación, antigüedad, origen: IA/regla/reporte), SLA visible, asignación a moderador, acciones: aprobar, ocultar, ocultar y responder… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.comments.ocultar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2403 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-27)

<a id="API-COM-27-b"></a>
#### API-COM-27-b · `POST /api/admin/com/comments/{id}/hide`

- **Qué hace:** Acciones directas. Oculta un registro de comentarios moderados (`comments`).
- **Para qué sirve:** RF-COM-045: Cola de revisión única (comentarios, imágenes, reportes) con filtros (riesgo, categoría, publicación, antigüedad, origen: IA/regla/reporte), SLA visible, asignación a moderador, acciones: aprobar, ocultar, ocultar y responder… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.comments.ocultar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2403 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-27-b)

<a id="API-COM-27-c"></a>
#### API-COM-27-c · `POST /api/admin/com/comments/{id}/approve`

- **Qué hace:** Acciones directas. Aprueba un registro de comentarios moderados (`comments`).
- **Para qué sirve:** RF-COM-045: Cola de revisión única (comentarios, imágenes, reportes) con filtros (riesgo, categoría, publicación, antigüedad, origen: IA/regla/reporte), SLA visible, asignación a moderador, acciones: aprobar, ocultar, ocultar y responder… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.comments.ocultar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2403 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-27-c)

<a id="API-COM-27-d"></a>
#### API-COM-27-d · `POST /api/admin/com/comments/{id}/analyze`

- **Qué hace:** Acciones directas. Registra «analyze» sobre un registro de comentarios moderados (`comments`).
- **Para qué sirve:** RF-COM-045: Cola de revisión única (comentarios, imágenes, reportes) con filtros (riesgo, categoría, publicación, antigüedad, origen: IA/regla/reporte), SLA visible, asignación a moderador, acciones: aprobar, ocultar, ocultar y responder… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.comments.ocultar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2403 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-27-d)

<a id="API-COM-27-e"></a>
#### API-COM-27-e · `POST /api/admin/com/comments/{id}/derive-crm`

- **Qué hace:** Acciones directas. Registra «derive-crm» sobre un registro de comentarios moderados (`comments`).
- **Para qué sirve:** RF-COM-045: Cola de revisión única (comentarios, imágenes, reportes) con filtros (riesgo, categoría, publicación, antigüedad, origen: IA/regla/reporte), SLA visible, asignación a moderador, acciones: aprobar, ocultar, ocultar y responder… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.comments.ocultar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2403 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-27-e)

<a id="API-COM-28"></a>
#### API-COM-28 · `POST /api/admin/com/comments/{id}/evidence-removal`

- **Qué hace:** Solicita WFL de eliminación de evidencia. Registra «evidence-removal» sobre un registro de comentarios moderados (`comments`).
- **Para qué sirve:** RF-COM-051: Ocultar ≠ eliminar evidencia: el contenido ocultado o borrado por su autor se conserva como evidencia con acceso restringido (com.moderation.verEvidencia) por el plazo de retención; la eliminación definitiva de evidencia requiere… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.comments.eliminarEvidencia`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2404 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-28)

<a id="API-COM-29"></a>
#### API-COM-29 · `GET /api/admin/com/moderation/policy`

- **Qué hace:** Política versionada. Consulta `policy`.
- **Para qué sirve:** RF-COM-055: Reglas de comunidad (texto versionado) visibles al socio y aceptación previa al primer comentario. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.moderation.configurar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-05 (Configuración de moderación).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2405 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-29)

<a id="API-COM-29-b"></a>
#### API-COM-29-b · `PUT /api/admin/com/moderation/policy`

- **Qué hace:** Política versionada. Reemplaza o configura `policy`.
- **Para qué sirve:** RF-COM-055: Reglas de comunidad (texto versionado) visibles al socio y aceptación previa al primer comentario. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.moderation.configurar`.
- **Recibe:** un cuerpo JSON cuya estructura detalla el anexo; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-05 (Configuración de moderación).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2405 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-29-b)

<a id="API-COM-29-c"></a>
#### API-COM-29-c · `GET /api/admin/com/moderation/policy/versions`

- **Qué hace:** Política versionada. Lista, con filtros y paginación, los registros de versiones de plantilla (`messageTemplateVersions`).
- **Para qué sirve:** RF-COM-055: Reglas de comunidad (texto versionado) visibles al socio y aceptación previa al primer comentario. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.moderation.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de versiones de plantilla (`messageTemplateVersions`) con `total`.
- **Pantallas:** PAN-COM-05 (Configuración de moderación).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2405 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-29-c)

<a id="API-COM-30"></a>
#### API-COM-30 · `GET /api/admin/com/moderation/rules`

- **Qué hace:** Reglas y prueba sobre texto. Lista, con filtros y paginación, los registros de saludos automáticos (`greetingRules`).
- **Para qué sirve:** RF-COM-020: Saludos automáticos (cumpleaños, aniversario de socio) por reglas, con idempotencia por runKey. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.moderation.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de saludos automáticos (`greetingRules`) con `total`.
- **Pantallas:** PAN-COM-05 (Configuración de moderación).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2406 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-30)

<a id="API-COM-30-b"></a>
#### API-COM-30-b · `POST /api/admin/com/moderation/rules`

- **Qué hace:** Reglas y prueba sobre texto. Da de alta un registro de saludos automáticos (`greetingRules`).
- **Para qué sirve:** RF-COM-020: Saludos automáticos (cumpleaños, aniversario de socio) por reglas, con idempotencia por runKey. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.moderation.configurar`.
- **Recibe:** los datos de saludos automáticos (`greetingRules`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de saludos automáticos (`greetingRules`).
- **Pantallas:** PAN-COM-05 (Configuración de moderación).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2406 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-30-b)

<a id="API-COM-30-c"></a>
#### API-COM-30-c · `GET /api/admin/com/moderation/rules/{id}`

- **Qué hace:** Reglas y prueba sobre texto. Obtiene el detalle de un registro de saludos automáticos (`greetingRules`).
- **Para qué sirve:** RF-COM-020: Saludos automáticos (cumpleaños, aniversario de socio) por reglas, con idempotencia por runKey. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.moderation.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de saludos automáticos (`greetingRules`).
- **Pantallas:** PAN-COM-05 (Configuración de moderación).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2406 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-30-c)

<a id="API-COM-30-e"></a>
#### API-COM-30-e · `DELETE /api/admin/com/moderation/rules/{id}`

- **Qué hace:** Reglas y prueba sobre texto. Elimina o da de baja un registro de saludos automáticos (`greetingRules`).
- **Para qué sirve:** RF-COM-020: Saludos automáticos (cumpleaños, aniversario de socio) por reglas, con idempotencia por runKey. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.moderation.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-COM-05 (Configuración de moderación).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2406 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-30-e)

<a id="API-COM-30-d"></a>
#### API-COM-30-d · `PATCH /api/admin/com/moderation/rules/{id}`

- **Qué hace:** Reglas y prueba sobre texto. Modifica algunos campos de un registro de saludos automáticos (`greetingRules`) (solo los enviados).
- **Para qué sirve:** RF-COM-020: Saludos automáticos (cumpleaños, aniversario de socio) por reglas, con idempotencia por runKey. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.moderation.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de saludos automáticos (`greetingRules`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de saludos automáticos (`greetingRules`).
- **Pantallas:** PAN-COM-05 (Configuración de moderación).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2406 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-30-d)

<a id="API-COM-30-f"></a>
#### API-COM-30-f · `POST /api/admin/com/moderation/rules/{id}/test`

- **Qué hace:** Reglas y prueba sobre texto. Prueba un registro de saludos automáticos (`greetingRules`).
- **Para qué sirve:** RF-COM-020: Saludos automáticos (cumpleaños, aniversario de socio) por reglas, con idempotencia por runKey. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.moderation.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-05 (Configuración de moderación).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2406 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-30-f)

<a id="API-COM-31"></a>
#### API-COM-31 · `GET /api/admin/com/community/guidelines`

- **Qué hace:** Reglas de comunidad versionadas. Lista, con filtros y paginación, los registros de normas de convivencia versionadas (`communityGuidelines`).
- **Para qué sirve:** RF-COM-055: Reglas de comunidad (texto versionado) visibles al socio y aceptación previa al primer comentario. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.moderation.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de normas de convivencia versionadas (`communityGuidelines`) con `total`.
- **Pantallas:** PAN-COM-05 (Configuración de moderación).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2407 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-31)

<a id="API-COM-31-b"></a>
#### API-COM-31-b · `POST /api/admin/com/community/guidelines`

- **Qué hace:** Reglas de comunidad versionadas. Da de alta un registro de normas de convivencia versionadas (`communityGuidelines`).
- **Para qué sirve:** RF-COM-055: Reglas de comunidad (texto versionado) visibles al socio y aceptación previa al primer comentario. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.moderation.configurar`.
- **Recibe:** los datos de normas de convivencia versionadas (`communityGuidelines`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de normas de convivencia versionadas (`communityGuidelines`).
- **Pantallas:** PAN-COM-05 (Configuración de moderación).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2407 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-31-b)

<a id="API-COM-31-c"></a>
#### API-COM-31-c · `GET /api/admin/com/community/guidelines/{id}`

- **Qué hace:** Reglas de comunidad versionadas. Obtiene el detalle de un registro de normas de convivencia versionadas (`communityGuidelines`).
- **Para qué sirve:** RF-COM-055: Reglas de comunidad (texto versionado) visibles al socio y aceptación previa al primer comentario. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.moderation.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de normas de convivencia versionadas (`communityGuidelines`).
- **Pantallas:** PAN-COM-05 (Configuración de moderación).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2407 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-31-c)

<a id="API-COM-31-e"></a>
#### API-COM-31-e · `DELETE /api/admin/com/community/guidelines/{id}`

- **Qué hace:** Reglas de comunidad versionadas. Elimina o da de baja un registro de normas de convivencia versionadas (`communityGuidelines`).
- **Para qué sirve:** RF-COM-055: Reglas de comunidad (texto versionado) visibles al socio y aceptación previa al primer comentario. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.moderation.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-COM-05 (Configuración de moderación).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2407 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-31-e)

<a id="API-COM-31-d"></a>
#### API-COM-31-d · `PATCH /api/admin/com/community/guidelines/{id}`

- **Qué hace:** Reglas de comunidad versionadas. Modifica algunos campos de un registro de normas de convivencia versionadas (`communityGuidelines`) (solo los enviados).
- **Para qué sirve:** RF-COM-055: Reglas de comunidad (texto versionado) visibles al socio y aceptación previa al primer comentario. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.moderation.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de normas de convivencia versionadas (`communityGuidelines`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de normas de convivencia versionadas (`communityGuidelines`).
- **Pantallas:** PAN-COM-05 (Configuración de moderación).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2407 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-31-d)

<a id="API-COM-31-f"></a>
#### API-COM-31-f · `POST /api/admin/com/community/guidelines/{id}/publish`

- **Qué hace:** Reglas de comunidad versionadas. Publica un registro de normas de convivencia versionadas (`communityGuidelines`).
- **Para qué sirve:** RF-COM-055: Reglas de comunidad (texto versionado) visibles al socio y aceptación previa al primer comentario. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.moderation.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-05 (Configuración de moderación).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2407 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-31-f)

<a id="API-COM-32"></a>
#### API-COM-32 · `GET /api/admin/com/sanctions`

- **Qué hace:** Sanciones y apelaciones. Lista, con filtros y paginación, los registros de sanciones de comunidad (`communitySanctions`).
- **Para qué sirve:** RF-COM-050: Apelación del sancionado (una por sanción) con revisión por otro moderador. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.sanctions.aplicar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de sanciones de comunidad (`communitySanctions`) con `total`.
- **Pantallas:** PAN-COM-06 (Sanciones).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2408 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-32)

<a id="API-COM-32-b"></a>
#### API-COM-32-b · `POST /api/admin/com/sanctions`

- **Qué hace:** Sanciones y apelaciones. Da de alta un registro de sanciones de comunidad (`communitySanctions`).
- **Para qué sirve:** RF-COM-050: Apelación del sancionado (una por sanción) con revisión por otro moderador. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.sanctions.aplicar`.
- **Recibe:** los datos de sanciones de comunidad (`communitySanctions`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de sanciones de comunidad (`communitySanctions`).
- **Pantallas:** PAN-COM-06 (Sanciones).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2408 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-32-b)

<a id="API-COM-32-c"></a>
#### API-COM-32-c · `POST /api/admin/com/sanctions/{id}/revoke`

- **Qué hace:** Sanciones y apelaciones. Revoca un registro de sanciones de comunidad (`communitySanctions`).
- **Para qué sirve:** RF-COM-050: Apelación del sancionado (una por sanción) con revisión por otro moderador. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.sanctions.aplicar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-06 (Sanciones).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2408 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-32-c)

<a id="API-COM-32-d"></a>
#### API-COM-32-d · `POST /api/admin/com/sanctions/{id}/appeal/decide`

- **Qué hace:** Sanciones y apelaciones. Registra la decisión sobre sobre sanciones de comunidad (`communitySanctions`).
- **Para qué sirve:** RF-COM-050: Apelación del sancionado (una por sanción) con revisión por otro moderador. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.sanctions.aplicar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-06 (Sanciones).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2408 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-32-d)

<a id="API-COM-33"></a>
#### API-COM-33 · `GET /api/admin/com/moderation/dashboard`

- **Qué hace:** Tablero y auditoría. Lista, con filtros y paginación, los registros de `dashboard`.
- **Para qué sirve:** RF-COM-054: Tablero de moderación: volumen, tiempo de primera decisión, % ocultos, % coincidencia IA vs humano, reportes abiertos, sanciones vigentes. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.moderation.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ResultadoGenerico (`ResultadoGenerico`) con `total`.
- **Pantallas:** PAN-COM-04 (Cola de moderación), PAN-COM-07 (Tablero de moderación).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2409 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-33)

<a id="API-COM-33-b"></a>
#### API-COM-33-b · `GET /api/admin/com/moderation/audit.csv`

- **Qué hace:** Tablero y auditoría. Descarga un archivo de `audit.csv`.
- **Para qué sirve:** RF-COM-054: Tablero de moderación: volumen, tiempo de primera decisión, % ocultos, % coincidencia IA vs humano, reportes abiertos, sanciones vigentes. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.moderation.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: un archivo (text/csv).
- **Pantallas:** PAN-COM-04 (Cola de moderación), PAN-COM-07 (Tablero de moderación).
- **Ola:** O2 · **Fuente:** T09 §11.1 Muro, comentarios y moderación, línea 2409 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Muro%2C%20comentarios%20y%20moderaci%C3%B3n/API-COM-33-b)

<a id="grupo-2"></a>

## Boletines, encuestas, eventos y beneficios

93 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-COM-40](#API-COM-40) | GET | `/api/com/newsletters` | Boletines recibidos. |
| [API-COM-40-b](#API-COM-40-b) | GET | `/api/com/newsletters/{id}` | Boletines recibidos. |
| [API-COM-41](#API-COM-41) | GET | `/api/admin/com/newsletter-rules` | Reglas. |
| [API-COM-41-b](#API-COM-41-b) | POST | `/api/admin/com/newsletter-rules` | Reglas. |
| [API-COM-41-c](#API-COM-41-c) | GET | `/api/admin/com/newsletter-rules/{id}` | Reglas. |
| [API-COM-41-e](#API-COM-41-e) | DELETE | `/api/admin/com/newsletter-rules/{id}` | Reglas. |
| [API-COM-41-d](#API-COM-41-d) | PATCH | `/api/admin/com/newsletter-rules/{id}` | Reglas. |
| [API-COM-41-f](#API-COM-41-f) | POST | `/api/admin/com/newsletter-rules/{id}/preview` | Reglas. |
| [API-COM-42](#API-COM-42) | GET | `/api/admin/com/newsletters` | Boletines. |
| [API-COM-42-b](#API-COM-42-b) | POST | `/api/admin/com/newsletters` | Boletines. |
| [API-COM-42-c](#API-COM-42-c) | PATCH | `/api/admin/com/newsletters` | Boletines. |
| [API-COM-42-d](#API-COM-42-d) | GET | `/api/admin/com/newsletters/{id}` | Boletines. |
| [API-COM-42-e](#API-COM-42-e) | PATCH | `/api/admin/com/newsletters/{id}` | Boletines. |
| [API-COM-42-f](#API-COM-42-f) | POST | `/api/admin/com/newsletters/{id}/approve` | Boletines. |
| [API-COM-42-g](#API-COM-42-g) | POST | `/api/admin/com/newsletters/{id}/reject` | Boletines. |
| [API-COM-42-h](#API-COM-42-h) | POST | `/api/admin/com/newsletters/{id}/cancel` | Boletines. |
| [API-COM-42-i](#API-COM-42-i) | POST | `/api/admin/com/newsletters/{id}/send` | Boletines. |
| [API-COM-42-j](#API-COM-42-j) | POST | `/api/admin/com/newsletters/{id}/pdf` | Boletines. |
| [API-COM-42-k](#API-COM-42-k) | POST | `/api/admin/com/newsletters/{id}/preview-html` | Boletines. |
| [API-COM-42-l](#API-COM-42-l) | GET | `/api/admin/com/suggest` | Boletines. |
| [API-COM-42-m](#API-COM-42-m) | POST | `/api/admin/com/suggest` | Boletines. |
| [API-COM-42-n](#API-COM-42-n) | PATCH | `/api/admin/com/suggest` | Boletines. |
| [API-COM-43](#API-COM-43) | GET | `/api/com/surveys` | Encuestas del usuario. |
| [API-COM-44](#API-COM-44) | GET | `/api/com/surveys/{id}` | Detalle y borrador. |
| [API-COM-44-b](#API-COM-44-b) | PUT | `/api/com/surveys/{id}` | Detalle y borrador. |
| [API-COM-44-c](#API-COM-44-c) | GET | `/api/com/surveys/{id}/draft` | Detalle y borrador. |
| [API-COM-45](#API-COM-45) | POST | `/api/com/surveys/{id}/respond` | Enviar respuesta (clientMutationId). |
| [API-COM-46](#API-COM-46) | GET | `/api/public/{tenantSlug}/com/surveys/external/{token}` | Encuesta externa. |
| [API-COM-46-b](#API-COM-46-b) | POST | `/api/public/{tenantSlug}/com/surveys/external/{token}` | Encuesta externa. |
| [API-COM-46-c](#API-COM-46-c) | POST | `/api/public/{tenantSlug}/com/surveys/external/{token}/respond` | Encuesta externa. |
| [API-COM-46-d](#API-COM-46-d) | POST | `/api/public/{tenantSlug}/com/surveys/external/{token}/upload` | Encuesta externa. |
| [API-COM-47](#API-COM-47) | GET | `/api/admin/com/surveys` | Encuestas. |
| [API-COM-47-b](#API-COM-47-b) | POST | `/api/admin/com/surveys` | Encuestas. |
| [API-COM-47-c](#API-COM-47-c) | GET | `/api/admin/com/surveys/{id}` | Encuestas. |
| [API-COM-47-e](#API-COM-47-e) | DELETE | `/api/admin/com/surveys/{id}` | Encuestas. |
| [API-COM-47-d](#API-COM-47-d) | PATCH | `/api/admin/com/surveys/{id}` | Encuestas. |
| [API-COM-48](#API-COM-48) | POST | `/api/admin/com/surveys/{id}/publish` | Transiciones y utilidades. |
| [API-COM-48-b](#API-COM-48-b) | POST | `/api/admin/com/surveys/{id}/pause` | Transiciones y utilidades. |
| [API-COM-48-c](#API-COM-48-c) | POST | `/api/admin/com/surveys/{id}/close` | Transiciones y utilidades. |
| [API-COM-48-d](#API-COM-48-d) | POST | `/api/admin/com/surveys/{id}/reopen` | Transiciones y utilidades. |
| [API-COM-48-e](#API-COM-48-e) | POST | `/api/admin/com/surveys/{id}/archive` | Transiciones y utilidades. |
| [API-COM-48-f](#API-COM-48-f) | POST | `/api/admin/com/surveys/{id}/duplicate` | Transiciones y utilidades. |
| [API-COM-48-g](#API-COM-48-g) | POST | `/api/admin/com/surveys/{id}/restore-version` | Transiciones y utilidades. |
| [API-COM-48-h](#API-COM-48-h) | POST | `/api/admin/com/surveys/{id}/anonymize-responses` | Transiciones y utilidades. |
| [API-COM-48-i](#API-COM-48-i) | POST | `/api/admin/com/surveys/{id}/save-as-template` | Transiciones y utilidades. |
| [API-COM-49](#API-COM-49) | POST | `/api/admin/com/surveys/generate` | IA (propone). |
| [API-COM-49-b](#API-COM-49-b) | POST | `/api/admin/com/surveys/generate-questions` | IA (propone). |
| [API-COM-50](#API-COM-50) | GET | `/api/admin/com/surveys/{id}/results` | Resultados, inteligencia, exportación auditada. |
| [API-COM-50-b](#API-COM-50-b) | GET | `/api/admin/com/surveys/{id}/stats` | Resultados, inteligencia, exportación auditada. |
| [API-COM-50-c](#API-COM-50-c) | GET | `/api/admin/com/surveys/{id}/compare` | Resultados, inteligencia, exportación auditada. |
| [API-COM-50-d](#API-COM-50-d) | GET | `/api/admin/com/surveys/{id}/intelligence` | Resultados, inteligencia, exportación auditada. |
| [API-COM-50-e](#API-COM-50-e) | GET | `/api/admin/com/surveys/{id}/export` | Resultados, inteligencia, exportación auditada. |
| [API-COM-51](#API-COM-51) | GET | `/api/admin/com/surveys/{id}/qr` | Link y QR. |
| [API-COM-51-b](#API-COM-51-b) | GET | `/api/admin/com/surveys/{id}/external-link` | Link y QR. |
| [API-COM-52](#API-COM-52) | GET | `/api/admin/com/survey-templates` | Plantillas y categorías. |
| [API-COM-52-b](#API-COM-52-b) | POST | `/api/admin/com/survey-templates` | Plantillas y categorías. |
| [API-COM-52-c](#API-COM-52-c) | GET | `/api/admin/com/survey-templates/{id}` | Plantillas y categorías. |
| [API-COM-52-e](#API-COM-52-e) | DELETE | `/api/admin/com/survey-templates/{id}` | Plantillas y categorías. |
| [API-COM-52-d](#API-COM-52-d) | PATCH | `/api/admin/com/survey-templates/{id}` | Plantillas y categorías. |
| [API-COM-52-f](#API-COM-52-f) | GET | `/api/admin/com/survey-categories` | Plantillas y categorías. |
| [API-COM-52-g](#API-COM-52-g) | POST | `/api/admin/com/survey-categories` | Plantillas y categorías. |
| [API-COM-52-h](#API-COM-52-h) | GET | `/api/admin/com/survey-categories/{id}` | Plantillas y categorías. |
| [API-COM-52-j](#API-COM-52-j) | DELETE | `/api/admin/com/survey-categories/{id}` | Plantillas y categorías. |
| [API-COM-52-i](#API-COM-52-i) | PATCH | `/api/admin/com/survey-categories/{id}` | Plantillas y categorías. |
| [API-COM-53](#API-COM-53) | POST | `/api/admin/com/surveys/{id}/responses/{rid}/invalidate` | Invalidar respuesta. |
| [API-COM-54](#API-COM-54) | GET | `/api/com/agenda` | Eventos + citas del socio (proxy a M09/M10). |
| [API-COM-55](#API-COM-55) | POST | `/api/com/events/{id}/registration` | Inscribirse / cancelar. |
| [API-COM-55-b](#API-COM-55-b) | DELETE | `/api/com/events/{id}/registration` | Inscribirse / cancelar. |
| [API-COM-56](#API-COM-56) | GET | `/api/com/events/{id}/ics` | Archivo ICS. |
| [API-COM-57](#API-COM-57) | GET | `/api/admin/com/events` | Gestión de eventos. |
| [API-COM-57-b](#API-COM-57-b) | POST | `/api/admin/com/events` | Gestión de eventos. |
| [API-COM-57-c](#API-COM-57-c) | GET | `/api/admin/com/events/{id}` | Gestión de eventos. |
| [API-COM-57-e](#API-COM-57-e) | DELETE | `/api/admin/com/events/{id}` | Gestión de eventos. |
| [API-COM-57-d](#API-COM-57-d) | PATCH | `/api/admin/com/events/{id}` | Gestión de eventos. |
| [API-COM-57-f](#API-COM-57-f) | POST | `/api/admin/com/events/{id}/registrations` | Gestión de eventos. |
| [API-COM-57-g](#API-COM-57-g) | POST | `/api/admin/com/events/{id}/check-in` | Gestión de eventos. |
| [API-COM-57-h](#API-COM-57-h) | POST | `/api/admin/com/events/{id}/publish` | Gestión de eventos. |
| [API-COM-57-i](#API-COM-57-i) | POST | `/api/admin/com/events/{id}/cancel` | Gestión de eventos. |
| [API-COM-58](#API-COM-58) | GET | `/api/com/benefits` | Beneficios elegibles y mis códigos. |
| [API-COM-58-b](#API-COM-58-b) | GET | `/api/com/mine` | Beneficios elegibles y mis códigos. |
| [API-COM-59](#API-COM-59) | POST | `/api/com/benefits/{id}/redemptions` | Emitir código. |
| [API-COM-60](#API-COM-60) | GET | `/api/admin/com/benefits` | Gestión. |
| [API-COM-60-b](#API-COM-60-b) | POST | `/api/admin/com/benefits` | Gestión. |
| [API-COM-60-c](#API-COM-60-c) | GET | `/api/admin/com/benefits/{id}` | Gestión. |
| [API-COM-60-e](#API-COM-60-e) | DELETE | `/api/admin/com/benefits/{id}` | Gestión. |
| [API-COM-60-d](#API-COM-60-d) | PATCH | `/api/admin/com/benefits/{id}` | Gestión. |
| [API-COM-60-f](#API-COM-60-f) | GET | `/api/admin/com/benefit-partners` | Gestión. |
| [API-COM-60-g](#API-COM-60-g) | POST | `/api/admin/com/benefit-partners` | Gestión. |
| [API-COM-60-h](#API-COM-60-h) | GET | `/api/admin/com/benefit-partners/{id}` | Gestión. |
| [API-COM-60-j](#API-COM-60-j) | DELETE | `/api/admin/com/benefit-partners/{id}` | Gestión. |
| [API-COM-60-i](#API-COM-60-i) | PATCH | `/api/admin/com/benefit-partners/{id}` | Gestión. |
| [API-COM-61](#API-COM-61) | POST | `/api/admin/com/benefits/redemptions/validate` | Validar canje. |
| [API-COM-61-b](#API-COM-61-b) | POST | `/api/public/{tenantSlug}/com/benefits/validate/{partnerToken}` | Validar canje. |

<a id="API-COM-40"></a>
#### API-COM-40 · `GET /api/com/newsletters`

- **Qué hace:** Boletines recibidos. Lista, con filtros y paginación, los registros de boletines (`newsletters`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.wall.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de boletines (`newsletters`) con `total`.
- **Pantallas:** PAN-POR-55 (Muro), PAN-POR-56 (Novedades y boletines), PAN-POR-105 (Comunidad) y 4 más.
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2415 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-40)

<a id="API-COM-40-b"></a>
#### API-COM-40-b · `GET /api/com/newsletters/{id}`

- **Qué hace:** Boletines recibidos. Obtiene el detalle de un registro de boletines (`newsletters`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.wall.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de boletines (`newsletters`).
- **Pantallas:** PAN-POR-55 (Muro), PAN-POR-56 (Novedades y boletines), PAN-POR-105 (Comunidad) y 4 más.
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2415 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-40-b)

<a id="API-COM-41"></a>
#### API-COM-41 · `GET /api/admin/com/newsletter-rules`

- **Qué hace:** Reglas. Lista, con filtros y paginación, los registros de reglas de boletines (`newsletterRules`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.newsletters.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de reglas de boletines (`newsletterRules`) con `total`.
- **Pantallas:** PAN-COM-09 (Reglas de boletines).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2416 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-41)

<a id="API-COM-41-b"></a>
#### API-COM-41-b · `POST /api/admin/com/newsletter-rules`

- **Qué hace:** Reglas. Da de alta un registro de reglas de boletines (`newsletterRules`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.newsletters.configurar`.
- **Recibe:** los datos de reglas de boletines (`newsletterRules`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de reglas de boletines (`newsletterRules`).
- **Pantallas:** PAN-COM-09 (Reglas de boletines).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2416 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-41-b)

<a id="API-COM-41-c"></a>
#### API-COM-41-c · `GET /api/admin/com/newsletter-rules/{id}`

- **Qué hace:** Reglas. Obtiene el detalle de un registro de reglas de boletines (`newsletterRules`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.newsletters.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de reglas de boletines (`newsletterRules`).
- **Pantallas:** PAN-COM-09 (Reglas de boletines).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2416 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-41-c)

<a id="API-COM-41-e"></a>
#### API-COM-41-e · `DELETE /api/admin/com/newsletter-rules/{id}`

- **Qué hace:** Reglas. Elimina o da de baja un registro de reglas de boletines (`newsletterRules`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.newsletters.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-COM-09 (Reglas de boletines).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2416 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-41-e)

<a id="API-COM-41-d"></a>
#### API-COM-41-d · `PATCH /api/admin/com/newsletter-rules/{id}`

- **Qué hace:** Reglas. Modifica algunos campos de un registro de reglas de boletines (`newsletterRules`) (solo los enviados).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.newsletters.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de reglas de boletines (`newsletterRules`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de reglas de boletines (`newsletterRules`).
- **Pantallas:** PAN-COM-09 (Reglas de boletines).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2416 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-41-d)

<a id="API-COM-41-f"></a>
#### API-COM-41-f · `POST /api/admin/com/newsletter-rules/{id}/preview`

- **Qué hace:** Reglas. Previsualiza sin efectos un registro de reglas de boletines (`newsletterRules`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.newsletters.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-09 (Reglas de boletines).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2416 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-41-f)

<a id="API-COM-42"></a>
#### API-COM-42 · `GET /api/admin/com/newsletters`

- **Qué hace:** Boletines. Lista, con filtros y paginación, los registros de boletines (`newsletters`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.newsletters.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de boletines (`newsletters`) con `total`.
- **Pantallas:** PAN-COM-08 (Boletines).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2417 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-42)

<a id="API-COM-42-b"></a>
#### API-COM-42-b · `POST /api/admin/com/newsletters`

- **Qué hace:** Boletines. Da de alta un registro de boletines (`newsletters`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.newsletters.configurar`.
- **Recibe:** los datos de boletines (`newsletters`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de boletines (`newsletters`).
- **Pantallas:** PAN-COM-09 (Reglas de boletines).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2417 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-42-b)

<a id="API-COM-42-c"></a>
#### API-COM-42-c · `PATCH /api/admin/com/newsletters`

- **Qué hace:** Boletines. Modifica algunos campos de un registro de boletines (`newsletters`) (solo los enviados).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.newsletters.configurar`.
- **Recibe:** solo los campos a cambiar de boletines (`newsletters`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de boletines (`newsletters`).
- **Pantallas:** PAN-COM-09 (Reglas de boletines).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2417 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-42-c)

<a id="API-COM-42-d"></a>
#### API-COM-42-d · `GET /api/admin/com/newsletters/{id}`

- **Qué hace:** Boletines. Obtiene el detalle de un registro de boletines (`newsletters`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.newsletters.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de boletines (`newsletters`).
- **Pantallas:** PAN-COM-08 (Boletines).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2417 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-42-d)

<a id="API-COM-42-e"></a>
#### API-COM-42-e · `PATCH /api/admin/com/newsletters/{id}`

- **Qué hace:** Boletines. Modifica algunos campos de un registro de boletines (`newsletters`) (solo los enviados).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.newsletters.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de boletines (`newsletters`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de boletines (`newsletters`).
- **Pantallas:** PAN-COM-09 (Reglas de boletines).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2417 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-42-e)

<a id="API-COM-42-f"></a>
#### API-COM-42-f · `POST /api/admin/com/newsletters/{id}/approve`

- **Qué hace:** Boletines. Aprueba un registro de boletines (`newsletters`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.newsletters.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-09 (Reglas de boletines).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2417 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-42-f)

<a id="API-COM-42-g"></a>
#### API-COM-42-g · `POST /api/admin/com/newsletters/{id}/reject`

- **Qué hace:** Boletines. Rechaza un registro de boletines (`newsletters`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.newsletters.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-09 (Reglas de boletines).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2417 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-42-g)

<a id="API-COM-42-h"></a>
#### API-COM-42-h · `POST /api/admin/com/newsletters/{id}/cancel`

- **Qué hace:** Boletines. Cancela un registro de boletines (`newsletters`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.newsletters.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-09 (Reglas de boletines).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2417 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-42-h)

<a id="API-COM-42-i"></a>
#### API-COM-42-i · `POST /api/admin/com/newsletters/{id}/send`

- **Qué hace:** Boletines. Envía un registro de boletines (`newsletters`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.newsletters.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-09 (Reglas de boletines).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2417 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-42-i)

<a id="API-COM-42-j"></a>
#### API-COM-42-j · `POST /api/admin/com/newsletters/{id}/pdf`

- **Qué hace:** Boletines. Registra «pdf» sobre un registro de boletines (`newsletters`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.newsletters.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-09 (Reglas de boletines).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2417 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-42-j)

<a id="API-COM-42-k"></a>
#### API-COM-42-k · `POST /api/admin/com/newsletters/{id}/preview-html`

- **Qué hace:** Boletines. Registra «preview-html» sobre un registro de boletines (`newsletters`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.newsletters.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-09 (Reglas de boletines).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2417 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-42-k)

<a id="API-COM-42-l"></a>
#### API-COM-42-l · `GET /api/admin/com/suggest`

- **Qué hace:** Boletines. Consulta `suggest`.
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.newsletters.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-08 (Boletines).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2417 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-42-l)

<a id="API-COM-42-m"></a>
#### API-COM-42-m · `POST /api/admin/com/suggest`

- **Qué hace:** Boletines. Registra un nuevo elemento u operación en `suggest`.
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.newsletters.configurar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-09 (Reglas de boletines).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2417 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-42-m)

<a id="API-COM-42-n"></a>
#### API-COM-42-n · `PATCH /api/admin/com/suggest`

- **Qué hace:** Boletines. Modifica algunos campos de un registro de `suggest` (solo los enviados).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.newsletters.configurar`.
- **Recibe:** solo los campos a cambiar; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-09 (Reglas de boletines).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2417 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-42-n)

<a id="API-COM-43"></a>
#### API-COM-43 · `GET /api/com/surveys`

- **Qué hace:** Encuestas del usuario. Lista, con filtros y paginación, los registros de encuestas y votaciones no vinculantes (`surveys`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.surveys.responder`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de encuestas y votaciones no vinculantes (`surveys`) con `total`.
- **Pantallas:** PAN-POR-54 (Encuestas), PAN-POR-105 (Comunidad), PAN-COM-43 (Mis encuestas (PWA)).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2418 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-43)

<a id="API-COM-44"></a>
#### API-COM-44 · `GET /api/com/surveys/{id}`

- **Qué hace:** Detalle y borrador. Obtiene el detalle de un registro de encuestas y votaciones no vinculantes (`surveys`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. · RF-COM-063: Envío por el motor de comunicaciones (email + in-app), PDF y preview HTML; en la app lista de boletines y detalle tipo revista con “Abrir en el muro”. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.surveys.responder`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de encuestas y votaciones no vinculantes (`surveys`).
- **Pantallas:** PAN-POR-54 (Encuestas), PAN-POR-105 (Comunidad), PAN-COM-43 (Mis encuestas (PWA)).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2419 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-44)

<a id="API-COM-44-b"></a>
#### API-COM-44-b · `PUT /api/com/surveys/{id}`

- **Qué hace:** Detalle y borrador. Reemplaza o configura un registro de encuestas y votaciones no vinculantes (`surveys`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. · RF-COM-063: Envío por el motor de comunicaciones (email + in-app), PDF y preview HTML; en la app lista de boletines y detalle tipo revista con “Abrir en el muro”. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.surveys.responder`.
- **Recibe:** en la ruta `id`; los datos de encuestas y votaciones no vinculantes (`surveys`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de encuestas y votaciones no vinculantes (`surveys`).
- **Pantallas:** PAN-POR-54 (Encuestas), PAN-POR-105 (Comunidad), PAN-COM-43 (Mis encuestas (PWA)).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2419 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-44-b)

<a id="API-COM-44-c"></a>
#### API-COM-44-c · `GET /api/com/surveys/{id}/draft`

- **Qué hace:** Detalle y borrador. Consulta «draft» de un registro de encuestas y votaciones no vinculantes (`surveys`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. · RF-COM-063: Envío por el motor de comunicaciones (email + in-app), PDF y preview HTML; en la app lista de boletines y detalle tipo revista con “Abrir en el muro”. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.surveys.responder`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de encuestas y votaciones no vinculantes (`surveys`).
- **Pantallas:** PAN-POR-54 (Encuestas), PAN-POR-105 (Comunidad), PAN-COM-43 (Mis encuestas (PWA)).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2419 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-44-c)

<a id="API-COM-45"></a>
#### API-COM-45 · `POST /api/com/surveys/{id}/respond`

- **Qué hace:** Enviar respuesta (clientMutationId). Responde un registro de encuestas y votaciones no vinculantes (`surveys`).
- **Para qué sirve:** RF-COM-085: Vinculación de la respuesta con visita, orden, reclamo y servicio; estados de invitación (creada, entregada, abierta, respondida, vencida). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.surveys.responder`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-54 (Encuestas), PAN-POR-105 (Comunidad), PAN-COM-43 (Mis encuestas (PWA)).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2420 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-45)

<a id="API-COM-46"></a>
#### API-COM-46 · `GET /api/public/{tenantSlug}/com/surveys/external/{token}`

- **Qué hace:** Encuesta externa. Obtiene el detalle de un registro de encuestas y votaciones no vinculantes (`surveys`).
- **Para qué sirve:** RF-COM-018: Encuesta o votación embebida en una publicación (linkedSurveyId). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`, `token`.
- **Devuelve:** 200: el registro de encuestas y votaciones no vinculantes (`surveys`).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2421 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-46)

<a id="API-COM-46-b"></a>
#### API-COM-46-b · `POST /api/public/{tenantSlug}/com/surveys/external/{token}`

- **Qué hace:** Encuesta externa. Registra un nuevo elemento u operación en encuestas y votaciones no vinculantes (`surveys`).
- **Para qué sirve:** RF-COM-018: Encuesta o votación embebida en una publicación (linkedSurveyId). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`, `token`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2421 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-46-b)

<a id="API-COM-46-c"></a>
#### API-COM-46-c · `POST /api/public/{tenantSlug}/com/surveys/external/{token}/respond`

- **Qué hace:** Encuesta externa. Responde un registro de encuestas y votaciones no vinculantes (`surveys`).
- **Para qué sirve:** RF-COM-018: Encuesta o votación embebida en una publicación (linkedSurveyId). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`, `token`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2421 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-46-c)

<a id="API-COM-46-d"></a>
#### API-COM-46-d · `POST /api/public/{tenantSlug}/com/surveys/external/{token}/upload`

- **Qué hace:** Encuesta externa. Sube un archivo a un registro de encuestas y votaciones no vinculantes (`surveys`).
- **Para qué sirve:** RF-COM-018: Encuesta o votación embebida en una publicación (linkedSurveyId). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`, `token`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2421 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-46-d)

<a id="API-COM-47"></a>
#### API-COM-47 · `GET /api/admin/com/surveys`

- **Qué hace:** Encuestas. Lista, con filtros y paginación, los registros de encuestas y votaciones no vinculantes (`surveys`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.surveys.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de encuestas y votaciones no vinculantes (`surveys`) con `total`.
- **Pantallas:** PAN-COM-10 (Encuestas).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2422 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-47)

<a id="API-COM-47-b"></a>
#### API-COM-47-b · `POST /api/admin/com/surveys`

- **Qué hace:** Encuestas. Da de alta un registro de encuestas y votaciones no vinculantes (`surveys`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.surveys.crear`.
- **Recibe:** los datos de encuestas y votaciones no vinculantes (`surveys`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de encuestas y votaciones no vinculantes (`surveys`).
- **Pantallas:** PAN-COM-11 (Constructor de encuestas), PAN-COM-13 (Plantillas de encuestas).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2422 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-47-b)

<a id="API-COM-47-c"></a>
#### API-COM-47-c · `GET /api/admin/com/surveys/{id}`

- **Qué hace:** Encuestas. Obtiene el detalle de un registro de encuestas y votaciones no vinculantes (`surveys`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.surveys.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de encuestas y votaciones no vinculantes (`surveys`).
- **Pantallas:** PAN-COM-10 (Encuestas).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2422 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-47-c)

<a id="API-COM-47-e"></a>
#### API-COM-47-e · `DELETE /api/admin/com/surveys/{id}`

- **Qué hace:** Encuestas. Elimina o da de baja un registro de encuestas y votaciones no vinculantes (`surveys`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.surveys.crear`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-COM-11 (Constructor de encuestas), PAN-COM-13 (Plantillas de encuestas).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2422 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-47-e)

<a id="API-COM-47-d"></a>
#### API-COM-47-d · `PATCH /api/admin/com/surveys/{id}`

- **Qué hace:** Encuestas. Modifica algunos campos de un registro de encuestas y votaciones no vinculantes (`surveys`) (solo los enviados).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.surveys.crear`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de encuestas y votaciones no vinculantes (`surveys`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de encuestas y votaciones no vinculantes (`surveys`).
- **Pantallas:** PAN-COM-11 (Constructor de encuestas), PAN-COM-13 (Plantillas de encuestas).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2422 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-47-d)

<a id="API-COM-48"></a>
#### API-COM-48 · `POST /api/admin/com/surveys/{id}/publish`

- **Qué hace:** Transiciones y utilidades. Publica un registro de encuestas y votaciones no vinculantes (`surveys`).
- **Para qué sirve:** RF-COM-018: Encuesta o votación embebida en una publicación (linkedSurveyId). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.surveys.publicar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2423 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-48)

<a id="API-COM-48-b"></a>
#### API-COM-48-b · `POST /api/admin/com/surveys/{id}/pause`

- **Qué hace:** Transiciones y utilidades. Pausa un registro de encuestas y votaciones no vinculantes (`surveys`).
- **Para qué sirve:** RF-COM-018: Encuesta o votación embebida en una publicación (linkedSurveyId). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.surveys.publicar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2423 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-48-b)

<a id="API-COM-48-c"></a>
#### API-COM-48-c · `POST /api/admin/com/surveys/{id}/close`

- **Qué hace:** Transiciones y utilidades. Cierra un registro de encuestas y votaciones no vinculantes (`surveys`).
- **Para qué sirve:** RF-COM-018: Encuesta o votación embebida en una publicación (linkedSurveyId). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.surveys.publicar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2423 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-48-c)

<a id="API-COM-48-d"></a>
#### API-COM-48-d · `POST /api/admin/com/surveys/{id}/reopen`

- **Qué hace:** Transiciones y utilidades. Reabre un registro de encuestas y votaciones no vinculantes (`surveys`).
- **Para qué sirve:** RF-COM-018: Encuesta o votación embebida en una publicación (linkedSurveyId). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.surveys.publicar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2423 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-48-d)

<a id="API-COM-48-e"></a>
#### API-COM-48-e · `POST /api/admin/com/surveys/{id}/archive`

- **Qué hace:** Transiciones y utilidades. Archiva un registro de encuestas y votaciones no vinculantes (`surveys`).
- **Para qué sirve:** RF-COM-018: Encuesta o votación embebida en una publicación (linkedSurveyId). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.surveys.publicar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2423 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-48-e)

<a id="API-COM-48-f"></a>
#### API-COM-48-f · `POST /api/admin/com/surveys/{id}/duplicate`

- **Qué hace:** Transiciones y utilidades. Duplica un registro de encuestas y votaciones no vinculantes (`surveys`).
- **Para qué sirve:** RF-COM-018: Encuesta o votación embebida en una publicación (linkedSurveyId). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.surveys.publicar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2423 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-48-f)

<a id="API-COM-48-g"></a>
#### API-COM-48-g · `POST /api/admin/com/surveys/{id}/restore-version`

- **Qué hace:** Transiciones y utilidades. Registra «restore-version» sobre un registro de encuestas y votaciones no vinculantes (`surveys`).
- **Para qué sirve:** RF-COM-018: Encuesta o votación embebida en una publicación (linkedSurveyId). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.surveys.publicar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2423 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-48-g)

<a id="API-COM-48-h"></a>
#### API-COM-48-h · `POST /api/admin/com/surveys/{id}/anonymize-responses`

- **Qué hace:** Transiciones y utilidades. Registra «anonymize-responses» sobre un registro de encuestas y votaciones no vinculantes (`surveys`).
- **Para qué sirve:** RF-COM-018: Encuesta o votación embebida en una publicación (linkedSurveyId). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.surveys.publicar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2423 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-48-h)

<a id="API-COM-48-i"></a>
#### API-COM-48-i · `POST /api/admin/com/surveys/{id}/save-as-template`

- **Qué hace:** Transiciones y utilidades. Registra «save-as-template» sobre un registro de encuestas y votaciones no vinculantes (`surveys`).
- **Para qué sirve:** RF-COM-018: Encuesta o votación embebida en una publicación (linkedSurveyId). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.surveys.publicar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2423 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-48-i)

<a id="API-COM-49"></a>
#### API-COM-49 · `POST /api/admin/com/surveys/generate`

- **Qué hace:** IA (propone). Genera sobre encuestas y votaciones no vinculantes (`surveys`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.surveys.crear`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-11 (Constructor de encuestas), PAN-COM-13 (Plantillas de encuestas).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2424 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-49)

<a id="API-COM-49-b"></a>
#### API-COM-49-b · `POST /api/admin/com/surveys/generate-questions`

- **Qué hace:** IA (propone). Registra un nuevo elemento u operación en encuestas y votaciones no vinculantes (`surveys`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.surveys.crear`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-11 (Constructor de encuestas), PAN-COM-13 (Plantillas de encuestas).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2424 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-49-b)

<a id="API-COM-50"></a>
#### API-COM-50 · `GET /api/admin/com/surveys/{id}/results`

- **Qué hace:** Resultados, inteligencia, exportación auditada. Consulta «results» de un registro de encuestas y votaciones no vinculantes (`surveys`).
- **Para qué sirve:** RF-COM-018: Encuesta o votación embebida en una publicación (linkedSurveyId). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.surveys.exportar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de encuestas y votaciones no vinculantes (`surveys`).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2425 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-50)

<a id="API-COM-50-b"></a>
#### API-COM-50-b · `GET /api/admin/com/surveys/{id}/stats`

- **Qué hace:** Resultados, inteligencia, exportación auditada. Consulta «stats» de un registro de encuestas y votaciones no vinculantes (`surveys`).
- **Para qué sirve:** RF-COM-018: Encuesta o votación embebida en una publicación (linkedSurveyId). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.surveys.exportar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de encuestas y votaciones no vinculantes (`surveys`).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2425 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-50-b)

<a id="API-COM-50-c"></a>
#### API-COM-50-c · `GET /api/admin/com/surveys/{id}/compare`

- **Qué hace:** Resultados, inteligencia, exportación auditada. Consulta «compare» de un registro de encuestas y votaciones no vinculantes (`surveys`).
- **Para qué sirve:** RF-COM-018: Encuesta o votación embebida en una publicación (linkedSurveyId). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.surveys.exportar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de encuestas y votaciones no vinculantes (`surveys`).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2425 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-50-c)

<a id="API-COM-50-d"></a>
#### API-COM-50-d · `GET /api/admin/com/surveys/{id}/intelligence`

- **Qué hace:** Resultados, inteligencia, exportación auditada. Consulta «intelligence» de un registro de encuestas y votaciones no vinculantes (`surveys`).
- **Para qué sirve:** RF-COM-018: Encuesta o votación embebida en una publicación (linkedSurveyId). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.surveys.exportar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de encuestas y votaciones no vinculantes (`surveys`).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2425 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-50-d)

<a id="API-COM-50-e"></a>
#### API-COM-50-e · `GET /api/admin/com/surveys/{id}/export`

- **Qué hace:** Resultados, inteligencia, exportación auditada. Descarga un archivo de encuestas y votaciones no vinculantes (`surveys`).
- **Para qué sirve:** RF-COM-018: Encuesta o votación embebida en una publicación (linkedSurveyId). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.surveys.exportar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un archivo (application/octet-stream).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2425 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-50-e)

<a id="API-COM-51"></a>
#### API-COM-51 · `GET /api/admin/com/surveys/{id}/qr`

- **Qué hace:** Link y QR. Consulta «qr» de un registro de encuestas y votaciones no vinculantes (`surveys`).
- **Para qué sirve:** RF-COM-018: Encuesta o votación embebida en una publicación (linkedSurveyId). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.surveys.publicar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de encuestas y votaciones no vinculantes (`surveys`).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2426 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-51)

<a id="API-COM-51-b"></a>
#### API-COM-51-b · `GET /api/admin/com/surveys/{id}/external-link`

- **Qué hace:** Link y QR. Consulta «external-link» de un registro de encuestas y votaciones no vinculantes (`surveys`).
- **Para qué sirve:** RF-COM-018: Encuesta o votación embebida en una publicación (linkedSurveyId). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.surveys.publicar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de encuestas y votaciones no vinculantes (`surveys`).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2426 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-51-b)

<a id="API-COM-52"></a>
#### API-COM-52 · `GET /api/admin/com/survey-templates`

- **Qué hace:** Plantillas y categorías. Lista, con filtros y paginación, los registros de plantillas de encuesta (`surveyTemplates`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.surveys.crear`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de plantillas de encuesta (`surveyTemplates`) con `total`.
- **Pantallas:** PAN-COM-11 (Constructor de encuestas), PAN-COM-13 (Plantillas de encuestas).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2427 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-52)

<a id="API-COM-52-b"></a>
#### API-COM-52-b · `POST /api/admin/com/survey-templates`

- **Qué hace:** Plantillas y categorías. Da de alta un registro de plantillas de encuesta (`surveyTemplates`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.surveys.crear`.
- **Recibe:** los datos de plantillas de encuesta (`surveyTemplates`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de plantillas de encuesta (`surveyTemplates`).
- **Pantallas:** PAN-COM-11 (Constructor de encuestas), PAN-COM-13 (Plantillas de encuestas).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2427 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-52-b)

<a id="API-COM-52-c"></a>
#### API-COM-52-c · `GET /api/admin/com/survey-templates/{id}`

- **Qué hace:** Plantillas y categorías. Obtiene el detalle de un registro de plantillas de encuesta (`surveyTemplates`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.surveys.crear`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de plantillas de encuesta (`surveyTemplates`).
- **Pantallas:** PAN-COM-11 (Constructor de encuestas), PAN-COM-13 (Plantillas de encuestas).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2427 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-52-c)

<a id="API-COM-52-e"></a>
#### API-COM-52-e · `DELETE /api/admin/com/survey-templates/{id}`

- **Qué hace:** Plantillas y categorías. Elimina o da de baja un registro de plantillas de encuesta (`surveyTemplates`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.surveys.crear`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-COM-11 (Constructor de encuestas), PAN-COM-13 (Plantillas de encuestas).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2427 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-52-e)

<a id="API-COM-52-d"></a>
#### API-COM-52-d · `PATCH /api/admin/com/survey-templates/{id}`

- **Qué hace:** Plantillas y categorías. Modifica algunos campos de un registro de plantillas de encuesta (`surveyTemplates`) (solo los enviados).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.surveys.crear`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de plantillas de encuesta (`surveyTemplates`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de plantillas de encuesta (`surveyTemplates`).
- **Pantallas:** PAN-COM-11 (Constructor de encuestas), PAN-COM-13 (Plantillas de encuestas).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2427 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-52-d)

<a id="API-COM-52-f"></a>
#### API-COM-52-f · `GET /api/admin/com/survey-categories`

- **Qué hace:** Plantillas y categorías. Lista, con filtros y paginación, los registros de categorías de encuesta (`surveyCategories`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.surveys.crear`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de categorías de encuesta (`surveyCategories`) con `total`.
- **Pantallas:** PAN-COM-11 (Constructor de encuestas), PAN-COM-13 (Plantillas de encuestas).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2427 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-52-f)

<a id="API-COM-52-g"></a>
#### API-COM-52-g · `POST /api/admin/com/survey-categories`

- **Qué hace:** Plantillas y categorías. Da de alta un registro de categorías de encuesta (`surveyCategories`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.surveys.crear`.
- **Recibe:** los datos de categorías de encuesta (`surveyCategories`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de categorías de encuesta (`surveyCategories`).
- **Pantallas:** PAN-COM-11 (Constructor de encuestas), PAN-COM-13 (Plantillas de encuestas).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2427 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-52-g)

<a id="API-COM-52-h"></a>
#### API-COM-52-h · `GET /api/admin/com/survey-categories/{id}`

- **Qué hace:** Plantillas y categorías. Obtiene el detalle de un registro de categorías de encuesta (`surveyCategories`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.surveys.crear`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de categorías de encuesta (`surveyCategories`).
- **Pantallas:** PAN-COM-11 (Constructor de encuestas), PAN-COM-13 (Plantillas de encuestas).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2427 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-52-h)

<a id="API-COM-52-j"></a>
#### API-COM-52-j · `DELETE /api/admin/com/survey-categories/{id}`

- **Qué hace:** Plantillas y categorías. Elimina o da de baja un registro de categorías de encuesta (`surveyCategories`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.surveys.crear`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-COM-11 (Constructor de encuestas), PAN-COM-13 (Plantillas de encuestas).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2427 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-52-j)

<a id="API-COM-52-i"></a>
#### API-COM-52-i · `PATCH /api/admin/com/survey-categories/{id}`

- **Qué hace:** Plantillas y categorías. Modifica algunos campos de un registro de categorías de encuesta (`surveyCategories`) (solo los enviados).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.surveys.crear`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de categorías de encuesta (`surveyCategories`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de categorías de encuesta (`surveyCategories`).
- **Pantallas:** PAN-COM-11 (Constructor de encuestas), PAN-COM-13 (Plantillas de encuestas).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2427 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-52-i)

<a id="API-COM-53"></a>
#### API-COM-53 · `POST /api/admin/com/surveys/{id}/responses/{rid}/invalidate`

- **Qué hace:** Invalidar respuesta. Registra «invalidate» sobre un registro de encuestas y votaciones no vinculantes (`surveys`).
- **Para qué sirve:** RF-COM-088: Votación rápida (kind=poll): una pregunta single/multiple, resultado visible opcional (al votar / al cerrar / nunca), embebible en publicación. · RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.surveys.cerrar`.
- **Recibe:** en la ruta `id`, `rid`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2428 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-53)

<a id="API-COM-54"></a>
#### API-COM-54 · `GET /api/com/agenda`

- **Qué hace:** Eventos + citas del socio (proxy a M09/M10). Consulta `agenda`.
- **Para qué sirve:** RF-COM-103: Agenda PWA (/agenda) que une eventos de la cooperativa y citas del socio provistas por M10/M09 (visitas, turnos) sin duplicar dueños. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.events.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-14 (Eventos e inscripciones), PAN-COM-45 (Agenda del socio (PWA)).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2429 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-54)

<a id="API-COM-55"></a>
#### API-COM-55 · `POST /api/com/events/{id}/registration`

- **Qué hace:** Inscribirse / cancelar. Registra «registration» sobre un registro de eventos de comunidad (`events`).
- **Para qué sirve:** RF-COM-102: Recordatorios de evento (D-1 y H-2 configurables), aviso de cancelación/cambio a inscriptos, archivo ICS. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.events.inscribirse`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2430 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-55)

<a id="API-COM-55-b"></a>
#### API-COM-55-b · `DELETE /api/com/events/{id}/registration`

- **Qué hace:** Inscribirse / cancelar. Elimina o da de baja un registro de eventos de comunidad (`events`).
- **Para qué sirve:** RF-COM-102: Recordatorios de evento (D-1 y H-2 configurables), aviso de cancelación/cambio a inscriptos, archivo ICS. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.events.inscribirse`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2430 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-55-b)

<a id="API-COM-56"></a>
#### API-COM-56 · `GET /api/com/events/{id}/ics`

- **Qué hace:** Archivo ICS. Consulta «ics» de un registro de eventos de comunidad (`events`).
- **Para qué sirve:** RF-COM-102: Recordatorios de evento (D-1 y H-2 configurables), aviso de cancelación/cambio a inscriptos, archivo ICS. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.events.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de eventos de comunidad (`events`).
- **Pantallas:** PAN-COM-14 (Eventos e inscripciones), PAN-COM-45 (Agenda del socio (PWA)).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2431 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-56)

<a id="API-COM-57"></a>
#### API-COM-57 · `GET /api/admin/com/events`

- **Qué hace:** Gestión de eventos. Lista, con filtros y paginación, los registros de eventos de comunidad (`events`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.events.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de eventos de comunidad (`events`) con `total`.
- **Pantallas:** PAN-COM-14 (Eventos e inscripciones), PAN-COM-45 (Agenda del socio (PWA)).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2432 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-57)

<a id="API-COM-57-b"></a>
#### API-COM-57-b · `POST /api/admin/com/events`

- **Qué hace:** Gestión de eventos. Da de alta un registro de eventos de comunidad (`events`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.events.gestionar`.
- **Recibe:** los datos de eventos de comunidad (`events`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de eventos de comunidad (`events`).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2432 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-57-b)

<a id="API-COM-57-c"></a>
#### API-COM-57-c · `GET /api/admin/com/events/{id}`

- **Qué hace:** Gestión de eventos. Obtiene el detalle de un registro de eventos de comunidad (`events`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.events.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de eventos de comunidad (`events`).
- **Pantallas:** PAN-COM-14 (Eventos e inscripciones), PAN-COM-45 (Agenda del socio (PWA)).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2432 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-57-c)

<a id="API-COM-57-e"></a>
#### API-COM-57-e · `DELETE /api/admin/com/events/{id}`

- **Qué hace:** Gestión de eventos. Elimina o da de baja un registro de eventos de comunidad (`events`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.events.gestionar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2432 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-57-e)

<a id="API-COM-57-d"></a>
#### API-COM-57-d · `PATCH /api/admin/com/events/{id}`

- **Qué hace:** Gestión de eventos. Modifica algunos campos de un registro de eventos de comunidad (`events`) (solo los enviados).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.events.gestionar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de eventos de comunidad (`events`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de eventos de comunidad (`events`).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2432 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-57-d)

<a id="API-COM-57-f"></a>
#### API-COM-57-f · `POST /api/admin/com/events/{id}/registrations`

- **Qué hace:** Gestión de eventos. Agrega un elemento («registrations») a un registro de eventos de comunidad (`events`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.events.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2432 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-57-f)

<a id="API-COM-57-g"></a>
#### API-COM-57-g · `POST /api/admin/com/events/{id}/check-in`

- **Qué hace:** Gestión de eventos. Registra la llegada de un registro de eventos de comunidad (`events`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.events.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2432 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-57-g)

<a id="API-COM-57-h"></a>
#### API-COM-57-h · `POST /api/admin/com/events/{id}/publish`

- **Qué hace:** Gestión de eventos. Publica un registro de eventos de comunidad (`events`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.events.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2432 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-57-h)

<a id="API-COM-57-i"></a>
#### API-COM-57-i · `POST /api/admin/com/events/{id}/cancel`

- **Qué hace:** Gestión de eventos. Cancela un registro de eventos de comunidad (`events`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.events.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2432 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-57-i)

<a id="API-COM-58"></a>
#### API-COM-58 · `GET /api/com/benefits`

- **Qué hace:** Beneficios elegibles y mis códigos. Lista, con filtros y paginación, los registros de beneficios del club (`benefits`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.benefits.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de beneficios del club (`benefits`) con `total`.
- **Pantallas:** PAN-COM-15 (Beneficios y comercios adheridos), PAN-COM-46 (Beneficios (PWA)).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2433 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-58)

<a id="API-COM-58-b"></a>
#### API-COM-58-b · `GET /api/com/mine`

- **Qué hace:** Beneficios elegibles y mis códigos. Consulta `mine`.
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.benefits.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-15 (Beneficios y comercios adheridos), PAN-COM-46 (Beneficios (PWA)).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2433 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-58-b)

<a id="API-COM-59"></a>
#### API-COM-59 · `POST /api/com/benefits/{id}/redemptions`

- **Qué hace:** Emitir código. Registra «redemptions» sobre un registro de beneficios del club (`benefits`).
- **Para qué sirve:** RF-COM-119: Prohibido segmentar por datos sensibles (salud, electrodependencia, banco de sangre, sepelio — beneficiarios —) en campañas marketing/community; solo módulos dueños pueden emitir transaccionales a esos universos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.benefits.canjear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2434 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-59)

<a id="API-COM-60"></a>
#### API-COM-60 · `GET /api/admin/com/benefits`

- **Qué hace:** Gestión. Lista, con filtros y paginación, los registros de beneficios del club (`benefits`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.benefits.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de beneficios del club (`benefits`) con `total`.
- **Pantallas:** PAN-COM-15 (Beneficios y comercios adheridos), PAN-COM-46 (Beneficios (PWA)).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2435 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-60)

<a id="API-COM-60-b"></a>
#### API-COM-60-b · `POST /api/admin/com/benefits`

- **Qué hace:** Gestión. Da de alta un registro de beneficios del club (`benefits`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.benefits.gestionar`.
- **Recibe:** los datos de beneficios del club (`benefits`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de beneficios del club (`benefits`).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2435 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-60-b)

<a id="API-COM-60-c"></a>
#### API-COM-60-c · `GET /api/admin/com/benefits/{id}`

- **Qué hace:** Gestión. Obtiene el detalle de un registro de beneficios del club (`benefits`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.benefits.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de beneficios del club (`benefits`).
- **Pantallas:** PAN-COM-15 (Beneficios y comercios adheridos), PAN-COM-46 (Beneficios (PWA)).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2435 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-60-c)

<a id="API-COM-60-e"></a>
#### API-COM-60-e · `DELETE /api/admin/com/benefits/{id}`

- **Qué hace:** Gestión. Elimina o da de baja un registro de beneficios del club (`benefits`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.benefits.gestionar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2435 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-60-e)

<a id="API-COM-60-d"></a>
#### API-COM-60-d · `PATCH /api/admin/com/benefits/{id}`

- **Qué hace:** Gestión. Modifica algunos campos de un registro de beneficios del club (`benefits`) (solo los enviados).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.benefits.gestionar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de beneficios del club (`benefits`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de beneficios del club (`benefits`).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2435 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-60-d)

<a id="API-COM-60-f"></a>
#### API-COM-60-f · `GET /api/admin/com/benefit-partners`

- **Qué hace:** Gestión. Lista, con filtros y paginación, los registros de comercios del club de beneficios (`benefitPartners`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.benefits.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de comercios del club de beneficios (`benefitPartners`) con `total`.
- **Pantallas:** PAN-COM-15 (Beneficios y comercios adheridos), PAN-COM-46 (Beneficios (PWA)).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2435 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-60-f)

<a id="API-COM-60-g"></a>
#### API-COM-60-g · `POST /api/admin/com/benefit-partners`

- **Qué hace:** Gestión. Da de alta un registro de comercios del club de beneficios (`benefitPartners`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.benefits.gestionar`.
- **Recibe:** los datos de comercios del club de beneficios (`benefitPartners`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de comercios del club de beneficios (`benefitPartners`).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2435 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-60-g)

<a id="API-COM-60-h"></a>
#### API-COM-60-h · `GET /api/admin/com/benefit-partners/{id}`

- **Qué hace:** Gestión. Obtiene el detalle de un registro de comercios del club de beneficios (`benefitPartners`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.benefits.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de comercios del club de beneficios (`benefitPartners`).
- **Pantallas:** PAN-COM-15 (Beneficios y comercios adheridos), PAN-COM-46 (Beneficios (PWA)).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2435 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-60-h)

<a id="API-COM-60-j"></a>
#### API-COM-60-j · `DELETE /api/admin/com/benefit-partners/{id}`

- **Qué hace:** Gestión. Elimina o da de baja un registro de comercios del club de beneficios (`benefitPartners`).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.benefits.gestionar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2435 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-60-j)

<a id="API-COM-60-i"></a>
#### API-COM-60-i · `PATCH /api/admin/com/benefit-partners/{id}`

- **Qué hace:** Gestión. Modifica algunos campos de un registro de comercios del club de beneficios (`benefitPartners`) (solo los enviados).
- **Para qué sirve:** RF-COM-011: “Tiras” embebidas en el muro: Tu última factura, Cortes programados en tu zona, Encuestas pendientes, Próximos eventos, Beneficios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.benefits.gestionar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de comercios del club de beneficios (`benefitPartners`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de comercios del club de beneficios (`benefitPartners`).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2435 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-60-i)

<a id="API-COM-61"></a>
#### API-COM-61 · `POST /api/admin/com/benefits/redemptions/validate`

- **Qué hace:** Validar canje. Valida sobre beneficios del club (`benefits`).
- **Para qué sirve:** RF-COM-105: Canje: emisión de código, validación por el comercio (pantalla de validación con capability com.benefits.validarCanje o link de validación tokenizado), estados issued → redeemed / expired / cancelled. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.benefits.validarCanje`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-16 (Validación de canje).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2436 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-61)

<a id="API-COM-61-b"></a>
#### API-COM-61-b · `POST /api/public/{tenantSlug}/com/benefits/validate/{partnerToken}`

- **Qué hace:** Validar canje. Registra un nuevo elemento u operación en beneficios del club (`benefits`).
- **Para qué sirve:** RF-COM-105: Canje: emisión de código, validación por el comercio (pantalla de validación con capability com.benefits.validarCanje o link de validación tokenizado), estados issued → redeemed / expired / cancelled. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); permiso `com.benefits.validarCanje`.
- **Recibe:** en la ruta `tenantSlug`, `partnerToken`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-16 (Validación de canje).
- **Ola:** O2 · **Fuente:** T09 §11.2 Boletines, encuestas, eventos y beneficios, línea 2436 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Boletines%2C%20encuestas%2C%20eventos%20y%20beneficios/API-COM-61-b)

<a id="grupo-3"></a>

## Audiencias

13 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-COM-65](#API-COM-65) | GET | `/api/admin/com/audiences/options` | Dimensiones y valores permitidos (recortados al grant y a la finalidad). |
| [API-COM-66](#API-COM-66) | POST | `/api/admin/com/audiences/normalize` | Normaliza y recorta (clampAudienceToGrant); devuelve diff y resumen legible. |
| [API-COM-67](#API-COM-67) | POST | `/api/admin/com/audiences/preview` | Vista previa de alcance (conteos por canal, excluidos por motivo, muestra de 20, costo). |
| [API-COM-68](#API-COM-68) | GET | `/api/admin/com/segments` | Segmentos. |
| [API-COM-68-b](#API-COM-68-b) | POST | `/api/admin/com/segments` | Segmentos. |
| [API-COM-68-c](#API-COM-68-c) | GET | `/api/admin/com/segments/{id}` | Segmentos. |
| [API-COM-68-e](#API-COM-68-e) | DELETE | `/api/admin/com/segments/{id}` | Segmentos. |
| [API-COM-68-d](#API-COM-68-d) | PATCH | `/api/admin/com/segments/{id}` | Segmentos. |
| [API-COM-69](#API-COM-69) | POST | `/api/admin/com/audience-imports` | Importación de listas (ExcelImportWizard). |
| [API-COM-69-b](#API-COM-69-b) | POST | `/api/admin/com/audience-imports/{id}/confirm` | Importación de listas (ExcelImportWizard). |
| [API-COM-69-c](#API-COM-69-c) | POST | `/api/admin/com/audience-imports/{id}/rows` | Importación de listas (ExcelImportWizard). |
| [API-COM-70](#API-COM-70) | POST | `/api/admin/com/audiences/export` | Exportación IVR / herramienta externa (auditada). |
| [API-COM-71](#API-COM-71) | POST | `/api/internal/com/audiences/match` | UserMatchesAudience para otros módulos (M19, M09). |

<a id="API-COM-65"></a>
#### API-COM-65 · `GET /api/admin/com/audiences/options`

- **Qué hace:** Dimensiones y valores permitidos (recortados al grant y a la finalidad). Consulta `options`.
- **Para qué sirve:** RF-COM-113: clampAudienceToGrant: toda audiencia se intersecta con el alcance del emisor al guardar, publicar y enviar; si el recorte cambia el alcance se informa al usuario. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.audiences.usar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-17 (Segmentos guardados y listas importadas).
- **Ola:** O2 · **Fuente:** T09 §11.3 Audiencias, línea 2442 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Audiencias/API-COM-65)

<a id="API-COM-66"></a>
#### API-COM-66 · `POST /api/admin/com/audiences/normalize`

- **Qué hace:** Normaliza y recorta (clampAudienceToGrant); devuelve diff y resumen legible. Registra un nuevo elemento u operación en `normalize`.
- **Para qué sirve:** RF-COM-113: clampAudienceToGrant: toda audiencia se intersecta con el alcance del emisor al guardar, publicar y enviar; si el recorte cambia el alcance se informa al usuario. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.audiences.usar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-17 (Segmentos guardados y listas importadas).
- **Ola:** O2 · **Fuente:** T09 §11.3 Audiencias, línea 2443 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Audiencias/API-COM-66)

<a id="API-COM-67"></a>
#### API-COM-67 · `POST /api/admin/com/audiences/preview`

- **Qué hace:** Vista previa de alcance (conteos por canal, excluidos por motivo, muestra de 20, costo). Previsualiza sin efectos sobre `preview`.
- **Para qué sirve:** RF-COM-115: Vista previa de alcance: total de personas, cuentas y servicios; desglose por canal efectivo (email, SMS, WhatsApp, push, in-app, impreso) después de aplicar preferencias, consentimientos y supresión; excluidos por motivo (sin… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.audiences.usar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-17 (Segmentos guardados y listas importadas).
- **Ola:** O2 · **Fuente:** T09 §11.3 Audiencias, línea 2444 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Audiencias/API-COM-67)

<a id="API-COM-68"></a>
#### API-COM-68 · `GET /api/admin/com/segments`

- **Qué hace:** Segmentos. Lista, con filtros y paginación, los registros de motor único de audiencias (`audienceSegments`).
- **Para qué sirve:** RF-COM-079: Audiencia por motor único con snapshot al publicar (invitados) o lista importada (Excel/CSV vía ExcelImportWizard). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.audiences.usar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de motor único de audiencias (`audienceSegments`) con `total`.
- **Pantallas:** PAN-COM-17 (Segmentos guardados y listas importadas).
- **Ola:** O2 · **Fuente:** T09 §11.3 Audiencias, línea 2445 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Audiencias/API-COM-68)

<a id="API-COM-68-b"></a>
#### API-COM-68-b · `POST /api/admin/com/segments`

- **Qué hace:** Segmentos. Da de alta un registro de motor único de audiencias (`audienceSegments`).
- **Para qué sirve:** RF-COM-079: Audiencia por motor único con snapshot al publicar (invitados) o lista importada (Excel/CSV vía ExcelImportWizard). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.audiences.usar`.
- **Recibe:** los datos de motor único de audiencias (`audienceSegments`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de motor único de audiencias (`audienceSegments`).
- **Pantallas:** PAN-COM-17 (Segmentos guardados y listas importadas).
- **Ola:** O2 · **Fuente:** T09 §11.3 Audiencias, línea 2445 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Audiencias/API-COM-68-b)

<a id="API-COM-68-c"></a>
#### API-COM-68-c · `GET /api/admin/com/segments/{id}`

- **Qué hace:** Segmentos. Obtiene el detalle de un registro de motor único de audiencias (`audienceSegments`).
- **Para qué sirve:** RF-COM-079: Audiencia por motor único con snapshot al publicar (invitados) o lista importada (Excel/CSV vía ExcelImportWizard). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.audiences.usar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de motor único de audiencias (`audienceSegments`).
- **Pantallas:** PAN-COM-17 (Segmentos guardados y listas importadas).
- **Ola:** O2 · **Fuente:** T09 §11.3 Audiencias, línea 2445 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Audiencias/API-COM-68-c)

<a id="API-COM-68-e"></a>
#### API-COM-68-e · `DELETE /api/admin/com/segments/{id}`

- **Qué hace:** Segmentos. Elimina o da de baja un registro de motor único de audiencias (`audienceSegments`).
- **Para qué sirve:** RF-COM-079: Audiencia por motor único con snapshot al publicar (invitados) o lista importada (Excel/CSV vía ExcelImportWizard). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.audiences.usar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-COM-17 (Segmentos guardados y listas importadas).
- **Ola:** O2 · **Fuente:** T09 §11.3 Audiencias, línea 2445 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Audiencias/API-COM-68-e)

<a id="API-COM-68-d"></a>
#### API-COM-68-d · `PATCH /api/admin/com/segments/{id}`

- **Qué hace:** Segmentos. Modifica algunos campos de un registro de motor único de audiencias (`audienceSegments`) (solo los enviados).
- **Para qué sirve:** RF-COM-079: Audiencia por motor único con snapshot al publicar (invitados) o lista importada (Excel/CSV vía ExcelImportWizard). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.audiences.usar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de motor único de audiencias (`audienceSegments`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de motor único de audiencias (`audienceSegments`).
- **Pantallas:** PAN-COM-17 (Segmentos guardados y listas importadas).
- **Ola:** O2 · **Fuente:** T09 §11.3 Audiencias, línea 2445 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Audiencias/API-COM-68-d)

<a id="API-COM-69"></a>
#### API-COM-69 · `POST /api/admin/com/audience-imports`

- **Qué hace:** Importación de listas (ExcelImportWizard). Registra un nuevo elemento u operación en `audience-imports`.
- **Para qué sirve:** RF-COM-079: Audiencia por motor único con snapshot al publicar (invitados) o lista importada (Excel/CSV vía ExcelImportWizard). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.audiences.usar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-17 (Segmentos guardados y listas importadas).
- **Ola:** O2 · **Fuente:** T09 §11.3 Audiencias, línea 2446 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Audiencias/API-COM-69)

<a id="API-COM-69-b"></a>
#### API-COM-69-b · `POST /api/admin/com/audience-imports/{id}/confirm`

- **Qué hace:** Importación de listas (ExcelImportWizard). Confirma un registro de `confirm`.
- **Para qué sirve:** RF-COM-079: Audiencia por motor único con snapshot al publicar (invitados) o lista importada (Excel/CSV vía ExcelImportWizard). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.audiences.usar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-17 (Segmentos guardados y listas importadas).
- **Ola:** O2 · **Fuente:** T09 §11.3 Audiencias, línea 2446 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Audiencias/API-COM-69-b)

<a id="API-COM-69-c"></a>
#### API-COM-69-c · `POST /api/admin/com/audience-imports/{id}/rows`

- **Qué hace:** Importación de listas (ExcelImportWizard). Da de alta un registro de filas importadas (`audienceImportRows`).
- **Para qué sirve:** RF-COM-079: Audiencia por motor único con snapshot al publicar (invitados) o lista importada (Excel/CSV vía ExcelImportWizard). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.audiences.usar`.
- **Recibe:** en la ruta `id`; los datos de filas importadas (`audienceImportRows`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de filas importadas (`audienceImportRows`).
- **Pantallas:** PAN-COM-17 (Segmentos guardados y listas importadas).
- **Ola:** O2 · **Fuente:** T09 §11.3 Audiencias, línea 2446 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Audiencias/API-COM-69-c)

<a id="API-COM-70"></a>
#### API-COM-70 · `POST /api/admin/com/audiences/export`

- **Qué hace:** Exportación IVR / herramienta externa (auditada). Exporta sobre `export`.
- **Para qué sirve:** RF-COM-196: Exportación de audiencia a herramienta externa de email marketing (equivalente ExportarDopler) solo con finalidad marketing y consentimiento vigente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.audiences.exportar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-31 (Exportación de audiencia).
- **Ola:** O6 · **Fuente:** T09 §11.3 Audiencias, línea 2447 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Audiencias/API-COM-70)

<a id="API-COM-71"></a>
#### API-COM-71 · `POST /api/internal/com/audiences/match`

- **Qué hace:** UserMatchesAudience para otros módulos (M19, M09). Concilia sobre `match`.
- **Para qué sirve:** RF-COM-114: normalizeAudience, userMatchesAudience (¿este usuario ve X?), usersFilterForAudience (audiencia → destinatarios), audienceFilterForUser (usuario → qué ve en el feed) como servicio único. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Otros módulos del sistema (uso interno, no expuesto a usuarios); permiso `com.audiences.consultar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T09 §11.3 Audiencias, línea 2448 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Audiencias/API-COM-71)

<a id="grupo-4"></a>

## Motor de comunicaciones, campañas y canales

95 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-COM-76](#API-COM-76) | GET | `/api/internal/com/communications` | Estado de las comunicaciones de un objeto (M05, M08, M09). |
| [API-COM-75](#API-COM-75) | POST | `/api/internal/com/communications` | Comando de envío: { typeCode, recipients[], businessRef, variables, channelsOverride?, attachments[], evidenceRequired?, idempotencyKey }... |
| [API-COM-77](#API-COM-77) | GET | `/api/internal/com/communications/{id}/proof` | Constancia PDF (URL firmada). |
| [API-COM-78](#API-COM-78) | GET | `/api/internal/com/invoice-messages/resolve` | Mensajes impresos aplicables. |
| [API-COM-79](#API-COM-79) | GET | `/api/internal/com/preferences/{personId}` | Preferencias efectivas (M05 adhesión digital, M08 canales). |
| [API-COM-80](#API-COM-80) | GET | `/api/admin/com/communications` | Historial (DataTable). |
| [API-COM-81](#API-COM-81) | GET | `/api/admin/com/communications/{id}` | Detalle y constancia. |
| [API-COM-81-b](#API-COM-81-b) | GET | `/api/admin/com/communications/{id}/attempts` | Detalle y constancia. |
| [API-COM-81-c](#API-COM-81-c) | GET | `/api/admin/com/communications/{id}/events` | Detalle y constancia. |
| [API-COM-81-d](#API-COM-81-d) | GET | `/api/admin/com/communications/{id}/proof` | Detalle y constancia. |
| [API-COM-82](#API-COM-82) | POST | `/api/admin/com/communications/{id}/resend` | Reenviar (nueva comunicación) / cancelar en cola. |
| [API-COM-82-b](#API-COM-82-b) | POST | `/api/admin/com/communications/{id}/cancel` | Reenviar (nueva comunicación) / cancelar en cola. |
| [API-COM-83](#API-COM-83) | POST | `/api/admin/com/communications/manual` | Envío manual individual (PAN-COM-30). |
| [API-COM-84](#API-COM-84) | GET | `/api/admin/com/communication-types` | Catálogo. |
| [API-COM-84-b](#API-COM-84-b) | POST | `/api/admin/com/communication-types` | Catálogo. |
| [API-COM-84-c](#API-COM-84-c) | GET | `/api/admin/com/communication-types/{id}` | Catálogo. |
| [API-COM-84-e](#API-COM-84-e) | DELETE | `/api/admin/com/communication-types/{id}` | Catálogo. |
| [API-COM-84-d](#API-COM-84-d) | PATCH | `/api/admin/com/communication-types/{id}` | Catálogo. |
| [API-COM-84-f](#API-COM-84-f) | POST | `/api/admin/com/communication-types/{code}/restore-platform` | Catálogo. |
| [API-COM-85](#API-COM-85) | GET | `/api/admin/com/templates` | Plantillas y versiones. |
| [API-COM-85-b](#API-COM-85-b) | POST | `/api/admin/com/templates` | Plantillas y versiones. |
| [API-COM-85-c](#API-COM-85-c) | GET | `/api/admin/com/templates/{id}` | Plantillas y versiones. |
| [API-COM-85-e](#API-COM-85-e) | DELETE | `/api/admin/com/templates/{id}` | Plantillas y versiones. |
| [API-COM-85-d](#API-COM-85-d) | PATCH | `/api/admin/com/templates/{id}` | Plantillas y versiones. |
| [API-COM-85-f](#API-COM-85-f) | POST | `/api/admin/com/templates/{id}/versions` | Plantillas y versiones. |
| [API-COM-86](#API-COM-86) | POST | `/api/admin/com/templates/{id}/versions/{v}/render-test` | Prueba, publicación y envío a aprobación del proveedor. |
| [API-COM-86-b](#API-COM-86-b) | POST | `/api/admin/com/templates/{id}/versions/{v}/send-test` | Prueba, publicación y envío a aprobación del proveedor. |
| [API-COM-86-c](#API-COM-86-c) | POST | `/api/admin/com/templates/{id}/versions/{v}/publish` | Prueba, publicación y envío a aprobación del proveedor. |
| [API-COM-86-d](#API-COM-86-d) | POST | `/api/admin/com/templates/{id}/versions/{v}/retire` | Prueba, publicación y envío a aprobación del proveedor. |
| [API-COM-86-e](#API-COM-86-e) | POST | `/api/admin/com/templates/{id}/versions/{v}/whatsapp-submit` | Prueba, publicación y envío a aprobación del proveedor. |
| [API-COM-87](#API-COM-87) | GET | `/api/admin/com/template-variables` | Registro de variables. |
| [API-COM-87-b](#API-COM-87-b) | POST | `/api/admin/com/template-variables` | Registro de variables. |
| [API-COM-87-c](#API-COM-87-c) | GET | `/api/admin/com/template-variables/{id}` | Registro de variables. |
| [API-COM-87-e](#API-COM-87-e) | DELETE | `/api/admin/com/template-variables/{id}` | Registro de variables. |
| [API-COM-87-d](#API-COM-87-d) | PATCH | `/api/admin/com/template-variables/{id}` | Registro de variables. |
| [API-COM-88](#API-COM-88) | GET | `/api/admin/com/campaigns` | Campañas. |
| [API-COM-88-b](#API-COM-88-b) | POST | `/api/admin/com/campaigns` | Campañas. |
| [API-COM-88-c](#API-COM-88-c) | GET | `/api/admin/com/campaigns/{id}` | Campañas. |
| [API-COM-88-e](#API-COM-88-e) | DELETE | `/api/admin/com/campaigns/{id}` | Campañas. |
| [API-COM-88-d](#API-COM-88-d) | PATCH | `/api/admin/com/campaigns/{id}` | Campañas. |
| [API-COM-89](#API-COM-89) | POST | `/api/admin/com/campaigns/{id}/submit` | Transiciones §8.11. |
| [API-COM-89-b](#API-COM-89-b) | POST | `/api/admin/com/campaigns/{id}/approve` | Transiciones §8.11. |
| [API-COM-89-c](#API-COM-89-c) | POST | `/api/admin/com/campaigns/{id}/reject` | Transiciones §8.11. |
| [API-COM-89-d](#API-COM-89-d) | POST | `/api/admin/com/campaigns/{id}/schedule` | Transiciones §8.11. |
| [API-COM-89-e](#API-COM-89-e) | POST | `/api/admin/com/campaigns/{id}/send-now` | Transiciones §8.11. |
| [API-COM-89-f](#API-COM-89-f) | POST | `/api/admin/com/campaigns/{id}/pause` | Transiciones §8.11. |
| [API-COM-89-g](#API-COM-89-g) | POST | `/api/admin/com/campaigns/{id}/resume` | Transiciones §8.11. |
| [API-COM-89-h](#API-COM-89-h) | POST | `/api/admin/com/campaigns/{id}/cancel` | Transiciones §8.11. |
| [API-COM-89-i](#API-COM-89-i) | POST | `/api/admin/com/campaigns/{id}/test` | Transiciones §8.11. |
| [API-COM-90](#API-COM-90) | GET | `/api/admin/com/campaigns/{id}/metrics` | Métricas. |
| [API-COM-90-b](#API-COM-90-b) | GET | `/api/admin/com/campaigns/{id}/links` | Métricas. |
| [API-COM-90-c](#API-COM-90-c) | GET | `/api/admin/com/campaigns/{id}/export` | Métricas. |
| [API-COM-91](#API-COM-91) | GET | `/api/admin/com/invoice-messages` | Mensajes en factura. |
| [API-COM-91-b](#API-COM-91-b) | POST | `/api/admin/com/invoice-messages` | Mensajes en factura. |
| [API-COM-91-c](#API-COM-91-c) | GET | `/api/admin/com/invoice-messages/{id}` | Mensajes en factura. |
| [API-COM-91-e](#API-COM-91-e) | DELETE | `/api/admin/com/invoice-messages/{id}` | Mensajes en factura. |
| [API-COM-91-d](#API-COM-91-d) | PATCH | `/api/admin/com/invoice-messages/{id}` | Mensajes en factura. |
| [API-COM-91-f](#API-COM-91-f) | POST | `/api/admin/com/invoice-messages/{id}/approve` | Mensajes en factura. |
| [API-COM-91-g](#API-COM-91-g) | POST | `/api/admin/com/invoice-messages/{id}/cancel` | Mensajes en factura. |
| [API-COM-91-h](#API-COM-91-h) | POST | `/api/admin/com/invoice-messages/{id}/simulate` | Mensajes en factura. |
| [API-COM-92](#API-COM-92) | GET | `/api/admin/com/channels/{channel}` | Configuración de canal. |
| [API-COM-92-b](#API-COM-92-b) | PUT | `/api/admin/com/channels/{channel}` | Configuración de canal. |
| [API-COM-92-c](#API-COM-92-c) | GET | `/api/admin/com/channels/{channel}/test` | Configuración de canal. |
| [API-COM-92-d](#API-COM-92-d) | GET | `/api/admin/com/channels/{channel}/health` | Configuración de canal. |
| [API-COM-93](#API-COM-93) | GET | `/api/admin/com/sender-identities` | Remitentes. |
| [API-COM-93-b](#API-COM-93-b) | POST | `/api/admin/com/sender-identities` | Remitentes. |
| [API-COM-93-c](#API-COM-93-c) | GET | `/api/admin/com/sender-identities/{id}` | Remitentes. |
| [API-COM-93-e](#API-COM-93-e) | DELETE | `/api/admin/com/sender-identities/{id}` | Remitentes. |
| [API-COM-93-d](#API-COM-93-d) | PATCH | `/api/admin/com/sender-identities/{id}` | Remitentes. |
| [API-COM-93-f](#API-COM-93-f) | POST | `/api/admin/com/sender-identities/{id}/verify` | Remitentes. |
| [API-COM-94](#API-COM-94) | GET | `/api/admin/com/internal-notification-rules` | Reglas a responsables. |
| [API-COM-94-b](#API-COM-94-b) | POST | `/api/admin/com/internal-notification-rules` | Reglas a responsables. |
| [API-COM-94-c](#API-COM-94-c) | GET | `/api/admin/com/internal-notification-rules/{id}` | Reglas a responsables. |
| [API-COM-94-e](#API-COM-94-e) | DELETE | `/api/admin/com/internal-notification-rules/{id}` | Reglas a responsables. |
| [API-COM-94-d](#API-COM-94-d) | PATCH | `/api/admin/com/internal-notification-rules/{id}` | Reglas a responsables. |
| [API-COM-95](#API-COM-95) | GET | `/api/admin/com/usage` | Consumo. |
| [API-COM-96](#API-COM-96) | GET | `/api/admin/com/preferences/{personId}` | Preferencias y consentimientos por persona. |
| [API-COM-96-b](#API-COM-96-b) | PUT | `/api/admin/com/preferences/{personId}` | Preferencias y consentimientos por persona. |
| [API-COM-96-c](#API-COM-96-c) | GET | `/api/admin/com/consents/{personId}` | Preferencias y consentimientos por persona. |
| [API-COM-97](#API-COM-97) | GET | `/api/admin/com/suppressions` | Supresión. |
| [API-COM-97-b](#API-COM-97-b) | POST | `/api/admin/com/suppressions` | Supresión. |
| [API-COM-97-c](#API-COM-97-c) | POST | `/api/admin/com/suppressions/{id}/lift` | Supresión. |
| [API-COM-98](#API-COM-98) | GET | `/api/admin/com/outage-notices` | Avisos de interrupción. |
| [API-COM-98-b](#API-COM-98-b) | POST | `/api/admin/com/outage-notices` | Avisos de interrupción. |
| [API-COM-98-c](#API-COM-98-c) | GET | `/api/admin/com/outage-notices/{id}` | Avisos de interrupción. |
| [API-COM-98-e](#API-COM-98-e) | DELETE | `/api/admin/com/outage-notices/{id}` | Avisos de interrupción. |
| [API-COM-98-d](#API-COM-98-d) | PATCH | `/api/admin/com/outage-notices/{id}` | Avisos de interrupción. |
| [API-COM-98-f](#API-COM-98-f) | POST | `/api/admin/com/outage-notices/affected-preview` | Avisos de interrupción. |
| [API-COM-98-g](#API-COM-98-g) | POST | `/api/admin/com/outage-notices/{id}/publish` | Avisos de interrupción. |
| [API-COM-98-h](#API-COM-98-h) | POST | `/api/admin/com/outage-notices/{id}/update` | Avisos de interrupción. |
| [API-COM-98-i](#API-COM-98-i) | POST | `/api/admin/com/outage-notices/{id}/reschedule` | Avisos de interrupción. |
| [API-COM-98-j](#API-COM-98-j) | POST | `/api/admin/com/outage-notices/{id}/restore` | Avisos de interrupción. |
| [API-COM-98-k](#API-COM-98-k) | POST | `/api/admin/com/outage-notices/{id}/cancel` | Avisos de interrupción. |
| [API-COM-99](#API-COM-99) | GET | `/api/com/outages/mine` | Cortes de mis domicilios / públicos. |
| [API-COM-99-b](#API-COM-99-b) | GET | `/api/public/{tenantSlug}/com/outages` | Cortes de mis domicilios / públicos. |

<a id="API-COM-76"></a>
#### API-COM-76 · `GET /api/internal/com/communications`

- **Qué hace:** Estado de las comunicaciones de un objeto (M05, M08, M09). Lista, con filtros y paginación, los registros de comunicación enviada a un destinatario (`communications`).
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Otros módulos del sistema (uso interno, no expuesto a usuarios); permiso `com.communications.consultar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de comunicación enviada a un destinatario (`communications`) con `total`.
- **Ola:** O0 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2455 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-76)

<a id="API-COM-75"></a>
#### API-COM-75 · `POST /api/internal/com/communications`

- **Qué hace:** Comando de envío: { typeCode, recipients[], businessRef, variables, channelsOverride?, attachments[], evidenceRequired?, idempotencyKey }... Da de alta un registro de comunicación enviada a un destinatario (`communications`).
- **Para qué sirve:** RF-COM-181: Los módulos emisores publican eventos de dominio; COM los consume (no hay llamadas directas de envío desde la lógica de negocio salvo communications.emit del servicio público COM). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Otros módulos del sistema (uso interno, no expuesto a usuarios); permiso `com.communications.emit`.
- **Recibe:** los datos de comunicación enviada a un destinatario (`communications`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de comunicación enviada a un destinatario (`communications`).
- **Ola:** O0 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2454 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-75)

<a id="API-COM-77"></a>
#### API-COM-77 · `GET /api/internal/com/communications/{id}/proof`

- **Qué hace:** Constancia PDF (URL firmada). Consulta «proof» de un registro de comunicación enviada a un destinatario (`communications`).
- **Para qué sirve:** RF-COM-146: Constancia: por comunicación, contenido renderizado (o hash + plantilla+versión+variables), destinatario y contacto usados, fechas de cada estado, providerMessageId, eventos del proveedor; exportable en PDF firmado digitalmente… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Otros módulos del sistema (uso interno, no expuesto a usuarios); permiso `com.communications.consultar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de comunicación enviada a un destinatario (`communications`).
- **Ola:** O0 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2456 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-77)

<a id="API-COM-78"></a>
#### API-COM-78 · `GET /api/internal/com/invoice-messages/resolve`

- **Qué hace:** Mensajes impresos aplicables. Consulta mensajes a imprimir en factura por segmento (`invoiceMessages`).
- **Para qué sirve:** RF-COM-195: Mensajes impresos en factura: campaña de canal print_invoice con audiencia, período de facturación o rango de fechas, texto (≤ N caracteres por área de impresión), prioridad y QR opcional; M05 consulta los mensajes aplicables por… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Otros módulos del sistema (uso interno, no expuesto a usuarios); permiso `com.invoiceMessages.resolver`.
- **Recibe:** nada.
- **Devuelve:** 200: el registro de mensajes a imprimir en factura por segmento (`invoiceMessages`).
- **Ola:** O4 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2457 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-78)

<a id="API-COM-79"></a>
#### API-COM-79 · `GET /api/internal/com/preferences/{personId}`

- **Qué hace:** Preferencias efectivas (M05 adhesión digital, M08 canales). Obtiene el detalle de un registro de preferencias de canal por persona (`communicationPreferences`).
- **Para qué sirve:** RF-COM-174: Adhesión a factura digital (email/WhatsApp) como preferencia de la finalidad transactional tipo fac.invoice.issued, con efecto en M05 (no imprimir/no franqueo V2 2663) — M05 decide. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Otros módulos del sistema (uso interno, no expuesto a usuarios); permiso `com.preferences.consultar`.
- **Recibe:** en la ruta `personId`.
- **Devuelve:** 200: el registro de preferencias de canal por persona (`communicationPreferences`).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2458 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-79)

<a id="API-COM-80"></a>
#### API-COM-80 · `GET /api/admin/com/communications`

- **Qué hace:** Historial (DataTable). Lista, con filtros y paginación, los registros de comunicación enviada a un destinatario (`communications`).
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.communications.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de comunicación enviada a un destinatario (`communications`) con `total`.
- **Pantallas:** PAN-COM-24 (Historial de comunicaciones).
- **Ola:** O0 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2459 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-80)

<a id="API-COM-81"></a>
#### API-COM-81 · `GET /api/admin/com/communications/{id}`

- **Qué hace:** Detalle y constancia. Obtiene el detalle de un registro de comunicación enviada a un destinatario (`communications`).
- **Para qué sirve:** RF-COM-131: Catálogo de tipos de comunicación (communicationTypes): código, módulo emisor, evento disparador, finalidad, canales permitidos y por defecto, orden de alternativa de canal, plantilla por canal, prioridad, ventana de envío… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.communications.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de comunicación enviada a un destinatario (`communications`).
- **Pantallas:** PAN-COM-24 (Historial de comunicaciones).
- **Ola:** O0 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2460 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-81)

<a id="API-COM-81-b"></a>
#### API-COM-81-b · `GET /api/admin/com/communications/{id}/attempts`

- **Qué hace:** Detalle y constancia. Consulta «attempts» de un registro de comunicación enviada a un destinatario (`communications`).
- **Para qué sirve:** RF-COM-131: Catálogo de tipos de comunicación (communicationTypes): código, módulo emisor, evento disparador, finalidad, canales permitidos y por defecto, orden de alternativa de canal, plantilla por canal, prioridad, ventana de envío… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.communications.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de comunicación enviada a un destinatario (`communications`).
- **Pantallas:** PAN-COM-24 (Historial de comunicaciones).
- **Ola:** O0 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2460 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-81-b)

<a id="API-COM-81-c"></a>
#### API-COM-81-c · `GET /api/admin/com/communications/{id}/events`

- **Qué hace:** Detalle y constancia. Lista, con filtros y paginación, los registros de eventos de comunidad (`events`).
- **Para qué sirve:** RF-COM-131: Catálogo de tipos de comunicación (communicationTypes): código, módulo emisor, evento disparador, finalidad, canales permitidos y por defecto, orden de alternativa de canal, plantilla por canal, prioridad, ventana de envío… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.communications.ver`.
- **Recibe:** en la ruta `id`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de eventos de comunidad (`events`) con `total`.
- **Pantallas:** PAN-COM-24 (Historial de comunicaciones).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2460 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-81-c)

<a id="API-COM-81-d"></a>
#### API-COM-81-d · `GET /api/admin/com/communications/{id}/proof`

- **Qué hace:** Detalle y constancia. Consulta «proof» de un registro de comunicación enviada a un destinatario (`communications`).
- **Para qué sirve:** RF-COM-131: Catálogo de tipos de comunicación (communicationTypes): código, módulo emisor, evento disparador, finalidad, canales permitidos y por defecto, orden de alternativa de canal, plantilla por canal, prioridad, ventana de envío… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.communications.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de comunicación enviada a un destinatario (`communications`).
- **Pantallas:** PAN-COM-24 (Historial de comunicaciones).
- **Ola:** O0 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2460 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-81-d)

<a id="API-COM-82"></a>
#### API-COM-82 · `POST /api/admin/com/communications/{id}/resend`

- **Qué hace:** Reenviar (nueva comunicación) / cancelar en cola. Reenvía un registro de comunicación enviada a un destinatario (`communications`).
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.communications.reenviar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2461 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-82)

<a id="API-COM-82-b"></a>
#### API-COM-82-b · `POST /api/admin/com/communications/{id}/cancel`

- **Qué hace:** Reenviar (nueva comunicación) / cancelar en cola. Cancela un registro de comunicación enviada a un destinatario (`communications`).
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.communications.reenviar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2461 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-82-b)

<a id="API-COM-83"></a>
#### API-COM-83 · `POST /api/admin/com/communications/manual`

- **Qué hace:** Envío manual individual (PAN-COM-30). Registra un nuevo elemento u operación en comunicación enviada a un destinatario (`communications`).
- **Para qué sirve:** RF-COM-149: Envío manual individual desde la ficha de la persona/cuenta/proveedor (email, SMS, WhatsApp) con plantilla o texto libre (texto libre solo email/SMS y finalidad operational), registrando la comunicación en el historial 360°. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.communications.enviarManual`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-30 (Envío individual).
- **Ola:** O0 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2462 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-83)

<a id="API-COM-84"></a>
#### API-COM-84 · `GET /api/admin/com/communication-types`

- **Qué hace:** Catálogo. Lista, con filtros y paginación, los registros de tipos de comunicación (`communicationTypes`).
- **Para qué sirve:** RF-COM-131: Catálogo de tipos de comunicación (communicationTypes): código, módulo emisor, evento disparador, finalidad, canales permitidos y por defecto, orden de alternativa de canal, plantilla por canal, prioridad, ventana de envío… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.catalog.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de tipos de comunicación (`communicationTypes`) con `total`.
- **Pantallas:** PAN-COM-18 (Catálogo de tipos de comunicación), PAN-COM-29 (Reglas de notificación a responsables).
- **Ola:** O0 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2463 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-84)

<a id="API-COM-84-b"></a>
#### API-COM-84-b · `POST /api/admin/com/communication-types`

- **Qué hace:** Catálogo. Da de alta un registro de tipos de comunicación (`communicationTypes`).
- **Para qué sirve:** RF-COM-131: Catálogo de tipos de comunicación (communicationTypes): código, módulo emisor, evento disparador, finalidad, canales permitidos y por defecto, orden de alternativa de canal, plantilla por canal, prioridad, ventana de envío… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.catalog.configurar`.
- **Recibe:** los datos de tipos de comunicación (`communicationTypes`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de tipos de comunicación (`communicationTypes`).
- **Pantallas:** PAN-COM-18 (Catálogo de tipos de comunicación), PAN-COM-29 (Reglas de notificación a responsables).
- **Ola:** O0 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2463 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-84-b)

<a id="API-COM-84-c"></a>
#### API-COM-84-c · `GET /api/admin/com/communication-types/{id}`

- **Qué hace:** Catálogo. Obtiene el detalle de un registro de tipos de comunicación (`communicationTypes`).
- **Para qué sirve:** RF-COM-131: Catálogo de tipos de comunicación (communicationTypes): código, módulo emisor, evento disparador, finalidad, canales permitidos y por defecto, orden de alternativa de canal, plantilla por canal, prioridad, ventana de envío… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.catalog.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de tipos de comunicación (`communicationTypes`).
- **Pantallas:** PAN-COM-18 (Catálogo de tipos de comunicación), PAN-COM-29 (Reglas de notificación a responsables).
- **Ola:** O0 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2463 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-84-c)

<a id="API-COM-84-e"></a>
#### API-COM-84-e · `DELETE /api/admin/com/communication-types/{id}`

- **Qué hace:** Catálogo. Elimina o da de baja un registro de tipos de comunicación (`communicationTypes`).
- **Para qué sirve:** RF-COM-131: Catálogo de tipos de comunicación (communicationTypes): código, módulo emisor, evento disparador, finalidad, canales permitidos y por defecto, orden de alternativa de canal, plantilla por canal, prioridad, ventana de envío… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.catalog.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-COM-18 (Catálogo de tipos de comunicación), PAN-COM-29 (Reglas de notificación a responsables).
- **Ola:** O0 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2463 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-84-e)

<a id="API-COM-84-d"></a>
#### API-COM-84-d · `PATCH /api/admin/com/communication-types/{id}`

- **Qué hace:** Catálogo. Modifica algunos campos de un registro de tipos de comunicación (`communicationTypes`) (solo los enviados).
- **Para qué sirve:** RF-COM-131: Catálogo de tipos de comunicación (communicationTypes): código, módulo emisor, evento disparador, finalidad, canales permitidos y por defecto, orden de alternativa de canal, plantilla por canal, prioridad, ventana de envío… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.catalog.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de tipos de comunicación (`communicationTypes`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de tipos de comunicación (`communicationTypes`).
- **Pantallas:** PAN-COM-18 (Catálogo de tipos de comunicación), PAN-COM-29 (Reglas de notificación a responsables).
- **Ola:** O0 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2463 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-84-d)

<a id="API-COM-84-f"></a>
#### API-COM-84-f · `POST /api/admin/com/communication-types/{code}/restore-platform`

- **Qué hace:** Catálogo. Registra «restore-platform» sobre un registro de tipos de comunicación (`communicationTypes`).
- **Para qué sirve:** RF-COM-131: Catálogo de tipos de comunicación (communicationTypes): código, módulo emisor, evento disparador, finalidad, canales permitidos y por defecto, orden de alternativa de canal, plantilla por canal, prioridad, ventana de envío… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.catalog.configurar`.
- **Recibe:** en la ruta `code`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-18 (Catálogo de tipos de comunicación), PAN-COM-29 (Reglas de notificación a responsables).
- **Ola:** O0 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2463 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-84-f)

<a id="API-COM-85"></a>
#### API-COM-85 · `GET /api/admin/com/templates`

- **Qué hace:** Plantillas y versiones. Lista, con filtros y paginación, los registros de plantillas de publicación (`postTemplates`).
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.templates.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de plantillas de publicación (`postTemplates`) con `total`.
- **Pantallas:** PAN-COM-19 (Plantillas de comunicación).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2464 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-85)

<a id="API-COM-85-b"></a>
#### API-COM-85-b · `POST /api/admin/com/templates`

- **Qué hace:** Plantillas y versiones. Da de alta un registro de plantillas de publicación (`postTemplates`).
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.templates.crear`.
- **Recibe:** los datos de plantillas de publicación (`postTemplates`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de plantillas de publicación (`postTemplates`).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2464 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-85-b)

<a id="API-COM-85-c"></a>
#### API-COM-85-c · `GET /api/admin/com/templates/{id}`

- **Qué hace:** Plantillas y versiones. Obtiene el detalle de un registro de plantillas de publicación (`postTemplates`).
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.templates.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de plantillas de publicación (`postTemplates`).
- **Pantallas:** PAN-COM-19 (Plantillas de comunicación).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2464 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-85-c)

<a id="API-COM-85-e"></a>
#### API-COM-85-e · `DELETE /api/admin/com/templates/{id}`

- **Qué hace:** Plantillas y versiones. Elimina o da de baja un registro de plantillas de publicación (`postTemplates`).
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.templates.editar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-COM-19 (Plantillas de comunicación), PAN-COM-20 (Registro de variables).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2464 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-85-e)

<a id="API-COM-85-d"></a>
#### API-COM-85-d · `PATCH /api/admin/com/templates/{id}`

- **Qué hace:** Plantillas y versiones. Modifica algunos campos de un registro de plantillas de publicación (`postTemplates`) (solo los enviados).
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.templates.crear`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de plantillas de publicación (`postTemplates`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de plantillas de publicación (`postTemplates`).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2464 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-85-d)

<a id="API-COM-85-f"></a>
#### API-COM-85-f · `POST /api/admin/com/templates/{id}/versions`

- **Qué hace:** Plantillas y versiones. Da de alta un registro de versiones de plantilla (`messageTemplateVersions`).
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.templates.crear`.
- **Recibe:** en la ruta `id`; los datos de versiones de plantilla (`messageTemplateVersions`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de versiones de plantilla (`messageTemplateVersions`).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2464 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-85-f)

<a id="API-COM-86"></a>
#### API-COM-86 · `POST /api/admin/com/templates/{id}/versions/{v}/render-test`

- **Qué hace:** Prueba, publicación y envío a aprobación del proveedor. Registra «render-test» sobre un registro de versiones de plantilla (`messageTemplateVersions`).
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.templates.editar`.
- **Recibe:** en la ruta `id`, `v`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-19 (Plantillas de comunicación), PAN-COM-20 (Registro de variables).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2465 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-86)

<a id="API-COM-86-b"></a>
#### API-COM-86-b · `POST /api/admin/com/templates/{id}/versions/{v}/send-test`

- **Qué hace:** Prueba, publicación y envío a aprobación del proveedor. Registra «send-test» sobre un registro de versiones de plantilla (`messageTemplateVersions`).
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.templates.editar`.
- **Recibe:** en la ruta `id`, `v`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-19 (Plantillas de comunicación), PAN-COM-20 (Registro de variables).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2465 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-86-b)

<a id="API-COM-86-c"></a>
#### API-COM-86-c · `POST /api/admin/com/templates/{id}/versions/{v}/publish`

- **Qué hace:** Prueba, publicación y envío a aprobación del proveedor. Publica un registro de versiones de plantilla (`messageTemplateVersions`).
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.templates.editar`.
- **Recibe:** en la ruta `id`, `v`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-19 (Plantillas de comunicación), PAN-COM-20 (Registro de variables).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2465 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-86-c)

<a id="API-COM-86-d"></a>
#### API-COM-86-d · `POST /api/admin/com/templates/{id}/versions/{v}/retire`

- **Qué hace:** Prueba, publicación y envío a aprobación del proveedor. Registra «retire» sobre un registro de versiones de plantilla (`messageTemplateVersions`).
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.templates.editar`.
- **Recibe:** en la ruta `id`, `v`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-19 (Plantillas de comunicación), PAN-COM-20 (Registro de variables).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2465 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-86-d)

<a id="API-COM-86-e"></a>
#### API-COM-86-e · `POST /api/admin/com/templates/{id}/versions/{v}/whatsapp-submit`

- **Qué hace:** Prueba, publicación y envío a aprobación del proveedor. Registra «whatsapp-submit» sobre un registro de versiones de plantilla (`messageTemplateVersions`).
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.templates.editar`.
- **Recibe:** en la ruta `id`, `v`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-19 (Plantillas de comunicación), PAN-COM-20 (Registro de variables).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2465 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-86-e)

<a id="API-COM-87"></a>
#### API-COM-87 · `GET /api/admin/com/template-variables`

- **Qué hace:** Registro de variables. Lista, con filtros y paginación, los registros de variables disponibles (`templateVariables`).
- **Para qué sirve:** RF-COM-152: Plantillas de documentos/circulares impresas (cartas de mora, circulares a proveedores) con variables, generadas en PDF por el módulo dueño usando el motor de render de COM. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.templates.editar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de variables disponibles (`templateVariables`) con `total`.
- **Pantallas:** PAN-COM-19 (Plantillas de comunicación), PAN-COM-20 (Registro de variables).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2466 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-87)

<a id="API-COM-87-b"></a>
#### API-COM-87-b · `POST /api/admin/com/template-variables`

- **Qué hace:** Registro de variables. Da de alta un registro de variables disponibles (`templateVariables`).
- **Para qué sirve:** RF-COM-152: Plantillas de documentos/circulares impresas (cartas de mora, circulares a proveedores) con variables, generadas en PDF por el módulo dueño usando el motor de render de COM. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.templates.editar`.
- **Recibe:** los datos de variables disponibles (`templateVariables`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de variables disponibles (`templateVariables`).
- **Pantallas:** PAN-COM-19 (Plantillas de comunicación), PAN-COM-20 (Registro de variables).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2466 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-87-b)

<a id="API-COM-87-c"></a>
#### API-COM-87-c · `GET /api/admin/com/template-variables/{id}`

- **Qué hace:** Registro de variables. Obtiene el detalle de un registro de variables disponibles (`templateVariables`).
- **Para qué sirve:** RF-COM-152: Plantillas de documentos/circulares impresas (cartas de mora, circulares a proveedores) con variables, generadas en PDF por el módulo dueño usando el motor de render de COM. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.templates.editar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de variables disponibles (`templateVariables`).
- **Pantallas:** PAN-COM-19 (Plantillas de comunicación), PAN-COM-20 (Registro de variables).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2466 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-87-c)

<a id="API-COM-87-e"></a>
#### API-COM-87-e · `DELETE /api/admin/com/template-variables/{id}`

- **Qué hace:** Registro de variables. Elimina o da de baja un registro de variables disponibles (`templateVariables`).
- **Para qué sirve:** RF-COM-152: Plantillas de documentos/circulares impresas (cartas de mora, circulares a proveedores) con variables, generadas en PDF por el módulo dueño usando el motor de render de COM. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.templates.editar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-COM-19 (Plantillas de comunicación), PAN-COM-20 (Registro de variables).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2466 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-87-e)

<a id="API-COM-87-d"></a>
#### API-COM-87-d · `PATCH /api/admin/com/template-variables/{id}`

- **Qué hace:** Registro de variables. Modifica algunos campos de un registro de variables disponibles (`templateVariables`) (solo los enviados).
- **Para qué sirve:** RF-COM-152: Plantillas de documentos/circulares impresas (cartas de mora, circulares a proveedores) con variables, generadas en PDF por el módulo dueño usando el motor de render de COM. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.templates.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de variables disponibles (`templateVariables`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de variables disponibles (`templateVariables`).
- **Pantallas:** PAN-COM-19 (Plantillas de comunicación), PAN-COM-20 (Registro de variables).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2466 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-87-d)

<a id="API-COM-88"></a>
#### API-COM-88 · `GET /api/admin/com/campaigns`

- **Qué hace:** Campañas. Lista, con filtros y paginación, los registros de campañas masivas (`campaigns`).
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.campaigns.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de campañas masivas (`campaigns`) con `total`.
- **Pantallas:** PAN-COM-21 (Campañas).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2467 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-88)

<a id="API-COM-88-b"></a>
#### API-COM-88-b · `POST /api/admin/com/campaigns`

- **Qué hace:** Campañas. Da de alta un registro de campañas masivas (`campaigns`).
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.campaigns.crear`.
- **Recibe:** los datos de campañas masivas (`campaigns`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de campañas masivas (`campaigns`).
- **Pantallas:** PAN-COM-22 (Composer de campaña).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2467 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-88-b)

<a id="API-COM-88-c"></a>
#### API-COM-88-c · `GET /api/admin/com/campaigns/{id}`

- **Qué hace:** Campañas. Obtiene el detalle de un registro de campañas masivas (`campaigns`).
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.campaigns.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de campañas masivas (`campaigns`).
- **Pantallas:** PAN-COM-21 (Campañas).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2467 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-88-c)

<a id="API-COM-88-e"></a>
#### API-COM-88-e · `DELETE /api/admin/com/campaigns/{id}`

- **Qué hace:** Campañas. Elimina o da de baja un registro de campañas masivas (`campaigns`).
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.campaigns.crear`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-COM-22 (Composer de campaña).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2467 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-88-e)

<a id="API-COM-88-d"></a>
#### API-COM-88-d · `PATCH /api/admin/com/campaigns/{id}`

- **Qué hace:** Campañas. Modifica algunos campos de un registro de campañas masivas (`campaigns`) (solo los enviados).
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.campaigns.crear`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de campañas masivas (`campaigns`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de campañas masivas (`campaigns`).
- **Pantallas:** PAN-COM-22 (Composer de campaña).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2467 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-88-d)

<a id="API-COM-89"></a>
#### API-COM-89 · `POST /api/admin/com/campaigns/{id}/submit`

- **Qué hace:** Transiciones §8.11. Envía a revisión o presenta un registro de campañas masivas (`campaigns`).
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.campaigns.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-22 (Composer de campaña).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2468 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-89)

<a id="API-COM-89-b"></a>
#### API-COM-89-b · `POST /api/admin/com/campaigns/{id}/approve`

- **Qué hace:** Transiciones §8.11. Aprueba un registro de campañas masivas (`campaigns`).
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.campaigns.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-22 (Composer de campaña).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2468 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-89-b)

<a id="API-COM-89-c"></a>
#### API-COM-89-c · `POST /api/admin/com/campaigns/{id}/reject`

- **Qué hace:** Transiciones §8.11. Rechaza un registro de campañas masivas (`campaigns`).
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.campaigns.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-22 (Composer de campaña).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2468 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-89-c)

<a id="API-COM-89-d"></a>
#### API-COM-89-d · `POST /api/admin/com/campaigns/{id}/schedule`

- **Qué hace:** Transiciones §8.11. Programa un registro de campañas masivas (`campaigns`).
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.campaigns.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-22 (Composer de campaña).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2468 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-89-d)

<a id="API-COM-89-e"></a>
#### API-COM-89-e · `POST /api/admin/com/campaigns/{id}/send-now`

- **Qué hace:** Transiciones §8.11. Registra «send-now» sobre un registro de campañas masivas (`campaigns`).
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.campaigns.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-22 (Composer de campaña).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2468 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-89-e)

<a id="API-COM-89-f"></a>
#### API-COM-89-f · `POST /api/admin/com/campaigns/{id}/pause`

- **Qué hace:** Transiciones §8.11. Pausa un registro de campañas masivas (`campaigns`).
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.campaigns.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-22 (Composer de campaña).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2468 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-89-f)

<a id="API-COM-89-g"></a>
#### API-COM-89-g · `POST /api/admin/com/campaigns/{id}/resume`

- **Qué hace:** Transiciones §8.11. Reanuda un registro de campañas masivas (`campaigns`).
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.campaigns.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-22 (Composer de campaña).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2468 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-89-g)

<a id="API-COM-89-h"></a>
#### API-COM-89-h · `POST /api/admin/com/campaigns/{id}/cancel`

- **Qué hace:** Transiciones §8.11. Cancela un registro de campañas masivas (`campaigns`).
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.campaigns.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-22 (Composer de campaña).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2468 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-89-h)

<a id="API-COM-89-i"></a>
#### API-COM-89-i · `POST /api/admin/com/campaigns/{id}/test`

- **Qué hace:** Transiciones §8.11. Prueba un registro de campañas masivas (`campaigns`).
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.campaigns.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-22 (Composer de campaña).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2468 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-89-i)

<a id="API-COM-90"></a>
#### API-COM-90 · `GET /api/admin/com/campaigns/{id}/metrics`

- **Qué hace:** Métricas. Consulta «metrics» de un registro de campañas masivas (`campaigns`).
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.campaigns.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de campañas masivas (`campaigns`).
- **Pantallas:** PAN-COM-21 (Campañas).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2469 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-90)

<a id="API-COM-90-b"></a>
#### API-COM-90-b · `GET /api/admin/com/campaigns/{id}/links`

- **Qué hace:** Métricas. Consulta «links» de un registro de campañas masivas (`campaigns`).
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.campaigns.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de campañas masivas (`campaigns`).
- **Pantallas:** PAN-COM-21 (Campañas).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2469 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-90-b)

<a id="API-COM-90-c"></a>
#### API-COM-90-c · `GET /api/admin/com/campaigns/{id}/export`

- **Qué hace:** Métricas. Descarga un archivo de campañas masivas (`campaigns`).
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.campaigns.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un archivo (application/octet-stream).
- **Pantallas:** PAN-COM-21 (Campañas).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2469 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-90-c)

<a id="API-COM-91"></a>
#### API-COM-91 · `GET /api/admin/com/invoice-messages`

- **Qué hace:** Mensajes en factura. Lista, con filtros y paginación, los registros de mensajes a imprimir en factura por segmento (`invoiceMessages`).
- **Para qué sirve:** RF-COM-130: Canales: email, sms, whatsapp, push (Web Push PWA), in_app, print_invoice (mensaje impreso en factura), print_letter (carta/notificación impresa entregada por M05/M08), ivr_export (archivo para discador, ver RF-COM-148). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.invoiceMessages.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de mensajes a imprimir en factura por segmento (`invoiceMessages`) con `total`.
- **Pantallas:** PAN-COM-23 (Mensajes impresos en factura).
- **Ola:** O4 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2470 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-91)

<a id="API-COM-91-b"></a>
#### API-COM-91-b · `POST /api/admin/com/invoice-messages`

- **Qué hace:** Mensajes en factura. Da de alta un registro de mensajes a imprimir en factura por segmento (`invoiceMessages`).
- **Para qué sirve:** RF-COM-130: Canales: email, sms, whatsapp, push (Web Push PWA), in_app, print_invoice (mensaje impreso en factura), print_letter (carta/notificación impresa entregada por M05/M08), ivr_export (archivo para discador, ver RF-COM-148). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.invoiceMessages.crear`.
- **Recibe:** los datos de mensajes a imprimir en factura por segmento (`invoiceMessages`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de mensajes a imprimir en factura por segmento (`invoiceMessages`).
- **Ola:** O4 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2470 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-91-b)

<a id="API-COM-91-c"></a>
#### API-COM-91-c · `GET /api/admin/com/invoice-messages/{id}`

- **Qué hace:** Mensajes en factura. Obtiene el detalle de un registro de mensajes a imprimir en factura por segmento (`invoiceMessages`).
- **Para qué sirve:** RF-COM-130: Canales: email, sms, whatsapp, push (Web Push PWA), in_app, print_invoice (mensaje impreso en factura), print_letter (carta/notificación impresa entregada por M05/M08), ivr_export (archivo para discador, ver RF-COM-148). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.invoiceMessages.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de mensajes a imprimir en factura por segmento (`invoiceMessages`).
- **Pantallas:** PAN-COM-23 (Mensajes impresos en factura).
- **Ola:** O4 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2470 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-91-c)

<a id="API-COM-91-e"></a>
#### API-COM-91-e · `DELETE /api/admin/com/invoice-messages/{id}`

- **Qué hace:** Mensajes en factura. Elimina o da de baja un registro de mensajes a imprimir en factura por segmento (`invoiceMessages`).
- **Para qué sirve:** RF-COM-130: Canales: email, sms, whatsapp, push (Web Push PWA), in_app, print_invoice (mensaje impreso en factura), print_letter (carta/notificación impresa entregada por M05/M08), ivr_export (archivo para discador, ver RF-COM-148). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.invoiceMessages.aprobar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O4 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2470 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-91-e)

<a id="API-COM-91-d"></a>
#### API-COM-91-d · `PATCH /api/admin/com/invoice-messages/{id}`

- **Qué hace:** Mensajes en factura. Modifica algunos campos de un registro de mensajes a imprimir en factura por segmento (`invoiceMessages`) (solo los enviados).
- **Para qué sirve:** RF-COM-130: Canales: email, sms, whatsapp, push (Web Push PWA), in_app, print_invoice (mensaje impreso en factura), print_letter (carta/notificación impresa entregada por M05/M08), ivr_export (archivo para discador, ver RF-COM-148). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.invoiceMessages.crear`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de mensajes a imprimir en factura por segmento (`invoiceMessages`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de mensajes a imprimir en factura por segmento (`invoiceMessages`).
- **Ola:** O4 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2470 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-91-d)

<a id="API-COM-91-f"></a>
#### API-COM-91-f · `POST /api/admin/com/invoice-messages/{id}/approve`

- **Qué hace:** Mensajes en factura. Aprueba un registro de mensajes a imprimir en factura por segmento (`invoiceMessages`).
- **Para qué sirve:** RF-COM-130: Canales: email, sms, whatsapp, push (Web Push PWA), in_app, print_invoice (mensaje impreso en factura), print_letter (carta/notificación impresa entregada por M05/M08), ivr_export (archivo para discador, ver RF-COM-148). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.invoiceMessages.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O4 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2470 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-91-f)

<a id="API-COM-91-g"></a>
#### API-COM-91-g · `POST /api/admin/com/invoice-messages/{id}/cancel`

- **Qué hace:** Mensajes en factura. Cancela un registro de mensajes a imprimir en factura por segmento (`invoiceMessages`).
- **Para qué sirve:** RF-COM-130: Canales: email, sms, whatsapp, push (Web Push PWA), in_app, print_invoice (mensaje impreso en factura), print_letter (carta/notificación impresa entregada por M05/M08), ivr_export (archivo para discador, ver RF-COM-148). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.invoiceMessages.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O4 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2470 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-91-g)

<a id="API-COM-91-h"></a>
#### API-COM-91-h · `POST /api/admin/com/invoice-messages/{id}/simulate`

- **Qué hace:** Mensajes en factura. Simula sin efectos un registro de mensajes a imprimir en factura por segmento (`invoiceMessages`).
- **Para qué sirve:** RF-COM-130: Canales: email, sms, whatsapp, push (Web Push PWA), in_app, print_invoice (mensaje impreso en factura), print_letter (carta/notificación impresa entregada por M05/M08), ivr_export (archivo para discador, ver RF-COM-148). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.invoiceMessages.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O4 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2470 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-91-h)

<a id="API-COM-92"></a>
#### API-COM-92 · `GET /api/admin/com/channels/{channel}`

- **Qué hace:** Configuración de canal. Obtiene el detalle de un registro de `channels`.
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.channels.configurar`.
- **Recibe:** en la ruta `channel`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-26 (Canales de comunicación), PAN-COM-28 (Consumo de mensajería).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2471 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-92)

<a id="API-COM-92-b"></a>
#### API-COM-92-b · `PUT /api/admin/com/channels/{channel}`

- **Qué hace:** Configuración de canal. Reemplaza o configura un registro de `channels`.
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.channels.configurar`.
- **Recibe:** en la ruta `channel`; un cuerpo JSON cuya estructura detalla el anexo; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-26 (Canales de comunicación), PAN-COM-28 (Consumo de mensajería).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2471 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-92-b)

<a id="API-COM-92-c"></a>
#### API-COM-92-c · `GET /api/admin/com/channels/{channel}/test`

- **Qué hace:** Configuración de canal. Consulta «test» de un registro de `test`.
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.channels.configurar`.
- **Recibe:** en la ruta `channel`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-26 (Canales de comunicación), PAN-COM-28 (Consumo de mensajería).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2471 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-92-c)

<a id="API-COM-92-d"></a>
#### API-COM-92-d · `GET /api/admin/com/channels/{channel}/health`

- **Qué hace:** Configuración de canal. Consulta «health» de un registro de `health`.
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.channels.configurar`.
- **Recibe:** en la ruta `channel`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-26 (Canales de comunicación), PAN-COM-28 (Consumo de mensajería).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2471 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-92-d)

<a id="API-COM-93"></a>
#### API-COM-93 · `GET /api/admin/com/sender-identities`

- **Qué hace:** Remitentes. Lista, con filtros y paginación, los registros de remitentes verificados (`senderIdentities`).
- **Para qué sirve:** RF-COM-063: Envío por el motor de comunicaciones (email + in-app), PDF y preview HTML; en la app lista de boletines y detalle tipo revista con “Abrir en el muro”. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.channels.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de remitentes verificados (`senderIdentities`) con `total`.
- **Pantallas:** PAN-COM-26 (Canales de comunicación), PAN-COM-28 (Consumo de mensajería).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2472 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-93)

<a id="API-COM-93-b"></a>
#### API-COM-93-b · `POST /api/admin/com/sender-identities`

- **Qué hace:** Remitentes. Da de alta un registro de remitentes verificados (`senderIdentities`).
- **Para qué sirve:** RF-COM-063: Envío por el motor de comunicaciones (email + in-app), PDF y preview HTML; en la app lista de boletines y detalle tipo revista con “Abrir en el muro”. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.channels.configurar`.
- **Recibe:** los datos de remitentes verificados (`senderIdentities`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de remitentes verificados (`senderIdentities`).
- **Pantallas:** PAN-COM-26 (Canales de comunicación), PAN-COM-28 (Consumo de mensajería).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2472 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-93-b)

<a id="API-COM-93-c"></a>
#### API-COM-93-c · `GET /api/admin/com/sender-identities/{id}`

- **Qué hace:** Remitentes. Obtiene el detalle de un registro de remitentes verificados (`senderIdentities`).
- **Para qué sirve:** RF-COM-063: Envío por el motor de comunicaciones (email + in-app), PDF y preview HTML; en la app lista de boletines y detalle tipo revista con “Abrir en el muro”. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.channels.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de remitentes verificados (`senderIdentities`).
- **Pantallas:** PAN-COM-26 (Canales de comunicación), PAN-COM-28 (Consumo de mensajería).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2472 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-93-c)

<a id="API-COM-93-e"></a>
#### API-COM-93-e · `DELETE /api/admin/com/sender-identities/{id}`

- **Qué hace:** Remitentes. Elimina o da de baja un registro de remitentes verificados (`senderIdentities`).
- **Para qué sirve:** RF-COM-063: Envío por el motor de comunicaciones (email + in-app), PDF y preview HTML; en la app lista de boletines y detalle tipo revista con “Abrir en el muro”. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.channels.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-COM-26 (Canales de comunicación), PAN-COM-28 (Consumo de mensajería).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2472 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-93-e)

<a id="API-COM-93-d"></a>
#### API-COM-93-d · `PATCH /api/admin/com/sender-identities/{id}`

- **Qué hace:** Remitentes. Modifica algunos campos de un registro de remitentes verificados (`senderIdentities`) (solo los enviados).
- **Para qué sirve:** RF-COM-063: Envío por el motor de comunicaciones (email + in-app), PDF y preview HTML; en la app lista de boletines y detalle tipo revista con “Abrir en el muro”. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.channels.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de remitentes verificados (`senderIdentities`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de remitentes verificados (`senderIdentities`).
- **Pantallas:** PAN-COM-26 (Canales de comunicación), PAN-COM-28 (Consumo de mensajería).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2472 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-93-d)

<a id="API-COM-93-f"></a>
#### API-COM-93-f · `POST /api/admin/com/sender-identities/{id}/verify`

- **Qué hace:** Remitentes. Verifica un registro de remitentes verificados (`senderIdentities`).
- **Para qué sirve:** RF-COM-063: Envío por el motor de comunicaciones (email + in-app), PDF y preview HTML; en la app lista de boletines y detalle tipo revista con “Abrir en el muro”. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.channels.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-26 (Canales de comunicación), PAN-COM-28 (Consumo de mensajería).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2472 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-93-f)

<a id="API-COM-94"></a>
#### API-COM-94 · `GET /api/admin/com/internal-notification-rules`

- **Qué hace:** Reglas a responsables. Lista, con filtros y paginación, los registros de reglas de avisos internos (`internalNotificationRules`).
- **Para qué sirve:** RF-COM-131: Catálogo de tipos de comunicación (communicationTypes): código, módulo emisor, evento disparador, finalidad, canales permitidos y por defecto, orden de alternativa de canal, plantilla por canal, prioridad, ventana de envío… · RF-COM-201: Campana de avisos en AdminShell para empleados (misma colección). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.catalog.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de reglas de avisos internos (`internalNotificationRules`) con `total`.
- **Pantallas:** PAN-COM-18 (Catálogo de tipos de comunicación), PAN-COM-29 (Reglas de notificación a responsables).
- **Ola:** O1 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2473 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-94)

<a id="API-COM-94-b"></a>
#### API-COM-94-b · `POST /api/admin/com/internal-notification-rules`

- **Qué hace:** Reglas a responsables. Da de alta un registro de reglas de avisos internos (`internalNotificationRules`).
- **Para qué sirve:** RF-COM-131: Catálogo de tipos de comunicación (communicationTypes): código, módulo emisor, evento disparador, finalidad, canales permitidos y por defecto, orden de alternativa de canal, plantilla por canal, prioridad, ventana de envío… · RF-COM-201: Campana de avisos en AdminShell para empleados (misma colección). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.catalog.configurar`.
- **Recibe:** los datos de reglas de avisos internos (`internalNotificationRules`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de reglas de avisos internos (`internalNotificationRules`).
- **Pantallas:** PAN-COM-18 (Catálogo de tipos de comunicación), PAN-COM-29 (Reglas de notificación a responsables).
- **Ola:** O1 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2473 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-94-b)

<a id="API-COM-94-c"></a>
#### API-COM-94-c · `GET /api/admin/com/internal-notification-rules/{id}`

- **Qué hace:** Reglas a responsables. Obtiene el detalle de un registro de reglas de avisos internos (`internalNotificationRules`).
- **Para qué sirve:** RF-COM-131: Catálogo de tipos de comunicación (communicationTypes): código, módulo emisor, evento disparador, finalidad, canales permitidos y por defecto, orden de alternativa de canal, plantilla por canal, prioridad, ventana de envío… · RF-COM-201: Campana de avisos en AdminShell para empleados (misma colección). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.catalog.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de reglas de avisos internos (`internalNotificationRules`).
- **Pantallas:** PAN-COM-18 (Catálogo de tipos de comunicación), PAN-COM-29 (Reglas de notificación a responsables).
- **Ola:** O1 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2473 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-94-c)

<a id="API-COM-94-e"></a>
#### API-COM-94-e · `DELETE /api/admin/com/internal-notification-rules/{id}`

- **Qué hace:** Reglas a responsables. Elimina o da de baja un registro de reglas de avisos internos (`internalNotificationRules`).
- **Para qué sirve:** RF-COM-131: Catálogo de tipos de comunicación (communicationTypes): código, módulo emisor, evento disparador, finalidad, canales permitidos y por defecto, orden de alternativa de canal, plantilla por canal, prioridad, ventana de envío… · RF-COM-201: Campana de avisos en AdminShell para empleados (misma colección). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.catalog.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-COM-18 (Catálogo de tipos de comunicación), PAN-COM-29 (Reglas de notificación a responsables).
- **Ola:** O1 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2473 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-94-e)

<a id="API-COM-94-d"></a>
#### API-COM-94-d · `PATCH /api/admin/com/internal-notification-rules/{id}`

- **Qué hace:** Reglas a responsables. Modifica algunos campos de un registro de reglas de avisos internos (`internalNotificationRules`) (solo los enviados).
- **Para qué sirve:** RF-COM-131: Catálogo de tipos de comunicación (communicationTypes): código, módulo emisor, evento disparador, finalidad, canales permitidos y por defecto, orden de alternativa de canal, plantilla por canal, prioridad, ventana de envío… · RF-COM-201: Campana de avisos en AdminShell para empleados (misma colección). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.catalog.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de reglas de avisos internos (`internalNotificationRules`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de reglas de avisos internos (`internalNotificationRules`).
- **Pantallas:** PAN-COM-18 (Catálogo de tipos de comunicación), PAN-COM-29 (Reglas de notificación a responsables).
- **Ola:** O1 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2473 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-94-d)

<a id="API-COM-95"></a>
#### API-COM-95 · `GET /api/admin/com/usage`

- **Qué hace:** Consumo. Lista, con filtros y paginación, los registros de consumo de mensajería por período (`messagingUsage`).
- **Para qué sirve:** RF-COM-154: Consumo y costo de mensajería por tenant, canal, finalidad y módulo (segmentos SMS, conversaciones WhatsApp, emails), tablero y alertas de cupo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.channels.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de consumo de mensajería por período (`messagingUsage`) con `total`.
- **Pantallas:** PAN-COM-26 (Canales de comunicación), PAN-COM-28 (Consumo de mensajería).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2474 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-95)

<a id="API-COM-96"></a>
#### API-COM-96 · `GET /api/admin/com/preferences/{personId}`

- **Qué hace:** Preferencias y consentimientos por persona. Obtiene el detalle de un registro de preferencias de canal por persona (`communicationPreferences`).
- **Para qué sirve:** RF-COM-140: Resolución de canal: intersección de (canales del tipo) ∩ (preferencias del destinatario por finalidad) ∩ (consentimiento vigente) ∩ (contacto disponible y no suprimido) ∩ (canal habilitado y con conector en el tenant); si queda… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.consents.ver`.
- **Recibe:** en la ruta `personId`.
- **Devuelve:** 200: el registro de preferencias de canal por persona (`communicationPreferences`).
- **Pantallas:** PAN-COM-25 (Preferencias de comunicación por persona).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2475 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-96)

<a id="API-COM-96-b"></a>
#### API-COM-96-b · `PUT /api/admin/com/preferences/{personId}`

- **Qué hace:** Preferencias y consentimientos por persona. Reemplaza o configura un registro de preferencias de canal por persona (`communicationPreferences`).
- **Para qué sirve:** RF-COM-140: Resolución de canal: intersección de (canales del tipo) ∩ (preferencias del destinatario por finalidad) ∩ (consentimiento vigente) ∩ (contacto disponible y no suprimido) ∩ (canal habilitado y con conector en el tenant); si queda… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.consents.ver`.
- **Recibe:** en la ruta `personId`; los datos de preferencias de canal por persona (`communicationPreferences`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de preferencias de canal por persona (`communicationPreferences`).
- **Pantallas:** PAN-COM-25 (Preferencias de comunicación por persona).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2475 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-96-b)

<a id="API-COM-96-c"></a>
#### API-COM-96-c · `GET /api/admin/com/consents/{personId}`

- **Qué hace:** Preferencias y consentimientos por persona. Obtiene el detalle de un registro de `consents`.
- **Para qué sirve:** RF-COM-140: Resolución de canal: intersección de (canales del tipo) ∩ (preferencias del destinatario por finalidad) ∩ (consentimiento vigente) ∩ (contacto disponible y no suprimido) ∩ (canal habilitado y con conector en el tenant); si queda… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.consents.ver`.
- **Recibe:** en la ruta `personId`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COM-25 (Preferencias de comunicación por persona).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2475 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-96-c)

<a id="API-COM-97"></a>
#### API-COM-97 · `GET /api/admin/com/suppressions`

- **Qué hace:** Supresión. Consulta `suppressions`.
- **Para qué sirve:** RF-COM-141: Estados de entrega por comunicación: created → queued → sent_to_provider → accepted → delivered → read/opened, más clicked, failed (con failureClass: hard/soft/blocked/invalid), bounced, complained, undeliverable, expired… · RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.suppression.gestionar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2476 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-97)

<a id="API-COM-97-b"></a>
#### API-COM-97-b · `POST /api/admin/com/suppressions`

- **Qué hace:** Supresión. Registra un nuevo elemento u operación en `suppressions`.
- **Para qué sirve:** RF-COM-141: Estados de entrega por comunicación: created → queued → sent_to_provider → accepted → delivered → read/opened, más clicked, failed (con failureClass: hard/soft/blocked/invalid), bounced, complained, undeliverable, expired… · RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.suppression.gestionar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2476 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-97-b)

<a id="API-COM-97-c"></a>
#### API-COM-97-c · `POST /api/admin/com/suppressions/{id}/lift`

- **Qué hace:** Supresión. Levanta un registro de `lift`.
- **Para qué sirve:** RF-COM-141: Estados de entrega por comunicación: created → queued → sent_to_provider → accepted → delivered → read/opened, más clicked, failed (con failureClass: hard/soft/blocked/invalid), bounced, complained, undeliverable, expired… · RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.suppression.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2476 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-97-c)

<a id="API-COM-98"></a>
#### API-COM-98 · `GET /api/admin/com/outage-notices`

- **Qué hace:** Avisos de interrupción. Lista, con filtros y paginación, los registros de avisos de interrupción por zona (`outageNotices`).
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… · RF-COM-201: Campana de avisos en AdminShell para empleados (misma colección). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.outages.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de avisos de interrupción por zona (`outageNotices`) con `total`.
- **Pantallas:** PAN-COM-27 (Avisos de interrupción).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2477 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-98)

<a id="API-COM-98-b"></a>
#### API-COM-98-b · `POST /api/admin/com/outage-notices`

- **Qué hace:** Avisos de interrupción. Da de alta un registro de avisos de interrupción por zona (`outageNotices`).
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… · RF-COM-201: Campana de avisos en AdminShell para empleados (misma colección). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.outages.crear`.
- **Recibe:** los datos de avisos de interrupción por zona (`outageNotices`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de avisos de interrupción por zona (`outageNotices`).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2477 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-98-b)

<a id="API-COM-98-c"></a>
#### API-COM-98-c · `GET /api/admin/com/outage-notices/{id}`

- **Qué hace:** Avisos de interrupción. Obtiene el detalle de un registro de avisos de interrupción por zona (`outageNotices`).
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… · RF-COM-201: Campana de avisos en AdminShell para empleados (misma colección). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.outages.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de avisos de interrupción por zona (`outageNotices`).
- **Pantallas:** PAN-COM-27 (Avisos de interrupción).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2477 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-98-c)

<a id="API-COM-98-e"></a>
#### API-COM-98-e · `DELETE /api/admin/com/outage-notices/{id}`

- **Qué hace:** Avisos de interrupción. Elimina o da de baja un registro de avisos de interrupción por zona (`outageNotices`).
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.outages.publicar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2477 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-98-e)

<a id="API-COM-98-d"></a>
#### API-COM-98-d · `PATCH /api/admin/com/outage-notices/{id}`

- **Qué hace:** Avisos de interrupción. Modifica algunos campos de un registro de avisos de interrupción por zona (`outageNotices`) (solo los enviados).
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… · RF-COM-201: Campana de avisos en AdminShell para empleados (misma colección). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.outages.crear`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de avisos de interrupción por zona (`outageNotices`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de avisos de interrupción por zona (`outageNotices`).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2477 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-98-d)

<a id="API-COM-98-f"></a>
#### API-COM-98-f · `POST /api/admin/com/outage-notices/affected-preview`

- **Qué hace:** Avisos de interrupción. Registra un nuevo elemento u operación en avisos de interrupción por zona (`outageNotices`).
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… · RF-COM-201: Campana de avisos en AdminShell para empleados (misma colección). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.outages.crear`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2477 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-98-f)

<a id="API-COM-98-g"></a>
#### API-COM-98-g · `POST /api/admin/com/outage-notices/{id}/publish`

- **Qué hace:** Avisos de interrupción. Publica un registro de avisos de interrupción por zona (`outageNotices`).
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… · RF-COM-201: Campana de avisos en AdminShell para empleados (misma colección). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.outages.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2477 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-98-g)

<a id="API-COM-98-h"></a>
#### API-COM-98-h · `POST /api/admin/com/outage-notices/{id}/update`

- **Qué hace:** Avisos de interrupción. Registra «update» sobre un registro de avisos de interrupción por zona (`outageNotices`).
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… · RF-COM-201: Campana de avisos en AdminShell para empleados (misma colección). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.outages.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2477 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-98-h)

<a id="API-COM-98-i"></a>
#### API-COM-98-i · `POST /api/admin/com/outage-notices/{id}/reschedule`

- **Qué hace:** Avisos de interrupción. Reprograma un registro de avisos de interrupción por zona (`outageNotices`).
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… · RF-COM-201: Campana de avisos en AdminShell para empleados (misma colección). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.outages.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2477 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-98-i)

<a id="API-COM-98-j"></a>
#### API-COM-98-j · `POST /api/admin/com/outage-notices/{id}/restore`

- **Qué hace:** Avisos de interrupción. Restaura un registro de avisos de interrupción por zona (`outageNotices`).
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… · RF-COM-201: Campana de avisos en AdminShell para empleados (misma colección). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.outages.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2477 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-98-j)

<a id="API-COM-98-k"></a>
#### API-COM-98-k · `POST /api/admin/com/outage-notices/{id}/cancel`

- **Qué hace:** Avisos de interrupción. Cancela un registro de avisos de interrupción por zona (`outageNotices`).
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… · RF-COM-201: Campana de avisos en AdminShell para empleados (misma colección). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.outages.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2477 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-98-k)

<a id="API-COM-99"></a>
#### API-COM-99 · `GET /api/com/outages/mine`

- **Qué hace:** Cortes de mis domicilios / públicos. Consulta `mine`.
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `por.portal.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-23 (Splash y selección de espacio), PAN-POR-24 (Aceptación de términos), PAN-POR-25 (Inicio del socio) y 15 más.
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2478 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-99)

<a id="API-COM-99-b"></a>
#### API-COM-99-b · `GET /api/public/{tenantSlug}/com/outages`

- **Qué hace:** Cortes de mis domicilios / públicos. Consulta `outages`.
- **Para qué sirve:** RF-COM-190: Campaña: nombre, finalidad (community, marketing, operational, service_outage), audiencia (motor único), canales y orden de preferencia, plantilla por canal (o contenido ad hoc versionado), enlace de destino (pantalla… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); permiso `por.portal.ver`.
- **Recibe:** en la ruta `tenantSlug`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-23 (Splash y selección de espacio), PAN-POR-24 (Aceptación de términos), PAN-POR-25 (Inicio del socio) y 15 más.
- **Ola:** O2 · **Fuente:** T09 §11.4 Motor de comunicaciones, campañas y canales, línea 2478 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Motor%20de%20comunicaciones%2C%20campa%C3%B1as%20y%20canales/API-COM-99-b)

<a id="grupo-5"></a>

## Preferencias, bandeja, push, enlaces y plataforma

27 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-COM-100](#API-COM-100) | GET | `/api/com/preferences` | Mis preferencias (registra consentimiento). |
| [API-COM-100-b](#API-COM-100-b) | PUT | `/api/com/preferences` | Mis preferencias (registra consentimiento). |
| [API-COM-101](#API-COM-101) | GET | `/api/public/{tenantSlug}/com/subscriptions/{token}` | Baja de un clic y gestión sin login; también endpoint List-Unsubscribe-Post. |
| [API-COM-101-b](#API-COM-101-b) | POST | `/api/public/{tenantSlug}/com/subscriptions/{token}` | Baja de un clic y gestión sin login; también endpoint List-Unsubscribe-Post. |
| [API-COM-101-c](#API-COM-101-c) | POST | `/api/public/{tenantSlug}/com/subscriptions/{token}/unsubscribe` | Baja de un clic y gestión sin login; también endpoint List-Unsubscribe-Post. |
| [API-COM-102](#API-COM-102) | GET | `/api/com/inbox` | Bandeja y badge. |
| [API-COM-102-b](#API-COM-102-b) | GET | `/api/com/inbox/unread-count` | Bandeja y badge. |
| [API-COM-103](#API-COM-103) | POST | `/api/com/inbox/{id}/read` | Acciones. |
| [API-COM-103-b](#API-COM-103-b) | POST | `/api/com/inbox/{id}/read-all` | Acciones. |
| [API-COM-103-c](#API-COM-103-c) | POST | `/api/com/inbox/{id}/dismiss` | Acciones. |
| [API-COM-103-d](#API-COM-103-d) | POST | `/api/com/inbox/{id}/undismiss` | Acciones. |
| [API-COM-104](#API-COM-104) | POST | `/api/com/push/subscriptions` | Alta/baja de suscripción push; GET /api/com/push/vapid-key. |
| [API-COM-104-b](#API-COM-104-b) | DELETE | `/api/com/push/subscriptions` | Alta/baja de suscripción push; GET /api/com/push/vapid-key. |
| [API-COM-105](#API-COM-105) | GET | `/l/{slug}` | Redirección con registro de clic (lista blanca de destinos). |
| [API-COM-106](#API-COM-106) | GET | `/api/public/{tenantSlug}/com/o/{pixel}` | Píxel de apertura de email (opcional por tenant, PRM-COM-065). |
| [API-COM-107](#API-COM-107) | POST | `/api/internal/com/provider-events` | Ingreso de eventos de proveedor normalizados (int.message.*) cuando no llegan por outbox. |
| [API-COM-108](#API-COM-108) | POST | `/api/internal/com/inbound-messages` | Mensajes entrantes para palabras de baja (P-COM-10). |
| [API-COM-109](#API-COM-109) | GET | `/api/platform/com/notices` | Avisos de plataforma. |
| [API-COM-109-b](#API-COM-109-b) | POST | `/api/platform/com/notices` | Avisos de plataforma. |
| [API-COM-109-c](#API-COM-109-c) | GET | `/api/platform/com/notices/{id}` | Avisos de plataforma. |
| [API-COM-109-e](#API-COM-109-e) | DELETE | `/api/platform/com/notices/{id}` | Avisos de plataforma. |
| [API-COM-109-d](#API-COM-109-d) | PATCH | `/api/platform/com/notices/{id}` | Avisos de plataforma. |
| [API-COM-110](#API-COM-110) | GET | `/api/platform/com/messaging-usage` | Consumo por tenant (sin contenido). |
| [API-COM-111](#API-COM-111) | GET | `/api/admin/com/platform-notices` | Avisos de plataforma recibidos. |
| [API-COM-111-b](#API-COM-111-b) | GET | `/api/admin/com/platform-notices/{id}/read` | Avisos de plataforma recibidos. |
| [API-COM-112](#API-COM-112) | GET | `/api/public/{tenantSlug}/com/posts` | Noticias de landing (NOT-001). |
| [API-COM-112-b](#API-COM-112-b) | GET | `/api/public/{tenantSlug}/com/posts/{slug}` | Noticias de landing (NOT-001). |

<a id="API-COM-100"></a>
#### API-COM-100 · `GET /api/com/preferences`

- **Qué hace:** Mis preferencias (registra consentimiento). Lista, con filtros y paginación, los registros de preferencias de canal por persona (`communicationPreferences`).
- **Para qué sirve:** RF-COM-140: Resolución de canal: intersección de (canales del tipo) ∩ (preferencias del destinatario por finalidad) ∩ (consentimiento vigente) ∩ (contacto disponible y no suprimido) ∩ (canal habilitado y con conector en el tenant); si queda… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.preferences.editar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de preferencias de canal por persona (`communicationPreferences`) con `total`.
- **Pantallas:** PAN-POR-60 (Preferencias de comunicación), PAN-COM-47 (Preferencias de comunicación (PWA)).
- **Ola:** O2 · **Fuente:** T09 §11.5 Preferencias, bandeja, push, enlaces y plataforma, línea 2484 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Preferencias%2C%20bandeja%2C%20push%2C%20enlaces%20y%20plataforma/API-COM-100)

<a id="API-COM-100-b"></a>
#### API-COM-100-b · `PUT /api/com/preferences`

- **Qué hace:** Mis preferencias (registra consentimiento). Reemplaza o configura preferencias de canal por persona (`communicationPreferences`).
- **Para qué sirve:** RF-COM-140: Resolución de canal: intersección de (canales del tipo) ∩ (preferencias del destinatario por finalidad) ∩ (consentimiento vigente) ∩ (contacto disponible y no suprimido) ∩ (canal habilitado y con conector en el tenant); si queda… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.preferences.editar`.
- **Recibe:** los datos de preferencias de canal por persona (`communicationPreferences`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de preferencias de canal por persona (`communicationPreferences`).
- **Pantallas:** PAN-POR-60 (Preferencias de comunicación), PAN-COM-47 (Preferencias de comunicación (PWA)).
- **Ola:** O2 · **Fuente:** T09 §11.5 Preferencias, bandeja, push, enlaces y plataforma, línea 2484 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Preferencias%2C%20bandeja%2C%20push%2C%20enlaces%20y%20plataforma/API-COM-100-b)

<a id="API-COM-101"></a>
#### API-COM-101 · `GET /api/public/{tenantSlug}/com/subscriptions/{token}`

- **Qué hace:** Baja de un clic y gestión sin login; también endpoint List-Unsubscribe-Post. Obtiene el detalle de un registro de suscripciones push PWA (`pushSubscriptions`).
- **Para qué sirve:** RF-COM-173: Link de baja de un clic en emails community/marketing (encabezado List-Unsubscribe) y página de gestión sin login por token. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`, `token`.
- **Devuelve:** 200: el registro de suscripciones push PWA (`pushSubscriptions`).
- **Ola:** O2 · **Fuente:** T09 §11.5 Preferencias, bandeja, push, enlaces y plataforma, línea 2485 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Preferencias%2C%20bandeja%2C%20push%2C%20enlaces%20y%20plataforma/API-COM-101)

<a id="API-COM-101-b"></a>
#### API-COM-101-b · `POST /api/public/{tenantSlug}/com/subscriptions/{token}`

- **Qué hace:** Baja de un clic y gestión sin login; también endpoint List-Unsubscribe-Post. Registra un nuevo elemento u operación en suscripciones push PWA (`pushSubscriptions`).
- **Para qué sirve:** RF-COM-173: Link de baja de un clic en emails community/marketing (encabezado List-Unsubscribe) y página de gestión sin login por token. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`, `token`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T09 §11.5 Preferencias, bandeja, push, enlaces y plataforma, línea 2485 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Preferencias%2C%20bandeja%2C%20push%2C%20enlaces%20y%20plataforma/API-COM-101-b)

<a id="API-COM-101-c"></a>
#### API-COM-101-c · `POST /api/public/{tenantSlug}/com/subscriptions/{token}/unsubscribe`

- **Qué hace:** Baja de un clic y gestión sin login; también endpoint List-Unsubscribe-Post. Registra «unsubscribe» sobre un registro de suscripciones push PWA (`pushSubscriptions`).
- **Para qué sirve:** RF-COM-173: Link de baja de un clic en emails community/marketing (encabezado List-Unsubscribe) y página de gestión sin login por token. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`, `token`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T09 §11.5 Preferencias, bandeja, push, enlaces y plataforma, línea 2485 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Preferencias%2C%20bandeja%2C%20push%2C%20enlaces%20y%20plataforma/API-COM-101-c)

<a id="API-COM-102"></a>
#### API-COM-102 · `GET /api/com/inbox`

- **Qué hace:** Bandeja y badge. Lista, con filtros y paginación, los registros de `inbox`.
- **Para qué sirve:** RF-COM-137: Push PWA: suscripciones por dispositivo (VAPID), título, cuerpo, imagen, enlace profundo, badge; limpieza de suscripciones expiradas (410). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.inbox.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ResultadoGenerico (`ResultadoGenerico`) con `total`.
- **Pantallas:** PAN-POR-53 (Avisos), PAN-POR-76 (Avisos internos), PAN-COM-32 (Bandeja del empleado) y 1 más.
- **Ola:** O2 · **Fuente:** T09 §11.5 Preferencias, bandeja, push, enlaces y plataforma, línea 2486 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Preferencias%2C%20bandeja%2C%20push%2C%20enlaces%20y%20plataforma/API-COM-102)

<a id="API-COM-102-b"></a>
#### API-COM-102-b · `GET /api/com/inbox/unread-count`

- **Qué hace:** Bandeja y badge. Lista, con filtros y paginación, los registros de `unread-count`.
- **Para qué sirve:** RF-COM-137: Push PWA: suscripciones por dispositivo (VAPID), título, cuerpo, imagen, enlace profundo, badge; limpieza de suscripciones expiradas (410). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.inbox.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ResultadoGenerico (`ResultadoGenerico`) con `total`.
- **Pantallas:** PAN-POR-53 (Avisos), PAN-POR-76 (Avisos internos), PAN-COM-32 (Bandeja del empleado) y 1 más.
- **Ola:** O2 · **Fuente:** T09 §11.5 Preferencias, bandeja, push, enlaces y plataforma, línea 2486 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Preferencias%2C%20bandeja%2C%20push%2C%20enlaces%20y%20plataforma/API-COM-102-b)

<a id="API-COM-103"></a>
#### API-COM-103 · `POST /api/com/inbox/{id}/read`

- **Qué hace:** Acciones. Registra «read» sobre un registro de `read`.
- **Para qué sirve:** RF-COM-137: Push PWA: suscripciones por dispositivo (VAPID), título, cuerpo, imagen, enlace profundo, badge; limpieza de suscripciones expiradas (410). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.inbox.ver`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-53 (Avisos), PAN-POR-76 (Avisos internos), PAN-COM-32 (Bandeja del empleado) y 1 más.
- **Ola:** O0 · **Fuente:** T09 §11.5 Preferencias, bandeja, push, enlaces y plataforma, línea 2487 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Preferencias%2C%20bandeja%2C%20push%2C%20enlaces%20y%20plataforma/API-COM-103)

<a id="API-COM-103-b"></a>
#### API-COM-103-b · `POST /api/com/inbox/{id}/read-all`

- **Qué hace:** Acciones. Registra «read-all» sobre un registro de `read-all`.
- **Para qué sirve:** RF-COM-137: Push PWA: suscripciones por dispositivo (VAPID), título, cuerpo, imagen, enlace profundo, badge; limpieza de suscripciones expiradas (410). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.inbox.ver`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-53 (Avisos), PAN-POR-76 (Avisos internos), PAN-COM-32 (Bandeja del empleado) y 1 más.
- **Ola:** O0 · **Fuente:** T09 §11.5 Preferencias, bandeja, push, enlaces y plataforma, línea 2487 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Preferencias%2C%20bandeja%2C%20push%2C%20enlaces%20y%20plataforma/API-COM-103-b)

<a id="API-COM-103-c"></a>
#### API-COM-103-c · `POST /api/com/inbox/{id}/dismiss`

- **Qué hace:** Acciones. Registra «dismiss» sobre un registro de `dismiss`.
- **Para qué sirve:** RF-COM-137: Push PWA: suscripciones por dispositivo (VAPID), título, cuerpo, imagen, enlace profundo, badge; limpieza de suscripciones expiradas (410). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.inbox.ver`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-53 (Avisos), PAN-POR-76 (Avisos internos), PAN-COM-32 (Bandeja del empleado) y 1 más.
- **Ola:** O0 · **Fuente:** T09 §11.5 Preferencias, bandeja, push, enlaces y plataforma, línea 2487 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Preferencias%2C%20bandeja%2C%20push%2C%20enlaces%20y%20plataforma/API-COM-103-c)

<a id="API-COM-103-d"></a>
#### API-COM-103-d · `POST /api/com/inbox/{id}/undismiss`

- **Qué hace:** Acciones. Registra «undismiss» sobre un registro de `undismiss`.
- **Para qué sirve:** RF-COM-137: Push PWA: suscripciones por dispositivo (VAPID), título, cuerpo, imagen, enlace profundo, badge; limpieza de suscripciones expiradas (410). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.inbox.ver`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-53 (Avisos), PAN-POR-76 (Avisos internos), PAN-COM-32 (Bandeja del empleado) y 1 más.
- **Ola:** O0 · **Fuente:** T09 §11.5 Preferencias, bandeja, push, enlaces y plataforma, línea 2487 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Preferencias%2C%20bandeja%2C%20push%2C%20enlaces%20y%20plataforma/API-COM-103-d)

<a id="API-COM-104"></a>
#### API-COM-104 · `POST /api/com/push/subscriptions`

- **Qué hace:** Alta/baja de suscripción push; GET /api/com/push/vapid-key. Da de alta un registro de suscripciones push PWA (`pushSubscriptions`).
- **Para qué sirve:** RF-COM-137: Push PWA: suscripciones por dispositivo (VAPID), título, cuerpo, imagen, enlace profundo, badge; limpieza de suscripciones expiradas (410). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.inbox.ver`.
- **Recibe:** los datos de suscripciones push PWA (`pushSubscriptions`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de suscripciones push PWA (`pushSubscriptions`).
- **Pantallas:** PAN-POR-53 (Avisos), PAN-POR-76 (Avisos internos), PAN-COM-32 (Bandeja del empleado) y 1 más.
- **Ola:** O2 · **Fuente:** T09 §11.5 Preferencias, bandeja, push, enlaces y plataforma, línea 2488 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Preferencias%2C%20bandeja%2C%20push%2C%20enlaces%20y%20plataforma/API-COM-104)

<a id="API-COM-104-b"></a>
#### API-COM-104-b · `DELETE /api/com/push/subscriptions`

- **Qué hace:** Alta/baja de suscripción push; GET /api/com/push/vapid-key. Elimina o da de baja un registro de suscripciones push PWA (`pushSubscriptions`).
- **Para qué sirve:** RF-COM-137: Push PWA: suscripciones por dispositivo (VAPID), título, cuerpo, imagen, enlace profundo, badge; limpieza de suscripciones expiradas (410). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `com.inbox.ver`.
- **Recibe:** cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-POR-53 (Avisos), PAN-POR-76 (Avisos internos), PAN-COM-32 (Bandeja del empleado) y 1 más.
- **Ola:** O2 · **Fuente:** T09 §11.5 Preferencias, bandeja, push, enlaces y plataforma, línea 2488 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Preferencias%2C%20bandeja%2C%20push%2C%20enlaces%20y%20plataforma/API-COM-104-b)

<a id="API-COM-105"></a>
#### API-COM-105 · `GET /l/{slug}`

- **Qué hace:** Redirección con registro de clic (lista blanca de destinos). Obtiene el detalle de un registro de `l`.
- **Para qué sirve:** RF-COM-010: Feed PWA en modo carrusel o lista infinita (de a 10) con preferencia persistida. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `slug`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T09 §11.5 Preferencias, bandeja, push, enlaces y plataforma, línea 2489 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Preferencias%2C%20bandeja%2C%20push%2C%20enlaces%20y%20plataforma/API-COM-105)

<a id="API-COM-106"></a>
#### API-COM-106 · `GET /api/public/{tenantSlug}/com/o/{pixel}`

- **Qué hace:** Píxel de apertura de email (opcional por tenant, PRM-COM-065). Obtiene el detalle de un registro de `o`.
- **Para qué sirve:** RF-COM-009: Opciones por publicación: notificar a la audiencia (in-app, push, email), permitir reacciones, permitir comentarios, modo de moderación de comentarios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`, `pixel`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T09 §11.5 Preferencias, bandeja, push, enlaces y plataforma, línea 2490 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Preferencias%2C%20bandeja%2C%20push%2C%20enlaces%20y%20plataforma/API-COM-106)

<a id="API-COM-107"></a>
#### API-COM-107 · `POST /api/internal/com/provider-events`

- **Qué hace:** Ingreso de eventos de proveedor normalizados (int.message.*) cuando no llegan por outbox. Registra un nuevo elemento u operación en `provider-events`.
- **Para qué sirve:** RF-COM-155: Recepción de eventos del proveedor (entregado, leído, rebote, queja, baja STOP) mediante webhooks firmados recibidos por T06 y normalizados a com.communication.statusChanged. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Otros módulos del sistema (uso interno, no expuesto a usuarios); permiso `com.providerEvents.registrar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T09 §11.5 Preferencias, bandeja, push, enlaces y plataforma, línea 2491 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Preferencias%2C%20bandeja%2C%20push%2C%20enlaces%20y%20plataforma/API-COM-107)

<a id="API-COM-108"></a>
#### API-COM-108 · `POST /api/internal/com/inbound-messages`

- **Qué hace:** Mensajes entrantes para palabras de baja (P-COM-10). Registra un nuevo elemento u operación en `inbound-messages`.
- **Para qué sirve:** RF-COM-156: Mensajes entrantes (respuestas SMS/WhatsApp, “STOP/BAJA”): las palabras de baja actualizan consentimiento; el resto se enruta a M09. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Otros módulos del sistema (uso interno, no expuesto a usuarios); permiso `com.inboundMessages.registrar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T09 §11.5 Preferencias, bandeja, push, enlaces y plataforma, línea 2492 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Preferencias%2C%20bandeja%2C%20push%2C%20enlaces%20y%20plataforma/API-COM-108)

<a id="API-COM-109"></a>
#### API-COM-109 · `GET /api/platform/com/notices`

- **Qué hace:** Avisos de plataforma. Lista, con filtros y paginación, los registros de avisos de interrupción por zona (`outageNotices`).
- **Para qué sirve:** RF-COM-120: Afectación por red: audiencia por ramal/transformador/nodo/OLT provista por M10 para avisos de interrupción. · RF-COM-204: Avisos de plataforma (tenant PLATFORM) a administradores de tenants: mantenimiento, novedades del producto, encuestas de producto (reemplazo de RSSFEED/clsRss), clasificación de permanencia (1 día / 20 días / 5 días equivalentes). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.notices.publicar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de avisos de interrupción por zona (`outageNotices`) con `total`.
- **Pantallas:** PAN-COM-33 (Avisos de plataforma a tenants).
- **Ola:** O2 · **Fuente:** T09 §11.5 Preferencias, bandeja, push, enlaces y plataforma, línea 2493 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Preferencias%2C%20bandeja%2C%20push%2C%20enlaces%20y%20plataforma/API-COM-109)

<a id="API-COM-109-b"></a>
#### API-COM-109-b · `POST /api/platform/com/notices`

- **Qué hace:** Avisos de plataforma. Da de alta un registro de avisos de interrupción por zona (`outageNotices`).
- **Para qué sirve:** RF-COM-120: Afectación por red: audiencia por ramal/transformador/nodo/OLT provista por M10 para avisos de interrupción. · RF-COM-204: Avisos de plataforma (tenant PLATFORM) a administradores de tenants: mantenimiento, novedades del producto, encuestas de producto (reemplazo de RSSFEED/clsRss), clasificación de permanencia (1 día / 20 días / 5 días equivalentes). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.notices.publicar`.
- **Recibe:** los datos de avisos de interrupción por zona (`outageNotices`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de avisos de interrupción por zona (`outageNotices`).
- **Pantallas:** PAN-COM-33 (Avisos de plataforma a tenants).
- **Ola:** O2 · **Fuente:** T09 §11.5 Preferencias, bandeja, push, enlaces y plataforma, línea 2493 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Preferencias%2C%20bandeja%2C%20push%2C%20enlaces%20y%20plataforma/API-COM-109-b)

<a id="API-COM-109-c"></a>
#### API-COM-109-c · `GET /api/platform/com/notices/{id}`

- **Qué hace:** Avisos de plataforma. Obtiene el detalle de un registro de avisos de interrupción por zona (`outageNotices`).
- **Para qué sirve:** RF-COM-120: Afectación por red: audiencia por ramal/transformador/nodo/OLT provista por M10 para avisos de interrupción. · RF-COM-204: Avisos de plataforma (tenant PLATFORM) a administradores de tenants: mantenimiento, novedades del producto, encuestas de producto (reemplazo de RSSFEED/clsRss), clasificación de permanencia (1 día / 20 días / 5 días equivalentes). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.notices.publicar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de avisos de interrupción por zona (`outageNotices`).
- **Pantallas:** PAN-COM-33 (Avisos de plataforma a tenants).
- **Ola:** O2 · **Fuente:** T09 §11.5 Preferencias, bandeja, push, enlaces y plataforma, línea 2493 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Preferencias%2C%20bandeja%2C%20push%2C%20enlaces%20y%20plataforma/API-COM-109-c)

<a id="API-COM-109-e"></a>
#### API-COM-109-e · `DELETE /api/platform/com/notices/{id}`

- **Qué hace:** Avisos de plataforma. Elimina o da de baja un registro de avisos de interrupción por zona (`outageNotices`).
- **Para qué sirve:** RF-COM-120: Afectación por red: audiencia por ramal/transformador/nodo/OLT provista por M10 para avisos de interrupción. · RF-COM-204: Avisos de plataforma (tenant PLATFORM) a administradores de tenants: mantenimiento, novedades del producto, encuestas de producto (reemplazo de RSSFEED/clsRss), clasificación de permanencia (1 día / 20 días / 5 días equivalentes). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.notices.publicar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-COM-33 (Avisos de plataforma a tenants).
- **Ola:** O2 · **Fuente:** T09 §11.5 Preferencias, bandeja, push, enlaces y plataforma, línea 2493 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Preferencias%2C%20bandeja%2C%20push%2C%20enlaces%20y%20plataforma/API-COM-109-e)

<a id="API-COM-109-d"></a>
#### API-COM-109-d · `PATCH /api/platform/com/notices/{id}`

- **Qué hace:** Avisos de plataforma. Modifica algunos campos de un registro de avisos de interrupción por zona (`outageNotices`) (solo los enviados).
- **Para qué sirve:** RF-COM-120: Afectación por red: audiencia por ramal/transformador/nodo/OLT provista por M10 para avisos de interrupción. · RF-COM-204: Avisos de plataforma (tenant PLATFORM) a administradores de tenants: mantenimiento, novedades del producto, encuestas de producto (reemplazo de RSSFEED/clsRss), clasificación de permanencia (1 día / 20 días / 5 días equivalentes). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.notices.publicar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de avisos de interrupción por zona (`outageNotices`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de avisos de interrupción por zona (`outageNotices`).
- **Pantallas:** PAN-COM-33 (Avisos de plataforma a tenants).
- **Ola:** O2 · **Fuente:** T09 §11.5 Preferencias, bandeja, push, enlaces y plataforma, línea 2493 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Preferencias%2C%20bandeja%2C%20push%2C%20enlaces%20y%20plataforma/API-COM-109-d)

<a id="API-COM-110"></a>
#### API-COM-110 · `GET /api/platform/com/messaging-usage`

- **Qué hace:** Consumo por tenant (sin contenido). Lista, con filtros y paginación, los registros de consumo de mensajería por período (`messagingUsage`).
- **Para qué sirve:** RF-COM-154: Consumo y costo de mensajería por tenant, canal, finalidad y módulo (segmentos SMS, conversaciones WhatsApp, emails), tablero y alertas de cupo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.messaging.consumo.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de consumo de mensajería por período (`messagingUsage`) con `total`.
- **Pantallas:** PAN-COM-34 (Consumo global por tenant, canal y proveedor).
- **Ola:** O2 · **Fuente:** T09 §11.5 Preferencias, bandeja, push, enlaces y plataforma, línea 2494 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Preferencias%2C%20bandeja%2C%20push%2C%20enlaces%20y%20plataforma/API-COM-110)

<a id="API-COM-111"></a>
#### API-COM-111 · `GET /api/admin/com/platform-notices`

- **Qué hace:** Avisos de plataforma recibidos. Lista, con filtros y paginación, los registros de avisos de plataforma a administradores (`platformNotices`).
- **Para qué sirve:** RF-COM-204: Avisos de plataforma (tenant PLATFORM) a administradores de tenants: mantenimiento, novedades del producto, encuestas de producto (reemplazo de RSSFEED/clsRss), clasificación de permanencia (1 día / 20 días / 5 días equivalentes). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.platformNotices.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de avisos de plataforma a administradores (`platformNotices`) con `total`.
- **Ola:** O1 · **Fuente:** T09 §11.5 Preferencias, bandeja, push, enlaces y plataforma, línea 2495 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Preferencias%2C%20bandeja%2C%20push%2C%20enlaces%20y%20plataforma/API-COM-111)

<a id="API-COM-111-b"></a>
#### API-COM-111-b · `GET /api/admin/com/platform-notices/{id}/read`

- **Qué hace:** Avisos de plataforma recibidos. Consulta «read» de un registro de avisos de plataforma a administradores (`platformNotices`).
- **Para qué sirve:** RF-COM-204: Avisos de plataforma (tenant PLATFORM) a administradores de tenants: mantenimiento, novedades del producto, encuestas de producto (reemplazo de RSSFEED/clsRss), clasificación de permanencia (1 día / 20 días / 5 días equivalentes). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `com.platformNotices.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de avisos de plataforma a administradores (`platformNotices`).
- **Ola:** O1 · **Fuente:** T09 §11.5 Preferencias, bandeja, push, enlaces y plataforma, línea 2495 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Preferencias%2C%20bandeja%2C%20push%2C%20enlaces%20y%20plataforma/API-COM-111-b)

<a id="API-COM-112"></a>
#### API-COM-112 · `GET /api/public/{tenantSlug}/com/posts`

- **Qué hace:** Noticias de landing (NOT-001). Lista, con filtros y paginación, los registros de publicaciones del muro y novedades (`posts`).
- **Para qué sirve:** RF-COM-001: Publicar noticias en la landing pública del tenant. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de publicaciones del muro y novedades (`posts`) con `total`.
- **Ola:** O2 · **Fuente:** T09 §11.5 Preferencias, bandeja, push, enlaces y plataforma, línea 2496 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Preferencias%2C%20bandeja%2C%20push%2C%20enlaces%20y%20plataforma/API-COM-112)

<a id="API-COM-112-b"></a>
#### API-COM-112-b · `GET /api/public/{tenantSlug}/com/posts/{slug}`

- **Qué hace:** Noticias de landing (NOT-001). Obtiene el detalle de un registro de publicaciones del muro y novedades (`posts`).
- **Para qué sirve:** RF-COM-001: Publicar noticias en la landing pública del tenant. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`, `slug`.
- **Devuelve:** 200: el registro de publicaciones del muro y novedades (`posts`).
- **Ola:** O2 · **Fuente:** T09 §11.5 Preferencias, bandeja, push, enlaces y plataforma, línea 2496 · [Ver en Swagger](../18-swagger/index.html?api=t09-com#/Preferencias%2C%20bandeja%2C%20push%2C%20enlaces%20y%20plataforma/API-COM-112-b)
