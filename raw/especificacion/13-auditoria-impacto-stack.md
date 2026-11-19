# 13 — Auditoría de aplicación del impacto stack (CoopApps / GoodApps)

Generado automáticamente el **19-11-2026** por `_trabajo/audit_impacto_stack.py`.
Ámbito: anexos canónicos, maestro, guía, `06`, `07-*`, presentación (sin `OLD/` ni backups).

## Resumen

| Métrica | Valor |
|---|---|
| Archivos revisados | 71 |
| Anexos con banner DEC-111 | 37 |
| Anexos M/T sin banner | 0 |
| Archivos que mencionan Azure SQL | 48 |
| Líneas con tokens Mongo (revisar) | 270 |
| Líneas Node/Vue (revisar) | 21 |

### Interpretación

- **C-05 (19-11):** nota §7 + **barrido fino** (`barrido_c05_fino_sec7.py`); residuos Mongo abajo = §5–§6, T01/T05 histórico o texto comparativo.
- Residuos **no esperados** en presentación export (DIR-13) sin nota de reemplazo; entregables: **C-10 cerrado** (`00-C10-CIERRE-STACK.md`).

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

### `docs/especificacion/anexos/T08-NFR-no-funcionales-seguridad.md`
- L1558: `| CTR-NFR-11 | DFA M1 mejoras ("OpenIddict"; "una base por cooperativa") vs. DEC-001/002 | Tecnología .NET y modelo de b`


## Menciones Node / Vue / Express

### `docs/especificacion/00-ESPECIFICACION-MAESTRA.md`
- L139: `| DEC-001 | Stack | Connectia tal cual: **Node.js 20 ESM + Express + MongoDB 7** (replica set, transacciones multi-docum`

### `docs/especificacion/_GUIA-REDACCION-ANEXOS.md`
- L47: `| Stack | DEC-001: Node + Express + Mongo + Mongoose + Vue (Connectia) | **DEC-111**: .NET 10, ASP.NET Core, EF Core, **`

### `docs/especificacion/anexos/M07-COB-cuenta-corriente-cobranza.md`
- L102: `| Ente recaudador | Entidad externa que cobra por cuenta de la cooperativa (Red Link, SIRO, Banelco, Pago Fácil, Rapipag`
- L300: `| RF-COB-099 | Proveer un motor declarativo de layouts versionado (cabecera, detalle, pie, posición, largo, decimales im`
- L581: `| RN-COB-097 | Rendición Banelco/Pago Fácil/Rapipago/Cobro Express: cliente por cuenta y comprobante por código de barra`
- L2701: `| Pago Fácil, Rapipago, Cobro Express | Ente / archivo de rendición | Importa | Código de barras e importe | SFTP / manu`
- L3315: `| §5.3 Banelco, Pago Fácil, Rapipago, Cobro Express | 13; PRM-COB-094 |`

### `docs/especificacion/anexos/M19-POR-portal-socio-landing.md`
- L427: `| RN-POR-009 | El cambio de ámbito (tenant) o de espacio (socio/empleado) recalcula permisos y purga caché del Service W`
- L1132: `- **Landing** (`apps/landing`, Vue 3 SSR/SSG por tenant para SEO y velocidad): encabezado con logo del tenant, navegació`
- L1934: `| PR-POR-25 | Cambio de ámbito TEN-001 → TEN-002 | Sin datos de TEN-001 en Pinia, Service Worker, IndexedDB ni colas |`

### `docs/especificacion/anexos/T01-PLA-plataforma-saas.md`
- L178: `| RF-PLA-002 | Stack: Node.js 20 ESM, Express 4, MongoDB 7 en replica set, Mongoose 8, Vue 3.5 + Vite + Pinia + Vue Rout`
- L514: `| Runtime API | **.NET 10**, ASP.NET Core, monolito modular | Node 20 + Express |`
- L520: `| Front | **React 19** + Vite (T03) | Vue 3.5 |`
- L531: `| Runtime | Node.js ESM puro (`"type": "module"`) | 20 LTS (imagen `node:20-alpine`) | CNX §2.1 [COPIAR] |`
- L532: `| HTTP | Express | ^4.21 | CNX [COPIAR] |`
- L545: `| Frontends | Vue 3.5 + Vite 6 + Pinia 2 + Vue Router 4 + Tailwind 3.4 + axios; `vite-plugin-pwa` | — | CNX §2.1 [COPIAR`
- L584: `│  │     ├─ app.js               # Express: middlewares y montaje de routers declarados por manifiestos`

