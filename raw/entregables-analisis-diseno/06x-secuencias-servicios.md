# GoodApps Cooperativas — Diagramas de secuencia de servicios internos, parte X

**Entregable de análisis y diseño — Artefacto 7.3 (diagramas de secuencia), servicios internos síncronos**

| Campo | Valor |
|---|---|
| Documento | `06x-secuencias-servicios.md` |
| Índice del entregable | [`06-secuencias-y-estados.md`](06-secuencias-y-estados.md) (sección 7) y [`06a-indice-cobertura-secuencias-estados.md`](06a-indice-cobertura-secuencias-estados.md) |
| Versión | 1.0 |
| Fecha | 05-11-2026 |
| Estado | Borrador para revisión |
| Fuentes | §11 (servicios internos) de los anexos |
| Generación | Script `_trabajo/gen06_build.py` (extrae de los anexos; revisión manual posterior) |

## 1. Cómo leer esta parte

La sección 2 agrupa por módulo proveedor los servicios internos síncronos (`<mod>.service.<nombre>` y las llamadas de aplicación declaradas en el §11 de cada anexo, por ejemplo `per.getHolderSnapshot`). Son llamadas dentro del monolito modular: no pasan por la outbox y devuelven el resultado en la misma petición (maestra §5.3, ARQ-01). Las integraciones externas (fichas FI-INT de T06) están en [`06y-secuencias-integraciones-fi-int.md`](06y-secuencias-integraciones-fi-int.md) y [`06z-secuencias-integraciones-fi-int-2.md`](06z-secuencias-integraciones-fi-int-2.md).

## 2. Servicios internos síncronos

### SEC-SVC-01 — Servicios internos síncronos de M01 PER

**Cubre:** `per.checkAuthorization`, `per.checkBlocks`, `per.getHolderSnapshot`, `per.getNotificationTarget`, `per.matchIdentifiers`, `per.personas.findByDocument`, `per.resolveServicePoint`.

```mermaid
sequenceDiagram
    autonumber
    participant PT02 as T02 IAM
    participant PM02 as M02 CAT
    participant PT09 as T09 COM
    participant PM06 as M06 FIS
    participant PM01 as M01 PER (proveedor)
    PT02->>PM01: per.checkAuthorization
    PM01-->>PT02: resultado síncrono en la misma petición
    Note over PM01: También lo invocan M07, M09, M19
    PM02->>PM01: per.checkBlocks
    PM01-->>PM02: resultado síncrono en la misma petición
    Note over PM01: También lo invocan M05, M07, M08, M19
    PM02->>PM01: per.getHolderSnapshot
    PM01-->>PM02: resultado síncrono en la misma petición
    Note over PM01: También lo invocan M05, M06, M07, M09
    PT09->>PM01: per.getNotificationTarget
    PM01-->>PT09: resultado síncrono en la misma petición
    PM06->>PM01: per.matchIdentifiers
    PM01-->>PM06: resultado síncrono en la misma petición
    Note over PM01: También lo invocan M17, T09
    PT02->>PM01: per.personas.findByDocument
    PM01-->>PT02: resultado síncrono en la misma petición
    PM02->>PM01: per.resolveServicePoint
    PM01-->>PM02: resultado síncrono en la misma petición
```

| Servicio | Invocado por | Citas en la especificación |
|---|---|---|
| `per.checkAuthorization` | T02, M07, M09, M19 | M01 L1582 |
| `per.checkBlocks` | M02, M05, M07, M08, M19 | M01 L1581 |
| `per.getHolderSnapshot` | M02, M05, M06, M07, M09 | M01 L1580 |
| `per.getNotificationTarget` | T09 | M01 L1585 |
| `per.matchIdentifiers` | M06, M17, T09 | M01 L1584 |
| `per.personas.findByDocument` | T02 | T02 L3962 |
| `per.resolveServicePoint` | M02 | M01 L1583 |

### SEC-SVC-02 — Servicios internos síncronos de M02 CAT

**Cubre:** `cat.services.mainServiceForMembership`.

```mermaid
sequenceDiagram
    autonumber
    participant GEN as Consumidores no declarados
    participant PM02 as M02 CAT (proveedor)
    GEN->>PM02: cat.services.mainServiceForMembership
    PM02-->>GEN: resultado síncrono en la misma petición
```

| Servicio | Invocado por | Citas en la especificación |
|---|---|---|
| `cat.services.mainServiceForMembership` | No declarado | M02 L1676 |

### SEC-SVC-03 — Servicios internos síncronos de M04 TAR

**Cubre:** `tar.calculate`, `tar.getRatedCalls`, `tar.quote`, `tar.rateCalls`.

