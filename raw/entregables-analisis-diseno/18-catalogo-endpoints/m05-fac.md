# Catálogo de endpoints · M05 · Facturación: ciclos, lotes y comprobantes

Parte del [catálogo de endpoints](../18-catalogo-endpoints.md) (artefacto 7.1). Generado el 05-11-2026 con `_trabajo/gen_18_catalogo_endpoints.py` a partir de `18-openapi/`; no se edita a mano.

## Para qué sirve esta API

Convertir las cantidades y cargos aprobados por los módulos de medición (M03) y tarifas (M04) en comprobantes emitidos sin duplicación, controlados y trazables, para cada cooperativa (tenant) y cada uno de sus servicios. El módulo:

1. organiza la facturación en ciclos con fechas de corte y universos de clientes propios por servicio;
2. ejecuta lotes batch con un universo congelado y versionado, que pasan por estados explícitos: preparar, prefacturar, revisar excepciones, aprobar, emitir, autorizar, distribuir y cerrar el ciclo con un acta;
3. emite en modalidad separada (un comprobante por servicio, FAC-002) o agrupada (un comprobante con varios servicios mediante un grupo de facturación, BASE §103), con el detalle, el saldo y las protecciones de cada servicio preservados;
4. administra tipos de comprobante y letras, puntos de venta, talonarios y numeración correlativa, hasta cuatro vencimientos con su trama de recargos, bloqueos, anulaciones, notas de crédito y débito y reversiones;
5. ofrece los procesos masivos de mantenimiento que ProCoop resuelve hoy (recategorización, retroactivos, modificación masiva, facturación de cuotas y de terceros, replicar comprobante, refacturación puntual, factura manual);
6. produce la representación del comprobante (diseño, gráfico de consumo, talones, código de barras con motor de formatos configurable, PDF con QR fiscal) y la distribuye por papel con reparto (MER-008), email, WhatsApp, app y portal, registrando el resultado de cada envío.

Detalle completo en el anexo M05, sección 1. Contrato navegable: [Swagger](../18-swagger/index.html?api=m05-fac).

| Dato | Valor |
|---|---|
| Endpoints | 190 |
| Por método | DELETE 1, GET 82, PATCH 21, POST 81, PUT 5 |
| Grupos funcionales | 6 |
| Con requisito citado en el anexo | 4 |
| Con requisito inferido (a confirmar) | 186 |
| Sin requisito identificable | 0 |

## Grupos funcionales

