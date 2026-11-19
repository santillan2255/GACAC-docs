# Catálogo de endpoints · T10 · Reportes, BI, tableros, exportaciones y APIs para terceros

Parte del [catálogo de endpoints](../18-catalogo-endpoints.md) (artefacto 7.1). Generado el 05-11-2026 con `_trabajo/gen_18_catalogo_endpoints.py` a partir de `18-openapi/`; no se edita a mano.

## Para qué sirve esta API

Dar a cada cooperativa (tenant), a la plataforma y a terceros autorizados una capa única, gobernada y reproducible de consulta y explotación de datos, que reemplace y mejore todo lo que ProCoop ofrece en "Informes", "Reportes", "Tablero de Control", "Editor de Reportes", "Informes Personalizados", "Exportador", "Tablas Power BI" e "Integra":

1. Un motor de reportes con catálogo, parámetros tipados, filtros, permisos por capability y alcance de datos, ejecución síncrona o asíncrona, salida en pantalla y exportación XLSX/CSV/PDF/archivo plano generada en workers BullMQ y descargada por URL firmada.
2. Un catálogo completo de reportes (REP-<MOD>-NNN) que cubre cada listado/informe de ProCoop y cada reporte exigido por la BASE, con su módulo dueño, propósito, parámetros y columnas principales.
3. Reportes programados por email, presets y vistas guardadas, y un generador de reportes del tenant (MER-013) que trabaja sólo sobre datos semánticos certificados, sin SQL libre.
4. Tableros por rol (plataforma, gerencia, facturación, cobranzas, mora, técnica, atención, compras, tesorería, contabilidad, RRHH, institucional) construidos sobre un catálogo de indicadores con definición exacta (fórmula, universo, estado incluido, fecha de corte, granularidad, frescura y permiso de detalle, AGR-022), con alertas y llegada al detalle.
5. Un almacén analítico aislado por tenant (proyecciones de lectura alimentadas por eventos), salas BI con patrón CNX "cubo certificado primero, IA después", IA analítica en lenguaje natural que respeta permisos y nunca inventa números, y benchmarking anónimo opcional entre cooperativas.
6. La API pública /api/v1/ext para terceros (BI propio, municipios, bots, federaciones, sistemas de la cooperativa): clientes por tenant, OAuth 2.0 client credentials y API key, scopes, rate limit, versionado, OpenAPI, extracción incremental, exportaciones masivas, webhooks salientes firmados y catálogo explícito de recursos (BASE §59: "el tenant debe disponer de sus datos").
7. Datos abiertos y regulatorios: publicación opcional de conjuntos agregados en la landing y referencia del catálogo de informes oficiales cuyo formato es propiedad de M06/M15/M16/M17 (MER-014).

Detalle completo en el anexo T10, sección 1. Contrato navegable: [Swagger](../18-swagger/index.html?api=t10-bia).

| Dato | Valor |
|---|---|
| Endpoints | 136 |
| Por método | DELETE 3, GET 56, PATCH 15, POST 60, PUT 2 |
| Grupos funcionales | 1 |
| Con requisito citado en el anexo | 0 |
| Con requisito inferido (a confirmar) | 136 |
| Sin requisito identificable | 0 |

## Grupos funcionales