```mermaid
sequenceDiagram
    autonumber
    participant PM05 as M05 FAC
    participant PM19 as M19 POR
    participant PM09 as M09 CRM
    participant PM10 as M10 TEC
    participant PM04 as M04 TAR (proveedor)
    PM05->>PM04: tar.calculate
    PM04-->>PM05: resultado síncrono en la misma petición
    Note over PM04: También lo invocan M09, M19
    PM19->>PM04: tar.getRatedCalls
    PM04-->>PM19: resultado síncrono en la misma petición
    Note over PM04: También lo invocan M09, M10, T05, T08
    PM09->>PM04: tar.quote
    PM04-->>PM09: resultado síncrono en la misma petición
    Note over PM04: También lo invocan M11, M13, M19
    PM10->>PM04: tar.rateCalls
    PM04-->>PM10: resultado síncrono en la misma petición
```

| Servicio | Invocado por | Citas en la especificación |
|---|---|---|
| `tar.calculate` | M05, M09, M19 | M04 L1884, M05 L45 |
| `tar.getRatedCalls` | M19, M09, M10, T05, T08 | M04 L1887 |
| `tar.quote` | M09, M11, M13, M19 | M04 L1886 |
| `tar.rateCalls` | M10 | M04 L1885 |

### SEC-SVC-04 — Servicios internos síncronos de M05 FAC

**Cubre:** `fac.service.cancelBillableItem`, `fac.service.getInvoiceForPayment`, `fac.service.isPeriodBilled`, `fac.service.issueInvoice`, `fac.service.nextNumber`, `fac.service.reserveNumberRange`, `fac.service.resolveVoucher`, `fac.service.upsertBillableItem`, `fac.services.billAlone`.

```mermaid
sequenceDiagram
    autonumber
    participant PM07 as M07 COB
    participant PM02 as M02 CAT
    participant GEN as Consumidores no declarados
    participant PM05 as M05 FAC (proveedor)
    PM07->>PM05: fac.service.cancelBillableItem
    PM05-->>PM07: resultado síncrono en la misma petición
    Note over PM05: También lo invocan M19, M03, M04, M11, M08, M10, M13, M18, T11, M09
    PM07->>PM05: fac.service.getInvoiceForPayment
    PM05-->>PM07: resultado síncrono en la misma petición
    Note over PM05: También lo invocan M19, M03, M04, M11, M08, M10, M13, M18
    PM07->>PM05: fac.service.isPeriodBilled
    PM05-->>PM07: resultado síncrono en la misma petición
    Note over PM05: También lo invocan M19, M03, M04, M11, M08, M10, M13, M18, T06
    PM07->>PM05: fac.service.issueInvoice
    PM05-->>PM07: resultado síncrono en la misma petición
    Note over PM05: También lo invocan M19, M03, M04, M11, M08, M10, M13, M18
    PM07->>PM05: fac.service.nextNumber
    PM05-->>PM07: resultado síncrono en la misma petición
    Note over PM05: También lo invocan T05, M19, M03, M04, M11, M08, M10, M13, M18, T04
    PM07->>PM05: fac.service.reserveNumberRange
    PM05-->>PM07: resultado síncrono en la misma petición
    Note over PM05: También lo invocan M19, M03, M04, M11, M08, M10, M13, M18
    PM07->>PM05: fac.service.resolveVoucher
    PM05-->>PM07: resultado síncrono en la misma petición
    Note over PM05: También lo invocan M19, M03, M04, M11, M08, M10, M13, M18
    PM02->>PM05: fac.service.upsertBillableItem
    PM05-->>PM02: resultado síncrono en la misma petición
    Note over PM05: También lo invocan M08, M04, M13, M06, M18, T05, T06, M10, M07, M19, M03, M11, T11, M09, M15, M01, M16
    GEN->>PM05: fac.services.billAlone
    PM05-->>GEN: resultado síncrono en la misma petición
```

