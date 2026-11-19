# 07 — Modelo relacional Azure SQL (implementación EF Core)

| Campo | Valor |
|---|---|
| Versión | 2.15 |
| Fecha | 19-11-2026 |
| Estado | Catálogo + **capa C DDL 1.058 tablas**; capa B detallada incremental (DEC-117) |
| Catálogo (capa A) | [`07-catalogo-tablas-sql.md`](07-catalogo-tablas-sql.md) |
| DDL SQL (capa C) | [`07-ddl/`](07-ddl/README.md) |
| Alcance | Esquema físico en **Azure SQL**: tablas, **PK/FK/constraints**, **4FN** donde aplique, historial temporal donde corresponda; **un almacén compartido** con columna **`TenantId`** en datos de cooperativa; **esquema por módulo** en el monolito modular |
| Fuentes | RF/RN y cardinalidad de anexos M01–M19 y T01–T12; modelo conceptual T05; decisiones DEC-110, DEC-111, DEC-117 |
| Uso | Contrato físico para GoodApps (EF Core). La semántica funcional no cambia respecto de los anexos |

> **Lectura.** Este documento complementa **T05** (modelo lógico y reglas de dueño de dato). Guía de adaptación: `06-impacto-adaptacion-stack-goodapps.md`.

### Arquitectura del modelo físico (tres capas, DEC-117)

| Capa | Archivo | Contenido | Estado |
|---|---|---|---|
| **A — Inventario** | [`07-catalogo-tablas-sql.md`](07-catalogo-tablas-sql.md) | **1.058** tablas: esquema, nombre, PK sugerida, `TenantId`, dueño, ola. **Sin tipos ni CREATE** (enlaces a B/C). | **Hecho** |
| **B — Diseño legible** | Este archivo §2.x | Tipos SQL, FK, índices, checks (tablas markdown, volcado desde §7 del anexo) | **~1.058 tablas** |
| **C — DDL ejecutable** | [`07-ddl/README.md`](07-ddl/README.md), `deploy-coopapps-full.sql` | `CREATE TABLE` 1.058 tablas (`generate_pla_sql.py` + `generate_exhaustive_ddl.py`) | **Hecho** |

El catálogo **no debe** repetir columnas ni scripts: es el índice maestro. Las **1.058 tablas** en un solo MD con `CREATE` completo sería inmantenible y duplicaría EF. Se completa **módulo a módulo** (plan `06` §8 fase 4): primero B en este doc, luego C en `.sql` cuando el módulo exporte a GoodApps.

**Orden sugerido de volcado DDL:** `pla` → `iam` → `per` (completar hijos) → `cfg` → `cat` → … según §7.9 de T05.

## 1. Convenciones

| Tema | Norma |
|---|---|
| Multitenancy | `TenantId` en tablas de datos de cooperativa; catálogo en tablas de plataforma (T01) |
| Dinero | `decimal(18,4)` o tipo money acordado en EF; nunca `float` |
| Identificadores | `uniqueidentifier` o `bigint` según entidad; PK explícita siempre |
| Integridad | FK declaradas donde el dueño del dato lo autoriza; checks y unicidades compuestas con `TenantId` |
| Módulo | Prefijo de esquema o tabla por código (`per`, `fac`, …) alineado al monolito modular |
| Auditoría | Campos estándar `CreatedAt`, `CreatedBy`, `UpdatedAt`, `UpdatedBy` donde aplique |

## 2. Índice por módulo

Leyenda DDL en §2.x: **Hecho** = columnas en este archivo · **Catálogo** = solo en `07-catalogo-tablas-sql.md` · **En curso** = volcado parcial.

| Módulo | Esquema | Tablas (catálogo) | DDL §2 | Notas |
|---|---|---:|---|---|
| T01 PLA | `pla` | 32 | Hecho §2.0 | 31 tablas (excl. `SupportAccessGrants` → `iam`) |
| T02 IAM | `iam` | 31 | **Hecho §2.2** | OpenIddict: stores EF aparte del catálogo T05 |
| M01 PER | `per` | 21 | **Hecho §2.1** | Índice unicidad, sensibles, contactos JSON; absorbidas enlazadas. |
| T03 UXD | `uxd` | 10 activas (+1 absorbida) | **Hecho §2.5** | `siteMap` en código; flags → `pla` |
| T04 CFG | `cfg` | 45 activas (+10 absorbidas) | **Hecho §2.3** | Fiscales → `fis.*`; vistas → `uxd.*` |
| M02 CAT | `cat` | 25 activas (+4 absorbidas) | **Hecho §2.4** | Cargos por evento → `tar.*`; GD → `med.*` |
| M03 MED | `med` | 34 activas (+3 absorbidas) | **Hecho §2.6** | Precintos→`tec`; gas→`tar`; logs→`int` |
| M04 TAR | `tar` | 35 activas (+1 absorbida) | **Hecho §2.8** | Cargos precarga→`fac`; eventos desde `cat` |
| M05 FAC | `fac` | 38 activas (+4 absorbidas) | **Hecho §2.7** | PV→`fis`; bloqueos→`per`/`mor` |
| M06 FIS | `fis` | 48 | **Hecho §2.9** | Tablas fiscales CFG→`fis`; PV canónico |
| M07 COB | `cob` | 45 activas (+2 absorbidas) | **Hecho §2.10** | Descuentos→`mor`; layouts→`int` |
| M08 MOR | `mor` | 39 | **Hecho §2.11** | `cashDiscountRules`→`EarlyPaymentDiscountRules`; bloqueos doc. |
| M09 CRM | `crm` | 42 | **Hecho §2.12** | Comandos a dueños; canales T06/T09; IA DEC-072. |
| M10 TEC | `tec` | 75 activas (+1 absorbida) | **Hecho §2.13** | Vías ingreso→`crm`; precintos←`med`. |
| M14 TES | `tes` | 42 activas (+1 absorbida) | **Hecho §2.14** | `cardPlans`→`cob`; entidades M08→`FinancialInstitutions`. |
| M11 VEN | `ven` | 14 activas (+1 absorbida) | **Hecho §2.15** | Rendiciones→`soc.TripSettlements`. |
| M12 CMP | `cmp` | 23 | **Hecho §2.16** | `LegalEntityId` en OP/FAC; conceptos tasa. |
| M13 STK | `stk` | 39 activas (+1 absorbida) | **Hecho §2.17** | Equipos contrato→`cat`; unidad gasto←`cmp`. |
| M15 CON | `con` | 36 activas (+3 absorbidas) | **Hecho §2.18** | Índices inflación→`cfg`; capital→`EntityAccountAssignments`. |
| M16 SUE | `sue` | 59 activas (+2 absorbidas) | **Hecho §2.19** | Empleador→`cfg.LegalEntities`; paralelo→T07 `mig`. |
| M17 INS | `ins` | 35 activas (+1 absorbida) | **Hecho §2.20** | Numeración→T11 `wfl.NumberingSequences`. |
| M18 SOC | `soc` | 53 | **Hecho §2.21** | Rendiciones←M11 `ven`; flota/GPS. |
| M19 POR | `por` | 14 | **Hecho §2.22** | Formularios T11; kiosco T06. |
| T09 COM | `com` | 55 activas (+1 absorbida) | **Hecho §2.23** | Consentimientos→`nfr`. |
| T06 INT | `int` | 18 | **Hecho §2.24** | Layouts canónicos; telemedición→`IntegrationMessages`. |
| T11 WFL | `wfl` | 51 activas (+2 absorbidas) | **Hecho §2.25** | Retención→`nfr`; numeración canónica. |
| T08 NFR | `nfr` | 17 activas (+6 absorbidas) | **Hecho §2.26** | Consentimientos canónicos; alertas→`pla`. |
| T07 MIG | `mig` | 20 | **Hecho §2.27** | Paralelo sueldos→`ParallelComparisons`. |
| T10 BIA | `bia` | 67 activas (+2 absorbidas) | **Hecho §2.28** | API clients→`iam`; star schema O11. |
| … | ver catálogo | **1.058** crear | **~1.058** detalladas | 29 esquemas; capa B cerrada (DEC-117). |

## 2.0 Esquema `pla` — plataforma T01 (completo)

Fuente lógica: T01 §7.11.1–§7.11.28 (colecciones dueño PLA). **Raíz multitenant:** `pla.Tenants` es FK de `TenantId` en el resto del sistema. Tablas **globales** (sin `TenantId`): `Tenants`, `ModuleCatalog`, `PlatformPlans`, `Releases`, `FeatureFlags` (reglas globales), `BackupPolicies`, `SchemaMigrations`. Resto lleva `TenantId` (incl. `PLATFORM` como tenant técnico). Objetos anidados del anexo (contactos, historial de estado, dominios) se modelan como **JSON** (`nvarchar(max)` validado en app) o tablas hijas cuando el volumen de consulta lo exija en EF.

### `pla.Tenants` (global)

| Columna | Tipo SQL | FK / notas |
|---|---|---|
| `TenantId` | `uniqueidentifier` | PK; semilla fija para `PLATFORM` |
| `Code` | `varchar(30)` | único; slug `^[a-z0-9-]{3,30}$` |
| `Kind` | `varchar(16)` | `platform`, `cooperative`, `demo`, `sandbox` |
| `LegalName`, `ShortName` | `nvarchar(256)` | |
| `Cuit` | `char(11)` | único parcial cooperative no purged |
| `LegalForm` | `varchar(32)` | |
| `InaesRegistration` | `nvarchar(64)` | nullable |
| `FiscalAddressJson` | `nvarchar(max)` | street, city, province, postalCode |
| `ContactsJson` | `nvarchar(max)` | roles legal/administrative/technical… |
| `Status` | `varchar(32)` | ciclo AGR-004 §8.1 |
| `StatusHistoryJson` | `nvarchar(max)` | transiciones + checklist snapshot refs |
| `SuspensionJson`, `ClosingJson` | `nvarchar(max)` | nullable |
| `Timezone`, `Locale`, `Currency` | `varchar(64)` / `char(3)` | default Cordoba, es-AR, ARS |
| `DataRegion` | `varchar(32)` | DEC-062 |
| `DomainsJson` | `nvarchar(max)` | host, type, verified, tlsStatus |
| `ReleaseRing` | `varchar(16)` | `internal`, `pilot`, `general` |
| `EnvironmentKind` | `varchar(16)` | |
| `ProductionTenantRefJson` | `nvarchar(max)` | sandbox → prod |
| `SandboxesJson` | `nvarchar(max)` | nullable |
| `SaasContractId` | `uniqueidentifier` | FK → `pla.SaasContracts` nullable |
| `ModulesVersion` | `int` | |
| `OnboardingJson` | `nvarchar(max)` | draft, implementer |
| `BrandingRefId` | `uniqueidentifier` | FK lógica T03 `tenantBrandings` |
| `IsDemo` | `bit` | |
| Auditoría | `datetime2`, `uniqueidentifier`, `rowversion` | sin `TenantId` |

Índices: `UX_pla_Tenants_Code`; `IX_pla_Tenants_Status`; filtro único CUIT+kind+environment.

### `pla.ModuleCatalog` (global)

| Columna | Tipo SQL | Notas |
|---|---|---|
| `ModuleCatalogId` | `uniqueidentifier` | PK |
| `Code` | `varchar(64)` | único (`fac`, `svc.internet`, …) |
| `Kind` | `varchar(32)` | module, serviceVertical, addon, channel, integration, core |
| `LabelKey`, `DescriptionKey` | `varchar(128)` | dict |
| `ModuleGroup` | `varchar(32)` | |
| `DependsOnJson` | `nvarchar(max)` | códigos módulo |
| `CapabilityPrefixesJson` | `nvarchar(max)` | |
| `MinWave` | `varchar(4)` | O0–O11 |
| `Status` | `varchar(16)` | |
| `Sellable` | `bit` | false para `core` |

### `pla.PlatformPlans` (global)

`PlatformPlanId` PK; `Code` único; `LabelKey`; `ModulesJson`; `DefaultQuotasJson`; `TargetSize`; `Status`; vigencias `ValidFrom`/`ValidTo` (`date`).

### `pla.TenantLicenses`

`TenantLicenseId` PK; `TenantId` FK; `ModuleCode` FK → catálogo; `Source`; `SaasContractId`; `ValidFrom`/`ValidTo`; `QuotaOverridesJson`; `Status`; aprobación (`ApprovedByMembershipId`, `ApprovedAt`).

Índice: `(TenantId, ModuleCode, ValidFrom DESC)`.

### `pla.TenantModuleActivations`

`TenantModuleActivationId` PK; `TenantId`; `ModuleCode` (único por tenant); `Mode` (`off`|`test`|`production`|`historyReadOnly`); `NewSalesBlocked`; `Status`; `ChecklistSnapshotId` (ref interna); `ActivatedAt`, `ActivatedByMembershipId`; `HistoryJson`.

### `pla.TenantChecklists`

`TenantChecklistId` PK; `TenantId`; `CapabilityCode` (único); `ItemsJson`; `OverallStatus`; `SnapshotsJson`; `EvaluatedAt`.

### `pla.OnboardingDrafts`

`OnboardingDraftId` PK; `TenantId` (nullable hasta confirmar; borrador bajo `PLATFORM`); `Step`; `DataJson`; `AiProposalJson`; `AcceptedProposalJson`; `Status`; `ExpiresAt`.

### `pla.SaasContracts`

`SaasContractId` PK; `TenantId`; `Number` único global; `PlanCode`; `AddonsJson`; `QuotasJson`; vigencia; `AutoRenew`; `BillingJson`; `ServiceLevelsJson`; `DataRegion`; `ExitTermsJson`; `Status`; `VersionsJson`; `SignedDocumentStoredFileId` → `pla.StoredFiles`.

### `pla.UsageSnapshots`

`UsageSnapshotId` PK; `TenantId`; `Day` (`date`); `Dimension`; `Value` (`decimal(18,4)` o `bigint`); `QuotaSoft`, `QuotaHard`, `Pct`.

Índice único: `(TenantId, Dimension, Day)`.

### `pla.SupportCases` / `pla.SupportCaseMessages`

**Cases:** `SupportCaseId` PK; `TenantId`; `Number` único; `Title`; `ModuleCode`; `Impact`, `Priority`, `Status`; `Channel`; `ReportedByMembershipId`; `AssigneeMembershipId` (PLATFORM); `Queue`; `ContextJson`; evidencias → `StoredFiles`; `IncidentId`; grant refs → `iam.SupportAccessGrants`; `SlaJson`; `SatisfactionJson`; `TagsJson`.

**Messages:** `SupportCaseMessageId` PK; `TenantId`, `SupportCaseId`; `AuthorType`, `AuthorId`; `Body`; `Visibility`; attachments.

### `pla.SupportSessions`

`SupportSessionId` PK; `TenantId`; `SupportAccessGrantId` → `iam`; `AgentMembershipId`; `TokenJti`; `StartedAt`, `EndedAt`; `EndReason`; IP/UA.

### `pla.PlatformIncidents`

`PlatformIncidentId` PK; `TenantId` = PLATFORM; `Number`; `Title`; `Severity`, `Status`; `AffectedTenantIdsJson`; `AffectedModulesJson`; timeline; `PublicMessage`; `PostmortemStoredFileId`.

### `pla.AlertRules` / `pla.Alerts`

**Rules:** `AlertRuleId` PK; `TenantId` (plataforma o tenant); `Code`; `Scope`; `ConditionType`; `ParamsJson`; `Severity`; destinatarios/canales; `CooldownMinutes`; `Enabled`.

