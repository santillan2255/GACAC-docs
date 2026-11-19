# Catálogo de endpoints · M13 · Stock, equipos serializados, bienes de uso, RMA y fabricación

Parte del [catálogo de endpoints](../18-catalogo-endpoints.md) (artefacto 7.1). Generado el 05-11-2026 con `_trabajo/gen_18_catalogo_endpoints.py` a partir de `18-openapi/`; no se edita a mano.

## Para qué sirve esta API

Controlar, con una existencia física única por ubicación, serie y lote, todo lo que la cooperativa tiene, custodia, entrega, consume, presta, vende, repara, fabrica o amortiza: materiales de red y de obra, equipos serializados de cliente (módem, ONU/ONT, router, decodificador, medidor), herramientas, repuestos y bienes de uso. El módulo debe:

1. Saber en todo momento dónde está y a cargo de quién cada unidad: depósito central, sucursal, cuadrilla o técnico, vehículo, proveedor (garantía), reparación, o domicilio del socio vinculado a un contrato.
2. Distinguir los hitos reservado → entregado al instalador → aplicado/instalado → devuelto/retirado sin descontar dos veces (BASE §73, INS-004), también cuando el técnico trabaja sin conexión (AGR-025, CNX §3.7).
3. Conservar la titularidad y modalidad del equipo (comodato, préstamo, alquiler, venta, propiedad del socio) y su historia completa, aunque haya salido del depósito (AGR-026).
4. Valorizar las existencias con un método de costeo aprobado y costo perpetuo, y emitir los eventos económicos para que contabilidad (M15) genere los asientos (DEC-009).
5. Administrar bienes de uso con amortización, mejoras, disminuciones, bajas, historia y distribución por centros de costo.
6. Gestionar RMA (garantías, devoluciones y reparaciones de equipos con proveedores, vinculadas a la serie; MER-020) y la recepción técnica de equipos de clientes.
7. Soportar fabricación (estructuras, divisiones, etapas, órdenes, partes de producción y aprovisionamiento) para cooperativas que fabrican (por ejemplo medidores armados, tableros, postes o pilares).
8. Asociar stock, consumos y reposición a los servicios de la cooperativa (BASE §78 OPE-002) sin duplicar existencias ni importes.

Detalle completo en el anexo M13, sección 1. Contrato navegable: [Swagger](../18-swagger/index.html?api=m13-stk).

| Dato | Valor |
|---|---|
| Endpoints | 143 |
| Por método | GET 43, PATCH 14, POST 82, PUT 4 |
| Grupos funcionales | 1 |
| Con requisito citado en el anexo | 0 |
| Con requisito inferido (a confirmar) | 129 |
| Sin requisito identificable | 14 |

## Grupos funcionales