| Servicio | Invocado por | Citas en la especificación |
|---|---|---|
| `fac.service.cancelBillableItem` | M07, M19, M03, M04, M11, M08, M10, M13, M18, T11, M09 | M05 L1911, M10 L241, M11 L687, M11 L689, M11 L1042, T11 L2553 |
| `fac.service.getInvoiceForPayment` | M07, M19, M03, M04, M11, M08, M10, M13, M18 | M05 L1911 |
| `fac.service.isPeriodBilled` | M07, M19, M03, M04, M11, M08, M10, M13, M18, T06 | M05 L1911, M10 L989, M10 L2113 |
| `fac.service.issueInvoice` | M07, M19, M03, M04, M11, M08, M10, M13, M18 | M05 L1911 |
| `fac.service.nextNumber` | M07, T05, M19, M03, M04, M11, M08, M10, M13, M18, T04 | M05 L338, M05 L1911, M05 L2220, M07 L269, M07 L790, M07 L2098 |
| `fac.service.reserveNumberRange` | M07, M19, M03, M04, M11, M08, M10, M13, M18 | M05 L1911 |
| `fac.service.resolveVoucher` | M07, M19, M03, M04, M11, M08, M10, M13, M18 | M05 L1911 |
| `fac.service.upsertBillableItem` | M02, M08, M04, M13, M06, M18, T05, T06, M10, M07, M19, M03, M11, T11, M09, M15, M01, M16 | M04 L279, M04 L641, M04 L643, M04 L644, M04 L1371, M04 L1936 |
| `fac.services.billAlone` | No declarado | M05 L2050 |

### SEC-SVC-05 — Servicios internos síncronos de M06 FIS

**Cubre:** `fis.service.calculateTaxes`, `fis.service.calculateWithholdings`, `fis.service.cancelWithholdings`, `fis.service.checkRegistryCoverage`, `fis.service.confirmWithholdings`, `fis.service.resolveDocumentClass`.

```mermaid
sequenceDiagram
    autonumber
    participant PM04 as M04 TAR
    participant PM12 as M12 CMP
    participant PM05 as M05 FAC
    participant PM06 as M06 FIS (proveedor)
    PM04->>PM06: fis.service.calculateTaxes
    PM06-->>PM04: resultado síncrono en la misma petición
    Note over PM06: También lo invocan M18, M05, M11, M07, T11, T05, M12, M14, T02, M10
    PM12->>PM06: fis.service.calculateWithholdings
    PM06-->>PM12: resultado síncrono en la misma petición
    Note over PM06: También lo invocan M14, T11, T05, M04, T02, M05, M10
    PM12->>PM06: fis.service.cancelWithholdings
    PM06-->>PM12: resultado síncrono en la misma petición
    Note over PM06: También lo invocan M14, T02
    PM05->>PM06: fis.service.checkRegistryCoverage
    PM06-->>PM05: resultado síncrono en la misma petición
    Note over PM06: También lo invocan M12, M14, T02, M10
    PM12->>PM06: fis.service.confirmWithholdings
    PM06-->>PM12: resultado síncrono en la misma petición
    Note over PM06: También lo invocan M14, T02
    PM05->>PM06: fis.service.resolveDocumentClass
    PM06-->>PM05: resultado síncrono en la misma petición
    Note over PM06: También lo invocan M11, M12, M14, T02, M10
```

| Servicio | Invocado por | Citas en la especificación |
|---|---|---|
| `fis.service.calculateTaxes` | M04, M18, M05, M11, M07, T11, T05, M12, M14, T02, M10 | M04 L532, M04 L1259, M04 L1540, M04 L2596, M04 L2598, M06 L1689 |
| `fis.service.calculateWithholdings` | M12, M14, T11, T05, M04, T02, M05, M10 | M06 L1624, M06 L1707, M06 L1879, M06 L1923, M06 L2176, M06 L2659 |
| `fis.service.cancelWithholdings` | M12, M14, T02 | M06 L1881, M06 L1921, M14 L50, M14 L2560, T02 L1662 |
| `fis.service.checkRegistryCoverage` | M05, M12, M14, T02, M10 | M06 L1705, M06 L1874, M06 L1919, T02 L1662, T02 L4827 |
| `fis.service.confirmWithholdings` | M12, M14, T02 | M06 L1880, M06 L1920, M14 L50, M14 L2560, T02 L1662 |
| `fis.service.resolveDocumentClass` | M05, M11, M12, M14, T02, M10 | M06 L1871, M06 L1918, T02 L1662, T02 L4827 |

### SEC-SVC-06 — Servicios internos síncronos de M08 MOR

**Cubre:** `mor.interestEngine.dueDateSchedule`, `mor.service.applyHold`, `mor.service.computeDueDateSurcharge`, `mor.service.releaseHold`, `mor.surcharge.quote`.

