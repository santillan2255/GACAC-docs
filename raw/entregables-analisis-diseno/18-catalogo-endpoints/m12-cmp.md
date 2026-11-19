# Catálogo de endpoints · M12 · Compras y proveedores

Parte del [catálogo de endpoints](../18-catalogo-endpoints.md) (artefacto 7.1). Generado el 05-11-2026 con `_trabajo/gen_18_catalogo_endpoints.py` a partir de `18-openapi/`; no se edita a mano.

## Para qué sirve esta API

Conducir la adquisición de bienes y servicios de la cooperativa y su relación con proveedores, desde la necesidad interna hasta la obligación de pago lista para tesorería, con trazabilidad comercial, física, fiscal, financiera y contable (BASE §19, §78):

1. Proveedores completos: datos fiscales, CBU validados, regímenes de retención aplicables (asignados en M06), tipos de producto, personas autorizadas, rubros, valoraciones, observaciones, correspondencia y portal.
2. Circuito de compra con documentos formales y estados explícitos: solicitud de aprovisionamiento (SA) → solicitud de cotización / concurso / licitación → orden de compra (OC, incluidas liberaciones contra OC abierta, ex nota de pedido) → recepción/remito → comprobante de proveedor → orden de pago (OP).
3. Control de 3 vías (OC – recepción – factura) con tolerancias, excepciones aprobadas y bloqueo de pago (AGR-027): "se pidieron diez, llegaron seis y se facturaron diez: no se paga como si se hubieran recibido todos".
4. Compras por servicio y centro de costo (BASE §78 OPE-001): cada línea identifica servicio, destino, OT u obra y centro de costo, sin duplicar compras compartidas.
5. Aprobaciones por monto y nivel con workflow T11 y segregación de funciones (solicita / aprueba / recibe / autoriza el pago).
6. Orden de pago con aplicación de facturas y anticipos y aplicación de retenciones calculadas por el motor de M06 (CU-FIS-01); la ejecución financiera la hace M14.
7. Automatización de la carga: importación de Mis Comprobantes de ARCA como borradores, portal de proveedores y lectura de facturas por IA que propone y una persona confirma.

Detalle completo en el anexo M12, sección 1. Contrato navegable: [Swagger](../18-swagger/index.html?api=m12-cmp).

| Dato | Valor |
|---|---|
| Endpoints | 100 |
| Por método | GET 29, PATCH 10, POST 60, PUT 1 |
| Grupos funcionales | 1 |
| Con requisito citado en el anexo | 0 |
| Con requisito inferido (a confirmar) | 99 |
| Sin requisito identificable | 1 |

## Grupos funcionales

