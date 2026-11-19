# Catálogo de endpoints · M17 · Gestión institucional (asociados, capital, asambleas, consejo, INAES)

Parte del [catálogo de endpoints](../18-catalogo-endpoints.md) (artefacto 7.1). Generado el 05-11-2026 con `_trabajo/gen_18_catalogo_endpoints.py` a partir de `18-openapi/`; no se edita a mano.

## Para qué sirve esta API

Gestionar la relación institucional entre cada persona y su cooperativa (Ley 20.337 y normativa del INAES), de forma trazable y separada de la relación comercial por servicios:

1. el registro de asociados (número, antigüedad, estado institucional, ingreso aprobado por acta, egreso con causa) y el Libro de Registro de Asociados (MER-011);
2. el capital social (cuotas sociales suscriptas, facturadas, integradas, comprometidas, reservadas, transferidas y reembolsadas), con su auxiliar propio y distinto de la deuda por servicios (AGR-029), incluido su cobro dentro de la factura cuando el tenant lo habilite (BASE §97.7);
3. la distribución de excedentes y retornos aprobada por asamblea;
4. los órganos sociales (consejo de administración, sindicatura, comisiones, junta electoral) con sus mandatos;
5. reuniones, asambleas, convocatorias, padrones, asistencia, poderes, delegados, votaciones formales, actas y resoluciones;
6. los honorarios institucionales de consejeros y síndicos (no son sueldo, BASE §104.3);
7. las categorías e informes al INAES.

Detalle completo en el anexo M17, sección 1. Contrato navegable: [Swagger](../18-swagger/index.html?api=m17-ins).

| Dato | Valor |
|---|---|
| Endpoints | 110 |
| Por método | GET 44, PATCH 16, POST 48, PUT 2 |
| Grupos funcionales | 1 |
| Con requisito citado en el anexo | 1 |
| Con requisito inferido (a confirmar) | 100 |
| Sin requisito identificable | 9 |

## Grupos funcionales

