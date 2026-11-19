# Catálogo de endpoints · T08 · Requisitos no funcionales, seguridad, privacidad, observabilidad y calidad

Parte del [catálogo de endpoints](../18-catalogo-endpoints.md) (artefacto 7.1). Generado el 05-11-2026 con `_trabajo/gen_18_catalogo_endpoints.py` a partir de `18-openapi/`; no se edita a mano.

## Para qué sirve esta API

Fijar, con métricas y criterios verificables, cómo debe comportarse GoodApps Cooperativas en todos sus módulos y canales, de modo que el equipo (o Cursor por olas) construya desde O0 una base técnica que no haya que rehacer:

1. Rendimiento y capacidad: tiempos de respuesta por tipo de pantalla y operación, metas de procesos masivos (facturación de N suministros en un tiempo X, emisión fiscal, distribución, importaciones, sincronización offline) y aislamiento de carga entre tenants (AGR-020).
2. Disponibilidad y continuidad: objetivo de disponibilidad, ventanas de mantenimiento, RPO/RTO, copias de seguridad con restauración probada, restauración selectiva de un tenant sin retroceder a los demás y sin duplicar efectos externos (AGR-019, ESC-04).
3. Seguridad alineada a OWASP ASVS 5.0 nivel 2 (BASE §60 [SEG1]): cifrado en tránsito y en reposo, cifrado de campos sensibles con claves por tenant, bóveda y rotación, headers, CSP, CORS, rate limiting, antiautomatización, carga segura de archivos con antivirus, URLs firmadas, validación Zod, prevención de inyección NoSQL y SSRF, gestión de dependencias y de la cadena de suministro; sin repetir las…
4. Privacidad y protección de datos personales conforme a la Ley 25.326 y la normativa de la AAIP (BASE §97.1, AGR-033): finalidad, consentimientos, derechos de acceso, rectificación, actualización y supresión, conservación y borrado, anonimización, registro de tratamientos, tratamiento reforzado de datos de salud (servicios sociales M18 y datos sanitarios que alcancen a M17/M01), minimización en…
5. Auditoría, trazabilidad y observabilidad: metas sobre el registro de auditoría de T02, logs estructurados con tenantId/requestId/traceId, métricas, trazas OpenTelemetry, alertas y tableros de salud de plataforma y tenant (BASE §54).
6. Calidad: estrategia de pruebas obligatoria en CI (unitarias, integración con Mongo real, contrato, e2e Playwright, carga, seguridad, aislamiento multitenant), cobertura mínima, datos de prueba ficticios, evidencias por entrega (AGR-035), CI/CD, versionado de API.
7. Experiencia transversal: compatibilidad de navegadores y dispositivos, offline PWA, accesibilidad (referencia a T03), internacionalización es-AR (moneda, formatos, zonas horarias).
8. Exactitud: aritmética monetaria y redondeos (AGR-011), concurrencia, control optimista e idempotencia de extremo a extremo (AGR-016).

Detalle completo en el anexo T08, sección 1. Contrato navegable: [Swagger](../18-swagger/index.html?api=t08-nfr).

| Dato | Valor |
|---|---|
| Endpoints | 63 |
| Por método | GET 29, PATCH 3, POST 27, PUT 4 |
| Grupos funcionales | 1 |
| Con requisito citado en el anexo | 1 |
| Con requisito inferido (a confirmar) | 43 |
| Sin requisito identificable | 19 |

## Grupos funcionales

