# T04b CFG — Catálogo de parámetros ProCoop → CoopApps (Parte 4: Técnica, Telemedición, Telefonía, SMS, Compras, Stock, Fabricación, Contabilidad, Tesorería, Sueldos, Vivienda, Turnero, Tickets, Mesa de entradas, Actividades y no catalogados)

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Estado | Especificación consolidada — pendiente de validar preguntas abiertas |
| Solución (BASE §105) | Plataforma / ERP / CRM |
| Olas | O1 (motor de parámetros), y la ola de cada módulo destino (O3 técnica Internet, O5 contabilidad núcleo, O7 medición, O8 ERP administrativo, O9 sueldos, O10 vivienda/telefonía/turnero) |
| Dueño de datos | T04 CFG es dueño del registro de parámetros (`tenantParameters`, alias de `parameterValues` según CTR-CFG-14 y CTR-DAT-49; versionado y publicado); cada módulo destino es dueño de la semántica de sus claves |
| Fuentes consolidadas | RN-09 §2 (almacenamiento), §6.2 (totales) y §6 catálogo de los módulos TECNICA, TELEMED, TELEFONIA, SMS, COMPRAS, STOCK, FABRICACION, CONTABILIDAD, TESORERIA, SUELDOS, VIVIENDA, TURNERO, TICKETS, MESA_DE_ENTRADAS, ACTIVIDADES y no catalogados; RN-08 §12; RN-07 §9 |


> **Norma de implementación (DEC-111, DEC-112, DEC-110, DEC-113).** Construcción GoodApps: **.NET 10**, **ASP.NET Core**, **EF Core**, **Azure SQL** (base compartida, `TenantId` en tablas de negocio), front **React 19**, **Microsoft Azure** (Container Apps, Blob, Queue, Key Vault, Application Insights), identidad **OpenIddict**. Modelo físico: `07-modelo-relacional-azure-sql.md` y `07-catalogo-tablas-sql.md`. Checklist e impacto: `06-impacto-adaptacion-stack-goodapps.md` (**DIR-13**).
>
> **Lectura:** «colección» en este anexo = **entidad lógica**; tablas, columnas y FK en `07-*`. RF/RN/CU del anexo **no cambian** por el stack.


## 1. Propósito

Convertir **cada uno** de los 483 parámetros `Busca_V2_*` de ProCoop pertenecientes a los módulos listados en el título en su destino en CoopApps: un parámetro tipado del tenant (`PRM-…`), una propiedad de la definición de servicio, una regla de imputación del motor de asientos (M15), una clave de diccionario, un elemento de marca o plantilla (T03), una configuración de plataforma, una referencia a bóveda de secretos (T06), un mecanismo nuevo que lo reemplaza o un descarte con motivo. Es la prueba de exhaustividad de la regla de oro (guía §1) para este subconjunto del catálogo V2: no queda ningún número sin destino.

Las partes 1 a 3 de T04b cubren SISTEMA, CONFIGURACION, TITULARES, VENTAS_Y_FACTURACION, COBRANZA, GESTION_DE_MORA, FINANCIACIONES y CONSUMOS. Si un parámetro de esta parte coincide funcionalmente con uno de otra parte (por ejemplo, la 74 de interés por mora), **prevalece una única clave nueva** y el anexo de módulo la declara una sola vez en su §14.

## 2. Fuente

- **RN-09** `procoop-relevamiento/reglas-negocio/09-parametros-y-configuracion.md`: §2 (tablas `VARIABLE` / `VARIABLE_PMOVIL`, tipos `TIP_VAR`, editores `TIP_CTRL`: 1 FK, 2 lista, 5 ruta, 6 cuenta contable), §6.2 (totales por módulo) y catálogo por módulo (descripción oficial `NOM_VAR` y lecturas en código).
- **RN-08 §12** (tesorería, retenciones, contabilidad y cierre automático, compras y stock, sueldos) y **RN-07 §9** (técnica, telefonía, WhatsApp): significado inferido del uso real en el código.
- Los valores secretos (API keys, tokens, claves AWS) **no se transcriben**: solo se registra que existen y su destino en bóveda.

## 3. Criterio de decisión

| Decisión | Significado | Qué se genera |
|---|---|---|
| **Migrar** | El comportamiento sigue siendo configurable por la cooperativa. | `PRM-<COD>-P4-NNN` tipado (Zod) en el registro de parámetros del tenant, con versión, vigencia y auditoría (T04). El migrador (T07) copia el valor de `VARIABLE`/`VARIABLE_PMOVIL`. |
| **Migrar-servicio** | Configurable, pero su ámbito natural es el **servicio** (o la categoría, o el conector del servicio), no la cooperativa entera. ProCoop lo resolvía con un parámetro global que apuntaba a un servicio o valía para todos. | Propiedad del `serviceDefinition` (M02) o del conector del servicio, con `PRM-…` y herencia tenant → servicio → categoría. |
| **Cuenta contable** | El parámetro es una cuenta del plan (`TIP_CTRL = 6`). | Regla de imputación del motor de asientos automáticos de M15 (`postingRules`): evento económico + rol contable → cuenta, con override por servicio / centro de costo. Se migra mapeando el código de cuenta ProCoop al plan migrado. |
| **Diccionario** | Es un texto visible. | Clave `dict:<clave>` (T03). |
| **Marca** | Es un informe/plantilla de impresión o un elemento de identidad. | Plantilla de documento del tenant (T03 marca y plantillas; T10 reportes). |
| **Plataforma** | Lo decide o mantiene la plataforma SaaS (infraestructura, tablas legales comunes, proveedores contratados centralmente). | Configuración `PLATFORM` (T01), con override del tenant si se indica. |
| **Bóveda** | Es un secreto (token, API key, clave). | Referencia `secretRef` a la bóveda de credenciales por tenant (T06). El valor nunca se guarda en parámetros ni se transcribe. El migrador lo carga directo a bóveda. |
| **Reemplazado** | Lo resuelve un mecanismo nuevo del sistema (estado de job, `DataTable`, cola offline, bloqueo de período, maestro, auditoría, capability). | Se indica el mecanismo; no genera PRM. Si el valor ProCoop tiene que sobrevivir, se dice cómo lo migra T07. |
| **Descartar** | No aporta comportamiento en CoopApps (sin uso, duplicado, cosmético de WinForms, heredado). | Se indica el motivo; no genera PRM. |

## 4. Leyenda de columnas

- **V2 #**: `COD_VAR` de ProCoop. **Tabla/canal**: `VAR` = `VARIABLE`; `PMOVIL` = `VARIABLE_PMOVIL` con canal (PMovil = app de campo/lecturas; CoopOnline = web/app del socio).
- **Tipo**: tipo ProCoop (L lógico, E entero, N numérico, C texto, F fecha como texto, Lista, FK a tabla, Cuenta, Mixto).
- **Uso en código**: lectura directa resumida (clase.método); "s/l" = sin lectura directa en los fuentes descompilados (lo usan PMovil, CoopOnline, el Agente, SP o un enum).
- **PRM-ID**: `PRM-<COD del anexo destino>-P4-NNN`. Si varios números V2 se fusionan en un único parámetro nuevo, comparten el PRM-ID (se indica "compartido"). Las decisiones Diccionario, Marca, Plataforma, Reemplazado y Descartar llevan "—".
- **Clave nueva**: camelCase con prefijo del módulo nuevo (`tec.`, `crm.`, `med.`, `tar.`, `com.`, `cmp.`, `stk.`, `con.`, `tes.`, `sue.`, `soc.`, `cob.`, `mor.`, `fac.`, `fis.`, `ven.`, `por.`). `[x]` indica un elemento de una lista (`enum[]`) o de un mapa.
- **Tipo nuevo**: `boolean`, `integer`, `decimal`, `money` (Decimal128), `string`, `string[]`, `enum(...)`, `enum[]`, `map`, `ref:<colección>`, `accountRef`, `secretRef`, `object`.
- **Ámbito**: plataforma / tenant / servicio / categoría / sucursal / conector / cuenta bancaria / pantalla / tipo de tarea (con herencia hacia el más específico).
- **Default sugerido**: valor para tenants nuevos. Para tenants migrados prevalece el valor ProCoop. "—" = debe configurarse (referencia a maestro).
- Las semánticas invertidas ("No permitir…") se normalizan a clave positiva y se indica "(invertido)": el migrador niega el valor.

## 5. Catálogo por módulo ProCoop

> **Barrido transversal (19-11-2026, DEC-111).** Los RF/RN de **§5–§6** definen comportamiento aceptado. Citas a MongoDB, Mongoose, BullMQ, Vue o npm son **mecanismos históricos Connectia** o columnas de contraste; en build GoodApps prevalecen `03-norma-ejecucion-goodapps.md` §3–§4, `07-ddl` y §7 de este anexo. No reinterpretar alcance sin nueva DEC.


