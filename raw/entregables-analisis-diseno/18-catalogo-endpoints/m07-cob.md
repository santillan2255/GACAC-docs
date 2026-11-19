# Catálogo de endpoints · M07 · Cuenta corriente, cobranza, cajas, entes, débitos, pasarelas y conciliación

Parte del [catálogo de endpoints](../18-catalogo-endpoints.md) (artefacto 7.1). Generado el 05-11-2026 con `_trabajo/gen_18_catalogo_endpoints.py` a partir de `18-openapi/`; no se edita a mano.

## Para qué sirve esta API

Ser la única fuente del saldo comercial de cada titular dentro de su tenant y el único camino por el que entra dinero al sistema. El módulo:

1. Registra cada obligación exigible (una por servicio dentro de cada comprobante, FAC-008) y cada movimiento del auxiliar comercial; el saldo se deriva de movimientos e imputaciones, nunca se edita (AGR-011).
2. Presenta la cuenta del socio separada por servicio o unificada según la política del tenant, con resumen de cuenta que no crea deuda (FAC-003 a FAC-005, CTA-001).
3. Imputa cada cobro con una regla explícita y configurable (antigüedad, prioridad de servicio o elección del socio), sin dejar importes sin asignar y explicando cada peso recibido como cancelación, crédito o pendiente (FAC-008, AGR-012).
4. Opera la caja presencial completa (apertura, cobro por código de barras, medios de pago combinados, QR, descuentos, retenciones sufridas, anulación, arqueo y cierre con diferencias), los cobradores y la cobranza fuera de oficina (MER-007).
5. Integra todos los canales externos de cobro (entes recaudadores por archivo o API, débito automático por CBU o tarjeta, pasarelas de pago con link, botón, QR y tokenización) mediante un motor común: un modelo único de intención de pago, un motor declarativo de layouts para archivos y una interfaz única de conector con adaptador por proveedor.
6. Garantiza que un pago se registra una sola vez aunque el proveedor notifique varias veces, que un pago incierto no se reenvía sin conciliar (§105 solución 6, ESC-04) y que el bruto cobrado, la comisión y el neto acreditado se concilian por separado (BASE §13).
7. Gestiona devoluciones y contracargos con sus dos efectos (comercial y financiero, AGR-013), la conciliación de cobranzas, la rendición de fondos a tesorería y emite los eventos económicos que M15 contabiliza.

Detalle completo en el anexo M07, sección 1. Contrato navegable: [Swagger](../18-swagger/index.html?api=m07-cob).

| Dato | Valor |
|---|---|
| Endpoints | 114 |
| Por método | GET 41, PATCH 5, POST 58, PUT 10 |
| Grupos funcionales | 5 |
| Con requisito citado en el anexo | 0 |
| Con requisito inferido (a confirmar) | 114 |
| Sin requisito identificable | 0 |

## Grupos funcionales

