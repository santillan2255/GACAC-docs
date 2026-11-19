# Catálogo de endpoints · M02 · Catálogo de servicios, productos, planes, categorías, estados, contrato de servicio, habilitación por tenant, copia entre tenants y particularidades por servicio

Parte del [catálogo de endpoints](../18-catalogo-endpoints.md) (artefacto 7.1). Generado el 05-11-2026 con `_trabajo/gen_18_catalogo_endpoints.py` a partir de `18-openapi/`; no se edita a mano.

## Para qué sirve esta API

Definir, sin necesidad de programar, qué servicios puede prestar cada cooperativa (tenant), con qué productos, planes, categorías, conceptos facturables, requisitos, estados y reglas propias, y administrar el contrato de servicio (suscripción) que vincula a un titular identificado por DNI/CUIT con una prestación concreta, desde que se solicita hasta su baja, conservando la historia completa. El módulo resuelve cuatro necesidades del solicitante:

1. Catálogo de capacidades de plataforma y habilitación por tenant (BASE §66, CAT-001..003): cada cooperativa enciende un conjunto distinto de servicios (Agua, Electricidad, Cementerio parque en una; Electricidad y Gas en otra), y esa selección determina qué ve su comunidad en landing, PWA y administración.
2. Configuración independiente por servicio y tenant, y copia entre tenants (BASE §81, COP-001..003): cada servicio tiene un perfil de configuración propio (BASE §84) y puede copiarse como base a otra cooperativa sin copiar datos operativos.
3. Composición económica estructural (BASE §72, PRO-001..004): servicio → producto/subservicio → plan/oferta (versionada) → conceptos facturables y reglas → condiciones congeladas del contrato. Los importes y el motor de cálculo pertenecen a M04 TAR; este módulo define la estructura y el vínculo al cuadro tarifario.
4. Particularidades por dominio (BASE §84–95, DEC-007): fichas para Internet (piloto, DEC-005), Telefonía, TV/cable, Energía, Agua, Cloacas, Gas, Alumbrado público, Pavimento/obras, Sepelio, Cementerio parque, Banco de sangre, Ambulancias/salud, Vivienda, Tasas por cuenta de terceros, Capital social como concepto y otras prestaciones (banco ortopédico, traslados, seguro, vehículo eléctrico…

Detalle completo en el anexo M02, sección 1. Contrato navegable: [Swagger](../18-swagger/index.html?api=m02-cat).

| Dato | Valor |
|---|---|
| Endpoints | 87 |
| Por método | GET 31, PATCH 16, POST 40 |
| Grupos funcionales | 1 |
| Con requisito citado en el anexo | 6 |
| Con requisito inferido (a confirmar) | 80 |
| Sin requisito identificable | 1 |

## Grupos funcionales

| Grupo | Endpoints | Qué agrupa (primeros endpoints) |
|---|---|---|
| [API](#grupo-1) | 87 | Listar capacidades.; Crear capacidad.; Editar ficha/esquema (nueva versión de esquema).… |

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

87 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-CAT-01](#API-CAT-01) | GET | `/api/platform/cat/capabilities` | Listar capacidades. |
| [API-CAT-02](#API-CAT-02) | POST | `/api/platform/cat/capabilities` | Crear capacidad. |
| [API-CAT-03](#API-CAT-03) | PATCH | `/api/platform/cat/capabilities/{id}` | Editar ficha/esquema (nueva versión de esquema). |
| [API-CAT-04](#API-CAT-04) | GET | `/api/platform/cat/enablement` | Matriz tenants × capacidades. |
| [API-CAT-05](#API-CAT-05) | POST | `/api/platform/cat/tenants/{tenantId}/capabilities/{capabilityId}/enable` | Habilitar (valida licencia). |
| [API-CAT-06](#API-CAT-06) | POST | `/api/platform/cat/tenants/{tenantId}/capabilities/{capabilityId}/disable` | Deshabilitar (valida RN-CAT-003). |
| [API-CAT-07](#API-CAT-07) | GET | `/api/admin/cat/services` | Servicios del tenant. |
| [API-CAT-09](#API-CAT-09) | POST | `/api/admin/cat/services` | Crear servicio (desde cero o plantilla). |
| [API-CAT-08](#API-CAT-08) | GET | `/api/admin/cat/services/{id}` | Detalle con perfil vigente y borrador. |
| [API-CAT-10](#API-CAT-10) | POST | `/api/admin/cat/services/{id}/versions` | Crear versión borrador. |
| [API-CAT-11](#API-CAT-11) | PATCH | `/api/admin/cat/services/{id}/versions/{versionId}` | Editar borrador (perfil y componentes). |
| [API-CAT-12](#API-CAT-12) | POST | `/api/admin/cat/services/{id}/versions/{versionId}/validate` | Ejecutar validaciones. |
| [API-CAT-13](#API-CAT-13) | POST | `/api/admin/cat/services/{id}/versions/{versionId}/simulate` | Simular primera factura (TAR/FAC). |
| [API-CAT-14](#API-CAT-14) | POST | `/api/admin/cat/services/{id}/versions/{versionId}/submit` | Enviar a revisión. |
| [API-CAT-15](#API-CAT-15) | POST | `/api/admin/cat/services/{id}/versions/{versionId}/approve` | Aprobar/rechazar. |
| [API-CAT-16](#API-CAT-16) | POST | `/api/admin/cat/services/{id}/versions/{versionId}/publish` | Publicar o programar. |
| [API-CAT-17](#API-CAT-17) | POST | `/api/admin/cat/services/{id}/offer` | Abrir/cerrar oferta, retirar con alcance. |
| [API-CAT-18](#API-CAT-18) | GET | `/api/admin/cat/products` | Productos y subservicios. |
| [API-CAT-18-b](#API-CAT-18-b) | POST | `/api/admin/cat/products` | Productos y subservicios. |
| [API-CAT-18-c](#API-CAT-18-c) | PATCH | `/api/admin/cat/products` | Productos y subservicios. |
| [API-CAT-19](#API-CAT-19) | GET | `/api/admin/cat/concepts` | Conceptos facturables. |
| [API-CAT-19-b](#API-CAT-19-b) | POST | `/api/admin/cat/concepts` | Conceptos facturables. |
| [API-CAT-19-c](#API-CAT-19-c) | PATCH | `/api/admin/cat/concepts` | Conceptos facturables. |
| [API-CAT-20](#API-CAT-20) | GET | `/api/admin/cat/plans` | Planes. |
| [API-CAT-20-b](#API-CAT-20-b) | POST | `/api/admin/cat/plans` | Planes. |
| [API-CAT-20-c](#API-CAT-20-c) | PATCH | `/api/admin/cat/plans` | Planes. |
| [API-CAT-21](#API-CAT-21) | POST | `/api/admin/cat/plans/{id}/versions` | Nueva versión de plan. |
| [API-CAT-22](#API-CAT-22) | POST | `/api/admin/cat/plans/{id}/discontinue` | Discontinuar plan. |
| [API-CAT-23](#API-CAT-23) | GET | `/api/admin/cat/bundles` | Paquetes. |
| [API-CAT-23-b](#API-CAT-23-b) | POST | `/api/admin/cat/bundles` | Paquetes. |
| [API-CAT-23-c](#API-CAT-23-c) | PATCH | `/api/admin/cat/bundles` | Paquetes. |
| [API-CAT-24](#API-CAT-24) | GET | `/api/admin/cat/categories` | Categorías y grupos. |
| [API-CAT-24-b](#API-CAT-24-b) | POST | `/api/admin/cat/categories` | Categorías y grupos. |
| [API-CAT-24-c](#API-CAT-24-c) | PATCH | `/api/admin/cat/categories` | Categorías y grupos. |
| [API-CAT-25](#API-CAT-25) | GET | `/api/admin/cat/classes` | Clases de servicio. |
| [API-CAT-25-b](#API-CAT-25-b) | POST | `/api/admin/cat/classes` | Clases de servicio. |
| [API-CAT-25-c](#API-CAT-25-c) | PATCH | `/api/admin/cat/classes` | Clases de servicio. |
| [API-CAT-26](#API-CAT-26) | GET | `/api/admin/cat/properties` | Propiedades. |
| [API-CAT-26-b](#API-CAT-26-b) | POST | `/api/admin/cat/properties` | Propiedades. |
| [API-CAT-26-c](#API-CAT-26-c) | PATCH | `/api/admin/cat/properties` | Propiedades. |
| [API-CAT-27](#API-CAT-27) | GET | `/api/admin/cat/statuses` | Estados operativos. |
| [API-CAT-27-b](#API-CAT-27-b) | POST | `/api/admin/cat/statuses` | Estados operativos. |
| [API-CAT-27-c](#API-CAT-27-c) | PATCH | `/api/admin/cat/statuses` | Estados operativos. |
| [API-CAT-28](#API-CAT-28) | GET | `/api/admin/cat/event-charges` | Conceptos por evento y bonificaciones. |
| [API-CAT-28-b](#API-CAT-28-b) | POST | `/api/admin/cat/event-charges` | Conceptos por evento y bonificaciones. |
| [API-CAT-28-c](#API-CAT-28-c) | PATCH | `/api/admin/cat/event-charges` | Conceptos por evento y bonificaciones. |
| [API-CAT-29](#API-CAT-29) | GET | `/api/admin/cat/auto-rules` | Reglas automáticas. |
| [API-CAT-29-b](#API-CAT-29-b) | POST | `/api/admin/cat/auto-rules` | Reglas automáticas. |
| [API-CAT-29-c](#API-CAT-29-c) | PATCH | `/api/admin/cat/auto-rules` | Reglas automáticas. |
| [API-CAT-30](#API-CAT-30) | POST | `/api/admin/cat/auto-rules/{id}/simulate` | Simular regla. |
| [API-CAT-31](#API-CAT-31) | GET | `/api/admin/cat/contracts` | Buscar contratos (paginado). |
| [API-CAT-33](#API-CAT-33) | POST | `/api/admin/cat/contracts` | Crear contrato (requested); devuelve todos los errores/advertencias. |
| [API-CAT-32](#API-CAT-32) | GET | `/api/admin/cat/contracts/{id}` | Ficha; ?asOf=&dateKind=effective/recorded. |
| [API-CAT-34](#API-CAT-34) | PATCH | `/api/admin/cat/contracts/{id}` | Editar atributos no de estado (observaciones, referencias, atributos de dominio). |
| [API-CAT-35](#API-CAT-35) | POST | `/api/admin/cat/contracts/{id}/commands/{command}` | Ejecutar transición/cambio (approve, requestFeasibility, activate, suspend, requestReactivation, reactivate, requestTermination, withdraw... |
| [API-CAT-36](#API-CAT-36) | GET | `/api/admin/cat/contracts/{id}/history` | Historia. |
| [API-CAT-37](#API-CAT-37) | GET | `/api/admin/cat/contracts/{id}/equipment` | Equipos del contrato; asignar. |
| [API-CAT-37-b](#API-CAT-37-b) | POST | `/api/admin/cat/contracts/{id}/equipment` | Equipos del contrato; asignar. |
| [API-CAT-38](#API-CAT-38) | POST | `/api/admin/cat/equipment-assignments/{id}/return` | Registrar devolución/pérdida/reemplazo. |
| [API-CAT-39](#API-CAT-39) | GET | `/api/admin/cat/equipment-assignments` | Bandeja de devoluciones. |
| [API-CAT-41](#API-CAT-41) | GET | `/api/admin/cat/contracts/{id}/appliances` | DDJJ de artefactos por servicio según la plantilla PRM-CAT-110 (GAS y ELE; HUE-GAS-01); GET .../appliances/template devuelve la plantilla... |
| [API-CAT-41-b](#API-CAT-41-b) | POST | `/api/admin/cat/contracts/{id}/appliances` | DDJJ de artefactos por servicio según la plantilla PRM-CAT-110 (GAS y ELE; HUE-GAS-01); GET .../appliances/template devuelve la plantilla... |
| [API-CAT-41-c](#API-CAT-41-c) | PATCH | `/api/admin/cat/contracts/{id}/appliances` | DDJJ de artefactos por servicio según la plantilla PRM-CAT-110 (GAS y ELE; HUE-GAS-01); GET .../appliances/template devuelve la plantilla... |
| [API-CAT-42](#API-CAT-42) | GET | `/api/admin/cat/contracts/{id}/generation-agreement` | Vínculo de generación distribuida. |
| [API-CAT-42-b](#API-CAT-42-b) | POST | `/api/admin/cat/contracts/{id}/generation-agreement` | Vínculo de generación distribuida. |
| [API-CAT-42-c](#API-CAT-42-c) | PATCH | `/api/admin/cat/contracts/{id}/generation-agreement` | Vínculo de generación distribuida. |
| [API-CAT-43](#API-CAT-43) | GET | `/api/admin/cat/contracts/{id}/special-conditions` | Condiciones de grandes usuarios. |
| [API-CAT-43-b](#API-CAT-43-b) | POST | `/api/admin/cat/contracts/{id}/special-conditions` | Condiciones de grandes usuarios. |
| [API-CAT-44](#API-CAT-44) | POST | `/api/admin/cat/bulk-operations` | Crear trámite masivo. |
| [API-CAT-45](#API-CAT-45) | POST | `/api/admin/cat/bulk-operations/{id}/simulate` | Ciclo del trámite. |
| [API-CAT-45-b](#API-CAT-45-b) | POST | `/api/admin/cat/bulk-operations/{id}/approve` | Ciclo del trámite. |
| [API-CAT-45-c](#API-CAT-45-c) | POST | `/api/admin/cat/bulk-operations/{id}/run` | Ciclo del trámite. |
| [API-CAT-45-d](#API-CAT-45-d) | POST | `/api/admin/cat/bulk-operations/{id}/revert` | Ciclo del trámite. |
| [API-CAT-46](#API-CAT-46) | POST | `/api/admin/cat/copies` | Solicitar copia entre tenants. |
| [API-CAT-47](#API-CAT-47) | POST | `/api/admin/cat/copies/{id}/authorize-source` | Autorización del tenant origen. |
| [API-CAT-48](#API-CAT-48) | GET | `/api/admin/cat/copies/{id}` | Estado y pendientes. |
| [API-CAT-49](#API-CAT-49) | GET | `/api/cat/offers` | Oferta para la PWA (la consume el componente embebido en PAN-POR-31; HUE-SRV-04). |
| [API-CAT-50](#API-CAT-50) | GET | `/api/cat/my-contracts` | Contratos propios/representados (componente embebido en PAN-POR-29/30; HUE-SRV-04). |
| [API-CAT-51](#API-CAT-51) | GET | `/api/public/{tenantSlug}/cat/offers` | Oferta pública de la landing (componente embebido en PAN-POR-02/03; HUE-SRV-04). |
| [API-CAT-52](#API-CAT-52) | GET | `/api/admin/cat/dashboard` | Indicadores. |
| [API-CAT-53](#API-CAT-53) | GET | `/api/admin/cat/concessions` | Concesiones y fuentes normativas. |
| [API-CAT-53-b](#API-CAT-53-b) | POST | `/api/admin/cat/concessions` | Concesiones y fuentes normativas. |
| [API-CAT-53-c](#API-CAT-53-c) | PATCH | `/api/admin/cat/concessions` | Concesiones y fuentes normativas. |
| [API-CAT-54](#API-CAT-54) | GET | `/api/v1/ext/cat/contracts` | Contratos para APIs de terceros/BI (sin datos sensibles ni secretos). |
| [API-CAT-55](#API-CAT-55) | GET | `/api/platform/cat/templates` | Plantillas de servicio de plataforma (Adoptado DEC-026, PA-CAT-08). |
| [API-CAT-55-b](#API-CAT-55-b) | POST | `/api/platform/cat/templates` | Plantillas de servicio de plataforma (Adoptado DEC-026, PA-CAT-08). |
| [API-CAT-56](#API-CAT-56) | GET | `/api/admin/cat/reports/active-subscribers-by-package` | Abonados activos por paquete a la fecha de corte (RF-CAT-116, REP-CAT-16): {serviceId, cutoffDate, items[{serviceProductId, code, tvMinim... |

<a id="API-CAT-01"></a>
#### API-CAT-01 · `GET /api/platform/cat/capabilities`

- **Qué hace:** Listar capacidades. Lista, con filtros y paginación, los registros de capacidades de servicio de plataforma (`serviceCapabilities`).
- **Para qué sirve:** RF-CAT-104: Cada servicio de cada tenant tiene configuración propia e independiente sobre la misma capacidad de plataforma. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `cat.capacidades.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de capacidades de servicio de plataforma (`serviceCapabilities`) con `total`.
- **Pantallas:** PAN-CAT-01 (Catálogo global de capacidades).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1460 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-01)

<a id="API-CAT-02"></a>
#### API-CAT-02 · `POST /api/platform/cat/capabilities`

- **Qué hace:** Crear capacidad. Da de alta un registro de capacidades de servicio de plataforma (`serviceCapabilities`).
- **Para qué sirve:** RF-CAT-104: Cada servicio de cada tenant tiene configuración propia e independiente sobre la misma capacidad de plataforma. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `cat.capacidades.crear`.
- **Recibe:** los datos de capacidades de servicio de plataforma (`serviceCapabilities`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de capacidades de servicio de plataforma (`serviceCapabilities`).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1461 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-02)

<a id="API-CAT-03"></a>
#### API-CAT-03 · `PATCH /api/platform/cat/capabilities/{id}`

- **Qué hace:** Editar ficha/esquema (nueva versión de esquema). Modifica algunos campos de un registro de capacidades de servicio de plataforma (`serviceCapabilities`) (solo los enviados).
- **Para qué sirve:** RF-CAT-104: Cada servicio de cada tenant tiene configuración propia e independiente sobre la misma capacidad de plataforma. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `cat.capacidades.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de capacidades de servicio de plataforma (`serviceCapabilities`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de capacidades de servicio de plataforma (`serviceCapabilities`).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1462 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-03)

<a id="API-CAT-04"></a>
#### API-CAT-04 · `GET /api/platform/cat/enablement`

- **Qué hace:** Matriz tenants × capacidades. Consulta `enablement`.
- **Para qué sirve:** RF-CAT-002: Habilitar y deshabilitar capacidades por tenant con fecha desde/hasta, solo si el tenant tiene la licencia correspondiente (T01). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `cat.habilitacion.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CAT-02 (Habilitación de capacidades por tenant).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1463 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-04)

<a id="API-CAT-05"></a>
#### API-CAT-05 · `POST /api/platform/cat/tenants/{tenantId}/capabilities/{capabilityId}/enable`

- **Qué hace:** Habilitar (valida licencia). Habilita un registro de capacidades de servicio de plataforma (`serviceCapabilities`).
- **Para qué sirve:** RF-CAT-002: Habilitar y deshabilitar capacidades por tenant con fecha desde/hasta, solo si el tenant tiene la licencia correspondiente (T01). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `cat.habilitacion.configurar`.
- **Recibe:** en la ruta `tenantId`, `capabilityId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1464 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-05)

<a id="API-CAT-06"></a>
#### API-CAT-06 · `POST /api/platform/cat/tenants/{tenantId}/capabilities/{capabilityId}/disable`

- **Qué hace:** Deshabilitar (valida RN-CAT-003). Deshabilita un registro de capacidades de servicio de plataforma (`serviceCapabilities`).
- **Para qué sirve:** RF-CAT-002: Habilitar y deshabilitar capacidades por tenant con fecha desde/hasta, solo si el tenant tiene la licencia correspondiente (T01). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `cat.habilitacion.configurar`.
- **Recibe:** en la ruta `tenantId`, `capabilityId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1465 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-06)

<a id="API-CAT-07"></a>
#### API-CAT-07 · `GET /api/admin/cat/services`

- **Qué hace:** Servicios del tenant. Lista, con filtros y paginación, los registros de servicio habilitado por el tenant y su perfil (`tenantServices`).
- **Para qué sirve:** RF-CAT-102: Vehículo eléctrico como perfil de registración (datos del vehículo, carga habilitable desde el portal). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.servicios.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de servicio habilitado por el tenant y su perfil (`tenantServices`) con `total`.
- **Pantallas:** PAN-CAT-03 (Servicios del tenant), PAN-CAT-24 (Tablero de servicios).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1466 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-07)

<a id="API-CAT-09"></a>
#### API-CAT-09 · `POST /api/admin/cat/services`

- **Qué hace:** Crear servicio (desde cero o plantilla). Da de alta un registro de servicio habilitado por el tenant y su perfil (`tenantServices`).
- **Para qué sirve:** RF-CAT-102: Vehículo eléctrico como perfil de registración (datos del vehículo, carga habilitable desde el portal). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.servicios.configurar`.
- **Recibe:** los datos de servicio habilitado por el tenant y su perfil (`tenantServices`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de servicio habilitado por el tenant y su perfil (`tenantServices`).
- **Pantallas:** PAN-CAT-04 (Ficha de configuración del servicio en pestañas), PAN-CAT-26 (Concesiones y fuentes normativas por servicio).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1468 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-09)

<a id="API-CAT-08"></a>
#### API-CAT-08 · `GET /api/admin/cat/services/{id}`

- **Qué hace:** Detalle con perfil vigente y borrador. Obtiene el detalle de un registro de servicio habilitado por el tenant y su perfil (`tenantServices`).
- **Para qué sirve:** RF-CAT-052: Mostrar al socio el detalle de su precio vigente y la fecha de finalización de beneficios temporales. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.servicios.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de servicio habilitado por el tenant y su perfil (`tenantServices`).
- **Pantallas:** PAN-CAT-03 (Servicios del tenant), PAN-CAT-24 (Tablero de servicios).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1467 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-08)

<a id="API-CAT-10"></a>
#### API-CAT-10 · `POST /api/admin/cat/services/{id}/versions`

- **Qué hace:** Crear versión borrador. Da de alta un registro de versiones de plan (`servicePlanVersions`).
- **Para qué sirve:** RF-CAT-106: Crear en destino una configuración nueva o una nueva versión borrador de una existente, sin sobrescribir en silencio; revisar diferencias, simular y completar pendientes antes de habilitar y publicar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.versiones.crear`.
- **Recibe:** en la ruta `id`; los datos de versiones de plan (`servicePlanVersions`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de versiones de plan (`servicePlanVersions`).
- **Pantallas:** PAN-CAT-05 (Versiones del servicio).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1469 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-10)

<a id="API-CAT-11"></a>
#### API-CAT-11 · `PATCH /api/admin/cat/services/{id}/versions/{versionId}`

- **Qué hace:** Editar borrador (perfil y componentes). Modifica algunos campos de un registro de versiones de plan (`servicePlanVersions`) (solo los enviados).
- **Para qué sirve:** RF-CAT-106: Crear en destino una configuración nueva o una nueva versión borrador de una existente, sin sobrescribir en silencio; revisar diferencias, simular y completar pendientes antes de habilitar y publicar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.versiones.crear`.
- **Recibe:** en la ruta `id`, `versionId`; solo los campos a cambiar de versiones de plan (`servicePlanVersions`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de versiones de plan (`servicePlanVersions`).
- **Pantallas:** PAN-CAT-05 (Versiones del servicio).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1470 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-11)

<a id="API-CAT-12"></a>
#### API-CAT-12 · `POST /api/admin/cat/services/{id}/versions/{versionId}/validate`

- **Qué hace:** Ejecutar validaciones. Valida un registro de versiones de plan (`servicePlanVersions`).
- **Para qué sirve:** RF-CAT-073: Ejecutar las validaciones de alta configuradas (sección 6, RN-CAT-020..031) devolviendo todos los errores y advertencias juntos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.versiones.crear`.
- **Recibe:** en la ruta `id`, `versionId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CAT-05 (Versiones del servicio).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1471 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-12)

<a id="API-CAT-13"></a>
#### API-CAT-13 · `POST /api/admin/cat/services/{id}/versions/{versionId}/simulate`

- **Qué hace:** Simular primera factura (TAR/FAC). Simula sin efectos un registro de versiones de plan (`servicePlanVersions`).
- **Para qué sirve:** RF-CAT-106: Crear en destino una configuración nueva o una nueva versión borrador de una existente, sin sobrescribir en silencio; revisar diferencias, simular y completar pendientes antes de habilitar y publicar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.versiones.crear`.
- **Recibe:** en la ruta `id`, `versionId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CAT-05 (Versiones del servicio).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1472 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-13)

<a id="API-CAT-14"></a>
#### API-CAT-14 · `POST /api/admin/cat/services/{id}/versions/{versionId}/submit`

- **Qué hace:** Enviar a revisión. Envía a revisión o presenta un registro de versiones de plan (`servicePlanVersions`).
- **Para qué sirve:** RF-CAT-031: Agrupar los cambios de un servicio en una versión de configuración con dependencias, validaciones, simulación, revisión, aprobación y fecha efectiva. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.versiones.crear`.
- **Recibe:** en la ruta `id`, `versionId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CAT-05 (Versiones del servicio).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1473 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-14)

<a id="API-CAT-15"></a>
#### API-CAT-15 · `POST /api/admin/cat/services/{id}/versions/{versionId}/approve`

- **Qué hace:** Aprobar/rechazar. Aprueba un registro de versiones de plan (`servicePlanVersions`).
- **Para qué sirve:** RF-CAT-035: Exigir aprobación de un segundo usuario para publicar versiones con cambios comerciales o fiscales en producción (configurable). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.versiones.aprobar`.
- **Recibe:** en la ruta `id`, `versionId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CAT-05 (Versiones del servicio).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1474 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-15)

<a id="API-CAT-16"></a>
#### API-CAT-16 · `POST /api/admin/cat/services/{id}/versions/{versionId}/publish`

- **Qué hace:** Publicar o programar. Publica un registro de versiones de plan (`servicePlanVersions`).
- **Para qué sirve:** RF-CAT-035: Exigir aprobación de un segundo usuario para publicar versiones con cambios comerciales o fiscales en producción (configurable). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.servicios.publicar`.
- **Recibe:** en la ruta `id`, `versionId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1475 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-16)

<a id="API-CAT-17"></a>
#### API-CAT-17 · `POST /api/admin/cat/services/{id}/offer`

- **Qué hace:** Abrir/cerrar oferta, retirar con alcance. Ofrece un registro de servicio habilitado por el tenant y su perfil (`tenantServices`).
- **Para qué sirve:** RF-CAT-005: Al retirar una oferta, exigir que el administrador declare el alcance (solo nuevas contrataciones / cierre total con plan de salida) y no borrar contratos, documentos, deuda ni casos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.servicios.publicar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1476 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-17)

<a id="API-CAT-18"></a>
#### API-CAT-18 · `GET /api/admin/cat/products`

- **Qué hace:** Productos y subservicios. Lista, con filtros y paginación, los registros de productos y subservicios (`serviceProducts`).
- **Para qué sirve:** RF-CAT-036: Definir productos y subservicios dentro de cada servicio del tenant. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.productos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de productos y subservicios (`serviceProducts`) con `total`.
- **Pantallas:** PAN-CAT-06 (Productos/subservicios y conceptos facturables por servicio).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1477 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-18)

<a id="API-CAT-18-b"></a>
#### API-CAT-18-b · `POST /api/admin/cat/products`

- **Qué hace:** Productos y subservicios. Da de alta un registro de productos y subservicios (`serviceProducts`).
- **Para qué sirve:** RF-CAT-036: Definir productos y subservicios dentro de cada servicio del tenant. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.productos.editar`.
- **Recibe:** los datos de productos y subservicios (`serviceProducts`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de productos y subservicios (`serviceProducts`).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1477 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-18-b)

<a id="API-CAT-18-c"></a>
#### API-CAT-18-c · `PATCH /api/admin/cat/products`

- **Qué hace:** Productos y subservicios. Modifica algunos campos de un registro de productos y subservicios (`serviceProducts`) (solo los enviados).
- **Para qué sirve:** RF-CAT-036: Definir productos y subservicios dentro de cada servicio del tenant. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.productos.editar`.
- **Recibe:** solo los campos a cambiar de productos y subservicios (`serviceProducts`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de productos y subservicios (`serviceProducts`).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1477 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-18-c)

<a id="API-CAT-19"></a>
#### API-CAT-19 · `GET /api/admin/cat/concepts`

- **Qué hace:** Conceptos facturables. Lista, con filtros y paginación, los registros de conceptos facturables (`billableConcepts`).
- **Para qué sirve:** RF-CAT-040: Distinguir costo interno de prestación y precio al socio; un costo interno no se factura sin concepto habilitado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.conceptos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de conceptos facturables (`billableConcepts`) con `total`.
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1478 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-19)

<a id="API-CAT-19-b"></a>
#### API-CAT-19-b · `POST /api/admin/cat/concepts`

- **Qué hace:** Conceptos facturables. Da de alta un registro de conceptos facturables (`billableConcepts`).
- **Para qué sirve:** RF-CAT-040: Distinguir costo interno de prestación y precio al socio; un costo interno no se factura sin concepto habilitado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.conceptos.editar`.
- **Recibe:** los datos de conceptos facturables (`billableConcepts`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de conceptos facturables (`billableConcepts`).
- **Pantallas:** PAN-CAT-12 (Conceptos por evento y bonificaciones de conexión).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1478 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-19-b)

<a id="API-CAT-19-c"></a>
#### API-CAT-19-c · `PATCH /api/admin/cat/concepts`

- **Qué hace:** Conceptos facturables. Modifica algunos campos de un registro de conceptos facturables (`billableConcepts`) (solo los enviados).
- **Para qué sirve:** RF-CAT-040: Distinguir costo interno de prestación y precio al socio; un costo interno no se factura sin concepto habilitado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.conceptos.editar`.
- **Recibe:** solo los campos a cambiar de conceptos facturables (`billableConcepts`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de conceptos facturables (`billableConcepts`).
- **Pantallas:** PAN-CAT-12 (Conceptos por evento y bonificaciones de conexión).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1478 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-19-c)

<a id="API-CAT-20"></a>
#### API-CAT-20 · `GET /api/admin/cat/plans`

- **Qué hace:** Planes. Lista, con filtros y paginación, los registros de planes comerciales (`servicePlans`).
- **Para qué sirve:** RF-CAT-041: Registrar planes comerciales con atributos del dominio (tecnología, velocidad bajada/subida, unidad, periodicidad, modalidad medida/no medida, requisitos, componentes incluidos, opciones, equipamiento requerido, necesidad de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.planes.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de planes comerciales (`servicePlans`) con `total`.
- **Pantallas:** PAN-CAT-07 (Planes y versiones).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1479 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-20)

<a id="API-CAT-20-b"></a>
#### API-CAT-20-b · `POST /api/admin/cat/plans`

- **Qué hace:** Planes. Da de alta un registro de planes comerciales (`servicePlans`).
- **Para qué sirve:** RF-CAT-041: Registrar planes comerciales con atributos del dominio (tecnología, velocidad bajada/subida, unidad, periodicidad, modalidad medida/no medida, requisitos, componentes incluidos, opciones, equipamiento requerido, necesidad de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.planes.editar`.
- **Recibe:** los datos de planes comerciales (`servicePlans`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de planes comerciales (`servicePlans`).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1479 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-20-b)

<a id="API-CAT-20-c"></a>
#### API-CAT-20-c · `PATCH /api/admin/cat/plans`

- **Qué hace:** Planes. Modifica algunos campos de un registro de planes comerciales (`servicePlans`) (solo los enviados).
- **Para qué sirve:** RF-CAT-041: Registrar planes comerciales con atributos del dominio (tecnología, velocidad bajada/subida, unidad, periodicidad, modalidad medida/no medida, requisitos, componentes incluidos, opciones, equipamiento requerido, necesidad de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.planes.editar`.
- **Recibe:** solo los campos a cambiar de planes comerciales (`servicePlans`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de planes comerciales (`servicePlans`).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1479 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-20-c)

<a id="API-CAT-21"></a>
#### API-CAT-21 · `POST /api/admin/cat/plans/{id}/versions`

- **Qué hace:** Nueva versión de plan. Da de alta un registro de versiones de plan (`servicePlanVersions`).
- **Para qué sirve:** RF-CAT-106: Crear en destino una configuración nueva o una nueva versión borrador de una existente, sin sobrescribir en silencio; revisar diferencias, simular y completar pendientes antes de habilitar y publicar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.planes.editar`.
- **Recibe:** en la ruta `id`; los datos de versiones de plan (`servicePlanVersions`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de versiones de plan (`servicePlanVersions`).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1480 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-21)

<a id="API-CAT-22"></a>
#### API-CAT-22 · `POST /api/admin/cat/plans/{id}/discontinue`

- **Qué hace:** Discontinuar plan. Discontinúa un registro de planes comerciales (`servicePlans`).
- **Para qué sirve:** RF-CAT-113: Proveer indicadores del catálogo: contratos por servicio/estado/plan/categoría, altas pendientes, suspensiones, bajas, equipos pendientes de devolución, contratos no facturables, planes discontinuados con contratos vigentes. · RF-CAT-042: Mantener versiones históricas de cada plan; un plan discontinuado no se ofrece a nuevos clientes pero conserva sus condiciones en los contratos anteriores; un cambio comercial puede aplicarse solo a nuevas contrataciones. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.planes.discontinuar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1481 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-22)

<a id="API-CAT-23"></a>
#### API-CAT-23 · `GET /api/admin/cat/bundles`

- **Qué hace:** Paquetes. Lista, con filtros y paginación, los registros de paquetes multiservicio (`serviceBundles`).
- **Para qué sirve:** RF-CAT-044: Administrar paquetes de prestaciones (planes de varios servicios) con componentes y condiciones; la contratación de un paquete crea un contrato por servicio vinculados por bundleSubscriptionId. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.paquetes.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de paquetes multiservicio (`serviceBundles`) con `total`.
- **Pantallas:** PAN-CAT-27 (Paquetes de prestaciones).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1482 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-23)

<a id="API-CAT-23-b"></a>
#### API-CAT-23-b · `POST /api/admin/cat/bundles`

- **Qué hace:** Paquetes. Da de alta un registro de paquetes multiservicio (`serviceBundles`).
- **Para qué sirve:** RF-CAT-044: Administrar paquetes de prestaciones (planes de varios servicios) con componentes y condiciones; la contratación de un paquete crea un contrato por servicio vinculados por bundleSubscriptionId. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.paquetes.editar`.
- **Recibe:** los datos de paquetes multiservicio (`serviceBundles`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de paquetes multiservicio (`serviceBundles`).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1482 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-23-b)

<a id="API-CAT-23-c"></a>
#### API-CAT-23-c · `PATCH /api/admin/cat/bundles`

- **Qué hace:** Paquetes. Modifica algunos campos de un registro de paquetes multiservicio (`serviceBundles`) (solo los enviados).
- **Para qué sirve:** RF-CAT-044: Administrar paquetes de prestaciones (planes de varios servicios) con componentes y condiciones; la contratación de un paquete crea un contrato por servicio vinculados por bundleSubscriptionId. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.paquetes.editar`.
- **Recibe:** solo los campos a cambiar de paquetes multiservicio (`serviceBundles`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de paquetes multiservicio (`serviceBundles`).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1482 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-23-c)

<a id="API-CAT-24"></a>
#### API-CAT-24 · `GET /api/admin/cat/categories`

- **Qué hace:** Categorías y grupos. Lista, con filtros y paginación, los registros de categorías estructurales (`serviceCategories`).
- **Para qué sirve:** RF-CAT-056: Mantener grupos de categorías con código regulatorio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.categorias.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de categorías estructurales (`serviceCategories`) con `total`.
- **Pantallas:** PAN-CAT-08 (Categorías y grupos por servicio).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1483 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-24)

<a id="API-CAT-24-b"></a>
#### API-CAT-24-b · `POST /api/admin/cat/categories`

- **Qué hace:** Categorías y grupos. Da de alta un registro de categorías estructurales (`serviceCategories`).
- **Para qué sirve:** RF-CAT-056: Mantener grupos de categorías con código regulatorio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.categorias.editar`.
- **Recibe:** los datos de categorías estructurales (`serviceCategories`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de categorías estructurales (`serviceCategories`).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1483 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-24-b)

<a id="API-CAT-24-c"></a>
#### API-CAT-24-c · `PATCH /api/admin/cat/categories`

- **Qué hace:** Categorías y grupos. Modifica algunos campos de un registro de categorías estructurales (`serviceCategories`) (solo los enviados).
- **Para qué sirve:** RF-CAT-056: Mantener grupos de categorías con código regulatorio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.categorias.editar`.
- **Recibe:** solo los campos a cambiar de categorías estructurales (`serviceCategories`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de categorías estructurales (`serviceCategories`).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1483 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-24-c)

<a id="API-CAT-25"></a>
#### API-CAT-25 · `GET /api/admin/cat/classes`

- **Qué hace:** Clases de servicio. Lista, con filtros y paginación, los registros de clases de servicio (`serviceClasses`).
- **Para qué sirve:** RF-CAT-053: Mantener clases de servicio con valores asociados (ej. tasa hospital, tipo de suministro). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.clases.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de clases de servicio (`serviceClasses`) con `total`.
- **Pantallas:** PAN-CAT-09 (Clases de servicio y propiedades del servicio y personalizadas).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1484 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-25)

<a id="API-CAT-25-b"></a>
#### API-CAT-25-b · `POST /api/admin/cat/classes`

- **Qué hace:** Clases de servicio. Da de alta un registro de clases de servicio (`serviceClasses`).
- **Para qué sirve:** RF-CAT-053: Mantener clases de servicio con valores asociados (ej. tasa hospital, tipo de suministro). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.clases.editar`.
- **Recibe:** los datos de clases de servicio (`serviceClasses`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de clases de servicio (`serviceClasses`).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1484 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-25-b)

<a id="API-CAT-25-c"></a>
#### API-CAT-25-c · `PATCH /api/admin/cat/classes`

- **Qué hace:** Clases de servicio. Modifica algunos campos de un registro de clases de servicio (`serviceClasses`) (solo los enviados).
- **Para qué sirve:** RF-CAT-053: Mantener clases de servicio con valores asociados (ej. tasa hospital, tipo de suministro). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.clases.editar`.
- **Recibe:** solo los campos a cambiar de clases de servicio (`serviceClasses`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de clases de servicio (`serviceClasses`).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1484 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-25-c)

<a id="API-CAT-26"></a>
#### API-CAT-26 · `GET /api/admin/cat/properties`

- **Qué hace:** Propiedades. Lista, con filtros y paginación, los registros de propiedades del servicio (`serviceProperties`).
- **Para qué sirve:** RF-CAT-054: Mantener propiedades del servicio (tensión, mínimos, cargo fijo asociado, tensión regulatoria) y propiedades personalizadas tipadas con lista de valores. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.propiedades.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de propiedades del servicio (`serviceProperties`) con `total`.
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1485 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-26)

<a id="API-CAT-26-b"></a>
#### API-CAT-26-b · `POST /api/admin/cat/properties`

- **Qué hace:** Propiedades. Da de alta un registro de propiedades del servicio (`serviceProperties`).
- **Para qué sirve:** RF-CAT-054: Mantener propiedades del servicio (tensión, mínimos, cargo fijo asociado, tensión regulatoria) y propiedades personalizadas tipadas con lista de valores. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.propiedades.editar`.
- **Recibe:** los datos de propiedades del servicio (`serviceProperties`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de propiedades del servicio (`serviceProperties`).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1485 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-26-b)

<a id="API-CAT-26-c"></a>
#### API-CAT-26-c · `PATCH /api/admin/cat/properties`

- **Qué hace:** Propiedades. Modifica algunos campos de un registro de propiedades del servicio (`serviceProperties`) (solo los enviados).
- **Para qué sirve:** RF-CAT-054: Mantener propiedades del servicio (tensión, mínimos, cargo fijo asociado, tensión regulatoria) y propiedades personalizadas tipadas con lista de valores. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.propiedades.editar`.
- **Recibe:** solo los campos a cambiar de propiedades del servicio (`serviceProperties`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de propiedades del servicio (`serviceProperties`).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1485 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-26-c)

<a id="API-CAT-27"></a>
#### API-CAT-27 · `GET /api/admin/cat/statuses`

- **Qué hace:** Estados operativos. Lista, con filtros y paginación, los registros de estados operativos por servicio (`serviceStatuses`).
- **Para qué sirve:** RF-CAT-062: Mantener por servicio un catálogo de estados operativos configurables, cada uno mapeado a un estado canónico, con marca de "implica desconexión" y "estado principal". *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.estados.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de estados operativos por servicio (`serviceStatuses`) con `total`.
- **Pantallas:** PAN-CAT-10 (Estados operativos por servicio).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1486 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-27)

<a id="API-CAT-27-b"></a>
#### API-CAT-27-b · `POST /api/admin/cat/statuses`

- **Qué hace:** Estados operativos. Da de alta un registro de estados operativos por servicio (`serviceStatuses`).
- **Para qué sirve:** RF-CAT-062: Mantener por servicio un catálogo de estados operativos configurables, cada uno mapeado a un estado canónico, con marca de "implica desconexión" y "estado principal". *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.estados.configurar`.
- **Recibe:** los datos de estados operativos por servicio (`serviceStatuses`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de estados operativos por servicio (`serviceStatuses`).
- **Pantallas:** PAN-CAT-10 (Estados operativos por servicio).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1486 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-27-b)

<a id="API-CAT-27-c"></a>
#### API-CAT-27-c · `PATCH /api/admin/cat/statuses`

- **Qué hace:** Estados operativos. Modifica algunos campos de un registro de estados operativos por servicio (`serviceStatuses`) (solo los enviados).
- **Para qué sirve:** RF-CAT-062: Mantener por servicio un catálogo de estados operativos configurables, cada uno mapeado a un estado canónico, con marca de "implica desconexión" y "estado principal". *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.estados.configurar`.
- **Recibe:** solo los campos a cambiar de estados operativos por servicio (`serviceStatuses`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de estados operativos por servicio (`serviceStatuses`).
- **Pantallas:** PAN-CAT-10 (Estados operativos por servicio).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1486 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-27-c)

<a id="API-CAT-28"></a>
#### API-CAT-28 · `GET /api/admin/cat/event-charges`

- **Qué hace:** Conceptos por evento y bonificaciones. Consulta `event-charges`.
- **Para qué sirve:** RF-CAT-050: Configurar conceptos por evento (alta de servicio, alta de cuenta, alta de titular, reconexión, después de OT, antes de OT, transferencia) con filtros (socio activo, moroso, prepago, referencia, localidad, categoría, clase… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.conceptos.editar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CAT-12 (Conceptos por evento y bonificaciones de conexión).
- **Ola:** O3 · **Fuente:** M02 §11. API, línea 1487 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-28)

<a id="API-CAT-28-b"></a>
#### API-CAT-28-b · `POST /api/admin/cat/event-charges`

- **Qué hace:** Conceptos por evento y bonificaciones. Registra un nuevo elemento u operación en `event-charges`.
- **Para qué sirve:** RF-CAT-050: Configurar conceptos por evento (alta de servicio, alta de cuenta, alta de titular, reconexión, después de OT, antes de OT, transferencia) con filtros (socio activo, moroso, prepago, referencia, localidad, categoría, clase… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.conceptos.editar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CAT-12 (Conceptos por evento y bonificaciones de conexión).
- **Ola:** O3 · **Fuente:** M02 §11. API, línea 1487 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-28-b)

<a id="API-CAT-28-c"></a>
#### API-CAT-28-c · `PATCH /api/admin/cat/event-charges`

- **Qué hace:** Conceptos por evento y bonificaciones. Modifica algunos campos de un registro de `event-charges` (solo los enviados).
- **Para qué sirve:** RF-CAT-050: Configurar conceptos por evento (alta de servicio, alta de cuenta, alta de titular, reconexión, después de OT, antes de OT, transferencia) con filtros (socio activo, moroso, prepago, referencia, localidad, categoría, clase… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.conceptos.editar`.
- **Recibe:** solo los campos a cambiar; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CAT-12 (Conceptos por evento y bonificaciones de conexión).
- **Ola:** O3 · **Fuente:** M02 §11. API, línea 1487 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-28-c)

<a id="API-CAT-29"></a>
#### API-CAT-29 · `GET /api/admin/cat/auto-rules`

- **Qué hace:** Reglas automáticas. Consulta `auto-rules`.
- **Para qué sirve:** RF-CAT-086: Ejecutar reglas de altas automáticas ante eventos (alta de servicio, alta de cuenta, baja, reconexión, cambio de categoría, nueva OT, cambio de domicilio) con filtros (categoría, propiedad, clase, actividad, localidad… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.reglasAuto.configurar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CAT-11 (Reglas de altas automáticas).
- **Ola:** O4 · **Fuente:** M02 §11. API, línea 1488 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-29)

<a id="API-CAT-29-b"></a>
#### API-CAT-29-b · `POST /api/admin/cat/auto-rules`

- **Qué hace:** Reglas automáticas. Registra un nuevo elemento u operación en `auto-rules`.
- **Para qué sirve:** RF-CAT-086: Ejecutar reglas de altas automáticas ante eventos (alta de servicio, alta de cuenta, baja, reconexión, cambio de categoría, nueva OT, cambio de domicilio) con filtros (categoría, propiedad, clase, actividad, localidad… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.reglasAuto.configurar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CAT-11 (Reglas de altas automáticas).
- **Ola:** O4 · **Fuente:** M02 §11. API, línea 1488 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-29-b)

<a id="API-CAT-29-c"></a>
#### API-CAT-29-c · `PATCH /api/admin/cat/auto-rules`

- **Qué hace:** Reglas automáticas. Modifica algunos campos de un registro de `auto-rules` (solo los enviados).
- **Para qué sirve:** RF-CAT-086: Ejecutar reglas de altas automáticas ante eventos (alta de servicio, alta de cuenta, baja, reconexión, cambio de categoría, nueva OT, cambio de domicilio) con filtros (categoría, propiedad, clase, actividad, localidad… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.reglasAuto.configurar`.
- **Recibe:** solo los campos a cambiar; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CAT-11 (Reglas de altas automáticas).
- **Ola:** O4 · **Fuente:** M02 §11. API, línea 1488 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-29-c)

<a id="API-CAT-30"></a>
#### API-CAT-30 · `POST /api/admin/cat/auto-rules/{id}/simulate`

- **Qué hace:** Simular regla. Simula sin efectos un registro de `simulate`.
- **Para qué sirve:** RF-CAT-031: Agrupar los cambios de un servicio en una versión de configuración con dependencias, validaciones, simulación, revisión, aprobación y fecha efectiva. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.reglasAuto.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CAT-11 (Reglas de altas automáticas).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1489 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-30)

<a id="API-CAT-31"></a>
#### API-CAT-31 · `GET /api/admin/cat/contracts`

- **Qué hace:** Buscar contratos (paginado). Lista, con filtros y paginación, los registros de contrato de servicio. domainAttributes tipados incluyen AG meteringRegime[] con vigencia (`serviceContracts`).
- **Para qué sirve:** RF-CAT-094: En listados: mostrar por defecto solo contratos activos, mostrar observación del servicio junto a su descripción, permitir desagrupar servicios de la cuenta y buscar por matrícula aproximada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.contratos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de contrato de servicio. domainAttributes tipados incluyen AG meteringRegime[] con vigencia (`serviceContracts`) con `total`.
- **Pantallas:** PAN-CAT-13 (Servicios contratados), PAN-CAT-14 (Ficha del contrato por bloques).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1490 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-31)

<a id="API-CAT-33"></a>
#### API-CAT-33 · `POST /api/admin/cat/contracts`

- **Qué hace:** Crear contrato (requested); devuelve todos los errores/advertencias. Da de alta un registro de contrato de servicio. domainAttributes tipados incluyen AG meteringRegime[] con vigencia (`serviceContracts`).
- **Para qué sirve:** RF-CAT-115: Crear los contratos de obra (tipo 17, dominio OBR) al aprobarse el prorrateo de una obra: consumir EVT-TEC-25 tec.levy.approved y, por cada beneficiario, crear un contrato con API-CAT-33 vinculado a la obra, al inmueble y a la…
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.contratos.crear`.
- **Recibe:** los datos de contrato de servicio. domainAttributes tipados incluyen AG meteringRegime[] con vigencia (`serviceContracts`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de contrato de servicio. domainAttributes tipados incluyen AG meteringRegime[] con vigencia (`serviceContracts`).
- **Pantallas:** PAN-CAT-15 (Asistente de alta).
- **Ola:** O7 · **Fuente:** M02 §11. API, línea 1492 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-33)

<a id="API-CAT-32"></a>
#### API-CAT-32 · `GET /api/admin/cat/contracts/{id}`

- **Qué hace:** Ficha; ?asOf=&dateKind=effective/recorded. Obtiene el detalle de un registro de contrato de servicio. domainAttributes tipados incluyen AG meteringRegime[] con vigencia (`serviceContracts`).
- **Para qué sirve:** RF-CAT-001: Mantener un catálogo global de capacidades de servicio con código, nombre (dict), dominio, descripción, estado (draft, available, deprecated), madurez (confirmed, candidate), perfiles de registración y tipos de cálculo… · RF-CAT-115: Crear los contratos de obra (tipo 17, dominio OBR) al aprobarse el prorrateo de una obra: consumir EVT-TEC-25 tec.levy.approved y, por cada beneficiario, crear un contrato con API-CAT-33 vinculado a la obra, al inmueble y a la… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.contratos.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de contrato de servicio. domainAttributes tipados incluyen AG meteringRegime[] con vigencia (`serviceContracts`).
- **Pantallas:** PAN-CAT-13 (Servicios contratados), PAN-CAT-14 (Ficha del contrato por bloques).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1491 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-32)

<a id="API-CAT-34"></a>
#### API-CAT-34 · `PATCH /api/admin/cat/contracts/{id}`

- **Qué hace:** Editar atributos no de estado (observaciones, referencias, atributos de dominio). Modifica algunos campos de un registro de contrato de servicio. domainAttributes tipados incluyen AG meteringRegime[] con vigencia (`serviceContracts`) (solo los enviados).
- **Para qué sirve:** RF-CAT-115: Crear los contratos de obra (tipo 17, dominio OBR) al aprobarse el prorrateo de una obra: consumir EVT-TEC-25 tec.levy.approved y, por cada beneficiario, crear un contrato con API-CAT-33 vinculado a la obra, al inmueble y a la… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.contratos.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de contrato de servicio. domainAttributes tipados incluyen AG meteringRegime[] con vigencia (`serviceContracts`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de contrato de servicio. domainAttributes tipados incluyen AG meteringRegime[] con vigencia (`serviceContracts`).
- **Pantallas:** PAN-CAT-25 (Declaración jurada de artefactos por servicio).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1493 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-34)

<a id="API-CAT-35"></a>
#### API-CAT-35 · `POST /api/admin/cat/contracts/{id}/commands/{command}`

- **Qué hace:** Ejecutar transición/cambio (approve, requestFeasibility, activate, suspend, requestReactivation, reactivate, requestTermination, withdraw... Registra un nuevo elemento u operación en contrato de servicio. domainAttributes tipados incluyen AG meteringRegime[] con vigencia (`serviceContracts`).
- **Para qué sirve:** RF-CAT-068: La ficha del contrato contiene: cabecera (id, servicio, clase, plan y versión, categoría), ubicación (domicilio del servicio, referencia, nomenclatura catastral Cod/Sec/Man/Par/PH/Lote, DDJJ, número de contrato, inmueble, GIS… · RF-CAT-114: Cambiar el régimen de medición del contrato (metered ↔ unmetered) con el comando changeMeteringRegime, con fecha efectiva, motivo y evidencia; registra el tramo en la historia y publica EVT-CAT-28…
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.contratos.activar`.
- **Recibe:** en la ruta `id`, `command`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1494 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-35)

<a id="API-CAT-36"></a>
#### API-CAT-36 · `GET /api/admin/cat/contracts/{id}/history`

- **Qué hace:** Historia. Lista, con filtros y paginación, los registros de historia de eventos del contrato (`serviceContractHistory`).
- **Para qué sirve:** RF-CAT-057: Conservar historial de categoría por vigencia en el contrato para facturar cada período con la categoría que correspondía. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.contratos.ver`.
- **Recibe:** en la ruta `id`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de historia de eventos del contrato (`serviceContractHistory`) con `total`.
- **Pantallas:** PAN-CAT-13 (Servicios contratados), PAN-CAT-14 (Ficha del contrato por bloques).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1495 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-36)

<a id="API-CAT-37"></a>
#### API-CAT-37 · `GET /api/admin/cat/contracts/{id}/equipment`

- **Qué hace:** Equipos del contrato; asignar. Consulta «equipment» de un registro de contrato de servicio. domainAttributes tipados incluyen AG meteringRegime[] con vigencia (`serviceContracts`).
- **Para qué sirve:** RF-CAT-079: Registrar equipos asignados al contrato en comodato: producto, unidad serializada (STK), depósito, fecha de entrega, fecha de devolución prevista, fecha devuelto, precio de referencia, observaciones, constancia firmada; bandeja… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.comodatos.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de contrato de servicio. domainAttributes tipados incluyen AG meteringRegime[] con vigencia (`serviceContracts`).
- **Pantallas:** PAN-CAT-19 (Equipos en comodato).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1496 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-37)

<a id="API-CAT-37-b"></a>
#### API-CAT-37-b · `POST /api/admin/cat/contracts/{id}/equipment`

- **Qué hace:** Equipos del contrato; asignar. Registra «equipment» sobre un registro de contrato de servicio. domainAttributes tipados incluyen AG meteringRegime[] con vigencia (`serviceContracts`).
- **Para qué sirve:** RF-CAT-079: Registrar equipos asignados al contrato en comodato: producto, unidad serializada (STK), depósito, fecha de entrega, fecha de devolución prevista, fecha devuelto, precio de referencia, observaciones, constancia firmada; bandeja… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.comodatos.asignar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1496 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-37-b)

<a id="API-CAT-38"></a>
#### API-CAT-38 · `POST /api/admin/cat/equipment-assignments/{id}/return`

- **Qué hace:** Registrar devolución/pérdida/reemplazo. Devuelve un registro de equipos asignados al contrato (`contractEquipmentAssignments`).
- **Para qué sirve:** RF-CAT-079: Registrar equipos asignados al contrato en comodato: producto, unidad serializada (STK), depósito, fecha de entrega, fecha de devolución prevista, fecha devuelto, precio de referencia, observaciones, constancia firmada; bandeja… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.comodatos.devolver`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M02 §11. API, línea 1497 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-38)

<a id="API-CAT-39"></a>
#### API-CAT-39 · `GET /api/admin/cat/equipment-assignments`

- **Qué hace:** Bandeja de devoluciones. Lista, con filtros y paginación, los registros de equipos asignados al contrato (`contractEquipmentAssignments`).
- **Para qué sirve:** RF-CAT-079: Registrar equipos asignados al contrato en comodato: producto, unidad serializada (STK), depósito, fecha de entrega, fecha de devolución prevista, fecha devuelto, precio de referencia, observaciones, constancia firmada; bandeja… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.comodatos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de equipos asignados al contrato (`contractEquipmentAssignments`) con `total`.
- **Pantallas:** PAN-CAT-19 (Equipos en comodato).
- **Ola:** O3 · **Fuente:** M02 §11. API, línea 1498 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-39)

<a id="API-CAT-41"></a>
#### API-CAT-41 · `GET /api/admin/cat/contracts/{id}/appliances`

- **Qué hace:** DDJJ de artefactos por servicio según la plantilla PRM-CAT-110 (GAS y ELE; HUE-GAS-01); GET .../appliances/template devuelve la plantilla... Lista, con filtros y paginación, los registros de artefactos declarados por contrato (`contractDeclaredAppliances`).
- **Para qué sirve:** RF-CAT-024: Configurar documentos y plantillas por servicio: contrato de alta, fianza del servicio, informe/constancia de baja, formulario de desconexión, DDJJ (artefactos), constancia de entrega y devolución de equipos; y si se consulta… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.contratos.editar`.
- **Recibe:** en la ruta `id`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de artefactos declarados por contrato (`contractDeclaredAppliances`) con `total`.
- **Pantallas:** PAN-CAT-25 (Declaración jurada de artefactos por servicio).
- **Ola:** O7 · **Fuente:** M02 §11. API, línea 1500 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-41)

<a id="API-CAT-41-b"></a>
#### API-CAT-41-b · `POST /api/admin/cat/contracts/{id}/appliances`

- **Qué hace:** DDJJ de artefactos por servicio según la plantilla PRM-CAT-110 (GAS y ELE; HUE-GAS-01); GET .../appliances/template devuelve la plantilla... Da de alta un registro de artefactos declarados por contrato (`contractDeclaredAppliances`).
- **Para qué sirve:** RF-CAT-024: Configurar documentos y plantillas por servicio: contrato de alta, fianza del servicio, informe/constancia de baja, formulario de desconexión, DDJJ (artefactos), constancia de entrega y devolución de equipos; y si se consulta… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.contratos.editar`.
- **Recibe:** en la ruta `id`; los datos de artefactos declarados por contrato (`contractDeclaredAppliances`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de artefactos declarados por contrato (`contractDeclaredAppliances`).
- **Pantallas:** PAN-CAT-25 (Declaración jurada de artefactos por servicio).
- **Ola:** O7 · **Fuente:** M02 §11. API, línea 1500 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-41-b)

<a id="API-CAT-41-c"></a>
#### API-CAT-41-c · `PATCH /api/admin/cat/contracts/{id}/appliances`

- **Qué hace:** DDJJ de artefactos por servicio según la plantilla PRM-CAT-110 (GAS y ELE; HUE-GAS-01); GET .../appliances/template devuelve la plantilla... Modifica algunos campos de un registro de artefactos declarados por contrato (`contractDeclaredAppliances`) (solo los enviados).
- **Para qué sirve:** RF-CAT-024: Configurar documentos y plantillas por servicio: contrato de alta, fianza del servicio, informe/constancia de baja, formulario de desconexión, DDJJ (artefactos), constancia de entrega y devolución de equipos; y si se consulta… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.contratos.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de artefactos declarados por contrato (`contractDeclaredAppliances`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de artefactos declarados por contrato (`contractDeclaredAppliances`).
- **Pantallas:** PAN-CAT-25 (Declaración jurada de artefactos por servicio).
- **Ola:** O7 · **Fuente:** M02 §11. API, línea 1500 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-41-c)

<a id="API-CAT-42"></a>
#### API-CAT-42 · `GET /api/admin/cat/contracts/{id}/generation-agreement`

- **Qué hace:** Vínculo de generación distribuida. Consulta «generation-agreement» de un registro de contrato de servicio. domainAttributes tipados incluyen AG meteringRegime[] con vigencia (`serviceContracts`).
- **Para qué sirve:** RF-CAT-096: Registrar el vínculo de generación distribuida asociado al suministro eléctrico: clasificación del usuario-generador, potencia, equipo, fecha de conexión, instalador, medidor bidireccional; su cambio de titular y baja siguen al… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.contratos.editar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de contrato de servicio. domainAttributes tipados incluyen AG meteringRegime[] con vigencia (`serviceContracts`).
- **Pantallas:** PAN-CAT-25 (Declaración jurada de artefactos por servicio).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1501 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-42)

<a id="API-CAT-42-b"></a>
#### API-CAT-42-b · `POST /api/admin/cat/contracts/{id}/generation-agreement`

- **Qué hace:** Vínculo de generación distribuida. Registra «generation-agreement» sobre un registro de contrato de servicio. domainAttributes tipados incluyen AG meteringRegime[] con vigencia (`serviceContracts`).
- **Para qué sirve:** RF-CAT-096: Registrar el vínculo de generación distribuida asociado al suministro eléctrico: clasificación del usuario-generador, potencia, equipo, fecha de conexión, instalador, medidor bidireccional; su cambio de titular y baja siguen al… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.contratos.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CAT-25 (Declaración jurada de artefactos por servicio).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1501 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-42-b)

<a id="API-CAT-42-c"></a>
#### API-CAT-42-c · `PATCH /api/admin/cat/contracts/{id}/generation-agreement`

- **Qué hace:** Vínculo de generación distribuida. Modifica algunos campos de un registro de contrato de servicio. domainAttributes tipados incluyen AG meteringRegime[] con vigencia (`serviceContracts`) (solo los enviados).
- **Para qué sirve:** RF-CAT-096: Registrar el vínculo de generación distribuida asociado al suministro eléctrico: clasificación del usuario-generador, potencia, equipo, fecha de conexión, instalador, medidor bidireccional; su cambio de titular y baja siguen al… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.contratos.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de contrato de servicio. domainAttributes tipados incluyen AG meteringRegime[] con vigencia (`serviceContracts`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de contrato de servicio. domainAttributes tipados incluyen AG meteringRegime[] con vigencia (`serviceContracts`).
- **Pantallas:** PAN-CAT-25 (Declaración jurada de artefactos por servicio).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1501 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-42-c)

<a id="API-CAT-43"></a>
#### API-CAT-43 · `GET /api/admin/cat/contracts/{id}/special-conditions`

- **Qué hace:** Condiciones de grandes usuarios. Lista, con filtros y paginación, los registros de condiciones especiales de grandes usuarios (`contractSpecialConditions`).
- **Para qué sirve:** RF-CAT-097: Registrar condiciones especiales de grandes usuarios: precio particular, potencia contratada, plazo, penalidades, aprobación y versión; revisión previa obligatoria de la factura por su importe (marca para FAC). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.contratos.editar`.
- **Recibe:** en la ruta `id`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de condiciones especiales de grandes usuarios (`contractSpecialConditions`) con `total`.
- **Pantallas:** PAN-CAT-25 (Declaración jurada de artefactos por servicio).
- **Ola:** O7 · **Fuente:** M02 §11. API, línea 1502 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-43)

<a id="API-CAT-43-b"></a>
#### API-CAT-43-b · `POST /api/admin/cat/contracts/{id}/special-conditions`

- **Qué hace:** Condiciones de grandes usuarios. Da de alta un registro de condiciones especiales de grandes usuarios (`contractSpecialConditions`).
- **Para qué sirve:** RF-CAT-097: Registrar condiciones especiales de grandes usuarios: precio particular, potencia contratada, plazo, penalidades, aprobación y versión; revisión previa obligatoria de la factura por su importe (marca para FAC). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.contratos.editar`.
- **Recibe:** en la ruta `id`; los datos de condiciones especiales de grandes usuarios (`contractSpecialConditions`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de condiciones especiales de grandes usuarios (`contractSpecialConditions`).
- **Pantallas:** PAN-CAT-25 (Declaración jurada de artefactos por servicio).
- **Ola:** O7 · **Fuente:** M02 §11. API, línea 1502 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-43-b)

<a id="API-CAT-44"></a>
#### API-CAT-44 · `POST /api/admin/cat/bulk-operations`

- **Qué hace:** Crear trámite masivo. Registra un nuevo elemento u operación en `bulk-operations`.
- **Para qué sirve:** RF-CAT-087: Ejecutar trámites masivos sobre listas de contratos: marcar provisorio, cambiar actividad, clase, categoría (opcionalmente en consumos no facturados), referencia y baja; la baja masiva procesa solo los contratos que pasan la… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.masivos.ejecutar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CAT-17 (Altas, bajas y cambios).
- **Ola:** O4 · **Fuente:** M02 §11. API, línea 1503 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-44)

<a id="API-CAT-45"></a>
#### API-CAT-45 · `POST /api/admin/cat/bulk-operations/{id}/simulate`

- **Qué hace:** Ciclo del trámite. Simula sin efectos un registro de `simulate`.
- **Para qué sirve:** RF-CAT-087: Ejecutar trámites masivos sobre listas de contratos: marcar provisorio, cambiar actividad, clase, categoría (opcionalmente en consumos no facturados), referencia y baja; la baja masiva procesa solo los contratos que pasan la… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.masivos.ejecutar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CAT-17 (Altas, bajas y cambios).
- **Ola:** O4 · **Fuente:** M02 §11. API, línea 1504 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-45)

<a id="API-CAT-45-b"></a>
#### API-CAT-45-b · `POST /api/admin/cat/bulk-operations/{id}/approve`

- **Qué hace:** Ciclo del trámite. Aprueba un registro de `approve`.
- **Para qué sirve:** RF-CAT-087: Ejecutar trámites masivos sobre listas de contratos: marcar provisorio, cambiar actividad, clase, categoría (opcionalmente en consumos no facturados), referencia y baja; la baja masiva procesa solo los contratos que pasan la… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.masivos.ejecutar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CAT-17 (Altas, bajas y cambios).
- **Ola:** O4 · **Fuente:** M02 §11. API, línea 1504 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-45-b)

<a id="API-CAT-45-c"></a>
#### API-CAT-45-c · `POST /api/admin/cat/bulk-operations/{id}/run`

- **Qué hace:** Ciclo del trámite. Ejecuta un registro de `run`.
- **Para qué sirve:** RF-CAT-087: Ejecutar trámites masivos sobre listas de contratos: marcar provisorio, cambiar actividad, clase, categoría (opcionalmente en consumos no facturados), referencia y baja; la baja masiva procesa solo los contratos que pasan la… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.masivos.ejecutar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CAT-17 (Altas, bajas y cambios).
- **Ola:** O4 · **Fuente:** M02 §11. API, línea 1504 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-45-c)

<a id="API-CAT-45-d"></a>
#### API-CAT-45-d · `POST /api/admin/cat/bulk-operations/{id}/revert`

- **Qué hace:** Ciclo del trámite. Revierte un registro de `revert`.
- **Para qué sirve:** RF-CAT-087: Ejecutar trámites masivos sobre listas de contratos: marcar provisorio, cambiar actividad, clase, categoría (opcionalmente en consumos no facturados), referencia y baja; la baja masiva procesa solo los contratos que pasan la… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.masivos.ejecutar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CAT-17 (Altas, bajas y cambios).
- **Ola:** O4 · **Fuente:** M02 §11. API, línea 1504 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-45-d)

<a id="API-CAT-46"></a>
#### API-CAT-46 · `POST /api/admin/cat/copies`

- **Qué hace:** Solicitar copia entre tenants. Registra un nuevo elemento u operación en `copies`.
- **Para qué sirve:** RF-CAT-083: Ejecutar cambios masivos de categoría solicitados por otros módulos (paso a prepago por deuda desde MOR; recategorización por segmentación desde TAR) con origen, criterio, simulación previa y reversión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.copias.ejecutar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CAT-18 (Asistente de copia).
- **Ola:** O6 · **Fuente:** M02 §11. API, línea 1505 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-46)

<a id="API-CAT-47"></a>
#### API-CAT-47 · `POST /api/admin/cat/copies/{id}/authorize-source`

- **Qué hace:** Autorización del tenant origen. Autoriza el origen de un registro de `authorize-source`.
- **Para qué sirve:** RF-CAT-108: Exigir permiso explícito de lectura en origen y de escritura en destino; ser administrador de B no autoriza a leer A. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.copias.autorizarOrigen`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1506 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-47)

<a id="API-CAT-48"></a>
#### API-CAT-48 · `GET /api/admin/cat/copies/{id}`

- **Qué hace:** Estado y pendientes. Obtiene el detalle de un registro de `copies`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.copias.ejecutar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CAT-18 (Asistente de copia).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1507 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-48)

<a id="API-CAT-49"></a>
#### API-CAT-49 · `GET /api/cat/offers`

- **Qué hace:** Oferta para la PWA (la consume el componente embebido en PAN-POR-31; HUE-SRV-04). Consulta `offers`.
- **Para qué sirve:** RF-CAT-068: La ficha del contrato contiene: cabecera (id, servicio, clase, plan y versión, categoría), ubicación (domicilio del servicio, referencia, nomenclatura catastral Cod/Sec/Man/Par/PH/Lote, DDJJ, número de contrato, inmueble, GIS… · RF-CAT-114: Cambiar el régimen de medición del contrato (metered ↔ unmetered) con el comando changeMeteringRegime, con fecha efectiva, motivo y evidencia; registra el tramo en la historia y publica EVT-CAT-28…
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `cat.oferta.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CAT-21 (Oferta del tenant (componente embebido en PAN-POR-31)).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1508 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-49)

<a id="API-CAT-50"></a>
#### API-CAT-50 · `GET /api/cat/my-contracts`

- **Qué hace:** Contratos propios/representados (componente embebido en PAN-POR-29/30; HUE-SRV-04). Consulta `my-contracts`.
- **Para qué sirve:** RF-CAT-068: La ficha del contrato contiene: cabecera (id, servicio, clase, plan y versión, categoría), ubicación (domicilio del servicio, referencia, nomenclatura catastral Cod/Sec/Man/Par/PH/Lote, DDJJ, número de contrato, inmueble, GIS… · RF-CAT-114: Cambiar el régimen de medición del contrato (metered ↔ unmetered) con el comando changeMeteringRegime, con fecha efectiva, motivo y evidencia; registra el tramo en la historia y publica EVT-CAT-28…
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `cat.misServicios.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CAT-22 (Mis servicios (componente embebido en PAN-POR-29 y PAN-POR-30)).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1509 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-50)

<a id="API-CAT-51"></a>
#### API-CAT-51 · `GET /api/public/{tenantSlug}/cat/offers`

- **Qué hace:** Oferta pública de la landing (componente embebido en PAN-POR-02/03; HUE-SRV-04). Consulta `offers`.
- **Para qué sirve:** RF-CAT-068: La ficha del contrato contiene: cabecera (id, servicio, clase, plan y versión, categoría), ubicación (domicilio del servicio, referencia, nomenclatura catastral Cod/Sec/Man/Par/PH/Lote, DDJJ, número de contrato, inmueble, GIS… · RF-CAT-114: Cambiar el régimen de medición del contrato (metered ↔ unmetered) con el comando changeMeteringRegime, con fecha efectiva, motivo y evidencia; registra el tramo en la historia y publica EVT-CAT-28…
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); permiso `por.ofertas.ver`.
- **Recibe:** en la ruta `tenantSlug`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CAT-23 (Catálogo público de servicios (componente embebido en PAN-POR-02 y PAN-POR-03)).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1510 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-51)

<a id="API-CAT-52"></a>
#### API-CAT-52 · `GET /api/admin/cat/dashboard`

- **Qué hace:** Indicadores. Consulta `dashboard`.
- **Para qué sirve:** RF-CAT-113: Proveer indicadores del catálogo: contratos por servicio/estado/plan/categoría, altas pendientes, suspensiones, bajas, equipos pendientes de devolución, contratos no facturables, planes discontinuados con contratos vigentes. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.servicios.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CAT-03 (Servicios del tenant), PAN-CAT-24 (Tablero de servicios).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1511 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-52)

<a id="API-CAT-53"></a>
#### API-CAT-53 · `GET /api/admin/cat/concessions`

- **Qué hace:** Concesiones y fuentes normativas. Lista, con filtros y paginación, los registros de concesiones (`serviceConcessions`).
- **Para qué sirve:** RF-CAT-014: Registrar prestador y jurisdicción: modalidad (prestación directa, subdistribución, convenio, intermediación administrativa), autoridad de aplicación/regulador, título habilitante, concesión, fuente normativa, jurisdicción y… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.servicios.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de concesiones (`serviceConcessions`) con `total`.
- **Pantallas:** PAN-CAT-04 (Ficha de configuración del servicio en pestañas), PAN-CAT-26 (Concesiones y fuentes normativas por servicio).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1512 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-53)

<a id="API-CAT-53-b"></a>
#### API-CAT-53-b · `POST /api/admin/cat/concessions`

- **Qué hace:** Concesiones y fuentes normativas. Da de alta un registro de concesiones (`serviceConcessions`).
- **Para qué sirve:** RF-CAT-014: Registrar prestador y jurisdicción: modalidad (prestación directa, subdistribución, convenio, intermediación administrativa), autoridad de aplicación/regulador, título habilitante, concesión, fuente normativa, jurisdicción y… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.servicios.configurar`.
- **Recibe:** los datos de concesiones (`serviceConcessions`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de concesiones (`serviceConcessions`).
- **Pantallas:** PAN-CAT-04 (Ficha de configuración del servicio en pestañas), PAN-CAT-26 (Concesiones y fuentes normativas por servicio).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1512 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-53-b)

<a id="API-CAT-53-c"></a>
#### API-CAT-53-c · `PATCH /api/admin/cat/concessions`

- **Qué hace:** Concesiones y fuentes normativas. Modifica algunos campos de un registro de concesiones (`serviceConcessions`) (solo los enviados).
- **Para qué sirve:** RF-CAT-014: Registrar prestador y jurisdicción: modalidad (prestación directa, subdistribución, convenio, intermediación administrativa), autoridad de aplicación/regulador, título habilitante, concesión, fuente normativa, jurisdicción y… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.servicios.configurar`.
- **Recibe:** solo los campos a cambiar de concesiones (`serviceConcessions`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de concesiones (`serviceConcessions`).
- **Pantallas:** PAN-CAT-04 (Ficha de configuración del servicio en pestañas), PAN-CAT-26 (Concesiones y fuentes normativas por servicio).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1512 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-53-c)

<a id="API-CAT-54"></a>
#### API-CAT-54 · `GET /api/v1/ext/cat/contracts`

- **Qué hace:** Contratos para APIs de terceros/BI (sin datos sensibles ni secretos). Lista, con filtros y paginación, los registros de contrato de servicio. domainAttributes tipados incluyen AG meteringRegime[] con vigencia (`serviceContracts`).
- **Para qué sirve:** RF-CAT-037: Definir conceptos facturables individualizables por servicio, tipificados: una sola vez, recurrente, por cantidad, por evento, cuota, ajuste, tasa por cuenta de terceros, aporte de capital. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); permiso `bia.cat.contratos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de contrato de servicio. domainAttributes tipados incluyen AG meteringRegime[] con vigencia (`serviceContracts`) con `total`.
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1513 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-54)

<a id="API-CAT-55"></a>
#### API-CAT-55 · `GET /api/platform/cat/templates`

- **Qué hace:** Plantillas de servicio de plataforma (Adoptado DEC-026, PA-CAT-08). Lista, con filtros y paginación, los registros de plantillas de servicio de plataforma (`serviceTemplates`).
- **Para qué sirve:** RF-CAT-109: Mantener plantillas de servicio de plataforma (sin precios ni referencias de tenants) reutilizables para lanzar servicios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `cat.plantillas.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de plantillas de servicio de plataforma (`serviceTemplates`) con `total`.
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1514 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-55)

<a id="API-CAT-55-b"></a>
#### API-CAT-55-b · `POST /api/platform/cat/templates`

- **Qué hace:** Plantillas de servicio de plataforma (Adoptado DEC-026, PA-CAT-08). Da de alta un registro de plantillas de servicio de plataforma (`serviceTemplates`).
- **Para qué sirve:** RF-CAT-109: Mantener plantillas de servicio de plataforma (sin precios ni referencias de tenants) reutilizables para lanzar servicios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `cat.plantillas.editar`.
- **Recibe:** los datos de plantillas de servicio de plataforma (`serviceTemplates`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de plantillas de servicio de plataforma (`serviceTemplates`).
- **Ola:** O2 · **Fuente:** M02 §11. API, línea 1514 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-55-b)

<a id="API-CAT-56"></a>
#### API-CAT-56 · `GET /api/admin/cat/reports/active-subscribers-by-package`

- **Qué hace:** Abonados activos por paquete a la fecha de corte (RF-CAT-116, REP-CAT-16): {serviceId, cutoffDate, items[{serviceProductId, code, tvMinim... Consulta `active-subscribers-by-package`.
- **Para qué sirve:** RF-CAT-116: Informe de abonados activos por paquete a una fecha de corte: por servicio (TV en el uso principal, aplicable a cualquier servicio con paquetes) y producto de tipo paquete, cantidad de contratos que a la fecha de corte estaban en…
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cat.contratos.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CAT-13 (Servicios contratados), PAN-CAT-14 (Ficha del contrato por bloques).
- **Ola:** O10 · **Fuente:** M02 §11. API, línea 1515 · [Ver en Swagger](../18-swagger/index.html?api=m02-cat#/API/API-CAT-56)