### 5.1 TECNICA (95)

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---:|---|---|---|---|---|---|---|---|---|---|---|
| 2 | PMOVIL/PMovil | L | Permite agregar órdenes de trabajo desde el captor | s/l (PMovil) | Migrar | PRM-TEC-P4-001 | tec.fieldApp.allowCreateWorkOrder | boolean | tenant (+perfil de campo) | false | M10 |
| 10 | PMOVIL/PMovil | L | Sincronización automática de lecturas | s/l (PMovil) | Reemplazado — cola offline única IndexedDB con `clientMutationId`: sincroniza sola al recuperar conexión (CNX) | — | — | — | — | — | M03 |
| 11 | PMOVIL/CoopOnline | L | Registrar pagos a través de CoopOnline (los pagos web/app se registran vía Agente) | clsWeb_CoopOnline.ValidarConfiguracion / IniciarEscuchaCobranza; Siro_Alternativo.Importar | Reemplazado — los pagos del portal/app se registran nativamente (evento `cob.payment.confirmed`); no existe base web separada ni Agente | — | — | — | — | — | M07 |
| 16 | PMOVIL/PMovil | L | Forzar foto del medidor al registrar la lectura | s/l (PMovil) | Migrar-servicio | PRM-MED-P4-001 | med.reading.requirePhoto | boolean | servicio | false | M03 |
| 33 | PMOVIL/PMovil | C | URL del WebService para generar OT desde PMovil | s/l (PMovil) | Reemplazado — la app de campo usa la API propia (`/api/tec/...`); no hay URL configurable | — | — | — | — | — | M10 |
| 48 | PMOVIL/PMovil | L | Permitir cerrar órdenes de trabajo desde PMovil | s/l (PMovil) | Migrar | PRM-TEC-P4-002 | tec.fieldApp.allowCloseWorkOrder | boolean | tenant / tipo de tarea | true | M10 |
| 50 | PMOVIL/PMovil | L | Solicitar firma digital al confirmar la orden | s/l (PMovil) | Migrar | PRM-TEC-P4-003 | tec.fieldApp.requireSignatureOnClose | boolean | tenant / tipo de tarea | true (instalación integral) | M10 |
| 51 | PMOVIL/PMovil | L | Solicitar encuesta de conformidad al cerrar la orden | s/l (PMovil) | Migrar | PRM-TEC-P4-004 | tec.fieldApp.requireSatisfactionSurvey | boolean | tenant / tipo de tarea | true | M10 (+T09) |
| 53 | PMOVIL/CoopOnline | Lista | Mensaje automático al registrar ventas: No enviar / SMS / WhatsApp | clsPMovil_Venta.Sincronizar_Venta | Migrar | PRM-VEN-P4-001 | ven.sale.autoNotifyChannel | enum(none, sms, whatsapp, email, push) | tenant | none | M11 (+T09) |
| 54 | PMOVIL/PMovil | L | Cerrar operaciones seleccionadas desde PMovil | s/l (PMovil) | Migrar | PRM-TEC-P4-005 | tec.fieldApp.allowBulkClose | boolean | tenant | false | M10 |
| 57 | PMOVIL/PMovil | L | No sincronizar las órdenes modificadas | s/l (PMovil) | Reemplazado — control optimista (`version`) + `clientMutationId`; los conflictos se resuelven en la cola offline, no se omiten | — | — | — | — | — | M10 |
| 58 | PMOVIL/CoopOnline | L | Generar OT de reclamos en la web | s/l (CoopOnline) | Migrar | PRM-CRM-P4-001 | crm.claim.portalAutoCreateWorkOrder | boolean | tenant / tipo de reclamo | false | M09 |
| 62 | PMOVIL/PMovil | L | Mensaje de confirmación al cancelar orden | s/l (PMovil) | Descartar — `ConfirmDialog` es obligatorio en toda acción destructiva (CNX); no es configurable | — | — | — | — | — | M10 |
| 64 | PMOVIL/PMovil | L | Mostrar número de medidor en la selección de órdenes | s/l (PMovil) | Reemplazado — la card fija de OT en la PWA muestra el medidor cuando el servicio es medido | — | — | — | — | — | M10 |
| 70 | PMOVIL/PMovil | L | Generar OT de cambio de medidor de servicio no medido desde PMovil | s/l (PMovil) | Migrar | PRM-TEC-P4-006 | tec.fieldApp.allowMeterChangeOnUnmetered | boolean | tenant | false | M10 |
| 174 | VAR | L | Exigir observaciones administrativas en OT | s/l | Migrar | PRM-TEC-P4-007 | tec.workOrder.requireAdminNotes | boolean | tenant / tipo de tarea | false | M10 |
| 180 | VAR | C | Informe por defecto para orden de trabajo | clsInformes_Tecnica.Get_Reporte_DetalleOrden_Nombre | Marca — plantilla de impresión de OT del tenant (por tipo de tarea) | — | uxd.template.workOrder | ref:documentTemplates | tenant / tipo de tarea | plantilla estándar | T03 (+M10) |
| 254 | VAR | L | Preguntar si agrega el consumo calculado al confirmar OT | s/l | Migrar-servicio | PRM-TEC-P4-008 | tec.workOrder.addCalculatedConsumptionOnClose | enum(no, ask, auto) | servicio | ask | M10 (+M03) |
| 333 | VAR | E | Vía de ingreso por defecto para OT | s/l | Migrar | PRM-TEC-P4-009 | tec.workOrder.defaultIntakeChannelId | ref:crmChannels (antes `ref:intakeChannels`, absorbida por `crmChannels` de M09; T05 COL-TEC-76) | tenant | — | M10 |
| 341 | VAR | E | Usuario para ProCoop AVL | s/l | Reemplazado — el conector GPS/AVL actúa con identidad técnica de integración y credenciales en bóveda (T06); sin usuario humano compartido | — | — | — | — | — | M18 |
| 342 | VAR | L | Exigir responsable al confirmar OT | s/l | Migrar | PRM-TEC-P4-010 | tec.workOrder.requireResponsibleOnClose | boolean | tenant / tipo de tarea | true | M10 |
| 344 | VAR | Lista | Numeración única de OT por servicio y año: No utilizar / por reclamo o no reclamo / por tipo de tarea / por tipo de tarea y reclamo | clsTecnica.Get_New_CODSLS | Migrar | PRM-TEC-P4-011 | tec.workOrder.numberingMode | enum(global, byServiceYearClaimFlag, byServiceYearTaskType, byServiceYearTaskTypeAndClaim) | tenant | global | M10 |
| 358 | VAR | L | Impresión de OT con mapa | clsInformes_Tecnica.Get_Reporte_DetalleOrden_ParametrosOT / OM | Migrar | PRM-TEC-P4-012 | tec.workOrder.printWithMap | boolean | tenant | true | M10 |
| 388 | VAR | L | Exigir factibilidad en altas y reconexiones de servicios que informan a Técnica | s/l | Migrar-servicio | PRM-TEC-P4-013 | tec.feasibility.requiredOnActivation | boolean | servicio | true (Internet) | M10 |
| 401 | VAR | L | Exigir punto de conexión a red física en OT | s/l | Migrar-servicio | PRM-TEC-P4-014 | tec.workOrder.requireNetworkNode | boolean | servicio | false (true en Internet/FTTH) | M10 |
| 430 | VAR | E | Activar integración con AVL Plus | s/l | Reemplazado — habilitación del conector GPS/AVL por tenant en T06 | — | — | — | — | — | M18 (+T06) |
| 441 | VAR | L | Permitir confirmar órdenes con fecha anterior al alta | s/l | Migrar | PRM-TEC-P4-015 | tec.workOrder.allowCloseBeforeCreatedDate | boolean | tenant | false | M10 |
| 443 | VAR | L | No permitir modificar precio de materiales a facturar en OT | clsCobranzas.Get_ConceptosCobrar / AgregarConceptoBonificacion | Migrar | PRM-TEC-P4-016 | tec.workOrder.lockBillableMaterialPrice | boolean | tenant | true | M10 (+M05) |
| 448 | VAR | L | No permitir modificar precio de materiales a facturar en OT (duplicado) | s/l | Descartar — duplicado sin lectura de la 443; se unifica en PRM-TEC-P4-016 | — | — | — | — | — | M10 |
| 460 | VAR | L (usado como concepto) | Concepto para horas hombre en OT | GetDatosInforme.GetCosto_OT / GetCosto_OM | Migrar | PRM-TEC-P4-017 | tec.workOrder.laborConceptId | ref:products | tenant | — | M10 (+M13) |
| 465 | VAR | L | Permitir modelo de OT según operación | s/l | Migrar | PRM-TEC-P4-018 | tec.workOrder.templateByTaskType | boolean | tenant | true | M10 |
| 474 | VAR | L | Exigir categorías al confirmar OT | s/l | Migrar | PRM-TEC-P4-019 | tec.workOrder.requireCategoriesOnClose | boolean | tenant / tipo de tarea | false | M10 |
| 497 | VAR | L | Exigir resolución al confirmar OT | s/l | Migrar | PRM-TEC-P4-020 | tec.workOrder.requireResolutionOnClose | boolean | tenant / tipo de tarea | true | M10 |
| 752 | VAR | L | Permitir confirmar órdenes con fecha posterior | s/l | Migrar | PRM-TEC-P4-021 | tec.workOrder.allowFutureCloseDate | boolean | tenant | false | M10 |
| 911 | PMOVIL/CoopOnline | Lista | Adhesión a factura web: No permitir / con mail / con mail y teléfono | s/l (CoopOnline) | Migrar | PRM-POR-P4-001 | por.eInvoiceOptIn.mode | enum(disabled, email, emailAndPhone) | tenant | email | M19 (+M05) |
| 2084 | VAR | L | Exigir cantidad de personas al confirmar OT | s/l | Migrar | PRM-TEC-P4-022 | tec.workOrder.requireCrewSize | boolean | tenant / tipo de tarea | false | M10 |
| 2268 | VAR | L | Permitir cambiar fecha de ingreso de OT | s/l | Migrar | PRM-TEC-P4-023 | tec.workOrder.allowEditIntakeDate | boolean | tenant | false (con auditoría) | M10 |
| 2339 | VAR | L | Precargar observación administrativa de la OT desde el servicio | clsTecnica.Crear_OT | Migrar | PRM-TEC-P4-024 | tec.workOrder.prefillNotesFromService | boolean | tenant | true | M10 |
| 2354 | VAR | L | Exigir horas de los participantes en OT | s/l | Migrar | PRM-TEC-P4-025 | tec.workOrder.requireParticipantHours | boolean | tenant / tipo de tarea | false | M10 |
| 2370 | VAR | N | Segundos de espera para código NEXO SQL | NEXO_SQL.ObtenerRespuesta | Migrar | PRM-MED-P4-002 | med.prepaid.nexoResponseTimeoutSec | integer | conector | 30 | M03 (+T06) |
| 2393 | VAR | C | Perfil de MikroTik para servicios desconectados | MikroTik.CorteServicio | Migrar-servicio | PRM-TEC-P4-026 | tec.provisioning.mikrotik.suspendedProfile | string | servicio / conector | — | M10 |
| 2399 | VAR | L | Borrar datos del medidor al marcar "Retirado" al confirmar OT | clsTecnica.PreSave_TECNICA; clsSocios.Actualizar_Medidor_SERSOC | Reemplazado — el retiro cierra la vigencia (`validTo`) de la vinculación medidor–servicio conservando historial; nunca se borran número ni matrícula | — | — | — | — | — | M03 (+M10) |
| 2421 | VAR | Lista | Validar número de certificado al confirmar OT: No / Advertir / Exigir | s/l | Migrar-servicio | PRM-TEC-P4-027 | tec.workOrder.certificateNumberCheck | enum(off, warn, require) | servicio | warn | M10 |
| 2422 | VAR | L | Usar datos técnicos de Partner en servicio de Internet | DatosInternet (control de UI) | Reemplazado — ficha técnica de Internet propia de M10 alimentada por los conectores de aprovisionamiento; Partner queda como conector opcional en T06 | — | — | — | — | — | M10 (+T06) |
| 2425 | VAR | C | Códigos de servicios a usar en mapas GIS (separados por coma) | GIS.Update_SincronizarParcela; frmImportacionArchivos.Importar_GIS | Migrar-servicio | PRM-TEC-P4-028 | tec.gis.enabled | boolean | servicio | false | M10 |
| 2439 | VAR | L | Permitir cambiar fecha de solicitud de OT | s/l | Migrar | PRM-TEC-P4-029 | tec.workOrder.allowEditRequestDate | boolean | tenant | false (con auditoría) | M10 |
| 2440 | VAR | L | Marcar medidor como retirado por defecto al confirmar OT de desconexión | s/l | Migrar-servicio | PRM-TEC-P4-030 | tec.disconnection.defaultMeterRemoved | boolean | servicio | false | M10 (+M03) |
| 2470 | VAR | L | Exigir número de dispositivo al confirmar OT si el servicio requiere dispositivo en alta | s/l | Migrar-servicio | PRM-TEC-P4-031 | tec.workOrder.requireDeviceSerial | boolean | servicio | true | M10 (+M13) |
| 2474 | VAR | L | Permitir cambiar categoría del servicio al cambiar medidor en OT | s/l | Migrar | PRM-TEC-P4-032 | tec.meterChange.allowCategoryChange | boolean | tenant | false | M10 |
| 2480 | VAR | L | Permitir actualizar teléfono y mails de la cuenta en las OT | s/l | Migrar | PRM-TEC-P4-033 | tec.workOrder.allowContactUpdate | boolean | tenant | true (cambio auditado en M01) | M10 (+M01) |
| 2483 | VAR | L | Generar crédito por días de servicio desconectado al reconectar | clsTecnica.Generar_DescuentoReconexion | Migrar-servicio | PRM-TEC-P4-034 | tec.reconnection.creditDisconnectedDays | boolean | servicio | false | M10 (+M05) |
| 2485 | VAR | FK PROD_SER | Concepto a facturar por días de servicio desconectado | clsTecnica.Generar_DescuentoReconexion | Migrar-servicio | PRM-TEC-P4-035 | tec.reconnection.creditConceptId | ref:products | servicio | — | M10 (+M05) |
| 2491 | VAR | L | Iniciar login en cada venta de prepaga en NEXO | NEXO_TCP2.EnviarComando | Migrar | PRM-MED-P4-003 | med.prepaid.nexoLoginPerSale | boolean | conector | false | M03 (+T06) |
| 2505 | VAR | Lista | Control de móvil en administración de OT: No / Preguntar / Exigir | s/l | Migrar | PRM-TEC-P4-036 | tec.workOrder.vehicleCheck | enum(off, ask, require) | tenant | off | M10 (+M18) |
| 2531 | VAR | L | Preguntar si retira medidor al confirmar OT de desconexión | s/l | Migrar | PRM-TEC-P4-037 | tec.disconnection.askMeterRemoval | boolean | tenant | true | M10 |
| 2570 | VAR | FK PROD_SER | Concepto a facturar por proporcional en cambio de categoría | clsTecnica.Generar_ProporcionalCambioCategoria | Migrar-servicio | PRM-TEC-P4-038 | tec.categoryChange.proratedConceptId | ref:products | servicio | — | M10 (+M04) |
| 2587 | VAR | L | Aplicar proporcional por cambio de categoría solo para importes positivos | clsTecnica.Generar_ProporcionalCambioCategoria | Migrar | PRM-TEC-P4-039 | tec.categoryChange.prorateOnlyPositive | boolean | tenant | true | M10 (+M04) |
| 2625 | VAR | L | Cobrar en el momento el proporcional por cambio de categoría | clsTecnica.AplicarProporcional | Migrar | PRM-TEC-P4-040 | tec.categoryChange.prorateBillingMode | enum(immediate, nextCycle) | tenant | nextCycle | M10 (+M05) |
| 2627 | VAR | L | Registrar materiales usados en productos que no llevan stock | s/l | Migrar | PRM-TEC-P4-041 | tec.workOrder.allowNonStockMaterials | boolean | tenant | true | M10 |
| 2629 | VAR | L | Solicitar la vía de ingreso en las órdenes | s/l | Migrar | PRM-TEC-P4-042 | tec.workOrder.requireIntakeChannel | boolean | tenant | true | M10 |
| 2637 | VAR | L | Alertar en OT de cambio de domicilio si no se cambió el recorrido | s/l | Migrar | PRM-TEC-P4-043 | tec.addressChange.warnRouteNotUpdated | boolean | tenant | true | M10 (+M03) |
| 2638 | VAR | L | Preguntar en OT de cambio de domicilio si modifica domicilio y recorrido postal | s/l | Migrar | PRM-TEC-P4-044 | tec.addressChange.askUpdatePostalAddress | boolean | tenant | true | M10 (+M01) |
| 2652 | VAR | L | Exigir modelo de medidor en servicios que requieren dispositivo en alta | s/l | Migrar-servicio | PRM-TEC-P4-045 | tec.workOrder.requireMeterModel | boolean | servicio | true | M10 |
| 2654 | VAR | L | Permitir modificar OT de factibilidad cerradas | s/l | Migrar | PRM-TEC-P4-046 | tec.feasibility.allowEditClosed | boolean | tenant | false (además capability) | M10 |
| 2655 | VAR | L | Permitir crear OT de servicios pendientes de conexión | clsTecnica.Validar_OrdenTrabajo_General | Migrar | PRM-TEC-P4-047 | tec.workOrder.allowOnPendingConnection | boolean | tenant | true | M10 |
| 2657 | VAR | L | Mostrar detalle de materiales en formulario de registro de materiales | frmSeleccionarProducto_Load | Reemplazado — `DataTable` con columnas configurables y vistas guardadas | — | — | — | — | — | M10 |
| 2661 | VAR | L | Generar débito al reconectar servicio no facturado en el período actual | clsTecnica.Generar_DescuentoReconexion | Migrar-servicio | PRM-TEC-P4-048 | tec.reconnection.debitUnbilledPeriod | boolean | servicio | false | M10 (+M05) |
| 2667 | VAR | L | No permitir agregar/editar/eliminar materiales en OT cerradas | s/l | Migrar | PRM-TEC-P4-049 | tec.workOrder.lockMaterialsWhenClosed | boolean | tenant | true | M10 |
| 2694 | VAR | L | Generar OT por tratamientos de morosos sin observación técnica | s/l | Migrar | PRM-TEC-P4-050 | tec.workOrder.allowDunningWithoutTechNotes | boolean | tenant | true | M10 (+M08) |
| 2722 | VAR | N | Importe horas normales | clsCierreDiario.Stock_OT / Stock_OM; GetCosto_OT (+4) | Migrar | PRM-TEC-P4-051 | tec.labor.normalHourRate | money (con `validFrom`) | tenant | 0 | M10 (+M15) |
| 2723 | VAR | N | Importe horas extras | clsCierreDiario.Stock_OT / Stock_OM; GetCosto_OT (+4) | Migrar | PRM-TEC-P4-052 | tec.labor.overtimeHourRate | money (con `validFrom`) | tenant | 0 | M10 (+M15) |
| 2808 | VAR | L | No modificar estado de la orden al imprimirla | clsInformes_Tecnica.Get_Reporte_DetalleOrden | Migrar | PRM-TEC-P4-053 | tec.workOrder.setInProgressOnPrint | boolean (invertido) | tenant | false | M10 |
| 2811 | VAR | L | Permitir bloquear para envío desde Técnica | s/l | Migrar | PRM-TEC-P4-054 | tec.fieldApp.allowHoldDispatch | boolean | tenant | true | M10 |
| 2819 | VAR | L | Mostrar en el reporte los vales usados en la OT/OM | clsInformes_Tecnica.Get_Reporte_DetalleOrden | Migrar | PRM-TEC-P4-055 | tec.workOrder.printIncludeStockVouchers | boolean | tenant | true | M10 |
| 2891 | VAR | L | No verificar pagos pendientes al confirmar OT | s/l | Migrar | PRM-TEC-P4-056 | tec.workOrder.checkPendingPaymentsOnClose | boolean (invertido) | tenant / tipo de tarea | true | M10 (+M07) |
| 2897 | VAR | L | MikroTik: eliminar usuario al dar de baja | MikroTik.CorteServicio / Reconexion | Migrar-servicio | PRM-TEC-P4-057 | tec.provisioning.mikrotik.deleteUserOnTermination | boolean | servicio / conector | true | M10 |
| 2899 | VAR | L | Permitir importar productos de presupuestos en vales | frmVales_Handler.Guardar | Migrar | PRM-STK-P4-001 | stk.voucher.allowImportFromQuote | boolean | tenant | true | M13 |
| 2907 | VAR | L | Permitir cerrar órdenes sin generar comprobantes por reconexión | clsTecnica.Generar_DescuentoReconexion | Migrar | PRM-TEC-P4-058 | tec.reconnection.allowCloseWithoutDocuments | boolean | tenant | false | M10 |
| 2913 | VAR | L | Enviar automáticamente las órdenes creadas a la base MySQL (captor) | clsTecnica.EnviarOrdenAutomaticamente | Reemplazado — al asignar la OT a técnico/cuadrilla se publica en la app de campo por evento; no hay base MySQL intermedia (deuda técnica) | — | — | — | — | — | M10 |
| 2933 | VAR | Lista | Selección de exportador GIS (`GIS.Coop`) | s/l (enum) | Reemplazado — capa GIS propia (GeoJSON) con exportadores estándar; GIS externos como conector T06 | — | — | — | — | — | M10 (+T06) |
| 2997 | VAR | L | Gestión de depósitos y autorización de materiales en órdenes de mantenimiento | s/l | Migrar | PRM-TEC-P4-059 | tec.maintenanceOrder.materialApprovalEnabled | boolean | tenant | false | M10 (+M13) |
| 2998 | VAR | L | Numeración única de reclamos continua | clsTecnica.Get_New_CODSLS | Migrar | PRM-CRM-P4-002 | crm.claim.numberingMode | enum(continuous, byService) | tenant | continuous | M09 |
| 3031 | VAR | L | Usar numeración por servicio al emitir informe de reclamos | clsInformes_Tecnica.Get_Reporte_Reclamo | Migrar | PRM-CRM-P4-003 | crm.claim.printServiceNumber | boolean | tenant | false | M09 |
| 3034 | VAR | C | URL de webservice (SITSA) para impactar cambios en técnica/socios | clsSitsa.Invoke / EstadoServicio; clsSocios.AltaBajaModificacionCliente_Sitsa (+1) | Migrar | PRM-TEC-P4-060 | tec.integration.sitsa.baseUrl | string (URL) | conector | — | M10 (+T06) |
| 3035 | VAR | C | APIKEY del webservice SITSA | clsSitsa.EstadoServicio | Bóveda — valor no transcripto | PRM-TEC-P4-061 | tec.integration.sitsa.apiKeyRef | secretRef | conector | — | T06 (+M10) |
| 3082 | VAR | L | Permitir cargar adjunto a OT de factibilidad cerrada | s/l | Migrar | PRM-TEC-P4-062 | tec.feasibility.allowAttachOnClosed | boolean | tenant | true | M10 |
| 3084 | VAR | L | Mostrar responsables por servicio y por operación | clsProcoop_Integra_Tecnica.GetResponsables | Migrar | PRM-TEC-P4-063 | tec.responsible.filterByServiceAndTask | boolean | tenant | true | M10 |
| 3085 | VAR | N | Valor de hora por defecto para participantes en OT | s/l | Migrar | PRM-TEC-P4-064 | tec.labor.defaultParticipantHourRate | money (con `validFrom`) | tenant | 0 | M10 |
| 3086 | VAR | L | Exigir responsable y marca "Enviar a captor" desde Procoop.ar | clsProcoop_Integra_Tecnica.GetVariableResPmovil | Migrar | PRM-TEC-P4-065 | tec.workOrder.requireResponsibleAndDispatchOnWeb | boolean | tenant | false | M10 |
| 3120 | VAR | L | Mostrar pestaña de reclamos OCEBA en técnica | s/l | Migrar-servicio | PRM-CRM-P4-004 | crm.claim.regulatorReportingId | ref:regulators | servicio | — (OCEBA, ERSeP, ENRE… según servicio) | M09 (+M06) |
| 3165 | VAR | C | WISPRO — API KEY | s/l | Bóveda — valor no transcripto | PRM-TEC-P4-066 | tec.integration.wispro.apiKeyRef | secretRef | conector | — | T06 (+M10) |
| 3173 | VAR | L | Mostrar el informe de incidentes al imprimir una OT | s/l | Migrar | PRM-TEC-P4-067 | tec.workOrder.printIncludeIncidents | boolean | tenant | false | M10 |
| 3175 | VAR | L | Mostrar botón "Conectar servicio" de Discar en técnica | s/l | Reemplazado — la acción "Conectar" aparece si el conector Discar está habilitado (T06) y el usuario tiene la capability | — | — | — | — | — | M03 (+T06) |
| 3189 | VAR | L | Radius: usa solo API de consultas | s/l | Migrar-servicio | PRM-TEC-P4-068 | tec.provisioning.radius.readOnlyApi | boolean | conector | false | M10 |
| 3201 | VAR | L | Advertencia al cargar una OT sin materiales | s/l | Migrar | PRM-TEC-P4-069 | tec.workOrder.warnNoMaterialsOnClose | boolean | tenant / tipo de tarea | true | M10 |

### 5.2 TELEMED (45)

