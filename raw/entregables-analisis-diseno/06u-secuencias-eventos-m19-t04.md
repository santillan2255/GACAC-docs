# GoodApps Cooperativas — Diagramas de secuencia por eventos, parte U (M19-T04)

**Entregable de análisis y diseño — Artefacto 7.3 (diagramas de secuencia), ampliación a cobertura completa**

| Campo | Valor |
|---|---|
| Documento | `06u-secuencias-eventos-m19-t04.md` |
| Índice del entregable | [`06-secuencias-y-estados.md`](06-secuencias-y-estados.md) (sección 7) y [`06a-indice-cobertura-secuencias-estados.md`](06a-indice-cobertura-secuencias-estados.md) |
| Versión | 1.0 |
| Fecha | 05-11-2026 |
| Estado | Borrador para revisión |
| Fuentes | T11 §12.2 y §12.3 (catálogo de eventos y consumidores); §12 "Eventos consumidos" y §11 de los anexos M19, T01, T02, T03, T04 |
| Generación | Script `_trabajo/gen06_build.py` (extrae de los anexos; revisión manual posterior) |

## 1. Cómo leer esta parte

Cada diagrama representa un flujo de negocio entre módulos construido a partir del catálogo de eventos de T11 §12.3: un agregado del productor (por ejemplo, `cat.contract.*`) con sus hechos en orden de ID, o un grupo de hechos complementarios del mismo productor cuando el agregado tiene menos de tres eventos. Todos siguen el patrón transversal de `06-secuencias-y-estados.md` §2.2 (outbox en la misma transacción, relay, inbox por consumidor, reintentos y cola de errores), que no se repite en cada diagrama.

- **U** es el origen del hecho: usuario, API o job. Se citan las API y jobs que el anexo productor nombra junto al evento.
- **BUS** es la outbox con el relay y las colas BullMQ; cada consumidor recibe su propio job.
- `par` agrupa consumidores independientes del mismo evento. El texto del mensaje es el efecto que declara el consumidor en el §12 de su anexo; "consume EVT-…" indica que el consumidor figura en T11 pero no describe el efecto. **GEN** representa consumidores genéricos de T11 ("módulo dueño del tipo", "todos").
- Debajo de cada diagrama, la tabla lista los EVT que cubre, sus consumidores externos y los efectos declarados.

## M19 — POR Portal del socio y landing

### SEC-POR-01 — POR: Vínculo usuario del portal–cuenta

**Agregados:** `por.accountAccess.*`. **Productor:** M19 Portal del socio y landing (M19 §12; catálogo T11 §12.3).

**Cubre:** EVT-POR-01 `por.accountAccess.granted`, EVT-POR-02 `por.accountAccess.revoked`, EVT-POR-03 `por.accountAccess.expired`, EVT-POR-04 `por.accountAccess.suspended`.

