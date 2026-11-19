# Catálogo de endpoints · M18 · Servicios sociales, otros servicios y flota

Parte del [catálogo de endpoints](../18-catalogo-endpoints.md) (artefacto 7.1). Generado el 05-11-2026 con `_trabajo/gen_18_catalogo_endpoints.py` a partir de `18-openapi/`; no se edita a mano.

## Para qué sirve esta API

Gestionar los servicios cooperativos no medidos y los recursos móviles de la cooperativa, cada uno con reglas propias (BASE §93, ESP-001), y no como un abono mensual genérico (BASE §24):

1. grupos de cobertura: adherentes y beneficiarios de un servicio (familiares, convivientes, personas a cargo), con altas, bajas, vínculos, edades, mayoría de edad y fallecimiento;
2. sepelio y subsidio por fallecimiento: planes, carencias, solicitudes, prestador, expediente y pago;
3. cementerio parque: establecimiento, reglamento, unidades de sepultura, derechos, titulares y autorizados, ocupaciones permanentes y actos (inhumación, exhumación, reducción, traslado) (BASE §90);
4. banco de sangre por convenio: adhesión, cobertura, solicitudes administrativas canalizadas al prestador, campañas de donación como coordinación administrativa, con los límites sanitarios de BASE §91;
5. salud administrativa: prestadores, profesionales, ambulancias y traslados, autorizaciones de internación por convenio, sin historia clínica;
6. planes de vivienda: planes y tipologías, precios, inscripción, adjudicación, aportes, construcción por etapas y actividades, materiales, retiros, certificados, cambios de plan, transferencias y rescisión;
7. otros servicios (BASE §92): banco ortopédico, dispenser de agua, registración de vehículo eléctrico, seguros y extensiones por tenant;
8. flota y traslados: vehículos, choferes, documentación y vencimientos, mantenimiento, uso por orden de trabajo, combustibles, viajes, rendiciones y seguimiento satelital (GPS/AVL) (MER-015).

Detalle completo en el anexo M18, sección 1. Contrato navegable: [Swagger](../18-swagger/index.html?api=m18-soc).

| Dato | Valor |
|---|---|
| Endpoints | 116 |
| Por método | DELETE 1, GET 44, PATCH 21, POST 49, PUT 1 |
| Grupos funcionales | 1 |
| Con requisito citado en el anexo | 3 |
| Con requisito inferido (a confirmar) | 106 |
| Sin requisito identificable | 7 |

## Grupos funcionales

