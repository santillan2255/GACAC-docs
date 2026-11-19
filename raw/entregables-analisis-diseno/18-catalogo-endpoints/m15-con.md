# Catálogo de endpoints · M15 · Contabilidad, centros de costo, múltiples planes de cuentas, escenarios simulados y presupuestos

Parte del [catálogo de endpoints](../18-catalogo-endpoints.md) (artefacto 7.1). Generado el 05-11-2026 con `_trabajo/gen_18_catalogo_endpoints.py` a partir de `18-openapi/`; no se edita a mano.

## Para qué sirve esta API

Registrar, explicar y exponer el efecto económico de todas las operaciones de cada cooperativa (tenant), de modo que:

1. Cada evento económico de cualquier módulo (facturación, cobranza, pagos, compras, stock, bienes de uso, sueldos, mora e intereses, financiaciones, capital social, tesorería, fiscal, fabricación, vivienda y obras, ajustes) genere su asiento en partida doble una sola vez, con reglas de imputación configurables por servicio, concepto, medio de pago, centro de costo y demás dimensiones, en tiempo…
2. La contabilidad pueda reconciliarse siempre con los auxiliares comerciales (cuenta corriente por asociado y servicio), financieros (caja, bancos, valores), de proveedores, fiscales, de stock, de bienes de uso, de sueldos y de capital, y se pueda recorrer desde un informe hasta el asiento, el documento y la operación de origen, y en sentido inverso (BASE §22, §75, §78; AGR-011).
3. Cada cooperativa administre su plan de cuentas, sus ejercicios y períodos con bloqueo y reapertura controlada, sus centros de costo (secciones) con asignaciones, grupos y distribución de costos comunes, y obtenga mayor, sumas y saldos, balances, estados contables en formato INAES, estado de resultados por sección, ajuste por inflación y libros para rubricar (DFA M19; RN-08 §5).
4. Se puedan mantener varios planes de cuentas por cooperativa con equivalencias y escenarios simulados completamente separados de los registros oficiales (BASE §55, §75).
5. Se presupueste por cuenta, centro de costo y servicio, se controlen los compromisos de fondos y se compare presupuesto, comprometido, devengado y pagado sin mezclarlos (AGR-028).
6. El capital social y los excedentes cooperativos tengan su tratamiento contable diferenciado del precio de los servicios, en coordinación con M17 (BASE §97.7, MER-011, AGR-029).

Detalle completo en el anexo M15, sección 1. Contrato navegable: [Swagger](../18-swagger/index.html?api=m15-con).

| Dato | Valor |
|---|---|
| Endpoints | 135 |
| Por método | DELETE 1, GET 41, PATCH 15, POST 72, PUT 6 |
| Grupos funcionales | 1 |
| Con requisito citado en el anexo | 0 |
| Con requisito inferido (a confirmar) | 125 |
| Sin requisito identificable | 10 |

## Grupos funcionales