Los parámetros "Visualizar/Enviar X en PMovil" se fusionan en un único parámetro de lista `med.readingApp.visibleFields` (PRM-MED-P4-004, compartido): cada número V2 aporta un elemento.

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---:|---|---|---|---|---|---|---|---|---|---|---|
| 28 | PMOVIL/PMovil | L | Enviar nomenclatura catastral en PMovil | clsPMovil.AddRutas | Migrar | PRM-MED-P4-004 (compartido) | med.readingApp.visibleFields[cadastralId] | enum[] | tenant / servicio | incluido: no | M03 |
| 29 | PMOVIL/PMovil | L | Estimar consumos a lecturas con observaciones | s/l (PMovil) | Migrar-servicio | PRM-MED-P4-005 | med.estimation.estimateOnObservedReading | boolean (afinable por código de observación) | servicio | false | M03 |
| 30 | PMOVIL/PMovil | L | Permite crear OT desde PMovil (lecturas) | s/l (PMovil) | Migrar | PRM-MED-P4-006 | med.readingApp.allowCreateWorkOrder | boolean | tenant | false | M03 (+M10) |
| 38 | PMOVIL/PMovil | L | No obligar a sincronizar en el módulo Telemed | s/l (PMovil) | Reemplazado — cola offline única; la sincronización es automática y no bloquea al lecturista | — | — | — | — | — | M03 |
| 47 | PMOVIL/PMovil | L | Mostrar zona, sector, recorrido y observación postal en la ruta | s/l (PMovil) | Migrar | PRM-MED-P4-004 (compartido) | med.readingApp.visibleFields[zoneSectorRoute, postalNote] | enum[] | tenant / servicio | incluido: sí | M03 |
| 69 | PMOVIL/PMovil | L | Mostrar descripción de la ruta en detalles del servicio | s/l (PMovil) | Migrar | PRM-MED-P4-004 (compartido) | med.readingApp.visibleFields[routeDescription] | enum[] | tenant / servicio | incluido: sí | M03 |
| 72 | PMOVIL/PMovil | L | Usar servidor S3 para las imágenes de lectura | clsPMovil_Telemed.SincronizarDatosImpWorkMySql / EliminarImagenesS3 | Plataforma — almacenamiento de objetos privado con URL firmadas es único para todo el sistema (DEC-001) | — | — | — | — | — | T01 (+M03) |
| 439 | VAR | N | Porcentaje para considerar lectura errónea | clsTelemed.GenerarRutas / Archivo_Importar | Migrar-servicio | PRM-MED-P4-007 | med.validation.anomalyThresholdPct | decimal | servicio / categoría | — (migrar; sugerido 50) | M03 |
| 451 | VAR | L | Permitir importar desde aplicaciones de terceros (ProCoop Connector) | clsTelemed.GuardarRutas | Migrar | PRM-MED-P4-008 | med.thirdPartyImport.enabled | boolean | tenant | false | M03 (+T06) |
| 452 | VAR | Lista | Modelo de intercambio con aplicaciones de terceros (Connector) | s/l | Migrar | PRM-MED-P4-009 | med.thirdPartyImport.format | enum(formatos de importador: ORD, ONC, BRI, …) | conector | — | M03 (+T06) |
| 453 | VAR | C (ruta) | Ruta por defecto para importar datos de terceros (también reutilizada por adjuntar PDF y exportar auditoría) | frmAdjuntarPdfs; frmBaseDatos.ExportarAuditoriaExcel / ExportarAuditoriaMailExcel | Reemplazado — no hay rutas locales: carga por `ExcelImportWizard`/subida al almacenamiento privado | — | — | — | — | — | M03 |
| 454 | VAR | C (ruta) | Ruta por defecto para exportar datos a terceros | s/l | Reemplazado — exportación como descarga del navegador o job de exportación con archivo firmado | — | — | — | — | — | M03 |
| 455 | VAR | C | Nombre del servicio por defecto en archivos importados de terceros ("SERVICIO") | clsImportacion_AC.Importar; clsTelemed.GetRutas / GetMapeosImportador_ONC (+2) | Migrar | PRM-MED-P4-010 | med.thirdPartyImport.serviceColumnLabel | string | conector | "SERVICIO" | M03 |
| 458 | VAR | L | Agregar observación postal en calle | clsPMovil.AddRutas | Migrar | PRM-MED-P4-004 (compartido) | med.readingApp.visibleFields[postalNoteInStreet] | enum[] | tenant / servicio | incluido: no | M03 |
| 468 | VAR | L | Visualizar lectura anterior en PMovil | clsPMovil.AddRutas | Migrar | PRM-MED-P4-004 (compartido) | med.readingApp.visibleFields[previousReading] | enum[] | tenant / servicio | incluido: no | M03 |
| 469 | VAR | L | Visualizar consumo anterior en PMovil | clsPMovil.AddRutas | Migrar | PRM-MED-P4-004 (compartido) | med.readingApp.visibleFields[previousConsumption] | enum[] | tenant / servicio | incluido: no | M03 |
| 720 | VAR | L | Filtrar por fecha de alta los servicios a enviar al generar rutas | s/l | Migrar | PRM-MED-P4-011 | med.route.filterByActivationDate | boolean | tenant | true | M03 |
| 748 | VAR | L | Visualizar manzana y lote en PMovil | clsPMovil.AddRutas | Migrar | PRM-MED-P4-004 (compartido) | med.readingApp.visibleFields[blockLot] | enum[] | tenant / servicio | incluido: no | M03 |
| 2054 | VAR | E | Código del servicio por defecto para archivos importados de terceros | clsImportacion_AC.Importar | Migrar | PRM-MED-P4-012 | med.thirdPartyImport.defaultServiceId | ref:services | conector | — | M03 |
| 2087 | VAR | L | Permitir decimales en exportación | clsTelemed.GetMapeosImportador_ORD / ONC / BRI (+3) | Migrar-servicio | PRM-MED-P4-013 | med.thirdPartyImport.allowDecimals | boolean | servicio | false | M03 |
| 2088 | VAR | L | Validar cantidad de dígitos del medidor | clsTelemed.CheckearLectura | Migrar-servicio | PRM-MED-P4-014 | med.validation.checkMeterDigits | boolean (usa `digits` del modelo de medidor) | servicio | true | M03 |
| 2098 | VAR | L | Enviar la ruta ordenada según orden del lecturista | clsPMovil.AddRutas | Migrar | PRM-MED-P4-015 | med.route.sortByReaderSequence | boolean | tenant | true | M03 |
| 2241 | VAR | C (ruta) | Ruta por defecto para buscar la base de datos en el teléfono | clsTelemed.ObtenerBase | Reemplazado — la PWA de lecturas no usa archivo de base local; datos en IndexedDB gestionados por la app | — | — | — | — | — | M03 |
| 2293 | VAR | L | Visualizar zona, sector y recorrido de lectura en PMovil | clsPMovil.AddRutas | Migrar | PRM-MED-P4-004 (compartido) | med.readingApp.visibleFields[zoneSectorRoute] | enum[] | tenant / servicio | incluido: sí | M03 |
| 2297 | VAR | L | Enviar categoría en PMovil | clsPMovil.AddRutas | Migrar | PRM-MED-P4-004 (compartido) | med.readingApp.visibleFields[category] | enum[] | tenant / servicio | incluido: sí | M03 |
| 2298 | VAR | L | Enviar estado en PMovil | clsPMovil.AddRutas | Migrar | PRM-MED-P4-004 (compartido) | med.readingApp.visibleFields[status] | enum[] | tenant / servicio | incluido: sí | M03 |
| 2307 | VAR | Lista | Modelo de importación de lecturas tomadas | s/l | Migrar | PRM-MED-P4-016 | med.readingImport.format | enum(formatos de colectora/terceros) | conector | — | M03 (+T06) |
| 2331 | VAR | L | Enviar matrícula de servicio | clsPMovil.AddRutas | Migrar | PRM-MED-P4-004 (compartido) | med.readingApp.visibleFields[serviceTag] | enum[] | tenant / servicio | incluido: sí | M03 |
| 2332 | VAR | L | Importación de fotos de Telemed con Cuenta/Medidor/UF/Archivo | clsAdjuntos.GetAdjuntosCaptor / CrearAdjunto | Migrar | PRM-MED-P4-017 | med.photoImport.fileNamePattern | enum(file, accountMeterUfFile) | conector | accountMeterUfFile | M03 |
| 2334 | VAR | L | Exportar rutas en Excel por separado | s/l | Migrar | PRM-MED-P4-018 | med.routeExport.splitFiles | boolean | tenant | false | M03 |
| 2336 | VAR | L | Enviar campo "Id Cliente" como número de contrato de DISCAR | Discar.GetNroContrato | Migrar | PRM-MED-P4-019 (compartido) | med.discar.contractNumberSource[clientId] | enum(clientId, account, service) | conector | service | M03 (+T06) |
| 2340 | VAR | L | Confirmar masivamente rutas al exportarlas | s/l | Migrar | PRM-MED-P4-020 | med.routeExport.autoConfirm | boolean | tenant | false | M03 |
| 2345 | VAR | L | Eliminar/limpiar masivamente rutas sin alertas individuales | clsPMovil.ValidarLimpiarBase | Reemplazado — acción masiva con un único `ConfirmDialog` y capability `med.rutas.limpiar` | — | — | — | — | — | M03 |
| 2466 | VAR | L | No usar decimales al estimar consumos | s/l | Migrar-servicio | PRM-MED-P4-021 | med.estimation.roundToInteger | boolean | servicio | false | M03 |
| 2475 | VAR | L | Usar PMovil en toma de lectura | s/l | Reemplazado — la app de lecturas (PWA rol lecturista) es el canal nativo; se habilita por licencia/capability | — | — | — | — | — | M03 |
| 2504 | VAR | L | Enviar campo "Cuenta" como número de contrato de DISCAR | Discar.GetNroContrato | Migrar | PRM-MED-P4-019 (compartido) | med.discar.contractNumberSource[account] | enum(clientId, account, service) | conector | service | M03 (+T06) |
| 2559 | VAR | L | Consultar última lectura estimada | clsTelemed.GuardarRutas | Migrar | PRM-MED-P4-022 | med.route.includeLastEstimatedReading | boolean | tenant | true | M03 |
| 2590 | VAR | L | Ordenar grandes consumos según orden de impresión (No = por código de producto) | clsRutas.GetRutasSersoc | Migrar | PRM-MED-P4-023 | med.route.largeUsersSort | enum(printOrder, productCode) | tenant | printOrder | M03 |
| 2595 | VAR | L | Relacionar imágenes de lecturas con consumos automáticamente | clsConsumos.Procesar_Consumos; clsWEB.ValidarParametros / SincronizarConsumos (+2) | Reemplazado — la foto se adjunta a la lectura en origen (app) y el consumo la referencia; no hay asociación posterior | — | — | — | — | — | M03 |
| 2682 | VAR | L | Tomar la categoría actual de los servicios al confirmar las lecturas | clsTelemed.ConfirmarRuta | Migrar | PRM-MED-P4-024 | med.route.useCurrentCategoryOnConfirm | boolean | tenant | true | M03 (+M04) |
| 2809 | VAR | L | Usar observaciones postales de la cuenta y no del servicio al generar recorrido | clsTelemed.GenerarRutas | Migrar | PRM-MED-P4-025 | med.route.postalNoteSource | enum(account, service) | tenant | service | M03 |
| 2992 | VAR | L | Mostrar filtro Servicios en administración de rutas | s/l | Reemplazado — filtros configurables del `DataTable` | — | — | — | — | — | M03 |
| 3063 | VAR | L | Corregir fecha y cabecera al importar archivo txt | clsTelemed.GuardarRutas / Archivo_Importar | Migrar | PRM-MED-P4-026 | med.readingImport.fixTxtHeaderDate | boolean | conector | false | M03 |
| 3140 | VAR | L | Observación postal no obligatoria al importar archivo de terceros | clsTelemed.GetMapeosImportador | Migrar | PRM-MED-P4-027 | med.thirdPartyImport.postalNoteOptional | boolean | conector | true | M03 |
| 3197 | VAR | L | Visualizar propiedad del servicio en PMovil | clsPMovil.AddRutas | Migrar | PRM-MED-P4-004 (compartido) | med.readingApp.visibleFields[serviceOwnership] | enum[] | tenant / servicio | incluido: no | M03 |

### 5.3 TELEFONIA (16)

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---:|---|---|---|---|---|---|---|---|---|---|---|
| 13 | VAR | FK TARTEL | Tarifa de celulares | s/l | Migrar-servicio | PRM-TAR-P4-001 | tar.telephony.mobileRatePlanId | ref:telephonyRatePlans | servicio | — | M04 |
| 18 | VAR | FK SERVICIO | Servicio de detalle de llamadas | clsInformes_Llamadas.Filtros / Get_FacturasDetalle | Migrar-servicio | PRM-TEC-P4-070 | tec.telephony.callDetailEnabled | boolean (propiedad del servicio) | servicio | false | M10 (+M05) |
| 62 | VAR | L | Tasar automáticamente llamadas internacionales | clsTelefonia.Get_DatosTasacion | Migrar-servicio | PRM-TAR-P4-002 | tar.telephony.autoRateInternational | boolean | servicio | true | M04 |
| 64 | VAR | N | Importe mínimo de llamadas no gratuitas | clsTelefonia.Get_DatosTasacion | Migrar-servicio | PRM-TAR-P4-003 | tar.telephony.minimumCallCharge | money (con `validFrom`) | servicio | 0 | M04 |
| 82 | VAR | FK SERVICIO | Servicio para central virtual (llamadas internas gratis) | clsTelefonia.Tasacion_Get_CentralTelefonica | Migrar-servicio | PRM-TEC-P4-071 | tec.telephony.virtualPbxEnabled | boolean (propiedad del servicio) | servicio | false | M10 (+M04) |
| 236 | VAR | L | Habilitar teléfonos prepagos | clsTelefonia.Get_DatosTasacion / Importar_CPP | Migrar | PRM-TAR-P4-004 | tar.telephony.prepaidEnabled | boolean | tenant | false | M04 |
| 238 | VAR | FK TRANSAC | Orden de trabajo (operación) para compra de minutos | clsTelefonia.Generar_OT_RecargaPrepaga | Migrar | PRM-TEC-P4-072 | tec.telephony.prepaidTopUpTaskTypeId | ref:taskTypes | tenant | — | M10 |
| 301 | VAR | Mixto | Configuración datos de Personal | s/l | Descartar — sin lectura y semántica no determinable [VERIFICAR]; si refiere al operador móvil Personal, se modela como conector de operador en T06 | — | — | — | — | — | M10 |
| 332 | VAR | FK SERVICIO | Servicio para telefonía prepaga | clsTelefonia.Get_DatosTasacion / Importar_CPP; clsSocios.Guardar_TelefoniaPrepaga | Migrar-servicio | PRM-TEC-P4-073 | tec.telephony.prepaidService | boolean (propiedad del servicio) | servicio | false | M10 (+M04) |
| 471 | VAR | L | No aplicar consumo mínimo en claves 0 y 1 | clsTelefonia.Get_DatosTasacion | Migrar-servicio | PRM-TAR-P4-005 | tar.telephony.minimumChargeExemptKeys | string[] | servicio | [] (ProCoop activo = ["0","1"]) | M04 |
| 2099 | VAR | FK PROD_SER | Concepto para crédito de telefonía prepaga | s/l | Migrar-servicio | PRM-TAR-P4-006 | tar.telephony.prepaidCreditConceptId | ref:products | servicio | — | M04 (+M05) |
| 2295 | VAR | FK OPERADOR | Operador para importador CPP de Nextel | clsImportacion.Importar_CPP2_Nextel | Migrar | PRM-TEC-P4-074 | tec.telephony.cdrImport.nextelOperatorId | ref:telephonyOperators | conector | — | M10 |
| 2302 | VAR | L | Validar llamadas existentes al importar archivo de llamadas | clsImportacion.Validar_Duplicadas | Reemplazado — deduplicación obligatoria del CDR por clave natural con índice único e importación idempotente; no configurable | — | — | — | — | — | M10 |
| 2344 | VAR | FK TARTEL | Tarifa de telefonía por defecto | abm_AltasEau.oServicioAlta_SeleccionarId | Migrar-servicio | PRM-TAR-P4-007 | tar.telephony.defaultRatePlanId | ref:telephonyRatePlans | servicio | — | M04 |
| 2346 | VAR | L | Asignar importe 0 a llamadas "Telco IP" importadas con clave 99 | clsImportacion.Importar_LLAMADAS_TelcoIP | Migrar | PRM-TAR-P4-008 | tar.telephony.zeroRatedKeysByFormat | map(formato → string[]) | conector | {} (ProCoop activo = {telcoIp: ["99"]}) | M04 (+M10) |
| 2444 | VAR | C | Números telefónicos a excluir en importador Lucent (separados por coma) | clsImportacion.Importar_Lucent_Salientes | Migrar | PRM-TEC-P4-075 | tec.telephony.cdrImport.excludedNumbers | string[] | conector | [] | M10 |

### 5.4 SMS (11)

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---:|---|---|---|---|---|---|---|---|---|---|---|
| 2047 | VAR | N | Cantidad de errores para desactivar módem | frmParam_SMS.cmdAceptar_Click | Plataforma — política de reintentos y *circuit breaker* del proveedor de mensajería (BullMQ); sin módem GSM local (A validar PA-CFG-P4-01) | — | — | — | — | — | T09 (+T06) |
| 2048 | VAR | N | Cantidad de errores para desactivar mensaje | frmParam_SMS.cmdAceptar_Click | Migrar | PRM-COM-P4-001 | com.sms.maxAttemptsPerMessage | integer | tenant | 3 | T09 |
| 2049 | VAR | N | Días de validez de un SMS | frmParam_SMS.cmdAceptar_Click | Migrar | PRM-COM-P4-002 | com.sms.messageTtlDays | integer | tenant | 2 | T09 |
| 2870 | VAR | C | Token para envío de mensajes por WhatsApp | clsPlantillasWhatsApp; clsWhatsApp ctor; clsServicio_Procoop.AgregarTareasDinamicas (+3) | Bóveda — valor no transcripto | PRM-COM-P4-003 | com.whatsapp.tokenRef | secretRef | conector | — | T06 (+T09) |
| 2872 | VAR | N | Demora entre envíos de WhatsApp (segundos) | clsServicio_Procoop.EnviarWS | Migrar | PRM-COM-P4-004 | com.whatsapp.sendIntervalSec | integer | conector | 2 | T09 |
| 2873 | VAR | C | Host en URL para envío por WhatsApp | clsWhatsApp.Invoke | Migrar | PRM-COM-P4-005 | com.whatsapp.baseUrl | string (URL) | conector | — | T09 (+T06) |
| 2874 | VAR | C | ID de canal para envío por WhatsApp | clsPlantillasWhatsApp; clsWhatsApp.Get_MensajesPendientes | Migrar | PRM-COM-P4-006 | com.whatsapp.channelId | string | conector | — | T09 (+T06) |
| 3018 | VAR | L | Realizar envío de SMS a través de Amazon SNS | s/l | Migrar | PRM-COM-P4-007 | com.sms.provider | enum(sns, gateway, none) | tenant | none | T09 |
| 3019 | VAR | C | AWS Access Key | s/l | Bóveda — valor no transcripto | PRM-COM-P4-008 | com.sms.sns.accessKeyRef | secretRef | conector | — | T06 (+T09) |
| 3020 | VAR | C | AWS Secret Key | s/l | Bóveda — valor no transcripto | PRM-COM-P4-009 | com.sms.sns.secretKeyRef | secretRef | conector | — | T06 (+T09) |
| 3021 | VAR | C | AWS Region | s/l | Migrar | PRM-COM-P4-010 | com.sms.sns.region | string | conector | — | T09 |

### 5.5 COMPRAS (109)