| Grupo | Endpoints | Qué agrupa (primeros endpoints) |
|---|---|---|
| [API](#grupo-1) | 100 | Listar proveedores.; Crear proveedor.; Ficha.… |

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

100 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-CMP-001](#API-CMP-001) | GET | `/api/admin/cmp/suppliers` | Listar proveedores. |
| [API-CMP-002](#API-CMP-002) | POST | `/api/admin/cmp/suppliers` | Crear proveedor. |
| [API-CMP-003](#API-CMP-003) | GET | `/api/admin/cmp/suppliers/{id}` | Ficha. |
| [API-CMP-004](#API-CMP-004) | PATCH | `/api/admin/cmp/suppliers/{id}` | Editar. |
| [API-CMP-005](#API-CMP-005) | POST | `/api/admin/cmp/suppliers/{id}/status` | Bloquear/activar/inactivar. |
| [API-CMP-006](#API-CMP-006) | POST | `/api/admin/cmp/suppliers/{id}/bank-accounts` | Alta/cambio de CBU (queda pendiente) |
| [API-CMP-007](#API-CMP-007) | POST | `/api/admin/cmp/suppliers/{id}/bank-accounts/{accountId}/approve` | Aprobar CBU. |
| [API-CMP-008](#API-CMP-008) | POST | `/api/admin/cmp/suppliers/{id}/evaluations` | Valoración. |
| [API-CMP-009](#API-CMP-009) | POST | `/api/admin/cmp/suppliers/{id}/notes` | Nota. |
| [API-CMP-010](#API-CMP-010) | POST | `/api/admin/cmp/suppliers/{id}/portal-invitations` | Invitar al portal. |
| [API-CMP-011](#API-CMP-011) | GET | `/api/admin/cmp/suppliers/{id}/ledger` | Cuenta corriente a fecha de corte. |
| [API-CMP-012](#API-CMP-012) | POST | `/api/admin/cmp/correspondence` | Circular o comunicación. |
| [API-CMP-013](#API-CMP-013) | GET | `/api/admin/cmp/catalogs/{kind}` | Conceptos, rubros, destinatarios, unidades, combustibles, modalidades. |
| [API-CMP-013-b](#API-CMP-013-b) | POST | `/api/admin/cmp/catalogs/{kind}` | Conceptos, rubros, destinatarios, unidades, combustibles, modalidades. |
| [API-CMP-013-c](#API-CMP-013-c) | PATCH | `/api/admin/cmp/catalogs/{kind}` | Conceptos, rubros, destinatarios, unidades, combustibles, modalidades. |
| [API-CMP-014](#API-CMP-014) | GET | `/api/admin/cmp/forecasts` | Previsiones. |
| [API-CMP-014-b](#API-CMP-014-b) | POST | `/api/admin/cmp/forecasts` | Previsiones. |
| [API-CMP-014-c](#API-CMP-014-c) | PATCH | `/api/admin/cmp/forecasts` | Previsiones. |
| [API-CMP-020](#API-CMP-020) | GET | `/api/admin/cmp/supply-requests` | Listar SA. |
| [API-CMP-021](#API-CMP-021) | POST | `/api/admin/cmp/supply-requests` | Crear SA. |
| [API-CMP-022](#API-CMP-022) | PATCH | `/api/admin/cmp/supply-requests/{id}` | Editar borrador. |
| [API-CMP-023](#API-CMP-023) | POST | `/api/admin/cmp/supply-requests/{id}/submit` | Enviar a aprobación. |
| [API-CMP-024](#API-CMP-024) | POST | `/api/admin/cmp/supply-requests/{id}/decision` | Aprobar/rechazar. |
| [API-CMP-025](#API-CMP-025) | POST | `/api/admin/cmp/supply-requests/bulk-approve` | Aprobación masiva (job) |
| [API-CMP-026](#API-CMP-026) | POST | `/api/admin/cmp/supply-requests/{id}/take` | Transiciones. |
| [API-CMP-026-b](#API-CMP-026-b) | POST | `/api/admin/cmp/supply-requests/{id}/discard` | Transiciones. |
| [API-CMP-026-c](#API-CMP-026-c) | POST | `/api/admin/cmp/supply-requests/{id}/reopen` | Transiciones. |
| [API-CMP-026-d](#API-CMP-026-d) | POST | `/api/admin/cmp/supply-requests/{id}/cancel` | Transiciones. |
| [API-CMP-027](#API-CMP-027) | GET | `/api/admin/cmp/products/{productId}/commitments` | Disponibilidad comprometida y pedidos abiertos. |
| [API-CMP-030](#API-CMP-030) | POST | `/api/admin/cmp/quote-requests` | Generar cotizaciones desde SA. |
| [API-CMP-031](#API-CMP-031) | PATCH | `/api/admin/cmp/quote-requests/{id}` | Cargar precios. |
| [API-CMP-032](#API-CMP-032) | POST | `/api/admin/cmp/quote-requests/{id}/send` | Enviar / rechazar. |
| [API-CMP-032-b](#API-CMP-032-b) | POST | `/api/admin/cmp/quote-requests/{id}/reject` | Enviar / rechazar. |
| [API-CMP-033](#API-CMP-033) | GET | `/api/admin/cmp/quote-groups/{groupId}/comparison` | Cuadro comparativo. |
| [API-CMP-034](#API-CMP-034) | POST | `/api/admin/cmp/quote-groups/{groupId}/award` | Adjudicar ítems. |
| [API-CMP-035](#API-CMP-035) | GET | `/api/admin/cmp/sourcing-events` | Concursos y licitaciones. |
| [API-CMP-035-b](#API-CMP-035-b) | POST | `/api/admin/cmp/sourcing-events` | Concursos y licitaciones. |
| [API-CMP-035-c](#API-CMP-035-c) | PATCH | `/api/admin/cmp/sourcing-events` | Concursos y licitaciones. |
| [API-CMP-036](#API-CMP-036) | POST | `/api/admin/cmp/sourcing-events/{id}/open` | Apertura y adjudicación. |
| [API-CMP-036-b](#API-CMP-036-b) | POST | `/api/admin/cmp/sourcing-events/{id}/award` | Apertura y adjudicación. |
| [API-CMP-040](#API-CMP-040) | GET | `/api/admin/cmp/purchase-orders` | Listar OC. |
| [API-CMP-041](#API-CMP-041) | POST | `/api/admin/cmp/purchase-orders` | Crear OC (estándar, marco, liberación) |
| [API-CMP-042](#API-CMP-042) | PATCH | `/api/admin/cmp/purchase-orders/{id}` | Editar / nueva revisión. |
| [API-CMP-043](#API-CMP-043) | POST | `/api/admin/cmp/purchase-orders/{id}/submit` | Aprobación. |
| [API-CMP-043-b](#API-CMP-043-b) | POST | `/api/admin/cmp/purchase-orders/{id}/decision` | Aprobación. |
| [API-CMP-044](#API-CMP-044) | POST | `/api/admin/cmp/purchase-orders/{id}/send` | Enviar al proveedor. |
| [API-CMP-045](#API-CMP-045) | POST | `/api/admin/cmp/purchase-orders/{id}/close` | Cerrar / cancelar. |
| [API-CMP-045-b](#API-CMP-045-b) | POST | `/api/admin/cmp/purchase-orders/{id}/cancel` | Cerrar / cancelar. |
| [API-CMP-046](#API-CMP-046) | GET | `/api/admin/cmp/purchase-orders/{id}/traceability` | Trazabilidad por ítem. |
| [API-CMP-050](#API-CMP-050) | POST | `/api/admin/cmp/receipts` | Registrar recepción/conformidad/devolución. |
| [API-CMP-051](#API-CMP-051) | POST | `/api/admin/cmp/receipts/{id}/void` | Anular recepción. |
| [API-CMP-052](#API-CMP-052) | GET | `/api/admin/cmp/receipts/pending-invoice` | Recepciones sin factura. |
| [API-CMP-060](#API-CMP-060) | GET | `/api/admin/cmp/supplier-invoices` | Listar comprobantes. |
| [API-CMP-061](#API-CMP-061) | POST | `/api/admin/cmp/supplier-invoices` | Crear borrador o registrar. |
| [API-CMP-062](#API-CMP-062) | PATCH | `/api/admin/cmp/supplier-invoices/{id}` | Editar borrador. |
| [API-CMP-063](#API-CMP-063) | POST | `/api/admin/cmp/supplier-invoices/{id}/register` | Registrar (validaciones + conciliación) |
| [API-CMP-064](#API-CMP-064) | POST | `/api/admin/cmp/supplier-invoices/{id}/release` | Habilitación manual de pago. |
| [API-CMP-065](#API-CMP-065) | POST | `/api/admin/cmp/supplier-invoices/{id}/void` | Anular. |
| [API-CMP-066](#API-CMP-066) | POST | `/api/admin/cmp/supplier-invoices/validate` | Validar sin guardar (diferencias, duplicado, CAE) |
| [API-CMP-067](#API-CMP-067) | POST | `/api/admin/cmp/advances` | Anticipo a proveedor. |
| [API-CMP-070](#API-CMP-070) | GET | `/api/admin/cmp/match-exceptions` | Excepciones. |
| [API-CMP-071](#API-CMP-071) | POST | `/api/admin/cmp/match-exceptions/{id}/decision` | Decidir excepción. |
| [API-CMP-080](#API-CMP-080) | GET | `/api/admin/cmp/payment-orders` | Listar OP. |
| [API-CMP-081](#API-CMP-081) | POST | `/api/admin/cmp/payment-orders` | Crear OP en borrador. |
| [API-CMP-082](#API-CMP-082) | PATCH | `/api/admin/cmp/payment-orders/{id}` | Editar borrador. |
| [API-CMP-083](#API-CMP-083) | POST | `/api/admin/cmp/payment-orders/{id}/withholdings/calculate` | Recalcular retenciones (M06) |
| [API-CMP-084](#API-CMP-084) | POST | `/api/admin/cmp/payment-orders/{id}/withholdings/{wid}/adjust` | Ajuste manual con motivo. |
| [API-CMP-085](#API-CMP-085) | POST | `/api/admin/cmp/payment-orders/{id}/submit` | Aprobación. |
| [API-CMP-085-b](#API-CMP-085-b) | POST | `/api/admin/cmp/payment-orders/{id}/decision` | Aprobación. |
| [API-CMP-086](#API-CMP-086) | POST | `/api/admin/cmp/payment-orders/{id}/cancel` | Cancelar OP. |
| [API-CMP-087](#API-CMP-087) | POST | `/api/admin/cmp/payment-orders/bulk-send` | Envío masivo de OP y certificados. |
| [API-CMP-090](#API-CMP-090) | GET | `/api/admin/cmp/inbox/portal` | Bandejas de recibidos. |
| [API-CMP-090-b](#API-CMP-090-b) | GET | `/api/admin/cmp/inbox/arca` | Bandejas de recibidos. |
| [API-CMP-091](#API-CMP-091) | POST | `/api/admin/cmp/inbox/portal/{id}/decision` | Registrar o rechazar envío del portal. |
| [API-CMP-092](#API-CMP-092) | POST | `/api/admin/cmp/ai-extractions` | Subir PDF para lectura IA. |
| [API-CMP-093](#API-CMP-093) | POST | `/api/admin/cmp/ai-extractions/{id}/accept` | Confirmar propuesta (crea borrador) |
| [API-CMP-100](#API-CMP-100) | GET | `/api/admin/cmp/reports/{code}` | Reportes de la sección 15. |
| [API-CMP-101](#API-CMP-101) | GET | `/api/admin/cmp/settings` | Parámetros. |
| [API-CMP-101-b](#API-CMP-101-b) | PUT | `/api/admin/cmp/settings` | Parámetros. |
| [API-CMP-110](#API-CMP-110) | GET | `/api/public/{tenantSlug}/supplier-portal/orders` | Consultas del portal. |
| [API-CMP-110-b](#API-CMP-110-b) | GET | `/api/public/{tenantSlug}/supplier-portal/quotes` | Consultas del portal. |
| [API-CMP-110-c](#API-CMP-110-c) | GET | `/api/public/{tenantSlug}/supplier-portal/invoices` | Consultas del portal. |
| [API-CMP-112](#API-CMP-112) | POST | `/api/public/{tenantSlug}/supplier-portal/invoices` | Subir comprobante con PDF. |
| [API-CMP-110-d](#API-CMP-110-d) | GET | `/api/public/{tenantSlug}/supplier-portal/payments` | Consultas del portal. |
| [API-CMP-110-e](#API-CMP-110-e) | GET | `/api/public/{tenantSlug}/supplier-portal/certificates` | Consultas del portal. |
| [API-CMP-111](#API-CMP-111) | POST | `/api/public/{tenantSlug}/supplier-portal/quotes/{id}` | Cargar oferta. |
| [API-CMP-113](#API-CMP-113) | POST | `/api/public/{tenantSlug}/supplier-portal/orders/{id}/acknowledge` | Confirmar OC y fecha. |
| [API-CMP-120](#API-CMP-120) | GET | `/api/v1/ext/cmp/purchase-orders` | Consulta para integraciones/BI. |
| [API-CMP-120-b](#API-CMP-120-b) | GET | `/api/v1/ext/cmp/supplier-invoices` | Consulta para integraciones/BI. |
| [API-CMP-121](#API-CMP-121) | POST | `/api/admin/cmp/wholesale-supply/imports` | Importar archivo de factura mayorista de energía o gas (FI-INT-33; HUE-ELE-01, HUE-GAS-04) |
| [API-CMP-122](#API-CMP-122) | GET | `/api/admin/cmp/supply-balances` | Consultar y aprobar el balance comprado contra facturado. |
| [API-CMP-122-b](#API-CMP-122-b) | POST | `/api/admin/cmp/supply-balances` | Consultar y aprobar el balance comprado contra facturado. |
| [API-CMP-122-c](#API-CMP-122-c) | POST | `/api/admin/cmp/supply-balances/{id}/approve` | Consultar y aprobar el balance comprado contra facturado. |
| [API-CMP-123](#API-CMP-123) | GET | `/api/admin/cmp/signal-rights/contracts` | Contratos de derechos de señales (HUE-TV-01) |
| [API-CMP-123-b](#API-CMP-123-b) | POST | `/api/admin/cmp/signal-rights/contracts` | Contratos de derechos de señales (HUE-TV-01) |
| [API-CMP-123-c](#API-CMP-123-c) | PATCH | `/api/admin/cmp/signal-rights/contracts` | Contratos de derechos de señales (HUE-TV-01) |
| [API-CMP-124](#API-CMP-124) | GET | `/api/admin/cmp/signal-rights/settlements` | Ejecutar, aprobar y exportar liquidaciones (HUE-TV-01) |
| [API-CMP-124-b](#API-CMP-124-b) | POST | `/api/admin/cmp/signal-rights/settlements` | Ejecutar, aprobar y exportar liquidaciones (HUE-TV-01) |
| [API-CMP-124-c](#API-CMP-124-c) | POST | `/api/admin/cmp/signal-rights/settlements/{id}/approve` | Ejecutar, aprobar y exportar liquidaciones (HUE-TV-01) |
| [API-CMP-124-d](#API-CMP-124-d) | POST | `/api/admin/cmp/signal-rights/settlements/{id}/declaration` | Ejecutar, aprobar y exportar liquidaciones (HUE-TV-01) |

<a id="API-CMP-001"></a>
#### API-CMP-001 · `GET /api/admin/cmp/suppliers`

- **Qué hace:** Listar proveedores. Lista, con filtros y paginación, los registros de proveedores (`suppliers`).
- **Para qué sirve:** RF-CMP-059: Listar OC pendientes de aprobación, incluidas las de proveedores "paga a otros". *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.proveedores.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de proveedores (`suppliers`) con `total`.
- **Pantallas:** PAN-CMP-01 (Proveedores (listado)).
- **Ola:** O3 · **Fuente:** M12 §11. API, línea 1205 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-001)

<a id="API-CMP-002"></a>
#### API-CMP-002 · `POST /api/admin/cmp/suppliers`

- **Qué hace:** Crear proveedor. Da de alta un registro de proveedores (`suppliers`).
- **Para qué sirve:** RF-CMP-120: Recibir de M06 los comprobantes recibidos que figuran en Mis Comprobantes de ARCA y no están registrados en M12, y crear borradores de comprobante de proveedor (proveedor por CUIT, tipo, punto, número, fecha, importes por… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.proveedores.crear`.
- **Recibe:** los datos de proveedores (`suppliers`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de proveedores (`suppliers`).
- **Ola:** O3 · **Fuente:** M12 §11. API, línea 1206 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-002)

<a id="API-CMP-003"></a>
#### API-CMP-003 · `GET /api/admin/cmp/suppliers/{id}`

- **Qué hace:** Ficha. Obtiene el detalle de un registro de proveedores (`suppliers`).
- **Para qué sirve:** RF-CMP-004: Mostrar y editar, desde la ficha del proveedor, los regímenes de retención aplicables, exclusiones y certificados de no retención con vigencia (los datos son de M06, withholdingAssignments); importar retenciones/alícuotas de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.proveedores.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de proveedores (`suppliers`).
- **Pantallas:** PAN-CMP-01 (Proveedores (listado)).
- **Ola:** O3 · **Fuente:** M12 §11. API, línea 1207 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-003)

<a id="API-CMP-004"></a>
#### API-CMP-004 · `PATCH /api/admin/cmp/suppliers/{id}`

- **Qué hace:** Editar. Modifica algunos campos de un registro de proveedores (`suppliers`) (solo los enviados).
- **Para qué sirve:** RF-CMP-004: Mostrar y editar, desde la ficha del proveedor, los regímenes de retención aplicables, exclusiones y certificados de no retención con vigencia (los datos son de M06, withholdingAssignments); importar retenciones/alícuotas de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.proveedores.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de proveedores (`suppliers`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de proveedores (`suppliers`).
- **Pantallas:** PAN-CMP-02 (Ficha del proveedor), PAN-CMP-19 (Comunicaciones y circulares).
- **Ola:** O3 · **Fuente:** M12 §11. API, línea 1208 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-004)

<a id="API-CMP-005"></a>
#### API-CMP-005 · `POST /api/admin/cmp/suppliers/{id}/status`

- **Qué hace:** Bloquear/activar/inactivar. Registra «status» sobre un registro de proveedores (`suppliers`).
- **Para qué sirve:** RF-CMP-001: ABM de proveedores: razón social, nombre de fantasía, CUIT, condición de IVA (SITIVA), inscripción IIBB y jurisdicciones, domicilio fiscal y comercial, teléfonos, emails, contacto, condición de pago por defecto, moneda, cuenta… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.proveedores.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CMP-02 (Ficha del proveedor), PAN-CMP-19 (Comunicaciones y circulares).
- **Ola:** O3 · **Fuente:** M12 §11. API, línea 1209 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-005)

<a id="API-CMP-006"></a>
#### API-CMP-006 · `POST /api/admin/cmp/suppliers/{id}/bank-accounts`

- **Qué hace:** Alta/cambio de CBU (queda pendiente) Registra «bank-accounts» sobre un registro de proveedores (`suppliers`).
- **Para qué sirve:** RF-CMP-003: CBU/CVU del proveedor: varias cuentas con descripción, banco, titular y CUIT del titular; validación de formato; cambio o alta de CBU con aprobación T11 y aviso al proveedor (prevención de fraude); cuenta preferida. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.proveedores.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CMP-02 (Ficha del proveedor), PAN-CMP-19 (Comunicaciones y circulares).
- **Ola:** O3 · **Fuente:** M12 §11. API, línea 1210 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-006)

<a id="API-CMP-007"></a>
#### API-CMP-007 · `POST /api/admin/cmp/suppliers/{id}/bank-accounts/{accountId}/approve`

- **Qué hace:** Aprobar CBU. Aprueba un registro de proveedores (`suppliers`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.proveedores.aprobarCbu`.
- **Recibe:** en la ruta `id`, `accountId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M12 §11. API, línea 1211 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-007)

<a id="API-CMP-008"></a>
#### API-CMP-008 · `POST /api/admin/cmp/suppliers/{id}/evaluations`

- **Qué hace:** Valoración. Registra «evaluations» sobre un registro de proveedores (`suppliers`).
- **Para qué sirve:** RF-CMP-017: Búsqueda y selección de proveedores por CUIT, código, nombre, rubro, tipo de producto y valoración (selector embebible en otros módulos y selección múltiple). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.proveedores.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CMP-02 (Ficha del proveedor), PAN-CMP-19 (Comunicaciones y circulares).
- **Ola:** O3 · **Fuente:** M12 §11. API, línea 1212 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-008)

<a id="API-CMP-009"></a>
#### API-CMP-009 · `POST /api/admin/cmp/suppliers/{id}/notes`

- **Qué hace:** Nota. Agrega un elemento («notes») a un registro de proveedores (`suppliers`).
- **Para qué sirve:** RF-CMP-054: OC abierta (marco) con precio y cantidad máximos por vigencia y liberaciones parciales (reemplaza la nota de pedido); consumo del saldo marco. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.proveedores.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CMP-02 (Ficha del proveedor), PAN-CMP-19 (Comunicaciones y circulares).
- **Ola:** O3 · **Fuente:** M12 §11. API, línea 1213 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-009)

<a id="API-CMP-010"></a>
#### API-CMP-010 · `POST /api/admin/cmp/suppliers/{id}/portal-invitations`

- **Qué hace:** Invitar al portal. Registra «portal-invitations» sobre un registro de proveedores (`suppliers`).
- **Para qué sirve:** RF-CMP-015: Acceso al portal de proveedores por invitación individual con usuario propio (T02), reemplazando la contraseña genérica y el "blanqueo" manual. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.proveedores.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CMP-02 (Ficha del proveedor), PAN-CMP-19 (Comunicaciones y circulares).
- **Ola:** O3 · **Fuente:** M12 §11. API, línea 1214 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-010)

<a id="API-CMP-011"></a>
#### API-CMP-011 · `GET /api/admin/cmp/suppliers/{id}/ledger`

- **Qué hace:** Cuenta corriente a fecha de corte. Consulta «ledger» de un registro de proveedores (`suppliers`).
- **Para qué sirve:** RF-CMP-016: Cuenta corriente del proveedor: comprobantes, pagos, anticipos, NC, saldo, vencidos y a vencer, con fecha de corte. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.comprobantes.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de proveedores (`suppliers`).
- **Pantallas:** PAN-CMP-11 (Comprobantes de proveedor (listado)), PAN-CMP-16 (Cuenta corriente y antigüedad de proveedores), PAN-CMP-18 (Previsiones de pagos) y 3 más.
- **Ola:** O3 · **Fuente:** M12 §11. API, línea 1215 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-011)

<a id="API-CMP-012"></a>
#### API-CMP-012 · `POST /api/admin/cmp/correspondence`

- **Qué hace:** Circular o comunicación. Da de alta un registro de circulares y envíos a proveedores (`supplierCorrespondence`).
- **Para qué sirve:** RF-CMP-012: Comunicaciones con el proveedor por email, SMS y WhatsApp (T09) con plantilla; circulares a proveedores (texto masivo por rubro o tipo) e historial de correspondencia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.proveedores.editar`.
- **Recibe:** los datos de circulares y envíos a proveedores (`supplierCorrespondence`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de circulares y envíos a proveedores (`supplierCorrespondence`).
- **Pantallas:** PAN-CMP-02 (Ficha del proveedor), PAN-CMP-19 (Comunicaciones y circulares).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1216 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-012)

<a id="API-CMP-013"></a>
#### API-CMP-013 · `GET /api/admin/cmp/catalogs/{kind}`

- **Qué hace:** Conceptos, rubros, destinatarios, unidades, combustibles, modalidades. Obtiene el detalle de un registro de `catalogs`.
- **Para qué sirve:** RF-CMP-030: Alta de SA con ítems de producto, concepto o texto libre: cantidad, unidad, costo estimado (con precio de última compra), solicitante, destinatario, criticidad (normal, alta, urgente), modalidad, fecha requerida, observaciones; y… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.catalogos.configurar`.
- **Recibe:** en la ruta `kind`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CMP-03 (Catálogos de compras).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1217 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-013)

<a id="API-CMP-013-b"></a>
#### API-CMP-013-b · `POST /api/admin/cmp/catalogs/{kind}`

- **Qué hace:** Conceptos, rubros, destinatarios, unidades, combustibles, modalidades. Registra un nuevo elemento u operación en `catalogs`.
- **Para qué sirve:** RF-CMP-030: Alta de SA con ítems de producto, concepto o texto libre: cantidad, unidad, costo estimado (con precio de última compra), solicitante, destinatario, criticidad (normal, alta, urgente), modalidad, fecha requerida, observaciones; y… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.catalogos.configurar`.
- **Recibe:** en la ruta `kind`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CMP-03 (Catálogos de compras).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1217 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-013-b)

<a id="API-CMP-013-c"></a>
#### API-CMP-013-c · `PATCH /api/admin/cmp/catalogs/{kind}`

- **Qué hace:** Conceptos, rubros, destinatarios, unidades, combustibles, modalidades. Modifica algunos campos de un registro de `catalogs` (solo los enviados).
- **Para qué sirve:** RF-CMP-030: Alta de SA con ítems de producto, concepto o texto libre: cantidad, unidad, costo estimado (con precio de última compra), solicitante, destinatario, criticidad (normal, alta, urgente), modalidad, fecha requerida, observaciones; y… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.catalogos.configurar`.
- **Recibe:** en la ruta `kind`; solo los campos a cambiar; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CMP-03 (Catálogos de compras).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1217 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-013-c)

<a id="API-CMP-014"></a>
#### API-CMP-014 · `GET /api/admin/cmp/forecasts`

- **Qué hace:** Previsiones. Lista, con filtros y paginación, los registros de previsiones de compra (`purchaseForecasts`).
- **Para qué sirve:** RF-CMP-140: Informes de compras (sección 15): SA por estado y aprobación, cotizaciones y comparativos, OC pendientes de recepción, recepciones pendientes de facturar, facturas sin OC, diferencias de comprobantes, cuenta corriente y… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.comprobantes.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de previsiones de compra (`purchaseForecasts`) con `total`.
- **Pantallas:** PAN-CMP-11 (Comprobantes de proveedor (listado)), PAN-CMP-16 (Cuenta corriente y antigüedad de proveedores), PAN-CMP-18 (Previsiones de pagos) y 3 más.
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1218 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-014)

<a id="API-CMP-014-b"></a>
#### API-CMP-014-b · `POST /api/admin/cmp/forecasts`

- **Qué hace:** Previsiones. Da de alta un registro de previsiones de compra (`purchaseForecasts`).
- **Para qué sirve:** RF-CMP-140: Informes de compras (sección 15): SA por estado y aprobación, cotizaciones y comparativos, OC pendientes de recepción, recepciones pendientes de facturar, facturas sin OC, diferencias de comprobantes, cuenta corriente y… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.comprobantes.ver`.
- **Recibe:** los datos de previsiones de compra (`purchaseForecasts`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de previsiones de compra (`purchaseForecasts`).
- **Pantallas:** PAN-CMP-11 (Comprobantes de proveedor (listado)), PAN-CMP-16 (Cuenta corriente y antigüedad de proveedores), PAN-CMP-18 (Previsiones de pagos) y 3 más.
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1218 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-014-b)

<a id="API-CMP-014-c"></a>
#### API-CMP-014-c · `PATCH /api/admin/cmp/forecasts`

- **Qué hace:** Previsiones. Modifica algunos campos de un registro de previsiones de compra (`purchaseForecasts`) (solo los enviados).
- **Para qué sirve:** RF-CMP-140: Informes de compras (sección 15): SA por estado y aprobación, cotizaciones y comparativos, OC pendientes de recepción, recepciones pendientes de facturar, facturas sin OC, diferencias de comprobantes, cuenta corriente y… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.comprobantes.ver`.
- **Recibe:** solo los campos a cambiar de previsiones de compra (`purchaseForecasts`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de previsiones de compra (`purchaseForecasts`).
- **Pantallas:** PAN-CMP-11 (Comprobantes de proveedor (listado)), PAN-CMP-16 (Cuenta corriente y antigüedad de proveedores), PAN-CMP-18 (Previsiones de pagos) y 3 más.
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1218 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-014-c)

<a id="API-CMP-020"></a>
#### API-CMP-020 · `GET /api/admin/cmp/supply-requests`

- **Qué hace:** Listar SA. Lista, con filtros y paginación, los registros de solicitudes de abastecimiento (`supplyRequests`).
- **Para qué sirve:** RF-CMP-059: Listar OC pendientes de aprobación, incluidas las de proveedores "paga a otros". *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.solicitudes.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de solicitudes de abastecimiento (`supplyRequests`) con `total`.
- **Pantallas:** PAN-CMP-04 (Solicitudes de aprovisionamiento).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1219 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-020)

<a id="API-CMP-021"></a>
#### API-CMP-021 · `POST /api/admin/cmp/supply-requests`

- **Qué hace:** Crear SA. Da de alta un registro de solicitudes de abastecimiento (`supplyRequests`).
- **Para qué sirve:** RF-CMP-039: Solicitar cotización de los materiales de una SA por mail con plantilla (P2888). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.solicitudes.crear`.
- **Recibe:** los datos de solicitudes de abastecimiento (`supplyRequests`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de solicitudes de abastecimiento (`supplyRequests`).
- **Pantallas:** PAN-CMP-05 (Editor de solicitud).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1220 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-021)

<a id="API-CMP-022"></a>
#### API-CMP-022 · `PATCH /api/admin/cmp/supply-requests/{id}`

- **Qué hace:** Editar borrador. Modifica algunos campos de un registro de solicitudes de abastecimiento (`supplyRequests`) (solo los enviados).
- **Para qué sirve:** RF-CMP-034: Estados: borrador, pendiente de aprobación, aprobada, rechazada, en proceso (compras la tomó), parcialmente procesada, procesada, descartada, anulada; reabrir ("marcar pendiente") con motivo. · RF-CMP-004: Mostrar y editar, desde la ficha del proveedor, los regímenes de retención aplicables, exclusiones y certificados de no retención con vigencia (los datos son de M06, withholdingAssignments); importar retenciones/alícuotas de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.solicitudes.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de solicitudes de abastecimiento (`supplyRequests`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de solicitudes de abastecimiento (`supplyRequests`).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1221 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-022)

<a id="API-CMP-023"></a>
#### API-CMP-023 · `POST /api/admin/cmp/supply-requests/{id}/submit`

- **Qué hace:** Enviar a aprobación. Envía a revisión o presenta un registro de solicitudes de abastecimiento (`supplyRequests`).
- **Para qué sirve:** RF-CMP-105: Certificados de retención: imprimir/enviar automáticamente al aprobar por régimen (P2038, P2040, P2042, P2044), con punto de venta de IIBB (P2012) y fecha de información según día límite (P2045), generados por M06. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.solicitudes.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CMP-05 (Editor de solicitud).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1222 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-023)

<a id="API-CMP-024"></a>
#### API-CMP-024 · `POST /api/admin/cmp/supply-requests/{id}/decision`

- **Qué hace:** Aprobar/rechazar. Registra la decisión sobre un registro de solicitudes de abastecimiento (`supplyRequests`).
- **Para qué sirve:** RF-CMP-034: Estados: borrador, pendiente de aprobación, aprobada, rechazada, en proceso (compras la tomó), parcialmente procesada, procesada, descartada, anulada; reabrir ("marcar pendiente") con motivo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.solicitudes.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1223 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-024)

<a id="API-CMP-025"></a>
#### API-CMP-025 · `POST /api/admin/cmp/supply-requests/bulk-approve`

- **Qué hace:** Aprobación masiva (job) Aprueba en forma masiva sobre solicitudes de abastecimiento (`supplyRequests`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-CMP-036: Aprobación masiva de SA filtradas por fecha y modalidad, con la misma capability e historial por documento. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.solicitudes.aprobar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1224 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-025)

<a id="API-CMP-026"></a>
#### API-CMP-026 · `POST /api/admin/cmp/supply-requests/{id}/take`

- **Qué hace:** Transiciones. Toma un registro de solicitudes de abastecimiento (`supplyRequests`).
- **Para qué sirve:** RF-CMP-033: Visibilidad: quien no puede aprobar ve solo SA aprobadas para procesar; filtro de vigencia en días (P2036) que sí excluye SA más antiguas que la vigencia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.solicitudes.procesar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1225 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-026)

<a id="API-CMP-026-b"></a>
#### API-CMP-026-b · `POST /api/admin/cmp/supply-requests/{id}/discard`

- **Qué hace:** Transiciones. Descarta un registro de solicitudes de abastecimiento (`supplyRequests`).
- **Para qué sirve:** RF-CMP-033: Visibilidad: quien no puede aprobar ve solo SA aprobadas para procesar; filtro de vigencia en días (P2036) que sí excluye SA más antiguas que la vigencia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.solicitudes.procesar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1225 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-026-b)

<a id="API-CMP-026-c"></a>
#### API-CMP-026-c · `POST /api/admin/cmp/supply-requests/{id}/reopen`

- **Qué hace:** Transiciones. Reabre un registro de solicitudes de abastecimiento (`supplyRequests`).
- **Para qué sirve:** RF-CMP-033: Visibilidad: quien no puede aprobar ve solo SA aprobadas para procesar; filtro de vigencia en días (P2036) que sí excluye SA más antiguas que la vigencia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.solicitudes.procesar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1225 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-026-c)

<a id="API-CMP-026-d"></a>
#### API-CMP-026-d · `POST /api/admin/cmp/supply-requests/{id}/cancel`

- **Qué hace:** Transiciones. Cancela un registro de solicitudes de abastecimiento (`supplyRequests`).
- **Para qué sirve:** RF-CMP-033: Visibilidad: quien no puede aprobar ve solo SA aprobadas para procesar; filtro de vigencia en días (P2036) que sí excluye SA más antiguas que la vigencia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.solicitudes.procesar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1225 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-026-d)

<a id="API-CMP-027"></a>
#### API-CMP-027 · `GET /api/admin/cmp/products/{productId}/commitments`

- **Qué hace:** Disponibilidad comprometida y pedidos abiertos. Consulta «commitments» de un registro de `commitments`.
- **Para qué sirve:** RF-CMP-038: Advertir si ya existe un pedido abierto del mismo producto o concepto (SA sin recibir u OC con saldo pendiente). · RF-CMP-037: Mostrar disponibilidad comprometida del producto: saldo de OC abiertas, facturas pendientes de recepción y presupuestos aprobados con obra (M11), junto con el stock de M13. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.solicitudes.ver`.
- **Recibe:** en la ruta `productId`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CMP-04 (Solicitudes de aprovisionamiento).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1226 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-027)

<a id="API-CMP-030"></a>
#### API-CMP-030 · `POST /api/admin/cmp/quote-requests`

- **Qué hace:** Generar cotizaciones desde SA. Da de alta un registro de pedidos de cotización (`quoteRequests`).
- **Para qué sirve:** RF-CMP-040: Generar solicitudes de cotización a uno o varios proveedores desde SA aprobadas (una por proveedor, agrupadas), con vencimiento configurable (default 15 días), moneda y cotización. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.cotizaciones.crear`.
- **Recibe:** los datos de pedidos de cotización (`quoteRequests`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de pedidos de cotización (`quoteRequests`).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1227 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-030)

<a id="API-CMP-031"></a>
#### API-CMP-031 · `PATCH /api/admin/cmp/quote-requests/{id}`

- **Qué hace:** Cargar precios. Modifica algunos campos de un registro de pedidos de cotización (`quoteRequests`) (solo los enviados).
- **Para qué sirve:** RF-CMP-041: Cargar precios cotizados por el comprador o por el proveedor en el portal (precio, validez, plazo de entrega, observación), mostrando costo anterior e IVA calculado según la situación de IVA de la cooperativa (P527); marcar… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.cotizaciones.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de pedidos de cotización (`quoteRequests`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de pedidos de cotización (`quoteRequests`).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1228 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-031)

<a id="API-CMP-032"></a>
#### API-CMP-032 · `POST /api/admin/cmp/quote-requests/{id}/send`

- **Qué hace:** Enviar / rechazar. Envía un registro de pedidos de cotización (`quoteRequests`).
- **Para qué sirve:** RF-CMP-041: Cargar precios cotizados por el comprador o por el proveedor en el portal (precio, validez, plazo de entrega, observación), mostrando costo anterior e IVA calculado según la situación de IVA de la cooperativa (P527); marcar… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.cotizaciones.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1229 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-032)

<a id="API-CMP-032-b"></a>
#### API-CMP-032-b · `POST /api/admin/cmp/quote-requests/{id}/reject`

- **Qué hace:** Enviar / rechazar. Rechaza un registro de pedidos de cotización (`quoteRequests`).
- **Para qué sirve:** RF-CMP-041: Cargar precios cotizados por el comprador o por el proveedor en el portal (precio, validez, plazo de entrega, observación), mostrando costo anterior e IVA calculado según la situación de IVA de la cooperativa (P527); marcar… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.cotizaciones.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1229 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-032-b)

<a id="API-CMP-033"></a>
#### API-CMP-033 · `GET /api/admin/cmp/quote-groups/{groupId}/comparison`

- **Qué hace:** Cuadro comparativo. Consulta «comparison» de un registro de `comparison`.
- **Para qué sirve:** RF-CMP-042: Cuadro comparativo de cotizaciones hermanas por ítem (precio, total en pesos P3119, plazo, valoración del proveedor) y últimas cotizaciones/órdenes del producto. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.cotizaciones.ver`.
- **Recibe:** en la ruta `groupId`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CMP-06 (Cotizaciones y comparativo).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1230 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-033)

<a id="API-CMP-034"></a>
#### API-CMP-034 · `POST /api/admin/cmp/quote-groups/{groupId}/award`

- **Qué hace:** Adjudicar ítems. Adjudica un registro de `award`.
- **Para qué sirve:** RF-CMP-045: Generar la OC desde los ítems adjudicados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.cotizaciones.evaluar`.
- **Recibe:** en la ruta `groupId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1231 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-034)

<a id="API-CMP-035"></a>
#### API-CMP-035 · `GET /api/admin/cmp/sourcing-events`

- **Qué hace:** Concursos y licitaciones. Lista, con filtros y paginación, los registros de concursos y comparativas (`sourcingEvents`).
- **Para qué sirve:** RF-CMP-044: Concursos de precios, concursos y licitaciones: numeración correlativa por modalidad, invitación por plantilla (P2893), pliego y adjuntos, recepción de ofertas en sobre cerrado hasta la fecha de apertura, acta de apertura… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.concursos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de concursos y comparativas (`sourcingEvents`) con `total`.
- **Pantallas:** PAN-CMP-07 (Concursos y licitaciones).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1232 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-035)

<a id="API-CMP-035-b"></a>
#### API-CMP-035-b · `POST /api/admin/cmp/sourcing-events`

- **Qué hace:** Concursos y licitaciones. Da de alta un registro de concursos y comparativas (`sourcingEvents`).
- **Para qué sirve:** RF-CMP-044: Concursos de precios, concursos y licitaciones: numeración correlativa por modalidad, invitación por plantilla (P2893), pliego y adjuntos, recepción de ofertas en sobre cerrado hasta la fecha de apertura, acta de apertura… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.concursos.editar`.
- **Recibe:** los datos de concursos y comparativas (`sourcingEvents`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de concursos y comparativas (`sourcingEvents`).
- **Pantallas:** PAN-CMP-07 (Concursos y licitaciones).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1232 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-035-b)

<a id="API-CMP-035-c"></a>
#### API-CMP-035-c · `PATCH /api/admin/cmp/sourcing-events`

- **Qué hace:** Concursos y licitaciones. Modifica algunos campos de un registro de concursos y comparativas (`sourcingEvents`) (solo los enviados).
- **Para qué sirve:** RF-CMP-044: Concursos de precios, concursos y licitaciones: numeración correlativa por modalidad, invitación por plantilla (P2893), pliego y adjuntos, recepción de ofertas en sobre cerrado hasta la fecha de apertura, acta de apertura… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.concursos.editar`.
- **Recibe:** solo los campos a cambiar de concursos y comparativas (`sourcingEvents`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de concursos y comparativas (`sourcingEvents`).
- **Pantallas:** PAN-CMP-07 (Concursos y licitaciones).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1232 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-035-c)

<a id="API-CMP-036"></a>
#### API-CMP-036 · `POST /api/admin/cmp/sourcing-events/{id}/open`

- **Qué hace:** Apertura y adjudicación. Abre un registro de concursos y comparativas (`sourcingEvents`).
- **Para qué sirve:** RF-CMP-044: Concursos de precios, concursos y licitaciones: numeración correlativa por modalidad, invitación por plantilla (P2893), pliego y adjuntos, recepción de ofertas en sobre cerrado hasta la fecha de apertura, acta de apertura… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.concursos.adjudicar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CMP-07 (Concursos y licitaciones).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1233 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-036)

<a id="API-CMP-036-b"></a>
#### API-CMP-036-b · `POST /api/admin/cmp/sourcing-events/{id}/award`

- **Qué hace:** Apertura y adjudicación. Adjudica un registro de concursos y comparativas (`sourcingEvents`).
- **Para qué sirve:** RF-CMP-044: Concursos de precios, concursos y licitaciones: numeración correlativa por modalidad, invitación por plantilla (P2893), pliego y adjuntos, recepción de ofertas en sobre cerrado hasta la fecha de apertura, acta de apertura… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.concursos.adjudicar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CMP-07 (Concursos y licitaciones).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1233 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-036-b)

<a id="API-CMP-040"></a>
#### API-CMP-040 · `GET /api/admin/cmp/purchase-orders`

- **Qué hace:** Listar OC. Lista, con filtros y paginación, los registros de órdenes de compra (`purchaseOrders`).
- **Para qué sirve:** RF-CMP-059: Listar OC pendientes de aprobación, incluidas las de proveedores "paga a otros". *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.ordenes.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de órdenes de compra (`purchaseOrders`) con `total`.
- **Pantallas:** PAN-CMP-08 (Órdenes de compra (listado)).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1234 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-040)

<a id="API-CMP-041"></a>
#### API-CMP-041 · `POST /api/admin/cmp/purchase-orders`

- **Qué hace:** Crear OC (estándar, marco, liberación) Da de alta un registro de órdenes de compra (`purchaseOrders`).
- **Para qué sirve:** RF-CMP-054: OC abierta (marco) con precio y cantidad máximos por vigencia y liberaciones parciales (reemplaza la nota de pedido); consumo del saldo marco. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.ordenes.crear`.
- **Recibe:** los datos de órdenes de compra (`purchaseOrders`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de órdenes de compra (`purchaseOrders`).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1235 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-041)

<a id="API-CMP-042"></a>
#### API-CMP-042 · `PATCH /api/admin/cmp/purchase-orders/{id}`

- **Qué hace:** Editar / nueva revisión. Modifica algunos campos de un registro de órdenes de compra (`purchaseOrders`) (solo los enviados).
- **Para qué sirve:** RF-CMP-055: Modificar una OC aprobada crea una nueva versión que vuelve a aprobación si cambia importe, proveedor o condiciones por encima de la tolerancia; historial de versiones. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.ordenes.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de órdenes de compra (`purchaseOrders`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de órdenes de compra (`purchaseOrders`).
- **Pantallas:** PAN-CMP-09 (Editor de orden de compra).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1236 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-042)

<a id="API-CMP-043"></a>
#### API-CMP-043 · `POST /api/admin/cmp/purchase-orders/{id}/submit`

- **Qué hace:** Aprobación. Envía a revisión o presenta un registro de órdenes de compra (`purchaseOrders`).
- **Para qué sirve:** RF-CMP-091: Crear una excepción por cada diferencia fuera de tolerancia con tipo (cantidad, precio, condición, sin OC, sin recepción), importe en disputa, causa y decisión (aceptar, reclamar NC, rechazar) aprobada por T11. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.ordenes.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1237 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-043)

<a id="API-CMP-043-b"></a>
#### API-CMP-043-b · `POST /api/admin/cmp/purchase-orders/{id}/decision`

- **Qué hace:** Aprobación. Registra la decisión sobre un registro de órdenes de compra (`purchaseOrders`).
- **Para qué sirve:** RF-CMP-091: Crear una excepción por cada diferencia fuera de tolerancia con tipo (cantidad, precio, condición, sin OC, sin recepción), importe en disputa, causa y decisión (aceptar, reclamar NC, rechazar) aprobada por T11. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.ordenes.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1237 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-043-b)

<a id="API-CMP-044"></a>
#### API-CMP-044 · `POST /api/admin/cmp/purchase-orders/{id}/send`

- **Qué hace:** Enviar al proveedor. Envía un registro de órdenes de compra (`purchaseOrders`).
- **Para qué sirve:** RF-CMP-053: Enviar la OC al proveedor por mail con plantilla (P2905) y publicarla en el portal; el proveedor confirma recepción y fecha comprometida. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.ordenes.enviar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1238 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-044)

<a id="API-CMP-045"></a>
#### API-CMP-045 · `POST /api/admin/cmp/purchase-orders/{id}/close`

- **Qué hace:** Cerrar / cancelar. Cierra un registro de órdenes de compra (`purchaseOrders`).
- **Para qué sirve:** RF-CMP-056: Cerrar (saldo no se recibirá) o cancelar una OC con motivo, liberando el compromiso de fondos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.ordenes.cerrar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1239 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-045)

<a id="API-CMP-045-b"></a>
#### API-CMP-045-b · `POST /api/admin/cmp/purchase-orders/{id}/cancel`

- **Qué hace:** Cerrar / cancelar. Cancela un registro de órdenes de compra (`purchaseOrders`).
- **Para qué sirve:** RF-CMP-056: Cerrar (saldo no se recibirá) o cancelar una OC con motivo, liberando el compromiso de fondos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.ordenes.cerrar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1239 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-045-b)

<a id="API-CMP-046"></a>
#### API-CMP-046 · `GET /api/admin/cmp/purchase-orders/{id}/traceability`

- **Qué hace:** Trazabilidad por ítem. Consulta «traceability» de un registro de órdenes de compra (`purchaseOrders`).
- **Para qué sirve:** RF-CMP-141: Trazabilidad documento a documento por ítem (origen y destino con cantidades y precios) en todos los documentos, no solo en el primer ítem. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.ordenes.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de órdenes de compra (`purchaseOrders`).
- **Pantallas:** PAN-CMP-08 (Órdenes de compra (listado)).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1240 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-046)

<a id="API-CMP-050"></a>
#### API-CMP-050 · `POST /api/admin/cmp/receipts`

- **Qué hace:** Registrar recepción/conformidad/devolución. Da de alta un registro de recepciones de bienes y servicios (`supplierReceipts`).
- **Para qué sirve:** RF-CMP-062: Conformidad de servicios sin recepción material (mantenimiento, honorarios): el responsable del servicio registra la conformidad total o parcial. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.recepciones.registrar`.
- **Recibe:** los datos de recepciones de bienes y servicios (`supplierReceipts`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de recepciones de bienes y servicios (`supplierReceipts`).
- **Pantallas:** PAN-CMP-10 (Recepciones), PAN-CMP-24 (Registro simplificado de ingreso (piloto)).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1241 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-050)

<a id="API-CMP-051"></a>
#### API-CMP-051 · `POST /api/admin/cmp/receipts/{id}/void`

- **Qué hace:** Anular recepción. Anula un registro de recepciones de bienes y servicios (`supplierReceipts`).
- **Para qué sirve:** RF-CMP-083: Anular un comprobante: nunca se borra; se marca anulado con motivo si no tiene OP aplicada ni período cerrado; libera vínculos (recepción, portal, IA, combustible) y emite evento de reversión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.recepciones.anular`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1242 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-051)

<a id="API-CMP-052"></a>
#### API-CMP-052 · `GET /api/admin/cmp/receipts/pending-invoice`

- **Qué hace:** Recepciones sin factura. Consulta recepciones de bienes y servicios (`supplierReceipts`).
- **Para qué sirve:** RF-CMP-062: Conformidad de servicios sin recepción material (mantenimiento, honorarios): el responsable del servicio registra la conformidad total o parcial. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.recepciones.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: el registro de recepciones de bienes y servicios (`supplierReceipts`).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1243 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-052)

<a id="API-CMP-060"></a>
#### API-CMP-060 · `GET /api/admin/cmp/supplier-invoices`

- **Qué hace:** Listar comprobantes. Lista, con filtros y paginación, los registros de comprobantes de proveedor (`supplierInvoices`).
- **Para qué sirve:** RF-CMP-059: Listar OC pendientes de aprobación, incluidas las de proveedores "paga a otros". *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.comprobantes.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de comprobantes de proveedor (`supplierInvoices`) con `total`.
- **Pantallas:** PAN-CMP-11 (Comprobantes de proveedor (listado)), PAN-CMP-16 (Cuenta corriente y antigüedad de proveedores), PAN-CMP-18 (Previsiones de pagos) y 3 más.
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1244 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-060)

<a id="API-CMP-061"></a>
#### API-CMP-061 · `POST /api/admin/cmp/supplier-invoices`

- **Qué hace:** Crear borrador o registrar. Da de alta un registro de comprobantes de proveedor (`supplierInvoices`).
- **Para qué sirve:** RF-CMP-120: Recibir de M06 los comprobantes recibidos que figuran en Mis Comprobantes de ARCA y no están registrados en M12, y crear borradores de comprobante de proveedor (proveedor por CUIT, tipo, punto, número, fecha, importes por… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.comprobantes.registrar`.
- **Recibe:** los datos de comprobantes de proveedor (`supplierInvoices`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de comprobantes de proveedor (`supplierInvoices`).
- **Pantallas:** PAN-CMP-12 (Editor de comprobante de proveedor), PAN-CMP-25 (Abastecimiento mayorista y balance (HUE-ELE-01, HUE-GAS-04)).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1245 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-061)

<a id="API-CMP-062"></a>
#### API-CMP-062 · `PATCH /api/admin/cmp/supplier-invoices/{id}`

- **Qué hace:** Editar borrador. Modifica algunos campos de un registro de comprobantes de proveedor (`supplierInvoices`) (solo los enviados).
- **Para qué sirve:** RF-CMP-121: Informe de diferencias entre compras registradas y Mis Comprobantes (faltantes, sobrantes, importes distintos), con acceso al borrador o al registrado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.comprobantes.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de comprobantes de proveedor (`supplierInvoices`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de comprobantes de proveedor (`supplierInvoices`).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1246 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-062)

<a id="API-CMP-063"></a>
#### API-CMP-063 · `POST /api/admin/cmp/supplier-invoices/{id}/register`

- **Qué hace:** Registrar (validaciones + conciliación) Registra un registro de comprobantes de proveedor (`supplierInvoices`).
- **Para qué sirve:** RF-CMP-071: Validaciones al registrar: proveedor, tipo, punto y número obligatorios; año razonable; período abierto de Compras, Stock y Contable; sin precios en cero; tipo permitido para la condición de IVA del proveedor (bloqueo o… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.comprobantes.registrar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CMP-12 (Editor de comprobante de proveedor), PAN-CMP-25 (Abastecimiento mayorista y balance (HUE-ELE-01, HUE-GAS-04)).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1247 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-063)

<a id="API-CMP-064"></a>
#### API-CMP-064 · `POST /api/admin/cmp/supplier-invoices/{id}/release`

- **Qué hace:** Habilitación manual de pago. Libera un registro de comprobantes de proveedor (`supplierInvoices`).
- **Para qué sirve:** RF-CMP-092: Habilitación de pago: automática si la factura concilia sin excepciones abiertas; manual con capability cmp.pago.habilitar y motivo en los demás casos. Reemplaza P2201/P2457 ("pago autorizado / no autorizado / autorizar mayores a… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.pago.habilitar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1248 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-064)

<a id="API-CMP-065"></a>
#### API-CMP-065 · `POST /api/admin/cmp/supplier-invoices/{id}/void`

- **Qué hace:** Anular. Anula un registro de comprobantes de proveedor (`supplierInvoices`).
- **Para qué sirve:** RF-CMP-083: Anular un comprobante: nunca se borra; se marca anulado con motivo si no tiene OP aplicada ni período cerrado; libera vínculos (recepción, portal, IA, combustible) y emite evento de reversión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.comprobantes.anular`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1249 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-065)

<a id="API-CMP-066"></a>
#### API-CMP-066 · `POST /api/admin/cmp/supplier-invoices/validate`

- **Qué hace:** Validar sin guardar (diferencias, duplicado, CAE) Valida sobre comprobantes de proveedor (`supplierInvoices`).
- **Para qué sirve:** RF-CMP-071: Validaciones al registrar: proveedor, tipo, punto y número obligatorios; año razonable; período abierto de Compras, Stock y Contable; sin precios en cero; tipo permitido para la condición de IVA del proveedor (bloqueo o… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.comprobantes.registrar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CMP-12 (Editor de comprobante de proveedor), PAN-CMP-25 (Abastecimiento mayorista y balance (HUE-ELE-01, HUE-GAS-04)).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1250 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-066)

<a id="API-CMP-067"></a>
#### API-CMP-067 · `POST /api/admin/cmp/advances`

- **Qué hace:** Anticipo a proveedor. Da de alta un registro de anticipos a proveedores (`supplierAdvances`).
- **Para qué sirve:** RF-CMP-120: Recibir de M06 los comprobantes recibidos que figuran en Mis Comprobantes de ARCA y no están registrados en M12, y crear borradores de comprobante de proveedor (proveedor por CUIT, tipo, punto, número, fecha, importes por… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.anticipos.crear`.
- **Recibe:** los datos de anticipos a proveedores (`supplierAdvances`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de anticipos a proveedores (`supplierAdvances`).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1251 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-067)

<a id="API-CMP-070"></a>
#### API-CMP-070 · `GET /api/admin/cmp/match-exceptions`

- **Qué hace:** Excepciones. Lista, con filtros y paginación, los registros de excepciones de conciliación de tres vías (`matchExceptions`).
- **Para qué sirve:** RF-CMP-094: Tablero de conciliación: facturas conciliadas, con excepción, retenidas, habilitadas; recepciones sin factura (pendientes de facturar) y facturas sin recepción. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.conciliacion.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de excepciones de conciliación de tres vías (`matchExceptions`) con `total`.
- **Pantallas:** PAN-CMP-13 (Conciliación de 3 vías).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1252 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-070)

<a id="API-CMP-071"></a>
#### API-CMP-071 · `POST /api/admin/cmp/match-exceptions/{id}/decision`

- **Qué hace:** Decidir excepción. Registra la decisión sobre un registro de excepciones de conciliación de tres vías (`matchExceptions`).
- **Para qué sirve:** RF-CMP-094: Tablero de conciliación: facturas conciliadas, con excepción, retenidas, habilitadas; recepciones sin factura (pendientes de facturar) y facturas sin recepción. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.conciliacion.aprobarExcepcion`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1253 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-071)

<a id="API-CMP-080"></a>
#### API-CMP-080 · `GET /api/admin/cmp/payment-orders`

- **Qué hace:** Listar OP. Lista, con filtros y paginación, los registros de órdenes de pago a proveedores (`paymentOrders`).
- **Para qué sirve:** RF-CMP-059: Listar OC pendientes de aprobación, incluidas las de proveedores "paga a otros". *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.ordenesPago.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de órdenes de pago a proveedores (`paymentOrders`) con `total`.
- **Pantallas:** PAN-CMP-14 (Órdenes de pago (listado)).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1254 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-080)

<a id="API-CMP-081"></a>
#### API-CMP-081 · `POST /api/admin/cmp/payment-orders`

- **Qué hace:** Crear OP en borrador. Da de alta un registro de órdenes de pago a proveedores (`paymentOrders`).
- **Para qué sirve:** RF-CMP-120: Recibir de M06 los comprobantes recibidos que figuran en Mis Comprobantes de ARCA y no están registrados en M12, y crear borradores de comprobante de proveedor (proveedor por CUIT, tipo, punto, número, fecha, importes por… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.ordenesPago.crear`.
- **Recibe:** los datos de órdenes de pago a proveedores (`paymentOrders`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de órdenes de pago a proveedores (`paymentOrders`).
- **Pantallas:** PAN-CMP-15 (Editor de orden de pago).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1255 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-081)

<a id="API-CMP-082"></a>
#### API-CMP-082 · `PATCH /api/admin/cmp/payment-orders/{id}`

- **Qué hace:** Editar borrador. Modifica algunos campos de un registro de órdenes de pago a proveedores (`paymentOrders`) (solo los enviados).
- **Para qué sirve:** RF-CMP-042: Cuadro comparativo de cotizaciones hermanas por ítem (precio, total en pesos P3119, plazo, valoración del proveedor) y últimas cotizaciones/órdenes del producto. · RF-CMP-004: Mostrar y editar, desde la ficha del proveedor, los regímenes de retención aplicables, exclusiones y certificados de no retención con vigencia (los datos son de M06, withholdingAssignments); importar retenciones/alícuotas de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.ordenesPago.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de órdenes de pago a proveedores (`paymentOrders`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de órdenes de pago a proveedores (`paymentOrders`).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1256 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-082)

<a id="API-CMP-083"></a>
#### API-CMP-083 · `POST /api/admin/cmp/payment-orders/{id}/withholdings/calculate`

- **Qué hace:** Recalcular retenciones (M06) Calcula sobre órdenes de pago a proveedores (`paymentOrders`).
- **Para qué sirve:** RF-CMP-004: Mostrar y editar, desde la ficha del proveedor, los regímenes de retención aplicables, exclusiones y certificados de no retención con vigencia (los datos son de M06, withholdingAssignments); importar retenciones/alícuotas de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.ordenesPago.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1257 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-083)

<a id="API-CMP-084"></a>
#### API-CMP-084 · `POST /api/admin/cmp/payment-orders/{id}/withholdings/{wid}/adjust`

- **Qué hace:** Ajuste manual con motivo. Ajusta un registro de órdenes de pago a proveedores (`paymentOrders`).
- **Para qué sirve:** RF-CMP-103: Ajuste manual de una retención (P2836) solo con capability cmp.retenciones.ajustar, motivo y aprobación; queda el valor calculado y el ajustado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.retenciones.ajustar`.
- **Recibe:** en la ruta `id`, `wid`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1258 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-084)

<a id="API-CMP-085"></a>
#### API-CMP-085 · `POST /api/admin/cmp/payment-orders/{id}/submit`

- **Qué hace:** Aprobación. Envía a revisión o presenta un registro de órdenes de pago a proveedores (`paymentOrders`).
- **Para qué sirve:** RF-CMP-091: Crear una excepción por cada diferencia fuera de tolerancia con tipo (cantidad, precio, condición, sin OC, sin recepción), importe en disputa, causa y decisión (aceptar, reclamar NC, rechazar) aprobada por T11. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.ordenesPago.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CMP-15 (Editor de orden de pago).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1259 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-085)

<a id="API-CMP-085-b"></a>
#### API-CMP-085-b · `POST /api/admin/cmp/payment-orders/{id}/decision`

- **Qué hace:** Aprobación. Registra la decisión sobre un registro de órdenes de pago a proveedores (`paymentOrders`).
- **Para qué sirve:** RF-CMP-091: Crear una excepción por cada diferencia fuera de tolerancia con tipo (cantidad, precio, condición, sin OC, sin recepción), importe en disputa, causa y decisión (aceptar, reclamar NC, rechazar) aprobada por T11. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.ordenesPago.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CMP-15 (Editor de orden de pago).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1259 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-085-b)

<a id="API-CMP-086"></a>
#### API-CMP-086 · `POST /api/admin/cmp/payment-orders/{id}/cancel`

- **Qué hace:** Cancelar OP. Cancela un registro de órdenes de pago a proveedores (`paymentOrders`).
- **Para qué sirve:** RF-CMP-106: Al recibir tes.paymentExecution.executed, marcar la OP pagada, cancelar saldos y actualizar la cuenta corriente; con tes.paymentExecution.voided o anulación de la OP, reponer saldos, anular anticipos generados (si su contraparte… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.ordenesPago.anular`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1260 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-086)

<a id="API-CMP-087"></a>
#### API-CMP-087 · `POST /api/admin/cmp/payment-orders/bulk-send`

- **Qué hace:** Envío masivo de OP y certificados. Registra un nuevo elemento u operación en órdenes de pago a proveedores (`paymentOrders`).
- **Para qué sirve:** RF-CMP-108: Opciones de OP: imprimir al emitir (P2018), mostrar asiento contable propuesto (P2308, desde M15), permitir modificar la fecha de la OP (P2572), pagar facturas con fecha contable posterior al pago (P110), plantilla para envío… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.ordenesPago.ver`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CMP-14 (Órdenes de pago (listado)).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1261 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-087)

<a id="API-CMP-090"></a>
#### API-CMP-090 · `GET /api/admin/cmp/inbox/portal`

- **Qué hace:** Bandejas de recibidos. Lista, con filtros y paginación, los registros de `portal`.
- **Para qué sirve:** RF-CMP-122: Recibir comprobantes cargados por el proveedor en el portal (datos + PDF), rechazar duplicados (CUIT + tipo + punto + número), revisar y registrar o rechazar con motivo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.portal.revisar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ResultadoGenerico (`ResultadoGenerico`) con `total`.
- **Pantallas:** PAN-CMP-17 (Bandeja de comprobantes recibidos (portal, ARCA, IA)).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1262 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-090)

<a id="API-CMP-090-b"></a>
#### API-CMP-090-b · `GET /api/admin/cmp/inbox/arca`

- **Qué hace:** Bandejas de recibidos. Lista, con filtros y paginación, los registros de `arca`.
- **Para qué sirve:** RF-CMP-122: Recibir comprobantes cargados por el proveedor en el portal (datos + PDF), rechazar duplicados (CUIT + tipo + punto + número), revisar y registrar o rechazar con motivo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.portal.revisar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ResultadoGenerico (`ResultadoGenerico`) con `total`.
- **Pantallas:** PAN-CMP-17 (Bandeja de comprobantes recibidos (portal, ARCA, IA)).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1262 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-090-b)

<a id="API-CMP-091"></a>
#### API-CMP-091 · `POST /api/admin/cmp/inbox/portal/{id}/decision`

- **Qué hace:** Registrar o rechazar envío del portal. Registra la decisión sobre un registro de `decision`.
- **Para qué sirve:** RF-CMP-122: Recibir comprobantes cargados por el proveedor en el portal (datos + PDF), rechazar duplicados (CUIT + tipo + punto + número), revisar y registrar o rechazar con motivo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.portal.revisar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CMP-17 (Bandeja de comprobantes recibidos (portal, ARCA, IA)).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1263 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-091)

<a id="API-CMP-092"></a>
#### API-CMP-092 · `POST /api/admin/cmp/ai-extractions`

- **Qué hace:** Subir PDF para lectura IA. Registra un nuevo elemento u operación en `ai-extractions`.
- **Para qué sirve:** RF-CMP-130: Lectura de facturas de proveedor (PDF/imagen) con IA: extrae cabecera, importes y alícuotas, distingue a la cooperativa (CUIT y razón social del tenant, P518/P519) del emisor, propone proveedor, ítems e imputación; una persona… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.ia.usar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CMP-17 (Bandeja de comprobantes recibidos (portal, ARCA, IA)).
- **Ola:** O11 · **Fuente:** M12 §11. API, línea 1264 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-092)

<a id="API-CMP-093"></a>
#### API-CMP-093 · `POST /api/admin/cmp/ai-extractions/{id}/accept`

- **Qué hace:** Confirmar propuesta (crea borrador) Acepta un registro de `accept`.
- **Para qué sirve:** RF-CMP-120: Recibir de M06 los comprobantes recibidos que figuran en Mis Comprobantes de ARCA y no están registrados en M12, y crear borradores de comprobante de proveedor (proveedor por CUIT, tipo, punto, número, fecha, importes por… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.ia.usar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CMP-17 (Bandeja de comprobantes recibidos (portal, ARCA, IA)).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1265 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-093)

<a id="API-CMP-100"></a>
#### API-CMP-100 · `GET /api/admin/cmp/reports/{code}`

- **Qué hace:** Reportes de la sección 15. Obtiene el detalle de un registro de `reports`.
- **Para qué sirve:** RF-CMP-155: Liquidación mensual de derechos de señales (JOB-CMP-09): por programadora y paquete, cantidad de abonados activos según el informe de abonados activos por paquete de M02 a la fecha de corte (RF-CAT-116, API-CAT-56 GET… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.reportes.exportar`.
- **Recibe:** en la ruta `code`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O10 · **Fuente:** M12 §11. API, línea 1266 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-100)

<a id="API-CMP-101"></a>
#### API-CMP-101 · `GET /api/admin/cmp/settings`

- **Qué hace:** Parámetros. Consulta `settings`.
- **Para qué sirve:** RF-CMP-148: Parámetros de caja de pagos y medios (P134, P135, P144, P146, P402, P2000–P2004, P2015, P2016, P2025, P2065, P2079, P2433, P2573, P3044, P2952) pertenecen a M14; M12 los respeta al preparar la OP (por ejemplo, pago diferido solo… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.config.configurar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CMP-21 (Configuración de compras).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1267 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-101)

<a id="API-CMP-101-b"></a>
#### API-CMP-101-b · `PUT /api/admin/cmp/settings`

- **Qué hace:** Parámetros. Reemplaza o configura `settings`.
- **Para qué sirve:** RF-CMP-148: Parámetros de caja de pagos y medios (P134, P135, P144, P146, P402, P2000–P2004, P2015, P2016, P2025, P2065, P2079, P2433, P2573, P3044, P2952) pertenecen a M14; M12 los respeta al preparar la OP (por ejemplo, pago diferido solo… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.config.configurar`.
- **Recibe:** un cuerpo JSON cuya estructura detalla el anexo; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CMP-21 (Configuración de compras).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1267 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-101-b)

<a id="API-CMP-110"></a>
#### API-CMP-110 · `GET /api/public/{tenantSlug}/supplier-portal/orders`

- **Qué hace:** Consultas del portal. Lista, con filtros y paginación, los registros de órdenes de pago a proveedores (`paymentOrders`).
- **Para qué sirve:** RF-CMP-145: Etiquetas por diccionario, plantillas por tenant, auditoría de todo cambio, aislamiento por tenant en consultas, exportaciones, portal y APIs. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); permiso `cmp.portal.verOrdenes`.
- **Recibe:** en la ruta `tenantSlug`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de órdenes de pago a proveedores (`paymentOrders`) con `total`.
- **Pantallas:** PAN-CMP-23 (Portal de proveedores).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1268 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-110)

<a id="API-CMP-110-b"></a>
#### API-CMP-110-b · `GET /api/public/{tenantSlug}/supplier-portal/quotes`

- **Qué hace:** Consultas del portal. Consulta `quotes`.
- **Para qué sirve:** RF-CMP-145: Etiquetas por diccionario, plantillas por tenant, auditoría de todo cambio, aislamiento por tenant en consultas, exportaciones, portal y APIs. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); permiso `cmp.portal.verOrdenes`.
- **Recibe:** en la ruta `tenantSlug`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CMP-23 (Portal de proveedores).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1268 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-110-b)

<a id="API-CMP-110-c"></a>
#### API-CMP-110-c · `GET /api/public/{tenantSlug}/supplier-portal/invoices`

- **Qué hace:** Consultas del portal. Lista, con filtros y paginación, los registros de comprobantes de proveedor (`supplierInvoices`).
- **Para qué sirve:** RF-CMP-145: Etiquetas por diccionario, plantillas por tenant, auditoría de todo cambio, aislamiento por tenant en consultas, exportaciones, portal y APIs. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); permiso `cmp.portal.verOrdenes`.
- **Recibe:** en la ruta `tenantSlug`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de comprobantes de proveedor (`supplierInvoices`) con `total`.
- **Pantallas:** PAN-CMP-23 (Portal de proveedores).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1268 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-110-c)

<a id="API-CMP-112"></a>
#### API-CMP-112 · `POST /api/public/{tenantSlug}/supplier-portal/invoices`

- **Qué hace:** Subir comprobante con PDF. Da de alta un registro de comprobantes de proveedor (`supplierInvoices`).
- **Para qué sirve:** RF-CMP-053: Enviar la OC al proveedor por mail con plantilla (P2905) y publicarla en el portal; el proveedor confirma recepción y fecha comprometida. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); permiso `cmp.portal.subirComprobante`.
- **Recibe:** en la ruta `tenantSlug`; los datos de comprobantes de proveedor (`supplierInvoices`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de comprobantes de proveedor (`supplierInvoices`).
- **Pantallas:** PAN-CMP-23 (Portal de proveedores).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1270 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-112)

<a id="API-CMP-110-d"></a>
#### API-CMP-110-d · `GET /api/public/{tenantSlug}/supplier-portal/payments`

- **Qué hace:** Consultas del portal. Consulta `payments`.
- **Para qué sirve:** RF-CMP-145: Etiquetas por diccionario, plantillas por tenant, auditoría de todo cambio, aislamiento por tenant en consultas, exportaciones, portal y APIs. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); permiso `cmp.portal.verOrdenes`.
- **Recibe:** en la ruta `tenantSlug`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CMP-23 (Portal de proveedores).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1268 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-110-d)

<a id="API-CMP-110-e"></a>
#### API-CMP-110-e · `GET /api/public/{tenantSlug}/supplier-portal/certificates`

- **Qué hace:** Consultas del portal. Consulta `certificates`.
- **Para qué sirve:** RF-CMP-145: Etiquetas por diccionario, plantillas por tenant, auditoría de todo cambio, aislamiento por tenant en consultas, exportaciones, portal y APIs. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); permiso `cmp.portal.verOrdenes`.
- **Recibe:** en la ruta `tenantSlug`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CMP-23 (Portal de proveedores).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1268 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-110-e)

<a id="API-CMP-111"></a>
#### API-CMP-111 · `POST /api/public/{tenantSlug}/supplier-portal/quotes/{id}`

- **Qué hace:** Cargar oferta. Registra un nuevo elemento u operación en `quotes`.
- **Para qué sirve:** RF-CMP-041: Cargar precios cotizados por el comprador o por el proveedor en el portal (precio, validez, plazo de entrega, observación), mostrando costo anterior e IVA calculado según la situación de IVA de la cooperativa (P527); marcar… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); permiso `cmp.portal.cotizar`.
- **Recibe:** en la ruta `tenantSlug`, `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CMP-23 (Portal de proveedores).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1269 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-111)

<a id="API-CMP-113"></a>
#### API-CMP-113 · `POST /api/public/{tenantSlug}/supplier-portal/orders/{id}/acknowledge`

- **Qué hace:** Confirmar OC y fecha. Toma conocimiento de un registro de órdenes de pago a proveedores (`paymentOrders`).
- **Para qué sirve:** RF-CMP-053: Enviar la OC al proveedor por mail con plantilla (P2905) y publicarla en el portal; el proveedor confirma recepción y fecha comprometida. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); permiso `cmp.portal.verOrdenes`.
- **Recibe:** en la ruta `tenantSlug`, `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CMP-23 (Portal de proveedores).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1271 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-113)

<a id="API-CMP-120"></a>
#### API-CMP-120 · `GET /api/v1/ext/cmp/purchase-orders`

- **Qué hace:** Consulta para integraciones/BI. Lista, con filtros y paginación, los registros de órdenes de compra (`purchaseOrders`).
- **Para qué sirve:** RF-CMP-144: Integrar el efecto contable en línea (DEC-009): cada comprobante, recepción con pendiente, retención y OP publica su evento con imputación para M15; cuenta de compras por defecto del proveedor (P2112) y cuenta de productos… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); permiso `cmp.ordenes.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de órdenes de compra (`purchaseOrders`) con `total`.
- **Pantallas:** PAN-CMP-08 (Órdenes de compra (listado)).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1272 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-120)

<a id="API-CMP-120-b"></a>
#### API-CMP-120-b · `GET /api/v1/ext/cmp/supplier-invoices`

- **Qué hace:** Consulta para integraciones/BI. Lista, con filtros y paginación, los registros de comprobantes de proveedor (`supplierInvoices`).
- **Para qué sirve:** RF-CMP-086: Integración con sueldos: comprobantes de proveedores-empleado y recibos pagados por OP (P2366) se informan a M16 sin que M12 genere novedades. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); permiso `cmp.ordenes.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de comprobantes de proveedor (`supplierInvoices`) con `total`.
- **Pantallas:** PAN-CMP-08 (Órdenes de compra (listado)).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1272 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-120-b)

<a id="API-CMP-121"></a>
#### API-CMP-121 · `POST /api/admin/cmp/wholesale-supply/imports`

- **Qué hace:** Importar archivo de factura mayorista de energía o gas (FI-INT-33; HUE-ELE-01, HUE-GAS-04) Registra un nuevo elemento u operación en `imports`.
- **Para qué sirve:** RF-CMP-149: Recibir la factura mensual del mayorista de energía (EPEC u otro mayorista configurado) por archivo (FI-INT-33) o carga manual, como comprobante de proveedor con wholesaleSupply.kind = energy y detalle por punto de compra o… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.comprobantes.registrar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CMP-12 (Editor de comprobante de proveedor), PAN-CMP-25 (Abastecimiento mayorista y balance (HUE-ELE-01, HUE-GAS-04)).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1273 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-121)

<a id="API-CMP-122"></a>
#### API-CMP-122 · `GET /api/admin/cmp/supply-balances`

- **Qué hace:** Consultar y aprobar el balance comprado contra facturado. Lista, con filtros y paginación, los registros de balance mensual de compra mayorista de energía o gas (`supplyBalances`).
- **Para qué sirve:** RF-CMP-151: Balance mensual comprado contra facturado por servicio y zona: cantidad comprada (facturas mayoristas aprobadas), cantidad medida en frontera (M03, API-MED-78 / RF-MED-129), cantidad facturada a usuarios del mismo período… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.comprobantes.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de balance mensual de compra mayorista de energía o gas (`supplyBalances`) con `total`.
- **Pantallas:** PAN-CMP-11 (Comprobantes de proveedor (listado)), PAN-CMP-16 (Cuenta corriente y antigüedad de proveedores), PAN-CMP-18 (Previsiones de pagos) y 3 más.
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1274 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-122)

<a id="API-CMP-122-b"></a>
#### API-CMP-122-b · `POST /api/admin/cmp/supply-balances`

- **Qué hace:** Consultar y aprobar el balance comprado contra facturado. Da de alta un registro de balance mensual de compra mayorista de energía o gas (`supplyBalances`).
- **Para qué sirve:** RF-CMP-151: Balance mensual comprado contra facturado por servicio y zona: cantidad comprada (facturas mayoristas aprobadas), cantidad medida en frontera (M03, API-MED-78 / RF-MED-129), cantidad facturada a usuarios del mismo período… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.abastecimiento.aprobar`.
- **Recibe:** los datos de balance mensual de compra mayorista de energía o gas (`supplyBalances`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de balance mensual de compra mayorista de energía o gas (`supplyBalances`).
- **Pantallas:** PAN-CMP-25 (Abastecimiento mayorista y balance (HUE-ELE-01, HUE-GAS-04)).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1274 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-122-b)

<a id="API-CMP-122-c"></a>
#### API-CMP-122-c · `POST /api/admin/cmp/supply-balances/{id}/approve`

- **Qué hace:** Consultar y aprobar el balance comprado contra facturado. Aprueba un registro de balance mensual de compra mayorista de energía o gas (`supplyBalances`).
- **Para qué sirve:** RF-CMP-151: Balance mensual comprado contra facturado por servicio y zona: cantidad comprada (facturas mayoristas aprobadas), cantidad medida en frontera (M03, API-MED-78 / RF-MED-129), cantidad facturada a usuarios del mismo período… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.abastecimiento.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CMP-25 (Abastecimiento mayorista y balance (HUE-ELE-01, HUE-GAS-04)).
- **Ola:** O8 · **Fuente:** M12 §11. API, línea 1274 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-122-c)

<a id="API-CMP-123"></a>
#### API-CMP-123 · `GET /api/admin/cmp/signal-rights/contracts`

- **Qué hace:** Contratos de derechos de señales (HUE-TV-01) Lista, con filtros y paginación, los registros de contratos de derechos de señales de TV por programadora (`signalRightsContracts`).
- **Para qué sirve:** RF-CMP-155: Liquidación mensual de derechos de señales (JOB-CMP-09): por programadora y paquete, cantidad de abonados activos según el informe de abonados activos por paquete de M02 a la fecha de corte (RF-CAT-116, API-CAT-56 GET… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.derechosSenales.liquidar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de contratos de derechos de señales de TV por programadora (`signalRightsContracts`) con `total`.
- **Pantallas:** PAN-CMP-26 (Derechos de señales (HUE-TV-01)).
- **Ola:** O10 · **Fuente:** M12 §11. API, línea 1275 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-123)

<a id="API-CMP-123-b"></a>
#### API-CMP-123-b · `POST /api/admin/cmp/signal-rights/contracts`

- **Qué hace:** Contratos de derechos de señales (HUE-TV-01) Da de alta un registro de contratos de derechos de señales de TV por programadora (`signalRightsContracts`).
- **Para qué sirve:** RF-CMP-155: Liquidación mensual de derechos de señales (JOB-CMP-09): por programadora y paquete, cantidad de abonados activos según el informe de abonados activos por paquete de M02 a la fecha de corte (RF-CAT-116, API-CAT-56 GET… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.derechosSenales.liquidar`.
- **Recibe:** los datos de contratos de derechos de señales de TV por programadora (`signalRightsContracts`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de contratos de derechos de señales de TV por programadora (`signalRightsContracts`).
- **Pantallas:** PAN-CMP-26 (Derechos de señales (HUE-TV-01)).
- **Ola:** O10 · **Fuente:** M12 §11. API, línea 1275 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-123-b)

<a id="API-CMP-123-c"></a>
#### API-CMP-123-c · `PATCH /api/admin/cmp/signal-rights/contracts`

- **Qué hace:** Contratos de derechos de señales (HUE-TV-01) Modifica algunos campos de un registro de contratos de derechos de señales de TV por programadora (`signalRightsContracts`) (solo los enviados).
- **Para qué sirve:** RF-CMP-155: Liquidación mensual de derechos de señales (JOB-CMP-09): por programadora y paquete, cantidad de abonados activos según el informe de abonados activos por paquete de M02 a la fecha de corte (RF-CAT-116, API-CAT-56 GET… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.derechosSenales.liquidar`.
- **Recibe:** solo los campos a cambiar de contratos de derechos de señales de TV por programadora (`signalRightsContracts`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de contratos de derechos de señales de TV por programadora (`signalRightsContracts`).
- **Pantallas:** PAN-CMP-26 (Derechos de señales (HUE-TV-01)).
- **Ola:** O10 · **Fuente:** M12 §11. API, línea 1275 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-123-c)

<a id="API-CMP-124"></a>
#### API-CMP-124 · `GET /api/admin/cmp/signal-rights/settlements`

- **Qué hace:** Ejecutar, aprobar y exportar liquidaciones (HUE-TV-01) Lista, con filtros y paginación, los registros de liquidación mensual de derechos de señales por abonados activos (`signalRightsSettlements`).
- **Para qué sirve:** RF-CMP-155: Liquidación mensual de derechos de señales (JOB-CMP-09): por programadora y paquete, cantidad de abonados activos según el informe de abonados activos por paquete de M02 a la fecha de corte (RF-CAT-116, API-CAT-56 GET… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.derechosSenales.liquidar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de liquidación mensual de derechos de señales por abonados activos (`signalRightsSettlements`) con `total`.
- **Pantallas:** PAN-CMP-26 (Derechos de señales (HUE-TV-01)).
- **Ola:** O10 · **Fuente:** M12 §11. API, línea 1276 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-124)

<a id="API-CMP-124-b"></a>
#### API-CMP-124-b · `POST /api/admin/cmp/signal-rights/settlements`

- **Qué hace:** Ejecutar, aprobar y exportar liquidaciones (HUE-TV-01) Da de alta un registro de liquidación mensual de derechos de señales por abonados activos (`signalRightsSettlements`).
- **Para qué sirve:** RF-CMP-155: Liquidación mensual de derechos de señales (JOB-CMP-09): por programadora y paquete, cantidad de abonados activos según el informe de abonados activos por paquete de M02 a la fecha de corte (RF-CAT-116, API-CAT-56 GET… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.derechosSenales.liquidar`.
- **Recibe:** los datos de liquidación mensual de derechos de señales por abonados activos (`signalRightsSettlements`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de liquidación mensual de derechos de señales por abonados activos (`signalRightsSettlements`).
- **Pantallas:** PAN-CMP-26 (Derechos de señales (HUE-TV-01)).
- **Ola:** O10 · **Fuente:** M12 §11. API, línea 1276 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-124-b)

<a id="API-CMP-124-c"></a>
#### API-CMP-124-c · `POST /api/admin/cmp/signal-rights/settlements/{id}/approve`

- **Qué hace:** Ejecutar, aprobar y exportar liquidaciones (HUE-TV-01) Aprueba un registro de liquidación mensual de derechos de señales por abonados activos (`signalRightsSettlements`).
- **Para qué sirve:** RF-CMP-155: Liquidación mensual de derechos de señales (JOB-CMP-09): por programadora y paquete, cantidad de abonados activos según el informe de abonados activos por paquete de M02 a la fecha de corte (RF-CAT-116, API-CAT-56 GET… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.derechosSenales.liquidar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CMP-26 (Derechos de señales (HUE-TV-01)).
- **Ola:** O10 · **Fuente:** M12 §11. API, línea 1276 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-124-c)

<a id="API-CMP-124-d"></a>
#### API-CMP-124-d · `POST /api/admin/cmp/signal-rights/settlements/{id}/declaration`

- **Qué hace:** Ejecutar, aprobar y exportar liquidaciones (HUE-TV-01) Registra «declaration» sobre un registro de liquidación mensual de derechos de señales por abonados activos (`signalRightsSettlements`).
- **Para qué sirve:** RF-CMP-155: Liquidación mensual de derechos de señales (JOB-CMP-09): por programadora y paquete, cantidad de abonados activos según el informe de abonados activos por paquete de M02 a la fecha de corte (RF-CAT-116, API-CAT-56 GET… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cmp.derechosSenales.liquidar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CMP-26 (Derechos de señales (HUE-TV-01)).
- **Ola:** O10 · **Fuente:** M12 §11. API, línea 1276 · [Ver en Swagger](../18-swagger/index.html?api=m12-cmp#/API/API-CMP-124-d)
