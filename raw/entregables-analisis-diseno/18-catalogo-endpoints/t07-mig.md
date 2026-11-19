# Catálogo de endpoints · T07 · Migración desde ProCoop, convivencia, corrida paralela y by-pass

Parte del [catálogo de endpoints](../18-catalogo-endpoints.md) (artefacto 7.1). Generado el 05-11-2026 con `_trabajo/gen_18_catalogo_endpoints.py` a partir de `18-openapi/`; no se edita a mano.

## Para qué sirve esta API

Definir, de forma ejecutable y comprobable, cómo se trasladan los datos de cada cooperativa que hoy opera con ProCoop (SQL Server + aplicación .NET de escritorio + portal CoopOnline sobre MySQL) a GoodApps Cooperativas (SaaS multitenant sobre MongoDB, DEC-001/DEC-002), y cómo se convive con ProCoop hasta apagarlo, sin interrumpir la operación diaria de la cooperativa (BASE §64.7) y sin perder trazabilidad de ningún saldo, documento, equipo instalado o dato histórico (BASE §31 "Criterio"). El anexo cubre:

1. La estrategia de migración por cooperativa, por módulo y por ola.
2. Las fases: inventario, perfilado de calidad, mapeo, limpieza, extracción, transformación, carga, validación, conciliación (saldos, deuda, stock, contabilidad), corrida paralela, by-pass, corte definitivo y rollback.
3. La herramienta de migración: pipeline ETL con staging, reglas de mapeo versionadas, informes de rechazos, reprocesos idempotentes, mapa de IDs legacy → nuevos conservando legacyId.
4. Los criterios de aceptación por dominio (personas/cuentas, suministros, medidores y lecturas, cuadros tarifarios, deuda y cuenta corriente, comprobantes históricos, cobranzas, financiaciones, stock, contabilidad, proveedores, sueldos, institucional).
5. El tratamiento del histórico (qué se migra vivo, qué como histórico de solo lectura y qué se archiva).
6. La calidad de datos (CUIT/DNI inválidos, duplicados, direcciones y calles).
7. La corrida paralela con facturación comparada factura por factura (BASE §103 FAC-012, DFA §33).
8. El by-pass de ProCoop: qué módulos siguen en ProCoop durante la convivencia y cómo se sincronizan.
9. La anonimización para ambientes de prueba (REL README, FIC 21 "Pendiente").
10. La matriz completa de mapeo de las 659 tablas de ProCoop (CAT), con destino, anexo dueño, ola y estrategia.

Detalle completo en el anexo T07, sección 1. Contrato navegable: [Swagger](../18-swagger/index.html?api=t07-mig).

| Dato | Valor |
|---|---|
| Endpoints | 54 |
| Por método | GET 21, PATCH 5, POST 25, PUT 3 |
| Grupos funcionales | 1 |
| Con requisito citado en el anexo | 0 |
| Con requisito inferido (a confirmar) | 52 |
| Sin requisito identificable | 2 |

## Grupos funcionales

