# GoodApps Cooperativas — Diagramas de secuencia por eventos, parte R (M08-M10)

**Entregable de análisis y diseño — Artefacto 7.3 (diagramas de secuencia), ampliación a cobertura completa**

| Campo | Valor |
|---|---|
| Documento | `06r-secuencias-eventos-m08-m10.md` |
| Índice del entregable | [`06-secuencias-y-estados.md`](06-secuencias-y-estados.md) (sección 7) y [`06a-indice-cobertura-secuencias-estados.md`](06a-indice-cobertura-secuencias-estados.md) |
| Versión | 1.0 |
| Fecha | 05-11-2026 |
| Estado | Borrador para revisión |
| Fuentes | T11 §12.2 y §12.3 (catálogo de eventos y consumidores); §12 "Eventos consumidos" y §11 de los anexos M08, M09, M10 |
| Generación | Script `_trabajo/gen06_build.py` (extrae de los anexos; revisión manual posterior) |

## 1. Cómo leer esta parte

Cada diagrama representa un flujo de negocio entre módulos construido a partir del catálogo de eventos de T11 §12.3: un agregado del productor (por ejemplo, `cat.contract.*`) con sus hechos en orden de ID, o un grupo de hechos complementarios del mismo productor cuando el agregado tiene menos de tres eventos. Todos siguen el patrón transversal de `06-secuencias-y-estados.md` §2.2 (outbox en la misma transacción, relay, inbox por consumidor, reintentos y cola de errores), que no se repite en cada diagrama.

- **U** es el origen del hecho: usuario, API o job. Se citan las API y jobs que el anexo productor nombra junto al evento.
- **BUS** es la outbox con el relay y las colas BullMQ; cada consumidor recibe su propio job.
- `par` agrupa consumidores independientes del mismo evento. El texto del mensaje es el efecto que declara el consumidor en el §12 de su anexo; "consume EVT-…" indica que el consumidor figura en T11 pero no describe el efecto. **GEN** representa consumidores genéricos de T11 ("módulo dueño del tipo", "todos").
- Debajo de cada diagrama, la tabla lista los EVT que cubre, sus consumidores externos y los efectos declarados.

## M08 — MOR Mora y financiación

### SEC-MOR-01 — MOR: Notificaciones de mora con promesa embebida

**Agregados:** `mor.notice.*`. **Productor:** M08 Mora y financiación (M08 §12; catálogo T11 §12.3).

