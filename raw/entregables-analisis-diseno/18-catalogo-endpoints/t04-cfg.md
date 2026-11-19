# Catálogo de endpoints · T04 · Configuración versionada, parámetros, tablas maestras y geografía

Parte del [catálogo de endpoints](../18-catalogo-endpoints.md) (artefacto 7.1). Generado el 05-11-2026 con `_trabajo/gen_18_catalogo_endpoints.py` a partir de `18-openapi/`; no se edita a mano.

## Para qué sirve esta API

Proveer a GoodApps Cooperativas un motor de configuración único, tipado, versionado y auditable por tenant que:

1. Reemplace la tabla clave/valor VARIABLE (y VARIABLE_PMOVIL) de ProCoop —1.536 parámetros identificados con números sin orden, tres columnas de valor en paralelo, autoalta silenciosa y sin validación de rangos, dependencias ni historia— por parámetros declarados en código con clave semántica (fac.vencimientos.cantidadMaxima), tipo, validación, dependencias, valor por defecto, ámbito (plataforma /…
2. Garantice que cada cambio de configuración se publique como una versión coherente (AGR-009): con sus dependencias, validación, simulación, revisión y fecha efectiva; separando cambios comerciales, fiscales, operativos, de presentación, de seguridad y técnicos, y sin dejar nunca un plan sin precio o una referencia rota por una actualización parcial.
3. Conserve historia bitemporal (AGR-010): fecha efectiva del valor y fecha en que el sistema lo registró, para poder explicar qué configuración usó cada documento y reconstruir lo conocido en cualquier fecha.
4. Ofrezca un editor uniforme de tablas maestras (búsqueda, vigencias, "en uso por", unificación de duplicados, importación/exportación), con importación de padrones y precarga de catálogos de ejemplo (BASE §39 completa).
5. Mantenga los maestros comunes de plataforma —geografía argentina completa con catálogo nacional de calles (BASE §77, fuentes §79), calendarios/feriados/días hábiles (AGR-017), índices económicos (inflación, cotizaciones, tasas para mora) y tablas fiscales comunes (condiciones y alícuotas de IVA e Ingresos Brutos, tipos de documento, padrones)— mantenidos por plataforma con fuente y vigencia y…
6. Convierta las tablas genéricas y los mecanismos de extensión de ProCoop (DATOSEXT/DATOSETB, PROPIEITEMS*, *_EXTRAS, FORMULARIOS_PERSONALIZACIONES, ABM_VALIDACIONES, motor de pantallas ENTIDADES/frmTransicion) en enumeraciones configurables, campos extra tipados, personalización acotada de formularios y vistas guardadas.
7. Saque de la base y de archivos locales toda la configuración técnica (lo que ProCoop guarda en Configuracion*.pro con ofuscación reversible) y la lleve a variables de entorno (infraestructura) y bóveda de secretos por tenant (credenciales).

Detalle completo en el anexo T04, sección 1. Contrato navegable: [Swagger](../18-swagger/index.html?api=t04-cfg).

| Dato | Valor |
|---|---|
| Endpoints | 106 |
| Por método | DELETE 2, GET 47, PATCH 12, POST 45 |
| Grupos funcionales | 1 |
| Con requisito citado en el anexo | 26 |
| Con requisito inferido (a confirmar) | 80 |
| Sin requisito identificable | 0 |

## Grupos funcionales

| Grupo | Endpoints | Qué agrupa (primeros endpoints) |
|---|---|---|
| [API](#grupo-1) | 106 | Definiciones visibles (filtros módulo, grupo, clase, legacy…; Ficha de definición con dependencias y equivalencias.; Valores efectivos por módulo/grupo para un contexto…… |

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
| [API-CFG-01](#API-CFG-01) | GET | `/api/admin/cfg/definitions` | Definiciones visibles (filtros módulo, grupo, clase, legacy codVar). |
| [API-CFG-02](#API-CFG-02) | GET | `/api/admin/cfg/definitions/{key}` | Ficha de definición con dependencias y equivalencias. |
| [API-CFG-03](#API-CFG-03) | GET | `/api/admin/cfg/effective` | Valores efectivos por módulo/grupo para un contexto (branchId, serviceId, categoryId, at, knownAt). |
| [API-CFG-04](#API-CFG-04) | GET | `/api/admin/cfg/values/{key}` | Valores por ámbito con historia. |
| [API-CFG-05](#API-CFG-05) | GET | `/api/cfg/effective` | Claves con canal pwa del contexto del usuario. |
| [API-CFG-06](#API-CFG-06) | GET | `/api/public/{tenantSlug}/cfg/effective` | Claves con public: true (landing). |
| [API-CFG-07](#API-CFG-07) | GET | `/api/admin/cfg/versions` | Listar / crear borrador (origen manual, import, copy, seed, migration, platform). |
| [API-CFG-07-b](#API-CFG-07-b) | POST | `/api/admin/cfg/versions` | Listar / crear borrador (origen manual, import, copy, seed, migration, platform). |
| [API-CFG-08](#API-CFG-08) | GET | `/api/admin/cfg/versions/{id}` | Detalle / editar cabecera. |
| [API-CFG-08-b](#API-CFG-08-b) | PATCH | `/api/admin/cfg/versions/{id}` | Detalle / editar cabecera. |
| [API-CFG-09](#API-CFG-09) | POST | `/api/admin/cfg/versions/{id}/items` | Agregar/editar/quitar ítems. |
| [API-CFG-09-c](#API-CFG-09-c) | DELETE | `/api/admin/cfg/versions/{id}/items/{itemId}` | Agregar/editar/quitar ítems. |
| [API-CFG-09-b](#API-CFG-09-b) | PATCH | `/api/admin/cfg/versions/{id}/items/{itemId}` | Agregar/editar/quitar ítems. |
| [API-CFG-10](#API-CFG-10) | GET | `/api/admin/cfg/versions/{id}/diff` | Diff contra vigente (o contra diffBaseAt). |
| [API-CFG-11](#API-CFG-11) | POST | `/api/admin/cfg/versions/{id}/validate` | Validación y dependencias. |
| [API-CFG-12](#API-CFG-12) | POST | `/api/admin/cfg/versions/{id}/simulate` | Simulación por contributors (job si es larga). |
| [API-CFG-13](#API-CFG-13) | POST | `/api/admin/cfg/versions/{id}/submit` | Enviar a revisión (T11). |
| [API-CFG-14](#API-CFG-14) | POST | `/api/admin/cfg/versions/{id}/approve` | Aprobar/rechazar con comentario. |
| [API-CFG-14-b](#API-CFG-14-b) | POST | `/api/admin/cfg/versions/{id}/reject` | Aprobar/rechazar con comentario. |
| [API-CFG-15](#API-CFG-15) | POST | `/api/admin/cfg/versions/{id}/schedule` | Programar publicación. |
| [API-CFG-16](#API-CFG-16) | POST | `/api/admin/cfg/versions/{id}/publish` | Publicar ahora (atómico). |
| [API-CFG-17](#API-CFG-17) | POST | `/api/admin/cfg/versions/{id}/cancel` | Cancelar con motivo. |
| [API-CFG-18](#API-CFG-18) | POST | `/api/admin/cfg/versions/{id}/rollback` | Crear versión de reversión. |
| [API-CFG-19](#API-CFG-19) | POST | `/api/admin/cfg/versions/{id}/rebase` | Recalcular diff contra vigente. |
| [API-CFG-20](#API-CFG-20) | GET | `/api/admin/cfg/history` | Valores a at/knownAt; exportable. |
| [API-CFG-21](#API-CFG-21) | GET | `/api/admin/cfg/tables` | Catálogo de tablas maestras. |
| [API-CFG-22](#API-CFG-22) | GET | `/api/admin/cfg/tables/{code}/records` | Listar (paginado, at) / crear registro. |
| [API-CFG-22-b](#API-CFG-22-b) | POST | `/api/admin/cfg/tables/{code}/records` | Listar (paginado, at) / crear registro. |
| [API-CFG-23-b](#API-CFG-23-b) | POST | `/api/admin/cfg/tables/{code}/records/{id}` | Editar / inactivar. |
| [API-CFG-23](#API-CFG-23) | PATCH | `/api/admin/cfg/tables/{code}/records/{id}` | Editar / inactivar. |
| [API-CFG-23-c](#API-CFG-23-c) | POST | `/api/admin/cfg/tables/{code}/records/{id}/deactivate` | Editar / inactivar. |
| [API-CFG-24](#API-CFG-24) | GET | `/api/admin/cfg/tables/{code}/records/{id}/usage` | "En uso por". |
| [API-CFG-25](#API-CFG-25) | POST | `/api/admin/cfg/tables/{code}/merge` | Unificar (job). |
| [API-CFG-26-b](#API-CFG-26-b) | GET | `/api/admin/cfg/imports` | Importación de maestros y padrones. |
| [API-CFG-26](#API-CFG-26) | POST | `/api/admin/cfg/imports` | Importación de maestros y padrones. |
| [API-CFG-26-c](#API-CFG-26-c) | GET | `/api/admin/cfg/imports/{id}` | Importación de maestros y padrones. |
| [API-CFG-26-d](#API-CFG-26-d) | POST | `/api/admin/cfg/imports/{id}/confirm` | Importación de maestros y padrones. |
| [API-CFG-26-e](#API-CFG-26-e) | POST | `/api/admin/cfg/imports/{id}/cancel` | Importación de maestros y padrones. |
| [API-CFG-27](#API-CFG-27) | GET | `/api/admin/cfg/tables/{code}/export` | Exportación XLSX/CSV. |
| [API-CFG-28](#API-CFG-28) | GET | `/api/cfg/lookup/{code}` | Selector paginado (búsqueda, padre, vigentes). |
| [API-CFG-29](#API-CFG-29) | GET | `/api/cfg/geo/provinces` | Unidades territoriales. |
| [API-CFG-29-b](#API-CFG-29-b) | GET | `/api/cfg/geo/departments` | Unidades territoriales. |
| [API-CFG-29-c](#API-CFG-29-c) | GET | `/api/cfg/geo/localities` | Unidades territoriales. |
| [API-CFG-29-d](#API-CFG-29-d) | GET | `/api/cfg/geo/postal-codes` | Unidades territoriales. |
| [API-CFG-30](#API-CFG-30) | GET | `/api/cfg/geo/streets` | Búsqueda de calles por localidad y texto (incluye locales y alias del tenant). |
| [API-CFG-31](#API-CFG-31) | POST | `/api/admin/cfg/geo/streets` | Alta de calle local. |
| [API-CFG-32](#API-CFG-32) | POST | `/api/admin/cfg/geo/street-proposals` | Propuesta y decisión. |
| [API-CFG-32-b](#API-CFG-32-b) | POST | `/api/platform/cfg/street-proposals/{id}/decide` | Propuesta y decisión. |
| [API-CFG-33](#API-CFG-33) | POST | `/api/cfg/geo/normalize` | Normalizar dirección (Georef). |
| [API-CFG-34](#API-CFG-34) | POST | `/api/cfg/geo/geocode` | Candidatos de geocodificación (Google) con precisión. |
| [API-CFG-35](#API-CFG-35) | POST | `/api/admin/cfg/geo/references/confirm` | Confirmar/corregir punto de una entidad (llama al dueño). |
| [API-CFG-36](#API-CFG-36) | GET | `/api/admin/cfg/geo/review-queue` | Cola de revisión. |
| [API-CFG-37](#API-CFG-37) | GET | `/api/admin/cfg/calendars` | Calendarios y feriados. |
| [API-CFG-37-b](#API-CFG-37-b) | POST | `/api/admin/cfg/calendars` | Calendarios y feriados. |
| [API-CFG-37-c](#API-CFG-37-c) | GET | `/api/admin/cfg/holidays` | Calendarios y feriados. |
| [API-CFG-37-d](#API-CFG-37-d) | POST | `/api/admin/cfg/holidays` | Calendarios y feriados. |
| [API-CFG-38](#API-CFG-38) | GET | `/api/cfg/business-days` | IsBusinessDay, next, add, between con contexto. |
| [API-CFG-39](#API-CFG-39) | GET | `/api/admin/cfg/index-series` | Series y valores. |
| [API-CFG-39-b](#API-CFG-39-b) | POST | `/api/admin/cfg/index-series` | Series y valores. |
| [API-CFG-39-c](#API-CFG-39-c) | POST | `/api/admin/cfg/index-series/{code}/values` | Series y valores. |
| [API-CFG-40](#API-CFG-40) | GET | `/api/cfg/index-series/{code}/value` | Valor a fecha con regla de ausencia. |
| [API-CFG-41](#API-CFG-41) | GET | `/api/admin/cfg/adoptions` | Adopciones y propósitos. |
| [API-CFG-41-b](#API-CFG-41-b) | PATCH | `/api/admin/cfg/adoptions` | Adopciones y propósitos. |
| [API-CFG-42](#API-CFG-42) | GET | `/api/admin/cfg/tax-registries/{code}/lookup` | Consulta de padrón. |
| [API-CFG-43](#API-CFG-43) | GET | `/api/admin/cfg/enumerations` | Enumeraciones. |
| [API-CFG-43-b](#API-CFG-43-b) | POST | `/api/admin/cfg/enumerations` | Enumeraciones. |
| [API-CFG-43-c](#API-CFG-43-c) | POST | `/api/admin/cfg/enumerations/{code}/items` | Enumeraciones. |
| [API-CFG-44](#API-CFG-44) | GET | `/api/admin/cfg/custom-fields` | Definiciones de campos extra. |
| [API-CFG-44-b](#API-CFG-44-b) | POST | `/api/admin/cfg/custom-fields` | Definiciones de campos extra. |
| [API-CFG-44-c](#API-CFG-44-c) | PATCH | `/api/admin/cfg/custom-fields` | Definiciones de campos extra. |
| [API-CFG-45](#API-CFG-45) | GET | `/api/cfg/forms/{formKey}/schema` | Esquema efectivo del formulario (base + personalización + campos extra). |
| [API-CFG-46](#API-CFG-46) | GET | `/api/admin/cfg/form-customizations` | Personalizaciones. |
| [API-CFG-46-b](#API-CFG-46-b) | POST | `/api/admin/cfg/form-customizations` | Personalizaciones. |
| [API-CFG-46-c](#API-CFG-46-c) | PATCH | `/api/admin/cfg/form-customizations` | Personalizaciones. |
| [API-CFG-47](#API-CFG-47) | GET | `/api/cfg/saved-views` | Vistas guardadas. |
| [API-CFG-47-b](#API-CFG-47-b) | POST | `/api/cfg/saved-views` | Vistas guardadas. |
| [API-CFG-47-d](#API-CFG-47-d) | DELETE | `/api/cfg/saved-views` | Vistas guardadas. |
| [API-CFG-47-c](#API-CFG-47-c) | PATCH | `/api/cfg/saved-views` | Vistas guardadas. |
| [API-CFG-48](#API-CFG-48) | GET | `/api/admin/cfg/service-profiles` | Completitud del perfil por servicio. |
| [API-CFG-49](#API-CFG-49) | GET | `/api/admin/cfg/technical` | Estado de secretos requeridos. |
| [API-CFG-50](#API-CFG-50) | POST | `/api/platform/cfg/seed-packs/{code}/apply` | Aplicar/retirar semilla. |
| [API-CFG-50-b](#API-CFG-50-b) | POST | `/api/platform/cfg/seed-applications/{id}/remove` | Aplicar/retirar semilla. |
| [API-CFG-51](#API-CFG-51) | GET | `/api/platform/cfg/table-releases` | Releases de tablas de plataforma. |
| [API-CFG-51-b](#API-CFG-51-b) | POST | `/api/platform/cfg/table-releases` | Releases de tablas de plataforma. |
| [API-CFG-51-c](#API-CFG-51-c) | POST | `/api/platform/cfg/table-releases/{id}/publish` | Releases de tablas de plataforma. |
| [API-CFG-52](#API-CFG-52) | GET | `/api/platform/cfg/legacy-mappings` | Equivalencias V2. |
| [API-CFG-52-b](#API-CFG-52-b) | PATCH | `/api/platform/cfg/legacy-mappings` | Equivalencias V2. |
| [API-CFG-53](#API-CFG-53) | GET | `/api/v1/ext/cfg/geo/{resto}` | Lectura de maestros públicos para APIs de terceros (T10). |
| [API-CFG-53-b](#API-CFG-53-b) | GET | `/api/v1/ext/cfg/index-series/{resto}` | Lectura de maestros públicos para APIs de terceros (T10). |
| [API-CFG-55](#API-CFG-55) | GET | `/api/admin/cfg/legal-entities` | Entidades jurídicas (RF-CFG-134 a 139). |
| [API-CFG-55-b](#API-CFG-55-b) | POST | `/api/admin/cfg/legal-entities` | Entidades jurídicas (RF-CFG-134 a 139). |
| [API-CFG-55-c](#API-CFG-55-c) | GET | `/api/admin/cfg/legal-entities/{id}` | Entidades jurídicas (RF-CFG-134 a 139). |
| [API-CFG-55-d](#API-CFG-55-d) | PATCH | `/api/admin/cfg/legal-entities/{id}` | Entidades jurídicas (RF-CFG-134 a 139). |
| [API-CFG-55-e](#API-CFG-55-e) | POST | `/api/admin/cfg/legal-entities/{id}/set-default` | Entidades jurídicas (RF-CFG-134 a 139). |
| [API-CFG-55-f](#API-CFG-55-f) | POST | `/api/admin/cfg/legal-entities/{id}/deactivate` | Entidades jurídicas (RF-CFG-134 a 139). |
| [API-CFG-55-g](#API-CFG-55-g) | PATCH | `/api/admin/cfg/legal-entities/{id}/employer` | Entidades jurídicas (RF-CFG-134 a 139). |
| [API-CFG-56](#API-CFG-56) | GET | `/api/admin/cfg/branches` | Sucursales (RF-CFG-140). |
| [API-CFG-56-b](#API-CFG-56-b) | POST | `/api/admin/cfg/branches` | Sucursales (RF-CFG-140). |
| [API-CFG-56-c](#API-CFG-56-c) | GET | `/api/admin/cfg/branches/{id}` | Sucursales (RF-CFG-140). |
| [API-CFG-56-d](#API-CFG-56-d) | PATCH | `/api/admin/cfg/branches/{id}` | Sucursales (RF-CFG-140). |
| [API-CFG-56-e](#API-CFG-56-e) | POST | `/api/admin/cfg/branches/{id}/change-legal-entity` | Sucursales (RF-CFG-140). |
| [API-CFG-56-f](#API-CFG-56-f) | POST | `/api/admin/cfg/branches/{id}/deactivate` | Sucursales (RF-CFG-140). |
| [API-CFG-57](#API-CFG-57) | GET | `/api/admin/cfg/workstations` | Puestos (RF-CFG-141). |
| [API-CFG-57-b](#API-CFG-57-b) | POST | `/api/admin/cfg/workstations` | Puestos (RF-CFG-141). |
| [API-CFG-57-c](#API-CFG-57-c) | GET | `/api/admin/cfg/workstations/{id}` | Puestos (RF-CFG-141). |
| [API-CFG-57-d](#API-CFG-57-d) | PATCH | `/api/admin/cfg/workstations/{id}` | Puestos (RF-CFG-141). |

<a id="API-CFG-01"></a>
#### API-CFG-01 · `GET /api/admin/cfg/definitions`

- **Qué hace:** Definiciones visibles (filtros módulo, grupo, clase, legacy codVar). Lista, con filtros y paginación, los registros de registro tipado de parámetros PRM (`parameterDefinitions`).
- **Para qué sirve:** RF-CFG-001: Cada parámetro se declara en código (paquete del módulo dueño) con: clave semántica, módulo, grupo, tipo, validación, ámbitos permitidos, default, clase de cambio, modo de vigencia, dependencias, visibilidad, sensibilidad, canal… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.parametros.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de registro tipado de parámetros PRM (`parameterDefinitions`) con `total`.
- **Pantallas:** PAN-CFG-01 (Centro de configuración), PAN-CFG-02 (Explorador de parámetros por módulo y grupo), PAN-CFG-03 (Ficha de parámetro) y 1 más.
- **Ola:** O0 · **Fuente:** T04 §11. API, línea 1526 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-01)

<a id="API-CFG-02"></a>
#### API-CFG-02 · `GET /api/admin/cfg/definitions/{key}`

- **Qué hace:** Ficha de definición con dependencias y equivalencias. Obtiene el detalle de un registro de registro tipado de parámetros PRM (`parameterDefinitions`).
- **Para qué sirve:** RF-CFG-001: Cada parámetro se declara en código (paquete del módulo dueño) con: clave semántica, módulo, grupo, tipo, validación, ámbitos permitidos, default, clase de cambio, modo de vigencia, dependencias, visibilidad, sensibilidad, canal… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.parametros.ver`.
- **Recibe:** en la ruta `key`.
- **Devuelve:** 200: el registro de registro tipado de parámetros PRM (`parameterDefinitions`).
- **Pantallas:** PAN-CFG-01 (Centro de configuración), PAN-CFG-02 (Explorador de parámetros por módulo y grupo), PAN-CFG-03 (Ficha de parámetro) y 1 más.
- **Ola:** O0 · **Fuente:** T04 §11. API, línea 1527 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-02)

<a id="API-CFG-03"></a>
#### API-CFG-03 · `GET /api/admin/cfg/effective`

- **Qué hace:** Valores efectivos por módulo/grupo para un contexto (branchId, serviceId, categoryId, at, knownAt). Consulta `effective`.
- **Para qué sirve:** RF-CFG-020: Lectura única config.get(clave, { tenantId, branchId, serviceId, categoryId, userId, at, knownAt }): at = fecha efectiva a interpretar (default: ahora en zona del tenant); knownAt = fecha de registro para reconstrucción histórica… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.parametros.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CFG-01 (Centro de configuración), PAN-CFG-02 (Explorador de parámetros por módulo y grupo), PAN-CFG-03 (Ficha de parámetro) y 1 más.
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1528 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-03)

<a id="API-CFG-04"></a>
#### API-CFG-04 · `GET /api/admin/cfg/values/{key}`

- **Qué hace:** Valores por ámbito con historia. Obtiene el detalle de un registro de valores por ámbito (`parameterValues`).
- **Para qué sirve:** RF-CFG-024: Los parámetros de ámbito user son solo preferencias sin efecto económico; ninguna clave commercial, fiscal o security admite ámbito user. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.parametros.ver`.
- **Recibe:** en la ruta `key`.
- **Devuelve:** 200: el registro de valores por ámbito (`parameterValues`).
- **Pantallas:** PAN-CFG-01 (Centro de configuración), PAN-CFG-02 (Explorador de parámetros por módulo y grupo), PAN-CFG-03 (Ficha de parámetro) y 1 más.
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1529 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-04)

<a id="API-CFG-05"></a>
#### API-CFG-05 · `GET /api/cfg/effective`

- **Qué hace:** Claves con canal pwa del contexto del usuario. Consulta `effective`.
- **Para qué sirve:** RF-CFG-017: Los textos de personalización del portal que ProCoop guardaba como parámetros (VARIABLE_PMOVIL canal CoopOnline) pasan a claves del diccionario por tenant (T03) o a parámetros presentation de M19, según sean etiqueta o… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `iam.sesion.autenticada`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1530 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-05)

<a id="API-CFG-06"></a>
#### API-CFG-06 · `GET /api/public/{tenantSlug}/cfg/effective`

- **Qué hace:** Claves con public: true (landing). Consulta `effective`.
- **Para qué sirve:** RF-CFG-023: Lectura masiva por módulo/grupo para pantallas y apps (/api/admin/cfg/effective?module=) y lectura pública acotada para PWA/landing solo de claves con channel público. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1531 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-06)

<a id="API-CFG-07"></a>
#### API-CFG-07 · `GET /api/admin/cfg/versions`

- **Qué hace:** Listar / crear borrador (origen manual, import, copy, seed, migration, platform). Lista, con filtros y paginación, los registros de versiones publicadas de tablas de plataforma no fiscales (`platformTableReleases`).
- **Para qué sirve:** RF-CFG-036: Historia bitemporal de cada valor: validFrom/validTo (efectiva) y recordedAt/supersededAt (registro), origen (manual, import, copy, seed, migration, platform), versión y actor. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.versiones.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de versiones publicadas de tablas de plataforma no fiscales (`platformTableReleases`) con `total`.
- **Pantallas:** PAN-CFG-04 (Listado de versiones), PAN-CFG-05 (Detalle de versión).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1532 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-07)

<a id="API-CFG-07-b"></a>
#### API-CFG-07-b · `POST /api/admin/cfg/versions`

- **Qué hace:** Listar / crear borrador (origen manual, import, copy, seed, migration, platform). Da de alta un registro de versiones publicadas de tablas de plataforma no fiscales (`platformTableReleases`).
- **Para qué sirve:** RF-CFG-036: Historia bitemporal de cada valor: validFrom/validTo (efectiva) y recordedAt/supersededAt (registro), origen (manual, import, copy, seed, migration, platform), versión y actor. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.versiones.crear`.
- **Recibe:** los datos de versiones publicadas de tablas de plataforma no fiscales (`platformTableReleases`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de versiones publicadas de tablas de plataforma no fiscales (`platformTableReleases`).
- **Pantallas:** PAN-CFG-05 (Detalle de versión).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1532 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-07-b)

<a id="API-CFG-08"></a>
#### API-CFG-08 · `GET /api/admin/cfg/versions/{id}`

- **Qué hace:** Detalle / editar cabecera. Obtiene el detalle de un registro de versiones publicadas de tablas de plataforma no fiscales (`platformTableReleases`).
- **Para qué sirve:** RF-CFG-101: Toda tabla fiscal de plataforma se publica por platformTableRelease con fuente (norma/resolución/URL), fecha de publicación y vigencia; el tenant recibe aviso y adopta según PRM-CFG-033. · RF-CFG-053: Los cambios a tablas maestras del tenant marcadas versioned pasan por configVersion; las tablas operativas simples (ej.: barrios) pueden configurarse con publicación inmediata auditada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.versiones.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de versiones publicadas de tablas de plataforma no fiscales (`platformTableReleases`).
- **Pantallas:** PAN-CFG-04 (Listado de versiones), PAN-CFG-05 (Detalle de versión).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1533 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-08)

<a id="API-CFG-08-b"></a>
#### API-CFG-08-b · `PATCH /api/admin/cfg/versions/{id}`

- **Qué hace:** Detalle / editar cabecera. Modifica algunos campos de un registro de versiones publicadas de tablas de plataforma no fiscales (`platformTableReleases`) (solo los enviados).
- **Para qué sirve:** RF-CFG-101: Toda tabla fiscal de plataforma se publica por platformTableRelease con fuente (norma/resolución/URL), fecha de publicación y vigencia; el tenant recibe aviso y adopta según PRM-CFG-033. · RF-CFG-053: Los cambios a tablas maestras del tenant marcadas versioned pasan por configVersion; las tablas operativas simples (ej.: barrios) pueden configurarse con publicación inmediata auditada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.versiones.crear`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de versiones publicadas de tablas de plataforma no fiscales (`platformTableReleases`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de versiones publicadas de tablas de plataforma no fiscales (`platformTableReleases`).
- **Pantallas:** PAN-CFG-05 (Detalle de versión).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1533 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-08-b)

<a id="API-CFG-09"></a>
#### API-CFG-09 · `POST /api/admin/cfg/versions/{id}/items`

- **Qué hace:** Agregar/editar/quitar ítems. Da de alta un registro de ítems de enumeraciones y tablas maestras simples (`enumerationItems`).
- **Para qué sirve:** RF-CFG-053: Los cambios a tablas maestras del tenant marcadas versioned pasan por configVersion; las tablas operativas simples (ej.: barrios) pueden configurarse con publicación inmediata auditada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.versiones.crear`.
- **Recibe:** en la ruta `id`; los datos de ítems de enumeraciones y tablas maestras simples (`enumerationItems`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de ítems de enumeraciones y tablas maestras simples (`enumerationItems`).
- **Pantallas:** PAN-CFG-05 (Detalle de versión).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1534 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-09)

<a id="API-CFG-09-c"></a>
#### API-CFG-09-c · `DELETE /api/admin/cfg/versions/{id}/items/{itemId}`

- **Qué hace:** Agregar/editar/quitar ítems. Elimina o da de baja un registro de ítems de enumeraciones y tablas maestras simples (`enumerationItems`).
- **Para qué sirve:** RF-CFG-053: Los cambios a tablas maestras del tenant marcadas versioned pasan por configVersion; las tablas operativas simples (ej.: barrios) pueden configurarse con publicación inmediata auditada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.versiones.crear`.
- **Recibe:** en la ruta `id`, `itemId`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-CFG-05 (Detalle de versión).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1534 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-09-c)

<a id="API-CFG-09-b"></a>
#### API-CFG-09-b · `PATCH /api/admin/cfg/versions/{id}/items/{itemId}`

- **Qué hace:** Agregar/editar/quitar ítems. Modifica algunos campos de un registro de ítems de enumeraciones y tablas maestras simples (`enumerationItems`) (solo los enviados).
- **Para qué sirve:** RF-CFG-053: Los cambios a tablas maestras del tenant marcadas versioned pasan por configVersion; las tablas operativas simples (ej.: barrios) pueden configurarse con publicación inmediata auditada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.versiones.crear`.
- **Recibe:** en la ruta `id`, `itemId`; solo los campos a cambiar de ítems de enumeraciones y tablas maestras simples (`enumerationItems`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de ítems de enumeraciones y tablas maestras simples (`enumerationItems`).
- **Pantallas:** PAN-CFG-05 (Detalle de versión).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1534 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-09-b)

<a id="API-CFG-10"></a>
#### API-CFG-10 · `GET /api/admin/cfg/versions/{id}/diff`

- **Qué hace:** Diff contra vigente (o contra diffBaseAt). Consulta «diff» de un registro de versiones publicadas de tablas de plataforma no fiscales (`platformTableReleases`).
- **Para qué sirve:** RF-CFG-040: Conflictos: dos borradores que tocan el mismo ítem se detectan; al publicar el segundo se exige rebase (recalcular diff contra lo vigente). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.versiones.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de versiones publicadas de tablas de plataforma no fiscales (`platformTableReleases`).
- **Pantallas:** PAN-CFG-04 (Listado de versiones), PAN-CFG-05 (Detalle de versión).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1535 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-10)

<a id="API-CFG-11"></a>
#### API-CFG-11 · `POST /api/admin/cfg/versions/{id}/validate`

- **Qué hace:** Validación y dependencias. Valida un registro de versiones publicadas de tablas de plataforma no fiscales (`platformTableReleases`).
- **Para qué sirve:** RF-CFG-028: Validación de la versión: tipos y rangos, dependencias, referencias existentes y vigentes en el tenant, validadores cruzados de los módulos, completitud de los perfiles de servicio afectados, y ausencia de referencias a otro… · RF-CFG-006: Dependencias declarables entre parámetros: requires (A habilitado exige B con valor válido), excludes, enables (B solo visible si A), derivedDefault. Se evalúan al validar una versión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.versiones.validar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1536 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-11)

<a id="API-CFG-12"></a>
#### API-CFG-12 · `POST /api/admin/cfg/versions/{id}/simulate`

- **Qué hace:** Simulación por contributors (job si es larga). Simula sin efectos un registro de versiones publicadas de tablas de plataforma no fiscales (`platformTableReleases`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-CFG-030: Separación por clase de cambio: una versión solo de presentation no dispara simulación tarifaria ni revisión comercial. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.versiones.simular`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1537 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-12)

<a id="API-CFG-13"></a>
#### API-CFG-13 · `POST /api/admin/cfg/versions/{id}/submit`

- **Qué hace:** Enviar a revisión (T11). Envía a revisión o presenta un registro de versiones publicadas de tablas de plataforma no fiscales (`platformTableReleases`).
- **Para qué sirve:** RF-CFG-031: Revisión: según política del tenant (PRM-CFG-001..003) una versión requiere aprobación por un usuario distinto del autor, mediante workflow de T11. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.versiones.enviarRevision`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1538 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-13)

<a id="API-CFG-14"></a>
#### API-CFG-14 · `POST /api/admin/cfg/versions/{id}/approve`

- **Qué hace:** Aprobar/rechazar con comentario. Aprueba un registro de versiones publicadas de tablas de plataforma no fiscales (`platformTableReleases`).
- **Para qué sirve:** RF-CFG-038: Reversión: una versión publicada puede revertirse creando una versión nueva que restituye los valores anteriores (con su propia fecha efectiva y aprobación); nunca se borra la versión revertida. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.versiones.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CFG-05 (Detalle de versión).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1539 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-14)

<a id="API-CFG-14-b"></a>
#### API-CFG-14-b · `POST /api/admin/cfg/versions/{id}/reject`

- **Qué hace:** Aprobar/rechazar con comentario. Rechaza un registro de versiones publicadas de tablas de plataforma no fiscales (`platformTableReleases`).
- **Para qué sirve:** RF-CFG-038: Reversión: una versión publicada puede revertirse creando una versión nueva que restituye los valores anteriores (con su propia fecha efectiva y aprobación); nunca se borra la versión revertida. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.versiones.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CFG-05 (Detalle de versión).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1539 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-14-b)

<a id="API-CFG-15"></a>
#### API-CFG-15 · `POST /api/admin/cfg/versions/{id}/schedule`

- **Qué hace:** Programar publicación. Programa un registro de versiones publicadas de tablas de plataforma no fiscales (`platformTableReleases`).
- **Para qué sirve:** RF-CFG-032: Fecha efectiva por versión (y opcionalmente por ítem cuando el modo de vigencia lo permite); la publicación puede programarse para una fecha/hora futura. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.versiones.programar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1540 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-15)

<a id="API-CFG-16"></a>
#### API-CFG-16 · `POST /api/admin/cfg/versions/{id}/publish`

- **Qué hace:** Publicar ahora (atómico). Publica un registro de versiones publicadas de tablas de plataforma no fiscales (`platformTableReleases`).
- **Para qué sirve:** RF-CFG-033: Publicación íntegra y atómica: todos los ítems de la versión se vuelven vigentes en una sola transacción; si un ítem falla, no se publica ninguno. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.versiones.publicar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CFG-05 (Detalle de versión).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1541 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-16)

<a id="API-CFG-17"></a>
#### API-CFG-17 · `POST /api/admin/cfg/versions/{id}/cancel`

- **Qué hace:** Cancelar con motivo. Cancela un registro de versiones publicadas de tablas de plataforma no fiscales (`platformTableReleases`).
- **Para qué sirve:** RF-CFG-039: Cancelación de una versión programada antes de su fecha efectiva, con motivo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.versiones.cancelar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1542 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-17)

<a id="API-CFG-18"></a>
#### API-CFG-18 · `POST /api/admin/cfg/versions/{id}/rollback`

- **Qué hace:** Crear versión de reversión. Deshace (rollback) un registro de versiones publicadas de tablas de plataforma no fiscales (`platformTableReleases`).
- **Para qué sirve:** RF-CFG-038: Reversión: una versión publicada puede revertirse creando una versión nueva que restituye los valores anteriores (con su propia fecha efectiva y aprobación); nunca se borra la versión revertida. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.versiones.revertir`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1543 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-18)

<a id="API-CFG-19"></a>
#### API-CFG-19 · `POST /api/admin/cfg/versions/{id}/rebase`

- **Qué hace:** Recalcular diff contra vigente. Registra «rebase» sobre un registro de versiones publicadas de tablas de plataforma no fiscales (`platformTableReleases`).
- **Para qué sirve:** RF-CFG-040: Conflictos: dos borradores que tocan el mismo ítem se detectan; al publicar el segundo se exige rebase (recalcular diff contra lo vigente). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.versiones.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CFG-05 (Detalle de versión).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1544 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-19)

<a id="API-CFG-20"></a>
#### API-CFG-20 · `GET /api/admin/cfg/history`

- **Qué hace:** Valores a at/knownAt; exportable. Consulta `history`.
- **Para qué sirve:** RF-CFG-020: Lectura única config.get(clave, { tenantId, branchId, serviceId, categoryId, userId, at, knownAt }): at = fecha efectiva a interpretar (default: ahora en zona del tenant); knownAt = fecha de registro para reconstrucción histórica… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.historia.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CFG-06 (Consulta "como era").
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1545 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-20)

<a id="API-CFG-21"></a>
#### API-CFG-21 · `GET /api/admin/cfg/tables`

- **Qué hace:** Catálogo de tablas maestras. Lista, con filtros y paginación, los registros de deducciones de Ganancias (`incomeTaxDeductionTables`).
- **Para qué sirve:** RF-CFG-143: Tablas legales de sueldos de plataforma (§7.17): códigos oficiales, alícuotas de aportes y contribuciones, bases mínima y máxima, SMVM, deducciones y escalas de Ganancias, reglas de Ganancias, escala cedular, escala de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.maestros.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de deducciones de Ganancias (`incomeTaxDeductionTables`) con `total`.
- **Pantallas:** PAN-CFG-07 (Catálogo de tablas maestras por módulo/dominio), PAN-CFG-08 (Editor uniforme de tabla maestra), PAN-CFG-30 (En uso por (componente de tablas maestras)).
- **Ola:** O9 · **Fuente:** T04 §11. API, línea 1546 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-21)

<a id="API-CFG-22"></a>
#### API-CFG-22 · `GET /api/admin/cfg/tables/{code}/records`

- **Qué hace:** Listar (paginado, at) / crear registro. Lista, con filtros y paginación, los registros de deducciones de Ganancias (`incomeTaxDeductionTables`).
- **Para qué sirve:** RF-CFG-143: Tablas legales de sueldos de plataforma (§7.17): códigos oficiales, alícuotas de aportes y contribuciones, bases mínima y máxima, SMVM, deducciones y escalas de Ganancias, reglas de Ganancias, escala cedular, escala de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.maestros.ver`.
- **Recibe:** en la ruta `code`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de deducciones de Ganancias (`incomeTaxDeductionTables`) con `total`.
- **Pantallas:** PAN-CFG-07 (Catálogo de tablas maestras por módulo/dominio), PAN-CFG-08 (Editor uniforme de tabla maestra), PAN-CFG-30 (En uso por (componente de tablas maestras)).
- **Ola:** O9 · **Fuente:** T04 §11. API, línea 1547 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-22)

<a id="API-CFG-22-b"></a>
#### API-CFG-22-b · `POST /api/admin/cfg/tables/{code}/records`

- **Qué hace:** Listar (paginado, at) / crear registro. Registra «records» sobre un registro de deducciones de Ganancias (`incomeTaxDeductionTables`).
- **Para qué sirve:** RF-CFG-143: Tablas legales de sueldos de plataforma (§7.17): códigos oficiales, alícuotas de aportes y contribuciones, bases mínima y máxima, SMVM, deducciones y escalas de Ganancias, reglas de Ganancias, escala cedular, escala de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.maestros.crear`.
- **Recibe:** en la ruta `code`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CFG-08 (Editor uniforme de tabla maestra).
- **Ola:** O9 · **Fuente:** T04 §11. API, línea 1547 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-22-b)

<a id="API-CFG-23-b"></a>
#### API-CFG-23-b · `POST /api/admin/cfg/tables/{code}/records/{id}`

- **Qué hace:** Editar / inactivar. Registra un nuevo elemento u operación en deducciones de Ganancias (`incomeTaxDeductionTables`).
- **Para qué sirve:** RF-CFG-048: "En uso por": antes de inactivar o unificar un registro, el sistema muestra cuántas referencias tiene por colección/módulo; un registro referenciado no se borra, se inactiva. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.maestros.editar`.
- **Recibe:** en la ruta `code`, `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CFG-08 (Editor uniforme de tabla maestra), PAN-CFG-13 (Barrios, zonas y distritos/secciones catastrales del tenant), PAN-CFG-18 (Monedas y cotizaciones).
- **Ola:** O9 · **Fuente:** T04 §11. API, línea 1548 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-23-b)

<a id="API-CFG-23"></a>
#### API-CFG-23 · `PATCH /api/admin/cfg/tables/{code}/records/{id}`

- **Qué hace:** Editar / inactivar. Modifica algunos campos de un registro de deducciones de Ganancias (`incomeTaxDeductionTables`) (solo los enviados).
- **Para qué sirve:** RF-CFG-048: "En uso por": antes de inactivar o unificar un registro, el sistema muestra cuántas referencias tiene por colección/módulo; un registro referenciado no se borra, se inactiva. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.maestros.editar`.
- **Recibe:** en la ruta `code`, `id`; solo los campos a cambiar de deducciones de Ganancias (`incomeTaxDeductionTables`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de deducciones de Ganancias (`incomeTaxDeductionTables`).
- **Pantallas:** PAN-CFG-08 (Editor uniforme de tabla maestra), PAN-CFG-13 (Barrios, zonas y distritos/secciones catastrales del tenant), PAN-CFG-18 (Monedas y cotizaciones).
- **Ola:** O9 · **Fuente:** T04 §11. API, línea 1548 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-23)

<a id="API-CFG-23-c"></a>
#### API-CFG-23-c · `POST /api/admin/cfg/tables/{code}/records/{id}/deactivate`

- **Qué hace:** Editar / inactivar. Desactiva un registro de deducciones de Ganancias (`incomeTaxDeductionTables`).
- **Para qué sirve:** RF-CFG-048: "En uso por": antes de inactivar o unificar un registro, el sistema muestra cuántas referencias tiene por colección/módulo; un registro referenciado no se borra, se inactiva. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.maestros.editar`.
- **Recibe:** en la ruta `code`, `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CFG-08 (Editor uniforme de tabla maestra), PAN-CFG-13 (Barrios, zonas y distritos/secciones catastrales del tenant), PAN-CFG-18 (Monedas y cotizaciones).
- **Ola:** O9 · **Fuente:** T04 §11. API, línea 1548 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-23-c)

<a id="API-CFG-24"></a>
#### API-CFG-24 · `GET /api/admin/cfg/tables/{code}/records/{id}/usage`

- **Qué hace:** "En uso por". Consulta «usage» de un registro de deducciones de Ganancias (`incomeTaxDeductionTables`).
- **Para qué sirve:** RF-CFG-134: Entidades jurídicas del tenant (legalEntities, §7.14): cada tenant tiene una o más entidades jurídicas con código, razón social, nombre de fantasía, CUIT, condición frente al IVA, régimen de IIBB, domicilio legal, inicio de… · RF-CFG-135: Entidad por defecto: al consumir pla.tenant.created se crea en la misma unidad idempotente la entidad jurídica por defecto (isDefault = true) con los datos fiscales de tenants (razón social, CUIT, forma jurídica, matrícula INAES…
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.maestros.ver`.
- **Recibe:** en la ruta `code`, `id`.
- **Devuelve:** 200: el registro de deducciones de Ganancias (`incomeTaxDeductionTables`).
- **Pantallas:** PAN-CFG-07 (Catálogo de tablas maestras por módulo/dominio), PAN-CFG-08 (Editor uniforme de tabla maestra), PAN-CFG-30 (En uso por (componente de tablas maestras)).
- **Ola:** O0 · **Fuente:** T04 §11. API, línea 1549 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-24)

<a id="API-CFG-25"></a>
#### API-CFG-25 · `POST /api/admin/cfg/tables/{code}/merge`

- **Qué hace:** Unificar (job). Fusiona un registro de deducciones de Ganancias (`incomeTaxDeductionTables`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-CFG-045: Registro de tablas maestras (masterTableDefinitions) con código, módulo dueño, ámbito (platform, tenant, platformAdoptable), esquema de campos, clave natural, si es vigenciada, si es importable, si admite unificación y si sus… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.maestros.unificar`.
- **Recibe:** en la ruta `code`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-CFG-08 (Editor uniforme de tabla maestra).
- **Ola:** O9 · **Fuente:** T04 §11. API, línea 1550 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-25)

<a id="API-CFG-26-b"></a>
#### API-CFG-26-b · `GET /api/admin/cfg/imports`

- **Qué hace:** Importación de maestros y padrones. Consulta `imports`.
- **Para qué sirve:** RF-CFG-058: Exportación de cualquier tabla maestra en XLSX/CSV con las mismas columnas importables (plantilla de ida y vuelta). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.maestros.importar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CFG-08 (Editor uniforme de tabla maestra), PAN-CFG-09 (Asistente e historial de importaciones de maestros y padrones).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1551 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-26-b)

<a id="API-CFG-26"></a>
#### API-CFG-26 · `POST /api/admin/cfg/imports`

- **Qué hace:** Importación de maestros y padrones. Registra un nuevo elemento u operación en `imports`.
- **Para qué sirve:** RF-CFG-058: Exportación de cualquier tabla maestra en XLSX/CSV con las mismas columnas importables (plantilla de ida y vuelta). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.maestros.importar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CFG-08 (Editor uniforme de tabla maestra), PAN-CFG-09 (Asistente e historial de importaciones de maestros y padrones).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1551 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-26)

<a id="API-CFG-26-c"></a>
#### API-CFG-26-c · `GET /api/admin/cfg/imports/{id}`

- **Qué hace:** Importación de maestros y padrones. Obtiene el detalle de un registro de `imports`.
- **Para qué sirve:** RF-CFG-058: Exportación de cualquier tabla maestra en XLSX/CSV con las mismas columnas importables (plantilla de ida y vuelta). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.maestros.importar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CFG-08 (Editor uniforme de tabla maestra), PAN-CFG-09 (Asistente e historial de importaciones de maestros y padrones).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1551 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-26-c)

<a id="API-CFG-26-d"></a>
#### API-CFG-26-d · `POST /api/admin/cfg/imports/{id}/confirm`

- **Qué hace:** Importación de maestros y padrones. Confirma un registro de `confirm`.
- **Para qué sirve:** RF-CFG-058: Exportación de cualquier tabla maestra en XLSX/CSV con las mismas columnas importables (plantilla de ida y vuelta). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.maestros.importar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CFG-08 (Editor uniforme de tabla maestra), PAN-CFG-09 (Asistente e historial de importaciones de maestros y padrones).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1551 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-26-d)

<a id="API-CFG-26-e"></a>
#### API-CFG-26-e · `POST /api/admin/cfg/imports/{id}/cancel`

- **Qué hace:** Importación de maestros y padrones. Cancela un registro de `cancel`.
- **Para qué sirve:** RF-CFG-058: Exportación de cualquier tabla maestra en XLSX/CSV con las mismas columnas importables (plantilla de ida y vuelta). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.maestros.importar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CFG-08 (Editor uniforme de tabla maestra), PAN-CFG-09 (Asistente e historial de importaciones de maestros y padrones).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1551 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-26-e)

<a id="API-CFG-27"></a>
#### API-CFG-27 · `GET /api/admin/cfg/tables/{code}/export`

- **Qué hace:** Exportación XLSX/CSV. Descarga un archivo de deducciones de Ganancias (`incomeTaxDeductionTables`).
- **Para qué sirve:** RF-CFG-058: Exportación de cualquier tabla maestra en XLSX/CSV con las mismas columnas importables (plantilla de ida y vuelta). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.maestros.exportar`.
- **Recibe:** en la ruta `code`.
- **Devuelve:** 200: un archivo (application/octet-stream).
- **Pantallas:** PAN-CFG-08 (Editor uniforme de tabla maestra).
- **Ola:** O9 · **Fuente:** T04 §11. API, línea 1552 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-27)

<a id="API-CFG-28"></a>
#### API-CFG-28 · `GET /api/cfg/lookup/{code}`

- **Qué hace:** Selector paginado (búsqueda, padre, vigentes). Obtiene el detalle de un registro de `lookup`.
- **Para qué sirve:** RF-CFG-052: Selectores (lookups) uniformes para todos los módulos: búsqueda incremental, filtro por padre (provincia → localidad → calle), solo vigentes, paginados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `iam.sesion.autenticada`.
- **Recibe:** en la ruta `code`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1553 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-28)

<a id="API-CFG-29"></a>
#### API-CFG-29 · `GET /api/cfg/geo/provinces`

- **Qué hace:** Unidades territoriales. Lista, con filtros y paginación, los registros de provincias (`provinces`).
- **Para qué sirve:** RF-CFG-134: Entidades jurídicas del tenant (legalEntities, §7.14): cada tenant tiene una o más entidades jurídicas con código, razón social, nombre de fantasía, CUIT, condición frente al IVA, régimen de IIBB, domicilio legal, inicio de… · RF-CFG-135: Entidad por defecto: al consumir pla.tenant.created se crea en la misma unidad idempotente la entidad jurídica por defecto (isDefault = true) con los datos fiscales de tenants (razón social, CUIT, forma jurídica, matrícula INAES…
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `iam.sesion.autenticada`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de provincias (`provinces`) con `total`.
- **Ola:** O0 · **Fuente:** T04 §11. API, línea 1554 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-29)

<a id="API-CFG-29-b"></a>
#### API-CFG-29-b · `GET /api/cfg/geo/departments`

- **Qué hace:** Unidades territoriales. Lista, con filtros y paginación, los registros de departamentos/partidos (`departments`).
- **Para qué sirve:** RF-CFG-134: Entidades jurídicas del tenant (legalEntities, §7.14): cada tenant tiene una o más entidades jurídicas con código, razón social, nombre de fantasía, CUIT, condición frente al IVA, régimen de IIBB, domicilio legal, inicio de… · RF-CFG-135: Entidad por defecto: al consumir pla.tenant.created se crea en la misma unidad idempotente la entidad jurídica por defecto (isDefault = true) con los datos fiscales de tenants (razón social, CUIT, forma jurídica, matrícula INAES…
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `iam.sesion.autenticada`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de departamentos/partidos (`departments`) con `total`.
- **Ola:** O0 · **Fuente:** T04 §11. API, línea 1554 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-29-b)

<a id="API-CFG-29-c"></a>
#### API-CFG-29-c · `GET /api/cfg/geo/localities`

- **Qué hace:** Unidades territoriales. Lista, con filtros y paginación, los registros de localidades (`localities`).
- **Para qué sirve:** RF-CFG-134: Entidades jurídicas del tenant (legalEntities, §7.14): cada tenant tiene una o más entidades jurídicas con código, razón social, nombre de fantasía, CUIT, condición frente al IVA, régimen de IIBB, domicilio legal, inicio de… · RF-CFG-135: Entidad por defecto: al consumir pla.tenant.created se crea en la misma unidad idempotente la entidad jurídica por defecto (isDefault = true) con los datos fiscales de tenants (razón social, CUIT, forma jurídica, matrícula INAES…
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `iam.sesion.autenticada`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de localidades (`localities`) con `total`.
- **Ola:** O0 · **Fuente:** T04 §11. API, línea 1554 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-29-c)

<a id="API-CFG-29-d"></a>
#### API-CFG-29-d · `GET /api/cfg/geo/postal-codes`

- **Qué hace:** Unidades territoriales. Lista, con filtros y paginación, los registros de códigos postales (`postalCodes`).
- **Para qué sirve:** RF-CFG-134: Entidades jurídicas del tenant (legalEntities, §7.14): cada tenant tiene una o más entidades jurídicas con código, razón social, nombre de fantasía, CUIT, condición frente al IVA, régimen de IIBB, domicilio legal, inicio de… · RF-CFG-135: Entidad por defecto: al consumir pla.tenant.created se crea en la misma unidad idempotente la entidad jurídica por defecto (isDefault = true) con los datos fiscales de tenants (razón social, CUIT, forma jurídica, matrícula INAES…
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `iam.sesion.autenticada`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de códigos postales (`postalCodes`) con `total`.
- **Ola:** O0 · **Fuente:** T04 §11. API, línea 1554 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-29-d)

<a id="API-CFG-30"></a>
#### API-CFG-30 · `GET /api/cfg/geo/streets`

- **Qué hace:** Búsqueda de calles por localidad y texto (incluye locales y alias del tenant). Lista, con filtros y paginación, los registros de calles con tramos (`streets`).
- **Para qué sirve:** RF-CFG-134: Entidades jurídicas del tenant (legalEntities, §7.14): cada tenant tiene una o más entidades jurídicas con código, razón social, nombre de fantasía, CUIT, condición frente al IVA, régimen de IIBB, domicilio legal, inicio de… · RF-CFG-135: Entidad por defecto: al consumir pla.tenant.created se crea en la misma unidad idempotente la entidad jurídica por defecto (isDefault = true) con los datos fiscales de tenants (razón social, CUIT, forma jurídica, matrícula INAES…
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `iam.sesion.autenticada`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de calles con tramos (`streets`) con `total`.
- **Ola:** O0 · **Fuente:** T04 §11. API, línea 1555 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-30)

<a id="API-CFG-31"></a>
#### API-CFG-31 · `POST /api/admin/cfg/geo/streets`

- **Qué hace:** Alta de calle local. Da de alta un registro de calles con tramos (`streets`).
- **Para qué sirve:** RF-CFG-070: Alias de calles por tenant (nombre histórico/popular → calle del catálogo) para búsqueda y migración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.calles.crear`.
- **Recibe:** los datos de calles con tramos (`streets`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de calles con tramos (`streets`).
- **Pantallas:** PAN-CFG-12 (Calles).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1556 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-31)

<a id="API-CFG-32"></a>
#### API-CFG-32 · `POST /api/admin/cfg/geo/street-proposals`

- **Qué hace:** Propuesta y decisión. Da de alta un registro de propuestas de calles nuevas (`streetProposals`).
- **Para qué sirve:** RF-CFG-069: Calles locales del tenant: si la calle no aparece (loteo nuevo, rural), el operador la carga localmente con estado pendingValidation; puede proponerse a plataforma (streetProposals). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.geo.proponerCalle`.
- **Recibe:** los datos de propuestas de calles nuevas (`streetProposals`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de propuestas de calles nuevas (`streetProposals`).
- **Pantallas:** PAN-CFG-12 (Calles).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1557 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-32)

<a id="API-CFG-32-b"></a>
#### API-CFG-32-b · `POST /api/platform/cfg/street-proposals/{id}/decide`

- **Qué hace:** Propuesta y decisión. Registra la decisión sobre un registro de propuestas de calles nuevas (`streetProposals`).
- **Para qué sirve:** RF-CFG-069: Calles locales del tenant: si la calle no aparece (loteo nuevo, rural), el operador la carga localmente con estado pendingValidation; puede proponerse a plataforma (streetProposals). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `cfg.geo.proponerCalle`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CFG-12 (Calles).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1557 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-32-b)

<a id="API-CFG-33"></a>
#### API-CFG-33 · `POST /api/cfg/geo/normalize`

- **Qué hace:** Normalizar dirección (Georef). Registra un nuevo elemento u operación en `normalize`.
- **Para qué sirve:** RF-CFG-134: Entidades jurídicas del tenant (legalEntities, §7.14): cada tenant tiene una o más entidades jurídicas con código, razón social, nombre de fantasía, CUIT, condición frente al IVA, régimen de IIBB, domicilio legal, inicio de… · RF-CFG-135: Entidad por defecto: al consumir pla.tenant.created se crea en la misma unidad idempotente la entidad jurídica por defecto (isDefault = true) con los datos fiscales de tenants (razón social, CUIT, forma jurídica, matrícula INAES…
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `iam.sesion.autenticada`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T04 §11. API, línea 1558 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-33)

<a id="API-CFG-34"></a>
#### API-CFG-34 · `POST /api/cfg/geo/geocode`

- **Qué hace:** Candidatos de geocodificación (Google) con precisión. Registra un nuevo elemento u operación en `geocode`.
- **Para qué sirve:** RF-CFG-134: Entidades jurídicas del tenant (legalEntities, §7.14): cada tenant tiene una o más entidades jurídicas con código, razón social, nombre de fantasía, CUIT, condición frente al IVA, régimen de IIBB, domicilio legal, inicio de… · RF-CFG-135: Entidad por defecto: al consumir pla.tenant.created se crea en la misma unidad idempotente la entidad jurídica por defecto (isDefault = true) con los datos fiscales de tenants (razón social, CUIT, forma jurídica, matrícula INAES…
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `iam.sesion.autenticada`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O0 · **Fuente:** T04 §11. API, línea 1559 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-34)

<a id="API-CFG-35"></a>
#### API-CFG-35 · `POST /api/admin/cfg/geo/references/confirm`

- **Qué hace:** Confirmar/corregir punto de una entidad (llama al dueño). Confirma sobre `confirm`.
- **Para qué sirve:** RF-CFG-134: Entidades jurídicas del tenant (legalEntities, §7.14): cada tenant tiene una o más entidades jurídicas con código, razón social, nombre de fantasía, CUIT, condición frente al IVA, régimen de IIBB, domicilio legal, inicio de… · RF-CFG-135: Entidad por defecto: al consumir pla.tenant.created se crea en la misma unidad idempotente la entidad jurídica por defecto (isDefault = true) con los datos fiscales de tenants (razón social, CUIT, forma jurídica, matrícula INAES…
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.geo.confirmarPunto`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CFG-14 (Selector de dirección y punto en Google Maps y visor de mapa), PAN-CFG-15 (Revisión de georreferencias), PAN-CFG-32 (Confirmación/corrección del punto en terreno por el técnico).
- **Ola:** O0 · **Fuente:** T04 §11. API, línea 1560 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-35)

<a id="API-CFG-36"></a>
#### API-CFG-36 · `GET /api/admin/cfg/geo/review-queue`

- **Qué hace:** Cola de revisión. Consulta `review-queue`.
- **Para qué sirve:** RF-CFG-075: Ubicación por coordenadas o referencias cuando no hay coincidencia calle/altura, con revisión (cola PAN-CFG-15). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.geo.confirmarPunto`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CFG-14 (Selector de dirección y punto en Google Maps y visor de mapa), PAN-CFG-15 (Revisión de georreferencias), PAN-CFG-32 (Confirmación/corrección del punto en terreno por el técnico).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1561 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-36)

<a id="API-CFG-37"></a>
#### API-CFG-37 · `GET /api/admin/cfg/calendars`

- **Qué hace:** Calendarios y feriados. Lista, con filtros y paginación, los registros de calendarios de días hábiles (`calendars`).
- **Para qué sirve:** RF-CFG-087: Diferenciación de calendarios de lectura, liquidación, emisión y vencimiento: CFG provee días hábiles; los cronogramas los define M05/M03 usando este servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.calendarios.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de calendarios de días hábiles (`calendars`) con `total`.
- **Pantallas:** PAN-CFG-16 (Calendarios aplicables y feriados).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1562 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-37)

<a id="API-CFG-37-b"></a>
#### API-CFG-37-b · `POST /api/admin/cfg/calendars`

- **Qué hace:** Calendarios y feriados. Da de alta un registro de calendarios de días hábiles (`calendars`).
- **Para qué sirve:** RF-CFG-087: Diferenciación de calendarios de lectura, liquidación, emisión y vencimiento: CFG provee días hábiles; los cronogramas los define M05/M03 usando este servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.calendarios.editar`.
- **Recibe:** los datos de calendarios de días hábiles (`calendars`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de calendarios de días hábiles (`calendars`).
- **Pantallas:** PAN-CFG-16 (Calendarios aplicables y feriados).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1562 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-37-b)

<a id="API-CFG-37-c"></a>
#### API-CFG-37-c · `GET /api/admin/cfg/holidays`

- **Qué hace:** Calendarios y feriados. Lista, con filtros y paginación, los registros de feriados nacionales, provinciales y propios (`holidays`).
- **Para qué sirve:** RF-CFG-084: Calendarios jerárquicos: nacional (plataforma), provincial (plataforma), municipal (tenant), del tenant (días no laborables propios, asuetos) y opcionalmente por servicio. Un tenant/sucursal/servicio declara qué calendarios… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.calendarios.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de feriados nacionales, provinciales y propios (`holidays`) con `total`.
- **Pantallas:** PAN-CFG-16 (Calendarios aplicables y feriados).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1562 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-37-c)

<a id="API-CFG-37-d"></a>
#### API-CFG-37-d · `POST /api/admin/cfg/holidays`

- **Qué hace:** Calendarios y feriados. Da de alta un registro de feriados nacionales, provinciales y propios (`holidays`).
- **Para qué sirve:** RF-CFG-084: Calendarios jerárquicos: nacional (plataforma), provincial (plataforma), municipal (tenant), del tenant (días no laborables propios, asuetos) y opcionalmente por servicio. Un tenant/sucursal/servicio declara qué calendarios… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.calendarios.editar`.
- **Recibe:** los datos de feriados nacionales, provinciales y propios (`holidays`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de feriados nacionales, provinciales y propios (`holidays`).
- **Pantallas:** PAN-CFG-16 (Calendarios aplicables y feriados).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1562 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-37-d)

<a id="API-CFG-38"></a>
#### API-CFG-38 · `GET /api/cfg/business-days`

- **Qué hace:** IsBusinessDay, next, add, between con contexto. Consulta `business-days`.
- **Para qué sirve:** RF-CFG-025: El usuario puede ver el valor efectivo de cualquier clave para un contexto (sucursal/servicio/categoría) y de qué ámbito proviene. · RF-CFG-086: Servicio de días hábiles: isBusinessDay, nextBusinessDay, addBusinessDays, businessDaysBetween, con zona horaria del tenant y fines de semana configurables. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `iam.sesion.autenticada`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1563 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-38)

<a id="API-CFG-39"></a>
#### API-CFG-39 · `GET /api/admin/cfg/index-series`

- **Qué hace:** Series y valores. Lista, con filtros y paginación, los registros de series de índices (`economicIndexSeries`).
- **Para qué sirve:** RF-CFG-094: Carga manual e importación de valores de series propias del tenant con auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.indices.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de series de índices (`economicIndexSeries`) con `total`.
- **Pantallas:** PAN-CFG-17 (Series de índices y sus valores).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1564 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-39)

<a id="API-CFG-39-b"></a>
#### API-CFG-39-b · `POST /api/admin/cfg/index-series`

- **Qué hace:** Series y valores. Da de alta un registro de series de índices (`economicIndexSeries`).
- **Para qué sirve:** RF-CFG-094: Carga manual e importación de valores de series propias del tenant con auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.indices.editar`.
- **Recibe:** los datos de series de índices (`economicIndexSeries`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de series de índices (`economicIndexSeries`).
- **Pantallas:** PAN-CFG-17 (Series de índices y sus valores).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1564 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-39-b)

<a id="API-CFG-39-c"></a>
#### API-CFG-39-c · `POST /api/admin/cfg/index-series/{code}/values`

- **Qué hace:** Series y valores. Da de alta un registro de valores por ámbito (`parameterValues`).
- **Para qué sirve:** RF-CFG-090: Series de índices (economicIndexSeries): inflación (IPC nacional/regional INDEC, índices propios), cotizaciones de moneda (comprador/vendedor, por fecha y hora), tasas e índices para mora (diarios/mensuales), y otras (CER, UVA… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.indices.editar`.
- **Recibe:** en la ruta `code`; los datos de valores por ámbito (`parameterValues`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de valores por ámbito (`parameterValues`).
- **Pantallas:** PAN-CFG-17 (Series de índices y sus valores).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1564 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-39-c)

<a id="API-CFG-40"></a>
#### API-CFG-40 · `GET /api/cfg/index-series/{code}/value`

- **Qué hace:** Valor a fecha con regla de ausencia. Consulta «value» de un registro de series de índices (`economicIndexSeries`).
- **Para qué sirve:** RF-CFG-096: Consulta de valor de una serie a una fecha con regla de ausencia declarada (último publicado anterior / exacto o error). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `iam.sesion.autenticada`.
- **Recibe:** en la ruta `code`.
- **Devuelve:** 200: el registro de series de índices (`economicIndexSeries`).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1565 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-40)

<a id="API-CFG-41"></a>
#### API-CFG-41 · `GET /api/admin/cfg/adoptions`

- **Qué hace:** Adopciones y propósitos. Lista, con filtros y paginación, los registros de adopción por tenant (`platformTableAdoptions`).
- **Para qué sirve:** RF-CFG-091: Series de plataforma adoptables: el tenant elige qué serie oficial usa para cada propósito (PRM-CFG-024/025) o crea series propias (ej.: tabla de recargo propia de la cooperativa). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.adopciones.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de adopción por tenant (`platformTableAdoptions`) con `total`.
- **Pantallas:** PAN-CFG-17 (Series de índices y sus valores).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1566 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-41)

<a id="API-CFG-41-b"></a>
#### API-CFG-41-b · `PATCH /api/admin/cfg/adoptions`

- **Qué hace:** Adopciones y propósitos. Modifica algunos campos de un registro de adopción por tenant (`platformTableAdoptions`) (solo los enviados).
- **Para qué sirve:** RF-CFG-091: Series de plataforma adoptables: el tenant elige qué serie oficial usa para cada propósito (PRM-CFG-024/025) o crea series propias (ej.: tabla de recargo propia de la cooperativa). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.adopciones.configurar`.
- **Recibe:** solo los campos a cambiar de adopción por tenant (`platformTableAdoptions`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de adopción por tenant (`platformTableAdoptions`).
- **Pantallas:** PAN-CFG-17 (Series de índices y sus valores).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1566 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-41-b)

<a id="API-CFG-42"></a>
#### API-CFG-42 · `GET /api/admin/cfg/tax-registries/{code}/lookup`

- **Qué hace:** Consulta de padrón. Lista, con filtros y paginación, los registros de `lookup`.
- **Para qué sirve:** RF-CFG-056: Ingesta de padrones fiscales (ARCA, IIBB provinciales) por archivo o por integración, con jurisdicción, régimen, fecha de publicación, vigencia desde/hasta, alícuota y grupo; consulta por CUIT a fecha. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.fiscal.ver`.
- **Recibe:** en la ruta `code`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ResultadoGenerico (`ResultadoGenerico`) con `total`.
- **Pantallas:** PAN-CFG-10 (Padrones fiscales disponibles y su estado), PAN-CFG-19 (Tablas fiscales de referencia).
- **Ola:** O2 · **Fuente:** T04 §11. API, línea 1567 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-42)

<a id="API-CFG-43"></a>
#### API-CFG-43 · `GET /api/admin/cfg/enumerations`

- **Qué hace:** Enumeraciones. Lista, con filtros y paginación, los registros de enumeraciones configurables (`enumerations`).
- **Para qué sirve:** RF-CFG-026: Todo cambio de configuración (parámetros, registros maestros del tenant, enumeraciones, campos extra, personalizaciones de formularios y configuraciones de módulo que se registren en el motor) se hace dentro de una configVersion… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.enumeraciones.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de enumeraciones configurables (`enumerations`) con `total`.
- **Pantallas:** PAN-CFG-20 (Enumeraciones).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1568 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-43)

<a id="API-CFG-43-b"></a>
#### API-CFG-43-b · `POST /api/admin/cfg/enumerations`

- **Qué hace:** Enumeraciones. Da de alta un registro de enumeraciones configurables (`enumerations`).
- **Para qué sirve:** RF-CFG-026: Todo cambio de configuración (parámetros, registros maestros del tenant, enumeraciones, campos extra, personalizaciones de formularios y configuraciones de módulo que se registren en el motor) se hace dentro de una configVersion… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.enumeraciones.configurar`.
- **Recibe:** los datos de enumeraciones configurables (`enumerations`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de enumeraciones configurables (`enumerations`).
- **Pantallas:** PAN-CFG-20 (Enumeraciones).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1568 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-43-b)

<a id="API-CFG-43-c"></a>
#### API-CFG-43-c · `POST /api/admin/cfg/enumerations/{code}/items`

- **Qué hace:** Enumeraciones. Da de alta un registro de ítems de enumeraciones y tablas maestras simples (`enumerationItems`).
- **Para qué sirve:** RF-CFG-053: Los cambios a tablas maestras del tenant marcadas versioned pasan por configVersion; las tablas operativas simples (ej.: barrios) pueden configurarse con publicación inmediata auditada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.enumeraciones.configurar`.
- **Recibe:** en la ruta `code`; los datos de ítems de enumeraciones y tablas maestras simples (`enumerationItems`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de ítems de enumeraciones y tablas maestras simples (`enumerationItems`).
- **Pantallas:** PAN-CFG-20 (Enumeraciones).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1568 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-43-c)

<a id="API-CFG-44"></a>
#### API-CFG-44 · `GET /api/admin/cfg/custom-fields`

- **Qué hace:** Definiciones de campos extra. Consulta `custom-fields`.
- **Para qué sirve:** RF-CFG-111: Las columnas fijas de las tablas *_EXTRAS de ProCoop no se convierten en campos extra: pasan a campos de primera clase del modelo del módulo dueño (§19.4). Solo DATOSEXT/PROPIEITEMS (definidos por la cooperativa) migran a campos… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.camposExtra.configurar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CFG-21 (Definición de campos extra por entidad).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1569 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-44)

<a id="API-CFG-44-b"></a>
#### API-CFG-44-b · `POST /api/admin/cfg/custom-fields`

- **Qué hace:** Definiciones de campos extra. Registra un nuevo elemento u operación en `custom-fields`.
- **Para qué sirve:** RF-CFG-111: Las columnas fijas de las tablas *_EXTRAS de ProCoop no se convierten en campos extra: pasan a campos de primera clase del modelo del módulo dueño (§19.4). Solo DATOSEXT/PROPIEITEMS (definidos por la cooperativa) migran a campos… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.camposExtra.configurar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CFG-21 (Definición de campos extra por entidad).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1569 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-44-b)

<a id="API-CFG-44-c"></a>
#### API-CFG-44-c · `PATCH /api/admin/cfg/custom-fields`

- **Qué hace:** Definiciones de campos extra. Modifica algunos campos de un registro de `custom-fields` (solo los enviados).
- **Para qué sirve:** RF-CFG-111: Las columnas fijas de las tablas *_EXTRAS de ProCoop no se convierten en campos extra: pasan a campos de primera clase del modelo del módulo dueño (§19.4). Solo DATOSEXT/PROPIEITEMS (definidos por la cooperativa) migran a campos… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.camposExtra.configurar`.
- **Recibe:** solo los campos a cambiar; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CFG-21 (Definición de campos extra por entidad).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1569 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-44-c)

<a id="API-CFG-45"></a>
#### API-CFG-45 · `GET /api/cfg/forms/{formKey}/schema`

- **Qué hace:** Esquema efectivo del formulario (base + personalización + campos extra). Consulta «schema» de un registro de `schema`.
- **Para qué sirve:** RF-CFG-119: La personalización se aplica igual en frontend y backend (el esquema Zod efectivo del formulario incorpora las reglas del tenant). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `iam.sesion.autenticada`.
- **Recibe:** en la ruta `formKey`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1570 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-45)

<a id="API-CFG-46"></a>
#### API-CFG-46 · `GET /api/admin/cfg/form-customizations`

- **Qué hace:** Personalizaciones. Lista, con filtros y paginación, los registros de personalización de formularios (`formCustomizations`).
- **Para qué sirve:** RF-CFG-119: La personalización se aplica igual en frontend y backend (el esquema Zod efectivo del formulario incorpora las reglas del tenant). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.formularios.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de personalización de formularios (`formCustomizations`) con `total`.
- **Pantallas:** PAN-CFG-22 (Personalización de formularios del registro de formularios).
- **Ola:** O2 · **Fuente:** T04 §11. API, línea 1571 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-46)

<a id="API-CFG-46-b"></a>
#### API-CFG-46-b · `POST /api/admin/cfg/form-customizations`

- **Qué hace:** Personalizaciones. Da de alta un registro de personalización de formularios (`formCustomizations`).
- **Para qué sirve:** RF-CFG-119: La personalización se aplica igual en frontend y backend (el esquema Zod efectivo del formulario incorpora las reglas del tenant). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.formularios.configurar`.
- **Recibe:** los datos de personalización de formularios (`formCustomizations`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de personalización de formularios (`formCustomizations`).
- **Pantallas:** PAN-CFG-22 (Personalización de formularios del registro de formularios).
- **Ola:** O2 · **Fuente:** T04 §11. API, línea 1571 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-46-b)

<a id="API-CFG-46-c"></a>
#### API-CFG-46-c · `PATCH /api/admin/cfg/form-customizations`

- **Qué hace:** Personalizaciones. Modifica algunos campos de un registro de personalización de formularios (`formCustomizations`) (solo los enviados).
- **Para qué sirve:** RF-CFG-119: La personalización se aplica igual en frontend y backend (el esquema Zod efectivo del formulario incorpora las reglas del tenant). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.formularios.configurar`.
- **Recibe:** solo los campos a cambiar de personalización de formularios (`formCustomizations`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de personalización de formularios (`formCustomizations`).
- **Pantallas:** PAN-CFG-22 (Personalización de formularios del registro de formularios).
- **Ola:** O2 · **Fuente:** T04 §11. API, línea 1571 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-46-c)

<a id="API-CFG-47"></a>
#### API-CFG-47 · `GET /api/cfg/saved-views`

- **Qué hace:** Vistas guardadas. Consulta `saved-views`.
- **Para qué sirve:** RF-CFG-115: Vistas guardadas por pantalla: columnas visibles y orden, filtros, orden, agrupación, totales, formato condicional, tamaño de página; privadas, compartidas por rol o por tenant; una vista por defecto por usuario y por tenant. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `cfg.vistas.crear`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CFG-23 (Gestión de vistas guardadas).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1572 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-47)

<a id="API-CFG-47-b"></a>
#### API-CFG-47-b · `POST /api/cfg/saved-views`

- **Qué hace:** Vistas guardadas. Registra un nuevo elemento u operación en `saved-views`.
- **Para qué sirve:** RF-CFG-115: Vistas guardadas por pantalla: columnas visibles y orden, filtros, orden, agrupación, totales, formato condicional, tamaño de página; privadas, compartidas por rol o por tenant; una vista por defecto por usuario y por tenant. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `cfg.vistas.crear`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CFG-23 (Gestión de vistas guardadas).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1572 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-47-b)

<a id="API-CFG-47-d"></a>
#### API-CFG-47-d · `DELETE /api/cfg/saved-views`

- **Qué hace:** Vistas guardadas. Elimina o da de baja un registro de `saved-views`.
- **Para qué sirve:** RF-CFG-115: Vistas guardadas por pantalla: columnas visibles y orden, filtros, orden, agrupación, totales, formato condicional, tamaño de página; privadas, compartidas por rol o por tenant; una vista por defecto por usuario y por tenant. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `cfg.vistas.compartir`.
- **Recibe:** cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-CFG-23 (Gestión de vistas guardadas).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1572 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-47-d)

<a id="API-CFG-47-c"></a>
#### API-CFG-47-c · `PATCH /api/cfg/saved-views`

- **Qué hace:** Vistas guardadas. Modifica algunos campos de un registro de `saved-views` (solo los enviados).
- **Para qué sirve:** RF-CFG-115: Vistas guardadas por pantalla: columnas visibles y orden, filtros, orden, agrupación, totales, formato condicional, tamaño de página; privadas, compartidas por rol o por tenant; una vista por defecto por usuario y por tenant. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `cfg.vistas.crear`.
- **Recibe:** solo los campos a cambiar; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CFG-23 (Gestión de vistas guardadas).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1572 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-47-c)

<a id="API-CFG-48"></a>
#### API-CFG-48 · `GET /api/admin/cfg/service-profiles`

- **Qué hace:** Completitud del perfil por servicio. Consulta `service-profiles`.
- **Para qué sirve:** RF-CFG-028: Validación de la versión: tipos y rangos, dependencias, referencias existentes y vigentes en el tenant, validadores cruzados de los módulos, completitud de los perfiles de servicio afectados, y ausencia de referencias a otro… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.parametros.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CFG-01 (Centro de configuración), PAN-CFG-02 (Explorador de parámetros por módulo y grupo), PAN-CFG-03 (Ficha de parámetro) y 1 más.
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1573 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-48)

<a id="API-CFG-49"></a>
#### API-CFG-49 · `GET /api/admin/cfg/technical`

- **Qué hace:** Estado de secretos requeridos. Consulta `technical`.
- **Para qué sirve:** RF-CFG-121: Vista de configuración técnica del tenant (PAN-CFG-28): lista los secretRef requeridos por los módulos activos con estado (configurado, faltante, por vencer), sin mostrar valores; enlace a la bóveda (T06). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.tecnica.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CFG-28 (Estado de configuración técnica del tenant).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1574 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-49)

<a id="API-CFG-50"></a>
#### API-CFG-50 · `POST /api/platform/cfg/seed-packs/{code}/apply`

- **Qué hace:** Aplicar/retirar semilla. Aplica un registro de paquetes de precarga de demostración (`seedPacks`).
- **Para qué sirve:** RF-CFG-060: Los datos de demostración se identifican (demoData: true y seedApplicationId) y se mantienen separados de los operativos; pueden retirarse en bloque. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.cfg.semillas.administrar`.
- **Recibe:** en la ruta `code`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CFG-24 (Paquetes semilla y su aplicación).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1575 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-50)

<a id="API-CFG-50-b"></a>
#### API-CFG-50-b · `POST /api/platform/cfg/seed-applications/{id}/remove`

- **Qué hace:** Aplicar/retirar semilla. Registra «remove» sobre un registro de paquetes aplicados por tenant (`seedApplications`).
- **Para qué sirve:** RF-CFG-064: Solo se aplican semillas en tenants marcados demo/sandbox, salvo plantillas sin importes. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.cfg.semillas.administrar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CFG-24 (Paquetes semilla y su aplicación).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1575 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-50-b)

<a id="API-CFG-51"></a>
#### API-CFG-51 · `GET /api/platform/cfg/table-releases`

- **Qué hace:** Releases de tablas de plataforma. Lista, con filtros y paginación, los registros de versiones publicadas de tablas de plataforma no fiscales (`platformTableReleases`).
- **Para qué sirve:** RF-CFG-101: Toda tabla fiscal de plataforma se publica por platformTableRelease con fuente (norma/resolución/URL), fecha de publicación y vigencia; el tenant recibe aviso y adopta según PRM-CFG-033. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.cfg.tablasPlataforma.editar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de versiones publicadas de tablas de plataforma no fiscales (`platformTableReleases`) con `total`.
- **Pantallas:** PAN-CFG-26 (Tablas de plataforma y releases).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1576 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-51)

<a id="API-CFG-51-b"></a>
#### API-CFG-51-b · `POST /api/platform/cfg/table-releases`

- **Qué hace:** Releases de tablas de plataforma. Da de alta un registro de versiones publicadas de tablas de plataforma no fiscales (`platformTableReleases`).
- **Para qué sirve:** RF-CFG-101: Toda tabla fiscal de plataforma se publica por platformTableRelease con fuente (norma/resolución/URL), fecha de publicación y vigencia; el tenant recibe aviso y adopta según PRM-CFG-033. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.cfg.tablasPlataforma.editar`.
- **Recibe:** los datos de versiones publicadas de tablas de plataforma no fiscales (`platformTableReleases`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de versiones publicadas de tablas de plataforma no fiscales (`platformTableReleases`).
- **Pantallas:** PAN-CFG-26 (Tablas de plataforma y releases).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1576 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-51-b)

<a id="API-CFG-51-c"></a>
#### API-CFG-51-c · `POST /api/platform/cfg/table-releases/{id}/publish`

- **Qué hace:** Releases de tablas de plataforma. Publica un registro de versiones publicadas de tablas de plataforma no fiscales (`platformTableReleases`).
- **Para qué sirve:** RF-CFG-101: Toda tabla fiscal de plataforma se publica por platformTableRelease con fuente (norma/resolución/URL), fecha de publicación y vigencia; el tenant recibe aviso y adopta según PRM-CFG-033. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.cfg.tablasPlataforma.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CFG-26 (Tablas de plataforma y releases).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1576 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-51-c)

<a id="API-CFG-52"></a>
#### API-CFG-52 · `GET /api/platform/cfg/legacy-mappings`

- **Qué hace:** Equivalencias V2. Consulta `legacy-mappings`.
- **Para qué sirve:** RF-CFG-141: Puestos (workstations, §7.16): puestos físicos de cada sucursal con su agente local (M09) y dispositivos declarados; el puesto no es ámbito de configuración (PA-CFG-06). ABM con cfg.puestos.editar. · RF-CFG-124: Configuración propia e independiente por tenant y servicio (COP-001): cada valor de ámbito service/category pertenece a un tenant; editar el origen no afecta copias. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.cfg.equivalencias.editar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CFG-27 (Equivalencias V2 → clave para migración).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1577 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-52)

<a id="API-CFG-52-b"></a>
#### API-CFG-52-b · `PATCH /api/platform/cfg/legacy-mappings`

- **Qué hace:** Equivalencias V2. Modifica algunos campos de un registro de `legacy-mappings` (solo los enviados).
- **Para qué sirve:** RF-CFG-141: Puestos (workstations, §7.16): puestos físicos de cada sucursal con su agente local (M09) y dispositivos declarados; el puesto no es ámbito de configuración (PA-CFG-06). ABM con cfg.puestos.editar. · RF-CFG-124: Configuración propia e independiente por tenant y servicio (COP-001): cada valor de ámbito service/category pertenece a un tenant; editar el origen no afecta copias. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `pla.cfg.equivalencias.editar`.
- **Recibe:** solo los campos a cambiar; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CFG-27 (Equivalencias V2 → clave para migración).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1577 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-52-b)

<a id="API-CFG-53"></a>
#### API-CFG-53 · `GET /api/v1/ext/cfg/geo/{resto}`

- **Qué hace:** Lectura de maestros públicos para APIs de terceros (T10). Obtiene el detalle de un registro de `geo`.
- **Para qué sirve:** RF-CFG-023: Lectura masiva por módulo/grupo para pantallas y apps (/api/admin/cfg/effective?module=) y lectura pública acotada para PWA/landing solo de claves con channel público. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); permiso `bia.apis.consumir`.
- **Recibe:** en la ruta `resto`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1578 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-53)

<a id="API-CFG-53-b"></a>
#### API-CFG-53-b · `GET /api/v1/ext/cfg/index-series/{resto}`

- **Qué hace:** Lectura de maestros públicos para APIs de terceros (T10). Obtiene el detalle de un registro de series de índices (`economicIndexSeries`).
- **Para qué sirve:** RF-CFG-023: Lectura masiva por módulo/grupo para pantallas y apps (/api/admin/cfg/effective?module=) y lectura pública acotada para PWA/landing solo de claves con channel público. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); permiso `bia.apis.consumir`.
- **Recibe:** en la ruta `resto`.
- **Devuelve:** 200: el registro de series de índices (`economicIndexSeries`).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1578 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-53-b)

<a id="API-CFG-55"></a>
#### API-CFG-55 · `GET /api/admin/cfg/legal-entities`

- **Qué hace:** Entidades jurídicas (RF-CFG-134 a 139). Lista, con filtros y paginación, los registros de entidades jurídicas emisoras del tenant (`legalEntities`).
- **Para qué sirve:** RF-CFG-134: Entidades jurídicas del tenant (legalEntities, §7.14): cada tenant tiene una o más entidades jurídicas con código, razón social, nombre de fantasía, CUIT, condición frente al IVA, régimen de IIBB, domicilio legal, inicio de… · RF-CFG-135: Entidad por defecto: al consumir pla.tenant.created se crea en la misma unidad idempotente la entidad jurídica por defecto (isDefault = true) con los datos fiscales de tenants (razón social, CUIT, forma jurídica, matrícula INAES…
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.entidadesJuridicas.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de entidades jurídicas emisoras del tenant (`legalEntities`) con `total`.
- **Pantallas:** PAN-CFG-33 (Entidades jurídicas del tenant).
- **Ola:** O0 · **Fuente:** T04 §11. API, línea 1580 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-55)

<a id="API-CFG-55-b"></a>
#### API-CFG-55-b · `POST /api/admin/cfg/legal-entities`

- **Qué hace:** Entidades jurídicas (RF-CFG-134 a 139). Da de alta un registro de entidades jurídicas emisoras del tenant (`legalEntities`).
- **Para qué sirve:** RF-CFG-134: Entidades jurídicas del tenant (legalEntities, §7.14): cada tenant tiene una o más entidades jurídicas con código, razón social, nombre de fantasía, CUIT, condición frente al IVA, régimen de IIBB, domicilio legal, inicio de… · RF-CFG-135: Entidad por defecto: al consumir pla.tenant.created se crea en la misma unidad idempotente la entidad jurídica por defecto (isDefault = true) con los datos fiscales de tenants (razón social, CUIT, forma jurídica, matrícula INAES…
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.entidadesJuridicas.editar`.
- **Recibe:** los datos de entidades jurídicas emisoras del tenant (`legalEntities`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de entidades jurídicas emisoras del tenant (`legalEntities`).
- **Pantallas:** PAN-CFG-33 (Entidades jurídicas del tenant).
- **Ola:** O0 · **Fuente:** T04 §11. API, línea 1580 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-55-b)

<a id="API-CFG-55-c"></a>
#### API-CFG-55-c · `GET /api/admin/cfg/legal-entities/{id}`

- **Qué hace:** Entidades jurídicas (RF-CFG-134 a 139). Obtiene el detalle de un registro de entidades jurídicas emisoras del tenant (`legalEntities`).
- **Para qué sirve:** RF-CFG-134: Entidades jurídicas del tenant (legalEntities, §7.14): cada tenant tiene una o más entidades jurídicas con código, razón social, nombre de fantasía, CUIT, condición frente al IVA, régimen de IIBB, domicilio legal, inicio de… · RF-CFG-135: Entidad por defecto: al consumir pla.tenant.created se crea en la misma unidad idempotente la entidad jurídica por defecto (isDefault = true) con los datos fiscales de tenants (razón social, CUIT, forma jurídica, matrícula INAES…
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.entidadesJuridicas.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de entidades jurídicas emisoras del tenant (`legalEntities`).
- **Pantallas:** PAN-CFG-33 (Entidades jurídicas del tenant).
- **Ola:** O0 · **Fuente:** T04 §11. API, línea 1580 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-55-c)

<a id="API-CFG-55-d"></a>
#### API-CFG-55-d · `PATCH /api/admin/cfg/legal-entities/{id}`

- **Qué hace:** Entidades jurídicas (RF-CFG-134 a 139). Modifica algunos campos de un registro de entidades jurídicas emisoras del tenant (`legalEntities`) (solo los enviados).
- **Para qué sirve:** RF-CFG-134: Entidades jurídicas del tenant (legalEntities, §7.14): cada tenant tiene una o más entidades jurídicas con código, razón social, nombre de fantasía, CUIT, condición frente al IVA, régimen de IIBB, domicilio legal, inicio de… · RF-CFG-135: Entidad por defecto: al consumir pla.tenant.created se crea en la misma unidad idempotente la entidad jurídica por defecto (isDefault = true) con los datos fiscales de tenants (razón social, CUIT, forma jurídica, matrícula INAES…
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.entidadesJuridicas.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de entidades jurídicas emisoras del tenant (`legalEntities`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de entidades jurídicas emisoras del tenant (`legalEntities`).
- **Pantallas:** PAN-CFG-33 (Entidades jurídicas del tenant).
- **Ola:** O0 · **Fuente:** T04 §11. API, línea 1580 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-55-d)

<a id="API-CFG-55-e"></a>
#### API-CFG-55-e · `POST /api/admin/cfg/legal-entities/{id}/set-default`

- **Qué hace:** Entidades jurídicas (RF-CFG-134 a 139). Registra «set-default» sobre un registro de entidades jurídicas emisoras del tenant (`legalEntities`).
- **Para qué sirve:** RF-CFG-134: Entidades jurídicas del tenant (legalEntities, §7.14): cada tenant tiene una o más entidades jurídicas con código, razón social, nombre de fantasía, CUIT, condición frente al IVA, régimen de IIBB, domicilio legal, inicio de… · RF-CFG-135: Entidad por defecto: al consumir pla.tenant.created se crea en la misma unidad idempotente la entidad jurídica por defecto (isDefault = true) con los datos fiscales de tenants (razón social, CUIT, forma jurídica, matrícula INAES…
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.entidadesJuridicas.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CFG-33 (Entidades jurídicas del tenant).
- **Ola:** O0 · **Fuente:** T04 §11. API, línea 1580 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-55-e)

<a id="API-CFG-55-f"></a>
#### API-CFG-55-f · `POST /api/admin/cfg/legal-entities/{id}/deactivate`

- **Qué hace:** Entidades jurídicas (RF-CFG-134 a 139). Desactiva un registro de entidades jurídicas emisoras del tenant (`legalEntities`).
- **Para qué sirve:** RF-CFG-134: Entidades jurídicas del tenant (legalEntities, §7.14): cada tenant tiene una o más entidades jurídicas con código, razón social, nombre de fantasía, CUIT, condición frente al IVA, régimen de IIBB, domicilio legal, inicio de… · RF-CFG-135: Entidad por defecto: al consumir pla.tenant.created se crea en la misma unidad idempotente la entidad jurídica por defecto (isDefault = true) con los datos fiscales de tenants (razón social, CUIT, forma jurídica, matrícula INAES…
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.entidadesJuridicas.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CFG-33 (Entidades jurídicas del tenant).
- **Ola:** O0 · **Fuente:** T04 §11. API, línea 1580 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-55-f)

<a id="API-CFG-55-g"></a>
#### API-CFG-55-g · `PATCH /api/admin/cfg/legal-entities/{id}/employer`

- **Qué hace:** Entidades jurídicas (RF-CFG-134 a 139). Modifica algunos campos de un registro de entidades jurídicas emisoras del tenant (`legalEntities`) (solo los enviados).
- **Para qué sirve:** RF-CFG-134: Entidades jurídicas del tenant (legalEntities, §7.14): cada tenant tiene una o más entidades jurídicas con código, razón social, nombre de fantasía, CUIT, condición frente al IVA, régimen de IIBB, domicilio legal, inicio de… · RF-CFG-135: Entidad por defecto: al consumir pla.tenant.created se crea en la misma unidad idempotente la entidad jurídica por defecto (isDefault = true) con los datos fiscales de tenants (razón social, CUIT, forma jurídica, matrícula INAES…
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.entidadesJuridicas.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de entidades jurídicas emisoras del tenant (`legalEntities`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de entidades jurídicas emisoras del tenant (`legalEntities`).
- **Pantallas:** PAN-CFG-33 (Entidades jurídicas del tenant).
- **Ola:** O0 · **Fuente:** T04 §11. API, línea 1580 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-55-g)

<a id="API-CFG-56"></a>
#### API-CFG-56 · `GET /api/admin/cfg/branches`

- **Qué hace:** Sucursales (RF-CFG-140). Lista, con filtros y paginación, los registros de sucursales del tenant (`branches`).
- **Para qué sirve:** RF-CFG-140: Sucursales (branches, §7.15): código, nombre, entidad jurídica, localidad, domicilio georreferenciado, usos (atención, caja, depósito, punto de venta, base técnica), horarios, calendario local y estado. Al crear el tenant se crea…
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.sucursales.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de sucursales del tenant (`branches`) con `total`.
- **Pantallas:** PAN-CFG-34 (Sucursales).
- **Ola:** O0 · **Fuente:** T04 §11. API, línea 1581 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-56)

<a id="API-CFG-56-b"></a>
#### API-CFG-56-b · `POST /api/admin/cfg/branches`

- **Qué hace:** Sucursales (RF-CFG-140). Da de alta un registro de sucursales del tenant (`branches`).
- **Para qué sirve:** RF-CFG-140: Sucursales (branches, §7.15): código, nombre, entidad jurídica, localidad, domicilio georreferenciado, usos (atención, caja, depósito, punto de venta, base técnica), horarios, calendario local y estado. Al crear el tenant se crea…
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.sucursales.editar`.
- **Recibe:** los datos de sucursales del tenant (`branches`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de sucursales del tenant (`branches`).
- **Pantallas:** PAN-CFG-34 (Sucursales).
- **Ola:** O0 · **Fuente:** T04 §11. API, línea 1581 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-56-b)

<a id="API-CFG-56-c"></a>
#### API-CFG-56-c · `GET /api/admin/cfg/branches/{id}`

- **Qué hace:** Sucursales (RF-CFG-140). Obtiene el detalle de un registro de sucursales del tenant (`branches`).
- **Para qué sirve:** RF-CFG-140: Sucursales (branches, §7.15): código, nombre, entidad jurídica, localidad, domicilio georreferenciado, usos (atención, caja, depósito, punto de venta, base técnica), horarios, calendario local y estado. Al crear el tenant se crea…
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.sucursales.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de sucursales del tenant (`branches`).
- **Pantallas:** PAN-CFG-34 (Sucursales).
- **Ola:** O0 · **Fuente:** T04 §11. API, línea 1581 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-56-c)

<a id="API-CFG-56-d"></a>
#### API-CFG-56-d · `PATCH /api/admin/cfg/branches/{id}`

- **Qué hace:** Sucursales (RF-CFG-140). Modifica algunos campos de un registro de sucursales del tenant (`branches`) (solo los enviados).
- **Para qué sirve:** RF-CFG-140: Sucursales (branches, §7.15): código, nombre, entidad jurídica, localidad, domicilio georreferenciado, usos (atención, caja, depósito, punto de venta, base técnica), horarios, calendario local y estado. Al crear el tenant se crea…
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.sucursales.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de sucursales del tenant (`branches`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de sucursales del tenant (`branches`).
- **Pantallas:** PAN-CFG-34 (Sucursales).
- **Ola:** O0 · **Fuente:** T04 §11. API, línea 1581 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-56-d)

<a id="API-CFG-56-e"></a>
#### API-CFG-56-e · `POST /api/admin/cfg/branches/{id}/change-legal-entity`

- **Qué hace:** Sucursales (RF-CFG-140). Registra «change-legal-entity» sobre un registro de sucursales del tenant (`branches`).
- **Para qué sirve:** RF-CFG-140: Sucursales (branches, §7.15): código, nombre, entidad jurídica, localidad, domicilio georreferenciado, usos (atención, caja, depósito, punto de venta, base técnica), horarios, calendario local y estado. Al crear el tenant se crea…
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.sucursales.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CFG-34 (Sucursales).
- **Ola:** O0 · **Fuente:** T04 §11. API, línea 1581 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-56-e)

<a id="API-CFG-56-f"></a>
#### API-CFG-56-f · `POST /api/admin/cfg/branches/{id}/deactivate`

- **Qué hace:** Sucursales (RF-CFG-140). Desactiva un registro de sucursales del tenant (`branches`).
- **Para qué sirve:** RF-CFG-140: Sucursales (branches, §7.15): código, nombre, entidad jurídica, localidad, domicilio georreferenciado, usos (atención, caja, depósito, punto de venta, base técnica), horarios, calendario local y estado. Al crear el tenant se crea…
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.sucursales.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CFG-34 (Sucursales).
- **Ola:** O0 · **Fuente:** T04 §11. API, línea 1581 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-56-f)

<a id="API-CFG-57"></a>
#### API-CFG-57 · `GET /api/admin/cfg/workstations`

- **Qué hace:** Puestos (RF-CFG-141). Lista, con filtros y paginación, los registros de puestos físicos (`workstations`).
- **Para qué sirve:** RF-CFG-141: Puestos (workstations, §7.16): puestos físicos de cada sucursal con su agente local (M09) y dispositivos declarados; el puesto no es ámbito de configuración (PA-CFG-06). ABM con cfg.puestos.editar.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.puestos.editar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de puestos físicos (`workstations`) con `total`.
- **Pantallas:** PAN-CFG-35 (Puestos por sucursal).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1582 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-57)

<a id="API-CFG-57-b"></a>
#### API-CFG-57-b · `POST /api/admin/cfg/workstations`

- **Qué hace:** Puestos (RF-CFG-141). Da de alta un registro de puestos físicos (`workstations`).
- **Para qué sirve:** RF-CFG-141: Puestos (workstations, §7.16): puestos físicos de cada sucursal con su agente local (M09) y dispositivos declarados; el puesto no es ámbito de configuración (PA-CFG-06). ABM con cfg.puestos.editar.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.puestos.editar`.
- **Recibe:** los datos de puestos físicos (`workstations`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de puestos físicos (`workstations`).
- **Pantallas:** PAN-CFG-35 (Puestos por sucursal).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1582 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-57-b)

<a id="API-CFG-57-c"></a>
#### API-CFG-57-c · `GET /api/admin/cfg/workstations/{id}`

- **Qué hace:** Puestos (RF-CFG-141). Obtiene el detalle de un registro de puestos físicos (`workstations`).
- **Para qué sirve:** RF-CFG-141: Puestos (workstations, §7.16): puestos físicos de cada sucursal con su agente local (M09) y dispositivos declarados; el puesto no es ámbito de configuración (PA-CFG-06). ABM con cfg.puestos.editar.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.puestos.editar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de puestos físicos (`workstations`).
- **Pantallas:** PAN-CFG-35 (Puestos por sucursal).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1582 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-57-c)

<a id="API-CFG-57-d"></a>
#### API-CFG-57-d · `PATCH /api/admin/cfg/workstations/{id}`

- **Qué hace:** Puestos (RF-CFG-141). Modifica algunos campos de un registro de puestos físicos (`workstations`) (solo los enviados).
- **Para qué sirve:** RF-CFG-141: Puestos (workstations, §7.16): puestos físicos de cada sucursal con su agente local (M09) y dispositivos declarados; el puesto no es ámbito de configuración (PA-CFG-06). ABM con cfg.puestos.editar.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cfg.puestos.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de puestos físicos (`workstations`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de puestos físicos (`workstations`).
- **Pantallas:** PAN-CFG-35 (Puestos por sucursal).
- **Ola:** O1 · **Fuente:** T04 §11. API, línea 1582 · [Ver en Swagger](../18-swagger/index.html?api=t04-cfg#/API/API-CFG-57-d)
