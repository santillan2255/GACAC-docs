# Catálogo de endpoints · M09 · CRM y atención (solicitudes, reclamos, tickets, mesa de entradas, turnero, canales, bot, IA, actividades internas)

Parte del [catálogo de endpoints](../18-catalogo-endpoints.md) (artefacto 7.1). Generado el 05-11-2026 con `_trabajo/gen_18_catalogo_endpoints.py` a partir de `18-openapi/`; no se edita a mano.

## Para qué sirve esta API

Centralizar en un expediente único por gestión toda la atención que la cooperativa brinda a sus socios, usuarios no asociados, solicitantes sin cuenta y terceros (organismos, juzgados, proveedores que presentan notas), cualquiera sea el canal de ingreso (portal y app del socio, WhatsApp, email, SMS, teléfono/IVR, chat web, redes sociales, ventanilla con o sin turnero, mesa de entradas, bot), con:

1. casos trazables con número de seguimiento que el socio consulta y el personal atiende (BASE §47 CRM-001 a CRM-010);
2. solicitudes comerciales de cualquier servicio del catálogo del tenant: alta, baja (incluida la recepción pública sin registro), suspensión temporal, reactivación, cambio de titular, cambio de plan/categoría, traslado, cambio de equipo o medidor, adhesiones y actualizaciones de datos (BASE §15, §48, §53);
3. reclamos e incidentes con SLA, prioridad, avisos al socio de cada cambio de estado, agrupación de afectados en un incidente común, duplicados, reapertura, reincidencia y satisfacción (BASE §16, DFA M14 mejoras);
4. bandejas de supervisión, de área y personales, con derivación por supervisores y resolución por empleados autorizados;
5. canales y bot de autogestión (WhatsApp Business con plantillas, MER-016) e IA supervisada que solo propone (AGR-030, CNX §4.2);
6. historial unificado de interacciones ligado a persona, cuenta y servicio (DFA M21 mejora "CRM unificado");
7. atención presencial y turnero (áreas, boxes, llamados, derivaciones, estadísticas, turno online, pantallas y hardware vía agente local);
8. mesa de entradas documental y actividades/tareas internas recurrentes con recordatorios y tablero de control;
9. circulares y uso de plantillas de correspondencia, delegando el motor de envío en T09.

Detalle completo en el anexo M09, sección 1. Contrato navegable: [Swagger](../18-swagger/index.html?api=m09-crm).

| Dato | Valor |
|---|---|
| Endpoints | 248 |
| Por método | DELETE 29, GET 87, PATCH 30, POST 102 |
| Grupos funcionales | 4 |
| Con requisito citado en el anexo | 0 |
| Con requisito inferido (a confirmar) | 248 |
| Sin requisito identificable | 0 |

## Grupos funcionales