**Alerts:** `AlertId` PK; `TenantId`; `RuleCode`; `DedupeKey` (único parcial open/ack); `Severity`, `Status`; `Count`; `FirstAt`, `LastAt`; `ObjectRefJson`; ack/resolve; `SilencedUntil`.

### `pla.BackupPolicies` (global)

`BackupPolicyId` PK; `Code`; `Type`; `FrequencyCron`; `RetentionJson`; `EncryptionKeyRef`; `TargetLocation`; `AppliesToJson`; `Enabled`.

### `pla.BackupRuns`

`BackupRunId` PK; `PolicyCode`; `Type`; `ScopeTenantId` (tenant respaldado o PLATFORM); `StartedAt`, `FinishedAt`; `Status`; `SizeBytes`, `ObjectCount`; `Checksum`; `LocationRef`; `RetentionUntil`.

### `pla.RestoreRequests` / `pla.RestoreTests`

**Requests:** `RestoreRequestId` PK; `TenantId`; `Number`; `Mode`; `TargetPointInTime`; `ScopeJson`; motivo; `ApprovalsJson`; `Status`; `StagingRef`; `DiffSummaryJson`; `ReconciliationJson`; métricas RTO.

**Tests:** `RestoreTestId` PK; `TenantId`; `ScheduledAt`, `ExecutedAt`; `PointInTime`; `Result`; `ChecksJson`; `ReportStoredFileId`.

### `pla.TenantExports`

`TenantExportId` PK; `TenantId`; `Purpose`; `ScopeJson`; `Format`; `Status`; `JobRunId` → `pla.JobRuns`; `FilesJson`; manifest `StoredFileId`; `ExpiresAt`; `DownloadsJson`.

### `pla.Releases` (global)

`ReleaseId` PK; `Version` semver; `GitSha`; `ImageDigestsJson`; `MigrationIdsJson`; `NotesJson`; `DeploymentsJson`; `Status`.

### `pla.FeatureFlags`

`FeatureFlagId` PK; `Key` único; `Description`; `OwnerModule`; `DefaultEnabled`; `RulesJson` (ring/tenant); `ExpiresAt`; `Status`.

### Infraestructura transaccional y jobs

#### `pla.OutboxEvents`

| Columna | Tipo SQL | Notas |
|---|---|---|
| `OutboxEventId` | `uniqueidentifier` | PK (UUID v7 lógico) |
| `TenantId` | `uniqueidentifier` | FK; relay técnico sin filtro en despachador |
| `EventType` | `varchar(128)` | `mod.entity.pastTense` |
| `SchemaVersion` | `int` | |
| `AggregateType`, `AggregateId` | `varchar(64)` / `uniqueidentifier` | |
| `PayloadJson` | `nvarchar(max)` | |
| `OccurredAt` | `datetime2` | |
| `CorrelationId`, `CausationId` | `varchar(64)` | |
| `ActorType`, `ActorId` | `varchar(32)` / `uniqueidentifier` | |
| `Status` | `varchar(16)` | pending, published, failed |
| `Attempts`, `NextAttemptAt`, `PublishedAt` | | |
| `LastError` | `nvarchar(512)` | sin secretos |

Índices: `(Status, NextAttemptAt)` despachador; `(TenantId, AggregateType, AggregateId, OccurredAt)`.

#### `pla.InboxReceipts`

`InboxReceiptId` PK; `TenantId`; `Consumer`; `EventId`; `ProcessedAt`. Único `(TenantId, Consumer, EventId)`.

#### `pla.DeadLetters`

`DeadLetterId` PK; `TenantId`; `Kind` (`event`|`job`); `Ref`; `Consumer`; `Attempts`; `LastError`; `PayloadSummary`; `Status`; resolución; `BusinessImpact` (bool).

#### `pla.JobRuns`

| Columna | Tipo SQL | Notas |
|---|---|---|
| `JobRunId` | `uniqueidentifier` | PK |
| `TenantId` | | PLATFORM para jobs plataforma |
| `JobName`, `JobKey` | `varchar(128)` | único parcial no terminal |
| `ExternalJobId` | `varchar(64)` | id cola Azure (antes BullMQ) |
| `Queue` | `varchar(32)` | interactive, batch, … |
| `Status` | `varchar(16)` | §8.10 T01 |
| `ProgressJson`, `CursorJson` | | |
| `CancelRequested` | `bit` | |
| `RequestedByMembershipId` | `uniqueidentifier` | nullable |
| `StartedAt`, `FinishedAt` | `datetime2` | |
| `SummaryJson`, `ErrorJson` | | |
| `MigrationName` | `varchar(128)` | rellenos post-migración |

#### `pla.IdempotencyKeys`

`IdempotencyKeyId` PK; `TenantId`; `Scope` (método+ruta); `Key`; `RequestHash`; `Status`; `ResponseStatus`; `ResponseBodySummary`; `ExpiresAt` (TTL).

#### `pla.StoredFiles`

`StoredFileId` PK; `TenantId`; `StorageKey`; `BucketAlias`; `ModuleCode`; `OwnerType`, `OwnerId`; `Classification`; `OriginalName`, `MimeType`; `SizeBytes`, `Sha256`; `ScanStatus`; `RetentionUntil`; `LegalHold`; `UploadedByMembershipId`; `DeletedAt`.

#### `pla.AiUsage`

`AiUsageId` PK; `TenantId`; `Feature`; `ModuleCode`; `Provider`, `Model`; tokens; `RequestId`; `UserMembershipId`; `Outcome`.

#### `pla.HealthSnapshots`

`HealthSnapshotId` PK; `TenantId`; `CapturedAt`; `Component` (`api`, `worker:*`, `sql`, `redis`, …); `Status`; `MetricsJson`; TTL por política.

#### `pla.SchemaMigrations` (global)

`SchemaMigrationId` PK; `Name` único; `ModuleCode`; `Phase` (`expand`|`backfill`|`contract`); `CollectionsJson` (nombres lógicos); `Checksum`; `ReleaseId` FK; `AppliedAt`; `DurationMs`; `Status`; `BackfillJobKeysJson`; `Error`.

_No se crea `pla.SupportAccessGrants` (absorbida en `iam.SupportAccessGrants`, CTR-DAT-02)._

**Capa C:** scripts en `07-ddl/sql/pla/` (regenerar con `docs/especificacion/_trabajo/generate_pla_sql.py`). Orden de despliegue: `deploy-all.sql` (sqlcmd `:r`). FK circulares en `099-pla.deferred-foreign-keys.sql`.

## 2.1 Esquema `per` — M01 personas, titulares y cuentas (completo)

Fuente lógica: M01 §7.1–7.16 (colecciones dueño PER). Identificadores: PK `uniqueidentifier`; `TenantId` en todas las tablas de cooperativa. Destinos polimórficos: `SubjectType` + `SubjectId` (equivalente a `subjectRef` / `target` del anexo).

### `per.Persons`

| Columna | Tipo SQL | FK / notas |
|---|---|---|
| `PersonId` | `uniqueidentifier` | PK |
| `TenantId` | `uniqueidentifier` | FK → `pla.Tenants` |
| `PersonType` | `varchar(16)` | `natural` / `legal` |
| `DisplayName` | `nvarchar(256)` | índice búsqueda |
| `Status` | `varchar(32)` | `active`, `deceased`, `merged`, `archived` |
| `IdentificationStatus` | `varchar(32)` | `identified`, `documentPending`, … |
| `LegalName`, `TradeName` | `nvarchar` | jurídicas |
| `LastName`, `FirstNames` | `nvarchar` | naturales |
| `BirthDate`, `DeathDate` | `date` | |
| `MergedIntoPersonId` | `uniqueidentifier` | FK → `per.Persons` |
| Auditoría | `datetime2`, `uniqueidentifier` | Created/Updated |

Índices: `UX_per_Persons_Tenant_DisplayName`; filtros por `TenantId` + `Status`.

### `per.PersonIdentifiers`

| Columna | Tipo SQL | FK / notas |
|---|---|---|
| `PersonIdentifierId` | `uniqueidentifier` | PK |
| `TenantId`, `PersonId` | | FK → `per.Persons` |
| `DocumentTypeId` | `uniqueidentifier` | FK → catálogo T04 |
| `Number` | `varchar(32)` | normalizado |
| `IsPrimary` | `bit` | |
| `VerificationStatus` | `varchar(32)` | |

Contactos de la persona: subdocumento M01 §7.1.2 modelado en **`ContactsJson`** (`nvarchar(max)` en `per.Persons`): tipos email/mobile/whatsapp, `normalized`, verificación OTP, vigencia; índices de búsqueda en app/EF.

### `per.PersonIdentifierIndex`

| Columna | Tipo SQL | FK / notas |
|---|---|---|
| `PersonIdentifierIndexId` | `uniqueidentifier` | PK |
| `TenantId`, `PersonId` | | FK → `per.Persons` |
| `DocumentTypeId` | `uniqueidentifier` | FK T04 `IdentityDocumentTypes` |
| `Number` | `varchar(32)` | normalizado |
| `ExceptionId` | `uniqueidentifier` | nullable → `wfl.ApprovalRequests` (RN-PER-005) |

Índice único: `(TenantId, DocumentTypeId, Number, ExceptionId)`. Mantenimiento transaccional junto con alta/edición de identificadores en `Persons` (M01 §7.1.1).

### `per.PersonSensitiveData`

| Columna | Tipo SQL | FK / notas |
|---|---|---|
| `PersonSensitiveDataId` | `uniqueidentifier` | PK |
| `TenantId`, `PersonId` | | FK → `per.Persons` (1:N por categoría) |
| `Category` | `varchar(32)` | `electrodependency`, `health`, `disability`, `bloodDonor`, `other` |
| `DataJson` | `nvarchar(max)` | esquema por categoría; cifrado app (RN-PER-017) |
| `EvidenceDocumentId` | `uniqueidentifier` | nullable → `wfl.Documents` |
| `ValidFrom`, `ValidTo` | `date` | nullable |
| `ConsentId` | `uniqueidentifier` | FK → `nfr.ConsentRecords` |

Sin exposición en BI (`bia`) ni API B2B; lectura auditada en `iam`. Índice: `(TenantId, PersonId, Category)`.

### `per.Holders`

| Columna | Tipo SQL | FK / notas |
|---|---|---|
| `HolderId` | `uniqueidentifier` | PK |
| `TenantId` | | |
| `PersonId` | | FK → `per.Persons` |
| `HolderNumber` | `varchar(32)` | único por tenant |
| `Status` | `varchar(16)` | `applicant`, `active`, `closed` |
| `OpenedAt`, `ClosedAt` | `date` | |
| `CloseReasonId` | `uniqueidentifier` | T04 enum |
| `PrincipalAccountId` | `uniqueidentifier` | FK → `per.Accounts` (nullable hasta crear cuenta) |

Índice único: `(TenantId, HolderNumber)`.

### `per.Accounts`

| Columna | Tipo SQL | FK / notas |
|---|---|---|
| `AccountId` | `uniqueidentifier` | PK |
| `TenantId`, `HolderId` | | FK → `per.Holders` |
| `AccountNumber` | `varchar(32)` | único por tenant |
| `Status` | `varchar(16)` | |
| `PrimaryMailingAddressId` | `uniqueidentifier` | FK → `per.Addresses` (cuando exista) |
| `IvaConditionId` | `uniqueidentifier` | M06 catálogo |

### `per.Addresses`

| Columna | Tipo SQL | FK / notas |
|---|---|---|
| `AddressId` | `uniqueidentifier` | PK |
| `TenantId` | | |
| `CountryId`, `ProvinceId`, `LocalityId` | `uniqueidentifier` | T04 geografía |
| `StreetId` | `uniqueidentifier` | nullable → `cfg.Streets` |
| `StreetNameRaw`, `Number` | `nvarchar` | |
| `NormalizedText`, `OriginalText` | `nvarchar(max)` | |
| `GeoLat`, `GeoLng` | `decimal(9,6)` | precisión en app |
| `GeoStatus` | `varchar(32)` | RN-PER-067 |
| `NormalizationStatus` | `varchar(32)` | |

Índices: `(TenantId, LocalityId, StreetId, Number)`; espacial en lat/lng si Azure SQL lo habilita.

### `per.AddressGeoEvents`

| Columna | Tipo SQL | FK |
|---|---|---|
| `AddressGeoEventId` | `uniqueidentifier` | PK |
| `TenantId`, `AddressId` | | FK `per.Addresses` |
| `EventType` | `varchar(32)` | |
| `OccurredAt` | `datetime2` | |
| `ActorMembershipId` | `uniqueidentifier` | FK `iam.Memberships` nullable |

### `per.Premises`

| Columna | Tipo SQL | FK / notas |
|---|---|---|
| `PremiseId` | `uniqueidentifier` | PK |
| `TenantId` | | |
| `PremisesCode` | `varchar(32)` | único por tenant |
| `AddressId` | `uniqueidentifier` | FK `per.Addresses` |
| `TaxParcelNumber` | `varchar(64)` | |
| `CadastreKey` | `nvarchar(128)` | `cadastre.normalizedKey` |
| `Status` | `varchar(16)` | |

### `per.ServicePoints`

| Columna | Tipo SQL | FK |
|---|---|---|
| `ServicePointId` | `uniqueidentifier` | PK |
| `TenantId` | | |
| `Code` | `varchar(32)` | único por tenant |
| `AddressId` | | FK `per.Addresses` |
| `PremiseId` | | FK `per.Premises` nullable |
| `Status` | `varchar(16)` | |

### `per.Relationships`

| Columna | Tipo SQL | FK |
|---|---|---|
| `RelationshipId` | `uniqueidentifier` | PK |
| `TenantId` | | |
| `SubjectPersonId` | | FK `per.Persons` |
| `RelationshipTypeId` | `uniqueidentifier` | T04 |
| `TargetType` | `varchar(32)` | person, holder, account, … |
| `TargetId` | `uniqueidentifier` | |
| `ValidFrom`, `ValidTo` | `date` | |
| `Status` | `varchar(16)` | |

Tabla hija `per.RelationshipScopeActions` (`RelationshipId`, `ActionCode`) para `view`, `pay`, etc.

### `per.Transfers`

| Columna | Tipo SQL | FK |
|---|---|---|
| `TransferId` | `uniqueidentifier` | PK |
| `TenantId` | | |
| `Number` | `varchar(32)` | único |
| `Type` | `varchar(32)` | ownershipChange, accountTransfer, … |
| `OriginHolderId`, `DestinationHolderId` | `uniqueidentifier` | FK `per.Holders` |
| `EffectiveDate` | `date` | |
| `Status` | `varchar(16)` | draft → executed |
| `IdempotencyKey` | `varchar(64)` | único parcial |

### `per.DuplicateCases`

| Columna | Tipo SQL | FK |
|---|---|---|
| `DuplicateCaseId` | `uniqueidentifier` | PK |
| `TenantId` | | |
| `PersonIdA`, `PersonIdB` | `uniqueidentifier` | FK `per.Persons`, ordenado |
| `Score` | `smallint` | 0–100 |
| `Status` | `varchar(32)` | open, merged, dismissed, … |
| `SurvivorPersonId` | `uniqueidentifier` | nullable tras merge |

Índice único: `(TenantId, PersonIdA, PersonIdB)`.

### `per.Notes`

