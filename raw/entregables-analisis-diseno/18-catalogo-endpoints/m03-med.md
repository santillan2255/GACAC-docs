# Catálogo de endpoints · M03 · Medidores, lecturas, consumos, telemedición y prepago

Parte del [catálogo de endpoints](../18-catalogo-endpoints.md) (artefacto 7.1). Generado el 05-11-2026 con `_trabajo/gen_18_catalogo_endpoints.py` a partir de `18-openapi/`; no se edita a mano.

## Para qué sirve esta API

Transformar la medición física y remota de los servicios medidos (electricidad, agua, gas y cualquier otro servicio con unidad medible que el tenant habilite) en cantidades aprobadas para liquidar, con trazabilidad completa desde el instrumento hasta la factura. El módulo:

1. Mantiene la ficha metrológica de cada medidor y su trayectoria de instalaciones en puntos de medición, con lecturas de colocación y retiro, precintos, ensayos y evidencia (BASE §7).
2. Planifica y ejecuta la toma de lecturas por rutas, cronogramas y lotes, en campo y sin conexión, por carga manual, archivos de terceros, telemedición o autolectura del socio, convergiendo en un único flujo de lote de lectura (BASE §8, RN-06 §21.6).
3. Distingue siempre lectura capturada → lectura validada → consumo aprobado para liquidar, y nunca borra el dato original ni quién lo relevó (BASE §8, regla de diseño).
4. Calcula, valida, estima, divide, prorratea, distribuye y regulariza consumos, detectando inconsistencias sin tratar toda anomalía como error (BASE §9).
5. Gestiona demanda contratada y transgresiones, energía inyectada de usuarios-generadores (Ley 27.424, MER-001), medición propia (compra/frontera) y balances de pérdidas.
6. Define el contrato funcional con los sistemas de telemedición AMI/MDM y prepago (toma de estado, operaciones de ciclo del medidor, corte/reconexión remota, carga de crédito/token), cuya implementación técnica está en T06.
7. Expone a la factura (M04/M05) un contrato de datos de consumo estable y explicable: qué cantidad, de qué canal, con qué fechas, días, origen y reglas.

Detalle completo en el anexo M03, sección 1. Contrato navegable: [Swagger](../18-swagger/index.html?api=m03-med).

| Dato | Valor |
|---|---|
| Endpoints | 109 |
| Por método | GET 45, PATCH 11, POST 53 |
| Grupos funcionales | 1 |
| Con requisito citado en el anexo | 2 |
| Con requisito inferido (a confirmar) | 105 |
| Sin requisito identificable | 2 |

## Grupos funcionales

