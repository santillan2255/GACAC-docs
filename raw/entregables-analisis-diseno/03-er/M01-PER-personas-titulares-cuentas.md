# Modelo entidad-relación — M01 PER Personas, titulares y cuentas

| Campo | Valor |
|---|---|
| Artefacto | 6.1 Modelo entidad-relación completo, vista por módulo (índice: [`03-modelo-entidad-relacion.md`](../03-modelo-entidad-relacion.md)) |
| Anexo dueño | [`M01-PER-personas-titulares-cuentas.md`](../../especificacion/anexos/M01-PER-personas-titulares-cuentas.md), §7 |
| Catálogo canónico | [`T05-DAT-modelo-datos.md`](../../especificacion/anexos/T05-DAT-modelo-datos.md), filas `COL-PER-NN` |
| Vista por dominio | [`03a-er-plataforma-personas-catalogo.md` §5](../03a-er-plataforma-personas-catalogo.md) |
| Versión | 2.1 (05-11-2026) |
| Generado con | [`_trabajo/generar_er_completo.py`](../_trabajo/generar_er_completo.py), revisado a mano |

## 1. Resumen

T05 registra 21 filas con dueño M01: **17 colecciones a crear** y 4 absorbidas en otras colecciones. Las 17 colecciones a crear se dibujan en 1 diagrama, uno por subdominio.

Convenciones: las del índice (secciones 1.3 y 2). Cada entidad lleva `id PK "_id"` y los campos de su ficha del §7; se omiten los campos transversales (`tenantId`, auditoría, `version`, baja lógica, `legacy`). El comentario de una `FK` indica el destino: `→ colección` si es del mismo módulo, `MXX colección` si es de otro; "(inferido)" cuando ni el anexo ni T05 §7.2 y §7.2.1 nombran el destino para esa colección y el nombre del campo no coincide literalmente con el de la colección (se dedujo por rol, sufijo, versión o por el contexto de §7.2.1; a confirmar); "destino no declarado" cuando no se puede fijar. Una referencia polimórfica (`entityType` + `entityId`, `resourceType` + `resourceId`, `targetRef`, `subjectRef`…) no lleva `FK` ni relación: el comentario "referencia polimórfica según <discriminador>" la señala, porque el destino depende del discriminador. Los campos que T05 §7.2.1 declara "no es referencia" no llevan `FK`. Los nombres que el anexo o T05 citan solo en notas "antes …", "Reemplazado por" o "alias" no se toman como campos ni como destinos. `UK` marca los únicos mínimos de T05; "según T05" señala un campo que figura en el catálogo pero no en la ficha del anexo. El tipo `any` indica que el anexo no declara el tipo.

## 2. Colecciones del módulo

| COL-ID | Colección | Diagrama | Ola | Clasificación | Alcance | Volumen o TTL (T05 §7.8) | Ficha en el anexo |
|---|---|---|---|---|---|---|---|
| COL-PER-01 | `persons` | 1 | O2 | ID/CT | T | — | §7.1 |
| COL-PER-02 | `personIdentifierIndex` | 1 | O2 | ID | T | — | §7.1.1 |
| COL-PER-03 | `personSensitiveData` | 1 | O2 | SE | T | — | §7.2 |
| COL-PER-04 | `holders` | 1 | O2 | ID/FI | T | — | §7.3 |
| COL-PER-05 | `accounts` | 1 | O2 | OP/CT | T | — | §7.4 |
| COL-PER-06 | `addresses` | 1 | O2 | UB/CT | T | — | §7.5 |
| COL-PER-07 | `addressGeoEvents` | 1 | O2 | UB | T | — | §7.6 |
| COL-PER-08 | `premises` | 1 | O2 | UB | T | — | §7.7 |
| COL-PER-09 | `servicePoints` | 1 | O2 | UB | T | — | §7.8 |
| COL-PER-10 | `relationships` | 1 | O2 | ID | T | — | §7.9 |
| COL-PER-12 | `notes` | 1 | O2 | OP | T | — | §7.11 |
| COL-PER-13 | `blocks` | 1 | O2 | OP | T | — | §7.12 |
| COL-PER-14 | `documentRequirementTypes` | 1 | O2 | CF | T | — | §7.13 |
| COL-PER-15 | `documentSubmissions` | 1 | O2 | ID | T | — | §7.13 |
| COL-PER-16 | `transfers` | 1 | O2 | ID/FI | T | — | §7.14 |
| COL-PER-17 | `duplicateCases` | 1 | O2 | ID | T | — | §7.15 |
| COL-PER-18 | `perRevisions` | 1 | O2 | ID | T | — | §7.16 |