| Columna | Tipo SQL | FK / notas |
|---|---|---|
| `NoteId` | `uniqueidentifier` | PK |
| `TenantId` | | |
| `SubjectType` | `varchar(32)` | person, holder, account, serviceContract, premises |
| `SubjectId` | `uniqueidentifier` | |
| `NoteNumber` | `varchar(32)` | único por tenant |
| `NoteDate` | `date` | efectiva |
| `Title`, `Text` | `nvarchar(max)` | |
| `NoteTypeId` | `uniqueidentifier` | T04 `noteTypes` nullable |
| `Visibility` | `varchar(16)` | internal, cashier, portal |
| `IsSystem` | `bit` | RN-PER-094 |
| `SystemEvent` | `varchar(64)` | nullable |
| `Pinned` | `bit` | |
| `DeletedAt` | `datetime2` | borrado lógico nullable |
| `LegacyBlockFlag` | `bit` | solo migración |

Índice: `(TenantId, SubjectType, SubjectId, NoteDate)`.

### `per.NoteRevisions`

| Columna | Tipo SQL | FK |
|---|---|---|
| `NoteRevisionId` | `uniqueidentifier` | PK |
| `TenantId`, `NoteId` | | FK `per.Notes` |
| `Version` | `int` | |
| `Title`, `Text` | `nvarchar(max)` | |
| `EditedByMembershipId` | `uniqueidentifier` | FK `iam.Memberships` |
| `EditedAt` | `datetime2` | |

### `per.Blocks`

| Columna | Tipo SQL | FK / notas |
|---|---|---|
| `BlockId` | `uniqueidentifier` | PK |
| `TenantId` | | |
| `SubjectType` | `varchar(32)` | |
| `SubjectId` | `uniqueidentifier` | |
| `EffectMode` | `varchar(16)` | deny, requireApproval, warn |
| `HoldReasonId` | `uniqueidentifier` | M08 / catálogo causas |
| `Detail`, `CashierMessage`, `PortalMessage` | `nvarchar(max)` | |
| `ValidFrom`, `ValidTo` | `date` | |
| `Status` | `varchar(16)` | active, lifted, expired |
| `AppliedByMembershipId` | `uniqueidentifier` | |
| `AppliedAt` | `datetime2` | |
| `LiftedAt`, `LiftReason` | | nullable |
| `SourceType`, `SourceId` | `varchar(32)` / `uniqueidentifier` | manual, documentAction, … |

### `per.BlockEffects`

| Columna | Tipo SQL | FK |
|---|---|---|
| `BlockId` | `uniqueidentifier` | PK compuesto con EffectCode |
| `TenantId` | | |
| `EffectCode` | `varchar(32)` | cashPayment, billing, transfer, … |

Índice: `(TenantId, SubjectType, SubjectId, Status)` vía join con `per.Blocks`.

### `per.DocumentRequirementTypes`

| Columna | Tipo SQL | FK / notas |
|---|---|---|
| `DocumentRequirementTypeId` | `uniqueidentifier` | PK |
| `TenantId` | | |
| `Code` | `varchar(32)` | único por tenant |
| `Name` | `nvarchar(256)` | clave `dict:` en app |
| `ValidityDays` | `int` | nullable |
| `TemplateId` | `uniqueidentifier` | T11 nullable |
| `IsDefault` | `bit` | |
| `PublishedOnPortal` | `bit` | M19 |
| `Status` | `varchar(16)` | active, inactive |

### `per.DocumentRequirementAppliesTo`

| Columna | Tipo SQL |
|---|---|
| `DocumentRequirementTypeId` | PK compuesto |
| `TenantId` | |
| `EntityType` | `varchar(32)` | person, holder, account, serviceContract |

### `per.DocumentRequirementItems`

| Columna | Tipo SQL | FK |
|---|---|---|
| `DocumentRequirementItemId` | `uniqueidentifier` | PK |
| `TenantId`, `DocumentRequirementTypeId` | | FK tipos |
| `Code`, `Name` | `varchar(32)` / `nvarchar` | |
| `Mandatory` | `bit` | |

### `per.DocumentSubmissions`

| Columna | Tipo SQL | FK / notas |
|---|---|---|
| `DocumentSubmissionId` | `uniqueidentifier` | PK |
| `TenantId` | | |
| `DocumentRequirementTypeId` | | FK `per.DocumentRequirementTypes` |
| `TargetType`, `TargetId` | `varchar(32)` / `uniqueidentifier` | |
| `SubmissionDate` | `date` | |
| `ExpiresAt` | `date` | nullable |
| `Presented` | `bit` | |
| `Status` | `varchar(16)` | pending → validated / expired |
| `Observations` | `nvarchar(max)` | |

Documentos en `per.DocumentSubmissionDocuments` (`DocumentSubmissionId`, `DocumentId` → T11).

### `per.PerRevisions`

| Columna | Tipo SQL | FK / notas |
|---|---|---|
| `PerRevisionId` | `uniqueidentifier` | PK |
| `TenantId` | | |
| `EntityType` | `varchar(32)` | person, holder, account, … |
| `EntityId` | `uniqueidentifier` | |
| `Revision` | `int` | único por entidad |
| `ValidFrom`, `ValidTo` | `date` | vigencia efectiva |
| `RecordedAt` | `datetime2` | bitemporal |
| `RecordedByMembershipId` | `uniqueidentifier` | job/integración nullable |
| `Source` | `varchar(16)` | screen, portal, migration, … |
| `Reason` | `nvarchar(512)` | nullable |
| `ChangedFields` | `nvarchar(max)` | JSON array |
| `SnapshotJson` | `nvarchar(max)` | estado sin datos sensibles |
| `OnBehalfOfPersonId`, `OnBehalfOfRelationshipId` | `uniqueidentifier` | nullable RF-PER-104 |

Índice único: `(TenantId, EntityType, EntityId, Revision)`.

**Absorbidas (sin tabla `per`):** `consents` / `dataSubjectRequests` → **`nfr`** (§2.26); `adherents` → **`soc.ServiceDependents`** / **`ServiceBeneficiaries`** (§2.21, DEC-071); `personUserLinks` → **`iam.Memberships.personId`** (§2.2).

_Opcional futuro:_ detalle JSON de ítems en `per.Transfers` y acciones en `DocumentRequirementTypes` si el export EF exige columnas explícitas.

## 2.2 Esquema `iam` — T02 completo (31 tablas)

Fuente lógica: T02 §7.0–7.20. DDL capa C: `07-ddl/sql/iam/`. **OpenIddict:** tablas de aplicación/autorización/token las crea la migración del paquete (misma base Azure SQL; no están en el catálogo COL-IAM; ver T02 §7.0).

Todas las tablas llevan `CreatedAt`, `CreatedBy`, `UpdatedAt`, `UpdatedBy`, `RowVersion` salvo indicación. Campos anidados del anexo (`staff`, `portal`, `scope`, `changes`) → `nvarchar(max)` JSON validado en dominio hasta normalizar en hijas.

### Identidad global (sin `TenantId` en fila)

**`iam.Identities`** (COL-IAM-01): PK `IdentityId`; `PrimaryEmail` único NFKC; `PhoneE164`; `DisplayName`, `Locale`; `PasswordHash`/`PasswordAlgo` (argon2id); bloqueo (`FailedLoginCount`, `LockedUntil`); `SessionEpoch`; `Mfa` embebido o FK → `AuthFactors`; `PlatformMember`; `LegacyJson`.

**`iam.AuthFactors`** (COL-IAM-02): PK `AuthFactorId`; FK `IdentityId`; `Kind` (`password`, `totp`, `sms`, `passkey`); `SecretRef` o hash; `Status`; solo plataforma en lectura cross-tenant controlada.

**`iam.FederatedLinks`** (COL-IAM-03): PK `FederatedLinkId`; FK `IdentityId`; `Provider` (`google`, `oidcTenant`, `cidi`); `Subject`; `ScopeTenantId`, FK `IdentityProviderConfigId` nullable; único `(Provider, Subject, ScopeTenantId)`.

### Pertenencia, roles y catálogos

**`iam.Memberships`** (COL-IAM-04): PK `MembershipId`; FK `TenantId` → `pla.Tenants`, `IdentityId`; `StaffJson`, `PortalJson` (contextos staff/portal); `SessionEpoch`, `AuthzVersion` (invalidación caché Redis); UX `IX (TenantId, IdentityId)` único.

**`iam.Roles`** (COL-IAM-05): PK `RoleId`; `TenantId`; `Code` único por tenant; `Space`; `CapabilitiesJson` (grant/deny); plantillas plataforma replicables.

**`iam.ScreenProfiles`** (COL-IAM-06): PK `ScreenProfileId`; `Code`, `Status`; `AppsJson`; franjas horarias y pantallas → JSON o hija futura **`iam.ScreenProfileScreens`** (`ScreenProfileId`, `ScreenId` PAN-*).

**`iam.RoleAssignments`** (COL-IAM-07): PK `RoleAssignmentId`; FKs `MembershipId`, `RoleId`; `ScopeMode`; vigencias; alcance dimensional → JSON o hija **`iam.AssignmentScopeDimensions`** (`Dimension`, `EntityId`: sucursal, PV, caja, zona, entidad jurídica DEC-096).

**`iam.ProfileAssignments`** (COL-IAM-08): PK `ProfileAssignmentId`; FK `ScreenProfileId`, `MembershipId`; vigencias; `Status`.

**`iam.CapabilityCatalog`** (COL-IAM-09): global/plataforma; PK `CapabilityCatalogId`; `Code` = `modulo.recurso.accion` único; `ModuleCode`, `SodTagsJson`, flags `Sensitive`, `SupervisorOverridable`, `ApiExposable`; sembrado desde código en deploy.

**`iam.ScreenCatalog`** (COL-IAM-10): global; `ScreenId` (PAN-*), ruta React, `CapabilityCode`, `App`, orden menú; alimenta T03 `siteMapGroups`.

**`iam.SodRules`** / **`iam.SodExceptions`** (COL-IAM-11/12): `TenantId`; reglas estáticas y excepciones aprobadas con vigencia y auditoría.

### Sesión, tokens y transitorios (TTL / purge job)

**`iam.Sessions`** (COL-IAM-13): PK `SessionId`; FKs `IdentityId`, `MembershipId`; `Context`; hash refresh (`RefreshTokenHash`, `RefreshFamilyId`); `OperatingBranchId`, `OperatingPointOfSaleId`, `SupportGrantId`; índice `(TenantId, MembershipId, Status)`.

**`iam.AuthTransactions`** (COL-IAM-14): pre-login y flujos MFA; TTL indexado por `ExpiresAt`.

**`iam.TrustedDevices`** (COL-IAM-15): FK `IdentityId`; fingerprint, `ExpiresAt`.

**`iam.OtpChallenges`** (COL-IAM-16): canal, hash código, intentos, TTL.

**`iam.ActionTokens`** (COL-IAM-17): `TenantId`; `Purpose` (recovery, invite); hash, `ExpiresAt`, consumo único.

**`iam.EditPresence`** (COL-IAM-18): `TenantId`; entidad en edición, `MembershipId`, heartbeat, TTL.

### Autorización operativa e integraciones

**`iam.AuthorizationRequests`** (COL-IAM-19): supervisor en línea; capability solicitada, montos, `Status`, FK aprobador, vínculo `auditLogs`.

**`iam.SupportAccessGrants`** (COL-IAM-20): FK `CaseId` → `pla.SupportCases`; agente, `ScopeJson`, break-glass, aprobaciones (CTR: absorbió `pla.SupportAccessGrants`).

**`iam.IdentityProviderConfigs`** (COL-IAM-21): OIDC/CiDi por tenant; `ClientId`, `SecretRef` (Key Vault); metadatos issuer.

**`iam.ApiClients`** / **`iam.ApiCredentials`** (COL-IAM-22/23): integraciones `client_credentials`; scopes JSON; hash de secreto rotativo; rate limit refs T08.

### Auditoría e gobierno de accesos

**`iam.AuditLogs`** (COL-IAM-24): PK `AuditLogId`; `TenantId`; `EventId`, `Seq` (cadena hash); `ActorJson`, `EntityJson`, `Operation`, `ChangesJson`, `LegalEntityId` nullable; misma transacción SQL que el cambio (RN-IAM-060).

**`iam.AuditAccess`** (COL-IAM-25): login, denied, `runAsPlatform`, cambio de ámbito.

**`iam.AuditReads`** (COL-IAM-26): exportaciones y campos `sensitive`.

**`iam.AuditMessages`** / **`iam.AuditAi`** (COL-IAM-27/28): trazas T09 / asistente IA.

**`iam.LegacyAuditRecords`** (COL-IAM-29): migración ProCoop solo lectura (O11).

**`iam.AccessReviews`** (COL-IAM-30): campañas de recertificación.

**`iam.SecurityAlerts`** (COL-IAM-31): reutilización refresh, SoD, geo anómala; workflow T11 opcional.

FKs habituales: `TenantId` → `pla.Tenants`; `IdentityId` → `iam.Identities`; `MembershipId` → `iam.Memberships`; `LegalEntityId` → `cfg.LegalEntities` cuando aplica.

## 2.3 Esquema `cfg` — T04 completo (45 tablas activas)

Fuente lógica: T04 §7.0–7.18, **DEC-114** (motor + T04b). DDL: `07-ddl/sql/cfg/` (45 scripts). Lecturas adoptables: `TenantId ∈ {PLATFORM, tenant}` en SQL explícito (RN-CFG-049); servicio .NET `config.get` + publicación `configVersions` (T11 workflow).

**Absorbidas (sin tabla `cfg.*` en capa C):** `vatConditions`, `vatRates`, `grossIncomeConditions`, `grossIncomeRates`, `taxRegistries`, `taxRegistryEntries` → esquema **`fis`** (M06, CTR-DAT-13); `savedViews` → **`uxd.DataTableViews`** (T03); `sequences` → **T11** `numberingSequences` / M05.

### Motor de parámetros y versionado

**`cfg.ParameterDefinitions`** (COL-CFG-01): plataforma; PK; `Key` semántica única; `Module`, `Type`, validación JSON, `EnumCode`, `DefaultJson`, equivalencias `LegacyCodVar`; sincronización desde ensamblados en deploy.

**`cfg.ParameterValues`** (COL-CFG-02): `TenantId`; FK definición; `ScopeJson` (`platform|tenant|legalEntity|branch|…`); valor tipado serializado; `ValidFrom`/`ValidTo`, `RecordedAt`, `ConfigVersionId`; bitemporal AGR-010.

**`cfg.ConfigVersions`** (COL-CFG-03): ciclo borrador → publicación; `ItemsJson`, informes validación/simulación; FK `WorkflowInstanceId` (T11); `EffectiveAt`, `ContractPolicy`.

**`cfg.LegacyParameterMappings`** (COL-CFG-39): mapa ProCoop `VARIABLE` → `PRM-*` (T04b, O11).

### Maestros configurables y enumeraciones

**`cfg.MasterTableDefinitions`** (COL-CFG-04): metadatos de tablas maestras editables (editor uniforme).

**`cfg.Enumerations`** / **`cfg.EnumerationItems`** (COL-CFG-05/06): listas cerradas por tenant o plataforma; códigos externos; vigencias.

**`cfg.MasterImportJobs`** (COL-CFG-36): importación Excel vía T03 `ExcelImportWizard`; manifiesto y errores en JSON.

### Geografía argentina (plataforma + tenant)

