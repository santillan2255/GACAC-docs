# 13 — Auditoría de aplicación del impacto stack (CoopApps / GoodApps)

Generado automáticamente el **19-11-2026** por `_trabajo/audit_impacto_stack.py`.
Ámbito: anexos canónicos, maestro, guía, `06`, `07-*`, presentación (sin `OLD/` ni backups).

## Resumen

| Métrica | Valor |
|---|---|
| Archivos revisados | 66 |
| Anexos con banner DEC-111 | 37 |
| Anexos M/T sin banner | 0 |
| Archivos que mencionan Azure SQL | 47 |
| Líneas con tokens Mongo (revisar) | 3471 |
| Líneas Node/Vue (revisar) | 21 |

### Interpretación

- Residuos **esperados** en T05/T01 cuerpo histórico hasta completar fase de barrido; deben tener **banner** y §7.0/maestro §5 como norma.
- Residuos **no esperados** en presentación export (DIR-13) ni en `_GUIA` §4–§5 sin nota de reemplazo.

## Anexos sin banner normativo

_Ninguno._

## DEC-001 como stack vigente (sin reemplazo explícito)

### `docs/especificacion/00-ESPECIFICACION-MAESTRA.md`
- L139: `| DEC-001 | Stack | Connectia tal cual: **Node.js 20 ESM + Express + MongoDB 7** (replica set, transacciones multi-docum`
- L156: `| DEC-001 | Stack Node + Mongo + Vue | **DEC-111** (.NET 10 + Azure SQL + React 19 + EF Core) |`

### `docs/especificacion/01-registro-decisiones.md`
- L7: `| DEC-001 | 04-11-2026 | Stack tecnológico | Node + Mongo + Vue (Connectia) | — | Se reutilizan patrones y componentes d`

### `docs/especificacion/_GUIA-REDACCION-ANEXOS.md`
- L47: `| Stack | DEC-001: Node + Express + Mongo + Mongoose + Vue (Connectia) | **DEC-111**: .NET 10, ASP.NET Core, EF Core, **`

### `docs/especificacion/anexos/T01-PLA-plataforma-saas.md`
- L178: `| RF-PLA-002 | Stack: Node.js 20 ESM, Express 4, MongoDB 7 en replica set, Mongoose 8, Vue 3.5 + Vite + Pinia + Vue Rout`
- L2333: `| CTR-PLA-02 | DFA Módulo 1 (OpenIddict / identidad .NET) vs DEC-001 | Stack de identidad | JWT propio en Node (T02); cl`

### `docs/especificacion/anexos/T02-IAM-identidad-roles-auditoria.md`
- L4627: `| CTR-IAM-02 | DFA M1 ("login moderno con OpenIddict") vs DEC-001 | Stack .NET vs Node.js | Servidor de autenticación pr`

### `docs/especificacion/anexos/T08-NFR-no-funcionales-seguridad.md`
- L1556: `| CTR-NFR-11 | DFA M1 mejoras ("OpenIddict"; "una base por cooperativa") vs. DEC-001/002 | Tecnología .NET y modelo de b`


## Menciones Node / Vue / Express

### `docs/especificacion/00-ESPECIFICACION-MAESTRA.md`
- L139: `| DEC-001 | Stack | Connectia tal cual: **Node.js 20 ESM + Express + MongoDB 7** (replica set, transacciones multi-docum`

### `docs/especificacion/_GUIA-REDACCION-ANEXOS.md`
- L47: `| Stack | DEC-001: Node + Express + Mongo + Mongoose + Vue (Connectia) | **DEC-111**: .NET 10, ASP.NET Core, EF Core, **`

### `docs/especificacion/anexos/M07-COB-cuenta-corriente-cobranza.md`
- L102: `| Ente recaudador | Entidad externa que cobra por cuenta de la cooperativa (Red Link, SIRO, Banelco, Pago Fácil, Rapipag`
- L300: `| RF-COB-099 | Proveer un motor declarativo de layouts versionado (cabecera, detalle, pie, posición, largo, decimales im`
- L581: `| RN-COB-097 | Rendición Banelco/Pago Fácil/Rapipago/Cobro Express: cliente por cuenta y comprobante por código de barra`
- L2699: `| Pago Fácil, Rapipago, Cobro Express | Ente / archivo de rendición | Importa | Código de barras e importe | SFTP / manu`
- L3313: `| §5.3 Banelco, Pago Fácil, Rapipago, Cobro Express | 13; PRM-COB-094 |`

### `docs/especificacion/anexos/M19-POR-portal-socio-landing.md`
- L427: `| RN-POR-009 | El cambio de ámbito (tenant) o de espacio (socio/empleado) recalcula permisos y purga caché del Service W`
- L1130: `- **Landing** (`apps/landing`, Vue 3 SSR/SSG por tenant para SEO y velocidad): encabezado con logo del tenant, navegació`
- L1932: `| PR-POR-25 | Cambio de ámbito TEN-001 → TEN-002 | Sin datos de TEN-001 en Pinia, Service Worker, IndexedDB ni colas |`

### `docs/especificacion/anexos/T01-PLA-plataforma-saas.md`
- L178: `| RF-PLA-002 | Stack: Node.js 20 ESM, Express 4, MongoDB 7 en replica set, Mongoose 8, Vue 3.5 + Vite + Pinia + Vue Rout`
- L512: `| Runtime | Node.js ESM puro (`"type": "module"`) | 20 LTS (imagen `node:20-alpine`) | CNX §2.1 [COPIAR] |`
- L513: `| HTTP | Express | ^4.21 | CNX [COPIAR] |`
- L526: `| Frontends | Vue 3.5 + Vite 6 + Pinia 2 + Vue Router 4 + Tailwind 3.4 + axios; `vite-plugin-pwa` | — | CNX §2.1 [COPIAR`
- L565: `│  │     ├─ app.js               # Express: middlewares y montaje de routers declarados por manifiestos`
- L2335: `| CTR-PLA-04 | CNX §1/§2 (stack no decidido; despliegue Azure Container Apps) vs DEC-004 | Nube/stack | Node 20 + Mongo `

### `docs/especificacion/anexos/T02-IAM-identidad-roles-auditoria.md`
- L2921: `| RF-IAM-004 | El **cambio de ámbito** emite un token nuevo y obliga a recalcular permisos y datos visibles, limpiando c`
- L4627: `| CTR-IAM-02 | DFA M1 ("login moderno con OpenIddict") vs DEC-001 | Stack .NET vs Node.js | Servidor de autenticación pr`

### `docs/especificacion/anexos/T06-INT-integraciones.md`
- L1890: `#### FI-INT-41 — Otros entes recaudadores (Cobro Express, Bapro Pagos, Provincia Pagos y similares)`

### `docs/especificacion/anexos/T08-NFR-no-funcionales-seguridad.md`
- L565: `| RNF-NFR-127 | Trazas OpenTelemetry con autoinstrumentación de HTTP, Express, MongoDB, ioredis y BullMQ, más spans manu`

### `docs/especificacion/anexos/T10-BIA-reportes-bi-apis.md`
- L1911: `- **Contenido:** inicio rápido con `curl`, verificación de firma de webhooks en Node.js/Python/C#, tabla de problemas RF`


## Menciones Mongo / Mongoose / tipos documento

### `docs/especificacion/00-ESPECIFICACION-MAESTRA.md`
- L139: `| DEC-001 | Stack | Connectia tal cual: **Node.js 20 ESM + Express + MongoDB 7** (replica set, transacciones multi-docum`
- L140: `| DEC-002 | Multitenancy | **Base de datos única compartida** con `tenantId` en todo documento | Índices compuestos que `
- L141: `| DEC-003 | Arquitectura | **Monolito modular** + outbox de eventos + workers BullMQ | Un backend con módulos de dominio`
- L142: `| DEC-004 | Despliegue | **Docker agnóstico de nube**; AWS como referencia | Contenedores para API, workers, admin, PWA `
- L157: `| DEC-002 (parte física) | `tenantId` en documento, plugin Mongoose | **DEC-110** (`TenantId` en tablas, filtros EF, índ`
- L159: `| DEC-001 (colas) | BullMQ + Redis | **Azure Queue Storage** + workers .NET; Redis en Azure donde aplique (§5) |`
- L232: `| DEC-074 | PA-INT-02 Bóveda de secretos | Cifrado por sobre (envelope encryption) propio en MongoDB con clave maestra e`
- L658: `| Dinero | `Decimal128` + `decimal.js`; precisión y redondeo por concepto (AGR-011); `currency` (ARS por defecto) |`
- L693: `| O0 | Fundaciones: monorepo, Docker, CI, librerías compartidas, shells, design system, auth básica, tenancy, auditoría,`

### `docs/especificacion/01-registro-decisiones.md`
- L85: `| DEC-074 | 04-11-2026 | PA-INT-02 Bóveda de secretos | Cifrado por sobre (envelope encryption) propio en MongoDB con cl`
- L112: `| DEC-100 | 10-11-2026 | Verificador de integridad referencial (aporte A8) | Proceso nocturno por tenant que recorre las`

### `docs/especificacion/03-plan-de-olas-y-prompts.md`
- L60: `| O0 | Fundaciones: monorepo, CI, tenancy, IAM base, outbox/BullMQ, bóveda, auditoría, S3, PDF, design system, diccionar`
- L116: `| R11 | **Convenciones obligatorias** (maestro §13 y guía §5): inglés camelCase en código y datos; UI con `dict:<clave>``
- L138: `| `npm test` | Unitarias e integración (Mongo replica set y Redis en contenedor) |`
- L143: `| `docker compose -f infra/docker/compose.yml up -d` | Entorno local completo (api, worker, admin, pwa, landing, mongo r`
- L194: `1. `docker compose up` levanta api, worker, admin, pwa, landing, Mongo replica set, Redis, almacenamiento S3 compatible `
- L254: `| PRO-O0-08 | Jobs BullMQ, programación por tenant y patrón de operaciones | 10 |`
- L277: `ENTREGABLES: npm workspaces; árbol exacto de T01 §7.3; apps/api/src/modules/<cod>/ con manifest.js e index.js vacíos par`
- L307: `ENTREGABLES: packages/shared/schemas (base Zod de documento con tenantId, legalEntityId opcional por tipo, createdAt, up`
- L322: `ENTREGABLES: plugin Mongoose de tenancy (inyecta filtro en find*, count*, update*, delete*, replaceOne, distinct, aggreg`
- L367: `ENTREGABLES: servicio publish() transaccional sobre outboxEvents; relay a BullMQ con reintentos; sobre estándar (eventId`
- L374: `#### PRO-O0-08 — Jobs BullMQ, programación por tenant y patrón de operaciones`
- L377: `PRO-O0-08 — Jobs BullMQ, programación por tenant y patrón de operaciones`
- L443: `ENTREGABLES: plugin de auditoría Mongoose (valores previos y posteriores, actor, tenant, requestId, motivo) que excluye `
- L563: `ENTREGABLES: subesquema legacy {system, table, key, runId, hash} en packages/shared; colección legacyIdMap; almacenamien`
- L889: `DECISIONES v1.2 (10-11-2026): DEC-100 (la integridad entre colecciones no usa claves foráneas, incompatibles con DEC-001`
- L936: `ENTREGABLES: metadatos de sensibilidad en esquemas Mongoose y generador del inventario; privacyRequests con plazos legal`
- L1405: `| Stock negativo o series duplicadas | Movimientos transaccionales en replica set y unicidad de serie por tenant |`
- L1795: `ENTREGABLES: tariffSchedules y tariffVersions (draft, approved, published, superseded) con resolución o acta de respaldo`
- L2226: `ENTREGABLES: journalEntries balanceados en Decimal128; postingRules versionadas por evento y tipo; consumidores idempote`

### `docs/especificacion/07-catalogo-tablas-sql.md`
- L471: `| Propósito (resumen) | Ejecuciones de jobs BullMQ; TTL |`
- L9608: `| Propósito (resumen) | Mapa clave ProCoop → ObjectId |`

### `docs/especificacion/07-modelo-relacional-azure-sql.md`
- L226: `| `ExternalJobId` | `varchar(64)` | id cola Azure (antes BullMQ) |`

### `docs/especificacion/_GUIA-REDACCION-ANEXOS.md`
- L47: `| Stack | DEC-001: Node + Express + Mongo + Mongoose + Vue (Connectia) | **DEC-111**: .NET 10, ASP.NET Core, EF Core, **`
- L155: `| O0 | Fundaciones: monorepo, Docker, CI, convenciones, librerías compartidas (money, fechas, Zod), shells AdminShell/Ap`