En ProCoop el módulo COMPRAS agrupa también la caja de pagos y los medios de pago a proveedores: esos parámetros van a M14 (`tes.`). Las retenciones a proveedores se calculan en M12 con el motor de impuestos de M06.

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---:|---|---|---|---|---|---|---|---|---|---|---|
| 110 | VAR | L | Permite pagar facturas con fecha contable posterior al pago | s/l | Migrar | PRM-CMP-P4-001 | cmp.payment.allowInvoiceAccountingDateAfterPayment | boolean | tenant | false | M12 |
| 134 | VAR | L | Apertura automática de la caja de pago | clsCajaPago.ValidarAperturadeCajaAutomatica | Migrar | PRM-TES-P4-001 | tes.paymentCash.autoOpen | boolean | tenant / sucursal | false | M14 |
| 135 | VAR | N | Importe para pago en efectivo en apertura automática (tope de efectivo) | clsCajaPago.ValidarAperturadeCajaAutomatica | Migrar | PRM-TES-P4-002 | tes.paymentCash.autoOpenCashLimit | money | tenant / sucursal | 0 | M14 |
| 144 | VAR | Lista | Pago a proveedores desde caja: No permitir / solo menores a 2025 / definido por el usuario / definido por el usuario con advertencia | clsChequeos.FinalizarChequeos (resetea); PropiedadesCaja.Cargar_CobranzaLocal; clsPagoFacturas.ProcesarMediosDePago | Migrar | PRM-TES-P4-003 | tes.supplierPayment.fromCashDesk | enum(disabled, belowLimit, userDefined, userDefinedWithWarning) | tenant | disabled | M14 (+M07) |
| 146 | VAR | FK CAT_BANC | Categoría para pago con transferencias | clsPagoFacturas.RegistrarResBan | Migrar | PRM-TES-P4-004 | tes.supplierPayment.transferMovementCategoryId | ref:bankMovementCategories | tenant | — | M14 |
| 217 | VAR | L | Ingresar a la página de ARCA si el certificado del proveedor está vencido | s/l | Reemplazado — consulta automática de constancia/padrón ARCA por web service (M06); no se abre navegador | — | — | — | — | — | M12 (+M06) |
| 218 | VAR | L | Controlar proveedores con base de datos de ARCA | ctrCuit.Validar | Migrar | PRM-CMP-P4-002 | cmp.supplier.validateWithArcaPadron | boolean | tenant | true | M12 (+M06) |
| 264 | VAR | L | No actualizar el precio de compra al registrar facturas | frmComprobantes_Handler.ImportarDetalles / AgregarDetalle | Migrar | PRM-CMP-P4-003 (compartido) | cmp.invoice.updateLastPurchasePrice | enum(never, ask, always) | tenant | always | M12 (+M13) |
| 382 | VAR | C | Informe para libro IVA compras personalizado | s/l | Marca — plantilla del libro IVA compras del tenant | — | uxd.template.purchaseVatBook | ref:documentTemplates | tenant | plantilla estándar | T03 (+M06) |
| 402 | VAR | E | Controlar fecha de cheques o transferencias en órdenes de pago (valores 1…; observación truncada en la fuente) | s/l | Migrar | PRM-TES-P4-005 | tes.supplierPayment.instrumentDateCheck | enum(off, …) [VERIFICAR opciones] | tenant | off | M14 |
| 406 | VAR | C | Informe particularizado de retenciones (IVA compras) | s/l | Marca — plantilla del certificado de retención | — | uxd.template.withholdingCertificate | ref:documentTemplates | tenant | plantilla estándar | T03 (+M06) |
| 409 | VAR | L | No permitir anticipos en retenciones | s/l | Migrar | PRM-CMP-P4-004 | cmp.withholding.applyOnAdvances | boolean (invertido) | tenant | true | M12 (+M06) |
| 410 | VAR | L | No retener en comprobantes no formales | Retenciones.CalcularBaseImponible | Migrar | PRM-CMP-P4-005 | cmp.withholding.skipNonFormalDocuments | boolean | tenant | false | M12 (+M06) |
| 426 | VAR | L | Preguntar antes de actualizar precio de compras | s/l | Migrar | PRM-CMP-P4-003 (compartido) | cmp.invoice.updateLastPurchasePrice[ask] | enum(never, ask, always) | tenant | always | M12 |
| 580 | VAR | F | Fecha imputación contable | s/l | Descartar — sin lectura; la fecha contable es atributo de cada comprobante y los bloqueos van por período (M15) | — | — | — | — | — | M15 |
| 583 | VAR | L | Factura de compra independiente de remitos de depósito (la factura no mueve stock) | frmComprobantes_Handler.GuardarComp; FormBase.ValidarUbicaciones | Migrar | PRM-CMP-P4-006 | cmp.invoice.stockMovementMode | enum(fromInvoice, fromReceiptOnly) | tenant | fromReceiptOnly | M12 (+M13) |
| 832 | VAR | Mixto | Valor por defecto para separar comprobantes en libro de IVA | s/l | Migrar | PRM-CMP-P4-007 | cmp.vatBook.defaultSplitDocuments | boolean | tenant | false | M12 (+M06) |
| 1029 | VAR | L | Particularizar nombre de proveedor en orden de pago | s/l | Migrar | PRM-CMP-P4-008 | cmp.paymentOrder.allowPayeeNameOverride | boolean | tenant | false | M12 |
| 2000 | VAR | L | Caja de pagos admite cheques | clsCajaPago.ValidarAperturadeCajaAutomatica | Migrar | PRM-TES-P4-006 (compartido) | tes.paymentCash.allowedInstruments[ownCheque] | enum[] | tenant / sucursal | todos | M14 |
| 2001 | VAR | L | Caja de pagos admite valores | clsCajaPago.ValidarAperturadeCajaAutomatica | Migrar | PRM-TES-P4-006 (compartido) | tes.paymentCash.allowedInstruments[thirdPartyValue] | enum[] | tenant / sucursal | todos | M14 |
| 2002 | VAR | L | Caja de pagos admite efectivo | clsCajaPago.ValidarAperturadeCajaAutomatica | Migrar | PRM-TES-P4-006 (compartido) | tes.paymentCash.allowedInstruments[cash] | enum[] | tenant / sucursal | todos | M14 |
| 2003 | VAR | L | Permite definir el importe de efectivo disponible para compras | s/l | Migrar | PRM-TES-P4-007 | tes.paymentCash.allowCashAvailableOverride | boolean | tenant | false | M14 |
| 2004 | VAR | L | Caja de pagos admite transferencias | clsCajaPago.ValidarAperturadeCajaAutomatica | Migrar | PRM-TES-P4-006 (compartido) | tes.paymentCash.allowedInstruments[transfer] | enum[] | tenant / sucursal | todos | M14 |
| 2015 | VAR | L | Permitir pago diferido a cuentas que no lo sean | s/l | Migrar | PRM-TES-P4-008 | tes.supplierPayment.allowDeferredOnNonDeferredAccounts | boolean | tenant | false | M14 |
| 2016 | VAR | L | Desactiva pagos diferidos | s/l | Migrar | PRM-TES-P4-009 | tes.supplierPayment.deferredPaymentsEnabled | boolean (invertido) | tenant | true | M14 |
| 2017 | VAR | L | Permite NO asignar rubro de proveedor a facturas de compra | clsProveedor.CrearProveedor; IvaCom_Pendientes; abm_Proveed | Migrar | PRM-CMP-P4-009 | cmp.invoice.requireSupplierCategory | boolean (invertido) | tenant | true | M12 |
| 2018 | VAR | L | Imprimir orden de pago en la emisión | s/l | Migrar | PRM-CMP-P4-010 | cmp.paymentOrder.printOnIssue | enum(no, ask, auto) | tenant | ask | M12 |
| 2019 | VAR | L | Marcar proveedores para pagar a otros proveedores | abm_Proveed.ConfigurarFormulario | Migrar | PRM-CMP-P4-011 | cmp.supplier.allowPayOnBehalf | boolean | tenant | false | M12 (+M14) |
| 2020 | VAR | C | Datos empresa — Jefe administrativo | s/l | Reemplazado — registro de autoridades y cargos firmantes con vigencia (M17 consejo / M16 puestos), expuesto como variable de plantilla | — | — | — | — | — | M17 |
| 2021 | VAR | C | Datos empresa — Secretario | s/l | Reemplazado — registro de autoridades con vigencia (M17) | — | — | — | — | — | M17 |
| 2022 | VAR | C | Datos empresa — Jefe de compras | s/l | Reemplazado — cargo firmante con vigencia (M16 puestos / M17) | — | — | — | — | — | M17 |
| 2023 | VAR | C | Datos empresa — Presidente | s/l | Reemplazado — registro de autoridades con vigencia (M17) | — | — | — | — | — | M17 |
| 2024 | VAR | C | Datos empresa — Tesorero | s/l | Reemplazado — registro de autoridades con vigencia (M17) | — | — | — | — | — | M17 |
| 2025 | VAR | N | Importe máximo para pagos a proveedores por caja (requiere 144) | clsPagoFacturas.ProcesarMediosDePago | Migrar | PRM-TES-P4-010 | tes.supplierPayment.cashDeskMaxAmount | money (0 = sin tope) | tenant | 0 | M14 |
| 2026 | VAR | F | Vencimiento de facturas por defecto | s/l | Migrar | PRM-CMP-P4-012 | cmp.invoice.defaultDueDays | integer (días desde emisión; la fecha fija ProCoop se convierte) | tenant / proveedor | 30 | M12 |
| 2034 | VAR | FK CON_COM | Concepto para anticipos de sueldos | clsPagoFacturas.GenerarCmpAnticipo / Anular; clsSueldos.GetAdelantos | Migrar | PRM-CMP-P4-013 | cmp.payment.salaryAdvanceConceptId | ref:purchaseConcepts | tenant | — | M12 (+M16) |
| 2035 | VAR | FK CON_COM | Concepto para anticipos a proveedores | IvaCom_Pendientes | Migrar | PRM-CMP-P4-014 | cmp.payment.supplierAdvanceConceptId | ref:purchaseConcepts | tenant | — | M12 |
| 2036 | VAR | E | Días de vigencia de la solicitud de aprovisionamiento | clsSAprov.GetSA_Pendientes / GetSAEnProceso_SinAutorizar | Migrar | PRM-CMP-P4-015 | cmp.supplyRequest.validityDays | integer | tenant | 30 | M12 |
| 2037 | VAR | L | Aplica retención de Ingresos Brutos | Retenciones.CalcularRetenciones | Migrar | PRM-CMP-P4-016 (compartido) | cmp.withholding.enabledTaxes[iibb] | enum[] | tenant | según inscripción como agente | M12 (+M06) |
| 2038 | VAR | L | Imprimir retención IIBB automáticamente | s/l | Migrar | PRM-CMP-P4-017 (compartido) | cmp.withholding.autoPrintCertificate[iibb] | enum[] | tenant | todos | M12 |
| 2039 | VAR | L | Aplica retención de IVA | Retenciones.CalcularRetenciones | Migrar | PRM-CMP-P4-016 (compartido) | cmp.withholding.enabledTaxes[iva] | enum[] | tenant | según inscripción como agente | M12 (+M06) |
| 2040 | VAR | L | Imprimir retención de IVA automáticamente | s/l | Migrar | PRM-CMP-P4-017 (compartido) | cmp.withholding.autoPrintCertificate[iva] | enum[] | tenant | todos | M12 |
| 2041 | VAR | L | Aplica retención de Ganancias | Retenciones.CalcularRetenciones | Migrar | PRM-CMP-P4-016 (compartido) | cmp.withholding.enabledTaxes[ganancias] | enum[] | tenant | según inscripción como agente | M12 (+M06) |
| 2042 | VAR | L | Imprimir retención de Ganancias automáticamente | s/l | Migrar | PRM-CMP-P4-017 (compartido) | cmp.withholding.autoPrintCertificate[ganancias] | enum[] | tenant | todos | M12 |
| 2043 | VAR | L | Aplica retención de Seguridad Social | Retenciones.CalcularRetenciones | Migrar | PRM-CMP-P4-016 (compartido) | cmp.withholding.enabledTaxes[suss] | enum[] | tenant | según inscripción como agente | M12 (+M06) |
| 2044 | VAR | L | Imprimir retención de Seguridad Social automáticamente | s/l | Migrar | PRM-CMP-P4-017 (compartido) | cmp.withholding.autoPrintCertificate[suss] | enum[] | tenant | todos | M12 |
| 2045 | VAR | E | Día límite de presentación de retenciones | Retenciones.ObtenerRetencion | Migrar | PRM-CMP-P4-018 | cmp.withholding.filingCutoffDay | integer (1–31) | tenant | — (migrar) | M12 (+M06) |
| 2057 | VAR | N | Máxima diferencia entre total de ítems y totales en compras | s/l | Migrar | PRM-CMP-P4-019 | cmp.invoice.maxTotalsDifference | money | tenant | 1,00 | M12 |
| 2065 | VAR | FK CAT_BANC | Categoría de comprobante extracción de efectivo (pagos con valores de terceros) | s/l (RN-08: clsPagoFacturas.cs:613) | Migrar | PRM-TES-P4-011 | tes.supplierPayment.cashWithdrawalCategoryId | ref:bankMovementCategories | tenant | — | M14 |
| 2079 | VAR | FK CAT_BANC | Categoría de comprobante depósito de efectivo en orden de pago | s/l (RN-08: clsPagoFacturas.cs:613) | Migrar | PRM-TES-P4-012 | tes.supplierPayment.cashDepositCategoryId | ref:bankMovementCategories | tenant | — | M14 |
| 2201 | VAR | Lista | Valor por defecto en carga de facturas de compra: pago autorizado / no autorizado / autorizar mayores a 2457 | IvaCom_Pendientes; frmComprobantes_Handler.GetIVACom / GetIVAComReplica | Migrar | PRM-CMP-P4-020 | cmp.invoice.defaultPaymentAuthorization | enum(authorized, notAuthorized, authorizeAboveAmount) | tenant | authorizeAboveAmount | M12 (+T11) |
| 2277 | VAR | L | Seleccionar un servicio de un cliente en comprobante de compras | s/l | Migrar | PRM-CMP-P4-021 | cmp.invoice.allowCustomerServiceLink | boolean | tenant | false | M12 |
| 2308 | VAR | L | Mostrar asiento contable en orden de pago | s/l | Reemplazado — pestaña "Asiento" estándar en todo documento económico (M15) | — | — | — | — | — | M15 |
| 2310 | VAR | N | Porcentaje de IVA a considerar para retenciones en adelantos (121 → base 100) | Retenciones.CalcularBaseImponible | Migrar | PRM-CMP-P4-022 | cmp.withholding.advanceVatRatePct | decimal | tenant | 21 | M12 (+M06) |
| 2323 | VAR | L | Modificar tipo de moneda en órdenes de compra | s/l | Migrar | PRM-CMP-P4-023 | cmp.purchaseOrder.allowCurrencyChange | boolean | tenant | false | M12 |
| 2335 | VAR | L | Exigir registración completa de órdenes de compra | s/l | Migrar | PRM-CMP-P4-024 | cmp.purchaseOrder.requireCompleteRegistration | boolean | tenant | false | M12 |
| 2365 | VAR | L | Advertir (en vez de bloquear) comprobantes no autorizados según situación de IVA | frmComprobantes_Handler.Validar | Migrar | PRM-CMP-P4-025 | cmp.invoice.vatConditionMismatchPolicy | enum(block, warn) | tenant | block | M12 (+M06) |
| 2366 | VAR | L | Integrar módulo Compras/Sueldos | s/l | Reemplazado — integración Compras–Sueldos por eventos siempre activa (anticipos y pagos de sueldos generan documentos en M12/M14) | — | — | — | — | — | M16 |
| 2372 | VAR | C | Firmantes de órdenes de pago del archivo exportado para el banco (separados por coma) | GetDatosInforme.GenerarArchivosMacro | Migrar | PRM-TES-P4-013 | tes.bankFile.treasuryAccountSignerIds (antes `tes.bankFile.paymentOrderSigners`; los firmantes son `treasuryAccountSigners` de M14, CTR-DAT-78) | string[] | cuenta bancaria | [] | M14 |
| 2377 | VAR | Lista | Valor por defecto en carga de órdenes de compra: autorizada / no autorizada | frmComprobantes_Handler.GuardarOrdenDeCompra | Migrar | PRM-CMP-P4-026 | cmp.purchaseOrder.defaultAuthorization | enum(authorized, pendingAboveAmount) | tenant | pendingAboveAmount | M12 (+T11) |
| 2382 | VAR | N | Importe mínimo de OC para guardar como pendiente de autorizar | frmComprobantes_Handler.GuardarOrdenDeCompra | Migrar | PRM-CMP-P4-027 | cmp.purchaseOrder.approvalThresholdAmount | money | tenant | 0 | M12 (+T11) |
| 2388 | VAR | L | Autocompletar fecha contable y fecha de vencimiento | s/l | Migrar | PRM-CMP-P4-028 | cmp.invoice.autofillDates | boolean | tenant | true | M12 |
| 2403 | VAR | FK PROD_SER | Concepto por descuento en comprobantes de compras | frmComprobantes_Handler.ActualizarTotales / ValidarNeto / AddFPItem | Migrar | PRM-CMP-P4-029 | cmp.invoice.discountConceptId | ref:products | tenant | — | M12 |
| 2418 | VAR | FK PLANTILLA | Plantilla para envío masivo de órdenes de pago | s/l | Migrar | PRM-CMP-P4-030 | cmp.paymentOrder.notificationTemplateId | ref:messageTemplates | tenant | plantilla estándar | M12 (+T09) |
| 2424 | VAR | L | Consultar si imprime al registrar comprobantes de proveedores | s/l | Migrar | PRM-CMP-P4-031 | cmp.invoice.printOnSave | enum(no, ask, auto) | tenant | no | M12 |
| 2433 | VAR | L | Usar fecha de movimiento como fecha de emisión en pagos con transferencia | clsPagoFacturas.ProcesarMediosDePago | Migrar | PRM-TES-P4-014 | tes.supplierPayment.transferIssueDateFromMovement | boolean | tenant | true | M14 |
| 2447 | VAR | L | Seleccionar usuario en "solicitó" de órdenes de compra | s/l | Migrar | PRM-CMP-P4-032 | cmp.purchaseOrder.allowRequesterSelection | boolean | tenant | true | M12 |
| 2457 | VAR | N | Importe mínimo de comprobantes autorizado (requiere 2201 = 3) | IvaCom_Pendientes; GetIVACom / GetIVAComReplica | Migrar | PRM-CMP-P4-033 | cmp.invoice.autoAuthorizeMaxAmount | money | tenant | 0 | M12 (+T11) |
| 2533 | VAR | L | Registrar observación al modificar un concepto en comprobante de proveedores | s/l | Migrar | PRM-CMP-P4-034 | cmp.invoice.requireReasonOnConceptChange | boolean | tenant | true | M12 |
| 2539 | VAR | L | Formato internacional en archivo de retenciones de Ganancias | PercepcionSICORE.Get_RetencionesProveedores | Migrar | PRM-FIS-P4-001 | fis.sicore.useInternationalFormat | boolean | tenant | false | M06 |
| 2542 | VAR | N | Importe base imponible de las retenciones a proveedores (importación) | clsProveedor.ImportarRetenciones_Proveedores / CSV; frmImportacionArchivos | Migrar | PRM-CMP-P4-035 | cmp.withholding.importDefaultTaxBase | money [VERIFICAR] | tenant | 0 | M12 (+M06) |
| 2560 | VAR | L | No solicitar depósito si el producto no lleva stock | s/l | Reemplazado — regla fija: el depósito se pide solo para productos con control de stock | — | — | — | — | — | M13 |
| 2572 | VAR | L | Permitir modificar fecha de comprobante de pago a proveedores | s/l | Migrar | PRM-TES-P4-015 | tes.supplierPayment.allowEditDate | boolean | tenant | false (auditado; nunca en período cerrado) | M14 |
| 2573 | VAR | C | CBU para transferencias de pago a proveedores — Interbanking | GetDatosInforme.GenerarArchivosInterbanking | Reemplazado — el CBU es atributo de la cuenta bancaria propia (M14); el archivo toma la cuenta elegida | — | — | — | — | — | M14 |
| 2640 | VAR | L | Generar solicitudes de aprovisionamiento sin autorizar (si no, autoautoriza según permisos) | clsSAprov.Alta | Migrar | PRM-CMP-P4-036 | cmp.supplyRequest.autoApproveByPermission | boolean (invertido) | tenant | false | M12 (+T11) |
| 2647 | VAR | L | Cargar motivo de compra en observaciones al importar OC | frmComprobantes_Handler.AgregarDetalle | Migrar | PRM-CMP-P4-037 | cmp.invoice.copyPurchaseReasonToNotes | boolean | tenant | true | M12 |
| 2649 | VAR | L | Mostrar solo OC al importar ítems en remitos de proveedores | s/l | Migrar | PRM-CMP-P4-038 | cmp.receipt.importOnlyFromPurchaseOrders | boolean | tenant | false | M12 |
| 2653 | VAR | L | No permitir ver facturas y recibos de empleados en compras | GetDatosInforme.Comprobantes / Pagos / CtacteProveedor (+11) | Reemplazado — los documentos de proveedores que son empleados se restringen por capability `cmp.documentosEmpleados.ver` y alcance (T02) | — | — | — | — | — | M12 (+T02) |
| 2690 | VAR | L | Permite modificar importe en remitos (toma % IVA del documento origen) | clsComp_Com.GetRem_Pendientes; clsIvaCom.GetFPITEM_Pendientes; clsNPedido (+1) | Migrar | PRM-CMP-P4-039 | cmp.receipt.allowAmountEdit | boolean | tenant | false | M12 |
| 2691 | VAR | L | Ingresar 4 decimales en cantidad de productos con stock (genera inconsistencias) | s/l | Reemplazado — precisión de cantidad por unidad de medida del producto (M13) validada en toda la cadena | — | — | — | — | — | M13 |
| 2705 | VAR | L | Obligar a seleccionar destinatario en solicitud de aprovisionamiento | s/l | Migrar | PRM-CMP-P4-040 | cmp.supplyRequest.requireRecipient | boolean | tenant | false | M12 |
| 2709 | VAR | L | No incluir datos de empleados (cuenta corriente de proveedor) | GetDatosInforme.CtacteProveedor | Reemplazado — misma capability y alcance que la 2653 (T02) | — | — | — | — | — | M12 (+T02) |
| 2735 | VAR | L | Fecha de entrega de OC obligatoria | s/l | Migrar | PRM-CMP-P4-041 | cmp.purchaseOrder.requireDeliveryDate | boolean | tenant | false | M12 |
| 2777 | VAR | L | En pagos, informar anticipos pendientes del proveedor | s/l | Migrar | PRM-CMP-P4-042 | cmp.payment.warnPendingAdvances | boolean | tenant | true | M12 |
| 2791 | VAR | L | No tomar IVA de productos al importar ítems en compras (requiere remitos con IVA discriminado) | clsComp_Com.GetRem_Pendientes; clsIvaCom; clsNPedido (+1) | Migrar | PRM-CMP-P4-043 | cmp.receipt.vatSource | enum(product, sourceDocument) | tenant | product | M12 |
| 2810 | VAR | L | Fecha estimada de pago de OC obligatoria | s/l | Migrar | PRM-CMP-P4-044 | cmp.purchaseOrder.requireEstimatedPaymentDate | boolean | tenant | false | M12 |
| 2813 | VAR | L | Código de régimen obligatorio en retenciones y percepciones | s/l | Migrar | PRM-CMP-P4-045 | cmp.withholding.requireRegimeCode | boolean | tenant | true | M12 (+M06) |
| 2836 | VAR | L | Permitir modificar manualmente las retenciones | s/l | Migrar | PRM-CMP-P4-046 | cmp.withholding.allowManualOverride | boolean | tenant | false (capability + auditoría) | M12 (+M06) |
| 2867 | VAR | L | Doble autorización en solicitudes de aprovisionamiento | s/l | Migrar | PRM-CMP-P4-047 | cmp.supplyRequest.approvalLevels | integer (1–2) | tenant | 1 | M12 (+T11) |
| 2888 | VAR | FK PLANTILLA | Mail para solicitar cotización de materiales de una solicitud | s/l | Migrar | PRM-CMP-P4-048 | cmp.quoteRequest.templateId | ref:messageTemplates | tenant | plantilla estándar | M12 (+T09) |
| 2890 | VAR | L | Registrar contablemente como gasto el IVA no tomado | clsCierreDiario.GererarAsiento_Compras_Facturacion | Migrar | PRM-CON-P4-001 | con.posting.purchases.nonCreditableVatAsExpense | boolean | tenant | true | M15 |
| 2893 | VAR | FK PLANTILLA | Plantilla para invitación a concurso o licitación | s/l | Migrar | PRM-CMP-P4-049 | cmp.tender.invitationTemplateId | ref:messageTemplates | tenant | plantilla estándar | M12 (+T09) |
| 2896 | VAR | L | Utilizar grupos de secciones en compras | s/l | Migrar | PRM-CMP-P4-050 | cmp.costCenter.useSectionGroups | boolean | tenant | false | M12 (+M15) |
| 2902 | VAR | L | Cargar y mostrar % de IVA en compras por secciones del plan de cuentas | clsCierreDiario.GererarAsiento_Compras_Facturacion; LibroIvaCompras; Get_DetallePorActividad (+2) | Migrar | PRM-CMP-P4-051 | cmp.invoice.vatRateByCostCenterLine | boolean | tenant | false | M12 (+M15) |
| 2905 | VAR | FK PLANTILLA | Plantilla para envío por mail de una orden de compra | s/l | Migrar | PRM-CMP-P4-052 | cmp.purchaseOrder.emailTemplateId | ref:messageTemplates | tenant | plantilla estándar | M12 (+T09) |
| 2906 | VAR | L | Mostrar panel de unidad de gasto al cargar productos desde un vale | s/l | Reemplazado — el panel de imputación a centro de costo es visible siempre que el tenant usa centros de costo | — | — | — | — | — | M12 |
| 2967 | VAR | L | Utilizar partes de producción | s/l | Migrar | PRM-STK-P4-002 | stk.manufacturing.productionReportsEnabled | boolean | tenant | false | M13 |
| 2977 | VAR | L | Consultar ingreso de CAE/CAI al cargar una factura | s/l | Migrar | PRM-CMP-P4-053 | cmp.invoice.authorizationCodeCapture | enum(off, ask, require) | tenant | ask (con verificación ARCA, M06) | M12 (+M06) |
| 2989 | VAR | L | Avisar que el producto no controla stock al agregarlo en un remito | s/l | Migrar | PRM-CMP-P4-054 | cmp.receipt.warnNonStockProduct | boolean | tenant | true | M12 |
| 3030 | VAR | L | Cargar ítem como pendiente activado si controla stock | s/l | Migrar | PRM-CMP-P4-055 | cmp.receipt.markStockItemsPending | boolean [VERIFICAR] | tenant | true | M12 (+M13) |
| 3043 | VAR | L | No permitir generar partes de producción sin órdenes de fabricación | s/l | Migrar | PRM-STK-P4-003 | stk.manufacturing.requireOrderForProductionReport | boolean | tenant | true | M13 |
| 3044 | VAR | L | Permitir cargar días posteriores en pagos con transferencias | clsPagoFacturas.ProcesarMediosDePago | Migrar | PRM-TES-P4-016 | tes.supplierPayment.allowFutureTransferDate | boolean | tenant | false | M14 |
| 3057 | VAR | FK RESPONSA | Responsable por defecto para generar parte de producción | s/l | Migrar | PRM-STK-P4-004 | stk.manufacturing.defaultResponsibleId | ref:employees | tenant | — | M13 |
| 3067 | VAR | L | No permitir exceder el mes actual en la fecha de comprobantes de compra | s/l | Migrar | PRM-CMP-P4-056 | cmp.invoice.blockDateBeyondCurrentMonth | boolean | tenant | true | M12 |
| 3068 | VAR | L | Exigir cuenta contable al cargar o modificar un proveedor | abm_Proveed.abmProveedor__ValidFields | Migrar | PRM-CMP-P4-057 | cmp.supplier.requireAccount | boolean | tenant | true | M12 (+M15) |
| 3071 | VAR | L | Preguntar si imprime etiquetas al cargar comprobantes que mueven stock | s/l | Migrar | PRM-STK-P4-005 | stk.labels.promptOnStockReceipt | boolean | tenant | false | M13 |
| 3101 | VAR | L | Permitir cargar obras en ítems de compras | s/l | Migrar | PRM-CMP-P4-058 | cmp.invoice.allowProjectOnLines | boolean | tenant | false | M12 |
| 3119 | VAR | L | Mostrar importes en pesos en la planilla comparativa de precios | clsInformes_Compras.GetExcel_ComparativaPrecios | Migrar | PRM-CMP-P4-059 | cmp.quoteComparison.showInLocalCurrency | boolean | tenant | true | M12 |
| 3171 | VAR | L | No permitir finalizar órdenes de fabricación manualmente | s/l | Migrar | PRM-STK-P4-006 | stk.manufacturing.allowManualOrderClose | boolean (invertido) | tenant | false | M13 |

