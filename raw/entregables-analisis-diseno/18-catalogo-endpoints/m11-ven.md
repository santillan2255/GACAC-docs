# Catálogo de endpoints · M11 · Ventas, presupuestos y punto de venta

Parte del [catálogo de endpoints](../18-catalogo-endpoints.md) (artefacto 7.1). Generado el 05-11-2026 con `_trabajo/gen_18_catalogo_endpoints.py` a partir de `18-openapi/`; no se edita a mano.

## Para qué sirve esta API

Gestionar todo lo que la cooperativa vende o cobra por única vez fuera de la liquidación periódica del servicio, con trazabilidad comercial, física, financiera, fiscal y contable:

1. Los conceptos por cobrar en operaciones con titulares (derecho de conexión, instalación, reconexión, cambio de titular, traslado u otro concepto habilitado), generados por un hito operativo y cobrados con el servicio, al contado o financiados.
2. Los presupuestos a socios, titulares, personas o prospectos, con condiciones de venta, conjuntos, notas, comprobantes generados, envío, aceptación online y conversión automática en orden de trabajo y factura (flujo continuo).
3. La venta de productos y servicios adicionales: pedido, disponibilidad, entrega parcial, devolución, listas de precios, reglas de recargo/descuento, vendedores, punto de venta de mostrador (POS) y rendición de viajes/fletes.
4. La financiación comercial de una venta nueva (cronograma de cuotas, intereses, IVA y percepciones por cuota, cancelación anticipada), separada de la regularización de deuda anterior (M08).
5. La regla de inclusión de ventas y cuotas en la factura del servicio (MER-010): por defecto en documentos propios presentados juntos en el resumen; dentro de la factura del servicio solo los conceptos vinculados a ese servicio y con validación fiscal.

Detalle completo en el anexo M11, sección 1. Contrato navegable: [Swagger](../18-swagger/index.html?api=m11-ven).

| Dato | Valor |
|---|---|
| Endpoints | 70 |
| Por método | GET 21, PATCH 3, POST 45, PUT 1 |
| Grupos funcionales | 1 |
| Con requisito citado en el anexo | 0 |
| Con requisito inferido (a confirmar) | 66 |
| Sin requisito identificable | 4 |

## Grupos funcionales