Jerarquía FK: **`Countries`** → **`Provinces`** → **`Departments`** → **`Localities`** → **`PostalCodes`**.

Calles: **`Streets`** (catálogo nacional plataforma), **`StreetAliases`**, **`StreetProposals`** (tenant → aprobación).

Ámbito local: **`Neighborhoods`**, **`Zones`**, **`CadastralDistricts`**.

**`GeocodeRequests`**: cola/async geocodificación (Google/Georef vía T06); TTL y resultado JSON; subdocumento lógico **`geoReference`** en dominios (M01/M09/M10) como JSON o columnas normalizadas.

### Calendarios, índices y moneda

**`Calendars`**, **`Holidays`**: feriados nacionales/provinciales/tenant; servicio días hábiles (AGR-017).

**`EconomicIndexSeries`**, **`EconomicIndexValues`**: IPC, cotizaciones, mora; adopción por tenant.

**`Currencies`**: monedas de referencia.

### Identidad documental y tablas de plataforma

**`IdentityDocumentTypes`** (COL-CFG-28): tipos DNI/CUIT/etc.; códigos ARCA/INAES; canónica para M01 `documentTypes`.

**`PlatformTableReleases`** / **`PlatformTableAdoptions`**: publicación versionada de maestros de plataforma y modo seguir/fijar/copiar por tenant.

### Extensibilidad de formularios

**`CustomFieldDefinitions`**: definición por entidad; valores en documento dueño.

**`FormCustomizations`**: ocultar/obligatorio/orden por pantalla.

### Semillas demo

**`SeedPacks`** (plataforma), **`SeedApplications`** (tenant): paquetes BASE §39; referencia `ConfigVersionId` al aplicar.

### Entidades jurídicas y estructura operativa (DEC-064, O0)

**`LegalEntities`** (COL-CFG-41): emisor fiscal; `IsDefault`; `EmployerJson` (M16); FK desde documentos económicos (`LegalEntityId`).

**`Branches`** (COL-CFG-42): FK `LegalEntityId`, `LocalityId`.

**`Workstations`** (COL-CFG-43): puestos físicos; FK sucursal.

### Tablas legales de sueldos de plataforma (§7.17, O9)

Adoptables como índices/series: **`PayrollOfficialCodes`**, **`ContributionRates`**, **`ContributionBaseLimits`**, **`MinimumWages`**, **`IncomeTaxDeductionTables`**, **`IncomeTaxScales`**, **`IncomeTaxRules`**, **`CedularTaxScales`**, **`GarnishmentScales`**, **`LaborLawParameters`** (COL-CFG-44–53); fuente oficial, vigencia, adopción vía `PlatformTableAdoptions`.

FKs habituales: `TenantId` → `pla.Tenants`; geografía `LocalityId` → `cfg.Localities`; `LegalEntityId` referenciado en M05/M06/M15/M16 y `iam` auditoría.

## 2.4 Esquema `cat` — M02 catálogo de servicios (25 tablas activas)

Fuente lógica: M02 §7 (COL-CAT-01–29). DDL: `07-ddl/sql/cat/`. Ola contenido principal **O2** (contratos y oferta); artefactos O7 en electrodomésticos. Publicación de configuración de servicio vía **`cfg.ConfigVersions`** (T04); copia entre tenants genera borrador CFG en destino (RF-CAT).

**Absorbidas (sin `cat.*` en capa C):** `eventChargeRules` / `eventChargeWaivers` → **`tar.*`** (M04); `contractMembers` → adherentes/beneficiarios en esquema societario (**`soc.*`**, DEC-071); `generationAgreements` → **`med.DistributedGenerationContracts`** (M03).

### Capacidades y plantillas de plataforma

**`cat.ServiceCapabilities`** (COL-CAT-01): vertical INT/ELE/AG…; catálogo PLATFORM; enlaza `moduleCatalog` (T01).

**`cat.ServiceTemplates`** (COL-CAT-28): plantillas publicables; tenant origen PLATFORM; adopción/clon por cooperativa.

### Servicio habilitado en el tenant

**`cat.TenantServices`** (COL-CAT-02): instancia del servicio; **`LegalEntityId`** obligatoria (entidad que presta/factura, DEC-064); FK `ServiceCapabilityId`; flags licencia/activación.

**`cat.ServiceConfigVersions`** (COL-CAT-03): paquete versionado del servicio (productos, planes, categorías) listo para publicar en CFG.

**`cat.ServiceConcessions`** (COL-CAT-04): concesiones y vigencias comerciales.

### Oferta: productos, planes y estructura

**`cat.ServiceProducts`** (COL-CAT-05), **`BillableConcepts`** (06): facetas comerciales sin precio (precio en M04).

**`cat.ServicePlans`**, **`ServicePlanVersions`** (07/08): planes y versiones (DEC-012).

**`cat.ServiceBundles`**, **`BundleSubscriptions`** (09/29): combos multiservicio y suscripción agregada (RF-CAT-044).

**`cat.ServiceCategories`**, **`ServiceCategoryGroups`**, **`ServiceClasses`**, **`ServiceProperties`**, **`ServiceStatuses`** (10–14): árbol operativo, propiedades dinámicas, estados.

### Contratos de servicio (núcleo DEC-011)

**`cat.ServiceContracts`** (COL-CAT-18): PK; `Number` por tenant; FK `TenantServiceId`, `HolderId` → `per.Holders`, `AccountId` → `per.Accounts`, `ServicePointId` → `per.ServicePoints`; `LegalEntityId` → `cfg.LegalEntities`; `DomainAttributesJson` por vertical; estados vía T11; sin borrado físico.

**`cat.ServiceContractHistory`** (COL-CAT-19): eventos de negocio (append-only).

**`cat.ContractEquipmentAssignments`** (COL-CAT-20): equipos del contrato (canónica; absorbe M13).

**`cat.ApplianceTypes`**, **`ContractDeclaredAppliances`** (21/22): DDJJ electrodomésticos; `power`/`templateRef`.

**`cat.ContractSpecialConditions`** (COL-CAT-25): grandes usuarios MER-003.

### Reglas, copia y lotes

**`cat.AutoServiceRules`** (COL-CAT-17): altas automáticas (DEC-023).

**`cat.ServiceCopyRuns`** (COL-CAT-26): copia entre tenants con mapeo de IDs (T07).

**`cat.BulkContractOperations`** (COL-CAT-27): altas/cambios masivos; manifiesto en JSON/Blob.

FKs habituales: `TenantId` → `pla.Tenants`; personas/cuentas/puntos → `per.*`; entidad emisora → `cfg.LegalEntities`; medición posterior → `med.*`; facturación → `fac.*` / `tar.*`.

## 2.5 Esquema `uxd` — T03 experiencia (10 tablas activas)

Fuente lógica: T03 §7.B (COL-UXD-01–11). DDL: `07-ddl/sql/uxd/`. **Fuera de SQL:** design tokens y `siteMapGroups` en monorepo (`packages/ui`, `packages/shared/siteMap`). **DEC-109:** marca producto CoopApps; assets producto en tenant `PLATFORM`.

**Absorbida:** `uiFeatureFlags` → **`pla.FeatureFlags`** (T01 COL-PLA-23).

### Marca y assets

**`uxd.TenantBrandings`** (COL-UXD-01): versiones `draft`/`published`; colores, política de tema, variantes DEC-064; FK lógica `pla.Tenants.brandingRef`.

**`uxd.BrandAssets`** (COL-UXD-02): metadatos por `kind` (`logo`, `pwaIcon`, `productLogo`, …); FK `StoredFileId` → `pla.StoredFiles` (Blob).

### Diccionario

**`uxd.DictionaryKeys`** (COL-UXD-03): catálogo producto (tenant PLATFORM); texto base por clave.

**`uxd.TenantDictionaryEntries`** (04): overrides por tenant; `draftOf` / publicación.

**`uxd.DictionaryReleases`** (05): versiones publicadas del diccionario del tenant.

**`uxd.DictionaryMissingKeys`** (06): telemetría de claves faltantes (PLATFORM agrega + tenants).

### Ayuda, preferencias y grillas

**`uxd.ScreenHelpArticles`** (07): `screenId` PAN-*; contenido Markdown/JSON; enlace inventario ScreenHelp.

**`uxd.UserUiPreferences`** (09): tema, densidad, `reduceMotion`, columnas por usuario.

**`uxd.DataTableViews`** (10): columnas/filtros/orden compartidos o privados (reemplaza T04 `savedViews`).

**`uxd.PwaNavConfigs`** (11): tabs y accesos PWA por perfil/contexto.

FKs: `TenantId` → `pla.Tenants`; `MembershipId` / `ownerId` → `iam.Memberships` en vistas y preferencias.

## 2.6 Esquema `med` — M03 medición (34 tablas activas)

Fuente lógica: M03 §7 (COL-MED-01–37). DDL: `07-ddl/sql/med/`. Ola **O7**. Alta volumen en lecturas/consumos: índices `(TenantId, …)` y archivado según T08.

**Absorbidas:** `meterSeals` → **`tec.Seals`** (M10 COL-TEC-50); `gasCorrectionFactors` → **`tar.GasCalorificFactors`** (M04 COL-TAR-10); `meteringConnectorLogs` → integración T06 (**COL-INT-07**).

### Maestros de medición

**`med.MeterBrands`**, **`MeterTypes`**, **`ReadingObservationCodes`**, **`ReadingResultCodes`**, **`ReadingConditionCodes`**, **`MeterObservationCodes`** (COL-MED-01–06): catálogos por tenant; códigos estables para lectura móvil e importación.

### Medidores, puntos e instalaciones

**`med.Meters`** (07): FK marca/tipo; número de serie único por tenant.

**`med.MeteringPoints`** (08): punto lógico en `per.ServicePoints` / contrato `cat.ServiceContracts`.

**`med.MeteringChannels`** (09): canales activa/reactiva/demandada según vertical.

**`med.MeterInstallations`** (10): histórico montaje/desmontaje; vigencias.

**`med.MeterTests`** (12): ensayos y contrastes.

### Rutas y operación de lectura

**`med.ReadingRoutes`** (13), **`ReadingCalendars`** (14), **`ReadingBatches`** (15), **`ReadingTasks`** (16), **`ReaderWorkSessions`** (17): planificación y ejecución campo/PWA.

**`med.MeterReadings`** (18): lectura confirmada; FK medidor/punto; estados; foto/adjunto vía `pla.StoredFiles`.

### Consumos, demanda y excepciones

**`med.Consumptions`** (19): cierre de periodo hacia M05 facturación; inmutable post-factura.

**`ConsumptionExceptions`**, **`ConsumptionAdjustments`**, **`ConsumptionDistributions`** (20–22).

**`DemandDeclarations`**, **`DemandTransgressions`** (23–24): grandes usuarios / demanda.

### Importación y telemedición

**`med.ReadingImportProfiles`**, **`ReadingImportJobs`** (26–27): layouts T06; manifiesto en Blob.

**`med.MeteringSystems`**, **`TelemetryRegisterMappings`**, **`RemoteMeterOperations`** (28–30): prepago/AMI; colas Azure.

**`med.IntervalReadings`** (32): curvas de carga (serie temporal; PA-MED-03).

### Prepago y generación distribuida

**`med.PrepaidAccounts`**, **`PrepaidTopUps`** (33–34): saldo y recargas.

**`med.DistributedGenerationContracts`** (35): canónica GD (absorbió `cat.generationAgreements`).

**`med.InjectionBalances`**, **`ConsumptionClassReviews`** (36–37): balances de inyección y revisiones de clase.

FKs habituales: `TenantId` → `pla.Tenants`; `ServiceContractId` → `cat.ServiceContracts`; `ServicePointId` / `PremiseId` → `per.*`; facturación → `fac.*` vía periodos consumo.

## 2.7 Esquema `fac` — M05 facturación (38 tablas activas)

Fuente lógica: M05 §7 (COL-FAC-01–42). DDL: `07-ddl/sql/fac/`. Ola **O4**. Documentos emitidos inmutables; **`LegalEntityId`** (DEC-064); CAE/ARCA vía M06.

**Absorbidas:** `billingHolds` → **`per.Blocks`** (M01); `invoiceBlockReasons` / `invoiceBlockHistory` → **`mor.*`** (M08); `pointsOfSale` → **`fis.PointsOfSale`** (M06 COL-FIS-09).

### Ciclo y parámetros de facturación

**`fac.BillingCycles`** (01), **`BillingUniverses`** (02), **`BillingTemplates`** (03): definición de corridas y universo.

**`fac.BillingGroups`** (23), **`BillingModePolicies`** (22), **`DueDateSchemes`** (24): agrupación y vencimientos.

### Corridas, excepciones y antidoble

**`fac.BillingRuns`** (05), **`BillingRunItems`** (06), **`BillingRunNumberRanges`** (07): lote masivo y rangos CAI/CAE.

**`fac.BillingExceptions`** (08), **`BillingExceptionReasons`** (09): bandeja operativa.

**`fac.BilledPeriods`** (10): marca periodo ya facturado por contrato/servicio.

**`fac.BillableItems`** (11): ítems pendientes (absorbió cargos precargados M04).

### Comprobantes

**`fac.InvoiceDrafts`** (12), **`Invoices`** (13), **`InvoiceRelations`** (14): núcleo comercial; líneas en JSON/hijas según volumen.

**`fac.InvoiceAnnulmentRequests`** (17): workflow anulación (T11).

### Tipos, numeración y políticas

**`fac.VoucherTypes`** (18), **`VoucherResolutionRules`** (19): matriz fiscal.

**`fac.NumberSequences`** (21): talonarios por PV y tipo; FK lógica **`fis.PointsOfSale`**.

### Operaciones masivas e importación

**`fac.MassOperations`** (25), **`MassOperationItems`** (26).

**`fac.BillingImports`** (27), **`BillingImportRows`** (28): Excel/CSV desde tarifas o terceros.

### Presentación, códigos y gráficos

**`fac.InvoiceExternalData`**, **`InvoiceTemplates`**, **`InvoiceLineOrders`**.

**`fac.ConsumptionChartGroups`**, **`BarcodeFormats`**, **`BarcodeAssignments`**.

### Recibos, distribución y cierre

**`fac.PaymentSlips`**: cupones de pago / factura papel.

**`fac.InvoiceDocuments`**: PDF/XML en Blob (`pla.StoredFiles`).

**`fac.DeliveryPreferences`**, **`DistributionRuns`**, **`InvoiceDeliveries`**, **`DistributionRoutes`**, **`PostalCarriers`**: circuito postal (reemplaza ProCoop `POSTALES`).

**`fac.BillingCycleClosures`**: cierre de ciclo y conciliación con M07.

FKs habituales: `TenantId` → `pla.Tenants`; `AccountId` / titular → `per.*`; consumos → `med.Consumptions`; impuestos → `fis.*`; cobranza → `cob.*`.

## 2.8 Esquema `tar` — M04 tarifas (35 tablas activas)

Fuente lógica: M04 §7 (COL-TAR-01–36). DDL: `07-ddl/sql/tar/`. Publicación de cuadros vía **T04** `configVersions`; salida a **`fac.BillableItems`** y corridas de facturación.

**Absorbida:** `preloadedCharges` → **`fac.BillableItems`** (COL-FAC-11). **Desde cat:** `eventChargeRules` / `eventChargeWaivers` → **`tar.EventCharges`** / **`EventChargeBonuses`**.

### Cuadros y filas tarifarias

**`tar.TariffSchedules`** (01): cabecera de cuadro versionado; vigencia; FK publicación CFG.