### 5.6 STOCK (14)

Los depósitos por defecto 161 / 164 (STOCK) y 165 / 166 (FABRICACION) se fusionan en un mapa por tipo de operación (PRM-STK-P4-007, compartido), con override por sucursal y por usuario (el enum `Usuario.TipoDeposito` de ProCoop usaba estos números como código de variable).

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---:|---|---|---|---|---|---|---|---|---|---|---|
| 161 | VAR | FK DEPOSITO | Depósito por defecto (Stock) | s/l (vía enum `Usuario.TipoDeposito` en Nucleo.GetDeposito) | Migrar | PRM-STK-P4-007 (compartido) | stk.defaultWarehouse[stock] | map(operación → ref:warehouses) | tenant / sucursal / usuario | — | M13 |
| 164 | VAR | FK DEPOSITO | Depósito por defecto (Ventas) | s/l (vía enum en Nucleo.GetDeposito) | Migrar | PRM-STK-P4-007 (compartido) | stk.defaultWarehouse[sales] | map(operación → ref:warehouses) | tenant / sucursal / usuario | — | M13 (+M11) |
| 221 | VAR | L | Exigir carga de remitos al registrar dispositivos | s/l | Migrar | PRM-STK-P4-008 | stk.serialized.requireReceiptOnRegister | boolean | tenant | true | M13 |
| 373 | VAR | L | No permitir stock negativo en movimientos entre depósitos | s/l | Migrar | PRM-STK-P4-009 (compartido) | stk.negativeStockPolicy[transfer] | map(tipo de movimiento → enum(block, warn, allow)) | tenant | block | M13 |
| 2341 | VAR | Lista | Método de cálculo de valorización: FIFO / LIFO / PPP / precio venta / precio costo | clsInformes_Stock.GetFiltros / Imprimir; clsRevaluacion.InicializarFormulario | Migrar | PRM-STK-P4-010 | stk.valuation.defaultMethod | enum(fifo, lifo, weightedAverage, salePrice, costPrice) | tenant | fifo (A validar PA-CFG-P4-04) | M13 (+M15) |
| 2416 | VAR | L | Usar los precios de los productos trazables para la valuación | GetDatosInforme.GetCosto_OT / GetCosto_OM / GetCosto_Vales (+2) | Migrar | PRM-STK-P4-011 | stk.valuation.useSerializedUnitCost | boolean | tenant | true | M13 |
| 2419 | VAR | L | Exigir ingresar obras en los vales | s/l | Migrar | PRM-STK-P4-012 | stk.voucher.requireProject | boolean | tenant | false | M13 |
| 2525 | VAR | L | No permitir stock negativo en movimientos de vales | s/l | Migrar | PRM-STK-P4-009 (compartido) | stk.negativeStockPolicy[voucher] | map(tipo de movimiento → enum(block, warn, allow)) | tenant | block | M13 |
| 2565 | VAR | L | Avisar si la operación deja el stock por debajo del mínimo | s/l | Migrar | PRM-STK-P4-013 | stk.minStock.warnOnMovement | boolean | tenant | true | M13 |
| 2609 | VAR | FK CON_COM (obra) | Obra para vales generados desde Procoop INTEGRA (API/app) | clsProcoop_Integra.Post_Stock | Migrar | PRM-STK-P4-014 | stk.voucher.apiDefaultProjectId | ref:projects | tenant | — | M13 |
| 3003 | VAR | L | Permitir movimiento de stock al lanzar parte de producción | clsOfParteProduccion.Lanzar | Migrar | PRM-STK-P4-015 | stk.manufacturing.moveStockOnLaunch | boolean | tenant | false | M13 |
| 3015 | VAR | FK PROD_SER | Producto usado para determinar costo de mano de obra | clsOrdeFab.Guardar; clsProdSer.Get_CostoFijo / GetProductosValorizados (+3) | Migrar | PRM-STK-P4-016 | stk.manufacturing.laborCostProductId | ref:products | tenant | — | M13 |
| 3041 | VAR | FK OBRAS | Obra por defecto para revaluar automáticamente al precio de costo (requiere 3042) | s/l | Migrar | PRM-STK-P4-017 | stk.revaluation.autoProjectId | ref:projects | tenant | — | M13 |
| 3042 | VAR | FK RESPONSA | Responsable por defecto para revaluar automáticamente al precio de costo (requiere 3041) | s/l | Migrar | PRM-STK-P4-018 | stk.revaluation.autoResponsibleId | ref:employees | tenant | — | M13 |

### 5.7 FABRICACION (4)

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---:|---|---|---|---|---|---|---|---|---|---|---|
| 165 | VAR | FK DEPOSITO | Depósito por defecto (Producción) | s/l (vía enum en Nucleo.GetDeposito) | Migrar | PRM-STK-P4-007 (compartido) | stk.defaultWarehouse[production] | map(operación → ref:warehouses) | tenant / sucursal / usuario | — | M13 |
| 166 | VAR | FK DEPOSITO | Depósito por defecto (Componentes) | s/l (vía enum en Nucleo.GetDeposito) | Migrar | PRM-STK-P4-007 (compartido) | stk.defaultWarehouse[components] | map(operación → ref:warehouses) | tenant / sucursal / usuario | — | M13 |
| 168 | VAR | F | Última fecha de requerimiento | s/l | Reemplazado — estado del job de cálculo de requerimientos (`stk:calcular-requerimientos`, `lastRunAt`) | — | — | — | — | — | M13 |
| 3040 | VAR | C | Id de la orden de fabricación genérica usada en el proceso de productos dañados | clsOrdeFab.ProcesarProductosDañados | Reemplazado — tipo de movimiento propio "baja / reproceso por daño" con motivo, sin orden de fabricación ficticia | — | — | — | — | — | M13 |

### 5.8 CONTABILIDAD (87)