Parte de estos hechos también aparece, con el detalle del caso de negocio, en A7 de `06-secuencias-y-estados.md` §3.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PM19 as M19 POR
    participant BUS as Outbox y colas (T01, T11)
    participant PT02 as T02 IAM
    participant PT09 as T09 COM
    participant PT10 as T10 BIA
    U->>PM19: Acción que origina el hecho
    PM19->>BUS: EVT-POR-01 por.accountAccess.granted
    par T02
        BUS->>PT02: consume EVT-POR-01
    and T09
        BUS->>PT09: Generar comunicaciones según catálogo. Los tipos sin evento ( soc.cem…
    and T10
        BUS->>PT10: consume EVT-POR-01
    end
    U->>PM19: Acción que origina el hecho
    PM19->>BUS: EVT-POR-02 por.accountAccess.revoked
    par T09
        BUS->>PT09: consume EVT-POR-02
    and T10
        BUS->>PT10: consume EVT-POR-02
    end
    U->>PM19: Acción que origina el hecho
    PM19->>BUS: EVT-POR-03 por.accountAccess.expired
    BUS->>PT09: consume EVT-POR-03
    U->>PM19: Acción que origina el hecho
    PM19->>BUS: EVT-POR-04 por.accountAccess.suspended
    BUS->>PT09: consume EVT-POR-04
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-POR-01 `por.accountAccess.granted` | T02, T09, T10 | T09: Generar comunicaciones según catálogo. Los tipos sin evento (`soc.cemeteryAct.scheduled`, `soc.loan.overdue`) entran por el comando `com.communications.emit` (§9.7). |
| EVT-POR-02 `por.accountAccess.revoked` | T09, T10 | No declarado en el §12 del consumidor |
| EVT-POR-03 `por.accountAccess.expired` | T09 | No declarado en el §12 del consumidor |
| EVT-POR-04 `por.accountAccess.suspended` | T09 | No declarado en el §12 del consumidor |

### SEC-POR-02 — POR: Envíos públicos sin sesión

**Agregados:** `por.publicSubmission.*`. **Productor:** M19 Portal del socio y landing (M19 §12; catálogo T11 §12.3).

**Cubre:** EVT-POR-09 `por.publicSubmission.received`, EVT-POR-10 `por.publicSubmission.receiptIssued`, EVT-POR-11 `por.publicSubmission.deadlineAtRisk`.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PM19 as M19 POR
    participant BUS as Outbox y colas (T01, T11)
    participant PM09 as M09 CRM
    participant PT09 as T09 COM
    participant PT10 as T10 BIA
    U->>PM19: Acción que origina el hecho
    PM19->>BUS: EVT-POR-09 por.publicSubmission.received
    par M09
        BUS->>PM09: consume EVT-POR-09
    and T09
        BUS->>PT09: consume EVT-POR-09
    end
    U->>PM19: Acción que origina el hecho
    PM19->>BUS: EVT-POR-10 por.publicSubmission.receiptIssued
    par T09
        BUS->>PT09: consume EVT-POR-10
    and T10
        BUS->>PT10: consume EVT-POR-10
    end
    U->>PM19: Acción que origina el hecho
    PM19->>BUS: EVT-POR-11 por.publicSubmission.deadlineAtRisk
    par M09
        BUS->>PM09: consume EVT-POR-11
    and T09
        BUS->>PT09: consume EVT-POR-11
    end
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-POR-09 `por.publicSubmission.received` | M09, T09 | No declarado en el §12 del consumidor |
| EVT-POR-10 `por.publicSubmission.receiptIssued` | T09, T10 | No declarado en el §12 del consumidor |
| EVT-POR-11 `por.publicSubmission.deadlineAtRisk` | M09, T09 | No declarado en el §12 del consumidor |

### SEC-POR-03 — POR: hechos complementarios (Intentos de vinculación, delegation, Envíos de formularios, landing, legacyImport, legacyUser, memberView)

**Agregados:** `por.linkAttempt.*`, `por.delegation.*`, `por.formSubmission.*`, `por.landing.*`, `por.legacyImport.*`, `por.legacyUser.*`, `por.memberView.*`. **Productor:** M19 Portal del socio y landing (M19 §12; catálogo T11 §12.3).

**Cubre:** EVT-POR-05 `por.linkAttempt.blocked`, EVT-POR-06 `por.delegation.invited`, EVT-POR-07 `por.formSubmission.submitted`, EVT-POR-08 `por.formSubmission.accepted`, EVT-POR-12 `por.landing.published`, EVT-POR-13 `por.legacyImport.completed`, EVT-POR-14 `por.legacyUser.activated`, EVT-POR-15 `por.memberView.opened`.

Parte de estos hechos también aparece, con el detalle del caso de negocio, en A7 de `06-secuencias-y-estados.md` §3.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PM19 as M19 POR
    participant BUS as Outbox y colas (T01, T11)
    participant PT02 as T02 IAM
    participant PT09 as T09 COM
    participant PM09 as M09 CRM
    participant PT10 as T10 BIA
    participant PT07 as T07 MIG
    U->>PM19: Acción que origina el hecho
    PM19->>BUS: EVT-POR-05 por.linkAttempt.blocked
    par T02
        BUS->>PT02: consume EVT-POR-05
    and T09
        BUS->>PT09: consume EVT-POR-05
    end
    U->>PM19: Acción que origina el hecho
    PM19->>BUS: EVT-POR-06 por.delegation.invited y 2 tipos más
    BUS->>PT09: consume EVT-POR-06
    U->>PM19: Acción que origina el hecho
    PM19->>BUS: EVT-POR-07 por.formSubmission.submitted
    par M09
        BUS->>PM09: consume EVT-POR-07
    and T09
        BUS->>PT09: consume EVT-POR-07
    and T10
        BUS->>PT10: consume EVT-POR-07
    end
    U->>PM19: Acción que origina el hecho
    PM19->>BUS: EVT-POR-08 por.formSubmission.accepted y 2 tipos más
    par T09
        BUS->>PT09: consume EVT-POR-08
    and T10
        BUS->>PT10: consume EVT-POR-08
    end
    U->>PM19: Acción que origina el hecho
    PM19->>BUS: EVT-POR-12 por.landing.published
    BUS->>PT10: consume EVT-POR-12
    U->>PM19: Acción que origina el hecho
    PM19->>BUS: EVT-POR-13 por.legacyImport.completed
    par T07
        BUS->>PT07: consume EVT-POR-13
    and T10
        BUS->>PT10: consume EVT-POR-13
    end
    U->>PM19: Acción que origina el hecho
    PM19->>BUS: EVT-POR-14 por.legacyUser.activated
    BUS->>PT10: consume EVT-POR-14
    U->>PM19: Acción que origina el hecho
    PM19->>BUS: EVT-POR-15 por.memberView.opened
    BUS->>PT02: consume EVT-POR-15
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-POR-05 `por.linkAttempt.blocked` | T02, T09 | No declarado en el §12 del consumidor |
| EVT-POR-06 `por.delegation.invited` | T09 | No declarado en el §12 del consumidor |
| EVT-POR-07 `por.formSubmission.submitted` | M09, T09, T10 | No declarado en el §12 del consumidor |
| EVT-POR-08 `por.formSubmission.accepted` | T09, T10 | No declarado en el §12 del consumidor |
| EVT-POR-12 `por.landing.published` | T10 | No declarado en el §12 del consumidor |
| EVT-POR-13 `por.legacyImport.completed` | T07, T10 | No declarado en el §12 del consumidor |
| EVT-POR-14 `por.legacyUser.activated` | T10 | No declarado en el §12 del consumidor |
| EVT-POR-15 `por.memberView.opened` | T02 | No declarado en el §12 del consumidor |

### SEC-POR-04 — POR: hechos complementarios (kiosk)

**Agregados:** `por.kiosk.*`. **Productor:** M19 Portal del socio y landing (M19 §12; catálogo T11 §12.3).

**Cubre:** EVT-POR-16 `por.kiosk.statusChanged`.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PM19 as M19 POR
    participant BUS as Outbox y colas (T01, T11)
    participant PM07 as M07 COB
    participant PT09 as T09 COM
    U->>PM19: Acción que origina el hecho
    PM19->>BUS: EVT-POR-16 por.kiosk.statusChanged
    par M07
        BUS->>PM07: consume EVT-POR-16
    and T09
        BUS->>PT09: consume EVT-POR-16
    end
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-POR-16 `por.kiosk.statusChanged` | M07, T09 | No declarado en el §12 del consumidor |

## T01 — PLA Plataforma SaaS

### SEC-PLA-01 — PLA: Registro del tenant, ciclo de vida, dominios, zona horaria

**Agregados:** `pla.tenant.*`. **Productor:** T01 Plataforma SaaS (T01 §12; catálogo T11 §12.3).

**Cubre:** EVT-PLA-01 `pla.tenant.created`, EVT-PLA-02 `pla.tenant.statusChanged`, EVT-PLA-03 `pla.tenant.suspended`, EVT-PLA-04 `pla.tenant.reactivated`, EVT-PLA-05 `pla.tenant.closed`.

**API y jobs disparadores (citados junto al evento en el anexo productor):** JOB-PLA-02, JOB-PLA-14.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PT01 as T01 PLA
    participant BUS as Outbox y colas (T01, T11)
    participant PM01 as M01 PER
    participant PT02 as T02 IAM
    participant PT03 as T03 UXD
    participant PT04 as T04 CFG
    participant PT09 as T09 COM
    participant PT10 as T10 BIA
    participant PM19 as M19 POR
    participant PT11 as T11 WFL
    participant PT06 as T06 INT
    U->>PT01: JOB-PLA-02
    PT01->>BUS: EVT-PLA-01 pla.tenant.created
    par M01
        BUS->>PM01: Carga catálogos por defecto y secuencias.
    and T02
        BUS->>PT02: consume EVT-PLA-01
    and T03
        BUS->>PT03: consume EVT-PLA-01
    and T04
        BUS->>PT04: Crear adopciones por defecto, calendario del tenant, defaults si demo…
    and T09
        BUS->>PT09: Generar comunicaciones según catálogo. Los tipos sin evento ( soc.cem…
    end
    U->>PT01: Acción que origina el hecho
    PT01->>BUS: EVT-PLA-02 pla.tenant.statusChanged
    par T02
        BUS->>PT02: consume EVT-PLA-02
    and T09
        BUS->>PT09: consume EVT-PLA-02
    and T10
        BUS->>PT10: consume EVT-PLA-02
    end
    U->>PT01: Acción que origina el hecho
    PT01->>BUS: EVT-PLA-03 pla.tenant.suspended
    par M19
        BUS->>PM19: consume EVT-PLA-03
    and T09
        BUS->>PT09: Pausa campañas y comunicaciones no regulatorias cierra.
    and T11
        BUS->>PT11: consume EVT-PLA-03
    end
    U->>PT01: Acción que origina el hecho
    PT01->>BUS: EVT-PLA-04 pla.tenant.reactivated
    par T09
        BUS->>PT09: consume EVT-PLA-04
    and T11
        BUS->>PT11: consume EVT-PLA-04
    end
    U->>PT01: JOB-PLA-14
    PT01->>BUS: EVT-PLA-05 pla.tenant.closed
    par T02
        BUS->>PT02: consume EVT-PLA-05
    and T06
        BUS->>PT06: consume EVT-PLA-05
    and T09
        BUS->>PT09: consume EVT-PLA-05
    end
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-PLA-01 `pla.tenant.created` | M01, T02, T03, T04, T09 | M01: Carga catálogos por defecto y secuencias.; T04: Crear adopciones por defecto, calendario del tenant, defaults; si demo, ofrecer semilla. Crear la entidad jurídica por defecto y la sucursal casa central (§9.16, RF-C… |
| EVT-PLA-02 `pla.tenant.statusChanged` | T02, T09, T10 | No declarado en el §12 del consumidor |
| EVT-PLA-03 `pla.tenant.suspended` | M19, T09, T11 | T09: Pausa campañas y comunicaciones no regulatorias; cierra. |
| EVT-PLA-04 `pla.tenant.reactivated` | T09, T11 | No declarado en el §12 del consumidor |
| EVT-PLA-05 `pla.tenant.closed` | T02, T06, T09 | No declarado en el §12 del consumidor |

### SEC-PLA-02 — PLA: hechos complementarios (capability, Licencia vigente y cupos, Contrato SaaS GoodApps–cooperativa, Consumo agregado de IA por tenant y…)

**Agregados:** `pla.capability.*`, `pla.license.*`, `pla.saasContract.*`, `pla.usage.*`, `pla.supportCase.*`, `pla.supportGrant.*`, `pla.restore.*`. **Productor:** T01 Plataforma SaaS (T01 §12; catálogo T11 §12.3).

**Cubre:** EVT-PLA-06 `pla.capability.activated`, EVT-PLA-07 `pla.capability.deactivated`, EVT-PLA-08 `pla.license.updated`, EVT-PLA-09 `pla.saasContract.approved`, EVT-PLA-10 `pla.usage.thresholdReached`, EVT-PLA-11 `pla.supportCase.opened`, EVT-PLA-12 `pla.supportGrant.requested`, EVT-PLA-14 `pla.restore.requested`.

**API y jobs disparadores (citados junto al evento en el anexo productor):** JOB-PLA-03, JOB-PLA-04.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PT01 as T01 PLA
    participant BUS as Outbox y colas (T01, T11)
    participant PT02 as T02 IAM
    participant PT03 as T03 UXD
    participant PT04 as T04 CFG
    participant PT09 as T09 COM
    participant PT11 as T11 WFL
    participant PM02 as M02 CAT
    participant PT10 as T10 BIA
    participant PM15 as M15 CON
    participant PM06 as M06 FIS
    participant PM10 as M10 TEC
    U->>PT01: Acción que origina el hecho
    PT01->>BUS: EVT-PLA-06 pla.capability.activated
    par T02
        BUS->>PT02: authzVersion++ de todas las pertenencias del tenant
    and T03
        BUS->>PT03: Invalidar caché del mapa del sitio del tenant
    and T04
        BUS->>PT04: Mostrar/ocultar claves del módulo validar secretos requeridos.
    and T09
        BUS->>PT09: consume EVT-PLA-06
    and T11
        BUS->>PT11: consume EVT-PLA-06
    end
    U->>PT01: Acción que origina el hecho
    PT01->>BUS: EVT-PLA-07 pla.capability.deactivated
    par M02
        BUS->>PM02: Cierra oferta abre plan de salida no altera contratos sin decisión.
    and T02
        BUS->>PT02: consume EVT-PLA-07
    and T03
        BUS->>PT03: consume EVT-PLA-07
    and T04
        BUS->>PT04: consume EVT-PLA-07
    and T11
        BUS->>PT11: consume EVT-PLA-07
    end
    U->>PT01: JOB-PLA-03
    PT01->>BUS: EVT-PLA-08 pla.license.updated
    par M02
        BUS->>PM02: Cierra oferta abre plan de salida no altera contratos sin decisión.
    and T02
        BUS->>PT02: authzVersion++ de todas las pertenencias del tenant
    and T03
        BUS->>PT03: Invalidar caché del mapa del sitio del tenant
    and T09
        BUS->>PT09: consume EVT-PLA-08
    and T10
        BUS->>PT10: Recalcula catálogo visible, scopes válidos y OpenAPI filtrado
    end
    U->>PT01: Acción que origina el hecho
    PT01->>BUS: EVT-PLA-09 pla.saasContract.approved
    BUS->>PM15: consume EVT-PLA-09
    U->>PT01: Acción que origina el hecho
    PT01->>BUS: EVT-PLA-10 pla.usage.thresholdReached
    BUS->>PT09: consume EVT-PLA-10
    U->>PT01: Acción que origina el hecho
    PT01->>BUS: EVT-PLA-11 pla.supportCase.opened y 2 tipos más
    BUS->>PT09: consume EVT-PLA-11
    U->>PT01: JOB-PLA-04
    PT01->>BUS: EVT-PLA-12 pla.supportGrant.requested y 4 tipos más
    par T02
        BUS->>PT02: consume EVT-PLA-12
    and T09
        BUS->>PT09: consume EVT-PLA-12
    end
    U->>PT01: Acción que origina el hecho
    PT01->>BUS: EVT-PLA-14 pla.restore.requested y 1 tipo más
    par M06
        BUS->>PM06: JOB-FIS-05 de recuperación (ESC-04)
    and M10
        BUS->>PM10: consume EVT-PLA-14
    and T09
        BUS->>PT09: consume EVT-PLA-14
    end
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-PLA-06 `pla.capability.activated` | T02, T03, T04, T09, T11 | T02: `authzVersion++` de todas las pertenencias del tenant; T03: Invalidar caché del mapa del sitio del tenant; T04: Mostrar/ocultar claves del módulo; validar secretos requeridos. |
| EVT-PLA-07 `pla.capability.deactivated` | M02, T02, T03, T04, T11 | M02: Cierra oferta; abre plan de salida; no altera contratos sin decisión. |
| EVT-PLA-08 `pla.license.updated` | M02, T02, T03, T09, T10 | M02: Cierra oferta; abre plan de salida; no altera contratos sin decisión.; T02: `authzVersion++` de todas las pertenencias del tenant; T03: Invalidar caché del mapa del sitio del tenant; T10: Recalcula catálogo visible… |
| EVT-PLA-09 `pla.saasContract.approved` | M15 | No declarado en el §12 del consumidor |
| EVT-PLA-10 `pla.usage.thresholdReached` | T09 | No declarado en el §12 del consumidor |
| EVT-PLA-11 `pla.supportCase.opened` | T09 | No declarado en el §12 del consumidor |
| EVT-PLA-12 `pla.supportGrant.requested` | T02, T09 | No declarado en el §12 del consumidor |
| EVT-PLA-14 `pla.restore.requested` | M06, M10, T09 | M06: JOB-FIS-05 de recuperación (ESC-04) |

### SEC-PLA-03 — PLA: hechos complementarios (sandbox, Versiones desplegadas y notas, Alertas disparadas, Exportaciones completas del tenant, Incidentes op…)

**Agregados:** `pla.sandbox.*`, `pla.release.*`, `pla.alert.*`, `pla.tenantExport.*`, `pla.incident.*`, `pla.checklist.*`, `pla.tenantProfile.*`. **Productor:** T01 Plataforma SaaS (T01 §12; catálogo T11 §12.3).

**Cubre:** EVT-PLA-15 `pla.sandbox.created`, EVT-PLA-16 `pla.release.deployed`, EVT-PLA-17 `pla.alert.raised`, EVT-PLA-18 `pla.tenantExport.ready`, EVT-PLA-19 `pla.incident.updated`, EVT-PLA-20 `pla.checklist.changed`, EVT-PLA-22 `pla.tenantProfile.updated`.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PT01 as T01 PLA
    participant BUS as Outbox y colas (T01, T11)
    participant PT09 as T09 COM
    participant PT10 as T10 BIA
    participant PM06 as M06 FIS
    participant PT03 as T03 UXD
    participant PT11 as T11 WFL
    U->>PT01: Acción que origina el hecho
    PT01->>BUS: EVT-PLA-15 pla.sandbox.created
    BUS->>PT09: consume EVT-PLA-15
    U->>PT01: Acción que origina el hecho
    PT01->>BUS: EVT-PLA-16 pla.release.deployed
    BUS->>PT09: consume EVT-PLA-16
    U->>PT01: Acción que origina el hecho
    PT01->>BUS: EVT-PLA-17 pla.alert.raised y 1 tipo más
    BUS->>PT09: consume EVT-PLA-17
    U->>PT01: Acción que origina el hecho
    PT01->>BUS: EVT-PLA-18 pla.tenantExport.ready
    BUS->>PT09: consume EVT-PLA-18
    U->>PT01: Acción que origina el hecho
    PT01->>BUS: EVT-PLA-19 pla.incident.updated
    BUS->>PT09: consume EVT-PLA-19
    U->>PT01: Acción que origina el hecho
    PT01->>BUS: EVT-PLA-20 pla.checklist.changed
    par T09
        BUS->>PT09: consume EVT-PLA-20
    and T10
        BUS->>PT10: consume EVT-PLA-20
    end
    U->>PT01: Acción que origina el hecho
    PT01->>BUS: EVT-PLA-22 pla.tenantProfile.updated
    par M06
        BUS->>PM06: consume EVT-PLA-22
    and T03
        BUS->>PT03: Refrescar legalName en pie y documentos
    and T11
        BUS->>PT11: consume EVT-PLA-22
    end
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-PLA-15 `pla.sandbox.created` | T09 | No declarado en el §12 del consumidor |
| EVT-PLA-16 `pla.release.deployed` | T09 | No declarado en el §12 del consumidor |
| EVT-PLA-17 `pla.alert.raised` | T09 | No declarado en el §12 del consumidor |
| EVT-PLA-18 `pla.tenantExport.ready` | T09 | No declarado en el §12 del consumidor |
| EVT-PLA-19 `pla.incident.updated` | T09 | No declarado en el §12 del consumidor |
| EVT-PLA-20 `pla.checklist.changed` | T09, T10 | No declarado en el §12 del consumidor |
| EVT-PLA-22 `pla.tenantProfile.updated` | M06, T03, T11 | T03: Refrescar `legalName` en pie y documentos |

## T02 — IAM Identidad, roles y auditoría

### SEC-IAM-01 — IAM: hechos complementarios (Identidad de inicio de sesión, Identidad dentro del tenant, Roles con capabilities, Sesiones y refresh rotati…)

**Agregados:** `iam.identity.*`, `iam.membership.*`, `iam.role.*`, `iam.session.*`, `iam.login.*`, `iam.mfa.*`. **Productor:** T02 Identidad, roles y auditoría (T02 §12; catálogo T11 §12.3).

**Cubre:** EVT-IAM-01 `iam.identity.created`, EVT-IAM-02 `iam.identity.locked`, EVT-IAM-03 `iam.membership.invited`, EVT-IAM-04 `iam.role.assigned`, EVT-IAM-05 `iam.role.changed`, EVT-IAM-06 `iam.session.started`, EVT-IAM-07 `iam.login.failed`, EVT-IAM-08 `iam.mfa.enrolled`.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PT02 as T02 IAM
    participant BUS as Outbox y colas (T01, T11)
    participant PM01 as M01 PER
    participant PM19 as M19 POR
    participant PT09 as T09 COM
    participant PM10 as M10 TEC
    participant PM16 as M16 SUE
    participant PT10 as T10 BIA
    participant PT11 as T11 WFL
    participant PT03 as T03 UXD
    participant PT08 as T08 NFR
    U->>PT02: Acción que origina el hecho
    PT02->>BUS: EVT-IAM-01 iam.identity.created y 1 tipo más
    par M01
        BUS->>PM01: Propone vinculación al borrar la cuenta de acceso revoca vínculos sin…
    and M19
        BUS->>PM19: Crear preferencias, detectar usuario migrado
    and T09
        BUS->>PT09: Generar comunicaciones según catálogo. Los tipos sin evento ( soc.cem…
    end
    U->>PT02: Acción que origina el hecho
    PT02->>BUS: EVT-IAM-02 iam.identity.locked y 1 tipo más
    BUS->>PT09: consume EVT-IAM-02
    U->>PT02: Acción que origina el hecho
    PT02->>BUS: EVT-IAM-03 iam.membership.invited y 3 tipos más
    par M10
        BUS->>PM10: Revocar dispositivos y desasignar recursos.
    and M16
        BUS->>PM16: Con membershipId e identityId del payload completa employees.userAcco…
    and M19
        BUS->>PM19: Recalcular espacios/ámbitos
    and T09
        BUS->>PT09: consume EVT-IAM-03
    and T10
        BUS->>PT10: Revalidación de programaciones y presets compartidos (RF-BIA-038)
    and T11
        BUS->>PT11: consume EVT-IAM-03
    end
    U->>PT02: Acción que origina el hecho
    PT02->>BUS: EVT-IAM-04 iam.role.assigned y 1 tipo más
    par T03
        BUS->>PT03: Invalidar caché de mapa por usuario/rol
    and T09
        BUS->>PT09: Recalcula grants para clampAudienceToGrant visibilidad de usuarios au…
    and T10
        BUS->>PT10: Revalidación de programaciones y presets compartidos (RF-BIA-038)
    and T11
        BUS->>PT11: consume EVT-IAM-04
    end
    U->>PT02: Acción que origina el hecho
    PT02->>BUS: EVT-IAM-05 iam.role.changed y 1 tipo más
    par T03
        BUS->>PT03: Invalidar caché de mapa por usuario/rol
    and T10
        BUS->>PT10: Revalidación de programaciones y presets compartidos (RF-BIA-038)
    and T11
        BUS->>PT11: consume EVT-IAM-05
    end
    U->>PT02: Acción que origina el hecho
    PT02->>BUS: EVT-IAM-06 iam.session.started y 1 tipo más
    BUS->>PT10: consume EVT-IAM-06
    U->>PT02: Acción que origina el hecho
    PT02->>BUS: EVT-IAM-07 iam.login.failed
    BUS->>PT08: consume EVT-IAM-07
    U->>PT02: Acción que origina el hecho
    PT02->>BUS: EVT-IAM-08 iam.mfa.enrolled y 1 tipo más
    BUS->>PT09: consume EVT-IAM-08
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-IAM-01 `iam.identity.created` | M01, M19, T09 | M01: Propone vinculación; al borrar la cuenta de acceso revoca vínculos sin borrar datos de negocio (RN-PER-116).; M19: Crear preferencias, detectar usuario migrado; T09: Generar comunicaciones según catálogo. Los tipos… |
| EVT-IAM-02 `iam.identity.locked` | T09 | No declarado en el §12 del consumidor |
| EVT-IAM-03 `iam.membership.invited` | M10, M16, M19, T09, T10, T11 | M10: Revocar dispositivos y desasignar recursos.; M16: Con `membershipId` e `identityId` del payload completa `employees.userAccountId` del empleado vinculado (antes el efecto decía solo `employees.userAccountId`).; M19… |
| EVT-IAM-04 `iam.role.assigned` | T03, T09, T10, T11 | T03: Invalidar caché de mapa por usuario/rol; T09: Recalcula grants para `clampAudienceToGrant`; visibilidad de usuarios autorizados.; T10: Revalidación de programaciones y presets compartidos (RF-BIA-038) |
| EVT-IAM-05 `iam.role.changed` | T03, T10, T11 | T03: Invalidar caché de mapa por usuario/rol; T10: Revalidación de programaciones y presets compartidos (RF-BIA-038) |
| EVT-IAM-06 `iam.session.started` | T10 | No declarado en el §12 del consumidor |
| EVT-IAM-07 `iam.login.failed` | T08 | No declarado en el §12 del consumidor |
| EVT-IAM-08 `iam.mfa.enrolled` | T09 | No declarado en el §12 del consumidor |

### SEC-IAM-02 — IAM: hechos complementarios (password, authorization, supportAccess, Clientes API de terceros, idp, Alertas de seguridad de identidad, por…)

**Agregados:** `iam.password.*`, `iam.authorization.*`, `iam.supportAccess.*`, `iam.apiClient.*`, `iam.idp.*`, `iam.securityAlert.*`, `iam.portal.*`, `iam.audit.*`. **Productor:** T02 Identidad, roles y auditoría (T02 §12; catálogo T11 §12.3).

**Cubre:** EVT-IAM-09 `iam.password.changed`, EVT-IAM-10 `iam.authorization.requested`, EVT-IAM-11 `iam.supportAccess.requested`, EVT-IAM-12 `iam.apiClient.created`, EVT-IAM-13 `iam.idp.activated`, EVT-IAM-14 `iam.securityAlert.raised`, EVT-IAM-15 `iam.portal.accountLinked`, EVT-IAM-16 `iam.audit.integrityFailed`.

**API y jobs disparadores (citados junto al evento en el anexo productor):** API-IAM-49, API-IAM-50, JOB-IAM-05.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PT02 as T02 IAM
    participant BUS as Outbox y colas (T01, T11)
    participant PT09 as T09 COM
    participant PM01 as M01 PER
    participant PM02 as M02 CAT
    participant PM07 as M07 COB
    participant PM08 as M08 MOR
    participant PT11 as T11 WFL
    participant PT01 as T01 PLA
    participant PT10 as T10 BIA
    participant PM16 as M16 SUE
    participant PM19 as M19 POR
    participant PT08 as T08 NFR
    participant GEN as Módulos dueños o todos (genérico)
    U->>PT02: Acción que origina el hecho
    PT02->>BUS: EVT-IAM-09 iam.password.changed y 1 tipo más
    BUS->>PT09: consume EVT-IAM-09
    U->>PT02: API-IAM-49, API-IAM-50
    PT02->>BUS: EVT-IAM-10 iam.authorization.requested y 4 tipos más
    par M01
        BUS->>PM01: consume EVT-IAM-10
    and M02
        BUS->>PM02: consume EVT-IAM-10
    and M07
        BUS->>PM07: consume EVT-IAM-10
    and M08
        BUS->>PM08: consume EVT-IAM-10
    and T09
        BUS->>PT09: consume EVT-IAM-10
    and T11
        BUS->>PT11: consume EVT-IAM-10
    and genérico
        BUS->>GEN: Todos los módulos suscriptos (genérico)
    and genérico
        BUS->>GEN: Módulo dueño del tipo (genérico)
    end
    U->>PT02: Acción que origina el hecho
    PT02->>BUS: EVT-IAM-11 iam.supportAccess.requested y 4 tipos más
    par T01
        BUS->>PT01: consume EVT-IAM-11
    and T09
        BUS->>PT09: consume EVT-IAM-11
    end
    U->>PT02: Acción que origina el hecho
    PT02->>BUS: EVT-IAM-12 iam.apiClient.created y 2 tipos más
    BUS->>PT10: Sincroniza estado del perfil de cliente y caché de revocación
    U->>PT02: Acción que origina el hecho
    PT02->>BUS: EVT-IAM-13 iam.idp.activated y 1 tipo más
    BUS->>PT10: consume EVT-IAM-13
    U->>PT02: Acción que origina el hecho
    PT02->>BUS: EVT-IAM-14 iam.securityAlert.raised
    par T01
        BUS->>PT01: consume EVT-IAM-14
    and T09
        BUS->>PT09: consume EVT-IAM-14
    end
    U->>PT02: Acción que origina el hecho
    PT02->>BUS: EVT-IAM-15 iam.portal.accountLinked y 1 tipo más
    par M01
        BUS->>PM01: Propone vinculación al borrar la cuenta de acceso revoca vínculos sin…
    and M16
        BUS->>PM16: consume EVT-IAM-15
    and M19
        BUS->>PM19: consume EVT-IAM-15
    end
    U->>PT02: JOB-IAM-05
    PT02->>BUS: EVT-IAM-16 iam.audit.integrityFailed
    par T08
        BUS->>PT08: consume EVT-IAM-16
    and T09
        BUS->>PT09: consume EVT-IAM-16
    end
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-IAM-09 `iam.password.changed` | T09 | No declarado en el §12 del consumidor |
| EVT-IAM-10 `iam.authorization.requested` | M01, M02, M07, M08, T09, T11, (todos), (dueño) | No declarado en el §12 del consumidor |
| EVT-IAM-11 `iam.supportAccess.requested` | T01, T09 | No declarado en el §12 del consumidor |
| EVT-IAM-12 `iam.apiClient.created` | T10 | T10: Sincroniza estado del perfil de cliente y caché de revocación |
| EVT-IAM-13 `iam.idp.activated` | T10 | No declarado en el §12 del consumidor |
| EVT-IAM-14 `iam.securityAlert.raised` | T01, T09 | No declarado en el §12 del consumidor |
| EVT-IAM-15 `iam.portal.accountLinked` | M01, M16, M19 | M01: Propone vinculación; al borrar la cuenta de acceso revoca vínculos sin borrar datos de negocio (RN-PER-116). |
| EVT-IAM-16 `iam.audit.integrityFailed` | T08, T09 | No declarado en el §12 del consumidor |

## T03 — UXD Experiencia, marca y diccionario

### SEC-UXD-01 — UXD: dictionary

**Agregados:** `uxd.dictionary.*`. **Productor:** T03 Experiencia, marca y diccionario (T03 §12; catálogo T11 §12.3).

**Cubre:** EVT-UXD-04 `uxd.dictionary.published`, EVT-UXD-05 `uxd.dictionary.reverted`, EVT-UXD-06 `uxd.dictionary.missingKeyDetected`.

**API y jobs disparadores (citados junto al evento en el anexo productor):** JOB-UXD-03.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PT03 as T03 UXD
    participant BUS as Outbox y colas (T01, T11)
    participant PM05 as M05 FAC
    participant PM09 as M09 CRM
    participant PT09 as T09 COM
    participant PT10 as T10 BIA
    participant PT11 as T11 WFL
    U->>PT03: JOB-UXD-03
    PT03->>BUS: EVT-UXD-04 uxd.dictionary.published
    par M05
        BUS->>PM05: consume EVT-UXD-04
    and M09
        BUS->>PM09: consume EVT-UXD-04
    and T09
        BUS->>PT09: consume EVT-UXD-04
    and T10
        BUS->>PT10: consume EVT-UXD-04
    and T11
        BUS->>PT11: consume EVT-UXD-04
    end
    U->>PT03: Acción que origina el hecho
    PT03->>BUS: EVT-UXD-05 uxd.dictionary.reverted
    par M05
        BUS->>PM05: consume EVT-UXD-05
    and M09
        BUS->>PM09: consume EVT-UXD-05
    and T09
        BUS->>PT09: consume EVT-UXD-05
    and T10
        BUS->>PT10: consume EVT-UXD-05
    and T11
        BUS->>PT11: consume EVT-UXD-05
    end
    U->>PT03: Acción que origina el hecho
    PT03->>BUS: EVT-UXD-06 uxd.dictionary.missingKeyDetected
    BUS->>PT10: consume EVT-UXD-06
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-UXD-04 `uxd.dictionary.published` | M05, M09, T09, T10, T11 | No declarado en el §12 del consumidor |
| EVT-UXD-05 `uxd.dictionary.reverted` | M05, M09, T09, T10, T11 | No declarado en el §12 del consumidor |
| EVT-UXD-06 `uxd.dictionary.missingKeyDetected` | T10 | No declarado en el §12 del consumidor |

### SEC-UXD-02 — UXD: hechos complementarios (Marca publicada por canal, Recursos de marca, flag)

**Agregados:** `uxd.branding.*`, `uxd.asset.*`, `uxd.flag.*`. **Productor:** T03 Experiencia, marca y diccionario (T03 §12; catálogo T11 §12.3).

**Cubre:** EVT-UXD-01 `uxd.branding.published`, EVT-UXD-02 `uxd.branding.reverted`, EVT-UXD-03 `uxd.asset.processed`, EVT-UXD-07 `uxd.flag.changed`.

**API y jobs disparadores (citados junto al evento en el anexo productor):** JOB-UXD-02, JOB-UXD-01.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PT03 as T03 UXD
    participant BUS as Outbox y colas (T01, T11)
    participant PM05 as M05 FAC
    participant PT09 as T09 COM
    participant PT11 as T11 WFL
    participant PT10 as T10 BIA
    participant PT02 as T02 IAM
    U->>PT03: JOB-UXD-02, JOB-UXD-01
    PT03->>BUS: EVT-UXD-01 uxd.branding.published
    par M05
        BUS->>PM05: consume EVT-UXD-01
    and T09
        BUS->>PT09: consume EVT-UXD-01
    and T11
        BUS->>PT11: consume EVT-UXD-01
    end
    U->>PT03: Acción que origina el hecho
    PT03->>BUS: EVT-UXD-02 uxd.branding.reverted
    par M05
        BUS->>PM05: consume EVT-UXD-02
    and T09
        BUS->>PT09: consume EVT-UXD-02
    and T11
        BUS->>PT11: consume EVT-UXD-02
    end
    U->>PT03: Acción que origina el hecho
    PT03->>BUS: EVT-UXD-03 uxd.asset.processed
    BUS->>PT10: consume EVT-UXD-03
    U->>PT03: Acción que origina el hecho
    PT03->>BUS: EVT-UXD-07 uxd.flag.changed
    BUS->>PT02: consume EVT-UXD-07
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-UXD-01 `uxd.branding.published` | M05, T09, T11 | No declarado en el §12 del consumidor |
| EVT-UXD-02 `uxd.branding.reverted` | M05, T09, T11 | No declarado en el §12 del consumidor |
| EVT-UXD-03 `uxd.asset.processed` | T10 | No declarado en el §12 del consumidor |
| EVT-UXD-07 `uxd.flag.changed` | T02 | No declarado en el §12 del consumidor |

## T04 — CFG Configuración, parámetros y maestros

### SEC-CFG-01 — CFG: Paquetes de configuración versionados y publicados

**Agregados:** `cfg.configVersion.*`. **Productor:** T04 Configuración, parámetros y maestros (T04 §12; catálogo T11 §12.3).

**Cubre:** EVT-CFG-01 `cfg.configVersion.created`, EVT-CFG-02 `cfg.configVersion.submitted`, EVT-CFG-03 `cfg.configVersion.approved`, EVT-CFG-04 `cfg.configVersion.scheduled`, EVT-CFG-05 `cfg.configVersion.published`, EVT-CFG-06 `cfg.configVersion.failed`.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PT04 as T04 CFG
    participant BUS as Outbox y colas (T01, T11)
    participant PT10 as T10 BIA
    participant PT11 as T11 WFL
    participant PT09 as T09 COM
    participant PM01 as M01 PER
    participant PM02 as M02 CAT
    participant PM04 as M04 TAR
    participant PM05 as M05 FAC
    participant PM19 as M19 POR
    participant PT01 as T01 PLA
    participant PT02 as T02 IAM
    participant PT03 as T03 UXD
    participant PT06 as T06 INT
    participant PT07 as T07 MIG
    participant PT08 as T08 NFR
    U->>PT04: Acción que origina el hecho
    PT04->>BUS: EVT-CFG-01 cfg.configVersion.created
    BUS->>PT10: consume EVT-CFG-01
    U->>PT04: Acción que origina el hecho
    PT04->>BUS: EVT-CFG-02 cfg.configVersion.submitted
    BUS->>PT11: consume EVT-CFG-02
    U->>PT04: Acción que origina el hecho
    PT04->>BUS: EVT-CFG-03 cfg.configVersion.approved y 1 tipo más
    BUS->>PT09: consume EVT-CFG-03
    U->>PT04: Acción que origina el hecho
    PT04->>BUS: EVT-CFG-04 cfg.configVersion.scheduled
    BUS->>PT10: consume EVT-CFG-04
    U->>PT04: Acción que origina el hecho
    PT04->>BUS: EVT-CFG-05 cfg.configVersion.published
    par M01
        BUS->>PM01: consume EVT-CFG-05
    and M02
        BUS->>PM02: consume EVT-CFG-05
    and M04
        BUS->>PM04: consume EVT-CFG-05
    and M05
        BUS->>PM05: consume EVT-CFG-05
    and M19
        BUS->>PM19: consume EVT-CFG-05
    and T01
        BUS->>PT01: consume EVT-CFG-05
    and T02
        BUS->>PT02: Recarga políticas
    and T03
        BUS->>PT03: consume EVT-CFG-05
    and T06
        BUS->>PT06: consume EVT-CFG-05
    and T07
        BUS->>PT07: consume EVT-CFG-05
    and T08
        BUS->>PT08: consume EVT-CFG-05
    and T09
        BUS->>PT09: consume EVT-CFG-05
    and T10
        BUS->>PT10: Invalida cachés de diccionario, calendario de días hábiles y parámetr…
    and T11
        BUS->>PT11: consume EVT-CFG-05
    end
    U->>PT04: Acción que origina el hecho
    PT04->>BUS: EVT-CFG-06 cfg.configVersion.failed y 2 tipos más
    BUS->>PT09: consume EVT-CFG-06
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-CFG-01 `cfg.configVersion.created` | T10 | No declarado en el §12 del consumidor |
| EVT-CFG-02 `cfg.configVersion.submitted` | T11 | No declarado en el §12 del consumidor |
| EVT-CFG-03 `cfg.configVersion.approved` | T09 | No declarado en el §12 del consumidor |
| EVT-CFG-04 `cfg.configVersion.scheduled` | T10 | No declarado en el §12 del consumidor |
| EVT-CFG-05 `cfg.configVersion.published` | M01, M02, M04, M05, M19, T01, T02, T03, T06, T07, T08, T09, T10, T11 | T02: Recarga políticas; T10: Invalida cachés de diccionario, calendario de días hábiles y parámetros PRM-BIA |
| EVT-CFG-06 `cfg.configVersion.failed` | T09 | No declarado en el §12 del consumidor |

### SEC-CFG-02 — CFG: hechos complementarios (Parámetros de la ley de contrato de trabajo, masterRecord, platformTable, Feriados nacionales, provinciales y…)

**Agregados:** `cfg.parameter.*`, `cfg.masterRecord.*`, `cfg.platformTable.*`, `cfg.holiday.*`, `cfg.economicIndex.*`, `cfg.taxRegistry.*`, `cfg.geo.*`. **Productor:** T04 Configuración, parámetros y maestros (T04 §12; catálogo T11 §12.3).

**Cubre:** EVT-CFG-07 `cfg.parameter.changed`, EVT-CFG-08 `cfg.masterRecord.changed`, EVT-CFG-09 `cfg.masterRecord.merged`, EVT-CFG-10 `cfg.platformTable.updated`, EVT-CFG-11 `cfg.holiday.changed`, EVT-CFG-12 `cfg.economicIndex.valuePublished`, EVT-CFG-13 `cfg.taxRegistry.imported`, EVT-CFG-14 `cfg.geo.streetProposed`.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PT04 as T04 CFG
    participant BUS as Outbox y colas (T01, T11)
    participant PM01 as M01 PER
    participant PM04 as M04 TAR
    participant PM19 as M19 POR
    participant PT01 as T01 PLA
    participant PT02 as T02 IAM
    participant PT03 as T03 UXD
    participant PT06 as T06 INT
    participant PT07 as T07 MIG
    participant PT08 as T08 NFR
    participant PT09 as T09 COM
    participant PT10 as T10 BIA
    participant PT11 as T11 WFL
    participant PM03 as M03 MED
    participant PM10 as M10 TEC
    participant PM06 as M06 FIS
    participant PM08 as M08 MOR
    participant PM16 as M16 SUE
    participant PM05 as M05 FAC
    participant PM09 as M09 CRM
    participant PM13 as M13 STK
    participant PM14 as M14 TES
    participant PM15 as M15 CON
    U->>PT04: Acción que origina el hecho
    PT04->>BUS: EVT-CFG-07 cfg.parameter.changed
    par M01
        BUS->>PM01: consume EVT-CFG-07
    and M04
        BUS->>PM04: Recarga parámetros PRM-TAR (vigentes desde su fecha).
    and M19
        BUS->>PM19: consume EVT-CFG-07
    and T01
        BUS->>PT01: consume EVT-CFG-07
    and T02
        BUS->>PT02: consume EVT-CFG-07
    and T03
        BUS->>PT03: consume EVT-CFG-07
    and T06
        BUS->>PT06: consume EVT-CFG-07
    and T07
        BUS->>PT07: consume EVT-CFG-07
    and T08
        BUS->>PT08: consume EVT-CFG-07
    and T09
        BUS->>PT09: consume EVT-CFG-07
    and T10
        BUS->>PT10: consume EVT-CFG-07
    and T11
        BUS->>PT11: consume EVT-CFG-07
    end
    U->>PT04: Acción que origina el hecho
    PT04->>BUS: EVT-CFG-08 cfg.masterRecord.changed
    par M01
        BUS->>PM01: consume EVT-CFG-08
    and M19
        BUS->>PM19: consume EVT-CFG-08
    and T09
        BUS->>PT09: consume EVT-CFG-08
    and T10
        BUS->>PT10: consume EVT-CFG-08
    end
    U->>PT04: Acción que origina el hecho
    PT04->>BUS: EVT-CFG-09 cfg.masterRecord.merged
    par M01
        BUS->>PM01: consume EVT-CFG-09
    and M03
        BUS->>PM03: consume EVT-CFG-09
    and M10
        BUS->>PM10: consume EVT-CFG-09
    end
    U->>PT04: Acción que origina el hecho
    PT04->>BUS: EVT-CFG-10 cfg.platformTable.updated
    par M06
        BUS->>PM06: consume EVT-CFG-10
    and M08
        BUS->>PM08: consume EVT-CFG-10
    and M16
        BUS->>PM16: Alerta de nueva versión a adoptar
    end
    U->>PT04: Acción que origina el hecho
    PT04->>BUS: EVT-CFG-11 cfg.holiday.changed
    par M05
        BUS->>PM05: consume EVT-CFG-11
    and M08
        BUS->>PM08: consume EVT-CFG-11
    and M09
        BUS->>PM09: consume EVT-CFG-11
    and M10
        BUS->>PM10: consume EVT-CFG-11
    and T11
        BUS->>PT11: consume EVT-CFG-11
    end
    U->>PT04: Acción que origina el hecho
    PT04->>BUS: EVT-CFG-12 cfg.economicIndex.valuePublished y 1 tipo más
    par M04
        BUS->>PM04: Disponibilidad de cotizaciones e índices para cálculo.
    and M05
        BUS->>PM05: consume EVT-CFG-12
    and M08
        BUS->>PM08: consume EVT-CFG-12
    and M13
        BUS->>PM13: Habilitar revaluación/ajuste del período.
    and M14
        BUS->>PM14: consume EVT-CFG-12
    and M15
        BUS->>PM15: consume EVT-CFG-12
    end
    U->>PT04: Acción que origina el hecho
    PT04->>BUS: EVT-CFG-13 cfg.taxRegistry.imported
    BUS->>PM06: consume EVT-CFG-13
    U->>PT04: Acción que origina el hecho
    PT04->>BUS: EVT-CFG-14 cfg.geo.streetProposed y 1 tipo más
    par M01
        BUS->>PM01: consume EVT-CFG-14
    and T09
        BUS->>PT09: consume EVT-CFG-14
    end
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-CFG-07 `cfg.parameter.changed` | M01, M04, M19, T01, T02, T03, T06, T07, T08, T09, T10, T11 | M04: Recarga parámetros PRM-TAR (vigentes desde su fecha). |
| EVT-CFG-08 `cfg.masterRecord.changed` | M01, M19, T09, T10 | No declarado en el §12 del consumidor |
| EVT-CFG-09 `cfg.masterRecord.merged` | M01, M03, M10 | No declarado en el §12 del consumidor |
| EVT-CFG-10 `cfg.platformTable.updated` | M06, M08, M16 | M16: Alerta de nueva versión a adoptar |
| EVT-CFG-11 `cfg.holiday.changed` | M05, M08, M09, M10, T11 | No declarado en el §12 del consumidor |
| EVT-CFG-12 `cfg.economicIndex.valuePublished` | M04, M05, M08, M13, M14, M15 | M04: Disponibilidad de cotizaciones e índices para cálculo.; M13: Habilitar revaluación/ajuste del período. |
| EVT-CFG-13 `cfg.taxRegistry.imported` | M06 | No declarado en el §12 del consumidor |
| EVT-CFG-14 `cfg.geo.streetProposed` | M01, T09 | No declarado en el §12 del consumidor |

### SEC-CFG-03 — CFG: hechos complementarios (geoReference, customField, Paquetes de precarga de demostración, integrity, Entidades jurídicas emisoras del…)

**Agregados:** `cfg.geoReference.*`, `cfg.customField.*`, `cfg.seedPack.*`, `cfg.integrity.*`, `cfg.legalEntity.*`, `cfg.branch.*`. **Productor:** T04 Configuración, parámetros y maestros (T04 §12; catálogo T11 §12.3).

**Cubre:** EVT-CFG-15 `cfg.geoReference.updated`, EVT-CFG-16 `cfg.customField.defined`, EVT-CFG-17 `cfg.seedPack.applied`, EVT-CFG-18 `cfg.integrity.issueDetected`, EVT-CFG-19 `cfg.legalEntity.created`, EVT-CFG-20 `cfg.branch.created`.

**API y jobs disparadores (citados junto al evento en el anexo productor):** JOB-CFG-13, API-CFG-55.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PT04 as T04 CFG
    participant BUS as Outbox y colas (T01, T11)
    participant PM01 as M01 PER
    participant PM10 as M10 TEC
    participant PT10 as T10 BIA
    participant PM02 as M02 CAT
    participant PM09 as M09 CRM
    participant PM12 as M12 CMP
    participant PM13 as M13 STK
    participant PM16 as M16 SUE
    participant PT11 as T11 WFL
    participant PT01 as T01 PLA
    participant PT09 as T09 COM
    participant PM05 as M05 FAC
    participant PM06 as M06 FIS
    participant PM14 as M14 TES
    participant PM15 as M15 CON
    participant PT03 as T03 UXD
    participant PM07 as M07 COB
    participant PT02 as T02 IAM
    U->>PT04: Acción que origina el hecho
    PT04->>BUS: EVT-CFG-15 cfg.geoReference.updated
    par M01
        BUS->>PM01: consume EVT-CFG-15
    and M10
        BUS->>PM10: consume EVT-CFG-15
    and T10
        BUS->>PT10: consume EVT-CFG-15
    end
    U->>PT04: Acción que origina el hecho
    PT04->>BUS: EVT-CFG-16 cfg.customField.defined y 1 tipo más
    par M01
        BUS->>PM01: consume EVT-CFG-16
    and M02
        BUS->>PM02: consume EVT-CFG-16
    and M09
        BUS->>PM09: consume EVT-CFG-16
    and M10
        BUS->>PM10: consume EVT-CFG-16
    and M12
        BUS->>PM12: consume EVT-CFG-16
    and M13
        BUS->>PM13: consume EVT-CFG-16
    and M16
        BUS->>PM16: consume EVT-CFG-16
    and T10
        BUS->>PT10: consume EVT-CFG-16
    and T11
        BUS->>PT11: consume EVT-CFG-16
    end
    U->>PT04: Acción que origina el hecho
    PT04->>BUS: EVT-CFG-17 cfg.seedPack.applied y 1 tipo más
    BUS->>PT01: consume EVT-CFG-17
    U->>PT04: JOB-CFG-13
    PT04->>BUS: EVT-CFG-18 cfg.integrity.issueDetected
    par T01
        BUS->>PT01: consume EVT-CFG-18
    and T09
        BUS->>PT09: consume EVT-CFG-18
    end
    U->>PT04: API-CFG-55
    PT04->>BUS: EVT-CFG-19 cfg.legalEntity.created y 2 tipos más
    par M05
        BUS->>PM05: consume EVT-CFG-19
    and M06
        BUS->>PM06: Crea el perfil fiscal en draft , pone en revisión ante cambio de CUIT…
    and M14
        BUS->>PM14: consume EVT-CFG-19
    and M15
        BUS->>PM15: consume EVT-CFG-19
    and M16
        BUS->>PM16: consume EVT-CFG-19
    and T03
        BUS->>PT03: consume EVT-CFG-19
    and T10
        BUS->>PT10: consume EVT-CFG-19
    end
    U->>PT04: Acción que origina el hecho
    PT04->>BUS: EVT-CFG-20 cfg.branch.created y 2 tipos más
    par M06
        BUS->>PM06: Revalida los puntos de venta de la sucursal una sucursal inactiva no…
    and M07
        BUS->>PM07: Valida cashRegisters.branchId y la entidad jurídica de la caja ( lega…
    and M09
        BUS->>PM09: consume EVT-CFG-20
    and M13
        BUS->>PM13: consume EVT-CFG-20
    and T01
        BUS->>PT01: consume EVT-CFG-20
    and T02
        BUS->>PT02: consume EVT-CFG-20
    and T03
        BUS->>PT03: Habilitar slots de marca por sucursal
    end
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-CFG-15 `cfg.geoReference.updated` | M01, M10, T10 | No declarado en el §12 del consumidor |
| EVT-CFG-16 `cfg.customField.defined` | M01, M02, M09, M10, M12, M13, M16, T10, T11 | No declarado en el §12 del consumidor |
| EVT-CFG-17 `cfg.seedPack.applied` | T01 | No declarado en el §12 del consumidor |
| EVT-CFG-18 `cfg.integrity.issueDetected` | T01, T09 | No declarado en el §12 del consumidor |
| EVT-CFG-19 `cfg.legalEntity.created` | M05, M06, M14, M15, M16, T03, T10 | M06: Crea el perfil fiscal en `draft`, pone en revisión ante cambio de CUIT o razón social, o cierra la vigencia (RN-FIS-131) |
| EVT-CFG-20 `cfg.branch.created` | M06, M07, M09, M13, T01, T02, T03 | M06: Revalida los puntos de venta de la sucursal; una sucursal inactiva no puede tener puntos de venta `active` sin reasignación (aviso en PAN-FIS-08); M07: Valida `cashRegisters.branchId` y la entidad jurídica de la ca… |

## Cobertura de la parte U

| Evento | Productor | Secuencia | También en |
|---|---|---|---|
| EVT-POR-01 | M19 | SEC-POR-01 | A7 (`06-secuencias-y-estados.md`) |
| EVT-POR-02 | M19 | SEC-POR-01 | — |
| EVT-POR-03 | M19 | SEC-POR-01 | — |
| EVT-POR-04 | M19 | SEC-POR-01 | — |
| EVT-POR-09 | M19 | SEC-POR-02 | — |
| EVT-POR-10 | M19 | SEC-POR-02 | — |
| EVT-POR-11 | M19 | SEC-POR-02 | — |
| EVT-POR-05 | M19 | SEC-POR-03 | A7 (`06-secuencias-y-estados.md`) |
| EVT-POR-06 | M19 | SEC-POR-03 | — |
| EVT-POR-07 | M19 | SEC-POR-03 | — |
| EVT-POR-08 | M19 | SEC-POR-03 | — |
| EVT-POR-12 | M19 | SEC-POR-03 | — |
| EVT-POR-13 | M19 | SEC-POR-03 | — |
| EVT-POR-14 | M19 | SEC-POR-03 | — |
| EVT-POR-15 | M19 | SEC-POR-03 | — |
| EVT-POR-16 | M19 | SEC-POR-04 | — |
| EVT-PLA-01 | T01 | SEC-PLA-01 | — |
| EVT-PLA-02 | T01 | SEC-PLA-01 | — |
| EVT-PLA-03 | T01 | SEC-PLA-01 | — |
| EVT-PLA-04 | T01 | SEC-PLA-01 | — |
| EVT-PLA-05 | T01 | SEC-PLA-01 | — |
| EVT-PLA-06 | T01 | SEC-PLA-02 | — |
| EVT-PLA-07 | T01 | SEC-PLA-02 | — |
| EVT-PLA-08 | T01 | SEC-PLA-02 | — |
| EVT-PLA-09 | T01 | SEC-PLA-02 | — |
| EVT-PLA-10 | T01 | SEC-PLA-02 | — |
| EVT-PLA-11 | T01 | SEC-PLA-02 | — |
| EVT-PLA-12 | T01 | SEC-PLA-02 | — |
| EVT-PLA-14 | T01 | SEC-PLA-02 | — |
| EVT-PLA-15 | T01 | SEC-PLA-03 | — |
| EVT-PLA-16 | T01 | SEC-PLA-03 | — |
| EVT-PLA-17 | T01 | SEC-PLA-03 | — |
| EVT-PLA-18 | T01 | SEC-PLA-03 | — |
| EVT-PLA-19 | T01 | SEC-PLA-03 | — |
| EVT-PLA-20 | T01 | SEC-PLA-03 | — |
| EVT-PLA-22 | T01 | SEC-PLA-03 | — |
| EVT-IAM-01 | T02 | SEC-IAM-01 | — |
| EVT-IAM-02 | T02 | SEC-IAM-01 | — |
| EVT-IAM-03 | T02 | SEC-IAM-01 | — |
| EVT-IAM-04 | T02 | SEC-IAM-01 | — |
| EVT-IAM-05 | T02 | SEC-IAM-01 | — |
| EVT-IAM-06 | T02 | SEC-IAM-01 | — |
| EVT-IAM-07 | T02 | SEC-IAM-01 | — |
| EVT-IAM-08 | T02 | SEC-IAM-01 | — |
| EVT-IAM-09 | T02 | SEC-IAM-02 | — |
| EVT-IAM-10 | T02 | SEC-IAM-02 | — |
| EVT-IAM-11 | T02 | SEC-IAM-02 | — |
| EVT-IAM-12 | T02 | SEC-IAM-02 | — |
| EVT-IAM-13 | T02 | SEC-IAM-02 | — |
| EVT-IAM-14 | T02 | SEC-IAM-02 | — |
| EVT-IAM-15 | T02 | SEC-IAM-02 | — |
| EVT-IAM-16 | T02 | SEC-IAM-02 | — |
| EVT-UXD-04 | T03 | SEC-UXD-01 | — |
| EVT-UXD-05 | T03 | SEC-UXD-01 | — |
| EVT-UXD-06 | T03 | SEC-UXD-01 | — |
| EVT-UXD-01 | T03 | SEC-UXD-02 | — |
| EVT-UXD-02 | T03 | SEC-UXD-02 | — |
| EVT-UXD-03 | T03 | SEC-UXD-02 | — |
| EVT-UXD-07 | T03 | SEC-UXD-02 | — |
| EVT-CFG-01 | T04 | SEC-CFG-01 | — |
| EVT-CFG-02 | T04 | SEC-CFG-01 | — |
| EVT-CFG-03 | T04 | SEC-CFG-01 | — |
| EVT-CFG-04 | T04 | SEC-CFG-01 | — |
| EVT-CFG-05 | T04 | SEC-CFG-01 | — |
| EVT-CFG-06 | T04 | SEC-CFG-01 | — |
| EVT-CFG-07 | T04 | SEC-CFG-02 | — |
| EVT-CFG-08 | T04 | SEC-CFG-02 | — |
| EVT-CFG-09 | T04 | SEC-CFG-02 | — |
| EVT-CFG-10 | T04 | SEC-CFG-02 | — |
| EVT-CFG-11 | T04 | SEC-CFG-02 | — |
| EVT-CFG-12 | T04 | SEC-CFG-02 | — |
| EVT-CFG-13 | T04 | SEC-CFG-02 | — |
| EVT-CFG-14 | T04 | SEC-CFG-02 | — |
| EVT-CFG-15 | T04 | SEC-CFG-03 | — |
| EVT-CFG-16 | T04 | SEC-CFG-03 | — |
| EVT-CFG-17 | T04 | SEC-CFG-03 | — |
| EVT-CFG-18 | T04 | SEC-CFG-03 | — |
| EVT-CFG-19 | T04 | SEC-CFG-03 | — |
| EVT-CFG-20 | T04 | SEC-CFG-03 | — |