**`TariffServiceSettings`** (02), **`TariffCategoryRates`** (03), **`TariffRows`** (04): estructura por servicio/categoría/fila.

**`AdherentRates`** (05), **`ProductPrices`** (06): adherentes y precios de productos CAT.

### Cargos por evento, gas y coeficientes

**`tar.EventCharges`** (07), **`EventChargeBonuses`** (08): alta/baja/conexión; bonificaciones.

**`CategoryCoefficients`** (09), **`GasCalorificFactors`** (10): coeficientes; Poder Calorífico gas (canónica vs M03 lectura).

**`ChargeRules`** (11), **`FormulaFunctions`** (12): motor de reglas y funciones del editor de fórmulas.

### Beneficios, subsidios y promociones

**`tar.BenefitGroups`** (13), **`BenefitGroupMembers`** (14).

**`SubsidyRegimes`** (15), **`SubsidyRollImports`** (16), **`SubsidyEnrollments`** (17): padrones subsidio.

**`Promotions`** (18), **`PromotionAssignments`** (19), **`WorksInstallmentPlans`** (20): promos y financiación de obras.

### Redondeo y telefonía

**`tar.RoundingPolicies`** (21), **`RoundingCarryEntries`** (22).

**`PhoneRatePlans`** (23) … **`PhoneFreeNumbers`** (28): tarifas telefonía por franjas.

### Cálculo, simulación y retroactivos

**`tar.CalculationRuns`** (29), **`Calculations`** (30): resultados por contrato/periodo.

**`SimulationRuns`** (31), **`SimulationResults`** (32): previo a publicar cuadro.

**`RetroactiveDiffRuns`** (33), **`NormativeDocuments`** (34), **`BonusRecalcRuns`** (36): diferencias retroactivas y recálculo bonificaciones.

FKs: `TenantId` → `pla.Tenants`; `TenantServiceId` / planes → `cat.*`; índices CFG → `cfg.EconomicIndexSeries`; facturación → `fac.*`.

## 2.9 Esquema `fis` — M06 fiscal (48 tablas)

Fuente lógica: M06 §7 (COL-FIS-*). DDL: `07-ddl/sql/fis/`. Ola **O5/O6**. **`LegalEntityId`** obligatorio; credenciales ARCA en Key Vault (T06); padrones absorbidos desde CFG.

**Desde CFG (CTR-DAT-13):** condiciones/alícuotas IVA e IIBB y padrones viven en `fis.*`, no en `cfg.*`.

### Normativas y perfil

**`fis.NormativeTables`**, **`NormativeTableVersions`**, **`NormativeAdoptions`**.

**`FiscalProfiles`**, **`FiscalSurveys`**, **`TaxAgentRegistrations`**.

**`PointsOfSale`** (canónico; absorbió `fac.pointsOfSale`).

### ARCA / autorización electrónica

**`ArcaCredentials`**, **`ArcaAccessTickets`**, **`FiscalAuthorizations`**, **`ArcaSubmissions`**, **`CaeaPeriods`**, **`CespAuthorizations`**, **`ProvincialValidationCodes`**.

### IVA, IIBB, padrones y alícuotas

**`VatConditionSettings`**, **`VatRates`**, **`VatRateMatrix`**, **`TaxDefinitions`**, **`GrossIncomeSettings`**.

**`TaxpayerRegistries`**, **`TaxpayerRegistryEntries`**, **`DeterminedRates`**, **`TaxExemptions`**.

### Retenciones/percepciones y trazas

**`TaxCalculationTraces`**, **`WithholdingTypes`**, **`WithholdingScales`**, **`WithholdingAssignments`**, **`WithholdingsApplied`**, **`WithholdingSufferedTypes`**.

### Libros IVA y conciliación

**`TaxObligations`**, **`VatLedgers`**, **`VatLedgerLines`**, **`ArcaReceivedImports`**, **`VatReconciliations`**.

### Regímenes informativos y terceros

**`InformationRegimes`**, **`RegimeFilings`**, **`ThirdPartyAgreements`**, **`ThirdPartyCharges`**, **`ThirdPartyRemittances`**.

### Reportes y plazos

**`RegulatoryReports`**, **`RegulatoryReportRuns`**, **`RegulatoryConceptMaps`**, **`PublicAdminSelections`**, **`GatewayDocuments`**.

**`FiscalDeadlines`**, **`ConceptFiscalCases`**, **`FiscalClasses`**, **`OwnTaxObligations`**.

FKs: `LegalEntityId` → `cfg.LegalEntities`; comprobantes → `fac.Invoices`; integración → T06.

## 2.10 Esquema `cob` — M07 cobranza (45 tablas activas)

Fuente lógica: M07 §7 (COL-COB-*). DDL: `07-ddl/sql/cob/`. Ola **O5**.

**Absorbidas:** `cashDiscountRules` → **`mor.*`** (M08); `fileLayouts` → **T06** `int` (COL-INT-10).

### Cuenta corriente y obligaciones

**`cob.CurrentAccounts`**, **`Obligations`**, **`LedgerEntries`**, **`Allocations`**, **`AllocationPolicies`**, **`CreditBalances`**, **`UnidentifiedReceipts`**, **`AccountStatements`**.

### Caja y medios de pago

**`CashRegisters`**, **`CashSessions`**, **`CashOperations`**, **`Receipts`**, **`PaymentTenders`**, **`PaymentMethods`**, **`CardPlans`**, **`StaticQrCodes`**.

### Cobradores y entes recaudadores

**`Collectors`**, **`CollectionRounds`**, **`CollectorSettlements`**, **`CollectionAgencies`**.

**`PaymentReferences`**, **`ExternalKeyAliases`**, **`AgencyDebtExports`**, **`AgencyPublishedDebts`**, **`AgencySettlements`**, **`AgencySettlementLines`**, **`AgencyNoveltyFiles`**.

### Débito automático y pasarelas

**`DirectDebitMandates`**, **`DirectDebitBatches`**, **`GatewayConnectors`**, **`PaymentChannels`**, **`PaymentIntents`**, **`GatewayTransactions`**, **`GatewayWebhookEvents`**, **`PaymentCoupons`**.

### Conciliación y terceros

**`RefundCases`**, **`Chargebacks`**, **`CollectionReconciliations`**, **`TreasuryHandovers`**, **`ThirdPartyBillers`**, **`ThirdPartyCollections`**, **`ExternalObligationImports`**, **`CollectionReportSchemes`**, **`CollectionExceptions`**, **`CollectionAccountingGroups`**.

FKs: `AccountId` → `per.Accounts`; imputación → M15; facturas → `fac.*`; mora → `mor.*`.

## 2.11 Esquema `mor` — M08 mora y financiación (39 tablas)

Fuente lógica: M08 §7 (COL-MOR-01…39). DDL: `07-ddl/sql/mor/`. Ola **O5/O6**. Motor común de interés (RN-04), circuito de notificaciones, tratamiento de morosos (→ M10/T06), convenios y cobranza externa.

**Absorbidas:** `cashDiscountRules` (M07) → **`EarlyPaymentDiscountRules`**; motivos/retenciones de bloqueo de comprobantes (M05) → **`HoldReasons`** / **`DocumentHolds`**.

### Interés, recargos y facturación de intereses

**`mor.InterestPolicies`** (01), **`InterestRateTables`** (02), **`InterestIndexTables`** (03), **`InterestIndexValues`** (04): políticas y tablas de tasa; índices económicos (serie CFG cuando aplica).

**`DueDateSurchargeSchemes`** (05), **`EarlyPaymentDiscountRules`** (06): recargo entre vencimientos y descuento por pronto pago.

**`InterestCalculations`** (07), **`DeferredInterests`** (08): cálculo y diferimiento documentado.

**`InterestBillingRuns`** (09), **`InterestBillingRunItems`** (10): proceso masivo intereses a facturar → `fac.*`.

### Bloqueos de comprobantes

**`HoldReasons`** (11), **`DocumentHolds`** (12): bloqueo opcional al notificar o por mora; vínculo comprobantes `fac.Invoices`.

### Política, instancias y notificaciones

**`DelinquencyPolicies`** (13), **`DelinquencyStages`** (14), **`DelinquencyNoticeModels`** (15): política por servicio/categoría (BASE §68); modelos T09.

**`DelinquencyBatches`** (16), **`DelinquencyNotices`** (17), **`DelinquencyNoticeEvents`** (18): candidatos, procesamiento, entrega, promesas, bitácora (mensajería T09).

### Excepciones, protecciones y evaluación normativa

**`DelinquencyExceptions`** (19), **`ServiceProtections`** (20), **`SuspensionRestrictionRules`** (21): excepciones de mora; electrodependencia/salud (M01); matriz de restricciones por servicio.

**`DelinquencyReasons`** (22), **`DelinquencyEvaluations`** (23): motivos y evaluación antes de cortar/suspender.

### Interrupciones (corte, suspensión, reconexión)

**`InterruptionCases`** (24), **`InterruptionChargeRules`** (25): órdenes hacia M10; aprovisionamiento remoto T06; cargos de reconexión.

### Planes de pago, convenios y garantías

**`PaymentPlans`** (26), **`FinancingInstitutionPlans`** (27), **`AgreementSimulations`** (28): parametrización PLAN_CUO y simulación.

**`Agreements`** (29), **`AgreementObligations`** (30), **`AgreementInstallments`** (31): convenios vigentes y cuotas.

**`Guarantees`** (32), **`GuaranteeRequirementRules`** (33): avales y requisitos (firmas T11).

### Gestión externa, bajas y prescripción

**`DebtCollectionAgencies`** (34), **`CollectionCases`** (35), **`WriteOffs`** (36): estudio de cobranza y castigos.

**`PrescriptionRules`** (37), **`PrescriptionRuns`** (38), **`CollectionFollowUps`** (39): prescripción de deuda y seguimiento.

FKs: `TenantId` → `pla.Tenants`; `AccountId` / contratos → `per.*`, `cat.TenantServices`; comprobantes y saldo → `fac.*`, `cob.*`; órdenes → M10 `tec.*`; comunicaciones → T09.

## 2.12 Esquema `crm` — M09 atención y CRM (42 tablas)

Fuente lógica: M09 §7 (COL-CRM-01…42). DDL: `07-ddl/sql/crm/`. Ola **O2–O6**. Caso único (`crmCases`), omnicanal, turnero, actividades y mesa de entradas; integración con T09 (envíos), T06 (canales/IA), T11 (documentos) y módulos dueños vía **`CrmCommandRequests`**.

**Notas:** historial inmutable (`CrmCaseEvents`, mensajes/turnos sin borrado lógico); `crmCaseId` canónico (DEC-072 / CTR-DAT-30).

### Caso, eventos e interacciones

**`crm.CrmCases`** (01), **`CrmCaseEvents`** (02): expediente, SLA, requisitos, vínculos a cuenta/contrato/OT.

**`CrmConversations`** (03), **`CrmMessages`** (04), **`CrmInteractions`** (05): hilos por canal e historial unificado.

### Tipificación, áreas, SLA y derivación

**`CrmCaseTypes`** (06), **`CrmCaseSubtypes`** (07), **`CrmStatusSets`** (08): catálogos de gestión y estados visibles.

**`CrmAreas`** (09), **`CrmSlaPolicies`** (10), **`CrmRoutingRules`** (11): áreas, calendarios SLA y reglas de derivación/guardia.

### Comandos, contactos e incidentes

**`CrmCommandRequests`** (12): orquestación hacia M01–M19 (facturación, mora, técnica, etc.).

**`CrmContacts`** (13), **`CrmIncidents`** (14), **`CrmIncidentClasses`** (15): contactos no titulares e incidentes comunes.

### Trámites, proyectos y registro de tiempo

**`CrmProcedureTypes`** (16), **`CrmProcedureRecords`** (17): trámites con vencimiento (mesa de entradas).

**`CrmProjects`** (18), **`CrmWorkLogs`** (19), **`CrmHourBanks`** (20): proyectos y horas (bonificadas).

**`CrmAccountAssignments`** (21): responsable comercial por cuenta.

### Omnicanal, respuestas rápidas, bot e IA

**`CrmQuickReplies`** (22), **`CrmChannels`** (23), **`CrmBotFlows`** (24), **`CrmBotSessions`** (25): canales del tenant y bot.

**`CrmAiSuggestions`** (26): sugerencias/clasificación; traza de uso → T06.

### Turnero presencial

**`CrmQueueTickets`** (27), **`CrmQueueTicketEvents`** (28): turnos y auditoría.

**`CrmQueueDeskTypes`** (29), **`CrmQueueDesks`** (30), **`CrmQueueDeskSessions`** (31), **`CrmQueueDisplays`** (32), **`CrmQueueAppointments`** (33): boxes, pantallas y reservas.

### Actividades, calendario y circulares

**`CrmActivityFrequencies`** (34), **`CrmActivityRubros`** (35), **`CrmActivityTypes`** (36), **`CrmActivities`** (37), **`CrmActivityOccurrences`** (38): actividades programadas por área.

**`CrmCalendarEventTypes`** (39), **`CrmCalendarEvents`** (40): calendario operativo.

**`CrmCirculars`** (41), **`CrmCircularRuns`** (42): circulares masivas a socios (entrega T09).

FKs: `TenantId` → `pla.Tenants`; personas/cuentas → `per.*`; usuarios → `iam.Memberships`; envíos/plantillas → T09; integraciones → `int.*` (T06); documentos → T11; OT/presupuestos → M10/M11 vía enlaces y comandos.

## 2.13 Esquema `tec` — M10 técnica, campo y redes (75 tablas activas)

Fuente lógica: M10 §7 (COL-TEC-01…75). DDL: `07-ddl/sql/tec/`. Olas **O3–O7**. Órdenes de trabajo, agenda, app móvil, red/GIS, aprovisionamiento remoto (T06), telefonía física y muestras de agua.

**Absorbidas:** `intakeChannels` → **`crm.CrmChannels`** (CTR-DAT-77); `meterSeals` (M03) → **`Seals`** (COL-TEC-50).

### Factibilidad, conexión y notas

**`tec.FeasibilityRequests`** (01), **`ConnectionEstimates`** (02), **`TechnicalNotes`** (03).

### Catálogos de OT

**`WorkOrderOperationTypes`** (04), **`WorkTypes`** (05), **`IncidentCategories`** (06), **`ResolutionCodes`** (07).

**`TaskCatalog`** (08), **`TaskGroups`** (09), **`WorkOrderPrintTemplates`** (10), **`ChainedOrderRules`** (11).

### OT, materiales, evidencias y expedientes

**`WorkOrders`** (12): ciclo completo; orígenes CRM/mora/lectura/cadena; `intakeChannelId` → `crm.*`.

**`WorkOrderMaterials`** (13), **`FieldEvidence`** (14), **`ServiceConformities`** (15): cierre en campo (T01 `storedFiles`, T11 firmas).

**`DamageAssessments`** (16), **`TechnicalProcedures`** (17).

### Agenda y visitas

**`VisitTypes`** (18), **`SchedulingZones`** (19), **`ResourceCalendars`** (20), **`VisitBookings`** (21), **`Visits`** (22), **`SlotCounters`** (70).

### Cuadrillas, recursos y emergencias

**`Crews`** (23), **`FieldResources`** (24), **`ResponsibleNotificationRules`** (25), **`CertifiedInstallers`** (26).

**`OnCallShifts`** (71), **`EmergencyProtocols`** (72).

