# Catálogo de endpoints · M14 · Tesorería y bancos

Parte del [catálogo de endpoints](../18-catalogo-endpoints.md) (artefacto 7.1). Generado el 05-11-2026 con `_trabajo/gen_18_catalogo_endpoints.py` a partir de `18-openapi/`; no se edita a mano.

## Para qué sirve esta API

Administrar el dinero de cada cooperativa (tenant) con trazabilidad completa desde el hecho que lo origina hasta su acreditación o débito bancario y su efecto contable, para que la gerencia pueda ver cuánto dinero tiene disponible, qué está en tránsito, qué compromisos próximos podrían consumirlo y cuál será su posición proyectada (BASE §21, "Resultado esperado"). El módulo cubre: cuentas bancarias propias y demás cuentas financieras; movimientos de tesorería y bancarios; conciliación bancaria asistida con importación de extractos e Interbanking; valores de terceros (cheques físicos y eCheq recibidos); cheques propios, chequeras y eCheq emitidos; cupones de tarjetas y sus liquidaciones; retenciones recibidas (sufridas) y su destino; cajas para pagos a proveedores; ejecución financiera de las órdenes de pago que origina M12; rendiciones de cajas de cobranza hacia tesorería y su depósito; cierre de cajas de tesorería; monedas y cotizaciones; planificación y proyección del flujo de fondos; compromisos de fondos (AGR-028, coordinado con M15); ejecución del pago de haberes (archivo bancario, la liquidación la hace M16); e informes de tesorería. Principios rectores, todos obligatorios:

1. Un cobro esperado no es disponibilidad bancaria (BASE §21). El sistema distingue siempre: disponible, en tránsito, en cartera, a cobrar, proyectado.
2. Cobro confirmado y acreditación bancaria son momentos distintos (BASE §78); los cargos y retenciones se explican sin reducir lo cancelado por el asociado (BASE §13, CU-13).
3. Cada peso se explica (AGR-011, AGR-012): todo movimiento tiene origen, causa, autor y contrapartida; los saldos se derivan de movimientos válidos, nunca de campos editables.
4. Nada se borra: se anula o revierte con vínculo al original (guía §5; AGR-013).
5. Ninguna acción se ejecuta dos veces por un reintento (AGR-016): idempotencia en pagos, archivos, importaciones y conciliaciones.
6. El pago neto al tercero y el ingreso de retenciones al organismo son movimientos distintos (BASE §52).

Detalle completo en el anexo M14, sección 1. Contrato navegable: [Swagger](../18-swagger/index.html?api=m14-tes).

| Dato | Valor |
|---|---|
| Endpoints | 166 |
| Por método | DELETE 1, GET 50, PATCH 19, POST 92, PUT 4 |
| Grupos funcionales | 1 |
| Con requisito citado en el anexo | 0 |
| Con requisito inferido (a confirmar) | 166 |
| Sin requisito identificable | 0 |

## Grupos funcionales