| Grupo | Endpoints | Qué agrupa (primeros endpoints) |
|---|---|---|
| [API](#grupo-1) | 143 | Lista/búsqueda de artículos.; Alta de artículo.; Ficha.… |

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

143 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-STK-01](#API-STK-01) | GET | `/api/admin/stk/items` | Lista/búsqueda de artículos. |
| [API-STK-02](#API-STK-02) | POST | `/api/admin/stk/items` | Alta de artículo. |
| [API-STK-03](#API-STK-03) | GET | `/api/admin/stk/items/{id}` | Ficha. |
| [API-STK-04](#API-STK-04) | PATCH | `/api/admin/stk/items/{id}` | Edición con version. |
| [API-STK-05](#API-STK-05) | POST | `/api/admin/stk/items/{id}/clone` | Clonar. |
| [API-STK-06](#API-STK-06) | POST | `/api/admin/stk/items/import` | Importación (preview y confirm con step). |
| [API-STK-07](#API-STK-07) | POST | `/api/admin/stk/items/cost-update` | Actualización masiva de costos (preview/confirm). |
| [API-STK-08](#API-STK-08) | GET | `/api/admin/stk/item-types` | Maestros. |
| [API-STK-08-b](#API-STK-08-b) | POST | `/api/admin/stk/item-types` | Maestros. |
| [API-STK-08-c](#API-STK-08-c) | PATCH | `/api/admin/stk/item-types` | Maestros. |
| [API-STK-08-d](#API-STK-08-d) | GET | `/api/admin/stk/item-classifications` | Maestros. |
| [API-STK-08-e](#API-STK-08-e) | POST | `/api/admin/stk/item-classifications` | Maestros. |
| [API-STK-08-f](#API-STK-08-f) | PATCH | `/api/admin/stk/item-classifications` | Maestros. |
| [API-STK-08-g](#API-STK-08-g) | GET | `/api/admin/stk/item-groups` | Maestros. |
| [API-STK-08-h](#API-STK-08-h) | POST | `/api/admin/stk/item-groups` | Maestros. |
| [API-STK-08-i](#API-STK-08-i) | PATCH | `/api/admin/stk/item-groups` | Maestros. |
| [API-STK-08-j](#API-STK-08-j) | GET | `/api/admin/stk/item-departments` | Maestros. |
| [API-STK-08-k](#API-STK-08-k) | POST | `/api/admin/stk/item-departments` | Maestros. |
| [API-STK-08-l](#API-STK-08-l) | PATCH | `/api/admin/stk/item-departments` | Maestros. |
| [API-STK-08-m](#API-STK-08-m) | GET | `/api/admin/stk/lot-types` | Maestros. |
| [API-STK-08-n](#API-STK-08-n) | POST | `/api/admin/stk/lot-types` | Maestros. |
| [API-STK-08-o](#API-STK-08-o) | PATCH | `/api/admin/stk/lot-types` | Maestros. |
| [API-STK-08-p](#API-STK-08-p) | GET | `/api/admin/stk/expense-units` | Maestros. |
| [API-STK-08-q](#API-STK-08-q) | POST | `/api/admin/stk/expense-units` | Maestros. |
| [API-STK-08-r](#API-STK-08-r) | PATCH | `/api/admin/stk/expense-units` | Maestros. |
| [API-STK-08-s](#API-STK-08-s) | GET | `/api/admin/stk/rma-statuses` | Maestros. |
| [API-STK-08-t](#API-STK-08-t) | POST | `/api/admin/stk/rma-statuses` | Maestros. |
| [API-STK-08-u](#API-STK-08-u) | PATCH | `/api/admin/stk/rma-statuses` | Maestros. |
| [API-STK-08-v](#API-STK-08-v) | GET | `/api/admin/stk/reception-statuses` | Maestros. |
| [API-STK-08-w](#API-STK-08-w) | POST | `/api/admin/stk/reception-statuses` | Maestros. |
| [API-STK-08-x](#API-STK-08-x) | PATCH | `/api/admin/stk/reception-statuses` | Maestros. |
| [API-STK-09](#API-STK-09) | PUT | `/api/admin/stk/items/{id}/kit` | Componentes del kit. |
| [API-STK-10](#API-STK-10) | GET | `/api/admin/stk/warehouses` | Depósitos. |
| [API-STK-10-b](#API-STK-10-b) | POST | `/api/admin/stk/warehouses` | Depósitos. |
| [API-STK-10-c](#API-STK-10-c) | PATCH | `/api/admin/stk/warehouses` | Depósitos. |
| [API-STK-11](#API-STK-11) | POST | `/api/admin/stk/warehouses/{id}/deactivate` | Inactivar (saldo cero). |
| [API-STK-12](#API-STK-12) | GET | `/api/admin/stk/warehouses/{id}/locations` | Árbol de ubicaciones; alta masiva. |
| [API-STK-12-b](#API-STK-12-b) | PUT | `/api/admin/stk/warehouses/{id}/locations` | Árbol de ubicaciones; alta masiva. |
| [API-STK-13](#API-STK-13) | PUT | `/api/admin/stk/items/{id}/location-defaults` | Ubicaciones por defecto y capacidad. |
| [API-STK-14](#API-STK-14) | GET | `/api/admin/stk/balances` | Disponibilidad por dimensiones (incluye comprometido). |
| [API-STK-15](#API-STK-15) | GET | `/api/admin/stk/movements` | Kárdex/movimientos. |
| [API-STK-16](#API-STK-16) | GET | `/api/admin/stk/documents` | Documentos. |
| [API-STK-17](#API-STK-17) | POST | `/api/admin/stk/documents` | Crear documento (borrador o contabilizar). |
| [API-STK-18](#API-STK-18) | POST | `/api/admin/stk/documents/{id}/post` | Contabilizar borrador. |
| [API-STK-19](#API-STK-19) | POST | `/api/admin/stk/documents/{id}/receive` | Recepción en destino (parcial con diferencias). |
| [API-STK-20](#API-STK-20) | POST | `/api/admin/stk/documents/{id}/cancel` | Anulación con contramovimiento. |
| [API-STK-21](#API-STK-21) | GET | `/api/admin/stk/documents/{id}/print` | PDF (remito interno, vale, constancia). |
| [API-STK-22](#API-STK-22) | GET | `/api/admin/stk/serial-units` | Búsqueda por cualquier identificador. |
| [API-STK-23](#API-STK-23) | GET | `/api/admin/stk/serial-units/{id}` | Ficha y trayectoria. |
| [API-STK-24](#API-STK-24) | POST | `/api/admin/stk/serial-units/validate` | Validar series a ingresar (RN-STK-020/021). |
| [API-STK-25](#API-STK-25) | POST | `/api/admin/stk/serial-units/{id}/inspections` | Registrar inspección/ensayo. |
| [API-STK-26](#API-STK-26) | POST | `/api/admin/stk/serial-units/{id}/review` | Decisión de revisión de equipo retirado. |
| [API-STK-27](#API-STK-27) | POST | `/api/admin/stk/serial-units/{id}/scrap` | Baja técnica. |
| [API-STK-28](#API-STK-28) | GET | `/api/admin/stk/lots` | Lotes. |
| [API-STK-28-b](#API-STK-28-b) | POST | `/api/admin/stk/lots` | Lotes. |
| [API-STK-31](#API-STK-31) | GET | `/api/admin/stk/reservations` | Consultar por destino. |
| [API-STK-29](#API-STK-29) | POST | `/api/admin/stk/reservations` | Crear reserva (servicio interno usado por M10/M11/M18). |
| [API-STK-30](#API-STK-30) | POST | `/api/admin/stk/reservations/{id}/release` | Liberar con motivo. |
| [API-STK-32](#API-STK-32) | POST | `/api/admin/stk/crew-deliveries` | Entrega a cuadrilla/técnico. |
| [API-STK-33](#API-STK-33) | GET | `/api/stk/field/my-stock` | Mi stock (para caché offline, con asOf). |
| [API-STK-34](#API-STK-34) | POST | `/api/stk/field/deliveries/{id}/accept` | Aceptar entrega con firma. |
| [API-STK-35](#API-STK-35) | POST | `/api/stk/field/sync` | Lote de mutaciones de campo (consumeMaterials, applyEquipment, retrieveEquipment, visitFailed, returnRequest, countLine), resultado por í... |
| [API-STK-37](#API-STK-37) | GET | `/api/admin/stk/work-orders/{woId}/materials` | Reservado/entregado/consumido/devuelto de la OT. |
| [API-STK-36](#API-STK-36) | POST | `/api/admin/stk/work-orders/{woId}/materials` | Carga de materiales desde admin. |
| [API-STK-38](#API-STK-38) | GET | `/api/admin/stk/conflicts` | Conflictos y sustituciones. |
| [API-STK-38-b](#API-STK-38-b) | POST | `/api/admin/stk/conflicts` | Conflictos y sustituciones. |
| [API-STK-38-c](#API-STK-38-c) | POST | `/api/admin/stk/conflicts/{id}/resolve` | Conflictos y sustituciones. |
| [API-STK-39](#API-STK-39) | GET | `/api/admin/stk/crew-settlements` | Rendiciones: crear, contar, ajustar, cerrar. |
| [API-STK-39-b](#API-STK-39-b) | POST | `/api/admin/stk/crew-settlements` | Rendiciones: crear, contar, ajustar, cerrar. |
| [API-STK-40](#API-STK-40) | GET | `/api/admin/stk/equipment-assignments` | Equipos en domicilios. |
| [API-STK-41](#API-STK-41) | POST | `/api/admin/stk/equipment-assignments/{id}/counter-return` | Devolución en mostrador. |
| [API-STK-42](#API-STK-42) | POST | `/api/admin/stk/equipment-assignments/{id}/charge-proposal` | Proponer cargo por no devolución. |
| [API-STK-43](#API-STK-43) | POST | `/api/admin/stk/equipment-assignments/{id}/extend` | Prorrogar devolución. |
| [API-STK-44](#API-STK-44) | POST | `/api/admin/stk/equipment-assignments/{id}/change-mode` | Cambio de modalidad (por ejemplo a venta). |
| [API-STK-45](#API-STK-45) | GET | `/api/stk/my-equipment` | Equipos del socio (solo sus contratos). |
| [API-STK-46](#API-STK-46) | GET | `/api/admin/stk/physical-counts` | Inventarios físicos. |
| [API-STK-46-b](#API-STK-46-b) | POST | `/api/admin/stk/physical-counts` | Inventarios físicos. |
| [API-STK-46-c](#API-STK-46-c) | POST | `/api/admin/stk/physical-counts/{id}/snapshot` | Inventarios físicos. |
| [API-STK-46-d](#API-STK-46-d) | POST | `/api/admin/stk/physical-counts/{id}/lines` | Inventarios físicos. |
| [API-STK-46-e](#API-STK-46-e) | POST | `/api/admin/stk/physical-counts/{id}/close` | Inventarios físicos. |
| [API-STK-47](#API-STK-47) | POST | `/api/admin/stk/adjustments` | Ajuste (queda pendiente si supera umbral). |
| [API-STK-48](#API-STK-48) | GET | `/api/admin/stk/reorder-suggestions` | Sugerencias. |
| [API-STK-49](#API-STK-49) | POST | `/api/admin/stk/reorder-suggestions/convert` | Convertir en requisición M12. |
| [API-STK-50](#API-STK-50) | GET | `/api/admin/stk/valuation` | Valorización a fecha por método. |
| [API-STK-51](#API-STK-51) | GET | `/api/admin/stk/revaluations` | Revaluaciones. |
| [API-STK-51-b](#API-STK-51-b) | POST | `/api/admin/stk/revaluations` | Revaluaciones. |
| [API-STK-51-c](#API-STK-51-c) | POST | `/api/admin/stk/revaluations/{id}/approve` | Revaluaciones. |
| [API-STK-51-d](#API-STK-51-d) | POST | `/api/admin/stk/revaluations/{id}/post` | Revaluaciones. |
| [API-STK-52](#API-STK-52) | POST | `/api/admin/stk/periods/{periodKey}/close` | Cierre de stock. |
| [API-STK-52-b](#API-STK-52-b) | POST | `/api/admin/stk/periods/{periodKey}/reopen` | Cierre de stock. |
| [API-STK-53](#API-STK-53) | GET | `/api/admin/stk/fixed-assets` | Bienes de uso (incluye confirmar borrador). |
| [API-STK-53-b](#API-STK-53-b) | POST | `/api/admin/stk/fixed-assets` | Bienes de uso (incluye confirmar borrador). |
| [API-STK-53-c](#API-STK-53-c) | PATCH | `/api/admin/stk/fixed-assets` | Bienes de uso (incluye confirmar borrador). |
| [API-STK-54](#API-STK-54) | POST | `/api/admin/stk/fixed-assets/{id}/value-changes` | Mejora, disminución, ajuste. |
| [API-STK-55](#API-STK-55) | POST | `/api/admin/stk/fixed-assets/{id}/dispose` | Baja con recupero. |
| [API-STK-56](#API-STK-56) | POST | `/api/admin/stk/fixed-assets/{id}/cancel` | Anular con reversión. |
| [API-STK-57](#API-STK-57) | GET | `/api/admin/stk/fixed-assets/{id}/history` | Historial. |
| [API-STK-58](#API-STK-58) | POST | `/api/admin/stk/depreciation-runs` | Simular o contabilizar corrida. |
| [API-STK-59](#API-STK-59) | POST | `/api/admin/stk/depreciation-runs/{id}/reverse` | Revertir. |
| [API-STK-60](#API-STK-60) | GET | `/api/admin/stk/fixed-assets/reports/{type}` | Cuadro de bienes y de amortizaciones. |
| [API-STK-61](#API-STK-61) | GET | `/api/admin/stk/rma-cases` | RMA. |
| [API-STK-61-b](#API-STK-61-b) | POST | `/api/admin/stk/rma-cases` | RMA. |
| [API-STK-61-c](#API-STK-61-c) | PATCH | `/api/admin/stk/rma-cases` | RMA. |
| [API-STK-61-d](#API-STK-61-d) | POST | `/api/admin/stk/rma-cases/{id}/status` | RMA. |
| [API-STK-61-e](#API-STK-61-e) | POST | `/api/admin/stk/rma-cases/{id}/ship` | RMA. |
| [API-STK-61-f](#API-STK-61-f) | POST | `/api/admin/stk/rma-cases/{id}/return` | RMA. |
| [API-STK-62](#API-STK-62) | GET | `/api/admin/stk/service-receptions` | Recepción técnica. |
| [API-STK-62-b](#API-STK-62-b) | POST | `/api/admin/stk/service-receptions` | Recepción técnica. |
| [API-STK-62-c](#API-STK-62-c) | PATCH | `/api/admin/stk/service-receptions` | Recepción técnica. |
| [API-STK-62-d](#API-STK-62-d) | POST | `/api/admin/stk/service-receptions/{id}/items/{lineId}/status` | Recepción técnica. |
| [API-STK-62-e](#API-STK-62-e) | POST | `/api/admin/stk/service-receptions/{id}/deliver` | Recepción técnica. |
| [API-STK-63](#API-STK-63) | GET | `/api/admin/stk/manufacturing/boms` | Estructuras. |
| [API-STK-63-c](#API-STK-63-c) | PUT | `/api/admin/stk/manufacturing/boms` | Estructuras. |
| [API-STK-63-b](#API-STK-63-b) | POST | `/api/admin/stk/manufacturing/boms` | Estructuras. |
| [API-STK-63-d](#API-STK-63-d) | POST | `/api/admin/stk/manufacturing/boms/{itemId}/versions` | Estructuras. |
| [API-STK-63-e](#API-STK-63-e) | POST | `/api/admin/stk/manufacturing/boms/{itemId}/clone` | Estructuras. |
| [API-STK-63-f](#API-STK-63-f) | POST | `/api/admin/stk/manufacturing/boms/{itemId}/cost` | Estructuras. |
| [API-STK-64](#API-STK-64) | GET | `/api/admin/stk/manufacturing/stages` | Etapas y divisiones. |
| [API-STK-64-b](#API-STK-64-b) | POST | `/api/admin/stk/manufacturing/stages` | Etapas y divisiones. |
| [API-STK-64-c](#API-STK-64-c) | GET | `/api/admin/stk/manufacturing/divisions` | Etapas y divisiones. |
| [API-STK-64-d](#API-STK-64-d) | POST | `/api/admin/stk/manufacturing/divisions` | Etapas y divisiones. |
| [API-STK-65](#API-STK-65) | GET | `/api/admin/stk/manufacturing/orders` | Órdenes. |
| [API-STK-65-b](#API-STK-65-b) | POST | `/api/admin/stk/manufacturing/orders` | Órdenes. |
| [API-STK-65-c](#API-STK-65-c) | PATCH | `/api/admin/stk/manufacturing/orders` | Órdenes. |
| [API-STK-65-d](#API-STK-65-d) | POST | `/api/admin/stk/manufacturing/orders/{id}/launch` | Órdenes. |
| [API-STK-65-e](#API-STK-65-e) | POST | `/api/admin/stk/manufacturing/orders/{id}/finish` | Órdenes. |
| [API-STK-65-f](#API-STK-65-f) | POST | `/api/admin/stk/manufacturing/orders/{id}/cancel` | Órdenes. |
| [API-STK-65-g](#API-STK-65-g) | POST | `/api/admin/stk/manufacturing/orders/{id}/void` | Órdenes. |
| [API-STK-65-h](#API-STK-65-h) | POST | `/api/admin/stk/manufacturing/orders/{id}/extend` | Órdenes. |
| [API-STK-66](#API-STK-66) | GET | `/api/admin/stk/manufacturing/reports` | Partes de producción. |
| [API-STK-66-b](#API-STK-66-b) | POST | `/api/admin/stk/manufacturing/reports` | Partes de producción. |
| [API-STK-66-c](#API-STK-66-c) | POST | `/api/admin/stk/manufacturing/reports/{id}/launch` | Partes de producción. |
| [API-STK-66-d](#API-STK-66-d) | POST | `/api/admin/stk/manufacturing/reports/{id}/finish` | Partes de producción. |
| [API-STK-66-e](#API-STK-66-e) | POST | `/api/admin/stk/manufacturing/reports/{id}/damage` | Partes de producción. |
| [API-STK-66-f](#API-STK-66-f) | POST | `/api/admin/stk/manufacturing/reports/{id}/void` | Partes de producción. |
| [API-STK-66-g](#API-STK-66-g) | POST | `/api/admin/stk/manufacturing/reports/{id}/labels` | Partes de producción. |
| [API-STK-67](#API-STK-67) | POST | `/api/admin/stk/manufacturing/mrp-runs` | MRP y requisiciones. |
| [API-STK-67-b](#API-STK-67-b) | POST | `/api/admin/stk/manufacturing/mrp-runs/{id}/requisitions` | MRP y requisiciones. |
| [API-STK-68](#API-STK-68) | GET | `/api/admin/stk/reports/{reportKey}` | Informes y exportación (format=xlsx/csv/pdf). |
| [API-STK-69](#API-STK-69) | POST | `/api/admin/stk/labels` | Etiquetas por artículo/serie/lote/ubicación. |
| [API-STK-70](#API-STK-70) | POST | `/api/v1/ext/stk/vouchers` | Vales desde sistemas externos (reemplaza Procoop INTEGRA). |
| [API-STK-71](#API-STK-71) | GET | `/api/v1/ext/stk/balances` | Saldos para terceros/BI. |
| [API-STK-72](#API-STK-72) | GET | `/api/admin/stk/audit` | Auditoría del módulo. |

<a id="API-STK-01"></a>
#### API-STK-01 · `GET /api/admin/stk/items`

- **Qué hace:** Lista/búsqueda de artículos. Lista, con filtros y paginación, los registros de artículos de inventario (`inventoryItems`).
- **Para qué sirve:** RF-STK-053: Búsqueda global por cualquier identificador (serie, MAC, GPON SN, matrícula) desde admin, app de campo y CRM. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.articulos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de artículos de inventario (`inventoryItems`) con `total`.
- **Pantallas:** PAN-STK-01 (Lista de artículos), PAN-STK-02 (Ficha de artículo).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1716 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-01)

<a id="API-STK-02"></a>
#### API-STK-02 · `POST /api/admin/stk/items`

- **Qué hace:** Alta de artículo. Da de alta un registro de artículos de inventario (`inventoryItems`).
- **Para qué sirve:** RF-STK-085: Conteo de series: las series contadas que no figuran se registran como "encontradas" para análisis y las no encontradas como "faltantes", sin crear ni dar de baja unidades automáticamente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.articulos.crear`.
- **Recibe:** los datos de artículos de inventario (`inventoryItems`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de artículos de inventario (`inventoryItems`).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1717 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-02)

<a id="API-STK-03"></a>
#### API-STK-03 · `GET /api/admin/stk/items/{id}`

- **Qué hace:** Ficha. Obtiene el detalle de un registro de artículos de inventario (`inventoryItems`).
- **Para qué sirve:** RF-STK-101: Historial de cambios de la ficha (cada versión con todos los campos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.articulos.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de artículos de inventario (`inventoryItems`).
- **Pantallas:** PAN-STK-01 (Lista de artículos), PAN-STK-02 (Ficha de artículo).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1718 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-03)

<a id="API-STK-04"></a>
#### API-STK-04 · `PATCH /api/admin/stk/items/{id}`

- **Qué hace:** Edición con version. Modifica algunos campos de un registro de artículos de inventario (`inventoryItems`) (solo los enviados).
- **Para qué sirve:** RF-STK-101: Historial de cambios de la ficha (cada versión con todos los campos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.articulos.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de artículos de inventario (`inventoryItems`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de artículos de inventario (`inventoryItems`).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1719 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-04)

<a id="API-STK-05"></a>
#### API-STK-05 · `POST /api/admin/stk/items/{id}/clone`

- **Qué hace:** Clonar. Clona un registro de artículos de inventario (`inventoryItems`).
- **Para qué sirve:** RF-STK-010: Clonar un artículo (sufijo "(copia)"), con validación de matrícula única si está habilitada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.articulos.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1720 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-05)

<a id="API-STK-06"></a>
#### API-STK-06 · `POST /api/admin/stk/items/import`

- **Qué hace:** Importación (preview y confirm con step). Importa sobre artículos de inventario (`inventoryItems`).
- **Para qué sirve:** RF-STK-011: Importación masiva de artículos, series y saldos iniciales con ExcelImportWizard (subir → preview con errores → confirmar). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.articulos.crear`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1721 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-06)

<a id="API-STK-07"></a>
#### API-STK-07 · `POST /api/admin/stk/items/cost-update`

- **Qué hace:** Actualización masiva de costos (preview/confirm). Registra un nuevo elemento u operación en artículos de inventario (`inventoryItems`).
- **Para qué sirve:** RF-STK-011: Importación masiva de artículos, series y saldos iniciales con ExcelImportWizard (subir → preview con errores → confirmar). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.costos.editar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-STK-03 (Asistente de actualización masiva de costos de reposición).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1722 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-07)

<a id="API-STK-08"></a>
#### API-STK-08 · `GET /api/admin/stk/item-types`

- **Qué hace:** Maestros. Lista, con filtros y paginación, los registros de tipos de artículo (`itemTypes`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.articulos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de tipos de artículo (`itemTypes`) con `total`.
- **Pantallas:** PAN-STK-01 (Lista de artículos), PAN-STK-02 (Ficha de artículo).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1723 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-08)

<a id="API-STK-08-b"></a>
#### API-STK-08-b · `POST /api/admin/stk/item-types`

- **Qué hace:** Maestros. Da de alta un registro de tipos de artículo (`itemTypes`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.config.configurar`.
- **Recibe:** los datos de tipos de artículo (`itemTypes`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de tipos de artículo (`itemTypes`).
- **Pantallas:** PAN-STK-04 (Maestros de stock), PAN-STK-36 (Parámetros del módulo agrupados).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1723 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-08-b)

<a id="API-STK-08-c"></a>
#### API-STK-08-c · `PATCH /api/admin/stk/item-types`

- **Qué hace:** Maestros. Modifica algunos campos de un registro de tipos de artículo (`itemTypes`) (solo los enviados).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.config.configurar`.
- **Recibe:** solo los campos a cambiar de tipos de artículo (`itemTypes`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de tipos de artículo (`itemTypes`).
- **Pantallas:** PAN-STK-04 (Maestros de stock), PAN-STK-36 (Parámetros del módulo agrupados).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1723 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-08-c)

<a id="API-STK-08-d"></a>
#### API-STK-08-d · `GET /api/admin/stk/item-classifications`

- **Qué hace:** Maestros. Lista, con filtros y paginación, los registros de clasificación jerárquica de artículos (`itemClassifications`).
- **Para qué sirve:** RF-STK-005: ABM jerárquico de clasificaciones con coeficiente de mano de obra. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.articulos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de clasificación jerárquica de artículos (`itemClassifications`) con `total`.
- **Pantallas:** PAN-STK-01 (Lista de artículos), PAN-STK-02 (Ficha de artículo).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1723 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-08-d)

<a id="API-STK-08-e"></a>
#### API-STK-08-e · `POST /api/admin/stk/item-classifications`

- **Qué hace:** Maestros. Da de alta un registro de clasificación jerárquica de artículos (`itemClassifications`).
- **Para qué sirve:** RF-STK-005: ABM jerárquico de clasificaciones con coeficiente de mano de obra. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.config.configurar`.
- **Recibe:** los datos de clasificación jerárquica de artículos (`itemClassifications`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de clasificación jerárquica de artículos (`itemClassifications`).
- **Pantallas:** PAN-STK-04 (Maestros de stock), PAN-STK-36 (Parámetros del módulo agrupados).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1723 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-08-e)

<a id="API-STK-08-f"></a>
#### API-STK-08-f · `PATCH /api/admin/stk/item-classifications`

- **Qué hace:** Maestros. Modifica algunos campos de un registro de clasificación jerárquica de artículos (`itemClassifications`) (solo los enviados).
- **Para qué sirve:** RF-STK-005: ABM jerárquico de clasificaciones con coeficiente de mano de obra. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.config.configurar`.
- **Recibe:** solo los campos a cambiar de clasificación jerárquica de artículos (`itemClassifications`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de clasificación jerárquica de artículos (`itemClassifications`).
- **Pantallas:** PAN-STK-04 (Maestros de stock), PAN-STK-36 (Parámetros del módulo agrupados).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1723 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-08-f)

<a id="API-STK-08-g"></a>
#### API-STK-08-g · `GET /api/admin/stk/item-groups`

- **Qué hace:** Maestros. Lista, con filtros y paginación, los registros de rubros de artículos (`itemGroups`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.articulos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de rubros de artículos (`itemGroups`) con `total`.
- **Pantallas:** PAN-STK-01 (Lista de artículos), PAN-STK-02 (Ficha de artículo).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1723 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-08-g)

<a id="API-STK-08-h"></a>
#### API-STK-08-h · `POST /api/admin/stk/item-groups`

- **Qué hace:** Maestros. Da de alta un registro de rubros de artículos (`itemGroups`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.config.configurar`.
- **Recibe:** los datos de rubros de artículos (`itemGroups`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de rubros de artículos (`itemGroups`).
- **Pantallas:** PAN-STK-04 (Maestros de stock), PAN-STK-36 (Parámetros del módulo agrupados).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1723 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-08-h)

<a id="API-STK-08-i"></a>
#### API-STK-08-i · `PATCH /api/admin/stk/item-groups`

- **Qué hace:** Maestros. Modifica algunos campos de un registro de rubros de artículos (`itemGroups`) (solo los enviados).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.config.configurar`.
- **Recibe:** solo los campos a cambiar de rubros de artículos (`itemGroups`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de rubros de artículos (`itemGroups`).
- **Pantallas:** PAN-STK-04 (Maestros de stock), PAN-STK-36 (Parámetros del módulo agrupados).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1723 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-08-i)

<a id="API-STK-08-j"></a>
#### API-STK-08-j · `GET /api/admin/stk/item-departments`

- **Qué hace:** Maestros. Lista, con filtros y paginación, los registros de departamentos (`itemDepartments`).
- **Para qué sirve:** RF-STK-007: ABM de departamentos de artículos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.articulos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de departamentos (`itemDepartments`) con `total`.
- **Pantallas:** PAN-STK-01 (Lista de artículos), PAN-STK-02 (Ficha de artículo).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1723 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-08-j)

<a id="API-STK-08-k"></a>
#### API-STK-08-k · `POST /api/admin/stk/item-departments`

- **Qué hace:** Maestros. Da de alta un registro de departamentos (`itemDepartments`).
- **Para qué sirve:** RF-STK-007: ABM de departamentos de artículos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.config.configurar`.
- **Recibe:** los datos de departamentos (`itemDepartments`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de departamentos (`itemDepartments`).
- **Pantallas:** PAN-STK-04 (Maestros de stock), PAN-STK-36 (Parámetros del módulo agrupados).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1723 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-08-k)

<a id="API-STK-08-l"></a>
#### API-STK-08-l · `PATCH /api/admin/stk/item-departments`

- **Qué hace:** Maestros. Modifica algunos campos de un registro de departamentos (`itemDepartments`) (solo los enviados).
- **Para qué sirve:** RF-STK-007: ABM de departamentos de artículos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.config.configurar`.
- **Recibe:** solo los campos a cambiar de departamentos (`itemDepartments`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de departamentos (`itemDepartments`).
- **Pantallas:** PAN-STK-04 (Maestros de stock), PAN-STK-36 (Parámetros del módulo agrupados).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1723 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-08-l)

<a id="API-STK-08-m"></a>
#### API-STK-08-m · `GET /api/admin/stk/lot-types`

- **Qué hace:** Maestros. Lista, con filtros y paginación, los registros de tipos de lote (`lotTypes`).
- **Para qué sirve:** RF-STK-034: Impresión de etiquetas (código de barras/QR) por artículo, serie, lote y ubicación, con pregunta opcional al registrar ingresos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.articulos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de tipos de lote (`lotTypes`) con `total`.
- **Pantallas:** PAN-STK-01 (Lista de artículos), PAN-STK-02 (Ficha de artículo).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1723 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-08-m)

<a id="API-STK-08-n"></a>
#### API-STK-08-n · `POST /api/admin/stk/lot-types`

- **Qué hace:** Maestros. Da de alta un registro de tipos de lote (`lotTypes`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.config.configurar`.
- **Recibe:** los datos de tipos de lote (`lotTypes`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de tipos de lote (`lotTypes`).
- **Pantallas:** PAN-STK-04 (Maestros de stock), PAN-STK-36 (Parámetros del módulo agrupados).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1723 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-08-n)

<a id="API-STK-08-o"></a>
#### API-STK-08-o · `PATCH /api/admin/stk/lot-types`

- **Qué hace:** Maestros. Modifica algunos campos de un registro de tipos de lote (`lotTypes`) (solo los enviados).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.config.configurar`.
- **Recibe:** solo los campos a cambiar de tipos de lote (`lotTypes`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de tipos de lote (`lotTypes`).
- **Pantallas:** PAN-STK-04 (Maestros de stock), PAN-STK-36 (Parámetros del módulo agrupados).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1723 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-08-o)

<a id="API-STK-08-p"></a>
#### API-STK-08-p · `GET /api/admin/stk/expense-units`

- **Qué hace:** Maestros. Lista, con filtros y paginación, los registros de unidades de gasto (`expenseUnits`).
- **Para qué sirve:** RF-STK-130: ABM de unidades de gasto (descripción, observaciones, centro de costo asociado) y uso como destino en vales y retiros de materiales. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.articulos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de unidades de gasto (`expenseUnits`) con `total`.
- **Pantallas:** PAN-STK-01 (Lista de artículos), PAN-STK-02 (Ficha de artículo).
- **Ola:** O8 · **Fuente:** M13 §11. API, línea 1723 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-08-p)

<a id="API-STK-08-q"></a>
#### API-STK-08-q · `POST /api/admin/stk/expense-units`

- **Qué hace:** Maestros. Da de alta un registro de unidades de gasto (`expenseUnits`).
- **Para qué sirve:** RF-STK-031: Destino obligatorio en consumos y salidas internas: OT, OM, obra, servicio, contrato, centro de costo, unidad de gasto, plan de vivienda, según configuración del tipo de documento. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.config.configurar`.
- **Recibe:** los datos de unidades de gasto (`expenseUnits`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de unidades de gasto (`expenseUnits`).
- **Pantallas:** PAN-STK-04 (Maestros de stock), PAN-STK-36 (Parámetros del módulo agrupados).
- **Ola:** O8 · **Fuente:** M13 §11. API, línea 1723 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-08-q)

<a id="API-STK-08-r"></a>
#### API-STK-08-r · `PATCH /api/admin/stk/expense-units`

- **Qué hace:** Maestros. Modifica algunos campos de un registro de unidades de gasto (`expenseUnits`) (solo los enviados).
- **Para qué sirve:** RF-STK-031: Destino obligatorio en consumos y salidas internas: OT, OM, obra, servicio, contrato, centro de costo, unidad de gasto, plan de vivienda, según configuración del tipo de documento. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.config.configurar`.
- **Recibe:** solo los campos a cambiar de unidades de gasto (`expenseUnits`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de unidades de gasto (`expenseUnits`).
- **Pantallas:** PAN-STK-04 (Maestros de stock), PAN-STK-36 (Parámetros del módulo agrupados).
- **Ola:** O8 · **Fuente:** M13 §11. API, línea 1723 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-08-r)

<a id="API-STK-08-s"></a>
#### API-STK-08-s · `GET /api/admin/stk/rma-statuses`

- **Qué hace:** Maestros. Consulta `rma-statuses`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.articulos.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-STK-01 (Lista de artículos), PAN-STK-02 (Ficha de artículo).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1723 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-08-s)

<a id="API-STK-08-t"></a>
#### API-STK-08-t · `POST /api/admin/stk/rma-statuses`

- **Qué hace:** Maestros. Registra un nuevo elemento u operación en `rma-statuses`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.config.configurar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-STK-04 (Maestros de stock), PAN-STK-36 (Parámetros del módulo agrupados).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1723 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-08-t)

<a id="API-STK-08-u"></a>
#### API-STK-08-u · `PATCH /api/admin/stk/rma-statuses`

- **Qué hace:** Maestros. Modifica algunos campos de un registro de `rma-statuses` (solo los enviados).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.config.configurar`.
- **Recibe:** solo los campos a cambiar; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-STK-04 (Maestros de stock), PAN-STK-36 (Parámetros del módulo agrupados).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1723 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-08-u)

<a id="API-STK-08-v"></a>
#### API-STK-08-v · `GET /api/admin/stk/reception-statuses`

- **Qué hace:** Maestros. Lista, con filtros y paginación, los registros de estados de recepción de servicio técnico (`receptionStatuses`).
- **Para qué sirve:** RF-STK-038: Registrar quién recibe físicamente (usuario o técnico, fecha y hora de recepción) en entregas y transferencias. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.articulos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de estados de recepción de servicio técnico (`receptionStatuses`) con `total`.
- **Pantallas:** PAN-STK-01 (Lista de artículos), PAN-STK-02 (Ficha de artículo).
- **Ola:** O10 · **Fuente:** M13 §11. API, línea 1723 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-08-v)

<a id="API-STK-08-w"></a>
#### API-STK-08-w · `POST /api/admin/stk/reception-statuses`

- **Qué hace:** Maestros. Da de alta un registro de estados de recepción de servicio técnico (`receptionStatuses`).
- **Para qué sirve:** RF-STK-114: Recepción técnica de equipos de clientes (servicio técnico): número, fechas, cliente(s), quién pide, comprobante, observaciones, productos recibidos con cantidad y precio, estados por ítem con historial; estados configurables con… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.config.configurar`.
- **Recibe:** los datos de estados de recepción de servicio técnico (`receptionStatuses`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de estados de recepción de servicio técnico (`receptionStatuses`).
- **Pantallas:** PAN-STK-04 (Maestros de stock), PAN-STK-36 (Parámetros del módulo agrupados).
- **Ola:** O10 · **Fuente:** M13 §11. API, línea 1723 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-08-w)

<a id="API-STK-08-x"></a>
#### API-STK-08-x · `PATCH /api/admin/stk/reception-statuses`

- **Qué hace:** Maestros. Modifica algunos campos de un registro de estados de recepción de servicio técnico (`receptionStatuses`) (solo los enviados).
- **Para qué sirve:** RF-STK-114: Recepción técnica de equipos de clientes (servicio técnico): número, fechas, cliente(s), quién pide, comprobante, observaciones, productos recibidos con cantidad y precio, estados por ítem con historial; estados configurables con… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.config.configurar`.
- **Recibe:** solo los campos a cambiar de estados de recepción de servicio técnico (`receptionStatuses`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de estados de recepción de servicio técnico (`receptionStatuses`).
- **Pantallas:** PAN-STK-04 (Maestros de stock), PAN-STK-36 (Parámetros del módulo agrupados).
- **Ola:** O10 · **Fuente:** M13 §11. API, línea 1723 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-08-x)

<a id="API-STK-09"></a>
#### API-STK-09 · `PUT /api/admin/stk/items/{id}/kit`

- **Qué hace:** Componentes del kit. Reemplaza o configura artículos de inventario (`inventoryItems`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.articulos.editar`.
- **Recibe:** en la ruta `id`; los datos de artículos de inventario (`inventoryItems`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de artículos de inventario (`inventoryItems`).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1724 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-09)

<a id="API-STK-10"></a>
#### API-STK-10 · `GET /api/admin/stk/warehouses`

- **Qué hace:** Depósitos. Lista, con filtros y paginación, los registros de depósitos, depósitos móviles y custodios (`warehouses`).
- **Para qué sirve:** RF-STK-095: Valorización de existencias por estado de custodia (depósitos, cuadrillas, domicilios de socios, proveedores) conciliable con contabilidad. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.depositos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de depósitos, depósitos móviles y custodios (`warehouses`) con `total`.
- **Pantallas:** PAN-STK-05 (Lista de depósitos y custodios por tipo).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1725 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-10)

<a id="API-STK-10-b"></a>
#### API-STK-10-b · `POST /api/admin/stk/warehouses`

- **Qué hace:** Depósitos. Da de alta un registro de depósitos, depósitos móviles y custodios (`warehouses`).
- **Para qué sirve:** RF-STK-095: Valorización de existencias por estado de custodia (depósitos, cuadrillas, domicilios de socios, proveedores) conciliable con contabilidad. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.depositos.editar`.
- **Recibe:** los datos de depósitos, depósitos móviles y custodios (`warehouses`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de depósitos, depósitos móviles y custodios (`warehouses`).
- **Pantallas:** PAN-STK-06 (Ubicaciones del depósito).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1725 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-10-b)

<a id="API-STK-10-c"></a>
#### API-STK-10-c · `PATCH /api/admin/stk/warehouses`

- **Qué hace:** Depósitos. Modifica algunos campos de un registro de depósitos, depósitos móviles y custodios (`warehouses`) (solo los enviados).
- **Para qué sirve:** RF-STK-095: Valorización de existencias por estado de custodia (depósitos, cuadrillas, domicilios de socios, proveedores) conciliable con contabilidad. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.depositos.editar`.
- **Recibe:** solo los campos a cambiar de depósitos, depósitos móviles y custodios (`warehouses`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de depósitos, depósitos móviles y custodios (`warehouses`).
- **Pantallas:** PAN-STK-06 (Ubicaciones del depósito).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1725 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-10-c)

<a id="API-STK-11"></a>
#### API-STK-11 · `POST /api/admin/stk/warehouses/{id}/deactivate`

- **Qué hace:** Inactivar (saldo cero). Desactiva un registro de depósitos, depósitos móviles y custodios (`warehouses`).
- **Para qué sirve:** RF-STK-022: Inactivar un depósito (equivale a IGNORAR) solo con saldo cero y sin reservas ni documentos abiertos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.depositos.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-STK-06 (Ubicaciones del depósito).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1726 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-11)

<a id="API-STK-12"></a>
#### API-STK-12 · `GET /api/admin/stk/warehouses/{id}/locations`

- **Qué hace:** Árbol de ubicaciones; alta masiva. Consulta «locations» de un registro de depósitos, depósitos móviles y custodios (`warehouses`).
- **Para qué sirve:** RF-STK-018: Ubicaciones jerárquicas (padre/hijo) dentro de un depósito, con marca asignable y por defecto, y alta masiva con enumeración (por ejemplo E01..E20). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.depositos.editar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de depósitos, depósitos móviles y custodios (`warehouses`).
- **Pantallas:** PAN-STK-06 (Ubicaciones del depósito).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1727 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-12)

<a id="API-STK-12-b"></a>
#### API-STK-12-b · `PUT /api/admin/stk/warehouses/{id}/locations`

- **Qué hace:** Árbol de ubicaciones; alta masiva. Reemplaza o configura depósitos, depósitos móviles y custodios (`warehouses`).
- **Para qué sirve:** RF-STK-018: Ubicaciones jerárquicas (padre/hijo) dentro de un depósito, con marca asignable y por defecto, y alta masiva con enumeración (por ejemplo E01..E20). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.depositos.editar`.
- **Recibe:** en la ruta `id`; los datos de depósitos, depósitos móviles y custodios (`warehouses`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de depósitos, depósitos móviles y custodios (`warehouses`).
- **Pantallas:** PAN-STK-06 (Ubicaciones del depósito).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1727 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-12-b)

<a id="API-STK-13"></a>
#### API-STK-13 · `PUT /api/admin/stk/items/{id}/location-defaults`

- **Qué hace:** Ubicaciones por defecto y capacidad. Reemplaza o configura ubicación por defecto del artículo (`itemLocationDefaults`).
- **Para qué sirve:** RF-STK-019: Ubicaciones por defecto y capacidad por artículo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.articulos.editar`.
- **Recibe:** en la ruta `id`; los datos de ubicación por defecto del artículo (`itemLocationDefaults`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de ubicación por defecto del artículo (`itemLocationDefaults`).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1728 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-13)

<a id="API-STK-14"></a>
#### API-STK-14 · `GET /api/admin/stk/balances`

- **Qué hace:** Disponibilidad por dimensiones (incluye comprometido). Lista, con filtros y paginación, los registros de saldos materializados (`stockBalances`).
- **Para qué sirve:** RF-STK-040: Consulta de disponibilidad por artículo, servicio, depósito, ubicación, lote y cuadrilla, incluyendo comprometido: reservas, órdenes de compra pendientes (M12), facturas de compra pendientes de recibir, presupuestos aprobados con… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.saldos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de saldos materializados (`stockBalances`) con `total`.
- **Pantallas:** PAN-STK-07 (Consulta de disponibilidad).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1729 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-14)

<a id="API-STK-15"></a>
#### API-STK-15 · `GET /api/admin/stk/movements`

- **Qué hace:** Kárdex/movimientos. Lista, con filtros y paginación, los registros de libro de movimientos (`stockMovements`).
- **Para qué sirve:** RF-STK-041: Kardex por artículo (con saldo y costo) y por serie (trayectoria). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.movimientos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de libro de movimientos (`stockMovements`) con `total`.
- **Pantallas:** PAN-STK-08 (Kárdex por artículo), PAN-STK-09 (Bandeja de documentos de stock).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1730 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-15)

<a id="API-STK-16"></a>
#### API-STK-16 · `GET /api/admin/stk/documents`

- **Qué hace:** Documentos. Lista, con filtros y paginación, los registros de documentos de stock (`stockDocuments`).
- **Para qué sirve:** RF-STK-093: Cierre de stock por período: congela movimientos y costo hasta la fecha; reapertura con permiso y auditoría. · RF-STK-025: Anulación de documentos por contramovimiento, con motivo y permiso; prohibida si afecta series con movimientos posteriores, bienes de uso dados de baja o períodos cerrados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.movimientos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de documentos de stock (`stockDocuments`) con `total`.
- **Pantallas:** PAN-STK-08 (Kárdex por artículo), PAN-STK-09 (Bandeja de documentos de stock).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1731 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-16)

<a id="API-STK-17"></a>
#### API-STK-17 · `POST /api/admin/stk/documents`

- **Qué hace:** Crear documento (borrador o contabilizar). Da de alta un registro de documentos de stock (`stockDocuments`).
- **Para qué sirve:** RF-STK-097: Alta del bien desde el ingreso de stock de un artículo marcado bien de uso (propuesta en borrador para confirmar) o manual; vínculo con la factura de proveedor de M12. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.movimientos.crear`.
- **Recibe:** los datos de documentos de stock (`stockDocuments`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de documentos de stock (`stockDocuments`).
- **Pantallas:** PAN-STK-10 (Editor de documento).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1732 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-17)

<a id="API-STK-18"></a>
#### API-STK-18 · `POST /api/admin/stk/documents/{id}/post`

- **Qué hace:** Contabilizar borrador. Contabiliza o asienta un registro de documentos de stock (`stockDocuments`).
- **Para qué sirve:** RF-STK-097: Alta del bien desde el ingreso de stock de un artículo marcado bien de uso (propuesta en borrador para confirmar) o manual; vínculo con la factura de proveedor de M12. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.movimientos.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-STK-10 (Editor de documento).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1733 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-18)

<a id="API-STK-19"></a>
#### API-STK-19 · `POST /api/admin/stk/documents/{id}/receive`

- **Qué hace:** Recepción en destino (parcial con diferencias). Recibe un registro de documentos de stock (`stockDocuments`).
- **Para qué sirve:** RF-STK-039: Transferencias con tránsito opcional (sale de origen a "en tránsito" y entra al destino al recibir), recepción parcial con diferencias y remito interno imprimible; modificación del remito solo antes de la recepción. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.transferencias.recibir`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1734 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-19)

<a id="API-STK-20"></a>
#### API-STK-20 · `POST /api/admin/stk/documents/{id}/cancel`

- **Qué hace:** Anulación con contramovimiento. Cancela un registro de documentos de stock (`stockDocuments`).
- **Para qué sirve:** RF-STK-025: Anulación de documentos por contramovimiento, con motivo y permiso; prohibida si afecta series con movimientos posteriores, bienes de uso dados de baja o períodos cerrados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.movimientos.anular`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1735 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-20)

<a id="API-STK-21"></a>
#### API-STK-21 · `GET /api/admin/stk/documents/{id}/print`

- **Qué hace:** PDF (remito interno, vale, constancia). Consulta «print» de un registro de documentos de stock (`stockDocuments`).
- **Para qué sirve:** RF-STK-024: Documentos de stock: vale de entrada, vale de salida, transferencia entre depósitos (remito interno), recepción de compra, devolución a proveedor, entrega a cuadrilla, devolución de cuadrilla, consumo en OT/OM, aplicación de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.movimientos.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de documentos de stock (`stockDocuments`).
- **Pantallas:** PAN-STK-08 (Kárdex por artículo), PAN-STK-09 (Bandeja de documentos de stock).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1736 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-21)

<a id="API-STK-22"></a>
#### API-STK-22 · `GET /api/admin/stk/serial-units`

- **Qué hace:** Búsqueda por cualquier identificador. Lista, con filtros y paginación, los registros de unidades serializadas (`serialUnits`).
- **Para qué sirve:** RF-STK-053: Búsqueda global por cualquier identificador (serie, MAC, GPON SN, matrícula) desde admin, app de campo y CRM. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.series.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de unidades serializadas (`serialUnits`) con `total`.
- **Pantallas:** PAN-STK-11 (Búsqueda de unidades serializadas), PAN-STK-12 (Ficha de la unidad).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1737 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-22)

<a id="API-STK-23"></a>
#### API-STK-23 · `GET /api/admin/stk/serial-units/{id}`

- **Qué hace:** Ficha y trayectoria. Obtiene el detalle de un registro de unidades serializadas (`serialUnits`).
- **Para qué sirve:** RF-STK-106: Bienes de uso serializados (vehículos, OLT, herramientas de medición) vinculados a su unidad para trayectoria y custodia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.series.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de unidades serializadas (`serialUnits`).
- **Pantallas:** PAN-STK-11 (Búsqueda de unidades serializadas), PAN-STK-12 (Ficha de la unidad).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1738 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-23)

<a id="API-STK-24"></a>
#### API-STK-24 · `POST /api/admin/stk/serial-units/validate`

- **Qué hace:** Validar series a ingresar (RN-STK-020/021). Valida sobre unidades serializadas (`serialUnits`).
- **Para qué sirve:** RF-STK-085: Conteo de series: las series contadas que no figuran se registran como "encontradas" para análisis y las no encontradas como "faltantes", sin crear ni dar de baja unidades automáticamente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.series.crear`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1739 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-24)

<a id="API-STK-25"></a>
#### API-STK-25 · `POST /api/admin/stk/serial-units/{id}/inspections`

- **Qué hace:** Registrar inspección/ensayo. Registra «inspections» sobre un registro de unidades serializadas (`serialUnits`).
- **Para qué sirve:** RF-STK-048: Registrar inspecciones, ensayos y mantenimiento de la unidad con resultado, certificado y vencimiento del ensayo (los ensayos metrológicos de medidores se registran aquí y M03 los consulta). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.series.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-STK-19 (Revisión de equipos retirados).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1740 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-25)

<a id="API-STK-26"></a>
#### API-STK-26 · `POST /api/admin/stk/serial-units/{id}/review`

- **Qué hace:** Decisión de revisión de equipo retirado. Revisa un registro de unidades serializadas (`serialUnits`).
- **Para qué sirve:** RF-STK-113: Revisión de equipos retirados: bandeja de unidades "retiradas pendientes de revisión" con decisión: apto para reutilizar (vuelve a disponible, opcionalmente "reacondicionado"), reparar, RMA, descarte. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.series.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-STK-19 (Revisión de equipos retirados).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1741 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-26)

<a id="API-STK-27"></a>
#### API-STK-27 · `POST /api/admin/stk/serial-units/{id}/scrap`

- **Qué hace:** Baja técnica. Da de baja por desguace un registro de unidades serializadas (`serialUnits`).
- **Para qué sirve:** RF-STK-104: Baja del bien (venta, destrucción, robo, obsolescencia, donación) con fecha, valor de recupero y resultado; si es serializado, la unidad pasa a descartada/vendida; emite evento a M15. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.bajas.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1742 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-27)

<a id="API-STK-28"></a>
#### API-STK-28 · `GET /api/admin/stk/lots`

- **Qué hace:** Lotes. Lista, con filtros y paginación, los registros de lotes (`lots`).
- **Para qué sirve:** RF-STK-035: Escaneo de código de barras/QR desde la PWA (cámara) y desde admin (lector) para artículos, series, lotes y ubicaciones. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.lotes.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de lotes (`lots`) con `total`.
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1743 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-28)

<a id="API-STK-28-b"></a>
#### API-STK-28-b · `POST /api/admin/stk/lots`

- **Qué hace:** Lotes. Registra un nuevo elemento u operación en lotes (`lots`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-STK-035: Escaneo de código de barras/QR desde la PWA (cámara) y desde admin (lector) para artículos, series, lotes y ubicaciones. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.lotes.editar`.
- **Recibe:** los datos de lotes (`lots`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1743 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-28-b)

<a id="API-STK-31"></a>
#### API-STK-31 · `GET /api/admin/stk/reservations`

- **Qué hace:** Consultar por destino. Lista, con filtros y paginación, los registros de reservas (`stockReservations`).
- **Para qué sirve:** RF-STK-042: Consulta de vales y retiros de materiales por OT/OM. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.reservas.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de reservas (`stockReservations`) con `total`.
- **Pantallas:** PAN-STK-13 (Reservas de stock).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1746 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-31)

<a id="API-STK-29"></a>
#### API-STK-29 · `POST /api/admin/stk/reservations`

- **Qué hace:** Crear reserva (servicio interno usado por M10/M11/M18). Da de alta un registro de reservas (`stockReservations`).
- **Para qué sirve:** RF-STK-132: Servicios sin stock comercial: un servicio puede declararse sin inventario comercial (banco de sangre, restos en cementerio parque), aunque use materiales internos con stock. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.reservas.crear`.
- **Recibe:** los datos de reservas (`stockReservations`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de reservas (`stockReservations`).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1744 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-29)

<a id="API-STK-30"></a>
#### API-STK-30 · `POST /api/admin/stk/reservations/{id}/release`

- **Qué hace:** Liberar con motivo. Libera un registro de reservas (`stockReservations`).
- **Para qué sirve:** RF-STK-055: Liberar reservas al cancelar o reprogramar la OT, por vencimiento configurable o manualmente con motivo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.reservas.liberar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1745 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-30)

<a id="API-STK-32"></a>
#### API-STK-32 · `POST /api/admin/stk/crew-deliveries`

- **Qué hace:** Entrega a cuadrilla/técnico. Registra un nuevo elemento u operación en `crew-deliveries`.
- **Para qué sirve:** RF-STK-059: Entregar materiales y equipos a cuadrillas o técnicos identificados como transferencia de custodia (sale del depósito y queda a cargo del técnico), con aceptación en la app (firma o confirmación) y constancia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.entregas.crear`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-STK-41 (Entregas rápidas de depósito).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1747 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-32)

<a id="API-STK-33"></a>
#### API-STK-33 · `GET /api/stk/field/my-stock`

- **Qué hace:** Mi stock (para caché offline, con asOf). Consulta `my-stock`.
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de campo o cobradores, desde la app móvil; permiso `stk.miStock.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-STK-37 (Stock en vehículo).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1748 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-33)

<a id="API-STK-34"></a>
#### API-STK-34 · `POST /api/stk/field/deliveries/{id}/accept`

- **Qué hace:** Aceptar entrega con firma. Acepta un registro de `accept`.
- **Para qué sirve:** RF-STK-059: Entregar materiales y equipos a cuadrillas o técnicos identificados como transferencia de custodia (sale del depósito y queda a cargo del técnico), con aceptación en la app (firma o confirmación) y constancia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de campo o cobradores, desde la app móvil; permiso `stk.entregas.aceptar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1749 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-34)

<a id="API-STK-35"></a>
#### API-STK-35 · `POST /api/stk/field/sync`

- **Qué hace:** Lote de mutaciones de campo (consumeMaterials, applyEquipment, retrieveEquipment, visitFailed, returnRequest, countLine), resultado por í... Sincroniza sobre `sync`; el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-STK-061: Registrar desde la OT en la app de campo el consumo de materiales (artículo, cantidad, lote) y la aplicación de equipos (serie escaneada) desde la custodia del técnico; al sincronizar se genera un único movimiento por… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de campo o cobradores, desde la app móvil; permiso `stk.consumos.registrar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-STK-38 (Materiales en la ejecución de la OT).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1750 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-35)

<a id="API-STK-37"></a>
#### API-STK-37 · `GET /api/admin/stk/work-orders/{woId}/materials`

- **Qué hace:** Reservado/entregado/consumido/devuelto de la OT. Consulta «materials» de un registro de `materials`.
- **Para qué sirve:** RF-STK-058: Consumir la reserva al entregar o aplicar, y mostrar en la OT el estado de cada reserva (pendiente, entregada, aplicada, liberada). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.movimientos.ver`.
- **Recibe:** en la ruta `woId`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-STK-08 (Kárdex por artículo), PAN-STK-09 (Bandeja de documentos de stock).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1752 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-37)

<a id="API-STK-36"></a>
#### API-STK-36 · `POST /api/admin/stk/work-orders/{woId}/materials`

- **Qué hace:** Carga de materiales desde admin. Agrega un elemento («materials») a un registro de `materials`.
- **Para qué sirve:** RF-STK-068: Registrar materiales utilizados desde admin para OT/OM sin app (carga posterior por el supervisor), con origen en la custodia de la cuadrilla o en un depósito. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.consumos.registrar`.
- **Recibe:** en la ruta `woId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-STK-38 (Materiales en la ejecución de la OT).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1751 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-36)

<a id="API-STK-38"></a>
#### API-STK-38 · `GET /api/admin/stk/conflicts`

- **Qué hace:** Conflictos y sustituciones. Consulta `conflicts`.
- **Para qué sirve:** RF-STK-064: Sustitución: si la serie aplicada difiere de la reservada, se registra la sustitución, se libera la reservada y se valida por el supervisor cuando la serie no estaba en la custodia del técnico. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.consumos.validar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-STK-16 (Conflictos de campo y sustituciones).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1753 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-38)

<a id="API-STK-38-b"></a>
#### API-STK-38-b · `POST /api/admin/stk/conflicts`

- **Qué hace:** Conflictos y sustituciones. Registra un nuevo elemento u operación en `conflicts`.
- **Para qué sirve:** RF-STK-064: Sustitución: si la serie aplicada difiere de la reservada, se registra la sustitución, se libera la reservada y se valida por el supervisor cuando la serie no estaba en la custodia del técnico. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.consumos.validar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-STK-16 (Conflictos de campo y sustituciones).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1753 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-38-b)

<a id="API-STK-38-c"></a>
#### API-STK-38-c · `POST /api/admin/stk/conflicts/{id}/resolve`

- **Qué hace:** Conflictos y sustituciones. Resuelve un registro de `resolve`.
- **Para qué sirve:** RF-STK-064: Sustitución: si la serie aplicada difiere de la reservada, se registra la sustitución, se libera la reservada y se valida por el supervisor cuando la serie no estaba en la custodia del técnico. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.consumos.validar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-STK-16 (Conflictos de campo y sustituciones).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1753 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-38-c)

<a id="API-STK-39"></a>
#### API-STK-39 · `GET /api/admin/stk/crew-settlements`

- **Qué hace:** Rendiciones: crear, contar, ajustar, cerrar. Lista, con filtros y paginación, los registros de rendiciones de material de cuadrilla (`crewSettlements`).
- **Para qué sirve:** RF-STK-016: El depósito de cuadrilla y el de técnico se vinculan con la cuadrilla/empleado de M10/M16, con responsable de custodia; al cambiar el responsable se exige rendición previa (RF-STK-063). · RF-STK-066: Rendición de cuadrilla: conciliar entregado − consumido − aplicado − devuelto = saldo en custodia, por artículo y serie; las diferencias se registran como faltante o sobrante con evidencia y requieren ajuste aprobado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.rendiciones.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de rendiciones de material de cuadrilla (`crewSettlements`) con `total`.
- **Pantallas:** PAN-STK-15 (Rendición de custodia).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1754 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-39)

<a id="API-STK-39-b"></a>
#### API-STK-39-b · `POST /api/admin/stk/crew-settlements`

- **Qué hace:** Rendiciones: crear, contar, ajustar, cerrar. Da de alta un registro de rendiciones de material de cuadrilla (`crewSettlements`).
- **Para qué sirve:** RF-STK-016: El depósito de cuadrilla y el de técnico se vinculan con la cuadrilla/empleado de M10/M16, con responsable de custodia; al cambiar el responsable se exige rendición previa (RF-STK-063). · RF-STK-066: Rendición de cuadrilla: conciliar entregado − consumido − aplicado − devuelto = saldo en custodia, por artículo y serie; las diferencias se registran como faltante o sobrante con evidencia y requieren ajuste aprobado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.rendiciones.editar`.
- **Recibe:** los datos de rendiciones de material de cuadrilla (`crewSettlements`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de rendiciones de material de cuadrilla (`crewSettlements`).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1754 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-39-b)

<a id="API-STK-40"></a>
#### API-STK-40 · `GET /api/admin/stk/equipment-assignments`

- **Qué hace:** Equipos en domicilios. Lista, con filtros y paginación, los registros de (equipos en contratos (`equipmentAssignments`).
- **Para qué sirve:** RF-STK-062: Aplicación del equipo al contrato: la unidad pasa de la custodia del técnico a la ubicación "domicilio del socio" del contrato, se crea la asignación con modalidad y se publica stk.equipment.applied con identificadores (MAC/GPON… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.asignaciones.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de (equipos en contratos (`equipmentAssignments`) con `total`.
- **Pantallas:** PAN-STK-17 (Equipos en domicilios).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1755 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-40)

<a id="API-STK-41"></a>
#### API-STK-41 · `POST /api/admin/stk/equipment-assignments/{id}/counter-return`

- **Qué hace:** Devolución en mostrador. Registra «counter-return» sobre un registro de (equipos en contratos (`equipmentAssignments`).
- **Para qué sirve:** RF-STK-077: Devolución en mostrador: el socio trae el equipo a la oficina; se recibe con constancia y queda en el depósito de la sucursal en revisión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.devoluciones.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-STK-18 (Recepción de equipos en mostrador).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1756 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-41)

<a id="API-STK-42"></a>
#### API-STK-42 · `POST /api/admin/stk/equipment-assignments/{id}/charge-proposal`

- **Qué hace:** Proponer cargo por no devolución. Registra «charge-proposal» sobre un registro de (equipos en contratos (`equipmentAssignments`).
- **Para qué sirve:** RF-STK-073: Asignación de equipo a contrato con: contrato, cuenta, inmueble, artículo, serie, fecha de entrega, fecha de devolución prevista (préstamo), fecha devuelto, depósito de origen, precio/valor declarado, OT, constancia y… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.asignaciones.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1757 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-42)

<a id="API-STK-43"></a>
#### API-STK-43 · `POST /api/admin/stk/equipment-assignments/{id}/extend`

- **Qué hace:** Prorrogar devolución. Extiende un registro de (equipos en contratos (`equipmentAssignments`).
- **Para qué sirve:** RF-STK-073: Asignación de equipo a contrato con: contrato, cuenta, inmueble, artículo, serie, fecha de entrega, fecha de devolución prevista (préstamo), fecha devuelto, depósito de origen, precio/valor declarado, OT, constancia y… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.asignaciones.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1758 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-43)

<a id="API-STK-44"></a>
#### API-STK-44 · `POST /api/admin/stk/equipment-assignments/{id}/change-mode`

- **Qué hace:** Cambio de modalidad (por ejemplo a venta). Cambia el modo de un registro de (equipos en contratos (`equipmentAssignments`).
- **Para qué sirve:** RF-STK-018: Ubicaciones jerárquicas (padre/hijo) dentro de un depósito, con marca asignable y por defecto, y alta masiva con enumeración (por ejemplo E01..E20). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.asignaciones.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1759 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-44)

<a id="API-STK-45"></a>
#### API-STK-45 · `GET /api/stk/my-equipment`

- **Qué hace:** Equipos del socio (solo sus contratos). Consulta `my-equipment`.
- **Para qué sirve:** RF-STK-062: Aplicación del equipo al contrato: la unidad pasa de la custodia del técnico a la ubicación "domicilio del socio" del contrato, se crea la asignación con modalidad y se publica stk.equipment.applied con identificadores (MAC/GPON… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `stk.misEquipos.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-STK-40 (Equipos del servicio (componente embebido en PAN-POR-30)).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1760 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-45)

<a id="API-STK-46"></a>
#### API-STK-46 · `GET /api/admin/stk/physical-counts`

- **Qué hace:** Inventarios físicos. Lista, con filtros y paginación, los registros de inventarios físicos (`physicalCounts`).
- **Para qué sirve:** RF-STK-083: Inventario físico total, parcial o cíclico por depósito, ubicación, rubro, artículo o cuadrilla, con instantánea de saldos al inicio, conteo (ciego opcional) desde admin o app con escaneo, recuento de diferencias y cierre. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.inventarios.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de inventarios físicos (`physicalCounts`) con `total`.
- **Pantallas:** PAN-STK-20 (Inventarios físicos).
- **Ola:** O8 · **Fuente:** M13 §11. API, línea 1761 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-46)

<a id="API-STK-46-b"></a>
#### API-STK-46-b · `POST /api/admin/stk/physical-counts`

- **Qué hace:** Inventarios físicos. Da de alta un registro de inventarios físicos (`physicalCounts`).
- **Para qué sirve:** RF-STK-083: Inventario físico total, parcial o cíclico por depósito, ubicación, rubro, artículo o cuadrilla, con instantánea de saldos al inicio, conteo (ciego opcional) desde admin o app con escaneo, recuento de diferencias y cierre. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.inventarios.contar`.
- **Recibe:** los datos de inventarios físicos (`physicalCounts`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de inventarios físicos (`physicalCounts`).
- **Pantallas:** PAN-STK-39 (Conteo de inventario o rendición).
- **Ola:** O8 · **Fuente:** M13 §11. API, línea 1761 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-46-b)

<a id="API-STK-46-c"></a>
#### API-STK-46-c · `POST /api/admin/stk/physical-counts/{id}/snapshot`

- **Qué hace:** Inventarios físicos. Registra «snapshot» sobre un registro de inventarios físicos (`physicalCounts`).
- **Para qué sirve:** RF-STK-083: Inventario físico total, parcial o cíclico por depósito, ubicación, rubro, artículo o cuadrilla, con instantánea de saldos al inicio, conteo (ciego opcional) desde admin o app con escaneo, recuento de diferencias y cierre. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.inventarios.contar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-STK-39 (Conteo de inventario o rendición).
- **Ola:** O8 · **Fuente:** M13 §11. API, línea 1761 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-46-c)

<a id="API-STK-46-d"></a>
#### API-STK-46-d · `POST /api/admin/stk/physical-counts/{id}/lines`

- **Qué hace:** Inventarios físicos. Agrega un elemento («lines») a un registro de inventarios físicos (`physicalCounts`).
- **Para qué sirve:** RF-STK-083: Inventario físico total, parcial o cíclico por depósito, ubicación, rubro, artículo o cuadrilla, con instantánea de saldos al inicio, conteo (ciego opcional) desde admin o app con escaneo, recuento de diferencias y cierre. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.inventarios.contar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-STK-39 (Conteo de inventario o rendición).
- **Ola:** O8 · **Fuente:** M13 §11. API, línea 1761 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-46-d)

<a id="API-STK-46-e"></a>
#### API-STK-46-e · `POST /api/admin/stk/physical-counts/{id}/close`

- **Qué hace:** Inventarios físicos. Cierra un registro de inventarios físicos (`physicalCounts`).
- **Para qué sirve:** RF-STK-083: Inventario físico total, parcial o cíclico por depósito, ubicación, rubro, artículo o cuadrilla, con instantánea de saldos al inicio, conteo (ciego opcional) desde admin o app con escaneo, recuento de diferencias y cierre. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.inventarios.contar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-STK-39 (Conteo de inventario o rendición).
- **Ola:** O8 · **Fuente:** M13 §11. API, línea 1761 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-46-e)

<a id="API-STK-47"></a>
#### API-STK-47 · `POST /api/admin/stk/adjustments`

- **Qué hace:** Ajuste (queda pendiente si supera umbral). Registra un nuevo elemento u operación en `adjustments`.
- **Para qué sirve:** RF-STK-084: Ajustes con motivo tipificado (faltante, sobrante, rotura, vencimiento, robo, error de carga, diferencia de inventario), evidencia adjunta y aprobación por umbral de cantidad/importe (T11). No se modifica existencia sin… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.ajustes.crear`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1762 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-47)

<a id="API-STK-48"></a>
#### API-STK-48 · `GET /api/admin/stk/reorder-suggestions`

- **Qué hace:** Sugerencias. Lista, con filtros y paginación, los registros de sugerencias de compra (`reorderSuggestions`).
- **Para qué sirve:** RF-STK-088: Job diario de reposición que genera sugerencias y notifica a compras; tablero de quiebres. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.sugerencias.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de sugerencias de compra (`reorderSuggestions`) con `total`.
- **Pantallas:** PAN-STK-21 (Sugerencias de compra).
- **Ola:** O8 · **Fuente:** M13 §11. API, línea 1763 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-48)

<a id="API-STK-49"></a>
#### API-STK-49 · `POST /api/admin/stk/reorder-suggestions/convert`

- **Qué hace:** Convertir en requisición M12. Convierte sobre sugerencias de compra (`reorderSuggestions`).
- **Para qué sirve:** RF-STK-087: Sugerencia de compra: necesidad = máximo (o reposición) − (disponible + en tránsito + OC pendientes − reservas), redondeada a bultos; propuesta de proveedor habitual y últimas 3 compras de 180 días; se convierte en requisición de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.sugerencias.convertir`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M13 §11. API, línea 1764 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-49)

<a id="API-STK-50"></a>
#### API-STK-50 · `GET /api/admin/stk/valuation`

- **Qué hace:** Valorización a fecha por método. Consulta `valuation`.
- **Para qué sirve:** RF-STK-091: Valorización a una fecha con métodos alternativos para análisis (PEPS, UEPS, PPP, precio de venta, precio de costo), sin alterar el costo contable; productos con saldo negativo se informan aparte y no se valúan. · RF-STK-051: Costo por serie: los serializados conservan el costo de su ingreso y se valorizan por identificación específica cuando así lo define el método (PA-STK-01). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.valorizacion.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-STK-22 (Valorización de stock).
- **Ola:** O8 · **Fuente:** M13 §11. API, línea 1765 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-50)

<a id="API-STK-51"></a>
#### API-STK-51 · `GET /api/admin/stk/revaluations`

- **Qué hace:** Revaluaciones. Lista, con filtros y paginación, los registros de revaluaciones (`revaluations`).
- **Para qué sirve:** RF-STK-092: Revaluación por índice del rubro (factor = índice mes hasta / índice mes del movimiento), al costo de reposición o manual, como movimiento de valor aprobado; revaluación automática opcional al actualizar costos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.revaluaciones.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de revaluaciones (`revaluations`) con `total`.
- **Ola:** O8 · **Fuente:** M13 §11. API, línea 1766 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-51)

<a id="API-STK-51-b"></a>
#### API-STK-51-b · `POST /api/admin/stk/revaluations`

- **Qué hace:** Revaluaciones. Da de alta un registro de revaluaciones (`revaluations`).
- **Para qué sirve:** RF-STK-092: Revaluación por índice del rubro (factor = índice mes hasta / índice mes del movimiento), al costo de reposición o manual, como movimiento de valor aprobado; revaluación automática opcional al actualizar costos. · RF-STK-085: Conteo de series: las series contadas que no figuran se registran como "encontradas" para análisis y las no encontradas como "faltantes", sin crear ni dar de baja unidades automáticamente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.revaluaciones.crear`.
- **Recibe:** los datos de revaluaciones (`revaluations`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de revaluaciones (`revaluations`).
- **Pantallas:** PAN-STK-23 (Revaluaciones).
- **Ola:** O8 · **Fuente:** M13 §11. API, línea 1766 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-51-b)

<a id="API-STK-51-c"></a>
#### API-STK-51-c · `POST /api/admin/stk/revaluations/{id}/approve`

- **Qué hace:** Revaluaciones. Aprueba un registro de revaluaciones (`revaluations`).
- **Para qué sirve:** RF-STK-092: Revaluación por índice del rubro (factor = índice mes hasta / índice mes del movimiento), al costo de reposición o manual, como movimiento de valor aprobado; revaluación automática opcional al actualizar costos. · RF-STK-085: Conteo de series: las series contadas que no figuran se registran como "encontradas" para análisis y las no encontradas como "faltantes", sin crear ni dar de baja unidades automáticamente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.revaluaciones.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-STK-23 (Revaluaciones).
- **Ola:** O8 · **Fuente:** M13 §11. API, línea 1766 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-51-c)

<a id="API-STK-51-d"></a>
#### API-STK-51-d · `POST /api/admin/stk/revaluations/{id}/post`

- **Qué hace:** Revaluaciones. Contabiliza o asienta un registro de revaluaciones (`revaluations`).
- **Para qué sirve:** RF-STK-092: Revaluación por índice del rubro (factor = índice mes hasta / índice mes del movimiento), al costo de reposición o manual, como movimiento de valor aprobado; revaluación automática opcional al actualizar costos. · RF-STK-085: Conteo de series: las series contadas que no figuran se registran como "encontradas" para análisis y las no encontradas como "faltantes", sin crear ni dar de baja unidades automáticamente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.revaluaciones.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-STK-23 (Revaluaciones).
- **Ola:** O8 · **Fuente:** M13 §11. API, línea 1766 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-51-d)

<a id="API-STK-52"></a>
#### API-STK-52 · `POST /api/admin/stk/periods/{periodKey}/close`

- **Qué hace:** Cierre de stock. Cierra un registro de `close`.
- **Para qué sirve:** RF-STK-093: Cierre de stock por período: congela movimientos y costo hasta la fecha; reapertura con permiso y auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.cierres.crear`.
- **Recibe:** en la ruta `periodKey`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-STK-24 (Cierre de stock).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1767 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-52)

<a id="API-STK-52-b"></a>
#### API-STK-52-b · `POST /api/admin/stk/periods/{periodKey}/reopen`

- **Qué hace:** Cierre de stock. Reabre un registro de `reopen`.
- **Para qué sirve:** RF-STK-093: Cierre de stock por período: congela movimientos y costo hasta la fecha; reapertura con permiso y auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.cierres.crear`.
- **Recibe:** en la ruta `periodKey`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-STK-24 (Cierre de stock).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1767 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-52-b)

<a id="API-STK-53"></a>
#### API-STK-53 · `GET /api/admin/stk/fixed-assets`

- **Qué hace:** Bienes de uso (incluye confirmar borrador). Lista, con filtros y paginación, los registros de bienes de uso (`fixedAssets`).
- **Para qué sirve:** RF-STK-097: Alta del bien desde el ingreso de stock de un artículo marcado bien de uso (propuesta en borrador para confirmar) o manual; vínculo con la factura de proveedor de M12. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.bienesUso.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de bienes de uso (`fixedAssets`) con `total`.
- **Pantallas:** PAN-STK-25 (Lista de bienes de uso), PAN-STK-26 (Ficha del bien).
- **Ola:** O8 · **Fuente:** M13 §11. API, línea 1768 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-53)

<a id="API-STK-53-b"></a>
#### API-STK-53-b · `POST /api/admin/stk/fixed-assets`

- **Qué hace:** Bienes de uso (incluye confirmar borrador). Da de alta un registro de bienes de uso (`fixedAssets`).
- **Para qué sirve:** RF-STK-097: Alta del bien desde el ingreso de stock de un artículo marcado bien de uso (propuesta en borrador para confirmar) o manual; vínculo con la factura de proveedor de M12. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.bienesUso.editar`.
- **Recibe:** los datos de bienes de uso (`fixedAssets`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de bienes de uso (`fixedAssets`).
- **Ola:** O8 · **Fuente:** M13 §11. API, línea 1768 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-53-b)

<a id="API-STK-53-c"></a>
#### API-STK-53-c · `PATCH /api/admin/stk/fixed-assets`

- **Qué hace:** Bienes de uso (incluye confirmar borrador). Modifica algunos campos de un registro de bienes de uso (`fixedAssets`) (solo los enviados).
- **Para qué sirve:** RF-STK-097: Alta del bien desde el ingreso de stock de un artículo marcado bien de uso (propuesta en borrador para confirmar) o manual; vínculo con la factura de proveedor de M12. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.bienesUso.editar`.
- **Recibe:** solo los campos a cambiar de bienes de uso (`fixedAssets`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de bienes de uso (`fixedAssets`).
- **Ola:** O8 · **Fuente:** M13 §11. API, línea 1768 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-53-c)

<a id="API-STK-54"></a>
#### API-STK-54 · `POST /api/admin/stk/fixed-assets/{id}/value-changes`

- **Qué hace:** Mejora, disminución, ajuste. Registra «value-changes» sobre un registro de bienes de uso (`fixedAssets`).
- **Para qué sirve:** RF-STK-105: Cuadro de bienes de uso (origen + mejoras − disminuciones) y cuadro de amortizaciones (apertura, ejercicio, cierre) por rubro y ejercicio; exportación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.bienesUso.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M13 §11. API, línea 1769 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-54)

<a id="API-STK-55"></a>
#### API-STK-55 · `POST /api/admin/stk/fixed-assets/{id}/dispose`

- **Qué hace:** Baja con recupero. Da de baja un registro de bienes de uso (`fixedAssets`).
- **Para qué sirve:** RF-STK-104: Baja del bien (venta, destrucción, robo, obsolescencia, donación) con fecha, valor de recupero y resultado; si es serializado, la unidad pasa a descartada/vendida; emite evento a M15. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.bienesUso.baja`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M13 §11. API, línea 1770 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-55)

<a id="API-STK-56"></a>
#### API-STK-56 · `POST /api/admin/stk/fixed-assets/{id}/cancel`

- **Qué hace:** Anular con reversión. Cancela un registro de bienes de uso (`fixedAssets`).
- **Para qué sirve:** RF-STK-107: Eliminación de un bien solo si no tiene amortizaciones ni movimientos; si los tiene, se anula con reversión automática (no asientos manuales). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.bienesUso.baja`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M13 §11. API, línea 1771 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-56)

<a id="API-STK-57"></a>
#### API-STK-57 · `GET /api/admin/stk/fixed-assets/{id}/history`

- **Qué hace:** Historial. Lista, con filtros y paginación, los registros de bienes de uso (`fixedAssets`).
- **Para qué sirve:** RF-STK-101: Historial de cambios de la ficha (cada versión con todos los campos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.bienesUso.ver`.
- **Recibe:** en la ruta `id`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de bienes de uso (`fixedAssets`) con `total`.
- **Pantallas:** PAN-STK-25 (Lista de bienes de uso), PAN-STK-26 (Ficha del bien).
- **Ola:** O8 · **Fuente:** M13 §11. API, línea 1772 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-57)

<a id="API-STK-58"></a>
#### API-STK-58 · `POST /api/admin/stk/depreciation-runs`

- **Qué hace:** Simular o contabilizar corrida. Da de alta un registro de corridas de amortización (`depreciationRuns`).
- **Para qué sirve:** RF-STK-102: Corrida de amortización por período (mensual por defecto; anual opcional), simulable, que emite stk.depreciation.posted por bien/rubro/centro y actualiza acumulados; reversión de una corrida revierte acumulados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.amortizaciones.ejecutar`.
- **Recibe:** los datos de corridas de amortización (`depreciationRuns`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de corridas de amortización (`depreciationRuns`).
- **Pantallas:** PAN-STK-27 (Corridas de amortización).
- **Ola:** O8 · **Fuente:** M13 §11. API, línea 1773 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-58)

<a id="API-STK-59"></a>
#### API-STK-59 · `POST /api/admin/stk/depreciation-runs/{id}/reverse`

- **Qué hace:** Revertir. Revierte un registro de corridas de amortización (`depreciationRuns`).
- **Para qué sirve:** RF-STK-102: Corrida de amortización por período (mensual por defecto; anual opcional), simulable, que emite stk.depreciation.posted por bien/rubro/centro y actualiza acumulados; reversión de una corrida revierte acumulados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.amortizaciones.revertir`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M13 §11. API, línea 1774 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-59)

<a id="API-STK-60"></a>
#### API-STK-60 · `GET /api/admin/stk/fixed-assets/reports/{type}`

- **Qué hace:** Cuadro de bienes y de amortizaciones. Obtiene el detalle de un registro de bienes de uso (`fixedAssets`).
- **Para qué sirve:** RF-STK-105: Cuadro de bienes de uso (origen + mejoras − disminuciones) y cuadro de amortizaciones (apertura, ejercicio, cierre) por rubro y ejercicio; exportación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.bienesUso.ver`.
- **Recibe:** en la ruta `type`.
- **Devuelve:** 200: el registro de bienes de uso (`fixedAssets`).
- **Pantallas:** PAN-STK-25 (Lista de bienes de uso), PAN-STK-26 (Ficha del bien).
- **Ola:** O8 · **Fuente:** M13 §11. API, línea 1775 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-60)

<a id="API-STK-61"></a>
#### API-STK-61 · `GET /api/admin/stk/rma-cases`

- **Qué hace:** RMA. Lista, con filtros y paginación, los registros de RMA de equipos con proveedores (`rmaCases`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.rma.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de RMA de equipos con proveedores (`rmaCases`) con `total`.
- **Pantallas:** PAN-STK-28 (Bandeja de RMA).
- **Ola:** O8 · **Fuente:** M13 §11. API, línea 1776 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-61)

<a id="API-STK-61-b"></a>
#### API-STK-61-b · `POST /api/admin/stk/rma-cases`

- **Qué hace:** RMA. Da de alta un registro de RMA de equipos con proveedores (`rmaCases`).
- **Para qué sirve:** RF-STK-085: Conteo de series: las series contadas que no figuran se registran como "encontradas" para análisis y las no encontradas como "faltantes", sin crear ni dar de baja unidades automáticamente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.rma.crear`.
- **Recibe:** los datos de RMA de equipos con proveedores (`rmaCases`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de RMA de equipos con proveedores (`rmaCases`).
- **Ola:** O8 · **Fuente:** M13 §11. API, línea 1776 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-61-b)

<a id="API-STK-61-c"></a>
#### API-STK-61-c · `PATCH /api/admin/stk/rma-cases`

- **Qué hace:** RMA. Modifica algunos campos de un registro de RMA de equipos con proveedores (`rmaCases`) (solo los enviados).
- **Para qué sirve:** RF-STK-085: Conteo de series: las series contadas que no figuran se registran como "encontradas" para análisis y las no encontradas como "faltantes", sin crear ni dar de baja unidades automáticamente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.rma.crear`.
- **Recibe:** solo los campos a cambiar de RMA de equipos con proveedores (`rmaCases`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de RMA de equipos con proveedores (`rmaCases`).
- **Ola:** O8 · **Fuente:** M13 §11. API, línea 1776 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-61-c)

<a id="API-STK-61-d"></a>
#### API-STK-61-d · `POST /api/admin/stk/rma-cases/{id}/status`

- **Qué hace:** RMA. Registra «status» sobre un registro de RMA de equipos con proveedores (`rmaCases`).
- **Para qué sirve:** RF-STK-085: Conteo de series: las series contadas que no figuran se registran como "encontradas" para análisis y las no encontradas como "faltantes", sin crear ni dar de baja unidades automáticamente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.rma.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M13 §11. API, línea 1776 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-61-d)

<a id="API-STK-61-e"></a>
#### API-STK-61-e · `POST /api/admin/stk/rma-cases/{id}/ship`

- **Qué hace:** RMA. Despacha un registro de RMA de equipos con proveedores (`rmaCases`).
- **Para qué sirve:** RF-STK-085: Conteo de series: las series contadas que no figuran se registran como "encontradas" para análisis y las no encontradas como "faltantes", sin crear ni dar de baja unidades automáticamente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.rma.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M13 §11. API, línea 1776 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-61-e)

<a id="API-STK-61-f"></a>
#### API-STK-61-f · `POST /api/admin/stk/rma-cases/{id}/return`

- **Qué hace:** RMA. Devuelve un registro de RMA de equipos con proveedores (`rmaCases`).
- **Para qué sirve:** RF-STK-085: Conteo de series: las series contadas que no figuran se registran como "encontradas" para análisis y las no encontradas como "faltantes", sin crear ni dar de baja unidades automáticamente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.rma.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M13 §11. API, línea 1776 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-61-f)

<a id="API-STK-62"></a>
#### API-STK-62 · `GET /api/admin/stk/service-receptions`

- **Qué hace:** Recepción técnica. Lista, con filtros y paginación, los registros de equipos de clientes recibidos para reparación (`serviceReceptions`).
- **Para qué sirve:** RF-STK-114: Recepción técnica de equipos de clientes (servicio técnico): número, fechas, cliente(s), quién pide, comprobante, observaciones, productos recibidos con cantidad y precio, estados por ítem con historial; estados configurables con… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.recepciones.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de equipos de clientes recibidos para reparación (`serviceReceptions`) con `total`.
- **Pantallas:** PAN-STK-30 (Recepciones técnicas de equipos de clientes).
- **Ola:** O10 · **Fuente:** M13 §11. API, línea 1777 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-62)

<a id="API-STK-62-b"></a>
#### API-STK-62-b · `POST /api/admin/stk/service-receptions`

- **Qué hace:** Recepción técnica. Da de alta un registro de equipos de clientes recibidos para reparación (`serviceReceptions`).
- **Para qué sirve:** RF-STK-114: Recepción técnica de equipos de clientes (servicio técnico): número, fechas, cliente(s), quién pide, comprobante, observaciones, productos recibidos con cantidad y precio, estados por ítem con historial; estados configurables con… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.recepciones.crear`.
- **Recibe:** los datos de equipos de clientes recibidos para reparación (`serviceReceptions`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de equipos de clientes recibidos para reparación (`serviceReceptions`).
- **Ola:** O10 · **Fuente:** M13 §11. API, línea 1777 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-62-b)

<a id="API-STK-62-c"></a>
#### API-STK-62-c · `PATCH /api/admin/stk/service-receptions`

- **Qué hace:** Recepción técnica. Modifica algunos campos de un registro de equipos de clientes recibidos para reparación (`serviceReceptions`) (solo los enviados).
- **Para qué sirve:** RF-STK-114: Recepción técnica de equipos de clientes (servicio técnico): número, fechas, cliente(s), quién pide, comprobante, observaciones, productos recibidos con cantidad y precio, estados por ítem con historial; estados configurables con… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.recepciones.crear`.
- **Recibe:** solo los campos a cambiar de equipos de clientes recibidos para reparación (`serviceReceptions`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de equipos de clientes recibidos para reparación (`serviceReceptions`).
- **Ola:** O10 · **Fuente:** M13 §11. API, línea 1777 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-62-c)

<a id="API-STK-62-d"></a>
#### API-STK-62-d · `POST /api/admin/stk/service-receptions/{id}/items/{lineId}/status`

- **Qué hace:** Recepción técnica. Registra «status» sobre un registro de equipos de clientes recibidos para reparación (`serviceReceptions`).
- **Para qué sirve:** RF-STK-114: Recepción técnica de equipos de clientes (servicio técnico): número, fechas, cliente(s), quién pide, comprobante, observaciones, productos recibidos con cantidad y precio, estados por ítem con historial; estados configurables con… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.recepciones.crear`.
- **Recibe:** en la ruta `id`, `lineId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O10 · **Fuente:** M13 §11. API, línea 1777 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-62-d)

<a id="API-STK-62-e"></a>
#### API-STK-62-e · `POST /api/admin/stk/service-receptions/{id}/deliver`

- **Qué hace:** Recepción técnica. Entrega un registro de equipos de clientes recibidos para reparación (`serviceReceptions`).
- **Para qué sirve:** RF-STK-114: Recepción técnica de equipos de clientes (servicio técnico): número, fechas, cliente(s), quién pide, comprobante, observaciones, productos recibidos con cantidad y precio, estados por ítem con historial; estados configurables con… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.recepciones.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O10 · **Fuente:** M13 §11. API, línea 1777 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-62-e)

<a id="API-STK-63"></a>
#### API-STK-63 · `GET /api/admin/stk/manufacturing/boms`

- **Qué hace:** Estructuras. Consulta `boms`.
- **Para qué sirve:** RF-STK-116: Estructura de producto fabricable (BOM) multinivel: componente, cantidad, costo, etapa, referencias y observaciones; versionado con historia; clonación de estructura. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.fabricacion.estructuras.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-STK-31 (Estructuras).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1778 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-63)

<a id="API-STK-63-c"></a>
#### API-STK-63-c · `PUT /api/admin/stk/manufacturing/boms`

- **Qué hace:** Estructuras. Reemplaza o configura `boms`.
- **Para qué sirve:** RF-STK-116: Estructura de producto fabricable (BOM) multinivel: componente, cantidad, costo, etapa, referencias y observaciones; versionado con historia; clonación de estructura. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.fabricacion.estructuras.editar`.
- **Recibe:** un cuerpo JSON cuya estructura detalla el anexo; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1778 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-63-c)

<a id="API-STK-63-b"></a>
#### API-STK-63-b · `POST /api/admin/stk/manufacturing/boms`

- **Qué hace:** Estructuras. Registra un nuevo elemento u operación en `boms`.
- **Para qué sirve:** RF-STK-116: Estructura de producto fabricable (BOM) multinivel: componente, cantidad, costo, etapa, referencias y observaciones; versionado con historia; clonación de estructura. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.fabricacion.estructuras.editar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1778 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-63-b)

<a id="API-STK-63-d"></a>
#### API-STK-63-d · `POST /api/admin/stk/manufacturing/boms/{itemId}/versions`

- **Qué hace:** Estructuras. Da de alta un registro de versiones de estructura (`bomStructureVersions`).
- **Para qué sirve:** RF-STK-116: Estructura de producto fabricable (BOM) multinivel: componente, cantidad, costo, etapa, referencias y observaciones; versionado con historia; clonación de estructura. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.fabricacion.estructuras.editar`.
- **Recibe:** en la ruta `itemId`; los datos de versiones de estructura (`bomStructureVersions`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de versiones de estructura (`bomStructureVersions`).
- **Ola:** O10 · **Fuente:** M13 §11. API, línea 1778 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-63-d)

<a id="API-STK-63-e"></a>
#### API-STK-63-e · `POST /api/admin/stk/manufacturing/boms/{itemId}/clone`

- **Qué hace:** Estructuras. Clona un registro de `clone`.
- **Para qué sirve:** RF-STK-116: Estructura de producto fabricable (BOM) multinivel: componente, cantidad, costo, etapa, referencias y observaciones; versionado con historia; clonación de estructura. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.fabricacion.estructuras.editar`.
- **Recibe:** en la ruta `itemId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1778 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-63-e)

<a id="API-STK-63-f"></a>
#### API-STK-63-f · `POST /api/admin/stk/manufacturing/boms/{itemId}/cost`

- **Qué hace:** Estructuras. Registra «cost» sobre un registro de `cost`.
- **Para qué sirve:** RF-STK-116: Estructura de producto fabricable (BOM) multinivel: componente, cantidad, costo, etapa, referencias y observaciones; versionado con historia; clonación de estructura. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.fabricacion.estructuras.editar`.
- **Recibe:** en la ruta `itemId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1778 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-63-f)

<a id="API-STK-64"></a>
#### API-STK-64 · `GET /api/admin/stk/manufacturing/stages`

- **Qué hace:** Etapas y divisiones. Lista, con filtros y paginación, los registros de etapas de fabricación (`manufacturingStages`).
- **Para qué sirve:** RF-STK-118: Etapas de fabricación por producto con orden, descripción, duración y observaciones. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.fabricacion.estructuras.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de etapas de fabricación (`manufacturingStages`) con `total`.
- **Pantallas:** PAN-STK-31 (Estructuras).
- **Ola:** O10 · **Fuente:** M13 §11. API, línea 1779 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-64)

<a id="API-STK-64-b"></a>
#### API-STK-64-b · `POST /api/admin/stk/manufacturing/stages`

- **Qué hace:** Etapas y divisiones. Da de alta un registro de etapas de fabricación (`manufacturingStages`).
- **Para qué sirve:** RF-STK-118: Etapas de fabricación por producto con orden, descripción, duración y observaciones. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.fabricacion.estructuras.editar`.
- **Recibe:** los datos de etapas de fabricación (`manufacturingStages`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de etapas de fabricación (`manufacturingStages`).
- **Ola:** O10 · **Fuente:** M13 §11. API, línea 1779 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-64-b)

<a id="API-STK-64-c"></a>
#### API-STK-64-c · `GET /api/admin/stk/manufacturing/divisions`

- **Qué hace:** Etapas y divisiones. Lista, con filtros y paginación, los registros de divisiones de producto (`productDivisions`).
- **Para qué sirve:** RF-STK-118: Etapas de fabricación por producto con orden, descripción, duración y observaciones. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.fabricacion.estructuras.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de divisiones de producto (`productDivisions`) con `total`.
- **Pantallas:** PAN-STK-31 (Estructuras).
- **Ola:** O10 · **Fuente:** M13 §11. API, línea 1779 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-64-c)

<a id="API-STK-64-d"></a>
#### API-STK-64-d · `POST /api/admin/stk/manufacturing/divisions`

- **Qué hace:** Etapas y divisiones. Da de alta un registro de divisiones de producto (`productDivisions`).
- **Para qué sirve:** RF-STK-118: Etapas de fabricación por producto con orden, descripción, duración y observaciones. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.fabricacion.estructuras.editar`.
- **Recibe:** los datos de divisiones de producto (`productDivisions`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de divisiones de producto (`productDivisions`).
- **Ola:** O10 · **Fuente:** M13 §11. API, línea 1779 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-64-d)

<a id="API-STK-65"></a>
#### API-STK-65 · `GET /api/admin/stk/manufacturing/orders`

- **Qué hace:** Órdenes. Lista, con filtros y paginación, los registros de órdenes de fabricación (`manufacturingOrders`).
- **Para qué sirve:** RF-STK-129: Informes: insumos pendientes de utilizar, matrículas generadas, órdenes, productos fabricados en stock, órdenes pendientes por producto, productos dañados, listado de componentes agrupado, etiquetas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.fabricacion.ordenes.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de órdenes de fabricación (`manufacturingOrders`) con `total`.
- **Pantallas:** PAN-STK-32 (Órdenes de fabricación).
- **Ola:** O10 · **Fuente:** M13 §11. API, línea 1780 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-65)

<a id="API-STK-65-b"></a>
#### API-STK-65-b · `POST /api/admin/stk/manufacturing/orders`

- **Qué hace:** Órdenes. Da de alta un registro de órdenes de fabricación (`manufacturingOrders`).
- **Para qué sirve:** RF-STK-129: Informes: insumos pendientes de utilizar, matrículas generadas, órdenes, productos fabricados en stock, órdenes pendientes por producto, productos dañados, listado de componentes agrupado, etiquetas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.fabricacion.ordenes.editar`.
- **Recibe:** los datos de órdenes de fabricación (`manufacturingOrders`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de órdenes de fabricación (`manufacturingOrders`).
- **Ola:** O10 · **Fuente:** M13 §11. API, línea 1780 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-65-b)

<a id="API-STK-65-c"></a>
#### API-STK-65-c · `PATCH /api/admin/stk/manufacturing/orders`

- **Qué hace:** Órdenes. Modifica algunos campos de un registro de órdenes de fabricación (`manufacturingOrders`) (solo los enviados).
- **Para qué sirve:** RF-STK-129: Informes: insumos pendientes de utilizar, matrículas generadas, órdenes, productos fabricados en stock, órdenes pendientes por producto, productos dañados, listado de componentes agrupado, etiquetas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.fabricacion.ordenes.editar`.
- **Recibe:** solo los campos a cambiar de órdenes de fabricación (`manufacturingOrders`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de órdenes de fabricación (`manufacturingOrders`).
- **Ola:** O10 · **Fuente:** M13 §11. API, línea 1780 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-65-c)

<a id="API-STK-65-d"></a>
#### API-STK-65-d · `POST /api/admin/stk/manufacturing/orders/{id}/launch`

- **Qué hace:** Órdenes. Lanza un registro de órdenes de fabricación (`manufacturingOrders`).
- **Para qué sirve:** RF-STK-129: Informes: insumos pendientes de utilizar, matrículas generadas, órdenes, productos fabricados en stock, órdenes pendientes por producto, productos dañados, listado de componentes agrupado, etiquetas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.fabricacion.ordenes.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O10 · **Fuente:** M13 §11. API, línea 1780 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-65-d)

<a id="API-STK-65-e"></a>
#### API-STK-65-e · `POST /api/admin/stk/manufacturing/orders/{id}/finish`

- **Qué hace:** Órdenes. Finaliza un registro de órdenes de fabricación (`manufacturingOrders`).
- **Para qué sirve:** RF-STK-129: Informes: insumos pendientes de utilizar, matrículas generadas, órdenes, productos fabricados en stock, órdenes pendientes por producto, productos dañados, listado de componentes agrupado, etiquetas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.fabricacion.ordenes.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O10 · **Fuente:** M13 §11. API, línea 1780 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-65-e)

<a id="API-STK-65-f"></a>
#### API-STK-65-f · `POST /api/admin/stk/manufacturing/orders/{id}/cancel`

- **Qué hace:** Órdenes. Cancela un registro de órdenes de fabricación (`manufacturingOrders`).
- **Para qué sirve:** RF-STK-129: Informes: insumos pendientes de utilizar, matrículas generadas, órdenes, productos fabricados en stock, órdenes pendientes por producto, productos dañados, listado de componentes agrupado, etiquetas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.fabricacion.ordenes.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O10 · **Fuente:** M13 §11. API, línea 1780 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-65-f)

<a id="API-STK-65-g"></a>
#### API-STK-65-g · `POST /api/admin/stk/manufacturing/orders/{id}/void`

- **Qué hace:** Órdenes. Anula un registro de órdenes de fabricación (`manufacturingOrders`).
- **Para qué sirve:** RF-STK-129: Informes: insumos pendientes de utilizar, matrículas generadas, órdenes, productos fabricados en stock, órdenes pendientes por producto, productos dañados, listado de componentes agrupado, etiquetas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.fabricacion.ordenes.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O10 · **Fuente:** M13 §11. API, línea 1780 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-65-g)

<a id="API-STK-65-h"></a>
#### API-STK-65-h · `POST /api/admin/stk/manufacturing/orders/{id}/extend`

- **Qué hace:** Órdenes. Extiende un registro de órdenes de fabricación (`manufacturingOrders`).
- **Para qué sirve:** RF-STK-129: Informes: insumos pendientes de utilizar, matrículas generadas, órdenes, productos fabricados en stock, órdenes pendientes por producto, productos dañados, listado de componentes agrupado, etiquetas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.fabricacion.ordenes.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O10 · **Fuente:** M13 §11. API, línea 1780 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-65-h)

<a id="API-STK-66"></a>
#### API-STK-66 · `GET /api/admin/stk/manufacturing/reports`

- **Qué hace:** Partes de producción. Lista, con filtros y paginación, los registros de partes de producción (`productionReports`).
- **Para qué sirve:** RF-STK-122: Partes de producción con ítems y componentes: pendiente → en producción → finalizado; consumo de componentes al lanzar (si se configura) o al finalizar; disponibilidad = stock − comprometido en partes abiertos; marcar productos… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.fabricacion.partes.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de partes de producción (`productionReports`) con `total`.
- **Pantallas:** PAN-STK-33 (Partes de producción).
- **Ola:** O10 · **Fuente:** M13 §11. API, línea 1781 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-66)

<a id="API-STK-66-b"></a>
#### API-STK-66-b · `POST /api/admin/stk/manufacturing/reports`

- **Qué hace:** Partes de producción. Da de alta un registro de partes de producción (`productionReports`).
- **Para qué sirve:** RF-STK-122: Partes de producción con ítems y componentes: pendiente → en producción → finalizado; consumo de componentes al lanzar (si se configura) o al finalizar; disponibilidad = stock − comprometido en partes abiertos; marcar productos… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.fabricacion.partes.crear`.
- **Recibe:** los datos de partes de producción (`productionReports`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de partes de producción (`productionReports`).
- **Ola:** O10 · **Fuente:** M13 §11. API, línea 1781 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-66-b)

<a id="API-STK-66-c"></a>
#### API-STK-66-c · `POST /api/admin/stk/manufacturing/reports/{id}/launch`

- **Qué hace:** Partes de producción. Lanza un registro de partes de producción (`productionReports`).
- **Para qué sirve:** RF-STK-122: Partes de producción con ítems y componentes: pendiente → en producción → finalizado; consumo de componentes al lanzar (si se configura) o al finalizar; disponibilidad = stock − comprometido en partes abiertos; marcar productos… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.fabricacion.partes.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O10 · **Fuente:** M13 §11. API, línea 1781 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-66-c)

<a id="API-STK-66-d"></a>
#### API-STK-66-d · `POST /api/admin/stk/manufacturing/reports/{id}/finish`

- **Qué hace:** Partes de producción. Finaliza un registro de partes de producción (`productionReports`).
- **Para qué sirve:** RF-STK-122: Partes de producción con ítems y componentes: pendiente → en producción → finalizado; consumo de componentes al lanzar (si se configura) o al finalizar; disponibilidad = stock − comprometido en partes abiertos; marcar productos… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.fabricacion.partes.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O10 · **Fuente:** M13 §11. API, línea 1781 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-66-d)

<a id="API-STK-66-e"></a>
#### API-STK-66-e · `POST /api/admin/stk/manufacturing/reports/{id}/damage`

- **Qué hace:** Partes de producción. Registra «damage» sobre un registro de partes de producción (`productionReports`).
- **Para qué sirve:** RF-STK-122: Partes de producción con ítems y componentes: pendiente → en producción → finalizado; consumo de componentes al lanzar (si se configura) o al finalizar; disponibilidad = stock − comprometido en partes abiertos; marcar productos… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.fabricacion.partes.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O10 · **Fuente:** M13 §11. API, línea 1781 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-66-e)

<a id="API-STK-66-f"></a>
#### API-STK-66-f · `POST /api/admin/stk/manufacturing/reports/{id}/void`

- **Qué hace:** Partes de producción. Anula un registro de partes de producción (`productionReports`).
- **Para qué sirve:** RF-STK-122: Partes de producción con ítems y componentes: pendiente → en producción → finalizado; consumo de componentes al lanzar (si se configura) o al finalizar; disponibilidad = stock − comprometido en partes abiertos; marcar productos… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.fabricacion.partes.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O10 · **Fuente:** M13 §11. API, línea 1781 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-66-f)

<a id="API-STK-66-g"></a>
#### API-STK-66-g · `POST /api/admin/stk/manufacturing/reports/{id}/labels`

- **Qué hace:** Partes de producción. Registra «labels» sobre un registro de partes de producción (`productionReports`).
- **Para qué sirve:** RF-STK-122: Partes de producción con ítems y componentes: pendiente → en producción → finalizado; consumo de componentes al lanzar (si se configura) o al finalizar; disponibilidad = stock − comprometido en partes abiertos; marcar productos… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.fabricacion.partes.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O10 · **Fuente:** M13 §11. API, línea 1781 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-66-g)

<a id="API-STK-67"></a>
#### API-STK-67 · `POST /api/admin/stk/manufacturing/mrp-runs`

- **Qué hace:** MRP y requisiciones. Da de alta un registro de aprovisionamiento de fabricación (`mrpRuns`).
- **Para qué sirve:** RF-STK-126: Aprovisionamiento de fabricación (MRP simple): para las órdenes lanzadas del rango no finalizadas, calcula necesidades de componentes a la fecha de lanzamiento + días del componente, descuenta lo en proceso y el stock, excluye… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.fabricacion.aprovisionamiento.ejecutar`.
- **Recibe:** los datos de aprovisionamiento de fabricación (`mrpRuns`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de aprovisionamiento de fabricación (`mrpRuns`).
- **Pantallas:** PAN-STK-34 (MRP).
- **Ola:** O10 · **Fuente:** M13 §11. API, línea 1782 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-67)

<a id="API-STK-67-b"></a>
#### API-STK-67-b · `POST /api/admin/stk/manufacturing/mrp-runs/{id}/requisitions`

- **Qué hace:** MRP y requisiciones. Registra «requisitions» sobre un registro de aprovisionamiento de fabricación (`mrpRuns`).
- **Para qué sirve:** RF-STK-126: Aprovisionamiento de fabricación (MRP simple): para las órdenes lanzadas del rango no finalizadas, calcula necesidades de componentes a la fecha de lanzamiento + días del componente, descuenta lo en proceso y el stock, excluye… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.fabricacion.aprovisionamiento.ejecutar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-STK-34 (MRP).
- **Ola:** O10 · **Fuente:** M13 §11. API, línea 1782 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-67-b)

<a id="API-STK-68"></a>
#### API-STK-68 · `GET /api/admin/stk/reports/{reportKey}`

- **Qué hace:** Informes y exportación (format=xlsx/csv/pdf). Obtiene el detalle de un registro de partes de producción (`productionReports`).
- **Para qué sirve:** RF-STK-135: Catálogo de informes de stock (sección 15) con filtros, agrupaciones, exportación y programación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.informes.ver`.
- **Recibe:** en la ruta `reportKey`.
- **Devuelve:** 200: el registro de partes de producción (`productionReports`).
- **Pantallas:** PAN-STK-35 (Catálogo de informes).
- **Ola:** O10 · **Fuente:** M13 §11. API, línea 1783 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-68)

<a id="API-STK-69"></a>
#### API-STK-69 · `POST /api/admin/stk/labels`

- **Qué hace:** Etiquetas por artículo/serie/lote/ubicación. Registra un nuevo elemento u operación en `labels`; el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-STK-034: Impresión de etiquetas (código de barras/QR) por artículo, serie, lote y ubicación, con pregunta opcional al registrar ingresos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.etiquetas.imprimir`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1784 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-69)

<a id="API-STK-70"></a>
#### API-STK-70 · `POST /api/v1/ext/stk/vouchers`

- **Qué hace:** Vales desde sistemas externos (reemplaza Procoop INTEGRA). Registra un nuevo elemento u operación en `vouchers`.
- **Para qué sirve:** RF-STK-043: Integración: recibir vales desde sistemas externos por API con token, idempotentes. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); permiso `stk.ext.vales.crear`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O11 · **Fuente:** M13 §11. API, línea 1785 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-70)

<a id="API-STK-71"></a>
#### API-STK-71 · `GET /api/v1/ext/stk/balances`

- **Qué hace:** Saldos para terceros/BI. Lista, con filtros y paginación, los registros de saldos materializados (`stockBalances`).
- **Para qué sirve:** RF-STK-052: Equipos de propiedad del socio o de terceros: registro opcional de identificadores (MAC, serie) para aprovisionamiento y soporte, sin existencia ni valorización propia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); permiso `stk.ext.saldos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de saldos materializados (`stockBalances`) con `total`.
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1786 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-71)

<a id="API-STK-72"></a>
#### API-STK-72 · `GET /api/admin/stk/audit`

- **Qué hace:** Auditoría del módulo. Consulta `audit`.
- **Para qué sirve:** RF-STK-137: Auditoría de cada cambio de configuración y de cada operación (antes/después, actor, origen). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `stk.auditoria.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O3 · **Fuente:** M13 §11. API, línea 1787 · [Ver en Swagger](../18-swagger/index.html?api=m13-stk#/API/API-STK-72)
