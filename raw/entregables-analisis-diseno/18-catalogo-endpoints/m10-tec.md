# Catálogo de endpoints · M10 · Técnica, campo, agenda, instalación, GIS/redes, obras, aprovisionamiento TIC y telefonía

Parte del [catálogo de endpoints](../18-catalogo-endpoints.md) (artefacto 7.1). Generado el 05-11-2026 con `_trabajo/gen_18_catalogo_endpoints.py` a partir de `18-openapi/`; no se edita a mano.

## Para qué sirve esta API

Especificar de forma completa y desarrollable la operación técnica de la cooperativa en GoodApps Cooperativas: desde que una solicitud de servicio necesita evaluarse en terreno hasta que el trabajo está ejecutado, revisado, con evidencia y con su efecto contractual autorizado. El módulo cubre:

1. Factibilidad técnica de nuevas conexiones, traslados y reconexiones, con inspección, dictamen, vigencia y vínculo con el alta.
2. Estimación técnica y presupuesto de conexión (cómputo de materiales, mano de obra y obra necesaria) que alimenta el presupuesto comercial.
3. Órdenes de trabajo (OT) de todos los tipos (trabajo sobre servicio, mantenimiento sobre activo/obra, OT derivada de reclamo, inspección), con catálogo de operaciones de efecto declarativo, tareas, participantes y horas, vehículos, necesidades y consumo de materiales, resolución, notas, datos extra, reportes de impresión, numeración visible, órdenes encadenadas y operaciones masivas.
4. Agenda y visitas: zonas, tipos de visita, franjas, capacidad por recurso, reserva temporal y confirmada sin doble asignación, reprogramación, cancelación, resultado de visita y estado visible al socio ("En camino" sin GPS en vivo).
5. Instalación integral (BASE §73): cita, equipo identificado en custodia del instalador, prueba, conformidad/firma, aplicación única del movimiento de stock, encuesta posterior independiente y hito de activación con fecha efectiva para el contrato y la facturación.
6. Cuadrillas, recursos de campo, profesionales matriculados, tipos de trabajo y reglas de notificación por horario/feriado.
7. App de campo única offline-first (perfiles técnico, lecturista, cobrador) con cola única, fotos, GPS, firma, materiales que descuentan stock, idempotencia y tratamiento de conflictos de sincronización (AGR-025, ESC-03).
8. Cortes y reconexiones ejecutados en terreno o en forma remota, decididos por el módulo de mora o por el CRM.
9. Mantenimiento e infraestructura y mapas (BASE §18): inventario técnico por ubicación, planes preventivos, averías, interrupciones planificadas, contratos afectados, historial y costo por activo.
10. Red / GIS genérica configurable (red eléctrica, agua, gas, telecomunicaciones): componentes, atributos tipados, capas, relaciones permitidas, red instalada georreferenciada, vínculo servicio-red con historial y análisis de impacto ante el corte de un elemento (por ejemplo un transformador) con aviso masivo.
11. Equipos de red y centrales (OLT, routers, NAS/Radius, centrales telefónicas, DSLAM).
12. Obras, loteos y contribución por mejoras (MER-009): obra, presupuesto, avance, costeo, padrón de beneficiarios y prorrateo.
13. Inspecciones y consumo no registrado/fraude (MER-004): caso, inspección con acta y fotos, precintos, descargo, propuesta de recupero aprobada y derivación a facturación.
14. Aprovisionamiento de Internet/TV (MikroTik, Wispro, Radius, SmartOlt, Ispfull, Sensa, Sopnet, SITSA y otros): alta, corte, reconexión, cambio de plan y baja con confirmación del resultado (BASE §86, MER-017).
15. Telefonía: red física (centrales, repartidores, regletas, cajas, DSLAM), prefijos, pool de números, líneas del abonado, plan de numeración ENACOM, importación de CDR de 20+ modelos de central, CPP de operadoras y telefonía móvil (Claro/Personal). La tasación se especifica en M04 TAR.
16. Geolocalización operativa del servicio con Google Maps (BASE §77): punto de prestación confirmado/aproximado/pendiente usado por factibilidad, agenda, OT, mapa y red.

Detalle completo en el anexo M10, sección 1. Contrato navegable: [Swagger](../18-swagger/index.html?api=m10-tec).

| Dato | Valor |
|---|---|
| Endpoints | 382 |
| Por método | DELETE 49, GET 136, PATCH 55, POST 142 |
| Grupos funcionales | 1 |
| Con requisito citado en el anexo | 4 |
| Con requisito inferido (a confirmar) | 365 |
| Sin requisito identificable | 13 |

## Grupos funcionales