### `docs/especificacion/anexos/M01-PER-personas-titulares-cuentas.md`
- L628: `- Todo documento lleva `tenantId` (ObjectId, obligatorio, primer campo de todos los índices), `createdAt`, `updatedAt`, `
- L655: `| `maritalStatusId` | ObjectId (`maritalStatuses`) | No | Estado civil. Referencia: `enumerationItems` (T04), catálogo ``
- L656: `| `occupationId` | ObjectId (`occupations`) | No | Ocupación/profesión (usada por tarifas de adherente). Referencia: `en`
- L657: `| `nationalityCountryId` | ObjectId (T04 `countries`) | No | Nacionalidad. | ID | `PAISES` |`
- L671: `| `mergedIntoPersonId` | ObjectId | No | Persona sobreviviente si `merged`. | OP | — |`
- L678: `| `_id` | ObjectId | Sí | Identificador del subdocumento. |`
- L679: `| `documentTypeId` | ObjectId (`identityDocumentTypes` de T04) | Sí | Referencia a la colección canónica de tipos de doc`
- L681: `| `issuingCountryId` | ObjectId | No | País emisor (pasaporte, cédula extranjera). |`
- L685: `| `linkedIdentifierId` | ObjectId | No | Relación verificada DNI↔CUIT/CUIL. |`
- L696: `| `documentTypeId` | ObjectId | Sí | Tipo de documento del identificador. | `identityDocumentTypes` (T04) |`
- L698: `| `personId` | ObjectId | Sí | Persona dueña del identificador. | `persons` (M01) |`
- L699: `| `exceptionId` | ObjectId | No | Excepción aprobada que permite repetir el identificador (RN-PER-005); nulo en el caso `
- L707: `| `_id` | ObjectId | Sí | — |`
- L725: `| `personId` | ObjectId | Sí | Persona. | SE | — |`
- L728: `| `evidenceDocumentId` | ObjectId [T11] | No | Respaldo. | SE | — |`
- L730: `| `consentId` | ObjectId (`consentRecords` de T08; CTR-DAT-18, antes `consents`) | Sí | Consentimiento o base específica`
- L741: `| `personId` | ObjectId | Sí | Persona titular. | ID | `SOCIOS.COD_PER` |`
- L748: `| `closeReasonId` | ObjectId (`holderCloseReasons`) | Sí si `closed` | Causa de baja. Referencia: `enumerationItems` (T0`
- L754: `| `principalAccountId` | ObjectId | Sí si tiene cuentas | Cuenta principal (RN-PER-029). | OP | `SUMSOC.PRINCIPAL` |`
- L767: `| `holderId` | ObjectId | Sí | Titular. | OP | `SUMSOC.COD_SOC` |`
- L775: `| `postalAddressId` | ObjectId (`addresses`) | Sí | Domicilio postal/correspondencia. | UB | `SUMSOC.COD_CAL/NUMERO/PISO`
- L777: `| `postalCompanyId` | ObjectId (T04 `postalCompanies`) | Según PRM-PER-045 | Empresa postal. Referencia: `postalCarriers`
- L779: `| `districtSectionId` | ObjectId (T04 `districtSections`) | Según PRM-PER-043 | Distrito y sección. Referencia: `cadastr`
- L780: `| `accountingGroupId` | ObjectId [M07] (antes [M15]) | Según PRM-PER-044 | Grupo contable. Referencia: `collectionAccoun`
- L801: `| `countryId`, `provinceId`, `departmentId`, `localityId` | ObjectId (T04) | Sí (país, provincia, localidad) | Contexto `
- _… y 47 líneas más._

### `docs/especificacion/anexos/M02-CAT-catalogo-servicios.md`
- L670: `Convenciones comunes a todas las colecciones (no se repiten): `_id` ObjectId; `tenantId` ObjectId obligatorio (en catálo`
- L702: `| `capabilityId` | ObjectId | Sí | → `serviceCapabilities`. |`
- L710: `| `currentConfigVersionId` | ObjectId | No | Versión publicada vigente. |`
- L721: `| `legalEntityId` | ObjectId | Sí | Entidad jurídica del tenant que presta y factura el servicio (`legalEntities` de T04`
- L725: `| `defaultBillingGroupId` | ObjectId | Sí | ex `GF_DEFECTO`. Referencia: `billingGroups` (M05). |`
- L745: `| `serviceId` | ObjectId | Sí | |`
- L752: `| `simulationRunIds[]` | ObjectId[] | No | Simulaciones TAR. |`
- L756: `| `workflowInstanceId` | ObjectId | No | T11. |`
- L771: `| `authorityIds[]` | ObjectId[] | [VERIFICAR] | — | Autoridad concedente registrada en M01, asumida en PA-CAT-21 (DEC-07`
- L776: `| `serviceIds[]` | ObjectId[] | [VERIFICAR] | — | `tenantServices` (M02) |`
- L785: `| `serviceId` | ObjectId | Sí | |`
- L790: `| `requiresProductIds[]`, `excludesProductIds[]` | ObjectId[] | No | Compatibilidad. Referencia: → `serviceProducts` (M0`
- L791: `| `inventoryItemId` | ObjectId | No | Ítem STK cuando `kind=equipment` (antes `stockItemId`, CTR-DAT-30). |`
- L803: `| `serviceId` | ObjectId | No | Nulo = transversal (capital, tasas, franqueo). |`
- L809: `| `fiscalClassId` | ObjectId | Sí | FIS. Referencia: `fiscalClasses` (M06, PA-FIS-21); antes «clase fiscal de M06» (PA-C`
- L810: `| `accountingRubricId` | ObjectId | No | ex `COD_RUB`. Referencia: `accountRubrics` (M15). |`
- L811: `| `costCenterId` | ObjectId | No | |`
- L812: `| `thirdPartyId` | ObjectId | No | Para tasas. Referencia: tercero beneficiario registrado en M01, asumido en PA-CAT-21 `
- L827: `| `serviceId` | ObjectId | Sí | — | `tenantServices` (M02) |`
- L828: `| `serviceProductId` | ObjectId | Sí | Antes `productId`; nombre de T05 | `serviceProducts` (M02) |`
- L832: `| `currentVersionId` | ObjectId | [VERIFICAR] | — | `servicePlanVersions` (M02) |`
- L840: `| `planId` | ObjectId | Sí | |`
- L844: `| `allowedCategoryIds[]` | ObjectId[] | Sí | |`
- L852: `| `configVersionId` | ObjectId | Sí | |`
- L866: `| `planVersionIds[]` | ObjectId[] | [VERIFICAR] | De servicios distintos | `servicePlanVersions` (M02) |`
- _… y 67 líneas más._