Las 54 cuentas por defecto (`TIP_CTRL = 6`, enum `TipoCuenta`) pasan a **reglas de imputación** del motor de asientos de M15 (`con.postingRules`): rol contable → cuenta, con override por servicio y centro de costo. Las fechas de cierre por módulo pasan a **bloqueos de período por módulo** (`con.periodLocks`), migrando cada fecha como bloqueo inicial (A validar PA-CFG-P4-03).

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---:|---|---|---|---|---|---|---|---|---|---|---|
| 67 | VAR | F | Fecha de cierre de comprobantes de venta | Nucleo.GetFechaCierre; clsModificacionFacturas.ValidarFiltros / validarFacturas | Reemplazado — `con.periodLocks` módulo `fac` (T07 migra la fecha como bloqueo) | — | — | — | — | — | M15 (+M05) |
| 432 | VAR | F | Fecha de cierre de stock | Nucleo.GetFechaCierre; clsValorizarStock.ValorizarMovimientosTrazables | Reemplazado — `con.periodLocks` módulo `stk` | — | — | — | — | — | M15 (+M13) |
| 500 | VAR | F | Fecha de cierre de compras | Nucleo.GetFechaCierre | Reemplazado — `con.periodLocks` módulo `cmp` | — | — | — | — | — | M15 (+M12) |
| 502 | VAR | F | Fecha de cierre de bancos | Nucleo.GetFechaCierre | Reemplazado — `con.periodLocks` módulo `tes` (bancos) | — | — | — | — | — | M15 (+M14) |
| 504 | VAR | F | Fecha de cierre de financiaciones | Nucleo.GetFechaCierre | Reemplazado — `con.periodLocks` módulo `mor` (financiaciones) | — | — | — | — | — | M15 (+M08) |
| 505 | VAR | F | Fecha de cierre de viviendas | Nucleo.GetFechaCierre | Reemplazado — `con.periodLocks` módulo `soc` (vivienda) | — | — | — | — | — | M15 (+M18) |
| 506 | VAR | F | Fecha de cierre de tesorería | Nucleo.GetFechaCierre | Reemplazado — `con.periodLocks` módulo `tes` (tesorería) | — | — | — | — | — | M15 (+M14) |
| 508 | VAR | C | Prefijo para cuentas de Pasivo (2) | clsCierreDiario.CierreCtasPatrimoniales | Reemplazado — atributo `accountType` (asset, liability, equity, income, expense, memorandum) de cada cuenta del plan; los cierres usan el tipo, no el prefijo | — | — | — | — | — | M15 |
| 509 | VAR | C | Prefijo para cuentas de Patrimonio neto (3) | clsCierreDiario.CierreCtasPatrimoniales | Reemplazado — `accountType = equity` | — | — | — | — | — | M15 |
| 510 | VAR | C | Prefijo para cuentas de Ganancias (4) | clsCierreDiario.CierreResultados | Reemplazado — `accountType = income` | — | — | — | — | — | M15 |
| 511 | VAR | C | Prefijo para cuentas de Pérdidas (5) | clsCierreDiario.CierreResultados; ExportarCSV_OCEBA | Reemplazado — `accountType = expense` (también lo usa la exportación OCEBA) | — | — | — | — | — | M15 (+M06) |
| 512 | VAR | C | Prefijo para cuentas de Orden (6) | clsCierreDiario.ValidarCierre | Reemplazado — `accountType = memorandum` | — | — | — | — | — | M15 |
| 513 | VAR | Cuenta | Cuenta para asignación de resultados | ExportarExcel_OCEBA / ExportarCSV_OCEBA | Cuenta contable | PRM-CON-P4-002 | con.postingRule.resultAllocation | accountRef | tenant | — (mapear del plan migrado) | M15 |
| 514 | VAR | C | Prefijo para cuentas de Activo (1) | clsCierreDiario.CierreCtasPatrimoniales | Reemplazado — `accountType = asset` | — | — | — | — | — | M15 |
| 2101 | VAR | Cuenta | Cierre de caja | s/l (enum TipoCuenta) | Cuenta contable | PRM-CON-P4-003 | con.postingRule.cashClose | accountRef | tenant / sucursal | — (mapear) | M15 (+M07) |
| 2102 | VAR | Cuenta | Facturación | s/l (enum TipoCuenta) | Cuenta contable | PRM-CON-P4-004 | con.postingRule.billingReceivable | accountRef | tenant / servicio | — (mapear) | M15 (+M05) |
| 2103 | VAR | Cuenta | Refinanciaciones | s/l (enum TipoCuenta) | Cuenta contable | PRM-CON-P4-005 | con.postingRule.refinancingReceivable | accountRef | tenant | — (mapear) | M15 (+M08) |
| 2104 | VAR | Cuenta | IVA inscripto (débito fiscal) | s/l (enum TipoCuenta) | Cuenta contable | PRM-CON-P4-006 | con.postingRule.vatOutputRegistered | accountRef | tenant | — (mapear) | M15 (+M06) |
| 2105 | VAR | Cuenta | IVA no inscripto | s/l (enum TipoCuenta) | Cuenta contable | PRM-CON-P4-007 | con.postingRule.vatOutputNonRegistered | accountRef | tenant | — (mapear) | M15 (+M06) |
| 2106 | VAR | Cuenta | Percepciones en productos | s/l (enum TipoCuenta) | Cuenta contable | PRM-CON-P4-008 | con.postingRule.salesPerceptionsByProduct | accountRef | tenant / impuesto | — (mapear) | M15 (+M06) |
| 2107 | VAR | Cuenta | Percepciones no categorizados | s/l (enum TipoCuenta) | Cuenta contable | PRM-CON-P4-009 | con.postingRule.salesPerceptionsUncategorized | accountRef | tenant | — (mapear) | M15 (+M06) |
| 2108 | VAR | Cuenta | Energía eléctrica | s/l (enum TipoCuenta) | Cuenta contable | PRM-CON-P4-010 | con.postingRule.serviceRevenue | accountRef | servicio (electricidad) | — (mapear) | M15 (+M02) |
| 2109 | VAR | Cuenta | Intereses en vencimientos dos y tres | s/l (enum TipoCuenta) | Cuenta contable | PRM-CON-P4-011 | con.postingRule.lateDueDateInterest | accountRef | tenant / servicio | — (mapear) | M15 (+M08) |
| 2110 | VAR | Cuenta | Descuentos en remitos | s/l (enum TipoCuenta) | Cuenta contable | PRM-CON-P4-012 | con.postingRule.deliveryNoteDiscounts | accountRef | tenant | — (mapear) | M15 (+M11) |
| 2111 | VAR | Cuenta | Conceptos desconocidos | s/l (enum TipoCuenta) | Cuenta contable | PRM-CON-P4-013 | con.postingRule.unmappedConceptSuspense | accountRef (cuenta puente; alerta si recibe saldo) | tenant | — (mapear) | M15 |
| 2112 | VAR | Cuenta | Compras / proveedores | GetDatosInforme.DeudaProveedor / DeudaProveedorPagoAutorizado / DeudaProveedor_Detalles (+1) | Cuenta contable | PRM-CON-P4-014 | con.postingRule.accountsPayable | accountRef | tenant / proveedor | — (mapear) | M15 (+M12) |
| 2113 | VAR | Cuenta | IVA crédito fiscal | s/l (enum TipoCuenta) | Cuenta contable | PRM-CON-P4-015 | con.postingRule.vatInput | accountRef | tenant | — (mapear) | M15 (+M06) |
| 2114 | VAR | Cuenta | Impuestos varios en compras | s/l (enum TipoCuenta) | Cuenta contable | PRM-CON-P4-016 | con.postingRule.purchaseOtherTaxes | accountRef | tenant / impuesto | — (mapear) | M15 (+M12) |
| 2118 | VAR | Cuenta | Créditos bancarios sin subcategorías | s/l (enum TipoCuenta) | Cuenta contable | PRM-CON-P4-017 | con.postingRule.bankCreditsUncategorized | accountRef | tenant | — (mapear) | M15 (+M14) |
| 2119 | VAR | Cuenta | Débitos bancarios sin subcategorías | s/l (enum TipoCuenta) | Cuenta contable | PRM-CON-P4-018 | con.postingRule.bankDebitsUncategorized | accountRef | tenant | — (mapear) | M15 (+M14) |
| 2121 | VAR | Cuenta | Tarjetas de crédito | s/l (enum TipoCuenta) | Cuenta contable | PRM-CON-P4-019 | con.postingRule.cardCouponsInPortfolio | accountRef | tenant / tarjeta | — (mapear) | M15 (+M14) |
| 2122 | VAR | Cuenta | Valores en cartera | s/l (enum TipoCuenta) | Cuenta contable | PRM-CON-P4-020 | con.postingRule.chequesInPortfolio | accountRef | tenant | — (mapear) | M15 (+M14) |
| 2125 | VAR | Cuenta | Devengamiento de IVA en refinanciaciones | s/l (enum TipoCuenta) | Cuenta contable | PRM-CON-P4-021 | con.postingRule.refinancingVatAccrual | accountRef | tenant | — (mapear) | M15 (+M08) |
| 2126 | VAR | Cuenta | Previsión para deudores incobrables | s/l (enum TipoCuenta) | Cuenta contable | PRM-CON-P4-022 | con.postingRule.badDebtAllowance | accountRef | tenant | — (mapear) | M15 (+M08) |
| 2127 | VAR | Cuenta | Tarjetas de crédito presentadas | s/l (enum TipoCuenta) | Cuenta contable | PRM-CON-P4-023 | con.postingRule.cardCouponsSubmitted | accountRef | tenant / tarjeta | — (mapear) | M15 (+M14) |
| 2128 | VAR | Cuenta | Comisiones de tarjetas de crédito | s/l (enum TipoCuenta) | Cuenta contable | PRM-CON-P4-024 | con.postingRule.cardCommissions | accountRef | tenant / tarjeta | — (mapear) | M15 (+M14) |
| 2129 | VAR | Cuenta | Movimientos de capital | s/l (enum TipoCuenta) | Cuenta contable | PRM-CON-P4-025 | con.postingRule.capitalMovements | accountRef | tenant | — (mapear) | M15 (+M17) |
| 2130 | VAR | Cuenta | Capital a devolver | s/l (enum TipoCuenta) | Cuenta contable | PRM-CON-P4-026 | con.postingRule.capitalToRefund | accountRef | tenant | — (mapear) | M15 (+M17) |
| 2131 | VAR | Cuenta | Capital rescatado por socios incobrables | s/l (enum TipoCuenta) | Cuenta contable | PRM-CON-P4-027 | con.postingRule.capitalRedeemedBadDebtors | accountRef | tenant | — (mapear) | M15 (+M17) |
| 2133 | VAR | Cuenta | Capital integrado | s/l (enum TipoCuenta) | Cuenta contable | PRM-CON-P4-028 | con.postingRule.capitalPaidIn | accountRef | tenant | — (mapear) | M15 (+M17) |
| 2134 | VAR | Cuenta | Valores rechazados | s/l (enum TipoCuenta) | Cuenta contable | PRM-CON-P4-029 | con.postingRule.rejectedCheques | accountRef | tenant | — (mapear) | M15 (+M14) |
| 2135 | VAR | Cuenta | Intereses a futuro por financiaciones | s/l (enum TipoCuenta) | Cuenta contable | PRM-CON-P4-030 | con.postingRule.deferredFinancingInterest | accountRef | tenant | — (mapear) | M15 (+M08) |
| 2136 | VAR | Cuenta | Retenciones en tesorería | s/l (enum TipoCuenta) | Cuenta contable | PRM-CON-P4-031 | con.postingRule.withholdingsSuffered | accountRef | tenant / impuesto | — (mapear) | M15 (+M14) |
| 2137 | VAR | Cuenta | Diferencias en cajas | s/l (enum TipoCuenta) | Cuenta contable | PRM-CON-P4-032 | con.postingRule.cashDifferences | accountRef | tenant / sucursal | — (mapear) | M15 (+M07) |
| 2138 | VAR | Cuenta | Intereses por venta en cuotas | s/l (enum TipoCuenta) | Cuenta contable | PRM-CON-P4-033 | con.postingRule.installmentSaleInterest | accountRef | tenant | — (mapear) | M15 (+M11) |
| 2139 | VAR | Cuenta | Cuenta para ajuste por inflación (RECPAM) | clsCierreDiario.GenerarAsientoAjustesPorInflacion / BienesDeUso_AjusteInf; clsContabilidad.GetSumasYSaldos | Cuenta contable | PRM-CON-P4-034 | con.postingRule.inflationAdjustment | accountRef | tenant | — (mapear) | M15 |
| 2141 | VAR | Cuenta | Descuentos en pagos a proveedores | s/l (enum TipoCuenta) | Cuenta contable | PRM-CON-P4-035 | con.postingRule.supplierPaymentDiscounts | accountRef | tenant | — (mapear) | M15 (+M12) |
| 2148 | VAR | Cuenta | Pago a proveedores en efectivo | s/l (enum TipoCuenta) | Cuenta contable | PRM-CON-P4-036 | con.postingRule.supplierPaymentCash | accountRef | tenant | — (mapear) | M15 (+M14) |
| 2149 | VAR | Cuenta | Pago a proveedores con valores | s/l (enum TipoCuenta) | Cuenta contable | PRM-CON-P4-037 | con.postingRule.supplierPaymentValues | accountRef | tenant | — (mapear) | M15 (+M14) |
| 2150 | VAR | Cuenta | Stock — cuenta asociada a órdenes de trabajo | s/l (enum TipoCuenta) | Cuenta contable | PRM-CON-P4-038 | con.postingRule.stockWorkOrders | accountRef | tenant / servicio | — (mapear) | M15 (+M13) |
| 2151 | VAR | Cuenta | Stock — cuenta asociada a órdenes de mantenimiento | s/l (enum TipoCuenta) | Cuenta contable | PRM-CON-P4-039 | con.postingRule.stockMaintenanceOrders | accountRef | tenant | — (mapear) | M15 (+M13) |
| 2152 | VAR | Cuenta | Stock — cuenta asociada a conciliaciones | s/l (enum TipoCuenta) | Cuenta contable | PRM-CON-P4-040 | con.postingRule.stockCountAdjustments | accountRef | tenant | — (mapear) | M15 (+M13) |
| 2153 | VAR | Cuenta | Stock — cuenta asociada a vales | s/l (enum TipoCuenta) | Cuenta contable | PRM-CON-P4-041 | con.postingRule.stockVouchers | accountRef | tenant / obra | — (mapear) | M15 (+M13) |
| 2154 | VAR | Cuenta | Stock — cuenta asociada a altas en orden | s/l (enum TipoCuenta) | Cuenta contable | PRM-CON-P4-042 | con.postingRule.stockActivationOrders | accountRef | tenant / servicio | — (mapear) | M15 (+M13) |
| 2155 | VAR | Cuenta | Compras — pagos en efectivo desde caja | s/l (enum TipoCuenta) | Cuenta contable | PRM-CON-P4-043 | con.postingRule.supplierPaymentFromCashDesk | accountRef | tenant / sucursal | — (mapear) | M15 (+M14) |
| 2156 | VAR | Cuenta | Compras — pagos con transferencia diferida | s/l (enum TipoCuenta) | Cuenta contable | PRM-CON-P4-044 | con.postingRule.supplierPaymentDeferredTransfer | accountRef | tenant | — (mapear) | M15 (+M14) |
| 2158 | VAR | Cuenta | Facturación — cuenta para prescripción de deuda | s/l (enum TipoCuenta) | Cuenta contable | PRM-CON-P4-045 | con.postingRule.debtPrescription | accountRef | tenant | — (mapear) | M15 (+M08) |
| 2159 | VAR | Cuenta | Compras — cuentas asociadas a descuento de productos/conceptos | s/l (enum TipoCuenta) | Cuenta contable | PRM-CON-P4-046 | con.postingRule.purchaseDiscounts | accountRef | tenant | — (mapear) | M15 (+M12) |
| 2160 | VAR | Cuenta | Ventas — cuentas asociadas a percepción de productos | s/l (enum TipoCuenta) | Cuenta contable | PRM-CON-P4-047 | con.postingRule.salesProductPerceptions | accountRef | tenant / impuesto | — (mapear) | M15 (+M06) |
| 2161 | VAR | Cuenta | Stock — cuenta asociada a productos en comodato | s/l (enum TipoCuenta) | Cuenta contable | PRM-CON-P4-048 | con.postingRule.loanedEquipment | accountRef | tenant / servicio | — (mapear) | M15 (+M13) |
| 2162 | VAR | Cuenta | Compras — cuenta para productos pendientes de entrega (≠ 0 activa el asiento de remitos) | clsCierreDiario.Iniciar_Thread; frmComprobantes_Handler.GuardarRemito | Cuenta contable | PRM-CON-P4-049 | con.postingRule.goodsPendingDelivery | accountRef (vacío = no se genera asiento de remitos) | tenant | — (mapear) | M15 (+M12) |
| 2163 | VAR | Cuenta | Redondeo para cierre de facturación mensual | s/l (enum TipoCuenta) | Cuenta contable | PRM-CON-P4-050 | con.postingRule.billingRounding | accountRef | tenant | — (mapear) | M15 (+M05) |
| 2164 | VAR | Cuenta | Redondeo para cierre de caja diario | s/l (enum TipoCuenta) | Cuenta contable | PRM-CON-P4-051 | con.postingRule.cashCloseRounding | accountRef | tenant | — (mapear) | M15 (+M07) |
| 2165 | VAR | Cuenta | Cobranza — cuenta para acreditaciones pendientes a bancos | s/l (enum TipoCuenta) | Cuenta contable | PRM-CON-P4-052 | con.postingRule.collectionsPendingBankCredit | accountRef | tenant / ente | — (mapear) | M15 (+M07) |
| 2166 | VAR | Cuenta | Técnica — cuenta para horas normales y extra de los participantes | clsCierreDiario.Stock_OT / Stock_OM | Cuenta contable | PRM-CON-P4-053 | con.postingRule.workOrderLaborHours | accountRef | tenant | — (mapear) | M15 (+M10) |
| 2167 | VAR | Cuenta | Técnica — cuenta para horas valuadas de los participantes | clsCierreDiario.Stock_OT / Stock_OM | Cuenta contable | PRM-CON-P4-054 | con.postingRule.workOrderValuedHours | accountRef | tenant | — (mapear) | M15 (+M10) |
| 2190 | VAR | Lista | Tipo de liquidación a deudores por servicios | clsCierreDiario.GetItems_Agrupados / GenerarAsientoVentas / GenerarAsiento_Financiaciones (+3) | Migrar | PRM-CON-P4-055 | con.posting.receivablesGrouping | enum(opciones de la lista ProCoop) [VERIFICAR opciones] | tenant | — (migrar) | M15 |
| 2191 | VAR | L | No utilizar grupos contables al realizar asientos | clsCierreDiario.GetGruposContableAsignados / GetFiltros / Financiaciones (+2) | Migrar | PRM-CON-P4-056 | con.posting.useAccountingGroups | boolean (invertido) | tenant | true | M15 |
| 2376 | VAR | F | Fecha de cierre de sueldos | Nucleo.GetFechaCierre | Reemplazado — `con.periodLocks` módulo `sue` | — | — | — | — | — | M15 (+M16) |
| 2528 | VAR | F | Fecha de cierre de contabilidad | clsAsiento.Validar / Validar_CierreContable; clsModificacionFacturas.validarFacturas | Reemplazado — `con.periodLocks` módulo `con` (bloqueo contable general; también impide modificar facturas de períodos cerrados) | — | — | — | — | — | M15 |
| 2547 | VAR | L | Utilizar gastos e ingresos por sección (centros de costo) | clsCierreDiario.TotalSeccionesRubroRemitos; clsInformes_Contabilidad.GetFiltros / Imprimir (+4) | Migrar | PRM-CON-P4-057 (compartido) | con.costCenter.mode[all] | enum(off, all, payrollOnly) | tenant | off | M15 |
| 2548 | VAR | L | Usar la cuenta de compras (del rubro) en asientos de OT y OM | clsCierreDiario.Stock_OT / Stock_OM | Migrar | PRM-CON-P4-058 | con.posting.workOrders.useProductPurchaseAccount | boolean | tenant | false | M15 (+M10) |
| 2619 | VAR | Lista | Deudores por refinanciación: no separar / separar por tipo de deudor | clsCierreDiario.GenerarAsientoVentas / GenerarAsiento_Financiaciones / InteresesFinanciaciones (+1) | Migrar | PRM-CON-P4-059 | con.posting.refinancingReceivablesByDebtorType | boolean | tenant | false | M15 (+M08) |
| 2714 | VAR | L | Utilizar gastos e ingresos por sección solo en sueldos | clsCierreDiario.TotalSeccionesRubroRemitos; clsInformes_Contabilidad (+2) | Migrar | PRM-CON-P4-057 (compartido) | con.costCenter.mode[payrollOnly] | enum(off, all, payrollOnly) | tenant | off | M15 (+M16) |
| 2734 | VAR | L | Mostrar (generar) asiento contable de productos en comodato | clsCierreDiario.GenerarAsientoStock | Migrar | PRM-CON-P4-060 | con.posting.loanedEquipmentEntries | boolean | tenant | true | M15 (+M13) |
| 2778 | VAR | F | Fecha de cierre de bienes de uso | Nucleo.GetFechaCierre; abm_Bienes_Uso.Validar | Reemplazado — `con.periodLocks` módulo `stk` (bienes de uso) | — | — | — | — | — | M15 (+M13) |
| 2814 | VAR | L | Mostrar columna Sub-Cuenta en administración de cuentas contables | s/l | Reemplazado — columnas configurables del `DataTable` | — | — | — | — | — | M15 |
| 2924 | VAR | C | Códigos de impuesto a informar en archivo de percepciones IIBB Buenos Aires (separados por coma) | clsContabilidad.Get_Percepciones_BsAs / GetCantImportar | Migrar | PRM-FIS-P4-002 | fis.iibbBsAs.perceptionTaxCodes | ref:taxes[] | tenant | [] | M06 |
| 2935 | VAR | E | Código de impuesto para base imponible en archivo DGR (percepciones) | GetDatosInforme.Exportar_ArchivoDGR | Migrar | PRM-FIS-P4-003 | fis.dgr.taxBaseTaxCodeId | ref:taxes | tenant | — | M06 |
| 2936 | VAR | L | Separar cuentas de revalúo | clsCierreDiario.TotalSeccionesRubroRemitos; abm_rps.CargarControles | Migrar | PRM-CON-P4-061 | con.fixedAssets.separateRevaluationAccounts | boolean | tenant | false | M15 (+M13) |
| 2978 | VAR | E | Cantidad de decimales en porcentaje de secciones de asientos | clsAsiento.AgregarDetalle / Comprimir; clsContabilidad.Get_CantidadDecimalesSeccioens | Migrar | PRM-CON-P4-062 | con.costCenter.percentDecimals | integer (0–6) | tenant | 2 | M15 |
| 2982 | VAR | L | Generar asiento con todos los remitos | clsCierreDiario.GererarAsiento_Compras_Remitos; frmComprobantes_Handler.AgregarDetalle / GuardarComp | Migrar | PRM-CON-P4-063 | con.posting.purchases.allReceipts | boolean | tenant | false | M15 (+M12) |
| 3028 | VAR | L | Validar asientos ya generados | s/l | Reemplazado — idempotencia del motor: cada evento económico genera un único asiento; regenerar = reversión + nuevo asiento | — | — | — | — | — | M15 |
| 3061 | VAR | L | Tomar rubro del producto de financiación (variable 308) | clsCierreDiario.GenerarAsientoVentas / GenerarAsiento_Cobranza | Migrar | PRM-CON-P4-064 | con.posting.financing.useProductCategory | boolean | tenant | false | M15 (+M08) |
| 3076 | VAR | L | Usar valores históricos de bienes de uso para amortización e inflación | clsAsiento.Eliminar; clsCierreDiario.TotalSeccionesRubroRemitos; abm_Bienes_Uso | Migrar | PRM-CON-P4-065 | con.fixedAssets.useHistoricalValues | boolean | tenant | false | M15 (+M13) |
| 3100 | VAR | L | Validar que las cajas estén cerradas en el asiento de cobranzas | clsCierreDiario.Cobranza | Migrar | PRM-CON-P4-066 | con.posting.collections.requireClosedCashDesks | boolean | tenant | true | M15 (+M07) |
| 3141 | VAR | Cuenta | Fabricación — cuenta para productos en producción | s/l (enum TipoCuenta) | Cuenta contable | PRM-CON-P4-067 | con.postingRule.workInProgress | accountRef | tenant | — (mapear) | M15 (+M13) |

### 5.9 TESORERIA (33)

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---:|---|---|---|---|---|---|---|---|---|---|---|
| 370 | VAR | C | Informe para imprimir valores (cheques) | clsChequeras.ImprimirValores | Marca — plantilla de impresión de cheques por chequera/banco | — | uxd.template.chequePrint | ref:documentTemplates | cuenta bancaria | plantilla estándar | T03 (+M14) |
| 490 | VAR | FK CON_COM | Concepto para importe exento en liquidación de tarjeta | clsTesoreria.CobrarCupones | Migrar | PRM-TES-P4-017 | tes.cardSettlement.exemptConceptId | ref:purchaseConcepts | tenant / tarjeta | — | M14 |
| 498 | VAR | FK CON_COM | Concepto para impuestos en liquidación de tarjeta (solo impuestos) | clsTesoreria.CobrarCupones | Migrar | PRM-TES-P4-018 | tes.cardSettlement.taxesConceptId | ref:purchaseConcepts | tenant / tarjeta | — | M14 |
| 813 | VAR | FK CON_COM | Concepto para comisiones con IVA diferencial en pago de tarjetas | clsTesoreria.CobrarCupones | Migrar | PRM-TES-P4-019 | tes.cardSettlement.reducedVatCommissionConceptId | ref:purchaseConcepts | tenant / tarjeta | — | M14 |
| 2046 | VAR | FK CON_COM | Concepto para comisiones en liquidación de tarjeta | clsTesoreria.CobrarCupones | Migrar | PRM-TES-P4-020 | tes.cardSettlement.commissionConceptId | ref:purchaseConcepts | tenant / tarjeta | — | M14 |
| 2058 | VAR | L | Permitir salida de efectivo en cambio de valores | s/l | Migrar | PRM-TES-P4-021 (compartido) | tes.valueExchange.allowedOutflows[cash] | enum[] | tenant | todos | M14 |
| 2059 | VAR | L | Permitir salida de valores en cambio de valores | s/l | Migrar | PRM-TES-P4-021 (compartido) | tes.valueExchange.allowedOutflows[thirdPartyValue] | enum[] | tenant | todos | M14 |
| 2060 | VAR | L | Permitir salida de cheques propios y transferencias en cambio de valores | s/l | Migrar | PRM-TES-P4-021 (compartido) | tes.valueExchange.allowedOutflows[ownChequeOrTransfer] | enum[] | tenant | todos | M14 |
| 2061 | VAR | L | Permitir entrada de efectivo en cambio de valores | s/l | Migrar | PRM-TES-P4-022 (compartido) | tes.valueExchange.allowedInflows[cash] | enum[] | tenant | todos | M14 |
| 2062 | VAR | L | Permitir entrada de valores en cambio de valores | s/l | Migrar | PRM-TES-P4-022 (compartido) | tes.valueExchange.allowedInflows[thirdPartyValue] | enum[] | tenant | todos | M14 |
| 2063 | VAR | FK CAT_BANC | Categoría de comprobante depósito de efectivo — Tesorería | s/l | Migrar | PRM-TES-P4-023 | tes.deposit.cashCategoryId | ref:bankMovementCategories | tenant | — | M14 |
| 2064 | VAR | FK CAT_BANC | Categoría de comprobante depósito de valores — Tesorería | s/l | Migrar | PRM-TES-P4-024 | tes.deposit.valuesCategoryId | ref:bankMovementCategories | tenant | — | M14 |
| 2066 | VAR | FK CAT_BANC | Categoría de comprobante depósito de valores — OP — salida | clsPagoFacturas.RegistrarResBan | Migrar | PRM-TES-P4-025 | tes.supplierPayment.valuesDepositCategoryId | ref:bankMovementCategories | tenant | — | M14 |
| 2067 | VAR | FK BANKOS | Cuenta de movimiento para cheques rechazados | clsTesoreria.getValoresEntregadosRechazados / Registrar_Movimiento | Migrar | PRM-TES-P4-026 | tes.rejectedCheques.movementAccountId | ref:treasuryAccounts | tenant | — | M14 |
| 2074 | VAR | FK CAT_BANC | Categoría de comprobante cambio de valores — egreso en tesorería | s/l | Migrar | PRM-TES-P4-027 | tes.valueExchange.outflowCategoryId | ref:bankMovementCategories | tenant | — | M14 |
| 2075 | VAR | FK CAT_BANC | Categoría de comprobante cambio de valores — ingreso en tesorería | s/l | Migrar | PRM-TES-P4-028 | tes.valueExchange.inflowCategoryId | ref:bankMovementCategories | tenant | — | M14 |
| 2076 | VAR | FK BANKOS | Cuenta de movimiento para cambio de valores | clsCierreDiario.Tesoreria_CambioDeValores / GenerarAsiento | Migrar | PRM-TES-P4-029 | tes.valueExchange.movementAccountId | ref:treasuryAccounts | tenant | — | M14 (+M15) |
| 2288 | VAR | L | Permitir modificar fecha de transferencia (puede generar diferencias contables) | clsSueldos.GenerarPago | Migrar | PRM-TES-P4-030 | tes.transfer.allowEditDate | boolean | tenant | false (auditado; nunca en período cerrado) | M14 (+M16) |
| 2378 | VAR | L | Permitir cobros de cupones sin comisiones | clsTesoreria.AnularCobrarCupones | Migrar | PRM-TES-P4-031 | tes.cardSettlement.allowWithoutCommission | boolean | tenant | false | M14 |
| 2384 | VAR | FK CON_COM | Concepto para importe exento en cheques rechazados | clsCierreDiario.Tesoreria_Ing_EG_Excepcional (+1); clsTesoreria.RechazoDeValoresEntregados | Migrar | PRM-TES-P4-032 | tes.rejectedCheques.exemptConceptId | ref:purchaseConcepts | tenant | — | M14 |
| 2454 | VAR | L | Al cobrar cupones, seleccionar cupones de otros bancos | s/l | Migrar | PRM-TES-P4-033 | tes.cardSettlement.allowOtherBankCoupons | boolean | tenant | false | M14 |
| 2456 | VAR | Lista | Validar feriados al cargar cheque propio o valores de terceros: ni preguntar ni exigir / preguntar / exigir | s/l | Migrar | PRM-TES-P4-034 (compartido) | tes.instrument.nonBusinessDayPolicy[ownCheque, thirdPartyValue] | map(instrumento → enum(off, ask, require)) | tenant | ask | M14 |
| 2486 | VAR | FK TIP_VAL | Tipo de valor por defecto al cargar nuevos valores de tercero | s/l | Migrar | PRM-TES-P4-035 | tes.thirdPartyValue.defaultTypeId | ref:valueTypes | tenant | — | M14 |
| 2516 | VAR | L | Seleccionar comprobante de compra en rechazo de valores entregados | s/l | Migrar | PRM-TES-P4-036 | tes.rejectedCheques.allowLinkPurchaseDocument | boolean | tenant | true | M14 (+M12) |
| 2517 | VAR | FK CON_COM | Concepto para gastos en cheques rechazados | clsTesoreria.RechazoDeValoresEntregados | Migrar | PRM-TES-P4-037 | tes.rejectedCheques.expenseConceptId | ref:purchaseConcepts | tenant | — | M14 |
| 2536 | VAR | E | Máxima cantidad de días para determinar cheques vencidos (por defecto 30) | s/l | Migrar | PRM-TES-P4-038 | tes.cheque.expiryDays | integer | tenant | 30 | M14 |
| 2543 | VAR | L | No validar capital pagado en cierre de cajas (si está desactivado, registra los pagos de capital) | clsCajas.CerrarCaja | Migrar | PRM-TES-P4-039 | tes.cashClose.registerCapitalPayments | boolean (invertido) | tenant | true | M14 (+M17) |
| 2578 | VAR | E | Mínima cantidad de meses para la fecha de conciliación de cuentas bancarias | s/l | Migrar | PRM-TES-P4-040 | tes.reconciliation.minMonthsBack | integer [VERIFICAR] | tenant | — (migrar) | M14 |
| 2604 | VAR | L | No validar días no hábiles al cargar cheque propio o transferencia | s/l | Migrar | PRM-TES-P4-034 (compartido) | tes.instrument.nonBusinessDayPolicy[ownCheque, transfer] | map(instrumento → enum(off, ask, require)) | tenant | ask | M14 |
| 2688 | VAR | L | Habilitar cierre de caja de varios días (solo efectivo) | clsCajas.AnularCierreCajas | Migrar | PRM-TES-P4-041 | tes.cashClose.allowMultiDay | boolean | tenant / sucursal | false | M14 (+M07) |
| 2732 | VAR | L | Mostrar check adicional en cobro de cupones de tarjeta | s/l | Descartar — sin lectura y sin semántica documentada (control de UI WinForms) [VERIFICAR] | — | — | — | — | — | M14 |
| 2952 | VAR | L | Realizar presentación de retenciones automáticamente al agregar retenciones | clsCajas.CerrarCaja; clsTesoreria.GenerarMov_Extraordinario | Migrar | PRM-TES-P4-042 | tes.withholdingsSuffered.autoFile | boolean | tenant | false | M14 (+M06) |
| 3178 | VAR | L | Generar comprobante formal en rechazo de cupones de tarjeta | clsTesoreria.CrearAnticipoRechazoCupones | Migrar | PRM-TES-P4-043 | tes.cardSettlement.formalDocumentOnRejection | boolean | tenant | false | M14 (+M05) |