### App de campo y sincronización

**`FieldForms`** (27), **`FieldDevices`** (28), **`SyncMutations`** (29), **`SyncConflicts`** (30).

### Mantenimiento e interrupciones planificadas

**`MaintenancePlans`** (31), **`OutagePlans`** (32): cortes programados; vínculo M08/mediación.

### Red, GIS y conexiones de servicio

**`Networks`** (33) … **`NetworkElements`** (38), **`ServiceNetworkConnections`** (39), **`GisExportTemplates`** (40): topología, atributos y export regulador/GIS.

### Dispositivos y aprovisionamiento

**`NetworkDevices`** (41), **`ProvisioningSystems`** (42), **`ProvisioningProfiles`** (43), **`ServiceTechnicalProfiles`** (44), **`ProvisioningCommands`** (45): MikroTik/RADIUS/OLT y confirmación remota (M08 reconexión).

### Obras e inspecciones

**`Works`** (46), **`WorkGroups`** (47), **`WorkBeneficiaries`** (48), **`InspectionCases`** (49).

**`Seals`** (50): precintos de medición (dueño canónico vs lectura M03).

### Telefonía — infraestructura y numeración

**`PhoneExchanges`** (51) … **`PhoneLines`** (61): central, bastidor, regletas, cajas, DSLAM, puertos, líneas.

**`NumberingPlan`** (62), **`TelecomOperators`** (63), **`TelecomServiceTypes`** (64), **`TelecomModalities`** (65).

### Tráfico, buzones y portabilidad

**`CdrImports`** (66), **`CallRecords`** (67), **`MobileUsageImports`** (68), **`ProvidedMailboxes`** (69).

**`NumberPortings`** (73).

### Calidad de agua (campo)

**`WaterSamplingPoints`** (74), **`WaterSamples`** (75).

FKs: `TenantId` → `pla.Tenants`; contratos/servicios → `cat.*`; personas/cuentas → `per.*`; reclamos → `crm.CrmCases`; mora → `mor.InterruptionCases`; medidores → `med.*`; cargos conexión → `tar.*`; stock/M11 en materiales; ejecución remota → T06 `int.*`.

## 2.14 Esquema `tes` — M14 tesorería y bancos (42 tablas activas)

Fuente lógica: M14 §7 (COL-TES-01…43, sin COL-TES-26). DDL: `07-ddl/sql/tes/`. Olas **O5/O8**. Libro único de movimientos, conciliación, cheques, tarjetas, retenciones sufridas, pagos a proveedores/nómina e interbanking (T06).

**Absorbidas:** `cardPlans` → **`cob.CardPlans`** (COL-COB-15); catálogo de entidades financieras consolidado (antes referencias dispersas en M08).

### Instituciones, cuentas y clasificación

**`tes.FinancialInstitutions`** (01), **`BankBranches`** (02): bancos y sucursales.

**`TreasuryAccounts`** (03), **`TreasuryAccountSigners`** (04): cuentas bancarias/caja y reglas de firma.

**`TreasuryCategories`** (05), **`TreasuryConcepts`** (06), **`InstrumentTypes`** (07): categorías, conceptos e instrumentos (referenciados desde `cob.PaymentMethods`).

**`CheckDrawerAccounts`** (08): cuentas emisoras de cheques propios.

### Operaciones, movimientos y depósitos

**`TreasuryOperations`** (09), **`TreasuryMovements`** (10): operación tipada y libro único (reemplaza RESBAN/TESORE).

**`BankDeposits`** (11): depósitos bancarios y tránsito.

### Extractos y conciliación

**`StatementImportProfiles`** (12), **`BankStatementImports`** (13), **`BankStatementLines`** (14).

**`Reconciliations`** (15), **`ReconciliationMatches`** (16), **`ReconciliationRules`** (17).

### Interbanking y lotes de pago

**`InterbankingConnections`** (18), **`InterbankingSyncRuns`** (19), **`InterbankingBalanceSnapshots`** (20).

**`PaymentFiles`** (21): archivos de transferencias y débitos.

### Cheques propios y de terceros

**`ThirdPartyChecks`** (22), **`CheckEvents`** (23), **`Checkbooks`** (24), **`OwnChecks`** (25): cartera, eventos y emisión.

### Tarjetas, retenciones y caja de pagos

**`CardVouchers`** (27), **`CardPresentations`** (28), **`CardSettlements`** (29): cupones y liquidaciones (planes en `cob.*`).

**`ReceivedWithholdings`** (30), **`WithholdingPresentations`** (31): retenciones sufridas y presentaciones.

**`PaymentCashSessions`** (32), **`CashRemittances`** (33), **`TreasuryCashClosings`** (34): sesiones y arqueos de caja de pagos.

### Ejecución, moneda y flujo de fondos

**`PaymentExecutions`** (35): órdenes ejecutadas (proveedores, convenios, nómina).

**`TenantCurrencySettings`** (36), **`ExchangeRates`** (37): multimoneda sobre catálogo T04.

**`PlannedCashItems`** (38), **`FundCommitments`** (39), **`CashFlowScenarios`** (40), **`CashFlowSnapshots`** (41): proyección y escenarios de caja.

### Nómina y parámetros

**`PayrollPaymentBatches`** (42): lotes de pago de haberes (M16 sue).

**`TreasurySettings`** (43): documento único de parámetros por tenant.

FKs: `TenantId` → `pla.Tenants`; imputación → M15 `con.*`; cobranza/pagos M07 → movimientos; compras M12; personas/proveedores → `per.*`; integración bancaria → T06 `int.*`; fiscal retenciones → `fis.*`.

## 2.15 Esquema `ven` — M11 ventas y presupuestos (14 tablas activas)

Fuente lógica: M11 §7 (COL-VEN-01…14). DDL: `07-ddl/sql/ven/`. Olas **O4/O8**. Cargos con titulares, presupuestos versionados, ventas no fiscales de productos/servicios adicionales, financiación comercial y POS.

**Absorbida:** `freightSettlements` → **`soc.TripSettlements`** (M18, COL-SOC-50).

### Cargos por operación y condiciones

**`ven.OperationCharges`** (01): cargos al titular derivados de OT/ventas (facturación M05).

**`ven.SalesConditions`** (02): condiciones comerciales y políticas de venta.

### Presupuestos

**`ven.SalesQuotes`** (03), **`SalesQuoteAcceptances`** (04): presupuesto con ítems/versiones y evidencia de aceptación (portal/T11).

### Pedidos, entrega y devolución

**`ven.SalesOrders`** (05), **`SalesDeliveries`** (06), **`SalesReturns`** (07): ciclo de venta física/digital; stock M13.

### Financiación de ventas

**`ven.SalesFinancingPlans`** (08), **`SalesInstallments`** (09): planes y cuotas comerciales (distinto de M08 convenios de deuda).

### Vendedores, precios y descuentos

**`ven.SalesReps`** (10), **`SalesPriceLists`** (11), **`SalesDiscountRules`** (12): listas, reglas y comisiones.

### Punto de venta (POS)

**`ven.PosTerminals`** (13), **`PosSessions`** (14): terminales y sesiones de caja de venta.

FKs: `TenantId` → `pla.Tenants`; cuentas/titulares → `per.*`; productos → `stk.*` / `cat.*`; presupuesto/CRM → `crm.CrmCases`; OT → `tec.WorkOrders`; comprobantes → `fac.*` cuando la venta factura; cobranza → `cob.*`.

## 2.16 Esquema `cmp` — M12 compras y proveedores (23 tablas)

Fuente lógica: M12 §7 (COL-CMP-01…23). DDL: `07-ddl/sql/cmp/`. Olas **O3/O8**. Ciclo SA → cotización/licitación → OC → recepción → factura proveedor → orden de pago; multientidad (`LegalEntityId` → `cfg.LegalEntities`).

### Proveedores y maestros

**`cmp.Suppliers`** (01): proveedor (persona M01 + datos comerciales; CBU cifrado).

**`SupplierCategories`** (02), **`SupplierEvaluations`** (03), **`SupplierCorrespondence`** (04): rubros, evaluación y circulares (envío T09).

**`PurchaseConcepts`** (05), **`PurchaseLookups`** (06): conceptos de compra y `CON_TASAS` (`kind = rateConcept`, libro IVA compras).

### Demanda, cotización y previsión

**`SupplyRequests`** (07), **`QuoteRequests`** (08), **`SourcingEvents`** (09): pedidos internos, RFQ y eventos de sourcing.

**`PurchaseForecasts`** (17): previsión de compras.

### Órdenes, recepción y comprobantes

**`PurchaseOrders`** (10), **`SupplierReceipts`** (11), **`SupplierInvoices`** (12): OC, remitos y facturas de compra.

**`PurchaseDocumentLinks`** (13), **`MatchExceptions`** (14): trazas entre documentos y excepciones de matching 2/3 vías.

### Pagos y anticipos

**`PaymentOrders`** (15), **`SupplierAdvances`** (16): órdenes de pago y anticipos (ejecución `tes.*`).

### Portal, IA y cuenta corriente compras

**`SupplierPortalSubmissions`** (18), **`AiInvoiceExtractions`** (19): portal proveedor y extracción asistida (T06).

**`SupplierLedgerEntries`** (20), **`SupplyBalances`** (21): mayor proveedor y saldos por rubro.

### Derechos de señal (wholesale)

**`SignalRightsContracts`** (22), **`SignalRightsSettlements`** (23): contratos y liquidaciones con operadores/paquetes CAT.

FKs: `TenantId` → `pla.Tenants`; `PersonId` → `per.Persons`; stock → `stk.*`; asientos → M15 `con.*`; IVA compras → `fis.*`; pagos → `tes.PaymentExecutions`; aprobaciones → `wfl.*`.

## 2.17 Esquema `stk` — M13 stock, activos y fabricación (39 tablas activas)

Fuente lógica: M13 §7 (COL-STK-01…40, sin COL-STK-18). DDL: `07-ddl/sql/stk/`. Olas **O3/O8/O10**. Maestro de artículos, depósitos, movimientos y serial/lotes; costeo perpetuo; bienes de uso; RMA y recepción técnica; BOM y órdenes de fabricación.

**Absorbida:** `equipmentAssignments` → **`cat.ContractEquipmentAssignments`** (COL-CAT-20). **`ExpenseUnits`** (25) canónica para `spendingUnit` (antes en M12 `purchaseLookups`).

### Catálogo de artículos

**`stk.ItemTypes`** (01), **`ItemClassifications`** (02), **`ItemGroups`** (03), **`ItemDepartments`** (04): jerarquía y rubros (dueño único de clasificación; M05/M06 referencian).

**`InventoryItems`** (05), **`ItemKits`** (06): artículos, combos y `DATOSEXT`.

### Depósitos y ubicaciones

**`Warehouses`** (07), **`WarehouseLocations`** (08), **`ItemLocationDefaults`** (09).

### Movimientos y saldos

**`StockDocuments`** (10), **`StockMovements`** (11), **`StockBalances`** (12): remitos, vales, transferencias y libro (`MOV_PRO`).

**`SerialUnits`** (13), **`SerialUnitEvents`** (14), **`LotTypes`** (15), **`Lots`** (16), **`StockReservations`** (17).

### Campo, costeo y compras

**`CrewSettlements`** (19), **`PhysicalCounts`** (20): rendiciones de cuadrilla e inventario físico.

**`ItemCostStates`** (21), **`CostLayers`** (22), **`Revaluations`** (23), **`ReorderSuggestions`** (24): costeo perpetuo y sugerencias a M12.

**`ExpenseUnits`** (25): unidades de gasto (centro de costo M15).

### Activos fijos

**`FixedAssets`** (26), **`FixedAssetHistory`** (27), **`FixedAssetValueChanges`** (28).

**`DepreciationRuns`** (29), **`FixedAssetDepreciations`** (30): amortizaciones → M15.

### RMA y servicio técnico a clientes

**`RmaCases`** (31), **`ReceptionStatuses`** (32), **`ServiceReceptions`** (33).

### Fabricación

**`BomStructures`** (34), **`BomStructureVersions`** (35), **`ProductDivisions`** (36), **`ManufacturingStages`** (37).

**`ManufacturingOrders`** (38), **`ProductionReports`** (39), **`MrpRuns`** (40): OF, partes de producción y MRP.

FKs: `TenantId` → `pla.Tenants`; compras → `cmp.*` / `ven.*`; OT materiales → `tec.WorkOrderMaterials`; contratos → `cat.ServiceContracts`; contabilidad → M15; medidores/serie en M10/M03 vía `SerialUnits`.

## 2.18 Esquema `con` — M15 contabilidad (36 tablas activas)

Fuente lógica: M15 §7 (COL-CON-01…39, sin 15/29/30). DDL: `07-ddl/sql/con_/`. Olas **O5/O8**. Plan de cuentas, motor de asientos, centros de costo, presupuesto, estados financieros e integración con mayor externo.

**Absorbidas:** `capitalRubricAccounts` → **`EntityAccountAssignments`** (`entityType: capitalRubric`); `inflationIndexSeries` / `inflationIndexValues` → **`cfg.EconomicIndexSeries`** / **`EconomicIndexValues`** (§2.3).

### Parámetros y plan de cuentas

**`con.AccountingSettings`** (01), **`ChartOfAccounts`** (02), **`AccountRubrics`** (03), **`LedgerAccounts`** (04), **`AccountRoles`** (05).

### Imputación y asientos

**`PostingRules`** (06), **`AccountingEvents`** (07), **`JournalEntries`** (08), **`JournalLines`** (09).

**`EntryTemplates`** (10), **`PostingBatches`** (11): plantillas y cierre automático.

### Ejercicio, períodos y resultados

**`FiscalYears`** (12), **`AccountingPeriods`** (13), **`ResultTargets`** (14).

### Centros de costo y reparto

**`CostCenters`** (16), **`CostCenterGroups`** (17), **`CostAllocationRules`** (18), **`DistributionModels`** (19), **`CostDistributionRuns`** (20), **`CostCenterModels`** (39).

### Equivalencias, simulación y saldos

**`AccountMappings`** (21), **`SimulationScenarios`** (22), **`SimulatedJournalLines`** (23).

**`LedgerProjections`** (24), **`LedgerBalances`** (25).

### Presupuesto y compromisos

**`Budgets`** (26), **`BudgetLines`** (27), **`Commitments`** (28).

### Inflación contable y conciliación

**`InflationAdjustmentRuns`** (31) (series en `cfg.*`).

**`ReconciliationRuns`** (32).

### Libros y estados financieros

**`RubricatedBooks`** (33), **`StatementTemplates`** (34), **`FinancialStatementRuns`** (35).

### Mayor externo y cuentas por entidad

**`ExternalLedgerMappings`** (36), **`ExternalLedgerTransfers`** (37).

**`EntityAccountAssignments`** (38): cuentas contables de entidades de otros módulos (incl. rubros de capital).

FKs: `TenantId` → `pla.Tenants`; `LegalEntityId` → `cfg.LegalEntities`; eventos desde `fac`, `cob`, `cmp`, `tes`, `stk`, `sue`, `fis`; índices económicos → `cfg.*`; tesorería/pagos → `tes.*`.

## 2.19 Esquema `sue` — M16 personal y sueldos (59 tablas activas)

Fuente lógica: M16 §7 (COL-SUE-02…60, sin COL-SUE-01/61). DDL: `07-ddl/sql/sue/`. Olas **O8/O9**. Legajos, novedades, liquidación, Ganancias, presentaciones y RRHH.