| Grupo | Endpoints | Qué agrupa (primeros endpoints) |
|---|---|---|
| [API](#grupo-1) | 135 | Configuración vigente y versiones.; Guardar borrador.; Validar y publicar versión.… |

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

135 endpoints.

| API-ID | Método | Ruta | Qué hace |
|---|---|---|---|
| [API-CON-01](#API-CON-01) | GET | `/api/admin/con/settings` | Configuración vigente y versiones. |
| [API-CON-02](#API-CON-02) | PUT | `/api/admin/con/settings/draft` | Guardar borrador. |
| [API-CON-03](#API-CON-03) | POST | `/api/admin/con/settings/publish` | Validar y publicar versión. |
| [API-CON-04](#API-CON-04) | GET | `/api/admin/con/charts` | Listar planes. |
| [API-CON-05](#API-CON-05) | POST | `/api/admin/con/charts` | Crear plan (vacío, copia o plantilla) |
| [API-CON-06](#API-CON-06) | PATCH | `/api/admin/con/charts/{id}` | Editar plan en borrador. |
| [API-CON-07](#API-CON-07) | POST | `/api/admin/con/charts/{id}/approve` | Aprobar. |
| [API-CON-08](#API-CON-08) | POST | `/api/admin/con/charts/{id}/promote` | Promover a operativo para un ejercicio. |
| [API-CON-09](#API-CON-09) | POST | `/api/admin/con/charts/{id}/archive` | Archivar. |
| [API-CON-10](#API-CON-10) | GET | `/api/admin/con/charts/{id}/accounts` | Árbol o lista de cuentas con filtros. |
| [API-CON-11](#API-CON-11) | POST | `/api/admin/con/charts/{id}/accounts` | Alta de cuenta. |
| [API-CON-12](#API-CON-12) | PATCH | `/api/admin/con/accounts/{id}` | Editar / inactivar cuenta. |
| [API-CON-13](#API-CON-13) | POST | `/api/admin/con/accounts/{id}/renumber` | Cambiar código visible. |
| [API-CON-14](#API-CON-14) | POST | `/api/admin/con/accounts/merge` | Unificar cuentas (vista previa con dryRun) |
| [API-CON-15](#API-CON-15) | GET | `/api/admin/con/charts/{id}/rubrics` | Rubros y subrubros. |
| [API-CON-15-b](#API-CON-15-b) | POST | `/api/admin/con/charts/{id}/rubrics` | Rubros y subrubros. |
| [API-CON-15-c](#API-CON-15-c) | PATCH | `/api/admin/con/charts/{id}/rubrics` | Rubros y subrubros. |
| [API-CON-16](#API-CON-16) | GET | `/api/admin/con/charts/{id}/roles` | Roles de cuenta con estado. |
| [API-CON-17](#API-CON-17) | PUT | `/api/admin/con/charts/{id}/roles/{roleKey}` | Asignar cuenta y overrides. |
| [API-CON-18](#API-CON-18) | GET | `/api/admin/con/posting-rules` | Listar reglas. |
| [API-CON-19](#API-CON-19) | POST | `/api/admin/con/posting-rules` | Crear regla. |
| [API-CON-20](#API-CON-20) | PATCH | `/api/admin/con/posting-rules/{id}` | Nueva versión / retirar. |
| [API-CON-21](#API-CON-21) | POST | `/api/admin/con/posting-rules/simulate` | Simular asiento para un evento o documento. |
| [API-CON-22](#API-CON-22) | GET | `/api/admin/con/posting-rules/overlaps` | Detectar solapamientos. |
| [API-CON-23](#API-CON-23) | GET | `/api/admin/con/entity-accounts` | Cuentas asignadas por tipo de entidad (filtro sin asignar) |
| [API-CON-24](#API-CON-24) | POST | `/api/admin/con/entity-accounts/bulk` | Asignación/reasignación masiva (dryRun) |
| [API-CON-25](#API-CON-25) | GET | `/api/admin/con/fiscal-years` | Ejercicios. |
| [API-CON-25-b](#API-CON-25-b) | POST | `/api/admin/con/fiscal-years` | Ejercicios. |
| [API-CON-26](#API-CON-26) | POST | `/api/admin/con/fiscal-years/{id}/open` | Abrir ejercicio. |
| [API-CON-27](#API-CON-27) | POST | `/api/admin/con/fiscal-years/{id}/closing-preview` | Generar borradores de cierre y apertura. |
| [API-CON-28](#API-CON-28) | POST | `/api/admin/con/fiscal-years/{id}/close` | Confirmar cierre. |
| [API-CON-29](#API-CON-29) | POST | `/api/admin/con/fiscal-years/{id}/reopen` | Solicitar/ejecutar reapertura (doble aprobación) |
| [API-CON-30](#API-CON-30) | GET | `/api/admin/con/result-targets` | Cuentas de resultado. |
| [API-CON-30-b](#API-CON-30-b) | POST | `/api/admin/con/result-targets` | Cuentas de resultado. |
| [API-CON-30-c](#API-CON-30-c) | PATCH | `/api/admin/con/result-targets` | Cuentas de resultado. |
| [API-CON-31](#API-CON-31) | GET | `/api/admin/con/periods` | Matriz de períodos y bloqueos. |
| [API-CON-32](#API-CON-32) | POST | `/api/admin/con/periods/{id}/locks` | Bloquear/desbloquear módulo hasta fecha. |
| [API-CON-33](#API-CON-33) | POST | `/api/admin/con/periods/{id}/close` | Cerrar período (valida checklist) |
| [API-CON-34](#API-CON-34) | POST | `/api/admin/con/periods/{id}/reopen` | Solicitar reapertura con motivo y plazo. |
| [API-CON-35](#API-CON-35) | GET | `/api/con/period-guard` | Consulta si una fecha está abierta para un módulo. |
| [API-CON-36](#API-CON-36) | GET | `/api/admin/con/entries` | Diario con filtros. |
| [API-CON-38](#API-CON-38) | POST | `/api/admin/con/entries` | Crear asiento manual (borrador) |
| [API-CON-37](#API-CON-37) | GET | `/api/admin/con/entries/{id}` | Asiento con renglones, resolución y vínculos. |
| [API-CON-40](#API-CON-40) | DELETE | `/api/admin/con/entries/{id}` | Eliminar borrador (solo draft) |
| [API-CON-39](#API-CON-39) | PATCH | `/api/admin/con/entries/{id}` | Editar borrador. |
| [API-CON-41](#API-CON-41) | POST | `/api/admin/con/entries/{id}/submit` | Enviar a aprobación. |
| [API-CON-42](#API-CON-42) | POST | `/api/admin/con/entries/{id}/post` | Contabilizar. |
| [API-CON-43](#API-CON-43) | POST | `/api/admin/con/entries/{id}/approve` | Aprobar o rechazar. |
| [API-CON-44](#API-CON-44) | POST | `/api/admin/con/entries/{id}/void` | Anular (período abierto, no transcripto) |
| [API-CON-45](#API-CON-45) | POST | `/api/admin/con/entries/{id}/reverse` | Contraasiento con fecha. |
| [API-CON-46](#API-CON-46) | POST | `/api/admin/con/entries/{id}/attachments` | Adjuntar respaldo (URL firmada) |
| [API-CON-47](#API-CON-47) | POST | `/api/admin/con/entries/import` | Importar archivo (validar / confirmar) |
| [API-CON-48](#API-CON-48) | POST | `/api/admin/con/entries/bulk-void` | Anulación masiva (dryRun) → JOB-CON-17. |
| [API-CON-49](#API-CON-49) | POST | `/api/admin/con/entries/renumber` | Renumeración → JOB-CON-16. |
| [API-CON-50](#API-CON-50) | GET | `/api/admin/con/entry-templates` | Plantillas. |
| [API-CON-50-b](#API-CON-50-b) | POST | `/api/admin/con/entry-templates` | Plantillas. |
| [API-CON-50-c](#API-CON-50-c) | PATCH | `/api/admin/con/entry-templates` | Plantillas. |
| [API-CON-51](#API-CON-51) | POST | `/api/admin/con/entry-templates/{id}/generate` | Generar asiento desde plantilla. |
| [API-CON-52](#API-CON-52) | GET | `/api/admin/con/events` | Bandeja de eventos. |
| [API-CON-53](#API-CON-53) | GET | `/api/admin/con/events/{id}` | Evento con contrato y faltantes. |
| [API-CON-54](#API-CON-54) | POST | `/api/admin/con/events/reprocess` | Reprocesar seleccionados o por causa. |
| [API-CON-55](#API-CON-55) | POST | `/api/admin/con/events/{id}/ignore` | Ignorar con motivo. |
| [API-CON-57](#API-CON-57) | GET | `/api/admin/con/posting-batches` | Lotes y resultado. |
| [API-CON-56](#API-CON-56) | POST | `/api/admin/con/posting-batches` | Crear lote (vista previa) → JOB-CON-02. |
| [API-CON-57-b](#API-CON-57-b) | GET | `/api/admin/con/posting-batches/{id}` | Lotes y resultado. |
| [API-CON-58](#API-CON-58) | POST | `/api/admin/con/posting-batches/{id}/confirm` | Confirmar. |
| [API-CON-59](#API-CON-59) | POST | `/api/admin/con/posting-batches/{id}/discard` | Descartar. |
| [API-CON-60](#API-CON-60) | GET | `/api/admin/con/reports/{reportKey}` | Informes (§15) con parámetros; format=json/pdf/xlsx/csv (exportar exige con.reportes.exportar) |
| [API-CON-61](#API-CON-61) | POST | `/api/admin/con/rubricated-books` | Libros y transcripción → JOB-CON-18. |
| [API-CON-61-b](#API-CON-61-b) | POST | `/api/admin/con/rubricated-books/{id}/transcriptions` | Libros y transcripción → JOB-CON-18. |
| [API-CON-62](#API-CON-62) | GET | `/api/admin/con/cost-centers` | Centros y grupos. |
| [API-CON-62-b](#API-CON-62-b) | POST | `/api/admin/con/cost-centers` | Centros y grupos. |
| [API-CON-62-c](#API-CON-62-c) | PATCH | `/api/admin/con/cost-centers` | Centros y grupos. |
| [API-CON-62-d](#API-CON-62-d) | GET | `/api/admin/con/cost-center-groups` | Centros y grupos. |
| [API-CON-62-e](#API-CON-62-e) | POST | `/api/admin/con/cost-center-groups` | Centros y grupos. |
| [API-CON-62-f](#API-CON-62-f) | PATCH | `/api/admin/con/cost-center-groups` | Centros y grupos. |
| [API-CON-63](#API-CON-63) | GET | `/api/admin/con/cost-allocation-rules` | Reglas de asignación a centros. |
| [API-CON-63-b](#API-CON-63-b) | POST | `/api/admin/con/cost-allocation-rules` | Reglas de asignación a centros. |
| [API-CON-63-c](#API-CON-63-c) | PATCH | `/api/admin/con/cost-allocation-rules` | Reglas de asignación a centros. |
| [API-CON-63-d](#API-CON-63-d) | POST | `/api/admin/con/cost-allocation-rules/bulk` | Reglas de asignación a centros. |
| [API-CON-64](#API-CON-64) | GET | `/api/admin/con/distribution-models` | Modelos de distribución. |
| [API-CON-64-b](#API-CON-64-b) | POST | `/api/admin/con/distribution-models` | Modelos de distribución. |
| [API-CON-64-c](#API-CON-64-c) | PATCH | `/api/admin/con/distribution-models` | Modelos de distribución. |
| [API-CON-65](#API-CON-65) | POST | `/api/admin/con/distribution-runs` | Corrida de distribución → JOB-CON-07. |
| [API-CON-65-b](#API-CON-65-b) | POST | `/api/admin/con/distribution-runs/{id}/finalize` | Corrida de distribución → JOB-CON-07. |
| [API-CON-66-b](#API-CON-66-b) | GET | `/api/admin/con/reconciliations` | Ejecutar y consultar conciliaciones → JOB-CON-08. |
| [API-CON-66](#API-CON-66) | POST | `/api/admin/con/reconciliations` | Ejecutar y consultar conciliaciones → JOB-CON-08. |
| [API-CON-67](#API-CON-67) | PATCH | `/api/admin/con/reconciliations/{id}/differences/{diffId}` | Explicar diferencia. |
| [API-CON-68](#API-CON-68) | GET | `/api/admin/con/inflation-series` | Series e índices (importación) |
| [API-CON-68-c](#API-CON-68-c) | PUT | `/api/admin/con/inflation-series` | Series e índices (importación) |
| [API-CON-68-b](#API-CON-68-b) | POST | `/api/admin/con/inflation-series` | Series e índices (importación) |
| [API-CON-68-d](#API-CON-68-d) | POST | `/api/admin/con/inflation-series/values` | Series e índices (importación) |
| [API-CON-69](#API-CON-69) | POST | `/api/admin/con/inflation-runs` | Ajuste por inflación → JOB-CON-06. |
| [API-CON-69-b](#API-CON-69-b) | POST | `/api/admin/con/inflation-runs/{id}/post` | Ajuste por inflación → JOB-CON-06. |
| [API-CON-69-c](#API-CON-69-c) | POST | `/api/admin/con/inflation-runs/{id}/reverse` | Ajuste por inflación → JOB-CON-06. |
| [API-CON-70](#API-CON-70) | GET | `/api/admin/con/account-mappings` | Equivalencias y reconstrucción de proyección. |
| [API-CON-70-c](#API-CON-70-c) | PUT | `/api/admin/con/account-mappings` | Equivalencias y reconstrucción de proyección. |
| [API-CON-70-b](#API-CON-70-b) | POST | `/api/admin/con/account-mappings` | Equivalencias y reconstrucción de proyección. |
| [API-CON-70-d](#API-CON-70-d) | POST | `/api/admin/con/account-mappings/import` | Equivalencias y reconstrucción de proyección. |
| [API-CON-70-e](#API-CON-70-e) | POST | `/api/admin/con/account-mappings/rebuild` | Equivalencias y reconstrucción de proyección. |
| [API-CON-71](#API-CON-71) | GET | `/api/admin/con/scenarios` | Escenarios. |
| [API-CON-71-b](#API-CON-71-b) | POST | `/api/admin/con/scenarios` | Escenarios. |
| [API-CON-71-c](#API-CON-71-c) | PATCH | `/api/admin/con/scenarios` | Escenarios. |
| [API-CON-72](#API-CON-72) | POST | `/api/admin/con/scenarios/{id}/run` | Ejecutar simulación → JOB-CON-09. |
| [API-CON-73](#API-CON-73) | GET | `/api/admin/con/scenarios/{id}/compare` | Comparar con real. |
| [API-CON-74](#API-CON-74) | GET | `/api/admin/con/budgets` | Presupuestos. |
| [API-CON-74-b](#API-CON-74-b) | POST | `/api/admin/con/budgets` | Presupuestos. |
| [API-CON-74-c](#API-CON-74-c) | PATCH | `/api/admin/con/budgets` | Presupuestos. |
| [API-CON-74-d](#API-CON-74-d) | POST | `/api/admin/con/budgets/lines` | Presupuestos. |
| [API-CON-74-e](#API-CON-74-e) | POST | `/api/admin/con/budgets/import` | Presupuestos. |
| [API-CON-75](#API-CON-75) | POST | `/api/admin/con/budgets/{id}/submit` | Ciclo de aprobación. |
| [API-CON-75-b](#API-CON-75-b) | POST | `/api/admin/con/budgets/{id}/approve` | Ciclo de aprobación. |
| [API-CON-75-c](#API-CON-75-c) | POST | `/api/admin/con/budgets/{id}/reformulate` | Ciclo de aprobación. |
| [API-CON-76](#API-CON-76) | GET | `/api/admin/con/budgets/{id}/execution` | Ejecución presupuestaria. |
| [API-CON-77](#API-CON-77) | GET | `/api/con/budget-check` | Disponible para una imputación prevista (cuenta, centro, servicio, mes, importe) |
| [API-CON-78](#API-CON-78) | POST | `/api/admin/con/commitments/{id}/authorize-excess` | Autorizar exceso / liberar. |
| [API-CON-78-b](#API-CON-78-b) | POST | `/api/admin/con/commitments/{id}/release` | Autorizar exceso / liberar. |
| [API-CON-79](#API-CON-79) | GET | `/api/admin/con/statement-templates` | Plantillas de estados. |
| [API-CON-79-b](#API-CON-79-b) | POST | `/api/admin/con/statement-templates` | Plantillas de estados. |
| [API-CON-79-c](#API-CON-79-c) | PATCH | `/api/admin/con/statement-templates` | Plantillas de estados. |
| [API-CON-80](#API-CON-80) | POST | `/api/admin/con/statement-runs` | Estados contables → JOB-CON-15. |
| [API-CON-80-b](#API-CON-80-b) | POST | `/api/admin/con/statement-runs/{id}/approve` | Estados contables → JOB-CON-15. |
| [API-CON-80-c](#API-CON-80-c) | POST | `/api/admin/con/statement-runs/{id}/issue` | Estados contables → JOB-CON-15. |
| [API-CON-81](#API-CON-81) | GET | `/api/admin/con/external/mappings` | Mapeo sistema externo. |
| [API-CON-81-b](#API-CON-81-b) | PUT | `/api/admin/con/external/mappings` | Mapeo sistema externo. |
| [API-CON-82](#API-CON-82) | POST | `/api/admin/con/external/exports` | Exportar / importar → JOB-CON-12 / JOB-CON-13. |
| [API-CON-82-b](#API-CON-82-b) | POST | `/api/admin/con/external/imports` | Exportar / importar → JOB-CON-12 / JOB-CON-13. |
| [API-CON-83](#API-CON-83) | GET | `/api/admin/con/capital-rubrics` | Rubros de capital. |
| [API-CON-83-b](#API-CON-83-b) | PUT | `/api/admin/con/capital-rubrics` | Rubros de capital. |
| [API-CON-84](#API-CON-84) | GET | `/api/admin/con/health` | Hallazgos de salud de configuración. |
| [API-CON-85](#API-CON-85) | GET | `/api/con/linked-entry` | Asiento(s) vinculado(s) a un documento. |
| [API-CON-86](#API-CON-86) | GET | `/api/con/accounts/lookup` | Búsqueda de cuentas imputables del plan operativo (para asignaciones) |
| [API-CON-87](#API-CON-87) | GET | `/api/admin/con/dashboard` | Indicadores del tablero. |
| [API-CON-88](#API-CON-88) | GET | `/api/v1/ext/con/balances` | Sumas y saldos por período (solo lectura, para estudio contable o BI) |
| [API-CON-89](#API-CON-89) | GET | `/api/v1/ext/con/entries` | Asientos contabilizados por rango (solo lectura, paginado) |

<a id="API-CON-01"></a>
#### API-CON-01 · `GET /api/admin/con/settings`

- **Qué hace:** Configuración vigente y versiones. Lista, con filtros y paginación, los registros de parámetros contables (`accountingSettings`).
- **Para qué sirve:** RF-CON-053: Reglas de imputación configurables por tipo de evento y rol de importe con condiciones por cualquier dimensión, vigencia, versión y prioridad; cuenta y, opcionalmente, centro o modelo de distribución. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.config.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de parámetros contables (`accountingSettings`) con `total`.
- **Pantallas:** PAN-CON-02 (Configuración contable), PAN-CON-40 (Salud de la configuración contable).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1886 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-01)

<a id="API-CON-02"></a>
#### API-CON-02 · `PUT /api/admin/con/settings/draft`

- **Qué hace:** Guardar borrador. Reemplaza o configura parámetros contables (`accountingSettings`).
- **Para qué sirve:** RF-CON-157: Tablero contable con estado de períodos, eventos pendientes, borradores, conciliaciones con diferencias, alertas de configuración y vencimientos de cierre. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.config.configurar`.
- **Recibe:** los datos de parámetros contables (`accountingSettings`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de parámetros contables (`accountingSettings`).
- **Pantallas:** PAN-CON-02 (Configuración contable).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1887 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-02)

<a id="API-CON-03"></a>
#### API-CON-03 · `POST /api/admin/con/settings/publish`

- **Qué hace:** Validar y publicar versión. Publica sobre parámetros contables (`accountingSettings`).
- **Para qué sirve:** RF-CON-005: Validador de salud de la configuración contable ("cuentas sin asignar"): lista cada rol, regla, entidad o combinación de dimensiones sin cuenta resoluble, con el enlace a la pantalla donde se configura; corre a demanda, al… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.config.configurar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CON-02 (Configuración contable).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1888 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-03)

<a id="API-CON-04"></a>
#### API-CON-04 · `GET /api/admin/con/charts`

- **Qué hace:** Listar planes. Lista, con filtros y paginación, los registros de `charts`.
- **Para qué sirve:** RF-CON-103: Equivalencias de cuentas entre planes (1:1, 1:N con porcentajes que suman 100 %, N:1), con vigencia y validación de completitud. · RF-CON-007: Crear, copiar, versionar y administrar varios planes de cuentas por tenant, identificados y versionados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.planes.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ResultadoGenerico (`ResultadoGenerico`) con `total`.
- **Pantallas:** PAN-CON-03 (Planes de cuentas).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1889 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-04)

<a id="API-CON-05"></a>
#### API-CON-05 · `POST /api/admin/con/charts`

- **Qué hace:** Crear plan (vacío, copia o plantilla) Registra un nuevo elemento u operación en `charts`.
- **Para qué sirve:** RF-CON-007: Crear, copiar, versionar y administrar varios planes de cuentas por tenant, identificados y versionados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.planes.crear`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1890 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-05)

<a id="API-CON-06"></a>
#### API-CON-06 · `PATCH /api/admin/con/charts/{id}`

- **Qué hace:** Editar plan en borrador. Modifica algunos campos de un registro de `charts` (solo los enviados).
- **Para qué sirve:** RF-CON-009: Estados del plan: borrador, aprobado, operativo, alternativo, archivado; un único plan operativo por ejercicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.planes.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CON-32 (Equivalencias entre planes).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1891 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-06)

<a id="API-CON-07"></a>
#### API-CON-07 · `POST /api/admin/con/charts/{id}/approve`

- **Qué hace:** Aprobar. Aprueba un registro de `approve`.
- **Para qué sirve:** RF-CON-103: Equivalencias de cuentas entre planes (1:1, 1:N con porcentajes que suman 100 %, N:1), con vigencia y validación de completitud. · RF-CON-007: Crear, copiar, versionar y administrar varios planes de cuentas por tenant, identificados y versionados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.planes.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1892 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-07)

<a id="API-CON-08"></a>
#### API-CON-08 · `POST /api/admin/con/charts/{id}/promote`

- **Qué hace:** Promover a operativo para un ejercicio. Promueve un registro de `promote`.
- **Para qué sirve:** RF-CON-009: Estados del plan: borrador, aprobado, operativo, alternativo, archivado; un único plan operativo por ejercicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.planes.promover`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1893 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-08)

<a id="API-CON-09"></a>
#### API-CON-09 · `POST /api/admin/con/charts/{id}/archive`

- **Qué hace:** Archivar. Archiva un registro de `archive`.
- **Para qué sirve:** RF-CON-110: Exportar resultados de simulación identificados como tales en cada hoja y archivo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.planes.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CON-32 (Equivalencias entre planes).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1894 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-09)

<a id="API-CON-10"></a>
#### API-CON-10 · `GET /api/admin/con/charts/{id}/accounts`

- **Qué hace:** Árbol o lista de cuentas con filtros. Lista, con filtros y paginación, los registros de cuentas contables (`ledgerAccounts`).
- **Para qué sirve:** RF-CON-022: Visualizar el plan en árbol o lista, imprimir y exportar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.cuentas.ver`.
- **Recibe:** en la ruta `id`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de cuentas contables (`ledgerAccounts`) con `total`.
- **Pantallas:** PAN-CON-04 (Árbol y ficha de cuentas).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1895 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-10)

<a id="API-CON-11"></a>
#### API-CON-11 · `POST /api/admin/con/charts/{id}/accounts`

- **Qué hace:** Alta de cuenta. Da de alta un registro de cuentas contables (`ledgerAccounts`).
- **Para qué sirve:** RF-CON-007: Crear, copiar, versionar y administrar varios planes de cuentas por tenant, identificados y versionados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.cuentas.crear`.
- **Recibe:** en la ruta `id`; los datos de cuentas contables (`ledgerAccounts`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de cuentas contables (`ledgerAccounts`).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1896 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-11)

<a id="API-CON-12"></a>
#### API-CON-12 · `PATCH /api/admin/con/accounts/{id}`

- **Qué hace:** Editar / inactivar cuenta. Modifica algunos campos de un registro de cuentas contables (`ledgerAccounts`) (solo los enviados).
- **Para qué sirve:** RF-CON-017: Vigencia de la cuenta; inactivación sin borrado si tiene movimientos; borrado físico solo sin movimientos ni referencias. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.cuentas.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de cuentas contables (`ledgerAccounts`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de cuentas contables (`ledgerAccounts`).
- **Pantallas:** PAN-CON-04 (Árbol y ficha de cuentas), PAN-CON-05 (Rubros y subrubros contables), PAN-CON-38 (Rubros de capital).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1897 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-12)

<a id="API-CON-13"></a>
#### API-CON-13 · `POST /api/admin/con/accounts/{id}/renumber`

- **Qué hace:** Cambiar código visible. Renumera un registro de cuentas contables (`ledgerAccounts`).
- **Para qué sirve:** RF-CON-020: Renumerar una cuenta (cambiar su código visible) conservando identidad, historial y referencias. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.cuentas.renumerar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CON-06 (Renumerar y unificar cuentas).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1898 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-13)

<a id="API-CON-14"></a>
#### API-CON-14 · `POST /api/admin/con/accounts/merge`

- **Qué hace:** Unificar cuentas (vista previa con dryRun) Fusiona sobre cuentas contables (`ledgerAccounts`).
- **Para qué sirve:** RF-CON-100: Consulta contable de la cuenta corriente por asociado y servicio, vista unificada y detallada, con navegación al auxiliar de COB, sin duplicarlo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.cuentas.unificar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CON-06 (Renumerar y unificar cuentas).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1899 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-14)

<a id="API-CON-15"></a>
#### API-CON-15 · `GET /api/admin/con/charts/{id}/rubrics`

- **Qué hace:** Rubros y subrubros. Lista, con filtros y paginación, los registros de rubros contables (`accountRubrics`).
- **Para qué sirve:** RF-CON-013: Rubro y subrubro contable por cuenta para la exposición en estados contables. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.cuentas.ver`.
- **Recibe:** en la ruta `id`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de rubros contables (`accountRubrics`) con `total`.
- **Pantallas:** PAN-CON-04 (Árbol y ficha de cuentas).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1900 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-15)

<a id="API-CON-15-b"></a>
#### API-CON-15-b · `POST /api/admin/con/charts/{id}/rubrics`

- **Qué hace:** Rubros y subrubros. Da de alta un registro de rubros contables (`accountRubrics`).
- **Para qué sirve:** RF-CON-013: Rubro y subrubro contable por cuenta para la exposición en estados contables. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.cuentas.editar`.
- **Recibe:** en la ruta `id`; los datos de rubros contables (`accountRubrics`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de rubros contables (`accountRubrics`).
- **Pantallas:** PAN-CON-04 (Árbol y ficha de cuentas), PAN-CON-05 (Rubros y subrubros contables), PAN-CON-38 (Rubros de capital).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1900 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-15-b)

<a id="API-CON-15-c"></a>
#### API-CON-15-c · `PATCH /api/admin/con/charts/{id}/rubrics`

- **Qué hace:** Rubros y subrubros. Modifica algunos campos de un registro de rubros contables (`accountRubrics`) (solo los enviados).
- **Para qué sirve:** RF-CON-013: Rubro y subrubro contable por cuenta para la exposición en estados contables. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.cuentas.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de rubros contables (`accountRubrics`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de rubros contables (`accountRubrics`).
- **Pantallas:** PAN-CON-04 (Árbol y ficha de cuentas), PAN-CON-05 (Rubros y subrubros contables), PAN-CON-38 (Rubros de capital).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1900 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-15-c)

<a id="API-CON-16"></a>
#### API-CON-16 · `GET /api/admin/con/charts/{id}/roles`

- **Qué hace:** Roles de cuenta con estado. Lista, con filtros y paginación, los registros de roles contables (`accountRoles`).
- **Para qué sirve:** RF-CON-004: Roles de cuenta tipados por plan (cuentas por defecto del motor) que reemplazan los parámetros-cuenta P513, P2101–P2167 y P3141, más roles nuevos de GoodApps (§14.2). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.reglas.ver`.
- **Recibe:** en la ruta `id`; filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de roles contables (`accountRoles`) con `total`.
- **Pantallas:** PAN-CON-07 (Roles de cuenta), PAN-CON-08 (Reglas de imputación y simulador).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1901 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-16)

<a id="API-CON-17"></a>
#### API-CON-17 · `PUT /api/admin/con/charts/{id}/roles/{roleKey}`

- **Qué hace:** Asignar cuenta y overrides. Reemplaza o configura un registro de roles contables (`accountRoles`).
- **Para qué sirve:** RF-CON-083: Reglas de asignación por defecto por tipo de operación (ingresos/facturación, compras, ajuste por inflación, asiento manual, costo de mercadería vendida, sección por defecto de cuenta) y tipo de elemento (servicio, producto… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.reglas.editar`.
- **Recibe:** en la ruta `id`, `roleKey`; los datos de roles contables (`accountRoles`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de roles contables (`accountRoles`).
- **Pantallas:** PAN-CON-07 (Roles de cuenta), PAN-CON-08 (Reglas de imputación y simulador), PAN-CON-09 (Asignación y reasignación masiva de cuentas).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1902 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-17)

<a id="API-CON-18"></a>
#### API-CON-18 · `GET /api/admin/con/posting-rules`

- **Qué hace:** Listar reglas. Lista, con filtros y paginación, los registros de reglas de contabilización (`postingRules`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.reglas.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de reglas de contabilización (`postingRules`) con `total`.
- **Pantallas:** PAN-CON-07 (Roles de cuenta), PAN-CON-08 (Reglas de imputación y simulador).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1903 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-18)

<a id="API-CON-19"></a>
#### API-CON-19 · `POST /api/admin/con/posting-rules`

- **Qué hace:** Crear regla. Da de alta un registro de reglas de contabilización (`postingRules`).
- **Para qué sirve:** RF-CON-007: Crear, copiar, versionar y administrar varios planes de cuentas por tenant, identificados y versionados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.reglas.editar`.
- **Recibe:** los datos de reglas de contabilización (`postingRules`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de reglas de contabilización (`postingRules`).
- **Pantallas:** PAN-CON-07 (Roles de cuenta), PAN-CON-08 (Reglas de imputación y simulador), PAN-CON-09 (Asignación y reasignación masiva de cuentas).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1904 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-19)

<a id="API-CON-20"></a>
#### API-CON-20 · `PATCH /api/admin/con/posting-rules/{id}`

- **Qué hace:** Nueva versión / retirar. Modifica algunos campos de un registro de reglas de contabilización (`postingRules`) (solo los enviados).
- **Para qué sirve:** RF-CON-053: Reglas de imputación configurables por tipo de evento y rol de importe con condiciones por cualquier dimensión, vigencia, versión y prioridad; cuenta y, opcionalmente, centro o modelo de distribución. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.reglas.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de reglas de contabilización (`postingRules`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de reglas de contabilización (`postingRules`).
- **Pantallas:** PAN-CON-07 (Roles de cuenta), PAN-CON-08 (Reglas de imputación y simulador), PAN-CON-09 (Asignación y reasignación masiva de cuentas).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1905 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-20)

<a id="API-CON-21"></a>
#### API-CON-21 · `POST /api/admin/con/posting-rules/simulate`

- **Qué hace:** Simular asiento para un evento o documento. Simula sin efectos sobre reglas de contabilización (`postingRules`).
- **Para qué sirve:** RF-CON-055: Simulador de reglas: con un evento de ejemplo, mostrar las cuentas y centros resultantes y la ruta de resolución, sin registrar nada. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.reglas.ver`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CON-07 (Roles de cuenta), PAN-CON-08 (Reglas de imputación y simulador).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1906 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-21)

<a id="API-CON-22"></a>
#### API-CON-22 · `GET /api/admin/con/posting-rules/overlaps`

- **Qué hace:** Detectar solapamientos. Consulta reglas de contabilización (`postingRules`).
- **Para qué sirve:** RF-CON-027: ABM de ejercicios: número, fecha desde, fecha hasta, estado; desde < hasta; número único; sin solapamiento ni contención de otro ejercicio. · RF-CON-158: IA solo propone: sugerir cuenta para un concepto nuevo, detectar asientos atípicos; nunca contabiliza ni aprueba. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.reglas.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: el registro de reglas de contabilización (`postingRules`).
- **Pantallas:** PAN-CON-07 (Roles de cuenta), PAN-CON-08 (Reglas de imputación y simulador).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1907 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-22)

<a id="API-CON-23"></a>
#### API-CON-23 · `GET /api/admin/con/entity-accounts`

- **Qué hace:** Cuentas asignadas por tipo de entidad (filtro sin asignar) Consulta `entity-accounts`.
- **Para qué sirve:** RF-CON-083: Reglas de asignación por defecto por tipo de operación (ingresos/facturación, compras, ajuste por inflación, asiento manual, costo de mercadería vendida, sección por defecto de cuenta) y tipo de elemento (servicio, producto… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.reglas.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CON-07 (Roles de cuenta), PAN-CON-08 (Reglas de imputación y simulador).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1908 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-23)

<a id="API-CON-24"></a>
#### API-CON-24 · `POST /api/admin/con/entity-accounts/bulk`

- **Qué hace:** Asignación/reasignación masiva (dryRun) Procesa en forma masiva sobre `bulk`.
- **Para qué sirve:** RF-CON-024: Reasignación masiva de cuentas y rubros: cambiar en bloque el rubro de productos, servicios, impuestos y conceptos de compra, o la cuenta de bancos, roles de cuenta, proveedores y tipos de factura; filtro "sin asignar"… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.reglas.editar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CON-07 (Roles de cuenta), PAN-CON-08 (Reglas de imputación y simulador), PAN-CON-09 (Asignación y reasignación masiva de cuentas).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1909 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-24)

<a id="API-CON-25"></a>
#### API-CON-25 · `GET /api/admin/con/fiscal-years`

- **Qué hace:** Ejercicios. Lista, con filtros y paginación, los registros de ejercicios (`fiscalYears`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.ejercicios.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ejercicios (`fiscalYears`) con `total`.
- **Pantallas:** PAN-CON-10 (Ejercicios).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1910 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-25)

<a id="API-CON-25-b"></a>
#### API-CON-25-b · `POST /api/admin/con/fiscal-years`

- **Qué hace:** Ejercicios. Da de alta un registro de ejercicios (`fiscalYears`).
- **Para qué sirve:** RF-CON-007: Crear, copiar, versionar y administrar varios planes de cuentas por tenant, identificados y versionados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.ejercicios.crear`.
- **Recibe:** los datos de ejercicios (`fiscalYears`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de ejercicios (`fiscalYears`).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1910 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-25-b)

<a id="API-CON-26"></a>
#### API-CON-26 · `POST /api/admin/con/fiscal-years/{id}/open`

- **Qué hace:** Abrir ejercicio. Abre un registro de ejercicios (`fiscalYears`).
- **Para qué sirve:** RF-CON-007: Crear, copiar, versionar y administrar varios planes de cuentas por tenant, identificados y versionados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.ejercicios.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1911 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-26)

<a id="API-CON-27"></a>
#### API-CON-27 · `POST /api/admin/con/fiscal-years/{id}/closing-preview`

- **Qué hace:** Generar borradores de cierre y apertura. Registra «closing-preview» sobre un registro de ejercicios (`fiscalYears`).
- **Para qué sirve:** RF-CON-122: Cuadro de bienes de uso (origen + mejoras − disminuciones) y cuadro de amortizaciones (apertura, ejercicio, cierre) para el anexo de estados contables, con datos de STK conciliados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.ejercicios.cerrar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CON-31 (Cierre y reapertura de ejercicio; cuentas de resultado).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1912 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-27)

<a id="API-CON-28"></a>
#### API-CON-28 · `POST /api/admin/con/fiscal-years/{id}/close`

- **Qué hace:** Confirmar cierre. Cierra un registro de ejercicios (`fiscalYears`).
- **Para qué sirve:** RF-CON-003: Fecha contable base por módulo: emisión, fecha contable del comprobante de compra (FEC_CON), fecha de acreditación, fecha de confirmación del pago o cierre de caja; opción de usar fecha de emisión en ventas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.ejercicios.cerrar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CON-31 (Cierre y reapertura de ejercicio; cuentas de resultado).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1913 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-28)

<a id="API-CON-29"></a>
#### API-CON-29 · `POST /api/admin/con/fiscal-years/{id}/reopen`

- **Qué hace:** Solicitar/ejecutar reapertura (doble aprobación) Reabre un registro de ejercicios (`fiscalYears`).
- **Para qué sirve:** RF-CON-133: Reapertura de ejercicio controlada: solicitud, doble aprobación, reversión (no borrado) de los tres asientos, auditoría y nuevo cierre. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.ejercicios.reabrir`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CON-31 (Cierre y reapertura de ejercicio; cuentas de resultado).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1914 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-29)

<a id="API-CON-30"></a>
#### API-CON-30 · `GET /api/admin/con/result-targets`

- **Qué hace:** Cuentas de resultado. Lista, con filtros y paginación, los registros de destinos de resultado (`resultTargets`).
- **Para qué sirve:** RF-CON-026: Cuentas de resultado para el cierre: por prefijo o rango de cuentas de resultado, la cuenta de resultados destino, con marca de ganancias/pérdidas; la regla de mayor especificidad (prefijo más largo) gana; si no hay, se usa el… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.ejercicios.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de destinos de resultado (`resultTargets`) con `total`.
- **Pantallas:** PAN-CON-10 (Ejercicios).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1915 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-30)

<a id="API-CON-30-b"></a>
#### API-CON-30-b · `POST /api/admin/con/result-targets`

- **Qué hace:** Cuentas de resultado. Da de alta un registro de destinos de resultado (`resultTargets`).
- **Para qué sirve:** RF-CON-026: Cuentas de resultado para el cierre: por prefijo o rango de cuentas de resultado, la cuenta de resultados destino, con marca de ganancias/pérdidas; la regla de mayor especificidad (prefijo más largo) gana; si no hay, se usa el… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.ejercicios.cerrar`.
- **Recibe:** los datos de destinos de resultado (`resultTargets`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de destinos de resultado (`resultTargets`).
- **Pantallas:** PAN-CON-31 (Cierre y reapertura de ejercicio; cuentas de resultado).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1915 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-30-b)

<a id="API-CON-30-c"></a>
#### API-CON-30-c · `PATCH /api/admin/con/result-targets`

- **Qué hace:** Cuentas de resultado. Modifica algunos campos de un registro de destinos de resultado (`resultTargets`) (solo los enviados).
- **Para qué sirve:** RF-CON-026: Cuentas de resultado para el cierre: por prefijo o rango de cuentas de resultado, la cuenta de resultados destino, con marca de ganancias/pérdidas; la regla de mayor especificidad (prefijo más largo) gana; si no hay, se usa el… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.ejercicios.cerrar`.
- **Recibe:** solo los campos a cambiar de destinos de resultado (`resultTargets`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de destinos de resultado (`resultTargets`).
- **Pantallas:** PAN-CON-31 (Cierre y reapertura de ejercicio; cuentas de resultado).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1915 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-30-c)

<a id="API-CON-31"></a>
#### API-CON-31 · `GET /api/admin/con/periods`

- **Qué hace:** Matriz de períodos y bloqueos. Lista, con filtros y paginación, los registros de períodos contables (`accountingPeriods`).
- **Para qué sirve:** RF-CON-059: Evento sin cuenta resuelta: queda "pendiente de configuración", genera alerta y bloquea el cierre del período, sin bloquear la operación de origen. · RF-CON-065: Matriz de eventos económicos de todos los módulos con su asiento tipo (§9.1). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.periodos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de períodos contables (`accountingPeriods`) con `total`.
- **Pantallas:** PAN-CON-11 (Períodos y bloqueos por módulo).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1916 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-31)

<a id="API-CON-32"></a>
#### API-CON-32 · `POST /api/admin/con/periods/{id}/locks`

- **Qué hace:** Bloquear/desbloquear módulo hasta fecha. Registra «locks» sobre un registro de períodos contables (`accountingPeriods`).
- **Para qué sirve:** RF-CON-029: Bloqueo por módulo dentro de cada período: comprobantes de venta, facturación, cobranza, compras, bancos, tesorería, financiaciones, viviendas, stock, sueldos, titulares, bienes de uso y contable, reemplazando las fechas de… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.periodos.bloquear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CON-11 (Períodos y bloqueos por módulo).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1917 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-32)

<a id="API-CON-33"></a>
#### API-CON-33 · `POST /api/admin/con/periods/{id}/close`

- **Qué hace:** Cerrar período (valida checklist) Cierra un registro de períodos contables (`accountingPeriods`).
- **Para qué sirve:** RF-CON-036: Validaciones del asiento: al menos dos renglones, debe = haber exacto, cuentas imputables y vigentes, período y módulo contable abiertos, descripción obligatoria, centros según la política de la cuenta y distribución al 100 %. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.periodos.cerrar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1918 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-33)

<a id="API-CON-34"></a>
#### API-CON-34 · `POST /api/admin/con/periods/{id}/reopen`

- **Qué hace:** Solicitar reapertura con motivo y plazo. Reabre un registro de períodos contables (`accountingPeriods`).
- **Para qué sirve:** RF-CON-032: Reapertura controlada de período: solicitud con motivo, aprobación (T11), plazo opcional de reapertura, auditoría y recierre. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.periodos.reabrir`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CON-11 (Períodos y bloqueos por módulo).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1919 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-34)

<a id="API-CON-35"></a>
#### API-CON-35 · `GET /api/con/period-guard`

- **Qué hace:** Consulta si una fecha está abierta para un módulo. Consulta `period-guard`.
- **Para qué sirve:** RF-CON-030: Servicio de guarda de período (periodGuard) consultado por todos los módulos antes de registrar o modificar una operación con fecha; responde permitido/rechazado y motivo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `con.periodos.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CON-11 (Períodos y bloqueos por módulo).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1920 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-35)

<a id="API-CON-36"></a>
#### API-CON-36 · `GET /api/admin/con/entries`

- **Qué hace:** Diario con filtros. Lista, con filtros y paginación, los registros de asientos (`journalEntries`).
- **Para qué sirve:** RF-CON-048: Consulta del diario con filtros por fecha de asiento o de registro, tipo, origen (automático/manual), módulo, estado, cuenta, centro, usuario, importe y documento; navegación al documento. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.asientos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de asientos (`journalEntries`) con `total`.
- **Pantallas:** PAN-CON-01 (Tablero contable), PAN-CON-12 (Diario (asientos)).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1921 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-36)

<a id="API-CON-38"></a>
#### API-CON-38 · `POST /api/admin/con/entries`

- **Qué hace:** Crear asiento manual (borrador) Da de alta un registro de asientos (`journalEntries`).
- **Para qué sirve:** RF-CON-037: Estados del asiento: borrador, pendiente de aprobación, contabilizado, anulado, revertido. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.asientos.crear`.
- **Recibe:** los datos de asientos (`journalEntries`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 201: el registro de asientos (`journalEntries`).
- **Pantallas:** PAN-CON-13 (Asiento (alta, edición y detalle)), PAN-CON-14 (Plantillas de asiento).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1923 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-38)

<a id="API-CON-37"></a>
#### API-CON-37 · `GET /api/admin/con/entries/{id}`

- **Qué hace:** Asiento con renglones, resolución y vínculos. Obtiene el detalle de un registro de asientos (`journalEntries`).
- **Para qué sirve:** RF-CON-057: Vínculo bidireccional documento ↔ evento ↔ asiento ↔ renglón. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.asientos.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de asientos (`journalEntries`).
- **Pantallas:** PAN-CON-01 (Tablero contable), PAN-CON-12 (Diario (asientos)).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1922 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-37)

<a id="API-CON-40"></a>
#### API-CON-40 · `DELETE /api/admin/con/entries/{id}`

- **Qué hace:** Eliminar borrador (solo draft) Elimina o da de baja un registro de asientos (`journalEntries`).
- **Para qué sirve:** RF-CON-037: Estados del asiento: borrador, pendiente de aprobación, contabilizado, anulado, revertido. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.asientos.editar`.
- **Recibe:** en la ruta `id`; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 204 sin contenido.
- **Pantallas:** PAN-CON-13 (Asiento (alta, edición y detalle)).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1925 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-40)

<a id="API-CON-39"></a>
#### API-CON-39 · `PATCH /api/admin/con/entries/{id}`

- **Qué hace:** Editar borrador. Modifica algunos campos de un registro de asientos (`journalEntries`) (solo los enviados).
- **Para qué sirve:** RF-CON-037: Estados del asiento: borrador, pendiente de aprobación, contabilizado, anulado, revertido. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.asientos.editar`.
- **Recibe:** en la ruta `id`; solo los campos a cambiar de asientos (`journalEntries`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de asientos (`journalEntries`).
- **Pantallas:** PAN-CON-13 (Asiento (alta, edición y detalle)).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1924 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-39)

<a id="API-CON-41"></a>
#### API-CON-41 · `POST /api/admin/con/entries/{id}/submit`

- **Qué hace:** Enviar a aprobación. Envía a revisión o presenta un registro de asientos (`journalEntries`).
- **Para qué sirve:** RF-CON-007: Crear, copiar, versionar y administrar varios planes de cuentas por tenant, identificados y versionados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.asientos.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CON-13 (Asiento (alta, edición y detalle)), PAN-CON-14 (Plantillas de asiento).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1926 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-41)

<a id="API-CON-42"></a>
#### API-CON-42 · `POST /api/admin/con/entries/{id}/post`

- **Qué hace:** Contabilizar. Contabiliza o asienta un registro de asientos (`journalEntries`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.asientos.contabilizar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CON-13 (Asiento (alta, edición y detalle)).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1927 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-42)

<a id="API-CON-43"></a>
#### API-CON-43 · `POST /api/admin/con/entries/{id}/approve`

- **Qué hace:** Aprobar o rechazar. Aprueba un registro de asientos (`journalEntries`).
- **Para qué sirve:** RF-CON-030: Servicio de guarda de período (periodGuard) consultado por todos los módulos antes de registrar o modificar una operación con fecha; responde permitido/rechazado y motivo. · RF-CON-037: Estados del asiento: borrador, pendiente de aprobación, contabilizado, anulado, revertido. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.asientos.aprobar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CON-13 (Asiento (alta, edición y detalle)).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1928 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-43)

<a id="API-CON-44"></a>
#### API-CON-44 · `POST /api/admin/con/entries/{id}/void`

- **Qué hace:** Anular (período abierto, no transcripto) Anula un registro de asientos (`journalEntries`).
- **Para qué sirve:** RF-CON-137: Transcripción del diario sobre hojas rubricadas con continuidad de folio; los asientos transcriptos quedan bloqueados para anular, renumerar o modificar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.asientos.anular`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1929 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-44)

<a id="API-CON-45"></a>
#### API-CON-45 · `POST /api/admin/con/entries/{id}/reverse`

- **Qué hace:** Contraasiento con fecha. Revierte un registro de asientos (`journalEntries`).
- **Para qué sirve:** RF-CON-058: Reversión automática al anular el documento o evento de origen: contraasiento vinculado en el período del origen si está abierto, o en el período abierto actual con referencia si está cerrado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.asientos.anular`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1930 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-45)

<a id="API-CON-46"></a>
#### API-CON-46 · `POST /api/admin/con/entries/{id}/attachments`

- **Qué hace:** Adjuntar respaldo (URL firmada) Agrega un elemento («attachments») a un registro de asientos (`journalEntries`).
- **Para qué sirve:** RF-CON-035: Alta de asiento manual: fecha, descripción, renglones (cuenta, debe, haber, observación), distribución por centro de costo por porcentaje o importe, adjuntos de respaldo y referencia opcional a documento. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.asientos.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CON-13 (Asiento (alta, edición y detalle)).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1931 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-46)

<a id="API-CON-47"></a>
#### API-CON-47 · `POST /api/admin/con/entries/import`

- **Qué hace:** Importar archivo (validar / confirmar) Importa sobre asientos (`journalEntries`).
- **Para qué sirve:** RF-CON-045: Importación de asientos desde Excel/CSV, con y sin centros de costo y en modalidad "asiento único", con validación previa de cuentas, balance por asiento, ejercicio abierto, período no bloqueado y numeración por ejercicio. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.asientos.importar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CON-15 (Importación de asientos).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1932 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-47)

<a id="API-CON-48"></a>
#### API-CON-48 · `POST /api/admin/con/entries/bulk-void`

- **Qué hace:** Anulación masiva (dryRun) → JOB-CON-17. Registra un nuevo elemento u operación en asientos (`journalEntries`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-CON-046: Anulación masiva de asientos por filtros (rango, origen, lote, módulo), con permiso específico, excluyendo apertura y cierre, validando período abierto y no rubricado, y revirtiendo los efectos dependientes (amortizaciones). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.asientos.anularMasivo`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-CON-18 (Anulación masiva).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1933 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-48)

<a id="API-CON-49"></a>
#### API-CON-49 · `POST /api/admin/con/entries/renumber`

- **Qué hace:** Renumeración → JOB-CON-16. Renumera sobre asientos (`journalEntries`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-CON-137: Transcripción del diario sobre hojas rubricadas con continuidad de folio; los asientos transcriptos quedan bloqueados para anular, renumerar o modificar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.asientos.renumerar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-CON-19 (Renumeración de asientos).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1934 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-49)

<a id="API-CON-50"></a>
#### API-CON-50 · `GET /api/admin/con/entry-templates`

- **Qué hace:** Plantillas. Lista, con filtros y paginación, los registros de modelos de asiento (`entryTemplates`).
- **Para qué sirve:** RF-CON-084: Modelos de distribución reutilizables (plantillas) seleccionables al asignar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.asientos.crear`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de modelos de asiento (`entryTemplates`) con `total`.
- **Pantallas:** PAN-CON-13 (Asiento (alta, edición y detalle)), PAN-CON-14 (Plantillas de asiento).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1935 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-50)

<a id="API-CON-50-b"></a>
#### API-CON-50-b · `POST /api/admin/con/entry-templates`

- **Qué hace:** Plantillas. Da de alta un registro de modelos de asiento (`entryTemplates`).
- **Para qué sirve:** RF-CON-084: Modelos de distribución reutilizables (plantillas) seleccionables al asignar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.asientos.crear`.
- **Recibe:** los datos de modelos de asiento (`entryTemplates`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de modelos de asiento (`entryTemplates`).
- **Pantallas:** PAN-CON-13 (Asiento (alta, edición y detalle)), PAN-CON-14 (Plantillas de asiento).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1935 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-50-b)

<a id="API-CON-50-c"></a>
#### API-CON-50-c · `PATCH /api/admin/con/entry-templates`

- **Qué hace:** Plantillas. Modifica algunos campos de un registro de modelos de asiento (`entryTemplates`) (solo los enviados).
- **Para qué sirve:** RF-CON-084: Modelos de distribución reutilizables (plantillas) seleccionables al asignar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.asientos.crear`.
- **Recibe:** solo los campos a cambiar de modelos de asiento (`entryTemplates`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de modelos de asiento (`entryTemplates`).
- **Pantallas:** PAN-CON-13 (Asiento (alta, edición y detalle)), PAN-CON-14 (Plantillas de asiento).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1935 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-50-c)

<a id="API-CON-51"></a>
#### API-CON-51 · `POST /api/admin/con/entry-templates/{id}/generate`

- **Qué hace:** Generar asiento desde plantilla. Genera un registro de modelos de asiento (`entryTemplates`).
- **Para qué sirve:** RF-CON-084: Modelos de distribución reutilizables (plantillas) seleccionables al asignar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.asientos.crear`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CON-13 (Asiento (alta, edición y detalle)), PAN-CON-14 (Plantillas de asiento).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1936 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-51)

<a id="API-CON-52"></a>
#### API-CON-52 · `GET /api/admin/con/events`

- **Qué hace:** Bandeja de eventos. Lista, con filtros y paginación, los registros de bandeja de eventos a contabilizar (`accountingEvents`).
- **Para qué sirve:** RF-CON-051: Recepción de los eventos económicos de todos los módulos vía outbox en una bandeja (accountingEvents), idempotente por identificador del evento de origen. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.eventos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de bandeja de eventos a contabilizar (`accountingEvents`) con `total`.
- **Pantallas:** PAN-CON-16 (Bandeja de eventos contables).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1937 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-52)

<a id="API-CON-53"></a>
#### API-CON-53 · `GET /api/admin/con/events/{id}`

- **Qué hace:** Evento con contrato y faltantes. Obtiene el detalle de un registro de bandeja de eventos a contabilizar (`accountingEvents`).
- **Para qué sirve:** RF-CON-131: Si falta un índice del rango, la corrida no se ejecuta y lista los meses faltantes. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.eventos.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de bandeja de eventos a contabilizar (`accountingEvents`).
- **Pantallas:** PAN-CON-16 (Bandeja de eventos contables).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1938 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-53)

<a id="API-CON-54"></a>
#### API-CON-54 · `POST /api/admin/con/events/reprocess`

- **Qué hace:** Reprocesar seleccionados o por causa. Reprocesa sobre bandeja de eventos a contabilizar (`accountingEvents`).
- **Para qué sirve:** RF-CON-060: Reprocesar eventos pendientes o con error luego de corregir la configuración, de a uno o masivamente. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.eventos.reprocesar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CON-16 (Bandeja de eventos contables).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1939 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-54)

<a id="API-CON-55"></a>
#### API-CON-55 · `POST /api/admin/con/events/{id}/ignore`

- **Qué hace:** Ignorar con motivo. Registra «ignore» sobre un registro de bandeja de eventos a contabilizar (`accountingEvents`).
- **Para qué sirve:** RF-CON-051: Recepción de los eventos económicos de todos los módulos vía outbox en una bandeja (accountingEvents), idempotente por identificador del evento de origen. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.eventos.ignorar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CON-16 (Bandeja de eventos contables).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1940 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-55)

<a id="API-CON-57"></a>
#### API-CON-57 · `GET /api/admin/con/posting-batches`

- **Qué hace:** Lotes y resultado. Lista, con filtros y paginación, los registros de lotes de contabilización (`postingBatches`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.lotes.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de lotes de contabilización (`postingBatches`) con `total`.
- **Pantallas:** PAN-CON-17 (Lote de contabilización ("Cierre automático")).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1942 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-57)

<a id="API-CON-56"></a>
#### API-CON-56 · `POST /api/admin/con/posting-batches`

- **Qué hace:** Crear lote (vista previa) → JOB-CON-02. Registra un nuevo elemento u operación en lotes de contabilización (`postingBatches`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-CON-131: Si falta un índice del rango, la corrida no se ejecuta y lista los meses faltantes. · RF-CON-007: Crear, copiar, versionar y administrar varios planes de cuentas por tenant, identificados y versionados. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.lotes.ejecutar`.
- **Recibe:** los datos de lotes de contabilización (`postingBatches`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-CON-17 (Lote de contabilización ("Cierre automático")).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1941 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-56)

<a id="API-CON-57-b"></a>
#### API-CON-57-b · `GET /api/admin/con/posting-batches/{id}`

- **Qué hace:** Lotes y resultado. Obtiene el detalle de un registro de lotes de contabilización (`postingBatches`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.lotes.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de lotes de contabilización (`postingBatches`).
- **Pantallas:** PAN-CON-17 (Lote de contabilización ("Cierre automático")).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1942 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-57-b)

<a id="API-CON-58"></a>
#### API-CON-58 · `POST /api/admin/con/posting-batches/{id}/confirm`

- **Qué hace:** Confirmar. Confirma un registro de lotes de contabilización (`postingBatches`).
- **Para qué sirve:** RF-CON-003: Fecha contable base por módulo: emisión, fecha contable del comprobante de compra (FEC_CON), fecha de acreditación, fecha de confirmación del pago o cierre de caja; opción de usar fecha de emisión en ventas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.lotes.confirmar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CON-17 (Lote de contabilización ("Cierre automático")).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1943 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-58)

<a id="API-CON-59"></a>
#### API-CON-59 · `POST /api/admin/con/posting-batches/{id}/discard`

- **Qué hace:** Descartar. Descarta un registro de lotes de contabilización (`postingBatches`).
- **Para qué sirve:** RF-CON-131: Si falta un índice del rango, la corrida no se ejecuta y lista los meses faltantes. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.lotes.ejecutar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CON-17 (Lote de contabilización ("Cierre automático")).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1944 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-59)

<a id="API-CON-60"></a>
#### API-CON-60 · `GET /api/admin/con/reports/{reportKey}`

- **Qué hace:** Informes (§15) con parámetros; format=json/pdf/xlsx/csv (exportar exige con.reportes.exportar) Obtiene el detalle de un registro de `reports`.
- **Para qué sirve:** RF-CON-126: Exportación XLSX, CSV y PDF de todos los reportes, según permiso. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.reportes.ver`.
- **Recibe:** en la ruta `reportKey`.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CON-20 (Mayor), PAN-CON-21 (Sumas y saldos), PAN-CON-22 (Catálogo de informes contables) y 2 más.
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1945 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-60)

<a id="API-CON-61"></a>
#### API-CON-61 · `POST /api/admin/con/rubricated-books`

- **Qué hace:** Libros y transcripción → JOB-CON-18. Registra un nuevo elemento u operación en libros rubricados (`rubricatedBooks`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-CON-137: Transcripción del diario sobre hojas rubricadas con continuidad de folio; los asientos transcriptos quedan bloqueados para anular, renumerar o modificar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.libros.transcribir`.
- **Recibe:** los datos de libros rubricados (`rubricatedBooks`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-CON-23 (Libros rubricados).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1946 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-61)

<a id="API-CON-61-b"></a>
#### API-CON-61-b · `POST /api/admin/con/rubricated-books/{id}/transcriptions`

- **Qué hace:** Libros y transcripción → JOB-CON-18. Registra «transcriptions» sobre un registro de libros rubricados (`rubricatedBooks`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-CON-137: Transcripción del diario sobre hojas rubricadas con continuidad de folio; los asientos transcriptos quedan bloqueados para anular, renumerar o modificar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.libros.transcribir`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-CON-23 (Libros rubricados).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1946 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-61-b)

<a id="API-CON-62"></a>
#### API-CON-62 · `GET /api/admin/con/cost-centers`

- **Qué hace:** Centros y grupos. Lista, con filtros y paginación, los registros de centros de costo (`costCenters`).
- **Para qué sirve:** RF-CON-082: Grupos de centros (un centro puede integrar varios grupos) para informes. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.centros.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de centros de costo (`costCenters`) con `total`.
- **Pantallas:** PAN-CON-24 (Centros de costo y grupos).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1947 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-62)

<a id="API-CON-62-b"></a>
#### API-CON-62-b · `POST /api/admin/con/cost-centers`

- **Qué hace:** Centros y grupos. Da de alta un registro de centros de costo (`costCenters`).
- **Para qué sirve:** RF-CON-082: Grupos de centros (un centro puede integrar varios grupos) para informes. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.centros.configurar`.
- **Recibe:** los datos de centros de costo (`costCenters`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de centros de costo (`costCenters`).
- **Pantallas:** PAN-CON-24 (Centros de costo y grupos), PAN-CON-25 (Reglas de asignación a centros).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1947 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-62-b)

<a id="API-CON-62-c"></a>
#### API-CON-62-c · `PATCH /api/admin/con/cost-centers`

- **Qué hace:** Centros y grupos. Modifica algunos campos de un registro de centros de costo (`costCenters`) (solo los enviados).
- **Para qué sirve:** RF-CON-082: Grupos de centros (un centro puede integrar varios grupos) para informes. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.centros.configurar`.
- **Recibe:** solo los campos a cambiar de centros de costo (`costCenters`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de centros de costo (`costCenters`).
- **Pantallas:** PAN-CON-24 (Centros de costo y grupos), PAN-CON-25 (Reglas de asignación a centros).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1947 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-62-c)

<a id="API-CON-62-d"></a>
#### API-CON-62-d · `GET /api/admin/con/cost-center-groups`

- **Qué hace:** Centros y grupos. Lista, con filtros y paginación, los registros de grupos de centros (`costCenterGroups`).
- **Para qué sirve:** RF-CON-082: Grupos de centros (un centro puede integrar varios grupos) para informes. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.centros.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de grupos de centros (`costCenterGroups`) con `total`.
- **Pantallas:** PAN-CON-24 (Centros de costo y grupos).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1947 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-62-d)

<a id="API-CON-62-e"></a>
#### API-CON-62-e · `POST /api/admin/con/cost-center-groups`

- **Qué hace:** Centros y grupos. Da de alta un registro de grupos de centros (`costCenterGroups`).
- **Para qué sirve:** RF-CON-082: Grupos de centros (un centro puede integrar varios grupos) para informes. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.centros.configurar`.
- **Recibe:** los datos de grupos de centros (`costCenterGroups`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de grupos de centros (`costCenterGroups`).
- **Pantallas:** PAN-CON-24 (Centros de costo y grupos), PAN-CON-25 (Reglas de asignación a centros).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1947 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-62-e)

<a id="API-CON-62-f"></a>
#### API-CON-62-f · `PATCH /api/admin/con/cost-center-groups`

- **Qué hace:** Centros y grupos. Modifica algunos campos de un registro de grupos de centros (`costCenterGroups`) (solo los enviados).
- **Para qué sirve:** RF-CON-082: Grupos de centros (un centro puede integrar varios grupos) para informes. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.centros.configurar`.
- **Recibe:** solo los campos a cambiar de grupos de centros (`costCenterGroups`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de grupos de centros (`costCenterGroups`).
- **Pantallas:** PAN-CON-24 (Centros de costo y grupos), PAN-CON-25 (Reglas de asignación a centros).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1947 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-62-f)

<a id="API-CON-63"></a>
#### API-CON-63 · `GET /api/admin/con/cost-allocation-rules`

- **Qué hace:** Reglas de asignación a centros. Lista, con filtros y paginación, los registros de reglas de imputación a centros (`costAllocationRules`).
- **Para qué sirve:** RF-CON-053: Reglas de imputación configurables por tipo de evento y rol de importe con condiciones por cualquier dimensión, vigencia, versión y prioridad; cuenta y, opcionalmente, centro o modelo de distribución. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.centros.configurar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de reglas de imputación a centros (`costAllocationRules`) con `total`.
- **Pantallas:** PAN-CON-24 (Centros de costo y grupos), PAN-CON-25 (Reglas de asignación a centros).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1948 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-63)

<a id="API-CON-63-b"></a>
#### API-CON-63-b · `POST /api/admin/con/cost-allocation-rules`

- **Qué hace:** Reglas de asignación a centros. Da de alta un registro de reglas de imputación a centros (`costAllocationRules`).
- **Para qué sirve:** RF-CON-053: Reglas de imputación configurables por tipo de evento y rol de importe con condiciones por cualquier dimensión, vigencia, versión y prioridad; cuenta y, opcionalmente, centro o modelo de distribución. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.centros.configurar`.
- **Recibe:** los datos de reglas de imputación a centros (`costAllocationRules`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de reglas de imputación a centros (`costAllocationRules`).
- **Pantallas:** PAN-CON-24 (Centros de costo y grupos), PAN-CON-25 (Reglas de asignación a centros).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1948 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-63-b)

<a id="API-CON-63-c"></a>
#### API-CON-63-c · `PATCH /api/admin/con/cost-allocation-rules`

- **Qué hace:** Reglas de asignación a centros. Modifica algunos campos de un registro de reglas de imputación a centros (`costAllocationRules`) (solo los enviados).
- **Para qué sirve:** RF-CON-053: Reglas de imputación configurables por tipo de evento y rol de importe con condiciones por cualquier dimensión, vigencia, versión y prioridad; cuenta y, opcionalmente, centro o modelo de distribución. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.centros.configurar`.
- **Recibe:** solo los campos a cambiar de reglas de imputación a centros (`costAllocationRules`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de reglas de imputación a centros (`costAllocationRules`).
- **Pantallas:** PAN-CON-24 (Centros de costo y grupos), PAN-CON-25 (Reglas de asignación a centros).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1948 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-63-c)

<a id="API-CON-63-d"></a>
#### API-CON-63-d · `POST /api/admin/con/cost-allocation-rules/bulk`

- **Qué hace:** Reglas de asignación a centros. Procesa en forma masiva sobre reglas de imputación a centros (`costAllocationRules`).
- **Para qué sirve:** RF-CON-053: Reglas de imputación configurables por tipo de evento y rol de importe con condiciones por cualquier dimensión, vigencia, versión y prioridad; cuenta y, opcionalmente, centro o modelo de distribución. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.centros.configurar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CON-24 (Centros de costo y grupos), PAN-CON-25 (Reglas de asignación a centros).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1948 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-63-d)

<a id="API-CON-64"></a>
#### API-CON-64 · `GET /api/admin/con/distribution-models`

- **Qué hace:** Modelos de distribución. Lista, con filtros y paginación, los registros de modelos de reparto (`distributionModels`).
- **Para qué sirve:** RF-CON-084: Modelos de distribución reutilizables (plantillas) seleccionables al asignar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.distribuciones.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de modelos de reparto (`distributionModels`) con `total`.
- **Pantallas:** PAN-CON-26 (Modelos y corridas de distribución).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1949 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-64)

<a id="API-CON-64-b"></a>
#### API-CON-64-b · `POST /api/admin/con/distribution-models`

- **Qué hace:** Modelos de distribución. Da de alta un registro de modelos de reparto (`distributionModels`).
- **Para qué sirve:** RF-CON-084: Modelos de distribución reutilizables (plantillas) seleccionables al asignar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.distribuciones.editar`.
- **Recibe:** los datos de modelos de reparto (`distributionModels`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de modelos de reparto (`distributionModels`).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1949 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-64-b)

<a id="API-CON-64-c"></a>
#### API-CON-64-c · `PATCH /api/admin/con/distribution-models`

- **Qué hace:** Modelos de distribución. Modifica algunos campos de un registro de modelos de reparto (`distributionModels`) (solo los enviados).
- **Para qué sirve:** RF-CON-084: Modelos de distribución reutilizables (plantillas) seleccionables al asignar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.distribuciones.editar`.
- **Recibe:** solo los campos a cambiar de modelos de reparto (`distributionModels`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de modelos de reparto (`distributionModels`).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1949 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-64-c)

<a id="API-CON-65"></a>
#### API-CON-65 · `POST /api/admin/con/distribution-runs`

- **Qué hace:** Corrida de distribución → JOB-CON-07. Registra un nuevo elemento u operación en corridas de reparto (`costDistributionRuns`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-CON-131: Si falta un índice del rango, la corrida no se ejecuta y lista los meses faltantes. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.distribuciones.ejecutar`.
- **Recibe:** los datos de corridas de reparto (`costDistributionRuns`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-CON-26 (Modelos y corridas de distribución).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1950 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-65)

<a id="API-CON-65-b"></a>
#### API-CON-65-b · `POST /api/admin/con/distribution-runs/{id}/finalize`

- **Qué hace:** Corrida de distribución → JOB-CON-07. Finaliza un registro de corridas de reparto (`costDistributionRuns`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-CON-131: Si falta un índice del rango, la corrida no se ejecuta y lista los meses faltantes. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.distribuciones.ejecutar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-CON-26 (Modelos y corridas de distribución).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1950 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-65-b)

<a id="API-CON-66-b"></a>
#### API-CON-66-b · `GET /api/admin/con/reconciliations`

- **Qué hace:** Ejecutar y consultar conciliaciones → JOB-CON-08. Consulta `reconciliations`.
- **Para qué sirve:** RF-CON-131: Si falta un índice del rango, la corrida no se ejecuta y lista los meses faltantes. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.conciliaciones.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CON-28 (Conciliaciones).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1951 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-66-b)

<a id="API-CON-66"></a>
#### API-CON-66 · `POST /api/admin/con/reconciliations`

- **Qué hace:** Ejecutar y consultar conciliaciones → JOB-CON-08. Registra un nuevo elemento u operación en `reconciliations`; el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-CON-131: Si falta un índice del rango, la corrida no se ejecuta y lista los meses faltantes. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.conciliaciones.ejecutar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-CON-28 (Conciliaciones).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1951 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-66)

<a id="API-CON-67"></a>
#### API-CON-67 · `PATCH /api/admin/con/reconciliations/{id}/differences/{diffId}`

- **Qué hace:** Explicar diferencia. Modifica algunos campos de un registro de `differences` (solo los enviados).
- **Para qué sirve:** RF-CON-031: Cierre mensual de período con lista de control: eventos pendientes de configuración = 0, asientos en borrador = 0, cajas cerradas, conciliaciones sin diferencias no explicadas, amortizaciones y provisiones registradas, ajuste por… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.conciliaciones.ejecutar`.
- **Recibe:** en la ruta `id`, `diffId`; solo los campos a cambiar; cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CON-28 (Conciliaciones).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1952 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-67)

<a id="API-CON-68"></a>
#### API-CON-68 · `GET /api/admin/con/inflation-series`

- **Qué hace:** Series e índices (importación) Lista, con filtros y paginación, los registros de `inflation-series`.
- **Para qué sirve:** RF-CON-127: Tablas de índices (por ejemplo IPC/FACPCE) con valores mensuales; carga manual, importación y actualización. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.inflacion.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de ResultadoGenerico (`ResultadoGenerico`) con `total`.
- **Pantallas:** PAN-CON-29 (Índices de inflación).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1953 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-68)

<a id="API-CON-68-c"></a>
#### API-CON-68-c · `PUT /api/admin/con/inflation-series`

- **Qué hace:** Series e índices (importación) Reemplaza o configura `inflation-series`.
- **Para qué sirve:** RF-CON-127: Tablas de índices (por ejemplo IPC/FACPCE) con valores mensuales; carga manual, importación y actualización. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.inflacion.editar`.
- **Recibe:** un cuerpo JSON cuya estructura detalla el anexo; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CON-29 (Índices de inflación).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1953 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-68-c)

<a id="API-CON-68-b"></a>
#### API-CON-68-b · `POST /api/admin/con/inflation-series`

- **Qué hace:** Series e índices (importación) Registra un nuevo elemento u operación en `inflation-series`.
- **Para qué sirve:** RF-CON-127: Tablas de índices (por ejemplo IPC/FACPCE) con valores mensuales; carga manual, importación y actualización. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.inflacion.editar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CON-29 (Índices de inflación).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1953 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-68-b)

<a id="API-CON-68-d"></a>
#### API-CON-68-d · `POST /api/admin/con/inflation-series/values`

- **Qué hace:** Series e índices (importación) Registra un nuevo elemento u operación en `values`.
- **Para qué sirve:** RF-CON-127: Tablas de índices (por ejemplo IPC/FACPCE) con valores mensuales; carga manual, importación y actualización. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.inflacion.editar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CON-29 (Índices de inflación).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1953 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-68-d)

<a id="API-CON-69"></a>
#### API-CON-69 · `POST /api/admin/con/inflation-runs`

- **Qué hace:** Ajuste por inflación → JOB-CON-06. Registra un nuevo elemento u operación en `inflation-runs`; el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-CON-131: Si falta un índice del rango, la corrida no se ejecuta y lista los meses faltantes. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.inflacion.ejecutar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-CON-30 (Ajuste por inflación).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1954 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-69)

<a id="API-CON-69-b"></a>
#### API-CON-69-b · `POST /api/admin/con/inflation-runs/{id}/post`

- **Qué hace:** Ajuste por inflación → JOB-CON-06. Contabiliza o asienta un registro de `post`; el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-CON-131: Si falta un índice del rango, la corrida no se ejecuta y lista los meses faltantes. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.inflacion.ejecutar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-CON-30 (Ajuste por inflación).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1954 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-69-b)

<a id="API-CON-69-c"></a>
#### API-CON-69-c · `POST /api/admin/con/inflation-runs/{id}/reverse`

- **Qué hace:** Ajuste por inflación → JOB-CON-06. Revierte un registro de `reverse`; el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-CON-131: Si falta un índice del rango, la corrida no se ejecuta y lista los meses faltantes. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.inflacion.ejecutar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-CON-30 (Ajuste por inflación).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1954 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-69-c)

<a id="API-CON-70"></a>
#### API-CON-70 · `GET /api/admin/con/account-mappings`

- **Qué hace:** Equivalencias y reconstrucción de proyección. Lista, con filtros y paginación, los registros de equivalencias entre planes (`accountMappings`).
- **Para qué sirve:** RF-CON-104: Proyección automática de los asientos oficiales a planes alternativos y regulatorios mediante equivalencias, como representación sin libros propios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.planes.editar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de equivalencias entre planes (`accountMappings`) con `total`.
- **Pantallas:** PAN-CON-32 (Equivalencias entre planes).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1955 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-70)

<a id="API-CON-70-c"></a>
#### API-CON-70-c · `PUT /api/admin/con/account-mappings`

- **Qué hace:** Equivalencias y reconstrucción de proyección. Reemplaza o configura equivalencias entre planes (`accountMappings`).
- **Para qué sirve:** RF-CON-104: Proyección automática de los asientos oficiales a planes alternativos y regulatorios mediante equivalencias, como representación sin libros propios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.planes.editar`.
- **Recibe:** los datos de equivalencias entre planes (`accountMappings`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de equivalencias entre planes (`accountMappings`).
- **Pantallas:** PAN-CON-32 (Equivalencias entre planes).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1955 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-70-c)

<a id="API-CON-70-b"></a>
#### API-CON-70-b · `POST /api/admin/con/account-mappings`

- **Qué hace:** Equivalencias y reconstrucción de proyección. Da de alta un registro de equivalencias entre planes (`accountMappings`).
- **Para qué sirve:** RF-CON-104: Proyección automática de los asientos oficiales a planes alternativos y regulatorios mediante equivalencias, como representación sin libros propios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.planes.editar`.
- **Recibe:** los datos de equivalencias entre planes (`accountMappings`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de equivalencias entre planes (`accountMappings`).
- **Pantallas:** PAN-CON-32 (Equivalencias entre planes).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1955 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-70-b)

<a id="API-CON-70-d"></a>
#### API-CON-70-d · `POST /api/admin/con/account-mappings/import`

- **Qué hace:** Equivalencias y reconstrucción de proyección. Importa sobre equivalencias entre planes (`accountMappings`).
- **Para qué sirve:** RF-CON-104: Proyección automática de los asientos oficiales a planes alternativos y regulatorios mediante equivalencias, como representación sin libros propios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.planes.editar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CON-32 (Equivalencias entre planes).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1955 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-70-d)

<a id="API-CON-70-e"></a>
#### API-CON-70-e · `POST /api/admin/con/account-mappings/rebuild`

- **Qué hace:** Equivalencias y reconstrucción de proyección. Registra un nuevo elemento u operación en equivalencias entre planes (`accountMappings`).
- **Para qué sirve:** RF-CON-104: Proyección automática de los asientos oficiales a planes alternativos y regulatorios mediante equivalencias, como representación sin libros propios. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.planes.editar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CON-32 (Equivalencias entre planes).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1955 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-70-e)

<a id="API-CON-71"></a>
#### API-CON-71 · `GET /api/admin/con/scenarios`

- **Qué hace:** Escenarios. Lista, con filtros y paginación, los registros de escenarios de simulación (`simulationScenarios`).
- **Para qué sirve:** RF-CON-106: Escenarios de simulación con plan elegido, período, universo de operaciones, supuestos (cambio de estructura, reparto de comunes, variación tarifaria, variación de costos) y fecha de corte. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.simulaciones.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de escenarios de simulación (`simulationScenarios`) con `total`.
- **Pantallas:** PAN-CON-33 (Escenarios de simulación).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1956 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-71)

<a id="API-CON-71-b"></a>
#### API-CON-71-b · `POST /api/admin/con/scenarios`

- **Qué hace:** Escenarios. Da de alta un registro de escenarios de simulación (`simulationScenarios`).
- **Para qué sirve:** RF-CON-106: Escenarios de simulación con plan elegido, período, universo de operaciones, supuestos (cambio de estructura, reparto de comunes, variación tarifaria, variación de costos) y fecha de corte. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.simulaciones.crear`.
- **Recibe:** los datos de escenarios de simulación (`simulationScenarios`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de escenarios de simulación (`simulationScenarios`).
- **Pantallas:** PAN-CON-33 (Escenarios de simulación).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1956 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-71-b)

<a id="API-CON-71-c"></a>
#### API-CON-71-c · `PATCH /api/admin/con/scenarios`

- **Qué hace:** Escenarios. Modifica algunos campos de un registro de escenarios de simulación (`simulationScenarios`) (solo los enviados).
- **Para qué sirve:** RF-CON-106: Escenarios de simulación con plan elegido, período, universo de operaciones, supuestos (cambio de estructura, reparto de comunes, variación tarifaria, variación de costos) y fecha de corte. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.simulaciones.crear`.
- **Recibe:** solo los campos a cambiar de escenarios de simulación (`simulationScenarios`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de escenarios de simulación (`simulationScenarios`).
- **Pantallas:** PAN-CON-33 (Escenarios de simulación).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1956 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-71-c)

<a id="API-CON-72"></a>
#### API-CON-72 · `POST /api/admin/con/scenarios/{id}/run`

- **Qué hace:** Ejecutar simulación → JOB-CON-09. Ejecuta un registro de escenarios de simulación (`simulationScenarios`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-CON-131: Si falta un índice del rango, la corrida no se ejecuta y lista los meses faltantes. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.simulaciones.ejecutar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-CON-33 (Escenarios de simulación).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1957 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-72)

<a id="API-CON-73"></a>
#### API-CON-73 · `GET /api/admin/con/scenarios/{id}/compare`

- **Qué hace:** Comparar con real. Consulta «compare» de un registro de escenarios de simulación (`simulationScenarios`).
- **Para qué sirve:** RF-CON-108: Comparar escenarios entre sí y contra el real con el mismo universo, distinguiendo diferencias de clasificación de cambios de valores. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.simulaciones.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de escenarios de simulación (`simulationScenarios`).
- **Pantallas:** PAN-CON-33 (Escenarios de simulación).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1958 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-73)

<a id="API-CON-74"></a>
#### API-CON-74 · `GET /api/admin/con/budgets`

- **Qué hace:** Presupuestos. Lista, con filtros y paginación, los registros de presupuestos (`budgets`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.presupuestos.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de presupuestos (`budgets`) con `total`.
- **Pantallas:** PAN-CON-34 (Presupuestos), PAN-CON-35 (Ejecución presupuestaria y compromisos).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1959 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-74)

<a id="API-CON-74-b"></a>
#### API-CON-74-b · `POST /api/admin/con/budgets`

- **Qué hace:** Presupuestos. Da de alta un registro de presupuestos (`budgets`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.presupuestos.editar`.
- **Recibe:** los datos de presupuestos (`budgets`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de presupuestos (`budgets`).
- **Pantallas:** PAN-CON-34 (Presupuestos).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1959 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-74-b)

<a id="API-CON-74-c"></a>
#### API-CON-74-c · `PATCH /api/admin/con/budgets`

- **Qué hace:** Presupuestos. Modifica algunos campos de un registro de presupuestos (`budgets`) (solo los enviados).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.presupuestos.editar`.
- **Recibe:** solo los campos a cambiar de presupuestos (`budgets`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de presupuestos (`budgets`).
- **Pantallas:** PAN-CON-34 (Presupuestos).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1959 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-74-c)

<a id="API-CON-74-d"></a>
#### API-CON-74-d · `POST /api/admin/con/budgets/lines`

- **Qué hace:** Presupuestos. Registra un nuevo elemento u operación en presupuestos (`budgets`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.presupuestos.editar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CON-34 (Presupuestos).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1959 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-74-d)

<a id="API-CON-74-e"></a>
#### API-CON-74-e · `POST /api/admin/con/budgets/import`

- **Qué hace:** Presupuestos. Importa sobre presupuestos (`budgets`).
- **Para qué sirve:** Sin requisito identificable en el anexo; la descripción de la fila es la única fuente.
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.presupuestos.editar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CON-34 (Presupuestos).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1959 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-74-e)

<a id="API-CON-75"></a>
#### API-CON-75 · `POST /api/admin/con/budgets/{id}/submit`

- **Qué hace:** Ciclo de aprobación. Envía a revisión o presenta un registro de presupuestos (`budgets`).
- **Para qué sirve:** RF-CON-144: Aprobación y versionado del presupuesto (original y reformulaciones) con vigencia y auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.presupuestos.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CON-34 (Presupuestos).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1960 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-75)

<a id="API-CON-75-b"></a>
#### API-CON-75-b · `POST /api/admin/con/budgets/{id}/approve`

- **Qué hace:** Ciclo de aprobación. Aprueba un registro de presupuestos (`budgets`).
- **Para qué sirve:** RF-CON-144: Aprobación y versionado del presupuesto (original y reformulaciones) con vigencia y auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.presupuestos.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CON-34 (Presupuestos).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1960 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-75-b)

<a id="API-CON-75-c"></a>
#### API-CON-75-c · `POST /api/admin/con/budgets/{id}/reformulate`

- **Qué hace:** Ciclo de aprobación. Registra «reformulate» sobre un registro de presupuestos (`budgets`).
- **Para qué sirve:** RF-CON-144: Aprobación y versionado del presupuesto (original y reformulaciones) con vigencia y auditoría. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.presupuestos.editar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CON-34 (Presupuestos).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1960 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-75-c)

<a id="API-CON-76"></a>
#### API-CON-76 · `GET /api/admin/con/budgets/{id}/execution`

- **Qué hace:** Ejecución presupuestaria. Consulta «execution» de un registro de presupuestos (`budgets`).
- **Para qué sirve:** RF-CON-147: Ejecución presupuestaria: presupuesto, comprometido, devengado y pagado como columnas separadas que no se suman entre sí, por cuenta, centro, servicio y mes, con desvíos. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.presupuestos.ver`.
- **Recibe:** en la ruta `id`.
- **Devuelve:** 200: el registro de presupuestos (`budgets`).
- **Pantallas:** PAN-CON-34 (Presupuestos), PAN-CON-35 (Ejecución presupuestaria y compromisos).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1961 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-76)

<a id="API-CON-77"></a>
#### API-CON-77 · `GET /api/con/budget-check`

- **Qué hace:** Disponible para una imputación prevista (cuenta, centro, servicio, mes, importe) Consulta `budget-check`.
- **Para qué sirve:** RF-CON-143: Presupuesto económico por ejercicio y versión, por cuenta, centro de costo, servicio y mes; carga manual, importación Excel, copia del ejercicio anterior con porcentaje de ajuste y distribución estacional. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `con.presupuestos.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CON-34 (Presupuestos), PAN-CON-35 (Ejecución presupuestaria y compromisos).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1962 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-77)

<a id="API-CON-78"></a>
#### API-CON-78 · `POST /api/admin/con/commitments/{id}/authorize-excess`

- **Qué hace:** Autorizar exceso / liberar. Registra «authorize-excess» sobre un registro de compromisos presupuestarios (`commitments`).
- **Para qué sirve:** RF-CON-145: Compromisos: la OC aprobada (y opcionalmente contratos y SA autorizadas) compromete presupuesto; se libera al cancelar; se reduce al devengar la factura. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.compromisos.autorizarExceso`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CON-35 (Ejecución presupuestaria y compromisos).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1963 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-78)

<a id="API-CON-78-b"></a>
#### API-CON-78-b · `POST /api/admin/con/commitments/{id}/release`

- **Qué hace:** Autorizar exceso / liberar. Libera un registro de compromisos presupuestarios (`commitments`).
- **Para qué sirve:** RF-CON-145: Compromisos: la OC aprobada (y opcionalmente contratos y SA autorizadas) compromete presupuesto; se libera al cancelar; se reduce al devengar la factura. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.compromisos.autorizarExceso`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CON-35 (Ejecución presupuestaria y compromisos).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1963 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-78-b)

<a id="API-CON-79"></a>
#### API-CON-79 · `GET /api/admin/con/statement-templates`

- **Qué hace:** Plantillas de estados. Lista, con filtros y paginación, los registros de modelos de estados contables (`statementTemplates`).
- **Para qué sirve:** RF-CON-084: Modelos de distribución reutilizables (plantillas) seleccionables al asignar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.estados.generar`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de modelos de estados contables (`statementTemplates`) con `total`.
- **Pantallas:** PAN-CON-36 (Estados contables y plantillas).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1964 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-79)

<a id="API-CON-79-b"></a>
#### API-CON-79-b · `POST /api/admin/con/statement-templates`

- **Qué hace:** Plantillas de estados. Da de alta un registro de modelos de estados contables (`statementTemplates`).
- **Para qué sirve:** RF-CON-084: Modelos de distribución reutilizables (plantillas) seleccionables al asignar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.estados.generar`.
- **Recibe:** los datos de modelos de estados contables (`statementTemplates`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 201: el registro de modelos de estados contables (`statementTemplates`).
- **Pantallas:** PAN-CON-36 (Estados contables y plantillas).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1964 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-79-b)

<a id="API-CON-79-c"></a>
#### API-CON-79-c · `PATCH /api/admin/con/statement-templates`

- **Qué hace:** Plantillas de estados. Modifica algunos campos de un registro de modelos de estados contables (`statementTemplates`) (solo los enviados).
- **Para qué sirve:** RF-CON-084: Modelos de distribución reutilizables (plantillas) seleccionables al asignar. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.estados.generar`.
- **Recibe:** solo los campos a cambiar de modelos de estados contables (`statementTemplates`); cabeceras `Idempotency-Key` opcional y `If-Match` con la versión leída.
- **Devuelve:** 200: el registro de modelos de estados contables (`statementTemplates`).
- **Pantallas:** PAN-CON-36 (Estados contables y plantillas).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1964 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-79-c)

<a id="API-CON-80"></a>
#### API-CON-80 · `POST /api/admin/con/statement-runs`

- **Qué hace:** Estados contables → JOB-CON-15. Registra un nuevo elemento u operación en emisión de estados contables (`financialStatementRuns`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-CON-003: Fecha contable base por módulo: emisión, fecha contable del comprobante de compra (FEC_CON), fecha de acreditación, fecha de confirmación del pago o cierre de caja; opción de usar fecha de emisión en ventas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.estados.generar`.
- **Recibe:** los datos de emisión de estados contables (`financialStatementRuns`); cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-CON-36 (Estados contables y plantillas).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1965 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-80)

<a id="API-CON-80-b"></a>
#### API-CON-80-b · `POST /api/admin/con/statement-runs/{id}/approve`

- **Qué hace:** Estados contables → JOB-CON-15. Aprueba un registro de emisión de estados contables (`financialStatementRuns`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-CON-003: Fecha contable base por módulo: emisión, fecha contable del comprobante de compra (FEC_CON), fecha de acreditación, fecha de confirmación del pago o cierre de caja; opción de usar fecha de emisión en ventas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.estados.generar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-CON-36 (Estados contables y plantillas).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1965 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-80-b)

<a id="API-CON-80-c"></a>
#### API-CON-80-c · `POST /api/admin/con/statement-runs/{id}/issue`

- **Qué hace:** Estados contables → JOB-CON-15. Emite un registro de emisión de estados contables (`financialStatementRuns`); el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-CON-003: Fecha contable base por módulo: emisión, fecha contable del comprobante de compra (FEC_CON), fecha de acreditación, fecha de confirmación del pago o cierre de caja; opción de usar fecha de emisión en ventas. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.estados.generar`.
- **Recibe:** en la ruta `id`; el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-CON-36 (Estados contables y plantillas).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1965 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-80-c)

<a id="API-CON-81"></a>
#### API-CON-81 · `GET /api/admin/con/external/mappings`

- **Qué hace:** Mapeo sistema externo. Lista, con filtros y paginación, los registros de equivalencias entre planes (`accountMappings`).
- **Para qué sirve:** RF-CON-139: Mapeo de operaciones y cuentas propias a cuentas y rubros de un sistema contable externo (operación, cuenta, rubro, observación). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.externo.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de equivalencias entre planes (`accountMappings`) con `total`.
- **Pantallas:** PAN-CON-37 (Sistema contable externo).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1966 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-81)

<a id="API-CON-81-b"></a>
#### API-CON-81-b · `PUT /api/admin/con/external/mappings`

- **Qué hace:** Mapeo sistema externo. Reemplaza o configura equivalencias entre planes (`accountMappings`).
- **Para qué sirve:** RF-CON-139: Mapeo de operaciones y cuentas propias a cuentas y rubros de un sistema contable externo (operación, cuenta, rubro, observación). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.externo.configurar`.
- **Recibe:** los datos de equivalencias entre planes (`accountMappings`); cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: el registro de equivalencias entre planes (`accountMappings`).
- **Ola:** O8 · **Fuente:** M15 §11. API, línea 1966 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-81-b)

<a id="API-CON-82"></a>
#### API-CON-82 · `POST /api/admin/con/external/exports`

- **Qué hace:** Exportar / importar → JOB-CON-12 / JOB-CON-13. Registra un nuevo elemento u operación en `exports`; el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-CON-140: Exportación de asientos y mayores al sistema externo con layouts configurables (CSV, TXT posicional, XLSX) mediante el exportador de T06, incremental, idempotente y con marca de exportado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.externo.ejecutar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-CON-37 (Sistema contable externo).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1967 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-82)

<a id="API-CON-82-b"></a>
#### API-CON-82-b · `POST /api/admin/con/external/imports`

- **Qué hace:** Exportar / importar → JOB-CON-12 / JOB-CON-13. Registra un nuevo elemento u operación en `imports`; el trabajo corre en segundo plano y la respuesta trae cómo seguirlo.
- **Para qué sirve:** RF-CON-140: Exportación de asientos y mayores al sistema externo con layouts configurables (CSV, TXT posicional, XLSX) mediante el exportador de T06, incremental, idempotente y con marca de exportado. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.externo.ejecutar`.
- **Recibe:** el motivo, un comentario y los datos propios de la acción; cabeceras `Idempotency-Key` obligatoria.
- **Devuelve:** 202: el identificador del trabajo encolado y la URL para seguirlo.
- **Pantallas:** PAN-CON-37 (Sistema contable externo).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1967 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-82-b)

<a id="API-CON-83"></a>
#### API-CON-83 · `GET /api/admin/con/capital-rubrics`

- **Qué hace:** Rubros de capital. Consulta `capital-rubrics`.
- **Para qué sirve:** RF-CON-139: Mapeo de operaciones y cuentas propias a cuentas y rubros de un sistema contable externo (operación, cuenta, rubro, observación). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.cuentas.editar`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CON-04 (Árbol y ficha de cuentas), PAN-CON-05 (Rubros y subrubros contables), PAN-CON-38 (Rubros de capital).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1968 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-83)

<a id="API-CON-83-b"></a>
#### API-CON-83-b · `PUT /api/admin/con/capital-rubrics`

- **Qué hace:** Rubros de capital. Reemplaza o configura `capital-rubrics`.
- **Para qué sirve:** RF-CON-139: Mapeo de operaciones y cuentas propias a cuentas y rubros de un sistema contable externo (operación, cuenta, rubro, observación). *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.cuentas.editar`.
- **Recibe:** un cuerpo JSON cuya estructura detalla el anexo; cabeceras `Idempotency-Key` opcional.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CON-04 (Árbol y ficha de cuentas), PAN-CON-05 (Rubros y subrubros contables), PAN-CON-38 (Rubros de capital).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1968 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-83-b)

<a id="API-CON-84"></a>
#### API-CON-84 · `GET /api/admin/con/health`

- **Qué hace:** Hallazgos de salud de configuración. Consulta `health`.
- **Para qué sirve:** RF-CON-005: Validador de salud de la configuración contable ("cuentas sin asignar"): lista cada rol, regla, entidad o combinación de dimensiones sin cuenta resoluble, con el enlace a la pantalla donde se configura; corre a demanda, al… *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.config.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CON-02 (Configuración contable), PAN-CON-40 (Salud de la configuración contable).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1969 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-84)

<a id="API-CON-85"></a>
#### API-CON-85 · `GET /api/con/linked-entry`

- **Qué hace:** Asiento(s) vinculado(s) a un documento. Consulta `linked-entry`.
- **Para qué sirve:** RF-CON-057: Vínculo bidireccional documento ↔ evento ↔ asiento ↔ renglón. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `con.asientos.verVinculado`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1970 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-85)

<a id="API-CON-86"></a>
#### API-CON-86 · `GET /api/con/accounts/lookup`

- **Qué hace:** Búsqueda de cuentas imputables del plan operativo (para asignaciones) Lista, con filtros y paginación, los registros de cuentas contables (`ledgerAccounts`).
- **Para qué sirve:** RF-CON-006: La publicación de configuración de un servicio, concepto, impuesto, medio de pago, banco, caja o grupo contable nuevo advierte (o bloquea, según política) si no tiene regla de imputación resuelta en el plan operativo. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Usuarios autenticados con el permiso indicado; permiso `con.cuentas.ver`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de cuentas contables (`ledgerAccounts`) con `total`.
- **Pantallas:** PAN-CON-04 (Árbol y ficha de cuentas).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1971 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-86)

<a id="API-CON-87"></a>
#### API-CON-87 · `GET /api/admin/con/dashboard`

- **Qué hace:** Indicadores del tablero. Consulta `dashboard`.
- **Para qué sirve:** RF-CON-157: Tablero contable con estado de períodos, eventos pendientes, borradores, conciliaciones con diferencias, alertas de configuración y vencimientos de cierre. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Personal de la cooperativa, desde el backoffice; permiso `con.asientos.ver`.
- **Recibe:** nada.
- **Devuelve:** 200: un resultado cuya estructura no está definida en el anexo (a precisar en diseño detallado).
- **Pantallas:** PAN-CON-01 (Tablero contable), PAN-CON-12 (Diario (asientos)).
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1972 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-87)

<a id="API-CON-88"></a>
#### API-CON-88 · `GET /api/v1/ext/con/balances`

- **Qué hace:** Sumas y saldos por período (solo lectura, para estudio contable o BI) Lista, con filtros y paginación, los registros de saldos reconstruibles desde journalLines (`ledgerBalances`).
- **Para qué sirve:** RF-CON-115: Sumas y saldos / balance de comprobación por período, por meses o acumulado, por nivel, con detalle por sección y acceso al mayor. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); permiso `con.ext.saldos`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de saldos reconstruibles desde journalLines (`ledgerBalances`) con `total`.
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1973 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-88)

<a id="API-CON-89"></a>
#### API-CON-89 · `GET /api/v1/ext/con/entries`

- **Qué hace:** Asientos contabilizados por rango (solo lectura, paginado) Lista, con filtros y paginación, los registros de asientos (`journalEntries`).
- **Para qué sirve:** RF-CON-156: Rendimiento: contabilizar el lote de 100.000 facturas del ciclo en resumen dentro de la ventana operativa; mayores y sumas y saldos paginados con respuesta interactiva. *(a confirmar: vínculo inferido)*
- **Quién lo usa:** Sistemas de terceros integrados (API externa, con credenciales de cliente); permiso `con.ext.asientos`.
- **Recibe:** filtros de búsqueda y paginación (`page`, `size`, `sort`, `q`).
- **Devuelve:** 200: una página de asientos (`journalEntries`) con `total`.
- **Ola:** O5 · **Fuente:** M15 §11. API, línea 1974 · [Ver en Swagger](../18-swagger/index.html?api=m15-con#/API/API-CON-89)