| Grupo | Endpoints | Qué agrupa (primeros endpoints) |
|---|---|---|
| [API](#grupo-1) | 109 | Lista un catálogo (brands, meter-types…; Alta/edición de ítem de catálogo.; Listado de medidores con filtros.… |

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

109 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-MED-01](#API-MED-01) | GET | `/api/admin/med/catalogs/{catalog}` | Lista un catálogo (brands, meter-types, reading-observations, reading-results, reading-conditions, meter-observations). |
| [API-MED-02](#API-MED-02) | POST | `/api/admin/med/catalogs/{catalog}` | Alta/edición de ítem de catálogo. |
| [API-MED-02-b](#API-MED-02-b) | PATCH | `/api/admin/med/catalogs/{catalog}/{id}` | Alta/edición de ítem de catálogo. |
| [API-MED-03](#API-MED-03) | GET | `/api/admin/med/meters` | Listado de medidores con filtros. |
| [API-MED-05](#API-MED-05) | POST | `/api/admin/med/meters` | Alta de medidor. |
| [API-MED-04](#API-MED-04) | GET | `/api/admin/med/meters/{id}` | Ficha + trayectoria. |
| [API-MED-06](#API-MED-06) | PATCH | `/api/admin/med/meters/{id}` | Edición (restricciones si instalado). |
| [API-MED-07](#API-MED-07) | POST | `/api/admin/med/meters/import` | Importación masiva (preview/confirm). |
| [API-MED-08](#API-MED-08) | POST | `/api/admin/med/meters/{id}/tests` | Registrar ensayo. |
| [API-MED-09](#API-MED-09) | POST | `/api/admin/med/meters/{id}/seals` | Registrar precinto (colocar/retirar/violado). |
| [API-MED-10](#API-MED-10) | GET | `/api/admin/med/points` | Listado de puntos. |
| [API-MED-12](#API-MED-12) | POST | `/api/admin/med/points` | Alta/edición de punto (ZSR, acceso, testigo). |
| [API-MED-11](#API-MED-11) | GET | `/api/admin/med/points/{id}` | Ficha del punto. |
| [API-MED-12-b](#API-MED-12-b) | PATCH | `/api/admin/med/points/{id}` | Alta/edición de punto (ZSR, acceso, testigo). |
| [API-MED-13](#API-MED-13) | POST | `/api/admin/med/points/{id}/channels` | Alta/cierre de canal; ?propose=category propone por categoría. |
| [API-MED-14](#API-MED-14) | POST | `/api/admin/med/installations` | Instalar / retirar / cambiar (operación atómica). |
| [API-MED-15](#API-MED-15) | POST | `/api/admin/med/installations/{id}/void` | Anular instalación/retiro. |
| [API-MED-16](#API-MED-16) | GET | `/api/admin/med/routes` | ABM de rutas; GET /:id/preview. |
| [API-MED-16-b](#API-MED-16-b) | POST | `/api/admin/med/routes` | ABM de rutas; GET /:id/preview. |
| [API-MED-16-c](#API-MED-16-c) | GET | `/api/admin/med/routes/{id}` | ABM de rutas; GET /:id/preview. |
| [API-MED-16-d](#API-MED-16-d) | PATCH | `/api/admin/med/routes/{id}` | ABM de rutas; GET /:id/preview. |
| [API-MED-17](#API-MED-17) | POST | `/api/admin/med/routes/{id}/renumber-proposal` | Propuesta de renumeración (y /apply). |
| [API-MED-18](#API-MED-18) | GET | `/api/admin/med/calendars` | Cronogramas; POST /:id/publish. |
| [API-MED-18-b](#API-MED-18-b) | POST | `/api/admin/med/calendars` | Cronogramas; POST /:id/publish. |
| [API-MED-18-c](#API-MED-18-c) | GET | `/api/admin/med/calendars/{id}` | Cronogramas; POST /:id/publish. |
| [API-MED-18-d](#API-MED-18-d) | PATCH | `/api/admin/med/calendars/{id}` | Cronogramas; POST /:id/publish. |
| [API-MED-20](#API-MED-20) | GET | `/api/admin/med/batches` | Listado/detalle con contadores. |
| [API-MED-19](#API-MED-19) | POST | `/api/admin/med/batches` | Generar lote(s) (encola JOB-MED-01). |
| [API-MED-20-b](#API-MED-20-b) | GET | `/api/admin/med/batches/{id}` | Listado/detalle con contadores. |
| [API-MED-21](#API-MED-21) | POST | `/api/admin/med/batches/{id}/assign` | Asignar/reasignar tareas. |
| [API-MED-22](#API-MED-22) | POST | `/api/admin/med/batches/{id}/export` | Exportar a archivo (perfil). |
| [API-MED-23](#API-MED-23) | GET | `/api/admin/med/batches/{id}/tasks` | Tareas con filtros de revisión. |
| [API-MED-24](#API-MED-24) | POST | `/api/admin/med/batches/{id}/confirm` | Confirmar (encola JOB-MED-03). |
| [API-MED-25](#API-MED-25) | POST | `/api/admin/med/batches/{id}/close` | Cerrar con decisión de pendientes. |
| [API-MED-26](#API-MED-26) | POST | `/api/admin/med/batches/{id}/reopen` | Reabrir. |
| [API-MED-27](#API-MED-27) | POST | `/api/admin/med/batches/{id}/cancel` | Cancelar. |
| [API-MED-28](#API-MED-28) | GET | `/api/admin/med/batches/{id}/print` | Planilla de ruta PDF. |
| [API-MED-29](#API-MED-29) | GET | `/api/med/field/batches` | Lotes asignados al lecturista. |
| [API-MED-30](#API-MED-30) | GET | `/api/med/field/batches/{id}/download` | Paquete de descarga con versiones. |
| [API-MED-31](#API-MED-31) | POST | `/api/med/field/sync` | Lote de mutaciones offline (clientMutationId por ítem); resultado por ítem. |
| [API-MED-32](#API-MED-32) | POST | `/api/med/field/photos` | Subida de foto (URL firmada) con clientMutationId. |
| [API-MED-33](#API-MED-33) | POST | `/api/med/field/sessions` | Inicio/fin de jornada. |
| [API-MED-37](#API-MED-37) | GET | `/api/admin/med/readings` | Consulta de lecturas por punto/canal/período/origen. |
| [API-MED-34](#API-MED-34) | POST | `/api/admin/med/readings` | Lectura manual (uno o varios canales). |
| [API-MED-35](#API-MED-35) | POST | `/api/admin/med/readings/{id}/correct` | Nueva versión con motivo. |
| [API-MED-36](#API-MED-36) | POST | `/api/admin/med/readings/{id}/void` | Anular. |
| [API-MED-38](#API-MED-38) | POST | `/api/admin/med/imports` | Subir archivo + perfil → preview. |
| [API-MED-39](#API-MED-39) | POST | `/api/admin/med/imports/{id}/confirm` | Confirmar importación. |
| [API-MED-40](#API-MED-40) | GET | `/api/admin/med/import-profiles` | Perfiles de importación; POST /:id/test. |
| [API-MED-40-b](#API-MED-40-b) | POST | `/api/admin/med/import-profiles` | Perfiles de importación; POST /:id/test. |
| [API-MED-40-c](#API-MED-40-c) | GET | `/api/admin/med/import-profiles/{id}` | Perfiles de importación; POST /:id/test. |
| [API-MED-40-d](#API-MED-40-d) | PATCH | `/api/admin/med/import-profiles/{id}` | Perfiles de importación; POST /:id/test. |
| [API-MED-41](#API-MED-41) | GET | `/api/admin/med/consumptions` | Consumos con filtros (servicio, período, estado, origen). |
| [API-MED-42](#API-MED-42) | POST | `/api/admin/med/consumptions/approve` | Aprobación individual/masiva. |
| [API-MED-43](#API-MED-43) | POST | `/api/admin/med/consumptions/{id}/block` | Bloquear/desbloquear. |
| [API-MED-43-b](#API-MED-43-b) | POST | `/api/admin/med/consumptions/{id}/unblock` | Bloquear/desbloquear. |
| [API-MED-44](#API-MED-44) | POST | `/api/admin/med/consumptions/additional` | Consumo adicional. |
| [API-MED-45](#API-MED-45) | PATCH | `/api/admin/med/consumptions/{id}/category` | Actualizar categoría de consumo no facturado. |
| [API-MED-46](#API-MED-46) | GET | `/api/admin/med/exceptions` | Bandeja de excepciones. |
| [API-MED-47](#API-MED-47) | POST | `/api/admin/med/exceptions/resolve` | Resolver una o varias (acción + justificación). |
| [API-MED-48](#API-MED-48) | POST | `/api/admin/med/estimations` | Estimar (preview con ?dryRun=true / confirmar). |
| [API-MED-49](#API-MED-49) | POST | `/api/admin/med/adjustments` | Proponer regularización/ajuste; POST /:id/approve, /reject. |
| [API-MED-51](#API-MED-51) | GET | `/api/admin/med/remote-operations` | Consulta con log saneado. |
| [API-MED-50](#API-MED-50) | POST | `/api/admin/med/remote-operations` | Encolar operación remota (exige originOrderId para corte/reconexión). |
| [API-MED-51-b](#API-MED-51-b) | GET | `/api/admin/med/remote-operations/{id}` | Consulta con log saneado. |
| [API-MED-52](#API-MED-52) | POST | `/api/admin/med/remote-operations/{id}/retry` | Reintentar/cancelar. |
| [API-MED-52-b](#API-MED-52-b) | POST | `/api/admin/med/remote-operations/{id}/cancel` | Reintentar/cancelar. |
| [API-MED-53](#API-MED-53) | POST | `/api/admin/med/telemetry/read` | Toma de estado puntual o por lote. |
| [API-MED-54](#API-MED-54) | GET | `/api/admin/med/metering-systems` | Sistemas y mapeos; POST /:id/test-connection. |
| [API-MED-54-b](#API-MED-54-b) | POST | `/api/admin/med/metering-systems` | Sistemas y mapeos; POST /:id/test-connection. |
| [API-MED-54-c](#API-MED-54-c) | GET | `/api/admin/med/metering-systems/{id}` | Sistemas y mapeos; POST /:id/test-connection. |
| [API-MED-54-d](#API-MED-54-d) | PATCH | `/api/admin/med/metering-systems/{id}` | Sistemas y mapeos; POST /:id/test-connection. |
| [API-MED-55](#API-MED-55) | POST | `/api/med/prepaid/{accountId}/pre-sale` | Validar preventa y unidades estimadas. |
| [API-MED-56](#API-MED-56) | GET | `/api/admin/med/prepaid/accounts` | Cuentas prepagas y recargas. |
| [API-MED-56-b](#API-MED-56-b) | GET | `/api/admin/med/prepaid/accounts/{id}` | Cuentas prepagas y recargas. |
| [API-MED-57](#API-MED-57) | POST | `/api/admin/med/prepaid/top-ups/{id}/retry` | Reintentar recarga fallida o pedir devolución a M07. |
| [API-MED-57-b](#API-MED-57-b) | POST | `/api/admin/med/prepaid/top-ups/{id}/refund-request` | Reintentar recarga fallida o pedir devolución a M07. |
| [API-MED-58](#API-MED-58) | GET | `/api/admin/med/prepaid/reconciliation` | Conciliación diaria. |
| [API-MED-59](#API-MED-59) | GET | `/api/admin/med/dg-contracts` | Contratos GD; transiciones /approve, /connect, /suspend, /terminate. |
| [API-MED-59-b](#API-MED-59-b) | POST | `/api/admin/med/dg-contracts` | Contratos GD; transiciones /approve, /connect, /suspend, /terminate. |
| [API-MED-59-c](#API-MED-59-c) | GET | `/api/admin/med/dg-contracts/{id}` | Contratos GD; transiciones /approve, /connect, /suspend, /terminate. |
| [API-MED-59-d](#API-MED-59-d) | PATCH | `/api/admin/med/dg-contracts/{id}` | Contratos GD; transiciones /approve, /connect, /suspend, /terminate. |
| [API-MED-60](#API-MED-60) | GET | `/api/admin/med/billing-feed` | Contrato de datos de consumo aprobado por servicio y período (ver 13.3). |
| [API-MED-61](#API-MED-61) | GET | `/api/admin/med/points/{id}/history` | Historial de consumos y lecturas para M10 (recupero) y M09 (reclamos). |
| [API-MED-62](#API-MED-62) | POST | `/api/admin/med/splits` | División/agrupación (dryRun/confirmar). |
| [API-MED-63](#API-MED-63) | GET | `/api/admin/med/distributions` | ABM; POST /:id/run, /runs/:runId/revert. |
| [API-MED-63-b](#API-MED-63-b) | POST | `/api/admin/med/distributions` | ABM; POST /:id/run, /runs/:runId/revert. |
| [API-MED-63-c](#API-MED-63-c) | GET | `/api/admin/med/distributions/{id}` | ABM; POST /:id/run, /runs/:runId/revert. |
| [API-MED-63-d](#API-MED-63-d) | PATCH | `/api/admin/med/distributions/{id}` | ABM; POST /:id/run, /runs/:runId/revert. |
| [API-MED-64](#API-MED-64) | GET | `/api/admin/med/witness` | Testigos y consumos. |
| [API-MED-64-b](#API-MED-64-b) | POST | `/api/admin/med/witness` | Testigos y consumos. |
| [API-MED-65](#API-MED-65) | GET | `/api/admin/med/demand` | Demanda contratada; transgresiones; POST /transgressions/:id/reset. |
| [API-MED-65-b](#API-MED-65-b) | POST | `/api/admin/med/demand` | Demanda contratada; transgresiones; POST /transgressions/:id/reset. |
| [API-MED-65-c](#API-MED-65-c) | PATCH | `/api/admin/med/demand` | Demanda contratada; transgresiones; POST /transgressions/:id/reset. |
| [API-MED-67](#API-MED-67) | GET | `/api/admin/med/own-metering` | Puntos y lecturas propias; GET /losses. |
| [API-MED-67-b](#API-MED-67-b) | POST | `/api/admin/med/own-metering` | Puntos y lecturas propias; GET /losses. |
| [API-MED-68](#API-MED-68) | GET | `/api/admin/med/reports/{report}` | Informes (sección 15); ?format=pdf/xlsx/csv. |
| [API-MED-69](#API-MED-69) | GET | `/api/admin/med/conflicts` | Conflictos offline. |
| [API-MED-69-b](#API-MED-69-b) | POST | `/api/admin/med/conflicts/{id}/resolve` | Conflictos offline. |
| [API-MED-70](#API-MED-70) | GET | `/api/med/services/{contractId}/consumptions` | Mis consumos (solo servicios autorizados). |
| [API-MED-71](#API-MED-71) | GET | `/api/med/services/{contractId}/self-reading` | Estado de ventana de autolectura. |
| [API-MED-72](#API-MED-72) | POST | `/api/med/services/{contractId}/self-reading` | Enviar autolectura con foto. |
| [API-MED-73](#API-MED-73) | GET | `/api/med/services/{contractId}/prepaid` | Mi prepago. |
| [API-MED-74](#API-MED-74) | GET | `/api/admin/med/class-reviews` | Propuestas de cambio de clase (A validar). |
| [API-MED-74-b](#API-MED-74-b) | POST | `/api/admin/med/class-reviews` | Propuestas de cambio de clase (A validar). |
| [API-MED-75](#API-MED-75) | GET | `/api/v1/ext/med/consumptions` | Consumos aprobados para BI del tenant (T10). |
| [API-MED-76](#API-MED-76) | POST | `/api/v1/ext/med/readings` | Ingreso de lecturas desde MDM/AMI del tenant (push). |
| [API-MED-77](#API-MED-77) | GET | `/api/admin/med/dashboard` | Indicadores del tablero. |
| [API-MED-78](#API-MED-78) | GET | `/api/admin/med/purchase-volumes` | Volumen comprado por período de los puntos purchase/boundary, por punto, registro y franja, con origen y estado de validación (RF-MED-129... |

<a id="API-MED-01"></a>
#### API-MED-01 · `GET /api/admin/med/catalogs/{catalog}`

- **Qué hace:** Lista un catálogo (brands, meter-types, reading-observations, reading-results, reading-conditions, meter-observations). Obtiene el detalle de un registro de `catalogs`.
- **Para qué sirve:** RF-MED-009: Registrar observaciones de medidor codificadas (catálogo) con fecha y autor. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.catalogos.ver`.
- **Recibe:** en la ruta `catalog`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MED-01 (Catálogos de medición).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1568 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-01)

<a id="API-MED-02"></a>
#### API-MED-02 · `POST /api/admin/med/catalogs/{catalog}`

- **Qué hace:** Alta/edición de ítem de catálogo. Registra un nuevo elemento u operación en `catalogs`.
- **Para qué sirve:** RF-MED-009: Registrar observaciones de medidor codificadas (catálogo) con fecha y autor. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.catalogos.configurar`.
- **Recibe:** en la ruta `catalog`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MED-01 (Catálogos de medición).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1569 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-02)

<a id="API-MED-02-b"></a>
#### API-MED-02-b · `PATCH /api/admin/med/catalogs/{catalog}/{id}`

- **Qué hace:** Alta/edición de ítem de catálogo. Modifica algunos campos de un registro de `catalogs` (solo los enviados).
- **Para qué sirve:** RF-MED-009: Registrar observaciones de medidor codificadas (catálogo) con fecha y autor. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.catalogos.configurar`.
- **Recibe:** en la ruta `catalog`, `id`; solo los campos a cambiar; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MED-01 (Catálogos de medición).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1569 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-02-b)

<a id="API-MED-03"></a>
#### API-MED-03 · `GET /api/admin/med/meters`

- **Qué hace:** Listado de medidores con filtros. Lista, con filtros y paginación, los registros de ficha metrológica (`meters`).
- **Para qué sirve:** RF-MED-011: Mostrar en la ficha del medidor su estado de activo (disponible, instalado, retirado, en reparación, descartado) sincronizado con M13 y su estado de medición. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.medidores.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ficha metrológica (`meters`) con `total`.
- **Pantallas:** PAN-MED-02 (Medidores).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1570 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-03)

<a id="API-MED-05"></a>
#### API-MED-05 · `POST /api/admin/med/meters`

- **Qué hace:** Alta de medidor. Da de alta un registro de ficha metrológica (`meters`).
- **Para qué sirve:** RF-MED-049: Permitir al lecturista crear novedades que generen OT (medidor roto, conexión directa, pérdida) cuando el parámetro lo habilita. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.medidores.crear`.
- **Recibe:** los datos de ficha metrológica (`meters`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de ficha metrológica (`meters`).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1572 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-05)

<a id="API-MED-04"></a>
#### API-MED-04 · `GET /api/admin/med/meters/{id}`

- **Qué hace:** Ficha + trayectoria. Obtiene el detalle de un registro de ficha metrológica (`meters`).
- **Para qué sirve:** RF-MED-005: Consultar la trayectoria completa del medidor: instalaciones, retiros, lecturas de colocación/retiro, ensayos, precintos, reparaciones (desde M13), fotografías y certificados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.medidores.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de ficha metrológica (`meters`).
- **Pantallas:** PAN-MED-02 (Medidores).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1571 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-04)

<a id="API-MED-06"></a>
#### API-MED-06 · `PATCH /api/admin/med/meters/{id}`

- **Qué hace:** Edición (restricciones si instalado). Modifica algunos campos de un registro de ficha metrológica (`meters`) (solo los enviados).
- **Para qué sirve:** RF-MED-011: Mostrar en la ficha del medidor su estado de activo (disponible, instalado, retirado, en reparación, descartado) sincronizado con M13 y su estado de medición. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.medidores.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de ficha metrológica (`meters`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de ficha metrológica (`meters`).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1573 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-06)

<a id="API-MED-07"></a>
#### API-MED-07 · `POST /api/admin/med/meters/import`

- **Qué hace:** Importación masiva (preview/confirm). Importa sobre ficha metrológica (`meters`).
- **Para qué sirve:** RF-MED-084: Ejecutar la división/agrupación en forma masiva con preview, exclusiones visibles e impresión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.medidores.crear`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1574 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-07)

<a id="API-MED-08"></a>
#### API-MED-08 · `POST /api/admin/med/meters/{id}/tests`

- **Qué hace:** Registrar ensayo. Registra «tests» sobre un registro de ficha metrológica (`meters`).
- **Para qué sirve:** RF-MED-007: Registrar ensayos/contrastes del medidor con fecha, laboratorio o responsable, resultado (aprobado, rechazado, con observaciones), error medido y certificado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.ensayos.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1575 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-08)

<a id="API-MED-09"></a>
#### API-MED-09 · `POST /api/admin/med/meters/{id}/seals`

- **Qué hace:** Registrar precinto (colocar/retirar/violado). Registra «seals» sobre un registro de ficha metrológica (`meters`).
- **Para qué sirve:** RF-MED-008: Registrar precintos (número, tipo, color, posición) colocados, retirados o violados, vinculados a la instalación y a la OT que los registró. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.precintos.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1576 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-09)

<a id="API-MED-10"></a>
#### API-MED-10 · `GET /api/admin/med/points`

- **Qué hace:** Listado de puntos. Lista, con filtros y paginación, los registros de punto de medición (`meteringPoints`).
- **Para qué sirve:** RF-MED-100: Registrar puntos de medición propia (compra de energía, frontera, alimentadores, internos) con registros pico, resto, valle, punta, fuera de punta y reactiva, y sus lecturas/consumos por período. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.puntos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de punto de medición (`meteringPoints`) con `total`.
- **Pantallas:** PAN-MED-03 (Punto de medición).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1577 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-10)

<a id="API-MED-12"></a>
#### API-MED-12 · `POST /api/admin/med/points`

- **Qué hace:** Alta/edición de punto (ZSR, acceso, testigo). Da de alta un registro de punto de medición (`meteringPoints`).
- **Para qué sirve:** RF-MED-012: Crear el punto de medición al habilitar un servicio contratado medido (M01/M02), con tipo de punto (cliente, testigo, compra/frontera, interno, padre de distribución), ubicación geográfica, datos de acceso y zona/sector/recorrido… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.puntos.editar`.
- **Recibe:** los datos de punto de medición (`meteringPoints`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de punto de medición (`meteringPoints`).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1579 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-12)

<a id="API-MED-11"></a>
#### API-MED-11 · `GET /api/admin/med/points/{id}`

- **Qué hace:** Ficha del punto. Obtiene el detalle de un registro de punto de medición (`meteringPoints`).
- **Para qué sirve:** RF-MED-011: Mostrar en la ficha del medidor su estado de activo (disponible, instalado, retirado, en reparación, descartado) sincronizado con M13 y su estado de medición. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.puntos.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de punto de medición (`meteringPoints`).
- **Pantallas:** PAN-MED-03 (Punto de medición).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1578 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-11)

<a id="API-MED-12-b"></a>
#### API-MED-12-b · `PATCH /api/admin/med/points/{id}`

- **Qué hace:** Alta/edición de punto (ZSR, acceso, testigo). Modifica algunos campos de un registro de punto de medición (`meteringPoints`) (solo los enviados).
- **Para qué sirve:** RF-MED-012: Crear el punto de medición al habilitar un servicio contratado medido (M01/M02), con tipo de punto (cliente, testigo, compra/frontera, interno, padre de distribución), ubicación geográfica, datos de acceso y zona/sector/recorrido… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.puntos.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de punto de medición (`meteringPoints`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de punto de medición (`meteringPoints`).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1579 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-12-b)

<a id="API-MED-13"></a>
#### API-MED-13 · `POST /api/admin/med/points/{id}/channels`

- **Qué hace:** Alta/cierre de canal; ?propose=category propone por categoría. Da de alta un registro de canales del punto (`meteringChannels`).
- **Para qué sirve:** RF-MED-014: Proponer automáticamente los canales del punto según los conceptos de la categoría tarifaria vigente (grandes usuarios) y pedir confirmación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.puntos.editar`.
- **Recibe:** en la ruta `id`; los datos de canales del punto (`meteringChannels`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de canales del punto (`meteringChannels`).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1580 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-13)

<a id="API-MED-14"></a>
#### API-MED-14 · `POST /api/admin/med/installations`

- **Qué hace:** Instalar / retirar / cambiar (operación atómica). Da de alta un registro de colocación y retiro (`meterInstallations`).
- **Para qué sirve:** RF-MED-018: Ejecutar el cambio de medidor como una operación atómica (retiro + instalación) con continuidad de consumo en el período, aplicando opcionalmente la categoría nueva informada por la OT. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.instalaciones.crear`.
- **Recibe:** los datos de colocación y retiro (`meterInstallations`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de colocación y retiro (`meterInstallations`).
- **Pantallas:** PAN-MED-04 (Asistente de instalación, retiro y cambio de medidor).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1581 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-14)

<a id="API-MED-15"></a>
#### API-MED-15 · `POST /api/admin/med/installations/{id}/void`

- **Qué hace:** Anular instalación/retiro. Anula un registro de colocación y retiro (`meterInstallations`).
- **Para qué sirve:** RF-MED-021: Anular una instalación o retiro cargado por error con reversión de sus lecturas y consumos no facturados, y con motivo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.instalaciones.anular`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1582 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-15)

<a id="API-MED-16"></a>
#### API-MED-16 · `GET /api/admin/med/routes`

- **Qué hace:** ABM de rutas; GET /:id/preview. Lista, con filtros y paginación, los registros de rutas de lectura (`readingRoutes`).
- **Para qué sirve:** RF-MED-084: Ejecutar la división/agrupación en forma masiva con preview, exclusiones visibles e impresión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.rutas.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de rutas de lectura (`readingRoutes`) con `total`.
- **Pantallas:** PAN-MED-05 (Rutas de lectura).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1583 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-16)

<a id="API-MED-16-b"></a>
#### API-MED-16-b · `POST /api/admin/med/routes`

- **Qué hace:** ABM de rutas; GET /:id/preview. Da de alta un registro de rutas de lectura (`readingRoutes`).
- **Para qué sirve:** RF-MED-084: Ejecutar la división/agrupación en forma masiva con preview, exclusiones visibles e impresión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.rutas.editar`.
- **Recibe:** los datos de rutas de lectura (`readingRoutes`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de rutas de lectura (`readingRoutes`).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1583 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-16-b)

<a id="API-MED-16-c"></a>
#### API-MED-16-c · `GET /api/admin/med/routes/{id}`

- **Qué hace:** ABM de rutas; GET /:id/preview. Obtiene el detalle de un registro de rutas de lectura (`readingRoutes`).
- **Para qué sirve:** RF-MED-084: Ejecutar la división/agrupación en forma masiva con preview, exclusiones visibles e impresión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.rutas.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de rutas de lectura (`readingRoutes`).
- **Pantallas:** PAN-MED-05 (Rutas de lectura).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1583 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-16-c)

<a id="API-MED-16-d"></a>
#### API-MED-16-d · `PATCH /api/admin/med/routes/{id}`

- **Qué hace:** ABM de rutas; GET /:id/preview. Modifica algunos campos de un registro de rutas de lectura (`readingRoutes`) (solo los enviados).
- **Para qué sirve:** RF-MED-084: Ejecutar la división/agrupación en forma masiva con preview, exclusiones visibles e impresión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.rutas.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de rutas de lectura (`readingRoutes`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de rutas de lectura (`readingRoutes`).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1583 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-16-d)

<a id="API-MED-17"></a>
#### API-MED-17 · `POST /api/admin/med/routes/{id}/renumber-proposal`

- **Qué hace:** Propuesta de renumeración (y /apply). Registra «renumber-proposal» sobre un registro de rutas de lectura (`readingRoutes`).
- **Para qué sirve:** RF-MED-027: Renumerar el recorrido de lectura según el orden real de la última toma (por zona y sector, de 5 en 5, desde 0), como propuesta aprobable. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.rutas.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1584 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-17)

<a id="API-MED-18"></a>
#### API-MED-18 · `GET /api/admin/med/calendars`

- **Qué hace:** Cronogramas; POST /:id/publish. Lista, con filtros y paginación, los registros de cronograma de lectura (`readingCalendars`).
- **Para qué sirve:** RF-MED-028: Administrar el cronograma de lectura por servicio y ruta: período, fecha prevista, ventana de tolerancia, lecturista o cuadrilla prevista; generación automática de lotes según el cronograma. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.cronograma.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de cronograma de lectura (`readingCalendars`) con `total`.
- **Pantallas:** PAN-MED-06 (Cronograma de lectura).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1585 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-18)

<a id="API-MED-18-b"></a>
#### API-MED-18-b · `POST /api/admin/med/calendars`

- **Qué hace:** Cronogramas; POST /:id/publish. Da de alta un registro de cronograma de lectura (`readingCalendars`).
- **Para qué sirve:** RF-MED-028: Administrar el cronograma de lectura por servicio y ruta: período, fecha prevista, ventana de tolerancia, lecturista o cuadrilla prevista; generación automática de lotes según el cronograma. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.cronograma.editar`.
- **Recibe:** los datos de cronograma de lectura (`readingCalendars`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de cronograma de lectura (`readingCalendars`).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1585 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-18-b)

<a id="API-MED-18-c"></a>
#### API-MED-18-c · `GET /api/admin/med/calendars/{id}`

- **Qué hace:** Cronogramas; POST /:id/publish. Obtiene el detalle de un registro de cronograma de lectura (`readingCalendars`).
- **Para qué sirve:** RF-MED-028: Administrar el cronograma de lectura por servicio y ruta: período, fecha prevista, ventana de tolerancia, lecturista o cuadrilla prevista; generación automática de lotes según el cronograma. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.cronograma.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de cronograma de lectura (`readingCalendars`).
- **Pantallas:** PAN-MED-06 (Cronograma de lectura).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1585 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-18-c)

<a id="API-MED-18-d"></a>
#### API-MED-18-d · `PATCH /api/admin/med/calendars/{id}`

- **Qué hace:** Cronogramas; POST /:id/publish. Modifica algunos campos de un registro de cronograma de lectura (`readingCalendars`) (solo los enviados).
- **Para qué sirve:** RF-MED-028: Administrar el cronograma de lectura por servicio y ruta: período, fecha prevista, ventana de tolerancia, lecturista o cuadrilla prevista; generación automática de lotes según el cronograma. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.cronograma.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de cronograma de lectura (`readingCalendars`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de cronograma de lectura (`readingCalendars`).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1585 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-18-d)

<a id="API-MED-20"></a>
#### API-MED-20 · `GET /api/admin/med/batches`

- **Qué hace:** Listado/detalle con contadores. Lista, con filtros y paginación, los registros de lotes de lectura (`readingBatches`).
- **Para qué sirve:** RF-MED-032: Asignar lotes o subconjuntos de tareas a lecturistas o cuadrillas, reasignar tareas no iniciadas y reasignar con conflicto controlado las iniciadas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.lotes.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de lotes de lectura (`readingBatches`) con `total`.
- **Pantallas:** PAN-MED-07 (Lotes de lectura), PAN-MED-08 (Detalle y revisión del lote de lectura).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1587 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-20)

<a id="API-MED-19"></a>
#### API-MED-19 · `POST /api/admin/med/batches`

- **Qué hace:** Generar lote(s) (encola JOB-MED-01). Registra un nuevo elemento u operación en lotes de lectura (`readingBatches`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-MED-030: Bloquear que un punto esté en dos lotes abiertos del mismo período e informar el lote donde está. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.lotes.crear`.
- **Recibe:** los datos de lotes de lectura (`readingBatches`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1586 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-19)

<a id="API-MED-20-b"></a>
#### API-MED-20-b · `GET /api/admin/med/batches/{id}`

- **Qué hace:** Listado/detalle con contadores. Obtiene el detalle de un registro de lotes de lectura (`readingBatches`).
- **Para qué sirve:** RF-MED-032: Asignar lotes o subconjuntos de tareas a lecturistas o cuadrillas, reasignar tareas no iniciadas y reasignar con conflicto controlado las iniciadas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.lotes.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de lotes de lectura (`readingBatches`).
- **Pantallas:** PAN-MED-07 (Lotes de lectura), PAN-MED-08 (Detalle y revisión del lote de lectura).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1587 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-20-b)

<a id="API-MED-21"></a>
#### API-MED-21 · `POST /api/admin/med/batches/{id}/assign`

- **Qué hace:** Asignar/reasignar tareas. Asigna un registro de lotes de lectura (`readingBatches`).
- **Para qué sirve:** RF-MED-032: Asignar lotes o subconjuntos de tareas a lecturistas o cuadrillas, reasignar tareas no iniciadas y reasignar con conflicto controlado las iniciadas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.lotes.asignar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1588 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-21)

<a id="API-MED-22"></a>
#### API-MED-22 · `POST /api/admin/med/batches/{id}/export`

- **Qué hace:** Exportar a archivo (perfil). Exporta un registro de lotes de lectura (`readingBatches`).
- **Para qué sirve:** RF-MED-033: Descargar el lote al dispositivo del lecturista (PWA) con versión de cada tarea, o exportarlo a archivo para colectoras de terceros (CSV/Excel, uno por ruta o todos juntos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.lotes.exportar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1589 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-22)

<a id="API-MED-23"></a>
#### API-MED-23 · `GET /api/admin/med/batches/{id}/tasks`

- **Qué hace:** Tareas con filtros de revisión. Lista, con filtros y paginación, los registros de tareas de lectura (`readingTasks`).
- **Para qué sirve:** RF-MED-032: Asignar lotes o subconjuntos de tareas a lecturistas o cuadrillas, reasignar tareas no iniciadas y reasignar con conflicto controlado las iniciadas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.lotes.ver`.
- **Recibe:** en la ruta `id`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de tareas de lectura (`readingTasks`) con `total`.
- **Pantallas:** PAN-MED-07 (Lotes de lectura), PAN-MED-08 (Detalle y revisión del lote de lectura).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1590 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-23)

<a id="API-MED-24"></a>
#### API-MED-24 · `POST /api/admin/med/batches/{id}/confirm`

- **Qué hace:** Confirmar (encola JOB-MED-03). Confirma un registro de lotes de lectura (`readingBatches`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-MED-039: Cancelar un lote sin lecturas procesadas; impedir la cancelación si tiene lecturas sin procesar salvo confirmación expresa del supervisor. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.lotes.confirmar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1591 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-24)

<a id="API-MED-25"></a>
#### API-MED-25 · `POST /api/admin/med/batches/{id}/close`

- **Qué hace:** Cerrar con decisión de pendientes. Cierra un registro de lotes de lectura (`readingBatches`).
- **Para qué sirve:** RF-MED-037: Cerrar el lote cuando no queden tareas pendientes o cuando el supervisor acepte los pendientes como "no leídos" con motivo, generando estimación o relectura según política. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.lotes.cerrar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1592 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-25)

<a id="API-MED-26"></a>
#### API-MED-26 · `POST /api/admin/med/batches/{id}/reopen`

- **Qué hace:** Reabrir. Reabre un registro de lotes de lectura (`readingBatches`).
- **Para qué sirve:** RF-MED-038: Reabrir un lote cerrado mientras ninguno de sus consumos esté facturado, con motivo y auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.lotes.reabrir`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1593 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-26)

<a id="API-MED-27"></a>
#### API-MED-27 · `POST /api/admin/med/batches/{id}/cancel`

- **Qué hace:** Cancelar. Cancela un registro de lotes de lectura (`readingBatches`).
- **Para qué sirve:** RF-MED-039: Cancelar un lote sin lecturas procesadas; impedir la cancelación si tiene lecturas sin procesar salvo confirmación expresa del supervisor. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.lotes.cancelar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1594 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-27)

<a id="API-MED-28"></a>
#### API-MED-28 · `GET /api/admin/med/batches/{id}/print`

- **Qué hace:** Planilla de ruta PDF. Consulta «print» de un registro de lotes de lectura (`readingBatches`).
- **Para qué sirve:** RF-MED-041: Imprimir la planilla de ruta (orden de recorrido) para lectura en papel y cargar luego por PAN-MED-09. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.lotes.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de lotes de lectura (`readingBatches`).
- **Pantallas:** PAN-MED-07 (Lotes de lectura), PAN-MED-08 (Detalle y revisión del lote de lectura).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1595 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-28)

<a id="API-MED-29"></a>
#### API-MED-29 · `GET /api/med/field/batches`

- **Qué hace:** Lotes asignados al lecturista. Lista, con filtros y paginación, los registros de lotes de lectura (`readingBatches`).
- **Para qué sirve:** RF-MED-032: Asignar lotes o subconjuntos de tareas a lecturistas o cuadrillas, reasignar tareas no iniciadas y reasignar con conflicto controlado las iniciadas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de campo o cobradores, desde la app móvil; permiso `med.campo.leer`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de lotes de lectura (`readingBatches`) con `total`.
- **Pantallas:** PAN-MED-28 (Mis rutas de lectura), PAN-MED-29 (Captura de lectura).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1596 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-29)

<a id="API-MED-30"></a>
#### API-MED-30 · `GET /api/med/field/batches/{id}/download`

- **Qué hace:** Paquete de descarga con versiones. Descarga un archivo de lotes de lectura (`readingBatches`).
- **Para qué sirve:** RF-MED-033: Descargar el lote al dispositivo del lecturista (PWA) con versión de cada tarea, o exportarlo a archivo para colectoras de terceros (CSV/Excel, uno por ruta o todos juntos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de campo o cobradores, desde la app móvil; permiso `med.campo.leer`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un archivo (application/octet-stream).
- **Pantallas:** PAN-MED-28 (Mis rutas de lectura), PAN-MED-29 (Captura de lectura).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1597 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-30)

<a id="API-MED-31"></a>
#### API-MED-31 · `POST /api/med/field/sync`

- **Qué hace:** Lote de mutaciones offline (clientMutationId por ítem); resultado por ítem. Sincroniza sobre `sync`; el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-MED-047: Sincronizar con clientMutationId por lectura y por foto; confirmar recepción por ítem; reintentar automáticamente; nunca duplicar capturas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de campo o cobradores, desde la app móvil; permiso `med.campo.sincronizar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-MED-30 (Cola de sincronización de lecturas (absorbida por PAN-TEC-53)).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1598 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-31)

<a id="API-MED-32"></a>
#### API-MED-32 · `POST /api/med/field/photos`

- **Qué hace:** Subida de foto (URL firmada) con clientMutationId. Registra un nuevo elemento u operación en `photos`.
- **Para qué sirve:** RF-MED-047: Sincronizar con clientMutationId por lectura y por foto; confirmar recepción por ítem; reintentar automáticamente; nunca duplicar capturas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de campo o cobradores, desde la app móvil; permiso `med.campo.sincronizar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MED-30 (Cola de sincronización de lecturas (absorbida por PAN-TEC-53)).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1599 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-32)

<a id="API-MED-33"></a>
#### API-MED-33 · `POST /api/med/field/sessions`

- **Qué hace:** Inicio/fin de jornada. Da de alta un registro de jornadas del lecturista (`readerWorkSessions`).
- **Para qué sirve:** RF-MED-042: Registrar horas de trabajo y productividad del lecturista derivadas de la app (inicio/fin de jornada, tareas por hora, distancia) y permitir carga manual. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de campo o cobradores, desde la app móvil; permiso `med.campo.leer`.
- **Recibe:** los datos de jornadas del lecturista (`readerWorkSessions`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de jornadas del lecturista (`readerWorkSessions`).
- **Pantallas:** PAN-MED-28 (Mis rutas de lectura), PAN-MED-29 (Captura de lectura).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1600 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-33)

<a id="API-MED-37"></a>
#### API-MED-37 · `GET /api/admin/med/readings`

- **Qué hace:** Consulta de lecturas por punto/canal/período/origen. Lista, con filtros y paginación, los registros de lecturas (`meterReadings`).
- **Para qué sirve:** RF-MED-016: Registrar la instalación de un medidor en un punto con fecha y hora efectivas, lecturas iniciales por registro, factor vigente, mapeo registro → canal, motivo y OT de origen. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.lecturas.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de lecturas (`meterReadings`) con `total`.
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1604 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-37)

<a id="API-MED-34"></a>
#### API-MED-34 · `POST /api/admin/med/readings`

- **Qué hace:** Lectura manual (uno o varios canales). Da de alta un registro de lecturas (`meterReadings`).
- **Para qué sirve:** RF-MED-049: Permitir al lecturista crear novedades que generen OT (medidor roto, conexión directa, pérdida) cuando el parámetro lo habilita. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.lecturas.crear`.
- **Recibe:** los datos de lecturas (`meterReadings`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de lecturas (`meterReadings`).
- **Pantallas:** PAN-MED-09 (Registro manual de lecturas).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1601 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-34)

<a id="API-MED-35"></a>
#### API-MED-35 · `POST /api/admin/med/readings/{id}/correct`

- **Qué hace:** Nueva versión con motivo. Corrige un registro de lecturas (`meterReadings`).
- **Para qué sirve:** RF-MED-069: Corregir una lectura o consumo no facturado creando una versión nueva con motivo; la versión anterior queda consultable. · RF-MED-050: Permitir al lecturista corregir su propia captura antes de sincronizar y, después, solo como nueva versión con motivo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.lecturas.corregir`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MED-13 (Corrección de lectura/consumo con versión).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1602 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-35)

<a id="API-MED-36"></a>
#### API-MED-36 · `POST /api/admin/med/readings/{id}/void`

- **Qué hace:** Anular. Anula un registro de lecturas (`meterReadings`).
- **Para qué sirve:** RF-MED-021: Anular una instalación o retiro cargado por error con reversión de sus lecturas y consumos no facturados, y con motivo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.lecturas.anular`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1603 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-36)

<a id="API-MED-38"></a>
#### API-MED-38 · `POST /api/admin/med/imports`

- **Qué hace:** Subir archivo + perfil → preview. Registra un nuevo elemento u operación en `imports`.
- **Para qué sirve:** RF-MED-053: Importar lecturas desde archivos de terceros (Excel, CSV, texto de ancho fijo, DBF) mediante perfiles de mapeo configurables por tenant (columnas, formato de fecha y decimales, emparejamiento por número de medidor con relleno o… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.lecturas.importar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MED-10 (Importación de archivos y perfiles de mapeo).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1605 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-38)

<a id="API-MED-39"></a>
#### API-MED-39 · `POST /api/admin/med/imports/{id}/confirm`

- **Qué hace:** Confirmar importación. Confirma un registro de `confirm`.
- **Para qué sirve:** RF-MED-111: Almacenar curvas de carga (lecturas por intervalo) importadas de AMI/MDM para grandes usuarios y análisis. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.lecturas.importar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MED-10 (Importación de archivos y perfiles de mapeo).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1606 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-39)

<a id="API-MED-40"></a>
#### API-MED-40 · `GET /api/admin/med/import-profiles`

- **Qué hace:** Perfiles de importación; POST /:id/test. Lista, con filtros y paginación, los registros de perfiles de importación (`readingImportProfiles`).
- **Para qué sirve:** RF-MED-053: Importar lecturas desde archivos de terceros (Excel, CSV, texto de ancho fijo, DBF) mediante perfiles de mapeo configurables por tenant (columnas, formato de fecha y decimales, emparejamiento por número de medidor con relleno o… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.perfilesImportacion.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de perfiles de importación (`readingImportProfiles`) con `total`.
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1607 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-40)

<a id="API-MED-40-b"></a>
#### API-MED-40-b · `POST /api/admin/med/import-profiles`

- **Qué hace:** Perfiles de importación; POST /:id/test. Da de alta un registro de perfiles de importación (`readingImportProfiles`).
- **Para qué sirve:** RF-MED-053: Importar lecturas desde archivos de terceros (Excel, CSV, texto de ancho fijo, DBF) mediante perfiles de mapeo configurables por tenant (columnas, formato de fecha y decimales, emparejamiento por número de medidor con relleno o… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.perfilesImportacion.configurar`.
- **Recibe:** los datos de perfiles de importación (`readingImportProfiles`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de perfiles de importación (`readingImportProfiles`).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1607 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-40-b)

<a id="API-MED-40-c"></a>
#### API-MED-40-c · `GET /api/admin/med/import-profiles/{id}`

- **Qué hace:** Perfiles de importación; POST /:id/test. Obtiene el detalle de un registro de perfiles de importación (`readingImportProfiles`).
- **Para qué sirve:** RF-MED-053: Importar lecturas desde archivos de terceros (Excel, CSV, texto de ancho fijo, DBF) mediante perfiles de mapeo configurables por tenant (columnas, formato de fecha y decimales, emparejamiento por número de medidor con relleno o… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.perfilesImportacion.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de perfiles de importación (`readingImportProfiles`).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1607 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-40-c)

<a id="API-MED-40-d"></a>
#### API-MED-40-d · `PATCH /api/admin/med/import-profiles/{id}`

- **Qué hace:** Perfiles de importación; POST /:id/test. Modifica algunos campos de un registro de perfiles de importación (`readingImportProfiles`) (solo los enviados).
- **Para qué sirve:** RF-MED-053: Importar lecturas desde archivos de terceros (Excel, CSV, texto de ancho fijo, DBF) mediante perfiles de mapeo configurables por tenant (columnas, formato de fecha y decimales, emparejamiento por número de medidor con relleno o… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.perfilesImportacion.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de perfiles de importación (`readingImportProfiles`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de perfiles de importación (`readingImportProfiles`).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1607 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-40-d)

<a id="API-MED-41"></a>
#### API-MED-41 · `GET /api/admin/med/consumptions`

- **Qué hace:** Consumos con filtros (servicio, período, estado, origen). Lista, con filtros y paginación, los registros de consumos por canal e intervalo (`consumptions`).
- **Para qué sirve:** RF-MED-072: Consultar los consumos de un servicio: historial por canal (categoría, medidor, fechas y lecturas, días, consumo, período, factura), gráfico, comparación interanual, adjuntos, filtros por fecha y por propiedad; imprimir con o sin… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.consumos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de consumos por canal e intervalo (`consumptions`) con `total`.
- **Pantallas:** PAN-MED-12 (Consumos del servicio).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1608 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-41)

<a id="API-MED-42"></a>
#### API-MED-42 · `POST /api/admin/med/consumptions/approve`

- **Qué hace:** Aprobación individual/masiva. Aprueba sobre consumos por canal e intervalo (`consumptions`).
- **Para qué sirve:** RF-MED-066: Aprobar consumos en forma individual y masiva; aprobar automáticamente los que no tienen excepciones si el parámetro lo permite. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.consumos.aprobar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MED-35 (Propuestas de cambio de clase por consumo).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1609 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-42)

<a id="API-MED-43"></a>
#### API-MED-43 · `POST /api/admin/med/consumptions/{id}/block`

- **Qué hace:** Bloquear/desbloquear. Bloquea un registro de consumos por canal e intervalo (`consumptions`).
- **Para qué sirve:** RF-MED-065: Bandeja de excepciones de consumo antes de facturar, con filtros por regla, severidad, zona, ruta, categoría, lecturista y antigüedad; acciones: aprobar como real con justificación, corregir lectura, pedir relectura, estimar… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.consumos.bloquear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1610 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-43)

<a id="API-MED-43-b"></a>
#### API-MED-43-b · `POST /api/admin/med/consumptions/{id}/unblock`

- **Qué hace:** Bloquear/desbloquear. Desbloquea un registro de consumos por canal e intervalo (`consumptions`).
- **Para qué sirve:** RF-MED-065: Bandeja de excepciones de consumo antes de facturar, con filtros por regla, severidad, zona, ruta, categoría, lecturista y antigüedad; acciones: aprobar como real con justificación, corregir lectura, pedir relectura, estimar… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.consumos.bloquear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1610 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-43-b)

<a id="API-MED-44"></a>
#### API-MED-44 · `POST /api/admin/med/consumptions/additional`

- **Qué hace:** Consumo adicional. Registra un nuevo elemento u operación en consumos por canal e intervalo (`consumptions`).
- **Para qué sirve:** RF-MED-052: Registrar un consumo adicional (lectura extra estimada con descripción "Consumo adicional") con motivo y autorización. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.lecturas.crear`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MED-09 (Registro manual de lecturas).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1611 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-44)

<a id="API-MED-45"></a>
#### API-MED-45 · `PATCH /api/admin/med/consumptions/{id}/category`

- **Qué hace:** Actualizar categoría de consumo no facturado. Modifica algunos campos de un registro de consumos por canal e intervalo (`consumptions`) (solo los enviados).
- **Para qué sirve:** RF-MED-071: Actualizar la categoría asociada a un consumo no facturado cuando la categoría del servicio cambió con fecha efectiva anterior. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.consumos.aprobar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de consumos por canal e intervalo (`consumptions`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de consumos por canal e intervalo (`consumptions`).
- **Pantallas:** PAN-MED-35 (Propuestas de cambio de clase por consumo).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1612 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-45)

<a id="API-MED-46"></a>
#### API-MED-46 · `GET /api/admin/med/exceptions`

- **Qué hace:** Bandeja de excepciones. Lista, con filtros y paginación, los registros de excepciones de consumo (`consumptionExceptions`).
- **Para qué sirve:** RF-MED-065: Bandeja de excepciones de consumo antes de facturar, con filtros por regla, severidad, zona, ruta, categoría, lecturista y antigüedad; acciones: aprobar como real con justificación, corregir lectura, pedir relectura, estimar… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.excepciones.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de excepciones de consumo (`consumptionExceptions`) con `total`.
- **Pantallas:** PAN-MED-11 (Bandeja de excepciones de consumo).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1613 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-46)

<a id="API-MED-47"></a>
#### API-MED-47 · `POST /api/admin/med/exceptions/resolve`

- **Qué hace:** Resolver una o varias (acción + justificación). Resuelve sobre excepciones de consumo (`consumptionExceptions`).
- **Para qué sirve:** RF-MED-065: Bandeja de excepciones de consumo antes de facturar, con filtros por regla, severidad, zona, ruta, categoría, lecturista y antigüedad; acciones: aprobar como real con justificación, corregir lectura, pedir relectura, estimar… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.excepciones.resolver`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1614 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-47)

<a id="API-MED-48"></a>
#### API-MED-48 · `POST /api/admin/med/estimations`

- **Qué hace:** Estimar (preview con ?dryRun=true / confirmar). Registra un nuevo elemento u operación en `estimations`.
- **Para qué sirve:** RF-MED-084: Ejecutar la división/agrupación en forma masiva con preview, exclusiones visibles e impresión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.consumos.estimar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MED-14 (Estimación masiva de consumos).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1615 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-48)

<a id="API-MED-49"></a>
#### API-MED-49 · `POST /api/admin/med/adjustments`

- **Qué hace:** Proponer regularización/ajuste; POST /:id/approve, /reject. Da de alta un registro de ajustes y regularizaciones (`consumptionAdjustments`).
- **Para qué sirve:** RF-MED-079: Regularizar estimaciones al llegar una lectura real: calcular la diferencia entre lo estimado facturado y lo real, y generar un ajuste según la política del servicio (compensación de unidades en la próxima liquidación o… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.ajustes.crear`.
- **Recibe:** los datos de ajustes y regularizaciones (`consumptionAdjustments`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de ajustes y regularizaciones (`consumptionAdjustments`).
- **Pantallas:** PAN-MED-15 (Regularización de estimados).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1616 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-49)

<a id="API-MED-51"></a>
#### API-MED-51 · `GET /api/admin/med/remote-operations`

- **Qué hace:** Consulta con log saneado. Consulta `remote-operations`.
- **Para qué sirve:** RF-MED-109: Auditar cada llamada a un sistema remoto: operación, medidor, punto, solicitud y respuesta saneadas, duración, resultado y correlación. · RF-MED-110: Consultar y operar comandos/operaciones de telemedición por servicio: historial, estado, reintento, cancelación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.telemedicion.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MED-24 (Operaciones remotas de telemedición).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1618 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-51)

<a id="API-MED-50"></a>
#### API-MED-50 · `POST /api/admin/med/remote-operations`

- **Qué hace:** Encolar operación remota (exige originOrderId para corte/reconexión). Registra un nuevo elemento u operación en `remote-operations`; el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-MED-108: Contrato de comandos de corte y reconexión remota: solo a pedido de una orden vigente de M08/M10, con Idempotency-Key, resultado confirmado (ejecutado, rechazado, sin respuesta) y evento de resultado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.telemedicion.operar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1617 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-50)

<a id="API-MED-51-b"></a>
#### API-MED-51-b · `GET /api/admin/med/remote-operations/{id}`

- **Qué hace:** Consulta con log saneado. Obtiene el detalle de un registro de `remote-operations`.
- **Para qué sirve:** RF-MED-109: Auditar cada llamada a un sistema remoto: operación, medidor, punto, solicitud y respuesta saneadas, duración, resultado y correlación. · RF-MED-110: Consultar y operar comandos/operaciones de telemedición por servicio: historial, estado, reintento, cancelación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.telemedicion.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MED-24 (Operaciones remotas de telemedición).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1618 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-51-b)

<a id="API-MED-52"></a>
#### API-MED-52 · `POST /api/admin/med/remote-operations/{id}/retry`

- **Qué hace:** Reintentar/cancelar. Reintenta un registro de `retry`.
- **Para qué sirve:** RF-MED-110: Consultar y operar comandos/operaciones de telemedición por servicio: historial, estado, reintento, cancelación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.telemedicion.reintentar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1619 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-52)

<a id="API-MED-52-b"></a>
#### API-MED-52-b · `POST /api/admin/med/remote-operations/{id}/cancel`

- **Qué hace:** Reintentar/cancelar. Cancela un registro de `cancel`.
- **Para qué sirve:** RF-MED-110: Consultar y operar comandos/operaciones de telemedición por servicio: historial, estado, reintento, cancelación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.telemedicion.reintentar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1619 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-52-b)

<a id="API-MED-53"></a>
#### API-MED-53 · `POST /api/admin/med/telemetry/read`

- **Qué hace:** Toma de estado puntual o por lote. Registra un nuevo elemento u operación en `read`; el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-MED-105: Toma de estado masiva por lote (tareas telemedidas) y puntual por servicio u OT; en puntos multicanal pedir confirmación antes de reemplazar lecturas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.telemedicion.tomarEstado`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1620 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-53)

<a id="API-MED-54"></a>
#### API-MED-54 · `GET /api/admin/med/metering-systems`

- **Qué hace:** Sistemas y mapeos; POST /:id/test-connection. Lista, con filtros y paginación, los registros de sistemas de telemedición/prepago (`meteringSystems`).
- **Para qué sirve:** RF-MED-103: Configurar por tenant los sistemas de telemedición/prepago (proveedor, tipo, URL, credenciales en bóveda, datos extra, servicio y tipos de medidor que atiende, operaciones soportadas). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.telemedicion.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de sistemas de telemedición/prepago (`meteringSystems`) con `total`.
- **Pantallas:** PAN-MED-23 (Sistemas de telemedición/prepago y mapeo de registros).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1621 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-54)

<a id="API-MED-54-b"></a>
#### API-MED-54-b · `POST /api/admin/med/metering-systems`

- **Qué hace:** Sistemas y mapeos; POST /:id/test-connection. Da de alta un registro de sistemas de telemedición/prepago (`meteringSystems`).
- **Para qué sirve:** RF-MED-103: Configurar por tenant los sistemas de telemedición/prepago (proveedor, tipo, URL, credenciales en bóveda, datos extra, servicio y tipos de medidor que atiende, operaciones soportadas). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.telemedicion.configurar`.
- **Recibe:** los datos de sistemas de telemedición/prepago (`meteringSystems`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de sistemas de telemedición/prepago (`meteringSystems`).
- **Pantallas:** PAN-MED-23 (Sistemas de telemedición/prepago y mapeo de registros).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1621 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-54-b)

<a id="API-MED-54-c"></a>
#### API-MED-54-c · `GET /api/admin/med/metering-systems/{id}`

- **Qué hace:** Sistemas y mapeos; POST /:id/test-connection. Obtiene el detalle de un registro de sistemas de telemedición/prepago (`meteringSystems`).
- **Para qué sirve:** RF-MED-103: Configurar por tenant los sistemas de telemedición/prepago (proveedor, tipo, URL, credenciales en bóveda, datos extra, servicio y tipos de medidor que atiende, operaciones soportadas). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.telemedicion.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de sistemas de telemedición/prepago (`meteringSystems`).
- **Pantallas:** PAN-MED-23 (Sistemas de telemedición/prepago y mapeo de registros).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1621 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-54-c)

<a id="API-MED-54-d"></a>
#### API-MED-54-d · `PATCH /api/admin/med/metering-systems/{id}`

- **Qué hace:** Sistemas y mapeos; POST /:id/test-connection. Modifica algunos campos de un registro de sistemas de telemedición/prepago (`meteringSystems`) (solo los enviados).
- **Para qué sirve:** RF-MED-103: Configurar por tenant los sistemas de telemedición/prepago (proveedor, tipo, URL, credenciales en bóveda, datos extra, servicio y tipos de medidor que atiende, operaciones soportadas). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.telemedicion.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de sistemas de telemedición/prepago (`meteringSystems`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de sistemas de telemedición/prepago (`meteringSystems`).
- **Pantallas:** PAN-MED-23 (Sistemas de telemedición/prepago y mapeo de registros).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1621 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-54-d)

<a id="API-MED-55"></a>
#### API-MED-55 · `POST /api/med/prepaid/{accountId}/pre-sale`

- **Qué hace:** Validar preventa y unidades estimadas. Registra «pre-sale» sobre un registro de `pre-sale`.
- **Para qué sirve:** RF-MED-125: Exportar los conjuntos de datos de consumo que M06 necesita para informes a reguladores (por categoría, tramo, período, tipo de fecha: emisión, vencimiento o lectura).
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `med.miPrepago.ver`.
- **Recibe:** en la ruta `accountId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MED-33 (Mi prepago).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1622 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-55)

<a id="API-MED-56"></a>
#### API-MED-56 · `GET /api/admin/med/prepaid/accounts`

- **Qué hace:** Cuentas prepagas y recargas. Lista, con filtros y paginación, los registros de cuenta prepaga técnica del punto (`prepaidAccounts`).
- **Para qué sirve:** RF-MED-113: Mantener la cuenta prepaga técnica del punto: sistema prepago, identificador del medidor en el proveedor, modalidad (token/código o carga remota en línea), saldo informado por el proveedor, umbral de saldo bajo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.prepago.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de cuenta prepaga técnica del punto (`prepaidAccounts`) con `total`.
- **Pantallas:** PAN-MED-25 (Prepago: cuentas, recargas y conciliación).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1623 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-56)

<a id="API-MED-56-b"></a>
#### API-MED-56-b · `GET /api/admin/med/prepaid/accounts/{id}`

- **Qué hace:** Cuentas prepagas y recargas. Obtiene el detalle de un registro de cuenta prepaga técnica del punto (`prepaidAccounts`).
- **Para qué sirve:** RF-MED-113: Mantener la cuenta prepaga técnica del punto: sistema prepago, identificador del medidor en el proveedor, modalidad (token/código o carga remota en línea), saldo informado por el proveedor, umbral de saldo bajo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.prepago.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de cuenta prepaga técnica del punto (`prepaidAccounts`).
- **Pantallas:** PAN-MED-25 (Prepago: cuentas, recargas y conciliación).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1623 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-56-b)

<a id="API-MED-57"></a>
#### API-MED-57 · `POST /api/admin/med/prepaid/top-ups/{id}/retry`

- **Qué hace:** Reintentar recarga fallida o pedir devolución a M07. Reintenta un registro de recargas prepagas (`prepaidTopUps`).
- **Para qué sirve:** RF-MED-121: "Mi prepago" en la app del socio: saldo informado, últimas recargas, tokens, avisos. La compra se hace por M07/M19. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.prepago.reintentar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1624 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-57)

<a id="API-MED-57-b"></a>
#### API-MED-57-b · `POST /api/admin/med/prepaid/top-ups/{id}/refund-request`

- **Qué hace:** Reintentar recarga fallida o pedir devolución a M07. Registra «refund-request» sobre un registro de recargas prepagas (`prepaidTopUps`).
- **Para qué sirve:** RF-MED-121: "Mi prepago" en la app del socio: saldo informado, últimas recargas, tokens, avisos. La compra se hace por M07/M19. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.prepago.reintentar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1624 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-57-b)

<a id="API-MED-58"></a>
#### API-MED-58 · `GET /api/admin/med/prepaid/reconciliation`

- **Qué hace:** Conciliación diaria. Consulta `reconciliation`.
- **Para qué sirve:** RF-MED-116: Consultar el historial de cargas del proveedor y conciliarlo diariamente con las recargas cobradas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.prepago.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MED-25 (Prepago: cuentas, recargas y conciliación).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1625 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-58)

<a id="API-MED-59"></a>
#### API-MED-59 · `GET /api/admin/med/dg-contracts`

- **Qué hace:** Contratos GD; transiciones /approve, /connect, /suspend, /terminate. Consulta `dg-contracts`.
- **Para qué sirve:** RF-MED-101: Informe de pérdidas: compra activa (pico + resto + valle), cos φ, consumo facturado del servicio, pérdida y % de pérdida, mensual, anual de 13 períodos y por zonas. Cuando M12 aprueba el balance comprado vs. facturado… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.gd.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MED-26 (Contratos GD y balances).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1626 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-59)

<a id="API-MED-59-b"></a>
#### API-MED-59-b · `POST /api/admin/med/dg-contracts`

- **Qué hace:** Contratos GD; transiciones /approve, /connect, /suspend, /terminate. Registra un nuevo elemento u operación en `dg-contracts`.
- **Para qué sirve:** RF-MED-101: Informe de pérdidas: compra activa (pico + resto + valle), cos φ, consumo facturado del servicio, pérdida y % de pérdida, mensual, anual de 13 períodos y por zonas. Cuando M12 aprueba el balance comprado vs. facturado… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.gd.editar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1626 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-59-b)

<a id="API-MED-59-c"></a>
#### API-MED-59-c · `GET /api/admin/med/dg-contracts/{id}`

- **Qué hace:** Contratos GD; transiciones /approve, /connect, /suspend, /terminate. Obtiene el detalle de un registro de `dg-contracts`.
- **Para qué sirve:** RF-MED-101: Informe de pérdidas: compra activa (pico + resto + valle), cos φ, consumo facturado del servicio, pérdida y % de pérdida, mensual, anual de 13 períodos y por zonas. Cuando M12 aprueba el balance comprado vs. facturado… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.gd.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MED-26 (Contratos GD y balances).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1626 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-59-c)

<a id="API-MED-59-d"></a>
#### API-MED-59-d · `PATCH /api/admin/med/dg-contracts/{id}`

- **Qué hace:** Contratos GD; transiciones /approve, /connect, /suspend, /terminate. Modifica algunos campos de un registro de `dg-contracts` (solo los enviados).
- **Para qué sirve:** RF-MED-101: Informe de pérdidas: compra activa (pico + resto + valle), cos φ, consumo facturado del servicio, pérdida y % de pérdida, mensual, anual de 13 períodos y por zonas. Cuando M12 aprueba el balance comprado vs. facturado… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.gd.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar; cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1626 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-59-d)

<a id="API-MED-60"></a>
#### API-MED-60 · `GET /api/admin/med/billing-feed`

- **Qué hace:** Contrato de datos de consumo aprobado por servicio y período (ver 13.3). Consulta `billing-feed`.
- **Para qué sirve:** RF-MED-092: Revisar transgresiones de los últimos 6 períodos (configurable) por fecha de primera o última transgresión, y resetear la demanda declarada a la contratada con aprobación y auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.jobs.ejecutar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1627 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-60)

<a id="API-MED-61"></a>
#### API-MED-61 · `GET /api/admin/med/points/{id}/history`

- **Qué hace:** Historial de consumos y lecturas para M10 (recupero) y M09 (reclamos). Lista, con filtros y paginación, los registros de punto de medición (`meteringPoints`).
- **Para qué sirve:** RF-MED-127: Exponer a M10 el historial de consumos y lecturas de un punto para el cálculo del recupero según método aprobado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.consumos.ver`.
- **Recibe:** en la ruta `id`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de punto de medición (`meteringPoints`) con `total`.
- **Pantallas:** PAN-MED-12 (Consumos del servicio).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1628 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-61)

<a id="API-MED-62"></a>
#### API-MED-62 · `POST /api/admin/med/splits`

- **Qué hace:** División/agrupación (dryRun/confirmar). Registra un nuevo elemento u operación en `splits`.
- **Para qué sirve:** RF-MED-084: Ejecutar la división/agrupación en forma masiva con preview, exclusiones visibles e impresión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.consumos.dividir`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MED-16 (División y prorrateo).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1629 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-62)

<a id="API-MED-63"></a>
#### API-MED-63 · `GET /api/admin/med/distributions`

- **Qué hace:** ABM; POST /:id/run, /runs/:runId/revert. Lista, con filtros y paginación, los registros de distribución padre-hijos (`consumptionDistributions`).
- **Para qué sirve:** RF-MED-086: Revertir una distribución ejecutada mientras sus consumos no estén facturados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.consumos.distribuir`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de distribución padre-hijos (`consumptionDistributions`) con `total`.
- **Pantallas:** PAN-MED-17 (ABM y ejecución de distribuciones).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1630 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-63)

<a id="API-MED-63-b"></a>
#### API-MED-63-b · `POST /api/admin/med/distributions`

- **Qué hace:** ABM; POST /:id/run, /runs/:runId/revert. Da de alta un registro de distribución padre-hijos (`consumptionDistributions`).
- **Para qué sirve:** RF-MED-086: Revertir una distribución ejecutada mientras sus consumos no estén facturados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.consumos.distribuir`.
- **Recibe:** los datos de distribución padre-hijos (`consumptionDistributions`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de distribución padre-hijos (`consumptionDistributions`).
- **Pantallas:** PAN-MED-17 (ABM y ejecución de distribuciones).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1630 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-63-b)

<a id="API-MED-63-c"></a>
#### API-MED-63-c · `GET /api/admin/med/distributions/{id}`

- **Qué hace:** ABM; POST /:id/run, /runs/:runId/revert. Obtiene el detalle de un registro de distribución padre-hijos (`consumptionDistributions`).
- **Para qué sirve:** RF-MED-086: Revertir una distribución ejecutada mientras sus consumos no estén facturados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.consumos.distribuir`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de distribución padre-hijos (`consumptionDistributions`).
- **Pantallas:** PAN-MED-17 (ABM y ejecución de distribuciones).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1630 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-63-c)

<a id="API-MED-63-d"></a>
#### API-MED-63-d · `PATCH /api/admin/med/distributions/{id}`

- **Qué hace:** ABM; POST /:id/run, /runs/:runId/revert. Modifica algunos campos de un registro de distribución padre-hijos (`consumptionDistributions`) (solo los enviados).
- **Para qué sirve:** RF-MED-086: Revertir una distribución ejecutada mientras sus consumos no estén facturados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.consumos.distribuir`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de distribución padre-hijos (`consumptionDistributions`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de distribución padre-hijos (`consumptionDistributions`).
- **Pantallas:** PAN-MED-17 (ABM y ejecución de distribuciones).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1630 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-63-d)

<a id="API-MED-64"></a>
#### API-MED-64 · `GET /api/admin/med/witness`

- **Qué hace:** Testigos y consumos. Consulta `witness`.
- **Para qué sirve:** RF-MED-088: Aplicar el último consumo del testigo a la carga manual de un servicio asociado cuando el operador lo pide. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.testigos.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MED-18 (Medidores testigo y sus consumos).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1631 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-64)

<a id="API-MED-64-b"></a>
#### API-MED-64-b · `POST /api/admin/med/witness`

- **Qué hace:** Testigos y consumos. Registra un nuevo elemento u operación en `witness`.
- **Para qué sirve:** RF-MED-088: Aplicar el último consumo del testigo a la carga manual de un servicio asociado cuando el operador lo pide. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.testigos.ver`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MED-18 (Medidores testigo y sus consumos).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1631 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-64-b)

<a id="API-MED-65"></a>
#### API-MED-65 · `GET /api/admin/med/demand`

- **Qué hace:** Demanda contratada; transgresiones; POST /transgressions/:id/reset. Consulta `demand`.
- **Para qué sirve:** RF-MED-091: Detectar transgresiones (demanda registrada > contratada), calcular el % y registrar primera transgresión, demanda declarada y fecha. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.demanda.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MED-19 (Demanda contratada por período y transgresiones).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1632 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-65)

<a id="API-MED-65-b"></a>
#### API-MED-65-b · `POST /api/admin/med/demand`

- **Qué hace:** Demanda contratada; transgresiones; POST /transgressions/:id/reset. Registra un nuevo elemento u operación en `demand`.
- **Para qué sirve:** RF-MED-091: Detectar transgresiones (demanda registrada > contratada), calcular el % y registrar primera transgresión, demanda declarada y fecha. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.demanda.editar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1632 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-65-b)

<a id="API-MED-65-c"></a>
#### API-MED-65-c · `PATCH /api/admin/med/demand`

- **Qué hace:** Demanda contratada; transgresiones; POST /transgressions/:id/reset. Modifica algunos campos de un registro de `demand` (solo los enviados).
- **Para qué sirve:** RF-MED-091: Detectar transgresiones (demanda registrada > contratada), calcular el % y registrar primera transgresión, demanda declarada y fecha. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.demanda.editar`.
- **Recibe:** solo los campos a cambiar; cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1632 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-65-c)

<a id="API-MED-67"></a>
#### API-MED-67 · `GET /api/admin/med/own-metering`

- **Qué hace:** Puntos y lecturas propias; GET /losses. Consulta `own-metering`.
- **Para qué sirve:** RF-MED-100: Registrar puntos de medición propia (compra de energía, frontera, alimentadores, internos) con registros pico, resto, valle, punta, fuera de punta y reactiva, y sus lecturas/consumos por período. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.medicionPropia.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MED-21 (Medición propia y pérdidas).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1634 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-67)

<a id="API-MED-67-b"></a>
#### API-MED-67-b · `POST /api/admin/med/own-metering`

- **Qué hace:** Puntos y lecturas propias; GET /losses. Registra un nuevo elemento u operación en `own-metering`.
- **Para qué sirve:** RF-MED-100: Registrar puntos de medición propia (compra de energía, frontera, alimentadores, internos) con registros pico, resto, valle, punta, fuera de punta y reactiva, y sus lecturas/consumos por período. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.medicionPropia.editar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1634 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-67-b)

<a id="API-MED-68"></a>
#### API-MED-68 · `GET /api/admin/med/reports/{report}`

- **Qué hace:** Informes (sección 15); ?format=pdf/xlsx/csv. Obtiene el detalle de un registro de `reports`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.informes.ver`.
- **Recibe:** en la ruta `report`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MED-22 (Informes y controles de consumo), PAN-MED-27 (Tablero de lecturas y consumos).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1635 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-68)

<a id="API-MED-69"></a>
#### API-MED-69 · `GET /api/admin/med/conflicts`

- **Qué hace:** Conflictos offline. Consulta `conflicts`.
- **Para qué sirve:** RF-MED-048: Detectar y resolver conflictos entre dispositivo y servidor: tarea reasignada, lote cancelado, medidor cambiado, lectura anterior modificada, lectura ya cargada por otro medio. Conservar ambas evidencias y asignar responsable de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.conflictos.resolver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MED-34 (Conflictos de sincronización offline).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1636 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-69)

<a id="API-MED-69-b"></a>
#### API-MED-69-b · `POST /api/admin/med/conflicts/{id}/resolve`

- **Qué hace:** Conflictos offline. Resuelve un registro de `resolve`.
- **Para qué sirve:** RF-MED-048: Detectar y resolver conflictos entre dispositivo y servidor: tarea reasignada, lote cancelado, medidor cambiado, lectura anterior modificada, lectura ya cargada por otro medio. Conservar ambas evidencias y asignar responsable de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.conflictos.resolver`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MED-34 (Conflictos de sincronización offline).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1636 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-69-b)

<a id="API-MED-70"></a>
#### API-MED-70 · `GET /api/med/services/{contractId}/consumptions`

- **Qué hace:** Mis consumos (solo servicios autorizados). Lista, con filtros y paginación, los registros de consumos por canal e intervalo (`consumptions`).
- **Para qué sirve:** RF-MED-052: Registrar un consumo adicional (lectura extra estimada con descripción "Consumo adicional") con motivo y autorización. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `med.misConsumos.ver`.
- **Recibe:** en la ruta `contractId`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de consumos por canal e intervalo (`consumptions`) con `total`.
- **Pantallas:** PAN-MED-31 (Mis consumos).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1637 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-70)

<a id="API-MED-71"></a>
#### API-MED-71 · `GET /api/med/services/{contractId}/self-reading`

- **Qué hace:** Estado de ventana de autolectura. Consulta «self-reading» de un registro de `self-reading`.
- **Para qué sirve:** RF-MED-058: Avisar al socio la ventana de autolectura y el resultado (aceptada, en revisión, rechazada con motivo). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `med.autolectura.crear`.
- **Recibe:** en la ruta `contractId`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MED-32 (Autolectura).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1638 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-71)

<a id="API-MED-72"></a>
#### API-MED-72 · `POST /api/med/services/{contractId}/self-reading`

- **Qué hace:** Enviar autolectura con foto. Registra «self-reading» sobre un registro de `self-reading`.
- **Para qué sirve:** RF-MED-057: Autolectura del socio desde la app con foto del visor, dentro de una ventana de días configurada por ruta/período, sujeta a validación como cualquier lectura. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `med.autolectura.crear`.
- **Recibe:** en la ruta `contractId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MED-32 (Autolectura).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1639 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-72)

<a id="API-MED-73"></a>
#### API-MED-73 · `GET /api/med/services/{contractId}/prepaid`

- **Qué hace:** Mi prepago. Consulta «prepaid» de un registro de `prepaid`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `med.miPrepago.ver`.
- **Recibe:** en la ruta `contractId`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MED-33 (Mi prepago).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1640 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-73)

<a id="API-MED-74"></a>
#### API-MED-74 · `GET /api/admin/med/class-reviews`

- **Qué hace:** Propuestas de cambio de clase (A validar). Lista, con filtros y paginación, los registros de propuestas de cambio de clase por consumo (`consumptionClassReviews`).
- **Para qué sirve:** RF-MED-102: Proponer cambios de clase/categoría por rango de consumo con reglas declarativas y aprobación, sin aplicarlos automáticamente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.consumos.aprobar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de propuestas de cambio de clase por consumo (`consumptionClassReviews`) con `total`.
- **Pantallas:** PAN-MED-35 (Propuestas de cambio de clase por consumo).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1641 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-74)

<a id="API-MED-74-b"></a>
#### API-MED-74-b · `POST /api/admin/med/class-reviews`

- **Qué hace:** Propuestas de cambio de clase (A validar). Da de alta un registro de propuestas de cambio de clase por consumo (`consumptionClassReviews`).
- **Para qué sirve:** RF-MED-102: Proponer cambios de clase/categoría por rango de consumo con reglas declarativas y aprobación, sin aplicarlos automáticamente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.consumos.aprobar`.
- **Recibe:** los datos de propuestas de cambio de clase por consumo (`consumptionClassReviews`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de propuestas de cambio de clase por consumo (`consumptionClassReviews`).
- **Pantallas:** PAN-MED-35 (Propuestas de cambio de clase por consumo).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1641 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-74-b)

<a id="API-MED-75"></a>
#### API-MED-75 · `GET /api/v1/ext/med/consumptions`

- **Qué hace:** Consumos aprobados para BI del tenant (T10). Lista, con filtros y paginación, los registros de consumos por canal e intervalo (`consumptions`).
- **Para qué sirve:** RF-MED-111: Almacenar curvas de carga (lecturas por intervalo) importadas de AMI/MDM para grandes usuarios y análisis. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); permiso `bia.med.consumos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de consumos por canal e intervalo (`consumptions`) con `total`.
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1642 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-75)

<a id="API-MED-76"></a>
#### API-MED-76 · `POST /api/v1/ext/med/readings`

- **Qué hace:** Ingreso de lecturas desde MDM/AMI del tenant (push). Da de alta un registro de lecturas (`meterReadings`).
- **Para qué sirve:** RF-MED-049: Permitir al lecturista crear novedades que generen OT (medidor roto, conexión directa, pérdida) cuando el parámetro lo habilita. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); permiso `bia.med.lecturas.crear`.
- **Recibe:** los datos de lecturas (`meterReadings`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de lecturas (`meterReadings`).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1643 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-76)

<a id="API-MED-77"></a>
#### API-MED-77 · `GET /api/admin/med/dashboard`

- **Qué hace:** Indicadores del tablero. Consulta `dashboard`.
- **Para qué sirve:** RF-MED-124: Tablero de lecturas y consumos: avance de lotes, % leído, % estimado, excepciones abiertas, productividad, telemedición (éxito de toma de estado), prepago (recargas y fallas). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.informes.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MED-22 (Informes y controles de consumo), PAN-MED-27 (Tablero de lecturas y consumos).
- **Ola:** O7 · **Fuente:** M03 §11. API, línea 1644 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-77)

<a id="API-MED-78"></a>
#### API-MED-78 · `GET /api/admin/med/purchase-volumes`

- **Qué hace:** Volumen comprado por período de los puntos purchase/boundary, por punto, registro y franja, con origen y estado de validación (RF-MED-129... Consulta `purchase-volumes`.
- **Para qué sirve:** RF-MED-129: Exponer el volumen comprado por período de los puntos de compra/frontera (RF-MED-012; meteringPoints.pointType = purchase o boundary; RF-MED-100) por servicio (energía, gas), proveedor mayorista, punto y registro (pico, resto…
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `med.medicionPropia.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-MED-21 (Medición propia y pérdidas).
- **Ola:** O8 · **Fuente:** M03 §11. API, línea 1645 · [Ver en Swagger](../18-swagger/index.html?api=m03-med#/API/API-MED-78)