| Grupo | Endpoints | Qué agrupa (primeros endpoints) |
|---|---|---|
| [API](#grupo-1) | 382 | Listar / crear factibilidad. Filtros estado, servicio…; Ficha / editar. Cambios versionados.; Dictaminar. Motivo y responsable obligatorios.… |

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

382 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-TEC-01](#API-TEC-01) | GET | `/api/admin/tec/feasibility` | Listar / crear factibilidad. Filtros estado, servicio, zona, vigencia. |
| [API-TEC-01-b](#API-TEC-01-b) | POST | `/api/admin/tec/feasibility` | Listar / crear factibilidad. Filtros estado, servicio, zona, vigencia. |
| [API-TEC-02](#API-TEC-02) | GET | `/api/admin/tec/feasibility/{id}` | Ficha / editar. Cambios versionados. |
| [API-TEC-02-b](#API-TEC-02-b) | PATCH | `/api/admin/tec/feasibility/{id}` | Ficha / editar. Cambios versionados. |
| [API-TEC-03](#API-TEC-03) | POST | `/api/admin/tec/feasibility/{id}/verdict` | Dictaminar. Motivo y responsable obligatorios. |
| [API-TEC-04](#API-TEC-04) | POST | `/api/admin/tec/feasibility/{id}/cancel` | Anular / reabrir. Reapertura según PRM-TEC-064. |
| [API-TEC-04-b](#API-TEC-04-b) | POST | `/api/admin/tec/feasibility/{id}/reopen` | Anular / reabrir. Reapertura según PRM-TEC-064. |
| [API-TEC-05](#API-TEC-05) | GET | `/api/admin/tec/feasibility/{id}/resource-proposal` | Proponer recurso de red. Consulta GIS de capacidad. |
| [API-TEC-06](#API-TEC-06) | GET | `/api/admin/tec/estimates` | Estimación y envío a M11. |
| [API-TEC-06-b](#API-TEC-06-b) | POST | `/api/admin/tec/estimates` | Estimación y envío a M11. |
| [API-TEC-06-c](#API-TEC-06-c) | GET | `/api/admin/tec/estimates/{id}` | Estimación y envío a M11. |
| [API-TEC-06-d](#API-TEC-06-d) | PATCH | `/api/admin/tec/estimates/{id}` | Estimación y envío a M11. |
| [API-TEC-06-e](#API-TEC-06-e) | POST | `/api/admin/tec/estimates/{id}/submit` | Estimación y envío a M11. |
| [API-TEC-07](#API-TEC-07) | GET | `/api/admin/tec/work-orders` | Listar / crear OT. Creación valida duplicados (409 tec.workOrder.duplicate). |
| [API-TEC-07-b](#API-TEC-07-b) | POST | `/api/admin/tec/work-orders` | Listar / crear OT. Creación valida duplicados (409 tec.workOrder.duplicate). |
| [API-TEC-08](#API-TEC-08) | GET | `/api/admin/tec/work-orders/{id}` | Ficha / editar. Bloqueada si dispatch.locked (423). |
| [API-TEC-08-b](#API-TEC-08-b) | PATCH | `/api/admin/tec/work-orders/{id}` | Ficha / editar. Bloqueada si dispatch.locked (423). |
| [API-TEC-09](#API-TEC-09) | POST | `/api/admin/tec/work-orders/{id}/schedule` | Transiciones operativas. |
| [API-TEC-09-b](#API-TEC-09-b) | POST | `/api/admin/tec/work-orders/{id}/assign` | Transiciones operativas. |
| [API-TEC-09-c](#API-TEC-09-c) | POST | `/api/admin/tec/work-orders/{id}/dispatch` | Transiciones operativas. |
| [API-TEC-09-d](#API-TEC-09-d) | POST | `/api/admin/tec/work-orders/{id}/recall` | Transiciones operativas. |
| [API-TEC-09-e](#API-TEC-09-e) | POST | `/api/admin/tec/work-orders/{id}/hold` | Transiciones operativas. |
| [API-TEC-09-f](#API-TEC-09-f) | POST | `/api/admin/tec/work-orders/{id}/resume` | Transiciones operativas. |
| [API-TEC-10](#API-TEC-10) | POST | `/api/admin/tec/work-orders/{id}/execute` | Marcar ejecutada (administrativa). |
| [API-TEC-11](#API-TEC-11) | POST | `/api/admin/tec/work-orders/{id}/close` | Confirmar / cerrar. Devuelve 202 si quedan pasos asíncronos. |
| [API-TEC-12](#API-TEC-12) | POST | `/api/admin/tec/work-orders/{id}/cancel` | Anular / reabrir / restablecer. Compensación. |
| [API-TEC-12-b](#API-TEC-12-b) | POST | `/api/admin/tec/work-orders/{id}/reopen` | Anular / reabrir / restablecer. Compensación. |
| [API-TEC-12-c](#API-TEC-12-c) | POST | `/api/admin/tec/work-orders/{id}/restore` | Anular / reabrir / restablecer. Compensación. |
| [API-TEC-13](#API-TEC-13) | GET | `/api/admin/tec/work-orders/{id}/tasks` | Subrecursos. Evidencias: URL firmada de subida. |
| [API-TEC-13-b](#API-TEC-13-b) | POST | `/api/admin/tec/work-orders/{id}/tasks` | Subrecursos. Evidencias: URL firmada de subida. |
| [API-TEC-13-c](#API-TEC-13-c) | GET | `/api/admin/tec/work-orders/{id}/notes` | Subrecursos. Evidencias: URL firmada de subida. |
| [API-TEC-13-d](#API-TEC-13-d) | POST | `/api/admin/tec/work-orders/{id}/notes` | Subrecursos. Evidencias: URL firmada de subida. |
| [API-TEC-13-e](#API-TEC-13-e) | GET | `/api/admin/tec/work-orders/{id}/extra-data` | Subrecursos. Evidencias: URL firmada de subida. |
| [API-TEC-13-f](#API-TEC-13-f) | POST | `/api/admin/tec/work-orders/{id}/extra-data` | Subrecursos. Evidencias: URL firmada de subida. |
| [API-TEC-13-g](#API-TEC-13-g) | GET | `/api/admin/tec/work-orders/{id}/evidence` | Subrecursos. Evidencias: URL firmada de subida. |
| [API-TEC-13-h](#API-TEC-13-h) | POST | `/api/admin/tec/work-orders/{id}/evidence` | Subrecursos. Evidencias: URL firmada de subida. |
| [API-TEC-14](#API-TEC-14) | GET | `/api/admin/tec/work-orders/{id}/materials` | Materiales. Delegan reserva/vale a M13. |
| [API-TEC-14-b](#API-TEC-14-b) | POST | `/api/admin/tec/work-orders/{id}/materials` | Materiales. Delegan reserva/vale a M13. |
| [API-TEC-14-c](#API-TEC-14-c) | POST | `/api/admin/tec/work-orders/{id}/materials/{mid}/authorize` | Materiales. Delegan reserva/vale a M13. |
| [API-TEC-14-d](#API-TEC-14-d) | POST | `/api/admin/tec/work-orders/{id}/materials/{mid}/cancel` | Materiales. Delegan reserva/vale a M13. |
| [API-TEC-14-e](#API-TEC-14-e) | POST | `/api/admin/tec/work-orders/{id}/materials/{mid}/return` | Materiales. Delegan reserva/vale a M13. |
| [API-TEC-15](#API-TEC-15) | POST | `/api/admin/tec/work-orders/bulk-create` | Masivos. Job con resultado por ítem. |
| [API-TEC-15-b](#API-TEC-15-b) | POST | `/api/admin/tec/work-orders/bulk-close` | Masivos. Job con resultado por ítem. |
| [API-TEC-15-c](#API-TEC-15-c) | GET | `/api/admin/tec/jobs/{id}` | Masivos. Job con resultado por ítem. |
| [API-TEC-16](#API-TEC-16) | GET | `/api/admin/tec/work-orders/{id}/print` | Comprobante PDF. Marca despacho (RN-TEC-011). |
| [API-TEC-17](#API-TEC-17) | GET | `/api/admin/tec/schedule/availability` | Disponibilidad por zona/tipo/fecha. También en portal (API-TEC-40). |
| [API-TEC-18](#API-TEC-18) | POST | `/api/admin/tec/bookings` | Reservas. Contador atómico; 409 tec.booking.noCapacity. |
| [API-TEC-18-b](#API-TEC-18-b) | POST | `/api/admin/tec/bookings/{id}/confirm` | Reservas. Contador atómico; 409 tec.booking.noCapacity. |
| [API-TEC-18-c](#API-TEC-18-c) | POST | `/api/admin/tec/bookings/{id}/release` | Reservas. Contador atómico; 409 tec.booking.noCapacity. |
| [API-TEC-18-d](#API-TEC-18-d) | POST | `/api/admin/tec/bookings/{id}/cancel` | Reservas. Contador atómico; 409 tec.booking.noCapacity. |
| [API-TEC-19](#API-TEC-19) | GET | `/api/admin/tec/visits` | Visitas. |
| [API-TEC-19-b](#API-TEC-19-b) | POST | `/api/admin/tec/visits` | Visitas. |
| [API-TEC-19-c](#API-TEC-19-c) | GET | `/api/admin/tec/visits/{id}` | Visitas. |
| [API-TEC-19-d](#API-TEC-19-d) | PATCH | `/api/admin/tec/visits/{id}` | Visitas. |
| [API-TEC-19-e](#API-TEC-19-e) | POST | `/api/admin/tec/visits/{id}/reschedule` | Visitas. |
| [API-TEC-19-f](#API-TEC-19-f) | POST | `/api/admin/tec/visits/{id}/assign` | Visitas. |
| [API-TEC-19-g](#API-TEC-19-g) | POST | `/api/admin/tec/visits/{id}/cancel` | Visitas. |
| [API-TEC-20](#API-TEC-20) | GET | `/api/admin/tec/schedule/visit-types` | Configuración de agenda. |
| [API-TEC-20-b](#API-TEC-20-b) | POST | `/api/admin/tec/schedule/visit-types` | Configuración de agenda. |
| [API-TEC-20-c](#API-TEC-20-c) | GET | `/api/admin/tec/schedule/visit-types/{id}` | Configuración de agenda. |
| [API-TEC-20-e](#API-TEC-20-e) | DELETE | `/api/admin/tec/schedule/visit-types/{id}` | Configuración de agenda. |
| [API-TEC-20-d](#API-TEC-20-d) | PATCH | `/api/admin/tec/schedule/visit-types/{id}` | Configuración de agenda. |
| [API-TEC-20-f](#API-TEC-20-f) | GET | `/api/admin/tec/schedule/zones` | Configuración de agenda. |
| [API-TEC-20-g](#API-TEC-20-g) | POST | `/api/admin/tec/schedule/zones` | Configuración de agenda. |
| [API-TEC-20-h](#API-TEC-20-h) | GET | `/api/admin/tec/schedule/zones/{id}` | Configuración de agenda. |
| [API-TEC-20-j](#API-TEC-20-j) | DELETE | `/api/admin/tec/schedule/zones/{id}` | Configuración de agenda. |
| [API-TEC-20-i](#API-TEC-20-i) | PATCH | `/api/admin/tec/schedule/zones/{id}` | Configuración de agenda. |
| [API-TEC-20-k](#API-TEC-20-k) | GET | `/api/admin/tec/schedule/calendars` | Configuración de agenda. |
| [API-TEC-20-l](#API-TEC-20-l) | POST | `/api/admin/tec/schedule/calendars` | Configuración de agenda. |
| [API-TEC-20-m](#API-TEC-20-m) | GET | `/api/admin/tec/schedule/calendars/{id}` | Configuración de agenda. |
| [API-TEC-20-o](#API-TEC-20-o) | DELETE | `/api/admin/tec/schedule/calendars/{id}` | Configuración de agenda. |
| [API-TEC-20-n](#API-TEC-20-n) | PATCH | `/api/admin/tec/schedule/calendars/{id}` | Configuración de agenda. |
| [API-TEC-21](#API-TEC-21) | GET | `/api/admin/tec/crews` | Recursos. |
| [API-TEC-21-b](#API-TEC-21-b) | POST | `/api/admin/tec/crews` | Recursos. |
| [API-TEC-21-c](#API-TEC-21-c) | GET | `/api/admin/tec/crews/{id}` | Recursos. |
| [API-TEC-21-e](#API-TEC-21-e) | DELETE | `/api/admin/tec/crews/{id}` | Recursos. |
| [API-TEC-21-d](#API-TEC-21-d) | PATCH | `/api/admin/tec/crews/{id}` | Recursos. |
| [API-TEC-21-f](#API-TEC-21-f) | GET | `/api/admin/tec/resources` | Recursos. |
| [API-TEC-21-g](#API-TEC-21-g) | POST | `/api/admin/tec/resources` | Recursos. |
| [API-TEC-21-h](#API-TEC-21-h) | GET | `/api/admin/tec/resources/{id}` | Recursos. |
| [API-TEC-21-j](#API-TEC-21-j) | DELETE | `/api/admin/tec/resources/{id}` | Recursos. |
| [API-TEC-21-i](#API-TEC-21-i) | PATCH | `/api/admin/tec/resources/{id}` | Recursos. |
| [API-TEC-21-k](#API-TEC-21-k) | GET | `/api/admin/tec/installers` | Recursos. |
| [API-TEC-21-l](#API-TEC-21-l) | POST | `/api/admin/tec/installers` | Recursos. |
| [API-TEC-21-m](#API-TEC-21-m) | GET | `/api/admin/tec/installers/{id}` | Recursos. |
| [API-TEC-21-o](#API-TEC-21-o) | DELETE | `/api/admin/tec/installers/{id}` | Recursos. |
| [API-TEC-21-n](#API-TEC-21-n) | PATCH | `/api/admin/tec/installers/{id}` | Recursos. |
| [API-TEC-21-p](#API-TEC-21-p) | GET | `/api/admin/tec/notification-rules` | Recursos. |
| [API-TEC-21-q](#API-TEC-21-q) | POST | `/api/admin/tec/notification-rules` | Recursos. |
| [API-TEC-21-r](#API-TEC-21-r) | GET | `/api/admin/tec/notification-rules/{id}` | Recursos. |
| [API-TEC-21-t](#API-TEC-21-t) | DELETE | `/api/admin/tec/notification-rules/{id}` | Recursos. |
| [API-TEC-21-s](#API-TEC-21-s) | PATCH | `/api/admin/tec/notification-rules/{id}` | Recursos. |
| [API-TEC-22](#API-TEC-22) | GET | `/api/admin/tec/catalog/operations` | Catálogos. Importación Excel. |
| [API-TEC-22-b](#API-TEC-22-b) | POST | `/api/admin/tec/catalog/operations` | Catálogos. Importación Excel. |
| [API-TEC-22-c](#API-TEC-22-c) | GET | `/api/admin/tec/catalog/operations/{id}` | Catálogos. Importación Excel. |
| [API-TEC-22-e](#API-TEC-22-e) | DELETE | `/api/admin/tec/catalog/operations/{id}` | Catálogos. Importación Excel. |
| [API-TEC-22-d](#API-TEC-22-d) | PATCH | `/api/admin/tec/catalog/operations/{id}` | Catálogos. Importación Excel. |
| [API-TEC-22-f](#API-TEC-22-f) | GET | `/api/admin/tec/catalog/work-types` | Catálogos. Importación Excel. |
| [API-TEC-22-g](#API-TEC-22-g) | POST | `/api/admin/tec/catalog/work-types` | Catálogos. Importación Excel. |
| [API-TEC-22-h](#API-TEC-22-h) | GET | `/api/admin/tec/catalog/work-types/{id}` | Catálogos. Importación Excel. |
| [API-TEC-22-j](#API-TEC-22-j) | DELETE | `/api/admin/tec/catalog/work-types/{id}` | Catálogos. Importación Excel. |
| [API-TEC-22-i](#API-TEC-22-i) | PATCH | `/api/admin/tec/catalog/work-types/{id}` | Catálogos. Importación Excel. |
| [API-TEC-22-k](#API-TEC-22-k) | GET | `/api/admin/tec/catalog/incident-categories` | Catálogos. Importación Excel. |
| [API-TEC-22-l](#API-TEC-22-l) | POST | `/api/admin/tec/catalog/incident-categories` | Catálogos. Importación Excel. |
| [API-TEC-22-m](#API-TEC-22-m) | GET | `/api/admin/tec/catalog/incident-categories/{id}` | Catálogos. Importación Excel. |
| [API-TEC-22-o](#API-TEC-22-o) | DELETE | `/api/admin/tec/catalog/incident-categories/{id}` | Catálogos. Importación Excel. |
| [API-TEC-22-n](#API-TEC-22-n) | PATCH | `/api/admin/tec/catalog/incident-categories/{id}` | Catálogos. Importación Excel. |
| [API-TEC-22-p](#API-TEC-22-p) | GET | `/api/admin/tec/catalog/resolutions` | Catálogos. Importación Excel. |
| [API-TEC-22-q](#API-TEC-22-q) | POST | `/api/admin/tec/catalog/resolutions` | Catálogos. Importación Excel. |
| [API-TEC-22-r](#API-TEC-22-r) | GET | `/api/admin/tec/catalog/resolutions/{id}` | Catálogos. Importación Excel. |
| [API-TEC-22-t](#API-TEC-22-t) | DELETE | `/api/admin/tec/catalog/resolutions/{id}` | Catálogos. Importación Excel. |
| [API-TEC-22-s](#API-TEC-22-s) | PATCH | `/api/admin/tec/catalog/resolutions/{id}` | Catálogos. Importación Excel. |
| [API-TEC-22-u](#API-TEC-22-u) | GET | `/api/admin/tec/catalog/tasks` | Catálogos. Importación Excel. |
| [API-TEC-22-v](#API-TEC-22-v) | POST | `/api/admin/tec/catalog/tasks` | Catálogos. Importación Excel. |
| [API-TEC-22-w](#API-TEC-22-w) | GET | `/api/admin/tec/catalog/tasks/{id}` | Catálogos. Importación Excel. |
| [API-TEC-22-y](#API-TEC-22-y) | DELETE | `/api/admin/tec/catalog/tasks/{id}` | Catálogos. Importación Excel. |
| [API-TEC-22-x](#API-TEC-22-x) | PATCH | `/api/admin/tec/catalog/tasks/{id}` | Catálogos. Importación Excel. |
| [API-TEC-22-z](#API-TEC-22-z) | GET | `/api/admin/tec/catalog/task-groups` | Catálogos. Importación Excel. |
| [API-TEC-22-26](#API-TEC-22-26) | POST | `/api/admin/tec/catalog/task-groups` | Catálogos. Importación Excel. |
| [API-TEC-22-27](#API-TEC-22-27) | GET | `/api/admin/tec/catalog/task-groups/{id}` | Catálogos. Importación Excel. |
| [API-TEC-22-29](#API-TEC-22-29) | DELETE | `/api/admin/tec/catalog/task-groups/{id}` | Catálogos. Importación Excel. |
| [API-TEC-22-28](#API-TEC-22-28) | PATCH | `/api/admin/tec/catalog/task-groups/{id}` | Catálogos. Importación Excel. |
| [API-TEC-22-30](#API-TEC-22-30) | GET | `/api/admin/tec/catalog/print-templates` | Catálogos. Importación Excel. |
| [API-TEC-22-31](#API-TEC-22-31) | POST | `/api/admin/tec/catalog/print-templates` | Catálogos. Importación Excel. |
| [API-TEC-22-32](#API-TEC-22-32) | GET | `/api/admin/tec/catalog/print-templates/{id}` | Catálogos. Importación Excel. |
| [API-TEC-22-34](#API-TEC-22-34) | DELETE | `/api/admin/tec/catalog/print-templates/{id}` | Catálogos. Importación Excel. |
| [API-TEC-22-33](#API-TEC-22-33) | PATCH | `/api/admin/tec/catalog/print-templates/{id}` | Catálogos. Importación Excel. |
| [API-TEC-22-35](#API-TEC-22-35) | GET | `/api/admin/tec/catalog/chained-rules` | Catálogos. Importación Excel. |
| [API-TEC-22-36](#API-TEC-22-36) | POST | `/api/admin/tec/catalog/chained-rules` | Catálogos. Importación Excel. |
| [API-TEC-22-37](#API-TEC-22-37) | GET | `/api/admin/tec/catalog/chained-rules/{id}` | Catálogos. Importación Excel. |
| [API-TEC-22-39](#API-TEC-22-39) | DELETE | `/api/admin/tec/catalog/chained-rules/{id}` | Catálogos. Importación Excel. |
| [API-TEC-22-38](#API-TEC-22-38) | PATCH | `/api/admin/tec/catalog/chained-rules/{id}` | Catálogos. Importación Excel. |
| [API-TEC-22-40](#API-TEC-22-40) | GET | `/api/admin/tec/catalog/intake-channels` | Catálogos. Importación Excel. |
| [API-TEC-22-41](#API-TEC-22-41) | POST | `/api/admin/tec/catalog/intake-channels` | Catálogos. Importación Excel. |
| [API-TEC-22-42](#API-TEC-22-42) | GET | `/api/admin/tec/catalog/intake-channels/{id}` | Catálogos. Importación Excel. |
| [API-TEC-22-44](#API-TEC-22-44) | DELETE | `/api/admin/tec/catalog/intake-channels/{id}` | Catálogos. Importación Excel. |
| [API-TEC-22-43](#API-TEC-22-43) | PATCH | `/api/admin/tec/catalog/intake-channels/{id}` | Catálogos. Importación Excel. |
| [API-TEC-23](#API-TEC-23) | GET | `/api/admin/tec/installations` | Instalaciones. |
| [API-TEC-23-b](#API-TEC-23-b) | POST | `/api/admin/tec/installations/{workOrderId}/confirm-activation` | Instalaciones. |
| [API-TEC-23-c](#API-TEC-23-c) | POST | `/api/admin/tec/installations/{workOrderId}/review` | Instalaciones. |
| [API-TEC-24](#API-TEC-24) | GET | `/api/admin/tec/sync-conflicts` | Conflictos. Resolución con motivo. |
| [API-TEC-24-b](#API-TEC-24-b) | POST | `/api/admin/tec/sync-conflicts/{id}/resolve` | Conflictos. Resolución con motivo. |
| [API-TEC-25](#API-TEC-25) | GET | `/api/admin/tec/field-forms` | Formularios de campo. Versionado inmutable al publicar. |
| [API-TEC-25-b](#API-TEC-25-b) | POST | `/api/admin/tec/field-forms` | Formularios de campo. Versionado inmutable al publicar. |
| [API-TEC-25-c](#API-TEC-25-c) | GET | `/api/admin/tec/field-forms/{id}` | Formularios de campo. Versionado inmutable al publicar. |
| [API-TEC-25-e](#API-TEC-25-e) | DELETE | `/api/admin/tec/field-forms/{id}` | Formularios de campo. Versionado inmutable al publicar. |
| [API-TEC-25-d](#API-TEC-25-d) | PATCH | `/api/admin/tec/field-forms/{id}` | Formularios de campo. Versionado inmutable al publicar. |
| [API-TEC-25-f](#API-TEC-25-f) | POST | `/api/admin/tec/field-forms/{id}/publish` | Formularios de campo. Versionado inmutable al publicar. |
| [API-TEC-26](#API-TEC-26) | GET | `/api/admin/tec/maintenance-plans` | Mantenimiento e interrupciones. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes CRUD · POST; PA-TEC-23). |
| [API-TEC-26-b](#API-TEC-26-b) | POST | `/api/admin/tec/maintenance-plans` | Mantenimiento e interrupciones. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes CRUD · POST; PA-TEC-23). |
| [API-TEC-26-c](#API-TEC-26-c) | GET | `/api/admin/tec/maintenance-plans/{id}` | Mantenimiento e interrupciones. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes CRUD · POST; PA-TEC-23). |
| [API-TEC-26-e](#API-TEC-26-e) | DELETE | `/api/admin/tec/maintenance-plans/{id}` | Mantenimiento e interrupciones. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes CRUD · POST; PA-TEC-23). |
| [API-TEC-26-d](#API-TEC-26-d) | PATCH | `/api/admin/tec/maintenance-plans/{id}` | Mantenimiento e interrupciones. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes CRUD · POST; PA-TEC-23). |
| [API-TEC-26-f](#API-TEC-26-f) | GET | `/api/admin/tec/outages` | Mantenimiento e interrupciones. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes CRUD · POST; PA-TEC-23). |
| [API-TEC-26-g](#API-TEC-26-g) | POST | `/api/admin/tec/outages` | Mantenimiento e interrupciones. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes CRUD · POST; PA-TEC-23). |
| [API-TEC-26-h](#API-TEC-26-h) | GET | `/api/admin/tec/outages/{id}` | Mantenimiento e interrupciones. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes CRUD · POST; PA-TEC-23). |
| [API-TEC-26-j](#API-TEC-26-j) | DELETE | `/api/admin/tec/outages/{id}` | Mantenimiento e interrupciones. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes CRUD · POST; PA-TEC-23). |
| [API-TEC-26-i](#API-TEC-26-i) | PATCH | `/api/admin/tec/outages/{id}` | Mantenimiento e interrupciones. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes CRUD · POST; PA-TEC-23). |
| [API-TEC-26-k](#API-TEC-26-k) | POST | `/api/admin/tec/outages/{id}/approve` | Mantenimiento e interrupciones. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes CRUD · POST; PA-TEC-23). |
| [API-TEC-26-l](#API-TEC-26-l) | POST | `/api/admin/tec/outages/{id}/notify` | Mantenimiento e interrupciones. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes CRUD · POST; PA-TEC-23). |
| [API-TEC-26-m](#API-TEC-26-m) | POST | `/api/admin/tec/outages/{id}/start` | Mantenimiento e interrupciones. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes CRUD · POST; PA-TEC-23). |
| [API-TEC-26-n](#API-TEC-26-n) | POST | `/api/admin/tec/outages/{id}/finish` | Mantenimiento e interrupciones. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes CRUD · POST; PA-TEC-23). |
| [API-TEC-26-o](#API-TEC-26-o) | POST | `/api/admin/tec/outages/{id}/cancel` | Mantenimiento e interrupciones. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes CRUD · POST; PA-TEC-23). |
| [API-TEC-27](#API-TEC-27) | GET | `/api/admin/tec/networks/impact` | Análisis de impacto. Async (JOB-TEC-15) si supera umbral. |
| [API-TEC-28](#API-TEC-28) | GET | `/api/admin/tec/networks/networks` | Estructura de red. |
| [API-TEC-28-b](#API-TEC-28-b) | POST | `/api/admin/tec/networks/networks` | Estructura de red. |
| [API-TEC-28-c](#API-TEC-28-c) | GET | `/api/admin/tec/networks/networks/{id}` | Estructura de red. |
| [API-TEC-28-e](#API-TEC-28-e) | DELETE | `/api/admin/tec/networks/networks/{id}` | Estructura de red. |
| [API-TEC-28-d](#API-TEC-28-d) | PATCH | `/api/admin/tec/networks/networks/{id}` | Estructura de red. |
| [API-TEC-28-f](#API-TEC-28-f) | GET | `/api/admin/tec/networks/layers` | Estructura de red. |
| [API-TEC-28-g](#API-TEC-28-g) | POST | `/api/admin/tec/networks/layers` | Estructura de red. |
| [API-TEC-28-h](#API-TEC-28-h) | GET | `/api/admin/tec/networks/layers/{id}` | Estructura de red. |
| [API-TEC-28-j](#API-TEC-28-j) | DELETE | `/api/admin/tec/networks/layers/{id}` | Estructura de red. |
| [API-TEC-28-i](#API-TEC-28-i) | PATCH | `/api/admin/tec/networks/layers/{id}` | Estructura de red. |
| [API-TEC-28-k](#API-TEC-28-k) | GET | `/api/admin/tec/networks/component-types` | Estructura de red. |
| [API-TEC-28-l](#API-TEC-28-l) | POST | `/api/admin/tec/networks/component-types` | Estructura de red. |
| [API-TEC-28-m](#API-TEC-28-m) | GET | `/api/admin/tec/networks/component-types/{id}` | Estructura de red. |
| [API-TEC-28-o](#API-TEC-28-o) | DELETE | `/api/admin/tec/networks/component-types/{id}` | Estructura de red. |
| [API-TEC-28-n](#API-TEC-28-n) | PATCH | `/api/admin/tec/networks/component-types/{id}` | Estructura de red. |
| [API-TEC-28-p](#API-TEC-28-p) | GET | `/api/admin/tec/networks/relations` | Estructura de red. |
| [API-TEC-28-q](#API-TEC-28-q) | POST | `/api/admin/tec/networks/relations` | Estructura de red. |
| [API-TEC-28-r](#API-TEC-28-r) | GET | `/api/admin/tec/networks/relations/{id}` | Estructura de red. |
| [API-TEC-28-t](#API-TEC-28-t) | DELETE | `/api/admin/tec/networks/relations/{id}` | Estructura de red. |
| [API-TEC-28-s](#API-TEC-28-s) | PATCH | `/api/admin/tec/networks/relations/{id}` | Estructura de red. |
| [API-TEC-28-u](#API-TEC-28-u) | GET | `/api/admin/tec/networks/attributes` | Estructura de red. |
| [API-TEC-28-v](#API-TEC-28-v) | POST | `/api/admin/tec/networks/attributes` | Estructura de red. |
| [API-TEC-28-w](#API-TEC-28-w) | GET | `/api/admin/tec/networks/attributes/{id}` | Estructura de red. |
| [API-TEC-28-y](#API-TEC-28-y) | DELETE | `/api/admin/tec/networks/attributes/{id}` | Estructura de red. |
| [API-TEC-28-x](#API-TEC-28-x) | PATCH | `/api/admin/tec/networks/attributes/{id}` | Estructura de red. |
| [API-TEC-29](#API-TEC-29) | GET | `/api/admin/tec/networks/elements` | Red instalada. GeoJSON; bbox con índice 2dsphere. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes CRUD · PO... |
| [API-TEC-29-b](#API-TEC-29-b) | POST | `/api/admin/tec/networks/elements` | Red instalada. GeoJSON; bbox con índice 2dsphere. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes CRUD · PO... |
| [API-TEC-29-c](#API-TEC-29-c) | GET | `/api/admin/tec/networks/elements/{id}` | Red instalada. GeoJSON; bbox con índice 2dsphere. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes CRUD · PO... |
| [API-TEC-29-e](#API-TEC-29-e) | DELETE | `/api/admin/tec/networks/elements/{id}` | Red instalada. GeoJSON; bbox con índice 2dsphere. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes CRUD · PO... |
| [API-TEC-29-d](#API-TEC-29-d) | PATCH | `/api/admin/tec/networks/elements/{id}` | Red instalada. GeoJSON; bbox con índice 2dsphere. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes CRUD · PO... |
| [API-TEC-29-f](#API-TEC-29-f) | POST | `/api/admin/tec/networks/elements/bulk` | Red instalada. GeoJSON; bbox con índice 2dsphere. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes CRUD · PO... |
| [API-TEC-29-g](#API-TEC-29-g) | GET | `/api/admin/tec/networks/elements/tree` | Red instalada. GeoJSON; bbox con índice 2dsphere. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes CRUD · PO... |
| [API-TEC-29-h](#API-TEC-29-h) | GET | `/api/admin/tec/networks/elements/geo` | Red instalada. GeoJSON; bbox con índice 2dsphere. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes CRUD · PO... |
| [API-TEC-30](#API-TEC-30) | GET | `/api/admin/tec/networks/connections` | Conexiones. |
| [API-TEC-30-b](#API-TEC-30-b) | POST | `/api/admin/tec/networks/connections` | Conexiones. |
| [API-TEC-30-c](#API-TEC-30-c) | POST | `/api/admin/tec/networks/connections/{id}/disconnect` | Conexiones. |
| [API-TEC-31](#API-TEC-31) | GET | `/api/admin/tec/networks/export-templates` | Exportación GIS. |
| [API-TEC-31-b](#API-TEC-31-b) | POST | `/api/admin/tec/networks/export-templates` | Exportación GIS. |
| [API-TEC-31-c](#API-TEC-31-c) | GET | `/api/admin/tec/networks/export-templates/{id}` | Exportación GIS. |
| [API-TEC-31-e](#API-TEC-31-e) | DELETE | `/api/admin/tec/networks/export-templates/{id}` | Exportación GIS. |
| [API-TEC-31-d](#API-TEC-31-d) | PATCH | `/api/admin/tec/networks/export-templates/{id}` | Exportación GIS. |
| [API-TEC-31-f](#API-TEC-31-f) | POST | `/api/admin/tec/networks/export-templates/{id}/run` | Exportación GIS. |
| [API-TEC-32](#API-TEC-32) | GET | `/api/admin/tec/network-devices` | Equipos de red. Credencial solo como credentialRef. |
| [API-TEC-32-b](#API-TEC-32-b) | POST | `/api/admin/tec/network-devices` | Equipos de red. Credencial solo como credentialRef. |
| [API-TEC-32-c](#API-TEC-32-c) | GET | `/api/admin/tec/network-devices/{id}` | Equipos de red. Credencial solo como credentialRef. |
| [API-TEC-32-e](#API-TEC-32-e) | DELETE | `/api/admin/tec/network-devices/{id}` | Equipos de red. Credencial solo como credentialRef. |
| [API-TEC-32-d](#API-TEC-32-d) | PATCH | `/api/admin/tec/network-devices/{id}` | Equipos de red. Credencial solo como credentialRef. |
| [API-TEC-32-f](#API-TEC-32-f) | GET | `/api/admin/tec/network-devices/{id}/status` | Equipos de red. Credencial solo como credentialRef. |
| [API-TEC-33](#API-TEC-33) | GET | `/api/admin/tec/provisioning/systems` | Sistemas de aprovisionamiento. |
| [API-TEC-33-b](#API-TEC-33-b) | POST | `/api/admin/tec/provisioning/systems` | Sistemas de aprovisionamiento. |
| [API-TEC-33-c](#API-TEC-33-c) | GET | `/api/admin/tec/provisioning/systems/{id}` | Sistemas de aprovisionamiento. |
| [API-TEC-33-e](#API-TEC-33-e) | DELETE | `/api/admin/tec/provisioning/systems/{id}` | Sistemas de aprovisionamiento. |
| [API-TEC-33-d](#API-TEC-33-d) | PATCH | `/api/admin/tec/provisioning/systems/{id}` | Sistemas de aprovisionamiento. |
| [API-TEC-33-f](#API-TEC-33-f) | GET | `/api/admin/tec/provisioning/profiles` | Sistemas de aprovisionamiento. |
| [API-TEC-33-g](#API-TEC-33-g) | POST | `/api/admin/tec/provisioning/profiles` | Sistemas de aprovisionamiento. |
| [API-TEC-33-h](#API-TEC-33-h) | GET | `/api/admin/tec/provisioning/profiles/{id}` | Sistemas de aprovisionamiento. |
| [API-TEC-33-j](#API-TEC-33-j) | DELETE | `/api/admin/tec/provisioning/profiles/{id}` | Sistemas de aprovisionamiento. |
| [API-TEC-33-i](#API-TEC-33-i) | PATCH | `/api/admin/tec/provisioning/profiles/{id}` | Sistemas de aprovisionamiento. |
| [API-TEC-33-k](#API-TEC-33-k) | POST | `/api/admin/tec/provisioning/systems/{id}/test` | Sistemas de aprovisionamiento. |
| [API-TEC-33-l](#API-TEC-33-l) | POST | `/api/admin/tec/provisioning/systems/{id}/sync-catalog` | Sistemas de aprovisionamiento. |
| [API-TEC-34](#API-TEC-34) | GET | `/api/admin/tec/provisioning/commands` | Consola. |
| [API-TEC-34-b](#API-TEC-34-b) | POST | `/api/admin/tec/provisioning/commands/{id}/retry` | Consola. |
| [API-TEC-34-c](#API-TEC-34-c) | POST | `/api/admin/tec/provisioning/commands/{id}/mark-manual` | Consola. |
| [API-TEC-34-d](#API-TEC-34-d) | POST | `/api/admin/tec/provisioning/commands/{id}/cancel` | Consola. |
| [API-TEC-35](#API-TEC-35) | GET | `/api/admin/tec/service-technical/{contractId}` | Datos técnicos del servicio. Cambios generan comando. |
| [API-TEC-35-b](#API-TEC-35-b) | PATCH | `/api/admin/tec/service-technical/{contractId}` | Datos técnicos del servicio. Cambios generan comando. |
| [API-TEC-36](#API-TEC-36) | GET | `/api/admin/tec/works` | Obras y contribución. |
| [API-TEC-36-b](#API-TEC-36-b) | POST | `/api/admin/tec/works` | Obras y contribución. |
| [API-TEC-36-c](#API-TEC-36-c) | GET | `/api/admin/tec/works/{id}` | Obras y contribución. |
| [API-TEC-36-e](#API-TEC-36-e) | DELETE | `/api/admin/tec/works/{id}` | Obras y contribución. |
| [API-TEC-36-d](#API-TEC-36-d) | PATCH | `/api/admin/tec/works/{id}` | Obras y contribución. |
| [API-TEC-36-f](#API-TEC-36-f) | POST | `/api/admin/tec/works/{id}/beneficiaries` | Obras y contribución. |
| [API-TEC-36-g](#API-TEC-36-g) | POST | `/api/admin/tec/works/{id}/levy/simulate` | Obras y contribución. |
| [API-TEC-36-h](#API-TEC-36-h) | POST | `/api/admin/tec/works/{id}/levy/approve` | Obras y contribución. |
| [API-TEC-36-i](#API-TEC-36-i) | POST | `/api/admin/tec/works/{id}/levy/send` | Obras y contribución. |
| [API-TEC-37](#API-TEC-37) | GET | `/api/admin/tec/inspections` | Inspecciones. Separación de funciones (RN). |
| [API-TEC-37-b](#API-TEC-37-b) | POST | `/api/admin/tec/inspections` | Inspecciones. Separación de funciones (RN). |
| [API-TEC-37-c](#API-TEC-37-c) | GET | `/api/admin/tec/inspections/{id}` | Inspecciones. Separación de funciones (RN). |
| [API-TEC-37-e](#API-TEC-37-e) | DELETE | `/api/admin/tec/inspections/{id}` | Inspecciones. Separación de funciones (RN). |
| [API-TEC-37-d](#API-TEC-37-d) | PATCH | `/api/admin/tec/inspections/{id}` | Inspecciones. Separación de funciones (RN). |
| [API-TEC-37-f](#API-TEC-37-f) | POST | `/api/admin/tec/inspections/{id}/order` | Inspecciones. Separación de funciones (RN). |
| [API-TEC-37-g](#API-TEC-37-g) | POST | `/api/admin/tec/inspections/{id}/notify` | Inspecciones. Separación de funciones (RN). |
| [API-TEC-37-h](#API-TEC-37-h) | POST | `/api/admin/tec/inspections/{id}/defense` | Inspecciones. Separación de funciones (RN). |
| [API-TEC-37-i](#API-TEC-37-i) | POST | `/api/admin/tec/inspections/{id}/propose-recovery` | Inspecciones. Separación de funciones (RN). |
| [API-TEC-37-j](#API-TEC-37-j) | POST | `/api/admin/tec/inspections/{id}/approve` | Inspecciones. Separación de funciones (RN). |
| [API-TEC-37-k](#API-TEC-37-k) | POST | `/api/admin/tec/inspections/{id}/annul` | Inspecciones. Separación de funciones (RN). |
| [API-TEC-37-l](#API-TEC-37-l) | GET | `/api/admin/tec/seals` | Inspecciones. Separación de funciones (RN). |
| [API-TEC-37-m](#API-TEC-37-m) | POST | `/api/admin/tec/seals` | Inspecciones. Separación de funciones (RN). |
| [API-TEC-37-n](#API-TEC-37-n) | GET | `/api/admin/tec/seals/{id}` | Inspecciones. Separación de funciones (RN). |
| [API-TEC-37-p](#API-TEC-37-p) | DELETE | `/api/admin/tec/seals/{id}` | Inspecciones. Separación de funciones (RN). |
| [API-TEC-37-o](#API-TEC-37-o) | PATCH | `/api/admin/tec/seals/{id}` | Inspecciones. Separación de funciones (RN). |
| [API-TEC-38](#API-TEC-38) | GET | `/api/admin/tec/phone/exchanges` | Telefonía. |
| [API-TEC-38-b](#API-TEC-38-b) | POST | `/api/admin/tec/phone/exchanges` | Telefonía. |
| [API-TEC-38-c](#API-TEC-38-c) | GET | `/api/admin/tec/phone/exchanges/{id}` | Telefonía. |
| [API-TEC-38-e](#API-TEC-38-e) | DELETE | `/api/admin/tec/phone/exchanges/{id}` | Telefonía. |
| [API-TEC-38-d](#API-TEC-38-d) | PATCH | `/api/admin/tec/phone/exchanges/{id}` | Telefonía. |
| [API-TEC-38-f](#API-TEC-38-f) | GET | `/api/admin/tec/phone/ports` | Telefonía. |
| [API-TEC-38-g](#API-TEC-38-g) | POST | `/api/admin/tec/phone/ports` | Telefonía. |
| [API-TEC-38-h](#API-TEC-38-h) | GET | `/api/admin/tec/phone/ports/{id}` | Telefonía. |
| [API-TEC-38-j](#API-TEC-38-j) | DELETE | `/api/admin/tec/phone/ports/{id}` | Telefonía. |
| [API-TEC-38-i](#API-TEC-38-i) | PATCH | `/api/admin/tec/phone/ports/{id}` | Telefonía. |
| [API-TEC-38-k](#API-TEC-38-k) | GET | `/api/admin/tec/phone/frames` | Telefonía. |
| [API-TEC-38-l](#API-TEC-38-l) | POST | `/api/admin/tec/phone/frames` | Telefonía. |
| [API-TEC-38-m](#API-TEC-38-m) | GET | `/api/admin/tec/phone/frames/{id}` | Telefonía. |
| [API-TEC-38-o](#API-TEC-38-o) | DELETE | `/api/admin/tec/phone/frames/{id}` | Telefonía. |
| [API-TEC-38-n](#API-TEC-38-n) | PATCH | `/api/admin/tec/phone/frames/{id}` | Telefonía. |
| [API-TEC-38-p](#API-TEC-38-p) | GET | `/api/admin/tec/phone/frame-groups` | Telefonía. |
| [API-TEC-38-q](#API-TEC-38-q) | POST | `/api/admin/tec/phone/frame-groups` | Telefonía. |
| [API-TEC-38-r](#API-TEC-38-r) | GET | `/api/admin/tec/phone/frame-groups/{id}` | Telefonía. |
| [API-TEC-38-t](#API-TEC-38-t) | DELETE | `/api/admin/tec/phone/frame-groups/{id}` | Telefonía. |
| [API-TEC-38-s](#API-TEC-38-s) | PATCH | `/api/admin/tec/phone/frame-groups/{id}` | Telefonía. |
| [API-TEC-38-u](#API-TEC-38-u) | GET | `/api/admin/tec/phone/strips` | Telefonía. |
| [API-TEC-38-v](#API-TEC-38-v) | POST | `/api/admin/tec/phone/strips` | Telefonía. |
| [API-TEC-38-w](#API-TEC-38-w) | GET | `/api/admin/tec/phone/strips/{id}` | Telefonía. |
| [API-TEC-38-y](#API-TEC-38-y) | DELETE | `/api/admin/tec/phone/strips/{id}` | Telefonía. |
| [API-TEC-38-x](#API-TEC-38-x) | PATCH | `/api/admin/tec/phone/strips/{id}` | Telefonía. |
| [API-TEC-38-z](#API-TEC-38-z) | GET | `/api/admin/tec/phone/positions` | Telefonía. |
| [API-TEC-38-26](#API-TEC-38-26) | POST | `/api/admin/tec/phone/positions` | Telefonía. |
| [API-TEC-38-27](#API-TEC-38-27) | GET | `/api/admin/tec/phone/positions/{id}` | Telefonía. |
| [API-TEC-38-29](#API-TEC-38-29) | DELETE | `/api/admin/tec/phone/positions/{id}` | Telefonía. |
| [API-TEC-38-28](#API-TEC-38-28) | PATCH | `/api/admin/tec/phone/positions/{id}` | Telefonía. |
| [API-TEC-38-30](#API-TEC-38-30) | GET | `/api/admin/tec/phone/boxes` | Telefonía. |
| [API-TEC-38-31](#API-TEC-38-31) | POST | `/api/admin/tec/phone/boxes` | Telefonía. |
| [API-TEC-38-32](#API-TEC-38-32) | GET | `/api/admin/tec/phone/boxes/{id}` | Telefonía. |
| [API-TEC-38-34](#API-TEC-38-34) | DELETE | `/api/admin/tec/phone/boxes/{id}` | Telefonía. |
| [API-TEC-38-33](#API-TEC-38-33) | PATCH | `/api/admin/tec/phone/boxes/{id}` | Telefonía. |
| [API-TEC-38-35](#API-TEC-38-35) | GET | `/api/admin/tec/phone/dslams` | Telefonía. |
| [API-TEC-38-36](#API-TEC-38-36) | POST | `/api/admin/tec/phone/dslams` | Telefonía. |
| [API-TEC-38-37](#API-TEC-38-37) | GET | `/api/admin/tec/phone/dslams/{id}` | Telefonía. |
| [API-TEC-38-39](#API-TEC-38-39) | DELETE | `/api/admin/tec/phone/dslams/{id}` | Telefonía. |
| [API-TEC-38-38](#API-TEC-38-38) | PATCH | `/api/admin/tec/phone/dslams/{id}` | Telefonía. |
| [API-TEC-38-40](#API-TEC-38-40) | GET | `/api/admin/tec/phone/prefixes` | Telefonía. |
| [API-TEC-38-41](#API-TEC-38-41) | POST | `/api/admin/tec/phone/prefixes` | Telefonía. |
| [API-TEC-38-42](#API-TEC-38-42) | GET | `/api/admin/tec/phone/prefixes/{id}` | Telefonía. |
| [API-TEC-38-44](#API-TEC-38-44) | DELETE | `/api/admin/tec/phone/prefixes/{id}` | Telefonía. |
| [API-TEC-38-43](#API-TEC-38-43) | PATCH | `/api/admin/tec/phone/prefixes/{id}` | Telefonía. |
| [API-TEC-38-45](#API-TEC-38-45) | GET | `/api/admin/tec/phone/numbers` | Telefonía. |
| [API-TEC-38-46](#API-TEC-38-46) | POST | `/api/admin/tec/phone/numbers` | Telefonía. |
| [API-TEC-38-47](#API-TEC-38-47) | GET | `/api/admin/tec/phone/numbers/{id}` | Telefonía. |
| [API-TEC-38-49](#API-TEC-38-49) | DELETE | `/api/admin/tec/phone/numbers/{id}` | Telefonía. |
| [API-TEC-38-48](#API-TEC-38-48) | PATCH | `/api/admin/tec/phone/numbers/{id}` | Telefonía. |
| [API-TEC-38-50](#API-TEC-38-50) | GET | `/api/admin/tec/phone/lines` | Telefonía. |
| [API-TEC-38-51](#API-TEC-38-51) | POST | `/api/admin/tec/phone/lines` | Telefonía. |
| [API-TEC-38-52](#API-TEC-38-52) | GET | `/api/admin/tec/phone/lines/{id}` | Telefonía. |
| [API-TEC-38-54](#API-TEC-38-54) | DELETE | `/api/admin/tec/phone/lines/{id}` | Telefonía. |
| [API-TEC-38-53](#API-TEC-38-53) | PATCH | `/api/admin/tec/phone/lines/{id}` | Telefonía. |
| [API-TEC-38-55](#API-TEC-38-55) | GET | `/api/admin/tec/phone/operators` | Telefonía. |
| [API-TEC-38-56](#API-TEC-38-56) | POST | `/api/admin/tec/phone/operators` | Telefonía. |
| [API-TEC-38-57](#API-TEC-38-57) | GET | `/api/admin/tec/phone/operators/{id}` | Telefonía. |
| [API-TEC-38-59](#API-TEC-38-59) | DELETE | `/api/admin/tec/phone/operators/{id}` | Telefonía. |
| [API-TEC-38-58](#API-TEC-38-58) | PATCH | `/api/admin/tec/phone/operators/{id}` | Telefonía. |
| [API-TEC-38-60](#API-TEC-38-60) | GET | `/api/admin/tec/phone/service-types` | Telefonía. |
| [API-TEC-38-61](#API-TEC-38-61) | POST | `/api/admin/tec/phone/service-types` | Telefonía. |
| [API-TEC-38-62](#API-TEC-38-62) | GET | `/api/admin/tec/phone/service-types/{id}` | Telefonía. |
| [API-TEC-38-64](#API-TEC-38-64) | DELETE | `/api/admin/tec/phone/service-types/{id}` | Telefonía. |
| [API-TEC-38-63](#API-TEC-38-63) | PATCH | `/api/admin/tec/phone/service-types/{id}` | Telefonía. |
| [API-TEC-38-65](#API-TEC-38-65) | GET | `/api/admin/tec/phone/modalities` | Telefonía. |
| [API-TEC-38-66](#API-TEC-38-66) | POST | `/api/admin/tec/phone/modalities` | Telefonía. |
| [API-TEC-38-67](#API-TEC-38-67) | GET | `/api/admin/tec/phone/modalities/{id}` | Telefonía. |
| [API-TEC-38-69](#API-TEC-38-69) | DELETE | `/api/admin/tec/phone/modalities/{id}` | Telefonía. |
| [API-TEC-38-68](#API-TEC-38-68) | PATCH | `/api/admin/tec/phone/modalities/{id}` | Telefonía. |
| [API-TEC-39](#API-TEC-39) | POST | `/api/admin/tec/phone/cdr-imports` | CDR y móvil. Subida por URL firmada. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes POST · GET · POST; PA-... |
| [API-TEC-39-b](#API-TEC-39-b) | GET | `/api/admin/tec/phone/cdr-imports/{id}` | CDR y móvil. Subida por URL firmada. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes POST · GET · POST; PA-... |
| [API-TEC-39-c](#API-TEC-39-c) | POST | `/api/admin/tec/phone/cdr-imports/{id}/attribute` | CDR y móvil. Subida por URL firmada. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes POST · GET · POST; PA-... |
| [API-TEC-39-d](#API-TEC-39-d) | POST | `/api/admin/tec/phone/cdr-imports/{id}/rollback` | CDR y móvil. Subida por URL firmada. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes POST · GET · POST; PA-... |
| [API-TEC-39-e](#API-TEC-39-e) | POST | `/api/admin/tec/phone/mobile-imports` | CDR y móvil. Subida por URL firmada. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes POST · GET · POST; PA-... |
| [API-TEC-40](#API-TEC-40) | GET | `/api/portal/tec/availability` | Reserva del socio. Rate limit. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes GET · POST; PA-TEC-23). |
| [API-TEC-40-b](#API-TEC-40-b) | POST | `/api/portal/tec/bookings` | Reserva del socio. Rate limit. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes GET · POST; PA-TEC-23). |
| [API-TEC-40-c](#API-TEC-40-c) | POST | `/api/portal/tec/bookings/{id}/confirm` | Reserva del socio. Rate limit. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes GET · POST; PA-TEC-23). |
| [API-TEC-41](#API-TEC-41) | GET | `/api/portal/tec/visits/{id}` | Seguimiento. Solo datos propios. |
| [API-TEC-41-b](#API-TEC-41-b) | POST | `/api/portal/tec/visits/{id}/reschedule` | Seguimiento. Solo datos propios. |
| [API-TEC-41-c](#API-TEC-41-c) | POST | `/api/portal/tec/visits/{id}/cancel` | Seguimiento. Solo datos propios. |
| [API-TEC-41-d](#API-TEC-41-d) | GET | `/api/portal/tec/feasibility/{id}` | Seguimiento. Solo datos propios. |
| [API-TEC-42](#API-TEC-42) | GET | `/api/field/my-day` | Paquete del día. ETag; delta desde since. |
| [API-TEC-43](#API-TEC-43) | POST | `/api/field/sync` | Lote de mutaciones. Resultado por ítem (applied/duplicate/conflict/rejected/deferred). |
| [API-TEC-44](#API-TEC-44) | POST | `/api/field/evidence/upload-url` | URL firmada para foto/firma. Tamaño máx. PRM-TEC-144. |
| [API-TEC-45](#API-TEC-45) | GET | `/api/field/custody` | Custodia del técnico (proxy a M13). |
| [API-TEC-46](#API-TEC-46) | POST | `/api/field/devices/register` | Dispositivos. Revocación borra caché local al próximo contacto. |
| [API-TEC-46-b](#API-TEC-46-b) | POST | `/api/field/devices/revoke` | Dispositivos. Revocación borra caché local al próximo contacto. |
| [API-TEC-47](#API-TEC-47) | GET | `/api/admin/tec/geo/review` | Geolocalización. Proveedor abstraído (PRM-TEC-149). Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes GET · P... |
| [API-TEC-47-b](#API-TEC-47-b) | PATCH | `/api/admin/tec/geo/points/{id}` | Geolocalización. Proveedor abstraído (PRM-TEC-149). Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes GET · P... |
| [API-TEC-47-c](#API-TEC-47-c) | POST | `/api/admin/tec/geo/geocode` | Geolocalización. Proveedor abstraído (PRM-TEC-149). Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes GET · P... |
| [API-TEC-48](#API-TEC-48) | GET | `/api/admin/tec/reports/{reportId}` | Informes. Exportación CSV/XLSX/PDF. |
| [API-TEC-49](#API-TEC-49) | POST | `/api/v1/ext/tec/work-orders` | Alta externa de OT (contratistas, sistemas). Idempotente. |
| [API-TEC-50](#API-TEC-50) | POST | `/api/v1/ext/tec/provisioning/callback/{systemId}` | Callback de sistemas externos. Verifica firma y replay. |
| [API-TEC-51](#API-TEC-51) | GET | `/api/admin/tec/on-call/shifts` | Guardias y emergencias (HUE-GAS-05). current lo consume M09 para el teléfono de guardia (PRM-CRM-019). |
| [API-TEC-51-b](#API-TEC-51-b) | POST | `/api/admin/tec/on-call/shifts` | Guardias y emergencias (HUE-GAS-05). current lo consume M09 para el teléfono de guardia (PRM-CRM-019). |
| [API-TEC-51-c](#API-TEC-51-c) | GET | `/api/admin/tec/on-call/shifts/{id}` | Guardias y emergencias (HUE-GAS-05). current lo consume M09 para el teléfono de guardia (PRM-CRM-019). |
| [API-TEC-51-e](#API-TEC-51-e) | DELETE | `/api/admin/tec/on-call/shifts/{id}` | Guardias y emergencias (HUE-GAS-05). current lo consume M09 para el teléfono de guardia (PRM-CRM-019). |
| [API-TEC-51-d](#API-TEC-51-d) | PATCH | `/api/admin/tec/on-call/shifts/{id}` | Guardias y emergencias (HUE-GAS-05). current lo consume M09 para el teléfono de guardia (PRM-CRM-019). |
| [API-TEC-51-f](#API-TEC-51-f) | GET | `/api/admin/tec/on-call/current` | Guardias y emergencias (HUE-GAS-05). current lo consume M09 para el teléfono de guardia (PRM-CRM-019). |
| [API-TEC-51-g](#API-TEC-51-g) | POST | `/api/admin/tec/work-orders/{id}/emergency/accept` | Guardias y emergencias (HUE-GAS-05). current lo consume M09 para el teléfono de guardia (PRM-CRM-019). |
| [API-TEC-51-h](#API-TEC-51-h) | POST | `/api/admin/tec/work-orders/{id}/emergency/arrive` | Guardias y emergencias (HUE-GAS-05). current lo consume M09 para el teléfono de guardia (PRM-CRM-019). |
| [API-TEC-51-i](#API-TEC-51-i) | POST | `/api/admin/tec/work-orders/{id}/emergency/safe` | Guardias y emergencias (HUE-GAS-05). current lo consume M09 para el teléfono de guardia (PRM-CRM-019). |
| [API-TEC-52](#API-TEC-52) | GET | `/api/admin/tec/emergency-protocols` | Protocolos de emergencia. Versionado: una OT conserva la versión aplicada. |
| [API-TEC-52-b](#API-TEC-52-b) | POST | `/api/admin/tec/emergency-protocols` | Protocolos de emergencia. Versionado: una OT conserva la versión aplicada. |
| [API-TEC-52-c](#API-TEC-52-c) | GET | `/api/admin/tec/emergency-protocols/{id}` | Protocolos de emergencia. Versionado: una OT conserva la versión aplicada. |
| [API-TEC-52-e](#API-TEC-52-e) | DELETE | `/api/admin/tec/emergency-protocols/{id}` | Protocolos de emergencia. Versionado: una OT conserva la versión aplicada. |
| [API-TEC-52-d](#API-TEC-52-d) | PATCH | `/api/admin/tec/emergency-protocols/{id}` | Protocolos de emergencia. Versionado: una OT conserva la versión aplicada. |
| [API-TEC-53](#API-TEC-53) | GET | `/api/admin/tec/phone/portings` | Portabilidad numérica (PA-TEC-19). 404 tec.feature.disabled si PRM-TEC-156 = false. |
| [API-TEC-53-b](#API-TEC-53-b) | POST | `/api/admin/tec/phone/portings` | Portabilidad numérica (PA-TEC-19). 404 tec.feature.disabled si PRM-TEC-156 = false. |
| [API-TEC-53-c](#API-TEC-53-c) | POST | `/api/admin/tec/phone/portings/{id}/submit` | Portabilidad numérica (PA-TEC-19). 404 tec.feature.disabled si PRM-TEC-156 = false. |
| [API-TEC-53-d](#API-TEC-53-d) | POST | `/api/admin/tec/phone/portings/{id}/accept` | Portabilidad numérica (PA-TEC-19). 404 tec.feature.disabled si PRM-TEC-156 = false. |
| [API-TEC-53-e](#API-TEC-53-e) | POST | `/api/admin/tec/phone/portings/{id}/reject` | Portabilidad numérica (PA-TEC-19). 404 tec.feature.disabled si PRM-TEC-156 = false. |
| [API-TEC-53-f](#API-TEC-53-f) | POST | `/api/admin/tec/phone/portings/{id}/schedule` | Portabilidad numérica (PA-TEC-19). 404 tec.feature.disabled si PRM-TEC-156 = false. |
| [API-TEC-53-g](#API-TEC-53-g) | POST | `/api/admin/tec/phone/portings/{id}/execute` | Portabilidad numérica (PA-TEC-19). 404 tec.feature.disabled si PRM-TEC-156 = false. |
| [API-TEC-53-h](#API-TEC-53-h) | POST | `/api/admin/tec/phone/portings/{id}/cancel` | Portabilidad numérica (PA-TEC-19). 404 tec.feature.disabled si PRM-TEC-156 = false. |
| [API-TEC-54](#API-TEC-54) | GET | `/api/admin/tec/water-quality/points` | Calidad del agua (PA-TEC-20). Resultados solo con labReportDocumentId (T11); 404 si PRM-TEC-157 = false. |
| [API-TEC-54-b](#API-TEC-54-b) | POST | `/api/admin/tec/water-quality/points` | Calidad del agua (PA-TEC-20). Resultados solo con labReportDocumentId (T11); 404 si PRM-TEC-157 = false. |
| [API-TEC-54-c](#API-TEC-54-c) | GET | `/api/admin/tec/water-quality/points/{id}` | Calidad del agua (PA-TEC-20). Resultados solo con labReportDocumentId (T11); 404 si PRM-TEC-157 = false. |
| [API-TEC-54-e](#API-TEC-54-e) | DELETE | `/api/admin/tec/water-quality/points/{id}` | Calidad del agua (PA-TEC-20). Resultados solo con labReportDocumentId (T11); 404 si PRM-TEC-157 = false. |
| [API-TEC-54-d](#API-TEC-54-d) | PATCH | `/api/admin/tec/water-quality/points/{id}` | Calidad del agua (PA-TEC-20). Resultados solo con labReportDocumentId (T11); 404 si PRM-TEC-157 = false. |
| [API-TEC-54-f](#API-TEC-54-f) | GET | `/api/admin/tec/water-quality/samples` | Calidad del agua (PA-TEC-20). Resultados solo con labReportDocumentId (T11); 404 si PRM-TEC-157 = false. |
| [API-TEC-54-g](#API-TEC-54-g) | POST | `/api/admin/tec/water-quality/samples` | Calidad del agua (PA-TEC-20). Resultados solo con labReportDocumentId (T11); 404 si PRM-TEC-157 = false. |
| [API-TEC-54-h](#API-TEC-54-h) | POST | `/api/admin/tec/water-quality/samples/{id}/results` | Calidad del agua (PA-TEC-20). Resultados solo con labReportDocumentId (T11); 404 si PRM-TEC-157 = false. |
| [API-TEC-54-i](#API-TEC-54-i) | POST | `/api/admin/tec/water-quality/samples/{id}/corrective-action` | Calidad del agua (PA-TEC-20). Resultados solo con labReportDocumentId (T11); 404 si PRM-TEC-157 = false. |
| [API-TEC-54-j](#API-TEC-54-j) | POST | `/api/admin/tec/water-quality/samples/{id}/close` | Calidad del agua (PA-TEC-20). Resultados solo con labReportDocumentId (T11); 404 si PRM-TEC-157 = false. |
| [API-TEC-55](#API-TEC-55) | GET | `/api/internal/tec/contracts/{contractId}/calls` | Llamadas atribuidas por contrato y período (RF-TEC-237). Solo lectura; destino enmascarado salvo tec.telefonia.lineas.ver, tec.telefonia.... |

<a id="API-TEC-01"></a>
#### API-TEC-01 · `GET /api/admin/tec/feasibility`

- **Qué hace:** Listar / crear factibilidad. Filtros estado, servicio, zona, vigencia. Lista, con filtros y paginación, los registros de `feasibility`.
- **Para qué sirve:** RF-TEC-047: Órdenes encadenadas por reglas: al crear OT de operación X sobre servicio S (filtros: categoría, localidad, referencia, zona de lectura, actividad, clase, propiedad, tipo de medidor, operación) crear OT de operación Y sobre… · RF-TEC-010: Vigencia configurable de la factibilidad para su uso en un alta (default 90 días) y uso único (sin servicio asociado previo). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.factibilidad.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ResultadoGenerico (`ResultadoGenerico`) con `total`.
- **Pantallas:** PAN-TEC-01 (Bandeja de factibilidades).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2715 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-01)

<a id="API-TEC-01-b"></a>
#### API-TEC-01-b · `POST /api/admin/tec/feasibility`

- **Qué hace:** Listar / crear factibilidad. Filtros estado, servicio, zona, vigencia. Registra un nuevo elemento u operación en `feasibility`.
- **Para qué sirve:** RF-TEC-047: Órdenes encadenadas por reglas: al crear OT de operación X sobre servicio S (filtros: categoría, localidad, referencia, zona de lectura, actividad, clase, propiedad, tipo de medidor, operación) crear OT de operación Y sobre… · RF-TEC-010: Vigencia configurable de la factibilidad para su uso en un alta (default 90 días) y uso único (sin servicio asociado previo). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.factibilidad.crear`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2715 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-01-b)

<a id="API-TEC-02"></a>
#### API-TEC-02 · `GET /api/admin/tec/feasibility/{id}`

- **Qué hace:** Ficha / editar. Cambios versionados. Obtiene el detalle de un registro de `feasibility`.
- **Para qué sirve:** RF-TEC-013: Permitir modificar factibilidades cerradas y adjuntar documentos a factibilidades cerradas solo con capability y parámetro, conservando versión anterior. · RF-TEC-215: Mostrar el punto de prestación en Google Maps en factibilidad, OT, visita, ficha del servicio y mapa operativo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.factibilidad.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-01 (Bandeja de factibilidades).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2716 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-02)

<a id="API-TEC-02-b"></a>
#### API-TEC-02-b · `PATCH /api/admin/tec/feasibility/{id}`

- **Qué hace:** Ficha / editar. Cambios versionados. Modifica algunos campos de un registro de `feasibility` (solo los enviados).
- **Para qué sirve:** RF-TEC-013: Permitir modificar factibilidades cerradas y adjuntar documentos a factibilidades cerradas solo con capability y parámetro, conservando versión anterior. · RF-TEC-215: Mostrar el punto de prestación en Google Maps en factibilidad, OT, visita, ficha del servicio y mapa operativo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.factibilidad.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2716 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-02-b)

<a id="API-TEC-03"></a>
#### API-TEC-03 · `POST /api/admin/tec/feasibility/{id}/verdict`

- **Qué hace:** Dictaminar. Motivo y responsable obligatorios. Registra «verdict» sobre un registro de `verdict`.
- **Para qué sirve:** RF-TEC-008: Dictaminar factibilidad Factible/No factible con motivo obligatorio, observación técnica, responsable técnico y estado técnico provisorio/definitivo; estado administrativo provisorio/definitivo separado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.factibilidad.evaluar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-02 (Ficha de factibilidad).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2717 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-03)

<a id="API-TEC-04"></a>
#### API-TEC-04 · `POST /api/admin/tec/feasibility/{id}/cancel`

- **Qué hace:** Anular / reabrir. Reapertura según PRM-TEC-064. Cancela un registro de `cancel`.
- **Para qué sirve:** RF-TEC-009: Anular factibilidad con motivo; una factibilidad anulada nunca es utilizable para un alta. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.factibilidad.cancelar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2718 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-04)

<a id="API-TEC-04-b"></a>
#### API-TEC-04-b · `POST /api/admin/tec/feasibility/{id}/reopen`

- **Qué hace:** Anular / reabrir. Reapertura según PRM-TEC-064. Reabre un registro de `reopen`.
- **Para qué sirve:** RF-TEC-009: Anular factibilidad con motivo; una factibilidad anulada nunca es utilizable para un alta. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.factibilidad.cancelar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2718 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-04-b)

<a id="API-TEC-05"></a>
#### API-TEC-05 · `GET /api/admin/tec/feasibility/{id}/resource-proposal`

- **Qué hace:** Proponer recurso de red. Consulta GIS de capacidad. Consulta «resource-proposal» de un registro de `resource-proposal`.
- **Para qué sirve:** RF-TEC-007: Consultar automáticamente cobertura y disponibilidad del recurso de conexión (zona, nodo, puertos/bornes libres en red GIS, capacidad de OLT/splitter) y proponerla al evaluador. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.factibilidad.evaluar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-02 (Ficha de factibilidad).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2719 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-05)

<a id="API-TEC-06"></a>
#### API-TEC-06 · `GET /api/admin/tec/estimates`

- **Qué hace:** Estimación y envío a M11. Lista, con filtros y paginación, los registros de estimación técnica de conexión (`connectionEstimates`).
- **Para qué sirve:** RF-TEC-018: Preparar estimación técnica de conexión con materiales (desde catálogo M13), mano de obra (horas por rol), obra de red necesaria y extensión de red, vinculada a la factibilidad. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.estimaciones.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de estimación técnica de conexión (`connectionEstimates`) con `total`.
- **Pantallas:** PAN-TEC-03 (Estimación técnica).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2720 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-06)

<a id="API-TEC-06-b"></a>
#### API-TEC-06-b · `POST /api/admin/tec/estimates`

- **Qué hace:** Estimación y envío a M11. Da de alta un registro de estimación técnica de conexión (`connectionEstimates`).
- **Para qué sirve:** RF-TEC-018: Preparar estimación técnica de conexión con materiales (desde catálogo M13), mano de obra (horas por rol), obra de red necesaria y extensión de red, vinculada a la factibilidad. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.estimaciones.gestionar`.
- **Recibe:** los datos de estimación técnica de conexión (`connectionEstimates`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de estimación técnica de conexión (`connectionEstimates`).
- **Pantallas:** PAN-TEC-03 (Estimación técnica).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2720 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-06-b)

<a id="API-TEC-06-c"></a>
#### API-TEC-06-c · `GET /api/admin/tec/estimates/{id}`

- **Qué hace:** Estimación y envío a M11. Obtiene el detalle de un registro de estimación técnica de conexión (`connectionEstimates`).
- **Para qué sirve:** RF-TEC-018: Preparar estimación técnica de conexión con materiales (desde catálogo M13), mano de obra (horas por rol), obra de red necesaria y extensión de red, vinculada a la factibilidad. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.estimaciones.gestionar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de estimación técnica de conexión (`connectionEstimates`).
- **Pantallas:** PAN-TEC-03 (Estimación técnica).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2720 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-06-c)

<a id="API-TEC-06-d"></a>
#### API-TEC-06-d · `PATCH /api/admin/tec/estimates/{id}`

- **Qué hace:** Estimación y envío a M11. Modifica algunos campos de un registro de estimación técnica de conexión (`connectionEstimates`) (solo los enviados).
- **Para qué sirve:** RF-TEC-018: Preparar estimación técnica de conexión con materiales (desde catálogo M13), mano de obra (horas por rol), obra de red necesaria y extensión de red, vinculada a la factibilidad. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.estimaciones.gestionar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de estimación técnica de conexión (`connectionEstimates`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de estimación técnica de conexión (`connectionEstimates`).
- **Pantallas:** PAN-TEC-03 (Estimación técnica).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2720 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-06-d)

<a id="API-TEC-06-e"></a>
#### API-TEC-06-e · `POST /api/admin/tec/estimates/{id}/submit`

- **Qué hace:** Estimación y envío a M11. Envía a revisión o presenta un registro de estimación técnica de conexión (`connectionEstimates`).
- **Para qué sirve:** RF-TEC-018: Preparar estimación técnica de conexión con materiales (desde catálogo M13), mano de obra (horas por rol), obra de red necesaria y extensión de red, vinculada a la factibilidad. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.estimaciones.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-03 (Estimación técnica).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2720 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-06-e)

<a id="API-TEC-07"></a>
#### API-TEC-07 · `GET /api/admin/tec/work-orders`

- **Qué hace:** Listar / crear OT. Creación valida duplicados (409 tec.workOrder.duplicate). Lista, con filtros y paginación, los registros de órdenes de trabajo (`workOrders`).
- **Para qué sirve:** RF-TEC-111: Vías de ingreso de OT (teléfono, mostrador, web, app, WhatsApp, API) con validación de celular/mail y vía por defecto; solicitar vía al crear según parámetro. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.ordenes.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de órdenes de trabajo (`workOrders`) con `total`.
- **Pantallas:** PAN-TEC-04 (Tablero de OT).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2721 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-07)

<a id="API-TEC-07-b"></a>
#### API-TEC-07-b · `POST /api/admin/tec/work-orders`

- **Qué hace:** Listar / crear OT. Creación valida duplicados (409 tec.workOrder.duplicate). Da de alta un registro de órdenes de trabajo (`workOrders`).
- **Para qué sirve:** RF-TEC-111: Vías de ingreso de OT (teléfono, mostrador, web, app, WhatsApp, API) con validación de celular/mail y vía por defecto; solicitar vía al crear según parámetro. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.ordenes.crear`.
- **Recibe:** los datos de órdenes de trabajo (`workOrders`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de órdenes de trabajo (`workOrders`).
- **Pantallas:** PAN-TEC-06 (Asistentes de operación), PAN-TEC-49 (Carga rápida de reclamo).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2721 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-07-b)

<a id="API-TEC-08"></a>
#### API-TEC-08 · `GET /api/admin/tec/work-orders/{id}`

- **Qué hace:** Ficha / editar. Bloqueada si dispatch.locked (423). Obtiene el detalle de un registro de órdenes de trabajo (`workOrders`).
- **Para qué sirve:** RF-TEC-052: Confirmación/cierre masivo de OT con los mismos datos (fecha, responsable, incidente, resolución, tipo de trabajo, móviles, cuadrilla, horas, personas, observaciones) y notificación opcional al socio; excluye las bloqueadas por… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.ordenes.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de órdenes de trabajo (`workOrders`).
- **Pantallas:** PAN-TEC-04 (Tablero de OT).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2722 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-08)

<a id="API-TEC-08-b"></a>
#### API-TEC-08-b · `PATCH /api/admin/tec/work-orders/{id}`

- **Qué hace:** Ficha / editar. Bloqueada si dispatch.locked (423). Modifica algunos campos de un registro de órdenes de trabajo (`workOrders`) (solo los enviados).
- **Para qué sirve:** RF-TEC-052: Confirmación/cierre masivo de OT con los mismos datos (fecha, responsable, incidente, resolución, tipo de trabajo, móviles, cuadrilla, horas, personas, observaciones) y notificación opcional al socio; excluye las bloqueadas por… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.ordenes.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de órdenes de trabajo (`workOrders`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de órdenes de trabajo (`workOrders`).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2722 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-08-b)

<a id="API-TEC-09"></a>
#### API-TEC-09 · `POST /api/admin/tec/work-orders/{id}/schedule`

- **Qué hace:** Transiciones operativas. Programa un registro de órdenes de trabajo (`workOrders`).
- **Para qué sirve:** RF-TEC-085: Concertar cita de instalación (visita confirmada) con asignación operativa. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.despacho.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-10 (Despacho).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2723 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-09)

<a id="API-TEC-09-b"></a>
#### API-TEC-09-b · `POST /api/admin/tec/work-orders/{id}/assign`

- **Qué hace:** Transiciones operativas. Asigna un registro de órdenes de trabajo (`workOrders`).
- **Para qué sirve:** RF-TEC-085: Concertar cita de instalación (visita confirmada) con asignación operativa. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.despacho.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-10 (Despacho).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2723 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-09-b)

<a id="API-TEC-09-c"></a>
#### API-TEC-09-c · `POST /api/admin/tec/work-orders/{id}/dispatch`

- **Qué hace:** Transiciones operativas. Despacha un registro de órdenes de trabajo (`workOrders`).
- **Para qué sirve:** RF-TEC-085: Concertar cita de instalación (visita confirmada) con asignación operativa. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.despacho.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-10 (Despacho).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2723 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-09-c)

<a id="API-TEC-09-d"></a>
#### API-TEC-09-d · `POST /api/admin/tec/work-orders/{id}/recall`

- **Qué hace:** Transiciones operativas. Retira o reclama un registro de órdenes de trabajo (`workOrders`).
- **Para qué sirve:** RF-TEC-085: Concertar cita de instalación (visita confirmada) con asignación operativa. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.despacho.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-10 (Despacho).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2723 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-09-d)

<a id="API-TEC-09-e"></a>
#### API-TEC-09-e · `POST /api/admin/tec/work-orders/{id}/hold`

- **Qué hace:** Transiciones operativas. Retiene un registro de órdenes de trabajo (`workOrders`).
- **Para qué sirve:** RF-TEC-085: Concertar cita de instalación (visita confirmada) con asignación operativa. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.despacho.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-10 (Despacho).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2723 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-09-e)

<a id="API-TEC-09-f"></a>
#### API-TEC-09-f · `POST /api/admin/tec/work-orders/{id}/resume`

- **Qué hace:** Transiciones operativas. Reanuda un registro de órdenes de trabajo (`workOrders`).
- **Para qué sirve:** RF-TEC-085: Concertar cita de instalación (visita confirmada) con asignación operativa. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.despacho.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-10 (Despacho).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2723 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-09-f)

<a id="API-TEC-10"></a>
#### API-TEC-10 · `POST /api/admin/tec/work-orders/{id}/execute`

- **Qué hace:** Marcar ejecutada (administrativa). Ejecuta un registro de órdenes de trabajo (`workOrders`).
- **Para qué sirve:** RF-TEC-037: Doble paso opcional por operación: Ejecutada (campo) y Cerrada/Confirmada (revisión administrativa/supervisión); no mezclar ambos conceptos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.ordenes.ejecutar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-WFL-28 (Acta de conformidad).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2724 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-10)

<a id="API-TEC-11"></a>
#### API-TEC-11 · `POST /api/admin/tec/work-orders/{id}/close`

- **Qué hace:** Confirmar / cerrar. Devuelve 202 si quedan pasos asíncronos. Cierra un registro de órdenes de trabajo (`workOrders`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-TEC-122: Cerrar OT desde la app (si V2 #48), cerrar operaciones seleccionadas en lote (V2 #54), confirmación al cancelar (V2 #62), mostrar número de medidor en lista (V2 #64). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.ordenes.cerrar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2725 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-11)

<a id="API-TEC-12"></a>
#### API-TEC-12 · `POST /api/admin/tec/work-orders/{id}/cancel`

- **Qué hace:** Anular / reabrir / restablecer. Compensación. Cancela un registro de órdenes de trabajo (`workOrders`).
- **Para qué sirve:** RF-TEC-045: Restablecer (reabrir) una OT anulada o cerrada con capability, motivo y reglas de reversión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.ordenes.cancelar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2726 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-12)

<a id="API-TEC-12-b"></a>
#### API-TEC-12-b · `POST /api/admin/tec/work-orders/{id}/reopen`

- **Qué hace:** Anular / reabrir / restablecer. Compensación. Reabre un registro de órdenes de trabajo (`workOrders`).
- **Para qué sirve:** RF-TEC-045: Restablecer (reabrir) una OT anulada o cerrada con capability, motivo y reglas de reversión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.ordenes.cancelar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2726 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-12-b)

<a id="API-TEC-12-c"></a>
#### API-TEC-12-c · `POST /api/admin/tec/work-orders/{id}/restore`

- **Qué hace:** Anular / reabrir / restablecer. Compensación. Restaura un registro de órdenes de trabajo (`workOrders`).
- **Para qué sirve:** RF-TEC-045: Restablecer (reabrir) una OT anulada o cerrada con capability, motivo y reglas de reversión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.ordenes.cancelar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2726 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-12-c)

<a id="API-TEC-13"></a>
#### API-TEC-13 · `GET /api/admin/tec/work-orders/{id}/tasks`

- **Qué hace:** Subrecursos. Evidencias: URL firmada de subida. Consulta «tasks» de un registro de órdenes de trabajo (`workOrders`).
- **Para qué sirve:** RF-TEC-096: Derivar insatisfacción a M09 según umbral configurable sin eliminar la evidencia de la encuesta. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.ordenes.editar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de órdenes de trabajo (`workOrders`).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2727 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-13)

<a id="API-TEC-13-b"></a>
#### API-TEC-13-b · `POST /api/admin/tec/work-orders/{id}/tasks`

- **Qué hace:** Subrecursos. Evidencias: URL firmada de subida. Agrega un elemento («tasks») a un registro de órdenes de trabajo (`workOrders`).
- **Para qué sirve:** RF-TEC-096: Derivar insatisfacción a M09 según umbral configurable sin eliminar la evidencia de la encuesta. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.ordenes.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2727 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-13-b)

<a id="API-TEC-13-c"></a>
#### API-TEC-13-c · `GET /api/admin/tec/work-orders/{id}/notes`

- **Qué hace:** Subrecursos. Evidencias: URL firmada de subida. Consulta «notes» de un registro de órdenes de trabajo (`workOrders`).
- **Para qué sirve:** RF-TEC-096: Derivar insatisfacción a M09 según umbral configurable sin eliminar la evidencia de la encuesta. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.ordenes.editar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de órdenes de trabajo (`workOrders`).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2727 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-13-c)

<a id="API-TEC-13-d"></a>
#### API-TEC-13-d · `POST /api/admin/tec/work-orders/{id}/notes`

- **Qué hace:** Subrecursos. Evidencias: URL firmada de subida. Agrega un elemento («notes») a un registro de órdenes de trabajo (`workOrders`).
- **Para qué sirve:** RF-TEC-096: Derivar insatisfacción a M09 según umbral configurable sin eliminar la evidencia de la encuesta. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.ordenes.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2727 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-13-d)

<a id="API-TEC-13-e"></a>
#### API-TEC-13-e · `GET /api/admin/tec/work-orders/{id}/extra-data`

- **Qué hace:** Subrecursos. Evidencias: URL firmada de subida. Consulta «extra-data» de un registro de órdenes de trabajo (`workOrders`).
- **Para qué sirve:** RF-TEC-096: Derivar insatisfacción a M09 según umbral configurable sin eliminar la evidencia de la encuesta. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.ordenes.editar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de órdenes de trabajo (`workOrders`).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2727 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-13-e)

<a id="API-TEC-13-f"></a>
#### API-TEC-13-f · `POST /api/admin/tec/work-orders/{id}/extra-data`

- **Qué hace:** Subrecursos. Evidencias: URL firmada de subida. Registra «extra-data» sobre un registro de órdenes de trabajo (`workOrders`).
- **Para qué sirve:** RF-TEC-096: Derivar insatisfacción a M09 según umbral configurable sin eliminar la evidencia de la encuesta. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.ordenes.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2727 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-13-f)

<a id="API-TEC-13-g"></a>
#### API-TEC-13-g · `GET /api/admin/tec/work-orders/{id}/evidence`

- **Qué hace:** Subrecursos. Evidencias: URL firmada de subida. Consulta «evidence» de un registro de órdenes de trabajo (`workOrders`).
- **Para qué sirve:** RF-TEC-096: Derivar insatisfacción a M09 según umbral configurable sin eliminar la evidencia de la encuesta. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.ordenes.editar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de órdenes de trabajo (`workOrders`).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2727 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-13-g)

<a id="API-TEC-13-h"></a>
#### API-TEC-13-h · `POST /api/admin/tec/work-orders/{id}/evidence`

- **Qué hace:** Subrecursos. Evidencias: URL firmada de subida. Agrega un elemento («evidence») a un registro de órdenes de trabajo (`workOrders`).
- **Para qué sirve:** RF-TEC-096: Derivar insatisfacción a M09 según umbral configurable sin eliminar la evidencia de la encuesta. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.ordenes.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2727 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-13-h)

<a id="API-TEC-14"></a>
#### API-TEC-14 · `GET /api/admin/tec/work-orders/{id}/materials`

- **Qué hace:** Materiales. Delegan reserva/vale a M13. Lista, con filtros y paginación, los registros de materiales y necesidades (`workOrderMaterials`).
- **Para qué sirve:** RF-TEC-066: Necesidades de materiales (OT de mantenimiento y obras): solicitada → autorizada (usuario y fecha) → retirada → utilizada, por producto y depósito, con usuario en cada paso; listas de autorizados pendientes de retiro y retirados… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.materiales.solicitar`.
- **Recibe:** en la ruta `id`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de materiales y necesidades (`workOrderMaterials`) con `total`.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2728 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-14)

<a id="API-TEC-14-b"></a>
#### API-TEC-14-b · `POST /api/admin/tec/work-orders/{id}/materials`

- **Qué hace:** Materiales. Delegan reserva/vale a M13. Da de alta un registro de materiales y necesidades (`workOrderMaterials`).
- **Para qué sirve:** RF-TEC-066: Necesidades de materiales (OT de mantenimiento y obras): solicitada → autorizada (usuario y fecha) → retirada → utilizada, por producto y depósito, con usuario en cada paso; listas de autorizados pendientes de retiro y retirados… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.materiales.solicitar`.
- **Recibe:** en la ruta `id`; los datos de materiales y necesidades (`workOrderMaterials`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de materiales y necesidades (`workOrderMaterials`).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2728 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-14-b)

<a id="API-TEC-14-c"></a>
#### API-TEC-14-c · `POST /api/admin/tec/work-orders/{id}/materials/{mid}/authorize`

- **Qué hace:** Materiales. Delegan reserva/vale a M13. Autoriza un registro de materiales y necesidades (`workOrderMaterials`).
- **Para qué sirve:** RF-TEC-066: Necesidades de materiales (OT de mantenimiento y obras): solicitada → autorizada (usuario y fecha) → retirada → utilizada, por producto y depósito, con usuario en cada paso; listas de autorizados pendientes de retiro y retirados… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.materiales.solicitar`.
- **Recibe:** en la ruta `id`, `mid`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2728 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-14-c)

<a id="API-TEC-14-d"></a>
#### API-TEC-14-d · `POST /api/admin/tec/work-orders/{id}/materials/{mid}/cancel`

- **Qué hace:** Materiales. Delegan reserva/vale a M13. Cancela un registro de materiales y necesidades (`workOrderMaterials`).
- **Para qué sirve:** RF-TEC-066: Necesidades de materiales (OT de mantenimiento y obras): solicitada → autorizada (usuario y fecha) → retirada → utilizada, por producto y depósito, con usuario en cada paso; listas de autorizados pendientes de retiro y retirados… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.materiales.solicitar`.
- **Recibe:** en la ruta `id`, `mid`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2728 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-14-d)

<a id="API-TEC-14-e"></a>
#### API-TEC-14-e · `POST /api/admin/tec/work-orders/{id}/materials/{mid}/return`

- **Qué hace:** Materiales. Delegan reserva/vale a M13. Devuelve un registro de materiales y necesidades (`workOrderMaterials`).
- **Para qué sirve:** RF-TEC-066: Necesidades de materiales (OT de mantenimiento y obras): solicitada → autorizada (usuario y fecha) → retirada → utilizada, por producto y depósito, con usuario en cada paso; listas de autorizados pendientes de retiro y retirados… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.materiales.solicitar`.
- **Recibe:** en la ruta `id`, `mid`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2728 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-14-e)

<a id="API-TEC-15"></a>
#### API-TEC-15 · `POST /api/admin/tec/work-orders/bulk-create`

- **Qué hace:** Masivos. Job con resultado por ítem. Registra un nuevo elemento u operación en órdenes de trabajo (`workOrders`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-TEC-114: Cola única de mutaciones en IndexedDB con clientMutationId, fotos/evidencias en IndexedDB, envío por lotes a /sync con resultado por ítem, reintento automático y botón "Reintentar" en banner único. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.ordenes.crearMasivo`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-TEC-07 (Generación masiva).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2729 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-15)

<a id="API-TEC-15-b"></a>
#### API-TEC-15-b · `POST /api/admin/tec/work-orders/bulk-close`

- **Qué hace:** Masivos. Job con resultado por ítem. Registra un nuevo elemento u operación en órdenes de trabajo (`workOrders`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-TEC-114: Cola única de mutaciones en IndexedDB con clientMutationId, fotos/evidencias en IndexedDB, envío por lotes a /sync con resultado por ítem, reintento automático y botón "Reintentar" en banner único. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.ordenes.crearMasivo`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-TEC-07 (Generación masiva).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2729 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-15-b)

<a id="API-TEC-15-c"></a>
#### API-TEC-15-c · `GET /api/admin/tec/jobs/{id}`

- **Qué hace:** Masivos. Job con resultado por ítem. Obtiene el detalle de un registro de `jobs`.
- **Para qué sirve:** RF-TEC-114: Cola única de mutaciones en IndexedDB con clientMutationId, fotos/evidencias en IndexedDB, envío por lotes a /sync con resultado por ítem, reintento automático y botón "Reintentar" en banner único. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.ordenes.crearMasivo`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-07 (Generación masiva).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2729 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-15-c)

<a id="API-TEC-16"></a>
#### API-TEC-16 · `GET /api/admin/tec/work-orders/{id}/print`

- **Qué hace:** Comprobante PDF. Marca despacho (RN-TEC-011). Consulta «print» de un registro de órdenes de trabajo (`workOrders`).
- **Para qué sirve:** RF-TEC-132: Recibir órdenes de corte/suspensión/reconexión de M08 (mora) y de M09 (solicitud del socio) y crear OT (disconnect/reconnect) con marca moroso y origen gestión de mora, o comando remoto si el servicio admite corte remoto. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.ordenes.imprimir`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de órdenes de trabajo (`workOrders`).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2730 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-16)

<a id="API-TEC-17"></a>
#### API-TEC-17 · `GET /api/admin/tec/schedule/availability`

- **Qué hace:** Disponibilidad por zona/tipo/fecha. También en portal (API-TEC-40). Consulta `availability`.
- **Para qué sirve:** RF-TEC-223: Zona de agenda y elemento de red sugerido a partir del punto de prestación. · RF-TEC-084: Vista de agenda por recurso (día/semana), por zona y mapa de visitas del día. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.agenda.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2731 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-17)

<a id="API-TEC-18"></a>
#### API-TEC-18 · `POST /api/admin/tec/bookings`

- **Qué hace:** Reservas. Contador atómico; 409 tec.booking.noCapacity. Da de alta un registro de reservas de visita (`visitBookings`).
- **Para qué sirve:** RF-TEC-076: Reserva temporal con expiración configurable al elegir franja y reserva confirmada al aceptar; sin doble reserva del mismo cupo por carrera (control atómico). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.agenda.gestionar`.
- **Recibe:** los datos de reservas de visita (`visitBookings`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de reservas de visita (`visitBookings`).
- **Pantallas:** PAN-TEC-11 (Agenda).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2732 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-18)

<a id="API-TEC-18-b"></a>
#### API-TEC-18-b · `POST /api/admin/tec/bookings/{id}/confirm`

- **Qué hace:** Reservas. Contador atómico; 409 tec.booking.noCapacity. Confirma un registro de reservas de visita (`visitBookings`).
- **Para qué sirve:** RF-TEC-076: Reserva temporal con expiración configurable al elegir franja y reserva confirmada al aceptar; sin doble reserva del mismo cupo por carrera (control atómico). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.agenda.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-11 (Agenda).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2732 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-18-b)

<a id="API-TEC-18-c"></a>
#### API-TEC-18-c · `POST /api/admin/tec/bookings/{id}/release`

- **Qué hace:** Reservas. Contador atómico; 409 tec.booking.noCapacity. Libera un registro de reservas de visita (`visitBookings`).
- **Para qué sirve:** RF-TEC-076: Reserva temporal con expiración configurable al elegir franja y reserva confirmada al aceptar; sin doble reserva del mismo cupo por carrera (control atómico). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.agenda.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-11 (Agenda).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2732 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-18-c)

<a id="API-TEC-18-d"></a>
#### API-TEC-18-d · `POST /api/admin/tec/bookings/{id}/cancel`

- **Qué hace:** Reservas. Contador atómico; 409 tec.booking.noCapacity. Cancela un registro de reservas de visita (`visitBookings`).
- **Para qué sirve:** RF-TEC-076: Reserva temporal con expiración configurable al elegir franja y reserva confirmada al aceptar; sin doble reserva del mismo cupo por carrera (control atómico). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.agenda.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-11 (Agenda).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2732 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-18-d)

<a id="API-TEC-19"></a>
#### API-TEC-19 · `GET /api/admin/tec/visits`

- **Qué hace:** Visitas. Lista, con filtros y paginación, los registros de visitas (`visits`).
- **Para qué sirve:** RF-TEC-084: Vista de agenda por recurso (día/semana), por zona y mapa de visitas del día. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.agenda.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de visitas (`visits`) con `total`.
- **Pantallas:** PAN-TEC-11 (Agenda).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2733 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-19)

<a id="API-TEC-19-b"></a>
#### API-TEC-19-b · `POST /api/admin/tec/visits`

- **Qué hace:** Visitas. Da de alta un registro de visitas (`visits`).
- **Para qué sirve:** RF-TEC-084: Vista de agenda por recurso (día/semana), por zona y mapa de visitas del día. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.agenda.gestionar`.
- **Recibe:** los datos de visitas (`visits`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de visitas (`visits`).
- **Pantallas:** PAN-TEC-11 (Agenda).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2733 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-19-b)

<a id="API-TEC-19-c"></a>
#### API-TEC-19-c · `GET /api/admin/tec/visits/{id}`

- **Qué hace:** Visitas. Obtiene el detalle de un registro de visitas (`visits`).
- **Para qué sirve:** RF-TEC-084: Vista de agenda por recurso (día/semana), por zona y mapa de visitas del día. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.agenda.gestionar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de visitas (`visits`).
- **Pantallas:** PAN-TEC-11 (Agenda).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2733 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-19-c)

<a id="API-TEC-19-d"></a>
#### API-TEC-19-d · `PATCH /api/admin/tec/visits/{id}`

- **Qué hace:** Visitas. Modifica algunos campos de un registro de visitas (`visits`) (solo los enviados).
- **Para qué sirve:** RF-TEC-084: Vista de agenda por recurso (día/semana), por zona y mapa de visitas del día. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.agenda.gestionar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de visitas (`visits`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de visitas (`visits`).
- **Pantallas:** PAN-TEC-11 (Agenda).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2733 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-19-d)

<a id="API-TEC-19-e"></a>
#### API-TEC-19-e · `POST /api/admin/tec/visits/{id}/reschedule`

- **Qué hace:** Visitas. Reprograma un registro de visitas (`visits`).
- **Para qué sirve:** RF-TEC-084: Vista de agenda por recurso (día/semana), por zona y mapa de visitas del día. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.agenda.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-11 (Agenda).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2733 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-19-e)

<a id="API-TEC-19-f"></a>
#### API-TEC-19-f · `POST /api/admin/tec/visits/{id}/assign`

- **Qué hace:** Visitas. Asigna un registro de visitas (`visits`).
- **Para qué sirve:** RF-TEC-084: Vista de agenda por recurso (día/semana), por zona y mapa de visitas del día. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.agenda.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-11 (Agenda).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2733 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-19-f)

<a id="API-TEC-19-g"></a>
#### API-TEC-19-g · `POST /api/admin/tec/visits/{id}/cancel`

- **Qué hace:** Visitas. Cancela un registro de visitas (`visits`).
- **Para qué sirve:** RF-TEC-084: Vista de agenda por recurso (día/semana), por zona y mapa de visitas del día. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.agenda.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-11 (Agenda).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2733 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-19-g)

<a id="API-TEC-20"></a>
#### API-TEC-20 · `GET /api/admin/tec/schedule/visit-types`

- **Qué hace:** Configuración de agenda. Lista, con filtros y paginación, los registros de tipos de visita (`visitTypes`).
- **Para qué sirve:** RF-TEC-084: Vista de agenda por recurso (día/semana), por zona y mapa de visitas del día. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.agenda.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de tipos de visita (`visitTypes`) con `total`.
- **Pantallas:** PAN-TEC-12 (Configuración de agenda).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2734 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-20)

<a id="API-TEC-20-b"></a>
#### API-TEC-20-b · `POST /api/admin/tec/schedule/visit-types`

- **Qué hace:** Configuración de agenda. Da de alta un registro de tipos de visita (`visitTypes`).
- **Para qué sirve:** RF-TEC-084: Vista de agenda por recurso (día/semana), por zona y mapa de visitas del día. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.agenda.configurar`.
- **Recibe:** los datos de tipos de visita (`visitTypes`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de tipos de visita (`visitTypes`).
- **Pantallas:** PAN-TEC-12 (Configuración de agenda).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2734 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-20-b)

<a id="API-TEC-20-c"></a>
#### API-TEC-20-c · `GET /api/admin/tec/schedule/visit-types/{id}`

- **Qué hace:** Configuración de agenda. Obtiene el detalle de un registro de tipos de visita (`visitTypes`).
- **Para qué sirve:** RF-TEC-084: Vista de agenda por recurso (día/semana), por zona y mapa de visitas del día. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.agenda.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de tipos de visita (`visitTypes`).
- **Pantallas:** PAN-TEC-12 (Configuración de agenda).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2734 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-20-c)

<a id="API-TEC-20-e"></a>
#### API-TEC-20-e · `DELETE /api/admin/tec/schedule/visit-types/{id}`

- **Qué hace:** Configuración de agenda. Elimina o da de baja un registro de tipos de visita (`visitTypes`).
- **Para qué sirve:** RF-TEC-084: Vista de agenda por recurso (día/semana), por zona y mapa de visitas del día. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.agenda.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-TEC-12 (Configuración de agenda).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2734 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-20-e)

<a id="API-TEC-20-d"></a>
#### API-TEC-20-d · `PATCH /api/admin/tec/schedule/visit-types/{id}`

- **Qué hace:** Configuración de agenda. Modifica algunos campos de un registro de tipos de visita (`visitTypes`) (solo los enviados).
- **Para qué sirve:** RF-TEC-084: Vista de agenda por recurso (día/semana), por zona y mapa de visitas del día. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.agenda.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de tipos de visita (`visitTypes`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de tipos de visita (`visitTypes`).
- **Pantallas:** PAN-TEC-12 (Configuración de agenda).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2734 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-20-d)

<a id="API-TEC-20-f"></a>
#### API-TEC-20-f · `GET /api/admin/tec/schedule/zones`

- **Qué hace:** Configuración de agenda. Lista, con filtros y paginación, los registros de zonas de agenda (`schedulingZones`).
- **Para qué sirve:** RF-TEC-073: Configurar zonas de agenda (polígonos o lista de localidades/barrios), tipos de visita con duración, franjas, requisitos (habilidad, cuadrilla, vehículo, equipo) y servicios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.agenda.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de zonas de agenda (`schedulingZones`) con `total`.
- **Pantallas:** PAN-TEC-12 (Configuración de agenda).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2734 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-20-f)

<a id="API-TEC-20-g"></a>
#### API-TEC-20-g · `POST /api/admin/tec/schedule/zones`

- **Qué hace:** Configuración de agenda. Da de alta un registro de zonas de agenda (`schedulingZones`).
- **Para qué sirve:** RF-TEC-073: Configurar zonas de agenda (polígonos o lista de localidades/barrios), tipos de visita con duración, franjas, requisitos (habilidad, cuadrilla, vehículo, equipo) y servicios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.agenda.configurar`.
- **Recibe:** los datos de zonas de agenda (`schedulingZones`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de zonas de agenda (`schedulingZones`).
- **Pantallas:** PAN-TEC-12 (Configuración de agenda).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2734 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-20-g)

<a id="API-TEC-20-h"></a>
#### API-TEC-20-h · `GET /api/admin/tec/schedule/zones/{id}`

- **Qué hace:** Configuración de agenda. Obtiene el detalle de un registro de zonas de agenda (`schedulingZones`).
- **Para qué sirve:** RF-TEC-073: Configurar zonas de agenda (polígonos o lista de localidades/barrios), tipos de visita con duración, franjas, requisitos (habilidad, cuadrilla, vehículo, equipo) y servicios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.agenda.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de zonas de agenda (`schedulingZones`).
- **Pantallas:** PAN-TEC-12 (Configuración de agenda).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2734 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-20-h)

<a id="API-TEC-20-j"></a>
#### API-TEC-20-j · `DELETE /api/admin/tec/schedule/zones/{id}`

- **Qué hace:** Configuración de agenda. Elimina o da de baja un registro de zonas de agenda (`schedulingZones`).
- **Para qué sirve:** RF-TEC-073: Configurar zonas de agenda (polígonos o lista de localidades/barrios), tipos de visita con duración, franjas, requisitos (habilidad, cuadrilla, vehículo, equipo) y servicios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.agenda.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-TEC-12 (Configuración de agenda).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2734 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-20-j)

<a id="API-TEC-20-i"></a>
#### API-TEC-20-i · `PATCH /api/admin/tec/schedule/zones/{id}`

- **Qué hace:** Configuración de agenda. Modifica algunos campos de un registro de zonas de agenda (`schedulingZones`) (solo los enviados).
- **Para qué sirve:** RF-TEC-073: Configurar zonas de agenda (polígonos o lista de localidades/barrios), tipos de visita con duración, franjas, requisitos (habilidad, cuadrilla, vehículo, equipo) y servicios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.agenda.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de zonas de agenda (`schedulingZones`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de zonas de agenda (`schedulingZones`).
- **Pantallas:** PAN-TEC-12 (Configuración de agenda).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2734 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-20-i)

<a id="API-TEC-20-k"></a>
#### API-TEC-20-k · `GET /api/admin/tec/schedule/calendars`

- **Qué hace:** Configuración de agenda. Lista, con filtros y paginación, los registros de calendario de recursos (`resourceCalendars`).
- **Para qué sirve:** RF-TEC-084: Vista de agenda por recurso (día/semana), por zona y mapa de visitas del día. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.agenda.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de calendario de recursos (`resourceCalendars`) con `total`.
- **Pantallas:** PAN-TEC-12 (Configuración de agenda).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2734 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-20-k)

<a id="API-TEC-20-l"></a>
#### API-TEC-20-l · `POST /api/admin/tec/schedule/calendars`

- **Qué hace:** Configuración de agenda. Da de alta un registro de calendario de recursos (`resourceCalendars`).
- **Para qué sirve:** RF-TEC-084: Vista de agenda por recurso (día/semana), por zona y mapa de visitas del día. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.agenda.configurar`.
- **Recibe:** los datos de calendario de recursos (`resourceCalendars`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de calendario de recursos (`resourceCalendars`).
- **Pantallas:** PAN-TEC-12 (Configuración de agenda).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2734 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-20-l)

<a id="API-TEC-20-m"></a>
#### API-TEC-20-m · `GET /api/admin/tec/schedule/calendars/{id}`

- **Qué hace:** Configuración de agenda. Obtiene el detalle de un registro de calendario de recursos (`resourceCalendars`).
- **Para qué sirve:** RF-TEC-084: Vista de agenda por recurso (día/semana), por zona y mapa de visitas del día. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.agenda.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de calendario de recursos (`resourceCalendars`).
- **Pantallas:** PAN-TEC-12 (Configuración de agenda).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2734 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-20-m)

<a id="API-TEC-20-o"></a>
#### API-TEC-20-o · `DELETE /api/admin/tec/schedule/calendars/{id}`

- **Qué hace:** Configuración de agenda. Elimina o da de baja un registro de calendario de recursos (`resourceCalendars`).
- **Para qué sirve:** RF-TEC-084: Vista de agenda por recurso (día/semana), por zona y mapa de visitas del día. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.agenda.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-TEC-12 (Configuración de agenda).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2734 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-20-o)

<a id="API-TEC-20-n"></a>
#### API-TEC-20-n · `PATCH /api/admin/tec/schedule/calendars/{id}`

- **Qué hace:** Configuración de agenda. Modifica algunos campos de un registro de calendario de recursos (`resourceCalendars`) (solo los enviados).
- **Para qué sirve:** RF-TEC-084: Vista de agenda por recurso (día/semana), por zona y mapa de visitas del día. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.agenda.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de calendario de recursos (`resourceCalendars`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de calendario de recursos (`resourceCalendars`).
- **Pantallas:** PAN-TEC-12 (Configuración de agenda).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2734 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-20-n)

<a id="API-TEC-21"></a>
#### API-TEC-21 · `GET /api/admin/tec/crews`

- **Qué hace:** Recursos. Lista, con filtros y paginación, los registros de cuadrillas (`crews`).
- **Para qué sirve:** RF-TEC-074: Calendarios de recursos (cuadrillas/técnicos) con disponibilidad, feriados (T04), turnos, ausencias y capacidad por franja (cantidad de visitas o minutos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.cuadrillas.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de cuadrillas (`crews`) con `total`.
- **Pantallas:** PAN-TEC-13 (Cuadrillas), PAN-TEC-14 (Recursos de campo).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2735 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-21)

<a id="API-TEC-21-b"></a>
#### API-TEC-21-b · `POST /api/admin/tec/crews`

- **Qué hace:** Recursos. Da de alta un registro de cuadrillas (`crews`).
- **Para qué sirve:** RF-TEC-074: Calendarios de recursos (cuadrillas/técnicos) con disponibilidad, feriados (T04), turnos, ausencias y capacidad por franja (cantidad de visitas o minutos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.cuadrillas.gestionar`.
- **Recibe:** los datos de cuadrillas (`crews`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de cuadrillas (`crews`).
- **Pantallas:** PAN-TEC-13 (Cuadrillas), PAN-TEC-14 (Recursos de campo).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2735 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-21-b)

<a id="API-TEC-21-c"></a>
#### API-TEC-21-c · `GET /api/admin/tec/crews/{id}`

- **Qué hace:** Recursos. Obtiene el detalle de un registro de cuadrillas (`crews`).
- **Para qué sirve:** RF-TEC-074: Calendarios de recursos (cuadrillas/técnicos) con disponibilidad, feriados (T04), turnos, ausencias y capacidad por franja (cantidad de visitas o minutos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.cuadrillas.gestionar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de cuadrillas (`crews`).
- **Pantallas:** PAN-TEC-13 (Cuadrillas), PAN-TEC-14 (Recursos de campo).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2735 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-21-c)

<a id="API-TEC-21-e"></a>
#### API-TEC-21-e · `DELETE /api/admin/tec/crews/{id}`

- **Qué hace:** Recursos. Elimina o da de baja un registro de cuadrillas (`crews`).
- **Para qué sirve:** RF-TEC-074: Calendarios de recursos (cuadrillas/técnicos) con disponibilidad, feriados (T04), turnos, ausencias y capacidad por franja (cantidad de visitas o minutos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2735 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-21-e)

<a id="API-TEC-21-d"></a>
#### API-TEC-21-d · `PATCH /api/admin/tec/crews/{id}`

- **Qué hace:** Recursos. Modifica algunos campos de un registro de cuadrillas (`crews`) (solo los enviados).
- **Para qué sirve:** RF-TEC-074: Calendarios de recursos (cuadrillas/técnicos) con disponibilidad, feriados (T04), turnos, ausencias y capacidad por franja (cantidad de visitas o minutos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.cuadrillas.gestionar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de cuadrillas (`crews`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de cuadrillas (`crews`).
- **Pantallas:** PAN-TEC-13 (Cuadrillas), PAN-TEC-14 (Recursos de campo).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2735 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-21-d)

<a id="API-TEC-21-f"></a>
#### API-TEC-21-f · `GET /api/admin/tec/resources`

- **Qué hace:** Recursos. Lista, con filtros y paginación, los registros de recursos de campo (`fieldResources`).
- **Para qué sirve:** RF-TEC-074: Calendarios de recursos (cuadrillas/técnicos) con disponibilidad, feriados (T04), turnos, ausencias y capacidad por franja (cantidad de visitas o minutos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.cuadrillas.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de recursos de campo (`fieldResources`) con `total`.
- **Pantallas:** PAN-TEC-13 (Cuadrillas), PAN-TEC-14 (Recursos de campo).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2735 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-21-f)

<a id="API-TEC-21-g"></a>
#### API-TEC-21-g · `POST /api/admin/tec/resources`

- **Qué hace:** Recursos. Da de alta un registro de recursos de campo (`fieldResources`).
- **Para qué sirve:** RF-TEC-074: Calendarios de recursos (cuadrillas/técnicos) con disponibilidad, feriados (T04), turnos, ausencias y capacidad por franja (cantidad de visitas o minutos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.cuadrillas.gestionar`.
- **Recibe:** los datos de recursos de campo (`fieldResources`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de recursos de campo (`fieldResources`).
- **Pantallas:** PAN-TEC-13 (Cuadrillas), PAN-TEC-14 (Recursos de campo).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2735 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-21-g)

<a id="API-TEC-21-h"></a>
#### API-TEC-21-h · `GET /api/admin/tec/resources/{id}`

- **Qué hace:** Recursos. Obtiene el detalle de un registro de recursos de campo (`fieldResources`).
- **Para qué sirve:** RF-TEC-074: Calendarios de recursos (cuadrillas/técnicos) con disponibilidad, feriados (T04), turnos, ausencias y capacidad por franja (cantidad de visitas o minutos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.cuadrillas.gestionar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de recursos de campo (`fieldResources`).
- **Pantallas:** PAN-TEC-13 (Cuadrillas), PAN-TEC-14 (Recursos de campo).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2735 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-21-h)

<a id="API-TEC-21-j"></a>
#### API-TEC-21-j · `DELETE /api/admin/tec/resources/{id}`

- **Qué hace:** Recursos. Elimina o da de baja un registro de recursos de campo (`fieldResources`).
- **Para qué sirve:** RF-TEC-129: Formularios/checklists de campo configurables (motor de relevamientos CNX) embebidos en la OT (hasta 3 formularios por visita), con check-in GPS y geocerca opcional. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2735 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-21-j)

<a id="API-TEC-21-i"></a>
#### API-TEC-21-i · `PATCH /api/admin/tec/resources/{id}`

- **Qué hace:** Recursos. Modifica algunos campos de un registro de recursos de campo (`fieldResources`) (solo los enviados).
- **Para qué sirve:** RF-TEC-074: Calendarios de recursos (cuadrillas/técnicos) con disponibilidad, feriados (T04), turnos, ausencias y capacidad por franja (cantidad de visitas o minutos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.cuadrillas.gestionar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de recursos de campo (`fieldResources`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de recursos de campo (`fieldResources`).
- **Pantallas:** PAN-TEC-13 (Cuadrillas), PAN-TEC-14 (Recursos de campo).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2735 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-21-i)

<a id="API-TEC-21-k"></a>
#### API-TEC-21-k · `GET /api/admin/tec/installers`

- **Qué hace:** Recursos. Lista, con filtros y paginación, los registros de instaladores habilitados (`certifiedInstallers`).
- **Para qué sirve:** RF-TEC-102: ABM de cuadrillas con integrantes (responsables), líder, zona, servicios, habilidades, vehículo habitual y capacidad diaria. · RF-TEC-079: Asignación de cuadrilla/empleado a la visita (manual o sugerida por zona, carga y habilidad) y novedades de agenda. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.cuadrillas.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de instaladores habilitados (`certifiedInstallers`) con `total`.
- **Pantallas:** PAN-TEC-13 (Cuadrillas), PAN-TEC-14 (Recursos de campo).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2735 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-21-k)

<a id="API-TEC-21-l"></a>
#### API-TEC-21-l · `POST /api/admin/tec/installers`

- **Qué hace:** Recursos. Da de alta un registro de instaladores habilitados (`certifiedInstallers`).
- **Para qué sirve:** RF-TEC-102: ABM de cuadrillas con integrantes (responsables), líder, zona, servicios, habilidades, vehículo habitual y capacidad diaria. · RF-TEC-079: Asignación de cuadrilla/empleado a la visita (manual o sugerida por zona, carga y habilidad) y novedades de agenda. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.cuadrillas.gestionar`.
- **Recibe:** los datos de instaladores habilitados (`certifiedInstallers`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de instaladores habilitados (`certifiedInstallers`).
- **Pantallas:** PAN-TEC-13 (Cuadrillas), PAN-TEC-14 (Recursos de campo).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2735 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-21-l)

<a id="API-TEC-21-m"></a>
#### API-TEC-21-m · `GET /api/admin/tec/installers/{id}`

- **Qué hace:** Recursos. Obtiene el detalle de un registro de instaladores habilitados (`certifiedInstallers`).
- **Para qué sirve:** RF-TEC-102: ABM de cuadrillas con integrantes (responsables), líder, zona, servicios, habilidades, vehículo habitual y capacidad diaria. · RF-TEC-079: Asignación de cuadrilla/empleado a la visita (manual o sugerida por zona, carga y habilidad) y novedades de agenda. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.cuadrillas.gestionar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de instaladores habilitados (`certifiedInstallers`).
- **Pantallas:** PAN-TEC-13 (Cuadrillas), PAN-TEC-14 (Recursos de campo).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2735 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-21-m)

<a id="API-TEC-21-o"></a>
#### API-TEC-21-o · `DELETE /api/admin/tec/installers/{id}`

- **Qué hace:** Recursos. Elimina o da de baja un registro de instaladores habilitados (`certifiedInstallers`).
- **Para qué sirve:** RF-TEC-175: Expedientes de trámites técnicos (presentación de planos, certificado de instalador, habilitaciones) con etapas, resolución, adjuntos y fechas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2735 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-21-o)

<a id="API-TEC-21-n"></a>
#### API-TEC-21-n · `PATCH /api/admin/tec/installers/{id}`

- **Qué hace:** Recursos. Modifica algunos campos de un registro de instaladores habilitados (`certifiedInstallers`) (solo los enviados).
- **Para qué sirve:** RF-TEC-102: ABM de cuadrillas con integrantes (responsables), líder, zona, servicios, habilidades, vehículo habitual y capacidad diaria. · RF-TEC-079: Asignación de cuadrilla/empleado a la visita (manual o sugerida por zona, carga y habilidad) y novedades de agenda. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.cuadrillas.gestionar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de instaladores habilitados (`certifiedInstallers`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de instaladores habilitados (`certifiedInstallers`).
- **Pantallas:** PAN-TEC-13 (Cuadrillas), PAN-TEC-14 (Recursos de campo).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2735 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-21-n)

<a id="API-TEC-21-p"></a>
#### API-TEC-21-p · `GET /api/admin/tec/notification-rules`

- **Qué hace:** Recursos. Lista, con filtros y paginación, los registros de avisos a responsables (`responsibleNotificationRules`).
- **Para qué sirve:** RF-TEC-030: Asignar responsable, cuadrilla, participantes concretos, cantidad de personas y vehículos (N a N) a la OT. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.cuadrillas.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de avisos a responsables (`responsibleNotificationRules`) con `total`.
- **Pantallas:** PAN-TEC-13 (Cuadrillas), PAN-TEC-14 (Recursos de campo).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2735 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-21-p)

<a id="API-TEC-21-q"></a>
#### API-TEC-21-q · `POST /api/admin/tec/notification-rules`

- **Qué hace:** Recursos. Da de alta un registro de avisos a responsables (`responsibleNotificationRules`).
- **Para qué sirve:** RF-TEC-030: Asignar responsable, cuadrilla, participantes concretos, cantidad de personas y vehículos (N a N) a la OT. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.cuadrillas.gestionar`.
- **Recibe:** los datos de avisos a responsables (`responsibleNotificationRules`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de avisos a responsables (`responsibleNotificationRules`).
- **Pantallas:** PAN-TEC-13 (Cuadrillas), PAN-TEC-14 (Recursos de campo).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2735 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-21-q)

<a id="API-TEC-21-r"></a>
#### API-TEC-21-r · `GET /api/admin/tec/notification-rules/{id}`

- **Qué hace:** Recursos. Obtiene el detalle de un registro de avisos a responsables (`responsibleNotificationRules`).
- **Para qué sirve:** RF-TEC-030: Asignar responsable, cuadrilla, participantes concretos, cantidad de personas y vehículos (N a N) a la OT. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.cuadrillas.gestionar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de avisos a responsables (`responsibleNotificationRules`).
- **Pantallas:** PAN-TEC-13 (Cuadrillas), PAN-TEC-14 (Recursos de campo).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2735 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-21-r)

<a id="API-TEC-21-t"></a>
#### API-TEC-21-t · `DELETE /api/admin/tec/notification-rules/{id}`

- **Qué hace:** Recursos. Elimina o da de baja un registro de avisos a responsables (`responsibleNotificationRules`).
- **Para qué sirve:** RF-TEC-065: Origen del descuento: depósito indicado, custodia del técnico/responsable (depósito propio) o depósito por defecto configurado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2735 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-21-t)

<a id="API-TEC-21-s"></a>
#### API-TEC-21-s · `PATCH /api/admin/tec/notification-rules/{id}`

- **Qué hace:** Recursos. Modifica algunos campos de un registro de avisos a responsables (`responsibleNotificationRules`) (solo los enviados).
- **Para qué sirve:** RF-TEC-030: Asignar responsable, cuadrilla, participantes concretos, cantidad de personas y vehículos (N a N) a la OT. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.cuadrillas.gestionar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de avisos a responsables (`responsibleNotificationRules`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de avisos a responsables (`responsibleNotificationRules`).
- **Pantallas:** PAN-TEC-13 (Cuadrillas), PAN-TEC-14 (Recursos de campo).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2735 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-21-s)

<a id="API-TEC-22"></a>
#### API-TEC-22 · `GET /api/admin/tec/catalog/operations`

- **Qué hace:** Catálogos. Importación Excel. Lista, con filtros y paginación, los registros de catálogo único de tareas (`taskCatalog`).
- **Para qué sirve:** RF-TEC-110: Catálogo de tareas y grupos de tareas por servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de catálogo único de tareas (`taskCatalog`) con `total`.
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2736 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-22)

<a id="API-TEC-22-b"></a>
#### API-TEC-22-b · `POST /api/admin/tec/catalog/operations`

- **Qué hace:** Catálogos. Importación Excel. Registra un nuevo elemento u operación en catálogo único de tareas (`taskCatalog`).
- **Para qué sirve:** RF-TEC-110: Catálogo de tareas y grupos de tareas por servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2736 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-22-b)

<a id="API-TEC-22-c"></a>
#### API-TEC-22-c · `GET /api/admin/tec/catalog/operations/{id}`

- **Qué hace:** Catálogos. Importación Excel. Obtiene el detalle de un registro de catálogo único de tareas (`taskCatalog`).
- **Para qué sirve:** RF-TEC-110: Catálogo de tareas y grupos de tareas por servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de catálogo único de tareas (`taskCatalog`).
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2736 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-22-c)

<a id="API-TEC-22-e"></a>
#### API-TEC-22-e · `DELETE /api/admin/tec/catalog/operations/{id}`

- **Qué hace:** Catálogos. Importación Excel. Elimina o da de baja un registro de catálogo único de tareas (`taskCatalog`).
- **Para qué sirve:** RF-TEC-110: Catálogo de tareas y grupos de tareas por servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2736 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-22-e)

<a id="API-TEC-22-d"></a>
#### API-TEC-22-d · `PATCH /api/admin/tec/catalog/operations/{id}`

- **Qué hace:** Catálogos. Importación Excel. Modifica algunos campos de un registro de catálogo único de tareas (`taskCatalog`) (solo los enviados).
- **Para qué sirve:** RF-TEC-110: Catálogo de tareas y grupos de tareas por servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de catálogo único de tareas (`taskCatalog`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de catálogo único de tareas (`taskCatalog`).
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2736 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-22-d)

<a id="API-TEC-22-f"></a>
#### API-TEC-22-f · `GET /api/admin/tec/catalog/work-types`

- **Qué hace:** Catálogos. Importación Excel. Lista, con filtros y paginación, los registros de tipos de trabajo (`workTypes`).
- **Para qué sirve:** RF-TEC-172: Padrón de beneficiarios por lote o frente (inmueble, titular, metros de frente, superficie, unidades), importable por Excel. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de tipos de trabajo (`workTypes`) con `total`.
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2736 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-22-f)

<a id="API-TEC-22-g"></a>
#### API-TEC-22-g · `POST /api/admin/tec/catalog/work-types`

- **Qué hace:** Catálogos. Importación Excel. Da de alta un registro de tipos de trabajo (`workTypes`).
- **Para qué sirve:** RF-TEC-172: Padrón de beneficiarios por lote o frente (inmueble, titular, metros de frente, superficie, unidades), importable por Excel. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** los datos de tipos de trabajo (`workTypes`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de tipos de trabajo (`workTypes`).
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2736 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-22-g)

<a id="API-TEC-22-h"></a>
#### API-TEC-22-h · `GET /api/admin/tec/catalog/work-types/{id}`

- **Qué hace:** Catálogos. Importación Excel. Obtiene el detalle de un registro de tipos de trabajo (`workTypes`).
- **Para qué sirve:** RF-TEC-172: Padrón de beneficiarios por lote o frente (inmueble, titular, metros de frente, superficie, unidades), importable por Excel. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de tipos de trabajo (`workTypes`).
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2736 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-22-h)

<a id="API-TEC-22-j"></a>
#### API-TEC-22-j · `DELETE /api/admin/tec/catalog/work-types/{id}`

- **Qué hace:** Catálogos. Importación Excel. Elimina o da de baja un registro de tipos de trabajo (`workTypes`).
- **Para qué sirve:** RF-TEC-172: Padrón de beneficiarios por lote o frente (inmueble, titular, metros de frente, superficie, unidades), importable por Excel. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2736 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-22-j)

<a id="API-TEC-22-i"></a>
#### API-TEC-22-i · `PATCH /api/admin/tec/catalog/work-types/{id}`

- **Qué hace:** Catálogos. Importación Excel. Modifica algunos campos de un registro de tipos de trabajo (`workTypes`) (solo los enviados).
- **Para qué sirve:** RF-TEC-172: Padrón de beneficiarios por lote o frente (inmueble, titular, metros de frente, superficie, unidades), importable por Excel. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de tipos de trabajo (`workTypes`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de tipos de trabajo (`workTypes`).
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2736 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-22-i)

<a id="API-TEC-22-k"></a>
#### API-TEC-22-k · `GET /api/admin/tec/catalog/incident-categories`

- **Qué hace:** Catálogos. Importación Excel. Lista, con filtros y paginación, los registros de categorías de incidencia técnica (`incidentCategories`).
- **Para qué sirve:** RF-TEC-172: Padrón de beneficiarios por lote o frente (inmueble, titular, metros de frente, superficie, unidades), importable por Excel. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de categorías de incidencia técnica (`incidentCategories`) con `total`.
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2736 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-22-k)

<a id="API-TEC-22-l"></a>
#### API-TEC-22-l · `POST /api/admin/tec/catalog/incident-categories`

- **Qué hace:** Catálogos. Importación Excel. Da de alta un registro de categorías de incidencia técnica (`incidentCategories`).
- **Para qué sirve:** RF-TEC-172: Padrón de beneficiarios por lote o frente (inmueble, titular, metros de frente, superficie, unidades), importable por Excel. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** los datos de categorías de incidencia técnica (`incidentCategories`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de categorías de incidencia técnica (`incidentCategories`).
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2736 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-22-l)

<a id="API-TEC-22-m"></a>
#### API-TEC-22-m · `GET /api/admin/tec/catalog/incident-categories/{id}`

- **Qué hace:** Catálogos. Importación Excel. Obtiene el detalle de un registro de categorías de incidencia técnica (`incidentCategories`).
- **Para qué sirve:** RF-TEC-172: Padrón de beneficiarios por lote o frente (inmueble, titular, metros de frente, superficie, unidades), importable por Excel. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de categorías de incidencia técnica (`incidentCategories`).
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2736 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-22-m)

<a id="API-TEC-22-o"></a>
#### API-TEC-22-o · `DELETE /api/admin/tec/catalog/incident-categories/{id}`

- **Qué hace:** Catálogos. Importación Excel. Elimina o da de baja un registro de categorías de incidencia técnica (`incidentCategories`).
- **Para qué sirve:** RF-TEC-172: Padrón de beneficiarios por lote o frente (inmueble, titular, metros de frente, superficie, unidades), importable por Excel. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2736 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-22-o)

<a id="API-TEC-22-n"></a>
#### API-TEC-22-n · `PATCH /api/admin/tec/catalog/incident-categories/{id}`

- **Qué hace:** Catálogos. Importación Excel. Modifica algunos campos de un registro de categorías de incidencia técnica (`incidentCategories`) (solo los enviados).
- **Para qué sirve:** RF-TEC-172: Padrón de beneficiarios por lote o frente (inmueble, titular, metros de frente, superficie, unidades), importable por Excel. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de categorías de incidencia técnica (`incidentCategories`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de categorías de incidencia técnica (`incidentCategories`).
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2736 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-22-n)

<a id="API-TEC-22-p"></a>
#### API-TEC-22-p · `GET /api/admin/tec/catalog/resolutions`

- **Qué hace:** Catálogos. Importación Excel. Lista, con filtros y paginación, los registros de catálogo único de tareas (`taskCatalog`).
- **Para qué sirve:** RF-TEC-110: Catálogo de tareas y grupos de tareas por servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de catálogo único de tareas (`taskCatalog`) con `total`.
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2736 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-22-p)

<a id="API-TEC-22-q"></a>
#### API-TEC-22-q · `POST /api/admin/tec/catalog/resolutions`

- **Qué hace:** Catálogos. Importación Excel. Registra un nuevo elemento u operación en catálogo único de tareas (`taskCatalog`).
- **Para qué sirve:** RF-TEC-110: Catálogo de tareas y grupos de tareas por servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2736 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-22-q)

<a id="API-TEC-22-r"></a>
#### API-TEC-22-r · `GET /api/admin/tec/catalog/resolutions/{id}`

- **Qué hace:** Catálogos. Importación Excel. Obtiene el detalle de un registro de catálogo único de tareas (`taskCatalog`).
- **Para qué sirve:** RF-TEC-110: Catálogo de tareas y grupos de tareas por servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de catálogo único de tareas (`taskCatalog`).
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2736 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-22-r)

<a id="API-TEC-22-t"></a>
#### API-TEC-22-t · `DELETE /api/admin/tec/catalog/resolutions/{id}`

- **Qué hace:** Catálogos. Importación Excel. Elimina o da de baja un registro de catálogo único de tareas (`taskCatalog`).
- **Para qué sirve:** RF-TEC-110: Catálogo de tareas y grupos de tareas por servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2736 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-22-t)

<a id="API-TEC-22-s"></a>
#### API-TEC-22-s · `PATCH /api/admin/tec/catalog/resolutions/{id}`

- **Qué hace:** Catálogos. Importación Excel. Modifica algunos campos de un registro de catálogo único de tareas (`taskCatalog`) (solo los enviados).
- **Para qué sirve:** RF-TEC-110: Catálogo de tareas y grupos de tareas por servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de catálogo único de tareas (`taskCatalog`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de catálogo único de tareas (`taskCatalog`).
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2736 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-22-s)

<a id="API-TEC-22-u"></a>
#### API-TEC-22-u · `GET /api/admin/tec/catalog/tasks`

- **Qué hace:** Catálogos. Importación Excel. Lista, con filtros y paginación, los registros de catálogo único de tareas (`taskCatalog`).
- **Para qué sirve:** RF-TEC-110: Catálogo de tareas y grupos de tareas por servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de catálogo único de tareas (`taskCatalog`) con `total`.
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2736 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-22-u)

<a id="API-TEC-22-v"></a>
#### API-TEC-22-v · `POST /api/admin/tec/catalog/tasks`

- **Qué hace:** Catálogos. Importación Excel. Registra un nuevo elemento u operación en catálogo único de tareas (`taskCatalog`).
- **Para qué sirve:** RF-TEC-110: Catálogo de tareas y grupos de tareas por servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2736 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-22-v)

<a id="API-TEC-22-w"></a>
#### API-TEC-22-w · `GET /api/admin/tec/catalog/tasks/{id}`

- **Qué hace:** Catálogos. Importación Excel. Obtiene el detalle de un registro de catálogo único de tareas (`taskCatalog`).
- **Para qué sirve:** RF-TEC-110: Catálogo de tareas y grupos de tareas por servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de catálogo único de tareas (`taskCatalog`).
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2736 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-22-w)

<a id="API-TEC-22-y"></a>
#### API-TEC-22-y · `DELETE /api/admin/tec/catalog/tasks/{id}`

- **Qué hace:** Catálogos. Importación Excel. Elimina o da de baja un registro de catálogo único de tareas (`taskCatalog`).
- **Para qué sirve:** RF-TEC-110: Catálogo de tareas y grupos de tareas por servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2736 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-22-y)

<a id="API-TEC-22-x"></a>
#### API-TEC-22-x · `PATCH /api/admin/tec/catalog/tasks/{id}`

- **Qué hace:** Catálogos. Importación Excel. Modifica algunos campos de un registro de catálogo único de tareas (`taskCatalog`) (solo los enviados).
- **Para qué sirve:** RF-TEC-110: Catálogo de tareas y grupos de tareas por servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de catálogo único de tareas (`taskCatalog`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de catálogo único de tareas (`taskCatalog`).
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2736 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-22-x)

<a id="API-TEC-22-z"></a>
#### API-TEC-22-z · `GET /api/admin/tec/catalog/task-groups`

- **Qué hace:** Catálogos. Importación Excel. Lista, con filtros y paginación, los registros de grupos de tareas (`taskGroups`).
- **Para qué sirve:** RF-TEC-110: Catálogo de tareas y grupos de tareas por servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de grupos de tareas (`taskGroups`) con `total`.
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2736 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-22-z)

<a id="API-TEC-22-26"></a>
#### API-TEC-22-26 · `POST /api/admin/tec/catalog/task-groups`

- **Qué hace:** Catálogos. Importación Excel. Da de alta un registro de grupos de tareas (`taskGroups`).
- **Para qué sirve:** RF-TEC-110: Catálogo de tareas y grupos de tareas por servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** los datos de grupos de tareas (`taskGroups`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de grupos de tareas (`taskGroups`).
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2736 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-22-26)

<a id="API-TEC-22-27"></a>
#### API-TEC-22-27 · `GET /api/admin/tec/catalog/task-groups/{id}`

- **Qué hace:** Catálogos. Importación Excel. Obtiene el detalle de un registro de grupos de tareas (`taskGroups`).
- **Para qué sirve:** RF-TEC-110: Catálogo de tareas y grupos de tareas por servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de grupos de tareas (`taskGroups`).
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2736 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-22-27)

<a id="API-TEC-22-29"></a>
#### API-TEC-22-29 · `DELETE /api/admin/tec/catalog/task-groups/{id}`

- **Qué hace:** Catálogos. Importación Excel. Elimina o da de baja un registro de grupos de tareas (`taskGroups`).
- **Para qué sirve:** RF-TEC-110: Catálogo de tareas y grupos de tareas por servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2736 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-22-29)

<a id="API-TEC-22-28"></a>
#### API-TEC-22-28 · `PATCH /api/admin/tec/catalog/task-groups/{id}`

- **Qué hace:** Catálogos. Importación Excel. Modifica algunos campos de un registro de grupos de tareas (`taskGroups`) (solo los enviados).
- **Para qué sirve:** RF-TEC-110: Catálogo de tareas y grupos de tareas por servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de grupos de tareas (`taskGroups`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de grupos de tareas (`taskGroups`).
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2736 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-22-28)

<a id="API-TEC-22-30"></a>
#### API-TEC-22-30 · `GET /api/admin/tec/catalog/print-templates`

- **Qué hace:** Catálogos. Importación Excel. Lista, con filtros y paginación, los registros de modelos de impresión de OT (`workOrderPrintTemplates`).
- **Para qué sirve:** RF-TEC-172: Padrón de beneficiarios por lote o frente (inmueble, titular, metros de frente, superficie, unidades), importable por Excel. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de modelos de impresión de OT (`workOrderPrintTemplates`) con `total`.
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2736 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-22-30)

<a id="API-TEC-22-31"></a>
#### API-TEC-22-31 · `POST /api/admin/tec/catalog/print-templates`

- **Qué hace:** Catálogos. Importación Excel. Da de alta un registro de modelos de impresión de OT (`workOrderPrintTemplates`).
- **Para qué sirve:** RF-TEC-172: Padrón de beneficiarios por lote o frente (inmueble, titular, metros de frente, superficie, unidades), importable por Excel. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** los datos de modelos de impresión de OT (`workOrderPrintTemplates`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de modelos de impresión de OT (`workOrderPrintTemplates`).
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2736 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-22-31)

<a id="API-TEC-22-32"></a>
#### API-TEC-22-32 · `GET /api/admin/tec/catalog/print-templates/{id}`

- **Qué hace:** Catálogos. Importación Excel. Obtiene el detalle de un registro de modelos de impresión de OT (`workOrderPrintTemplates`).
- **Para qué sirve:** RF-TEC-172: Padrón de beneficiarios por lote o frente (inmueble, titular, metros de frente, superficie, unidades), importable por Excel. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de modelos de impresión de OT (`workOrderPrintTemplates`).
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2736 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-22-32)

<a id="API-TEC-22-34"></a>
#### API-TEC-22-34 · `DELETE /api/admin/tec/catalog/print-templates/{id}`

- **Qué hace:** Catálogos. Importación Excel. Elimina o da de baja un registro de modelos de impresión de OT (`workOrderPrintTemplates`).
- **Para qué sirve:** RF-TEC-172: Padrón de beneficiarios por lote o frente (inmueble, titular, metros de frente, superficie, unidades), importable por Excel. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2736 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-22-34)

<a id="API-TEC-22-33"></a>
#### API-TEC-22-33 · `PATCH /api/admin/tec/catalog/print-templates/{id}`

- **Qué hace:** Catálogos. Importación Excel. Modifica algunos campos de un registro de modelos de impresión de OT (`workOrderPrintTemplates`) (solo los enviados).
- **Para qué sirve:** RF-TEC-172: Padrón de beneficiarios por lote o frente (inmueble, titular, metros de frente, superficie, unidades), importable por Excel. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de modelos de impresión de OT (`workOrderPrintTemplates`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de modelos de impresión de OT (`workOrderPrintTemplates`).
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2736 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-22-33)

<a id="API-TEC-22-35"></a>
#### API-TEC-22-35 · `GET /api/admin/tec/catalog/chained-rules`

- **Qué hace:** Catálogos. Importación Excel. Lista, con filtros y paginación, los registros de catálogo único de tareas (`taskCatalog`).
- **Para qué sirve:** RF-TEC-110: Catálogo de tareas y grupos de tareas por servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de catálogo único de tareas (`taskCatalog`) con `total`.
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2736 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-22-35)

<a id="API-TEC-22-36"></a>
#### API-TEC-22-36 · `POST /api/admin/tec/catalog/chained-rules`

- **Qué hace:** Catálogos. Importación Excel. Registra un nuevo elemento u operación en catálogo único de tareas (`taskCatalog`).
- **Para qué sirve:** RF-TEC-110: Catálogo de tareas y grupos de tareas por servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2736 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-22-36)

<a id="API-TEC-22-37"></a>
#### API-TEC-22-37 · `GET /api/admin/tec/catalog/chained-rules/{id}`

- **Qué hace:** Catálogos. Importación Excel. Obtiene el detalle de un registro de catálogo único de tareas (`taskCatalog`).
- **Para qué sirve:** RF-TEC-110: Catálogo de tareas y grupos de tareas por servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de catálogo único de tareas (`taskCatalog`).
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2736 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-22-37)

<a id="API-TEC-22-39"></a>
#### API-TEC-22-39 · `DELETE /api/admin/tec/catalog/chained-rules/{id}`

- **Qué hace:** Catálogos. Importación Excel. Elimina o da de baja un registro de catálogo único de tareas (`taskCatalog`).
- **Para qué sirve:** RF-TEC-110: Catálogo de tareas y grupos de tareas por servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2736 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-22-39)

<a id="API-TEC-22-38"></a>
#### API-TEC-22-38 · `PATCH /api/admin/tec/catalog/chained-rules/{id}`

- **Qué hace:** Catálogos. Importación Excel. Modifica algunos campos de un registro de catálogo único de tareas (`taskCatalog`) (solo los enviados).
- **Para qué sirve:** RF-TEC-110: Catálogo de tareas y grupos de tareas por servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de catálogo único de tareas (`taskCatalog`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de catálogo único de tareas (`taskCatalog`).
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2736 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-22-38)

<a id="API-TEC-22-40"></a>
#### API-TEC-22-40 · `GET /api/admin/tec/catalog/intake-channels`

- **Qué hace:** Catálogos. Importación Excel. Lista, con filtros y paginación, los registros de catálogo único de tareas (`taskCatalog`).
- **Para qué sirve:** RF-TEC-110: Catálogo de tareas y grupos de tareas por servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de catálogo único de tareas (`taskCatalog`) con `total`.
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2736 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-22-40)

<a id="API-TEC-22-41"></a>
#### API-TEC-22-41 · `POST /api/admin/tec/catalog/intake-channels`

- **Qué hace:** Catálogos. Importación Excel. Registra un nuevo elemento u operación en catálogo único de tareas (`taskCatalog`).
- **Para qué sirve:** RF-TEC-110: Catálogo de tareas y grupos de tareas por servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2736 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-22-41)

<a id="API-TEC-22-42"></a>
#### API-TEC-22-42 · `GET /api/admin/tec/catalog/intake-channels/{id}`

- **Qué hace:** Catálogos. Importación Excel. Obtiene el detalle de un registro de catálogo único de tareas (`taskCatalog`).
- **Para qué sirve:** RF-TEC-110: Catálogo de tareas y grupos de tareas por servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de catálogo único de tareas (`taskCatalog`).
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2736 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-22-42)

<a id="API-TEC-22-44"></a>
#### API-TEC-22-44 · `DELETE /api/admin/tec/catalog/intake-channels/{id}`

- **Qué hace:** Catálogos. Importación Excel. Elimina o da de baja un registro de catálogo único de tareas (`taskCatalog`).
- **Para qué sirve:** RF-TEC-110: Catálogo de tareas y grupos de tareas por servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2736 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-22-44)

<a id="API-TEC-22-43"></a>
#### API-TEC-22-43 · `PATCH /api/admin/tec/catalog/intake-channels/{id}`

- **Qué hace:** Catálogos. Importación Excel. Modifica algunos campos de un registro de catálogo único de tareas (`taskCatalog`) (solo los enviados).
- **Para qué sirve:** RF-TEC-110: Catálogo de tareas y grupos de tareas por servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de catálogo único de tareas (`taskCatalog`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de catálogo único de tareas (`taskCatalog`).
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2736 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-22-43)

<a id="API-TEC-23"></a>
#### API-TEC-23 · `GET /api/admin/tec/installations`

- **Qué hace:** Instalaciones. Consulta `installations`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.instalaciones.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-25 (Bandeja de instalaciones).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2737 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-23)

<a id="API-TEC-23-b"></a>
#### API-TEC-23-b · `POST /api/admin/tec/installations/{workOrderId}/confirm-activation`

- **Qué hace:** Instalaciones. Confirma la activación de un registro de `confirm-activation`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.instalaciones.revisar`.
- **Recibe:** en la ruta `workOrderId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2737 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-23-b)

<a id="API-TEC-23-c"></a>
#### API-TEC-23-c · `POST /api/admin/tec/installations/{workOrderId}/review`

- **Qué hace:** Instalaciones. Revisa un registro de `review`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.instalaciones.revisar`.
- **Recibe:** en la ruta `workOrderId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2737 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-23-c)

<a id="API-TEC-24"></a>
#### API-TEC-24 · `GET /api/admin/tec/sync-conflicts`

- **Qué hace:** Conflictos. Resolución con motivo. Lista, con filtros y paginación, los registros de conflictos de sincronización (`syncConflicts`).
- **Para qué sirve:** RF-TEC-127: No sincronizar órdenes modificadas en servidor sin aviso al técnico (V2 #57 reemplazado por conflicto/actualización con aviso). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.conflictos.resolver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de conflictos de sincronización (`syncConflicts`) con `total`.
- **Pantallas:** PAN-TEC-24 (Conflictos de sincronización).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2738 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-24)

<a id="API-TEC-24-b"></a>
#### API-TEC-24-b · `POST /api/admin/tec/sync-conflicts/{id}/resolve`

- **Qué hace:** Conflictos. Resolución con motivo. Resuelve un registro de conflictos de sincronización (`syncConflicts`).
- **Para qué sirve:** RF-TEC-127: No sincronizar órdenes modificadas en servidor sin aviso al técnico (V2 #57 reemplazado por conflicto/actualización con aviso). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.conflictos.resolver`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-24 (Conflictos de sincronización).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2738 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-24-b)

<a id="API-TEC-25"></a>
#### API-TEC-25 · `GET /api/admin/tec/field-forms`

- **Qué hace:** Formularios de campo. Versionado inmutable al publicar. Lista, con filtros y paginación, los registros de formularios de campo (`fieldForms`).
- **Para qué sirve:** RF-TEC-113: Descarga de trabajo asignado ("Mi día") con versión de cada tarea: OT, visitas, datos del servicio, materiales previstos, equipos en custodia, formularios, mapas de la zona. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.formulariosCampo.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de formularios de campo (`fieldForms`) con `total`.
- **Pantallas:** PAN-TEC-26 (Formularios de campo).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2739 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-25)

<a id="API-TEC-25-b"></a>
#### API-TEC-25-b · `POST /api/admin/tec/field-forms`

- **Qué hace:** Formularios de campo. Versionado inmutable al publicar. Da de alta un registro de formularios de campo (`fieldForms`).
- **Para qué sirve:** RF-TEC-113: Descarga de trabajo asignado ("Mi día") con versión de cada tarea: OT, visitas, datos del servicio, materiales previstos, equipos en custodia, formularios, mapas de la zona. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.formulariosCampo.gestionar`.
- **Recibe:** los datos de formularios de campo (`fieldForms`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de formularios de campo (`fieldForms`).
- **Pantallas:** PAN-TEC-26 (Formularios de campo).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2739 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-25-b)

<a id="API-TEC-25-c"></a>
#### API-TEC-25-c · `GET /api/admin/tec/field-forms/{id}`

- **Qué hace:** Formularios de campo. Versionado inmutable al publicar. Obtiene el detalle de un registro de formularios de campo (`fieldForms`).
- **Para qué sirve:** RF-TEC-113: Descarga de trabajo asignado ("Mi día") con versión de cada tarea: OT, visitas, datos del servicio, materiales previstos, equipos en custodia, formularios, mapas de la zona. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.formulariosCampo.gestionar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de formularios de campo (`fieldForms`).
- **Pantallas:** PAN-TEC-26 (Formularios de campo).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2739 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-25-c)

<a id="API-TEC-25-e"></a>
#### API-TEC-25-e · `DELETE /api/admin/tec/field-forms/{id}`

- **Qué hace:** Formularios de campo. Versionado inmutable al publicar. Elimina o da de baja un registro de formularios de campo (`fieldForms`).
- **Para qué sirve:** RF-TEC-113: Descarga de trabajo asignado ("Mi día") con versión de cada tarea: OT, visitas, datos del servicio, materiales previstos, equipos en custodia, formularios, mapas de la zona. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.formulariosCampo.gestionar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-TEC-26 (Formularios de campo).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2739 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-25-e)

<a id="API-TEC-25-d"></a>
#### API-TEC-25-d · `PATCH /api/admin/tec/field-forms/{id}`

- **Qué hace:** Formularios de campo. Versionado inmutable al publicar. Modifica algunos campos de un registro de formularios de campo (`fieldForms`) (solo los enviados).
- **Para qué sirve:** RF-TEC-113: Descarga de trabajo asignado ("Mi día") con versión de cada tarea: OT, visitas, datos del servicio, materiales previstos, equipos en custodia, formularios, mapas de la zona. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.formulariosCampo.gestionar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de formularios de campo (`fieldForms`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de formularios de campo (`fieldForms`).
- **Pantallas:** PAN-TEC-26 (Formularios de campo).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2739 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-25-d)

<a id="API-TEC-25-f"></a>
#### API-TEC-25-f · `POST /api/admin/tec/field-forms/{id}/publish`

- **Qué hace:** Formularios de campo. Versionado inmutable al publicar. Publica un registro de formularios de campo (`fieldForms`).
- **Para qué sirve:** RF-TEC-113: Descarga de trabajo asignado ("Mi día") con versión de cada tarea: OT, visitas, datos del servicio, materiales previstos, equipos en custodia, formularios, mapas de la zona. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.formulariosCampo.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-26 (Formularios de campo).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2739 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-25-f)

<a id="API-TEC-26"></a>
#### API-TEC-26 · `GET /api/admin/tec/maintenance-plans`

- **Qué hace:** Mantenimiento e interrupciones. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes CRUD · POST; PA-TEC-23). Lista, con filtros y paginación, los registros de planes de mantenimiento (`maintenancePlans`).
- **Para qué sirve:** RF-TEC-107: Tipos de trabajo con clase de orden (trabajo/mantenimiento) y reporte asociado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.mantenimiento.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de planes de mantenimiento (`maintenancePlans`) con `total`.
- **Pantallas:** PAN-TEC-27 (Activos y mantenimiento).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2740 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-26)

<a id="API-TEC-26-b"></a>
#### API-TEC-26-b · `POST /api/admin/tec/maintenance-plans`

- **Qué hace:** Mantenimiento e interrupciones. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes CRUD · POST; PA-TEC-23). Da de alta un registro de planes de mantenimiento (`maintenancePlans`).
- **Para qué sirve:** RF-TEC-107: Tipos de trabajo con clase de orden (trabajo/mantenimiento) y reporte asociado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.mantenimiento.gestionar`.
- **Recibe:** los datos de planes de mantenimiento (`maintenancePlans`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de planes de mantenimiento (`maintenancePlans`).
- **Pantallas:** PAN-TEC-27 (Activos y mantenimiento).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2740 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-26-b)

<a id="API-TEC-26-c"></a>
#### API-TEC-26-c · `GET /api/admin/tec/maintenance-plans/{id}`

- **Qué hace:** Mantenimiento e interrupciones. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes CRUD · POST; PA-TEC-23). Obtiene el detalle de un registro de planes de mantenimiento (`maintenancePlans`).
- **Para qué sirve:** RF-TEC-107: Tipos de trabajo con clase de orden (trabajo/mantenimiento) y reporte asociado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.mantenimiento.gestionar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de planes de mantenimiento (`maintenancePlans`).
- **Pantallas:** PAN-TEC-27 (Activos y mantenimiento).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2740 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-26-c)

<a id="API-TEC-26-e"></a>
#### API-TEC-26-e · `DELETE /api/admin/tec/maintenance-plans/{id}`

- **Qué hace:** Mantenimiento e interrupciones. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes CRUD · POST; PA-TEC-23). Elimina o da de baja un registro de planes de mantenimiento (`maintenancePlans`).
- **Para qué sirve:** RF-TEC-137: Cortes masivos con vista de a quién ya se generó la orden y exclusión de servicios con orden en curso. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.cortes.gestionar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-TEC-28 (Interrupciones e impacto).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2740 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-26-e)

<a id="API-TEC-26-d"></a>
#### API-TEC-26-d · `PATCH /api/admin/tec/maintenance-plans/{id}`

- **Qué hace:** Mantenimiento e interrupciones. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes CRUD · POST; PA-TEC-23). Modifica algunos campos de un registro de planes de mantenimiento (`maintenancePlans`) (solo los enviados).
- **Para qué sirve:** RF-TEC-107: Tipos de trabajo con clase de orden (trabajo/mantenimiento) y reporte asociado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.mantenimiento.gestionar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de planes de mantenimiento (`maintenancePlans`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de planes de mantenimiento (`maintenancePlans`).
- **Pantallas:** PAN-TEC-27 (Activos y mantenimiento).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2740 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-26-d)

<a id="API-TEC-26-f"></a>
#### API-TEC-26-f · `GET /api/admin/tec/outages`

- **Qué hace:** Mantenimiento e interrupciones. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes CRUD · POST; PA-TEC-23). Consulta `outages`.
- **Para qué sirve:** RF-TEC-107: Tipos de trabajo con clase de orden (trabajo/mantenimiento) y reporte asociado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.mantenimiento.gestionar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-27 (Activos y mantenimiento).
- **Ola:** O6 · **Fuente:** M10 §11. API, línea 2740 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-26-f)

<a id="API-TEC-26-g"></a>
#### API-TEC-26-g · `POST /api/admin/tec/outages`

- **Qué hace:** Mantenimiento e interrupciones. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes CRUD · POST; PA-TEC-23). Registra un nuevo elemento u operación en `outages`.
- **Para qué sirve:** RF-TEC-107: Tipos de trabajo con clase de orden (trabajo/mantenimiento) y reporte asociado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.mantenimiento.gestionar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-27 (Activos y mantenimiento).
- **Ola:** O6 · **Fuente:** M10 §11. API, línea 2740 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-26-g)

<a id="API-TEC-26-h"></a>
#### API-TEC-26-h · `GET /api/admin/tec/outages/{id}`

- **Qué hace:** Mantenimiento e interrupciones. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes CRUD · POST; PA-TEC-23). Obtiene el detalle de un registro de `outages`.
- **Para qué sirve:** RF-TEC-107: Tipos de trabajo con clase de orden (trabajo/mantenimiento) y reporte asociado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.mantenimiento.gestionar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-27 (Activos y mantenimiento).
- **Ola:** O6 · **Fuente:** M10 §11. API, línea 2740 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-26-h)

<a id="API-TEC-26-j"></a>
#### API-TEC-26-j · `DELETE /api/admin/tec/outages/{id}`

- **Qué hace:** Mantenimiento e interrupciones. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes CRUD · POST; PA-TEC-23). Elimina o da de baja un registro de `outages`.
- **Para qué sirve:** RF-TEC-137: Cortes masivos con vista de a quién ya se generó la orden y exclusión de servicios con orden en curso. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.cortes.gestionar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-TEC-28 (Interrupciones e impacto).
- **Ola:** O6 · **Fuente:** M10 §11. API, línea 2740 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-26-j)

<a id="API-TEC-26-i"></a>
#### API-TEC-26-i · `PATCH /api/admin/tec/outages/{id}`

- **Qué hace:** Mantenimiento e interrupciones. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes CRUD · POST; PA-TEC-23). Modifica algunos campos de un registro de `outages` (solo los enviados).
- **Para qué sirve:** RF-TEC-107: Tipos de trabajo con clase de orden (trabajo/mantenimiento) y reporte asociado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.mantenimiento.gestionar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar; cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-27 (Activos y mantenimiento).
- **Ola:** O6 · **Fuente:** M10 §11. API, línea 2740 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-26-i)

<a id="API-TEC-26-k"></a>
#### API-TEC-26-k · `POST /api/admin/tec/outages/{id}/approve`

- **Qué hace:** Mantenimiento e interrupciones. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes CRUD · POST; PA-TEC-23). Aprueba un registro de `approve`.
- **Para qué sirve:** RF-TEC-107: Tipos de trabajo con clase de orden (trabajo/mantenimiento) y reporte asociado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.mantenimiento.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-27 (Activos y mantenimiento).
- **Ola:** O6 · **Fuente:** M10 §11. API, línea 2740 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-26-k)

<a id="API-TEC-26-l"></a>
#### API-TEC-26-l · `POST /api/admin/tec/outages/{id}/notify`

- **Qué hace:** Mantenimiento e interrupciones. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes CRUD · POST; PA-TEC-23). Notifica un registro de `notify`.
- **Para qué sirve:** RF-TEC-107: Tipos de trabajo con clase de orden (trabajo/mantenimiento) y reporte asociado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.mantenimiento.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-27 (Activos y mantenimiento).
- **Ola:** O6 · **Fuente:** M10 §11. API, línea 2740 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-26-l)

<a id="API-TEC-26-m"></a>
#### API-TEC-26-m · `POST /api/admin/tec/outages/{id}/start`

- **Qué hace:** Mantenimiento e interrupciones. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes CRUD · POST; PA-TEC-23). Inicia un registro de `start`.
- **Para qué sirve:** RF-TEC-107: Tipos de trabajo con clase de orden (trabajo/mantenimiento) y reporte asociado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.mantenimiento.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-27 (Activos y mantenimiento).
- **Ola:** O6 · **Fuente:** M10 §11. API, línea 2740 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-26-m)

<a id="API-TEC-26-n"></a>
#### API-TEC-26-n · `POST /api/admin/tec/outages/{id}/finish`

- **Qué hace:** Mantenimiento e interrupciones. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes CRUD · POST; PA-TEC-23). Finaliza un registro de `finish`.
- **Para qué sirve:** RF-TEC-107: Tipos de trabajo con clase de orden (trabajo/mantenimiento) y reporte asociado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.mantenimiento.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-27 (Activos y mantenimiento).
- **Ola:** O6 · **Fuente:** M10 §11. API, línea 2740 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-26-n)

<a id="API-TEC-26-o"></a>
#### API-TEC-26-o · `POST /api/admin/tec/outages/{id}/cancel`

- **Qué hace:** Mantenimiento e interrupciones. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes CRUD · POST; PA-TEC-23). Cancela un registro de `cancel`.
- **Para qué sirve:** RF-TEC-107: Tipos de trabajo con clase de orden (trabajo/mantenimiento) y reporte asociado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.mantenimiento.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-27 (Activos y mantenimiento).
- **Ola:** O6 · **Fuente:** M10 §11. API, línea 2740 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-26-o)

<a id="API-TEC-27"></a>
#### API-TEC-27 · `GET /api/admin/tec/networks/impact`

- **Qué hace:** Análisis de impacto. Async (JOB-TEC-15) si supera umbral. Consulta redes (`networks`).
- **Para qué sirve:** RF-TEC-145: Identificar contratos potencialmente afectados por un elemento o zona (análisis de impacto aguas abajo). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.redes.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: el registro de redes (`networks`).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2741 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-27)

<a id="API-TEC-28"></a>
#### API-TEC-28 · `GET /api/admin/tec/networks/networks`

- **Qué hace:** Estructura de red. Lista, con filtros y paginación, los registros de redes (`networks`).
- **Para qué sirve:** RF-TEC-148: Definir redes (eléctrica, agua, gas, cloacas, telecom) y los servicios que usan cada red. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.redes.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de redes (`networks`) con `total`.
- **Pantallas:** PAN-TEC-30 (Estructura de redes), PAN-TEC-33 (Red v1 (absorbida)).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2742 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-28)

<a id="API-TEC-28-b"></a>
#### API-TEC-28-b · `POST /api/admin/tec/networks/networks`

- **Qué hace:** Estructura de red. Da de alta un registro de redes (`networks`).
- **Para qué sirve:** RF-TEC-148: Definir redes (eléctrica, agua, gas, cloacas, telecom) y los servicios que usan cada red. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.redes.configurar`.
- **Recibe:** los datos de redes (`networks`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de redes (`networks`).
- **Pantallas:** PAN-TEC-30 (Estructura de redes), PAN-TEC-33 (Red v1 (absorbida)).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2742 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-28-b)

<a id="API-TEC-28-c"></a>
#### API-TEC-28-c · `GET /api/admin/tec/networks/networks/{id}`

- **Qué hace:** Estructura de red. Obtiene el detalle de un registro de redes (`networks`).
- **Para qué sirve:** RF-TEC-148: Definir redes (eléctrica, agua, gas, cloacas, telecom) y los servicios que usan cada red. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.redes.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de redes (`networks`).
- **Pantallas:** PAN-TEC-30 (Estructura de redes), PAN-TEC-33 (Red v1 (absorbida)).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2742 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-28-c)

<a id="API-TEC-28-e"></a>
#### API-TEC-28-e · `DELETE /api/admin/tec/networks/networks/{id}`

- **Qué hace:** Estructura de red. Elimina o da de baja un registro de redes (`networks`).
- **Para qué sirve:** RF-TEC-148: Definir redes (eléctrica, agua, gas, cloacas, telecom) y los servicios que usan cada red. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.redes.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-TEC-30 (Estructura de redes), PAN-TEC-33 (Red v1 (absorbida)).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2742 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-28-e)

<a id="API-TEC-28-d"></a>
#### API-TEC-28-d · `PATCH /api/admin/tec/networks/networks/{id}`

- **Qué hace:** Estructura de red. Modifica algunos campos de un registro de redes (`networks`) (solo los enviados).
- **Para qué sirve:** RF-TEC-148: Definir redes (eléctrica, agua, gas, cloacas, telecom) y los servicios que usan cada red. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.redes.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de redes (`networks`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de redes (`networks`).
- **Pantallas:** PAN-TEC-30 (Estructura de redes), PAN-TEC-33 (Red v1 (absorbida)).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2742 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-28-d)

<a id="API-TEC-28-f"></a>
#### API-TEC-28-f · `GET /api/admin/tec/networks/layers`

- **Qué hace:** Estructura de red. Consulta redes (`networks`).
- **Para qué sirve:** RF-TEC-148: Definir redes (eléctrica, agua, gas, cloacas, telecom) y los servicios que usan cada red. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.redes.configurar`.
- **Recibe:** nada.
- **Devuelve:** 200: el registro de redes (`networks`).
- **Pantallas:** PAN-TEC-30 (Estructura de redes), PAN-TEC-33 (Red v1 (absorbida)).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2742 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-28-f)

<a id="API-TEC-28-g"></a>
#### API-TEC-28-g · `POST /api/admin/tec/networks/layers`

- **Qué hace:** Estructura de red. Registra un nuevo elemento u operación en redes (`networks`).
- **Para qué sirve:** RF-TEC-148: Definir redes (eléctrica, agua, gas, cloacas, telecom) y los servicios que usan cada red. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.redes.configurar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-30 (Estructura de redes), PAN-TEC-33 (Red v1 (absorbida)).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2742 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-28-g)

<a id="API-TEC-28-h"></a>
#### API-TEC-28-h · `GET /api/admin/tec/networks/layers/{id}`

- **Qué hace:** Estructura de red. Obtiene el detalle de un registro de redes (`networks`).
- **Para qué sirve:** RF-TEC-148: Definir redes (eléctrica, agua, gas, cloacas, telecom) y los servicios que usan cada red. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.redes.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de redes (`networks`).
- **Pantallas:** PAN-TEC-30 (Estructura de redes), PAN-TEC-33 (Red v1 (absorbida)).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2742 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-28-h)

<a id="API-TEC-28-j"></a>
#### API-TEC-28-j · `DELETE /api/admin/tec/networks/layers/{id}`

- **Qué hace:** Estructura de red. Elimina o da de baja un registro de redes (`networks`).
- **Para qué sirve:** RF-TEC-148: Definir redes (eléctrica, agua, gas, cloacas, telecom) y los servicios que usan cada red. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.redes.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-TEC-30 (Estructura de redes), PAN-TEC-33 (Red v1 (absorbida)).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2742 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-28-j)

<a id="API-TEC-28-i"></a>
#### API-TEC-28-i · `PATCH /api/admin/tec/networks/layers/{id}`

- **Qué hace:** Estructura de red. Modifica algunos campos de un registro de redes (`networks`) (solo los enviados).
- **Para qué sirve:** RF-TEC-148: Definir redes (eléctrica, agua, gas, cloacas, telecom) y los servicios que usan cada red. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.redes.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de redes (`networks`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de redes (`networks`).
- **Pantallas:** PAN-TEC-30 (Estructura de redes), PAN-TEC-33 (Red v1 (absorbida)).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2742 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-28-i)

<a id="API-TEC-28-k"></a>
#### API-TEC-28-k · `GET /api/admin/tec/networks/component-types`

- **Qué hace:** Estructura de red. Consulta redes (`networks`).
- **Para qué sirve:** RF-TEC-148: Definir redes (eléctrica, agua, gas, cloacas, telecom) y los servicios que usan cada red. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.redes.configurar`.
- **Recibe:** nada.
- **Devuelve:** 200: el registro de redes (`networks`).
- **Pantallas:** PAN-TEC-30 (Estructura de redes), PAN-TEC-33 (Red v1 (absorbida)).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2742 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-28-k)

<a id="API-TEC-28-l"></a>
#### API-TEC-28-l · `POST /api/admin/tec/networks/component-types`

- **Qué hace:** Estructura de red. Registra un nuevo elemento u operación en redes (`networks`).
- **Para qué sirve:** RF-TEC-148: Definir redes (eléctrica, agua, gas, cloacas, telecom) y los servicios que usan cada red. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.redes.configurar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-30 (Estructura de redes), PAN-TEC-33 (Red v1 (absorbida)).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2742 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-28-l)

<a id="API-TEC-28-m"></a>
#### API-TEC-28-m · `GET /api/admin/tec/networks/component-types/{id}`

- **Qué hace:** Estructura de red. Obtiene el detalle de un registro de redes (`networks`).
- **Para qué sirve:** RF-TEC-148: Definir redes (eléctrica, agua, gas, cloacas, telecom) y los servicios que usan cada red. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.redes.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de redes (`networks`).
- **Pantallas:** PAN-TEC-30 (Estructura de redes), PAN-TEC-33 (Red v1 (absorbida)).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2742 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-28-m)

<a id="API-TEC-28-o"></a>
#### API-TEC-28-o · `DELETE /api/admin/tec/networks/component-types/{id}`

- **Qué hace:** Estructura de red. Elimina o da de baja un registro de redes (`networks`).
- **Para qué sirve:** RF-TEC-148: Definir redes (eléctrica, agua, gas, cloacas, telecom) y los servicios que usan cada red. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.redes.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-TEC-30 (Estructura de redes), PAN-TEC-33 (Red v1 (absorbida)).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2742 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-28-o)

<a id="API-TEC-28-n"></a>
#### API-TEC-28-n · `PATCH /api/admin/tec/networks/component-types/{id}`

- **Qué hace:** Estructura de red. Modifica algunos campos de un registro de redes (`networks`) (solo los enviados).
- **Para qué sirve:** RF-TEC-148: Definir redes (eléctrica, agua, gas, cloacas, telecom) y los servicios que usan cada red. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.redes.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de redes (`networks`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de redes (`networks`).
- **Pantallas:** PAN-TEC-30 (Estructura de redes), PAN-TEC-33 (Red v1 (absorbida)).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2742 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-28-n)

<a id="API-TEC-28-p"></a>
#### API-TEC-28-p · `GET /api/admin/tec/networks/relations`

- **Qué hace:** Estructura de red. Consulta redes (`networks`).
- **Para qué sirve:** RF-TEC-148: Definir redes (eléctrica, agua, gas, cloacas, telecom) y los servicios que usan cada red. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.redes.configurar`.
- **Recibe:** nada.
- **Devuelve:** 200: el registro de redes (`networks`).
- **Pantallas:** PAN-TEC-30 (Estructura de redes), PAN-TEC-33 (Red v1 (absorbida)).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2742 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-28-p)

<a id="API-TEC-28-q"></a>
#### API-TEC-28-q · `POST /api/admin/tec/networks/relations`

- **Qué hace:** Estructura de red. Registra un nuevo elemento u operación en redes (`networks`).
- **Para qué sirve:** RF-TEC-148: Definir redes (eléctrica, agua, gas, cloacas, telecom) y los servicios que usan cada red. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.redes.configurar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-30 (Estructura de redes), PAN-TEC-33 (Red v1 (absorbida)).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2742 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-28-q)

<a id="API-TEC-28-r"></a>
#### API-TEC-28-r · `GET /api/admin/tec/networks/relations/{id}`

- **Qué hace:** Estructura de red. Obtiene el detalle de un registro de redes (`networks`).
- **Para qué sirve:** RF-TEC-148: Definir redes (eléctrica, agua, gas, cloacas, telecom) y los servicios que usan cada red. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.redes.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de redes (`networks`).
- **Pantallas:** PAN-TEC-30 (Estructura de redes), PAN-TEC-33 (Red v1 (absorbida)).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2742 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-28-r)

<a id="API-TEC-28-t"></a>
#### API-TEC-28-t · `DELETE /api/admin/tec/networks/relations/{id}`

- **Qué hace:** Estructura de red. Elimina o da de baja un registro de redes (`networks`).
- **Para qué sirve:** RF-TEC-148: Definir redes (eléctrica, agua, gas, cloacas, telecom) y los servicios que usan cada red. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.redes.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-TEC-30 (Estructura de redes), PAN-TEC-33 (Red v1 (absorbida)).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2742 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-28-t)

<a id="API-TEC-28-s"></a>
#### API-TEC-28-s · `PATCH /api/admin/tec/networks/relations/{id}`

- **Qué hace:** Estructura de red. Modifica algunos campos de un registro de redes (`networks`) (solo los enviados).
- **Para qué sirve:** RF-TEC-148: Definir redes (eléctrica, agua, gas, cloacas, telecom) y los servicios que usan cada red. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.redes.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de redes (`networks`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de redes (`networks`).
- **Pantallas:** PAN-TEC-30 (Estructura de redes), PAN-TEC-33 (Red v1 (absorbida)).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2742 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-28-s)

<a id="API-TEC-28-u"></a>
#### API-TEC-28-u · `GET /api/admin/tec/networks/attributes`

- **Qué hace:** Estructura de red. Consulta redes (`networks`).
- **Para qué sirve:** RF-TEC-148: Definir redes (eléctrica, agua, gas, cloacas, telecom) y los servicios que usan cada red. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.redes.configurar`.
- **Recibe:** nada.
- **Devuelve:** 200: el registro de redes (`networks`).
- **Pantallas:** PAN-TEC-30 (Estructura de redes), PAN-TEC-33 (Red v1 (absorbida)).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2742 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-28-u)

<a id="API-TEC-28-v"></a>
#### API-TEC-28-v · `POST /api/admin/tec/networks/attributes`

- **Qué hace:** Estructura de red. Registra un nuevo elemento u operación en redes (`networks`).
- **Para qué sirve:** RF-TEC-148: Definir redes (eléctrica, agua, gas, cloacas, telecom) y los servicios que usan cada red. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.redes.configurar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-30 (Estructura de redes), PAN-TEC-33 (Red v1 (absorbida)).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2742 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-28-v)

<a id="API-TEC-28-w"></a>
#### API-TEC-28-w · `GET /api/admin/tec/networks/attributes/{id}`

- **Qué hace:** Estructura de red. Obtiene el detalle de un registro de redes (`networks`).
- **Para qué sirve:** RF-TEC-148: Definir redes (eléctrica, agua, gas, cloacas, telecom) y los servicios que usan cada red. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.redes.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de redes (`networks`).
- **Pantallas:** PAN-TEC-30 (Estructura de redes), PAN-TEC-33 (Red v1 (absorbida)).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2742 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-28-w)

<a id="API-TEC-28-y"></a>
#### API-TEC-28-y · `DELETE /api/admin/tec/networks/attributes/{id}`

- **Qué hace:** Estructura de red. Elimina o da de baja un registro de redes (`networks`).
- **Para qué sirve:** RF-TEC-148: Definir redes (eléctrica, agua, gas, cloacas, telecom) y los servicios que usan cada red. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.redes.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-TEC-30 (Estructura de redes), PAN-TEC-33 (Red v1 (absorbida)).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2742 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-28-y)

<a id="API-TEC-28-x"></a>
#### API-TEC-28-x · `PATCH /api/admin/tec/networks/attributes/{id}`

- **Qué hace:** Estructura de red. Modifica algunos campos de un registro de redes (`networks`) (solo los enviados).
- **Para qué sirve:** RF-TEC-148: Definir redes (eléctrica, agua, gas, cloacas, telecom) y los servicios que usan cada red. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.redes.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de redes (`networks`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de redes (`networks`).
- **Pantallas:** PAN-TEC-30 (Estructura de redes), PAN-TEC-33 (Red v1 (absorbida)).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2742 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-28-x)

<a id="API-TEC-29"></a>
#### API-TEC-29 · `GET /api/admin/tec/networks/elements`

- **Qué hace:** Red instalada. GeoJSON; bbox con índice 2dsphere. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes CRUD · PO... Consulta redes (`networks`).
- **Para qué sirve:** RF-TEC-086: Reservar equipo identificado (serie) a la OT y transferir custodia del depósito al instalador antes de la visita. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.redes.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: el registro de redes (`networks`).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2743 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-29)

<a id="API-TEC-29-b"></a>
#### API-TEC-29-b · `POST /api/admin/tec/networks/elements`

- **Qué hace:** Red instalada. GeoJSON; bbox con índice 2dsphere. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes CRUD · PO... Registra un nuevo elemento u operación en redes (`networks`).
- **Para qué sirve:** RF-TEC-086: Reservar equipo identificado (serie) a la OT y transferir custodia del depósito al instalador antes de la visita. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.redes.gestionar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-31 (Red instalada), PAN-TEC-32 (Conexiones servicio–red), PAN-TEC-33 (Red v1 (absorbida)).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2743 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-29-b)

<a id="API-TEC-29-c"></a>
#### API-TEC-29-c · `GET /api/admin/tec/networks/elements/{id}`

- **Qué hace:** Red instalada. GeoJSON; bbox con índice 2dsphere. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes CRUD · PO... Obtiene el detalle de un registro de redes (`networks`).
- **Para qué sirve:** RF-TEC-086: Reservar equipo identificado (serie) a la OT y transferir custodia del depósito al instalador antes de la visita. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.redes.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de redes (`networks`).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2743 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-29-c)

<a id="API-TEC-29-e"></a>
#### API-TEC-29-e · `DELETE /api/admin/tec/networks/elements/{id}`

- **Qué hace:** Red instalada. GeoJSON; bbox con índice 2dsphere. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes CRUD · PO... Elimina o da de baja un registro de redes (`networks`).
- **Para qué sirve:** RF-TEC-086: Reservar equipo identificado (serie) a la OT y transferir custodia del depósito al instalador antes de la visita. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.redes.gestionar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-TEC-31 (Red instalada), PAN-TEC-32 (Conexiones servicio–red), PAN-TEC-33 (Red v1 (absorbida)).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2743 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-29-e)

<a id="API-TEC-29-d"></a>
#### API-TEC-29-d · `PATCH /api/admin/tec/networks/elements/{id}`

- **Qué hace:** Red instalada. GeoJSON; bbox con índice 2dsphere. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes CRUD · PO... Modifica algunos campos de un registro de redes (`networks`) (solo los enviados).
- **Para qué sirve:** RF-TEC-086: Reservar equipo identificado (serie) a la OT y transferir custodia del depósito al instalador antes de la visita. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.redes.gestionar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de redes (`networks`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de redes (`networks`).
- **Pantallas:** PAN-TEC-31 (Red instalada), PAN-TEC-32 (Conexiones servicio–red), PAN-TEC-33 (Red v1 (absorbida)).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2743 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-29-d)

<a id="API-TEC-29-f"></a>
#### API-TEC-29-f · `POST /api/admin/tec/networks/elements/bulk`

- **Qué hace:** Red instalada. GeoJSON; bbox con índice 2dsphere. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes CRUD · PO... Procesa en forma masiva sobre redes (`networks`).
- **Para qué sirve:** RF-TEC-086: Reservar equipo identificado (serie) a la OT y transferir custodia del depósito al instalador antes de la visita. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.redes.gestionar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-31 (Red instalada), PAN-TEC-32 (Conexiones servicio–red), PAN-TEC-33 (Red v1 (absorbida)).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2743 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-29-f)

<a id="API-TEC-29-g"></a>
#### API-TEC-29-g · `GET /api/admin/tec/networks/elements/tree`

- **Qué hace:** Red instalada. GeoJSON; bbox con índice 2dsphere. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes CRUD · PO... Consulta redes (`networks`).
- **Para qué sirve:** RF-TEC-086: Reservar equipo identificado (serie) a la OT y transferir custodia del depósito al instalador antes de la visita. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.redes.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: el registro de redes (`networks`).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2743 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-29-g)

<a id="API-TEC-29-h"></a>
#### API-TEC-29-h · `GET /api/admin/tec/networks/elements/geo`

- **Qué hace:** Red instalada. GeoJSON; bbox con índice 2dsphere. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes CRUD · PO... Consulta redes (`networks`).
- **Para qué sirve:** RF-TEC-086: Reservar equipo identificado (serie) a la OT y transferir custodia del depósito al instalador antes de la visita. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.redes.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: el registro de redes (`networks`).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2743 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-29-h)

<a id="API-TEC-30"></a>
#### API-TEC-30 · `GET /api/admin/tec/networks/connections`

- **Qué hace:** Conexiones. Consulta redes (`networks`).
- **Para qué sirve:** RF-TEC-148: Definir redes (eléctrica, agua, gas, cloacas, telecom) y los servicios que usan cada red. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.redes.gestionar`.
- **Recibe:** nada.
- **Devuelve:** 200: el registro de redes (`networks`).
- **Pantallas:** PAN-TEC-31 (Red instalada), PAN-TEC-32 (Conexiones servicio–red), PAN-TEC-33 (Red v1 (absorbida)).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2744 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-30)

<a id="API-TEC-30-b"></a>
#### API-TEC-30-b · `POST /api/admin/tec/networks/connections`

- **Qué hace:** Conexiones. Registra un nuevo elemento u operación en redes (`networks`).
- **Para qué sirve:** RF-TEC-148: Definir redes (eléctrica, agua, gas, cloacas, telecom) y los servicios que usan cada red. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.redes.gestionar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-31 (Red instalada), PAN-TEC-32 (Conexiones servicio–red), PAN-TEC-33 (Red v1 (absorbida)).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2744 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-30-b)

<a id="API-TEC-30-c"></a>
#### API-TEC-30-c · `POST /api/admin/tec/networks/connections/{id}/disconnect`

- **Qué hace:** Conexiones. Desconecta un registro de redes (`networks`).
- **Para qué sirve:** RF-TEC-148: Definir redes (eléctrica, agua, gas, cloacas, telecom) y los servicios que usan cada red. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.redes.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-31 (Red instalada), PAN-TEC-32 (Conexiones servicio–red), PAN-TEC-33 (Red v1 (absorbida)).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2744 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-30-c)

<a id="API-TEC-31"></a>
#### API-TEC-31 · `GET /api/admin/tec/networks/export-templates`

- **Qué hace:** Exportación GIS. Consulta redes (`networks`).
- **Para qué sirve:** RF-TEC-148: Definir redes (eléctrica, agua, gas, cloacas, telecom) y los servicios que usan cada red. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.redes.exportar`.
- **Recibe:** nada.
- **Devuelve:** 200: el registro de redes (`networks`).
- **Pantallas:** PAN-TEC-34 (Exportación GIS).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2745 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-31)

<a id="API-TEC-31-b"></a>
#### API-TEC-31-b · `POST /api/admin/tec/networks/export-templates`

- **Qué hace:** Exportación GIS. Registra un nuevo elemento u operación en redes (`networks`).
- **Para qué sirve:** RF-TEC-148: Definir redes (eléctrica, agua, gas, cloacas, telecom) y los servicios que usan cada red. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.redes.exportar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-34 (Exportación GIS).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2745 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-31-b)

<a id="API-TEC-31-c"></a>
#### API-TEC-31-c · `GET /api/admin/tec/networks/export-templates/{id}`

- **Qué hace:** Exportación GIS. Obtiene el detalle de un registro de redes (`networks`).
- **Para qué sirve:** RF-TEC-148: Definir redes (eléctrica, agua, gas, cloacas, telecom) y los servicios que usan cada red. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.redes.exportar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de redes (`networks`).
- **Pantallas:** PAN-TEC-34 (Exportación GIS).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2745 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-31-c)

<a id="API-TEC-31-e"></a>
#### API-TEC-31-e · `DELETE /api/admin/tec/networks/export-templates/{id}`

- **Qué hace:** Exportación GIS. Elimina o da de baja un registro de redes (`networks`).
- **Para qué sirve:** RF-TEC-148: Definir redes (eléctrica, agua, gas, cloacas, telecom) y los servicios que usan cada red. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.redes.exportar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-TEC-34 (Exportación GIS).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2745 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-31-e)

<a id="API-TEC-31-d"></a>
#### API-TEC-31-d · `PATCH /api/admin/tec/networks/export-templates/{id}`

- **Qué hace:** Exportación GIS. Modifica algunos campos de un registro de redes (`networks`) (solo los enviados).
- **Para qué sirve:** RF-TEC-148: Definir redes (eléctrica, agua, gas, cloacas, telecom) y los servicios que usan cada red. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.redes.exportar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de redes (`networks`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de redes (`networks`).
- **Pantallas:** PAN-TEC-34 (Exportación GIS).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2745 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-31-d)

<a id="API-TEC-31-f"></a>
#### API-TEC-31-f · `POST /api/admin/tec/networks/export-templates/{id}/run`

- **Qué hace:** Exportación GIS. Ejecuta un registro de redes (`networks`).
- **Para qué sirve:** RF-TEC-148: Definir redes (eléctrica, agua, gas, cloacas, telecom) y los servicios que usan cada red. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.redes.exportar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-34 (Exportación GIS).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2745 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-31-f)

<a id="API-TEC-32"></a>
#### API-TEC-32 · `GET /api/admin/tec/network-devices`

- **Qué hace:** Equipos de red. Credencial solo como credentialRef. Lista, con filtros y paginación, los registros de equipos de red (`networkDevices`).
- **Para qué sirve:** RF-TEC-165: Credenciales de equipos (usuario/clave/token) gestionadas en la bóveda del tenant; nunca visibles en catálogo, BI ni API pública. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.equiposRed.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de equipos de red (`networkDevices`) con `total`.
- **Pantallas:** PAN-TEC-35 (Equipos de red).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2746 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-32)

<a id="API-TEC-32-b"></a>
#### API-TEC-32-b · `POST /api/admin/tec/network-devices`

- **Qué hace:** Equipos de red. Credencial solo como credentialRef. Da de alta un registro de equipos de red (`networkDevices`).
- **Para qué sirve:** RF-TEC-165: Credenciales de equipos (usuario/clave/token) gestionadas en la bóveda del tenant; nunca visibles en catálogo, BI ni API pública. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.equiposRed.gestionar`.
- **Recibe:** los datos de equipos de red (`networkDevices`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de equipos de red (`networkDevices`).
- **Pantallas:** PAN-TEC-35 (Equipos de red).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2746 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-32-b)

<a id="API-TEC-32-c"></a>
#### API-TEC-32-c · `GET /api/admin/tec/network-devices/{id}`

- **Qué hace:** Equipos de red. Credencial solo como credentialRef. Obtiene el detalle de un registro de equipos de red (`networkDevices`).
- **Para qué sirve:** RF-TEC-165: Credenciales de equipos (usuario/clave/token) gestionadas en la bóveda del tenant; nunca visibles en catálogo, BI ni API pública. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.equiposRed.gestionar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de equipos de red (`networkDevices`).
- **Pantallas:** PAN-TEC-35 (Equipos de red).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2746 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-32-c)

<a id="API-TEC-32-e"></a>
#### API-TEC-32-e · `DELETE /api/admin/tec/network-devices/{id}`

- **Qué hace:** Equipos de red. Credencial solo como credentialRef. Elimina o da de baja un registro de equipos de red (`networkDevices`).
- **Para qué sirve:** RF-TEC-165: Credenciales de equipos (usuario/clave/token) gestionadas en la bóveda del tenant; nunca visibles en catálogo, BI ni API pública. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.equiposRed.gestionar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-TEC-35 (Equipos de red).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2746 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-32-e)

<a id="API-TEC-32-d"></a>
#### API-TEC-32-d · `PATCH /api/admin/tec/network-devices/{id}`

- **Qué hace:** Equipos de red. Credencial solo como credentialRef. Modifica algunos campos de un registro de equipos de red (`networkDevices`) (solo los enviados).
- **Para qué sirve:** RF-TEC-165: Credenciales de equipos (usuario/clave/token) gestionadas en la bóveda del tenant; nunca visibles en catálogo, BI ni API pública. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.equiposRed.gestionar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de equipos de red (`networkDevices`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de equipos de red (`networkDevices`).
- **Pantallas:** PAN-TEC-35 (Equipos de red).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2746 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-32-d)

<a id="API-TEC-32-f"></a>
#### API-TEC-32-f · `GET /api/admin/tec/network-devices/{id}/status`

- **Qué hace:** Equipos de red. Credencial solo como credentialRef. Consulta «status» de un registro de equipos de red (`networkDevices`).
- **Para qué sirve:** RF-TEC-165: Credenciales de equipos (usuario/clave/token) gestionadas en la bóveda del tenant; nunca visibles en catálogo, BI ni API pública. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.equiposRed.gestionar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de equipos de red (`networkDevices`).
- **Pantallas:** PAN-TEC-35 (Equipos de red).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2746 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-32-f)

<a id="API-TEC-33"></a>
#### API-TEC-33 · `GET /api/admin/tec/provisioning/systems`

- **Qué hace:** Sistemas de aprovisionamiento. Lista, con filtros y paginación, los registros de sistemas de aprovisionamiento (`provisioningSystems`).
- **Para qué sirve:** RF-TEC-182: Configurar sistemas de aprovisionamiento por tenant y servicio: tipo (MikroTik, Radius, Radius Gretix, SmartOlt, Wispro, Sopnet, Silexis, Ispfull, Sensa, SITSA, AION, manual), endpoint, credenciales en bóveda, modo solo… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.aprovisionamiento.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de sistemas de aprovisionamiento (`provisioningSystems`) con `total`.
- **Pantallas:** PAN-TEC-36 (Sistemas de aprovisionamiento).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2747 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-33)

<a id="API-TEC-33-b"></a>
#### API-TEC-33-b · `POST /api/admin/tec/provisioning/systems`

- **Qué hace:** Sistemas de aprovisionamiento. Da de alta un registro de sistemas de aprovisionamiento (`provisioningSystems`).
- **Para qué sirve:** RF-TEC-182: Configurar sistemas de aprovisionamiento por tenant y servicio: tipo (MikroTik, Radius, Radius Gretix, SmartOlt, Wispro, Sopnet, Silexis, Ispfull, Sensa, SITSA, AION, manual), endpoint, credenciales en bóveda, modo solo… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.aprovisionamiento.configurar`.
- **Recibe:** los datos de sistemas de aprovisionamiento (`provisioningSystems`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de sistemas de aprovisionamiento (`provisioningSystems`).
- **Pantallas:** PAN-TEC-36 (Sistemas de aprovisionamiento).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2747 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-33-b)

<a id="API-TEC-33-c"></a>
#### API-TEC-33-c · `GET /api/admin/tec/provisioning/systems/{id}`

- **Qué hace:** Sistemas de aprovisionamiento. Obtiene el detalle de un registro de sistemas de aprovisionamiento (`provisioningSystems`).
- **Para qué sirve:** RF-TEC-182: Configurar sistemas de aprovisionamiento por tenant y servicio: tipo (MikroTik, Radius, Radius Gretix, SmartOlt, Wispro, Sopnet, Silexis, Ispfull, Sensa, SITSA, AION, manual), endpoint, credenciales en bóveda, modo solo… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.aprovisionamiento.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de sistemas de aprovisionamiento (`provisioningSystems`).
- **Pantallas:** PAN-TEC-36 (Sistemas de aprovisionamiento).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2747 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-33-c)

<a id="API-TEC-33-e"></a>
#### API-TEC-33-e · `DELETE /api/admin/tec/provisioning/systems/{id}`

- **Qué hace:** Sistemas de aprovisionamiento. Elimina o da de baja un registro de sistemas de aprovisionamiento (`provisioningSystems`).
- **Para qué sirve:** RF-TEC-182: Configurar sistemas de aprovisionamiento por tenant y servicio: tipo (MikroTik, Radius, Radius Gretix, SmartOlt, Wispro, Sopnet, Silexis, Ispfull, Sensa, SITSA, AION, manual), endpoint, credenciales en bóveda, modo solo… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.aprovisionamiento.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-TEC-36 (Sistemas de aprovisionamiento).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2747 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-33-e)

<a id="API-TEC-33-d"></a>
#### API-TEC-33-d · `PATCH /api/admin/tec/provisioning/systems/{id}`

- **Qué hace:** Sistemas de aprovisionamiento. Modifica algunos campos de un registro de sistemas de aprovisionamiento (`provisioningSystems`) (solo los enviados).
- **Para qué sirve:** RF-TEC-182: Configurar sistemas de aprovisionamiento por tenant y servicio: tipo (MikroTik, Radius, Radius Gretix, SmartOlt, Wispro, Sopnet, Silexis, Ispfull, Sensa, SITSA, AION, manual), endpoint, credenciales en bóveda, modo solo… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.aprovisionamiento.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de sistemas de aprovisionamiento (`provisioningSystems`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de sistemas de aprovisionamiento (`provisioningSystems`).
- **Pantallas:** PAN-TEC-36 (Sistemas de aprovisionamiento).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2747 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-33-d)

<a id="API-TEC-33-f"></a>
#### API-TEC-33-f · `GET /api/admin/tec/provisioning/profiles`

- **Qué hace:** Sistemas de aprovisionamiento. Lista, con filtros y paginación, los registros de perfiles por plan (`provisioningProfiles`).
- **Para qué sirve:** RF-TEC-182: Configurar sistemas de aprovisionamiento por tenant y servicio: tipo (MikroTik, Radius, Radius Gretix, SmartOlt, Wispro, Sopnet, Silexis, Ispfull, Sensa, SITSA, AION, manual), endpoint, credenciales en bóveda, modo solo… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.aprovisionamiento.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de perfiles por plan (`provisioningProfiles`) con `total`.
- **Pantallas:** PAN-TEC-36 (Sistemas de aprovisionamiento).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2747 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-33-f)

<a id="API-TEC-33-g"></a>
#### API-TEC-33-g · `POST /api/admin/tec/provisioning/profiles`

- **Qué hace:** Sistemas de aprovisionamiento. Da de alta un registro de perfiles por plan (`provisioningProfiles`).
- **Para qué sirve:** RF-TEC-182: Configurar sistemas de aprovisionamiento por tenant y servicio: tipo (MikroTik, Radius, Radius Gretix, SmartOlt, Wispro, Sopnet, Silexis, Ispfull, Sensa, SITSA, AION, manual), endpoint, credenciales en bóveda, modo solo… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.aprovisionamiento.configurar`.
- **Recibe:** los datos de perfiles por plan (`provisioningProfiles`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de perfiles por plan (`provisioningProfiles`).
- **Pantallas:** PAN-TEC-36 (Sistemas de aprovisionamiento).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2747 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-33-g)

<a id="API-TEC-33-h"></a>
#### API-TEC-33-h · `GET /api/admin/tec/provisioning/profiles/{id}`

- **Qué hace:** Sistemas de aprovisionamiento. Obtiene el detalle de un registro de perfiles por plan (`provisioningProfiles`).
- **Para qué sirve:** RF-TEC-182: Configurar sistemas de aprovisionamiento por tenant y servicio: tipo (MikroTik, Radius, Radius Gretix, SmartOlt, Wispro, Sopnet, Silexis, Ispfull, Sensa, SITSA, AION, manual), endpoint, credenciales en bóveda, modo solo… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.aprovisionamiento.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de perfiles por plan (`provisioningProfiles`).
- **Pantallas:** PAN-TEC-36 (Sistemas de aprovisionamiento).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2747 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-33-h)

<a id="API-TEC-33-j"></a>
#### API-TEC-33-j · `DELETE /api/admin/tec/provisioning/profiles/{id}`

- **Qué hace:** Sistemas de aprovisionamiento. Elimina o da de baja un registro de perfiles por plan (`provisioningProfiles`).
- **Para qué sirve:** RF-TEC-182: Configurar sistemas de aprovisionamiento por tenant y servicio: tipo (MikroTik, Radius, Radius Gretix, SmartOlt, Wispro, Sopnet, Silexis, Ispfull, Sensa, SITSA, AION, manual), endpoint, credenciales en bóveda, modo solo… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.aprovisionamiento.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-TEC-36 (Sistemas de aprovisionamiento).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2747 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-33-j)

<a id="API-TEC-33-i"></a>
#### API-TEC-33-i · `PATCH /api/admin/tec/provisioning/profiles/{id}`

- **Qué hace:** Sistemas de aprovisionamiento. Modifica algunos campos de un registro de perfiles por plan (`provisioningProfiles`) (solo los enviados).
- **Para qué sirve:** RF-TEC-182: Configurar sistemas de aprovisionamiento por tenant y servicio: tipo (MikroTik, Radius, Radius Gretix, SmartOlt, Wispro, Sopnet, Silexis, Ispfull, Sensa, SITSA, AION, manual), endpoint, credenciales en bóveda, modo solo… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.aprovisionamiento.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de perfiles por plan (`provisioningProfiles`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de perfiles por plan (`provisioningProfiles`).
- **Pantallas:** PAN-TEC-36 (Sistemas de aprovisionamiento).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2747 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-33-i)

<a id="API-TEC-33-k"></a>
#### API-TEC-33-k · `POST /api/admin/tec/provisioning/systems/{id}/test`

- **Qué hace:** Sistemas de aprovisionamiento. Prueba un registro de sistemas de aprovisionamiento (`provisioningSystems`).
- **Para qué sirve:** RF-TEC-182: Configurar sistemas de aprovisionamiento por tenant y servicio: tipo (MikroTik, Radius, Radius Gretix, SmartOlt, Wispro, Sopnet, Silexis, Ispfull, Sensa, SITSA, AION, manual), endpoint, credenciales en bóveda, modo solo… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.aprovisionamiento.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-36 (Sistemas de aprovisionamiento).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2747 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-33-k)

<a id="API-TEC-33-l"></a>
#### API-TEC-33-l · `POST /api/admin/tec/provisioning/systems/{id}/sync-catalog`

- **Qué hace:** Sistemas de aprovisionamiento. Sincroniza el catálogo de un registro de sistemas de aprovisionamiento (`provisioningSystems`).
- **Para qué sirve:** RF-TEC-182: Configurar sistemas de aprovisionamiento por tenant y servicio: tipo (MikroTik, Radius, Radius Gretix, SmartOlt, Wispro, Sopnet, Silexis, Ispfull, Sensa, SITSA, AION, manual), endpoint, credenciales en bóveda, modo solo… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.aprovisionamiento.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-36 (Sistemas de aprovisionamiento).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2747 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-33-l)

<a id="API-TEC-34"></a>
#### API-TEC-34 · `GET /api/admin/tec/provisioning/commands`

- **Qué hace:** Consola. Lista, con filtros y paginación, los registros de comandos de aprovisionamiento (`provisioningCommands`).
- **Para qué sirve:** RF-TEC-194: Aprovisionamiento de TV y otros TIC (Sensa, Sopnet, SITSA) con la misma interfaz. En TV, los comandos activate, changePlan, suspend, reactivate y deactivate operan por decodificador y paquete CAS según el perfil técnico de TV de… · RF-TEC-185: Comandos de aprovisionamiento durables e idempotentes: activate, changePlan, suspend, reactivate, deactivate, delete, query, resetCredentials, con estado, intentos, respuesta, correlación y origen (OT, M08, M09). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.aprovisionamiento.operar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de comandos de aprovisionamiento (`provisioningCommands`) con `total`.
- **Pantallas:** PAN-TEC-38 (Consola de comandos).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2748 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-34)

<a id="API-TEC-34-b"></a>
#### API-TEC-34-b · `POST /api/admin/tec/provisioning/commands/{id}/retry`

- **Qué hace:** Consola. Reintenta un registro de comandos de aprovisionamiento (`provisioningCommands`).
- **Para qué sirve:** RF-TEC-194: Aprovisionamiento de TV y otros TIC (Sensa, Sopnet, SITSA) con la misma interfaz. En TV, los comandos activate, changePlan, suspend, reactivate y deactivate operan por decodificador y paquete CAS según el perfil técnico de TV de… · RF-TEC-185: Comandos de aprovisionamiento durables e idempotentes: activate, changePlan, suspend, reactivate, deactivate, delete, query, resetCredentials, con estado, intentos, respuesta, correlación y origen (OT, M08, M09). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.aprovisionamiento.operar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-38 (Consola de comandos).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2748 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-34-b)

<a id="API-TEC-34-c"></a>
#### API-TEC-34-c · `POST /api/admin/tec/provisioning/commands/{id}/mark-manual`

- **Qué hace:** Consola. Marca como manual un registro de comandos de aprovisionamiento (`provisioningCommands`).
- **Para qué sirve:** RF-TEC-194: Aprovisionamiento de TV y otros TIC (Sensa, Sopnet, SITSA) con la misma interfaz. En TV, los comandos activate, changePlan, suspend, reactivate y deactivate operan por decodificador y paquete CAS según el perfil técnico de TV de… · RF-TEC-185: Comandos de aprovisionamiento durables e idempotentes: activate, changePlan, suspend, reactivate, deactivate, delete, query, resetCredentials, con estado, intentos, respuesta, correlación y origen (OT, M08, M09). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.aprovisionamiento.operar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-38 (Consola de comandos).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2748 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-34-c)

<a id="API-TEC-34-d"></a>
#### API-TEC-34-d · `POST /api/admin/tec/provisioning/commands/{id}/cancel`

- **Qué hace:** Consola. Cancela un registro de comandos de aprovisionamiento (`provisioningCommands`).
- **Para qué sirve:** RF-TEC-194: Aprovisionamiento de TV y otros TIC (Sensa, Sopnet, SITSA) con la misma interfaz. En TV, los comandos activate, changePlan, suspend, reactivate y deactivate operan por decodificador y paquete CAS según el perfil técnico de TV de… · RF-TEC-185: Comandos de aprovisionamiento durables e idempotentes: activate, changePlan, suspend, reactivate, deactivate, delete, query, resetCredentials, con estado, intentos, respuesta, correlación y origen (OT, M08, M09). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.aprovisionamiento.operar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-38 (Consola de comandos).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2748 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-34-d)

<a id="API-TEC-35"></a>
#### API-TEC-35 · `GET /api/admin/tec/service-technical/{contractId}`

- **Qué hace:** Datos técnicos del servicio. Cambios generan comando. Obtiene el detalle de un registro de `service-technical`.
- **Para qué sirve:** RF-TEC-134: Reconexión automática tras regularización: cerrar y reconectar en un paso (reconnect) con comando remoto; si no hay sistema remoto vigente, la OT queda pendiente para cuadrilla (DEC-014: automática en servicios remotos al… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.servicioTecnico.ver`.
- **Recibe:** en la ruta `contractId`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2749 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-35)

<a id="API-TEC-35-b"></a>
#### API-TEC-35-b · `PATCH /api/admin/tec/service-technical/{contractId}`

- **Qué hace:** Datos técnicos del servicio. Cambios generan comando. Modifica algunos campos de un registro de `service-technical` (solo los enviados).
- **Para qué sirve:** RF-TEC-134: Reconexión automática tras regularización: cerrar y reconectar en un paso (reconnect) con comando remoto; si no hay sistema remoto vigente, la OT queda pendiente para cuadrilla (DEC-014: automática en servicios remotos al… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.servicioTecnico.editar`.
- **Recibe:** en la ruta `contractId`; solo los campos a cambiar; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2749 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-35-b)

<a id="API-TEC-36"></a>
#### API-TEC-36 · `GET /api/admin/tec/works`

- **Qué hace:** Obras y contribución. Lista, con filtros y paginación, los registros de obras y contribución por mejoras (`works`).
- **Para qué sirve:** RF-TEC-168: Obras con descripción, servicio, tipo, grupo, fechas de inicio/fin, ocultar, presupuesto, avance (% y hitos), costeo real (materiales, horas, compras), centro de costo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.obras.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de obras y contribución por mejoras (`works`) con `total`.
- **Pantallas:** PAN-TEC-39 (Obras y loteos).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2750 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-36)

<a id="API-TEC-36-b"></a>
#### API-TEC-36-b · `POST /api/admin/tec/works`

- **Qué hace:** Obras y contribución. Da de alta un registro de obras y contribución por mejoras (`works`).
- **Para qué sirve:** RF-TEC-168: Obras con descripción, servicio, tipo, grupo, fechas de inicio/fin, ocultar, presupuesto, avance (% y hitos), costeo real (materiales, horas, compras), centro de costo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.obras.gestionar`.
- **Recibe:** los datos de obras y contribución por mejoras (`works`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de obras y contribución por mejoras (`works`).
- **Pantallas:** PAN-TEC-39 (Obras y loteos).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2750 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-36-b)

<a id="API-TEC-36-c"></a>
#### API-TEC-36-c · `GET /api/admin/tec/works/{id}`

- **Qué hace:** Obras y contribución. Obtiene el detalle de un registro de obras y contribución por mejoras (`works`).
- **Para qué sirve:** RF-TEC-168: Obras con descripción, servicio, tipo, grupo, fechas de inicio/fin, ocultar, presupuesto, avance (% y hitos), costeo real (materiales, horas, compras), centro de costo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.obras.gestionar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de obras y contribución por mejoras (`works`).
- **Pantallas:** PAN-TEC-39 (Obras y loteos).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2750 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-36-c)

<a id="API-TEC-36-e"></a>
#### API-TEC-36-e · `DELETE /api/admin/tec/works/{id}`

- **Qué hace:** Obras y contribución. Elimina o da de baja un registro de obras y contribución por mejoras (`works`).
- **Para qué sirve:** RF-TEC-168: Obras con descripción, servicio, tipo, grupo, fechas de inicio/fin, ocultar, presupuesto, avance (% y hitos), costeo real (materiales, horas, compras), centro de costo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.contribucionesObra.gestionar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-TEC-40 (Contribución por mejoras).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2750 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-36-e)

<a id="API-TEC-36-d"></a>
#### API-TEC-36-d · `PATCH /api/admin/tec/works/{id}`

- **Qué hace:** Obras y contribución. Modifica algunos campos de un registro de obras y contribución por mejoras (`works`) (solo los enviados).
- **Para qué sirve:** RF-TEC-168: Obras con descripción, servicio, tipo, grupo, fechas de inicio/fin, ocultar, presupuesto, avance (% y hitos), costeo real (materiales, horas, compras), centro de costo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.obras.gestionar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de obras y contribución por mejoras (`works`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de obras y contribución por mejoras (`works`).
- **Pantallas:** PAN-TEC-39 (Obras y loteos).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2750 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-36-d)

<a id="API-TEC-36-f"></a>
#### API-TEC-36-f · `POST /api/admin/tec/works/{id}/beneficiaries`

- **Qué hace:** Obras y contribución. Agrega un elemento («beneficiaries») a un registro de obras y contribución por mejoras (`works`).
- **Para qué sirve:** RF-TEC-168: Obras con descripción, servicio, tipo, grupo, fechas de inicio/fin, ocultar, presupuesto, avance (% y hitos), costeo real (materiales, horas, compras), centro de costo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.obras.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-39 (Obras y loteos).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2750 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-36-f)

<a id="API-TEC-36-g"></a>
#### API-TEC-36-g · `POST /api/admin/tec/works/{id}/levy/simulate`

- **Qué hace:** Obras y contribución. Simula sin efectos sobre obras y contribución por mejoras (`works`).
- **Para qué sirve:** RF-TEC-168: Obras con descripción, servicio, tipo, grupo, fechas de inicio/fin, ocultar, presupuesto, avance (% y hitos), costeo real (materiales, horas, compras), centro de costo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.obras.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-39 (Obras y loteos).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2750 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-36-g)

<a id="API-TEC-36-h"></a>
#### API-TEC-36-h · `POST /api/admin/tec/works/{id}/levy/approve`

- **Qué hace:** Obras y contribución. Aprueba sobre obras y contribución por mejoras (`works`).
- **Para qué sirve:** RF-TEC-168: Obras con descripción, servicio, tipo, grupo, fechas de inicio/fin, ocultar, presupuesto, avance (% y hitos), costeo real (materiales, horas, compras), centro de costo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.obras.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-39 (Obras y loteos).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2750 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-36-h)

<a id="API-TEC-36-i"></a>
#### API-TEC-36-i · `POST /api/admin/tec/works/{id}/levy/send`

- **Qué hace:** Obras y contribución. Envía sobre obras y contribución por mejoras (`works`).
- **Para qué sirve:** RF-TEC-168: Obras con descripción, servicio, tipo, grupo, fechas de inicio/fin, ocultar, presupuesto, avance (% y hitos), costeo real (materiales, horas, compras), centro de costo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.obras.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-39 (Obras y loteos).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2750 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-36-i)

<a id="API-TEC-37"></a>
#### API-TEC-37 · `GET /api/admin/tec/inspections`

- **Qué hace:** Inspecciones. Separación de funciones (RN). Consulta `inspections`.
- **Para qué sirve:** RF-TEC-112: Una sola PWA con landing por perfil (técnico, lecturista, cobrador, inspector) y menú recortado por allowlist; sin app distinta por función. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.inspecciones.gestionar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-41 (Inspecciones y fraude).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2751 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-37)

<a id="API-TEC-37-b"></a>
#### API-TEC-37-b · `POST /api/admin/tec/inspections`

- **Qué hace:** Inspecciones. Separación de funciones (RN). Registra un nuevo elemento u operación en `inspections`.
- **Para qué sirve:** RF-TEC-112: Una sola PWA con landing por perfil (técnico, lecturista, cobrador, inspector) y menú recortado por allowlist; sin app distinta por función. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.inspecciones.gestionar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-41 (Inspecciones y fraude).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2751 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-37-b)

<a id="API-TEC-37-c"></a>
#### API-TEC-37-c · `GET /api/admin/tec/inspections/{id}`

- **Qué hace:** Inspecciones. Separación de funciones (RN). Obtiene el detalle de un registro de `inspections`.
- **Para qué sirve:** RF-TEC-112: Una sola PWA con landing por perfil (técnico, lecturista, cobrador, inspector) y menú recortado por allowlist; sin app distinta por función. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.inspecciones.gestionar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-41 (Inspecciones y fraude).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2751 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-37-c)

<a id="API-TEC-37-e"></a>
#### API-TEC-37-e · `DELETE /api/admin/tec/inspections/{id}`

- **Qué hace:** Inspecciones. Separación de funciones (RN). Elimina o da de baja un registro de `inspections`.
- **Para qué sirve:** RF-TEC-180: Propuesta de recupero según método aprobado (versionado por régimen del servicio) calculada por M04, con aprobación obligatoria; facturación separada por M05; nunca automática. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.inspecciones.aprobar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2751 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-37-e)

<a id="API-TEC-37-d"></a>
#### API-TEC-37-d · `PATCH /api/admin/tec/inspections/{id}`

- **Qué hace:** Inspecciones. Separación de funciones (RN). Modifica algunos campos de un registro de `inspections` (solo los enviados).
- **Para qué sirve:** RF-TEC-112: Una sola PWA con landing por perfil (técnico, lecturista, cobrador, inspector) y menú recortado por allowlist; sin app distinta por función. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.inspecciones.gestionar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar; cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-41 (Inspecciones y fraude).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2751 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-37-d)

<a id="API-TEC-37-f"></a>
#### API-TEC-37-f · `POST /api/admin/tec/inspections/{id}/order`

- **Qué hace:** Inspecciones. Separación de funciones (RN). Registra «order» sobre un registro de `order`.
- **Para qué sirve:** RF-TEC-112: Una sola PWA con landing por perfil (técnico, lecturista, cobrador, inspector) y menú recortado por allowlist; sin app distinta por función. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.inspecciones.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-41 (Inspecciones y fraude).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2751 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-37-f)

<a id="API-TEC-37-g"></a>
#### API-TEC-37-g · `POST /api/admin/tec/inspections/{id}/notify`

- **Qué hace:** Inspecciones. Separación de funciones (RN). Notifica un registro de `notify`.
- **Para qué sirve:** RF-TEC-112: Una sola PWA con landing por perfil (técnico, lecturista, cobrador, inspector) y menú recortado por allowlist; sin app distinta por función. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.inspecciones.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-41 (Inspecciones y fraude).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2751 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-37-g)

<a id="API-TEC-37-h"></a>
#### API-TEC-37-h · `POST /api/admin/tec/inspections/{id}/defense`

- **Qué hace:** Inspecciones. Separación de funciones (RN). Registra «defense» sobre un registro de `defense`.
- **Para qué sirve:** RF-TEC-112: Una sola PWA con landing por perfil (técnico, lecturista, cobrador, inspector) y menú recortado por allowlist; sin app distinta por función. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.inspecciones.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-41 (Inspecciones y fraude).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2751 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-37-h)

<a id="API-TEC-37-i"></a>
#### API-TEC-37-i · `POST /api/admin/tec/inspections/{id}/propose-recovery`

- **Qué hace:** Inspecciones. Separación de funciones (RN). Propone la recuperación de un registro de `propose-recovery`.
- **Para qué sirve:** RF-TEC-112: Una sola PWA con landing por perfil (técnico, lecturista, cobrador, inspector) y menú recortado por allowlist; sin app distinta por función. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.inspecciones.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-41 (Inspecciones y fraude).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2751 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-37-i)

<a id="API-TEC-37-j"></a>
#### API-TEC-37-j · `POST /api/admin/tec/inspections/{id}/approve`

- **Qué hace:** Inspecciones. Separación de funciones (RN). Aprueba un registro de `approve`.
- **Para qué sirve:** RF-TEC-112: Una sola PWA con landing por perfil (técnico, lecturista, cobrador, inspector) y menú recortado por allowlist; sin app distinta por función. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.inspecciones.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-41 (Inspecciones y fraude).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2751 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-37-j)

<a id="API-TEC-37-k"></a>
#### API-TEC-37-k · `POST /api/admin/tec/inspections/{id}/annul`

- **Qué hace:** Inspecciones. Separación de funciones (RN). Anula un registro de `annul`.
- **Para qué sirve:** RF-TEC-112: Una sola PWA con landing por perfil (técnico, lecturista, cobrador, inspector) y menú recortado por allowlist; sin app distinta por función. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.inspecciones.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-41 (Inspecciones y fraude).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2751 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-37-k)

<a id="API-TEC-37-l"></a>
#### API-TEC-37-l · `GET /api/admin/tec/seals`

- **Qué hace:** Inspecciones. Separación de funciones (RN). Lista, con filtros y paginación, los registros de precintos numerados con colocación (`seals`).
- **Para qué sirve:** RF-TEC-178: Gestión de precintos numerados (alta de lote, asignación a inspector, colocación, retiro, rotura) vinculada a medidor y acta. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.inspecciones.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de precintos numerados con colocación (`seals`) con `total`.
- **Pantallas:** PAN-TEC-41 (Inspecciones y fraude).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2751 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-37-l)

<a id="API-TEC-37-m"></a>
#### API-TEC-37-m · `POST /api/admin/tec/seals`

- **Qué hace:** Inspecciones. Separación de funciones (RN). Da de alta un registro de precintos numerados con colocación (`seals`).
- **Para qué sirve:** RF-TEC-178: Gestión de precintos numerados (alta de lote, asignación a inspector, colocación, retiro, rotura) vinculada a medidor y acta. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.inspecciones.gestionar`.
- **Recibe:** los datos de precintos numerados con colocación (`seals`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de precintos numerados con colocación (`seals`).
- **Pantallas:** PAN-TEC-41 (Inspecciones y fraude).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2751 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-37-m)

<a id="API-TEC-37-n"></a>
#### API-TEC-37-n · `GET /api/admin/tec/seals/{id}`

- **Qué hace:** Inspecciones. Separación de funciones (RN). Obtiene el detalle de un registro de precintos numerados con colocación (`seals`).
- **Para qué sirve:** RF-TEC-178: Gestión de precintos numerados (alta de lote, asignación a inspector, colocación, retiro, rotura) vinculada a medidor y acta. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.inspecciones.gestionar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de precintos numerados con colocación (`seals`).
- **Pantallas:** PAN-TEC-41 (Inspecciones y fraude).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2751 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-37-n)

<a id="API-TEC-37-p"></a>
#### API-TEC-37-p · `DELETE /api/admin/tec/seals/{id}`

- **Qué hace:** Inspecciones. Separación de funciones (RN). Elimina o da de baja un registro de precintos numerados con colocación (`seals`).
- **Para qué sirve:** RF-TEC-178: Gestión de precintos numerados (alta de lote, asignación a inspector, colocación, retiro, rotura) vinculada a medidor y acta. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.inspecciones.aprobar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2751 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-37-p)

<a id="API-TEC-37-o"></a>
#### API-TEC-37-o · `PATCH /api/admin/tec/seals/{id}`

- **Qué hace:** Inspecciones. Separación de funciones (RN). Modifica algunos campos de un registro de precintos numerados con colocación (`seals`) (solo los enviados).
- **Para qué sirve:** RF-TEC-178: Gestión de precintos numerados (alta de lote, asignación a inspector, colocación, retiro, rotura) vinculada a medidor y acta. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.inspecciones.gestionar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de precintos numerados con colocación (`seals`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de precintos numerados con colocación (`seals`).
- **Pantallas:** PAN-TEC-41 (Inspecciones y fraude).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2751 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-37-o)

<a id="API-TEC-38"></a>
#### API-TEC-38 · `GET /api/admin/tec/phone/exchanges`

- **Qué hace:** Telefonía. Lista, con filtros y paginación, los registros de centrales telefónicas (`phoneExchanges`).
- **Para qué sirve:** RF-TEC-213: Informes de telefonía: llamadas CNC, categorías CNC, realizadas, no asignadas, no agrupadas, no facturadas, números en central, conectados sin tráfico, por operador, números disponibles, entrantes por central. · RF-TEC-199: KML de central, repartidor y cajas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de centrales telefónicas (`phoneExchanges`) con `total`.
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38)

<a id="API-TEC-38-b"></a>
#### API-TEC-38-b · `POST /api/admin/tec/phone/exchanges`

- **Qué hace:** Telefonía. Da de alta un registro de centrales telefónicas (`phoneExchanges`).
- **Para qué sirve:** RF-TEC-213: Informes de telefonía: llamadas CNC, categorías CNC, realizadas, no asignadas, no agrupadas, no facturadas, números en central, conectados sin tráfico, por operador, números disponibles, entrantes por central. · RF-TEC-199: KML de central, repartidor y cajas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.editar`.
- **Recibe:** los datos de centrales telefónicas (`phoneExchanges`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de centrales telefónicas (`phoneExchanges`).
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-b)

<a id="API-TEC-38-c"></a>
#### API-TEC-38-c · `GET /api/admin/tec/phone/exchanges/{id}`

- **Qué hace:** Telefonía. Obtiene el detalle de un registro de centrales telefónicas (`phoneExchanges`).
- **Para qué sirve:** RF-TEC-213: Informes de telefonía: llamadas CNC, categorías CNC, realizadas, no asignadas, no agrupadas, no facturadas, números en central, conectados sin tráfico, por operador, números disponibles, entrantes por central. · RF-TEC-199: KML de central, repartidor y cajas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de centrales telefónicas (`phoneExchanges`).
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-c)

<a id="API-TEC-38-e"></a>
#### API-TEC-38-e · `DELETE /api/admin/tec/phone/exchanges/{id}`

- **Qué hace:** Telefonía. Elimina o da de baja un registro de centrales telefónicas (`phoneExchanges`).
- **Para qué sirve:** RF-TEC-213: Informes de telefonía: llamadas CNC, categorías CNC, realizadas, no asignadas, no agrupadas, no facturadas, números en central, conectados sin tráfico, por operador, números disponibles, entrantes por central. · RF-TEC-199: KML de central, repartidor y cajas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-e)

<a id="API-TEC-38-d"></a>
#### API-TEC-38-d · `PATCH /api/admin/tec/phone/exchanges/{id}`

- **Qué hace:** Telefonía. Modifica algunos campos de un registro de centrales telefónicas (`phoneExchanges`) (solo los enviados).
- **Para qué sirve:** RF-TEC-213: Informes de telefonía: llamadas CNC, categorías CNC, realizadas, no asignadas, no agrupadas, no facturadas, números en central, conectados sin tráfico, por operador, números disponibles, entrantes por central. · RF-TEC-199: KML de central, repartidor y cajas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de centrales telefónicas (`phoneExchanges`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de centrales telefónicas (`phoneExchanges`).
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-d)

<a id="API-TEC-38-f"></a>
#### API-TEC-38-f · `GET /api/admin/tec/phone/ports`

- **Qué hace:** Telefonía. Lista, con filtros y paginación, los registros de puertos (`phonePorts`).
- **Para qué sirve:** RF-TEC-164: Inventario de equipos de red (OLT, router/BRAS MikroTik, NAS/Radius, switch, AP inalámbrico, central telefónica, DSLAM, cabecera TV) con ubicación (elemento de red), IP de gestión, puerto, marca, modelo, serie, firmware y sistema… · RF-TEC-167: Puertos y capacidad de OLT/PON/splitter como elementos de red para factibilidad y asignación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de puertos (`phonePorts`) con `total`.
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-f)

<a id="API-TEC-38-g"></a>
#### API-TEC-38-g · `POST /api/admin/tec/phone/ports`

- **Qué hace:** Telefonía. Da de alta un registro de puertos (`phonePorts`).
- **Para qué sirve:** RF-TEC-164: Inventario de equipos de red (OLT, router/BRAS MikroTik, NAS/Radius, switch, AP inalámbrico, central telefónica, DSLAM, cabecera TV) con ubicación (elemento de red), IP de gestión, puerto, marca, modelo, serie, firmware y sistema… · RF-TEC-167: Puertos y capacidad de OLT/PON/splitter como elementos de red para factibilidad y asignación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.editar`.
- **Recibe:** los datos de puertos (`phonePorts`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de puertos (`phonePorts`).
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-g)

<a id="API-TEC-38-h"></a>
#### API-TEC-38-h · `GET /api/admin/tec/phone/ports/{id}`

- **Qué hace:** Telefonía. Obtiene el detalle de un registro de puertos (`phonePorts`).
- **Para qué sirve:** RF-TEC-164: Inventario de equipos de red (OLT, router/BRAS MikroTik, NAS/Radius, switch, AP inalámbrico, central telefónica, DSLAM, cabecera TV) con ubicación (elemento de red), IP de gestión, puerto, marca, modelo, serie, firmware y sistema… · RF-TEC-167: Puertos y capacidad de OLT/PON/splitter como elementos de red para factibilidad y asignación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de puertos (`phonePorts`).
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-h)

<a id="API-TEC-38-j"></a>
#### API-TEC-38-j · `DELETE /api/admin/tec/phone/ports/{id}`

- **Qué hace:** Telefonía. Elimina o da de baja un registro de puertos (`phonePorts`).
- **Para qué sirve:** RF-TEC-164: Inventario de equipos de red (OLT, router/BRAS MikroTik, NAS/Radius, switch, AP inalámbrico, central telefónica, DSLAM, cabecera TV) con ubicación (elemento de red), IP de gestión, puerto, marca, modelo, serie, firmware y sistema… · RF-TEC-167: Puertos y capacidad de OLT/PON/splitter como elementos de red para factibilidad y asignación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-j)

<a id="API-TEC-38-i"></a>
#### API-TEC-38-i · `PATCH /api/admin/tec/phone/ports/{id}`

- **Qué hace:** Telefonía. Modifica algunos campos de un registro de puertos (`phonePorts`) (solo los enviados).
- **Para qué sirve:** RF-TEC-164: Inventario de equipos de red (OLT, router/BRAS MikroTik, NAS/Radius, switch, AP inalámbrico, central telefónica, DSLAM, cabecera TV) con ubicación (elemento de red), IP de gestión, puerto, marca, modelo, serie, firmware y sistema… · RF-TEC-167: Puertos y capacidad de OLT/PON/splitter como elementos de red para factibilidad y asignación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de puertos (`phonePorts`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de puertos (`phonePorts`).
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-i)

<a id="API-TEC-38-k"></a>
#### API-TEC-38-k · `GET /api/admin/tec/phone/frames`

- **Qué hace:** Telefonía. Lista, con filtros y paginación, los registros de repartidores (`phoneFrames`).
- **Para qué sirve:** RF-TEC-199: KML de central, repartidor y cajas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de repartidores (`phoneFrames`) con `total`.
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-k)

<a id="API-TEC-38-l"></a>
#### API-TEC-38-l · `POST /api/admin/tec/phone/frames`

- **Qué hace:** Telefonía. Da de alta un registro de repartidores (`phoneFrames`).
- **Para qué sirve:** RF-TEC-199: KML de central, repartidor y cajas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.editar`.
- **Recibe:** los datos de repartidores (`phoneFrames`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de repartidores (`phoneFrames`).
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-l)

<a id="API-TEC-38-m"></a>
#### API-TEC-38-m · `GET /api/admin/tec/phone/frames/{id}`

- **Qué hace:** Telefonía. Obtiene el detalle de un registro de repartidores (`phoneFrames`).
- **Para qué sirve:** RF-TEC-199: KML de central, repartidor y cajas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de repartidores (`phoneFrames`).
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-m)

<a id="API-TEC-38-o"></a>
#### API-TEC-38-o · `DELETE /api/admin/tec/phone/frames/{id}`

- **Qué hace:** Telefonía. Elimina o da de baja un registro de repartidores (`phoneFrames`).
- **Para qué sirve:** RF-TEC-199: KML de central, repartidor y cajas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-o)

<a id="API-TEC-38-n"></a>
#### API-TEC-38-n · `PATCH /api/admin/tec/phone/frames/{id}`

- **Qué hace:** Telefonía. Modifica algunos campos de un registro de repartidores (`phoneFrames`) (solo los enviados).
- **Para qué sirve:** RF-TEC-199: KML de central, repartidor y cajas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de repartidores (`phoneFrames`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de repartidores (`phoneFrames`).
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-n)

<a id="API-TEC-38-p"></a>
#### API-TEC-38-p · `GET /api/admin/tec/phone/frame-groups`

- **Qué hace:** Telefonía. Lista, con filtros y paginación, los registros de grupos de repartidor (`phoneFrameGroups`).
- **Para qué sirve:** RF-TEC-199: KML de central, repartidor y cajas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de grupos de repartidor (`phoneFrameGroups`) con `total`.
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-p)

<a id="API-TEC-38-q"></a>
#### API-TEC-38-q · `POST /api/admin/tec/phone/frame-groups`

- **Qué hace:** Telefonía. Da de alta un registro de grupos de repartidor (`phoneFrameGroups`).
- **Para qué sirve:** RF-TEC-199: KML de central, repartidor y cajas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.editar`.
- **Recibe:** los datos de grupos de repartidor (`phoneFrameGroups`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de grupos de repartidor (`phoneFrameGroups`).
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-q)

<a id="API-TEC-38-r"></a>
#### API-TEC-38-r · `GET /api/admin/tec/phone/frame-groups/{id}`

- **Qué hace:** Telefonía. Obtiene el detalle de un registro de grupos de repartidor (`phoneFrameGroups`).
- **Para qué sirve:** RF-TEC-199: KML de central, repartidor y cajas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de grupos de repartidor (`phoneFrameGroups`).
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-r)

<a id="API-TEC-38-t"></a>
#### API-TEC-38-t · `DELETE /api/admin/tec/phone/frame-groups/{id}`

- **Qué hace:** Telefonía. Elimina o da de baja un registro de grupos de repartidor (`phoneFrameGroups`).
- **Para qué sirve:** RF-TEC-199: KML de central, repartidor y cajas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-t)

<a id="API-TEC-38-s"></a>
#### API-TEC-38-s · `PATCH /api/admin/tec/phone/frame-groups/{id}`

- **Qué hace:** Telefonía. Modifica algunos campos de un registro de grupos de repartidor (`phoneFrameGroups`) (solo los enviados).
- **Para qué sirve:** RF-TEC-199: KML de central, repartidor y cajas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de grupos de repartidor (`phoneFrameGroups`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de grupos de repartidor (`phoneFrameGroups`).
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-s)

<a id="API-TEC-38-u"></a>
#### API-TEC-38-u · `GET /api/admin/tec/phone/strips`

- **Qué hace:** Telefonía. Lista, con filtros y paginación, los registros de regletas (`phoneStrips`).
- **Para qué sirve:** RF-TEC-197: Red física telefónica: centrales (modalidad de CDR, prefijo, moneda, último disco, GPS, importar segundos/clave), puertos de central, repartidores (GPS), grupos de entrada/salida, regletas, posiciones (terminal, color, posición… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de regletas (`phoneStrips`) con `total`.
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-u)

<a id="API-TEC-38-v"></a>
#### API-TEC-38-v · `POST /api/admin/tec/phone/strips`

- **Qué hace:** Telefonía. Da de alta un registro de regletas (`phoneStrips`).
- **Para qué sirve:** RF-TEC-197: Red física telefónica: centrales (modalidad de CDR, prefijo, moneda, último disco, GPS, importar segundos/clave), puertos de central, repartidores (GPS), grupos de entrada/salida, regletas, posiciones (terminal, color, posición… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.editar`.
- **Recibe:** los datos de regletas (`phoneStrips`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de regletas (`phoneStrips`).
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-v)

<a id="API-TEC-38-w"></a>
#### API-TEC-38-w · `GET /api/admin/tec/phone/strips/{id}`

- **Qué hace:** Telefonía. Obtiene el detalle de un registro de regletas (`phoneStrips`).
- **Para qué sirve:** RF-TEC-197: Red física telefónica: centrales (modalidad de CDR, prefijo, moneda, último disco, GPS, importar segundos/clave), puertos de central, repartidores (GPS), grupos de entrada/salida, regletas, posiciones (terminal, color, posición… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de regletas (`phoneStrips`).
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-w)

<a id="API-TEC-38-y"></a>
#### API-TEC-38-y · `DELETE /api/admin/tec/phone/strips/{id}`

- **Qué hace:** Telefonía. Elimina o da de baja un registro de regletas (`phoneStrips`).
- **Para qué sirve:** RF-TEC-197: Red física telefónica: centrales (modalidad de CDR, prefijo, moneda, último disco, GPS, importar segundos/clave), puertos de central, repartidores (GPS), grupos de entrada/salida, regletas, posiciones (terminal, color, posición… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-y)

<a id="API-TEC-38-x"></a>
#### API-TEC-38-x · `PATCH /api/admin/tec/phone/strips/{id}`

- **Qué hace:** Telefonía. Modifica algunos campos de un registro de regletas (`phoneStrips`) (solo los enviados).
- **Para qué sirve:** RF-TEC-197: Red física telefónica: centrales (modalidad de CDR, prefijo, moneda, último disco, GPS, importar segundos/clave), puertos de central, repartidores (GPS), grupos de entrada/salida, regletas, posiciones (terminal, color, posición… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de regletas (`phoneStrips`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de regletas (`phoneStrips`).
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-x)

<a id="API-TEC-38-z"></a>
#### API-TEC-38-z · `GET /api/admin/tec/phone/positions`

- **Qué hace:** Telefonía. Lista, con filtros y paginación, los registros de posiciones de regleta (`phoneStripPositions`).
- **Para qué sirve:** RF-TEC-197: Red física telefónica: centrales (modalidad de CDR, prefijo, moneda, último disco, GPS, importar segundos/clave), puertos de central, repartidores (GPS), grupos de entrada/salida, regletas, posiciones (terminal, color, posición… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de posiciones de regleta (`phoneStripPositions`) con `total`.
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-z)

<a id="API-TEC-38-26"></a>
#### API-TEC-38-26 · `POST /api/admin/tec/phone/positions`

- **Qué hace:** Telefonía. Da de alta un registro de posiciones de regleta (`phoneStripPositions`).
- **Para qué sirve:** RF-TEC-197: Red física telefónica: centrales (modalidad de CDR, prefijo, moneda, último disco, GPS, importar segundos/clave), puertos de central, repartidores (GPS), grupos de entrada/salida, regletas, posiciones (terminal, color, posición… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.editar`.
- **Recibe:** los datos de posiciones de regleta (`phoneStripPositions`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de posiciones de regleta (`phoneStripPositions`).
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-26)

<a id="API-TEC-38-27"></a>
#### API-TEC-38-27 · `GET /api/admin/tec/phone/positions/{id}`

- **Qué hace:** Telefonía. Obtiene el detalle de un registro de posiciones de regleta (`phoneStripPositions`).
- **Para qué sirve:** RF-TEC-197: Red física telefónica: centrales (modalidad de CDR, prefijo, moneda, último disco, GPS, importar segundos/clave), puertos de central, repartidores (GPS), grupos de entrada/salida, regletas, posiciones (terminal, color, posición… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de posiciones de regleta (`phoneStripPositions`).
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-27)

<a id="API-TEC-38-29"></a>
#### API-TEC-38-29 · `DELETE /api/admin/tec/phone/positions/{id}`

- **Qué hace:** Telefonía. Elimina o da de baja un registro de posiciones de regleta (`phoneStripPositions`).
- **Para qué sirve:** RF-TEC-197: Red física telefónica: centrales (modalidad de CDR, prefijo, moneda, último disco, GPS, importar segundos/clave), puertos de central, repartidores (GPS), grupos de entrada/salida, regletas, posiciones (terminal, color, posición… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-29)

<a id="API-TEC-38-28"></a>
#### API-TEC-38-28 · `PATCH /api/admin/tec/phone/positions/{id}`

- **Qué hace:** Telefonía. Modifica algunos campos de un registro de posiciones de regleta (`phoneStripPositions`) (solo los enviados).
- **Para qué sirve:** RF-TEC-197: Red física telefónica: centrales (modalidad de CDR, prefijo, moneda, último disco, GPS, importar segundos/clave), puertos de central, repartidores (GPS), grupos de entrada/salida, regletas, posiciones (terminal, color, posición… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de posiciones de regleta (`phoneStripPositions`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de posiciones de regleta (`phoneStripPositions`).
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-28)

<a id="API-TEC-38-30"></a>
#### API-TEC-38-30 · `GET /api/admin/tec/phone/boxes`

- **Qué hace:** Telefonía. Lista, con filtros y paginación, los registros de cajas telefónicas (`phoneBoxes`).
- **Para qué sirve:** RF-TEC-199: KML de central, repartidor y cajas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de cajas telefónicas (`phoneBoxes`) con `total`.
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-30)

<a id="API-TEC-38-31"></a>
#### API-TEC-38-31 · `POST /api/admin/tec/phone/boxes`

- **Qué hace:** Telefonía. Da de alta un registro de cajas telefónicas (`phoneBoxes`).
- **Para qué sirve:** RF-TEC-199: KML de central, repartidor y cajas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.editar`.
- **Recibe:** los datos de cajas telefónicas (`phoneBoxes`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de cajas telefónicas (`phoneBoxes`).
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-31)

<a id="API-TEC-38-32"></a>
#### API-TEC-38-32 · `GET /api/admin/tec/phone/boxes/{id}`

- **Qué hace:** Telefonía. Obtiene el detalle de un registro de cajas telefónicas (`phoneBoxes`).
- **Para qué sirve:** RF-TEC-199: KML de central, repartidor y cajas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de cajas telefónicas (`phoneBoxes`).
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-32)

<a id="API-TEC-38-34"></a>
#### API-TEC-38-34 · `DELETE /api/admin/tec/phone/boxes/{id}`

- **Qué hace:** Telefonía. Elimina o da de baja un registro de cajas telefónicas (`phoneBoxes`).
- **Para qué sirve:** RF-TEC-199: KML de central, repartidor y cajas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-34)

<a id="API-TEC-38-33"></a>
#### API-TEC-38-33 · `PATCH /api/admin/tec/phone/boxes/{id}`

- **Qué hace:** Telefonía. Modifica algunos campos de un registro de cajas telefónicas (`phoneBoxes`) (solo los enviados).
- **Para qué sirve:** RF-TEC-199: KML de central, repartidor y cajas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de cajas telefónicas (`phoneBoxes`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de cajas telefónicas (`phoneBoxes`).
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-33)

<a id="API-TEC-38-35"></a>
#### API-TEC-38-35 · `GET /api/admin/tec/phone/dslams`

- **Qué hace:** Telefonía. Lista, con filtros y paginación, los registros de DSLAM (`dslams`).
- **Para qué sirve:** RF-TEC-164: Inventario de equipos de red (OLT, router/BRAS MikroTik, NAS/Radius, switch, AP inalámbrico, central telefónica, DSLAM, cabecera TV) con ubicación (elemento de red), IP de gestión, puerto, marca, modelo, serie, firmware y sistema… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de DSLAM (`dslams`) con `total`.
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-35)

<a id="API-TEC-38-36"></a>
#### API-TEC-38-36 · `POST /api/admin/tec/phone/dslams`

- **Qué hace:** Telefonía. Da de alta un registro de DSLAM (`dslams`).
- **Para qué sirve:** RF-TEC-164: Inventario de equipos de red (OLT, router/BRAS MikroTik, NAS/Radius, switch, AP inalámbrico, central telefónica, DSLAM, cabecera TV) con ubicación (elemento de red), IP de gestión, puerto, marca, modelo, serie, firmware y sistema… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.editar`.
- **Recibe:** los datos de DSLAM (`dslams`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de DSLAM (`dslams`).
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-36)

<a id="API-TEC-38-37"></a>
#### API-TEC-38-37 · `GET /api/admin/tec/phone/dslams/{id}`

- **Qué hace:** Telefonía. Obtiene el detalle de un registro de DSLAM (`dslams`).
- **Para qué sirve:** RF-TEC-164: Inventario de equipos de red (OLT, router/BRAS MikroTik, NAS/Radius, switch, AP inalámbrico, central telefónica, DSLAM, cabecera TV) con ubicación (elemento de red), IP de gestión, puerto, marca, modelo, serie, firmware y sistema… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de DSLAM (`dslams`).
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-37)

<a id="API-TEC-38-39"></a>
#### API-TEC-38-39 · `DELETE /api/admin/tec/phone/dslams/{id}`

- **Qué hace:** Telefonía. Elimina o da de baja un registro de DSLAM (`dslams`).
- **Para qué sirve:** RF-TEC-164: Inventario de equipos de red (OLT, router/BRAS MikroTik, NAS/Radius, switch, AP inalámbrico, central telefónica, DSLAM, cabecera TV) con ubicación (elemento de red), IP de gestión, puerto, marca, modelo, serie, firmware y sistema… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-39)

<a id="API-TEC-38-38"></a>
#### API-TEC-38-38 · `PATCH /api/admin/tec/phone/dslams/{id}`

- **Qué hace:** Telefonía. Modifica algunos campos de un registro de DSLAM (`dslams`) (solo los enviados).
- **Para qué sirve:** RF-TEC-164: Inventario de equipos de red (OLT, router/BRAS MikroTik, NAS/Radius, switch, AP inalámbrico, central telefónica, DSLAM, cabecera TV) con ubicación (elemento de red), IP de gestión, puerto, marca, modelo, serie, firmware y sistema… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de DSLAM (`dslams`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de DSLAM (`dslams`).
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-38)

<a id="API-TEC-38-40"></a>
#### API-TEC-38-40 · `GET /api/admin/tec/phone/prefixes`

- **Qué hace:** Telefonía. Lista, con filtros y paginación, los registros de prefijos (`phonePrefixes`).
- **Para qué sirve:** RF-TEC-197: Red física telefónica: centrales (modalidad de CDR, prefijo, moneda, último disco, GPS, importar segundos/clave), puertos de central, repartidores (GPS), grupos de entrada/salida, regletas, posiciones (terminal, color, posición… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de prefijos (`phonePrefixes`) con `total`.
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-40)

<a id="API-TEC-38-41"></a>
#### API-TEC-38-41 · `POST /api/admin/tec/phone/prefixes`

- **Qué hace:** Telefonía. Da de alta un registro de prefijos (`phonePrefixes`).
- **Para qué sirve:** RF-TEC-197: Red física telefónica: centrales (modalidad de CDR, prefijo, moneda, último disco, GPS, importar segundos/clave), puertos de central, repartidores (GPS), grupos de entrada/salida, regletas, posiciones (terminal, color, posición… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.editar`.
- **Recibe:** los datos de prefijos (`phonePrefixes`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de prefijos (`phonePrefixes`).
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-41)

<a id="API-TEC-38-42"></a>
#### API-TEC-38-42 · `GET /api/admin/tec/phone/prefixes/{id}`

- **Qué hace:** Telefonía. Obtiene el detalle de un registro de prefijos (`phonePrefixes`).
- **Para qué sirve:** RF-TEC-197: Red física telefónica: centrales (modalidad de CDR, prefijo, moneda, último disco, GPS, importar segundos/clave), puertos de central, repartidores (GPS), grupos de entrada/salida, regletas, posiciones (terminal, color, posición… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de prefijos (`phonePrefixes`).
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-42)

<a id="API-TEC-38-44"></a>
#### API-TEC-38-44 · `DELETE /api/admin/tec/phone/prefixes/{id}`

- **Qué hace:** Telefonía. Elimina o da de baja un registro de prefijos (`phonePrefixes`).
- **Para qué sirve:** RF-TEC-197: Red física telefónica: centrales (modalidad de CDR, prefijo, moneda, último disco, GPS, importar segundos/clave), puertos de central, repartidores (GPS), grupos de entrada/salida, regletas, posiciones (terminal, color, posición… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-44)

<a id="API-TEC-38-43"></a>
#### API-TEC-38-43 · `PATCH /api/admin/tec/phone/prefixes/{id}`

- **Qué hace:** Telefonía. Modifica algunos campos de un registro de prefijos (`phonePrefixes`) (solo los enviados).
- **Para qué sirve:** RF-TEC-197: Red física telefónica: centrales (modalidad de CDR, prefijo, moneda, último disco, GPS, importar segundos/clave), puertos de central, repartidores (GPS), grupos de entrada/salida, regletas, posiciones (terminal, color, posición… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de prefijos (`phonePrefixes`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de prefijos (`phonePrefixes`).
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-43)

<a id="API-TEC-38-45"></a>
#### API-TEC-38-45 · `GET /api/admin/tec/phone/numbers`

- **Qué hace:** Telefonía. Lista, con filtros y paginación, los registros de numeración (`phoneNumbers`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de numeración (`phoneNumbers`) con `total`.
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-45)

<a id="API-TEC-38-46"></a>
#### API-TEC-38-46 · `POST /api/admin/tec/phone/numbers`

- **Qué hace:** Telefonía. Da de alta un registro de numeración (`phoneNumbers`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.editar`.
- **Recibe:** los datos de numeración (`phoneNumbers`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de numeración (`phoneNumbers`).
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-46)

<a id="API-TEC-38-47"></a>
#### API-TEC-38-47 · `GET /api/admin/tec/phone/numbers/{id}`

- **Qué hace:** Telefonía. Obtiene el detalle de un registro de numeración (`phoneNumbers`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de numeración (`phoneNumbers`).
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-47)

<a id="API-TEC-38-49"></a>
#### API-TEC-38-49 · `DELETE /api/admin/tec/phone/numbers/{id}`

- **Qué hace:** Telefonía. Elimina o da de baja un registro de numeración (`phoneNumbers`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-49)

<a id="API-TEC-38-48"></a>
#### API-TEC-38-48 · `PATCH /api/admin/tec/phone/numbers/{id}`

- **Qué hace:** Telefonía. Modifica algunos campos de un registro de numeración (`phoneNumbers`) (solo los enviados).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de numeración (`phoneNumbers`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de numeración (`phoneNumbers`).
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-48)

<a id="API-TEC-38-50"></a>
#### API-TEC-38-50 · `GET /api/admin/tec/phone/lines`

- **Qué hace:** Telefonía. Lista, con filtros y paginación, los registros de líneas (`phoneLines`).
- **Para qué sirve:** RF-TEC-201: Líneas del abonado: servicio + número + plan tarifario (M04) con fechas de alta/baja (vigencia usada para atribuir llamadas); un número no puede estar en uso por otro servicio en la misma fecha; desvincular cierra la línea… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de líneas (`phoneLines`) con `total`.
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-50)

<a id="API-TEC-38-51"></a>
#### API-TEC-38-51 · `POST /api/admin/tec/phone/lines`

- **Qué hace:** Telefonía. Da de alta un registro de líneas (`phoneLines`).
- **Para qué sirve:** RF-TEC-201: Líneas del abonado: servicio + número + plan tarifario (M04) con fechas de alta/baja (vigencia usada para atribuir llamadas); un número no puede estar en uso por otro servicio en la misma fecha; desvincular cierra la línea… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.editar`.
- **Recibe:** los datos de líneas (`phoneLines`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de líneas (`phoneLines`).
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-51)

<a id="API-TEC-38-52"></a>
#### API-TEC-38-52 · `GET /api/admin/tec/phone/lines/{id}`

- **Qué hace:** Telefonía. Obtiene el detalle de un registro de líneas (`phoneLines`).
- **Para qué sirve:** RF-TEC-201: Líneas del abonado: servicio + número + plan tarifario (M04) con fechas de alta/baja (vigencia usada para atribuir llamadas); un número no puede estar en uso por otro servicio en la misma fecha; desvincular cierra la línea… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de líneas (`phoneLines`).
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-52)

<a id="API-TEC-38-54"></a>
#### API-TEC-38-54 · `DELETE /api/admin/tec/phone/lines/{id}`

- **Qué hace:** Telefonía. Elimina o da de baja un registro de líneas (`phoneLines`).
- **Para qué sirve:** RF-TEC-201: Líneas del abonado: servicio + número + plan tarifario (M04) con fechas de alta/baja (vigencia usada para atribuir llamadas); un número no puede estar en uso por otro servicio en la misma fecha; desvincular cierra la línea… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-54)

<a id="API-TEC-38-53"></a>
#### API-TEC-38-53 · `PATCH /api/admin/tec/phone/lines/{id}`

- **Qué hace:** Telefonía. Modifica algunos campos de un registro de líneas (`phoneLines`) (solo los enviados).
- **Para qué sirve:** RF-TEC-201: Líneas del abonado: servicio + número + plan tarifario (M04) con fechas de alta/baja (vigencia usada para atribuir llamadas); un número no puede estar en uso por otro servicio en la misma fecha; desvincular cierra la línea… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de líneas (`phoneLines`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de líneas (`phoneLines`).
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-53)

<a id="API-TEC-38-55"></a>
#### API-TEC-38-55 · `GET /api/admin/tec/phone/operators`

- **Qué hace:** Telefonía. Lista, con filtros y paginación, los registros de operadoras (`telecomOperators`).
- **Para qué sirve:** RF-TEC-213: Informes de telefonía: llamadas CNC, categorías CNC, realizadas, no asignadas, no agrupadas, no facturadas, números en central, conectados sin tráfico, por operador, números disponibles, entrantes por central. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de operadoras (`telecomOperators`) con `total`.
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-55)

<a id="API-TEC-38-56"></a>
#### API-TEC-38-56 · `POST /api/admin/tec/phone/operators`

- **Qué hace:** Telefonía. Da de alta un registro de operadoras (`telecomOperators`).
- **Para qué sirve:** RF-TEC-213: Informes de telefonía: llamadas CNC, categorías CNC, realizadas, no asignadas, no agrupadas, no facturadas, números en central, conectados sin tráfico, por operador, números disponibles, entrantes por central. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.editar`.
- **Recibe:** los datos de operadoras (`telecomOperators`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de operadoras (`telecomOperators`).
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-56)

<a id="API-TEC-38-57"></a>
#### API-TEC-38-57 · `GET /api/admin/tec/phone/operators/{id}`

- **Qué hace:** Telefonía. Obtiene el detalle de un registro de operadoras (`telecomOperators`).
- **Para qué sirve:** RF-TEC-213: Informes de telefonía: llamadas CNC, categorías CNC, realizadas, no asignadas, no agrupadas, no facturadas, números en central, conectados sin tráfico, por operador, números disponibles, entrantes por central. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de operadoras (`telecomOperators`).
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-57)

<a id="API-TEC-38-59"></a>
#### API-TEC-38-59 · `DELETE /api/admin/tec/phone/operators/{id}`

- **Qué hace:** Telefonía. Elimina o da de baja un registro de operadoras (`telecomOperators`).
- **Para qué sirve:** RF-TEC-213: Informes de telefonía: llamadas CNC, categorías CNC, realizadas, no asignadas, no agrupadas, no facturadas, números en central, conectados sin tráfico, por operador, números disponibles, entrantes por central. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-59)

<a id="API-TEC-38-58"></a>
#### API-TEC-38-58 · `PATCH /api/admin/tec/phone/operators/{id}`

- **Qué hace:** Telefonía. Modifica algunos campos de un registro de operadoras (`telecomOperators`) (solo los enviados).
- **Para qué sirve:** RF-TEC-213: Informes de telefonía: llamadas CNC, categorías CNC, realizadas, no asignadas, no agrupadas, no facturadas, números en central, conectados sin tráfico, por operador, números disponibles, entrantes por central. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de operadoras (`telecomOperators`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de operadoras (`telecomOperators`).
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-58)

<a id="API-TEC-38-60"></a>
#### API-TEC-38-60 · `GET /api/admin/tec/phone/service-types`

- **Qué hace:** Telefonía. Lista, con filtros y paginación, los registros de tipos de servicio TIC (`telecomServiceTypes`).
- **Para qué sirve:** RF-TEC-210: Telefonía móvil (reventa Claro/Personal): importación de factura del proveedor por línea y asignación al servicio; el clearing y los conceptos en M04. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de tipos de servicio TIC (`telecomServiceTypes`) con `total`.
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-60)

<a id="API-TEC-38-61"></a>
#### API-TEC-38-61 · `POST /api/admin/tec/phone/service-types`

- **Qué hace:** Telefonía. Da de alta un registro de tipos de servicio TIC (`telecomServiceTypes`).
- **Para qué sirve:** RF-TEC-210: Telefonía móvil (reventa Claro/Personal): importación de factura del proveedor por línea y asignación al servicio; el clearing y los conceptos en M04. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.editar`.
- **Recibe:** los datos de tipos de servicio TIC (`telecomServiceTypes`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de tipos de servicio TIC (`telecomServiceTypes`).
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-61)

<a id="API-TEC-38-62"></a>
#### API-TEC-38-62 · `GET /api/admin/tec/phone/service-types/{id}`

- **Qué hace:** Telefonía. Obtiene el detalle de un registro de tipos de servicio TIC (`telecomServiceTypes`).
- **Para qué sirve:** RF-TEC-210: Telefonía móvil (reventa Claro/Personal): importación de factura del proveedor por línea y asignación al servicio; el clearing y los conceptos en M04. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de tipos de servicio TIC (`telecomServiceTypes`).
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-62)

<a id="API-TEC-38-64"></a>
#### API-TEC-38-64 · `DELETE /api/admin/tec/phone/service-types/{id}`

- **Qué hace:** Telefonía. Elimina o da de baja un registro de tipos de servicio TIC (`telecomServiceTypes`).
- **Para qué sirve:** RF-TEC-210: Telefonía móvil (reventa Claro/Personal): importación de factura del proveedor por línea y asignación al servicio; el clearing y los conceptos en M04. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-64)

<a id="API-TEC-38-63"></a>
#### API-TEC-38-63 · `PATCH /api/admin/tec/phone/service-types/{id}`

- **Qué hace:** Telefonía. Modifica algunos campos de un registro de tipos de servicio TIC (`telecomServiceTypes`) (solo los enviados).
- **Para qué sirve:** RF-TEC-210: Telefonía móvil (reventa Claro/Personal): importación de factura del proveedor por línea y asignación al servicio; el clearing y los conceptos en M04. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de tipos de servicio TIC (`telecomServiceTypes`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de tipos de servicio TIC (`telecomServiceTypes`).
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-63)

<a id="API-TEC-38-65"></a>
#### API-TEC-38-65 · `GET /api/admin/tec/phone/modalities`

- **Qué hace:** Telefonía. Lista, con filtros y paginación, los registros de modalidades (`telecomModalities`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de modalidades (`telecomModalities`) con `total`.
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-65)

<a id="API-TEC-38-66"></a>
#### API-TEC-38-66 · `POST /api/admin/tec/phone/modalities`

- **Qué hace:** Telefonía. Da de alta un registro de modalidades (`telecomModalities`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.editar`.
- **Recibe:** los datos de modalidades (`telecomModalities`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de modalidades (`telecomModalities`).
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-66)

<a id="API-TEC-38-67"></a>
#### API-TEC-38-67 · `GET /api/admin/tec/phone/modalities/{id}`

- **Qué hace:** Telefonía. Obtiene el detalle de un registro de modalidades (`telecomModalities`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de modalidades (`telecomModalities`).
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-67)

<a id="API-TEC-38-69"></a>
#### API-TEC-38-69 · `DELETE /api/admin/tec/phone/modalities/{id}`

- **Qué hace:** Telefonía. Elimina o da de baja un registro de modalidades (`telecomModalities`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-69)

<a id="API-TEC-38-68"></a>
#### API-TEC-38-68 · `PATCH /api/admin/tec/phone/modalities/{id}`

- **Qué hace:** Telefonía. Modifica algunos campos de un registro de modalidades (`telecomModalities`) (solo los enviados).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.redFisica.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de modalidades (`telecomModalities`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de modalidades (`telecomModalities`).
- **Pantallas:** PAN-TEC-42 (Red telefónica física).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2752 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-38-68)

<a id="API-TEC-39"></a>
#### API-TEC-39 · `POST /api/admin/tec/phone/cdr-imports`

- **Qué hace:** CDR y móvil. Subida por URL firmada. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes POST · GET · POST; PA-... Da de alta un registro de importaciones de CDR (`cdrImports`).
- **Para qué sirve:** RF-TEC-210: Telefonía móvil (reventa Claro/Personal): importación de factura del proveedor por línea y asignación al servicio; el clearing y los conceptos en M04. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.cdr.importar`.
- **Recibe:** los datos de importaciones de CDR (`cdrImports`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de importaciones de CDR (`cdrImports`).
- **Pantallas:** PAN-TEC-45 (Importación de CDR).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2753 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-39)

<a id="API-TEC-39-b"></a>
#### API-TEC-39-b · `GET /api/admin/tec/phone/cdr-imports/{id}`

- **Qué hace:** CDR y móvil. Subida por URL firmada. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes POST · GET · POST; PA-... Obtiene el detalle de un registro de importaciones de CDR (`cdrImports`).
- **Para qué sirve:** RF-TEC-210: Telefonía móvil (reventa Claro/Personal): importación de factura del proveedor por línea y asignación al servicio; el clearing y los conceptos en M04. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.cdr.importar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de importaciones de CDR (`cdrImports`).
- **Pantallas:** PAN-TEC-45 (Importación de CDR).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2753 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-39-b)

<a id="API-TEC-39-c"></a>
#### API-TEC-39-c · `POST /api/admin/tec/phone/cdr-imports/{id}/attribute`

- **Qué hace:** CDR y móvil. Subida por URL firmada. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes POST · GET · POST; PA-... Atribuye un registro de importaciones de CDR (`cdrImports`).
- **Para qué sirve:** RF-TEC-210: Telefonía móvil (reventa Claro/Personal): importación de factura del proveedor por línea y asignación al servicio; el clearing y los conceptos en M04. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.cdr.importar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-45 (Importación de CDR).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2753 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-39-c)

<a id="API-TEC-39-d"></a>
#### API-TEC-39-d · `POST /api/admin/tec/phone/cdr-imports/{id}/rollback`

- **Qué hace:** CDR y móvil. Subida por URL firmada. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes POST · GET · POST; PA-... Deshace (rollback) un registro de importaciones de CDR (`cdrImports`).
- **Para qué sirve:** RF-TEC-210: Telefonía móvil (reventa Claro/Personal): importación de factura del proveedor por línea y asignación al servicio; el clearing y los conceptos en M04. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.cdr.importar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-45 (Importación de CDR).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2753 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-39-d)

<a id="API-TEC-39-e"></a>
#### API-TEC-39-e · `POST /api/admin/tec/phone/mobile-imports`

- **Qué hace:** CDR y móvil. Subida por URL firmada. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes POST · GET · POST; PA-... Registra un nuevo elemento u operación en `mobile-imports`.
- **Para qué sirve:** RF-TEC-210: Telefonía móvil (reventa Claro/Personal): importación de factura del proveedor por línea y asignación al servicio; el clearing y los conceptos en M04. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.cdr.importar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-45 (Importación de CDR).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2753 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-39-e)

<a id="API-TEC-40"></a>
#### API-TEC-40 · `GET /api/portal/tec/availability`

- **Qué hace:** Reserva del socio. Rate limit. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes GET · POST; PA-TEC-23). Consulta notas técnicas de solo agregado (`technicalNotes`).
- **Para qué sirve:** RF-TEC-073: Configurar zonas de agenda (polígonos o lista de localidades/barrios), tipos de visita con duración, franjas, requisitos (habilidad, cuadrilla, vehículo, equipo) y servicios. · RF-TEC-074: Calendarios de recursos (cuadrillas/técnicos) con disponibilidad, feriados (T04), turnos, ausencias y capacidad por franja (cantidad de visitas o minutos).
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.visitas.reservar`.
- **Recibe:** nada.
- **Devuelve:** 200: el registro de notas técnicas de solo agregado (`technicalNotes`).
- **Pantallas:** PAN-TEC-57 (Reservar visita (componente embebido en PAN-POR-34)).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2754 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-40)

<a id="API-TEC-40-b"></a>
#### API-TEC-40-b · `POST /api/portal/tec/bookings`

- **Qué hace:** Reserva del socio. Rate limit. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes GET · POST; PA-TEC-23). Registra un nuevo elemento u operación en notas técnicas de solo agregado (`technicalNotes`).
- **Para qué sirve:** RF-TEC-073: Configurar zonas de agenda (polígonos o lista de localidades/barrios), tipos de visita con duración, franjas, requisitos (habilidad, cuadrilla, vehículo, equipo) y servicios. · RF-TEC-074: Calendarios de recursos (cuadrillas/técnicos) con disponibilidad, feriados (T04), turnos, ausencias y capacidad por franja (cantidad de visitas o minutos).
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.visitas.reservar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-57 (Reservar visita (componente embebido en PAN-POR-34)).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2754 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-40-b)

<a id="API-TEC-40-c"></a>
#### API-TEC-40-c · `POST /api/portal/tec/bookings/{id}/confirm`

- **Qué hace:** Reserva del socio. Rate limit. Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes GET · POST; PA-TEC-23). Confirma un registro de notas técnicas de solo agregado (`technicalNotes`).
- **Para qué sirve:** RF-TEC-073: Configurar zonas de agenda (polígonos o lista de localidades/barrios), tipos de visita con duración, franjas, requisitos (habilidad, cuadrilla, vehículo, equipo) y servicios. · RF-TEC-074: Calendarios de recursos (cuadrillas/técnicos) con disponibilidad, feriados (T04), turnos, ausencias y capacidad por franja (cantidad de visitas o minutos).
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.visitas.reservar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-57 (Reservar visita (componente embebido en PAN-POR-34)).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2754 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-40-c)

<a id="API-TEC-41"></a>
#### API-TEC-41 · `GET /api/portal/tec/visits/{id}`

- **Qué hace:** Seguimiento. Solo datos propios. Obtiene el detalle de un registro de visitas (`visits`).
- **Para qué sirve:** RF-TEC-181: Seguimiento del caso hasta regularización, con reincidencias y estadística por zona. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.visitas.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de visitas (`visits`).
- **Pantallas:** PAN-TEC-58 (Seguimiento de visita (componente embebido en PAN-POR-35)), PAN-TEC-59 (Estado de factibilidad (componente embebido en PAN-POR-34 y PAN-POR-33)).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2755 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-41)

<a id="API-TEC-41-b"></a>
#### API-TEC-41-b · `POST /api/portal/tec/visits/{id}/reschedule`

- **Qué hace:** Seguimiento. Solo datos propios. Reprograma un registro de visitas (`visits`).
- **Para qué sirve:** RF-TEC-078: Reprogramar y cancelar visitas por socio (portal, con reglas de anticipación) u operador, con motivo y trazabilidad; cancelar visita no cancela la contratación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.visitas.reprogramar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-58 (Seguimiento de visita (componente embebido en PAN-POR-35)).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2755 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-41-b)

<a id="API-TEC-41-c"></a>
#### API-TEC-41-c · `POST /api/portal/tec/visits/{id}/cancel`

- **Qué hace:** Seguimiento. Solo datos propios. Cancela un registro de visitas (`visits`).
- **Para qué sirve:** RF-TEC-078: Reprogramar y cancelar visitas por socio (portal, con reglas de anticipación) u operador, con motivo y trazabilidad; cancelar visita no cancela la contratación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.visitas.reprogramar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-58 (Seguimiento de visita (componente embebido en PAN-POR-35)).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2755 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-41-c)

<a id="API-TEC-41-d"></a>
#### API-TEC-41-d · `GET /api/portal/tec/feasibility/{id}`

- **Qué hace:** Seguimiento. Solo datos propios. Obtiene el detalle de un registro de notas técnicas de solo agregado (`technicalNotes`).
- **Para qué sirve:** RF-TEC-004: Registrar observaciones administrativa, comercial y operativa y notas de seguimiento con título, texto, fecha, usuario y responsable. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.visitas.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de notas técnicas de solo agregado (`technicalNotes`).
- **Pantallas:** PAN-TEC-58 (Seguimiento de visita (componente embebido en PAN-POR-35)), PAN-TEC-59 (Estado de factibilidad (componente embebido en PAN-POR-34 y PAN-POR-33)).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2755 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-41-d)

<a id="API-TEC-42"></a>
#### API-TEC-42 · `GET /api/field/my-day`

- **Qué hace:** Paquete del día. ETag; delta desde since. Consulta `my-day`.
- **Para qué sirve:** RF-TEC-194: Aprovisionamiento de TV y otros TIC (Sensa, Sopnet, SITSA) con la misma interfaz. En TV, los comandos activate, changePlan, suspend, reactivate y deactivate operan por decodificador y paquete CAS según el perfil técnico de TV de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de campo o cobradores, desde la app móvil; permiso `tec.campo.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-60 (Shell de campo), PAN-TEC-50 (Mi día), PAN-TEC-53 (Cola de sincronización) y 1 más.
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2756 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-42)

<a id="API-TEC-43"></a>
#### API-TEC-43 · `POST /api/field/sync`

- **Qué hace:** Lote de mutaciones. Resultado por ítem (applied/duplicate/conflict/rejected/deferred). Sincroniza sobre `sync`; el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-TEC-114: Cola única de mutaciones en IndexedDB con clientMutationId, fotos/evidencias en IndexedDB, envío por lotes a /sync con resultado por ítem, reintento automático y botón "Reintentar" en banner único. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de campo o cobradores, desde la app móvil; permiso `tec.campo.ejecutar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-TEC-51 (Ejecución de OT), PAN-TEC-54 (Inspección).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2757 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-43)

<a id="API-TEC-44"></a>
#### API-TEC-44 · `POST /api/field/evidence/upload-url`

- **Qué hace:** URL firmada para foto/firma. Tamaño máx. PRM-TEC-144. Registra un nuevo elemento u operación en evidencias de campo (`fieldEvidence`).
- **Para qué sirve:** RF-TEC-116: Fotos con marca de fecha/hora, GPS y orientación; foto obligatoria por paso configurable; compresión y límite de tamaño. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de campo o cobradores, desde la app móvil; permiso `tec.campo.evidencia`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-51 (Ejecución de OT).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2758 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-44)

<a id="API-TEC-45"></a>
#### API-TEC-45 · `GET /api/field/custody`

- **Qué hace:** Custodia del técnico (proxy a M13). Consulta `custody`.
- **Para qué sirve:** RF-TEC-065: Origen del descuento: depósito indicado, custodia del técnico/responsable (depósito propio) o depósito por defecto configurado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de campo o cobradores, desde la app móvil; permiso `stk.custodia.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-52 (Mi stock (absorbida por PAN-STK-37)).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2759 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-45)

<a id="API-TEC-46"></a>
#### API-TEC-46 · `POST /api/field/devices/register`

- **Qué hace:** Dispositivos. Revocación borra caché local al próximo contacto. Registra sobre dispositivos de campo (`fieldDevices`).
- **Para qué sirve:** RF-TEC-128: Registro de dispositivos de campo (modelo, versión de app, último sync, usuario) y revocación remota que purga datos locales. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de campo o cobradores, desde la app móvil; permiso `tec.dispositivos.gestionar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2760 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-46)

<a id="API-TEC-46-b"></a>
#### API-TEC-46-b · `POST /api/field/devices/revoke`

- **Qué hace:** Dispositivos. Revocación borra caché local al próximo contacto. Revoca sobre dispositivos de campo (`fieldDevices`).
- **Para qué sirve:** RF-TEC-128: Registro de dispositivos de campo (modelo, versión de app, último sync, usuario) y revocación remota que purga datos locales. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de campo o cobradores, desde la app móvil; permiso `tec.dispositivos.gestionar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2760 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-46-b)

<a id="API-TEC-47"></a>
#### API-TEC-47 · `GET /api/admin/tec/geo/review`

- **Qué hace:** Geolocalización. Proveedor abstraído (PRM-TEC-149). Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes GET · P... Consulta `review`.
- **Para qué sirve:** RF-TEC-110: Catálogo de tareas y grupos de tareas por servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.geo.revisar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-48 (Revisión de geolocalización).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2761 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-47)

<a id="API-TEC-47-b"></a>
#### API-TEC-47-b · `PATCH /api/admin/tec/geo/points/{id}`

- **Qué hace:** Geolocalización. Proveedor abstraído (PRM-TEC-149). Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes GET · P... Modifica algunos campos de un registro de puntos de muestreo de calidad del agua con parámetros y límites (`waterSamplingPoints`) (solo los enviados).
- **Para qué sirve:** RF-TEC-235: Puntos y plan de muestreo (habilitable por concesión, PRM-TEC-157): puntos de muestreo georreferenciados vinculados a elementos de red de agua (pozo, cisterna, planta, red, conexión domiciliaria), parámetros a analizar por punto… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.geo.revisar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de puntos de muestreo de calidad del agua con parámetros y límites (`waterSamplingPoints`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de puntos de muestreo de calidad del agua con parámetros y límites (`waterSamplingPoints`).
- **Pantallas:** PAN-TEC-48 (Revisión de geolocalización).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2761 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-47-b)

<a id="API-TEC-47-c"></a>
#### API-TEC-47-c · `POST /api/admin/tec/geo/geocode`

- **Qué hace:** Geolocalización. Proveedor abstraído (PRM-TEC-149). Grupos de método alineados a las rutas, uno por ruta en el mismo orden (antes GET · P... Registra un nuevo elemento u operación en `geocode`.
- **Para qué sirve:** RF-TEC-110: Catálogo de tareas y grupos de tareas por servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.geo.revisar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-48 (Revisión de geolocalización).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2761 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-47-c)

<a id="API-TEC-48"></a>
#### API-TEC-48 · `GET /api/admin/tec/reports/{reportId}`

- **Qué hace:** Informes. Exportación CSV/XLSX/PDF. Obtiene el detalle de un registro de `reports`.
- **Para qué sirve:** RF-TEC-225: Vista previa de resultados con marcado de registros y exportación a mapa (KML/Google Earth). · RF-TEC-107: Tipos de trabajo con clase de orden (trabajo/mantenimiento) y reporte asociado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.reportes.ver`.
- **Recibe:** en la ruta `reportId`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-47 (Informes técnicos).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2762 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-48)

<a id="API-TEC-49"></a>
#### API-TEC-49 · `POST /api/v1/ext/tec/work-orders`

- **Qué hace:** Alta externa de OT (contratistas, sistemas). Idempotente. Da de alta un registro de órdenes de trabajo (`workOrders`).
- **Para qué sirve:** RF-TEC-191: Identificador externo por contrato/conexión (no por cuenta) y tabla de correspondencia por sistema. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); permiso `tec.ext.ordenes.crear`.
- **Recibe:** los datos de órdenes de trabajo (`workOrders`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de órdenes de trabajo (`workOrders`).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2763 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-49)

<a id="API-TEC-50"></a>
#### API-TEC-50 · `POST /api/v1/ext/tec/provisioning/callback/{systemId}`

- **Qué hace:** Callback de sistemas externos. Verifica firma y replay. Registra un nuevo elemento u operación en `callback`.
- **Para qué sirve:** RF-TEC-190: Sincronización con sistemas externos de clientes y servicios (AION y equivalentes): clientes, servicios, servicios de socio, con conciliación de diferencias. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); permiso `tec.ext.aprovisionamiento.callback`.
- **Recibe:** en la ruta `systemId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2764 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-50)

<a id="API-TEC-51"></a>
#### API-TEC-51 · `GET /api/admin/tec/on-call/shifts`

- **Qué hace:** Guardias y emergencias (HUE-GAS-05). current lo consume M09 para el teléfono de guardia (PRM-CRM-019). Lista, con filtros y paginación, los registros de turnos de guardia por servicio y zona con titular (`onCallShifts`).
- **Para qué sirve:** RF-TEC-231: Turnos de guardia por servicio y zona: calendario de turnos (día, franja, feriados de T04) con titular, suplente y jefe de guardia, teléfono de contacto de guardia publicado al socio (PRM-CRM-019 de M09 lo toma del turno… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.guardias.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de turnos de guardia por servicio y zona con titular (`onCallShifts`) con `total`.
- **Pantallas:** PAN-TEC-61 (Guardias).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2765 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-51)

<a id="API-TEC-51-b"></a>
#### API-TEC-51-b · `POST /api/admin/tec/on-call/shifts`

- **Qué hace:** Guardias y emergencias (HUE-GAS-05). current lo consume M09 para el teléfono de guardia (PRM-CRM-019). Da de alta un registro de turnos de guardia por servicio y zona con titular (`onCallShifts`).
- **Para qué sirve:** RF-TEC-231: Turnos de guardia por servicio y zona: calendario de turnos (día, franja, feriados de T04) con titular, suplente y jefe de guardia, teléfono de contacto de guardia publicado al socio (PRM-CRM-019 de M09 lo toma del turno… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.guardias.gestionar`.
- **Recibe:** los datos de turnos de guardia por servicio y zona con titular (`onCallShifts`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de turnos de guardia por servicio y zona con titular (`onCallShifts`).
- **Pantallas:** PAN-TEC-61 (Guardias).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2765 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-51-b)

<a id="API-TEC-51-c"></a>
#### API-TEC-51-c · `GET /api/admin/tec/on-call/shifts/{id}`

- **Qué hace:** Guardias y emergencias (HUE-GAS-05). current lo consume M09 para el teléfono de guardia (PRM-CRM-019). Obtiene el detalle de un registro de turnos de guardia por servicio y zona con titular (`onCallShifts`).
- **Para qué sirve:** RF-TEC-231: Turnos de guardia por servicio y zona: calendario de turnos (día, franja, feriados de T04) con titular, suplente y jefe de guardia, teléfono de contacto de guardia publicado al socio (PRM-CRM-019 de M09 lo toma del turno… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.guardias.gestionar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de turnos de guardia por servicio y zona con titular (`onCallShifts`).
- **Pantallas:** PAN-TEC-61 (Guardias).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2765 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-51-c)

<a id="API-TEC-51-e"></a>
#### API-TEC-51-e · `DELETE /api/admin/tec/on-call/shifts/{id}`

- **Qué hace:** Guardias y emergencias (HUE-GAS-05). current lo consume M09 para el teléfono de guardia (PRM-CRM-019). Elimina o da de baja un registro de turnos de guardia por servicio y zona con titular (`onCallShifts`).
- **Para qué sirve:** RF-TEC-231: Turnos de guardia por servicio y zona: calendario de turnos (día, franja, feriados de T04) con titular, suplente y jefe de guardia, teléfono de contacto de guardia publicado al socio (PRM-CRM-019 de M09 lo toma del turno… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.campo.ejecutar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-TEC-51 (Ejecución de OT), PAN-TEC-54 (Inspección).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2765 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-51-e)

<a id="API-TEC-51-d"></a>
#### API-TEC-51-d · `PATCH /api/admin/tec/on-call/shifts/{id}`

- **Qué hace:** Guardias y emergencias (HUE-GAS-05). current lo consume M09 para el teléfono de guardia (PRM-CRM-019). Modifica algunos campos de un registro de turnos de guardia por servicio y zona con titular (`onCallShifts`) (solo los enviados).
- **Para qué sirve:** RF-TEC-231: Turnos de guardia por servicio y zona: calendario de turnos (día, franja, feriados de T04) con titular, suplente y jefe de guardia, teléfono de contacto de guardia publicado al socio (PRM-CRM-019 de M09 lo toma del turno… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.guardias.gestionar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de turnos de guardia por servicio y zona con titular (`onCallShifts`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de turnos de guardia por servicio y zona con titular (`onCallShifts`).
- **Pantallas:** PAN-TEC-61 (Guardias).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2765 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-51-d)

<a id="API-TEC-51-f"></a>
#### API-TEC-51-f · `GET /api/admin/tec/on-call/current`

- **Qué hace:** Guardias y emergencias (HUE-GAS-05). current lo consume M09 para el teléfono de guardia (PRM-CRM-019). Consulta `current`.
- **Para qué sirve:** RF-TEC-232: Escalamiento de guardia: al asignar una OT de emergencia se notifica al titular de guardia por los canales de PRM-TEC-153; si no acepta dentro de PRM-TEC-152 minutos se notifica al suplente y luego al jefe de guardia; cada nivel… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.guardias.gestionar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-61 (Guardias).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2765 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-51-f)

<a id="API-TEC-51-g"></a>
#### API-TEC-51-g · `POST /api/admin/tec/work-orders/{id}/emergency/accept`

- **Qué hace:** Guardias y emergencias (HUE-GAS-05). current lo consume M09 para el teléfono de guardia (PRM-CRM-019). Acepta sobre órdenes de trabajo (`workOrders`).
- **Para qué sirve:** RF-TEC-232: Escalamiento de guardia: al asignar una OT de emergencia se notifica al titular de guardia por los canales de PRM-TEC-153; si no acepta dentro de PRM-TEC-152 minutos se notifica al suplente y luego al jefe de guardia; cada nivel… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.guardias.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-61 (Guardias).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2765 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-51-g)

<a id="API-TEC-51-h"></a>
#### API-TEC-51-h · `POST /api/admin/tec/work-orders/{id}/emergency/arrive`

- **Qué hace:** Guardias y emergencias (HUE-GAS-05). current lo consume M09 para el teléfono de guardia (PRM-CRM-019). Registra un nuevo elemento u operación en órdenes de trabajo (`workOrders`).
- **Para qué sirve:** RF-TEC-232: Escalamiento de guardia: al asignar una OT de emergencia se notifica al titular de guardia por los canales de PRM-TEC-153; si no acepta dentro de PRM-TEC-152 minutos se notifica al suplente y luego al jefe de guardia; cada nivel… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.guardias.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-61 (Guardias).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2765 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-51-h)

<a id="API-TEC-51-i"></a>
#### API-TEC-51-i · `POST /api/admin/tec/work-orders/{id}/emergency/safe`

- **Qué hace:** Guardias y emergencias (HUE-GAS-05). current lo consume M09 para el teléfono de guardia (PRM-CRM-019). Registra un nuevo elemento u operación en órdenes de trabajo (`workOrders`).
- **Para qué sirve:** RF-TEC-232: Escalamiento de guardia: al asignar una OT de emergencia se notifica al titular de guardia por los canales de PRM-TEC-153; si no acepta dentro de PRM-TEC-152 minutos se notifica al suplente y luego al jefe de guardia; cada nivel… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.guardias.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-61 (Guardias).
- **Ola:** O3 · **Fuente:** M10 §11. API, línea 2765 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-51-i)

<a id="API-TEC-52"></a>
#### API-TEC-52 · `GET /api/admin/tec/emergency-protocols`

- **Qué hace:** Protocolos de emergencia. Versionado: una OT conserva la versión aplicada. Lista, con filtros y paginación, los registros de protocolos de emergencia por servicio (`emergencyProtocols`).
- **Para qué sirve:** RF-TEC-013: Permitir modificar factibilidades cerradas y adjuntar documentos a factibilidades cerradas solo con capability y parámetro, conservando versión anterior. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de protocolos de emergencia por servicio (`emergencyProtocols`) con `total`.
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2766 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-52)

<a id="API-TEC-52-b"></a>
#### API-TEC-52-b · `POST /api/admin/tec/emergency-protocols`

- **Qué hace:** Protocolos de emergencia. Versionado: una OT conserva la versión aplicada. Da de alta un registro de protocolos de emergencia por servicio (`emergencyProtocols`).
- **Para qué sirve:** RF-TEC-013: Permitir modificar factibilidades cerradas y adjuntar documentos a factibilidades cerradas solo con capability y parámetro, conservando versión anterior. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** los datos de protocolos de emergencia por servicio (`emergencyProtocols`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de protocolos de emergencia por servicio (`emergencyProtocols`).
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2766 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-52-b)

<a id="API-TEC-52-c"></a>
#### API-TEC-52-c · `GET /api/admin/tec/emergency-protocols/{id}`

- **Qué hace:** Protocolos de emergencia. Versionado: una OT conserva la versión aplicada. Obtiene el detalle de un registro de protocolos de emergencia por servicio (`emergencyProtocols`).
- **Para qué sirve:** RF-TEC-013: Permitir modificar factibilidades cerradas y adjuntar documentos a factibilidades cerradas solo con capability y parámetro, conservando versión anterior. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de protocolos de emergencia por servicio (`emergencyProtocols`).
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2766 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-52-c)

<a id="API-TEC-52-e"></a>
#### API-TEC-52-e · `DELETE /api/admin/tec/emergency-protocols/{id}`

- **Qué hace:** Protocolos de emergencia. Versionado: una OT conserva la versión aplicada. Elimina o da de baja un registro de protocolos de emergencia por servicio (`emergencyProtocols`).
- **Para qué sirve:** RF-TEC-013: Permitir modificar factibilidades cerradas y adjuntar documentos a factibilidades cerradas solo con capability y parámetro, conservando versión anterior. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2766 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-52-e)

<a id="API-TEC-52-d"></a>
#### API-TEC-52-d · `PATCH /api/admin/tec/emergency-protocols/{id}`

- **Qué hace:** Protocolos de emergencia. Versionado: una OT conserva la versión aplicada. Modifica algunos campos de un registro de protocolos de emergencia por servicio (`emergencyProtocols`) (solo los enviados).
- **Para qué sirve:** RF-TEC-013: Permitir modificar factibilidades cerradas y adjuntar documentos a factibilidades cerradas solo con capability y parámetro, conservando versión anterior. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.config.gestionar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de protocolos de emergencia por servicio (`emergencyProtocols`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de protocolos de emergencia por servicio (`emergencyProtocols`).
- **Pantallas:** PAN-TEC-15 (Responsables a notificar), PAN-TEC-16 (Profesionales certificados), PAN-TEC-17 (Tipos de operación) y 7 más.
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2766 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-52-d)

<a id="API-TEC-53"></a>
#### API-TEC-53 · `GET /api/admin/tec/phone/portings`

- **Qué hace:** Portabilidad numérica (PA-TEC-19). 404 tec.feature.disabled si PRM-TEC-156 = false. Lista, con filtros y paginación, los registros de portabilidad numérica entrante y saliente (`numberPortings`).
- **Para qué sirve:** RF-TEC-234: Portabilidad numérica (PA-TEC-19): por defecto No aplica (cooperativas sin numeración propia; PRM-TEC-156 = false). Si el tenant tiene numeración asignada y habilita el parámetro, la portabilidad es una operación técnica con… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.numeracion.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de portabilidad numérica entrante y saliente (`numberPortings`) con `total`.
- **Pantallas:** PAN-TEC-43 (Numeración), PAN-TEC-63 (Portabilidad numérica).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2767 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-53)

<a id="API-TEC-53-b"></a>
#### API-TEC-53-b · `POST /api/admin/tec/phone/portings`

- **Qué hace:** Portabilidad numérica (PA-TEC-19). 404 tec.feature.disabled si PRM-TEC-156 = false. Da de alta un registro de portabilidad numérica entrante y saliente (`numberPortings`).
- **Para qué sirve:** RF-TEC-234: Portabilidad numérica (PA-TEC-19): por defecto No aplica (cooperativas sin numeración propia; PRM-TEC-156 = false). Si el tenant tiene numeración asignada y habilita el parámetro, la portabilidad es una operación técnica con… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.numeracion.editar`.
- **Recibe:** los datos de portabilidad numérica entrante y saliente (`numberPortings`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de portabilidad numérica entrante y saliente (`numberPortings`).
- **Pantallas:** PAN-TEC-43 (Numeración), PAN-TEC-63 (Portabilidad numérica).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2767 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-53-b)

<a id="API-TEC-53-c"></a>
#### API-TEC-53-c · `POST /api/admin/tec/phone/portings/{id}/submit`

- **Qué hace:** Portabilidad numérica (PA-TEC-19). 404 tec.feature.disabled si PRM-TEC-156 = false. Envía a revisión o presenta un registro de portabilidad numérica entrante y saliente (`numberPortings`).
- **Para qué sirve:** RF-TEC-234: Portabilidad numérica (PA-TEC-19): por defecto No aplica (cooperativas sin numeración propia; PRM-TEC-156 = false). Si el tenant tiene numeración asignada y habilita el parámetro, la portabilidad es una operación técnica con… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.numeracion.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-43 (Numeración), PAN-TEC-63 (Portabilidad numérica).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2767 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-53-c)

<a id="API-TEC-53-d"></a>
#### API-TEC-53-d · `POST /api/admin/tec/phone/portings/{id}/accept`

- **Qué hace:** Portabilidad numérica (PA-TEC-19). 404 tec.feature.disabled si PRM-TEC-156 = false. Acepta un registro de portabilidad numérica entrante y saliente (`numberPortings`).
- **Para qué sirve:** RF-TEC-234: Portabilidad numérica (PA-TEC-19): por defecto No aplica (cooperativas sin numeración propia; PRM-TEC-156 = false). Si el tenant tiene numeración asignada y habilita el parámetro, la portabilidad es una operación técnica con… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.numeracion.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-43 (Numeración), PAN-TEC-63 (Portabilidad numérica).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2767 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-53-d)

<a id="API-TEC-53-e"></a>
#### API-TEC-53-e · `POST /api/admin/tec/phone/portings/{id}/reject`

- **Qué hace:** Portabilidad numérica (PA-TEC-19). 404 tec.feature.disabled si PRM-TEC-156 = false. Rechaza un registro de portabilidad numérica entrante y saliente (`numberPortings`).
- **Para qué sirve:** RF-TEC-234: Portabilidad numérica (PA-TEC-19): por defecto No aplica (cooperativas sin numeración propia; PRM-TEC-156 = false). Si el tenant tiene numeración asignada y habilita el parámetro, la portabilidad es una operación técnica con… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.numeracion.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-43 (Numeración), PAN-TEC-63 (Portabilidad numérica).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2767 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-53-e)

<a id="API-TEC-53-f"></a>
#### API-TEC-53-f · `POST /api/admin/tec/phone/portings/{id}/schedule`

- **Qué hace:** Portabilidad numérica (PA-TEC-19). 404 tec.feature.disabled si PRM-TEC-156 = false. Programa un registro de portabilidad numérica entrante y saliente (`numberPortings`).
- **Para qué sirve:** RF-TEC-234: Portabilidad numérica (PA-TEC-19): por defecto No aplica (cooperativas sin numeración propia; PRM-TEC-156 = false). Si el tenant tiene numeración asignada y habilita el parámetro, la portabilidad es una operación técnica con… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.numeracion.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-43 (Numeración), PAN-TEC-63 (Portabilidad numérica).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2767 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-53-f)

<a id="API-TEC-53-g"></a>
#### API-TEC-53-g · `POST /api/admin/tec/phone/portings/{id}/execute`

- **Qué hace:** Portabilidad numérica (PA-TEC-19). 404 tec.feature.disabled si PRM-TEC-156 = false. Ejecuta un registro de portabilidad numérica entrante y saliente (`numberPortings`).
- **Para qué sirve:** RF-TEC-234: Portabilidad numérica (PA-TEC-19): por defecto No aplica (cooperativas sin numeración propia; PRM-TEC-156 = false). Si el tenant tiene numeración asignada y habilita el parámetro, la portabilidad es una operación técnica con… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.numeracion.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-43 (Numeración), PAN-TEC-63 (Portabilidad numérica).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2767 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-53-g)

<a id="API-TEC-53-h"></a>
#### API-TEC-53-h · `POST /api/admin/tec/phone/portings/{id}/cancel`

- **Qué hace:** Portabilidad numérica (PA-TEC-19). 404 tec.feature.disabled si PRM-TEC-156 = false. Cancela un registro de portabilidad numérica entrante y saliente (`numberPortings`).
- **Para qué sirve:** RF-TEC-234: Portabilidad numérica (PA-TEC-19): por defecto No aplica (cooperativas sin numeración propia; PRM-TEC-156 = false). Si el tenant tiene numeración asignada y habilita el parámetro, la portabilidad es una operación técnica con… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.telefonia.numeracion.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-43 (Numeración), PAN-TEC-63 (Portabilidad numérica).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2767 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-53-h)

<a id="API-TEC-54"></a>
#### API-TEC-54 · `GET /api/admin/tec/water-quality/points`

- **Qué hace:** Calidad del agua (PA-TEC-20). Resultados solo con labReportDocumentId (T11); 404 si PRM-TEC-157 = false. Lista, con filtros y paginación, los registros de puntos de muestreo de calidad del agua con parámetros y límites (`waterSamplingPoints`).
- **Para qué sirve:** RF-TEC-235: Puntos y plan de muestreo (habilitable por concesión, PRM-TEC-157): puntos de muestreo georreferenciados vinculados a elementos de red de agua (pozo, cisterna, planta, red, conexión domiciliaria), parámetros a analizar por punto… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.calidadAgua.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de puntos de muestreo de calidad del agua con parámetros y límites (`waterSamplingPoints`) con `total`.
- **Pantallas:** PAN-TEC-64 (Calidad del agua).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2768 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-54)

<a id="API-TEC-54-b"></a>
#### API-TEC-54-b · `POST /api/admin/tec/water-quality/points`

- **Qué hace:** Calidad del agua (PA-TEC-20). Resultados solo con labReportDocumentId (T11); 404 si PRM-TEC-157 = false. Da de alta un registro de puntos de muestreo de calidad del agua con parámetros y límites (`waterSamplingPoints`).
- **Para qué sirve:** RF-TEC-235: Puntos y plan de muestreo (habilitable por concesión, PRM-TEC-157): puntos de muestreo georreferenciados vinculados a elementos de red de agua (pozo, cisterna, planta, red, conexión domiciliaria), parámetros a analizar por punto… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.calidadAgua.gestionar`.
- **Recibe:** los datos de puntos de muestreo de calidad del agua con parámetros y límites (`waterSamplingPoints`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de puntos de muestreo de calidad del agua con parámetros y límites (`waterSamplingPoints`).
- **Pantallas:** PAN-TEC-64 (Calidad del agua).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2768 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-54-b)

<a id="API-TEC-54-c"></a>
#### API-TEC-54-c · `GET /api/admin/tec/water-quality/points/{id}`

- **Qué hace:** Calidad del agua (PA-TEC-20). Resultados solo con labReportDocumentId (T11); 404 si PRM-TEC-157 = false. Obtiene el detalle de un registro de puntos de muestreo de calidad del agua con parámetros y límites (`waterSamplingPoints`).
- **Para qué sirve:** RF-TEC-235: Puntos y plan de muestreo (habilitable por concesión, PRM-TEC-157): puntos de muestreo georreferenciados vinculados a elementos de red de agua (pozo, cisterna, planta, red, conexión domiciliaria), parámetros a analizar por punto… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.calidadAgua.gestionar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de puntos de muestreo de calidad del agua con parámetros y límites (`waterSamplingPoints`).
- **Pantallas:** PAN-TEC-64 (Calidad del agua).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2768 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-54-c)

<a id="API-TEC-54-e"></a>
#### API-TEC-54-e · `DELETE /api/admin/tec/water-quality/points/{id}`

- **Qué hace:** Calidad del agua (PA-TEC-20). Resultados solo con labReportDocumentId (T11); 404 si PRM-TEC-157 = false. Elimina o da de baja un registro de puntos de muestreo de calidad del agua con parámetros y límites (`waterSamplingPoints`).
- **Para qué sirve:** RF-TEC-235: Puntos y plan de muestreo (habilitable por concesión, PRM-TEC-157): puntos de muestreo georreferenciados vinculados a elementos de red de agua (pozo, cisterna, planta, red, conexión domiciliaria), parámetros a analizar por punto… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.calidadAgua.gestionar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-TEC-64 (Calidad del agua).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2768 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-54-e)

<a id="API-TEC-54-d"></a>
#### API-TEC-54-d · `PATCH /api/admin/tec/water-quality/points/{id}`

- **Qué hace:** Calidad del agua (PA-TEC-20). Resultados solo con labReportDocumentId (T11); 404 si PRM-TEC-157 = false. Modifica algunos campos de un registro de puntos de muestreo de calidad del agua con parámetros y límites (`waterSamplingPoints`) (solo los enviados).
- **Para qué sirve:** RF-TEC-235: Puntos y plan de muestreo (habilitable por concesión, PRM-TEC-157): puntos de muestreo georreferenciados vinculados a elementos de red de agua (pozo, cisterna, planta, red, conexión domiciliaria), parámetros a analizar por punto… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.calidadAgua.gestionar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de puntos de muestreo de calidad del agua con parámetros y límites (`waterSamplingPoints`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de puntos de muestreo de calidad del agua con parámetros y límites (`waterSamplingPoints`).
- **Pantallas:** PAN-TEC-64 (Calidad del agua).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2768 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-54-d)

<a id="API-TEC-54-f"></a>
#### API-TEC-54-f · `GET /api/admin/tec/water-quality/samples`

- **Qué hace:** Calidad del agua (PA-TEC-20). Resultados solo con labReportDocumentId (T11); 404 si PRM-TEC-157 = false. Lista, con filtros y paginación, los registros de muestras (`waterSamples`).
- **Para qué sirve:** RF-TEC-235: Puntos y plan de muestreo (habilitable por concesión, PRM-TEC-157): puntos de muestreo georreferenciados vinculados a elementos de red de agua (pozo, cisterna, planta, red, conexión domiciliaria), parámetros a analizar por punto… · RF-TEC-148: Definir redes (eléctrica, agua, gas, cloacas, telecom) y los servicios que usan cada red. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.calidadAgua.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de muestras (`waterSamples`) con `total`.
- **Pantallas:** PAN-TEC-64 (Calidad del agua).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2768 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-54-f)

<a id="API-TEC-54-g"></a>
#### API-TEC-54-g · `POST /api/admin/tec/water-quality/samples`

- **Qué hace:** Calidad del agua (PA-TEC-20). Resultados solo con labReportDocumentId (T11); 404 si PRM-TEC-157 = false. Da de alta un registro de muestras (`waterSamples`).
- **Para qué sirve:** RF-TEC-235: Puntos y plan de muestreo (habilitable por concesión, PRM-TEC-157): puntos de muestreo georreferenciados vinculados a elementos de red de agua (pozo, cisterna, planta, red, conexión domiciliaria), parámetros a analizar por punto… · RF-TEC-148: Definir redes (eléctrica, agua, gas, cloacas, telecom) y los servicios que usan cada red. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.calidadAgua.gestionar`.
- **Recibe:** los datos de muestras (`waterSamples`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de muestras (`waterSamples`).
- **Pantallas:** PAN-TEC-64 (Calidad del agua).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2768 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-54-g)

<a id="API-TEC-54-h"></a>
#### API-TEC-54-h · `POST /api/admin/tec/water-quality/samples/{id}/results`

- **Qué hace:** Calidad del agua (PA-TEC-20). Resultados solo con labReportDocumentId (T11); 404 si PRM-TEC-157 = false. Agrega un elemento («results») a un registro de muestras (`waterSamples`).
- **Para qué sirve:** RF-TEC-235: Puntos y plan de muestreo (habilitable por concesión, PRM-TEC-157): puntos de muestreo georreferenciados vinculados a elementos de red de agua (pozo, cisterna, planta, red, conexión domiciliaria), parámetros a analizar por punto… · RF-TEC-148: Definir redes (eléctrica, agua, gas, cloacas, telecom) y los servicios que usan cada red. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.calidadAgua.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-64 (Calidad del agua).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2768 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-54-h)

<a id="API-TEC-54-i"></a>
#### API-TEC-54-i · `POST /api/admin/tec/water-quality/samples/{id}/corrective-action`

- **Qué hace:** Calidad del agua (PA-TEC-20). Resultados solo con labReportDocumentId (T11); 404 si PRM-TEC-157 = false. Registra «corrective-action» sobre un registro de muestras (`waterSamples`).
- **Para qué sirve:** RF-TEC-235: Puntos y plan de muestreo (habilitable por concesión, PRM-TEC-157): puntos de muestreo georreferenciados vinculados a elementos de red de agua (pozo, cisterna, planta, red, conexión domiciliaria), parámetros a analizar por punto… · RF-TEC-148: Definir redes (eléctrica, agua, gas, cloacas, telecom) y los servicios que usan cada red. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.calidadAgua.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-64 (Calidad del agua).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2768 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-54-i)

<a id="API-TEC-54-j"></a>
#### API-TEC-54-j · `POST /api/admin/tec/water-quality/samples/{id}/close`

- **Qué hace:** Calidad del agua (PA-TEC-20). Resultados solo con labReportDocumentId (T11); 404 si PRM-TEC-157 = false. Cierra un registro de muestras (`waterSamples`).
- **Para qué sirve:** RF-TEC-235: Puntos y plan de muestreo (habilitable por concesión, PRM-TEC-157): puntos de muestreo georreferenciados vinculados a elementos de red de agua (pozo, cisterna, planta, red, conexión domiciliaria), parámetros a analizar por punto… · RF-TEC-148: Definir redes (eléctrica, agua, gas, cloacas, telecom) y los servicios que usan cada red. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tec.calidadAgua.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TEC-64 (Calidad del agua).
- **Ola:** O7 · **Fuente:** M10 §11. API, línea 2768 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-54-j)

<a id="API-TEC-55"></a>
#### API-TEC-55 · `GET /api/internal/tec/contracts/{contractId}/calls`

- **Qué hace:** Llamadas atribuidas por contrato y período (RF-TEC-237). Solo lectura; destino enmascarado salvo tec.telefonia.lineas.ver, tec.telefonia.... Consulta «calls» de un registro de notas técnicas de solo agregado (`technicalNotes`).
- **Para qué sirve:** RF-TEC-237: Consulta de llamadas atribuidas por contrato y período (para el detalle de llamadas del portal, M19 API-POR-122 y PAN-POR-103, y para la atención en M09): API interna de solo lectura (API-TEC-55) que devuelve las callRecords con…
- **Quién lo usa:** Otros módulos del sistema (uso interno, no expuesto a usuarios); permiso `tec.telefonia.llamadas.ver`.
- **Recibe:** en la ruta `contractId`.
- **Devuelve:** 200: el registro de notas técnicas de solo agregado (`technicalNotes`).
- **Ola:** O10 · **Fuente:** M10 §11. API, línea 2769 · [Ver en Swagger](../18-swagger/index.html?api=m10-tec#/API/API-TEC-55)