## 3. Diagrama 1: Personas, titulares, cuentas, domicilios e inmuebles

17 colecciones (ver tabla de la sección 2). Ficha en el anexo: §7.1, §7.1.1, §7.2, §7.3, §7.4, §7.5, §7.6, §7.7 ….

```mermaid
erDiagram
  persons {
    ObjectId id PK "_id"
    enum personType
    string lastName
    string firstNames
    string legalName
    string tradeName
    enum organizationType
    Date incorporationDate
    string displayName
    object[] searchKeys
    enum registeredSex
    Date birthDate
    Date deathDate
    object deathRecord
    ObjectId maritalStatusId FK "T04 enumerationItems"
    ObjectId occupationId FK "T04 enumerationItems"
    ObjectId nationalityCountryId FK "T04 countries"
    Date personRegistrationDate
    array identifiers
    object identifierException
    array contacts
    array addresses
    object[] fiscalProfile
    object workInfo
    object[] professional
    array communicationPreferences
    object extra
    enum status
    ObjectId mergedIntoPersonId FK "→ persons"
    Date anonymizedAt
  }
  personIdentifierIndex {
    ObjectId id PK "_id"
    ObjectId documentTypeId FK, UK "T04 identityDocumentTypes; UK {documentTypeId, number, exceptionId}"
    string number UK "UK {documentTypeId, number, exceptionId}"
    ObjectId personId FK "→ persons"
    ObjectId exceptionId FK, UK "T11 approvalRequests; UK {documentTypeId, number, exceptionId}"
  }
  personSensitiveData {
    ObjectId id PK "_id"
    ObjectId personId FK, UK "→ persons"
    enum category
    object data
    ObjectId evidenceDocumentId FK "T11 documents"
    Date validFrom
    Date validTo
    ObjectId consentId FK "T08 consentRecords"
    any accessLog
  }
  holders {
    ObjectId id PK "_id"
    ObjectId personId FK "→ persons"
    string holderNumber UK
    string numberSeries
    enum status
    Date openedAt
    Date closedAt
    ObjectId closeReasonId FK "T04 enumerationItems"
    string closeReasonDetail
    bool keepNumberOnClose
    array periods
    object membership
    object indicators
    ObjectId principalAccountId FK "→ accounts"
    object extra
  }
  accounts {
    ObjectId id PK "_id"
    ObjectId holderId FK, UK "→ holders; UK {holderId, isPrincipal} parcial"
    string accountNumber UK
    string description
    bool isPrincipal UK "UK {holderId, isPrincipal} parcial"
    enum status
    Date openedAt
    Date closedAt
    string closeReason
    ObjectId postalAddressId FK "→ addresses"
    string deliveryTo
    ObjectId postalCompanyId FK "M05 postalCarriers"
    object deliveryRoute
    ObjectId districtSectionId FK "T04 cadastralDistricts"
    ObjectId accountingGroupId FK "M07 collectionAccountingGroups"
    string setCode
    object fiscal
    array contacts
    object invoiceDelivery
    object autoDebit
    object billingFlags
    string fileNumber
    object structureSummary
    object extra
  }
  addresses {
    ObjectId id PK "_id"
    ObjectId countryId FK "T04 countries"
    ObjectId provinceId FK "T04 provinces"
    ObjectId departmentId FK "T04 departments"
    ObjectId localityId FK "T04 localities"
    string postalCode
    ObjectId streetId FK "T04 streets"
    string streetNameRaw
    string number
    bool noNumber
    string floor
    string unit
    string building
    string tower
    string block
    ObjectId neighborhoodId FK "T04 neighborhoods"
    array betweenStreets
    string accessReferences
    object rural
    string originalText
    string normalizedText
    object normalization
    object geo
    ObjectId streetRequestId FK "destino no declarado"
  }
  addressGeoEvents {
    ObjectId id PK "_id"
    ObjectId addressId FK "→ addresses"
    enum eventType
    object before
    object after
    enum source
    ObjectId actorId FK "T02 memberships"
    string reason
    object relatedRef
    Date occurredAt
  }
  premises {
    ObjectId id PK "_id"
    string premisesCode UK
    ObjectId addressId FK "→ addresses"
    ObjectId ownerPostalAddressId FK "→ addresses"
    string deliveryTo
    string legacyAccountRef FK "→ accounts"
    object cadastre
    object cadastreExtra
    string taxParcelNumber
    Decimal128 construction
    Decimal128 surfaces
    Decimal128[] frontages
    Decimal128 cornerData
    Decimal128 coefficients
    Decimal128 networkMeters
    array units
    ObjectId usageId FK "T04 enumerationItems"
    ObjectId stateId FK "T04 enumerationItems"
    array items
    string gisRef
    array observations
    object legacyAttributes
    any registrationAudit
    object extra
    enum status
  }
  servicePoints {
    ObjectId id PK "_id"
    string code UK
    ObjectId addressId FK "→ addresses"
    ObjectId premiseId FK "→ premises"
    ObjectId unitId
    string accessNotes
    string gisRef
    enum status
    int contractCount
  }
  relationships {
    ObjectId id PK "_id"
    ObjectId relationshipTypeId FK, UK "T04 enumerationItems; UK {subjectPersonId, target.type, target.id, rel"
    enum category
    ObjectId subjectPersonId FK, UK "→ persons; UK {subjectPersonId, target.type, target.id, relationshipTy"
    object target
    array scopeActions
    Date validFrom UK "UK {subjectPersonId, target.type, target.id, relationshipTypeId, valid"
    Date validTo
    enum status
    ObjectId[] evidenceDocumentIds FK "T11 documents"
    object verification
    object revocation
    enum origin
    string notes
  }
  notes {
    ObjectId id PK "_id"
    object subjectRef "referencia polimórfica"
    string noteNumber
    Date noteDate
    string title
    string text
    ObjectId noteTypeId FK "T04 enumerationItems"
    enum visibility
    bool isSystem
    string systemEvent
    bool pinned
    array revisions
    object deletion
    bool legacyBlockFlag
  }
  blocks {
    ObjectId id PK "_id"
    object subjectRef UK "referencia polimórfica; UK {subjectRef, holdReasonId, status} parcial"
    array effects
    enum effectMode
    ObjectId holdReasonId FK, UK "M08 holdReasons; UK {subjectRef, holdReasonId, status} parcial"
    string detail
    string cashierMessage
    string portalMessage
    Date validFrom
    Date validTo
    enum status UK "UK {subjectRef, holdReasonId, status} parcial"
    ObjectId appliedBy FK "T02 memberships"
    Date appliedAt
    object lift
    object sourceRef "referencia polimórfica"
  }
  documentRequirementTypes {
    ObjectId id PK "_id"
    string code UK
    string name
    any appliesTo
    int validityDays
    ObjectId templateId FK "T11 documentTemplates"
    bool isDefault
    array items
    any requiredFor
    any actionsOnSubmit
    any actionsOnExpiry
    bool publishedOnPortal
    enum status
  }
  documentSubmissions {
    ObjectId id PK "_id"
    ObjectId requirementTypeId FK "→ documentRequirementTypes (inferido)"
    object target
    Date submissionDate
    Date expiresAt
    bool presented
    enum status
    ObjectId[] documentIds FK "T11 documents"
    string observations
    any actionsExecuted
  }
  transfers {
    ObjectId id PK "_id"
    string number UK
    enum type
    object origin
    object destination
    array items
    Date effectiveDate
    object options
    Decimal128[] simulation
    enum status
    object approval
    object execution
    object reversal
    string observations
    ObjectId[] evidenceDocumentIds FK "T11 documents"
    ObjectId certificateDocumentId FK "T11 documents"
  }
  duplicateCases {
    ObjectId id PK "_id"
    ObjectId[] personIds FK "→ persons"
    int score
    any matchedOn
    enum detectedBy
    enum status
    object decision
    object merge
  }
  perRevisions {
    ObjectId id PK "_id"
    enum entityType UK "UK {entityType, entityId, revision}"
    ObjectId entityId UK "referencia polimórfica según entityType; UK {entityType, entityId, rev"
    int revision UK "UK {entityType, entityId, revision}"
    Date validFrom
    Date validTo
    Date recordedAt
    ObjectId recordedBy FK "T02 memberships"
    enum source
    string reason
    array changedFields
    object snapshot
    object onBehalfOf
  }
  persons |o--o{ persons : "mergedIntoPersonId"
  persons ||--o{ personIdentifierIndex : "personId"
  persons ||--o| personSensitiveData : "personId"
  persons ||--o{ holders : "personId"
  accounts ||--o{ holders : "principalAccountId"
  holders ||--o{ accounts : "holderId"
  addresses ||--o{ accounts : "postalAddressId"
  addresses ||--o{ addressGeoEvents : "addressId"
  addresses ||--o{ premises : "addressId"
  addresses |o--o{ premises : "ownerPostalAddressId"
  accounts |o--o{ premises : "legacyAccountRef"
  addresses ||--o{ servicePoints : "addressId"
  premises ||--o{ servicePoints : "premiseId"
  persons ||--o{ relationships : "subjectPersonId"
  documentRequirementTypes ||--o{ documentSubmissions : "requirementTypeId"
  persons }o--o{ duplicateCases : "personIds"
```