### `docs/especificacion/anexos/M03-MED-medicion-consumos.md`
- L530: `**Campos comunes** a todas las colecciones de negocio (no se repiten): `tenantId` (ObjectId, obligatorio, primer campo d`
- L540: `| `serviceIds` | [ObjectId] | Sí | Servicios a los que aplica (`COD_SER`). Antes `utilityCodes` (nombre de T05). |`
- L551: `| `serviceId` | ObjectId | Sí | Servicio (`COD_SER`). Antes `utilityCode` (nombre de T05). |`
- L552: `| `brandId` | ObjectId → `meterBrands` | No | Marca (`COD_MAR`). |`
- L558: `| `defaultMultiplier` | Decimal128 | Sí | Factor por defecto (> 0). |`
- L563: `| `meteringSystemId` | ObjectId → `meteringSystems` | Cond. | Obligatorio si telemedido o prepago remoto (`SIS_TEL`, `CO`
- L568: `| `inventoryItemId` | ObjectId (M13) | No | Producto de stock asociado (`COD_PRO`). Antes `stockProductRef` (nombre de T`
- L629: `| `meterTypeId` | ObjectId → `meterTypes` | Sí | — |`
- L630: `| `brandId` | ObjectId → `meterBrands` | Sí | — |`
- L634: `| `multiplier` | Decimal128 | Sí | > 0. |`
- L638: `| `bonusUnits` | Decimal128 | No | Unidades bonificadas de la ficha (DFA M5); M04 decide su efecto. |`
- L644: `| `serialUnitId` | ObjectId (M13 `serialUnits`; T05 §7.2) | Cond. | Obligatorio si el servicio registra stock. |`
- L646: `| `currentInstallationId` | ObjectId → `meterInstallations` | No | Derivado. |`
- L649: `| `documents` | [ObjectId] (expediente T11) | No | Fotos, certificados. Referencia: → `documents` (T11). |`
- L660: `| `contractId` | ObjectId (M02 `serviceContracts`; CTR-DAT-71) | Cond. | Obligatorio en `customer` y `distributionParent`
- L661: `| `accountId` | ObjectId (M01) | Cond. | Desnormalizado para búsquedas. |`
- L662: `| `premiseId` | ObjectId (M01) | No | Inmueble. |`
- L665: `| `reading` | {`zone` String, `sector` String, `sequence` Int, `routeIds` [ObjectId]} | Cond. | ZSR (ej. zona 30, sector`
- L670: `| `witnessPointId` | ObjectId → `meteringPoints` | No | Testigo asignado (`SERSOC_EXTRAS.COD_TES`). |`
- L676: `| `servicePointId` | ObjectId | [VERIFICAR] | Punto de prestación (T05 lo declara en claves; la ficha no lo tenía). Refe`
- L684: `| `meteringPointId` | ObjectId | Sí | — |`
- L688: `| `conceptId` | ObjectId (M02 `billableConcepts`; T05 §7.2) | Cond. | `COD_CON`. |`
- L689: `| `contractedValue` | Decimal128 | No | `CONTRATADO` (demanda contratada vigente; la historia está en `demandDeclaration`
- L701: `| `meterId` | ObjectId | Sí | — |`
- L702: `| `meteringPointId` | ObjectId | Sí | — |`
- _… y 83 líneas más._

### `docs/especificacion/anexos/M04-TAR-tarifas-motor-calculo.md`
- L73: `6. **Dinero con `Decimal128` + `decimal.js`**; precios unitarios hasta 6 decimales, cantidades hasta 4, fracciones de pr`
- L659: `- Todo documento lleva `tenantId` (ObjectId, obligatorio), `createdAt`, `createdBy`, `updatedAt`, `updatedBy`; los índic`
- L660: `- Importes y precios en `Decimal128` (lectura/escritura con `decimal.js`); precisión por concepto según PRM-TAR-150 (pre`
- L674: `| `serviceId` | ObjectId | Sí | Servicio de M02. |`
- L683: `| `sourceScheduleId` | ObjectId | No | Versión de la que se copió. Referencia: → `tariffSchedules` (M04). |`
- L685: `| `simulationRunId` | ObjectId | Cond. | Simulación vinculada; obligatoria para pasar a `submitted` según PRM-TAR-005 (P`
- L687: `| `publishedAt`, `publishedBy`, `activatedAt` | datetime/ObjectId | No | Trazas de publicación y activación. |`
- L698: `| `serviceId` | ObjectId | Sí | Servicio M02. |`
- L701: `| `consumptionSourceServiceId` | ObjectId | No | Servicio del que toma consumos (`REL_SER`/`USA_COT`). |`
- L728: `| `scheduleId` | ObjectId | Sí | Versión de cuadro. |`
- L729: `| `categoryId` | ObjectId | Sí | Categoría tarifaria de M02. |`
- L730: `| `fixedCharge` | object | Sí | `amount` (Decimal128), `quantity`, `conceptId`, `currency`, `byDays`. |`
- L732: `| `bonusQuantity` | Decimal128 | No | Unidades bonificadas. |`
- L736: `| `taxRateIds` | ObjectId[] (antes object) | No | Solo alícuotas de IVA de la categoría (cascada RN-TAR-166) → `vatRates`
- L737: `| `taxIds` | ObjectId[] | No | IIBB, percepciones y demás tributos de la categoría (cascada RN-TAR-166) → `taxDefinition`
- L741: `| `forcedVoucherTypeId` | ObjectId | No | Tipo de comprobante forzado por la categoría (RN-TAR-010). Antes `forcedInvoic`
- L751: `| `scheduleId`, `categoryId` | ObjectId | Sí | Pertenencia. |`
- L753: `| `conceptId` | ObjectId | Sí | Concepto facturable (M02). |`
- L755: `| `stepMin`, `stepMax` | Decimal128 | Sí | Escalón `[stepMin, stepMax)`; admite negativos para neto negativo. |`
- L756: `| `price` | Decimal128 | Sí | Precio unitario (6 decimales). |`
- L757: `| `fixedChargeForRange` | Decimal128 | No | Cargo fijo por tramo (tipo 4 / `byTier`). |`
- L758: `| `taxRateIds` | ObjectId[] (antes object) | No | Solo alícuotas de IVA de la fila → `vatRates` (M06). Antes "IVA/IIBB d`
- L759: `| `taxIds` | ObjectId[] | No | IIBB, percepciones y demás tributos de la fila → `taxDefinitions` (M06) (T05 PA-DAT-04, P`
- L776: `| `scheduleId` | ObjectId | [VERIFICAR] | — | `tariffSchedules` (M04; T05 §7.2 admite `scheduleId` dentro de M04) |`
- L777: `| `categoryId` | ObjectId | Sí | — | `serviceCategories` (M02) |`
- _… y 68 líneas más._

### `docs/especificacion/anexos/M05-FAC-facturacion.md`
- L489: `| RN-FAC-049 | El número se asigna dentro de la misma transacción que persiste el comprobante y actualiza el numerador; `
- L632: `| RN-FAC-144 | Importes en `Decimal128` con `decimal.js`; precios unitarios hasta 6 decimales; importes a 2; redondeo ex`
- L645: `**Campos comunes** (no se repiten en cada tabla): `tenantId` (ObjectId, obligatorio, primer campo de todo índice), `crea`
- L655: `| `serviceId` | ObjectId → M02 | Sí | Servicio facturado. |`
- L656: `| `universeId` | ObjectId → `billingUniverses` | Sí | Universo de clientes. |`
- L657: `| `templateId` | ObjectId → `billingTemplates` | Sí | Plantilla de corrida por defecto. |`
- L660: `| `dueDateSchemeId` | ObjectId → `dueDateSchemes` | No | Trama por defecto. |`
- L666: `| `configVersionId` | ObjectId → T04 | Sí | Versión de configuración publicada. |`
- L695: `| `dueDateSchemeId` | ObjectId | No | — |`
- L698: `| `printTemplateId` | ObjectId | No | — Referencia: `invoiceTemplates` (M05) [VERIFICAR]. |`
- L700: `| `previousVersionId` | ObjectId | No | — Referencia: `billingTemplates` (M05). |`
- L716: `| `cycleId` | ObjectId | No | Ciclo origen. |`
- L717: `| `parentRunId` | ObjectId | No | Lote del que reprocesa. Referencia: `billingRuns` (M05). |`
- L718: `| `templateId` / `templateVersion` | ObjectId / Int | Sí | Congelados. Referencia: `templateId` → `billingTemplates` (M0`
- L719: `| `serviceIds` | Array ObjectId | Sí | — |`
- L724: `| `targetAccounts` | Array ObjectId | No | Ex `FACTMES_CTAS`. Referencia: → `accounts` (M01). |`
- L743: `| `jobIds` | Array String | No | Jobs BullMQ. |`
- L754: `| `runId` | ObjectId | Sí | — |`
- L757: `| `accountId`, `holderId`, `associateMembershipId` | ObjectId → M01 / M01 / M17 | Sí / Sí / No | `associateMembershipId``
- L759: `| `billingGroupId` / `groupVersion` | ObjectId / Int | No | Referencia: `billingGroupId` → `billingGroups` (M05); `group`
- L764: `| `exceptionIds` | Array ObjectId | No | — |`
- L768: `| `invoiceIds` | Array ObjectId | No | Comprobantes emitidos. |`
- L772: `| `carriedOverToRunId` | ObjectId | No | — Referencia: `billingRuns` (M05). |`
- L786: `| `runId` | ObjectId | Sí | — | `billingRuns` (M05) |`
- L787: `| `voucherTypeId` | ObjectId | [VERIFICAR] | — | `voucherTypes` (M05) |`
- _… y 98 líneas más._

### `docs/especificacion/anexos/M06-FIS-fiscal-impuestos.md`
- L575: `Todas las colecciones llevan los campos comunes de la guía (`tenantId`, `createdAt`, `updatedAt`, `createdBy`, `updatedB`
- L604: `| `publishedBy` / `publishedAt` | ObjectId / date | No | Publicación |`
- L614: `| `platformVersionId` | ObjectId | Sí | Versión publicada adoptada Referencia: `normativeTableVersions` (M06). |`
- L619: `| `approvedBy` / `approvedAt` | ObjectId / date | No | Responsable fiscal |`
- L620: `| `simulationId` | ObjectId | No | Simulación previa (RF-FIS-009) Referencia: simulación de M04, asumida en PA-FIS-20 (D`
- L628: `| `legalEntityId` | ObjectId → T04 `legalEntities` | Sí | Entidad jurídica emisora (DEC-064): un perfil fiscal vigente p`
- L636: `| `fiscalLogoStoredFileId` | ObjectId → `storedFiles` | No | Logo fiscal (V2 709; T05 §7.2 — antes ~~`fiscalLogoAssetId``
- L639: `| `surveyId` | ObjectId | Sí | Relevamiento fiscal aprobado vigente (RF-FIS-006) |`
- L654: `| `legalEntityId` | ObjectId | Sí | DEC-064 | `legalEntities` (T04) |`
- L664: `| `legalEntityId` | ObjectId → T04 | Sí | Entidad jurídica que es agente (DEC-064) |`
- L682: `| `legalEntityId` | ObjectId → T04 | Sí | Entidad jurídica titular del certificado (DEC-064); `representedCuit` debe ser`
- L687: `| `credentialRef` | ObjectId → `integrationSecrets` (T06) | Sí | Referencia al secreto en la bóveda de T06 (DEC-074; CTR`
- L704: `| `arcaCredentialId` | ObjectId | Sí | Antes `credentialId`; nombre de T05 | `arcaCredentials` (M06) |`
- L708: `| `uniqueId` | ObjectId | [VERIFICAR] | — | no es referencia: `uniqueId` del ticket WSAA |`
- L719: `| `legalEntityId` | ObjectId → T04 | Sí | Entidad jurídica del punto de venta (DEC-064); el mismo número puede existir e`
- L736: `| `legalEntityId` | ObjectId → T04 | Sí | Entidad jurídica emisora, copiada del comprobante (DEC-064); determina CUIT y `
- L737: `| `documentRef` | ObjectId | Sí | Comprobante M05/M07/M11/M18 (o `gatewayDocuments`) Antes `documentId` (nombre de T05).`
- L754: `| `pointOfSaleId` | ObjectId | Sí | Punto de venta (T05); `pointOfSale` conserva el número ARCA. Referencia: `pointsOfSa`
- L776: `| `authorizationIds[]` | ObjectId[] | [VERIFICAR] | — | `fiscalAuthorizations` (M06) |`
- L783: `| `jobId` | ObjectId | [VERIFICAR] | — | `jobRuns` (T01) |`
- L784: `| `correlationId` | ObjectId | [VERIFICAR] | — | no es referencia: id de correlación |`
- L785: `| `legalEntityId` | ObjectId | [VERIFICAR] | DEC-064 | `legalEntities` (T04) |`
- L786: `| `integrationOperationId` | ObjectId | [VERIFICAR] | Operación de integración (T05 lo declara en claves). | `integratio`
- L796: `| `legalEntityId` | ObjectId | Sí | DEC-064 | `legalEntities` (T04) |`
- L815: `| `legalEntityId` | ObjectId | [VERIFICAR] | DEC-064 | `legalEntities` (T04) |`
- _… y 72 líneas más._

### `docs/especificacion/anexos/M07-COB-cuenta-corriente-cobranza.md`
- L446: `| RN-COB-001 | Todo importe es `Decimal128` con aritmética `decimal.js`; importes a 2 decimales, recargos y prorrateos c`
- L665: `- Todo documento lleva `tenantId` (ObjectId, obligatorio), `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `version``
- L666: `- Importes: `Decimal128`; los objetos `money` son `{ amount: Decimal128, currency: 'ARS' }`. Prohibido `Number` para imp`
- L682: `| `holderId` | ObjectId → M01 | Sí | Titular. |`
- L683: `| `legalEntityId` | ObjectId → T04 `legalEntities` | Sí | Entidad jurídica a la que pertenecen todas las obligaciones de`
- L684: `| `accountIds` | [ObjectId] → M01 | Sí | Cuentas (suministros) incluidas. |`
- L685: `| `billingGroupId` | ObjectId → M05 | No | Grupo de facturación (FAC-006) cuando la cuenta es unificada por grupo. |`
- L687: `| `serviceId` | ObjectId → M02 | Cond. | Obligatorio si `mode = separate`. |`
- L688: `| `contractIds` | [ObjectId] | No | Contratos incluidos. |`
- L689: `| `allocationPolicyId` | ObjectId | No | Política propia (excepción). |`
- L701: `| `currentAccountId`, `holderId`, `accountId` | ObjectId | Sí | Cuenta corriente, titular y cuenta M01. |`
- L702: `| `legalEntityId` | ObjectId → T04 | Sí | Entidad jurídica emisora del comprobante de origen; debe coincidir con la de l`
- L703: `| `serviceId`, `contractId` | ObjectId | Sí / No | Servicio y contrato o suministro. |`
- L704: `| `billingGroupId` | ObjectId | No | Grupo de facturación. |`
- L706: `| `sourceDocumentId` | ObjectId | Sí | Documento de M05/M08/M18 o importación. |`
- L717: `| `openAmount` | Decimal128 | Sí | Proyección no editable (RN-COB-002). |`
- L722: `| `directDebitMandateId` | ObjectId | No | Adhesión aplicable. |`
- L723: `| `paymentReferenceIds` | [ObjectId] | No | Identificadores publicados. |`
- L735: `| `currentAccountId`, `holderId`, `serviceId` | ObjectId | Sí | — |`
- L739: `| `obligationId` / `creditBalanceId` / `receiptId` | ObjectId | Cond. | Vínculos. |`
- L743: `| `reversalOf` | ObjectId | No | Movimiento que revierte. |`
- L745: `| `authorizedBy` | ObjectId | Cond. | Ajustes y reversos. |`
- L754: `| `obligationId` | ObjectId | Sí | Obligación cancelada. |`
- L758: `| `amount` | Decimal128 | Sí | — |`
- L759: `| `prevOpenAmount` | Decimal128 | Sí | Saldo previo (`SAL_ACT`). |`
- _… y 199 líneas más._

### `docs/especificacion/anexos/M08-MOR-mora-financiacion.md`
- L682: `Todas las colecciones llevan además los campos comunes obligatorios: `tenantId` (ObjectId, obligatorio), `createdAt`, `u`
- L694: `| `scope.serviceId` | ObjectId [M02] | No | Vacío = todos los servicios. |`
- L695: `| `scope.categoryIds` | [ObjectId] [M02] | No | Vacío = todas las categorías. |`
- L696: `| `scope.voucherTypeIds` | [ObjectId] [M05] | No | Tipos de documento alcanzados (tipo de factura/cuota). |`
- L701: `| `lateInterest.fixedDailyRate` | Decimal128 | Cond. | % diario (método `fixedDaily`). |`
- L702: `| `lateInterest.rateTableId` | ObjectId → `interestRateTables` | Cond. | Método `rateTable`. |`
- L703: `| `lateInterest.indexTableId` | ObjectId → `interestIndexTables` | Cond. | Método `index`. |`
- L708: `| `base.conceptIds` | [ObjectId] [M04] | Cond. | Conceptos que forman la base (CONCEPTOS_INT TIPO > 0). |`
- L709: `| `base.taxIds` | [ObjectId] [M06] | No | Impuestos incluidos en la base por conceptos. |`
- L710: `| `base.excludedTaxIds` | [ObjectId] [M06] | No | V2 #2300. |`
- L717: `| `minimum.amount` | Decimal128 | No | V2 #609. |`
- L719: `| `adminFee.amount` / `adminFee.conceptId` / `adminFee.admissibilityRef` | Decimal128 / ObjectId / String | No | V2 #372`
- L720: `| `rounding` | { mode: `halfUp`/`halfEven`/`down`, decimals: 0–2, step: Decimal128 } | Sí | V2 #608 (paso 0,1). |`
- L722: `| `fiscal.lateInterestConceptId` | ObjectId [M04] | Sí | V2 #606 o por tipo de documento. |`
- L723: `| `fiscal.betweenDueDatesConceptId` | ObjectId [M04] | Sí | V2 #2080. |`
- L724: `| `fiscal.financingModeLateConceptId` | ObjectId [M04] | No | V2 #307. |`
- L725: `| `fiscal.defaultVatSituationId` | ObjectId [M06] | No | V2 #2086. |`
- L730: `| `settlement.forcedDocumentTypeId` | ObjectId [M05] | No | V2 #2249. |`
- L733: `| `reversal.dailyRate` | Decimal128 | No | V2 #3052. |`
- L734: `| `values.dailyRate` / `values.conceptId` | Decimal128 / ObjectId | No | V2 #486/#487. |`
- L737: `| `publishedVersionId` | ObjectId [T04] | No | Versión publicada. |`
- L748: `| `serviceId` | ObjectId [M02] | No | `COD_SER`. |`
- L749: `| `voucherTypeId` | ObjectId [M05] | No | `TIPO` (vacío = todos). |`
- L751: `| `rates[].rateId` | ObjectId | Sí | `COD_MOT`. |`
- L753: `| `rates[].dailyRate` | Decimal128 | Sí | `TASA_CASO` (% diario). |`
- _… y 164 líneas más._

### `docs/especificacion/anexos/M09-CRM-atencion.md`
- L505: `**Campos comunes** (no se repiten en cada tabla): `_id` (ObjectId), `tenantId` (ObjectId, obligatorio, primer campo de t`
- L516: `| `caseTypeId` | ObjectId → `crmCaseTypes` | Sí | Tipo de gestión. |`
- L517: `| `caseSubtypeId` | ObjectId → `crmCaseSubtypes` | No | Subtipo/motivo. |`
- L518: `| `statusSetId` | ObjectId → `crmStatusSets` | Sí | Conjunto de estados vigente al crear. |`
- L529: `| `contactIds` | ObjectId[] → `crmContacts` | No | Contactos adicionales. |`
- L530: `| `areaId` | ObjectId → `crmAreas` | No | Área actual. |`
- L531: `| `assigneeUserId` | ObjectId | No | Responsable actual. |`
- L532: `| `supervisorUserId` | ObjectId | No | Supervisor que derivó. |`
- L544: `| `incidentId` | ObjectId → `crmIncidents` | No | Incidente común vinculado. |`
- L545: `| `projectId` | ObjectId → `crmProjects` | No | Proyecto. |`
- L547: `| `quoteId` | ObjectId (M11) | No | Presupuesto vinculado. |`
- L550: `| `closedAt`, `closedBy` | date, ObjectId | No | Cierre. |`
- L553: `| `mergedIntoCaseId` | ObjectId | No | Caso principal si fue fusionado. |`
- L570: `| `crmCaseId` | ObjectId | Sí | Caso. |`
- L586: `| `channelId` | ObjectId → `crmChannels` | Sí | Canal. |`
- L591: `| `assignedUserId` | ObjectId | No | Agente. |`
- L592: `| `caseIds` | ObjectId[] | No | Casos vinculados. |`
- L594: `| `botSessionId` | ObjectId | No | Sesión del bot. |`
- L604: `| `conversationId` | ObjectId | No | Conversación (null para notas del caso). |`
- L605: `| `crmCaseId` | ObjectId | No | Caso. |`
- L609: `| `authorUserId` | ObjectId | No | Empleado. |`
- L617: `| `workLogId` | ObjectId | No | Registro de tiempo asociado. |`
- L619: `| `aiSuggestionId` | ObjectId | No | Si nació de una sugerencia aceptada. |`
- L627: `| `personId` | ObjectId | No | Persona (null si no identificada). |`
- L628: `| `accountId`, `contractId` | ObjectId | No | Cuenta y servicio. |`
- _… y 121 líneas más._

### `docs/especificacion/anexos/M10-TEC-tecnica-campo-redes.md`
- L214: `| RF-TEC-029 | Numeración interna inmutable (ObjectId) + número de comprobante por talonario/operación + **numeración vi`
- L596: `| RN-TEC-082 | Elementos nuevos reciben ID definitivo y los hijos se reapuntan en la misma transacción. | IDs negativos `
- L634: `**Campos comunes** (no se repiten en cada colección): `tenantId` (ObjectId, obligatorio, primer campo de todo índice com`
- L644: `| `serviceId` | ObjectId → servicio M02 | sí | Servicio solicitado. |`
- L645: `| `operationTypeId` | ObjectId → `workOrderOperationTypes` | sí | Alta, traslado, reconexión, aumento de potencia/plan. `
- L647: `| `personId` / `prospect` | ObjectId → M01 / objeto | sí (uno) | Persona existente (→ M01 `persons`) o datos de prospect`
- L648: `| `accountId` | ObjectId → M01 | no | Cuenta si existe. |`
- L649: `| `crmCaseId` | ObjectId → M09 | no | Caso CRM origen. |`
- L662: `| `technicalResponsibleId` | ObjectId → `fieldResources` | si verdict | Responsable técnico. |`
- L664: `| `inspectionWorkOrderIds` | ObjectId[] | no | OT de inspección. |`
- L666: `| `estimateId` / `quoteRef` | ObjectId / `{ module:'ven', id, status }` | no | Estimación (→ M10 `connectionEstimates`) `
- L668: `| `usedByContractId` | ObjectId | no | Contrato que la consumió (uso único). |`
- L669: `| `closedAt`, `closedBy`, `cancelledAt`, `cancelledBy`, `cancelReason` | Date/ObjectId/string | según estado | `closedBy`
- L678: `| `feasibilityRequestId` | ObjectId | sí | Factibilidad. |`
- L679: `| `templateId` | ObjectId | no | Plantilla aplicada. |`
- L680: `| `lines` | `[{ kind: material\|labor\|networkWork\|other, productId?, description, quantity: Decimal128, unit, laborRol`
- L699: `| `serviceId` | ObjectId | sí | `COD_SER`. |`
- L704: `| `resultingServiceStatusId` | ObjectId → M02 `serviceStatuses` (antes "ObjectId → estado de servicio"; PA-TEC-23) | no `
- L712: `| `defaultWorkTypeId`, `defaultResolutionIds[]`, `requiredTaskIds[]`, `checklistFormIds[]`, `visitTypeId` | ObjectId | n`
- L719: `**`incidentCategories`** (`CAT_INCI`, `CAT_INCI_CTSEC`, `CLAS_INC`): `code`, `name`, `rubric`, `serviceId`, `defaultOper`
- L736: `| `operationTypeId` | ObjectId | sí | `COD_TRAN`. |`
- L737: `| `serviceId` | ObjectId | sí | `COD_SER`. |`
- L738: `| `contractId` / `accountId` / `personId` | ObjectId | si `service`/`claim` | `ID_SERSOC`/`COD_SUM`/`COD_PER`. |`
- L740: `| `crmCaseId` | ObjectId → M09 | si `claim` | Caso del reclamo. |`
- L741: `| `feasibilityRequestId` | ObjectId | no | `COD_FACTIBIL`. |`
- _… y 239 líneas más._

### `docs/especificacion/anexos/M11-VEN-ventas-presupuestos.md`
- L280: `| RN-VEN-046 | Importes en `Decimal128`, precios unitarios hasta 6 decimales, importes a 2, regla de redondeo por concep`
- L290: `Campos comunes a todas las colecciones (no se repiten): `tenantId` (ObjectId, obligatorio), `createdAt`, `updatedAt`, `c`
- L297: `| `accountId`, `holderId`, `contractId` | ObjectId | Sí (contrato salvo concepto `allowWithoutContract`) | Cuenta y titu`
- L298: `| `serviceId` | ObjectId | Sí | Servicio (`tenantServices` de M02; T05 §7.2). Antes `serviceCode` (String), que T05 rese`
- L299: `| `conceptId`, `conceptVersionId` | ObjectId | Sí | Concepto facturable y versión: → M02 `billableConcepts` (la versión `
- L302: `| `sourceType`, `sourceId` | String, ObjectId | Sí | Origen (`crm.request`, `tec.workOrder`, `mor.reconnection`, `manual`
- L305: `| `quantity`, `unitPrice`, `amount` | Decimal128 | Sí | Instantánea de valorización |`
- L307: `| `discountAmount`, `discountReason`, `discountApprovalId` | Decimal128, String, ObjectId | No | Bonificación aprobada. `
- L310: `| `financingPlanId`, `installmentIds[]` | ObjectId | Si `financed` | Plan y cuotas |`
- L335: `| `pointOfSaleId` | ObjectId | Sí | Punto de venta (M05) |`
- L337: `| `contractId`, `serviceCode`, `premiseAddressId` | ObjectId/String | No | Servicio y domicilio de prestación: `contract`
- L338: `| `salesRepId` | ObjectId | Según config | Vendedor |`
- L339: `| `conditionIds[]` | ObjectId | No | Condiciones de venta |`
- L340: `| `currency`, `exchangeRate` | String, Decimal128 | Sí | Moneda y cotización |`
- L343: `| `workOrderId`, `projectId`, `crmCaseId`, `feasibilityId` | ObjectId | No | Vínculos (M10/M09) |`
- L345: `| `fieldBulk`, `fieldBulkCoefficient` | Boolean, Decimal128 | No | Granel (PMOVIL 25/26) |`
- L351: `| `stockReservationIds[]` | ObjectId | No | Reservas en M13 |`
- L368: `| `quoteId`, `quoteVersion` | ObjectId, Number | Sí | Versión exacta: `quoteId` → M11 `salesQuotes`; `quoteVersion` no e`
- L375: `| `signatureFileId` | ObjectId | No | Firma en campo |`
- L384: `| `pointOfSaleId`, `branchId` | ObjectId | Sí | `pointOfSaleId` → `pointsOfSale` (M06); `branchId` → `branches` (T04) |`
- L385: `| `legalEntityId` | ObjectId → `legalEntities` (T04) | Sí | Entidad jurídica que vende; la resuelve T04 (RF-CFG-137) y d`
- L387: `| `accountId`, `holderId`, `personId` | ObjectId | Sí (uno) | Cliente |`
- L388: `| `contractId`, `serviceCode` | ObjectId/String | No | Servicio vinculado |`
- L389: `| `salesRepId` | ObjectId | Según config | |`
- L390: `| `quoteId`, `workOrderId`, `posSessionId`, `importBatchId` | ObjectId | No | Orígenes (`CMPORDE`, `PRESUPU_COMPROBANTES`
- _… y 71 líneas más._

### `docs/especificacion/anexos/M12-CMP-compras-proveedores.md`
- L267: `| RF-CMP-143 | Identificadores internos por documento (ObjectId) y numeración legible por tipo y punto; los ID compuesto`
- L359: `| RN-CMP-068 | Cantidades con la precisión de la unidad de medida; importes Decimal128, precios unitarios hasta 6 decima`
- L360: `| RN-CMP-069 | Identidad interna por ObjectId; numeración legible por tipo y punto; claves ProCoop compuestas solo en `l`
- L370: `Campos comunes (no se repiten): `tenantId`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `version`, `deletedAt` (`
- L379: `| `personId` | ObjectId | Sí | Persona de M01 que tiene el rol de proveedor (DEC-097); se obtiene con el alta asistida d`
- L388: `| `productTypeIds[]` | ObjectId | No | `PROVEED_TIPPROD` |`
- L394: `| `isEmployee`, `employeeId` | Boolean, ObjectId | No | Proveedor-empleado (M16) |`
- L396: `| `accountingAccountId` | ObjectId | Según P3068 | Cuenta del proveedor (M15) |`
- L407: `- `purchaseConcepts`: `{ code, name, printName, unit, accountingCategoryId, vatRateCode, nonTaxed, type, vatType, grossI`
- L420: `| `requesterId`, `recipientId`, `departmentId` | ObjectId | Sí/Según P2705/No | `USU_SOL`, `COD_DES` |`
- L424: `| `estimatedTotal` | Decimal128 | Sí | `ESTIMADO` |`
- L444: `| `blanketOrderId` | ObjectId | Si `release` | OC marco |`
- L445: `| `supplierId` | ObjectId | Sí | `COD_PROV` |`
- L469: `| `supplierId` | ObjectId | Sí | `COD_PROV` |`
- L477: `| `vatTakenPct` | Decimal128 | No | IVA no tomado (P2890) |`
- L481: `| `signalRightsSettlementId` | ObjectId | No | Liquidación de derechos de señales que concilia la factura de la programa`
- L489: `| `balance`, `committedForPayment` | Decimal128 | Sí | `SALDO` |`
- L507: `| `supplierId`, `beneficiaryName` | ObjectId, String | Sí/No | `COD_PROV`; P1029 |`
- L508: `| `legalEntityId` | ObjectId | Sí | Entidad jurídica pagadora, la de las facturas aplicadas (DEC-064; clave de T05; PA-C`
- L516: `| `supplierBankAccountId` | ObjectId | No | CBU aprobado preferido |`
- L580: `| `accountingCategoryId` | ObjectId | [VERIFICAR] | — | `serviceCategories` (M02) |`
- L587: `| `vatRateId` | ObjectId | [VERIFICAR] | Declarado en T05; no figuraba en la lista del anexo. | `vatRates` (M06); antes `
- L607: `| `supplierId` | ObjectId | [VERIFICAR] | — | `suppliers` (M12) |`
- L608: `| `userId` | ObjectId | [VERIFICAR] | — | `memberships` (T02) |`
- L623: `| `templateId` | ObjectId | [VERIFICAR] | — | `messageTemplates` (T09) (antes `[VERIFICAR]`) |`
- _… y 66 líneas más._

### `docs/especificacion/anexos/M13-STK-stock-activos-fabricacion.md`
- L446: `**Campos comunes a todas las colecciones** (no se repiten abajo): `tenantId` (ObjectId, obligatorio, primer campo de tod`
- L469: `| `parentId` | ObjectId | — | Clasificación padre. |`
- L470: `| `path` | [ObjectId] | O | Ancestros (materializado). |`
- L471: `| `laborCoefficient` | Decimal128 | — | Coeficiente de mano de obra para costo fijo de fabricación (RN-08 §15.3 `Get_Cos`
- L481: `| `parentId`, `level`, `path` | ObjectId, int, [ObjectId] | — / O / O | Jerarquía (`COD_PAD`, `NIVEL`). |`
- L484: `| `defaultUsefulLifeYears` | Decimal128 | — | `VIDA_UTIL`. |`
- L502: `| `itemTypeId`, `classificationId`, `itemGroupId`, `departmentId` | ObjectId | O / — / O / — | Clasificaciones. |`
- L507: `| `packSize` | Decimal128 | — | Bulto de reposición (`BULTOS`). |`
- L510: `| `catalogProductId` | ObjectId | — | Producto comercial de M02. |`
- L511: `| `serviceIds`, `defaultServiceId` | [ObjectId], ObjectId | — | Stock por servicio (OPE-002). |`
- L516: `| `costing` | object | O | `replacementCost` (Decimal128), `standardCost`, `previousReplacementCost`, `costUpdatedAt`, ``
- L526: ``kitItemId` (O), `components` [{`itemId` O, `quantity` Decimal128 O}]. Índice `{tenantId, kitItemId}` único.`
- L534: `| `branchId` | ObjectId | — | Sucursal (T04). |`
- L536: `| `crewId`, `employeeId`, `vehicleId`, `supplierId` | ObjectId | C | Custodio según tipo. |`
- L537: `| `custodianUserId` | ObjectId | C | Responsable actual de custodia (cuadrilla/técnico). |`
- L538: `| `serviceIds` | [ObjectId] | — | Servicios asociados. |`
- L551: ``itemId` (O), `locationId` (O), `capacity` (Decimal128, `CAPACIDAD`). Índice `{tenantId, itemId, locationId}` único.`
- L561: `| `sourceWarehouseId`, `targetWarehouseId` | ObjectId | C | Según tipo. |`
- L581: `| `stockDocumentId`, `lineId` | ObjectId, string | O | Antes `documentId`. Documento y renglón (nombre de T05; PA-STK-11`
- L586: `| `inventoryItemId`, `warehouseId` | ObjectId | O | Antes `itemId`. Nombre de T05 (PA-STK-11). |`
- L587: `| `locationId`, `lotId`, `serialUnitId` | ObjectId | C | |`
- L588: `| `contractId` | ObjectId | C | Obligatorio en `customerPremisesPool` (`COD_SUM`). |`
- L590: `| `quantity` | Decimal128 | O | Siempre positiva (RN-STK-003). |`
- L591: `| `unitCost`, `amount` | Decimal128 | O | Costo según método; `amount` = cantidad × costo (o valor en `kind = value`). |`
- L593: `| `destination`, `serviceId`, `costCenterId`, `projectId`, `expenseUnitId` | object/ObjectId | C | Dimensiones analítica`
- _… y 154 líneas más._

### `docs/especificacion/anexos/M14-TES-tesoreria-bancos.md`
- L531: `Convenciones comunes (guía §5), no repetidas en cada colección: todo documento lleva `tenantId` (ObjectId, obligatorio, `
- L553: `| `institutionId` | ObjectId → `financialInstitutions` | Sí | — | `financialInstitutions` (M14) |`
- L569: `| `institutionId`, `bankBranchId` | ObjectId | Cond. | Obligatorios en cuentas bancarias; `bankBranchId` → `bankBranches`
- L574: `| `openingDate`, `openingBalance` | date, Decimal128 | Sí | Generan el movimiento de apertura. | — |`
- L576: `| `branchId` | ObjectId → `branches` (T04, sucursal del tenant) | No | Antes `branchOfficeId` (nombre canónico de T05 §7`
- L577: `| `legalEntityId` | ObjectId → `legalEntities` (T04) | Sí | Entidad jurídica titular de la cuenta (DEC-064). Una cuenta `
- L582: `| `bankAsSupplierId` | ObjectId → `suppliers` (M12) | No | `COD_PROV`. | `suppliers` (M12) |`
- L586: `| `minBalanceAlert` | Decimal128 | No | RF-TES-153. | — |`
- L596: `| `treasuryAccountId` | ObjectId | Sí | Antes `accountId` (nombre de T05). | `treasuryAccounts` (M14) |`
- L597: `| `userId` | ObjectId (T02) | Sí | — | `memberships` (T02) |`
- L598: `| `employeeId` | ObjectId (M16) | No | `COD_EMP`. | `employees` (M16) |`
- L599: `| `personId` | ObjectId | Sí | Persona firmante; clave de unicidad `{treasuryAccountId, personId, validFrom}` de T05 (PA`
- L600: `| `legalEntityId` | ObjectId | Sí | Entidad jurídica de la cuenta (copia de `treasuryAccounts.legalEntityId`, DEC-064; P`
- L602: `| `maxAmountPerSignature` | Decimal128 | No | Tope. | — |`
- L667: `| `institutionId` | ObjectId | Sí | — | `financialInstitutions` (M14) |`
- L668: `| `bankBranchId` | ObjectId | Sí | — | `bankBranches` (M14) |`
- L675: `| `blockedBy` | ObjectId | Cond. | — | `memberships` (T02) |`
- L684: `| `branchId` | ObjectId | Sí | — | `branches` (T04) |`
- L685: `| `legalEntityId` | ObjectId | Sí | Entidad jurídica de la operación, la de sus cuentas (DEC-064; clave de T05; PA-TES-1`
- L686: `| `conceptId` | ObjectId | No | — | `billableConcepts` (M02) |`
- L689: `| `totals` | `{ in, out, difference }` Decimal128 | Sí | `difference` = 0 salvo tipos unilaterales. | — |`
- L743: `| `operationId` | ObjectId | Sí | — | `operations` (T11) |`
- L744: `| `treasuryAccountId` | ObjectId | Sí | Antes `accountId` (nombre de T05). | `treasuryAccounts` (M14) |`
- L745: `| `legalEntityId` | ObjectId → `legalEntities` (T04) | Sí | Copia de la entidad de la cuenta (DEC-064); una operación en`
- L748: `| `categoryId` | ObjectId | Sí | — | `serviceCategories` (M02) |`
- _… y 139 líneas más._

### `docs/especificacion/anexos/M15-CON-contabilidad.md`
- L568: `Convenciones comunes a todas las colecciones (Guía §5): `tenantId` (ObjectId, obligatorio), `createdAt`, `updatedAt`, `c`
- L572: `**Entidad jurídica (DEC-064, DEC-087):** la contabilidad se lleva por entidad jurídica del tenant (`legalEntities` de T0`
- L586: `| `rounding` | `{ toleranceAbs: Decimal128, tolerancePct: Decimal128 }` | Sí | PRM-CON-008/009. | — |`
- L594: `| `manualEntryApproval` | `{ thresholdAmount: Decimal128, types: [String] }` | No | PRM-CON-010. | — |`
- L603: `| `suspenseTolerance` | Decimal128 | Sí | PRM-CON-018 (RN-CON-114). | — |`
- L605: `| `configVersionId` | ObjectId | Sí | Versión T04 publicada. | `configVersions` (T04) |`
- L617: `| `legalEntityId` | ObjectId → T04 | Sí | Entidad dueña del plan (RF-CFG-136 de T04; DEC-064). | `legalEntities` (T04) |`
- L618: `| `sharedWithLegalEntityIds` | [ObjectId → T04] | No | Otras entidades del tenant que usan este plan; vacío = solo la du`
- L622: `| `copiedFromChartId` | ObjectId | No | Origen de la copia. | `chartOfAccounts` (M15) |`
- L626: `| `scenarioId` | ObjectId | No | Si `purpose = simulation`. | `simulationScenarios` (M15) |`
- L627: `| `approvedBy` / `approvedAt` | ObjectId / Date | No | — | `memberships` (T02) |`
- L637: `| `chartId` | ObjectId | Sí | — | `chartOfAccounts` (M15) |`
- L639: `| `parentRubricId` | ObjectId | No | Para subrubros. | `accountRubrics` (M15) |`
- L654: `| `chartId` | ObjectId | Sí | Identidad incluye el plan (RN-CON-089). | `chartOfAccounts` (M15) |`
- L658: `| `parentId` | ObjectId | No | Árbol. | `ledgerAccounts` (M15) |`
- L659: `| `path` | [ObjectId] | Sí | Ancestros (consultas por rama). | `ledgerAccounts` (M15) |`
- L664: `| `rubricId` / `subrubricId` | ObjectId | No / No | RF-CON-013. | `accountRubrics` (M15) |`
- L669: `| `allowedCostCenterIds` | [ObjectId] | No | `CTSECC_X_CTA`; vacío = todos. | `costCenters` (M15) |`
- L676: `| `inaesCategoryId` | ObjectId | No | Catálogo de M17. | `inaesCategories` (M17) |`
- L677: `| `mergedIntoAccountId` | ObjectId | No | Unificación (RF-CON-021). | `ledgerAccounts` (M15) |`
- L690: `| `chartId` | ObjectId | Sí | — | `chartOfAccounts` (M15) |`
- L692: `| `ledgerAccountId` | ObjectId | No | Vacío = sin asignar (aparece en validador). | `ledgerAccounts` (M15) |`
- L693: `| `costCenterModelId` | ObjectId | No | Modelo de centro de costo por defecto del rol (PA-CON-18). | `costCenterModels` `
- L707: `| `chartId` | ObjectId | Sí | — | `chartOfAccounts` (M15) |`
- L713: `| `ledgerAccountId` | ObjectId | Sí | Destino. | `ledgerAccounts` (M15) |`
- _… y 93 líneas más._

### `docs/especificacion/anexos/M16-SUE-personal-sueldos.md`
- L537: `**Campos comunes** (no se repiten en cada tabla): `_id` ObjectId, `tenantId` ObjectId obligatorio, `createdAt`, `updated`
- L552: `| `personId` | ObjectId | No | Persona jurídica en M01, si existe. | `persons` (M01) |`
- L561: `| `payslipVoucherTypeId`, `payslipNumbering` | ObjectId / `{ prefix, next }` | Sí | Comprobante y numeración de recibos `
- L575: `| `personId` | ObjectId | Sí | Persona M01 (nombre, documento, CUIL, nacimiento, sexo, nacionalidad, estado civil, domic`
- L576: `| `legalEntityId` | ObjectId → `legalEntities` (T04) | Sí | Empresa empleadora: entidad jurídica con subdocumento `emplo`
- L583: `| `terminationDate`, `terminationId` | date / ObjectId | No | Egreso. | `terminations` (M16) |`
- L585: `| `current` | objeto | Sí | Proyección de la asignación vigente (§7.3): `laborAgreementId`, `unionId`, `unionMember`, `c`
- L590: `| `userAccountId` | ObjectId | No | Cuenta T02 vinculada al perfil empleado. | `memberships` (T02) |`
- L603: `| `employeeId` | ObjectId | Sí | Sí. | `employees` (M16) |`
- L608: `| `previousCategoryId` | ObjectId | [VERIFICAR] | — | `serviceCategories` (M02) |`
- L609: `| `approvalId` | ObjectId | [VERIFICAR] | T11. | `approvalRequests` (T11) |`
- L614: `Origen: `SU_EMPLEADOS_SEC`. Campos: `employeeId`, `validFrom`, `validTo`, `allocations[]` `{ costCenterId (M15), service`
- L620: `| `employeeId` | ObjectId | Sí | — | `employees` (M16) |`
- L623: `| `allocations` | [Object] | No | `{ costCenterId (M15), serviceId (M02, opcional), percent Decimal128 }` (suma 100). | `
- L624: `| `costCenterId` | ObjectId | — | Clave de T05: es `allocations[].costCenterId`, no un campo de primer nivel (PA-SUE-18)`
- L635: `| `employeeId` | ObjectId | Sí | Sí. | `employees` (M16) |`
- L636: `| `personId` | ObjectId | Sí | Sí, M01. | `persons` (M01) |`
- L646: `Origen: `SU_EMP_CBU`. Campos: `employeeId`, `bankCode`, `branchCode`, `accountType` (`savings`, `checking`, `cvu`), `acc`
- L652: `| `employeeId` | ObjectId | Sí | — | `employees` (M16) |`
- L662: `| `splitPercent` | Decimal128 | [VERIFICAR] | O `splitAmount`. | — |`
- L677: `| `employeeId` | ObjectId | Sí | — | `employees` (M16) |`
- L679: `| `fileRefs` | [ObjectId] | [VERIFICAR] | Almacenamiento privado. | `storedFiles` (T01) |`
- L680: `| `documentRefId` | ObjectId | [VERIFICAR] | Expediente del documento en T11 (clave de T05; PA-SUE-18). | `documents` (T`
- L681: `| `uploadedBy` | ObjectId | Cond. | `employee` \| `staff`. | `memberships` (T02) |`
- L685: `| `reviewedBy` | ObjectId | Cond. | — | `memberships` (T02) |`
- _… y 172 líneas más._

### `docs/especificacion/anexos/M17-INS-institucional.md`
- L354: `| RN-INS-052 | Importes con `Decimal128`; capital en ARS salvo configuración. | — | **Adoptar** (convenciones). | — | — `
- L360: `Todas las colecciones llevan además `tenantId` (ObjectId, obligatorio, primer campo de todo índice compuesto), `createdA`
- L370: `| `personId` | ObjectId → M01 `persons` | Sí | Persona física o jurídica. | `persons` (M01) |`
- L371: `| `legalEntityId` | ObjectId | Sí | Entidad jurídica con la que existe la relación institucional (cooperativa, mutual u `
- L378: `| `admissionMinuteId` / `admissionResolutionId` | ObjectId | Cond. | Acta y resolución que aprobaron (CAT `SOCIOS.ACTA`)`
- L382: `| `exitMinuteId` | ObjectId | Cond. | Acta que resolvió el egreso. | `minutes` (M17) |`
- L384: `| `reentryOfAssociateMembershipId` | ObjectId | No | Membresía anterior en reingresos. Antes `reentryOfMembershipId` (PA`
- L385: `| `inaesCategoryId` | ObjectId → `inaesCategories` | No | Categoría INAES. | `inaesCategories` (M17) |`
- L386: `| `electoralDistrictId` | ObjectId → `electoralDistricts` | No | Distrito electoral. | `electoralDistricts` (M17) |`
- L390: `| `capitalSummary` | { `subscribed`, `billed`, `committed`, `paid`, `reserved`, `refunded`, `pending`, `overdue`, `asOf``
- L402: `| `associateMembershipId` | ObjectId | Sí | Antes `membershipId` (PA-INS-12). | `associateMemberships` (M17) |`
- L406: `| `actorUserId` | ObjectId | Sí | — | `memberships` (T02) |`
- L408: `| `minuteId`, `resolutionId`, `documentIds` | ObjectId / [ObjectId] | No | Evidencia (T11). | `minutes` (M17) / `resolut`
- L421: `Campos: `code`, `name`, `assignmentRule` { `type`: `zone`/`locality`/`manual`, `refIds`: [ObjectId] }, `delegateSeats` {`
- L429: `| `assignmentRule` | Object | [VERIFICAR] | Subcampos: `type`: `zone`/`locality`/`manual`, `refIds`: [ObjectId]. | — |`
- L439: `| `ledgerAccountId` | ObjectId → M15 | — | **Reemplazado** (CTR-DAT-57 de T05): el rubro no guarda la cuenta; `COD_CTA` `
- L440: `| `productGroupIds` | [ObjectId] → M02 rubros | No | `COD_RUB`; cada rubro de producto aparece en un solo `capitalItem` `
- L450: `| `legalEntityId` | ObjectId | Sí | Entidad cuyo capital regula la regla (DEC-096). | `legalEntities` (T04) |`
- L452: `| `serviceId`, `categoryId`, `conceptIds` | ObjectId / [ObjectId] → M02 | Cond. | Alcance (por producto o por servicio, `
- L454: `| `amount` | Decimal128 | Cond. | Alternativa a `shares` (`SERSOC.IMP_CAPITAL`). | — |`
- L456: `| `capitalItemId` | ObjectId | Sí | Rubro. | `capitalItems` (M17) |`
- L463: `Campos: `nominalValue` (Decimal128), `currency`, `validFrom`, `validTo`, `resolutionId`. Índice `{tenantId, validFrom}`.`
- L469: `| `legalEntityId` | ObjectId | Sí | Entidad a la que corresponde el valor nominal; índice `{tenantId, legalEntityId, val`
- L470: `| `nominalValue` | Decimal128 | [VERIFICAR] | — | — |`
- L474: `| `resolutionId` | ObjectId | Sí | — | `resolutions` (M17) |`
- _… y 133 líneas más._

### `docs/especificacion/anexos/M18-SOC-servicios-sociales-flota.md`
- L356: `| RF-SOC-145 | **Importes** en `Decimal128` y ARS salvo configuración. | Convenciones | Núcleo | O4 | Adoptado | Todos l`
- L421: `Todas las colecciones llevan `tenantId` (primer campo de todo índice compuesto), `createdAt`, `updatedAt`, `createdBy`, `
- L431: `| `contractId` | ObjectId → M02 | Sí | Contrato del servicio (`ID_SERSOC`, `COD_SUM`, `COD_SER`). Dueño M02 (HUECO-TRV-0`
- L432: `| `holderId` | ObjectId → M01 `holders` | Sí | Titular del contrato (`COD_SOC`). Nombre canónico de T05 (CTR-DAT-67; ant`
- L433: `| `personId` | ObjectId → M01 | Sí | Adherente (`COD_PER`). | `persons` (M01) |`
- L434: `| `relationshipTypeId` | ObjectId → M01 | Sí | Vínculo (`COD_VIN` → `VINCULOS`). | `enumerationItems` (T04) (vínculos, C`
- L436: `| `coveragePlanId` | ObjectId | Sí | Plan vigente. | `coveragePlans` (M18) |`
- L437: `| `categoryId` | ObjectId → M02 | No | Categoría (recategorización). | `serviceCategories` (M02) |`
- L438: `| `assignedTariffId` | ObjectId → M04 | No | Tarifa asignada (`COD_TAD`). | `tariffCategoryRates` (M04) (tarifa por cate`
- L460: `| `contractId` | ObjectId | Sí | `ID_SERSOC`. | `serviceContracts` (M02) |`
- L461: `| `holderId` | ObjectId | [VERIFICAR] | CTR-DAT-67; antes `holderPersonId`. | `holders` (M01) |`
- L462: `| `personId` | ObjectId | [VERIFICAR] | — | `persons` (M01) |`
- L463: `| `relationshipTypeId` | ObjectId | [VERIFICAR] | `COD_VIN`. | `enumerationItems` (T04) (vínculos `VINCULOS`, CTR-DAT-12`
- L465: `| `sharePct` | Decimal128 | [VERIFICAR] | — | — |`
- L482: `| `dependentId` | ObjectId | Sí | — | `serviceDependents` (M18) |`
- L483: `| `beneficiaryId` | ObjectId | [VERIFICAR] | — | `serviceBeneficiaries` (M18) |`
- L487: `| `actorUserId` | ObjectId | [VERIFICAR] | — | `memberships` (T02) |`
- L489: `| `batchId` | ObjectId | [VERIFICAR] | Lote de la operación masiva que generó el evento. | — (identificador del lote que`
- L498: `| `serviceId` / `categoryId` | ObjectId → M02 | Sí | Servicio y categoría. | `tenantServices` (M02) / `serviceCategories`
- L505: `| `territorialScope` | [ObjectId] localidades/provincias | No | — | — |`
- L508: `| `agreementIds` | [ObjectId] | No | Convenios. | `agreements` (M08) |`
- L509: `| `regulationDocumentId` | ObjectId | No | Reglamento. | `documents` (T11) |`
- L525: `| `supplierId` | ObjectId | Sí | M12. | `suppliers` (M12) |`
- L528: `| `localityId` | ObjectId | Sí | — | `localities` (T04) |`
- L539: `| `providerId` | ObjectId | Sí | — | `careProviders` (M18) |`
- _… y 208 líneas más._

### `docs/especificacion/anexos/M19-POR-portal-socio-landing.md`
- L500: `Convenciones: todo documento lleva `tenantId` (ObjectId, obligatorio), `createdAt`, `updatedAt`, `createdBy`, `updatedBy`
- L510: `| `tenantId` | ObjectId | Sí |  | `tenants` (T01) |`
- L515: `| `publishedVersionId` | ObjectId | No | Versión publicada vigente | `landingPageVersions` (M19) |`
- L516: `| `draftVersionId` | ObjectId | No | Versión en edición | `landingPageVersions` (M19) |`
- L520: `| `tenantBrandingId` | ObjectId | [VERIFICAR] | Marca del tenant que usa la landing; T05 (COL-POR-01) la declara y este `
- L530: `| `landingPageId` | ObjectId | Sí |  | `landingPages` (M19) |`
- L536: `| `publishedAt` / `publishedBy` | Date / ObjectId | No |  | `memberships` (T02) (solo `publishedBy`) |`
- L538: `| `previousVersionId` | ObjectId | No | Para revertir | `landingPageVersions` (M19) |`
- L548: `| `userId` | ObjectId | Sí | Usuario T02 | `memberships` (T02) |`
- L549: `| `personId` | ObjectId | Sí | Persona M01 del usuario en este tenant | `persons` (M01) |`
- L550: `| `accountId` | ObjectId | Sí | Cuenta M01 | `accounts` (M01) |`
- L551: `| `contractIds` | [ObjectId] | No | Si el acceso se limita a contratos concretos (vacío = todos los de la cuenta) | `ser`
- L556: `| `grantedByUserId` | ObjectId | No | Titular que invitó | `memberships` (T02) |`
- L560: `| `revokedBy` | ObjectId | No | Usuario que revocó | `memberships` (T02) |`
- L574: `| `userId` | ObjectId | Sí |  | `memberships` (T02) |`
- L578: `| `accountId` | ObjectId | No | Solo si `exito` | `accounts` (M01) |`
- L590: `| `accountId` | ObjectId | Sí |  | `accounts` (M01) |`
- L591: `| `contractIds` | [ObjectId] | No |  | `serviceContracts` (M02) |`
- L592: `| `grantorUserId` | ObjectId | Sí | Titular | `memberships` (T02) |`
- L594: `| `inviteeUserId` | ObjectId | No | Al aceptar | `memberships` (T02) |`
- L599: `| `accessId` | ObjectId | No | Acceso creado al aceptar | `portalAccountAccess` (M19) |`
- L611: `| `serviceId` | ObjectId | No | Servicio M02 (vacío = general). Antes `serviceCode` (String; nombre de T05, COL-POR-06) `
- L619: `| `pdfStoredFileId` | ObjectId | No | `PDFFILE` (antes `pdfFileId`, CTR-DAT-30) | `storedFiles` (T01) |`
- L630: `| `formVersionId` | ObjectId | Sí (al publicar) | Versión publicada vigente del formulario en `formVersions` de T11 (PA-`
- L642: `| `formId` / `formVersion` | ObjectId / Int | Sí | Versión usada (inmutable) | `portalForms` (M19) (solo `formId`) |`
- _… y 23 líneas más._

### `docs/especificacion/anexos/T01-PLA-plataforma-saas.md`
- L8: `| Olas | **O0** (fundaciones técnicas: monorepo, Docker, CI, packages, plugin de tenancy, outbox + BullMQ, almacenamient`
- L54: `- Implementa el **mecanismo de multitenancy** (contexto de tenant, plugin Mongoose, índices, aislamiento en jobs/archivo`
- L178: `| RF-PLA-002 | Stack: Node.js 20 ESM, Express 4, MongoDB 7 en replica set, Mongoose 8, Vue 3.5 + Vite + Pinia + Vue Rout`
- L182: `| RF-PLA-006 | Convención interna de cada módulo (maestro §5.2 ampliado): `index.js` (API pública), `manifest.js`, `mode`
- L185: `| RF-PLA-009 | **Outbox de eventos**: todo evento de dominio se graba en `outboxEvents` en la misma transacción; un rela`
- L186: `| RF-PLA-010 | **Workers BullMQ/Redis** separados del proceso API, escalables horizontalmente, con colas por clase de ca`
- L198: `| RF-PLA-017 | **Una única base de datos** compartida; todo documento de negocio lleva `tenantId` (ObjectId) obligatorio`
- L201: `| RF-PLA-020 | **Plugin Mongoose de tenancy**: inyecta el filtro `tenantId` del contexto en `find*`, `count*`, `update*``
- L216: `| RF-PLA-035 | Lectura analítica (BI, exportaciones grandes) contra nodo secundario con etiqueta `analytics` del replica`
- L353: `| RF-PLA-127 | Claves de cifrado (KMS) y bóveda de secretos con su propio respaldo y procedimiento de recuperación; la b`
- L366: `| RF-PLA-135 | Prioridad de colas: operaciones de cobro/caja e integraciones de pago > emisión fiscal > notificaciones >`
- L514: `| Base de datos | MongoDB **replica set** (también en local, nodo único) | 7.x | DEC-001; transacciones multi-documento `
- L515: `| ODM | Mongoose | ^8.9 | CNX [COPIAR] + plugins de tenancy, auditoría, versión, borrado lógico |`
- L517: `| Colas | BullMQ + Redis | BullMQ 5 / Redis 7 | CNX §2.6 [MEJORAR] (Redis ya estaba en dependencias sin uso) |`
- L529: `| Referencia nube | AWS: ECS Fargate (o EKS), MongoDB Atlas sobre AWS o replica set autogestionado, ElastiCache Redis, S`
- L569: `│  │     │  ├─ tenancy/          # plugin Mongoose, runAsPlatform, lista blanca de colecciones globales, check de índice`
- L607: `│  │     ├─ scheduler.js         # job schedulers de BullMQ declarados en manifiestos (una sola instancia líder)`
- L621: `│  │  ├─ money/                   # decimal.js, redondeo por concepto, Decimal128 <-> Decimal`
- L734: `### 7.6. Outbox, eventos y workers BullMQ`
- L740: `3. Por cada suscriptor registrado para el `type`, encola en la cola `events` un job con `jobId = <eventId>:<consumer>` (`
- L756: `| — (sin cola; excepción explícita) | JOB-PLA-01 `pla:outbox-relay`: proceso dedicado del worker que lee `outboxEvents` `
- L758: `**Excepción a las clases de cola:** JOB-PLA-01 `pla:outbox-relay` no corre en ninguna cola de BullMQ. Es un proceso dedi`
- L782: `| Mongoose | Plugin de tenancy (RF-PLA-020). | Consulta sin contexto → error. |`
- L867: `| `saasContractId` | ObjectId → `saasContracts` | Desde Listo para habilitar | Contrato vigente. |`
- L870: `| `brandingRef` | ObjectId → `tenantBrandings` (T03) | No | Referencia a T03 (nombre de la colección corregido por CTR-D`
- _… y 43 líneas más._

### `docs/especificacion/anexos/T02-IAM-identidad-roles-auditoria.md`
- L3126: `Convenciones: todo documento lleva `tenantId`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `version` salvo indic`
- L3134: `| `tenantId` | ObjectId | Sí | Siempre `PLATFORM` |`
- L3151: `| `mfa` | `{ enrolled: bool, defaultFactorId: ObjectId }` | Sí | `defaultFactorId` → `authFactors` |`
- L3161: `| `identityId` | ObjectId | Sí | |`
- L3177: `| `identityId` | ObjectId | Sí | |`
- L3181: `| `scopeTenantId` | ObjectId | No | Obligatorio para `oidcTenant` y `cidi`; nulo para `google` |`
- L3182: `| `idpConfigId` | ObjectId | No | Para `oidcTenant`/`cidi`; → `identityProviderConfigs` |`
- L3196: `| `tenantId` | ObjectId | Sí | Tenant de la pertenencia (o `PLATFORM`) |`
- L3197: `| `identityId` | ObjectId | Sí | |`
- L3217: `| `tenantId` | ObjectId | Sí | `PLATFORM` para plantillas y roles de plataforma |`
- L3248: `| `tenantId`, `membershipId`, `roleId` | ObjectId | Sí | |`
- L3249: `| `scope` | subdoc | Sí | `mode` (`tenant`, `restricted`, `own`), `legalEntities[]` (ObjectId → `legalEntities` de T04; `
- L3250: `| `limits` | `[{ capability, maxAmount: Decimal128, currency }]` | No | |`
- L3255: `| `sodExceptionId` | ObjectId | No | |`
- L3280: `| `tenantId` | ObjectId | Sí | Tenant del ámbito |`
- L3281: `| `identityId`, `membershipId` | ObjectId | Sí | |`
- L3292: `| `supportGrantId` | ObjectId | No | Sesiones de soporte; → `supportAccessGrants` |`
- L3311: `| `tenantId` | ObjectId | Sí | |`
- L3319: `| `amount` | Decimal128 | No | |`
- L3321: `| `requestedBy` | ObjectId (membership) | Sí | |`
- L3351: `| `tenantId` | ObjectId | Sí | `PLATFORM` para cambios globales |`
- L3358: `| `legalEntityId` | ObjectId → `legalEntities` (T04) | Si el objeto lo tiene | Entidad jurídica del objeto auditado, cop`
- L3363: `| `authorizationRequestId` | ObjectId | No | |`
- L3385: ``tenantId`, `eventId`, `occurredAt`, `actor` (usuario o S-BOT), `function` (`crmClassify`, `crmReplySuggest`, `moderatio`
- L3430: `| `membershipId` | ObjectId | No | `memberships` (T02) | destino → `memberships` |`
- _… y 29 líneas más._

### `docs/especificacion/anexos/T03-UXD-experiencia-marca-diccionario.md`
- L602: `Campos comunes de todo documento de negocio (guía §5): `tenantId` (ObjectId, obligatorio), `createdAt`, `updatedAt`, `cr`
- L630: `| `publishedAt`, `publishedBy` | Date, ObjectId | Si publicada | — |`
- L642: `| `branchId` | ObjectId | No | Sucursal (logos jerárquicos) |`
- L721: `| `draftOf` | ObjectId | No | Entrada publicada a la que reemplaza; → `tenantDictionaryEntries` |`
- L738: `| `publishedBy` | ObjectId | Sí | Quien publicó; → `memberships` |`
- L770: `| `userId` | ObjectId | Único por tenant + usuario |`
- L836: `| `ownerId` | ObjectId | Sí | `memberships` (T02) | destino → `memberships` |`
- L852: `| `screenProfileId` | ObjectId | Sí | `screenProfiles` (T02) | destino → `screenProfiles` |`

### `docs/especificacion/anexos/T04-CFG-configuracion-parametros-maestros.md`
- L285: `| RF-CFG-092 | Valores con `Decimal128`, período o fecha, `publishedAt`, `recordedAt`, estado (`provisional`, `definitiv`
- L384: `| RF-CFG-136 | **`legalEntityId` obligatorio** en el esquema base de los documentos económicos (paquete compartido de es`
- L432: `| RN-CFG-036 | Importes de índices y cotizaciones en `Decimal128`; prohibido `Number`. | — | Adoptar (Guía §5). | — | — `
- L455: `Convenciones comunes (Guía §5): todo documento lleva `tenantId` (ObjectId; las tablas de plataforma usan el tenant espec`
- L463: `| `tenantId` | ObjectId | Sí | Siempre `PLATFORM`. |`
- L500: `| `tenantId` | ObjectId | Sí | Tenant o `PLATFORM` (defaults de plataforma). |`
- L502: `| `scope` | Object | Sí | `{ type: platform|tenant|legalEntity|branch|service|category|user, refId: ObjectId|null }`. Co`
- L503: `| `value` | Mixed | Sí | Validado contra la definición; importes como `Decimal128`; `secretRef` como `{ vaultId, secretN`
- L508: `| `configVersionId` | ObjectId | Sí | Versión que lo publicó. |`
- L535: `| `workflowInstanceId` | ObjectId | No | Revisión en T11. |`
- L537: `| `publishedAt`, `publishedBy` | Date/ObjectId | No | — |`
- L611: `| `economicIndexValues` | `seriesId` (antes `seriesCode`; nombre de T05 COL-CFG-22), `date` o `period` (`YYYY-MM`), `tim`
- L621: `| `vatRates` | `code`, `percent` (Decimal128), `arcaId`, `validFrom`, `validTo`, `sourceRef`; atributos tenant (M15): `s`
- L626: `| `taxRegistryEntries` | `registryCode`, `cuit`, `regime`, `rate` (Decimal128), `group`, `publishedAt`, `validFrom`, `va`
- L652: `**Reemplazado por `dataTableViews` de T03 (CTR-DAT-11).** `savedViews`: `screenKey`, `ownerUserId` (null si compartida),`
- L727: `| `legalEntityId` | ObjectId → `legalEntities` | Sí | Entidad jurídica de la sucursal (RN-CFG-054). |`
- L728: `| `localityId` | ObjectId → `localities` | Sí | Localidad. |`
- L785: `| `enumerationId` | ObjectId | Sí | `enumerations` (T04) | destino → `enumerations` |`
- L808: `| `countryId` | ObjectId | Sí | `countries` (T04) | destino → `countries` |`
- L820: `| `provinceId` | ObjectId | Sí | `provinces` (T04) | destino → `provinces` |`
- L839: `| `departmentId` | ObjectId | Sí | `departments` (T04) | destino → `departments` |`
- L850: `| `localityId` | ObjectId | Sí | `localities` (T04) | destino → `localities` |`
- L860: `| `sourceId` | ObjectId | No | — | Según la definición en texto del §7 |`
- L870: `| `localityId` | ObjectId | Sí | `localities` (T04) | destino → `localities` |`
- L878: `| `streetId` | ObjectId | Sí | `streets` (T04) | destino → `streets` |`
- _… y 27 líneas más._

### `docs/especificacion/anexos/T04b-CFG-catalogo-parametros-procoop-parte1.md`
- L156: `| 2730 | VAR | Lógico | No levantar Agente si se encuentra cerrado (modo 11) | Program.Main | Reemplazado: workers BullM`

### `docs/especificacion/anexos/T04b-CFG-catalogo-parametros-procoop-parte2.md`
- L38: `| **Migrar** | Parámetro funcional del tenant. Se crea un PRM con clave semántica tipada; el valor de ProCoop se traslad`
- L54: `- **Tipo nuevo**: `boolean`, `integer`, `decimal` (Decimal128, no importe), `money` (Decimal128 en ARS, `decimal.js`), ``
- L183: `| 2426 | VAR | Lógico | Usar servicio de ProCoop para el envío automático de mails | `frm_VisorMensajes` | Reemplazado |`
- L215: `| 2561 | VAR | Lógico | No utilizar Agente simple para autorizar cobranzas (requiere agente en otra PC con parámetro "Au`
- L435: `| 2648 | VAR | Texto | Nombre de servidor que puede abrir el agente | `Program.Main` (modo 11) | Reemplazado | — | Worke`

### `docs/especificacion/anexos/T04b-CFG-catalogo-parametros-procoop-parte3.md`
- L59: `- **Tipo nuevo**: `boolean`, `int`, `decimal(%)` (tasa con `Decimal128`), `money` (`Decimal128`, ARS), `enum{...}`, `ref`

### `docs/especificacion/anexos/T04b-CFG-catalogo-parametros-procoop-parte4.md`
- L51: `- **Tipo nuevo**: `boolean`, `integer`, `decimal`, `money` (Decimal128), `string`, `string[]`, `enum(...)`, `enum[]`, `m`
- L235: `| 2047 | VAR | N | Cantidad de errores para desactivar módem | frmParam_SMS.cmdAceptar_Click | Plataforma — política de `
- L734: `- **Contexto:** ProCoop tiene parámetros de desactivación de módem por errores. El stack de CoopApps (DEC-001) envía por`

### `docs/especificacion/anexos/T05-DAT-modelo-datos.md`
- L63: `| RN-DAT-001 | Toda colección de negocio lleva `tenantId` (ObjectId, obligatorio, inmutable) y todo índice compuesto emp`
- L67: `| RN-DAT-005 | Dinero y cantidades físicas en `Decimal128`, operados con `decimal.js`; nunca `Number` de JavaScript. | ``
- L69: `| RN-DAT-007 | Referencias por `ObjectId`; los documentos emitidos guardan snapshot de los datos que representan. La int`
- L86: `| `tenantId` (ObjectId) | `TenantId` (`uniqueidentifier` o FK a `pla.Tenants`) |`
- L87: `| `_id` ObjectId | `Id` PK; códigos visibles `Code` / `Number` con unicidad por tenant |`
- L88: `| Plugin Mongoose / consulta sin tenant | Filtro global EF + interceptores; pruebas CI de aislamiento (T08) |`
- L89: `| Decimal128 / `decimal.js` | `decimal(p,s)` en SQL; tipos money en dominio .NET |`
- L91: `| BullMQ job | Mensaje Azure Queue + worker .NET idempotente |`
- L103: `- **Identificadores**: PK `Id` (GUID o entero según tabla en `07`). El identificador visible es `code` (catálogos) o `nu`
- L108: `- `tenantId` ObjectId obligatorio, inmutable, primer campo de todo índice compuesto (incluidos únicos, parciales, TTL co`
- L129: `- Campos comunes (`AuditFields`): `createdAt`, `createdBy`, `updatedAt`, `updatedBy` (ObjectId de `memberships` de T02; `
- L136: `- **Baja lógica** solo en configuración y maestros: `deletedAt`, `deletedBy`, `deleteReason` y el espejo booleano `isDel`
- L144: `- Corrección: documento de signo contrario con `reversalOf` (ObjectId del original) y, en el original, `reversedBy[]` y `
- L145: `- Protección técnica: el modelo Mongoose de estas colecciones bloquea `deleteOne`/`deleteMany` y la actualización de cam`
- L149: `- Tipo `Money`: `Decimal128`; aritmética con `decimal.js` (`precision: 34`, `rounding: ROUND_HALF_UP` salvo política de `
- L164: `- Referencias por `ObjectId` con el nombre canónico de §7.2. Una referencia a otro módulo nunca se resuelve con `populat`
- L201: `- TTL de MongoDB solo para colecciones técnicas (§7.8.3). La supresión de datos de negocio la ejecuta `retentionRuns` (T`
- L207: `- Patrón **expandir/contraer**: 1) agregar campo o colección opcional; 2) escribir en ambos formatos; 3) job de relleno `
- L209: `- Validación: Mongoose en la aplicación para todas; además validador `$jsonSchema` en base (nivel `moderate`) para las c`
- L221: `2. **`ObjectId` y foto en lo emitido** (RN-DAT-007, §7.1.9). Las referencias son `ObjectId` con el nombre canónico de §7`
- L222: `3. **`$jsonSchema`** (§7.1.14). Mongoose valida todas las colecciones en la aplicación; además, las colecciones económic`
- L224: `5. **Verificador nocturno** (DEC-100; requisito operativo en T08, RNF-NFR-260 y JOB-NFR-25). Proceso por tenant que reco`
- L289: `| `templateId` | M08 `suspensionRestrictionRules` | `code` de la fila de plataforma de la misma colección (alcance `T+P``
- L296: `| `taxId` | M05, M08, M12, T09 (5-11-2026, sincronización: incluye M08 `debtCollectionAgencies.taxId`, que deja de ser O`
- L298: `| `deviceId` | M16 `timePunches`, T06 `localAgentCommands` | `deviceId` del dispositivo embebido en `localAgents.devices`
- _… y 22 líneas más._

### `docs/especificacion/anexos/T06-INT-integraciones.md`
- L27: `5. Ejecución confiable: **outbox + cola BullMQ** con reintentos, backoff, timeouts, **idempotencia**, **circuit breaker*`
- L178: `| RF-INT-033 | Colas BullMQ por categoría (`int-fiscal`, `int-payments`, `int-files`, `int-messaging`, `int-metering`, ``
- L276: `| RN-INT-015 | La cola no se traba por concurrencia. | Bandera `EnviandoMails` puede quedar en verdadero y frenar la col`
- L363: `| `tenantId` | ObjectId | Sí | |`
- L372: `| `certificateRefs` | ObjectId[] | No | |`
- L373: `| `legalEntityId` | ObjectId | No | Persona jurídica del tenant a la que pertenece la conexión (`legalEntities` de T04, `
- L376: `| `fallbackConnectionIds` | ObjectId[] | No | Cadena de respaldo (RF-INT-010); → `integrationConnections`. |`
- L379: `| `webhookEndpointId` | ObjectId | No | |`
- L383: `| `approvalRequestId` | ObjectId | No | Aprobación pendiente (T11). |`
- L391: `Cifrado por sobre propio en MongoDB con clave maestra en AWS KMS, detrás de una interfaz agnóstica de proveedor (DEC-074`
- L395: `| `tenantId` | ObjectId | Sí | |`
- L396: `| `connectionId` | ObjectId | Sí | |`
- L418: `| `tenantId`, `connectionId` | ObjectId | Sí | |`
- L426: `| `privateKeySecretId` | ObjectId | Sí | Ref. a `integrationSecrets` (`kind: privateKey`). |`
- L441: `| `tenantId` | ObjectId | Sí | Tenant. | `tenants` (T01) |`
- L442: `| `connectionId` | ObjectId | Sí | Conexión que obtuvo el token. | `integrationConnections` (T06) |`
- L452: `| `tenantId`, `connectionId` | ObjectId | Sí | |`
- L465: `| `jobId` | string | No | Id BullMQ. |`
- L466: `| `batchId` | ObjectId | No | Lote de negocio (ej. lote de facturación). |`
- L467: `| `contingencyId` | ObjectId | No | |`
- L477: `| `tenantId`, `connectionId` | ObjectId | Sí | |`
- L478: `| `operationId` | ObjectId | No | (los webhooks pueden no tener operación aún) |`
- L507: `| `tenantId` | ObjectId | Sí | `PLATFORM` o tenant (variantes propias). |`
- L526: ``tenantId`, `connectionId`, `layoutCode`, `layoutVersion`, `direction`, `businessBatchRef` `{ module, entity, id }`, `fi`
- L530: ``tenantId`, `connectionId`, `type` (`payments`, `debtPublication`, `fiscal`, `bank`, `messaging`, `metering`), `periodFr`
- _… y 31 líneas más._

### `docs/especificacion/anexos/T07-MIG-migracion-procoop.md`
- L10: `| Fuentes consolidadas | BASE §31 (alcance de integraciones/importaciones/migración, CU-31, precarga MIG-DEMO-001), §35 `
- L20: `Definir, de forma ejecutable y comprobable, cómo se trasladan los datos de cada cooperativa que hoy opera con ProCoop (S`
- L175: `| RF-MIG-036 | Convertir importes a `Decimal128` con la escala de origen sin redondeo; registrar diferencias de redondeo`
- L320: `Todas las colecciones llevan `tenantId` (ObjectId, obligatorio, primer campo de todo índice compuesto), `createdAt`, `up`
- L335: `| `acceptanceActId` | ObjectId | No | Acta en `documents` de T11 con tipo documental `DOC-ACTA-MIG` de T11 §18.6 (PA-MIG`
- L343: `| `projectId` | ObjectId | Sí | |`
- L346: `| `baseSnapshotId` | ObjectId | No | Para deltas; → `legacySnapshots`. |`
- L349: `| `anonymizationProfileId` | ObjectId | No | |`
- L364: `| `mappingSetId` | ObjectId | Sí | → `migrationMappingSets` (antes `setId`; nombre canónico de T05). |`
- L384: `| `projectId`, `snapshotId`, `mappingSetId` | ObjectId | Sí | Reproducibilidad. |`
- L388: `| `targetTenantId` | ObjectId | Sí | Tenant de ensayo o productivo. |`
- L400: `| `runId` | ObjectId | Sí | |`
- L406: `| `issues[]` | ObjectId → `migrationIssues` | No | |`
- L421: `| `targetId` | ObjectId | Sí | |`
- L422: `| `firstRunId`, `lastRunId` | ObjectId | Sí | |`
- L426: `| `mergedIntoId` | ObjectId | No | |`
- L442: `| `projectId`, `runId` | ObjectId | Sí | |`
- L444: `| `checks[]` | `{ code, description, sourceValue (Decimal128\|int), targetValue, difference, tolerance, status: ok\|expl`
- L457: `| `parallelRunId` | ObjectId | → `parallelRuns`. |`
- L458: `| `accountId`, `contractId`, `billingGroupId` | ObjectId | → `accounts` (M01), `serviceContracts` (M02), `billingGroups``
- L460: `| `goodappsSimDocId` | ObjectId | → `documents` (T11). |`
- L485: `| `runId` | ObjectId | |`
- L507: `| `mappingSetId` | ObjectId | Sí | `migrationMappingSets` (T07) | destino → `migrationMappingSets` |`
- L515: `| `runId` | ObjectId | Sí | `migrationRuns` (T07) | destino → `migrationRuns` |`
- L543: `| `runId` | ObjectId | No | `migrationRuns` (T07) | destino → `migrationRuns` |`
- _… y 12 líneas más._

### `docs/especificacion/anexos/T08-NFR-no-funcionales-seguridad.md`
- L123: `| RF-NFR-001 | Inventario de datos personales por entidad/colección: campo, categoría (identificatorio, contacto, fiscal`
- L174: `| RN-NFR-005 | Un importe se representa como `Decimal128`/`decimal.js`; está prohibido `Number` para importes, tasas, al`
- L193: `| RN-NFR-024 | Las tareas programadas corren en workers con cola (BullMQ), monitoreo y alertas; no en un ejecutable vigi`
- L259: `| RNF-NFR-022 | Lecturas pesadas (reportes, BI, exportaciones) en nodos secundarios del replica set con `readPreference:`
- L277: `| RNF-NFR-035 | RPO de plataforma (pérdida máxima de datos ante falla de infraestructura dentro de la región). | Comprom`
- L280: `| RNF-NFR-038 | Backups de MongoDB: PITR continuo + snapshot diario, semanal y mensual. | Retención: PITR 7 días; diario`
- L290: `| RNF-NFR-048 | Alta disponibilidad de datos: MongoDB replica set de 3 nodos en 3 zonas, `writeConcern: majority`, `read`
- L309: `| RNF-NFR-053 | Cifrado en tránsito interno: conexiones a MongoDB, Redis, almacenamiento de objetos, KMS y proveedores c`
- L317: `| RNF-NFR-056 | (Bóveda y cifrado de campos con cifrado por sobre en MongoDB y clave maestra en AWS KMS detrás de una in`
- L373: `| RNF-NFR-082 | Validación con Zod en servidor de `params`, `query`, `headers` relevantes y `body` de **toda** ruta, con`
- L375: `| RNF-NFR-084 | Inyección NoSQL: Mongoose con `sanitizeFilter: true` y `strictQuery: true`; rechazo de claves que empiez`
- L403: `| RNF-NFR-097 | Endurecimiento de datos: MongoDB con autenticación, TLS, auditoría de la base habilitada si el servicio `
- L462: `| RNF-NFR-238 | Defensa en profundidad del aislamiento: el plugin de tenancy cubre también cada `$lookup`, `$unionWith` `
- L561: `| RNF-NFR-123 | Propagación de contexto W3C Trace Context (`traceparent`, `tracestate`) y `baggage` con `tenantId` desde`
- L565: `| RNF-NFR-127 | Trazas OpenTelemetry con autoinstrumentación de HTTP, Express, MongoDB, ioredis y BullMQ, más spans manu`
- L592: `| RNF-NFR-142 | Pruebas de integración contra **MongoDB 7 real en replica set** (contenedor o binario real; no mocks de `
- L689: `| RNF-NFR-200 | Infraestructura monetaria: `Decimal128` en Mongo y `decimal.js` en `packages/shared/money` como única fo`
- L705: `| RNF-NFR-211 | Transacciones multi-documento (replica set) en toda operación que toque más de un documento económico (f`
- L722: `| RNF-NFR-228 | Tiempo: marcas de tiempo del servidor (no del cliente) para `createdAt`, `recordedAt` y orden de eventos`
- L732: `Todas las colecciones de tenant llevan `tenantId` (ObjectId, obligatorio, primer campo de todo índice compuesto), `creat`
- L743: `| `purposes` | [ObjectId → `processingActivities`] | Sí | Finalidades. |`
- L744: `| `retentionPolicyId` | ObjectId | Sí | Política aplicable; → `retentionPolicies`. |`
- L750: `**`processingActivities`** — registro de tratamientos (RF-NFR-002): `code` (string, único por tenant), `name` (`dict:` c`
- L752: `**`privacyNotices`** — avisos versionados (RF-NFR-003): `channel` (enum `landing`, `registro`, `app`, `presencial`, `emp`
- L754: `**`consentRecords`** — consentimientos y preferencias (RF-NFR-004): `personId` (ObjectId → M01), `userId` (opcional), `p`
- _… y 27 líneas más._

### `docs/especificacion/anexos/T09-COM-comunidad-comunicaciones.md`
- L389: `| RN-COM-014 | Estados de cola de email ProCoop: 1 pendiente → 4 en proceso → 2 enviado / 3 error; si otro hilo tomó un `
- L444: `- Todas las colecciones llevan `tenantId` (ObjectId, obligatorio, primer campo de todo índice compuesto), `createdAt`, ``
- L448: `- Los importes (costo de mensajería, beneficios de monto fijo) son `Decimal128` con `currency`.`
- L460: `| `include.branchIds[]`, `zoneIds[]`, `sectorIds[]`, `routeIds[]`, `localityIds[]`, `neighborhoodIds[]`, `streetIds[]` |`
- L461: `| `include.serviceIds[]`, `serviceStatuses[]`, `tariffCategoryIds[]`, `planIds[]`, `billingGroupIds[]` | ObjectId[] / en`
- L465: `| `include.roleIds[]`, `profileIds[]`, `crewIds[]` | ObjectId[] | No | Empleados (T02, M10, M16). |`
- L466: `| `include.networkNodeIds[]` | ObjectId[] | No | Ramal, transformador, nodo, OLT, celda (M10). |`
- L471: `| `personIds[]` | ObjectId[] | No | Modo `users` o agregado en `restricted`. |`
- L472: `| `importListIds[]` | ObjectId[] → `audienceImportLists` | No | Modo `import`. |`
- L473: `| `segmentId` | ObjectId → `audienceSegments` | No | Modo `segment`. |`
- L488: `| `categoryId` | ObjectId → `postCategories` | No | Categoría. |`
- L494: `| `authorUserId`, `authorDisplay` | ObjectId; { `kind`: `institution`/`person`, `name` } | Sí | Autor real (→ `membershi`
- L501: `| `audienceSnapshotId` | ObjectId | Sistema | Al publicar. → `audienceSnapshots` (COL-COM-33). |`
- L502: `| `audienceSegmentId` | ObjectId | No | Segmento guardado usado como audiencia → `audienceSegments` (COL-COM-30). Según `
- L508: `| `linkedSurveyId`, `linkedEventId`, `linkedBenefitId`, `linkedOutageNoticeId` | ObjectId | No | Vinculaciones. |`
- L514: `| `copiedFromPostId` | ObjectId | No | RF-COM-025. |`
- L527: `| `parentId` | ObjectId | No | — | `postCategories` (COL-COM-02, T09) |`
- L555: `| `postId` | ObjectId | Sí | — | `posts` (COL-COM-01, T09) |`
- L556: `| `membershipId` | ObjectId | Sí | (antes `userId`; nombre según T05) | `memberships` (COL-IAM-04, T02) |`
- L566: `| `postId` | ObjectId | Sí | — | `posts` (COL-COM-01, T09) |`
- L567: `| `userId` | ObjectId | Sí | — | `memberships` (COL-IAM-04, T02) |`
- L578: `| `postId` | ObjectId | Sí | — | `posts` (COL-COM-01, T09) |`
- L593: `| `postId` | ObjectId | Sí | — | `posts` (COL-COM-01, T09) |`
- L594: `| `membershipId` | ObjectId | Sí | (antes `userId`; nombre según T05) | `memberships` (COL-IAM-04, T02) |`
- L607: `| `postTemplateId` | ObjectId | No | — | `postTemplates` (COL-COM-03, T09) |`
- _… y 126 líneas más._

### `docs/especificacion/anexos/T10-BIA-reportes-bi-apis.md`
- L8: `| Olas | **O1**: motor de reportes, catálogo, ejecución síncrona/asíncrona, exportación XLSX/CSV/PDF con BullMQ y descar`
- L22: `1. Un **motor de reportes** con catálogo, parámetros tipados, filtros, permisos por capability y alcance de datos, ejecu`
- L217: `| RF-BIA-022 | Exportación asíncrona en worker BullMQ (`bia:generar-exportacion`) cuando supera `PRM-BIA-005` filas; arc`
- L365: `Todas las colecciones llevan `tenantId` (ObjectId, obligatorio; `PLATFORM` para definiciones de sistema), `createdAt`, ``
- L381: `| `datasetId` | ObjectId | Sí (custom) | Dataset semántico base. |`
- L391: `| `templateId` | ObjectId | No | Plantilla PDF por defecto. |`
- L407: `| `ownerUserId` | ObjectId | Sí | — |`
- L408: `| `sharedWithRoleIds[]` | ObjectId[] | No | Requiere `bia.presets.compartir`. |`
- L425: `| `requestedBy` | ObjectId | Sí | Usuario o `scheduleId`/`apiClientId`. |`
- L436: `| `jobId` | String | No | BullMQ. |`
- L476: `Reemplaza `INFO_AUD` (`COD_AUD`, `COD_INF`, `FEC_REG`, `TIP_VIS`). Campos: `reportCode`, `runId`, `exportId`, `action` (`
- L488: `| `datasetId` | ObjectId | Sí | — |`
- L506: `Reemplaza `TENDTAB`. Campos: `indicatorId` (→ `indicatorDefinitions`, referencia), `indicatorCode` (copia desnormalizada`
- L576: `| `responsibleUserId` | ObjectId | Sí | Responsable del tenant. |`
- L605: `| `tenantId` | ObjectId | Sí | Tenant. | `tenants` (T01) |`
- L606: `| `apiClientId` | ObjectId | Sí | Cliente API. | `apiClients` (T02) |`
- L665: `| `reportRunId` | ObjectId | Sí | `reportRuns` (T10) | o `screenKey` + `filters` para exportación de grilla; antes `runI`
- L668: `| `layoutId` | ObjectId | No | `exportLayouts` (T10) | destino → `exportLayouts` |`
- L670: `| `storedFileId` | ObjectId | No | `storedFiles` (T01) | → `storedFiles` de T01, objeto con prefijo `tenants/<tenantId>/`
- L677: `| `requestedBy` | ObjectId | No | `memberships` (T02) | destino → `memberships` |`
- L687: `| `presetId` | ObjectId | No | `reportPresets` (T10) | destino → `reportPresets` |`
- L689: `| `ownerUserId` | ObjectId | No | `memberships` (T02) | destino → `memberships` |`
- L701: `| `lastRunId` | ObjectId | No | `reportRuns` (T10) | destino → `reportRuns` |`
- L704: `| `reportDefinitionId` | ObjectId | Sí | `reportDefinitions` (T10) | destino → `reportDefinitions` |`
- L711: `| `scheduleId` | ObjectId | No | `reportSchedules` (T10) | destino → `reportSchedules` |`
- _… y 83 líneas más._

### `docs/especificacion/anexos/T11-WFL-workflow-eventos-documentos.md`
- L23: `2. **Ejecutar procesos masivos y programados** como jobs BullMQ. T11 aporta el catálogo consolidado de jobs (`JOB-`), la`
- L61: `| Relay del outbox, colecciones `outboxEvents`, `inboxReceipts` y `deadLetters`, colas BullMQ, `jobRuns`, scheduler líde`
- L99: `| Job | Proceso asíncrono `<mod>:<proceso>` que corre en un worker BullMQ, es idempotente, reanudable y registra su prog`
- L296: `| RF-WFL-090 | Diseñador de formularios versionados con tipos de campo: texto corto, texto largo, número entero, número `
- L539: `Convenciones de la guía §5: todos los documentos llevan `tenantId`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy` y`
- L589: `| `responsibleRole`, `responsibleAreaId` | string / ObjectId | Sí / No | Responsable. `responsibleRole` es el código de `
- L650: `| `resultStoredFileId` | ObjectId | No | `storedFiles` del detalle (antes `resultFileId`; nombre con rol de T05 §7.2, `<`
- L651: `| `requestedBy`, `approvedOperationId` | ObjectId | No | Origen. `requestedBy` → `memberships` (T02); `approvedOperation`
- L660: `| `bulkRunId` | ObjectId | Sí | Ref. `bulkRuns`. |`
- L668: `| `reprocessRunId` | ObjectId | No | Ref. `bulkRuns`: corrida hija de reproceso. |`
- L753: `| `amount` | Decimal128 | No | Importe que define tramos. |`
- L757: `| `evidenceDocumentIds` | ObjectId[] | Cond. | Si `evidenceRequired`. |`
- L758: `| `requestedBy`, `requestedAt` | ObjectId / date | Sí | Solicitante. |`
- L759: `| `approvalRequestId` | ObjectId | No | Aprobación. |`
- L763: `| `reversesOperationId` | ObjectId | No | Reversión. |`
- L773: `| `operationId` | ObjectId | Sí | Ref. `operations`. |`
- L806: `| `basedOnTemplateId` | ObjectId | No | Plantilla adoptada: ref. `workflowDefinitions` con `scope = platformTemplate`. |`
- L811: `| `currentVersionId`, `draftVersionId` | ObjectId | No | Ref. `workflowVersions`. |`
- L819: `| `workflowDefinitionId`, `number` | ObjectId / int | Sí | `workflowDefinitionId` → `workflowDefinitions` (antes `defini`
- L834: `| `workflowDefinitionId`, `workflowVersionId` | ObjectId | Sí | Versión fija: ref. `workflowDefinitions` y `workflowVers`
- L841: `| `formSubmissionIds[]`, `documentIds[]` | ObjectId[] | No | Presentaciones y adjuntos. |`
- L854: `| `workflowInstanceId` | ObjectId | Sí | Ref. `workflowInstances` (antes `instanceId`; nombre canónico de T05 §7.2 y §7.`
- L882: `| `slaPolicyId` | ObjectId | Sí | Ref. `slaPolicies` (antes `policyId`; nombre canónico de T05 §7.2 y §7.4.6); mismo nom`
- L896: `| `formDefinitionId` | ObjectId | Sí | Solo en `formVersions`: ref. `formDefinitions` (T05 COL-WFL-18; antes decía COL-W`
- L914: `| `formDefinitionId` | ObjectId | Sí | Ref. `formDefinitions` (COL-WFL-18). |`
- _… y 75 líneas más._

### `docs/especificacion/anexos/T12-SRV-fichas-verticales-servicios-parte2.md`
- L30: `5. Convenciones transversales que no se repiten en cada ficha: `tenantId` en todo documento y primero en índices, tenant`