| Grupo | Endpoints | Qué agrupa (primeros endpoints) |
|---|---|---|
| [Cuenta corriente e imputación (admin)](#grupo-1) | 29 | Buscar cuentas corrientes (titular, documento, cuenta…; Cabecera con saldos, mínimo, badges.; Obligaciones con filtros.… |
| [Caja](#grupo-2) | 29 | ABM de cajas y QR estático.; Abrir sesión.; Sesión abierta del usuario.… |
| [Entes y débito automático](#grupo-3) | 16 | ABM de entes.; Layouts versionados; POST /{id}/test prueba con archivo.; Vista previa de exportación.… |
| [Pasarelas, devoluciones, conciliación, cobradores, excepciones](#grupo-4) | 25 | Conectores (sin secretos); POST /{id}/test.; Canales visibles.; Listar intenciones.… |
| [PWA (socio y cobrador), público y externos](#grupo-5) | 15 | Cuentas autorizadas y saldos.; Obligaciones y recibos.; Iniciar pago.… |

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

## Cuenta corriente e imputación (admin)

29 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-COB-01](#API-COB-01) | GET | `/api/admin/cob/current-accounts` | Buscar cuentas corrientes (titular, documento, cuenta, código, identificador de pago). |
| [API-COB-02](#API-COB-02) | GET | `/api/admin/cob/current-accounts/{id}` | Cabecera con saldos, mínimo, badges. |
| [API-COB-03](#API-COB-03) | GET | `/api/admin/cob/current-accounts/{id}/obligations` | Obligaciones con filtros. |
| [API-COB-04](#API-COB-04) | GET | `/api/admin/cob/current-accounts/{id}/ledger` | Movimientos con saldo acumulado a una fecha. |
| [API-COB-05](#API-COB-05) | GET | `/api/admin/cob/obligations/{id}` | Detalle con componentes, imputaciones y cotización M08 a una fecha. |
| [API-COB-06](#API-COB-06) | POST | `/api/admin/cob/allocations/simulate` | Simulación del motor (dryRun). |
| [API-COB-07](#API-COB-07) | POST | `/api/admin/cob/allocations` | Imputación manual de un crédito. |
| [API-COB-08](#API-COB-08) | POST | `/api/admin/cob/allocations/{id}/reverse` | Reverso con motivo. |
| [API-COB-09](#API-COB-09) | POST | `/api/admin/cob/allocations/reassign` | Reasignación (reverso + imputación) con aprobación si supera umbral. |
| [API-COB-10](#API-COB-10) | POST | `/api/admin/cob/allocations/approvals/{id}/decision` | Aprobar o rechazar. |
| [API-COB-11](#API-COB-11) | GET | `/api/admin/cob/credit-balances` | Listar y crear anticipos o saldos a favor. |
| [API-COB-11-b](#API-COB-11-b) | POST | `/api/admin/cob/credit-balances` | Listar y crear anticipos o saldos a favor. |
| [API-COB-12](#API-COB-12) | POST | `/api/admin/cob/credit-balances/{id}/apply` | Aplicar saldo a obligaciones. |
| [API-COB-13](#API-COB-13) | PATCH | `/api/admin/cob/credit-balances/{id}` | Cambiar aplicación automática / próxima factura. |
| [API-COB-14](#API-COB-14) | POST | `/api/admin/cob/auto-offset/runs` | Simular o ejecutar cancelación automática. |
| [API-COB-15](#API-COB-15) | GET | `/api/admin/cob/unidentified-receipts` | Bandeja. |
| [API-COB-16](#API-COB-16) | POST | `/api/admin/cob/unidentified-receipts/{id}/identify` | Identificar titular y obligaciones con evidencia. |
| [API-COB-17](#API-COB-17) | POST | `/api/admin/cob/unidentified-receipts/{id}/apply` | Aplicar (genera recibo). |
| [API-COB-18](#API-COB-18) | POST | `/api/admin/cob/unidentified-receipts/{id}/to-credit` | Pasar a saldo a favor. |
| [API-COB-19](#API-COB-19) | POST | `/api/admin/cob/adjustments` | Ajuste de redondeo o causa catalogada (no fiscal). |
| [API-COB-20](#API-COB-20) | GET | `/api/admin/cob/statements` | Listar y emitir resúmenes. |
| [API-COB-20-b](#API-COB-20-b) | POST | `/api/admin/cob/statements` | Listar y emitir resúmenes. |
| [API-COB-21](#API-COB-21) | POST | `/api/admin/cob/payment-coupons` | Generar cupón único. |
| [API-COB-22](#API-COB-22) | POST | `/api/admin/cob/collection-blocks` | Bloqueo/desbloqueo individual o masivo. |
| [API-COB-23](#API-COB-23) | POST | `/api/admin/cob/external-obligation-imports` | Importar obligaciones externas (vista previa y confirmación). |
| [API-COB-24](#API-COB-24) | GET | `/api/admin/cob/allocation-policies` | Políticas versionadas (borrador, publicar). |
| [API-COB-24-b](#API-COB-24-b) | GET | `/api/admin/cob/allocation-policies/{id}` | Políticas versionadas (borrador, publicar). |
| [API-COB-24-c](#API-COB-24-c) | PUT | `/api/admin/cob/allocation-policies/{id}` | Políticas versionadas (borrador, publicar). |
| [API-COB-25](#API-COB-25) | GET | `/api/admin/cob/integrity-checks` | Resultados de JOB-COB-14; POST lanza verificación. |

<a id="API-COB-01"></a>
#### API-COB-01 · `GET /api/admin/cob/current-accounts`

- **Qué hace:** Buscar cuentas corrientes (titular, documento, cuenta, código, identificador de pago). Lista, con filtros y paginación, los registros de cuenta corriente de titular o grupo de facturación (`currentAccounts`).
- **Para qué sirve:** RF-COB-058: Buscar la deuda por código de barras, identificador de pago, comprobante (tipo, punto de venta, número), cuenta, titular (id, nombre, DNI/CUIT), cupón o QR del socio; elemento de búsqueda por defecto configurable. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.cuentas.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de cuenta corriente de titular o grupo de facturación (`currentAccounts`) con `total`.
- **Pantallas:** PAN-COB-01 (Cuenta corriente del titular).
- **Ola:** O5 · **Fuente:** M07 §11.1 Cuenta corriente e imputación (admin), línea 2499 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Cuenta%20corriente%20e%20imputaci%C3%B3n%20%28admin%29/API-COB-01)

<a id="API-COB-02"></a>
#### API-COB-02 · `GET /api/admin/cob/current-accounts/{id}`

- **Qué hace:** Cabecera con saldos, mínimo, badges. Obtiene el detalle de un registro de cuenta corriente de titular o grupo de facturación (`currentAccounts`).
- **Para qué sirve:** RF-COB-021: Configurar la modalidad de cuenta corriente por tenant (separada por servicio o unificada del titular) con excepciones por servicio, cuenta o titular, vigente desde un período. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.cuentas.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de cuenta corriente de titular o grupo de facturación (`currentAccounts`).
- **Pantallas:** PAN-COB-01 (Cuenta corriente del titular).
- **Ola:** O5 · **Fuente:** M07 §11.1 Cuenta corriente e imputación (admin), línea 2500 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Cuenta%20corriente%20e%20imputaci%C3%B3n%20%28admin%29/API-COB-02)

<a id="API-COB-03"></a>
#### API-COB-03 · `GET /api/admin/cob/current-accounts/{id}/obligations`

- **Qué hace:** Obligaciones con filtros. Lista, con filtros y paginación, los registros de obligaciones exigibles por bloque de servicio (`obligations`).
- **Para qué sirve:** RF-COB-005: Consultar movimientos y saldos por titular, cuenta corriente, contrato, servicio y documento, con filtros de vencido/no vencido, servicio, tipo de comprobante y rango de fechas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.cuentas.ver`.
- **Recibe:** en la ruta `id`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de obligaciones exigibles por bloque de servicio (`obligations`) con `total`.
- **Pantallas:** PAN-COB-01 (Cuenta corriente del titular).
- **Ola:** O5 · **Fuente:** M07 §11.1 Cuenta corriente e imputación (admin), línea 2501 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Cuenta%20corriente%20e%20imputaci%C3%B3n%20%28admin%29/API-COB-03)

<a id="API-COB-04"></a>
#### API-COB-04 · `GET /api/admin/cob/current-accounts/{id}/ledger`

- **Qué hace:** Movimientos con saldo acumulado a una fecha. Consulta «ledger» de un registro de cuenta corriente de titular o grupo de facturación (`currentAccounts`).
- **Para qué sirve:** RF-COB-005: Consultar movimientos y saldos por titular, cuenta corriente, contrato, servicio y documento, con filtros de vencido/no vencido, servicio, tipo de comprobante y rango de fechas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.cuentas.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de cuenta corriente de titular o grupo de facturación (`currentAccounts`).
- **Pantallas:** PAN-COB-01 (Cuenta corriente del titular).
- **Ola:** O5 · **Fuente:** M07 §11.1 Cuenta corriente e imputación (admin), línea 2502 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Cuenta%20corriente%20e%20imputaci%C3%B3n%20%28admin%29/API-COB-04)

<a id="API-COB-05"></a>
#### API-COB-05 · `GET /api/admin/cob/obligations/{id}`

- **Qué hace:** Detalle con componentes, imputaciones y cotización M08 a una fecha. Obtiene el detalle de un registro de obligaciones exigibles por bloque de servicio (`obligations`).
- **Para qué sirve:** RF-COB-191: Consultar el historial de la cuenta corriente con consulta diferida para el detalle de más de 36 meses (DEC-087, PA-DAT-02): obligaciones, imputaciones, recibos y sus PDF quedan siempre en línea; el detalle accesorio archivado… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.cuentas.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de obligaciones exigibles por bloque de servicio (`obligations`).
- **Pantallas:** PAN-COB-01 (Cuenta corriente del titular).
- **Ola:** O5 · **Fuente:** M07 §11.1 Cuenta corriente e imputación (admin), línea 2503 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Cuenta%20corriente%20e%20imputaci%C3%B3n%20%28admin%29/API-COB-05)

<a id="API-COB-06"></a>
#### API-COB-06 · `POST /api/admin/cob/allocations/simulate`

- **Qué hace:** Simulación del motor (dryRun). Simula sin efectos sobre imputaciones (`allocations`).
- **Para qué sirve:** RF-COB-145: Crear y enviar links de pago por WhatsApp, email o SMS desde caja, cuenta corriente, CRM o portal, con plantilla. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.imputaciones.crear`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COB-02 (Imputaciones y reasignación), PAN-COB-32 (Importación de obligaciones externas).
- **Ola:** O5 · **Fuente:** M07 §11.1 Cuenta corriente e imputación (admin), línea 2504 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Cuenta%20corriente%20e%20imputaci%C3%B3n%20%28admin%29/API-COB-06)

<a id="API-COB-07"></a>
#### API-COB-07 · `POST /api/admin/cob/allocations`

- **Qué hace:** Imputación manual de un crédito. Da de alta un registro de imputaciones (`allocations`).
- **Para qué sirve:** RF-COB-050: Crear anticipos manuales con concepto, importe, vencimientos, porcentaje de aplicación parcial, aplicación en facturación futura e imputación no automática. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.imputaciones.crear`.
- **Recibe:** los datos de imputaciones (`allocations`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de imputaciones (`allocations`).
- **Pantallas:** PAN-COB-02 (Imputaciones y reasignación), PAN-COB-32 (Importación de obligaciones externas).
- **Ola:** O5 · **Fuente:** M07 §11.1 Cuenta corriente e imputación (admin), línea 2505 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Cuenta%20corriente%20e%20imputaci%C3%B3n%20%28admin%29/API-COB-07)

<a id="API-COB-08"></a>
#### API-COB-08 · `POST /api/admin/cob/allocations/{id}/reverse`

- **Qué hace:** Reverso con motivo. Revierte un registro de imputaciones (`allocations`).
- **Para qué sirve:** RF-COB-037: Reasignar imputaciones con autorización: reversa de la imputación original y nueva imputación, ambas trazables. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.imputaciones.reasignar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COB-02 (Imputaciones y reasignación).
- **Ola:** O5 · **Fuente:** M07 §11.1 Cuenta corriente e imputación (admin), línea 2506 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Cuenta%20corriente%20e%20imputaci%C3%B3n%20%28admin%29/API-COB-08)

<a id="API-COB-09"></a>
#### API-COB-09 · `POST /api/admin/cob/allocations/reassign`

- **Qué hace:** Reasignación (reverso + imputación) con aprobación si supera umbral. Registra un nuevo elemento u operación en imputaciones (`allocations`).
- **Para qué sirve:** RF-COB-037: Reasignar imputaciones con autorización: reversa de la imputación original y nueva imputación, ambas trazables. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.imputaciones.reasignar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COB-02 (Imputaciones y reasignación).
- **Ola:** O5 · **Fuente:** M07 §11.1 Cuenta corriente e imputación (admin), línea 2507 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Cuenta%20corriente%20e%20imputaci%C3%B3n%20%28admin%29/API-COB-09)

<a id="API-COB-10"></a>
#### API-COB-10 · `POST /api/admin/cob/allocations/approvals/{id}/decision`

- **Qué hace:** Aprobar o rechazar. Registra la decisión sobre un registro de imputaciones (`allocations`).
- **Para qué sirve:** RF-COB-021: Configurar la modalidad de cuenta corriente por tenant (separada por servicio o unificada del titular) con excepciones por servicio, cuenta o titular, vigente desde un período. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.imputaciones.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COB-02 (Imputaciones y reasignación).
- **Ola:** O5 · **Fuente:** M07 §11.1 Cuenta corriente e imputación (admin), línea 2508 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Cuenta%20corriente%20e%20imputaci%C3%B3n%20%28admin%29/API-COB-10)

<a id="API-COB-11"></a>
#### API-COB-11 · `GET /api/admin/cob/credit-balances`

- **Qué hace:** Listar y crear anticipos o saldos a favor. Lista, con filtros y paginación, los registros de saldos a favor y anticipos (`creditBalances`).
- **Para qué sirve:** RF-COB-040: Aplicar créditos (NC, anticipos, saldos a favor) contra débitos abiertos por orden de vencimiento, excluyendo los créditos marcados como de imputación no automática; en lote o por cuenta. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.creditos.crear`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de saldos a favor y anticipos (`creditBalances`) con `total`.
- **Pantallas:** PAN-COB-03 (Saldos a favor y anticipos).
- **Ola:** O5 · **Fuente:** M07 §11.1 Cuenta corriente e imputación (admin), línea 2509 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Cuenta%20corriente%20e%20imputaci%C3%B3n%20%28admin%29/API-COB-11)

<a id="API-COB-11-b"></a>
#### API-COB-11-b · `POST /api/admin/cob/credit-balances`

- **Qué hace:** Listar y crear anticipos o saldos a favor. Da de alta un registro de saldos a favor y anticipos (`creditBalances`).
- **Para qué sirve:** RF-COB-040: Aplicar créditos (NC, anticipos, saldos a favor) contra débitos abiertos por orden de vencimiento, excluyendo los créditos marcados como de imputación no automática; en lote o por cuenta. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.creditos.crear`.
- **Recibe:** los datos de saldos a favor y anticipos (`creditBalances`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de saldos a favor y anticipos (`creditBalances`).
- **Pantallas:** PAN-COB-03 (Saldos a favor y anticipos).
- **Ola:** O5 · **Fuente:** M07 §11.1 Cuenta corriente e imputación (admin), línea 2509 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Cuenta%20corriente%20e%20imputaci%C3%B3n%20%28admin%29/API-COB-11-b)

<a id="API-COB-12"></a>
#### API-COB-12 · `POST /api/admin/cob/credit-balances/{id}/apply`

- **Qué hace:** Aplicar saldo a obligaciones. Aplica un registro de saldos a favor y anticipos (`creditBalances`).
- **Para qué sirve:** RF-COB-040: Aplicar créditos (NC, anticipos, saldos a favor) contra débitos abiertos por orden de vencimiento, excluyendo los créditos marcados como de imputación no automática; en lote o por cuenta. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.creditos.aplicar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COB-03 (Saldos a favor y anticipos).
- **Ola:** O5 · **Fuente:** M07 §11.1 Cuenta corriente e imputación (admin), línea 2510 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Cuenta%20corriente%20e%20imputaci%C3%B3n%20%28admin%29/API-COB-12)

<a id="API-COB-13"></a>
#### API-COB-13 · `PATCH /api/admin/cob/credit-balances/{id}`

- **Qué hace:** Cambiar aplicación automática / próxima factura. Modifica algunos campos de un registro de saldos a favor y anticipos (`creditBalances`) (solo los enviados).
- **Para qué sirve:** RF-COB-040: Aplicar créditos (NC, anticipos, saldos a favor) contra débitos abiertos por orden de vencimiento, excluyendo los créditos marcados como de imputación no automática; en lote o por cuenta. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.creditos.aprobar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de saldos a favor y anticipos (`creditBalances`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de saldos a favor y anticipos (`creditBalances`).
- **Pantallas:** PAN-COB-03 (Saldos a favor y anticipos).
- **Ola:** O5 · **Fuente:** M07 §11.1 Cuenta corriente e imputación (admin), línea 2511 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Cuenta%20corriente%20e%20imputaci%C3%B3n%20%28admin%29/API-COB-13)

<a id="API-COB-14"></a>
#### API-COB-14 · `POST /api/admin/cob/auto-offset/runs`

- **Qué hace:** Simular o ejecutar cancelación automática. Registra un nuevo elemento u operación en `runs`.
- **Para qué sirve:** RF-COB-049: Ante un pago de ente o pasarela sobre un comprobante ya cancelado por otra vía, crear un saldo a favor en la cuenta pagadora, con marca de imputación no automática configurable y visible en el resultado de la importación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.autoOffset.ejecutar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COB-05 (Cancelación automática de créditos).
- **Ola:** O5 · **Fuente:** M07 §11.1 Cuenta corriente e imputación (admin), línea 2512 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Cuenta%20corriente%20e%20imputaci%C3%B3n%20%28admin%29/API-COB-14)

<a id="API-COB-15"></a>
#### API-COB-15 · `GET /api/admin/cob/unidentified-receipts`

- **Qué hace:** Bandeja. Lista, con filtros y paginación, los registros de cobros no identificados (`unidentifiedReceipts`).
- **Para qué sirve:** RF-COB-046: Gestionar una bandeja de cobros no identificados con canal, importe, referencia, datos del pagador, evidencia, responsable, antigüedad, identificación y aplicación autorizada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.noIdentificados.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de cobros no identificados (`unidentifiedReceipts`) con `total`.
- **Pantallas:** PAN-COB-04 (Bandeja de cobros no identificados).
- **Ola:** O5 · **Fuente:** M07 §11.1 Cuenta corriente e imputación (admin), línea 2513 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Cuenta%20corriente%20e%20imputaci%C3%B3n%20%28admin%29/API-COB-15)

<a id="API-COB-16"></a>
#### API-COB-16 · `POST /api/admin/cob/unidentified-receipts/{id}/identify`

- **Qué hace:** Identificar titular y obligaciones con evidencia. Identifica un registro de cobros no identificados (`unidentifiedReceipts`).
- **Para qué sirve:** RF-COB-046: Gestionar una bandeja de cobros no identificados con canal, importe, referencia, datos del pagador, evidencia, responsable, antigüedad, identificación y aplicación autorizada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.noIdentificados.identificar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COB-04 (Bandeja de cobros no identificados).
- **Ola:** O5 · **Fuente:** M07 §11.1 Cuenta corriente e imputación (admin), línea 2514 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Cuenta%20corriente%20e%20imputaci%C3%B3n%20%28admin%29/API-COB-16)

<a id="API-COB-17"></a>
#### API-COB-17 · `POST /api/admin/cob/unidentified-receipts/{id}/apply`

- **Qué hace:** Aplicar (genera recibo). Aplica un registro de cobros no identificados (`unidentifiedReceipts`).
- **Para qué sirve:** RF-COB-046: Gestionar una bandeja de cobros no identificados con canal, importe, referencia, datos del pagador, evidencia, responsable, antigüedad, identificación y aplicación autorizada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.noIdentificados.aplicar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COB-04 (Bandeja de cobros no identificados).
- **Ola:** O5 · **Fuente:** M07 §11.1 Cuenta corriente e imputación (admin), línea 2515 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Cuenta%20corriente%20e%20imputaci%C3%B3n%20%28admin%29/API-COB-17)

<a id="API-COB-18"></a>
#### API-COB-18 · `POST /api/admin/cob/unidentified-receipts/{id}/to-credit`

- **Qué hace:** Pasar a saldo a favor. Pasa a crédito un registro de cobros no identificados (`unidentifiedReceipts`).
- **Para qué sirve:** RF-COB-051: Generar saldo a favor por redondeo en cobros en efectivo cuando el tenant lo habilite, con importe máximo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.noIdentificados.aplicar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COB-04 (Bandeja de cobros no identificados).
- **Ola:** O5 · **Fuente:** M07 §11.1 Cuenta corriente e imputación (admin), línea 2516 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Cuenta%20corriente%20e%20imputaci%C3%B3n%20%28admin%29/API-COB-18)

<a id="API-COB-19"></a>
#### API-COB-19 · `POST /api/admin/cob/adjustments`

- **Qué hace:** Ajuste de redondeo o causa catalogada (no fiscal). Registra un nuevo elemento u operación en `adjustments`.
- **Para qué sirve:** RF-COB-157: Gestionar el expediente de devolución: solicitud, causa, documento correctivo si corresponde (NC por M05), aprobación, cuenta destino, ejecución financiera (proveedor o M14) y conciliación; una orden repetida no devuelve dos… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.ajustes.aprobar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O5 · **Fuente:** M07 §11.1 Cuenta corriente e imputación (admin), línea 2517 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Cuenta%20corriente%20e%20imputaci%C3%B3n%20%28admin%29/API-COB-19)

<a id="API-COB-20"></a>
#### API-COB-20 · `GET /api/admin/cob/statements`

- **Qué hace:** Listar y emitir resúmenes. Lista, con filtros y paginación, los registros de resúmenes de cuenta (`accountStatements`).
- **Para qué sirve:** RF-COB-086: Emitir recibo por cuenta corriente (o uno por operación si se configura, nunca mezclando entidades jurídicas: RF-COB-193, DEC-087) de tipo oficial, interno, pago por ente o pago a titular; recibo oficial siempre cuando el tenant… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.resumenes.emitir`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de resúmenes de cuenta (`accountStatements`) con `total`.
- **Pantallas:** PAN-COB-06 (Resúmenes de cuenta y cupón único).
- **Ola:** O5 · **Fuente:** M07 §11.1 Cuenta corriente e imputación (admin), línea 2518 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Cuenta%20corriente%20e%20imputaci%C3%B3n%20%28admin%29/API-COB-20)

<a id="API-COB-20-b"></a>
#### API-COB-20-b · `POST /api/admin/cob/statements`

- **Qué hace:** Listar y emitir resúmenes. Da de alta un registro de resúmenes de cuenta (`accountStatements`).
- **Para qué sirve:** RF-COB-086: Emitir recibo por cuenta corriente (o uno por operación si se configura, nunca mezclando entidades jurídicas: RF-COB-193, DEC-087) de tipo oficial, interno, pago por ente o pago a titular; recibo oficial siempre cuando el tenant… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.resumenes.emitir`.
- **Recibe:** los datos de resúmenes de cuenta (`accountStatements`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de resúmenes de cuenta (`accountStatements`).
- **Pantallas:** PAN-COB-06 (Resúmenes de cuenta y cupón único).
- **Ola:** O5 · **Fuente:** M07 §11.1 Cuenta corriente e imputación (admin), línea 2518 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Cuenta%20corriente%20e%20imputaci%C3%B3n%20%28admin%29/API-COB-20-b)

<a id="API-COB-21"></a>
#### API-COB-21 · `POST /api/admin/cob/payment-coupons`

- **Qué hace:** Generar cupón único. Da de alta un registro de cupón de pago único (`paymentCoupons`).
- **Para qué sirve:** RF-COB-154: Emitir cupón de pago único (código de barras, QR y código electrónico) que cancela en un acto varias facturas del resumen, con vigencia y anulación si no se paga. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.resumenes.emitir`.
- **Recibe:** los datos de cupón de pago único (`paymentCoupons`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de cupón de pago único (`paymentCoupons`).
- **Pantallas:** PAN-COB-06 (Resúmenes de cuenta y cupón único).
- **Ola:** O5 · **Fuente:** M07 §11.1 Cuenta corriente e imputación (admin), línea 2519 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Cuenta%20corriente%20e%20imputaci%C3%B3n%20%28admin%29/API-COB-21)

<a id="API-COB-22"></a>
#### API-COB-22 · `POST /api/admin/cob/collection-blocks`

- **Qué hace:** Bloqueo/desbloqueo individual o masivo. Registra un nuevo elemento u operación en `collection-blocks`.
- **Para qué sirve:** RF-COB-012: Bloquear comprobantes para el cobro, individual o masivamente por filtros, con motivo y vigencia; desbloquear con permiso. Caja, entes, pasarelas y portal respetan el bloqueo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.bloqueos.gestionar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COB-31 (Bloqueos de cobro).
- **Ola:** O5 · **Fuente:** M07 §11.1 Cuenta corriente e imputación (admin), línea 2520 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Cuenta%20corriente%20e%20imputaci%C3%B3n%20%28admin%29/API-COB-22)

<a id="API-COB-23"></a>
#### API-COB-23 · `POST /api/admin/cob/external-obligation-imports`

- **Qué hace:** Importar obligaciones externas (vista previa y confirmación). Da de alta un registro de importación de obligaciones externas (`externalObligationImports`).
- **Para qué sirve:** RF-COB-090: Imprimir operación de caja en lugar de recibo o sin vista previa según configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.cuentas.importar`.
- **Recibe:** los datos de importación de obligaciones externas (`externalObligationImports`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de importación de obligaciones externas (`externalObligationImports`).
- **Pantallas:** PAN-COB-32 (Importación de obligaciones externas).
- **Ola:** O5 · **Fuente:** M07 §11.1 Cuenta corriente e imputación (admin), línea 2521 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Cuenta%20corriente%20e%20imputaci%C3%B3n%20%28admin%29/API-COB-23)

<a id="API-COB-24"></a>
#### API-COB-24 · `GET /api/admin/cob/allocation-policies`

- **Qué hace:** Políticas versionadas (borrador, publicar). Lista, con filtros y paginación, los registros de políticas de imputación versionadas (`allocationPolicies`).
- **Para qué sirve:** RF-COB-042: Explicar cada imputación con la política y versión aplicada, el orden, el componente y el autor. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.politicas.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de políticas de imputación versionadas (`allocationPolicies`) con `total`.
- **Pantallas:** PAN-COB-07 (Configuración de cuenta corriente e imputación).
- **Ola:** O5 · **Fuente:** M07 §11.1 Cuenta corriente e imputación (admin), línea 2522 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Cuenta%20corriente%20e%20imputaci%C3%B3n%20%28admin%29/API-COB-24)

<a id="API-COB-24-b"></a>
#### API-COB-24-b · `GET /api/admin/cob/allocation-policies/{id}`

- **Qué hace:** Políticas versionadas (borrador, publicar). Obtiene el detalle de un registro de políticas de imputación versionadas (`allocationPolicies`).
- **Para qué sirve:** RF-COB-042: Explicar cada imputación con la política y versión aplicada, el orden, el componente y el autor. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.politicas.configurar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de políticas de imputación versionadas (`allocationPolicies`).
- **Pantallas:** PAN-COB-07 (Configuración de cuenta corriente e imputación).
- **Ola:** O5 · **Fuente:** M07 §11.1 Cuenta corriente e imputación (admin), línea 2522 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Cuenta%20corriente%20e%20imputaci%C3%B3n%20%28admin%29/API-COB-24-b)

<a id="API-COB-24-c"></a>
#### API-COB-24-c · `PUT /api/admin/cob/allocation-policies/{id}`

- **Qué hace:** Políticas versionadas (borrador, publicar). Reemplaza o configura un registro de políticas de imputación versionadas (`allocationPolicies`).
- **Para qué sirve:** RF-COB-042: Explicar cada imputación con la política y versión aplicada, el orden, el componente y el autor. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.politicas.configurar`.
- **Recibe:** en la ruta `id`; los datos de políticas de imputación versionadas (`allocationPolicies`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de políticas de imputación versionadas (`allocationPolicies`).
- **Pantallas:** PAN-COB-07 (Configuración de cuenta corriente e imputación).
- **Ola:** O5 · **Fuente:** M07 §11.1 Cuenta corriente e imputación (admin), línea 2522 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Cuenta%20corriente%20e%20imputaci%C3%B3n%20%28admin%29/API-COB-24-c)

<a id="API-COB-25"></a>
#### API-COB-25 · `GET /api/admin/cob/integrity-checks`

- **Qué hace:** Resultados de JOB-COB-14; POST lanza verificación. Consulta `integrity-checks`.
- **Para qué sirve:** RF-COB-016: Verificar diariamente la integridad: obligaciones − imputaciones = saldos proyectados; recibo = suma de ítems; operación = suma de medios; cada medio = su registro. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.integridad.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O5 · **Fuente:** M07 §11.1 Cuenta corriente e imputación (admin), línea 2523 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Cuenta%20corriente%20e%20imputaci%C3%B3n%20%28admin%29/API-COB-25)

<a id="grupo-2"></a>

## Caja

29 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-COB-26](#API-COB-26) | GET | `/api/admin/cob/cash-registers` | ABM de cajas y QR estático. |
| [API-COB-26-b](#API-COB-26-b) | POST | `/api/admin/cob/cash-registers` | ABM de cajas y QR estático. |
| [API-COB-26-c](#API-COB-26-c) | PATCH | `/api/admin/cob/cash-registers` | ABM de cajas y QR estático. |
| [API-COB-27](#API-COB-27) | POST | `/api/admin/cob/cash-sessions` | Abrir sesión. |
| [API-COB-28](#API-COB-28) | GET | `/api/admin/cob/cash-sessions/current` | Sesión abierta del usuario. |
| [API-COB-29](#API-COB-29) | POST | `/api/admin/cob/cash-sessions/{id}/close-preview` | Teórico e integridad. |
| [API-COB-30](#API-COB-30) | POST | `/api/admin/cob/cash-sessions/{id}/close` | Cerrar con declaración y justificaciones. |
| [API-COB-31](#API-COB-31) | POST | `/api/admin/cob/cash-sessions/{id}/differences/{diffId}/approve` | Aprobar diferencia. |
| [API-COB-32](#API-COB-32) | POST | `/api/admin/cob/cash-sessions/{id}/reopen` | Reabrir. |
| [API-COB-33](#API-COB-33) | POST | `/api/admin/cob/cash-operations/quote` | Cotizar cobro (motor + M08 + recargos por medio + descuentos + vuelto). |
| [API-COB-34](#API-COB-34) | POST | `/api/admin/cob/cash-operations` | Confirmar cobro (operación, recibos, imputaciones, medios). |
| [API-COB-35](#API-COB-35) | POST | `/api/admin/cob/cash-operations/manual` | Ingreso/egreso manual, donación, pago a proveedor. |
| [API-COB-36](#API-COB-36) | POST | `/api/admin/cob/cash-operations/{id}/void` | Anular (supervisor si corresponde). |
| [API-COB-37](#API-COB-37) | POST | `/api/admin/cob/cash-qr/{cashRegisterId}/charge` | Cargar importe en el QR del puesto y esperar confirmación. |
| [API-COB-38](#API-COB-38) | GET | `/api/admin/cob/receipts` | Listar recibos. |
| [API-COB-39](#API-COB-39) | GET | `/api/admin/cob/receipts/{id}/pdf` | URL firmada del PDF (marca duplicado en reimpresión). |
| [API-COB-40](#API-COB-40) | POST | `/api/admin/cob/receipts/{id}/send` | Enviar por el motor de comunicaciones de T09 (com.communications.emit; antes "canal M10"). |
| [API-COB-41](#API-COB-41) | GET | `/api/admin/cob/treasury-handovers` | Rendiciones; POST /{id}/receive y /{id}/reject. |
| [API-COB-41-b](#API-COB-41-b) | POST | `/api/admin/cob/treasury-handovers` | Rendiciones; POST /{id}/receive y /{id}/reject. |
| [API-COB-42](#API-COB-42) | GET | `/api/admin/cob/payment-methods` | Configuración de medios, tarjetas y descuentos. |
| [API-COB-42-b](#API-COB-42-b) | PUT | `/api/admin/cob/payment-methods` | Configuración de medios, tarjetas y descuentos. |
| [API-COB-42-c](#API-COB-42-c) | GET | `/api/admin/cob/card-plans` | Configuración de medios, tarjetas y descuentos. |
| [API-COB-42-d](#API-COB-42-d) | PUT | `/api/admin/cob/card-plans` | Configuración de medios, tarjetas y descuentos. |
| [API-COB-42-e](#API-COB-42-e) | GET | `/api/admin/cob/cash-discount-rules` | Configuración de medios, tarjetas y descuentos. |
| [API-COB-42-f](#API-COB-42-f) | PUT | `/api/admin/cob/cash-discount-rules` | Configuración de medios, tarjetas y descuentos. |
| [API-COB-43](#API-COB-43) | GET | `/api/admin/cob/tenders/cheques` | Cheques recibidos. |
| [API-COB-44](#API-COB-44) | GET | `/api/admin/cob/third-party-billers` | Terceros. |
| [API-COB-44-b](#API-COB-44-b) | PUT | `/api/admin/cob/third-party-billers` | Terceros. |
| [API-COB-45](#API-COB-45) | POST | `/api/admin/cob/third-party-collections/parse` | Leer código de barras del tercero y validar. |

<a id="API-COB-26"></a>
#### API-COB-26 · `GET /api/admin/cob/cash-registers`

- **Qué hace:** ABM de cajas y QR estático. Lista, con filtros y paginación, los registros de cajas (`cashRegisters`).
- **Para qué sirve:** RF-COB-068: Cobrar con QR de caja: dinámico por operación o estático por puesto; en ambos casos con referencia única por transacción. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.caja.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de cajas (`cashRegisters`) con `total`.
- **Pantallas:** PAN-COB-08 (Cajas y QR estático).
- **Ola:** O5 · **Fuente:** M07 §11.2 Caja, línea 2529 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Caja/API-COB-26)

<a id="API-COB-26-b"></a>
#### API-COB-26-b · `POST /api/admin/cob/cash-registers`

- **Qué hace:** ABM de cajas y QR estático. Da de alta un registro de cajas (`cashRegisters`).
- **Para qué sirve:** RF-COB-068: Cobrar con QR de caja: dinámico por operación o estático por puesto; en ambos casos con referencia única por transacción. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.caja.configurar`.
- **Recibe:** los datos de cajas (`cashRegisters`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de cajas (`cashRegisters`).
- **Pantallas:** PAN-COB-08 (Cajas y QR estático).
- **Ola:** O5 · **Fuente:** M07 §11.2 Caja, línea 2529 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Caja/API-COB-26-b)

<a id="API-COB-26-c"></a>
#### API-COB-26-c · `PATCH /api/admin/cob/cash-registers`

- **Qué hace:** ABM de cajas y QR estático. Modifica algunos campos de un registro de cajas (`cashRegisters`) (solo los enviados).
- **Para qué sirve:** RF-COB-068: Cobrar con QR de caja: dinámico por operación o estático por puesto; en ambos casos con referencia única por transacción. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.caja.configurar`.
- **Recibe:** solo los campos a cambiar de cajas (`cashRegisters`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de cajas (`cashRegisters`).
- **Pantallas:** PAN-COB-08 (Cajas y QR estático).
- **Ola:** O5 · **Fuente:** M07 §11.2 Caja, línea 2529 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Caja/API-COB-26-c)

<a id="API-COB-27"></a>
#### API-COB-27 · `POST /api/admin/cob/cash-sessions`

- **Qué hace:** Abrir sesión. Da de alta un registro de turnos de caja (`cashSessions`).
- **Para qué sirve:** RF-COB-056: Abrir la sesión de caja por operador con fondo inicial por moneda y observación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.caja.abrir`.
- **Recibe:** los datos de turnos de caja (`cashSessions`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de turnos de caja (`cashSessions`).
- **Pantallas:** PAN-COB-09 (Apertura de caja).
- **Ola:** O5 · **Fuente:** M07 §11.2 Caja, línea 2530 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Caja/API-COB-27)

<a id="API-COB-28"></a>
#### API-COB-28 · `GET /api/admin/cob/cash-sessions/current`

- **Qué hace:** Sesión abierta del usuario. Consulta turnos de caja (`cashSessions`).
- **Para qué sirve:** RF-COB-057: Exigir sesión abierta para cobrar, anular o egresar; seleccionar la caja si el usuario tiene varias. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.caja.cobrar`.
- **Recibe:** nada.
- **Devuelve:** 200: el registro de turnos de caja (`cashSessions`).
- **Pantallas:** PAN-COB-10 (Cobro en ventanilla), PAN-COB-30 (Cobro por cuenta de terceros).
- **Ola:** O5 · **Fuente:** M07 §11.2 Caja, línea 2531 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Caja/API-COB-28)

<a id="API-COB-29"></a>
#### API-COB-29 · `POST /api/admin/cob/cash-sessions/{id}/close-preview`

- **Qué hace:** Teórico e integridad. Previsualiza el cierre de un registro de turnos de caja (`cashSessions`).
- **Para qué sirve:** RF-COB-168: Preparar la rendición del cajero a tesorería: carátula, recibos, operaciones, comprobantes cobrados, integridad, cierre teórico, efectivo, valores, cupones, retenciones y transferencias, filtrable por fecha de registración o de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.caja.cerrar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COB-12 (Cierre y arqueo), PAN-COB-13 (Rendición a tesorería).
- **Ola:** O5 · **Fuente:** M07 §11.2 Caja, línea 2532 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Caja/API-COB-29)

<a id="API-COB-30"></a>
#### API-COB-30 · `POST /api/admin/cob/cash-sessions/{id}/close`

- **Qué hace:** Cerrar con declaración y justificaciones. Cierra un registro de turnos de caja (`cashSessions`).
- **Para qué sirve:** RF-COB-081: Registrar diferencias de arqueo con justificación obligatoria y aprobación por encima de un umbral; generar el quebranto de ingreso o egreso. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.caja.cerrar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COB-12 (Cierre y arqueo), PAN-COB-13 (Rendición a tesorería).
- **Ola:** O5 · **Fuente:** M07 §11.2 Caja, línea 2533 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Caja/API-COB-30)

<a id="API-COB-31"></a>
#### API-COB-31 · `POST /api/admin/cob/cash-sessions/{id}/differences/{diffId}/approve`

- **Qué hace:** Aprobar diferencia. Aprueba un registro de turnos de caja (`cashSessions`).
- **Para qué sirve:** RF-COB-081: Registrar diferencias de arqueo con justificación obligatoria y aprobación por encima de un umbral; generar el quebranto de ingreso o egreso. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.caja.aprobarDiferencia`.
- **Recibe:** en la ruta `id`, `diffId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COB-12 (Cierre y arqueo).
- **Ola:** O5 · **Fuente:** M07 §11.2 Caja, línea 2534 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Caja/API-COB-31)

<a id="API-COB-32"></a>
#### API-COB-32 · `POST /api/admin/cob/cash-sessions/{id}/reopen`

- **Qué hace:** Reabrir. Reabre un registro de turnos de caja (`cashSessions`).
- **Para qué sirve:** RF-COB-082: Cerrar el turno; permitir cierre de varias sesiones o días si el tenant lo habilita; reabrir (anular el cierre) con permiso solo si tesorería no procesó la rendición. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.caja.reabrir`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COB-12 (Cierre y arqueo).
- **Ola:** O5 · **Fuente:** M07 §11.2 Caja, línea 2535 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Caja/API-COB-32)

<a id="API-COB-33"></a>
#### API-COB-33 · `POST /api/admin/cob/cash-operations/quote`

- **Qué hace:** Cotizar cobro (motor + M08 + recargos por medio + descuentos + vuelto). Cotiza sobre operaciones de caja (`cashOperations`).
- **Para qué sirve:** RF-COB-062: Calcular el recargo invocando a M08 con la fecha de cobro (o fecha de cálculo fija configurada) y permitir cambiar el recargo diario o no cobrarlo con permiso, dejando registro. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.caja.cobrar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COB-10 (Cobro en ventanilla), PAN-COB-30 (Cobro por cuenta de terceros).
- **Ola:** O5 · **Fuente:** M07 §11.2 Caja, línea 2536 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Caja/API-COB-33)

<a id="API-COB-34"></a>
#### API-COB-34 · `POST /api/admin/cob/cash-operations`

- **Qué hace:** Confirmar cobro (operación, recibos, imputaciones, medios). Da de alta un registro de operaciones de caja (`cashOperations`).
- **Para qué sirve:** RF-COB-084: Mantener trazabilidad recibo ↔ operación ↔ imputación ↔ medios ↔ sesión ↔ rendición a tesorería. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.caja.cobrar`.
- **Recibe:** los datos de operaciones de caja (`cashOperations`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de operaciones de caja (`cashOperations`).
- **Pantallas:** PAN-COB-10 (Cobro en ventanilla), PAN-COB-30 (Cobro por cuenta de terceros).
- **Ola:** O5 · **Fuente:** M07 §11.2 Caja, línea 2537 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Caja/API-COB-34)

<a id="API-COB-35"></a>
#### API-COB-35 · `POST /api/admin/cob/cash-operations/manual`

- **Qué hace:** Ingreso/egreso manual, donación, pago a proveedor. Registra un nuevo elemento u operación en operaciones de caja (`cashOperations`).
- **Para qué sirve:** RF-COB-072: Registrar egresos de caja autorizados por pago a proveedor (órdenes de pago de M12/M14), con validación de firmas y marca de entrega. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.caja.egresar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O5 · **Fuente:** M07 §11.2 Caja, línea 2538 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Caja/API-COB-35)

<a id="API-COB-36"></a>
#### API-COB-36 · `POST /api/admin/cob/cash-operations/{id}/void`

- **Qué hace:** Anular (supervisor si corresponde). Anula un registro de operaciones de caja (`cashOperations`).
- **Para qué sirve:** RF-COB-079: Anular una operación de cobro con autorización, validaciones y efectos completos mediante reversos (sección 6.6). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.caja.anular`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COB-11 (Anulación de cobranza).
- **Ola:** O5 · **Fuente:** M07 §11.2 Caja, línea 2539 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Caja/API-COB-36)

<a id="API-COB-37"></a>
#### API-COB-37 · `POST /api/admin/cob/cash-qr/{cashRegisterId}/charge`

- **Qué hace:** Cargar importe en el QR del puesto y esperar confirmación. Cobra un registro de `charge`.
- **Para qué sirve:** RF-COB-068: Cobrar con QR de caja: dinámico por operación o estático por puesto; en ambos casos con referencia única por transacción. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.qr.cobrar`.
- **Recibe:** en la ruta `cashRegisterId`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O5 · **Fuente:** M07 §11.2 Caja, línea 2540 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Caja/API-COB-37)

<a id="API-COB-38"></a>
#### API-COB-38 · `GET /api/admin/cob/receipts`

- **Qué hace:** Listar recibos. Lista, con filtros y paginación, los registros de recibos (`receipts`).
- **Para qué sirve:** RF-COB-090: Imprimir operación de caja en lugar de recibo o sin vista previa según configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.recibos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de recibos (`receipts`) con `total`.
- **Pantallas:** PAN-COB-14 (Recibos).
- **Ola:** O5 · **Fuente:** M07 §11.2 Caja, línea 2541 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Caja/API-COB-38)

<a id="API-COB-39"></a>
#### API-COB-39 · `GET /api/admin/cob/receipts/{id}/pdf`

- **Qué hace:** URL firmada del PDF (marca duplicado en reimpresión). Descarga un archivo de recibos (`receipts`).
- **Para qué sirve:** RF-COB-088: Consultar, reimprimir y reenviar recibos (email, WhatsApp, SMS) con plantilla; cobrar la reimpresión según permiso si el tenant lo define. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.recibos.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un archivo (application/pdf).
- **Pantallas:** PAN-COB-14 (Recibos).
- **Ola:** O5 · **Fuente:** M07 §11.2 Caja, línea 2542 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Caja/API-COB-39)

<a id="API-COB-40"></a>
#### API-COB-40 · `POST /api/admin/cob/receipts/{id}/send`

- **Qué hace:** Enviar por el motor de comunicaciones de T09 (com.communications.emit; antes "canal M10"). Envía un registro de recibos (`receipts`).
- **Para qué sirve:** RF-COB-031: Usar un único motor de imputación para todos los canales (caja, cobrador, ente, débito, pasarela, cupón, crédito interno). · RF-COB-145: Crear y enviar links de pago por WhatsApp, email o SMS desde caja, cuenta corriente, CRM o portal, con plantilla. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.recibos.enviar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COB-14 (Recibos).
- **Ola:** O5 · **Fuente:** M07 §11.2 Caja, línea 2543 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Caja/API-COB-40)

<a id="API-COB-41"></a>
#### API-COB-41 · `GET /api/admin/cob/treasury-handovers`

- **Qué hace:** Rendiciones; POST /{id}/receive y /{id}/reject. Lista, con filtros y paginación, los registros de entrega de fondos de caja a tesorería (`treasuryHandovers`).
- **Para qué sirve:** RF-COB-082: Cerrar el turno; permitir cierre de varias sesiones o días si el tenant lo habilita; reabrir (anular el cierre) con permiso solo si tesorería no procesó la rendición. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.caja.cerrar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de entrega de fondos de caja a tesorería (`treasuryHandovers`) con `total`.
- **Pantallas:** PAN-COB-12 (Cierre y arqueo), PAN-COB-13 (Rendición a tesorería).
- **Ola:** O5 · **Fuente:** M07 §11.2 Caja, línea 2544 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Caja/API-COB-41)

<a id="API-COB-41-b"></a>
#### API-COB-41-b · `POST /api/admin/cob/treasury-handovers`

- **Qué hace:** Rendiciones; POST /{id}/receive y /{id}/reject. Da de alta un registro de entrega de fondos de caja a tesorería (`treasuryHandovers`).
- **Para qué sirve:** RF-COB-082: Cerrar el turno; permitir cierre de varias sesiones o días si el tenant lo habilita; reabrir (anular el cierre) con permiso solo si tesorería no procesó la rendición. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.caja.cerrar`.
- **Recibe:** los datos de entrega de fondos de caja a tesorería (`treasuryHandovers`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de entrega de fondos de caja a tesorería (`treasuryHandovers`).
- **Pantallas:** PAN-COB-12 (Cierre y arqueo), PAN-COB-13 (Rendición a tesorería).
- **Ola:** O5 · **Fuente:** M07 §11.2 Caja, línea 2544 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Caja/API-COB-41-b)

<a id="API-COB-42"></a>
#### API-COB-42 · `GET /api/admin/cob/payment-methods`

- **Qué hace:** Configuración de medios, tarjetas y descuentos. Lista, con filtros y paginación, los registros de catálogo de medios de pago (`paymentMethods`).
- **Para qué sirve:** RF-COB-138: Configurar medios, marcas de tarjeta y cuotas excluidas por canal (caja, prepaga, entidad, portal). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.medios.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de catálogo de medios de pago (`paymentMethods`) con `total`.
- **Pantallas:** PAN-COB-15 (Medios de pago, tarjetas y recargos).
- **Ola:** O5 · **Fuente:** M07 §11.2 Caja, línea 2545 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Caja/API-COB-42)

<a id="API-COB-42-b"></a>
#### API-COB-42-b · `PUT /api/admin/cob/payment-methods`

- **Qué hace:** Configuración de medios, tarjetas y descuentos. Reemplaza o configura catálogo de medios de pago (`paymentMethods`).
- **Para qué sirve:** RF-COB-138: Configurar medios, marcas de tarjeta y cuotas excluidas por canal (caja, prepaga, entidad, portal). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.medios.configurar`.
- **Recibe:** los datos de catálogo de medios de pago (`paymentMethods`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de catálogo de medios de pago (`paymentMethods`).
- **Pantallas:** PAN-COB-15 (Medios de pago, tarjetas y recargos).
- **Ola:** O5 · **Fuente:** M07 §11.2 Caja, línea 2545 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Caja/API-COB-42-b)

<a id="API-COB-42-c"></a>
#### API-COB-42-c · `GET /api/admin/cob/card-plans`

- **Qué hace:** Configuración de medios, tarjetas y descuentos. Lista, con filtros y paginación, los registros de tarjetas, planes de cuotas y recargos (`cardPlans`).
- **Para qué sirve:** RF-COB-138: Configurar medios, marcas de tarjeta y cuotas excluidas por canal (caja, prepaga, entidad, portal). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.medios.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de tarjetas, planes de cuotas y recargos (`cardPlans`) con `total`.
- **Pantallas:** PAN-COB-15 (Medios de pago, tarjetas y recargos).
- **Ola:** O5 · **Fuente:** M07 §11.2 Caja, línea 2545 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Caja/API-COB-42-c)

<a id="API-COB-42-d"></a>
#### API-COB-42-d · `PUT /api/admin/cob/card-plans`

- **Qué hace:** Configuración de medios, tarjetas y descuentos. Reemplaza o configura tarjetas, planes de cuotas y recargos (`cardPlans`).
- **Para qué sirve:** RF-COB-138: Configurar medios, marcas de tarjeta y cuotas excluidas por canal (caja, prepaga, entidad, portal). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.medios.configurar`.
- **Recibe:** los datos de tarjetas, planes de cuotas y recargos (`cardPlans`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de tarjetas, planes de cuotas y recargos (`cardPlans`).
- **Pantallas:** PAN-COB-15 (Medios de pago, tarjetas y recargos).
- **Ola:** O5 · **Fuente:** M07 §11.2 Caja, línea 2545 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Caja/API-COB-42-d)

<a id="API-COB-42-e"></a>
#### API-COB-42-e · `GET /api/admin/cob/cash-discount-rules`

- **Qué hace:** Configuración de medios, tarjetas y descuentos. Consulta `cash-discount-rules`.
- **Para qué sirve:** RF-COB-138: Configurar medios, marcas de tarjeta y cuotas excluidas por canal (caja, prepaga, entidad, portal). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.medios.configurar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COB-15 (Medios de pago, tarjetas y recargos).
- **Ola:** O5 · **Fuente:** M07 §11.2 Caja, línea 2545 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Caja/API-COB-42-e)

<a id="API-COB-42-f"></a>
#### API-COB-42-f · `PUT /api/admin/cob/cash-discount-rules`

- **Qué hace:** Configuración de medios, tarjetas y descuentos. Reemplaza o configura `cash-discount-rules`.
- **Para qué sirve:** RF-COB-138: Configurar medios, marcas de tarjeta y cuotas excluidas por canal (caja, prepaga, entidad, portal). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.medios.configurar`.
- **Recibe:** un cuerpo JSON cuya estructura detalla el anexo; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COB-15 (Medios de pago, tarjetas y recargos).
- **Ola:** O5 · **Fuente:** M07 §11.2 Caja, línea 2545 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Caja/API-COB-42-f)

<a id="API-COB-43"></a>
#### API-COB-43 · `GET /api/admin/cob/tenders/cheques`

- **Qué hace:** Cheques recibidos. Consulta medios de pago aplicados (`paymentTenders`).
- **Para qué sirve:** RF-COB-181: Consultar cheques recibidos en caja y controlar número de cheque repetido. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.caja.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: el registro de medios de pago aplicados (`paymentTenders`).
- **Pantallas:** PAN-COB-33 (Cheques recibidos).
- **Ola:** O5 · **Fuente:** M07 §11.2 Caja, línea 2546 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Caja/API-COB-43)

<a id="API-COB-44"></a>
#### API-COB-44 · `GET /api/admin/cob/third-party-billers`

- **Qué hace:** Terceros. Lista, con filtros y paginación, los registros de empresas que facturan por su cuenta y cobra la cooperativa (`thirdPartyBillers`).
- **Para qué sirve:** RF-COB-173: Publicar eventos económicos con los datos del asiento: medio, caja o ente, cuenta bancaria, servicio, centro de costo, componentes (capital, interés, tributo de terceros), comisión e IVA de comisión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.terceros.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de empresas que facturan por su cuenta y cobra la cooperativa (`thirdPartyBillers`) con `total`.
- **Pantallas:** PAN-COB-30 (Cobro por cuenta de terceros).
- **Ola:** O5 · **Fuente:** M07 §11.2 Caja, línea 2547 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Caja/API-COB-44)

<a id="API-COB-44-b"></a>
#### API-COB-44-b · `PUT /api/admin/cob/third-party-billers`

- **Qué hace:** Terceros. Reemplaza o configura empresas que facturan por su cuenta y cobra la cooperativa (`thirdPartyBillers`).
- **Para qué sirve:** RF-COB-173: Publicar eventos económicos con los datos del asiento: medio, caja o ente, cuenta bancaria, servicio, centro de costo, componentes (capital, interés, tributo de terceros), comisión e IVA de comisión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.terceros.configurar`.
- **Recibe:** los datos de empresas que facturan por su cuenta y cobra la cooperativa (`thirdPartyBillers`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de empresas que facturan por su cuenta y cobra la cooperativa (`thirdPartyBillers`).
- **Pantallas:** PAN-COB-30 (Cobro por cuenta de terceros).
- **Ola:** O5 · **Fuente:** M07 §11.2 Caja, línea 2547 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Caja/API-COB-44-b)

<a id="API-COB-45"></a>
#### API-COB-45 · `POST /api/admin/cob/third-party-collections/parse`

- **Qué hace:** Leer código de barras del tercero y validar. Registra un nuevo elemento u operación en cobros de terceros (`thirdPartyCollections`).
- **Para qué sirve:** RF-COB-177: Cobrar por cuenta de terceros (municipio, otros emisores) por código de barras del tercero, con validaciones (pagos múltiples, importes negativos, vencidos, mínimo), comisión fija o porcentual con mínimo y rendición al tercero. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.caja.cobrar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COB-10 (Cobro en ventanilla), PAN-COB-30 (Cobro por cuenta de terceros).
- **Ola:** O5 · **Fuente:** M07 §11.2 Caja, línea 2548 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Caja/API-COB-45)

<a id="grupo-3"></a>

## Entes y débito automático

16 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-COB-46](#API-COB-46) | GET | `/api/admin/cob/collection-agencies` | ABM de entes. |
| [API-COB-46-b](#API-COB-46-b) | PUT | `/api/admin/cob/collection-agencies` | ABM de entes. |
| [API-COB-47](#API-COB-47) | GET | `/api/admin/cob/file-layouts` | Layouts versionados; POST /{id}/test prueba con archivo. |
| [API-COB-47-b](#API-COB-47-b) | PUT | `/api/admin/cob/file-layouts` | Layouts versionados; POST /{id}/test prueba con archivo. |
| [API-COB-48](#API-COB-48) | POST | `/api/admin/cob/agency-debt-exports/preview` | Vista previa de exportación. |
| [API-COB-49](#API-COB-49) | POST | `/api/admin/cob/agency-debt-exports` | Generar y enviar/descargar. |
| [API-COB-50](#API-COB-50) | POST | `/api/admin/cob/agency-debt-exports/{id}/confirm` | Confirmar base de deuda SIRO por API. |
| [API-COB-51](#API-COB-51) | POST | `/api/admin/cob/agency-settlements` | Subir rendición o consultar API por fecha. |
| [API-COB-52](#API-COB-52) | GET | `/api/admin/cob/agency-settlements/{id}/lines` | Líneas con resultado. |
| [API-COB-53](#API-COB-53) | POST | `/api/admin/cob/agency-settlements/{id}/confirm` | Confirmar líneas seleccionadas. |
| [API-COB-54](#API-COB-54) | POST | `/api/admin/cob/agency-novelty-files` | Novedades y morosidad. |
| [API-COB-55](#API-COB-55) | GET | `/api/admin/cob/direct-debit-mandates` | Adhesiones (alta, suspensión, cancelación, exclusiones). El operador nunca carga datos de tarjeta: para tarjeta por pasarela genera la se... |
| [API-COB-55-b](#API-COB-55-b) | POST | `/api/admin/cob/direct-debit-mandates` | Adhesiones (alta, suspensión, cancelación, exclusiones). El operador nunca carga datos de tarjeta: para tarjeta por pasarela genera la se... |
| [API-COB-55-c](#API-COB-55-c) | PATCH | `/api/admin/cob/direct-debit-mandates` | Adhesiones (alta, suspensión, cancelación, exclusiones). El operador nunca carga datos de tarjeta: para tarjeta por pasarela genera la se... |
| [API-COB-56](#API-COB-56) | POST | `/api/admin/cob/direct-debit-batches` | Generar/presentar lote. |
| [API-COB-57](#API-COB-57) | POST | `/api/admin/cob/direct-debit-batches/{id}/results` | Importar resultados y rechazos. |

<a id="API-COB-46"></a>
#### API-COB-46 · `GET /api/admin/cob/collection-agencies`

- **Qué hace:** ABM de entes. Lista, con filtros y paginación, los registros de entes recaudadores (`collectionAgencies`).
- **Para qué sirve:** RF-COB-127: Excluir por defecto las obligaciones adheridas de la publicación a otros entes. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.entes.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de entes recaudadores (`collectionAgencies`) con `total`.
- **Pantallas:** PAN-COB-17 (Entes recaudadores y layouts).
- **Ola:** O5 · **Fuente:** M07 §11.3 Entes y débito automático, línea 2554 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Entes%20y%20d%C3%A9bito%20autom%C3%A1tico/API-COB-46)

<a id="API-COB-46-b"></a>
#### API-COB-46-b · `PUT /api/admin/cob/collection-agencies`

- **Qué hace:** ABM de entes. Reemplaza o configura entes recaudadores (`collectionAgencies`).
- **Para qué sirve:** RF-COB-127: Excluir por defecto las obligaciones adheridas de la publicación a otros entes. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.entes.configurar`.
- **Recibe:** los datos de entes recaudadores (`collectionAgencies`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de entes recaudadores (`collectionAgencies`).
- **Pantallas:** PAN-COB-17 (Entes recaudadores y layouts).
- **Ola:** O5 · **Fuente:** M07 §11.3 Entes y débito automático, línea 2554 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Entes%20y%20d%C3%A9bito%20autom%C3%A1tico/API-COB-46-b)

<a id="API-COB-47"></a>
#### API-COB-47 · `GET /api/admin/cob/file-layouts`

- **Qué hace:** Layouts versionados; POST /{id}/test prueba con archivo. Consulta `file-layouts`.
- **Para qué sirve:** RF-COB-099: Proveer un motor declarativo de layouts versionado (cabecera, detalle, pie, posición, largo, decimales implícitos, relleno, formatos de fecha incluida juliana, signo, cálculo de totales y contadores) con las familias Red Link… · RF-COB-112: Importar archivos de novedades de adhesión del ente (alta, baja, modificación) con layout propio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.layouts.configurar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COB-17 (Entes recaudadores y layouts).
- **Ola:** O5 · **Fuente:** M07 §11.3 Entes y débito automático, línea 2555 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Entes%20y%20d%C3%A9bito%20autom%C3%A1tico/API-COB-47)

<a id="API-COB-47-b"></a>
#### API-COB-47-b · `PUT /api/admin/cob/file-layouts`

- **Qué hace:** Layouts versionados; POST /{id}/test prueba con archivo. Reemplaza o configura `file-layouts`.
- **Para qué sirve:** RF-COB-099: Proveer un motor declarativo de layouts versionado (cabecera, detalle, pie, posición, largo, decimales implícitos, relleno, formatos de fecha incluida juliana, signo, cálculo de totales y contadores) con las familias Red Link… · RF-COB-112: Importar archivos de novedades de adhesión del ente (alta, baja, modificación) con layout propio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.layouts.configurar`.
- **Recibe:** un cuerpo JSON cuya estructura detalla el anexo; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COB-17 (Entes recaudadores y layouts).
- **Ola:** O5 · **Fuente:** M07 §11.3 Entes y débito automático, línea 2555 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Entes%20y%20d%C3%A9bito%20autom%C3%A1tico/API-COB-47-b)

<a id="API-COB-48"></a>
#### API-COB-48 · `POST /api/admin/cob/agency-debt-exports/preview`

- **Qué hace:** Vista previa de exportación. Previsualiza sin efectos sobre exportaciones de deuda a entes (`agencyDebtExports`).
- **Para qué sirve:** RF-COB-090: Imprimir operación de caja en lugar de recibo o sin vista previa según configuración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.entes.exportar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COB-18 (Archivo de deuda a entes).
- **Ola:** O5 · **Fuente:** M07 §11.3 Entes y débito automático, línea 2556 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Entes%20y%20d%C3%A9bito%20autom%C3%A1tico/API-COB-48)

<a id="API-COB-49"></a>
#### API-COB-49 · `POST /api/admin/cob/agency-debt-exports`

- **Qué hace:** Generar y enviar/descargar. Da de alta un registro de exportaciones de deuda a entes (`agencyDebtExports`).
- **Para qué sirve:** RF-COB-104: Generar automáticamente el archivo de deuda tras cada lote de facturación y, en modalidad continua, diariamente con las novedades. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.entes.exportar`.
- **Recibe:** los datos de exportaciones de deuda a entes (`agencyDebtExports`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de exportaciones de deuda a entes (`agencyDebtExports`).
- **Pantallas:** PAN-COB-18 (Archivo de deuda a entes).
- **Ola:** O5 · **Fuente:** M07 §11.3 Entes y débito automático, línea 2557 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Entes%20y%20d%C3%A9bito%20autom%C3%A1tico/API-COB-49)

<a id="API-COB-50"></a>
#### API-COB-50 · `POST /api/admin/cob/agency-debt-exports/{id}/confirm`

- **Qué hace:** Confirmar base de deuda SIRO por API. Confirma un registro de exportaciones de deuda a entes (`agencyDebtExports`).
- **Para qué sirve:** RF-COB-105: Informar la base de deuda por API cuando el ente lo ofrezca (SIRO) y consultar su estado (registros correctos, erróneos, totales). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.entes.exportar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COB-18 (Archivo de deuda a entes).
- **Ola:** O5 · **Fuente:** M07 §11.3 Entes y débito automático, línea 2558 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Entes%20y%20d%C3%A9bito%20autom%C3%A1tico/API-COB-50)

<a id="API-COB-51"></a>
#### API-COB-51 · `POST /api/admin/cob/agency-settlements`

- **Qué hace:** Subir rendición o consultar API por fecha. Da de alta un registro de rendiciones de entes (`agencySettlements`).
- **Para qué sirve:** RF-COB-123: Importar la rendición de débitos: aceptados se registran como cobro; rechazados con código (R08, R09, R10 y los del ente) vuelven a deuda visible y se notifica al socio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.entes.importar`.
- **Recibe:** los datos de rendiciones de entes (`agencySettlements`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de rendiciones de entes (`agencySettlements`).
- **Pantallas:** PAN-COB-19 (Importación de rendiciones).
- **Ola:** O5 · **Fuente:** M07 §11.3 Entes y débito automático, línea 2559 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Entes%20y%20d%C3%A9bito%20autom%C3%A1tico/API-COB-51)

<a id="API-COB-52"></a>
#### API-COB-52 · `GET /api/admin/cob/agency-settlements/{id}/lines`

- **Qué hace:** Líneas con resultado. Consulta «lines» de un registro de rendiciones de entes (`agencySettlements`).
- **Para qué sirve:** RF-COB-049: Ante un pago de ente o pasarela sobre un comprobante ya cancelado por otra vía, crear un saldo a favor en la cuenta pagadora, con marca de imputación no automática configurable y visible en el resultado de la importación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.entes.importar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de rendiciones de entes (`agencySettlements`).
- **Pantallas:** PAN-COB-19 (Importación de rendiciones).
- **Ola:** O5 · **Fuente:** M07 §11.3 Entes y débito automático, línea 2560 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Entes%20y%20d%C3%A9bito%20autom%C3%A1tico/API-COB-52)

<a id="API-COB-53"></a>
#### API-COB-53 · `POST /api/admin/cob/agency-settlements/{id}/confirm`

- **Qué hace:** Confirmar líneas seleccionadas. Confirma un registro de rendiciones de entes (`agencySettlements`).
- **Para qué sirve:** RF-COB-108: Presentar el resultado de la importación como log revisable antes de confirmar; confirmar solo registros OK o seleccionados; los errores pasan a la bandeja de excepciones. · RF-COB-191: Consultar el historial de la cuenta corriente con consulta diferida para el detalle de más de 36 meses (DEC-087, PA-DAT-02): obligaciones, imputaciones, recibos y sus PDF quedan siempre en línea; el detalle accesorio archivado… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.entes.confirmar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COB-19 (Importación de rendiciones).
- **Ola:** O5 · **Fuente:** M07 §11.3 Entes y débito automático, línea 2561 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Entes%20y%20d%C3%A9bito%20autom%C3%A1tico/API-COB-53)

<a id="API-COB-54"></a>
#### API-COB-54 · `POST /api/admin/cob/agency-novelty-files`

- **Qué hace:** Novedades y morosidad. Da de alta un registro de novedades y morosidad de entes (`agencyNoveltyFiles`).
- **Para qué sirve:** RF-COB-111: Importar el archivo de morosidad del ente (Tarjeta Naranja) y emitir su informe. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.debitos.importar`.
- **Recibe:** los datos de novedades y morosidad de entes (`agencyNoveltyFiles`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de novedades y morosidad de entes (`agencyNoveltyFiles`).
- **Pantallas:** PAN-COB-20 (Morosidad y novedades de entes), PAN-COB-22 (Presentaciones y rechazos de débito).
- **Ola:** O5 · **Fuente:** M07 §11.3 Entes y débito automático, línea 2562 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Entes%20y%20d%C3%A9bito%20autom%C3%A1tico/API-COB-54)

<a id="API-COB-55"></a>
#### API-COB-55 · `GET /api/admin/cob/direct-debit-mandates`

- **Qué hace:** Adhesiones (alta, suspensión, cancelación, exclusiones). El operador nunca carga datos de tarjeta: para tarjeta por pasarela genera la se... Lista, con filtros y paginación, los registros de adhesiones a débito automático (`directDebitMandates`).
- **Para qué sirve:** RF-COB-120: Dar de alta adhesiones por operador, por el socio en el portal o por API del proveedor (Pagos360), con estados Pendiente de firma, Activa, Cancelada, Error. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.debitos.adherir`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de adhesiones a débito automático (`directDebitMandates`) con `total`.
- **Pantallas:** PAN-COB-21 (Adhesiones a débito automático).
- **Ola:** O5 · **Fuente:** M07 §11.3 Entes y débito automático, línea 2563 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Entes%20y%20d%C3%A9bito%20autom%C3%A1tico/API-COB-55)

<a id="API-COB-55-b"></a>
#### API-COB-55-b · `POST /api/admin/cob/direct-debit-mandates`

- **Qué hace:** Adhesiones (alta, suspensión, cancelación, exclusiones). El operador nunca carga datos de tarjeta: para tarjeta por pasarela genera la se... Da de alta un registro de adhesiones a débito automático (`directDebitMandates`).
- **Para qué sirve:** RF-COB-120: Dar de alta adhesiones por operador, por el socio en el portal o por API del proveedor (Pagos360), con estados Pendiente de firma, Activa, Cancelada, Error. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.debitos.adherir`.
- **Recibe:** los datos de adhesiones a débito automático (`directDebitMandates`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de adhesiones a débito automático (`directDebitMandates`).
- **Pantallas:** PAN-COB-21 (Adhesiones a débito automático).
- **Ola:** O5 · **Fuente:** M07 §11.3 Entes y débito automático, línea 2563 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Entes%20y%20d%C3%A9bito%20autom%C3%A1tico/API-COB-55-b)

<a id="API-COB-55-c"></a>
#### API-COB-55-c · `PATCH /api/admin/cob/direct-debit-mandates`

- **Qué hace:** Adhesiones (alta, suspensión, cancelación, exclusiones). El operador nunca carga datos de tarjeta: para tarjeta por pasarela genera la se... Modifica algunos campos de un registro de adhesiones a débito automático (`directDebitMandates`) (solo los enviados).
- **Para qué sirve:** RF-COB-120: Dar de alta adhesiones por operador, por el socio en el portal o por API del proveedor (Pagos360), con estados Pendiente de firma, Activa, Cancelada, Error. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.debitos.adherir`.
- **Recibe:** solo los campos a cambiar de adhesiones a débito automático (`directDebitMandates`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de adhesiones a débito automático (`directDebitMandates`).
- **Pantallas:** PAN-COB-21 (Adhesiones a débito automático).
- **Ola:** O5 · **Fuente:** M07 §11.3 Entes y débito automático, línea 2563 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Entes%20y%20d%C3%A9bito%20autom%C3%A1tico/API-COB-55-c)

<a id="API-COB-56"></a>
#### API-COB-56 · `POST /api/admin/cob/direct-debit-batches`

- **Qué hace:** Generar/presentar lote. Registra un nuevo elemento u operación en lotes de débito (`directDebitBatches`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-COB-104: Generar automáticamente el archivo de deuda tras cada lote de facturación y, en modalidad continua, diariamente con las novedades. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.debitos.presentar`.
- **Recibe:** los datos de lotes de débito (`directDebitBatches`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-COB-22 (Presentaciones y rechazos de débito).
- **Ola:** O5 · **Fuente:** M07 §11.3 Entes y débito automático, línea 2564 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Entes%20y%20d%C3%A9bito%20autom%C3%A1tico/API-COB-56)

<a id="API-COB-57"></a>
#### API-COB-57 · `POST /api/admin/cob/direct-debit-batches/{id}/results`

- **Qué hace:** Importar resultados y rechazos. Agrega un elemento («results») a un registro de lotes de débito (`directDebitBatches`).
- **Para qué sirve:** RF-COB-123: Importar la rendición de débitos: aceptados se registran como cobro; rechazados con código (R08, R09, R10 y los del ente) vuelven a deuda visible y se notifica al socio. · RF-COB-049: Ante un pago de ente o pasarela sobre un comprobante ya cancelado por otra vía, crear un saldo a favor en la cuenta pagadora, con marca de imputación no automática configurable y visible en el resultado de la importación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.debitos.importar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COB-20 (Morosidad y novedades de entes), PAN-COB-22 (Presentaciones y rechazos de débito).
- **Ola:** O5 · **Fuente:** M07 §11.3 Entes y débito automático, línea 2565 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Entes%20y%20d%C3%A9bito%20autom%C3%A1tico/API-COB-57)

<a id="grupo-4"></a>

## Pasarelas, devoluciones, conciliación, cobradores, excepciones

25 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-COB-58](#API-COB-58) | GET | `/api/admin/cob/gateway-connectors` | Conectores (sin secretos); POST /{id}/test. |
| [API-COB-58-b](#API-COB-58-b) | PUT | `/api/admin/cob/gateway-connectors` | Conectores (sin secretos); POST /{id}/test. |
| [API-COB-59](#API-COB-59) | GET | `/api/admin/cob/payment-channels` | Canales visibles. |
| [API-COB-59-b](#API-COB-59-b) | PUT | `/api/admin/cob/payment-channels` | Canales visibles. |
| [API-COB-60](#API-COB-60) | GET | `/api/admin/cob/payment-intents` | Listar intenciones. |
| [API-COB-61](#API-COB-61) | POST | `/api/admin/cob/payment-intents` | Crear intención o link (reutiliza dentro de la ventana). |
| [API-COB-62](#API-COB-62) | POST | `/api/admin/cob/payment-intents/{id}/refresh` | Reconsultar al proveedor y reprocesar. |
| [API-COB-63](#API-COB-63) | POST | `/api/admin/cob/payment-intents/{id}/cancel` | Cancelar. |
| [API-COB-64](#API-COB-64) | POST | `/api/admin/cob/payment-intents/{id}/share` | Enviar link por WhatsApp/correo/SMS. |
| [API-COB-65](#API-COB-65) | POST | `/api/admin/cob/payment-intents/bulk` | Generación masiva (QR de facturas, SIRO). |
| [API-COB-66](#API-COB-66) | GET | `/api/admin/cob/refund-cases` | Expedientes. |
| [API-COB-66-b](#API-COB-66-b) | POST | `/api/admin/cob/refund-cases` | Expedientes. |
| [API-COB-67](#API-COB-67) | POST | `/api/admin/cob/refund-cases/{id}/decision` | Aprobar/rechazar (segregación). |
| [API-COB-68](#API-COB-68) | POST | `/api/admin/cob/refund-cases/{id}/execute` | Ejecutar. |
| [API-COB-69](#API-COB-69) | GET | `/api/admin/cob/chargebacks` | Contracargos y disputa. |
| [API-COB-69-b](#API-COB-69-b) | PATCH | `/api/admin/cob/chargebacks` | Contracargos y disputa. |
| [API-COB-70](#API-COB-70) | GET | `/api/admin/cob/reconciliations` | Tablero por día y canal. |
| [API-COB-71](#API-COB-71) | POST | `/api/admin/cob/reconciliations/{id}/match` | Emparejar ítems. |
| [API-COB-72](#API-COB-72) | POST | `/api/admin/cob/reconciliations/{id}/close` | Cerrar con acta. |
| [API-COB-73](#API-COB-73) | GET | `/api/admin/cob/collectors` | Cobradores. |
| [API-COB-73-b](#API-COB-73-b) | PUT | `/api/admin/cob/collectors` | Cobradores. |
| [API-COB-74](#API-COB-74) | POST | `/api/admin/cob/collection-rounds` | Generar/asignar listas. |
| [API-COB-75](#API-COB-75) | GET | `/api/admin/cob/exceptions` | Bandeja de excepciones. |
| [API-COB-75-b](#API-COB-75-b) | PATCH | `/api/admin/cob/exceptions` | Bandeja de excepciones. |
| [API-COB-76](#API-COB-76) | GET | `/api/admin/cob/reports/{reportCode}` | Reporte; ?format=xlsx/csv/pdf exige cob.reportes.exportar. |

<a id="API-COB-58"></a>
#### API-COB-58 · `GET /api/admin/cob/gateway-connectors`

- **Qué hace:** Conectores (sin secretos); POST /{id}/test. Lista, con filtros y paginación, los registros de pasarelas (`gatewayConnectors`).
- **Para qué sirve:** RF-COB-170: Publicar a M14 la acreditación esperada por ente o pasarela (neto, fecha, cuenta) para la conciliación bancaria. · RF-COB-176: Informar a M17 el capital social cobrado al cierre de caja cuando corresponda. Corregido (HUECO-CAP-02): es solo una conciliación de cierre (capital cobrado en la sesión contra integraciones registradas por M17) sin efecto sobre… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.pasarelas.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de pasarelas (`gatewayConnectors`) con `total`.
- **Pantallas:** PAN-COB-23 (Conectores de pasarelas y canales).
- **Ola:** O5 · **Fuente:** M07 §11.4 Pasarelas, devoluciones, conciliación, cobradores, excepciones, línea 2571 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Pasarelas%2C%20devoluciones%2C%20conciliaci%C3%B3n%2C%20cobradores%2C%20excepciones/API-COB-58)

<a id="API-COB-58-b"></a>
#### API-COB-58-b · `PUT /api/admin/cob/gateway-connectors`

- **Qué hace:** Conectores (sin secretos); POST /{id}/test. Reemplaza o configura pasarelas (`gatewayConnectors`).
- **Para qué sirve:** RF-COB-170: Publicar a M14 la acreditación esperada por ente o pasarela (neto, fecha, cuenta) para la conciliación bancaria. · RF-COB-176: Informar a M17 el capital social cobrado al cierre de caja cuando corresponda. Corregido (HUECO-CAP-02): es solo una conciliación de cierre (capital cobrado en la sesión contra integraciones registradas por M17) sin efecto sobre… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.pasarelas.configurar`.
- **Recibe:** los datos de pasarelas (`gatewayConnectors`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de pasarelas (`gatewayConnectors`).
- **Pantallas:** PAN-COB-23 (Conectores de pasarelas y canales).
- **Ola:** O5 · **Fuente:** M07 §11.4 Pasarelas, devoluciones, conciliación, cobradores, excepciones, línea 2571 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Pasarelas%2C%20devoluciones%2C%20conciliaci%C3%B3n%2C%20cobradores%2C%20excepciones/API-COB-58-b)

<a id="API-COB-59"></a>
#### API-COB-59 · `GET /api/admin/cob/payment-channels`

- **Qué hace:** Canales visibles. Lista, con filtros y paginación, los registros de canales de pago habilitados (`paymentChannels`).
- **Para qué sirve:** RF-COB-031: Usar un único motor de imputación para todos los canales (caja, cobrador, ente, débito, pasarela, cupón, crédito interno). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.pasarelas.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de canales de pago habilitados (`paymentChannels`) con `total`.
- **Pantallas:** PAN-COB-23 (Conectores de pasarelas y canales).
- **Ola:** O5 · **Fuente:** M07 §11.4 Pasarelas, devoluciones, conciliación, cobradores, excepciones, línea 2572 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Pasarelas%2C%20devoluciones%2C%20conciliaci%C3%B3n%2C%20cobradores%2C%20excepciones/API-COB-59)

<a id="API-COB-59-b"></a>
#### API-COB-59-b · `PUT /api/admin/cob/payment-channels`

- **Qué hace:** Canales visibles. Reemplaza o configura canales de pago habilitados (`paymentChannels`).
- **Para qué sirve:** RF-COB-031: Usar un único motor de imputación para todos los canales (caja, cobrador, ente, débito, pasarela, cupón, crédito interno). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.pasarelas.configurar`.
- **Recibe:** los datos de canales de pago habilitados (`paymentChannels`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de canales de pago habilitados (`paymentChannels`).
- **Pantallas:** PAN-COB-23 (Conectores de pasarelas y canales).
- **Ola:** O5 · **Fuente:** M07 §11.4 Pasarelas, devoluciones, conciliación, cobradores, excepciones, línea 2572 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Pasarelas%2C%20devoluciones%2C%20conciliaci%C3%B3n%2C%20cobradores%2C%20excepciones/API-COB-59-b)

<a id="API-COB-60"></a>
#### API-COB-60 · `GET /api/admin/cob/payment-intents`

- **Qué hace:** Listar intenciones. Lista, con filtros y paginación, los registros de intenciones de pago (`paymentIntents`).
- **Para qué sirve:** RF-COB-170: Publicar a M14 la acreditación esperada por ente o pasarela (neto, fecha, cuenta) para la conciliación bancaria. · RF-COB-176: Informar a M17 el capital social cobrado al cierre de caja cuando corresponda. Corregido (HUECO-CAP-02): es solo una conciliación de cierre (capital cobrado en la sesión contra integraciones registradas por M17) sin efecto sobre… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.intenciones.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de intenciones de pago (`paymentIntents`) con `total`.
- **Pantallas:** PAN-COB-24 (Intenciones de pago).
- **Ola:** O5 · **Fuente:** M07 §11.4 Pasarelas, devoluciones, conciliación, cobradores, excepciones, línea 2573 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Pasarelas%2C%20devoluciones%2C%20conciliaci%C3%B3n%2C%20cobradores%2C%20excepciones/API-COB-60)

<a id="API-COB-61"></a>
#### API-COB-61 · `POST /api/admin/cob/payment-intents`

- **Qué hace:** Crear intención o link (reutiliza dentro de la ventana). Da de alta un registro de intenciones de pago (`paymentIntents`).
- **Para qué sirve:** RF-COB-136: Reutilizar una intención vigente idéntica (mismo importe, pagador, conector, medios y obligaciones) dentro de una ventana configurable. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.intenciones.crear`.
- **Recibe:** los datos de intenciones de pago (`paymentIntents`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de intenciones de pago (`paymentIntents`).
- **Pantallas:** PAN-COB-24 (Intenciones de pago).
- **Ola:** O5 · **Fuente:** M07 §11.4 Pasarelas, devoluciones, conciliación, cobradores, excepciones, línea 2574 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Pasarelas%2C%20devoluciones%2C%20conciliaci%C3%B3n%2C%20cobradores%2C%20excepciones/API-COB-61)

<a id="API-COB-62"></a>
#### API-COB-62 · `POST /api/admin/cob/payment-intents/{id}/refresh`

- **Qué hace:** Reconsultar al proveedor y reprocesar. Actualiza un registro de intenciones de pago (`paymentIntents`).
- **Para qué sirve:** RF-COB-140: Ejecutar conciliación diaria contra el reporte o listado del proveedor con ventana configurable (por defecto 4 días) y alta de pagos sin intención previa. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.intenciones.reprocesar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COB-24 (Intenciones de pago).
- **Ola:** O5 · **Fuente:** M07 §11.4 Pasarelas, devoluciones, conciliación, cobradores, excepciones, línea 2575 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Pasarelas%2C%20devoluciones%2C%20conciliaci%C3%B3n%2C%20cobradores%2C%20excepciones/API-COB-62)

<a id="API-COB-63"></a>
#### API-COB-63 · `POST /api/admin/cob/payment-intents/{id}/cancel`

- **Qué hace:** Cancelar. Cancela un registro de intenciones de pago (`paymentIntents`).
- **Para qué sirve:** RF-COB-151: Vencer y depurar intenciones no pagadas (registradas sin pago) y cancelarlas en el proveedor cuando lo soporte. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.intenciones.cancelar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COB-24 (Intenciones de pago).
- **Ola:** O5 · **Fuente:** M07 §11.4 Pasarelas, devoluciones, conciliación, cobradores, excepciones, línea 2576 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Pasarelas%2C%20devoluciones%2C%20conciliaci%C3%B3n%2C%20cobradores%2C%20excepciones/API-COB-63)

<a id="API-COB-64"></a>
#### API-COB-64 · `POST /api/admin/cob/payment-intents/{id}/share`

- **Qué hace:** Enviar link por WhatsApp/correo/SMS. Comparte un registro de intenciones de pago (`paymentIntents`).
- **Para qué sirve:** RF-COB-145: Crear y enviar links de pago por WhatsApp, email o SMS desde caja, cuenta corriente, CRM o portal, con plantilla. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.links.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COB-25 (Link de pago).
- **Ola:** O5 · **Fuente:** M07 §11.4 Pasarelas, devoluciones, conciliación, cobradores, excepciones, línea 2577 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Pasarelas%2C%20devoluciones%2C%20conciliaci%C3%B3n%2C%20cobradores%2C%20excepciones/API-COB-64)

<a id="API-COB-65"></a>
#### API-COB-65 · `POST /api/admin/cob/payment-intents/bulk`

- **Qué hace:** Generación masiva (QR de facturas, SIRO). Procesa en forma masiva sobre intenciones de pago (`paymentIntents`).
- **Para qué sirve:** RF-COB-176: Informar a M17 el capital social cobrado al cierre de caja cuando corresponda. Corregido (HUECO-CAP-02): es solo una conciliación de cierre (capital cobrado en la sesión contra integraciones registradas por M17) sin efecto sobre… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.intenciones.crear`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COB-24 (Intenciones de pago).
- **Ola:** O5 · **Fuente:** M07 §11.4 Pasarelas, devoluciones, conciliación, cobradores, excepciones, línea 2578 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Pasarelas%2C%20devoluciones%2C%20conciliaci%C3%B3n%2C%20cobradores%2C%20excepciones/API-COB-65)

<a id="API-COB-66"></a>
#### API-COB-66 · `GET /api/admin/cob/refund-cases`

- **Qué hace:** Expedientes. Lista, con filtros y paginación, los registros de devoluciones (`refundCases`).
- **Para qué sirve:** RF-COB-157: Gestionar el expediente de devolución: solicitud, causa, documento correctivo si corresponde (NC por M05), aprobación, cuenta destino, ejecución financiera (proveedor o M14) y conciliación; una orden repetida no devuelve dos… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.devoluciones.solicitar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de devoluciones (`refundCases`) con `total`.
- **Pantallas:** PAN-COB-26 (Devoluciones y contracargos).
- **Ola:** O5 · **Fuente:** M07 §11.4 Pasarelas, devoluciones, conciliación, cobradores, excepciones, línea 2579 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Pasarelas%2C%20devoluciones%2C%20conciliaci%C3%B3n%2C%20cobradores%2C%20excepciones/API-COB-66)

<a id="API-COB-66-b"></a>
#### API-COB-66-b · `POST /api/admin/cob/refund-cases`

- **Qué hace:** Expedientes. Da de alta un registro de devoluciones (`refundCases`).
- **Para qué sirve:** RF-COB-157: Gestionar el expediente de devolución: solicitud, causa, documento correctivo si corresponde (NC por M05), aprobación, cuenta destino, ejecución financiera (proveedor o M14) y conciliación; una orden repetida no devuelve dos… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.devoluciones.solicitar`.
- **Recibe:** los datos de devoluciones (`refundCases`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de devoluciones (`refundCases`).
- **Pantallas:** PAN-COB-26 (Devoluciones y contracargos).
- **Ola:** O5 · **Fuente:** M07 §11.4 Pasarelas, devoluciones, conciliación, cobradores, excepciones, línea 2579 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Pasarelas%2C%20devoluciones%2C%20conciliaci%C3%B3n%2C%20cobradores%2C%20excepciones/API-COB-66-b)

<a id="API-COB-67"></a>
#### API-COB-67 · `POST /api/admin/cob/refund-cases/{id}/decision`

- **Qué hace:** Aprobar/rechazar (segregación). Registra la decisión sobre un registro de devoluciones (`refundCases`).
- **Para qué sirve:** RF-COB-157: Gestionar el expediente de devolución: solicitud, causa, documento correctivo si corresponde (NC por M05), aprobación, cuenta destino, ejecución financiera (proveedor o M14) y conciliación; una orden repetida no devuelve dos… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.devoluciones.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COB-26 (Devoluciones y contracargos).
- **Ola:** O5 · **Fuente:** M07 §11.4 Pasarelas, devoluciones, conciliación, cobradores, excepciones, línea 2580 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Pasarelas%2C%20devoluciones%2C%20conciliaci%C3%B3n%2C%20cobradores%2C%20excepciones/API-COB-67)

<a id="API-COB-68"></a>
#### API-COB-68 · `POST /api/admin/cob/refund-cases/{id}/execute`

- **Qué hace:** Ejecutar. Ejecuta un registro de devoluciones (`refundCases`).
- **Para qué sirve:** RF-COB-140: Ejecutar conciliación diaria contra el reporte o listado del proveedor con ventana configurable (por defecto 4 días) y alta de pagos sin intención previa. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.devoluciones.ejecutar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COB-26 (Devoluciones y contracargos).
- **Ola:** O5 · **Fuente:** M07 §11.4 Pasarelas, devoluciones, conciliación, cobradores, excepciones, línea 2581 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Pasarelas%2C%20devoluciones%2C%20conciliaci%C3%B3n%2C%20cobradores%2C%20excepciones/API-COB-68)

<a id="API-COB-69"></a>
#### API-COB-69 · `GET /api/admin/cob/chargebacks`

- **Qué hace:** Contracargos y disputa. Lista, con filtros y paginación, los registros de contracargos (`chargebacks`).
- **Para qué sirve:** RF-COB-176: Informar a M17 el capital social cobrado al cierre de caja cuando corresponda. Corregido (HUECO-CAP-02): es solo una conciliación de cierre (capital cobrado en la sesión contra integraciones registradas por M17) sin efecto sobre… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.contracargos.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de contracargos (`chargebacks`) con `total`.
- **Pantallas:** PAN-COB-26 (Devoluciones y contracargos).
- **Ola:** O5 · **Fuente:** M07 §11.4 Pasarelas, devoluciones, conciliación, cobradores, excepciones, línea 2582 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Pasarelas%2C%20devoluciones%2C%20conciliaci%C3%B3n%2C%20cobradores%2C%20excepciones/API-COB-69)

<a id="API-COB-69-b"></a>
#### API-COB-69-b · `PATCH /api/admin/cob/chargebacks`

- **Qué hace:** Contracargos y disputa. Modifica algunos campos de un registro de contracargos (`chargebacks`) (solo los enviados).
- **Para qué sirve:** RF-COB-176: Informar a M17 el capital social cobrado al cierre de caja cuando corresponda. Corregido (HUECO-CAP-02): es solo una conciliación de cierre (capital cobrado en la sesión contra integraciones registradas por M17) sin efecto sobre… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.contracargos.gestionar`.
- **Recibe:** solo los campos a cambiar de contracargos (`chargebacks`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de contracargos (`chargebacks`).
- **Pantallas:** PAN-COB-26 (Devoluciones y contracargos).
- **Ola:** O5 · **Fuente:** M07 §11.4 Pasarelas, devoluciones, conciliación, cobradores, excepciones, línea 2582 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Pasarelas%2C%20devoluciones%2C%20conciliaci%C3%B3n%2C%20cobradores%2C%20excepciones/API-COB-69-b)

<a id="API-COB-70"></a>
#### API-COB-70 · `GET /api/admin/cob/reconciliations`

- **Qué hace:** Tablero por día y canal. Lista, con filtros y paginación, los registros de conciliación de cobranza (`collectionReconciliations`).
- **Para qué sirve:** RF-COB-093: Rendir la cobranza del cobrador: entrega de fondos, conciliación lista vs. cobrado vs. entregado y diferencias. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.conciliacion.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de conciliación de cobranza (`collectionReconciliations`) con `total`.
- **Pantallas:** PAN-COB-27 (Conciliación de cobranzas).
- **Ola:** O5 · **Fuente:** M07 §11.4 Pasarelas, devoluciones, conciliación, cobradores, excepciones, línea 2583 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Pasarelas%2C%20devoluciones%2C%20conciliaci%C3%B3n%2C%20cobradores%2C%20excepciones/API-COB-70)

<a id="API-COB-71"></a>
#### API-COB-71 · `POST /api/admin/cob/reconciliations/{id}/match`

- **Qué hace:** Emparejar ítems. Concilia un registro de conciliación de cobranza (`collectionReconciliations`).
- **Para qué sirve:** RF-COB-093: Rendir la cobranza del cobrador: entrega de fondos, conciliación lista vs. cobrado vs. entregado y diferencias. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.conciliacion.conciliar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COB-27 (Conciliación de cobranzas).
- **Ola:** O5 · **Fuente:** M07 §11.4 Pasarelas, devoluciones, conciliación, cobradores, excepciones, línea 2584 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Pasarelas%2C%20devoluciones%2C%20conciliaci%C3%B3n%2C%20cobradores%2C%20excepciones/API-COB-71)

<a id="API-COB-72"></a>
#### API-COB-72 · `POST /api/admin/cob/reconciliations/{id}/close`

- **Qué hace:** Cerrar con acta. Cierra un registro de conciliación de cobranza (`collectionReconciliations`).
- **Para qué sirve:** RF-COB-172: Cerrar la conciliación de un día con acta, responsable y diferencias pendientes trasladadas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.conciliacion.cerrar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COB-27 (Conciliación de cobranzas).
- **Ola:** O5 · **Fuente:** M07 §11.4 Pasarelas, devoluciones, conciliación, cobradores, excepciones, línea 2585 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Pasarelas%2C%20devoluciones%2C%20conciliaci%C3%B3n%2C%20cobradores%2C%20excepciones/API-COB-72)

<a id="API-COB-73"></a>
#### API-COB-73 · `GET /api/admin/cob/collectors`

- **Qué hace:** Cobradores. Lista, con filtros y paginación, los registros de cobradores (`collectors`).
- **Para qué sirve:** RF-COB-170: Publicar a M14 la acreditación esperada por ente o pasarela (neto, fecha, cuenta) para la conciliación bancaria. · RF-COB-176: Informar a M17 el capital social cobrado al cierre de caja cuando corresponda. Corregido (HUECO-CAP-02): es solo una conciliación de cierre (capital cobrado en la sesión contra integraciones registradas por M17) sin efecto sobre… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.cobradores.gestionar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de cobradores (`collectors`) con `total`.
- **Pantallas:** PAN-COB-28 (Cobradores y listas de cobro).
- **Ola:** O10 · **Fuente:** M07 §11.4 Pasarelas, devoluciones, conciliación, cobradores, excepciones, línea 2586 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Pasarelas%2C%20devoluciones%2C%20conciliaci%C3%B3n%2C%20cobradores%2C%20excepciones/API-COB-73)

<a id="API-COB-73-b"></a>
#### API-COB-73-b · `PUT /api/admin/cob/collectors`

- **Qué hace:** Cobradores. Reemplaza o configura cobradores (`collectors`).
- **Para qué sirve:** RF-COB-170: Publicar a M14 la acreditación esperada por ente o pasarela (neto, fecha, cuenta) para la conciliación bancaria. · RF-COB-176: Informar a M17 el capital social cobrado al cierre de caja cuando corresponda. Corregido (HUECO-CAP-02): es solo una conciliación de cierre (capital cobrado en la sesión contra integraciones registradas por M17) sin efecto sobre… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.cobradores.gestionar`.
- **Recibe:** los datos de cobradores (`collectors`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de cobradores (`collectors`).
- **Pantallas:** PAN-COB-28 (Cobradores y listas de cobro).
- **Ola:** O10 · **Fuente:** M07 §11.4 Pasarelas, devoluciones, conciliación, cobradores, excepciones, línea 2586 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Pasarelas%2C%20devoluciones%2C%20conciliaci%C3%B3n%2C%20cobradores%2C%20excepciones/API-COB-73-b)

<a id="API-COB-74"></a>
#### API-COB-74 · `POST /api/admin/cob/collection-rounds`

- **Qué hace:** Generar/asignar listas. Da de alta un registro de rondas de cobro (`collectionRounds`).
- **Para qué sirve:** RF-COB-091: Administrar cobradores (persona, zonas, caja virtual propia, límites, medios permitidos, comisión) y generar listas de cobro desde la deuda por zona, ruta o selección. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.cobradores.gestionar`.
- **Recibe:** los datos de rondas de cobro (`collectionRounds`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de rondas de cobro (`collectionRounds`).
- **Pantallas:** PAN-COB-28 (Cobradores y listas de cobro).
- **Ola:** O10 · **Fuente:** M07 §11.4 Pasarelas, devoluciones, conciliación, cobradores, excepciones, línea 2587 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Pasarelas%2C%20devoluciones%2C%20conciliaci%C3%B3n%2C%20cobradores%2C%20excepciones/API-COB-74)

<a id="API-COB-75"></a>
#### API-COB-75 · `GET /api/admin/cob/exceptions`

- **Qué hace:** Bandeja de excepciones. Lista, con filtros y paginación, los registros de excepciones de cobranza (`collectionExceptions`).
- **Para qué sirve:** RF-COB-093: Rendir la cobranza del cobrador: entrega de fondos, conciliación lista vs. cobrado vs. entregado y diferencias. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.excepciones.resolver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de excepciones de cobranza (`collectionExceptions`) con `total`.
- **Pantallas:** PAN-COB-34 (Bandeja de excepciones de cobranza).
- **Ola:** O5 · **Fuente:** M07 §11.4 Pasarelas, devoluciones, conciliación, cobradores, excepciones, línea 2588 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Pasarelas%2C%20devoluciones%2C%20conciliaci%C3%B3n%2C%20cobradores%2C%20excepciones/API-COB-75)

<a id="API-COB-75-b"></a>
#### API-COB-75-b · `PATCH /api/admin/cob/exceptions`

- **Qué hace:** Bandeja de excepciones. Modifica algunos campos de un registro de excepciones de cobranza (`collectionExceptions`) (solo los enviados).
- **Para qué sirve:** RF-COB-093: Rendir la cobranza del cobrador: entrega de fondos, conciliación lista vs. cobrado vs. entregado y diferencias. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.excepciones.resolver`.
- **Recibe:** solo los campos a cambiar de excepciones de cobranza (`collectionExceptions`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de excepciones de cobranza (`collectionExceptions`).
- **Pantallas:** PAN-COB-34 (Bandeja de excepciones de cobranza).
- **Ola:** O5 · **Fuente:** M07 §11.4 Pasarelas, devoluciones, conciliación, cobradores, excepciones, línea 2588 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Pasarelas%2C%20devoluciones%2C%20conciliaci%C3%B3n%2C%20cobradores%2C%20excepciones/API-COB-75-b)

<a id="API-COB-76"></a>
#### API-COB-76 · `GET /api/admin/cob/reports/{reportCode}`

- **Qué hace:** Reporte; ?format=xlsx/csv/pdf exige cob.reportes.exportar. Obtiene el detalle de un registro de `reports`.
- **Para qué sirve:** RF-COB-189: Proveer los reportes, indicadores y exportaciones de la sección 15 con fórmula, universo y fecha de corte. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `cob.reportes.ver`.
- **Recibe:** en la ruta `reportCode`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COB-36 (Reportes de cobranza).
- **Ola:** O5 · **Fuente:** M07 §11.4 Pasarelas, devoluciones, conciliación, cobradores, excepciones, línea 2589 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/Pasarelas%2C%20devoluciones%2C%20conciliaci%C3%B3n%2C%20cobradores%2C%20excepciones/API-COB-76)

<a id="grupo-5"></a>

## PWA (socio y cobrador), público y externos

15 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-COB-77](#API-COB-77) | GET | `/api/cob/my/accounts` | Cuentas autorizadas y saldos. |
| [API-COB-78](#API-COB-78) | GET | `/api/cob/my/accounts/{id}/obligations` | Obligaciones y recibos. |
| [API-COB-79](#API-COB-79) | POST | `/api/cob/my/payment-intents` | Iniciar pago. |
| [API-COB-80](#API-COB-80) | GET | `/api/cob/my/payment-intents/{id}` | Estado del pago. |
| [API-COB-81](#API-COB-81) | POST | `/api/cob/my/direct-debit-mandates` | Adhesión del socio. Con CBU recibe el CBU y el CUIT del titular. Con tarjeta recibe solo cuenta, servicios y conector, crea la adhesión e... |
| [API-COB-82](#API-COB-82) | POST | `/api/cob/my/transfer-notices` | Informar transferencia con comprobante. |
| [API-COB-83](#API-COB-83) | GET | `/api/cob/collector/rounds` | Listas asignadas (descarga offline). |
| [API-COB-84](#API-COB-84) | POST | `/api/cob/collector/collections/sync` | Sincronizar cola offline (clientMutationId por ítem). |
| [API-COB-85](#API-COB-85) | POST | `/api/cob/collector/settlements` | Rendición del cobrador. |
| [API-COB-86](#API-COB-86) | GET | `/api/public/{tenantSlug}/cob/payment-references/{code}` | Datos mínimos para pagar sin login. |
| [API-COB-87](#API-COB-87) | POST | `/api/public/{tenantSlug}/cob/payment-references/{code}/intents` | Iniciar pago sin login. |
| [API-COB-88](#API-COB-88) | GET | `/api/public/{tenantSlug}/cob/receipts/verify/{validationCode}` | Verificar recibo (QR). |
| [API-COB-89](#API-COB-89) | POST | `/api/v1/ext/cob/webhooks/{connector}/{tenantSlug}` | Webhook de pasarela: registra, deduplica y responde 200. |
| [API-COB-90](#API-COB-90) | POST | `/api/v1/ext/cob/settlements/{agencyCode}` | Ingesta de rendición por API de un ente o agregador. |
| [API-COB-91](#API-COB-91) | GET | `/api/v1/ext/cob/debts` | Consulta de deuda en línea para redes que la soporten (Red Link en línea, Banelco). |

<a id="API-COB-77"></a>
#### API-COB-77 · `GET /api/cob/my/accounts`

- **Qué hace:** Cuentas autorizadas y saldos. Lista, con filtros y paginación, los registros de cuenta corriente de titular o grupo de facturación (`currentAccounts`).
- **Para qué sirve:** RF-COB-005: Consultar movimientos y saldos por titular, cuenta corriente, contrato, servicio y documento, con filtros de vencido/no vencido, servicio, tipo de comprobante y rango de fechas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `cob.miCuenta.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de cuenta corriente de titular o grupo de facturación (`currentAccounts`) con `total`.
- **Pantallas:** PAN-COB-35 (Mi cuenta y pagar (socio)).
- **Ola:** O5 · **Fuente:** M07 §11.5 PWA (socio y cobrador), público y externos, línea 2595 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/PWA%20%28socio%20y%20cobrador%29%2C%20p%C3%BAblico%20y%20externos/API-COB-77)

<a id="API-COB-78"></a>
#### API-COB-78 · `GET /api/cob/my/accounts/{id}/obligations`

- **Qué hace:** Obligaciones y recibos. Lista, con filtros y paginación, los registros de obligaciones exigibles por bloque de servicio (`obligations`).
- **Para qué sirve:** RF-COB-179: Importar obligaciones de otros sistemas para cobrarlas (formatos General, Administración Pública y Comprobante con número), consultarlas y eliminar las no cobradas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `cob.miCuenta.ver`.
- **Recibe:** en la ruta `id`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de obligaciones exigibles por bloque de servicio (`obligations`) con `total`.
- **Pantallas:** PAN-COB-35 (Mi cuenta y pagar (socio)).
- **Ola:** O5 · **Fuente:** M07 §11.5 PWA (socio y cobrador), público y externos, línea 2596 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/PWA%20%28socio%20y%20cobrador%29%2C%20p%C3%BAblico%20y%20externos/API-COB-78)

<a id="API-COB-79"></a>
#### API-COB-79 · `POST /api/cob/my/payment-intents`

- **Qué hace:** Iniciar pago. Da de alta un registro de intenciones de pago (`paymentIntents`).
- **Para qué sirve:** RF-COB-141: Deduplicar por identificador de pago externo: una notificación repetida no crea otro cobro. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `cob.miCuenta.pagar`.
- **Recibe:** los datos de intenciones de pago (`paymentIntents`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de intenciones de pago (`paymentIntents`).
- **Pantallas:** PAN-COB-35 (Mi cuenta y pagar (socio)).
- **Ola:** O5 · **Fuente:** M07 §11.5 PWA (socio y cobrador), público y externos, línea 2597 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/PWA%20%28socio%20y%20cobrador%29%2C%20p%C3%BAblico%20y%20externos/API-COB-79)

<a id="API-COB-80"></a>
#### API-COB-80 · `GET /api/cob/my/payment-intents/{id}`

- **Qué hace:** Estado del pago. Obtiene el detalle de un registro de intenciones de pago (`paymentIntents`).
- **Para qué sirve:** RF-COB-141: Deduplicar por identificador de pago externo: una notificación repetida no crea otro cobro. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `cob.miCuenta.pagar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de intenciones de pago (`paymentIntents`).
- **Pantallas:** PAN-COB-35 (Mi cuenta y pagar (socio)).
- **Ola:** O5 · **Fuente:** M07 §11.5 PWA (socio y cobrador), público y externos, línea 2598 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/PWA%20%28socio%20y%20cobrador%29%2C%20p%C3%BAblico%20y%20externos/API-COB-80)

<a id="API-COB-81"></a>
#### API-COB-81 · `POST /api/cob/my/direct-debit-mandates`

- **Qué hace:** Adhesión del socio. Con CBU recibe el CBU y el CUIT del titular. Con tarjeta recibe solo cuenta, servicios y conector, crea la adhesión e... Da de alta un registro de adhesiones a débito automático (`directDebitMandates`).
- **Para qué sirve:** RF-COB-119: Registrar adhesiones (mandatos) por cuenta o servicio: ente o tarjeta, medio (CBU de 22 dígitos validado o tarjeta tokenizada/enmascarada), titular del medio, CUIT del titular del CBU, período desde, fecha de alta, estado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `cob.miCuenta.adherirDebito`.
- **Recibe:** los datos de adhesiones a débito automático (`directDebitMandates`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de adhesiones a débito automático (`directDebitMandates`).
- **Pantallas:** PAN-COB-35 (Mi cuenta y pagar (socio)).
- **Ola:** O5 · **Fuente:** M07 §11.5 PWA (socio y cobrador), público y externos, línea 2599 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/PWA%20%28socio%20y%20cobrador%29%2C%20p%C3%BAblico%20y%20externos/API-COB-81)

<a id="API-COB-82"></a>
#### API-COB-82 · `POST /api/cob/my/transfer-notices`

- **Qué hace:** Informar transferencia con comprobante. Registra un nuevo elemento u operación en `transfer-notices`.
- **Para qué sirve:** RF-COB-053: Recibir transferencias informadas por el socio o el cajero (con comprobante adjunto) en estado pendiente de verificación hasta que M14 confirme la acreditación o un operador la verifique según el circuito acordado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Socio o usuario del portal y la app (autogestión); permiso `cob.miCuenta.informarTransferencia`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COB-35 (Mi cuenta y pagar (socio)).
- **Ola:** O5 · **Fuente:** M07 §11.5 PWA (socio y cobrador), público y externos, línea 2600 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/PWA%20%28socio%20y%20cobrador%29%2C%20p%C3%BAblico%20y%20externos/API-COB-82)

<a id="API-COB-83"></a>
#### API-COB-83 · `GET /api/cob/collector/rounds`

- **Qué hace:** Listas asignadas (descarga offline). Lista, con filtros y paginación, los registros de cobradores (`collectors`).
- **Para qué sirve:** RF-COB-024: Emitir el estado de cuenta descargable (PDF, XLSX) por el socio y por el operador. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de campo o cobradores, desde la app móvil; permiso `cob.cobranzaCampo.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de cobradores (`collectors`) con `total`.
- **Pantallas:** PAN-COB-29 (PWA del cobrador).
- **Ola:** O10 · **Fuente:** M07 §11.5 PWA (socio y cobrador), público y externos, línea 2601 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/PWA%20%28socio%20y%20cobrador%29%2C%20p%C3%BAblico%20y%20externos/API-COB-83)

<a id="API-COB-84"></a>
#### API-COB-84 · `POST /api/cob/collector/collections/sync`

- **Qué hace:** Sincronizar cola offline (clientMutationId por ítem). Sincroniza sobre cobradores (`collectors`).
- **Para qué sirve:** RF-COB-092: Cobrar en campo desde la PWA con rol cobrador, sin conexión, con recibo provisorio numerado por dispositivo y sincronización posterior con clientMutationId y control de duplicados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de campo o cobradores, desde la app móvil; permiso `cob.cobranzaCampo.cobrar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COB-29 (PWA del cobrador).
- **Ola:** O10 · **Fuente:** M07 §11.5 PWA (socio y cobrador), público y externos, línea 2602 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/PWA%20%28socio%20y%20cobrador%29%2C%20p%C3%BAblico%20y%20externos/API-COB-84)

<a id="API-COB-85"></a>
#### API-COB-85 · `POST /api/cob/collector/settlements`

- **Qué hace:** Rendición del cobrador. Registra un nuevo elemento u operación en cobradores (`collectors`).
- **Para qué sirve:** RF-COB-093: Rendir la cobranza del cobrador: entrega de fondos, conciliación lista vs. cobrado vs. entregado y diferencias. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de campo o cobradores, desde la app móvil; permiso `cob.cobradores.rendir`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-COB-29 (PWA del cobrador).
- **Ola:** O10 · **Fuente:** M07 §11.5 PWA (socio y cobrador), público y externos, línea 2603 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/PWA%20%28socio%20y%20cobrador%29%2C%20p%C3%BAblico%20y%20externos/API-COB-85)

<a id="API-COB-86"></a>
#### API-COB-86 · `GET /api/public/{tenantSlug}/cob/payment-references/{code}`

- **Qué hace:** Datos mínimos para pagar sin login. Obtiene el detalle de un registro de identificadores de pago autocontenidos (`paymentReferences`).
- **Para qué sirve:** RF-COB-152: Permitir pagar online facturas, resumen, cupón único, cuotas y venta prepaga desde portal y app (M19), y pagar sin login con identificador de pago cuando el tenant lo habilite. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`, `code`.
- **Devuelve:** 200: el registro de identificadores de pago autocontenidos (`paymentReferences`).
- **Ola:** O5 · **Fuente:** M07 §11.5 PWA (socio y cobrador), público y externos, línea 2604 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/PWA%20%28socio%20y%20cobrador%29%2C%20p%C3%BAblico%20y%20externos/API-COB-86)

<a id="API-COB-87"></a>
#### API-COB-87 · `POST /api/public/{tenantSlug}/cob/payment-references/{code}/intents`

- **Qué hace:** Iniciar pago sin login. Registra «intents» sobre un registro de identificadores de pago autocontenidos (`paymentReferences`).
- **Para qué sirve:** RF-COB-141: Deduplicar por identificador de pago externo: una notificación repetida no crea otro cobro. · RF-COB-100: Generar un identificador de pago autocontenido y estable por obligación, cupón, cuota, aviso de deuda e intención, con dígito verificador, y entregarlo a M05 para imprimir y a los entes para publicar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`, `code`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O5 · **Fuente:** M07 §11.5 PWA (socio y cobrador), público y externos, línea 2605 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/PWA%20%28socio%20y%20cobrador%29%2C%20p%C3%BAblico%20y%20externos/API-COB-87)

<a id="API-COB-88"></a>
#### API-COB-88 · `GET /api/public/{tenantSlug}/cob/receipts/verify/{validationCode}`

- **Qué hace:** Verificar recibo (QR). Obtiene el detalle de un registro de recibos (`receipts`).
- **Para qué sirve:** RF-COB-077: Notificar el pago al socio por email, WhatsApp o SMS con el recibo (vía T09), según tipo de envío configurado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Cualquier persona, sin iniciar sesión (landing, pagos y verificaciones públicas); acceso según el anexo: «public: true».
- **Recibe:** en la ruta `tenantSlug`, `validationCode`.
- **Devuelve:** 200: el registro de recibos (`receipts`).
- **Ola:** O5 · **Fuente:** M07 §11.5 PWA (socio y cobrador), público y externos, línea 2606 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/PWA%20%28socio%20y%20cobrador%29%2C%20p%C3%BAblico%20y%20externos/API-COB-88)

<a id="API-COB-89"></a>
#### API-COB-89 · `POST /api/v1/ext/cob/webhooks/{connector}/{tenantSlug}`

- **Qué hace:** Webhook de pasarela: registra, deduplica y responde 200. Registra «{tenantSlug}» sobre un registro de `webhooks`.
- **Para qué sirve:** RF-COB-141: Deduplicar por identificador de pago externo: una notificación repetida no crea otro cobro. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); permiso `cob.webhooks.recibir`.
- **Recibe:** en la ruta `connector`, `tenantSlug`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O5 · **Fuente:** M07 §11.5 PWA (socio y cobrador), público y externos, línea 2607 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/PWA%20%28socio%20y%20cobrador%29%2C%20p%C3%BAblico%20y%20externos/API-COB-89)

<a id="API-COB-90"></a>
#### API-COB-90 · `POST /api/v1/ext/cob/settlements/{agencyCode}`

- **Qué hace:** Ingesta de rendición por API de un ente o agregador. Registra un nuevo elemento u operación en rendiciones de entes (`agencySettlements`).
- **Para qué sirve:** RF-COB-123: Importar la rendición de débitos: aceptados se registran como cobro; rechazados con código (R08, R09, R10 y los del ente) vuelven a deuda visible y se notifica al socio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); permiso `cob.rendiciones.ingestar`.
- **Recibe:** en la ruta `agencyCode`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O5 · **Fuente:** M07 §11.5 PWA (socio y cobrador), público y externos, línea 2608 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/PWA%20%28socio%20y%20cobrador%29%2C%20p%C3%BAblico%20y%20externos/API-COB-90)

<a id="API-COB-91"></a>
#### API-COB-91 · `GET /api/v1/ext/cob/debts`

- **Qué hace:** Consulta de deuda en línea para redes que la soporten (Red Link en línea, Banelco). Lista, con filtros y paginación, los registros de deuda publicada por ente (`agencyPublishedDebts`).
- **Para qué sirve:** RF-COB-102: Mantener el registro de deuda publicada por ente con índice único por (período, concepto, identificador) para Red Link y SIRO, sin reinformar un comprobante ya publicado salvo actualización. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); permiso `cob.rendiciones.ingestar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de deuda publicada por ente (`agencyPublishedDebts`) con `total`.
- **Ola:** O5 · **Fuente:** M07 §11.5 PWA (socio y cobrador), público y externos, línea 2609 · [Ver en Swagger](../18-swagger/index.html?api=m07-cob#/PWA%20%28socio%20y%20cobrador%29%2C%20p%C3%BAblico%20y%20externos/API-COB-91)