| Grupo | Endpoints | Qué agrupa (primeros endpoints) |
|---|---|---|
| [Admin (`/api/admin/crm/...`)](#grupo-1) | 219 | Listar casos con filtros de bandeja y vistas.; Crear caso (agente, carga rápida); Detalle con contexto.… |
| [Socio (`/api/crm/...`, consumidos por M19)](#grupo-2) | 18 | Mis gestiones.; Nueva gestión (reclamo, consulta, solicitud); Detalle (sin notas internas)… |
| [Público (`/api/public/<tenantSlug>/crm/...`)](#grupo-3) | 8 | Servicios alcanzados y campos del formulario de baja.; Recepción pública de baja; devuelve código.; Estado público del caso (sin datos privados)… |
| [Webhooks e internos](#grupo-4) | 3 | Entrantes de WhatsApp, SMS, email, redes, CTI/IVR.; Consulta y alta de reclamo desde IVR. |

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

## Admin (`/api/admin/crm/...`)

219 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-CRM-01](#API-CRM-01) | GET | `/api/admin/crm/cases` | Listar casos con filtros de bandeja y vistas. |
| [API-CRM-02](#API-CRM-02) | POST | `/api/admin/crm/cases` | Crear caso (agente, carga rápida) |
| [API-CRM-03](#API-CRM-03) | GET | `/api/admin/crm/cases/{id}` | Detalle con contexto. |
| [API-CRM-04](#API-CRM-04) | PATCH | `/api/admin/crm/cases/{id}` | Editar campos no estructurales (asunto, etiquetas, campos adicionales, contactos) |
| [API-CRM-05](#API-CRM-05) | POST | `/api/admin/crm/cases/{id}/transitions` | Ejecutar transición ({ to, reason, data }) |
| [API-CRM-06](#API-CRM-06) | POST | `/api/admin/crm/cases/{id}/derive` | Derivar a área. |
| [API-CRM-07](#API-CRM-07) | POST | `/api/admin/crm/cases/{id}/assign` | Asignar/reasignar. |
| [API-CRM-08](#API-CRM-08) | POST | `/api/admin/crm/cases/{id}/take` | Tomar, pausar, soltar, retomar. |
| [API-CRM-08-b](#API-CRM-08-b) | POST | `/api/admin/crm/cases/{id}/pause` | Tomar, pausar, soltar, retomar. |
| [API-CRM-08-c](#API-CRM-08-c) | POST | `/api/admin/crm/cases/{id}/release` | Tomar, pausar, soltar, retomar. |
| [API-CRM-08-d](#API-CRM-08-d) | POST | `/api/admin/crm/cases/{id}/resume` | Tomar, pausar, soltar, retomar. |
| [API-CRM-09](#API-CRM-09) | POST | `/api/admin/crm/cases/{id}/classify` | Clasificar/reclasificar (acepta o corrige sugerencia IA) |
| [API-CRM-10](#API-CRM-10) | POST | `/api/admin/crm/cases/{id}/messages` | Mensaje visible o nota interna (con adjuntos) |
| [API-CRM-11](#API-CRM-11) | GET | `/api/admin/crm/cases/{id}/timeline` | Timeline (eventos + mensajes + comunicaciones) |
| [API-CRM-12](#API-CRM-12) | POST | `/api/admin/crm/cases/{id}/requirements` | Pedir/actualizar requisitos. |
| [API-CRM-13](#API-CRM-13) | POST | `/api/admin/crm/cases/{id}/commands` | Solicitar comando a módulo dueño. |
| [API-CRM-14](#API-CRM-14) | GET | `/api/admin/crm/command-requests` | Seguimiento de comandos (filtros estado/módulo) |
| [API-CRM-15](#API-CRM-15) | POST | `/api/admin/crm/command-requests/{id}/retry` | Reintentar comando fallido. |
| [API-CRM-16](#API-CRM-16) | POST | `/api/admin/crm/cases/{id}/links` | Vincular/desvincular entidades. |
| [API-CRM-16-b](#API-CRM-16-b) | DELETE | `/api/admin/crm/cases/{id}/links/{linkId}` | Vincular/desvincular entidades. |
| [API-CRM-17](#API-CRM-17) | POST | `/api/admin/crm/cases/{id}/merge` | Fusionar en caso principal. |
| [API-CRM-18](#API-CRM-18) | POST | `/api/admin/crm/cases/{id}/resolve` | Resolver. |
| [API-CRM-19](#API-CRM-19) | POST | `/api/admin/crm/cases/{id}/close` | Cerrar con tipo/causa/validaciones. |
| [API-CRM-20](#API-CRM-20) | POST | `/api/admin/crm/cases/{id}/reopen` | Reabrir/recuperar. |
| [API-CRM-20-b](#API-CRM-20-b) | POST | `/api/admin/crm/cases/{id}/recover` | Reabrir/recuperar. |
| [API-CRM-21](#API-CRM-21) | POST | `/api/admin/crm/cases/{id}/cancel` | Cancelar con motivo. |
| [API-CRM-22](#API-CRM-22) | POST | `/api/admin/crm/cases/bulk` | Acciones masivas. |
| [API-CRM-23](#API-CRM-23) | GET | `/api/admin/crm/cases/export` | Exportar XLSX/CSV/PDF. |
| [API-CRM-24](#API-CRM-24) | GET | `/api/admin/crm/cases/{id}/duplicates` | Candidatos a duplicado. |
| [API-CRM-25](#API-CRM-25) | GET | `/api/admin/crm/persons/{personId}/timeline` | Historial unificado 360. |
| [API-CRM-26](#API-CRM-26) | POST | `/api/admin/crm/interactions` | Registrar interacción (llamada, visita) |
| [API-CRM-27](#API-CRM-27) | GET | `/api/admin/crm/search` | Búsqueda global. |
| [API-CRM-28](#API-CRM-28) | GET | `/api/admin/crm/incidents` | ABM de incidentes. |
| [API-CRM-28-b](#API-CRM-28-b) | POST | `/api/admin/crm/incidents` | ABM de incidentes. |
| [API-CRM-28-c](#API-CRM-28-c) | GET | `/api/admin/crm/incidents/{id}` | ABM de incidentes. |
| [API-CRM-28-d](#API-CRM-28-d) | PATCH | `/api/admin/crm/incidents/{id}` | ABM de incidentes. |
| [API-CRM-29](#API-CRM-29) | POST | `/api/admin/crm/incidents/{id}/cases` | Vincular casos al incidente. |
| [API-CRM-30](#API-CRM-30) | POST | `/api/admin/crm/incidents/{id}/notify` | Aviso a afectados (T09) |
| [API-CRM-31](#API-CRM-31) | POST | `/api/admin/crm/incidents/{id}/transitions` | Confirmar, restablecer, cerrar, descartar. |
| [API-CRM-32](#API-CRM-32) | GET | `/api/admin/crm/desk-entries` | Mesa de entradas. |
| [API-CRM-32-b](#API-CRM-32-b) | POST | `/api/admin/crm/desk-entries` | Mesa de entradas. |
| [API-CRM-32-c](#API-CRM-32-c) | POST | `/api/admin/crm/desk-entries/{id}/transfers` | Mesa de entradas. |
| [API-CRM-32-d](#API-CRM-32-d) | POST | `/api/admin/crm/desk-entries/{id}/acknowledge` | Mesa de entradas. |
| [API-CRM-32-e](#API-CRM-32-e) | POST | `/api/admin/crm/desk-entries/{id}/outgoing` | Mesa de entradas. |
| [API-CRM-33](#API-CRM-33) | GET | `/api/admin/crm/conversations` | Bandeja omnicanal. |
| [API-CRM-34](#API-CRM-34) | POST | `/api/admin/crm/conversations/{id}/messages` | Enviar mensaje (texto en ventana o plantilla) |
| [API-CRM-35](#API-CRM-35) | POST | `/api/admin/crm/conversations/{id}/assign` | Gestión de conversación. |
| [API-CRM-35-b](#API-CRM-35-b) | POST | `/api/admin/crm/conversations/{id}/transfer` | Gestión de conversación. |
| [API-CRM-35-c](#API-CRM-35-c) | POST | `/api/admin/crm/conversations/{id}/close` | Gestión de conversación. |
| [API-CRM-35-d](#API-CRM-35-d) | POST | `/api/admin/crm/conversations/{id}/link-case` | Gestión de conversación. |
| [API-CRM-38](#API-CRM-38) | GET | `/api/admin/crm/ai/suggestions` | Auditoría de IA. |
| [API-CRM-36](#API-CRM-36) | POST | `/api/admin/crm/ai/suggestions` | Pedir sugerencia (resumen, borrador, extracción) |
| [API-CRM-37](#API-CRM-37) | POST | `/api/admin/crm/ai/suggestions/{id}/decision` | Aceptar/corregir/descartar. |
| [API-CRM-39](#API-CRM-39) | GET | `/api/admin/crm/config/case-types` | Catálogos y configuración. |
| [API-CRM-39-b](#API-CRM-39-b) | POST | `/api/admin/crm/config/case-types` | Catálogos y configuración. |
| [API-CRM-39-c](#API-CRM-39-c) | GET | `/api/admin/crm/config/case-types/{id}` | Catálogos y configuración. |
| [API-CRM-39-e](#API-CRM-39-e) | DELETE | `/api/admin/crm/config/case-types/{id}` | Catálogos y configuración. |
| [API-CRM-39-d](#API-CRM-39-d) | PATCH | `/api/admin/crm/config/case-types/{id}` | Catálogos y configuración. |
| [API-CRM-39-f](#API-CRM-39-f) | GET | `/api/admin/crm/config/case-subtypes` | Catálogos y configuración. |
| [API-CRM-39-g](#API-CRM-39-g) | POST | `/api/admin/crm/config/case-subtypes` | Catálogos y configuración. |
| [API-CRM-39-h](#API-CRM-39-h) | GET | `/api/admin/crm/config/case-subtypes/{id}` | Catálogos y configuración. |
| [API-CRM-39-j](#API-CRM-39-j) | DELETE | `/api/admin/crm/config/case-subtypes/{id}` | Catálogos y configuración. |
| [API-CRM-39-i](#API-CRM-39-i) | PATCH | `/api/admin/crm/config/case-subtypes/{id}` | Catálogos y configuración. |
| [API-CRM-39-k](#API-CRM-39-k) | GET | `/api/admin/crm/config/status-sets` | Catálogos y configuración. |
| [API-CRM-39-l](#API-CRM-39-l) | POST | `/api/admin/crm/config/status-sets` | Catálogos y configuración. |
| [API-CRM-39-m](#API-CRM-39-m) | GET | `/api/admin/crm/config/status-sets/{id}` | Catálogos y configuración. |
| [API-CRM-39-o](#API-CRM-39-o) | DELETE | `/api/admin/crm/config/status-sets/{id}` | Catálogos y configuración. |
| [API-CRM-39-n](#API-CRM-39-n) | PATCH | `/api/admin/crm/config/status-sets/{id}` | Catálogos y configuración. |
| [API-CRM-39-p](#API-CRM-39-p) | GET | `/api/admin/crm/config/areas` | Catálogos y configuración. |
| [API-CRM-39-q](#API-CRM-39-q) | POST | `/api/admin/crm/config/areas` | Catálogos y configuración. |
| [API-CRM-39-r](#API-CRM-39-r) | GET | `/api/admin/crm/config/areas/{id}` | Catálogos y configuración. |
| [API-CRM-39-t](#API-CRM-39-t) | DELETE | `/api/admin/crm/config/areas/{id}` | Catálogos y configuración. |
| [API-CRM-39-s](#API-CRM-39-s) | PATCH | `/api/admin/crm/config/areas/{id}` | Catálogos y configuración. |
| [API-CRM-39-u](#API-CRM-39-u) | GET | `/api/admin/crm/config/sla-policies` | Catálogos y configuración. |
| [API-CRM-39-v](#API-CRM-39-v) | POST | `/api/admin/crm/config/sla-policies` | Catálogos y configuración. |
| [API-CRM-39-w](#API-CRM-39-w) | GET | `/api/admin/crm/config/sla-policies/{id}` | Catálogos y configuración. |
| [API-CRM-39-y](#API-CRM-39-y) | DELETE | `/api/admin/crm/config/sla-policies/{id}` | Catálogos y configuración. |
| [API-CRM-39-x](#API-CRM-39-x) | PATCH | `/api/admin/crm/config/sla-policies/{id}` | Catálogos y configuración. |
| [API-CRM-39-z](#API-CRM-39-z) | GET | `/api/admin/crm/config/routing-rules` | Catálogos y configuración. |
| [API-CRM-39-26](#API-CRM-39-26) | POST | `/api/admin/crm/config/routing-rules` | Catálogos y configuración. |
| [API-CRM-39-27](#API-CRM-39-27) | GET | `/api/admin/crm/config/routing-rules/{id}` | Catálogos y configuración. |
| [API-CRM-39-29](#API-CRM-39-29) | DELETE | `/api/admin/crm/config/routing-rules/{id}` | Catálogos y configuración. |
| [API-CRM-39-28](#API-CRM-39-28) | PATCH | `/api/admin/crm/config/routing-rules/{id}` | Catálogos y configuración. |
| [API-CRM-39-30](#API-CRM-39-30) | GET | `/api/admin/crm/config/quick-replies` | Catálogos y configuración. |
| [API-CRM-39-31](#API-CRM-39-31) | POST | `/api/admin/crm/config/quick-replies` | Catálogos y configuración. |
| [API-CRM-39-32](#API-CRM-39-32) | GET | `/api/admin/crm/config/quick-replies/{id}` | Catálogos y configuración. |
| [API-CRM-39-34](#API-CRM-39-34) | DELETE | `/api/admin/crm/config/quick-replies/{id}` | Catálogos y configuración. |
| [API-CRM-39-33](#API-CRM-39-33) | PATCH | `/api/admin/crm/config/quick-replies/{id}` | Catálogos y configuración. |
| [API-CRM-39-35](#API-CRM-39-35) | GET | `/api/admin/crm/config/channels` | Catálogos y configuración. |
| [API-CRM-39-36](#API-CRM-39-36) | POST | `/api/admin/crm/config/channels` | Catálogos y configuración. |
| [API-CRM-39-37](#API-CRM-39-37) | GET | `/api/admin/crm/config/channels/{id}` | Catálogos y configuración. |
| [API-CRM-39-39](#API-CRM-39-39) | DELETE | `/api/admin/crm/config/channels/{id}` | Catálogos y configuración. |
| [API-CRM-39-38](#API-CRM-39-38) | PATCH | `/api/admin/crm/config/channels/{id}` | Catálogos y configuración. |
| [API-CRM-39-40](#API-CRM-39-40) | GET | `/api/admin/crm/config/bot-flows` | Catálogos y configuración. |
| [API-CRM-39-41](#API-CRM-39-41) | POST | `/api/admin/crm/config/bot-flows` | Catálogos y configuración. |
| [API-CRM-39-42](#API-CRM-39-42) | GET | `/api/admin/crm/config/bot-flows/{id}` | Catálogos y configuración. |
| [API-CRM-39-44](#API-CRM-39-44) | DELETE | `/api/admin/crm/config/bot-flows/{id}` | Catálogos y configuración. |
| [API-CRM-39-43](#API-CRM-39-43) | PATCH | `/api/admin/crm/config/bot-flows/{id}` | Catálogos y configuración. |
| [API-CRM-39-45](#API-CRM-39-45) | GET | `/api/admin/crm/config/ai-settings` | Catálogos y configuración. |
| [API-CRM-39-46](#API-CRM-39-46) | POST | `/api/admin/crm/config/ai-settings` | Catálogos y configuración. |
| [API-CRM-39-47](#API-CRM-39-47) | GET | `/api/admin/crm/config/ai-settings/{id}` | Catálogos y configuración. |
| [API-CRM-39-49](#API-CRM-39-49) | DELETE | `/api/admin/crm/config/ai-settings/{id}` | Catálogos y configuración. |
| [API-CRM-39-48](#API-CRM-39-48) | PATCH | `/api/admin/crm/config/ai-settings/{id}` | Catálogos y configuración. |
| [API-CRM-39-50](#API-CRM-39-50) | GET | `/api/admin/crm/config/procedure-types` | Catálogos y configuración. |
| [API-CRM-39-51](#API-CRM-39-51) | POST | `/api/admin/crm/config/procedure-types` | Catálogos y configuración. |
| [API-CRM-39-52](#API-CRM-39-52) | GET | `/api/admin/crm/config/procedure-types/{id}` | Catálogos y configuración. |
| [API-CRM-39-54](#API-CRM-39-54) | DELETE | `/api/admin/crm/config/procedure-types/{id}` | Catálogos y configuración. |
| [API-CRM-39-53](#API-CRM-39-53) | PATCH | `/api/admin/crm/config/procedure-types/{id}` | Catálogos y configuración. |
| [API-CRM-39-55](#API-CRM-39-55) | GET | `/api/admin/crm/config/incident-classes` | Catálogos y configuración. |
| [API-CRM-39-56](#API-CRM-39-56) | POST | `/api/admin/crm/config/incident-classes` | Catálogos y configuración. |
| [API-CRM-39-57](#API-CRM-39-57) | GET | `/api/admin/crm/config/incident-classes/{id}` | Catálogos y configuración. |
| [API-CRM-39-59](#API-CRM-39-59) | DELETE | `/api/admin/crm/config/incident-classes/{id}` | Catálogos y configuración. |
| [API-CRM-39-58](#API-CRM-39-58) | PATCH | `/api/admin/crm/config/incident-classes/{id}` | Catálogos y configuración. |
| [API-CRM-40](#API-CRM-40) | POST | `/api/admin/crm/config/channels/{id}/test` | Probar conexión, sincronizar plantillas WhatsApp. |
| [API-CRM-40-b](#API-CRM-40-b) | POST | `/api/admin/crm/config/channels/{id}/sync-templates` | Probar conexión, sincronizar plantillas WhatsApp. |
| [API-CRM-41](#API-CRM-41) | POST | `/api/admin/crm/config/bot-flows/{id}/publish` | Publicar y simular bot. |
| [API-CRM-41-b](#API-CRM-41-b) | POST | `/api/admin/crm/config/bot-flows/{id}/simulate` | Publicar y simular bot. |
| [API-CRM-42](#API-CRM-42) | GET | `/api/admin/crm/procedure-records` | Trámites presentados, no presentados, vencidos. |
| [API-CRM-42-b](#API-CRM-42-b) | POST | `/api/admin/crm/procedure-records` | Trámites presentados, no presentados, vencidos. |
| [API-CRM-43](#API-CRM-43) | GET | `/api/admin/crm/projects` | Proyectos, tiempo, bolsas. |
| [API-CRM-43-b](#API-CRM-43-b) | POST | `/api/admin/crm/projects` | Proyectos, tiempo, bolsas. |
| [API-CRM-43-c](#API-CRM-43-c) | GET | `/api/admin/crm/projects/{id}` | Proyectos, tiempo, bolsas. |
| [API-CRM-43-e](#API-CRM-43-e) | DELETE | `/api/admin/crm/projects/{id}` | Proyectos, tiempo, bolsas. |
| [API-CRM-43-d](#API-CRM-43-d) | PATCH | `/api/admin/crm/projects/{id}` | Proyectos, tiempo, bolsas. |
| [API-CRM-43-f](#API-CRM-43-f) | GET | `/api/admin/crm/worklogs` | Proyectos, tiempo, bolsas. |
| [API-CRM-43-g](#API-CRM-43-g) | POST | `/api/admin/crm/worklogs` | Proyectos, tiempo, bolsas. |
| [API-CRM-43-h](#API-CRM-43-h) | GET | `/api/admin/crm/worklogs/{id}` | Proyectos, tiempo, bolsas. |
| [API-CRM-43-j](#API-CRM-43-j) | DELETE | `/api/admin/crm/worklogs/{id}` | Proyectos, tiempo, bolsas. |
| [API-CRM-43-i](#API-CRM-43-i) | PATCH | `/api/admin/crm/worklogs/{id}` | Proyectos, tiempo, bolsas. |
| [API-CRM-43-k](#API-CRM-43-k) | GET | `/api/admin/crm/hour-banks` | Proyectos, tiempo, bolsas. |
| [API-CRM-43-l](#API-CRM-43-l) | POST | `/api/admin/crm/hour-banks` | Proyectos, tiempo, bolsas. |
| [API-CRM-43-m](#API-CRM-43-m) | GET | `/api/admin/crm/hour-banks/{id}` | Proyectos, tiempo, bolsas. |
| [API-CRM-43-o](#API-CRM-43-o) | DELETE | `/api/admin/crm/hour-banks/{id}` | Proyectos, tiempo, bolsas. |
| [API-CRM-43-n](#API-CRM-43-n) | PATCH | `/api/admin/crm/hour-banks/{id}` | Proyectos, tiempo, bolsas. |
| [API-CRM-43-p](#API-CRM-43-p) | GET | `/api/admin/crm/account-assignments` | Proyectos, tiempo, bolsas. |
| [API-CRM-43-q](#API-CRM-43-q) | POST | `/api/admin/crm/account-assignments` | Proyectos, tiempo, bolsas. |
| [API-CRM-43-r](#API-CRM-43-r) | GET | `/api/admin/crm/account-assignments/{id}` | Proyectos, tiempo, bolsas. |
| [API-CRM-43-t](#API-CRM-43-t) | DELETE | `/api/admin/crm/account-assignments/{id}` | Proyectos, tiempo, bolsas. |
| [API-CRM-43-s](#API-CRM-43-s) | PATCH | `/api/admin/crm/account-assignments/{id}` | Proyectos, tiempo, bolsas. |
| [API-CRM-44](#API-CRM-44) | POST | `/api/admin/crm/worklogs/billing-requests` | Solicitar a M05 la facturación de horas. |
| [API-CRM-45](#API-CRM-45) | POST | `/api/admin/crm/queue/tickets` | Emitir turno. |
| [API-CRM-46](#API-CRM-46) | POST | `/api/admin/crm/queue/desks/{id}/open` | Abrir/cerrar box. |
| [API-CRM-46-b](#API-CRM-46-b) | POST | `/api/admin/crm/queue/desks/{id}/close` | Abrir/cerrar box. |
| [API-CRM-47](#API-CRM-47) | POST | `/api/admin/crm/queue/desks/{id}/call-next` | Llamar siguiente (atómico) |
| [API-CRM-48](#API-CRM-48) | POST | `/api/admin/crm/queue/tickets/{id}/actions` | Rellamar, ausente, atender, derivar, finalizar. |
| [API-CRM-49](#API-CRM-49) | GET | `/api/admin/crm/queue/stats` | Estadísticas del turnero. |
| [API-CRM-50](#API-CRM-50) | GET | `/api/admin/crm/queue/desk-types` | Configuración del turnero. |
| [API-CRM-50-b](#API-CRM-50-b) | POST | `/api/admin/crm/queue/desk-types` | Configuración del turnero. |
| [API-CRM-50-c](#API-CRM-50-c) | GET | `/api/admin/crm/queue/desk-types/{id}` | Configuración del turnero. |
| [API-CRM-50-e](#API-CRM-50-e) | DELETE | `/api/admin/crm/queue/desk-types/{id}` | Configuración del turnero. |
| [API-CRM-50-d](#API-CRM-50-d) | PATCH | `/api/admin/crm/queue/desk-types/{id}` | Configuración del turnero. |
| [API-CRM-50-f](#API-CRM-50-f) | GET | `/api/admin/crm/queue/desks` | Configuración del turnero. |
| [API-CRM-50-g](#API-CRM-50-g) | POST | `/api/admin/crm/queue/desks` | Configuración del turnero. |
| [API-CRM-50-h](#API-CRM-50-h) | GET | `/api/admin/crm/queue/desks/{id}` | Configuración del turnero. |
| [API-CRM-50-j](#API-CRM-50-j) | DELETE | `/api/admin/crm/queue/desks/{id}` | Configuración del turnero. |
| [API-CRM-50-i](#API-CRM-50-i) | PATCH | `/api/admin/crm/queue/desks/{id}` | Configuración del turnero. |
| [API-CRM-50-k](#API-CRM-50-k) | GET | `/api/admin/crm/queue/displays` | Configuración del turnero. |
| [API-CRM-50-l](#API-CRM-50-l) | POST | `/api/admin/crm/queue/displays` | Configuración del turnero. |
| [API-CRM-50-m](#API-CRM-50-m) | GET | `/api/admin/crm/queue/displays/{id}` | Configuración del turnero. |
| [API-CRM-50-o](#API-CRM-50-o) | DELETE | `/api/admin/crm/queue/displays/{id}` | Configuración del turnero. |
| [API-CRM-50-n](#API-CRM-50-n) | PATCH | `/api/admin/crm/queue/displays/{id}` | Configuración del turnero. |
| [API-CRM-50-p](#API-CRM-50-p) | GET | `/api/admin/crm/queue/kiosks` | Configuración del turnero. |
| [API-CRM-50-q](#API-CRM-50-q) | POST | `/api/admin/crm/queue/kiosks` | Configuración del turnero. |
| [API-CRM-50-r](#API-CRM-50-r) | GET | `/api/admin/crm/queue/kiosks/{id}` | Configuración del turnero. |
| [API-CRM-50-t](#API-CRM-50-t) | DELETE | `/api/admin/crm/queue/kiosks/{id}` | Configuración del turnero. |
| [API-CRM-50-s](#API-CRM-50-s) | PATCH | `/api/admin/crm/queue/kiosks/{id}` | Configuración del turnero. |
| [API-CRM-50-u](#API-CRM-50-u) | GET | `/api/admin/crm/queue/appointment-slots` | Configuración del turnero. |
| [API-CRM-50-v](#API-CRM-50-v) | POST | `/api/admin/crm/queue/appointment-slots` | Configuración del turnero. |
| [API-CRM-50-w](#API-CRM-50-w) | GET | `/api/admin/crm/queue/appointment-slots/{id}` | Configuración del turnero. |
| [API-CRM-50-y](#API-CRM-50-y) | DELETE | `/api/admin/crm/queue/appointment-slots/{id}` | Configuración del turnero. |
| [API-CRM-50-x](#API-CRM-50-x) | PATCH | `/api/admin/crm/queue/appointment-slots/{id}` | Configuración del turnero. |
| [API-CRM-51](#API-CRM-51) | GET | `/api/admin/crm/queue/stream` | Eventos en tiempo real de turnos. |
| [API-CRM-52](#API-CRM-52) | GET | `/api/admin/crm/activities` | Actividades y catálogos. |
| [API-CRM-52-b](#API-CRM-52-b) | POST | `/api/admin/crm/activities` | Actividades y catálogos. |
| [API-CRM-52-c](#API-CRM-52-c) | GET | `/api/admin/crm/activities/{id}` | Actividades y catálogos. |
| [API-CRM-52-e](#API-CRM-52-e) | DELETE | `/api/admin/crm/activities/{id}` | Actividades y catálogos. |
| [API-CRM-52-d](#API-CRM-52-d) | PATCH | `/api/admin/crm/activities/{id}` | Actividades y catálogos. |
| [API-CRM-52-f](#API-CRM-52-f) | GET | `/api/admin/crm/activity-types` | Actividades y catálogos. |
| [API-CRM-52-g](#API-CRM-52-g) | POST | `/api/admin/crm/activity-types` | Actividades y catálogos. |
| [API-CRM-52-h](#API-CRM-52-h) | GET | `/api/admin/crm/activity-types/{id}` | Actividades y catálogos. |
| [API-CRM-52-j](#API-CRM-52-j) | DELETE | `/api/admin/crm/activity-types/{id}` | Actividades y catálogos. |
| [API-CRM-52-i](#API-CRM-52-i) | PATCH | `/api/admin/crm/activity-types/{id}` | Actividades y catálogos. |
| [API-CRM-52-k](#API-CRM-52-k) | GET | `/api/admin/crm/activity-frequencies` | Actividades y catálogos. |
| [API-CRM-52-l](#API-CRM-52-l) | POST | `/api/admin/crm/activity-frequencies` | Actividades y catálogos. |
| [API-CRM-52-m](#API-CRM-52-m) | GET | `/api/admin/crm/activity-frequencies/{id}` | Actividades y catálogos. |
| [API-CRM-52-o](#API-CRM-52-o) | DELETE | `/api/admin/crm/activity-frequencies/{id}` | Actividades y catálogos. |
| [API-CRM-52-n](#API-CRM-52-n) | PATCH | `/api/admin/crm/activity-frequencies/{id}` | Actividades y catálogos. |
| [API-CRM-52-p](#API-CRM-52-p) | GET | `/api/admin/crm/activity-rubros` | Actividades y catálogos. |
| [API-CRM-52-q](#API-CRM-52-q) | POST | `/api/admin/crm/activity-rubros` | Actividades y catálogos. |
| [API-CRM-52-r](#API-CRM-52-r) | GET | `/api/admin/crm/activity-rubros/{id}` | Actividades y catálogos. |
| [API-CRM-52-t](#API-CRM-52-t) | DELETE | `/api/admin/crm/activity-rubros/{id}` | Actividades y catálogos. |
| [API-CRM-52-s](#API-CRM-52-s) | PATCH | `/api/admin/crm/activity-rubros/{id}` | Actividades y catálogos. |
| [API-CRM-53](#API-CRM-53) | GET | `/api/admin/crm/activity-occurrences` | Seguimiento. |
| [API-CRM-54](#API-CRM-54) | POST | `/api/admin/crm/activity-occurrences/{id}/close` | Cierre, aprobación, anulación. |
| [API-CRM-54-b](#API-CRM-54-b) | POST | `/api/admin/crm/activity-occurrences/{id}/approve` | Cierre, aprobación, anulación. |
| [API-CRM-54-c](#API-CRM-54-c) | POST | `/api/admin/crm/activity-occurrences/{id}/void` | Cierre, aprobación, anulación. |
| [API-CRM-54-d](#API-CRM-54-d) | POST | `/api/admin/crm/activity-occurrences/{id}/reopen` | Cierre, aprobación, anulación. |
| [API-CRM-55](#API-CRM-55) | GET | `/api/admin/crm/activity-occurrences/{id}/sheet.pdf` | Planilla imprimible. |
| [API-CRM-56](#API-CRM-56) | GET | `/api/admin/crm/calendar/events` | Calendario interno. |
| [API-CRM-56-b](#API-CRM-56-b) | POST | `/api/admin/crm/calendar/events` | Calendario interno. |
| [API-CRM-56-c](#API-CRM-56-c) | GET | `/api/admin/crm/calendar/events/{id}` | Calendario interno. |
| [API-CRM-56-e](#API-CRM-56-e) | DELETE | `/api/admin/crm/calendar/events/{id}` | Calendario interno. |
| [API-CRM-56-d](#API-CRM-56-d) | PATCH | `/api/admin/crm/calendar/events/{id}` | Calendario interno. |
| [API-CRM-56-f](#API-CRM-56-f) | GET | `/api/admin/crm/calendar/event-types` | Calendario interno. |
| [API-CRM-56-g](#API-CRM-56-g) | POST | `/api/admin/crm/calendar/event-types` | Calendario interno. |
| [API-CRM-56-h](#API-CRM-56-h) | GET | `/api/admin/crm/calendar/event-types/{id}` | Calendario interno. |
| [API-CRM-56-j](#API-CRM-56-j) | DELETE | `/api/admin/crm/calendar/event-types/{id}` | Calendario interno. |
| [API-CRM-56-i](#API-CRM-56-i) | PATCH | `/api/admin/crm/calendar/event-types/{id}` | Calendario interno. |
| [API-CRM-57](#API-CRM-57) | GET | `/api/admin/crm/circulars` | Modelos de circular. |
| [API-CRM-57-b](#API-CRM-57-b) | POST | `/api/admin/crm/circulars` | Modelos de circular. |
| [API-CRM-57-c](#API-CRM-57-c) | GET | `/api/admin/crm/circulars/{id}` | Modelos de circular. |
| [API-CRM-57-e](#API-CRM-57-e) | DELETE | `/api/admin/crm/circulars/{id}` | Modelos de circular. |
| [API-CRM-57-d](#API-CRM-57-d) | PATCH | `/api/admin/crm/circulars/{id}` | Modelos de circular. |
| [API-CRM-58](#API-CRM-58) | POST | `/api/admin/crm/circulars/{id}/runs` | Corridas de circulares. |
| [API-CRM-58-b](#API-CRM-58-b) | POST | `/api/admin/crm/circulars/{id}/runs/{runId}/approve` | Corridas de circulares. |
| [API-CRM-58-c](#API-CRM-58-c) | POST | `/api/admin/crm/circulars/{id}/runs/{runId}/generate` | Corridas de circulares. |
| [API-CRM-58-d](#API-CRM-58-d) | POST | `/api/admin/crm/circulars/{id}/runs/{runId}/cancel` | Corridas de circulares. |
| [API-CRM-59](#API-CRM-59) | GET | `/api/admin/crm/reports/{reportCode}` | Reportes del §15 (con export) |
| [API-CRM-60](#API-CRM-60) | GET | `/api/admin/crm/dashboard` | Tablero operativo. |

<a id="API-CRM-01"></a>
#### API-CRM-01 · `GET /api/admin/crm/cases`

- **Qué hace:** Listar casos con filtros de bandeja y vistas. Lista, con filtros y paginación, los registros de expediente único de gestión (`crmCases`).
- **Para qué sirve:** RF-CRM-008: Bandeja de supervisión por tenant con filtros por servicio, tipo, subtipo, estado, área, prioridad, antigüedad, responsable, canal, SLA y vistas de "sin clasificar" y "sin derivación". *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.casos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de expediente único de gestión (`crmCases`) con `total`.
- **Pantallas:** PAN-CRM-02 (Bandeja de mi área y mis casos), PAN-CRM-03 (Expediente del caso), PAN-CRM-05 (Vista 360 del socio) y 3 más.
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1844 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-01)

<a id="API-CRM-02"></a>
#### API-CRM-02 · `POST /api/admin/crm/cases`

- **Qué hace:** Crear caso (agente, carga rápida) Da de alta un registro de expediente único de gestión (`crmCases`).
- **Para qué sirve:** RF-CRM-116: Carga rápida de reclamos desde la ficha del titular (cuenta, servicio, descripción en una sola pantalla). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.casos.crear`.
- **Recibe:** los datos de expediente único de gestión (`crmCases`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de expediente único de gestión (`crmCases`).
- **Pantallas:** PAN-CRM-04 (Alta y carga rápida de reclamo), PAN-TEC-49 (Carga rápida de reclamo).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1845 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-02)

<a id="API-CRM-03"></a>
#### API-CRM-03 · `GET /api/admin/crm/cases/{id}`

- **Qué hace:** Detalle con contexto. Obtiene el detalle de un registro de expediente único de gestión (`crmCases`).
- **Para qué sirve:** RF-CRM-001: Crear casos con número de seguimiento único por tenant, visible al socio y al personal. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.casos.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de expediente único de gestión (`crmCases`).
- **Pantallas:** PAN-CRM-02 (Bandeja de mi área y mis casos), PAN-CRM-03 (Expediente del caso), PAN-CRM-05 (Vista 360 del socio) y 3 más.
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1846 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-03)

<a id="API-CRM-04"></a>
#### API-CRM-04 · `PATCH /api/admin/crm/cases/{id}`

- **Qué hace:** Editar campos no estructurales (asunto, etiquetas, campos adicionales, contactos) Modifica algunos campos de un registro de expediente único de gestión (`crmCases`) (solo los enviados).
- **Para qué sirve:** RF-CRM-051: Campos adicionales por tipo de gestión (descripción ampliada, ruta de acceso, datos técnicos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.casos.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de expediente único de gestión (`crmCases`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de expediente único de gestión (`crmCases`).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1847 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-04)

<a id="API-CRM-05"></a>
#### API-CRM-05 · `POST /api/admin/crm/cases/{id}/transitions`

- **Qué hace:** Ejecutar transición ({ to, reason, data }) Cambia de estado (transición) un registro de expediente único de gestión (`crmCases`).
- **Para qué sirve:** RF-CRM-001: Crear casos con número de seguimiento único por tenant, visible al socio y al personal. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.casos.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1848 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-05)

<a id="API-CRM-06"></a>
#### API-CRM-06 · `POST /api/admin/crm/cases/{id}/derive`

- **Qué hace:** Derivar a área. Deriva un registro de expediente único de gestión (`crmCases`).
- **Para qué sirve:** RF-CRM-009: Derivar el caso a un área con motivo; al cambiar de área se conserva el mismo expediente e historial. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.casos.derivar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1849 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-06)

<a id="API-CRM-07"></a>
#### API-CRM-07 · `POST /api/admin/crm/cases/{id}/assign`

- **Qué hace:** Asignar/reasignar. Asigna un registro de expediente único de gestión (`crmCases`).
- **Para qué sirve:** RF-CRM-010: Asignar y reasignar responsable dentro del área, con historial de asignaciones y aviso al asignado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.casos.asignar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1850 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-07)

<a id="API-CRM-08"></a>
#### API-CRM-08 · `POST /api/admin/crm/cases/{id}/take`

- **Qué hace:** Tomar, pausar, soltar, retomar. Toma un registro de expediente único de gestión (`crmCases`).
- **Para qué sirve:** RF-CRM-028: Tomar, pausar, soltar y retomar un caso; un usuario solo puede tener un caso tomado; pausa automática durante una llamada con nota interna. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.casos.tomar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1851 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-08)

<a id="API-CRM-08-b"></a>
#### API-CRM-08-b · `POST /api/admin/crm/cases/{id}/pause`

- **Qué hace:** Tomar, pausar, soltar, retomar. Pausa un registro de expediente único de gestión (`crmCases`).
- **Para qué sirve:** RF-CRM-028: Tomar, pausar, soltar y retomar un caso; un usuario solo puede tener un caso tomado; pausa automática durante una llamada con nota interna. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.casos.tomar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1851 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-08-b)

<a id="API-CRM-08-c"></a>
#### API-CRM-08-c · `POST /api/admin/crm/cases/{id}/release`

- **Qué hace:** Tomar, pausar, soltar, retomar. Libera un registro de expediente único de gestión (`crmCases`).
- **Para qué sirve:** RF-CRM-028: Tomar, pausar, soltar y retomar un caso; un usuario solo puede tener un caso tomado; pausa automática durante una llamada con nota interna. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.casos.tomar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1851 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-08-c)

<a id="API-CRM-08-d"></a>
#### API-CRM-08-d · `POST /api/admin/crm/cases/{id}/resume`

- **Qué hace:** Tomar, pausar, soltar, retomar. Reanuda un registro de expediente único de gestión (`crmCases`).
- **Para qué sirve:** RF-CRM-028: Tomar, pausar, soltar y retomar un caso; un usuario solo puede tener un caso tomado; pausa automática durante una llamada con nota interna. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.casos.tomar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1851 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-08-d)

<a id="API-CRM-09"></a>
#### API-CRM-09 · `POST /api/admin/crm/cases/{id}/classify`

- **Qué hace:** Clasificar/reclasificar (acepta o corrige sugerencia IA) Clasifica un registro de expediente único de gestión (`crmCases`).
- **Para qué sirve:** RF-CRM-013: Mantener historial completo e inmutable de atención: estados, derivaciones, asignaciones, cambios de clasificación, mensajes, comandos, SLA, sugerencias de IA. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.casos.reclasificar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1852 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-09)

<a id="API-CRM-10"></a>
#### API-CRM-10 · `POST /api/admin/crm/cases/{id}/messages`

- **Qué hace:** Mensaje visible o nota interna (con adjuntos) Da de alta un registro de mensajes y notas (`crmMessages`).
- **Para qué sirve:** RF-CRM-007: Conservar la conversación del caso distinguiendo mensajes visibles al socio y notas internas. · RF-CRM-037: Endpoints de autogestión del socio: listar sus casos, ver detalle, mensajes visibles, responder, adjuntar, cancelar, ver constancias (consumidos por M19). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.casos.responder`.
- **Recibe:** en la ruta `id`; los datos de mensajes y notas (`crmMessages`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de mensajes y notas (`crmMessages`).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1853 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-10)

<a id="API-CRM-11"></a>
#### API-CRM-11 · `GET /api/admin/crm/cases/{id}/timeline`

- **Qué hace:** Timeline (eventos + mensajes + comunicaciones) Consulta «timeline» de un registro de expediente único de gestión (`crmCases`).
- **Para qué sirve:** RF-CRM-001: Crear casos con número de seguimiento único por tenant, visible al socio y al personal. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.casos.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de expediente único de gestión (`crmCases`).
- **Pantallas:** PAN-CRM-02 (Bandeja de mi área y mis casos), PAN-CRM-03 (Expediente del caso), PAN-CRM-05 (Vista 360 del socio) y 3 más.
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1854 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-11)

<a id="API-CRM-12"></a>
#### API-CRM-12 · `POST /api/admin/crm/cases/{id}/requirements`

- **Qué hace:** Pedir/actualizar requisitos. Registra «requirements» sobre un registro de expediente único de gestión (`crmCases`).
- **Para qué sirve:** RF-CRM-063: Requisitos por prestación y tipo de solicitud: datos obligatorios, documentación, factibilidad, aceptación de condiciones, firma. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.casos.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1855 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-12)

<a id="API-CRM-13"></a>
#### API-CRM-13 · `POST /api/admin/crm/cases/{id}/commands`

- **Qué hace:** Solicitar comando a módulo dueño. Registra «commands» sobre un registro de expediente único de gestión (`crmCases`).
- **Para qué sirve:** RF-CRM-065: Solicitar no equivale a ejecutar: cada efecto se pide por comando tipado al módulo dueño y el caso refleja su resultado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.comandos.solicitar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1856 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-13)

<a id="API-CRM-14"></a>
#### API-CRM-14 · `GET /api/admin/crm/command-requests`

- **Qué hace:** Seguimiento de comandos (filtros estado/módulo) Lista, con filtros y paginación, los registros de comandos a módulos dueños (`crmCommandRequests`).
- **Para qué sirve:** RF-CRM-078: Seguimiento de comandos solicitados con estados y resultado; reintento idempotente; alerta si fallan. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.casos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de comandos a módulos dueños (`crmCommandRequests`) con `total`.
- **Pantallas:** PAN-CRM-02 (Bandeja de mi área y mis casos), PAN-CRM-03 (Expediente del caso), PAN-CRM-05 (Vista 360 del socio) y 3 más.
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1857 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-14)

<a id="API-CRM-15"></a>
#### API-CRM-15 · `POST /api/admin/crm/command-requests/{id}/retry`

- **Qué hace:** Reintentar comando fallido. Reintenta un registro de comandos a módulos dueños (`crmCommandRequests`).
- **Para qué sirve:** RF-CRM-078: Seguimiento de comandos solicitados con estados y resultado; reintento idempotente; alerta si fallan. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.comandos.solicitar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1858 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-15)

<a id="API-CRM-16"></a>
#### API-CRM-16 · `POST /api/admin/crm/cases/{id}/links`

- **Qué hace:** Vincular/desvincular entidades. Agrega un elemento («links») a un registro de expediente único de gestión (`crmCases`).
- **Para qué sirve:** RF-CRM-001: Crear casos con número de seguimiento único por tenant, visible al socio y al personal. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.casos.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1859 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-16)

<a id="API-CRM-16-b"></a>
#### API-CRM-16-b · `DELETE /api/admin/crm/cases/{id}/links/{linkId}`

- **Qué hace:** Vincular/desvincular entidades. Elimina o da de baja un registro de expediente único de gestión (`crmCases`).
- **Para qué sirve:** RF-CRM-001: Crear casos con número de seguimiento único por tenant, visible al socio y al personal. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.casos.editar`.
- **Recibe:** en la ruta `id`, `linkId`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1859 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-16-b)

<a id="API-CRM-17"></a>
#### API-CRM-17 · `POST /api/admin/crm/cases/{id}/merge`

- **Qué hace:** Fusionar en caso principal. Fusiona un registro de expediente único de gestión (`crmCases`).
- **Para qué sirve:** RF-CRM-020: Detectar y asociar casos duplicados; fusionar conservando ambos historiales. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.casos.fusionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1860 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-17)

<a id="API-CRM-18"></a>
#### API-CRM-18 · `POST /api/admin/crm/cases/{id}/resolve`

- **Qué hace:** Resolver. Resuelve un registro de expediente único de gestión (`crmCases`).
- **Para qué sirve:** RF-CRM-034: Cancelar/desistir con motivo, registrando fecha y usuario; avisar al creador si cancela otro; resolver el presupuesto vinculado (rechazado o anulado) vía M11. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.casos.resolver`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1861 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-18)

<a id="API-CRM-19"></a>
#### API-CRM-19 · `POST /api/admin/crm/cases/{id}/close`

- **Qué hace:** Cerrar con tipo/causa/validaciones. Cierra un registro de expediente único de gestión (`crmCases`).
- **Para qué sirve:** RF-CRM-031: Cierre con tipo de cierre (Conforme, Conforme con observaciones, Sin solución, Improcedente), causa obligatoria si el subtipo la exige, bloqueo de cierre por subtipo, nota de cierre, validación interna y validación del socio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.casos.cerrar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1862 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-19)

<a id="API-CRM-20"></a>
#### API-CRM-20 · `POST /api/admin/crm/cases/{id}/reopen`

- **Qué hace:** Reabrir/recuperar. Reabre un registro de expediente único de gestión (`crmCases`).
- **Para qué sirve:** RF-CRM-021: Reabrir casos resueltos o cerrados con motivo, dentro de la ventana configurada. · RF-CRM-032: Recuperar casos cerrados o cancelados dejando nota; desde cancelado vuelve al último estado previo no final. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.casos.reabrir`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1863 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-20)

<a id="API-CRM-20-b"></a>
#### API-CRM-20-b · `POST /api/admin/crm/cases/{id}/recover`

- **Qué hace:** Reabrir/recuperar. Recupera un registro de expediente único de gestión (`crmCases`).
- **Para qué sirve:** RF-CRM-021: Reabrir casos resueltos o cerrados con motivo, dentro de la ventana configurada. · RF-CRM-032: Recuperar casos cerrados o cancelados dejando nota; desde cancelado vuelve al último estado previo no final. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.casos.reabrir`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1863 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-20-b)

<a id="API-CRM-21"></a>
#### API-CRM-21 · `POST /api/admin/crm/cases/{id}/cancel`

- **Qué hace:** Cancelar con motivo. Cancela un registro de expediente único de gestión (`crmCases`).
- **Para qué sirve:** RF-CRM-009: Derivar el caso a un área con motivo; al cambiar de área se conserva el mismo expediente e historial. · RF-CRM-034: Cancelar/desistir con motivo, registrando fecha y usuario; avisar al creador si cancela otro; resolver el presupuesto vinculado (rechazado o anulado) vía M11. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.casos.anular`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1864 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-21)

<a id="API-CRM-22"></a>
#### API-CRM-22 · `POST /api/admin/crm/cases/bulk`

- **Qué hace:** Acciones masivas. Procesa en forma masiva sobre expediente único de gestión (`crmCases`).
- **Para qué sirve:** RF-CRM-046: Acciones masivas sobre selección: derivar, asignar, cambiar prioridad, vincular a incidente, cerrar en lote con el mismo texto de solución. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.casos.derivar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1865 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-22)

<a id="API-CRM-23"></a>
#### API-CRM-23 · `GET /api/admin/crm/cases/export`

- **Qué hace:** Exportar XLSX/CSV/PDF. Descarga un archivo de expediente único de gestión (`crmCases`).
- **Para qué sirve:** RF-CRM-045: Exportar bandejas a XLSX/CSV/PDF según capability. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.casos.exportar`.
- **Recibe:** nada.
- **Devuelve:** 200: un archivo (application/octet-stream).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1866 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-23)

<a id="API-CRM-24"></a>
#### API-CRM-24 · `GET /api/admin/crm/cases/{id}/duplicates`

- **Qué hace:** Candidatos a duplicado. Consulta «duplicates» de un registro de expediente único de gestión (`crmCases`).
- **Para qué sirve:** RF-CRM-026: Unificar contactos duplicados conservando el más antiguo, reapuntando casos y auditando. · RF-CRM-020: Detectar y asociar casos duplicados; fusionar conservando ambos historiales. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.casos.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de expediente único de gestión (`crmCases`).
- **Pantallas:** PAN-CRM-02 (Bandeja de mi área y mis casos), PAN-CRM-03 (Expediente del caso), PAN-CRM-05 (Vista 360 del socio) y 3 más.
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1867 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-24)

<a id="API-CRM-25"></a>
#### API-CRM-25 · `GET /api/admin/crm/persons/{personId}/timeline`

- **Qué hace:** Historial unificado 360. Lista, con filtros y paginación, los registros de `timeline`.
- **Para qué sirve:** RF-CRM-035: Vista 360 del socio con historial unificado de interacciones, casos, turnos, comunicaciones y encuestas, ligada a persona, cuenta y servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.casos.ver`.
- **Recibe:** en la ruta `personId`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ResultadoGenerico (`ResultadoGenerico`) con `total`.
- **Pantallas:** PAN-CRM-02 (Bandeja de mi área y mis casos), PAN-CRM-03 (Expediente del caso), PAN-CRM-05 (Vista 360 del socio) y 3 más.
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1868 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-25)

<a id="API-CRM-26"></a>
#### API-CRM-26 · `POST /api/admin/crm/interactions`

- **Qué hace:** Registrar interacción (llamada, visita) Da de alta un registro de historial unificado de interacciones (`crmInteractions`).
- **Para qué sirve:** RF-CRM-186: Historial unificado de interacciones (llamada, WhatsApp, email, ventanilla, portal, SMS, bot, mesa de entradas) ligado a persona, cuenta y servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.interacciones.crear`.
- **Recibe:** los datos de historial unificado de interacciones (`crmInteractions`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de historial unificado de interacciones (`crmInteractions`).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1869 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-26)

<a id="API-CRM-27"></a>
#### API-CRM-27 · `GET /api/admin/crm/search`

- **Qué hace:** Búsqueda global. Lista, con filtros y paginación, los registros de `search`.
- **Para qué sirve:** RF-CRM-036: Búsqueda global por número de caso, persona, documento, cuenta, teléfono, email, número de expediente de mesa de entradas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.casos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ResultadoGenerico (`ResultadoGenerico`) con `total`.
- **Pantallas:** PAN-CRM-02 (Bandeja de mi área y mis casos), PAN-CRM-03 (Expediente del caso), PAN-CRM-05 (Vista 360 del socio) y 3 más.
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1870 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-27)

<a id="API-CRM-28"></a>
#### API-CRM-28 · `GET /api/admin/crm/incidents`

- **Qué hace:** ABM de incidentes. Lista, con filtros y paginación, los registros de incidentes comunes por zona (`crmIncidents`).
- **Para qué sirve:** RF-CRM-205: Detección sugerida de duplicados e incidentes comunes por similitud semántica y ubicación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.incidentes.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de incidentes comunes por zona (`crmIncidents`) con `total`.
- **Pantallas:** PAN-CRM-07 (Listado y mapa de incidentes), PAN-CRM-08 (Detalle de incidente).
- **Ola:** O3 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1871 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-28)

<a id="API-CRM-28-b"></a>
#### API-CRM-28-b · `POST /api/admin/crm/incidents`

- **Qué hace:** ABM de incidentes. Da de alta un registro de incidentes comunes por zona (`crmIncidents`).
- **Para qué sirve:** RF-CRM-205: Detección sugerida de duplicados e incidentes comunes por similitud semántica y ubicación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.incidentes.crear`.
- **Recibe:** los datos de incidentes comunes por zona (`crmIncidents`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de incidentes comunes por zona (`crmIncidents`).
- **Ola:** O3 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1871 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-28-b)

<a id="API-CRM-28-c"></a>
#### API-CRM-28-c · `GET /api/admin/crm/incidents/{id}`

- **Qué hace:** ABM de incidentes. Obtiene el detalle de un registro de incidentes comunes por zona (`crmIncidents`).
- **Para qué sirve:** RF-CRM-205: Detección sugerida de duplicados e incidentes comunes por similitud semántica y ubicación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.incidentes.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de incidentes comunes por zona (`crmIncidents`).
- **Pantallas:** PAN-CRM-07 (Listado y mapa de incidentes), PAN-CRM-08 (Detalle de incidente).
- **Ola:** O3 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1871 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-28-c)

<a id="API-CRM-28-d"></a>
#### API-CRM-28-d · `PATCH /api/admin/crm/incidents/{id}`

- **Qué hace:** ABM de incidentes. Modifica algunos campos de un registro de incidentes comunes por zona (`crmIncidents`) (solo los enviados).
- **Para qué sirve:** RF-CRM-205: Detección sugerida de duplicados e incidentes comunes por similitud semántica y ubicación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.incidentes.crear`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de incidentes comunes por zona (`crmIncidents`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de incidentes comunes por zona (`crmIncidents`).
- **Ola:** O3 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1871 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-28-d)

<a id="API-CRM-29"></a>
#### API-CRM-29 · `POST /api/admin/crm/incidents/{id}/cases`

- **Qué hace:** Vincular casos al incidente. Agrega un elemento («cases») a un registro de incidentes comunes por zona (`crmIncidents`).
- **Para qué sirve:** RF-CRM-121: Exponer a M10 el resumen de incidentes/casos vinculados para la impresión de la OT. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.incidentes.vincular`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1872 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-29)

<a id="API-CRM-30"></a>
#### API-CRM-30 · `POST /api/admin/crm/incidents/{id}/notify`

- **Qué hace:** Aviso a afectados (T09) Notifica un registro de incidentes comunes por zona (`crmIncidents`).
- **Para qué sirve:** RF-CRM-109: Comunicación a afectados (aviso de falla, avance, restablecimiento) vía T09 con audiencia del incidente, y aviso al socio que reclama de que su caso está ligado al incidente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.incidentes.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1873 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-30)

<a id="API-CRM-31"></a>
#### API-CRM-31 · `POST /api/admin/crm/incidents/{id}/transitions`

- **Qué hace:** Confirmar, restablecer, cerrar, descartar. Cambia de estado (transición) un registro de incidentes comunes por zona (`crmIncidents`).
- **Para qué sirve:** RF-CRM-110: Cerrar un incidente no cierra automáticamente los casos: cada caso confirma la resolución o permanece abierto/reabre si el domicilio sigue afectado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.incidentes.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1874 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-31)

<a id="API-CRM-32"></a>
#### API-CRM-32 · `GET /api/admin/crm/desk-entries`

- **Qué hace:** Mesa de entradas. Consulta `desk-entries`.
- **Para qué sirve:** RF-CRM-136: Libro de mesa de entradas e informes (entradas por período, pendientes, vencidas). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.mesaEntradas.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CRM-09 (Libro de mesa de entradas).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1875 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-32)

<a id="API-CRM-32-b"></a>
#### API-CRM-32-b · `POST /api/admin/crm/desk-entries`

- **Qué hace:** Mesa de entradas. Registra un nuevo elemento u operación en `desk-entries`.
- **Para qué sirve:** RF-CRM-136: Libro de mesa de entradas e informes (entradas por período, pendientes, vencidas). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.mesaEntradas.crear`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1875 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-32-b)

<a id="API-CRM-32-c"></a>
#### API-CRM-32-c · `POST /api/admin/crm/desk-entries/{id}/transfers`

- **Qué hace:** Mesa de entradas. Registra «transfers» sobre un registro de `transfers`.
- **Para qué sirve:** RF-CRM-136: Libro de mesa de entradas e informes (entradas por período, pendientes, vencidas). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.mesaEntradas.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1875 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-32-c)

<a id="API-CRM-32-d"></a>
#### API-CRM-32-d · `POST /api/admin/crm/desk-entries/{id}/acknowledge`

- **Qué hace:** Mesa de entradas. Toma conocimiento de un registro de `acknowledge`.
- **Para qué sirve:** RF-CRM-136: Libro de mesa de entradas e informes (entradas por período, pendientes, vencidas). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.mesaEntradas.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1875 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-32-d)

<a id="API-CRM-32-e"></a>
#### API-CRM-32-e · `POST /api/admin/crm/desk-entries/{id}/outgoing`

- **Qué hace:** Mesa de entradas. Registra «outgoing» sobre un registro de `outgoing`.
- **Para qué sirve:** RF-CRM-136: Libro de mesa de entradas e informes (entradas por período, pendientes, vencidas). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.mesaEntradas.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1875 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-32-e)

<a id="API-CRM-33"></a>
#### API-CRM-33 · `GET /api/admin/crm/conversations`

- **Qué hace:** Bandeja omnicanal. Lista, con filtros y paginación, los registros de hilos por canal (`crmConversations`).
- **Para qué sirve:** RF-CRM-171: Bandeja omnicanal de conversaciones con asignación a agentes, estado, tiempo de espera y vínculo a caso. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.conversaciones.atender`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de hilos por canal (`crmConversations`) con `total`.
- **Pantallas:** PAN-CRM-10 (Bandeja omnicanal y consola de agente).
- **Ola:** O6 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1876 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-33)

<a id="API-CRM-34"></a>
#### API-CRM-34 · `POST /api/admin/crm/conversations/{id}/messages`

- **Qué hace:** Enviar mensaje (texto en ventana o plantilla) Da de alta un registro de mensajes y notas (`crmMessages`).
- **Para qué sirve:** RF-CRM-007: Conservar la conversación del caso distinguiendo mensajes visibles al socio y notas internas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.conversaciones.atender`.
- **Recibe:** en la ruta `id`; los datos de mensajes y notas (`crmMessages`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de mensajes y notas (`crmMessages`).
- **Pantallas:** PAN-CRM-10 (Bandeja omnicanal y consola de agente).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1877 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-34)

<a id="API-CRM-35"></a>
#### API-CRM-35 · `POST /api/admin/crm/conversations/{id}/assign`

- **Qué hace:** Gestión de conversación. Asigna un registro de hilos por canal (`crmConversations`).
- **Para qué sirve:** RF-CRM-201: Resumen del caso, de la conversación y de las notas (incluidas imágenes adjuntas). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.conversaciones.atender`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CRM-10 (Bandeja omnicanal y consola de agente).
- **Ola:** O6 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1878 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-35)

<a id="API-CRM-35-b"></a>
#### API-CRM-35-b · `POST /api/admin/crm/conversations/{id}/transfer`

- **Qué hace:** Gestión de conversación. Transfiere un registro de hilos por canal (`crmConversations`).
- **Para qué sirve:** RF-CRM-201: Resumen del caso, de la conversación y de las notas (incluidas imágenes adjuntas). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.conversaciones.atender`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CRM-10 (Bandeja omnicanal y consola de agente).
- **Ola:** O6 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1878 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-35-b)

<a id="API-CRM-35-c"></a>
#### API-CRM-35-c · `POST /api/admin/crm/conversations/{id}/close`

- **Qué hace:** Gestión de conversación. Cierra un registro de hilos por canal (`crmConversations`).
- **Para qué sirve:** RF-CRM-201: Resumen del caso, de la conversación y de las notas (incluidas imágenes adjuntas). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.conversaciones.atender`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CRM-10 (Bandeja omnicanal y consola de agente).
- **Ola:** O6 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1878 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-35-c)

<a id="API-CRM-35-d"></a>
#### API-CRM-35-d · `POST /api/admin/crm/conversations/{id}/link-case`

- **Qué hace:** Gestión de conversación. Vincula un caso a un registro de hilos por canal (`crmConversations`).
- **Para qué sirve:** RF-CRM-201: Resumen del caso, de la conversación y de las notas (incluidas imágenes adjuntas). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.conversaciones.atender`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CRM-10 (Bandeja omnicanal y consola de agente).
- **Ola:** O6 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1878 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-35-d)

<a id="API-CRM-38"></a>
#### API-CRM-38 · `GET /api/admin/crm/ai/suggestions`

- **Qué hace:** Auditoría de IA. Lista, con filtros y paginación, los registros de sugerencias de IA supervisada (`crmAiSuggestions`).
- **Para qué sirve:** RF-CRM-026: Unificar contactos duplicados conservando el más antiguo, reapuntando casos y auditando. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.ia.auditar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de sugerencias de IA supervisada (`crmAiSuggestions`) con `total`.
- **Pantallas:** PAN-CRM-19 (Auditoría de IA).
- **Ola:** O6 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1881 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-38)

<a id="API-CRM-36"></a>
#### API-CRM-36 · `POST /api/admin/crm/ai/suggestions`

- **Qué hace:** Pedir sugerencia (resumen, borrador, extracción) Da de alta un registro de sugerencias de IA supervisada (`crmAiSuggestions`).
- **Para qué sirve:** RF-CRM-202: Sugerencia de respuesta (borrador) editable por el agente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.ia.usar`.
- **Recibe:** los datos de sugerencias de IA supervisada (`crmAiSuggestions`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de sugerencias de IA supervisada (`crmAiSuggestions`).
- **Ola:** O6 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1879 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-36)

<a id="API-CRM-37"></a>
#### API-CRM-37 · `POST /api/admin/crm/ai/suggestions/{id}/decision`

- **Qué hace:** Aceptar/corregir/descartar. Registra la decisión sobre un registro de sugerencias de IA supervisada (`crmAiSuggestions`).
- **Para qué sirve:** RF-CRM-206: Registro de cada sugerencia: función, fuentes, tenant, versión de modelo y de instrucciones, salida, confianza, decisión humana (aceptada, corregida, descartada) y texto original conservado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.ia.usar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O6 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1880 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-37)

<a id="API-CRM-39"></a>
#### API-CRM-39 · `GET /api/admin/crm/config/case-types`

- **Qué hace:** Catálogos y configuración. Lista, con filtros y paginación, los registros de tipos de gestión (`crmCaseTypes`).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tipos.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de tipos de gestión (`crmCaseTypes`) con `total`.
- **Pantallas:** PAN-CRM-11 (Tipos y subtipos de gestión).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39)

<a id="API-CRM-39-b"></a>
#### API-CRM-39-b · `POST /api/admin/crm/config/case-types`

- **Qué hace:** Catálogos y configuración. Da de alta un registro de tipos de gestión (`crmCaseTypes`).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tipos.configurar`.
- **Recibe:** los datos de tipos de gestión (`crmCaseTypes`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de tipos de gestión (`crmCaseTypes`).
- **Pantallas:** PAN-CRM-11 (Tipos y subtipos de gestión).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-b)

<a id="API-CRM-39-c"></a>
#### API-CRM-39-c · `GET /api/admin/crm/config/case-types/{id}`

- **Qué hace:** Catálogos y configuración. Obtiene el detalle de un registro de tipos de gestión (`crmCaseTypes`).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tipos.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de tipos de gestión (`crmCaseTypes`).
- **Pantallas:** PAN-CRM-11 (Tipos y subtipos de gestión).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-c)

<a id="API-CRM-39-e"></a>
#### API-CRM-39-e · `DELETE /api/admin/crm/config/case-types/{id}`

- **Qué hace:** Catálogos y configuración. Elimina o da de baja un registro de tipos de gestión (`crmCaseTypes`).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tramites.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-e)

<a id="API-CRM-39-d"></a>
#### API-CRM-39-d · `PATCH /api/admin/crm/config/case-types/{id}`

- **Qué hace:** Catálogos y configuración. Modifica algunos campos de un registro de tipos de gestión (`crmCaseTypes`) (solo los enviados).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tipos.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de tipos de gestión (`crmCaseTypes`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de tipos de gestión (`crmCaseTypes`).
- **Pantallas:** PAN-CRM-11 (Tipos y subtipos de gestión).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-d)

<a id="API-CRM-39-f"></a>
#### API-CRM-39-f · `GET /api/admin/crm/config/case-subtypes`

- **Qué hace:** Catálogos y configuración. Lista, con filtros y paginación, los registros de subtipos y motivos (`crmCaseSubtypes`).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tipos.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de subtipos y motivos (`crmCaseSubtypes`) con `total`.
- **Pantallas:** PAN-CRM-11 (Tipos y subtipos de gestión).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-f)

<a id="API-CRM-39-g"></a>
#### API-CRM-39-g · `POST /api/admin/crm/config/case-subtypes`

- **Qué hace:** Catálogos y configuración. Da de alta un registro de subtipos y motivos (`crmCaseSubtypes`).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tipos.configurar`.
- **Recibe:** los datos de subtipos y motivos (`crmCaseSubtypes`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de subtipos y motivos (`crmCaseSubtypes`).
- **Pantallas:** PAN-CRM-11 (Tipos y subtipos de gestión).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-g)

<a id="API-CRM-39-h"></a>
#### API-CRM-39-h · `GET /api/admin/crm/config/case-subtypes/{id}`

- **Qué hace:** Catálogos y configuración. Obtiene el detalle de un registro de subtipos y motivos (`crmCaseSubtypes`).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tipos.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de subtipos y motivos (`crmCaseSubtypes`).
- **Pantallas:** PAN-CRM-11 (Tipos y subtipos de gestión).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-h)

<a id="API-CRM-39-j"></a>
#### API-CRM-39-j · `DELETE /api/admin/crm/config/case-subtypes/{id}`

- **Qué hace:** Catálogos y configuración. Elimina o da de baja un registro de subtipos y motivos (`crmCaseSubtypes`).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tramites.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-j)

<a id="API-CRM-39-i"></a>
#### API-CRM-39-i · `PATCH /api/admin/crm/config/case-subtypes/{id}`

- **Qué hace:** Catálogos y configuración. Modifica algunos campos de un registro de subtipos y motivos (`crmCaseSubtypes`) (solo los enviados).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tipos.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de subtipos y motivos (`crmCaseSubtypes`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de subtipos y motivos (`crmCaseSubtypes`).
- **Pantallas:** PAN-CRM-11 (Tipos y subtipos de gestión).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-i)

<a id="API-CRM-39-k"></a>
#### API-CRM-39-k · `GET /api/admin/crm/config/status-sets`

- **Qué hace:** Catálogos y configuración. Lista, con filtros y paginación, los registros de conjuntos de estados visibles (`crmStatusSets`).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. · RF-CRM-043: Estados visibles configurables por conjunto de estados, ordenados y mapeados a estado base, con banderas: reasignar, permite volver, espera del socio, requiere aprobación, verificación, notificar al socio, notificar al equipo… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tipos.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de conjuntos de estados visibles (`crmStatusSets`) con `total`.
- **Pantallas:** PAN-CRM-11 (Tipos y subtipos de gestión).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-k)

<a id="API-CRM-39-l"></a>
#### API-CRM-39-l · `POST /api/admin/crm/config/status-sets`

- **Qué hace:** Catálogos y configuración. Da de alta un registro de conjuntos de estados visibles (`crmStatusSets`).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. · RF-CRM-043: Estados visibles configurables por conjunto de estados, ordenados y mapeados a estado base, con banderas: reasignar, permite volver, espera del socio, requiere aprobación, verificación, notificar al socio, notificar al equipo… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tipos.configurar`.
- **Recibe:** los datos de conjuntos de estados visibles (`crmStatusSets`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de conjuntos de estados visibles (`crmStatusSets`).
- **Pantallas:** PAN-CRM-11 (Tipos y subtipos de gestión).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-l)

<a id="API-CRM-39-m"></a>
#### API-CRM-39-m · `GET /api/admin/crm/config/status-sets/{id}`

- **Qué hace:** Catálogos y configuración. Obtiene el detalle de un registro de conjuntos de estados visibles (`crmStatusSets`).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. · RF-CRM-043: Estados visibles configurables por conjunto de estados, ordenados y mapeados a estado base, con banderas: reasignar, permite volver, espera del socio, requiere aprobación, verificación, notificar al socio, notificar al equipo… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tipos.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de conjuntos de estados visibles (`crmStatusSets`).
- **Pantallas:** PAN-CRM-11 (Tipos y subtipos de gestión).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-m)

<a id="API-CRM-39-o"></a>
#### API-CRM-39-o · `DELETE /api/admin/crm/config/status-sets/{id}`

- **Qué hace:** Catálogos y configuración. Elimina o da de baja un registro de conjuntos de estados visibles (`crmStatusSets`).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. · RF-CRM-043: Estados visibles configurables por conjunto de estados, ordenados y mapeados a estado base, con banderas: reasignar, permite volver, espera del socio, requiere aprobación, verificación, notificar al socio, notificar al equipo… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tramites.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-o)

<a id="API-CRM-39-n"></a>
#### API-CRM-39-n · `PATCH /api/admin/crm/config/status-sets/{id}`

- **Qué hace:** Catálogos y configuración. Modifica algunos campos de un registro de conjuntos de estados visibles (`crmStatusSets`) (solo los enviados).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. · RF-CRM-043: Estados visibles configurables por conjunto de estados, ordenados y mapeados a estado base, con banderas: reasignar, permite volver, espera del socio, requiere aprobación, verificación, notificar al socio, notificar al equipo… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tipos.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de conjuntos de estados visibles (`crmStatusSets`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de conjuntos de estados visibles (`crmStatusSets`).
- **Pantallas:** PAN-CRM-11 (Tipos y subtipos de gestión).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-n)

<a id="API-CRM-39-p"></a>
#### API-CRM-39-p · `GET /api/admin/crm/config/areas`

- **Qué hace:** Catálogos y configuración. Lista, con filtros y paginación, los registros de áreas de atención, turnero y actividades (`crmAreas`).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tipos.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de áreas de atención, turnero y actividades (`crmAreas`) con `total`.
- **Pantallas:** PAN-CRM-11 (Tipos y subtipos de gestión).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-p)

<a id="API-CRM-39-q"></a>
#### API-CRM-39-q · `POST /api/admin/crm/config/areas`

- **Qué hace:** Catálogos y configuración. Da de alta un registro de áreas de atención, turnero y actividades (`crmAreas`).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tipos.configurar`.
- **Recibe:** los datos de áreas de atención, turnero y actividades (`crmAreas`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de áreas de atención, turnero y actividades (`crmAreas`).
- **Pantallas:** PAN-CRM-11 (Tipos y subtipos de gestión).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-q)

<a id="API-CRM-39-r"></a>
#### API-CRM-39-r · `GET /api/admin/crm/config/areas/{id}`

- **Qué hace:** Catálogos y configuración. Obtiene el detalle de un registro de áreas de atención, turnero y actividades (`crmAreas`).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tipos.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de áreas de atención, turnero y actividades (`crmAreas`).
- **Pantallas:** PAN-CRM-11 (Tipos y subtipos de gestión).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-r)

<a id="API-CRM-39-t"></a>
#### API-CRM-39-t · `DELETE /api/admin/crm/config/areas/{id}`

- **Qué hace:** Catálogos y configuración. Elimina o da de baja un registro de áreas de atención, turnero y actividades (`crmAreas`).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tramites.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-t)

<a id="API-CRM-39-s"></a>
#### API-CRM-39-s · `PATCH /api/admin/crm/config/areas/{id}`

- **Qué hace:** Catálogos y configuración. Modifica algunos campos de un registro de áreas de atención, turnero y actividades (`crmAreas`) (solo los enviados).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tipos.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de áreas de atención, turnero y actividades (`crmAreas`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de áreas de atención, turnero y actividades (`crmAreas`).
- **Pantallas:** PAN-CRM-11 (Tipos y subtipos de gestión).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-s)

<a id="API-CRM-39-u"></a>
#### API-CRM-39-u · `GET /api/admin/crm/config/sla-policies`

- **Qué hace:** Catálogos y configuración. Lista, con filtros y paginación, los registros de SLA de atención (`crmSlaPolicies`).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tipos.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de SLA de atención (`crmSlaPolicies`) con `total`.
- **Pantallas:** PAN-CRM-11 (Tipos y subtipos de gestión).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-u)

<a id="API-CRM-39-v"></a>
#### API-CRM-39-v · `POST /api/admin/crm/config/sla-policies`

- **Qué hace:** Catálogos y configuración. Da de alta un registro de SLA de atención (`crmSlaPolicies`).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tipos.configurar`.
- **Recibe:** los datos de SLA de atención (`crmSlaPolicies`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de SLA de atención (`crmSlaPolicies`).
- **Pantallas:** PAN-CRM-11 (Tipos y subtipos de gestión).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-v)

<a id="API-CRM-39-w"></a>
#### API-CRM-39-w · `GET /api/admin/crm/config/sla-policies/{id}`

- **Qué hace:** Catálogos y configuración. Obtiene el detalle de un registro de SLA de atención (`crmSlaPolicies`).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tipos.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de SLA de atención (`crmSlaPolicies`).
- **Pantallas:** PAN-CRM-11 (Tipos y subtipos de gestión).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-w)

<a id="API-CRM-39-y"></a>
#### API-CRM-39-y · `DELETE /api/admin/crm/config/sla-policies/{id}`

- **Qué hace:** Catálogos y configuración. Elimina o da de baja un registro de SLA de atención (`crmSlaPolicies`).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tramites.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-y)

<a id="API-CRM-39-x"></a>
#### API-CRM-39-x · `PATCH /api/admin/crm/config/sla-policies/{id}`

- **Qué hace:** Catálogos y configuración. Modifica algunos campos de un registro de SLA de atención (`crmSlaPolicies`) (solo los enviados).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tipos.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de SLA de atención (`crmSlaPolicies`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de SLA de atención (`crmSlaPolicies`).
- **Pantallas:** PAN-CRM-11 (Tipos y subtipos de gestión).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-x)

<a id="API-CRM-39-z"></a>
#### API-CRM-39-z · `GET /api/admin/crm/config/routing-rules`

- **Qué hace:** Catálogos y configuración. Lista, con filtros y paginación, los registros de derivación sugerida y guardias (`crmRoutingRules`).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tipos.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de derivación sugerida y guardias (`crmRoutingRules`) con `total`.
- **Pantallas:** PAN-CRM-11 (Tipos y subtipos de gestión).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-z)

<a id="API-CRM-39-26"></a>
#### API-CRM-39-26 · `POST /api/admin/crm/config/routing-rules`

- **Qué hace:** Catálogos y configuración. Da de alta un registro de derivación sugerida y guardias (`crmRoutingRules`).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tipos.configurar`.
- **Recibe:** los datos de derivación sugerida y guardias (`crmRoutingRules`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de derivación sugerida y guardias (`crmRoutingRules`).
- **Pantallas:** PAN-CRM-11 (Tipos y subtipos de gestión).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-26)

<a id="API-CRM-39-27"></a>
#### API-CRM-39-27 · `GET /api/admin/crm/config/routing-rules/{id}`

- **Qué hace:** Catálogos y configuración. Obtiene el detalle de un registro de derivación sugerida y guardias (`crmRoutingRules`).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tipos.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de derivación sugerida y guardias (`crmRoutingRules`).
- **Pantallas:** PAN-CRM-11 (Tipos y subtipos de gestión).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-27)

<a id="API-CRM-39-29"></a>
#### API-CRM-39-29 · `DELETE /api/admin/crm/config/routing-rules/{id}`

- **Qué hace:** Catálogos y configuración. Elimina o da de baja un registro de derivación sugerida y guardias (`crmRoutingRules`).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tramites.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-29)

<a id="API-CRM-39-28"></a>
#### API-CRM-39-28 · `PATCH /api/admin/crm/config/routing-rules/{id}`

- **Qué hace:** Catálogos y configuración. Modifica algunos campos de un registro de derivación sugerida y guardias (`crmRoutingRules`) (solo los enviados).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tipos.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de derivación sugerida y guardias (`crmRoutingRules`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de derivación sugerida y guardias (`crmRoutingRules`).
- **Pantallas:** PAN-CRM-11 (Tipos y subtipos de gestión).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-28)

<a id="API-CRM-39-30"></a>
#### API-CRM-39-30 · `GET /api/admin/crm/config/quick-replies`

- **Qué hace:** Catálogos y configuración. Lista, con filtros y paginación, los registros de respuestas rápidas (`crmQuickReplies`).
- **Para qué sirve:** RF-CRM-049: Respuestas rápidas con variables por tipo/subtipo/canal. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tipos.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de respuestas rápidas (`crmQuickReplies`) con `total`.
- **Pantallas:** PAN-CRM-11 (Tipos y subtipos de gestión).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-30)

<a id="API-CRM-39-31"></a>
#### API-CRM-39-31 · `POST /api/admin/crm/config/quick-replies`

- **Qué hace:** Catálogos y configuración. Da de alta un registro de respuestas rápidas (`crmQuickReplies`).
- **Para qué sirve:** RF-CRM-049: Respuestas rápidas con variables por tipo/subtipo/canal. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tipos.configurar`.
- **Recibe:** los datos de respuestas rápidas (`crmQuickReplies`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de respuestas rápidas (`crmQuickReplies`).
- **Pantallas:** PAN-CRM-11 (Tipos y subtipos de gestión).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-31)

<a id="API-CRM-39-32"></a>
#### API-CRM-39-32 · `GET /api/admin/crm/config/quick-replies/{id}`

- **Qué hace:** Catálogos y configuración. Obtiene el detalle de un registro de respuestas rápidas (`crmQuickReplies`).
- **Para qué sirve:** RF-CRM-049: Respuestas rápidas con variables por tipo/subtipo/canal. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tipos.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de respuestas rápidas (`crmQuickReplies`).
- **Pantallas:** PAN-CRM-11 (Tipos y subtipos de gestión).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-32)

<a id="API-CRM-39-34"></a>
#### API-CRM-39-34 · `DELETE /api/admin/crm/config/quick-replies/{id}`

- **Qué hace:** Catálogos y configuración. Elimina o da de baja un registro de respuestas rápidas (`crmQuickReplies`).
- **Para qué sirve:** RF-CRM-049: Respuestas rápidas con variables por tipo/subtipo/canal. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tramites.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-34)

<a id="API-CRM-39-33"></a>
#### API-CRM-39-33 · `PATCH /api/admin/crm/config/quick-replies/{id}`

- **Qué hace:** Catálogos y configuración. Modifica algunos campos de un registro de respuestas rápidas (`crmQuickReplies`) (solo los enviados).
- **Para qué sirve:** RF-CRM-049: Respuestas rápidas con variables por tipo/subtipo/canal. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tipos.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de respuestas rápidas (`crmQuickReplies`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de respuestas rápidas (`crmQuickReplies`).
- **Pantallas:** PAN-CRM-11 (Tipos y subtipos de gestión).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-33)

<a id="API-CRM-39-35"></a>
#### API-CRM-39-35 · `GET /api/admin/crm/config/channels`

- **Qué hace:** Catálogos y configuración. Lista, con filtros y paginación, los registros de canales del tenant (`crmChannels`).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tipos.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de canales del tenant (`crmChannels`) con `total`.
- **Pantallas:** PAN-CRM-11 (Tipos y subtipos de gestión).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-35)

<a id="API-CRM-39-36"></a>
#### API-CRM-39-36 · `POST /api/admin/crm/config/channels`

- **Qué hace:** Catálogos y configuración. Da de alta un registro de canales del tenant (`crmChannels`).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tipos.configurar`.
- **Recibe:** los datos de canales del tenant (`crmChannels`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de canales del tenant (`crmChannels`).
- **Pantallas:** PAN-CRM-11 (Tipos y subtipos de gestión).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-36)

<a id="API-CRM-39-37"></a>
#### API-CRM-39-37 · `GET /api/admin/crm/config/channels/{id}`

- **Qué hace:** Catálogos y configuración. Obtiene el detalle de un registro de canales del tenant (`crmChannels`).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tipos.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de canales del tenant (`crmChannels`).
- **Pantallas:** PAN-CRM-11 (Tipos y subtipos de gestión).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-37)

<a id="API-CRM-39-39"></a>
#### API-CRM-39-39 · `DELETE /api/admin/crm/config/channels/{id}`

- **Qué hace:** Catálogos y configuración. Elimina o da de baja un registro de canales del tenant (`crmChannels`).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tramites.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-39)

<a id="API-CRM-39-38"></a>
#### API-CRM-39-38 · `PATCH /api/admin/crm/config/channels/{id}`

- **Qué hace:** Catálogos y configuración. Modifica algunos campos de un registro de canales del tenant (`crmChannels`) (solo los enviados).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tipos.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de canales del tenant (`crmChannels`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de canales del tenant (`crmChannels`).
- **Pantallas:** PAN-CRM-11 (Tipos y subtipos de gestión).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-38)

<a id="API-CRM-39-40"></a>
#### API-CRM-39-40 · `GET /api/admin/crm/config/bot-flows`

- **Qué hace:** Catálogos y configuración. Lista, con filtros y paginación, los registros de flujos de bot (`crmBotFlows`).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tipos.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de flujos de bot (`crmBotFlows`) con `total`.
- **Pantallas:** PAN-CRM-11 (Tipos y subtipos de gestión).
- **Ola:** O6 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-40)

<a id="API-CRM-39-41"></a>
#### API-CRM-39-41 · `POST /api/admin/crm/config/bot-flows`

- **Qué hace:** Catálogos y configuración. Da de alta un registro de flujos de bot (`crmBotFlows`).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tipos.configurar`.
- **Recibe:** los datos de flujos de bot (`crmBotFlows`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de flujos de bot (`crmBotFlows`).
- **Pantallas:** PAN-CRM-11 (Tipos y subtipos de gestión).
- **Ola:** O6 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-41)

<a id="API-CRM-39-42"></a>
#### API-CRM-39-42 · `GET /api/admin/crm/config/bot-flows/{id}`

- **Qué hace:** Catálogos y configuración. Obtiene el detalle de un registro de flujos de bot (`crmBotFlows`).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tipos.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de flujos de bot (`crmBotFlows`).
- **Pantallas:** PAN-CRM-11 (Tipos y subtipos de gestión).
- **Ola:** O6 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-42)

<a id="API-CRM-39-44"></a>
#### API-CRM-39-44 · `DELETE /api/admin/crm/config/bot-flows/{id}`

- **Qué hace:** Catálogos y configuración. Elimina o da de baja un registro de flujos de bot (`crmBotFlows`).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tramites.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O6 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-44)

<a id="API-CRM-39-43"></a>
#### API-CRM-39-43 · `PATCH /api/admin/crm/config/bot-flows/{id}`

- **Qué hace:** Catálogos y configuración. Modifica algunos campos de un registro de flujos de bot (`crmBotFlows`) (solo los enviados).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tipos.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de flujos de bot (`crmBotFlows`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de flujos de bot (`crmBotFlows`).
- **Pantallas:** PAN-CRM-11 (Tipos y subtipos de gestión).
- **Ola:** O6 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-43)

<a id="API-CRM-39-45"></a>
#### API-CRM-39-45 · `GET /api/admin/crm/config/ai-settings`

- **Qué hace:** Catálogos y configuración. Lista, con filtros y paginación, los registros de `ai-settings`.
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tipos.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ResultadoGenerico (`ResultadoGenerico`) con `total`.
- **Pantallas:** PAN-CRM-11 (Tipos y subtipos de gestión).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-45)

<a id="API-CRM-39-46"></a>
#### API-CRM-39-46 · `POST /api/admin/crm/config/ai-settings`

- **Qué hace:** Catálogos y configuración. Registra un nuevo elemento u operación en `ai-settings`.
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tipos.configurar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CRM-11 (Tipos y subtipos de gestión).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-46)

<a id="API-CRM-39-47"></a>
#### API-CRM-39-47 · `GET /api/admin/crm/config/ai-settings/{id}`

- **Qué hace:** Catálogos y configuración. Obtiene el detalle de un registro de `ai-settings`.
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tipos.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CRM-11 (Tipos y subtipos de gestión).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-47)

<a id="API-CRM-39-49"></a>
#### API-CRM-39-49 · `DELETE /api/admin/crm/config/ai-settings/{id}`

- **Qué hace:** Catálogos y configuración. Elimina o da de baja un registro de `ai-settings`.
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tramites.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-49)

<a id="API-CRM-39-48"></a>
#### API-CRM-39-48 · `PATCH /api/admin/crm/config/ai-settings/{id}`

- **Qué hace:** Catálogos y configuración. Modifica algunos campos de un registro de `ai-settings` (solo los enviados).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tipos.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CRM-11 (Tipos y subtipos de gestión).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-48)

<a id="API-CRM-39-50"></a>
#### API-CRM-39-50 · `GET /api/admin/crm/config/procedure-types`

- **Qué hace:** Catálogos y configuración. Lista, con filtros y paginación, los registros de tipos de trámite con vencimiento (`crmProcedureTypes`).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tipos.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de tipos de trámite con vencimiento (`crmProcedureTypes`) con `total`.
- **Pantallas:** PAN-CRM-11 (Tipos y subtipos de gestión).
- **Ola:** O7 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-50)

<a id="API-CRM-39-51"></a>
#### API-CRM-39-51 · `POST /api/admin/crm/config/procedure-types`

- **Qué hace:** Catálogos y configuración. Da de alta un registro de tipos de trámite con vencimiento (`crmProcedureTypes`).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tipos.configurar`.
- **Recibe:** los datos de tipos de trámite con vencimiento (`crmProcedureTypes`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de tipos de trámite con vencimiento (`crmProcedureTypes`).
- **Pantallas:** PAN-CRM-11 (Tipos y subtipos de gestión).
- **Ola:** O7 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-51)

<a id="API-CRM-39-52"></a>
#### API-CRM-39-52 · `GET /api/admin/crm/config/procedure-types/{id}`

- **Qué hace:** Catálogos y configuración. Obtiene el detalle de un registro de tipos de trámite con vencimiento (`crmProcedureTypes`).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tipos.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de tipos de trámite con vencimiento (`crmProcedureTypes`).
- **Pantallas:** PAN-CRM-11 (Tipos y subtipos de gestión).
- **Ola:** O7 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-52)

<a id="API-CRM-39-54"></a>
#### API-CRM-39-54 · `DELETE /api/admin/crm/config/procedure-types/{id}`

- **Qué hace:** Catálogos y configuración. Elimina o da de baja un registro de tipos de trámite con vencimiento (`crmProcedureTypes`).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tramites.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O7 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-54)

<a id="API-CRM-39-53"></a>
#### API-CRM-39-53 · `PATCH /api/admin/crm/config/procedure-types/{id}`

- **Qué hace:** Catálogos y configuración. Modifica algunos campos de un registro de tipos de trámite con vencimiento (`crmProcedureTypes`) (solo los enviados).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tipos.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de tipos de trámite con vencimiento (`crmProcedureTypes`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de tipos de trámite con vencimiento (`crmProcedureTypes`).
- **Pantallas:** PAN-CRM-11 (Tipos y subtipos de gestión).
- **Ola:** O7 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-53)

<a id="API-CRM-39-55"></a>
#### API-CRM-39-55 · `GET /api/admin/crm/config/incident-classes`

- **Qué hace:** Catálogos y configuración. Lista, con filtros y paginación, los registros de clases de incidente (`crmIncidentClasses`).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tipos.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de clases de incidente (`crmIncidentClasses`) con `total`.
- **Pantallas:** PAN-CRM-11 (Tipos y subtipos de gestión).
- **Ola:** O3 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-55)

<a id="API-CRM-39-56"></a>
#### API-CRM-39-56 · `POST /api/admin/crm/config/incident-classes`

- **Qué hace:** Catálogos y configuración. Da de alta un registro de clases de incidente (`crmIncidentClasses`).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tipos.configurar`.
- **Recibe:** los datos de clases de incidente (`crmIncidentClasses`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de clases de incidente (`crmIncidentClasses`).
- **Pantallas:** PAN-CRM-11 (Tipos y subtipos de gestión).
- **Ola:** O3 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-56)

<a id="API-CRM-39-57"></a>
#### API-CRM-39-57 · `GET /api/admin/crm/config/incident-classes/{id}`

- **Qué hace:** Catálogos y configuración. Obtiene el detalle de un registro de clases de incidente (`crmIncidentClasses`).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tipos.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de clases de incidente (`crmIncidentClasses`).
- **Pantallas:** PAN-CRM-11 (Tipos y subtipos de gestión).
- **Ola:** O3 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-57)

<a id="API-CRM-39-59"></a>
#### API-CRM-39-59 · `DELETE /api/admin/crm/config/incident-classes/{id}`

- **Qué hace:** Catálogos y configuración. Elimina o da de baja un registro de clases de incidente (`crmIncidentClasses`).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tramites.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O3 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-59)

<a id="API-CRM-39-58"></a>
#### API-CRM-39-58 · `PATCH /api/admin/crm/config/incident-classes/{id}`

- **Qué hace:** Catálogos y configuración. Modifica algunos campos de un registro de clases de incidente (`crmIncidentClasses`) (solo los enviados).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.config.tipos.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de clases de incidente (`crmIncidentClasses`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de clases de incidente (`crmIncidentClasses`).
- **Pantallas:** PAN-CRM-11 (Tipos y subtipos de gestión).
- **Ola:** O3 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-39-58)

<a id="API-CRM-40"></a>
#### API-CRM-40 · `POST /api/admin/crm/config/channels/{id}/test`

- **Qué hace:** Probar conexión, sincronizar plantillas WhatsApp. Prueba un registro de canales del tenant (`crmChannels`).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. · RF-CRM-172: WhatsApp Business con la cuenta oficial del tenant: mensajes entrantes y salientes, ventana de atención de 24 h, plantillas aprobadas fuera de ventana, opt-in y opt-out. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.canales.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CRM-16 (Canales).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1883 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-40)

<a id="API-CRM-40-b"></a>
#### API-CRM-40-b · `POST /api/admin/crm/config/channels/{id}/sync-templates`

- **Qué hace:** Probar conexión, sincronizar plantillas WhatsApp. Sincroniza las plantillas de un registro de canales del tenant (`crmChannels`).
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. · RF-CRM-172: WhatsApp Business con la cuenta oficial del tenant: mensajes entrantes y salientes, ventana de atención de 24 h, plantillas aprobadas fuera de ventana, opt-in y opt-out. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.canales.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CRM-16 (Canales).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1883 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-40-b)

<a id="API-CRM-41"></a>
#### API-CRM-41 · `POST /api/admin/crm/config/bot-flows/{id}/publish`

- **Qué hace:** Publicar y simular bot. Publica un registro de flujos de bot (`crmBotFlows`).
- **Para qué sirve:** RF-CRM-066: Recepción pública de bajas sin registro previo ni trámites obstructivos, para los servicios alcanzados; constancia con código identificador por el mismo medio dentro de 24 horas. Habilitada en Internet, TV y telefonía… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.bot.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CRM-17 (Bot de autogestión).
- **Ola:** O6 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1884 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-41)

<a id="API-CRM-41-b"></a>
#### API-CRM-41-b · `POST /api/admin/crm/config/bot-flows/{id}/simulate`

- **Qué hace:** Publicar y simular bot. Simula sin efectos un registro de flujos de bot (`crmBotFlows`).
- **Para qué sirve:** RF-CRM-066: Recepción pública de bajas sin registro previo ni trámites obstructivos, para los servicios alcanzados; constancia con código identificador por el mismo medio dentro de 24 horas. Habilitada en Internet, TV y telefonía… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.bot.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CRM-17 (Bot de autogestión).
- **Ola:** O6 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1884 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-41-b)

<a id="API-CRM-42"></a>
#### API-CRM-42 · `GET /api/admin/crm/procedure-records`

- **Qué hace:** Trámites presentados, no presentados, vencidos. Lista, con filtros y paginación, los registros de trámites presentados (`crmProcedureRecords`).
- **Para qué sirve:** RF-CRM-081: Informe de trámites presentados, no presentados y vencidos, filtrable por titular y servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.casos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de trámites presentados (`crmProcedureRecords`) con `total`.
- **Pantallas:** PAN-CRM-02 (Bandeja de mi área y mis casos), PAN-CRM-03 (Expediente del caso), PAN-CRM-05 (Vista 360 del socio) y 3 más.
- **Ola:** O7 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1885 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-42)

<a id="API-CRM-42-b"></a>
#### API-CRM-42-b · `POST /api/admin/crm/procedure-records`

- **Qué hace:** Trámites presentados, no presentados, vencidos. Da de alta un registro de trámites presentados (`crmProcedureRecords`).
- **Para qué sirve:** RF-CRM-081: Informe de trámites presentados, no presentados y vencidos, filtrable por titular y servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.casos.crear`.
- **Recibe:** los datos de trámites presentados (`crmProcedureRecords`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de trámites presentados (`crmProcedureRecords`).
- **Pantallas:** PAN-CRM-04 (Alta y carga rápida de reclamo), PAN-TEC-49 (Carga rápida de reclamo).
- **Ola:** O7 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1885 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-42-b)

<a id="API-CRM-43"></a>
#### API-CRM-43 · `GET /api/admin/crm/projects`

- **Qué hace:** Proyectos, tiempo, bolsas. Lista, con filtros y paginación, los registros de proyectos (`crmProjects`).
- **Para qué sirve:** RF-CRM-041: Registro de tiempo (worklogs) con inicio/fin por usuario, minutos reales, minutos a facturar editables y solicitud de facturación de horas a M05 con bolsas de horas bonificadas (mensual de soporte y por venta). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.horas.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de proyectos (`crmProjects`) con `total`.
- **Pantallas:** PAN-CRM-22 (Proyectos, horas y bolsas).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1886 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-43)

<a id="API-CRM-43-b"></a>
#### API-CRM-43-b · `POST /api/admin/crm/projects`

- **Qué hace:** Proyectos, tiempo, bolsas. Da de alta un registro de proyectos (`crmProjects`).
- **Para qué sirve:** RF-CRM-041: Registro de tiempo (worklogs) con inicio/fin por usuario, minutos reales, minutos a facturar editables y solicitud de facturación de horas a M05 con bolsas de horas bonificadas (mensual de soporte y por venta). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.horas.registrar`.
- **Recibe:** los datos de proyectos (`crmProjects`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de proyectos (`crmProjects`).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1886 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-43-b)

<a id="API-CRM-43-c"></a>
#### API-CRM-43-c · `GET /api/admin/crm/projects/{id}`

- **Qué hace:** Proyectos, tiempo, bolsas. Obtiene el detalle de un registro de proyectos (`crmProjects`).
- **Para qué sirve:** RF-CRM-041: Registro de tiempo (worklogs) con inicio/fin por usuario, minutos reales, minutos a facturar editables y solicitud de facturación de horas a M05 con bolsas de horas bonificadas (mensual de soporte y por venta). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.horas.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de proyectos (`crmProjects`).
- **Pantallas:** PAN-CRM-22 (Proyectos, horas y bolsas).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1886 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-43-c)

<a id="API-CRM-43-e"></a>
#### API-CRM-43-e · `DELETE /api/admin/crm/projects/{id}`

- **Qué hace:** Proyectos, tiempo, bolsas. Elimina o da de baja un registro de proyectos (`crmProjects`).
- **Para qué sirve:** RF-CRM-041: Registro de tiempo (worklogs) con inicio/fin por usuario, minutos reales, minutos a facturar editables y solicitud de facturación de horas a M05 con bolsas de horas bonificadas (mensual de soporte y por venta). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.horas.registrar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1886 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-43-e)

<a id="API-CRM-43-d"></a>
#### API-CRM-43-d · `PATCH /api/admin/crm/projects/{id}`

- **Qué hace:** Proyectos, tiempo, bolsas. Modifica algunos campos de un registro de proyectos (`crmProjects`) (solo los enviados).
- **Para qué sirve:** RF-CRM-041: Registro de tiempo (worklogs) con inicio/fin por usuario, minutos reales, minutos a facturar editables y solicitud de facturación de horas a M05 con bolsas de horas bonificadas (mensual de soporte y por venta). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.horas.registrar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de proyectos (`crmProjects`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de proyectos (`crmProjects`).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1886 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-43-d)

<a id="API-CRM-43-f"></a>
#### API-CRM-43-f · `GET /api/admin/crm/worklogs`

- **Qué hace:** Proyectos, tiempo, bolsas. Lista, con filtros y paginación, los registros de registro de tiempo (`crmWorkLogs`).
- **Para qué sirve:** RF-CRM-041: Registro de tiempo (worklogs) con inicio/fin por usuario, minutos reales, minutos a facturar editables y solicitud de facturación de horas a M05 con bolsas de horas bonificadas (mensual de soporte y por venta). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.horas.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de registro de tiempo (`crmWorkLogs`) con `total`.
- **Pantallas:** PAN-CRM-22 (Proyectos, horas y bolsas).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1886 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-43-f)

<a id="API-CRM-43-g"></a>
#### API-CRM-43-g · `POST /api/admin/crm/worklogs`

- **Qué hace:** Proyectos, tiempo, bolsas. Da de alta un registro de registro de tiempo (`crmWorkLogs`).
- **Para qué sirve:** RF-CRM-041: Registro de tiempo (worklogs) con inicio/fin por usuario, minutos reales, minutos a facturar editables y solicitud de facturación de horas a M05 con bolsas de horas bonificadas (mensual de soporte y por venta). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.horas.registrar`.
- **Recibe:** los datos de registro de tiempo (`crmWorkLogs`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de registro de tiempo (`crmWorkLogs`).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1886 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-43-g)

<a id="API-CRM-43-h"></a>
#### API-CRM-43-h · `GET /api/admin/crm/worklogs/{id}`

- **Qué hace:** Proyectos, tiempo, bolsas. Obtiene el detalle de un registro de registro de tiempo (`crmWorkLogs`).
- **Para qué sirve:** RF-CRM-041: Registro de tiempo (worklogs) con inicio/fin por usuario, minutos reales, minutos a facturar editables y solicitud de facturación de horas a M05 con bolsas de horas bonificadas (mensual de soporte y por venta). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.horas.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de registro de tiempo (`crmWorkLogs`).
- **Pantallas:** PAN-CRM-22 (Proyectos, horas y bolsas).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1886 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-43-h)

<a id="API-CRM-43-j"></a>
#### API-CRM-43-j · `DELETE /api/admin/crm/worklogs/{id}`

- **Qué hace:** Proyectos, tiempo, bolsas. Elimina o da de baja un registro de registro de tiempo (`crmWorkLogs`).
- **Para qué sirve:** RF-CRM-041: Registro de tiempo (worklogs) con inicio/fin por usuario, minutos reales, minutos a facturar editables y solicitud de facturación de horas a M05 con bolsas de horas bonificadas (mensual de soporte y por venta). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.horas.registrar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1886 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-43-j)

<a id="API-CRM-43-i"></a>
#### API-CRM-43-i · `PATCH /api/admin/crm/worklogs/{id}`

- **Qué hace:** Proyectos, tiempo, bolsas. Modifica algunos campos de un registro de registro de tiempo (`crmWorkLogs`) (solo los enviados).
- **Para qué sirve:** RF-CRM-041: Registro de tiempo (worklogs) con inicio/fin por usuario, minutos reales, minutos a facturar editables y solicitud de facturación de horas a M05 con bolsas de horas bonificadas (mensual de soporte y por venta). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.horas.registrar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de registro de tiempo (`crmWorkLogs`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de registro de tiempo (`crmWorkLogs`).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1886 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-43-i)

<a id="API-CRM-43-k"></a>
#### API-CRM-43-k · `GET /api/admin/crm/hour-banks`

- **Qué hace:** Proyectos, tiempo, bolsas. Lista, con filtros y paginación, los registros de bolsas de horas (`crmHourBanks`).
- **Para qué sirve:** RF-CRM-041: Registro de tiempo (worklogs) con inicio/fin por usuario, minutos reales, minutos a facturar editables y solicitud de facturación de horas a M05 con bolsas de horas bonificadas (mensual de soporte y por venta). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.horas.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de bolsas de horas (`crmHourBanks`) con `total`.
- **Pantallas:** PAN-CRM-22 (Proyectos, horas y bolsas).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1886 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-43-k)

<a id="API-CRM-43-l"></a>
#### API-CRM-43-l · `POST /api/admin/crm/hour-banks`

- **Qué hace:** Proyectos, tiempo, bolsas. Da de alta un registro de bolsas de horas (`crmHourBanks`).
- **Para qué sirve:** RF-CRM-041: Registro de tiempo (worklogs) con inicio/fin por usuario, minutos reales, minutos a facturar editables y solicitud de facturación de horas a M05 con bolsas de horas bonificadas (mensual de soporte y por venta). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.horas.registrar`.
- **Recibe:** los datos de bolsas de horas (`crmHourBanks`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de bolsas de horas (`crmHourBanks`).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1886 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-43-l)

<a id="API-CRM-43-m"></a>
#### API-CRM-43-m · `GET /api/admin/crm/hour-banks/{id}`

- **Qué hace:** Proyectos, tiempo, bolsas. Obtiene el detalle de un registro de bolsas de horas (`crmHourBanks`).
- **Para qué sirve:** RF-CRM-041: Registro de tiempo (worklogs) con inicio/fin por usuario, minutos reales, minutos a facturar editables y solicitud de facturación de horas a M05 con bolsas de horas bonificadas (mensual de soporte y por venta). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.horas.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de bolsas de horas (`crmHourBanks`).
- **Pantallas:** PAN-CRM-22 (Proyectos, horas y bolsas).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1886 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-43-m)

<a id="API-CRM-43-o"></a>
#### API-CRM-43-o · `DELETE /api/admin/crm/hour-banks/{id}`

- **Qué hace:** Proyectos, tiempo, bolsas. Elimina o da de baja un registro de bolsas de horas (`crmHourBanks`).
- **Para qué sirve:** RF-CRM-041: Registro de tiempo (worklogs) con inicio/fin por usuario, minutos reales, minutos a facturar editables y solicitud de facturación de horas a M05 con bolsas de horas bonificadas (mensual de soporte y por venta). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.horas.registrar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1886 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-43-o)

<a id="API-CRM-43-n"></a>
#### API-CRM-43-n · `PATCH /api/admin/crm/hour-banks/{id}`

- **Qué hace:** Proyectos, tiempo, bolsas. Modifica algunos campos de un registro de bolsas de horas (`crmHourBanks`) (solo los enviados).
- **Para qué sirve:** RF-CRM-041: Registro de tiempo (worklogs) con inicio/fin por usuario, minutos reales, minutos a facturar editables y solicitud de facturación de horas a M05 con bolsas de horas bonificadas (mensual de soporte y por venta). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.horas.registrar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de bolsas de horas (`crmHourBanks`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de bolsas de horas (`crmHourBanks`).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1886 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-43-n)

<a id="API-CRM-43-p"></a>
#### API-CRM-43-p · `GET /api/admin/crm/account-assignments`

- **Qué hace:** Proyectos, tiempo, bolsas. Lista, con filtros y paginación, los registros de responsables por cuenta (`crmAccountAssignments`).
- **Para qué sirve:** RF-CRM-041: Registro de tiempo (worklogs) con inicio/fin por usuario, minutos reales, minutos a facturar editables y solicitud de facturación de horas a M05 con bolsas de horas bonificadas (mensual de soporte y por venta). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.horas.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de responsables por cuenta (`crmAccountAssignments`) con `total`.
- **Pantallas:** PAN-CRM-22 (Proyectos, horas y bolsas).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1886 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-43-p)

<a id="API-CRM-43-q"></a>
#### API-CRM-43-q · `POST /api/admin/crm/account-assignments`

- **Qué hace:** Proyectos, tiempo, bolsas. Da de alta un registro de responsables por cuenta (`crmAccountAssignments`).
- **Para qué sirve:** RF-CRM-041: Registro de tiempo (worklogs) con inicio/fin por usuario, minutos reales, minutos a facturar editables y solicitud de facturación de horas a M05 con bolsas de horas bonificadas (mensual de soporte y por venta). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.horas.registrar`.
- **Recibe:** los datos de responsables por cuenta (`crmAccountAssignments`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de responsables por cuenta (`crmAccountAssignments`).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1886 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-43-q)

<a id="API-CRM-43-r"></a>
#### API-CRM-43-r · `GET /api/admin/crm/account-assignments/{id}`

- **Qué hace:** Proyectos, tiempo, bolsas. Obtiene el detalle de un registro de responsables por cuenta (`crmAccountAssignments`).
- **Para qué sirve:** RF-CRM-041: Registro de tiempo (worklogs) con inicio/fin por usuario, minutos reales, minutos a facturar editables y solicitud de facturación de horas a M05 con bolsas de horas bonificadas (mensual de soporte y por venta). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.horas.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de responsables por cuenta (`crmAccountAssignments`).
- **Pantallas:** PAN-CRM-22 (Proyectos, horas y bolsas).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1886 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-43-r)

<a id="API-CRM-43-t"></a>
#### API-CRM-43-t · `DELETE /api/admin/crm/account-assignments/{id}`

- **Qué hace:** Proyectos, tiempo, bolsas. Elimina o da de baja un registro de responsables por cuenta (`crmAccountAssignments`).
- **Para qué sirve:** RF-CRM-041: Registro de tiempo (worklogs) con inicio/fin por usuario, minutos reales, minutos a facturar editables y solicitud de facturación de horas a M05 con bolsas de horas bonificadas (mensual de soporte y por venta). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.horas.registrar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1886 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-43-t)

<a id="API-CRM-43-s"></a>
#### API-CRM-43-s · `PATCH /api/admin/crm/account-assignments/{id}`

- **Qué hace:** Proyectos, tiempo, bolsas. Modifica algunos campos de un registro de responsables por cuenta (`crmAccountAssignments`) (solo los enviados).
- **Para qué sirve:** RF-CRM-041: Registro de tiempo (worklogs) con inicio/fin por usuario, minutos reales, minutos a facturar editables y solicitud de facturación de horas a M05 con bolsas de horas bonificadas (mensual de soporte y por venta). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.horas.registrar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de responsables por cuenta (`crmAccountAssignments`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de responsables por cuenta (`crmAccountAssignments`).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1886 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-43-s)

<a id="API-CRM-44"></a>
#### API-CRM-44 · `POST /api/admin/crm/worklogs/billing-requests`

- **Qué hace:** Solicitar a M05 la facturación de horas. Registra un nuevo elemento u operación en registro de tiempo (`crmWorkLogs`).
- **Para qué sirve:** RF-CRM-041: Registro de tiempo (worklogs) con inicio/fin por usuario, minutos reales, minutos a facturar editables y solicitud de facturación de horas a M05 con bolsas de horas bonificadas (mensual de soporte y por venta). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.horas.facturar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1887 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-44)

<a id="API-CRM-45"></a>
#### API-CRM-45 · `POST /api/admin/crm/queue/tickets`

- **Qué hace:** Emitir turno. Da de alta un registro de turnos del turnero (`crmQueueTickets`).
- **Para qué sirve:** RF-CRM-153: Tótem de autoservicio para emitir turno (con documento opcional) e imprimir o mostrar QR. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.turnero.emitir`.
- **Recibe:** los datos de turnos del turnero (`crmQueueTickets`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de turnos del turnero (`crmQueueTickets`).
- **Pantallas:** PAN-CRM-23 (Recepción y emisión de turnos), PAN-CRM-26 (Tótem de autoservicio).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1888 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-45)

<a id="API-CRM-46"></a>
#### API-CRM-46 · `POST /api/admin/crm/queue/desks/{id}/open`

- **Qué hace:** Abrir/cerrar box. Abre un registro de boxes (`crmQueueDesks`).
- **Para qué sirve:** RF-CRM-230: Aviso de finalización a destinatarios al cerrar una ocurrencia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.turnero.box.abrir`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1889 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-46)

<a id="API-CRM-46-b"></a>
#### API-CRM-46-b · `POST /api/admin/crm/queue/desks/{id}/close`

- **Qué hace:** Abrir/cerrar box. Cierra un registro de boxes (`crmQueueDesks`).
- **Para qué sirve:** RF-CRM-230: Aviso de finalización a destinatarios al cerrar una ocurrencia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.turnero.box.abrir`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1889 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-46-b)

<a id="API-CRM-47"></a>
#### API-CRM-47 · `POST /api/admin/crm/queue/desks/{id}/call-next`

- **Qué hace:** Llamar siguiente (atómico) Llama al siguiente turno de un registro de boxes (`crmQueueDesks`).
- **Para qué sirve:** RF-CRM-146: Llamar siguiente con exclusión concurrente: dos boxes nunca llaman el mismo turno. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.turnero.llamar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CRM-24 (Consola de box).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1890 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-47)

<a id="API-CRM-48"></a>
#### API-CRM-48 · `POST /api/admin/crm/queue/tickets/{id}/actions`

- **Qué hace:** Rellamar, ausente, atender, derivar, finalizar. Da de alta un registro de historial unificado de interacciones (`crmInteractions`).
- **Para qué sirve:** RF-CRM-147: Rellamar, marcar ausente, iniciar atención, derivar a otra área conservando el área de origen, finalizar como solucionado, sin solución o sin atención. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.turnero.llamar`.
- **Recibe:** en la ruta `id`; los datos de historial unificado de interacciones (`crmInteractions`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de historial unificado de interacciones (`crmInteractions`).
- **Pantallas:** PAN-CRM-24 (Consola de box).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1891 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-48)

<a id="API-CRM-49"></a>
#### API-CRM-49 · `GET /api/admin/crm/queue/stats`

- **Qué hace:** Estadísticas del turnero. Consulta `stats`.
- **Para qué sirve:** RF-CRM-158: Atención de ventanilla sin turnero (registro directo de interacción) desde O2. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.reportes.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CRM-28 (Estadísticas del turnero), PAN-CRM-34 (Sala BI de atención y reclamos).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1892 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-49)

<a id="API-CRM-50"></a>
#### API-CRM-50 · `GET /api/admin/crm/queue/desk-types`

- **Qué hace:** Configuración del turnero. Lista, con filtros y paginación, los registros de tipos de box (`crmQueueDeskTypes`).
- **Para qué sirve:** RF-CRM-158: Atención de ventanilla sin turnero (registro directo de interacción) desde O2. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.turnero.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de tipos de box (`crmQueueDeskTypes`) con `total`.
- **Pantallas:** PAN-CRM-27 (Administración del turnero).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1893 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-50)

<a id="API-CRM-50-b"></a>
#### API-CRM-50-b · `POST /api/admin/crm/queue/desk-types`

- **Qué hace:** Configuración del turnero. Da de alta un registro de tipos de box (`crmQueueDeskTypes`).
- **Para qué sirve:** RF-CRM-158: Atención de ventanilla sin turnero (registro directo de interacción) desde O2. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.turnero.configurar`.
- **Recibe:** los datos de tipos de box (`crmQueueDeskTypes`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de tipos de box (`crmQueueDeskTypes`).
- **Pantallas:** PAN-CRM-27 (Administración del turnero).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1893 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-50-b)

<a id="API-CRM-50-c"></a>
#### API-CRM-50-c · `GET /api/admin/crm/queue/desk-types/{id}`

- **Qué hace:** Configuración del turnero. Obtiene el detalle de un registro de tipos de box (`crmQueueDeskTypes`).
- **Para qué sirve:** RF-CRM-158: Atención de ventanilla sin turnero (registro directo de interacción) desde O2. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.turnero.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de tipos de box (`crmQueueDeskTypes`).
- **Pantallas:** PAN-CRM-27 (Administración del turnero).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1893 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-50-c)

<a id="API-CRM-50-e"></a>
#### API-CRM-50-e · `DELETE /api/admin/crm/queue/desk-types/{id}`

- **Qué hace:** Configuración del turnero. Elimina o da de baja un registro de tipos de box (`crmQueueDeskTypes`).
- **Para qué sirve:** RF-CRM-158: Atención de ventanilla sin turnero (registro directo de interacción) desde O2. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.turnero.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-CRM-27 (Administración del turnero).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1893 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-50-e)

<a id="API-CRM-50-d"></a>
#### API-CRM-50-d · `PATCH /api/admin/crm/queue/desk-types/{id}`

- **Qué hace:** Configuración del turnero. Modifica algunos campos de un registro de tipos de box (`crmQueueDeskTypes`) (solo los enviados).
- **Para qué sirve:** RF-CRM-158: Atención de ventanilla sin turnero (registro directo de interacción) desde O2. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.turnero.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de tipos de box (`crmQueueDeskTypes`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de tipos de box (`crmQueueDeskTypes`).
- **Pantallas:** PAN-CRM-27 (Administración del turnero).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1893 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-50-d)

<a id="API-CRM-50-f"></a>
#### API-CRM-50-f · `GET /api/admin/crm/queue/desks`

- **Qué hace:** Configuración del turnero. Lista, con filtros y paginación, los registros de boxes (`crmQueueDesks`).
- **Para qué sirve:** RF-CRM-158: Atención de ventanilla sin turnero (registro directo de interacción) desde O2. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.turnero.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de boxes (`crmQueueDesks`) con `total`.
- **Pantallas:** PAN-CRM-27 (Administración del turnero).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1893 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-50-f)

<a id="API-CRM-50-g"></a>
#### API-CRM-50-g · `POST /api/admin/crm/queue/desks`

- **Qué hace:** Configuración del turnero. Da de alta un registro de boxes (`crmQueueDesks`).
- **Para qué sirve:** RF-CRM-158: Atención de ventanilla sin turnero (registro directo de interacción) desde O2. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.turnero.configurar`.
- **Recibe:** los datos de boxes (`crmQueueDesks`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de boxes (`crmQueueDesks`).
- **Pantallas:** PAN-CRM-27 (Administración del turnero).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1893 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-50-g)

<a id="API-CRM-50-h"></a>
#### API-CRM-50-h · `GET /api/admin/crm/queue/desks/{id}`

- **Qué hace:** Configuración del turnero. Obtiene el detalle de un registro de boxes (`crmQueueDesks`).
- **Para qué sirve:** RF-CRM-158: Atención de ventanilla sin turnero (registro directo de interacción) desde O2. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.turnero.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de boxes (`crmQueueDesks`).
- **Pantallas:** PAN-CRM-27 (Administración del turnero).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1893 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-50-h)

<a id="API-CRM-50-j"></a>
#### API-CRM-50-j · `DELETE /api/admin/crm/queue/desks/{id}`

- **Qué hace:** Configuración del turnero. Elimina o da de baja un registro de boxes (`crmQueueDesks`).
- **Para qué sirve:** RF-CRM-158: Atención de ventanilla sin turnero (registro directo de interacción) desde O2. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.turnero.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-CRM-27 (Administración del turnero).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1893 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-50-j)

<a id="API-CRM-50-i"></a>
#### API-CRM-50-i · `PATCH /api/admin/crm/queue/desks/{id}`

- **Qué hace:** Configuración del turnero. Modifica algunos campos de un registro de boxes (`crmQueueDesks`) (solo los enviados).
- **Para qué sirve:** RF-CRM-158: Atención de ventanilla sin turnero (registro directo de interacción) desde O2. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.turnero.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de boxes (`crmQueueDesks`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de boxes (`crmQueueDesks`).
- **Pantallas:** PAN-CRM-27 (Administración del turnero).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1893 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-50-i)

<a id="API-CRM-50-k"></a>
#### API-CRM-50-k · `GET /api/admin/crm/queue/displays`

- **Qué hace:** Configuración del turnero. Lista, con filtros y paginación, los registros de pantallas del turnero (`crmQueueDisplays`).
- **Para qué sirve:** RF-CRM-155: Hardware local mediante agente de T06: impresora térmica de tickets, turnero serie existente, pulsadores; las pantallas web no requieren agente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.turnero.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de pantallas del turnero (`crmQueueDisplays`) con `total`.
- **Pantallas:** PAN-CRM-27 (Administración del turnero).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1893 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-50-k)

<a id="API-CRM-50-l"></a>
#### API-CRM-50-l · `POST /api/admin/crm/queue/displays`

- **Qué hace:** Configuración del turnero. Da de alta un registro de pantallas del turnero (`crmQueueDisplays`).
- **Para qué sirve:** RF-CRM-155: Hardware local mediante agente de T06: impresora térmica de tickets, turnero serie existente, pulsadores; las pantallas web no requieren agente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.turnero.configurar`.
- **Recibe:** los datos de pantallas del turnero (`crmQueueDisplays`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de pantallas del turnero (`crmQueueDisplays`).
- **Pantallas:** PAN-CRM-27 (Administración del turnero).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1893 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-50-l)

<a id="API-CRM-50-m"></a>
#### API-CRM-50-m · `GET /api/admin/crm/queue/displays/{id}`

- **Qué hace:** Configuración del turnero. Obtiene el detalle de un registro de pantallas del turnero (`crmQueueDisplays`).
- **Para qué sirve:** RF-CRM-155: Hardware local mediante agente de T06: impresora térmica de tickets, turnero serie existente, pulsadores; las pantallas web no requieren agente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.turnero.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de pantallas del turnero (`crmQueueDisplays`).
- **Pantallas:** PAN-CRM-27 (Administración del turnero).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1893 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-50-m)

<a id="API-CRM-50-o"></a>
#### API-CRM-50-o · `DELETE /api/admin/crm/queue/displays/{id}`

- **Qué hace:** Configuración del turnero. Elimina o da de baja un registro de pantallas del turnero (`crmQueueDisplays`).
- **Para qué sirve:** RF-CRM-155: Hardware local mediante agente de T06: impresora térmica de tickets, turnero serie existente, pulsadores; las pantallas web no requieren agente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.turnero.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-CRM-27 (Administración del turnero).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1893 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-50-o)

<a id="API-CRM-50-n"></a>
#### API-CRM-50-n · `PATCH /api/admin/crm/queue/displays/{id}`

- **Qué hace:** Configuración del turnero. Modifica algunos campos de un registro de pantallas del turnero (`crmQueueDisplays`) (solo los enviados).
- **Para qué sirve:** RF-CRM-155: Hardware local mediante agente de T06: impresora térmica de tickets, turnero serie existente, pulsadores; las pantallas web no requieren agente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.turnero.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de pantallas del turnero (`crmQueueDisplays`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de pantallas del turnero (`crmQueueDisplays`).
- **Pantallas:** PAN-CRM-27 (Administración del turnero).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1893 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-50-n)

<a id="API-CRM-50-p"></a>
#### API-CRM-50-p · `GET /api/admin/crm/queue/kiosks`

- **Qué hace:** Configuración del turnero. Consulta `kiosks`.
- **Para qué sirve:** RF-CRM-158: Atención de ventanilla sin turnero (registro directo de interacción) desde O2. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.turnero.configurar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CRM-27 (Administración del turnero).
- **Ola:** O3 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1893 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-50-p)

<a id="API-CRM-50-q"></a>
#### API-CRM-50-q · `POST /api/admin/crm/queue/kiosks`

- **Qué hace:** Configuración del turnero. Registra un nuevo elemento u operación en `kiosks`.
- **Para qué sirve:** RF-CRM-158: Atención de ventanilla sin turnero (registro directo de interacción) desde O2. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.turnero.configurar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CRM-27 (Administración del turnero).
- **Ola:** O3 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1893 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-50-q)

<a id="API-CRM-50-r"></a>
#### API-CRM-50-r · `GET /api/admin/crm/queue/kiosks/{id}`

- **Qué hace:** Configuración del turnero. Obtiene el detalle de un registro de `kiosks`.
- **Para qué sirve:** RF-CRM-158: Atención de ventanilla sin turnero (registro directo de interacción) desde O2. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.turnero.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CRM-27 (Administración del turnero).
- **Ola:** O3 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1893 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-50-r)

<a id="API-CRM-50-t"></a>
#### API-CRM-50-t · `DELETE /api/admin/crm/queue/kiosks/{id}`

- **Qué hace:** Configuración del turnero. Elimina o da de baja un registro de `kiosks`.
- **Para qué sirve:** RF-CRM-158: Atención de ventanilla sin turnero (registro directo de interacción) desde O2. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.turnero.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-CRM-27 (Administración del turnero).
- **Ola:** O3 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1893 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-50-t)

<a id="API-CRM-50-s"></a>
#### API-CRM-50-s · `PATCH /api/admin/crm/queue/kiosks/{id}`

- **Qué hace:** Configuración del turnero. Modifica algunos campos de un registro de `kiosks` (solo los enviados).
- **Para qué sirve:** RF-CRM-158: Atención de ventanilla sin turnero (registro directo de interacción) desde O2. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.turnero.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CRM-27 (Administración del turnero).
- **Ola:** O3 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1893 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-50-s)

<a id="API-CRM-50-u"></a>
#### API-CRM-50-u · `GET /api/admin/crm/queue/appointment-slots`

- **Qué hace:** Configuración del turnero. Consulta `appointment-slots`.
- **Para qué sirve:** RF-CRM-158: Atención de ventanilla sin turnero (registro directo de interacción) desde O2. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.turnero.configurar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CRM-27 (Administración del turnero).
- **Ola:** O3 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1893 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-50-u)

<a id="API-CRM-50-v"></a>
#### API-CRM-50-v · `POST /api/admin/crm/queue/appointment-slots`

- **Qué hace:** Configuración del turnero. Registra un nuevo elemento u operación en `appointment-slots`.
- **Para qué sirve:** RF-CRM-158: Atención de ventanilla sin turnero (registro directo de interacción) desde O2. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.turnero.configurar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CRM-27 (Administración del turnero).
- **Ola:** O3 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1893 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-50-v)

<a id="API-CRM-50-w"></a>
#### API-CRM-50-w · `GET /api/admin/crm/queue/appointment-slots/{id}`

- **Qué hace:** Configuración del turnero. Obtiene el detalle de un registro de `appointment-slots`.
- **Para qué sirve:** RF-CRM-158: Atención de ventanilla sin turnero (registro directo de interacción) desde O2. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.turnero.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CRM-27 (Administración del turnero).
- **Ola:** O3 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1893 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-50-w)

<a id="API-CRM-50-y"></a>
#### API-CRM-50-y · `DELETE /api/admin/crm/queue/appointment-slots/{id}`

- **Qué hace:** Configuración del turnero. Elimina o da de baja un registro de `appointment-slots`.
- **Para qué sirve:** RF-CRM-158: Atención de ventanilla sin turnero (registro directo de interacción) desde O2. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.turnero.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-CRM-27 (Administración del turnero).
- **Ola:** O3 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1893 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-50-y)

<a id="API-CRM-50-x"></a>
#### API-CRM-50-x · `PATCH /api/admin/crm/queue/appointment-slots/{id}`

- **Qué hace:** Configuración del turnero. Modifica algunos campos de un registro de `appointment-slots` (solo los enviados).
- **Para qué sirve:** RF-CRM-158: Atención de ventanilla sin turnero (registro directo de interacción) desde O2. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.turnero.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CRM-27 (Administración del turnero).
- **Ola:** O3 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1893 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-50-x)

<a id="API-CRM-51"></a>
#### API-CRM-51 · `GET /api/admin/crm/queue/stream`

- **Qué hace:** Eventos en tiempo real de turnos. Abre un canal en tiempo real (WebSocket) para recibir novedades de `stream`.
- **Para qué sirve:** RF-CRM-052: Tablero operativo del supervisor en tiempo real: casos por estado, SLA en riesgo y vencidos, carga por área y responsable, colas de conversaciones y turnos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.turnero.ver`.
- **Recibe:** nada.
- **Devuelve:** —.
- **Ola:** O3 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1894 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-51)

<a id="API-CRM-52"></a>
#### API-CRM-52 · `GET /api/admin/crm/activities`

- **Qué hace:** Actividades y catálogos. Lista, con filtros y paginación, los registros de actividades internas (`crmActivities`).
- **Para qué sirve:** RF-CRM-223: Rubros de actividades. · RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.actividades.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de actividades internas (`crmActivities`) con `total`.
- **Pantallas:** PAN-CRM-30 (Configuración de actividades).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1895 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-52)

<a id="API-CRM-52-b"></a>
#### API-CRM-52-b · `POST /api/admin/crm/activities`

- **Qué hace:** Actividades y catálogos. Da de alta un registro de actividades internas (`crmActivities`).
- **Para qué sirve:** RF-CRM-223: Rubros de actividades. · RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.actividades.configurar`.
- **Recibe:** los datos de actividades internas (`crmActivities`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de actividades internas (`crmActivities`).
- **Pantallas:** PAN-CRM-30 (Configuración de actividades).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1895 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-52-b)

<a id="API-CRM-52-c"></a>
#### API-CRM-52-c · `GET /api/admin/crm/activities/{id}`

- **Qué hace:** Actividades y catálogos. Obtiene el detalle de un registro de actividades internas (`crmActivities`).
- **Para qué sirve:** RF-CRM-223: Rubros de actividades. · RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.actividades.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de actividades internas (`crmActivities`).
- **Pantallas:** PAN-CRM-30 (Configuración de actividades).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1895 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-52-c)

<a id="API-CRM-52-e"></a>
#### API-CRM-52-e · `DELETE /api/admin/crm/activities/{id}`

- **Qué hace:** Actividades y catálogos. Elimina o da de baja un registro de actividades internas (`crmActivities`).
- **Para qué sirve:** RF-CRM-223: Rubros de actividades. · RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.actividades.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-CRM-30 (Configuración de actividades).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1895 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-52-e)

<a id="API-CRM-52-d"></a>
#### API-CRM-52-d · `PATCH /api/admin/crm/activities/{id}`

- **Qué hace:** Actividades y catálogos. Modifica algunos campos de un registro de actividades internas (`crmActivities`) (solo los enviados).
- **Para qué sirve:** RF-CRM-223: Rubros de actividades. · RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.actividades.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de actividades internas (`crmActivities`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de actividades internas (`crmActivities`).
- **Pantallas:** PAN-CRM-30 (Configuración de actividades).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1895 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-52-d)

<a id="API-CRM-52-f"></a>
#### API-CRM-52-f · `GET /api/admin/crm/activity-types`

- **Qué hace:** Actividades y catálogos. Lista, con filtros y paginación, los registros de tipos de actividad (`crmActivityTypes`).
- **Para qué sirve:** RF-CRM-223: Rubros de actividades. · RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.actividades.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de tipos de actividad (`crmActivityTypes`) con `total`.
- **Pantallas:** PAN-CRM-30 (Configuración de actividades).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1895 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-52-f)

<a id="API-CRM-52-g"></a>
#### API-CRM-52-g · `POST /api/admin/crm/activity-types`

- **Qué hace:** Actividades y catálogos. Da de alta un registro de tipos de actividad (`crmActivityTypes`).
- **Para qué sirve:** RF-CRM-223: Rubros de actividades. · RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.actividades.configurar`.
- **Recibe:** los datos de tipos de actividad (`crmActivityTypes`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de tipos de actividad (`crmActivityTypes`).
- **Pantallas:** PAN-CRM-30 (Configuración de actividades).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1895 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-52-g)

<a id="API-CRM-52-h"></a>
#### API-CRM-52-h · `GET /api/admin/crm/activity-types/{id}`

- **Qué hace:** Actividades y catálogos. Obtiene el detalle de un registro de tipos de actividad (`crmActivityTypes`).
- **Para qué sirve:** RF-CRM-223: Rubros de actividades. · RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.actividades.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de tipos de actividad (`crmActivityTypes`).
- **Pantallas:** PAN-CRM-30 (Configuración de actividades).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1895 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-52-h)

<a id="API-CRM-52-j"></a>
#### API-CRM-52-j · `DELETE /api/admin/crm/activity-types/{id}`

- **Qué hace:** Actividades y catálogos. Elimina o da de baja un registro de tipos de actividad (`crmActivityTypes`).
- **Para qué sirve:** RF-CRM-223: Rubros de actividades. · RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.actividades.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-CRM-30 (Configuración de actividades).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1895 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-52-j)

<a id="API-CRM-52-i"></a>
#### API-CRM-52-i · `PATCH /api/admin/crm/activity-types/{id}`

- **Qué hace:** Actividades y catálogos. Modifica algunos campos de un registro de tipos de actividad (`crmActivityTypes`) (solo los enviados).
- **Para qué sirve:** RF-CRM-223: Rubros de actividades. · RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.actividades.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de tipos de actividad (`crmActivityTypes`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de tipos de actividad (`crmActivityTypes`).
- **Pantallas:** PAN-CRM-30 (Configuración de actividades).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1895 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-52-i)

<a id="API-CRM-52-k"></a>
#### API-CRM-52-k · `GET /api/admin/crm/activity-frequencies`

- **Qué hace:** Actividades y catálogos. Lista, con filtros y paginación, los registros de frecuencias de actividades internas (`crmActivityFrequencies`).
- **Para qué sirve:** RF-CRM-221: Tipos de actividad con área, márgenes de aviso anterior y posterior, frecuencia, plantilla de planilla y días de envío. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.actividades.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de frecuencias de actividades internas (`crmActivityFrequencies`) con `total`.
- **Pantallas:** PAN-CRM-30 (Configuración de actividades).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1895 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-52-k)

<a id="API-CRM-52-l"></a>
#### API-CRM-52-l · `POST /api/admin/crm/activity-frequencies`

- **Qué hace:** Actividades y catálogos. Da de alta un registro de frecuencias de actividades internas (`crmActivityFrequencies`).
- **Para qué sirve:** RF-CRM-221: Tipos de actividad con área, márgenes de aviso anterior y posterior, frecuencia, plantilla de planilla y días de envío. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.actividades.configurar`.
- **Recibe:** los datos de frecuencias de actividades internas (`crmActivityFrequencies`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de frecuencias de actividades internas (`crmActivityFrequencies`).
- **Pantallas:** PAN-CRM-30 (Configuración de actividades).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1895 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-52-l)

<a id="API-CRM-52-m"></a>
#### API-CRM-52-m · `GET /api/admin/crm/activity-frequencies/{id}`

- **Qué hace:** Actividades y catálogos. Obtiene el detalle de un registro de frecuencias de actividades internas (`crmActivityFrequencies`).
- **Para qué sirve:** RF-CRM-221: Tipos de actividad con área, márgenes de aviso anterior y posterior, frecuencia, plantilla de planilla y días de envío. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.actividades.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de frecuencias de actividades internas (`crmActivityFrequencies`).
- **Pantallas:** PAN-CRM-30 (Configuración de actividades).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1895 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-52-m)

<a id="API-CRM-52-o"></a>
#### API-CRM-52-o · `DELETE /api/admin/crm/activity-frequencies/{id}`

- **Qué hace:** Actividades y catálogos. Elimina o da de baja un registro de frecuencias de actividades internas (`crmActivityFrequencies`).
- **Para qué sirve:** RF-CRM-221: Tipos de actividad con área, márgenes de aviso anterior y posterior, frecuencia, plantilla de planilla y días de envío. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.actividades.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-CRM-30 (Configuración de actividades).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1895 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-52-o)

<a id="API-CRM-52-n"></a>
#### API-CRM-52-n · `PATCH /api/admin/crm/activity-frequencies/{id}`

- **Qué hace:** Actividades y catálogos. Modifica algunos campos de un registro de frecuencias de actividades internas (`crmActivityFrequencies`) (solo los enviados).
- **Para qué sirve:** RF-CRM-221: Tipos de actividad con área, márgenes de aviso anterior y posterior, frecuencia, plantilla de planilla y días de envío. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.actividades.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de frecuencias de actividades internas (`crmActivityFrequencies`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de frecuencias de actividades internas (`crmActivityFrequencies`).
- **Pantallas:** PAN-CRM-30 (Configuración de actividades).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1895 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-52-n)

<a id="API-CRM-52-p"></a>
#### API-CRM-52-p · `GET /api/admin/crm/activity-rubros`

- **Qué hace:** Actividades y catálogos. Lista, con filtros y paginación, los registros de rubros de actividades (`crmActivityRubros`).
- **Para qué sirve:** RF-CRM-223: Rubros de actividades. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.actividades.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de rubros de actividades (`crmActivityRubros`) con `total`.
- **Pantallas:** PAN-CRM-30 (Configuración de actividades).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1895 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-52-p)

<a id="API-CRM-52-q"></a>
#### API-CRM-52-q · `POST /api/admin/crm/activity-rubros`

- **Qué hace:** Actividades y catálogos. Da de alta un registro de rubros de actividades (`crmActivityRubros`).
- **Para qué sirve:** RF-CRM-223: Rubros de actividades. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.actividades.configurar`.
- **Recibe:** los datos de rubros de actividades (`crmActivityRubros`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de rubros de actividades (`crmActivityRubros`).
- **Pantallas:** PAN-CRM-30 (Configuración de actividades).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1895 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-52-q)

<a id="API-CRM-52-r"></a>
#### API-CRM-52-r · `GET /api/admin/crm/activity-rubros/{id}`

- **Qué hace:** Actividades y catálogos. Obtiene el detalle de un registro de rubros de actividades (`crmActivityRubros`).
- **Para qué sirve:** RF-CRM-223: Rubros de actividades. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.actividades.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de rubros de actividades (`crmActivityRubros`).
- **Pantallas:** PAN-CRM-30 (Configuración de actividades).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1895 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-52-r)

<a id="API-CRM-52-t"></a>
#### API-CRM-52-t · `DELETE /api/admin/crm/activity-rubros/{id}`

- **Qué hace:** Actividades y catálogos. Elimina o da de baja un registro de rubros de actividades (`crmActivityRubros`).
- **Para qué sirve:** RF-CRM-223: Rubros de actividades. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.actividades.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-CRM-30 (Configuración de actividades).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1895 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-52-t)

<a id="API-CRM-52-s"></a>
#### API-CRM-52-s · `PATCH /api/admin/crm/activity-rubros/{id}`

- **Qué hace:** Actividades y catálogos. Modifica algunos campos de un registro de rubros de actividades (`crmActivityRubros`) (solo los enviados).
- **Para qué sirve:** RF-CRM-223: Rubros de actividades. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.actividades.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de rubros de actividades (`crmActivityRubros`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de rubros de actividades (`crmActivityRubros`).
- **Pantallas:** PAN-CRM-30 (Configuración de actividades).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1895 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-52-s)

<a id="API-CRM-53"></a>
#### API-CRM-53 · `GET /api/admin/crm/activity-occurrences`

- **Qué hace:** Seguimiento. Lista, con filtros y paginación, los registros de ocurrencias de actividades (`crmActivityOccurrences`).
- **Para qué sirve:** RF-CRM-237: Informe de seguimiento de actividades por estado, área, responsable y período. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.actividades.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ocurrencias de actividades (`crmActivityOccurrences`) con `total`.
- **Pantallas:** PAN-CRM-29 (Seguimiento de actividades), PAN-CRM-31 (Calendario interno), PAN-CRM-36 (Mis actividades).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1896 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-53)

<a id="API-CRM-54"></a>
#### API-CRM-54 · `POST /api/admin/crm/activity-occurrences/{id}/close`

- **Qué hace:** Cierre, aprobación, anulación. Cierra un registro de ocurrencias de actividades (`crmActivityOccurrences`).
- **Para qué sirve:** RF-CRM-229: Cierre de ocurrencia con observación, revisión, evidencia adjunta, responsable de cierre, usuario y fecha real de cierre; aprobación opcional. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.actividades.cerrar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1897 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-54)

<a id="API-CRM-54-b"></a>
#### API-CRM-54-b · `POST /api/admin/crm/activity-occurrences/{id}/approve`

- **Qué hace:** Cierre, aprobación, anulación. Aprueba un registro de ocurrencias de actividades (`crmActivityOccurrences`).
- **Para qué sirve:** RF-CRM-229: Cierre de ocurrencia con observación, revisión, evidencia adjunta, responsable de cierre, usuario y fecha real de cierre; aprobación opcional. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.actividades.cerrar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1897 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-54-b)

<a id="API-CRM-54-c"></a>
#### API-CRM-54-c · `POST /api/admin/crm/activity-occurrences/{id}/void`

- **Qué hace:** Cierre, aprobación, anulación. Anula un registro de ocurrencias de actividades (`crmActivityOccurrences`).
- **Para qué sirve:** RF-CRM-229: Cierre de ocurrencia con observación, revisión, evidencia adjunta, responsable de cierre, usuario y fecha real de cierre; aprobación opcional. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.actividades.cerrar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1897 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-54-c)

<a id="API-CRM-54-d"></a>
#### API-CRM-54-d · `POST /api/admin/crm/activity-occurrences/{id}/reopen`

- **Qué hace:** Cierre, aprobación, anulación. Reabre un registro de ocurrencias de actividades (`crmActivityOccurrences`).
- **Para qué sirve:** RF-CRM-229: Cierre de ocurrencia con observación, revisión, evidencia adjunta, responsable de cierre, usuario y fecha real de cierre; aprobación opcional. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.actividades.cerrar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1897 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-54-d)

<a id="API-CRM-55"></a>
#### API-CRM-55 · `GET /api/admin/crm/activity-occurrences/{id}/sheet.pdf`

- **Qué hace:** Planilla imprimible. Descarga un archivo de ocurrencias de actividades (`crmActivityOccurrences`).
- **Para qué sirve:** RF-CRM-231: Planilla imprimible por plantilla del tipo o predeterminada, con estado impreso (Pendiente, Cerrada con revisión, Cerrada). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.actividades.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un archivo (application/pdf).
- **Pantallas:** PAN-CRM-29 (Seguimiento de actividades), PAN-CRM-31 (Calendario interno), PAN-CRM-36 (Mis actividades).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1898 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-55)

<a id="API-CRM-56"></a>
#### API-CRM-56 · `GET /api/admin/crm/calendar/events`

- **Qué hace:** Calendario interno. Lista, con filtros y paginación, los registros de historial inmutable del caso (`crmCaseEvents`).
- **Para qué sirve:** RF-CRM-235: Calendario interno de usuarios: eventos, todo el día, recurrencias, recordatorios, ubicación, etiqueta, tipos con color. · RF-CRM-226: Cita en el calendario interno del responsable por cada ocurrencia, con vencimiento = fecha + margen posterior. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.actividades.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de historial inmutable del caso (`crmCaseEvents`) con `total`.
- **Pantallas:** PAN-CRM-29 (Seguimiento de actividades), PAN-CRM-31 (Calendario interno), PAN-CRM-36 (Mis actividades).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1899 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-56)

<a id="API-CRM-56-b"></a>
#### API-CRM-56-b · `POST /api/admin/crm/calendar/events`

- **Qué hace:** Calendario interno. Da de alta un registro de historial inmutable del caso (`crmCaseEvents`).
- **Para qué sirve:** RF-CRM-235: Calendario interno de usuarios: eventos, todo el día, recurrencias, recordatorios, ubicación, etiqueta, tipos con color. · RF-CRM-226: Cita en el calendario interno del responsable por cada ocurrencia, con vencimiento = fecha + margen posterior. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.actividades.ver`.
- **Recibe:** los datos de historial inmutable del caso (`crmCaseEvents`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de historial inmutable del caso (`crmCaseEvents`).
- **Pantallas:** PAN-CRM-29 (Seguimiento de actividades), PAN-CRM-31 (Calendario interno), PAN-CRM-36 (Mis actividades).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1899 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-56-b)

<a id="API-CRM-56-c"></a>
#### API-CRM-56-c · `GET /api/admin/crm/calendar/events/{id}`

- **Qué hace:** Calendario interno. Obtiene el detalle de un registro de historial inmutable del caso (`crmCaseEvents`).
- **Para qué sirve:** RF-CRM-235: Calendario interno de usuarios: eventos, todo el día, recurrencias, recordatorios, ubicación, etiqueta, tipos con color. · RF-CRM-226: Cita en el calendario interno del responsable por cada ocurrencia, con vencimiento = fecha + margen posterior. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.actividades.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de historial inmutable del caso (`crmCaseEvents`).
- **Pantallas:** PAN-CRM-29 (Seguimiento de actividades), PAN-CRM-31 (Calendario interno), PAN-CRM-36 (Mis actividades).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1899 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-56-c)

<a id="API-CRM-56-e"></a>
#### API-CRM-56-e · `DELETE /api/admin/crm/calendar/events/{id}`

- **Qué hace:** Calendario interno. Elimina o da de baja un registro de historial inmutable del caso (`crmCaseEvents`).
- **Para qué sirve:** RF-CRM-235: Calendario interno de usuarios: eventos, todo el día, recurrencias, recordatorios, ubicación, etiqueta, tipos con color. · RF-CRM-226: Cita en el calendario interno del responsable por cada ocurrencia, con vencimiento = fecha + margen posterior. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.actividades.ver`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-CRM-29 (Seguimiento de actividades), PAN-CRM-31 (Calendario interno), PAN-CRM-36 (Mis actividades).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1899 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-56-e)

<a id="API-CRM-56-d"></a>
#### API-CRM-56-d · `PATCH /api/admin/crm/calendar/events/{id}`

- **Qué hace:** Calendario interno. Modifica algunos campos de un registro de historial inmutable del caso (`crmCaseEvents`) (solo los enviados).
- **Para qué sirve:** RF-CRM-235: Calendario interno de usuarios: eventos, todo el día, recurrencias, recordatorios, ubicación, etiqueta, tipos con color. · RF-CRM-226: Cita en el calendario interno del responsable por cada ocurrencia, con vencimiento = fecha + margen posterior. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.actividades.ver`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de historial inmutable del caso (`crmCaseEvents`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de historial inmutable del caso (`crmCaseEvents`).
- **Pantallas:** PAN-CRM-29 (Seguimiento de actividades), PAN-CRM-31 (Calendario interno), PAN-CRM-36 (Mis actividades).
- **Ola:** O2 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1899 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-56-d)

<a id="API-CRM-56-f"></a>
#### API-CRM-56-f · `GET /api/admin/crm/calendar/event-types`

- **Qué hace:** Calendario interno. Lista, con filtros y paginación, los registros de tipos de evento de calendario (`crmCalendarEventTypes`).
- **Para qué sirve:** RF-CRM-235: Calendario interno de usuarios: eventos, todo el día, recurrencias, recordatorios, ubicación, etiqueta, tipos con color. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.actividades.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de tipos de evento de calendario (`crmCalendarEventTypes`) con `total`.
- **Pantallas:** PAN-CRM-29 (Seguimiento de actividades), PAN-CRM-31 (Calendario interno), PAN-CRM-36 (Mis actividades).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1899 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-56-f)

<a id="API-CRM-56-g"></a>
#### API-CRM-56-g · `POST /api/admin/crm/calendar/event-types`

- **Qué hace:** Calendario interno. Da de alta un registro de tipos de evento de calendario (`crmCalendarEventTypes`).
- **Para qué sirve:** RF-CRM-235: Calendario interno de usuarios: eventos, todo el día, recurrencias, recordatorios, ubicación, etiqueta, tipos con color. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.actividades.ver`.
- **Recibe:** los datos de tipos de evento de calendario (`crmCalendarEventTypes`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de tipos de evento de calendario (`crmCalendarEventTypes`).
- **Pantallas:** PAN-CRM-29 (Seguimiento de actividades), PAN-CRM-31 (Calendario interno), PAN-CRM-36 (Mis actividades).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1899 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-56-g)

<a id="API-CRM-56-h"></a>
#### API-CRM-56-h · `GET /api/admin/crm/calendar/event-types/{id}`

- **Qué hace:** Calendario interno. Obtiene el detalle de un registro de tipos de evento de calendario (`crmCalendarEventTypes`).
- **Para qué sirve:** RF-CRM-235: Calendario interno de usuarios: eventos, todo el día, recurrencias, recordatorios, ubicación, etiqueta, tipos con color. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.actividades.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de tipos de evento de calendario (`crmCalendarEventTypes`).
- **Pantallas:** PAN-CRM-29 (Seguimiento de actividades), PAN-CRM-31 (Calendario interno), PAN-CRM-36 (Mis actividades).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1899 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-56-h)

<a id="API-CRM-56-j"></a>
#### API-CRM-56-j · `DELETE /api/admin/crm/calendar/event-types/{id}`

- **Qué hace:** Calendario interno. Elimina o da de baja un registro de tipos de evento de calendario (`crmCalendarEventTypes`).
- **Para qué sirve:** RF-CRM-235: Calendario interno de usuarios: eventos, todo el día, recurrencias, recordatorios, ubicación, etiqueta, tipos con color. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.actividades.ver`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-CRM-29 (Seguimiento de actividades), PAN-CRM-31 (Calendario interno), PAN-CRM-36 (Mis actividades).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1899 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-56-j)

<a id="API-CRM-56-i"></a>
#### API-CRM-56-i · `PATCH /api/admin/crm/calendar/event-types/{id}`

- **Qué hace:** Calendario interno. Modifica algunos campos de un registro de tipos de evento de calendario (`crmCalendarEventTypes`) (solo los enviados).
- **Para qué sirve:** RF-CRM-235: Calendario interno de usuarios: eventos, todo el día, recurrencias, recordatorios, ubicación, etiqueta, tipos con color. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.actividades.ver`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de tipos de evento de calendario (`crmCalendarEventTypes`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de tipos de evento de calendario (`crmCalendarEventTypes`).
- **Pantallas:** PAN-CRM-29 (Seguimiento de actividades), PAN-CRM-31 (Calendario interno), PAN-CRM-36 (Mis actividades).
- **Ola:** O10 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1899 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-56-i)

<a id="API-CRM-57"></a>
#### API-CRM-57 · `GET /api/admin/crm/circulars`

- **Qué hace:** Modelos de circular. Lista, con filtros y paginación, los registros de modelos de circular (`crmCirculars`).
- **Para qué sirve:** RF-CRM-250: Modelos de circular con texto, tipo y mínimo de deuda, filtro de adheridos, firmas (gerente, auditor), detalle de servicios, servicio, envío SMS y plantilla. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.circulares.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de modelos de circular (`crmCirculars`) con `total`.
- **Ola:** O6 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1900 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-57)

<a id="API-CRM-57-b"></a>
#### API-CRM-57-b · `POST /api/admin/crm/circulars`

- **Qué hace:** Modelos de circular. Da de alta un registro de modelos de circular (`crmCirculars`).
- **Para qué sirve:** RF-CRM-250: Modelos de circular con texto, tipo y mínimo de deuda, filtro de adheridos, firmas (gerente, auditor), detalle de servicios, servicio, envío SMS y plantilla. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.circulares.configurar`.
- **Recibe:** los datos de modelos de circular (`crmCirculars`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de modelos de circular (`crmCirculars`).
- **Ola:** O6 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1900 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-57-b)

<a id="API-CRM-57-c"></a>
#### API-CRM-57-c · `GET /api/admin/crm/circulars/{id}`

- **Qué hace:** Modelos de circular. Obtiene el detalle de un registro de modelos de circular (`crmCirculars`).
- **Para qué sirve:** RF-CRM-250: Modelos de circular con texto, tipo y mínimo de deuda, filtro de adheridos, firmas (gerente, auditor), detalle de servicios, servicio, envío SMS y plantilla. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.circulares.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de modelos de circular (`crmCirculars`).
- **Ola:** O6 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1900 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-57-c)

<a id="API-CRM-57-e"></a>
#### API-CRM-57-e · `DELETE /api/admin/crm/circulars/{id}`

- **Qué hace:** Modelos de circular. Elimina o da de baja un registro de modelos de circular (`crmCirculars`).
- **Para qué sirve:** RF-CRM-250: Modelos de circular con texto, tipo y mínimo de deuda, filtro de adheridos, firmas (gerente, auditor), detalle de servicios, servicio, envío SMS y plantilla. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.circulares.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O6 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1900 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-57-e)

<a id="API-CRM-57-d"></a>
#### API-CRM-57-d · `PATCH /api/admin/crm/circulars/{id}`

- **Qué hace:** Modelos de circular. Modifica algunos campos de un registro de modelos de circular (`crmCirculars`) (solo los enviados).
- **Para qué sirve:** RF-CRM-250: Modelos de circular con texto, tipo y mínimo de deuda, filtro de adheridos, firmas (gerente, auditor), detalle de servicios, servicio, envío SMS y plantilla. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.circulares.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de modelos de circular (`crmCirculars`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de modelos de circular (`crmCirculars`).
- **Ola:** O6 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1900 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-57-d)

<a id="API-CRM-58"></a>
#### API-CRM-58 · `POST /api/admin/crm/circulars/{id}/runs`

- **Qué hace:** Corridas de circulares. Da de alta un registro de corridas de circulares (`crmCircularRuns`).
- **Para qué sirve:** RF-CRM-251: Generar circulares sobre un universo filtrado (titulares, cuentas, servicios, deudas, mora) con el motor de audiencia de T09, por impresión, email, SMS o WhatsApp. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.circulares.generar`.
- **Recibe:** en la ruta `id`; los datos de corridas de circulares (`crmCircularRuns`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de corridas de circulares (`crmCircularRuns`).
- **Ola:** O6 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1901 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-58)

<a id="API-CRM-58-b"></a>
#### API-CRM-58-b · `POST /api/admin/crm/circulars/{id}/runs/{runId}/approve`

- **Qué hace:** Corridas de circulares. Aprueba un registro de corridas de circulares (`crmCircularRuns`).
- **Para qué sirve:** RF-CRM-251: Generar circulares sobre un universo filtrado (titulares, cuentas, servicios, deudas, mora) con el motor de audiencia de T09, por impresión, email, SMS o WhatsApp. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.circulares.generar`.
- **Recibe:** en la ruta `id`, `runId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O6 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1901 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-58-b)

<a id="API-CRM-58-c"></a>
#### API-CRM-58-c · `POST /api/admin/crm/circulars/{id}/runs/{runId}/generate`

- **Qué hace:** Corridas de circulares. Genera un registro de corridas de circulares (`crmCircularRuns`).
- **Para qué sirve:** RF-CRM-251: Generar circulares sobre un universo filtrado (titulares, cuentas, servicios, deudas, mora) con el motor de audiencia de T09, por impresión, email, SMS o WhatsApp. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.circulares.generar`.
- **Recibe:** en la ruta `id`, `runId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O6 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1901 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-58-c)

<a id="API-CRM-58-d"></a>
#### API-CRM-58-d · `POST /api/admin/crm/circulars/{id}/runs/{runId}/cancel`

- **Qué hace:** Corridas de circulares. Cancela un registro de corridas de circulares (`crmCircularRuns`).
- **Para qué sirve:** RF-CRM-251: Generar circulares sobre un universo filtrado (titulares, cuentas, servicios, deudas, mora) con el motor de audiencia de T09, por impresión, email, SMS o WhatsApp. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.circulares.generar`.
- **Recibe:** en la ruta `id`, `runId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O6 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1901 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-58-d)

<a id="API-CRM-59"></a>
#### API-CRM-59 · `GET /api/admin/crm/reports/{reportCode}`

- **Qué hace:** Reportes del §15 (con export) Obtiene el detalle de un registro de `reports`.
- **Para qué sirve:** RF-CRM-045: Exportar bandejas a XLSX/CSV/PDF según capability. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.reportes.ver`.
- **Recibe:** en la ruta `reportCode`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CRM-28 (Estadísticas del turnero), PAN-CRM-34 (Sala BI de atención y reclamos).
- **Ola:** O3 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1902 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-59)

<a id="API-CRM-60"></a>
#### API-CRM-60 · `GET /api/admin/crm/dashboard`

- **Qué hace:** Tablero operativo. Lista, con filtros y paginación, los registros de `dashboard`.
- **Para qué sirve:** RF-CRM-052: Tablero operativo del supervisor en tiempo real: casos por estado, SLA en riesgo y vencidos, carga por área y responsable, colas de conversaciones y turnos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `crm.bandejaSupervision.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ResultadoGenerico (`ResultadoGenerico`) con `total`.
- **Pantallas:** PAN-CRM-01 (Bandeja de supervisión), PAN-CRM-33 (Informes de atención).
- **Ola:** O3 · **Fuente:** M09 §11.1 Admin (`/api/admin/crm/...`), línea 1903 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Admin%20%28%60%2Fapi%2Fadmin%2Fcrm%2F...%60%29/API-CRM-60)

<a id="grupo-2"></a>

## Socio (`/api/crm/...`, consumidos por M19)

18 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-CRM-61](#API-CRM-61) | GET | `/api/crm/my/cases` | Mis gestiones. |
| [API-CRM-62](#API-CRM-62) | POST | `/api/crm/my/cases` | Nueva gestión (reclamo, consulta, solicitud) |
| [API-CRM-63](#API-CRM-63) | GET | `/api/crm/my/cases/{id}` | Detalle (sin notas internas) |
| [API-CRM-64](#API-CRM-64) | POST | `/api/crm/my/cases/{id}/messages` | Responder/adjuntar. |
| [API-CRM-65](#API-CRM-65) | POST | `/api/crm/my/cases/{id}/cancel` | Desistir, confirmar o rechazar resolución, reabrir. |
| [API-CRM-65-b](#API-CRM-65-b) | POST | `/api/crm/my/cases/{id}/confirm-resolution` | Desistir, confirmar o rechazar resolución, reabrir. |
| [API-CRM-65-c](#API-CRM-65-c) | POST | `/api/crm/my/cases/{id}/reopen` | Desistir, confirmar o rechazar resolución, reabrir. |
| [API-CRM-66](#API-CRM-66) | GET | `/api/crm/my/request-options` | Servicios disponibles/contratados y tipos de solicitud habilitados con requisitos, modalidades y costos. |
| [API-CRM-67](#API-CRM-67) | POST | `/api/crm/my/requests/quote` | Cotización informativa (cambio de plan, reactivación arancelada) vía M04. |
| [API-CRM-68](#API-CRM-68) | GET | `/api/crm/my/cases/{id}/receipt.pdf` | Constancia. |
| [API-CRM-69](#API-CRM-69) | POST | `/api/crm/ai/draft` | Asistencia IA para redactar la gestión. |
| [API-CRM-70](#API-CRM-70) | GET | `/api/crm/my/queue/tickets` | Fila virtual y reservas. |
| [API-CRM-70-b](#API-CRM-70-b) | POST | `/api/crm/my/queue/tickets` | Fila virtual y reservas. |
| [API-CRM-70-c](#API-CRM-70-c) | GET | `/api/crm/my/queue/appointments` | Fila virtual y reservas. |
| [API-CRM-70-d](#API-CRM-70-d) | POST | `/api/crm/my/queue/appointments` | Fila virtual y reservas. |
| [API-CRM-70-e](#API-CRM-70-e) | POST | `/api/crm/my/queue/appointments/{id}/cancel` | Fila virtual y reservas. |
| [API-CRM-70-f](#API-CRM-70-f) | GET | `/api/crm/my/queue/slots` | Fila virtual y reservas. |
| [API-CRM-70-g](#API-CRM-70-g) | POST | `/api/crm/my/queue/slots` | Fila virtual y reservas. |

<a id="API-CRM-61"></a>
#### API-CRM-61 · `GET /api/crm/my/cases`

- **Qué hace:** Mis gestiones. Lista, con filtros y paginación, los registros de expediente único de gestión (`crmCases`).
- **Para qué sirve:** RF-CRM-001: Crear casos con número de seguimiento único por tenant, visible al socio y al personal. · RF-CRM-037: Endpoints de autogestión del socio: listar sus casos, ver detalle, mensajes visibles, responder, adjuntar, cancelar, ver constancias (consumidos por M19). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `crm.misCasos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de expediente único de gestión (`crmCases`) con `total`.
- **Ola:** O2 · **Fuente:** M09 §11.2 Socio (`/api/crm/...`, consumidos por M19), línea 1909 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Socio%20%28%60%2Fapi%2Fcrm%2F...%60%2C%20consumidos%20por%20M19%29/API-CRM-61)

<a id="API-CRM-62"></a>
#### API-CRM-62 · `POST /api/crm/my/cases`

- **Qué hace:** Nueva gestión (reclamo, consulta, solicitud) Da de alta un registro de expediente único de gestión (`crmCases`).
- **Para qué sirve:** RF-CRM-001: Crear casos con número de seguimiento único por tenant, visible al socio y al personal. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `crm.misCasos.crear`.
- **Recibe:** los datos de expediente único de gestión (`crmCases`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de expediente único de gestión (`crmCases`).
- **Ola:** O2 · **Fuente:** M09 §11.2 Socio (`/api/crm/...`, consumidos por M19), línea 1910 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Socio%20%28%60%2Fapi%2Fcrm%2F...%60%2C%20consumidos%20por%20M19%29/API-CRM-62)

<a id="API-CRM-63"></a>
#### API-CRM-63 · `GET /api/crm/my/cases/{id}`

- **Qué hace:** Detalle (sin notas internas) Obtiene el detalle de un registro de expediente único de gestión (`crmCases`).
- **Para qué sirve:** RF-CRM-037: Endpoints de autogestión del socio: listar sus casos, ver detalle, mensajes visibles, responder, adjuntar, cancelar, ver constancias (consumidos por M19). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `crm.misCasos.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de expediente único de gestión (`crmCases`).
- **Ola:** O2 · **Fuente:** M09 §11.2 Socio (`/api/crm/...`, consumidos por M19), línea 1911 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Socio%20%28%60%2Fapi%2Fcrm%2F...%60%2C%20consumidos%20por%20M19%29/API-CRM-63)

<a id="API-CRM-64"></a>
#### API-CRM-64 · `POST /api/crm/my/cases/{id}/messages`

- **Qué hace:** Responder/adjuntar. Da de alta un registro de mensajes y notas (`crmMessages`).
- **Para qué sirve:** RF-CRM-037: Endpoints de autogestión del socio: listar sus casos, ver detalle, mensajes visibles, responder, adjuntar, cancelar, ver constancias (consumidos por M19). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `crm.misCasos.responder`.
- **Recibe:** en la ruta `id`; los datos de mensajes y notas (`crmMessages`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de mensajes y notas (`crmMessages`).
- **Ola:** O2 · **Fuente:** M09 §11.2 Socio (`/api/crm/...`, consumidos por M19), línea 1912 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Socio%20%28%60%2Fapi%2Fcrm%2F...%60%2C%20consumidos%20por%20M19%29/API-CRM-64)

<a id="API-CRM-65"></a>
#### API-CRM-65 · `POST /api/crm/my/cases/{id}/cancel`

- **Qué hace:** Desistir, confirmar o rechazar resolución, reabrir. Cancela un registro de expediente único de gestión (`crmCases`).
- **Para qué sirve:** RF-CRM-034: Cancelar/desistir con motivo, registrando fecha y usuario; avisar al creador si cancela otro; resolver el presupuesto vinculado (rechazado o anulado) vía M11. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `crm.misCasos.cancelar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M09 §11.2 Socio (`/api/crm/...`, consumidos por M19), línea 1913 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Socio%20%28%60%2Fapi%2Fcrm%2F...%60%2C%20consumidos%20por%20M19%29/API-CRM-65)

<a id="API-CRM-65-b"></a>
#### API-CRM-65-b · `POST /api/crm/my/cases/{id}/confirm-resolution`

- **Qué hace:** Desistir, confirmar o rechazar resolución, reabrir. Confirma la resolución de un registro de expediente único de gestión (`crmCases`).
- **Para qué sirve:** RF-CRM-034: Cancelar/desistir con motivo, registrando fecha y usuario; avisar al creador si cancela otro; resolver el presupuesto vinculado (rechazado o anulado) vía M11. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `crm.misCasos.cancelar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M09 §11.2 Socio (`/api/crm/...`, consumidos por M19), línea 1913 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Socio%20%28%60%2Fapi%2Fcrm%2F...%60%2C%20consumidos%20por%20M19%29/API-CRM-65-b)

<a id="API-CRM-65-c"></a>
#### API-CRM-65-c · `POST /api/crm/my/cases/{id}/reopen`

- **Qué hace:** Desistir, confirmar o rechazar resolución, reabrir. Reabre un registro de expediente único de gestión (`crmCases`).
- **Para qué sirve:** RF-CRM-034: Cancelar/desistir con motivo, registrando fecha y usuario; avisar al creador si cancela otro; resolver el presupuesto vinculado (rechazado o anulado) vía M11. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `crm.misCasos.cancelar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M09 §11.2 Socio (`/api/crm/...`, consumidos por M19), línea 1913 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Socio%20%28%60%2Fapi%2Fcrm%2F...%60%2C%20consumidos%20por%20M19%29/API-CRM-65-c)

<a id="API-CRM-66"></a>
#### API-CRM-66 · `GET /api/crm/my/request-options`

- **Qué hace:** Servicios disponibles/contratados y tipos de solicitud habilitados con requisitos, modalidades y costos. Consulta `request-options`.
- **Para qué sirve:** RF-CRM-062: Consultar servicios disponibles y contratados antes de solicitar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `crm.misCasos.crear`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M09 §11.2 Socio (`/api/crm/...`, consumidos por M19), línea 1914 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Socio%20%28%60%2Fapi%2Fcrm%2F...%60%2C%20consumidos%20por%20M19%29/API-CRM-66)

<a id="API-CRM-67"></a>
#### API-CRM-67 · `POST /api/crm/my/requests/quote`

- **Qué hace:** Cotización informativa (cambio de plan, reactivación arancelada) vía M04. Cotiza sobre comandos a módulos dueños (`crmCommandRequests`).
- **Para qué sirve:** RF-CRM-072: Solicitud de cambio de plan o categoría, con cotización informativa y proporcional calculado por M04/M05. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `crm.misCasos.crear`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M09 §11.2 Socio (`/api/crm/...`, consumidos por M19), línea 1915 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Socio%20%28%60%2Fapi%2Fcrm%2F...%60%2C%20consumidos%20por%20M19%29/API-CRM-67)

<a id="API-CRM-68"></a>
#### API-CRM-68 · `GET /api/crm/my/cases/{id}/receipt.pdf`

- **Qué hace:** Constancia. Descarga un archivo de expediente único de gestión (`crmCases`).
- **Para qué sirve:** RF-CRM-037: Endpoints de autogestión del socio: listar sus casos, ver detalle, mensajes visibles, responder, adjuntar, cancelar, ver constancias (consumidos por M19). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `crm.misCasos.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un archivo (application/pdf).
- **Ola:** O2 · **Fuente:** M09 §11.2 Socio (`/api/crm/...`, consumidos por M19), línea 1916 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Socio%20%28%60%2Fapi%2Fcrm%2F...%60%2C%20consumidos%20por%20M19%29/API-CRM-68)

<a id="API-CRM-69"></a>
#### API-CRM-69 · `POST /api/crm/ai/draft`

- **Qué hace:** Asistencia IA para redactar la gestión. Registra un nuevo elemento u operación en `draft`.
- **Para qué sirve:** RF-CRM-204: Asistencia al socio para redactar su gestión (propuesta revisable por el socio). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `crm.misCasos.crear`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O6 · **Fuente:** M09 §11.2 Socio (`/api/crm/...`, consumidos por M19), línea 1917 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Socio%20%28%60%2Fapi%2Fcrm%2F...%60%2C%20consumidos%20por%20M19%29/API-CRM-69)

<a id="API-CRM-70"></a>
#### API-CRM-70 · `GET /api/crm/my/queue/tickets`

- **Qué hace:** Fila virtual y reservas. Lista, con filtros y paginación, los registros de turnos del turnero (`crmQueueTickets`).
- **Para qué sirve:** RF-CRM-151: Turno remoto (fila virtual) desde portal, app o WhatsApp, con aviso cuando se acerca el llamado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `crm.turnos.reservar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de turnos del turnero (`crmQueueTickets`) con `total`.
- **Ola:** O10 · **Fuente:** M09 §11.2 Socio (`/api/crm/...`, consumidos por M19), línea 1918 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Socio%20%28%60%2Fapi%2Fcrm%2F...%60%2C%20consumidos%20por%20M19%29/API-CRM-70)

<a id="API-CRM-70-b"></a>
#### API-CRM-70-b · `POST /api/crm/my/queue/tickets`

- **Qué hace:** Fila virtual y reservas. Da de alta un registro de turnos del turnero (`crmQueueTickets`).
- **Para qué sirve:** RF-CRM-151: Turno remoto (fila virtual) desde portal, app o WhatsApp, con aviso cuando se acerca el llamado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `crm.turnos.reservar`.
- **Recibe:** los datos de turnos del turnero (`crmQueueTickets`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de turnos del turnero (`crmQueueTickets`).
- **Ola:** O10 · **Fuente:** M09 §11.2 Socio (`/api/crm/...`, consumidos por M19), línea 1918 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Socio%20%28%60%2Fapi%2Fcrm%2F...%60%2C%20consumidos%20por%20M19%29/API-CRM-70-b)

<a id="API-CRM-70-c"></a>
#### API-CRM-70-c · `GET /api/crm/my/queue/appointments`

- **Qué hace:** Fila virtual y reservas. Lista, con filtros y paginación, los registros de reservas de turno (`crmQueueAppointments`).
- **Para qué sirve:** RF-CRM-151: Turno remoto (fila virtual) desde portal, app o WhatsApp, con aviso cuando se acerca el llamado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `crm.turnos.reservar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de reservas de turno (`crmQueueAppointments`) con `total`.
- **Ola:** O10 · **Fuente:** M09 §11.2 Socio (`/api/crm/...`, consumidos por M19), línea 1918 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Socio%20%28%60%2Fapi%2Fcrm%2F...%60%2C%20consumidos%20por%20M19%29/API-CRM-70-c)

<a id="API-CRM-70-d"></a>
#### API-CRM-70-d · `POST /api/crm/my/queue/appointments`

- **Qué hace:** Fila virtual y reservas. Da de alta un registro de reservas de turno (`crmQueueAppointments`).
- **Para qué sirve:** RF-CRM-151: Turno remoto (fila virtual) desde portal, app o WhatsApp, con aviso cuando se acerca el llamado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `crm.turnos.reservar`.
- **Recibe:** los datos de reservas de turno (`crmQueueAppointments`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de reservas de turno (`crmQueueAppointments`).
- **Ola:** O10 · **Fuente:** M09 §11.2 Socio (`/api/crm/...`, consumidos por M19), línea 1918 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Socio%20%28%60%2Fapi%2Fcrm%2F...%60%2C%20consumidos%20por%20M19%29/API-CRM-70-d)

<a id="API-CRM-70-e"></a>
#### API-CRM-70-e · `POST /api/crm/my/queue/appointments/{id}/cancel`

- **Qué hace:** Fila virtual y reservas. Cancela un registro de reservas de turno (`crmQueueAppointments`).
- **Para qué sirve:** RF-CRM-151: Turno remoto (fila virtual) desde portal, app o WhatsApp, con aviso cuando se acerca el llamado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `crm.turnos.reservar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O10 · **Fuente:** M09 §11.2 Socio (`/api/crm/...`, consumidos por M19), línea 1918 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Socio%20%28%60%2Fapi%2Fcrm%2F...%60%2C%20consumidos%20por%20M19%29/API-CRM-70-e)

<a id="API-CRM-70-f"></a>
#### API-CRM-70-f · `GET /api/crm/my/queue/slots`

- **Qué hace:** Fila virtual y reservas. Consulta `slots`.
- **Para qué sirve:** RF-CRM-151: Turno remoto (fila virtual) desde portal, app o WhatsApp, con aviso cuando se acerca el llamado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `crm.turnos.reservar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O10 · **Fuente:** M09 §11.2 Socio (`/api/crm/...`, consumidos por M19), línea 1918 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Socio%20%28%60%2Fapi%2Fcrm%2F...%60%2C%20consumidos%20por%20M19%29/API-CRM-70-f)

<a id="API-CRM-70-g"></a>
#### API-CRM-70-g · `POST /api/crm/my/queue/slots`

- **Qué hace:** Fila virtual y reservas. Registra un nuevo elemento u operación en `slots`.
- **Para qué sirve:** RF-CRM-151: Turno remoto (fila virtual) desde portal, app o WhatsApp, con aviso cuando se acerca el llamado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `crm.turnos.reservar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O10 · **Fuente:** M09 §11.2 Socio (`/api/crm/...`, consumidos por M19), línea 1918 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Socio%20%28%60%2Fapi%2Fcrm%2F...%60%2C%20consumidos%20por%20M19%29/API-CRM-70-g)

<a id="grupo-3"></a>

## Público (`/api/public/<tenantSlug>/crm/...`)

8 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-CRM-71](#API-CRM-71) | GET | `/api/public/{tenantSlug}/crm/cancellation-form` | Servicios alcanzados y campos del formulario de baja. |
| [API-CRM-72](#API-CRM-72) | POST | `/api/public/{tenantSlug}/crm/cancellations` | Recepción pública de baja; devuelve código. |
| [API-CRM-73](#API-CRM-73) | GET | `/api/public/{tenantSlug}/crm/cases/status` | Estado público del caso (sin datos privados) |
| [API-CRM-74](#API-CRM-74) | POST | `/api/public/{tenantSlug}/crm/webchat/sessions` | Chat web anónimo (bot) |
| [API-CRM-74-b](#API-CRM-74-b) | POST | `/api/public/{tenantSlug}/crm/webchat/messages` | Chat web anónimo (bot) |
| [API-CRM-75](#API-CRM-75) | GET | `/api/public/{tenantSlug}/crm/outages` | Cortes/incidentes vigentes publicables. |
| [API-CRM-76](#API-CRM-76) | GET | `/api/public/{tenantSlug}/crm/queue/displays/{displayId}/stream` | Pantalla pública de turnos. |
| [API-CRM-77](#API-CRM-77) | POST | `/api/public/{tenantSlug}/crm/queue/kiosks/{kioskId}/tickets` | Emitir turno en tótem. |

<a id="API-CRM-71"></a>
#### API-CRM-71 · `GET /api/public/{tenantSlug}/crm/cancellation-form`

- **Qué hace:** Servicios alcanzados y campos del formulario de baja. Consulta `cancellation-form`.
- **Para qué sirve:** RF-CRM-066: Recepción pública de bajas sin registro previo ni trámites obstructivos, para los servicios alcanzados; constancia con código identificador por el mismo medio dentro de 24 horas. Habilitada en Internet, TV y telefonía… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M09 §11.3 Público (`/api/public/<tenantSlug>/crm/...`), línea 1924 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/P%C3%BAblico%20%28%60%2Fapi%2Fpublic%2F%3CtenantSlug%3E%2Fcrm%2F...%60%29/API-CRM-71)

<a id="API-CRM-72"></a>
#### API-CRM-72 · `POST /api/public/{tenantSlug}/crm/cancellations`

- **Qué hace:** Recepción pública de baja; devuelve código. Registra un nuevo elemento u operación en `cancellations`.
- **Para qué sirve:** RF-CRM-066: Recepción pública de bajas sin registro previo ni trámites obstructivos, para los servicios alcanzados; constancia con código identificador por el mismo medio dentro de 24 horas. Habilitada en Internet, TV y telefonía… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M09 §11.3 Público (`/api/public/<tenantSlug>/crm/...`), línea 1925 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/P%C3%BAblico%20%28%60%2Fapi%2Fpublic%2F%3CtenantSlug%3E%2Fcrm%2F...%60%29/API-CRM-72)

<a id="API-CRM-73"></a>
#### API-CRM-73 · `GET /api/public/{tenantSlug}/crm/cases/status`

- **Qué hace:** Estado público del caso (sin datos privados) Consulta expediente único de gestión (`crmCases`).
- **Para qué sirve:** RF-CRM-001: Crear casos con número de seguimiento único por tenant, visible al socio y al personal. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`.
- **Devuelve:** 200: el registro de expediente único de gestión (`crmCases`).
- **Ola:** O2 · **Fuente:** M09 §11.3 Público (`/api/public/<tenantSlug>/crm/...`), línea 1926 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/P%C3%BAblico%20%28%60%2Fapi%2Fpublic%2F%3CtenantSlug%3E%2Fcrm%2F...%60%29/API-CRM-73)

<a id="API-CRM-74"></a>
#### API-CRM-74 · `POST /api/public/{tenantSlug}/crm/webchat/sessions`

- **Qué hace:** Chat web anónimo (bot) Da de alta un registro de sesiones de bot; TTL (`crmBotSessions`).
- **Para qué sirve:** RF-CRM-182: Chat web en landing, portal y PWA (bot primero, humano después). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`; los datos de sesiones de bot; TTL (`crmBotSessions`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de sesiones de bot; TTL (`crmBotSessions`).
- **Ola:** O6 · **Fuente:** M09 §11.3 Público (`/api/public/<tenantSlug>/crm/...`), línea 1927 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/P%C3%BAblico%20%28%60%2Fapi%2Fpublic%2F%3CtenantSlug%3E%2Fcrm%2F...%60%29/API-CRM-74)

<a id="API-CRM-74-b"></a>
#### API-CRM-74-b · `POST /api/public/{tenantSlug}/crm/webchat/messages`

- **Qué hace:** Chat web anónimo (bot) Da de alta un registro de mensajes y notas (`crmMessages`).
- **Para qué sirve:** RF-CRM-007: Conservar la conversación del caso distinguiendo mensajes visibles al socio y notas internas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`; los datos de mensajes y notas (`crmMessages`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de mensajes y notas (`crmMessages`).
- **Ola:** O2 · **Fuente:** M09 §11.3 Público (`/api/public/<tenantSlug>/crm/...`), línea 1927 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/P%C3%BAblico%20%28%60%2Fapi%2Fpublic%2F%3CtenantSlug%3E%2Fcrm%2F...%60%29/API-CRM-74-b)

<a id="API-CRM-75"></a>
#### API-CRM-75 · `GET /api/public/{tenantSlug}/crm/outages`

- **Qué hace:** Cortes/incidentes vigentes publicables. Consulta `outages`.
- **Para qué sirve:** RF-CRM-148: Pantallas públicas con últimos llamados (agrupados por box o por turno), modos de visualización, voz sintetizada y múltiples pantallas por sucursal. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M09 §11.3 Público (`/api/public/<tenantSlug>/crm/...`), línea 1928 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/P%C3%BAblico%20%28%60%2Fapi%2Fpublic%2F%3CtenantSlug%3E%2Fcrm%2F...%60%29/API-CRM-75)

<a id="API-CRM-76"></a>
#### API-CRM-76 · `GET /api/public/{tenantSlug}/crm/queue/displays/{displayId}/stream`

- **Qué hace:** Pantalla pública de turnos. Abre un canal en tiempo real (SSE) para recibir novedades de pantallas del turnero (`crmQueueDisplays`).
- **Para qué sirve:** RF-CRM-148: Pantallas públicas con últimos llamados (agrupados por box o por turno), modos de visualización, voz sintetizada y múltiples pantallas por sucursal. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); permiso `crm.turnero.pantalla.ver`.
- **Recibe:** en la ruta `tenantSlug`, `displayId`.
- **Devuelve:** 200: un archivo (text/event-stream).
- **Pantallas:** PAN-CRM-25 (Pantalla pública de turnos).
- **Ola:** O10 · **Fuente:** M09 §11.3 Público (`/api/public/<tenantSlug>/crm/...`), línea 1929 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/P%C3%BAblico%20%28%60%2Fapi%2Fpublic%2F%3CtenantSlug%3E%2Fcrm%2F...%60%29/API-CRM-76)

<a id="API-CRM-77"></a>
#### API-CRM-77 · `POST /api/public/{tenantSlug}/crm/queue/kiosks/{kioskId}/tickets`

- **Qué hace:** Emitir turno en tótem. Da de alta un registro de turnos del turnero (`crmQueueTickets`).
- **Para qué sirve:** RF-CRM-153: Tótem de autoservicio para emitir turno (con documento opcional) e imprimir o mostrar QR. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); permiso `crm.turnero.emitir`.
- **Recibe:** en la ruta `tenantSlug`, `kioskId`; los datos de turnos del turnero (`crmQueueTickets`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de turnos del turnero (`crmQueueTickets`).
- **Pantallas:** PAN-CRM-23 (Recepción y emisión de turnos), PAN-CRM-26 (Tótem de autoservicio).
- **Ola:** O10 · **Fuente:** M09 §11.3 Público (`/api/public/<tenantSlug>/crm/...`), línea 1930 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/P%C3%BAblico%20%28%60%2Fapi%2Fpublic%2F%3CtenantSlug%3E%2Fcrm%2F...%60%29/API-CRM-77)

<a id="grupo-4"></a>

## Webhooks e internos

3 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-CRM-78](#API-CRM-78) | POST | `/api/v1/ext/crm/webhooks/{channelKind}/{connectionId}` | Entrantes de WhatsApp, SMS, email, redes, CTI/IVR. |
| [API-CRM-79](#API-CRM-79) | POST | `/api/v1/ext/crm/ivr/{connectionId}/lookup` | Consulta y alta de reclamo desde IVR. |
| [API-CRM-79-b](#API-CRM-79-b) | POST | `/api/v1/ext/crm/ivr/{connectionId}/cases` | Consulta y alta de reclamo desde IVR. |

<a id="API-CRM-78"></a>
#### API-CRM-78 · `POST /api/v1/ext/crm/webhooks/{channelKind}/{connectionId}`

- **Qué hace:** Entrantes de WhatsApp, SMS, email, redes, CTI/IVR. Registra «{connectionId}» sobre un registro de `webhooks`.
- **Para qué sirve:** RF-CRM-170: Catálogo de canales/medios de atención por tenant (presencial, teléfono, email, WhatsApp, SMS, chat web, portal/app, redes sociales, mesa de entradas, IVR, bot) con estado y configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); permiso `crm.webhooks.recibir`.
- **Recibe:** en la ruta `channelKind`, `connectionId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M09 §11.4 Webhooks e internos, línea 1936 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Webhooks%20e%20internos/API-CRM-78)

<a id="API-CRM-79"></a>
#### API-CRM-79 · `POST /api/v1/ext/crm/ivr/{connectionId}/lookup`

- **Qué hace:** Consulta y alta de reclamo desde IVR. Busca un registro de `lookup`.
- **Para qué sirve:** RF-CRM-125: Historial de estados de reclamos migrados y notas, consultables en el caso. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); permiso `crm.casos.crear`.
- **Recibe:** en la ruta `connectionId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CRM-04 (Alta y carga rápida de reclamo), PAN-TEC-49 (Carga rápida de reclamo).
- **Ola:** O2 · **Fuente:** M09 §11.4 Webhooks e internos, línea 1937 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Webhooks%20e%20internos/API-CRM-79)

<a id="API-CRM-79-b"></a>
#### API-CRM-79-b · `POST /api/v1/ext/crm/ivr/{connectionId}/cases`

- **Qué hace:** Consulta y alta de reclamo desde IVR. Da de alta un registro de expediente único de gestión (`crmCases`).
- **Para qué sirve:** RF-CRM-001: Crear casos con número de seguimiento único por tenant, visible al socio y al personal. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); permiso `crm.casos.crear`.
- **Recibe:** en la ruta `connectionId`; los datos de expediente único de gestión (`crmCases`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de expediente único de gestión (`crmCases`).
- **Pantallas:** PAN-CRM-04 (Alta y carga rápida de reclamo), PAN-TEC-49 (Carga rápida de reclamo).
- **Ola:** O2 · **Fuente:** M09 §11.4 Webhooks e internos, línea 1937 · [Ver en Swagger](../18-swagger/index.html?api=m09-crm#/Webhooks%20e%20internos/API-CRM-79-b)