```mermaid
sequenceDiagram
    autonumber
    participant PM05 as M05 FAC
    participant PM06 as M06 FIS
    participant PM07 as M07 COB
    participant PM08 as M08 MOR (proveedor)
    PM05->>PM08: mor.interestEngine.dueDateSchedule
    PM08-->>PM05: resultado síncrono en la misma petición
    PM05->>PM08: mor.service.applyHold
    PM08-->>PM05: resultado síncrono en la misma petición
    Note over PM08: También lo invocan T05, M07
    PM06->>PM08: mor.service.computeDueDateSurcharge
    PM08-->>PM06: resultado síncrono en la misma petición
    Note over PM08: También lo invocan M05, T05
    PM05->>PM08: mor.service.releaseHold
    PM08-->>PM05: resultado síncrono en la misma petición
    Note over PM08: También lo invocan T05, M07
    PM07->>PM08: mor.surcharge.quote
    PM08-->>PM07: resultado síncrono en la misma petición
```

| Servicio | Invocado por | Citas en la especificación |
|---|---|---|
| `mor.interestEngine.dueDateSchedule` | M05 | M08 L1921 |
| `mor.service.applyHold` | M05, T05, M07 | M05 L1916, M08 L825 |
| `mor.service.computeDueDateSurcharge` | M06, M05, T05 | M05 L1915, M08 L779 |
| `mor.service.releaseHold` | M05, T05, M07 | M05 L1916, M08 L825 |
| `mor.surcharge.quote` | M07 | M07 L49 |

### SEC-SVC-07 — Servicios internos síncronos de M09 CRM

**Cubre:** `crm.openCase`.

```mermaid
sequenceDiagram
    autonumber
    participant PM19 as M19 POR
    participant PM09 as M09 CRM (proveedor)
    PM19->>PM09: crm.openCase
    PM09-->>PM19: resultado síncrono en la misma petición
```

| Servicio | Invocado por | Citas en la especificación |
|---|---|---|
| `crm.openCase` | M19 | M19 L1009 |

### SEC-SVC-08 — Servicios internos síncronos de M10 TEC

**Cubre:** `tec.getQuotaUsage`.

```mermaid
sequenceDiagram
    autonumber
    participant PM02 as M02 CAT
    participant PM10 as M10 TEC (proveedor)
    PM02->>PM10: tec.getQuotaUsage
    PM10-->>PM02: resultado síncrono en la misma petición
    Note over PM10: También lo invocan T06, T09, M04
```

| Servicio | Invocado por | Citas en la especificación |
|---|---|---|
| `tec.getQuotaUsage` | M02, T06, T09, M04 | M04 L646 |

### SEC-SVC-09 — Servicios internos síncronos de M13 STK

**Cubre:** `stk.services.noCommercialStock`.

```mermaid
sequenceDiagram
    autonumber
    participant PM02 as M02 CAT
    participant PM13 as M13 STK (proveedor)
    PM02->>PM13: stk.services.noCommercialStock
    PM13-->>PM02: resultado síncrono en la misma petición
    Note over PM13: También lo invocan M11
```

| Servicio | Invocado por | Citas en la especificación |
|---|---|---|
| `stk.services.noCommercialStock` | M02, M11 | M13 L1937 |

### SEC-SVC-10 — Servicios internos síncronos de M14 TES

**Cubre:** `tes.registerReceivedInstrument`.

```mermaid
sequenceDiagram
    autonumber
    participant PM07 as M07 COB
    participant PM14 as M14 TES (proveedor)
    PM07->>PM14: tes.registerReceivedInstrument
    PM14-->>PM07: resultado síncrono en la misma petición
    Note over PM14: También lo invocan M12, M06, M16, M15
```

| Servicio | Invocado por | Citas en la especificación |
|---|---|---|
| `tes.registerReceivedInstrument` | M07, M12, M06, M16, M15 | M14 L1912 |

### SEC-SVC-11 — Servicios internos síncronos de M17 INS

**Cubre:** `ins.service.requiresActiveMembership`.

```mermaid
sequenceDiagram
    autonumber
    participant PM02 as M02 CAT
    participant PM17 as M17 INS (proveedor)
    PM02->>PM17: ins.service.requiresActiveMembership
    PM17-->>PM02: resultado síncrono en la misma petición
```

| Servicio | Invocado por | Citas en la especificación |
|---|---|---|
| `ins.service.requiresActiveMembership` | M02 | M17 L1511 |

### SEC-SVC-12 — Servicios internos síncronos de T02 IAM

**Cubre:** `iam.services.inviteTenantAdmin`.

```mermaid
sequenceDiagram
    autonumber
    participant PT01 as T01 PLA
    participant PT02 as T02 IAM (proveedor)
    PT01->>PT02: iam.services.inviteTenantAdmin
    PT02-->>PT01: resultado síncrono en la misma petición
```

| Servicio | Invocado por | Citas en la especificación |
|---|---|---|
| `iam.services.inviteTenantAdmin` | T01 | T01 L78 |

### SEC-SVC-13 — Servicios internos síncronos de T03 UXD