### `docs/especificacion/anexos/T02-IAM-identidad-roles-auditoria.md`
- L2921: `| RF-IAM-004 | El **cambio de ámbito** emite un token nuevo y obliga a recalcular permisos y datos visibles, limpiando c`

### `docs/especificacion/anexos/T06-INT-integraciones.md`
- L1892: `#### FI-INT-41 — Otros entes recaudadores (Cobro Express, Bapro Pagos, Provincia Pagos y similares)`

### `docs/especificacion/anexos/T08-NFR-no-funcionales-seguridad.md`
- L567: `| RNF-NFR-127 | Trazas OpenTelemetry con autoinstrumentación de HTTP, Express, MongoDB, ioredis y BullMQ, más spans manu`

### `docs/especificacion/anexos/T10-BIA-reportes-bi-apis.md`
- L1913: `- **Contenido:** inicio rápido con `curl`, verificación de firma de webhooks en Node.js/Python/C#, tabla de problemas RF`


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

### `docs/especificacion/06-impacto-adaptacion-stack-goodapps.md`
- L472: `**No es incoherencia:** `ObjectId`, tablas comparativas T01 «antes Node» u homólogos dentro de anexos **con banner**, si`

### `docs/especificacion/07-catalogo-tablas-sql.md`
- L471: `| Propósito (resumen) | Ejecuciones de jobs BullMQ; TTL |`
- L9608: `| Propósito (resumen) | Mapa clave ProCoop → ObjectId |`

### `docs/especificacion/07-modelo-relacional-azure-sql.md`
- L241: `| `ExternalJobId` | `varchar(64)` | id cola Azure (antes BullMQ) |`

### `docs/especificacion/_GUIA-REDACCION-ANEXOS.md`
- L47: `| Stack | DEC-001: Node + Express + Mongo + Mongoose + Vue (Connectia) | **DEC-111**: .NET 10, ASP.NET Core, EF Core, **`
- L155: `| O0 | Fundaciones: monorepo, Docker, CI, convenciones, librerías compartidas (money, fechas, Zod), shells AdminShell/Ap`

### `docs/especificacion/anexos/M01-PER-personas-titulares-cuentas.md`
- L625: `> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueident`
- L1386: `| JOB-ID | Nombre BullMQ | Disparador | Qué hace | Idempotencia | Reintentos | Lock |`

### `docs/especificacion/anexos/M02-CAT-catalogo-servicios.md`
- L669: `> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueident`

### `docs/especificacion/anexos/M03-MED-medicion-consumos.md`
- L529: `> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueident`
- L1840: `| PRM-MED-066 | `med.import.defaultProfile` | ObjectId | servicio | — | Modelo de importación por defecto (y de intercam`
- L2327: `- A) **(Recomendada)** Declarar en §8.13 el estado de alta y las transiciones; lecturista → `memberships` (T02); `device`

### `docs/especificacion/anexos/M04-TAR-tarifas-motor-calculo.md`
- L73: `6. **Dinero con `Decimal128` + `decimal.js`**; precios unitarios hasta 6 decimales, cantidades hasta 4, fracciones de pr`
- L656: `> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueident`
- L1469: `- Reintentos: cada cuenta es una unidad idempotente (`runId + accountId`); reintentar reprocesa solo las cuentas fallida`
- L1954: `### 12.3 Jobs (BullMQ)`
- L2282: `Criterios generales: toda pantalla y API cumple permisos, auditoría y diccionario; todo importe usa Decimal128/decimal.j`
- L2884: `| DEC-001 Stack (Decimal128 + decimal.js, Zod, BullMQ) | 7.0; 9.4; sección 11; 12.3 |`

### `docs/especificacion/anexos/M05-FAC-facturacion.md`
- L489: `| RN-FAC-049 | El número se asigna dentro de la misma transacción que persiste el comprobante y actualiza el numerador; `
- L632: `| RN-FAC-144 | Importes en `Decimal128` con `decimal.js`; precios unitarios hasta 6 decimales; importes a 2; redondeo ex`
- L644: `> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueident`
- L1694: `| JOB-ID | Nombre BullMQ | Disparador | Idempotencia | Reintentos | Descripción |`
- L2320: `| CTR-FAC-08 | DFA: Azure Queue Storage y QuestPDF | DEC-001 (stack: BullMQ, PDF de la plataforma) | Jobs BullMQ y gener`
- L2591: `| §2.8 Hilos y avance | RF-FAC-047, JOB-FAC-03 | Reemplazado por jobs BullMQ |`
- L2615: `| §16.1 Posibles errores de ProCoop | Retroactivos → PA-FAC-16; número sin usar → CTR-FAC-15; tramas 3 y 4 → RN-FAC-064 `