### 5.10 SUELDOS (28)

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---:|---|---|---|---|---|---|---|---|---|---|---|
| 326 | VAR | E | Código de convenio para Banco de la Provincia de Córdoba | GetDatosInforme.ExportarArchivoBancoCordoba / _Bancon / _Excel | Migrar | PRM-SUE-P4-001 | sue.bankFile.bancor.agreementCode | string | cuenta bancaria / empleador | — | M16 (+M14) |
| 2207 | VAR | Lista | Formato de asiento de sueldos (1, 2, 3) | clsCierreDiario.GenerarAsientosSueldos | Migrar | PRM-SUE-P4-002 | sue.posting.entryFormat | enum(format1, format2, format3) [VERIFICAR descripción de formatos] | tenant / empleador | format1 | M16 (+M15) |
| 2262 | VAR | C | CBU para pago de sueldos con Interbanking | clsProveedor.ExportarArchivo_Interbanking; ExportarArchivoInterbanking / Chubut | Reemplazado — CBU como atributo de la cuenta bancaria propia (M14) elegida en el lote de pago | — | — | — | — | — | M14 (+M16) |
| 2406 | VAR | C | CBU para pago de sueldos con Banco Macro | GetDatosInforme.ExportarArchivoMacro | Reemplazado — cuenta bancaria propia (M14) | — | — | — | — | — | M14 (+M16) |
| 2437 | VAR | N | Importe tope de aportes para junio y diciembre (meses de SAC) | ExportarArchivoSicoss; LibroSueldoDigital.Get_Registros_Tipo4 | Plataforma — tabla legal de topes previsionales con vigencia mantenida por la plataforma, con override del tenant (A validar PA-CFG-P4-05) | — | — | — | — | — | M16 (+T01) |
| 2438 | VAR | N | Importe tope de aportes para los meses normales | ExportarArchivoSicoss; LibroSueldoDigital.Get_Registros_Tipo4 | Plataforma — tabla legal de topes previsionales con vigencia (A validar PA-CFG-P4-05) | — | — | — | — | — | M16 (+T01) |
| 2449 | VAR | C | Archivo Banco Nación — identificador de empresa asignado por el banco | ExportarArchivoBancoNacion / _2 / _3 (+1) | Migrar | PRM-SUE-P4-003 | sue.bankFile.bna.companyId | string | cuenta bancaria / empleador | — | M16 (+M14) |
| 2468 | VAR | L | Archivo Banco Nación — usar la cuenta bancaria asignada al empleado | ExportarArchivoBancoNacion | Migrar | PRM-SUE-P4-004 | sue.bankFile.bna.useEmployeeAssignedAccount | boolean | tenant | true | M16 |
| 2481 | VAR | L | Mostrar solo conceptos activos por defecto | s/l | Reemplazado — filtro por defecto / vista guardada del `DataTable` | — | — | — | — | — | M16 |
| 2484 | VAR | L | Solicitar fecha de pago en caso de que no exista | s/l | Migrar | PRM-SUE-P4-005 | sue.payroll.requirePaymentDate | boolean | tenant | true | M16 |
| 2538 | VAR | FK SU_TIPO_NOVEDADES | Tipo de novedad para adelanto de sueldo desde Compras | clsPagoFacturas.Anular; IvaCom_Pendientes | Migrar | PRM-SUE-P4-006 | sue.advance.noveltyTypeId | ref:payrollNoveltyTypes | tenant | — | M16 (+M12) |
| 2598 | VAR | E | Año de control para días de vacaciones pendientes | s/l | Migrar | PRM-SUE-P4-007 | sue.vacation.controlYear | integer | tenant / empleador | año en curso − 1 | M16 |
| 2611 | VAR | Lista | Año calendario para liquidar Ganancias: ene–dic / feb–ene / dic–nov / ene–dic según fecha de pago | clsDatosEmpleado.lstFamiliares; fórmulas Ganancias_* (+15) | Migrar | PRM-SUE-P4-008 | sue.incomeTax.fiscalYearMode | enum(janDec, febJan, decNov, janDecByPaymentDate) | tenant / empleador | janDec | M16 (+M06) |
| 2671 | VAR | C | CBU para pago de sueldos con Banco Nación | ExportarArchivoBancoNacion_2 / _3 | Reemplazado — cuenta bancaria propia (M14) | — | — | — | — | — | M14 (+M16) |
| 2672 | VAR | C | Código de convenio para Banco Nación | ExportarArchivoBancoNacion_2 / _3 | Migrar | PRM-SUE-P4-009 | sue.bankFile.bna.agreementCode | string | cuenta bancaria / empleador | — | M16 (+M14) |
| 2685 | VAR | L | Mostrar fila de filtrado en recibos de sueldo | s/l | Reemplazado — `DataTable` con filtros por columna | — | — | — | — | — | M16 |
| 2751 | VAR | L | Tomar configuración de recibo de sueldos según comprobante | s/l | Migrar | PRM-SUE-P4-010 | sue.payslip.templateByDocumentType | boolean | tenant / empleador | false | M16 (+T03) |
| 2763 | VAR | L | SIRADIG: cargar con fecha noviembre las novedades de diciembre (tramas corridas) | clsNovedades.Cargar_Novedades | Migrar | PRM-SUE-P4-011 | sue.siradig.shiftDecemberToNovember | boolean | tenant | false (A validar PA-CFG-P4-06) | M16 |
| 2886 | VAR | L | Utilizar recibos sin firma digital en procoop.ar (portal del empleado) | clsSueldos.GetRecibosFirmados | Migrar | PRM-SUE-P4-012 | sue.payslip.requireDigitalSignature | boolean (invertido) | tenant / empleador | true | M16 |
| 2942 | VAR | C | CBU para pago de sueldos con Banco Chubut | s/l | Reemplazado — cuenta bancaria propia (M14) | — | — | — | — | — | M14 (+M16) |
| 2943 | VAR | C | Archivo Banco Chubut — identificador de empresa asignado por el banco | s/l | Migrar | PRM-SUE-P4-013 | sue.bankFile.chubut.companyId | string | cuenta bancaria / empleador | — | M16 (+M14) |
| 2944 | VAR | C | Archivo Banco Santander — identificador de empresa asignado por el banco | GetDatosInforme.ExportarArchivoSantander | Migrar | PRM-SUE-P4-014 | sue.bankFile.santander.companyId | string | cuenta bancaria / empleador | — | M16 (+M14) |
| 2985 | VAR | L | Formato CUIL_AÑO_MES en el nombre del PDF al exportar recibos | s/l | Migrar | PRM-SUE-P4-015 | sue.payslip.pdfFileNamePattern | string (plantilla `{cuil}_{year}_{month}`) | tenant | `{cuil}_{year}_{month}` | M16 |
| 3016 | VAR | L | Clasificar el concepto Redondeo como no remunerativo | clsSueldos.GetItems | Migrar | PRM-SUE-P4-016 | sue.concepts.roundingAsNonRemunerative | boolean | tenant / empleador | false | M16 |
| 3065 | VAR | L | Topear vacaciones proporcionales | LibroSueldoDigital.Get_Registros_Tipo2 / Tipo4 | Migrar | PRM-SUE-P4-017 | sue.lsd.capProportionalVacation | boolean | tenant / empleador | false | M16 |
| 3081 | VAR | L | Mostrar ABM de empleados integrado con el ABM de personas | s/l | Reemplazado — el empleado es siempre un rol de la Persona única (M01) | — | — | — | — | — | M16 (+M01) |
| 3107 | VAR | E | Permitir enviar notificación de recibo de sueldo pendiente de firmar | s/l | Migrar | PRM-SUE-P4-018 | sue.payslip.pendingSignatureReminderDays | integer (0 = no notificar) [VERIFICAR] | tenant | 0 | M16 (+T09) |
| 3129 | VAR | L | Permitir múltiples entidades bancarias en el empleado | GetIqueryableSueldosBanco; ExportarArchivoBancoCredicoop / Cordoba (+10) | Migrar | PRM-SUE-P4-019 | sue.employee.allowMultipleBankAccounts | boolean | tenant | false | M16 |

### 5.11 VIVIENDA (14)

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---:|---|---|---|---|---|---|---|---|---|---|---|
| 634 | VAR | N | Mínimo a pagar en factura eventual | clsFacturacionServicio.FacturacionVivienda; clsViviendas.Validar_Configuracion / Get_InfoPlan (+1) | Migrar | PRM-SOC-P4-001 | soc.housing.minEventualPayment | money | tenant / plan de vivienda | — (migrar) | M18 |
| 635 | VAR | N | Mínimo a pagar luego de adjudicar vivienda | clsFacturacionServicio.FacturacionVivienda; clsViviendas.Validar_Configuracion / Get_InfoPlan (+1) | Migrar | PRM-SOC-P4-002 | soc.housing.minPaymentAfterAward | money | tenant / plan de vivienda | — (migrar) | M18 |
| 636 | VAR | N | Máximo a adelantar anualmente por plan de vivienda | s/l | Migrar | PRM-SOC-P4-003 | soc.housing.maxAnnualAdvance | money | tenant / plan de vivienda | — (migrar) | M18 |
| 637 | VAR | N | Cantidad de meses adeudados en facturas por fondo fiduciario | s/l | Migrar | PRM-SOC-P4-004 | soc.housing.trustFundArrearsMonths | integer [VERIFICAR] | tenant / plan de vivienda | — (migrar) | M18 |
| 638 | VAR | N | Concepto para facturación eventual | s/l | Migrar | PRM-SOC-P4-005 | soc.housing.eventualBillingConceptId | ref:products | tenant | — | M18 (+M05) |
| 639 | VAR | FK TIPO_FAC | Tipo de comprobante para cuotas del plan de viviendas | clsAnulacionFacturas.AnularSersoc; clsComprobanteFactura; clsInformes_Vivienda (+5) | Migrar | PRM-SOC-P4-006 | soc.housing.installmentDocumentTypeId | ref:documentTypes | tenant | — | M18 (+M05) |
| 755 | VAR | FK COMPROB | Comprobante para retiro de materiales de viviendas | clsCierreDiario.Stock_Vales; GetCosto_Vales; clsViviendas.LiberarProductosViviendaRetirados | Migrar | PRM-SOC-P4-007 | soc.housing.materialWithdrawalDocumentTypeId | ref:documentTypes | tenant | — | M18 (+M13) |
| 2276 | VAR | FK PROD_SER | Concepto para liquidación por construcción de plan de vivienda | s/l | Migrar | PRM-SOC-P4-008 | soc.housing.constructionSettlementConceptId | ref:products | tenant | — | M18 |
| 2502 | VAR | FK RUBPROV | Rubro para el proveedor de viviendas | frmComprobantes_Handler.LeyendaObsVivienda / Validar | Migrar | PRM-SOC-P4-009 | soc.housing.supplierCategoryId | ref:supplierCategories | tenant | — | M18 (+M12) |
| 2503 | VAR | FK RUB_PYS | Rubro para productos para construir viviendas | frmComprobantes_Handler.Validar; clsInformes_Stock.Imprimir; clsViviendas.Get_MaterialesLiberados | Migrar | PRM-SOC-P4-010 | soc.housing.productCategoryId | ref:productCategories | tenant | — | M18 (+M13) |
| 2569 | VAR | L | Permitir aporte de vivienda superior al % máximo de aporte | clsViviendas.Validar_Guardar | Migrar | PRM-SOC-P4-011 | soc.housing.allowContributionAboveMaxPct | boolean | tenant / plan de vivienda | false | M18 |
| 2628 | VAR | FK COMPROB | Comprobante a generar en entregas de planes de vivienda | s/l | Migrar | PRM-SOC-P4-012 | soc.housing.deliveryDocumentTypeId | ref:documentTypes | tenant | — | M18 |
| 2670 | VAR | FK OBRAS | Obra por defecto para registración contable de vales de vivienda | clsCierreDiario.Stock_Vales; GetCosto_Vales | Migrar | PRM-SOC-P4-013 | soc.housing.voucherDefaultProjectId | ref:projects | tenant | — | M18 (+M15) |
| 3137 | VAR | FK PROD_SER | Concepto por diferencia en rescisión de plan de vivienda | clsDefault.AgregarChequeoEntidades; clsViviendas.Baja_Plan | Migrar | PRM-SOC-P4-014 | soc.housing.terminationDifferenceConceptId | ref:products | tenant | — | M18 (+M05) |

### 5.12 TURNERO (11)

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---:|---|---|---|---|---|---|---|---|---|---|---|
| 67 | PMOVIL/CoopOnline | L | Registrar turno desde la web (requiere la 3064) | s/l (CoopOnline) | Migrar | PRM-CRM-P4-005 | crm.queue.portalBookingEnabled | boolean | tenant / sucursal | false | M09 (+M19) |
| 2005 | VAR | Lista | Forma de mostrar a la próxima persona: por nombre / por número | clsTurnero.CrearTurno | Migrar | PRM-CRM-P4-006 | crm.queue.displayMode | enum(name, number) | tenant / pantalla | number (A validar PA-CFG-P4-02) | M09 |
| 2006 | VAR | E | Puerto para comunicarse con el turnero | clsTurnero ctor | Reemplazado — las pantallas del turnero son páginas web actualizadas por WebSocket/SSE; el agente local solo maneja la impresora de tickets (T06) | — | — | — | — | — | M09 (+T06) |
| 2007 | VAR | C | Pantallas del turnero (separadas por \|) | clsTurnero ctor | Reemplazado — maestro `queueDisplays` por sucursal (pantalla, áreas, boxes) | — | — | — | — | — | M09 |
| 2014 | VAR | FK TUR_BOX | Box para generación automática de turnos | clsTurnero.GetBoxesAbiertos; clsProcoop_Integra.CrearTurno | Migrar | PRM-CRM-P4-007 | crm.queue.autoAssignBoxId | ref:queueBoxes | sucursal | — | M09 |
| 2209 | VAR | Lista | Forma de mostrar los últimos turnos: últimos llamados / agrupado por box | clsTurnero.GetLamadas | Migrar | PRM-CRM-P4-008 | crm.queue.historyLayout | enum(lastCalled, byBox) | pantalla | lastCalled | M09 |
| 2240 | VAR | Lista | Modo de visualización: Modelo 1 destacar último / Modelo 2 todos iguales / Modelo 3 destacar último grande | s/l | Migrar | PRM-CRM-P4-009 | crm.queue.displayTheme | enum(highlightLast, uniform, highlightLastLarge) | pantalla | highlightLast | M09 (+T03) |
| 2700 | VAR | C | Configuración de voz para lectura del turnero | s/l | Migrar | PRM-CRM-P4-010 | crm.queue.voice | object(lang, voice, rate) | pantalla | {lang: "es-AR"} | M09 |
| 3064 | VAR | L | Usar últimos 3 números del DNI para el turno y no imprimirlo | clsTurnero.CrearTurno; clsProcoop_Integra.getTiempoEstimado | Migrar | PRM-CRM-P4-011 | crm.queue.ticketIdMode | enum(sequential, dniLast3) | tenant / sucursal | sequential | M09 |
| 3072 | VAR | L | La grilla de áreas del turnero se despega del borde | s/l | Descartar — ajuste cosmético de la pantalla WinForms; el layout web lo define el tema | — | — | — | — | — | M09 |
| 3089 | VAR | FK USERS | Usuario para registración de turnos en CoopOnline | clsProcoop_Integra.CrearTurno | Reemplazado — el turno web lo registra el socio autenticado con actor de sistema `system:portal`; sin usuario compartido | — | — | — | — | — | M09 (+T02) |

### 5.13 TICKETS (3)

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---:|---|---|---|---|---|---|---|---|---|---|---|
| 2478 | VAR | FK PLANTILLA | Mail para el cierre de un ticket | s/l | Migrar | PRM-CRM-P4-012 | crm.ticket.closedTemplateId | ref:messageTemplates | tenant | plantilla estándar | M09 (+T09) |
| 2479 | VAR | FK PLANTILLA | Mail para el registro de un nuevo ticket | s/l | Migrar | PRM-CRM-P4-013 | crm.ticket.createdTemplateId | ref:messageTemplates | tenant | plantilla estándar | M09 (+T09) |
| 2488 | VAR | N | Importe por hora a bonificar | clsTickets.GenerarDeudaVta | Migrar | PRM-CRM-P4-014 | crm.ticket.bonusHourRate | money (con `validFrom`) | tenant | 0 | M09 (+M11) |