**Absorbidas:** `employers` → subdocumento **`employer`** en **`cfg.LegalEntities`** (DEC-064); `parallelRunComparisons` → **`mig.ParallelComparisons`** (T07); feriados → **`cfg.Holidays`**.

### Legajos y datos laborales

**`sue.Employees`** (02), **`EmployeeAssignments`** (03), **`EmployeeCostAllocations`** (04), **`EmployeeFamilyMembers`** (05).

**`EmployeePayAccounts`** (06), **`EmployeeDocuments`** (07), **`EmployeeNotes`** (08), **`SupervisionLinks`** (09).

### Turnos y situación de revista

**`Shifts`** (10), **`EmployeeShiftAssignments`** (11), **`EmploymentStatusPeriods`** (12).

### Extras, adicionales y descuentos planificados

**`ExtraGroups`** (13), **`ExtraItems`** (14), **`EmployeeExtras`** (15), **`DeductionPlans`** (16).

### Marco sindical y estructura salarial

**`Unions`** (17), **`LaborAgreements`** (18), **`SalaryCategories`** (19), **`SalaryScales`** (20), **`SeniorityScales`** (21).

**`Positions`** (22), **`WorkAreas`** (23), **`HealthInsurerAdoptions`** (24), **`TerminationReasons`** (25).

### Motor de liquidación

**`PayrollVariables`** (26), **`PayrollConcepts`** (27), **`PayrollTypes`** (28), **`PayrollConfigVersions`** (29).

**`NoveltyTypes`** (30), **`Novelties`** (31), **`NoveltyImportBatches`** (32), **`TimePunches`** (33), **`ExtraTasks`** (34).

### Licencias y vacaciones

**`LeaveCauses`** (35), **`LeaveRequests`** (36), **`VacationBalances`** (37).

### Períodos, liquidaciones y recibos

**`PayPeriods`** (38), **`PayrollRuns`** (39), **`Payslips`** (40).

**`IncomeTaxCalculations`** (41), **`IncomeTaxDeclarations`** (42), **`StatutoryFilings`** (43).

### Pago, contabilidad y egreso

**`PayrollPaymentRequests`** (44) → `tes.PayrollPaymentBatches`; **`PayrollAccountingRules`** (45) → `con.*`.

**`Terminations`** (46), **`EmploymentCertificates`** (47), **`PayslipNotifications`** (48) → T09/T11.

### Gestión de personas (RRHH)

**`PerformanceTemplates`** (49), **`PerformanceCycles`** (50), **`PerformanceReviews`** (51), **`Objectives`** (52).

**`DisciplinaryActions`** (53), **`AdministrativeInquiries`** (54), **`WorkAccidents`** (55), **`LaborLawsuits`** (56).

**`ReportGroups`** (57), **`SalaryIncreaseBatches`** (58).

### Liquidador externo

**`ExternalPayrollImports`** (59), **`ExternalPayrollLayouts`** (60) (layouts T06 `int`).

FKs: `TenantId` → `pla.Tenants`; legajo/persona → `per.Persons`; centros → `con.CostCenters`; tablas oficiales → `cfg.PayrollOfficialCodes` y afines; asientos → eventos M15.

## 2.20 Esquema `ins` — M17 institucional y capital (35 tablas activas)

Fuente lógica: M17 §7 (COL-INS-01…36, sin COL-INS-03). DDL: `07-ddl/sql/ins/`. Olas **O3/O8**. Calidad de socio, capital social, órganos de gobierno, asambleas, elecciones, excedentes, cuotas institucionales e informes INAES.

**Absorbida:** `insNumberingSeries` → **`wfl.NumberingSequences`** (T11, COL-WFL-45).

### Asociación y eventos

**`ins.AssociateMemberships`** (01), **`MembershipEvents`** (02), **`ElectoralDistricts`** (04).

### Capital social y certificados

**`CapitalItems`** (05), **`CapitalSubscriptionRules`** (06), **`CapitalShareValues`** (07), **`CapitalMovements`** (08).

**`CapitalReserves`** (09), **`CapitalTransfers`** (10), **`CapitalRefunds`** (11), **`CapitalClosings`** (12).

**`ShareCertificates`** (13), **`CapitalBalances`** (36): libro y saldo proyectado.

### Excedentes

**`SurplusDistributions`** (14), **`SurplusAllocations`** (15).

### Gobierno y mandatos

**`GovernanceBodies`** (16), **`BodyMandates`** (17).

### Asambleas y actas

**`Meetings`** (18), **`MeetingAgendaItems`** (19), **`MeetingParticipants`** (20), **`MeetingPermissions`** (21).

**`Minutes`** (22), **`Resolutions`** (23).

### Padrones, poderes y elecciones

**`Rosters`** (24), **`RosterEntries`** (25), **`Proxies`** (26), **`ElectoralLists`** (27).

**`VotingSessions`** (28), **`VoteTallies`** (29).

### Cuotas institucionales e INAES

**`InstitutionalFees`** (30), **`InstitutionalFeeSettlements`** (31): liquidación → `fac` / `cob`.

**`InaesCategories`** (32), **`InaesReports`** (33), **`AssociateRegisterEditions`** (34), **`MemberCredentials`** (35).

FKs: `TenantId` → `pla.Tenants`; persona/titular → `per.Persons` / `per.Holders`; contabilidad capital → `con.EntityAccountAssignments`; firmas/actas → T11; comunicaciones → T09.

## 2.21 Esquema `soc` — M18 servicios sociales y flota (53 tablas)

Fuente lógica: M18 §7 (COL-SOC-01…53). DDL: `07-ddl/sql/soc/`. Olas **O3/O10**. Coberturas y prestaciones (salud, sepelio, sangre), cementerio parque, ortopedia, planes de vivienda, transporte y flota con GPS.

**Canónica cruzada:** `TripSettlements` (50) absorbe rendiciones de ventas M11 (`freightSettlements`).

### Dependientes, planes y red prestadora

**`soc.ServiceDependents`** (01), **`ServiceBeneficiaries`** (02), **`DependentEvents`** (03).

**`CoveragePlans`** (04), **`CareProviders`** (05), **`ProviderAgreements`** (06), **`MedicalSpecialties`** (07), **`MedicalProfessionals`** (08).

### Solicitudes y prestaciones

**`BenefitRequests`** (09), **`BurialServiceCases`** (10), **`DeathSubsidyCases`** (11), **`BloodCoverageRequests`** (12).

**`DonationCampaigns`** (13), **`DonationAppointments`** (14), **`HealthAuthorizations`** (15).

### Transporte de beneficiarios

**`TransportTrips`** (16), **`TripLegs`** (17), **`TripCharacteristics`** (18).

### Cementerio parque

**`Cemeteries`** (19), **`CemeteryRegulations`** (20), **`BurialUnits`** (21), **`BurialRights`** (22), **`BurialRightEvents`** (23).

**`BurialOccupancies`** (24), **`CemeteryActs`** (25).

### Ortopedia y depósitos

**`OrthopedicItems`** (26), **`OrthopedicLoans`** (27), **`DispenserWithdrawals`** (28).

### Planes de vivienda (obra social)

**`HousingPlans`** (29) … **`HousingTerminations`** (42): precios, unidades, aportes, etapas, avance de obra, materiales y certificados.

### Flota, combustible y GPS

**`FleetVehicles`** (43), **`Drivers`** (44), **`VehicleDocuments`** (45), **`VehicleMaintenances`** (46), **`VehicleUsages`** (47).

**`FuelTypes`** (48), **`FuelLoads`** (49), **`TripSettlements`** (50): rendiciones de viaje (incl. origen ventas).

**`GpsDevices`** (51), **`GpsPositions`** (52), **`ContractRegistrations`** (53).

FKs: `TenantId` → `pla.Tenants`; titular/contrato → `cat.ServiceContracts` / `per.*`; stock vivienda → `stk.*`; facturación cuotas → `fac`/`tar`; personal → `sue.Employees` en choferes.

## 2.22 Esquema `por` — M19 portal del socio y landing (14 tablas)

Fuente lógica: M19 §7 (COL-POR-01…14). DDL: `07-ddl/sql/por/`. Olas **O1/O11**. Sitio público por cooperativa, acceso al portal, formularios y trámites en línea, preferencias y kioscos de autoservicio.

### Landing y marca

**`por.LandingPages`** (01), **`LandingPageVersions`** (02): páginas institucionales; marca → `uxd.TenantBrandings`.

### Acceso, vínculos y delegación

**`PortalAccountAccess`** (03), **`PortalLinkAttempts`** (04), **`PortalDelegationInvites`** (05): altas de usuario portal, intentos de enlace y delegación de cuentas (M01/T02).

### Formularios y borradores

**`PortalForms`** (06), **`PortalFormSubmissions`** (07), **`PortalDrafts`** (08), **`PublicSubmissions`** (09): definición publicada → T11 `formVersions`; envíos y borradores.

### Experiencia y campañas en portal

**`PortalUserPreferences`** (10), **`PortalBanners`** (11).

### Migración portal legado y kioscos

**`LegacyPortalImports`** (12), **`LegacyPortalUserMap`** (13): mapeo ProCoop/T07 `mig`.

**`KioskDevices`** (14): terminales de autoservicio → T06 periféricos.

FKs: `TenantId` → `pla.Tenants`; personas/cuentas → `per.*`; identidad → `iam.*`; casos/trámites → `crm.*`; pagos/consultas delegan a módulos dueños vía API.

## 2.23 Esquema `com` — T09 comunidad y comunicaciones (55 tablas activas)

Fuente lógica: T09 §7 (COL-COM-01…55, sin COL-COM-50). DDL: `07-ddl/sql/com/`. Olas **O1/O6**. Muro editorial, moderación, boletines, encuestas, eventos, audiencias y motor transaccional de envíos (email/SMS/WhatsApp/push).

**Absorbida:** `consentRecords` (COM) → **`nfr.ConsentRecords`** (T08, COL-NFR-04; también M01 `consents`).

### Muro y engagement

**`com.Posts`** (01), **`PostCategories`** (02), **`PostTemplates`** (03), **`PostReactions`** (04), **`PostViews`** (05), **`PostDailyStats`** (06), **`PostUserStates`** (07), **`GreetingRules`** (08).

**`Comments`** (09).

### Moderación y convivencia

**`ModerationPolicies`** (10), **`ModerationRules`** (11), **`ModerationCases`** (12), **`ContentReports`** (13).

**`CommunitySanctions`** (14), **`CommunityGuidelines`** (15), **`GuidelineAcceptances`** (16).

### Boletines y encuestas

**`NewsletterRules`** (17), **`Newsletters`** (18), **`NewsletterRecipients`** (19).

**`Surveys`** (20), **`SurveyResponses`** (21), **`SurveyInvitations`** (22), **`SurveyTemplates`** (23), **`SurveyCategories`** (24).

### Eventos y beneficios

**`Events`** (25), **`EventRegistrations`** (26), **`BenefitPartners`** (27), **`Benefits`** (28), **`BenefitRedemptions`** (29).

### Audiencias y campañas

**`AudienceSegments`** (30), **`AudienceImportLists`** (31), **`AudienceImportRows`** (32), **`AudienceSnapshots`** (33), **`AudienceSnapshotMembers`** (34).

**`CommunicationTypes`** (35), **`MessageTemplates`** (36), **`MessageTemplateVersions`** (37), **`TemplateVariables`** (38).

**`Communications`** (39), **`CommunicationAttempts`** (40), **`CommunicationEvents`** (41), **`TrackedLinks`** (42).

**`SenderIdentities`** (43), **`ChannelSettings`** (44), **`MessagingUsage`** (45), **`InternalNotificationRules`** (46), **`Campaigns`** (47).

### Preferencias, facturación y avisos

**`InvoiceMessages`** (48), **`CommunicationPreferences`** (49), **`SuppressionEntries`** (51).

**`AppNotifications`** (52), **`PushSubscriptions`** (53).

**`PlatformNotices`** (54), **`PlatformNoticeReads`** (55), **`OutageNotices`** (56).

FKs: `TenantId` → `pla.Tenants`; destinatarios → `per.*` / audiencias; plantillas mora/factura → M08/M05; integración canales → T06 `int.*`; CRM → `crm.*`; workflow → T11.

## 2.24 Esquema `int` — T06 integraciones externas (18 tablas)

Fuente lógica: T06 §7 (COL-INT-01…18). DDL: `07-ddl/sql/int/`. Olas **O0–O11**. Marco común de conectores: catálogo, conexiones por tenant, bóveda (DEC-074), ejecución outbox/idempotencia, webhooks, layouts e intercambio de archivos, conciliación, contingencia, agente local y consumo de IA.

**Absorbidas (canónicas aquí):** `fileLayouts` ← M07 `fileLayouts` (COL-COB-22) y T04 `statutoryFileLayouts` (COL-CFG-54); bitácora telemedición M03 `meteringConnectorLogs` → **`IntegrationMessages`** (COL-INT-07).

### Catálogo y conexiones

**`int.IntegrationProviders`** (01, plataforma/`PLATFORM`), **`IntegrationConnections`** (02), **`ExternalReferences`** (15).

### Bóveda, certificados y tokens en caché

**`IntegrationSecrets`** (03), **`IntegrationCertificates`** (04), **`IntegrationTokens`** (05; valor material en Redis/KV).

### Operaciones y bitácora

**`IntegrationOperations`** (06, idempotencia y correlación), **`IntegrationMessages`** (07, saneamiento y TTL de cuerpos; `storedFileId` → `pla.StoredFiles`).

### Webhooks entrantes

**`WebhookEndpoints`** (08), **`WebhookInbox`** (09, deduplicación y TTL).

### Intercambio de archivos

**`FileLayouts`** (10, motor declarativo de registros/campos), **`IntegrationFileExchanges`** (11, hash/totales y estados del ciclo archivo).

### Monitoreo, conciliación y contingencia

**`IntegrationReconciliations`** (12), **`IntegrationAlerts`** (13), **`IntegrationContingencies`** (14).

### Agente local e IA

**`LocalAgents`** (16, hardware en sucursal), **`LocalAgentCommands`** (17, TTL; `deviceId` enlazado desde M16 fichadas), **`AiUsageLogs`** (18).

FKs: `TenantId` → `pla.Tenants`; secretos/certificados → conexión; archivos → `pla.StoredFiles`; cambios sensibles (modo producción, rotación) → T11; los módulos de dominio consumen **eventos** `int.*` y no reciben escrituras directas del conector (DEC-003).

## 2.25 Esquema `wfl` — T11 workflow, documentos y operaciones (51 tablas activas)

Fuente lógica: T11 §7 (COL-WFL-01…53, sin COL-WFL-38/39). DDL: `07-ddl/sql/wfl/`. Olas **O0–O3**. Eventos sobre outbox T01, jobs masivos, operaciones con pasos, workflows configurables, aprobaciones, expediente documental, plantillas/render, numeración no fiscal, firma digital y dossier.

**Absorbidas:** `retentionPolicies` / `legalHolds` (WFL) → **`nfr.RetentionPolicies`** / **`nfr.LegalHolds`** (T08, COL-NFR-06/07). **Canónicas aquí:** numeración ← T04 `sequences` (COL-CFG-40) y M17 `insNumberingSeries` (COL-INS-03) → **`NumberingSequences`** (COL-WFL-45).

### Eventos de dominio

**`wfl.EventTypes`** (01), **`EventSubscriptions`** (02): contrato de consumo sobre `pla.OutboxMessages`.

