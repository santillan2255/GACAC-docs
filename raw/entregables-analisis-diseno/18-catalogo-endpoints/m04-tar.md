# Catálogo de endpoints · M04 · Tarifas y motor de cálculo

Parte del [catálogo de endpoints](../18-catalogo-endpoints.md) (artefacto 7.1). Generado el 05-11-2026 con `_trabajo/gen_18_catalogo_endpoints.py` a partir de `18-openapi/`; no se edita a mano.

## Para qué sirve esta API

Calcular de forma reproducible, explicable y auditable el importe de cada concepto que se liquida a un contrato (suministro/conexión) de cualquier servicio de la cooperativa —energía, agua, cloaca, gas, Internet, TV, telefonía fija y móvil, sepelio, salud, cuotas de obras y vivienda, productos y cargos por evento— a partir de:

1. una cantidad con fuente identificable (consumo aprobado por M03, cantidad contratada, cantidad de adherentes, datos catastrales del inmueble, llamadas tasadas, cuotas de un plan, unidades de un producto),
2. una versión tarifaria (cuadro tarifario) aprobada con doble firma, con vigencia efectiva y respaldo normativo,
3. un conjunto de reglas declarativas versionadas (cargos, recargos, bonificaciones, subsidios, tarifa social, promociones, tasas de terceros, excepciones por grupo) con condición, acción, vigencia, prioridad y compatibilidad,
4. y la condición fiscal del destinatario, cuyo cálculo invoca a M06.

Detalle completo en el anexo M04, sección 1. Contrato navegable: [Swagger](../18-swagger/index.html?api=m04-tar).

| Dato | Valor |
|---|---|
| Endpoints | 111 |
| Por método | GET 37, PATCH 20, POST 54 |
| Grupos funcionales | 1 |
| Con requisito citado en el anexo | 3 |
| Con requisito inferido (a confirmar) | 104 |
| Sin requisito identificable | 4 |

## Grupos funcionales

