# Catálogo de endpoints · T10 · API externa de integración (T10 §11.2.6)

Parte del [catálogo de endpoints](../18-catalogo-endpoints.md) (artefacto 7.1). Generado el 05-11-2026 con `_trabajo/gen_18_catalogo_endpoints.py` a partir de `18-openapi/`; no se edita a mano.

## Para qué sirve esta API

API para sistemas de terceros (T10 §11.2.6): expone datos de la cooperativa a integradores autorizados con credenciales de cliente OAuth 2.0 o clave de API, scopes por recurso, límites de uso y sincronización incremental. Cada endpoint indica qué módulo provee el dato.

Detalle completo en el anexo T10, sección 1. Contrato navegable: [Swagger](../18-swagger/index.html?api=t10-bia-api-externa).

| Dato | Valor |
|---|---|
| Endpoints | 66 |
| Por método | DELETE 1, GET 57, PATCH 1, POST 7 |
| Grupos funcionales | 1 |
| Con requisito citado en el anexo | 2 |
| Con requisito inferido (a confirmar) | 62 |
| Sin requisito identificable | 2 |

## Grupos funcionales

| Grupo | Endpoints | Qué agrupa (primeros endpoints) |
|---|---|---|
| [API pública para terceros `/api/v1/ext`](#grupo-1) | 66 | Cliente, tenant (slug, timeZone, currency), scopes…; OpenAPI filtrado.; Etiquetas del diccionario del tenant por fieldKey y enum…… |

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

## API pública para terceros `/api/v1/ext`

66 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-BIA-70](#API-BIA-70) | GET | `/api/v1/ext/me` | Cliente, tenant (slug, timeZone, currency), scopes efectivos, cuotas restantes. |
| [API-BIA-71](#API-BIA-71) | GET | `/api/v1/ext/openapi.json` | OpenAPI filtrado. |
| [API-BIA-72](#API-BIA-72) | GET | `/api/v1/ext/meta/labels` | Etiquetas del diccionario del tenant por fieldKey y enum (sin renombrar campos) |
| [API-BIA-73](#API-BIA-73) | GET | `/api/v1/ext/meta/enums` | Enums con valores y significado. |
| [API-BIA-74](#API-BIA-74) | GET | `/api/v1/ext/meta/resources` | Inventario de recursos y campos disponibles para el cliente (RF-BIA-087) |
| [API-BIA-75](#API-BIA-75) | GET | `/api/v1/ext/persons` | Personas/titulares: id, tipo, nombre (o razón social), condición IVA, estado, documento enmascarado. |
| [API-BIA-76](#API-BIA-76) | GET | `/api/v1/ext/persons/{id}` | Detalle con relaciones (titular de cuentas, asociado) |
| [API-BIA-77](#API-BIA-77) | GET | `/api/v1/ext/accounts` | Cuentas: número, titular, sucursal, zona, estado, grupo de facturación. |
| [API-BIA-78](#API-BIA-78) | GET | `/api/v1/ext/accounts/{id}` | Detalle con domicilios de servicio y contratos. |
| [API-BIA-79](#API-BIA-79) | GET | `/api/v1/ext/accounts/{id}/balance` | Saldo total, vencido, a vencer, saldo a favor, en proceso, por servicio, asOf (RF-BIA-095) |
| [API-BIA-80](#API-BIA-80) | GET | `/api/v1/ext/accounts/{id}/ledger-entries` | Movimientos del auxiliar con fecha efectiva y de registro. |
| [API-BIA-81](#API-BIA-81) | GET | `/api/v1/ext/premises` | Inmuebles y puntos de prestación (localidad, barrio, coordenadas redondeadas salvo pii:read) |
| [API-BIA-82](#API-BIA-82) | GET | `/api/v1/ext/contracts` | Servicios contratados/conexiones: servicio, plan, categoría, estado canónico, alta/baja, medido, prepago. |
| [API-BIA-83](#API-BIA-83) | GET | `/api/v1/ext/contracts/{id}` | Detalle con historial de estados y equipos en comodato (sin series si no erp.catalog:read) |
| [API-BIA-84](#API-BIA-84) | GET | `/api/v1/ext/catalog/services` | Servicios habilitados del tenant. |
| [API-BIA-85](#API-BIA-85) | GET | `/api/v1/ext/catalog/plans` | Planes y versiones vigentes. |
| [API-BIA-86](#API-BIA-86) | GET | `/api/v1/ext/catalog/categories` | Categorías tarifarias. |
| [API-BIA-87](#API-BIA-87) | GET | `/api/v1/ext/catalog/tariffs` | Cuadros tarifarios vigentes a fecha ?at= (datos públicos de REP-TAR-001) |
| [API-BIA-88](#API-BIA-88) | GET | `/api/v1/ext/meters` | Medidores: número, tipo, estado, punto, telemedido. |
| [API-BIA-89](#API-BIA-89) | GET | `/api/v1/ext/readings` | Lecturas validadas por período. |
| [API-BIA-90](#API-BIA-90) | GET | `/api/v1/ext/consumptions` | Consumos aprobados: período, cantidad, unidad, estimado, canal. |
| [API-BIA-91](#API-BIA-91) | GET | `/api/v1/ext/invoices` | Comprobantes: tipo, letra, PV, número, fechas, cuenta, totales, estado, CAE. |
| [API-BIA-92](#API-BIA-92) | GET | `/api/v1/ext/invoices/{id}` | Detalle con líneas, impuestos, vencimientos, imputaciones resumidas. |
| [API-BIA-93](#API-BIA-93) | GET | `/api/v1/ext/invoices/{id}/pdf` | 302 a URL firmada del PDF (peso 5) |
| [API-BIA-94](#API-BIA-94) | GET | `/api/v1/ext/payments` | Pagos confirmados: canal, ente, fechas de pago/confirmación/acreditación, importe, estado. |
| [API-BIA-95](#API-BIA-95) | GET | `/api/v1/ext/allocations` | Imputaciones pago ↔ obligación. |
| [API-BIA-96](#API-BIA-96) | GET | `/api/v1/ext/payment-channels` | Canales y entes habilitados. |
| [API-BIA-97](#API-BIA-97) | GET | `/api/v1/ext/aging` | Antigüedad de saldos por cuenta y servicio a ?asOf= (tramos de REP-COB-002) |
| [API-BIA-98](#API-BIA-98) | GET | `/api/v1/ext/arrears-cases` | Notificaciones e instancias de mora por cuenta. |
| [API-BIA-99](#API-BIA-99) | GET | `/api/v1/ext/agreements` | Convenios y cuotas. |
| [API-BIA-100](#API-BIA-100) | GET | `/api/v1/ext/interruptions` | Casos de suspensión/corte/reconexión (estado, fechas) |
| [API-BIA-101](#API-BIA-101) | GET | `/api/v1/ext/tickets` | Solicitudes, reclamos y tickets: tipo, canal, área, prioridad, estado, SLA, tiempos (sin notas internas ni adjuntos) |
| [API-BIA-102](#API-BIA-102) | GET | `/api/v1/ext/tickets/{id}` | Detalle con historial de estados públicos. |
| [API-BIA-103](#API-BIA-103) | GET | `/api/v1/ext/work-orders` | Órdenes de trabajo y visitas: tipo, operación, cuadrilla, fechas, resultado. |
| [API-BIA-104](#API-BIA-104) | GET | `/api/v1/ext/appointments` | Turnos de agenda técnica y del turnero. |
| [API-BIA-105](#API-BIA-105) | GET | `/api/v1/ext/products` | Productos/artículos y precios públicos. |
| [API-BIA-106](#API-BIA-106) | GET | `/api/v1/ext/stock` | Existencias por depósito (reemplaza WS_KEYS.DEPOSITO_INSUMO/PRODUCTO → dataScope.warehouseIds) |
| [API-BIA-107](#API-BIA-107) | GET | `/api/v1/ext/suppliers` | Proveedores (datos públicos: razón social, CUIT, rubro) |
| [API-BIA-108](#API-BIA-108) | GET | `/api/v1/ext/purchases` | Documentos de compra (OC, recepciones, facturas) agregados. |
| [API-BIA-109](#API-BIA-109) | GET | `/api/v1/ext/treasury/summary` | Disponibilidades, cartera y flujo agregados a ?asOf=. |
| [API-BIA-110](#API-BIA-110) | GET | `/api/v1/ext/gl-accounts` | Plan de cuentas (operativo y alternativos) |
| [API-BIA-111](#API-BIA-111) | GET | `/api/v1/ext/journal-entries` | Asientos posted con renglones. |
| [API-BIA-112](#API-BIA-112) | GET | `/api/v1/ext/trial-balance` | Sumas y saldos por ejercicio/rango/plan (REP-CON-004) |
| [API-BIA-113](#API-BIA-113) | GET | `/api/v1/ext/members` | Asociados: número, estado, ingreso/egreso, categoría. |
| [API-BIA-114](#API-BIA-114) | GET | `/api/v1/ext/capital-summary` | Resumen de capital social a ?asOf= (REP-INS-005) |
| [API-BIA-115](#API-BIA-115) | GET | `/api/v1/ext/assemblies` | Asambleas, quórum y resultados agregados (sin votos individuales) |
| [API-BIA-116](#API-BIA-116) | GET | `/api/v1/ext/payroll/summary` | Costo laboral y dotación agregados por centro y período (nunca individuales) |
| [API-BIA-117](#API-BIA-117) | GET | `/api/v1/ext/metrics` | Catálogo de indicadores certificados con definición. |
| [API-BIA-118](#API-BIA-118) | GET | `/api/v1/ext/metrics/{code}/values` | Valores/snapshots ?period=&from=&to=&dims=. |
| [API-BIA-119](#API-BIA-119) | GET | `/api/v1/ext/datasets` | Datasets expuestos a API con diccionario. |
| [API-BIA-120](#API-BIA-120) | GET | `/api/v1/ext/datasets/{code}/rows` | Filas del dataset (feed para Power BI/Excel, peso 2); ?format=json/csv. |
| [API-BIA-121](#API-BIA-121) | POST | `/api/v1/ext/exports` | Crea exportación masiva { resource/datasetCode, filters, format: ndjson/csv/parquet, asOf } → 202. |
| [API-BIA-122](#API-BIA-122) | GET | `/api/v1/ext/exports/{id}` | Estado, partes, checksums, vencimiento. |
| [API-BIA-123](#API-BIA-123) | GET | `/api/v1/ext/exports/{id}/parts/{n}` | 302 a URL firmada de la parte. |
| [API-BIA-124](#API-BIA-124) | GET | `/api/v1/ext/webhooks/subscriptions` | Listar/crear suscripciones propias (secreto devuelto una vez) |
| [API-BIA-124-b](#API-BIA-124-b) | POST | `/api/v1/ext/webhooks/subscriptions` | Listar/crear suscripciones propias (secreto devuelto una vez) |
| [API-BIA-125-b](#API-BIA-125-b) | DELETE | `/api/v1/ext/webhooks/subscriptions/{id}` | Pausar, reanudar, cambiar eventos/URL, rotar secreto, eliminar. |
| [API-BIA-125](#API-BIA-125) | PATCH | `/api/v1/ext/webhooks/subscriptions/{id}` | Pausar, reanudar, cambiar eventos/URL, rotar secreto, eliminar. |
| [API-BIA-126](#API-BIA-126) | POST | `/api/v1/ext/webhooks/subscriptions/{id}/test` | Envía evento ping firmado. |
| [API-BIA-127](#API-BIA-127) | GET | `/api/v1/ext/webhooks/deliveries` | Entregas propias y estado. |
| [API-BIA-128](#API-BIA-128) | POST | `/api/v1/ext/webhooks/deliveries/{id}/redeliver` | Reenvío de una entrega dead o fallida. |
| [API-BIA-129](#API-BIA-129) | GET | `/api/v1/ext/webhooks/event-types` | Catálogo de eventos públicos (§12.3) con esquema. |
| [API-BIA-130](#API-BIA-130) | POST | `/api/v1/ext/requests/persons` | Solicitud de alta/modificación de persona (la procesa CRM con su circuito) → 202 con requestId. |
| [API-BIA-131](#API-BIA-131) | POST | `/api/v1/ext/requests/accounts` | Solicitud de alta de cuenta/servicio (ex RegistrarCuenta, PutCategoria) |
| [API-BIA-132](#API-BIA-132) | POST | `/api/v1/ext/requests/tickets` | Alta de reclamo o consulta (canal api) |
| [API-BIA-133](#API-BIA-133) | GET | `/api/v1/ext/requests/{id}` | Estado de la solicitud (received, inReview, accepted, rejected, processed) con resultado. |

<a id="API-BIA-70"></a>
#### API-BIA-70 · `GET /api/v1/ext/me`

- **Qué hace:** Cliente, tenant (slug, timeZone, currency), scopes efectivos, cuotas restantes. Consulta `me`.
- **Para qué sirve:** RF-BIA-070: Registro de clientes de API por tenant con responsable, finalidad, sistema, contacto técnico, estado, scopes, restricciones (IP, sucursales, servicios) y vigencia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); permiso `bia.apis.consumir`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2051 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-70)

<a id="API-BIA-71"></a>
#### API-BIA-71 · `GET /api/v1/ext/openapi.json`

- **Qué hace:** OpenAPI filtrado. Consulta `openapi.json`.
- **Para qué sirve:** RF-BIA-077: OpenAPI 3.1 generado desde los esquemas Zod, publicado por tenant (sólo los recursos licenciados) y portal de documentación con ejemplos ficticios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); permiso `bia.apis.consumir`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2052 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-71)

<a id="API-BIA-72"></a>
#### API-BIA-72 · `GET /api/v1/ext/meta/labels`

- **Qué hace:** Etiquetas del diccionario del tenant por fieldKey y enum (sin renombrar campos) Consulta `labels`.
- **Para qué sirve:** RF-BIA-081: Metadatos de etiquetas del diccionario (/meta/labels) sin renombrar campos técnicos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); permiso `bia.apis.consumir`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2053 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-72)

<a id="API-BIA-73"></a>
#### API-BIA-73 · `GET /api/v1/ext/meta/enums`

- **Qué hace:** Enums con valores y significado. Consulta `enums`.
- **Para qué sirve:** RF-BIA-087: Inventario publicado de datos disponibles, restricciones y significado de importes, fechas, zonas horarias y estados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); permiso `bia.apis.consumir`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2054 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-73)

<a id="API-BIA-74"></a>
#### API-BIA-74 · `GET /api/v1/ext/meta/resources`

- **Qué hace:** Inventario de recursos y campos disponibles para el cliente (RF-BIA-087) Consulta `resources`.
- **Para qué sirve:** RF-BIA-087: Inventario publicado de datos disponibles, restricciones y significado de importes, fechas, zonas horarias y estados.
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); permiso `bia.apis.consumir`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2055 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-74)

<a id="API-BIA-75"></a>
#### API-BIA-75 · `GET /api/v1/ext/persons`

- **Qué hace:** Personas/titulares: id, tipo, nombre (o razón social), condición IVA, estado, documento enmascarado. Consulta dimensión persona (`bi_dim_person`).
- **Para qué sirve:** RF-BIA-014: Enmascarado de datos personales (documento, CUIT de personas humanas, teléfono, email, CBU, domicilio exacto) salvo bia.datosSensibles.ver. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «persons:read».
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: el registro de PaginaExterna (`PaginaExterna`).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2056 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-75)

<a id="API-BIA-76"></a>
#### API-BIA-76 · `GET /api/v1/ext/persons/{id}`

- **Qué hace:** Detalle con relaciones (titular de cuentas, asociado) Obtiene el detalle de un registro de dimensión persona (`bi_dim_person`).
- **Para qué sirve:** RF-BIA-088: Escrituras limitadas vía API como solicitudes que procesa el módulo dueño (alta de persona/cuenta, reclamo), con Idempotency-Key. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «persons:read».
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de dimensión persona (`bi_dim_person`).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2057 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-76)

<a id="API-BIA-77"></a>
#### API-BIA-77 · `GET /api/v1/ext/accounts`

- **Qué hace:** Cuentas: número, titular, sucursal, zona, estado, grupo de facturación. Consulta dimensión cuenta (`bi_dim_account`).
- **Para qué sirve:** RF-BIA-064: Historización de dimensiones (categoría, zona, plan, estado) con vigencia para analizar "como era" y "como es". *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «accounts:read».
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: el registro de PaginaExterna (`PaginaExterna`).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2058 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-77)

<a id="API-BIA-78"></a>
#### API-BIA-78 · `GET /api/v1/ext/accounts/{id}`

- **Qué hace:** Detalle con domicilios de servicio y contratos. Obtiene el detalle de un registro de dimensión cuenta (`bi_dim_account`).
- **Para qué sirve:** RF-BIA-097: Reportes de calidad de datos (domicilios incompletos, cuentas sin datos, medidores duplicados, servicios duplicados). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «accounts:read».
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de dimensión cuenta (`bi_dim_account`).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2059 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-78)

<a id="API-BIA-79"></a>
#### API-BIA-79 · `GET /api/v1/ext/accounts/{id}/balance`

- **Qué hace:** Saldo total, vencido, a vencer, saldo a favor, en proceso, por servicio, asOf (RF-BIA-095) Consulta «balance» de un registro de foto de saldos por corte (`bi_snap_balance`).
- **Para qué sirve:** RF-BIA-095: Reportes "a una fecha" (as-of) para saldos, deuda, cartera, stock y anticipos con fecha efectiva y, opcionalmente, "según lo registrado hasta" (bitemporal).
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «ledger:read».
- **Recibe:** en la ruta `id`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: el registro de PaginaExterna (`PaginaExterna`).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2060 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-79)

<a id="API-BIA-80"></a>
#### API-BIA-80 · `GET /api/v1/ext/accounts/{id}/ledger-entries`

- **Qué hace:** Movimientos del auxiliar con fecha efectiva y de registro. Consulta «ledger-entries» de un registro de `ledger-entries`.
- **Para qué sirve:** RF-BIA-095: Reportes "a una fecha" (as-of) para saldos, deuda, cartera, stock y anticipos con fecha efectiva y, opcionalmente, "según lo registrado hasta" (bitemporal). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «ledger:read».
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2061 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-80)

<a id="API-BIA-81"></a>
#### API-BIA-81 · `GET /api/v1/ext/premises`

- **Qué hace:** Inmuebles y puntos de prestación (localidad, barrio, coordenadas redondeadas salvo pii:read) Consulta `premises`.
- **Para qué sirve:** RF-BIA-073: Scopes por recurso y acción; restricción por campo (minimización); scope pii:read separado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «accounts:read».
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2062 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-81)

<a id="API-BIA-82"></a>
#### API-BIA-82 · `GET /api/v1/ext/contracts`

- **Qué hace:** Servicios contratados/conexiones: servicio, plan, categoría, estado canónico, alta/baja, medido, prepago. Consulta dimensión contrato (`bi_dim_contract`).
- **Para qué sirve:** RF-BIA-064: Historización de dimensiones (categoría, zona, plan, estado) con vigencia para analizar "como era" y "como es". *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «contracts:read».
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: el registro de PaginaExterna (`PaginaExterna`).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2063 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-82)

<a id="API-BIA-83"></a>
#### API-BIA-83 · `GET /api/v1/ext/contracts/{id}`

- **Qué hace:** Detalle con historial de estados y equipos en comodato (sin series si no erp.catalog:read) Obtiene el detalle de un registro de dimensión contrato (`bi_dim_contract`).
- **Para qué sirve:** RF-BIA-064: Historización de dimensiones (categoría, zona, plan, estado) con vigencia para analizar "como era" y "como es". *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «contracts:read».
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de dimensión contrato (`bi_dim_contract`).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2064 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-83)

<a id="API-BIA-84"></a>
#### API-BIA-84 · `GET /api/v1/ext/catalog/services`

- **Qué hace:** Servicios habilitados del tenant. Consulta dimensión servicio (`bi_dim_service`).
- **Para qué sirve:** RF-BIA-018: Habilitar/ocultar reportes de sistema por tenant y renombrarlos vía diccionario. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «contracts:read».
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: el registro de PaginaExterna (`PaginaExterna`).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2065 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-84)

<a id="API-BIA-85"></a>
#### API-BIA-85 · `GET /api/v1/ext/catalog/plans`

- **Qué hace:** Planes y versiones vigentes. Consulta dimensión plan (`bi_dim_plan`).
- **Para qué sirve:** RF-BIA-064: Historización de dimensiones (categoría, zona, plan, estado) con vigencia para analizar "como era" y "como es". *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «contracts:read».
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: el registro de PaginaExterna (`PaginaExterna`).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2066 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-85)

<a id="API-BIA-86"></a>
#### API-BIA-86 · `GET /api/v1/ext/catalog/categories`

- **Qué hace:** Categorías tarifarias. Consulta `categories`.
- **Para qué sirve:** RF-BIA-089: Datos abiertos: publicación de datasets agregados (cantidad de usuarios por servicio/categoría, tarifas vigentes, indicadores de calidad de servicio y atención) en landing con licencia y formato CSV/JSON. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «contracts:read».
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2067 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-86)

<a id="API-BIA-87"></a>
#### API-BIA-87 · `GET /api/v1/ext/catalog/tariffs`

- **Qué hace:** Cuadros tarifarios vigentes a fecha ?at= (datos públicos de REP-TAR-001) Consulta `tariffs`.
- **Para qué sirve:** RF-BIA-089: Datos abiertos: publicación de datasets agregados (cantidad de usuarios por servicio/categoría, tarifas vigentes, indicadores de calidad de servicio y atención) en landing con licencia y formato CSV/JSON. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «contracts:read».
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2068 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-87)

<a id="API-BIA-88"></a>
#### API-BIA-88 · `GET /api/v1/ext/meters`

- **Qué hace:** Medidores: número, tipo, estado, punto, telemedido. Consulta `meters`.
- **Para qué sirve:** RF-BIA-097: Reportes de calidad de datos (domicilios incompletos, cuentas sin datos, medidores duplicados, servicios duplicados). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «consumption:read».
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2069 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-88)

<a id="API-BIA-89"></a>
#### API-BIA-89 · `GET /api/v1/ext/readings`

- **Qué hace:** Lecturas validadas por período. Consulta hecho lectura (`bi_fact_reading`).
- **Para qué sirve:** RF-BIA-094: Tipos de fecha seleccionables por reporte (emisión, vencimiento 1/2/3, período facturado, lectura, registración, pago, recibo, acreditación, contable). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «consumption:read».
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: el registro de PaginaExterna (`PaginaExterna`).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2070 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-89)

<a id="API-BIA-90"></a>
#### API-BIA-90 · `GET /api/v1/ext/consumptions`

- **Qué hace:** Consumos aprobados: período, cantidad, unidad, estimado, canal. Consulta hecho consumo (`bi_fact_consumption`).
- **Para qué sirve:** RF-BIA-043: Ciclo de reporte personalizado: borrador → en revisión → publicado → obsoleto, con aprobación de bia.disenador.publicar y auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «consumption:read».
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: el registro de PaginaExterna (`PaginaExterna`).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2071 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-90)

<a id="API-BIA-91"></a>
#### API-BIA-91 · `GET /api/v1/ext/invoices`

- **Qué hace:** Comprobantes: tipo, letra, PV, número, fechas, cuenta, totales, estado, CAE. Consulta hecho factura (`bi_fact_invoice`).
- **Para qué sirve:** RF-BIA-087: Inventario publicado de datos disponibles, restricciones y significado de importes, fechas, zonas horarias y estados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «billing:read».
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: el registro de PaginaExterna (`PaginaExterna`).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2072 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-91)

<a id="API-BIA-92"></a>
#### API-BIA-92 · `GET /api/v1/ext/invoices/{id}`

- **Qué hace:** Detalle con líneas, impuestos, vencimientos, imputaciones resumidas. Obtiene el detalle de un registro de hecho factura (`bi_fact_invoice`).
- **Para qué sirve:** RF-BIA-094: Tipos de fecha seleccionables por reporte (emisión, vencimiento 1/2/3, período facturado, lectura, registración, pago, recibo, acreditación, contable). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «billing:read».
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de hecho factura (`bi_fact_invoice`).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2073 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-92)

<a id="API-BIA-93"></a>
#### API-BIA-93 · `GET /api/v1/ext/invoices/{id}/pdf`

- **Qué hace:** 302 a URL firmada del PDF (peso 5) Descarga un archivo de `pdf`.
- **Para qué sirve:** RF-BIA-082: Exportaciones masivas autorizadas (/exports) con estado, vencimiento y descarga firmada (NDJSON, CSV, Parquet opcional). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «billing:read».
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un archivo (application/pdf).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2074 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-93)

<a id="API-BIA-94"></a>
#### API-BIA-94 · `GET /api/v1/ext/payments`

- **Qué hace:** Pagos confirmados: canal, ente, fechas de pago/confirmación/acreditación, importe, estado. Consulta hecho cobro (`bi_fact_payment`).
- **Para qué sirve:** RF-BIA-087: Inventario publicado de datos disponibles, restricciones y significado de importes, fechas, zonas horarias y estados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «collections:read».
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: el registro de PaginaExterna (`PaginaExterna`).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2075 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-94)

<a id="API-BIA-95"></a>
#### API-BIA-95 · `GET /api/v1/ext/allocations`

- **Qué hace:** Imputaciones pago ↔ obligación. Consulta hecho imputación (`bi_fact_allocation`).
- **Para qué sirve:** RF-BIA-094: Tipos de fecha seleccionables por reporte (emisión, vencimiento 1/2/3, período facturado, lectura, registración, pago, recibo, acreditación, contable). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «collections:read».
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: el registro de PaginaExterna (`PaginaExterna`).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2076 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-95)

<a id="API-BIA-96"></a>
#### API-BIA-96 · `GET /api/v1/ext/payment-channels`

- **Qué hace:** Canales y entes habilitados. Consulta `payment-channels`.
- **Para qué sirve:** RF-BIA-018: Habilitar/ocultar reportes de sistema por tenant y renombrarlos vía diccionario. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «collections:read».
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2077 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-96)

<a id="API-BIA-97"></a>
#### API-BIA-97 · `GET /api/v1/ext/aging`

- **Qué hace:** Antigüedad de saldos por cuenta y servicio a ?asOf= (tramos de REP-COB-002) Consulta `aging`.
- **Para qué sirve:** RF-BIA-097: Reportes de calidad de datos (domicilios incompletos, cuentas sin datos, medidores duplicados, servicios duplicados). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «ledger:read».
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2078 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-97)

<a id="API-BIA-98"></a>
#### API-BIA-98 · `GET /api/v1/ext/arrears-cases`

- **Qué hace:** Notificaciones e instancias de mora por cuenta. Consulta `arrears-cases`.
- **Para qué sirve:** RF-BIA-019: Selección para acción: un reporte puede entregar al módulo dueño un selectionToken con IDs seleccionados para que el usuario inicie allí una acción (notificar, generar OT). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «arrears:read».
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2079 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-98)

<a id="API-BIA-99"></a>
#### API-BIA-99 · `GET /api/v1/ext/agreements`

- **Qué hace:** Convenios y cuotas. Consulta hecho convenio (`bi_fact_agreement`).
- **Para qué sirve:** RF-BIA-033: Cuotas de ejecución y exportación concurrente por usuario (PRM-BIA-010) y por tenant (PRM-BIA-011) con cola justa entre tenants. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «arrears:read».
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: el registro de PaginaExterna (`PaginaExterna`).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2080 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-99)

<a id="API-BIA-100"></a>
#### API-BIA-100 · `GET /api/v1/ext/interruptions`

- **Qué hace:** Casos de suspensión/corte/reconexión (estado, fechas) Consulta `interruptions`.
- **Para qué sirve:** RF-BIA-087: Inventario publicado de datos disponibles, restricciones y significado de importes, fechas, zonas horarias y estados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «arrears:read».
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2081 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-100)

<a id="API-BIA-101"></a>
#### API-BIA-101 · `GET /api/v1/ext/tickets`

- **Qué hace:** Solicitudes, reclamos y tickets: tipo, canal, área, prioridad, estado, SLA, tiempos (sin notas internas ni adjuntos) Consulta hecho caso de atención (`bi_fact_ticket`).
- **Para qué sirve:** RF-BIA-088: Escrituras limitadas vía API como solicitudes que procesa el módulo dueño (alta de persona/cuenta, reclamo), con Idempotency-Key. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «crm:read».
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: el registro de PaginaExterna (`PaginaExterna`).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2082 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-101)

<a id="API-BIA-102"></a>
#### API-BIA-102 · `GET /api/v1/ext/tickets/{id}`

- **Qué hace:** Detalle con historial de estados públicos. Obtiene el detalle de un registro de hecho caso de atención (`bi_fact_ticket`).
- **Para qué sirve:** RF-BIA-064: Historización de dimensiones (categoría, zona, plan, estado) con vigencia para analizar "como era" y "como es". *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «crm:read».
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de hecho caso de atención (`bi_fact_ticket`).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2083 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-102)

<a id="API-BIA-103"></a>
#### API-BIA-103 · `GET /api/v1/ext/work-orders`

- **Qué hace:** Órdenes de trabajo y visitas: tipo, operación, cuadrilla, fechas, resultado. Consulta hecho orden de trabajo (`bi_fact_workOrder`).
- **Para qué sirve:** RF-BIA-087: Inventario publicado de datos disponibles, restricciones y significado de importes, fechas, zonas horarias y estados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «field:read».
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: el registro de PaginaExterna (`PaginaExterna`).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2084 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-103)

<a id="API-BIA-104"></a>
#### API-BIA-104 · `GET /api/v1/ext/appointments`

- **Qué hace:** Turnos de agenda técnica y del turnero. Consulta `appointments`.
- **Para qué sirve:** RF-BIA-050: Tablero de responsables de área: casos sin asignar, turnos fallidos, tareas vencidas, conciliaciones pendientes, reglas sin aprobar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «field:read».
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2085 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-104)

<a id="API-BIA-105"></a>
#### API-BIA-105 · `GET /api/v1/ext/products`

- **Qué hace:** Productos/artículos y precios públicos. Consulta dimensión producto (`bi_dim_product`).
- **Para qué sirve:** RF-BIA-073: Scopes por recurso y acción; restricción por campo (minimización); scope pii:read separado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «erp.catalog:read».
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: el registro de PaginaExterna (`PaginaExterna`).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2086 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-105)

<a id="API-BIA-106"></a>
#### API-BIA-106 · `GET /api/v1/ext/stock`

- **Qué hace:** Existencias por depósito (reemplaza WS_KEYS.DEPOSITO_INSUMO/PRODUCTO → dataScope.warehouseIds) Consulta `stock`.
- **Para qué sirve:** RF-BIA-073: Scopes por recurso y acción; restricción por campo (minimización); scope pii:read separado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «erp.catalog:read».
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2087 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-106)

<a id="API-BIA-107"></a>
#### API-BIA-107 · `GET /api/v1/ext/suppliers`

- **Qué hace:** Proveedores (datos públicos: razón social, CUIT, rubro) Consulta dimensión proveedor (`bi_dim_supplier`).
- **Para qué sirve:** RF-BIA-073: Scopes por recurso y acción; restricción por campo (minimización); scope pii:read separado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «erp.catalog:read».
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: el registro de PaginaExterna (`PaginaExterna`).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2088 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-107)

<a id="API-BIA-108"></a>
#### API-BIA-108 · `GET /api/v1/ext/purchases`

- **Qué hace:** Documentos de compra (OC, recepciones, facturas) agregados. Consulta hecho compra (`bi_fact_purchase`).
- **Para qué sirve:** RF-BIA-077: OpenAPI 3.1 generado desde los esquemas Zod, publicado por tenant (sólo los recursos licenciados) y portal de documentación con ejemplos ficticios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «erp.finance:read».
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: el registro de PaginaExterna (`PaginaExterna`).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2089 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-108)

<a id="API-BIA-109"></a>
#### API-BIA-109 · `GET /api/v1/ext/treasury/summary`

- **Qué hace:** Disponibilidades, cartera y flujo agregados a ?asOf=. Consulta `summary`.
- **Para qué sirve:** RF-BIA-087: Inventario publicado de datos disponibles, restricciones y significado de importes, fechas, zonas horarias y estados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «erp.finance:read».
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2090 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-109)

<a id="API-BIA-110"></a>
#### API-BIA-110 · `GET /api/v1/ext/gl-accounts`

- **Qué hace:** Plan de cuentas (operativo y alternativos) Consulta dimensión cuenta contable (`bi_dim_glAccount`).
- **Para qué sirve:** RF-BIA-064: Historización de dimensiones (categoría, zona, plan, estado) con vigencia para analizar "como era" y "como es". *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «accounting:read».
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: el registro de PaginaExterna (`PaginaExterna`).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2091 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-110)

<a id="API-BIA-111"></a>
#### API-BIA-111 · `GET /api/v1/ext/journal-entries`

- **Qué hace:** Asientos posted con renglones. Consulta `journal-entries`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «accounting:read».
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2092 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-111)

<a id="API-BIA-112"></a>
#### API-BIA-112 · `GET /api/v1/ext/trial-balance`

- **Qué hace:** Sumas y saldos por ejercicio/rango/plan (REP-CON-004) Consulta `trial-balance`.
- **Para qué sirve:** RF-BIA-064: Historización de dimensiones (categoría, zona, plan, estado) con vigencia para analizar "como era" y "como es". *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «accounting:read».
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2093 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-112)

<a id="API-BIA-113"></a>
#### API-BIA-113 · `GET /api/v1/ext/members`

- **Qué hace:** Asociados: número, estado, ingreso/egreso, categoría. Consulta hecho asociado (`bi_fact_member`).
- **Para qué sirve:** RF-BIA-089: Datos abiertos: publicación de datasets agregados (cantidad de usuarios por servicio/categoría, tarifas vigentes, indicadores de calidad de servicio y atención) en landing con licencia y formato CSV/JSON. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «institutional:read».
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: el registro de PaginaExterna (`PaginaExterna`).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2094 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-113)

<a id="API-BIA-114"></a>
#### API-BIA-114 · `GET /api/v1/ext/capital-summary`

- **Qué hace:** Resumen de capital social a ?asOf= (REP-INS-005) Consulta `capital-summary`.
- **Para qué sirve:** RF-BIA-080: Cada respuesta informa asOf (fecha de corte/frescura) y source (operational/analytical). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «institutional:read».
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2095 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-114)

<a id="API-BIA-115"></a>
#### API-BIA-115 · `GET /api/v1/ext/assemblies`

- **Qué hace:** Asambleas, quórum y resultados agregados (sin votos individuales) Consulta `assemblies`.
- **Para qué sirve:** RF-BIA-089: Datos abiertos: publicación de datasets agregados (cantidad de usuarios por servicio/categoría, tarifas vigentes, indicadores de calidad de servicio y atención) en landing con licencia y formato CSV/JSON. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «institutional:read».
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2096 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-115)

<a id="API-BIA-116"></a>
#### API-BIA-116 · `GET /api/v1/ext/payroll/summary`

- **Qué hace:** Costo laboral y dotación agregados por centro y período (nunca individuales) Consulta `summary`.
- **Para qué sirve:** RF-BIA-089: Datos abiertos: publicación de datasets agregados (cantidad de usuarios por servicio/categoría, tarifas vigentes, indicadores de calidad de servicio y atención) en landing con licencia y formato CSV/JSON. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «payroll:read».
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2097 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-116)

<a id="API-BIA-117"></a>
#### API-BIA-117 · `GET /api/v1/ext/metrics`

- **Qué hace:** Catálogo de indicadores certificados con definición. Consulta `metrics`.
- **Para qué sirve:** RF-BIA-047: Certificación y versionado de indicadores; los snapshots guardan la versión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «metrics:read».
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: el registro de PaginaExterna (`PaginaExterna`).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2098 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-117)

<a id="API-BIA-118"></a>
#### API-BIA-118 · `GET /api/v1/ext/metrics/{code}/values`

- **Qué hace:** Valores/snapshots ?period=&from=&to=&dims=. Consulta «values» de un registro de `values`.
- **Para qué sirve:** RF-BIA-054: Tendencias con snapshots diarios y de cierre mensual. · RF-BIA-047: Certificación y versionado de indicadores; los snapshots guardan la versión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «metrics:read».
- **Recibe:** en la ruta `code`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2099 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-118)

<a id="API-BIA-119"></a>
#### API-BIA-119 · `GET /api/v1/ext/datasets`

- **Qué hace:** Datasets expuestos a API con diccionario. Consulta datasets certificados (`analyticsDatasets`).
- **Para qué sirve:** RF-BIA-089: Datos abiertos: publicación de datasets agregados (cantidad de usuarios por servicio/categoría, tarifas vigentes, indicadores de calidad de servicio y atención) en landing con licencia y formato CSV/JSON. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «datasets:read».
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: el registro de PaginaExterna (`PaginaExterna`).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2100 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-119)

<a id="API-BIA-120"></a>
#### API-BIA-120 · `GET /api/v1/ext/datasets/{code}/rows`

- **Qué hace:** Filas del dataset (feed para Power BI/Excel, peso 2); ?format=json/csv. Consulta «rows» de un registro de `rows`.
- **Para qué sirve:** RF-BIA-102: Conector para herramientas BI (Power BI, Excel, Looker Studio) usando API key de sólo lectura sobre /datasets y feeds CSV paginados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «datasets:read».
- **Recibe:** en la ruta `code`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2101 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-120)

<a id="API-BIA-121"></a>
#### API-BIA-121 · `POST /api/v1/ext/exports`

- **Qué hace:** Crea exportación masiva { resource/datasetCode, filters, format: ndjson/csv/parquet, asOf } → 202. Registra un nuevo elemento u operación en archivos exportados (`reportExports`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-BIA-082: Exportaciones masivas autorizadas (/exports) con estado, vencimiento y descarga firmada (NDJSON, CSV, Parquet opcional). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «exports:write».
- **Recibe:** los datos de archivos exportados (`reportExports`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2102 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-121)

<a id="API-BIA-122"></a>
#### API-BIA-122 · `GET /api/v1/ext/exports/{id}`

- **Qué hace:** Estado, partes, checksums, vencimiento. Obtiene el detalle de un registro de archivos exportados (`reportExports`).
- **Para qué sirve:** RF-BIA-032: Checksum SHA-256 y tamaño de cada archivo exportado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «exports:write».
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de archivos exportados (`reportExports`).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2103 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-122)

<a id="API-BIA-123"></a>
#### API-BIA-123 · `GET /api/v1/ext/exports/{id}/parts/{n}`

- **Qué hace:** 302 a URL firmada de la parte. Obtiene el detalle de un registro de `parts`.
- **Para qué sirve:** RF-BIA-082: Exportaciones masivas autorizadas (/exports) con estado, vencimiento y descarga firmada (NDJSON, CSV, Parquet opcional). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «exports:write».
- **Recibe:** en la ruta `id`, `n`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2104 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-123)

<a id="API-BIA-124"></a>
#### API-BIA-124 · `GET /api/v1/ext/webhooks/subscriptions`

- **Qué hace:** Listar/crear suscripciones propias (secreto devuelto una vez) Consulta suscripciones de webhooks salientes (`extWebhookSubscriptions`).
- **Para qué sirve:** RF-BIA-083: Webhooks salientes opcionales firmados (HMAC-SHA256 con timestamp), reintentos con backoff, cola de no entregados, reenvío manual y prueba. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «webhooks:manage».
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: el registro de PaginaExterna (`PaginaExterna`).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2105 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-124)

<a id="API-BIA-124-b"></a>
#### API-BIA-124-b · `POST /api/v1/ext/webhooks/subscriptions`

- **Qué hace:** Listar/crear suscripciones propias (secreto devuelto una vez) Da de alta un registro de suscripciones de webhooks salientes (`extWebhookSubscriptions`).
- **Para qué sirve:** RF-BIA-083: Webhooks salientes opcionales firmados (HMAC-SHA256 con timestamp), reintentos con backoff, cola de no entregados, reenvío manual y prueba. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «webhooks:manage».
- **Recibe:** los datos de suscripciones de webhooks salientes (`extWebhookSubscriptions`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de suscripciones de webhooks salientes (`extWebhookSubscriptions`).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2105 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-124-b)

<a id="API-BIA-125-b"></a>
#### API-BIA-125-b · `DELETE /api/v1/ext/webhooks/subscriptions/{id}`

- **Qué hace:** Pausar, reanudar, cambiar eventos/URL, rotar secreto, eliminar. Elimina o da de baja un registro de suscripciones de webhooks salientes (`extWebhookSubscriptions`).
- **Para qué sirve:** RF-BIA-083: Webhooks salientes opcionales firmados (HMAC-SHA256 con timestamp), reintentos con backoff, cola de no entregados, reenvío manual y prueba. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «webhooks:manage».
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2106 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-125-b)

<a id="API-BIA-125"></a>
#### API-BIA-125 · `PATCH /api/v1/ext/webhooks/subscriptions/{id}`

- **Qué hace:** Pausar, reanudar, cambiar eventos/URL, rotar secreto, eliminar. Modifica algunos campos de un registro de suscripciones de webhooks salientes (`extWebhookSubscriptions`) (solo los enviados).
- **Para qué sirve:** RF-BIA-083: Webhooks salientes opcionales firmados (HMAC-SHA256 con timestamp), reintentos con backoff, cola de no entregados, reenvío manual y prueba. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «webhooks:manage».
- **Recibe:** en la ruta `id`; solo los campos a cambiar de suscripciones de webhooks salientes (`extWebhookSubscriptions`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de suscripciones de webhooks salientes (`extWebhookSubscriptions`).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2106 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-125)

<a id="API-BIA-126"></a>
#### API-BIA-126 · `POST /api/v1/ext/webhooks/subscriptions/{id}/test`

- **Qué hace:** Envía evento ping firmado. Prueba un registro de suscripciones de webhooks salientes (`extWebhookSubscriptions`).
- **Para qué sirve:** RF-BIA-083: Webhooks salientes opcionales firmados (HMAC-SHA256 con timestamp), reintentos con backoff, cola de no entregados, reenvío manual y prueba. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «webhooks:manage».
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2107 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-126)

<a id="API-BIA-127"></a>
#### API-BIA-127 · `GET /api/v1/ext/webhooks/deliveries`

- **Qué hace:** Entregas propias y estado. Consulta entregas programadas (`reportDeliveries`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «webhooks:manage».
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: el registro de PaginaExterna (`PaginaExterna`).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2108 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-127)

<a id="API-BIA-128"></a>
#### API-BIA-128 · `POST /api/v1/ext/webhooks/deliveries/{id}/redeliver`

- **Qué hace:** Reenvío de una entrega dead o fallida. Reentrega un registro de entregas programadas (`reportDeliveries`).
- **Para qué sirve:** RF-BIA-083: Webhooks salientes opcionales firmados (HMAC-SHA256 con timestamp), reintentos con backoff, cola de no entregados, reenvío manual y prueba. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «webhooks:manage».
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2109 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-128)

<a id="API-BIA-129"></a>
#### API-BIA-129 · `GET /api/v1/ext/webhooks/event-types`

- **Qué hace:** Catálogo de eventos públicos (§12.3) con esquema. Consulta `event-types`.
- **Para qué sirve:** RF-BIA-077: OpenAPI 3.1 generado desde los esquemas Zod, publicado por tenant (sólo los recursos licenciados) y portal de documentación con ejemplos ficticios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); permiso `bia.apis.consumir`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: el registro de PaginaExterna (`PaginaExterna`).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2110 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-129)

<a id="API-BIA-130"></a>
#### API-BIA-130 · `POST /api/v1/ext/requests/persons`

- **Qué hace:** Solicitud de alta/modificación de persona (la procesa CRM con su circuito) → 202 con requestId. Registra un nuevo elemento u operación en dimensión persona (`bi_dim_person`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-BIA-088: Escrituras limitadas vía API como solicitudes que procesa el módulo dueño (alta de persona/cuenta, reclamo), con Idempotency-Key. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «requests:write».
- **Recibe:** los datos de dimensión persona (`bi_dim_person`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2111 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-130)

<a id="API-BIA-131"></a>
#### API-BIA-131 · `POST /api/v1/ext/requests/accounts`

- **Qué hace:** Solicitud de alta de cuenta/servicio (ex RegistrarCuenta, PutCategoria) Da de alta un registro de dimensión cuenta (`bi_dim_account`).
- **Para qué sirve:** RF-BIA-088: Escrituras limitadas vía API como solicitudes que procesa el módulo dueño (alta de persona/cuenta, reclamo), con Idempotency-Key. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «requests:write».
- **Recibe:** los datos de dimensión cuenta (`bi_dim_account`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de dimensión cuenta (`bi_dim_account`).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2112 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-131)

<a id="API-BIA-132"></a>
#### API-BIA-132 · `POST /api/v1/ext/requests/tickets`

- **Qué hace:** Alta de reclamo o consulta (canal api) Da de alta un registro de hecho caso de atención (`bi_fact_ticket`).
- **Para qué sirve:** RF-BIA-088: Escrituras limitadas vía API como solicitudes que procesa el módulo dueño (alta de persona/cuenta, reclamo), con Idempotency-Key. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «requests:write».
- **Recibe:** los datos de hecho caso de atención (`bi_fact_ticket`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de hecho caso de atención (`bi_fact_ticket`).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2113 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-132)

<a id="API-BIA-133"></a>
#### API-BIA-133 · `GET /api/v1/ext/requests/{id}`

- **Qué hace:** Estado de la solicitud (received, inReview, accepted, rejected, processed) con resultado. Obtiene el detalle de un registro de `requests`.
- **Para qué sirve:** RF-BIA-088: Escrituras limitadas vía API como solicitudes que procesa el módulo dueño (alta de persona/cuenta, reclamo), con Idempotency-Key. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); acceso según el anexo: «requests:write».
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O11 · **Fuente:** T10 §11.2 API pública para terceros `/api/v1/ext`, línea 2114 · [Ver en Swagger](../18-swagger/index.html?api=t10-bia-api-externa#/API%20p%C3%BAblica%20para%20terceros%20%60%2Fapi%2Fv1%2Fext%60/API-BIA-133)