### Bandeja, jobs y corridas masivas

**`OperationalInboxItems`** (03), **`JobDefinitions`** (04), **`JobSchedules`** (05), **`BulkRuns`** (06), **`BulkRunItems`** (07).

### Operaciones de negocio

**`OperationTypes`** (08), **`Operations`** (09), **`OperationSteps`** (10), **`StateMachineRegistry`** (11).

### Workflows y SLA

**`WorkflowDefinitions`** (12), **`WorkflowVersions`** (13), **`WorkflowInstances`** (14), **`WorkflowInstanceEvents`** (15).

**`SlaPolicies`** (16), **`SlaTimers`** (17; también casos M09 CRM).

### Formularios dinámicos

**`FormDefinitions`** (18), **`FormVersions`** (19), **`FormSubmissions`** (20), **`ActionCatalog`** (21), **`DataSourceCatalog`** (22): M10/M19 portal referencian versiones publicadas.

### Aprobaciones y delegación

**`ApprovalPolicies`** (23), **`ApprovalRequests`** (24), **`ApprovalSteps`** (25), **`ApprovalDecisions`** (26), **`Delegations`** (27): excepciones M01, cargos M11, integraciones T06 sensibles.

### Tareas, bandeja y agenda

**`Tasks`** (28), **`TaskComments`** (29), **`WorkItems`** (30), **`AgendaEntries`** (31), **`AgendaFeeds`** (32).

### Expediente documental

**`DocumentTypes`** (33, `retentionPolicyCode` → T08 `nfr`), **`Documents`** (34), **`DocumentVersions`** (35, `storedFileId` → `pla.StoredFiles`), **`DocumentLinks`** (36), **`ShareLinks`** (37), **`DocumentAccessLogs`** (40, TTL).

### Plantillas y render

**`DocumentTemplates`** (41), **`TemplateVersions`** (42), **`TemplateDataContracts`** (43), **`RenderRequests`** (44): facturas M05, credenciales M17, comunicaciones M09.

### Numeración no fiscal

**`NumberingSequences`** (45), **`NumberingAssignments`** (46).

### Firma digital

**`SignatureProfiles`** (47), **`SignatureRequests`** (48), **`SignatureParticipants`** (49), **`SignatureEvidences`** (50): convenios M08, recibos M16, tesorería M14.

### Expedientes (dossier)

**`Dossiers`** (51), **`DossierEntries`** (52), **`DossierTimeline`** (53).

FKs: `TenantId` → `pla.Tenants`; usuarios → `iam.*`; sujetos vía `subjectRef`/`sourceRef` polimórfico (sin FK cross-módulo obligatoria); archivos → `pla.StoredFiles`; retención legal → `nfr.*`; consumidores de eventos en módulos dueños vía outbox (DEC-003).

## 2.26 Esquema `nfr` — T08 privacidad, retención y calidad (17 tablas activas)

Fuente lógica: T08 §7 (COL-NFR-01…23, sin COL-NFR-11/13/14/17/18/22). DDL: `07-ddl/sql/nfr/`. Olas **O0–O1**. Catálogo PII, tratamientos, consentimientos, derechos del titular, retención/supresión, cifrado, SLO, seguridad y subencargados (DEC-076).

**Absorbidas (canónicas aquí):** consentimientos ← M01 `consents` (COL-PER-19) y T09 `consentRecords` (COL-COM-50); solicitudes ARCO ← M01 `dataSubjectRequests` (COL-PER-20); políticas de retención / legal hold ← T11 (COL-WFL-38/39).

**Reexportadas a T01 `pla`:** `restoreDrills`→`RestoreTests`, `idempotencyKeys`, `processedEvents`→`InboxReceipts`, `alertRules`/`alertEvents`, `tenantUsageSnapshots`→`UsageSnapshots`.

### Catálogo y privacidad

**`nfr.DataCatalogEntries`** (01, campos `x-pii`), **`ProcessingActivities`** (02), **`PrivacyNotices`** (03).

### Consentimiento y derechos del titular

**`ConsentRecords`** (04), **`DataSubjectRequests`** (05): persona → `per.Persons`.

### Retención y supresión

**`RetentionPolicies`** (06), **`LegalHolds`** (07), **`RetentionRuns`** (08), **`ErasureLedger`** (09, global).

### Seguridad y operación

**`SecurityIncidents`** (10), **`EncryptionKeys`** (12, DEK por categoría), **`Locks`** (15, respaldo Redis), **`SloDefinitions`** (16), **`CspReports`** (19, TTL).

### Calidad, estado y cumplimiento

**`QualityEvidence`** (20), **`StatusNotices`** (21, enlaza `pla.PlatformIncidents`), **`Subprocessors`** (23, registro público DEC-076).

FKs: `TenantId` → `pla.Tenants` donde aplica; `wfl.DocumentTypes.retentionPolicyCode` → `RetentionPolicies`; comunicaciones T09 leen `ConsentRecords`; jobs de retención coordinan con T11 expediente y Blob purge.

## 2.27 Esquema `mig` — T07 migración ProCoop → CoopApps (20 tablas)

Fuente lógica: T07 §7 (COL-MIG-01…20). DDL: `07-ddl/sql/mig/`. Olas **O0–O1/O11**. Proyecto por cooperativa, snapshots del origen, mapeos versionados, corridas y staging, identidad legacy, conciliación, paralelo con ProCoop, convivencia/corte y histórico consultable (DEC-070, DEC-103).

**Absorbida (canónica aquí):** comparación paralela de liquidaciones M16 `parallelRunComparisons` → **`ParallelComparisons`** (COL-MIG-14).

### Proyecto y capturas del origen

**`mig.MigrationProjects`** (01, acta → `wfl.Documents`), **`LegacySnapshots`** (02, `storedFileId` → `pla.StoredFiles`), **`AnonymizationProfiles`** (20, plataforma).

### Mapeos declarativos

**`MigrationMappingSets`** (03), **`MigrationMappingRules`** (04), **`MigrationValueMaps`** (05).

### Corridas, lotes y staging

**`MigrationRuns`** (06), **`MigrationBatches`** (07), **`MigStagingRecords`** (08, TTL), **`MigrationIssues`** (11, escaneo secretos DEC-103), **`MigrationReconciliations`** (12).

### Identidad y legado consultable

**`LegacyIdMap`** (09), **`LegacyKeyAliases`** (10, DEC-050), **`LegacyRecords`** (19).

### Paralelo, convivencia y corte (O11)

**`ParallelRuns`** (13, enlace lote M05 `billingRuns`), **`ParallelComparisons`** (14), **`BypassPlans`** (15), **`CoexistenceSyncs`** (16), **`CutoverPlans`** (17), **`RollbackJournal`** (18).

FKs: `TenantId` → `pla.Tenants`; archivos → `pla.*`; importadores archivo → T06 `int.FileLayouts`; IDs externos → `int.ExternalReferences`; regularización documentos M01 → `crm.CrmCases` + lotes `MigrationBatches`.

## 2.28 Esquema `bia` — T10 BI, reportes y API analítica (67 tablas activas)

Fuente lógica: T10 §7 (COL-BIA-01…69, sin COL-BIA-20/21). DDL: `07-ddl/sql/bia/`. Olas **O1–O2/O11**. Catálogo DevExpress, ejecuciones y export, tableros e indicadores, datasets certificados, API B2B/webhooks, benchmarking anónimo y **data mart** analítico (`bi_dim_*` / `bi_fact_*` / `bi_snap_*`).

**Absorbidas:** clientes y credenciales API → **`iam.ApiClients`** / **`iam.ApiCredentials`** (COL-IAM-22/23); uso detallado también en T06 `int.AiUsageLogs` para IA transversal.

### Reportes y exportación (O1–O2)

**`bia.ReportDefinitions`** (01), **`ReportPresets`** (02), **`SavedViews`** (03), **`ReportRuns`** (04), **`ReportExports`** (05), **`ReportSchedules`** (06), **`ReportDeliveries`** (07), **`ReportTemplates`** (08), **`ExportLayouts`** (09), **`ReportAccessLogs`** (10), **`ReportRunResults`** (30, TTL).

### Indicadores, tableros y alertas

**`IndicatorDefinitions`** (11), **`IndicatorSnapshots`** (12, escenarios M15), **`Dashboards`** (13), **`DashboardUserPrefs`** (14), **`KpiAlertRules`** (15), **`KpiAlerts`** (16).

### Datasets, generador e IA (O11)

**`AnalyticsDatasets`** (17), **`CustomReports`** (18, MER-013), **`AiQuestions`** (19 → `int.AiUsageLogs`).

### API externa, webhooks y datos abiertos

**`ApiUsageLogs`** (22, TTL), **`ApiUsageDaily`** (23), **`ExtWebhookSubscriptions`** (24), **`ExtWebhookDeliveries`** (25, TTL), **`ExtBulkExports`** (26), **`OpenDataPublications`** (27): `apiClientId` → `iam.ApiClients`.

### Benchmarking entre cooperativas

**`BenchmarkParticipations`** (28), **`BenchmarkAggregates`** (29, plataforma anonimizada).

### Dimensiones analíticas (`analytics` / esquema `bia`, O11)

**`Bi_dim_date`** (31), **`Bi_dim_person`** (32), **`Bi_dim_account`** (33), **`Bi_dim_contract`** (34), **`Bi_dim_service`** (35), **`Bi_dim_category`** (36), **`Bi_dim_plan`** (37), **`Bi_dim_product`** (38), **`Bi_dim_concept`** (39), **`Bi_dim_channel`** (40), **`Bi_dim_cashbox`** (41), **`Bi_dim_crew`** (42), **`Bi_dim_supplier`** (43), **`Bi_dim_glAccount`** (44), **`Bi_dim_costCenter`** (45), **`Bi_dim_employee`** (46), **`Bi_dim_branch`** (47), **`Bi_dim_zone`** (48).

### Hechos y snapshots

**`Bi_fact_invoice`** (49), **`Bi_fact_invoiceLine`** (50), **`Bi_fact_payment`** (51), **`Bi_fact_allocation`** (52), **`Bi_fact_ledgerEntry`** (53), **`Bi_fact_consumption`** (54), **`Bi_fact_reading`** (55), **`Bi_fact_arrears`** (56), **`Bi_fact_agreement`** (57), **`Bi_fact_ticket`** (58), **`Bi_fact_workOrder`** (59), **`Bi_fact_turn`** (60), **`Bi_fact_stockMovement`** (61), **`Bi_fact_purchase`** (62), **`Bi_fact_treasury`** (63), **`Bi_fact_journalLine`** (64), **`Bi_fact_payroll`** (65), **`Bi_fact_member`** (66), **`Bi_fact_communication`** (67), **`Bi_fact_apiUsage`** (68), **`Bi_snap_balance`** (69).

FKs: `TenantId` → `pla.Tenants`; archivos export → `pla.StoredFiles`; ETL desde módulos dueños (solo lectura); credenciales y scopes → T02 `iam`; rate limit / auditoría → T08; webhooks salientes → T06 patrones de entrega.

## 3. Trazabilidad

Cada tabla incluirá (en la versión completa) referencia a: anexo dueño, colección/modelo lógico T05, RF/RN relevantes, y ola de contenido funcional asociada.

## 4. Bitácora

| Versión | Fecha | Cambio |
|---|---|---|
| 0.1 | 19-11-2026 | Creación del documento; convenciones y esqueleto por módulo (DEC-117). |
| 0.2 | 19-11-2026 | Núcleo `per.Persons/Holders/Accounts`; `iam.Identities/Memberships/Roles` (fase 3). |
| 0.3 | 19-11-2026 | `per.Addresses/AddressGeoEvents`; `iam.Sessions`, perfiles, asignaciones y scope. |
| 0.4 | 19-11-2026 | `per.Premises`, `ServicePoints`, `Relationships`, `Transfers`, `DuplicateCases`. |
| 0.5 | 19-11-2026 | `per.Notes`, `Blocks`, `BlockEffects`, documentación (`DocumentRequirement*`, `DocumentSubmissions`), `PerRevisions`. |
| 0.6 | 19-11-2026 | Catálogo completo **`07-catalogo-tablas-sql.md`** (1.109 COL → 1.058 tablas); script `generate_07_catalog_from_t05.py`; arquitectura dos capas. |
| 0.7 | 19-11-2026 | **§2.0 `pla`** completo (31 tablas T01); FK raíz `Tenants`; outbox/jobs/archivos. |
| 0.8 | 19-11-2026 | Capa **C** `pla`: 31× `CREATE TABLE` en `07-ddl/sql/pla/` vía `generate_pla_sql.py`. |
| 0.9 | 19-11-2026 | **§2.2 `iam` completo** (31 tablas T02); nota OpenIddict stores EF. |
| 1.0 | 19-11-2026 | **§2.3 `cfg` completo** (45 tablas T04); absorciones documentadas. |
| 1.1 | 19-11-2026 | **§2.4 `cat` completo** (25 tablas M02). |
| 1.2 | 19-11-2026 | **§2.5 `uxd` completo** (10 tablas T03). |
| 1.3 | 19-11-2026 | **§2.6 `med` completo** (34 tablas M03). |
| 1.4 | 19-11-2026 | **§2.7 `fac` completo** (38 tablas M05). |
| 1.5 | 19-11-2026 | **§2.8 `tar` completo** (35 tablas M04). |
| 1.6 | 19-11-2026 | **§2.9 `fis`** (48) + **§2.10 `cob`** (45). |
| 1.7 | 19-11-2026 | **§2.11 `mor` completo** (39 tablas M08). |
| 1.8 | 19-11-2026 | **§2.12 `crm` completo** (42 tablas M09). |
| 1.9 | 19-11-2026 | **§2.13 `tec` completo** (75 tablas activas M10). |
| 2.0 | 19-11-2026 | **§2.14 `tes` completo** (42 tablas activas M14). |
| 2.1 | 19-11-2026 | **§2.15 `ven` completo** (14 tablas activas M11). |
| 2.2 | 19-11-2026 | **§2.16 `cmp` completo** (23 tablas M12). |
| 2.3 | 19-11-2026 | **§2.17 `stk` completo** (39 tablas activas M13). |
| 2.4 | 19-11-2026 | **§2.18 `con` completo** (36 tablas activas M15). |
| 2.5 | 19-11-2026 | **§2.19 `sue` completo** (59 tablas activas M16). |
| 2.6 | 19-11-2026 | **§2.20 `ins` completo** (35 tablas activas M17). |
| 2.7 | 19-11-2026 | **§2.21 `soc` completo** (53 tablas M18). |
| 2.8 | 19-11-2026 | **§2.22 `por` completo** (14 tablas M19). |
| 2.9 | 19-11-2026 | **§2.23 `com` completo** (55 tablas activas T09). |
| 2.10 | 19-11-2026 | **§2.24 `int` completo** (18 tablas T06). |
| 2.11 | 19-11-2026 | **§2.25 `wfl` completo** (51 tablas activas T11). |
| 2.12 | 19-11-2026 | **§2.26 `nfr` completo** (17 tablas activas T08). |
| 2.13 | 19-11-2026 | **§2.27 `mig` completo** (20 tablas T07). |
| 2.14 | 19-11-2026 | **§2.28 `bia` completo** (67 tablas activas T10). |
| 2.15 | 19-11-2026 | **§2.1 `per` completado** (`PersonIdentifierIndex`, `PersonSensitiveData`, contactos). |