| Grupo | Endpoints | Qué agrupa (primeros endpoints) |
|---|---|---|
| [API interna (admin, PWA, plataforma, pública)](#grupo-1) | 136 | Catálogo filtrado por permisos…; Ficha: parámetros (esquema JSON derivado de Zod), columnas…; Ejecuta; 200 con primera página (sync) o 202 con runId…… |

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

## API interna (admin, PWA, plataforma, pública)

136 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-BIA-01](#API-BIA-01) | GET | `/api/admin/bia/reports` | Catálogo filtrado por permisos; ?q=&module=&cluster=&origin=&favorite=. |
| [API-BIA-02](#API-BIA-02) | GET | `/api/admin/bia/reports/{code}` | Ficha: parámetros (esquema JSON derivado de Zod), columnas, salidas, ayuda, versión. |
| [API-BIA-03](#API-BIA-03) | POST | `/api/admin/bia/reports/{code}/runs` | Ejecuta; 200 con primera página (sync) o 202 con runId (async) |
| [API-BIA-04](#API-BIA-04) | GET | `/api/admin/bia/runs` | Mis corridas (todas con bia.exportaciones.administrar) |
| [API-BIA-05](#API-BIA-05) | GET | `/api/admin/bia/runs/{id}` | Estado, progreso, metadatos, totales. |
| [API-BIA-06](#API-BIA-06) | GET | `/api/admin/bia/runs/{id}/rows` | Página del resultado ?page=&size=&sort=&groupBy=. |
| [API-BIA-07](#API-BIA-07) | GET | `/api/admin/bia/runs/{id}/drill` | Filas componentes de un total/celda ?cell=. |
| [API-BIA-08](#API-BIA-08) | POST | `/api/admin/bia/runs/{id}/cancel` | Cancela. |
| [API-BIA-09](#API-BIA-09) | POST | `/api/admin/bia/runs/{id}/retry` | Crea corrida nueva con mismos parámetros. |
| [API-BIA-10](#API-BIA-10) | POST | `/api/admin/bia/runs/{id}/selection` | Genera selectionToken con IDs seleccionados para el módulo dueño. |
| [API-BIA-11](#API-BIA-11) | POST | `/api/admin/bia/runs/{id}/exports` | Exporta {format, csvDialect, layoutId, columns}. |
| [API-BIA-12](#API-BIA-12) | POST | `/api/admin/bia/table-exports` | Exporta una grilla {screenKey, filters, columns, format} re-ejecutando su consulta. |
| [API-BIA-13](#API-BIA-13) | GET | `/api/admin/bia/exports` | Mis exportaciones. |
| [API-BIA-14](#API-BIA-14) | GET | `/api/admin/bia/exports/{id}/download` | 302 a URL firmada de PRM-BIA-007 min; registra descarga. |
| [API-BIA-15](#API-BIA-15) | POST | `/api/admin/bia/exports/{id}/cancel` | Cancela. |
| [API-BIA-16](#API-BIA-16) | GET | `/api/admin/bia/presets` | Presets. |
| [API-BIA-16-b](#API-BIA-16-b) | POST | `/api/admin/bia/presets` | Presets. |
| [API-BIA-16-c](#API-BIA-16-c) | GET | `/api/admin/bia/presets/{id}` | Presets. |
| [API-BIA-16-e](#API-BIA-16-e) | DELETE | `/api/admin/bia/presets/{id}` | Presets. |
| [API-BIA-16-d](#API-BIA-16-d) | PATCH | `/api/admin/bia/presets/{id}` | Presets. |
| [API-BIA-17](#API-BIA-17) | GET | `/api/admin/bia/saved-views` | Vistas guardadas de DataTable ?screenKey=. |
| [API-BIA-17-b](#API-BIA-17-b) | POST | `/api/admin/bia/saved-views` | Vistas guardadas de DataTable ?screenKey=. |
| [API-BIA-17-c](#API-BIA-17-c) | GET | `/api/admin/bia/saved-views/{id}` | Vistas guardadas de DataTable ?screenKey=. |
| [API-BIA-17-e](#API-BIA-17-e) | DELETE | `/api/admin/bia/saved-views/{id}` | Vistas guardadas de DataTable ?screenKey=. |
| [API-BIA-17-d](#API-BIA-17-d) | PATCH | `/api/admin/bia/saved-views/{id}` | Vistas guardadas de DataTable ?screenKey=. |
| [API-BIA-18](#API-BIA-18) | GET | `/api/admin/bia/schedules` | Programaciones. |
| [API-BIA-18-b](#API-BIA-18-b) | POST | `/api/admin/bia/schedules` | Programaciones. |
| [API-BIA-18-c](#API-BIA-18-c) | GET | `/api/admin/bia/schedules/{id}` | Programaciones. |
| [API-BIA-18-d](#API-BIA-18-d) | PATCH | `/api/admin/bia/schedules/{id}` | Programaciones. |
| [API-BIA-19](#API-BIA-19) | POST | `/api/admin/bia/schedules/{id}/pause` | Transiciones §8.4. |
| [API-BIA-19-b](#API-BIA-19-b) | POST | `/api/admin/bia/schedules/{id}/resume` | Transiciones §8.4. |
| [API-BIA-19-c](#API-BIA-19-c) | POST | `/api/admin/bia/schedules/{id}/run-now` | Transiciones §8.4. |
| [API-BIA-19-d](#API-BIA-19-d) | POST | `/api/admin/bia/schedules/{id}/disable` | Transiciones §8.4. |
| [API-BIA-20](#API-BIA-20) | GET | `/api/admin/bia/schedules/{id}/deliveries` | Historial de entregas. |
| [API-BIA-21](#API-BIA-21) | GET | `/api/admin/bia/report-settings/{code}` | Ocultar, renombrar, plantilla y preset por defecto. |
| [API-BIA-21-b](#API-BIA-21-b) | PATCH | `/api/admin/bia/report-settings/{code}` | Ocultar, renombrar, plantilla y preset por defecto. |
| [API-BIA-22](#API-BIA-22) | GET | `/api/admin/bia/templates` | Plantillas PDF; POST /:id/preview con datos ficticios. |
| [API-BIA-22-b](#API-BIA-22-b) | POST | `/api/admin/bia/templates` | Plantillas PDF; POST /:id/preview con datos ficticios. |
| [API-BIA-22-c](#API-BIA-22-c) | GET | `/api/admin/bia/templates/{id}` | Plantillas PDF; POST /:id/preview con datos ficticios. |
| [API-BIA-22-d](#API-BIA-22-d) | PATCH | `/api/admin/bia/templates/{id}` | Plantillas PDF; POST /:id/preview con datos ficticios. |
| [API-BIA-23](#API-BIA-23) | GET | `/api/admin/bia/export-layouts` | Layouts de archivo. |
| [API-BIA-23-b](#API-BIA-23-b) | POST | `/api/admin/bia/export-layouts` | Layouts de archivo. |
| [API-BIA-23-c](#API-BIA-23-c) | GET | `/api/admin/bia/export-layouts/{id}` | Layouts de archivo. |
| [API-BIA-23-d](#API-BIA-23-d) | PATCH | `/api/admin/bia/export-layouts/{id}` | Layouts de archivo. |
| [API-BIA-24](#API-BIA-24) | POST | `/api/admin/bia/export-layouts/{id}/preview` | Vista previa (20 filas), validación y estados. |
| [API-BIA-24-b](#API-BIA-24-b) | POST | `/api/admin/bia/export-layouts/{id}/validate` | Vista previa (20 filas), validación y estados. |
| [API-BIA-24-c](#API-BIA-24-c) | POST | `/api/admin/bia/export-layouts/{id}/activate` | Vista previa (20 filas), validación y estados. |
| [API-BIA-24-d](#API-BIA-24-d) | POST | `/api/admin/bia/export-layouts/{id}/archive` | Vista previa (20 filas), validación y estados. |
| [API-BIA-25](#API-BIA-25) | GET | `/api/admin/bia/custom-reports` | Reportes personalizados (O11) |
| [API-BIA-25-b](#API-BIA-25-b) | POST | `/api/admin/bia/custom-reports` | Reportes personalizados (O11) |
| [API-BIA-25-c](#API-BIA-25-c) | GET | `/api/admin/bia/custom-reports/{id}` | Reportes personalizados (O11) |
| [API-BIA-25-d](#API-BIA-25-d) | PATCH | `/api/admin/bia/custom-reports/{id}` | Reportes personalizados (O11) |
| [API-BIA-26](#API-BIA-26) | POST | `/api/admin/bia/custom-reports/{id}/preview` | Ciclo §8.1. |
| [API-BIA-26-b](#API-BIA-26-b) | POST | `/api/admin/bia/custom-reports/{id}/submit` | Ciclo §8.1. |
| [API-BIA-26-c](#API-BIA-26-c) | POST | `/api/admin/bia/custom-reports/{id}/approve` | Ciclo §8.1. |
| [API-BIA-26-d](#API-BIA-26-d) | POST | `/api/admin/bia/custom-reports/{id}/reject` | Ciclo §8.1. |
| [API-BIA-26-e](#API-BIA-26-e) | POST | `/api/admin/bia/custom-reports/{id}/deprecate` | Ciclo §8.1. |
| [API-BIA-27](#API-BIA-27) | GET | `/api/admin/bia/indicators` | Catálogo y ficha de indicadores. |
| [API-BIA-27-b](#API-BIA-27-b) | GET | `/api/admin/bia/indicators/{code}` | Catálogo y ficha de indicadores. |
| [API-BIA-28](#API-BIA-28) | GET | `/api/admin/bia/indicators/{code}/values` | Valor actual y serie ?period=&from=&to=&dims=. |
| [API-BIA-29](#API-BIA-29) | PATCH | `/api/admin/bia/indicators/{code}/targets` | Óptimo, umbral, objetivo del tenant. |
| [API-BIA-30](#API-BIA-30) | POST | `/api/admin/bia/indicators/{code}/propose-version` | Versionado §8.5. |
| [API-BIA-30-b](#API-BIA-30-b) | POST | `/api/admin/bia/indicators/{code}/certify` | Versionado §8.5. |
| [API-BIA-30-c](#API-BIA-30-c) | POST | `/api/admin/bia/indicators/{code}/deprecate` | Versionado §8.5. |
| [API-BIA-31](#API-BIA-31) | GET | `/api/admin/bia/dashboards` | Tableros; GET con valores ya calculados. |
| [API-BIA-31-b](#API-BIA-31-b) | POST | `/api/admin/bia/dashboards` | Tableros; GET con valores ya calculados. |
| [API-BIA-31-c](#API-BIA-31-c) | GET | `/api/admin/bia/dashboards/{code}` | Tableros; GET con valores ya calculados. |
| [API-BIA-31-d](#API-BIA-31-d) | PATCH | `/api/admin/bia/dashboards/{code}` | Tableros; GET con valores ya calculados. |
| [API-BIA-32](#API-BIA-32) | PUT | `/api/admin/bia/dashboards/{code}/prefs` | Preferencias personales. |
| [API-BIA-33](#API-BIA-33) | GET | `/api/admin/bia/alert-rules` | Reglas; POST /:id/simulate. |
| [API-BIA-33-b](#API-BIA-33-b) | POST | `/api/admin/bia/alert-rules` | Reglas; POST /:id/simulate. |
| [API-BIA-33-c](#API-BIA-33-c) | GET | `/api/admin/bia/alert-rules/{id}` | Reglas; POST /:id/simulate. |
| [API-BIA-33-d](#API-BIA-33-d) | PATCH | `/api/admin/bia/alert-rules/{id}` | Reglas; POST /:id/simulate. |
| [API-BIA-34](#API-BIA-34) | GET | `/api/admin/bia/alerts` | Bandeja. |
| [API-BIA-35](#API-BIA-35) | POST | `/api/admin/bia/alerts/{id}/acknowledge` | Transiciones §8.9. |
| [API-BIA-35-b](#API-BIA-35-b) | POST | `/api/admin/bia/alerts/{id}/resolve` | Transiciones §8.9. |
| [API-BIA-35-c](#API-BIA-35-c) | POST | `/api/admin/bia/alerts/{id}/mute` | Transiciones §8.9. |
| [API-BIA-36](#API-BIA-36) | GET | `/api/admin/bia/datasets` | Datasets semánticos y exposición. |
| [API-BIA-36-b](#API-BIA-36-b) | GET | `/api/admin/bia/datasets/{code}` | Datasets semánticos y exposición. |
| [API-BIA-36-c](#API-BIA-36-c) | PATCH | `/api/admin/bia/datasets/{code}` | Datasets semánticos y exposición. |
| [API-BIA-37](#API-BIA-37) | GET | `/api/admin/bia/rooms/{room}/summary` | Zona A de la sala. |
| [API-BIA-38](#API-BIA-38) | GET | `/api/admin/bia/rooms/{room}/items` | Zona B paginada. |
| [API-BIA-39](#API-BIA-39) | POST | `/api/admin/bia/rooms/{room}/export` | Export.xlsx de la sala. |
| [API-BIA-40](#API-BIA-40) | POST | `/api/admin/bia/rooms/{room}/analyze-auto` | Análisis automático (cacheado) |
| [API-BIA-41](#API-BIA-41) | POST | `/api/admin/bia/rooms/{room}/ask` | Pregunta en lenguaje natural → respuesta con citas. |
| [API-BIA-42](#API-BIA-42) | POST | `/api/admin/bia/ai-questions/{id}/feedback` | Valoración. |
| [API-BIA-43](#API-BIA-43) | POST | `/api/admin/bia/rooms/{room}/schedule` | Programar envío de la sala. |
| [API-BIA-44](#API-BIA-44) | GET | `/api/admin/bia/api-clients` | Perfil de datos del cliente (finalidad, scopes, restricciones, límites) |
| [API-BIA-44-b](#API-BIA-44-b) | POST | `/api/admin/bia/api-clients` | Perfil de datos del cliente (finalidad, scopes, restricciones, límites) |
| [API-BIA-44-c](#API-BIA-44-c) | GET | `/api/admin/bia/api-clients/{id}` | Perfil de datos del cliente (finalidad, scopes, restricciones, límites) |
| [API-BIA-44-d](#API-BIA-44-d) | PATCH | `/api/admin/bia/api-clients/{id}` | Perfil de datos del cliente (finalidad, scopes, restricciones, límites) |
| [API-BIA-45](#API-BIA-45) | POST | `/api/admin/bia/api-clients/{id}/approve` | Transiciones §8.6. |
| [API-BIA-45-b](#API-BIA-45-b) | POST | `/api/admin/bia/api-clients/{id}/reject` | Transiciones §8.6. |
| [API-BIA-45-c](#API-BIA-45-c) | POST | `/api/admin/bia/api-clients/{id}/suspend` | Transiciones §8.6. |
| [API-BIA-45-d](#API-BIA-45-d) | POST | `/api/admin/bia/api-clients/{id}/reactivate` | Transiciones §8.6. |
| [API-BIA-45-e](#API-BIA-45-e) | POST | `/api/admin/bia/api-clients/{id}/revoke` | Transiciones §8.6. |
| [API-BIA-46](#API-BIA-46) | POST | `/api/admin/bia/api-clients/{id}/credentials` | Emite/rota/revoca delegando en T02 (API-IAM-47); secreto en la respuesta una sola vez. |
| [API-BIA-46-b](#API-BIA-46-b) | POST | `/api/admin/bia/api-clients/{id}/credentials/{credId}/rotate` | Emite/rota/revoca delegando en T02 (API-IAM-47); secreto en la respuesta una sola vez. |
| [API-BIA-46-c](#API-BIA-46-c) | POST | `/api/admin/bia/api-clients/{id}/credentials/{credId}/revoke` | Emite/rota/revoca delegando en T02 (API-IAM-47); secreto en la respuesta una sola vez. |
| [API-BIA-47](#API-BIA-47) | GET | `/api/admin/bia/api-usage` | Uso agregado y errores. |
| [API-BIA-48](#API-BIA-48) | GET | `/api/admin/bia/webhook-subscriptions` | Suscripciones (alta en nombre de un cliente) |
| [API-BIA-48-b](#API-BIA-48-b) | POST | `/api/admin/bia/webhook-subscriptions` | Suscripciones (alta en nombre de un cliente) |
| [API-BIA-48-c](#API-BIA-48-c) | GET | `/api/admin/bia/webhook-subscriptions/{id}` | Suscripciones (alta en nombre de un cliente) |
| [API-BIA-48-e](#API-BIA-48-e) | DELETE | `/api/admin/bia/webhook-subscriptions/{id}` | Suscripciones (alta en nombre de un cliente) |
| [API-BIA-48-d](#API-BIA-48-d) | PATCH | `/api/admin/bia/webhook-subscriptions/{id}` | Suscripciones (alta en nombre de un cliente) |
| [API-BIA-49](#API-BIA-49) | GET | `/api/admin/bia/webhook-deliveries` | Entregas. |
| [API-BIA-50](#API-BIA-50) | POST | `/api/admin/bia/webhook-deliveries/{id}/redeliver` | Reenvío. |
| [API-BIA-50-b](#API-BIA-50-b) | POST | `/api/admin/bia/webhook-deliveries/redeliver-bulk` | Reenvío. |
| [API-BIA-51](#API-BIA-51) | GET | `/api/admin/bia/access-logs` | Auditoría de accesos a reportes. |
| [API-BIA-52](#API-BIA-52) | GET | `/api/admin/bia/open-data` | Publicaciones. |
| [API-BIA-52-b](#API-BIA-52-b) | POST | `/api/admin/bia/open-data` | Publicaciones. |
| [API-BIA-52-c](#API-BIA-52-c) | GET | `/api/admin/bia/open-data/{id}` | Publicaciones. |
| [API-BIA-52-d](#API-BIA-52-d) | PATCH | `/api/admin/bia/open-data/{id}` | Publicaciones. |
| [API-BIA-53](#API-BIA-53) | POST | `/api/admin/bia/open-data/{id}/preview` | Ciclo §8.10. |
| [API-BIA-53-b](#API-BIA-53-b) | POST | `/api/admin/bia/open-data/{id}/approve` | Ciclo §8.10. |
| [API-BIA-53-c](#API-BIA-53-c) | POST | `/api/admin/bia/open-data/{id}/publish` | Ciclo §8.10. |
| [API-BIA-53-d](#API-BIA-53-d) | POST | `/api/admin/bia/open-data/{id}/withdraw` | Ciclo §8.10. |
| [API-BIA-54](#API-BIA-54) | GET | `/api/admin/bia/benchmark/participation` | Adhesión y segmento. |
| [API-BIA-54-b](#API-BIA-54-b) | PUT | `/api/admin/bia/benchmark/participation` | Adhesión y segmento. |
| [API-BIA-55](#API-BIA-55) | GET | `/api/admin/bia/benchmark/results` | Percentiles del tenant. |
| [API-BIA-56](#API-BIA-56) | GET | `/api/admin/bia/regulatory-catalog` | Catálogo regulatorio con vencimientos y estado. |
| [API-BIA-57](#API-BIA-57) | GET | `/api/bia/my-dashboard` | Tablero móvil (PWA empleado) |
| [API-BIA-58](#API-BIA-58) | GET | `/api/platform/bia/dashboard` | Indicadores globales GOB-001 (consumido por PAN-PLA-01) |
| [API-BIA-59](#API-BIA-59) | GET | `/api/platform/bia/api-usage` | Uso de API por tenant (agregado) |
| [API-BIA-60](#API-BIA-60) | GET | `/api/platform/bia/analytics-health` | Frescura, reconciliación, proyecciones. |
| [API-BIA-61](#API-BIA-61) | POST | `/api/platform/bia/projections/{domain}/rebuild` | Reconstrucción por tenant (JOB-BIA-12) |
| [API-BIA-62](#API-BIA-62) | POST | `/api/platform/bia/system-catalog/reports/{code}/publish` | Publicar versión de sistema. |
| [API-BIA-62-b](#API-BIA-62-b) | POST | `/api/platform/bia/system-catalog/indicators/{code}/publish` | Publicar versión de sistema. |
| [API-BIA-62-c](#API-BIA-62-c) | POST | `/api/platform/bia/system-catalog/templates/{code}/publish` | Publicar versión de sistema. |
| [API-BIA-63](#API-BIA-63) | GET | `/api/platform/bia/benchmark/segments` | Segmentos y mínimos. |
| [API-BIA-63-b](#API-BIA-63-b) | PATCH | `/api/platform/bia/benchmark/segments` | Segmentos y mínimos. |
| [API-BIA-64](#API-BIA-64) | GET | `/api/public/{tenantSlug}/open-data` | Lista de datasets abiertos publicados. |
| [API-BIA-65](#API-BIA-65) | GET | `/api/public/{tenantSlug}/open-data/{slug}.csv` | Descarga de una versión. |
| [API-BIA-65-b](#API-BIA-65-b) | GET | `/api/public/{tenantSlug}/open-data/{slug}/{version}.csv` | Descarga de una versión. |
| [API-BIA-65-c](#API-BIA-65-c) | GET | `/api/public/{tenantSlug}/open-data/{slug}.json` | Descarga de una versión. |
| [API-BIA-65-d](#API-BIA-65-d) | GET | `/api/public/{tenantSlug}/open-data/{slug}/{version}.json` | Descarga de una versión. |

<a id="API-BIA-01"></a>
#### API-BIA-01 · `GET /api/admin/bia/reports`

- **Qué hace:** Catálogo filtrado por permisos; ?q=&module=&cluster=&origin=&favorite=. Lista, con filtros y paginación, los registros de generador de reportes del tenant (`customReports`).
- **Para qué sirve:** RF-BIA-011: Favoritos, recientes y búsqueda por texto en el catálogo; agrupación por cluster del mapa del sitio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.reportes.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de generador de reportes del tenant (`customReports`) con `total`.
- **Pantallas:** PAN-BIA-01 (Catálogo de reportes), PAN-BIA-03 (Mis corridas), PAN-BIA-06 (Presets y vistas guardadas) y 1 más.
- **Ola:** O11 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1935 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-01)

<a id="API-BIA-02"></a>
#### API-BIA-02 · `GET /api/admin/bia/reports/{code}`

- **Qué hace:** Ficha: parámetros (esquema JSON derivado de Zod), columnas, salidas, ayuda, versión. Obtiene el detalle de un registro de generador de reportes del tenant (`customReports`).
- **Para qué sirve:** RF-BIA-001: Catálogo único de reportes (reportDefinitions) con código REP, nombre por clave de diccionario, módulo dueño, propósito, granularidad, parámetros, columnas, capabilities, sensibilidad, salidas y versión. · RF-BIA-007: Encabezado obligatorio de toda salida: tenant, reporte y versión, parámetros, universo, fecha de corte, tipo de fecha usado, granularidad, fuente (operativa/analítica) y frescura, usuario y fecha de generación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.reportes.ver`.
- **Recibe:** en la ruta `code`.
- **Devuelve:** 200: el registro de generador de reportes del tenant (`customReports`).
- **Pantallas:** PAN-BIA-01 (Catálogo de reportes), PAN-BIA-03 (Mis corridas), PAN-BIA-06 (Presets y vistas guardadas) y 1 más.
- **Ola:** O11 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1936 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-02)

<a id="API-BIA-03"></a>
#### API-BIA-03 · `POST /api/admin/bia/reports/{code}/runs`

- **Qué hace:** Ejecuta; 200 con primera página (sync) o 202 con runId (async) Agrega un elemento («runs») a un registro de ejecuciones; TTL (`reportRuns`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-BIA-005: Modo síncrono cuando la estimación de costo ≤ PRM-BIA-003 filas y PRM-BIA-004 segundos; en otro caso, ejecución asíncrona en job bia:ejecutar-reporte con progreso. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.reportes.ejecutar`.
- **Recibe:** en la ruta `code`; los datos de ejecuciones; TTL (`reportRuns`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-BIA-02 (Ejecución de reporte).
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1937 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-03)

<a id="API-BIA-04"></a>
#### API-BIA-04 · `GET /api/admin/bia/runs`

- **Qué hace:** Mis corridas (todas con bia.exportaciones.administrar) Lista, con filtros y paginación, los registros de ejecuciones; TTL (`reportRuns`).
- **Para qué sirve:** RF-BIA-031: Compresión ZIP de exportaciones múltiples (varios archivos de una misma corrida). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.reportes.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ejecuciones; TTL (`reportRuns`) con `total`.
- **Pantallas:** PAN-BIA-01 (Catálogo de reportes), PAN-BIA-03 (Mis corridas), PAN-BIA-06 (Presets y vistas guardadas) y 1 más.
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1938 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-04)

<a id="API-BIA-05"></a>
#### API-BIA-05 · `GET /api/admin/bia/runs/{id}`

- **Qué hace:** Estado, progreso, metadatos, totales. Obtiene el detalle de un registro de ejecuciones; TTL (`reportRuns`).
- **Para qué sirve:** RF-BIA-005: Modo síncrono cuando la estimación de costo ≤ PRM-BIA-003 filas y PRM-BIA-004 segundos; en otro caso, ejecución asíncrona en job bia:ejecutar-reporte con progreso. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.reportes.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de ejecuciones; TTL (`reportRuns`).
- **Pantallas:** PAN-BIA-01 (Catálogo de reportes), PAN-BIA-03 (Mis corridas), PAN-BIA-06 (Presets y vistas guardadas) y 1 más.
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1939 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-05)

<a id="API-BIA-06"></a>
#### API-BIA-06 · `GET /api/admin/bia/runs/{id}/rows`

- **Qué hace:** Página del resultado ?page=&size=&sort=&groupBy=. Consulta «rows» de un registro de ejecuciones; TTL (`reportRuns`).
- **Para qué sirve:** RF-BIA-078: Paginación ?page=&size= → { items, total, page, size } y modo incremental por cursor (?updatedSince=&cursor=) con bajas como tombstones. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.reportes.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de ejecuciones; TTL (`reportRuns`).
- **Pantallas:** PAN-BIA-01 (Catálogo de reportes), PAN-BIA-03 (Mis corridas), PAN-BIA-06 (Presets y vistas guardadas) y 1 más.
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1940 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-06)

<a id="API-BIA-07"></a>
#### API-BIA-07 · `GET /api/admin/bia/runs/{id}/drill`

- **Qué hace:** Filas componentes de un total/celda ?cell=. Consulta «drill» de un registro de ejecuciones; TTL (`reportRuns`).
- **Para qué sirve:** RF-BIA-008: Llegada al detalle (drill-down) desde cada total o indicador a los registros que lo componen y al documento de origen. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.reportes.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de ejecuciones; TTL (`reportRuns`).
- **Pantallas:** PAN-BIA-01 (Catálogo de reportes), PAN-BIA-03 (Mis corridas), PAN-BIA-06 (Presets y vistas guardadas) y 1 más.
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1941 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-07)

<a id="API-BIA-08"></a>
#### API-BIA-08 · `POST /api/admin/bia/runs/{id}/cancel`

- **Qué hace:** Cancela. Cancela un registro de ejecuciones; TTL (`reportRuns`).
- **Para qué sirve:** RF-BIA-005: Modo síncrono cuando la estimación de costo ≤ PRM-BIA-003 filas y PRM-BIA-004 segundos; en otro caso, ejecución asíncrona en job bia:ejecutar-reporte con progreso. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.reportes.ejecutar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-02 (Ejecución de reporte).
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1942 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-08)

<a id="API-BIA-09"></a>
#### API-BIA-09 · `POST /api/admin/bia/runs/{id}/retry`

- **Qué hace:** Crea corrida nueva con mismos parámetros. Reintenta un registro de ejecuciones; TTL (`reportRuns`).
- **Para qué sirve:** RF-BIA-005: Modo síncrono cuando la estimación de costo ≤ PRM-BIA-003 filas y PRM-BIA-004 segundos; en otro caso, ejecución asíncrona en job bia:ejecutar-reporte con progreso. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.reportes.ejecutar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-02 (Ejecución de reporte).
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1943 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-09)

<a id="API-BIA-10"></a>
#### API-BIA-10 · `POST /api/admin/bia/runs/{id}/selection`

- **Qué hace:** Genera selectionToken con IDs seleccionados para el módulo dueño. Registra «selection» sobre un registro de ejecuciones; TTL (`reportRuns`).
- **Para qué sirve:** RF-BIA-019: Selección para acción: un reporte puede entregar al módulo dueño un selectionToken con IDs seleccionados para que el usuario inicie allí una acción (notificar, generar OT). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.reportes.ver`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-01 (Catálogo de reportes), PAN-BIA-03 (Mis corridas), PAN-BIA-06 (Presets y vistas guardadas) y 1 más.
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1944 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-10)

<a id="API-BIA-11"></a>
#### API-BIA-11 · `POST /api/admin/bia/runs/{id}/exports`

- **Qué hace:** Exporta {format, csvDialect, layoutId, columns}. Da de alta un registro de archivos exportados (`reportExports`).
- **Para qué sirve:** RF-BIA-030: Layouts de archivo plano configurables por tenant (columnas, orden, tipo, largo, precisión, formato, relleno izquierdo, obligatorio, valor fijo, valor para vacío, separador o ancho fijo, encabezado/pie, nombre de archivo con… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.reportes.exportar`.
- **Recibe:** en la ruta `id`; los datos de archivos exportados (`reportExports`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de archivos exportados (`reportExports`).
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1945 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-11)

<a id="API-BIA-12"></a>
#### API-BIA-12 · `POST /api/admin/bia/table-exports`

- **Qué hace:** Exporta una grilla {screenKey, filters, columns, format} re-ejecutando su consulta. Registra un nuevo elemento u operación en `table-exports`.
- **Para qué sirve:** RF-BIA-040: Vistas guardadas de grillas (columnas, filtros, orden, agrupación) personales o compartidas; una por defecto por usuario. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.exportaciones.crear`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1946 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-12)

<a id="API-BIA-13"></a>
#### API-BIA-13 · `GET /api/admin/bia/exports`

- **Qué hace:** Mis exportaciones. Lista, con filtros y paginación, los registros de archivos exportados (`reportExports`).
- **Para qué sirve:** RF-BIA-032: Checksum SHA-256 y tamaño de cada archivo exportado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.exportaciones.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de archivos exportados (`reportExports`) con `total`.
- **Pantallas:** PAN-BIA-04 (Mis exportaciones).
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1947 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-13)

<a id="API-BIA-14"></a>
#### API-BIA-14 · `GET /api/admin/bia/exports/{id}/download`

- **Qué hace:** 302 a URL firmada de PRM-BIA-007 min; registra descarga. Descarga un archivo de archivos exportados (`reportExports`).
- **Para qué sirve:** RF-BIA-082: Exportaciones masivas autorizadas (/exports) con estado, vencimiento y descarga firmada (NDJSON, CSV, Parquet opcional). · RF-BIA-022: Exportación asíncrona en worker BullMQ (bia:generar-exportacion) cuando supera PRM-BIA-005 filas; archivo en almacenamiento privado; descarga por URL firmada de PRM-BIA-007 minutos tras revalidar permiso. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.exportaciones.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un archivo (application/octet-stream).
- **Pantallas:** PAN-BIA-04 (Mis exportaciones).
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1948 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-14)

<a id="API-BIA-15"></a>
#### API-BIA-15 · `POST /api/admin/bia/exports/{id}/cancel`

- **Qué hace:** Cancela. Cancela un registro de archivos exportados (`reportExports`).
- **Para qué sirve:** RF-BIA-009: Vista previa antes de exportar; cancelar ejecución en curso; reintentar una ejecución fallida con los mismos parámetros. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.exportaciones.administrar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-03 (Mis corridas), PAN-BIA-04 (Mis exportaciones).
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1949 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-15)

<a id="API-BIA-16"></a>
#### API-BIA-16 · `GET /api/admin/bia/presets`

- **Qué hace:** Presets. Lista, con filtros y paginación, los registros de filtros predefinidos compartidos (`reportPresets`).
- **Para qué sirve:** RF-BIA-010: Presets con nombre (personales o compartidos a roles) por reporte. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.reportes.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de filtros predefinidos compartidos (`reportPresets`) con `total`.
- **Pantallas:** PAN-BIA-01 (Catálogo de reportes), PAN-BIA-03 (Mis corridas), PAN-BIA-06 (Presets y vistas guardadas) y 1 más.
- **Ola:** O2 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1950 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-16)

<a id="API-BIA-16-b"></a>
#### API-BIA-16-b · `POST /api/admin/bia/presets`

- **Qué hace:** Presets. Da de alta un registro de filtros predefinidos compartidos (`reportPresets`).
- **Para qué sirve:** RF-BIA-010: Presets con nombre (personales o compartidos a roles) por reporte. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.presets.compartir`.
- **Recibe:** los datos de filtros predefinidos compartidos (`reportPresets`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de filtros predefinidos compartidos (`reportPresets`).
- **Pantallas:** PAN-BIA-06 (Presets y vistas guardadas).
- **Ola:** O2 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1950 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-16-b)

<a id="API-BIA-16-c"></a>
#### API-BIA-16-c · `GET /api/admin/bia/presets/{id}`

- **Qué hace:** Presets. Obtiene el detalle de un registro de filtros predefinidos compartidos (`reportPresets`).
- **Para qué sirve:** RF-BIA-010: Presets con nombre (personales o compartidos a roles) por reporte. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.reportes.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de filtros predefinidos compartidos (`reportPresets`).
- **Pantallas:** PAN-BIA-01 (Catálogo de reportes), PAN-BIA-03 (Mis corridas), PAN-BIA-06 (Presets y vistas guardadas) y 1 más.
- **Ola:** O2 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1950 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-16-c)

<a id="API-BIA-16-e"></a>
#### API-BIA-16-e · `DELETE /api/admin/bia/presets/{id}`

- **Qué hace:** Presets. Elimina o da de baja un registro de filtros predefinidos compartidos (`reportPresets`).
- **Para qué sirve:** RF-BIA-010: Presets con nombre (personales o compartidos a roles) por reporte. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.presets.compartir`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-BIA-06 (Presets y vistas guardadas).
- **Ola:** O2 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1950 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-16-e)

<a id="API-BIA-16-d"></a>
#### API-BIA-16-d · `PATCH /api/admin/bia/presets/{id}`

- **Qué hace:** Presets. Modifica algunos campos de un registro de filtros predefinidos compartidos (`reportPresets`) (solo los enviados).
- **Para qué sirve:** RF-BIA-010: Presets con nombre (personales o compartidos a roles) por reporte. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.presets.compartir`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de filtros predefinidos compartidos (`reportPresets`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de filtros predefinidos compartidos (`reportPresets`).
- **Pantallas:** PAN-BIA-06 (Presets y vistas guardadas).
- **Ola:** O2 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1950 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-16-d)

<a id="API-BIA-17"></a>
#### API-BIA-17 · `GET /api/admin/bia/saved-views`

- **Qué hace:** Vistas guardadas de DataTable ?screenKey=. Consulta `saved-views`.
- **Para qué sirve:** RF-BIA-040: Vistas guardadas de grillas (columnas, filtros, orden, agrupación) personales o compartidas; una por defecto por usuario. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.reportes.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-01 (Catálogo de reportes), PAN-BIA-03 (Mis corridas), PAN-BIA-06 (Presets y vistas guardadas) y 1 más.
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1951 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-17)

<a id="API-BIA-17-b"></a>
#### API-BIA-17-b · `POST /api/admin/bia/saved-views`

- **Qué hace:** Vistas guardadas de DataTable ?screenKey=. Registra un nuevo elemento u operación en `saved-views`.
- **Para qué sirve:** RF-BIA-040: Vistas guardadas de grillas (columnas, filtros, orden, agrupación) personales o compartidas; una por defecto por usuario. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.reportes.ver`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-01 (Catálogo de reportes), PAN-BIA-03 (Mis corridas), PAN-BIA-06 (Presets y vistas guardadas) y 1 más.
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1951 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-17-b)

<a id="API-BIA-17-c"></a>
#### API-BIA-17-c · `GET /api/admin/bia/saved-views/{id}`

- **Qué hace:** Vistas guardadas de DataTable ?screenKey=. Obtiene el detalle de un registro de `saved-views`.
- **Para qué sirve:** RF-BIA-040: Vistas guardadas de grillas (columnas, filtros, orden, agrupación) personales o compartidas; una por defecto por usuario. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.reportes.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-01 (Catálogo de reportes), PAN-BIA-03 (Mis corridas), PAN-BIA-06 (Presets y vistas guardadas) y 1 más.
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1951 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-17-c)

<a id="API-BIA-17-e"></a>
#### API-BIA-17-e · `DELETE /api/admin/bia/saved-views/{id}`

- **Qué hace:** Vistas guardadas de DataTable ?screenKey=. Elimina o da de baja un registro de `saved-views`.
- **Para qué sirve:** RF-BIA-040: Vistas guardadas de grillas (columnas, filtros, orden, agrupación) personales o compartidas; una por defecto por usuario. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.reportes.ver`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-BIA-01 (Catálogo de reportes), PAN-BIA-03 (Mis corridas), PAN-BIA-06 (Presets y vistas guardadas) y 1 más.
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1951 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-17-e)

<a id="API-BIA-17-d"></a>
#### API-BIA-17-d · `PATCH /api/admin/bia/saved-views/{id}`

- **Qué hace:** Vistas guardadas de DataTable ?screenKey=. Modifica algunos campos de un registro de `saved-views` (solo los enviados).
- **Para qué sirve:** RF-BIA-040: Vistas guardadas de grillas (columnas, filtros, orden, agrupación) personales o compartidas; una por defecto por usuario. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.reportes.ver`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-01 (Catálogo de reportes), PAN-BIA-03 (Mis corridas), PAN-BIA-06 (Presets y vistas guardadas) y 1 más.
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1951 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-17-d)

<a id="API-BIA-18"></a>
#### API-BIA-18 · `GET /api/admin/bia/schedules`

- **Qué hace:** Programaciones. Lista, con filtros y paginación, los registros de programaciones (`reportSchedules`).
- **Para qué sirve:** RF-BIA-044: Galería de plantillas de reportes personalizados provista por plataforma, copiables al tenant (sin datos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.reportes.programar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de programaciones (`reportSchedules`) con `total`.
- **Pantallas:** PAN-BIA-05 (Programaciones).
- **Ola:** O2 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1952 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-18)

<a id="API-BIA-18-b"></a>
#### API-BIA-18-b · `POST /api/admin/bia/schedules`

- **Qué hace:** Programaciones. Da de alta un registro de programaciones (`reportSchedules`).
- **Para qué sirve:** RF-BIA-044: Galería de plantillas de reportes personalizados provista por plataforma, copiables al tenant (sin datos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.reportes.programar`.
- **Recibe:** los datos de programaciones (`reportSchedules`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de programaciones (`reportSchedules`).
- **Pantallas:** PAN-BIA-05 (Programaciones).
- **Ola:** O2 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1952 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-18-b)

<a id="API-BIA-18-c"></a>
#### API-BIA-18-c · `GET /api/admin/bia/schedules/{id}`

- **Qué hace:** Programaciones. Obtiene el detalle de un registro de programaciones (`reportSchedules`).
- **Para qué sirve:** RF-BIA-044: Galería de plantillas de reportes personalizados provista por plataforma, copiables al tenant (sin datos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.reportes.programar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de programaciones (`reportSchedules`).
- **Pantallas:** PAN-BIA-05 (Programaciones).
- **Ola:** O2 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1952 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-18-c)

<a id="API-BIA-18-d"></a>
#### API-BIA-18-d · `PATCH /api/admin/bia/schedules/{id}`

- **Qué hace:** Programaciones. Modifica algunos campos de un registro de programaciones (`reportSchedules`) (solo los enviados).
- **Para qué sirve:** RF-BIA-044: Galería de plantillas de reportes personalizados provista por plataforma, copiables al tenant (sin datos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.reportes.programar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de programaciones (`reportSchedules`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de programaciones (`reportSchedules`).
- **Pantallas:** PAN-BIA-05 (Programaciones).
- **Ola:** O2 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1952 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-18-d)

<a id="API-BIA-19"></a>
#### API-BIA-19 · `POST /api/admin/bia/schedules/{id}/pause`

- **Qué hace:** Transiciones §8.4. Pausa un registro de programaciones (`reportSchedules`).
- **Para qué sirve:** RF-BIA-103: Reporte de uso de la plataforma de reportes (más usados, tiempos, fallos) para mejora continua. · RF-BIA-044: Galería de plantillas de reportes personalizados provista por plataforma, copiables al tenant (sin datos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.reportes.programar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-05 (Programaciones).
- **Ola:** O2 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1953 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-19)

<a id="API-BIA-19-b"></a>
#### API-BIA-19-b · `POST /api/admin/bia/schedules/{id}/resume`

- **Qué hace:** Transiciones §8.4. Reanuda un registro de programaciones (`reportSchedules`).
- **Para qué sirve:** RF-BIA-103: Reporte de uso de la plataforma de reportes (más usados, tiempos, fallos) para mejora continua. · RF-BIA-044: Galería de plantillas de reportes personalizados provista por plataforma, copiables al tenant (sin datos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.reportes.programar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-05 (Programaciones).
- **Ola:** O2 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1953 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-19-b)

<a id="API-BIA-19-c"></a>
#### API-BIA-19-c · `POST /api/admin/bia/schedules/{id}/run-now`

- **Qué hace:** Transiciones §8.4. Registra «run-now» sobre un registro de programaciones (`reportSchedules`).
- **Para qué sirve:** RF-BIA-103: Reporte de uso de la plataforma de reportes (más usados, tiempos, fallos) para mejora continua. · RF-BIA-044: Galería de plantillas de reportes personalizados provista por plataforma, copiables al tenant (sin datos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.reportes.programar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-05 (Programaciones).
- **Ola:** O2 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1953 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-19-c)

<a id="API-BIA-19-d"></a>
#### API-BIA-19-d · `POST /api/admin/bia/schedules/{id}/disable`

- **Qué hace:** Transiciones §8.4. Deshabilita un registro de programaciones (`reportSchedules`).
- **Para qué sirve:** RF-BIA-103: Reporte de uso de la plataforma de reportes (más usados, tiempos, fallos) para mejora continua. · RF-BIA-044: Galería de plantillas de reportes personalizados provista por plataforma, copiables al tenant (sin datos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.reportes.programar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-05 (Programaciones).
- **Ola:** O2 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1953 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-19-d)

<a id="API-BIA-20"></a>
#### API-BIA-20 · `GET /api/admin/bia/schedules/{id}/deliveries`

- **Qué hace:** Historial de entregas. Lista, con filtros y paginación, los registros de entregas programadas (`reportDeliveries`).
- **Para qué sirve:** RF-BIA-039: Suspensión automática tras PRM-BIA-013 fallos consecutivos e historial de entregas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.reportes.programar`.
- **Recibe:** en la ruta `id`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de entregas programadas (`reportDeliveries`) con `total`.
- **Pantallas:** PAN-BIA-05 (Programaciones).
- **Ola:** O2 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1954 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-20)

<a id="API-BIA-21"></a>
#### API-BIA-21 · `GET /api/admin/bia/report-settings/{code}`

- **Qué hace:** Ocultar, renombrar, plantilla y preset por defecto. Obtiene el detalle de un registro de `report-settings`.
- **Para qué sirve:** RF-BIA-018: Habilitar/ocultar reportes de sistema por tenant y renombrarlos vía diccionario. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.reportes.configurar`.
- **Recibe:** en la ruta `code`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-07 (Configuración del catálogo del tenant), PAN-BIA-08 (Layouts de archivo).
- **Ola:** O2 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1955 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-21)

<a id="API-BIA-21-b"></a>
#### API-BIA-21-b · `PATCH /api/admin/bia/report-settings/{code}`

- **Qué hace:** Ocultar, renombrar, plantilla y preset por defecto. Modifica algunos campos de un registro de `report-settings` (solo los enviados).
- **Para qué sirve:** RF-BIA-018: Habilitar/ocultar reportes de sistema por tenant y renombrarlos vía diccionario. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.reportes.configurar`.
- **Recibe:** en la ruta `code`; solo los campos a cambiar; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-07 (Configuración del catálogo del tenant), PAN-BIA-08 (Layouts de archivo).
- **Ola:** O2 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1955 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-21-b)

<a id="API-BIA-22"></a>
#### API-BIA-22 · `GET /api/admin/bia/templates`

- **Qué hace:** Plantillas PDF; POST /:id/preview con datos ficticios. Lista, con filtros y paginación, los registros de plantillas de reporte (`reportTemplates`).
- **Para qué sirve:** RF-BIA-044: Galería de plantillas de reportes personalizados provista por plataforma, copiables al tenant (sin datos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.reportes.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de plantillas de reporte (`reportTemplates`) con `total`.
- **Pantallas:** PAN-BIA-07 (Configuración del catálogo del tenant), PAN-BIA-08 (Layouts de archivo).
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1956 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-22)

<a id="API-BIA-22-b"></a>
#### API-BIA-22-b · `POST /api/admin/bia/templates`

- **Qué hace:** Plantillas PDF; POST /:id/preview con datos ficticios. Da de alta un registro de plantillas de reporte (`reportTemplates`).
- **Para qué sirve:** RF-BIA-044: Galería de plantillas de reportes personalizados provista por plataforma, copiables al tenant (sin datos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.reportes.configurar`.
- **Recibe:** los datos de plantillas de reporte (`reportTemplates`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de plantillas de reporte (`reportTemplates`).
- **Pantallas:** PAN-BIA-07 (Configuración del catálogo del tenant), PAN-BIA-08 (Layouts de archivo).
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1956 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-22-b)

<a id="API-BIA-22-c"></a>
#### API-BIA-22-c · `GET /api/admin/bia/templates/{id}`

- **Qué hace:** Plantillas PDF; POST /:id/preview con datos ficticios. Obtiene el detalle de un registro de plantillas de reporte (`reportTemplates`).
- **Para qué sirve:** RF-BIA-044: Galería de plantillas de reportes personalizados provista por plataforma, copiables al tenant (sin datos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.reportes.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de plantillas de reporte (`reportTemplates`).
- **Pantallas:** PAN-BIA-07 (Configuración del catálogo del tenant), PAN-BIA-08 (Layouts de archivo).
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1956 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-22-c)

<a id="API-BIA-22-d"></a>
#### API-BIA-22-d · `PATCH /api/admin/bia/templates/{id}`

- **Qué hace:** Plantillas PDF; POST /:id/preview con datos ficticios. Modifica algunos campos de un registro de plantillas de reporte (`reportTemplates`) (solo los enviados).
- **Para qué sirve:** RF-BIA-044: Galería de plantillas de reportes personalizados provista por plataforma, copiables al tenant (sin datos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.reportes.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de plantillas de reporte (`reportTemplates`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de plantillas de reporte (`reportTemplates`).
- **Pantallas:** PAN-BIA-07 (Configuración del catálogo del tenant), PAN-BIA-08 (Layouts de archivo).
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1956 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-22-d)

<a id="API-BIA-23"></a>
#### API-BIA-23 · `GET /api/admin/bia/export-layouts`

- **Qué hace:** Layouts de archivo. Lista, con filtros y paginación, los registros de diseños de exportación tabular (`exportLayouts`).
- **Para qué sirve:** RF-BIA-032: Checksum SHA-256 y tamaño de cada archivo exportado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.reportes.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de diseños de exportación tabular (`exportLayouts`) con `total`.
- **Pantallas:** PAN-BIA-07 (Configuración del catálogo del tenant), PAN-BIA-08 (Layouts de archivo).
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1957 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-23)

<a id="API-BIA-23-b"></a>
#### API-BIA-23-b · `POST /api/admin/bia/export-layouts`

- **Qué hace:** Layouts de archivo. Da de alta un registro de diseños de exportación tabular (`exportLayouts`).
- **Para qué sirve:** RF-BIA-032: Checksum SHA-256 y tamaño de cada archivo exportado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.reportes.configurar`.
- **Recibe:** los datos de diseños de exportación tabular (`exportLayouts`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de diseños de exportación tabular (`exportLayouts`).
- **Pantallas:** PAN-BIA-07 (Configuración del catálogo del tenant), PAN-BIA-08 (Layouts de archivo).
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1957 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-23-b)

<a id="API-BIA-23-c"></a>
#### API-BIA-23-c · `GET /api/admin/bia/export-layouts/{id}`

- **Qué hace:** Layouts de archivo. Obtiene el detalle de un registro de diseños de exportación tabular (`exportLayouts`).
- **Para qué sirve:** RF-BIA-032: Checksum SHA-256 y tamaño de cada archivo exportado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.reportes.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de diseños de exportación tabular (`exportLayouts`).
- **Pantallas:** PAN-BIA-07 (Configuración del catálogo del tenant), PAN-BIA-08 (Layouts de archivo).
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1957 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-23-c)

<a id="API-BIA-23-d"></a>
#### API-BIA-23-d · `PATCH /api/admin/bia/export-layouts/{id}`

- **Qué hace:** Layouts de archivo. Modifica algunos campos de un registro de diseños de exportación tabular (`exportLayouts`) (solo los enviados).
- **Para qué sirve:** RF-BIA-032: Checksum SHA-256 y tamaño de cada archivo exportado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.reportes.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de diseños de exportación tabular (`exportLayouts`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de diseños de exportación tabular (`exportLayouts`).
- **Pantallas:** PAN-BIA-07 (Configuración del catálogo del tenant), PAN-BIA-08 (Layouts de archivo).
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1957 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-23-d)

<a id="API-BIA-24"></a>
#### API-BIA-24 · `POST /api/admin/bia/export-layouts/{id}/preview`

- **Qué hace:** Vista previa (20 filas), validación y estados. Previsualiza sin efectos un registro de diseños de exportación tabular (`exportLayouts`).
- **Para qué sirve:** RF-BIA-009: Vista previa antes de exportar; cancelar ejecución en curso; reintentar una ejecución fallida con los mismos parámetros. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.reportes.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-07 (Configuración del catálogo del tenant), PAN-BIA-08 (Layouts de archivo).
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1958 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-24)

<a id="API-BIA-24-b"></a>
#### API-BIA-24-b · `POST /api/admin/bia/export-layouts/{id}/validate`

- **Qué hace:** Vista previa (20 filas), validación y estados. Valida un registro de diseños de exportación tabular (`exportLayouts`).
- **Para qué sirve:** RF-BIA-009: Vista previa antes de exportar; cancelar ejecución en curso; reintentar una ejecución fallida con los mismos parámetros. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.reportes.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-07 (Configuración del catálogo del tenant), PAN-BIA-08 (Layouts de archivo).
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1958 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-24-b)

<a id="API-BIA-24-c"></a>
#### API-BIA-24-c · `POST /api/admin/bia/export-layouts/{id}/activate`

- **Qué hace:** Vista previa (20 filas), validación y estados. Activa un registro de diseños de exportación tabular (`exportLayouts`).
- **Para qué sirve:** RF-BIA-009: Vista previa antes de exportar; cancelar ejecución en curso; reintentar una ejecución fallida con los mismos parámetros. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.reportes.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-07 (Configuración del catálogo del tenant), PAN-BIA-08 (Layouts de archivo).
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1958 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-24-c)

<a id="API-BIA-24-d"></a>
#### API-BIA-24-d · `POST /api/admin/bia/export-layouts/{id}/archive`

- **Qué hace:** Vista previa (20 filas), validación y estados. Archiva un registro de diseños de exportación tabular (`exportLayouts`).
- **Para qué sirve:** RF-BIA-009: Vista previa antes de exportar; cancelar ejecución en curso; reintentar una ejecución fallida con los mismos parámetros. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.reportes.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-07 (Configuración del catálogo del tenant), PAN-BIA-08 (Layouts de archivo).
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1958 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-24-d)

<a id="API-BIA-25"></a>
#### API-BIA-25 · `GET /api/admin/bia/custom-reports`

- **Qué hace:** Reportes personalizados (O11) Lista, con filtros y paginación, los registros de generador de reportes del tenant (`customReports`).
- **Para qué sirve:** RF-BIA-043: Ciclo de reporte personalizado: borrador → en revisión → publicado → obsoleto, con aprobación de bia.disenador.publicar y auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.disenador.usar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de generador de reportes del tenant (`customReports`) con `total`.
- **Pantallas:** PAN-BIA-09 (Generador de reportes del tenant).
- **Ola:** O11 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1959 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-25)

<a id="API-BIA-25-b"></a>
#### API-BIA-25-b · `POST /api/admin/bia/custom-reports`

- **Qué hace:** Reportes personalizados (O11) Da de alta un registro de generador de reportes del tenant (`customReports`).
- **Para qué sirve:** RF-BIA-043: Ciclo de reporte personalizado: borrador → en revisión → publicado → obsoleto, con aprobación de bia.disenador.publicar y auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.disenador.usar`.
- **Recibe:** los datos de generador de reportes del tenant (`customReports`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de generador de reportes del tenant (`customReports`).
- **Pantallas:** PAN-BIA-09 (Generador de reportes del tenant).
- **Ola:** O11 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1959 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-25-b)

<a id="API-BIA-25-c"></a>
#### API-BIA-25-c · `GET /api/admin/bia/custom-reports/{id}`

- **Qué hace:** Reportes personalizados (O11) Obtiene el detalle de un registro de generador de reportes del tenant (`customReports`).
- **Para qué sirve:** RF-BIA-043: Ciclo de reporte personalizado: borrador → en revisión → publicado → obsoleto, con aprobación de bia.disenador.publicar y auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.disenador.usar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de generador de reportes del tenant (`customReports`).
- **Pantallas:** PAN-BIA-09 (Generador de reportes del tenant).
- **Ola:** O11 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1959 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-25-c)

<a id="API-BIA-25-d"></a>
#### API-BIA-25-d · `PATCH /api/admin/bia/custom-reports/{id}`

- **Qué hace:** Reportes personalizados (O11) Modifica algunos campos de un registro de generador de reportes del tenant (`customReports`) (solo los enviados).
- **Para qué sirve:** RF-BIA-043: Ciclo de reporte personalizado: borrador → en revisión → publicado → obsoleto, con aprobación de bia.disenador.publicar y auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.disenador.usar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de generador de reportes del tenant (`customReports`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de generador de reportes del tenant (`customReports`).
- **Pantallas:** PAN-BIA-09 (Generador de reportes del tenant).
- **Ola:** O11 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1959 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-25-d)

<a id="API-BIA-26"></a>
#### API-BIA-26 · `POST /api/admin/bia/custom-reports/{id}/preview`

- **Qué hace:** Ciclo §8.1. Previsualiza sin efectos un registro de generador de reportes del tenant (`customReports`).
- **Para qué sirve:** RF-BIA-043: Ciclo de reporte personalizado: borrador → en revisión → publicado → obsoleto, con aprobación de bia.disenador.publicar y auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.disenador.usar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-09 (Generador de reportes del tenant).
- **Ola:** O11 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1960 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-26)

<a id="API-BIA-26-b"></a>
#### API-BIA-26-b · `POST /api/admin/bia/custom-reports/{id}/submit`

- **Qué hace:** Ciclo §8.1. Envía a revisión o presenta un registro de generador de reportes del tenant (`customReports`).
- **Para qué sirve:** RF-BIA-043: Ciclo de reporte personalizado: borrador → en revisión → publicado → obsoleto, con aprobación de bia.disenador.publicar y auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.disenador.usar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-09 (Generador de reportes del tenant).
- **Ola:** O11 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1960 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-26-b)

<a id="API-BIA-26-c"></a>
#### API-BIA-26-c · `POST /api/admin/bia/custom-reports/{id}/approve`

- **Qué hace:** Ciclo §8.1. Aprueba un registro de generador de reportes del tenant (`customReports`).
- **Para qué sirve:** RF-BIA-043: Ciclo de reporte personalizado: borrador → en revisión → publicado → obsoleto, con aprobación de bia.disenador.publicar y auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.disenador.usar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-09 (Generador de reportes del tenant).
- **Ola:** O11 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1960 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-26-c)

<a id="API-BIA-26-d"></a>
#### API-BIA-26-d · `POST /api/admin/bia/custom-reports/{id}/reject`

- **Qué hace:** Ciclo §8.1. Rechaza un registro de generador de reportes del tenant (`customReports`).
- **Para qué sirve:** RF-BIA-043: Ciclo de reporte personalizado: borrador → en revisión → publicado → obsoleto, con aprobación de bia.disenador.publicar y auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.disenador.usar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-09 (Generador de reportes del tenant).
- **Ola:** O11 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1960 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-26-d)

<a id="API-BIA-26-e"></a>
#### API-BIA-26-e · `POST /api/admin/bia/custom-reports/{id}/deprecate`

- **Qué hace:** Ciclo §8.1. Depreca un registro de generador de reportes del tenant (`customReports`).
- **Para qué sirve:** RF-BIA-043: Ciclo de reporte personalizado: borrador → en revisión → publicado → obsoleto, con aprobación de bia.disenador.publicar y auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.disenador.usar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-09 (Generador de reportes del tenant).
- **Ola:** O11 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1960 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-26-e)

<a id="API-BIA-27"></a>
#### API-BIA-27 · `GET /api/admin/bia/indicators`

- **Qué hace:** Catálogo y ficha de indicadores. Lista, con filtros y paginación, los registros de `indicators`.
- **Para qué sirve:** RF-BIA-063: Reconciliación diaria tablero interno vs almacén analítico para indicadores certificados; diferencia → alerta técnica. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.indicadores.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ResultadoGenerico (`ResultadoGenerico`) con `total`.
- **Pantallas:** PAN-BIA-13 (Catálogo de indicadores).
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1961 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-27)

<a id="API-BIA-27-b"></a>
#### API-BIA-27-b · `GET /api/admin/bia/indicators/{code}`

- **Qué hace:** Catálogo y ficha de indicadores. Obtiene el detalle de un registro de `indicators`.
- **Para qué sirve:** RF-BIA-063: Reconciliación diaria tablero interno vs almacén analítico para indicadores certificados; diferencia → alerta técnica. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.indicadores.ver`.
- **Recibe:** en la ruta `code`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-13 (Catálogo de indicadores).
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1961 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-27-b)

<a id="API-BIA-28"></a>
#### API-BIA-28 · `GET /api/admin/bia/indicators/{code}/values`

- **Qué hace:** Valor actual y serie ?period=&from=&to=&dims=. Consulta «values» de un registro de `values`.
- **Para qué sirve:** RF-BIA-063: Reconciliación diaria tablero interno vs almacén analítico para indicadores certificados; diferencia → alerta técnica. · RF-BIA-055: Filtros globales del tablero (período, servicio, sucursal, zona, categoría) respetando alcance. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.tableros.ver`.
- **Recibe:** en la ruta `code`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-UXD-17 (Alertas activas), PAN-BIA-10 (Tablero por rol), PAN-BIA-25 (Tablero móvil (PWA empleado)).
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1962 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-28)

<a id="API-BIA-29"></a>
#### API-BIA-29 · `PATCH /api/admin/bia/indicators/{code}/targets`

- **Qué hace:** Óptimo, umbral, objetivo del tenant. Modifica algunos campos de un registro de `targets` (solo los enviados).
- **Para qué sirve:** RF-BIA-053: Comparación contra período anterior, mismo período del año anterior, objetivo, óptimo y umbral, con estado (ok/advertencia/crítico). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.cubos.certificar`.
- **Recibe:** en la ruta `code`; solo los campos a cambiar; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-13 (Catálogo de indicadores).
- **Ola:** O2 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1963 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-29)

<a id="API-BIA-30"></a>
#### API-BIA-30 · `POST /api/admin/bia/indicators/{code}/propose-version`

- **Qué hace:** Versionado §8.5. Registra «propose-version» sobre un registro de `propose-version`.
- **Para qué sirve:** RF-BIA-047: Certificación y versionado de indicadores; los snapshots guardan la versión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.cubos.certificar`.
- **Recibe:** en la ruta `code`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-13 (Catálogo de indicadores).
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1964 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-30)

<a id="API-BIA-30-b"></a>
#### API-BIA-30-b · `POST /api/admin/bia/indicators/{code}/certify`

- **Qué hace:** Versionado §8.5. Registra «certify» sobre un registro de `certify`.
- **Para qué sirve:** RF-BIA-047: Certificación y versionado de indicadores; los snapshots guardan la versión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.cubos.certificar`.
- **Recibe:** en la ruta `code`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-13 (Catálogo de indicadores).
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1964 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-30-b)

<a id="API-BIA-30-c"></a>
#### API-BIA-30-c · `POST /api/admin/bia/indicators/{code}/deprecate`

- **Qué hace:** Versionado §8.5. Depreca un registro de `deprecate`.
- **Para qué sirve:** RF-BIA-047: Certificación y versionado de indicadores; los snapshots guardan la versión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.cubos.certificar`.
- **Recibe:** en la ruta `code`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-13 (Catálogo de indicadores).
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1964 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-30-c)

<a id="API-BIA-31"></a>
#### API-BIA-31 · `GET /api/admin/bia/dashboards`

- **Qué hace:** Tableros; GET con valores ya calculados. Lista, con filtros y paginación, los registros de tableros (`dashboards`).
- **Para qué sirve:** RF-BIA-063: Reconciliación diaria tablero interno vs almacén analítico para indicadores certificados; diferencia → alerta técnica. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.tableros.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de tableros (`dashboards`) con `total`.
- **Pantallas:** PAN-UXD-17 (Alertas activas), PAN-BIA-10 (Tablero por rol), PAN-BIA-25 (Tablero móvil (PWA empleado)).
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1965 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-31)

<a id="API-BIA-31-b"></a>
#### API-BIA-31-b · `POST /api/admin/bia/dashboards`

- **Qué hace:** Tableros; GET con valores ya calculados. Da de alta un registro de tableros (`dashboards`).
- **Para qué sirve:** RF-BIA-043: Ciclo de reporte personalizado: borrador → en revisión → publicado → obsoleto, con aprobación de bia.disenador.publicar y auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.tableros.disenar`.
- **Recibe:** los datos de tableros (`dashboards`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de tableros (`dashboards`).
- **Pantallas:** PAN-BIA-11 (Diseñador de tableros).
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1965 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-31-b)

<a id="API-BIA-31-c"></a>
#### API-BIA-31-c · `GET /api/admin/bia/dashboards/{code}`

- **Qué hace:** Tableros; GET con valores ya calculados. Obtiene el detalle de un registro de tableros (`dashboards`).
- **Para qué sirve:** RF-BIA-063: Reconciliación diaria tablero interno vs almacén analítico para indicadores certificados; diferencia → alerta técnica. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.tableros.ver`.
- **Recibe:** en la ruta `code`.
- **Devuelve:** 200: el registro de tableros (`dashboards`).
- **Pantallas:** PAN-UXD-17 (Alertas activas), PAN-BIA-10 (Tablero por rol), PAN-BIA-25 (Tablero móvil (PWA empleado)).
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1965 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-31-c)

<a id="API-BIA-31-d"></a>
#### API-BIA-31-d · `PATCH /api/admin/bia/dashboards/{code}`

- **Qué hace:** Tableros; GET con valores ya calculados. Modifica algunos campos de un registro de tableros (`dashboards`) (solo los enviados).
- **Para qué sirve:** RF-BIA-043: Ciclo de reporte personalizado: borrador → en revisión → publicado → obsoleto, con aprobación de bia.disenador.publicar y auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.tableros.disenar`.
- **Recibe:** en la ruta `code`; solo los campos a cambiar de tableros (`dashboards`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de tableros (`dashboards`).
- **Pantallas:** PAN-BIA-11 (Diseñador de tableros).
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1965 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-31-d)

<a id="API-BIA-32"></a>
#### API-BIA-32 · `PUT /api/admin/bia/dashboards/{code}/prefs`

- **Qué hace:** Preferencias personales. Reemplaza o configura tableros (`dashboards`).
- **Para qué sirve:** RF-BIA-063: Reconciliación diaria tablero interno vs almacén analítico para indicadores certificados; diferencia → alerta técnica. · RF-BIA-042: Prohibido SQL libre, procedimientos almacenados o selección de tablas internas en reportes personalizados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.tableros.ver`.
- **Recibe:** en la ruta `code`; los datos de tableros (`dashboards`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de tableros (`dashboards`).
- **Pantallas:** PAN-UXD-17 (Alertas activas), PAN-BIA-10 (Tablero por rol), PAN-BIA-25 (Tablero móvil (PWA empleado)).
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1966 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-32)

<a id="API-BIA-33"></a>
#### API-BIA-33 · `GET /api/admin/bia/alert-rules`

- **Qué hace:** Reglas; POST /:id/simulate. Lista, con filtros y paginación, los registros de alertas sobre indicadores (`kpiAlertRules`).
- **Para qué sirve:** RF-BIA-063: Reconciliación diaria tablero interno vs almacén analítico para indicadores certificados; diferencia → alerta técnica. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.alertas.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de alertas sobre indicadores (`kpiAlertRules`) con `total`.
- **Pantallas:** PAN-BIA-14 (Alertas de indicadores).
- **Ola:** O2 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1967 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-33)

<a id="API-BIA-33-b"></a>
#### API-BIA-33-b · `POST /api/admin/bia/alert-rules`

- **Qué hace:** Reglas; POST /:id/simulate. Da de alta un registro de alertas sobre indicadores (`kpiAlertRules`).
- **Para qué sirve:** RF-BIA-063: Reconciliación diaria tablero interno vs almacén analítico para indicadores certificados; diferencia → alerta técnica. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.alertas.configurar`.
- **Recibe:** los datos de alertas sobre indicadores (`kpiAlertRules`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de alertas sobre indicadores (`kpiAlertRules`).
- **Pantallas:** PAN-BIA-14 (Alertas de indicadores).
- **Ola:** O2 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1967 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-33-b)

<a id="API-BIA-33-c"></a>
#### API-BIA-33-c · `GET /api/admin/bia/alert-rules/{id}`

- **Qué hace:** Reglas; POST /:id/simulate. Obtiene el detalle de un registro de alertas sobre indicadores (`kpiAlertRules`).
- **Para qué sirve:** RF-BIA-063: Reconciliación diaria tablero interno vs almacén analítico para indicadores certificados; diferencia → alerta técnica. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.alertas.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de alertas sobre indicadores (`kpiAlertRules`).
- **Pantallas:** PAN-BIA-14 (Alertas de indicadores).
- **Ola:** O2 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1967 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-33-c)

<a id="API-BIA-33-d"></a>
#### API-BIA-33-d · `PATCH /api/admin/bia/alert-rules/{id}`

- **Qué hace:** Reglas; POST /:id/simulate. Modifica algunos campos de un registro de alertas sobre indicadores (`kpiAlertRules`) (solo los enviados).
- **Para qué sirve:** RF-BIA-063: Reconciliación diaria tablero interno vs almacén analítico para indicadores certificados; diferencia → alerta técnica. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.alertas.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de alertas sobre indicadores (`kpiAlertRules`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de alertas sobre indicadores (`kpiAlertRules`).
- **Pantallas:** PAN-BIA-14 (Alertas de indicadores).
- **Ola:** O2 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1967 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-33-d)

<a id="API-BIA-34"></a>
#### API-BIA-34 · `GET /api/admin/bia/alerts`

- **Qué hace:** Bandeja. Lista, con filtros y paginación, los registros de alertas disparadas (`kpiAlerts`).
- **Para qué sirve:** RF-BIA-063: Reconciliación diaria tablero interno vs almacén analítico para indicadores certificados; diferencia → alerta técnica. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.alertas.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de alertas disparadas (`kpiAlerts`) con `total`.
- **Pantallas:** PAN-BIA-14 (Alertas de indicadores).
- **Ola:** O2 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1968 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-34)

<a id="API-BIA-35"></a>
#### API-BIA-35 · `POST /api/admin/bia/alerts/{id}/acknowledge`

- **Qué hace:** Transiciones §8.9. Toma conocimiento de un registro de alertas disparadas (`kpiAlerts`).
- **Para qué sirve:** RF-BIA-063: Reconciliación diaria tablero interno vs almacén analítico para indicadores certificados; diferencia → alerta técnica. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.alertas.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-14 (Alertas de indicadores).
- **Ola:** O2 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1969 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-35)

<a id="API-BIA-35-b"></a>
#### API-BIA-35-b · `POST /api/admin/bia/alerts/{id}/resolve`

- **Qué hace:** Transiciones §8.9. Resuelve un registro de alertas disparadas (`kpiAlerts`).
- **Para qué sirve:** RF-BIA-063: Reconciliación diaria tablero interno vs almacén analítico para indicadores certificados; diferencia → alerta técnica. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.alertas.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-14 (Alertas de indicadores).
- **Ola:** O2 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1969 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-35-b)

<a id="API-BIA-35-c"></a>
#### API-BIA-35-c · `POST /api/admin/bia/alerts/{id}/mute`

- **Qué hace:** Transiciones §8.9. Silencia un registro de alertas disparadas (`kpiAlerts`).
- **Para qué sirve:** RF-BIA-063: Reconciliación diaria tablero interno vs almacén analítico para indicadores certificados; diferencia → alerta técnica. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.alertas.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-14 (Alertas de indicadores).
- **Ola:** O2 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1969 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-35-c)

<a id="API-BIA-36"></a>
#### API-BIA-36 · `GET /api/admin/bia/datasets`

- **Qué hace:** Datasets semánticos y exposición. Lista, con filtros y paginación, los registros de datasets certificados (`analyticsDatasets`).
- **Para qué sirve:** RF-BIA-041: Generador de reportes del tenant sobre datasets semánticos: elegir dataset, campos, filtros, agrupaciones, métricas, orden, formato condicional, totales y gráfico. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.datasets.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de datasets certificados (`analyticsDatasets`) con `total`.
- **Pantallas:** PAN-BIA-18 (Datasets semánticos).
- **Ola:** O11 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1970 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-36)

<a id="API-BIA-36-b"></a>
#### API-BIA-36-b · `GET /api/admin/bia/datasets/{code}`

- **Qué hace:** Datasets semánticos y exposición. Obtiene el detalle de un registro de datasets certificados (`analyticsDatasets`).
- **Para qué sirve:** RF-BIA-041: Generador de reportes del tenant sobre datasets semánticos: elegir dataset, campos, filtros, agrupaciones, métricas, orden, formato condicional, totales y gráfico. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.datasets.ver`.
- **Recibe:** en la ruta `code`.
- **Devuelve:** 200: el registro de datasets certificados (`analyticsDatasets`).
- **Pantallas:** PAN-BIA-18 (Datasets semánticos).
- **Ola:** O11 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1970 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-36-b)

<a id="API-BIA-36-c"></a>
#### API-BIA-36-c · `PATCH /api/admin/bia/datasets/{code}`

- **Qué hace:** Datasets semánticos y exposición. Modifica algunos campos de un registro de datasets certificados (`analyticsDatasets`) (solo los enviados).
- **Para qué sirve:** RF-BIA-041: Generador de reportes del tenant sobre datasets semánticos: elegir dataset, campos, filtros, agrupaciones, métricas, orden, formato condicional, totales y gráfico. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.datasets.configurar`.
- **Recibe:** en la ruta `code`; solo los campos a cambiar de datasets certificados (`analyticsDatasets`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de datasets certificados (`analyticsDatasets`).
- **Pantallas:** PAN-BIA-18 (Datasets semánticos).
- **Ola:** O11 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1970 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-36-c)

<a id="API-BIA-37"></a>
#### API-BIA-37 · `GET /api/admin/bia/rooms/{room}/summary`

- **Qué hace:** Zona A de la sala. Consulta «summary» de un registro de `summary`.
- **Para qué sirve:** RF-BIA-068: Análisis automático cacheado por sala (recalcula cada PRM-BIA-034 horas o al cambiar el universo); capa A funciona sin IA. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.bi.ver`.
- **Recibe:** en la ruta `room`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-12 (Sala BI).
- **Ola:** O11 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1971 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-37)

<a id="API-BIA-38"></a>
#### API-BIA-38 · `GET /api/admin/bia/rooms/{room}/items`

- **Qué hace:** Zona B paginada. Consulta «items» de un registro de `items`.
- **Para qué sirve:** RF-BIA-079: Errores RFC 9457 con requestId, sin revelar secretos ni detalles internos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.bi.ver`.
- **Recibe:** en la ruta `room`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-12 (Sala BI).
- **Ola:** O11 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1972 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-38)

<a id="API-BIA-39"></a>
#### API-BIA-39 · `POST /api/admin/bia/rooms/{room}/export`

- **Qué hace:** Export.xlsx de la sala. Exporta un registro de `export`.
- **Para qué sirve:** RF-BIA-021: Exportación de cualquier DataTable del sistema a XLSX, CSV y PDF e impresión, con columnas visibles o todas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.bi.ver`.
- **Recibe:** en la ruta `room`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-12 (Sala BI).
- **Ola:** O2 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1973 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-39)

<a id="API-BIA-40"></a>
#### API-BIA-40 · `POST /api/admin/bia/rooms/{room}/analyze-auto`

- **Qué hace:** Análisis automático (cacheado) Registra «analyze-auto» sobre un registro de `analyze-auto`.
- **Para qué sirve:** RF-BIA-068: Análisis automático cacheado por sala (recalcula cada PRM-BIA-034 horas o al cambiar el universo); capa A funciona sin IA. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.ia.consultar`.
- **Recibe:** en la ruta `room`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-12 (Sala BI).
- **Ola:** O11 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1974 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-40)

<a id="API-BIA-41"></a>
#### API-BIA-41 · `POST /api/admin/bia/rooms/{room}/ask`

- **Qué hace:** Pregunta en lenguaje natural → respuesta con citas. Registra «ask» sobre un registro de `ask`.
- **Para qué sirve:** RF-BIA-066: IA analítica: preguntas en lenguaje natural (de catálogo o libres) traducidas a consulta semántica; respuesta con cifras, KPI/dataset citado, universo y corte. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.ia.consultar`.
- **Recibe:** en la ruta `room`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-12 (Sala BI).
- **Ola:** O11 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1975 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-41)

<a id="API-BIA-42"></a>
#### API-BIA-42 · `POST /api/admin/bia/ai-questions/{id}/feedback`

- **Qué hace:** Valoración. Registra «feedback» sobre un registro de preguntas analíticas a IA (`aiQuestions`).
- **Para qué sirve:** RF-BIA-066: IA analítica: preguntas en lenguaje natural (de catálogo o libres) traducidas a consulta semántica; respuesta con cifras, KPI/dataset citado, universo y corte. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.ia.consultar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-12 (Sala BI).
- **Ola:** O11 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1976 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-42)

<a id="API-BIA-43"></a>
#### API-BIA-43 · `POST /api/admin/bia/rooms/{room}/schedule`

- **Qué hace:** Programar envío de la sala. Programa un registro de `schedule`.
- **Para qué sirve:** RF-BIA-044: Galería de plantillas de reportes personalizados provista por plataforma, copiables al tenant (sin datos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.reportes.programar`.
- **Recibe:** en la ruta `room`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-05 (Programaciones).
- **Ola:** O2 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1977 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-43)

<a id="API-BIA-44"></a>
#### API-BIA-44 · `GET /api/admin/bia/api-clients`

- **Qué hace:** Perfil de datos del cliente (finalidad, scopes, restricciones, límites) Lista, con filtros y paginación, los registros de clientes API de terceros (`apiClients`).
- **Para qué sirve:** RF-BIA-070: Registro de clientes de API por tenant con responsable, finalidad, sistema, contacto técnico, estado, scopes, restricciones (IP, sucursales, servicios) y vigencia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.api.clientes.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de clientes API de terceros (`apiClients`) con `total`.
- **Pantallas:** PAN-BIA-15 (Clientes de API).
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1978 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-44)

<a id="API-BIA-44-b"></a>
#### API-BIA-44-b · `POST /api/admin/bia/api-clients`

- **Qué hace:** Perfil de datos del cliente (finalidad, scopes, restricciones, límites) Da de alta un registro de clientes API de terceros (`apiClients`).
- **Para qué sirve:** RF-BIA-070: Registro de clientes de API por tenant con responsable, finalidad, sistema, contacto técnico, estado, scopes, restricciones (IP, sucursales, servicios) y vigencia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.api.clientes.crear`.
- **Recibe:** los datos de clientes API de terceros (`apiClients`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de clientes API de terceros (`apiClients`).
- **Pantallas:** PAN-BIA-15 (Clientes de API).
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1978 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-44-b)

<a id="API-BIA-44-c"></a>
#### API-BIA-44-c · `GET /api/admin/bia/api-clients/{id}`

- **Qué hace:** Perfil de datos del cliente (finalidad, scopes, restricciones, límites) Obtiene el detalle de un registro de clientes API de terceros (`apiClients`).
- **Para qué sirve:** RF-BIA-070: Registro de clientes de API por tenant con responsable, finalidad, sistema, contacto técnico, estado, scopes, restricciones (IP, sucursales, servicios) y vigencia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.api.clientes.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de clientes API de terceros (`apiClients`).
- **Pantallas:** PAN-BIA-15 (Clientes de API).
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1978 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-44-c)

<a id="API-BIA-44-d"></a>
#### API-BIA-44-d · `PATCH /api/admin/bia/api-clients/{id}`

- **Qué hace:** Perfil de datos del cliente (finalidad, scopes, restricciones, límites) Modifica algunos campos de un registro de clientes API de terceros (`apiClients`) (solo los enviados).
- **Para qué sirve:** RF-BIA-070: Registro de clientes de API por tenant con responsable, finalidad, sistema, contacto técnico, estado, scopes, restricciones (IP, sucursales, servicios) y vigencia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.api.clientes.crear`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de clientes API de terceros (`apiClients`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de clientes API de terceros (`apiClients`).
- **Pantallas:** PAN-BIA-15 (Clientes de API).
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1978 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-44-d)

<a id="API-BIA-45"></a>
#### API-BIA-45 · `POST /api/admin/bia/api-clients/{id}/approve`

- **Qué hace:** Transiciones §8.6. Aprueba un registro de clientes API de terceros (`apiClients`).
- **Para qué sirve:** RF-BIA-043: Ciclo de reporte personalizado: borrador → en revisión → publicado → obsoleto, con aprobación de bia.disenador.publicar y auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.api.clientes.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-15 (Clientes de API).
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1979 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-45)

<a id="API-BIA-45-b"></a>
#### API-BIA-45-b · `POST /api/admin/bia/api-clients/{id}/reject`

- **Qué hace:** Transiciones §8.6. Rechaza un registro de clientes API de terceros (`apiClients`).
- **Para qué sirve:** RF-BIA-043: Ciclo de reporte personalizado: borrador → en revisión → publicado → obsoleto, con aprobación de bia.disenador.publicar y auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.api.clientes.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-15 (Clientes de API).
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1979 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-45-b)

<a id="API-BIA-45-c"></a>
#### API-BIA-45-c · `POST /api/admin/bia/api-clients/{id}/suspend`

- **Qué hace:** Transiciones §8.6. Suspende un registro de clientes API de terceros (`apiClients`).
- **Para qué sirve:** RF-BIA-043: Ciclo de reporte personalizado: borrador → en revisión → publicado → obsoleto, con aprobación de bia.disenador.publicar y auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.api.clientes.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-15 (Clientes de API).
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1979 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-45-c)

<a id="API-BIA-45-d"></a>
#### API-BIA-45-d · `POST /api/admin/bia/api-clients/{id}/reactivate`

- **Qué hace:** Transiciones §8.6. Reactiva un registro de clientes API de terceros (`apiClients`).
- **Para qué sirve:** RF-BIA-043: Ciclo de reporte personalizado: borrador → en revisión → publicado → obsoleto, con aprobación de bia.disenador.publicar y auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.api.clientes.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-15 (Clientes de API).
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1979 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-45-d)

<a id="API-BIA-45-e"></a>
#### API-BIA-45-e · `POST /api/admin/bia/api-clients/{id}/revoke`

- **Qué hace:** Transiciones §8.6. Revoca un registro de clientes API de terceros (`apiClients`).
- **Para qué sirve:** RF-BIA-043: Ciclo de reporte personalizado: borrador → en revisión → publicado → obsoleto, con aprobación de bia.disenador.publicar y auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.api.clientes.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-15 (Clientes de API).
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1979 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-45-e)

<a id="API-BIA-46"></a>
#### API-BIA-46 · `POST /api/admin/bia/api-clients/{id}/credentials`

- **Qué hace:** Emite/rota/revoca delegando en T02 (API-IAM-47); secreto en la respuesta una sola vez. Registra «credentials» sobre un registro de clientes API de terceros (`apiClients`).
- **Para qué sirve:** RF-BIA-072: Secretos mostrados una sola vez, guardados con hash, con prefijo visible; rotación con solapamiento; expiración; revocación efectiva ≤ PRM-BIA-043 segundos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.api.credenciales.rotar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-15 (Clientes de API).
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1980 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-46)

<a id="API-BIA-46-b"></a>
#### API-BIA-46-b · `POST /api/admin/bia/api-clients/{id}/credentials/{credId}/rotate`

- **Qué hace:** Emite/rota/revoca delegando en T02 (API-IAM-47); secreto en la respuesta una sola vez. Rota las credenciales de un registro de clientes API de terceros (`apiClients`).
- **Para qué sirve:** RF-BIA-072: Secretos mostrados una sola vez, guardados con hash, con prefijo visible; rotación con solapamiento; expiración; revocación efectiva ≤ PRM-BIA-043 segundos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.api.credenciales.rotar`.
- **Recibe:** en la ruta `id`, `credId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-15 (Clientes de API).
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1980 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-46-b)

<a id="API-BIA-46-c"></a>
#### API-BIA-46-c · `POST /api/admin/bia/api-clients/{id}/credentials/{credId}/revoke`

- **Qué hace:** Emite/rota/revoca delegando en T02 (API-IAM-47); secreto en la respuesta una sola vez. Revoca un registro de clientes API de terceros (`apiClients`).
- **Para qué sirve:** RF-BIA-072: Secretos mostrados una sola vez, guardados con hash, con prefijo visible; rotación con solapamiento; expiración; revocación efectiva ≤ PRM-BIA-043 segundos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.api.credenciales.rotar`.
- **Recibe:** en la ruta `id`, `credId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-15 (Clientes de API).
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1980 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-46-c)

<a id="API-BIA-47"></a>
#### API-BIA-47 · `GET /api/admin/bia/api-usage`

- **Qué hace:** Uso agregado y errores. Lista, con filtros y paginación, los registros de hecho uso de API (`bi_fact_apiUsage`).
- **Para qué sirve:** RF-BIA-048: Tablero de plataforma (GOB-001): tenants y estados, errores de procesos e integraciones, trabajos pendientes, disponibilidad, configuraciones incompletas, uso de API; sólo agregados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.api.uso.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de hecho uso de API (`bi_fact_apiUsage`) con `total`.
- **Pantallas:** PAN-BIA-16 (Uso y cuotas de API).
- **Ola:** O11 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1981 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-47)

<a id="API-BIA-48"></a>
#### API-BIA-48 · `GET /api/admin/bia/webhook-subscriptions`

- **Qué hace:** Suscripciones (alta en nombre de un cliente) Lista, con filtros y paginación, los registros de suscripciones de webhooks salientes (`extWebhookSubscriptions`).
- **Para qué sirve:** RF-BIA-083: Webhooks salientes opcionales firmados (HMAC-SHA256 con timestamp), reintentos con backoff, cola de no entregados, reenvío manual y prueba. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.api.webhooks.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de suscripciones de webhooks salientes (`extWebhookSubscriptions`) con `total`.
- **Pantallas:** PAN-BIA-17 (Webhooks salientes y entregas).
- **Ola:** O11 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1982 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-48)

<a id="API-BIA-48-b"></a>
#### API-BIA-48-b · `POST /api/admin/bia/webhook-subscriptions`

- **Qué hace:** Suscripciones (alta en nombre de un cliente) Da de alta un registro de suscripciones de webhooks salientes (`extWebhookSubscriptions`).
- **Para qué sirve:** RF-BIA-083: Webhooks salientes opcionales firmados (HMAC-SHA256 con timestamp), reintentos con backoff, cola de no entregados, reenvío manual y prueba. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.api.webhooks.configurar`.
- **Recibe:** los datos de suscripciones de webhooks salientes (`extWebhookSubscriptions`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de suscripciones de webhooks salientes (`extWebhookSubscriptions`).
- **Pantallas:** PAN-BIA-17 (Webhooks salientes y entregas).
- **Ola:** O11 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1982 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-48-b)

<a id="API-BIA-48-c"></a>
#### API-BIA-48-c · `GET /api/admin/bia/webhook-subscriptions/{id}`

- **Qué hace:** Suscripciones (alta en nombre de un cliente) Obtiene el detalle de un registro de suscripciones de webhooks salientes (`extWebhookSubscriptions`).
- **Para qué sirve:** RF-BIA-083: Webhooks salientes opcionales firmados (HMAC-SHA256 con timestamp), reintentos con backoff, cola de no entregados, reenvío manual y prueba. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.api.webhooks.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de suscripciones de webhooks salientes (`extWebhookSubscriptions`).
- **Pantallas:** PAN-BIA-17 (Webhooks salientes y entregas).
- **Ola:** O11 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1982 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-48-c)

<a id="API-BIA-48-e"></a>
#### API-BIA-48-e · `DELETE /api/admin/bia/webhook-subscriptions/{id}`

- **Qué hace:** Suscripciones (alta en nombre de un cliente) Elimina o da de baja un registro de suscripciones de webhooks salientes (`extWebhookSubscriptions`).
- **Para qué sirve:** RF-BIA-083: Webhooks salientes opcionales firmados (HMAC-SHA256 con timestamp), reintentos con backoff, cola de no entregados, reenvío manual y prueba. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.api.webhooks.configurar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-BIA-17 (Webhooks salientes y entregas).
- **Ola:** O11 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1982 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-48-e)

<a id="API-BIA-48-d"></a>
#### API-BIA-48-d · `PATCH /api/admin/bia/webhook-subscriptions/{id}`

- **Qué hace:** Suscripciones (alta en nombre de un cliente) Modifica algunos campos de un registro de suscripciones de webhooks salientes (`extWebhookSubscriptions`) (solo los enviados).
- **Para qué sirve:** RF-BIA-083: Webhooks salientes opcionales firmados (HMAC-SHA256 con timestamp), reintentos con backoff, cola de no entregados, reenvío manual y prueba. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.api.webhooks.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de suscripciones de webhooks salientes (`extWebhookSubscriptions`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de suscripciones de webhooks salientes (`extWebhookSubscriptions`).
- **Pantallas:** PAN-BIA-17 (Webhooks salientes y entregas).
- **Ola:** O11 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1982 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-48-d)

<a id="API-BIA-49"></a>
#### API-BIA-49 · `GET /api/admin/bia/webhook-deliveries`

- **Qué hace:** Entregas. Lista, con filtros y paginación, los registros de entregas de webhooks; TTL (`extWebhookDeliveries`).
- **Para qué sirve:** RF-BIA-083: Webhooks salientes opcionales firmados (HMAC-SHA256 con timestamp), reintentos con backoff, cola de no entregados, reenvío manual y prueba. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.api.webhooks.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de entregas de webhooks; TTL (`extWebhookDeliveries`) con `total`.
- **Pantallas:** PAN-BIA-17 (Webhooks salientes y entregas).
- **Ola:** O11 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1983 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-49)

<a id="API-BIA-50"></a>
#### API-BIA-50 · `POST /api/admin/bia/webhook-deliveries/{id}/redeliver`

- **Qué hace:** Reenvío. Reentrega un registro de entregas de webhooks; TTL (`extWebhookDeliveries`).
- **Para qué sirve:** RF-BIA-083: Webhooks salientes opcionales firmados (HMAC-SHA256 con timestamp), reintentos con backoff, cola de no entregados, reenvío manual y prueba. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.api.webhooks.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-17 (Webhooks salientes y entregas).
- **Ola:** O11 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1984 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-50)

<a id="API-BIA-50-b"></a>
#### API-BIA-50-b · `POST /api/admin/bia/webhook-deliveries/redeliver-bulk`

- **Qué hace:** Reenvío. Registra un nuevo elemento u operación en entregas de webhooks; TTL (`extWebhookDeliveries`).
- **Para qué sirve:** RF-BIA-083: Webhooks salientes opcionales firmados (HMAC-SHA256 con timestamp), reintentos con backoff, cola de no entregados, reenvío manual y prueba. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.api.webhooks.configurar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-17 (Webhooks salientes y entregas).
- **Ola:** O11 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1984 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-50-b)

<a id="API-BIA-51"></a>
#### API-BIA-51 · `GET /api/admin/bia/access-logs`

- **Qué hace:** Auditoría de accesos a reportes. Lista, con filtros y paginación, los registros de accesos a reportes (`reportAccessLogs`).
- **Para qué sirve:** RF-BIA-043: Ciclo de reporte personalizado: borrador → en revisión → publicado → obsoleto, con aprobación de bia.disenador.publicar y auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.auditoria.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de accesos a reportes (`reportAccessLogs`) con `total`.
- **Pantallas:** PAN-BIA-19 (Auditoría de accesos a reportes).
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1985 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-51)

<a id="API-BIA-52"></a>
#### API-BIA-52 · `GET /api/admin/bia/open-data`

- **Qué hace:** Publicaciones. Consulta `open-data`.
- **Para qué sirve:** RF-BIA-079: Errores RFC 9457 con requestId, sin revelar secretos ni detalles internos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.datosAbiertos.publicar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-21 (Datos abiertos).
- **Ola:** O11 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1986 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-52)

<a id="API-BIA-52-b"></a>
#### API-BIA-52-b · `POST /api/admin/bia/open-data`

- **Qué hace:** Publicaciones. Registra un nuevo elemento u operación en `open-data`.
- **Para qué sirve:** RF-BIA-079: Errores RFC 9457 con requestId, sin revelar secretos ni detalles internos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.datosAbiertos.publicar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-21 (Datos abiertos).
- **Ola:** O11 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1986 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-52-b)

<a id="API-BIA-52-c"></a>
#### API-BIA-52-c · `GET /api/admin/bia/open-data/{id}`

- **Qué hace:** Publicaciones. Obtiene el detalle de un registro de `open-data`.
- **Para qué sirve:** RF-BIA-079: Errores RFC 9457 con requestId, sin revelar secretos ni detalles internos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.datosAbiertos.publicar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-21 (Datos abiertos).
- **Ola:** O11 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1986 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-52-c)

<a id="API-BIA-52-d"></a>
#### API-BIA-52-d · `PATCH /api/admin/bia/open-data/{id}`

- **Qué hace:** Publicaciones. Modifica algunos campos de un registro de `open-data` (solo los enviados).
- **Para qué sirve:** RF-BIA-079: Errores RFC 9457 con requestId, sin revelar secretos ni detalles internos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.datosAbiertos.publicar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-21 (Datos abiertos).
- **Ola:** O11 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1986 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-52-d)

<a id="API-BIA-53"></a>
#### API-BIA-53 · `POST /api/admin/bia/open-data/{id}/preview`

- **Qué hace:** Ciclo §8.10. Previsualiza sin efectos un registro de `preview`.
- **Para qué sirve:** RF-BIA-043: Ciclo de reporte personalizado: borrador → en revisión → publicado → obsoleto, con aprobación de bia.disenador.publicar y auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.datosAbiertos.publicar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-21 (Datos abiertos).
- **Ola:** O11 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1987 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-53)

<a id="API-BIA-53-b"></a>
#### API-BIA-53-b · `POST /api/admin/bia/open-data/{id}/approve`

- **Qué hace:** Ciclo §8.10. Aprueba un registro de `approve`.
- **Para qué sirve:** RF-BIA-043: Ciclo de reporte personalizado: borrador → en revisión → publicado → obsoleto, con aprobación de bia.disenador.publicar y auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.datosAbiertos.publicar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-21 (Datos abiertos).
- **Ola:** O11 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1987 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-53-b)

<a id="API-BIA-53-c"></a>
#### API-BIA-53-c · `POST /api/admin/bia/open-data/{id}/publish`

- **Qué hace:** Ciclo §8.10. Publica un registro de `publish`.
- **Para qué sirve:** RF-BIA-043: Ciclo de reporte personalizado: borrador → en revisión → publicado → obsoleto, con aprobación de bia.disenador.publicar y auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.datosAbiertos.publicar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-21 (Datos abiertos).
- **Ola:** O11 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1987 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-53-c)

<a id="API-BIA-53-d"></a>
#### API-BIA-53-d · `POST /api/admin/bia/open-data/{id}/withdraw`

- **Qué hace:** Ciclo §8.10. Retira un registro de `withdraw`.
- **Para qué sirve:** RF-BIA-043: Ciclo de reporte personalizado: borrador → en revisión → publicado → obsoleto, con aprobación de bia.disenador.publicar y auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.datosAbiertos.publicar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-21 (Datos abiertos).
- **Ola:** O11 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1987 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-53-d)

<a id="API-BIA-54"></a>
#### API-BIA-54 · `GET /api/admin/bia/benchmark/participation`

- **Qué hace:** Adhesión y segmento. Consulta `participation`.
- **Para qué sirve:** RF-BIA-069: Benchmarking anónimo opcional entre cooperativas por segmento (servicio, tamaño, provincia) con mínimo k tenants por celda. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.benchmark.configurar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-20 (Benchmark entre cooperativas).
- **Ola:** O11 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1988 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-54)

<a id="API-BIA-54-b"></a>
#### API-BIA-54-b · `PUT /api/admin/bia/benchmark/participation`

- **Qué hace:** Adhesión y segmento. Reemplaza o configura `participation`.
- **Para qué sirve:** RF-BIA-069: Benchmarking anónimo opcional entre cooperativas por segmento (servicio, tamaño, provincia) con mínimo k tenants por celda. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.benchmark.configurar`.
- **Recibe:** un cuerpo JSON cuya estructura detalla el anexo; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-20 (Benchmark entre cooperativas).
- **Ola:** O11 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1988 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-54-b)

<a id="API-BIA-55"></a>
#### API-BIA-55 · `GET /api/admin/bia/benchmark/results`

- **Qué hace:** Percentiles del tenant. Lista, con filtros y paginación, los registros de resultados temporales de ejecución; TTL (`reportRunResults`).
- **Para qué sirve:** RF-BIA-069: Benchmarking anónimo opcional entre cooperativas por segmento (servicio, tamaño, provincia) con mínimo k tenants por celda. · RF-BIA-044: Galería de plantillas de reportes personalizados provista por plataforma, copiables al tenant (sin datos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.benchmark.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de resultados temporales de ejecución; TTL (`reportRunResults`) con `total`.
- **Pantallas:** PAN-BIA-20 (Benchmark entre cooperativas).
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1989 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-55)

<a id="API-BIA-56"></a>
#### API-BIA-56 · `GET /api/admin/bia/regulatory-catalog`

- **Qué hace:** Catálogo regulatorio con vencimientos y estado. Lista, con filtros y paginación, los registros de `regulatory-catalog`.
- **Para qué sirve:** RF-BIA-090: Catálogo de informes regulatorios por organismo y servicio con período y vencimiento, referenciando el formato y la presentación del módulo dueño. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `bia.reportes.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ResultadoGenerico (`ResultadoGenerico`) con `total`.
- **Pantallas:** PAN-BIA-01 (Catálogo de reportes), PAN-BIA-03 (Mis corridas), PAN-BIA-06 (Presets y vistas guardadas) y 1 más.
- **Ola:** O4 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1990 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-56)

<a id="API-BIA-57"></a>
#### API-BIA-57 · `GET /api/bia/my-dashboard`

- **Qué hace:** Tablero móvil (PWA empleado) Lista, con filtros y paginación, los registros de `my-dashboard`.
- **Para qué sirve:** RF-BIA-057: Tablero móvil en PWA empleado (cards KPI). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `bia.tableros.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ResultadoGenerico (`ResultadoGenerico`) con `total`.
- **Pantallas:** PAN-UXD-17 (Alertas activas), PAN-BIA-10 (Tablero por rol), PAN-BIA-25 (Tablero móvil (PWA empleado)).
- **Ola:** O2 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1991 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-57)

<a id="API-BIA-58"></a>
#### API-BIA-58 · `GET /api/platform/bia/dashboard`

- **Qué hace:** Indicadores globales GOB-001 (consumido por PAN-PLA-01) Lista, con filtros y paginación, los registros de tableros (`dashboards`).
- **Para qué sirve:** RF-BIA-063: Reconciliación diaria tablero interno vs almacén analítico para indicadores certificados; diferencia → alerta técnica. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.bia.tablero.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de tableros (`dashboards`) con `total`.
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1992 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-58)

<a id="API-BIA-59"></a>
#### API-BIA-59 · `GET /api/platform/bia/api-usage`

- **Qué hace:** Uso de API por tenant (agregado) Lista, con filtros y paginación, los registros de hecho uso de API (`bi_fact_apiUsage`).
- **Para qué sirve:** RF-BIA-048: Tablero de plataforma (GOB-001): tenants y estados, errores de procesos e integraciones, trabajos pendientes, disponibilidad, configuraciones incompletas, uso de API; sólo agregados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.bia.api.monitorear`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de hecho uso de API (`bi_fact_apiUsage`) con `total`.
- **Pantallas:** PAN-BIA-23 (Monitoreo de BI y API (plataforma)).
- **Ola:** O11 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1993 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-59)

<a id="API-BIA-60"></a>
#### API-BIA-60 · `GET /api/platform/bia/analytics-health`

- **Qué hace:** Frescura, reconciliación, proyecciones. Consulta `analytics-health`.
- **Para qué sirve:** RF-BIA-063: Reconciliación diaria tablero interno vs almacén analítico para indicadores certificados; diferencia → alerta técnica. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.bia.api.monitorear`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-23 (Monitoreo de BI y API (plataforma)).
- **Ola:** O11 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1994 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-60)

<a id="API-BIA-61"></a>
#### API-BIA-61 · `POST /api/platform/bia/projections/{domain}/rebuild`

- **Qué hace:** Reconstrucción por tenant (JOB-BIA-12) Registra «rebuild» sobre un registro de `rebuild`; el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-BIA-062: Reconstrucción completa de una proyección por tenant desde la fuente (job bia:reconstruir-proyeccion). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.bia.catalogo.administrar`.
- **Recibe:** en la ruta `domain`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-BIA-23 (Monitoreo de BI y API (plataforma)).
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1995 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-61)

<a id="API-BIA-62"></a>
#### API-BIA-62 · `POST /api/platform/bia/system-catalog/reports/{code}/publish`

- **Qué hace:** Publicar versión de sistema. Publica un registro de generador de reportes del tenant (`customReports`).
- **Para qué sirve:** RF-BIA-001: Catálogo único de reportes (reportDefinitions) con código REP, nombre por clave de diccionario, módulo dueño, propósito, granularidad, parámetros, columnas, capabilities, sensibilidad, salidas y versión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.bia.catalogo.administrar`.
- **Recibe:** en la ruta `code`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-23 (Monitoreo de BI y API (plataforma)).
- **Ola:** O11 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1996 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-62)

<a id="API-BIA-62-b"></a>
#### API-BIA-62-b · `POST /api/platform/bia/system-catalog/indicators/{code}/publish`

- **Qué hace:** Publicar versión de sistema. Publica un registro de `publish`.
- **Para qué sirve:** RF-BIA-001: Catálogo único de reportes (reportDefinitions) con código REP, nombre por clave de diccionario, módulo dueño, propósito, granularidad, parámetros, columnas, capabilities, sensibilidad, salidas y versión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.bia.catalogo.administrar`.
- **Recibe:** en la ruta `code`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-23 (Monitoreo de BI y API (plataforma)).
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1996 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-62-b)

<a id="API-BIA-62-c"></a>
#### API-BIA-62-c · `POST /api/platform/bia/system-catalog/templates/{code}/publish`

- **Qué hace:** Publicar versión de sistema. Publica un registro de plantillas de reporte (`reportTemplates`).
- **Para qué sirve:** RF-BIA-044: Galería de plantillas de reportes personalizados provista por plataforma, copiables al tenant (sin datos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.bia.catalogo.administrar`.
- **Recibe:** en la ruta `code`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-23 (Monitoreo de BI y API (plataforma)).
- **Ola:** O1 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1996 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-62-c)

<a id="API-BIA-63"></a>
#### API-BIA-63 · `GET /api/platform/bia/benchmark/segments`

- **Qué hace:** Segmentos y mínimos. Consulta `segments`.
- **Para qué sirve:** RF-BIA-069: Benchmarking anónimo opcional entre cooperativas por segmento (servicio, tamaño, provincia) con mínimo k tenants por celda. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.bia.benchmark.administrar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-23 (Monitoreo de BI y API (plataforma)).
- **Ola:** O11 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1997 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-63)

<a id="API-BIA-63-b"></a>
#### API-BIA-63-b · `PATCH /api/platform/bia/benchmark/segments`

- **Qué hace:** Segmentos y mínimos. Modifica algunos campos de un registro de `segments` (solo los enviados).
- **Para qué sirve:** RF-BIA-069: Benchmarking anónimo opcional entre cooperativas por segmento (servicio, tamaño, provincia) con mínimo k tenants por celda. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.bia.benchmark.administrar`.
- **Recibe:** solo los campos a cambiar; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-BIA-23 (Monitoreo de BI y API (plataforma)).
- **Ola:** O11 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1997 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-63-b)

<a id="API-BIA-64"></a>
#### API-BIA-64 · `GET /api/public/{tenantSlug}/open-data`

- **Qué hace:** Lista de datasets abiertos publicados. Lista, con filtros y paginación, los registros de `open-data`.
- **Para qué sirve:** RF-BIA-089: Datos abiertos: publicación de datasets agregados (cantidad de usuarios por servicio/categoría, tarifas vigentes, indicadores de calidad de servicio y atención) en landing con licencia y formato CSV/JSON. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ResultadoGenerico (`ResultadoGenerico`) con `total`.
- **Ola:** O11 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1998 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-64)

<a id="API-BIA-65"></a>
#### API-BIA-65 · `GET /api/public/{tenantSlug}/open-data/{slug}.csv`

- **Qué hace:** Descarga de una versión. Descarga un archivo de `open-data`.
- **Para qué sirve:** RF-BIA-079: Errores RFC 9457 con requestId, sin revelar secretos ni detalles internos. · RF-BIA-034: Auditoría de ejecución, exportación y descarga de reportes con datos personales (reportAccessLogs). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`, `slug`.
- **Devuelve:** 200: un archivo (text/csv).
- **Ola:** O11 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1999 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-65)

<a id="API-BIA-65-b"></a>
#### API-BIA-65-b · `GET /api/public/{tenantSlug}/open-data/{slug}/{version}.csv`

- **Qué hace:** Descarga de una versión. Descarga un archivo de `open-data`.
- **Para qué sirve:** RF-BIA-079: Errores RFC 9457 con requestId, sin revelar secretos ni detalles internos. · RF-BIA-034: Auditoría de ejecución, exportación y descarga de reportes con datos personales (reportAccessLogs). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`, `slug`, `version`.
- **Devuelve:** 200: un archivo (text/csv).
- **Ola:** O11 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1999 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-65-b)

<a id="API-BIA-65-c"></a>
#### API-BIA-65-c · `GET /api/public/{tenantSlug}/open-data/{slug}.json`

- **Qué hace:** Descarga de una versión. Obtiene el detalle de un registro de `open-data`.
- **Para qué sirve:** RF-BIA-079: Errores RFC 9457 con requestId, sin revelar secretos ni detalles internos. · RF-BIA-034: Auditoría de ejecución, exportación y descarga de reportes con datos personales (reportAccessLogs). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`, `slug`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O11 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1999 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-65-c)

<a id="API-BIA-65-d"></a>
#### API-BIA-65-d · `GET /api/public/{tenantSlug}/open-data/{slug}/{version}.json`

- **Qué hace:** Descarga de una versión. Obtiene el detalle de un registro de `open-data`.
- **Para qué sirve:** RF-BIA-079: Errores RFC 9457 con requestId, sin revelar secretos ni detalles internos. · RF-BIA-034: Auditoría de ejecución, exportación y descarga de reportes con datos personales (reportAccessLogs). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`, `slug`, `version`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O11 · **Fuente:** T10 §11.1 API interna (admin, PWA, plataforma, pública), línea 1999 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia#/API%20interna%20%28admin%2C%20PWA%2C%20plataforma%2C%20p%C3%BAblica%29/API-BIA-65-d)