**Cubre:** EVT-MOR-08 `mor.notice.created`, EVT-MOR-09 `mor.notice.dispatchRequested`, EVT-MOR-10 `mor.notice.evidenceMissing`.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PM08 as M08 MOR
    participant BUS as Outbox y colas (T01, T11)
    participant PM07 as M07 COB
    participant PM09 as M09 CRM
    participant PM19 as M19 POR
    participant PT09 as T09 COM
    U->>PM08: Acción que origina el hecho
    PM08->>BUS: EVT-MOR-08 mor.notice.created y 4 tipos más
    par M07
        BUS->>PM07: consume EVT-MOR-08
    and M09
        BUS->>PM09: consume EVT-MOR-08
    and M19
        BUS->>PM19: consume EVT-MOR-08
    and T09
        BUS->>PT09: Registra acuse físico ( physical_ack ).
    end
    U->>PM08: Acción que origina el hecho
    PM08->>BUS: EVT-MOR-09 mor.notice.dispatchRequested
    BUS->>PT09: Generar comunicaciones según catálogo. Los tipos sin evento ( soc.cem…
    U->>PM08: Acción que origina el hecho
    PM08->>BUS: EVT-MOR-10 mor.notice.evidenceMissing
    BUS->>PM09: consume EVT-MOR-10
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-MOR-08 `mor.notice.created` | M07, M09, M19, T09 | T09: Registra acuse físico (`physical_ack`). |
| EVT-MOR-09 `mor.notice.dispatchRequested` | T09 | T09: Generar comunicaciones según catálogo. Los tipos sin evento (`soc.cemeteryAct.scheduled`, `soc.loan.overdue`) entran por el comando `com.communications.emit` (§9.7). |
| EVT-MOR-10 `mor.notice.evidenceMissing` | M09 | No declarado en el §12 del consumidor |

### SEC-MOR-02 — MOR: hechos complementarios (Políticas de interés, Intereses diferidos, interestRun, hold, Evaluaciones de mora, batch, promise)

**Agregados:** `mor.policy.*`, `mor.interest.*`, `mor.deferredInterest.*`, `mor.interestRun.*`, `mor.hold.*`, `mor.evaluation.*`, `mor.batch.*`, `mor.promise.*`. **Productor:** M08 Mora y financiación (M08 §12; catálogo T11 §12.3).

**Cubre:** EVT-MOR-01 `mor.policy.published`, EVT-MOR-02 `mor.interest.settled`, EVT-MOR-03 `mor.deferredInterest.created`, EVT-MOR-04 `mor.interestRun.completed`, EVT-MOR-05 `mor.hold.applied`, EVT-MOR-06 `mor.evaluation.closed`, EVT-MOR-07 `mor.batch.generated`, EVT-MOR-11 `mor.promise.registered`.

Parte de estos hechos también aparece, con el detalle del caso de negocio, en A2 de `06-secuencias-y-estados.md` §3.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PM08 as M08 MOR
    participant BUS as Outbox y colas (T01, T11)
    participant PM05 as M05 FAC
    participant PM07 as M07 COB
    participant PT04 as T04 CFG
    participant PM15 as M15 CON
    participant PT10 as T10 BIA
    participant PM19 as M19 POR
    participant PM09 as M09 CRM
    U->>PM08: Acción que origina el hecho
    PM08->>BUS: EVT-MOR-01 mor.policy.published
    par M05
        BUS->>PM05: consume EVT-MOR-01
    and M07
        BUS->>PM07: consume EVT-MOR-01
    and T04
        BUS->>PT04: consume EVT-MOR-01
    end
    U->>PM08: Acción que origina el hecho
    PM08->>BUS: EVT-MOR-02 mor.interest.settled
    par M05
        BUS->>PM05: consume EVT-MOR-02
    and M07
        BUS->>PM07: Obligación de interés, reversión o reconexión.
    and M15
        BUS->>PM15: consume EVT-MOR-02
    end
    U->>PM08: Acción que origina el hecho
    PM08->>BUS: EVT-MOR-03 mor.deferredInterest.created y 2 tipos más
    par M05
        BUS->>PM05: Crea billableItems de interés facturado (o emite ND por issueInvoice…
    and M07
        BUS->>PM07: consume EVT-MOR-03
    and M15
        BUS->>PM15: consume EVT-MOR-03
    end
    U->>PM08: Acción que origina el hecho
    PM08->>BUS: EVT-MOR-04 mor.interestRun.completed y 1 tipo más
    par M05
        BUS->>PM05: consume EVT-MOR-04
    and M15
        BUS->>PM15: consume EVT-MOR-04
    and T10
        BUS->>PT10: consume EVT-MOR-04
    end
    U->>PM08: Acción que origina el hecho
    PM08->>BUS: EVT-MOR-05 mor.hold.applied y 1 tipo más
    par M07
        BUS->>PM07: consume EVT-MOR-05
    and M19
        BUS->>PM19: consume EVT-MOR-05
    end
    U->>PM08: Acción que origina el hecho
    PM08->>BUS: EVT-MOR-06 mor.evaluation.closed
    par M09
        BUS->>PM09: consume EVT-MOR-06
    and M19
        BUS->>PM19: Rol de inicio y banners
    and T10
        BUS->>PT10: consume EVT-MOR-06
    end
    U->>PM08: Acción que origina el hecho
    PM08->>BUS: EVT-MOR-07 mor.batch.generated y 1 tipo más
    BUS->>PT10: Disparo de programaciones por evento (§9.3) y snapshots de cierre
    U->>PM08: Acción que origina el hecho
    PM08->>BUS: EVT-MOR-11 mor.promise.registered y 2 tipos más
    BUS->>PM09: consume EVT-MOR-11
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-MOR-01 `mor.policy.published` | M05, M07, T04 | No declarado en el §12 del consumidor |
| EVT-MOR-02 `mor.interest.settled` | M05, M07, M15 | M07: Obligación de interés, reversión o reconexión. |
| EVT-MOR-03 `mor.deferredInterest.created` | M05, M07, M15 | M05: Crea `billableItems` de interés facturado (o emite ND por `issueInvoice`). |
| EVT-MOR-04 `mor.interestRun.completed` | M05, M15, T10 | No declarado en el §12 del consumidor |
| EVT-MOR-05 `mor.hold.applied` | M07, M19 | No declarado en el §12 del consumidor |
| EVT-MOR-06 `mor.evaluation.closed` | M09, M19, T10 | M19: Rol de inicio y banners |
| EVT-MOR-07 `mor.batch.generated` | T10 | T10: Disparo de programaciones por evento (§9.3) y snapshots de cierre |
| EVT-MOR-11 `mor.promise.registered` | M09 | No declarado en el §12 del consumidor |

### SEC-MOR-03 — MOR: hechos complementarios (interruption, Convenios con firmantes embebidos, Cuotas de convenio, Garantías y garantes, Expedientes de ges…)

**Agregados:** `mor.interruption.*`, `mor.agreement.*`, `mor.installment.*`, `mor.guarantee.*`, `mor.collectionCase.*`, `mor.writeOff.*`, `mor.prescription.*`. **Productor:** M08 Mora y financiación (M08 §12; catálogo T11 §12.3).

**Cubre:** EVT-MOR-12 `mor.interruption.requested`, EVT-MOR-13 `mor.interruption.executed`, EVT-MOR-14 `mor.agreement.created`, EVT-MOR-15 `mor.installment.due`, EVT-MOR-16 `mor.guarantee.executed`, EVT-MOR-17 `mor.collectionCase.opened`, EVT-MOR-18 `mor.writeOff.approved`, EVT-MOR-19 `mor.prescription.executed`.

**API y jobs disparadores (citados junto al evento en el anexo productor):** JOB-MOR-07.

Parte de estos hechos también aparece, con el detalle del caso de negocio, en A4 de `06-secuencias-y-estados.md` §3.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PM08 as M08 MOR
    participant BUS as Outbox y colas (T01, T11)
    participant PM02 as M02 CAT
    participant PM03 as M03 MED
    participant PM09 as M09 CRM
    participant PM10 as M10 TEC
    participant PM19 as M19 POR
    participant PM01 as M01 PER
    participant PM05 as M05 FAC
    participant PM16 as M16 SUE
    participant PT09 as T09 COM
    participant PM07 as M07 COB
    participant PM15 as M15 CON
    participant PM17 as M17 INS
    participant PM14 as M14 TES
    participant PT10 as T10 BIA
    U->>PM08: Acción que origina el hecho
    PM08->>BUS: EVT-MOR-12 mor.interruption.requested y 3 tipos más
    par M02
        BUS->>PM02: T08 / T09-T11 / trámite de cambio de plan o categoría a prepago.
    and M03
        BUS->>PM03: Operación remota si el medidor lo admite (o informa no remoto ).
    and M09
        BUS->>PM09: consume EVT-MOR-12
    and M10
        BUS->>PM10: Ejecutar o cancelar corte (9.5) con serviceMode = restricted , perfil…
    and M19
        BUS->>PM19: consume EVT-MOR-12
    end
    U->>PM08: Acción que origina el hecho
    PM08->>BUS: EVT-MOR-13 mor.interruption.executed y 2 tipos más
    par M01
        BUS->>PM01: consume EVT-MOR-13
    and M02
        BUS->>PM02: consume EVT-MOR-13
    and M05
        BUS->>PM05: consume EVT-MOR-13
    and M09
        BUS->>PM09: Comandos de reactivación avisos
    and M16
        BUS->>PM16: Tareas extra por ejecutor
    and M19
        BUS->>PM19: Rol de inicio y banners
    and T09
        BUS->>PT09: consume EVT-MOR-13
    end
    U->>PM08: JOB-MOR-07
    PM08->>BUS: EVT-MOR-14 mor.agreement.created y 6 tipos más
    par M05
        BUS->>PM05: consume EVT-MOR-14
    and M07
        BUS->>PM07: Marca lifecycle.agreementId obligaciones de cuotas.
    and M15
        BUS->>PM15: consume EVT-MOR-14
    and M17
        BUS->>PM17: Capital incluido en financiación / reversión.
    and M19
        BUS->>PM19: Rol de inicio y banners
    end
    U->>PM08: Acción que origina el hecho
    PM08->>BUS: EVT-MOR-15 mor.installment.due y 1 tipo más
    par M05
        BUS->>PM05: consume EVT-MOR-15
    and T09
        BUS->>PT09: consume EVT-MOR-15
    end
    U->>PM08: Acción que origina el hecho
    PM08->>BUS: EVT-MOR-16 mor.guarantee.executed y 2 tipos más
    par M07
        BUS->>PM07: Saldo a favor con origin = guaranteeRefund (RF-COB-190 HUECO-OTR-04).
    and M14
        BUS->>PM14: consume EVT-MOR-16
    and M15
        BUS->>PM15: consume EVT-MOR-16
    end
    U->>PM08: Acción que origina el hecho
    PM08->>BUS: EVT-MOR-17 mor.collectionCase.opened y 2 tipos más
    par M01
        BUS->>PM01: Actualiza indicators.inLegalProceedings .
    and M15
        BUS->>PM15: consume EVT-MOR-17
    and T10
        BUS->>PT10: consume EVT-MOR-17
    end
    U->>PM08: Acción que origina el hecho
    PM08->>BUS: EVT-MOR-18 mor.writeOff.approved y 1 tipo más
    par M07
        BUS->>PM07: Marca de ciclo de vida e imputación tipo writeOff . Los plazos de pre…
    and M15
        BUS->>PM15: consume EVT-MOR-18
    end
    U->>PM08: Acción que origina el hecho
    PM08->>BUS: EVT-MOR-19 mor.prescription.executed
    par M05
        BUS->>PM05: consume EVT-MOR-19
    and M07
        BUS->>PM07: Marca de ciclo de vida e imputación tipo writeOff . Los plazos de pre…
    and M15
        BUS->>PM15: consume EVT-MOR-19
    end
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-MOR-12 `mor.interruption.requested` | M02, M03, M09, M10, M19 | M02: T08 / T09-T11 / trámite de cambio de plan o categoría a prepago.; M03: Operación remota si el medidor lo admite (o informa "no remoto").; M10: Ejecutar o cancelar corte (9.5); con `serviceMode = restricted`, perfil… |
| EVT-MOR-13 `mor.interruption.executed` | M01, M02, M05, M09, M16, M19, T09 | M09: Comandos de reactivación; avisos; M16: Tareas extra por ejecutor; M19: Rol de inicio y banners |
| EVT-MOR-14 `mor.agreement.created` | M05, M07, M15, M17, M19 | M07: Marca `lifecycle.agreementId`; obligaciones de cuotas.; M17: Capital incluido en financiación / reversión.; M19: Rol de inicio y banners |
| EVT-MOR-15 `mor.installment.due` | M05, T09 | No declarado en el §12 del consumidor |
| EVT-MOR-16 `mor.guarantee.executed` | M07, M14, M15 | M07: Saldo a favor con `origin = guaranteeRefund` (RF-COB-190; HUECO-OTR-04). |
| EVT-MOR-17 `mor.collectionCase.opened` | M01, M15, T10 | M01: Actualiza `indicators.inLegalProceedings`. |
| EVT-MOR-18 `mor.writeOff.approved` | M07, M15 | M07: Marca de ciclo de vida e imputación tipo `writeOff`. Los plazos de prescripción (24 meses para facturas periódicas, 60 para el resto, con validación legal) los define M08 en `prescriptionRules` (DEC-052); M07 no ca… |
| EVT-MOR-19 `mor.prescription.executed` | M05, M07, M15 | M07: Marca de ciclo de vida e imputación tipo `writeOff`. Los plazos de prescripción (24 meses para facturas periódicas, 60 para el resto, con validación legal) los define M08 en `prescriptionRules` (DEC-052); M07 no ca… |

### SEC-MOR-04 — MOR: hechos complementarios (Protecciones normativas acreditadas, socialCoverage)

**Agregados:** `mor.protection.*`, `mor.socialCoverage.*`. **Productor:** M08 Mora y financiación (M08 §12; catálogo T11 §12.3).

**Cubre:** EVT-MOR-20 `mor.protection.expiring`, EVT-MOR-21 `mor.socialCoverage.suspended`.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PM08 as M08 MOR
    participant BUS as Outbox y colas (T01, T11)
    participant PM09 as M09 CRM
    participant PM18 as M18 SOC
    participant PM19 as M19 POR
    participant PT09 as T09 COM
    U->>PM08: Acción que origina el hecho
    PM08->>BUS: EVT-MOR-20 mor.protection.expiring y 1 tipo más
    BUS->>PM09: consume EVT-MOR-20
    U->>PM08: Acción que origina el hecho
    PM08->>BUS: EVT-MOR-21 mor.socialCoverage.suspended y 1 tipo más
    par M18
        BUS->>PM18: consume EVT-MOR-21
    and M19
        BUS->>PM19: consume EVT-MOR-21
    and T09
        BUS->>PT09: consume EVT-MOR-21
    end
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-MOR-20 `mor.protection.expiring` | M09 | No declarado en el §12 del consumidor |
| EVT-MOR-21 `mor.socialCoverage.suspended` | M18, M19, T09 | No declarado en el §12 del consumidor |

## M09 — CRM Atención (CRM)

### SEC-CRM-01 — CRM: case (parte 1 de 2)

**Agregados:** `crm.case.*`. **Productor:** M09 Atención (CRM) (M09 §12; catálogo T11 §12.3).

**Cubre:** EVT-CRM-01 `crm.case.created`, EVT-CRM-02 `crm.case.classified`, EVT-CRM-03 `crm.case.derived`, EVT-CRM-04 `crm.case.assigned`, EVT-CRM-05 `crm.case.statusChanged`, EVT-CRM-06 `crm.case.slaWarning`, EVT-CRM-07 `crm.case.slaBreached`, EVT-CRM-08 `crm.case.resolved`, EVT-CRM-09 `crm.case.closed`, EVT-CRM-10 `crm.case.reopened`.

**API y jobs disparadores (citados junto al evento en el anexo productor):** JOB-CRM-01.

Parte de estos hechos también aparece, con el detalle del caso de negocio, en A5 de `06-secuencias-y-estados.md` §3.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PM09 as M09 CRM
    participant BUS as Outbox y colas (T01, T11)
    participant PT09 as T09 COM
    participant PT10 as T10 BIA
    participant PT11 as T11 WFL
    participant PM08 as M08 MOR
    participant PM19 as M19 POR
    participant PM10 as M10 TEC
    U->>PM09: Acción que origina el hecho
    PM09->>BUS: EVT-CRM-01 crm.case.created
    par T09
        BUS->>PT09: Generar comunicaciones según catálogo. Los tipos sin evento ( soc.cem…
    and T10
        BUS->>PT10: consume EVT-CRM-01
    end
    U->>PM09: Acción que origina el hecho
    PM09->>BUS: EVT-CRM-02 crm.case.classified
    BUS->>PT10: consume EVT-CRM-02
    U->>PM09: Acción que origina el hecho
    PM09->>BUS: EVT-CRM-03 crm.case.derived
    par T09
        BUS->>PT09: consume EVT-CRM-03
    and T11
        BUS->>PT11: consume EVT-CRM-03
    end
    U->>PM09: Acción que origina el hecho
    PM09->>BUS: EVT-CRM-04 crm.case.assigned
    par T09
        BUS->>PT09: consume EVT-CRM-04
    and T11
        BUS->>PT11: consume EVT-CRM-04
    end
    U->>PM09: Acción que origina el hecho
    PM09->>BUS: EVT-CRM-05 crm.case.statusChanged
    par M08
        BUS->>PM08: Libera la protección temporal al resolverse, cerrarse o cancelarse el…
    and M19
        BUS->>PM19: Línea de tiempo, avisos, observaciones a responder. Campos usados cas…
    and T09
        BUS->>PT09: consume EVT-CRM-05
    and T10
        BUS->>PT10: consume EVT-CRM-05
    and T11
        BUS->>PT11: consume EVT-CRM-05
    end
    U->>PM09: JOB-CRM-01
    PM09->>BUS: EVT-CRM-06 crm.case.slaWarning
    BUS->>PT09: consume EVT-CRM-06
    U->>PM09: Acción que origina el hecho
    PM09->>BUS: EVT-CRM-07 crm.case.slaBreached
    par T09
        BUS->>PT09: consume EVT-CRM-07
    and T10
        BUS->>PT10: consume EVT-CRM-07
    end
    U->>PM09: Acción que origina el hecho
    PM09->>BUS: EVT-CRM-08 crm.case.resolved
    par M19
        BUS->>PM19: consume EVT-CRM-08
    and T09
        BUS->>PT09: consume EVT-CRM-08
    end
    U->>PM09: Acción que origina el hecho
    PM09->>BUS: EVT-CRM-09 crm.case.closed
    par M10
        BUS->>PM10: consume EVT-CRM-09
    and T09
        BUS->>PT09: consume EVT-CRM-09
    and T10
        BUS->>PT10: consume EVT-CRM-09
    end
    U->>PM09: Acción que origina el hecho
    PM09->>BUS: EVT-CRM-10 crm.case.reopened
    BUS->>PT10: consume EVT-CRM-10
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-CRM-01 `crm.case.created` | T09, T10 | T09: Generar comunicaciones según catálogo. Los tipos sin evento (`soc.cemeteryAct.scheduled`, `soc.loan.overdue`) entran por el comando `com.communications.emit` (§9.7). |
| EVT-CRM-02 `crm.case.classified` | T10 | No declarado en el §12 del consumidor |
| EVT-CRM-03 `crm.case.derived` | T09, T11 | No declarado en el §12 del consumidor |
| EVT-CRM-04 `crm.case.assigned` | T09, T11 | No declarado en el §12 del consumidor |
| EVT-CRM-05 `crm.case.statusChanged` | M08, M19, T09, T10, T11 | M08: Libera la protección temporal al resolverse, cerrarse o cancelarse el reclamo.; M19: Línea de tiempo, avisos, observaciones a responder. Campos usados: `caseId`, `from`, `to`, `publicStatusKey` (EVT-CRM-05); `caseI`… |
| EVT-CRM-06 `crm.case.slaWarning` | T09 | No declarado en el §12 del consumidor |
| EVT-CRM-07 `crm.case.slaBreached` | T09, T10 | No declarado en el §12 del consumidor |
| EVT-CRM-08 `crm.case.resolved` | M19, T09 | No declarado en el §12 del consumidor |
| EVT-CRM-09 `crm.case.closed` | M10, T09, T10 | No declarado en el §12 del consumidor |
| EVT-CRM-10 `crm.case.reopened` | T10 | No declarado en el §12 del consumidor |

### SEC-CRM-02 — CRM: case (parte 2 de 2)

**Agregados:** `crm.case.*`. **Productor:** M09 Atención (CRM) (M09 §12; catálogo T11 §12.3).

**Cubre:** EVT-CRM-11 `crm.case.cancelled`, EVT-CRM-12 `crm.case.merged`.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PM09 as M09 CRM
    participant BUS as Outbox y colas (T01, T11)
    participant PM02 as M02 CAT
    participant PM11 as M11 VEN
    participant PT10 as T10 BIA
    U->>PM09: Acción que origina el hecho
    PM09->>BUS: EVT-CRM-11 crm.case.cancelled
    par M02
        BUS->>PM02: Anula contrato no activado (T13) o desiste baja (T12 reversión). M02…
    and M11
        BUS->>PM11: consume EVT-CRM-11
    and T10
        BUS->>PT10: consume EVT-CRM-11
    end
    U->>PM09: Acción que origina el hecho
    PM09->>BUS: EVT-CRM-12 crm.case.merged
    BUS->>PT10: consume EVT-CRM-12
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-CRM-11 `crm.case.cancelled` | M02, M11, T10 | M02: Anula contrato no activado (T13) o desiste baja (T12 reversión). M02 lo consume aunque T11 no lo lista como consumidor (se informa a T11, 05-11-2026). |
| EVT-CRM-12 `crm.case.merged` | T10 | No declarado en el §12 del consumidor |

### SEC-CRM-03 — CRM: hechos complementarios (Comandos a módulos dueños, cancellationRequest, Incidentes comunes por zona, Mensajes y notas, Hilos por cana…)

**Agregados:** `crm.commandRequest.*`, `crm.cancellationRequest.*`, `crm.incident.*`, `crm.message.*`, `crm.conversation.*`, `crm.aiSuggestion.*`, `crm.queueTicket.*`. **Productor:** M09 Atención (CRM) (M09 §12; catálogo T11 §12.3).

**Cubre:** EVT-CRM-13 `crm.commandRequest.requested`, EVT-CRM-14 `crm.cancellationRequest.received`, EVT-CRM-15 `crm.cancellationRequest.receiptDelivered`, EVT-CRM-16 `crm.incident.confirmed`, EVT-CRM-17 `crm.message.received`, EVT-CRM-18 `crm.conversation.handedOff`, EVT-CRM-19 `crm.aiSuggestion.recorded`, EVT-CRM-20 `crm.queueTicket.issued`.

Parte de estos hechos también aparece, con el detalle del caso de negocio, en A5 de `06-secuencias-y-estados.md` §3.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PM09 as M09 CRM
    participant BUS as Outbox y colas (T01, T11)
    participant PM02 as M02 CAT
    participant PM04 as M04 TAR
    participant PM05 as M05 FAC
    participant PM07 as M07 COB
    participant PM08 as M08 MOR
    participant PM10 as M10 TEC
    participant PM11 as M11 VEN
    participant PT09 as T09 COM
    participant PT10 as T10 BIA
    participant PM19 as M19 POR
    participant PT08 as T08 NFR
    U->>PM09: Acción que origina el hecho
    PM09->>BUS: EVT-CRM-13 crm.commandRequest.requested
    par M02
        BUS->>PM02: Crea contrato requested (T01) con el comando cat.contract.create o ej…
    and M04
        BUS->>PM04: consume EVT-CRM-13
    and M05
        BUS->>PM05: consume EVT-CRM-13
    and M07
        BUS->>PM07: consume EVT-CRM-13
    and M08
        BUS->>PM08: Protección temporal sobre documentos reclamados crea caso de interrup…
    and M10
        BUS->>PM10: Crear OT derivada con crmCaseId y categoría.
    and M11
        BUS->>PM11: consume EVT-CRM-13
    end
    U->>PM09: Acción que origina el hecho
    PM09->>BUS: EVT-CRM-14 crm.cancellationRequest.received
    par T09
        BUS->>PT09: consume EVT-CRM-14
    and T10
        BUS->>PT10: consume EVT-CRM-14
    end
    U->>PM09: Acción que origina el hecho
    PM09->>BUS: EVT-CRM-15 crm.cancellationRequest.receiptDelivered y 1 tipo más
    BUS->>PT10: consume EVT-CRM-15
    U->>PM09: Acción que origina el hecho
    PM09->>BUS: EVT-CRM-16 crm.incident.confirmed y 3 tipos más
    par M10
        BUS->>PM10: consume EVT-CRM-16
    and M19
        BUS->>PM19: consume EVT-CRM-16
    and T09
        BUS->>PT09: consume EVT-CRM-16
    and T10
        BUS->>PT10: consume EVT-CRM-16
    end
    U->>PM09: Acción que origina el hecho
    PM09->>BUS: EVT-CRM-17 crm.message.received y 1 tipo más
    par M19
        BUS->>PM19: Línea de tiempo, avisos, observaciones a responder. Campos usados cas…
    and T10
        BUS->>PT10: consume EVT-CRM-17
    end
    U->>PM09: Acción que origina el hecho
    PM09->>BUS: EVT-CRM-18 crm.conversation.handedOff
    BUS->>PT10: consume EVT-CRM-18
    U->>PM09: Acción que origina el hecho
    PM09->>BUS: EVT-CRM-19 crm.aiSuggestion.recorded y 1 tipo más
    par T08
        BUS->>PT08: consume EVT-CRM-19
    and T10
        BUS->>PT10: consume EVT-CRM-19
    end
    U->>PM09: Acción que origina el hecho
    PM09->>BUS: EVT-CRM-20 crm.queueTicket.issued y 2 tipos más
    par T09
        BUS->>PT09: consume EVT-CRM-20
    and T10
        BUS->>PT10: consume EVT-CRM-20
    end
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-CRM-13 `crm.commandRequest.requested` | M02, M04, M05, M07, M08, M10, M11 | M02: Crea contrato `requested` (T01) con el comando `cat.contract.create` o ejecuta el comando pedido (baja, suspensión, cambio). Si no puede ejecutarlo publica EVT-CAT-27 `cat.command.rejected`.; M08: Protección tempor… |
| EVT-CRM-14 `crm.cancellationRequest.received` | T09, T10 | No declarado en el §12 del consumidor |
| EVT-CRM-15 `crm.cancellationRequest.receiptDelivered` | T10 | No declarado en el §12 del consumidor |
| EVT-CRM-16 `crm.incident.confirmed` | M10, M19, T09, T10 | No declarado en el §12 del consumidor |
| EVT-CRM-17 `crm.message.received` | M19, T10 | M19: Línea de tiempo, avisos, observaciones a responder. Campos usados: `caseId`, `from`, `to`, `publicStatusKey` (EVT-CRM-05); `caseId`, `resolutionCode` (EVT-CRM-08); `messageId`, `conversationId`, `channel` (EVT-CRM-… |
| EVT-CRM-18 `crm.conversation.handedOff` | T10 | No declarado en el §12 del consumidor |
| EVT-CRM-19 `crm.aiSuggestion.recorded` | T08, T10 | No declarado en el §12 del consumidor |
| EVT-CRM-20 `crm.queueTicket.issued` | T09, T10 | No declarado en el §12 del consumidor |

### SEC-CRM-04 — CRM: hechos complementarios (Ocurrencias de actividades, deskEntry, Trámites presentados, Corridas de circulares, survey)

**Agregados:** `crm.activityOccurrence.*`, `crm.deskEntry.*`, `crm.procedureRecord.*`, `crm.circularRun.*`, `crm.survey.*`. **Productor:** M09 Atención (CRM) (M09 §12; catálogo T11 §12.3).

**Cubre:** EVT-CRM-21 `crm.activityOccurrence.generated`, EVT-CRM-22 `crm.deskEntry.registered`, EVT-CRM-23 `crm.procedureRecord.expired`, EVT-CRM-24 `crm.circularRun.generated`, EVT-CRM-25 `crm.survey.negativeReceived`.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PM09 as M09 CRM
    participant BUS as Outbox y colas (T01, T11)
    participant PT09 as T09 COM
    participant PT10 as T10 BIA
    participant PT11 as T11 WFL
    participant PM02 as M02 CAT
    participant PM04 as M04 TAR
    participant PM07 as M07 COB
    U->>PM09: Acción que origina el hecho
    PM09->>BUS: EVT-CRM-21 crm.activityOccurrence.generated y 2 tipos más
    par T09
        BUS->>PT09: consume EVT-CRM-21
    and T10
        BUS->>PT10: consume EVT-CRM-21
    and T11
        BUS->>PT11: consume EVT-CRM-21
    end
    U->>PM09: Acción que origina el hecho
    PM09->>BUS: EVT-CRM-22 crm.deskEntry.registered y 2 tipos más
    par T10
        BUS->>PT10: consume EVT-CRM-22
    and T11
        BUS->>PT11: consume EVT-CRM-22
    end
    U->>PM09: Acción que origina el hecho
    PM09->>BUS: EVT-CRM-23 crm.procedureRecord.expired
    par M02
        BUS->>PM02: consume EVT-CRM-23
    and M04
        BUS->>PM04: consume EVT-CRM-23
    and M07
        BUS->>PM07: consume EVT-CRM-23
    end
    U->>PM09: Acción que origina el hecho
    PM09->>BUS: EVT-CRM-24 crm.circularRun.generated
    BUS->>PT09: consume EVT-CRM-24
    U->>PM09: Acción que origina el hecho
    PM09->>BUS: EVT-CRM-25 crm.survey.negativeReceived
    BUS->>PT11: consume EVT-CRM-25
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-CRM-21 `crm.activityOccurrence.generated` | T09, T10, T11 | No declarado en el §12 del consumidor |
| EVT-CRM-22 `crm.deskEntry.registered` | T10, T11 | No declarado en el §12 del consumidor |
| EVT-CRM-23 `crm.procedureRecord.expired` | M02, M04, M07 | No declarado en el §12 del consumidor |
| EVT-CRM-24 `crm.circularRun.generated` | T09 | No declarado en el §12 del consumidor |
| EVT-CRM-25 `crm.survey.negativeReceived` | T11 | No declarado en el §12 del consumidor |

## M10 — TEC Técnica, campo y redes

### SEC-TEC-01 — TEC: feasibility

**Agregados:** `tec.feasibility.*`. **Productor:** M10 Técnica, campo y redes (M10 §12; catálogo T11 §12.3).

**Cubre:** EVT-TEC-01 `tec.feasibility.requested`, EVT-TEC-02 `tec.feasibility.verdictIssued`, EVT-TEC-03 `tec.feasibility.cancelled`.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PM10 as M10 TEC
    participant BUS as Outbox y colas (T01, T11)
    participant PM09 as M09 CRM
    participant PT09 as T09 COM
    participant PM02 as M02 CAT
    participant PM11 as M11 VEN
    U->>PM10: Acción que origina el hecho
    PM10->>BUS: EVT-TEC-01 tec.feasibility.requested
    par M09
        BUS->>PM09: consume EVT-TEC-01
    and T09
        BUS->>PT09: Generar comunicaciones según catálogo. Los tipos sin evento ( soc.cem…
    end
    U->>PM10: Acción que origina el hecho
    PM10->>BUS: EVT-TEC-02 tec.feasibility.verdictIssued
    par M02
        BUS->>PM02: T03 / T04.
    and M09
        BUS->>PM09: Avanza evaluación
    and M11
        BUS->>PM11: consume EVT-TEC-02
    and T09
        BUS->>PT09: consume EVT-TEC-02
    end
    U->>PM10: Acción que origina el hecho
    PM10->>BUS: EVT-TEC-03 tec.feasibility.cancelled
    BUS->>PM09: consume EVT-TEC-03
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-TEC-01 `tec.feasibility.requested` | M09, T09 | T09: Generar comunicaciones según catálogo. Los tipos sin evento (`soc.cemeteryAct.scheduled`, `soc.loan.overdue`) entran por el comando `com.communications.emit` (§9.7). |
| EVT-TEC-02 `tec.feasibility.verdictIssued` | M02, M09, M11, T09 | M02: T03 / T04.; M09: Avanza evaluación |
| EVT-TEC-03 `tec.feasibility.cancelled` | M09 | No declarado en el §12 del consumidor |

### SEC-TEC-02 — TEC: Órdenes de trabajo

**Agregados:** `tec.workOrder.*`. **Productor:** M10 Técnica, campo y redes (M10 §12; catálogo T11 §12.3).

**Cubre:** EVT-TEC-04 `tec.workOrder.created`, EVT-TEC-05 `tec.workOrder.statusChanged`, EVT-TEC-06 `tec.workOrder.executed`, EVT-TEC-07 `tec.workOrder.closed`, EVT-TEC-08 `tec.workOrder.cancelled`, EVT-TEC-09 `tec.workOrder.reopened`.

Parte de estos hechos también aparece, con el detalle del caso de negocio, en A4, A5 de `06-secuencias-y-estados.md` §3.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PM10 as M10 TEC
    participant BUS as Outbox y colas (T01, T11)
    participant PM02 as M02 CAT
    participant PM09 as M09 CRM
    participant PM15 as M15 CON
    participant PM19 as M19 POR
    participant PT09 as T09 COM
    participant PM13 as M13 STK
    participant PM18 as M18 SOC
    participant PT11 as T11 WFL
    participant PM01 as M01 PER
    participant PM03 as M03 MED
    participant PM04 as M04 TAR
    participant PM05 as M05 FAC
    participant PM08 as M08 MOR
    participant PM11 as M11 VEN
    participant PM16 as M16 SUE
    U->>PM10: Acción que origina el hecho
    PM10->>BUS: EVT-TEC-04 tec.workOrder.created
    par M02
        BUS->>PM02: Dispara reglas automáticas de evento OT.
    and M09
        BUS->>PM09: Timeline, avisos al socio, conformidad, conflicto (ESC-03)
    and M15
        BUS->>PM15: consume EVT-TEC-04
    and M19
        BUS->>PM19: OT visibles
    and T09
        BUS->>PT09: consume EVT-TEC-04
    end
    U->>PM10: Acción que origina el hecho
    PM10->>BUS: EVT-TEC-05 tec.workOrder.statusChanged
    par M09
        BUS->>PM09: consume EVT-TEC-05
    and M13
        BUS->>PM13: Crear/ajustar reservas.
    and M18
        BUS->>PM18: Usos de vehículo (asignación y cierre de la OT).
    and M19
        BUS->>PM19: consume EVT-TEC-05
    and T11
        BUS->>PT11: consume EVT-TEC-05
    end
    U->>PM10: Acción que origina el hecho
    PM10->>BUS: EVT-TEC-06 tec.workOrder.executed
    par M09
        BUS->>PM09: consume EVT-TEC-06
    and M13
        BUS->>PM13: consume EVT-TEC-06
    end
    U->>PM10: Acción que origina el hecho
    PM10->>BUS: EVT-TEC-07 tec.workOrder.closed
    par M01
        BUS->>PM01: consume EVT-TEC-07
    and M02
        BUS->>PM02: Según purpose activación, reconexión, desconexión, cambio de domicili…
    and M03
        BUS->>PM03: consume EVT-TEC-07
    and M04
        BUS->>PM04: Categoría histórica (RN-TAR-045).
    and M05
        BUS->>PM05: consume EVT-TEC-07
    and M08
        BUS->>PM08: Transición del caso de interrupción. tec.disconnection.executed trae…
    and M09
        BUS->>PM09: consume EVT-TEC-07
    and M11
        BUS->>PM11: consume EVT-TEC-07
    and M13
        BUS->>PM13: Verificar que consumo/aplicación estén conciliados con el resultado.…
    and M15
        BUS->>PM15: consume EVT-TEC-07
    and M16
        BUS->>PM16: Proponer / actualizar novedades (JOB-SUE-07)
    and M18
        BUS->>PM18: consume EVT-TEC-07
    and M19
        BUS->>PM19: consume EVT-TEC-07
    end
    U->>PM10: Acción que origina el hecho
    PM10->>BUS: EVT-TEC-08 tec.workOrder.cancelled
    par M03
        BUS->>PM03: consume EVT-TEC-08
    and M08
        BUS->>PM08: consume EVT-TEC-08
    and M09
        BUS->>PM09: consume EVT-TEC-08
    and M13
        BUS->>PM13: consume EVT-TEC-08
    end
    U->>PM10: Acción que origina el hecho
    PM10->>BUS: EVT-TEC-09 tec.workOrder.reopened
    par M05
        BUS->>PM05: consume EVT-TEC-09
    and M09
        BUS->>PM09: consume EVT-TEC-09
    and M16
        BUS->>PM16: Proponer / actualizar novedades (JOB-SUE-07)
    end
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-TEC-04 `tec.workOrder.created` | M02, M09, M15, M19, T09 | M02: Dispara reglas automáticas de evento OT.; M09: Timeline, avisos al socio, conformidad, conflicto (ESC-03); M19: OT visibles |
| EVT-TEC-05 `tec.workOrder.statusChanged` | M09, M13, M18, M19, T11 | M13: Crear/ajustar reservas.; M18: Usos de vehículo (asignación y cierre de la OT). |
| EVT-TEC-06 `tec.workOrder.executed` | M09, M13 | No declarado en el §12 del consumidor |
| EVT-TEC-07 `tec.workOrder.closed` | M01, M02, M03, M04, M05, M08, M09, M11, M13, M15, M16, M18, M19 | M02: Según `purpose`: activación, reconexión, desconexión, cambio de domicilio, cambio de categoría diferido.; M04: Categoría histórica (RN-TAR-045).; M08: Transición del caso de interrupción. `tec.disconnection.execute`… |
| EVT-TEC-08 `tec.workOrder.cancelled` | M03, M08, M09, M13 | No declarado en el §12 del consumidor |
| EVT-TEC-09 `tec.workOrder.reopened` | M05, M09, M16 | M16: Proponer / actualizar novedades (JOB-SUE-07) |

### SEC-TEC-03 — TEC: hechos complementarios (charge, Materiales y necesidades, equipment, Visitas, Conformidad y firma, installation, survey)

**Agregados:** `tec.charge.*`, `tec.material.*`, `tec.equipment.*`, `tec.visit.*`, `tec.conformity.*`, `tec.installation.*`, `tec.survey.*`. **Productor:** M10 Técnica, campo y redes (M10 §12; catálogo T11 §12.3).

**Cubre:** EVT-TEC-10 `tec.charge.proposed`, EVT-TEC-11 `tec.material.requested`, EVT-TEC-12 `tec.equipment.installed`, EVT-TEC-13 `tec.visit.statusChanged`, EVT-TEC-14 `tec.visit.failed`, EVT-TEC-15 `tec.conformity.signed`, EVT-TEC-16 `tec.installation.activationConfirmed`, EVT-TEC-17 `tec.survey.requested`.

**API y jobs disparadores (citados junto al evento en el anexo productor):** JOB-TEC-08, API-TEC-40.

Parte de estos hechos también aparece, con el detalle del caso de negocio, en A5 de `06-secuencias-y-estados.md` §3.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PM10 as M10 TEC
    participant BUS as Outbox y colas (T01, T11)
    participant PM04 as M04 TAR
    participant PM05 as M05 FAC
    participant PM12 as M12 CMP
    participant PM13 as M13 STK
    participant PM02 as M02 CAT
    participant PM09 as M09 CRM
    participant PM19 as M19 POR
    participant PT09 as T09 COM
    participant PT11 as T11 WFL
    participant PM08 as M08 MOR
    U->>PM10: Acción que origina el hecho
    PM10->>BUS: EVT-TEC-10 tec.charge.proposed
    par M04
        BUS->>PM04: consume EVT-TEC-10
    and M05
        BUS->>PM05: consume EVT-TEC-10
    end
    U->>PM10: Acción que origina el hecho
    PM10->>BUS: EVT-TEC-11 tec.material.requested y 2 tipos más
    par M12
        BUS->>PM12: consume EVT-TEC-11
    and M13
        BUS->>PM13: consume EVT-TEC-11
    end
    U->>PM10: Acción que origina el hecho
    PM10->>BUS: EVT-TEC-12 tec.equipment.installed y 1 tipo más
    par M02
        BUS->>PM02: consume EVT-TEC-12
    and M13
        BUS->>PM13: consume EVT-TEC-12
    end
    U->>PM10: JOB-TEC-08, API-TEC-40
    PM10->>BUS: EVT-TEC-13 tec.visit.statusChanged
    par M09
        BUS->>PM09: Timeline, avisos al socio, conformidad, conflicto (ESC-03)
    and M19
        BUS->>PM19: Visitas, ETA, conformidad
    and T09
        BUS->>PT09: consume EVT-TEC-13
    and T11
        BUS->>PT11: consume EVT-TEC-13
    end
    U->>PM10: Acción que origina el hecho
    PM10->>BUS: EVT-TEC-14 tec.visit.failed
    par M02
        BUS->>PM02: T07 (registro).
    and M04
        BUS->>PM04: consume EVT-TEC-14
    and M05
        BUS->>PM05: consume EVT-TEC-14
    and M08
        BUS->>PM08: Transición del caso de interrupción. tec.disconnection.executed trae…
    and M09
        BUS->>PM09: consume EVT-TEC-14
    and M13
        BUS->>PM13: consume EVT-TEC-14
    and M19
        BUS->>PM19: Visitas, ETA, conformidad
    end
    U->>PM10: Acción que origina el hecho
    PM10->>BUS: EVT-TEC-15 tec.conformity.signed y 1 tipo más
    par M02
        BUS->>PM02: consume EVT-TEC-15
    and M09
        BUS->>PM09: Timeline, avisos al socio, conformidad, conflicto (ESC-03)
    end
    U->>PM10: Acción que origina el hecho
    PM10->>BUS: EVT-TEC-16 tec.installation.activationConfirmed
    par M02
        BUS->>PM02: T06 / T10.
    and M04
        BUS->>PM04: Disparador de cargos por evento (instalación) y de promociones con st…
    and M05
        BUS->>PM05: consume EVT-TEC-16
    and M09
        BUS->>PM09: consume EVT-TEC-16
    and T09
        BUS->>PT09: consume EVT-TEC-16
    end
    U->>PM10: Acción que origina el hecho
    PM10->>BUS: EVT-TEC-17 tec.survey.requested
    BUS->>PT09: consume EVT-TEC-17
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-TEC-10 `tec.charge.proposed` | M04, M05 | No declarado en el §12 del consumidor |
| EVT-TEC-11 `tec.material.requested` | M12, M13 | No declarado en el §12 del consumidor |
| EVT-TEC-12 `tec.equipment.installed` | M02, M13 | No declarado en el §12 del consumidor |
| EVT-TEC-13 `tec.visit.statusChanged` | M09, M19, T09, T11 | M09: Timeline, avisos al socio, conformidad, conflicto (ESC-03); M19: Visitas, ETA, conformidad |
| EVT-TEC-14 `tec.visit.failed` | M02, M04, M05, M08, M09, M13, M19 | M02: T07 (registro).; M08: Transición del caso de interrupción. `tec.disconnection.executed` trae `mode` (`restricted`/`interrupted`): M08 lo compara con el `serviceMode` del caso; si difiere, registra la diferencia en… |
| EVT-TEC-15 `tec.conformity.signed` | M02, M09 | M09: Timeline, avisos al socio, conformidad, conflicto (ESC-03) |
| EVT-TEC-16 `tec.installation.activationConfirmed` | M02, M04, M05, M09, T09 | M02: T06 / T10.; M04: Disparador de cargos por evento (instalación) y de promociones con `startTrigger = installation`. |
| EVT-TEC-17 `tec.survey.requested` | T09 | No declarado en el §12 del consumidor |

### SEC-TEC-04 — TEC: hechos complementarios (disconnection, reconnection, dependentDisconnection, provisioning, meter, outage, Equipos de red)

**Agregados:** `tec.disconnection.*`, `tec.reconnection.*`, `tec.dependentDisconnection.*`, `tec.provisioning.*`, `tec.meter.*`, `tec.outage.*`, `tec.networkDevice.*`. **Productor:** M10 Técnica, campo y redes (M10 §12; catálogo T11 §12.3).

**Cubre:** EVT-TEC-18 `tec.disconnection.executed`, EVT-TEC-19 `tec.reconnection.executed`, EVT-TEC-20 `tec.dependentDisconnection.requested`, EVT-TEC-21 `tec.provisioning.confirmed`, EVT-TEC-33 `tec.provisioning.requested`, EVT-TEC-22 `tec.meter.changed`, EVT-TEC-23 `tec.outage.notified`, EVT-TEC-24 `tec.networkDevice.down`.

Parte de estos hechos también aparece, con el detalle del caso de negocio, en A4 de `06-secuencias-y-estados.md` §3.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PM10 as M10 TEC
    participant BUS as Outbox y colas (T01, T11)
    participant PM02 as M02 CAT
    participant PM04 as M04 TAR
    participant PM05 as M05 FAC
    participant PM08 as M08 MOR
    participant PM16 as M16 SUE
    participant PM09 as M09 CRM
    participant PT06 as T06 INT
    participant PM03 as M03 MED
    participant PM13 as M13 STK
    participant PT09 as T09 COM
    participant PT10 as T10 BIA
    U->>PM10: Acción que origina el hecho
    PM10->>BUS: EVT-TEC-18 tec.disconnection.executed
    par M02
        BUS->>PM02: consume EVT-TEC-18
    and M04
        BUS->>PM04: consume EVT-TEC-18
    and M05
        BUS->>PM05: consume EVT-TEC-18
    and M08
        BUS->>PM08: Transición del caso de interrupción. tec.disconnection.executed trae…
    end
    U->>PM10: Acción que origina el hecho
    PM10->>BUS: EVT-TEC-19 tec.reconnection.executed
    par M02
        BUS->>PM02: consume EVT-TEC-19
    and M04
        BUS->>PM04: consume EVT-TEC-19
    and M05
        BUS->>PM05: consume EVT-TEC-19
    and M08
        BUS->>PM08: consume EVT-TEC-19
    and M16
        BUS->>PM16: Tareas extra por ejecutor
    end
    U->>PM10: Acción que origina el hecho
    PM10->>BUS: EVT-TEC-20 tec.dependentDisconnection.requested
    par M02
        BUS->>PM02: consume EVT-TEC-20
    and M08
        BUS->>PM08: consume EVT-TEC-20
    end
    U->>PM10: Acción que origina el hecho
    PM10->>BUS: EVT-TEC-21 tec.provisioning.confirmed y 1 tipo más
    par M02
        BUS->>PM02: T06 / T10.
    and M08
        BUS->>PM08: consume EVT-TEC-21
    and M09
        BUS->>PM09: consume EVT-TEC-21
    end
    U->>PM10: Acción que origina el hecho
    PM10->>BUS: EVT-TEC-33 tec.provisioning.requested
    BUS->>PT06: consume EVT-TEC-33
    U->>PM10: Acción que origina el hecho
    PM10->>BUS: EVT-TEC-22 tec.meter.changed
    par M03
        BUS->>PM03: consume EVT-TEC-22
    and M13
        BUS->>PM13: consume EVT-TEC-22
    end
    U->>PM10: Acción que origina el hecho
    PM10->>BUS: EVT-TEC-23 tec.outage.notified y 1 tipo más
    par M09
        BUS->>PM09: Propone/actualiza incidente
    and T09
        BUS->>PT09: consume EVT-TEC-23
    and T10
        BUS->>PT10: consume EVT-TEC-23
    end
    U->>PM10: Acción que origina el hecho
    PM10->>BUS: EVT-TEC-24 tec.networkDevice.down
    par M09
        BUS->>PM09: Propone/actualiza incidente
    and T09
        BUS->>PT09: consume EVT-TEC-24
    end
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-TEC-18 `tec.disconnection.executed` | M02, M04, M05, M08 | M08: Transición del caso de interrupción. `tec.disconnection.executed` trae `mode` (`restricted`/`interrupted`): M08 lo compara con el `serviceMode` del caso; si difiere, registra la diferencia en el caso y aplica los c… |
| EVT-TEC-19 `tec.reconnection.executed` | M02, M04, M05, M08, M16 | M16: Tareas extra por ejecutor |
| EVT-TEC-20 `tec.dependentDisconnection.requested` | M02, M08 | No declarado en el §12 del consumidor |
| EVT-TEC-21 `tec.provisioning.confirmed` | M02, M08, M09 | M02: T06 / T10. |
| EVT-TEC-33 `tec.provisioning.requested` | T06 | No declarado en el §12 del consumidor |
| EVT-TEC-22 `tec.meter.changed` | M03, M13 | No declarado en el §12 del consumidor |
| EVT-TEC-23 `tec.outage.notified` | M09, T09, T10 | M09: Propone/actualiza incidente |
| EVT-TEC-24 `tec.networkDevice.down` | M09, T09 | M09: Propone/actualiza incidente |

### SEC-TEC-05 — TEC: hechos complementarios (levy, inspection, cdr, mobileUsage, Conflictos de sincronización, geo, Líneas, crewTimesheet)

**Agregados:** `tec.levy.*`, `tec.inspection.*`, `tec.cdr.*`, `tec.mobileUsage.*`, `tec.syncConflict.*`, `tec.geo.*`, `tec.phoneLine.*`, `tec.crewTimesheet.*`. **Productor:** M10 Técnica, campo y redes (M10 §12; catálogo T11 §12.3).

**Cubre:** EVT-TEC-25 `tec.levy.approved`, EVT-TEC-26 `tec.inspection.recoveryApproved`, EVT-TEC-27 `tec.cdr.attributed`, EVT-TEC-28 `tec.mobileUsage.imported`, EVT-TEC-29 `tec.syncConflict.opened`, EVT-TEC-30 `tec.geo.pointUpdated`, EVT-TEC-31 `tec.phoneLine.changed`, EVT-TEC-32 `tec.crewTimesheet.approved`.

**API y jobs disparadores (citados junto al evento en el anexo productor):** JOB-TEC-09.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PM10 as M10 TEC
    participant BUS as Outbox y colas (T01, T11)
    participant PM02 as M02 CAT
    participant PM04 as M04 TAR
    participant PM05 as M05 FAC
    participant PM08 as M08 MOR
    participant PT09 as T09 COM
    participant PM09 as M09 CRM
    participant PT11 as T11 WFL
    participant PM01 as M01 PER
    participant PM03 as M03 MED
    participant PM16 as M16 SUE
    U->>PM10: Acción que origina el hecho
    PM10->>BUS: EVT-TEC-25 tec.levy.approved
    par M02
        BUS->>PM02: JOB-CAT-13 cat crear-contratos-obra crea un contrato de obra (tipo 17…
    and M04
        BUS->>PM04: Lanza JOB-TAR-14 crea un plan de cuotas de obra por beneficiario (RF-…
    and M05
        BUS->>PM05: consume EVT-TEC-25
    and M08
        BUS->>PM08: consume EVT-TEC-25
    and T09
        BUS->>PT09: consume EVT-TEC-25
    end
    U->>PM10: Acción que origina el hecho
    PM10->>BUS: EVT-TEC-26 tec.inspection.recoveryApproved
    par M04
        BUS->>PM04: consume EVT-TEC-26
    and M05
        BUS->>PM05: consume EVT-TEC-26
    end
    U->>PM10: JOB-TEC-09
    PM10->>BUS: EVT-TEC-27 tec.cdr.attributed
    BUS->>PM04: Lanza JOB-TAR-09.
    U->>PM10: Acción que origina el hecho
    PM10->>BUS: EVT-TEC-28 tec.mobileUsage.imported
    par M04
        BUS->>PM04: consume EVT-TEC-28
    and M05
        BUS->>PM05: consume EVT-TEC-28
    end
    U->>PM10: Acción que origina el hecho
    PM10->>BUS: EVT-TEC-29 tec.syncConflict.opened y 1 tipo más
    par M09
        BUS->>PM09: consume EVT-TEC-29
    and T09
        BUS->>PT09: consume EVT-TEC-29
    and T11
        BUS->>PT11: consume EVT-TEC-29
    end
    U->>PM10: Acción que origina el hecho
    PM10->>BUS: EVT-TEC-30 tec.geo.pointUpdated
    par M01
        BUS->>PM01: Crea evento de ubicación candidate / needsReview .
    and M03
        BUS->>PM03: consume EVT-TEC-30
    end
    U->>PM10: Acción que origina el hecho
    PM10->>BUS: EVT-TEC-31 tec.phoneLine.changed
    BUS->>PM04: consume EVT-TEC-31
    U->>PM10: Acción que origina el hecho
    PM10->>BUS: EVT-TEC-32 tec.crewTimesheet.approved
    BUS->>PM16: Proponer / actualizar novedades (JOB-SUE-07)
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-TEC-25 `tec.levy.approved` | M02, M04, M05, M08, T09 | M02: JOB-CAT-13 `cat:crear-contratos-obra`: crea un contrato de obra (tipo 17) por beneficiario con API-CAT-33, idempotente por obra + inmueble (RF-CAT-115, HUECO-OBR-01).; M04: Lanza JOB-TAR-14: crea un plan de cuotas… |
| EVT-TEC-26 `tec.inspection.recoveryApproved` | M04, M05 | No declarado en el §12 del consumidor |
| EVT-TEC-27 `tec.cdr.attributed` | M04 | M04: Lanza JOB-TAR-09. |
| EVT-TEC-28 `tec.mobileUsage.imported` | M04, M05 | No declarado en el §12 del consumidor |
| EVT-TEC-29 `tec.syncConflict.opened` | M09, T09, T11 | No declarado en el §12 del consumidor |
| EVT-TEC-30 `tec.geo.pointUpdated` | M01, M03 | M01: Crea evento de ubicación `candidate`/`needsReview`. |
| EVT-TEC-31 `tec.phoneLine.changed` | M04 | No declarado en el §12 del consumidor |
| EVT-TEC-32 `tec.crewTimesheet.approved` | M16 | M16: Proponer / actualizar novedades (JOB-SUE-07) |

### SEC-TEC-06 — TEC: hechos complementarios (Obras y contribución por mejoras, emergency, onCall, Muestras, cadena de custodia, resultados por parámetro y…)

**Agregados:** `tec.work.*`, `tec.emergency.*`, `tec.onCall.*`, `tec.waterSample.*`, `tec.quotaUsage.*`. **Productor:** M10 Técnica, campo y redes (M10 §12; catálogo T11 §12.3).

**Cubre:** EVT-TEC-34 `tec.work.completed`, EVT-TEC-35 `tec.emergency.declared`, EVT-TEC-36 `tec.onCall.escalated`, EVT-TEC-37 `tec.waterSample.outOfLimit`, EVT-TEC-38 `tec.quotaUsage.reported`.

**API y jobs disparadores (citados junto al evento en el anexo productor):** API-TEC-51, JOB-TEC-17, API-TEC-54, API-TEC-56.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PM10 as M10 TEC
    participant BUS as Outbox y colas (T01, T11)
    participant PM13 as M13 STK
    participant PM15 as M15 CON
    participant PM09 as M09 CRM
    participant PT09 as T09 COM
    participant PT10 as T10 BIA
    participant PM06 as M06 FIS
    participant PM04 as M04 TAR
    U->>PM10: Acción que origina el hecho
    PM10->>BUS: EVT-TEC-34 tec.work.completed
    par M13
        BUS->>PM13: consume EVT-TEC-34
    and M15
        BUS->>PM15: consume EVT-TEC-34
    end
    U->>PM10: API-TEC-51, JOB-TEC-17
    PM10->>BUS: EVT-TEC-35 tec.emergency.declared y 1 tipo más
    par M09
        BUS->>PM09: SLA de seguridad (RF-CRM-260) marca aceptación, arribo y zona segura…
    and T09
        BUS->>PT09: consume EVT-TEC-35
    and T10
        BUS->>PT10: consume EVT-TEC-35
    end
    U->>PM10: JOB-TEC-17
    PM10->>BUS: EVT-TEC-36 tec.onCall.escalated
    par M09
        BUS->>PM09: SLA de seguridad (RF-CRM-260) marca aceptación, arribo y zona segura…
    and T09
        BUS->>PT09: consume EVT-TEC-36
    end
    U->>PM10: API-TEC-54
    PM10->>BUS: EVT-TEC-37 tec.waterSample.outOfLimit
    par M06
        BUS->>PM06: consume EVT-TEC-37
    and M09
        BUS->>PM09: Propone incidente preventivo por zona al supervisor (solo si M10 PRM-…
    and T09
        BUS->>PT09: consume EVT-TEC-37
    end
    U->>PM10: API-TEC-56
    PM10->>BUS: EVT-TEC-38 tec.quotaUsage.reported
    BUS->>PM04: Marca el contrato y período como consumo informado para el próximo cá…
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-TEC-34 `tec.work.completed` | M13, M15 | No declarado en el §12 del consumidor |
| EVT-TEC-35 `tec.emergency.declared` | M09, T09, T10 | M09: SLA de seguridad (RF-CRM-260): marca aceptación, arribo y zona segura; muestra el escalamiento de guardia en el caso (HUE-GAS-05) |
| EVT-TEC-36 `tec.onCall.escalated` | M09, T09 | M09: SLA de seguridad (RF-CRM-260): marca aceptación, arribo y zona segura; muestra el escalamiento de guardia en el caso (HUE-GAS-05) |
| EVT-TEC-37 `tec.waterSample.outOfLimit` | M06, M09, T09 | M09: Propone incidente preventivo por zona al supervisor (solo si M10 PRM-TEC-157 está activo) |
| EVT-TEC-38 `tec.quotaUsage.reported` | M04 | M04: Marca el contrato y período como "consumo informado" para el próximo cálculo de correo o pack SMS; si el período ya está facturado, solo registra la revisión en la traza (RN-TAR-251; DEC-084). El dato se lee con AP… |

## Cobertura de la parte R

| Evento | Productor | Secuencia | También en |
|---|---|---|---|
| EVT-MOR-08 | M08 | SEC-MOR-01 | — |
| EVT-MOR-09 | M08 | SEC-MOR-01 | — |
| EVT-MOR-10 | M08 | SEC-MOR-01 | — |
| EVT-MOR-01 | M08 | SEC-MOR-02 | — |
| EVT-MOR-02 | M08 | SEC-MOR-02 | A2 (`06-secuencias-y-estados.md`) |
| EVT-MOR-03 | M08 | SEC-MOR-02 | — |
| EVT-MOR-04 | M08 | SEC-MOR-02 | — |
| EVT-MOR-05 | M08 | SEC-MOR-02 | — |
| EVT-MOR-06 | M08 | SEC-MOR-02 | — |
| EVT-MOR-07 | M08 | SEC-MOR-02 | — |
| EVT-MOR-11 | M08 | SEC-MOR-02 | — |
| EVT-MOR-12 | M08 | SEC-MOR-03 | A4 (`06-secuencias-y-estados.md`) |
| EVT-MOR-13 | M08 | SEC-MOR-03 | A4 (`06-secuencias-y-estados.md`) |
| EVT-MOR-14 | M08 | SEC-MOR-03 | — |
| EVT-MOR-15 | M08 | SEC-MOR-03 | — |
| EVT-MOR-16 | M08 | SEC-MOR-03 | — |
| EVT-MOR-17 | M08 | SEC-MOR-03 | — |
| EVT-MOR-18 | M08 | SEC-MOR-03 | — |
| EVT-MOR-19 | M08 | SEC-MOR-03 | — |
| EVT-MOR-20 | M08 | SEC-MOR-04 | — |
| EVT-MOR-21 | M08 | SEC-MOR-04 | — |
| EVT-CRM-01 | M09 | SEC-CRM-01 | A5 (`06-secuencias-y-estados.md`) |
| EVT-CRM-02 | M09 | SEC-CRM-01 | — |
| EVT-CRM-03 | M09 | SEC-CRM-01 | A5 (`06-secuencias-y-estados.md`) |
| EVT-CRM-04 | M09 | SEC-CRM-01 | A5 (`06-secuencias-y-estados.md`) |
| EVT-CRM-05 | M09 | SEC-CRM-01 | — |
| EVT-CRM-06 | M09 | SEC-CRM-01 | — |
| EVT-CRM-07 | M09 | SEC-CRM-01 | — |
| EVT-CRM-08 | M09 | SEC-CRM-01 | A5 (`06-secuencias-y-estados.md`) |
| EVT-CRM-09 | M09 | SEC-CRM-01 | A5 (`06-secuencias-y-estados.md`) |
| EVT-CRM-10 | M09 | SEC-CRM-01 | — |
| EVT-CRM-11 | M09 | SEC-CRM-02 | — |
| EVT-CRM-12 | M09 | SEC-CRM-02 | — |
| EVT-CRM-13 | M09 | SEC-CRM-03 | A5 (`06-secuencias-y-estados.md`) |
| EVT-CRM-14 | M09 | SEC-CRM-03 | — |
| EVT-CRM-15 | M09 | SEC-CRM-03 | — |
| EVT-CRM-16 | M09 | SEC-CRM-03 | — |
| EVT-CRM-17 | M09 | SEC-CRM-03 | — |
| EVT-CRM-18 | M09 | SEC-CRM-03 | — |
| EVT-CRM-19 | M09 | SEC-CRM-03 | — |
| EVT-CRM-20 | M09 | SEC-CRM-03 | — |
| EVT-CRM-21 | M09 | SEC-CRM-04 | — |
| EVT-CRM-22 | M09 | SEC-CRM-04 | — |
| EVT-CRM-23 | M09 | SEC-CRM-04 | — |
| EVT-CRM-24 | M09 | SEC-CRM-04 | — |
| EVT-CRM-25 | M09 | SEC-CRM-04 | — |
| EVT-TEC-01 | M10 | SEC-TEC-01 | — |
| EVT-TEC-02 | M10 | SEC-TEC-01 | — |
| EVT-TEC-03 | M10 | SEC-TEC-01 | — |
| EVT-TEC-04 | M10 | SEC-TEC-02 | A5 (`06-secuencias-y-estados.md`) |
| EVT-TEC-05 | M10 | SEC-TEC-02 | — |
| EVT-TEC-06 | M10 | SEC-TEC-02 | A5 (`06-secuencias-y-estados.md`) |
| EVT-TEC-07 | M10 | SEC-TEC-02 | A4 (`06-secuencias-y-estados.md`) |
| EVT-TEC-08 | M10 | SEC-TEC-02 | — |
| EVT-TEC-09 | M10 | SEC-TEC-02 | — |
| EVT-TEC-10 | M10 | SEC-TEC-03 | A5 (`06-secuencias-y-estados.md`) |
| EVT-TEC-11 | M10 | SEC-TEC-03 | — |
| EVT-TEC-12 | M10 | SEC-TEC-03 | — |
| EVT-TEC-13 | M10 | SEC-TEC-03 | — |
| EVT-TEC-14 | M10 | SEC-TEC-03 | — |
| EVT-TEC-15 | M10 | SEC-TEC-03 | — |
| EVT-TEC-16 | M10 | SEC-TEC-03 | — |
| EVT-TEC-17 | M10 | SEC-TEC-03 | — |
| EVT-TEC-18 | M10 | SEC-TEC-04 | A4 (`06-secuencias-y-estados.md`) |
| EVT-TEC-19 | M10 | SEC-TEC-04 | A4 (`06-secuencias-y-estados.md`) |
| EVT-TEC-20 | M10 | SEC-TEC-04 | — |
| EVT-TEC-21 | M10 | SEC-TEC-04 | A4 (`06-secuencias-y-estados.md`) |
| EVT-TEC-33 | M10 | SEC-TEC-04 | A4 (`06-secuencias-y-estados.md`) |
| EVT-TEC-22 | M10 | SEC-TEC-04 | — |
| EVT-TEC-23 | M10 | SEC-TEC-04 | — |
| EVT-TEC-24 | M10 | SEC-TEC-04 | — |
| EVT-TEC-25 | M10 | SEC-TEC-05 | — |
| EVT-TEC-26 | M10 | SEC-TEC-05 | — |
| EVT-TEC-27 | M10 | SEC-TEC-05 | — |
| EVT-TEC-28 | M10 | SEC-TEC-05 | — |
| EVT-TEC-29 | M10 | SEC-TEC-05 | — |
| EVT-TEC-30 | M10 | SEC-TEC-05 | — |
| EVT-TEC-31 | M10 | SEC-TEC-05 | — |
| EVT-TEC-32 | M10 | SEC-TEC-05 | — |
| EVT-TEC-34 | M10 | SEC-TEC-06 | — |
| EVT-TEC-35 | M10 | SEC-TEC-06 | — |
| EVT-TEC-36 | M10 | SEC-TEC-06 | — |
| EVT-TEC-37 | M10 | SEC-TEC-06 | — |
| EVT-TEC-38 | M10 | SEC-TEC-06 | — |