### 5.14 MESA_DE_ENTRADAS (3)

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---:|---|---|---|---|---|---|---|---|---|---|---|
| 2630 | VAR | L | Envío de correo a la cuenta configurada del incidente | s/l | Migrar | PRM-CRM-P4-015 (compartido) | crm.intake.notifyRecipients[incidentMailbox] | enum[] | tenant / tipo de expediente | incluido | M09 (+T09) |
| 2631 | VAR | L | Envío de correo a la cuenta configurada de cada interviniente | s/l | Migrar | PRM-CRM-P4-015 (compartido) | crm.intake.notifyRecipients[participants] | enum[] | tenant / tipo de expediente | incluido | M09 (+T09) |
| 2632 | VAR | L | Envío de correo al titular de la cuenta | s/l | Migrar | PRM-CRM-P4-015 (compartido) | crm.intake.notifyRecipients[accountHolder] | enum[] | tenant / tipo de expediente | incluido | M09 (+T09) |

### 5.15 ACTIVIDADES (1)

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---:|---|---|---|---|---|---|---|---|---|---|---|
| 681 | VAR | F | Fecha del último envío de mails (recordatorios de actividades) | clsSeguimiento.EnviarMails | Reemplazado — `lastRunAt` del job `crm:recordatorios-actividades` (idempotente) | — | — | — | — | — | M09 |

### 5.16 No catalogados (9)

| V2 # | Tabla/canal | Tipo | Descripción ProCoop | Uso en código (resumido) | Decisión | PRM-ID | Clave nueva | Tipo nuevo | Ámbito | Default sugerido | Anexo destino |
|---:|---|---|---|---|---|---|---|---|---|---|---|
| 383 | VAR | ? | Variable heredada; si existe con la 21, `FinalizarChequeos` traslada su valor a la 742 | clsChequeos.FinalizarChequeos | Descartar — migración interna de ProCoop ya aplicada; el valor vigente está en la 742 (otra parte de T04b) | — | — | — | — | — | T04 |
| 473 | VAR | L | Registrar la factura generada en cobranzas con el punto de venta de la caja/usuario (falso = punto de venta por defecto) | clsRegistracionCobranza.NuevaFactura | Migrar | PRM-COB-P4-001 | cob.cashDesk.invoicePointOfSaleSource | enum(cashDesk, tenantDefault) | tenant / sucursal | cashDesk | M07 (+M05) |
| 2206 | VAR | L | Emitir recibo/comprobante automático al registrar notificaciones de mora; también filtra circulares | clsGestionMora.Guardar_Notificaciones / Guardar_Comprobante; FiltrosCirculares | Migrar | PRM-MOR-P4-001 | mor.notice.autoIssueDocument | boolean | tenant | false | M08 |
| 2803 | VAR | E | Entidad de cobro (código de ente) para generar el QR de pago | EntidadDigital.Get_Entidad_Qr | Migrar | PRM-COB-P4-002 | cob.qr.collectionEntityId | ref:collectionEntities | tenant | — | M07 |
| 3142 | VAR | E | Entidad de cobro para el QR de pago en cajeros automáticos (QR ATM) | EntidadDigital.Get_Entidad_Qr_ATM | Migrar | PRM-COB-P4-003 | cob.qrAtm.collectionEntityId | ref:collectionEntities | tenant | — | M07 |
| 74 | VAR | E | Tipo de interés por pago fuera de término en la factura (enum `Facturacion_TipoInteresFactura`) | clsComprobanteFactura.Get_ImporteFactura | Migrar | PRM-MOR-P4-002 | mor.lateInterest.invoiceMode | enum(valores de `Facturacion_TipoInteresFactura`: fijo en pesos, porcentaje fijo, …) | tenant / servicio | — (migrar) | M08 (+M05) |
| 79 | VAR | L | En CVLP, registrar la comisión como nota de débito en lugar de factura | clsCVLP.GenerarCVLP | Migrar | PRM-FAC-P4-001 | fac.cvlp.commissionDocumentType | enum(invoice, debitNote) | tenant | invoice | M05 |
| 2996 | VAR | E | Entidad de cobro por defecto al procesar archivos de rendición en el Agente | clsServicio_Procoop.Procesar_Archivo_Rendicion | Migrar | PRM-COB-P4-004 | cob.settlementImport.defaultEntityId | ref:collectionEntities | tenant | — | M07 |
| 1 | PMOVIL/PMovil | F | Fecha de última actualización (sincronización de tablas) | clsPMovil_Base.Sincroniza_Tablas | Reemplazado — cursor de sincronización por dispositivo en la cola offline (`syncCursor`) | — | — | — | — | — | M10 |

## 6. Resumen

### 6.1 Filas por módulo ProCoop (verificado contra RN-09 §6.2)

| Módulo ProCoop | Declarados RN-09 | Filas en esta parte |
|---|---:|---:|
| TECNICA | 95 | 95 |
| TELEMED | 45 | 45 |
| TELEFONIA | 16 | 16 |
| SMS | 11 | 11 |
| COMPRAS | 109 | 109 |
| STOCK | 14 | 14 |
| FABRICACION | 4 | 4 |
| CONTABILIDAD | 87 | 87 |
| TESORERIA | 33 | 33 |
| SUELDOS | 28 | 28 |
| VIVIENDA | 14 | 14 |
| TURNERO | 11 | 11 |
| TICKETS | 3 | 3 |
| MESA_DE_ENTRADAS | 3 | 3 |
| ACTIVIDADES | 1 | 1 |
| No catalogados | 9 | 9 |
| **Total** | **483** | **483** |

### 6.2 Conteo por decisión

| Decisión | Filas |
|---|---:|
| Migrar | 310 |
| Migrar-servicio | 31 |
| Cuenta contable | 54 |
| Diccionario | 0 |
| Marca | 4 |
| Plataforma | 4 |
| Bóveda | 5 |
| Reemplazado | 68 |
| Descartar | 7 |
| **Total** | **483** |

Las 400 filas con PRM-ID (Migrar, Migrar-servicio, Cuenta contable y Bóveda) se resuelven en **367 parámetros nuevos distintos**, porque 33 números V2 se fusionan en parámetros compartidos: los campos visibles de la app de lecturas, los depósitos por defecto por operación, los instrumentos de la caja de pagos, los impuestos retenidos, la impresión de certificados, el stock negativo por movimiento, el cambio de valores, los días no hábiles, los centros de costo, el número de contrato de Discar, la actualización del precio de compra y los destinatarios de mesa de entradas.

PRM-ID emitidos por código de anexo: TEC 75 · CMP 59 · CON 67 · TES 43 · MED 27 · SUE 19 · STK 18 · CRM 15 · SOC 14 · COM 10 · TAR 8 · COB 4 · FIS 3 · MOR 2 · FAC 1 · POR 1 · VEN 1 (todos correlativos desde P4-001, sin huecos).

### 6.3 Conteo por anexo destino (anexo principal de cada fila)

| Anexo | Filas | Anexo | Filas |
|---|---:|---|---:|
| M03 MED | 50 | M13 STK | 26 |
| M04 TAR | 8 | M14 TES | 56 |
| M05 FAC | 1 | M15 CON | 88 |
| M06 FIS | 3 | M16 SUE | 25 |
| M07 COB | 5 | M17 INS | 5 |
| M08 MOR | 2 | M18 SOC | 16 |
| M09 CRM | 22 | M19 POR | 1 |
| M10 TEC | 85 | T01 PLA | 1 |
| M11 VEN | 1 | T03 UXD | 4 |
| M12 CMP | 70 | T04 CFG | 1 |
| T06 INT | 5 | T09 COM | 8 |
| | | **Total** | **483** |

### 6.4 Parámetros que revelan reglas de negocio no obvias (para incorporar en los anexos de módulo)

- **V2 344 / 2998 / 3031 (M10, M09)**: la numeración de OT puede ser única por servicio y año, y además partirse por reclamo/no reclamo y por tipo de tarea; los reclamos tienen numeración propia (continua o por servicio) que también se imprime.
- **V2 2483 / 2485 / 2661 / 2907 (M10, M05)**: al reconectar se puede generar un crédito por los días desconectados o, si el período no se facturó, un débito por los días restantes; la OT se puede cerrar sin emitir esos comprobantes solo si se habilita.
- **V2 2570 / 2587 / 2625 (M10, M04)**: el cambio de categoría genera un proporcional con concepto propio, que puede limitarse a importes positivos y cobrarse en el momento o en el próximo ciclo (RN-07 agrega un día tope del mes, la 2755).
- **V2 2399 (M03)**: ProCoop borra número y matrícula del medidor al retirarlo. CoopApps cierra la vigencia sin borrar nada, y esto cambia los informes históricos.
- **V2 2891 (M10, M07)**: por defecto, ProCoop verifica pagos pendientes antes de confirmar una OT, así que la deuda bloquea el cierre técnico.
- **V2 388 / 2655 (M10)**: las altas y reconexiones de servicios que informan a técnica exigen factibilidad, y se pueden crear OT sobre servicios pendientes de conexión.
- **V2 2722 / 2723 / 3085 / 2166 / 2167 / 460 (M10, M15)**: las horas hombre de las OT se valúan con tarifas normal y extra y se contabilizan en el cierre diario contra cuentas propias. La OT tiene costo contable además del de materiales.
- **V2 82 (M10, M04)**: un servicio de "central virtual" hace gratuitas las llamadas internas entre sus líneas en la tasación.
- **V2 471 / 64 / 2346 (M04)**: hay un consumo mínimo por llamada que no aplica a ciertas claves de tasación (0 y 1, locales/urbanas), y en el formato Telco IP la clave 99 se tasa en cero.
- **V2 238 (M10)**: la recarga de telefonía prepaga genera una OT de una operación específica, no solo un movimiento de saldo.
- **V2 2682 (M03, M04)**: al confirmar lecturas se toma la categoría vigente del servicio en ese momento, no la de la generación de la ruta.
- **V2 2590 (M03)**: los grandes consumos tienen un orden de ruta propio (orden de impresión o código de producto).
- **V2 583 (M12, M13)**: la factura de compra puede no mover stock y dejar ese efecto solo al remito. Es una elección estructural del circuito de compras.
- **V2 2201 / 2457 / 2377 / 2382 (M12, T11)**: facturas y OC por encima de un importe quedan pendientes de autorización para el pago. Es un workflow por monto.
- **V2 2310 (M12, M06)**: la base imponible de las retenciones sobre anticipos se calcula descontando un IVA supuesto (21 % por defecto); también se aplica a comprobantes sin IVA discriminado.
- **V2 2045 (M12, M06)**: las retenciones practicadas después del día límite se informan en el período siguiente.
- **V2 2019 (M12, M14)**: un proveedor puede pagar por cuenta de otro (cesión o pago a tercero).
- **V2 144 / 2025 (M14, M07)**: el pago a proveedores desde la caja de cobranza deja una salida de efectivo pendiente que la caja tiene que rendir, con tope; `FinalizarChequeos` reinicia la 144 en cada actualización.
- **V2 2543 (M14, M17)**: el cierre de caja registra los pagos de capital social cobrados (integración con capital de M17).
- **V2 3100 (M15, M07)**: el asiento de cobranzas exige que las cajas del día estén cerradas.
- **V2 2162 (M15, M12)**: el asiento de remitos de compra (productos pendientes de entrega) solo existe si hay cuenta configurada. La presencia de la cuenta activa el asiento.
- **V2 2890 (M15)**: el IVA no computable se registra como gasto.
- **V2 2734 / 2161 (M15, M13)**: los equipos en comodato generan asiento contable propio (relevante para el piloto Internet).
- **V2 2111 (M15)**: existe una cuenta puente para conceptos sin imputación. En CoopApps debe alertar cuando tenga saldo.
- **V2 508–514 (M15)**: los cierres de resultados y patrimoniales de ProCoop dependen del primer dígito del código de cuenta. Al migrar el plan hay que asignar `accountType` y validar que coincida con el prefijo.
- **V2 2528 / 67 (M15, M05)**: el cierre contable también impide modificar facturas de períodos cerrados.
- **V2 2611 (M16)**: el año fiscal de Ganancias es configurable (ene–dic, feb–ene, dic–nov o según fecha de pago) y condiciona las deducciones mensuales.
- **V2 2437 / 2438 (M16)**: el tope de aportes de SICOSS/LSD es distinto en los meses de SAC (junio y diciembre).
- **V2 2763 (M16)**: hay un parche operativo de SIRADIG que imputa en noviembre las novedades de diciembre.
- **V2 3016 (M16)**: el redondeo del recibo puede clasificarse como no remunerativo, y eso afecta las bases de aportes.
- **V2 2034 / 2538 (M12, M16)**: un adelanto de sueldo pagado desde Compras genera automáticamente una novedad de sueldos de un tipo dado; anular el pago la revierte.
- **V2 634 / 635 / 636 / 2569 (M18)**: los planes de vivienda tienen mínimos de pago distintos antes y después de la adjudicación, un máximo anual de adelanto y un porcentaje máximo de aporte.
- **V2 2502 / 2503 (M18, M12)**: las compras a proveedores del rubro vivienda exigen productos del rubro de construcción y una leyenda o vínculo con el plan.
- **V2 3137 (M18)**: la rescisión del plan de vivienda genera un comprobante por diferencia con concepto propio.
- **V2 3064 (M09)**: el turno puede identificarse con los últimos 3 dígitos del DNI sin imprimir ticket. Es necesario para sacar turno desde la web (V2 67).
- **V2 2488 (M09, M11)**: los tickets generan deuda de venta y pueden bonificar horas a un valor configurado.
- **V2 2206 (M08)**: registrar notificaciones de mora puede emitir un comprobante (cargo por notificación) automáticamente.
- **V2 473 (M07, M05)**: la factura emitida en la caja de cobranza toma el punto de venta de la caja o del usuario, no el del tenant.

## 7. Preguntas abiertas
> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueidentifier`, `DECIMAL`, `DATETIME2`, etc.; ver `07-ddl`). Menciones puntuales de Mongo/Mongoose/BullMQ sin tipo de columna = **comparativa histórica** Connectia, sin efecto en build.


### PA-CFG-P4-01 — Módem GSM local para SMS
- **Pregunta:** ¿CoopApps tiene que soportar el envío de SMS por un módem GSM conectado a un puesto de la cooperativa, como ProCoop (V2 2047–2049)?
- **Contexto:** ProCoop tiene parámetros de desactivación de módem por errores. El stack de CoopApps (DEC-001) envía por proveedores vía API (Amazon SNS u otro gateway) con reintentos en BullMQ. Un módem local requiere el agente de hardware (DEC-007 lo admite para turnero y otros periféricos).
- **Opciones:**
  - A) Solo proveedores por API; el módem local queda fuera **(Recomendada)** — menos soporte en sitio y trazabilidad completa; las cooperativas con módem migran a un gateway.
  - B) Soportar módem GSM mediante el agente local como proveedor alternativo — más alcance, pero agrega mantenimiento de hardware y drivers.
  - C) Soportarlo solo como contingencia cuando el proveedor API no esté disponible — complejidad intermedia.
- **Impacto si no se responde:** se asume A; V2 2047 queda como política de plataforma.
- **Bloquea:** PRM-COM-P4-001, PRM-COM-P4-002; T09 (canal SMS), O2.

### PA-CFG-P4-02 — Nombre del socio en la pantalla pública del turnero
- **Pregunta:** ¿El turnero puede mostrar el nombre de la persona en la pantalla pública, como permite ProCoop (V2 2005, que por defecto muestra el nombre)?
- **Contexto:** exhibir nombres en una sala pública expone datos personales (Ley 25.326). ProCoop usa el nombre por defecto.
- **Opciones:**
  - A) Por defecto se muestra número o código; el tenant puede habilitar el nombre bajo su responsabilidad, con aviso **(Recomendada)** — privacidad por defecto sin perder la funcionalidad.
  - B) Replicar ProCoop (nombre por defecto) — continuidad visual para las cooperativas migradas.
  - C) Prohibir el nombre — máxima privacidad; algunas cooperativas pierden una función que usan.
- **Impacto si no se responde:** se asume A; los tenants migrados con nombre activo conservan el valor con aviso en la publicación de configuración.
- **Bloquea:** PRM-CRM-P4-006; M09 turnero, O10.

### PA-CFG-P4-03 — Fechas de cierre por módulo
- **Pregunta:** ¿Se conservan los bloqueos de período independientes por módulo (ventas, compras, stock, bancos, tesorería, financiaciones, viviendas, sueldos, bienes de uso, contabilidad), como en ProCoop (V2 67, 432, 500, 502, 504, 505, 506, 2376, 2528, 2778)?
- **Contexto:** ProCoop tiene una fecha de cierre por módulo además del cierre contable. CoopApps las reemplaza por `con.periodLocks`; falta decidir si el bloqueo es por módulo o único.
- **Opciones:**
  - A) Bloqueo por módulo más bloqueo contable general que prevalece; T07 migra cada fecha **(Recomendada)** — mismo control operativo que hoy (por ejemplo, cerrar compras antes que contabilidad).
  - B) Solo el bloqueo contable general — más simple, pero se pierde el cierre escalonado por área.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** M15 (bloqueos de período), M05/M12/M13/M14/M16/M18 (validación de fechas), O5/O8.

### PA-CFG-P4-04 — Métodos de valorización de stock
- **Pregunta:** ¿Qué métodos de la V2 2341 (FIFO, LIFO, PPP, precio de venta, precio de costo) se admiten para la **valuación contable** y cuáles solo como criterio de informe?
- **Contexto:** ProCoop permite los cinco como método de cálculo. Para la valuación contable, las normas argentinas usan costo de reposición o costo (FIFO/PPP); LIFO y precio de venta no son admitidos en la práctica contable habitual.
- **Opciones:**
  - A) Contable: FIFO o PPP (uno por tenant). Informe: los cinco **(Recomendada)** — consistencia contable sin perder los informes gerenciales.
  - B) Replicar ProCoop: los cinco también para la valuación contable — continuidad total, con riesgo de valuaciones no admitidas.
  - C) Solo PPP — más simple; algunas cooperativas tendrían que cambiar su método.
- **Impacto si no se responde:** se asume A; los tenants migrados con LIFO, precio de venta o precio de costo pasan a FIFO para la contabilidad, con aviso.
- **Bloquea:** PRM-STK-P4-010; M13 valorización, M15 asientos de stock, O8.

### PA-CFG-P4-05 — Topes previsionales y valores legales de sueldos
- **Pregunta:** ¿Los topes de aportes (V2 2437 y 2438) y los valores legales similares los mantiene la plataforma para todos los tenants o los carga cada cooperativa?
- **Contexto:** en ProCoop cada cooperativa los actualiza a mano. Son valores normativos comunes (ANSES/ARCA) que cambian por resolución.
- **Opciones:**
  - A) Tabla legal de plataforma con vigencia, mantenida por CoopApps, con override del tenant auditado **(Recomendada)** — menos errores y una sola actualización para todos.
  - B) Cada tenant los carga como parámetro propio — replica ProCoop; con riesgo de topes desactualizados.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** M16 (SICOSS, LSD), T01 (tablas legales de plataforma), O9.

### PA-CFG-P4-06 — Parches operativos de ProCoop
- **Pregunta:** ¿Se replican como opciones los parámetros que existen para resolver defectos de formatos externos (V2 2763 SIRADIG en noviembre y V2 3063 corrección de cabecera y fecha de txt)?
- **Contexto:** la regla DEC-007 incluye todo lo que hace ProCoop, pero estos parámetros corrigen problemas puntuales de archivos de terceros. Si el defecto ya no existe, generan imputaciones incorrectas.
- **Opciones:**
  - A) Migrarlos como opciones desactivadas por defecto, documentadas como compatibilidad y revisables en cada versión de formato **(Recomendada)** — no se pierde la función para quien la necesite.
  - B) Descartarlos y resolverlo en el importador de cada formato — catálogo más limpio, con riesgo de regresión en las cooperativas que hoy dependen de ellos.
- **Impacto si no se responde:** se asume A.
- **Bloquea:** PRM-SUE-P4-011, PRM-MED-P4-026; O7, O9.