| Grupo | Endpoints | Qué agrupa (primeros endpoints) |
|---|---|---|
| [API](#grupo-1) | 110 | Listado paginado con filtros.; Crear solicitud de ingreso.; Ficha institucional.… |

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

110 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-INS-001](#API-INS-001) | GET | `/api/admin/ins/memberships` | Listado paginado con filtros. |
| [API-INS-002](#API-INS-002) | POST | `/api/admin/ins/memberships` | Crear solicitud de ingreso. |
| [API-INS-003](#API-INS-003) | GET | `/api/admin/ins/memberships/{id}` | Ficha institucional. |
| [API-INS-005](#API-INS-005) | PATCH | `/api/admin/ins/memberships/{id}` | Editar datos institucionales (distrito, categoría, representante) |
| [API-INS-004](#API-INS-004) | GET | `/api/admin/ins/memberships/{id}/summary` | Resumen para ficha 360 y M19. |
| [API-INS-006](#API-INS-006) | POST | `/api/admin/ins/memberships/{id}/transitions` | Cambio de estado (toStatus, motivo, acta, fecha efectiva) |
| [API-INS-007](#API-INS-007) | POST | `/api/admin/ins/memberships/{id}/renumber` | Solicitar renumeración. |
| [API-INS-008](#API-INS-008) | GET | `/api/admin/ins/memberships/{id}/events` | Historia de estados. |
| [API-INS-009](#API-INS-009) | GET | `/api/admin/ins/membership-requests` | Bandeja de solicitudes. |
| [API-INS-010](#API-INS-010) | POST | `/api/admin/ins/membership-requests/batch-to-board` | Agrupar solicitudes como tema de consejo. |
| [API-INS-011](#API-INS-011) | POST | `/api/admin/ins/register-editions` | Generar Libro de Registro de Asociados (job) |
| [API-INS-012](#API-INS-012) | GET | `/api/admin/ins/register-editions/{id}/file` | Descargar edición. |
| [API-INS-013](#API-INS-013) | GET | `/api/admin/ins/capital-items` | Rubros de capital. |
| [API-INS-013-b](#API-INS-013-b) | POST | `/api/admin/ins/capital-items` | Rubros de capital. |
| [API-INS-013-c](#API-INS-013-c) | PATCH | `/api/admin/ins/capital-items` | Rubros de capital. |
| [API-INS-014](#API-INS-014) | GET | `/api/admin/ins/capital-rules` | Reglas de suscripción. |
| [API-INS-014-b](#API-INS-014-b) | POST | `/api/admin/ins/capital-rules` | Reglas de suscripción. |
| [API-INS-014-c](#API-INS-014-c) | PATCH | `/api/admin/ins/capital-rules` | Reglas de suscripción. |
| [API-INS-015](#API-INS-015) | GET | `/api/admin/ins/share-values` | Valor nominal versionado. |
| [API-INS-015-b](#API-INS-015-b) | POST | `/api/admin/ins/share-values` | Valor nominal versionado. |
| [API-INS-016](#API-INS-016) | GET | `/api/admin/ins/capital-movements` | Movimientos con filtros. |
| [API-INS-017](#API-INS-017) | POST | `/api/admin/ins/capital-movements` | Movimiento manual (queda pending hasta aprobación) |
| [API-INS-018](#API-INS-018) | POST | `/api/admin/ins/capital-movements/{id}/reverse` | Contramovimiento. |
| [API-INS-019](#API-INS-019) | GET | `/api/admin/ins/memberships/{id}/capital-statement` | Estado de cuenta a fecha (?asOf=) |
| [API-INS-020](#API-INS-020) | POST | `/api/admin/ins/capital-imports` | Importación (simular/confirmar) |
| [API-INS-021](#API-INS-021) | GET | `/api/admin/ins/capital-reserves` | Reservas. |
| [API-INS-021-b](#API-INS-021-b) | POST | `/api/admin/ins/capital-reserves` | Reservas. |
| [API-INS-022](#API-INS-022) | POST | `/api/admin/ins/capital-reserves/{id}/release` | Recupero. |
| [API-INS-023](#API-INS-023) | GET | `/api/admin/ins/capital-transfers` | Transferencias. |
| [API-INS-023-b](#API-INS-023-b) | POST | `/api/admin/ins/capital-transfers` | Transferencias. |
| [API-INS-024](#API-INS-024) | POST | `/api/admin/ins/capital-transfers/{id}/execute` | Ejecutar transferencia aprobada. |
| [API-INS-025](#API-INS-025) | GET | `/api/admin/ins/capital-refunds` | Rescates. |
| [API-INS-025-b](#API-INS-025-b) | POST | `/api/admin/ins/capital-refunds` | Rescates. |
| [API-INS-026](#API-INS-026) | POST | `/api/admin/ins/capital-refunds/{id}/calculate` | Calcular importe. |
| [API-INS-027](#API-INS-027) | POST | `/api/admin/ins/capital-refunds/{id}/transitions` | Aprobar, programar, rechazar, cancelar. |
| [API-INS-028](#API-INS-028) | GET | `/api/admin/ins/capital-closings` | Cierres y reapertura. |
| [API-INS-028-b](#API-INS-028-b) | POST | `/api/admin/ins/capital-closings` | Cierres y reapertura. |
| [API-INS-029](#API-INS-029) | POST | `/api/admin/ins/capital-reviews` | Ejecutar revisión (job) |
| [API-INS-030](#API-INS-030) | GET | `/api/admin/ins/capital-reconciliation` | Conciliación con M15. |
| [API-INS-031](#API-INS-031) | GET | `/api/admin/ins/share-certificates` | Títulos/certificados. |
| [API-INS-031-b](#API-INS-031-b) | POST | `/api/admin/ins/share-certificates` | Títulos/certificados. |
| [API-INS-032](#API-INS-032) | GET | `/api/admin/ins/surplus-distributions` | Distribuciones. |
| [API-INS-032-b](#API-INS-032-b) | POST | `/api/admin/ins/surplus-distributions` | Distribuciones. |
| [API-INS-033](#API-INS-033) | POST | `/api/admin/ins/surplus-distributions/{id}/simulate` | Simular. |
| [API-INS-034](#API-INS-034) | POST | `/api/admin/ins/surplus-distributions/{id}/execute` | Ejecutar (job) |
| [API-INS-035](#API-INS-035) | GET | `/api/admin/ins/bodies` | Órganos y cargos. |
| [API-INS-035-b](#API-INS-035-b) | POST | `/api/admin/ins/bodies` | Órganos y cargos. |
| [API-INS-035-c](#API-INS-035-c) | PATCH | `/api/admin/ins/bodies` | Órganos y cargos. |
| [API-INS-036](#API-INS-036) | GET | `/api/admin/ins/mandates` | Mandatos. |
| [API-INS-036-b](#API-INS-036-b) | POST | `/api/admin/ins/mandates` | Mandatos. |
| [API-INS-036-c](#API-INS-036-c) | PATCH | `/api/admin/ins/mandates` | Mandatos. |
| [API-INS-037](#API-INS-037) | GET | `/api/admin/ins/meetings` | Reuniones y asambleas. |
| [API-INS-037-b](#API-INS-037-b) | POST | `/api/admin/ins/meetings` | Reuniones y asambleas. |
| [API-INS-037-c](#API-INS-037-c) | PATCH | `/api/admin/ins/meetings` | Reuniones y asambleas. |
| [API-INS-038](#API-INS-038) | POST | `/api/admin/ins/meetings/{id}/transitions` | Convocar, iniciar, cuarto intermedio, cerrar, cancelar. |
| [API-INS-039](#API-INS-039) | GET | `/api/admin/ins/meetings/{id}/agenda-items` | Orden del día. |
| [API-INS-039-b](#API-INS-039-b) | POST | `/api/admin/ins/meetings/{id}/agenda-items` | Orden del día. |
| [API-INS-039-c](#API-INS-039-c) | PATCH | `/api/admin/ins/meetings/{id}/agenda-items` | Orden del día. |
| [API-INS-040](#API-INS-040) | GET | `/api/admin/ins/meetings/{id}/participants` | Participantes y asistencia. |
| [API-INS-040-b](#API-INS-040-b) | POST | `/api/admin/ins/meetings/{id}/participants` | Participantes y asistencia. |
| [API-INS-040-c](#API-INS-040-c) | PATCH | `/api/admin/ins/meetings/{id}/participants` | Participantes y asistencia. |
| [API-INS-041](#API-INS-041) | POST | `/api/admin/ins/meetings/{id}/check-in` | Acreditación por QR/documento (lote offline) |
| [API-INS-042](#API-INS-042) | GET | `/api/admin/ins/meetings/{id}/permissions` | Permisos de reunión reservada. |
| [API-INS-042-b](#API-INS-042-b) | PUT | `/api/admin/ins/meetings/{id}/permissions` | Permisos de reunión reservada. |
| [API-INS-043](#API-INS-043) | GET | `/api/admin/ins/minutes` | Actas. |
| [API-INS-043-b](#API-INS-043-b) | POST | `/api/admin/ins/minutes` | Actas. |
| [API-INS-043-c](#API-INS-043-c) | PATCH | `/api/admin/ins/minutes` | Actas. |
| [API-INS-044](#API-INS-044) | POST | `/api/admin/ins/minutes/{id}/sign` | Firmar. |
| [API-INS-045](#API-INS-045) | GET | `/api/admin/ins/resolutions` | Resoluciones y seguimiento. |
| [API-INS-045-b](#API-INS-045-b) | PATCH | `/api/admin/ins/resolutions` | Resoluciones y seguimiento. |
| [API-INS-046](#API-INS-046) | POST | `/api/admin/ins/rosters` | Generar padrón (job) |
| [API-INS-047](#API-INS-047) | GET | `/api/admin/ins/rosters/{id}/entries` | Entradas con motivo. |
| [API-INS-048](#API-INS-048) | POST | `/api/admin/ins/rosters/{id}/transitions` | Publicar, aprobar final. |
| [API-INS-049](#API-INS-049) | POST | `/api/admin/ins/rosters/{id}/claims/{entryId}/resolve` | Resolver reclamo. |
| [API-INS-050](#API-INS-050) | GET | `/api/admin/ins/roster-filter-sets` | Conjuntos de filtros guardados. |
| [API-INS-050-b](#API-INS-050-b) | POST | `/api/admin/ins/roster-filter-sets` | Conjuntos de filtros guardados. |
| [API-INS-051](#API-INS-051) | GET | `/api/admin/ins/meetings/{id}/proxies` | Poderes. |
| [API-INS-051-b](#API-INS-051-b) | POST | `/api/admin/ins/meetings/{id}/proxies` | Poderes. |
| [API-INS-051-c](#API-INS-051-c) | PATCH | `/api/admin/ins/meetings/{id}/proxies` | Poderes. |
| [API-INS-052](#API-INS-052) | GET | `/api/admin/ins/meetings/{id}/electoral-lists` | Listas. |
| [API-INS-052-b](#API-INS-052-b) | POST | `/api/admin/ins/meetings/{id}/electoral-lists` | Listas. |
| [API-INS-052-c](#API-INS-052-c) | PATCH | `/api/admin/ins/meetings/{id}/electoral-lists` | Listas. |
| [API-INS-053](#API-INS-053) | GET | `/api/admin/ins/voting-sessions` | Votaciones y recuentos. |
| [API-INS-053-b](#API-INS-053-b) | POST | `/api/admin/ins/voting-sessions` | Votaciones y recuentos. |
| [API-INS-053-c](#API-INS-053-c) | PATCH | `/api/admin/ins/voting-sessions` | Votaciones y recuentos. |
| [API-INS-054](#API-INS-054) | GET | `/api/admin/ins/fees` | Definiciones de honorarios. |
| [API-INS-054-b](#API-INS-054-b) | POST | `/api/admin/ins/fees` | Definiciones de honorarios. |
| [API-INS-054-c](#API-INS-054-c) | PATCH | `/api/admin/ins/fees` | Definiciones de honorarios. |
| [API-INS-055](#API-INS-055) | POST | `/api/admin/ins/fee-settlements/run` | Liquidar período (job) |
| [API-INS-056](#API-INS-056) | POST | `/api/admin/ins/fee-settlements/{id}/transitions` | Aprobar, anular. |
| [API-INS-057](#API-INS-057) | GET | `/api/admin/ins/inaes-reports` | Generar, validar, registrar presentación y acuse. |
| [API-INS-057-b](#API-INS-057-b) | POST | `/api/admin/ins/inaes-reports` | Generar, validar, registrar presentación y acuse. |
| [API-INS-058](#API-INS-058) | GET | `/api/admin/ins/inaes-categories` | Categorías INAES. |
| [API-INS-058-b](#API-INS-058-b) | POST | `/api/admin/ins/inaes-categories` | Categorías INAES. |
| [API-INS-058-c](#API-INS-058-c) | PATCH | `/api/admin/ins/inaes-categories` | Categorías INAES. |
| [API-INS-059](#API-INS-059) | POST | `/api/admin/ins/credentials/batch` | Credenciales masivas (job) |
| [API-INS-060](#API-INS-060) | GET | `/api/admin/ins/districts` | Distritos. |
| [API-INS-060-b](#API-INS-060-b) | POST | `/api/admin/ins/districts` | Distritos. |
| [API-INS-060-c](#API-INS-060-c) | PATCH | `/api/admin/ins/districts` | Distritos. |
| [API-INS-061](#API-INS-061) | GET | `/api/admin/ins/settings` | Parámetros del módulo. |
| [API-INS-061-b](#API-INS-061-b) | PUT | `/api/admin/ins/settings` | Parámetros del módulo. |
| [API-INS-062](#API-INS-062) | GET | `/api/admin/ins/reports/{reportId}` | Reportes de §15 (?format=json/csv/xlsx/pdf) |
| [API-INS-063](#API-INS-063) | GET | `/api/ins/me` | Mi asociación (PWA) |
| [API-INS-064](#API-INS-064) | GET | `/api/ins/me/capital-statement` | Mi estado de capital. |
| [API-INS-065](#API-INS-065) | GET | `/api/ins/me/credential` | Credencial digital (QR rotativo) |
| [API-INS-066](#API-INS-066) | POST | `/api/ins/me/requests` | Solicitud de ingreso, egreso, poder o reclamo de padrón. |
| [API-INS-067](#API-INS-067) | GET | `/api/ins/me/meetings` | Convocatorias y habilitación propia. |
| [API-INS-068](#API-INS-068) | GET | `/api/public/{tenantSlug}/ins/assemblies` | Convocatorias públicas. |
| [API-INS-069](#API-INS-069) | GET | `/api/v1/ext/ins/memberships/{memberNumber}/status` | Verificación externa de condición de asociado (sin datos personales) |
| [API-INS-070](#API-INS-070) | GET | `/api/platform/ins/inaes-categories` | Catálogo base de categorías INAES. |

<a id="API-INS-001"></a>
#### API-INS-001 · `GET /api/admin/ins/memberships`

- **Qué hace:** Listado paginado con filtros. Lista, con filtros y paginación, los registros de relación institucional del asociado (`associateMemberships`).
- **Para qué sirve:** RF-INS-027: Etiquetas y listados postales de asociados para convocatorias y comunicaciones. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.asociados.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de relación institucional del asociado (`associateMemberships`) con `total`.
- **Pantallas:** PAN-INS-01 (Listado de asociados), PAN-INS-02 (Ficha institucional del asociado).
- **Ola:** O2 · **Fuente:** M17 §11. API, línea 1345 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-001)

<a id="API-INS-002"></a>
#### API-INS-002 · `POST /api/admin/ins/memberships`

- **Qué hace:** Crear solicitud de ingreso. Da de alta un registro de relación institucional del asociado (`associateMemberships`).
- **Para qué sirve:** RF-INS-003: Registrar fecha de solicitud, fecha de aprobación (alta institucional), acta y reunión de consejo que aprobó el ingreso, y calcular la antigüedad a cualquier fecha. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.asociados.crear`.
- **Recibe:** los datos de relación institucional del asociado (`associateMemberships`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de relación institucional del asociado (`associateMemberships`).
- **Ola:** O2 · **Fuente:** M17 §11. API, línea 1346 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-002)

<a id="API-INS-003"></a>
#### API-INS-003 · `GET /api/admin/ins/memberships/{id}`

- **Qué hace:** Ficha institucional. Obtiene el detalle de un registro de relación institucional del asociado (`associateMemberships`).
- **Para qué sirve:** RF-INS-015: Exponer el resumen institucional para la ficha 360 (M01) y el portal (M19): estado, número, antigüedad, capital por tipo, saldo de capital, cargos, asistencias. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.asociados.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de relación institucional del asociado (`associateMemberships`).
- **Pantallas:** PAN-INS-01 (Listado de asociados), PAN-INS-02 (Ficha institucional del asociado).
- **Ola:** O2 · **Fuente:** M17 §11. API, línea 1347 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-003)

<a id="API-INS-005"></a>
#### API-INS-005 · `PATCH /api/admin/ins/memberships/{id}`

- **Qué hace:** Editar datos institucionales (distrito, categoría, representante) Modifica algunos campos de un registro de relación institucional del asociado (`associateMemberships`) (solo los enviados).
- **Para qué sirve:** RF-INS-007: Registrar el representante de asamblea / delegado y el distrito electoral del asociado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.asociados.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de relación institucional del asociado (`associateMemberships`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de relación institucional del asociado (`associateMemberships`).
- **Ola:** O2 · **Fuente:** M17 §11. API, línea 1349 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-005)

<a id="API-INS-004"></a>
#### API-INS-004 · `GET /api/admin/ins/memberships/{id}/summary`

- **Qué hace:** Resumen para ficha 360 y M19. Consulta «summary» de un registro de relación institucional del asociado (`associateMemberships`).
- **Para qué sirve:** RF-INS-015: Exponer el resumen institucional para la ficha 360 (M01) y el portal (M19): estado, número, antigüedad, capital por tipo, saldo de capital, cargos, asistencias. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.asociados.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de relación institucional del asociado (`associateMemberships`).
- **Pantallas:** PAN-INS-01 (Listado de asociados), PAN-INS-02 (Ficha institucional del asociado).
- **Ola:** O2 · **Fuente:** M17 §11. API, línea 1348 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-004)

<a id="API-INS-006"></a>
#### API-INS-006 · `POST /api/admin/ins/memberships/{id}/transitions`

- **Qué hace:** Cambio de estado (toStatus, motivo, acta, fecha efectiva) Cambia de estado (transición) un registro de relación institucional del asociado (`associateMemberships`).
- **Para qué sirve:** RF-INS-017: Historial con fecha efectiva y fecha de registro de todo cambio institucional. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.asociados.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INS-03 (Bandeja de solicitudes de ingreso).
- **Ola:** O2 · **Fuente:** M17 §11. API, línea 1350 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-006)

<a id="API-INS-007"></a>
#### API-INS-007 · `POST /api/admin/ins/memberships/{id}/renumber`

- **Qué hace:** Solicitar renumeración. Renumera un registro de relación institucional del asociado (`associateMemberships`).
- **Para qué sirve:** RF-INS-016: Renumeración controlada de asociados (corrección): solicitud, aprobación, auditoría y conservación del número anterior como alias; nunca reasignar un número a otra persona. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.asociados.renumerar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O2 · **Fuente:** M17 §11. API, línea 1351 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-007)

<a id="API-INS-008"></a>
#### API-INS-008 · `GET /api/admin/ins/memberships/{id}/events`

- **Qué hace:** Historia de estados. Lista, con filtros y paginación, los registros de historia de la membresía (`membershipEvents`).
- **Para qué sirve:** RF-INS-017: Historial con fecha efectiva y fecha de registro de todo cambio institucional. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.asociados.ver`.
- **Recibe:** en la ruta `id`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de historia de la membresía (`membershipEvents`) con `total`.
- **Pantallas:** PAN-INS-01 (Listado de asociados), PAN-INS-02 (Ficha institucional del asociado).
- **Ola:** O2 · **Fuente:** M17 §11. API, línea 1352 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-008)

<a id="API-INS-009"></a>
#### API-INS-009 · `GET /api/admin/ins/membership-requests`

- **Qué hace:** Bandeja de solicitudes. Lista, con filtros y paginación, los registros de `membership-requests`.
- **Para qué sirve:** RF-INS-003: Registrar fecha de solicitud, fecha de aprobación (alta institucional), acta y reunión de consejo que aprobó el ingreso, y calcular la antigüedad a cualquier fecha. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.asociados.aprobar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ResultadoGenerico (`ResultadoGenerico`) con `total`.
- **Pantallas:** PAN-INS-03 (Bandeja de solicitudes de ingreso).
- **Ola:** O2 · **Fuente:** M17 §11. API, línea 1353 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-009)

<a id="API-INS-010"></a>
#### API-INS-010 · `POST /api/admin/ins/membership-requests/batch-to-board`

- **Qué hace:** Agrupar solicitudes como tema de consejo. Registra un nuevo elemento u operación en `batch-to-board`.
- **Para qué sirve:** RF-INS-003: Registrar fecha de solicitud, fecha de aprobación (alta institucional), acta y reunión de consejo que aprobó el ingreso, y calcular la antigüedad a cualquier fecha. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.asociados.aprobar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INS-03 (Bandeja de solicitudes de ingreso).
- **Ola:** O2 · **Fuente:** M17 §11. API, línea 1354 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-010)

<a id="API-INS-011"></a>
#### API-INS-011 · `POST /api/admin/ins/register-editions`

- **Qué hace:** Generar Libro de Registro de Asociados (job) Registra un nuevo elemento u operación en ediciones del registro de asociados (`associateRegisterEditions`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-INS-022: Emitir el libro como edición versionada inmutable: folios correlativos, hash SHA-256 del contenido, PDF/A; las correcciones se registran como asientos rectificativos en la edición siguiente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.libro.emitir`.
- **Recibe:** los datos de ediciones del registro de asociados (`associateRegisterEditions`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-INS-05 (Libro de Registro de Asociados).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1355 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-011)

<a id="API-INS-012"></a>
#### API-INS-012 · `GET /api/admin/ins/register-editions/{id}/file`

- **Qué hace:** Descargar edición. Descarga un archivo de ediciones del registro de asociados (`associateRegisterEditions`).
- **Para qué sirve:** RF-INS-022: Emitir el libro como edición versionada inmutable: folios correlativos, hash SHA-256 del contenido, PDF/A; las correcciones se registran como asientos rectificativos en la edición siguiente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.libro.emitir`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un archivo (application/octet-stream).
- **Pantallas:** PAN-INS-05 (Libro de Registro de Asociados).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1356 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-012)

<a id="API-INS-013"></a>
#### API-INS-013 · `GET /api/admin/ins/capital-items`

- **Qué hace:** Rubros de capital. Lista, con filtros y paginación, los registros de rubros de capital (`capitalItems`).
- **Para qué sirve:** RF-INS-029: ABM de rubros de capital con código y descripción; la cuenta contable se asigna en M15 (entityAccountAssignments, entityType: capitalRubric; CTR-DAT-57, antes "y cuenta contable (mapeo a M15)"). Un rubro de productos solo puede… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.config.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de rubros de capital (`capitalItems`) con `total`.
- **Pantallas:** PAN-INS-06 (Rubros, reglas de suscripción y valor de cuota social), PAN-INS-28 (Configuración institucional), PAN-INS-29 (Distritos electorales).
- **Ola:** O5 · **Fuente:** M17 §11. API, línea 1357 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-013)

<a id="API-INS-013-b"></a>
#### API-INS-013-b · `POST /api/admin/ins/capital-items`

- **Qué hace:** Rubros de capital. Da de alta un registro de rubros de capital (`capitalItems`).
- **Para qué sirve:** RF-INS-029: ABM de rubros de capital con código y descripción; la cuenta contable se asigna en M15 (entityAccountAssignments, entityType: capitalRubric; CTR-DAT-57, antes "y cuenta contable (mapeo a M15)"). Un rubro de productos solo puede… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.config.configurar`.
- **Recibe:** los datos de rubros de capital (`capitalItems`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de rubros de capital (`capitalItems`).
- **Pantallas:** PAN-INS-06 (Rubros, reglas de suscripción y valor de cuota social), PAN-INS-28 (Configuración institucional), PAN-INS-29 (Distritos electorales).
- **Ola:** O5 · **Fuente:** M17 §11. API, línea 1357 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-013-b)

<a id="API-INS-013-c"></a>
#### API-INS-013-c · `PATCH /api/admin/ins/capital-items`

- **Qué hace:** Rubros de capital. Modifica algunos campos de un registro de rubros de capital (`capitalItems`) (solo los enviados).
- **Para qué sirve:** RF-INS-029: ABM de rubros de capital con código y descripción; la cuenta contable se asigna en M15 (entityAccountAssignments, entityType: capitalRubric; CTR-DAT-57, antes "y cuenta contable (mapeo a M15)"). Un rubro de productos solo puede… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.config.configurar`.
- **Recibe:** solo los campos a cambiar de rubros de capital (`capitalItems`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de rubros de capital (`capitalItems`).
- **Pantallas:** PAN-INS-06 (Rubros, reglas de suscripción y valor de cuota social), PAN-INS-28 (Configuración institucional), PAN-INS-29 (Distritos electorales).
- **Ola:** O5 · **Fuente:** M17 §11. API, línea 1357 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-013-c)

<a id="API-INS-014"></a>
#### API-INS-014 · `GET /api/admin/ins/capital-rules`

- **Qué hace:** Reglas de suscripción. Consulta `capital-rules`.
- **Para qué sirve:** RF-INS-032: Reglas de suscripción versionadas: cuotas sociales mínimas al ingreso, por servicio, por categoría; plan de integración (contado, cuotas en factura, cuotas en documento propio). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.config.configurar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INS-06 (Rubros, reglas de suscripción y valor de cuota social), PAN-INS-28 (Configuración institucional), PAN-INS-29 (Distritos electorales).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1358 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-014)

<a id="API-INS-014-b"></a>
#### API-INS-014-b · `POST /api/admin/ins/capital-rules`

- **Qué hace:** Reglas de suscripción. Registra un nuevo elemento u operación en `capital-rules`.
- **Para qué sirve:** RF-INS-032: Reglas de suscripción versionadas: cuotas sociales mínimas al ingreso, por servicio, por categoría; plan de integración (contado, cuotas en factura, cuotas en documento propio). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.config.configurar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INS-06 (Rubros, reglas de suscripción y valor de cuota social), PAN-INS-28 (Configuración institucional), PAN-INS-29 (Distritos electorales).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1358 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-014-b)

<a id="API-INS-014-c"></a>
#### API-INS-014-c · `PATCH /api/admin/ins/capital-rules`

- **Qué hace:** Reglas de suscripción. Modifica algunos campos de un registro de `capital-rules` (solo los enviados).
- **Para qué sirve:** RF-INS-032: Reglas de suscripción versionadas: cuotas sociales mínimas al ingreso, por servicio, por categoría; plan de integración (contado, cuotas en factura, cuotas en documento propio). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.config.configurar`.
- **Recibe:** solo los campos a cambiar; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INS-06 (Rubros, reglas de suscripción y valor de cuota social), PAN-INS-28 (Configuración institucional), PAN-INS-29 (Distritos electorales).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1358 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-014-c)

<a id="API-INS-015"></a>
#### API-INS-015 · `GET /api/admin/ins/share-values`

- **Qué hace:** Valor nominal versionado. Lista, con filtros y paginación, los registros de valor nominal de la cuota social (`capitalShareValues`).
- **Para qué sirve:** RF-INS-033: Valor nominal de la cuota social versionado y cantidad de cuotas por asociado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.config.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de valor nominal de la cuota social (`capitalShareValues`) con `total`.
- **Pantallas:** PAN-INS-06 (Rubros, reglas de suscripción y valor de cuota social), PAN-INS-28 (Configuración institucional), PAN-INS-29 (Distritos electorales).
- **Ola:** O5 · **Fuente:** M17 §11. API, línea 1359 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-015)

<a id="API-INS-015-b"></a>
#### API-INS-015-b · `POST /api/admin/ins/share-values`

- **Qué hace:** Valor nominal versionado. Da de alta un registro de valor nominal de la cuota social (`capitalShareValues`).
- **Para qué sirve:** RF-INS-033: Valor nominal de la cuota social versionado y cantidad de cuotas por asociado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.config.configurar`.
- **Recibe:** los datos de valor nominal de la cuota social (`capitalShareValues`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de valor nominal de la cuota social (`capitalShareValues`).
- **Pantallas:** PAN-INS-06 (Rubros, reglas de suscripción y valor de cuota social), PAN-INS-28 (Configuración institucional), PAN-INS-29 (Distritos electorales).
- **Ola:** O5 · **Fuente:** M17 §11. API, línea 1359 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-015-b)

<a id="API-INS-016"></a>
#### API-INS-016 · `GET /api/admin/ins/capital-movements`

- **Qué hace:** Movimientos con filtros. Lista, con filtros y paginación, los registros de libro mayor de capital (`capitalMovements`).
- **Para qué sirve:** RF-INS-080: Guardar conjuntos de filtros del padrón por tenant y reutilizarlos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.capital.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de libro mayor de capital (`capitalMovements`) con `total`.
- **Pantallas:** PAN-INS-07 (Movimientos de capital), PAN-INS-08 (Estado de cuenta de capital).
- **Ola:** O5 · **Fuente:** M17 §11. API, línea 1360 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-016)

<a id="API-INS-017"></a>
#### API-INS-017 · `POST /api/admin/ins/capital-movements`

- **Qué hace:** Movimiento manual (queda pending hasta aprobación) Da de alta un registro de libro mayor de capital (`capitalMovements`).
- **Para qué sirve:** RF-INS-054: Carga manual de capital con motivo, adjunto y aprobación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.capital.ajustar`.
- **Recibe:** los datos de libro mayor de capital (`capitalMovements`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de libro mayor de capital (`capitalMovements`).
- **Ola:** O5 · **Fuente:** M17 §11. API, línea 1361 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-017)

<a id="API-INS-018"></a>
#### API-INS-018 · `POST /api/admin/ins/capital-movements/{id}/reverse`

- **Qué hace:** Contramovimiento. Revierte un registro de libro mayor de capital (`capitalMovements`).
- **Para qué sirve:** RF-INS-031: Importe de capital al alta de un servicio: monto o cantidad de cuotas sociales a suscribir cuando se contrata un servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.capital.ajustar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O5 · **Fuente:** M17 §11. API, línea 1362 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-018)

<a id="API-INS-019"></a>
#### API-INS-019 · `GET /api/admin/ins/memberships/{id}/capital-statement`

- **Qué hace:** Estado de cuenta a fecha (?asOf=) Consulta «capital-statement» de un registro de relación institucional del asociado (`associateMemberships`).
- **Para qué sirve:** RF-INS-045: Estado de cuenta de capital por asociado (pantalla, PDF, PWA) con descripciones configurables de los tipos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.capital.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de relación institucional del asociado (`associateMemberships`).
- **Pantallas:** PAN-INS-07 (Movimientos de capital), PAN-INS-08 (Estado de cuenta de capital).
- **Ola:** O2 · **Fuente:** M17 §11. API, línea 1363 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-019)

<a id="API-INS-020"></a>
#### API-INS-020 · `POST /api/admin/ins/capital-imports`

- **Qué hace:** Importación (simular/confirmar) Registra un nuevo elemento u operación en `capital-imports`.
- **Para qué sirve:** RF-INS-035: Registrar la integración al confirmarse el pago, en proporción pago/total del comprobante. · RF-INS-062: Simular la distribución (escenario aislado) con criterio de retorno: proporcional a facturación/uso por servicio, a capital integrado o a otro criterio aprobado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.capital.importar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INS-13 (Importación de capital).
- **Ola:** O5 · **Fuente:** M17 §11. API, línea 1364 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-020)

<a id="API-INS-021"></a>
#### API-INS-021 · `GET /api/admin/ins/capital-reserves`

- **Qué hace:** Reservas. Lista, con filtros y paginación, los registros de reservas de capital (`capitalReserves`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.reservas.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de reservas de capital (`capitalReserves`) con `total`.
- **Pantallas:** PAN-INS-09 (Reservas y recuperos).
- **Ola:** O5 · **Fuente:** M17 §11. API, línea 1365 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-021)

<a id="API-INS-021-b"></a>
#### API-INS-021-b · `POST /api/admin/ins/capital-reserves`

- **Qué hace:** Reservas. Da de alta un registro de reservas de capital (`capitalReserves`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.reservas.gestionar`.
- **Recibe:** los datos de reservas de capital (`capitalReserves`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de reservas de capital (`capitalReserves`).
- **Pantallas:** PAN-INS-09 (Reservas y recuperos).
- **Ola:** O5 · **Fuente:** M17 §11. API, línea 1365 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-021-b)

<a id="API-INS-022"></a>
#### API-INS-022 · `POST /api/admin/ins/capital-reserves/{id}/release`

- **Qué hace:** Recupero. Libera un registro de reservas de capital (`capitalReserves`).
- **Para qué sirve:** RF-INS-048: Reserva de capital y su recupero: afectar capital integrado a un destino con concepto y comprobante configurables; tope = integrado salvo autorización. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.reservas.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INS-09 (Reservas y recuperos).
- **Ola:** O5 · **Fuente:** M17 §11. API, línea 1366 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-022)

<a id="API-INS-023"></a>
#### API-INS-023 · `GET /api/admin/ins/capital-transfers`

- **Qué hace:** Transferencias. Lista, con filtros y paginación, los registros de transferencias de capital (`capitalTransfers`).
- **Para qué sirve:** RF-INS-050: Conservar capital al transferir una cuenta (M01) a otra persona: el capital queda en el asociado origen con movimientos compensatorios si se elige conservar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.transferencias.crear`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de transferencias de capital (`capitalTransfers`) con `total`.
- **Pantallas:** PAN-INS-10 (Transferencias de capital entre asociados).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1367 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-023)

<a id="API-INS-023-b"></a>
#### API-INS-023-b · `POST /api/admin/ins/capital-transfers`

- **Qué hace:** Transferencias. Da de alta un registro de transferencias de capital (`capitalTransfers`).
- **Para qué sirve:** RF-INS-050: Conservar capital al transferir una cuenta (M01) a otra persona: el capital queda en el asociado origen con movimientos compensatorios si se elige conservar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.transferencias.crear`.
- **Recibe:** los datos de transferencias de capital (`capitalTransfers`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de transferencias de capital (`capitalTransfers`).
- **Pantallas:** PAN-INS-10 (Transferencias de capital entre asociados).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1367 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-023-b)

<a id="API-INS-024"></a>
#### API-INS-024 · `POST /api/admin/ins/capital-transfers/{id}/execute`

- **Qué hace:** Ejecutar transferencia aprobada. Ejecuta un registro de transferencias de capital (`capitalTransfers`).
- **Para qué sirve:** RF-INS-049: Transferencia de capital entre asociados con aprobación del consejo, movimientos espejo y opción de transferir servicios y egresar al cedente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.transferencias.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INS-10 (Transferencias de capital entre asociados).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1368 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-024)

<a id="API-INS-025"></a>
#### API-INS-025 · `GET /api/admin/ins/capital-refunds`

- **Qué hace:** Rescates. Lista, con filtros y paginación, los registros de reembolsos de capital (`capitalRefunds`).
- **Para qué sirve:** RF-INS-051: Rescate / reembolso de capital al egreso: solicitud, cálculo (integrado − compensaciones), aplicación del límite anual del estatuto, cola por orden de solicitud, aprobación del consejo, comprobante (tipo y concepto… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.rescates.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de reembolsos de capital (`capitalRefunds`) con `total`.
- **Pantallas:** PAN-INS-11 (Rescates/reembolsos).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1369 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-025)

<a id="API-INS-025-b"></a>
#### API-INS-025-b · `POST /api/admin/ins/capital-refunds`

- **Qué hace:** Rescates. Da de alta un registro de reembolsos de capital (`capitalRefunds`).
- **Para qué sirve:** RF-INS-051: Rescate / reembolso de capital al egreso: solicitud, cálculo (integrado − compensaciones), aplicación del límite anual del estatuto, cola por orden de solicitud, aprobación del consejo, comprobante (tipo y concepto… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.rescates.gestionar`.
- **Recibe:** los datos de reembolsos de capital (`capitalRefunds`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de reembolsos de capital (`capitalRefunds`).
- **Pantallas:** PAN-INS-11 (Rescates/reembolsos).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1369 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-025-b)

<a id="API-INS-026"></a>
#### API-INS-026 · `POST /api/admin/ins/capital-refunds/{id}/calculate`

- **Qué hace:** Calcular importe. Calcula un registro de reembolsos de capital (`capitalRefunds`).
- **Para qué sirve:** RF-INS-051: Rescate / reembolso de capital al egreso: solicitud, cálculo (integrado − compensaciones), aplicación del límite anual del estatuto, cola por orden de solicitud, aprobación del consejo, comprobante (tipo y concepto… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.rescates.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INS-11 (Rescates/reembolsos).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1370 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-026)

<a id="API-INS-027"></a>
#### API-INS-027 · `POST /api/admin/ins/capital-refunds/{id}/transitions`

- **Qué hace:** Aprobar, programar, rechazar, cancelar. Cambia de estado (transición) un registro de reembolsos de capital (`capitalRefunds`).
- **Para qué sirve:** RF-INS-051: Rescate / reembolso de capital al egreso: solicitud, cálculo (integrado − compensaciones), aplicación del límite anual del estatuto, cola por orden de solicitud, aprobación del consejo, comprobante (tipo y concepto… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.rescates.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1371 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-027)

<a id="API-INS-028"></a>
#### API-INS-028 · `GET /api/admin/ins/capital-closings`

- **Qué hace:** Cierres y reapertura. Lista, con filtros y paginación, los registros de cierres de capital (`capitalClosings`).
- **Para qué sirve:** RF-INS-053: Cierre de capital: fecha hasta la cual no se admiten movimientos; reapertura solo con autorización. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.cierres.crear`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de cierres de capital (`capitalClosings`) con `total`.
- **Pantallas:** PAN-INS-12 (Cierres, revisión y conciliación).
- **Ola:** O5 · **Fuente:** M17 §11. API, línea 1372 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-028)

<a id="API-INS-028-b"></a>
#### API-INS-028-b · `POST /api/admin/ins/capital-closings`

- **Qué hace:** Cierres y reapertura. Da de alta un registro de cierres de capital (`capitalClosings`).
- **Para qué sirve:** RF-INS-053: Cierre de capital: fecha hasta la cual no se admiten movimientos; reapertura solo con autorización. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.cierres.crear`.
- **Recibe:** los datos de cierres de capital (`capitalClosings`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de cierres de capital (`capitalClosings`).
- **Pantallas:** PAN-INS-12 (Cierres, revisión y conciliación).
- **Ola:** O5 · **Fuente:** M17 §11. API, línea 1372 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-028-b)

<a id="API-INS-029"></a>
#### API-INS-029 · `POST /api/admin/ins/capital-reviews`

- **Qué hace:** Ejecutar revisión (job) Registra un nuevo elemento u operación en `capital-reviews`; el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-INS-039: Modo revisión: recalcular el capital de un período comparando movimientos esperados con registrados y proponer ajustes sin duplicar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.capital.ajustar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1373 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-029)

<a id="API-INS-030"></a>
#### API-INS-030 · `GET /api/admin/ins/capital-reconciliation`

- **Qué hace:** Conciliación con M15. Consulta `capital-reconciliation`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.capital.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INS-07 (Movimientos de capital), PAN-INS-08 (Estado de cuenta de capital).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1374 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-030)

<a id="API-INS-031"></a>
#### API-INS-031 · `GET /api/admin/ins/share-certificates`

- **Qué hace:** Títulos/certificados. Lista, con filtros y paginación, los registros de certificados de aportación (`shareCertificates`).
- **Para qué sirve:** RF-INS-026: Emitir certificados de cuotas sociales (acciones) por asociado, numerados, con cantidad, valor nominal y estado de integración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.capital.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de certificados de aportación (`shareCertificates`) con `total`.
- **Pantallas:** PAN-INS-07 (Movimientos de capital), PAN-INS-08 (Estado de cuenta de capital).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1375 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-031)

<a id="API-INS-031-b"></a>
#### API-INS-031-b · `POST /api/admin/ins/share-certificates`

- **Qué hace:** Títulos/certificados. Da de alta un registro de certificados de aportación (`shareCertificates`).
- **Para qué sirve:** RF-INS-026: Emitir certificados de cuotas sociales (acciones) por asociado, numerados, con cantidad, valor nominal y estado de integración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.capital.ajustar`.
- **Recibe:** los datos de certificados de aportación (`shareCertificates`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de certificados de aportación (`shareCertificates`).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1375 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-031-b)

<a id="API-INS-032"></a>
#### API-INS-032 · `GET /api/admin/ins/surplus-distributions`

- **Qué hace:** Distribuciones. Lista, con filtros y paginación, los registros de distribución de excedentes (`surplusDistributions`).
- **Para qué sirve:** RF-INS-060: Obtener el excedente repartible del ejercicio desde M15 por sección/servicio, separando operaciones con asociados y con no asociados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.excedentes.calcular`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de distribución de excedentes (`surplusDistributions`) con `total`.
- **Pantallas:** PAN-INS-14 (Distribución de excedentes).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1376 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-032)

<a id="API-INS-032-b"></a>
#### API-INS-032-b · `POST /api/admin/ins/surplus-distributions`

- **Qué hace:** Distribuciones. Da de alta un registro de distribución de excedentes (`surplusDistributions`).
- **Para qué sirve:** RF-INS-060: Obtener el excedente repartible del ejercicio desde M15 por sección/servicio, separando operaciones con asociados y con no asociados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.excedentes.calcular`.
- **Recibe:** los datos de distribución de excedentes (`surplusDistributions`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de distribución de excedentes (`surplusDistributions`).
- **Pantallas:** PAN-INS-14 (Distribución de excedentes).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1376 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-032-b)

<a id="API-INS-033"></a>
#### API-INS-033 · `POST /api/admin/ins/surplus-distributions/{id}/simulate`

- **Qué hace:** Simular. Simula sin efectos un registro de distribución de excedentes (`surplusDistributions`).
- **Para qué sirve:** RF-INS-062: Simular la distribución (escenario aislado) con criterio de retorno: proporcional a facturación/uso por servicio, a capital integrado o a otro criterio aprobado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.excedentes.calcular`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INS-14 (Distribución de excedentes).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1377 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-033)

<a id="API-INS-034"></a>
#### API-INS-034 · `POST /api/admin/ins/surplus-distributions/{id}/execute`

- **Qué hace:** Ejecutar (job) Ejecuta un registro de distribución de excedentes (`surplusDistributions`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-INS-063: Vincular la distribución con la resolución de asamblea que la aprueba; sin resolución no se ejecuta. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.excedentes.ejecutar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1378 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-034)

<a id="API-INS-035"></a>
#### API-INS-035 · `GET /api/admin/ins/bodies`

- **Qué hace:** Órganos y cargos. Lista, con filtros y paginación, los registros de órganos (`governanceBodies`).
- **Para qué sirve:** RF-INS-071: Nómina de autoridades vigente e histórica exportable (INAES, bancos, organismos) y firmantes autorizados derivados de los cargos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.organos.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de órganos (`governanceBodies`) con `total`.
- **Pantallas:** PAN-INS-15 (Órganos, cargos y mandatos).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1379 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-035)

<a id="API-INS-035-b"></a>
#### API-INS-035-b · `POST /api/admin/ins/bodies`

- **Qué hace:** Órganos y cargos. Da de alta un registro de órganos (`governanceBodies`).
- **Para qué sirve:** RF-INS-071: Nómina de autoridades vigente e histórica exportable (INAES, bancos, organismos) y firmantes autorizados derivados de los cargos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.organos.gestionar`.
- **Recibe:** los datos de órganos (`governanceBodies`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de órganos (`governanceBodies`).
- **Pantallas:** PAN-INS-15 (Órganos, cargos y mandatos).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1379 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-035-b)

<a id="API-INS-035-c"></a>
#### API-INS-035-c · `PATCH /api/admin/ins/bodies`

- **Qué hace:** Órganos y cargos. Modifica algunos campos de un registro de órganos (`governanceBodies`) (solo los enviados).
- **Para qué sirve:** RF-INS-071: Nómina de autoridades vigente e histórica exportable (INAES, bancos, organismos) y firmantes autorizados derivados de los cargos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.organos.gestionar`.
- **Recibe:** solo los campos a cambiar de órganos (`governanceBodies`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de órganos (`governanceBodies`).
- **Pantallas:** PAN-INS-15 (Órganos, cargos y mandatos).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1379 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-035-c)

<a id="API-INS-036"></a>
#### API-INS-036 · `GET /api/admin/ins/mandates`

- **Qué hace:** Mandatos. Lista, con filtros y paginación, los registros de mandatos (`bodyMandates`).
- **Para qué sirve:** RF-INS-074: Participantes y asistencia de reuniones: integrante de órgano (mandato), empleado, invitado externo o asociado; presente/ausente/justificado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.organos.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de mandatos (`bodyMandates`) con `total`.
- **Pantallas:** PAN-INS-15 (Órganos, cargos y mandatos).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1380 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-036)

<a id="API-INS-036-b"></a>
#### API-INS-036-b · `POST /api/admin/ins/mandates`

- **Qué hace:** Mandatos. Da de alta un registro de mandatos (`bodyMandates`).
- **Para qué sirve:** RF-INS-074: Participantes y asistencia de reuniones: integrante de órgano (mandato), empleado, invitado externo o asociado; presente/ausente/justificado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.organos.gestionar`.
- **Recibe:** los datos de mandatos (`bodyMandates`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de mandatos (`bodyMandates`).
- **Pantallas:** PAN-INS-15 (Órganos, cargos y mandatos).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1380 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-036-b)

<a id="API-INS-036-c"></a>
#### API-INS-036-c · `PATCH /api/admin/ins/mandates`

- **Qué hace:** Mandatos. Modifica algunos campos de un registro de mandatos (`bodyMandates`) (solo los enviados).
- **Para qué sirve:** RF-INS-074: Participantes y asistencia de reuniones: integrante de órgano (mandato), empleado, invitado externo o asociado; presente/ausente/justificado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.organos.gestionar`.
- **Recibe:** solo los campos a cambiar de mandatos (`bodyMandates`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de mandatos (`bodyMandates`).
- **Pantallas:** PAN-INS-15 (Órganos, cargos y mandatos).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1380 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-036-c)

<a id="API-INS-037"></a>
#### API-INS-037 · `GET /api/admin/ins/meetings`

- **Qué hace:** Reuniones y asambleas. Lista, con filtros y paginación, los registros de reuniones y asambleas (`meetings`).
- **Para qué sirve:** RF-INS-075: Permisos por reunión: usuarios habilitados a ver o editar una reunión reservada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.reuniones.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de reuniones y asambleas (`meetings`) con `total`.
- **Pantallas:** PAN-INS-18 (Expediente de asamblea).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1381 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-037)

<a id="API-INS-037-b"></a>
#### API-INS-037-b · `POST /api/admin/ins/meetings`

- **Qué hace:** Reuniones y asambleas. Da de alta un registro de reuniones y asambleas (`meetings`).
- **Para qué sirve:** RF-INS-075: Permisos por reunión: usuarios habilitados a ver o editar una reunión reservada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.reuniones.gestionar`.
- **Recibe:** los datos de reuniones y asambleas (`meetings`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de reuniones y asambleas (`meetings`).
- **Pantallas:** PAN-INS-18 (Expediente de asamblea).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1381 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-037-b)

<a id="API-INS-037-c"></a>
#### API-INS-037-c · `PATCH /api/admin/ins/meetings`

- **Qué hace:** Reuniones y asambleas. Modifica algunos campos de un registro de reuniones y asambleas (`meetings`) (solo los enviados).
- **Para qué sirve:** RF-INS-075: Permisos por reunión: usuarios habilitados a ver o editar una reunión reservada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.reuniones.gestionar`.
- **Recibe:** solo los campos a cambiar de reuniones y asambleas (`meetings`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de reuniones y asambleas (`meetings`).
- **Pantallas:** PAN-INS-18 (Expediente de asamblea).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1381 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-037-c)

<a id="API-INS-038"></a>
#### API-INS-038 · `POST /api/admin/ins/meetings/{id}/transitions`

- **Qué hace:** Convocar, iniciar, cuarto intermedio, cerrar, cancelar. Cambia de estado (transición) un registro de reuniones y asambleas (`meetings`).
- **Para qué sirve:** RF-INS-102: Egreso con capital integrado: bloquear o exigir trámite de rescate iniciado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.reuniones.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INS-18 (Expediente de asamblea).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1382 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-038)

<a id="API-INS-039"></a>
#### API-INS-039 · `GET /api/admin/ins/meetings/{id}/agenda-items`

- **Qué hace:** Orden del día. Consulta «agenda-items» de un registro de reuniones y asambleas (`meetings`).
- **Para qué sirve:** RF-INS-087: Actas: número correlativo por libro (consejo, asamblea, sindicatura), fecha de registro, reunión, contenido generado desde el orden del día y resoluciones, PDF, estado de firma y firmantes; actas internas y de mesa de entradas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.reuniones.gestionar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de reuniones y asambleas (`meetings`).
- **Pantallas:** PAN-INS-18 (Expediente de asamblea).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1383 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-039)

<a id="API-INS-039-b"></a>
#### API-INS-039-b · `POST /api/admin/ins/meetings/{id}/agenda-items`

- **Qué hace:** Orden del día. Registra «agenda-items» sobre un registro de reuniones y asambleas (`meetings`).
- **Para qué sirve:** RF-INS-087: Actas: número correlativo por libro (consejo, asamblea, sindicatura), fecha de registro, reunión, contenido generado desde el orden del día y resoluciones, PDF, estado de firma y firmantes; actas internas y de mesa de entradas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.reuniones.gestionar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INS-18 (Expediente de asamblea).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1383 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-039-b)

<a id="API-INS-039-c"></a>
#### API-INS-039-c · `PATCH /api/admin/ins/meetings/{id}/agenda-items`

- **Qué hace:** Orden del día. Modifica algunos campos de un registro de reuniones y asambleas (`meetings`) (solo los enviados).
- **Para qué sirve:** RF-INS-087: Actas: número correlativo por libro (consejo, asamblea, sindicatura), fecha de registro, reunión, contenido generado desde el orden del día y resoluciones, PDF, estado de firma y firmantes; actas internas y de mesa de entradas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.reuniones.gestionar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de reuniones y asambleas (`meetings`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de reuniones y asambleas (`meetings`).
- **Pantallas:** PAN-INS-18 (Expediente de asamblea).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1383 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-039-c)

<a id="API-INS-040"></a>
#### API-INS-040 · `GET /api/admin/ins/meetings/{id}/participants`

- **Qué hace:** Participantes y asistencia. Consulta «participants» de un registro de reuniones y asambleas (`meetings`).
- **Para qué sirve:** RF-INS-074: Participantes y asistencia de reuniones: integrante de órgano (mandato), empleado, invitado externo o asociado; presente/ausente/justificado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.asistencia.registrar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de reuniones y asambleas (`meetings`).
- **Pantallas:** PAN-INS-20 (Acreditación en el acto).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1384 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-040)

<a id="API-INS-040-b"></a>
#### API-INS-040-b · `POST /api/admin/ins/meetings/{id}/participants`

- **Qué hace:** Participantes y asistencia. Registra «participants» sobre un registro de reuniones y asambleas (`meetings`).
- **Para qué sirve:** RF-INS-074: Participantes y asistencia de reuniones: integrante de órgano (mandato), empleado, invitado externo o asociado; presente/ausente/justificado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.asistencia.registrar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INS-20 (Acreditación en el acto).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1384 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-040-b)

<a id="API-INS-040-c"></a>
#### API-INS-040-c · `PATCH /api/admin/ins/meetings/{id}/participants`

- **Qué hace:** Participantes y asistencia. Modifica algunos campos de un registro de reuniones y asambleas (`meetings`) (solo los enviados).
- **Para qué sirve:** RF-INS-074: Participantes y asistencia de reuniones: integrante de órgano (mandato), empleado, invitado externo o asociado; presente/ausente/justificado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.asistencia.registrar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de reuniones y asambleas (`meetings`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de reuniones y asambleas (`meetings`).
- **Pantallas:** PAN-INS-20 (Acreditación en el acto).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1384 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-040-c)

<a id="API-INS-041"></a>
#### API-INS-041 · `POST /api/admin/ins/meetings/{id}/check-in`

- **Qué hace:** Acreditación por QR/documento (lote offline) Registra la llegada de un registro de reuniones y asambleas (`meetings`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-INS-082: Acreditación y asistencia a asamblea: lectura de credencial QR o documento, hora, firma en libro de asistencia (digital o impresa), poderes presentados, cálculo de quórum en vivo, primer y segundo llamado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.asistencia.registrar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-INS-20 (Acreditación en el acto).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1385 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-041)

<a id="API-INS-042"></a>
#### API-INS-042 · `GET /api/admin/ins/meetings/{id}/permissions`

- **Qué hace:** Permisos de reunión reservada. Consulta «permissions» de un registro de reuniones y asambleas (`meetings`).
- **Para qué sirve:** RF-INS-075: Permisos por reunión: usuarios habilitados a ver o editar una reunión reservada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.reuniones.gestionar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de reuniones y asambleas (`meetings`).
- **Pantallas:** PAN-INS-18 (Expediente de asamblea).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1386 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-042)

<a id="API-INS-042-b"></a>
#### API-INS-042-b · `PUT /api/admin/ins/meetings/{id}/permissions`

- **Qué hace:** Permisos de reunión reservada. Reemplaza o configura reuniones y asambleas (`meetings`).
- **Para qué sirve:** RF-INS-075: Permisos por reunión: usuarios habilitados a ver o editar una reunión reservada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.reuniones.gestionar`.
- **Recibe:** en la ruta `id`; los datos de reuniones y asambleas (`meetings`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de reuniones y asambleas (`meetings`).
- **Pantallas:** PAN-INS-18 (Expediente de asamblea).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1386 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-042-b)

<a id="API-INS-043"></a>
#### API-INS-043 · `GET /api/admin/ins/minutes`

- **Qué hace:** Actas. Lista, con filtros y paginación, los registros de actas (`minutes`).
- **Para qué sirve:** RF-INS-075: Permisos por reunión: usuarios habilitados a ver o editar una reunión reservada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.actas.editar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de actas (`minutes`) con `total`.
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1387 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-043)

<a id="API-INS-043-b"></a>
#### API-INS-043-b · `POST /api/admin/ins/minutes`

- **Qué hace:** Actas. Da de alta un registro de actas (`minutes`).
- **Para qué sirve:** RF-INS-075: Permisos por reunión: usuarios habilitados a ver o editar una reunión reservada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.actas.editar`.
- **Recibe:** los datos de actas (`minutes`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de actas (`minutes`).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1387 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-043-b)

<a id="API-INS-043-c"></a>
#### API-INS-043-c · `PATCH /api/admin/ins/minutes`

- **Qué hace:** Actas. Modifica algunos campos de un registro de actas (`minutes`) (solo los enviados).
- **Para qué sirve:** RF-INS-075: Permisos por reunión: usuarios habilitados a ver o editar una reunión reservada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.actas.editar`.
- **Recibe:** solo los campos a cambiar de actas (`minutes`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de actas (`minutes`).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1387 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-043-c)

<a id="API-INS-044"></a>
#### API-INS-044 · `POST /api/admin/ins/minutes/{id}/sign`

- **Qué hace:** Firmar. Firma un registro de actas (`minutes`).
- **Para qué sirve:** RF-INS-105: Aislamiento por tenant de membresías, capital, padrones y actas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.actas.firmar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1388 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-044)

<a id="API-INS-045"></a>
#### API-INS-045 · `GET /api/admin/ins/resolutions`

- **Qué hace:** Resoluciones y seguimiento. Lista, con filtros y paginación, los registros de resoluciones (`resolutions`).
- **Para qué sirve:** RF-INS-089: Resoluciones y seguimiento de decisiones: responsable, plazo, estado, vínculo con objetos afectados (ingresos de asociados, rescates, distribución, honorarios, tarifas, reglamentos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.reuniones.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de resoluciones (`resolutions`) con `total`.
- **Pantallas:** PAN-INS-16 (Agenda de reuniones), PAN-INS-17 (Detalle de reunión), PAN-INS-24 (Seguimiento de resoluciones).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1389 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-045)

<a id="API-INS-045-b"></a>
#### API-INS-045-b · `PATCH /api/admin/ins/resolutions`

- **Qué hace:** Resoluciones y seguimiento. Modifica algunos campos de un registro de resoluciones (`resolutions`) (solo los enviados).
- **Para qué sirve:** RF-INS-089: Resoluciones y seguimiento de decisiones: responsable, plazo, estado, vínculo con objetos afectados (ingresos de asociados, rescates, distribución, honorarios, tarifas, reglamentos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.reuniones.ver`.
- **Recibe:** solo los campos a cambiar de resoluciones (`resolutions`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de resoluciones (`resolutions`).
- **Pantallas:** PAN-INS-16 (Agenda de reuniones), PAN-INS-17 (Detalle de reunión), PAN-INS-24 (Seguimiento de resoluciones).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1389 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-045-b)

<a id="API-INS-046"></a>
#### API-INS-046 · `POST /api/admin/ins/rosters`

- **Qué hace:** Generar padrón (job) Registra un nuevo elemento u operación en padrones (`rosters`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-INS-028: Catálogo de informes INAES (padrón, registro, altas/bajas, nómina de autoridades, documentación de asamblea, otros) con período, vencimiento, generación, validación, presentación y acuse. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.padrones.generar`.
- **Recibe:** los datos de padrones (`rosters`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-INS-19 (Padrones).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1390 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-046)

<a id="API-INS-047"></a>
#### API-INS-047 · `GET /api/admin/ins/rosters/{id}/entries`

- **Qué hace:** Entradas con motivo. Consulta «entries» de un registro de padrones (`rosters`).
- **Para qué sirve:** RF-INS-054: Carga manual de capital con motivo, adjunto y aprobación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.padrones.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de padrones (`rosters`).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1391 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-047)

<a id="API-INS-048"></a>
#### API-INS-048 · `POST /api/admin/ins/rosters/{id}/transitions`

- **Qué hace:** Publicar, aprobar final. Cambia de estado (transición) un registro de padrones (`rosters`).
- **Para qué sirve:** RF-INS-106: Portal del asociado (renderizado por M19): estado, número, antigüedad, capital, credencial digital, convocatorias, documentos públicos, padrón propio, solicitudes de ingreso, egreso, poder y reclamo de padrón. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.padrones.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1392 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-048)

<a id="API-INS-049"></a>
#### API-INS-049 · `POST /api/admin/ins/rosters/{id}/claims/{entryId}/resolve`

- **Qué hace:** Resolver reclamo. Resuelve un registro de padrones (`rosters`).
- **Para qué sirve:** RF-INS-081: Exhibición y observaciones del padrón: consulta por el asociado en PWA ("¿estoy habilitado?"), reclamo de inclusión con plazo, resolución de la junta electoral o secretaría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.padrones.aprobar`.
- **Recibe:** en la ruta `id`, `entryId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1393 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-049)

<a id="API-INS-050"></a>
#### API-INS-050 · `GET /api/admin/ins/roster-filter-sets`

- **Qué hace:** Conjuntos de filtros guardados. Consulta `roster-filter-sets`.
- **Para qué sirve:** RF-INS-080: Guardar conjuntos de filtros del padrón por tenant y reutilizarlos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.padrones.generar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INS-19 (Padrones).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1394 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-050)

<a id="API-INS-050-b"></a>
#### API-INS-050-b · `POST /api/admin/ins/roster-filter-sets`

- **Qué hace:** Conjuntos de filtros guardados. Registra un nuevo elemento u operación en `roster-filter-sets`.
- **Para qué sirve:** RF-INS-080: Guardar conjuntos de filtros del padrón por tenant y reutilizarlos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.padrones.generar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INS-19 (Padrones).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1394 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-050-b)

<a id="API-INS-051"></a>
#### API-INS-051 · `GET /api/admin/ins/meetings/{id}/proxies`

- **Qué hace:** Poderes. Lista, con filtros y paginación, los registros de poderes (`proxies`).
- **Para qué sirve:** RF-INS-083: Poderes / representaciones: registro, validación (estatuto lo admite, mandatario habilitado, tope de representados), revocación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.poderes.validar`.
- **Recibe:** en la ruta `id`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de poderes (`proxies`) con `total`.
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1395 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-051)

<a id="API-INS-051-b"></a>
#### API-INS-051-b · `POST /api/admin/ins/meetings/{id}/proxies`

- **Qué hace:** Poderes. Da de alta un registro de poderes (`proxies`).
- **Para qué sirve:** RF-INS-083: Poderes / representaciones: registro, validación (estatuto lo admite, mandatario habilitado, tope de representados), revocación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.poderes.validar`.
- **Recibe:** en la ruta `id`; los datos de poderes (`proxies`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de poderes (`proxies`).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1395 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-051-b)

<a id="API-INS-051-c"></a>
#### API-INS-051-c · `PATCH /api/admin/ins/meetings/{id}/proxies`

- **Qué hace:** Poderes. Modifica algunos campos de un registro de poderes (`proxies`) (solo los enviados).
- **Para qué sirve:** RF-INS-083: Poderes / representaciones: registro, validación (estatuto lo admite, mandatario habilitado, tope de representados), revocación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.poderes.validar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de poderes (`proxies`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de poderes (`proxies`).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1395 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-051-c)

<a id="API-INS-052"></a>
#### API-INS-052 · `GET /api/admin/ins/meetings/{id}/electoral-lists`

- **Qué hace:** Listas. Lista, con filtros y paginación, los registros de listas electorales (`electoralLists`).
- **Para qué sirve:** RF-INS-085: Junta electoral y listas: presentación de listas de candidatos, avales, oficialización, impugnaciones y resolución. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.listas.gestionar`.
- **Recibe:** en la ruta `id`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de listas electorales (`electoralLists`) con `total`.
- **Pantallas:** PAN-INS-22 (Listas y junta electoral).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1396 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-052)

<a id="API-INS-052-b"></a>
#### API-INS-052-b · `POST /api/admin/ins/meetings/{id}/electoral-lists`

- **Qué hace:** Listas. Da de alta un registro de listas electorales (`electoralLists`).
- **Para qué sirve:** RF-INS-085: Junta electoral y listas: presentación de listas de candidatos, avales, oficialización, impugnaciones y resolución. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.listas.gestionar`.
- **Recibe:** en la ruta `id`; los datos de listas electorales (`electoralLists`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de listas electorales (`electoralLists`).
- **Pantallas:** PAN-INS-22 (Listas y junta electoral).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1396 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-052-b)

<a id="API-INS-052-c"></a>
#### API-INS-052-c · `PATCH /api/admin/ins/meetings/{id}/electoral-lists`

- **Qué hace:** Listas. Modifica algunos campos de un registro de listas electorales (`electoralLists`) (solo los enviados).
- **Para qué sirve:** RF-INS-085: Junta electoral y listas: presentación de listas de candidatos, avales, oficialización, impugnaciones y resolución. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.listas.gestionar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de listas electorales (`electoralLists`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de listas electorales (`electoralLists`).
- **Pantallas:** PAN-INS-22 (Listas y junta electoral).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1396 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-052-c)

<a id="API-INS-053"></a>
#### API-INS-053 · `GET /api/admin/ins/voting-sessions`

- **Qué hace:** Votaciones y recuentos. Lista, con filtros y paginación, los registros de votaciones (`votingSessions`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.votaciones.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de votaciones (`votingSessions`) con `total`.
- **Pantallas:** PAN-INS-21 (Votaciones y escrutinio).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1397 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-053)

<a id="API-INS-053-b"></a>
#### API-INS-053-b · `POST /api/admin/ins/voting-sessions`

- **Qué hace:** Votaciones y recuentos. Da de alta un registro de votaciones (`votingSessions`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.votaciones.gestionar`.
- **Recibe:** los datos de votaciones (`votingSessions`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de votaciones (`votingSessions`).
- **Pantallas:** PAN-INS-21 (Votaciones y escrutinio).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1397 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-053-b)

<a id="API-INS-053-c"></a>
#### API-INS-053-c · `PATCH /api/admin/ins/voting-sessions`

- **Qué hace:** Votaciones y recuentos. Modifica algunos campos de un registro de votaciones (`votingSessions`) (solo los enviados).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.votaciones.gestionar`.
- **Recibe:** solo los campos a cambiar de votaciones (`votingSessions`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de votaciones (`votingSessions`).
- **Pantallas:** PAN-INS-21 (Votaciones y escrutinio).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1397 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-053-c)

<a id="API-INS-054"></a>
#### API-INS-054 · `GET /api/admin/ins/fees`

- **Qué hace:** Definiciones de honorarios. Lista, con filtros y paginación, los registros de retribuciones a consejeros (`institutionalFees`).
- **Para qué sirve:** RF-INS-030: Definir qué conceptos/productos o servicios del catálogo generan capital y en qué proporción (por producto o por servicio). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.honorarios.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de retribuciones a consejeros (`institutionalFees`) con `total`.
- **Pantallas:** PAN-INS-25 (Honorarios institucionales).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1398 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-054)

<a id="API-INS-054-b"></a>
#### API-INS-054-b · `POST /api/admin/ins/fees`

- **Qué hace:** Definiciones de honorarios. Da de alta un registro de retribuciones a consejeros (`institutionalFees`).
- **Para qué sirve:** RF-INS-030: Definir qué conceptos/productos o servicios del catálogo generan capital y en qué proporción (por producto o por servicio). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.honorarios.gestionar`.
- **Recibe:** los datos de retribuciones a consejeros (`institutionalFees`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de retribuciones a consejeros (`institutionalFees`).
- **Pantallas:** PAN-INS-25 (Honorarios institucionales).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1398 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-054-b)

<a id="API-INS-054-c"></a>
#### API-INS-054-c · `PATCH /api/admin/ins/fees`

- **Qué hace:** Definiciones de honorarios. Modifica algunos campos de un registro de retribuciones a consejeros (`institutionalFees`) (solo los enviados).
- **Para qué sirve:** RF-INS-030: Definir qué conceptos/productos o servicios del catálogo generan capital y en qué proporción (por producto o por servicio). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.honorarios.gestionar`.
- **Recibe:** solo los campos a cambiar de retribuciones a consejeros (`institutionalFees`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de retribuciones a consejeros (`institutionalFees`).
- **Pantallas:** PAN-INS-25 (Honorarios institucionales).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1398 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-054-c)

<a id="API-INS-055"></a>
#### API-INS-055 · `POST /api/admin/ins/fee-settlements/run`

- **Qué hace:** Liquidar período (job) Ejecuta sobre liquidación de retribuciones (`institutionalFeeSettlements`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-INS-096: Liquidar honorarios por período y mandato vigente, generando obligación a pagar (orden de pago M14) con retenciones de M06 y asiento M15; no se procesan como sueldo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.honorarios.gestionar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-INS-25 (Honorarios institucionales).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1399 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-055)

<a id="API-INS-056"></a>
#### API-INS-056 · `POST /api/admin/ins/fee-settlements/{id}/transitions`

- **Qué hace:** Aprobar, anular. Cambia de estado (transición) un registro de liquidación de retribuciones (`institutionalFeeSettlements`).
- **Para qué sirve:** RF-INS-095: Registrar la retribución aprobada por asamblea: cargos alcanzados, importe o fórmula, periodicidad, vigencia y resolución. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.honorarios.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1400 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-056)

<a id="API-INS-057"></a>
#### API-INS-057 · `GET /api/admin/ins/inaes-reports`

- **Qué hace:** Generar, validar, registrar presentación y acuse. Lista, con filtros y paginación, los registros de presentaciones INAES (`inaesReports`).
- **Para qué sirve:** RF-INS-028: Catálogo de informes INAES (padrón, registro, altas/bajas, nómina de autoridades, documentación de asamblea, otros) con período, vencimiento, generación, validación, presentación y acuse. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.inaes.exportar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de presentaciones INAES (`inaesReports`) con `total`.
- **Pantallas:** PAN-INS-26 (Presentaciones INAES).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1401 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-057)

<a id="API-INS-057-b"></a>
#### API-INS-057-b · `POST /api/admin/ins/inaes-reports`

- **Qué hace:** Generar, validar, registrar presentación y acuse. Da de alta un registro de presentaciones INAES (`inaesReports`).
- **Para qué sirve:** RF-INS-028: Catálogo de informes INAES (padrón, registro, altas/bajas, nómina de autoridades, documentación de asamblea, otros) con período, vencimiento, generación, validación, presentación y acuse. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.inaes.exportar`.
- **Recibe:** los datos de presentaciones INAES (`inaesReports`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de presentaciones INAES (`inaesReports`).
- **Pantallas:** PAN-INS-26 (Presentaciones INAES).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1401 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-057-b)

<a id="API-INS-058"></a>
#### API-INS-058 · `GET /api/admin/ins/inaes-categories`

- **Qué hace:** Categorías INAES. Lista, con filtros y paginación, los registros de categorías INAES (`inaesCategories`).
- **Para qué sirve:** RF-INS-019: Asignar categoría INAES a cada membresía cuando el informe la requiera. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.config.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de categorías INAES (`inaesCategories`) con `total`.
- **Pantallas:** PAN-INS-06 (Rubros, reglas de suscripción y valor de cuota social), PAN-INS-28 (Configuración institucional), PAN-INS-29 (Distritos electorales).
- **Ola:** O2 · **Fuente:** M17 §11. API, línea 1402 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-058)

<a id="API-INS-058-b"></a>
#### API-INS-058-b · `POST /api/admin/ins/inaes-categories`

- **Qué hace:** Categorías INAES. Da de alta un registro de categorías INAES (`inaesCategories`).
- **Para qué sirve:** RF-INS-019: Asignar categoría INAES a cada membresía cuando el informe la requiera. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.config.configurar`.
- **Recibe:** los datos de categorías INAES (`inaesCategories`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de categorías INAES (`inaesCategories`).
- **Pantallas:** PAN-INS-06 (Rubros, reglas de suscripción y valor de cuota social), PAN-INS-28 (Configuración institucional), PAN-INS-29 (Distritos electorales).
- **Ola:** O2 · **Fuente:** M17 §11. API, línea 1402 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-058-b)

<a id="API-INS-058-c"></a>
#### API-INS-058-c · `PATCH /api/admin/ins/inaes-categories`

- **Qué hace:** Categorías INAES. Modifica algunos campos de un registro de categorías INAES (`inaesCategories`) (solo los enviados).
- **Para qué sirve:** RF-INS-019: Asignar categoría INAES a cada membresía cuando el informe la requiera. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.config.configurar`.
- **Recibe:** solo los campos a cambiar de categorías INAES (`inaesCategories`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de categorías INAES (`inaesCategories`).
- **Pantallas:** PAN-INS-06 (Rubros, reglas de suscripción y valor de cuota social), PAN-INS-28 (Configuración institucional), PAN-INS-29 (Distritos electorales).
- **Ola:** O2 · **Fuente:** M17 §11. API, línea 1402 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-058-c)

<a id="API-INS-059"></a>
#### API-INS-059 · `POST /api/admin/ins/credentials/batch`

- **Qué hace:** Credenciales masivas (job) Procesa en lote sobre credenciales del asociado (`memberCredentials`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-INS-014: Emitir la credencial de asociado (individual o masiva desde padrón), impresa y digital en PWA, con número, nombre, antigüedad, foto opcional y QR verificable de validez. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.credenciales.emitir`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-INS-27 (Credenciales).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1403 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-059)

<a id="API-INS-060"></a>
#### API-INS-060 · `GET /api/admin/ins/districts`

- **Qué hace:** Distritos. Lista, con filtros y paginación, los registros de distritos electorales (`electoralDistricts`).
- **Para qué sirve:** RF-INS-007: Registrar el representante de asamblea / delegado y el distrito electoral del asociado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.config.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de distritos electorales (`electoralDistricts`) con `total`.
- **Pantallas:** PAN-INS-06 (Rubros, reglas de suscripción y valor de cuota social), PAN-INS-28 (Configuración institucional), PAN-INS-29 (Distritos electorales).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1404 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-060)

<a id="API-INS-060-b"></a>
#### API-INS-060-b · `POST /api/admin/ins/districts`

- **Qué hace:** Distritos. Da de alta un registro de distritos electorales (`electoralDistricts`).
- **Para qué sirve:** RF-INS-007: Registrar el representante de asamblea / delegado y el distrito electoral del asociado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.config.configurar`.
- **Recibe:** los datos de distritos electorales (`electoralDistricts`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de distritos electorales (`electoralDistricts`).
- **Pantallas:** PAN-INS-06 (Rubros, reglas de suscripción y valor de cuota social), PAN-INS-28 (Configuración institucional), PAN-INS-29 (Distritos electorales).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1404 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-060-b)

<a id="API-INS-060-c"></a>
#### API-INS-060-c · `PATCH /api/admin/ins/districts`

- **Qué hace:** Distritos. Modifica algunos campos de un registro de distritos electorales (`electoralDistricts`) (solo los enviados).
- **Para qué sirve:** RF-INS-007: Registrar el representante de asamblea / delegado y el distrito electoral del asociado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.config.configurar`.
- **Recibe:** solo los campos a cambiar de distritos electorales (`electoralDistricts`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de distritos electorales (`electoralDistricts`).
- **Pantallas:** PAN-INS-06 (Rubros, reglas de suscripción y valor de cuota social), PAN-INS-28 (Configuración institucional), PAN-INS-29 (Distritos electorales).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1404 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-060-c)

<a id="API-INS-061"></a>
#### API-INS-061 · `GET /api/admin/ins/settings`

- **Qué hace:** Parámetros del módulo. Consulta `settings`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.config.configurar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INS-06 (Rubros, reglas de suscripción y valor de cuota social), PAN-INS-28 (Configuración institucional), PAN-INS-29 (Distritos electorales).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1405 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-061)

<a id="API-INS-061-b"></a>
#### API-INS-061-b · `PUT /api/admin/ins/settings`

- **Qué hace:** Parámetros del módulo. Reemplaza o configura `settings`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.config.configurar`.
- **Recibe:** un cuerpo JSON cuya estructura detalla el anexo; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INS-06 (Rubros, reglas de suscripción y valor de cuota social), PAN-INS-28 (Configuración institucional), PAN-INS-29 (Distritos electorales).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1405 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-061-b)

<a id="API-INS-062"></a>
#### API-INS-062 · `GET /api/admin/ins/reports/{reportId}`

- **Qué hace:** Reportes de §15 (?format=json/csv/xlsx/pdf) Obtiene el detalle de un registro de presentaciones INAES (`inaesReports`).
- **Para qué sirve:** RF-INS-023: Preparar el libro para rubricación o registro digital según el formato que exija el INAES. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ins.reportes.ver`.
- **Recibe:** en la ruta `reportId`.
- **Devuelve:** 200: el registro de presentaciones INAES (`inaesReports`).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1406 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-062)

<a id="API-INS-063"></a>
#### API-INS-063 · `GET /api/ins/me`

- **Qué hace:** Mi asociación (PWA) Consulta `me`.
- **Para qué sirve:** RF-INS-079: Filtros del padrón: fecha límite de alta, deuda de capital con umbral y fecha, deuda anterior, sin factura desde, servicio desde/hasta, baja posterior al corte, más de N facturas impagas (con o sin marca), distrito, estado del…
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `ins.mi.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INS-30 (Mi asociación (componente embebido en PAN-POR-102)), PAN-INS-31 (Convocatorias y padrón propio), PAN-POR-102 (Mi asociación (tarjeta que embebe PAN-INS-30)).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1407 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-063)

<a id="API-INS-064"></a>
#### API-INS-064 · `GET /api/ins/me/capital-statement`

- **Qué hace:** Mi estado de capital. Consulta `capital-statement`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `ins.mi.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INS-30 (Mi asociación (componente embebido en PAN-POR-102)), PAN-INS-31 (Convocatorias y padrón propio), PAN-POR-102 (Mi asociación (tarjeta que embebe PAN-INS-30)).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1408 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-064)

<a id="API-INS-065"></a>
#### API-INS-065 · `GET /api/ins/me/credential`

- **Qué hace:** Credencial digital (QR rotativo) Consulta `credential`.
- **Para qué sirve:** RF-INS-014: Emitir la credencial de asociado (individual o masiva desde padrón), impresa y digital en PWA, con número, nombre, antigüedad, foto opcional y QR verificable de validez. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `ins.mi.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INS-30 (Mi asociación (componente embebido en PAN-POR-102)), PAN-INS-31 (Convocatorias y padrón propio), PAN-POR-102 (Mi asociación (tarjeta que embebe PAN-INS-30)).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1409 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-065)

<a id="API-INS-066"></a>
#### API-INS-066 · `POST /api/ins/me/requests`

- **Qué hace:** Solicitud de ingreso, egreso, poder o reclamo de padrón. Registra un nuevo elemento u operación en `requests`.
- **Para qué sirve:** RF-INS-106: Portal del asociado (renderizado por M19): estado, número, antigüedad, capital, credencial digital, convocatorias, documentos públicos, padrón propio, solicitudes de ingreso, egreso, poder y reclamo de padrón. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `ins.mi.solicitar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-INS-32 (Solicitud de ingreso).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1410 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-066)

<a id="API-INS-067"></a>
#### API-INS-067 · `GET /api/ins/me/meetings`

- **Qué hace:** Convocatorias y habilitación propia. Lista, con filtros y paginación, los registros de reuniones y asambleas (`meetings`).
- **Para qué sirve:** RF-INS-075: Permisos por reunión: usuarios habilitados a ver o editar una reunión reservada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `ins.mi.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de reuniones y asambleas (`meetings`) con `total`.
- **Pantallas:** PAN-INS-30 (Mi asociación (componente embebido en PAN-POR-102)), PAN-INS-31 (Convocatorias y padrón propio), PAN-POR-102 (Mi asociación (tarjeta que embebe PAN-INS-30)).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1411 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-067)

<a id="API-INS-068"></a>
#### API-INS-068 · `GET /api/public/{tenantSlug}/ins/assemblies`

- **Qué hace:** Convocatorias públicas. Consulta `assemblies`.
- **Para qué sirve:** RF-INS-106: Portal del asociado (renderizado por M19): estado, número, antigüedad, capital, credencial digital, convocatorias, documentos públicos, padrón propio, solicitudes de ingreso, egreso, poder y reclamo de padrón. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O10 · **Fuente:** M17 §11. API, línea 1412 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-068)

<a id="API-INS-069"></a>
#### API-INS-069 · `GET /api/v1/ext/ins/memberships/{memberNumber}/status`

- **Qué hace:** Verificación externa de condición de asociado (sin datos personales) Consulta «status» de un registro de relación institucional del asociado (`associateMemberships`).
- **Para qué sirve:** RF-INS-001: Registrar la relación institucional de una persona del tenant como entidad propia, distinta de persona, titular, cliente, pagador, usuario y empleado. Una persona tiene a lo sumo una membresía vigente por tenant. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); permiso `ins.status.ver`.
- **Recibe:** en la ruta `memberNumber`.
- **Devuelve:** 200: el registro de relación institucional del asociado (`associateMemberships`).
- **Ola:** O2 · **Fuente:** M17 §11. API, línea 1413 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-069)

<a id="API-INS-070"></a>
#### API-INS-070 · `GET /api/platform/ins/inaes-categories`

- **Qué hace:** Catálogo base de categorías INAES. Lista, con filtros y paginación, los registros de categorías INAES (`inaesCategories`).
- **Para qué sirve:** RF-INS-019: Asignar categoría INAES a cada membresía cuando el informe la requiera. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `ins.catalogosBase.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de categorías INAES (`inaesCategories`) con `total`.
- **Ola:** O2 · **Fuente:** M17 §11. API, línea 1414 · [Ver en Swagger](../18-swagger/index.html?api=m17-ins#/API/API-INS-070)