| Grupo | Endpoints | Qué agrupa (primeros endpoints) |
|---|---|---|
| [API](#grupo-1) | 116 | Adherentes del contrato (?asOf=, ?includeEnded=); Alta de adherente.; Baja, suspensión, restauración, cambio de categoría.… |

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

116 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-SOC-001](#API-SOC-001) | GET | `/api/admin/soc/contracts/{id}/dependents` | Adherentes del contrato (?asOf=, ?includeEnded=) |
| [API-SOC-002](#API-SOC-002) | POST | `/api/admin/soc/contracts/{id}/dependents` | Alta de adherente. |
| [API-SOC-003](#API-SOC-003) | POST | `/api/admin/soc/dependents/{id}/transitions` | Baja, suspensión, restauración, cambio de categoría. |
| [API-SOC-004](#API-SOC-004) | POST | `/api/admin/soc/dependents/batches` | Previsualizar y aplicar lote (condición, mayoría, recategorización) |
| [API-SOC-005](#API-SOC-005) | GET | `/api/admin/soc/contracts/{id}/beneficiaries` | Beneficiarios. |
| [API-SOC-005-b](#API-SOC-005-b) | POST | `/api/admin/soc/contracts/{id}/beneficiaries` | Beneficiarios. |
| [API-SOC-005-c](#API-SOC-005-c) | PATCH | `/api/admin/soc/contracts/{id}/beneficiaries` | Beneficiarios. |
| [API-SOC-006](#API-SOC-006) | GET | `/api/admin/soc/contracts/{id}/billing-inputs` | Endpoint HTTP que consume M04 para el cálculo; no es un servicio interno (M04 y T12 lo citan como API-SOC-006). Cantidad y perfil de adhe... |
| [API-SOC-007](#API-SOC-007) | GET | `/api/admin/soc/persons/{personId}/roles` | ¿Es adherente o beneficiario vigente? (M01/M17) |
| [API-SOC-008](#API-SOC-008) | GET | `/api/admin/soc/coverage-plans` | Planes. |
| [API-SOC-008-b](#API-SOC-008-b) | POST | `/api/admin/soc/coverage-plans` | Planes. |
| [API-SOC-008-c](#API-SOC-008-c) | PATCH | `/api/admin/soc/coverage-plans` | Planes. |
| [API-SOC-009](#API-SOC-009) | GET | `/api/admin/soc/providers` | Prestadores. |
| [API-SOC-009-b](#API-SOC-009-b) | POST | `/api/admin/soc/providers` | Prestadores. |
| [API-SOC-009-c](#API-SOC-009-c) | PATCH | `/api/admin/soc/providers` | Prestadores. |
| [API-SOC-010](#API-SOC-010) | GET | `/api/admin/soc/agreements` | Convenios. |
| [API-SOC-010-b](#API-SOC-010-b) | POST | `/api/admin/soc/agreements` | Convenios. |
| [API-SOC-010-c](#API-SOC-010-c) | PATCH | `/api/admin/soc/agreements` | Convenios. |
| [API-SOC-011](#API-SOC-011) | GET | `/api/admin/soc/professionals` | Profesionales y especialidades. |
| [API-SOC-011-b](#API-SOC-011-b) | POST | `/api/admin/soc/professionals` | Profesionales y especialidades. |
| [API-SOC-011-c](#API-SOC-011-c) | PATCH | `/api/admin/soc/professionals` | Profesionales y especialidades. |
| [API-SOC-012](#API-SOC-012) | GET | `/api/admin/soc/benefit-requests` | Solicitudes. |
| [API-SOC-012-b](#API-SOC-012-b) | POST | `/api/admin/soc/benefit-requests` | Solicitudes. |
| [API-SOC-013](#API-SOC-013) | POST | `/api/admin/soc/benefit-requests/{id}/coverage-check` | Verificar cobertura a la fecha del evento. |
| [API-SOC-014](#API-SOC-014) | POST | `/api/admin/soc/benefit-requests/{id}/transitions` | Aprobar, rechazar, derivar, registrar respuesta, cerrar. |
| [API-SOC-015](#API-SOC-015) | GET | `/api/admin/soc/burial-cases` | Casos de sepelio. |
| [API-SOC-015-b](#API-SOC-015-b) | POST | `/api/admin/soc/burial-cases` | Casos de sepelio. |
| [API-SOC-015-c](#API-SOC-015-c) | PATCH | `/api/admin/soc/burial-cases` | Casos de sepelio. |
| [API-SOC-016](#API-SOC-016) | GET | `/api/admin/soc/death-subsidies` | Subsidios. |
| [API-SOC-016-b](#API-SOC-016-b) | POST | `/api/admin/soc/death-subsidies` | Subsidios. |
| [API-SOC-017](#API-SOC-017) | POST | `/api/admin/soc/death-subsidies/{id}/transitions` | Aprobar, rechazar, pagar. |
| [API-SOC-018](#API-SOC-018) | GET | `/api/admin/soc/cemeteries` | Establecimientos y reglamentos. |
| [API-SOC-018-b](#API-SOC-018-b) | POST | `/api/admin/soc/cemeteries` | Establecimientos y reglamentos. |
| [API-SOC-018-c](#API-SOC-018-c) | PATCH | `/api/admin/soc/cemeteries` | Establecimientos y reglamentos. |
| [API-SOC-019](#API-SOC-019) | GET | `/api/admin/soc/burial-units` | Unidades (importación masiva) |
| [API-SOC-019-b](#API-SOC-019-b) | POST | `/api/admin/soc/burial-units` | Unidades (importación masiva) |
| [API-SOC-019-c](#API-SOC-019-c) | PATCH | `/api/admin/soc/burial-units` | Unidades (importación masiva) |
| [API-SOC-020](#API-SOC-020) | POST | `/api/admin/soc/burial-units/{id}/reserve` | Reservar (control de concurrencia por version) |
| [API-SOC-021](#API-SOC-021) | GET | `/api/admin/soc/burial-rights` | Derechos. |
| [API-SOC-021-b](#API-SOC-021-b) | POST | `/api/admin/soc/burial-rights` | Derechos. |
| [API-SOC-021-c](#API-SOC-021-c) | PATCH | `/api/admin/soc/burial-rights` | Derechos. |
| [API-SOC-022](#API-SOC-022) | POST | `/api/admin/soc/burial-rights/{id}/transitions` | Formalizar, ceder, suceder, extinguir. |
| [API-SOC-023](#API-SOC-023) | GET | `/api/admin/soc/cemetery-acts` | Actos. |
| [API-SOC-023-b](#API-SOC-023-b) | POST | `/api/admin/soc/cemetery-acts` | Actos. |
| [API-SOC-024](#API-SOC-024) | POST | `/api/admin/soc/cemetery-acts/{id}/transitions` | Programar, realizar, cancelar. |
| [API-SOC-025](#API-SOC-025) | GET | `/api/admin/soc/occupancies` | Ocupaciones y registro de inhumaciones. |
| [API-SOC-026](#API-SOC-026) | GET | `/api/admin/soc/blood-requests` | Solicitudes de banco de sangre. |
| [API-SOC-026-b](#API-SOC-026-b) | POST | `/api/admin/soc/blood-requests` | Solicitudes de banco de sangre. |
| [API-SOC-026-c](#API-SOC-026-c) | PATCH | `/api/admin/soc/blood-requests` | Solicitudes de banco de sangre. |
| [API-SOC-027](#API-SOC-027) | GET | `/api/admin/soc/donation-campaigns` | Campañas y turnos. |
| [API-SOC-027-b](#API-SOC-027-b) | POST | `/api/admin/soc/donation-campaigns` | Campañas y turnos. |
| [API-SOC-027-c](#API-SOC-027-c) | PATCH | `/api/admin/soc/donation-campaigns` | Campañas y turnos. |
| [API-SOC-028](#API-SOC-028) | GET | `/api/admin/soc/health-authorizations` | Autorizaciones de internación y prácticas. |
| [API-SOC-028-b](#API-SOC-028-b) | POST | `/api/admin/soc/health-authorizations` | Autorizaciones de internación y prácticas. |
| [API-SOC-028-c](#API-SOC-028-c) | PATCH | `/api/admin/soc/health-authorizations` | Autorizaciones de internación y prácticas. |
| [API-SOC-029](#API-SOC-029) | GET | `/api/admin/soc/trips` | Viajes y tramos. |
| [API-SOC-029-b](#API-SOC-029-b) | POST | `/api/admin/soc/trips` | Viajes y tramos. |
| [API-SOC-029-c](#API-SOC-029-c) | PATCH | `/api/admin/soc/trips` | Viajes y tramos. |
| [API-SOC-030](#API-SOC-030) | POST | `/api/admin/soc/trips/{id}/transitions` | Programar, iniciar, completar, derivar, cancelar. |
| [API-SOC-031](#API-SOC-031) | GET | `/api/admin/soc/trip-characteristics` | Características de viaje. |
| [API-SOC-031-b](#API-SOC-031-b) | POST | `/api/admin/soc/trip-characteristics` | Características de viaje. |
| [API-SOC-031-c](#API-SOC-031-c) | PATCH | `/api/admin/soc/trip-characteristics` | Características de viaje. |
| [API-SOC-032](#API-SOC-032) | GET | `/api/admin/soc/housing-plans` | Planes, tipologías, etapas, actividades, materiales. |
| [API-SOC-032-b](#API-SOC-032-b) | POST | `/api/admin/soc/housing-plans` | Planes, tipologías, etapas, actividades, materiales. |
| [API-SOC-032-c](#API-SOC-032-c) | PATCH | `/api/admin/soc/housing-plans` | Planes, tipologías, etapas, actividades, materiales. |
| [API-SOC-033](#API-SOC-033) | POST | `/api/admin/soc/housing-plans/{id}/validate` | Validar configuración. |
| [API-SOC-034](#API-SOC-034) | GET | `/api/admin/soc/housing-prices` | Precios y actualización masiva (job) |
| [API-SOC-034-b](#API-SOC-034-b) | POST | `/api/admin/soc/housing-prices` | Precios y actualización masiva (job) |
| [API-SOC-035](#API-SOC-035) | GET | `/api/admin/soc/housing-units` | Viviendas. |
| [API-SOC-035-b](#API-SOC-035-b) | PATCH | `/api/admin/soc/housing-units` | Viviendas. |
| [API-SOC-036](#API-SOC-036) | POST | `/api/admin/soc/housing-units/{id}/transitions` | Adjudicar, iniciar obra, entregar, transferir, rescindir, cambiar plan. |
| [API-SOC-037](#API-SOC-037) | GET | `/api/admin/soc/housing-units/{id}/progress` | Progreso (DELETE solo si no está certificado) |
| [API-SOC-037-b](#API-SOC-037-b) | POST | `/api/admin/soc/housing-units/{id}/progress` | Progreso (DELETE solo si no está certificado) |
| [API-SOC-037-c](#API-SOC-037-c) | DELETE | `/api/admin/soc/housing-units/{id}/progress` | Progreso (DELETE solo si no está certificado) |
| [API-SOC-038](#API-SOC-038) | GET | `/api/admin/soc/housing-units/{id}/materials` | Asignar, reservar, liberar, reasignar. |
| [API-SOC-038-b](#API-SOC-038-b) | POST | `/api/admin/soc/housing-units/{id}/materials` | Asignar, reservar, liberar, reasignar. |
| [API-SOC-039](#API-SOC-039) | POST | `/api/admin/soc/housing-units/{id}/withdrawals` | Retiro con vale y devolución. |
| [API-SOC-040](#API-SOC-040) | GET | `/api/admin/soc/housing-certificates` | Certificados. |
| [API-SOC-040-b](#API-SOC-040-b) | POST | `/api/admin/soc/housing-certificates` | Certificados. |
| [API-SOC-041](#API-SOC-041) | POST | `/api/admin/soc/housing-certificates/{id}/transitions` | Aprobar, liquidar, cancelar. |
| [API-SOC-042](#API-SOC-042) | GET | `/api/admin/soc/vehicles` | Vehículos, documentos, mantenimiento. |
| [API-SOC-042-b](#API-SOC-042-b) | POST | `/api/admin/soc/vehicles` | Vehículos, documentos, mantenimiento. |
| [API-SOC-042-c](#API-SOC-042-c) | PATCH | `/api/admin/soc/vehicles` | Vehículos, documentos, mantenimiento. |
| [API-SOC-043](#API-SOC-043) | GET | `/api/admin/soc/drivers` | Choferes y asignaciones. |
| [API-SOC-043-b](#API-SOC-043-b) | POST | `/api/admin/soc/drivers` | Choferes y asignaciones. |
| [API-SOC-043-c](#API-SOC-043-c) | PATCH | `/api/admin/soc/drivers` | Choferes y asignaciones. |
| [API-SOC-044](#API-SOC-044) | GET | `/api/admin/soc/vehicles/availability` | Vehículos aptos y libres en un rango (para M10 y traslados) |
| [API-SOC-045](#API-SOC-045) | GET | `/api/admin/soc/vehicle-usages` | Usos. |
| [API-SOC-045-b](#API-SOC-045-b) | POST | `/api/admin/soc/vehicle-usages` | Usos. |
| [API-SOC-046](#API-SOC-046) | GET | `/api/admin/soc/fuel-types` | Combustibles. |
| [API-SOC-046-b](#API-SOC-046-b) | POST | `/api/admin/soc/fuel-types` | Combustibles. |
| [API-SOC-046-c](#API-SOC-046-c) | PATCH | `/api/admin/soc/fuel-types` | Combustibles. |
| [API-SOC-047](#API-SOC-047) | GET | `/api/admin/soc/fuel-loads` | Cargas. |
| [API-SOC-047-b](#API-SOC-047-b) | POST | `/api/admin/soc/fuel-loads` | Cargas. |
| [API-SOC-048](#API-SOC-048) | GET | `/api/admin/soc/trip-settlements` | Rendiciones. |
| [API-SOC-048-b](#API-SOC-048-b) | POST | `/api/admin/soc/trip-settlements` | Rendiciones. |
| [API-SOC-048-c](#API-SOC-048-c) | PATCH | `/api/admin/soc/trip-settlements` | Rendiciones. |
| [API-SOC-049](#API-SOC-049) | POST | `/api/admin/soc/trip-settlements/{id}/transitions` | Enviar, aprobar, rechazar. |
| [API-SOC-050](#API-SOC-050) | GET | `/api/admin/soc/vehicles/{id}/track` | Recorrido (?from=&to=) |
| [API-SOC-051](#API-SOC-051) | POST | `/api/v1/ext/soc/gps/positions` | Ingesta de posiciones por lote (adaptador) |
| [API-SOC-052](#API-SOC-052) | GET | `/api/admin/soc/orthopedic-loans` | Elementos y préstamos. |
| [API-SOC-052-b](#API-SOC-052-b) | POST | `/api/admin/soc/orthopedic-loans` | Elementos y préstamos. |
| [API-SOC-053](#API-SOC-053) | POST | `/api/admin/soc/dispenser-withdrawals` | Registrar retiro con validación de límites. |
| [API-SOC-054](#API-SOC-054) | GET | `/api/admin/soc/settings` | Parámetros. |
| [API-SOC-054-b](#API-SOC-054-b) | PUT | `/api/admin/soc/settings` | Parámetros. |
| [API-SOC-055](#API-SOC-055) | GET | `/api/admin/soc/reports/{reportId}` | Reportes de §15. |
| [API-SOC-056](#API-SOC-056) | GET | `/api/soc/me/groups` | Mi grupo y coberturas. |
| [API-SOC-057](#API-SOC-057) | POST | `/api/soc/me/requests` | Solicitud de alta/baja de integrante, prestación o acto. |
| [API-SOC-058](#API-SOC-058) | GET | `/api/soc/me/burial-rights` | Mis derechos. |
| [API-SOC-059](#API-SOC-059) | GET | `/api/soc/me/housing` | Mi plan de vivienda. |
| [API-SOC-060](#API-SOC-060) | GET | `/api/soc/field/trips` | Viajes del chofer y registros offline. |
| [API-SOC-060-b](#API-SOC-060-b) | POST | `/api/soc/field/trips` | Viajes del chofer y registros offline. |
| [API-SOC-061](#API-SOC-061) | GET | `/api/public/{tenantSlug}/soc/cemetery/search` | Búsqueda de difuntos: nombre y ubicación. Consumida por PAN-POR-104 de M19 (/cementerio/buscar, landing pública). |
| [API-SOC-062](#API-SOC-062) | GET | `/api/admin/soc/contracts/{id}/registrations` | Registraciones del contrato: vehículo eléctrico, equipo u otro (RF-SOC-148, HUECO-OTR-05); la baja es PATCH con endDate, nunca borrado. |
| [API-SOC-062-b](#API-SOC-062-b) | POST | `/api/admin/soc/contracts/{id}/registrations` | Registraciones del contrato: vehículo eléctrico, equipo u otro (RF-SOC-148, HUECO-OTR-05); la baja es PATCH con endDate, nunca borrado. |
| [API-SOC-062-c](#API-SOC-062-c) | PATCH | `/api/admin/soc/contracts/{id}/registrations` | Registraciones del contrato: vehículo eléctrico, equipo u otro (RF-SOC-148, HUECO-OTR-05); la baja es PATCH con endDate, nunca borrado. |

<a id="API-SOC-001"></a>
#### API-SOC-001 · `GET /api/admin/soc/contracts/{id}/dependents`

- **Qué hace:** Adherentes del contrato (?asOf=, ?includeEnded=) Lista, con filtros y paginación, los registros de adherentes (`serviceDependents`).
- **Para qué sirve:** RF-SOC-025: Ficha de adherentes imprimible por contrato. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.adherentes.ver`.
- **Recibe:** en la ruta `id`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de adherentes (`serviceDependents`) con `total`.
- **Pantallas:** PAN-PER-10 (Adherentes y beneficiarios), PAN-SOC-01 (Grupo de cobertura de un contrato).
- **Ola:** O4 · **Fuente:** M18 §11. API, línea 1557 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-001)

<a id="API-SOC-002"></a>
#### API-SOC-002 · `POST /api/admin/soc/contracts/{id}/dependents`

- **Qué hace:** Alta de adherente. Da de alta un registro de adherentes (`serviceDependents`).
- **Para qué sirve:** RF-SOC-005: Carencias configurables por plan y por adherente (desde su alta), con excepciones autorizadas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.adherentes.gestionar`.
- **Recibe:** en la ruta `id`; los datos de adherentes (`serviceDependents`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de adherentes (`serviceDependents`).
- **Pantallas:** PAN-SOC-02 (Bajas por condición, mayoría de edad y recategorización masiva).
- **Ola:** O4 · **Fuente:** M18 §11. API, línea 1558 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-002)

<a id="API-SOC-003"></a>
#### API-SOC-003 · `POST /api/admin/soc/dependents/{id}/transitions`

- **Qué hace:** Baja, suspensión, restauración, cambio de categoría. Cambia de estado (transición) un registro de adherentes (`serviceDependents`).
- **Para qué sirve:** RF-SOC-019: Cascada por desconexión y reconexión del contrato: baja o suspensión de adherentes y beneficiarios; al reconectar, consultar o restaurar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.adherentes.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SOC-02 (Bajas por condición, mayoría de edad y recategorización masiva).
- **Ola:** O4 · **Fuente:** M18 §11. API, línea 1559 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-003)

<a id="API-SOC-004"></a>
#### API-SOC-004 · `POST /api/admin/soc/dependents/batches`

- **Qué hace:** Previsualizar y aplicar lote (condición, mayoría, recategorización) Registra un nuevo elemento u operación en adherentes (`serviceDependents`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-SOC-016: Cambio masivo de categoría de adherentes (recategorización por edad u otra condición). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.adherentes.gestionar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-SOC-02 (Bajas por condición, mayoría de edad y recategorización masiva).
- **Ola:** O4 · **Fuente:** M18 §11. API, línea 1560 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-004)

<a id="API-SOC-005"></a>
#### API-SOC-005 · `GET /api/admin/soc/contracts/{id}/beneficiaries`

- **Qué hace:** Beneficiarios. Lista, con filtros y paginación, los registros de beneficiarios del contrato (`serviceBeneficiaries`).
- **Para qué sirve:** RF-SOC-035: Consultar prestaciones utilizadas por grupo, beneficiario, plan y período, contra topes. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.beneficiarios.gestionar`.
- **Recibe:** en la ruta `id`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de beneficiarios del contrato (`serviceBeneficiaries`) con `total`.
- **Ola:** O4 · **Fuente:** M18 §11. API, línea 1561 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-005)

<a id="API-SOC-005-b"></a>
#### API-SOC-005-b · `POST /api/admin/soc/contracts/{id}/beneficiaries`

- **Qué hace:** Beneficiarios. Da de alta un registro de beneficiarios del contrato (`serviceBeneficiaries`).
- **Para qué sirve:** RF-SOC-035: Consultar prestaciones utilizadas por grupo, beneficiario, plan y período, contra topes. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.beneficiarios.gestionar`.
- **Recibe:** en la ruta `id`; los datos de beneficiarios del contrato (`serviceBeneficiaries`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de beneficiarios del contrato (`serviceBeneficiaries`).
- **Ola:** O4 · **Fuente:** M18 §11. API, línea 1561 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-005-b)

<a id="API-SOC-005-c"></a>
#### API-SOC-005-c · `PATCH /api/admin/soc/contracts/{id}/beneficiaries`

- **Qué hace:** Beneficiarios. Modifica algunos campos de un registro de beneficiarios del contrato (`serviceBeneficiaries`) (solo los enviados).
- **Para qué sirve:** RF-SOC-035: Consultar prestaciones utilizadas por grupo, beneficiario, plan y período, contra topes. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.beneficiarios.gestionar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de beneficiarios del contrato (`serviceBeneficiaries`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de beneficiarios del contrato (`serviceBeneficiaries`).
- **Ola:** O4 · **Fuente:** M18 §11. API, línea 1561 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-005-c)

<a id="API-SOC-006"></a>
#### API-SOC-006 · `GET /api/admin/soc/contracts/{id}/billing-inputs`

- **Qué hace:** Endpoint HTTP que consume M04 para el cálculo; no es un servicio interno (M04 y T12 lo citan como API-SOC-006). Cantidad y perfil de adhe... Consulta «billing-inputs» de un registro de `billing-inputs`.
- **Para qué sirve:** RF-SOC-001: Definir planes de cobertura por servicio social: prestaciones incluidas, vínculos admitidos, edades mínima y máxima por vínculo, ocupación, discapacidad, cantidad máxima de adherentes, carencias, alcance territorial, exclusiones… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.adherentes.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PER-10 (Adherentes y beneficiarios), PAN-SOC-01 (Grupo de cobertura de un contrato).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1562 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-006)

<a id="API-SOC-007"></a>
#### API-SOC-007 · `GET /api/admin/soc/persons/{personId}/roles`

- **Qué hace:** ¿Es adherente o beneficiario vigente? (M01/M17) Consulta «roles» de un registro de `roles`.
- **Para qué sirve:** RF-SOC-009: Diccionario de términos por tenant (adherente, beneficiario, grupo familiar, parcela). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.adherentes.ver`.
- **Recibe:** en la ruta `personId`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-PER-10 (Adherentes y beneficiarios), PAN-SOC-01 (Grupo de cobertura de un contrato).
- **Ola:** O4 · **Fuente:** M18 §11. API, línea 1563 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-007)

<a id="API-SOC-008"></a>
#### API-SOC-008 · `GET /api/admin/soc/coverage-plans`

- **Qué hace:** Planes. Lista, con filtros y paginación, los registros de planes de cobertura (`coveragePlans`).
- **Para qué sirve:** RF-SOC-109: Los planes de vivienda no se reconectan como un servicio de red. · RF-SOC-089: Una cuenta no puede tener dos planes de vivienda. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.planes.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de planes de cobertura (`coveragePlans`) con `total`.
- **Pantallas:** PAN-SOC-03 (Planes de cobertura).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1564 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-008)

<a id="API-SOC-008-b"></a>
#### API-SOC-008-b · `POST /api/admin/soc/coverage-plans`

- **Qué hace:** Planes. Da de alta un registro de planes de cobertura (`coveragePlans`).
- **Para qué sirve:** RF-SOC-109: Los planes de vivienda no se reconectan como un servicio de red. · RF-SOC-089: Una cuenta no puede tener dos planes de vivienda. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.planes.configurar`.
- **Recibe:** los datos de planes de cobertura (`coveragePlans`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de planes de cobertura (`coveragePlans`).
- **Pantallas:** PAN-SOC-03 (Planes de cobertura).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1564 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-008-b)

<a id="API-SOC-008-c"></a>
#### API-SOC-008-c · `PATCH /api/admin/soc/coverage-plans`

- **Qué hace:** Planes. Modifica algunos campos de un registro de planes de cobertura (`coveragePlans`) (solo los enviados).
- **Para qué sirve:** RF-SOC-109: Los planes de vivienda no se reconectan como un servicio de red. · RF-SOC-089: Una cuenta no puede tener dos planes de vivienda. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.planes.configurar`.
- **Recibe:** solo los campos a cambiar de planes de cobertura (`coveragePlans`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de planes de cobertura (`coveragePlans`).
- **Pantallas:** PAN-SOC-03 (Planes de cobertura).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1564 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-008-c)

<a id="API-SOC-009"></a>
#### API-SOC-009 · `GET /api/admin/soc/providers`

- **Qué hace:** Prestadores. Lista, con filtros y paginación, los registros de prestadores (`careProviders`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.prestadores.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de prestadores (`careProviders`) con `total`.
- **Pantallas:** PAN-SOC-04 (Prestadores y convenios).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1565 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-009)

<a id="API-SOC-009-b"></a>
#### API-SOC-009-b · `POST /api/admin/soc/providers`

- **Qué hace:** Prestadores. Da de alta un registro de prestadores (`careProviders`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.prestadores.gestionar`.
- **Recibe:** los datos de prestadores (`careProviders`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de prestadores (`careProviders`).
- **Pantallas:** PAN-SOC-04 (Prestadores y convenios).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1565 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-009-b)

<a id="API-SOC-009-c"></a>
#### API-SOC-009-c · `PATCH /api/admin/soc/providers`

- **Qué hace:** Prestadores. Modifica algunos campos de un registro de prestadores (`careProviders`) (solo los enviados).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.prestadores.gestionar`.
- **Recibe:** solo los campos a cambiar de prestadores (`careProviders`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de prestadores (`careProviders`).
- **Pantallas:** PAN-SOC-04 (Prestadores y convenios).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1565 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-009-c)

<a id="API-SOC-010"></a>
#### API-SOC-010 · `GET /api/admin/soc/agreements`

- **Qué hace:** Convenios. Lista, con filtros y paginación, los registros de convenios con prestadores (`providerAgreements`).
- **Para qué sirve:** RF-SOC-034: Registrar costos y autorizaciones del prestador (número de autorización, importe convenido, factura del prestador vinculada en M12). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.convenios.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de convenios con prestadores (`providerAgreements`) con `total`.
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1566 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-010)

<a id="API-SOC-010-b"></a>
#### API-SOC-010-b · `POST /api/admin/soc/agreements`

- **Qué hace:** Convenios. Da de alta un registro de convenios con prestadores (`providerAgreements`).
- **Para qué sirve:** RF-SOC-034: Registrar costos y autorizaciones del prestador (número de autorización, importe convenido, factura del prestador vinculada en M12). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.convenios.gestionar`.
- **Recibe:** los datos de convenios con prestadores (`providerAgreements`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de convenios con prestadores (`providerAgreements`).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1566 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-010-b)

<a id="API-SOC-010-c"></a>
#### API-SOC-010-c · `PATCH /api/admin/soc/agreements`

- **Qué hace:** Convenios. Modifica algunos campos de un registro de convenios con prestadores (`providerAgreements`) (solo los enviados).
- **Para qué sirve:** RF-SOC-034: Registrar costos y autorizaciones del prestador (número de autorización, importe convenido, factura del prestador vinculada en M12). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.convenios.gestionar`.
- **Recibe:** solo los campos a cambiar de convenios con prestadores (`providerAgreements`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de convenios con prestadores (`providerAgreements`).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1566 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-010-c)

<a id="API-SOC-011"></a>
#### API-SOC-011 · `GET /api/admin/soc/professionals`

- **Qué hace:** Profesionales y especialidades. Lista, con filtros y paginación, los registros de profesionales (`medicalProfessionals`).
- **Para qué sirve:** RF-SOC-007: Catálogo de especialidades y profesionales (médicos) vinculados a prestadores y viajes. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.profesionales.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de profesionales (`medicalProfessionals`) con `total`.
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1567 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-011)

<a id="API-SOC-011-b"></a>
#### API-SOC-011-b · `POST /api/admin/soc/professionals`

- **Qué hace:** Profesionales y especialidades. Da de alta un registro de profesionales (`medicalProfessionals`).
- **Para qué sirve:** RF-SOC-007: Catálogo de especialidades y profesionales (médicos) vinculados a prestadores y viajes. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.profesionales.gestionar`.
- **Recibe:** los datos de profesionales (`medicalProfessionals`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de profesionales (`medicalProfessionals`).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1567 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-011-b)

<a id="API-SOC-011-c"></a>
#### API-SOC-011-c · `PATCH /api/admin/soc/professionals`

- **Qué hace:** Profesionales y especialidades. Modifica algunos campos de un registro de profesionales (`medicalProfessionals`) (solo los enviados).
- **Para qué sirve:** RF-SOC-007: Catálogo de especialidades y profesionales (médicos) vinculados a prestadores y viajes. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.profesionales.gestionar`.
- **Recibe:** solo los campos a cambiar de profesionales (`medicalProfessionals`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de profesionales (`medicalProfessionals`).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1567 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-011-c)

<a id="API-SOC-012"></a>
#### API-SOC-012 · `GET /api/admin/soc/benefit-requests`

- **Qué hace:** Solicitudes. Lista, con filtros y paginación, los registros de solicitudes de prestación (`benefitRequests`).
- **Para qué sirve:** RF-SOC-083: Viaje desde fallecimiento: el trámite de fallecimiento puede crear un traslado vinculado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.solicitudes.crear`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de solicitudes de prestación (`benefitRequests`) con `total`.
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1568 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-012)

<a id="API-SOC-012-b"></a>
#### API-SOC-012-b · `POST /api/admin/soc/benefit-requests`

- **Qué hace:** Solicitudes. Da de alta un registro de solicitudes de prestación (`benefitRequests`).
- **Para qué sirve:** RF-SOC-083: Viaje desde fallecimiento: el trámite de fallecimiento puede crear un traslado vinculado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.solicitudes.crear`.
- **Recibe:** los datos de solicitudes de prestación (`benefitRequests`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de solicitudes de prestación (`benefitRequests`).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1568 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-012-b)

<a id="API-SOC-013"></a>
#### API-SOC-013 · `POST /api/admin/soc/benefit-requests/{id}/coverage-check`

- **Qué hace:** Verificar cobertura a la fecha del evento. Registra «coverage-check» sobre un registro de solicitudes de prestación (`benefitRequests`).
- **Para qué sirve:** RF-SOC-032: Verificar cobertura a la fecha del evento: contrato vigente, adherente vigente, carencia cumplida, prestación incluida, topes. Se agrega (HUECO-SEP-01): cobertura no suspendida por mora a la fecha del evento según la condición… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.solicitudes.ver`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SOC-05 (Bandeja de solicitudes de prestación), PAN-SOC-06 (Detalle de solicitud).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1569 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-013)

<a id="API-SOC-014"></a>
#### API-SOC-014 · `POST /api/admin/soc/benefit-requests/{id}/transitions`

- **Qué hace:** Aprobar, rechazar, derivar, registrar respuesta, cerrar. Cambia de estado (transición) un registro de solicitudes de prestación (`benefitRequests`).
- **Para qué sirve:** RF-SOC-033: Autorizar o rechazar con motivo; derivar excepciones a un responsable con plazo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.solicitudes.resolver`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1570 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-014)

<a id="API-SOC-015"></a>
#### API-SOC-015 · `GET /api/admin/soc/burial-cases`

- **Qué hace:** Casos de sepelio. Consulta `burial-cases`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.sepelio.gestionar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SOC-07 (Caso de sepelio).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1571 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-015)

<a id="API-SOC-015-b"></a>
#### API-SOC-015-b · `POST /api/admin/soc/burial-cases`

- **Qué hace:** Casos de sepelio. Registra un nuevo elemento u operación en `burial-cases`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.sepelio.gestionar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SOC-07 (Caso de sepelio).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1571 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-015-b)

<a id="API-SOC-015-c"></a>
#### API-SOC-015-c · `PATCH /api/admin/soc/burial-cases`

- **Qué hace:** Casos de sepelio. Modifica algunos campos de un registro de `burial-cases` (solo los enviados).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.sepelio.gestionar`.
- **Recibe:** solo los campos a cambiar; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SOC-07 (Caso de sepelio).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1571 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-015-c)

<a id="API-SOC-016"></a>
#### API-SOC-016 · `GET /api/admin/soc/death-subsidies`

- **Qué hace:** Subsidios. Consulta `death-subsidies`.
- **Para qué sirve:** RF-SOC-083: Viaje desde fallecimiento: el trámite de fallecimiento puede crear un traslado vinculado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.subsidios.crear`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SOC-08 (Subsidios por fallecimiento).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1572 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-016)

<a id="API-SOC-016-b"></a>
#### API-SOC-016-b · `POST /api/admin/soc/death-subsidies`

- **Qué hace:** Subsidios. Registra un nuevo elemento u operación en `death-subsidies`.
- **Para qué sirve:** RF-SOC-083: Viaje desde fallecimiento: el trámite de fallecimiento puede crear un traslado vinculado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.subsidios.crear`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SOC-08 (Subsidios por fallecimiento).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1572 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-016-b)

<a id="API-SOC-017"></a>
#### API-SOC-017 · `POST /api/admin/soc/death-subsidies/{id}/transitions`

- **Qué hace:** Aprobar, rechazar, pagar. Cambia de estado (transición) un registro de `transitions`.
- **Para qué sirve:** RF-SOC-044: Subsidio por fallecimiento: reglamento y fondo, requisitos, beneficiarios con porcentaje, expediente, aprobación y pago (M14). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.subsidios.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1573 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-017)

<a id="API-SOC-018"></a>
#### API-SOC-018 · `GET /api/admin/soc/cemeteries`

- **Qué hace:** Establecimientos y reglamentos. Lista, con filtros y paginación, los registros de cementerios parque (`cemeteries`).
- **Para qué sirve:** RF-SOC-049: Establecimiento: nombre, habilitación, modalidad jurídica (CCyC arts. 2103 a 2113 u otra concesión), autoridad de policía mortuoria, reglamento versionado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.cementerio.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de cementerios parque (`cemeteries`) con `total`.
- **Pantallas:** PAN-SOC-12 (Establecimientos, reglamentos, sectores y tipos de unidad).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1574 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-018)

<a id="API-SOC-018-b"></a>
#### API-SOC-018-b · `POST /api/admin/soc/cemeteries`

- **Qué hace:** Establecimientos y reglamentos. Da de alta un registro de cementerios parque (`cemeteries`).
- **Para qué sirve:** RF-SOC-049: Establecimiento: nombre, habilitación, modalidad jurídica (CCyC arts. 2103 a 2113 u otra concesión), autoridad de policía mortuoria, reglamento versionado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.cementerio.configurar`.
- **Recibe:** los datos de cementerios parque (`cemeteries`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de cementerios parque (`cemeteries`).
- **Pantallas:** PAN-SOC-12 (Establecimientos, reglamentos, sectores y tipos de unidad).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1574 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-018-b)

<a id="API-SOC-018-c"></a>
#### API-SOC-018-c · `PATCH /api/admin/soc/cemeteries`

- **Qué hace:** Establecimientos y reglamentos. Modifica algunos campos de un registro de cementerios parque (`cemeteries`) (solo los enviados).
- **Para qué sirve:** RF-SOC-049: Establecimiento: nombre, habilitación, modalidad jurídica (CCyC arts. 2103 a 2113 u otra concesión), autoridad de policía mortuoria, reglamento versionado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.cementerio.configurar`.
- **Recibe:** solo los campos a cambiar de cementerios parque (`cemeteries`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de cementerios parque (`cemeteries`).
- **Pantallas:** PAN-SOC-12 (Establecimientos, reglamentos, sectores y tipos de unidad).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1574 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-018-c)

<a id="API-SOC-019"></a>
#### API-SOC-019 · `GET /api/admin/soc/burial-units`

- **Qué hace:** Unidades (importación masiva) Lista, con filtros y paginación, los registros de parcelas y nichos (`burialUnits`).
- **Para qué sirve:** RF-SOC-050: Catálogo físico jerárquico de sectores, manzanas, filas y unidades (parcela, nicho, urnario, otras) con capacidad por niveles. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.cementerio.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de parcelas y nichos (`burialUnits`) con `total`.
- **Pantallas:** PAN-SOC-09 (Plano y catálogo de unidades).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1575 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-019)

<a id="API-SOC-019-b"></a>
#### API-SOC-019-b · `POST /api/admin/soc/burial-units`

- **Qué hace:** Unidades (importación masiva) Da de alta un registro de parcelas y nichos (`burialUnits`).
- **Para qué sirve:** RF-SOC-050: Catálogo físico jerárquico de sectores, manzanas, filas y unidades (parcela, nicho, urnario, otras) con capacidad por niveles. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.cementerio.configurar`.
- **Recibe:** los datos de parcelas y nichos (`burialUnits`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de parcelas y nichos (`burialUnits`).
- **Pantallas:** PAN-SOC-12 (Establecimientos, reglamentos, sectores y tipos de unidad).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1575 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-019-b)

<a id="API-SOC-019-c"></a>
#### API-SOC-019-c · `PATCH /api/admin/soc/burial-units`

- **Qué hace:** Unidades (importación masiva) Modifica algunos campos de un registro de parcelas y nichos (`burialUnits`) (solo los enviados).
- **Para qué sirve:** RF-SOC-050: Catálogo físico jerárquico de sectores, manzanas, filas y unidades (parcela, nicho, urnario, otras) con capacidad por niveles. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.cementerio.configurar`.
- **Recibe:** solo los campos a cambiar de parcelas y nichos (`burialUnits`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de parcelas y nichos (`burialUnits`).
- **Pantallas:** PAN-SOC-12 (Establecimientos, reglamentos, sectores y tipos de unidad).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1575 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-019-c)

<a id="API-SOC-020"></a>
#### API-SOC-020 · `POST /api/admin/soc/burial-units/{id}/reserve`

- **Qué hace:** Reservar (control de concurrencia por version) Registra «reserve» sobre un registro de parcelas y nichos (`burialUnits`).
- **Para qué sirve:** RF-SOC-051: Estados separados de disponibilidad, reserva, derecho adjudicado y ocupación; impedir reserva o venta duplicada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.derechos.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SOC-10 (Ficha del derecho de sepultura).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1576 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-020)

<a id="API-SOC-021"></a>
#### API-SOC-021 · `GET /api/admin/soc/burial-rights`

- **Qué hace:** Derechos. Lista, con filtros y paginación, los registros de derechos de sepultura (`burialRights`).
- **Para qué sirve:** RF-SOC-143: Portal del asociado (renderizado por M19): grupo, coberturas, solicitudes, derechos de sepultura, plan de vivienda. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.derechos.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de derechos de sepultura (`burialRights`) con `total`.
- **Pantallas:** PAN-SOC-10 (Ficha del derecho de sepultura).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1577 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-021)

<a id="API-SOC-021-b"></a>
#### API-SOC-021-b · `POST /api/admin/soc/burial-rights`

- **Qué hace:** Derechos. Da de alta un registro de derechos de sepultura (`burialRights`).
- **Para qué sirve:** RF-SOC-143: Portal del asociado (renderizado por M19): grupo, coberturas, solicitudes, derechos de sepultura, plan de vivienda. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.derechos.gestionar`.
- **Recibe:** los datos de derechos de sepultura (`burialRights`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de derechos de sepultura (`burialRights`).
- **Pantallas:** PAN-SOC-10 (Ficha del derecho de sepultura).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1577 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-021-b)

<a id="API-SOC-021-c"></a>
#### API-SOC-021-c · `PATCH /api/admin/soc/burial-rights`

- **Qué hace:** Derechos. Modifica algunos campos de un registro de derechos de sepultura (`burialRights`) (solo los enviados).
- **Para qué sirve:** RF-SOC-143: Portal del asociado (renderizado por M19): grupo, coberturas, solicitudes, derechos de sepultura, plan de vivienda. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.derechos.gestionar`.
- **Recibe:** solo los campos a cambiar de derechos de sepultura (`burialRights`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de derechos de sepultura (`burialRights`).
- **Pantallas:** PAN-SOC-10 (Ficha del derecho de sepultura).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1577 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-021-c)

<a id="API-SOC-022"></a>
#### API-SOC-022 · `POST /api/admin/soc/burial-rights/{id}/transitions`

- **Qué hace:** Formalizar, ceder, suceder, extinguir. Cambia de estado (transición) un registro de derechos de sepultura (`burialRights`).
- **Para qué sirve:** RF-SOC-143: Portal del asociado (renderizado por M19): grupo, coberturas, solicitudes, derechos de sepultura, plan de vivienda. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.derechos.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SOC-10 (Ficha del derecho de sepultura).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1578 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-022)

<a id="API-SOC-023"></a>
#### API-SOC-023 · `GET /api/admin/soc/cemetery-acts`

- **Qué hace:** Actos. Lista, con filtros y paginación, los registros de inhumaciones, exhumaciones, traslados (`cemeteryActs`).
- **Para qué sirve:** RF-SOC-056: Actos: inhumación, exhumación, reducción, traslado (interno o externo), con permiso municipal, identificación, fecha, origen y destino, responsables, autorizante y documentación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.actos.programar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de inhumaciones, exhumaciones, traslados (`cemeteryActs`) con `total`.
- **Pantallas:** PAN-SOC-11 (Agenda de actos).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1579 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-023)

<a id="API-SOC-023-b"></a>
#### API-SOC-023-b · `POST /api/admin/soc/cemetery-acts`

- **Qué hace:** Actos. Da de alta un registro de inhumaciones, exhumaciones, traslados (`cemeteryActs`).
- **Para qué sirve:** RF-SOC-056: Actos: inhumación, exhumación, reducción, traslado (interno o externo), con permiso municipal, identificación, fecha, origen y destino, responsables, autorizante y documentación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.actos.programar`.
- **Recibe:** los datos de inhumaciones, exhumaciones, traslados (`cemeteryActs`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de inhumaciones, exhumaciones, traslados (`cemeteryActs`).
- **Pantallas:** PAN-SOC-11 (Agenda de actos).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1579 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-023-b)

<a id="API-SOC-024"></a>
#### API-SOC-024 · `POST /api/admin/soc/cemetery-acts/{id}/transitions`

- **Qué hace:** Programar, realizar, cancelar. Cambia de estado (transición) un registro de inhumaciones, exhumaciones, traslados (`cemeteryActs`).
- **Para qué sirve:** RF-SOC-082: No despachar emergencias: el sistema registra traslados programados o derivados y deriva emergencias al prestador habilitado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.actos.registrar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SOC-35 (Registro de actos en el parque).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1580 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-024)

<a id="API-SOC-025"></a>
#### API-SOC-025 · `GET /api/admin/soc/occupancies`

- **Qué hace:** Ocupaciones y registro de inhumaciones. Lista, con filtros y paginación, los registros de ocupaciones (`burialOccupancies`).
- **Para qué sirve:** RF-SOC-058: Registro permanente de ocupaciones e inhumaciones; nunca se borra ni se libera una unidad ocupada por falta de pago. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.cementerio.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ocupaciones (`burialOccupancies`) con `total`.
- **Pantallas:** PAN-SOC-09 (Plano y catálogo de unidades).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1581 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-025)

<a id="API-SOC-026"></a>
#### API-SOC-026 · `GET /api/admin/soc/blood-requests`

- **Qué hace:** Solicitudes de banco de sangre. Consulta `blood-requests`.
- **Para qué sirve:** RF-SOC-073: El bot y las reglas de deuda no resuelven solicitudes de sangre (AGR-030). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.sangre.gestionar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1582 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-026)

<a id="API-SOC-026-b"></a>
#### API-SOC-026-b · `POST /api/admin/soc/blood-requests`

- **Qué hace:** Solicitudes de banco de sangre. Registra un nuevo elemento u operación en `blood-requests`.
- **Para qué sirve:** RF-SOC-073: El bot y las reglas de deuda no resuelven solicitudes de sangre (AGR-030). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.sangre.gestionar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1582 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-026-b)

<a id="API-SOC-026-c"></a>
#### API-SOC-026-c · `PATCH /api/admin/soc/blood-requests`

- **Qué hace:** Solicitudes de banco de sangre. Modifica algunos campos de un registro de `blood-requests` (solo los enviados).
- **Para qué sirve:** RF-SOC-073: El bot y las reglas de deuda no resuelven solicitudes de sangre (AGR-030). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.sangre.gestionar`.
- **Recibe:** solo los campos a cambiar; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1582 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-026-c)

<a id="API-SOC-027"></a>
#### API-SOC-027 · `GET /api/admin/soc/donation-campaigns`

- **Qué hace:** Campañas y turnos. Lista, con filtros y paginación, los registros de campañas de donación (`donationCampaigns`).
- **Para qué sirve:** RF-SOC-070: Campañas y turnos de donación como coordinación administrativa, sin decidir aptitud; edades de donante como filtro informativo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.campanas.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de campañas de donación (`donationCampaigns`) con `total`.
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1583 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-027)

<a id="API-SOC-027-b"></a>
#### API-SOC-027-b · `POST /api/admin/soc/donation-campaigns`

- **Qué hace:** Campañas y turnos. Da de alta un registro de campañas de donación (`donationCampaigns`).
- **Para qué sirve:** RF-SOC-070: Campañas y turnos de donación como coordinación administrativa, sin decidir aptitud; edades de donante como filtro informativo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.campanas.gestionar`.
- **Recibe:** los datos de campañas de donación (`donationCampaigns`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de campañas de donación (`donationCampaigns`).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1583 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-027-b)

<a id="API-SOC-027-c"></a>
#### API-SOC-027-c · `PATCH /api/admin/soc/donation-campaigns`

- **Qué hace:** Campañas y turnos. Modifica algunos campos de un registro de campañas de donación (`donationCampaigns`) (solo los enviados).
- **Para qué sirve:** RF-SOC-070: Campañas y turnos de donación como coordinación administrativa, sin decidir aptitud; edades de donante como filtro informativo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.campanas.gestionar`.
- **Recibe:** solo los campos a cambiar de campañas de donación (`donationCampaigns`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de campañas de donación (`donationCampaigns`).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1583 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-027-c)

<a id="API-SOC-028"></a>
#### API-SOC-028 · `GET /api/admin/soc/health-authorizations`

- **Qué hace:** Autorizaciones de internación y prácticas. Lista, con filtros y paginación, los registros de autorizaciones de internación y prácticas (`healthAuthorizations`).
- **Para qué sirve:** RF-SOC-081: Autorización administrativa de internación o práctica por convenio: prestador, fechas, número de autorización, cobertura y costo; sin datos clínicos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.autorizaciones.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de autorizaciones de internación y prácticas (`healthAuthorizations`) con `total`.
- **Pantallas:** PAN-SOC-16 (Autorizaciones de internación y prácticas).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1584 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-028)

<a id="API-SOC-028-b"></a>
#### API-SOC-028-b · `POST /api/admin/soc/health-authorizations`

- **Qué hace:** Autorizaciones de internación y prácticas. Da de alta un registro de autorizaciones de internación y prácticas (`healthAuthorizations`).
- **Para qué sirve:** RF-SOC-081: Autorización administrativa de internación o práctica por convenio: prestador, fechas, número de autorización, cobertura y costo; sin datos clínicos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.autorizaciones.gestionar`.
- **Recibe:** los datos de autorizaciones de internación y prácticas (`healthAuthorizations`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de autorizaciones de internación y prácticas (`healthAuthorizations`).
- **Pantallas:** PAN-SOC-16 (Autorizaciones de internación y prácticas).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1584 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-028-b)

<a id="API-SOC-028-c"></a>
#### API-SOC-028-c · `PATCH /api/admin/soc/health-authorizations`

- **Qué hace:** Autorizaciones de internación y prácticas. Modifica algunos campos de un registro de autorizaciones de internación y prácticas (`healthAuthorizations`) (solo los enviados).
- **Para qué sirve:** RF-SOC-081: Autorización administrativa de internación o práctica por convenio: prestador, fechas, número de autorización, cobertura y costo; sin datos clínicos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.autorizaciones.gestionar`.
- **Recibe:** solo los campos a cambiar de autorizaciones de internación y prácticas (`healthAuthorizations`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de autorizaciones de internación y prácticas (`healthAuthorizations`).
- **Pantallas:** PAN-SOC-16 (Autorizaciones de internación y prácticas).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1584 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-028-c)

<a id="API-SOC-029"></a>
#### API-SOC-029 · `GET /api/admin/soc/trips`

- **Qué hace:** Viajes y tramos. Lista, con filtros y paginación, los registros de traslados sanitarios y generales (`transportTrips`).
- **Para qué sirve:** RF-SOC-075: Viajes de varios tramos vinculados a un viaje original. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.traslados.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de traslados sanitarios y generales (`transportTrips`) con `total`.
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1585 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-029)

<a id="API-SOC-029-b"></a>
#### API-SOC-029-b · `POST /api/admin/soc/trips`

- **Qué hace:** Viajes y tramos. Da de alta un registro de traslados sanitarios y generales (`transportTrips`).
- **Para qué sirve:** RF-SOC-075: Viajes de varios tramos vinculados a un viaje original. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.traslados.gestionar`.
- **Recibe:** los datos de traslados sanitarios y generales (`transportTrips`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de traslados sanitarios y generales (`transportTrips`).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1585 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-029-b)

<a id="API-SOC-029-c"></a>
#### API-SOC-029-c · `PATCH /api/admin/soc/trips`

- **Qué hace:** Viajes y tramos. Modifica algunos campos de un registro de traslados sanitarios y generales (`transportTrips`) (solo los enviados).
- **Para qué sirve:** RF-SOC-075: Viajes de varios tramos vinculados a un viaje original. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.traslados.gestionar`.
- **Recibe:** solo los campos a cambiar de traslados sanitarios y generales (`transportTrips`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de traslados sanitarios y generales (`transportTrips`).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1585 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-029-c)

<a id="API-SOC-030"></a>
#### API-SOC-030 · `POST /api/admin/soc/trips/{id}/transitions`

- **Qué hace:** Programar, iniciar, completar, derivar, cancelar. Cambia de estado (transición) un registro de traslados sanitarios y generales (`transportTrips`).
- **Para qué sirve:** RF-SOC-082: No despachar emergencias: el sistema registra traslados programados o derivados y deriva emergencias al prestador habilitado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.traslados.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1586 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-030)

<a id="API-SOC-031"></a>
#### API-SOC-031 · `GET /api/admin/soc/trip-characteristics`

- **Qué hace:** Características de viaje. Lista, con filtros y paginación, los registros de características del traslado (`tripCharacteristics`).
- **Para qué sirve:** RF-SOC-076: Características de viaje configurables (programado, alta, derivación, diálisis) y su efecto en tarifa. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.config.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de características del traslado (`tripCharacteristics`) con `total`.
- **Pantallas:** PAN-SOC-29 (Parámetros del módulo).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1587 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-031)

<a id="API-SOC-031-b"></a>
#### API-SOC-031-b · `POST /api/admin/soc/trip-characteristics`

- **Qué hace:** Características de viaje. Da de alta un registro de características del traslado (`tripCharacteristics`).
- **Para qué sirve:** RF-SOC-076: Características de viaje configurables (programado, alta, derivación, diálisis) y su efecto en tarifa. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.config.configurar`.
- **Recibe:** los datos de características del traslado (`tripCharacteristics`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de características del traslado (`tripCharacteristics`).
- **Pantallas:** PAN-SOC-29 (Parámetros del módulo).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1587 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-031-b)

<a id="API-SOC-031-c"></a>
#### API-SOC-031-c · `PATCH /api/admin/soc/trip-characteristics`

- **Qué hace:** Características de viaje. Modifica algunos campos de un registro de características del traslado (`tripCharacteristics`) (solo los enviados).
- **Para qué sirve:** RF-SOC-076: Características de viaje configurables (programado, alta, derivación, diálisis) y su efecto en tarifa. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.config.configurar`.
- **Recibe:** solo los campos a cambiar de características del traslado (`tripCharacteristics`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de características del traslado (`tripCharacteristics`).
- **Pantallas:** PAN-SOC-29 (Parámetros del módulo).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1587 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-031-c)

<a id="API-SOC-032"></a>
#### API-SOC-032 · `GET /api/admin/soc/housing-plans`

- **Qué hace:** Planes, tipologías, etapas, actividades, materiales. Lista, con filtros y paginación, los registros de planes de vivienda (`housingPlans`).
- **Para qué sirve:** RF-SOC-098: Composición de materiales por actividad (tipología) y reparto en la vivienda. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.vivienda.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de planes de vivienda (`housingPlans`) con `total`.
- **Pantallas:** PAN-SOC-17 (Planes, tipologías, precios, etapas y actividades).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1588 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-032)

<a id="API-SOC-032-b"></a>
#### API-SOC-032-b · `POST /api/admin/soc/housing-plans`

- **Qué hace:** Planes, tipologías, etapas, actividades, materiales. Da de alta un registro de planes de vivienda (`housingPlans`).
- **Para qué sirve:** RF-SOC-098: Composición de materiales por actividad (tipología) y reparto en la vivienda. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.vivienda.configurar`.
- **Recibe:** los datos de planes de vivienda (`housingPlans`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de planes de vivienda (`housingPlans`).
- **Pantallas:** PAN-SOC-17 (Planes, tipologías, precios, etapas y actividades).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1588 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-032-b)

<a id="API-SOC-032-c"></a>
#### API-SOC-032-c · `PATCH /api/admin/soc/housing-plans`

- **Qué hace:** Planes, tipologías, etapas, actividades, materiales. Modifica algunos campos de un registro de planes de vivienda (`housingPlans`) (solo los enviados).
- **Para qué sirve:** RF-SOC-098: Composición de materiales por actividad (tipología) y reparto en la vivienda. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.vivienda.configurar`.
- **Recibe:** solo los campos a cambiar de planes de vivienda (`housingPlans`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de planes de vivienda (`housingPlans`).
- **Pantallas:** PAN-SOC-17 (Planes, tipologías, precios, etapas y actividades).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1588 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-032-c)

<a id="API-SOC-033"></a>
#### API-SOC-033 · `POST /api/admin/soc/housing-plans/{id}/validate`

- **Qué hace:** Validar configuración. Valida un registro de planes de vivienda (`housingPlans`).
- **Para qué sirve:** RF-SOC-109: Los planes de vivienda no se reconectan como un servicio de red. · RF-SOC-089: Una cuenta no puede tener dos planes de vivienda. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.vivienda.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SOC-17 (Planes, tipologías, precios, etapas y actividades).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1589 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-033)

<a id="API-SOC-034"></a>
#### API-SOC-034 · `GET /api/admin/soc/housing-prices`

- **Qué hace:** Precios y actualización masiva (job) Lista, con filtros y paginación, los registros de precios de vivienda por plan (`housingPrices`).
- **Para qué sirve:** RF-SOC-087: Actualización masiva de precios por plan/etapa con aprobación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.precios.actualizar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de precios de vivienda por plan (`housingPrices`) con `total`.
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1590 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-034)

<a id="API-SOC-034-b"></a>
#### API-SOC-034-b · `POST /api/admin/soc/housing-prices`

- **Qué hace:** Precios y actualización masiva (job) Registra un nuevo elemento u operación en precios de vivienda por plan (`housingPrices`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-SOC-087: Actualización masiva de precios por plan/etapa con aprobación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.precios.actualizar`.
- **Recibe:** los datos de precios de vivienda por plan (`housingPrices`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1590 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-034-b)

<a id="API-SOC-035"></a>
#### API-SOC-035 · `GET /api/admin/soc/housing-units`

- **Qué hace:** Viviendas. Lista, con filtros y paginación, los registros de viviendas adjudicables (`housingUnits`).
- **Para qué sirve:** RF-SOC-090: Adjudicación con fecha, forma (sorteo, licitación, antigüedad, otra) y validación de fecha. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.vivienda.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de viviendas adjudicables (`housingUnits`) con `total`.
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1591 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-035)

<a id="API-SOC-035-b"></a>
#### API-SOC-035-b · `PATCH /api/admin/soc/housing-units`

- **Qué hace:** Viviendas. Modifica algunos campos de un registro de viviendas adjudicables (`housingUnits`) (solo los enviados).
- **Para qué sirve:** RF-SOC-090: Adjudicación con fecha, forma (sorteo, licitación, antigüedad, otra) y validación de fecha. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.vivienda.gestionar`.
- **Recibe:** solo los campos a cambiar de viviendas adjudicables (`housingUnits`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de viviendas adjudicables (`housingUnits`).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1591 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-035-b)

<a id="API-SOC-036"></a>
#### API-SOC-036 · `POST /api/admin/soc/housing-units/{id}/transitions`

- **Qué hace:** Adjudicar, iniciar obra, entregar, transferir, rescindir, cambiar plan. Cambia de estado (transición) un registro de viviendas adjudicables (`housingUnits`).
- **Para qué sirve:** RF-SOC-085: Plan de vivienda y tipologías: descripción, producto asociado, aportes mínimos antes/después de adjudicar y en entrega, máximo de aporte anual, fecha de nuevo valor, fecha de aporte teórico, uso de fecha de entrega. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.vivienda.adjudicar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1592 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-036)

<a id="API-SOC-037"></a>
#### API-SOC-037 · `GET /api/admin/soc/housing-units/{id}/progress`

- **Qué hace:** Progreso (DELETE solo si no está certificado) Consulta «progress» de un registro de viviendas adjudicables (`housingUnits`).
- **Para qué sirve:** RF-SOC-099: Progreso de actividades por vivienda: período, horas, porcentaje, proveedor, materiales consumidos, factura del proveedor y certificado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.obra.gestionar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de viviendas adjudicables (`housingUnits`).
- **Pantallas:** PAN-SOC-20 (Certificados de obra).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1593 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-037)

<a id="API-SOC-037-b"></a>
#### API-SOC-037-b · `POST /api/admin/soc/housing-units/{id}/progress`

- **Qué hace:** Progreso (DELETE solo si no está certificado) Registra «progress» sobre un registro de viviendas adjudicables (`housingUnits`).
- **Para qué sirve:** RF-SOC-099: Progreso de actividades por vivienda: período, horas, porcentaje, proveedor, materiales consumidos, factura del proveedor y certificado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.obra.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SOC-20 (Certificados de obra).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1593 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-037-b)

<a id="API-SOC-037-c"></a>
#### API-SOC-037-c · `DELETE /api/admin/soc/housing-units/{id}/progress`

- **Qué hace:** Progreso (DELETE solo si no está certificado) Elimina o da de baja un registro de viviendas adjudicables (`housingUnits`).
- **Para qué sirve:** RF-SOC-099: Progreso de actividades por vivienda: período, horas, porcentaje, proveedor, materiales consumidos, factura del proveedor y certificado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.obra.gestionar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-SOC-20 (Certificados de obra).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1593 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-037-c)

<a id="API-SOC-038"></a>
#### API-SOC-038 · `GET /api/admin/soc/housing-units/{id}/materials`

- **Qué hace:** Asignar, reservar, liberar, reasignar. Consulta «materials» de un registro de viviendas adjudicables (`housingUnits`).
- **Para qué sirve:** RF-SOC-100: Materiales asignados, reservados, liberados y utilizados por vivienda contra stock (M13). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.materiales.gestionar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de viviendas adjudicables (`housingUnits`).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1594 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-038)

<a id="API-SOC-038-b"></a>
#### API-SOC-038-b · `POST /api/admin/soc/housing-units/{id}/materials`

- **Qué hace:** Asignar, reservar, liberar, reasignar. Agrega un elemento («materials») a un registro de viviendas adjudicables (`housingUnits`).
- **Para qué sirve:** RF-SOC-100: Materiales asignados, reservados, liberados y utilizados por vivienda contra stock (M13). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.materiales.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1594 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-038-b)

<a id="API-SOC-039"></a>
#### API-SOC-039 · `POST /api/admin/soc/housing-units/{id}/withdrawals`

- **Qué hace:** Retiro con vale y devolución. Registra «withdrawals» sobre un registro de viviendas adjudicables (`housingUnits`).
- **Para qué sirve:** RF-SOC-101: Retiro de materiales con vale (comprobante configurable), etapa, depósito y responsable; devolución y reasignación entre viviendas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.materiales.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1595 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-039)

<a id="API-SOC-040"></a>
#### API-SOC-040 · `GET /api/admin/soc/housing-certificates`

- **Qué hace:** Certificados. Lista, con filtros y paginación, los registros de certificados de obra (`housingCertificates`).
- **Para qué sirve:** RF-SOC-103: Certificados de obra: crear, guardar, liquidar, cancelar, eliminar (solo borrador), imprimir; certificado de mano de obra; liquidación al constructor con concepto configurable. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.obra.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de certificados de obra (`housingCertificates`) con `total`.
- **Pantallas:** PAN-SOC-20 (Certificados de obra).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1596 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-040)

<a id="API-SOC-040-b"></a>
#### API-SOC-040-b · `POST /api/admin/soc/housing-certificates`

- **Qué hace:** Certificados. Da de alta un registro de certificados de obra (`housingCertificates`).
- **Para qué sirve:** RF-SOC-103: Certificados de obra: crear, guardar, liquidar, cancelar, eliminar (solo borrador), imprimir; certificado de mano de obra; liquidación al constructor con concepto configurable. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.obra.gestionar`.
- **Recibe:** los datos de certificados de obra (`housingCertificates`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de certificados de obra (`housingCertificates`).
- **Pantallas:** PAN-SOC-20 (Certificados de obra).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1596 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-040-b)

<a id="API-SOC-041"></a>
#### API-SOC-041 · `POST /api/admin/soc/housing-certificates/{id}/transitions`

- **Qué hace:** Aprobar, liquidar, cancelar. Cambia de estado (transición) un registro de certificados de obra (`housingCertificates`).
- **Para qué sirve:** RF-SOC-103: Certificados de obra: crear, guardar, liquidar, cancelar, eliminar (solo borrador), imprimir; certificado de mano de obra; liquidación al constructor con concepto configurable. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.certificados.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1597 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-041)

<a id="API-SOC-042"></a>
#### API-SOC-042 · `GET /api/admin/soc/vehicles`

- **Qué hace:** Vehículos, documentos, mantenimiento. Lista, con filtros y paginación, los registros de vehículos (`fleetVehicles`).
- **Para qué sirve:** RF-SOC-138: Costos de flota por vehículo y período (combustible, mantenimiento, seguros, amortización informada por M13). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.flota.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de vehículos (`fleetVehicles`) con `total`.
- **Pantallas:** PAN-SOC-23 (Choferes).
- **Ola:** O8 · **Fuente:** M18 §11. API, línea 1598 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-042)

<a id="API-SOC-042-b"></a>
#### API-SOC-042-b · `POST /api/admin/soc/vehicles`

- **Qué hace:** Vehículos, documentos, mantenimiento. Da de alta un registro de vehículos (`fleetVehicles`).
- **Para qué sirve:** RF-SOC-138: Costos de flota por vehículo y período (combustible, mantenimiento, seguros, amortización informada por M13). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.flota.gestionar`.
- **Recibe:** los datos de vehículos (`fleetVehicles`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de vehículos (`fleetVehicles`).
- **Pantallas:** PAN-SOC-23 (Choferes).
- **Ola:** O8 · **Fuente:** M18 §11. API, línea 1598 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-042-b)

<a id="API-SOC-042-c"></a>
#### API-SOC-042-c · `PATCH /api/admin/soc/vehicles`

- **Qué hace:** Vehículos, documentos, mantenimiento. Modifica algunos campos de un registro de vehículos (`fleetVehicles`) (solo los enviados).
- **Para qué sirve:** RF-SOC-138: Costos de flota por vehículo y período (combustible, mantenimiento, seguros, amortización informada por M13). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.flota.gestionar`.
- **Recibe:** solo los campos a cambiar de vehículos (`fleetVehicles`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de vehículos (`fleetVehicles`).
- **Pantallas:** PAN-SOC-23 (Choferes).
- **Ola:** O8 · **Fuente:** M18 §11. API, línea 1598 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-042-c)

<a id="API-SOC-043"></a>
#### API-SOC-043 · `GET /api/admin/soc/drivers`

- **Qué hace:** Choferes y asignaciones. Lista, con filtros y paginación, los registros de choferes (`drivers`).
- **Para qué sirve:** RF-SOC-136: Novedades para sueldos desde flota (horas de chofer, viáticos, guardias). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.flota.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de choferes (`drivers`) con `total`.
- **Pantallas:** PAN-SOC-23 (Choferes).
- **Ola:** O8 · **Fuente:** M18 §11. API, línea 1599 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-043)

<a id="API-SOC-043-b"></a>
#### API-SOC-043-b · `POST /api/admin/soc/drivers`

- **Qué hace:** Choferes y asignaciones. Da de alta un registro de choferes (`drivers`).
- **Para qué sirve:** RF-SOC-136: Novedades para sueldos desde flota (horas de chofer, viáticos, guardias). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.flota.gestionar`.
- **Recibe:** los datos de choferes (`drivers`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de choferes (`drivers`).
- **Pantallas:** PAN-SOC-23 (Choferes).
- **Ola:** O8 · **Fuente:** M18 §11. API, línea 1599 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-043-b)

<a id="API-SOC-043-c"></a>
#### API-SOC-043-c · `PATCH /api/admin/soc/drivers`

- **Qué hace:** Choferes y asignaciones. Modifica algunos campos de un registro de choferes (`drivers`) (solo los enviados).
- **Para qué sirve:** RF-SOC-136: Novedades para sueldos desde flota (horas de chofer, viáticos, guardias). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.flota.gestionar`.
- **Recibe:** solo los campos a cambiar de choferes (`drivers`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de choferes (`drivers`).
- **Pantallas:** PAN-SOC-23 (Choferes).
- **Ola:** O8 · **Fuente:** M18 §11. API, línea 1599 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-043-c)

<a id="API-SOC-044"></a>
#### API-SOC-044 · `GET /api/admin/soc/vehicles/availability`

- **Qué hace:** Vehículos aptos y libres en un rango (para M10 y traslados) Consulta vehículos (`fleetVehicles`).
- **Para qué sirve:** RF-SOC-138: Costos de flota por vehículo y período (combustible, mantenimiento, seguros, amortización informada por M13). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.flota.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: el registro de vehículos (`fleetVehicles`).
- **Pantallas:** PAN-SOC-22 (Vehículos).
- **Ola:** O8 · **Fuente:** M18 §11. API, línea 1600 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-044)

<a id="API-SOC-045"></a>
#### API-SOC-045 · `GET /api/admin/soc/vehicle-usages`

- **Qué hace:** Usos. Lista, con filtros y paginación, los registros de usos (`vehicleUsages`).
- **Para qué sirve:** RF-SOC-136: Novedades para sueldos desde flota (horas de chofer, viáticos, guardias). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.flota.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de usos (`vehicleUsages`) con `total`.
- **Pantallas:** PAN-SOC-23 (Choferes).
- **Ola:** O8 · **Fuente:** M18 §11. API, línea 1601 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-045)

<a id="API-SOC-045-b"></a>
#### API-SOC-045-b · `POST /api/admin/soc/vehicle-usages`

- **Qué hace:** Usos. Da de alta un registro de usos (`vehicleUsages`).
- **Para qué sirve:** RF-SOC-136: Novedades para sueldos desde flota (horas de chofer, viáticos, guardias). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.flota.gestionar`.
- **Recibe:** los datos de usos (`vehicleUsages`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de usos (`vehicleUsages`).
- **Pantallas:** PAN-SOC-23 (Choferes).
- **Ola:** O8 · **Fuente:** M18 §11. API, línea 1601 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-045-b)

<a id="API-SOC-046"></a>
#### API-SOC-046 · `GET /api/admin/soc/fuel-types`

- **Qué hace:** Combustibles. Lista, con filtros y paginación, los registros de combustibles (`fuelTypes`).
- **Para qué sirve:** RF-SOC-124: Combustibles: catálogo con alícuota de IVA y su ajuste. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.combustible.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de combustibles (`fuelTypes`) con `total`.
- **Pantallas:** PAN-SOC-24 (Combustibles y cargas).
- **Ola:** O8 · **Fuente:** M18 §11. API, línea 1602 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-046)

<a id="API-SOC-046-b"></a>
#### API-SOC-046-b · `POST /api/admin/soc/fuel-types`

- **Qué hace:** Combustibles. Da de alta un registro de combustibles (`fuelTypes`).
- **Para qué sirve:** RF-SOC-124: Combustibles: catálogo con alícuota de IVA y su ajuste. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.combustible.gestionar`.
- **Recibe:** los datos de combustibles (`fuelTypes`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de combustibles (`fuelTypes`).
- **Pantallas:** PAN-SOC-24 (Combustibles y cargas).
- **Ola:** O8 · **Fuente:** M18 §11. API, línea 1602 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-046-b)

<a id="API-SOC-046-c"></a>
#### API-SOC-046-c · `PATCH /api/admin/soc/fuel-types`

- **Qué hace:** Combustibles. Modifica algunos campos de un registro de combustibles (`fuelTypes`) (solo los enviados).
- **Para qué sirve:** RF-SOC-124: Combustibles: catálogo con alícuota de IVA y su ajuste. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.combustible.gestionar`.
- **Recibe:** solo los campos a cambiar de combustibles (`fuelTypes`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de combustibles (`fuelTypes`).
- **Pantallas:** PAN-SOC-24 (Combustibles y cargas).
- **Ola:** O8 · **Fuente:** M18 §11. API, línea 1602 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-046-c)

<a id="API-SOC-047"></a>
#### API-SOC-047 · `GET /api/admin/soc/fuel-loads`

- **Qué hace:** Cargas. Lista, con filtros y paginación, los registros de cargas de combustible (`fuelLoads`).
- **Para qué sirve:** RF-SOC-125: Cargas de combustible por móvil con litros, kilómetros y factura de compra de origen; carga manual y desde factura; anulación de la factura libera las cargas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.combustible.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de cargas de combustible (`fuelLoads`) con `total`.
- **Pantallas:** PAN-SOC-24 (Combustibles y cargas).
- **Ola:** O8 · **Fuente:** M18 §11. API, línea 1603 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-047)

<a id="API-SOC-047-b"></a>
#### API-SOC-047-b · `POST /api/admin/soc/fuel-loads`

- **Qué hace:** Cargas. Da de alta un registro de cargas de combustible (`fuelLoads`).
- **Para qué sirve:** RF-SOC-125: Cargas de combustible por móvil con litros, kilómetros y factura de compra de origen; carga manual y desde factura; anulación de la factura libera las cargas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.combustible.gestionar`.
- **Recibe:** los datos de cargas de combustible (`fuelLoads`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de cargas de combustible (`fuelLoads`).
- **Pantallas:** PAN-SOC-24 (Combustibles y cargas).
- **Ola:** O8 · **Fuente:** M18 §11. API, línea 1603 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-047-b)

<a id="API-SOC-048"></a>
#### API-SOC-048 · `GET /api/admin/soc/trip-settlements`

- **Qué hace:** Rendiciones. Lista, con filtros y paginación, los registros de rendiciones de viaje (`tripSettlements`).
- **Para qué sirve:** RF-SOC-131: Vincular la rendición a la venta con flete (M11), al viaje o a la OT. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.rendiciones.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de rendiciones de viaje (`tripSettlements`) con `total`.
- **Pantallas:** PAN-SOC-25 (Rendiciones de viaje).
- **Ola:** O8 · **Fuente:** M18 §11. API, línea 1604 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-048)

<a id="API-SOC-048-b"></a>
#### API-SOC-048-b · `POST /api/admin/soc/trip-settlements`

- **Qué hace:** Rendiciones. Da de alta un registro de rendiciones de viaje (`tripSettlements`).
- **Para qué sirve:** RF-SOC-131: Vincular la rendición a la venta con flete (M11), al viaje o a la OT. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.rendiciones.gestionar`.
- **Recibe:** los datos de rendiciones de viaje (`tripSettlements`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de rendiciones de viaje (`tripSettlements`).
- **Pantallas:** PAN-SOC-25 (Rendiciones de viaje).
- **Ola:** O8 · **Fuente:** M18 §11. API, línea 1604 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-048-b)

<a id="API-SOC-048-c"></a>
#### API-SOC-048-c · `PATCH /api/admin/soc/trip-settlements`

- **Qué hace:** Rendiciones. Modifica algunos campos de un registro de rendiciones de viaje (`tripSettlements`) (solo los enviados).
- **Para qué sirve:** RF-SOC-131: Vincular la rendición a la venta con flete (M11), al viaje o a la OT. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.rendiciones.gestionar`.
- **Recibe:** solo los campos a cambiar de rendiciones de viaje (`tripSettlements`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de rendiciones de viaje (`tripSettlements`).
- **Pantallas:** PAN-SOC-25 (Rendiciones de viaje).
- **Ola:** O8 · **Fuente:** M18 §11. API, línea 1604 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-048-c)

<a id="API-SOC-049"></a>
#### API-SOC-049 · `POST /api/admin/soc/trip-settlements/{id}/transitions`

- **Qué hace:** Enviar, aprobar, rechazar. Cambia de estado (transición) un registro de rendiciones de viaje (`tripSettlements`).
- **Para qué sirve:** RF-SOC-130: Estados de la rendición con aprobación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.rendiciones.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M18 §11. API, línea 1605 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-049)

<a id="API-SOC-050"></a>
#### API-SOC-050 · `GET /api/admin/soc/vehicles/{id}/track`

- **Qué hace:** Recorrido (?from=&to=) Consulta «track» de un registro de vehículos (`fleetVehicles`).
- **Para qué sirve:** RF-SOC-134: Recorridos y kilometraje derivados de GPS por día, viaje y OT. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.gps.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de vehículos (`fleetVehicles`).
- **Pantallas:** PAN-SOC-26 (Recorridos GPS).
- **Ola:** O8 · **Fuente:** M18 §11. API, línea 1606 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-050)

<a id="API-SOC-051"></a>
#### API-SOC-051 · `POST /api/v1/ext/soc/gps/positions`

- **Qué hace:** Ingesta de posiciones por lote (adaptador) Registra un nuevo elemento u operación en posiciones GPS (`gpsPositions`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-SOC-133: Posiciones GPS: unidad, fecha y hora, estado, evento, latitud, longitud; ingestión por lote o streaming; retención configurable. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); permiso `soc.gps.registrar`.
- **Recibe:** los datos de posiciones GPS (`gpsPositions`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Ola:** O8 · **Fuente:** M18 §11. API, línea 1607 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-051)

<a id="API-SOC-052"></a>
#### API-SOC-052 · `GET /api/admin/soc/orthopedic-loans`

- **Qué hace:** Elementos y préstamos. Lista, con filtros y paginación, los registros de préstamos ortopédicos (`orthopedicLoans`).
- **Para qué sirve:** RF-SOC-113: Banco ortopédico: elementos identificados (código, tipo, estado), préstamo con plazo, devolución, limpieza/mantenimiento, garantía o depósito; no es venta. El depósito se registra como garantía de M08 (guarantees, RF-MOR-179)… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.ortopedia.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de préstamos ortopédicos (`orthopedicLoans`) con `total`.
- **Pantallas:** PAN-SOC-27 (Banco ortopédico).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1608 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-052)

<a id="API-SOC-052-b"></a>
#### API-SOC-052-b · `POST /api/admin/soc/orthopedic-loans`

- **Qué hace:** Elementos y préstamos. Da de alta un registro de préstamos ortopédicos (`orthopedicLoans`).
- **Para qué sirve:** RF-SOC-113: Banco ortopédico: elementos identificados (código, tipo, estado), préstamo con plazo, devolución, limpieza/mantenimiento, garantía o depósito; no es venta. El depósito se registra como garantía de M08 (guarantees, RF-MOR-179)… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.ortopedia.gestionar`.
- **Recibe:** los datos de préstamos ortopédicos (`orthopedicLoans`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de préstamos ortopédicos (`orthopedicLoans`).
- **Pantallas:** PAN-SOC-27 (Banco ortopédico).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1608 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-052-b)

<a id="API-SOC-053"></a>
#### API-SOC-053 · `POST /api/admin/soc/dispenser-withdrawals`

- **Qué hace:** Registrar retiro con validación de límites. Da de alta un registro de retiros de dispenser (`dispenserWithdrawals`).
- **Para qué sirve:** RF-SOC-114: Dispenser de agua: servicio configurable, límite diario de litros, litros por atención, días para cálculo de deuda, registro de retiros y excedente mensual. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.dispenser.registrar`.
- **Recibe:** los datos de retiros de dispenser (`dispenserWithdrawals`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de retiros de dispenser (`dispenserWithdrawals`).
- **Pantallas:** PAN-SOC-28 (Retiros de dispenser).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1609 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-053)

<a id="API-SOC-054"></a>
#### API-SOC-054 · `GET /api/admin/soc/settings`

- **Qué hace:** Parámetros. Consulta `settings`.
- **Para qué sirve:** RF-SOC-091: Aporte por cuota: % = mínimo después de adjudicar si está adjudicada, si no mínimo antes; fallback a parámetros generales; tope = % a facturar − % facturado; importe = % × precio vigente. M18 informa los datos y M04 calcula. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.config.configurar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SOC-29 (Parámetros del módulo).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1610 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-054)

<a id="API-SOC-054-b"></a>
#### API-SOC-054-b · `PUT /api/admin/soc/settings`

- **Qué hace:** Parámetros. Reemplaza o configura `settings`.
- **Para qué sirve:** RF-SOC-091: Aporte por cuota: % = mínimo después de adjudicar si está adjudicada, si no mínimo antes; fallback a parámetros generales; tope = % a facturar − % facturado; importe = % × precio vigente. M18 informa los datos y M04 calcula. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.config.configurar`.
- **Recibe:** un cuerpo JSON cuya estructura detalla el anexo; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SOC-29 (Parámetros del módulo).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1610 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-054-b)

<a id="API-SOC-055"></a>
#### API-SOC-055 · `GET /api/admin/soc/reports/{reportId}`

- **Qué hace:** Reportes de §15. Obtiene el detalle de un registro de `reports`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.reportes.ver`.
- **Recibe:** en la ruta `reportId`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SOC-15 (Informe general de traslados), PAN-SOC-21 (Informes de vivienda).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1611 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-055)

<a id="API-SOC-056"></a>
#### API-SOC-056 · `GET /api/soc/me/groups`

- **Qué hace:** Mi grupo y coberturas. Consulta `groups`.
- **Para qué sirve:** RF-SOC-066: Adhesión y cobertura del titular, grupo y beneficiarios a la fecha solicitada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `soc.mi.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SOC-30 (Mi grupo y coberturas (componente embebido en PAN-POR-98)), PAN-SOC-32 (Mis derechos de sepultura (componente embebido en PAN-POR-100)), PAN-SOC-33 (Mi plan de vivienda (componente embebido en PAN-POR-101)) y 3 más.
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1612 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-056)

<a id="API-SOC-057"></a>
#### API-SOC-057 · `POST /api/soc/me/requests`

- **Qué hace:** Solicitud de alta/baja de integrante, prestación o acto. Da de alta un registro de solicitudes de prestación (`benefitRequests`).
- **Para qué sirve:** RF-SOC-030: Autogestión del grupo en PWA: ver integrantes, solicitar altas y bajas con documentación (efectivas tras validación). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `soc.mi.solicitar`.
- **Recibe:** los datos de solicitudes de prestación (`benefitRequests`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de solicitudes de prestación (`benefitRequests`).
- **Pantallas:** PAN-SOC-31 (Solicitudes de prestación (componente embebido en PAN-POR-99)), PAN-POR-99 (Solicitudes sociales (tarjeta que embebe PAN-SOC-31)).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1613 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-057)

<a id="API-SOC-058"></a>
#### API-SOC-058 · `GET /api/soc/me/burial-rights`

- **Qué hace:** Mis derechos. Lista, con filtros y paginación, los registros de derechos de sepultura (`burialRights`).
- **Para qué sirve:** RF-SOC-143: Portal del asociado (renderizado por M19): grupo, coberturas, solicitudes, derechos de sepultura, plan de vivienda. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `soc.mi.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de derechos de sepultura (`burialRights`) con `total`.
- **Pantallas:** PAN-SOC-30 (Mi grupo y coberturas (componente embebido en PAN-POR-98)), PAN-SOC-32 (Mis derechos de sepultura (componente embebido en PAN-POR-100)), PAN-SOC-33 (Mi plan de vivienda (componente embebido en PAN-POR-101)) y 3 más.
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1614 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-058)

<a id="API-SOC-059"></a>
#### API-SOC-059 · `GET /api/soc/me/housing`

- **Qué hace:** Mi plan de vivienda. Consulta `housing`.
- **Para qué sirve:** RF-SOC-143: Portal del asociado (renderizado por M19): grupo, coberturas, solicitudes, derechos de sepultura, plan de vivienda. · RF-SOC-088: Inscripción al plan (contrato tipo plan de vivienda en M02; HUECO-TRV-06, antes "en M01") con fecha, tipología y lote/terreno propio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `soc.mi.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-SOC-30 (Mi grupo y coberturas (componente embebido en PAN-POR-98)), PAN-SOC-32 (Mis derechos de sepultura (componente embebido en PAN-POR-100)), PAN-SOC-33 (Mi plan de vivienda (componente embebido en PAN-POR-101)) y 3 más.
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1615 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-059)

<a id="API-SOC-060"></a>
#### API-SOC-060 · `GET /api/soc/field/trips`

- **Qué hace:** Viajes del chofer y registros offline. Lista, con filtros y paginación, los registros de traslados sanitarios y generales (`transportTrips`).
- **Para qué sirve:** RF-SOC-127: Viajes generales (no sanitarios): solicitud, origen/destino, agenda, recursos, constancia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de campo o cobradores, desde la app móvil; permiso `soc.mi.viajes.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de traslados sanitarios y generales (`transportTrips`) con `total`.
- **Pantallas:** PAN-SOC-34 (Viajes del chofer).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1616 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-060)

<a id="API-SOC-060-b"></a>
#### API-SOC-060-b · `POST /api/soc/field/trips`

- **Qué hace:** Viajes del chofer y registros offline. Da de alta un registro de traslados sanitarios y generales (`transportTrips`).
- **Para qué sirve:** RF-SOC-127: Viajes generales (no sanitarios): solicitud, origen/destino, agenda, recursos, constancia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de campo o cobradores, desde la app móvil; permiso `soc.viajes.registrarKm`.
- **Recibe:** los datos de traslados sanitarios y generales (`transportTrips`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de traslados sanitarios y generales (`transportTrips`).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1616 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-060-b)

<a id="API-SOC-061"></a>
#### API-SOC-061 · `GET /api/public/{tenantSlug}/soc/cemetery/search`

- **Qué hace:** Búsqueda de difuntos: nombre y ubicación. Consumida por PAN-POR-104 de M19 (/cementerio/buscar, landing pública). Lista, con filtros y paginación, los registros de `search`.
- **Para qué sirve:** RF-SOC-063: Plano/mapa del parque con estado por unidad y búsqueda de difuntos para atención al público (solo nombre y ubicación, si el tenant lo habilita). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ResultadoGenerico (`ResultadoGenerico`) con `total`.
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1617 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-061)

<a id="API-SOC-062"></a>
#### API-SOC-062 · `GET /api/admin/soc/contracts/{id}/registrations`

- **Qué hace:** Registraciones del contrato: vehículo eléctrico, equipo u otro (RF-SOC-148, HUECO-OTR-05); la baja es PATCH con endDate, nunca borrado. Lista, con filtros y paginación, los registros de registraciones del contrato (`contractRegistrations`).
- **Para qué sirve:** RF-SOC-148: Registraciones del contrato: M18 es dueño de la entidad contractRegistrations (§7.5), que registra sobre un contrato de M02 los objetos que el servicio necesita identificar: vehículo eléctrico (dominio, marca, modelo, potencia de…
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.adherentes.ver`.
- **Recibe:** en la ruta `id`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de registraciones del contrato (`contractRegistrations`) con `total`.
- **Pantallas:** PAN-PER-10 (Adherentes y beneficiarios), PAN-SOC-01 (Grupo de cobertura de un contrato).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1618 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-062)

<a id="API-SOC-062-b"></a>
#### API-SOC-062-b · `POST /api/admin/soc/contracts/{id}/registrations`

- **Qué hace:** Registraciones del contrato: vehículo eléctrico, equipo u otro (RF-SOC-148, HUECO-OTR-05); la baja es PATCH con endDate, nunca borrado. Da de alta un registro de registraciones del contrato (`contractRegistrations`).
- **Para qué sirve:** RF-SOC-148: Registraciones del contrato: M18 es dueño de la entidad contractRegistrations (§7.5), que registra sobre un contrato de M02 los objetos que el servicio necesita identificar: vehículo eléctrico (dominio, marca, modelo, potencia de…
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.adherentes.gestionar`.
- **Recibe:** en la ruta `id`; los datos de registraciones del contrato (`contractRegistrations`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de registraciones del contrato (`contractRegistrations`).
- **Pantallas:** PAN-SOC-02 (Bajas por condición, mayoría de edad y recategorización masiva).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1618 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-062-b)

<a id="API-SOC-062-c"></a>
#### API-SOC-062-c · `PATCH /api/admin/soc/contracts/{id}/registrations`

- **Qué hace:** Registraciones del contrato: vehículo eléctrico, equipo u otro (RF-SOC-148, HUECO-OTR-05); la baja es PATCH con endDate, nunca borrado. Modifica algunos campos de un registro de registraciones del contrato (`contractRegistrations`) (solo los enviados).
- **Para qué sirve:** RF-SOC-148: Registraciones del contrato: M18 es dueño de la entidad contractRegistrations (§7.5), que registra sobre un contrato de M02 los objetos que el servicio necesita identificar: vehículo eléctrico (dominio, marca, modelo, potencia de…
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `soc.adherentes.gestionar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de registraciones del contrato (`contractRegistrations`); cabeceras `Idempotency-Key` obligatoria y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de registraciones del contrato (`contractRegistrations`).
- **Pantallas:** PAN-SOC-02 (Bajas por condición, mayoría de edad y recategorización masiva).
- **Ola:** O10 · **Fuente:** M18 §11. API, línea 1618 · [Ver en Swagger](../18-swagger/index.html?api=m18-soc#/API/API-SOC-062-c)