**Cubre:** `uxd.services.applyBrandingProposal`.

```mermaid
sequenceDiagram
    autonumber
    participant PT01 as T01 PLA
    participant PT03 as T03 UXD (proveedor)
    PT01->>PT03: uxd.services.applyBrandingProposal
    PT03-->>PT01: resultado síncrono en la misma petición
```

| Servicio | Invocado por | Citas en la especificación |
|---|---|---|
| `uxd.services.applyBrandingProposal` | T01 | T01 L81 |

### SEC-SVC-14 — Servicios internos síncronos de T04 CFG

**Cubre:** `cfg.services.exportPackage`.

```mermaid
sequenceDiagram
    autonumber
    participant PT01 as T01 PLA
    participant PT04 as T04 CFG (proveedor)
    PT01->>PT04: cfg.services.exportPackage
    PT04-->>PT01: resultado síncrono en la misma petición
```

| Servicio | Invocado por | Citas en la especificación |
|---|---|---|
| `cfg.services.exportPackage` | T01 | T01 L82 |

### SEC-SVC-15 — Servicios internos síncronos de T09 COM

**Cubre:** `com.notify`, `com.services.notify`.

```mermaid
sequenceDiagram
    autonumber
    participant PT11 as T11 WFL
    participant PT01 as T01 PLA
    participant PT09 as T09 COM (proveedor)
    PT11->>PT09: com.notify
    PT09-->>PT11: resultado síncrono en la misma petición
    Note over PT09: También lo invocan T01
    PT01->>PT09: com.services.notify
    PT09-->>PT01: resultado síncrono en la misma petición
    Note over PT09: También lo invocan T11
```

| Servicio | Invocado por | Citas en la especificación |
|---|---|---|
| `com.notify` | T11, T01 | T09 L2510, T11 L4148, T11 L4149 |
| `com.services.notify` | T01, T11 | T01 L88, T09 L2508, T09 L2510 |

### SEC-SVC-16 — Servicios internos síncronos de T11 WFL

**Cubre:** `wfl.documents.attach`, `wfl.dossier.timeline`, `wfl.events.define`, `wfl.numbering.next`, `wfl.operations.registerHandler`, `wfl.operations.request`, `wfl.services.requestApproval`, `wfl.signatures.request`, `wfl.tasks.create`, `wfl.templates.render`, `wfl.workflow.start`.

```mermaid
sequenceDiagram
    autonumber
    participant GEN as Consumidores no declarados
    participant PT01 as T01 PLA
    participant PT11 as T11 WFL (proveedor)
    GEN->>PT11: wfl.documents.attach
    PT11-->>GEN: resultado síncrono en la misma petición
    GEN->>PT11: wfl.dossier.timeline
    PT11-->>GEN: resultado síncrono en la misma petición
    GEN->>PT11: wfl.events.define
    PT11-->>GEN: resultado síncrono en la misma petición
    GEN->>PT11: wfl.numbering.next
    PT11-->>GEN: resultado síncrono en la misma petición
    GEN->>PT11: wfl.operations.registerHandler
    PT11-->>GEN: resultado síncrono en la misma petición
    GEN->>PT11: wfl.operations.request
    PT11-->>GEN: resultado síncrono en la misma petición
    PT01->>PT11: wfl.services.requestApproval
    PT11-->>PT01: resultado síncrono en la misma petición
    GEN->>PT11: wfl.signatures.request
    PT11-->>GEN: resultado síncrono en la misma petición
    GEN->>PT11: wfl.tasks.create
    PT11-->>GEN: resultado síncrono en la misma petición
    GEN->>PT11: wfl.templates.render
    PT11-->>GEN: resultado síncrono en la misma petición
    GEN->>PT11: wfl.workflow.start
    PT11-->>GEN: resultado síncrono en la misma petición
```

| Servicio | Invocado por | Citas en la especificación |
|---|---|---|
| `wfl.documents.attach` | No declarado | T11 L79 |
| `wfl.dossier.timeline` | No declarado | T11 L83 |
| `wfl.events.define` | No declarado | T11 L72 |
| `wfl.numbering.next` | No declarado | T11 L81 |
| `wfl.operations.registerHandler` | No declarado | T11 L74 |
| `wfl.operations.request` | No declarado | T11 L73 |
| `wfl.services.requestApproval` | T01 | T01 L87, T11 L75, T11 L3709 |
| `wfl.signatures.request` | No declarado | T11 L82 |
| `wfl.tasks.create` | No declarado | T11 L78 |
| `wfl.templates.render` | No declarado | T11 L80 |
| `wfl.workflow.start` | No declarado | T11 L77 |