**Índices principales del diagrama 1**

| Colección | Índices declarados en el anexo | Únicos mínimos (T05) |
|---|---|---|
| `persons` | — | — (ver COL-PER-02) |
| `personIdentifierIndex` | — | `{documentTypeId, number, exceptionId}` |
| `personSensitiveData` | `{ tenantId, personId, category }`. | `personId` |
| `holders` | `{ tenantId, holderNumber }` único; `{ tenantId, personId }` único parcial sobre `status ≠ closed` (una titularidad abierta por persona; ver CTR-PER-01); `{ tenantId, status }`; `{ tenantId, "legacy.table", "legacy.key" … | `holderNumber` (DEC-017) |
| `accounts` | `{ tenantId, accountNumber }` único; `{ tenantId, holderId, status }`; `{ tenantId, holderId, isPrincipal }` único parcial sobre `isPrincipal = true AND status = active` (garantiza una principal); `{ tenantId, … | `accountNumber`; `{holderId, isPrincipal: true}` p. |
| `addresses` | `{ tenantId, localityId, streetId, number }`; `{ tenantId, "geo.status" }`; geoespacial 2dsphere `{ tenantId, geoPoint }` (campo derivado GeoJSON); `{ tenantId, normalizedText }` texto. | — |
| `addressGeoEvents` | `{ tenantId, addressId, occurredAt }`. | — |
| `premises` | `{ tenantId, "cadastre.normalizedKey" }` único parcial sobre `status = active` (RN-PER-073); `{ tenantId, taxParcelNumber }`; `{ tenantId, addressId }`; `{ tenantId, premisesCode }` único. | `{cadastre.normalizedKey}` p. (`status = active`, RN-PER-073); `premisesCode` () |
| `servicePoints` | `{ tenantId, addressId }`; `{ tenantId, premiseId }`; `{ tenantId, code }` único. No hay índice único por dirección + servicio (RN-PER-060). | `code` |
| `relationships` | `{ tenantId, subjectPersonId, status }`; `{ tenantId, "target.type", "target.id", status }`; `{ tenantId, validTo, status }` (vencimientos). | `{subjectPersonId, target.type, target.id, relationshipTypeId, validFrom}` () |
| `notes` | `{ tenantId, "subjectRef.type", "subjectRef.id", noteDate }`; `{ tenantId, noteNumber }` único. | — |
| `blocks` | `{ tenantId, "subjectRef.type", "subjectRef.id", status }`; `{ tenantId, effects, status }`; `{ tenantId, validTo, status }`. | `{subjectRef, holdReasonId, status: active}` p. |
| `documentRequirementTypes` | — | `code` |
| `documentSubmissions` | `{ tenantId, "target.type", "target.id", requirementTypeId, status }`; `{ tenantId, expiresAt, status }`. | — |
| `transfers` | `{ tenantId, number }` único; `{ tenantId, "origin.holderId" }`; `{ tenantId, "destination.holderId" }`; `{ tenantId, status }`; `{ tenantId, "execution.idempotencyKey" }` único parcial. | `number` |
| `duplicateCases` | `{ tenantId, personIds }` único; `{ tenantId, status, score }`. | — |
| `perRevisions` | `{ tenantId, entityType, entityId, revision }` único; `{ tenantId, entityType, entityId, validFrom }`; `{ tenantId, entityType, entityId, recordedAt }`. | `{entityType, entityId, revision}` () |

## 4. Relaciones con otros módulos y entre diagramas

Referencias que salen de una colección de este módulo hacia una entidad de otro módulo o de otro diagrama del mismo módulo (no se dibujan para mantener cada diagrama dentro de su módulo y subdominio).

| Colección origen | Campo | Cardinalidad (destino a origen) | Destino | COL-ID destino | Módulo destino |
|---|---|---|---|---|---|
| `persons` | `maritalStatusId`, `occupationId` | 0..1 a N | `enumerationItems` | COL-CFG-06 | T04 |
| `persons` | `nationalityCountryId` | 0..1 a N | `countries` | COL-CFG-07 | T04 |
| `personIdentifierIndex` | `documentTypeId` | 1 a N | `identityDocumentTypes` | COL-CFG-28 | T04 |
| `personIdentifierIndex` | `exceptionId` | 0..1 a N | `approvalRequests` | COL-WFL-24 | T11 |
| `personSensitiveData` | `evidenceDocumentId` | 0..1 a N | `documents` | COL-WFL-34 | T11 |
| `personSensitiveData` | `consentId` | 1 a N | `consentRecords` | COL-NFR-04 | T08 |
| `holders` | `closeReasonId` | 1 a N | `enumerationItems` | COL-CFG-06 | T04 |
| `accounts` | `postalCompanyId` | 1 a N | `postalCarriers` | COL-FAC-41 | M05 |
| `accounts` | `districtSectionId` | 1 a N | `cadastralDistricts` | COL-CFG-17 | T04 |
| `accounts` | `accountingGroupId` | 1 a N | `collectionAccountingGroups` | COL-COB-47 | M07 |
| `addresses` | `countryId` | 1 a N | `countries` | COL-CFG-07 | T04 |
| `addresses` | `provinceId` | 1 a N | `provinces` | COL-CFG-08 | T04 |
| `addresses` | `departmentId` | 1 a N | `departments` | COL-CFG-09 | T04 |
| `addresses` | `localityId` | 1 a N | `localities` | COL-CFG-10 | T04 |
| `addresses` | `streetId` | 0..1 a N | `streets` | COL-CFG-12 | T04 |
| `addresses` | `neighborhoodId` | 0..1 a N | `neighborhoods` | COL-CFG-15 | T04 |
| `addressGeoEvents` | `actorId` | 0..1 a N | `memberships` | COL-IAM-04 | T02 |
| `premises` | `usageId`, `stateId` | 0..1 a N | `enumerationItems` | COL-CFG-06 | T04 |
| `relationships` | `relationshipTypeId` | 1 a N | `enumerationItems` | COL-CFG-06 | T04 |
| `relationships` | `evidenceDocumentIds` | N a N | `documents` | COL-WFL-34 | T11 |
| `notes` | `noteTypeId` | 0..1 a N | `enumerationItems` | COL-CFG-06 | T04 |
| `blocks` | `holdReasonId` | 1 a N | `holdReasons` | COL-MOR-11 | M08 |
| `blocks` | `appliedBy` | 1 a N | `memberships` | COL-IAM-04 | T02 |
| `documentRequirementTypes` | `templateId` | 0..1 a N | `documentTemplates` | COL-WFL-41 | T11 |
| `documentSubmissions` | `documentIds` | N a N | `documents` | COL-WFL-34 | T11 |
| `transfers` | `evidenceDocumentIds` | N a N | `documents` | COL-WFL-34 | T11 |
| `transfers` | `certificateDocumentId` | 0..1 a N | `documents` | COL-WFL-34 | T11 |
| `perRevisions` | `recordedBy` | 1 a N | `memberships` | COL-IAM-04 | T02 |

## 5. Colecciones absorbidas y renombradas

| COL-ID | Colección declarada | Destino (no se crea) | Detalle en T05 |
|---|---|---|---|
| COL-PER-11 | `adherents` | `serviceDependents` (COL-SOC-01, M18) | (adherentes y beneficiarios: DEC-071; `ADHSOC` → COL-SOC-01 y `BENSOC` → COL-SOC-02, DEC-086. **Reemplaza** el destino único anterior "A→COL-SOC-01") |
| COL-PER-19 | `consents` | `consentRecords` (COL-NFR-04, T08) | (duplicada con T08) |
| COL-PER-20 | `dataSubjectRequests` | `dataSubjectRequests` (COL-NFR-05, T08) | (duplicada con T08) |
| COL-PER-21 | `personUserLinks` | `memberships` (COL-IAM-04, T02) | (vínculo persona–usuario: `memberships.personId` + evidencia) |

## 6. Observaciones e inconsistencias detectadas

- Referencias sin colección destino declarada (ni en el anexo ni en T05 §7.2 y §7.2.1; quedan como `FK` "destino no declarado"): `addresses.streetRequestId`.