| Grupo | Endpoints | Qué agrupa (primeros endpoints) |
|---|---|---|
| [API](#grupo-1) | 54 | Listar / crear proyectos.; Detalle / actualizar estrategia.; Cambiar estado (§8.1)… |

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

54 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-MIG-01](#API-MIG-01) | GET | `/api/platform/migration/projects` | Listar / crear proyectos. |
| [API-MIG-01-b](#API-MIG-01-b) | POST | `/api/platform/migration/projects` | Listar / crear proyectos. |
| [API-MIG-02](#API-MIG-02) | GET | `/api/platform/migration/projects/{id}` | Detalle / actualizar estrategia. |
| [API-MIG-02-b](#API-MIG-02-b) | PATCH | `/api/platform/migration/projects/{id}` | Detalle / actualizar estrategia. |
| [API-MIG-03](#API-MIG-03) | POST | `/api/platform/migration/projects/{id}/transition` | Cambiar estado (§8.1) |
| [API-MIG-04](#API-MIG-04) | GET | `/api/platform/migration/projects/{id}/inventory` | Inventario de tablas. |
| [API-MIG-04-b](#API-MIG-04-b) | PATCH | `/api/platform/migration/projects/{id}/inventory` | Inventario de tablas. |
| [API-MIG-05](#API-MIG-05) | POST | `/api/platform/migration/projects/{id}/snapshots` | Extraer snapshot full/delta/final. |
| [API-MIG-06](#API-MIG-06) | GET | `/api/platform/migration/snapshots/{id}/manifest` | Manifiesto. |
| [API-MIG-07](#API-MIG-07) | GET | `/api/platform/migration/mapping-sets` | Conjuntos de mapeo. |
| [API-MIG-07-b](#API-MIG-07-b) | POST | `/api/platform/migration/mapping-sets` | Conjuntos de mapeo. |
| [API-MIG-08](#API-MIG-08) | POST | `/api/platform/migration/mapping-sets/{id}/publish` | Publicar (inmutable) |
| [API-MIG-09](#API-MIG-09) | POST | `/api/platform/migration/mapping-rules/{id}/preview` | Vista previa sobre muestra. |
| [API-MIG-10](#API-MIG-10) | GET | `/api/admin/migration/value-maps/{code}` | Mapas de valores del tenant. |
| [API-MIG-10-b](#API-MIG-10-b) | PUT | `/api/admin/migration/value-maps/{code}` | Mapas de valores del tenant. |
| [API-MIG-11](#API-MIG-11) | POST | `/api/platform/migration/runs` | Lanzar corrida. |
| [API-MIG-12](#API-MIG-12) | POST | `/api/platform/migration/runs/{id}/cancel` | Control de corrida. |
| [API-MIG-12-b](#API-MIG-12-b) | POST | `/api/platform/migration/runs/{id}/resume` | Control de corrida. |
| [API-MIG-12-c](#API-MIG-12-c) | POST | `/api/platform/migration/runs/{id}/purge` | Control de corrida. |
| [API-MIG-13](#API-MIG-13) | GET | `/api/admin/migration/runs/{id}` | Estado y estadísticas. |
| [API-MIG-14](#API-MIG-14) | GET | `/api/admin/migration/issues` | Rechazos/advertencias paginados { items, total, page, size }. |
| [API-MIG-15](#API-MIG-15) | PATCH | `/api/admin/migration/issues/{id}` | Asignar, excluir, aceptar. |
| [API-MIG-16](#API-MIG-16) | PATCH | `/api/admin/migration/staging/{id}` | Corregir registro en staging. |
| [API-MIG-17](#API-MIG-17) | POST | `/api/admin/migration/runs/{id}/reprocess` | Reprocesar selección. |
| [API-MIG-18](#API-MIG-18) | GET | `/api/admin/migration/issues/export` | Exportar XLSX/CSV. |
| [API-MIG-19](#API-MIG-19) | GET | `/api/admin/migration/quality/person-merges` | Candidatos y decisiones de fusión. |
| [API-MIG-19-b](#API-MIG-19-b) | POST | `/api/admin/migration/quality/person-merges` | Candidatos y decisiones de fusión. |
| [API-MIG-20](#API-MIG-20) | GET | `/api/admin/migration/reconciliations` | Conciliaciones. |
| [API-MIG-20-b](#API-MIG-20-b) | POST | `/api/admin/migration/reconciliations` | Conciliaciones. |
| [API-MIG-21](#API-MIG-21) | POST | `/api/admin/migration/reconciliations/{id}/submit` | Flujo de aprobación. |
| [API-MIG-21-b](#API-MIG-21-b) | POST | `/api/admin/migration/reconciliations/{id}/approve` | Flujo de aprobación. |
| [API-MIG-21-c](#API-MIG-21-c) | POST | `/api/admin/migration/reconciliations/{id}/reject` | Flujo de aprobación. |
| [API-MIG-22](#API-MIG-22) | POST | `/api/admin/migration/parallel-runs` | Crear corrida paralela (simular + importar + comparar) |
| [API-MIG-23](#API-MIG-23) | GET | `/api/admin/migration/parallel-runs/{id}/comparisons` | Comparaciones paginadas. |
| [API-MIG-24](#API-MIG-24) | PATCH | `/api/admin/migration/parallel-comparisons/{id}` | Clasificar y justificar. |
| [API-MIG-25](#API-MIG-25) | POST | `/api/admin/migration/parallel-runs/{id}/approve` | Aprobar ciclo. |
| [API-MIG-26](#API-MIG-26) | GET | `/api/admin/migration/bypass-plan` | Plan de by-pass. |
| [API-MIG-26-b](#API-MIG-26-b) | PUT | `/api/admin/migration/bypass-plan` | Plan de by-pass. |
| [API-MIG-27](#API-MIG-27) | POST | `/api/admin/migration/bypass-plan/domains/{domain}/switch` | Cambiar sistema de registro. |
| [API-MIG-28](#API-MIG-28) | GET | `/api/admin/migration/coexistence-syncs` | Sincronizaciones y ejecución manual. |
| [API-MIG-28-b](#API-MIG-28-b) | POST | `/api/admin/migration/coexistence-syncs` | Sincronizaciones y ejecución manual. |
| [API-MIG-29](#API-MIG-29) | GET | `/api/admin/migration/cutover` | Runbook. |
| [API-MIG-29-b](#API-MIG-29-b) | PUT | `/api/admin/migration/cutover` | Runbook. |
| [API-MIG-30](#API-MIG-30) | POST | `/api/admin/migration/cutover/go` | Decisión go y pasos. |
| [API-MIG-30-b](#API-MIG-30-b) | POST | `/api/admin/migration/cutover/execute-step` | Decisión go y pasos. |
| [API-MIG-31](#API-MIG-31) | POST | `/api/admin/migration/rollback` | Ejecutar plan de retorno. |
| [API-MIG-32](#API-MIG-32) | GET | `/api/admin/migration/rollback/journal/export` | Exportar diario en formatos ProCoop. |
| [API-MIG-33](#API-MIG-33) | GET | `/api/admin/migration/key-aliases` | Buscar alias. |
| [API-MIG-34](#API-MIG-34) | POST | `/api/admin/migration/key-aliases/resolve` | Resolver clave heredada → destino. |
| [API-MIG-35](#API-MIG-35) | GET | `/api/admin/legacy/records` | Histórico por vínculo (?accountId=&table=&from=&to=) |
| [API-MIG-36](#API-MIG-36) | GET | `/api/legacy/history` | Histórico propio en PWA. |
| [API-MIG-37](#API-MIG-37) | GET | `/api/platform/migration/anonymization-profiles` | Perfiles y ejecución. |
| [API-MIG-37-b](#API-MIG-37-b) | POST | `/api/platform/migration/anonymization-profiles` | Perfiles y ejecución. |
| [API-MIG-38](#API-MIG-38) | GET | `/api/admin/migration/legacy-id-map` | Consultar mapa de IDs (?table=&key= o ?collection=&id=) |

<a id="API-MIG-01"></a>
#### API-MIG-01 · `GET /api/platform/migration/projects`

- **Qué hace:** Listar / crear proyectos. Lista, con filtros y paginación, los registros de proyecto de migración por cooperativa (`migrationProjects`).
- **Para qué sirve:** RF-MIG-001: Crear un proyecto de migración por cooperativa con tenant destino, sigla ProCoop (V2 2264), versión de ProCoop, fuentes y responsables. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `mig.proyectos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de proyecto de migración por cooperativa (`migrationProjects`) con `total`.
- **Pantallas:** PAN-MIG-01 (Listado de proyectos por cooperativa), PAN-MIG-02 (Tablero del proyecto), PAN-MIG-04 (Inventario de 659 tablas) y 1 más.
- **Ola:** O1 · **Fuente:** T07 §11. API, línea 964 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-01)

<a id="API-MIG-01-b"></a>
#### API-MIG-01-b · `POST /api/platform/migration/projects`

- **Qué hace:** Listar / crear proyectos. Da de alta un registro de proyecto de migración por cooperativa (`migrationProjects`).
- **Para qué sirve:** RF-MIG-001: Crear un proyecto de migración por cooperativa con tenant destino, sigla ProCoop (V2 2264), versión de ProCoop, fuentes y responsables. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `mig.proyectos.crear`.
- **Recibe:** los datos de proyecto de migración por cooperativa (`migrationProjects`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de proyecto de migración por cooperativa (`migrationProjects`).
- **Ola:** O1 · **Fuente:** T07 §11. API, línea 964 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-01-b)

<a id="API-MIG-02"></a>
#### API-MIG-02 · `GET /api/platform/migration/projects/{id}`

- **Qué hace:** Detalle / actualizar estrategia. Obtiene el detalle de un registro de proyecto de migración por cooperativa (`migrationProjects`).
- **Para qué sirve:** RF-MIG-001: Crear un proyecto de migración por cooperativa con tenant destino, sigla ProCoop (V2 2264), versión de ProCoop, fuentes y responsables. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `mig.proyectos.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de proyecto de migración por cooperativa (`migrationProjects`).
- **Pantallas:** PAN-MIG-01 (Listado de proyectos por cooperativa), PAN-MIG-02 (Tablero del proyecto), PAN-MIG-04 (Inventario de 659 tablas) y 1 más.
- **Ola:** O1 · **Fuente:** T07 §11. API, línea 965 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-02)

<a id="API-MIG-02-b"></a>
#### API-MIG-02-b · `PATCH /api/platform/migration/projects/{id}`

- **Qué hace:** Detalle / actualizar estrategia. Modifica algunos campos de un registro de proyecto de migración por cooperativa (`migrationProjects`) (solo los enviados).
- **Para qué sirve:** RF-MIG-001: Crear un proyecto de migración por cooperativa con tenant destino, sigla ProCoop (V2 2264), versión de ProCoop, fuentes y responsables. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `mig.proyectos.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de proyecto de migración por cooperativa (`migrationProjects`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de proyecto de migración por cooperativa (`migrationProjects`).
- **Pantallas:** PAN-MIG-03 (Fuentes y accesos).
- **Ola:** O1 · **Fuente:** T07 §11. API, línea 965 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-02-b)

<a id="API-MIG-03"></a>
#### API-MIG-03 · `POST /api/platform/migration/projects/{id}/transition`

- **Qué hace:** Cambiar estado (§8.1) Cambia de estado (transición) un registro de proyecto de migración por cooperativa (`migrationProjects`).
- **Para qué sirve:** RF-MIG-001: Crear un proyecto de migración por cooperativa con tenant destino, sigla ProCoop (V2 2264), versión de ProCoop, fuentes y responsables. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `mig.proyectos.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MIG-03 (Fuentes y accesos).
- **Ola:** O1 · **Fuente:** T07 §11. API, línea 966 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-03)

<a id="API-MIG-04"></a>
#### API-MIG-04 · `GET /api/platform/migration/projects/{id}/inventory`

- **Qué hace:** Inventario de tablas. Consulta «inventory» de un registro de proyecto de migración por cooperativa (`migrationProjects`).
- **Para qué sirve:** RF-MIG-003: Precargar el inventario de las 659 tablas de CAT con su estrategia, destino, anexo dueño y ola por defecto (matriz §19), editable por proyecto con justificación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `mig.proyectos.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de proyecto de migración por cooperativa (`migrationProjects`).
- **Pantallas:** PAN-MIG-01 (Listado de proyectos por cooperativa), PAN-MIG-02 (Tablero del proyecto), PAN-MIG-04 (Inventario de 659 tablas) y 1 más.
- **Ola:** O1 · **Fuente:** T07 §11. API, línea 967 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-04)

<a id="API-MIG-04-b"></a>
#### API-MIG-04-b · `PATCH /api/platform/migration/projects/{id}/inventory`

- **Qué hace:** Inventario de tablas. Modifica algunos campos de un registro de proyecto de migración por cooperativa (`migrationProjects`) (solo los enviados).
- **Para qué sirve:** RF-MIG-003: Precargar el inventario de las 659 tablas de CAT con su estrategia, destino, anexo dueño y ola por defecto (matriz §19), editable por proyecto con justificación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `mig.proyectos.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de proyecto de migración por cooperativa (`migrationProjects`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de proyecto de migración por cooperativa (`migrationProjects`).
- **Pantallas:** PAN-MIG-03 (Fuentes y accesos).
- **Ola:** O1 · **Fuente:** T07 §11. API, línea 967 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-04-b)

<a id="API-MIG-05"></a>
#### API-MIG-05 · `POST /api/platform/migration/projects/{id}/snapshots`

- **Qué hace:** Extraer snapshot full/delta/final. Da de alta un registro de copias del origen (`legacySnapshots`).
- **Para qué sirve:** RF-MIG-087: Delta final post-congelamiento, conciliación final y acta de aceptación firmada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `mig.snapshots.crear`.
- **Recibe:** en la ruta `id`; los datos de copias del origen (`legacySnapshots`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de copias del origen (`legacySnapshots`).
- **Pantallas:** PAN-MIG-05 (Snapshots).
- **Ola:** O0 · **Fuente:** T07 §11. API, línea 968 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-05)

<a id="API-MIG-06"></a>
#### API-MIG-06 · `GET /api/platform/migration/snapshots/{id}/manifest`

- **Qué hace:** Manifiesto. Consulta «manifest» de un registro de copias del origen (`legacySnapshots`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `mig.proyectos.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de copias del origen (`legacySnapshots`).
- **Pantallas:** PAN-MIG-01 (Listado de proyectos por cooperativa), PAN-MIG-02 (Tablero del proyecto), PAN-MIG-04 (Inventario de 659 tablas) y 1 más.
- **Ola:** O0 · **Fuente:** T07 §11. API, línea 969 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-06)

<a id="API-MIG-07"></a>
#### API-MIG-07 · `GET /api/platform/migration/mapping-sets`

- **Qué hace:** Conjuntos de mapeo. Lista, con filtros y paginación, los registros de conjuntos versionados de reglas (`migrationMappingSets`).
- **Para qué sirve:** RF-MIG-030: Reglas de mapeo declarativas versionadas (tabla/columna origen → colección/campo destino, transformación, validación), agrupadas en conjuntos publicados con semver. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `mig.reglas.editar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de conjuntos versionados de reglas (`migrationMappingSets`) con `total`.
- **Pantallas:** PAN-MIG-07 (Conjuntos y reglas de mapeo).
- **Ola:** O1 · **Fuente:** T07 §11. API, línea 970 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-07)

<a id="API-MIG-07-b"></a>
#### API-MIG-07-b · `POST /api/platform/migration/mapping-sets`

- **Qué hace:** Conjuntos de mapeo. Da de alta un registro de conjuntos versionados de reglas (`migrationMappingSets`).
- **Para qué sirve:** RF-MIG-030: Reglas de mapeo declarativas versionadas (tabla/columna origen → colección/campo destino, transformación, validación), agrupadas en conjuntos publicados con semver. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `mig.reglas.editar`.
- **Recibe:** los datos de conjuntos versionados de reglas (`migrationMappingSets`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de conjuntos versionados de reglas (`migrationMappingSets`).
- **Pantallas:** PAN-MIG-07 (Conjuntos y reglas de mapeo).
- **Ola:** O1 · **Fuente:** T07 §11. API, línea 970 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-07-b)

<a id="API-MIG-08"></a>
#### API-MIG-08 · `POST /api/platform/migration/mapping-sets/{id}/publish`

- **Qué hace:** Publicar (inmutable) Publica un registro de conjuntos versionados de reglas (`migrationMappingSets`).
- **Para qué sirve:** RF-MIG-030: Reglas de mapeo declarativas versionadas (tabla/columna origen → colección/campo destino, transformación, validación), agrupadas en conjuntos publicados con semver. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `mig.reglas.publicar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T07 §11. API, línea 971 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-08)

<a id="API-MIG-09"></a>
#### API-MIG-09 · `POST /api/platform/migration/mapping-rules/{id}/preview`

- **Qué hace:** Vista previa sobre muestra. Previsualiza sin efectos un registro de reglas tabla → colección (`migrationMappingRules`).
- **Para qué sirve:** RF-MIG-030: Reglas de mapeo declarativas versionadas (tabla/columna origen → colección/campo destino, transformación, validación), agrupadas en conjuntos publicados con semver. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `mig.reglas.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MIG-07 (Conjuntos y reglas de mapeo).
- **Ola:** O1 · **Fuente:** T07 §11. API, línea 972 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-09)

<a id="API-MIG-10"></a>
#### API-MIG-10 · `GET /api/admin/migration/value-maps/{code}`

- **Qué hace:** Mapas de valores del tenant. Obtiene el detalle de un registro de mapas de valores (`migrationValueMaps`).
- **Para qué sirve:** RF-MIG-032: Mapas de valores para códigos maestros (situaciones IVA, tipos de documento, estados de servicio, causas, transacciones técnicas, tipos de comprobante, medios de pago). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mig.valores.editar`.
- **Recibe:** en la ruta `code`.
- **Devuelve:** 200: el registro de mapas de valores (`migrationValueMaps`).
- **Pantallas:** PAN-MIG-08 (Mapas de valores).
- **Ola:** O1 · **Fuente:** T07 §11. API, línea 973 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-10)

<a id="API-MIG-10-b"></a>
#### API-MIG-10-b · `PUT /api/admin/migration/value-maps/{code}`

- **Qué hace:** Mapas de valores del tenant. Reemplaza o configura un registro de mapas de valores (`migrationValueMaps`).
- **Para qué sirve:** RF-MIG-032: Mapas de valores para códigos maestros (situaciones IVA, tipos de documento, estados de servicio, causas, transacciones técnicas, tipos de comprobante, medios de pago). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mig.valores.editar`.
- **Recibe:** en la ruta `code`; los datos de mapas de valores (`migrationValueMaps`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de mapas de valores (`migrationValueMaps`).
- **Pantallas:** PAN-MIG-08 (Mapas de valores).
- **Ola:** O1 · **Fuente:** T07 §11. API, línea 973 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-10-b)

<a id="API-MIG-11"></a>
#### API-MIG-11 · `POST /api/platform/migration/runs`

- **Qué hace:** Lanzar corrida. Da de alta un registro de corrida paralela (`parallelRuns`).
- **Para qué sirve:** RF-MIG-070: Ejecutar ciclos de facturación en paralelo sobre el mismo padrón y período que ProCoop, en modo simulación (sin CAE, sin publicar deuda, sin notificar). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `mig.corridas.ejecutar`.
- **Recibe:** los datos de corrida paralela (`parallelRuns`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de corrida paralela (`parallelRuns`).
- **Pantallas:** PAN-MIG-09 (Corridas de migración).
- **Ola:** O11 · **Fuente:** T07 §11. API, línea 974 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-11)

<a id="API-MIG-12"></a>
#### API-MIG-12 · `POST /api/platform/migration/runs/{id}/cancel`

- **Qué hace:** Control de corrida. Cancela un registro de corrida paralela (`parallelRuns`).
- **Para qué sirve:** RF-MIG-046: Borrado de una corrida de ensayo completa (solo en ambiente/tenant de ensayo) con todos sus documentos. · RF-MIG-053: Conciliación por dominio con conteos y sumas de control origen vs destino, diferencias explicadas y aprobación del responsable. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `mig.corridas.cancelar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O11 · **Fuente:** T07 §11. API, línea 975 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-12)

<a id="API-MIG-12-b"></a>
#### API-MIG-12-b · `POST /api/platform/migration/runs/{id}/resume`

- **Qué hace:** Control de corrida. Reanuda un registro de corrida paralela (`parallelRuns`).
- **Para qué sirve:** RF-MIG-046: Borrado de una corrida de ensayo completa (solo en ambiente/tenant de ensayo) con todos sus documentos. · RF-MIG-053: Conciliación por dominio con conteos y sumas de control origen vs destino, diferencias explicadas y aprobación del responsable. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `mig.corridas.cancelar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O11 · **Fuente:** T07 §11. API, línea 975 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-12-b)

<a id="API-MIG-12-c"></a>
#### API-MIG-12-c · `POST /api/platform/migration/runs/{id}/purge`

- **Qué hace:** Control de corrida. Registra «purge» sobre un registro de corrida paralela (`parallelRuns`).
- **Para qué sirve:** RF-MIG-046: Borrado de una corrida de ensayo completa (solo en ambiente/tenant de ensayo) con todos sus documentos. · RF-MIG-053: Conciliación por dominio con conteos y sumas de control origen vs destino, diferencias explicadas y aprobación del responsable. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `mig.corridas.cancelar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O11 · **Fuente:** T07 §11. API, línea 975 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-12-c)

<a id="API-MIG-13"></a>
#### API-MIG-13 · `GET /api/admin/migration/runs/{id}`

- **Qué hace:** Estado y estadísticas. Obtiene el detalle de un registro de corrida paralela (`parallelRuns`).
- **Para qué sirve:** RF-MIG-046: Borrado de una corrida de ensayo completa (solo en ambiente/tenant de ensayo) con todos sus documentos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mig.proyectos.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de corrida paralela (`parallelRuns`).
- **Pantallas:** PAN-MIG-01 (Listado de proyectos por cooperativa), PAN-MIG-02 (Tablero del proyecto), PAN-MIG-04 (Inventario de 659 tablas) y 1 más.
- **Ola:** O11 · **Fuente:** T07 §11. API, línea 976 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-13)

<a id="API-MIG-14"></a>
#### API-MIG-14 · `GET /api/admin/migration/issues`

- **Qué hace:** Rechazos/advertencias paginados { items, total, page, size }. Lista, con filtros y paginación, los registros de rechazos y advertencias (`migrationIssues`).
- **Para qué sirve:** RF-MIG-054: Conciliación de deuda por titular y por servicio, con total general igual al saldo de deudores por servicios de la contabilidad. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mig.rechazos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de rechazos y advertencias (`migrationIssues`) con `total`.
- **Pantallas:** PAN-MIG-10 (Rechazos y advertencias).
- **Ola:** O1 · **Fuente:** T07 §11. API, línea 977 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-14)

<a id="API-MIG-15"></a>
#### API-MIG-15 · `PATCH /api/admin/migration/issues/{id}`

- **Qué hace:** Asignar, excluir, aceptar. Modifica algunos campos de un registro de rechazos y advertencias (`migrationIssues`) (solo los enviados).
- **Para qué sirve:** RF-MIG-087: Delta final post-congelamiento, conciliación final y acta de aceptación firmada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mig.rechazos.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de rechazos y advertencias (`migrationIssues`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de rechazos y advertencias (`migrationIssues`).
- **Ola:** O1 · **Fuente:** T07 §11. API, línea 978 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-15)

<a id="API-MIG-16"></a>
#### API-MIG-16 · `PATCH /api/admin/migration/staging/{id}`

- **Qué hace:** Corregir registro en staging. Modifica algunos campos de un registro de `staging` (solo los enviados).
- **Para qué sirve:** RF-MIG-027: Cola de saneamiento por tipo de problema con asignación a usuarios de la cooperativa, corrección en staging y reproceso. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mig.rechazos.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T07 §11. API, línea 979 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-16)

<a id="API-MIG-17"></a>
#### API-MIG-17 · `POST /api/admin/migration/runs/{id}/reprocess`

- **Qué hace:** Reprocesar selección. Reprocesa un registro de corrida paralela (`parallelRuns`).
- **Para qué sirve:** RF-MIG-070: Ejecutar ciclos de facturación en paralelo sobre el mismo padrón y período que ProCoop, en modo simulación (sin CAE, sin publicar deuda, sin notificar). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mig.corridas.ejecutar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MIG-09 (Corridas de migración).
- **Ola:** O11 · **Fuente:** T07 §11. API, línea 980 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-17)

<a id="API-MIG-18"></a>
#### API-MIG-18 · `GET /api/admin/migration/issues/export`

- **Qué hace:** Exportar XLSX/CSV. Descarga un archivo de rechazos y advertencias (`migrationIssues`).
- **Para qué sirve:** RF-MIG-051: Informe de rechazos por corrida: tabla, clave, regla, campo, valor, severidad, acción sugerida; exportable XLSX/CSV. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mig.rechazos.exportar`.
- **Recibe:** nada.
- **Devuelve:** 200: un archivo (application/octet-stream).
- **Ola:** O1 · **Fuente:** T07 §11. API, línea 981 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-18)

<a id="API-MIG-19"></a>
#### API-MIG-19 · `GET /api/admin/migration/quality/person-merges`

- **Qué hace:** Candidatos y decisiones de fusión. Consulta `person-merges`.
- **Para qué sirve:** RF-MIG-023: Prohibir fusionar contratos o cuentas por coincidencia de persona o domicilio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mig.calidad.sanear`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MIG-11 (Saneamiento de personas y duplicados), PAN-MIG-12 (Normalización de domicilios y calles).
- **Ola:** O2 · **Fuente:** T07 §11. API, línea 982 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-19)

<a id="API-MIG-19-b"></a>
#### API-MIG-19-b · `POST /api/admin/migration/quality/person-merges`

- **Qué hace:** Candidatos y decisiones de fusión. Registra un nuevo elemento u operación en `person-merges`.
- **Para qué sirve:** RF-MIG-023: Prohibir fusionar contratos o cuentas por coincidencia de persona o domicilio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mig.calidad.sanear`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MIG-11 (Saneamiento de personas y duplicados), PAN-MIG-12 (Normalización de domicilios y calles).
- **Ola:** O2 · **Fuente:** T07 §11. API, línea 982 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-19-b)

<a id="API-MIG-20"></a>
#### API-MIG-20 · `GET /api/admin/migration/reconciliations`

- **Qué hace:** Conciliaciones. Lista, con filtros y paginación, los registros de conciliaciones origen-destino (`migrationReconciliations`).
- **Para qué sirve:** RF-MIG-053: Conciliación por dominio con conteos y sumas de control origen vs destino, diferencias explicadas y aprobación del responsable. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mig.conciliacion.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de conciliaciones origen-destino (`migrationReconciliations`) con `total`.
- **Pantallas:** PAN-MIG-13 (Conciliaciones por dominio).
- **Ola:** O1 · **Fuente:** T07 §11. API, línea 983 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-20)

<a id="API-MIG-20-b"></a>
#### API-MIG-20-b · `POST /api/admin/migration/reconciliations`

- **Qué hace:** Conciliaciones. Da de alta un registro de conciliaciones origen-destino (`migrationReconciliations`).
- **Para qué sirve:** RF-MIG-053: Conciliación por dominio con conteos y sumas de control origen vs destino, diferencias explicadas y aprobación del responsable. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mig.conciliacion.ver`.
- **Recibe:** los datos de conciliaciones origen-destino (`migrationReconciliations`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de conciliaciones origen-destino (`migrationReconciliations`).
- **Pantallas:** PAN-MIG-13 (Conciliaciones por dominio).
- **Ola:** O1 · **Fuente:** T07 §11. API, línea 983 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-20-b)

<a id="API-MIG-21"></a>
#### API-MIG-21 · `POST /api/admin/migration/reconciliations/{id}/submit`

- **Qué hace:** Flujo de aprobación. Envía a revisión o presenta un registro de conciliaciones origen-destino (`migrationReconciliations`).
- **Para qué sirve:** RF-MIG-053: Conciliación por dominio con conteos y sumas de control origen vs destino, diferencias explicadas y aprobación del responsable. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mig.conciliacion.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T07 §11. API, línea 984 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-21)

<a id="API-MIG-21-b"></a>
#### API-MIG-21-b · `POST /api/admin/migration/reconciliations/{id}/approve`

- **Qué hace:** Flujo de aprobación. Aprueba un registro de conciliaciones origen-destino (`migrationReconciliations`).
- **Para qué sirve:** RF-MIG-053: Conciliación por dominio con conteos y sumas de control origen vs destino, diferencias explicadas y aprobación del responsable. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mig.conciliacion.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T07 §11. API, línea 984 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-21-b)

<a id="API-MIG-21-c"></a>
#### API-MIG-21-c · `POST /api/admin/migration/reconciliations/{id}/reject`

- **Qué hace:** Flujo de aprobación. Rechaza un registro de conciliaciones origen-destino (`migrationReconciliations`).
- **Para qué sirve:** RF-MIG-053: Conciliación por dominio con conteos y sumas de control origen vs destino, diferencias explicadas y aprobación del responsable. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mig.conciliacion.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T07 §11. API, línea 984 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-21-c)

<a id="API-MIG-22"></a>
#### API-MIG-22 · `POST /api/admin/migration/parallel-runs`

- **Qué hace:** Crear corrida paralela (simular + importar + comparar) Da de alta un registro de corrida paralela (`parallelRuns`).
- **Para qué sirve:** RF-MIG-070: Ejecutar ciclos de facturación en paralelo sobre el mismo padrón y período que ProCoop, en modo simulación (sin CAE, sin publicar deuda, sin notificar). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mig.paralelo.ejecutar`.
- **Recibe:** los datos de corrida paralela (`parallelRuns`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de corrida paralela (`parallelRuns`).
- **Ola:** O11 · **Fuente:** T07 §11. API, línea 985 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-22)

<a id="API-MIG-23"></a>
#### API-MIG-23 · `GET /api/admin/migration/parallel-runs/{id}/comparisons`

- **Qué hace:** Comparaciones paginadas. Consulta «comparisons» de un registro de corrida paralela (`parallelRuns`).
- **Para qué sirve:** RF-MIG-075: Tablero de paralelo: comprobantes comparados, iguales, distintos dentro de tolerancia, distintos fuera de tolerancia, explicados, pendientes; por servicio, categoría, ruta y concepto. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mig.paralelo.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de corrida paralela (`parallelRuns`).
- **Pantallas:** PAN-MIG-14 (Tablero de corrida paralela).
- **Ola:** O11 · **Fuente:** T07 §11. API, línea 986 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-23)

<a id="API-MIG-24"></a>
#### API-MIG-24 · `PATCH /api/admin/migration/parallel-comparisons/{id}`

- **Qué hace:** Clasificar y justificar. Modifica algunos campos de un registro de comparación ítem a ítem (`parallelComparisons`) (solo los enviados).
- **Para qué sirve:** RF-MIG-073: Clasificar diferencias (configuración, dato migrado, redondeo, regla corregida a propósito, error GoodApps, error ProCoop conocido) y asignarles responsable y justificación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mig.paralelo.justificar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de comparación ítem a ítem (`parallelComparisons`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de comparación ítem a ítem (`parallelComparisons`).
- **Pantallas:** PAN-MIG-15 (Comparación de una factura).
- **Ola:** O11 · **Fuente:** T07 §11. API, línea 987 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-24)

<a id="API-MIG-25"></a>
#### API-MIG-25 · `POST /api/admin/migration/parallel-runs/{id}/approve`

- **Qué hace:** Aprobar ciclo. Aprueba un registro de corrida paralela (`parallelRuns`).
- **Para qué sirve:** RF-MIG-076: Aprobación del paralelo por ciclo y por servicio cuando se cumplen los criterios del §17. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mig.paralelo.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O11 · **Fuente:** T07 §11. API, línea 988 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-25)

<a id="API-MIG-26"></a>
#### API-MIG-26 · `GET /api/admin/migration/bypass-plan`

- **Qué hace:** Plan de by-pass. Lista, con filtros y paginación, los registros de by-pass por módulo (`bypassPlans`).
- **Para qué sirve:** RF-MIG-080: Plan de by-pass por módulo con estado: ProCoop maestro → GoodApps en paralelo → GoodApps maestro (ProCoop solo consulta) → ProCoop apagado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mig.bypass.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de by-pass por módulo (`bypassPlans`) con `total`.
- **Pantallas:** PAN-MIG-16 (Convivencia y by-pass).
- **Ola:** O11 · **Fuente:** T07 §11. API, línea 989 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-26)

<a id="API-MIG-26-b"></a>
#### API-MIG-26-b · `PUT /api/admin/migration/bypass-plan`

- **Qué hace:** Plan de by-pass. Reemplaza o configura by-pass por módulo (`bypassPlans`).
- **Para qué sirve:** RF-MIG-080: Plan de by-pass por módulo con estado: ProCoop maestro → GoodApps en paralelo → GoodApps maestro (ProCoop solo consulta) → ProCoop apagado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mig.bypass.configurar`.
- **Recibe:** los datos de by-pass por módulo (`bypassPlans`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de by-pass por módulo (`bypassPlans`).
- **Pantallas:** PAN-MIG-16 (Convivencia y by-pass).
- **Ola:** O11 · **Fuente:** T07 §11. API, línea 989 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-26-b)

<a id="API-MIG-27"></a>
#### API-MIG-27 · `POST /api/admin/migration/bypass-plan/domains/{domain}/switch`

- **Qué hace:** Cambiar sistema de registro. Registra «switch» sobre un registro de by-pass por módulo (`bypassPlans`).
- **Para qué sirve:** RF-MIG-080: Plan de by-pass por módulo con estado: ProCoop maestro → GoodApps en paralelo → GoodApps maestro (ProCoop solo consulta) → ProCoop apagado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mig.bypass.aprobar`.
- **Recibe:** en la ruta `domain`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O11 · **Fuente:** T07 §11. API, línea 990 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-27)

<a id="API-MIG-28"></a>
#### API-MIG-28 · `GET /api/admin/migration/coexistence-syncs`

- **Qué hace:** Sincronizaciones y ejecución manual. Lista, con filtros y paginación, los registros de sincronizaciones de convivencia (`coexistenceSyncs`).
- **Para qué sirve:** RF-MIG-081: Sincronización ProCoop → GoodApps por deltas programados mientras ProCoop es maestro (para paralelo y ensayos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mig.bypass.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de sincronizaciones de convivencia (`coexistenceSyncs`) con `total`.
- **Pantallas:** PAN-MIG-16 (Convivencia y by-pass).
- **Ola:** O11 · **Fuente:** T07 §11. API, línea 991 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-28)

<a id="API-MIG-28-b"></a>
#### API-MIG-28-b · `POST /api/admin/migration/coexistence-syncs`

- **Qué hace:** Sincronizaciones y ejecución manual. Da de alta un registro de sincronizaciones de convivencia (`coexistenceSyncs`).
- **Para qué sirve:** RF-MIG-081: Sincronización ProCoop → GoodApps por deltas programados mientras ProCoop es maestro (para paralelo y ensayos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mig.bypass.configurar`.
- **Recibe:** los datos de sincronizaciones de convivencia (`coexistenceSyncs`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de sincronizaciones de convivencia (`coexistenceSyncs`).
- **Pantallas:** PAN-MIG-16 (Convivencia y by-pass).
- **Ola:** O11 · **Fuente:** T07 §11. API, línea 991 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-28-b)

<a id="API-MIG-29"></a>
#### API-MIG-29 · `GET /api/admin/migration/cutover`

- **Qué hace:** Runbook. Consulta `cutover`.
- **Para qué sirve:** RF-MIG-086: Plan de corte (cutover runbook) con pasos, responsables, prerrequisitos, criterios go/no-go y ventana. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mig.corte.planificar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MIG-17 (Plan de corte).
- **Ola:** O7 · **Fuente:** T07 §11. API, línea 992 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-29)

<a id="API-MIG-29-b"></a>
#### API-MIG-29-b · `PUT /api/admin/migration/cutover`

- **Qué hace:** Runbook. Reemplaza o configura `cutover`.
- **Para qué sirve:** RF-MIG-086: Plan de corte (cutover runbook) con pasos, responsables, prerrequisitos, criterios go/no-go y ventana. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mig.corte.planificar`.
- **Recibe:** un cuerpo JSON cuya estructura detalla el anexo; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MIG-17 (Plan de corte).
- **Ola:** O7 · **Fuente:** T07 §11. API, línea 992 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-29-b)

<a id="API-MIG-30"></a>
#### API-MIG-30 · `POST /api/admin/migration/cutover/go`

- **Qué hace:** Decisión go y pasos. Registra un nuevo elemento u operación en `go`.
- **Para qué sirve:** RF-MIG-086: Plan de corte (cutover runbook) con pasos, responsables, prerrequisitos, criterios go/no-go y ventana. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mig.corte.aprobar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O7 · **Fuente:** T07 §11. API, línea 993 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-30)

<a id="API-MIG-30-b"></a>
#### API-MIG-30-b · `POST /api/admin/migration/cutover/execute-step`

- **Qué hace:** Decisión go y pasos. Registra un nuevo elemento u operación en `execute-step`.
- **Para qué sirve:** RF-MIG-086: Plan de corte (cutover runbook) con pasos, responsables, prerrequisitos, criterios go/no-go y ventana. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mig.corte.aprobar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O7 · **Fuente:** T07 §11. API, línea 993 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-30-b)

<a id="API-MIG-31"></a>
#### API-MIG-31 · `POST /api/admin/migration/rollback`

- **Qué hace:** Ejecutar plan de retorno. Deshace (rollback) sobre `rollback`.
- **Para qué sirve:** RF-MIG-088: Rollback: plan de retorno con diario (rollbackJournal) de todo hecho registrado en GoodApps después del corte (cobros, comprobantes, lecturas, altas) y exportación para cargarlo en ProCoop. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mig.rollback.ejecutar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MIG-18 (Rollback).
- **Ola:** O7 · **Fuente:** T07 §11. API, línea 994 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-31)

<a id="API-MIG-32"></a>
#### API-MIG-32 · `GET /api/admin/migration/rollback/journal/export`

- **Qué hace:** Exportar diario en formatos ProCoop. Descarga un archivo de diario de reversión (`rollbackJournal`).
- **Para qué sirve:** RF-MIG-088: Rollback: plan de retorno con diario (rollbackJournal) de todo hecho registrado en GoodApps después del corte (cobros, comprobantes, lecturas, altas) y exportación para cargarlo en ProCoop. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mig.rollback.ejecutar`.
- **Recibe:** nada.
- **Devuelve:** 200: un archivo (application/octet-stream).
- **Pantallas:** PAN-MIG-18 (Rollback).
- **Ola:** O11 · **Fuente:** T07 §11. API, línea 995 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-32)

<a id="API-MIG-33"></a>
#### API-MIG-33 · `GET /api/admin/migration/key-aliases`

- **Qué hace:** Buscar alias. Lista, con filtros y paginación, los registros de alias de claves ProCoop vigentes (`legacyKeyAliases`).
- **Para qué sirve:** RF-MIG-047: Tabla de alias de claves externas (legacyKeyAliases): códigos de barra ProCoop, identificador Red Link/SIRO, FACTURAS.USUARIO, cuentas "cuenta × 100 + servicio", CNT_NOT, TALONFAC.NUMERO. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mig.proyectos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de alias de claves ProCoop vigentes (`legacyKeyAliases`) con `total`.
- **Pantallas:** PAN-MIG-01 (Listado de proyectos por cooperativa), PAN-MIG-02 (Tablero del proyecto), PAN-MIG-04 (Inventario de 659 tablas) y 1 más.
- **Ola:** O1 · **Fuente:** T07 §11. API, línea 996 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-33)

<a id="API-MIG-34"></a>
#### API-MIG-34 · `POST /api/admin/migration/key-aliases/resolve`

- **Qué hace:** Resolver clave heredada → destino. Resuelve sobre alias de claves ProCoop vigentes (`legacyKeyAliases`).
- **Para qué sirve:** RF-MIG-083: Resolutor de claves heredadas durante la transición (Red Link, SIRO, códigos de barra ProCoop en caja, FACTURAS.USUARIO) que solo imputa a comprobantes impagos y no imputa ante ambigüedad. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mig.clavesHeredadas.resolver`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T07 §11. API, línea 997 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-34)

<a id="API-MIG-35"></a>
#### API-MIG-35 · `GET /api/admin/legacy/records`

- **Qué hace:** Histórico por vínculo (?accountId=&table=&from=&to=) Lista, con filtros y paginación, los registros de histórico no tipado consultable (`legacyRecords`).
- **Para qué sirve:** RF-MIG-061: Archivo histórico genérico legacyRecords para tablas Histórico sin modelo tipado: payload JSON del registro origen, tabla, clave, fechas, búsqueda por cuenta/persona. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mig.archivo.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de histórico no tipado consultable (`legacyRecords`) con `total`.
- **Pantallas:** PAN-MIG-20 (Consultar histórico).
- **Ola:** O1 · **Fuente:** T07 §11. API, línea 998 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-35)

<a id="API-MIG-36"></a>
#### API-MIG-36 · `GET /api/legacy/history`

- **Qué hace:** Histórico propio en PWA. Consulta `history`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Convivencia con ProCoop durante la migración; permiso `mig.miHistorial.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O1 · **Fuente:** T07 §11. API, línea 999 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-36)

<a id="API-MIG-37"></a>
#### API-MIG-37 · `GET /api/platform/migration/anonymization-profiles`

- **Qué hace:** Perfiles y ejecución. Lista, con filtros y paginación, los registros de perfiles de anonimización para ensayos (`anonymizationProfiles`).
- **Para qué sirve:** RF-MIG-096: Prohibir cargar snapshots no anonimizados en ambientes distintos de producción y del tenant de ensayo de la propia cooperativa. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `mig.anonimizacion.ejecutar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de perfiles de anonimización para ensayos (`anonymizationProfiles`) con `total`.
- **Pantallas:** PAN-MIG-22 (Perfiles de anonimización).
- **Ola:** O1 · **Fuente:** T07 §11. API, línea 1000 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-37)

<a id="API-MIG-37-b"></a>
#### API-MIG-37-b · `POST /api/platform/migration/anonymization-profiles`

- **Qué hace:** Perfiles y ejecución. Da de alta un registro de perfiles de anonimización para ensayos (`anonymizationProfiles`).
- **Para qué sirve:** RF-MIG-096: Prohibir cargar snapshots no anonimizados en ambientes distintos de producción y del tenant de ensayo de la propia cooperativa. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `mig.anonimizacion.ejecutar`.
- **Recibe:** los datos de perfiles de anonimización para ensayos (`anonymizationProfiles`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de perfiles de anonimización para ensayos (`anonymizationProfiles`).
- **Pantallas:** PAN-MIG-22 (Perfiles de anonimización).
- **Ola:** O1 · **Fuente:** T07 §11. API, línea 1000 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-37-b)

<a id="API-MIG-38"></a>
#### API-MIG-38 · `GET /api/admin/migration/legacy-id-map`

- **Qué hace:** Consultar mapa de IDs (?table=&key= o ?collection=&id=) Lista, con filtros y paginación, los registros de mapa clave ProCoop → ObjectId (`legacyIdMap`).
- **Para qué sirve:** RF-MIG-042: Guardar en cada documento destino legacy: { system: 'procoop', table, key, runId, hash }. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `mig.proyectos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de mapa clave ProCoop → ObjectId (`legacyIdMap`) con `total`.
- **Pantallas:** PAN-MIG-01 (Listado de proyectos por cooperativa), PAN-MIG-02 (Tablero del proyecto), PAN-MIG-04 (Inventario de 659 tablas) y 1 más.
- **Ola:** O0 · **Fuente:** T07 §11. API, línea 1001 · [Ver en Swagger](../18-swagger/index.html?api=t07-mig#/API/API-MIG-38)