| Grupo | Endpoints | Qué agrupa (primeros endpoints) |
|---|---|---|
| [API](#grupo-1) | 166 | Listar cuentas financieras.; Crear cuenta (genera apertura); Detalle con saldos.… |

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

166 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-TES-01](#API-TES-01) | GET | `/api/admin/tes/accounts` | Listar cuentas financieras. |
| [API-TES-02](#API-TES-02) | POST | `/api/admin/tes/accounts` | Crear cuenta (genera apertura) |
| [API-TES-03](#API-TES-03) | GET | `/api/admin/tes/accounts/{id}` | Detalle con saldos. |
| [API-TES-04](#API-TES-04) | PATCH | `/api/admin/tes/accounts/{id}` | Editar (control optimista version) |
| [API-TES-05](#API-TES-05) | POST | `/api/admin/tes/accounts/{id}/block` | Bloquear / cerrar. |
| [API-TES-05-b](#API-TES-05-b) | POST | `/api/admin/tes/accounts/{id}/close` | Bloquear / cerrar. |
| [API-TES-06](#API-TES-06) | GET | `/api/admin/tes/accounts/{id}/balance` | Saldo a fecha. |
| [API-TES-07](#API-TES-07) | GET | `/api/admin/tes/accounts/{id}/signers` | Firmantes. |
| [API-TES-07-b](#API-TES-07-b) | POST | `/api/admin/tes/accounts/{id}/signers` | Firmantes. |
| [API-TES-07-c](#API-TES-07-c) | PATCH | `/api/admin/tes/accounts/{id}/signers` | Firmantes. |
| [API-TES-08](#API-TES-08) | GET | `/api/admin/tes/institutions` | Entidades y sucursales. |
| [API-TES-08-b](#API-TES-08-b) | POST | `/api/admin/tes/institutions` | Entidades y sucursales. |
| [API-TES-08-c](#API-TES-08-c) | PATCH | `/api/admin/tes/institutions` | Entidades y sucursales. |
| [API-TES-08-d](#API-TES-08-d) | GET | `/api/admin/tes/branches` | Entidades y sucursales. |
| [API-TES-08-e](#API-TES-08-e) | POST | `/api/admin/tes/branches` | Entidades y sucursales. |
| [API-TES-08-f](#API-TES-08-f) | PATCH | `/api/admin/tes/branches` | Entidades y sucursales. |
| [API-TES-09](#API-TES-09) | GET | `/api/admin/tes/categories` | Maestros. |
| [API-TES-09-b](#API-TES-09-b) | POST | `/api/admin/tes/categories` | Maestros. |
| [API-TES-09-c](#API-TES-09-c) | PATCH | `/api/admin/tes/categories` | Maestros. |
| [API-TES-09-d](#API-TES-09-d) | GET | `/api/admin/tes/concepts` | Maestros. |
| [API-TES-09-e](#API-TES-09-e) | POST | `/api/admin/tes/concepts` | Maestros. |
| [API-TES-09-f](#API-TES-09-f) | PATCH | `/api/admin/tes/concepts` | Maestros. |
| [API-TES-09-g](#API-TES-09-g) | GET | `/api/admin/tes/instrument-types` | Maestros. |
| [API-TES-09-h](#API-TES-09-h) | POST | `/api/admin/tes/instrument-types` | Maestros. |
| [API-TES-09-i](#API-TES-09-i) | PATCH | `/api/admin/tes/instrument-types` | Maestros. |
| [API-TES-10](#API-TES-10) | GET | `/api/admin/tes/drawer-accounts` | Libradores. |
| [API-TES-10-b](#API-TES-10-b) | POST | `/api/admin/tes/drawer-accounts` | Libradores. |
| [API-TES-10-c](#API-TES-10-c) | PATCH | `/api/admin/tes/drawer-accounts` | Libradores. |
| [API-TES-11](#API-TES-11) | GET | `/api/admin/tes/movements` | Buscar movimientos. |
| [API-TES-12](#API-TES-12) | POST | `/api/admin/tes/operations` | Registrar operación (asistente) |
| [API-TES-13](#API-TES-13) | GET | `/api/admin/tes/operations/{id}` | Detalle. |
| [API-TES-14](#API-TES-14) | POST | `/api/admin/tes/operations/{id}/void` | Anular con motivo. |
| [API-TES-15](#API-TES-15) | POST | `/api/admin/tes/operations/{id}/approve` | Aprobar/rechazar. |
| [API-TES-15-b](#API-TES-15-b) | POST | `/api/admin/tes/operations/{id}/reject` | Aprobar/rechazar. |
| [API-TES-16](#API-TES-16) | GET | `/api/admin/tes/operations/{id}/pdf` | Comprobante. |
| [API-TES-17](#API-TES-17) | PATCH | `/api/admin/tes/movements/{id}` | Cambiar fecha valor/observación. |
| [API-TES-18](#API-TES-18) | GET | `/api/admin/tes/accounts/{id}/book` | Libro con saldo inicial. |
| [API-TES-19](#API-TES-19) | GET | `/api/admin/tes/statement-profiles` | Perfiles de importación. |
| [API-TES-19-b](#API-TES-19-b) | POST | `/api/admin/tes/statement-profiles` | Perfiles de importación. |
| [API-TES-19-c](#API-TES-19-c) | PATCH | `/api/admin/tes/statement-profiles` | Perfiles de importación. |
| [API-TES-20](#API-TES-20) | POST | `/api/admin/tes/statement-imports/preview` | Subir y previsualizar. |
| [API-TES-21](#API-TES-21) | POST | `/api/admin/tes/statement-imports/{id}/confirm` | Confirmar importación. |
| [API-TES-22](#API-TES-22) | GET | `/api/admin/tes/statement-lines` | Líneas por cuenta/estado. |
| [API-TES-23](#API-TES-23) | POST | `/api/admin/tes/reconciliations` | Abrir conciliación. |
| [API-TES-24](#API-TES-24) | GET | `/api/admin/tes/reconciliations/{id}` | Estado, saldos, partidas. |
| [API-TES-25](#API-TES-25) | POST | `/api/admin/tes/reconciliations/{id}/auto-match` | Ejecutar reglas (job) |
| [API-TES-26](#API-TES-26) | POST | `/api/admin/tes/reconciliations/{id}/matches` | Crear grupo N:M (con movimiento de diferencia opcional) |
| [API-TES-27](#API-TES-27) | POST | `/api/admin/tes/reconciliations/{id}/matches/confirm` | Confirmar sugerencias en bloque. |
| [API-TES-28](#API-TES-28) | DELETE | `/api/admin/tes/reconciliation-matches/{id}` | Desconciliar grupo (motivo en cuerpo; borrado lógico) |
| [API-TES-29](#API-TES-29) | POST | `/api/admin/tes/statement-lines/{id}/create-movement` | Crear movimiento y conciliar. |
| [API-TES-30](#API-TES-30) | POST | `/api/admin/tes/statement-lines/{id}/send-unidentified` | Enviar a no identificados (M07) |
| [API-TES-31](#API-TES-31) | POST | `/api/admin/tes/reconciliations/{id}/close` | Cerrar / reabrir. |
| [API-TES-31-b](#API-TES-31-b) | POST | `/api/admin/tes/reconciliations/{id}/reopen` | Cerrar / reabrir. |
| [API-TES-32](#API-TES-32) | GET | `/api/admin/tes/reconciliations/{id}/report` | Reporte PDF/XLSX. |
| [API-TES-33](#API-TES-33) | GET | `/api/admin/tes/reconciliation-rules` | Reglas y prueba. |
| [API-TES-33-b](#API-TES-33-b) | POST | `/api/admin/tes/reconciliation-rules` | Reglas y prueba. |
| [API-TES-33-c](#API-TES-33-c) | PATCH | `/api/admin/tes/reconciliation-rules` | Reglas y prueba. |
| [API-TES-33-d](#API-TES-33-d) | POST | `/api/admin/tes/reconciliation-rules/{id}/test` | Reglas y prueba. |
| [API-TES-34](#API-TES-34) | GET | `/api/admin/tes/interbanking/connection` | Configurar conexión (secreto solo de escritura → bóveda) |
| [API-TES-34-b](#API-TES-34-b) | PUT | `/api/admin/tes/interbanking/connection` | Configurar conexión (secreto solo de escritura → bóveda) |
| [API-TES-35](#API-TES-35) | POST | `/api/admin/tes/interbanking/test` | Probar conexión. |
| [API-TES-36](#API-TES-36) | GET | `/api/admin/tes/interbanking/accounts` | Cuentas IB. |
| [API-TES-37](#API-TES-37) | POST | `/api/admin/tes/interbanking/sync` | Sincronizar ahora (job) |
| [API-TES-38](#API-TES-38) | GET | `/api/admin/tes/interbanking/balances` | Saldos banco vs libro. |
| [API-TES-39](#API-TES-39) | GET | `/api/admin/tes/interbanking/code-mappings` | Mapeo de códigos. |
| [API-TES-39-b](#API-TES-39-b) | PUT | `/api/admin/tes/interbanking/code-mappings` | Mapeo de códigos. |
| [API-TES-40](#API-TES-40) | POST | `/api/admin/tes/payment-files` | Generar archivo desde selección. |
| [API-TES-41](#API-TES-41) | GET | `/api/admin/tes/payment-files/{id}/download` | Descargar (URL firmada) |
| [API-TES-42](#API-TES-42) | POST | `/api/admin/tes/payment-files/{id}/sent` | Registrar envío / importar respuesta / anular. |
| [API-TES-42-b](#API-TES-42-b) | POST | `/api/admin/tes/payment-files/{id}/response` | Registrar envío / importar respuesta / anular. |
| [API-TES-42-c](#API-TES-42-c) | POST | `/api/admin/tes/payment-files/{id}/void` | Registrar envío / importar respuesta / anular. |
| [API-TES-43](#API-TES-43) | GET | `/api/admin/tes/third-party-checks` | Cartera. |
| [API-TES-44](#API-TES-44) | POST | `/api/admin/tes/third-party-checks` | Alta de valor. |
| [API-TES-45](#API-TES-45) | PATCH | `/api/admin/tes/third-party-checks/{id}` | Modificar (en cartera) |
| [API-TES-46](#API-TES-46) | POST | `/api/admin/tes/third-party-checks/{id}/enable-payment` | Transiciones. |
| [API-TES-46-b](#API-TES-46-b) | POST | `/api/admin/tes/third-party-checks/{id}/disable-payment` | Transiciones. |
| [API-TES-46-c](#API-TES-46-c) | POST | `/api/admin/tes/third-party-checks/{id}/reject` | Transiciones. |
| [API-TES-46-d](#API-TES-46-d) | POST | `/api/admin/tes/third-party-checks/{id}/recover` | Transiciones. |
| [API-TES-46-e](#API-TES-46-e) | POST | `/api/admin/tes/third-party-checks/{id}/return` | Transiciones. |
| [API-TES-46-f](#API-TES-46-f) | POST | `/api/admin/tes/third-party-checks/{id}/manual-out` | Transiciones. |
| [API-TES-46-g](#API-TES-46-g) | POST | `/api/admin/tes/third-party-checks/{id}/void` | Transiciones. |
| [API-TES-46-h](#API-TES-46-h) | POST | `/api/admin/tes/third-party-checks/{id}/accept` | Transiciones. |
| [API-TES-46-i](#API-TES-46-i) | POST | `/api/admin/tes/third-party-checks/{id}/repudiate` | Transiciones. |
| [API-TES-46-j](#API-TES-46-j) | POST | `/api/admin/tes/third-party-checks/{id}/custody` | Transiciones. |
| [API-TES-46-k](#API-TES-46-k) | POST | `/api/admin/tes/third-party-checks/{id}/negotiate` | Transiciones. |
| [API-TES-47](#API-TES-47) | GET | `/api/admin/tes/third-party-checks/{id}/events` | Historial. |
| [API-TES-48](#API-TES-48) | POST | `/api/admin/tes/deposits` | Depósito / anular. |
| [API-TES-48-b](#API-TES-48-b) | POST | `/api/admin/tes/deposits/{id}/void` | Depósito / anular. |
| [API-TES-49](#API-TES-49) | GET | `/api/admin/tes/checkbooks` | Chequeras. |
| [API-TES-49-b](#API-TES-49-b) | POST | `/api/admin/tes/checkbooks` | Chequeras. |
| [API-TES-50](#API-TES-50) | POST | `/api/admin/tes/own-checks/{id}/void` | Transiciones de cheque propio. |
| [API-TES-50-b](#API-TES-50-b) | POST | `/api/admin/tes/own-checks/{id}/unmark` | Transiciones de cheque propio. |
| [API-TES-50-c](#API-TES-50-c) | POST | `/api/admin/tes/own-checks/{id}/replace` | Transiciones de cheque propio. |
| [API-TES-50-d](#API-TES-50-d) | POST | `/api/admin/tes/own-checks/{id}/recover` | Transiciones de cheque propio. |
| [API-TES-50-e](#API-TES-50-e) | POST | `/api/admin/tes/own-checks/{id}/reject` | Transiciones de cheque propio. |
| [API-TES-51](#API-TES-51) | POST | `/api/admin/tes/own-checks/print` | Imprimir rango (PDF) y marcar. |
| [API-TES-52](#API-TES-52) | POST | `/api/admin/tes/echeqs/import-status` | Importar estados eCheq. |
| [API-TES-53](#API-TES-53) | GET | `/api/admin/tes/card-plans` | Tarjetas y recargos. |
| [API-TES-53-b](#API-TES-53-b) | POST | `/api/admin/tes/card-plans` | Tarjetas y recargos. |
| [API-TES-53-c](#API-TES-53-c) | PATCH | `/api/admin/tes/card-plans` | Tarjetas y recargos. |
| [API-TES-54](#API-TES-54) | GET | `/api/admin/tes/card-vouchers` | Cupones. |
| [API-TES-55](#API-TES-55) | PATCH | `/api/admin/tes/card-vouchers/{id}` | Corregir datos. |
| [API-TES-56](#API-TES-56) | POST | `/api/admin/tes/card-presentations` | Presentar / anular. |
| [API-TES-56-b](#API-TES-56-b) | POST | `/api/admin/tes/card-presentations/{id}/void` | Presentar / anular. |
| [API-TES-57](#API-TES-57) | POST | `/api/admin/tes/card-settlements` | Liquidar / anular. |
| [API-TES-57-b](#API-TES-57-b) | POST | `/api/admin/tes/card-settlements/{id}/void` | Liquidar / anular. |
| [API-TES-58](#API-TES-58) | POST | `/api/admin/tes/card-vouchers/{id}/reject` | Rechazo de cupón. |
| [API-TES-59](#API-TES-59) | GET | `/api/admin/tes/received-withholdings` | Retenciones recibidas. |
| [API-TES-59-b](#API-TES-59-b) | POST | `/api/admin/tes/received-withholdings` | Retenciones recibidas. |
| [API-TES-59-c](#API-TES-59-c) | PATCH | `/api/admin/tes/received-withholdings` | Retenciones recibidas. |
| [API-TES-60](#API-TES-60) | POST | `/api/admin/tes/withholding-presentations` | Presentar / salida / anular. |
| [API-TES-60-b](#API-TES-60-b) | POST | `/api/admin/tes/withholding-presentations/{id}/void` | Presentar / salida / anular. |
| [API-TES-61](#API-TES-61) | GET | `/api/admin/tes/payment-cash-sessions` | Caja de pagos. |
| [API-TES-61-b](#API-TES-61-b) | POST | `/api/admin/tes/payment-cash-sessions` | Caja de pagos. |
| [API-TES-61-c](#API-TES-61-c) | POST | `/api/admin/tes/payment-cash-sessions/{id}/close` | Caja de pagos. |
| [API-TES-61-d](#API-TES-61-d) | POST | `/api/admin/tes/payment-cash-sessions/{id}/reopen` | Caja de pagos. |
| [API-TES-62](#API-TES-62) | GET | `/api/admin/tes/payment-executions` | Bandeja. |
| [API-TES-63](#API-TES-63) | PUT | `/api/admin/tes/payment-executions/{id}/instruments` | Instrumentar medios. |
| [API-TES-64](#API-TES-64) | POST | `/api/admin/tes/payment-executions/sign` | Firmar (lista de ids; 2FA reciente) |
| [API-TES-65](#API-TES-65) | POST | `/api/admin/tes/payment-executions/{id}/deliver` | Entregar. |
| [API-TES-66](#API-TES-66) | POST | `/api/admin/tes/payment-executions/{id}/void` | Anular. |
| [API-TES-67](#API-TES-67) | PATCH | `/api/admin/tes/payment-executions/{id}/schedule` | Programar fecha. |
| [API-TES-68](#API-TES-68) | GET | `/api/admin/tes/cash-remittances` | Rendiciones. |
| [API-TES-69](#API-TES-69) | POST | `/api/admin/tes/cash-remittances/{id}/start-review` | Transiciones de rendición. |
| [API-TES-69-b](#API-TES-69-b) | POST | `/api/admin/tes/cash-remittances/{id}/accept` | Transiciones de rendición. |
| [API-TES-69-c](#API-TES-69-c) | POST | `/api/admin/tes/cash-remittances/{id}/accept-with-difference` | Transiciones de rendición. |
| [API-TES-69-d](#API-TES-69-d) | POST | `/api/admin/tes/cash-remittances/{id}/observe` | Transiciones de rendición. |
| [API-TES-69-e](#API-TES-69-e) | POST | `/api/admin/tes/cash-remittances/{id}/void` | Transiciones de rendición. |
| [API-TES-70](#API-TES-70) | POST | `/api/admin/tes/treasury-cash-closings` | Cierre / reapertura de caja de tesorería. |
| [API-TES-70-b](#API-TES-70-b) | POST | `/api/admin/tes/treasury-cash-closings/{id}/reopen` | Cierre / reapertura de caja de tesorería. |
| [API-TES-71](#API-TES-71) | GET | `/api/admin/tes/currencies` | Monedas del tenant. |
| [API-TES-71-b](#API-TES-71-b) | PATCH | `/api/admin/tes/currencies` | Monedas del tenant. |
| [API-TES-72](#API-TES-72) | GET | `/api/admin/tes/exchange-rates` | Cotizaciones. |
| [API-TES-72-b](#API-TES-72-b) | POST | `/api/admin/tes/exchange-rates` | Cotizaciones. |
| [API-TES-72-c](#API-TES-72-c) | POST | `/api/admin/tes/exchange-rates/refresh` | Cotizaciones. |
| [API-TES-73](#API-TES-73) | GET | `/api/admin/tes/position` | Posición diaria. |
| [API-TES-74](#API-TES-74) | GET | `/api/admin/tes/cash-flow` | Proyección. |
| [API-TES-75](#API-TES-75) | POST | `/api/admin/tes/cash-flow/snapshots` | Guardar snapshot. |
| [API-TES-76](#API-TES-76) | GET | `/api/admin/tes/scenarios` | Escenarios. |
| [API-TES-76-b](#API-TES-76-b) | POST | `/api/admin/tes/scenarios` | Escenarios. |
| [API-TES-76-c](#API-TES-76-c) | PATCH | `/api/admin/tes/scenarios` | Escenarios. |
| [API-TES-77](#API-TES-77) | GET | `/api/admin/tes/planned-items` | Previsiones. |
| [API-TES-77-b](#API-TES-77-b) | POST | `/api/admin/tes/planned-items` | Previsiones. |
| [API-TES-77-c](#API-TES-77-c) | PATCH | `/api/admin/tes/planned-items` | Previsiones. |
| [API-TES-78](#API-TES-78) | GET | `/api/admin/tes/commitments` | Compromisos. |
| [API-TES-78-b](#API-TES-78-b) | POST | `/api/admin/tes/commitments` | Compromisos. |
| [API-TES-78-c](#API-TES-78-c) | POST | `/api/admin/tes/commitments/{id}/release` | Compromisos. |
| [API-TES-79](#API-TES-79) | GET | `/api/admin/tes/payroll-batches` | Lotes de haberes (detalle con tes.haberes.verDetalle) |
| [API-TES-79-b](#API-TES-79-b) | GET | `/api/admin/tes/payroll-batches/{id}` | Lotes de haberes (detalle con tes.haberes.verDetalle) |
| [API-TES-80](#API-TES-80) | POST | `/api/admin/tes/payroll-batches/{id}/generate-files` | Acciones del lote. |
| [API-TES-80-b](#API-TES-80-b) | POST | `/api/admin/tes/payroll-batches/{id}/sent` | Acciones del lote. |
| [API-TES-80-c](#API-TES-80-c) | POST | `/api/admin/tes/payroll-batches/{id}/response` | Acciones del lote. |
| [API-TES-80-d](#API-TES-80-d) | POST | `/api/admin/tes/payroll-batches/{id}/reprocess` | Acciones del lote. |
| [API-TES-80-e](#API-TES-80-e) | POST | `/api/admin/tes/payroll-batches/{id}/void` | Acciones del lote. |
| [API-TES-81](#API-TES-81) | GET | `/api/admin/tes/reports/{reportKey}` | Ejecutar informe (formato por Accept) |
| [API-TES-82](#API-TES-82) | GET | `/api/admin/tes/settings` | Parámetros (versionados T04) |
| [API-TES-82-b](#API-TES-82-b) | PUT | `/api/admin/tes/settings` | Parámetros (versionados T04) |
| [API-TES-83](#API-TES-83) | POST | `/api/admin/tes/periods/{module}/close` | Cierre de períodos. |
| [API-TES-83-b](#API-TES-83-b) | POST | `/api/admin/tes/periods/{module}/reopen` | Cierre de períodos. |
| [API-TES-84](#API-TES-84) | GET | `/api/admin/tes/exceptions` | Bandeja de excepciones. |
| [API-TES-85](#API-TES-85) | GET | `/api/tes/signatures/pending` | PWA empleado: pendientes y firma. |
| [API-TES-85-b](#API-TES-85-b) | POST | `/api/tes/signatures` | PWA empleado: pendientes y firma. |
| [API-TES-86](#API-TES-86) | GET | `/api/tes/position` | PWA empleado: posición. |
| [API-TES-87](#API-TES-87) | GET | `/api/v1/ext/tes/position` | APIs para terceros/BI (T10) sin datos de haberes individuales. |
| [API-TES-87-b](#API-TES-87-b) | GET | `/api/v1/ext/tes/cash-flow` | APIs para terceros/BI (T10) sin datos de haberes individuales. |
| [API-TES-87-c](#API-TES-87-c) | GET | `/api/v1/ext/tes/movements` | APIs para terceros/BI (T10) sin datos de haberes individuales. |

<a id="API-TES-01"></a>
#### API-TES-01 · `GET /api/admin/tes/accounts`

- **Qué hace:** Listar cuentas financieras. Lista, con filtros y paginación, los registros de cuentas financieras (`treasuryAccounts`).
- **Para qué sirve:** RF-TES-052: Listar las cuentas disponibles en Interbanking y vincularlas a cuentas propias. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.cuentas.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de cuentas financieras (`treasuryAccounts`) con `total`.
- **Pantallas:** PAN-TES-02 (Listado de cuentas financieras).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1824 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-01)

<a id="API-TES-02"></a>
#### API-TES-02 · `POST /api/admin/tes/accounts`

- **Qué hace:** Crear cuenta (genera apertura) Da de alta un registro de cuentas financieras (`treasuryAccounts`).
- **Para qué sirve:** RF-TES-179: Gastos financieros por clase, cuenta y período. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.cuentas.crear`.
- **Recibe:** los datos de cuentas financieras (`treasuryAccounts`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de cuentas financieras (`treasuryAccounts`).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1825 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-02)

<a id="API-TES-03"></a>
#### API-TES-03 · `GET /api/admin/tes/accounts/{id}`

- **Qué hace:** Detalle con saldos. Obtiene el detalle de un registro de cuentas financieras (`treasuryAccounts`).
- **Para qué sirve:** RF-TES-053: Consultar saldos de Interbanking y compararlos con el saldo del libro por cuenta, mostrando la diferencia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.cuentas.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de cuentas financieras (`treasuryAccounts`).
- **Pantallas:** PAN-TES-02 (Listado de cuentas financieras).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1826 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-03)

<a id="API-TES-04"></a>
#### API-TES-04 · `PATCH /api/admin/tes/accounts/{id}`

- **Qué hace:** Editar (control optimista version) Modifica algunos campos de un registro de cuentas financieras (`treasuryAccounts`) (solo los enviados).
- **Para qué sirve:** RF-TES-105: Editar número y tipo de una retención no presentada y el concepto del movimiento, con auditoría. · RF-TES-150: Controlar vencimientos de instrumentos: valores en cartera, cheques propios diferidos, eCheq pendientes de aceptación, plazos fijos u otras colocaciones registradas como cuentas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.cuentas.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de cuentas financieras (`treasuryAccounts`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de cuentas financieras (`treasuryAccounts`).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1827 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-04)

<a id="API-TES-05"></a>
#### API-TES-05 · `POST /api/admin/tes/accounts/{id}/block`

- **Qué hace:** Bloquear / cerrar. Bloquea un registro de cuentas financieras (`treasuryAccounts`).
- **Para qué sirve:** RF-TES-012: Cerrar una cuenta financiera solo con saldo cero y sin partidas pendientes de conciliación ni cheques propios emitidos sin debitar; permitir bloquearla temporalmente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.cuentas.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-04 (Entidades financieras y sucursales).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1828 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-05)

<a id="API-TES-05-b"></a>
#### API-TES-05-b · `POST /api/admin/tes/accounts/{id}/close`

- **Qué hace:** Bloquear / cerrar. Cierra un registro de cuentas financieras (`treasuryAccounts`).
- **Para qué sirve:** RF-TES-012: Cerrar una cuenta financiera solo con saldo cero y sin partidas pendientes de conciliación ni cheques propios emitidos sin debitar; permitir bloquearla temporalmente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.cuentas.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-04 (Entidades financieras y sucursales).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1828 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-05-b)

<a id="API-TES-06"></a>
#### API-TES-06 · `GET /api/admin/tes/accounts/{id}/balance`

- **Qué hace:** Saldo a fecha. Consulta «balance» de un registro de cuentas financieras (`treasuryAccounts`).
- **Para qué sirve:** RF-TES-012: Cerrar una cuenta financiera solo con saldo cero y sin partidas pendientes de conciliación ni cheques propios emitidos sin debitar; permitir bloquearla temporalmente. · RF-TES-179: Gastos financieros por clase, cuenta y período. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.cuentas.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de cuentas financieras (`treasuryAccounts`).
- **Pantallas:** PAN-TES-02 (Listado de cuentas financieras).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1829 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-06)

<a id="API-TES-07"></a>
#### API-TES-07 · `GET /api/admin/tes/accounts/{id}/signers`

- **Qué hace:** Firmantes. Lista, con filtros y paginación, los registros de firmantes autorizados de cuentas y órdenes de pago (`treasuryAccountSigners`).
- **Para qué sirve:** RF-TES-008: Registrar firmantes autorizados por cuenta bancaria con vigencia desde/hasta, tope por firma y regla de firmas conjuntas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.cuentas.configurar`.
- **Recibe:** en la ruta `id`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de firmantes autorizados de cuentas y órdenes de pago (`treasuryAccountSigners`) con `total`.
- **Pantallas:** PAN-TES-04 (Entidades financieras y sucursales).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1830 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-07)

<a id="API-TES-07-b"></a>
#### API-TES-07-b · `POST /api/admin/tes/accounts/{id}/signers`

- **Qué hace:** Firmantes. Da de alta un registro de firmantes autorizados de cuentas y órdenes de pago (`treasuryAccountSigners`).
- **Para qué sirve:** RF-TES-008: Registrar firmantes autorizados por cuenta bancaria con vigencia desde/hasta, tope por firma y regla de firmas conjuntas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.cuentas.configurar`.
- **Recibe:** en la ruta `id`; los datos de firmantes autorizados de cuentas y órdenes de pago (`treasuryAccountSigners`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de firmantes autorizados de cuentas y órdenes de pago (`treasuryAccountSigners`).
- **Pantallas:** PAN-TES-04 (Entidades financieras y sucursales).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1830 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-07-b)

<a id="API-TES-07-c"></a>
#### API-TES-07-c · `PATCH /api/admin/tes/accounts/{id}/signers`

- **Qué hace:** Firmantes. Modifica algunos campos de un registro de firmantes autorizados de cuentas y órdenes de pago (`treasuryAccountSigners`) (solo los enviados).
- **Para qué sirve:** RF-TES-008: Registrar firmantes autorizados por cuenta bancaria con vigencia desde/hasta, tope por firma y regla de firmas conjuntas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.cuentas.configurar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de firmantes autorizados de cuentas y órdenes de pago (`treasuryAccountSigners`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de firmantes autorizados de cuentas y órdenes de pago (`treasuryAccountSigners`).
- **Pantallas:** PAN-TES-04 (Entidades financieras y sucursales).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1830 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-07-c)

<a id="API-TES-08"></a>
#### API-TES-08 · `GET /api/admin/tes/institutions`

- **Qué hace:** Entidades y sucursales. Lista, con filtros y paginación, los registros de entidades financieras (`financialInstitutions`).
- **Para qué sirve:** RF-TES-003: Mantener el catálogo de entidades financieras (código BCRA, nombre) y sus sucursales (código, localidad, provincia, dirección), compartido a nivel plataforma, con posibilidad de altas propias del tenant. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.cuentas.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de entidades financieras (`financialInstitutions`) con `total`.
- **Pantallas:** PAN-TES-04 (Entidades financieras y sucursales).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1831 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-08)

<a id="API-TES-08-b"></a>
#### API-TES-08-b · `POST /api/admin/tes/institutions`

- **Qué hace:** Entidades y sucursales. Da de alta un registro de entidades financieras (`financialInstitutions`).
- **Para qué sirve:** RF-TES-003: Mantener el catálogo de entidades financieras (código BCRA, nombre) y sus sucursales (código, localidad, provincia, dirección), compartido a nivel plataforma, con posibilidad de altas propias del tenant. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.cuentas.configurar`.
- **Recibe:** los datos de entidades financieras (`financialInstitutions`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de entidades financieras (`financialInstitutions`).
- **Pantallas:** PAN-TES-04 (Entidades financieras y sucursales).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1831 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-08-b)

<a id="API-TES-08-c"></a>
#### API-TES-08-c · `PATCH /api/admin/tes/institutions`

- **Qué hace:** Entidades y sucursales. Modifica algunos campos de un registro de entidades financieras (`financialInstitutions`) (solo los enviados).
- **Para qué sirve:** RF-TES-003: Mantener el catálogo de entidades financieras (código BCRA, nombre) y sus sucursales (código, localidad, provincia, dirección), compartido a nivel plataforma, con posibilidad de altas propias del tenant. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.cuentas.configurar`.
- **Recibe:** solo los campos a cambiar de entidades financieras (`financialInstitutions`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de entidades financieras (`financialInstitutions`).
- **Pantallas:** PAN-TES-04 (Entidades financieras y sucursales).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1831 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-08-c)

<a id="API-TES-08-d"></a>
#### API-TES-08-d · `GET /api/admin/tes/branches`

- **Qué hace:** Entidades y sucursales. Lista, con filtros y paginación, los registros de sucursales bancarias (`bankBranches`).
- **Para qué sirve:** RF-TES-072: Modificar datos de un valor (entidad, sucursal, cuenta, observación, fecha) solo mientras está En cartera, con auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.cuentas.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de sucursales bancarias (`bankBranches`) con `total`.
- **Pantallas:** PAN-TES-04 (Entidades financieras y sucursales).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1831 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-08-d)

<a id="API-TES-08-e"></a>
#### API-TES-08-e · `POST /api/admin/tes/branches`

- **Qué hace:** Entidades y sucursales. Da de alta un registro de sucursales bancarias (`bankBranches`).
- **Para qué sirve:** RF-TES-072: Modificar datos de un valor (entidad, sucursal, cuenta, observación, fecha) solo mientras está En cartera, con auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.cuentas.configurar`.
- **Recibe:** los datos de sucursales bancarias (`bankBranches`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de sucursales bancarias (`bankBranches`).
- **Pantallas:** PAN-TES-04 (Entidades financieras y sucursales).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1831 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-08-e)

<a id="API-TES-08-f"></a>
#### API-TES-08-f · `PATCH /api/admin/tes/branches`

- **Qué hace:** Entidades y sucursales. Modifica algunos campos de un registro de sucursales bancarias (`bankBranches`) (solo los enviados).
- **Para qué sirve:** RF-TES-072: Modificar datos de un valor (entidad, sucursal, cuenta, observación, fecha) solo mientras está En cartera, con auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.cuentas.configurar`.
- **Recibe:** solo los campos a cambiar de sucursales bancarias (`bankBranches`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de sucursales bancarias (`bankBranches`).
- **Pantallas:** PAN-TES-04 (Entidades financieras y sucursales).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1831 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-08-f)

<a id="API-TES-09"></a>
#### API-TES-09 · `GET /api/admin/tes/categories`

- **Qué hace:** Maestros. Lista, con filtros y paginación, los registros de categorías de movimiento (`treasuryCategories`).
- **Para qué sirve:** RF-TES-004: Administrar categorías de movimiento (descripción, abreviatura, regla contable de M15, tipos de movimiento permitidos) y su relación con tipos de movimiento. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.categorias.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de categorías de movimiento (`treasuryCategories`) con `total`.
- **Pantallas:** PAN-TES-05 (Categorías y conceptos).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1832 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-09)

<a id="API-TES-09-b"></a>
#### API-TES-09-b · `POST /api/admin/tes/categories`

- **Qué hace:** Maestros. Da de alta un registro de categorías de movimiento (`treasuryCategories`).
- **Para qué sirve:** RF-TES-004: Administrar categorías de movimiento (descripción, abreviatura, regla contable de M15, tipos de movimiento permitidos) y su relación con tipos de movimiento. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.categorias.configurar`.
- **Recibe:** los datos de categorías de movimiento (`treasuryCategories`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de categorías de movimiento (`treasuryCategories`).
- **Pantallas:** PAN-TES-05 (Categorías y conceptos).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1832 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-09-b)

<a id="API-TES-09-c"></a>
#### API-TES-09-c · `PATCH /api/admin/tes/categories`

- **Qué hace:** Maestros. Modifica algunos campos de un registro de categorías de movimiento (`treasuryCategories`) (solo los enviados).
- **Para qué sirve:** RF-TES-004: Administrar categorías de movimiento (descripción, abreviatura, regla contable de M15, tipos de movimiento permitidos) y su relación con tipos de movimiento. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.categorias.configurar`.
- **Recibe:** solo los campos a cambiar de categorías de movimiento (`treasuryCategories`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de categorías de movimiento (`treasuryCategories`).
- **Pantallas:** PAN-TES-05 (Categorías y conceptos).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1832 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-09-c)

<a id="API-TES-09-d"></a>
#### API-TES-09-d · `GET /api/admin/tes/concepts`

- **Qué hace:** Maestros. Lista, con filtros y paginación, los registros de conceptos de tesorería (`treasuryConcepts`).
- **Para qué sirve:** RF-TES-055: Traducir el código de operación de Interbanking a categoría/concepto de GoodApps mediante una tabla de mapeo editable. · RF-TES-032: Consultar movimientos con filtros por cuenta, fecha (emisión, valor, registro, conciliación), tipo, categoría, concepto, estado de conciliación, origen, importe y usuario. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.categorias.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de conceptos de tesorería (`treasuryConcepts`) con `total`.
- **Pantallas:** PAN-TES-05 (Categorías y conceptos).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1832 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-09-d)

<a id="API-TES-09-e"></a>
#### API-TES-09-e · `POST /api/admin/tes/concepts`

- **Qué hace:** Maestros. Da de alta un registro de conceptos de tesorería (`treasuryConcepts`).
- **Para qué sirve:** RF-TES-055: Traducir el código de operación de Interbanking a categoría/concepto de GoodApps mediante una tabla de mapeo editable. · RF-TES-032: Consultar movimientos con filtros por cuenta, fecha (emisión, valor, registro, conciliación), tipo, categoría, concepto, estado de conciliación, origen, importe y usuario. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.categorias.configurar`.
- **Recibe:** los datos de conceptos de tesorería (`treasuryConcepts`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de conceptos de tesorería (`treasuryConcepts`).
- **Pantallas:** PAN-TES-05 (Categorías y conceptos).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1832 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-09-e)

<a id="API-TES-09-f"></a>
#### API-TES-09-f · `PATCH /api/admin/tes/concepts`

- **Qué hace:** Maestros. Modifica algunos campos de un registro de conceptos de tesorería (`treasuryConcepts`) (solo los enviados).
- **Para qué sirve:** RF-TES-055: Traducir el código de operación de Interbanking a categoría/concepto de GoodApps mediante una tabla de mapeo editable. · RF-TES-032: Consultar movimientos con filtros por cuenta, fecha (emisión, valor, registro, conciliación), tipo, categoría, concepto, estado de conciliación, origen, importe y usuario. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.categorias.configurar`.
- **Recibe:** solo los campos a cambiar de conceptos de tesorería (`treasuryConcepts`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de conceptos de tesorería (`treasuryConcepts`).
- **Pantallas:** PAN-TES-05 (Categorías y conceptos).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1832 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-09-f)

<a id="API-TES-09-g"></a>
#### API-TES-09-g · `GET /api/admin/tes/instrument-types`

- **Qué hace:** Maestros. Lista, con filtros y paginación, los registros de tipos de valor (`instrumentTypes`).
- **Para qué sirve:** RF-TES-115: Aplicar las categorías configuradas por medio (transferencias, depósito de valores en OP, pago con valores de terceros, pago en efectivo). · RF-TES-004: Administrar categorías de movimiento (descripción, abreviatura, regla contable de M15, tipos de movimiento permitidos) y su relación con tipos de movimiento. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.categorias.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de tipos de valor (`instrumentTypes`) con `total`.
- **Pantallas:** PAN-TES-05 (Categorías y conceptos).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1832 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-09-g)

<a id="API-TES-09-h"></a>
#### API-TES-09-h · `POST /api/admin/tes/instrument-types`

- **Qué hace:** Maestros. Da de alta un registro de tipos de valor (`instrumentTypes`).
- **Para qué sirve:** RF-TES-115: Aplicar las categorías configuradas por medio (transferencias, depósito de valores en OP, pago con valores de terceros, pago en efectivo). · RF-TES-004: Administrar categorías de movimiento (descripción, abreviatura, regla contable de M15, tipos de movimiento permitidos) y su relación con tipos de movimiento. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.categorias.configurar`.
- **Recibe:** los datos de tipos de valor (`instrumentTypes`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de tipos de valor (`instrumentTypes`).
- **Pantallas:** PAN-TES-05 (Categorías y conceptos).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1832 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-09-h)

<a id="API-TES-09-i"></a>
#### API-TES-09-i · `PATCH /api/admin/tes/instrument-types`

- **Qué hace:** Maestros. Modifica algunos campos de un registro de tipos de valor (`instrumentTypes`) (solo los enviados).
- **Para qué sirve:** RF-TES-115: Aplicar las categorías configuradas por medio (transferencias, depósito de valores en OP, pago con valores de terceros, pago en efectivo). · RF-TES-004: Administrar categorías de movimiento (descripción, abreviatura, regla contable de M15, tipos de movimiento permitidos) y su relación con tipos de movimiento. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.categorias.configurar`.
- **Recibe:** solo los campos a cambiar de tipos de valor (`instrumentTypes`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de tipos de valor (`instrumentTypes`).
- **Pantallas:** PAN-TES-05 (Categorías y conceptos).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1832 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-09-i)

<a id="API-TES-10"></a>
#### API-TES-10 · `GET /api/admin/tes/drawer-accounts`

- **Qué hace:** Libradores. Lista, con filtros y paginación, los registros de cuentas libradoras de cheques de terceros (`checkDrawerAccounts`).
- **Para qué sirve:** RF-TES-063: Advertir al cargar un cheque de un librador con cheques rechazados no recuperados y bloquear libradores marcados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.valores.editar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de cuentas libradoras de cheques de terceros (`checkDrawerAccounts`) con `total`.
- **Pantallas:** PAN-TES-16 (Cuentas de libradores).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1833 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-10)

<a id="API-TES-10-b"></a>
#### API-TES-10-b · `POST /api/admin/tes/drawer-accounts`

- **Qué hace:** Libradores. Da de alta un registro de cuentas libradoras de cheques de terceros (`checkDrawerAccounts`).
- **Para qué sirve:** RF-TES-063: Advertir al cargar un cheque de un librador con cheques rechazados no recuperados y bloquear libradores marcados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.valores.editar`.
- **Recibe:** los datos de cuentas libradoras de cheques de terceros (`checkDrawerAccounts`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de cuentas libradoras de cheques de terceros (`checkDrawerAccounts`).
- **Pantallas:** PAN-TES-16 (Cuentas de libradores).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1833 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-10-b)

<a id="API-TES-10-c"></a>
#### API-TES-10-c · `PATCH /api/admin/tes/drawer-accounts`

- **Qué hace:** Libradores. Modifica algunos campos de un registro de cuentas libradoras de cheques de terceros (`checkDrawerAccounts`) (solo los enviados).
- **Para qué sirve:** RF-TES-063: Advertir al cargar un cheque de un librador con cheques rechazados no recuperados y bloquear libradores marcados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.valores.editar`.
- **Recibe:** solo los campos a cambiar de cuentas libradoras de cheques de terceros (`checkDrawerAccounts`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de cuentas libradoras de cheques de terceros (`checkDrawerAccounts`).
- **Pantallas:** PAN-TES-16 (Cuentas de libradores).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1833 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-10-c)

<a id="API-TES-11"></a>
#### API-TES-11 · `GET /api/admin/tes/movements`

- **Qué hace:** Buscar movimientos. Lista, con filtros y paginación, los registros de libro único de movimientos de fondos (`treasuryMovements`).
- **Para qué sirve:** RF-TES-172: Previsiones agrupadas y detalladas (flujo de fondos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.movimientos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de libro único de movimientos de fondos (`treasuryMovements`) con `total`.
- **Pantallas:** PAN-TES-06 (Libro unificado de movimientos y operaciones), PAN-TES-07 (Libro de bancos / tesorería), PAN-TES-37 (Detalle de operación) y 1 más.
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1834 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-11)

<a id="API-TES-12"></a>
#### API-TES-12 · `POST /api/admin/tes/operations`

- **Qué hace:** Registrar operación (asistente) Da de alta un registro de operaciones de tesorería (`treasuryOperations`).
- **Para qué sirve:** RF-TES-039: Crear un movimiento desde una línea de extracto no registrada (gasto, interés, débito automático, crédito no identificado), con categoría sugerida por regla o por código de operación de Interbanking, y conciliarlo en el acto. · RF-TES-014: Registrar operaciones de tesorería que combinen uno o más ingresos y egresos (efectivo, valores de terceros, cheques propios, eCheq, transferencias, retenciones, cupones, débitos) en una o varias cuentas, con un asistente paso a… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.movimientos.crear`.
- **Recibe:** los datos de operaciones de tesorería (`treasuryOperations`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de operaciones de tesorería (`treasuryOperations`).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1835 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-12)

<a id="API-TES-13"></a>
#### API-TES-13 · `GET /api/admin/tes/operations/{id}`

- **Qué hace:** Detalle. Obtiene el detalle de un registro de operaciones de tesorería (`treasuryOperations`).
- **Para qué sirve:** RF-TES-030: Mostrar el libro de bancos por cuenta (saldo inicial, movimientos no anulados, saldo acumulado, vínculo a la OP o caja de origen y detalle de ND/NC cuando el banco es proveedor) y el libro de tesorería por caja. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.movimientos.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de operaciones de tesorería (`treasuryOperations`).
- **Pantallas:** PAN-TES-06 (Libro unificado de movimientos y operaciones), PAN-TES-07 (Libro de bancos / tesorería), PAN-TES-37 (Detalle de operación) y 1 más.
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1836 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-13)

<a id="API-TES-14"></a>
#### API-TES-14 · `POST /api/admin/tes/operations/{id}/void`

- **Qué hace:** Anular con motivo. Anula un registro de operaciones de tesorería (`treasuryOperations`).
- **Para qué sirve:** RF-TES-020: Anular una operación mediante reversión vinculada (nunca borrado), con motivo, permiso, período abierto y, opcionalmente, reversión de los cheques propios incluidos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.movimientos.anular`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1837 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-14)

<a id="API-TES-15"></a>
#### API-TES-15 · `POST /api/admin/tes/operations/{id}/approve`

- **Qué hace:** Aprobar/rechazar. Aprueba un registro de operaciones de tesorería (`treasuryOperations`).
- **Para qué sirve:** RF-TES-001: Administrar cuentas financieras de los tipos: cuenta corriente bancaria, caja de ahorro, cuenta en moneda extranjera, cuenta virtual (CVU/billetera), caja de tesorería, caja de pagos, cuenta de movimientos (rechazados, cambio de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.movimientos.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1838 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-15)

<a id="API-TES-15-b"></a>
#### API-TES-15-b · `POST /api/admin/tes/operations/{id}/reject`

- **Qué hace:** Aprobar/rechazar. Rechaza un registro de operaciones de tesorería (`treasuryOperations`).
- **Para qué sirve:** RF-TES-001: Administrar cuentas financieras de los tipos: cuenta corriente bancaria, caja de ahorro, cuenta en moneda extranjera, cuenta virtual (CVU/billetera), caja de tesorería, caja de pagos, cuenta de movimientos (rechazados, cambio de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.movimientos.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1838 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-15-b)

<a id="API-TES-16"></a>
#### API-TES-16 · `GET /api/admin/tes/operations/{id}/pdf`

- **Qué hace:** Comprobante. Descarga un archivo de operaciones de tesorería (`treasuryOperations`).
- **Para qué sirve:** RF-TES-021: Emitir el comprobante de la operación (PDF) con ingresos, egresos, medios y firmas, y registrar que fue impreso. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.movimientos.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un archivo (application/pdf).
- **Pantallas:** PAN-TES-06 (Libro unificado de movimientos y operaciones), PAN-TES-07 (Libro de bancos / tesorería), PAN-TES-37 (Detalle de operación) y 1 más.
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1839 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-16)

<a id="API-TES-17"></a>
#### API-TES-17 · `PATCH /api/admin/tes/movements/{id}`

- **Qué hace:** Cambiar fecha valor/observación. Modifica algunos campos de un registro de libro único de movimientos de fondos (`treasuryMovements`) (solo los enviados).
- **Para qué sirve:** RF-TES-105: Editar número y tipo de una retención no presentada y el concepto del movimiento, con auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.movimientos.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de libro único de movimientos de fondos (`treasuryMovements`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de libro único de movimientos de fondos (`treasuryMovements`).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1840 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-17)

<a id="API-TES-18"></a>
#### API-TES-18 · `GET /api/admin/tes/accounts/{id}/book`

- **Qué hace:** Libro con saldo inicial. Consulta «book» de un registro de cuentas financieras (`treasuryAccounts`).
- **Para qué sirve:** RF-TES-030: Mostrar el libro de bancos por cuenta (saldo inicial, movimientos no anulados, saldo acumulado, vínculo a la OP o caja de origen y detalle de ND/NC cuando el banco es proveedor) y el libro de tesorería por caja. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.movimientos.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de cuentas financieras (`treasuryAccounts`).
- **Pantallas:** PAN-TES-06 (Libro unificado de movimientos y operaciones), PAN-TES-07 (Libro de bancos / tesorería), PAN-TES-37 (Detalle de operación) y 1 más.
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1841 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-18)

<a id="API-TES-19"></a>
#### API-TES-19 · `GET /api/admin/tes/statement-profiles`

- **Qué hace:** Perfiles de importación. Consulta `statement-profiles`.
- **Para qué sirve:** RF-TES-033: Importar extractos bancarios en CSV, XLSX y TXT de ancho fijo mediante perfiles de importación por banco (mapeo de columnas, formato de fecha e importe, signo, separadores, filas de encabezado y pie) con el asistente… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.extractos.importar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-08 (Importaciones de extractos).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1842 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-19)

<a id="API-TES-19-b"></a>
#### API-TES-19-b · `POST /api/admin/tes/statement-profiles`

- **Qué hace:** Perfiles de importación. Registra un nuevo elemento u operación en `statement-profiles`.
- **Para qué sirve:** RF-TES-033: Importar extractos bancarios en CSV, XLSX y TXT de ancho fijo mediante perfiles de importación por banco (mapeo de columnas, formato de fecha e importe, signo, separadores, filas de encabezado y pie) con el asistente… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.extractos.importar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-08 (Importaciones de extractos).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1842 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-19-b)

<a id="API-TES-19-c"></a>
#### API-TES-19-c · `PATCH /api/admin/tes/statement-profiles`

- **Qué hace:** Perfiles de importación. Modifica algunos campos de un registro de `statement-profiles` (solo los enviados).
- **Para qué sirve:** RF-TES-033: Importar extractos bancarios en CSV, XLSX y TXT de ancho fijo mediante perfiles de importación por banco (mapeo de columnas, formato de fecha e importe, signo, separadores, filas de encabezado y pie) con el asistente… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.extractos.importar`.
- **Recibe:** solo los campos a cambiar; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-08 (Importaciones de extractos).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1842 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-19-c)

<a id="API-TES-20"></a>
#### API-TES-20 · `POST /api/admin/tes/statement-imports/preview`

- **Qué hace:** Subir y previsualizar. Previsualiza sin efectos sobre importaciones de extractos (`bankStatementImports`).
- **Para qué sirve:** RF-TES-033: Importar extractos bancarios en CSV, XLSX y TXT de ancho fijo mediante perfiles de importación por banco (mapeo de columnas, formato de fecha e importe, signo, separadores, filas de encabezado y pie) con el asistente… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.extractos.importar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-08 (Importaciones de extractos).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1843 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-20)

<a id="API-TES-21"></a>
#### API-TES-21 · `POST /api/admin/tes/statement-imports/{id}/confirm`

- **Qué hace:** Confirmar importación. Confirma un registro de importaciones de extractos (`bankStatementImports`).
- **Para qué sirve:** RF-TES-033: Importar extractos bancarios en CSV, XLSX y TXT de ancho fijo mediante perfiles de importación por banco (mapeo de columnas, formato de fecha e importe, signo, separadores, filas de encabezado y pie) con el asistente… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.extractos.importar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-08 (Importaciones de extractos).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1844 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-21)

<a id="API-TES-22"></a>
#### API-TES-22 · `GET /api/admin/tes/statement-lines`

- **Qué hace:** Líneas por cuenta/estado. Lista, con filtros y paginación, los registros de líneas de extracto (`bankStatementLines`).
- **Para qué sirve:** RF-TES-038: Conciliar manualmente grupos N a M entre líneas de extracto y movimientos de libro, exigiendo que los importes cuadren o que la diferencia se explique con un movimiento creado en el mismo acto. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.conciliacion.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de líneas de extracto (`bankStatementLines`) con `total`.
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1845 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-22)

<a id="API-TES-23"></a>
#### API-TES-23 · `POST /api/admin/tes/reconciliations`

- **Qué hace:** Abrir conciliación. Da de alta un registro de conciliaciones bancarias (`reconciliations`).
- **Para qué sirve:** RF-TES-099: Conciliar la liquidación del procesador contra la línea bancaria. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.conciliacion.conciliar`.
- **Recibe:** los datos de conciliaciones bancarias (`reconciliations`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de conciliaciones bancarias (`reconciliations`).
- **Pantallas:** PAN-TES-09 (Conciliación bancaria asistida).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1846 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-23)

<a id="API-TES-24"></a>
#### API-TES-24 · `GET /api/admin/tes/reconciliations/{id}`

- **Qué hace:** Estado, saldos, partidas. Obtiene el detalle de un registro de conciliaciones bancarias (`reconciliations`).
- **Para qué sirve:** RF-TES-180: Conciliación bancaria (reporte firmado) y antigüedad de partidas pendientes. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.conciliacion.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de conciliaciones bancarias (`reconciliations`).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1847 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-24)

<a id="API-TES-25"></a>
#### API-TES-25 · `POST /api/admin/tes/reconciliations/{id}/auto-match`

- **Qué hace:** Ejecutar reglas (job) Concilia automáticamente un registro de conciliaciones bancarias (`reconciliations`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-TES-048: Administrar reglas de conciliación por tenant y cuenta: condiciones (patrón de descripción, código de operación, rango de importe, CUIT), acción (emparejar, sugerir categoría, crear movimiento) y prioridad. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.conciliacion.conciliar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-TES-09 (Conciliación bancaria asistida).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1848 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-25)

<a id="API-TES-26"></a>
#### API-TES-26 · `POST /api/admin/tes/reconciliations/{id}/matches`

- **Qué hace:** Crear grupo N:M (con movimiento de diferencia opcional) Registra «matches» sobre un registro de conciliaciones bancarias (`reconciliations`).
- **Para qué sirve:** RF-TES-041: Desconciliar un grupo completo con permiso, motivo y auditoría; no se puede desconciliar en una conciliación cerrada sin reabrirla. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.conciliacion.conciliar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-09 (Conciliación bancaria asistida).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1849 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-26)

<a id="API-TES-27"></a>
#### API-TES-27 · `POST /api/admin/tes/reconciliations/{id}/matches/confirm`

- **Qué hace:** Confirmar sugerencias en bloque. Confirma sobre conciliaciones bancarias (`reconciliations`).
- **Para qué sirve:** RF-TES-037: Proponer emparejamientos automáticos por reglas (importe exacto, fecha dentro de tolerancia, referencia, CUIT del ordenante, número de cheque, número de transferencia, código de operación) con puntaje, para que el usuario… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.conciliacion.conciliar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-09 (Conciliación bancaria asistida).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1850 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-27)

<a id="API-TES-28"></a>
#### API-TES-28 · `DELETE /api/admin/tes/reconciliation-matches/{id}`

- **Qué hace:** Desconciliar grupo (motivo en cuerpo; borrado lógico) Elimina o da de baja un registro de pareos (`reconciliationMatches`).
- **Para qué sirve:** RF-TES-041: Desconciliar un grupo completo con permiso, motivo y auditoría; no se puede desconciliar en una conciliación cerrada sin reabrirla. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.conciliacion.desconciliar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1851 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-28)

<a id="API-TES-29"></a>
#### API-TES-29 · `POST /api/admin/tes/statement-lines/{id}/create-movement`

- **Qué hace:** Crear movimiento y conciliar. Genera un movimiento desde un registro de líneas de extracto (`bankStatementLines`).
- **Para qué sirve:** RF-TES-039: Crear un movimiento desde una línea de extracto no registrada (gasto, interés, débito automático, crédito no identificado), con categoría sugerida por regla o por código de operación de Interbanking, y conciliarlo en el acto. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.conciliacion.conciliar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-09 (Conciliación bancaria asistida).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1852 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-29)

<a id="API-TES-30"></a>
#### API-TES-30 · `POST /api/admin/tes/statement-lines/{id}/send-unidentified`

- **Qué hace:** Enviar a no identificados (M07) Envía como no identificado un registro de líneas de extracto (`bankStatementLines`).
- **Para qué sirve:** RF-TES-040: Enviar los créditos bancarios no identificados a la bandeja de pendientes de identificación de M07 (AGR-012); al identificarse, M07 imputa al socio y TES concilia el crédito con el cobro. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.conciliacion.conciliar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-09 (Conciliación bancaria asistida).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1853 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-30)

<a id="API-TES-31"></a>
#### API-TES-31 · `POST /api/admin/tes/reconciliations/{id}/close`

- **Qué hace:** Cerrar / reabrir. Cierra un registro de conciliaciones bancarias (`reconciliations`).
- **Para qué sirve:** RF-TES-042: Cerrar la conciliación de un período con aprobación, generar el reporte de conciliación (PDF y XLSX) y bloquear sus grupos; reabrir solo con permiso de supervisor. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.conciliacion.cerrar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1854 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-31)

<a id="API-TES-31-b"></a>
#### API-TES-31-b · `POST /api/admin/tes/reconciliations/{id}/reopen`

- **Qué hace:** Cerrar / reabrir. Reabre un registro de conciliaciones bancarias (`reconciliations`).
- **Para qué sirve:** RF-TES-042: Cerrar la conciliación de un período con aprobación, generar el reporte de conciliación (PDF y XLSX) y bloquear sus grupos; reabrir solo con permiso de supervisor. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.conciliacion.cerrar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1854 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-31-b)

<a id="API-TES-32"></a>
#### API-TES-32 · `GET /api/admin/tes/reconciliations/{id}/report`

- **Qué hace:** Reporte PDF/XLSX. Consulta «report» de un registro de conciliaciones bancarias (`reconciliations`).
- **Para qué sirve:** RF-TES-042: Cerrar la conciliación de un período con aprobación, generar el reporte de conciliación (PDF y XLSX) y bloquear sus grupos; reabrir solo con permiso de supervisor. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.conciliacion.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de conciliaciones bancarias (`reconciliations`).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1855 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-32)

<a id="API-TES-33"></a>
#### API-TES-33 · `GET /api/admin/tes/reconciliation-rules`

- **Qué hace:** Reglas y prueba. Lista, con filtros y paginación, los registros de reglas de pareo (`reconciliationRules`).
- **Para qué sirve:** RF-TES-051: Configurar la conexión del tenant a la API de información financiera de Interbanking (identificador de cliente, credenciales en la bóveda de T06, alcance), con prueba de conexión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.reglasConciliacion.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de reglas de pareo (`reconciliationRules`) con `total`.
- **Pantallas:** PAN-TES-10 (Reglas de conciliación).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1856 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-33)

<a id="API-TES-33-b"></a>
#### API-TES-33-b · `POST /api/admin/tes/reconciliation-rules`

- **Qué hace:** Reglas y prueba. Da de alta un registro de reglas de pareo (`reconciliationRules`).
- **Para qué sirve:** RF-TES-051: Configurar la conexión del tenant a la API de información financiera de Interbanking (identificador de cliente, credenciales en la bóveda de T06, alcance), con prueba de conexión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.reglasConciliacion.configurar`.
- **Recibe:** los datos de reglas de pareo (`reconciliationRules`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de reglas de pareo (`reconciliationRules`).
- **Pantallas:** PAN-TES-10 (Reglas de conciliación).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1856 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-33-b)

<a id="API-TES-33-c"></a>
#### API-TES-33-c · `PATCH /api/admin/tes/reconciliation-rules`

- **Qué hace:** Reglas y prueba. Modifica algunos campos de un registro de reglas de pareo (`reconciliationRules`) (solo los enviados).
- **Para qué sirve:** RF-TES-051: Configurar la conexión del tenant a la API de información financiera de Interbanking (identificador de cliente, credenciales en la bóveda de T06, alcance), con prueba de conexión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.reglasConciliacion.configurar`.
- **Recibe:** solo los campos a cambiar de reglas de pareo (`reconciliationRules`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de reglas de pareo (`reconciliationRules`).
- **Pantallas:** PAN-TES-10 (Reglas de conciliación).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1856 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-33-c)

<a id="API-TES-33-d"></a>
#### API-TES-33-d · `POST /api/admin/tes/reconciliation-rules/{id}/test`

- **Qué hace:** Reglas y prueba. Prueba un registro de reglas de pareo (`reconciliationRules`).
- **Para qué sirve:** RF-TES-051: Configurar la conexión del tenant a la API de información financiera de Interbanking (identificador de cliente, credenciales en la bóveda de T06, alcance), con prueba de conexión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.reglasConciliacion.configurar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-10 (Reglas de conciliación).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1856 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-33-d)

<a id="API-TES-34"></a>
#### API-TES-34 · `GET /api/admin/tes/interbanking/connection`

- **Qué hace:** Configurar conexión (secreto solo de escritura → bóveda) Consulta `connection`.
- **Para qué sirve:** RF-TES-051: Configurar la conexión del tenant a la API de información financiera de Interbanking (identificador de cliente, credenciales en la bóveda de T06, alcance), con prueba de conexión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.interbanking.configurar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-11 (Conexión y cuentas IB).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1857 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-34)

<a id="API-TES-34-b"></a>
#### API-TES-34-b · `PUT /api/admin/tes/interbanking/connection`

- **Qué hace:** Configurar conexión (secreto solo de escritura → bóveda) Reemplaza o configura `connection`.
- **Para qué sirve:** RF-TES-051: Configurar la conexión del tenant a la API de información financiera de Interbanking (identificador de cliente, credenciales en la bóveda de T06, alcance), con prueba de conexión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.interbanking.configurar`.
- **Recibe:** un cuerpo JSON cuya estructura detalla el anexo; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-11 (Conexión y cuentas IB).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1857 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-34-b)

<a id="API-TES-35"></a>
#### API-TES-35 · `POST /api/admin/tes/interbanking/test`

- **Qué hace:** Probar conexión. Prueba sobre `test`.
- **Para qué sirve:** RF-TES-051: Configurar la conexión del tenant a la API de información financiera de Interbanking (identificador de cliente, credenciales en la bóveda de T06, alcance), con prueba de conexión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.interbanking.configurar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-11 (Conexión y cuentas IB).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1858 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-35)

<a id="API-TES-36"></a>
#### API-TES-36 · `GET /api/admin/tes/interbanking/accounts`

- **Qué hace:** Cuentas IB. Lista, con filtros y paginación, los registros de cuentas financieras (`treasuryAccounts`).
- **Para qué sirve:** RF-TES-010: Vincular cada cuenta bancaria con su cuenta en Interbanking por CBU. · RF-TES-051: Configurar la conexión del tenant a la API de información financiera de Interbanking (identificador de cliente, credenciales en la bóveda de T06, alcance), con prueba de conexión. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.interbanking.sincronizar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de cuentas financieras (`treasuryAccounts`) con `total`.
- **Pantallas:** PAN-TES-12 (Saldos IB vs libro).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1859 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-36)

<a id="API-TES-37"></a>
#### API-TES-37 · `POST /api/admin/tes/interbanking/sync`

- **Qué hace:** Sincronizar ahora (job) Sincroniza sobre `sync`; el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-TES-010: Vincular cada cuenta bancaria con su cuenta en Interbanking por CBU. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.interbanking.sincronizar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-TES-12 (Saldos IB vs libro).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1860 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-37)

<a id="API-TES-38"></a>
#### API-TES-38 · `GET /api/admin/tes/interbanking/balances`

- **Qué hace:** Saldos banco vs libro. Consulta `balances`.
- **Para qué sirve:** RF-TES-053: Consultar saldos de Interbanking y compararlos con el saldo del libro por cuenta, mostrando la diferencia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.interbanking.sincronizar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-12 (Saldos IB vs libro).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1861 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-38)

<a id="API-TES-39"></a>
#### API-TES-39 · `GET /api/admin/tes/interbanking/code-mappings`

- **Qué hace:** Mapeo de códigos. Consulta `code-mappings`.
- **Para qué sirve:** RF-TES-055: Traducir el código de operación de Interbanking a categoría/concepto de GoodApps mediante una tabla de mapeo editable. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.interbanking.configurar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-11 (Conexión y cuentas IB).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1862 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-39)

<a id="API-TES-39-b"></a>
#### API-TES-39-b · `PUT /api/admin/tes/interbanking/code-mappings`

- **Qué hace:** Mapeo de códigos. Reemplaza o configura `code-mappings`.
- **Para qué sirve:** RF-TES-055: Traducir el código de operación de Interbanking a categoría/concepto de GoodApps mediante una tabla de mapeo editable. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.interbanking.configurar`.
- **Recibe:** un cuerpo JSON cuya estructura detalla el anexo; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-11 (Conexión y cuentas IB).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1862 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-39-b)

<a id="API-TES-40"></a>
#### API-TES-40 · `POST /api/admin/tes/payment-files`

- **Qué hace:** Generar archivo desde selección. Da de alta un registro de archivos de pago masivo (`paymentFiles`).
- **Para qué sirve:** RF-TES-058: Generar archivos de transferencias desde tesorería (no originadas en OP) con CBU de origen de la cuenta seleccionada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.archivosPago.generar`.
- **Recibe:** los datos de archivos de pago masivo (`paymentFiles`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de archivos de pago masivo (`paymentFiles`).
- **Pantallas:** PAN-TES-13 (Archivos de pago).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1863 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-40)

<a id="API-TES-41"></a>
#### API-TES-41 · `GET /api/admin/tes/payment-files/{id}/download`

- **Qué hace:** Descargar (URL firmada) Descarga un archivo de archivos de pago masivo (`paymentFiles`).
- **Para qué sirve:** RF-TES-057: Generar archivos de pago en otros formatos por banco como complementos (planilla Credicoop y los que se incorporen). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.archivosPago.generar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un archivo (application/octet-stream).
- **Pantallas:** PAN-TES-13 (Archivos de pago).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1864 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-41)

<a id="API-TES-42"></a>
#### API-TES-42 · `POST /api/admin/tes/payment-files/{id}/sent`

- **Qué hace:** Registrar envío / importar respuesta / anular. Registra «sent» sobre un registro de archivos de pago masivo (`paymentFiles`).
- **Para qué sirve:** RF-TES-059: Registrar envío, respuesta, aceptación y rechazo de cada archivo y de cada línea, con evidencia (archivo, hash, acuse). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.archivosPago.enviar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1865 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-42)

<a id="API-TES-42-b"></a>
#### API-TES-42-b · `POST /api/admin/tes/payment-files/{id}/response`

- **Qué hace:** Registrar envío / importar respuesta / anular. Registra «response» sobre un registro de archivos de pago masivo (`paymentFiles`).
- **Para qué sirve:** RF-TES-059: Registrar envío, respuesta, aceptación y rechazo de cada archivo y de cada línea, con evidencia (archivo, hash, acuse). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.archivosPago.enviar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1865 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-42-b)

<a id="API-TES-42-c"></a>
#### API-TES-42-c · `POST /api/admin/tes/payment-files/{id}/void`

- **Qué hace:** Registrar envío / importar respuesta / anular. Anula un registro de archivos de pago masivo (`paymentFiles`).
- **Para qué sirve:** RF-TES-059: Registrar envío, respuesta, aceptación y rechazo de cada archivo y de cada línea, con evidencia (archivo, hash, acuse). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.archivosPago.enviar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1865 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-42-c)

<a id="API-TES-43"></a>
#### API-TES-43 · `GET /api/admin/tes/third-party-checks`

- **Qué hace:** Cartera. Lista, con filtros y paginación, los registros de cheques y eCheq de terceros (`thirdPartyChecks`).
- **Para qué sirve:** RF-TES-087: Recibir eCheq de terceros: registrar en cartera con identificador eCheq, aceptar o repudiar dentro del plazo con alerta de vencimiento del plazo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.valores.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de cheques y eCheq de terceros (`thirdPartyChecks`) con `total`.
- **Pantallas:** PAN-TES-14 (Cartera de valores de terceros).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1866 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-43)

<a id="API-TES-44"></a>
#### API-TES-44 · `POST /api/admin/tes/third-party-checks`

- **Qué hace:** Alta de valor. Da de alta un registro de cheques y eCheq de terceros (`thirdPartyChecks`).
- **Para qué sirve:** RF-TES-077: Dar de alta chequeras de eCheq con cupo de cheques sin número previo; el número se asigna al emitir. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.valores.crear`.
- **Recibe:** los datos de cheques y eCheq de terceros (`thirdPartyChecks`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de cheques y eCheq de terceros (`thirdPartyChecks`).
- **Pantallas:** PAN-TES-15 (Alta/edición de valor).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1867 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-44)

<a id="API-TES-45"></a>
#### API-TES-45 · `PATCH /api/admin/tes/third-party-checks/{id}`

- **Qué hace:** Modificar (en cartera) Modifica algunos campos de un registro de cheques y eCheq de terceros (`thirdPartyChecks`) (solo los enviados).
- **Para qué sirve:** RF-TES-072: Modificar datos de un valor (entidad, sucursal, cuenta, observación, fecha) solo mientras está En cartera, con auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.valores.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de cheques y eCheq de terceros (`thirdPartyChecks`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de cheques y eCheq de terceros (`thirdPartyChecks`).
- **Pantallas:** PAN-TES-16 (Cuentas de libradores).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1868 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-45)

<a id="API-TES-46"></a>
#### API-TES-46 · `POST /api/admin/tes/third-party-checks/{id}/enable-payment`

- **Qué hace:** Transiciones. Habilita el pago de un registro de cheques y eCheq de terceros (`thirdPartyChecks`).
- **Para qué sirve:** RF-TES-105: Editar número y tipo de una retención no presentada y el concepto del movimiento, con auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.valores.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-16 (Cuentas de libradores).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1869 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-46)

<a id="API-TES-46-b"></a>
#### API-TES-46-b · `POST /api/admin/tes/third-party-checks/{id}/disable-payment`

- **Qué hace:** Transiciones. Deshabilita el pago de un registro de cheques y eCheq de terceros (`thirdPartyChecks`).
- **Para qué sirve:** RF-TES-105: Editar número y tipo de una retención no presentada y el concepto del movimiento, con auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.valores.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-16 (Cuentas de libradores).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1869 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-46-b)

<a id="API-TES-46-c"></a>
#### API-TES-46-c · `POST /api/admin/tes/third-party-checks/{id}/reject`

- **Qué hace:** Transiciones. Rechaza un registro de cheques y eCheq de terceros (`thirdPartyChecks`).
- **Para qué sirve:** RF-TES-105: Editar número y tipo de una retención no presentada y el concepto del movimiento, con auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.valores.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-16 (Cuentas de libradores).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1869 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-46-c)

<a id="API-TES-46-d"></a>
#### API-TES-46-d · `POST /api/admin/tes/third-party-checks/{id}/recover`

- **Qué hace:** Transiciones. Recupera un registro de cheques y eCheq de terceros (`thirdPartyChecks`).
- **Para qué sirve:** RF-TES-105: Editar número y tipo de una retención no presentada y el concepto del movimiento, con auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.valores.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-16 (Cuentas de libradores).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1869 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-46-d)

<a id="API-TES-46-e"></a>
#### API-TES-46-e · `POST /api/admin/tes/third-party-checks/{id}/return`

- **Qué hace:** Transiciones. Devuelve un registro de cheques y eCheq de terceros (`thirdPartyChecks`).
- **Para qué sirve:** RF-TES-105: Editar número y tipo de una retención no presentada y el concepto del movimiento, con auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.valores.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-16 (Cuentas de libradores).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1869 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-46-e)

<a id="API-TES-46-f"></a>
#### API-TES-46-f · `POST /api/admin/tes/third-party-checks/{id}/manual-out`

- **Qué hace:** Transiciones. Registra una salida manual de un registro de cheques y eCheq de terceros (`thirdPartyChecks`).
- **Para qué sirve:** RF-TES-105: Editar número y tipo de una retención no presentada y el concepto del movimiento, con auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.valores.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-16 (Cuentas de libradores).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1869 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-46-f)

<a id="API-TES-46-g"></a>
#### API-TES-46-g · `POST /api/admin/tes/third-party-checks/{id}/void`

- **Qué hace:** Transiciones. Anula un registro de cheques y eCheq de terceros (`thirdPartyChecks`).
- **Para qué sirve:** RF-TES-105: Editar número y tipo de una retención no presentada y el concepto del movimiento, con auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.valores.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-16 (Cuentas de libradores).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1869 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-46-g)

<a id="API-TES-46-h"></a>
#### API-TES-46-h · `POST /api/admin/tes/third-party-checks/{id}/accept`

- **Qué hace:** Transiciones. Acepta un registro de cheques y eCheq de terceros (`thirdPartyChecks`).
- **Para qué sirve:** RF-TES-105: Editar número y tipo de una retención no presentada y el concepto del movimiento, con auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.valores.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-16 (Cuentas de libradores).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1869 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-46-h)

<a id="API-TES-46-i"></a>
#### API-TES-46-i · `POST /api/admin/tes/third-party-checks/{id}/repudiate`

- **Qué hace:** Transiciones. Repudia un registro de cheques y eCheq de terceros (`thirdPartyChecks`).
- **Para qué sirve:** RF-TES-105: Editar número y tipo de una retención no presentada y el concepto del movimiento, con auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.valores.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-16 (Cuentas de libradores).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1869 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-46-i)

<a id="API-TES-46-j"></a>
#### API-TES-46-j · `POST /api/admin/tes/third-party-checks/{id}/custody`

- **Qué hace:** Transiciones. Pone en custodia un registro de cheques y eCheq de terceros (`thirdPartyChecks`).
- **Para qué sirve:** RF-TES-105: Editar número y tipo de una retención no presentada y el concepto del movimiento, con auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.valores.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-16 (Cuentas de libradores).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1869 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-46-j)

<a id="API-TES-46-k"></a>
#### API-TES-46-k · `POST /api/admin/tes/third-party-checks/{id}/negotiate`

- **Qué hace:** Transiciones. Negocia un registro de cheques y eCheq de terceros (`thirdPartyChecks`).
- **Para qué sirve:** RF-TES-105: Editar número y tipo de una retención no presentada y el concepto del movimiento, con auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.valores.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-16 (Cuentas de libradores).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1869 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-46-k)

<a id="API-TES-47"></a>
#### API-TES-47 · `GET /api/admin/tes/third-party-checks/{id}/events`

- **Qué hace:** Historial. Lista, con filtros y paginación, los registros de cheques y eCheq de terceros (`thirdPartyChecks`).
- **Para qué sirve:** RF-TES-087: Recibir eCheq de terceros: registrar en cartera con identificador eCheq, aceptar o repudiar dentro del plazo con alerta de vencimiento del plazo. · RF-TES-014: Registrar operaciones de tesorería que combinen uno o más ingresos y egresos (efectivo, valores de terceros, cheques propios, eCheq, transferencias, retenciones, cupones, débitos) en una o varias cuentas, con un asistente paso a… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.valores.ver`.
- **Recibe:** en la ruta `id`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de cheques y eCheq de terceros (`thirdPartyChecks`) con `total`.
- **Pantallas:** PAN-TES-14 (Cartera de valores de terceros).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1870 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-47)

<a id="API-TES-48"></a>
#### API-TES-48 · `POST /api/admin/tes/deposits`

- **Qué hace:** Depósito / anular. Da de alta un registro de depósitos bancarios (`bankDeposits`).
- **Para qué sirve:** RF-TES-068: Depositar valores en una cuenta bancaria mediante boleta, con fecha probable de acreditación, y acreditarlos al conciliar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.depositos.crear`.
- **Recibe:** los datos de depósitos bancarios (`bankDeposits`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de depósitos bancarios (`bankDeposits`).
- **Pantallas:** PAN-TES-17 (Depósitos bancarios).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1871 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-48)

<a id="API-TES-48-b"></a>
#### API-TES-48-b · `POST /api/admin/tes/deposits/{id}/void`

- **Qué hace:** Depósito / anular. Anula un registro de depósitos bancarios (`bankDeposits`).
- **Para qué sirve:** RF-TES-068: Depositar valores en una cuenta bancaria mediante boleta, con fecha probable de acreditación, y acreditarlos al conciliar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.depositos.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-17 (Depósitos bancarios).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1871 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-48-b)

<a id="API-TES-49"></a>
#### API-TES-49 · `GET /api/admin/tes/checkbooks`

- **Qué hace:** Chequeras. Lista, con filtros y paginación, los registros de chequeras (`checkbooks`).
- **Para qué sirve:** RF-TES-126: Crear automáticamente una rendición cuando M07 cierra una caja de cobranza, con totales teóricos y contados por medio (efectivo por moneda, cheques, cupones, retenciones, transferencias recibidas, otros) y detalle de cada valor. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.chequeras.crear`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de chequeras (`checkbooks`) con `total`.
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1872 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-49)

<a id="API-TES-49-b"></a>
#### API-TES-49-b · `POST /api/admin/tes/checkbooks`

- **Qué hace:** Chequeras. Da de alta un registro de chequeras (`checkbooks`).
- **Para qué sirve:** RF-TES-126: Crear automáticamente una rendición cuando M07 cierra una caja de cobranza, con totales teóricos y contados por medio (efectivo por moneda, cheques, cupones, retenciones, transferencias recibidas, otros) y detalle de cada valor. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.chequeras.crear`.
- **Recibe:** los datos de chequeras (`checkbooks`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de chequeras (`checkbooks`).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1872 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-49-b)

<a id="API-TES-50"></a>
#### API-TES-50 · `POST /api/admin/tes/own-checks/{id}/void`

- **Qué hace:** Transiciones de cheque propio. Anula un registro de cheques propios (`ownChecks`).
- **Para qué sirve:** RF-TES-020: Anular una operación mediante reversión vinculada (nunca borrado), con motivo, permiso, período abierto y, opcionalmente, reversión de los cheques propios incluidos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.chequeras.anular`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1873 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-50)

<a id="API-TES-50-b"></a>
#### API-TES-50-b · `POST /api/admin/tes/own-checks/{id}/unmark`

- **Qué hace:** Transiciones de cheque propio. Desmarca un registro de cheques propios (`ownChecks`).
- **Para qué sirve:** RF-TES-020: Anular una operación mediante reversión vinculada (nunca borrado), con motivo, permiso, período abierto y, opcionalmente, reversión de los cheques propios incluidos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.chequeras.anular`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1873 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-50-b)

<a id="API-TES-50-c"></a>
#### API-TES-50-c · `POST /api/admin/tes/own-checks/{id}/replace`

- **Qué hace:** Transiciones de cheque propio. Reemplaza un registro de cheques propios (`ownChecks`).
- **Para qué sirve:** RF-TES-020: Anular una operación mediante reversión vinculada (nunca borrado), con motivo, permiso, período abierto y, opcionalmente, reversión de los cheques propios incluidos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.chequeras.anular`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1873 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-50-c)

<a id="API-TES-50-d"></a>
#### API-TES-50-d · `POST /api/admin/tes/own-checks/{id}/recover`

- **Qué hace:** Transiciones de cheque propio. Recupera un registro de cheques propios (`ownChecks`).
- **Para qué sirve:** RF-TES-020: Anular una operación mediante reversión vinculada (nunca borrado), con motivo, permiso, período abierto y, opcionalmente, reversión de los cheques propios incluidos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.chequeras.anular`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1873 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-50-d)

<a id="API-TES-50-e"></a>
#### API-TES-50-e · `POST /api/admin/tes/own-checks/{id}/reject`

- **Qué hace:** Transiciones de cheque propio. Rechaza un registro de cheques propios (`ownChecks`).
- **Para qué sirve:** RF-TES-020: Anular una operación mediante reversión vinculada (nunca borrado), con motivo, permiso, período abierto y, opcionalmente, reversión de los cheques propios incluidos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.chequeras.anular`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1873 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-50-e)

<a id="API-TES-51"></a>
#### API-TES-51 · `POST /api/admin/tes/own-checks/print`

- **Qué hace:** Imprimir rango (PDF) y marcar. Imprime sobre cheques propios (`ownChecks`).
- **Para qué sirve:** RF-TES-082: Imprimir cheques físicos por rango correlativo, con beneficiario (nombre de pago de la OP, o "a la orden" del proveedor, o razón social), importe en letras y formato de la chequera o del tenant; marcar impresos y advertir… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.chequeras.imprimir`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-20 (Impresión de cheques).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1874 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-51)

<a id="API-TES-52"></a>
#### API-TES-52 · `POST /api/admin/tes/echeqs/import-status`

- **Qué hace:** Importar estados eCheq. Registra un nuevo elemento u operación en `import-status`.
- **Para qué sirve:** RF-TES-089: Actualizar el estado de los eCheq por importación del archivo/listado del banco o por adaptador de API cuando esté disponible. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.echeq.gestionar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1875 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-52)

<a id="API-TES-53"></a>
#### API-TES-53 · `GET /api/admin/tes/card-plans`

- **Qué hace:** Tarjetas y recargos. Consulta `card-plans`.
- **Para qué sirve:** RF-TES-091: Administrar tarjetas/planes aceptados: código único, nombre, procesador (proveedor M12), código de archivo, número de comercio, débito o crédito, requiere presentación, uso en caja, porcentaje e importe en caja, producto… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.tarjetas.configurar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-21 (Tarjetas y planes).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1876 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-53)

<a id="API-TES-53-b"></a>
#### API-TES-53-b · `POST /api/admin/tes/card-plans`

- **Qué hace:** Tarjetas y recargos. Registra un nuevo elemento u operación en `card-plans`.
- **Para qué sirve:** RF-TES-091: Administrar tarjetas/planes aceptados: código único, nombre, procesador (proveedor M12), código de archivo, número de comercio, débito o crédito, requiere presentación, uso en caja, porcentaje e importe en caja, producto… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.tarjetas.configurar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-21 (Tarjetas y planes).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1876 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-53-b)

<a id="API-TES-53-c"></a>
#### API-TES-53-c · `PATCH /api/admin/tes/card-plans`

- **Qué hace:** Tarjetas y recargos. Modifica algunos campos de un registro de `card-plans` (solo los enviados).
- **Para qué sirve:** RF-TES-091: Administrar tarjetas/planes aceptados: código único, nombre, procesador (proveedor M12), código de archivo, número de comercio, débito o crédito, requiere presentación, uso en caja, porcentaje e importe en caja, producto… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.tarjetas.configurar`.
- **Recibe:** solo los campos a cambiar; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-21 (Tarjetas y planes).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1876 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-53-c)

<a id="API-TES-54"></a>
#### API-TES-54 · `GET /api/admin/tes/card-vouchers`

- **Qué hace:** Cupones. Lista, con filtros y paginación, los registros de cupones de tarjeta (`cardVouchers`).
- **Para qué sirve:** RF-TES-093: Presentar cupones al procesador en lotes (selección por tarjeta, comercio, fecha), registrando el movimiento de presentación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.cupones.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de cupones de tarjeta (`cardVouchers`) con `total`.
- **Pantallas:** PAN-TES-22 (Cupones).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1877 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-54)

<a id="API-TES-55"></a>
#### API-TES-55 · `PATCH /api/admin/tes/card-vouchers/{id}`

- **Qué hace:** Corregir datos. Modifica algunos campos de un registro de cupones de tarjeta (`cardVouchers`) (solo los enviados).
- **Para qué sirve:** RF-TES-094: Corregir tarjeta, número de cupón y autorización de un cupón no liquidado, con auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.cupones.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de cupones de tarjeta (`cardVouchers`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de cupones de tarjeta (`cardVouchers`).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1878 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-55)

<a id="API-TES-56"></a>
#### API-TES-56 · `POST /api/admin/tes/card-presentations`

- **Qué hace:** Presentar / anular. Da de alta un registro de presentaciones a procesadoras (`cardPresentations`).
- **Para qué sirve:** RF-TES-097: Anular una presentación (solo con cupones no liquidados, y si la suma coincide con el movimiento) y anular una liquidación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.cupones.presentar`.
- **Recibe:** los datos de presentaciones a procesadoras (`cardPresentations`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de presentaciones a procesadoras (`cardPresentations`).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1879 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-56)

<a id="API-TES-56-b"></a>
#### API-TES-56-b · `POST /api/admin/tes/card-presentations/{id}/void`

- **Qué hace:** Presentar / anular. Anula un registro de presentaciones a procesadoras (`cardPresentations`).
- **Para qué sirve:** RF-TES-097: Anular una presentación (solo con cupones no liquidados, y si la suma coincide con el movimiento) y anular una liquidación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.cupones.presentar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1879 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-56-b)

<a id="API-TES-57"></a>
#### API-TES-57 · `POST /api/admin/tes/card-settlements`

- **Qué hace:** Liquidar / anular. Da de alta un registro de liquidaciones de tarjetas (`cardSettlements`).
- **Para qué sirve:** RF-TES-097: Anular una presentación (solo con cupones no liquidados, y si la suma coincide con el movimiento) y anular una liquidación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.cupones.liquidar`.
- **Recibe:** los datos de liquidaciones de tarjetas (`cardSettlements`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de liquidaciones de tarjetas (`cardSettlements`).
- **Pantallas:** PAN-TES-23 (Liquidaciones de tarjeta).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1880 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-57)

<a id="API-TES-57-b"></a>
#### API-TES-57-b · `POST /api/admin/tes/card-settlements/{id}/void`

- **Qué hace:** Liquidar / anular. Anula un registro de liquidaciones de tarjetas (`cardSettlements`).
- **Para qué sirve:** RF-TES-097: Anular una presentación (solo con cupones no liquidados, y si la suma coincide con el movimiento) y anular una liquidación. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.cupones.liquidar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-23 (Liquidaciones de tarjeta).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1880 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-57-b)

<a id="API-TES-58"></a>
#### API-TES-58 · `POST /api/admin/tes/card-vouchers/{id}/reject`

- **Qué hace:** Rechazo de cupón. Rechaza un registro de cupones de tarjeta (`cardVouchers`).
- **Para qué sirve:** RF-TES-094: Corregir tarjeta, número de cupón y autorización de un cupón no liquidado, con auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.cupones.rechazar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1881 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-58)

<a id="API-TES-59"></a>
#### API-TES-59 · `GET /api/admin/tes/received-withholdings`

- **Qué hace:** Retenciones recibidas. Lista, con filtros y paginación, los registros de retenciones sufridas en cartera (`receivedWithholdings`).
- **Para qué sirve:** RF-TES-126: Crear automáticamente una rendición cuando M07 cierra una caja de cobranza, con totales teóricos y contados por medio (efectivo por moneda, cheques, cupones, retenciones, transferencias recibidas, otros) y detalle de cada valor. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.retencionesRecibidas.crear`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de retenciones sufridas en cartera (`receivedWithholdings`) con `total`.
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-59)

<a id="API-TES-59-b"></a>
#### API-TES-59-b · `POST /api/admin/tes/received-withholdings`

- **Qué hace:** Retenciones recibidas. Da de alta un registro de retenciones sufridas en cartera (`receivedWithholdings`).
- **Para qué sirve:** RF-TES-126: Crear automáticamente una rendición cuando M07 cierra una caja de cobranza, con totales teóricos y contados por medio (efectivo por moneda, cheques, cupones, retenciones, transferencias recibidas, otros) y detalle de cada valor. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.retencionesRecibidas.crear`.
- **Recibe:** los datos de retenciones sufridas en cartera (`receivedWithholdings`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de retenciones sufridas en cartera (`receivedWithholdings`).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-59-b)

<a id="API-TES-59-c"></a>
#### API-TES-59-c · `PATCH /api/admin/tes/received-withholdings`

- **Qué hace:** Retenciones recibidas. Modifica algunos campos de un registro de retenciones sufridas en cartera (`receivedWithholdings`) (solo los enviados).
- **Para qué sirve:** RF-TES-126: Crear automáticamente una rendición cuando M07 cierra una caja de cobranza, con totales teóricos y contados por medio (efectivo por moneda, cheques, cupones, retenciones, transferencias recibidas, otros) y detalle de cada valor. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.retencionesRecibidas.crear`.
- **Recibe:** solo los campos a cambiar de retenciones sufridas en cartera (`receivedWithholdings`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de retenciones sufridas en cartera (`receivedWithholdings`).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1882 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-59-c)

<a id="API-TES-60"></a>
#### API-TES-60 · `POST /api/admin/tes/withholding-presentations`

- **Qué hace:** Presentar / salida / anular. Da de alta un registro de presentación de retenciones sufridas (`withholdingPresentations`).
- **Para qué sirve:** RF-TES-102: Mantener la cartera de retenciones pendientes (no presentadas y sin salida). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.retencionesRecibidas.presentar`.
- **Recibe:** los datos de presentación de retenciones sufridas (`withholdingPresentations`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de presentación de retenciones sufridas (`withholdingPresentations`).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1883 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-60)

<a id="API-TES-60-b"></a>
#### API-TES-60-b · `POST /api/admin/tes/withholding-presentations/{id}/void`

- **Qué hace:** Presentar / salida / anular. Anula un registro de presentación de retenciones sufridas (`withholdingPresentations`).
- **Para qué sirve:** RF-TES-102: Mantener la cartera de retenciones pendientes (no presentadas y sin salida). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.retencionesRecibidas.presentar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1883 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-60-b)

<a id="API-TES-61"></a>
#### API-TES-61 · `GET /api/admin/tes/payment-cash-sessions`

- **Qué hace:** Caja de pagos. Lista, con filtros y paginación, los registros de turnos de la caja de pagos (`paymentCashSessions`).
- **Para qué sirve:** RF-TES-107: Abrir y cerrar la caja de pagos del día con usuario, tope de efectivo y medios habilitados (cheques propios, valores, efectivo, transferencias); apertura automática diaria opcional (o reapertura si estaba cerrada). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.cajasPago.abrir`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de turnos de la caja de pagos (`paymentCashSessions`) con `total`.
- **Pantallas:** PAN-TES-25 (Cajas para pagos a proveedores).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1884 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-61)

<a id="API-TES-61-b"></a>
#### API-TES-61-b · `POST /api/admin/tes/payment-cash-sessions`

- **Qué hace:** Caja de pagos. Da de alta un registro de turnos de la caja de pagos (`paymentCashSessions`).
- **Para qué sirve:** RF-TES-107: Abrir y cerrar la caja de pagos del día con usuario, tope de efectivo y medios habilitados (cheques propios, valores, efectivo, transferencias); apertura automática diaria opcional (o reapertura si estaba cerrada). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.cajasPago.abrir`.
- **Recibe:** los datos de turnos de la caja de pagos (`paymentCashSessions`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de turnos de la caja de pagos (`paymentCashSessions`).
- **Pantallas:** PAN-TES-25 (Cajas para pagos a proveedores).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1884 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-61-b)

<a id="API-TES-61-c"></a>
#### API-TES-61-c · `POST /api/admin/tes/payment-cash-sessions/{id}/close`

- **Qué hace:** Caja de pagos. Cierra un registro de turnos de la caja de pagos (`paymentCashSessions`).
- **Para qué sirve:** RF-TES-107: Abrir y cerrar la caja de pagos del día con usuario, tope de efectivo y medios habilitados (cheques propios, valores, efectivo, transferencias); apertura automática diaria opcional (o reapertura si estaba cerrada). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.cajasPago.abrir`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-25 (Cajas para pagos a proveedores).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1884 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-61-c)

<a id="API-TES-61-d"></a>
#### API-TES-61-d · `POST /api/admin/tes/payment-cash-sessions/{id}/reopen`

- **Qué hace:** Caja de pagos. Reabre un registro de turnos de la caja de pagos (`paymentCashSessions`).
- **Para qué sirve:** RF-TES-107: Abrir y cerrar la caja de pagos del día con usuario, tope de efectivo y medios habilitados (cheques propios, valores, efectivo, transferencias); apertura automática diaria opcional (o reapertura si estaba cerrada). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.cajasPago.abrir`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-25 (Cajas para pagos a proveedores).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1884 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-61-d)

<a id="API-TES-62"></a>
#### API-TES-62 · `GET /api/admin/tes/payment-executions`

- **Qué hace:** Bandeja. Lista, con filtros y paginación, los registros de ejecución de pagos (`paymentExecutions`).
- **Para qué sirve:** RF-TES-113: Mostrar la bandeja de órdenes de pago aprobadas por M12 pendientes de ejecución, con proveedor, vencimiento, importe bruto, retenciones, neto a pagar, prioridad, cuenta sugerida y estado de firma. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.pagos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ejecución de pagos (`paymentExecutions`) con `total`.
- **Pantallas:** PAN-TES-26 (Bandeja de pagos a ejecutar).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1885 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-62)

<a id="API-TES-63"></a>
#### API-TES-63 · `PUT /api/admin/tes/payment-executions/{id}/instruments`

- **Qué hace:** Instrumentar medios. Reemplaza o configura ejecución de pagos (`paymentExecutions`).
- **Para qué sirve:** RF-TES-006: Administrar tipos de instrumento (valores/medios): descripción, cuenta contable de referencia, si admite carga manual de datos y si admite vuelto. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.pagos.ejecutar`.
- **Recibe:** en la ruta `id`; los datos de ejecución de pagos (`paymentExecutions`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de ejecución de pagos (`paymentExecutions`).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1886 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-63)

<a id="API-TES-64"></a>
#### API-TES-64 · `POST /api/admin/tes/payment-executions/sign`

- **Qué hace:** Firmar (lista de ids; 2FA reciente) Firma sobre ejecución de pagos (`paymentExecutions`).
- **Para qué sirve:** RF-TES-186: Notificar a responsables: rendiciones pendientes, conciliaciones atrasadas, valores por vencer, eCheq por aceptar, pagos por firmar, saldo proyectado bajo mínimo, errores de integración. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.pagos.firmar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-27 (Firma y entrega), PAN-TES-40 (Firma móvil de pagos).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1887 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-64)

<a id="API-TES-65"></a>
#### API-TES-65 · `POST /api/admin/tes/payment-executions/{id}/deliver`

- **Qué hace:** Entregar. Entrega un registro de ejecución de pagos (`paymentExecutions`).
- **Para qué sirve:** RF-TES-118: Entregar la ejecución (al proveedor o al banco) solo si está firmada; entrega masiva con permisos y registro. · RF-TES-067: Entregar valores a proveedores como medio de una ejecución de pago (endoso), pasando a "Entregado a proveedor". *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.pagos.entregar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1888 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-65)

<a id="API-TES-66"></a>
#### API-TES-66 · `POST /api/admin/tes/payment-executions/{id}/void`

- **Qué hace:** Anular. Anula un registro de ejecución de pagos (`paymentExecutions`).
- **Para qué sirve:** RF-TES-112: Impedir anular un pago cuyo efectivo salió de una caja sin anular primero la salida de la caja. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.pagos.anular`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1889 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-66)

<a id="API-TES-67"></a>
#### API-TES-67 · `PATCH /api/admin/tes/payment-executions/{id}/schedule`

- **Qué hace:** Programar fecha. Modifica algunos campos de un registro de ejecución de pagos (`paymentExecutions`) (solo los enviados).
- **Para qué sirve:** RF-TES-149: Programar obligaciones (fecha y cuenta de pago prevista) para OP aprobadas y obligaciones fiscales. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.pagos.ejecutar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de ejecución de pagos (`paymentExecutions`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de ejecución de pagos (`paymentExecutions`).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1890 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-67)

<a id="API-TES-68"></a>
#### API-TES-68 · `GET /api/admin/tes/cash-remittances`

- **Qué hace:** Rendiciones. Lista, con filtros y paginación, los registros de recepción en tesorería de la entrega de caja de M07 (`cashRemittances`).
- **Para qué sirve:** RF-TES-092: Recibir los cupones cobrados en caja (servicio invocado por M07) y, tras aceptar la rendición, dejarlos "En tesorería"; los cupones de tarjetas que no requieren presentación (débito) se presentan automáticamente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.rendiciones.recibir`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de recepción en tesorería de la entrega de caja de M07 (`cashRemittances`) con `total`.
- **Pantallas:** PAN-TES-28 (Rendiciones de cajas de cobranza).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1891 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-68)

<a id="API-TES-69"></a>
#### API-TES-69 · `POST /api/admin/tes/cash-remittances/{id}/start-review`

- **Qué hace:** Transiciones de rendición. Inicia la revisión de un registro de recepción en tesorería de la entrega de caja de M07 (`cashRemittances`).
- **Para qué sirve:** RF-TES-133: Registrar transferencias de fondos desde una caja de tesorería a otra (sucursales) o a bancos, con tránsito. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.rendiciones.recibir`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-28 (Rendiciones de cajas de cobranza).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1892 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-69)

<a id="API-TES-69-b"></a>
#### API-TES-69-b · `POST /api/admin/tes/cash-remittances/{id}/accept`

- **Qué hace:** Transiciones de rendición. Acepta un registro de recepción en tesorería de la entrega de caja de M07 (`cashRemittances`).
- **Para qué sirve:** RF-TES-133: Registrar transferencias de fondos desde una caja de tesorería a otra (sucursales) o a bancos, con tránsito. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.rendiciones.recibir`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-28 (Rendiciones de cajas de cobranza).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1892 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-69-b)

<a id="API-TES-69-c"></a>
#### API-TES-69-c · `POST /api/admin/tes/cash-remittances/{id}/accept-with-difference`

- **Qué hace:** Transiciones de rendición. Acepta con diferencia un registro de recepción en tesorería de la entrega de caja de M07 (`cashRemittances`).
- **Para qué sirve:** RF-TES-133: Registrar transferencias de fondos desde una caja de tesorería a otra (sucursales) o a bancos, con tránsito. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.rendiciones.recibir`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-28 (Rendiciones de cajas de cobranza).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1892 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-69-c)

<a id="API-TES-69-d"></a>
#### API-TES-69-d · `POST /api/admin/tes/cash-remittances/{id}/observe`

- **Qué hace:** Transiciones de rendición. Observa un registro de recepción en tesorería de la entrega de caja de M07 (`cashRemittances`).
- **Para qué sirve:** RF-TES-133: Registrar transferencias de fondos desde una caja de tesorería a otra (sucursales) o a bancos, con tránsito. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.rendiciones.recibir`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-28 (Rendiciones de cajas de cobranza).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1892 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-69-d)

<a id="API-TES-69-e"></a>
#### API-TES-69-e · `POST /api/admin/tes/cash-remittances/{id}/void`

- **Qué hace:** Transiciones de rendición. Anula un registro de recepción en tesorería de la entrega de caja de M07 (`cashRemittances`).
- **Para qué sirve:** RF-TES-133: Registrar transferencias de fondos desde una caja de tesorería a otra (sucursales) o a bancos, con tránsito. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.rendiciones.recibir`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-28 (Rendiciones de cajas de cobranza).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1892 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-69-e)

<a id="API-TES-70"></a>
#### API-TES-70 · `POST /api/admin/tes/treasury-cash-closings`

- **Qué hace:** Cierre / reapertura de caja de tesorería. Da de alta un registro de arqueos de caja de tesorería (`treasuryCashClosings`).
- **Para qué sirve:** RF-TES-111: Cerrar la caja de pagos con arqueo (contado vs teórico), registrar diferencia como quebranto con aprobación y rendir el sobrante a la caja de tesorería. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.cierreCaja.cerrar`.
- **Recibe:** los datos de arqueos de caja de tesorería (`treasuryCashClosings`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de arqueos de caja de tesorería (`treasuryCashClosings`).
- **Pantallas:** PAN-TES-29 (Arqueo y cierre de caja de tesorería).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1893 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-70)

<a id="API-TES-70-b"></a>
#### API-TES-70-b · `POST /api/admin/tes/treasury-cash-closings/{id}/reopen`

- **Qué hace:** Cierre / reapertura de caja de tesorería. Reabre un registro de arqueos de caja de tesorería (`treasuryCashClosings`).
- **Para qué sirve:** RF-TES-111: Cerrar la caja de pagos con arqueo (contado vs teórico), registrar diferencia como quebranto con aprobación y rendir el sobrante a la caja de tesorería. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.cierreCaja.cerrar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-29 (Arqueo y cierre de caja de tesorería).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1893 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-70-b)

<a id="API-TES-71"></a>
#### API-TES-71 · `GET /api/admin/tes/currencies`

- **Qué hace:** Monedas del tenant. Consulta `currencies`.
- **Para qué sirve:** RF-TES-013: Configurar la caja de tesorería por sucursal (una o varias) con monedas admitidas y responsable. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.monedas.configurar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-30 (Monedas y cotizaciones).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1894 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-71)

<a id="API-TES-71-b"></a>
#### API-TES-71-b · `PATCH /api/admin/tes/currencies`

- **Qué hace:** Monedas del tenant. Modifica algunos campos de un registro de `currencies` (solo los enviados).
- **Para qué sirve:** RF-TES-013: Configurar la caja de tesorería por sucursal (una o varias) con monedas admitidas y responsable. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.monedas.configurar`.
- **Recibe:** solo los campos a cambiar; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-30 (Monedas y cotizaciones).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1894 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-71-b)

<a id="API-TES-72"></a>
#### API-TES-72 · `GET /api/admin/tes/exchange-rates`

- **Qué hace:** Cotizaciones. Lista, con filtros y paginación, los registros de cotizaciones (`exchangeRates`).
- **Para qué sirve:** RF-TES-019: Registrar moneda, cotización e importe en moneda de la cuenta y en pesos para cada medio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.cotizaciones.crear`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de cotizaciones (`exchangeRates`) con `total`.
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1895 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-72)

<a id="API-TES-72-b"></a>
#### API-TES-72-b · `POST /api/admin/tes/exchange-rates`

- **Qué hace:** Cotizaciones. Da de alta un registro de cotizaciones (`exchangeRates`).
- **Para qué sirve:** RF-TES-019: Registrar moneda, cotización e importe en moneda de la cuenta y en pesos para cada medio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.cotizaciones.crear`.
- **Recibe:** los datos de cotizaciones (`exchangeRates`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de cotizaciones (`exchangeRates`).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1895 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-72-b)

<a id="API-TES-72-c"></a>
#### API-TES-72-c · `POST /api/admin/tes/exchange-rates/refresh`

- **Qué hace:** Cotizaciones. Actualiza sobre cotizaciones (`exchangeRates`).
- **Para qué sirve:** RF-TES-019: Registrar moneda, cotización e importe en moneda de la cuenta y en pesos para cada medio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.cotizaciones.crear`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1895 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-72-c)

<a id="API-TES-73"></a>
#### API-TES-73 · `GET /api/admin/tes/position`

- **Qué hace:** Posición diaria. Consulta `position`.
- **Para qué sirve:** RF-TES-187: Ofrecer en la PWA de empleado la firma de pagos y la consulta de posición diaria para firmantes y gerencia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.posicion.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-01 (Posición diaria y alertas), PAN-TES-41 (Posición diaria móvil).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1896 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-73)

<a id="API-TES-74"></a>
#### API-TES-74 · `GET /api/admin/tes/cash-flow`

- **Qué hace:** Proyección. Consulta `cash-flow`.
- **Para qué sirve:** RF-TES-172: Previsiones agrupadas y detalladas (flujo de fondos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.flujo.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-32 (Flujo de fondos proyectado).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1897 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-74)

<a id="API-TES-75"></a>
#### API-TES-75 · `POST /api/admin/tes/cash-flow/snapshots`

- **Qué hace:** Guardar snapshot. Da de alta un registro de instantáneas del flujo (`cashFlowSnapshots`).
- **Para qué sirve:** RF-TES-155: Guardar fotografías (snapshots) de la proyección y compararlas con lo realmente ocurrido (desvío por origen). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.flujo.ver`.
- **Recibe:** los datos de instantáneas del flujo (`cashFlowSnapshots`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de instantáneas del flujo (`cashFlowSnapshots`).
- **Pantallas:** PAN-TES-32 (Flujo de fondos proyectado).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1898 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-75)

<a id="API-TES-76"></a>
#### API-TES-76 · `GET /api/admin/tes/scenarios`

- **Qué hace:** Escenarios. Lista, con filtros y paginación, los registros de escenarios de flujo de fondos (`cashFlowScenarios`).
- **Para qué sirve:** RF-TES-172: Previsiones agrupadas y detalladas (flujo de fondos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.flujo.simular`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de escenarios de flujo de fondos (`cashFlowScenarios`) con `total`.
- **Pantallas:** PAN-TES-34 (Escenarios de liquidez).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1899 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-76)

<a id="API-TES-76-b"></a>
#### API-TES-76-b · `POST /api/admin/tes/scenarios`

- **Qué hace:** Escenarios. Da de alta un registro de escenarios de flujo de fondos (`cashFlowScenarios`).
- **Para qué sirve:** RF-TES-172: Previsiones agrupadas y detalladas (flujo de fondos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.flujo.simular`.
- **Recibe:** los datos de escenarios de flujo de fondos (`cashFlowScenarios`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de escenarios de flujo de fondos (`cashFlowScenarios`).
- **Pantallas:** PAN-TES-34 (Escenarios de liquidez).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1899 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-76-b)

<a id="API-TES-76-c"></a>
#### API-TES-76-c · `PATCH /api/admin/tes/scenarios`

- **Qué hace:** Escenarios. Modifica algunos campos de un registro de escenarios de flujo de fondos (`cashFlowScenarios`) (solo los enviados).
- **Para qué sirve:** RF-TES-172: Previsiones agrupadas y detalladas (flujo de fondos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.flujo.simular`.
- **Recibe:** solo los campos a cambiar de escenarios de flujo de fondos (`cashFlowScenarios`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de escenarios de flujo de fondos (`cashFlowScenarios`).
- **Pantallas:** PAN-TES-34 (Escenarios de liquidez).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1899 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-76-c)

<a id="API-TES-77"></a>
#### API-TES-77 · `GET /api/admin/tes/planned-items`

- **Qué hace:** Previsiones. Consulta `planned-items`.
- **Para qué sirve:** RF-TES-172: Previsiones agrupadas y detalladas (flujo de fondos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.previsiones.crear`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-33 (Previsiones y compromisos).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1900 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-77)

<a id="API-TES-77-b"></a>
#### API-TES-77-b · `POST /api/admin/tes/planned-items`

- **Qué hace:** Previsiones. Registra un nuevo elemento u operación en `planned-items`.
- **Para qué sirve:** RF-TES-172: Previsiones agrupadas y detalladas (flujo de fondos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.previsiones.crear`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-33 (Previsiones y compromisos).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1900 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-77-b)

<a id="API-TES-77-c"></a>
#### API-TES-77-c · `PATCH /api/admin/tes/planned-items`

- **Qué hace:** Previsiones. Modifica algunos campos de un registro de `planned-items` (solo los enviados).
- **Para qué sirve:** RF-TES-172: Previsiones agrupadas y detalladas (flujo de fondos). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.previsiones.crear`.
- **Recibe:** solo los campos a cambiar; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-33 (Previsiones y compromisos).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1900 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-77-c)

<a id="API-TES-78"></a>
#### API-TES-78 · `GET /api/admin/tes/commitments`

- **Qué hace:** Compromisos. Lista, con filtros y paginación, los registros de compromisos de fondos (`fundCommitments`).
- **Para qué sirve:** RF-TES-156: Registrar compromisos de fondos al aprobarse una OC o contrato en M12, o manualmente, con importe, moneda, fecha esperada de pago, servicio, centro de costo y referencia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.compromisos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de compromisos de fondos (`fundCommitments`) con `total`.
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1901 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-78)

<a id="API-TES-78-b"></a>
#### API-TES-78-b · `POST /api/admin/tes/commitments`

- **Qué hace:** Compromisos. Da de alta un registro de compromisos de fondos (`fundCommitments`).
- **Para qué sirve:** RF-TES-157: Consumir el compromiso cuando se registra la factura (pasa a obligación) y cuando se paga; liberarlo al cancelar la OC sin inventar un ingreso. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.compromisos.liberar`.
- **Recibe:** los datos de compromisos de fondos (`fundCommitments`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de compromisos de fondos (`fundCommitments`).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1901 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-78-b)

<a id="API-TES-78-c"></a>
#### API-TES-78-c · `POST /api/admin/tes/commitments/{id}/release`

- **Qué hace:** Compromisos. Libera un registro de compromisos de fondos (`fundCommitments`).
- **Para qué sirve:** RF-TES-157: Consumir el compromiso cuando se registra la factura (pasa a obligación) y cuando se paga; liberarlo al cancelar la OC sin inventar un ingreso. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.compromisos.liberar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1901 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-78-c)

<a id="API-TES-79"></a>
#### API-TES-79 · `GET /api/admin/tes/payroll-batches`

- **Qué hace:** Lotes de haberes (detalle con tes.haberes.verDetalle) Consulta `payroll-batches`.
- **Para qué sirve:** RF-TES-147: Proyectar pagos a partir de facturas de proveedores con saldo por vencimiento (M12), OP aprobadas no ejecutadas, cheques propios y eCheq diferidos no debitados, obligaciones fiscales (M06), lotes de haberes (M16), previsiones… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.haberes.ejecutar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-35 (Lotes de pago de haberes).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1902 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-79)

<a id="API-TES-79-b"></a>
#### API-TES-79-b · `GET /api/admin/tes/payroll-batches/{id}`

- **Qué hace:** Lotes de haberes (detalle con tes.haberes.verDetalle) Obtiene el detalle de un registro de `payroll-batches`.
- **Para qué sirve:** RF-TES-147: Proyectar pagos a partir de facturas de proveedores con saldo por vencimiento (M12), OP aprobadas no ejecutadas, cheques propios y eCheq diferidos no debitados, obligaciones fiscales (M06), lotes de haberes (M16), previsiones… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.haberes.ejecutar`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-35 (Lotes de pago de haberes).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1902 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-79-b)

<a id="API-TES-80"></a>
#### API-TES-80 · `POST /api/admin/tes/payroll-batches/{id}/generate-files`

- **Qué hace:** Acciones del lote. Registra «generate-files» sobre un registro de `generate-files`; el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-TES-160: Recibir el lote de pago de haberes aprobado por M16 (empleado, neto, cuentas de acreditación con porcentajes) como obligación a ejecutar, sin simular facturas de proveedor. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.haberes.ejecutar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-TES-35 (Lotes de pago de haberes).
- **Ola:** O9 · **Fuente:** M14 §11. API, línea 1903 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-80)

<a id="API-TES-80-b"></a>
#### API-TES-80-b · `POST /api/admin/tes/payroll-batches/{id}/sent`

- **Qué hace:** Acciones del lote. Registra «sent» sobre un registro de `sent`; el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-TES-160: Recibir el lote de pago de haberes aprobado por M16 (empleado, neto, cuentas de acreditación con porcentajes) como obligación a ejecutar, sin simular facturas de proveedor. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.haberes.ejecutar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-TES-35 (Lotes de pago de haberes).
- **Ola:** O9 · **Fuente:** M14 §11. API, línea 1903 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-80-b)

<a id="API-TES-80-c"></a>
#### API-TES-80-c · `POST /api/admin/tes/payroll-batches/{id}/response`

- **Qué hace:** Acciones del lote. Registra «response» sobre un registro de `response`; el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-TES-160: Recibir el lote de pago de haberes aprobado por M16 (empleado, neto, cuentas de acreditación con porcentajes) como obligación a ejecutar, sin simular facturas de proveedor. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.haberes.ejecutar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-TES-35 (Lotes de pago de haberes).
- **Ola:** O9 · **Fuente:** M14 §11. API, línea 1903 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-80-c)

<a id="API-TES-80-d"></a>
#### API-TES-80-d · `POST /api/admin/tes/payroll-batches/{id}/reprocess`

- **Qué hace:** Acciones del lote. Reprocesa un registro de `reprocess`; el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-TES-160: Recibir el lote de pago de haberes aprobado por M16 (empleado, neto, cuentas de acreditación con porcentajes) como obligación a ejecutar, sin simular facturas de proveedor. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.haberes.ejecutar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-TES-35 (Lotes de pago de haberes).
- **Ola:** O9 · **Fuente:** M14 §11. API, línea 1903 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-80-d)

<a id="API-TES-80-e"></a>
#### API-TES-80-e · `POST /api/admin/tes/payroll-batches/{id}/void`

- **Qué hace:** Acciones del lote. Anula un registro de `void`; el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-TES-160: Recibir el lote de pago de haberes aprobado por M16 (empleado, neto, cuentas de acreditación con porcentajes) como obligación a ejecutar, sin simular facturas de proveedor. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.haberes.ejecutar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-TES-35 (Lotes de pago de haberes).
- **Ola:** O9 · **Fuente:** M14 §11. API, línea 1903 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-80-e)

<a id="API-TES-81"></a>
#### API-TES-81 · `GET /api/admin/tes/reports/{reportKey}`

- **Qué hace:** Ejecutar informe (formato por Accept) Obtiene el detalle de un registro de `reports`.
- **Para qué sirve:** RF-TES-002: Registrar en cada cuenta bancaria: entidad, sucursal, tipo, número, CBU (validado con dígitos verificadores), alias, CUIT del titular, moneda, fecha y saldo inicial, cuenta contable de referencia, cuenta contable pendiente de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.informes.ver`.
- **Recibe:** en la ruta `reportKey`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-36 (Catálogo de informes).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1904 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-81)

<a id="API-TES-82"></a>
#### API-TES-82 · `GET /api/admin/tes/settings`

- **Qué hace:** Parámetros (versionados T04) Lista, con filtros y paginación, los registros de parámetros de tesorería (`treasurySettings`).
- **Para qué sirve:** RF-TES-144: Usar la moneda por defecto configurada al cargar medios en caja y tesorería. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.configuracion.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de parámetros de tesorería (`treasurySettings`) con `total`.
- **Pantallas:** PAN-TES-31 (Tipos de instrumento), PAN-TES-39 (Parámetros de tesorería).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1905 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-82)

<a id="API-TES-82-b"></a>
#### API-TES-82-b · `PUT /api/admin/tes/settings`

- **Qué hace:** Parámetros (versionados T04) Reemplaza o configura parámetros de tesorería (`treasurySettings`).
- **Para qué sirve:** RF-TES-144: Usar la moneda por defecto configurada al cargar medios en caja y tesorería. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.configuracion.configurar`.
- **Recibe:** los datos de parámetros de tesorería (`treasurySettings`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de parámetros de tesorería (`treasurySettings`).
- **Pantallas:** PAN-TES-31 (Tipos de instrumento), PAN-TES-39 (Parámetros de tesorería).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1905 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-82-b)

<a id="API-TES-83"></a>
#### API-TES-83 · `POST /api/admin/tes/periods/{module}/close`

- **Qué hace:** Cierre de períodos. Cierra un registro de `close`.
- **Para qué sirve:** RF-TES-138: Reabrir un cierre de caja de tesorería con permiso de supervisor, motivo y auditoría, solo si el período no está cerrado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.periodos.cerrar`.
- **Recibe:** en la ruta `module`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-42 (Cierre de períodos de Tesorería y Bancos).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1906 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-83)

<a id="API-TES-83-b"></a>
#### API-TES-83-b · `POST /api/admin/tes/periods/{module}/reopen`

- **Qué hace:** Cierre de períodos. Reabre un registro de `reopen`.
- **Para qué sirve:** RF-TES-138: Reabrir un cierre de caja de tesorería con permiso de supervisor, motivo y auditoría, solo si el período no está cerrado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.periodos.cerrar`.
- **Recibe:** en la ruta `module`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-42 (Cierre de períodos de Tesorería y Bancos).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1906 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-83-b)

<a id="API-TES-84"></a>
#### API-TES-84 · `GET /api/admin/tes/exceptions`

- **Qué hace:** Bandeja de excepciones. Lista, con filtros y paginación, los registros de `exceptions`.
- **Para qué sirve:** RF-TES-188: Bandeja técnica/operativa de excepciones de tesorería: eventos no procesados, archivos sin respuesta, líneas sin clasificar, acreditaciones no identificadas, diferencias de rendición. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `tes.movimientos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ResultadoGenerico (`ResultadoGenerico`) con `total`.
- **Pantallas:** PAN-TES-06 (Libro unificado de movimientos y operaciones), PAN-TES-07 (Libro de bancos / tesorería), PAN-TES-37 (Detalle de operación) y 1 más.
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1907 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-84)

<a id="API-TES-85"></a>
#### API-TES-85 · `GET /api/tes/signatures/pending`

- **Qué hace:** PWA empleado: pendientes y firma. Consulta `pending`.
- **Para qué sirve:** RF-TES-187: Ofrecer en la PWA de empleado la firma de pagos y la consulta de posición diaria para firmantes y gerencia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `tes.pagos.firmar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-27 (Firma y entrega), PAN-TES-40 (Firma móvil de pagos).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1908 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-85)

<a id="API-TES-85-b"></a>
#### API-TES-85-b · `POST /api/tes/signatures`

- **Qué hace:** PWA empleado: pendientes y firma. Registra un nuevo elemento u operación en `signatures`.
- **Para qué sirve:** RF-TES-187: Ofrecer en la PWA de empleado la firma de pagos y la consulta de posición diaria para firmantes y gerencia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `tes.pagos.firmar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-27 (Firma y entrega), PAN-TES-40 (Firma móvil de pagos).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1908 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-85-b)

<a id="API-TES-86"></a>
#### API-TES-86 · `GET /api/tes/position`

- **Qué hace:** PWA empleado: posición. Consulta `position`.
- **Para qué sirve:** RF-TES-187: Ofrecer en la PWA de empleado la firma de pagos y la consulta de posición diaria para firmantes y gerencia. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `tes.posicion.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-01 (Posición diaria y alertas), PAN-TES-41 (Posición diaria móvil).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1909 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-86)

<a id="API-TES-87"></a>
#### API-TES-87 · `GET /api/v1/ext/tes/position`

- **Qué hace:** APIs para terceros/BI (T10) sin datos de haberes individuales. Consulta `position`.
- **Para qué sirve:** RF-TES-164: Restringir la visualización de importes individuales de haberes a usuarios con permiso específico. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); permiso `tes.posicion.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-01 (Posición diaria y alertas), PAN-TES-41 (Posición diaria móvil).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1910 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-87)

<a id="API-TES-87-b"></a>
#### API-TES-87-b · `GET /api/v1/ext/tes/cash-flow`

- **Qué hace:** APIs para terceros/BI (T10) sin datos de haberes individuales. Consulta `cash-flow`.
- **Para qué sirve:** RF-TES-164: Restringir la visualización de importes individuales de haberes a usuarios con permiso específico. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); permiso `tes.posicion.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-TES-01 (Posición diaria y alertas), PAN-TES-41 (Posición diaria móvil).
- **Ola:** O8 · **Fuente:** M14 §11. API, línea 1910 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-87-b)

<a id="API-TES-87-c"></a>
#### API-TES-87-c · `GET /api/v1/ext/tes/movements`

- **Qué hace:** APIs para terceros/BI (T10) sin datos de haberes individuales. Lista, con filtros y paginación, los registros de libro único de movimientos de fondos (`treasuryMovements`).
- **Para qué sirve:** RF-TES-164: Restringir la visualización de importes individuales de haberes a usuarios con permiso específico. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); permiso `tes.posicion.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de libro único de movimientos de fondos (`treasuryMovements`) con `total`.
- **Pantallas:** PAN-TES-01 (Posición diaria y alertas), PAN-TES-41 (Posición diaria móvil).
- **Ola:** O5 · **Fuente:** M14 §11. API, línea 1910 · [Ver en Swagger](../18-swagger/index.html?api=m14-tes#/API/API-TES-87-c)