| Grupo | Endpoints | Qué agrupa (primeros endpoints) |
|---|---|---|
| [API](#grupo-1) | 63 | Listar registro de tratamientos.; Alta/edición con version.; Exportación asíncrona.… |

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

63 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-NFR-01](#API-NFR-01) | GET | `/api/admin/nfr/processing-activities` | Listar registro de tratamientos. |
| [API-NFR-02](#API-NFR-02) | POST | `/api/admin/nfr/processing-activities` | Alta/edición con version. |
| [API-NFR-02-b](#API-NFR-02-b) | PATCH | `/api/admin/nfr/processing-activities/{id}` | Alta/edición con version. |
| [API-NFR-03](#API-NFR-03) | POST | `/api/admin/nfr/processing-activities/export` | Exportación asíncrona. |
| [API-NFR-04](#API-NFR-04) | GET | `/api/admin/nfr/data-catalog` | Inventario de datos. |
| [API-NFR-05](#API-NFR-05) | GET | `/api/admin/nfr/privacy-notices` | Avisos y borradores. |
| [API-NFR-05-b](#API-NFR-05-b) | POST | `/api/admin/nfr/privacy-notices` | Avisos y borradores. |
| [API-NFR-06](#API-NFR-06) | POST | `/api/admin/nfr/privacy-notices/{id}/publish` | Publicar versión. |
| [API-NFR-07](#API-NFR-07) | GET | `/api/admin/nfr/consents` | Consultar consentimientos. |
| [API-NFR-08](#API-NFR-08) | POST | `/api/admin/nfr/consents/export` | Exportación auditada. |
| [API-NFR-09](#API-NFR-09) | GET | `/api/admin/nfr/data-subject-requests` | Bandeja y alta. |
| [API-NFR-09-b](#API-NFR-09-b) | POST | `/api/admin/nfr/data-subject-requests` | Bandeja y alta. |
| [API-NFR-10](#API-NFR-10) | PATCH | `/api/admin/nfr/data-subject-requests/{id}` | Verificar, analizar, decidir. |
| [API-NFR-11](#API-NFR-11) | POST | `/api/admin/nfr/data-subject-requests/{id}/approve` | Aprobar decisiones. |
| [API-NFR-12](#API-NFR-12) | POST | `/api/admin/nfr/data-subject-requests/{id}/execute` | Ejecutar (encola JOB-NFR-03) |
| [API-NFR-13](#API-NFR-13) | GET | `/api/admin/nfr/data-subject-requests/{id}/report` | URL firmada del informe. |
| [API-NFR-14](#API-NFR-14) | GET | `/api/admin/nfr/retention-policies` | Políticas de conservación. |
| [API-NFR-14-b](#API-NFR-14-b) | PUT | `/api/admin/nfr/retention-policies` | Políticas de conservación. |
| [API-NFR-15](#API-NFR-15) | POST | `/api/admin/nfr/retention-runs` | Vista previa o ejecución. |
| [API-NFR-16](#API-NFR-16) | POST | `/api/admin/nfr/retention-runs/{id}/approve` | Aprobar ejecución. |
| [API-NFR-17](#API-NFR-17) | POST | `/api/admin/nfr/legal-holds` | Proponer bloqueo. |
| [API-NFR-18](#API-NFR-18) | POST | `/api/admin/nfr/legal-holds/{id}/approve` | Transiciones. |
| [API-NFR-18-b](#API-NFR-18-b) | POST | `/api/admin/nfr/legal-holds/{id}/release` | Transiciones. |
| [API-NFR-18-c](#API-NFR-18-c) | POST | `/api/admin/nfr/legal-holds/{id}/cancel` | Transiciones. |
| [API-NFR-19](#API-NFR-19) | GET | `/api/admin/nfr/health` | Tablero de salud del tenant. |
| [API-NFR-20](#API-NFR-20) | GET | `/api/admin/nfr/incidents` | Incidentes que afectan al tenant. |
| [API-NFR-21](#API-NFR-21) | POST | `/api/admin/nfr/restore-requests` | Solicitar restauración selectiva. |
| [API-NFR-22](#API-NFR-22) | GET | `/api/admin/nfr/quotas` | Cuotas y consumo. |
| [API-NFR-23](#API-NFR-23) | GET | `/api/admin/nfr/subprocessors` | Subencargados vigentes e historial. |
| [API-NFR-24](#API-NFR-24) | GET | `/api/por/my-data` | Datos del titular autenticado. |
| [API-NFR-25](#API-NFR-25) | POST | `/api/por/my-data/requests` | Solicitud de derechos del titular. |
| [API-NFR-26](#API-NFR-26) | GET | `/api/por/consents` | Preferencias y consentimientos. |
| [API-NFR-26-b](#API-NFR-26-b) | PUT | `/api/por/consents` | Preferencias y consentimientos. |
| [API-NFR-27](#API-NFR-27) | GET | `/api/public/{tenantSlug}/privacy/notice` | Aviso vigente. |
| [API-NFR-28](#API-NFR-28) | POST | `/api/public/{tenantSlug}/privacy/requests` | Solicitud pública. |
| [API-NFR-29](#API-NFR-29) | GET | `/api/public/{tenantSlug}/doc-links/{token}` | Valida el enlace de un solo documento y redirige a URL firmada (RNF-NFR-081) |
| [API-NFR-30](#API-NFR-30) | POST | `/api/public/csp-reports` | Recepción de reportes CSP. |
| [API-NFR-31](#API-NFR-31) | GET | `/.well-known/security.txt` | Contacto de seguridad. |
| [API-NFR-32](#API-NFR-32) | GET | `/api/public/status` | Estado de la plataforma. |
| [API-NFR-33](#API-NFR-33) | GET | `/api/platform/nfr/health` | Tablero global. |
| [API-NFR-34](#API-NFR-34) | GET | `/api/platform/nfr/incidents` | Gestión de incidentes. |
| [API-NFR-34-b](#API-NFR-34-b) | POST | `/api/platform/nfr/incidents` | Gestión de incidentes. |
| [API-NFR-34-c](#API-NFR-34-c) | GET | `/api/platform/nfr/incidents/{id}` | Gestión de incidentes. |
| [API-NFR-34-d](#API-NFR-34-d) | PATCH | `/api/platform/nfr/incidents/{id}` | Gestión de incidentes. |
| [API-NFR-35](#API-NFR-35) | POST | `/api/platform/nfr/incidents/{id}/notify` | Notificar tenants afectados. |
| [API-NFR-36](#API-NFR-36) | GET | `/api/platform/nfr/restore-drills` | Simulacros y restauraciones. |
| [API-NFR-36-b](#API-NFR-36-b) | POST | `/api/platform/nfr/restore-drills` | Simulacros y restauraciones. |
| [API-NFR-37](#API-NFR-37) | GET | `/api/platform/nfr/keys` | Metadatos de claves. |
| [API-NFR-38](#API-NFR-38) | POST | `/api/platform/nfr/keys/{id}/rotate` | Rotación. |
| [API-NFR-39](#API-NFR-39) | GET | `/api/platform/nfr/alert-rules` | Reglas de alerta y SLO. |
| [API-NFR-39-b](#API-NFR-39-b) | PUT | `/api/platform/nfr/alert-rules` | Reglas de alerta y SLO. |
| [API-NFR-40](#API-NFR-40) | POST | `/api/platform/nfr/alert-events/{id}/ack` | Gestión de alertas. |
| [API-NFR-40-b](#API-NFR-40-b) | POST | `/api/platform/nfr/alert-events/{id}/silence` | Gestión de alertas. |
| [API-NFR-40-c](#API-NFR-40-c) | POST | `/api/platform/nfr/alert-events/{id}/resolve` | Gestión de alertas. |
| [API-NFR-41](#API-NFR-41) | GET | `/api/platform/nfr/quality-evidence` | Evidencias y aprobación de promoción. |
| [API-NFR-41-b](#API-NFR-41-b) | POST | `/api/platform/nfr/quality-evidence` | Evidencias y aprobación de promoción. |
| [API-NFR-41-c](#API-NFR-41-c) | POST | `/api/platform/nfr/quality-evidence/{id}/approve` | Evidencias y aprobación de promoción. |
| [API-NFR-42](#API-NFR-42) | GET | `/api/platform/nfr/csp-reports` | Reportes CSP agregados. |
| [API-NFR-43](#API-NFR-43) | GET | `/api/platform/nfr/subprocessors` | Registro de subencargados. |
| [API-NFR-43-b](#API-NFR-43-b) | PUT | `/api/platform/nfr/subprocessors` | Registro de subencargados. |
| [API-NFR-44](#API-NFR-44) | GET | `/livez` | Salud del proceso (RNF-NFR-130) |
| [API-NFR-44-b](#API-NFR-44-b) | GET | `/readyz` | Salud del proceso (RNF-NFR-130) |
| [API-NFR-44-c](#API-NFR-44-c) | GET | `/version` | Salud del proceso (RNF-NFR-130) |

<a id="API-NFR-01"></a>
#### API-NFR-01 · `GET /api/admin/nfr/processing-activities`

- **Qué hace:** Listar registro de tratamientos. Lista, con filtros y paginación, los registros de registro de tratamientos (`processingActivities`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `nfr.tratamientos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de registro de tratamientos (`processingActivities`) con `total`.
- **Pantallas:** PAN-NFR-01 (Registro de tratamientos).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1150 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-01)

<a id="API-NFR-02"></a>
#### API-NFR-02 · `POST /api/admin/nfr/processing-activities`

- **Qué hace:** Alta/edición con version. Da de alta un registro de registro de tratamientos (`processingActivities`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `nfr.tratamientos.editar`.
- **Recibe:** los datos de registro de tratamientos (`processingActivities`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de registro de tratamientos (`processingActivities`).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1151 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-02)

<a id="API-NFR-02-b"></a>
#### API-NFR-02-b · `PATCH /api/admin/nfr/processing-activities/{id}`

- **Qué hace:** Alta/edición con version. Modifica algunos campos de un registro de registro de tratamientos (`processingActivities`) (solo los enviados).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `nfr.tratamientos.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de registro de tratamientos (`processingActivities`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de registro de tratamientos (`processingActivities`).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1151 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-02-b)

<a id="API-NFR-03"></a>
#### API-NFR-03 · `POST /api/admin/nfr/processing-activities/export`

- **Qué hace:** Exportación asíncrona. Exporta sobre registro de tratamientos (`processingActivities`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `nfr.tratamientos.exportar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1152 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-03)

<a id="API-NFR-04"></a>
#### API-NFR-04 · `GET /api/admin/nfr/data-catalog`

- **Qué hace:** Inventario de datos. Consulta `data-catalog`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `nfr.inventarioDatos.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-NFR-02 (Inventario de datos por módulo/colección/campo).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1153 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-04)

<a id="API-NFR-05"></a>
#### API-NFR-05 · `GET /api/admin/nfr/privacy-notices`

- **Qué hace:** Avisos y borradores. Lista, con filtros y paginación, los registros de avisos de privacidad versionados (`privacyNotices`).
- **Para qué sirve:** RF-NFR-003: Avisos de privacidad versionados por tenant y canal (landing, registro, app, formulario presencial), con contenido mínimo del art. 6 (finalidad, destinatarios, existencia del archivo y responsable, obligatoriedad, consecuencias… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `nfr.avisos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de avisos de privacidad versionados (`privacyNotices`) con `total`.
- **Pantallas:** PAN-NFR-03 (Avisos por canal y versión).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1154 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-05)

<a id="API-NFR-05-b"></a>
#### API-NFR-05-b · `POST /api/admin/nfr/privacy-notices`

- **Qué hace:** Avisos y borradores. Da de alta un registro de avisos de privacidad versionados (`privacyNotices`).
- **Para qué sirve:** RF-NFR-003: Avisos de privacidad versionados por tenant y canal (landing, registro, app, formulario presencial), con contenido mínimo del art. 6 (finalidad, destinatarios, existencia del archivo y responsable, obligatoriedad, consecuencias… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `nfr.avisos.editar`.
- **Recibe:** los datos de avisos de privacidad versionados (`privacyNotices`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de avisos de privacidad versionados (`privacyNotices`).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1154 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-05-b)

<a id="API-NFR-06"></a>
#### API-NFR-06 · `POST /api/admin/nfr/privacy-notices/{id}/publish`

- **Qué hace:** Publicar versión. Publica un registro de avisos de privacidad versionados (`privacyNotices`).
- **Para qué sirve:** RF-NFR-003: Avisos de privacidad versionados por tenant y canal (landing, registro, app, formulario presencial), con contenido mínimo del art. 6 (finalidad, destinatarios, existencia del archivo y responsable, obligatoriedad, consecuencias… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `nfr.avisos.publicar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1155 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-06)

<a id="API-NFR-07"></a>
#### API-NFR-07 · `GET /api/admin/nfr/consents`

- **Qué hace:** Consultar consentimientos. Consulta `consents`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `nfr.consentimientos.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-NFR-04 (Consentimientos).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1156 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-07)

<a id="API-NFR-08"></a>
#### API-NFR-08 · `POST /api/admin/nfr/consents/export`

- **Qué hace:** Exportación auditada. Exporta sobre `export`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `nfr.consentimientos.exportar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1157 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-08)

<a id="API-NFR-09"></a>
#### API-NFR-09 · `GET /api/admin/nfr/data-subject-requests`

- **Qué hace:** Bandeja y alta. Lista, con filtros y paginación, los registros de solicitudes de derechos (`dataSubjectRequests`).
- **Para qué sirve:** RF-NFR-006: Bandeja de solicitudes de derechos (acceso, rectificación, actualización, supresión, oposición, revocación) con canal de ingreso (PWA, landing, presencial, correo), verificación de identidad proporcional, plazos legales visibles… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `nfr.solicitudesDerechos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de solicitudes de derechos (`dataSubjectRequests`) con `total`.
- **Pantallas:** PAN-NFR-05 (Solicitudes de derechos).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1158 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-09)

<a id="API-NFR-09-b"></a>
#### API-NFR-09-b · `POST /api/admin/nfr/data-subject-requests`

- **Qué hace:** Bandeja y alta. Da de alta un registro de solicitudes de derechos (`dataSubjectRequests`).
- **Para qué sirve:** RF-NFR-006: Bandeja de solicitudes de derechos (acceso, rectificación, actualización, supresión, oposición, revocación) con canal de ingreso (PWA, landing, presencial, correo), verificación de identidad proporcional, plazos legales visibles… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `nfr.solicitudesDerechos.crear`.
- **Recibe:** los datos de solicitudes de derechos (`dataSubjectRequests`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de solicitudes de derechos (`dataSubjectRequests`).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1158 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-09-b)

<a id="API-NFR-10"></a>
#### API-NFR-10 · `PATCH /api/admin/nfr/data-subject-requests/{id}`

- **Qué hace:** Verificar, analizar, decidir. Modifica algunos campos de un registro de solicitudes de derechos (`dataSubjectRequests`) (solo los enviados).
- **Para qué sirve:** RF-NFR-006: Bandeja de solicitudes de derechos (acceso, rectificación, actualización, supresión, oposición, revocación) con canal de ingreso (PWA, landing, presencial, correo), verificación de identidad proporcional, plazos legales visibles… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `nfr.solicitudesDerechos.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de solicitudes de derechos (`dataSubjectRequests`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de solicitudes de derechos (`dataSubjectRequests`).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1159 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-10)

<a id="API-NFR-11"></a>
#### API-NFR-11 · `POST /api/admin/nfr/data-subject-requests/{id}/approve`

- **Qué hace:** Aprobar decisiones. Aprueba un registro de solicitudes de derechos (`dataSubjectRequests`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `nfr.solicitudesDerechos.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1160 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-11)

<a id="API-NFR-12"></a>
#### API-NFR-12 · `POST /api/admin/nfr/data-subject-requests/{id}/execute`

- **Qué hace:** Ejecutar (encola JOB-NFR-03) Ejecuta un registro de solicitudes de derechos (`dataSubjectRequests`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `nfr.solicitudesDerechos.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1161 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-12)

<a id="API-NFR-13"></a>
#### API-NFR-13 · `GET /api/admin/nfr/data-subject-requests/{id}/report`

- **Qué hace:** URL firmada del informe. Lista, con filtros y paginación, los registros de reportes CSP; TTL (`cspReports`).
- **Para qué sirve:** RF-NFR-012: Portal "Mis datos y privacidad" del socio/empleado: ver datos, descargar informe, pedir rectificación, revocar consentimientos, ver avisos aceptados y estado de solicitudes. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `nfr.solicitudesDerechos.ver`.
- **Recibe:** en la ruta `id`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de reportes CSP; TTL (`cspReports`) con `total`.
- **Pantallas:** PAN-NFR-05 (Solicitudes de derechos).
- **Ola:** O0 · **Fuente:** T08 §15.4 API, línea 1162 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-13)

<a id="API-NFR-14"></a>
#### API-NFR-14 · `GET /api/admin/nfr/retention-policies`

- **Qué hace:** Políticas de conservación. Lista, con filtros y paginación, los registros de políticas de retención (`retentionPolicies`).
- **Para qué sirve:** RF-NFR-009: Políticas de conservación por categoría de dato y tipo de documento, parametrizables por tenant dentro de mínimos y máximos de plataforma, con job diario de aplicación (nfr:aplicar-conservacion) y reporte previo de impacto. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `nfr.conservacion.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de políticas de retención (`retentionPolicies`) con `total`.
- **Pantallas:** PAN-NFR-06 (Políticas de conservación).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1163 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-14)

<a id="API-NFR-14-b"></a>
#### API-NFR-14-b · `PUT /api/admin/nfr/retention-policies`

- **Qué hace:** Políticas de conservación. Reemplaza o configura políticas de retención (`retentionPolicies`).
- **Para qué sirve:** RF-NFR-009: Políticas de conservación por categoría de dato y tipo de documento, parametrizables por tenant dentro de mínimos y máximos de plataforma, con job diario de aplicación (nfr:aplicar-conservacion) y reporte previo de impacto. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `nfr.conservacion.configurar`.
- **Recibe:** los datos de políticas de retención (`retentionPolicies`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de políticas de retención (`retentionPolicies`).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1163 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-14-b)

<a id="API-NFR-15"></a>
#### API-NFR-15 · `POST /api/admin/nfr/retention-runs`

- **Qué hace:** Vista previa o ejecución. Da de alta un registro de corridas de supresión (`retentionRuns`).
- **Para qué sirve:** RF-NFR-008: Supresión compatible con obligaciones de conservación: si hay bloqueo legal o plazo vigente, se bloquea el tratamiento (solo consulta para la obligación) y se programa la supresión o anonimización al vencer; si no, se suprime o… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `nfr.conservacion.configurar`.
- **Recibe:** los datos de corridas de supresión (`retentionRuns`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de corridas de supresión (`retentionRuns`).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1164 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-15)

<a id="API-NFR-16"></a>
#### API-NFR-16 · `POST /api/admin/nfr/retention-runs/{id}/approve`

- **Qué hace:** Aprobar ejecución. Aprueba un registro de corridas de supresión (`retentionRuns`).
- **Para qué sirve:** RF-NFR-008: Supresión compatible con obligaciones de conservación: si hay bloqueo legal o plazo vigente, se bloquea el tratamiento (solo consulta para la obligación) y se programa la supresión o anonimización al vencer; si no, se suprime o… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `nfr.anonimizacion.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1165 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-16)

<a id="API-NFR-17"></a>
#### API-NFR-17 · `POST /api/admin/nfr/legal-holds`

- **Qué hace:** Proponer bloqueo. Da de alta un registro de retenciones legales (`legalHolds`).
- **Para qué sirve:** RF-NFR-010: Bloqueos legales (litigio, requerimiento judicial o administrativo, auditoría fiscal) sobre titular, cuenta, documento o período, con motivo, responsable, vigencia y aprobación a dos firmas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `nfr.bloqueosLegales.crear`.
- **Recibe:** los datos de retenciones legales (`legalHolds`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de retenciones legales (`legalHolds`).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1166 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-17)

<a id="API-NFR-18"></a>
#### API-NFR-18 · `POST /api/admin/nfr/legal-holds/{id}/approve`

- **Qué hace:** Transiciones. Aprueba un registro de retenciones legales (`legalHolds`).
- **Para qué sirve:** RF-NFR-010: Bloqueos legales (litigio, requerimiento judicial o administrativo, auditoría fiscal) sobre titular, cuenta, documento o período, con motivo, responsable, vigencia y aprobación a dos firmas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `nfr.bloqueosLegales.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1167 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-18)

<a id="API-NFR-18-b"></a>
#### API-NFR-18-b · `POST /api/admin/nfr/legal-holds/{id}/release`

- **Qué hace:** Transiciones. Libera un registro de retenciones legales (`legalHolds`).
- **Para qué sirve:** RF-NFR-010: Bloqueos legales (litigio, requerimiento judicial o administrativo, auditoría fiscal) sobre titular, cuenta, documento o período, con motivo, responsable, vigencia y aprobación a dos firmas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `nfr.bloqueosLegales.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1167 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-18-b)

<a id="API-NFR-18-c"></a>
#### API-NFR-18-c · `POST /api/admin/nfr/legal-holds/{id}/cancel`

- **Qué hace:** Transiciones. Cancela un registro de retenciones legales (`legalHolds`).
- **Para qué sirve:** RF-NFR-010: Bloqueos legales (litigio, requerimiento judicial o administrativo, auditoría fiscal) sobre titular, cuenta, documento o período, con motivo, responsable, vigencia y aprobación a dos firmas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `nfr.bloqueosLegales.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1167 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-18-c)

<a id="API-NFR-19"></a>
#### API-NFR-19 · `GET /api/admin/nfr/health`

- **Qué hace:** Tablero de salud del tenant. Lista, con filtros y paginación, los registros de `health`.
- **Para qué sirve:** RF-NFR-016: Tablero de salud de plataforma: disponibilidad por servicio, latencias, errores, colas, jobs, integraciones, backups, certificados próximos a vencer, alertas activas, consumo por tenant. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `nfr.salud.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ResultadoGenerico (`ResultadoGenerico`) con `total`.
- **Pantallas:** PAN-NFR-07 (Tablero de salud del tenant).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1168 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-19)

<a id="API-NFR-20"></a>
#### API-NFR-20 · `GET /api/admin/nfr/incidents`

- **Qué hace:** Incidentes que afectan al tenant. Lista, con filtros y paginación, los registros de incidentes de seguridad y privacidad (`securityIncidents`).
- **Para qué sirve:** RF-NFR-014: Registro y gestión de incidentes de seguridad y de datos personales: detección, clasificación, contención, evaluación de datos afectados por tenant, notificación al tenant, soporte a la notificación a titulares/AAIP, lecciones y… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `nfr.incidentes.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de incidentes de seguridad y privacidad (`securityIncidents`) con `total`.
- **Pantallas:** PAN-NFR-08 (Incidentes de plataforma), PAN-NFR-12 (Gestión de incidentes de plataforma).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1169 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-20)

<a id="API-NFR-21"></a>
#### API-NFR-21 · `POST /api/admin/nfr/restore-requests`

- **Qué hace:** Solicitar restauración selectiva. Registra un nuevo elemento u operación en `restore-requests`.
- **Para qué sirve:** RF-NFR-005: Separación de comunicaciones institucionales/transaccionales (factura, vencimiento, corte, reclamo) y promocionales; las promocionales exigen consentimiento u oposición respetada y consulta del Registro Nacional "No Llame" para…
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `nfr.restauracion.solicitar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** T08 §15.4 API, línea 1170 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-21)

<a id="API-NFR-22"></a>
#### API-NFR-22 · `GET /api/admin/nfr/quotas`

- **Qué hace:** Cuotas y consumo. Consulta `quotas`.
- **Para qué sirve:** RF-NFR-017: Tablero de salud del tenant: estado de procesos (lotes, emisión fiscal, cobranzas, sincronizaciones), integraciones (último éxito, errores, credenciales por vencer), cuotas consumidas e incidentes de plataforma que lo afectan. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `nfr.salud.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-NFR-07 (Tablero de salud del tenant).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1171 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-22)

<a id="API-NFR-23"></a>
#### API-NFR-23 · `GET /api/admin/nfr/subprocessors`

- **Qué hace:** Subencargados vigentes e historial. Lista, con filtros y paginación, los registros de registro público de subencargados (`subprocessors`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `nfr.tratamientos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de registro público de subencargados (`subprocessors`) con `total`.
- **Pantallas:** PAN-NFR-01 (Registro de tratamientos).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1172 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-23)

<a id="API-NFR-24"></a>
#### API-NFR-24 · `GET /api/por/my-data`

- **Qué hace:** Datos del titular autenticado. Consulta `my-data`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.misDatos.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-NFR-09 (Mis datos y privacidad).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1173 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-24)

<a id="API-NFR-25"></a>
#### API-NFR-25 · `POST /api/por/my-data/requests`

- **Qué hace:** Solicitud de derechos del titular. Da de alta un registro de solicitudes de derechos (`dataSubjectRequests`).
- **Para qué sirve:** RF-NFR-006: Bandeja de solicitudes de derechos (acceso, rectificación, actualización, supresión, oposición, revocación) con canal de ingreso (PWA, landing, presencial, correo), verificación de identidad proporcional, plazos legales visibles… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.misDatos.solicitar`.
- **Recibe:** los datos de solicitudes de derechos (`dataSubjectRequests`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de solicitudes de derechos (`dataSubjectRequests`).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1174 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-25)

<a id="API-NFR-26"></a>
#### API-NFR-26 · `GET /api/por/consents`

- **Qué hace:** Preferencias y consentimientos. Consulta `consents`.
- **Para qué sirve:** RF-NFR-004: Registro de consentimientos y preferencias: titular, finalidad, versión del aviso, canal, fecha, evidencia (IP truncada, agente de usuario, firma o formulario escaneado), estado (otorgado, revocado, vencido), revocación en un… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.consentimientos.editar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1175 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-26)

<a id="API-NFR-26-b"></a>
#### API-NFR-26-b · `PUT /api/por/consents`

- **Qué hace:** Preferencias y consentimientos. Reemplaza o configura `consents`.
- **Para qué sirve:** RF-NFR-004: Registro de consentimientos y preferencias: titular, finalidad, versión del aviso, canal, fecha, evidencia (IP truncada, agente de usuario, firma o formulario escaneado), estado (otorgado, revocado, vencido), revocación en un… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `por.consentimientos.editar`.
- **Recibe:** un cuerpo JSON cuya estructura detalla el anexo; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1175 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-26-b)

<a id="API-NFR-27"></a>
#### API-NFR-27 · `GET /api/public/{tenantSlug}/privacy/notice`

- **Qué hace:** Aviso vigente. Consulta `notice`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1176 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-27)

<a id="API-NFR-28"></a>
#### API-NFR-28 · `POST /api/public/{tenantSlug}/privacy/requests`

- **Qué hace:** Solicitud pública. Da de alta un registro de solicitudes de derechos (`dataSubjectRequests`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`; los datos de solicitudes de derechos (`dataSubjectRequests`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de solicitudes de derechos (`dataSubjectRequests`).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1177 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-28)

<a id="API-NFR-29"></a>
#### API-NFR-29 · `GET /api/public/{tenantSlug}/doc-links/{token}`

- **Qué hace:** Valida el enlace de un solo documento y redirige a URL firmada (RNF-NFR-081) Obtiene el detalle de un registro de `doc-links`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`, `token`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1178 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-29)

<a id="API-NFR-30"></a>
#### API-NFR-30 · `POST /api/public/csp-reports`

- **Qué hace:** Recepción de reportes CSP. Da de alta un registro de reportes CSP; TTL (`cspReports`).
- **Para qué sirve:** RF-NFR-020: Recepción de reportes CSP y de violaciones de seguridad del navegador (report-to), agregados y deduplicados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** los datos de reportes CSP; TTL (`cspReports`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de reportes CSP; TTL (`cspReports`).
- **Ola:** O0 · **Fuente:** T08 §15.4 API, línea 1179 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-30)

<a id="API-NFR-31"></a>
#### API-NFR-31 · `GET /.well-known/security.txt`

- **Qué hace:** Contacto de seguridad. Descarga un archivo de `security.txt`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Monitoreo e infraestructura; acceso según el anexo: «public: true».
- **Recibe:** nada.
- **Devuelve:** 200: un archivo (text/plain).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1180 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-31)

<a id="API-NFR-32"></a>
#### API-NFR-32 · `GET /api/public/status`

- **Qué hace:** Estado de la plataforma. Consulta `status`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1181 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-32)

<a id="API-NFR-33"></a>
#### API-NFR-33 · `GET /api/platform/nfr/health`

- **Qué hace:** Tablero global. Lista, con filtros y paginación, los registros de `health`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `nfr.saludPlataforma.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ResultadoGenerico (`ResultadoGenerico`) con `total`.
- **Pantallas:** PAN-NFR-11 (Tablero de salud global).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1182 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-33)

<a id="API-NFR-34"></a>
#### API-NFR-34 · `GET /api/platform/nfr/incidents`

- **Qué hace:** Gestión de incidentes. Lista, con filtros y paginación, los registros de incidentes de seguridad y privacidad (`securityIncidents`).
- **Para qué sirve:** RF-NFR-014: Registro y gestión de incidentes de seguridad y de datos personales: detección, clasificación, contención, evaluación de datos afectados por tenant, notificación al tenant, soporte a la notificación a titulares/AAIP, lecciones y… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `nfr.incidentes.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de incidentes de seguridad y privacidad (`securityIncidents`) con `total`.
- **Pantallas:** PAN-NFR-08 (Incidentes de plataforma), PAN-NFR-12 (Gestión de incidentes de plataforma).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1183 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-34)

<a id="API-NFR-34-b"></a>
#### API-NFR-34-b · `POST /api/platform/nfr/incidents`

- **Qué hace:** Gestión de incidentes. Da de alta un registro de incidentes de seguridad y privacidad (`securityIncidents`).
- **Para qué sirve:** RF-NFR-014: Registro y gestión de incidentes de seguridad y de datos personales: detección, clasificación, contención, evaluación de datos afectados por tenant, notificación al tenant, soporte a la notificación a titulares/AAIP, lecciones y… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `nfr.incidentes.gestionar`.
- **Recibe:** los datos de incidentes de seguridad y privacidad (`securityIncidents`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de incidentes de seguridad y privacidad (`securityIncidents`).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1183 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-34-b)

<a id="API-NFR-34-c"></a>
#### API-NFR-34-c · `GET /api/platform/nfr/incidents/{id}`

- **Qué hace:** Gestión de incidentes. Obtiene el detalle de un registro de incidentes de seguridad y privacidad (`securityIncidents`).
- **Para qué sirve:** RF-NFR-014: Registro y gestión de incidentes de seguridad y de datos personales: detección, clasificación, contención, evaluación de datos afectados por tenant, notificación al tenant, soporte a la notificación a titulares/AAIP, lecciones y… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `nfr.incidentes.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de incidentes de seguridad y privacidad (`securityIncidents`).
- **Pantallas:** PAN-NFR-08 (Incidentes de plataforma), PAN-NFR-12 (Gestión de incidentes de plataforma).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1183 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-34-c)

<a id="API-NFR-34-d"></a>
#### API-NFR-34-d · `PATCH /api/platform/nfr/incidents/{id}`

- **Qué hace:** Gestión de incidentes. Modifica algunos campos de un registro de incidentes de seguridad y privacidad (`securityIncidents`) (solo los enviados).
- **Para qué sirve:** RF-NFR-014: Registro y gestión de incidentes de seguridad y de datos personales: detección, clasificación, contención, evaluación de datos afectados por tenant, notificación al tenant, soporte a la notificación a titulares/AAIP, lecciones y… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `nfr.incidentes.gestionar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de incidentes de seguridad y privacidad (`securityIncidents`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de incidentes de seguridad y privacidad (`securityIncidents`).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1183 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-34-d)

<a id="API-NFR-35"></a>
#### API-NFR-35 · `POST /api/platform/nfr/incidents/{id}/notify`

- **Qué hace:** Notificar tenants afectados. Notifica un registro de incidentes de seguridad y privacidad (`securityIncidents`).
- **Para qué sirve:** RF-NFR-014: Registro y gestión de incidentes de seguridad y de datos personales: detección, clasificación, contención, evaluación de datos afectados por tenant, notificación al tenant, soporte a la notificación a titulares/AAIP, lecciones y… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `nfr.incidentes.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1184 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-35)

<a id="API-NFR-36"></a>
#### API-NFR-36 · `GET /api/platform/nfr/restore-drills`

- **Qué hace:** Simulacros y restauraciones. Consulta `restore-drills`.
- **Para qué sirve:** RF-NFR-015: Simulacros de restauración: plan, ejecución, mediciones (RPO real, RTO real), verificación de integridad y conciliación externa, acta. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `nfr.restauracion.ejecutar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-NFR-13 (Continuidad: backups, simulacros y runbooks).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1185 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-36)

<a id="API-NFR-36-b"></a>
#### API-NFR-36-b · `POST /api/platform/nfr/restore-drills`

- **Qué hace:** Simulacros y restauraciones. Registra un nuevo elemento u operación en `restore-drills`.
- **Para qué sirve:** RF-NFR-015: Simulacros de restauración: plan, ejecución, mediciones (RPO real, RTO real), verificación de integridad y conciliación externa, acta. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `nfr.restauracion.ejecutar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-NFR-13 (Continuidad: backups, simulacros y runbooks).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1185 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-36-b)

<a id="API-NFR-37"></a>
#### API-NFR-37 · `GET /api/platform/nfr/keys`

- **Qué hace:** Metadatos de claves. Lista, con filtros y paginación, los registros de DEK envueltas por categoría y tenant (`encryptionKeys`).
- **Para qué sirve:** RF-NFR-023: Consola de claves: listado de claves de cifrado y firma (metadatos, nunca material), fecha de creación, próxima rotación, estado, y rotación manual con doble aprobación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `nfr.claves.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de DEK envueltas por categoría y tenant (`encryptionKeys`) con `total`.
- **Pantallas:** PAN-NFR-14 (Gestión de claves).
- **Ola:** O0 · **Fuente:** T08 §15.4 API, línea 1186 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-37)

<a id="API-NFR-38"></a>
#### API-NFR-38 · `POST /api/platform/nfr/keys/{id}/rotate`

- **Qué hace:** Rotación. Rota las credenciales de un registro de DEK envueltas por categoría y tenant (`encryptionKeys`).
- **Para qué sirve:** RF-NFR-023: Consola de claves: listado de claves de cifrado y firma (metadatos, nunca material), fecha de creación, próxima rotación, estado, y rotación manual con doble aprobación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `nfr.claves.rotar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T08 §15.4 API, línea 1187 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-38)

<a id="API-NFR-39"></a>
#### API-NFR-39 · `GET /api/platform/nfr/alert-rules`

- **Qué hace:** Reglas de alerta y SLO. Consulta `alert-rules`.
- **Para qué sirve:** RF-NFR-018: Reglas de alerta técnica configurables (condición, severidad, destinatarios, deduplicación, reconocimiento, resolución, vínculo al objeto). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `nfr.alertas.configurar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-NFR-15 (Reglas de alerta y SLO).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1188 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-39)

<a id="API-NFR-39-b"></a>
#### API-NFR-39-b · `PUT /api/platform/nfr/alert-rules`

- **Qué hace:** Reglas de alerta y SLO. Reemplaza o configura `alert-rules`.
- **Para qué sirve:** RF-NFR-018: Reglas de alerta técnica configurables (condición, severidad, destinatarios, deduplicación, reconocimiento, resolución, vínculo al objeto). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `nfr.alertas.configurar`.
- **Recibe:** un cuerpo JSON cuya estructura detalla el anexo; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-NFR-15 (Reglas de alerta y SLO).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1188 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-39-b)

<a id="API-NFR-40"></a>
#### API-NFR-40 · `POST /api/platform/nfr/alert-events/{id}/ack`

- **Qué hace:** Gestión de alertas. Toma conocimiento de un registro de `ack`.
- **Para qué sirve:** RF-NFR-018: Reglas de alerta técnica configurables (condición, severidad, destinatarios, deduplicación, reconocimiento, resolución, vínculo al objeto). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `nfr.alertas.reconocer`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1189 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-40)

<a id="API-NFR-40-b"></a>
#### API-NFR-40-b · `POST /api/platform/nfr/alert-events/{id}/silence`

- **Qué hace:** Gestión de alertas. Silencia un registro de `silence`.
- **Para qué sirve:** RF-NFR-018: Reglas de alerta técnica configurables (condición, severidad, destinatarios, deduplicación, reconocimiento, resolución, vínculo al objeto). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `nfr.alertas.reconocer`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1189 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-40-b)

<a id="API-NFR-40-c"></a>
#### API-NFR-40-c · `POST /api/platform/nfr/alert-events/{id}/resolve`

- **Qué hace:** Gestión de alertas. Resuelve un registro de `resolve`.
- **Para qué sirve:** RF-NFR-018: Reglas de alerta técnica configurables (condición, severidad, destinatarios, deduplicación, reconocimiento, resolución, vínculo al objeto). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `nfr.alertas.reconocer`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1189 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-40-c)

<a id="API-NFR-41"></a>
#### API-NFR-41 · `GET /api/platform/nfr/quality-evidence`

- **Qué hace:** Evidencias y aprobación de promoción. Lista, con filtros y paginación, los registros de evidencias de calidad por ola (`qualityEvidence`).
- **Para qué sirve:** RF-NFR-022: Evidencia de liberación por versión: resultados de pruebas, cobertura, SCA, SAST, DAST, imágenes escaneadas, SBOM, pruebas de carga cuando corresponda y aprobaciones. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `nfr.evidencias.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de evidencias de calidad por ola (`qualityEvidence`) con `total`.
- **Pantallas:** PAN-NFR-16 (Evidencias por versión).
- **Ola:** O0 · **Fuente:** T08 §15.4 API, línea 1190 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-41)

<a id="API-NFR-41-b"></a>
#### API-NFR-41-b · `POST /api/platform/nfr/quality-evidence`

- **Qué hace:** Evidencias y aprobación de promoción. Da de alta un registro de evidencias de calidad por ola (`qualityEvidence`).
- **Para qué sirve:** RF-NFR-022: Evidencia de liberación por versión: resultados de pruebas, cobertura, SCA, SAST, DAST, imágenes escaneadas, SBOM, pruebas de carga cuando corresponda y aprobaciones. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `nfr.evidencias.aprobar`.
- **Recibe:** los datos de evidencias de calidad por ola (`qualityEvidence`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de evidencias de calidad por ola (`qualityEvidence`).
- **Ola:** O0 · **Fuente:** T08 §15.4 API, línea 1190 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-41-b)

<a id="API-NFR-41-c"></a>
#### API-NFR-41-c · `POST /api/platform/nfr/quality-evidence/{id}/approve`

- **Qué hace:** Evidencias y aprobación de promoción. Aprueba un registro de evidencias de calidad por ola (`qualityEvidence`).
- **Para qué sirve:** RF-NFR-022: Evidencia de liberación por versión: resultados de pruebas, cobertura, SCA, SAST, DAST, imágenes escaneadas, SBOM, pruebas de carga cuando corresponda y aprobaciones. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `nfr.evidencias.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T08 §15.4 API, línea 1190 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-41-c)

<a id="API-NFR-42"></a>
#### API-NFR-42 · `GET /api/platform/nfr/csp-reports`

- **Qué hace:** Reportes CSP agregados. Lista, con filtros y paginación, los registros de reportes CSP; TTL (`cspReports`).
- **Para qué sirve:** RF-NFR-020: Recepción de reportes CSP y de violaciones de seguridad del navegador (report-to), agregados y deduplicados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `nfr.cspReportes.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de reportes CSP; TTL (`cspReports`) con `total`.
- **Ola:** O0 · **Fuente:** T08 §15.4 API, línea 1191 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-42)

<a id="API-NFR-43"></a>
#### API-NFR-43 · `GET /api/platform/nfr/subprocessors`

- **Qué hace:** Registro de subencargados. Lista, con filtros y paginación, los registros de registro público de subencargados (`subprocessors`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `nfr.subencargados.editar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de registro público de subencargados (`subprocessors`) con `total`.
- **Pantallas:** PAN-NFR-17 (Registro de subencargados y avisos a tenants).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1192 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-43)

<a id="API-NFR-43-b"></a>
#### API-NFR-43-b · `PUT /api/platform/nfr/subprocessors`

- **Qué hace:** Registro de subencargados. Reemplaza o configura registro público de subencargados (`subprocessors`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `nfr.subencargados.editar`.
- **Recibe:** los datos de registro público de subencargados (`subprocessors`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de registro público de subencargados (`subprocessors`).
- **Pantallas:** PAN-NFR-17 (Registro de subencargados y avisos a tenants).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1192 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-43-b)

<a id="API-NFR-44"></a>
#### API-NFR-44 · `GET /livez`

- **Qué hace:** Salud del proceso (RNF-NFR-130) Consulta `livez`.
- **Para qué sirve:** RF-NFR-017: Tablero de salud del tenant: estado de procesos (lotes, emisión fiscal, cobranzas, sincronizaciones), integraciones (último éxito, errores, credenciales por vencer), cuotas consumidas e incidentes de plataforma que lo afectan. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Monitoreo e infraestructura; permiso `pla.salud.sondear`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1193 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-44)

<a id="API-NFR-44-b"></a>
#### API-NFR-44-b · `GET /readyz`

- **Qué hace:** Salud del proceso (RNF-NFR-130) Consulta `readyz`.
- **Para qué sirve:** RF-NFR-017: Tablero de salud del tenant: estado de procesos (lotes, emisión fiscal, cobranzas, sincronizaciones), integraciones (último éxito, errores, credenciales por vencer), cuotas consumidas e incidentes de plataforma que lo afectan. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Monitoreo e infraestructura; permiso `pla.salud.sondear`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1193 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-44-b)

<a id="API-NFR-44-c"></a>
#### API-NFR-44-c · `GET /version`

- **Qué hace:** Salud del proceso (RNF-NFR-130) Consulta `version`.
- **Para qué sirve:** RF-NFR-017: Tablero de salud del tenant: estado de procesos (lotes, emisión fiscal, cobranzas, sincronizaciones), integraciones (último éxito, errores, credenciales por vencer), cuotas consumidas e incidentes de plataforma que lo afectan. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Monitoreo e infraestructura; permiso `pla.salud.sondear`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T08 §15.4 API, línea 1193 · [Ver en Swagger](../18-swagger/index.html?api=t08-nfr#/API/API-NFR-44-c)