| Grupo | Endpoints | Qué agrupa (primeros endpoints) |
|---|---|---|
| [Configuración](#grupo-1) | 81 | Listar ciclos.; Crear ciclo (borrador).; Editar borrador o vigencia.… |
| [Lotes y excepciones](#grupo-2) | 31 | Listar lotes.; Crear lote draft (ciclo, adHoc, simulation).; Detalle con contadores, fases y progreso.… |
| [Comprobantes](#grupo-3) | 28 | Buscar comprobantes.; Detalle completo.; Decodificar código de barras y devolver el documento.… |
| [Operaciones masivas, cargos e importaciones](#grupo-4) | 17 | Crear operación.; Simulación (202).; Antes/después por objetivo.… |
| [Distribución, talones y cierre](#grupo-5) | 24 | Seguimiento con conteos.; Crear corrida de distribución (lote o selección).; Entregas por estado (destino enmascarado).… |
| [Socio, público y externa](#grupo-6) | 9 | Comprobantes de las cuentas autorizadas del usuario (solo…; Detalle (verifica propiedad; si no, 404).; PDF con URL firmada de corta vida.… |

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

## Configuración

81 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-FAC-001](#API-FAC-001) | GET | `/api/admin/fac/cycles` | Listar ciclos. |
| [API-FAC-002](#API-FAC-002) | POST | `/api/admin/fac/cycles` | Crear ciclo (borrador). |
| [API-FAC-003](#API-FAC-003) | PATCH | `/api/admin/fac/cycles/{id}` | Editar borrador o vigencia. |
| [API-FAC-004](#API-FAC-004) | POST | `/api/admin/fac/cycles/{id}/publish` | Publicar (valida solapamientos). |
| [API-FAC-005](#API-FAC-005) | GET | `/api/admin/fac/cycles/{id}/calendar` | Vista previa de fechas resueltas. |
| [API-FAC-006](#API-FAC-006) | GET | `/api/admin/fac/universes` | ABM de universos. |
| [API-FAC-006-b](#API-FAC-006-b) | POST | `/api/admin/fac/universes` | ABM de universos. |
| [API-FAC-006-c](#API-FAC-006-c) | GET | `/api/admin/fac/universes/{id}` | ABM de universos. |
| [API-FAC-006-d](#API-FAC-006-d) | PATCH | `/api/admin/fac/universes/{id}` | ABM de universos. |
| [API-FAC-007](#API-FAC-007) | GET | `/api/admin/fac/universes/{id}/count` | Conteo y muestra de miembros según criterios. |
| [API-FAC-008](#API-FAC-008) | POST | `/api/admin/fac/universes/{id}/members:import` | Importar lista explícita. |
| [API-FAC-009](#API-FAC-009) | GET | `/api/admin/fac/templates` | ABM de plantillas de corrida. |
| [API-FAC-009-b](#API-FAC-009-b) | POST | `/api/admin/fac/templates` | ABM de plantillas de corrida. |
| [API-FAC-009-c](#API-FAC-009-c) | GET | `/api/admin/fac/templates/{id}` | ABM de plantillas de corrida. |
| [API-FAC-009-d](#API-FAC-009-d) | PATCH | `/api/admin/fac/templates/{id}` | ABM de plantillas de corrida. |
| [API-FAC-010](#API-FAC-010) | POST | `/api/admin/fac/templates/{id}/publish` | Publicar versión. |
| [API-FAC-011](#API-FAC-011) | GET | `/api/admin/fac/billing-holds` | Marcas "no facturar". Reemplazado por la API de blocks de M01 (CTR-DAT-36); queda solo GET de lectura para la preparación del lote. |
| [API-FAC-011-b](#API-FAC-011-b) | GET | `/api/admin/fac/billing-holds/{id}` | Marcas "no facturar". Reemplazado por la API de blocks de M01 (CTR-DAT-36); queda solo GET de lectura para la preparación del lote. |
| [API-FAC-012](#API-FAC-012) | GET | `/api/admin/fac/voucher-types` | Tipos de comprobante. |
| [API-FAC-012-b](#API-FAC-012-b) | POST | `/api/admin/fac/voucher-types` | Tipos de comprobante. |
| [API-FAC-012-c](#API-FAC-012-c) | GET | `/api/admin/fac/voucher-types/{id}` | Tipos de comprobante. |
| [API-FAC-012-d](#API-FAC-012-d) | PATCH | `/api/admin/fac/voucher-types/{id}` | Tipos de comprobante. |
| [API-FAC-013](#API-FAC-013) | GET | `/api/admin/fac/voucher-matrix` | Matriz por condición fiscal (PUT publica nueva versión). |
| [API-FAC-013-b](#API-FAC-013-b) | PUT | `/api/admin/fac/voucher-matrix` | Matriz por condición fiscal (PUT publica nueva versión). |
| [API-FAC-014](#API-FAC-014) | GET | `/api/admin/fac/voucher-matrix/resolve` | Explica qué tipo, letra y PV se usaría. |
| [API-FAC-015](#API-FAC-015) | GET | `/api/admin/fac/points-of-sale` | Puntos de venta. Reemplazado por la API de puntos de venta de M06 (CTR-DAT-17); queda solo GET de lectura con ?legalEntityId=. |
| [API-FAC-015-b](#API-FAC-015-b) | GET | `/api/admin/fac/points-of-sale/{id}` | Puntos de venta. Reemplazado por la API de puntos de venta de M06 (CTR-DAT-17); queda solo GET de lectura con ?legalEntityId=. |
| [API-FAC-016](#API-FAC-016) | GET | `/api/admin/fac/number-sequences` | Numeradores (alta, bloqueo; el último número solo cambia con override auditado); cada numerador pertenece a una entidad jurídica (legalEn... |
| [API-FAC-016-b](#API-FAC-016-b) | POST | `/api/admin/fac/number-sequences` | Numeradores (alta, bloqueo; el último número solo cambia con override auditado); cada numerador pertenece a una entidad jurídica (legalEn... |
| [API-FAC-016-c](#API-FAC-016-c) | GET | `/api/admin/fac/number-sequences/{id}` | Numeradores (alta, bloqueo; el último número solo cambia con override auditado); cada numerador pertenece a una entidad jurídica (legalEn... |
| [API-FAC-016-d](#API-FAC-016-d) | PATCH | `/api/admin/fac/number-sequences/{id}` | Numeradores (alta, bloqueo; el último número solo cambia con override auditado); cada numerador pertenece a una entidad jurídica (legalEn... |
| [API-FAC-017](#API-FAC-017) | GET | `/api/admin/fac/billing-mode` | Política de modalidad. |
| [API-FAC-017-b](#API-FAC-017-b) | PUT | `/api/admin/fac/billing-mode` | Política de modalidad. |
| [API-FAC-018](#API-FAC-018) | GET | `/api/admin/fac/billing-groups` | Grupos de facturación. |
| [API-FAC-018-b](#API-FAC-018-b) | POST | `/api/admin/fac/billing-groups` | Grupos de facturación. |
| [API-FAC-018-c](#API-FAC-018-c) | GET | `/api/admin/fac/billing-groups/{id}` | Grupos de facturación. |
| [API-FAC-018-d](#API-FAC-018-d) | PATCH | `/api/admin/fac/billing-groups/{id}` | Grupos de facturación. |
| [API-FAC-019](#API-FAC-019) | POST | `/api/admin/fac/billing-groups/{id}/fiscal-validation` | Aprobar o rechazar validación fiscal. |
| [API-FAC-020](#API-FAC-020) | POST | `/api/admin/fac/billing-groups/{id}/dissolve` | Disolver desde un período. |
| [API-FAC-021](#API-FAC-021) | GET | `/api/admin/fac/due-date-schemes` | Tramas de vencimiento y recargo. |
| [API-FAC-021-b](#API-FAC-021-b) | POST | `/api/admin/fac/due-date-schemes` | Tramas de vencimiento y recargo. |
| [API-FAC-021-c](#API-FAC-021-c) | GET | `/api/admin/fac/due-date-schemes/{id}` | Tramas de vencimiento y recargo. |
| [API-FAC-021-d](#API-FAC-021-d) | PATCH | `/api/admin/fac/due-date-schemes/{id}` | Tramas de vencimiento y recargo. |
| [API-FAC-022](#API-FAC-022) | POST | `/api/admin/fac/due-date-schemes/{id}/simulate` | Simular recargos para un importe y fechas. |
| [API-FAC-024](#API-FAC-024) | GET | `/api/admin/fac/exception-reasons` | Motivos de excepción. |
| [API-FAC-024-b](#API-FAC-024-b) | POST | `/api/admin/fac/exception-reasons` | Motivos de excepción. |
| [API-FAC-024-c](#API-FAC-024-c) | GET | `/api/admin/fac/exception-reasons/{code}` | Motivos de excepción. |
| [API-FAC-024-d](#API-FAC-024-d) | PATCH | `/api/admin/fac/exception-reasons/{code}` | Motivos de excepción. |
| [API-FAC-025](#API-FAC-025) | GET | `/api/admin/fac/invoice-templates` | Diseños de comprobante: reglas de selección en M05; el diseño y sus versiones se guardan en T11 (documentTemplates/templateVersions, CTR-... |
| [API-FAC-025-b](#API-FAC-025-b) | POST | `/api/admin/fac/invoice-templates` | Diseños de comprobante: reglas de selección en M05; el diseño y sus versiones se guardan en T11 (documentTemplates/templateVersions, CTR-... |
| [API-FAC-025-c](#API-FAC-025-c) | GET | `/api/admin/fac/invoice-templates/{id}` | Diseños de comprobante: reglas de selección en M05; el diseño y sus versiones se guardan en T11 (documentTemplates/templateVersions, CTR-... |
| [API-FAC-025-d](#API-FAC-025-d) | PATCH | `/api/admin/fac/invoice-templates/{id}` | Diseños de comprobante: reglas de selección en M05; el diseño y sus versiones se guardan en T11 (documentTemplates/templateVersions, CTR-... |
| [API-FAC-026](#API-FAC-026) | POST | `/api/admin/fac/invoice-templates/{id}/preview` | PDF de prueba (datos ficticios o comprobante elegido). |
| [API-FAC-027](#API-FAC-027) | GET | `/api/admin/fac/consumption-chart-groups` | Grupos de gráfico. |
| [API-FAC-027-b](#API-FAC-027-b) | POST | `/api/admin/fac/consumption-chart-groups` | Grupos de gráfico. |
| [API-FAC-027-c](#API-FAC-027-c) | GET | `/api/admin/fac/consumption-chart-groups/{id}` | Grupos de gráfico. |
| [API-FAC-027-d](#API-FAC-027-d) | PATCH | `/api/admin/fac/consumption-chart-groups/{id}` | Grupos de gráfico. |
| [API-FAC-028](#API-FAC-028) | GET | `/api/admin/fac/line-orders` | Orden de renglones. |
| [API-FAC-028-b](#API-FAC-028-b) | POST | `/api/admin/fac/line-orders` | Orden de renglones. |
| [API-FAC-028-c](#API-FAC-028-c) | GET | `/api/admin/fac/line-orders/{id}` | Orden de renglones. |
| [API-FAC-028-d](#API-FAC-028-d) | PATCH | `/api/admin/fac/line-orders/{id}` | Orden de renglones. |
| [API-FAC-029](#API-FAC-029) | GET | `/api/admin/fac/barcode-formats` | Formatos de código de barras. |
| [API-FAC-029-b](#API-FAC-029-b) | POST | `/api/admin/fac/barcode-formats` | Formatos de código de barras. |
| [API-FAC-029-c](#API-FAC-029-c) | GET | `/api/admin/fac/barcode-formats/{id}` | Formatos de código de barras. |
| [API-FAC-029-d](#API-FAC-029-d) | PATCH | `/api/admin/fac/barcode-formats/{id}` | Formatos de código de barras. |
| [API-FAC-030](#API-FAC-030) | POST | `/api/admin/fac/barcode-formats/{id}/test` | Generar o decodificar un código de prueba; ejecuta vectores. |
| [API-FAC-031](#API-FAC-031) | POST | `/api/admin/fac/barcode-formats/{id}/publish` | Publicar (falla si un vector no pasa). |
| [API-FAC-032](#API-FAC-032) | GET | `/api/admin/fac/barcode-assignments` | Asignación de formatos a recaudadores y documentos. |
| [API-FAC-032-b](#API-FAC-032-b) | POST | `/api/admin/fac/barcode-assignments` | Asignación de formatos a recaudadores y documentos. |
| [API-FAC-032-c](#API-FAC-032-c) | GET | `/api/admin/fac/barcode-assignments/{id}` | Asignación de formatos a recaudadores y documentos. |
| [API-FAC-032-d](#API-FAC-032-d) | PATCH | `/api/admin/fac/barcode-assignments/{id}` | Asignación de formatos a recaudadores y documentos. |
| [API-FAC-033](#API-FAC-033) | GET | `/api/admin/fac/distribution-routes` | Rutas de reparto. |
| [API-FAC-033-b](#API-FAC-033-b) | POST | `/api/admin/fac/distribution-routes` | Rutas de reparto. |
| [API-FAC-033-c](#API-FAC-033-c) | GET | `/api/admin/fac/distribution-routes/{id}` | Rutas de reparto. |
| [API-FAC-033-d](#API-FAC-033-d) | PATCH | `/api/admin/fac/distribution-routes/{id}` | Rutas de reparto. |
| [API-FAC-034](#API-FAC-034) | GET | `/api/admin/fac/postal-carriers` | Correos y franqueo. |
| [API-FAC-034-b](#API-FAC-034-b) | POST | `/api/admin/fac/postal-carriers` | Correos y franqueo. |
| [API-FAC-034-c](#API-FAC-034-c) | GET | `/api/admin/fac/postal-carriers/{id}` | Correos y franqueo. |
| [API-FAC-034-d](#API-FAC-034-d) | PATCH | `/api/admin/fac/postal-carriers/{id}` | Correos y franqueo. |
| [API-FAC-035](#API-FAC-035) | GET | `/api/admin/fac/settings` | Parámetros del módulo (vía T04). |
| [API-FAC-035-b](#API-FAC-035-b) | PATCH | `/api/admin/fac/settings` | Parámetros del módulo (vía T04). |

<a id="API-FAC-001"></a>
#### API-FAC-001 · `GET /api/admin/fac/cycles`

- **Qué hace:** Listar ciclos. Lista, con filtros y paginación, los registros de ciclo de facturación por servicio y universo (`billingCycles`).
- **Para qué sirve:** RF-FAC-002: Permitir uno o más ciclos por servicio, cada uno con su universo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.ciclos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ciclo de facturación por servicio y universo (`billingCycles`) con `total`.
- **Pantallas:** PAN-FAC-02 (Ciclos de facturación).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1754 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-001)

<a id="API-FAC-002"></a>
#### API-FAC-002 · `POST /api/admin/fac/cycles`

- **Qué hace:** Crear ciclo (borrador). Da de alta un registro de ciclo de facturación por servicio y universo (`billingCycles`).
- **Para qué sirve:** RF-FAC-002: Permitir uno o más ciclos por servicio, cada uno con su universo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.ciclos.crear`.
- **Recibe:** los datos de ciclo de facturación por servicio y universo (`billingCycles`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de ciclo de facturación por servicio y universo (`billingCycles`).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1755 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-002)

<a id="API-FAC-003"></a>
#### API-FAC-003 · `PATCH /api/admin/fac/cycles/{id}`

- **Qué hace:** Editar borrador o vigencia. Modifica algunos campos de un registro de ciclo de facturación por servicio y universo (`billingCycles`) (solo los enviados).
- **Para qué sirve:** RF-FAC-002: Permitir uno o más ciclos por servicio, cada uno con su universo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.ciclos.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de ciclo de facturación por servicio y universo (`billingCycles`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de ciclo de facturación por servicio y universo (`billingCycles`).
- **Pantallas:** PAN-FAC-39 (Marcas no facturar).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1756 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-003)

<a id="API-FAC-004"></a>
#### API-FAC-004 · `POST /api/admin/fac/cycles/{id}/publish`

- **Qué hace:** Publicar (valida solapamientos). Publica un registro de ciclo de facturación por servicio y universo (`billingCycles`).
- **Para qué sirve:** RF-FAC-004: Controlar pertenencia y solapamientos: un contrato-servicio pertenece a un solo ciclo vigente por servicio en cada período; al publicar un ciclo o universo se informa y bloquea todo solapamiento. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.ciclos.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FAC-39 (Marcas no facturar).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1757 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-004)

<a id="API-FAC-005"></a>
#### API-FAC-005 · `GET /api/admin/fac/cycles/{id}/calendar`

- **Qué hace:** Vista previa de fechas resueltas. Consulta «calendar» de un registro de ciclo de facturación por servicio y universo (`billingCycles`).
- **Para qué sirve:** RF-FAC-002: Permitir uno o más ciclos por servicio, cada uno con su universo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.ciclos.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de ciclo de facturación por servicio y universo (`billingCycles`).
- **Pantallas:** PAN-FAC-02 (Ciclos de facturación).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1758 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-005)

<a id="API-FAC-006"></a>
#### API-FAC-006 · `GET /api/admin/fac/universes`

- **Qué hace:** ABM de universos. Lista, con filtros y paginación, los registros de criterio de pertenencia (`billingUniverses`).
- **Para qué sirve:** RF-FAC-004: Controlar pertenencia y solapamientos: un contrato-servicio pertenece a un solo ciclo vigente por servicio en cada período; al publicar un ciclo o universo se informa y bloquea todo solapamiento. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.universos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de criterio de pertenencia (`billingUniverses`) con `total`.
- **Pantallas:** PAN-FAC-03 (Universos y conjuntos).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1759 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-006)

<a id="API-FAC-006-b"></a>
#### API-FAC-006-b · `POST /api/admin/fac/universes`

- **Qué hace:** ABM de universos. Da de alta un registro de criterio de pertenencia (`billingUniverses`).
- **Para qué sirve:** RF-FAC-155: Crear lotes de distribución por lote de emisión o selección manual, por canal, con agrupación del envío por cuenta, por socio o por socio y teléfono, y envío en tandas configurables. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.universos.crear`.
- **Recibe:** los datos de criterio de pertenencia (`billingUniverses`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de criterio de pertenencia (`billingUniverses`).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1759 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-006-b)

<a id="API-FAC-006-c"></a>
#### API-FAC-006-c · `GET /api/admin/fac/universes/{id}`

- **Qué hace:** ABM de universos. Obtiene el detalle de un registro de criterio de pertenencia (`billingUniverses`).
- **Para qué sirve:** RF-FAC-004: Controlar pertenencia y solapamientos: un contrato-servicio pertenece a un solo ciclo vigente por servicio en cada período; al publicar un ciclo o universo se informa y bloquea todo solapamiento. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.universos.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de criterio de pertenencia (`billingUniverses`).
- **Pantallas:** PAN-FAC-03 (Universos y conjuntos).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1759 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-006-c)

<a id="API-FAC-006-d"></a>
#### API-FAC-006-d · `PATCH /api/admin/fac/universes/{id}`

- **Qué hace:** ABM de universos. Modifica algunos campos de un registro de criterio de pertenencia (`billingUniverses`) (solo los enviados).
- **Para qué sirve:** RF-FAC-155: Crear lotes de distribución por lote de emisión o selección manual, por canal, con agrupación del envío por cuenta, por socio o por socio y teléfono, y envío en tandas configurables. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.universos.crear`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de criterio de pertenencia (`billingUniverses`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de criterio de pertenencia (`billingUniverses`).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1759 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-006-d)

<a id="API-FAC-007"></a>
#### API-FAC-007 · `GET /api/admin/fac/universes/{id}/count`

- **Qué hace:** Conteo y muestra de miembros según criterios. Consulta «count» de un registro de criterio de pertenencia (`billingUniverses`).
- **Para qué sirve:** RF-FAC-004: Controlar pertenencia y solapamientos: un contrato-servicio pertenece a un solo ciclo vigente por servicio en cada período; al publicar un ciclo o universo se informa y bloquea todo solapamiento. · RF-FAC-043: Aprobar la emisión según rol con un resumen obligatorio: universo, aptos, excepciones por motivo, totales por servicio y concepto, variaciones, muestra revisada y advertencias; workflow T11 por umbral de importe total… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.universos.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de criterio de pertenencia (`billingUniverses`).
- **Pantallas:** PAN-FAC-03 (Universos y conjuntos).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1760 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-007)

<a id="API-FAC-008"></a>
#### API-FAC-008 · `POST /api/admin/fac/universes/{id}/members:import`

- **Qué hace:** Importar lista explícita. Registra «members:import» sobre un registro de criterio de pertenencia (`billingUniverses`).
- **Para qué sirve:** RF-FAC-003: Definir universos por criterios combinables: zona, sector y recorrido de lectura; ruta; conjunto de facturación; zona postal, empresa postal y localidad postal; categoría; plan; grupo de facturación; condición fiscal; altas… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.universos.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1761 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-008)

<a id="API-FAC-009"></a>
#### API-FAC-009 · `GET /api/admin/fac/templates`

- **Qué hace:** ABM de plantillas de corrida. Lista, con filtros y paginación, los registros de plantilla de corrida versionada (`billingTemplates`).
- **Para qué sirve:** RF-FAC-009: Mantener plantillas de corrida versionadas, separadas del tipo de factura comercial: servicios con período por servicio y rango de lecturas, filtros de universo, cuotas a incluir, reglas de vencimiento y próximo vencimiento, tipo… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.plantillas.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de plantilla de corrida versionada (`billingTemplates`) con `total`.
- **Pantallas:** PAN-FAC-04 (Plantillas de corrida).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1762 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-009)

<a id="API-FAC-009-b"></a>
#### API-FAC-009-b · `POST /api/admin/fac/templates`

- **Qué hace:** ABM de plantillas de corrida. Da de alta un registro de plantilla de corrida versionada (`billingTemplates`).
- **Para qué sirve:** RF-FAC-009: Mantener plantillas de corrida versionadas, separadas del tipo de factura comercial: servicios con período por servicio y rango de lecturas, filtros de universo, cuotas a incluir, reglas de vencimiento y próximo vencimiento, tipo… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.plantillas.editar`.
- **Recibe:** los datos de plantilla de corrida versionada (`billingTemplates`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de plantilla de corrida versionada (`billingTemplates`).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1762 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-009-b)

<a id="API-FAC-009-c"></a>
#### API-FAC-009-c · `GET /api/admin/fac/templates/{id}`

- **Qué hace:** ABM de plantillas de corrida. Obtiene el detalle de un registro de plantilla de corrida versionada (`billingTemplates`).
- **Para qué sirve:** RF-FAC-009: Mantener plantillas de corrida versionadas, separadas del tipo de factura comercial: servicios con período por servicio y rango de lecturas, filtros de universo, cuotas a incluir, reglas de vencimiento y próximo vencimiento, tipo… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.plantillas.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de plantilla de corrida versionada (`billingTemplates`).
- **Pantallas:** PAN-FAC-04 (Plantillas de corrida).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1762 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-009-c)

<a id="API-FAC-009-d"></a>
#### API-FAC-009-d · `PATCH /api/admin/fac/templates/{id}`

- **Qué hace:** ABM de plantillas de corrida. Modifica algunos campos de un registro de plantilla de corrida versionada (`billingTemplates`) (solo los enviados).
- **Para qué sirve:** RF-FAC-009: Mantener plantillas de corrida versionadas, separadas del tipo de factura comercial: servicios con período por servicio y rango de lecturas, filtros de universo, cuotas a incluir, reglas de vencimiento y próximo vencimiento, tipo… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.plantillas.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de plantilla de corrida versionada (`billingTemplates`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de plantilla de corrida versionada (`billingTemplates`).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1762 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-009-d)

<a id="API-FAC-010"></a>
#### API-FAC-010 · `POST /api/admin/fac/templates/{id}/publish`

- **Qué hace:** Publicar versión. Publica un registro de plantilla de corrida versionada (`billingTemplates`).
- **Para qué sirve:** RF-FAC-019: Preparar congela el universo: guarda la foto de la selección (cuentas, contratos, servicios, grupos), las cantidades (consumos aprobados con su id y versión), las versiones de reglas aplicables (tarifa, configuración publicada… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.plantillas.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1763 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-010)

<a id="API-FAC-011"></a>
#### API-FAC-011 · `GET /api/admin/fac/billing-holds`

- **Qué hace:** Marcas "no facturar". Reemplazado por la API de blocks de M01 (CTR-DAT-36); queda solo GET de lectura para la preparación del lote. Consulta `billing-holds`.
- **Para qué sirve:** RF-FAC-015: Validar la configuración del lote antes de preparar con todas las reglas RN-FAC-008 a RN-FAC-016. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.ciclos.editar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FAC-39 (Marcas no facturar).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1764 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-011)

<a id="API-FAC-011-b"></a>
#### API-FAC-011-b · `GET /api/admin/fac/billing-holds/{id}`

- **Qué hace:** Marcas "no facturar". Reemplazado por la API de blocks de M01 (CTR-DAT-36); queda solo GET de lectura para la preparación del lote. Obtiene el detalle de un registro de `billing-holds`.
- **Para qué sirve:** RF-FAC-015: Validar la configuración del lote antes de preparar con todas las reglas RN-FAC-008 a RN-FAC-016. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.ciclos.editar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FAC-39 (Marcas no facturar).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1764 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-011-b)

<a id="API-FAC-012"></a>
#### API-FAC-012 · `GET /api/admin/fac/voucher-types`

- **Qué hace:** Tipos de comprobante. Lista, con filtros y paginación, los registros de tipos de comprobante (`voucherTypes`).
- **Para qué sirve:** RF-FAC-095: Bloquear o desbloquear con cobro de intereses: en la misma operación se pide a M08 la emisión del comprobante de intereses (porcentaje y concepto configurables). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.tiposComprobante.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de tipos de comprobante (`voucherTypes`) con `total`.
- **Pantallas:** PAN-FAC-23 (Tipos de comprobante y matriz).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1765 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-012)

<a id="API-FAC-012-b"></a>
#### API-FAC-012-b · `POST /api/admin/fac/voucher-types`

- **Qué hace:** Tipos de comprobante. Da de alta un registro de tipos de comprobante (`voucherTypes`).
- **Para qué sirve:** RF-FAC-095: Bloquear o desbloquear con cobro de intereses: en la misma operación se pide a M08 la emisión del comprobante de intereses (porcentaje y concepto configurables). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.tiposComprobante.configurar`.
- **Recibe:** los datos de tipos de comprobante (`voucherTypes`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de tipos de comprobante (`voucherTypes`).
- **Pantallas:** PAN-FAC-23 (Tipos de comprobante y matriz).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1765 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-012-b)

<a id="API-FAC-012-c"></a>
#### API-FAC-012-c · `GET /api/admin/fac/voucher-types/{id}`

- **Qué hace:** Tipos de comprobante. Obtiene el detalle de un registro de tipos de comprobante (`voucherTypes`).
- **Para qué sirve:** RF-FAC-095: Bloquear o desbloquear con cobro de intereses: en la misma operación se pide a M08 la emisión del comprobante de intereses (porcentaje y concepto configurables). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.tiposComprobante.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de tipos de comprobante (`voucherTypes`).
- **Pantallas:** PAN-FAC-23 (Tipos de comprobante y matriz).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1765 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-012-c)

<a id="API-FAC-012-d"></a>
#### API-FAC-012-d · `PATCH /api/admin/fac/voucher-types/{id}`

- **Qué hace:** Tipos de comprobante. Modifica algunos campos de un registro de tipos de comprobante (`voucherTypes`) (solo los enviados).
- **Para qué sirve:** RF-FAC-095: Bloquear o desbloquear con cobro de intereses: en la misma operación se pide a M08 la emisión del comprobante de intereses (porcentaje y concepto configurables). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.tiposComprobante.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de tipos de comprobante (`voucherTypes`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de tipos de comprobante (`voucherTypes`).
- **Pantallas:** PAN-FAC-23 (Tipos de comprobante y matriz).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1765 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-012-d)

<a id="API-FAC-013"></a>
#### API-FAC-013 · `GET /api/admin/fac/voucher-matrix`

- **Qué hace:** Matriz por condición fiscal (PUT publica nueva versión). Consulta `voucher-matrix`.
- **Para qué sirve:** RF-FAC-078: Matriz de resolución por condición fiscal del receptor: comprobante por defecto de factura, ND y NC; factura y crédito de servicio público; versiones MiPyME (FCE) con umbral; ticket. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.tiposComprobante.configurar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FAC-23 (Tipos de comprobante y matriz).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1766 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-013)

<a id="API-FAC-013-b"></a>
#### API-FAC-013-b · `PUT /api/admin/fac/voucher-matrix`

- **Qué hace:** Matriz por condición fiscal (PUT publica nueva versión). Reemplaza o configura `voucher-matrix`.
- **Para qué sirve:** RF-FAC-078: Matriz de resolución por condición fiscal del receptor: comprobante por defecto de factura, ND y NC; factura y crédito de servicio público; versiones MiPyME (FCE) con umbral; ticket. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.tiposComprobante.configurar`.
- **Recibe:** un cuerpo JSON cuya estructura detalla el anexo; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FAC-23 (Tipos de comprobante y matriz).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1766 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-013-b)

<a id="API-FAC-014"></a>
#### API-FAC-014 · `GET /api/admin/fac/voucher-matrix/resolve`

- **Qué hace:** Explica qué tipo, letra y PV se usaría. Consulta `resolve`.
- **Para qué sirve:** RF-FAC-077: Catálogo de tipos de comprobante: código interno, código ARCA, descripción y abreviatura, letra como campo explícito (A, B, C, M, E, sin letra), clase (factura, ND, NC, liquidación de servicios públicos, ticket, interno, CVLP… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.comprobantes.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FAC-09 (Comprobantes), PAN-FAC-10 (Detalle de comprobante), PAN-FAC-38 (Comprobantes de administración pública).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1767 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-014)

<a id="API-FAC-015"></a>
#### API-FAC-015 · `GET /api/admin/fac/points-of-sale`

- **Qué hace:** Puntos de venta. Reemplazado por la API de puntos de venta de M06 (CTR-DAT-17); queda solo GET de lectura con ?legalEntityId=. Consulta `points-of-sale`.
- **Para qué sirve:** RF-FAC-177: Emitir por entidad jurídica (DEC-064, DEC-087): resolver legalEntityId por contrato o, si está vacío, por tenantServices.legalEntityId (M02), separar casos, comprobantes, talones y numeradores por entidad, y elegir punto de venta… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.puntosVenta.configurar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FAC-24 (Puntos de venta y numeradores).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1768 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-015)

<a id="API-FAC-015-b"></a>
#### API-FAC-015-b · `GET /api/admin/fac/points-of-sale/{id}`

- **Qué hace:** Puntos de venta. Reemplazado por la API de puntos de venta de M06 (CTR-DAT-17); queda solo GET de lectura con ?legalEntityId=. Obtiene el detalle de un registro de `points-of-sale`.
- **Para qué sirve:** RF-FAC-177: Emitir por entidad jurídica (DEC-064, DEC-087): resolver legalEntityId por contrato o, si está vacío, por tenantServices.legalEntityId (M02), separar casos, comprobantes, talones y numeradores por entidad, y elegir punto de venta… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.puntosVenta.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FAC-24 (Puntos de venta y numeradores).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1768 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-015-b)

<a id="API-FAC-016"></a>
#### API-FAC-016 · `GET /api/admin/fac/number-sequences`

- **Qué hace:** Numeradores (alta, bloqueo; el último número solo cambia con override auditado); cada numerador pertenece a una entidad jurídica (legalEn... Lista, con filtros y paginación, los registros de numeración fiscal por tipo (`numberSequences`).
- **Para qué sirve:** RF-FAC-177: Emitir por entidad jurídica (DEC-064, DEC-087): resolver legalEntityId por contrato o, si está vacío, por tenantServices.legalEntityId (M02), separar casos, comprobantes, talones y numeradores por entidad, y elegir punto de venta… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.numeracion.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de numeración fiscal por tipo (`numberSequences`) con `total`.
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1769 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-016)

<a id="API-FAC-016-b"></a>
#### API-FAC-016-b · `POST /api/admin/fac/number-sequences`

- **Qué hace:** Numeradores (alta, bloqueo; el último número solo cambia con override auditado); cada numerador pertenece a una entidad jurídica (legalEn... Da de alta un registro de numeración fiscal por tipo (`numberSequences`).
- **Para qué sirve:** RF-FAC-177: Emitir por entidad jurídica (DEC-064, DEC-087): resolver legalEntityId por contrato o, si está vacío, por tenantServices.legalEntityId (M02), separar casos, comprobantes, talones y numeradores por entidad, y elegir punto de venta… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.numeracion.configurar`.
- **Recibe:** los datos de numeración fiscal por tipo (`numberSequences`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de numeración fiscal por tipo (`numberSequences`).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1769 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-016-b)

<a id="API-FAC-016-c"></a>
#### API-FAC-016-c · `GET /api/admin/fac/number-sequences/{id}`

- **Qué hace:** Numeradores (alta, bloqueo; el último número solo cambia con override auditado); cada numerador pertenece a una entidad jurídica (legalEn... Obtiene el detalle de un registro de numeración fiscal por tipo (`numberSequences`).
- **Para qué sirve:** RF-FAC-177: Emitir por entidad jurídica (DEC-064, DEC-087): resolver legalEntityId por contrato o, si está vacío, por tenantServices.legalEntityId (M02), separar casos, comprobantes, talones y numeradores por entidad, y elegir punto de venta… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.numeracion.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de numeración fiscal por tipo (`numberSequences`).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1769 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-016-c)

<a id="API-FAC-016-d"></a>
#### API-FAC-016-d · `PATCH /api/admin/fac/number-sequences/{id}`

- **Qué hace:** Numeradores (alta, bloqueo; el último número solo cambia con override auditado); cada numerador pertenece a una entidad jurídica (legalEn... Modifica algunos campos de un registro de numeración fiscal por tipo (`numberSequences`) (solo los enviados).
- **Para qué sirve:** RF-FAC-177: Emitir por entidad jurídica (DEC-064, DEC-087): resolver legalEntityId por contrato o, si está vacío, por tenantServices.legalEntityId (M02), separar casos, comprobantes, talones y numeradores por entidad, y elegir punto de venta… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.numeracion.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de numeración fiscal por tipo (`numberSequences`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de numeración fiscal por tipo (`numberSequences`).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1769 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-016-d)

<a id="API-FAC-017"></a>
#### API-FAC-017 · `GET /api/admin/fac/billing-mode`

- **Qué hace:** Política de modalidad. Consulta `billing-mode`.
- **Para qué sirve:** RF-FAC-064: Configurar la modalidad por defecto del tenant (separada o agrupada) y excepciones por servicio, cuenta o titular, con vigencia desde un período. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.modalidad.configurar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FAC-26 (Modalidad de facturación).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1770 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-017)

<a id="API-FAC-017-b"></a>
#### API-FAC-017-b · `PUT /api/admin/fac/billing-mode`

- **Qué hace:** Política de modalidad. Reemplaza o configura `billing-mode`.
- **Para qué sirve:** RF-FAC-064: Configurar la modalidad por defecto del tenant (separada o agrupada) y excepciones por servicio, cuenta o titular, con vigencia desde un período. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.modalidad.configurar`.
- **Recibe:** un cuerpo JSON cuya estructura detalla el anexo; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FAC-26 (Modalidad de facturación).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1770 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-017-b)

<a id="API-FAC-018"></a>
#### API-FAC-018 · `GET /api/admin/fac/billing-groups`

- **Qué hace:** Grupos de facturación. Lista, con filtros y paginación, los registros de grupos de facturación (`billingGroups`).
- **Para qué sirve:** RF-FAC-136: Configurar el orden de impresión de los renglones (grupos con descripción, pie y orden). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.grupos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de grupos de facturación (`billingGroups`) con `total`.
- **Pantallas:** PAN-FAC-25 (Grupos de facturación).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1771 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-018)

<a id="API-FAC-018-b"></a>
#### API-FAC-018-b · `POST /api/admin/fac/billing-groups`

- **Qué hace:** Grupos de facturación. Da de alta un registro de grupos de facturación (`billingGroups`).
- **Para qué sirve:** RF-FAC-155: Crear lotes de distribución por lote de emisión o selección manual, por canal, con agrupación del envío por cuenta, por socio o por socio y teléfono, y envío en tandas configurables. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.grupos.crear`.
- **Recibe:** los datos de grupos de facturación (`billingGroups`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de grupos de facturación (`billingGroups`).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1771 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-018-b)

<a id="API-FAC-018-c"></a>
#### API-FAC-018-c · `GET /api/admin/fac/billing-groups/{id}`

- **Qué hace:** Grupos de facturación. Obtiene el detalle de un registro de grupos de facturación (`billingGroups`).
- **Para qué sirve:** RF-FAC-136: Configurar el orden de impresión de los renglones (grupos con descripción, pie y orden). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.grupos.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de grupos de facturación (`billingGroups`).
- **Pantallas:** PAN-FAC-25 (Grupos de facturación).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1771 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-018-c)

<a id="API-FAC-018-d"></a>
#### API-FAC-018-d · `PATCH /api/admin/fac/billing-groups/{id}`

- **Qué hace:** Grupos de facturación. Modifica algunos campos de un registro de grupos de facturación (`billingGroups`) (solo los enviados).
- **Para qué sirve:** RF-FAC-155: Crear lotes de distribución por lote de emisión o selección manual, por canal, con agrupación del envío por cuenta, por socio o por socio y teléfono, y envío en tandas configurables. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.grupos.crear`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de grupos de facturación (`billingGroups`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de grupos de facturación (`billingGroups`).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1771 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-018-d)

<a id="API-FAC-019"></a>
#### API-FAC-019 · `POST /api/admin/fac/billing-groups/{id}/fiscal-validation`

- **Qué hace:** Aprobar o rechazar validación fiscal. Registra «fiscal-validation» sobre un registro de grupos de facturación (`billingGroups`).
- **Para qué sirve:** RF-FAC-016: Validar datos y prerrequisitos: conceptos obligatorios configurados (PRM-FAC-060), matriz de comprobantes resoluble para cada condición fiscal y para ambos signos, numeración forzada inexistente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.grupos.validarFiscal`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1772 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-019)

<a id="API-FAC-020"></a>
#### API-FAC-020 · `POST /api/admin/fac/billing-groups/{id}/dissolve`

- **Qué hace:** Disolver desde un período. Disuelve un registro de grupos de facturación (`billingGroups`).
- **Para qué sirve:** RF-FAC-165: Reabrir un cierre con motivo y aprobación; la reapertura no modifica comprobantes autorizados ni reabre períodos de grupos desarmados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.grupos.desarmar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1773 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-020)

<a id="API-FAC-021"></a>
#### API-FAC-021 · `GET /api/admin/fac/due-date-schemes`

- **Qué hace:** Tramas de vencimiento y recargo. Lista, con filtros y paginación, los registros de esquema de vencimientos (`dueDateSchemes`).
- **Para qué sirve:** RF-FAC-087: Configurar tramas por servicio, ciclo y tipo de factura: cantidad de vencimientos, separación entre fechas y recargo de cada uno, con los modos fijo en pesos, porcentaje fijo capitalizado, porcentaje diario, trama por rango de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.tramas.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de esquema de vencimientos (`dueDateSchemes`) con `total`.
- **Pantallas:** PAN-FAC-27 (Tramas de recargo).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1774 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-021)

<a id="API-FAC-021-b"></a>
#### API-FAC-021-b · `POST /api/admin/fac/due-date-schemes`

- **Qué hace:** Tramas de vencimiento y recargo. Da de alta un registro de esquema de vencimientos (`dueDateSchemes`).
- **Para qué sirve:** RF-FAC-087: Configurar tramas por servicio, ciclo y tipo de factura: cantidad de vencimientos, separación entre fechas y recargo de cada uno, con los modos fijo en pesos, porcentaje fijo capitalizado, porcentaje diario, trama por rango de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.tramas.configurar`.
- **Recibe:** los datos de esquema de vencimientos (`dueDateSchemes`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de esquema de vencimientos (`dueDateSchemes`).
- **Pantallas:** PAN-FAC-27 (Tramas de recargo).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1774 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-021-b)

<a id="API-FAC-021-c"></a>
#### API-FAC-021-c · `GET /api/admin/fac/due-date-schemes/{id}`

- **Qué hace:** Tramas de vencimiento y recargo. Obtiene el detalle de un registro de esquema de vencimientos (`dueDateSchemes`).
- **Para qué sirve:** RF-FAC-087: Configurar tramas por servicio, ciclo y tipo de factura: cantidad de vencimientos, separación entre fechas y recargo de cada uno, con los modos fijo en pesos, porcentaje fijo capitalizado, porcentaje diario, trama por rango de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.tramas.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de esquema de vencimientos (`dueDateSchemes`).
- **Pantallas:** PAN-FAC-27 (Tramas de recargo).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1774 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-021-c)

<a id="API-FAC-021-d"></a>
#### API-FAC-021-d · `PATCH /api/admin/fac/due-date-schemes/{id}`

- **Qué hace:** Tramas de vencimiento y recargo. Modifica algunos campos de un registro de esquema de vencimientos (`dueDateSchemes`) (solo los enviados).
- **Para qué sirve:** RF-FAC-087: Configurar tramas por servicio, ciclo y tipo de factura: cantidad de vencimientos, separación entre fechas y recargo de cada uno, con los modos fijo en pesos, porcentaje fijo capitalizado, porcentaje diario, trama por rango de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.tramas.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de esquema de vencimientos (`dueDateSchemes`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de esquema de vencimientos (`dueDateSchemes`).
- **Pantallas:** PAN-FAC-27 (Tramas de recargo).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1774 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-021-d)

<a id="API-FAC-022"></a>
#### API-FAC-022 · `POST /api/admin/fac/due-date-schemes/{id}/simulate`

- **Qué hace:** Simular recargos para un importe y fechas. Simula sin efectos un registro de esquema de vencimientos (`dueDateSchemes`).
- **Para qué sirve:** RF-FAC-087: Configurar tramas por servicio, ciclo y tipo de factura: cantidad de vencimientos, separación entre fechas y recargo de cada uno, con los modos fijo en pesos, porcentaje fijo capitalizado, porcentaje diario, trama por rango de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.tramas.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FAC-27 (Tramas de recargo).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1775 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-022)

<a id="API-FAC-024"></a>
#### API-FAC-024 · `GET /api/admin/fac/exception-reasons`

- **Qué hace:** Motivos de excepción. Lista, con filtros y paginación, los registros de motivos de excepción (`billingExceptionReasons`).
- **Para qué sirve:** RF-FAC-035: Ofrecer una bandeja de excepciones con caso, cliente, cuenta, servicio, contrato, período, problema o dato faltante, código de motivo, severidad, etapa, estado, responsable (rol y usuario), módulo dueño del dato, siguiente… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.excepcionesMotivos.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de motivos de excepción (`billingExceptionReasons`) con `total`.
- **Pantallas:** PAN-FAC-42 (Motivos de excepción).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1777 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-024)

<a id="API-FAC-024-b"></a>
#### API-FAC-024-b · `POST /api/admin/fac/exception-reasons`

- **Qué hace:** Motivos de excepción. Da de alta un registro de motivos de excepción (`billingExceptionReasons`).
- **Para qué sirve:** RF-FAC-035: Ofrecer una bandeja de excepciones con caso, cliente, cuenta, servicio, contrato, período, problema o dato faltante, código de motivo, severidad, etapa, estado, responsable (rol y usuario), módulo dueño del dato, siguiente… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.excepcionesMotivos.configurar`.
- **Recibe:** los datos de motivos de excepción (`billingExceptionReasons`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de motivos de excepción (`billingExceptionReasons`).
- **Pantallas:** PAN-FAC-42 (Motivos de excepción).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1777 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-024-b)

<a id="API-FAC-024-c"></a>
#### API-FAC-024-c · `GET /api/admin/fac/exception-reasons/{code}`

- **Qué hace:** Motivos de excepción. Obtiene el detalle de un registro de motivos de excepción (`billingExceptionReasons`).
- **Para qué sirve:** RF-FAC-035: Ofrecer una bandeja de excepciones con caso, cliente, cuenta, servicio, contrato, período, problema o dato faltante, código de motivo, severidad, etapa, estado, responsable (rol y usuario), módulo dueño del dato, siguiente… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.excepcionesMotivos.configurar`.
- **Recibe:** en la ruta `code`.
- **Devuelve:** 200: el registro de motivos de excepción (`billingExceptionReasons`).
- **Pantallas:** PAN-FAC-42 (Motivos de excepción).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1777 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-024-c)

<a id="API-FAC-024-d"></a>
#### API-FAC-024-d · `PATCH /api/admin/fac/exception-reasons/{code}`

- **Qué hace:** Motivos de excepción. Modifica algunos campos de un registro de motivos de excepción (`billingExceptionReasons`) (solo los enviados).
- **Para qué sirve:** RF-FAC-035: Ofrecer una bandeja de excepciones con caso, cliente, cuenta, servicio, contrato, período, problema o dato faltante, código de motivo, severidad, etapa, estado, responsable (rol y usuario), módulo dueño del dato, siguiente… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.excepcionesMotivos.configurar`.
- **Recibe:** en la ruta `code`; solo los campos a cambiar de motivos de excepción (`billingExceptionReasons`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de motivos de excepción (`billingExceptionReasons`).
- **Pantallas:** PAN-FAC-42 (Motivos de excepción).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1777 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-024-d)

<a id="API-FAC-025"></a>
#### API-FAC-025 · `GET /api/admin/fac/invoice-templates`

- **Qué hace:** Diseños de comprobante: reglas de selección en M05; el diseño y sus versiones se guardan en T11 (documentTemplates/templateVersions, CTR-... Lista, con filtros y paginación, los registros de reglas de selección de plantilla (`invoiceTemplates`).
- **Para qué sirve:** RF-FAC-019: Preparar congela el universo: guarda la foto de la selección (cuentas, contratos, servicios, grupos), las cantidades (consumos aprobados con su id y versión), las versiones de reglas aplicables (tarifa, configuración publicada… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.diseno.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de reglas de selección de plantilla (`invoiceTemplates`) con `total`.
- **Pantallas:** PAN-FAC-28 (Diseño de comprobantes), PAN-FAC-29 (Gráficos y orden de renglones).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1778 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-025)

<a id="API-FAC-025-b"></a>
#### API-FAC-025-b · `POST /api/admin/fac/invoice-templates`

- **Qué hace:** Diseños de comprobante: reglas de selección en M05; el diseño y sus versiones se guardan en T11 (documentTemplates/templateVersions, CTR-... Da de alta un registro de reglas de selección de plantilla (`invoiceTemplates`).
- **Para qué sirve:** RF-FAC-019: Preparar congela el universo: guarda la foto de la selección (cuentas, contratos, servicios, grupos), las cantidades (consumos aprobados con su id y versión), las versiones de reglas aplicables (tarifa, configuración publicada… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.diseno.configurar`.
- **Recibe:** los datos de reglas de selección de plantilla (`invoiceTemplates`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de reglas de selección de plantilla (`invoiceTemplates`).
- **Pantallas:** PAN-FAC-28 (Diseño de comprobantes), PAN-FAC-29 (Gráficos y orden de renglones).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1778 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-025-b)

<a id="API-FAC-025-c"></a>
#### API-FAC-025-c · `GET /api/admin/fac/invoice-templates/{id}`

- **Qué hace:** Diseños de comprobante: reglas de selección en M05; el diseño y sus versiones se guardan en T11 (documentTemplates/templateVersions, CTR-... Obtiene el detalle de un registro de reglas de selección de plantilla (`invoiceTemplates`).
- **Para qué sirve:** RF-FAC-019: Preparar congela el universo: guarda la foto de la selección (cuentas, contratos, servicios, grupos), las cantidades (consumos aprobados con su id y versión), las versiones de reglas aplicables (tarifa, configuración publicada… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.diseno.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de reglas de selección de plantilla (`invoiceTemplates`).
- **Pantallas:** PAN-FAC-28 (Diseño de comprobantes), PAN-FAC-29 (Gráficos y orden de renglones).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1778 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-025-c)

<a id="API-FAC-025-d"></a>
#### API-FAC-025-d · `PATCH /api/admin/fac/invoice-templates/{id}`

- **Qué hace:** Diseños de comprobante: reglas de selección en M05; el diseño y sus versiones se guardan en T11 (documentTemplates/templateVersions, CTR-... Modifica algunos campos de un registro de reglas de selección de plantilla (`invoiceTemplates`) (solo los enviados).
- **Para qué sirve:** RF-FAC-019: Preparar congela el universo: guarda la foto de la selección (cuentas, contratos, servicios, grupos), las cantidades (consumos aprobados con su id y versión), las versiones de reglas aplicables (tarifa, configuración publicada… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.diseno.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de reglas de selección de plantilla (`invoiceTemplates`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de reglas de selección de plantilla (`invoiceTemplates`).
- **Pantallas:** PAN-FAC-28 (Diseño de comprobantes), PAN-FAC-29 (Gráficos y orden de renglones).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1778 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-025-d)

<a id="API-FAC-026"></a>
#### API-FAC-026 · `POST /api/admin/fac/invoice-templates/{id}/preview`

- **Qué hace:** PDF de prueba (datos ficticios o comprobante elegido). Previsualiza sin efectos un registro de reglas de selección de plantilla (`invoiceTemplates`).
- **Para qué sirve:** RF-FAC-019: Preparar congela el universo: guarda la foto de la selección (cuentas, contratos, servicios, grupos), las cantidades (consumos aprobados con su id y versión), las versiones de reglas aplicables (tarifa, configuración publicada… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.diseno.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FAC-28 (Diseño de comprobantes), PAN-FAC-29 (Gráficos y orden de renglones).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1779 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-026)

<a id="API-FAC-027"></a>
#### API-FAC-027 · `GET /api/admin/fac/consumption-chart-groups`

- **Qué hace:** Grupos de gráfico. Lista, con filtros y paginación, los registros de grupos de gráfico de consumo (`consumptionChartGroups`).
- **Para qué sirve:** RF-FAC-136: Configurar el orden de impresión de los renglones (grupos con descripción, pie y orden). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.diseno.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de grupos de gráfico de consumo (`consumptionChartGroups`) con `total`.
- **Pantallas:** PAN-FAC-28 (Diseño de comprobantes), PAN-FAC-29 (Gráficos y orden de renglones).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1780 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-027)

<a id="API-FAC-027-b"></a>
#### API-FAC-027-b · `POST /api/admin/fac/consumption-chart-groups`

- **Qué hace:** Grupos de gráfico. Da de alta un registro de grupos de gráfico de consumo (`consumptionChartGroups`).
- **Para qué sirve:** RF-FAC-136: Configurar el orden de impresión de los renglones (grupos con descripción, pie y orden). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.diseno.configurar`.
- **Recibe:** los datos de grupos de gráfico de consumo (`consumptionChartGroups`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de grupos de gráfico de consumo (`consumptionChartGroups`).
- **Pantallas:** PAN-FAC-28 (Diseño de comprobantes), PAN-FAC-29 (Gráficos y orden de renglones).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1780 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-027-b)

<a id="API-FAC-027-c"></a>
#### API-FAC-027-c · `GET /api/admin/fac/consumption-chart-groups/{id}`

- **Qué hace:** Grupos de gráfico. Obtiene el detalle de un registro de grupos de gráfico de consumo (`consumptionChartGroups`).
- **Para qué sirve:** RF-FAC-136: Configurar el orden de impresión de los renglones (grupos con descripción, pie y orden). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.diseno.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de grupos de gráfico de consumo (`consumptionChartGroups`).
- **Pantallas:** PAN-FAC-28 (Diseño de comprobantes), PAN-FAC-29 (Gráficos y orden de renglones).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1780 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-027-c)

<a id="API-FAC-027-d"></a>
#### API-FAC-027-d · `PATCH /api/admin/fac/consumption-chart-groups/{id}`

- **Qué hace:** Grupos de gráfico. Modifica algunos campos de un registro de grupos de gráfico de consumo (`consumptionChartGroups`) (solo los enviados).
- **Para qué sirve:** RF-FAC-136: Configurar el orden de impresión de los renglones (grupos con descripción, pie y orden). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.diseno.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de grupos de gráfico de consumo (`consumptionChartGroups`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de grupos de gráfico de consumo (`consumptionChartGroups`).
- **Pantallas:** PAN-FAC-28 (Diseño de comprobantes), PAN-FAC-29 (Gráficos y orden de renglones).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1780 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-027-d)

<a id="API-FAC-028"></a>
#### API-FAC-028 · `GET /api/admin/fac/line-orders`

- **Qué hace:** Orden de renglones. Lista, con filtros y paginación, los registros de orden de renglones (`invoiceLineOrders`).
- **Para qué sirve:** RF-FAC-136: Configurar el orden de impresión de los renglones (grupos con descripción, pie y orden). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.diseno.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de orden de renglones (`invoiceLineOrders`) con `total`.
- **Pantallas:** PAN-FAC-28 (Diseño de comprobantes), PAN-FAC-29 (Gráficos y orden de renglones).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1781 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-028)

<a id="API-FAC-028-b"></a>
#### API-FAC-028-b · `POST /api/admin/fac/line-orders`

- **Qué hace:** Orden de renglones. Da de alta un registro de orden de renglones (`invoiceLineOrders`).
- **Para qué sirve:** RF-FAC-136: Configurar el orden de impresión de los renglones (grupos con descripción, pie y orden). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.diseno.configurar`.
- **Recibe:** los datos de orden de renglones (`invoiceLineOrders`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de orden de renglones (`invoiceLineOrders`).
- **Pantallas:** PAN-FAC-28 (Diseño de comprobantes), PAN-FAC-29 (Gráficos y orden de renglones).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1781 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-028-b)

<a id="API-FAC-028-c"></a>
#### API-FAC-028-c · `GET /api/admin/fac/line-orders/{id}`

- **Qué hace:** Orden de renglones. Obtiene el detalle de un registro de orden de renglones (`invoiceLineOrders`).
- **Para qué sirve:** RF-FAC-136: Configurar el orden de impresión de los renglones (grupos con descripción, pie y orden). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.diseno.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de orden de renglones (`invoiceLineOrders`).
- **Pantallas:** PAN-FAC-28 (Diseño de comprobantes), PAN-FAC-29 (Gráficos y orden de renglones).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1781 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-028-c)

<a id="API-FAC-028-d"></a>
#### API-FAC-028-d · `PATCH /api/admin/fac/line-orders/{id}`

- **Qué hace:** Orden de renglones. Modifica algunos campos de un registro de orden de renglones (`invoiceLineOrders`) (solo los enviados).
- **Para qué sirve:** RF-FAC-136: Configurar el orden de impresión de los renglones (grupos con descripción, pie y orden). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.diseno.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de orden de renglones (`invoiceLineOrders`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de orden de renglones (`invoiceLineOrders`).
- **Pantallas:** PAN-FAC-28 (Diseño de comprobantes), PAN-FAC-29 (Gráficos y orden de renglones).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1781 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-028-d)

<a id="API-FAC-029"></a>
#### API-FAC-029 · `GET /api/admin/fac/barcode-formats`

- **Qué hace:** Formatos de código de barras. Lista, con filtros y paginación, los registros de formatos declarativos de código de barras (`barcodeFormats`).
- **Para qué sirve:** RF-FAC-144: Validar el largo: si un importe o una cantidad de días excede el ancho del segmento, no truncar; registrar excepción de impresión y aplicar el formato alternativo configurado (por ejemplo SIRO 59 cuando el importe supera ARS… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.codigoBarras.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de formatos declarativos de código de barras (`barcodeFormats`) con `total`.
- **Pantallas:** PAN-FAC-30 (Formatos de código de barras).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1782 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-029)

<a id="API-FAC-029-b"></a>
#### API-FAC-029-b · `POST /api/admin/fac/barcode-formats`

- **Qué hace:** Formatos de código de barras. Da de alta un registro de formatos declarativos de código de barras (`barcodeFormats`).
- **Para qué sirve:** RF-FAC-144: Validar el largo: si un importe o una cantidad de días excede el ancho del segmento, no truncar; registrar excepción de impresión y aplicar el formato alternativo configurado (por ejemplo SIRO 59 cuando el importe supera ARS… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.codigoBarras.configurar`.
- **Recibe:** los datos de formatos declarativos de código de barras (`barcodeFormats`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de formatos declarativos de código de barras (`barcodeFormats`).
- **Pantallas:** PAN-FAC-30 (Formatos de código de barras).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1782 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-029-b)

<a id="API-FAC-029-c"></a>
#### API-FAC-029-c · `GET /api/admin/fac/barcode-formats/{id}`

- **Qué hace:** Formatos de código de barras. Obtiene el detalle de un registro de formatos declarativos de código de barras (`barcodeFormats`).
- **Para qué sirve:** RF-FAC-144: Validar el largo: si un importe o una cantidad de días excede el ancho del segmento, no truncar; registrar excepción de impresión y aplicar el formato alternativo configurado (por ejemplo SIRO 59 cuando el importe supera ARS… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.codigoBarras.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de formatos declarativos de código de barras (`barcodeFormats`).
- **Pantallas:** PAN-FAC-30 (Formatos de código de barras).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1782 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-029-c)

<a id="API-FAC-029-d"></a>
#### API-FAC-029-d · `PATCH /api/admin/fac/barcode-formats/{id}`

- **Qué hace:** Formatos de código de barras. Modifica algunos campos de un registro de formatos declarativos de código de barras (`barcodeFormats`) (solo los enviados).
- **Para qué sirve:** RF-FAC-144: Validar el largo: si un importe o una cantidad de días excede el ancho del segmento, no truncar; registrar excepción de impresión y aplicar el formato alternativo configurado (por ejemplo SIRO 59 cuando el importe supera ARS… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.codigoBarras.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de formatos declarativos de código de barras (`barcodeFormats`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de formatos declarativos de código de barras (`barcodeFormats`).
- **Pantallas:** PAN-FAC-30 (Formatos de código de barras).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1782 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-029-d)

<a id="API-FAC-030"></a>
#### API-FAC-030 · `POST /api/admin/fac/barcode-formats/{id}/test`

- **Qué hace:** Generar o decodificar un código de prueba; ejecuta vectores. Prueba un registro de formatos declarativos de código de barras (`barcodeFormats`).
- **Para qué sirve:** RF-FAC-148: Probador de formatos: generar el código de un comprobante, decodificar un código y comparar con el generado por ProCoop durante el paralelo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.codigoBarras.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FAC-30 (Formatos de código de barras).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1783 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-030)

<a id="API-FAC-031"></a>
#### API-FAC-031 · `POST /api/admin/fac/barcode-formats/{id}/publish`

- **Qué hace:** Publicar (falla si un vector no pasa). Publica un registro de formatos declarativos de código de barras (`barcodeFormats`).
- **Para qué sirve:** RF-FAC-133: Registrar comprobantes de administración pública con el formato que corresponda. [VERIFICAR] su contenido en ProCoop. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.codigoBarras.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FAC-30 (Formatos de código de barras).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1784 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-031)

<a id="API-FAC-032"></a>
#### API-FAC-032 · `GET /api/admin/fac/barcode-assignments`

- **Qué hace:** Asignación de formatos a recaudadores y documentos. Lista, con filtros y paginación, los registros de asignación de formatos por recaudador (`barcodeAssignments`).
- **Para qué sirve:** RF-FAC-147: Asignar formatos por tenant y por recaudador o canal, con convenio por formato y por tipo de documento (resuelve el conflicto de convenio de 10 y 11 caracteres de SIRO para factura y talón). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.codigoBarras.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de asignación de formatos por recaudador (`barcodeAssignments`) con `total`.
- **Pantallas:** PAN-FAC-30 (Formatos de código de barras).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1785 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-032)

<a id="API-FAC-032-b"></a>
#### API-FAC-032-b · `POST /api/admin/fac/barcode-assignments`

- **Qué hace:** Asignación de formatos a recaudadores y documentos. Da de alta un registro de asignación de formatos por recaudador (`barcodeAssignments`).
- **Para qué sirve:** RF-FAC-147: Asignar formatos por tenant y por recaudador o canal, con convenio por formato y por tipo de documento (resuelve el conflicto de convenio de 10 y 11 caracteres de SIRO para factura y talón). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.codigoBarras.configurar`.
- **Recibe:** los datos de asignación de formatos por recaudador (`barcodeAssignments`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de asignación de formatos por recaudador (`barcodeAssignments`).
- **Pantallas:** PAN-FAC-30 (Formatos de código de barras).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1785 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-032-b)

<a id="API-FAC-032-c"></a>
#### API-FAC-032-c · `GET /api/admin/fac/barcode-assignments/{id}`

- **Qué hace:** Asignación de formatos a recaudadores y documentos. Obtiene el detalle de un registro de asignación de formatos por recaudador (`barcodeAssignments`).
- **Para qué sirve:** RF-FAC-147: Asignar formatos por tenant y por recaudador o canal, con convenio por formato y por tipo de documento (resuelve el conflicto de convenio de 10 y 11 caracteres de SIRO para factura y talón). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.codigoBarras.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de asignación de formatos por recaudador (`barcodeAssignments`).
- **Pantallas:** PAN-FAC-30 (Formatos de código de barras).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1785 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-032-c)

<a id="API-FAC-032-d"></a>
#### API-FAC-032-d · `PATCH /api/admin/fac/barcode-assignments/{id}`

- **Qué hace:** Asignación de formatos a recaudadores y documentos. Modifica algunos campos de un registro de asignación de formatos por recaudador (`barcodeAssignments`) (solo los enviados).
- **Para qué sirve:** RF-FAC-147: Asignar formatos por tenant y por recaudador o canal, con convenio por formato y por tipo de documento (resuelve el conflicto de convenio de 10 y 11 caracteres de SIRO para factura y talón). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.codigoBarras.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de asignación de formatos por recaudador (`barcodeAssignments`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de asignación de formatos por recaudador (`barcodeAssignments`).
- **Pantallas:** PAN-FAC-30 (Formatos de código de barras).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1785 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-032-d)

<a id="API-FAC-033"></a>
#### API-FAC-033 · `GET /api/admin/fac/distribution-routes`

- **Qué hace:** Rutas de reparto. Lista, con filtros y paginación, los registros de recorridos de reparto (`distributionRoutes`).
- **Para qué sirve:** RF-FAC-160: Rutas y repartidores de distribución con secuencia; planilla de reparto; registro de entrega o devolución por el repartidor desde la PWA de empleado (funciona sin conexión). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.reparto.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de recorridos de reparto (`distributionRoutes`) con `total`.
- **Pantallas:** PAN-FAC-33 (Rutas de reparto y correos).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1786 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-033)

<a id="API-FAC-033-b"></a>
#### API-FAC-033-b · `POST /api/admin/fac/distribution-routes`

- **Qué hace:** Rutas de reparto. Da de alta un registro de recorridos de reparto (`distributionRoutes`).
- **Para qué sirve:** RF-FAC-160: Rutas y repartidores de distribución con secuencia; planilla de reparto; registro de entrega o devolución por el repartidor desde la PWA de empleado (funciona sin conexión). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.reparto.configurar`.
- **Recibe:** los datos de recorridos de reparto (`distributionRoutes`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de recorridos de reparto (`distributionRoutes`).
- **Pantallas:** PAN-FAC-33 (Rutas de reparto y correos).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1786 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-033-b)

<a id="API-FAC-033-c"></a>
#### API-FAC-033-c · `GET /api/admin/fac/distribution-routes/{id}`

- **Qué hace:** Rutas de reparto. Obtiene el detalle de un registro de recorridos de reparto (`distributionRoutes`).
- **Para qué sirve:** RF-FAC-160: Rutas y repartidores de distribución con secuencia; planilla de reparto; registro de entrega o devolución por el repartidor desde la PWA de empleado (funciona sin conexión). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.reparto.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de recorridos de reparto (`distributionRoutes`).
- **Pantallas:** PAN-FAC-33 (Rutas de reparto y correos).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1786 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-033-c)

<a id="API-FAC-033-d"></a>
#### API-FAC-033-d · `PATCH /api/admin/fac/distribution-routes/{id}`

- **Qué hace:** Rutas de reparto. Modifica algunos campos de un registro de recorridos de reparto (`distributionRoutes`) (solo los enviados).
- **Para qué sirve:** RF-FAC-160: Rutas y repartidores de distribución con secuencia; planilla de reparto; registro de entrega o devolución por el repartidor desde la PWA de empleado (funciona sin conexión). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.reparto.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de recorridos de reparto (`distributionRoutes`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de recorridos de reparto (`distributionRoutes`).
- **Pantallas:** PAN-FAC-33 (Rutas de reparto y correos).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1786 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-033-d)

<a id="API-FAC-034"></a>
#### API-FAC-034 · `GET /api/admin/fac/postal-carriers`

- **Qué hace:** Correos y franqueo. Lista, con filtros y paginación, los registros de empresas postales y fletes (`postalCarriers`).
- **Para qué sirve:** RF-FAC-161: Empresas postales con importe y franqueo según cantidad de hojas por destinatario y zona; no cobrar franqueo a quien adhirió a factura digital con email válido. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.reparto.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de empresas postales y fletes (`postalCarriers`) con `total`.
- **Pantallas:** PAN-FAC-33 (Rutas de reparto y correos).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1787 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-034)

<a id="API-FAC-034-b"></a>
#### API-FAC-034-b · `POST /api/admin/fac/postal-carriers`

- **Qué hace:** Correos y franqueo. Da de alta un registro de empresas postales y fletes (`postalCarriers`).
- **Para qué sirve:** RF-FAC-161: Empresas postales con importe y franqueo según cantidad de hojas por destinatario y zona; no cobrar franqueo a quien adhirió a factura digital con email válido. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.reparto.configurar`.
- **Recibe:** los datos de empresas postales y fletes (`postalCarriers`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de empresas postales y fletes (`postalCarriers`).
- **Pantallas:** PAN-FAC-33 (Rutas de reparto y correos).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1787 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-034-b)

<a id="API-FAC-034-c"></a>
#### API-FAC-034-c · `GET /api/admin/fac/postal-carriers/{id}`

- **Qué hace:** Correos y franqueo. Obtiene el detalle de un registro de empresas postales y fletes (`postalCarriers`).
- **Para qué sirve:** RF-FAC-161: Empresas postales con importe y franqueo según cantidad de hojas por destinatario y zona; no cobrar franqueo a quien adhirió a factura digital con email válido. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.reparto.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de empresas postales y fletes (`postalCarriers`).
- **Pantallas:** PAN-FAC-33 (Rutas de reparto y correos).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1787 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-034-c)

<a id="API-FAC-034-d"></a>
#### API-FAC-034-d · `PATCH /api/admin/fac/postal-carriers/{id}`

- **Qué hace:** Correos y franqueo. Modifica algunos campos de un registro de empresas postales y fletes (`postalCarriers`) (solo los enviados).
- **Para qué sirve:** RF-FAC-161: Empresas postales con importe y franqueo según cantidad de hojas por destinatario y zona; no cobrar franqueo a quien adhirió a factura digital con email válido. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.reparto.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de empresas postales y fletes (`postalCarriers`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de empresas postales y fletes (`postalCarriers`).
- **Pantallas:** PAN-FAC-33 (Rutas de reparto y correos).
- **Ola:** O4 · **Fuente:** M05 §11.1 Configuración, línea 1787 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-034-d)

<a id="API-FAC-035"></a>
#### API-FAC-035 · `GET /api/admin/fac/settings`

- **Qué hace:** Parámetros del módulo (vía T04). Consulta `settings`.
- **Para qué sirve:** RF-FAC-171: Emitir la factura de venta de prepaga desde M03/M07 exigiendo que el total coincida con el simulado; si no coincide, revertir el consumo registrado. Redondeo, recargo o bonificación por forma de pago y opción de ND separada según… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.parametros.configurar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FAC-41 (Parámetros de facturación).
- **Ola:** O7 · **Fuente:** M05 §11.1 Configuración, línea 1788 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-035)

<a id="API-FAC-035-b"></a>
#### API-FAC-035-b · `PATCH /api/admin/fac/settings`

- **Qué hace:** Parámetros del módulo (vía T04). Modifica algunos campos de un registro de `settings` (solo los enviados).
- **Para qué sirve:** RF-FAC-171: Emitir la factura de venta de prepaga desde M03/M07 exigiendo que el total coincida con el simulado; si no coincide, revertir el consumo registrado. Redondeo, recargo o bonificación por forma de pago y opción de ND separada según… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.parametros.configurar`.
- **Recibe:** solo los campos a cambiar; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FAC-41 (Parámetros de facturación).
- **Ola:** O7 · **Fuente:** M05 §11.1 Configuración, línea 1788 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Configuraci%C3%B3n/API-FAC-035-b)

<a id="grupo-2"></a>

## Lotes y excepciones

31 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-FAC-040](#API-FAC-040) | GET | `/api/admin/fac/runs` | Listar lotes. |
| [API-FAC-041](#API-FAC-041) | POST | `/api/admin/fac/runs` | Crear lote draft (ciclo, adHoc, simulation). |
| [API-FAC-042](#API-FAC-042) | GET | `/api/admin/fac/runs/{id}` | Detalle con contadores, fases y progreso. |
| [API-FAC-043](#API-FAC-043) | PATCH | `/api/admin/fac/runs/{id}` | Editar fechas/opciones en draft. |
| [API-FAC-044](#API-FAC-044) | POST | `/api/admin/fac/runs/{id}/prepare` | Preparar y congelar v1 (202). |
| [API-FAC-045](#API-FAC-045) | POST | `/api/admin/fac/runs/{id}/universe/versions` | Congelar nueva versión con motivo (202). |
| [API-FAC-046](#API-FAC-046) | GET | `/api/admin/fac/runs/{id}/universe/versions/{v}/diff` | Altas y bajas entre versiones. |
| [API-FAC-047](#API-FAC-047) | POST | `/api/admin/fac/runs/{id}/prebill` | Prefacturar (todo o casos afectados) (202). |
| [API-FAC-048](#API-FAC-048) | GET | `/api/admin/fac/runs/{id}/items` | Casos con filtros (estado, variación, muestra). |
| [API-FAC-049](#API-FAC-049) | GET | `/api/admin/fac/runs/{id}/items/{itemId}` | Detalle del caso con prefactura y comparación. |
| [API-FAC-050](#API-FAC-050) | POST | `/api/admin/fac/runs/{id}/items/{itemId}/exclude` | Excluir con causa. |
| [API-FAC-051](#API-FAC-051) | POST | `/api/admin/fac/runs/{id}/sample/reviewed` | Marcar muestra revisada. |
| [API-FAC-052](#API-FAC-052) | GET | `/api/admin/fac/runs/{id}/approval-summary` | Resumen obligatorio para aprobar. |
| [API-FAC-053](#API-FAC-053) | POST | `/api/admin/fac/runs/{id}/approve` | Aprobar (o iniciar workflow T11). |
| [API-FAC-054](#API-FAC-054) | POST | `/api/admin/fac/runs/{id}/revoke-approval` | Volver a prebilled antes de emitir. |
| [API-FAC-055](#API-FAC-055) | POST | `/api/admin/fac/runs/{id}/issue` | Emitir (202). |
| [API-FAC-056](#API-FAC-056) | POST | `/api/admin/fac/runs/{id}/pause` | Pausar al terminar el bloque. |
| [API-FAC-057](#API-FAC-057) | POST | `/api/admin/fac/runs/{id}/resume` | Reanudar desde el último bloque confirmado. |
| [API-FAC-058](#API-FAC-058) | POST | `/api/admin/fac/runs/{id}/cancel` | Cancelar (solo sin emitidos). |
| [API-FAC-059](#API-FAC-059) | POST | `/api/admin/fac/runs/{id}/reprocess` | Crear lote reprocess con casos seleccionados o resueltos. |
| [API-FAC-060](#API-FAC-060) | GET | `/api/admin/fac/runs/{id}/numbering` | Rangos emitidos. |
| [API-FAC-061](#API-FAC-061) | GET | `/api/admin/fac/runs/{id}/export` | Exportar casos y resultados. |
| [API-FAC-062](#API-FAC-062) | POST | `/api/admin/fac/runs/{id}/overrides` | Registrar override de validación con motivo. |
| [API-FAC-063](#API-FAC-063) | GET | `/api/admin/fac/exceptions` | Bandeja (filtra por alcance del usuario). |
| [API-FAC-064](#API-FAC-064) | GET | `/api/admin/fac/exceptions/{id}` | Detalle con historial. |
| [API-FAC-065](#API-FAC-065) | POST | `/api/admin/fac/exceptions/{id}/assign` | Asignar responsable. |
| [API-FAC-066](#API-FAC-066) | POST | `/api/admin/fac/exceptions/{id}/resolve` | Marcar resuelta (verifica que el dato esté corregido en el módulo dueño). |
| [API-FAC-067](#API-FAC-067) | POST | `/api/admin/fac/exceptions/{id}/discard` | Excluir del período con causa. |
| [API-FAC-068](#API-FAC-068) | POST | `/api/admin/fac/exceptions:bulk-assign` | Asignación masiva. |
| [API-FAC-158](#API-FAC-158) | GET | `/api/admin/fac/pre-review` | Cola de revisión previa (RF-FAC-174; HUE-ELE-02). |
| [API-FAC-159](#API-FAC-159) | POST | `/api/admin/fac/pre-review/{itemId}:decide` | Decisión approve / return / exclude con nota (RN-FAC-154). |

<a id="API-FAC-040"></a>
#### API-FAC-040 · `GET /api/admin/fac/runs`

- **Qué hace:** Listar lotes. Lista, con filtros y paginación, los registros de lote de facturación (`billingRuns`).
- **Para qué sirve:** RF-FAC-178: Consumir cat.contract.meteringRegimeChanged (EVT-CAT-28) cuando afecta la facturación del período: volver a prefacturar los casos afectados de lotes preparados y registrar excepción si falta la lectura de retiro (RN-FAC-158). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.lotes.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de lote de facturación (`billingRuns`) con `total`.
- **Pantallas:** PAN-FAC-01 (Tablero de facturación), PAN-FAC-05 (Lotes), PAN-FAC-07 (Detalle de lote).
- **Ola:** O4 · **Fuente:** M05 §11.2 Lotes y excepciones, línea 1794 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Lotes%20y%20excepciones/API-FAC-040)

<a id="API-FAC-041"></a>
#### API-FAC-041 · `POST /api/admin/fac/runs`

- **Qué hace:** Crear lote draft (ciclo, adHoc, simulation). Registra un nuevo elemento u operación en lote de facturación (`billingRuns`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-FAC-013: Crear un lote desde un ciclo o ad hoc indicando: a quién (todas las cuentas del universo, una cuenta, varias cuentas, cuentas de control), servicios y período por servicio, período general y secuencia, tipo de comprobante y tipo… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.lotes.crear`.
- **Recibe:** los datos de lote de facturación (`billingRuns`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-FAC-06 (Nuevo lote (asistente)).
- **Ola:** O4 · **Fuente:** M05 §11.2 Lotes y excepciones, línea 1795 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Lotes%20y%20excepciones/API-FAC-041)

<a id="API-FAC-042"></a>
#### API-FAC-042 · `GET /api/admin/fac/runs/{id}`

- **Qué hace:** Detalle con contadores, fases y progreso. Obtiene el detalle de un registro de lote de facturación (`billingRuns`).
- **Para qué sirve:** RF-FAC-178: Consumir cat.contract.meteringRegimeChanged (EVT-CAT-28) cuando afecta la facturación del período: volver a prefacturar los casos afectados de lotes preparados y registrar excepción si falta la lectura de retiro (RN-FAC-158). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.lotes.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de lote de facturación (`billingRuns`).
- **Pantallas:** PAN-FAC-01 (Tablero de facturación), PAN-FAC-05 (Lotes), PAN-FAC-07 (Detalle de lote).
- **Ola:** O4 · **Fuente:** M05 §11.2 Lotes y excepciones, línea 1796 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Lotes%20y%20excepciones/API-FAC-042)

<a id="API-FAC-043"></a>
#### API-FAC-043 · `PATCH /api/admin/fac/runs/{id}`

- **Qué hace:** Editar fechas/opciones en draft. Modifica algunos campos de un registro de lote de facturación (`billingRuns`) (solo los enviados).
- **Para qué sirve:** RF-FAC-155: Crear lotes de distribución por lote de emisión o selección manual, por canal, con agrupación del envío por cuenta, por socio o por socio y teléfono, y envío en tandas configurables. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.lotes.crear`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de lote de facturación (`billingRuns`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de lote de facturación (`billingRuns`).
- **Pantallas:** PAN-FAC-06 (Nuevo lote (asistente)).
- **Ola:** O4 · **Fuente:** M05 §11.2 Lotes y excepciones, línea 1797 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Lotes%20y%20excepciones/API-FAC-043)

<a id="API-FAC-044"></a>
#### API-FAC-044 · `POST /api/admin/fac/runs/{id}/prepare`

- **Qué hace:** Preparar y congelar v1 (202). Prepara un registro de lote de facturación (`billingRuns`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-FAC-178: Consumir cat.contract.meteringRegimeChanged (EVT-CAT-28) cuando afecta la facturación del período: volver a prefacturar los casos afectados de lotes preparados y registrar excepción si falta la lectura de retiro (RN-FAC-158). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.lotes.preparar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Ola:** O4 · **Fuente:** M05 §11.2 Lotes y excepciones, línea 1798 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Lotes%20y%20excepciones/API-FAC-044)

<a id="API-FAC-045"></a>
#### API-FAC-045 · `POST /api/admin/fac/runs/{id}/universe/versions`

- **Qué hace:** Congelar nueva versión con motivo (202). Registra un nuevo elemento u operación en lote de facturación (`billingRuns`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-FAC-022: Versionar el universo: agregar o quitar casos después de preparar genera una versión nueva con las diferencias y su motivo; nunca se reemplaza en silencio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.lotes.preparar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Ola:** O4 · **Fuente:** M05 §11.2 Lotes y excepciones, línea 1799 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Lotes%20y%20excepciones/API-FAC-045)

<a id="API-FAC-046"></a>
#### API-FAC-046 · `GET /api/admin/fac/runs/{id}/universe/versions/{v}/diff`

- **Qué hace:** Altas y bajas entre versiones. Consulta «diff» de un registro de lote de facturación (`billingRuns`).
- **Para qué sirve:** RF-FAC-055: Ofrecer el servicio de emisión individual (fuera de lote) para refacturación, factura manual, altas y bajas, venta de prepaga, ventas (M11), intereses (M08) e inmediata/in situ, con las mismas validaciones, numeración e… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.lotes.ver`.
- **Recibe:** en la ruta `id`, `v`.
- **Devuelve:** 200: el registro de lote de facturación (`billingRuns`).
- **Pantallas:** PAN-FAC-01 (Tablero de facturación), PAN-FAC-05 (Lotes), PAN-FAC-07 (Detalle de lote).
- **Ola:** O4 · **Fuente:** M05 §11.2 Lotes y excepciones, línea 1800 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Lotes%20y%20excepciones/API-FAC-046)

<a id="API-FAC-047"></a>
#### API-FAC-047 · `POST /api/admin/fac/runs/{id}/prebill`

- **Qué hace:** Prefacturar (todo o casos afectados) (202). Prefactura un registro de lote de facturación (`billingRuns`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-FAC-178: Consumir cat.contract.meteringRegimeChanged (EVT-CAT-28) cuando afecta la facturación del período: volver a prefacturar los casos afectados de lotes preparados y registrar excepción si falta la lectura de retiro (RN-FAC-158). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.lotes.prefacturar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Ola:** O4 · **Fuente:** M05 §11.2 Lotes y excepciones, línea 1801 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Lotes%20y%20excepciones/API-FAC-047)

<a id="API-FAC-048"></a>
#### API-FAC-048 · `GET /api/admin/fac/runs/{id}/items`

- **Qué hace:** Casos con filtros (estado, variación, muestra). Lista, con filtros y paginación, los registros de ítems facturables pendientes (`billableItems`).
- **Para qué sirve:** RF-FAC-043: Aprobar la emisión según rol con un resumen obligatorio: universo, aptos, excepciones por motivo, totales por servicio y concepto, variaciones, muestra revisada y advertencias; workflow T11 por umbral de importe total… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.lotes.ver`.
- **Recibe:** en la ruta `id`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ítems facturables pendientes (`billableItems`) con `total`.
- **Pantallas:** PAN-FAC-01 (Tablero de facturación), PAN-FAC-05 (Lotes), PAN-FAC-07 (Detalle de lote).
- **Ola:** O4 · **Fuente:** M05 §11.2 Lotes y excepciones, línea 1802 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Lotes%20y%20excepciones/API-FAC-048)

<a id="API-FAC-049"></a>
#### API-FAC-049 · `GET /api/admin/fac/runs/{id}/items/{itemId}`

- **Qué hace:** Detalle del caso con prefactura y comparación. Obtiene el detalle de un registro de ítems facturables pendientes (`billableItems`).
- **Para qué sirve:** RF-FAC-025: Prefacturar cada caso invocando el motor de M04 con las versiones congeladas; obtener comprobantes candidatos en borrador con detalle de cálculo, sin numerar, sin consumir ítems y sin afectar saldos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.lotes.ver`.
- **Recibe:** en la ruta `id`, `itemId`.
- **Devuelve:** 200: el registro de ítems facturables pendientes (`billableItems`).
- **Pantallas:** PAN-FAC-01 (Tablero de facturación), PAN-FAC-05 (Lotes), PAN-FAC-07 (Detalle de lote).
- **Ola:** O4 · **Fuente:** M05 §11.2 Lotes y excepciones, línea 1803 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Lotes%20y%20excepciones/API-FAC-049)

<a id="API-FAC-050"></a>
#### API-FAC-050 · `POST /api/admin/fac/runs/{id}/items/{itemId}/exclude`

- **Qué hace:** Excluir con causa. Excluye un registro de ítems facturables pendientes (`billableItems`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-FAC-040: Excluir un caso con causa (no facturar en este período) con aprobación, o trasladarlo al próximo ciclo; ambos quedan en el acta. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.excepciones.excluir`.
- **Recibe:** en la ruta `id`, `itemId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Ola:** O4 · **Fuente:** M05 §11.2 Lotes y excepciones, línea 1804 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Lotes%20y%20excepciones/API-FAC-050)

<a id="API-FAC-051"></a>
#### API-FAC-051 · `POST /api/admin/fac/runs/{id}/sample/reviewed`

- **Qué hace:** Marcar muestra revisada. Registra un nuevo elemento u operación en lote de facturación (`billingRuns`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-FAC-046: Exigir que la muestra de control haya sido marcada como revisada antes de aprobar lotes con más de PRM-FAC-034 casos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.lotes.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Ola:** O4 · **Fuente:** M05 §11.2 Lotes y excepciones, línea 1805 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Lotes%20y%20excepciones/API-FAC-051)

<a id="API-FAC-052"></a>
#### API-FAC-052 · `GET /api/admin/fac/runs/{id}/approval-summary`

- **Qué hace:** Resumen obligatorio para aprobar. Consulta «approval-summary» de un registro de lote de facturación (`billingRuns`).
- **Para qué sirve:** RF-FAC-043: Aprobar la emisión según rol con un resumen obligatorio: universo, aptos, excepciones por motivo, totales por servicio y concepto, variaciones, muestra revisada y advertencias; workflow T11 por umbral de importe total… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.lotes.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de lote de facturación (`billingRuns`).
- **Pantallas:** PAN-FAC-01 (Tablero de facturación), PAN-FAC-05 (Lotes), PAN-FAC-07 (Detalle de lote).
- **Ola:** O4 · **Fuente:** M05 §11.2 Lotes y excepciones, línea 1806 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Lotes%20y%20excepciones/API-FAC-052)

<a id="API-FAC-053"></a>
#### API-FAC-053 · `POST /api/admin/fac/runs/{id}/approve`

- **Qué hace:** Aprobar (o iniciar workflow T11). Aprueba un registro de lote de facturación (`billingRuns`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-FAC-043: Aprobar la emisión según rol con un resumen obligatorio: universo, aptos, excepciones por motivo, totales por servicio y concepto, variaciones, muestra revisada y advertencias; workflow T11 por umbral de importe total… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.lotes.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Ola:** O4 · **Fuente:** M05 §11.2 Lotes y excepciones, línea 1807 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Lotes%20y%20excepciones/API-FAC-053)

<a id="API-FAC-054"></a>
#### API-FAC-054 · `POST /api/admin/fac/runs/{id}/revoke-approval`

- **Qué hace:** Volver a prebilled antes de emitir. Revoca la aprobación de un registro de lote de facturación (`billingRuns`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-FAC-178: Consumir cat.contract.meteringRegimeChanged (EVT-CAT-28) cuando afecta la facturación del período: volver a prefacturar los casos afectados de lotes preparados y registrar excepción si falta la lectura de retiro (RN-FAC-158). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.lotes.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Ola:** O4 · **Fuente:** M05 §11.2 Lotes y excepciones, línea 1808 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Lotes%20y%20excepciones/API-FAC-054)

<a id="API-FAC-055"></a>
#### API-FAC-055 · `POST /api/admin/fac/runs/{id}/issue`

- **Qué hace:** Emitir (202). Emite un registro de lote de facturación (`billingRuns`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-FAC-178: Consumir cat.contract.meteringRegimeChanged (EVT-CAT-28) cuando afecta la facturación del período: volver a prefacturar los casos afectados de lotes preparados y registrar excepción si falta la lectura de retiro (RN-FAC-158). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.lotes.emitir`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Ola:** O4 · **Fuente:** M05 §11.2 Lotes y excepciones, línea 1809 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Lotes%20y%20excepciones/API-FAC-055)

<a id="API-FAC-056"></a>
#### API-FAC-056 · `POST /api/admin/fac/runs/{id}/pause`

- **Qué hace:** Pausar al terminar el bloque. Pausa un registro de lote de facturación (`billingRuns`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-FAC-037: Aislar errores individuales y continuar con los casos válidos; detectar fallos sistémicos (credencial fiscal inválida, integración caída, error de configuración que afecta más de PRM-FAC-033 % del bloque) y pausar el lote en… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.lotes.pausar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Ola:** O4 · **Fuente:** M05 §11.2 Lotes y excepciones, línea 1810 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Lotes%20y%20excepciones/API-FAC-056)

<a id="API-FAC-057"></a>
#### API-FAC-057 · `POST /api/admin/fac/runs/{id}/resume`

- **Qué hace:** Reanudar desde el último bloque confirmado. Reanuda un registro de lote de facturación (`billingRuns`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-FAC-053: Reanudar procesos interrumpidos desde el último bloque confirmado, mostrando qué quedó emitido y qué pendiente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.lotes.reanudar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Ola:** O4 · **Fuente:** M05 §11.2 Lotes y excepciones, línea 1811 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Lotes%20y%20excepciones/API-FAC-057)

<a id="API-FAC-058"></a>
#### API-FAC-058 · `POST /api/admin/fac/runs/{id}/cancel`

- **Qué hace:** Cancelar (solo sin emitidos). Cancela un registro de lote de facturación (`billingRuns`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-FAC-047: Emitir en un job de fondo por bloques de tamaño configurable (PRM-FAC-035), con progreso, métricas (casos por minuto, tiempo estimado, emitidos, errores) y acciones de pausar, reanudar y cancelar lo pendiente. · RF-FAC-062: Marcar comprobantes emitidos bajo CAEA (contingencia o lotes grandes) y seguir su informe posterior que realiza M06. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.lotes.cancelar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Ola:** O4 · **Fuente:** M05 §11.2 Lotes y excepciones, línea 1812 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Lotes%20y%20excepciones/API-FAC-058)

<a id="API-FAC-059"></a>
#### API-FAC-059 · `POST /api/admin/fac/runs/{id}/reprocess`

- **Qué hace:** Crear lote reprocess con casos seleccionados o resueltos. Reprocesa un registro de lote de facturación (`billingRuns`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-FAC-155: Crear lotes de distribución por lote de emisión o selección manual, por canal, con agrupación del envío por cuenta, por socio o por socio y teléfono, y envío en tandas configurables. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.lotes.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-FAC-06 (Nuevo lote (asistente)).
- **Ola:** O4 · **Fuente:** M05 §11.2 Lotes y excepciones, línea 1813 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Lotes%20y%20excepciones/API-FAC-059)

<a id="API-FAC-060"></a>
#### API-FAC-060 · `GET /api/admin/fac/runs/{id}/numbering`

- **Qué hace:** Rangos emitidos. Consulta «numbering» de un registro de lote de facturación (`billingRuns`).
- **Para qué sirve:** RF-FAC-178: Consumir cat.contract.meteringRegimeChanged (EVT-CAT-28) cuando afecta la facturación del período: volver a prefacturar los casos afectados de lotes preparados y registrar excepción si falta la lectura de retiro (RN-FAC-158). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.lotes.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de lote de facturación (`billingRuns`).
- **Pantallas:** PAN-FAC-01 (Tablero de facturación), PAN-FAC-05 (Lotes), PAN-FAC-07 (Detalle de lote).
- **Ola:** O4 · **Fuente:** M05 §11.2 Lotes y excepciones, línea 1814 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Lotes%20y%20excepciones/API-FAC-060)

<a id="API-FAC-061"></a>
#### API-FAC-061 · `GET /api/admin/fac/runs/{id}/export`

- **Qué hace:** Exportar casos y resultados. Descarga un archivo de lote de facturación (`billingRuns`).
- **Para qué sirve:** RF-FAC-178: Consumir cat.contract.meteringRegimeChanged (EVT-CAT-28) cuando afecta la facturación del período: volver a prefacturar los casos afectados de lotes preparados y registrar excepción si falta la lectura de retiro (RN-FAC-158). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.lotes.exportar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un archivo (application/octet-stream).
- **Ola:** O4 · **Fuente:** M05 §11.2 Lotes y excepciones, línea 1815 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Lotes%20y%20excepciones/API-FAC-061)

<a id="API-FAC-062"></a>
#### API-FAC-062 · `POST /api/admin/fac/runs/{id}/overrides`

- **Qué hace:** Registrar override de validación con motivo. Registra «overrides» sobre un registro de lote de facturación (`billingRuns`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-FAC-017: Verificar prerrequisitos fiscales y de estado consultando a M06 y M17: CESP vigente si algún servicio liquida como servicio público, padrón de Ingresos Brutos vigente, comprobantes pendientes de autorización con antigüedad mayor… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.overrides.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Ola:** O4 · **Fuente:** M05 §11.2 Lotes y excepciones, línea 1816 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Lotes%20y%20excepciones/API-FAC-062)

<a id="API-FAC-063"></a>
#### API-FAC-063 · `GET /api/admin/fac/exceptions`

- **Qué hace:** Bandeja (filtra por alcance del usuario). Lista, con filtros y paginación, los registros de bandeja de excepciones (`billingExceptions`).
- **Para qué sirve:** RF-FAC-035: Ofrecer una bandeja de excepciones con caso, cliente, cuenta, servicio, contrato, período, problema o dato faltante, código de motivo, severidad, etapa, estado, responsable (rol y usuario), módulo dueño del dato, siguiente… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.excepciones.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de bandeja de excepciones (`billingExceptions`) con `total`.
- **Pantallas:** PAN-FAC-08 (Bandeja de excepciones).
- **Ola:** O4 · **Fuente:** M05 §11.2 Lotes y excepciones, línea 1817 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Lotes%20y%20excepciones/API-FAC-063)

<a id="API-FAC-064"></a>
#### API-FAC-064 · `GET /api/admin/fac/exceptions/{id}`

- **Qué hace:** Detalle con historial. Obtiene el detalle de un registro de bandeja de excepciones (`billingExceptions`).
- **Para qué sirve:** RF-FAC-035: Ofrecer una bandeja de excepciones con caso, cliente, cuenta, servicio, contrato, período, problema o dato faltante, código de motivo, severidad, etapa, estado, responsable (rol y usuario), módulo dueño del dato, siguiente… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.excepciones.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de bandeja de excepciones (`billingExceptions`).
- **Pantallas:** PAN-FAC-08 (Bandeja de excepciones).
- **Ola:** O4 · **Fuente:** M05 §11.2 Lotes y excepciones, línea 1818 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Lotes%20y%20excepciones/API-FAC-064)

<a id="API-FAC-065"></a>
#### API-FAC-065 · `POST /api/admin/fac/exceptions/{id}/assign`

- **Qué hace:** Asignar responsable. Asigna un registro de bandeja de excepciones (`billingExceptions`).
- **Para qué sirve:** RF-FAC-038: Asignar y derivar excepciones al responsable o al módulo dueño (M01 datos fiscales, M03 lecturas, M04 tarifa, M06 fiscal, M02 contrato), con notificación y plazo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.excepciones.asignar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O4 · **Fuente:** M05 §11.2 Lotes y excepciones, línea 1819 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Lotes%20y%20excepciones/API-FAC-065)

<a id="API-FAC-066"></a>
#### API-FAC-066 · `POST /api/admin/fac/exceptions/{id}/resolve`

- **Qué hace:** Marcar resuelta (verifica que el dato esté corregido en el módulo dueño). Resuelve un registro de bandeja de excepciones (`billingExceptions`).
- **Para qué sirve:** RF-FAC-035: Ofrecer una bandeja de excepciones con caso, cliente, cuenta, servicio, contrato, período, problema o dato faltante, código de motivo, severidad, etapa, estado, responsable (rol y usuario), módulo dueño del dato, siguiente… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.excepciones.resolver`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O4 · **Fuente:** M05 §11.2 Lotes y excepciones, línea 1820 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Lotes%20y%20excepciones/API-FAC-066)

<a id="API-FAC-067"></a>
#### API-FAC-067 · `POST /api/admin/fac/exceptions/{id}/discard`

- **Qué hace:** Excluir del período con causa. Descarta un registro de bandeja de excepciones (`billingExceptions`).
- **Para qué sirve:** RF-FAC-040: Excluir un caso con causa (no facturar en este período) con aprobación, o trasladarlo al próximo ciclo; ambos quedan en el acta. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.excepciones.excluir`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O4 · **Fuente:** M05 §11.2 Lotes y excepciones, línea 1821 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Lotes%20y%20excepciones/API-FAC-067)

<a id="API-FAC-068"></a>
#### API-FAC-068 · `POST /api/admin/fac/exceptions:bulk-assign`

- **Qué hace:** Asignación masiva. Registra un nuevo elemento u operación en bandeja de excepciones (`billingExceptions`).
- **Para qué sirve:** RF-FAC-038: Asignar y derivar excepciones al responsable o al módulo dueño (M01 datos fiscales, M03 lecturas, M04 tarifa, M06 fiscal, M02 contrato), con notificación y plazo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.excepciones.asignar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O4 · **Fuente:** M05 §11.2 Lotes y excepciones, línea 1822 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Lotes%20y%20excepciones/API-FAC-068)

<a id="API-FAC-158"></a>
#### API-FAC-158 · `GET /api/admin/fac/pre-review`

- **Qué hace:** Cola de revisión previa (RF-FAC-174; HUE-ELE-02). Consulta `pre-review`.
- **Para qué sirve:** RF-FAC-174: Cola de revisión previa antes de autorizar: los casos cuyas cuentas pertenecen a las categorías o condiciones especiales configuradas (PRM-FAC-161: grandes usuarios / categorías tarifarias de demanda, usuario-generador, contratos…
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.revisionPrevia.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FAC-47 (Cola de revisión previa).
- **Ola:** O7 · **Fuente:** M05 §11.2 Lotes y excepciones, línea 1823 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Lotes%20y%20excepciones/API-FAC-158)

<a id="API-FAC-159"></a>
#### API-FAC-159 · `POST /api/admin/fac/pre-review/{itemId}:decide`

- **Qué hace:** Decisión approve / return / exclude con nota (RN-FAC-154). Registra un nuevo elemento u operación en `pre-review`.
- **Para qué sirve:** RF-FAC-046: Exigir que la muestra de control haya sido marcada como revisada antes de aprobar lotes con más de PRM-FAC-034 casos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.revisionPrevia.aprobar`.
- **Recibe:** en la ruta `itemId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FAC-47 (Cola de revisión previa).
- **Ola:** O4 · **Fuente:** M05 §11.2 Lotes y excepciones, línea 1824 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Lotes%20y%20excepciones/API-FAC-159)

<a id="grupo-3"></a>

## Comprobantes

28 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-FAC-070](#API-FAC-070) | GET | `/api/admin/fac/invoices` | Buscar comprobantes. |
| [API-FAC-071](#API-FAC-071) | GET | `/api/admin/fac/invoices/{id}` | Detalle completo. |
| [API-FAC-072](#API-FAC-072) | GET | `/api/admin/fac/invoices:by-code` | Decodificar código de barras y devolver el documento. |
| [API-FAC-073](#API-FAC-073) | POST | `/api/admin/fac/drafts` | Crear borrador de factura manual. |
| [API-FAC-074](#API-FAC-074) | PATCH | `/api/admin/fac/drafts/{id}` | Editar cabecera. |
| [API-FAC-075](#API-FAC-075) | POST | `/api/admin/fac/drafts/{id}/lines` | Renglones del borrador (el borrador sí se edita y descarta). |
| [API-FAC-075-c](#API-FAC-075-c) | DELETE | `/api/admin/fac/drafts/{id}/lines/{lineId}` | Renglones del borrador (el borrador sí se edita y descarta). |
| [API-FAC-075-b](#API-FAC-075-b) | PATCH | `/api/admin/fac/drafts/{id}/lines/{lineId}` | Renglones del borrador (el borrador sí se edita y descarta). |
| [API-FAC-076](#API-FAC-076) | POST | `/api/admin/fac/drafts/{id}/calculate` | Calcular con M04/M06 y validar; devuelve advertencias. |
| [API-FAC-077](#API-FAC-077) | POST | `/api/admin/fac/drafts/{id}/issue` | Emitir el borrador. |
| [API-FAC-078](#API-FAC-078) | POST | `/api/admin/fac/invoices/{id}/replicate` | Crear borrador replicado. |
| [API-FAC-079](#API-FAC-079) | POST | `/api/admin/fac/invoices/{id}/rebill` | Iniciar refacturación puntual. |
| [API-FAC-084](#API-FAC-084) | GET | `/api/admin/fac/annulment-requests` | Seguimiento. |
| [API-FAC-080](#API-FAC-080) | POST | `/api/admin/fac/annulment-requests` | Crear solicitud (individual, rango, archivo). |
| [API-FAC-081](#API-FAC-081) | POST | `/api/admin/fac/annulment-requests/{id}/evaluate` | Evaluar permitidos y excluidos. |
| [API-FAC-082](#API-FAC-082) | POST | `/api/admin/fac/annulment-requests/{id}/submit` | Enviar a aprobación. |
| [API-FAC-083](#API-FAC-083) | POST | `/api/admin/fac/annulment-requests/{id}/approve` | Aprobar o rechazar; ejecuta JOB-FAC-09. |
| [API-FAC-084-b](#API-FAC-084-b) | GET | `/api/admin/fac/annulment-requests/{id}` | Seguimiento. |
| [API-FAC-085](#API-FAC-085) | POST | `/api/admin/fac/invoices/{id}/debit-note` | ND de ajuste relacionada. |
| [API-FAC-086](#API-FAC-086) | GET | `/api/admin/fac/invoices/{id}/relations` | Consultar y registrar relaciones manuales. |
| [API-FAC-086-b](#API-FAC-086-b) | PUT | `/api/admin/fac/invoices/{id}/relations` | Consultar y registrar relaciones manuales. |
| [API-FAC-087](#API-FAC-087) | POST | `/api/admin/fac/holds` | Bloquear comprobantes o cuenta. |
| [API-FAC-088](#API-FAC-088) | POST | `/api/admin/fac/hold-releases` | Desbloquear. |
| [API-FAC-089](#API-FAC-089) | GET | `/api/admin/fac/invoices/{id}/holds` | Historial de bloqueos. |
| [API-FAC-090](#API-FAC-090) | PATCH | `/api/admin/fac/invoices/{id}/observations` | Observaciones (dato no fiscal, auditado). |
| [API-FAC-091](#API-FAC-091) | GET | `/api/admin/fac/invoices/{id}/pdf` | Descarga (URL firmada). |
| [API-FAC-092](#API-FAC-092) | POST | `/api/admin/fac/invoices/{id}/reprint` | Duplicado con motivo y cargo opcional. |
| [API-FAC-093](#API-FAC-093) | POST | `/api/admin/fac/invoices/{id}/resend` | Reenviar por canal. |

<a id="API-FAC-070"></a>
#### API-FAC-070 · `GET /api/admin/fac/invoices`

- **Qué hace:** Buscar comprobantes. Lista, con filtros y paginación, los registros de comprobante emitido con renglones embebidos (`invoices`).
- **Para qué sirve:** RF-FAC-042: Conservar la relación entre caso original, corrección, ejecución nueva y comprobantes emitidos. · RF-FAC-128: Replicar un comprobante como borrador nuevo copiando cabecera y renglones (todos los ítems si PRM-FAC-051 lo permite), con fechas actuales. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.comprobantes.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de comprobante emitido con renglones embebidos (`invoices`) con `total`.
- **Pantallas:** PAN-FAC-09 (Comprobantes), PAN-FAC-10 (Detalle de comprobante), PAN-FAC-38 (Comprobantes de administración pública).
- **Ola:** O4 · **Fuente:** M05 §11.3 Comprobantes, línea 1830 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Comprobantes/API-FAC-070)

<a id="API-FAC-071"></a>
#### API-FAC-071 · `GET /api/admin/fac/invoices/{id}`

- **Qué hace:** Detalle completo. Obtiene el detalle de un registro de comprobante emitido con renglones embebidos (`invoices`).
- **Para qué sirve:** RF-FAC-041: Distinguir y contar por separado: prevalidación bloqueada, rechazo fiscal, emitido con observaciones, incierto, excluido con motivo, pendiente; nunca ocultarlos bajo un "lote completado". *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.comprobantes.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de comprobante emitido con renglones embebidos (`invoices`).
- **Pantallas:** PAN-FAC-09 (Comprobantes), PAN-FAC-10 (Detalle de comprobante), PAN-FAC-38 (Comprobantes de administración pública).
- **Ola:** O4 · **Fuente:** M05 §11.3 Comprobantes, línea 1831 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Comprobantes/API-FAC-071)

<a id="API-FAC-072"></a>
#### API-FAC-072 · `GET /api/admin/fac/invoices:by-code`

- **Qué hace:** Decodificar código de barras y devolver el documento. Consulta comprobante emitido con renglones embebidos (`invoices`).
- **Para qué sirve:** RF-FAC-148: Probador de formatos: generar el código de un comprobante, decodificar un código y comparar con el generado por ProCoop durante el paralelo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.comprobantes.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: el registro de comprobante emitido con renglones embebidos (`invoices`).
- **Pantallas:** PAN-FAC-09 (Comprobantes), PAN-FAC-10 (Detalle de comprobante), PAN-FAC-38 (Comprobantes de administración pública).
- **Ola:** O4 · **Fuente:** M05 §11.3 Comprobantes, línea 1832 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Comprobantes/API-FAC-072)

<a id="API-FAC-073"></a>
#### API-FAC-073 · `POST /api/admin/fac/drafts`

- **Qué hace:** Crear borrador de factura manual. Da de alta un registro de borradores de factura manual (`invoiceDrafts`).
- **Para qué sirve:** RF-FAC-128: Replicar un comprobante como borrador nuevo copiando cabecera y renglones (todos los ítems si PRM-FAC-051 lo permite), con fechas actuales. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.comprobantes.crear`.
- **Recibe:** los datos de borradores de factura manual (`invoiceDrafts`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de borradores de factura manual (`invoiceDrafts`).
- **Pantallas:** PAN-FAC-11 (Factura manual).
- **Ola:** O4 · **Fuente:** M05 §11.3 Comprobantes, línea 1833 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Comprobantes/API-FAC-073)

<a id="API-FAC-074"></a>
#### API-FAC-074 · `PATCH /api/admin/fac/drafts/{id}`

- **Qué hace:** Editar cabecera. Modifica algunos campos de un registro de borradores de factura manual (`invoiceDrafts`) (solo los enviados).
- **Para qué sirve:** RF-FAC-128: Replicar un comprobante como borrador nuevo copiando cabecera y renglones (todos los ítems si PRM-FAC-051 lo permite), con fechas actuales. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.comprobantes.crear`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de borradores de factura manual (`invoiceDrafts`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de borradores de factura manual (`invoiceDrafts`).
- **Pantallas:** PAN-FAC-11 (Factura manual).
- **Ola:** O4 · **Fuente:** M05 §11.3 Comprobantes, línea 1834 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Comprobantes/API-FAC-074)

<a id="API-FAC-075"></a>
#### API-FAC-075 · `POST /api/admin/fac/drafts/{id}/lines`

- **Qué hace:** Renglones del borrador (el borrador sí se edita y descarta). Agrega un elemento («lines») a un registro de borradores de factura manual (`invoiceDrafts`).
- **Para qué sirve:** RF-FAC-128: Replicar un comprobante como borrador nuevo copiando cabecera y renglones (todos los ítems si PRM-FAC-051 lo permite), con fechas actuales. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.comprobantes.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FAC-11 (Factura manual).
- **Ola:** O4 · **Fuente:** M05 §11.3 Comprobantes, línea 1835 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Comprobantes/API-FAC-075)

<a id="API-FAC-075-c"></a>
#### API-FAC-075-c · `DELETE /api/admin/fac/drafts/{id}/lines/{lineId}`

- **Qué hace:** Renglones del borrador (el borrador sí se edita y descarta). Elimina o da de baja un registro de borradores de factura manual (`invoiceDrafts`).
- **Para qué sirve:** RF-FAC-128: Replicar un comprobante como borrador nuevo copiando cabecera y renglones (todos los ítems si PRM-FAC-051 lo permite), con fechas actuales. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.comprobantes.crear`.
- **Recibe:** en la ruta `id`, `lineId`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-FAC-11 (Factura manual).
- **Ola:** O4 · **Fuente:** M05 §11.3 Comprobantes, línea 1835 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Comprobantes/API-FAC-075-c)

<a id="API-FAC-075-b"></a>
#### API-FAC-075-b · `PATCH /api/admin/fac/drafts/{id}/lines/{lineId}`

- **Qué hace:** Renglones del borrador (el borrador sí se edita y descarta). Modifica algunos campos de un registro de borradores de factura manual (`invoiceDrafts`) (solo los enviados).
- **Para qué sirve:** RF-FAC-128: Replicar un comprobante como borrador nuevo copiando cabecera y renglones (todos los ítems si PRM-FAC-051 lo permite), con fechas actuales. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.comprobantes.crear`.
- **Recibe:** en la ruta `id`, `lineId`; solo los campos a cambiar de borradores de factura manual (`invoiceDrafts`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de borradores de factura manual (`invoiceDrafts`).
- **Pantallas:** PAN-FAC-11 (Factura manual).
- **Ola:** O4 · **Fuente:** M05 §11.3 Comprobantes, línea 1835 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Comprobantes/API-FAC-075-b)

<a id="API-FAC-076"></a>
#### API-FAC-076 · `POST /api/admin/fac/drafts/{id}/calculate`

- **Qué hace:** Calcular con M04/M06 y validar; devuelve advertencias. Calcula un registro de borradores de factura manual (`invoiceDrafts`).
- **Para qué sirve:** RF-FAC-127: Validar la factura manual con todas las reglas RN-FAC-045 y RN-FAC-058 a RN-FAC-062. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.comprobantes.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FAC-11 (Factura manual).
- **Ola:** O4 · **Fuente:** M05 §11.3 Comprobantes, línea 1836 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Comprobantes/API-FAC-076)

<a id="API-FAC-077"></a>
#### API-FAC-077 · `POST /api/admin/fac/drafts/{id}/issue`

- **Qué hace:** Emitir el borrador. Emite un registro de borradores de factura manual (`invoiceDrafts`).
- **Para qué sirve:** RF-FAC-051: Al emitir cada caso: crear el comprobante inmutable con su detalle, registrar billedPeriods, consumir ítems facturables y cuotas, publicar fac.invoice.issued con una obligación por servicio para M07, solicitar autorización a M06… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.comprobantes.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FAC-11 (Factura manual).
- **Ola:** O4 · **Fuente:** M05 §11.3 Comprobantes, línea 1837 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Comprobantes/API-FAC-077)

<a id="API-FAC-078"></a>
#### API-FAC-078 · `POST /api/admin/fac/invoices/{id}/replicate`

- **Qué hace:** Crear borrador replicado. Replica un registro de comprobante emitido con renglones embebidos (`invoices`).
- **Para qué sirve:** RF-FAC-128: Replicar un comprobante como borrador nuevo copiando cabecera y renglones (todos los ítems si PRM-FAC-051 lo permite), con fechas actuales. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.comprobantes.replicar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FAC-12 (Replicar comprobante).
- **Ola:** O4 · **Fuente:** M05 §11.3 Comprobantes, línea 1838 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Comprobantes/API-FAC-078)

<a id="API-FAC-079"></a>
#### API-FAC-079 · `POST /api/admin/fac/invoices/{id}/rebill`

- **Qué hace:** Iniciar refacturación puntual. Refactura un registro de comprobante emitido con renglones embebidos (`invoices`).
- **Para qué sirve:** RF-FAC-129: Refacturar un servicio puntual sin reprocesar el lote: anula o revierte el original (según su estado), libera el período, recalcula con M04 y emite con secuencia nueva vinculada, en una operación auditada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.comprobantes.refacturar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FAC-13 (Refacturación puntual).
- **Ola:** O4 · **Fuente:** M05 §11.3 Comprobantes, línea 1839 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Comprobantes/API-FAC-079)

<a id="API-FAC-084"></a>
#### API-FAC-084 · `GET /api/admin/fac/annulment-requests`

- **Qué hace:** Seguimiento. Lista, con filtros y paginación, los registros de solicitudes de anulación o reversión (`invoiceAnnulmentRequests`).
- **Para qué sirve:** RF-FAC-100: Aplicar todas las validaciones de anulación y reversión (RN-FAC-073 a RN-FAC-083). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.comprobantes.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de solicitudes de anulación o reversión (`invoiceAnnulmentRequests`) con `total`.
- **Pantallas:** PAN-FAC-09 (Comprobantes), PAN-FAC-10 (Detalle de comprobante), PAN-FAC-38 (Comprobantes de administración pública).
- **Ola:** O4 · **Fuente:** M05 §11.3 Comprobantes, línea 1844 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Comprobantes/API-FAC-084)

<a id="API-FAC-080"></a>
#### API-FAC-080 · `POST /api/admin/fac/annulment-requests`

- **Qué hace:** Crear solicitud (individual, rango, archivo). Da de alta un registro de solicitudes de anulación o reversión (`invoiceAnnulmentRequests`).
- **Para qué sirve:** RF-FAC-100: Aplicar todas las validaciones de anulación y reversión (RN-FAC-073 a RN-FAC-083). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.comprobantes.anular`.
- **Recibe:** los datos de solicitudes de anulación o reversión (`invoiceAnnulmentRequests`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de solicitudes de anulación o reversión (`invoiceAnnulmentRequests`).
- **Pantallas:** PAN-FAC-14 (Anulación y reversión).
- **Ola:** O4 · **Fuente:** M05 §11.3 Comprobantes, línea 1840 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Comprobantes/API-FAC-080)

<a id="API-FAC-081"></a>
#### API-FAC-081 · `POST /api/admin/fac/annulment-requests/{id}/evaluate`

- **Qué hace:** Evaluar permitidos y excluidos. Evalúa un registro de solicitudes de anulación o reversión (`invoiceAnnulmentRequests`).
- **Para qué sirve:** RF-FAC-100: Aplicar todas las validaciones de anulación y reversión (RN-FAC-073 a RN-FAC-083). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.comprobantes.anular`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FAC-14 (Anulación y reversión).
- **Ola:** O4 · **Fuente:** M05 §11.3 Comprobantes, línea 1841 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Comprobantes/API-FAC-081)

<a id="API-FAC-082"></a>
#### API-FAC-082 · `POST /api/admin/fac/annulment-requests/{id}/submit`

- **Qué hace:** Enviar a aprobación. Envía a revisión o presenta un registro de solicitudes de anulación o reversión (`invoiceAnnulmentRequests`).
- **Para qué sirve:** RF-FAC-100: Aplicar todas las validaciones de anulación y reversión (RN-FAC-073 a RN-FAC-083). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.comprobantes.anular`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FAC-14 (Anulación y reversión).
- **Ola:** O4 · **Fuente:** M05 §11.3 Comprobantes, línea 1842 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Comprobantes/API-FAC-082)

<a id="API-FAC-083"></a>
#### API-FAC-083 · `POST /api/admin/fac/annulment-requests/{id}/approve`

- **Qué hace:** Aprobar o rechazar; ejecuta JOB-FAC-09. Aprueba un registro de solicitudes de anulación o reversión (`invoiceAnnulmentRequests`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-FAC-100: Aplicar todas las validaciones de anulación y reversión (RN-FAC-073 a RN-FAC-083). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.anulaciones.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Ola:** O4 · **Fuente:** M05 §11.3 Comprobantes, línea 1843 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Comprobantes/API-FAC-083)

<a id="API-FAC-084-b"></a>
#### API-FAC-084-b · `GET /api/admin/fac/annulment-requests/{id}`

- **Qué hace:** Seguimiento. Obtiene el detalle de un registro de solicitudes de anulación o reversión (`invoiceAnnulmentRequests`).
- **Para qué sirve:** RF-FAC-100: Aplicar todas las validaciones de anulación y reversión (RN-FAC-073 a RN-FAC-083). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.comprobantes.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de solicitudes de anulación o reversión (`invoiceAnnulmentRequests`).
- **Pantallas:** PAN-FAC-09 (Comprobantes), PAN-FAC-10 (Detalle de comprobante), PAN-FAC-38 (Comprobantes de administración pública).
- **Ola:** O4 · **Fuente:** M05 §11.3 Comprobantes, línea 1844 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Comprobantes/API-FAC-084-b)

<a id="API-FAC-085"></a>
#### API-FAC-085 · `POST /api/admin/fac/invoices/{id}/debit-note`

- **Qué hace:** ND de ajuste relacionada. Emite una nota de débito sobre un registro de comprobante emitido con renglones embebidos (`invoices`).
- **Para qué sirve:** RF-FAC-042: Conservar la relación entre caso original, corrección, ejecución nueva y comprobantes emitidos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.notasDebito.emitir`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O4 · **Fuente:** M05 §11.3 Comprobantes, línea 1845 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Comprobantes/API-FAC-085)

<a id="API-FAC-086"></a>
#### API-FAC-086 · `GET /api/admin/fac/invoices/{id}/relations`

- **Qué hace:** Consultar y registrar relaciones manuales. Consulta «relations» de un registro de comprobante emitido con renglones embebidos (`invoices`).
- **Para qué sirve:** RF-FAC-131: Al cargar un crédito manual, sugerir, obligar o ignorar la relación con el comprobante de origen según PRM-FAC-052. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.relaciones.editar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de comprobante emitido con renglones embebidos (`invoices`).
- **Pantallas:** PAN-FAC-15 (Relaciones del comprobante).
- **Ola:** O4 · **Fuente:** M05 §11.3 Comprobantes, línea 1846 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Comprobantes/API-FAC-086)

<a id="API-FAC-086-b"></a>
#### API-FAC-086-b · `PUT /api/admin/fac/invoices/{id}/relations`

- **Qué hace:** Consultar y registrar relaciones manuales. Reemplaza o configura comprobante emitido con renglones embebidos (`invoices`).
- **Para qué sirve:** RF-FAC-131: Al cargar un crédito manual, sugerir, obligar o ignorar la relación con el comprobante de origen según PRM-FAC-052. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.relaciones.editar`.
- **Recibe:** en la ruta `id`; los datos de comprobante emitido con renglones embebidos (`invoices`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de comprobante emitido con renglones embebidos (`invoices`).
- **Pantallas:** PAN-FAC-15 (Relaciones del comprobante).
- **Ola:** O4 · **Fuente:** M05 §11.3 Comprobantes, línea 1846 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Comprobantes/API-FAC-086-b)

<a id="API-FAC-087"></a>
#### API-FAC-087 · `POST /api/admin/fac/holds`

- **Qué hace:** Bloquear comprobantes o cuenta. Registra un nuevo elemento u operación en `holds`.
- **Para qué sirve:** RF-FAC-096: Propagar automáticamente, al emitir un lote, el bloqueo de cobro a los comprobantes nuevos de cuentas que ya tienen comprobantes bloqueados, con la causa de menor código. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.bloqueos.bloquear`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FAC-16 (Bloqueo de comprobantes).
- **Ola:** O4 · **Fuente:** M05 §11.3 Comprobantes, línea 1847 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Comprobantes/API-FAC-087)

<a id="API-FAC-088"></a>
#### API-FAC-088 · `POST /api/admin/fac/hold-releases`

- **Qué hace:** Desbloquear. Registra un nuevo elemento u operación en `hold-releases`.
- **Para qué sirve:** RF-FAC-095: Bloquear o desbloquear con cobro de intereses: en la misma operación se pide a M08 la emisión del comprobante de intereses (porcentaje y concepto configurables). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.bloqueos.desbloquear`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O5 · **Fuente:** M05 §11.3 Comprobantes, línea 1848 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Comprobantes/API-FAC-088)

<a id="API-FAC-089"></a>
#### API-FAC-089 · `GET /api/admin/fac/invoices/{id}/holds`

- **Qué hace:** Historial de bloqueos. Lista, con filtros y paginación, los registros de comprobante emitido con renglones embebidos (`invoices`).
- **Para qué sirve:** RF-FAC-094: Bloquear y desbloquear comprobantes impagos en forma individual y masiva con filtros (cuenta, titular, tipo, fecha de emisión, vencimiento), registrando historial con fecha, causa, usuario y motivo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.comprobantes.ver`.
- **Recibe:** en la ruta `id`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de comprobante emitido con renglones embebidos (`invoices`) con `total`.
- **Pantallas:** PAN-FAC-09 (Comprobantes), PAN-FAC-10 (Detalle de comprobante), PAN-FAC-38 (Comprobantes de administración pública).
- **Ola:** O4 · **Fuente:** M05 §11.3 Comprobantes, línea 1849 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Comprobantes/API-FAC-089)

<a id="API-FAC-090"></a>
#### API-FAC-090 · `PATCH /api/admin/fac/invoices/{id}/observations`

- **Qué hace:** Observaciones (dato no fiscal, auditado). Modifica algunos campos de un registro de comprobante emitido con renglones embebidos (`invoices`) (solo los enviados).
- **Para qué sirve:** RF-FAC-061: Reflejar rechazos y observaciones: un rechazo abre excepción "rechazo fiscal" con el código de ARCA; una observación se registra en el comprobante emitido y no habilita reemitir. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.comprobantes.crear`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de comprobante emitido con renglones embebidos (`invoices`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de comprobante emitido con renglones embebidos (`invoices`).
- **Pantallas:** PAN-FAC-11 (Factura manual).
- **Ola:** O4 · **Fuente:** M05 §11.3 Comprobantes, línea 1850 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Comprobantes/API-FAC-090)

<a id="API-FAC-091"></a>
#### API-FAC-091 · `GET /api/admin/fac/invoices/{id}/pdf`

- **Qué hace:** Descarga (URL firmada). Descarga un archivo de comprobante emitido con renglones embebidos (`invoices`).
- **Para qué sirve:** RF-FAC-168: PWA del socio: lista de comprobantes de sus cuentas autorizadas con apertura por servicio, estado de pago (de M07), vencimiento e importe vigente según la fecha, descarga del PDF y acceso a pagar (M07). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.comprobantes.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un archivo (application/pdf).
- **Pantallas:** PAN-FAC-09 (Comprobantes), PAN-FAC-10 (Detalle de comprobante), PAN-FAC-38 (Comprobantes de administración pública).
- **Ola:** O4 · **Fuente:** M05 §11.3 Comprobantes, línea 1851 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Comprobantes/API-FAC-091)

<a id="API-FAC-092"></a>
#### API-FAC-092 · `POST /api/admin/fac/invoices/{id}/reprint`

- **Qué hace:** Duplicado con motivo y cargo opcional. Reimprime un registro de comprobante emitido con renglones embebidos (`invoices`).
- **Para qué sirve:** RF-FAC-138: Reimprimir o generar duplicado con marca visible "duplicado"; cargo por reimpresión opcional (PRM-FAC-053). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.comprobantes.reimprimir`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O4 · **Fuente:** M05 §11.3 Comprobantes, línea 1852 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Comprobantes/API-FAC-092)

<a id="API-FAC-093"></a>
#### API-FAC-093 · `POST /api/admin/fac/invoices/{id}/resend`

- **Qué hace:** Reenviar por canal. Reenvía un registro de comprobante emitido con renglones embebidos (`invoices`).
- **Para qué sirve:** RF-FAC-042: Conservar la relación entre caso original, corrección, ejecución nueva y comprobantes emitidos. · RF-FAC-128: Replicar un comprobante como borrador nuevo copiando cabecera y renglones (todos los ítems si PRM-FAC-051 lo permite), con fechas actuales. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.comprobantes.reenviar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O4 · **Fuente:** M05 §11.3 Comprobantes, línea 1853 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Comprobantes/API-FAC-093)

<a id="grupo-4"></a>

## Operaciones masivas, cargos e importaciones

17 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-FAC-100](#API-FAC-100) | POST | `/api/admin/fac/mass-operations` | Crear operación. |
| [API-FAC-101](#API-FAC-101) | POST | `/api/admin/fac/mass-operations/{id}/preview` | Simulación (202). |
| [API-FAC-102](#API-FAC-102) | GET | `/api/admin/fac/mass-operations/{id}/items` | Antes/después por objetivo. |
| [API-FAC-103](#API-FAC-103) | POST | `/api/admin/fac/mass-operations/{id}/approve` | Aprobar y aplicar (202). |
| [API-FAC-104](#API-FAC-104) | POST | `/api/admin/fac/mass-operations/{id}/cancel` | Cancelar antes de aplicar. |
| [API-FAC-105](#API-FAC-105) | GET | `/api/admin/fac/billable-items` | Ítems facturables manuales. |
| [API-FAC-105-b](#API-FAC-105-b) | POST | `/api/admin/fac/billable-items` | Ítems facturables manuales. |
| [API-FAC-105-c](#API-FAC-105-c) | GET | `/api/admin/fac/billable-items/{id}` | Ítems facturables manuales. |
| [API-FAC-105-d](#API-FAC-105-d) | PATCH | `/api/admin/fac/billable-items/{id}` | Ítems facturables manuales. |
| [API-FAC-106](#API-FAC-106) | POST | `/api/admin/fac/billable-items/{id}/void` | Anular cargo no facturado. |
| [API-FAC-107](#API-FAC-107) | POST | `/api/admin/fac/imports` | Subir archivo con formato. |
| [API-FAC-108](#API-FAC-108) | GET | `/api/admin/fac/imports/{id}/rows` | Filas con errores. |
| [API-FAC-109](#API-FAC-109) | POST | `/api/admin/fac/imports/{id}/confirm` | Aplicar (202). |
| [API-FAC-110-b](#API-FAC-110-b) | GET | `/api/admin/fac/cvlp` | Proceso CVLP (O10). |
| [API-FAC-110](#API-FAC-110) | POST | `/api/admin/fac/cvlp` | Proceso CVLP (O10). |
| [API-FAC-110-c](#API-FAC-110-c) | GET | `/api/admin/fac/cvlp/{id}` | Proceso CVLP (O10). |
| [API-FAC-110-d](#API-FAC-110-d) | POST | `/api/admin/fac/cvlp/{id}/finalize` | Proceso CVLP (O10). |

<a id="API-FAC-100"></a>
#### API-FAC-100 · `POST /api/admin/fac/mass-operations`

- **Qué hace:** Crear operación. Da de alta un registro de operaciones masivas (`massOperations`).
- **Para qué sirve:** RF-FAC-115: Proveer el motor genérico de operaciones masivas (borrador, vista previa, aprobación, aplicación por bloques, resultado por ítem) para que M11 implemente la modificación de cuotas pendientes (importe por porcentaje, costo del… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.modificacionMasiva.crear`.
- **Recibe:** los datos de operaciones masivas (`massOperations`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de operaciones masivas (`massOperations`).
- **Pantallas:** PAN-FAC-18 (Modificación masiva).
- **Ola:** O4 · **Fuente:** M05 §11.4 Operaciones masivas, cargos e importaciones, línea 1859 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Operaciones%20masivas%2C%20cargos%20e%20importaciones/API-FAC-100)

<a id="API-FAC-101"></a>
#### API-FAC-101 · `POST /api/admin/fac/mass-operations/{id}/preview`

- **Qué hace:** Simulación (202). Previsualiza sin efectos un registro de operaciones masivas (`massOperations`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-FAC-115: Proveer el motor genérico de operaciones masivas (borrador, vista previa, aprobación, aplicación por bloques, resultado por ítem) para que M11 implemente la modificación de cuotas pendientes (importe por porcentaje, costo del… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.modificacionMasiva.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-FAC-18 (Modificación masiva).
- **Ola:** O4 · **Fuente:** M05 §11.4 Operaciones masivas, cargos e importaciones, línea 1860 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Operaciones%20masivas%2C%20cargos%20e%20importaciones/API-FAC-101)

<a id="API-FAC-102"></a>
#### API-FAC-102 · `GET /api/admin/fac/mass-operations/{id}/items`

- **Qué hace:** Antes/después por objetivo. Lista, con filtros y paginación, los registros de ítems facturables pendientes (`billableItems`).
- **Para qué sirve:** RF-FAC-115: Proveer el motor genérico de operaciones masivas (borrador, vista previa, aprobación, aplicación por bloques, resultado por ítem) para que M11 implemente la modificación de cuotas pendientes (importe por porcentaje, costo del… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.modificacionMasiva.crear`.
- **Recibe:** en la ruta `id`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ítems facturables pendientes (`billableItems`) con `total`.
- **Pantallas:** PAN-FAC-18 (Modificación masiva).
- **Ola:** O4 · **Fuente:** M05 §11.4 Operaciones masivas, cargos e importaciones, línea 1861 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Operaciones%20masivas%2C%20cargos%20e%20importaciones/API-FAC-102)

<a id="API-FAC-103"></a>
#### API-FAC-103 · `POST /api/admin/fac/mass-operations/{id}/approve`

- **Qué hace:** Aprobar y aplicar (202). Aprueba un registro de operaciones masivas (`massOperations`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-FAC-115: Proveer el motor genérico de operaciones masivas (borrador, vista previa, aprobación, aplicación por bloques, resultado por ítem) para que M11 implemente la modificación de cuotas pendientes (importe por porcentaje, costo del… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.modificacionMasiva.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Ola:** O4 · **Fuente:** M05 §11.4 Operaciones masivas, cargos e importaciones, línea 1862 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Operaciones%20masivas%2C%20cargos%20e%20importaciones/API-FAC-103)

<a id="API-FAC-104"></a>
#### API-FAC-104 · `POST /api/admin/fac/mass-operations/{id}/cancel`

- **Qué hace:** Cancelar antes de aplicar. Cancela un registro de operaciones masivas (`massOperations`).
- **Para qué sirve:** RF-FAC-115: Proveer el motor genérico de operaciones masivas (borrador, vista previa, aprobación, aplicación por bloques, resultado por ítem) para que M11 implemente la modificación de cuotas pendientes (importe por porcentaje, costo del… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.modificacionMasiva.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FAC-18 (Modificación masiva).
- **Ola:** O4 · **Fuente:** M05 §11.4 Operaciones masivas, cargos e importaciones, línea 1863 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Operaciones%20masivas%2C%20cargos%20e%20importaciones/API-FAC-104)

<a id="API-FAC-105"></a>
#### API-FAC-105 · `GET /api/admin/fac/billable-items`

- **Qué hace:** Ítems facturables manuales. Lista, con filtros y paginación, los registros de ítems facturables pendientes (`billableItems`).
- **Para qué sirve:** RF-FAC-116: Mantener la cola de ítems facturables (cargos manuales, retroactivos, importaciones de terceros, cuotas e intereses diferidos expuestos por M11/M08, cargos de técnica) con cuenta, contrato/servicio, concepto, cantidad, precio… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.cargos.crear`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ítems facturables pendientes (`billableItems`) con `total`.
- **Pantallas:** PAN-FAC-21 (Cargos pendientes).
- **Ola:** O4 · **Fuente:** M05 §11.4 Operaciones masivas, cargos e importaciones, línea 1864 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Operaciones%20masivas%2C%20cargos%20e%20importaciones/API-FAC-105)

<a id="API-FAC-105-b"></a>
#### API-FAC-105-b · `POST /api/admin/fac/billable-items`

- **Qué hace:** Ítems facturables manuales. Da de alta un registro de ítems facturables pendientes (`billableItems`).
- **Para qué sirve:** RF-FAC-116: Mantener la cola de ítems facturables (cargos manuales, retroactivos, importaciones de terceros, cuotas e intereses diferidos expuestos por M11/M08, cargos de técnica) con cuenta, contrato/servicio, concepto, cantidad, precio… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.cargos.crear`.
- **Recibe:** los datos de ítems facturables pendientes (`billableItems`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de ítems facturables pendientes (`billableItems`).
- **Pantallas:** PAN-FAC-21 (Cargos pendientes).
- **Ola:** O4 · **Fuente:** M05 §11.4 Operaciones masivas, cargos e importaciones, línea 1864 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Operaciones%20masivas%2C%20cargos%20e%20importaciones/API-FAC-105-b)

<a id="API-FAC-105-c"></a>
#### API-FAC-105-c · `GET /api/admin/fac/billable-items/{id}`

- **Qué hace:** Ítems facturables manuales. Obtiene el detalle de un registro de ítems facturables pendientes (`billableItems`).
- **Para qué sirve:** RF-FAC-116: Mantener la cola de ítems facturables (cargos manuales, retroactivos, importaciones de terceros, cuotas e intereses diferidos expuestos por M11/M08, cargos de técnica) con cuenta, contrato/servicio, concepto, cantidad, precio… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.cargos.crear`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de ítems facturables pendientes (`billableItems`).
- **Pantallas:** PAN-FAC-21 (Cargos pendientes).
- **Ola:** O4 · **Fuente:** M05 §11.4 Operaciones masivas, cargos e importaciones, línea 1864 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Operaciones%20masivas%2C%20cargos%20e%20importaciones/API-FAC-105-c)

<a id="API-FAC-105-d"></a>
#### API-FAC-105-d · `PATCH /api/admin/fac/billable-items/{id}`

- **Qué hace:** Ítems facturables manuales. Modifica algunos campos de un registro de ítems facturables pendientes (`billableItems`) (solo los enviados).
- **Para qué sirve:** RF-FAC-116: Mantener la cola de ítems facturables (cargos manuales, retroactivos, importaciones de terceros, cuotas e intereses diferidos expuestos por M11/M08, cargos de técnica) con cuenta, contrato/servicio, concepto, cantidad, precio… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.cargos.crear`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de ítems facturables pendientes (`billableItems`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de ítems facturables pendientes (`billableItems`).
- **Pantallas:** PAN-FAC-21 (Cargos pendientes).
- **Ola:** O4 · **Fuente:** M05 §11.4 Operaciones masivas, cargos e importaciones, línea 1864 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Operaciones%20masivas%2C%20cargos%20e%20importaciones/API-FAC-105-d)

<a id="API-FAC-106"></a>
#### API-FAC-106 · `POST /api/admin/fac/billable-items/{id}/void`

- **Qué hace:** Anular cargo no facturado. Anula un registro de ítems facturables pendientes (`billableItems`).
- **Para qué sirve:** RF-FAC-101: Liberar al anular o revertir lo que el comprobante consumió: consumos, cargos pendientes, cuotas, llamadas e internacionales, presupuestos, anticipos aplicados, franqueo, redondeo acumulado, registro de capital, conceptos de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.cargos.anular`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O4 · **Fuente:** M05 §11.4 Operaciones masivas, cargos e importaciones, línea 1865 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Operaciones%20masivas%2C%20cargos%20e%20importaciones/API-FAC-106)

<a id="API-FAC-107"></a>
#### API-FAC-107 · `POST /api/admin/fac/imports`

- **Qué hace:** Subir archivo con formato. Da de alta un registro de importaciones de facturación (`billingImports`).
- **Para qué sirve:** RF-FAC-014: Importar la lista de cuentas de un lote "varias cuentas" desde Excel con el asistente genérico (subir, previsualizar errores, confirmar). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.importaciones.crear`.
- **Recibe:** los datos de importaciones de facturación (`billingImports`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de importaciones de facturación (`billingImports`).
- **Pantallas:** PAN-FAC-22 (Importaciones de terceros).
- **Ola:** O4 · **Fuente:** M05 §11.4 Operaciones masivas, cargos e importaciones, línea 1866 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Operaciones%20masivas%2C%20cargos%20e%20importaciones/API-FAC-107)

<a id="API-FAC-108"></a>
#### API-FAC-108 · `GET /api/admin/fac/imports/{id}/rows`

- **Qué hace:** Filas con errores. Lista, con filtros y paginación, los registros de filas importadas (`billingImportRows`).
- **Para qué sirve:** RF-FAC-115: Proveer el motor genérico de operaciones masivas (borrador, vista previa, aprobación, aplicación por bloques, resultado por ítem) para que M11 implemente la modificación de cuotas pendientes (importe por porcentaje, costo del… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.importaciones.crear`.
- **Recibe:** en la ruta `id`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de filas importadas (`billingImportRows`) con `total`.
- **Pantallas:** PAN-FAC-22 (Importaciones de terceros).
- **Ola:** O4 · **Fuente:** M05 §11.4 Operaciones masivas, cargos e importaciones, línea 1867 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Operaciones%20masivas%2C%20cargos%20e%20importaciones/API-FAC-108)

<a id="API-FAC-109"></a>
#### API-FAC-109 · `POST /api/admin/fac/imports/{id}/confirm`

- **Qué hace:** Aplicar (202). Confirma un registro de importaciones de facturación (`billingImports`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-FAC-115: Proveer el motor genérico de operaciones masivas (borrador, vista previa, aprobación, aplicación por bloques, resultado por ítem) para que M11 implemente la modificación de cuotas pendientes (importe por porcentaje, costo del… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.importaciones.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-FAC-22 (Importaciones de terceros).
- **Ola:** O4 · **Fuente:** M05 §11.4 Operaciones masivas, cargos e importaciones, línea 1868 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Operaciones%20masivas%2C%20cargos%20e%20importaciones/API-FAC-109)

<a id="API-FAC-110-b"></a>
#### API-FAC-110-b · `GET /api/admin/fac/cvlp`

- **Qué hace:** Proceso CVLP (O10). Consulta `cvlp`.
- **Para qué sirve:** RF-FAC-115: Proveer el motor genérico de operaciones masivas (borrador, vista previa, aprobación, aplicación por bloques, resultado por ítem) para que M11 implemente la modificación de cuotas pendientes (importe por porcentaje, costo del… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.cvlp.crear`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O4 · **Fuente:** M05 §11.4 Operaciones masivas, cargos e importaciones, línea 1869 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Operaciones%20masivas%2C%20cargos%20e%20importaciones/API-FAC-110-b)

<a id="API-FAC-110"></a>
#### API-FAC-110 · `POST /api/admin/fac/cvlp`

- **Qué hace:** Proceso CVLP (O10). Registra un nuevo elemento u operación en `cvlp`.
- **Para qué sirve:** RF-FAC-115: Proveer el motor genérico de operaciones masivas (borrador, vista previa, aprobación, aplicación por bloques, resultado por ítem) para que M11 implemente la modificación de cuotas pendientes (importe por porcentaje, costo del… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.cvlp.crear`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O4 · **Fuente:** M05 §11.4 Operaciones masivas, cargos e importaciones, línea 1869 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Operaciones%20masivas%2C%20cargos%20e%20importaciones/API-FAC-110)

<a id="API-FAC-110-c"></a>
#### API-FAC-110-c · `GET /api/admin/fac/cvlp/{id}`

- **Qué hace:** Proceso CVLP (O10). Obtiene el detalle de un registro de `cvlp`.
- **Para qué sirve:** RF-FAC-115: Proveer el motor genérico de operaciones masivas (borrador, vista previa, aprobación, aplicación por bloques, resultado por ítem) para que M11 implemente la modificación de cuotas pendientes (importe por porcentaje, costo del… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.cvlp.crear`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O4 · **Fuente:** M05 §11.4 Operaciones masivas, cargos e importaciones, línea 1869 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Operaciones%20masivas%2C%20cargos%20e%20importaciones/API-FAC-110-c)

<a id="API-FAC-110-d"></a>
#### API-FAC-110-d · `POST /api/admin/fac/cvlp/{id}/finalize`

- **Qué hace:** Proceso CVLP (O10). Finaliza un registro de `finalize`.
- **Para qué sirve:** RF-FAC-115: Proveer el motor genérico de operaciones masivas (borrador, vista previa, aprobación, aplicación por bloques, resultado por ítem) para que M11 implemente la modificación de cuotas pendientes (importe por porcentaje, costo del… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.cvlp.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O4 · **Fuente:** M05 §11.4 Operaciones masivas, cargos e importaciones, línea 1869 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Operaciones%20masivas%2C%20cargos%20e%20importaciones/API-FAC-110-d)

<a id="grupo-5"></a>

## Distribución, talones y cierre

24 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-FAC-121](#API-FAC-121) | GET | `/api/admin/fac/distribution-runs` | Seguimiento con conteos. |
| [API-FAC-120](#API-FAC-120) | POST | `/api/admin/fac/distribution-runs` | Crear corrida de distribución (lote o selección). |
| [API-FAC-121-b](#API-FAC-121-b) | GET | `/api/admin/fac/distribution-runs/{id}` | Seguimiento con conteos. |
| [API-FAC-122](#API-FAC-122) | GET | `/api/admin/fac/distribution-runs/{id}/deliveries` | Entregas por estado (destino enmascarado). |
| [API-FAC-123](#API-FAC-123) | POST | `/api/admin/fac/distribution-runs/{id}/retry` | Reintentar fallidas. |
| [API-FAC-124](#API-FAC-124) | GET | `/api/admin/fac/distribution-runs/{id}/print-file` | PDF/archivo de imprenta ordenado (URL firmada). |
| [API-FAC-125](#API-FAC-125) | POST | `/api/admin/fac/distribution-runs/{id}/printed` | Marcar impreso y entregado a rutas. |
| [API-FAC-126](#API-FAC-126) | POST | `/api/fac/delivery/deliveries:sync` | Sincronizar entregas offline (lote de mutaciones con clientMutationId). |
| [API-FAC-127](#API-FAC-127) | GET | `/api/fac/delivery/my-route` | Ruta del repartidor para cache offline. |
| [API-FAC-129](#API-FAC-129) | GET | `/api/admin/fac/payment-slips` | Consultar con pagos. |
| [API-FAC-128](#API-FAC-128) | POST | `/api/admin/fac/payment-slips` | Generar talón sumado o de cuotas. |
| [API-FAC-129-b](#API-FAC-129-b) | GET | `/api/admin/fac/payment-slips/{id}` | Consultar con pagos. |
| [API-FAC-130](#API-FAC-130) | POST | `/api/admin/fac/payment-slips/{id}/void` | Anular no pagado. |
| [API-FAC-131](#API-FAC-131) | POST | `/api/admin/fac/postage` | Generar cargos de franqueo. |
| [API-FAC-133](#API-FAC-133) | GET | `/api/admin/fac/cycle-closures` | Consultar actas. |
| [API-FAC-132](#API-FAC-132) | POST | `/api/admin/fac/cycle-closures` | Proponer acta (calcula cuadre). |
| [API-FAC-133-b](#API-FAC-133-b) | GET | `/api/admin/fac/cycle-closures/{id}` | Consultar actas. |
| [API-FAC-134](#API-FAC-134) | POST | `/api/admin/fac/cycle-closures/{id}/submit` | Enviar a aprobación. |
| [API-FAC-135](#API-FAC-135) | POST | `/api/admin/fac/cycle-closures/{id}/approve` | Aprobar (JOB-FAC-15). |
| [API-FAC-136](#API-FAC-136) | POST | `/api/admin/fac/cycle-closures/{id}/reopen` | Reabrir con motivo. |
| [API-FAC-137](#API-FAC-137) | GET | `/api/admin/fac/cycle-closures/{id}/minutes.pdf` | Descargar acta. |
| [API-FAC-138](#API-FAC-138) | GET | `/api/admin/fac/reports/{report}` | Reportes de §15 (exportar con fac.reportes.exportar). |
| [API-FAC-139](#API-FAC-139) | GET | `/api/admin/fac/delivery-preferences/{holderId}` | Preferencias de entrega del titular. |
| [API-FAC-139-b](#API-FAC-139-b) | PUT | `/api/admin/fac/delivery-preferences/{holderId}` | Preferencias de entrega del titular. |

<a id="API-FAC-121"></a>
#### API-FAC-121 · `GET /api/admin/fac/distribution-runs`

- **Qué hace:** Seguimiento con conteos. Lista, con filtros y paginación, los registros de corridas de distribución (`distributionRuns`).
- **Para qué sirve:** RF-FAC-056: Registrar al cierre del lote, si PRM-FAC-061 lo indica, el evento para capitalizar sobre lo facturado (M17). · RF-FAC-063: Distribuir y publicar al socio solo comprobantes autorizados o que no requieren autorización. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.distribucion.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de corridas de distribución (`distributionRuns`) con `total`.
- **Pantallas:** PAN-FAC-31 (Distribución).
- **Ola:** O4 · **Fuente:** M05 §11.5 Distribución, talones y cierre, línea 1876 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Distribuci%C3%B3n%2C%20talones%20y%20cierre/API-FAC-121)

<a id="API-FAC-120"></a>
#### API-FAC-120 · `POST /api/admin/fac/distribution-runs`

- **Qué hace:** Crear corrida de distribución (lote o selección). Registra un nuevo elemento u operación en corridas de distribución (`distributionRuns`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-FAC-155: Crear lotes de distribución por lote de emisión o selección manual, por canal, con agrupación del envío por cuenta, por socio o por socio y teléfono, y envío en tandas configurables. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.distribucion.ejecutar`.
- **Recibe:** los datos de corridas de distribución (`distributionRuns`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-FAC-34 (Franqueo según facturas).
- **Ola:** O4 · **Fuente:** M05 §11.5 Distribución, talones y cierre, línea 1875 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Distribuci%C3%B3n%2C%20talones%20y%20cierre/API-FAC-120)

<a id="API-FAC-121-b"></a>
#### API-FAC-121-b · `GET /api/admin/fac/distribution-runs/{id}`

- **Qué hace:** Seguimiento con conteos. Obtiene el detalle de un registro de corridas de distribución (`distributionRuns`).
- **Para qué sirve:** RF-FAC-056: Registrar al cierre del lote, si PRM-FAC-061 lo indica, el evento para capitalizar sobre lo facturado (M17). · RF-FAC-063: Distribuir y publicar al socio solo comprobantes autorizados o que no requieren autorización. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.distribucion.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de corridas de distribución (`distributionRuns`).
- **Pantallas:** PAN-FAC-31 (Distribución).
- **Ola:** O4 · **Fuente:** M05 §11.5 Distribución, talones y cierre, línea 1876 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Distribuci%C3%B3n%2C%20talones%20y%20cierre/API-FAC-121-b)

<a id="API-FAC-122"></a>
#### API-FAC-122 · `GET /api/admin/fac/distribution-runs/{id}/deliveries`

- **Qué hace:** Entregas por estado (destino enmascarado). Consulta «deliveries» de un registro de corridas de distribución (`distributionRuns`).
- **Para qué sirve:** RF-FAC-154: Registrar preferencias de entrega por titular, cuenta o grupo: papel, email, WhatsApp, app/portal (combinables), destinatarios, adhesión a factura digital con fecha y origen. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.distribucion.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de corridas de distribución (`distributionRuns`).
- **Pantallas:** PAN-FAC-31 (Distribución).
- **Ola:** O4 · **Fuente:** M05 §11.5 Distribución, talones y cierre, línea 1877 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Distribuci%C3%B3n%2C%20talones%20y%20cierre/API-FAC-122)

<a id="API-FAC-123"></a>
#### API-FAC-123 · `POST /api/admin/fac/distribution-runs/{id}/retry`

- **Qué hace:** Reintentar fallidas. Reintenta un registro de corridas de distribución (`distributionRuns`).
- **Para qué sirve:** RF-FAC-158: Registrar el resultado de cada envío (pendiente, enviado, entregado, leído, fallido, rebotado, devuelto en papel), con id del proveedor, clave de idempotencia y reintentos; ante rebote definitivo, derivar a papel según política. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.distribucion.ejecutar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FAC-34 (Franqueo según facturas).
- **Ola:** O4 · **Fuente:** M05 §11.5 Distribución, talones y cierre, línea 1878 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Distribuci%C3%B3n%2C%20talones%20y%20cierre/API-FAC-123)

<a id="API-FAC-124"></a>
#### API-FAC-124 · `GET /api/admin/fac/distribution-runs/{id}/print-file`

- **Qué hace:** PDF/archivo de imprenta ordenado (URL firmada). Consulta «print-file» de un registro de corridas de distribución (`distributionRuns`).
- **Para qué sirve:** RF-FAC-159: Impresión masiva en lote o exportación a imprenta (PDF unificado ordenado y archivo de datos), mensajes personalizados por segmento, imagen intercalada, numeración de piezas postales por zona/sector/recorrido y orden con… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.distribucion.exportar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de corridas de distribución (`distributionRuns`).
- **Ola:** O4 · **Fuente:** M05 §11.5 Distribución, talones y cierre, línea 1879 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Distribuci%C3%B3n%2C%20talones%20y%20cierre/API-FAC-124)

<a id="API-FAC-125"></a>
#### API-FAC-125 · `POST /api/admin/fac/distribution-runs/{id}/printed`

- **Qué hace:** Marcar impreso y entregado a rutas. Registra «printed» sobre un registro de corridas de distribución (`distributionRuns`).
- **Para qué sirve:** RF-FAC-160: Rutas y repartidores de distribución con secuencia; planilla de reparto; registro de entrega o devolución por el repartidor desde la PWA de empleado (funciona sin conexión). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.distribucion.ejecutar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FAC-34 (Franqueo según facturas).
- **Ola:** O4 · **Fuente:** M05 §11.5 Distribución, talones y cierre, línea 1880 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Distribuci%C3%B3n%2C%20talones%20y%20cierre/API-FAC-125)

<a id="API-FAC-126"></a>
#### API-FAC-126 · `POST /api/fac/delivery/deliveries:sync`

- **Qué hace:** Sincronizar entregas offline (lote de mutaciones con clientMutationId). Registra un nuevo elemento u operación en entrega por comprobante y canal (`invoiceDeliveries`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-FAC-160: Rutas y repartidores de distribución con secuencia; planilla de reparto; registro de entrega o devolución por el repartidor desde la PWA de empleado (funciona sin conexión). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `fac.reparto.registrarEntrega`.
- **Recibe:** los datos de entrega por comprobante y canal (`invoiceDeliveries`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-FAC-46 (Reparto).
- **Ola:** O4 · **Fuente:** M05 §11.5 Distribución, talones y cierre, línea 1881 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Distribuci%C3%B3n%2C%20talones%20y%20cierre/API-FAC-126)

<a id="API-FAC-127"></a>
#### API-FAC-127 · `GET /api/fac/delivery/my-route`

- **Qué hace:** Ruta del repartidor para cache offline. Consulta `my-route`.
- **Para qué sirve:** RF-FAC-160: Rutas y repartidores de distribución con secuencia; planilla de reparto; registro de entrega o devolución por el repartidor desde la PWA de empleado (funciona sin conexión). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `fac.reparto.registrarEntrega`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FAC-46 (Reparto).
- **Ola:** O4 · **Fuente:** M05 §11.5 Distribución, talones y cierre, línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Distribuci%C3%B3n%2C%20talones%20y%20cierre/API-FAC-127)

<a id="API-FAC-129"></a>
#### API-FAC-129 · `GET /api/admin/fac/payment-slips`

- **Qué hace:** Consultar con pagos. Lista, con filtros y paginación, los registros de talones sumados y de cuota (`paymentSlips`).
- **Para qué sirve:** RF-FAC-152: Consultar documentos de pago con sus pagos y eliminar uno no pagado si PRM-FAC-054 lo permite. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.talones.generar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de talones sumados y de cuota (`paymentSlips`) con `total`.
- **Pantallas:** PAN-FAC-32 (Talones y documentos de pago).
- **Ola:** O4 · **Fuente:** M05 §11.5 Distribución, talones y cierre, línea 1884 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Distribuci%C3%B3n%2C%20talones%20y%20cierre/API-FAC-129)

<a id="API-FAC-128"></a>
#### API-FAC-128 · `POST /api/admin/fac/payment-slips`

- **Qué hace:** Generar talón sumado o de cuotas. Da de alta un registro de talones sumados y de cuota (`paymentSlips`).
- **Para qué sirve:** RF-FAC-149: Generar documentos de pago (talones) agrupando comprobantes de la misma cuenta y grupo de talón: suma de los 4 importes (los créditos restan), vencimientos del primer comprobante del grupo, número propio, historial de versiones. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.talones.generar`.
- **Recibe:** los datos de talones sumados y de cuota (`paymentSlips`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de talones sumados y de cuota (`paymentSlips`).
- **Pantallas:** PAN-FAC-32 (Talones y documentos de pago).
- **Ola:** O4 · **Fuente:** M05 §11.5 Distribución, talones y cierre, línea 1883 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Distribuci%C3%B3n%2C%20talones%20y%20cierre/API-FAC-128)

<a id="API-FAC-129-b"></a>
#### API-FAC-129-b · `GET /api/admin/fac/payment-slips/{id}`

- **Qué hace:** Consultar con pagos. Obtiene el detalle de un registro de talones sumados y de cuota (`paymentSlips`).
- **Para qué sirve:** RF-FAC-152: Consultar documentos de pago con sus pagos y eliminar uno no pagado si PRM-FAC-054 lo permite. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.talones.generar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de talones sumados y de cuota (`paymentSlips`).
- **Pantallas:** PAN-FAC-32 (Talones y documentos de pago).
- **Ola:** O4 · **Fuente:** M05 §11.5 Distribución, talones y cierre, línea 1884 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Distribuci%C3%B3n%2C%20talones%20y%20cierre/API-FAC-129-b)

<a id="API-FAC-130"></a>
#### API-FAC-130 · `POST /api/admin/fac/payment-slips/{id}/void`

- **Qué hace:** Anular no pagado. Anula un registro de talones sumados y de cuota (`paymentSlips`).
- **Para qué sirve:** RF-FAC-152: Consultar documentos de pago con sus pagos y eliminar uno no pagado si PRM-FAC-054 lo permite. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.talones.eliminar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O4 · **Fuente:** M05 §11.5 Distribución, talones y cierre, línea 1885 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Distribuci%C3%B3n%2C%20talones%20y%20cierre/API-FAC-130)

<a id="API-FAC-131"></a>
#### API-FAC-131 · `POST /api/admin/fac/postage`

- **Qué hace:** Generar cargos de franqueo. Registra un nuevo elemento u operación en `postage`.
- **Para qué sirve:** RF-FAC-101: Liberar al anular o revertir lo que el comprobante consumió: consumos, cargos pendientes, cuotas, llamadas e internacionales, presupuestos, anticipos aplicados, franqueo, redondeo acumulado, registro de capital, conceptos de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.distribucion.ejecutar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FAC-34 (Franqueo según facturas).
- **Ola:** O4 · **Fuente:** M05 §11.5 Distribución, talones y cierre, línea 1886 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Distribuci%C3%B3n%2C%20talones%20y%20cierre/API-FAC-131)

<a id="API-FAC-133"></a>
#### API-FAC-133 · `GET /api/admin/fac/cycle-closures`

- **Qué hace:** Consultar actas. Lista, con filtros y paginación, los registros de acta de cierre de ciclo (`billingCycleClosures`).
- **Para qué sirve:** RF-FAC-164: Cerrar el ciclo con un acta: cuadre del universo (seleccionados = emitidos + emitidos con observación + pendientes + excluidos con causa + inciertos + rechazados), totales por servicio y concepto, estado de autorización y… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.lotes.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de acta de cierre de ciclo (`billingCycleClosures`) con `total`.
- **Pantallas:** PAN-FAC-01 (Tablero de facturación), PAN-FAC-05 (Lotes), PAN-FAC-07 (Detalle de lote).
- **Ola:** O4 · **Fuente:** M05 §11.5 Distribución, talones y cierre, línea 1888 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Distribuci%C3%B3n%2C%20talones%20y%20cierre/API-FAC-133)

<a id="API-FAC-132"></a>
#### API-FAC-132 · `POST /api/admin/fac/cycle-closures`

- **Qué hace:** Proponer acta (calcula cuadre). Da de alta un registro de acta de cierre de ciclo (`billingCycleClosures`).
- **Para qué sirve:** RF-FAC-164: Cerrar el ciclo con un acta: cuadre del universo (seleccionados = emitidos + emitidos con observación + pendientes + excluidos con causa + inciertos + rechazados), totales por servicio y concepto, estado de autorización y… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.cierre.proponer`.
- **Recibe:** los datos de acta de cierre de ciclo (`billingCycleClosures`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de acta de cierre de ciclo (`billingCycleClosures`).
- **Pantallas:** PAN-FAC-35 (Cierre de ciclo).
- **Ola:** O4 · **Fuente:** M05 §11.5 Distribución, talones y cierre, línea 1887 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Distribuci%C3%B3n%2C%20talones%20y%20cierre/API-FAC-132)

<a id="API-FAC-133-b"></a>
#### API-FAC-133-b · `GET /api/admin/fac/cycle-closures/{id}`

- **Qué hace:** Consultar actas. Obtiene el detalle de un registro de acta de cierre de ciclo (`billingCycleClosures`).
- **Para qué sirve:** RF-FAC-164: Cerrar el ciclo con un acta: cuadre del universo (seleccionados = emitidos + emitidos con observación + pendientes + excluidos con causa + inciertos + rechazados), totales por servicio y concepto, estado de autorización y… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.lotes.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de acta de cierre de ciclo (`billingCycleClosures`).
- **Pantallas:** PAN-FAC-01 (Tablero de facturación), PAN-FAC-05 (Lotes), PAN-FAC-07 (Detalle de lote).
- **Ola:** O4 · **Fuente:** M05 §11.5 Distribución, talones y cierre, línea 1888 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Distribuci%C3%B3n%2C%20talones%20y%20cierre/API-FAC-133-b)

<a id="API-FAC-134"></a>
#### API-FAC-134 · `POST /api/admin/fac/cycle-closures/{id}/submit`

- **Qué hace:** Enviar a aprobación. Envía a revisión o presenta un registro de acta de cierre de ciclo (`billingCycleClosures`).
- **Para qué sirve:** RF-FAC-164: Cerrar el ciclo con un acta: cuadre del universo (seleccionados = emitidos + emitidos con observación + pendientes + excluidos con causa + inciertos + rechazados), totales por servicio y concepto, estado de autorización y… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.cierre.proponer`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FAC-35 (Cierre de ciclo).
- **Ola:** O4 · **Fuente:** M05 §11.5 Distribución, talones y cierre, línea 1889 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Distribuci%C3%B3n%2C%20talones%20y%20cierre/API-FAC-134)

<a id="API-FAC-135"></a>
#### API-FAC-135 · `POST /api/admin/fac/cycle-closures/{id}/approve`

- **Qué hace:** Aprobar (JOB-FAC-15). Aprueba un registro de acta de cierre de ciclo (`billingCycleClosures`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-FAC-164: Cerrar el ciclo con un acta: cuadre del universo (seleccionados = emitidos + emitidos con observación + pendientes + excluidos con causa + inciertos + rechazados), totales por servicio y concepto, estado de autorización y… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.cierre.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Ola:** O4 · **Fuente:** M05 §11.5 Distribución, talones y cierre, línea 1890 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Distribuci%C3%B3n%2C%20talones%20y%20cierre/API-FAC-135)

<a id="API-FAC-136"></a>
#### API-FAC-136 · `POST /api/admin/fac/cycle-closures/{id}/reopen`

- **Qué hace:** Reabrir con motivo. Reabre un registro de acta de cierre de ciclo (`billingCycleClosures`).
- **Para qué sirve:** RF-FAC-165: Reabrir un cierre con motivo y aprobación; la reapertura no modifica comprobantes autorizados ni reabre períodos de grupos desarmados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.cierre.reabrir`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O4 · **Fuente:** M05 §11.5 Distribución, talones y cierre, línea 1891 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Distribuci%C3%B3n%2C%20talones%20y%20cierre/API-FAC-136)

<a id="API-FAC-137"></a>
#### API-FAC-137 · `GET /api/admin/fac/cycle-closures/{id}/minutes.pdf`

- **Qué hace:** Descargar acta. Descarga un archivo de acta de cierre de ciclo (`billingCycleClosures`).
- **Para qué sirve:** RF-FAC-164: Cerrar el ciclo con un acta: cuadre del universo (seleccionados = emitidos + emitidos con observación + pendientes + excluidos con causa + inciertos + rechazados), totales por servicio y concepto, estado de autorización y… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.lotes.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un archivo (application/pdf).
- **Pantallas:** PAN-FAC-01 (Tablero de facturación), PAN-FAC-05 (Lotes), PAN-FAC-07 (Detalle de lote).
- **Ola:** O4 · **Fuente:** M05 §11.5 Distribución, talones y cierre, línea 1892 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Distribuci%C3%B3n%2C%20talones%20y%20cierre/API-FAC-137)

<a id="API-FAC-138"></a>
#### API-FAC-138 · `GET /api/admin/fac/reports/{report}`

- **Qué hace:** Reportes de §15 (exportar con fac.reportes.exportar). Obtiene el detalle de un registro de `reports`.
- **Para qué sirve:** RF-FAC-173: Proveer los reportes y exportaciones de la sección 15. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.reportes.ver`.
- **Recibe:** en la ruta `report`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FAC-36 (Reportes de facturación).
- **Ola:** O4 · **Fuente:** M05 §11.5 Distribución, talones y cierre, línea 1893 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Distribuci%C3%B3n%2C%20talones%20y%20cierre/API-FAC-138)

<a id="API-FAC-139"></a>
#### API-FAC-139 · `GET /api/admin/fac/delivery-preferences/{holderId}`

- **Qué hace:** Preferencias de entrega del titular. Obtiene el detalle de un registro de canal de entrega de factura (`deliveryPreferences`).
- **Para qué sirve:** RF-FAC-154: Registrar preferencias de entrega por titular, cuenta o grupo: papel, email, WhatsApp, app/portal (combinables), destinatarios, adhesión a factura digital con fecha y origen. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.preferencias.editar`.
- **Recibe:** en la ruta `holderId`.
- **Devuelve:** 200: el registro de canal de entrega de factura (`deliveryPreferences`).
- **Pantallas:** PAN-FAC-40 (Preferencias de entrega).
- **Ola:** O4 · **Fuente:** M05 §11.5 Distribución, talones y cierre, línea 1894 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Distribuci%C3%B3n%2C%20talones%20y%20cierre/API-FAC-139)

<a id="API-FAC-139-b"></a>
#### API-FAC-139-b · `PUT /api/admin/fac/delivery-preferences/{holderId}`

- **Qué hace:** Preferencias de entrega del titular. Reemplaza o configura un registro de canal de entrega de factura (`deliveryPreferences`).
- **Para qué sirve:** RF-FAC-154: Registrar preferencias de entrega por titular, cuenta o grupo: papel, email, WhatsApp, app/portal (combinables), destinatarios, adhesión a factura digital con fecha y origen. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `fac.preferencias.editar`.
- **Recibe:** en la ruta `holderId`; los datos de canal de entrega de factura (`deliveryPreferences`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de canal de entrega de factura (`deliveryPreferences`).
- **Pantallas:** PAN-FAC-40 (Preferencias de entrega).
- **Ola:** O4 · **Fuente:** M05 §11.5 Distribución, talones y cierre, línea 1894 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Distribuci%C3%B3n%2C%20talones%20y%20cierre/API-FAC-139-b)

<a id="grupo-6"></a>

## Socio, público y externa

9 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-FAC-150](#API-FAC-150) | GET | `/api/fac/my-invoices` | Comprobantes de las cuentas autorizadas del usuario (solo autorizados y publicados). |
| [API-FAC-151](#API-FAC-151) | GET | `/api/fac/my-invoices/{id}` | Detalle (verifica propiedad; si no, 404). |
| [API-FAC-152](#API-FAC-152) | GET | `/api/fac/my-invoices/{id}/pdf` | PDF con URL firmada de corta vida. |
| [API-FAC-153](#API-FAC-153) | GET | `/api/fac/my-delivery-preferences` | Preferencias propias (adhesión digital). |
| [API-FAC-153-b](#API-FAC-153-b) | PUT | `/api/fac/my-delivery-preferences` | Preferencias propias (adhesión digital). |
| [API-FAC-154](#API-FAC-154) | POST | `/api/public/{tenantSlug}/fac/invoices:lookup` | Consulta sin login con cuenta + dato de validación (si PRM-FAC-145). Respuesta mínima: vencimientos, total, enlace PDF de un solo uso. |
| [API-FAC-155](#API-FAC-155) | GET | `/api/v1/ext/fac/invoices` | Lectura para integradores (sin datos personales salvo los fiscales necesarios). |
| [API-FAC-156](#API-FAC-156) | POST | `/api/v1/ext/fac/imports` | Carga de ítems de terceros por API (formato canónico). |
| [API-FAC-157](#API-FAC-157) | GET | `/api/v1/ext/fac/codes/{code}` | Decodificación para recaudadores (devuelve documento, importe vigente y vencimiento). |

<a id="API-FAC-150"></a>
#### API-FAC-150 · `GET /api/fac/my-invoices`

- **Qué hace:** Comprobantes de las cuentas autorizadas del usuario (solo autorizados y publicados). Consulta `my-invoices`.
- **Para qué sirve:** RF-FAC-174: Cola de revisión previa antes de autorizar: los casos cuyas cuentas pertenecen a las categorías o condiciones especiales configuradas (PRM-FAC-161: grandes usuarios / categorías tarifarias de demanda, usuario-generador, contratos…
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `por.comprobantes.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FAC-43 (Mis facturas), PAN-FAC-44 (Detalle de factura).
- **Ola:** O7 · **Fuente:** M05 §11.6 Socio, público y externa, línea 1900 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Socio%2C%20p%C3%BAblico%20y%20externa/API-FAC-150)

<a id="API-FAC-151"></a>
#### API-FAC-151 · `GET /api/fac/my-invoices/{id}`

- **Qué hace:** Detalle (verifica propiedad; si no, 404). Obtiene el detalle de un registro de `my-invoices`.
- **Para qué sirve:** RF-FAC-174: Cola de revisión previa antes de autorizar: los casos cuyas cuentas pertenecen a las categorías o condiciones especiales configuradas (PRM-FAC-161: grandes usuarios / categorías tarifarias de demanda, usuario-generador, contratos…
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `por.comprobantes.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-FAC-43 (Mis facturas), PAN-FAC-44 (Detalle de factura).
- **Ola:** O7 · **Fuente:** M05 §11.6 Socio, público y externa, línea 1901 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Socio%2C%20p%C3%BAblico%20y%20externa/API-FAC-151)

<a id="API-FAC-152"></a>
#### API-FAC-152 · `GET /api/fac/my-invoices/{id}/pdf`

- **Qué hace:** PDF con URL firmada de corta vida. Descarga un archivo de `pdf`.
- **Para qué sirve:** RF-FAC-168: PWA del socio: lista de comprobantes de sus cuentas autorizadas con apertura por servicio, estado de pago (de M07), vencimiento e importe vigente según la fecha, descarga del PDF y acceso a pagar (M07). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `por.comprobantes.descargar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un archivo (application/pdf).
- **Pantallas:** PAN-WFL-26 ("Mis documentos" por cuenta y tipo).
- **Ola:** O4 · **Fuente:** M05 §11.6 Socio, público y externa, línea 1902 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Socio%2C%20p%C3%BAblico%20y%20externa/API-FAC-152)

<a id="API-FAC-153"></a>
#### API-FAC-153 · `GET /api/fac/my-delivery-preferences`

- **Qué hace:** Preferencias propias (adhesión digital). Consulta `my-delivery-preferences`.
- **Para qué sirve:** RF-FAC-154: Registrar preferencias de entrega por titular, cuenta o grupo: papel, email, WhatsApp, app/portal (combinables), destinatarios, adhesión a factura digital con fecha y origen. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `por.preferencias.editar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-62 (Apariencia).
- **Ola:** O4 · **Fuente:** M05 §11.6 Socio, público y externa, línea 1903 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Socio%2C%20p%C3%BAblico%20y%20externa/API-FAC-153)

<a id="API-FAC-153-b"></a>
#### API-FAC-153-b · `PUT /api/fac/my-delivery-preferences`

- **Qué hace:** Preferencias propias (adhesión digital). Reemplaza o configura `my-delivery-preferences`.
- **Para qué sirve:** RF-FAC-154: Registrar preferencias de entrega por titular, cuenta o grupo: papel, email, WhatsApp, app/portal (combinables), destinatarios, adhesión a factura digital con fecha y origen. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `por.preferencias.editar`.
- **Recibe:** un cuerpo JSON cuya estructura detalla el anexo; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-POR-62 (Apariencia).
- **Ola:** O4 · **Fuente:** M05 §11.6 Socio, público y externa, línea 1903 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Socio%2C%20p%C3%BAblico%20y%20externa/API-FAC-153-b)

<a id="API-FAC-154"></a>
#### API-FAC-154 · `POST /api/public/{tenantSlug}/fac/invoices:lookup`

- **Qué hace:** Consulta sin login con cuenta + dato de validación (si PRM-FAC-145). Respuesta mínima: vencimientos, total, enlace PDF de un solo uso. Da de alta un registro de comprobante emitido con renglones embebidos (`invoices`).
- **Para qué sirve:** RF-FAC-174: Cola de revisión previa antes de autorizar: los casos cuyas cuentas pertenecen a las categorías o condiciones especiales configuradas (PRM-FAC-161: grandes usuarios / categorías tarifarias de demanda, usuario-generador, contratos…
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); permiso `por.facturas.consultar`.
- **Recibe:** en la ruta `tenantSlug`; los datos de comprobante emitido con renglones embebidos (`invoices`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de comprobante emitido con renglones embebidos (`invoices`).
- **Pantallas:** PAN-FAC-45 (Consulta de factura sin login).
- **Ola:** O7 · **Fuente:** M05 §11.6 Socio, público y externa, línea 1904 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Socio%2C%20p%C3%BAblico%20y%20externa/API-FAC-154)

<a id="API-FAC-155"></a>
#### API-FAC-155 · `GET /api/v1/ext/fac/invoices`

- **Qué hace:** Lectura para integradores (sin datos personales salvo los fiscales necesarios). Lista, con filtros y paginación, los registros de comprobante emitido con renglones embebidos (`invoices`).
- **Para qué sirve:** RF-FAC-063: Distribuir y publicar al socio solo comprobantes autorizados o que no requieren autorización. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); permiso `bia.fac.comprobantes.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de comprobante emitido con renglones embebidos (`invoices`) con `total`.
- **Ola:** O4 · **Fuente:** M05 §11.6 Socio, público y externa, línea 1905 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Socio%2C%20p%C3%BAblico%20y%20externa/API-FAC-155)

<a id="API-FAC-156"></a>
#### API-FAC-156 · `POST /api/v1/ext/fac/imports`

- **Qué hace:** Carga de ítems de terceros por API (formato canónico). Da de alta un registro de importaciones de facturación (`billingImports`).
- **Para qué sirve:** RF-FAC-121: Importaciones de terceros con formato canónico (cuenta o identificador, concepto, cantidad, precio, descripción, período) y adaptadores por origen: EMA (Excel), SAM (Excel + ancho fijo, variante Tasa Verde), EME (DBF de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); permiso `bia.fac.importaciones.crear`.
- **Recibe:** los datos de importaciones de facturación (`billingImports`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de importaciones de facturación (`billingImports`).
- **Ola:** O4 · **Fuente:** M05 §11.6 Socio, público y externa, línea 1906 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Socio%2C%20p%C3%BAblico%20y%20externa/API-FAC-156)

<a id="API-FAC-157"></a>
#### API-FAC-157 · `GET /api/v1/ext/fac/codes/{code}`

- **Qué hace:** Decodificación para recaudadores (devuelve documento, importe vigente y vencimiento). Obtiene el detalle de un registro de reglas de selección de plantilla (`invoiceTemplates`).
- **Para qué sirve:** RF-FAC-145: Servicio de decodificación para caja y rendiciones (M07): valida largo y DV, identifica documento y vencimiento, y admite modos heredados configurables para códigos migrados (número + sucursal, cuenta + importe). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); permiso `bia.fac.codigos.ver`.
- **Recibe:** en la ruta `code`.
- **Devuelve:** 200: el registro de reglas de selección de plantilla (`invoiceTemplates`).
- **Ola:** O4 · **Fuente:** M05 §11.6 Socio, público y externa, línea 1907 · [Ver en Swagger](../18-swagger/index.html?api=m05-fac#/Socio%2C%20p%C3%BAblico%20y%20externa/API-FAC-157)