| Grupo | Endpoints | Qué agrupa (primeros endpoints) |
|---|---|---|
| [API](#grupo-1) | 70 | Listar cargos (filtros, paginado); Alta manual de cargo.; Bonificar (inicia T11 si corresponde)… |

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

70 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-VEN-001](#API-VEN-001) | GET | `/api/admin/ven/operation-charges` | Listar cargos (filtros, paginado) |
| [API-VEN-002](#API-VEN-002) | POST | `/api/admin/ven/operation-charges` | Alta manual de cargo. |
| [API-VEN-003](#API-VEN-003) | POST | `/api/admin/ven/operation-charges/{id}/discount` | Bonificar (inicia T11 si corresponde) |
| [API-VEN-004](#API-VEN-004) | POST | `/api/admin/ven/operation-charges/{id}/cancel` | Anular cargo no facturado. |
| [API-VEN-005](#API-VEN-005) | POST | `/api/admin/ven/operation-charges/{id}/billing-mode` | Cambiar modalidad (contado/propia/financiada) |
| [API-VEN-008](#API-VEN-008) | POST | `/api/admin/ven/simulations/first-charge` | Simular primer cobro (cargos + cuotas) para M04/M09. |
| [API-VEN-010](#API-VEN-010) | GET | `/api/admin/ven/quotes` | Listar presupuestos. |
| [API-VEN-011](#API-VEN-011) | POST | `/api/admin/ven/quotes` | Crear presupuesto. |
| [API-VEN-012](#API-VEN-012) | GET | `/api/admin/ven/quotes/{id}` | Detalle con versiones. |
| [API-VEN-013](#API-VEN-013) | PATCH | `/api/admin/ven/quotes/{id}` | Editar borrador (o crear nueva versión) |
| [API-VEN-014](#API-VEN-014) | POST | `/api/admin/ven/quotes/{id}/send` | Enviar/reenviar por canales. |
| [API-VEN-015](#API-VEN-015) | POST | `/api/admin/ven/quotes/{id}/accept` | Aceptar en nombre del cliente con evidencia. |
| [API-VEN-016](#API-VEN-016) | POST | `/api/admin/ven/quotes/{id}/reject` | Rechazar con motivo. |
| [API-VEN-017](#API-VEN-017) | POST | `/api/admin/ven/quotes/{id}/revert-to-draft` | Volver a borrador (sin OT ni facturas) |
| [API-VEN-018](#API-VEN-018) | POST | `/api/admin/ven/quotes/{id}/mark-to-invoice` | Marcar para facturar. |
| [API-VEN-019](#API-VEN-019) | POST | `/api/admin/ven/quotes/{id}/invoice` | Facturar total/parcial por ítems. |
| [API-VEN-020](#API-VEN-020) | POST | `/api/admin/ven/quotes/{id}/cancel` | Anular. |
| [API-VEN-021](#API-VEN-021) | POST | `/api/admin/ven/quotes/{id}/state` | Cambio manual de estado con motivo. |
| [API-VEN-022](#API-VEN-022) | POST | `/api/admin/ven/quotes/{id}/work-order` | Generar caso CRM y OT. |
| [API-VEN-023](#API-VEN-023) | POST | `/api/admin/ven/quotes/{id}/notes` | Agregar nota. |
| [API-VEN-024](#API-VEN-024) | POST | `/api/admin/ven/quotes/{id}/groups/{groupId}/clone` | Clonar conjunto. |
| [API-VEN-025](#API-VEN-025) | POST | `/api/admin/ven/quotes/{id}/recalculate` | Recalcular precios, margen y prorrateo. |
| [API-VEN-026](#API-VEN-026) | GET | `/api/admin/ven/quotes/{id}/pdf` | PDF de una versión. |
| [API-VEN-027](#API-VEN-027) | POST | `/api/admin/ven/quotes/bulk-print` | Impresión masiva. |
| [API-VEN-028](#API-VEN-028) | GET | `/api/admin/ven/sales-conditions` | ABM condiciones. |
| [API-VEN-028-b](#API-VEN-028-b) | POST | `/api/admin/ven/sales-conditions` | ABM condiciones. |
| [API-VEN-030](#API-VEN-030) | GET | `/api/public/{tenantSlug}/quotes/{token}` | Ver presupuesto por enlace. |
| [API-VEN-031](#API-VEN-031) | POST | `/api/public/{tenantSlug}/quotes/{token}/otp` | Enviar OTP al contacto registrado. |
| [API-VEN-032](#API-VEN-032) | POST | `/api/public/{tenantSlug}/quotes/{token}/decision` | Aceptar o rechazar. |
| [API-VEN-033](#API-VEN-033) | GET | `/api/ven/my/quotes` | Presupuestos del socio. |
| [API-VEN-034](#API-VEN-034) | POST | `/api/ven/my/quotes/{id}/decision` | Aceptar/rechazar como socio. |
| [API-VEN-035](#API-VEN-035) | GET | `/api/ven/my/installments` | Cargos y cuotas del socio. |
| [API-VEN-040](#API-VEN-040) | GET | `/api/admin/ven/sales-orders` | Listar ventas. |
| [API-VEN-041](#API-VEN-041) | POST | `/api/admin/ven/sales-orders` | Crear venta. |
| [API-VEN-042](#API-VEN-042) | PATCH | `/api/admin/ven/sales-orders/{id}` | Editar borrador. |
| [API-VEN-043](#API-VEN-043) | POST | `/api/admin/ven/sales-orders/{id}/confirm` | Confirmar (riesgo, reserva, pide comprobante) |
| [API-VEN-044](#API-VEN-044) | POST | `/api/admin/ven/sales-orders/{id}/risk-override` | Autorizar riesgo excedido. |
| [API-VEN-045](#API-VEN-045) | POST | `/api/admin/ven/sales-orders/{id}/cancel` | Anular. |
| [API-VEN-046](#API-VEN-046) | POST | `/api/admin/ven/sales-orders/cancel-range` | Anulación por rango (job) |
| [API-VEN-047](#API-VEN-047) | POST | `/api/admin/ven/sales-orders/{id}/deliveries` | Registrar entrega. |
| [API-VEN-048](#API-VEN-048) | GET | `/api/admin/ven/deliveries/pending` | Vendido no entregado. |
| [API-VEN-049](#API-VEN-049) | POST | `/api/admin/ven/sales-orders/{id}/returns` | Crear devolución. |
| [API-VEN-050](#API-VEN-050) | POST | `/api/admin/ven/returns/{id}/approve` | Aprobar devolución. |
| [API-VEN-051](#API-VEN-051) | POST | `/api/admin/ven/financing/simulate` | Simular plan (cuotas, TEA, CFT) |
| [API-VEN-052](#API-VEN-052) | GET | `/api/admin/ven/financing-plans` | ABM planes. |
| [API-VEN-052-b](#API-VEN-052-b) | POST | `/api/admin/ven/financing-plans` | ABM planes. |
| [API-VEN-053](#API-VEN-053) | GET | `/api/admin/ven/installments` | Listar cuotas. |
| [API-VEN-054](#API-VEN-054) | PATCH | `/api/admin/ven/installments/{id}` | Editar cuota sin facturar. |
| [API-VEN-055](#API-VEN-055) | POST | `/api/admin/ven/installments/bulk-update` | Modificación masiva (preview/confirm) |
| [API-VEN-056](#API-VEN-056) | POST | `/api/admin/ven/installments/early-payoff` | Cancelación anticipada. |
| [API-VEN-060](#API-VEN-060) | GET | `/api/admin/ven/sales-reps` | ABM vendedores. |
| [API-VEN-060-b](#API-VEN-060-b) | POST | `/api/admin/ven/sales-reps` | ABM vendedores. |
| [API-VEN-061](#API-VEN-061) | GET | `/api/admin/ven/price-lists` | Listas de precios. |
| [API-VEN-061-b](#API-VEN-061-b) | POST | `/api/admin/ven/price-lists` | Listas de precios. |
| [API-VEN-062](#API-VEN-062) | POST | `/api/admin/ven/price-lists/bulk-update` | Actualización masiva (preview/confirm) |
| [API-VEN-063](#API-VEN-063) | GET | `/api/admin/ven/discount-rules` | Reglas de recargo/descuento. |
| [API-VEN-063-b](#API-VEN-063-b) | POST | `/api/admin/ven/discount-rules` | Reglas de recargo/descuento. |
| [API-VEN-064](#API-VEN-064) | POST | `/api/admin/ven/discount-rules/evaluate` | Evaluar reglas para cuenta y producto. |
| [API-VEN-070](#API-VEN-070) | GET | `/api/admin/ven/pos/terminals` | Terminales. |
| [API-VEN-070-b](#API-VEN-070-b) | POST | `/api/admin/ven/pos/terminals` | Terminales. |
| [API-VEN-071](#API-VEN-071) | POST | `/api/admin/ven/pos/sessions` | Abrir sesión. |
| [API-VEN-072](#API-VEN-072) | POST | `/api/admin/ven/pos/sessions/{id}/close` | Cerrar con arqueo. |
| [API-VEN-073](#API-VEN-073) | POST | `/api/admin/ven/pos/sessions/{id}/sales` | Venta POS (crea, cobra, emite) |
| [API-VEN-080](#API-VEN-080) | GET | `/api/admin/ven/freight-settlements` | Rendiciones. |
| [API-VEN-080-b](#API-VEN-080-b) | POST | `/api/admin/ven/freight-settlements` | Rendiciones. |
| [API-VEN-090](#API-VEN-090) | GET | `/api/admin/ven/reports/{code}` | Ejecutar reporte (sección 15) |
| [API-VEN-091](#API-VEN-091) | GET | `/api/admin/ven/settings` | Parámetros del módulo. |
| [API-VEN-091-b](#API-VEN-091-b) | PUT | `/api/admin/ven/settings` | Parámetros del módulo. |
| [API-VEN-092](#API-VEN-092) | GET | `/api/v1/ext/ven/quotes` | Consulta para integraciones externas. |
| [API-VEN-092-b](#API-VEN-092-b) | GET | `/api/v1/ext/ven/sales-orders` | Consulta para integraciones externas. |

<a id="API-VEN-001"></a>
#### API-VEN-001 · `GET /api/admin/ven/operation-charges`

- **Qué hace:** Listar cargos (filtros, paginado) Lista, con filtros y paginación, los registros de cargos por operación con titulares (`operationCharges`).
- **Para qué sirve:** RF-VEN-023: Registrar notas de presupuesto con título, texto, fecha y usuario; listarlas e imprimirlas. · RF-VEN-001: Registrar cargos por operación con titulares: derecho de conexión, instalación, reconexión, cambio de titular, traslado de domicilio, visita adicional u otro concepto habilitado por el tenant, asociados a cuenta, titular… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.cargos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de cargos por operación con titulares (`operationCharges`) con `total`.
- **Pantallas:** PAN-VEN-01 (Cargos por operación (bandeja)).
- **Ola:** O4 · **Fuente:** M11 §11. API, línea 971 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-001)

<a id="API-VEN-002"></a>
#### API-VEN-002 · `POST /api/admin/ven/operation-charges`

- **Qué hace:** Alta manual de cargo. Da de alta un registro de cargos por operación con titulares (`operationCharges`).
- **Para qué sirve:** RF-VEN-002: Generar el cargo automáticamente desde el hito disparador configurado por concepto (aprobación de la solicitud, OT confirmada, instalación probada, inicio de período), consumiendo eventos de M09, M10 y M08; también alta manual… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.cargos.crear`.
- **Recibe:** los datos de cargos por operación con titulares (`operationCharges`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de cargos por operación con titulares (`operationCharges`).
- **Ola:** O4 · **Fuente:** M11 §11. API, línea 972 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-002)

<a id="API-VEN-003"></a>
#### API-VEN-003 · `POST /api/admin/ven/operation-charges/{id}/discount`

- **Qué hace:** Bonificar (inicia T11 si corresponde) Aplica un descuento a un registro de cargos por operación con titulares (`operationCharges`).
- **Para qué sirve:** RF-VEN-001: Registrar cargos por operación con titulares: derecho de conexión, instalación, reconexión, cambio de titular, traslado de domicilio, visita adicional u otro concepto habilitado por el tenant, asociados a cuenta, titular… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.cargos.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O4 · **Fuente:** M11 §11. API, línea 973 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-003)

<a id="API-VEN-004"></a>
#### API-VEN-004 · `POST /api/admin/ven/operation-charges/{id}/cancel`

- **Qué hace:** Anular cargo no facturado. Cancela un registro de cargos por operación con titulares (`operationCharges`).
- **Para qué sirve:** RF-VEN-008: Bonificar total o parcialmente, o anular, un cargo antes de facturarlo, con motivo y aprobación por monto (T11). Después de facturado, la corrección es una NC en M05. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.cargos.anular`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O4 · **Fuente:** M11 §11. API, línea 974 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-004)

<a id="API-VEN-005"></a>
#### API-VEN-005 · `POST /api/admin/ven/operation-charges/{id}/billing-mode`

- **Qué hace:** Cambiar modalidad (contado/propia/financiada) Registra «billing-mode» sobre un registro de cargos por operación con titulares (`operationCharges`).
- **Para qué sirve:** RF-VEN-005: Elegir la modalidad de cobro del cargo: (a) contado en la próxima factura del servicio; (b) factura inmediata propia; (c) financiado en cuotas con plan comercial, mostrando capital, interés y tributos de cada cuota. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.cargos.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O4 · **Fuente:** M11 §11. API, línea 975 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-005)

<a id="API-VEN-008"></a>
#### API-VEN-008 · `POST /api/admin/ven/simulations/first-charge`

- **Qué hace:** Simular primer cobro (cargos + cuotas) para M04/M09. Registra un nuevo elemento u operación en `first-charge`.
- **Para qué sirve:** RF-VEN-011: Proveer a M04/M05 los cargos pendientes para la simulación del primer cobro (abono prorrateado + instalación) antes de confirmar la contratación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.cargos.ver`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-VEN-01 (Cargos por operación (bandeja)).
- **Ola:** O4 · **Fuente:** M11 §11. API, línea 978 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-008)

<a id="API-VEN-010"></a>
#### API-VEN-010 · `GET /api/admin/ven/quotes`

- **Qué hace:** Listar presupuestos. Lista, con filtros y paginación, los registros de presupuestos con versiones, ítems y notas (`salesQuotes`).
- **Para qué sirve:** RF-VEN-023: Registrar notas de presupuesto con título, texto, fecha y usuario; listarlas e imprimirlas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.presupuestos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de presupuestos con versiones, ítems y notas (`salesQuotes`) con `total`.
- **Pantallas:** PAN-VEN-02 (Presupuestos (listado)), PAN-VEN-21 (Flujo continuo (tablero)).
- **Ola:** O8 · **Fuente:** M11 §11. API, línea 979 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-010)

<a id="API-VEN-011"></a>
#### API-VEN-011 · `POST /api/admin/ven/quotes`

- **Qué hace:** Crear presupuesto. Da de alta un registro de presupuestos con versiones, ítems y notas (`salesQuotes`).
- **Para qué sirve:** RF-VEN-036: Al aceptarse, ofrecer o crear automáticamente (según configuración) el caso CRM y la OT en M10 con los ítems de mano de obra y materiales, dejando el vínculo presupuesto ↔ caso ↔ OT; al rechazar o anular, desvincular y cerrar el… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.presupuestos.crear`.
- **Recibe:** los datos de presupuestos con versiones, ítems y notas (`salesQuotes`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de presupuestos con versiones, ítems y notas (`salesQuotes`).
- **Pantallas:** PAN-VEN-07 (Presupuesto y venta en campo).
- **Ola:** O8 · **Fuente:** M11 §11. API, línea 980 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-011)

<a id="API-VEN-012"></a>
#### API-VEN-012 · `GET /api/admin/ven/quotes/{id}`

- **Qué hace:** Detalle con versiones. Obtiene el detalle de un registro de presupuestos con versiones, ítems y notas (`salesQuotes`).
- **Para qué sirve:** RF-VEN-023: Registrar notas de presupuesto con título, texto, fecha y usuario; listarlas e imprimirlas. · RF-VEN-090: Informar a M06 los ítems financiados para separarlos en el libro IVA ventas (P2972) y el detalle de ventas con concepto "factura en cuotas" (P403) como exento o excluido. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.presupuestos.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de presupuestos con versiones, ítems y notas (`salesQuotes`).
- **Pantallas:** PAN-VEN-02 (Presupuestos (listado)), PAN-VEN-21 (Flujo continuo (tablero)).
- **Ola:** O8 · **Fuente:** M11 §11. API, línea 981 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-012)

<a id="API-VEN-013"></a>
#### API-VEN-013 · `PATCH /api/admin/ven/quotes/{id}`

- **Qué hace:** Editar borrador (o crear nueva versión) Modifica algunos campos de un registro de presupuestos con versiones, ítems y notas (`salesQuotes`) (solo los enviados).
- **Para qué sirve:** RF-VEN-034: Modificar un presupuesto enviado lo vuelve a borrador en una nueva versión; el cambio de cuenta/persona solo se permite antes de aprobar y con P3010. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.presupuestos.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de presupuestos con versiones, ítems y notas (`salesQuotes`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de presupuestos con versiones, ítems y notas (`salesQuotes`).
- **Pantallas:** PAN-VEN-03 (Editor de presupuesto).
- **Ola:** O8 · **Fuente:** M11 §11. API, línea 982 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-013)

<a id="API-VEN-014"></a>
#### API-VEN-014 · `POST /api/admin/ven/quotes/{id}/send`

- **Qué hace:** Enviar/reenviar por canales. Envía un registro de presupuestos con versiones, ítems y notas (`salesQuotes`).
- **Para qué sirve:** RF-VEN-030: Gestionar el ciclo de vida del presupuesto con transiciones explícitas (sección 8): enviar, reenviar, aprobar/aceptar, volver a borrador, rechazar, marcar para facturar, facturar parcial/total, anular, vencer. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.presupuestos.enviar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M11 §11. API, línea 983 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-014)

<a id="API-VEN-015"></a>
#### API-VEN-015 · `POST /api/admin/ven/quotes/{id}/accept`

- **Qué hace:** Aceptar en nombre del cliente con evidencia. Acepta un registro de presupuestos con versiones, ítems y notas (`salesQuotes`).
- **Para qué sirve:** RF-VEN-111: Diferencias entre lo presupuestado y lo ejecutado en la OT (más o menos materiales/horas): se facturan según la condición aceptada (precio cerrado o a liquidar) y las diferencias por encima de la tolerancia requieren aprobación… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.presupuestos.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M11 §11. API, línea 984 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-015)

<a id="API-VEN-016"></a>
#### API-VEN-016 · `POST /api/admin/ven/quotes/{id}/reject`

- **Qué hace:** Rechazar con motivo. Rechaza un registro de presupuestos con versiones, ítems y notas (`salesQuotes`).
- **Para qué sirve:** RF-VEN-032: Aceptación online: el destinatario acepta o rechaza (con motivo) una versión exacta desde la PWA (si es socio autenticado) o desde un enlace firmado con verificación por OTP al contacto registrado; se guarda evidencia (versión… · RF-VEN-041: Comprometer stock por presupuestos aprobados con obra (reserva en M13) y liberar al anular, rechazar o facturar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.presupuestos.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M11 §11. API, línea 985 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-016)

<a id="API-VEN-017"></a>
#### API-VEN-017 · `POST /api/admin/ven/quotes/{id}/revert-to-draft`

- **Qué hace:** Volver a borrador (sin OT ni facturas) Vuelve a borrador un registro de presupuestos con versiones, ítems y notas (`salesQuotes`).
- **Para qué sirve:** RF-VEN-030: Gestionar el ciclo de vida del presupuesto con transiciones explícitas (sección 8): enviar, reenviar, aprobar/aceptar, volver a borrador, rechazar, marcar para facturar, facturar parcial/total, anular, vencer. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.presupuestos.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-VEN-03 (Editor de presupuesto).
- **Ola:** O8 · **Fuente:** M11 §11. API, línea 986 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-017)

<a id="API-VEN-018"></a>
#### API-VEN-018 · `POST /api/admin/ven/quotes/{id}/mark-to-invoice`

- **Qué hace:** Marcar para facturar. Marca para facturar un registro de presupuestos con versiones, ítems y notas (`salesQuotes`).
- **Para qué sirve:** RF-VEN-024: Conjuntos: agrupar ítems en conjuntos con descripción y cantidad; copiar/clonar conjunto; editar y eliminar conjunto e ítems; autocompletar el nombre del conjunto (P3004); emitir el presupuesto por conjuntos (P2949). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.presupuestos.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-VEN-03 (Editor de presupuesto).
- **Ola:** O8 · **Fuente:** M11 §11. API, línea 987 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-018)

<a id="API-VEN-019"></a>
#### API-VEN-019 · `POST /api/admin/ven/quotes/{id}/invoice`

- **Qué hace:** Facturar total/parcial por ítems. Factura un registro de presupuestos con versiones, ítems y notas (`salesQuotes`).
- **Para qué sirve:** RF-VEN-040: Generar desde el presupuesto, total o parcialmente por ítems pendientes, la venta (salesOrder) y/o la solicitud de factura a M05; registrar los comprobantes generados en el presupuesto. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.ventas.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-VEN-07 (Presupuesto y venta en campo).
- **Ola:** O8 · **Fuente:** M11 §11. API, línea 988 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-019)

<a id="API-VEN-020"></a>
#### API-VEN-020 · `POST /api/admin/ven/quotes/{id}/cancel`

- **Qué hace:** Anular. Cancela un registro de presupuestos con versiones, ítems y notas (`salesQuotes`).
- **Para qué sirve:** RF-VEN-023: Registrar notas de presupuesto con título, texto, fecha y usuario; listarlas e imprimirlas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.presupuestos.anular`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M11 §11. API, línea 989 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-020)

<a id="API-VEN-021"></a>
#### API-VEN-021 · `POST /api/admin/ven/quotes/{id}/state`

- **Qué hace:** Cambio manual de estado con motivo. Registra «state» sobre un registro de presupuestos con versiones, ítems y notas (`salesQuotes`).
- **Para qué sirve:** RF-VEN-045: Cambiar el estado manualmente con permiso especial y motivo (reemplaza frmPresupu_EstadoManual), limitado a las transiciones de la sección 8. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.presupuestos.cambiarEstado`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M11 §11. API, línea 990 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-021)

<a id="API-VEN-022"></a>
#### API-VEN-022 · `POST /api/admin/ven/quotes/{id}/work-order`

- **Qué hace:** Generar caso CRM y OT. Registra «work-order» sobre un registro de presupuestos con versiones, ítems y notas (`salesQuotes`).
- **Para qué sirve:** RF-VEN-034: Modificar un presupuesto enviado lo vuelve a borrador en una nueva versión; el cambio de cuenta/persona solo se permite antes de aprobar y con P3010. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.presupuestos.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M11 §11. API, línea 991 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-022)

<a id="API-VEN-023"></a>
#### API-VEN-023 · `POST /api/admin/ven/quotes/{id}/notes`

- **Qué hace:** Agregar nota. Agrega un elemento («notes») a un registro de presupuestos con versiones, ítems y notas (`salesQuotes`).
- **Para qué sirve:** RF-VEN-024: Conjuntos: agrupar ítems en conjuntos con descripción y cantidad; copiar/clonar conjunto; editar y eliminar conjunto e ítems; autocompletar el nombre del conjunto (P3004); emitir el presupuesto por conjuntos (P2949). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.presupuestos.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-VEN-03 (Editor de presupuesto).
- **Ola:** O8 · **Fuente:** M11 §11. API, línea 992 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-023)

<a id="API-VEN-024"></a>
#### API-VEN-024 · `POST /api/admin/ven/quotes/{id}/groups/{groupId}/clone`

- **Qué hace:** Clonar conjunto. Clona un registro de presupuestos con versiones, ítems y notas (`salesQuotes`).
- **Para qué sirve:** RF-VEN-024: Conjuntos: agrupar ítems en conjuntos con descripción y cantidad; copiar/clonar conjunto; editar y eliminar conjunto e ítems; autocompletar el nombre del conjunto (P3004); emitir el presupuesto por conjuntos (P2949). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.presupuestos.editar`.
- **Recibe:** en la ruta `id`, `groupId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-VEN-03 (Editor de presupuesto).
- **Ola:** O8 · **Fuente:** M11 §11. API, línea 993 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-024)

<a id="API-VEN-025"></a>
#### API-VEN-025 · `POST /api/admin/ven/quotes/{id}/recalculate`

- **Qué hace:** Recalcular precios, margen y prorrateo. Recalcula un registro de presupuestos con versiones, ítems y notas (`salesQuotes`).
- **Para qué sirve:** RF-VEN-024: Conjuntos: agrupar ítems en conjuntos con descripción y cantidad; copiar/clonar conjunto; editar y eliminar conjunto e ítems; autocompletar el nombre del conjunto (P3004); emitir el presupuesto por conjuntos (P2949). · RF-VEN-053: Actualización masiva de precios de venta por filtros (rango de código, departamento, rubro, tipo, servicio, proveedor, plan/etapa de vivienda) y modos porcentaje, coeficiente, cotización del dólar (precio × cotización nueva /… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.presupuestos.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-VEN-03 (Editor de presupuesto).
- **Ola:** O8 · **Fuente:** M11 §11. API, línea 994 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-025)

<a id="API-VEN-026"></a>
#### API-VEN-026 · `GET /api/admin/ven/quotes/{id}/pdf`

- **Qué hace:** PDF de una versión. Descarga un archivo de presupuestos con versiones, ítems y notas (`salesQuotes`).
- **Para qué sirve:** RF-VEN-023: Registrar notas de presupuesto con título, texto, fecha y usuario; listarlas e imprimirlas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.presupuestos.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un archivo (application/pdf).
- **Pantallas:** PAN-VEN-02 (Presupuestos (listado)), PAN-VEN-21 (Flujo continuo (tablero)).
- **Ola:** O8 · **Fuente:** M11 §11. API, línea 995 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-026)

<a id="API-VEN-027"></a>
#### API-VEN-027 · `POST /api/admin/ven/quotes/bulk-print`

- **Qué hace:** Impresión masiva. Registra un nuevo elemento u operación en presupuestos con versiones, ítems y notas (`salesQuotes`).
- **Para qué sirve:** RF-VEN-031: Enviar el presupuesto por email, WhatsApp o portal con PDF de plantilla configurable (P210), impresión simple por defecto (P3037) y página extra con datos de producto (P3024); impresión masiva de presupuestos/órdenes. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.presupuestos.ver`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-VEN-02 (Presupuestos (listado)), PAN-VEN-21 (Flujo continuo (tablero)).
- **Ola:** O8 · **Fuente:** M11 §11. API, línea 996 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-027)

<a id="API-VEN-028"></a>
#### API-VEN-028 · `GET /api/admin/ven/sales-conditions`

- **Qué hace:** ABM condiciones. Lista, con filtros y paginación, los registros de condiciones de venta (`salesConditions`).
- **Para qué sirve:** RF-VEN-117: Copiar entre tenants la configuración de M11 (condiciones de venta, planes, reglas, plantillas) sin copiar operaciones. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.condiciones.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de condiciones de venta (`salesConditions`) con `total`.
- **Pantallas:** PAN-VEN-04 (Condiciones de venta).
- **Ola:** O8 · **Fuente:** M11 §11. API, línea 997 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-028)

<a id="API-VEN-028-b"></a>
#### API-VEN-028-b · `POST /api/admin/ven/sales-conditions`

- **Qué hace:** ABM condiciones. Da de alta un registro de condiciones de venta (`salesConditions`).
- **Para qué sirve:** RF-VEN-117: Copiar entre tenants la configuración de M11 (condiciones de venta, planes, reglas, plantillas) sin copiar operaciones. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.condiciones.configurar`.
- **Recibe:** los datos de condiciones de venta (`salesConditions`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de condiciones de venta (`salesConditions`).
- **Pantallas:** PAN-VEN-04 (Condiciones de venta).
- **Ola:** O8 · **Fuente:** M11 §11. API, línea 997 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-028-b)

<a id="API-VEN-030"></a>
#### API-VEN-030 · `GET /api/public/{tenantSlug}/quotes/{token}`

- **Qué hace:** Ver presupuesto por enlace. Obtiene el detalle de un registro de presupuestos con versiones, ítems y notas (`salesQuotes`).
- **Para qué sirve:** RF-VEN-023: Registrar notas de presupuesto con título, texto, fecha y usuario; listarlas e imprimirlas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`, `token`.
- **Devuelve:** 200: el registro de presupuestos con versiones, ítems y notas (`salesQuotes`).
- **Ola:** O8 · **Fuente:** M11 §11. API, línea 998 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-030)

<a id="API-VEN-031"></a>
#### API-VEN-031 · `POST /api/public/{tenantSlug}/quotes/{token}/otp`

- **Qué hace:** Enviar OTP al contacto registrado. Registra «otp» sobre un registro de `otp`.
- **Para qué sirve:** RF-VEN-037: Presupuestos en campo: enviar presupuestos a la app de campo (P2380), sincronizarlos con ventas (P2386), usar solo productos habilitados para campo, punto de venta fijo de campo (P2383), presupuestos a granel con coeficiente… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`, `token`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M11 §11. API, línea 999 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-031)

<a id="API-VEN-032"></a>
#### API-VEN-032 · `POST /api/public/{tenantSlug}/quotes/{token}/decision`

- **Qué hace:** Aceptar o rechazar. Registra la decisión sobre un registro de `decision`.
- **Para qué sirve:** RF-VEN-036: Al aceptarse, ofrecer o crear automáticamente (según configuración) el caso CRM y la OT en M10 con los ítems de mano de obra y materiales, dejando el vínculo presupuesto ↔ caso ↔ OT; al rechazar o anular, desvincular y cerrar el… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`, `token`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M11 §11. API, línea 1000 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-032)

<a id="API-VEN-033"></a>
#### API-VEN-033 · `GET /api/ven/my/quotes`

- **Qué hace:** Presupuestos del socio. Lista, con filtros y paginación, los registros de presupuestos con versiones, ítems y notas (`salesQuotes`).
- **Para qué sirve:** RF-VEN-032: Aceptación online: el destinatario acepta o rechaza (con motivo) una versión exacta desde la PWA (si es socio autenticado) o desde un enlace firmado con verificación por OTP al contacto registrado; se guarda evidencia (versión… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `ven.misPresupuestos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de presupuestos con versiones, ítems y notas (`salesQuotes`) con `total`.
- **Pantallas:** PAN-VEN-06 (Mis presupuestos y mis cuotas).
- **Ola:** O8 · **Fuente:** M11 §11. API, línea 1001 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-033)

<a id="API-VEN-034"></a>
#### API-VEN-034 · `POST /api/ven/my/quotes/{id}/decision`

- **Qué hace:** Aceptar/rechazar como socio. Registra la decisión sobre un registro de presupuestos con versiones, ítems y notas (`salesQuotes`).
- **Para qué sirve:** RF-VEN-032: Aceptación online: el destinatario acepta o rechaza (con motivo) una versión exacta desde la PWA (si es socio autenticado) o desde un enlace firmado con verificación por OTP al contacto registrado; se guarda evidencia (versión… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `ven.misPresupuestos.aceptar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-VEN-05 (Aceptación online del presupuesto).
- **Ola:** O8 · **Fuente:** M11 §11. API, línea 1002 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-034)

<a id="API-VEN-035"></a>
#### API-VEN-035 · `GET /api/ven/my/installments`

- **Qué hace:** Cargos y cuotas del socio. Lista, con filtros y paginación, los registros de cuotas de venta (`salesInstallments`).
- **Para qué sirve:** RF-VEN-010: Mostrar al socio, en la PWA y en el resumen, cada cargo por operación con su origen, estado, modalidad y cronograma de cuotas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `ven.misCuotas.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de cuotas de venta (`salesInstallments`) con `total`.
- **Pantallas:** PAN-VEN-06 (Mis presupuestos y mis cuotas).
- **Ola:** O4 · **Fuente:** M11 §11. API, línea 1003 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-035)

<a id="API-VEN-040"></a>
#### API-VEN-040 · `GET /api/admin/ven/sales-orders`

- **Qué hace:** Listar ventas. Lista, con filtros y paginación, los registros de ventas de productos y servicios adicionales (`salesOrders`).
- **Para qué sirve:** RF-VEN-070: Ventas de servicios adicionales (artículos y servicios adicionales) administrados como productos del catálogo de M02 marcados vendibles por canal (equivale a PROD_SERV 1, 2, 3, 5 u otro). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.ventas.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ventas de productos y servicios adicionales (`salesOrders`) con `total`.
- **Pantallas:** PAN-VEN-08 (Ventas (listado)).
- **Ola:** O4 · **Fuente:** M11 §11. API, línea 1004 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-040)

<a id="API-VEN-041"></a>
#### API-VEN-041 · `POST /api/admin/ven/sales-orders`

- **Qué hace:** Crear venta. Da de alta un registro de ventas de productos y servicios adicionales (`salesOrders`).
- **Para qué sirve:** RF-VEN-093: Recibir de M05 las importaciones de terceros con destino "venta con cuotas" (formatos EMA, SAM, EME, CT1, FAR, IAL, CEL) y crear las ventas y cuotas con numeración sin huecos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.ventas.crear`.
- **Recibe:** los datos de ventas de productos y servicios adicionales (`salesOrders`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de ventas de productos y servicios adicionales (`salesOrders`).
- **Pantallas:** PAN-VEN-07 (Presupuesto y venta en campo).
- **Ola:** O4 · **Fuente:** M11 §11. API, línea 1005 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-041)

<a id="API-VEN-042"></a>
#### API-VEN-042 · `PATCH /api/admin/ven/sales-orders/{id}`

- **Qué hace:** Editar borrador. Modifica algunos campos de un registro de ventas de productos y servicios adicionales (`salesOrders`) (solo los enviados).
- **Para qué sirve:** RF-VEN-070: Ventas de servicios adicionales (artículos y servicios adicionales) administrados como productos del catálogo de M02 marcados vendibles por canal (equivale a PROD_SERV 1, 2, 3, 5 u otro). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.ventas.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de ventas de productos y servicios adicionales (`salesOrders`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de ventas de productos y servicios adicionales (`salesOrders`).
- **Pantallas:** PAN-VEN-09 (Editor de venta).
- **Ola:** O4 · **Fuente:** M11 §11. API, línea 1006 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-042)

<a id="API-VEN-043"></a>
#### API-VEN-043 · `POST /api/admin/ven/sales-orders/{id}/confirm`

- **Qué hace:** Confirmar (riesgo, reserva, pide comprobante) Confirma un registro de ventas de productos y servicios adicionales (`salesOrders`).
- **Para qué sirve:** RF-VEN-035: Aprobar un presupuesto sin obra u OT asignada pide confirmación explícita cuando P2914 está activo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.ventas.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-VEN-07 (Presupuesto y venta en campo).
- **Ola:** O4 · **Fuente:** M11 §11. API, línea 1007 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-043)

<a id="API-VEN-044"></a>
#### API-VEN-044 · `POST /api/admin/ven/sales-orders/{id}/risk-override`

- **Qué hace:** Autorizar riesgo excedido. Fuerza la evaluación de riesgo de un registro de ventas de productos y servicios adicionales (`salesOrders`).
- **Para qué sirve:** RF-VEN-070: Ventas de servicios adicionales (artículos y servicios adicionales) administrados como productos del catálogo de M02 marcados vendibles por canal (equivale a PROD_SERV 1, 2, 3, 5 u otro). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.riesgo.override`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O4 · **Fuente:** M11 §11. API, línea 1008 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-044)

<a id="API-VEN-045"></a>
#### API-VEN-045 · `POST /api/admin/ven/sales-orders/{id}/cancel`

- **Qué hace:** Anular. Cancela un registro de ventas de productos y servicios adicionales (`salesOrders`).
- **Para qué sirve:** RF-VEN-070: Ventas de servicios adicionales (artículos y servicios adicionales) administrados como productos del catálogo de M02 marcados vendibles por canal (equivale a PROD_SERV 1, 2, 3, 5 u otro). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.ventas.anular`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-VEN-22 (Anulación de ventas por rango).
- **Ola:** O4 · **Fuente:** M11 §11. API, línea 1009 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-045)

<a id="API-VEN-046"></a>
#### API-VEN-046 · `POST /api/admin/ven/sales-orders/cancel-range`

- **Qué hace:** Anulación por rango (job) Registra un nuevo elemento u operación en ventas de productos y servicios adicionales (`salesOrders`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-VEN-062: Anular ventas individualmente o por rango (tipo, punto de venta, número desde/hasta) con permiso y respetando el cierre de ventas (P67); si el comprobante fiscal tiene CAE, la anulación se hace por NC de M05. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.ventas.anular`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-VEN-22 (Anulación de ventas por rango).
- **Ola:** O4 · **Fuente:** M11 §11. API, línea 1010 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-046)

<a id="API-VEN-047"></a>
#### API-VEN-047 · `POST /api/admin/ven/sales-orders/{id}/deliveries`

- **Qué hace:** Registrar entrega. Registra «deliveries» sobre un registro de ventas de productos y servicios adicionales (`salesOrders`).
- **Para qué sirve:** RF-VEN-050: Registrar ventas de productos y servicios adicionales con cabecera (cuenta/titular, servicio opcional, vendedor, condición y forma de pago, lote, descuento, moneda/cotización, observaciones y transporte) e ítems (producto… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.entregas.registrar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-VEN-12 (Entregas pendientes).
- **Ola:** O4 · **Fuente:** M11 §11. API, línea 1011 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-047)

<a id="API-VEN-048"></a>
#### API-VEN-048 · `GET /api/admin/ven/deliveries/pending`

- **Qué hace:** Vendido no entregado. Consulta entregas (`salesDeliveries`).
- **Para qué sirve:** RF-VEN-055: Entregas parciales y consulta de "vendido/facturado no entregado"; cada entrega registra cantidades, series, depósito, receptor, fecha y comprobante de entrega. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.entregas.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: el registro de entregas (`salesDeliveries`).
- **Ola:** O8 · **Fuente:** M11 §11. API, línea 1012 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-048)

<a id="API-VEN-049"></a>
#### API-VEN-049 · `POST /api/admin/ven/sales-orders/{id}/returns`

- **Qué hace:** Crear devolución. Registra «returns» sobre un registro de ventas de productos y servicios adicionales (`salesOrders`).
- **Para qué sirve:** RF-VEN-070: Ventas de servicios adicionales (artículos y servicios adicionales) administrados como productos del catálogo de M02 marcados vendibles por canal (equivale a PROD_SERV 1, 2, 3, 5 u otro). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.ventas.devolver`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-VEN-13 (Devoluciones).
- **Ola:** O4 · **Fuente:** M11 §11. API, línea 1013 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-049)

<a id="API-VEN-050"></a>
#### API-VEN-050 · `POST /api/admin/ven/returns/{id}/approve`

- **Qué hace:** Aprobar devolución. Aprueba un registro de devoluciones de venta (`salesReturns`).
- **Para qué sirve:** RF-VEN-102: Informe de ventas y presupuestos por vendedor (cantidad, importe, conversión, devoluciones). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.ventas.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M11 §11. API, línea 1014 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-050)

<a id="API-VEN-051"></a>
#### API-VEN-051 · `POST /api/admin/ven/financing/simulate`

- **Qué hace:** Simular plan (cuotas, TEA, CFT) Simula sin efectos sobre `simulate`.
- **Para qué sirve:** RF-VEN-082: Mostrar simulación del plan con anticipo, cuotas, tasa nominal, TEA y costo financiero total (CFT) antes de confirmar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.ventas.ver`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-VEN-08 (Ventas (listado)).
- **Ola:** O4 · **Fuente:** M11 §11. API, línea 1015 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-051)

<a id="API-VEN-052"></a>
#### API-VEN-052 · `GET /api/admin/ven/financing-plans`

- **Qué hace:** ABM planes. Lista, con filtros y paginación, los registros de planes de financiación comercial (`salesFinancingPlans`).
- **Para qué sirve:** RF-VEN-080: Configurar planes de financiación comercial: cantidad de cuotas, anticipo mínimo, tasa y método (sin interés, francés, directo), sellado, máximo por cuota, periodicidad, tipo de cuota y vigencia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.planes.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de planes de financiación comercial (`salesFinancingPlans`) con `total`.
- **Pantallas:** PAN-VEN-19 (Planes de financiación comercial).
- **Ola:** O4 · **Fuente:** M11 §11. API, línea 1016 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-052)

<a id="API-VEN-052-b"></a>
#### API-VEN-052-b · `POST /api/admin/ven/financing-plans`

- **Qué hace:** ABM planes. Da de alta un registro de planes de financiación comercial (`salesFinancingPlans`).
- **Para qué sirve:** RF-VEN-080: Configurar planes de financiación comercial: cantidad de cuotas, anticipo mínimo, tasa y método (sin interés, francés, directo), sellado, máximo por cuota, periodicidad, tipo de cuota y vigencia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.planes.configurar`.
- **Recibe:** los datos de planes de financiación comercial (`salesFinancingPlans`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de planes de financiación comercial (`salesFinancingPlans`).
- **Pantallas:** PAN-VEN-19 (Planes de financiación comercial).
- **Ola:** O4 · **Fuente:** M11 §11. API, línea 1016 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-052-b)

<a id="API-VEN-053"></a>
#### API-VEN-053 · `GET /api/admin/ven/installments`

- **Qué hace:** Listar cuotas. Lista, con filtros y paginación, los registros de cuotas de venta (`salesInstallments`).
- **Para qué sirve:** RF-VEN-023: Registrar notas de presupuesto con título, texto, fecha y usuario; listarlas e imprimirlas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.cuotas.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de cuotas de venta (`salesInstallments`) con `total`.
- **Pantallas:** PAN-VEN-14 (Cuotas de venta).
- **Ola:** O4 · **Fuente:** M11 §11. API, línea 1017 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-053)

<a id="API-VEN-054"></a>
#### API-VEN-054 · `PATCH /api/admin/ven/installments/{id}`

- **Qué hace:** Editar cuota sin facturar. Modifica algunos campos de un registro de cuotas de venta (`salesInstallments`) (solo los enviados).
- **Para qué sirve:** RF-VEN-059: Solicitar a M05 el comprobante fiscal de la venta: contado inmediato (esperando CAE antes de entregar si P727), venta en cuotas según el modelo fiscal configurado (factura total con concepto "factura en cuotas" P403 o factura por… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.cuotas.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de cuotas de venta (`salesInstallments`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de cuotas de venta (`salesInstallments`).
- **Ola:** O4 · **Fuente:** M11 §11. API, línea 1018 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-054)

<a id="API-VEN-055"></a>
#### API-VEN-055 · `POST /api/admin/ven/installments/bulk-update`

- **Qué hace:** Modificación masiva (preview/confirm) Actualiza en forma masiva sobre cuotas de venta (`salesInstallments`).
- **Para qué sirve:** RF-VEN-088: Modificación masiva de cuotas pendientes (sin factura, no anuladas): importe de un producto por porcentaje repartido proporcional a capital, costo del producto (diferencia contra el último precio usado), desplazar vencimientos N… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.cuotas.modificarMasivo`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-VEN-15 (Modificación masiva de cuotas).
- **Ola:** O4 · **Fuente:** M11 §11. API, línea 1019 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-055)

<a id="API-VEN-056"></a>
#### API-VEN-056 · `POST /api/admin/ven/installments/early-payoff`

- **Qué hace:** Cancelación anticipada. Registra un nuevo elemento u operación en cuotas de venta (`salesInstallments`).
- **Para qué sirve:** RF-VEN-083: Estados de cuota: programada, facturada, cobrada parcial, cobrada, cancelada anticipadamente, anulada; el estado de cobro proviene de la imputación de M07. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.cuotas.cancelarAnticipado`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O4 · **Fuente:** M11 §11. API, línea 1020 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-056)

<a id="API-VEN-060"></a>
#### API-VEN-060 · `GET /api/admin/ven/sales-reps`

- **Qué hace:** ABM vendedores. Lista, con filtros y paginación, los registros de vendedores (`salesReps`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.vendedores.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de vendedores (`salesReps`) con `total`.
- **Pantallas:** PAN-VEN-16 (Vendedores).
- **Ola:** O8 · **Fuente:** M11 §11. API, línea 1021 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-060)

<a id="API-VEN-060-b"></a>
#### API-VEN-060-b · `POST /api/admin/ven/sales-reps`

- **Qué hace:** ABM vendedores. Da de alta un registro de vendedores (`salesReps`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.vendedores.ver`.
- **Recibe:** los datos de vendedores (`salesReps`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de vendedores (`salesReps`).
- **Pantallas:** PAN-VEN-16 (Vendedores).
- **Ola:** O8 · **Fuente:** M11 §11. API, línea 1021 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-060-b)

<a id="API-VEN-061"></a>
#### API-VEN-061 · `GET /api/admin/ven/price-lists`

- **Qué hace:** Listas de precios. Lista, con filtros y paginación, los registros de listas de precios de productos (`salesPriceLists`).
- **Para qué sirve:** RF-VEN-051: Administrar listas de precios de venta de artículos con vigencia, moneda y canal (mostrador, campo, portal), sin afectar las tarifas de servicios de M04. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.precios.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de listas de precios de productos (`salesPriceLists`) con `total`.
- **Pantallas:** PAN-VEN-17 (Listas de precios y actualización masiva).
- **Ola:** O8 · **Fuente:** M11 §11. API, línea 1022 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-061)

<a id="API-VEN-061-b"></a>
#### API-VEN-061-b · `POST /api/admin/ven/price-lists`

- **Qué hace:** Listas de precios. Da de alta un registro de listas de precios de productos (`salesPriceLists`).
- **Para qué sirve:** RF-VEN-051: Administrar listas de precios de venta de artículos con vigencia, moneda y canal (mostrador, campo, portal), sin afectar las tarifas de servicios de M04. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.precios.ver`.
- **Recibe:** los datos de listas de precios de productos (`salesPriceLists`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de listas de precios de productos (`salesPriceLists`).
- **Pantallas:** PAN-VEN-17 (Listas de precios y actualización masiva).
- **Ola:** O8 · **Fuente:** M11 §11. API, línea 1022 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-061-b)

<a id="API-VEN-062"></a>
#### API-VEN-062 · `POST /api/admin/ven/price-lists/bulk-update`

- **Qué hace:** Actualización masiva (preview/confirm) Actualiza en forma masiva sobre listas de precios de productos (`salesPriceLists`).
- **Para qué sirve:** RF-VEN-053: Actualización masiva de precios de venta por filtros (rango de código, departamento, rubro, tipo, servicio, proveedor, plan/etapa de vivienda) y modos porcentaje, coeficiente, cotización del dólar (precio × cotización nueva /… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.precios.actualizarMasivo`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M11 §11. API, línea 1023 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-062)

<a id="API-VEN-063"></a>
#### API-VEN-063 · `GET /api/admin/ven/discount-rules`

- **Qué hace:** Reglas de recargo/descuento. Lista, con filtros y paginación, los registros de recargos y descuentos comerciales (`salesDiscountRules`).
- **Para qué sirve:** RF-VEN-052: Reglas de recargo o descuento por producto: aplican si la cuenta tiene la propiedad y valor exigidos, coincide el tipo de titular (activo/no activo) y la forma de pago, no tiene deuda de comprobantes excluidos (o ninguna vencida… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.descuentos.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de recargos y descuentos comerciales (`salesDiscountRules`) con `total`.
- **Pantallas:** PAN-VEN-18 (Reglas de recargo y descuento).
- **Ola:** O8 · **Fuente:** M11 §11. API, línea 1024 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-063)

<a id="API-VEN-063-b"></a>
#### API-VEN-063-b · `POST /api/admin/ven/discount-rules`

- **Qué hace:** Reglas de recargo/descuento. Da de alta un registro de recargos y descuentos comerciales (`salesDiscountRules`).
- **Para qué sirve:** RF-VEN-052: Reglas de recargo o descuento por producto: aplican si la cuenta tiene la propiedad y valor exigidos, coincide el tipo de titular (activo/no activo) y la forma de pago, no tiene deuda de comprobantes excluidos (o ninguna vencida… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.descuentos.configurar`.
- **Recibe:** los datos de recargos y descuentos comerciales (`salesDiscountRules`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de recargos y descuentos comerciales (`salesDiscountRules`).
- **Pantallas:** PAN-VEN-18 (Reglas de recargo y descuento).
- **Ola:** O8 · **Fuente:** M11 §11. API, línea 1024 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-063-b)

<a id="API-VEN-064"></a>
#### API-VEN-064 · `POST /api/admin/ven/discount-rules/evaluate`

- **Qué hace:** Evaluar reglas para cuenta y producto. Evalúa sobre recargos y descuentos comerciales (`salesDiscountRules`).
- **Para qué sirve:** RF-VEN-052: Reglas de recargo o descuento por producto: aplican si la cuenta tiene la propiedad y valor exigidos, coincide el tipo de titular (activo/no activo) y la forma de pago, no tiene deuda de comprobantes excluidos (o ninguna vencida… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.ventas.ver`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-VEN-08 (Ventas (listado)).
- **Ola:** O8 · **Fuente:** M11 §11. API, línea 1025 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-064)

<a id="API-VEN-070"></a>
#### API-VEN-070 · `GET /api/admin/ven/pos/terminals`

- **Qué hace:** Terminales. Lista, con filtros y paginación, los registros de terminales de punto de venta (`posTerminals`).
- **Para qué sirve:** RF-VEN-104: POS de mostrador por sucursal: terminal configurada (punto de venta fiscal de M05, depósito, lista de precios, caja de M07), apertura y cierre de sesión con arqueo, venta rápida con lector de código de barras, cobro con varios… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.pos.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de terminales de punto de venta (`posTerminals`) con `total`.
- **Ola:** O8 · **Fuente:** M11 §11. API, línea 1026 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-070)

<a id="API-VEN-070-b"></a>
#### API-VEN-070-b · `POST /api/admin/ven/pos/terminals`

- **Qué hace:** Terminales. Da de alta un registro de terminales de punto de venta (`posTerminals`).
- **Para qué sirve:** RF-VEN-104: POS de mostrador por sucursal: terminal configurada (punto de venta fiscal de M05, depósito, lista de precios, caja de M07), apertura y cierre de sesión con arqueo, venta rápida con lector de código de barras, cobro con varios… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.pos.configurar`.
- **Recibe:** los datos de terminales de punto de venta (`posTerminals`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de terminales de punto de venta (`posTerminals`).
- **Ola:** O8 · **Fuente:** M11 §11. API, línea 1026 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-070-b)

<a id="API-VEN-071"></a>
#### API-VEN-071 · `POST /api/admin/ven/pos/sessions`

- **Qué hace:** Abrir sesión. Da de alta un registro de sesiones de punto de venta (`posSessions`).
- **Para qué sirve:** RF-VEN-104: POS de mostrador por sucursal: terminal configurada (punto de venta fiscal de M05, depósito, lista de precios, caja de M07), apertura y cierre de sesión con arqueo, venta rápida con lector de código de barras, cobro con varios… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.pos.abrir`.
- **Recibe:** los datos de sesiones de punto de venta (`posSessions`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de sesiones de punto de venta (`posSessions`).
- **Pantallas:** PAN-VEN-11 (Sesiones de POS y terminales).
- **Ola:** O8 · **Fuente:** M11 §11. API, línea 1027 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-071)

<a id="API-VEN-072"></a>
#### API-VEN-072 · `POST /api/admin/ven/pos/sessions/{id}/close`

- **Qué hace:** Cerrar con arqueo. Cierra un registro de sesiones de punto de venta (`posSessions`).
- **Para qué sirve:** RF-VEN-104: POS de mostrador por sucursal: terminal configurada (punto de venta fiscal de M05, depósito, lista de precios, caja de M07), apertura y cierre de sesión con arqueo, venta rápida con lector de código de barras, cobro con varios… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.pos.cerrar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M11 §11. API, línea 1028 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-072)

<a id="API-VEN-073"></a>
#### API-VEN-073 · `POST /api/admin/ven/pos/sessions/{id}/sales`

- **Qué hace:** Venta POS (crea, cobra, emite) Registra «sales» sobre un registro de sesiones de punto de venta (`posSessions`).
- **Para qué sirve:** RF-VEN-068: La venta de productos no exige pertenecer a un grupo de facturación (P2519): se emite en documento propio, salvo la excepción de RF-VEN-007. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.pos.operar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-VEN-10 (Venta rápida / POS).
- **Ola:** O8 · **Fuente:** M11 §11. API, línea 1029 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-073)

<a id="API-VEN-080"></a>
#### API-VEN-080 · `GET /api/admin/ven/freight-settlements`

- **Qué hace:** Rendiciones. Consulta `freight-settlements`.
- **Para qué sirve:** RF-VEN-108: Rendición de comprobantes de venta según cobranzas (P76) [VERIFICAR] su significado con una cooperativa que la tenga activa. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.rendiciones.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-VEN-20 (Rendiciones de viajes).
- **Ola:** O8 · **Fuente:** M11 §11. API, línea 1030 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-080)

<a id="API-VEN-080-b"></a>
#### API-VEN-080-b · `POST /api/admin/ven/freight-settlements`

- **Qué hace:** Rendiciones. Registra un nuevo elemento u operación en `freight-settlements`.
- **Para qué sirve:** RF-VEN-108: Rendición de comprobantes de venta según cobranzas (P76) [VERIFICAR] su significado con una cooperativa que la tenga activa. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.rendiciones.ver`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-VEN-20 (Rendiciones de viajes).
- **Ola:** O8 · **Fuente:** M11 §11. API, línea 1030 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-080-b)

<a id="API-VEN-090"></a>
#### API-VEN-090 · `GET /api/admin/ven/reports/{code}`

- **Qué hace:** Ejecutar reporte (sección 15) Obtiene el detalle de un registro de `reports`.
- **Para qué sirve:** RF-VEN-116: Todas las etiquetas por diccionario del tenant; documentos con plantillas del tenant; auditoría de cada cambio; aislamiento por tenant en consultas, exportaciones y APIs. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.ventas.exportar`.
- **Recibe:** en la ruta `code`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-VEN-23 (Reportes de ventas).
- **Ola:** O4 · **Fuente:** M11 §11. API, línea 1031 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-090)

<a id="API-VEN-091"></a>
#### API-VEN-091 · `GET /api/admin/ven/settings`

- **Qué hace:** Parámetros del módulo. Consulta `settings`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.config.configurar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-VEN-24 (Configuración de ventas).
- **Ola:** O4 · **Fuente:** M11 §11. API, línea 1032 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-091)

<a id="API-VEN-091-b"></a>
#### API-VEN-091-b · `PUT /api/admin/ven/settings`

- **Qué hace:** Parámetros del módulo. Reemplaza o configura `settings`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `ven.config.configurar`.
- **Recibe:** un cuerpo JSON cuya estructura detalla el anexo; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-VEN-24 (Configuración de ventas).
- **Ola:** O4 · **Fuente:** M11 §11. API, línea 1032 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-091-b)

<a id="API-VEN-092"></a>
#### API-VEN-092 · `GET /api/v1/ext/ven/quotes`

- **Qué hace:** Consulta para integraciones externas. Lista, con filtros y paginación, los registros de presupuestos con versiones, ítems y notas (`salesQuotes`).
- **Para qué sirve:** RF-VEN-023: Registrar notas de presupuesto con título, texto, fecha y usuario; listarlas e imprimirlas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); permiso `ven.presupuestos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de presupuestos con versiones, ítems y notas (`salesQuotes`) con `total`.
- **Pantallas:** PAN-VEN-02 (Presupuestos (listado)), PAN-VEN-21 (Flujo continuo (tablero)).
- **Ola:** O8 · **Fuente:** M11 §11. API, línea 1033 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-092)

<a id="API-VEN-092-b"></a>
#### API-VEN-092-b · `GET /api/v1/ext/ven/sales-orders`

- **Qué hace:** Consulta para integraciones externas. Lista, con filtros y paginación, los registros de ventas de productos y servicios adicionales (`salesOrders`).
- **Para qué sirve:** RF-VEN-070: Ventas de servicios adicionales (artículos y servicios adicionales) administrados como productos del catálogo de M02 marcados vendibles por canal (equivale a PROD_SERV 1, 2, 3, 5 u otro). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); permiso `ven.presupuestos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ventas de productos y servicios adicionales (`salesOrders`) con `total`.
- **Pantallas:** PAN-VEN-02 (Presupuestos (listado)), PAN-VEN-21 (Flujo continuo (tablero)).
- **Ola:** O4 · **Fuente:** M11 §11. API, línea 1033 · [Ver en Swagger](../18-swagger/index.html?api=m11-ven#/API/API-VEN-092-b)