| Grupo | Endpoints | Qué agrupa (primeros endpoints) |
|---|---|---|
| [API](#grupo-1) | 111 | Listar versiones con filtros.; Crear versión en borrador.; Detalle con categorías, filas, adherentes, precios.… |

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

111 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-TAR-001](#API-TAR-001) | GET | `/api/admin/tar/tariff-schedules` | Listar versiones con filtros. |
| [API-TAR-002](#API-TAR-002) | POST | `/api/admin/tar/tariff-schedules` | Crear versión en borrador. |
| [API-TAR-003](#API-TAR-003) | GET | `/api/admin/tar/tariff-schedules/{id}` | Detalle con categorías, filas, adherentes, precios. |
| [API-TAR-004](#API-TAR-004) | PATCH | `/api/admin/tar/tariff-schedules/{id}` | Editar borrador (cabecera y contenido por clave). |
| [API-TAR-005](#API-TAR-005) | POST | `/api/admin/tar/tariff-schedules/{id}/copy` | Copiar a nuevo borrador (completo o parcial). |
| [API-TAR-006](#API-TAR-006) | GET | `/api/admin/tar/tariff-schedules/{id}/diff` | Diferencias campo a campo. |
| [API-TAR-007](#API-TAR-007) | POST | `/api/admin/tar/tariff-schedules/{id}/validate` | Validación completa sin cambiar estado. |
| [API-TAR-008](#API-TAR-008) | POST | `/api/admin/tar/tariff-schedules/{id}/submit` | Enviar a aprobación. |
| [API-TAR-009](#API-TAR-009) | POST | `/api/admin/tar/tariff-schedules/{id}/withdraw` | Retirar envío sin firmas. |
| [API-TAR-010](#API-TAR-010) | POST | `/api/admin/tar/tariff-schedules/{id}/approve` | Firma de aprobación. |
| [API-TAR-011](#API-TAR-011) | POST | `/api/admin/tar/tariff-schedules/{id}/reject` | Rechazo con motivo. |
| [API-TAR-012](#API-TAR-012) | POST | `/api/admin/tar/tariff-schedules/{id}/publish` | Publicar (programada o inmediata). |
| [API-TAR-013](#API-TAR-013) | POST | `/api/admin/tar/tariff-schedules/{id}/unpublish` | Volver de scheduled a approved (sin uso). |
| [API-TAR-014](#API-TAR-014) | POST | `/api/admin/tar/tariff-schedules/{id}/close` | Cierre sin reemplazo. |
| [API-TAR-015](#API-TAR-015) | POST | `/api/admin/tar/tariff-schedules/mass-update` | Generar borrador con actualización masiva (vista previa con dryRun). |
| [API-TAR-016](#API-TAR-016) | POST | `/api/admin/tar/tariff-schedules/import` | Importar planilla (asíncrono). |
| [API-TAR-017](#API-TAR-017) | GET | `/api/admin/tar/tariff-schedules/{id}/export` | Exportar Excel/PDF. |
| [API-TAR-018](#API-TAR-018) | POST | `/api/admin/tar/tariff-schedules/{id}/normative-documents` | Vincular documento normativo (PDF). |
| [API-TAR-019](#API-TAR-019) | GET | `/api/admin/tar/normative-documents` | ABM de documentos normativos. |
| [API-TAR-019-b](#API-TAR-019-b) | POST | `/api/admin/tar/normative-documents` | ABM de documentos normativos. |
| [API-TAR-019-c](#API-TAR-019-c) | PATCH | `/api/admin/tar/normative-documents` | ABM de documentos normativos. |
| [API-TAR-020](#API-TAR-020) | GET | `/api/admin/tar/services/{serviceId}/settings` | Configuración tarifaria del servicio (versionada). |
| [API-TAR-020-b](#API-TAR-020-b) | PATCH | `/api/admin/tar/services/{serviceId}/settings` | Configuración tarifaria del servicio (versionada). |
| [API-TAR-021](#API-TAR-021) | GET | `/api/admin/tar/charge-rules` | Listar reglas. |
| [API-TAR-022](#API-TAR-022) | POST | `/api/admin/tar/charge-rules` | Crear regla. |
| [API-TAR-023](#API-TAR-023) | PATCH | `/api/admin/tar/charge-rules/{id}` | Editar borrador de regla. |
| [API-TAR-024](#API-TAR-024) | POST | `/api/admin/tar/charge-rules/{id}/clone` | Clonar. |
| [API-TAR-025](#API-TAR-025) | POST | `/api/admin/tar/charge-rules/{id}/reorder` | Subir/bajar dentro de fase y servicio. |
| [API-TAR-026](#API-TAR-026) | POST | `/api/admin/tar/charge-rules/{id}/submit` | Ciclo de aprobación de regla. |
| [API-TAR-026-b](#API-TAR-026-b) | POST | `/api/admin/tar/charge-rules/{id}/approve` | Ciclo de aprobación de regla. |
| [API-TAR-026-c](#API-TAR-026-c) | POST | `/api/admin/tar/charge-rules/{id}/reject` | Ciclo de aprobación de regla. |
| [API-TAR-026-d](#API-TAR-026-d) | POST | `/api/admin/tar/charge-rules/{id}/publish` | Ciclo de aprobación de regla. |
| [API-TAR-027](#API-TAR-027) | POST | `/api/admin/tar/formulas/compile` | Compilar y validar fórmula GFL (AST, dependencias, errores). |
| [API-TAR-028](#API-TAR-028) | POST | `/api/admin/tar/formulas/test` | Evaluar regla con contratos reales sin persistir. |
| [API-TAR-029](#API-TAR-029) | GET | `/api/admin/tar/functions` | Catálogo de funciones y variables. |
| [API-TAR-030](#API-TAR-030) | GET | `/api/admin/tar/gas/calorific-factors` | Factores de gas. |
| [API-TAR-030-b](#API-TAR-030-b) | POST | `/api/admin/tar/gas/calorific-factors` | Factores de gas. |
| [API-TAR-030-c](#API-TAR-030-c) | PATCH | `/api/admin/tar/gas/calorific-factors` | Factores de gas. |
| [API-TAR-031](#API-TAR-031) | GET | `/api/admin/tar/category-coefficients` | Coeficientes por categoría. |
| [API-TAR-031-b](#API-TAR-031-b) | POST | `/api/admin/tar/category-coefficients` | Coeficientes por categoría. |
| [API-TAR-031-c](#API-TAR-031-c) | PATCH | `/api/admin/tar/category-coefficients` | Coeficientes por categoría. |
| [API-TAR-032](#API-TAR-032) | GET | `/api/admin/tar/event-charges` | Cargos por evento y bonificaciones. |
| [API-TAR-032-b](#API-TAR-032-b) | POST | `/api/admin/tar/event-charges` | Cargos por evento y bonificaciones. |
| [API-TAR-032-c](#API-TAR-032-c) | PATCH | `/api/admin/tar/event-charges` | Cargos por evento y bonificaciones. |
| [API-TAR-033](#API-TAR-033) | GET | `/api/admin/tar/benefit-groups` | Grupos de beneficio y miembros. |
| [API-TAR-033-b](#API-TAR-033-b) | POST | `/api/admin/tar/benefit-groups` | Grupos de beneficio y miembros. |
| [API-TAR-033-c](#API-TAR-033-c) | PATCH | `/api/admin/tar/benefit-groups` | Grupos de beneficio y miembros. |
| [API-TAR-033-d](#API-TAR-033-d) | POST | `/api/admin/tar/benefit-groups/{id}/members` | Grupos de beneficio y miembros. |
| [API-TAR-034](#API-TAR-034) | GET | `/api/admin/tar/subsidies/regimes` | Regímenes de subsidio. |
| [API-TAR-034-b](#API-TAR-034-b) | POST | `/api/admin/tar/subsidies/regimes` | Regímenes de subsidio. |
| [API-TAR-034-c](#API-TAR-034-c) | PATCH | `/api/admin/tar/subsidies/regimes` | Regímenes de subsidio. |
| [API-TAR-035](#API-TAR-035) | POST | `/api/admin/tar/subsidies/roll-imports` | Subir padrón (asíncrono). |
| [API-TAR-036](#API-TAR-036) | POST | `/api/admin/tar/subsidies/roll-imports/{id}/confirm` | Confirmar padrón validado. |
| [API-TAR-037](#API-TAR-037) | GET | `/api/admin/tar/subsidies/enrollments` | Inscripciones por suministro. |
| [API-TAR-037-b](#API-TAR-037-b) | PATCH | `/api/admin/tar/subsidies/enrollments` | Inscripciones por suministro. |
| [API-TAR-038](#API-TAR-038) | POST | `/api/admin/tar/subsidies/recategorize` | Recategorización masiva (preview/aplicar). |
| [API-TAR-039](#API-TAR-039) | POST | `/api/admin/tar/subsidies/export` | Exportación al organismo (asíncrono). |
| [API-TAR-040](#API-TAR-040) | GET | `/api/admin/tar/promotions` | Promociones. |
| [API-TAR-040-b](#API-TAR-040-b) | POST | `/api/admin/tar/promotions` | Promociones. |
| [API-TAR-040-c](#API-TAR-040-c) | PATCH | `/api/admin/tar/promotions` | Promociones. |
| [API-TAR-041](#API-TAR-041) | POST | `/api/admin/tar/promotions/{id}/assignments` | Asignar a contrato. |
| [API-TAR-042](#API-TAR-042) | POST | `/api/admin/tar/promotions/assignments/{id}/cancel` | Cancelar asignación. |
| [API-TAR-043](#API-TAR-043) | POST | `/api/admin/tar/simulations` | Simulación individual (síncrona) o masiva (asíncrona, devuelve runId). |
| [API-TAR-044](#API-TAR-044) | GET | `/api/admin/tar/simulations/{id}` | Estado, resumen y detalle paginado. |
| [API-TAR-044-b](#API-TAR-044-b) | GET | `/api/admin/tar/simulations/{id}/results` | Estado, resumen y detalle paginado. |
| [API-TAR-045](#API-TAR-045) | POST | `/api/admin/tar/simulations/{id}/cancel` | Cancelar corrida. |
| [API-TAR-046](#API-TAR-046) | GET | `/api/admin/tar/simulations/{id}/export` | Exportar resumen/detalle. |
| [API-TAR-047](#API-TAR-047) | GET | `/api/admin/tar/calculations/{id}` | Cálculo con traza. |
| [API-TAR-048](#API-TAR-048) | POST | `/api/admin/tar/calculations/{id}/replay` | Recalcular desde la instantánea y comparar hash. |
| [API-TAR-049](#API-TAR-049) | POST | `/api/admin/tar/retroactive-diffs` | Calcular diferencias retroactivas (asíncrono). |
| [API-TAR-050](#API-TAR-050) | POST | `/api/admin/tar/retroactive-diffs/{id}/approve` | Aprobar (firma) o rechazar; al completar firmas pide ajustes a M05. |
| [API-TAR-050-b](#API-TAR-050-b) | POST | `/api/admin/tar/retroactive-diffs/{id}/reject` | Aprobar (firma) o rechazar; al completar firmas pide ajustes a M05. |
| [API-TAR-051](#API-TAR-051) | GET | `/api/admin/tar/phone/rate-plans` | Configuración de tasación. |
| [API-TAR-051-b](#API-TAR-051-b) | POST | `/api/admin/tar/phone/rate-plans` | Configuración de tasación. |
| [API-TAR-051-c](#API-TAR-051-c) | PATCH | `/api/admin/tar/phone/rate-plans` | Configuración de tasación. |
| [API-TAR-051-d](#API-TAR-051-d) | GET | `/api/admin/tar/phone/time-bands` | Configuración de tasación. |
| [API-TAR-051-e](#API-TAR-051-e) | POST | `/api/admin/tar/phone/time-bands` | Configuración de tasación. |
| [API-TAR-051-f](#API-TAR-051-f) | PATCH | `/api/admin/tar/phone/time-bands` | Configuración de tasación. |
| [API-TAR-051-g](#API-TAR-051-g) | GET | `/api/admin/tar/phone/band-assignments` | Configuración de tasación. |
| [API-TAR-051-h](#API-TAR-051-h) | POST | `/api/admin/tar/phone/band-assignments` | Configuración de tasación. |
| [API-TAR-051-i](#API-TAR-051-i) | PATCH | `/api/admin/tar/phone/band-assignments` | Configuración de tasación. |
| [API-TAR-051-j](#API-TAR-051-j) | GET | `/api/admin/tar/phone/rates` | Configuración de tasación. |
| [API-TAR-051-k](#API-TAR-051-k) | POST | `/api/admin/tar/phone/rates` | Configuración de tasación. |
| [API-TAR-051-l](#API-TAR-051-l) | PATCH | `/api/admin/tar/phone/rates` | Configuración de tasación. |
| [API-TAR-051-m](#API-TAR-051-m) | GET | `/api/admin/tar/phone/discount-plans` | Configuración de tasación. |
| [API-TAR-051-n](#API-TAR-051-n) | POST | `/api/admin/tar/phone/discount-plans` | Configuración de tasación. |
| [API-TAR-051-o](#API-TAR-051-o) | PATCH | `/api/admin/tar/phone/discount-plans` | Configuración de tasación. |
| [API-TAR-051-p](#API-TAR-051-p) | GET | `/api/admin/tar/phone/free-numbers` | Configuración de tasación. |
| [API-TAR-051-q](#API-TAR-051-q) | POST | `/api/admin/tar/phone/free-numbers` | Configuración de tasación. |
| [API-TAR-051-r](#API-TAR-051-r) | PATCH | `/api/admin/tar/phone/free-numbers` | Configuración de tasación. |
| [API-TAR-052](#API-TAR-052) | POST | `/api/admin/tar/phone/rate` | Tasar llamada hipotética o pendientes. |
| [API-TAR-053](#API-TAR-053) | POST | `/api/admin/tar/phone/rerate` | Retasación por rango (asíncrona). |
| [API-TAR-054](#API-TAR-054) | GET | `/api/admin/tar/rounding-policies` | Políticas de redondeo. |
| [API-TAR-054-b](#API-TAR-054-b) | PATCH | `/api/admin/tar/rounding-policies` | Políticas de redondeo. |
| [API-TAR-055](#API-TAR-055) | GET | `/api/admin/tar/preloaded-charges` | Cargos precargados. |
| [API-TAR-055-b](#API-TAR-055-b) | POST | `/api/admin/tar/preloaded-charges` | Cargos precargados. |
| [API-TAR-055-c](#API-TAR-055-c) | PATCH | `/api/admin/tar/preloaded-charges` | Cargos precargados. |
| [API-TAR-056](#API-TAR-056) | GET | `/api/admin/tar/bonuses/recalculation-runs` | Recálculo masivo de bonificaciones (preview/aplicar). |
| [API-TAR-056-b](#API-TAR-056-b) | POST | `/api/admin/tar/bonuses/recalculation-runs` | Recálculo masivo de bonificaciones (preview/aplicar). |
| [API-TAR-057](#API-TAR-057) | GET | `/api/admin/tar/settings` | Parámetros PRM-TAR. |
| [API-TAR-057-b](#API-TAR-057-b) | PATCH | `/api/admin/tar/settings` | Parámetros PRM-TAR. |
| [API-TAR-058](#API-TAR-058) | GET | `/api/admin/tar/approvals` | Bandeja de aprobaciones pendientes del usuario. |
| [API-TAR-059](#API-TAR-059) | GET | `/api/admin/tar/reports/{code}` | Reportes de la sección 15 (con exportación). |
| [API-TAR-060](#API-TAR-060) | GET | `/api/tar/invoices/{id}/explanation` | Explicación para el socio (solo cuentas propias). |
| [API-TAR-061](#API-TAR-061) | GET | `/api/public/{tenantSlug}/tar/tariffs` | Cuadros publicables vigentes y próximos. |
| [API-TAR-065](#API-TAR-065) | GET | `/api/platform/tar/functions` | Catálogo global de funciones y plantillas ficticias. |
| [API-TAR-065-b](#API-TAR-065-b) | POST | `/api/platform/tar/functions` | Catálogo global de funciones y plantillas ficticias. |
| [API-TAR-065-c](#API-TAR-065-c) | GET | `/api/platform/tar/templates` | Catálogo global de funciones y plantillas ficticias. |
| [API-TAR-065-d](#API-TAR-065-d) | POST | `/api/platform/tar/templates` | Catálogo global de funciones y plantillas ficticias. |
| [API-TAR-066](#API-TAR-066) | GET | `/api/tar/installment-plans` | Plan de cuotas de obra o de adquisición de derecho en solo lectura (RF-TAR-119; HUECO-OBR-03): planKind, obra/derecho, cuota actual n/N,... |
| [API-TAR-066-b](#API-TAR-066-b) | GET | `/api/admin/tar/installment-plans/{contractId}` | Plan de cuotas de obra o de adquisición de derecho en solo lectura (RF-TAR-119; HUECO-OBR-03): planKind, obra/derecho, cuota actual n/N,... |

<a id="API-TAR-001"></a>
#### API-TAR-001 · `GET /api/admin/tar/tariff-schedules`

- **Qué hace:** Listar versiones con filtros. Lista, con filtros y paginación, los registros de versión de cuadro tarifario (`tariffSchedules`).
- **Para qué sirve:** RF-TAR-101: Migrar cuadros históricos de ProCoop (CUADROS + HIS_* + tablas vivas) como versiones publicadas con vigencias reconstruidas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.cuadros.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de versión de cuadro tarifario (`tariffSchedules`) con `total`.
- **Pantallas:** PAN-TAR-01 (Listado de versiones de cuadros), PAN-TAR-02 (Editor de versión).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1810 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-001)

<a id="API-TAR-002"></a>
#### API-TAR-002 · `POST /api/admin/tar/tariff-schedules`

- **Qué hace:** Crear versión en borrador. Da de alta un registro de versión de cuadro tarifario (`tariffSchedules`).
- **Para qué sirve:** RF-TAR-001: Crear una versión tarifaria en borrador con código, nombre (por mes o por norma, ej. "ABRIL 2026", "196/2023 GAS"), alcance (servicios y opcionalmente categorías), vigencia desde/hasta y observaciones. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.cuadros.crear`.
- **Recibe:** los datos de versión de cuadro tarifario (`tariffSchedules`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de versión de cuadro tarifario (`tariffSchedules`).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1811 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-002)

<a id="API-TAR-003"></a>
#### API-TAR-003 · `GET /api/admin/tar/tariff-schedules/{id}`

- **Qué hace:** Detalle con categorías, filas, adherentes, precios. Obtiene el detalle de un registro de versión de cuadro tarifario (`tariffSchedules`).
- **Para qué sirve:** RF-TAR-024: Tarifas de adherentes por versión: servicio, categoría (0 = cualquiera), descripción, precio, edad desde/hasta, vínculo, ocupación, franquicia de N adherentes no cobrados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.cuadros.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de versión de cuadro tarifario (`tariffSchedules`).
- **Pantallas:** PAN-TAR-01 (Listado de versiones de cuadros), PAN-TAR-02 (Editor de versión).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1812 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-003)

<a id="API-TAR-004"></a>
#### API-TAR-004 · `PATCH /api/admin/tar/tariff-schedules/{id}`

- **Qué hace:** Editar borrador (cabecera y contenido por clave). Modifica algunos campos de un registro de versión de cuadro tarifario (`tariffSchedules`) (solo los enviados).
- **Para qué sirve:** RF-TAR-001: Crear una versión tarifaria en borrador con código, nombre (por mes o por norma, ej. "ABRIL 2026", "196/2023 GAS"), alcance (servicios y opcionalmente categorías), vigencia desde/hasta y observaciones. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.cuadros.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de versión de cuadro tarifario (`tariffSchedules`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de versión de cuadro tarifario (`tariffSchedules`).
- **Pantallas:** PAN-TAR-02 (Editor de versión), PAN-TAR-03 (Editor de categoría y escalones), PAN-TAR-09 (Factores de gas por período/zona/categoría) y 3 más.
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1813 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-004)

<a id="API-TAR-005"></a>
#### API-TAR-005 · `POST /api/admin/tar/tariff-schedules/{id}/copy`

- **Qué hace:** Copiar a nuevo borrador (completo o parcial). Copia un registro de versión de cuadro tarifario (`tariffSchedules`).
- **Para qué sirve:** RF-TAR-012: Listado de cuadros: descripción, código, usuario, vigencia desde y hasta, estado, alcance, norma; acciones nuevo, copiar, ver, enviar, aprobar, imprimir/exportar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.cuadros.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1814 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-005)

<a id="API-TAR-006"></a>
#### API-TAR-006 · `GET /api/admin/tar/tariff-schedules/{id}/diff`

- **Qué hace:** Diferencias campo a campo. Consulta «diff» de un registro de versión de cuadro tarifario (`tariffSchedules`).
- **Para qué sirve:** RF-TAR-002: Crear una versión copiando otra (completa o solo ciertos servicios/categorías) y mostrar diferencias contra la origen. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.cuadros.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de versión de cuadro tarifario (`tariffSchedules`).
- **Pantallas:** PAN-TAR-01 (Listado de versiones de cuadros), PAN-TAR-02 (Editor de versión).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1815 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-006)

<a id="API-TAR-007"></a>
#### API-TAR-007 · `POST /api/admin/tar/tariff-schedules/{id}/validate`

- **Qué hace:** Validación completa sin cambiar estado. Valida un registro de versión de cuadro tarifario (`tariffSchedules`).
- **Para qué sirve:** RF-TAR-002: Crear una versión copiando otra (completa o solo ciertos servicios/categorías) y mostrar diferencias contra la origen. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.cuadros.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TAR-02 (Editor de versión), PAN-TAR-03 (Editor de categoría y escalones), PAN-TAR-09 (Factores de gas por período/zona/categoría) y 3 más.
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1816 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-007)

<a id="API-TAR-008"></a>
#### API-TAR-008 · `POST /api/admin/tar/tariff-schedules/{id}/submit`

- **Qué hace:** Enviar a aprobación. Envía a revisión o presenta un registro de versión de cuadro tarifario (`tariffSchedules`).
- **Para qué sirve:** RF-TAR-012: Listado de cuadros: descripción, código, usuario, vigencia desde y hasta, estado, alcance, norma; acciones nuevo, copiar, ver, enviar, aprobar, imprimir/exportar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.cuadros.enviar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1817 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-008)

<a id="API-TAR-009"></a>
#### API-TAR-009 · `POST /api/admin/tar/tariff-schedules/{id}/withdraw`

- **Qué hace:** Retirar envío sin firmas. Retira un registro de versión de cuadro tarifario (`tariffSchedules`).
- **Para qué sirve:** RF-TAR-012: Listado de cuadros: descripción, código, usuario, vigencia desde y hasta, estado, alcance, norma; acciones nuevo, copiar, ver, enviar, aprobar, imprimir/exportar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.cuadros.enviar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1818 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-009)

<a id="API-TAR-010"></a>
#### API-TAR-010 · `POST /api/admin/tar/tariff-schedules/{id}/approve`

- **Qué hace:** Firma de aprobación. Aprueba un registro de versión de cuadro tarifario (`tariffSchedules`).
- **Para qué sirve:** RF-TAR-005: Circuito de aprobación con doble firma: quien carga envía y otro usuario aprueba; tercera firma opcional por parámetro. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.cuadros.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TAR-21 (Bandeja de aprobaciones).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1819 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-010)

<a id="API-TAR-011"></a>
#### API-TAR-011 · `POST /api/admin/tar/tariff-schedules/{id}/reject`

- **Qué hace:** Rechazo con motivo. Rechaza un registro de versión de cuadro tarifario (`tariffSchedules`).
- **Para qué sirve:** RF-TAR-011: Rechazar una versión con motivo obligatorio (vuelve a borrador) y anular una versión nunca usada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.cuadros.rechazar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1820 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-011)

<a id="API-TAR-012"></a>
#### API-TAR-012 · `POST /api/admin/tar/tariff-schedules/{id}/publish`

- **Qué hace:** Publicar (programada o inmediata). Publica un registro de versión de cuadro tarifario (`tariffSchedules`).
- **Para qué sirve:** RF-TAR-116: Crear el plan de cuotas de obra (worksInstallmentPlans) de cada beneficiario al consumir tec.levy.approved (EVT-TEC-25): un plan por obra + inmueble/contrato beneficiario con importe, cuotas, unidades por cuota y unidades… · RF-TAR-119: Exponer en solo lectura el plan de cuotas de obra (y de adquisición de derecho) de un contrato para el portal (M19, bloque "Plan de cuotas de obra" de PAN-POR-30) y atención: obra, cuota actual n/N, cuotas facturadas, saldo en…
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.cuadros.publicar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O7 · **Fuente:** M04 §11. API, línea 1821 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-012)

<a id="API-TAR-013"></a>
#### API-TAR-013 · `POST /api/admin/tar/tariff-schedules/{id}/unpublish`

- **Qué hace:** Volver de scheduled a approved (sin uso). Despublica un registro de versión de cuadro tarifario (`tariffSchedules`).
- **Para qué sirve:** RF-TAR-101: Migrar cuadros históricos de ProCoop (CUADROS + HIS_* + tablas vivas) como versiones publicadas con vigencias reconstruidas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.cuadros.publicar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1822 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-013)

<a id="API-TAR-014"></a>
#### API-TAR-014 · `POST /api/admin/tar/tariff-schedules/{id}/close`

- **Qué hace:** Cierre sin reemplazo. Cierra un registro de versión de cuadro tarifario (`tariffSchedules`).
- **Para qué sirve:** RF-TAR-101: Migrar cuadros históricos de ProCoop (CUADROS + HIS_* + tablas vivas) como versiones publicadas con vigencias reconstruidas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.cuadros.publicar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1823 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-014)

<a id="API-TAR-015"></a>
#### API-TAR-015 · `POST /api/admin/tar/tariff-schedules/mass-update`

- **Qué hace:** Generar borrador con actualización masiva (vista previa con dryRun). Registra un nuevo elemento u operación en versión de cuadro tarifario (`tariffSchedules`).
- **Para qué sirve:** RF-TAR-016: Actualización masiva de precios en borrador por porcentaje o importe, con filtros por servicio, categoría, columna de precio y tipo de fila. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.precios.actualizarMasivo`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TAR-04 (Actualización masiva de precios).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1824 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-015)

<a id="API-TAR-016"></a>
#### API-TAR-016 · `POST /api/admin/tar/tariff-schedules/import`

- **Qué hace:** Importar planilla (asíncrono). Importa sobre versión de cuadro tarifario (`tariffSchedules`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-TAR-015: Importar precios desde Excel (ExcelImportWizard: subir → preview con errores → confirmar) sobre una versión en borrador. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.precios.importar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-TAR-05 (Importar tarifas desde planilla).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1825 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-016)

<a id="API-TAR-017"></a>
#### API-TAR-017 · `GET /api/admin/tar/tariff-schedules/{id}/export`

- **Qué hace:** Exportar Excel/PDF. Descarga un archivo de versión de cuadro tarifario (`tariffSchedules`).
- **Para qué sirve:** RF-TAR-012: Listado de cuadros: descripción, código, usuario, vigencia desde y hasta, estado, alcance, norma; acciones nuevo, copiar, ver, enviar, aprobar, imprimir/exportar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.cuadros.exportar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un archivo (application/octet-stream).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1826 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-017)

<a id="API-TAR-018"></a>
#### API-TAR-018 · `POST /api/admin/tar/tariff-schedules/{id}/normative-documents`

- **Qué hace:** Vincular documento normativo (PDF). Da de alta un registro de documentos normativos tarifarios (`normativeDocuments`).
- **Para qué sirve:** RF-TAR-004: Vincular cada versión (y opcionalmente cada regla) a una o más normas: autoridad, tipo y número de norma, fecha, publicación oficial, PDF adjunto (almacenamiento privado, hash). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.normas.adjuntar`.
- **Recibe:** en la ruta `id`; los datos de documentos normativos tarifarios (`normativeDocuments`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de documentos normativos tarifarios (`normativeDocuments`).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1827 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-018)

<a id="API-TAR-019"></a>
#### API-TAR-019 · `GET /api/admin/tar/normative-documents`

- **Qué hace:** ABM de documentos normativos. Lista, con filtros y paginación, los registros de documentos normativos tarifarios (`normativeDocuments`).
- **Para qué sirve:** RF-TAR-004: Vincular cada versión (y opcionalmente cada regla) a una o más normas: autoridad, tipo y número de norma, fecha, publicación oficial, PDF adjunto (almacenamiento privado, hash). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.normas.adjuntar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de documentos normativos tarifarios (`normativeDocuments`) con `total`.
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1828 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-019)

<a id="API-TAR-019-b"></a>
#### API-TAR-019-b · `POST /api/admin/tar/normative-documents`

- **Qué hace:** ABM de documentos normativos. Da de alta un registro de documentos normativos tarifarios (`normativeDocuments`).
- **Para qué sirve:** RF-TAR-004: Vincular cada versión (y opcionalmente cada regla) a una o más normas: autoridad, tipo y número de norma, fecha, publicación oficial, PDF adjunto (almacenamiento privado, hash). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.normas.adjuntar`.
- **Recibe:** los datos de documentos normativos tarifarios (`normativeDocuments`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de documentos normativos tarifarios (`normativeDocuments`).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1828 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-019-b)

<a id="API-TAR-019-c"></a>
#### API-TAR-019-c · `PATCH /api/admin/tar/normative-documents`

- **Qué hace:** ABM de documentos normativos. Modifica algunos campos de un registro de documentos normativos tarifarios (`normativeDocuments`) (solo los enviados).
- **Para qué sirve:** RF-TAR-004: Vincular cada versión (y opcionalmente cada regla) a una o más normas: autoridad, tipo y número de norma, fecha, publicación oficial, PDF adjunto (almacenamiento privado, hash). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.normas.adjuntar`.
- **Recibe:** solo los campos a cambiar de documentos normativos tarifarios (`normativeDocuments`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de documentos normativos tarifarios (`normativeDocuments`).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1828 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-019-c)

<a id="API-TAR-020"></a>
#### API-TAR-020 · `GET /api/admin/tar/services/{serviceId}/settings`

- **Qué hace:** Configuración tarifaria del servicio (versionada). Lista, con filtros y paginación, los registros de configuración tarifaria del servicio (`tariffServiceSettings`).
- **Para qué sirve:** RF-TAR-023: Ordenar filas por código de concepto opcionalmente en la configuración del servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.cuadros.ver`.
- **Recibe:** en la ruta `serviceId`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de configuración tarifaria del servicio (`tariffServiceSettings`) con `total`.
- **Pantallas:** PAN-TAR-01 (Listado de versiones de cuadros), PAN-TAR-02 (Editor de versión).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1829 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-020)

<a id="API-TAR-020-b"></a>
#### API-TAR-020-b · `PATCH /api/admin/tar/services/{serviceId}/settings`

- **Qué hace:** Configuración tarifaria del servicio (versionada). Modifica algunos campos de un registro de configuración tarifaria del servicio (`tariffServiceSettings`) (solo los enviados).
- **Para qué sirve:** RF-TAR-023: Ordenar filas por código de concepto opcionalmente en la configuración del servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.cuadros.editar`.
- **Recibe:** en la ruta `serviceId`; solo los campos a cambiar de configuración tarifaria del servicio (`tariffServiceSettings`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de configuración tarifaria del servicio (`tariffServiceSettings`).
- **Pantallas:** PAN-TAR-02 (Editor de versión), PAN-TAR-03 (Editor de categoría y escalones), PAN-TAR-09 (Factores de gas por período/zona/categoría) y 3 más.
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1829 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-020-b)

<a id="API-TAR-021"></a>
#### API-TAR-021 · `GET /api/admin/tar/charge-rules`

- **Qué hace:** Listar reglas. Lista, con filtros y paginación, los registros de reglas declarativas (`chargeRules`).
- **Para qué sirve:** RF-TAR-030: Descuentos y recargos simples por servicio, categoría, ocupación, zona y rango de consumo, con prioridad, migrados como reglas declarativas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.reglas.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de reglas declarativas (`chargeRules`) con `total`.
- **Pantallas:** PAN-TAR-06 (Listado de reglas).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1830 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-021)

<a id="API-TAR-022"></a>
#### API-TAR-022 · `POST /api/admin/tar/charge-rules`

- **Qué hace:** Crear regla. Da de alta un registro de reglas declarativas (`chargeRules`).
- **Para qué sirve:** RF-TAR-030: Descuentos y recargos simples por servicio, categoría, ocupación, zona y rango de consumo, con prioridad, migrados como reglas declarativas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.reglas.crear`.
- **Recibe:** los datos de reglas declarativas (`chargeRules`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de reglas declarativas (`chargeRules`).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1831 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-022)

<a id="API-TAR-023"></a>
#### API-TAR-023 · `PATCH /api/admin/tar/charge-rules/{id}`

- **Qué hace:** Editar borrador de regla. Modifica algunos campos de un registro de reglas declarativas (`chargeRules`) (solo los enviados).
- **Para qué sirve:** RF-TAR-030: Descuentos y recargos simples por servicio, categoría, ocupación, zona y rango de consumo, con prioridad, migrados como reglas declarativas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.reglas.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de reglas declarativas (`chargeRules`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de reglas declarativas (`chargeRules`).
- **Pantallas:** PAN-TAR-07 (Editor de regla y fórmulas).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1832 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-023)

<a id="API-TAR-024"></a>
#### API-TAR-024 · `POST /api/admin/tar/charge-rules/{id}/clone`

- **Qué hace:** Clonar. Clona un registro de reglas declarativas (`chargeRules`).
- **Para qué sirve:** RF-TAR-018: Clonar una categoría (nombre con prefijo "(Copia) ") con sus filas, y reemplazar todas las filas de una categoría por copia de otra. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.reglas.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1833 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-024)

<a id="API-TAR-025"></a>
#### API-TAR-025 · `POST /api/admin/tar/charge-rules/{id}/reorder`

- **Qué hace:** Subir/bajar dentro de fase y servicio. Reordena un registro de reglas declarativas (`chargeRules`).
- **Para qué sirve:** RF-TAR-030: Descuentos y recargos simples por servicio, categoría, ocupación, zona y rango de consumo, con prioridad, migrados como reglas declarativas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.reglas.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TAR-07 (Editor de regla y fórmulas).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1834 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-025)

<a id="API-TAR-026"></a>
#### API-TAR-026 · `POST /api/admin/tar/charge-rules/{id}/submit`

- **Qué hace:** Ciclo de aprobación de regla. Envía a revisión o presenta un registro de reglas declarativas (`chargeRules`).
- **Para qué sirve:** RF-TAR-082: Promociones: código, alcance (servicio/producto/plan), beneficio, base, duración (ciclos/meses/fecha), regla de inicio, ciclo parcial, compatibilidad, elegibilidad, ventana de venta, cupo, financiamiento y aprobación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.reglas.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TAR-07 (Editor de regla y fórmulas).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1835 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-026)

<a id="API-TAR-026-b"></a>
#### API-TAR-026-b · `POST /api/admin/tar/charge-rules/{id}/approve`

- **Qué hace:** Ciclo de aprobación de regla. Aprueba un registro de reglas declarativas (`chargeRules`).
- **Para qué sirve:** RF-TAR-082: Promociones: código, alcance (servicio/producto/plan), beneficio, base, duración (ciclos/meses/fecha), regla de inicio, ciclo parcial, compatibilidad, elegibilidad, ventana de venta, cupo, financiamiento y aprobación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.reglas.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TAR-07 (Editor de regla y fórmulas).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1835 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-026-b)

<a id="API-TAR-026-c"></a>
#### API-TAR-026-c · `POST /api/admin/tar/charge-rules/{id}/reject`

- **Qué hace:** Ciclo de aprobación de regla. Rechaza un registro de reglas declarativas (`chargeRules`).
- **Para qué sirve:** RF-TAR-082: Promociones: código, alcance (servicio/producto/plan), beneficio, base, duración (ciclos/meses/fecha), regla de inicio, ciclo parcial, compatibilidad, elegibilidad, ventana de venta, cupo, financiamiento y aprobación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.reglas.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TAR-07 (Editor de regla y fórmulas).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1835 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-026-c)

<a id="API-TAR-026-d"></a>
#### API-TAR-026-d · `POST /api/admin/tar/charge-rules/{id}/publish`

- **Qué hace:** Ciclo de aprobación de regla. Publica un registro de reglas declarativas (`chargeRules`).
- **Para qué sirve:** RF-TAR-082: Promociones: código, alcance (servicio/producto/plan), beneficio, base, duración (ciclos/meses/fecha), regla de inicio, ciclo parcial, compatibilidad, elegibilidad, ventana de venta, cupo, financiamiento y aprobación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.reglas.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TAR-07 (Editor de regla y fórmulas).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1835 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-026-d)

<a id="API-TAR-027"></a>
#### API-TAR-027 · `POST /api/admin/tar/formulas/compile`

- **Qué hace:** Compilar y validar fórmula GFL (AST, dependencias, errores). Registra un nuevo elemento u operación en `compile`.
- **Para qué sirve:** RF-TAR-070: Asistente IA que propone fórmulas o reglas desde lenguaje natural; solo propone, el usuario valida y prueba. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.formulas.editar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TAR-07 (Editor de regla y fórmulas).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1836 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-027)

<a id="API-TAR-028"></a>
#### API-TAR-028 · `POST /api/admin/tar/formulas/test`

- **Qué hace:** Evaluar regla con contratos reales sin persistir. Prueba sobre `test`.
- **Para qué sirve:** RF-TAR-065: Fases de evaluación por servicio y sobre el comprobante, con orden explícito. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.formulas.probar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1837 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-028)

<a id="API-TAR-029"></a>
#### API-TAR-029 · `GET /api/admin/tar/functions`

- **Qué hace:** Catálogo de funciones y variables. Lista, con filtros y paginación, los registros de funciones GFL nativas y declarativas (`formulaFunctions`).
- **Para qué sirve:** RF-TAR-068: Lenguaje de fórmulas GFL en sandbox (sección 9.4): expresiones, tipos, operadores, funciones del catálogo, referencias a reglas previas por código estable. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.funciones.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de funciones GFL nativas y declarativas (`formulaFunctions`) con `total`.
- **Pantallas:** PAN-TAR-08 (Catálogo de funciones y variables GFL).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1838 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-029)

<a id="API-TAR-030"></a>
#### API-TAR-030 · `GET /api/admin/tar/gas/calorific-factors`

- **Qué hace:** Factores de gas. Lista, con filtros y paginación, los registros de factores de gas por período y categoría (`gasCalorificFactors`).
- **Para qué sirve:** RF-TAR-026: Factores de corrección de gas por período (mes/año), servicio y categoría (o general), con presión y temperatura. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.cuadros.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de factores de gas por período y categoría (`gasCalorificFactors`) con `total`.
- **Pantallas:** PAN-TAR-01 (Listado de versiones de cuadros), PAN-TAR-02 (Editor de versión).
- **Ola:** O7 · **Fuente:** M04 §11. API, línea 1839 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-030)

<a id="API-TAR-030-b"></a>
#### API-TAR-030-b · `POST /api/admin/tar/gas/calorific-factors`

- **Qué hace:** Factores de gas. Da de alta un registro de factores de gas por período y categoría (`gasCalorificFactors`).
- **Para qué sirve:** RF-TAR-026: Factores de corrección de gas por período (mes/año), servicio y categoría (o general), con presión y temperatura. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.cuadros.editar`.
- **Recibe:** los datos de factores de gas por período y categoría (`gasCalorificFactors`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de factores de gas por período y categoría (`gasCalorificFactors`).
- **Pantallas:** PAN-TAR-02 (Editor de versión), PAN-TAR-03 (Editor de categoría y escalones), PAN-TAR-09 (Factores de gas por período/zona/categoría) y 3 más.
- **Ola:** O7 · **Fuente:** M04 §11. API, línea 1839 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-030-b)

<a id="API-TAR-030-c"></a>
#### API-TAR-030-c · `PATCH /api/admin/tar/gas/calorific-factors`

- **Qué hace:** Factores de gas. Modifica algunos campos de un registro de factores de gas por período y categoría (`gasCalorificFactors`) (solo los enviados).
- **Para qué sirve:** RF-TAR-026: Factores de corrección de gas por período (mes/año), servicio y categoría (o general), con presión y temperatura. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.cuadros.editar`.
- **Recibe:** solo los campos a cambiar de factores de gas por período y categoría (`gasCalorificFactors`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de factores de gas por período y categoría (`gasCalorificFactors`).
- **Pantallas:** PAN-TAR-02 (Editor de versión), PAN-TAR-03 (Editor de categoría y escalones), PAN-TAR-09 (Factores de gas por período/zona/categoría) y 3 más.
- **Ola:** O7 · **Fuente:** M04 §11. API, línea 1839 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-030-c)

<a id="API-TAR-031"></a>
#### API-TAR-031 · `GET /api/admin/tar/category-coefficients`

- **Qué hace:** Coeficientes por categoría. Lista, con filtros y paginación, los registros de coeficientes por categoría (`categoryCoefficients`).
- **Para qué sirve:** RF-TAR-025: Coeficientes por categoría y fecha (hasta 4) para cuotas de obra y ajustes. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.cuadros.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de coeficientes por categoría (`categoryCoefficients`) con `total`.
- **Pantallas:** PAN-TAR-01 (Listado de versiones de cuadros), PAN-TAR-02 (Editor de versión).
- **Ola:** O7 · **Fuente:** M04 §11. API, línea 1840 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-031)

<a id="API-TAR-031-b"></a>
#### API-TAR-031-b · `POST /api/admin/tar/category-coefficients`

- **Qué hace:** Coeficientes por categoría. Da de alta un registro de coeficientes por categoría (`categoryCoefficients`).
- **Para qué sirve:** RF-TAR-025: Coeficientes por categoría y fecha (hasta 4) para cuotas de obra y ajustes. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.cuadros.editar`.
- **Recibe:** los datos de coeficientes por categoría (`categoryCoefficients`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de coeficientes por categoría (`categoryCoefficients`).
- **Pantallas:** PAN-TAR-02 (Editor de versión), PAN-TAR-03 (Editor de categoría y escalones), PAN-TAR-09 (Factores de gas por período/zona/categoría) y 3 más.
- **Ola:** O7 · **Fuente:** M04 §11. API, línea 1840 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-031-b)

<a id="API-TAR-031-c"></a>
#### API-TAR-031-c · `PATCH /api/admin/tar/category-coefficients`

- **Qué hace:** Coeficientes por categoría. Modifica algunos campos de un registro de coeficientes por categoría (`categoryCoefficients`) (solo los enviados).
- **Para qué sirve:** RF-TAR-025: Coeficientes por categoría y fecha (hasta 4) para cuotas de obra y ajustes. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.cuadros.editar`.
- **Recibe:** solo los campos a cambiar de coeficientes por categoría (`categoryCoefficients`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de coeficientes por categoría (`categoryCoefficients`).
- **Pantallas:** PAN-TAR-02 (Editor de versión), PAN-TAR-03 (Editor de categoría y escalones), PAN-TAR-09 (Factores de gas por período/zona/categoría) y 3 más.
- **Ola:** O7 · **Fuente:** M04 §11. API, línea 1840 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-031-c)

<a id="API-TAR-032"></a>
#### API-TAR-032 · `GET /api/admin/tar/event-charges`

- **Qué hace:** Cargos por evento y bonificaciones. Lista, con filtros y paginación, los registros de cargos por evento con filtros. Disparadores equipment_not_returned (`eventCharges`).
- **Para qué sirve:** RF-TAR-115: Cargo por evento "equipo no devuelto" (ONT, decodificador u otro equipo en comodato): concepto y regla de precio por modelo o tipo de equipo en eventCharges (disparador equipment_not_returned), plazo de devolución parametrizable… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.eventos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de cargos por evento con filtros. Disparadores equipment_not_returned (`eventCharges`) con `total`.
- **Pantallas:** PAN-TAR-18 (Catálogo de cargos por evento y bonificaciones).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1841 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-032)

<a id="API-TAR-032-b"></a>
#### API-TAR-032-b · `POST /api/admin/tar/event-charges`

- **Qué hace:** Cargos por evento y bonificaciones. Da de alta un registro de cargos por evento con filtros. Disparadores equipment_not_returned (`eventCharges`).
- **Para qué sirve:** RF-TAR-115: Cargo por evento "equipo no devuelto" (ONT, decodificador u otro equipo en comodato): concepto y regla de precio por modelo o tipo de equipo en eventCharges (disparador equipment_not_returned), plazo de devolución parametrizable… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.cuadros.editar`.
- **Recibe:** los datos de cargos por evento con filtros. Disparadores equipment_not_returned (`eventCharges`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de cargos por evento con filtros. Disparadores equipment_not_returned (`eventCharges`).
- **Pantallas:** PAN-TAR-02 (Editor de versión), PAN-TAR-03 (Editor de categoría y escalones), PAN-TAR-09 (Factores de gas por período/zona/categoría) y 3 más.
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1841 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-032-b)

<a id="API-TAR-032-c"></a>
#### API-TAR-032-c · `PATCH /api/admin/tar/event-charges`

- **Qué hace:** Cargos por evento y bonificaciones. Modifica algunos campos de un registro de cargos por evento con filtros. Disparadores equipment_not_returned (`eventCharges`) (solo los enviados).
- **Para qué sirve:** RF-TAR-115: Cargo por evento "equipo no devuelto" (ONT, decodificador u otro equipo en comodato): concepto y regla de precio por modelo o tipo de equipo en eventCharges (disparador equipment_not_returned), plazo de devolución parametrizable… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.cuadros.editar`.
- **Recibe:** solo los campos a cambiar de cargos por evento con filtros. Disparadores equipment_not_returned (`eventCharges`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de cargos por evento con filtros. Disparadores equipment_not_returned (`eventCharges`).
- **Pantallas:** PAN-TAR-02 (Editor de versión), PAN-TAR-03 (Editor de categoría y escalones), PAN-TAR-09 (Factores de gas por período/zona/categoría) y 3 más.
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1841 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-032-c)

<a id="API-TAR-033"></a>
#### API-TAR-033 · `GET /api/admin/tar/benefit-groups`

- **Qué hace:** Grupos de beneficio y miembros. Lista, con filtros y paginación, los registros de grupos de beneficio tarifario (`benefitGroups`).
- **Para qué sirve:** RF-TAR-075: Grupos de excepción explícitos o por criterio, con historial de altas y bajas, vigencia y evidencia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.grupos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de grupos de beneficio tarifario (`benefitGroups`) con `total`.
- **Pantallas:** PAN-TAR-11 (Grupos de beneficio).
- **Ola:** O7 · **Fuente:** M04 §11. API, línea 1842 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-033)

<a id="API-TAR-033-b"></a>
#### API-TAR-033-b · `POST /api/admin/tar/benefit-groups`

- **Qué hace:** Grupos de beneficio y miembros. Da de alta un registro de grupos de beneficio tarifario (`benefitGroups`).
- **Para qué sirve:** RF-TAR-075: Grupos de excepción explícitos o por criterio, con historial de altas y bajas, vigencia y evidencia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.grupos.editar`.
- **Recibe:** los datos de grupos de beneficio tarifario (`benefitGroups`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de grupos de beneficio tarifario (`benefitGroups`).
- **Pantallas:** PAN-TAR-11 (Grupos de beneficio).
- **Ola:** O7 · **Fuente:** M04 §11. API, línea 1842 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-033-b)

<a id="API-TAR-033-c"></a>
#### API-TAR-033-c · `PATCH /api/admin/tar/benefit-groups`

- **Qué hace:** Grupos de beneficio y miembros. Modifica algunos campos de un registro de grupos de beneficio tarifario (`benefitGroups`) (solo los enviados).
- **Para qué sirve:** RF-TAR-075: Grupos de excepción explícitos o por criterio, con historial de altas y bajas, vigencia y evidencia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.grupos.editar`.
- **Recibe:** solo los campos a cambiar de grupos de beneficio tarifario (`benefitGroups`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de grupos de beneficio tarifario (`benefitGroups`).
- **Pantallas:** PAN-TAR-11 (Grupos de beneficio).
- **Ola:** O7 · **Fuente:** M04 §11. API, línea 1842 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-033-c)

<a id="API-TAR-033-d"></a>
#### API-TAR-033-d · `POST /api/admin/tar/benefit-groups/{id}/members`

- **Qué hace:** Grupos de beneficio y miembros. Agrega un elemento («members») a un registro de grupos de beneficio tarifario (`benefitGroups`).
- **Para qué sirve:** RF-TAR-075: Grupos de excepción explícitos o por criterio, con historial de altas y bajas, vigencia y evidencia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.grupos.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TAR-11 (Grupos de beneficio).
- **Ola:** O7 · **Fuente:** M04 §11. API, línea 1842 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-033-d)

<a id="API-TAR-034"></a>
#### API-TAR-034 · `GET /api/admin/tar/subsidies/regimes`

- **Qué hace:** Regímenes de subsidio. Lista, con filtros y paginación, los registros de regímenes de subsidio (`subsidyRegimes`).
- **Para qué sirve:** RF-TAR-078: Regímenes de subsidio versionados (componente, bloques, porcentajes, cronograma, categorías con y sin subsidio). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.subsidios.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de regímenes de subsidio (`subsidyRegimes`) con `total`.
- **Pantallas:** PAN-TAR-12 (Regímenes, padrones e inscripciones).
- **Ola:** O7 · **Fuente:** M04 §11. API, línea 1843 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-034)

<a id="API-TAR-034-b"></a>
#### API-TAR-034-b · `POST /api/admin/tar/subsidies/regimes`

- **Qué hace:** Regímenes de subsidio. Da de alta un registro de regímenes de subsidio (`subsidyRegimes`).
- **Para qué sirve:** RF-TAR-078: Regímenes de subsidio versionados (componente, bloques, porcentajes, cronograma, categorías con y sin subsidio). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.subsidios.configurar`.
- **Recibe:** los datos de regímenes de subsidio (`subsidyRegimes`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de regímenes de subsidio (`subsidyRegimes`).
- **Ola:** O7 · **Fuente:** M04 §11. API, línea 1843 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-034-b)

<a id="API-TAR-034-c"></a>
#### API-TAR-034-c · `PATCH /api/admin/tar/subsidies/regimes`

- **Qué hace:** Regímenes de subsidio. Modifica algunos campos de un registro de regímenes de subsidio (`subsidyRegimes`) (solo los enviados).
- **Para qué sirve:** RF-TAR-078: Regímenes de subsidio versionados (componente, bloques, porcentajes, cronograma, categorías con y sin subsidio). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.subsidios.configurar`.
- **Recibe:** solo los campos a cambiar de regímenes de subsidio (`subsidyRegimes`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de regímenes de subsidio (`subsidyRegimes`).
- **Ola:** O7 · **Fuente:** M04 §11. API, línea 1843 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-034-c)

<a id="API-TAR-035"></a>
#### API-TAR-035 · `POST /api/admin/tar/subsidies/roll-imports`

- **Qué hace:** Subir padrón (asíncrono). Registra un nuevo elemento u operación en padrones de subsidio importados (`subsidyRollImports`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-TAR-015: Importar precios desde Excel (ExcelImportWizard: subir → preview con errores → confirmar) sobre una versión en borrador. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.padrones.importar`.
- **Recibe:** los datos de padrones de subsidio importados (`subsidyRollImports`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Ola:** O7 · **Fuente:** M04 §11. API, línea 1844 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-035)

<a id="API-TAR-036"></a>
#### API-TAR-036 · `POST /api/admin/tar/subsidies/roll-imports/{id}/confirm`

- **Qué hace:** Confirmar padrón validado. Confirma un registro de padrones de subsidio importados (`subsidyRollImports`).
- **Para qué sirve:** RF-TAR-079: Importar padrones de beneficiarios (Excel/TXT) por NIS, DNI/CUIT o cuenta, con validación, preview, coincidencias, no coincidencias y duplicados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.padrones.confirmar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O7 · **Fuente:** M04 §11. API, línea 1845 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-036)

<a id="API-TAR-037"></a>
#### API-TAR-037 · `GET /api/admin/tar/subsidies/enrollments`

- **Qué hace:** Inscripciones por suministro. Lista, con filtros y paginación, los registros de inscripciones a subsidio (`subsidyEnrollments`).
- **Para qué sirve:** RF-TAR-077: Personas subsidiadas y bonificadas: diferenciar beneficio por suministro/ubicación de condición general de la persona. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.subsidios.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de inscripciones a subsidio (`subsidyEnrollments`) con `total`.
- **Pantallas:** PAN-TAR-12 (Regímenes, padrones e inscripciones).
- **Ola:** O7 · **Fuente:** M04 §11. API, línea 1846 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-037)

<a id="API-TAR-037-b"></a>
#### API-TAR-037-b · `PATCH /api/admin/tar/subsidies/enrollments`

- **Qué hace:** Inscripciones por suministro. Modifica algunos campos de un registro de inscripciones a subsidio (`subsidyEnrollments`) (solo los enviados).
- **Para qué sirve:** RF-TAR-077: Personas subsidiadas y bonificadas: diferenciar beneficio por suministro/ubicación de condición general de la persona. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.inscripciones.editar`.
- **Recibe:** solo los campos a cambiar de inscripciones a subsidio (`subsidyEnrollments`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de inscripciones a subsidio (`subsidyEnrollments`).
- **Ola:** O7 · **Fuente:** M04 §11. API, línea 1846 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-037-b)

<a id="API-TAR-038"></a>
#### API-TAR-038 · `POST /api/admin/tar/subsidies/recategorize`

- **Qué hace:** Recategorización masiva (preview/aplicar). Registra un nuevo elemento u operación en `recategorize`.
- **Para qué sirve:** RF-TAR-111: Recalcular masivamente bonificaciones de unidades por contrato (tabla de trabajo) con preview. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.padrones.recategorizar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O7 · **Fuente:** M04 §11. API, línea 1847 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-038)

<a id="API-TAR-039"></a>
#### API-TAR-039 · `POST /api/admin/tar/subsidies/export`

- **Qué hace:** Exportación al organismo (asíncrono). Exporta sobre `export`; el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-TAR-013: Imprimir/exportar una versión (PDF y XLSX) con todos sus precios, reglas y normas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.padrones.exportar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-TAR-13 (Exportación al organismo).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1848 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-039)

<a id="API-TAR-040"></a>
#### API-TAR-040 · `GET /api/admin/tar/promotions`

- **Qué hace:** Promociones. Lista, con filtros y paginación, los registros de promociones (`promotions`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.promociones.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de promociones (`promotions`) con `total`.
- **Pantallas:** PAN-TAR-14 (Promociones y asignaciones).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1849 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-040)

<a id="API-TAR-040-b"></a>
#### API-TAR-040-b · `POST /api/admin/tar/promotions`

- **Qué hace:** Promociones. Da de alta un registro de promociones (`promotions`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.promociones.crear`.
- **Recibe:** los datos de promociones (`promotions`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de promociones (`promotions`).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1849 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-040-b)

<a id="API-TAR-040-c"></a>
#### API-TAR-040-c · `PATCH /api/admin/tar/promotions`

- **Qué hace:** Promociones. Modifica algunos campos de un registro de promociones (`promotions`) (solo los enviados).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.promociones.crear`.
- **Recibe:** solo los campos a cambiar de promociones (`promotions`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de promociones (`promotions`).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1849 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-040-c)

<a id="API-TAR-041"></a>
#### API-TAR-041 · `POST /api/admin/tar/promotions/{id}/assignments`

- **Qué hace:** Asignar a contrato. Agrega un elemento («assignments») a un registro de promociones (`promotions`).
- **Para qué sirve:** RF-TAR-083: Asignar promoción al contrato guardando la foto de sus condiciones; no aplicar silenciosamente una oferta nueva a contratos previos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.promociones.asignar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1850 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-041)

<a id="API-TAR-042"></a>
#### API-TAR-042 · `POST /api/admin/tar/promotions/assignments/{id}/cancel`

- **Qué hace:** Cancelar asignación. Cancela un registro de promociones (`promotions`).
- **Para qué sirve:** RF-TAR-085: Excepciones individuales autorizadas (ajuste comercial con expediente) con motivo, aprobación y vigencia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.excepciones.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1851 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-042)

<a id="API-TAR-043"></a>
#### API-TAR-043 · `POST /api/admin/tar/simulations`

- **Qué hace:** Simulación individual (síncrona) o masiva (asíncrona, devuelve runId). Registra un nuevo elemento u operación en `simulations`; el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-TAR-006: Exigir una simulación adjunta (individual o masiva según PRM-TAR-005) antes de enviar a aprobación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.simulador.ejecutar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-TAR-15 (Simulador de cálculo).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1852 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-043)

<a id="API-TAR-044"></a>
#### API-TAR-044 · `GET /api/admin/tar/simulations/{id}`

- **Qué hace:** Estado, resumen y detalle paginado. Obtiene el detalle de un registro de `simulations`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.simulador.ejecutar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TAR-15 (Simulador de cálculo).
- **Ola:** O7 · **Fuente:** M04 §11. API, línea 1853 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-044)

<a id="API-TAR-044-b"></a>
#### API-TAR-044-b · `GET /api/admin/tar/simulations/{id}/results`

- **Qué hace:** Estado, resumen y detalle paginado. Lista, con filtros y paginación, los registros de resultado de simulación por cuenta (`simulationResults`).
- **Para qué sirve:** RF-TAR-093: Simulador masivo comparativo: universo por filtros, versión A vs B, período, consumos reales del período o de referencia; resultados por contrato y agregados por servicio, categoría, grupo, zona; distribución de variaciones… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.simulador.ejecutar`.
- **Recibe:** en la ruta `id`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de resultado de simulación por cuenta (`simulationResults`) con `total`.
- **Pantallas:** PAN-TAR-15 (Simulador de cálculo).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1853 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-044-b)

<a id="API-TAR-045"></a>
#### API-TAR-045 · `POST /api/admin/tar/simulations/{id}/cancel`

- **Qué hace:** Cancelar corrida. Cancela un registro de `cancel`.
- **Para qué sirve:** RF-TAR-093: Simulador masivo comparativo: universo por filtros, versión A vs B, período, consumos reales del período o de referencia; resultados por contrato y agregados por servicio, categoría, grupo, zona; distribución de variaciones… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.simulador.masivo`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TAR-16 (Simulador masivo comparativo).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1854 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-045)

<a id="API-TAR-046"></a>
#### API-TAR-046 · `GET /api/admin/tar/simulations/{id}/export`

- **Qué hace:** Exportar resumen/detalle. Descarga un archivo de `export`.
- **Para qué sirve:** RF-TAR-093: Simulador masivo comparativo: universo por filtros, versión A vs B, período, consumos reales del período o de referencia; resultados por contrato y agregados por servicio, categoría, grupo, zona; distribución de variaciones… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.simulador.ejecutar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un archivo (application/octet-stream).
- **Pantallas:** PAN-TAR-15 (Simulador de cálculo).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1855 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-046)

<a id="API-TAR-047"></a>
#### API-TAR-047 · `GET /api/admin/tar/calculations/{id}`

- **Qué hace:** Cálculo con traza. Obtiene el detalle de un registro de resultado de cálculo por cuenta con traza (`calculations`).
- **Para qué sirve:** RF-TAR-089: Vista "Cómo se calculó" para el operador: árbol de pasos del pipeline, renglones y su traza, enlaces a versión, norma y consumos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.calculo.explicar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de resultado de cálculo por cuenta con traza (`calculations`).
- **Pantallas:** PAN-TAR-17 (Explicación técnica de un cálculo).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1856 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-047)

<a id="API-TAR-048"></a>
#### API-TAR-048 · `POST /api/admin/tar/calculations/{id}/replay`

- **Qué hace:** Recalcular desde la instantánea y comparar hash. Reproduce un registro de resultado de cálculo por cuenta con traza (`calculations`).
- **Para qué sirve:** RF-TAR-060: Determinismo e idempotencia: el cálculo guarda inputHash y resultHash; recalcular con las mismas entradas da el mismo hash. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.calculo.explicar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TAR-17 (Explicación técnica de un cálculo).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1857 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-048)

<a id="API-TAR-049"></a>
#### API-TAR-049 · `POST /api/admin/tar/retroactive-diffs`

- **Qué hace:** Calcular diferencias retroactivas (asíncrono). Registra un nuevo elemento u operación en `retroactive-diffs`; el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-TAR-096: Cálculo de diferencias por cambio retroactivo de versión o de entradas (corrección de consumo) sobre liquidaciones emitidas: simular, aprobar y entregar a M05 los ajustes (ND/NC) sin reescribir el original. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.retroactivo.calcular`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-TAR-22 (Diferencias retroactivas).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1858 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-049)

<a id="API-TAR-050"></a>
#### API-TAR-050 · `POST /api/admin/tar/retroactive-diffs/{id}/approve`

- **Qué hace:** Aprobar (firma) o rechazar; al completar firmas pide ajustes a M05. Aprueba un registro de `approve`.
- **Para qué sirve:** RF-TAR-096: Cálculo de diferencias por cambio retroactivo de versión o de entradas (corrección de consumo) sobre liquidaciones emitidas: simular, aprobar y entregar a M05 los ajustes (ND/NC) sin reescribir el original. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.retroactivo.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1859 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-050)

<a id="API-TAR-050-b"></a>
#### API-TAR-050-b · `POST /api/admin/tar/retroactive-diffs/{id}/reject`

- **Qué hace:** Aprobar (firma) o rechazar; al completar firmas pide ajustes a M05. Rechaza un registro de `reject`.
- **Para qué sirve:** RF-TAR-096: Cálculo de diferencias por cambio retroactivo de versión o de entradas (corrección de consumo) sobre liquidaciones emitidas: simular, aprobar y entregar a M05 los ajustes (ND/NC) sin reescribir el original. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.retroactivo.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1859 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-050-b)

<a id="API-TAR-051"></a>
#### API-TAR-051 · `GET /api/admin/tar/phone/rate-plans`

- **Qué hace:** Configuración de tasación. Lista, con filtros y paginación, los registros de planes de tasación telefónica (`phoneRatePlans`).
- **Para qué sirve:** RF-TAR-097: Configurar tasación telefónica: planes tarifarios, bandas horarias por día con feriados, tipos de banda, fracciones escalonadas por clave y tipo de llamada, planes de descuento, números gratuitos, consumo mínimo por llamada… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.telefonia.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de planes de tasación telefónica (`phoneRatePlans`) con `total`.
- **Pantallas:** PAN-TAR-19 (Configuración de tasación).
- **Ola:** O10 · **Fuente:** M04 §11. API, línea 1860 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-051)

<a id="API-TAR-051-b"></a>
#### API-TAR-051-b · `POST /api/admin/tar/phone/rate-plans`

- **Qué hace:** Configuración de tasación. Da de alta un registro de planes de tasación telefónica (`phoneRatePlans`).
- **Para qué sirve:** RF-TAR-097: Configurar tasación telefónica: planes tarifarios, bandas horarias por día con feriados, tipos de banda, fracciones escalonadas por clave y tipo de llamada, planes de descuento, números gratuitos, consumo mínimo por llamada… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.telefonia.configurar`.
- **Recibe:** los datos de planes de tasación telefónica (`phoneRatePlans`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de planes de tasación telefónica (`phoneRatePlans`).
- **Ola:** O10 · **Fuente:** M04 §11. API, línea 1860 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-051-b)

<a id="API-TAR-051-c"></a>
#### API-TAR-051-c · `PATCH /api/admin/tar/phone/rate-plans`

- **Qué hace:** Configuración de tasación. Modifica algunos campos de un registro de planes de tasación telefónica (`phoneRatePlans`) (solo los enviados).
- **Para qué sirve:** RF-TAR-097: Configurar tasación telefónica: planes tarifarios, bandas horarias por día con feriados, tipos de banda, fracciones escalonadas por clave y tipo de llamada, planes de descuento, números gratuitos, consumo mínimo por llamada… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.telefonia.configurar`.
- **Recibe:** solo los campos a cambiar de planes de tasación telefónica (`phoneRatePlans`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de planes de tasación telefónica (`phoneRatePlans`).
- **Ola:** O10 · **Fuente:** M04 §11. API, línea 1860 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-051-c)

<a id="API-TAR-051-d"></a>
#### API-TAR-051-d · `GET /api/admin/tar/phone/time-bands`

- **Qué hace:** Configuración de tasación. Lista, con filtros y paginación, los registros de bandas horarias (`phoneTimeBands`).
- **Para qué sirve:** RF-TAR-097: Configurar tasación telefónica: planes tarifarios, bandas horarias por día con feriados, tipos de banda, fracciones escalonadas por clave y tipo de llamada, planes de descuento, números gratuitos, consumo mínimo por llamada… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.telefonia.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de bandas horarias (`phoneTimeBands`) con `total`.
- **Pantallas:** PAN-TAR-19 (Configuración de tasación).
- **Ola:** O10 · **Fuente:** M04 §11. API, línea 1860 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-051-d)

<a id="API-TAR-051-e"></a>
#### API-TAR-051-e · `POST /api/admin/tar/phone/time-bands`

- **Qué hace:** Configuración de tasación. Da de alta un registro de bandas horarias (`phoneTimeBands`).
- **Para qué sirve:** RF-TAR-097: Configurar tasación telefónica: planes tarifarios, bandas horarias por día con feriados, tipos de banda, fracciones escalonadas por clave y tipo de llamada, planes de descuento, números gratuitos, consumo mínimo por llamada… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.telefonia.configurar`.
- **Recibe:** los datos de bandas horarias (`phoneTimeBands`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de bandas horarias (`phoneTimeBands`).
- **Ola:** O10 · **Fuente:** M04 §11. API, línea 1860 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-051-e)

<a id="API-TAR-051-f"></a>
#### API-TAR-051-f · `PATCH /api/admin/tar/phone/time-bands`

- **Qué hace:** Configuración de tasación. Modifica algunos campos de un registro de bandas horarias (`phoneTimeBands`) (solo los enviados).
- **Para qué sirve:** RF-TAR-097: Configurar tasación telefónica: planes tarifarios, bandas horarias por día con feriados, tipos de banda, fracciones escalonadas por clave y tipo de llamada, planes de descuento, números gratuitos, consumo mínimo por llamada… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.telefonia.configurar`.
- **Recibe:** solo los campos a cambiar de bandas horarias (`phoneTimeBands`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de bandas horarias (`phoneTimeBands`).
- **Ola:** O10 · **Fuente:** M04 §11. API, línea 1860 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-051-f)

<a id="API-TAR-051-g"></a>
#### API-TAR-051-g · `GET /api/admin/tar/phone/band-assignments`

- **Qué hace:** Configuración de tasación. Lista, con filtros y paginación, los registros de asignación de bandas (`phoneBandAssignments`).
- **Para qué sirve:** RF-TAR-097: Configurar tasación telefónica: planes tarifarios, bandas horarias por día con feriados, tipos de banda, fracciones escalonadas por clave y tipo de llamada, planes de descuento, números gratuitos, consumo mínimo por llamada… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.telefonia.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de asignación de bandas (`phoneBandAssignments`) con `total`.
- **Pantallas:** PAN-TAR-19 (Configuración de tasación).
- **Ola:** O10 · **Fuente:** M04 §11. API, línea 1860 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-051-g)

<a id="API-TAR-051-h"></a>
#### API-TAR-051-h · `POST /api/admin/tar/phone/band-assignments`

- **Qué hace:** Configuración de tasación. Da de alta un registro de asignación de bandas (`phoneBandAssignments`).
- **Para qué sirve:** RF-TAR-097: Configurar tasación telefónica: planes tarifarios, bandas horarias por día con feriados, tipos de banda, fracciones escalonadas por clave y tipo de llamada, planes de descuento, números gratuitos, consumo mínimo por llamada… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.telefonia.configurar`.
- **Recibe:** los datos de asignación de bandas (`phoneBandAssignments`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de asignación de bandas (`phoneBandAssignments`).
- **Ola:** O10 · **Fuente:** M04 §11. API, línea 1860 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-051-h)

<a id="API-TAR-051-i"></a>
#### API-TAR-051-i · `PATCH /api/admin/tar/phone/band-assignments`

- **Qué hace:** Configuración de tasación. Modifica algunos campos de un registro de asignación de bandas (`phoneBandAssignments`) (solo los enviados).
- **Para qué sirve:** RF-TAR-097: Configurar tasación telefónica: planes tarifarios, bandas horarias por día con feriados, tipos de banda, fracciones escalonadas por clave y tipo de llamada, planes de descuento, números gratuitos, consumo mínimo por llamada… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.telefonia.configurar`.
- **Recibe:** solo los campos a cambiar de asignación de bandas (`phoneBandAssignments`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de asignación de bandas (`phoneBandAssignments`).
- **Ola:** O10 · **Fuente:** M04 §11. API, línea 1860 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-051-i)

<a id="API-TAR-051-j"></a>
#### API-TAR-051-j · `GET /api/admin/tar/phone/rates`

- **Qué hace:** Configuración de tasación. Lista, con filtros y paginación, los registros de precios por destino y banda (`phoneRates`).
- **Para qué sirve:** RF-TAR-097: Configurar tasación telefónica: planes tarifarios, bandas horarias por día con feriados, tipos de banda, fracciones escalonadas por clave y tipo de llamada, planes de descuento, números gratuitos, consumo mínimo por llamada… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.telefonia.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de precios por destino y banda (`phoneRates`) con `total`.
- **Pantallas:** PAN-TAR-19 (Configuración de tasación).
- **Ola:** O10 · **Fuente:** M04 §11. API, línea 1860 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-051-j)

<a id="API-TAR-051-k"></a>
#### API-TAR-051-k · `POST /api/admin/tar/phone/rates`

- **Qué hace:** Configuración de tasación. Da de alta un registro de precios por destino y banda (`phoneRates`).
- **Para qué sirve:** RF-TAR-097: Configurar tasación telefónica: planes tarifarios, bandas horarias por día con feriados, tipos de banda, fracciones escalonadas por clave y tipo de llamada, planes de descuento, números gratuitos, consumo mínimo por llamada… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.telefonia.configurar`.
- **Recibe:** los datos de precios por destino y banda (`phoneRates`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de precios por destino y banda (`phoneRates`).
- **Ola:** O10 · **Fuente:** M04 §11. API, línea 1860 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-051-k)

<a id="API-TAR-051-l"></a>
#### API-TAR-051-l · `PATCH /api/admin/tar/phone/rates`

- **Qué hace:** Configuración de tasación. Modifica algunos campos de un registro de precios por destino y banda (`phoneRates`) (solo los enviados).
- **Para qué sirve:** RF-TAR-097: Configurar tasación telefónica: planes tarifarios, bandas horarias por día con feriados, tipos de banda, fracciones escalonadas por clave y tipo de llamada, planes de descuento, números gratuitos, consumo mínimo por llamada… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.telefonia.configurar`.
- **Recibe:** solo los campos a cambiar de precios por destino y banda (`phoneRates`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de precios por destino y banda (`phoneRates`).
- **Ola:** O10 · **Fuente:** M04 §11. API, línea 1860 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-051-l)

<a id="API-TAR-051-m"></a>
#### API-TAR-051-m · `GET /api/admin/tar/phone/discount-plans`

- **Qué hace:** Configuración de tasación. Lista, con filtros y paginación, los registros de planes de descuento telefónico (`phoneDiscountPlans`).
- **Para qué sirve:** RF-TAR-097: Configurar tasación telefónica: planes tarifarios, bandas horarias por día con feriados, tipos de banda, fracciones escalonadas por clave y tipo de llamada, planes de descuento, números gratuitos, consumo mínimo por llamada… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.telefonia.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de planes de descuento telefónico (`phoneDiscountPlans`) con `total`.
- **Pantallas:** PAN-TAR-19 (Configuración de tasación).
- **Ola:** O10 · **Fuente:** M04 §11. API, línea 1860 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-051-m)

<a id="API-TAR-051-n"></a>
#### API-TAR-051-n · `POST /api/admin/tar/phone/discount-plans`

- **Qué hace:** Configuración de tasación. Da de alta un registro de planes de descuento telefónico (`phoneDiscountPlans`).
- **Para qué sirve:** RF-TAR-097: Configurar tasación telefónica: planes tarifarios, bandas horarias por día con feriados, tipos de banda, fracciones escalonadas por clave y tipo de llamada, planes de descuento, números gratuitos, consumo mínimo por llamada… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.telefonia.configurar`.
- **Recibe:** los datos de planes de descuento telefónico (`phoneDiscountPlans`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de planes de descuento telefónico (`phoneDiscountPlans`).
- **Ola:** O10 · **Fuente:** M04 §11. API, línea 1860 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-051-n)

<a id="API-TAR-051-o"></a>
#### API-TAR-051-o · `PATCH /api/admin/tar/phone/discount-plans`

- **Qué hace:** Configuración de tasación. Modifica algunos campos de un registro de planes de descuento telefónico (`phoneDiscountPlans`) (solo los enviados).
- **Para qué sirve:** RF-TAR-097: Configurar tasación telefónica: planes tarifarios, bandas horarias por día con feriados, tipos de banda, fracciones escalonadas por clave y tipo de llamada, planes de descuento, números gratuitos, consumo mínimo por llamada… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.telefonia.configurar`.
- **Recibe:** solo los campos a cambiar de planes de descuento telefónico (`phoneDiscountPlans`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de planes de descuento telefónico (`phoneDiscountPlans`).
- **Ola:** O10 · **Fuente:** M04 §11. API, línea 1860 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-051-o)

<a id="API-TAR-051-p"></a>
#### API-TAR-051-p · `GET /api/admin/tar/phone/free-numbers`

- **Qué hace:** Configuración de tasación. Lista, con filtros y paginación, los registros de números gratuitos (`phoneFreeNumbers`).
- **Para qué sirve:** RF-TAR-097: Configurar tasación telefónica: planes tarifarios, bandas horarias por día con feriados, tipos de banda, fracciones escalonadas por clave y tipo de llamada, planes de descuento, números gratuitos, consumo mínimo por llamada… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.telefonia.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de números gratuitos (`phoneFreeNumbers`) con `total`.
- **Pantallas:** PAN-TAR-19 (Configuración de tasación).
- **Ola:** O10 · **Fuente:** M04 §11. API, línea 1860 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-051-p)

<a id="API-TAR-051-q"></a>
#### API-TAR-051-q · `POST /api/admin/tar/phone/free-numbers`

- **Qué hace:** Configuración de tasación. Da de alta un registro de números gratuitos (`phoneFreeNumbers`).
- **Para qué sirve:** RF-TAR-097: Configurar tasación telefónica: planes tarifarios, bandas horarias por día con feriados, tipos de banda, fracciones escalonadas por clave y tipo de llamada, planes de descuento, números gratuitos, consumo mínimo por llamada… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.telefonia.configurar`.
- **Recibe:** los datos de números gratuitos (`phoneFreeNumbers`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de números gratuitos (`phoneFreeNumbers`).
- **Ola:** O10 · **Fuente:** M04 §11. API, línea 1860 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-051-q)

<a id="API-TAR-051-r"></a>
#### API-TAR-051-r · `PATCH /api/admin/tar/phone/free-numbers`

- **Qué hace:** Configuración de tasación. Modifica algunos campos de un registro de números gratuitos (`phoneFreeNumbers`) (solo los enviados).
- **Para qué sirve:** RF-TAR-097: Configurar tasación telefónica: planes tarifarios, bandas horarias por día con feriados, tipos de banda, fracciones escalonadas por clave y tipo de llamada, planes de descuento, números gratuitos, consumo mínimo por llamada… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.telefonia.configurar`.
- **Recibe:** solo los campos a cambiar de números gratuitos (`phoneFreeNumbers`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de números gratuitos (`phoneFreeNumbers`).
- **Ola:** O10 · **Fuente:** M04 §11. API, línea 1860 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-051-r)

<a id="API-TAR-052"></a>
#### API-TAR-052 · `POST /api/admin/tar/phone/rate`

- **Qué hace:** Tasar llamada hipotética o pendientes. Registra un nuevo elemento u operación en `rate`.
- **Para qué sirve:** RF-TAR-098: Tasar llamadas importadas por M10 y retasar las no facturadas conservando versión anterior. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.telefonia.tasar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TAR-20 (Simulador de tasación y retasación).
- **Ola:** O10 · **Fuente:** M04 §11. API, línea 1861 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-052)

<a id="API-TAR-053"></a>
#### API-TAR-053 · `POST /api/admin/tar/phone/rerate`

- **Qué hace:** Retasación por rango (asíncrona). Registra un nuevo elemento u operación en `rerate`; el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-TAR-098: Tasar llamadas importadas por M10 y retasar las no facturadas conservando versión anterior. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.telefonia.retasar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Ola:** O10 · **Fuente:** M04 §11. API, línea 1862 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-053)

<a id="API-TAR-054"></a>
#### API-TAR-054 · `GET /api/admin/tar/rounding-policies`

- **Qué hace:** Políticas de redondeo. Lista, con filtros y paginación, los registros de políticas de redondeo (`roundingPolicies`).
- **Para qué sirve:** RF-TAR-112: Configurar políticas de redondeo (tipo, decimales, conceptos) referenciables por tipos de comprobante de M05 y como política global. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.redondeo.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de políticas de redondeo (`roundingPolicies`) con `total`.
- **Pantallas:** PAN-TAR-25 (Políticas de redondeo).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1863 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-054)

<a id="API-TAR-054-b"></a>
#### API-TAR-054-b · `PATCH /api/admin/tar/rounding-policies`

- **Qué hace:** Políticas de redondeo. Modifica algunos campos de un registro de políticas de redondeo (`roundingPolicies`) (solo los enviados).
- **Para qué sirve:** RF-TAR-112: Configurar políticas de redondeo (tipo, decimales, conceptos) referenciables por tipos de comprobante de M05 y como política global. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.redondeo.configurar`.
- **Recibe:** solo los campos a cambiar de políticas de redondeo (`roundingPolicies`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de políticas de redondeo (`roundingPolicies`).
- **Pantallas:** PAN-TAR-25 (Políticas de redondeo).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1863 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-054-b)

<a id="API-TAR-055"></a>
#### API-TAR-055 · `GET /api/admin/tar/preloaded-charges`

- **Qué hace:** Cargos precargados. Consulta `preloaded-charges`.
- **Para qué sirve:** RF-TAR-051: Cargos extraordinarios precargados del período (o sin período) por contrato. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.calculo.ejecutar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TAR-28 (Cargos extraordinarios precargados).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1864 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-055)

<a id="API-TAR-055-b"></a>
#### API-TAR-055-b · `POST /api/admin/tar/preloaded-charges`

- **Qué hace:** Cargos precargados. Registra un nuevo elemento u operación en `preloaded-charges`.
- **Para qué sirve:** RF-TAR-051: Cargos extraordinarios precargados del período (o sin período) por contrato. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.calculo.ejecutar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TAR-28 (Cargos extraordinarios precargados).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1864 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-055-b)

<a id="API-TAR-055-c"></a>
#### API-TAR-055-c · `PATCH /api/admin/tar/preloaded-charges`

- **Qué hace:** Cargos precargados. Modifica algunos campos de un registro de `preloaded-charges` (solo los enviados).
- **Para qué sirve:** RF-TAR-051: Cargos extraordinarios precargados del período (o sin período) por contrato. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.calculo.ejecutar`.
- **Recibe:** solo los campos a cambiar; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TAR-28 (Cargos extraordinarios precargados).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1864 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-055-c)

<a id="API-TAR-056"></a>
#### API-TAR-056 · `GET /api/admin/tar/bonuses/recalculation-runs`

- **Qué hace:** Recálculo masivo de bonificaciones (preview/aplicar). Consulta bonificaciones de cargos por evento (`eventChargeBonuses`).
- **Para qué sirve:** RF-TAR-111: Recalcular masivamente bonificaciones de unidades por contrato (tabla de trabajo) con preview. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.cuadros.editar`.
- **Recibe:** nada.
- **Devuelve:** 200: el registro de bonificaciones de cargos por evento (`eventChargeBonuses`).
- **Pantallas:** PAN-TAR-02 (Editor de versión), PAN-TAR-03 (Editor de categoría y escalones), PAN-TAR-09 (Factores de gas por período/zona/categoría) y 3 más.
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1865 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-056)

<a id="API-TAR-056-b"></a>
#### API-TAR-056-b · `POST /api/admin/tar/bonuses/recalculation-runs`

- **Qué hace:** Recálculo masivo de bonificaciones (preview/aplicar). Registra un nuevo elemento u operación en bonificaciones de cargos por evento (`eventChargeBonuses`).
- **Para qué sirve:** RF-TAR-111: Recalcular masivamente bonificaciones de unidades por contrato (tabla de trabajo) con preview. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.cuadros.editar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TAR-02 (Editor de versión), PAN-TAR-03 (Editor de categoría y escalones), PAN-TAR-09 (Factores de gas por período/zona/categoría) y 3 más.
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1865 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-056-b)

<a id="API-TAR-057"></a>
#### API-TAR-057 · `GET /api/admin/tar/settings`

- **Qué hace:** Parámetros PRM-TAR. Lista, con filtros y paginación, los registros de configuración tarifaria del servicio (`tariffServiceSettings`).
- **Para qué sirve:** RF-TAR-023: Ordenar filas por código de concepto opcionalmente en la configuración del servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.config.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de configuración tarifaria del servicio (`tariffServiceSettings`) con `total`.
- **Pantallas:** PAN-TAR-27 (Parámetros del módulo).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1866 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-057)

<a id="API-TAR-057-b"></a>
#### API-TAR-057-b · `PATCH /api/admin/tar/settings`

- **Qué hace:** Parámetros PRM-TAR. Modifica algunos campos de un registro de configuración tarifaria del servicio (`tariffServiceSettings`) (solo los enviados).
- **Para qué sirve:** RF-TAR-023: Ordenar filas por código de concepto opcionalmente en la configuración del servicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.config.configurar`.
- **Recibe:** solo los campos a cambiar de configuración tarifaria del servicio (`tariffServiceSettings`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de configuración tarifaria del servicio (`tariffServiceSettings`).
- **Pantallas:** PAN-TAR-27 (Parámetros del módulo).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1866 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-057-b)

<a id="API-TAR-058"></a>
#### API-TAR-058 · `GET /api/admin/tar/approvals`

- **Qué hace:** Bandeja de aprobaciones pendientes del usuario. Lista, con filtros y paginación, los registros de `approvals`.
- **Para qué sirve:** RF-TAR-012: Listado de cuadros: descripción, código, usuario, vigencia desde y hasta, estado, alcance, norma; acciones nuevo, copiar, ver, enviar, aprobar, imprimir/exportar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.cuadros.aprobar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ResultadoGenerico (`ResultadoGenerico`) con `total`.
- **Pantallas:** PAN-TAR-21 (Bandeja de aprobaciones).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1867 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-058)

<a id="API-TAR-059"></a>
#### API-TAR-059 · `GET /api/admin/tar/reports/{code}`

- **Qué hace:** Reportes de la sección 15 (con exportación). Obtiene el detalle de un registro de `reports`.
- **Para qué sirve:** RF-TAR-012: Listado de cuadros: descripción, código, usuario, vigencia desde y hasta, estado, alcance, norma; acciones nuevo, copiar, ver, enviar, aprobar, imprimir/exportar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tar.cuadros.ver`.
- **Recibe:** en la ruta `code`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TAR-01 (Listado de versiones de cuadros), PAN-TAR-02 (Editor de versión).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1868 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-059)

<a id="API-TAR-060"></a>
#### API-TAR-060 · `GET /api/tar/invoices/{id}/explanation`

- **Qué hace:** Explicación para el socio (solo cuentas propias). Consulta «explanation» de un registro de `explanation`.
- **Para qué sirve:** RF-TAR-090: Vista simplificada para el socio en la PWA: precio, cantidad, tramos, beneficios y su vencimiento, tributos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `tar.explicacion.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TAR-23 (Explicación de la factura al socio).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1869 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-060)

<a id="API-TAR-061"></a>
#### API-TAR-061 · `GET /api/public/{tenantSlug}/tar/tariffs`

- **Qué hace:** Cuadros publicables vigentes y próximos. Consulta `tariffs`.
- **Para qué sirve:** RF-TAR-014: Publicar opcionalmente el cuadro vigente en la landing y el portal (por servicio/categoría), con vigencia y norma. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1870 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-061)

<a id="API-TAR-065"></a>
#### API-TAR-065 · `GET /api/platform/tar/functions`

- **Qué hace:** Catálogo global de funciones y plantillas ficticias. Lista, con filtros y paginación, los registros de funciones GFL nativas y declarativas (`formulaFunctions`).
- **Para qué sirve:** RF-TAR-068: Lenguaje de fórmulas GFL en sandbox (sección 9.4): expresiones, tipos, operadores, funciones del catálogo, referencias a reglas previas por código estable. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `tar.funciones.administrar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de funciones GFL nativas y declarativas (`formulaFunctions`) con `total`.
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1874 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-065)

<a id="API-TAR-065-b"></a>
#### API-TAR-065-b · `POST /api/platform/tar/functions`

- **Qué hace:** Catálogo global de funciones y plantillas ficticias. Da de alta un registro de funciones GFL nativas y declarativas (`formulaFunctions`).
- **Para qué sirve:** RF-TAR-068: Lenguaje de fórmulas GFL en sandbox (sección 9.4): expresiones, tipos, operadores, funciones del catálogo, referencias a reglas previas por código estable. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `tar.funciones.administrar`.
- **Recibe:** los datos de funciones GFL nativas y declarativas (`formulaFunctions`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de funciones GFL nativas y declarativas (`formulaFunctions`).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1874 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-065-b)

<a id="API-TAR-065-c"></a>
#### API-TAR-065-c · `GET /api/platform/tar/templates`

- **Qué hace:** Catálogo global de funciones y plantillas ficticias. Lista, con filtros y paginación, los registros de `templates`.
- **Para qué sirve:** RF-TAR-068: Lenguaje de fórmulas GFL en sandbox (sección 9.4): expresiones, tipos, operadores, funciones del catálogo, referencias a reglas previas por código estable. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `tar.funciones.administrar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ResultadoGenerico (`ResultadoGenerico`) con `total`.
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1874 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-065-c)

<a id="API-TAR-065-d"></a>
#### API-TAR-065-d · `POST /api/platform/tar/templates`

- **Qué hace:** Catálogo global de funciones y plantillas ficticias. Registra un nuevo elemento u operación en `templates`.
- **Para qué sirve:** RF-TAR-068: Lenguaje de fórmulas GFL en sandbox (sección 9.4): expresiones, tipos, operadores, funciones del catálogo, referencias a reglas previas por código estable. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Equipo de GoodApps, desde la consola de plataforma (todos los tenants); permiso `tar.funciones.administrar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O4 · **Fuente:** M04 §11. API, línea 1874 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-065-d)

<a id="API-TAR-066"></a>
#### API-TAR-066 · `GET /api/tar/installment-plans`

- **Qué hace:** Plan de cuotas de obra o de adquisición de derecho en solo lectura (RF-TAR-119; HUECO-OBR-03): planKind, obra/derecho, cuota actual n/N,... Lista, con filtros y paginación, los registros de cuotas de obra (`worksInstallmentPlans`).
- **Para qué sirve:** RF-TAR-119: Exponer en solo lectura el plan de cuotas de obra (y de adquisición de derecho) de un contrato para el portal (M19, bloque "Plan de cuotas de obra" de PAN-POR-30) y atención: obra, cuota actual n/N, cuotas facturadas, saldo en…
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `por.planObra.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de cuotas de obra (`worksInstallmentPlans`) con `total`.
- **Ola:** O7 · **Fuente:** M04 §11. API, línea 1875 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-066)

<a id="API-TAR-066-b"></a>
#### API-TAR-066-b · `GET /api/admin/tar/installment-plans/{contractId}`

- **Qué hace:** Plan de cuotas de obra o de adquisición de derecho en solo lectura (RF-TAR-119; HUECO-OBR-03): planKind, obra/derecho, cuota actual n/N,... Obtiene el detalle de un registro de cuotas de obra (`worksInstallmentPlans`).
- **Para qué sirve:** RF-TAR-119: Exponer en solo lectura el plan de cuotas de obra (y de adquisición de derecho) de un contrato para el portal (M19, bloque "Plan de cuotas de obra" de PAN-POR-30) y atención: obra, cuota actual n/N, cuotas facturadas, saldo en…
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `por.planObra.ver`.
- **Recibe:** en la ruta `contractId`.
- **Devuelve:** 200: el registro de cuotas de obra (`worksInstallmentPlans`).
- **Ola:** O7 · **Fuente:** M04 §11. API, línea 1875 · [Ver en Swagger](../18-swagger/index.html?api=m04-tar#/API/API-TAR-066-b)
