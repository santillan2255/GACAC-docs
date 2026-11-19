# 07b — Catálogo de tablas SQL (trazado desde T05)

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Fecha | 19-11-2026 |
| Estado | Capa **A** inventario; tipos/CREATE en capas B y C (ver abajo) |
| Regenerar | `python docs/especificacion/_trabajo/generate_07_catalog_from_t05.py` |

> **Lectura (tres capas, DEC-117).** Este archivo es solo **inventario** (esquema, nombre, PK sugerida, tenant, dueño). **No incluye tipos ni `CREATE TABLE`** — serían más de 100k líneas si se repiten 1.058 veces.

| Capa | Dónde |
|---|---|
| **A** | Este catálogo |
| **B** — tipos, FK, índices (legible) | [`07-modelo-relacional-azure-sql.md`](07-modelo-relacional-azure-sql.md) §2.x |
| **C** — SQL ejecutable | [`07-ddl/README.md`](07-ddl/README.md) → `07-ddl/sql/<esquema>/` |

| Métrica | Valor |
|---|---|
| Filas COL-* en T05 | 1109 |
| Tablas a crear (no `A→`) | 1058 |
| Absorbidas (`A→`, no tabla propia) | 51 |
| Con capa B (columnas en `07` §2) | 61 |
| Con capa C (script `.sql`) | (ver columna por tabla) |

## Convención de nombres

| Lógico (T05) | SQL |
|---|---|
| `camelCase` plural | `Esquema.NombrePascal` (mismo término en inglés) |
| PK | `{EntitySingular}Id` `uniqueidentifier` salvo excepción en anexo |
| Multitenancy | `TenantId` cuando alcance T05 = `T` o `T+P` |

## Índice por esquema

| Esquema | Tablas |
|---|---|
| `bia` | 69 |
| `cat` | 29 |
| `cfg` | 55 |
| `cmp` | 23 |
| `cob` | 47 |
| `com` | 56 |
| `con` | 39 |
| `crm` | 42 |
| `fac` | 42 |
| `fis` | 48 |
| `iam` | 31 |
| `ins` | 36 |
| `int` | 18 |
| `med` | 37 |
| `mig` | 20 |
| `mor` | 39 |
| `nfr` | 23 |
| `per` | 21 |
| `pla` | 32 |
| `por` | 14 |
| `soc` | 53 |
| `stk` | 40 |
| `sue` | 61 |
| `tar` | 36 |
| `tec` | 76 |
| `tes` | 43 |
| `uxd` | 11 |
| `ven` | 15 |
| `wfl` | 53 |

---

## Esquema `pla`

DDL columnas (capa B): **`07-modelo-relacional-azure-sql.md` §2.0**. Scripts T-SQL (capa C): carpeta **`07-ddl/sql/pla/`**.

### `pla.Tenants`

| Campo | Valor |
|---|---|
| ID T05 | COL-PLA-01 |
| Colección lógica | `tenants` |
| Dueño | T01 |
| Propósito (resumen) | Registro del tenant, ciclo de vida, dominios, zona horaria |
| `TenantId` | No (global) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `TenantId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.0](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/pla/001-pla.Tenants.sql` | |

### `pla.ModuleCatalog`

| Campo | Valor |
|---|---|
| ID T05 | COL-PLA-02 |
| Colección lógica | `moduleCatalog` |
| Dueño | T01 |
| Propósito (resumen) | Módulos y capabilities licenciables |
| `TenantId` | No (global) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `ModuleCatalogId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.0](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/pla/002-pla.ModuleCatalog.sql` | |

### `pla.PlatformPlans`

| Campo | Valor |
|---|---|
| ID T05 | COL-PLA-03 |
| Colección lógica | `platformPlans` |
| Dueño | T01 |
| Propósito (resumen) | Packs y complementos comerciales (DEC-065) |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `PlatformPlanId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.0](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/pla/003-pla.PlatformPlans.sql` | |

### `pla.TenantLicenses`

| Campo | Valor |
|---|---|
| ID T05 | COL-PLA-04 |
| Colección lógica | `tenantLicenses` |
| Dueño | T01 |
| Propósito (resumen) | Licencia vigente y cupos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `TenantLicensId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.0](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/pla/004-pla.TenantLicenses.sql` | |

### `pla.TenantModuleActivations`

| Campo | Valor |
|---|---|
| ID T05 | COL-PLA-05 |
| Colección lógica | `tenantModuleActivations` |
| Dueño | T01 |
| Propósito (resumen) | Activación de módulos por tenant |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `TenantModuleActivationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.0](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/pla/005-pla.TenantModuleActivations.sql` | |

### `pla.TenantChecklists`

| Campo | Valor |
|---|---|
| ID T05 | COL-PLA-06 |
| Colección lógica | `tenantChecklists` |
| Dueño | T01 |
| Propósito (resumen) | Lista de puesta en marcha |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `TenantChecklistId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.0](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/pla/006-pla.TenantChecklists.sql` | |

### `pla.OnboardingDrafts`

| Campo | Valor |
|---|---|
| ID T05 | COL-PLA-07 |
| Colección lógica | `onboardingDrafts` |
| Dueño | T01 |
| Propósito (resumen) | Alta asistida antes de crear el tenant |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `OnboardingDraftId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.0](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/pla/007-pla.OnboardingDrafts.sql` | |

### `pla.SaasContracts`

| Campo | Valor |
|---|---|
| ID T05 | COL-PLA-08 |
| Colección lógica | `saasContracts` |
| Dueño | T01 |
| Propósito (resumen) | Contrato SaaS GoodApps–cooperativa |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `SaasContractId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.0](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/pla/008-pla.SaasContracts.sql` | |

### `pla.UsageSnapshots`

| Campo | Valor |
|---|---|
| ID T05 | COL-PLA-09 |
| Colección lógica | `usageSnapshots` |
| Dueño | T01 |
| Propósito (resumen) | Consumo por tenant y período (cupos, facturación SaaS) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `UsageSnapshotId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.0](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/pla/009-pla.UsageSnapshots.sql` | |

### `pla.SupportCases`

| Campo | Valor |
|---|---|
| ID T05 | COL-PLA-10 |
| Colección lógica | `supportCases` |
| Dueño | T01 |
| Propósito (resumen) | Casos de soporte del tenant |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `SupportCasId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.0](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/pla/010-pla.SupportCases.sql` | |

### `pla.SupportCaseMessages`

| Campo | Valor |
|---|---|
| ID T05 | COL-PLA-11 |
| Colección lógica | `supportCaseMessages` |
| Dueño | T01 |
| Propósito (resumen) | Mensajes del caso |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `SupportCaseMessageId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.0](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/pla/011-pla.SupportCaseMessages.sql` | |

### ~~`pla.SupportAccessGrants`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-PLA-12 |
| Colección lógica | `supportAccessGrants` |
| Dueño | T01 |
| Propósito (resumen) | (duplicada con T02) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | A→COL-IAM-20 |
| SQL | No crear; ver `A→COL-IAM-20` |
| **Capa B:** canónica T02 — [`iam.SupportAccessGrants`](07-catalogo-tablas-sql.md) (§2.2) | |
| **Capa C:** pendiente | |

### `pla.SupportSessions`

| Campo | Valor |
|---|---|
| ID T05 | COL-PLA-13 |
| Colección lógica | `supportSessions` |
| Dueño | T01 |
| Propósito (resumen) | Sesiones de soporte con acceso temporal |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `SupportSessionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.0](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/pla/012-pla.SupportSessions.sql` | |

### `pla.PlatformIncidents`

| Campo | Valor |
|---|---|
| ID T05 | COL-PLA-14 |
| Colección lógica | `platformIncidents` |
| Dueño | T01 |
| Propósito (resumen) | Incidentes operativos de plataforma |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `PlatformIncidentId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.0](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/pla/013-pla.PlatformIncidents.sql` | |

### `pla.AlertRules`

| Campo | Valor |
|---|---|
| ID T05 | COL-PLA-15 |
| Colección lógica | `alertRules` |
| Dueño | T01 |
| Propósito (resumen) | Reglas de alerta operativas y de SLO |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `AlertRuleId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.0](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/pla/014-pla.AlertRules.sql` | |

### `pla.Alerts`

| Campo | Valor |
|---|---|
| ID T05 | COL-PLA-16 |
| Colección lógica | `alerts` |
| Dueño | T01 |
| Propósito (resumen) | Alertas disparadas (absorbe `alertEvents` de T08) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `AlertId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.0](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/pla/015-pla.Alerts.sql` | |

### `pla.BackupPolicies`

| Campo | Valor |
|---|---|
| ID T05 | COL-PLA-17 |
| Colección lógica | `backupPolicies` |
| Dueño | T01 |
| Propósito (resumen) | Políticas de respaldo |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `BackupPolicyId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.0](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/pla/016-pla.BackupPolicies.sql` | |

### `pla.BackupRuns`

| Campo | Valor |
|---|---|
| ID T05 | COL-PLA-18 |
| Colección lógica | `backupRuns` |
| Dueño | T01 |
| Propósito (resumen) | Ejecuciones de respaldo y PITR |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `BackupRunId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.0](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/pla/017-pla.BackupRuns.sql` | |

### `pla.RestoreRequests`

| Campo | Valor |
|---|---|
| ID T05 | COL-PLA-19 |
| Colección lógica | `restoreRequests` |
| Dueño | T01 |
| Propósito (resumen) | Pedidos de restauración por tenant |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `RestoreRequestId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.0](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/pla/018-pla.RestoreRequests.sql` | |

### `pla.RestoreTests`

| Campo | Valor |
|---|---|
| ID T05 | COL-PLA-20 |
| Colección lógica | `restoreTests` |
| Dueño | T01 |
| Propósito (resumen) | Simulacros de restauración (absorbe `restoreDrills` de T08) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `RestoreTestId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.0](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/pla/019-pla.RestoreTests.sql` | |

### `pla.TenantExports`

| Campo | Valor |
|---|---|
| ID T05 | COL-PLA-21 |
| Colección lógica | `tenantExports` |
| Dueño | T01 |
| Propósito (resumen) | Exportaciones completas del tenant |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `TenantExportId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.0](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/pla/020-pla.TenantExports.sql` | |

### `pla.Releases`

| Campo | Valor |
|---|---|
| ID T05 | COL-PLA-22 |
| Colección lógica | `releases` |
| Dueño | T01 |
| Propósito (resumen) | Versiones desplegadas y notas |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `ReleasId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.0](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/pla/021-pla.Releases.sql` | |

### `pla.FeatureFlags`

| Campo | Valor |
|---|---|
| ID T05 | COL-PLA-23 |
| Colección lógica | `featureFlags` |
| Dueño | T01 |
| Propósito (resumen) | Banderas funcionales y de UI (absorbe `uiFeatureFlags` de T03) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `FeatureFlagId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.0](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/pla/022-pla.FeatureFlags.sql` | |

### `pla.OutboxEvents`

| Campo | Valor |
|---|---|
| ID T05 | COL-PLA-24 |
| Colección lógica | `outboxEvents` |
| Dueño | T01 |
| Propósito (resumen) | Outbox transaccional; TTL tras publicar |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `OutboxEventId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.0](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/pla/024-pla.OutboxEvents.sql` | |

### `pla.InboxReceipts`

| Campo | Valor |
|---|---|
| ID T05 | COL-PLA-25 |
| Colección lógica | `inboxReceipts` |
| Dueño | T01 |
| Propósito (resumen) | Recepciones idempotentes de consumidores; TTL (absorbe `processedEvents` de T08) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `InboxReceiptId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.0](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/pla/025-pla.InboxReceipts.sql` | |

### `pla.DeadLetters`

| Campo | Valor |
|---|---|
| ID T05 | COL-PLA-26 |
| Colección lógica | `deadLetters` |
| Dueño | T01 |
| Propósito (resumen) | Mensajes fallidos para reproceso |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `DeadLetterId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.0](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/pla/026-pla.DeadLetters.sql` | |

### `pla.JobRuns`

| Campo | Valor |
|---|---|
| ID T05 | COL-PLA-27 |
| Colección lógica | `jobRuns` |
| Dueño | T01 |
| Propósito (resumen) | Ejecuciones de jobs BullMQ; TTL |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `JobRunId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.0](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/pla/027-pla.JobRuns.sql` | |

### `pla.IdempotencyKeys`

| Campo | Valor |
|---|---|
| ID T05 | COL-PLA-28 |
| Colección lógica | `idempotencyKeys` |
| Dueño | T01 |
| Propósito (resumen) | Claves de idempotencia de API; TTL (absorbe la de T08) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `IdempotencyKeyId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.0](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/pla/028-pla.IdempotencyKeys.sql` | |

### `pla.StoredFiles`

| Campo | Valor |
|---|---|
| ID T05 | COL-PLA-29 |
| Colección lógica | `storedFiles` |
| Dueño | T01 |
| Propósito (resumen) | Metadatos de binarios en almacenamiento privado |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `StoredFileId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.0](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/pla/029-pla.StoredFiles.sql` | |

### `pla.AiUsage`

| Campo | Valor |
|---|---|
| ID T05 | COL-PLA-30 |
| Colección lógica | `aiUsage` |
| Dueño | T01 |
| Propósito (resumen) | Consumo agregado de IA por tenant y período (cupo) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `AiUsageId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.0](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/pla/030-pla.AiUsage.sql` | |

### `pla.HealthSnapshots`

| Campo | Valor |
|---|---|
| ID T05 | COL-PLA-31 |
| Colección lógica | `healthSnapshots` |
| Dueño | T01 |
| Propósito (resumen) | Fotos de salud de servicios; TTL |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `HealthSnapshotId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.0](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/pla/031-pla.HealthSnapshots.sql` | |

### `pla.SchemaMigrations`

| Campo | Valor |
|---|---|
| ID T05 | COL-PLA-32 |
| Colección lógica | `schemaMigrations` |
| Dueño | T01 |
| Propósito (resumen) | Registro de migraciones de esquema (§7.1.14); declarada en T01 §7.11.28 (antes `N`, propuesta de T05) |
| `TenantId` | No (global) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `SchemaMigrationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.0](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/pla/032-pla.SchemaMigrations.sql` | |

## Esquema `iam`

### `iam.Identities`

| Campo | Valor |
|---|---|
| ID T05 | COL-IAM-01 |
| Colección lógica | `identities` |
| Dueño | T02 |
| Propósito (resumen) | Identidad de inicio de sesión (persona humana) |
| `TenantId` | No (global) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `IdentityId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.2](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/iam/0001-iam.Identities.sql` | |

### `iam.AuthFactors`

| Campo | Valor |
|---|---|
| ID T05 | COL-IAM-02 |
| Colección lógica | `authFactors` |
| Dueño | T02 |
| Propósito (resumen) | Factores de autenticación (contraseña hash, TOTP, passkey) |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `AuthFactorId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.2](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/iam/0002-iam.AuthFactors.sql` | |

### `iam.FederatedLinks`

| Campo | Valor |
|---|---|
| ID T05 | COL-IAM-03 |
| Colección lógica | `federatedLinks` |
| Dueño | T02 |
| Propósito (resumen) | Vínculos Google/OIDC/CiDi |
| `TenantId` | No (global) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `FederatedLinkId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.2](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/iam/0003-iam.FederatedLinks.sql` | |

### `iam.Memberships`

| Campo | Valor |
|---|---|
| ID T05 | COL-IAM-04 |
| Colección lógica | `memberships` |
| Dueño | T02 |
| Propósito (resumen) | Identidad dentro del tenant (staff, socio, empleado, proveedor) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `MembershipId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.2](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/iam/0004-iam.Memberships.sql` | |

### `iam.Roles`

| Campo | Valor |
|---|---|
| ID T05 | COL-IAM-05 |
| Colección lógica | `roles` |
| Dueño | T02 |
| Propósito (resumen) | Roles con capabilities |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `RoleId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.2](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/iam/0005-iam.Roles.sql` | |

### `iam.ScreenProfiles`

| Campo | Valor |
|---|---|
| ID T05 | COL-IAM-06 |
| Colección lógica | `screenProfiles` |
| Dueño | T02 |
| Propósito (resumen) | Perfiles de pantalla |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `ScreenProfileId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.2](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/iam/0006-iam.ScreenProfiles.sql` | |

### `iam.RoleAssignments`

| Campo | Valor |
|---|---|
| ID T05 | COL-IAM-07 |
| Colección lógica | `roleAssignments` |
| Dueño | T02 |
| Propósito (resumen) | Rol asignado con alcance de datos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `RoleAssignmentId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.2](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/iam/0007-iam.RoleAssignments.sql` | |

### `iam.ProfileAssignments`

| Campo | Valor |
|---|---|
| ID T05 | COL-IAM-08 |
| Colección lógica | `profileAssignments` |
| Dueño | T02 |
| Propósito (resumen) | Perfil de pantalla asignado |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `ProfileAssignmentId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.2](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/iam/0008-iam.ProfileAssignments.sql` | |

### `iam.CapabilityCatalog`

| Campo | Valor |
|---|---|
| ID T05 | COL-IAM-09 |
| Colección lógica | `capabilityCatalog` |
| Dueño | T02 |
| Propósito (resumen) | Catálogo `cod.recurso.accion` |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `CapabilityCatalogId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.2](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/iam/0009-iam.CapabilityCatalog.sql` | |

### `iam.ScreenCatalog`

| Campo | Valor |
|---|---|
| ID T05 | COL-IAM-10 |
| Colección lógica | `screenCatalog` |
| Dueño | T02 |
| Propósito (resumen) | Pantallas y rutas |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `ScreenCatalogId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.2](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/iam/0010-iam.ScreenCatalog.sql` | |

### `iam.SodRules`

| Campo | Valor |
|---|---|
| ID T05 | COL-IAM-11 |
| Colección lógica | `sodRules` |
| Dueño | T02 |
| Propósito (resumen) | Reglas de separación de funciones |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `SodRuleId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.2](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/iam/0011-iam.SodRules.sql` | |

### `iam.SodExceptions`

| Campo | Valor |
|---|---|
| ID T05 | COL-IAM-12 |
| Colección lógica | `sodExceptions` |
| Dueño | T02 |
| Propósito (resumen) | Excepciones aprobadas a SoD |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `SodExceptionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.2](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/iam/0012-iam.SodExceptions.sql` | |

### `iam.Sessions`

| Campo | Valor |
|---|---|
| ID T05 | COL-IAM-13 |
| Colección lógica | `sessions` |
| Dueño | T02 |
| Propósito (resumen) | Sesiones y refresh rotativo; TTL |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `SessionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.2](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/iam/0013-iam.Sessions.sql` | |

### `iam.AuthTransactions`

| Campo | Valor |
|---|---|
| ID T05 | COL-IAM-14 |
| Colección lógica | `authTransactions` |
| Dueño | T02 |
| Propósito (resumen) | Transacciones de pre-login y login; TTL |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `AuthTransactionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.2](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/iam/0014-iam.AuthTransactions.sql` | |

### `iam.TrustedDevices`

| Campo | Valor |
|---|---|
| ID T05 | COL-IAM-15 |
| Colección lógica | `trustedDevices` |
| Dueño | T02 |
| Propósito (resumen) | Dispositivos de confianza |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `TrustedDeviceId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.2](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/iam/0015-iam.TrustedDevices.sql` | |

### `iam.OtpChallenges`

| Campo | Valor |
|---|---|
| ID T05 | COL-IAM-16 |
| Colección lógica | `otpChallenges` |
| Dueño | T02 |
| Propósito (resumen) | Desafíos OTP; TTL |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `OtpChallengeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.2](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/iam/0016-iam.OtpChallenges.sql` | |

### `iam.ActionTokens`

| Campo | Valor |
|---|---|
| ID T05 | COL-IAM-17 |
| Colección lógica | `actionTokens` |
| Dueño | T02 |
| Propósito (resumen) | Tokens de acción (recuperación, invitación); TTL |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `ActionTokenId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.2](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/iam/0017-iam.ActionTokens.sql` | |

### `iam.EditPresence`

| Campo | Valor |
|---|---|
| ID T05 | COL-IAM-18 |
| Colección lógica | `editPresence` |
| Dueño | T02 |
| Propósito (resumen) | Presencia de edición concurrente; TTL |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `EditPresenceId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.2](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/iam/0018-iam.EditPresence.sql` | |

### `iam.AuthorizationRequests`

| Campo | Valor |
|---|---|
| ID T05 | COL-IAM-19 |
| Colección lógica | `authorizationRequests` |
| Dueño | T02 |
| Propósito (resumen) | Autorizaciones de supervisor en línea |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `AuthorizationRequestId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.2](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/iam/0019-iam.AuthorizationRequests.sql` | |

### `iam.SupportAccessGrants`

| Campo | Valor |
|---|---|
| ID T05 | COL-IAM-20 |
| Colección lógica | `supportAccessGrants` |
| Dueño | T02 |
| Propósito (resumen) | Concesión de acceso temporal de soporte (canónica) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `SupportAccessGrantId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.2](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/iam/0020-iam.SupportAccessGrants.sql` | |

### `iam.IdentityProviderConfigs`

| Campo | Valor |
|---|---|
| ID T05 | COL-IAM-21 |
| Colección lógica | `identityProviderConfigs` |
| Dueño | T02 |
| Propósito (resumen) | Configuración SSO/OIDC/CiDi |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `IdentityProviderConfigId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.2](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/iam/0021-iam.IdentityProviderConfigs.sql` | |

### `iam.ApiClients`

| Campo | Valor |
|---|---|
| ID T05 | COL-IAM-22 |
| Colección lógica | `apiClients` |
| Dueño | T02 |
| Propósito (resumen) | Clientes API de terceros (canónica; absorbe T10) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `ApiClientId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.2](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/iam/0022-iam.ApiClients.sql` | |

### `iam.ApiCredentials`

| Campo | Valor |
|---|---|
| ID T05 | COL-IAM-23 |
| Colección lógica | `apiCredentials` |
| Dueño | T02 |
| Propósito (resumen) | Credenciales hash de clientes API (canónica; absorbe T10) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `ApiCredentialId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.2](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/iam/0023-iam.ApiCredentials.sql` | |

### `iam.AuditLogs`

| Campo | Valor |
|---|---|
| ID T05 | COL-IAM-24 |
| Colección lógica | `auditLogs` |
| Dueño | T02 |
| Propósito (resumen) | Auditoría de cambios |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `AuditLogId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.2](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/iam/0024-iam.AuditLogs.sql` | |

### `iam.AuditAccess`

| Campo | Valor |
|---|---|
| ID T05 | COL-IAM-25 |
| Colección lógica | `auditAccess` |
| Dueño | T02 |
| Propósito (resumen) | Auditoría de accesos y operaciones cruzadas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `AuditAccesId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.2](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/iam/0025-iam.AuditAccess.sql` | |

### `iam.AuditReads`

| Campo | Valor |
|---|---|
| ID T05 | COL-IAM-26 |
| Colección lógica | `auditReads` |
| Dueño | T02 |
| Propósito (resumen) | Lecturas de datos sensibles |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `AuditReadId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.2](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/iam/0026-iam.AuditReads.sql` | |

### `iam.AuditMessages`

| Campo | Valor |
|---|---|
| ID T05 | COL-IAM-27 |
| Colección lógica | `auditMessages` |
| Dueño | T02 |
| Propósito (resumen) | Auditoría de mensajes enviados |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `AuditMessageId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.2](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/iam/0027-iam.AuditMessages.sql` | |

### `iam.AuditAi`

| Campo | Valor |
|---|---|
| ID T05 | COL-IAM-28 |
| Colección lógica | `auditAi` |
| Dueño | T02 |
| Propósito (resumen) | Auditoría de acciones asistidas por IA |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `AuditAiId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.2](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/iam/0028-iam.AuditAi.sql` | |

### `iam.LegacyAuditRecords`

| Campo | Valor |
|---|---|
| ID T05 | COL-IAM-29 |
| Colección lógica | `legacyAuditRecords` |
| Dueño | T02 |
| Propósito (resumen) | Auditoría ProCoop migrada solo lectura |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `LegacyAuditRecordId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.2](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/iam/0029-iam.LegacyAuditRecords.sql` | |

### `iam.AccessReviews`

| Campo | Valor |
|---|---|
| ID T05 | COL-IAM-30 |
| Colección lógica | `accessReviews` |
| Dueño | T02 |
| Propósito (resumen) | Recertificación de accesos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `AccessReviewId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.2](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/iam/0030-iam.AccessReviews.sql` | |

### `iam.SecurityAlerts`

| Campo | Valor |
|---|---|
| ID T05 | COL-IAM-31 |
| Colección lógica | `securityAlerts` |
| Dueño | T02 |
| Propósito (resumen) | Alertas de seguridad de identidad |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `SecurityAlertId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.2](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/iam/0031-iam.SecurityAlerts.sql` | |

## Esquema `per`

### `per.Persons`

| Campo | Valor |
|---|---|
| ID T05 | COL-PER-01 |
| Colección lógica | `persons` |
| Dueño | M01 |
| Propósito (resumen) | Persona humana o jurídica (datos de identidad y contacto). `identificationStatus` (`identified`, `approvedException`, `d |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `PersonId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.1](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/per/0001-per.Persons.sql` | |

### `per.PersonIdentifierIndex`

| Campo | Valor |
|---|---|
| ID T05 | COL-PER-02 |
| Colección lógica | `personIdentifierIndex` |
| Dueño | M01 |
| Propósito (resumen) | Índice auxiliar de unicidad de documentos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `PersonIdentifierIndexId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.1](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/per/0002-per.PersonIdentifierIndex.sql` | |

### `per.PersonSensitiveData`

| Campo | Valor |
|---|---|
| ID T05 | COL-PER-03 |
| Colección lógica | `personSensitiveData` |
| Dueño | M01 |
| Propósito (resumen) | Datos sensibles separados y cifrados (discapacidad, electrodependencia, salud) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `PersonSensitiveDataId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.1](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/per/0003-per.PersonSensitiveData.sql` | |

### `per.Holders`

| Campo | Valor |
|---|---|
| ID T05 | COL-PER-04 |
| Colección lógica | `holders` |
| Dueño | M01 |
| Propósito (resumen) | Titular (rol comercial de la persona). Proyección de lectura `memberships[]` de los vínculos de asociado informados por  |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `HolderId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.1](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/per/0004-per.Holders.sql` | |

### `per.Accounts`

| Campo | Valor |
|---|---|
| ID T05 | COL-PER-05 |
| Colección lógica | `accounts` |
| Dueño | M01 |
| Propósito (resumen) | Cuenta de servicios (agrupa contratos y domicilio postal) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `AccountId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.1](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/per/0005-per.Accounts.sql` | |

### `per.Addresses`

| Campo | Valor |
|---|---|
| ID T05 | COL-PER-06 |
| Colección lógica | `addresses` |
| Dueño | M01 |
| Propósito (resumen) | Domicilios normalizados con `geoReference` |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `AddressId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.1](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/per/0006-per.Addresses.sql` | |

### `per.AddressGeoEvents`

| Campo | Valor |
|---|---|
| ID T05 | COL-PER-07 |
| Colección lógica | `addressGeoEvents` |
| Dueño | M01 |
| Propósito (resumen) | Historia de geocodificación |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `AddressGeoEventId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.1](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/per/0007-per.AddressGeoEvents.sql` | |

### `per.Premises`

| Campo | Valor |
|---|---|
| ID T05 | COL-PER-08 |
| Colección lógica | `premises` |
| Dueño | M01 |
| Propósito (resumen) | Inmuebles (canónica para `properties`) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `PremisId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.1](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/per/0008-per.Premises.sql` | |

### `per.ServicePoints`

| Campo | Valor |
|---|---|
| ID T05 | COL-PER-09 |
| Colección lógica | `servicePoints` |
| Dueño | M01 |
| Propósito (resumen) | Punto de suministro en un inmueble (domicilio de servicio) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `ServicePointId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.1](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/per/0009-per.ServicePoints.sql` | |

### `per.Relationships`

| Campo | Valor |
|---|---|
| ID T05 | COL-PER-10 |
| Colección lógica | `relationships` |
| Dueño | M01 |
| Propósito (resumen) | Vínculos entre personas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `RelationshipId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.1](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/per/0010-per.Relationships.sql` | |

### ~~`per.Adherents`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-PER-11 |
| Colección lógica | `adherents` |
| Dueño | M01 |
| Propósito (resumen) | (adherentes y beneficiarios: DEC-071; `ADHSOC` → COL-SOC-01 y `BENSOC` → COL-SOC-02, DEC-086. **Reemplaza** el destino ú |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-SOC-01 / COL-SOC-02 |
| SQL | No crear; ver `A→COL-SOC-01 / COL-SOC-02` |
| **Capa B:** canónica M18 — [`soc.ServiceDependents`](07-catalogo-tablas-sql.md) / [`soc.ServiceBeneficiaries`](07-catalogo-tablas-sql.md) (§2.21) | |
| **Capa C:** pendiente | |

### `per.Notes`

| Campo | Valor |
|---|---|
| ID T05 | COL-PER-12 |
| Colección lógica | `notes` |
| Dueño | M01 |
| Propósito (resumen) | Notas de cuenta, titular o persona |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `NoteId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.1](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/per/0011-per.Notes.sql` | |

### `per.Blocks`

| Campo | Valor |
|---|---|
| ID T05 | COL-PER-13 |
| Colección lógica | `blocks` |
| Dueño | M01 |
| Propósito (resumen) | Bloqueos de cuenta, titular o contrato con efectos (no facturar, no cobrar, no operar); absorbe `billingHolds` de M05 |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `BlockId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.1](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/per/0012-per.Blocks.sql` | |

### `per.DocumentRequirementTypes`

| Campo | Valor |
|---|---|
| ID T05 | COL-PER-14 |
| Colección lógica | `documentRequirementTypes` |
| Dueño | M01 |
| Propósito (resumen) | Requisitos documentales por trámite |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `DocumentRequirementTypeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.1](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/per/0013-per.DocumentRequirementTypes.sql` | |

### `per.DocumentSubmissions`

| Campo | Valor |
|---|---|
| ID T05 | COL-PER-15 |
| Colección lógica | `documentSubmissions` |
| Dueño | M01 |
| Propósito (resumen) | Documentos presentados por persona |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `DocumentSubmissionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.1](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/per/0014-per.DocumentSubmissions.sql` | |

### `per.Transfers`

| Campo | Valor |
|---|---|
| ID T05 | COL-PER-16 |
| Colección lógica | `transfers` |
| Dueño | M01 |
| Propósito (resumen) | Transferencias de titularidad (no confundir con transferencias de stock) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `TransferId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.1](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/per/0015-per.Transfers.sql` | |

### `per.DuplicateCases`

| Campo | Valor |
|---|---|
| ID T05 | COL-PER-17 |
| Colección lógica | `duplicateCases` |
| Dueño | M01 |
| Propósito (resumen) | Casos de posibles duplicados |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `DuplicateCasId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.1](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/per/0016-per.DuplicateCases.sql` | |

### `per.PerRevisions`

| Campo | Valor |
|---|---|
| ID T05 | COL-PER-18 |
| Colección lógica | `perRevisions` |
| Dueño | M01 |
| Propósito (resumen) | Revisiones versionadas de persona/titular |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `PerRevisionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.1](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/per/0017-per.PerRevisions.sql` | |

### ~~`per.Consents`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-PER-19 |
| Colección lógica | `consents` |
| Dueño | M01 |
| Propósito (resumen) | (duplicada con T08) |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-NFR-04 |
| SQL | No crear; ver `A→COL-NFR-04` |
| **Capa B:** canónica T08 — [`nfr.ConsentRecords`](07-catalogo-tablas-sql.md) (§2.26) | |
| **Capa C:** pendiente | |

### ~~`per.DataSubjectRequests`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-PER-20 |
| Colección lógica | `dataSubjectRequests` |
| Dueño | M01 |
| Propósito (resumen) | (duplicada con T08) |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-NFR-05 |
| SQL | No crear; ver `A→COL-NFR-05` |
| **Capa B:** canónica T08 — [`nfr.DataSubjectRequests`](07-catalogo-tablas-sql.md) (§2.26) | |
| **Capa C:** pendiente | |

### ~~`per.PersonUserLinks`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-PER-21 |
| Colección lógica | `personUserLinks` |
| Dueño | M01 |
| Propósito (resumen) | (vínculo persona–usuario: `memberships.personId` + evidencia) |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-IAM-04 |
| SQL | No crear; ver `A→COL-IAM-04` |
| **Capa B:** canónica T02 — [`iam.Memberships`](07-catalogo-tablas-sql.md) (§2.2, `PersonId`) | |
| **Capa C:** pendiente | |

## Esquema `bia`

### `bia.ReportDefinitions`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-01 |
| Colección lógica | `reportDefinitions` |
| Dueño | T10 |
| Propósito (resumen) | Catálogo de reportes |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `ReportDefinitionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0001-bia.ReportDefinitions.sql` | |

### `bia.ReportPresets`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-02 |
| Colección lógica | `reportPresets` |
| Dueño | T10 |
| Propósito (resumen) | Filtros predefinidos compartidos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `ReportPresetId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0002-bia.ReportPresets.sql` | |

### `bia.SavedViews`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-03 |
| Colección lógica | `savedViews` |
| Dueño | T10 |
| Propósito (resumen) | Vistas guardadas de reportes (canónica en T10; las de grilla van a `dataTableViews`) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `SavedViewId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0003-bia.SavedViews.sql` | |

### `bia.ReportRuns`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-04 |
| Colección lógica | `reportRuns` |
| Dueño | T10 |
| Propósito (resumen) | Ejecuciones; TTL |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `ReportRunId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0004-bia.ReportRuns.sql` | |

### `bia.ReportExports`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-05 |
| Colección lógica | `reportExports` |
| Dueño | T10 |
| Propósito (resumen) | Archivos exportados |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `ReportExportId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0005-bia.ReportExports.sql` | |

### `bia.ReportSchedules`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-06 |
| Colección lógica | `reportSchedules` |
| Dueño | T10 |
| Propósito (resumen) | Programaciones |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `ReportScheduleId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0006-bia.ReportSchedules.sql` | |

### `bia.ReportDeliveries`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-07 |
| Colección lógica | `reportDeliveries` |
| Dueño | T10 |
| Propósito (resumen) | Entregas programadas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `ReportDeliveryId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0007-bia.ReportDeliveries.sql` | |

### `bia.ReportTemplates`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-08 |
| Colección lógica | `reportTemplates` |
| Dueño | T10 |
| Propósito (resumen) | Plantillas de reporte |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `ReportTemplateId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0008-bia.ReportTemplates.sql` | |

### `bia.ExportLayouts`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-09 |
| Colección lógica | `exportLayouts` |
| Dueño | T10 |
| Propósito (resumen) | Diseños de exportación tabular |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `ExportLayoutId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0009-bia.ExportLayouts.sql` | |

### `bia.ReportAccessLogs`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-10 |
| Colección lógica | `reportAccessLogs` |
| Dueño | T10 |
| Propósito (resumen) | Accesos a reportes |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `ReportAccessLogId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0010-bia.ReportAccessLogs.sql` | |

### `bia.IndicatorDefinitions`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-11 |
| Colección lógica | `indicatorDefinitions` |
| Dueño | T10 |
| Propósito (resumen) | Indicadores con fórmula |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `IndicatorDefinitionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0011-bia.IndicatorDefinitions.sql` | |

### `bia.IndicatorSnapshots`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-12 |
| Colección lógica | `indicatorSnapshots` |
| Dueño | T10 |
| Propósito (resumen) | Valores calculados |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `IndicatorSnapshotId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0012-bia.IndicatorSnapshots.sql` | |

### `bia.Dashboards`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-13 |
| Colección lógica | `dashboards` |
| Dueño | T10 |
| Propósito (resumen) | Tableros |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `DashboardId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0013-bia.Dashboards.sql` | |

### `bia.DashboardUserPrefs`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-14 |
| Colección lógica | `dashboardUserPrefs` |
| Dueño | T10 |
| Propósito (resumen) | Preferencias de tablero |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `DashboardUserPrefId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0014-bia.DashboardUserPrefs.sql` | |

### `bia.KpiAlertRules`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-15 |
| Colección lógica | `kpiAlertRules` |
| Dueño | T10 |
| Propósito (resumen) | Alertas sobre indicadores |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `KpiAlertRuleId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0015-bia.KpiAlertRules.sql` | |

### `bia.KpiAlerts`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-16 |
| Colección lógica | `kpiAlerts` |
| Dueño | T10 |
| Propósito (resumen) | Alertas disparadas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `KpiAlertId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0016-bia.KpiAlerts.sql` | |

### `bia.AnalyticsDatasets`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-17 |
| Colección lógica | `analyticsDatasets` |
| Dueño | T10 |
| Propósito (resumen) | Datasets certificados |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `AnalyticsDatasetId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0017-bia.AnalyticsDatasets.sql` | |

### `bia.CustomReports`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-18 |
| Colección lógica | `customReports` |
| Dueño | T10 |
| Propósito (resumen) | Generador de reportes del tenant (MER-013) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `CustomReportId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0018-bia.CustomReports.sql` | |

### `bia.AiQuestions`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-19 |
| Colección lógica | `aiQuestions` |
| Dueño | T10 |
| Propósito (resumen) | Preguntas analíticas a IA |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `AiQuestionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0019-bia.AiQuestions.sql` | |

### ~~`bia.ApiClients`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-20 |
| Colección lógica | `apiClients` |
| Dueño | T10 |
| Propósito (resumen) | (duplicada con T02) |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-IAM-22 |
| SQL | No crear; ver `A→COL-IAM-22` |
| **Capa B:** canónica T02 — [`iam.ApiClients`](07-catalogo-tablas-sql.md) (§2.2) | |
| **Capa C:** pendiente | |

### ~~`bia.ApiCredentials`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-21 |
| Colección lógica | `apiCredentials` |
| Dueño | T10 |
| Propósito (resumen) | (duplicada con T02) |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-IAM-23 |
| SQL | No crear; ver `A→COL-IAM-23` |
| **Capa B:** canónica T02 — [`iam.ApiCredentials`](07-catalogo-tablas-sql.md) (§2.2) | |
| **Capa C:** pendiente | |

### `bia.ApiUsageLogs`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-22 |
| Colección lógica | `apiUsageLogs` |
| Dueño | T10 |
| Propósito (resumen) | Uso de API externa; TTL |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `ApiUsageLogId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0020-bia.ApiUsageLogs.sql` | |

### `bia.ApiUsageDaily`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-23 |
| Colección lógica | `apiUsageDaily` |
| Dueño | T10 |
| Propósito (resumen) | Uso diario agregado |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `ApiUsageDailyId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0021-bia.ApiUsageDaily.sql` | |

### `bia.ExtWebhookSubscriptions`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-24 |
| Colección lógica | `extWebhookSubscriptions` |
| Dueño | T10 |
| Propósito (resumen) | Suscripciones de webhooks salientes |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `ExtWebhookSubscriptionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0022-bia.ExtWebhookSubscriptions.sql` | |

### `bia.ExtWebhookDeliveries`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-25 |
| Colección lógica | `extWebhookDeliveries` |
| Dueño | T10 |
| Propósito (resumen) | Entregas de webhooks; TTL |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `ExtWebhookDeliveryId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0023-bia.ExtWebhookDeliveries.sql` | |

### `bia.ExtBulkExports`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-26 |
| Colección lógica | `extBulkExports` |
| Dueño | T10 |
| Propósito (resumen) | Exportaciones masivas por API |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `ExtBulkExportId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0024-bia.ExtBulkExports.sql` | |

### `bia.OpenDataPublications`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-27 |
| Colección lógica | `openDataPublications` |
| Dueño | T10 |
| Propósito (resumen) | Publicaciones de datos abiertos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `OpenDataPublicationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0025-bia.OpenDataPublications.sql` | |

### `bia.BenchmarkParticipations`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-28 |
| Colección lógica | `benchmarkParticipations` |
| Dueño | T10 |
| Propósito (resumen) | Adhesión al benchmarking anónimo |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `BenchmarkParticipationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0026-bia.BenchmarkParticipations.sql` | |

### `bia.BenchmarkAggregates`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-29 |
| Colección lógica | `benchmarkAggregates` |
| Dueño | T10 |
| Propósito (resumen) | Agregados anónimos entre tenants |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `BenchmarkAggregateId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0027-bia.BenchmarkAggregates.sql` | |

### `bia.ReportRunResults`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-30 |
| Colección lógica | `reportRunResults` |
| Dueño | T10 |
| Propósito (resumen) | Resultados temporales de ejecución (reemplaza `bia_runResults_<tenant>`); TTL |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C (antes `R`) |
| PK sugerida | `ReportRunResultId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0028-bia.ReportRunResults.sql` | |

### `bia.Bi_dim_date`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-31 |
| Colección lógica | `bi_dim_date` |
| Dueño | T10 |
| Propósito (resumen) | Dimensión fecha |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `Bi_dim_dateId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0029-bia.Bi_dim_date.sql` | |

### `bia.Bi_dim_person`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-32 |
| Colección lógica | `bi_dim_person` |
| Dueño | T10 |
| Propósito (resumen) | Dimensión persona (seudonimizada) |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `Bi_dim_personId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0030-bia.Bi_dim_person.sql` | |

### `bia.Bi_dim_account`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-33 |
| Colección lógica | `bi_dim_account` |
| Dueño | T10 |
| Propósito (resumen) | Dimensión cuenta |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `Bi_dim_accountId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0031-bia.Bi_dim_account.sql` | |

### `bia.Bi_dim_contract`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-34 |
| Colección lógica | `bi_dim_contract` |
| Dueño | T10 |
| Propósito (resumen) | Dimensión contrato |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `Bi_dim_contractId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0032-bia.Bi_dim_contract.sql` | |

### `bia.Bi_dim_service`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-35 |
| Colección lógica | `bi_dim_service` |
| Dueño | T10 |
| Propósito (resumen) | Dimensión servicio |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `Bi_dim_serviceId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0033-bia.Bi_dim_service.sql` | |

### `bia.Bi_dim_category`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-36 |
| Colección lógica | `bi_dim_category` |
| Dueño | T10 |
| Propósito (resumen) | Dimensión categoría |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `Bi_dim_categoryId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0034-bia.Bi_dim_category.sql` | |

### `bia.Bi_dim_plan`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-37 |
| Colección lógica | `bi_dim_plan` |
| Dueño | T10 |
| Propósito (resumen) | Dimensión plan |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `Bi_dim_planId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0035-bia.Bi_dim_plan.sql` | |

### `bia.Bi_dim_product`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-38 |
| Colección lógica | `bi_dim_product` |
| Dueño | T10 |
| Propósito (resumen) | Dimensión producto |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `Bi_dim_productId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0036-bia.Bi_dim_product.sql` | |

### `bia.Bi_dim_concept`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-39 |
| Colección lógica | `bi_dim_concept` |
| Dueño | T10 |
| Propósito (resumen) | Dimensión concepto |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `Bi_dim_conceptId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0037-bia.Bi_dim_concept.sql` | |

### `bia.Bi_dim_channel`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-40 |
| Colección lógica | `bi_dim_channel` |
| Dueño | T10 |
| Propósito (resumen) | Dimensión canal |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `Bi_dim_channelId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0038-bia.Bi_dim_channel.sql` | |

### `bia.Bi_dim_cashbox`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-41 |
| Colección lógica | `bi_dim_cashbox` |
| Dueño | T10 |
| Propósito (resumen) | Dimensión caja |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `Bi_dim_cashboxId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0039-bia.Bi_dim_cashbox.sql` | |

### `bia.Bi_dim_crew`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-42 |
| Colección lógica | `bi_dim_crew` |
| Dueño | T10 |
| Propósito (resumen) | Dimensión cuadrilla |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `Bi_dim_crewId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0040-bia.Bi_dim_crew.sql` | |

### `bia.Bi_dim_supplier`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-43 |
| Colección lógica | `bi_dim_supplier` |
| Dueño | T10 |
| Propósito (resumen) | Dimensión proveedor |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `Bi_dim_supplierId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0041-bia.Bi_dim_supplier.sql` | |

### `bia.Bi_dim_glAccount`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-44 |
| Colección lógica | `bi_dim_glAccount` |
| Dueño | T10 |
| Propósito (resumen) | Dimensión cuenta contable |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `Bi_dim_glAccountId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0042-bia.Bi_dim_glAccount.sql` | |

### `bia.Bi_dim_costCenter`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-45 |
| Colección lógica | `bi_dim_costCenter` |
| Dueño | T10 |
| Propósito (resumen) | Dimensión centro de costo |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `Bi_dim_costCenterId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0043-bia.Bi_dim_costCenter.sql` | |

### `bia.Bi_dim_employee`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-46 |
| Colección lógica | `bi_dim_employee` |
| Dueño | T10 |
| Propósito (resumen) | Dimensión empleado (seudonimizada) |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `Bi_dim_employeeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0044-bia.Bi_dim_employee.sql` | |

### `bia.Bi_dim_branch`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-47 |
| Colección lógica | `bi_dim_branch` |
| Dueño | T10 |
| Propósito (resumen) | Dimensión sucursal |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `Bi_dim_branchId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0045-bia.Bi_dim_branch.sql` | |

### `bia.Bi_dim_zone`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-48 |
| Colección lógica | `bi_dim_zone` |
| Dueño | T10 |
| Propósito (resumen) | Dimensión zona |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `Bi_dim_zoneId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0046-bia.Bi_dim_zone.sql` | |

### `bia.Bi_fact_invoice`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-49 |
| Colección lógica | `bi_fact_invoice` |
| Dueño | T10 |
| Propósito (resumen) | Hecho factura |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `Bi_fact_invoiceId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0047-bia.Bi_fact_invoice.sql` | |

### `bia.Bi_fact_invoiceLine`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-50 |
| Colección lógica | `bi_fact_invoiceLine` |
| Dueño | T10 |
| Propósito (resumen) | Hecho renglón de factura |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `Bi_fact_invoiceLineId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0048-bia.Bi_fact_invoiceLine.sql` | |

### `bia.Bi_fact_payment`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-51 |
| Colección lógica | `bi_fact_payment` |
| Dueño | T10 |
| Propósito (resumen) | Hecho cobro |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `Bi_fact_paymentId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0049-bia.Bi_fact_payment.sql` | |

### `bia.Bi_fact_allocation`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-52 |
| Colección lógica | `bi_fact_allocation` |
| Dueño | T10 |
| Propósito (resumen) | Hecho imputación |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `Bi_fact_allocationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0050-bia.Bi_fact_allocation.sql` | |

### `bia.Bi_fact_ledgerEntry`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-53 |
| Colección lógica | `bi_fact_ledgerEntry` |
| Dueño | T10 |
| Propósito (resumen) | Hecho movimiento de cuenta corriente |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `Bi_fact_ledgerEntryId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0051-bia.Bi_fact_ledgerEntry.sql` | |

### `bia.Bi_fact_consumption`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-54 |
| Colección lógica | `bi_fact_consumption` |
| Dueño | T10 |
| Propósito (resumen) | Hecho consumo |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `Bi_fact_consumptionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0052-bia.Bi_fact_consumption.sql` | |

### `bia.Bi_fact_reading`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-55 |
| Colección lógica | `bi_fact_reading` |
| Dueño | T10 |
| Propósito (resumen) | Hecho lectura |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `Bi_fact_readingId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0053-bia.Bi_fact_reading.sql` | |

### `bia.Bi_fact_arrears`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-56 |
| Colección lógica | `bi_fact_arrears` |
| Dueño | T10 |
| Propósito (resumen) | Hecho deuda vencida por corte |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `Bi_fact_arrearId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0054-bia.Bi_fact_arrears.sql` | |

### `bia.Bi_fact_agreement`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-57 |
| Colección lógica | `bi_fact_agreement` |
| Dueño | T10 |
| Propósito (resumen) | Hecho convenio |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `Bi_fact_agreementId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0055-bia.Bi_fact_agreement.sql` | |

### `bia.Bi_fact_ticket`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-58 |
| Colección lógica | `bi_fact_ticket` |
| Dueño | T10 |
| Propósito (resumen) | Hecho caso de atención |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `Bi_fact_ticketId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0056-bia.Bi_fact_ticket.sql` | |

### `bia.Bi_fact_workOrder`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-59 |
| Colección lógica | `bi_fact_workOrder` |
| Dueño | T10 |
| Propósito (resumen) | Hecho orden de trabajo |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `Bi_fact_workOrderId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0057-bia.Bi_fact_workOrder.sql` | |

### `bia.Bi_fact_turn`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-60 |
| Colección lógica | `bi_fact_turn` |
| Dueño | T10 |
| Propósito (resumen) | Hecho turno de turnero |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `Bi_fact_turnId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0058-bia.Bi_fact_turn.sql` | |

### `bia.Bi_fact_stockMovement`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-61 |
| Colección lógica | `bi_fact_stockMovement` |
| Dueño | T10 |
| Propósito (resumen) | Hecho movimiento de stock |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `Bi_fact_stockMovementId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0059-bia.Bi_fact_stockMovement.sql` | |

### `bia.Bi_fact_purchase`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-62 |
| Colección lógica | `bi_fact_purchase` |
| Dueño | T10 |
| Propósito (resumen) | Hecho compra |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `Bi_fact_purchaseId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0060-bia.Bi_fact_purchase.sql` | |

### `bia.Bi_fact_treasury`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-63 |
| Colección lógica | `bi_fact_treasury` |
| Dueño | T10 |
| Propósito (resumen) | Hecho movimiento de tesorería |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `Bi_fact_treasuryId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0061-bia.Bi_fact_treasury.sql` | |

### `bia.Bi_fact_journalLine`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-64 |
| Colección lógica | `bi_fact_journalLine` |
| Dueño | T10 |
| Propósito (resumen) | Hecho línea de asiento |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `Bi_fact_journalLineId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0062-bia.Bi_fact_journalLine.sql` | |

### `bia.Bi_fact_payroll`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-65 |
| Colección lógica | `bi_fact_payroll` |
| Dueño | T10 |
| Propósito (resumen) | Hecho liquidación por empleado y concepto |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `Bi_fact_payrollId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0063-bia.Bi_fact_payroll.sql` | |

### `bia.Bi_fact_member`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-66 |
| Colección lógica | `bi_fact_member` |
| Dueño | T10 |
| Propósito (resumen) | Hecho asociado |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `Bi_fact_memberId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0064-bia.Bi_fact_member.sql` | |

### `bia.Bi_fact_communication`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-67 |
| Colección lógica | `bi_fact_communication` |
| Dueño | T10 |
| Propósito (resumen) | Hecho comunicación |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `Bi_fact_communicationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0065-bia.Bi_fact_communication.sql` | |

### `bia.Bi_fact_apiUsage`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-68 |
| Colección lógica | `bi_fact_apiUsage` |
| Dueño | T10 |
| Propósito (resumen) | Hecho uso de API |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `Bi_fact_apiUsageId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0066-bia.Bi_fact_apiUsage.sql` | |

### `bia.Bi_snap_balance`

| Campo | Valor |
|---|---|
| ID T05 | COL-BIA-69 |
| Colección lógica | `bi_snap_balance` |
| Dueño | T10 |
| Propósito (resumen) | Foto de saldos por corte |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `Bi_snap_balanceId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.28](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/bia/0067-bia.Bi_snap_balance.sql` | |

## Esquema `cat`

### `cat.ServiceCapabilities`

| Campo | Valor |
|---|---|
| ID T05 | COL-CAT-01 |
| Colección lógica | `serviceCapabilities` |
| Dueño | M02 |
| Propósito (resumen) | Capacidades de servicio de plataforma (INT, ELE, AG…) |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `ServiceCapabilityId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.4](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cat/0001-cat.ServiceCapabilities.sql` | |

### `cat.TenantServices`

| Campo | Valor |
|---|---|
| ID T05 | COL-CAT-02 |
| Colección lógica | `tenantServices` |
| Dueño | M02 |
| Propósito (resumen) | Servicio habilitado por el tenant y su perfil; `legalEntityId` obligatorio (entidad que presta y factura, DEC-064, CTR-D |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `TenantServiceId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.4](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cat/0002-cat.TenantServices.sql` | |

### `cat.ServiceConfigVersions`

| Campo | Valor |
|---|---|
| ID T05 | COL-CAT-03 |
| Colección lógica | `serviceConfigVersions` |
| Dueño | M02 |
| Propósito (resumen) | Paquete versionado publicable del servicio |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `ServiceConfigVersionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.4](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cat/0003-cat.ServiceConfigVersions.sql` | |

### `cat.ServiceConcessions`

| Campo | Valor |
|---|---|
| ID T05 | COL-CAT-04 |
| Colección lógica | `serviceConcessions` |
| Dueño | M02 |
| Propósito (resumen) | Concesiones |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `ServiceConcessionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.4](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cat/0004-cat.ServiceConcessions.sql` | |

### `cat.ServiceProducts`

| Campo | Valor |
|---|---|
| ID T05 | COL-CAT-05 |
| Colección lógica | `serviceProducts` |
| Dueño | M02 |
| Propósito (resumen) | Productos y subservicios (faceta comercial) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `ServiceProductId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.4](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cat/0005-cat.ServiceProducts.sql` | |

### `cat.BillableConcepts`

| Campo | Valor |
|---|---|
| ID T05 | COL-CAT-06 |
| Colección lógica | `billableConcepts` |
| Dueño | M02 |
| Propósito (resumen) | Conceptos facturables (sin precio) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `BillableConceptId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.4](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cat/0006-cat.BillableConcepts.sql` | |

### `cat.ServicePlans`

| Campo | Valor |
|---|---|
| ID T05 | COL-CAT-07 |
| Colección lógica | `servicePlans` |
| Dueño | M02 |
| Propósito (resumen) | Planes comerciales |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `ServicePlanId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.4](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cat/0007-cat.ServicePlans.sql` | |

### `cat.ServicePlanVersions`

| Campo | Valor |
|---|---|
| ID T05 | COL-CAT-08 |
| Colección lógica | `servicePlanVersions` |
| Dueño | M02 |
| Propósito (resumen) | Versiones de plan (DEC-012) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `ServicePlanVersionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.4](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cat/0008-cat.ServicePlanVersions.sql` | |

### `cat.ServiceBundles`

| Campo | Valor |
|---|---|
| ID T05 | COL-CAT-09 |
| Colección lógica | `serviceBundles` |
| Dueño | M02 |
| Propósito (resumen) | Paquetes multiservicio |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `ServiceBundleId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.4](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cat/0009-cat.ServiceBundles.sql` | |

### `cat.ServiceCategories`

| Campo | Valor |
|---|---|
| ID T05 | COL-CAT-10 |
| Colección lógica | `serviceCategories` |
| Dueño | M02 |
| Propósito (resumen) | Categorías estructurales |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `ServiceCategoryId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.4](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cat/0010-cat.ServiceCategories.sql` | |

### `cat.ServiceCategoryGroups`

| Campo | Valor |
|---|---|
| ID T05 | COL-CAT-11 |
| Colección lógica | `serviceCategoryGroups` |
| Dueño | M02 |
| Propósito (resumen) | Grupos de categorías |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `ServiceCategoryGroupId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.4](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cat/0011-cat.ServiceCategoryGroups.sql` | |

### `cat.ServiceClasses`

| Campo | Valor |
|---|---|
| ID T05 | COL-CAT-12 |
| Colección lógica | `serviceClasses` |
| Dueño | M02 |
| Propósito (resumen) | Clases de servicio |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `ServiceClassId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.4](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cat/0012-cat.ServiceClasses.sql` | |

### `cat.ServiceProperties`

| Campo | Valor |
|---|---|
| ID T05 | COL-CAT-13 |
| Colección lógica | `serviceProperties` |
| Dueño | M02 |
| Propósito (resumen) | Propiedades del servicio |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `ServicePropertyId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.4](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cat/0013-cat.ServiceProperties.sql` | |

### `cat.ServiceStatuses`

| Campo | Valor |
|---|---|
| ID T05 | COL-CAT-14 |
| Colección lógica | `serviceStatuses` |
| Dueño | M02 |
| Propósito (resumen) | Estados operativos por servicio |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `ServiceStatusId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.4](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cat/0014-cat.ServiceStatuses.sql` | |

### ~~`cat.EventChargeRules`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-CAT-15 |
| Colección lógica | `eventChargeRules` |
| Dueño | M02 |
| Propósito (resumen) | (duplicada con `eventCharges` de M04) |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-TAR-07 |
| SQL | No crear; ver `A→COL-TAR-07` |
| **Capa B:** [`07` §2.4](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** pendiente | |

### ~~`cat.EventChargeWaivers`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-CAT-16 |
| Colección lógica | `eventChargeWaivers` |
| Dueño | M02 |
| Propósito (resumen) | (duplicada con `eventChargeBonuses` de M04) |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-TAR-08 |
| SQL | No crear; ver `A→COL-TAR-08` |
| **Capa B:** [`07` §2.4](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** pendiente | |

### `cat.AutoServiceRules`

| Campo | Valor |
|---|---|
| ID T05 | COL-CAT-17 |
| Colección lógica | `autoServiceRules` |
| Dueño | M02 |
| Propósito (resumen) | Altas automáticas de servicios (DEC-023) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `AutoServiceRuleId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.4](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cat/0015-cat.AutoServiceRules.sql` | |

### `cat.ServiceContracts`

| Campo | Valor |
|---|---|
| ID T05 | COL-CAT-18 |
| Colección lógica | `serviceContracts` |
| Dueño | M02 |
| Propósito (resumen) | Contrato de servicio (DEC-011). `domainAttributes` tipados incluyen AG `meteringRegime[]` con vigencia (HUE-AG-03), ALU  |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `ServiceContractId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.4](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cat/0016-cat.ServiceContracts.sql` | |

### `cat.ServiceContractHistory`

| Campo | Valor |
|---|---|
| ID T05 | COL-CAT-19 |
| Colección lógica | `serviceContractHistory` |
| Dueño | M02 |
| Propósito (resumen) | Historia de eventos del contrato (solo agregado) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `ServiceContractHistoryId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.4](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cat/0017-cat.ServiceContractHistory.sql` | |

### `cat.ContractEquipmentAssignments`

| Campo | Valor |
|---|---|
| ID T05 | COL-CAT-20 |
| Colección lógica | `contractEquipmentAssignments` |
| Dueño | M02 |
| Propósito (resumen) | Equipos asignados al contrato (canónica; absorbe `equipmentAssignments` de M13) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `ContractEquipmentAssignmentId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.4](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cat/0018-cat.ContractEquipmentAssignments.sql` | |

### `cat.ApplianceTypes`

| Campo | Valor |
|---|---|
| ID T05 | COL-CAT-21 |
| Colección lógica | `applianceTypes` |
| Dueño | M02 |
| Propósito (resumen) | Tipos de artefacto |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `ApplianceTypeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.4](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cat/0019-cat.ApplianceTypes.sql` | |

### `cat.ContractDeclaredAppliances`

| Campo | Valor |
|---|---|
| ID T05 | COL-CAT-22 |
| Colección lógica | `contractDeclaredAppliances` |
| Dueño | M02 |
| Propósito (resumen) | Artefactos declarados por contrato (DDJJ): `templateRef` de la plantilla del servicio, `power` + `powerUnit` obligatorio |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `ContractDeclaredApplianceId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.4](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cat/0020-cat.ContractDeclaredAppliances.sql` | |

### ~~`cat.ContractMembers`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-CAT-23 |
| Colección lógica | `contractMembers` |
| Dueño | M02 |
| Propósito (resumen) | (**reemplazada** en M02 por DEC-071 y HUECO-TRV-01: adherentes en COL-SOC-01 y beneficiarios en COL-SOC-02, destino únic |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-SOC-01 / COL-SOC-02 |
| SQL | No crear; ver `A→COL-SOC-01 / COL-SOC-02` |
| **Capa B:** [`07` §2.4](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** pendiente | |

### ~~`cat.GenerationAgreements`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-CAT-24 |
| Colección lógica | `generationAgreements` |
| Dueño | M02 |
| Propósito (resumen) | (duplicada con `distributedGenerationContracts` de M03) |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-MED-35 |
| SQL | No crear; ver `A→COL-MED-35` |
| **Capa B:** [`07` §2.4](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** pendiente | |

### `cat.ContractSpecialConditions`

| Campo | Valor |
|---|---|
| ID T05 | COL-CAT-25 |
| Colección lógica | `contractSpecialConditions` |
| Dueño | M02 |
| Propósito (resumen) | Condiciones especiales de grandes usuarios (MER-003) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `ContractSpecialConditionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.4](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cat/0021-cat.ContractSpecialConditions.sql` | |

### `cat.ServiceCopyRuns`

| Campo | Valor |
|---|---|
| ID T05 | COL-CAT-26 |
| Colección lógica | `serviceCopyRuns` |
| Dueño | M02 |
| Propósito (resumen) | Copia de servicios entre tenants |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `ServiceCopyRunId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.4](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cat/0022-cat.ServiceCopyRuns.sql` | |

### `cat.BulkContractOperations`

| Campo | Valor |
|---|---|
| ID T05 | COL-CAT-27 |
| Colección lógica | `bulkContractOperations` |
| Dueño | M02 |
| Propósito (resumen) | Operaciones masivas sobre contratos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `BulkContractOperationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.4](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cat/0023-cat.BulkContractOperations.sql` | |

### `cat.ServiceTemplates`

| Campo | Valor |
|---|---|
| ID T05 | COL-CAT-28 |
| Colección lógica | `serviceTemplates` |
| Dueño | M02 |
| Propósito (resumen) | Plantillas de servicio de plataforma |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `ServiceTemplateId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.4](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cat/0024-cat.ServiceTemplates.sql` | |

### `cat.BundleSubscriptions`

| Campo | Valor |
|---|---|
| ID T05 | COL-CAT-29 |
| Colección lógica | `bundleSubscriptions` |
| Dueño | M02 |
| Propósito (resumen) | Suscripciones a combos: agrupa los contratos de un paquete (RF-CAT-044; agregada el 5-11-2026 por PA-CAT-22, M02 §7.29) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `BundleSubscriptionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.4](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cat/0025-cat.BundleSubscriptions.sql` | |

## Esquema `cfg`

### `cfg.ParameterDefinitions`

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-01 |
| Colección lógica | `parameterDefinitions` |
| Dueño | T04 |
| Propósito (resumen) | Registro tipado de parámetros PRM |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `ParameterDefinitionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cfg/0001-cfg.ParameterDefinitions.sql` | |

### `cfg.ParameterValues`

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-02 |
| Colección lógica | `parameterValues` |
| Dueño | T04 |
| Propósito (resumen) | Valores por ámbito (alias `tenantParameters` de T04b) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `ParameterValueId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cfg/0002-cfg.ParameterValues.sql` | |

### `cfg.ConfigVersions`

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-03 |
| Colección lógica | `configVersions` |
| Dueño | T04 |
| Propósito (resumen) | Paquetes de configuración versionados y publicados |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `ConfigVersionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cfg/0003-cfg.ConfigVersions.sql` | |

### `cfg.MasterTableDefinitions`

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-04 |
| Colección lógica | `masterTableDefinitions` |
| Dueño | T04 |
| Propósito (resumen) | Definición de tablas maestras |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `MasterTableDefinitionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cfg/0004-cfg.MasterTableDefinitions.sql` | |

### `cfg.Enumerations`

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-05 |
| Colección lógica | `enumerations` |
| Dueño | T04 |
| Propósito (resumen) | Enumeraciones configurables (incluye las claves de M01 §7.18) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `EnumerationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cfg/0005-cfg.Enumerations.sql` | |

### `cfg.EnumerationItems`

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-06 |
| Colección lógica | `enumerationItems` |
| Dueño | T04 |
| Propósito (resumen) | Ítems de enumeraciones y tablas maestras simples |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `EnumerationItemId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cfg/0006-cfg.EnumerationItems.sql` | |

### `cfg.Countries`

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-07 |
| Colección lógica | `countries` |
| Dueño | T04 |
| Propósito (resumen) | Países |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `CountryId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cfg/0007-cfg.Countries.sql` | |

### `cfg.Provinces`

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-08 |
| Colección lógica | `provinces` |
| Dueño | T04 |
| Propósito (resumen) | Provincias |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `ProvinceId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cfg/0008-cfg.Provinces.sql` | |

### `cfg.Departments`

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-09 |
| Colección lógica | `departments` |
| Dueño | T04 |
| Propósito (resumen) | Departamentos/partidos |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `DepartmentId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cfg/0009-cfg.Departments.sql` | |

### `cfg.Localities`

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-10 |
| Colección lógica | `localities` |
| Dueño | T04 |
| Propósito (resumen) | Localidades |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `LocalityId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cfg/0010-cfg.Localities.sql` | |

### `cfg.PostalCodes`

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-11 |
| Colección lógica | `postalCodes` |
| Dueño | T04 |
| Propósito (resumen) | Códigos postales |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `PostalCodeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cfg/0011-cfg.PostalCodes.sql` | |

### `cfg.Streets`

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-12 |
| Colección lógica | `streets` |
| Dueño | T04 |
| Propósito (resumen) | Calles con tramos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `StreetId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cfg/0012-cfg.Streets.sql` | |

### `cfg.StreetAliases`

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-13 |
| Colección lógica | `streetAliases` |
| Dueño | T04 |
| Propósito (resumen) | Alias de calles |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `StreetAliasId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cfg/0013-cfg.StreetAliases.sql` | |

### `cfg.StreetProposals`

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-14 |
| Colección lógica | `streetProposals` |
| Dueño | T04 |
| Propósito (resumen) | Propuestas de calles nuevas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `StreetProposalId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cfg/0014-cfg.StreetProposals.sql` | |

### `cfg.Neighborhoods`

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-15 |
| Colección lógica | `neighborhoods` |
| Dueño | T04 |
| Propósito (resumen) | Barrios |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `NeighborhoodId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cfg/0015-cfg.Neighborhoods.sql` | |

### `cfg.Zones`

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-16 |
| Colección lógica | `zones` |
| Dueño | T04 |
| Propósito (resumen) | Zonas operativas y geográficas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `ZoneId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cfg/0016-cfg.Zones.sql` | |

### `cfg.CadastralDistricts`

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-17 |
| Colección lógica | `cadastralDistricts` |
| Dueño | T04 |
| Propósito (resumen) | Distritos y secciones catastrales (absorbe `districtSections` de M01) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `CadastralDistrictId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cfg/0017-cfg.CadastralDistricts.sql` | |

### `cfg.GeocodeRequests`

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-18 |
| Colección lógica | `geocodeRequests` |
| Dueño | T04 |
| Propósito (resumen) | Pedidos de geocodificación; TTL |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `GeocodeRequestId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cfg/0018-cfg.GeocodeRequests.sql` | |

### `cfg.Calendars`

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-19 |
| Colección lógica | `calendars` |
| Dueño | T04 |
| Propósito (resumen) | Calendarios de días hábiles (canónico para `businessCalendars`) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `CalendarId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cfg/0019-cfg.Calendars.sql` | |

### `cfg.Holidays`

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-20 |
| Colección lógica | `holidays` |
| Dueño | T04 |
| Propósito (resumen) | Feriados nacionales, provinciales y propios (absorbe `holidays` de M16 §7.45) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `HolidayId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cfg/0020-cfg.Holidays.sql` | |

### `cfg.EconomicIndexSeries`

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-21 |
| Colección lógica | `economicIndexSeries` |
| Dueño | T04 |
| Propósito (resumen) | Series de índices (IPC, CER, UVA, tasas BCRA, inflación contable) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `EconomicIndexSeryId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cfg/0021-cfg.EconomicIndexSeries.sql` | |

### `cfg.EconomicIndexValues`

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-22 |
| Colección lógica | `economicIndexValues` |
| Dueño | T04 |
| Propósito (resumen) | Valores por fecha o período |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `EconomicIndexValueId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cfg/0022-cfg.EconomicIndexValues.sql` | |

### `cfg.Currencies`

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-23 |
| Colección lógica | `currencies` |
| Dueño | T04 |
| Propósito (resumen) | Monedas ISO |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `CurrencyId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cfg/0023-cfg.Currencies.sql` | |

### ~~`cfg.VatConditions`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-24 |
| Colección lógica | `vatConditions` |
| Dueño | T04 |
| Propósito (resumen) | (duplicada con M06) |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-FIS-15 |
| SQL | No crear; ver `A→COL-FIS-15` |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** pendiente | |

### ~~`cfg.VatRates`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-25 |
| Colección lógica | `vatRates` |
| Dueño | T04 |
| Propósito (resumen) | (duplicada con M06) |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-FIS-16 |
| SQL | No crear; ver `A→COL-FIS-16` |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** pendiente | |

### ~~`cfg.GrossIncomeConditions`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-26 |
| Colección lógica | `grossIncomeConditions` |
| Dueño | T04 |
| Propósito (resumen) | (duplicada con M06) |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-FIS-19 |
| SQL | No crear; ver `A→COL-FIS-19` |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** pendiente | |

### ~~`cfg.GrossIncomeRates`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-27 |
| Colección lógica | `grossIncomeRates` |
| Dueño | T04 |
| Propósito (resumen) | (duplicada con M06) |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-FIS-19 |
| SQL | No crear; ver `A→COL-FIS-19` |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** pendiente | |

### `cfg.IdentityDocumentTypes`

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-28 |
| Colección lógica | `identityDocumentTypes` |
| Dueño | T04 |
| Propósito (resumen) | Tipos de documento de identidad (canónica para la clave `documentTypes` de M01) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `IdentityDocumentTypeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cfg/0024-cfg.IdentityDocumentTypes.sql` | |

### ~~`cfg.TaxRegistries`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-29 |
| Colección lógica | `taxRegistries` |
| Dueño | T04 |
| Propósito (resumen) | (duplicada con M06) |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-FIS-20 |
| SQL | No crear; ver `A→COL-FIS-20` |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** pendiente | |

### ~~`cfg.TaxRegistryEntries`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-30 |
| Colección lógica | `taxRegistryEntries` |
| Dueño | T04 |
| Propósito (resumen) | (duplicada con M06) |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-FIS-21 |
| SQL | No crear; ver `A→COL-FIS-21` |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** pendiente | |

### `cfg.PlatformTableReleases`

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-31 |
| Colección lógica | `platformTableReleases` |
| Dueño | T04 |
| Propósito (resumen) | Versiones publicadas de tablas de plataforma no fiscales |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `PlatformTableReleasId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cfg/0025-cfg.PlatformTableReleases.sql` | |

### `cfg.PlatformTableAdoptions`

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-32 |
| Colección lógica | `platformTableAdoptions` |
| Dueño | T04 |
| Propósito (resumen) | Adopción por tenant (absorbe `officialTableAdoptions` de M16) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `PlatformTableAdoptionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cfg/0026-cfg.PlatformTableAdoptions.sql` | |

### `cfg.CustomFieldDefinitions`

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-33 |
| Colección lógica | `customFieldDefinitions` |
| Dueño | T04 |
| Propósito (resumen) | Campos extra por entidad |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `CustomFieldDefinitionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cfg/0027-cfg.CustomFieldDefinitions.sql` | |

### `cfg.FormCustomizations`

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-34 |
| Colección lógica | `formCustomizations` |
| Dueño | T04 |
| Propósito (resumen) | Personalización de formularios |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `FormCustomizationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cfg/0028-cfg.FormCustomizations.sql` | |

### ~~`cfg.SavedViews`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-35 |
| Colección lógica | `savedViews` |
| Dueño | T04 |
| Propósito (resumen) | (duplicada con T03 y T10) |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-UXD-10 |
| SQL | No crear; ver `A→COL-UXD-10` |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** pendiente | |

### `cfg.MasterImportJobs`

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-36 |
| Colección lógica | `masterImportJobs` |
| Dueño | T04 |
| Propósito (resumen) | Importaciones de maestros desde Excel |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `MasterImportJobId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cfg/0029-cfg.MasterImportJobs.sql` | |

### `cfg.SeedPacks`

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-37 |
| Colección lógica | `seedPacks` |
| Dueño | T04 |
| Propósito (resumen) | Paquetes de precarga de demostración |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `SeedPackId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cfg/0030-cfg.SeedPacks.sql` | |

### `cfg.SeedApplications`

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-38 |
| Colección lógica | `seedApplications` |
| Dueño | T04 |
| Propósito (resumen) | Paquetes aplicados por tenant |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `SeedApplicationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cfg/0031-cfg.SeedApplications.sql` | |

### `cfg.LegacyParameterMappings`

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-39 |
| Colección lógica | `legacyParameterMappings` |
| Dueño | T04 |
| Propósito (resumen) | Mapa `VARIABLE`/V2 → PRM |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `LegacyParameterMappingId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cfg/0032-cfg.LegacyParameterMappings.sql` | |

### ~~`cfg.Sequences`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-40 |
| Colección lógica | `sequences` |
| Dueño | T04 |
| Propósito (resumen) | (duplicada con T11 `numberingSequences`) |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-WFL-45 |
| SQL | No crear; ver `A→COL-WFL-45` |
| **Capa B:** canónica T11 — [`wfl.NumberingSequences`](07-catalogo-tablas-sql.md) (§2.25) | |
| **Capa C:** pendiente | |

### `cfg.LegalEntities`

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-41 |
| Colección lógica | `legalEntities` |
| Dueño | T04 |
| Propósito (resumen) | Entidades jurídicas emisoras del tenant (DEC-064), definida en T04 §7.14: `code`, `legalName`, `tradeName`, `legalForm`, |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `LegalEntityId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cfg/0033-cfg.LegalEntities.sql` | |

### `cfg.Branches`

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-42 |
| Colección lógica | `branches` |
| Dueño | T04 |
| Propósito (resumen) | Sucursales del tenant, definida en T04 §7.15: `code`, `name`, `legalEntityId`, `localityId`, `address`, `uses[]` (`atten |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `BrancheId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cfg/0034-cfg.Branches.sql` | |

### `cfg.Workstations`

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-43 |
| Colección lógica | `workstations` |
| Dueño | T04 |
| Propósito (resumen) | Puestos físicos, definida en T04 §7.16: `code`, `name`, `branchId`, `kind` (`counter`, `cashier`, `office`, `kiosk`, `fi |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `WorkstationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cfg/0035-cfg.Workstations.sql` | |

### `cfg.PayrollOfficialCodes`

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-44 |
| Colección lógica | `payrollOfficialCodes` |
| Dueño | T04 |
| Propósito (resumen) | Códigos oficiales de sueldos (actividad, condición, revista, siniestro, RNOS…) |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `PayrollOfficialCodeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cfg/0036-cfg.PayrollOfficialCodes.sql` | |

### `cfg.ContributionRates`

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-45 |
| Colección lógica | `contributionRates` |
| Dueño | T04 |
| Propósito (resumen) | Alícuotas de aportes y contribuciones |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `ContributionRateId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cfg/0037-cfg.ContributionRates.sql` | |

### `cfg.ContributionBaseLimits`

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-46 |
| Colección lógica | `contributionBaseLimits` |
| Dueño | T04 |
| Propósito (resumen) | Bases imponibles mínima y máxima |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `ContributionBaseLimitId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cfg/0038-cfg.ContributionBaseLimits.sql` | |

### `cfg.MinimumWages`

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-47 |
| Colección lógica | `minimumWages` |
| Dueño | T04 |
| Propósito (resumen) | Salario mínimo vital y móvil |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `MinimumWageId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cfg/0039-cfg.MinimumWages.sql` | |

### `cfg.IncomeTaxDeductionTables`

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-48 |
| Colección lógica | `incomeTaxDeductionTables` |
| Dueño | T04 |
| Propósito (resumen) | Deducciones de Ganancias |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `IncomeTaxDeductionTableId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cfg/0040-cfg.IncomeTaxDeductionTables.sql` | |

### `cfg.IncomeTaxScales`

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-49 |
| Colección lógica | `incomeTaxScales` |
| Dueño | T04 |
| Propósito (resumen) | Escalas de Ganancias |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `IncomeTaxScaleId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cfg/0041-cfg.IncomeTaxScales.sql` | |

### `cfg.IncomeTaxRules`

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-50 |
| Colección lógica | `incomeTaxRules` |
| Dueño | T04 |
| Propósito (resumen) | Reglas generales de Ganancias |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `IncomeTaxRuleId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cfg/0042-cfg.IncomeTaxRules.sql` | |

### `cfg.CedularTaxScales`

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-51 |
| Colección lógica | `cedularTaxScales` |
| Dueño | T04 |
| Propósito (resumen) | Escala de impuesto cedular |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `CedularTaxScaleId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cfg/0043-cfg.CedularTaxScales.sql` | |

### `cfg.GarnishmentScales`

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-52 |
| Colección lógica | `garnishmentScales` |
| Dueño | T04 |
| Propósito (resumen) | Escala de embargabilidad |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `GarnishmentScaleId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cfg/0044-cfg.GarnishmentScales.sql` | |

### `cfg.LaborLawParameters`

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-53 |
| Colección lógica | `laborLawParameters` |
| Dueño | T04 |
| Propósito (resumen) | Parámetros de la ley de contrato de trabajo |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `LaborLawParameterId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cfg/0045-cfg.LaborLawParameters.sql` | |

### ~~`cfg.StatutoryFileLayouts`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-54 |
| Colección lógica | `statutoryFileLayouts` |
| Dueño | T04 |
| Propósito (resumen) | (diseños LSD, SICOSS, SICORE: son layouts) |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-INT-10 |
| SQL | No crear; ver `A→COL-INT-10` |
| **Capa B:** canónica T06 — [`int.FileLayouts`](07-catalogo-tablas-sql.md) (§2.24) | |
| **Capa C:** pendiente | |

### ~~`cfg.OfficialTableAdoptions`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-CFG-55 |
| Colección lógica | `officialTableAdoptions` |
| Dueño | T04 |
| Propósito (resumen) | (adopción declarada en M16 §7.45) |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-CFG-32 |
| SQL | No crear; ver `A→COL-CFG-32` |
| **Capa B:** [`07` §2.3](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** pendiente | |

## Esquema `cmp`

### `cmp.Suppliers`

| Campo | Valor |
|---|---|
| ID T05 | COL-CMP-01 |
| Colección lógica | `suppliers` |
| Dueño | M12 |
| Propósito (resumen) | Proveedores (CBU cifrado): rol de una persona de M01; razón social, CUIT, condición IVA y domicilios se leen de la perso |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `SupplierId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.16](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cmp/0001-cmp.Suppliers.sql` | |

### `cmp.SupplierCategories`

| Campo | Valor |
|---|---|
| ID T05 | COL-CMP-02 |
| Colección lógica | `supplierCategories` |
| Dueño | M12 |
| Propósito (resumen) | Rubros de proveedor y de productos/servicios comprados |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `SupplierCategoryId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.16](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cmp/0002-cmp.SupplierCategories.sql` | |

### `cmp.SupplierEvaluations`

| Campo | Valor |
|---|---|
| ID T05 | COL-CMP-03 |
| Colección lógica | `supplierEvaluations` |
| Dueño | M12 |
| Propósito (resumen) | Valoraciones de proveedores |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `SupplierEvaluationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.16](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cmp/0003-cmp.SupplierEvaluations.sql` | |

### `cmp.SupplierCorrespondence`

| Campo | Valor |
|---|---|
| ID T05 | COL-CMP-04 |
| Colección lógica | `supplierCorrespondence` |
| Dueño | M12 |
| Propósito (resumen) | Circulares y envíos a proveedores (entrega real por T09) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `SupplierCorrespondenceId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.16](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cmp/0004-cmp.SupplierCorrespondence.sql` | |

### `cmp.PurchaseConcepts`

| Campo | Valor |
|---|---|
| ID T05 | COL-CMP-05 |
| Colección lógica | `purchaseConcepts` |
| Dueño | M12 |
| Propósito (resumen) | Conceptos de compra, incluidos los conceptos asociados a tasas (descripción, tasa y columna del libro de compras) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `PurchaseConceptId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.16](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cmp/0005-cmp.PurchaseConcepts.sql` | |

### `cmp.PurchaseLookups`

| Campo | Valor |
|---|---|
| ID T05 | COL-CMP-06 |
| Colección lógica | `purchaseLookups` |
| Dueño | M12 |
| Propósito (resumen) | Catálogos menores de compras (destinatarios, modalidades, lugares de entrega); los tipos `spendingUnit` y `fuel` no se c |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `PurchaseLookupId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.16](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cmp/0006-cmp.PurchaseLookups.sql` | |

### `cmp.SupplyRequests`

| Campo | Valor |
|---|---|
| ID T05 | COL-CMP-07 |
| Colección lógica | `supplyRequests` |
| Dueño | M12 |
| Propósito (resumen) | Solicitudes de abastecimiento |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `SupplyRequestId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.16](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cmp/0007-cmp.SupplyRequests.sql` | |

### `cmp.QuoteRequests`

| Campo | Valor |
|---|---|
| ID T05 | COL-CMP-08 |
| Colección lógica | `quoteRequests` |
| Dueño | M12 |
| Propósito (resumen) | Pedidos de cotización |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `QuoteRequestId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.16](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cmp/0008-cmp.QuoteRequests.sql` | |

### `cmp.SourcingEvents`

| Campo | Valor |
|---|---|
| ID T05 | COL-CMP-09 |
| Colección lógica | `sourcingEvents` |
| Dueño | M12 |
| Propósito (resumen) | Concursos y comparativas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `SourcingEventId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.16](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cmp/0009-cmp.SourcingEvents.sql` | |

### `cmp.PurchaseOrders`

| Campo | Valor |
|---|---|
| ID T05 | COL-CMP-10 |
| Colección lógica | `purchaseOrders` |
| Dueño | M12 |
| Propósito (resumen) | Órdenes de compra |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `PurchaseOrderId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.16](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cmp/0010-cmp.PurchaseOrders.sql` | |

### `cmp.SupplierReceipts`

| Campo | Valor |
|---|---|
| ID T05 | COL-CMP-11 |
| Colección lógica | `supplierReceipts` |
| Dueño | M12 |
| Propósito (resumen) | Recepciones de bienes y servicios |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `SupplierReceiptId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.16](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cmp/0011-cmp.SupplierReceipts.sql` | |

### `cmp.SupplierInvoices`

| Campo | Valor |
|---|---|
| ID T05 | COL-CMP-12 |
| Colección lógica | `supplierInvoices` |
| Dueño | M12 |
| Propósito (resumen) | Comprobantes de proveedor; `wholesaleSupply` (factura mayorista de energía o gas con control contra la medición de M03,  |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `SupplierInvoiceId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.16](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cmp/0012-cmp.SupplierInvoices.sql` | |

### `cmp.PurchaseDocumentLinks`

| Campo | Valor |
|---|---|
| ID T05 | COL-CMP-13 |
| Colección lógica | `purchaseDocumentLinks` |
| Dueño | M12 |
| Propósito (resumen) | Relaciones entre documentos de compra |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `PurchaseDocumentLinkId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.16](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cmp/0013-cmp.PurchaseDocumentLinks.sql` | |

### `cmp.MatchExceptions`

| Campo | Valor |
|---|---|
| ID T05 | COL-CMP-14 |
| Colección lógica | `matchExceptions` |
| Dueño | M12 |
| Propósito (resumen) | Excepciones de conciliación de tres vías |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `MatchExceptionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.16](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cmp/0014-cmp.MatchExceptions.sql` | |

### `cmp.PaymentOrders`

| Campo | Valor |
|---|---|
| ID T05 | COL-CMP-15 |
| Colección lógica | `paymentOrders` |
| Dueño | M12 |
| Propósito (resumen) | Órdenes de pago a proveedores |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `PaymentOrderId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.16](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cmp/0015-cmp.PaymentOrders.sql` | |

### `cmp.SupplierAdvances`

| Campo | Valor |
|---|---|
| ID T05 | COL-CMP-16 |
| Colección lógica | `supplierAdvances` |
| Dueño | M12 |
| Propósito (resumen) | Anticipos a proveedores |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `SupplierAdvanceId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.16](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cmp/0016-cmp.SupplierAdvances.sql` | |

### `cmp.PurchaseForecasts`

| Campo | Valor |
|---|---|
| ID T05 | COL-CMP-17 |
| Colección lógica | `purchaseForecasts` |
| Dueño | M12 |
| Propósito (resumen) | Previsiones de compra |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `PurchaseForecastId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.16](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cmp/0017-cmp.PurchaseForecasts.sql` | |

### `cmp.SupplierPortalSubmissions`

| Campo | Valor |
|---|---|
| ID T05 | COL-CMP-18 |
| Colección lógica | `supplierPortalSubmissions` |
| Dueño | M12 |
| Propósito (resumen) | Comprobantes cargados por proveedores en el portal |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `SupplierPortalSubmissionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.16](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cmp/0018-cmp.SupplierPortalSubmissions.sql` | |

### `cmp.AiInvoiceExtractions`

| Campo | Valor |
|---|---|
| ID T05 | COL-CMP-19 |
| Colección lógica | `aiInvoiceExtractions` |
| Dueño | M12 |
| Propósito (resumen) | Extracción asistida por IA (sin prompts con datos personales) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `AiInvoiceExtractionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.16](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cmp/0019-cmp.AiInvoiceExtractions.sql` | |

### `cmp.SupplierLedgerEntries`

| Campo | Valor |
|---|---|
| ID T05 | COL-CMP-20 |
| Colección lógica | `supplierLedgerEntries` |
| Dueño | M12 |
| Propósito (resumen) | Proyección de cuenta corriente de proveedores (reconstruible) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `SupplierLedgerEntryId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.16](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cmp/0020-cmp.SupplierLedgerEntries.sql` | |

### `cmp.SupplyBalances`

| Campo | Valor |
|---|---|
| ID T05 | COL-CMP-21 |
| Colección lógica | `supplyBalances` |
| Dueño | M12 |
| Propósito (resumen) | Balance mensual de compra mayorista de energía o gas: comprado, medido en frontera, facturado a usuarios y pérdida (RF-C |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `SupplyBalanceId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.16](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cmp/0021-cmp.SupplyBalances.sql` | |

### `cmp.SignalRightsContracts`

| Campo | Valor |
|---|---|
| ID T05 | COL-CMP-22 |
| Colección lógica | `signalRightsContracts` |
| Dueño | M12 |
| Propósito (resumen) | Contratos de derechos de señales de TV por programadora (RF-CMP-154, HUE-TV-01) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `SignalRightsContractId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.16](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cmp/0022-cmp.SignalRightsContracts.sql` | |

### `cmp.SignalRightsSettlements`

| Campo | Valor |
|---|---|
| ID T05 | COL-CMP-23 |
| Colección lógica | `signalRightsSettlements` |
| Dueño | M12 |
| Propósito (resumen) | Liquidación mensual de derechos de señales por abonados activos (RF-CMP-155; EVT-CMP-17 `settlementId`) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `SignalRightsSettlementId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.16](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cmp/0023-cmp.SignalRightsSettlements.sql` | |

## Esquema `cob`

### `cob.CurrentAccounts`

| Campo | Valor |
|---|---|
| ID T05 | COL-COB-01 |
| Colección lógica | `currentAccounts` |
| Dueño | M07 |
| Propósito (resumen) | Cuenta corriente (auxiliar de saldo) de titular o grupo de facturación, una por titular y entidad jurídica (`legalEntity |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `CurrentAccountId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.10](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cob/0001-cob.CurrentAccounts.sql` | |

### `cob.Obligations`

| Campo | Valor |
|---|---|
| ID T05 | COL-COB-02 |
| Colección lógica | `obligations` |
| Dueño | M07 |
| Propósito (resumen) | Obligaciones exigibles por bloque de servicio (alto volumen). `dueSchedule [{seq: 1..N, dueDate, amount}]` copiado de `i |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `ObligationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.10](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cob/0002-cob.Obligations.sql` | |

### `cob.LedgerEntries`

| Campo | Valor |
|---|---|
| ID T05 | COL-COB-03 |
| Colección lógica | `ledgerEntries` |
| Dueño | M07 |
| Propósito (resumen) | Libro auxiliar de movimientos (alto volumen, solo agregado) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `LedgerEntryId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.10](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cob/0003-cob.LedgerEntries.sql` | |

### `cob.Allocations`

| Campo | Valor |
|---|---|
| ID T05 | COL-COB-04 |
| Colección lógica | `allocations` |
| Dueño | M07 |
| Propósito (resumen) | Imputaciones (alto volumen) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `AllocationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.10](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cob/0004-cob.Allocations.sql` | |

### `cob.AllocationPolicies`

| Campo | Valor |
|---|---|
| ID T05 | COL-COB-05 |
| Colección lógica | `allocationPolicies` |
| Dueño | M07 |
| Propósito (resumen) | Políticas de imputación versionadas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `AllocationPolicyId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.10](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cob/0005-cob.AllocationPolicies.sql` | |

### `cob.CreditBalances`

| Campo | Valor |
|---|---|
| ID T05 | COL-COB-06 |
| Colección lógica | `creditBalances` |
| Dueño | M07 |
| Propósito (resumen) | Saldos a favor y anticipos; `origin` incluye `guaranteeRefund` (devolución de depósito en garantía con `refundMode = acc |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `CreditBalanceId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.10](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cob/0006-cob.CreditBalances.sql` | |

### `cob.UnidentifiedReceipts`

| Campo | Valor |
|---|---|
| ID T05 | COL-COB-07 |
| Colección lógica | `unidentifiedReceipts` |
| Dueño | M07 |
| Propósito (resumen) | Cobros no identificados |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `UnidentifiedReceiptId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.10](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cob/0007-cob.UnidentifiedReceipts.sql` | |

### `cob.AccountStatements`

| Campo | Valor |
|---|---|
| ID T05 | COL-COB-08 |
| Colección lógica | `accountStatements` |
| Dueño | M07 |
| Propósito (resumen) | Resúmenes de cuenta |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `AccountStatementId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.10](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cob/0008-cob.AccountStatements.sql` | |

### `cob.CashRegisters`

| Campo | Valor |
|---|---|
| ID T05 | COL-COB-09 |
| Colección lógica | `cashRegisters` |
| Dueño | M07 |
| Propósito (resumen) | Cajas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `CashRegisterId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.10](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cob/0009-cob.CashRegisters.sql` | |

### `cob.CashSessions`

| Campo | Valor |
|---|---|
| ID T05 | COL-COB-10 |
| Colección lógica | `cashSessions` |
| Dueño | M07 |
| Propósito (resumen) | Turnos de caja |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `CashSessionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.10](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cob/0010-cob.CashSessions.sql` | |

### `cob.CashOperations`

| Campo | Valor |
|---|---|
| ID T05 | COL-COB-11 |
| Colección lógica | `cashOperations` |
| Dueño | M07 |
| Propósito (resumen) | Operaciones de caja |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `CashOperationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.10](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cob/0011-cob.CashOperations.sql` | |

### `cob.Receipts`

| Campo | Valor |
|---|---|
| ID T05 | COL-COB-12 |
| Colección lógica | `receipts` |
| Dueño | M07 |
| Propósito (resumen) | Recibos; un cobro que cubre facturas de varias entidades emite un recibo por entidad (DEC-087) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `ReceiptId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.10](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cob/0012-cob.Receipts.sql` | |

### `cob.PaymentTenders`

| Campo | Valor |
|---|---|
| ID T05 | COL-COB-13 |
| Colección lógica | `paymentTenders` |
| Dueño | M07 |
| Propósito (resumen) | Medios de pago aplicados |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `PaymentTenderId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.10](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cob/0013-cob.PaymentTenders.sql` | |

### `cob.PaymentMethods`

| Campo | Valor |
|---|---|
| ID T05 | COL-COB-14 |
| Colección lógica | `paymentMethods` |
| Dueño | M07 |
| Propósito (resumen) | Catálogo de medios de pago |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `PaymentMethodId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.10](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cob/0014-cob.PaymentMethods.sql` | |

### `cob.CardPlans`

| Campo | Valor |
|---|---|
| ID T05 | COL-COB-15 |
| Colección lógica | `cardPlans` |
| Dueño | M07 |
| Propósito (resumen) | Tarjetas, planes de cuotas y recargos (canónica; absorbe `cardPlans` de M14) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `CardPlanId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.10](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cob/0015-cob.CardPlans.sql` | |

### ~~`cob.CashDiscountRules`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-COB-16 |
| Colección lógica | `cashDiscountRules` |
| Dueño | M07 |
| Propósito (resumen) | (descuento por pronto pago: canónica en M08) |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-MOR-06 |
| SQL | No crear; ver `A→COL-MOR-06` |
| **Capa B:** [`07` §2.10](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** pendiente | |

### `cob.StaticQrCodes`

| Campo | Valor |
|---|---|
| ID T05 | COL-COB-17 |
| Colección lógica | `staticQrCodes` |
| Dueño | M07 |
| Propósito (resumen) | QR estáticos por caja |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `StaticQrCodeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.10](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cob/0016-cob.StaticQrCodes.sql` | |

### `cob.Collectors`

| Campo | Valor |
|---|---|
| ID T05 | COL-COB-18 |
| Colección lógica | `collectors` |
| Dueño | M07 |
| Propósito (resumen) | Cobradores (MER-007) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `CollectorId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.10](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cob/0017-cob.Collectors.sql` | |

### `cob.CollectionRounds`

| Campo | Valor |
|---|---|
| ID T05 | COL-COB-19 |
| Colección lógica | `collectionRounds` |
| Dueño | M07 |
| Propósito (resumen) | Rondas de cobro |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `CollectionRoundId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.10](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cob/0018-cob.CollectionRounds.sql` | |

### `cob.CollectorSettlements`

| Campo | Valor |
|---|---|
| ID T05 | COL-COB-20 |
| Colección lógica | `collectorSettlements` |
| Dueño | M07 |
| Propósito (resumen) | Rendiciones de cobradores |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `CollectorSettlementId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.10](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cob/0019-cob.CollectorSettlements.sql` | |

### `cob.CollectionAgencies`

| Campo | Valor |
|---|---|
| ID T05 | COL-COB-21 |
| Colección lógica | `collectionAgencies` |
| Dueño | M07 |
| Propósito (resumen) | Entes recaudadores (redes, bancos, pasarelas por archivo). `dueDateCapacity` (int ≥ 1, obligatoria para habilitar el ent |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `CollectionAgencyId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.10](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cob/0020-cob.CollectionAgencies.sql` | |

### ~~`cob.FileLayouts`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-COB-22 |
| Colección lógica | `fileLayouts` |
| Dueño | M07 |
| Propósito (resumen) | (duplicada con T06) |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-INT-10 |
| SQL | No crear; ver `A→COL-INT-10` |
| **Capa B:** canónica T06 — [`int.FileLayouts`](07-catalogo-tablas-sql.md) (§2.24) | |
| **Capa C:** pendiente | |

### `cob.PaymentReferences`

| Campo | Valor |
|---|---|
| ID T05 | COL-COB-23 |
| Colección lógica | `paymentReferences` |
| Dueño | M07 |
| Propósito (resumen) | Identificadores de pago autocontenidos (DEC-050) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `PaymentReferenceId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.10](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cob/0021-cob.PaymentReferences.sql` | |

### `cob.ExternalKeyAliases`

| Campo | Valor |
|---|---|
| ID T05 | COL-COB-24 |
| Colección lógica | `externalKeyAliases` |
| Dueño | M07 |
| Propósito (resumen) | Alias de claves de entes externos (las claves ProCoop van a `legacyKeyAliases`) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `ExternalKeyAliasId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.10](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cob/0022-cob.ExternalKeyAliases.sql` | |

### `cob.AgencyDebtExports`

| Campo | Valor |
|---|---|
| ID T05 | COL-COB-25 |
| Colección lógica | `agencyDebtExports` |
| Dueño | M07 |
| Propósito (resumen) | Exportaciones de deuda a entes. `totals.byDue[] {seq, amount}` para layouts con más de tres vencimientos (`due1..due3` s |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `AgencyDebtExportId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.10](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cob/0023-cob.AgencyDebtExports.sql` | |

### `cob.AgencyPublishedDebts`

| Campo | Valor |
|---|---|
| ID T05 | COL-COB-26 |
| Colección lógica | `agencyPublishedDebts` |
| Dueño | M07 |
| Propósito (resumen) | Deuda publicada por ente |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `AgencyPublishedDebtId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.10](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cob/0024-cob.AgencyPublishedDebts.sql` | |

### `cob.AgencySettlements`

| Campo | Valor |
|---|---|
| ID T05 | COL-COB-27 |
| Colección lógica | `agencySettlements` |
| Dueño | M07 |
| Propósito (resumen) | Rendiciones de entes |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `AgencySettlementId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.10](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cob/0025-cob.AgencySettlements.sql` | |

### `cob.AgencySettlementLines`

| Campo | Valor |
|---|---|
| ID T05 | COL-COB-28 |
| Colección lógica | `agencySettlementLines` |
| Dueño | M07 |
| Propósito (resumen) | Líneas de rendición (alto volumen) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `AgencySettlementLineId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.10](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cob/0026-cob.AgencySettlementLines.sql` | |

### `cob.AgencyNoveltyFiles`

| Campo | Valor |
|---|---|
| ID T05 | COL-COB-29 |
| Colección lógica | `agencyNoveltyFiles` |
| Dueño | M07 |
| Propósito (resumen) | Novedades y morosidad de entes |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `AgencyNoveltyFileId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.10](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cob/0027-cob.AgencyNoveltyFiles.sql` | |

### `cob.DirectDebitMandates`

| Campo | Valor |
|---|---|
| ID T05 | COL-COB-30 |
| Colección lógica | `directDebitMandates` |
| Dueño | M07 |
| Propósito (resumen) | Adhesiones a débito automático (CBU cifrado; tarjeta solo como token o número de adherente del proveedor, marca y último |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `DirectDebitMandateId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.10](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cob/0028-cob.DirectDebitMandates.sql` | |

### `cob.DirectDebitBatches`

| Campo | Valor |
|---|---|
| ID T05 | COL-COB-31 |
| Colección lógica | `directDebitBatches` |
| Dueño | M07 |
| Propósito (resumen) | Lotes de débito |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `DirectDebitBatcheId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.10](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cob/0029-cob.DirectDebitBatches.sql` | |

### `cob.GatewayConnectors`

| Campo | Valor |
|---|---|
| ID T05 | COL-COB-32 |
| Colección lógica | `gatewayConnectors` |
| Dueño | M07 |
| Propósito (resumen) | Pasarelas (dominio sobre `integrationConnections`) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `GatewayConnectorId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.10](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cob/0030-cob.GatewayConnectors.sql` | |

### `cob.PaymentChannels`

| Campo | Valor |
|---|---|
| ID T05 | COL-COB-33 |
| Colección lógica | `paymentChannels` |
| Dueño | M07 |
| Propósito (resumen) | Canales de pago habilitados |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `PaymentChannelId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.10](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cob/0031-cob.PaymentChannels.sql` | |

### `cob.PaymentIntents`

| Campo | Valor |
|---|---|
| ID T05 | COL-COB-34 |
| Colección lógica | `paymentIntents` |
| Dueño | M07 |
| Propósito (resumen) | Intenciones de pago |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `PaymentIntentId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.10](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cob/0032-cob.PaymentIntents.sql` | |

### `cob.GatewayTransactions`

| Campo | Valor |
|---|---|
| ID T05 | COL-COB-35 |
| Colección lógica | `gatewayTransactions` |
| Dueño | M07 |
| Propósito (resumen) | Transacciones de pasarela |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `GatewayTransactionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.10](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cob/0033-cob.GatewayTransactions.sql` | |

### `cob.GatewayWebhookEvents`

| Campo | Valor |
|---|---|
| ID T05 | COL-COB-36 |
| Colección lógica | `gatewayWebhookEvents` |
| Dueño | M07 |
| Propósito (resumen) | Webhooks de pasarela; retención 18 meses |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `GatewayWebhookEventId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.10](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cob/0034-cob.GatewayWebhookEvents.sql` | |

### `cob.PaymentCoupons`

| Campo | Valor |
|---|---|
| ID T05 | COL-COB-37 |
| Colección lógica | `paymentCoupons` |
| Dueño | M07 |
| Propósito (resumen) | Cupón de pago único (canónica para la modalidad `singleCoupon` de `paymentSlips`) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `PaymentCouponId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.10](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cob/0035-cob.PaymentCoupons.sql` | |

### `cob.RefundCases`

| Campo | Valor |
|---|---|
| ID T05 | COL-COB-38 |
| Colección lógica | `refundCases` |
| Dueño | M07 |
| Propósito (resumen) | Devoluciones |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `RefundCasId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.10](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cob/0036-cob.RefundCases.sql` | |

### `cob.Chargebacks`

| Campo | Valor |
|---|---|
| ID T05 | COL-COB-39 |
| Colección lógica | `chargebacks` |
| Dueño | M07 |
| Propósito (resumen) | Contracargos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `ChargebackId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.10](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cob/0037-cob.Chargebacks.sql` | |

### `cob.CollectionReconciliations`

| Campo | Valor |
|---|---|
| ID T05 | COL-COB-40 |
| Colección lógica | `collectionReconciliations` |
| Dueño | M07 |
| Propósito (resumen) | Conciliación de cobranza |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `CollectionReconciliationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.10](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cob/0038-cob.CollectionReconciliations.sql` | |

### `cob.TreasuryHandovers`

| Campo | Valor |
|---|---|
| ID T05 | COL-COB-41 |
| Colección lógica | `treasuryHandovers` |
| Dueño | M07 |
| Propósito (resumen) | Entrega de fondos de caja a tesorería (M14 la recibe en `cashRemittances`) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `TreasuryHandoverId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.10](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cob/0039-cob.TreasuryHandovers.sql` | |

### `cob.ThirdPartyBillers`

| Campo | Valor |
|---|---|
| ID T05 | COL-COB-42 |
| Colección lógica | `thirdPartyBillers` |
| Dueño | M07 |
| Propósito (resumen) | Empresas que facturan por su cuenta y cobra la cooperativa |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `ThirdPartyBillerId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.10](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cob/0040-cob.ThirdPartyBillers.sql` | |

### `cob.ThirdPartyCollections`

| Campo | Valor |
|---|---|
| ID T05 | COL-COB-43 |
| Colección lógica | `thirdPartyCollections` |
| Dueño | M07 |
| Propósito (resumen) | Cobros de terceros |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `ThirdPartyCollectionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.10](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cob/0041-cob.ThirdPartyCollections.sql` | |

### `cob.ExternalObligationImports`

| Campo | Valor |
|---|---|
| ID T05 | COL-COB-44 |
| Colección lógica | `externalObligationImports` |
| Dueño | M07 |
| Propósito (resumen) | Importación de obligaciones externas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `ExternalObligationImportId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.10](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cob/0042-cob.ExternalObligationImports.sql` | |

### `cob.CollectionReportSchemes`

| Campo | Valor |
|---|---|
| ID T05 | COL-COB-45 |
| Colección lógica | `collectionReportSchemes` |
| Dueño | M07 |
| Propósito (resumen) | Esquemas de informe de cobranza |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `CollectionReportSchemeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.10](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cob/0043-cob.CollectionReportSchemes.sql` | |

### `cob.CollectionExceptions`

| Campo | Valor |
|---|---|
| ID T05 | COL-COB-46 |
| Colección lógica | `collectionExceptions` |
| Dueño | M07 |
| Propósito (resumen) | Excepciones de cobranza |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `CollectionExceptionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.10](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cob/0044-cob.CollectionExceptions.sql` | |

### `cob.CollectionAccountingGroups`

| Campo | Valor |
|---|---|
| ID T05 | COL-COB-47 |
| Colección lógica | `collectionAccountingGroups` |
| Dueño | M07 |
| Propósito (resumen) | Grupos contables de cobranza (los usa `accounts.accountingGroupId` de M01; sus cuentas viven en `entityAccountAssignment |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `CollectionAccountingGroupId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.10](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/cob/0045-cob.CollectionAccountingGroups.sql` | |

## Esquema `com`

### `com.Posts`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-01 |
| Colección lógica | `posts` |
| Dueño | T09 |
| Propósito (resumen) | Publicaciones del muro y novedades |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `PostId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0001-com.Posts.sql` | |

### `com.PostCategories`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-02 |
| Colección lógica | `postCategories` |
| Dueño | T09 |
| Propósito (resumen) | Categorías |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `PostCategoryId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0002-com.PostCategories.sql` | |

### `com.PostTemplates`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-03 |
| Colección lógica | `postTemplates` |
| Dueño | T09 |
| Propósito (resumen) | Plantillas de publicación |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `PostTemplateId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0003-com.PostTemplates.sql` | |

### `com.PostReactions`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-04 |
| Colección lógica | `postReactions` |
| Dueño | T09 |
| Propósito (resumen) | Reacciones |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `PostReactionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0004-com.PostReactions.sql` | |

### `com.PostViews`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-05 |
| Colección lógica | `postViews` |
| Dueño | T09 |
| Propósito (resumen) | Vistas; TTL 400 días |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `PostViewId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0005-com.PostViews.sql` | |

### `com.PostDailyStats`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-06 |
| Colección lógica | `postDailyStats` |
| Dueño | T09 |
| Propósito (resumen) | Estadística diaria |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `PostDailyStatId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0006-com.PostDailyStats.sql` | |

### `com.PostUserStates`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-07 |
| Colección lógica | `postUserStates` |
| Dueño | T09 |
| Propósito (resumen) | Estado por usuario (leído, guardado) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `PostUserStateId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0007-com.PostUserStates.sql` | |

### `com.GreetingRules`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-08 |
| Colección lógica | `greetingRules` |
| Dueño | T09 |
| Propósito (resumen) | Saludos automáticos (cumpleaños, aniversario) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `GreetingRuleId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0008-com.GreetingRules.sql` | |

### `com.Comments`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-09 |
| Colección lógica | `comments` |
| Dueño | T09 |
| Propósito (resumen) | Comentarios moderados |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `CommentId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0009-com.Comments.sql` | |

### `com.ModerationPolicies`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-10 |
| Colección lógica | `moderationPolicies` |
| Dueño | T09 |
| Propósito (resumen) | Políticas de moderación |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `ModerationPolicyId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0010-com.ModerationPolicies.sql` | |

### `com.ModerationRules`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-11 |
| Colección lógica | `moderationRules` |
| Dueño | T09 |
| Propósito (resumen) | Reglas de moderación |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `ModerationRuleId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0011-com.ModerationRules.sql` | |

### `com.ModerationCases`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-12 |
| Colección lógica | `moderationCases` |
| Dueño | T09 |
| Propósito (resumen) | Cola de revisión |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `ModerationCasId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0012-com.ModerationCases.sql` | |

### `com.ContentReports`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-13 |
| Colección lógica | `contentReports` |
| Dueño | T09 |
| Propósito (resumen) | Denuncias de contenido |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `ContentReportId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0013-com.ContentReports.sql` | |

### `com.CommunitySanctions`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-14 |
| Colección lógica | `communitySanctions` |
| Dueño | T09 |
| Propósito (resumen) | Sanciones de comunidad |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `CommunitySanctionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0014-com.CommunitySanctions.sql` | |

### `com.CommunityGuidelines`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-15 |
| Colección lógica | `communityGuidelines` |
| Dueño | T09 |
| Propósito (resumen) | Normas de convivencia versionadas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `CommunityGuidelineId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0015-com.CommunityGuidelines.sql` | |

### `com.GuidelineAcceptances`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-16 |
| Colección lógica | `guidelineAcceptances` |
| Dueño | T09 |
| Propósito (resumen) | Aceptación de normas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `GuidelineAcceptanceId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0016-com.GuidelineAcceptances.sql` | |

### `com.NewsletterRules`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-17 |
| Colección lógica | `newsletterRules` |
| Dueño | T09 |
| Propósito (resumen) | Reglas de boletines |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `NewsletterRuleId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0017-com.NewsletterRules.sql` | |

### `com.Newsletters`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-18 |
| Colección lógica | `newsletters` |
| Dueño | T09 |
| Propósito (resumen) | Boletines |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `NewsletterId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0018-com.Newsletters.sql` | |

### `com.NewsletterRecipients`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-19 |
| Colección lógica | `newsletterRecipients` |
| Dueño | T09 |
| Propósito (resumen) | Destinatarios del boletín |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `NewsletterRecipientId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0019-com.NewsletterRecipients.sql` | |

### `com.Surveys`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-20 |
| Colección lógica | `surveys` |
| Dueño | T09 |
| Propósito (resumen) | Encuestas y votaciones no vinculantes |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `SurveyId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0020-com.Surveys.sql` | |

### `com.SurveyResponses`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-21 |
| Colección lógica | `surveyResponses` |
| Dueño | T09 |
| Propósito (resumen) | Respuestas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `SurveyResponsId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0021-com.SurveyResponses.sql` | |

### `com.SurveyInvitations`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-22 |
| Colección lógica | `surveyInvitations` |
| Dueño | T09 |
| Propósito (resumen) | Invitaciones |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `SurveyInvitationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0022-com.SurveyInvitations.sql` | |

### `com.SurveyTemplates`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-23 |
| Colección lógica | `surveyTemplates` |
| Dueño | T09 |
| Propósito (resumen) | Plantillas de encuesta |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `SurveyTemplateId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0023-com.SurveyTemplates.sql` | |

### `com.SurveyCategories`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-24 |
| Colección lógica | `surveyCategories` |
| Dueño | T09 |
| Propósito (resumen) | Categorías de encuesta |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `SurveyCategoryId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0024-com.SurveyCategories.sql` | |

### `com.Events`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-25 |
| Colección lógica | `events` |
| Dueño | T09 |
| Propósito (resumen) | Eventos de comunidad |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `EventId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0025-com.Events.sql` | |

### `com.EventRegistrations`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-26 |
| Colección lógica | `eventRegistrations` |
| Dueño | T09 |
| Propósito (resumen) | Inscripciones a eventos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `EventRegistrationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0026-com.EventRegistrations.sql` | |

### `com.BenefitPartners`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-27 |
| Colección lógica | `benefitPartners` |
| Dueño | T09 |
| Propósito (resumen) | Comercios del club de beneficios |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `BenefitPartnerId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0027-com.BenefitPartners.sql` | |

### `com.Benefits`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-28 |
| Colección lógica | `benefits` |
| Dueño | T09 |
| Propósito (resumen) | Beneficios del club (no tarifarios) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `BenefitId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0028-com.Benefits.sql` | |

### `com.BenefitRedemptions`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-29 |
| Colección lógica | `benefitRedemptions` |
| Dueño | T09 |
| Propósito (resumen) | Canjes |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `BenefitRedemptionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0029-com.BenefitRedemptions.sql` | |

### `com.AudienceSegments`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-30 |
| Colección lógica | `audienceSegments` |
| Dueño | T09 |
| Propósito (resumen) | Motor único de audiencias |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `AudienceSegmentId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0030-com.AudienceSegments.sql` | |

### `com.AudienceImportLists`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-31 |
| Colección lógica | `audienceImportLists` |
| Dueño | T09 |
| Propósito (resumen) | Listas importadas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `AudienceImportListId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0031-com.AudienceImportLists.sql` | |

### `com.AudienceImportRows`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-32 |
| Colección lógica | `audienceImportRows` |
| Dueño | T09 |
| Propósito (resumen) | Filas importadas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `AudienceImportRowId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0032-com.AudienceImportRows.sql` | |

### `com.AudienceSnapshots`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-33 |
| Colección lógica | `audienceSnapshots` |
| Dueño | T09 |
| Propósito (resumen) | Foto congelada de audiencia |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `AudienceSnapshotId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0033-com.AudienceSnapshots.sql` | |

### `com.AudienceSnapshotMembers`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-34 |
| Colección lógica | `audienceSnapshotMembers` |
| Dueño | T09 |
| Propósito (resumen) | Miembros de la foto |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `AudienceSnapshotMemberId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0034-com.AudienceSnapshotMembers.sql` | |

### `com.CommunicationTypes`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-35 |
| Colección lógica | `communicationTypes` |
| Dueño | T09 |
| Propósito (resumen) | Tipos de comunicación (`notifKinds`) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `CommunicationTypeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0035-com.CommunicationTypes.sql` | |

### `com.MessageTemplates`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-36 |
| Colección lógica | `messageTemplates` |
| Dueño | T09 |
| Propósito (resumen) | Plantillas de mensaje |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `MessageTemplateId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0036-com.MessageTemplates.sql` | |

### `com.MessageTemplateVersions`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-37 |
| Colección lógica | `messageTemplateVersions` |
| Dueño | T09 |
| Propósito (resumen) | Versiones de plantilla |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `MessageTemplateVersionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0037-com.MessageTemplateVersions.sql` | |

### `com.TemplateVariables`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-38 |
| Colección lógica | `templateVariables` |
| Dueño | T09 |
| Propósito (resumen) | Variables disponibles |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `TemplateVariableId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0038-com.TemplateVariables.sql` | |

### `com.Communications`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-39 |
| Colección lógica | `communications` |
| Dueño | T09 |
| Propósito (resumen) | Comunicación enviada a un destinatario |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `CommunicationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0039-com.Communications.sql` | |

### `com.CommunicationAttempts`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-40 |
| Colección lógica | `communicationAttempts` |
| Dueño | T09 |
| Propósito (resumen) | Intentos por canal |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `CommunicationAttemptId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0040-com.CommunicationAttempts.sql` | |

### `com.CommunicationEvents`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-41 |
| Colección lógica | `communicationEvents` |
| Dueño | T09 |
| Propósito (resumen) | Eventos de entrega (abierto, rebotado) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `CommunicationEventId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0041-com.CommunicationEvents.sql` | |

### `com.TrackedLinks`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-42 |
| Colección lógica | `trackedLinks` |
| Dueño | T09 |
| Propósito (resumen) | Enlaces con seguimiento |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `TrackedLinkId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0042-com.TrackedLinks.sql` | |

### `com.SenderIdentities`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-43 |
| Colección lógica | `senderIdentities` |
| Dueño | T09 |
| Propósito (resumen) | Remitentes verificados |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `SenderIdentityId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0043-com.SenderIdentities.sql` | |

### `com.ChannelSettings`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-44 |
| Colección lógica | `channelSettings` |
| Dueño | T09 |
| Propósito (resumen) | Configuración por canal |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `ChannelSettingId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0044-com.ChannelSettings.sql` | |

### `com.MessagingUsage`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-45 |
| Colección lógica | `messagingUsage` |
| Dueño | T09 |
| Propósito (resumen) | Consumo de mensajería por período |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `MessagingUsageId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0045-com.MessagingUsage.sql` | |

### `com.InternalNotificationRules`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-46 |
| Colección lógica | `internalNotificationRules` |
| Dueño | T09 |
| Propósito (resumen) | Reglas de avisos internos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `InternalNotificationRuleId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0046-com.InternalNotificationRules.sql` | |

### `com.Campaigns`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-47 |
| Colección lógica | `campaigns` |
| Dueño | T09 |
| Propósito (resumen) | Campañas masivas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `CampaignId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0047-com.Campaigns.sql` | |

### `com.InvoiceMessages`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-48 |
| Colección lógica | `invoiceMessages` |
| Dueño | T09 |
| Propósito (resumen) | Mensajes a imprimir en factura por segmento |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `InvoiceMessageId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0048-com.InvoiceMessages.sql` | |

### `com.CommunicationPreferences`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-49 |
| Colección lógica | `communicationPreferences` |
| Dueño | T09 |
| Propósito (resumen) | Preferencias de canal por persona (no consentimientos) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `CommunicationPreferenceId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0049-com.CommunicationPreferences.sql` | |

### ~~`com.ConsentRecords`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-50 |
| Colección lógica | `consentRecords` |
| Dueño | T09 |
| Propósito (resumen) | (mismo nombre que T08, otro esquema) |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-NFR-04 |
| SQL | No crear; ver `A→COL-NFR-04` |
| **Capa B:** canónica T08 — [`nfr.ConsentRecords`](07-catalogo-tablas-sql.md) (§2.26) | |
| **Capa C:** pendiente | |

### `com.SuppressionEntries`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-51 |
| Colección lógica | `suppressionEntries` |
| Dueño | T09 |
| Propósito (resumen) | Lista de supresión por canal |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `SuppressionEntryId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0050-com.SuppressionEntries.sql` | |

### `com.AppNotifications`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-52 |
| Colección lógica | `appNotifications` |
| Dueño | T09 |
| Propósito (resumen) | Bandeja in-app; TTL |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `AppNotificationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0051-com.AppNotifications.sql` | |

### `com.PushSubscriptions`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-53 |
| Colección lógica | `pushSubscriptions` |
| Dueño | T09 |
| Propósito (resumen) | Suscripciones push PWA |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `PushSubscriptionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0052-com.PushSubscriptions.sql` | |

### `com.PlatformNotices`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-54 |
| Colección lógica | `platformNotices` |
| Dueño | T09 |
| Propósito (resumen) | Avisos de plataforma a administradores |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `PlatformNoticeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0053-com.PlatformNotices.sql` | |

### `com.PlatformNoticeReads`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-55 |
| Colección lógica | `platformNoticeReads` |
| Dueño | T09 |
| Propósito (resumen) | Lecturas de avisos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `PlatformNoticeReadId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0054-com.PlatformNoticeReads.sql` | |

### `com.OutageNotices`

| Campo | Valor |
|---|---|
| ID T05 | COL-COM-56 |
| Colección lógica | `outageNotices` |
| Dueño | T09 |
| Propósito (resumen) | Avisos de interrupción por zona |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `OutageNoticeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.23](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/com/0055-com.OutageNotices.sql` | |

## Esquema `con`

### `con.AccountingSettings`

| Campo | Valor |
|---|---|
| ID T05 | COL-CON-01 |
| Colección lógica | `accountingSettings` |
| Dueño | M15 |
| Propósito (resumen) | Parámetros contables (uno por tenant) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `AccountingSettingId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.18](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/con_/0001-con.AccountingSettings.sql` | |

### `con.ChartOfAccounts`

| Campo | Valor |
|---|---|
| ID T05 | COL-CON-02 |
| Colección lógica | `chartOfAccounts` |
| Dueño | M15 |
| Propósito (resumen) | Planes de cuentas (uno operativo por ejercicio) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `ChartOfAccountId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.18](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/con_/0002-con.ChartOfAccounts.sql` | |

### `con.AccountRubrics`

| Campo | Valor |
|---|---|
| ID T05 | COL-CON-03 |
| Colección lógica | `accountRubrics` |
| Dueño | M15 |
| Propósito (resumen) | Rubros contables |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `AccountRubricId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.18](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/con_/0003-con.AccountRubrics.sql` | |

### `con.LedgerAccounts`

| Campo | Valor |
|---|---|
| ID T05 | COL-CON-04 |
| Colección lógica | `ledgerAccounts` |
| Dueño | M15 |
| Propósito (resumen) | Cuentas contables (sin saldos) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `LedgerAccountId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.18](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/con_/0004-con.LedgerAccounts.sql` | |

### `con.AccountRoles`

| Campo | Valor |
|---|---|
| ID T05 | COL-CON-05 |
| Colección lógica | `accountRoles` |
| Dueño | M15 |
| Propósito (resumen) | Roles contables (cuenta por función); incluye `ownTaxExpense` y `ownTaxPayable` (gasto y deuda por impuestos y contribuc |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `AccountRoleId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.18](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/con_/0005-con.AccountRoles.sql` | |

### `con.PostingRules`

| Campo | Valor |
|---|---|
| ID T05 | COL-CON-06 |
| Colección lógica | `postingRules` |
| Dueño | M15 |
| Propósito (resumen) | Reglas de contabilización |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `PostingRuleId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.18](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/con_/0006-con.PostingRules.sql` | |

### `con.AccountingEvents`

| Campo | Valor |
|---|---|
| ID T05 | COL-CON-07 |
| Colección lógica | `accountingEvents` |
| Dueño | M15 |
| Propósito (resumen) | Bandeja de eventos a contabilizar (alto volumen) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `AccountingEventId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.18](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/con_/0007-con.AccountingEvents.sql` | |

### `con.JournalEntries`

| Campo | Valor |
|---|---|
| ID T05 | COL-CON-08 |
| Colección lógica | `journalEntries` |
| Dueño | M15 |
| Propósito (resumen) | Asientos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `JournalEntryId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.18](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/con_/0008-con.JournalEntries.sql` | |

### `con.JournalLines`

| Campo | Valor |
|---|---|
| ID T05 | COL-CON-09 |
| Colección lógica | `journalLines` |
| Dueño | M15 |
| Propósito (resumen) | Renglones de asiento (alto volumen) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `JournalLineId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.18](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/con_/0009-con.JournalLines.sql` | |

### `con.EntryTemplates`

| Campo | Valor |
|---|---|
| ID T05 | COL-CON-10 |
| Colección lógica | `entryTemplates` |
| Dueño | M15 |
| Propósito (resumen) | Modelos de asiento |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `EntryTemplateId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.18](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/con_/0010-con.EntryTemplates.sql` | |

### `con.PostingBatches`

| Campo | Valor |
|---|---|
| ID T05 | COL-CON-11 |
| Colección lógica | `postingBatches` |
| Dueño | M15 |
| Propósito (resumen) | Lotes de contabilización |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `PostingBatcheId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.18](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/con_/0011-con.PostingBatches.sql` | |

### `con.FiscalYears`

| Campo | Valor |
|---|---|
| ID T05 | COL-CON-12 |
| Colección lógica | `fiscalYears` |
| Dueño | M15 |
| Propósito (resumen) | Ejercicios |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `FiscalYearId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.18](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/con_/0012-con.FiscalYears.sql` | |

### `con.AccountingPeriods`

| Campo | Valor |
|---|---|
| ID T05 | COL-CON-13 |
| Colección lógica | `accountingPeriods` |
| Dueño | M15 |
| Propósito (resumen) | Períodos contables |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `AccountingPeriodId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.18](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/con_/0013-con.AccountingPeriods.sql` | |

### `con.ResultTargets`

| Campo | Valor |
|---|---|
| ID T05 | COL-CON-14 |
| Colección lógica | `resultTargets` |
| Dueño | M15 |
| Propósito (resumen) | Destinos de resultado |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `ResultTargetId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.18](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/con_/0014-con.ResultTargets.sql` | |

### ~~`con.CapitalRubricAccounts`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-CON-15 |
| Colección lógica | `capitalRubricAccounts` |
| Dueño | M15 |
| Propósito (resumen) | (cuentas de rubros de capital: van a `entityAccountAssignments` con `entityType: capitalRubric`; el rubro es `capitalIte |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-CON-38 |
| SQL | No crear; ver `A→COL-CON-38` |
| **Capa B:** canónica M15 — [`07` §2.18](07-modelo-relacional-azure-sql.md) `EntityAccountAssignments` | |
| **Capa C:** pendiente | |

### `con.CostCenters`

| Campo | Valor |
|---|---|
| ID T05 | COL-CON-16 |
| Colección lógica | `costCenters` |
| Dueño | M15 |
| Propósito (resumen) | Centros de costo |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `CostCenterId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.18](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/con_/0015-con.CostCenters.sql` | |

### `con.CostCenterGroups`

| Campo | Valor |
|---|---|
| ID T05 | COL-CON-17 |
| Colección lógica | `costCenterGroups` |
| Dueño | M15 |
| Propósito (resumen) | Grupos de centros |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `CostCenterGroupId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.18](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/con_/0016-con.CostCenterGroups.sql` | |

### `con.CostAllocationRules`

| Campo | Valor |
|---|---|
| ID T05 | COL-CON-18 |
| Colección lógica | `costAllocationRules` |
| Dueño | M15 |
| Propósito (resumen) | Reglas de imputación a centros |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `CostAllocationRuleId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.18](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/con_/0017-con.CostAllocationRules.sql` | |

### `con.DistributionModels`

| Campo | Valor |
|---|---|
| ID T05 | COL-CON-19 |
| Colección lógica | `distributionModels` |
| Dueño | M15 |
| Propósito (resumen) | Modelos de reparto |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `DistributionModelId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.18](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/con_/0018-con.DistributionModels.sql` | |

### `con.CostDistributionRuns`

| Campo | Valor |
|---|---|
| ID T05 | COL-CON-20 |
| Colección lógica | `costDistributionRuns` |
| Dueño | M15 |
| Propósito (resumen) | Corridas de reparto |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `CostDistributionRunId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.18](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/con_/0019-con.CostDistributionRuns.sql` | |

### `con.AccountMappings`

| Campo | Valor |
|---|---|
| ID T05 | COL-CON-21 |
| Colección lógica | `accountMappings` |
| Dueño | M15 |
| Propósito (resumen) | Equivalencias entre planes |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `AccountMappingId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.18](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/con_/0020-con.AccountMappings.sql` | |

### `con.SimulationScenarios`

| Campo | Valor |
|---|---|
| ID T05 | COL-CON-22 |
| Colección lógica | `simulationScenarios` |
| Dueño | M15 |
| Propósito (resumen) | Escenarios de simulación |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `SimulationScenarioId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.18](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/con_/0021-con.SimulationScenarios.sql` | |

### `con.SimulatedJournalLines`

| Campo | Valor |
|---|---|
| ID T05 | COL-CON-23 |
| Colección lógica | `simulatedJournalLines` |
| Dueño | M15 |
| Propósito (resumen) | Renglones simulados |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `SimulatedJournalLineId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.18](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/con_/0022-con.SimulatedJournalLines.sql` | |

### `con.LedgerProjections`

| Campo | Valor |
|---|---|
| ID T05 | COL-CON-24 |
| Colección lógica | `ledgerProjections` |
| Dueño | M15 |
| Propósito (resumen) | Proyecciones de mayor |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `LedgerProjectionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.18](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/con_/0023-con.LedgerProjections.sql` | |

### `con.LedgerBalances`

| Campo | Valor |
|---|---|
| ID T05 | COL-CON-25 |
| Colección lógica | `ledgerBalances` |
| Dueño | M15 |
| Propósito (resumen) | Saldos reconstruibles desde `journalLines` |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `LedgerBalanceId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.18](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/con_/0024-con.LedgerBalances.sql` | |

### `con.Budgets`

| Campo | Valor |
|---|---|
| ID T05 | COL-CON-26 |
| Colección lógica | `budgets` |
| Dueño | M15 |
| Propósito (resumen) | Presupuestos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `BudgetId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.18](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/con_/0025-con.Budgets.sql` | |

### `con.BudgetLines`

| Campo | Valor |
|---|---|
| ID T05 | COL-CON-27 |
| Colección lógica | `budgetLines` |
| Dueño | M15 |
| Propósito (resumen) | Líneas de presupuesto |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `BudgetLineId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.18](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/con_/0026-con.BudgetLines.sql` | |

### `con.Commitments`

| Campo | Valor |
|---|---|
| ID T05 | COL-CON-28 |
| Colección lógica | `commitments` |
| Dueño | M15 |
| Propósito (resumen) | Compromisos presupuestarios |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `CommitmentId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.18](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/con_/0027-con.Commitments.sql` | |

### ~~`con.InflationIndexSeries`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-CON-29 |
| Colección lógica | `inflationIndexSeries` |
| Dueño | M15 |
| Propósito (resumen) | (series de inflación: canónica en T04) |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-CFG-21 |
| SQL | No crear; ver `A→COL-CFG-21` |
| **Capa B:** canónica T04 — [`07` §2.3](07-modelo-relacional-azure-sql.md) `EconomicIndexSeries` | |
| **Capa C:** pendiente | |

### ~~`con.InflationIndexValues`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-CON-30 |
| Colección lógica | `inflationIndexValues` |
| Dueño | M15 |
| Propósito (resumen) | (valores de inflación: canónica en T04) |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-CFG-22 |
| SQL | No crear; ver `A→COL-CFG-22` |
| **Capa B:** canónica T04 — [`07` §2.3](07-modelo-relacional-azure-sql.md) `EconomicIndexValues` | |
| **Capa C:** pendiente | |

### `con.InflationAdjustmentRuns`

| Campo | Valor |
|---|---|
| ID T05 | COL-CON-31 |
| Colección lógica | `inflationAdjustmentRuns` |
| Dueño | M15 |
| Propósito (resumen) | Ajuste por inflación contable |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `InflationAdjustmentRunId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.18](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/con_/0028-con.InflationAdjustmentRuns.sql` | |

### `con.ReconciliationRuns`

| Campo | Valor |
|---|---|
| ID T05 | COL-CON-32 |
| Colección lógica | `reconciliationRuns` |
| Dueño | M15 |
| Propósito (resumen) | Conciliación contable con auxiliares |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `ReconciliationRunId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.18](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/con_/0029-con.ReconciliationRuns.sql` | |

### `con.RubricatedBooks`

| Campo | Valor |
|---|---|
| ID T05 | COL-CON-33 |
| Colección lógica | `rubricatedBooks` |
| Dueño | M15 |
| Propósito (resumen) | Libros rubricados |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `RubricatedBookId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.18](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/con_/0030-con.RubricatedBooks.sql` | |

### `con.StatementTemplates`

| Campo | Valor |
|---|---|
| ID T05 | COL-CON-34 |
| Colección lógica | `statementTemplates` |
| Dueño | M15 |
| Propósito (resumen) | Modelos de estados contables |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `StatementTemplateId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.18](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/con_/0031-con.StatementTemplates.sql` | |

### `con.FinancialStatementRuns`

| Campo | Valor |
|---|---|
| ID T05 | COL-CON-35 |
| Colección lógica | `financialStatementRuns` |
| Dueño | M15 |
| Propósito (resumen) | Emisión de estados contables |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `FinancialStatementRunId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.18](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/con_/0032-con.FinancialStatementRuns.sql` | |

### `con.ExternalLedgerMappings`

| Campo | Valor |
|---|---|
| ID T05 | COL-CON-36 |
| Colección lógica | `externalLedgerMappings` |
| Dueño | M15 |
| Propósito (resumen) | Mapeo con contabilidad externa |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `ExternalLedgerMappingId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.18](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/con_/0033-con.ExternalLedgerMappings.sql` | |

### `con.ExternalLedgerTransfers`

| Campo | Valor |
|---|---|
| ID T05 | COL-CON-37 |
| Colección lógica | `externalLedgerTransfers` |
| Dueño | M15 |
| Propósito (resumen) | Exportación/importación con contabilidad externa (convivencia DEC-069) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `ExternalLedgerTransferId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.18](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/con_/0034-con.ExternalLedgerTransfers.sql` | |

### `con.EntityAccountAssignments`

| Campo | Valor |
|---|---|
| ID T05 | COL-CON-38 |
| Colección lógica | `entityAccountAssignments` |
| Dueño | M15 |
| Propósito (resumen) | Cuentas asignadas a entidades de otros módulos (los dueños no guardan `ledgerAccountId`) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `EntityAccountAssignmentId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.18](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/con_/0035-con.EntityAccountAssignments.sql` | |

### `con.CostCenterModels`

| Campo | Valor |
|---|---|
| ID T05 | COL-CON-39 |
| Colección lógica | `costCenterModels` |
| Dueño | M15 |
| Propósito (resumen) | Modelos de centro de costo: reparto fijo (`splits`) o delegado en `distributionModels` (agregada el 5-11-2026 por PA-CON |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `CostCenterModelId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.18](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/con_/0036-con.CostCenterModels.sql` | |

## Esquema `crm`

### `crm.CrmCases`

| Campo | Valor |
|---|---|
| ID T05 | COL-CRM-01 |
| Colección lógica | `crmCases` |
| Dueño | M09 |
| Propósito (resumen) | Expediente único de gestión (solicitudes, reclamos, mesa de entradas) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `CrmCasId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.12](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/crm/0001-crm.CrmCases.sql` | |

### `crm.CrmCaseEvents`

| Campo | Valor |
|---|---|
| ID T05 | COL-CRM-02 |
| Colección lógica | `crmCaseEvents` |
| Dueño | M09 |
| Propósito (resumen) | Historial inmutable del caso |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `CrmCaseEventId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.12](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/crm/0002-crm.CrmCaseEvents.sql` | |

### `crm.CrmConversations`

| Campo | Valor |
|---|---|
| ID T05 | COL-CRM-03 |
| Colección lógica | `crmConversations` |
| Dueño | M09 |
| Propósito (resumen) | Hilos por canal |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O6 |
| Estado T05 | C |
| PK sugerida | `CrmConversationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.12](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/crm/0003-crm.CrmConversations.sql` | |

### `crm.CrmMessages`

| Campo | Valor |
|---|---|
| ID T05 | COL-CRM-04 |
| Colección lógica | `crmMessages` |
| Dueño | M09 |
| Propósito (resumen) | Mensajes y notas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `CrmMessageId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.12](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/crm/0004-crm.CrmMessages.sql` | |

### `crm.CrmInteractions`

| Campo | Valor |
|---|---|
| ID T05 | COL-CRM-05 |
| Colección lógica | `crmInteractions` |
| Dueño | M09 |
| Propósito (resumen) | Historial unificado de interacciones |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `CrmInteractionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.12](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/crm/0005-crm.CrmInteractions.sql` | |

### `crm.CrmCaseTypes`

| Campo | Valor |
|---|---|
| ID T05 | COL-CRM-06 |
| Colección lógica | `crmCaseTypes` |
| Dueño | M09 |
| Propósito (resumen) | Tipos de gestión |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `CrmCaseTypeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.12](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/crm/0006-crm.CrmCaseTypes.sql` | |

### `crm.CrmCaseSubtypes`

| Campo | Valor |
|---|---|
| ID T05 | COL-CRM-07 |
| Colección lógica | `crmCaseSubtypes` |
| Dueño | M09 |
| Propósito (resumen) | Subtipos y motivos; `claimTypeKey` (`dict:crm.claimType`), `externalDerivation` según el convenio de M02 (HUE-CLO-03, HU |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `CrmCaseSubtypeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.12](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/crm/0007-crm.CrmCaseSubtypes.sql` | |

### `crm.CrmStatusSets`

| Campo | Valor |
|---|---|
| ID T05 | COL-CRM-08 |
| Colección lógica | `crmStatusSets` |
| Dueño | M09 |
| Propósito (resumen) | Conjuntos de estados visibles |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `CrmStatusSetId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.12](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/crm/0008-crm.CrmStatusSets.sql` | |

### `crm.CrmAreas`

| Campo | Valor |
|---|---|
| ID T05 | COL-CRM-09 |
| Colección lógica | `crmAreas` |
| Dueño | M09 |
| Propósito (resumen) | Áreas de atención, turnero y actividades (canónica para `areaId` de atención) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `CrmAreaId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.12](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/crm/0009-crm.CrmAreas.sql` | |

### `crm.CrmSlaPolicies`

| Campo | Valor |
|---|---|
| ID T05 | COL-CRM-10 |
| Colección lógica | `crmSlaPolicies` |
| Dueño | M09 |
| Propósito (resumen) | SLA de atención (temporizadores en `slaTimers` de T11); `templateCode` de plantillas de plataforma (ENACOM Res. 733/2017 |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `CrmSlaPolicyId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.12](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/crm/0010-crm.CrmSlaPolicies.sql` | |

### `crm.CrmRoutingRules`

| Campo | Valor |
|---|---|
| ID T05 | COL-CRM-11 |
| Colección lógica | `crmRoutingRules` |
| Dueño | M09 |
| Propósito (resumen) | Derivación sugerida y guardias |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `CrmRoutingRuleId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.12](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/crm/0011-crm.CrmRoutingRules.sql` | |

### `crm.CrmCommandRequests`

| Campo | Valor |
|---|---|
| ID T05 | COL-CRM-12 |
| Colección lógica | `crmCommandRequests` |
| Dueño | M09 |
| Propósito (resumen) | Comandos a módulos dueños |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `CrmCommandRequestId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.12](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/crm/0012-crm.CrmCommandRequests.sql` | |

### `crm.CrmContacts`

| Campo | Valor |
|---|---|
| ID T05 | COL-CRM-13 |
| Colección lógica | `crmContacts` |
| Dueño | M09 |
| Propósito (resumen) | Contactos no titulares |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `CrmContactId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.12](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/crm/0013-crm.CrmContacts.sql` | |

### `crm.CrmIncidents`

| Campo | Valor |
|---|---|
| ID T05 | COL-CRM-14 |
| Colección lógica | `crmIncidents` |
| Dueño | M09 |
| Propósito (resumen) | Incidentes comunes por zona |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `CrmIncidentId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.12](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/crm/0014-crm.CrmIncidents.sql` | |

### `crm.CrmIncidentClasses`

| Campo | Valor |
|---|---|
| ID T05 | COL-CRM-15 |
| Colección lógica | `crmIncidentClasses` |
| Dueño | M09 |
| Propósito (resumen) | Clases de incidente |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `CrmIncidentClassId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.12](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/crm/0015-crm.CrmIncidentClasses.sql` | |

### `crm.CrmProcedureTypes`

| Campo | Valor |
|---|---|
| ID T05 | COL-CRM-16 |
| Colección lógica | `crmProcedureTypes` |
| Dueño | M09 |
| Propósito (resumen) | Tipos de trámite con vencimiento |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `CrmProcedureTypeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.12](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/crm/0016-crm.CrmProcedureTypes.sql` | |

### `crm.CrmProcedureRecords`

| Campo | Valor |
|---|---|
| ID T05 | COL-CRM-17 |
| Colección lógica | `crmProcedureRecords` |
| Dueño | M09 |
| Propósito (resumen) | Trámites presentados |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `CrmProcedureRecordId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.12](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/crm/0017-crm.CrmProcedureRecords.sql` | |

### `crm.CrmProjects`

| Campo | Valor |
|---|---|
| ID T05 | COL-CRM-18 |
| Colección lógica | `crmProjects` |
| Dueño | M09 |
| Propósito (resumen) | Proyectos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `CrmProjectId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.12](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/crm/0018-crm.CrmProjects.sql` | |

### `crm.CrmWorkLogs`

| Campo | Valor |
|---|---|
| ID T05 | COL-CRM-19 |
| Colección lógica | `crmWorkLogs` |
| Dueño | M09 |
| Propósito (resumen) | Registro de tiempo |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `CrmWorkLogId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.12](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/crm/0019-crm.CrmWorkLogs.sql` | |

### `crm.CrmHourBanks`

| Campo | Valor |
|---|---|
| ID T05 | COL-CRM-20 |
| Colección lógica | `crmHourBanks` |
| Dueño | M09 |
| Propósito (resumen) | Bolsas de horas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `CrmHourBankId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.12](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/crm/0020-crm.CrmHourBanks.sql` | |

### `crm.CrmAccountAssignments`

| Campo | Valor |
|---|---|
| ID T05 | COL-CRM-21 |
| Colección lógica | `crmAccountAssignments` |
| Dueño | M09 |
| Propósito (resumen) | Responsables por cuenta |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `CrmAccountAssignmentId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.12](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/crm/0021-crm.CrmAccountAssignments.sql` | |

### `crm.CrmQuickReplies`

| Campo | Valor |
|---|---|
| ID T05 | COL-CRM-22 |
| Colección lógica | `crmQuickReplies` |
| Dueño | M09 |
| Propósito (resumen) | Respuestas rápidas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `CrmQuickReplyId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.12](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/crm/0022-crm.CrmQuickReplies.sql` | |

### `crm.CrmChannels`

| Campo | Valor |
|---|---|
| ID T05 | COL-CRM-23 |
| Colección lógica | `crmChannels` |
| Dueño | M09 |
| Propósito (resumen) | Canales del tenant (único global `{kind, address}` para resolver el tenant de webhooks) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `CrmChannelId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.12](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/crm/0023-crm.CrmChannels.sql` | |

### `crm.CrmBotFlows`

| Campo | Valor |
|---|---|
| ID T05 | COL-CRM-24 |
| Colección lógica | `crmBotFlows` |
| Dueño | M09 |
| Propósito (resumen) | Flujos de bot |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O6 |
| Estado T05 | C |
| PK sugerida | `CrmBotFlowId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.12](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/crm/0024-crm.CrmBotFlows.sql` | |

### `crm.CrmBotSessions`

| Campo | Valor |
|---|---|
| ID T05 | COL-CRM-25 |
| Colección lógica | `crmBotSessions` |
| Dueño | M09 |
| Propósito (resumen) | Sesiones de bot; TTL |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O6 |
| Estado T05 | C |
| PK sugerida | `CrmBotSessionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.12](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/crm/0025-crm.CrmBotSessions.sql` | |

### `crm.CrmAiSuggestions`

| Campo | Valor |
|---|---|
| ID T05 | COL-CRM-26 |
| Colección lógica | `crmAiSuggestions` |
| Dueño | M09 |
| Propósito (resumen) | Sugerencias de IA supervisada |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O6 |
| Estado T05 | C |
| PK sugerida | `CrmAiSuggestionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.12](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/crm/0026-crm.CrmAiSuggestions.sql` | |

### `crm.CrmQueueTickets`

| Campo | Valor |
|---|---|
| ID T05 | COL-CRM-27 |
| Colección lógica | `crmQueueTickets` |
| Dueño | M09 |
| Propósito (resumen) | Turnos del turnero |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `CrmQueueTicketId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.12](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/crm/0027-crm.CrmQueueTickets.sql` | |

### `crm.CrmQueueTicketEvents`

| Campo | Valor |
|---|---|
| ID T05 | COL-CRM-28 |
| Colección lógica | `crmQueueTicketEvents` |
| Dueño | M09 |
| Propósito (resumen) | Historial del turno |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `CrmQueueTicketEventId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.12](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/crm/0028-crm.CrmQueueTicketEvents.sql` | |

### `crm.CrmQueueDeskTypes`

| Campo | Valor |
|---|---|
| ID T05 | COL-CRM-29 |
| Colección lógica | `crmQueueDeskTypes` |
| Dueño | M09 |
| Propósito (resumen) | Tipos de box |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `CrmQueueDeskTypeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.12](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/crm/0029-crm.CrmQueueDeskTypes.sql` | |

### `crm.CrmQueueDesks`

| Campo | Valor |
|---|---|
| ID T05 | COL-CRM-30 |
| Colección lógica | `crmQueueDesks` |
| Dueño | M09 |
| Propósito (resumen) | Boxes |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `CrmQueueDeskId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.12](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/crm/0030-crm.CrmQueueDesks.sql` | |

### `crm.CrmQueueDeskSessions`

| Campo | Valor |
|---|---|
| ID T05 | COL-CRM-31 |
| Colección lógica | `crmQueueDeskSessions` |
| Dueño | M09 |
| Propósito (resumen) | Apertura y cierre de boxes |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `CrmQueueDeskSessionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.12](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/crm/0031-crm.CrmQueueDeskSessions.sql` | |

### `crm.CrmQueueDisplays`

| Campo | Valor |
|---|---|
| ID T05 | COL-CRM-32 |
| Colección lógica | `crmQueueDisplays` |
| Dueño | M09 |
| Propósito (resumen) | Pantallas del turnero |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `CrmQueueDisplayId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.12](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/crm/0032-crm.CrmQueueDisplays.sql` | |

### `crm.CrmQueueAppointments`

| Campo | Valor |
|---|---|
| ID T05 | COL-CRM-33 |
| Colección lógica | `crmQueueAppointments` |
| Dueño | M09 |
| Propósito (resumen) | Reservas de turno |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `CrmQueueAppointmentId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.12](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/crm/0033-crm.CrmQueueAppointments.sql` | |

### `crm.CrmActivityFrequencies`

| Campo | Valor |
|---|---|
| ID T05 | COL-CRM-34 |
| Colección lógica | `crmActivityFrequencies` |
| Dueño | M09 |
| Propósito (resumen) | Frecuencias de actividades internas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `CrmActivityFrequencyId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.12](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/crm/0034-crm.CrmActivityFrequencies.sql` | |

### `crm.CrmActivityRubros`

| Campo | Valor |
|---|---|
| ID T05 | COL-CRM-35 |
| Colección lógica | `crmActivityRubros` |
| Dueño | M09 |
| Propósito (resumen) | Rubros de actividades |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `CrmActivityRubroId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.12](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/crm/0035-crm.CrmActivityRubros.sql` | |

### `crm.CrmActivityTypes`

| Campo | Valor |
|---|---|
| ID T05 | COL-CRM-36 |
| Colección lógica | `crmActivityTypes` |
| Dueño | M09 |
| Propósito (resumen) | Tipos de actividad |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `CrmActivityTypeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.12](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/crm/0036-crm.CrmActivityTypes.sql` | |

### `crm.CrmActivities`

| Campo | Valor |
|---|---|
| ID T05 | COL-CRM-37 |
| Colección lógica | `crmActivities` |
| Dueño | M09 |
| Propósito (resumen) | Actividades internas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `CrmActivityId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.12](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/crm/0037-crm.CrmActivities.sql` | |

### `crm.CrmActivityOccurrences`

| Campo | Valor |
|---|---|
| ID T05 | COL-CRM-38 |
| Colección lógica | `crmActivityOccurrences` |
| Dueño | M09 |
| Propósito (resumen) | Ocurrencias de actividades |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `CrmActivityOccurrenceId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.12](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/crm/0038-crm.CrmActivityOccurrences.sql` | |

### `crm.CrmCalendarEventTypes`

| Campo | Valor |
|---|---|
| ID T05 | COL-CRM-39 |
| Colección lógica | `crmCalendarEventTypes` |
| Dueño | M09 |
| Propósito (resumen) | Tipos de evento de calendario |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `CrmCalendarEventTypeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.12](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/crm/0039-crm.CrmCalendarEventTypes.sql` | |

### `crm.CrmCalendarEvents`

| Campo | Valor |
|---|---|
| ID T05 | COL-CRM-40 |
| Colección lógica | `crmCalendarEvents` |
| Dueño | M09 |
| Propósito (resumen) | Eventos de calendario (se proyectan en `agendaEntries` de T11) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `CrmCalendarEventId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.12](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/crm/0040-crm.CrmCalendarEvents.sql` | |

### `crm.CrmCirculars`

| Campo | Valor |
|---|---|
| ID T05 | COL-CRM-41 |
| Colección lógica | `crmCirculars` |
| Dueño | M09 |
| Propósito (resumen) | Modelos de circular |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O6 |
| Estado T05 | C |
| PK sugerida | `CrmCircularId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.12](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/crm/0041-crm.CrmCirculars.sql` | |

### `crm.CrmCircularRuns`

| Campo | Valor |
|---|---|
| ID T05 | COL-CRM-42 |
| Colección lógica | `crmCircularRuns` |
| Dueño | M09 |
| Propósito (resumen) | Corridas de circulares |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O6 |
| Estado T05 | C |
| PK sugerida | `CrmCircularRunId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.12](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/crm/0042-crm.CrmCircularRuns.sql` | |

## Esquema `fac`

### `fac.BillingCycles`

| Campo | Valor |
|---|---|
| ID T05 | COL-FAC-01 |
| Colección lógica | `billingCycles` |
| Dueño | M05 |
| Propósito (resumen) | Ciclo de facturación por servicio y universo |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `BillingCycleId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.7](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fac/0001-fac.BillingCycles.sql` | |

### `fac.BillingUniverses`

| Campo | Valor |
|---|---|
| ID T05 | COL-FAC-02 |
| Colección lógica | `billingUniverses` |
| Dueño | M05 |
| Propósito (resumen) | Criterio de pertenencia |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `BillingUniversId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.7](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fac/0002-fac.BillingUniverses.sql` | |

### `fac.BillingTemplates`

| Campo | Valor |
|---|---|
| ID T05 | COL-FAC-03 |
| Colección lógica | `billingTemplates` |
| Dueño | M05 |
| Propósito (resumen) | Plantilla de corrida versionada |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `BillingTemplateId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.7](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fac/0003-fac.BillingTemplates.sql` | |

### ~~`fac.BillingHolds`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-FAC-04 |
| Colección lógica | `billingHolds` |
| Dueño | M05 |
| Propósito (resumen) | (no facturar: canónica `blocks` de M01) |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-PER-13 |
| SQL | No crear; ver `A→COL-PER-13` |
| **Capa B:** [`07` §2.7](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** pendiente | |

### `fac.BillingRuns`

| Campo | Valor |
|---|---|
| ID T05 | COL-FAC-05 |
| Colección lógica | `billingRuns` |
| Dueño | M05 |
| Propósito (resumen) | Lote de facturación |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `BillingRunId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.7](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fac/0004-fac.BillingRuns.sql` | |

### `fac.BillingRunItems`

| Campo | Valor |
|---|---|
| ID T05 | COL-FAC-06 |
| Colección lógica | `billingRunItems` |
| Dueño | M05 |
| Propósito (resumen) | Caso del universo congelado (alto volumen); `preReview` (HUE-ELE-02) y `serviceDependencies[]` entre servicios relaciona |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `BillingRunItemId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.7](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fac/0005-fac.BillingRunItems.sql` | |

### `fac.BillingRunNumberRanges`

| Campo | Valor |
|---|---|
| ID T05 | COL-FAC-07 |
| Colección lógica | `billingRunNumberRanges` |
| Dueño | M05 |
| Propósito (resumen) | Rangos de numeración emitidos (números definitivos; provisorio mientras haya comprobantes CAE sin autorizar). `authoriza |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `BillingRunNumberRangeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.7](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fac/0006-fac.BillingRunNumberRanges.sql` | |

### `fac.BillingExceptions`

| Campo | Valor |
|---|---|
| ID T05 | COL-FAC-08 |
| Colección lógica | `billingExceptions` |
| Dueño | M05 |
| Propósito (resumen) | Bandeja de excepciones |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `BillingExceptionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.7](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fac/0007-fac.BillingExceptions.sql` | |

### `fac.BillingExceptionReasons`

| Campo | Valor |
|---|---|
| ID T05 | COL-FAC-09 |
| Colección lógica | `billingExceptionReasons` |
| Dueño | M05 |
| Propósito (resumen) | Motivos de excepción |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `BillingExceptionReasonId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.7](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fac/0008-fac.BillingExceptionReasons.sql` | |

### `fac.BilledPeriods`

| Campo | Valor |
|---|---|
| ID T05 | COL-FAC-10 |
| Colección lógica | `billedPeriods` |
| Dueño | M05 |
| Propósito (resumen) | Marca anti doble facturación |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `BilledPeriodId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.7](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fac/0009-fac.BilledPeriods.sql` | |

### `fac.BillableItems`

| Campo | Valor |
|---|---|
| ID T05 | COL-FAC-11 |
| Colección lógica | `billableItems` |
| Dueño | M05 |
| Propósito (resumen) | Ítems facturables pendientes (canónica; absorbe `preloadedCharges` de M04) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `BillableItemId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.7](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fac/0010-fac.BillableItems.sql` | |

### `fac.InvoiceDrafts`

| Campo | Valor |
|---|---|
| ID T05 | COL-FAC-12 |
| Colección lógica | `invoiceDrafts` |
| Dueño | M05 |
| Propósito (resumen) | Borradores de factura manual |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `InvoiceDraftId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.7](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fac/0011-fac.InvoiceDrafts.sql` | |

### `fac.Invoices`

| Campo | Valor |
|---|---|
| ID T05 | COL-FAC-13 |
| Colección lógica | `invoices` |
| Dueño | M05 |
| Propósito (resumen) | Comprobante emitido con renglones embebidos (alto volumen). Con DEC-107 el comprobante con CAE en línea que ARCA rechaza |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `InvoiceId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.7](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fac/0012-fac.Invoices.sql` | |

### `fac.InvoiceRelations`

| Campo | Valor |
|---|---|
| ID T05 | COL-FAC-14 |
| Colección lógica | `invoiceRelations` |
| Dueño | M05 |
| Propósito (resumen) | Relaciones entre comprobantes |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `InvoiceRelationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.7](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fac/0013-fac.InvoiceRelations.sql` | |

### ~~`fac.InvoiceBlockReasons`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-FAC-15 |
| Colección lógica | `invoiceBlockReasons` |
| Dueño | M05 |
| Propósito (resumen) | (motivos de bloqueo: canónica `holdReasons` de M08) |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-MOR-11 |
| SQL | No crear; ver `A→COL-MOR-11` |
| **Capa B:** [`07` §2.7](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** pendiente | |

### ~~`fac.InvoiceBlockHistory`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-FAC-16 |
| Colección lógica | `invoiceBlockHistory` |
| Dueño | M05 |
| Propósito (resumen) | (historia de bloqueos: canónica `documentHolds` de M08) |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-MOR-12 |
| SQL | No crear; ver `A→COL-MOR-12` |
| **Capa B:** [`07` §2.7](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** pendiente | |

### `fac.InvoiceAnnulmentRequests`

| Campo | Valor |
|---|---|
| ID T05 | COL-FAC-17 |
| Colección lógica | `invoiceAnnulmentRequests` |
| Dueño | M05 |
| Propósito (resumen) | Solicitudes de anulación o reversión |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `InvoiceAnnulmentRequestId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.7](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fac/0014-fac.InvoiceAnnulmentRequests.sql` | |

### `fac.VoucherTypes`

| Campo | Valor |
|---|---|
| ID T05 | COL-FAC-18 |
| Colección lógica | `voucherTypes` |
| Dueño | M05 |
| Propósito (resumen) | Tipos de comprobante (canónica para `COMPROB`) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `VoucherTypeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.7](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fac/0015-fac.VoucherTypes.sql` | |

### `fac.VoucherResolutionRules`

| Campo | Valor |
|---|---|
| ID T05 | COL-FAC-19 |
| Colección lógica | `voucherResolutionRules` |
| Dueño | M05 |
| Propósito (resumen) | Matriz tipo de comprobante por condición fiscal |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `VoucherResolutionRuleId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.7](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fac/0016-fac.VoucherResolutionRules.sql` | |

### ~~`fac.PointsOfSale`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-FAC-20 |
| Colección lógica | `pointsOfSale` |
| Dueño | M05 |
| Propósito (resumen) | (punto de venta único: canónica en M06) |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-FIS-09 |
| SQL | No crear; ver `A→COL-FIS-09` |
| **Capa B:** [`07` §2.7](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** pendiente | |

### `fac.NumberSequences`

| Campo | Valor |
|---|---|
| ID T05 | COL-FAC-21 |
| Colección lógica | `numberSequences` |
| Dueño | M05 |
| Propósito (resumen) | Numeración fiscal por tipo, punto de venta y talonario (`$inc` en la emisión). `authorizationType` (`CAE`, `CAEA`, `CAI` |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `NumberSequenceId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.7](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fac/0017-fac.NumberSequences.sql` | |

### `fac.BillingModePolicies`

| Campo | Valor |
|---|---|
| ID T05 | COL-FAC-22 |
| Colección lógica | `billingModePolicies` |
| Dueño | M05 |
| Propósito (resumen) | Modalidad separada/agrupada |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `BillingModePolicyId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.7](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fac/0018-fac.BillingModePolicies.sql` | |

### `fac.BillingGroups`

| Campo | Valor |
|---|---|
| ID T05 | COL-FAC-23 |
| Colección lógica | `billingGroups` |
| Dueño | M05 |
| Propósito (resumen) | Grupos de facturación (FAC-006) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `BillingGroupId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.7](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fac/0019-fac.BillingGroups.sql` | |

### `fac.DueDateSchemes`

| Campo | Valor |
|---|---|
| ID T05 | COL-FAC-24 |
| Colección lógica | `dueDateSchemes` |
| Dueño | M05 |
| Propósito (resumen) | Esquema de vencimientos (fechas; el recargo vive en M08); `lateAuthorizationGraceDays` opcional (días de gracia para cor |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `DueDateSchemeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.7](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fac/0020-fac.DueDateSchemes.sql` | |

### `fac.MassOperations`

| Campo | Valor |
|---|---|
| ID T05 | COL-FAC-25 |
| Colección lógica | `massOperations` |
| Dueño | M05 |
| Propósito (resumen) | Operaciones masivas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `MassOperationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.7](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fac/0021-fac.MassOperations.sql` | |

### `fac.MassOperationItems`

| Campo | Valor |
|---|---|
| ID T05 | COL-FAC-26 |
| Colección lógica | `massOperationItems` |
| Dueño | M05 |
| Propósito (resumen) | Ítems de operación masiva |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `MassOperationItemId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.7](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fac/0022-fac.MassOperationItems.sql` | |

### `fac.BillingImports`

| Campo | Valor |
|---|---|
| ID T05 | COL-FAC-27 |
| Colección lógica | `billingImports` |
| Dueño | M05 |
| Propósito (resumen) | Importaciones de facturación |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `BillingImportId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.7](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fac/0023-fac.BillingImports.sql` | |

### `fac.BillingImportRows`

| Campo | Valor |
|---|---|
| ID T05 | COL-FAC-28 |
| Colección lógica | `billingImportRows` |
| Dueño | M05 |
| Propósito (resumen) | Filas importadas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `BillingImportRowId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.7](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fac/0024-fac.BillingImportRows.sql` | |

### `fac.InvoiceExternalData`

| Campo | Valor |
|---|---|
| ID T05 | COL-FAC-29 |
| Colección lógica | `invoiceExternalData` |
| Dueño | M05 |
| Propósito (resumen) | Datos de terceros a imprimir |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `InvoiceExternalDataId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.7](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fac/0025-fac.InvoiceExternalData.sql` | |

### `fac.InvoiceTemplates`

| Campo | Valor |
|---|---|
| ID T05 | COL-FAC-30 |
| Colección lógica | `invoiceTemplates` |
| Dueño | M05 |
| Propósito (resumen) | Reglas de selección de plantilla (el diseño vive en T11 `templateVersions`) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `InvoiceTemplateId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.7](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fac/0026-fac.InvoiceTemplates.sql` | |

### `fac.InvoiceLineOrders`

| Campo | Valor |
|---|---|
| ID T05 | COL-FAC-31 |
| Colección lógica | `invoiceLineOrders` |
| Dueño | M05 |
| Propósito (resumen) | Orden de renglones |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `InvoiceLineOrderId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.7](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fac/0027-fac.InvoiceLineOrders.sql` | |

### `fac.ConsumptionChartGroups`

| Campo | Valor |
|---|---|
| ID T05 | COL-FAC-32 |
| Colección lógica | `consumptionChartGroups` |
| Dueño | M05 |
| Propósito (resumen) | Grupos de gráfico de consumo |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `ConsumptionChartGroupId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.7](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fac/0028-fac.ConsumptionChartGroups.sql` | |

### `fac.BarcodeFormats`

| Campo | Valor |
|---|---|
| ID T05 | COL-FAC-33 |
| Colección lógica | `barcodeFormats` |
| Dueño | M05 |
| Propósito (resumen) | Formatos declarativos de código de barras. `dueDateCapacity` (int ≥ 1): vencimientos que el formato codifica, derivada d |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `BarcodeFormatId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.7](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fac/0029-fac.BarcodeFormats.sql` | |

### `fac.BarcodeAssignments`

| Campo | Valor |
|---|---|
| ID T05 | COL-FAC-34 |
| Colección lógica | `barcodeAssignments` |
| Dueño | M05 |
| Propósito (resumen) | Asignación de formatos por recaudador |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `BarcodeAssignmentId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.7](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fac/0030-fac.BarcodeAssignments.sql` | |

### `fac.PaymentSlips`

| Campo | Valor |
|---|---|
| ID T05 | COL-FAC-35 |
| Colección lógica | `paymentSlips` |
| Dueño | M05 |
| Propósito (resumen) | Talones sumados y de cuota (el cupón único vive en M07). `dueDates[] {index, date, amount}` de 1 a N, hasta el tope efec |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `PaymentSlipId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.7](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fac/0031-fac.PaymentSlips.sql` | |

### `fac.InvoiceDocuments`

| Campo | Valor |
|---|---|
| ID T05 | COL-FAC-36 |
| Colección lógica | `invoiceDocuments` |
| Dueño | M05 |
| Propósito (resumen) | PDF por versión del comprobante (índice hacia `storedFiles`/`documents`) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `InvoiceDocumentId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.7](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fac/0032-fac.InvoiceDocuments.sql` | |

### `fac.DeliveryPreferences`

| Campo | Valor |
|---|---|
| ID T05 | COL-FAC-37 |
| Colección lógica | `deliveryPreferences` |
| Dueño | M05 |
| Propósito (resumen) | Canal de entrega de factura (contactos referidos a M01) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `DeliveryPreferenceId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.7](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fac/0033-fac.DeliveryPreferences.sql` | |

### `fac.DistributionRuns`

| Campo | Valor |
|---|---|
| ID T05 | COL-FAC-38 |
| Colección lógica | `distributionRuns` |
| Dueño | M05 |
| Propósito (resumen) | Corridas de distribución |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `DistributionRunId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.7](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fac/0034-fac.DistributionRuns.sql` | |

### `fac.InvoiceDeliveries`

| Campo | Valor |
|---|---|
| ID T05 | COL-FAC-39 |
| Colección lógica | `invoiceDeliveries` |
| Dueño | M05 |
| Propósito (resumen) | Entrega por comprobante y canal (alto volumen) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `InvoiceDeliveryId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.7](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fac/0035-fac.InvoiceDeliveries.sql` | |

### `fac.DistributionRoutes`

| Campo | Valor |
|---|---|
| ID T05 | COL-FAC-40 |
| Colección lógica | `distributionRoutes` |
| Dueño | M05 |
| Propósito (resumen) | Recorridos de reparto |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `DistributionRouteId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.7](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fac/0036-fac.DistributionRoutes.sql` | |

### `fac.PostalCarriers`

| Campo | Valor |
|---|---|
| ID T05 | COL-FAC-41 |
| Colección lógica | `postalCarriers` |
| Dueño | M05 |
| Propósito (resumen) | Empresas postales y fletes (canónica para `postalCompanies` de M01) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `PostalCarrierId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.7](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fac/0037-fac.PostalCarriers.sql` | |

### `fac.BillingCycleClosures`

| Campo | Valor |
|---|---|
| ID T05 | COL-FAC-42 |
| Colección lógica | `billingCycleClosures` |
| Dueño | M05 |
| Propósito (resumen) | Acta de cierre de ciclo |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `BillingCycleClosureId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.7](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fac/0038-fac.BillingCycleClosures.sql` | |

## Esquema `fis`

### `fis.NormativeTables`

| Campo | Valor |
|---|---|
| ID T05 | COL-FIS-01 |
| Colección lógica | `normativeTables` |
| Dueño | M06 |
| Propósito (resumen) | Catálogo de tablas normativas fiscales y regulatorias |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `NormativeTableId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.9](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fis/0001-fis.NormativeTables.sql` | |

### `fis.NormativeTableVersions`

| Campo | Valor |
|---|---|
| ID T05 | COL-FIS-02 |
| Colección lógica | `normativeTableVersions` |
| Dueño | M06 |
| Propósito (resumen) | Versiones publicadas con filas |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `NormativeTableVersionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.9](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fis/0002-fis.NormativeTableVersions.sql` | |

### `fis.NormativeAdoptions`

| Campo | Valor |
|---|---|
| ID T05 | COL-FIS-03 |
| Colección lógica | `normativeAdoptions` |
| Dueño | M06 |
| Propósito (resumen) | Adopción por tenant con filas propias |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `NormativeAdoptionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.9](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fis/0003-fis.NormativeAdoptions.sql` | |

### `fis.FiscalProfiles`

| Campo | Valor |
|---|---|
| ID T05 | COL-FIS-04 |
| Colección lógica | `fiscalProfiles` |
| Dueño | M06 |
| Propósito (resumen) | Perfil fiscal del emisor por entidad jurídica |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `FiscalProfileId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.9](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fis/0004-fis.FiscalProfiles.sql` | |

### `fis.FiscalSurveys`

| Campo | Valor |
|---|---|
| ID T05 | COL-FIS-05 |
| Colección lógica | `fiscalSurveys` |
| Dueño | M06 |
| Propósito (resumen) | Relevamiento fiscal (BASE §52.4) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `FiscalSurveyId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.9](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fis/0005-fis.FiscalSurveys.sql` | |

### `fis.TaxAgentRegistrations`

| Campo | Valor |
|---|---|
| ID T05 | COL-FIS-06 |
| Colección lógica | `taxAgentRegistrations` |
| Dueño | M06 |
| Propósito (resumen) | Condiciones de agente de retención/percepción |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `TaxAgentRegistrationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.9](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fis/0006-fis.TaxAgentRegistrations.sql` | |

### `fis.ArcaCredentials`

| Campo | Valor |
|---|---|
| ID T05 | COL-FIS-07 |
| Colección lógica | `arcaCredentials` |
| Dueño | M06 |
| Propósito (resumen) | Metadatos de certificado ARCA (el secreto en T06) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `ArcaCredentialId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.9](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fis/0007-fis.ArcaCredentials.sql` | |

### `fis.ArcaAccessTickets`

| Campo | Valor |
|---|---|
| ID T05 | COL-FIS-08 |
| Colección lógica | `arcaAccessTickets` |
| Dueño | M06 |
| Propósito (resumen) | Ticket WSAA cifrado; TTL por `expirationTime` |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `ArcaAccessTicketId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.9](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fis/0008-fis.ArcaAccessTickets.sql` | |

### `fis.PointsOfSale`

| Campo | Valor |
|---|---|
| ID T05 | COL-FIS-09 |
| Colección lógica | `pointsOfSale` |
| Dueño | M06 |
| Propósito (resumen) | Punto de venta único (fiscal y operativo); absorbe `pointsOfSale` de M05; declarado en M06 como `fiscalPointsOfSale` |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C (antes `R`) |
| PK sugerida | `PointsOfSaleId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.9](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fis/0009-fis.PointsOfSale.sql` | |

### `fis.FiscalAuthorizations`

| Campo | Valor |
|---|---|
| ID T05 | COL-FIS-10 |
| Colección lógica | `fiscalAuthorizations` |
| Dueño | M06 |
| Propósito (resumen) | Cola de autorización CAE/CAEA/CAI/CESP. Con DEC-107: `issueAttempt` (int, intento de emisión de `invoices.issueAttempt`; |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `FiscalAuthorizationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.9](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fis/0010-fis.FiscalAuthorizations.sql` | |

### `fis.ArcaSubmissions`

| Campo | Valor |
|---|---|
| ID T05 | COL-FIS-11 |
| Colección lógica | `arcaSubmissions` |
| Dueño | M06 |
| Propósito (resumen) | Envíos a ARCA (cuerpos saneados en almacenamiento privado) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `ArcaSubmissionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.9](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fis/0011-fis.ArcaSubmissions.sql` | |

### `fis.CaeaPeriods`

| Campo | Valor |
|---|---|
| ID T05 | COL-FIS-12 |
| Colección lógica | `caeaPeriods` |
| Dueño | M06 |
| Propósito (resumen) | Períodos CAEA |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `CaeaPeriodId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.9](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fis/0012-fis.CaeaPeriods.sql` | |

### `fis.CespAuthorizations`

| Campo | Valor |
|---|---|
| ID T05 | COL-FIS-13 |
| Colección lógica | `cespAuthorizations` |
| Dueño | M06 |
| Propósito (resumen) | Autorizaciones CESP |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `CespAuthorizationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.9](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fis/0013-fis.CespAuthorizations.sql` | |

### `fis.ProvincialValidationCodes`

| Campo | Valor |
|---|---|
| ID T05 | COL-FIS-14 |
| Colección lógica | `provincialValidationCodes` |
| Dueño | M06 |
| Propósito (resumen) | Códigos de validación provincial |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `ProvincialValidationCodeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.9](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fis/0014-fis.ProvincialValidationCodes.sql` | |

### `fis.VatConditionSettings`

| Campo | Valor |
|---|---|
| ID T05 | COL-FIS-15 |
| Colección lógica | `vatConditionSettings` |
| Dueño | M06 |
| Propósito (resumen) | Condiciones IVA del tenant (canónica; absorbe `vatConditions` de T04) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `VatConditionSettingId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.9](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fis/0015-fis.VatConditionSettings.sql` | |

### `fis.VatRates`

| Campo | Valor |
|---|---|
| ID T05 | COL-FIS-16 |
| Colección lógica | `vatRates` |
| Dueño | M06 |
| Propósito (resumen) | Alícuotas de IVA (canónica; absorbe la de T04) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `VatRateId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.9](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fis/0016-fis.VatRates.sql` | |

### `fis.VatRateMatrix`

| Campo | Valor |
|---|---|
| ID T05 | COL-FIS-17 |
| Colección lógica | `vatRateMatrix` |
| Dueño | M06 |
| Propósito (resumen) | Matriz alícuota × condición; condición opcional por uso del suministro, desactivada por defecto (PRM-FIS-125; DEC-102, P |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `VatRateMatrixId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.9](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fis/0017-fis.VatRateMatrix.sql` | |

### `fis.TaxDefinitions`

| Campo | Valor |
|---|---|
| ID T05 | COL-FIS-18 |
| Colección lógica | `taxDefinitions` |
| Dueño | M06 |
| Propósito (resumen) | Tributos, percepciones y conceptos fiscales; `nature` (incluye `thirdPartyTax` y `pendingClassification`, no publicable) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `TaxDefinitionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.9](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fis/0018-fis.TaxDefinitions.sql` | |

### `fis.GrossIncomeSettings`

| Campo | Valor |
|---|---|
| ID T05 | COL-FIS-19 |
| Colección lógica | `grossIncomeSettings` |
| Dueño | M06 |
| Propósito (resumen) | Ingresos brutos versionado (absorbe `grossIncomeConditions`/`grossIncomeRates` de T04) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `GrossIncomeSettingId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.9](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fis/0019-fis.GrossIncomeSettings.sql` | |

### `fis.TaxpayerRegistries`

| Campo | Valor |
|---|---|
| ID T05 | COL-FIS-20 |
| Colección lógica | `taxpayerRegistries` |
| Dueño | M06 |
| Propósito (resumen) | Padrones importados (absorbe `taxRegistries` de T04) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `TaxpayerRegistryId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.9](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fis/0020-fis.TaxpayerRegistries.sql` | |

### `fis.TaxpayerRegistryEntries`

| Campo | Valor |
|---|---|
| ID T05 | COL-FIS-21 |
| Colección lógica | `taxpayerRegistryEntries` |
| Dueño | M06 |
| Propósito (resumen) | Filas de padrón (alto volumen) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `TaxpayerRegistryEntryId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.9](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fis/0021-fis.TaxpayerRegistryEntries.sql` | |

### `fis.DeterminedRates`

| Campo | Valor |
|---|---|
| ID T05 | COL-FIS-22 |
| Colección lógica | `determinedRates` |
| Dueño | M06 |
| Propósito (resumen) | Alícuota determinada por cuenta |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `DeterminedRateId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.9](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fis/0022-fis.DeterminedRates.sql` | |

### `fis.TaxExemptions`

| Campo | Valor |
|---|---|
| ID T05 | COL-FIS-23 |
| Colección lógica | `taxExemptions` |
| Dueño | M06 |
| Propósito (resumen) | Exclusiones y certificados |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `TaxExemptionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.9](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fis/0023-fis.TaxExemptions.sql` | |

### `fis.TaxCalculationTraces`

| Campo | Valor |
|---|---|
| ID T05 | COL-FIS-24 |
| Colección lógica | `taxCalculationTraces` |
| Dueño | M06 |
| Propósito (resumen) | Traza de cálculo fiscal por documento; `lines[].supplyUsageId` guarda el uso del suministro aplicado por la matriz de IV |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `TaxCalculationTraceId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.9](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fis/0024-fis.TaxCalculationTraces.sql` | |

### `fis.WithholdingTypes`

| Campo | Valor |
|---|---|
| ID T05 | COL-FIS-25 |
| Colección lógica | `withholdingTypes` |
| Dueño | M06 |
| Propósito (resumen) | Tipos de retención |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `WithholdingTypeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.9](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fis/0025-fis.WithholdingTypes.sql` | |

### `fis.WithholdingScales`

| Campo | Valor |
|---|---|
| ID T05 | COL-FIS-26 |
| Colección lógica | `withholdingScales` |
| Dueño | M06 |
| Propósito (resumen) | Escalas de retención |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `WithholdingScaleId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.9](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fis/0026-fis.WithholdingScales.sql` | |

### `fis.WithholdingAssignments`

| Campo | Valor |
|---|---|
| ID T05 | COL-FIS-27 |
| Colección lógica | `withholdingAssignments` |
| Dueño | M06 |
| Propósito (resumen) | Asignación de retenciones |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `WithholdingAssignmentId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.9](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fis/0027-fis.WithholdingAssignments.sql` | |

### `fis.WithholdingsApplied`

| Campo | Valor |
|---|---|
| ID T05 | COL-FIS-28 |
| Colección lógica | `withholdingsApplied` |
| Dueño | M06 |
| Propósito (resumen) | Retenciones practicadas con certificado; la identidad fiscal del retenido es la persona de M01 del proveedor (`supplierP |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `WithholdingsAppliedId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.9](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fis/0028-fis.WithholdingsApplied.sql` | |

### `fis.WithholdingSufferedTypes`

| Campo | Valor |
|---|---|
| ID T05 | COL-FIS-29 |
| Colección lógica | `withholdingSufferedTypes` |
| Dueño | M06 |
| Propósito (resumen) | Tipos de retención sufrida |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `WithholdingSufferedTypeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.9](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fis/0029-fis.WithholdingSufferedTypes.sql` | |

### `fis.TaxObligations`

| Campo | Valor |
|---|---|
| ID T05 | COL-FIS-30 |
| Colección lógica | `taxObligations` |
| Dueño | M06 |
| Propósito (resumen) | Obligaciones fiscales a pagar, como agente o como contribuyente; exactamente una de las dos referencias de origen (10-11 |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `TaxObligationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.9](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fis/0030-fis.TaxObligations.sql` | |

### `fis.VatLedgers`

| Campo | Valor |
|---|---|
| ID T05 | COL-FIS-31 |
| Colección lógica | `vatLedgers` |
| Dueño | M06 |
| Propósito (resumen) | Libros IVA por período |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `VatLedgerId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.9](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fis/0031-fis.VatLedgers.sql` | |

### `fis.VatLedgerLines`

| Campo | Valor |
|---|---|
| ID T05 | COL-FIS-32 |
| Colección lógica | `vatLedgerLines` |
| Dueño | M06 |
| Propósito (resumen) | Líneas del libro (alto volumen) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `VatLedgerLineId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.9](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fis/0032-fis.VatLedgerLines.sql` | |

### `fis.ArcaReceivedImports`

| Campo | Valor |
|---|---|
| ID T05 | COL-FIS-33 |
| Colección lógica | `arcaReceivedImports` |
| Dueño | M06 |
| Propósito (resumen) | Importación de Mis Comprobantes |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `ArcaReceivedImportId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.9](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fis/0033-fis.ArcaReceivedImports.sql` | |

### `fis.VatReconciliations`

| Campo | Valor |
|---|---|
| ID T05 | COL-FIS-34 |
| Colección lógica | `vatReconciliations` |
| Dueño | M06 |
| Propósito (resumen) | Conciliación con ARCA |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `VatReconciliationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.9](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fis/0034-fis.VatReconciliations.sql` | |

### `fis.InformationRegimes`

| Campo | Valor |
|---|---|
| ID T05 | COL-FIS-35 |
| Colección lógica | `informationRegimes` |
| Dueño | M06 |
| Propósito (resumen) | Regímenes informativos (referencia `fileLayouts`) |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `InformationRegimeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.9](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fis/0035-fis.InformationRegimes.sql` | |

### `fis.RegimeFilings`

| Campo | Valor |
|---|---|
| ID T05 | COL-FIS-36 |
| Colección lógica | `regimeFilings` |
| Dueño | M06 |
| Propósito (resumen) | Presentaciones de regímenes |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `RegimeFilingId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.9](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fis/0036-fis.RegimeFilings.sql` | |

### `fis.ThirdPartyAgreements`

| Campo | Valor |
|---|---|
| ID T05 | COL-FIS-37 |
| Colección lógica | `thirdPartyAgreements` |
| Dueño | M06 |
| Propósito (resumen) | Convenios de cobro por cuenta de terceros; `moraPolicy` (saldo de terceros en mora y recargo, HUECO-TAS-02); los concept |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `ThirdPartyAgreementId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.9](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fis/0037-fis.ThirdPartyAgreements.sql` | |

### `fis.ThirdPartyCharges`

| Campo | Valor |
|---|---|
| ID T05 | COL-FIS-38 |
| Colección lógica | `thirdPartyCharges` |
| Dueño | M06 |
| Propósito (resumen) | Cargos de terceros facturados |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `ThirdPartyChargeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.9](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fis/0038-fis.ThirdPartyCharges.sql` | |

### `fis.ThirdPartyRemittances`

| Campo | Valor |
|---|---|
| ID T05 | COL-FIS-39 |
| Colección lógica | `thirdPartyRemittances` |
| Dueño | M06 |
| Propósito (resumen) | Rendiciones a terceros |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `ThirdPartyRemittanceId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.9](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fis/0039-fis.ThirdPartyRemittances.sql` | |

### `fis.RegulatoryReports`

| Campo | Valor |
|---|---|
| ID T05 | COL-FIS-40 |
| Colección lógica | `regulatoryReports` |
| Dueño | M06 |
| Propósito (resumen) | Catálogo de informes a reguladores |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `RegulatoryReportId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.9](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fis/0040-fis.RegulatoryReports.sql` | |

### `fis.RegulatoryReportRuns`

| Campo | Valor |
|---|---|
| ID T05 | COL-FIS-41 |
| Colección lógica | `regulatoryReportRuns` |
| Dueño | M06 |
| Propósito (resumen) | Presentaciones a reguladores |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `RegulatoryReportRunId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.9](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fis/0041-fis.RegulatoryReportRuns.sql` | |

### `fis.RegulatoryConceptMaps`

| Campo | Valor |
|---|---|
| ID T05 | COL-FIS-42 |
| Colección lógica | `regulatoryConceptMaps` |
| Dueño | M06 |
| Propósito (resumen) | Mapeo de conceptos por informe |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `RegulatoryConceptMapId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.9](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fis/0042-fis.RegulatoryConceptMaps.sql` | |

### `fis.PublicAdminSelections`

| Campo | Valor |
|---|---|
| ID T05 | COL-FIS-43 |
| Colección lógica | `publicAdminSelections` |
| Dueño | M06 |
| Propósito (resumen) | Selecciones de comprobantes de administración pública |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `PublicAdminSelectionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.9](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fis/0043-fis.PublicAdminSelections.sql` | |

### `fis.GatewayDocuments`

| Campo | Valor |
|---|---|
| ID T05 | COL-FIS-44 |
| Colección lógica | `gatewayDocuments` |
| Dueño | M06 |
| Propósito (resumen) | Documentos en modo pasarela |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `GatewayDocumentId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.9](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fis/0044-fis.GatewayDocuments.sql` | |

### `fis.FiscalDeadlines`

| Campo | Valor |
|---|---|
| ID T05 | COL-FIS-45 |
| Colección lógica | `fiscalDeadlines` |
| Dueño | M06 |
| Propósito (resumen) | Vencimientos fiscales |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `FiscalDeadlineId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.9](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fis/0045-fis.FiscalDeadlines.sql` | |

### `fis.ConceptFiscalCases`

| Campo | Valor |
|---|---|
| ID T05 | COL-FIS-46 |
| Colección lógica | `conceptFiscalCases` |
| Dueño | M06 |
| Propósito (resumen) | Casos fiscales por concepto: aporte de capital no gravado (`ImpTotConc`) y derechos de sepultura por concepto (M06 §7.37 |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `ConceptFiscalCasId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.9](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fis/0046-fis.ConceptFiscalCases.sql` | |

### `fis.FiscalClasses`

| Campo | Valor |
|---|---|
| ID T05 | COL-FIS-47 |
| Colección lógica | `fiscalClasses` |
| Dueño | M06 |
| Propósito (resumen) | Clases fiscales (las usa `billableConcepts.fiscalClassId` de M02; agregada el 5-11-2026 por PA-FIS-21, M06 §7.38) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 (antes O4; decisión del coordinador del 5-11-2026 para que `billableConcepts.fiscalClassId` no apunte a una ola posterior) |
| Estado T05 | C |
| PK sugerida | `FiscalClassId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.9](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fis/0047-fis.FiscalClasses.sql` | |

### `fis.OwnTaxObligations`

| Campo | Valor |
|---|---|
| ID T05 | COL-FIS-48 |
| Colección lógica | `ownTaxObligations` |
| Dueño | M06 |
| Propósito (resumen) | Obligaciones y exenciones propias de la cooperativa como contribuyente, no como agente (tipo `exemption`, `partialExempt |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 (la de RF-FIS-169; `taxObligations.ownTaxObligationId`, de O5, es opcional hasta O8) |
| Estado T05 | C |
| PK sugerida | `OwnTaxObligationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.9](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/fis/0048-fis.OwnTaxObligations.sql` | |

## Esquema `ins`

### `ins.AssociateMemberships`

| Campo | Valor |
|---|---|
| ID T05 | COL-INS-01 |
| Colección lógica | `associateMemberships` |
| Dueño | M17 |
| Propósito (resumen) | Relación institucional del asociado; declarada en M17 como `memberships`, que choca con `memberships` de T02 (CTR-DAT-09 |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C (antes `R`) |
| PK sugerida | `AssociateMembershipId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.20](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ins/0001-ins.AssociateMemberships.sql` | |

### `ins.MembershipEvents`

| Campo | Valor |
|---|---|
| ID T05 | COL-INS-02 |
| Colección lógica | `membershipEvents` |
| Dueño | M17 |
| Propósito (resumen) | Historia de la membresía |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `MembershipEventId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.20](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ins/0002-ins.MembershipEvents.sql` | |

### ~~`ins.InsNumberingSeries`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-INS-03 |
| Colección lógica | `insNumberingSeries` |
| Dueño | M17 |
| Propósito (resumen) | (series de numeración: `numberingSequences` de T11) |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-WFL-45 |
| SQL | No crear; ver `A→COL-WFL-45` |
| **Capa B:** canónica T11 — [`wfl.NumberingSequences`](07-catalogo-tablas-sql.md) (§2.25) | |
| **Capa C:** pendiente | |

### `ins.ElectoralDistricts`

| Campo | Valor |
|---|---|
| ID T05 | COL-INS-04 |
| Colección lógica | `electoralDistricts` |
| Dueño | M17 |
| Propósito (resumen) | Distritos electorales |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `ElectoralDistrictId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.20](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ins/0003-ins.ElectoralDistricts.sql` | |

### `ins.CapitalItems`

| Campo | Valor |
|---|---|
| ID T05 | COL-INS-05 |
| Colección lógica | `capitalItems` |
| Dueño | M17 |
| Propósito (resumen) | Rubros de capital (sin `ledgerAccountId`: la cuenta va a `entityAccountAssignments`) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `CapitalItemId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.20](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ins/0004-ins.CapitalItems.sql` | |

### `ins.CapitalSubscriptionRules`

| Campo | Valor |
|---|---|
| ID T05 | COL-INS-06 |
| Colección lógica | `capitalSubscriptionRules` |
| Dueño | M17 |
| Propósito (resumen) | Reglas de suscripción |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `CapitalSubscriptionRuleId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.20](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ins/0005-ins.CapitalSubscriptionRules.sql` | |

### `ins.CapitalShareValues`

| Campo | Valor |
|---|---|
| ID T05 | COL-INS-07 |
| Colección lógica | `capitalShareValues` |
| Dueño | M17 |
| Propósito (resumen) | Valor nominal de la cuota social, por entidad jurídica |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `CapitalShareValueId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.20](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ins/0006-ins.CapitalShareValues.sql` | |

### `ins.CapitalMovements`

| Campo | Valor |
|---|---|
| ID T05 | COL-INS-08 |
| Colección lógica | `capitalMovements` |
| Dueño | M17 |
| Propósito (resumen) | Libro mayor de capital (económico) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `CapitalMovementId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.20](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ins/0007-ins.CapitalMovements.sql` | |

### `ins.CapitalReserves`

| Campo | Valor |
|---|---|
| ID T05 | COL-INS-09 |
| Colección lógica | `capitalReserves` |
| Dueño | M17 |
| Propósito (resumen) | Reservas de capital |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `CapitalReserveId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.20](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ins/0008-ins.CapitalReserves.sql` | |

### `ins.CapitalTransfers`

| Campo | Valor |
|---|---|
| ID T05 | COL-INS-10 |
| Colección lógica | `capitalTransfers` |
| Dueño | M17 |
| Propósito (resumen) | Transferencias de capital |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `CapitalTransferId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.20](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ins/0009-ins.CapitalTransfers.sql` | |

### `ins.CapitalRefunds`

| Campo | Valor |
|---|---|
| ID T05 | COL-INS-11 |
| Colección lógica | `capitalRefunds` |
| Dueño | M17 |
| Propósito (resumen) | Reembolsos de capital |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `CapitalRefundId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.20](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ins/0010-ins.CapitalRefunds.sql` | |

### `ins.CapitalClosings`

| Campo | Valor |
|---|---|
| ID T05 | COL-INS-12 |
| Colección lógica | `capitalClosings` |
| Dueño | M17 |
| Propósito (resumen) | Cierres de capital por entidad jurídica. Al cerrar se congela la base de capital de la entidad en `capitalBase` (`asOf`, |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `CapitalClosingId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.20](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ins/0011-ins.CapitalClosings.sql` | |

### `ins.ShareCertificates`

| Campo | Valor |
|---|---|
| ID T05 | COL-INS-13 |
| Colección lógica | `shareCertificates` |
| Dueño | M17 |
| Propósito (resumen) | Certificados de aportación |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `ShareCertificateId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.20](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ins/0012-ins.ShareCertificates.sql` | |

### `ins.SurplusDistributions`

| Campo | Valor |
|---|---|
| ID T05 | COL-INS-14 |
| Colección lógica | `surplusDistributions` |
| Dueño | M17 |
| Propósito (resumen) | Distribución de excedentes |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `SurplusDistributionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.20](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ins/0013-ins.SurplusDistributions.sql` | |

### `ins.SurplusAllocations`

| Campo | Valor |
|---|---|
| ID T05 | COL-INS-15 |
| Colección lógica | `surplusAllocations` |
| Dueño | M17 |
| Propósito (resumen) | Retornos por asociado |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `SurplusAllocationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.20](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ins/0014-ins.SurplusAllocations.sql` | |

### `ins.GovernanceBodies`

| Campo | Valor |
|---|---|
| ID T05 | COL-INS-16 |
| Colección lógica | `governanceBodies` |
| Dueño | M17 |
| Propósito (resumen) | Órganos (consejo, sindicatura, comisiones) de cada entidad jurídica |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `GovernanceBodyId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.20](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ins/0015-ins.GovernanceBodies.sql` | |

### `ins.BodyMandates`

| Campo | Valor |
|---|---|
| ID T05 | COL-INS-17 |
| Colección lógica | `bodyMandates` |
| Dueño | M17 |
| Propósito (resumen) | Mandatos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `BodyMandateId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.20](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ins/0016-ins.BodyMandates.sql` | |

### `ins.Meetings`

| Campo | Valor |
|---|---|
| ID T05 | COL-INS-18 |
| Colección lógica | `meetings` |
| Dueño | M17 |
| Propósito (resumen) | Reuniones y asambleas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `MeetingId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.20](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ins/0017-ins.Meetings.sql` | |

### `ins.MeetingAgendaItems`

| Campo | Valor |
|---|---|
| ID T05 | COL-INS-19 |
| Colección lógica | `meetingAgendaItems` |
| Dueño | M17 |
| Propósito (resumen) | Orden del día |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `MeetingAgendaItemId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.20](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ins/0018-ins.MeetingAgendaItems.sql` | |

### `ins.MeetingParticipants`

| Campo | Valor |
|---|---|
| ID T05 | COL-INS-20 |
| Colección lógica | `meetingParticipants` |
| Dueño | M17 |
| Propósito (resumen) | Asistencia |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `MeetingParticipantId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.20](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ins/0019-ins.MeetingParticipants.sql` | |

### `ins.MeetingPermissions`

| Campo | Valor |
|---|---|
| ID T05 | COL-INS-21 |
| Colección lógica | `meetingPermissions` |
| Dueño | M17 |
| Propósito (resumen) | Acceso a reuniones reservadas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `MeetingPermissionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.20](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ins/0020-ins.MeetingPermissions.sql` | |

### `ins.Minutes`

| Campo | Valor |
|---|---|
| ID T05 | COL-INS-22 |
| Colección lógica | `minutes` |
| Dueño | M17 |
| Propósito (resumen) | Actas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `MinuteId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.20](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ins/0021-ins.Minutes.sql` | |

### `ins.Resolutions`

| Campo | Valor |
|---|---|
| ID T05 | COL-INS-23 |
| Colección lógica | `resolutions` |
| Dueño | M17 |
| Propósito (resumen) | Resoluciones |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `ResolutionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.20](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ins/0022-ins.Resolutions.sql` | |

### `ins.Rosters`

| Campo | Valor |
|---|---|
| ID T05 | COL-INS-24 |
| Colección lógica | `rosters` |
| Dueño | M17 |
| Propósito (resumen) | Padrones (solo membresías de la entidad de la asamblea) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `RosterId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.20](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ins/0023-ins.Rosters.sql` | |

### `ins.RosterEntries`

| Campo | Valor |
|---|---|
| ID T05 | COL-INS-25 |
| Colección lógica | `rosterEntries` |
| Dueño | M17 |
| Propósito (resumen) | Renglones del padrón (alto volumen por asamblea) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `RosterEntryId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.20](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ins/0024-ins.RosterEntries.sql` | |

### `ins.Proxies`

| Campo | Valor |
|---|---|
| ID T05 | COL-INS-26 |
| Colección lógica | `proxies` |
| Dueño | M17 |
| Propósito (resumen) | Poderes |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `ProxyId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.20](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ins/0025-ins.Proxies.sql` | |

### `ins.ElectoralLists`

| Campo | Valor |
|---|---|
| ID T05 | COL-INS-27 |
| Colección lógica | `electoralLists` |
| Dueño | M17 |
| Propósito (resumen) | Listas electorales |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `ElectoralListId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.20](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ins/0026-ins.ElectoralLists.sql` | |

### `ins.VotingSessions`

| Campo | Valor |
|---|---|
| ID T05 | COL-INS-28 |
| Colección lógica | `votingSessions` |
| Dueño | M17 |
| Propósito (resumen) | Votaciones |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `VotingSessionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.20](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ins/0027-ins.VotingSessions.sql` | |

### `ins.VoteTallies`

| Campo | Valor |
|---|---|
| ID T05 | COL-INS-29 |
| Colección lógica | `voteTallies` |
| Dueño | M17 |
| Propósito (resumen) | Escrutinios (sin voto nominal en voto secreto) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `VoteTallyId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.20](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ins/0028-ins.VoteTallies.sql` | |

### `ins.InstitutionalFees`

| Campo | Valor |
|---|---|
| ID T05 | COL-INS-30 |
| Colección lógica | `institutionalFees` |
| Dueño | M17 |
| Propósito (resumen) | Retribuciones a consejeros |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `InstitutionalFeeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.20](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ins/0029-ins.InstitutionalFees.sql` | |

### `ins.InstitutionalFeeSettlements`

| Campo | Valor |
|---|---|
| ID T05 | COL-INS-31 |
| Colección lógica | `institutionalFeeSettlements` |
| Dueño | M17 |
| Propósito (resumen) | Liquidación de retribuciones |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `InstitutionalFeeSettlementId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.20](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ins/0030-ins.InstitutionalFeeSettlements.sql` | |

### `ins.InaesCategories`

| Campo | Valor |
|---|---|
| ID T05 | COL-INS-32 |
| Colección lógica | `inaesCategories` |
| Dueño | M17 |
| Propósito (resumen) | Categorías INAES |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `InaesCategoryId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.20](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ins/0031-ins.InaesCategories.sql` | |

### `ins.InaesReports`

| Campo | Valor |
|---|---|
| ID T05 | COL-INS-33 |
| Colección lógica | `inaesReports` |
| Dueño | M17 |
| Propósito (resumen) | Presentaciones INAES |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `InaesReportId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.20](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ins/0032-ins.InaesReports.sql` | |

### `ins.AssociateRegisterEditions`

| Campo | Valor |
|---|---|
| ID T05 | COL-INS-34 |
| Colección lógica | `associateRegisterEditions` |
| Dueño | M17 |
| Propósito (resumen) | Ediciones del registro de asociados (folios y ediciones correlativos por entidad) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `AssociateRegisterEditionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.20](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ins/0033-ins.AssociateRegisterEditions.sql` | |

### `ins.MemberCredentials`

| Campo | Valor |
|---|---|
| ID T05 | COL-INS-35 |
| Colección lógica | `memberCredentials` |
| Dueño | M17 |
| Propósito (resumen) | Credenciales del asociado |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `MemberCredentialId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.20](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ins/0034-ins.MemberCredentials.sql` | |

### `ins.CapitalBalances`

| Campo | Valor |
|---|---|
| ID T05 | COL-INS-36 |
| Colección lógica | `capitalBalances` |
| Dueño | M17 |
| Propósito (resumen) | Saldo de capital por asociado (proyección materializada de `capitalMovements`, no es fuente de verdad; RF-INS-046, HUECO |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `CapitalBalanceId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.20](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ins/0035-ins.CapitalBalances.sql` | |

## Esquema `int`

### `int.IntegrationProviders`

| Campo | Valor |
|---|---|
| ID T05 | COL-INT-01 |
| Colección lógica | `integrationProviders` |
| Dueño | T06 |
| Propósito (resumen) | Catálogo de proveedores y adaptadores |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `IntegrationProviderId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.24](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/int/0001-int.IntegrationProviders.sql` | |

### `int.IntegrationConnections`

| Campo | Valor |
|---|---|
| ID T05 | COL-INT-02 |
| Colección lógica | `integrationConnections` |
| Dueño | T06 |
| Propósito (resumen) | Conexión del tenant con un proveedor |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `IntegrationConnectionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.24](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/int/0002-int.IntegrationConnections.sql` | |

### `int.IntegrationSecrets`

| Campo | Valor |
|---|---|
| ID T05 | COL-INT-03 |
| Colección lógica | `integrationSecrets` |
| Dueño | T06 |
| Propósito (resumen) | Bóveda: secretos cifrados por sobre con KMS (DEC-074) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `IntegrationSecretId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.24](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/int/0003-int.IntegrationSecrets.sql` | |

### `int.IntegrationCertificates`

| Campo | Valor |
|---|---|
| ID T05 | COL-INT-04 |
| Colección lógica | `integrationCertificates` |
| Dueño | T06 |
| Propósito (resumen) | Metadatos de certificados (vence, emisor, alias) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `IntegrationCertificateId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.24](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/int/0004-int.IntegrationCertificates.sql` | |

### `int.IntegrationTokens`

| Campo | Valor |
|---|---|
| ID T05 | COL-INT-05 |
| Colección lógica | `integrationTokens` |
| Dueño | T06 |
| Propósito (resumen) | Espejo de metadatos de tokens (valor en Redis); TTL |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `IntegrationTokenId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.24](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/int/0005-int.IntegrationTokens.sql` | |

### `int.IntegrationOperations`

| Campo | Valor |
|---|---|
| ID T05 | COL-INT-06 |
| Colección lógica | `integrationOperations` |
| Dueño | T06 |
| Propósito (resumen) | Bitácora de operaciones con proveedores |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `IntegrationOperationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.24](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/int/0006-int.IntegrationOperations.sql` | |

### `int.IntegrationMessages`

| Campo | Valor |
|---|---|
| ID T05 | COL-INT-07 |
| Colección lógica | `integrationMessages` |
| Dueño | T06 |
| Propósito (resumen) | Mensajes saneados de request/response; TTL de cuerpos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `IntegrationMessageId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.24](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/int/0007-int.IntegrationMessages.sql` | |

### `int.WebhookEndpoints`

| Campo | Valor |
|---|---|
| ID T05 | COL-INT-08 |
| Colección lógica | `webhookEndpoints` |
| Dueño | T06 |
| Propósito (resumen) | Endpoints de entrada por proveedor |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `WebhookEndpointId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.24](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/int/0008-int.WebhookEndpoints.sql` | |

### `int.WebhookInbox`

| Campo | Valor |
|---|---|
| ID T05 | COL-INT-09 |
| Colección lógica | `webhookInbox` |
| Dueño | T06 |
| Propósito (resumen) | Webhooks recibidos crudos; TTL |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `WebhookInboxId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.24](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/int/0009-int.WebhookInbox.sql` | |

### `int.FileLayouts`

| Campo | Valor |
|---|---|
| ID T05 | COL-INT-10 |
| Colección lógica | `fileLayouts` |
| Dueño | T06 |
| Propósito (resumen) | Motor declarativo de layouts (canónica; absorbe `fileLayouts` de M07 y `statutoryFileLayouts` de M16) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `FileLayoutId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.24](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/int/0010-int.FileLayouts.sql` | |

### `int.IntegrationFileExchanges`

| Campo | Valor |
|---|---|
| ID T05 | COL-INT-11 |
| Colección lógica | `integrationFileExchanges` |
| Dueño | T06 |
| Propósito (resumen) | Archivos enviados/recibidos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `IntegrationFileExchangeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.24](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/int/0011-int.IntegrationFileExchanges.sql` | |

### `int.IntegrationReconciliations`

| Campo | Valor |
|---|---|
| ID T05 | COL-INT-12 |
| Colección lógica | `integrationReconciliations` |
| Dueño | T06 |
| Propósito (resumen) | Conciliaciones técnicas con proveedores |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `IntegrationReconciliationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.24](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/int/0012-int.IntegrationReconciliations.sql` | |

### `int.IntegrationAlerts`

| Campo | Valor |
|---|---|
| ID T05 | COL-INT-13 |
| Colección lógica | `integrationAlerts` |
| Dueño | T06 |
| Propósito (resumen) | Alertas de integración |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `IntegrationAlertId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.24](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/int/0013-int.IntegrationAlerts.sql` | |

### `int.IntegrationContingencies`

| Campo | Valor |
|---|---|
| ID T05 | COL-INT-14 |
| Colección lógica | `integrationContingencies` |
| Dueño | T06 |
| Propósito (resumen) | Contingencias declaradas (ARCA caída, pasarela caída) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `IntegrationContingencyId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.24](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/int/0014-int.IntegrationContingencies.sql` | |

### `int.ExternalReferences`

| Campo | Valor |
|---|---|
| ID T05 | COL-INT-15 |
| Colección lógica | `externalReferences` |
| Dueño | T06 |
| Propósito (resumen) | Identificadores externos de entidades propias |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `ExternalReferenceId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.24](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/int/0015-int.ExternalReferences.sql` | |

### `int.LocalAgents`

| Campo | Valor |
|---|---|
| ID T05 | COL-INT-16 |
| Colección lógica | `localAgents` |
| Dueño | T06 |
| Propósito (resumen) | Agentes de hardware local registrados |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `LocalAgentId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.24](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/int/0016-int.LocalAgents.sql` | |

### `int.LocalAgentCommands`

| Campo | Valor |
|---|---|
| ID T05 | COL-INT-17 |
| Colección lógica | `localAgentCommands` |
| Dueño | T06 |
| Propósito (resumen) | Comandos al agente local; TTL |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `LocalAgentCommandId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.24](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/int/0017-int.LocalAgentCommands.sql` | |

### `int.AiUsageLogs`

| Campo | Valor |
|---|---|
| ID T05 | COL-INT-18 |
| Colección lógica | `aiUsageLogs` |
| Dueño | T06 |
| Propósito (resumen) | Llamadas a IA por request (costo, modelo, tokens) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `AiUsageLogId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.24](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/int/0018-int.AiUsageLogs.sql` | |

## Esquema `med`

### `med.MeterBrands`

| Campo | Valor |
|---|---|
| ID T05 | COL-MED-01 |
| Colección lógica | `meterBrands` |
| Dueño | M03 |
| Propósito (resumen) | Marcas de medidor |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `MeterBrandId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.6](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/med/0001-med.MeterBrands.sql` | |

### `med.MeterTypes`

| Campo | Valor |
|---|---|
| ID T05 | COL-MED-02 |
| Colección lógica | `meterTypes` |
| Dueño | M03 |
| Propósito (resumen) | Tipos/modelos con registros |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `MeterTypeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.6](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/med/0002-med.MeterTypes.sql` | |

### `med.ReadingObservationCodes`

| Campo | Valor |
|---|---|
| ID T05 | COL-MED-03 |
| Colección lógica | `readingObservationCodes` |
| Dueño | M03 |
| Propósito (resumen) | Observaciones de lectura |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `ReadingObservationCodeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.6](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/med/0003-med.ReadingObservationCodes.sql` | |

### `med.ReadingResultCodes`

| Campo | Valor |
|---|---|
| ID T05 | COL-MED-04 |
| Colección lógica | `readingResultCodes` |
| Dueño | M03 |
| Propósito (resumen) | Resultados de lectura |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `ReadingResultCodeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.6](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/med/0004-med.ReadingResultCodes.sql` | |

### `med.ReadingConditionCodes`

| Campo | Valor |
|---|---|
| ID T05 | COL-MED-05 |
| Colección lógica | `readingConditionCodes` |
| Dueño | M03 |
| Propósito (resumen) | Condiciones de lectura |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `ReadingConditionCodeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.6](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/med/0005-med.ReadingConditionCodes.sql` | |

### `med.MeterObservationCodes`

| Campo | Valor |
|---|---|
| ID T05 | COL-MED-06 |
| Colección lógica | `meterObservationCodes` |
| Dueño | M03 |
| Propósito (resumen) | Observaciones de medidor |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `MeterObservationCodeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.6](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/med/0006-med.MeterObservationCodes.sql` | |

### `med.Meters`

| Campo | Valor |
|---|---|
| ID T05 | COL-MED-07 |
| Colección lógica | `meters` |
| Dueño | M03 |
| Propósito (resumen) | Ficha metrológica |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `MeterId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.6](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/med/0007-med.Meters.sql` | |

### `med.MeteringPoints`

| Campo | Valor |
|---|---|
| ID T05 | COL-MED-08 |
| Colección lógica | `meteringPoints` |
| Dueño | M03 |
| Propósito (resumen) | Punto de medición |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `MeteringPointId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.6](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/med/0008-med.MeteringPoints.sql` | |

### `med.MeteringChannels`

| Campo | Valor |
|---|---|
| ID T05 | COL-MED-09 |
| Colección lógica | `meteringChannels` |
| Dueño | M03 |
| Propósito (resumen) | Canales del punto |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `MeteringChannelId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.6](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/med/0009-med.MeteringChannels.sql` | |

### `med.MeterInstallations`

| Campo | Valor |
|---|---|
| ID T05 | COL-MED-10 |
| Colección lógica | `meterInstallations` |
| Dueño | M03 |
| Propósito (resumen) | Colocación y retiro |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `MeterInstallationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.6](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/med/0010-med.MeterInstallations.sql` | |

### ~~`med.MeterSeals`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-MED-11 |
| Colección lógica | `meterSeals` |
| Dueño | M03 |
| Propósito (resumen) | (precintos: canónica `seals` de M10) |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-TEC-50 |
| SQL | No crear; ver `A→COL-TEC-50` |
| **Capa B:** [`07` §2.6](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** pendiente | |

### `med.MeterTests`

| Campo | Valor |
|---|---|
| ID T05 | COL-MED-12 |
| Colección lógica | `meterTests` |
| Dueño | M03 |
| Propósito (resumen) | Ensayos y contrastes |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `MeterTestId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.6](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/med/0011-med.MeterTests.sql` | |

### `med.ReadingRoutes`

| Campo | Valor |
|---|---|
| ID T05 | COL-MED-13 |
| Colección lógica | `readingRoutes` |
| Dueño | M03 |
| Propósito (resumen) | Rutas de lectura |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `ReadingRouteId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.6](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/med/0012-med.ReadingRoutes.sql` | |

### `med.ReadingCalendars`

| Campo | Valor |
|---|---|
| ID T05 | COL-MED-14 |
| Colección lógica | `readingCalendars` |
| Dueño | M03 |
| Propósito (resumen) | Cronograma de lectura |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `ReadingCalendarId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.6](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/med/0013-med.ReadingCalendars.sql` | |

### `med.ReadingBatches`

| Campo | Valor |
|---|---|
| ID T05 | COL-MED-15 |
| Colección lógica | `readingBatches` |
| Dueño | M03 |
| Propósito (resumen) | Lotes de lectura |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `ReadingBatcheId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.6](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/med/0014-med.ReadingBatches.sql` | |

### `med.ReadingTasks`

| Campo | Valor |
|---|---|
| ID T05 | COL-MED-16 |
| Colección lógica | `readingTasks` |
| Dueño | M03 |
| Propósito (resumen) | Tareas de lectura |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `ReadingTaskId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.6](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/med/0015-med.ReadingTasks.sql` | |

### `med.ReaderWorkSessions`

| Campo | Valor |
|---|---|
| ID T05 | COL-MED-17 |
| Colección lógica | `readerWorkSessions` |
| Dueño | M03 |
| Propósito (resumen) | Jornadas del lecturista |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `ReaderWorkSessionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.6](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/med/0016-med.ReaderWorkSessions.sql` | |

### `med.MeterReadings`

| Campo | Valor |
|---|---|
| ID T05 | COL-MED-18 |
| Colección lógica | `meterReadings` |
| Dueño | M03 |
| Propósito (resumen) | Lecturas (alto volumen) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `MeterReadingId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.6](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/med/0017-med.MeterReadings.sql` | |

### `med.Consumptions`

| Campo | Valor |
|---|---|
| ID T05 | COL-MED-19 |
| Colección lógica | `consumptions` |
| Dueño | M03 |
| Propósito (resumen) | Consumos por canal e intervalo (alto volumen) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `ConsumptionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.6](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/med/0018-med.Consumptions.sql` | |

### `med.ConsumptionExceptions`

| Campo | Valor |
|---|---|
| ID T05 | COL-MED-20 |
| Colección lógica | `consumptionExceptions` |
| Dueño | M03 |
| Propósito (resumen) | Excepciones de consumo |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `ConsumptionExceptionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.6](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/med/0019-med.ConsumptionExceptions.sql` | |

### `med.ConsumptionAdjustments`

| Campo | Valor |
|---|---|
| ID T05 | COL-MED-21 |
| Colección lógica | `consumptionAdjustments` |
| Dueño | M03 |
| Propósito (resumen) | Ajustes y regularizaciones |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `ConsumptionAdjustmentId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.6](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/med/0020-med.ConsumptionAdjustments.sql` | |

### `med.ConsumptionDistributions`

| Campo | Valor |
|---|---|
| ID T05 | COL-MED-22 |
| Colección lógica | `consumptionDistributions` |
| Dueño | M03 |
| Propósito (resumen) | Distribución padre-hijos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `ConsumptionDistributionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.6](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/med/0021-med.ConsumptionDistributions.sql` | |

### `med.DemandDeclarations`

| Campo | Valor |
|---|---|
| ID T05 | COL-MED-23 |
| Colección lógica | `demandDeclarations` |
| Dueño | M03 |
| Propósito (resumen) | Demanda contratada y declarada |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `DemandDeclarationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.6](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/med/0022-med.DemandDeclarations.sql` | |

### `med.DemandTransgressions`

| Campo | Valor |
|---|---|
| ID T05 | COL-MED-24 |
| Colección lógica | `demandTransgressions` |
| Dueño | M03 |
| Propósito (resumen) | Transgresiones de demanda |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `DemandTransgressionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.6](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/med/0023-med.DemandTransgressions.sql` | |

### ~~`med.GasCorrectionFactors`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-MED-25 |
| Colección lógica | `gasCorrectionFactors` |
| Dueño | M03 |
| Propósito (resumen) | (factores de gas: canónica `gasCalorificFactors` de M04, DEC-085 y HUE-GAS-03 opción A; M03 los lee por API y conserva s |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-TAR-10 |
| SQL | No crear; ver `A→COL-TAR-10` |
| **Capa B:** [`07` §2.6](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** pendiente | |

### `med.ReadingImportProfiles`

| Campo | Valor |
|---|---|
| ID T05 | COL-MED-26 |
| Colección lógica | `readingImportProfiles` |
| Dueño | M03 |
| Propósito (resumen) | Perfiles de importación (referencian `fileLayouts`) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `ReadingImportProfileId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.6](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/med/0024-med.ReadingImportProfiles.sql` | |

### `med.ReadingImportJobs`

| Campo | Valor |
|---|---|
| ID T05 | COL-MED-27 |
| Colección lógica | `readingImportJobs` |
| Dueño | M03 |
| Propósito (resumen) | Archivos de lecturas importados |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `ReadingImportJobId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.6](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/med/0025-med.ReadingImportJobs.sql` | |

### `med.MeteringSystems`

| Campo | Valor |
|---|---|
| ID T05 | COL-MED-28 |
| Colección lógica | `meteringSystems` |
| Dueño | M03 |
| Propósito (resumen) | Sistemas de telemedición/prepago (dominio sobre `integrationConnections`) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `MeteringSystemId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.6](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/med/0026-med.MeteringSystems.sql` | |

### `med.TelemetryRegisterMappings`

| Campo | Valor |
|---|---|
| ID T05 | COL-MED-29 |
| Colección lógica | `telemetryRegisterMappings` |
| Dueño | M03 |
| Propósito (resumen) | Mapeo de registros remotos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `TelemetryRegisterMappingId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.6](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/med/0027-med.TelemetryRegisterMappings.sql` | |

### `med.RemoteMeterOperations`

| Campo | Valor |
|---|---|
| ID T05 | COL-MED-30 |
| Colección lógica | `remoteMeterOperations` |
| Dueño | M03 |
| Propósito (resumen) | Comandos remotos a medidores |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `RemoteMeterOperationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.6](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/med/0028-med.RemoteMeterOperations.sql` | |

### ~~`med.MeteringConnectorLogs`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-MED-31 |
| Colección lógica | `meteringConnectorLogs` |
| Dueño | M03 |
| Propósito (resumen) | (bitácora técnica de llamadas: T06) |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-INT-07 |
| SQL | No crear; ver `A→COL-INT-07` |
| **Capa B:** canónica T06 — [`int.IntegrationMessages`](07-catalogo-tablas-sql.md) (§2.24) | |
| **Capa C:** pendiente | |

### `med.IntervalReadings`

| Campo | Valor |
|---|---|
| ID T05 | COL-MED-32 |
| Colección lógica | `intervalReadings` |
| Dueño | M03 |
| Propósito (resumen) | Curvas de carga (colección time series, PA-MED-03) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `IntervalReadingId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.6](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/med/0029-med.IntervalReadings.sql` | |

### `med.PrepaidAccounts`

| Campo | Valor |
|---|---|
| ID T05 | COL-MED-33 |
| Colección lógica | `prepaidAccounts` |
| Dueño | M03 |
| Propósito (resumen) | Cuenta prepaga técnica del punto |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `PrepaidAccountId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.6](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/med/0030-med.PrepaidAccounts.sql` | |

### `med.PrepaidTopUps`

| Campo | Valor |
|---|---|
| ID T05 | COL-MED-34 |
| Colección lógica | `prepaidTopUps` |
| Dueño | M03 |
| Propósito (resumen) | Recargas prepagas (token cifrado) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `PrepaidTopUpId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.6](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/med/0031-med.PrepaidTopUps.sql` | |

### `med.DistributedGenerationContracts`

| Campo | Valor |
|---|---|
| ID T05 | COL-MED-35 |
| Colección lógica | `distributedGenerationContracts` |
| Dueño | M03 |
| Propósito (resumen) | Contrato técnico del usuario-generador (canónica; absorbe `generationAgreements` de M02) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `DistributedGenerationContractId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.6](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/med/0032-med.DistributedGenerationContracts.sql` | |

### `med.InjectionBalances`

| Campo | Valor |
|---|---|
| ID T05 | COL-MED-36 |
| Colección lógica | `injectionBalances` |
| Dueño | M03 |
| Propósito (resumen) | Balance de energía inyectada por período |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `InjectionBalanceId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.6](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/med/0033-med.InjectionBalances.sql` | |

### `med.ConsumptionClassReviews`

| Campo | Valor |
|---|---|
| ID T05 | COL-MED-37 |
| Colección lógica | `consumptionClassReviews` |
| Dueño | M03 |
| Propósito (resumen) | Propuestas de cambio de clase por consumo |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `ConsumptionClassReviewId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.6](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/med/0034-med.ConsumptionClassReviews.sql` | |

## Esquema `mig`

### `mig.MigrationProjects`

| Campo | Valor |
|---|---|
| ID T05 | COL-MIG-01 |
| Colección lógica | `migrationProjects` |
| Dueño | T07 |
| Propósito (resumen) | Proyecto de migración por cooperativa |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `MigrationProjectId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.27](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mig/0001-mig.MigrationProjects.sql` | |

### `mig.LegacySnapshots`

| Campo | Valor |
|---|---|
| ID T05 | COL-MIG-02 |
| Colección lógica | `legacySnapshots` |
| Dueño | T07 |
| Propósito (resumen) | Copias del origen (metadatos; binarios en almacenamiento privado) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `LegacySnapshotId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.27](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mig/0002-mig.LegacySnapshots.sql` | |

### `mig.MigrationMappingSets`

| Campo | Valor |
|---|---|
| ID T05 | COL-MIG-03 |
| Colección lógica | `migrationMappingSets` |
| Dueño | T07 |
| Propósito (resumen) | Conjuntos versionados de reglas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `MigrationMappingSetId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.27](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mig/0003-mig.MigrationMappingSets.sql` | |

### `mig.MigrationMappingRules`

| Campo | Valor |
|---|---|
| ID T05 | COL-MIG-04 |
| Colección lógica | `migrationMappingRules` |
| Dueño | T07 |
| Propósito (resumen) | Reglas tabla → colección |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `MigrationMappingRuleId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.27](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mig/0004-mig.MigrationMappingRules.sql` | |

### `mig.MigrationValueMaps`

| Campo | Valor |
|---|---|
| ID T05 | COL-MIG-05 |
| Colección lógica | `migrationValueMaps` |
| Dueño | T07 |
| Propósito (resumen) | Mapas de valores (enums, códigos) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `MigrationValueMapId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.27](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mig/0005-mig.MigrationValueMaps.sql` | |

### `mig.MigrationRuns`

| Campo | Valor |
|---|---|
| ID T05 | COL-MIG-06 |
| Colección lógica | `migrationRuns` |
| Dueño | T07 |
| Propósito (resumen) | Corridas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `MigrationRunId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.27](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mig/0006-mig.MigrationRuns.sql` | |

### `mig.MigrationBatches`

| Campo | Valor |
|---|---|
| ID T05 | COL-MIG-07 |
| Colección lógica | `migrationBatches` |
| Dueño | T07 |
| Propósito (resumen) | Lotes por tabla y corrida |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `MigrationBatcheId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.27](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mig/0007-mig.MigrationBatches.sql` | |

### `mig.MigStagingRecords`

| Campo | Valor |
|---|---|
| ID T05 | COL-MIG-08 |
| Colección lógica | `migStagingRecords` |
| Dueño | T07 |
| Propósito (resumen) | Registros en staging; TTL |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `MigStagingRecordId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.27](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mig/0008-mig.MigStagingRecords.sql` | |

### `mig.LegacyIdMap`

| Campo | Valor |
|---|---|
| ID T05 | COL-MIG-09 |
| Colección lógica | `legacyIdMap` |
| Dueño | T07 |
| Propósito (resumen) | Mapa clave ProCoop → ObjectId |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `LegacyIdMapId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.27](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mig/0009-mig.LegacyIdMap.sql` | |

### `mig.LegacyKeyAliases`

| Campo | Valor |
|---|---|
| ID T05 | COL-MIG-10 |
| Colección lógica | `legacyKeyAliases` |
| Dueño | T07 |
| Propósito (resumen) | Alias de claves ProCoop vigentes (usuario, ID_FAC; DEC-050) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `LegacyKeyAliasId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.27](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mig/0010-mig.LegacyKeyAliases.sql` | |

### `mig.MigrationIssues`

| Campo | Valor |
|---|---|
| ID T05 | COL-MIG-11 |
| Colección lógica | `migrationIssues` |
| Dueño | T07 |
| Propósito (resumen) | Rechazos y advertencias (incluye los hallazgos del escaneo previo de secretos, sin valores; DEC-103) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `MigrationIssueId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.27](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mig/0011-mig.MigrationIssues.sql` | |

### `mig.MigrationReconciliations`

| Campo | Valor |
|---|---|
| ID T05 | COL-MIG-12 |
| Colección lógica | `migrationReconciliations` |
| Dueño | T07 |
| Propósito (resumen) | Conciliaciones origen-destino |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `MigrationReconciliationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.27](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mig/0012-mig.MigrationReconciliations.sql` | |

### `mig.ParallelRuns`

| Campo | Valor |
|---|---|
| ID T05 | COL-MIG-13 |
| Colección lógica | `parallelRuns` |
| Dueño | T07 |
| Propósito (resumen) | Corrida paralela |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `ParallelRunId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.27](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mig/0013-mig.ParallelRuns.sql` | |

### `mig.ParallelComparisons`

| Campo | Valor |
|---|---|
| ID T05 | COL-MIG-14 |
| Colección lógica | `parallelComparisons` |
| Dueño | T07 |
| Propósito (resumen) | Comparación ítem a ítem (absorbe `parallelRunComparisons` de M16) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `ParallelComparisonId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.27](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mig/0014-mig.ParallelComparisons.sql` | |

### `mig.BypassPlans`

| Campo | Valor |
|---|---|
| ID T05 | COL-MIG-15 |
| Colección lógica | `bypassPlans` |
| Dueño | T07 |
| Propósito (resumen) | By-pass por módulo |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `BypassPlanId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.27](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mig/0015-mig.BypassPlans.sql` | |

### `mig.CoexistenceSyncs`

| Campo | Valor |
|---|---|
| ID T05 | COL-MIG-16 |
| Colección lógica | `coexistenceSyncs` |
| Dueño | T07 |
| Propósito (resumen) | Sincronizaciones de convivencia |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `CoexistenceSyncId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.27](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mig/0016-mig.CoexistenceSyncs.sql` | |

### `mig.CutoverPlans`

| Campo | Valor |
|---|---|
| ID T05 | COL-MIG-17 |
| Colección lógica | `cutoverPlans` |
| Dueño | T07 |
| Propósito (resumen) | Plan de corte |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `CutoverPlanId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.27](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mig/0017-mig.CutoverPlans.sql` | |

### `mig.RollbackJournal`

| Campo | Valor |
|---|---|
| ID T05 | COL-MIG-18 |
| Colección lógica | `rollbackJournal` |
| Dueño | T07 |
| Propósito (resumen) | Diario de reversión |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `RollbackJournalId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.27](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mig/0018-mig.RollbackJournal.sql` | |

### `mig.LegacyRecords`

| Campo | Valor |
|---|---|
| ID T05 | COL-MIG-19 |
| Colección lógica | `legacyRecords` |
| Dueño | T07 |
| Propósito (resumen) | Histórico no tipado consultable (DEC-070) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `LegacyRecordId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.27](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mig/0019-mig.LegacyRecords.sql` | |

### `mig.AnonymizationProfiles`

| Campo | Valor |
|---|---|
| ID T05 | COL-MIG-20 |
| Colección lógica | `anonymizationProfiles` |
| Dueño | T07 |
| Propósito (resumen) | Perfiles de anonimización para ensayos |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `AnonymizationProfileId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.27](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mig/0020-mig.AnonymizationProfiles.sql` | |

## Esquema `mor`

### `mor.InterestPolicies`

| Campo | Valor |
|---|---|
| ID T05 | COL-MOR-01 |
| Colección lógica | `interestPolicies` |
| Dueño | M08 |
| Propósito (resumen) | Políticas de interés |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `InterestPolicyId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.11](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mor/0001-mor.InterestPolicies.sql` | |

### `mor.InterestRateTables`

| Campo | Valor |
|---|---|
| ID T05 | COL-MOR-02 |
| Colección lógica | `interestRateTables` |
| Dueño | M08 |
| Propósito (resumen) | Tablas de tasas por vigencia |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `InterestRateTableId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.11](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mor/0002-mor.InterestRateTables.sql` | |

### `mor.InterestIndexTables`

| Campo | Valor |
|---|---|
| ID T05 | COL-MOR-03 |
| Colección lógica | `interestIndexTables` |
| Dueño | M08 |
| Propósito (resumen) | Índices de recargo por mora propios (las series de inflación van a `economicIndexSeries`) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `InterestIndexTableId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.11](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mor/0003-mor.InterestIndexTables.sql` | |

### `mor.InterestIndexValues`

| Campo | Valor |
|---|---|
| ID T05 | COL-MOR-04 |
| Colección lógica | `interestIndexValues` |
| Dueño | M08 |
| Propósito (resumen) | Valores de índice |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `InterestIndexValueId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.11](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mor/0004-mor.InterestIndexValues.sql` | |

### `mor.DueDateSurchargeSchemes`

| Campo | Valor |
|---|---|
| ID T05 | COL-MOR-05 |
| Colección lógica | `dueDateSurchargeSchemes` |
| Dueño | M08 |
| Propósito (resumen) | Recargo entre vencimientos (canónica para las tramas de recargo de `TRAMASREC`) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `DueDateSurchargeSchemeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.11](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mor/0005-mor.DueDateSurchargeSchemes.sql` | |

### `mor.EarlyPaymentDiscountRules`

| Campo | Valor |
|---|---|
| ID T05 | COL-MOR-06 |
| Colección lógica | `earlyPaymentDiscountRules` |
| Dueño | M08 |
| Propósito (resumen) | Descuento por pronto pago (canónica; absorbe `cashDiscountRules` de M07) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `EarlyPaymentDiscountRuleId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.11](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mor/0006-mor.EarlyPaymentDiscountRules.sql` | |

### `mor.InterestCalculations`

| Campo | Valor |
|---|---|
| ID T05 | COL-MOR-07 |
| Colección lógica | `interestCalculations` |
| Dueño | M08 |
| Propósito (resumen) | Cálculos de interés inmutables |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `InterestCalculationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.11](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mor/0007-mor.InterestCalculations.sql` | |

### `mor.DeferredInterests`

| Campo | Valor |
|---|---|
| ID T05 | COL-MOR-08 |
| Colección lógica | `deferredInterests` |
| Dueño | M08 |
| Propósito (resumen) | Intereses diferidos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `DeferredInterestId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.11](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mor/0008-mor.DeferredInterests.sql` | |

### `mor.InterestBillingRuns`

| Campo | Valor |
|---|---|
| ID T05 | COL-MOR-09 |
| Colección lógica | `interestBillingRuns` |
| Dueño | M08 |
| Propósito (resumen) | Corridas de intereses a facturar |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O6 |
| Estado T05 | C |
| PK sugerida | `InterestBillingRunId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.11](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mor/0009-mor.InterestBillingRuns.sql` | |

### `mor.InterestBillingRunItems`

| Campo | Valor |
|---|---|
| ID T05 | COL-MOR-10 |
| Colección lógica | `interestBillingRunItems` |
| Dueño | M08 |
| Propósito (resumen) | Ítems de la corrida |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O6 |
| Estado T05 | C |
| PK sugerida | `InterestBillingRunItemId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.11](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mor/0010-mor.InterestBillingRunItems.sql` | |

### `mor.HoldReasons`

| Campo | Valor |
|---|---|
| ID T05 | COL-MOR-11 |
| Colección lógica | `holdReasons` |
| Dueño | M08 |
| Propósito (resumen) | Motivos de bloqueo de documento, cuenta o contrato (canónica; absorbe `invoiceBlockReasons` de M05 y `blockReasons` de M |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `HoldReasonId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.11](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mor/0011-mor.HoldReasons.sql` | |

### `mor.DocumentHolds`

| Campo | Valor |
|---|---|
| ID T05 | COL-MOR-12 |
| Colección lógica | `documentHolds` |
| Dueño | M08 |
| Propósito (resumen) | Bloqueos de documentos (historial por documentos sucesivos; absorbe `invoiceBlockHistory` de M05) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `DocumentHoldId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.11](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mor/0012-mor.DocumentHolds.sql` | |

### `mor.DelinquencyPolicies`

| Campo | Valor |
|---|---|
| ID T05 | COL-MOR-13 |
| Colección lógica | `delinquencyPolicies` |
| Dueño | M08 |
| Propósito (resumen) | Políticas de mora (BASE §68) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O6 |
| Estado T05 | C |
| PK sugerida | `DelinquencyPolicyId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.11](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mor/0013-mor.DelinquencyPolicies.sql` | |

### `mor.DelinquencyStages`

| Campo | Valor |
|---|---|
| ID T05 | COL-MOR-14 |
| Colección lógica | `delinquencyStages` |
| Dueño | M08 |
| Propósito (resumen) | Instancias de mora |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O6 |
| Estado T05 | C |
| PK sugerida | `DelinquencyStageId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.11](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mor/0014-mor.DelinquencyStages.sql` | |

### `mor.DelinquencyNoticeModels`

| Campo | Valor |
|---|---|
| ID T05 | COL-MOR-15 |
| Colección lógica | `delinquencyNoticeModels` |
| Dueño | M08 |
| Propósito (resumen) | Modelos de aviso |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O6 |
| Estado T05 | C |
| PK sugerida | `DelinquencyNoticeModelId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.11](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mor/0015-mor.DelinquencyNoticeModels.sql` | |

### `mor.DelinquencyBatches`

| Campo | Valor |
|---|---|
| ID T05 | COL-MOR-16 |
| Colección lógica | `delinquencyBatches` |
| Dueño | M08 |
| Propósito (resumen) | Lotes de mora |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O6 |
| Estado T05 | C |
| PK sugerida | `DelinquencyBatcheId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.11](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mor/0016-mor.DelinquencyBatches.sql` | |

### `mor.DelinquencyNotices`

| Campo | Valor |
|---|---|
| ID T05 | COL-MOR-17 |
| Colección lógica | `delinquencyNotices` |
| Dueño | M08 |
| Propósito (resumen) | Notificaciones de mora con promesa embebida |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O6 |
| Estado T05 | C |
| PK sugerida | `DelinquencyNoticeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.11](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mor/0017-mor.DelinquencyNotices.sql` | |

### `mor.DelinquencyNoticeEvents`

| Campo | Valor |
|---|---|
| ID T05 | COL-MOR-18 |
| Colección lógica | `delinquencyNoticeEvents` |
| Dueño | M08 |
| Propósito (resumen) | Bitácora estructurada de notificaciones |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O6 |
| Estado T05 | C |
| PK sugerida | `DelinquencyNoticeEventId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.11](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mor/0018-mor.DelinquencyNoticeEvents.sql` | |

### `mor.DelinquencyExceptions`

| Campo | Valor |
|---|---|
| ID T05 | COL-MOR-19 |
| Colección lógica | `delinquencyExceptions` |
| Dueño | M08 |
| Propósito (resumen) | Excepciones de mora |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O6 |
| Estado T05 | C |
| PK sugerida | `DelinquencyExceptionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.11](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mor/0019-mor.DelinquencyExceptions.sql` | |

### `mor.ServiceProtections`

| Campo | Valor |
|---|---|
| ID T05 | COL-MOR-20 |
| Colección lógica | `serviceProtections` |
| Dueño | M08 |
| Propósito (resumen) | Protecciones normativas acreditadas (electrodependientes, entes públicos) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O6 |
| Estado T05 | C |
| PK sugerida | `ServiceProtectionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.11](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mor/0020-mor.ServiceProtections.sql` | |

### `mor.SuspensionRestrictionRules`

| Campo | Valor |
|---|---|
| ID T05 | COL-MOR-21 |
| Colección lógica | `suspensionRestrictionRules` |
| Dueño | M08 |
| Propósito (resumen) | Matriz de restricciones de suspensión |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O6 |
| Estado T05 | C |
| PK sugerida | `SuspensionRestrictionRuleId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.11](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mor/0021-mor.SuspensionRestrictionRules.sql` | |

### `mor.DelinquencyReasons`

| Campo | Valor |
|---|---|
| ID T05 | COL-MOR-22 |
| Colección lógica | `delinquencyReasons` |
| Dueño | M08 |
| Propósito (resumen) | Causas de mora y de baja de notificación |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O6 |
| Estado T05 | C |
| PK sugerida | `DelinquencyReasonId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.11](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mor/0022-mor.DelinquencyReasons.sql` | |

### `mor.DelinquencyEvaluations`

| Campo | Valor |
|---|---|
| ID T05 | COL-MOR-23 |
| Colección lógica | `delinquencyEvaluations` |
| Dueño | M08 |
| Propósito (resumen) | Evaluaciones de mora |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O6 |
| Estado T05 | C |
| PK sugerida | `DelinquencyEvaluationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.11](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mor/0023-mor.DelinquencyEvaluations.sql` | |

### `mor.InterruptionCases`

| Campo | Valor |
|---|---|
| ID T05 | COL-MOR-24 |
| Colección lógica | `interruptionCases` |
| Dueño | M08 |
| Propósito (resumen) | Suspensión, corte, reconexión, baja por mora |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O6 |
| Estado T05 | C |
| PK sugerida | `InterruptionCasId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.11](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mor/0024-mor.InterruptionCases.sql` | |

### `mor.InterruptionChargeRules`

| Campo | Valor |
|---|---|
| ID T05 | COL-MOR-25 |
| Colección lógica | `interruptionChargeRules` |
| Dueño | M08 |
| Propósito (resumen) | Cargos de suspensión y reconexión |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O6 |
| Estado T05 | C |
| PK sugerida | `InterruptionChargeRuleId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.11](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mor/0025-mor.InterruptionChargeRules.sql` | |

### `mor.PaymentPlans`

| Campo | Valor |
|---|---|
| ID T05 | COL-MOR-26 |
| Colección lógica | `paymentPlans` |
| Dueño | M08 |
| Propósito (resumen) | Planes y tipos de financiación |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O6 |
| Estado T05 | C |
| PK sugerida | `PaymentPlanId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.11](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mor/0026-mor.PaymentPlans.sql` | |

### `mor.FinancingInstitutionPlans`

| Campo | Valor |
|---|---|
| ID T05 | COL-MOR-27 |
| Colección lógica | `financingInstitutionPlans` |
| Dueño | M08 |
| Propósito (resumen) | Planes de financiación de entidades financieras (M08 §7.24); nombre anterior `financialEntities` (5-11-2026: la columna  |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O6 |
| Estado T05 | C (antes `R`) |
| PK sugerida | `FinancingInstitutionPlanId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.11](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mor/0027-mor.FinancingInstitutionPlans.sql` | |

### `mor.AgreementSimulations`

| Campo | Valor |
|---|---|
| ID T05 | COL-MOR-28 |
| Colección lógica | `agreementSimulations` |
| Dueño | M08 |
| Propósito (resumen) | Simulaciones de convenio |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O6 |
| Estado T05 | C |
| PK sugerida | `AgreementSimulationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.11](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mor/0028-mor.AgreementSimulations.sql` | |

### `mor.Agreements`

| Campo | Valor |
|---|---|
| ID T05 | COL-MOR-29 |
| Colección lógica | `agreements` |
| Dueño | M08 |
| Propósito (resumen) | Convenios con firmantes embebidos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O6 |
| Estado T05 | C |
| PK sugerida | `AgreementId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.11](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mor/0029-mor.Agreements.sql` | |

### `mor.AgreementObligations`

| Campo | Valor |
|---|---|
| ID T05 | COL-MOR-30 |
| Colección lógica | `agreementObligations` |
| Dueño | M08 |
| Propósito (resumen) | Obligaciones incluidas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O6 |
| Estado T05 | C |
| PK sugerida | `AgreementObligationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.11](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mor/0030-mor.AgreementObligations.sql` | |

### `mor.AgreementInstallments`

| Campo | Valor |
|---|---|
| ID T05 | COL-MOR-31 |
| Colección lógica | `agreementInstallments` |
| Dueño | M08 |
| Propósito (resumen) | Cuotas de convenio |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O6 |
| Estado T05 | C |
| PK sugerida | `AgreementInstallmentId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.11](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mor/0031-mor.AgreementInstallments.sql` | |

### `mor.Guarantees`

| Campo | Valor |
|---|---|
| ID T05 | COL-MOR-32 |
| Colección lógica | `guarantees` |
| Dueño | M08 |
| Propósito (resumen) | Garantías y garantes |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O6 |
| Estado T05 | C |
| PK sugerida | `GuaranteeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.11](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mor/0032-mor.Guarantees.sql` | |

### `mor.GuaranteeRequirementRules`

| Campo | Valor |
|---|---|
| ID T05 | COL-MOR-33 |
| Colección lógica | `guaranteeRequirementRules` |
| Dueño | M08 |
| Propósito (resumen) | Reglas de exigencia de garantía |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O6 |
| Estado T05 | C |
| PK sugerida | `GuaranteeRequirementRuleId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.11](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mor/0033-mor.GuaranteeRequirementRules.sql` | |

### `mor.DebtCollectionAgencies`

| Campo | Valor |
|---|---|
| ID T05 | COL-MOR-34 |
| Colección lógica | `debtCollectionAgencies` |
| Dueño | M08 |
| Propósito (resumen) | Estudios y agencias de gestión de deuda; declarada en M08 como `collectionAgencies`, que choca con M07 (CTR-DAT-07). 5-1 |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O6 |
| Estado T05 | C (antes `R`) |
| PK sugerida | `DebtCollectionAgencyId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.11](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mor/0034-mor.DebtCollectionAgencies.sql` | |

### `mor.CollectionCases`

| Campo | Valor |
|---|---|
| ID T05 | COL-MOR-35 |
| Colección lógica | `collectionCases` |
| Dueño | M08 |
| Propósito (resumen) | Expedientes de gestión externa y judicial |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O6 |
| Estado T05 | C |
| PK sugerida | `CollectionCasId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.11](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mor/0035-mor.CollectionCases.sql` | |

### `mor.WriteOffs`

| Campo | Valor |
|---|---|
| ID T05 | COL-MOR-36 |
| Colección lógica | `writeOffs` |
| Dueño | M08 |
| Propósito (resumen) | Incobrables |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O6 |
| Estado T05 | C |
| PK sugerida | `WriteOffId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.11](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mor/0036-mor.WriteOffs.sql` | |

### `mor.PrescriptionRules`

| Campo | Valor |
|---|---|
| ID T05 | COL-MOR-37 |
| Colección lógica | `prescriptionRules` |
| Dueño | M08 |
| Propósito (resumen) | Plazos por tipo de obligación (DEC-052) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O6 |
| Estado T05 | C |
| PK sugerida | `PrescriptionRuleId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.11](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mor/0037-mor.PrescriptionRules.sql` | |

### `mor.PrescriptionRuns`

| Campo | Valor |
|---|---|
| ID T05 | COL-MOR-38 |
| Colección lógica | `prescriptionRuns` |
| Dueño | M08 |
| Propósito (resumen) | Corridas de prescripción |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O6 |
| Estado T05 | C |
| PK sugerida | `PrescriptionRunId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.11](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mor/0038-mor.PrescriptionRuns.sql` | |

### `mor.CollectionFollowUps`

| Campo | Valor |
|---|---|
| ID T05 | COL-MOR-39 |
| Colección lógica | `collectionFollowUps` |
| Dueño | M08 |
| Propósito (resumen) | Expedientes de seguimiento de deuda (BASE §14) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O6 |
| Estado T05 | C |
| PK sugerida | `CollectionFollowUpId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.11](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/mor/0039-mor.CollectionFollowUps.sql` | |

## Esquema `nfr`

### `nfr.DataCatalogEntries`

| Campo | Valor |
|---|---|
| ID T05 | COL-NFR-01 |
| Colección lógica | `dataCatalogEntries` |
| Dueño | T08 |
| Propósito (resumen) | Catálogo de datos personales (de `x-pii`) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `DataCatalogEntryId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.26](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/nfr/0001-nfr.DataCatalogEntries.sql` | |

### `nfr.ProcessingActivities`

| Campo | Valor |
|---|---|
| ID T05 | COL-NFR-02 |
| Colección lógica | `processingActivities` |
| Dueño | T08 |
| Propósito (resumen) | Registro de tratamientos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `ProcessingActivityId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.26](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/nfr/0002-nfr.ProcessingActivities.sql` | |

### `nfr.PrivacyNotices`

| Campo | Valor |
|---|---|
| ID T05 | COL-NFR-03 |
| Colección lógica | `privacyNotices` |
| Dueño | T08 |
| Propósito (resumen) | Avisos de privacidad versionados |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `PrivacyNoticeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.26](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/nfr/0003-nfr.PrivacyNotices.sql` | |

### `nfr.ConsentRecords`

| Campo | Valor |
|---|---|
| ID T05 | COL-NFR-04 |
| Colección lógica | `consentRecords` |
| Dueño | T08 |
| Propósito (resumen) | Consentimientos (canónica; absorbe `consents` de M01 y `consentRecords` de T09) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `ConsentRecordId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.26](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/nfr/0004-nfr.ConsentRecords.sql` | |

### `nfr.DataSubjectRequests`

| Campo | Valor |
|---|---|
| ID T05 | COL-NFR-05 |
| Colección lógica | `dataSubjectRequests` |
| Dueño | T08 |
| Propósito (resumen) | Solicitudes de derechos (canónica; absorbe la de M01) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `DataSubjectRequestId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.26](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/nfr/0005-nfr.DataSubjectRequests.sql` | |

### `nfr.RetentionPolicies`

| Campo | Valor |
|---|---|
| ID T05 | COL-NFR-06 |
| Colección lógica | `retentionPolicies` |
| Dueño | T08 |
| Propósito (resumen) | Políticas de retención (canónica; absorbe la de T11) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `RetentionPolicyId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.26](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/nfr/0006-nfr.RetentionPolicies.sql` | |

### `nfr.LegalHolds`

| Campo | Valor |
|---|---|
| ID T05 | COL-NFR-07 |
| Colección lógica | `legalHolds` |
| Dueño | T08 |
| Propósito (resumen) | Retenciones legales (canónica; absorbe la de T11) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `LegalHoldId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.26](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/nfr/0007-nfr.LegalHolds.sql` | |

### `nfr.RetentionRuns`

| Campo | Valor |
|---|---|
| ID T05 | COL-NFR-08 |
| Colección lógica | `retentionRuns` |
| Dueño | T08 |
| Propósito (resumen) | Corridas de supresión |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `RetentionRunId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.26](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/nfr/0008-nfr.RetentionRuns.sql` | |

### `nfr.ErasureLedger`

| Campo | Valor |
|---|---|
| ID T05 | COL-NFR-09 |
| Colección lógica | `erasureLedger` |
| Dueño | T08 |
| Propósito (resumen) | Libro de supresiones fuera de restauraciones |
| `TenantId` | No (global) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `ErasureLedgerId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.26](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/nfr/0009-nfr.ErasureLedger.sql` | |

### `nfr.SecurityIncidents`

| Campo | Valor |
|---|---|
| ID T05 | COL-NFR-10 |
| Colección lógica | `securityIncidents` |
| Dueño | T08 |
| Propósito (resumen) | Incidentes de seguridad y privacidad |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `SecurityIncidentId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.26](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/nfr/0010-nfr.SecurityIncidents.sql` | |

### ~~`nfr.RestoreDrills`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-NFR-11 |
| Colección lógica | `restoreDrills` |
| Dueño | T08 |
| Propósito (resumen) | (duplicada con `restoreTests`) |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-PLA-20 |
| SQL | No crear; ver `A→COL-PLA-20` |
| **Capa B:** canónica T01 — [`pla.RestoreTests`](07-catalogo-tablas-sql.md) (§2.0) | |
| **Capa C:** pendiente | |

### `nfr.EncryptionKeys`

| Campo | Valor |
|---|---|
| ID T05 | COL-NFR-12 |
| Colección lógica | `encryptionKeys` |
| Dueño | T08 |
| Propósito (resumen) | DEK envueltas por categoría y tenant |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `EncryptionKeyId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.26](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/nfr/0011-nfr.EncryptionKeys.sql` | |

### ~~`nfr.IdempotencyKeys`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-NFR-13 |
| Colección lógica | `idempotencyKeys` |
| Dueño | T08 |
| Propósito (resumen) | (duplicada con T01) |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-PLA-28 |
| SQL | No crear; ver `A→COL-PLA-28` |
| **Capa B:** canónica T01 — [`pla.IdempotencyKeys`](07-catalogo-tablas-sql.md) (§2.0) | |
| **Capa C:** pendiente | |

### ~~`nfr.ProcessedEvents`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-NFR-14 |
| Colección lógica | `processedEvents` |
| Dueño | T08 |
| Propósito (resumen) | (duplicada con `inboxReceipts`) |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-PLA-25 |
| SQL | No crear; ver `A→COL-PLA-25` |
| **Capa B:** canónica T01 — [`pla.InboxReceipts`](07-catalogo-tablas-sql.md) (§2.0) | |
| **Capa C:** pendiente | |

### `nfr.Locks`

| Campo | Valor |
|---|---|
| ID T05 | COL-NFR-15 |
| Colección lógica | `locks` |
| Dueño | T08 |
| Propósito (resumen) | Locks distribuidos de respaldo a Redis; TTL |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `LockId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.26](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/nfr/0012-nfr.Locks.sql` | |

### `nfr.SloDefinitions`

| Campo | Valor |
|---|---|
| ID T05 | COL-NFR-16 |
| Colección lógica | `sloDefinitions` |
| Dueño | T08 |
| Propósito (resumen) | Objetivos de nivel de servicio |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `SloDefinitionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.26](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/nfr/0013-nfr.SloDefinitions.sql` | |

### ~~`nfr.AlertRules`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-NFR-17 |
| Colección lógica | `alertRules` |
| Dueño | T08 |
| Propósito (resumen) | (duplicada con T01) |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-PLA-15 |
| SQL | No crear; ver `A→COL-PLA-15` |
| **Capa B:** canónica T01 — [`pla.AlertRules`](07-catalogo-tablas-sql.md) (§2.0) | |
| **Capa C:** pendiente | |

### ~~`nfr.AlertEvents`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-NFR-18 |
| Colección lógica | `alertEvents` |
| Dueño | T08 |
| Propósito (resumen) | (duplicada con `alerts`) |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-PLA-16 |
| SQL | No crear; ver `A→COL-PLA-16` |
| **Capa B:** canónica T01 — [`pla.Alerts`](07-catalogo-tablas-sql.md) (§2.0) | |
| **Capa C:** pendiente | |

### `nfr.CspReports`

| Campo | Valor |
|---|---|
| ID T05 | COL-NFR-19 |
| Colección lógica | `cspReports` |
| Dueño | T08 |
| Propósito (resumen) | Reportes CSP; TTL |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `CspReportId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.26](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/nfr/0014-nfr.CspReports.sql` | |

### `nfr.QualityEvidence`

| Campo | Valor |
|---|---|
| ID T05 | COL-NFR-20 |
| Colección lógica | `qualityEvidence` |
| Dueño | T08 |
| Propósito (resumen) | Evidencias de calidad por ola |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `QualityEvidenceId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.26](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/nfr/0015-nfr.QualityEvidence.sql` | |

### `nfr.StatusNotices`

| Campo | Valor |
|---|---|
| ID T05 | COL-NFR-21 |
| Colección lógica | `statusNotices` |
| Dueño | T08 |
| Propósito (resumen) | Página de estado (incidentes y mantenimientos) |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `StatusNoticeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.26](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/nfr/0016-nfr.StatusNotices.sql` | |

### ~~`nfr.TenantUsageSnapshots`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-NFR-22 |
| Colección lógica | `tenantUsageSnapshots` |
| Dueño | T08 |
| Propósito (resumen) | (duplicada con `usageSnapshots`) |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-PLA-09 |
| SQL | No crear; ver `A→COL-PLA-09` |
| **Capa B:** canónica T01 — [`pla.UsageSnapshots`](07-catalogo-tablas-sql.md) (§2.0) | |
| **Capa C:** pendiente | |

### `nfr.Subprocessors`

| Campo | Valor |
|---|---|
| ID T05 | COL-NFR-23 |
| Colección lógica | `subprocessors` |
| Dueño | T08 |
| Propósito (resumen) | Registro público de subencargados (DEC-076) |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `SubprocessorId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.26](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/nfr/0017-nfr.Subprocessors.sql` | |

## Esquema `por`

### `por.LandingPages`

| Campo | Valor |
|---|---|
| ID T05 | COL-POR-01 |
| Colección lógica | `landingPages` |
| Dueño | M19 |
| Propósito (resumen) | Landing del tenant |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `LandingPageId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.22](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/por/0001-por.LandingPages.sql` | |

### `por.LandingPageVersions`

| Campo | Valor |
|---|---|
| ID T05 | COL-POR-02 |
| Colección lógica | `landingPageVersions` |
| Dueño | M19 |
| Propósito (resumen) | Versiones publicadas de la landing |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `LandingPageVersionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.22](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/por/0002-por.LandingPageVersions.sql` | |

### `por.PortalAccountAccess`

| Campo | Valor |
|---|---|
| ID T05 | COL-POR-03 |
| Colección lógica | `portalAccountAccess` |
| Dueño | M19 |
| Propósito (resumen) | Vínculo usuario del portal–cuenta (DEC-043) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `PortalAccountAccesId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.22](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/por/0003-por.PortalAccountAccess.sql` | |

### `por.PortalLinkAttempts`

| Campo | Valor |
|---|---|
| ID T05 | COL-POR-04 |
| Colección lógica | `portalLinkAttempts` |
| Dueño | M19 |
| Propósito (resumen) | Intentos de vinculación; TTL `expiresAt` |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `PortalLinkAttemptId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.22](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/por/0004-por.PortalLinkAttempts.sql` | |

### `por.PortalDelegationInvites`

| Campo | Valor |
|---|---|
| ID T05 | COL-POR-05 |
| Colección lógica | `portalDelegationInvites` |
| Dueño | M19 |
| Propósito (resumen) | Invitaciones de delegación |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `PortalDelegationInviteId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.22](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/por/0005-por.PortalDelegationInvites.sql` | |

### `por.PortalForms`

| Campo | Valor |
|---|---|
| ID T05 | COL-POR-06 |
| Colección lógica | `portalForms` |
| Dueño | M19 |
| Propósito (resumen) | Formularios del portal (sobre `formVersions` de T11) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `PortalFormId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.22](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/por/0006-por.PortalForms.sql` | |

### `por.PortalFormSubmissions`

| Campo | Valor |
|---|---|
| ID T05 | COL-POR-07 |
| Colección lógica | `portalFormSubmissions` |
| Dueño | M19 |
| Propósito (resumen) | Envíos de formularios (generan caso en M09) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `PortalFormSubmissionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.22](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/por/0007-por.PortalFormSubmissions.sql` | |

### `por.PortalDrafts`

| Campo | Valor |
|---|---|
| ID T05 | COL-POR-08 |
| Colección lógica | `portalDrafts` |
| Dueño | M19 |
| Propósito (resumen) | Borradores; TTL `expiresAt` |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `PortalDraftId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.22](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/por/0008-por.PortalDrafts.sql` | |

### `por.PublicSubmissions`

| Campo | Valor |
|---|---|
| ID T05 | COL-POR-09 |
| Colección lógica | `publicSubmissions` |
| Dueño | M19 |
| Propósito (resumen) | Envíos públicos sin sesión |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `PublicSubmissionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.22](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/por/0009-por.PublicSubmissions.sql` | |

### `por.PortalUserPreferences`

| Campo | Valor |
|---|---|
| ID T05 | COL-POR-10 |
| Colección lógica | `portalUserPreferences` |
| Dueño | M19 |
| Propósito (resumen) | Preferencias del usuario |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `PortalUserPreferenceId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.22](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/por/0010-por.PortalUserPreferences.sql` | |

### `por.PortalBanners`

| Campo | Valor |
|---|---|
| ID T05 | COL-POR-11 |
| Colección lógica | `portalBanners` |
| Dueño | M19 |
| Propósito (resumen) | Avisos y banners |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `PortalBannerId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.22](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/por/0011-por.PortalBanners.sql` | |

### `por.LegacyPortalImports`

| Campo | Valor |
|---|---|
| ID T05 | COL-POR-12 |
| Colección lógica | `legacyPortalImports` |
| Dueño | M19 |
| Propósito (resumen) | Importación de usuarios de CoopOnline |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `LegacyPortalImportId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.22](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/por/0012-por.LegacyPortalImports.sql` | |

### `por.LegacyPortalUserMap`

| Campo | Valor |
|---|---|
| ID T05 | COL-POR-13 |
| Colección lógica | `legacyPortalUserMap` |
| Dueño | M19 |
| Propósito (resumen) | Mapa de usuarios heredados |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O11 |
| Estado T05 | C |
| PK sugerida | `LegacyPortalUserMapId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.22](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/por/0013-por.LegacyPortalUserMap.sql` | |

### `por.KioskDevices`

| Campo | Valor |
|---|---|
| ID T05 | COL-POR-14 |
| Colección lógica | `kioskDevices` |
| Dueño | M19 |
| Propósito (resumen) | Terminales de autoconsulta |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `KioskDeviceId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.22](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/por/0014-por.KioskDevices.sql` | |

## Esquema `soc`

### `soc.ServiceDependents`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-01 |
| Colección lógica | `serviceDependents` |
| Dueño | M18 |
| Propósito (resumen) | Adherentes (canónica, DEC-071, HUECO-TRV-01) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `ServiceDependentId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0001-soc.ServiceDependents.sql` | |

### `soc.ServiceBeneficiaries`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-02 |
| Colección lógica | `serviceBeneficiaries` |
| Dueño | M18 |
| Propósito (resumen) | Beneficiarios del contrato; destino único de `BENSOC` (DEC-086, HUECO-SEP-02): ninguna fila va a M04 y `benefitType` no  |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `ServiceBeneficiaryId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0002-soc.ServiceBeneficiaries.sql` | |

### `soc.DependentEvents`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-03 |
| Colección lógica | `dependentEvents` |
| Dueño | M18 |
| Propósito (resumen) | Historia de adherentes y beneficiarios |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `DependentEventId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0003-soc.DependentEvents.sql` | |

### `soc.CoveragePlans`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-04 |
| Colección lógica | `coveragePlans` |
| Dueño | M18 |
| Propósito (resumen) | Planes de cobertura |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `CoveragePlanId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0004-soc.CoveragePlans.sql` | |

### `soc.CareProviders`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-05 |
| Colección lógica | `careProviders` |
| Dueño | M18 |
| Propósito (resumen) | Prestadores |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `CareProviderId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0005-soc.CareProviders.sql` | |

### `soc.ProviderAgreements`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-06 |
| Colección lógica | `providerAgreements` |
| Dueño | M18 |
| Propósito (resumen) | Convenios con prestadores |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `ProviderAgreementId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0006-soc.ProviderAgreements.sql` | |

### `soc.MedicalSpecialties`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-07 |
| Colección lógica | `medicalSpecialties` |
| Dueño | M18 |
| Propósito (resumen) | Especialidades |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `MedicalSpecialtyId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0007-soc.MedicalSpecialties.sql` | |

### `soc.MedicalProfessionals`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-08 |
| Colección lógica | `medicalProfessionals` |
| Dueño | M18 |
| Propósito (resumen) | Profesionales: rol de una persona de M01; el nombre se lee de la persona (10-11-2026, DEC-097, M18 §7.2) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `MedicalProfessionalId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0008-soc.MedicalProfessionals.sql` | |

### `soc.BenefitRequests`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-09 |
| Colección lógica | `benefitRequests` |
| Dueño | M18 |
| Propósito (resumen) | Solicitudes de prestación |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `BenefitRequestId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0009-soc.BenefitRequests.sql` | |

### `soc.BurialServiceCases`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-10 |
| Colección lógica | `burialServiceCases` |
| Dueño | M18 |
| Propósito (resumen) | Casos de sepelio |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `BurialServiceCasId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0010-soc.BurialServiceCases.sql` | |

### `soc.DeathSubsidyCases`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-11 |
| Colección lógica | `deathSubsidyCases` |
| Dueño | M18 |
| Propósito (resumen) | Subsidios por fallecimiento |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `DeathSubsidyCasId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0011-soc.DeathSubsidyCases.sql` | |

### `soc.BloodCoverageRequests`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-12 |
| Colección lógica | `bloodCoverageRequests` |
| Dueño | M18 |
| Propósito (resumen) | Cobertura de sangre (sin datos clínicos) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `BloodCoverageRequestId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0012-soc.BloodCoverageRequests.sql` | |

### `soc.DonationCampaigns`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-13 |
| Colección lógica | `donationCampaigns` |
| Dueño | M18 |
| Propósito (resumen) | Campañas de donación |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `DonationCampaignId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0013-soc.DonationCampaigns.sql` | |

### `soc.DonationAppointments`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-14 |
| Colección lógica | `donationAppointments` |
| Dueño | M18 |
| Propósito (resumen) | Turnos de donación (sin aptitud ni resultados) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `DonationAppointmentId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0014-soc.DonationAppointments.sql` | |

### `soc.HealthAuthorizations`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-15 |
| Colección lógica | `healthAuthorizations` |
| Dueño | M18 |
| Propósito (resumen) | Autorizaciones de internación y prácticas (sin diagnóstico) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `HealthAuthorizationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0015-soc.HealthAuthorizations.sql` | |

### `soc.TransportTrips`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-16 |
| Colección lógica | `transportTrips` |
| Dueño | M18 |
| Propósito (resumen) | Traslados sanitarios y generales (canónica, HUECO-SAL-02) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `TransportTripId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0016-soc.TransportTrips.sql` | |

### `soc.TripLegs`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-17 |
| Colección lógica | `tripLegs` |
| Dueño | M18 |
| Propósito (resumen) | Tramos de traslado |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `TripLegId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0017-soc.TripLegs.sql` | |

### `soc.TripCharacteristics`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-18 |
| Colección lógica | `tripCharacteristics` |
| Dueño | M18 |
| Propósito (resumen) | Características del traslado |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `TripCharacteristicId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0018-soc.TripCharacteristics.sql` | |

### `soc.Cemeteries`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-19 |
| Colección lógica | `cemeteries` |
| Dueño | M18 |
| Propósito (resumen) | Cementerios parque |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `CemeteryId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0019-soc.Cemeteries.sql` | |

### `soc.CemeteryRegulations`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-20 |
| Colección lógica | `cemeteryRegulations` |
| Dueño | M18 |
| Propósito (resumen) | Reglamentos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `CemeteryRegulationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0020-soc.CemeteryRegulations.sql` | |

### `soc.BurialUnits`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-21 |
| Colección lógica | `burialUnits` |
| Dueño | M18 |
| Propósito (resumen) | Parcelas y nichos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `BurialUnitId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0021-soc.BurialUnits.sql` | |

### `soc.BurialRights`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-22 |
| Colección lógica | `burialRights` |
| Dueño | M18 |
| Propósito (resumen) | Derechos de sepultura |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `BurialRightId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0022-soc.BurialRights.sql` | |

### `soc.BurialRightEvents`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-23 |
| Colección lógica | `burialRightEvents` |
| Dueño | M18 |
| Propósito (resumen) | Historia de derechos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `BurialRightEventId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0023-soc.BurialRightEvents.sql` | |

### `soc.BurialOccupancies`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-24 |
| Colección lógica | `burialOccupancies` |
| Dueño | M18 |
| Propósito (resumen) | Ocupaciones |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `BurialOccupancyId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0024-soc.BurialOccupancies.sql` | |

### `soc.CemeteryActs`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-25 |
| Colección lógica | `cemeteryActs` |
| Dueño | M18 |
| Propósito (resumen) | Inhumaciones, exhumaciones, traslados |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `CemeteryActId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0025-soc.CemeteryActs.sql` | |

### `soc.OrthopedicItems`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-26 |
| Colección lógica | `orthopedicItems` |
| Dueño | M18 |
| Propósito (resumen) | Elementos ortopédicos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `OrthopedicItemId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0026-soc.OrthopedicItems.sql` | |

### `soc.OrthopedicLoans`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-27 |
| Colección lógica | `orthopedicLoans` |
| Dueño | M18 |
| Propósito (resumen) | Préstamos ortopédicos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `OrthopedicLoanId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0027-soc.OrthopedicLoans.sql` | |

### `soc.DispenserWithdrawals`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-28 |
| Colección lógica | `dispenserWithdrawals` |
| Dueño | M18 |
| Propósito (resumen) | Retiros de dispenser |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `DispenserWithdrawalId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0028-soc.DispenserWithdrawals.sql` | |

### `soc.HousingPlans`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-29 |
| Colección lógica | `housingPlans` |
| Dueño | M18 |
| Propósito (resumen) | Planes de vivienda |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `HousingPlanId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0029-soc.HousingPlans.sql` | |

### `soc.HousingPrices`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-30 |
| Colección lógica | `housingPrices` |
| Dueño | M18 |
| Propósito (resumen) | Precios de vivienda por plan, categoría y fecha, con aprobación (colección propia de M18, HUECO-VIV-02). **Reemplaza** e |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `HousingPriceId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0030-soc.HousingPrices.sql` | |

### `soc.HousingUnits`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-31 |
| Colección lógica | `housingUnits` |
| Dueño | M18 |
| Propósito (resumen) | Viviendas adjudicables |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `HousingUnitId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0031-soc.HousingUnits.sql` | |

### `soc.HousingContributions`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-32 |
| Colección lógica | `housingContributions` |
| Dueño | M18 |
| Propósito (resumen) | Aportes por período |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `HousingContributionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0032-soc.HousingContributions.sql` | |

### `soc.HousingStages`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-33 |
| Colección lógica | `housingStages` |
| Dueño | M18 |
| Propósito (resumen) | Etapas de obra |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `HousingStageId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0033-soc.HousingStages.sql` | |

### `soc.HousingActivities`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-34 |
| Colección lógica | `housingActivities` |
| Dueño | M18 |
| Propósito (resumen) | Actividades de obra |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `HousingActivityId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0034-soc.HousingActivities.sql` | |

### `soc.HousingActivityMaterials`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-35 |
| Colección lógica | `housingActivityMaterials` |
| Dueño | M18 |
| Propósito (resumen) | Materiales por actividad |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `HousingActivityMaterialId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0035-soc.HousingActivityMaterials.sql` | |

### `soc.HousingProgress`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-36 |
| Colección lógica | `housingProgress` |
| Dueño | M18 |
| Propósito (resumen) | Avance de obra |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `HousingProgresId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0036-soc.HousingProgress.sql` | |

### `soc.HousingProgressMaterials`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-37 |
| Colección lógica | `housingProgressMaterials` |
| Dueño | M18 |
| Propósito (resumen) | Materiales usados en el avance |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `HousingProgressMaterialId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0037-soc.HousingProgressMaterials.sql` | |

### `soc.HousingMaterialAllocations`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-38 |
| Colección lógica | `housingMaterialAllocations` |
| Dueño | M18 |
| Propósito (resumen) | Materiales asignados a la vivienda |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `HousingMaterialAllocationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0038-soc.HousingMaterialAllocations.sql` | |

### `soc.HousingMaterialWithdrawals`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-39 |
| Colección lógica | `housingMaterialWithdrawals` |
| Dueño | M18 |
| Propósito (resumen) | Retiros de materiales (el movimiento lo hace M13) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `HousingMaterialWithdrawalId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0039-soc.HousingMaterialWithdrawals.sql` | |

### `soc.HousingCertificates`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-40 |
| Colección lógica | `housingCertificates` |
| Dueño | M18 |
| Propósito (resumen) | Certificados de obra |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `HousingCertificateId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0040-soc.HousingCertificates.sql` | |

### `soc.HousingPlanChanges`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-41 |
| Colección lógica | `housingPlanChanges` |
| Dueño | M18 |
| Propósito (resumen) | Cambios de plan |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `HousingPlanChangeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0041-soc.HousingPlanChanges.sql` | |

### `soc.HousingTerminations`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-42 |
| Colección lógica | `housingTerminations` |
| Dueño | M18 |
| Propósito (resumen) | Bajas y rescisiones |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `HousingTerminationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0042-soc.HousingTerminations.sql` | |

### `soc.FleetVehicles`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-43 |
| Colección lógica | `fleetVehicles` |
| Dueño | M18 |
| Propósito (resumen) | Vehículos (canónica para `vehicleId`) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `FleetVehicleId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0043-soc.FleetVehicles.sql` | |

### `soc.Drivers`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-44 |
| Colección lógica | `drivers` |
| Dueño | M18 |
| Propósito (resumen) | Choferes: rol de una persona de M01; el nombre se lee de la persona (10-11-2026, DEC-097, M18 §7.7) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `DriverId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0044-soc.Drivers.sql` | |

### `soc.VehicleDocuments`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-45 |
| Colección lógica | `vehicleDocuments` |
| Dueño | M18 |
| Propósito (resumen) | Seguros, VTV, habilitaciones |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `VehicleDocumentId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0045-soc.VehicleDocuments.sql` | |

### `soc.VehicleMaintenances`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-46 |
| Colección lógica | `vehicleMaintenances` |
| Dueño | M18 |
| Propósito (resumen) | Mantenimientos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `VehicleMaintenanceId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0046-soc.VehicleMaintenances.sql` | |

### `soc.VehicleUsages`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-47 |
| Colección lógica | `vehicleUsages` |
| Dueño | M18 |
| Propósito (resumen) | Usos (OT, traslado, interno) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `VehicleUsageId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0047-soc.VehicleUsages.sql` | |

### `soc.FuelTypes`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-48 |
| Colección lógica | `fuelTypes` |
| Dueño | M18 |
| Propósito (resumen) | Combustibles (canónica; absorbe el tipo `fuel` de `purchaseLookups`) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `FuelTypeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0048-soc.FuelTypes.sql` | |

### `soc.FuelLoads`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-49 |
| Colección lógica | `fuelLoads` |
| Dueño | M18 |
| Propósito (resumen) | Cargas de combustible |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `FuelLoadId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0049-soc.FuelLoads.sql` | |

### `soc.TripSettlements`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-50 |
| Colección lógica | `tripSettlements` |
| Dueño | M18 |
| Propósito (resumen) | Rendiciones de viaje (canónica; absorbe `freightSettlements` de M11) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `TripSettlementId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0050-soc.TripSettlements.sql` | |

### `soc.GpsDevices`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-51 |
| Colección lógica | `gpsDevices` |
| Dueño | M18 |
| Propósito (resumen) | Dispositivos AVL |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `GpsDeviceId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0051-soc.GpsDevices.sql` | |

### `soc.GpsPositions`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-52 |
| Colección lógica | `gpsPositions` |
| Dueño | M18 |
| Propósito (resumen) | Posiciones GPS (*time series*, TTL por PRM-SOC-035) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `GpsPositionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0052-soc.GpsPositions.sql` | |

### `soc.ContractRegistrations`

| Campo | Valor |
|---|---|
| ID T05 | COL-SOC-53 |
| Colección lógica | `contractRegistrations` |
| Dueño | M18 |
| Propósito (resumen) | Registraciones del contrato: vehículo eléctrico, dispositivo u otro tipo habilitado por la ficha de M02 (RF-SOC-148, HUE |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `ContractRegistrationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.21](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/soc/0053-soc.ContractRegistrations.sql` | |

## Esquema `stk`

### `stk.ItemTypes`

| Campo | Valor |
|---|---|
| ID T05 | COL-STK-01 |
| Colección lógica | `itemTypes` |
| Dueño | M13 |
| Propósito (resumen) | Tipos de artículo |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `ItemTypeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.17](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/stk/0001-stk.ItemTypes.sql` | |

### `stk.ItemClassifications`

| Campo | Valor |
|---|---|
| ID T05 | COL-STK-02 |
| Colección lógica | `itemClassifications` |
| Dueño | M13 |
| Propósito (resumen) | Clasificación jerárquica de artículos (dueño M13; M05 la cita en M06, CTR-DAT-44) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `ItemClassificationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.17](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/stk/0002-stk.ItemClassifications.sql` | |

### `stk.ItemGroups`

| Campo | Valor |
|---|---|
| ID T05 | COL-STK-03 |
| Colección lógica | `itemGroups` |
| Dueño | M13 |
| Propósito (resumen) | Rubros de artículos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `ItemGroupId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.17](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/stk/0003-stk.ItemGroups.sql` | |

### `stk.ItemDepartments`

| Campo | Valor |
|---|---|
| ID T05 | COL-STK-04 |
| Colección lógica | `itemDepartments` |
| Dueño | M13 |
| Propósito (resumen) | Departamentos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `ItemDepartmentId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.17](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/stk/0004-stk.ItemDepartments.sql` | |

### `stk.InventoryItems`

| Campo | Valor |
|---|---|
| ID T05 | COL-STK-05 |
| Colección lógica | `inventoryItems` |
| Dueño | M13 |
| Propósito (resumen) | Artículos de inventario (faceta de stock; la comercial es `serviceProducts` de M02) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `InventoryItemId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.17](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/stk/0005-stk.InventoryItems.sql` | |

### `stk.ItemKits`

| Campo | Valor |
|---|---|
| ID T05 | COL-STK-06 |
| Colección lógica | `itemKits` |
| Dueño | M13 |
| Propósito (resumen) | Composición de kits |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `ItemKitId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.17](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/stk/0006-stk.ItemKits.sql` | |

### `stk.Warehouses`

| Campo | Valor |
|---|---|
| ID T05 | COL-STK-07 |
| Colección lógica | `warehouses` |
| Dueño | M13 |
| Propósito (resumen) | Depósitos, depósitos móviles y custodios |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `WarehousId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.17](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/stk/0007-stk.Warehouses.sql` | |

### `stk.WarehouseLocations`

| Campo | Valor |
|---|---|
| ID T05 | COL-STK-08 |
| Colección lógica | `warehouseLocations` |
| Dueño | M13 |
| Propósito (resumen) | Ubicaciones dentro del depósito |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `WarehouseLocationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.17](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/stk/0008-stk.WarehouseLocations.sql` | |

### `stk.ItemLocationDefaults`

| Campo | Valor |
|---|---|
| ID T05 | COL-STK-09 |
| Colección lógica | `itemLocationDefaults` |
| Dueño | M13 |
| Propósito (resumen) | Ubicación por defecto del artículo |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `ItemLocationDefaultId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.17](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/stk/0009-stk.ItemLocationDefaults.sql` | |

### `stk.StockDocuments`

| Campo | Valor |
|---|---|
| ID T05 | COL-STK-10 |
| Colección lógica | `stockDocuments` |
| Dueño | M13 |
| Propósito (resumen) | Documentos de stock (vales, remitos internos, transferencias entre depósitos) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `StockDocumentId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.17](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/stk/0010-stk.StockDocuments.sql` | |

### `stk.StockMovements`

| Campo | Valor |
|---|---|
| ID T05 | COL-STK-11 |
| Colección lógica | `stockMovements` |
| Dueño | M13 |
| Propósito (resumen) | Libro de movimientos (alto volumen, solo agregado) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `StockMovementId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.17](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/stk/0011-stk.StockMovements.sql` | |

### `stk.StockBalances`

| Campo | Valor |
|---|---|
| ID T05 | COL-STK-12 |
| Colección lógica | `stockBalances` |
| Dueño | M13 |
| Propósito (resumen) | Saldos materializados (reconstruibles) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `StockBalanceId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.17](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/stk/0012-stk.StockBalances.sql` | |

### `stk.SerialUnits`

| Campo | Valor |
|---|---|
| ID T05 | COL-STK-13 |
| Colección lógica | `serialUnits` |
| Dueño | M13 |
| Propósito (resumen) | Unidades serializadas (equipos) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `SerialUnitId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.17](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/stk/0013-stk.SerialUnits.sql` | |

### `stk.SerialUnitEvents`

| Campo | Valor |
|---|---|
| ID T05 | COL-STK-14 |
| Colección lógica | `serialUnitEvents` |
| Dueño | M13 |
| Propósito (resumen) | Trayectoria de la unidad |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `SerialUnitEventId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.17](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/stk/0014-stk.SerialUnitEvents.sql` | |

### `stk.LotTypes`

| Campo | Valor |
|---|---|
| ID T05 | COL-STK-15 |
| Colección lógica | `lotTypes` |
| Dueño | M13 |
| Propósito (resumen) | Tipos de lote (dueño M13; M04 lo atribuye a M05, CTR-DAT-46) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `LotTypeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.17](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/stk/0015-stk.LotTypes.sql` | |

### `stk.Lots`

| Campo | Valor |
|---|---|
| ID T05 | COL-STK-16 |
| Colección lógica | `lots` |
| Dueño | M13 |
| Propósito (resumen) | Lotes |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `LotId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.17](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/stk/0016-stk.Lots.sql` | |

### `stk.StockReservations`

| Campo | Valor |
|---|---|
| ID T05 | COL-STK-17 |
| Colección lógica | `stockReservations` |
| Dueño | M13 |
| Propósito (resumen) | Reservas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `StockReservationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.17](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/stk/0017-stk.StockReservations.sql` | |

### ~~`stk.EquipmentAssignments`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-STK-18 |
| Colección lógica | `equipmentAssignments` |
| Dueño | M13 |
| Propósito (resumen) | (equipos en contratos: canónica `contractEquipmentAssignments` de M02) |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-CAT-20 |
| SQL | No crear; ver `A→COL-CAT-20` |
| **Capa B:** canónica M02 — [`07` §2.4](07-modelo-relacional-azure-sql.md) `ContractEquipmentAssignments` | |
| **Capa C:** pendiente | |

### `stk.CrewSettlements`

| Campo | Valor |
|---|---|
| ID T05 | COL-STK-19 |
| Colección lógica | `crewSettlements` |
| Dueño | M13 |
| Propósito (resumen) | Rendiciones de material de cuadrilla |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `CrewSettlementId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.17](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/stk/0018-stk.CrewSettlements.sql` | |

### `stk.PhysicalCounts`

| Campo | Valor |
|---|---|
| ID T05 | COL-STK-20 |
| Colección lógica | `physicalCounts` |
| Dueño | M13 |
| Propósito (resumen) | Inventarios físicos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `PhysicalCountId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.17](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/stk/0019-stk.PhysicalCounts.sql` | |

### `stk.ItemCostStates`

| Campo | Valor |
|---|---|
| ID T05 | COL-STK-21 |
| Colección lógica | `itemCostStates` |
| Dueño | M13 |
| Propósito (resumen) | Costo perpetuo por artículo |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `ItemCostStateId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.17](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/stk/0020-stk.ItemCostStates.sql` | |

### `stk.CostLayers`

| Campo | Valor |
|---|---|
| ID T05 | COL-STK-22 |
| Colección lógica | `costLayers` |
| Dueño | M13 |
| Propósito (resumen) | Capas de costo |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `CostLayerId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.17](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/stk/0021-stk.CostLayers.sql` | |

### `stk.Revaluations`

| Campo | Valor |
|---|---|
| ID T05 | COL-STK-23 |
| Colección lógica | `revaluations` |
| Dueño | M13 |
| Propósito (resumen) | Revaluaciones |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `RevaluationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.17](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/stk/0022-stk.Revaluations.sql` | |

### `stk.ReorderSuggestions`

| Campo | Valor |
|---|---|
| ID T05 | COL-STK-24 |
| Colección lógica | `reorderSuggestions` |
| Dueño | M13 |
| Propósito (resumen) | Sugerencias de compra |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `ReorderSuggestionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.17](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/stk/0023-stk.ReorderSuggestions.sql` | |

### `stk.ExpenseUnits`

| Campo | Valor |
|---|---|
| ID T05 | COL-STK-25 |
| Colección lógica | `expenseUnits` |
| Dueño | M13 |
| Propósito (resumen) | Unidades de gasto (canónica; absorbe el tipo `spendingUnit` de `purchaseLookups`) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `ExpenseUnitId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.17](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/stk/0024-stk.ExpenseUnits.sql` | |

### `stk.FixedAssets`

| Campo | Valor |
|---|---|
| ID T05 | COL-STK-26 |
| Colección lógica | `fixedAssets` |
| Dueño | M13 |
| Propósito (resumen) | Bienes de uso |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `FixedAssetId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.17](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/stk/0025-stk.FixedAssets.sql` | |

### `stk.FixedAssetHistory`

| Campo | Valor |
|---|---|
| ID T05 | COL-STK-27 |
| Colección lógica | `fixedAssetHistory` |
| Dueño | M13 |
| Propósito (resumen) | Historia del bien |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `FixedAssetHistoryId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.17](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/stk/0026-stk.FixedAssetHistory.sql` | |

### `stk.FixedAssetValueChanges`

| Campo | Valor |
|---|---|
| ID T05 | COL-STK-28 |
| Colección lógica | `fixedAssetValueChanges` |
| Dueño | M13 |
| Propósito (resumen) | Mejoras, disminuciones y ajustes |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `FixedAssetValueChangeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.17](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/stk/0027-stk.FixedAssetValueChanges.sql` | |

### `stk.DepreciationRuns`

| Campo | Valor |
|---|---|
| ID T05 | COL-STK-29 |
| Colección lógica | `depreciationRuns` |
| Dueño | M13 |
| Propósito (resumen) | Corridas de amortización |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `DepreciationRunId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.17](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/stk/0028-stk.DepreciationRuns.sql` | |

### `stk.FixedAssetDepreciations`

| Campo | Valor |
|---|---|
| ID T05 | COL-STK-30 |
| Colección lógica | `fixedAssetDepreciations` |
| Dueño | M13 |
| Propósito (resumen) | Amortizaciones por bien |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `FixedAssetDepreciationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.17](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/stk/0029-stk.FixedAssetDepreciations.sql` | |

### `stk.RmaCases`

| Campo | Valor |
|---|---|
| ID T05 | COL-STK-31 |
| Colección lógica | `rmaCases` |
| Dueño | M13 |
| Propósito (resumen) | RMA de equipos con proveedores |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `RmaCasId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.17](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/stk/0030-stk.RmaCases.sql` | |

### `stk.ReceptionStatuses`

| Campo | Valor |
|---|---|
| ID T05 | COL-STK-32 |
| Colección lógica | `receptionStatuses` |
| Dueño | M13 |
| Propósito (resumen) | Estados de recepción de servicio técnico |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `ReceptionStatusId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.17](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/stk/0031-stk.ReceptionStatuses.sql` | |

### `stk.ServiceReceptions`

| Campo | Valor |
|---|---|
| ID T05 | COL-STK-33 |
| Colección lógica | `serviceReceptions` |
| Dueño | M13 |
| Propósito (resumen) | Equipos de clientes recibidos para reparación |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `ServiceReceptionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.17](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/stk/0032-stk.ServiceReceptions.sql` | |

### `stk.BomStructures`

| Campo | Valor |
|---|---|
| ID T05 | COL-STK-34 |
| Colección lógica | `bomStructures` |
| Dueño | M13 |
| Propósito (resumen) | Estructuras de producto |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `BomStructureId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.17](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/stk/0033-stk.BomStructures.sql` | |

### `stk.BomStructureVersions`

| Campo | Valor |
|---|---|
| ID T05 | COL-STK-35 |
| Colección lógica | `bomStructureVersions` |
| Dueño | M13 |
| Propósito (resumen) | Versiones de estructura |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `BomStructureVersionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.17](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/stk/0034-stk.BomStructureVersions.sql` | |

### `stk.ProductDivisions`

| Campo | Valor |
|---|---|
| ID T05 | COL-STK-36 |
| Colección lógica | `productDivisions` |
| Dueño | M13 |
| Propósito (resumen) | Divisiones de producto |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `ProductDivisionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.17](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/stk/0035-stk.ProductDivisions.sql` | |

### `stk.ManufacturingStages`

| Campo | Valor |
|---|---|
| ID T05 | COL-STK-37 |
| Colección lógica | `manufacturingStages` |
| Dueño | M13 |
| Propósito (resumen) | Etapas de fabricación |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `ManufacturingStageId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.17](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/stk/0036-stk.ManufacturingStages.sql` | |

### `stk.ManufacturingOrders`

| Campo | Valor |
|---|---|
| ID T05 | COL-STK-38 |
| Colección lógica | `manufacturingOrders` |
| Dueño | M13 |
| Propósito (resumen) | Órdenes de fabricación |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `ManufacturingOrderId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.17](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/stk/0037-stk.ManufacturingOrders.sql` | |

### `stk.ProductionReports`

| Campo | Valor |
|---|---|
| ID T05 | COL-STK-39 |
| Colección lógica | `productionReports` |
| Dueño | M13 |
| Propósito (resumen) | Partes de producción |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `ProductionReportId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.17](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/stk/0038-stk.ProductionReports.sql` | |

### `stk.MrpRuns`

| Campo | Valor |
|---|---|
| ID T05 | COL-STK-40 |
| Colección lógica | `mrpRuns` |
| Dueño | M13 |
| Propósito (resumen) | Aprovisionamiento de fabricación |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `MrpRunId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.17](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/stk/0039-stk.MrpRuns.sql` | |

## Esquema `sue`

### ~~`sue.Employers`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-01 |
| Colección lógica | `employers` |
| Dueño | M16 |
| Propósito (resumen) | (empresa empleadora: subdocumento `employer` de `legalEntities`) |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-CFG-41 |
| SQL | No crear; ver `A→COL-CFG-41` |
| **Capa B:** canónica T04 — [`07` §2.3](07-modelo-relacional-azure-sql.md) `LegalEntities` (`employer`) | |
| **Capa C:** pendiente | |

### `sue.Employees`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-02 |
| Colección lógica | `employees` |
| Dueño | M16 |
| Propósito (resumen) | Legajos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `EmployeeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0001-sue.Employees.sql` | |

### `sue.EmployeeAssignments`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-03 |
| Colección lógica | `employeeAssignments` |
| Dueño | M16 |
| Propósito (resumen) | Historia de categoría, puesto y área |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `EmployeeAssignmentId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0002-sue.EmployeeAssignments.sql` | |

### `sue.EmployeeCostAllocations`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-04 |
| Colección lógica | `employeeCostAllocations` |
| Dueño | M16 |
| Propósito (resumen) | Distribución por centro de costo |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `EmployeeCostAllocationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0003-sue.EmployeeCostAllocations.sql` | |

### `sue.EmployeeFamilyMembers`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-05 |
| Colección lógica | `employeeFamilyMembers` |
| Dueño | M16 |
| Propósito (resumen) | Familiares a cargo |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `EmployeeFamilyMemberId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0004-sue.EmployeeFamilyMembers.sql` | |

### `sue.EmployeePayAccounts`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-06 |
| Colección lógica | `employeePayAccounts` |
| Dueño | M16 |
| Propósito (resumen) | Cuentas de cobro (CBU cifrado) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `EmployeePayAccountId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0005-sue.EmployeePayAccounts.sql` | |

### `sue.EmployeeDocuments`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-07 |
| Colección lógica | `employeeDocuments` |
| Dueño | M16 |
| Propósito (resumen) | Documentación del legajo |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `EmployeeDocumentId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0006-sue.EmployeeDocuments.sql` | |

### `sue.EmployeeNotes`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-08 |
| Colección lógica | `employeeNotes` |
| Dueño | M16 |
| Propósito (resumen) | Notas del legajo |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `EmployeeNoteId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0007-sue.EmployeeNotes.sql` | |

### `sue.SupervisionLinks`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-09 |
| Colección lógica | `supervisionLinks` |
| Dueño | M16 |
| Propósito (resumen) | Supervisores |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `SupervisionLinkId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0008-sue.SupervisionLinks.sql` | |

### `sue.Shifts`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-10 |
| Colección lógica | `shifts` |
| Dueño | M16 |
| Propósito (resumen) | Turnos de trabajo |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `ShiftId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0009-sue.Shifts.sql` | |

### `sue.EmployeeShiftAssignments`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-11 |
| Colección lógica | `employeeShiftAssignments` |
| Dueño | M16 |
| Propósito (resumen) | Turnos por empleado |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `EmployeeShiftAssignmentId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0010-sue.EmployeeShiftAssignments.sql` | |

### `sue.EmploymentStatusPeriods`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-12 |
| Colección lógica | `employmentStatusPeriods` |
| Dueño | M16 |
| Propósito (resumen) | Situación de revista |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `EmploymentStatusPeriodId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0011-sue.EmploymentStatusPeriods.sql` | |

### `sue.ExtraGroups`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-13 |
| Colección lógica | `extraGroups` |
| Dueño | M16 |
| Propósito (resumen) | Grupos de extras |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `ExtraGroupId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0012-sue.ExtraGroups.sql` | |

### `sue.ExtraItems`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-14 |
| Colección lógica | `extraItems` |
| Dueño | M16 |
| Propósito (resumen) | Extras |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `ExtraItemId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0013-sue.ExtraItems.sql` | |

### `sue.EmployeeExtras`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-15 |
| Colección lógica | `employeeExtras` |
| Dueño | M16 |
| Propósito (resumen) | Extras por empleado |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `EmployeeExtraId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0014-sue.EmployeeExtras.sql` | |

### `sue.DeductionPlans`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-16 |
| Colección lógica | `deductionPlans` |
| Dueño | M16 |
| Propósito (resumen) | Descuentos en cuotas (préstamos, embargos) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `DeductionPlanId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0015-sue.DeductionPlans.sql` | |

### `sue.Unions`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-17 |
| Colección lógica | `unions` |
| Dueño | M16 |
| Propósito (resumen) | Sindicatos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `UnionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0016-sue.Unions.sql` | |

### `sue.LaborAgreements`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-18 |
| Colección lógica | `laborAgreements` |
| Dueño | M16 |
| Propósito (resumen) | Convenios colectivos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `LaborAgreementId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0017-sue.LaborAgreements.sql` | |

### `sue.SalaryCategories`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-19 |
| Colección lógica | `salaryCategories` |
| Dueño | M16 |
| Propósito (resumen) | Categorías salariales |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `SalaryCategoryId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0018-sue.SalaryCategories.sql` | |

### `sue.SalaryScales`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-20 |
| Colección lógica | `salaryScales` |
| Dueño | M16 |
| Propósito (resumen) | Escalas salariales |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `SalaryScaleId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0019-sue.SalaryScales.sql` | |

### `sue.SeniorityScales`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-21 |
| Colección lógica | `seniorityScales` |
| Dueño | M16 |
| Propósito (resumen) | Escalas de antigüedad |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `SeniorityScaleId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0020-sue.SeniorityScales.sql` | |

### `sue.Positions`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-22 |
| Colección lógica | `positions` |
| Dueño | M16 |
| Propósito (resumen) | Puestos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `PositionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0021-sue.Positions.sql` | |

### `sue.WorkAreas`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-23 |
| Colección lógica | `workAreas` |
| Dueño | M16 |
| Propósito (resumen) | Áreas laborales (distintas de `crmAreas`) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `WorkAreaId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0022-sue.WorkAreas.sql` | |

### `sue.HealthInsurerAdoptions`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-24 |
| Colección lógica | `healthInsurerAdoptions` |
| Dueño | M16 |
| Propósito (resumen) | Obras sociales adoptadas (catálogo oficial en `payrollOfficialCodes`) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `HealthInsurerAdoptionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0023-sue.HealthInsurerAdoptions.sql` | |

### `sue.TerminationReasons`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-25 |
| Colección lógica | `terminationReasons` |
| Dueño | M16 |
| Propósito (resumen) | Causas de egreso |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `TerminationReasonId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0024-sue.TerminationReasons.sql` | |

### `sue.PayrollVariables`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-26 |
| Colección lógica | `payrollVariables` |
| Dueño | M16 |
| Propósito (resumen) | Variables de liquidación |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `PayrollVariableId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0025-sue.PayrollVariables.sql` | |

### `sue.PayrollConcepts`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-27 |
| Colección lógica | `payrollConcepts` |
| Dueño | M16 |
| Propósito (resumen) | Conceptos de liquidación |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `PayrollConceptId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0026-sue.PayrollConcepts.sql` | |

### `sue.PayrollTypes`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-28 |
| Colección lógica | `payrollTypes` |
| Dueño | M16 |
| Propósito (resumen) | Tipos de liquidación |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `PayrollTypeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0027-sue.PayrollTypes.sql` | |

### `sue.PayrollConfigVersions`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-29 |
| Colección lógica | `payrollConfigVersions` |
| Dueño | M16 |
| Propósito (resumen) | Versiones publicadas de configuración |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `PayrollConfigVersionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0028-sue.PayrollConfigVersions.sql` | |

### `sue.NoveltyTypes`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-30 |
| Colección lógica | `noveltyTypes` |
| Dueño | M16 |
| Propósito (resumen) | Tipos de novedad |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `NoveltyTypeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0029-sue.NoveltyTypes.sql` | |

### `sue.Novelties`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-31 |
| Colección lógica | `novelties` |
| Dueño | M16 |
| Propósito (resumen) | Novedades |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `NoveltyId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0030-sue.Novelties.sql` | |

### `sue.NoveltyImportBatches`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-32 |
| Colección lógica | `noveltyImportBatches` |
| Dueño | M16 |
| Propósito (resumen) | Lotes de importación de novedades |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `NoveltyImportBatcheId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0031-sue.NoveltyImportBatches.sql` | |

### `sue.TimePunches`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-33 |
| Colección lógica | `timePunches` |
| Dueño | M16 |
| Propósito (resumen) | Fichadas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `TimePuncheId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0032-sue.TimePunches.sql` | |

### `sue.ExtraTasks`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-34 |
| Colección lógica | `extraTasks` |
| Dueño | M16 |
| Propósito (resumen) | Tareas extraordinarias |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `ExtraTaskId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0033-sue.ExtraTasks.sql` | |

### `sue.LeaveCauses`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-35 |
| Colección lógica | `leaveCauses` |
| Dueño | M16 |
| Propósito (resumen) | Causas de licencia |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `LeaveCausId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0034-sue.LeaveCauses.sql` | |

### `sue.LeaveRequests`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-36 |
| Colección lógica | `leaveRequests` |
| Dueño | M16 |
| Propósito (resumen) | Licencias (diagnóstico nunca en claro) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `LeaveRequestId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0035-sue.LeaveRequests.sql` | |

### `sue.VacationBalances`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-37 |
| Colección lógica | `vacationBalances` |
| Dueño | M16 |
| Propósito (resumen) | Saldos de vacaciones |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `VacationBalanceId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0036-sue.VacationBalances.sql` | |

### `sue.PayPeriods`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-38 |
| Colección lógica | `payPeriods` |
| Dueño | M16 |
| Propósito (resumen) | Períodos de liquidación |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `PayPeriodId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0037-sue.PayPeriods.sql` | |

### `sue.PayrollRuns`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-39 |
| Colección lógica | `payrollRuns` |
| Dueño | M16 |
| Propósito (resumen) | Liquidaciones |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `PayrollRunId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0038-sue.PayrollRuns.sql` | |

### `sue.Payslips`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-40 |
| Colección lógica | `payslips` |
| Dueño | M16 |
| Propósito (resumen) | Recibos de sueldo |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `PayslipId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0039-sue.Payslips.sql` | |

### `sue.IncomeTaxCalculations`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-41 |
| Colección lógica | `incomeTaxCalculations` |
| Dueño | M16 |
| Propósito (resumen) | Cálculo de Ganancias 4.ª categoría |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `IncomeTaxCalculationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0040-sue.IncomeTaxCalculations.sql` | |

### `sue.IncomeTaxDeclarations`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-42 |
| Colección lógica | `incomeTaxDeclarations` |
| Dueño | M16 |
| Propósito (resumen) | Formularios del empleado (F.572) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `IncomeTaxDeclarationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0041-sue.IncomeTaxDeclarations.sql` | |

### `sue.StatutoryFilings`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-43 |
| Colección lógica | `statutoryFilings` |
| Dueño | M16 |
| Propósito (resumen) | Presentaciones (LSD, F.931) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `StatutoryFilingId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0042-sue.StatutoryFilings.sql` | |

### `sue.PayrollPaymentRequests`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-44 |
| Colección lógica | `payrollPaymentRequests` |
| Dueño | M16 |
| Propósito (resumen) | Solicitudes de pago a M14 |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `PayrollPaymentRequestId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0043-sue.PayrollPaymentRequests.sql` | |

### `sue.PayrollAccountingRules`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-45 |
| Colección lógica | `payrollAccountingRules` |
| Dueño | M16 |
| Propósito (resumen) | Reglas de asiento de sueldos (resuelven contra `postingRules`) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `PayrollAccountingRuleId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0044-sue.PayrollAccountingRules.sql` | |

### `sue.Terminations`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-46 |
| Colección lógica | `terminations` |
| Dueño | M16 |
| Propósito (resumen) | Egresos y liquidación final |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `TerminationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0045-sue.Terminations.sql` | |

### `sue.EmploymentCertificates`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-47 |
| Colección lógica | `employmentCertificates` |
| Dueño | M16 |
| Propósito (resumen) | Certificados de trabajo |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `EmploymentCertificateId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0046-sue.EmploymentCertificates.sql` | |

### `sue.PayslipNotifications`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-48 |
| Colección lógica | `payslipNotifications` |
| Dueño | M16 |
| Propósito (resumen) | Entrega y firma de recibos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `PayslipNotificationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0047-sue.PayslipNotifications.sql` | |

### `sue.PerformanceTemplates`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-49 |
| Colección lógica | `performanceTemplates` |
| Dueño | M16 |
| Propósito (resumen) | Plantillas de evaluación |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `PerformanceTemplateId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0048-sue.PerformanceTemplates.sql` | |

### `sue.PerformanceCycles`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-50 |
| Colección lógica | `performanceCycles` |
| Dueño | M16 |
| Propósito (resumen) | Ciclos de evaluación |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `PerformanceCycleId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0049-sue.PerformanceCycles.sql` | |

### `sue.PerformanceReviews`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-51 |
| Colección lógica | `performanceReviews` |
| Dueño | M16 |
| Propósito (resumen) | Evaluaciones |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `PerformanceReviewId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0050-sue.PerformanceReviews.sql` | |

### `sue.Objectives`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-52 |
| Colección lógica | `objectives` |
| Dueño | M16 |
| Propósito (resumen) | Objetivos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `ObjectiveId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0051-sue.Objectives.sql` | |

### `sue.DisciplinaryActions`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-53 |
| Colección lógica | `disciplinaryActions` |
| Dueño | M16 |
| Propósito (resumen) | Sanciones |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `DisciplinaryActionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0052-sue.DisciplinaryActions.sql` | |

### `sue.AdministrativeInquiries`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-54 |
| Colección lógica | `administrativeInquiries` |
| Dueño | M16 |
| Propósito (resumen) | Sumarios |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `AdministrativeInquiryId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0053-sue.AdministrativeInquiries.sql` | |

### `sue.WorkAccidents`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-55 |
| Colección lógica | `workAccidents` |
| Dueño | M16 |
| Propósito (resumen) | Accidentes de trabajo |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `WorkAccidentId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0054-sue.WorkAccidents.sql` | |

### `sue.LaborLawsuits`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-56 |
| Colección lógica | `laborLawsuits` |
| Dueño | M16 |
| Propósito (resumen) | Juicios laborales |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `LaborLawsuitId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0055-sue.LaborLawsuits.sql` | |

### `sue.ReportGroups`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-57 |
| Colección lógica | `reportGroups` |
| Dueño | M16 |
| Propósito (resumen) | Agrupaciones de conceptos para informes |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `ReportGroupId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0056-sue.ReportGroups.sql` | |

### `sue.SalaryIncreaseBatches`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-58 |
| Colección lógica | `salaryIncreaseBatches` |
| Dueño | M16 |
| Propósito (resumen) | Aumentos masivos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `SalaryIncreaseBatcheId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0057-sue.SalaryIncreaseBatches.sql` | |

### `sue.ExternalPayrollImports`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-59 |
| Colección lógica | `externalPayrollImports` |
| Dueño | M16 |
| Propósito (resumen) | Liquidaciones de liquidador externo (DEC-058) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `ExternalPayrollImportId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0058-sue.ExternalPayrollImports.sql` | |

### `sue.ExternalPayrollLayouts`

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-60 |
| Colección lógica | `externalPayrollLayouts` |
| Dueño | M16 |
| Propósito (resumen) | Formatos del liquidador externo (sobre `fileLayouts` de T06) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `ExternalPayrollLayoutId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.19](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/sue/0059-sue.ExternalPayrollLayouts.sql` | |

### ~~`sue.ParallelRunComparisons`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-SUE-61 |
| Colección lógica | `parallelRunComparisons` |
| Dueño | M16 |
| Propósito (resumen) | (comparación de liquidaciones en paralelo: canónica de T07) |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-MIG-14 |
| SQL | No crear; ver `A→COL-MIG-14` |
| **Capa B:** canónica T07 — [`mig.ParallelComparisons`](07-catalogo-tablas-sql.md) (§2.27) | |
| **Capa C:** pendiente | |

## Esquema `tar`

### `tar.TariffSchedules`

| Campo | Valor |
|---|---|
| ID T05 | COL-TAR-01 |
| Colección lógica | `tariffSchedules` |
| Dueño | M04 |
| Propósito (resumen) | Versión de cuadro tarifario |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `TariffScheduleId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.8](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tar/0001-tar.TariffSchedules.sql` | |

### `tar.TariffServiceSettings`

| Campo | Valor |
|---|---|
| ID T05 | COL-TAR-02 |
| Colección lógica | `tariffServiceSettings` |
| Dueño | M04 |
| Propósito (resumen) | Configuración tarifaria del servicio |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `TariffServiceSettingId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.8](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tar/0002-tar.TariffServiceSettings.sql` | |

### `tar.TariffCategoryRates`

| Campo | Valor |
|---|---|
| ID T05 | COL-TAR-03 |
| Colección lógica | `tariffCategoryRates` |
| Dueño | M04 |
| Propósito (resumen) | Tarifa por categoría |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `TariffCategoryRateId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.8](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tar/0003-tar.TariffCategoryRates.sql` | |

### `tar.TariffRows`

| Campo | Valor |
|---|---|
| ID T05 | COL-TAR-04 |
| Colección lógica | `tariffRows` |
| Dueño | M04 |
| Propósito (resumen) | Tramos y escalones |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `TariffRowId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.8](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tar/0004-tar.TariffRows.sql` | |

### `tar.AdherentRates`

| Campo | Valor |
|---|---|
| ID T05 | COL-TAR-05 |
| Colección lógica | `adherentRates` |
| Dueño | M04 |
| Propósito (resumen) | Tarifas por adherente |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `AdherentRateId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.8](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tar/0005-tar.AdherentRates.sql` | |

### `tar.ProductPrices`

| Campo | Valor |
|---|---|
| ID T05 | COL-TAR-06 |
| Colección lógica | `productPrices` |
| Dueño | M04 |
| Propósito (resumen) | Precios por versión; `kind` incluye los precios de cementerio. Los precios de vivienda son COL-SOC-30 `housingPrices` de |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `ProductPriceId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.8](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tar/0006-tar.ProductPrices.sql` | |

### `tar.EventCharges`

| Campo | Valor |
|---|---|
| ID T05 | COL-TAR-07 |
| Colección lógica | `eventCharges` |
| Dueño | M04 |
| Propósito (resumen) | Cargos por evento con filtros (canónica; absorbe `eventChargeRules` de M02). Disparadores `equipment_not_returned` (con  |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `EventChargeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.8](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tar/0007-tar.EventCharges.sql` | |

### `tar.EventChargeBonuses`

| Campo | Valor |
|---|---|
| ID T05 | COL-TAR-08 |
| Colección lógica | `eventChargeBonuses` |
| Dueño | M04 |
| Propósito (resumen) | Bonificaciones de cargos por evento (absorbe `eventChargeWaivers` de M02) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `EventChargeBonusId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.8](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tar/0008-tar.EventChargeBonuses.sql` | |

### `tar.CategoryCoefficients`

| Campo | Valor |
|---|---|
| ID T05 | COL-TAR-09 |
| Colección lógica | `categoryCoefficients` |
| Dueño | M04 |
| Propósito (resumen) | Coeficientes por categoría |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `CategoryCoefficientId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.8](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tar/0009-tar.CategoryCoefficients.sql` | |

### `tar.GasCalorificFactors`

| Campo | Valor |
|---|---|
| ID T05 | COL-TAR-10 |
| Colección lógica | `gasCalorificFactors` |
| Dueño | M04 |
| Propósito (resumen) | Factores de gas por período y categoría (poder calorífico, presión, temperatura, aprobación); canónica por DEC-085 y HUE |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `GasCalorificFactorId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.8](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tar/0010-tar.GasCalorificFactors.sql` | |

### `tar.ChargeRules`

| Campo | Valor |
|---|---|
| ID T05 | COL-TAR-11 |
| Colección lógica | `chargeRules` |
| Dueño | M04 |
| Propósito (resumen) | Reglas declarativas (cargos, beneficios, tributos). `formulaJustification {usesFormula (derivado), kind: declarative_ins |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `ChargeRuleId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.8](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tar/0011-tar.ChargeRules.sql` | |

### `tar.FormulaFunctions`

| Campo | Valor |
|---|---|
| ID T05 | COL-TAR-12 |
| Colección lógica | `formulaFunctions` |
| Dueño | M04 |
| Propósito (resumen) | Funciones GFL nativas y declarativas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `FormulaFunctionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.8](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tar/0012-tar.FormulaFunctions.sql` | |

### `tar.BenefitGroups`

| Campo | Valor |
|---|---|
| ID T05 | COL-TAR-13 |
| Colección lógica | `benefitGroups` |
| Dueño | M04 |
| Propósito (resumen) | Grupos de beneficio tarifario |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `BenefitGroupId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.8](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tar/0013-tar.BenefitGroups.sql` | |

### `tar.BenefitGroupMembers`

| Campo | Valor |
|---|---|
| ID T05 | COL-TAR-14 |
| Colección lógica | `benefitGroupMembers` |
| Dueño | M04 |
| Propósito (resumen) | Miembros de grupos de beneficio tarifario (historia inmutable); se cargan por regla o alta del tenant, no desde `BENSOC` |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `BenefitGroupMemberId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.8](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tar/0014-tar.BenefitGroupMembers.sql` | |

### `tar.SubsidyRegimes`

| Campo | Valor |
|---|---|
| ID T05 | COL-TAR-15 |
| Colección lógica | `subsidyRegimes` |
| Dueño | M04 |
| Propósito (resumen) | Regímenes de subsidio |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `SubsidyRegimeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.8](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tar/0015-tar.SubsidyRegimes.sql` | |

### `tar.SubsidyRollImports`

| Campo | Valor |
|---|---|
| ID T05 | COL-TAR-16 |
| Colección lógica | `subsidyRollImports` |
| Dueño | M04 |
| Propósito (resumen) | Padrones de subsidio importados |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `SubsidyRollImportId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.8](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tar/0016-tar.SubsidyRollImports.sql` | |

### `tar.SubsidyEnrollments`

| Campo | Valor |
|---|---|
| ID T05 | COL-TAR-17 |
| Colección lógica | `subsidyEnrollments` |
| Dueño | M04 |
| Propósito (resumen) | Inscripciones a subsidio |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `SubsidyEnrollmentId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.8](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tar/0017-tar.SubsidyEnrollments.sql` | |

### `tar.Promotions`

| Campo | Valor |
|---|---|
| ID T05 | COL-TAR-18 |
| Colección lógica | `promotions` |
| Dueño | M04 |
| Propósito (resumen) | Promociones |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `PromotionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.8](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tar/0018-tar.Promotions.sql` | |

### `tar.PromotionAssignments`

| Campo | Valor |
|---|---|
| ID T05 | COL-TAR-19 |
| Colección lógica | `promotionAssignments` |
| Dueño | M04 |
| Propósito (resumen) | Promociones asignadas a contratos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `PromotionAssignmentId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.8](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tar/0019-tar.PromotionAssignments.sql` | |

### `tar.WorksInstallmentPlans`

| Campo | Valor |
|---|---|
| ID T05 | COL-TAR-20 |
| Colección lógica | `worksInstallmentPlans` |
| Dueño | M04 |
| Propósito (resumen) | Cuotas de obra (tipo 17; HUECO-OBR-05); se crea por obra + inmueble aunque el contrato de obra de M02 esté pendiente (HU |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `WorksInstallmentPlanId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.8](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tar/0020-tar.WorksInstallmentPlans.sql` | |

### `tar.RoundingPolicies`

| Campo | Valor |
|---|---|
| ID T05 | COL-TAR-21 |
| Colección lógica | `roundingPolicies` |
| Dueño | M04 |
| Propósito (resumen) | Políticas de redondeo |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `RoundingPolicyId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.8](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tar/0021-tar.RoundingPolicies.sql` | |

### `tar.RoundingCarryEntries`

| Campo | Valor |
|---|---|
| ID T05 | COL-TAR-22 |
| Colección lógica | `roundingCarryEntries` |
| Dueño | M04 |
| Propósito (resumen) | Proyección de arrastre de redondeo (saldo fuente en M07) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `RoundingCarryEntryId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.8](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tar/0022-tar.RoundingCarryEntries.sql` | |

### `tar.PhoneRatePlans`

| Campo | Valor |
|---|---|
| ID T05 | COL-TAR-23 |
| Colección lógica | `phoneRatePlans` |
| Dueño | M04 |
| Propósito (resumen) | Planes de tasación telefónica |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `PhoneRatePlanId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.8](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tar/0023-tar.PhoneRatePlans.sql` | |

### `tar.PhoneTimeBands`

| Campo | Valor |
|---|---|
| ID T05 | COL-TAR-24 |
| Colección lógica | `phoneTimeBands` |
| Dueño | M04 |
| Propósito (resumen) | Bandas horarias |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `PhoneTimeBandId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.8](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tar/0024-tar.PhoneTimeBands.sql` | |

### `tar.PhoneBandAssignments`

| Campo | Valor |
|---|---|
| ID T05 | COL-TAR-25 |
| Colección lógica | `phoneBandAssignments` |
| Dueño | M04 |
| Propósito (resumen) | Asignación de bandas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `PhoneBandAssignmentId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.8](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tar/0025-tar.PhoneBandAssignments.sql` | |

### `tar.PhoneRates`

| Campo | Valor |
|---|---|
| ID T05 | COL-TAR-26 |
| Colección lógica | `phoneRates` |
| Dueño | M04 |
| Propósito (resumen) | Precios por destino y banda |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `PhoneRateId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.8](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tar/0026-tar.PhoneRates.sql` | |

### `tar.PhoneDiscountPlans`

| Campo | Valor |
|---|---|
| ID T05 | COL-TAR-27 |
| Colección lógica | `phoneDiscountPlans` |
| Dueño | M04 |
| Propósito (resumen) | Planes de descuento telefónico |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `PhoneDiscountPlanId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.8](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tar/0027-tar.PhoneDiscountPlans.sql` | |

### `tar.PhoneFreeNumbers`

| Campo | Valor |
|---|---|
| ID T05 | COL-TAR-28 |
| Colección lógica | `phoneFreeNumbers` |
| Dueño | M04 |
| Propósito (resumen) | Números gratuitos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `PhoneFreeNumberId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.8](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tar/0028-tar.PhoneFreeNumbers.sql` | |

### `tar.CalculationRuns`

| Campo | Valor |
|---|---|
| ID T05 | COL-TAR-29 |
| Colección lógica | `calculationRuns` |
| Dueño | M04 |
| Propósito (resumen) | Ejecuciones del motor |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `CalculationRunId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.8](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tar/0029-tar.CalculationRuns.sql` | |

### `tar.Calculations`

| Campo | Valor |
|---|---|
| ID T05 | COL-TAR-30 |
| Colección lógica | `calculations` |
| Dueño | M04 |
| Propósito (resumen) | Resultado de cálculo por cuenta con traza (alto volumen) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `CalculationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.8](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tar/0030-tar.Calculations.sql` | |

### `tar.SimulationRuns`

| Campo | Valor |
|---|---|
| ID T05 | COL-TAR-31 |
| Colección lógica | `simulationRuns` |
| Dueño | M04 |
| Propósito (resumen) | Simulaciones |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `SimulationRunId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.8](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tar/0031-tar.SimulationRuns.sql` | |

### `tar.SimulationResults`

| Campo | Valor |
|---|---|
| ID T05 | COL-TAR-32 |
| Colección lógica | `simulationResults` |
| Dueño | M04 |
| Propósito (resumen) | Resultado de simulación por cuenta; TTL por `expiresAt` |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `SimulationResultId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.8](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tar/0032-tar.SimulationResults.sql` | |

### `tar.RetroactiveDiffRuns`

| Campo | Valor |
|---|---|
| ID T05 | COL-TAR-33 |
| Colección lógica | `retroactiveDiffRuns` |
| Dueño | M04 |
| Propósito (resumen) | Diferencias retroactivas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `RetroactiveDiffRunId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.8](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tar/0033-tar.RetroactiveDiffRuns.sql` | |

### `tar.NormativeDocuments`

| Campo | Valor |
|---|---|
| ID T05 | COL-TAR-34 |
| Colección lógica | `normativeDocuments` |
| Dueño | M04 |
| Propósito (resumen) | Documentos normativos tarifarios |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `NormativeDocumentId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.8](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tar/0034-tar.NormativeDocuments.sql` | |

### ~~`tar.PreloadedCharges`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-TAR-35 |
| Colección lógica | `preloadedCharges` |
| Dueño | M04 |
| Propósito (resumen) | (duplicada con `billableItems` de M05) |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-FAC-11 |
| SQL | No crear; ver `A→COL-FAC-11` |
| **Capa B:** [`07` §2.8](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** pendiente | |

### `tar.BonusRecalcRuns`

| Campo | Valor |
|---|---|
| ID T05 | COL-TAR-36 |
| Colección lógica | `bonusRecalcRuns` |
| Dueño | M04 |
| Propósito (resumen) | Recálculo masivo de bonificaciones |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `BonusRecalcRunId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.8](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tar/0035-tar.BonusRecalcRuns.sql` | |

## Esquema `tec`

### `tec.FeasibilityRequests`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-01 |
| Colección lógica | `feasibilityRequests` |
| Dueño | M10 |
| Propósito (resumen) | Factibilidades |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `FeasibilityRequestId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0001-tec.FeasibilityRequests.sql` | |

### `tec.ConnectionEstimates`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-02 |
| Colección lógica | `connectionEstimates` |
| Dueño | M10 |
| Propósito (resumen) | Estimación técnica de conexión |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `ConnectionEstimateId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0002-tec.ConnectionEstimates.sql` | |

### `tec.TechnicalNotes`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-03 |
| Colección lógica | `technicalNotes` |
| Dueño | M10 |
| Propósito (resumen) | Notas técnicas de solo agregado |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `TechnicalNoteId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0003-tec.TechnicalNotes.sql` | |

### `tec.WorkOrderOperationTypes`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-04 |
| Colección lógica | `workOrderOperationTypes` |
| Dueño | M10 |
| Propósito (resumen) | Tipos de transacción de OT; declarada en M10 como `operationTypes`, que choca con T11 (CTR-DAT-15). 5-11-2026: la column |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C (antes `R`) |
| PK sugerida | `WorkOrderOperationTypeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0004-tec.WorkOrderOperationTypes.sql` | |

### `tec.WorkTypes`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-05 |
| Colección lógica | `workTypes` |
| Dueño | M10 |
| Propósito (resumen) | Tipos de trabajo |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `WorkTypeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0005-tec.WorkTypes.sql` | |

### `tec.IncidentCategories`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-06 |
| Colección lógica | `incidentCategories` |
| Dueño | M10 |
| Propósito (resumen) | Categorías de incidencia técnica |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `IncidentCategoryId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0006-tec.IncidentCategories.sql` | |

### `tec.ResolutionCodes`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-07 |
| Colección lógica | `resolutionCodes` |
| Dueño | M10 |
| Propósito (resumen) | Códigos de resolución |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `ResolutionCodeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0007-tec.ResolutionCodes.sql` | |

### `tec.TaskCatalog`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-08 |
| Colección lógica | `taskCatalog` |
| Dueño | M10 |
| Propósito (resumen) | Catálogo único de tareas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `TaskCatalogId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0008-tec.TaskCatalog.sql` | |

### `tec.TaskGroups`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-09 |
| Colección lógica | `taskGroups` |
| Dueño | M10 |
| Propósito (resumen) | Grupos de tareas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `TaskGroupId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0009-tec.TaskGroups.sql` | |

### `tec.WorkOrderPrintTemplates`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-10 |
| Colección lógica | `workOrderPrintTemplates` |
| Dueño | M10 |
| Propósito (resumen) | Modelos de impresión de OT |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `WorkOrderPrintTemplateId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0010-tec.WorkOrderPrintTemplates.sql` | |

### `tec.ChainedOrderRules`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-11 |
| Colección lógica | `chainedOrderRules` |
| Dueño | M10 |
| Propósito (resumen) | Reglas de OT encadenadas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `ChainedOrderRuleId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0011-tec.ChainedOrderRules.sql` | |

### `tec.WorkOrders`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-12 |
| Colección lógica | `workOrders` |
| Dueño | M10 |
| Propósito (resumen) | Órdenes de trabajo (instalación como subdocumento) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `WorkOrderId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0012-tec.WorkOrders.sql` | |

### `tec.WorkOrderMaterials`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-13 |
| Colección lógica | `workOrderMaterials` |
| Dueño | M10 |
| Propósito (resumen) | Materiales y necesidades |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `WorkOrderMaterialId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0013-tec.WorkOrderMaterials.sql` | |

### `tec.FieldEvidence`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-14 |
| Colección lógica | `fieldEvidence` |
| Dueño | M10 |
| Propósito (resumen) | Evidencias de campo |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `FieldEvidenceId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0014-tec.FieldEvidence.sql` | |

### `tec.ServiceConformities`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-15 |
| Colección lógica | `serviceConformities` |
| Dueño | M10 |
| Propósito (resumen) | Conformidad y firma |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `ServiceConformityId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0015-tec.ServiceConformities.sql` | |

### `tec.DamageAssessments`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-16 |
| Colección lógica | `damageAssessments` |
| Dueño | M10 |
| Propósito (resumen) | Reclamos por daños |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `DamageAssessmentId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0016-tec.DamageAssessments.sql` | |

### `tec.TechnicalProcedures`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-17 |
| Colección lógica | `technicalProcedures` |
| Dueño | M10 |
| Propósito (resumen) | Expedientes técnicos (vinculados a `dossiers` de T11) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `TechnicalProcedureId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0017-tec.TechnicalProcedures.sql` | |

### `tec.VisitTypes`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-18 |
| Colección lógica | `visitTypes` |
| Dueño | M10 |
| Propósito (resumen) | Tipos de visita |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `VisitTypeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0018-tec.VisitTypes.sql` | |

### `tec.SchedulingZones`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-19 |
| Colección lógica | `schedulingZones` |
| Dueño | M10 |
| Propósito (resumen) | Zonas de agenda |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `SchedulingZoneId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0019-tec.SchedulingZones.sql` | |

### `tec.ResourceCalendars`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-20 |
| Colección lógica | `resourceCalendars` |
| Dueño | M10 |
| Propósito (resumen) | Calendario de recursos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `ResourceCalendarId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0020-tec.ResourceCalendars.sql` | |

### `tec.VisitBookings`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-21 |
| Colección lógica | `visitBookings` |
| Dueño | M10 |
| Propósito (resumen) | Reservas de visita |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `VisitBookingId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0021-tec.VisitBookings.sql` | |

### `tec.Visits`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-22 |
| Colección lógica | `visits` |
| Dueño | M10 |
| Propósito (resumen) | Visitas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `VisitId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0022-tec.Visits.sql` | |

### `tec.Crews`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-23 |
| Colección lógica | `crews` |
| Dueño | M10 |
| Propósito (resumen) | Cuadrillas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `CrewId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0023-tec.Crews.sql` | |

### `tec.FieldResources`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-24 |
| Colección lógica | `fieldResources` |
| Dueño | M10 |
| Propósito (resumen) | Recursos de campo (los vehículos se refieren a `fleetVehicles`) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `FieldResourceId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0024-tec.FieldResources.sql` | |

### `tec.ResponsibleNotificationRules`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-25 |
| Colección lógica | `responsibleNotificationRules` |
| Dueño | M10 |
| Propósito (resumen) | Avisos a responsables |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `ResponsibleNotificationRuleId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0025-tec.ResponsibleNotificationRules.sql` | |

### `tec.CertifiedInstallers`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-26 |
| Colección lógica | `certifiedInstallers` |
| Dueño | M10 |
| Propósito (resumen) | Instaladores habilitados (persona única, `personId` obligatorio y único por tenant; DEC-097, 10-11-2026) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `CertifiedInstallerId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0026-tec.CertifiedInstallers.sql` | |

### `tec.FieldForms`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-27 |
| Colección lógica | `fieldForms` |
| Dueño | M10 |
| Propósito (resumen) | Formularios de campo (sobre `formVersions` de T11) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `FieldFormId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0027-tec.FieldForms.sql` | |

### `tec.FieldDevices`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-28 |
| Colección lógica | `fieldDevices` |
| Dueño | M10 |
| Propósito (resumen) | Dispositivos de campo |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `FieldDeviceId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0028-tec.FieldDevices.sql` | |

### `tec.SyncMutations`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-29 |
| Colección lógica | `syncMutations` |
| Dueño | M10 |
| Propósito (resumen) | Mutaciones offline recibidas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `SyncMutationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0029-tec.SyncMutations.sql` | |

### `tec.SyncConflicts`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-30 |
| Colección lógica | `syncConflicts` |
| Dueño | M10 |
| Propósito (resumen) | Conflictos de sincronización |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `SyncConflictId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0030-tec.SyncConflicts.sql` | |

### `tec.MaintenancePlans`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-31 |
| Colección lógica | `maintenancePlans` |
| Dueño | M10 |
| Propósito (resumen) | Planes de mantenimiento |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `MaintenancePlanId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0031-tec.MaintenancePlans.sql` | |

### `tec.OutagePlans`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-32 |
| Colección lógica | `outagePlans` |
| Dueño | M10 |
| Propósito (resumen) | Cortes programados |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `OutagePlanId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0032-tec.OutagePlans.sql` | |

### `tec.Networks`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-33 |
| Colección lógica | `networks` |
| Dueño | M10 |
| Propósito (resumen) | Redes |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `NetworkId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0033-tec.Networks.sql` | |

### `tec.NetworkLayers`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-34 |
| Colección lógica | `networkLayers` |
| Dueño | M10 |
| Propósito (resumen) | Capas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `NetworkLayerId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0034-tec.NetworkLayers.sql` | |

### `tec.NetworkComponentTypes`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-35 |
| Colección lógica | `networkComponentTypes` |
| Dueño | M10 |
| Propósito (resumen) | Tipos de componente |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `NetworkComponentTypeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0035-tec.NetworkComponentTypes.sql` | |

### `tec.NetworkComponentRelations`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-36 |
| Colección lógica | `networkComponentRelations` |
| Dueño | M10 |
| Propósito (resumen) | Relaciones padre-hijo de tipos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `NetworkComponentRelationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0036-tec.NetworkComponentRelations.sql` | |

### `tec.NetworkAttributeDefs`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-37 |
| Colección lógica | `networkAttributeDefs` |
| Dueño | M10 |
| Propósito (resumen) | Atributos de componente |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `NetworkAttributeDefId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0037-tec.NetworkAttributeDefs.sql` | |

### `tec.NetworkElements`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-38 |
| Colección lógica | `networkElements` |
| Dueño | M10 |
| Propósito (resumen) | Elementos instalados (GIS) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `NetworkElementId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0038-tec.NetworkElements.sql` | |

### `tec.ServiceNetworkConnections`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-39 |
| Colección lógica | `serviceNetworkConnections` |
| Dueño | M10 |
| Propósito (resumen) | Conexión contrato–elemento |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `ServiceNetworkConnectionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0039-tec.ServiceNetworkConnections.sql` | |

### `tec.GisExportTemplates`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-40 |
| Colección lógica | `gisExportTemplates` |
| Dueño | M10 |
| Propósito (resumen) | Plantillas de exportación GIS |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `GisExportTemplateId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0040-tec.GisExportTemplates.sql` | |

### `tec.NetworkDevices`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-41 |
| Colección lógica | `networkDevices` |
| Dueño | M10 |
| Propósito (resumen) | Equipos de red (OLT, nodos) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `NetworkDeviceId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0041-tec.NetworkDevices.sql` | |

### `tec.ProvisioningSystems`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-42 |
| Colección lógica | `provisioningSystems` |
| Dueño | M10 |
| Propósito (resumen) | Sistemas de aprovisionamiento (sobre `integrationConnections`) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `ProvisioningSystemId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0042-tec.ProvisioningSystems.sql` | |

### `tec.ProvisioningProfiles`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-43 |
| Colección lógica | `provisioningProfiles` |
| Dueño | M10 |
| Propósito (resumen) | Perfiles por plan |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `ProvisioningProfileId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0043-tec.ProvisioningProfiles.sql` | |

### `tec.ServiceTechnicalProfiles`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-44 |
| Colección lógica | `serviceTechnicalProfiles` |
| Dueño | M10 |
| Propósito (resumen) | Perfil técnico del contrato (secretos en bóveda); `decoders[]` con estado CAS y paquetes, solo TV (HUE-TV-04) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `ServiceTechnicalProfileId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0044-tec.ServiceTechnicalProfiles.sql` | |

### `tec.ProvisioningCommands`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-45 |
| Colección lógica | `provisioningCommands` |
| Dueño | M10 |
| Propósito (resumen) | Comandos de aprovisionamiento |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `ProvisioningCommandId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0045-tec.ProvisioningCommands.sql` | |

### `tec.Works`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-46 |
| Colección lógica | `works` |
| Dueño | M10 |
| Propósito (resumen) | Obras y contribución por mejoras |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `WorkId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0046-tec.Works.sql` | |

### `tec.WorkGroups`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-47 |
| Colección lógica | `workGroups` |
| Dueño | M10 |
| Propósito (resumen) | Grupos de obra |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `WorkGroupId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0047-tec.WorkGroups.sql` | |

### `tec.WorkBeneficiaries`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-48 |
| Colección lógica | `workBeneficiaries` |
| Dueño | M10 |
| Propósito (resumen) | Frentistas beneficiarios |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `WorkBeneficiaryId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0048-tec.WorkBeneficiaries.sql` | |

### `tec.InspectionCases`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-49 |
| Colección lógica | `inspectionCases` |
| Dueño | M10 |
| Propósito (resumen) | Inspecciones y consumo no registrado |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `InspectionCasId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0049-tec.InspectionCases.sql` | |

### `tec.Seals`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-50 |
| Colección lógica | `seals` |
| Dueño | M10 |
| Propósito (resumen) | Precintos numerados con colocación (canónica; absorbe `meterSeals` de M03) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `SealId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0050-tec.Seals.sql` | |

### `tec.PhoneExchanges`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-51 |
| Colección lógica | `phoneExchanges` |
| Dueño | M10 |
| Propósito (resumen) | Centrales telefónicas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `PhoneExchangeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0051-tec.PhoneExchanges.sql` | |

### `tec.PhoneFrames`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-52 |
| Colección lógica | `phoneFrames` |
| Dueño | M10 |
| Propósito (resumen) | Repartidores |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `PhoneFrameId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0052-tec.PhoneFrames.sql` | |

### `tec.PhoneFrameGroups`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-53 |
| Colección lógica | `phoneFrameGroups` |
| Dueño | M10 |
| Propósito (resumen) | Grupos de repartidor |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `PhoneFrameGroupId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0053-tec.PhoneFrameGroups.sql` | |

### `tec.PhoneStrips`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-54 |
| Colección lógica | `phoneStrips` |
| Dueño | M10 |
| Propósito (resumen) | Regletas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `PhoneStripId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0054-tec.PhoneStrips.sql` | |

### `tec.PhoneStripPositions`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-55 |
| Colección lógica | `phoneStripPositions` |
| Dueño | M10 |
| Propósito (resumen) | Posiciones de regleta |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `PhoneStripPositionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0055-tec.PhoneStripPositions.sql` | |

### `tec.PhoneBoxes`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-56 |
| Colección lógica | `phoneBoxes` |
| Dueño | M10 |
| Propósito (resumen) | Cajas telefónicas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `PhoneBoxeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0056-tec.PhoneBoxes.sql` | |

### `tec.Dslams`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-57 |
| Colección lógica | `dslams` |
| Dueño | M10 |
| Propósito (resumen) | DSLAM |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `DslamId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0057-tec.Dslams.sql` | |

### `tec.PhonePorts`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-58 |
| Colección lógica | `phonePorts` |
| Dueño | M10 |
| Propósito (resumen) | Puertos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `PhonePortId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0058-tec.PhonePorts.sql` | |

### `tec.PhonePrefixes`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-59 |
| Colección lógica | `phonePrefixes` |
| Dueño | M10 |
| Propósito (resumen) | Prefijos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `PhonePrefixeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0059-tec.PhonePrefixes.sql` | |

### `tec.PhoneNumbers`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-60 |
| Colección lógica | `phoneNumbers` |
| Dueño | M10 |
| Propósito (resumen) | Numeración |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `PhoneNumberId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0060-tec.PhoneNumbers.sql` | |

### `tec.PhoneLines`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-61 |
| Colección lógica | `phoneLines` |
| Dueño | M10 |
| Propósito (resumen) | Líneas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `PhoneLineId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0061-tec.PhoneLines.sql` | |

### `tec.NumberingPlan`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-62 |
| Colección lógica | `numberingPlan` |
| Dueño | M10 |
| Propósito (resumen) | Plan de numeración (clave de destino de `phoneRates`) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `NumberingPlanId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0062-tec.NumberingPlan.sql` | |

### `tec.TelecomOperators`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-63 |
| Colección lógica | `telecomOperators` |
| Dueño | M10 |
| Propósito (resumen) | Operadoras |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `TelecomOperatorId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0063-tec.TelecomOperators.sql` | |

### `tec.TelecomServiceTypes`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-64 |
| Colección lógica | `telecomServiceTypes` |
| Dueño | M10 |
| Propósito (resumen) | Tipos de servicio TIC |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `TelecomServiceTypeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0064-tec.TelecomServiceTypes.sql` | |

### `tec.TelecomModalities`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-65 |
| Colección lógica | `telecomModalities` |
| Dueño | M10 |
| Propósito (resumen) | Modalidades |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `TelecomModalityId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0065-tec.TelecomModalities.sql` | |

### `tec.CdrImports`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-66 |
| Colección lógica | `cdrImports` |
| Dueño | M10 |
| Propósito (resumen) | Importaciones de CDR |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `CdrImportId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0066-tec.CdrImports.sql` | |

### `tec.CallRecords`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-67 |
| Colección lógica | `callRecords` |
| Dueño | M10 |
| Propósito (resumen) | Llamadas (alto volumen; dueño único de CDR, HUE-TEL-01) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `CallRecordId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0067-tec.CallRecords.sql` | |

### `tec.MobileUsageImports`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-68 |
| Colección lógica | `mobileUsageImports` |
| Dueño | M10 |
| Propósito (resumen) | Consumos de telefonía móvil importados y, con `kind = ticQuota`, consumo del período de correo y pack SMS informado por  |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `MobileUsageImportId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0068-tec.MobileUsageImports.sql` | |

### `tec.ProvidedMailboxes`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-69 |
| Colección lógica | `providedMailboxes` |
| Dueño | M10 |
| Propósito (resumen) | Casillas de correo provistas (secretos en bóveda) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `ProvidedMailboxeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0069-tec.ProvidedMailboxes.sql` | |

### `tec.SlotCounters`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-70 |
| Colección lógica | `slotCounters` |
| Dueño | M10 |
| Propósito (resumen) | Contador atómico de cupos de agenda (declarada en M10 §7.12, fuera de la lista de dueño) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `SlotCounterId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0070-tec.SlotCounters.sql` | |

### `tec.OnCallShifts`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-71 |
| Colección lógica | `onCallShifts` |
| Dueño | M10 |
| Propósito (resumen) | Turnos de guardia por servicio y zona con titular, suplente, jefe y teléfono publicado (HUE-GAS-05, RF-TEC-231; O3 para  |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `OnCallShiftId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0071-tec.OnCallShifts.sql` | |

### `tec.EmergencyProtocols`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-72 |
| Colección lógica | `emergencyProtocols` |
| Dueño | M10 |
| Propósito (resumen) | Protocolos de emergencia por servicio (fuga de gas, riesgo eléctrico, cable caído, pérdida grave; RF-TEC-233) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `EmergencyProtocolId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0072-tec.EmergencyProtocols.sql` | |

### `tec.NumberPortings`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-73 |
| Colección lógica | `numberPortings` |
| Dueño | M10 |
| Propósito (resumen) | Portabilidad numérica entrante y saliente; solo con PRM-TEC-156 (RF-TEC-234, PA-TEC-19) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O10 |
| Estado T05 | C |
| PK sugerida | `NumberPortingId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0073-tec.NumberPortings.sql` | |

### `tec.WaterSamplingPoints`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-74 |
| Colección lógica | `waterSamplingPoints` |
| Dueño | M10 |
| Propósito (resumen) | Puntos de muestreo de calidad del agua con parámetros y límites; solo con PRM-TEC-157 (RF-TEC-235, HUE-AG-01) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `WaterSamplingPointId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0074-tec.WaterSamplingPoints.sql` | |

### `tec.WaterSamples`

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-75 |
| Colección lógica | `waterSamples` |
| Dueño | M10 |
| Propósito (resumen) | Muestras, cadena de custodia, resultados por parámetro y acciones correctivas (RF-TEC-236); corrección = nuevo resultado |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O7 |
| Estado T05 | C |
| PK sugerida | `WaterSampleId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.13](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tec/0075-tec.WaterSamples.sql` | |

### ~~`tec.IntakeChannels`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-TEC-76 |
| Colección lógica | `intakeChannels` |
| Dueño | M10 |
| Propósito (resumen) | (vías de ingreso compartidas con M09: canónica `crmChannels`) |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-CRM-23 |
| SQL | No crear; ver `A→COL-CRM-23` |
| **Capa B:** canónica M09 — [`07` §2.12](07-modelo-relacional-azure-sql.md) `CrmChannels` | |
| **Capa C:** pendiente | |

## Esquema `tes`

### `tes.FinancialInstitutions`

| Campo | Valor |
|---|---|
| ID T05 | COL-TES-01 |
| Colección lógica | `financialInstitutions` |
| Dueño | M14 |
| Propósito (resumen) | Entidades financieras (canónica; absorbe `financialEntities` de M08) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `FinancialInstitutionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.14](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tes/0001-tes.FinancialInstitutions.sql` | |

### `tes.BankBranches`

| Campo | Valor |
|---|---|
| ID T05 | COL-TES-02 |
| Colección lógica | `bankBranches` |
| Dueño | M14 |
| Propósito (resumen) | Sucursales bancarias |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `BankBrancheId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.14](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tes/0002-tes.BankBranches.sql` | |

### `tes.TreasuryAccounts`

| Campo | Valor |
|---|---|
| ID T05 | COL-TES-03 |
| Colección lógica | `treasuryAccounts` |
| Dueño | M14 |
| Propósito (resumen) | Cuentas financieras (bancos, cajas de tesorería y de pagos, tránsito) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `TreasuryAccountId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.14](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tes/0003-tes.TreasuryAccounts.sql` | |

### `tes.TreasuryAccountSigners`

| Campo | Valor |
|---|---|
| ID T05 | COL-TES-04 |
| Colección lógica | `treasuryAccountSigners` |
| Dueño | M14 |
| Propósito (resumen) | Firmantes autorizados de cuentas y órdenes de pago, con vigencia, tope y regla de firmas conjuntas (RF-TES-008; CTR-DAT- |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `TreasuryAccountSignerId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.14](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tes/0004-tes.TreasuryAccountSigners.sql` | |

### `tes.TreasuryCategories`

| Campo | Valor |
|---|---|
| ID T05 | COL-TES-05 |
| Colección lógica | `treasuryCategories` |
| Dueño | M14 |
| Propósito (resumen) | Categorías de movimiento |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `TreasuryCategoryId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.14](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tes/0005-tes.TreasuryCategories.sql` | |

### `tes.TreasuryConcepts`

| Campo | Valor |
|---|---|
| ID T05 | COL-TES-06 |
| Colección lógica | `treasuryConcepts` |
| Dueño | M14 |
| Propósito (resumen) | Conceptos de tesorería |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `TreasuryConceptId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.14](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tes/0006-tes.TreasuryConcepts.sql` | |

### `tes.InstrumentTypes`

| Campo | Valor |
|---|---|
| ID T05 | COL-TES-07 |
| Colección lógica | `instrumentTypes` |
| Dueño | M14 |
| Propósito (resumen) | Tipos de valor (clase de instrumento); `paymentMethods` de M07 lo referencia |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `InstrumentTypeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.14](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tes/0007-tes.InstrumentTypes.sql` | |

### `tes.CheckDrawerAccounts`

| Campo | Valor |
|---|---|
| ID T05 | COL-TES-08 |
| Colección lógica | `checkDrawerAccounts` |
| Dueño | M14 |
| Propósito (resumen) | Cuentas libradoras de cheques de terceros |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `CheckDrawerAccountId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.14](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tes/0008-tes.CheckDrawerAccounts.sql` | |

### `tes.TreasuryOperations`

| Campo | Valor |
|---|---|
| ID T05 | COL-TES-09 |
| Colección lógica | `treasuryOperations` |
| Dueño | M14 |
| Propósito (resumen) | Operaciones de tesorería |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `TreasuryOperationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.14](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tes/0009-tes.TreasuryOperations.sql` | |

### `tes.TreasuryMovements`

| Campo | Valor |
|---|---|
| ID T05 | COL-TES-10 |
| Colección lógica | `treasuryMovements` |
| Dueño | M14 |
| Propósito (resumen) | Libro único de movimientos de fondos (alto volumen) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `TreasuryMovementId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.14](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tes/0010-tes.TreasuryMovements.sql` | |

### `tes.BankDeposits`

| Campo | Valor |
|---|---|
| ID T05 | COL-TES-11 |
| Colección lógica | `bankDeposits` |
| Dueño | M14 |
| Propósito (resumen) | Depósitos bancarios |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `BankDepositId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.14](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tes/0011-tes.BankDeposits.sql` | |

### `tes.StatementImportProfiles`

| Campo | Valor |
|---|---|
| ID T05 | COL-TES-12 |
| Colección lógica | `statementImportProfiles` |
| Dueño | M14 |
| Propósito (resumen) | Perfiles de importación de extractos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `StatementImportProfileId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.14](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tes/0012-tes.StatementImportProfiles.sql` | |

### `tes.BankStatementImports`

| Campo | Valor |
|---|---|
| ID T05 | COL-TES-13 |
| Colección lógica | `bankStatementImports` |
| Dueño | M14 |
| Propósito (resumen) | Importaciones de extractos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `BankStatementImportId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.14](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tes/0013-tes.BankStatementImports.sql` | |

### `tes.BankStatementLines`

| Campo | Valor |
|---|---|
| ID T05 | COL-TES-14 |
| Colección lógica | `bankStatementLines` |
| Dueño | M14 |
| Propósito (resumen) | Líneas de extracto (alto volumen, inmutables) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `BankStatementLineId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.14](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tes/0014-tes.BankStatementLines.sql` | |

### `tes.Reconciliations`

| Campo | Valor |
|---|---|
| ID T05 | COL-TES-15 |
| Colección lógica | `reconciliations` |
| Dueño | M14 |
| Propósito (resumen) | Conciliaciones bancarias |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `ReconciliationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.14](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tes/0015-tes.Reconciliations.sql` | |

### `tes.ReconciliationMatches`

| Campo | Valor |
|---|---|
| ID T05 | COL-TES-16 |
| Colección lógica | `reconciliationMatches` |
| Dueño | M14 |
| Propósito (resumen) | Pareos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `ReconciliationMatcheId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.14](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tes/0016-tes.ReconciliationMatches.sql` | |

### `tes.ReconciliationRules`

| Campo | Valor |
|---|---|
| ID T05 | COL-TES-17 |
| Colección lógica | `reconciliationRules` |
| Dueño | M14 |
| Propósito (resumen) | Reglas de pareo |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `ReconciliationRuleId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.14](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tes/0017-tes.ReconciliationRules.sql` | |

### `tes.InterbankingConnections`

| Campo | Valor |
|---|---|
| ID T05 | COL-TES-18 |
| Colección lógica | `interbankingConnections` |
| Dueño | M14 |
| Propósito (resumen) | Conexión Interbanking (secreto en bóveda) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `InterbankingConnectionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.14](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tes/0018-tes.InterbankingConnections.sql` | |

### `tes.InterbankingSyncRuns`

| Campo | Valor |
|---|---|
| ID T05 | COL-TES-19 |
| Colección lógica | `interbankingSyncRuns` |
| Dueño | M14 |
| Propósito (resumen) | Sincronizaciones |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `InterbankingSyncRunId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.14](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tes/0019-tes.InterbankingSyncRuns.sql` | |

### `tes.InterbankingBalanceSnapshots`

| Campo | Valor |
|---|---|
| ID T05 | COL-TES-20 |
| Colección lógica | `interbankingBalanceSnapshots` |
| Dueño | M14 |
| Propósito (resumen) | Saldos informados |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `InterbankingBalanceSnapshotId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.14](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tes/0020-tes.InterbankingBalanceSnapshots.sql` | |

### `tes.PaymentFiles`

| Campo | Valor |
|---|---|
| ID T05 | COL-TES-21 |
| Colección lógica | `paymentFiles` |
| Dueño | M14 |
| Propósito (resumen) | Archivos de pago masivo |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `PaymentFileId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.14](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tes/0021-tes.PaymentFiles.sql` | |

### `tes.ThirdPartyChecks`

| Campo | Valor |
|---|---|
| ID T05 | COL-TES-22 |
| Colección lógica | `thirdPartyChecks` |
| Dueño | M14 |
| Propósito (resumen) | Cheques y eCheq de terceros |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `ThirdPartyCheckId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.14](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tes/0022-tes.ThirdPartyChecks.sql` | |

### `tes.CheckEvents`

| Campo | Valor |
|---|---|
| ID T05 | COL-TES-23 |
| Colección lógica | `checkEvents` |
| Dueño | M14 |
| Propósito (resumen) | Historia de cheques |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `CheckEventId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.14](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tes/0023-tes.CheckEvents.sql` | |

### `tes.Checkbooks`

| Campo | Valor |
|---|---|
| ID T05 | COL-TES-24 |
| Colección lógica | `checkbooks` |
| Dueño | M14 |
| Propósito (resumen) | Chequeras |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `CheckbookId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.14](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tes/0024-tes.Checkbooks.sql` | |

### `tes.OwnChecks`

| Campo | Valor |
|---|---|
| ID T05 | COL-TES-25 |
| Colección lógica | `ownChecks` |
| Dueño | M14 |
| Propósito (resumen) | Cheques propios |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `OwnCheckId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.14](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tes/0025-tes.OwnChecks.sql` | |

### ~~`tes.CardPlans`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-TES-26 |
| Colección lógica | `cardPlans` |
| Dueño | M14 |
| Propósito (resumen) | (duplicada con M07) |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-COB-15 |
| SQL | No crear; ver `A→COL-COB-15` |
| **Capa B:** canónica M07 — [`07` §2.10](07-modelo-relacional-azure-sql.md) `CardPlans` | |
| **Capa C:** pendiente | |

### `tes.CardVouchers`

| Campo | Valor |
|---|---|
| ID T05 | COL-TES-27 |
| Colección lógica | `cardVouchers` |
| Dueño | M14 |
| Propósito (resumen) | Cupones de tarjeta (sin PAN, vencimiento ni código) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `CardVoucherId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.14](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tes/0026-tes.CardVouchers.sql` | |

### `tes.CardPresentations`

| Campo | Valor |
|---|---|
| ID T05 | COL-TES-28 |
| Colección lógica | `cardPresentations` |
| Dueño | M14 |
| Propósito (resumen) | Presentaciones a procesadoras |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `CardPresentationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.14](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tes/0027-tes.CardPresentations.sql` | |

### `tes.CardSettlements`

| Campo | Valor |
|---|---|
| ID T05 | COL-TES-29 |
| Colección lógica | `cardSettlements` |
| Dueño | M14 |
| Propósito (resumen) | Liquidaciones de tarjetas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `CardSettlementId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.14](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tes/0028-tes.CardSettlements.sql` | |

### `tes.ReceivedWithholdings`

| Campo | Valor |
|---|---|
| ID T05 | COL-TES-30 |
| Colección lógica | `receivedWithholdings` |
| Dueño | M14 |
| Propósito (resumen) | Retenciones sufridas en cartera |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `ReceivedWithholdingId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.14](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tes/0029-tes.ReceivedWithholdings.sql` | |

### `tes.WithholdingPresentations`

| Campo | Valor |
|---|---|
| ID T05 | COL-TES-31 |
| Colección lógica | `withholdingPresentations` |
| Dueño | M14 |
| Propósito (resumen) | Presentación de retenciones sufridas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `WithholdingPresentationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.14](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tes/0030-tes.WithholdingPresentations.sql` | |

### `tes.PaymentCashSessions`

| Campo | Valor |
|---|---|
| ID T05 | COL-TES-32 |
| Colección lógica | `paymentCashSessions` |
| Dueño | M14 |
| Propósito (resumen) | Turnos de la caja de pagos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `PaymentCashSessionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.14](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tes/0031-tes.PaymentCashSessions.sql` | |

### `tes.CashRemittances`

| Campo | Valor |
|---|---|
| ID T05 | COL-TES-33 |
| Colección lógica | `cashRemittances` |
| Dueño | M14 |
| Propósito (resumen) | Recepción en tesorería de la entrega de caja de M07 (`treasuryHandovers`) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `CashRemittanceId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.14](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tes/0032-tes.CashRemittances.sql` | |

### `tes.TreasuryCashClosings`

| Campo | Valor |
|---|---|
| ID T05 | COL-TES-34 |
| Colección lógica | `treasuryCashClosings` |
| Dueño | M14 |
| Propósito (resumen) | Arqueos de caja de tesorería |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `TreasuryCashClosingId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.14](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tes/0033-tes.TreasuryCashClosings.sql` | |

### `tes.PaymentExecutions`

| Campo | Valor |
|---|---|
| ID T05 | COL-TES-35 |
| Colección lógica | `paymentExecutions` |
| Dueño | M14 |
| Propósito (resumen) | Ejecución de pagos (firma, entrega, medios). Con `kind = agencyObligation`, subdocumento obligatorio `taxObligation {tax |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `PaymentExecutionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.14](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tes/0034-tes.PaymentExecutions.sql` | |

### `tes.TenantCurrencySettings`

| Campo | Valor |
|---|---|
| ID T05 | COL-TES-36 |
| Colección lógica | `tenantCurrencySettings` |
| Dueño | M14 |
| Propósito (resumen) | Monedas habilitadas del tenant (sobre `currencies` de T04) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `TenantCurrencySettingId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.14](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tes/0035-tes.TenantCurrencySettings.sql` | |

### `tes.ExchangeRates`

| Campo | Valor |
|---|---|
| ID T05 | COL-TES-37 |
| Colección lógica | `exchangeRates` |
| Dueño | M14 |
| Propósito (resumen) | Cotizaciones (canónica para toda conversión) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `ExchangeRateId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.14](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tes/0036-tes.ExchangeRates.sql` | |

### `tes.PlannedCashItems`

| Campo | Valor |
|---|---|
| ID T05 | COL-TES-38 |
| Colección lógica | `plannedCashItems` |
| Dueño | M14 |
| Propósito (resumen) | Partidas planificadas del flujo de fondos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `PlannedCashItemId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.14](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tes/0037-tes.PlannedCashItems.sql` | |

### `tes.FundCommitments`

| Campo | Valor |
|---|---|
| ID T05 | COL-TES-39 |
| Colección lógica | `fundCommitments` |
| Dueño | M14 |
| Propósito (resumen) | Compromisos de fondos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `FundCommitmentId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.14](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tes/0038-tes.FundCommitments.sql` | |

### `tes.CashFlowScenarios`

| Campo | Valor |
|---|---|
| ID T05 | COL-TES-40 |
| Colección lógica | `cashFlowScenarios` |
| Dueño | M14 |
| Propósito (resumen) | Escenarios de flujo de fondos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `CashFlowScenarioId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.14](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tes/0039-tes.CashFlowScenarios.sql` | |

### `tes.CashFlowSnapshots`

| Campo | Valor |
|---|---|
| ID T05 | COL-TES-41 |
| Colección lógica | `cashFlowSnapshots` |
| Dueño | M14 |
| Propósito (resumen) | Instantáneas del flujo |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `CashFlowSnapshotId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.14](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tes/0040-tes.CashFlowSnapshots.sql` | |

### `tes.PayrollPaymentBatches`

| Campo | Valor |
|---|---|
| ID T05 | COL-TES-42 |
| Colección lógica | `payrollPaymentBatches` |
| Dueño | M14 |
| Propósito (resumen) | Lotes de pago de haberes (confidenciales) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O9 |
| Estado T05 | C |
| PK sugerida | `PayrollPaymentBatcheId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.14](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tes/0041-tes.PayrollPaymentBatches.sql` | |

### `tes.TreasurySettings`

| Campo | Valor |
|---|---|
| ID T05 | COL-TES-43 |
| Colección lógica | `treasurySettings` |
| Dueño | M14 |
| Propósito (resumen) | Parámetros de tesorería (documento único por tenant) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O5 |
| Estado T05 | C |
| PK sugerida | `TreasurySettingId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.14](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/tes/0042-tes.TreasurySettings.sql` | |

## Esquema `uxd`

### `uxd.TenantBrandings`

| Campo | Valor |
|---|---|
| ID T05 | COL-UXD-01 |
| Colección lógica | `tenantBrandings` |
| Dueño | T03 |
| Propósito (resumen) | Marca publicada por canal (referida por `tenants.brandingRef`) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `TenantBrandingId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.5](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/uxd/0001-uxd.TenantBrandings.sql` | |

### `uxd.BrandAssets`

| Campo | Valor |
|---|---|
| ID T05 | COL-UXD-02 |
| Colección lógica | `brandAssets` |
| Dueño | T03 |
| Propósito (resumen) | Recursos de marca (logos, íconos) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `BrandAssetId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.5](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/uxd/0002-uxd.BrandAssets.sql` | |

### `uxd.DictionaryKeys`

| Campo | Valor |
|---|---|
| ID T05 | COL-UXD-03 |
| Colección lógica | `dictionaryKeys` |
| Dueño | T03 |
| Propósito (resumen) | Claves de diccionario y texto base |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `DictionaryKeyId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.5](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/uxd/0003-uxd.DictionaryKeys.sql` | |

### `uxd.TenantDictionaryEntries`

| Campo | Valor |
|---|---|
| ID T05 | COL-UXD-04 |
| Colección lógica | `tenantDictionaryEntries` |
| Dueño | T03 |
| Propósito (resumen) | Textos propios del tenant |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `TenantDictionaryEntryId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.5](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/uxd/0004-uxd.TenantDictionaryEntries.sql` | |

### `uxd.DictionaryReleases`

| Campo | Valor |
|---|---|
| ID T05 | COL-UXD-05 |
| Colección lógica | `dictionaryReleases` |
| Dueño | T03 |
| Propósito (resumen) | Versiones publicadas del diccionario |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `DictionaryReleasId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.5](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/uxd/0005-uxd.DictionaryReleases.sql` | |

### `uxd.DictionaryMissingKeys`

| Campo | Valor |
|---|---|
| ID T05 | COL-UXD-06 |
| Colección lógica | `dictionaryMissingKeys` |
| Dueño | T03 |
| Propósito (resumen) | Claves faltantes detectadas |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `DictionaryMissingKeyId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.5](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/uxd/0006-uxd.DictionaryMissingKeys.sql` | |

### `uxd.ScreenHelpArticles`

| Campo | Valor |
|---|---|
| ID T05 | COL-UXD-07 |
| Colección lógica | `screenHelpArticles` |
| Dueño | T03 |
| Propósito (resumen) | Ayuda contextual por pantalla |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `ScreenHelpArticleId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.5](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/uxd/0007-uxd.ScreenHelpArticles.sql` | |

### ~~`uxd.UiFeatureFlags`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-UXD-08 |
| Colección lógica | `uiFeatureFlags` |
| Dueño | T03 |
| Propósito (resumen) | (duplicada con `featureFlags`; dueño de la colección canónica: T01. Lo que T03 describe para `uiFeatureFlags` se aplica  |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | A→COL-PLA-23 |
| SQL | No crear; ver `A→COL-PLA-23` |
| **Capa B:** [`07` §2.5](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** pendiente | |

### `uxd.UserUiPreferences`

| Campo | Valor |
|---|---|
| ID T05 | COL-UXD-09 |
| Colección lógica | `userUiPreferences` |
| Dueño | T03 |
| Propósito (resumen) | Preferencias de UI por usuario |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `UserUiPreferenceId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.5](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/uxd/0008-uxd.UserUiPreferences.sql` | |

### `uxd.DataTableViews`

| Campo | Valor |
|---|---|
| ID T05 | COL-UXD-10 |
| Colección lógica | `dataTableViews` |
| Dueño | T03 |
| Propósito (resumen) | Vistas de grilla por usuario o compartidas (absorbe `savedViews` de T04) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `DataTableViewId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.5](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/uxd/0009-uxd.DataTableViews.sql` | |

### `uxd.PwaNavConfigs`

| Campo | Valor |
|---|---|
| ID T05 | COL-UXD-11 |
| Colección lógica | `pwaNavConfigs` |
| Dueño | T03 |
| Propósito (resumen) | Navegación de la PWA por perfil |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `PwaNavConfigId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.5](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/uxd/0010-uxd.PwaNavConfigs.sql` | |

## Esquema `ven`

### `ven.OperationCharges`

| Campo | Valor |
|---|---|
| ID T05 | COL-VEN-01 |
| Colección lógica | `operationCharges` |
| Dueño | M11 |
| Propósito (resumen) | Cargos por operación con titulares (a facturar por M05) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `OperationChargeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.15](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ven/0001-ven.OperationCharges.sql` | |

### `ven.SalesConditions`

| Campo | Valor |
|---|---|
| ID T05 | COL-VEN-02 |
| Colección lógica | `salesConditions` |
| Dueño | M11 |
| Propósito (resumen) | Condiciones de venta |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `SalesConditionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.15](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ven/0002-ven.SalesConditions.sql` | |

### `ven.SalesQuotes`

| Campo | Valor |
|---|---|
| ID T05 | COL-VEN-03 |
| Colección lógica | `salesQuotes` |
| Dueño | M11 |
| Propósito (resumen) | Presupuestos con versiones, ítems y notas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `SalesQuoteId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.15](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ven/0003-ven.SalesQuotes.sql` | |

### `ven.SalesQuoteAcceptances`

| Campo | Valor |
|---|---|
| ID T05 | COL-VEN-04 |
| Colección lógica | `salesQuoteAcceptances` |
| Dueño | M11 |
| Propósito (resumen) | Evidencia de aceptación o rechazo online |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `SalesQuoteAcceptanceId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.15](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ven/0004-ven.SalesQuoteAcceptances.sql` | |

### `ven.SalesOrders`

| Campo | Valor |
|---|---|
| ID T05 | COL-VEN-05 |
| Colección lógica | `salesOrders` |
| Dueño | M11 |
| Propósito (resumen) | Ventas de productos y servicios adicionales (no fiscales) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `SalesOrderId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.15](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ven/0005-ven.SalesOrders.sql` | |

### `ven.SalesDeliveries`

| Campo | Valor |
|---|---|
| ID T05 | COL-VEN-06 |
| Colección lógica | `salesDeliveries` |
| Dueño | M11 |
| Propósito (resumen) | Entregas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `SalesDeliveryId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.15](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ven/0006-ven.SalesDeliveries.sql` | |

### `ven.SalesReturns`

| Campo | Valor |
|---|---|
| ID T05 | COL-VEN-07 |
| Colección lógica | `salesReturns` |
| Dueño | M11 |
| Propósito (resumen) | Devoluciones de venta |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `SalesReturnId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.15](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ven/0007-ven.SalesReturns.sql` | |

### `ven.SalesFinancingPlans`

| Campo | Valor |
|---|---|
| ID T05 | COL-VEN-08 |
| Colección lógica | `salesFinancingPlans` |
| Dueño | M11 |
| Propósito (resumen) | Planes de financiación comercial |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `SalesFinancingPlanId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.15](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ven/0008-ven.SalesFinancingPlans.sql` | |

### `ven.SalesInstallments`

| Campo | Valor |
|---|---|
| ID T05 | COL-VEN-09 |
| Colección lógica | `salesInstallments` |
| Dueño | M11 |
| Propósito (resumen) | Cuotas de venta (a facturar por M05) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O4 |
| Estado T05 | C |
| PK sugerida | `SalesInstallmentId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.15](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ven/0009-ven.SalesInstallments.sql` | |

### `ven.SalesReps`

| Campo | Valor |
|---|---|
| ID T05 | COL-VEN-10 |
| Colección lógica | `salesReps` |
| Dueño | M11 |
| Propósito (resumen) | Vendedores: rol de una persona de M01; nombre, domicilio y contactos se leen de la persona (10-11-2026, DEC-097, M11 §7. |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `SalesRepId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.15](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ven/0010-ven.SalesReps.sql` | |

### `ven.SalesPriceLists`

| Campo | Valor |
|---|---|
| ID T05 | COL-VEN-11 |
| Colección lógica | `salesPriceLists` |
| Dueño | M11 |
| Propósito (resumen) | Listas de precios de productos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `SalesPriceListId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.15](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ven/0011-ven.SalesPriceLists.sql` | |

### `ven.SalesDiscountRules`

| Campo | Valor |
|---|---|
| ID T05 | COL-VEN-12 |
| Colección lógica | `salesDiscountRules` |
| Dueño | M11 |
| Propósito (resumen) | Recargos y descuentos comerciales |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `SalesDiscountRuleId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.15](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ven/0012-ven.SalesDiscountRules.sql` | |

### `ven.PosTerminals`

| Campo | Valor |
|---|---|
| ID T05 | COL-VEN-13 |
| Colección lógica | `posTerminals` |
| Dueño | M11 |
| Propósito (resumen) | Terminales de punto de venta |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `PosTerminalId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.15](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ven/0013-ven.PosTerminals.sql` | |

### `ven.PosSessions`

| Campo | Valor |
|---|---|
| ID T05 | COL-VEN-14 |
| Colección lógica | `posSessions` |
| Dueño | M11 |
| Propósito (resumen) | Sesiones de punto de venta |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O8 |
| Estado T05 | C |
| PK sugerida | `PosSessionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.15](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/ven/0014-ven.PosSessions.sql` | |

### ~~`ven.FreightSettlements`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-VEN-15 |
| Colección lógica | `freightSettlements` |
| Dueño | M11 |
| Propósito (resumen) | (rendición de viaje de una venta: canónica `tripSettlements` de M18, con `source.kind = salesDocument`) |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-SOC-50 |
| SQL | No crear; ver `A→COL-SOC-50` |
| **Capa B:** canónica M18 — [`soc.TripSettlements`](07-catalogo-tablas-sql.md) (§2.21) | |
| **Capa C:** pendiente | |

## Esquema `wfl`

### `wfl.EventTypes`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-01 |
| Colección lógica | `eventTypes` |
| Dueño | T11 |
| Propósito (resumen) | Catálogo de eventos de dominio (contrato sobre el outbox de T01) |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `EventTypeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0001-wfl.EventTypes.sql` | |

### `wfl.EventSubscriptions`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-02 |
| Colección lógica | `eventSubscriptions` |
| Dueño | T11 |
| Propósito (resumen) | Suscripciones de consumidores |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `EventSubscriptionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0002-wfl.EventSubscriptions.sql` | |

### `wfl.OperationalInboxItems`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-03 |
| Colección lógica | `operationalInboxItems` |
| Dueño | T11 |
| Propósito (resumen) | Bandeja operativa unificada |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `OperationalInboxItemId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0003-wfl.OperationalInboxItems.sql` | |

### `wfl.JobDefinitions`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-04 |
| Colección lógica | `jobDefinitions` |
| Dueño | T11 |
| Propósito (resumen) | Catálogo de jobs |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `JobDefinitionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0004-wfl.JobDefinitions.sql` | |

### `wfl.JobSchedules`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-05 |
| Colección lógica | `jobSchedules` |
| Dueño | T11 |
| Propósito (resumen) | Programación por tenant |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `JobScheduleId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0005-wfl.JobSchedules.sql` | |

### `wfl.BulkRuns`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-06 |
| Colección lógica | `bulkRuns` |
| Dueño | T11 |
| Propósito (resumen) | Corridas masivas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `BulkRunId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0006-wfl.BulkRuns.sql` | |

### `wfl.BulkRunItems`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-07 |
| Colección lógica | `bulkRunItems` |
| Dueño | T11 |
| Propósito (resumen) | Ítems de corrida masiva |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `BulkRunItemId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0007-wfl.BulkRunItems.sql` | |

### `wfl.OperationTypes`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-08 |
| Colección lógica | `operationTypes` |
| Dueño | T11 |
| Propósito (resumen) | Tipos de operación de negocio (canónica para el nombre) |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `OperationTypeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0008-wfl.OperationTypes.sql` | |

### `wfl.Operations`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-09 |
| Colección lógica | `operations` |
| Dueño | T11 |
| Propósito (resumen) | Operaciones de negocio con pasos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `OperationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0009-wfl.Operations.sql` | |

### `wfl.OperationSteps`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-10 |
| Colección lógica | `operationSteps` |
| Dueño | T11 |
| Propósito (resumen) | Pasos de operación |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `OperationStepId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0010-wfl.OperationSteps.sql` | |

### `wfl.StateMachineRegistry`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-11 |
| Colección lógica | `stateMachineRegistry` |
| Dueño | T11 |
| Propósito (resumen) | Máquinas de estado registradas |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `StateMachineRegistryId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0011-wfl.StateMachineRegistry.sql` | |

### `wfl.WorkflowDefinitions`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-12 |
| Colección lógica | `workflowDefinitions` |
| Dueño | T11 |
| Propósito (resumen) | Workflows configurables |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `WorkflowDefinitionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0012-wfl.WorkflowDefinitions.sql` | |

### `wfl.WorkflowVersions`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-13 |
| Colección lógica | `workflowVersions` |
| Dueño | T11 |
| Propósito (resumen) | Versiones de workflow |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `WorkflowVersionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0013-wfl.WorkflowVersions.sql` | |

### `wfl.WorkflowInstances`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-14 |
| Colección lógica | `workflowInstances` |
| Dueño | T11 |
| Propósito (resumen) | Instancias en curso |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `WorkflowInstanceId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0014-wfl.WorkflowInstances.sql` | |

### `wfl.WorkflowInstanceEvents`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-15 |
| Colección lógica | `workflowInstanceEvents` |
| Dueño | T11 |
| Propósito (resumen) | Bitácora de la instancia |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `WorkflowInstanceEventId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0015-wfl.WorkflowInstanceEvents.sql` | |

### `wfl.SlaPolicies`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-16 |
| Colección lógica | `slaPolicies` |
| Dueño | T11 |
| Propósito (resumen) | Políticas de SLA genéricas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `SlaPolicyId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0016-wfl.SlaPolicies.sql` | |

### `wfl.SlaTimers`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-17 |
| Colección lógica | `slaTimers` |
| Dueño | T11 |
| Propósito (resumen) | Temporizadores de SLA (también los de M09) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `SlaTimerId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0017-wfl.SlaTimers.sql` | |

### `wfl.FormDefinitions`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-18 |
| Colección lógica | `formDefinitions` |
| Dueño | T11 |
| Propósito (resumen) | Formularios dinámicos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `FormDefinitionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0018-wfl.FormDefinitions.sql` | |

### `wfl.FormVersions`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-19 |
| Colección lógica | `formVersions` |
| Dueño | T11 |
| Propósito (resumen) | Versiones de formulario (las usan M10 y M19) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `FormVersionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0019-wfl.FormVersions.sql` | |

### `wfl.FormSubmissions`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-20 |
| Colección lógica | `formSubmissions` |
| Dueño | T11 |
| Propósito (resumen) | Envíos de formulario |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `FormSubmissionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0020-wfl.FormSubmissions.sql` | |

### `wfl.ActionCatalog`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-21 |
| Colección lógica | `actionCatalog` |
| Dueño | T11 |
| Propósito (resumen) | Acciones invocables desde workflows |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `ActionCatalogId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0021-wfl.ActionCatalog.sql` | |

### `wfl.DataSourceCatalog`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-22 |
| Colección lógica | `dataSourceCatalog` |
| Dueño | T11 |
| Propósito (resumen) | Fuentes de datos para formularios |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `DataSourceCatalogId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0022-wfl.DataSourceCatalog.sql` | |

### `wfl.ApprovalPolicies`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-23 |
| Colección lógica | `approvalPolicies` |
| Dueño | T11 |
| Propósito (resumen) | Políticas de aprobación (monto, niveles, SoD) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `ApprovalPolicyId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0023-wfl.ApprovalPolicies.sql` | |

### `wfl.ApprovalRequests`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-24 |
| Colección lógica | `approvalRequests` |
| Dueño | T11 |
| Propósito (resumen) | Pedidos de aprobación |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `ApprovalRequestId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0024-wfl.ApprovalRequests.sql` | |

### `wfl.ApprovalSteps`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-25 |
| Colección lógica | `approvalSteps` |
| Dueño | T11 |
| Propósito (resumen) | Pasos de aprobación |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `ApprovalStepId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0025-wfl.ApprovalSteps.sql` | |

### `wfl.ApprovalDecisions`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-26 |
| Colección lógica | `approvalDecisions` |
| Dueño | T11 |
| Propósito (resumen) | Decisiones |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `ApprovalDecisionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0026-wfl.ApprovalDecisions.sql` | |

### `wfl.Delegations`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-27 |
| Colección lógica | `delegations` |
| Dueño | T11 |
| Propósito (resumen) | Delegaciones de aprobación |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `DelegationId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0027-wfl.Delegations.sql` | |

### `wfl.Tasks`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-28 |
| Colección lógica | `tasks` |
| Dueño | T11 |
| Propósito (resumen) | Tareas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `TaskId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0028-wfl.Tasks.sql` | |

### `wfl.TaskComments`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-29 |
| Colección lógica | `taskComments` |
| Dueño | T11 |
| Propósito (resumen) | Comentarios de tareas |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `TaskCommentId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0029-wfl.TaskComments.sql` | |

### `wfl.WorkItems`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-30 |
| Colección lógica | `workItems` |
| Dueño | T11 |
| Propósito (resumen) | Ítems de trabajo de bandeja |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `WorkItemId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0030-wfl.WorkItems.sql` | |

### `wfl.AgendaEntries`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-31 |
| Colección lógica | `agendaEntries` |
| Dueño | T11 |
| Propósito (resumen) | Agenda unificada |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `AgendaEntryId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0031-wfl.AgendaEntries.sql` | |

### `wfl.AgendaFeeds`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-32 |
| Colección lógica | `agendaFeeds` |
| Dueño | T11 |
| Propósito (resumen) | Feeds de calendario externos |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O2 |
| Estado T05 | C |
| PK sugerida | `AgendaFeedId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0032-wfl.AgendaFeeds.sql` | |

### `wfl.DocumentTypes`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-33 |
| Colección lógica | `documentTypes` |
| Dueño | T11 |
| Propósito (resumen) | Clases documentales del expediente (no tipos de identidad ni comprobantes) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `DocumentTypeId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0033-wfl.DocumentTypes.sql` | |

### `wfl.Documents`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-34 |
| Colección lógica | `documents` |
| Dueño | T11 |
| Propósito (resumen) | Documentos del expediente |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `DocumentId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0034-wfl.Documents.sql` | |

### `wfl.DocumentVersions`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-35 |
| Colección lógica | `documentVersions` |
| Dueño | T11 |
| Propósito (resumen) | Versiones del documento |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `DocumentVersionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0035-wfl.DocumentVersions.sql` | |

### `wfl.DocumentLinks`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-36 |
| Colección lógica | `documentLinks` |
| Dueño | T11 |
| Propósito (resumen) | Vínculos documento–entidad |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `DocumentLinkId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0036-wfl.DocumentLinks.sql` | |

### `wfl.ShareLinks`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-37 |
| Colección lógica | `shareLinks` |
| Dueño | T11 |
| Propósito (resumen) | Enlaces firmados de acceso |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `ShareLinkId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0037-wfl.ShareLinks.sql` | |

### ~~`wfl.RetentionPolicies`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-38 |
| Colección lógica | `retentionPolicies` |
| Dueño | T11 |
| Propósito (resumen) | (duplicada con T08) |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-NFR-06 |
| SQL | No crear; ver `A→COL-NFR-06` |
| **Capa B:** canónica T08 — [`nfr.RetentionPolicies`](07-catalogo-tablas-sql.md) (§2.26) | |
| **Capa C:** pendiente | |

### ~~`wfl.LegalHolds`~~ — absorbida

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-39 |
| Colección lógica | `legalHolds` |
| Dueño | T11 |
| Propósito (resumen) | (duplicada con T08) |
| `TenantId` | Revisar alcance T05 |
| Ola contenido | — |
| Estado T05 | A→COL-NFR-07 |
| SQL | No crear; ver `A→COL-NFR-07` |
| **Capa B:** canónica T08 — [`nfr.LegalHolds`](07-catalogo-tablas-sql.md) (§2.26) | |
| **Capa C:** pendiente | |

### `wfl.DocumentAccessLogs`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-40 |
| Colección lógica | `documentAccessLogs` |
| Dueño | T11 |
| Propósito (resumen) | Accesos a documentos; TTL |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `DocumentAccessLogId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0038-wfl.DocumentAccessLogs.sql` | |

### `wfl.DocumentTemplates`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-41 |
| Colección lógica | `documentTemplates` |
| Dueño | T11 |
| Propósito (resumen) | Plantillas de documentos (incluye factura: ver CTR-DAT-41) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `DocumentTemplateId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0039-wfl.DocumentTemplates.sql` | |

### `wfl.TemplateVersions`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-42 |
| Colección lógica | `templateVersions` |
| Dueño | T11 |
| Propósito (resumen) | Versiones de plantilla |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `TemplateVersionId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0040-wfl.TemplateVersions.sql` | |

### `wfl.TemplateDataContracts`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-43 |
| Colección lógica | `templateDataContracts` |
| Dueño | T11 |
| Propósito (resumen) | Contratos de datos de plantillas |
| `TenantId` | Plataforma / `PLATFORM` |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `TemplateDataContractId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0041-wfl.TemplateDataContracts.sql` | |

### `wfl.RenderRequests`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-44 |
| Colección lógica | `renderRequests` |
| Dueño | T11 |
| Propósito (resumen) | Pedidos de render HTML→PDF |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `RenderRequestId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0042-wfl.RenderRequests.sql` | |

### `wfl.NumberingSequences`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-45 |
| Colección lógica | `numberingSequences` |
| Dueño | T11 |
| Propósito (resumen) | Numeración no fiscal (canónica; absorbe `sequences` de T04 e `insNumberingSeries` de M17) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `NumberingSequenceId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0043-wfl.NumberingSequences.sql` | |

### `wfl.NumberingAssignments`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-46 |
| Colección lógica | `numberingAssignments` |
| Dueño | T11 |
| Propósito (resumen) | Números asignados |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O0 |
| Estado T05 | C |
| PK sugerida | `NumberingAssignmentId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0044-wfl.NumberingAssignments.sql` | |

### `wfl.SignatureProfiles`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-47 |
| Colección lógica | `signatureProfiles` |
| Dueño | T11 |
| Propósito (resumen) | Perfiles de firma |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `SignatureProfileId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0045-wfl.SignatureProfiles.sql` | |

### `wfl.SignatureRequests`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-48 |
| Colección lógica | `signatureRequests` |
| Dueño | T11 |
| Propósito (resumen) | Pedidos de firma (convenios M08, recibos M16, conformidad M10) |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `SignatureRequestId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0046-wfl.SignatureRequests.sql` | |

### `wfl.SignatureParticipants`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-49 |
| Colección lógica | `signatureParticipants` |
| Dueño | T11 |
| Propósito (resumen) | Firmantes de un pedido de firma (toma los firmantes vigentes de `treasuryAccountSigners` de M14 cuando la firma es conju |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `SignatureParticipantId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0047-wfl.SignatureParticipants.sql` | |

### `wfl.SignatureEvidences`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-50 |
| Colección lógica | `signatureEvidences` |
| Dueño | T11 |
| Propósito (resumen) | Evidencias de firma |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O3 |
| Estado T05 | C |
| PK sugerida | `SignatureEvidenceId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0048-wfl.SignatureEvidences.sql` | |

### `wfl.Dossiers`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-51 |
| Colección lógica | `dossiers` |
| Dueño | T11 |
| Propósito (resumen) | Expedientes digitales |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `DossierId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0049-wfl.Dossiers.sql` | |

### `wfl.DossierEntries`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-52 |
| Colección lógica | `dossierEntries` |
| Dueño | T11 |
| Propósito (resumen) | Entradas del expediente |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `DossierEntryId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0050-wfl.DossierEntries.sql` | |

### `wfl.DossierTimeline`

| Campo | Valor |
|---|---|
| ID T05 | COL-WFL-53 |
| Colección lógica | `dossierTimeline` |
| Dueño | T11 |
| Propósito (resumen) | Proyección de línea de tiempo del expediente |
| `TenantId` | Sí (`TenantId`) |
| Ola contenido | O1 |
| Estado T05 | C |
| PK sugerida | `DossierTimelineId` (convención; confirmar en anexo) |
| **Capa B:** [`07` §2.25](07-modelo-relacional-azure-sql.md) | |
| **Capa C:** `07-ddl/sql/wfl/0051-wfl.DossierTimeline.sql` | |