### `docs/especificacion/anexos/M06-FIS-fiscal-impuestos.md`
- L574: `> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueident`

### `docs/especificacion/anexos/M07-COB-cuenta-corriente-cobranza.md`
- L446: `| RN-COB-001 | Todo importe es `Decimal128` con aritmética `decimal.js`; importes a 2 decimales, recargos y prorrateos c`
- L662: `> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueident`
- L2078: `Todos los procesos económicos se ejecutan en una transacción MongoDB por operación (recibo + imputaciones + medios + mov`
- L2248: `| JOB-ID | Nombre BullMQ | Disparador | Frecuencia | Idempotencia | Reintentos | Alerta |`
- L3254: `- **Pregunta**: ¿Qué destino tienen las referencias que los entregables marcaron sin colección (`closeGroupId`, `settlem`

### `docs/especificacion/anexos/M08-MOR-mora-financiacion.md`
- L681: `> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueident`
- L2025: `Todos los jobs: idempotentes, reanudables, con progreso, aislados por tenant, con `jobRunId` y reintentos exponenciales `
- L2729: `Principios: la migración es **repetible** (O11), idempotente por clave de origen (subdocumento `legacy = {system: 'proco`
- L2738: `| `INDICESMORA` (DIA/MES/ANO_TAB, IND_TAB, FECHA) | `interestIndexValues` | Fecha compuesta → `date`; valor Decimal128 |`

### `docs/especificacion/anexos/M09-CRM-atencion.md`
- L504: `> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueident`
- L2122: `| PRM-CRM-091 | `crm.hours.hourlyRate` | Decimal128 ARS | tenant | 0 | Valor hora para bonificación | V2 2488 |`
- L2755: `| DEC-001..010 | §7 (Mongo, `tenantId`), §12 (outbox, BullMQ), olas O2–O3 piloto Internet, CTR-CRM-12, 18 |`

### `docs/especificacion/anexos/M10-TEC-tecnica-campo-redes.md`
- L214: `| RF-TEC-029 | Numeración interna inmutable (ObjectId) + número de comprobante por talonario/operación + **numeración vi`
- L596: `| RN-TEC-082 | Elementos nuevos reciben ID definitivo y los hijos se reapuntan en la misma transacción. | IDs negativos `
- L633: `> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueident`
- L2615: `| JOB-TEC-06 | `tec:aprovisionar` | continuo (cola BullMQ) | Ejecuta comandos de aprovisionamiento. | `commandId`. |`
- L2856: `Ver §9.12 (JOB-TEC-01 a JOB-TEC-17). Todos corren en workers BullMQ con `tenantId` en el job, reintentos con backoff exp`
- L3259: `Principios (T07): migración repetible e idempotente por el subdocumento `legacy` de T05 §19.1 (`{system, table, key, dis`
- L3267: `| `TECNICA_EXTRAS` | `damageAssessments` / `workOrders.extraData` | Reclamos por daños: montos a Decimal128. | Suma de r`
- L3322: `| CTR-TEC-09 | RN-07 (recomienda PostGIS) vs DEC-001 | RN-07 sugiere PostGIS para el GIS; DEC-001 fija MongoDB. | GeoJSO`

### `docs/especificacion/anexos/M11-VEN-ventas-presupuestos.md`
- L280: `| RN-VEN-046 | Importes en `Decimal128`, precios unitarios hasta 6 decimales, importes a 2, regla de redondeo por concep`
- L289: `> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueident`
- L1070: `Todos se publican por outbox en la misma transacción; consumidores idempotentes por `eventId`. Jobs: ver §9.6 (`JOB-VEN-`

### `docs/especificacion/anexos/M12-CMP-compras-proveedores.md`
- L267: `| RF-CMP-143 | Identificadores internos por documento (ObjectId) y numeración legible por tipo y punto; los ID compuesto`
- L359: `| RN-CMP-068 | Cantidades con la precisión de la unidad de medida; importes Decimal128, precios unitarios hasta 6 decima`
- L360: `| RN-CMP-069 | Identidad interna por ObjectId; numeración legible por tipo y punto; claves ProCoop compuestas solo en `l`
- L369: `> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueident`
- L1052: `Todos en BullMQ con 5 reintentos exponenciales (salvo indicación) y cola de errores visible en T07.`
- L1637: `- Claves compuestas de ProCoop (`COD_COM`+`SUC_COM`+`NUM_COM`+`COD_PROV`) se guardan en `legacy.key` (antes `legacyRef`)`
- L1698: `| CTR-CMP-13 | RN-08 §1.3 vs CNX | Identidad por claves compuestas | ObjectId + `legacy` (antes `legacyRef`) | CNX > RN `

### `docs/especificacion/anexos/M13-STK-stock-activos-fabricacion.md`
- L445: `> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueident`

### `docs/especificacion/anexos/M14-TES-tesoreria-bancos.md`
- L530: `> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueident`
- L2363: `| CTR-TES-10 | RN-08 §1.3 vs AGR-016, guía §5 | Claves compuestas de texto e IDs `MAX + 1` sin bloqueo. | ObjectId + tal`

### `docs/especificacion/anexos/M15-CON-contabilidad.md`
- L567: `> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueident`

### `docs/especificacion/anexos/M16-SUE-personal-sueldos.md`
- L536: `> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueident`

### `docs/especificacion/anexos/M17-INS-institucional.md`
- L354: `| RN-INS-052 | Importes con `Decimal128`; capital en ARS salvo configuración. | — | **Adoptar** (convenciones). | — | — `
- L359: `> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueident`

### `docs/especificacion/anexos/M18-SOC-servicios-sociales-flota.md`
- L356: `| RF-SOC-145 | **Importes** en `Decimal128` y ARS salvo configuración. | Convenciones | Núcleo | O4 | Adoptado | Todos l`
- L420: `> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueident`
- L2107: `**Sincronización (5-11-2026), Asumida (DEC-072):** `fuelTypes.vatRateId` se tipa ObjectId (antes Enum) y el resumen del `

### `docs/especificacion/anexos/M19-POR-portal-socio-landing.md`
- L499: `> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueident`
- L1120: `| `JOB-POR-08` `por:purgar-intentos-vinculacion` | Continua (índice TTL de MongoDB) | Reemplazado por el índice TTL en ``

### `docs/especificacion/anexos/T01-PLA-plataforma-saas.md`
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
- L505: `> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueident`
- L515: `| Persistencia | **Azure SQL** + EF Core; esquema **`pla.*`** ([`07` §2.0](07-modelo-relacional-azure-sql.md)) | MongoDB`
- L516: `| Multitenancy | `TenantId` + filtro global EF; pruebas CI aislamiento | Plugin Mongoose, DEC-002 |`
- L517: `| Colas / jobs | **Azure Queue Storage** + workers .NET idempotentes | BullMQ + Redis |`
- L518: `| Outbox | `pla.OutboxEvents` transacción SQL + relay | `outboxEvents` Mongo + BullMQ |`
- L533: `| Base de datos | MongoDB **replica set** (también en local, nodo único) | 7.x | DEC-001; transacciones multi-documento `
- L534: `| ODM | Mongoose | ^8.9 | CNX [COPIAR] + plugins de tenancy, auditoría, versión, borrado lógico |`
- L536: `| Colas | BullMQ + Redis | BullMQ 5 / Redis 7 | CNX §2.6 [MEJORAR] (Redis ya estaba en dependencias sin uso) |`
- L548: `| Referencia nube | AWS: ECS Fargate (o EKS), MongoDB Atlas sobre AWS o replica set autogestionado, ElastiCache Redis, S`
- L588: `│  │     │  ├─ tenancy/          # plugin Mongoose, runAsPlatform, lista blanca de colecciones globales, check de índice`
- L626: `│  │     ├─ scheduler.js         # job schedulers de BullMQ declarados en manifiestos (una sola instancia líder)`
- L753: `### 7.6. Outbox, eventos y workers BullMQ`
- L759: `3. Por cada suscriptor registrado para el `type`, encola en la cola `events` un job con `jobId = <eventId>:<consumer>` (`
- L775: `| — (sin cola; excepción explícita) | JOB-PLA-01 `pla:outbox-relay`: proceso dedicado del worker que lee `outboxEvents` `
- L777: `**Excepción a las clases de cola:** JOB-PLA-01 `pla:outbox-relay` no corre en ninguna cola de BullMQ. Es un proceso dedi`
- _… y 4 líneas más._

### `docs/especificacion/anexos/T02-IAM-identidad-roles-auditoria.md`
- L3125: `> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueident`

### `docs/especificacion/anexos/T03-UXD-experiencia-marca-diccionario.md`
- L446: `> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueident`

### `docs/especificacion/anexos/T04-CFG-configuracion-parametros-maestros.md`
- L285: `| RF-CFG-092 | Valores con `Decimal128`, período o fecha, `publishedAt`, `recordedAt`, estado (`provisional`, `definitiv`
- L384: `| RF-CFG-136 | **`legalEntityId` obligatorio** en el esquema base de los documentos económicos (paquete compartido de es`
- L432: `| RN-CFG-036 | Importes de índices y cotizaciones en `Decimal128`; prohibido `Number`. | — | Adoptar (Guía §5). | — | — `
- L454: `> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueident`
- L465: `| **Publicación / jobs** | Transacción SQL + `OutboxEvents` / **Azure Queue** (`cfg:activar-vigencias`, cargas masivas) `
- L1686: `| BCRA (cotizaciones y tasas) | Series de cotización y tasas de referencia. | Ficha T06; valores en `Decimal128`. |`

### `docs/especificacion/anexos/T04b-CFG-catalogo-parametros-procoop-parte1.md`
- L156: `| 2730 | VAR | Lógico | No levantar Agente si se encuentra cerrado (modo 11) | Program.Main | Reemplazado: workers BullM`
- L196: `> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueident`

### `docs/especificacion/anexos/T04b-CFG-catalogo-parametros-procoop-parte2.md`
- L38: `| **Migrar** | Parámetro funcional del tenant. Se crea un PRM con clave semántica tipada; el valor de ProCoop se traslad`
- L54: `- **Tipo nuevo**: `boolean`, `integer`, `decimal` (Decimal128, no importe), `money` (Decimal128 en ARS, `decimal.js`), ``
- L183: `| 2426 | VAR | Lógico | Usar servicio de ProCoop para el envío automático de mails | `frm_VisorMensajes` | Reemplazado |`
- L215: `| 2561 | VAR | Lógico | No utilizar Agente simple para autorizar cobranzas (requiere agente en otra PC con parámetro "Au`
- L435: `| 2648 | VAR | Texto | Nombre de servidor que puede abrir el agente | `Program.Main` (modo 11) | Reemplazado | — | Worke`
- L519: `> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueident`

### `docs/especificacion/anexos/T04b-CFG-catalogo-parametros-procoop-parte3.md`
- L59: `- **Tipo nuevo**: `boolean`, `int`, `decimal(%)` (tasa con `Decimal128`), `money` (`Decimal128`, ARS), `enum{...}`, `ref`
- L447: `> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueident`

### `docs/especificacion/anexos/T04b-CFG-catalogo-parametros-procoop-parte4.md`
- L51: `- **Tipo nuevo**: `boolean`, `integer`, `decimal`, `money` (Decimal128), `string`, `string[]`, `enum(...)`, `enum[]`, `m`
- L235: `| 2047 | VAR | N | Cantidad de errores para desactivar módem | frmParam_SMS.cmdAceptar_Click | Plataforma — política de `
- L731: `> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueident`
- L736: `- **Contexto:** ProCoop tiene parámetros de desactivación de módem por errores. El stack de CoopApps (DEC-001) envía por`

### `docs/especificacion/anexos/T05-DAT-modelo-datos.md`
- L63: `| RN-DAT-001 | Toda colección de negocio lleva `tenantId` (ObjectId, obligatorio, inmutable) y todo índice compuesto emp`
- L67: `| RN-DAT-005 | Dinero y cantidades físicas en `Decimal128`, operados con `decimal.js`; nunca `Number` de JavaScript. | ``
- L69: `| RN-DAT-007 | Referencias por `ObjectId`; los documentos emitidos guardan snapshot de los datos que representan. La int`
- L92: `> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueident`
- L105: `| Plugin Mongoose / consulta sin tenant | Filtro global EF + interceptores; pruebas CI de aislamiento (T08) |`
- L108: `| BullMQ job | Mensaje Azure Queue + worker .NET idempotente |`
- L120: `Tras §7.0, los párrafos que citan Mongoose, `uniqueidentifier`, BullMQ o `$jsonSchema` son **descripción lógica o histór`
- L154: `- Campos comunes (`AuditFields`): `createdAt`, `createdBy`, `updatedAt`, `updatedBy` (uniqueidentifier de `memberships` `
- L161: `- **Baja lógica** solo en configuración y maestros: `deletedAt`, `deletedBy`, `deleteReason` y el espejo booleano `isDel`
- L170: `- Protección técnica: el modelo Mongoose de estas colecciones bloquea `deleteOne`/`deleteMany` y la actualización de cam`
- L226: `- TTL de MongoDB solo para colecciones técnicas (§7.8.3). La supresión de datos de negocio la ejecuta `retentionRuns` (T`
- L232: `- Patrón **expandir/contraer**: 1) agregar campo o colección opcional; 2) escribir en ambos formatos; 3) job de relleno `
- L234: `- Validación: Mongoose en la aplicación para todas; además validador `$jsonSchema` en base (nivel `moderate`) para las c`
- L247: `3. **`$jsonSchema`** (§7.1.14). Mongoose valida todas las colecciones en la aplicación; además, las colecciones económic`
- L249: `5. **Verificador nocturno** (DEC-100; requisito operativo en T08, RNF-NFR-260 y JOB-NFR-25). Proceso por tenant que reco`
- L391: `| `jobId` | M02 `bulkContractOperations`, M04 `calculationRuns`, M05 `massOperations` | Identificador del job BullMQ reg`
- L482: `| COL-PLA-27 | `jobRuns` | T01 | Ejecuciones de jobs BullMQ; TTL | `jobName` (5-11-2026, residuales: alineado a T01 §7; `
- L1829: `- **Plataforma completa** (300 tenants: 288 estándar y 12 grandes, 9 M de suministros como en T08 §7.1; con 100 tenants,`
- L1879: `El tamaño máximo de documento de MongoDB es 16 MB; el límite de diseño es 1 MB por documento salvo plantillas y snapshot`
- L2070: `No aplica (T05 no es dueño de endpoints). Regla de datos para toda API: los identificadores expuestos son `_id` (ObjectI`
- L2146: `| `runId` | ObjectId | `migrationRuns` que cargó el documento. |`
- L2189: `| CTR-DAT-21 | Duplicados técnicos de T08 (`idempotencyKeys`, `processedEvents`, `alertRules`/`alertEvents`, `tenantUsag`
- L2223: `| CTR-DAT-55 | `gpsPositions`: TTL por tenant (PRM-SOC-035) vs TTL de serie temporal, que es por colección. | `expireAft`
- L2249: `| CTR-DAT-81 | Integridad referencial: el documento externo `NucleoTransversal-Modelo` (contraste 13.10) propone claves `
- L2323: `- 5-11-2026, pendientes de la sincronización: COL-TAR-03, COL-TAR-04 y COL-TAR-06 suman `taxRateIds` → `vatRates` y `tax`

### `docs/especificacion/anexos/T06-INT-integraciones.md`
- L27: `5. Ejecución confiable: **outbox + cola BullMQ** con reintentos, backoff, timeouts, **idempotencia**, **circuit breaker*`
- L178: `| RF-INT-033 | Colas BullMQ por categoría (`int-fiscal`, `int-payments`, `int-files`, `int-messaging`, `int-metering`, ``
- L276: `| RN-INT-015 | La cola no se traba por concurrencia. | Bandera `EnviandoMails` puede quedar en verdadero y frenar la col`
- L329: `> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueident`
- L954: `2. El relay del outbox publica en la cola de la categoría con `jobId = operationId` (BullMQ descarta duplicados).`
- L1153: `| EVT-INT-24 | `int.serviceUsage.received` | Consumo del período de un servicio TIC con cupo (casillas de correo FI-INT-`
- L3567: `| PA-INT-02 | Respondida (DEC-074) | Cifrado por sobre propio en MongoDB con clave maestra en AWS KMS, detrás de una int`

### `docs/especificacion/anexos/T07-MIG-migracion-procoop.md`
- L10: `| Fuentes consolidadas | BASE §31 (alcance de integraciones/importaciones/migración, CU-31, precarga MIG-DEMO-001), §35 `
- L175: `| RF-MIG-036 | Convertir importes a `Decimal128` con la escala de origen sin redondeo; registrar diferencias de redondeo`
- L319: `> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueident`
- L836: `| F6 | Transformación | Snapshot + conjunto de mapeo | Aplicar reglas; anulaciones → estado; `HIS_*` → versiones; `*_EXT`
- L856: `10. **Orquestación**: jobs BullMQ (`mig:*`, §12), un job padre por corrida y jobs hijos por tabla/lote, con progreso, ca`
- L888: `| Importes con más decimales que la escala | Escala | Conservar exacto en Decimal128; informar | No |`

### `docs/especificacion/anexos/T08-NFR-no-funcionales-seguridad.md`
- L123: `| RF-NFR-001 | Inventario de datos personales por entidad/colección: campo, categoría (identificatorio, contacto, fiscal`
- L174: `| RN-NFR-005 | Un importe se representa como `Decimal128`/`decimal.js`; está prohibido `Number` para importes, tasas, al`
- L193: `| RN-NFR-024 | Las tareas programadas corren en workers con cola (BullMQ), monitoreo y alertas; no en un ejecutable vigi`
- L199: `> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueident`
- L279: `| RNF-NFR-035 | RPO de plataforma (pérdida máxima de datos ante falla de infraestructura dentro de la región). | Comprom`
- L282: `| RNF-NFR-038 | Backups de MongoDB: PITR continuo + snapshot diario, semanal y mensual. | Retención: PITR 7 días; diario`
- L292: `| RNF-NFR-048 | Alta disponibilidad de datos: MongoDB replica set de 3 nodos en 3 zonas, `writeConcern: majority`, `read`
- L311: `| RNF-NFR-053 | Cifrado en tránsito interno: conexiones a MongoDB, Redis, almacenamiento de objetos, KMS y proveedores c`
- L319: `| RNF-NFR-056 | (Bóveda y cifrado de campos con cifrado por sobre en MongoDB y clave maestra en AWS KMS detrás de una in`
- L375: `| RNF-NFR-082 | Validación con Zod en servidor de `params`, `query`, `headers` relevantes y `body` de **toda** ruta, con`
- L377: `| RNF-NFR-084 | Inyección NoSQL: Mongoose con `sanitizeFilter: true` y `strictQuery: true`; rechazo de claves que empiez`
- L405: `| RNF-NFR-097 | Endurecimiento de datos: MongoDB con autenticación, TLS, auditoría de la base habilitada si el servicio `
- L464: `| RNF-NFR-238 | Defensa en profundidad del aislamiento: el plugin de tenancy cubre también cada `$lookup`, `$unionWith` `
- L563: `| RNF-NFR-123 | Propagación de contexto W3C Trace Context (`traceparent`, `tracestate`) y `baggage` con `tenantId` desde`
- L567: `| RNF-NFR-127 | Trazas OpenTelemetry con autoinstrumentación de HTTP, Express, MongoDB, ioredis y BullMQ, más spans manu`
- L594: `| RNF-NFR-142 | Pruebas de integración contra **MongoDB 7 real en replica set** (contenedor o binario real; no mocks de `
- L691: `| RNF-NFR-200 | Infraestructura monetaria: `Decimal128` en Mongo y `decimal.js` en `packages/shared/money` como única fo`
- L707: `| RNF-NFR-211 | Transacciones multi-documento (replica set) en toda operación que toque más de un documento económico (f`
- L724: `| RNF-NFR-228 | Tiempo: marcas de tiempo del servidor (no del cliente) para `createdAt`, `recordedAt` y orden de eventos`
- L734: `Todas las colecciones de tenant llevan `tenantId` (ObjectId, obligatorio, primer campo de todo índice compuesto), `creat`
- L745: `| `purposes` | [ObjectId → `processingActivities`] | Sí | Finalidades. |`
- L746: `| `retentionPolicyId` | ObjectId | Sí | Política aplicable; → `retentionPolicies`. |`
- L752: `**`processingActivities`** — registro de tratamientos (RF-NFR-002): `code` (string, único por tenant), `name` (`dict:` c`
- L754: `**`privacyNotices`** — avisos versionados (RF-NFR-003): `channel` (enum `landing`, `registro`, `app`, `presencial`, `emp`
- L756: `**`consentRecords`** — consentimientos y preferencias (RF-NFR-004): `personId` (ObjectId → M01), `userId` (opcional), `p`
- _… y 27 líneas más._

### `docs/especificacion/anexos/T09-COM-comunidad-comunicaciones.md`
- L389: `| RN-COM-014 | Estados de cola de email ProCoop: 1 pendiente → 4 en proceso → 2 enviado / 3 error; si otro hilo tomó un `
- L441: `> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueident`
- L1816: `| `created` → `queued` | Motor | Dentro de ventana y horario; si no, `scheduledFor` diferido | Encolado BullMQ por prior`
- L2197: `7. **Encolado** BullMQ por canal y prioridad (`critical` > `high` > `normal` > `low`); throttling por canal/proveedor/te`
- L2319: `| PAN-COM-34 | `/admin/plataforma/mensajeria` (`meta.platformOnly`; antes `/admin/platform/mensajeria`, alineada a T01 §`
- L2636: `Ver §9.12 (JOB-COM-01 a JOB-COM-24 y JOB-COM-34 a JOB-COM-41; JOB-COM-25 a 33 no se usan para evitar confusión con la nu`
- L2726: `| PRM-COM-066 | `com.messaging.monthlyBudget` | map canal → Decimal128 | tenant | sin tope | Presupuesto mensual por can`
- L2727: `| PRM-COM-067 | `com.messaging.unitCost` | map canal/categoría → Decimal128 | plataforma | según contrato | Costo unitar`
- L2732: `| PRM-COM-072 | `com.campaigns.approvalCostThreshold` | Decimal128 ARS | tenant | 50.000,00 | Costo estimado que exige a`
- L3230: `| RN-10 §12/§12.1 (Agente: despacho de mails) | JOB-COM (BullMQ) — `Reemplazado por` §9.12 |`

### `docs/especificacion/anexos/T10-BIA-reportes-bi-apis.md`
- L8: `| Olas | **O1**: motor de reportes, catálogo, ejecución síncrona/asíncrona, exportación XLSX/CSV/PDF con BullMQ y descar`
- L22: `1. Un **motor de reportes** con catálogo, parámetros tipados, filtros, permisos por capability y alcance de datos, ejecu`
- L217: `| RF-BIA-022 | Exportación asíncrona en worker BullMQ (`bia:generar-exportacion`) cuando supera `PRM-BIA-005` filas; arc`
- L364: `> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueident`
- L2053: `- Identificadores: `id` opaco (ObjectId) + código de negocio (`accountNumber`, `invoiceNumber` con PV y letra); nunca ID`
- L2241: `| PRM-BIA-032 | `bia.reads.maxStalenessSeconds` | integer (≥ 90, mínimo de MongoDB) | plataforma | 90 | `maxStalenessSec`
- L3271: `- **Contexto:** BASE §97.8 exige que BI no afecte facturación ni atención; DEC-001/DEC-004 fijan MongoDB y despliegue ag`
- L3273: `- A) Base lógica `<db>_analytics` leída desde un miembro oculto del replica set con etiqueta `analytics` (prioridad 0) *`
- L3274: `- B) Cluster MongoDB separado dedicado a analítica — más aislamiento, mayor costo y operación.`

### `docs/especificacion/anexos/T11-WFL-workflow-eventos-documentos.md`
- L23: `2. **Ejecutar procesos masivos y programados** como jobs BullMQ. T11 aporta el catálogo consolidado de jobs (`JOB-`), la`
- L61: `| Relay del outbox, colecciones `outboxEvents`, `inboxReceipts` y `deadLetters`, colas BullMQ, `jobRuns`, scheduler líde`
- L99: `| Job | Proceso asíncrono `<mod>:<proceso>` que corre en un worker BullMQ, es idempotente, reanudable y registra su prog`
- L296: `| RF-WFL-090 | Diseñador de formularios versionados con tipos de campo: texto corto, texto largo, número entero, número `
- L538: `> **Barrido C-05 (DEC-111).** En las tablas de este capítulo los tipos objetivo son **Azure SQL** (columnas `uniqueident`
- L2167: `| `tenantId` | ObjectId | Siempre; `PLATFORM` para eventos de plataforma. |`
- L3434: `- JOB-POR-08 se resuelve con un índice TTL de MongoDB: no encola ni tiene `jobDefinitions`; se conserva en el catálogo s`
- L3870: `| JOB-POR-08 | `por:purgar-intentos-vinculacion` | TTL de MongoDB (no encola) | — |`
- L4732: `| CTR-WFL-08 | ProCoop (servicio de Windows, `setInterval`, Azure Queue Storage para ARCA) vs DEC-006 (BullMQ + Redis) |`
- L4741: `| CTR-WFL-17 | AGR-016 (bus "agnóstico del transporte") vs DEC-003/DEC-006 (outbox + BullMQ) | Neutralidad tecnológica. `
- L5070: `- T01: outbox, colas BullMQ, almacenamiento S3 y antivirus.`

### `docs/especificacion/anexos/T12-SRV-fichas-verticales-servicios-parte2.md`
- L32: `5. Convenciones transversales que no se repiten en cada ficha: `tenantId` en todo documento y primero en índices, tenant`
