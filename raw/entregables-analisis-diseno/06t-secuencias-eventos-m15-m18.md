# GoodApps Cooperativas — Diagramas de secuencia por eventos, parte T (M15-M18)

**Entregable de análisis y diseño — Artefacto 7.3 (diagramas de secuencia), ampliación a cobertura completa**

| Campo | Valor |
|---|---|
| Documento | `06t-secuencias-eventos-m15-m18.md` |
| Índice del entregable | [`06-secuencias-y-estados.md`](06-secuencias-y-estados.md) (sección 7) y [`06a-indice-cobertura-secuencias-estados.md`](06a-indice-cobertura-secuencias-estados.md) |
| Versión | 1.0 |
| Fecha | 05-11-2026 |
| Estado | Borrador para revisión |
| Fuentes | T11 §12.2 y §12.3 (catálogo de eventos y consumidores); §12 "Eventos consumidos" y §11 de los anexos M15, M16, M17, M18 |
| Generación | Script `_trabajo/gen06_build.py` (extrae de los anexos; revisión manual posterior) |

## 1. Cómo leer esta parte

Cada diagrama representa un flujo de negocio entre módulos construido a partir del catálogo de eventos de T11 §12.3: un agregado del productor (por ejemplo, `cat.contract.*`) con sus hechos en orden de ID, o un grupo de hechos complementarios del mismo productor cuando el agregado tiene menos de tres eventos. Todos siguen el patrón transversal de `06-secuencias-y-estados.md` §2.2 (outbox en la misma transacción, relay, inbox por consumidor, reintentos y cola de errores), que no se repite en cada diagrama.

- **U** es el origen del hecho: usuario, API o job. Se citan las API y jobs que el anexo productor nombra junto al evento.
- **BUS** es la outbox con el relay y las colas BullMQ; cada consumidor recibe su propio job.
- `par` agrupa consumidores independientes del mismo evento. El texto del mensaje es el efecto que declara el consumidor en el §12 de su anexo; "consume EVT-…" indica que el consumidor figura en T11 pero no describe el efecto. **GEN** representa consumidores genéricos de T11 ("módulo dueño del tipo", "todos").
- Debajo de cada diagrama, la tabla lista los EVT que cubre, sus consumidores externos y los efectos declarados.

## M15 — CON Contabilidad

### SEC-CON-01 — CON: Asientos

**Agregados:** `con.entry.*`. **Productor:** M15 Contabilidad (M15 §12; catálogo T11 §12.3).

**Cubre:** EVT-CON-01 `con.entry.posted`, EVT-CON-02 `con.entry.reversed`, EVT-CON-03 `con.entry.voided`.

**API y jobs disparadores (citados junto al evento en el anexo productor):** JOB-CON-10.

Parte de estos hechos también aparece, con el detalle del caso de negocio, en A8 de `06-secuencias-y-estados.md` §3.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PM15 as M15 CON
    participant BUS as Outbox y colas (T01, T11)
    participant PM06 as M06 FIS
    participant PM12 as M12 CMP
    participant PM13 as M13 STK
    participant PM14 as M14 TES
    participant PM16 as M16 SUE
    participant PM17 as M17 INS
    participant PT10 as T10 BIA
    participant PM02 as M02 CAT
    participant PM03 as M03 MED
    participant PM07 as M07 COB
    participant PM08 as M08 MOR
    participant PM10 as M10 TEC
    participant PM11 as M11 VEN
    participant PM18 as M18 SOC
    U->>PM15: JOB-CON-10
    PM15->>BUS: EVT-CON-01 con.entry.posted
    par M06
        BUS->>PM06: Conciliación de obligaciones
    and M12
        BUS->>PM12: consume EVT-CON-01
    and M13
        BUS->>PM13: consume EVT-CON-01
    and M14
        BUS->>PM14: Guarda journalEntryId
    and M16
        BUS->>PM16: Vínculo asiento ↔ liquidación error a la bandeja
    and M17
        BUS->>PM17: Actualiza accountingStatus .
    and T10
        BUS->>PT10: consume EVT-CON-01
    end
    U->>PM15: Acción que origina el hecho
    PM15->>BUS: EVT-CON-02 con.entry.reversed
    par M02
        BUS->>PM02: consume EVT-CON-02
    and M03
        BUS->>PM03: consume EVT-CON-02
    and M06
        BUS->>PM06: consume EVT-CON-02
    and M07
        BUS->>PM07: consume EVT-CON-02
    and M08
        BUS->>PM08: consume EVT-CON-02
    and M10
        BUS->>PM10: consume EVT-CON-02
    and M11
        BUS->>PM11: consume EVT-CON-02
    and M12
        BUS->>PM12: consume EVT-CON-02
    and M13
        BUS->>PM13: consume EVT-CON-02
    and M14
        BUS->>PM14: consume EVT-CON-02
    and M16
        BUS->>PM16: consume EVT-CON-02
    and M17
        BUS->>PM17: consume EVT-CON-02
    and M18
        BUS->>PM18: consume EVT-CON-02
    and T10
        BUS->>PT10: consume EVT-CON-02
    end
    U->>PM15: Acción que origina el hecho
    PM15->>BUS: EVT-CON-03 con.entry.voided
    par M02
        BUS->>PM02: consume EVT-CON-03
    and M03
        BUS->>PM03: consume EVT-CON-03
    and M06
        BUS->>PM06: consume EVT-CON-03
    and M07
        BUS->>PM07: consume EVT-CON-03
    and M08
        BUS->>PM08: consume EVT-CON-03
    and M10
        BUS->>PM10: consume EVT-CON-03
    and M11
        BUS->>PM11: consume EVT-CON-03
    and M12
        BUS->>PM12: consume EVT-CON-03
    and M13
        BUS->>PM13: consume EVT-CON-03
    and M14
        BUS->>PM14: consume EVT-CON-03
    and M16
        BUS->>PM16: consume EVT-CON-03
    and M17
        BUS->>PM17: consume EVT-CON-03
    and M18
        BUS->>PM18: consume EVT-CON-03
    and T10
        BUS->>PT10: consume EVT-CON-03
    end
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-CON-01 `con.entry.posted` | M06, M12, M13, M14, M16, M17, T10 | M06: Conciliación de obligaciones; M14: Guarda `journalEntryId`; M16: Vínculo asiento ↔ liquidación; error a la bandeja; M17: Actualiza `accountingStatus`. |
| EVT-CON-02 `con.entry.reversed` | M02, M03, M06, M07, M08, M10, M11, M12, M13, M14, M16, M17, M18, T10 | No declarado en el §12 del consumidor |
| EVT-CON-03 `con.entry.voided` | M02, M03, M06, M07, M08, M10, M11, M12, M13, M14, M16, M17, M18, T10 | No declarado en el §12 del consumidor |

### SEC-CON-02 — CON: Períodos contables

**Agregados:** `con.period.*`. **Productor:** M15 Contabilidad (M15 §12; catálogo T11 §12.3).

**Cubre:** EVT-CON-06 `con.period.locked`, EVT-CON-07 `con.period.closed`, EVT-CON-08 `con.period.reopened`.

Parte de estos hechos también aparece, con el detalle del caso de negocio, en A8 de `06-secuencias-y-estados.md` §3.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PM15 as M15 CON
    participant BUS as Outbox y colas (T01, T11)
    participant PM02 as M02 CAT
    participant PM03 as M03 MED
    participant PM06 as M06 FIS
    participant PM07 as M07 COB
    participant PM08 as M08 MOR
    participant PM10 as M10 TEC
    participant PM11 as M11 VEN
    participant PM12 as M12 CMP
    participant PM13 as M13 STK
    participant PM14 as M14 TES
    participant PM16 as M16 SUE
    participant PM17 as M17 INS
    participant PM18 as M18 SOC
    participant PT04 as T04 CFG
    participant PT10 as T10 BIA
    U->>PM15: Acción que origina el hecho
    PM15->>BUS: EVT-CON-06 con.period.locked y 1 tipo más
    par M02
        BUS->>PM02: consume EVT-CON-06
    and M03
        BUS->>PM03: consume EVT-CON-06
    and M06
        BUS->>PM06: consume EVT-CON-06
    and M07
        BUS->>PM07: consume EVT-CON-06
    and M08
        BUS->>PM08: consume EVT-CON-06
    and M10
        BUS->>PM10: consume EVT-CON-06
    and M11
        BUS->>PM11: consume EVT-CON-06
    and M12
        BUS->>PM12: consume EVT-CON-06
    and M13
        BUS->>PM13: consume EVT-CON-06
    and M14
        BUS->>PM14: consume EVT-CON-06
    and M16
        BUS->>PM16: consume EVT-CON-06
    and M17
        BUS->>PM17: consume EVT-CON-06
    and M18
        BUS->>PM18: consume EVT-CON-06
    and T04
        BUS->>PT04: consume EVT-CON-06
    end
    U->>PM15: Acción que origina el hecho
    PM15->>BUS: EVT-CON-07 con.period.closed
    par M02
        BUS->>PM02: consume EVT-CON-07
    and M03
        BUS->>PM03: consume EVT-CON-07
    and M06
        BUS->>PM06: consume EVT-CON-07
    and M07
        BUS->>PM07: consume EVT-CON-07
    and M08
        BUS->>PM08: consume EVT-CON-07
    and M10
        BUS->>PM10: consume EVT-CON-07
    and M11
        BUS->>PM11: consume EVT-CON-07
    and M12
        BUS->>PM12: consume EVT-CON-07
    and M13
        BUS->>PM13: consume EVT-CON-07
    and M14
        BUS->>PM14: consume EVT-CON-07
    and M16
        BUS->>PM16: consume EVT-CON-07
    and M17
        BUS->>PM17: consume EVT-CON-07
    and M18
        BUS->>PM18: consume EVT-CON-07
    and T10
        BUS->>PT10: Disparo de programaciones por evento (§9.3) y snapshots de cierre
    end
    U->>PM15: Acción que origina el hecho
    PM15->>BUS: EVT-CON-08 con.period.reopened
    par M02
        BUS->>PM02: consume EVT-CON-08
    and M03
        BUS->>PM03: consume EVT-CON-08
    and M06
        BUS->>PM06: consume EVT-CON-08
    and M07
        BUS->>PM07: consume EVT-CON-08
    and M08
        BUS->>PM08: consume EVT-CON-08
    and M10
        BUS->>PM10: consume EVT-CON-08
    and M11
        BUS->>PM11: consume EVT-CON-08
    and M12
        BUS->>PM12: consume EVT-CON-08
    and M13
        BUS->>PM13: consume EVT-CON-08
    and M14
        BUS->>PM14: consume EVT-CON-08
    and M16
        BUS->>PM16: consume EVT-CON-08
    and M17
        BUS->>PM17: consume EVT-CON-08
    and M18
        BUS->>PM18: consume EVT-CON-08
    and T10
        BUS->>PT10: consume EVT-CON-08
    end
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-CON-06 `con.period.locked` | M02, M03, M06, M07, M08, M10, M11, M12, M13, M14, M16, M17, M18, T04 | No declarado en el §12 del consumidor |
| EVT-CON-07 `con.period.closed` | M02, M03, M06, M07, M08, M10, M11, M12, M13, M14, M16, M17, M18, T10 | T10: Disparo de programaciones por evento (§9.3) y snapshots de cierre |
| EVT-CON-08 `con.period.reopened` | M02, M03, M06, M07, M08, M10, M11, M12, M13, M14, M16, M17, M18, T10 | No declarado en el §12 del consumidor |

### SEC-CON-03 — CON: hechos complementarios (Bandeja de eventos a contabilizar, Ejercicios, chart, inflationAdjustment, reconciliation, Presupuestos, Comp…)

**Agregados:** `con.event.*`, `con.fiscalYear.*`, `con.chart.*`, `con.inflationAdjustment.*`, `con.reconciliation.*`, `con.budget.*`, `con.commitment.*`. **Productor:** M15 Contabilidad (M15 §12; catálogo T11 §12.3).

**Cubre:** EVT-CON-04 `con.event.pendingConfiguration`, EVT-CON-05 `con.event.failed`, EVT-CON-09 `con.fiscalYear.closed`, EVT-CON-10 `con.chart.approved`, EVT-CON-12 `con.inflationAdjustment.posted`, EVT-CON-13 `con.reconciliation.differenceDetected`, EVT-CON-14 `con.budget.approved`, EVT-CON-15 `con.commitment.exceeded`.

**API y jobs disparadores (citados junto al evento en el anexo productor):** JOB-CON-03.

Parte de estos hechos también aparece, con el detalle del caso de negocio, en A8 de `06-secuencias-y-estados.md` §3.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PM15 as M15 CON
    participant BUS as Outbox y colas (T01, T11)
    participant PT09 as T09 COM
    participant PT11 as T11 WFL
    participant PM16 as M16 SUE
    participant PM17 as M17 INS
    participant PT08 as T08 NFR
    participant PT10 as T10 BIA
    participant PM06 as M06 FIS
    participant PM07 as M07 COB
    participant PM08 as M08 MOR
    participant PM10 as M10 TEC
    participant PM12 as M12 CMP
    participant PM14 as M14 TES
    U->>PM15: JOB-CON-03
    PM15->>BUS: EVT-CON-04 con.event.pendingConfiguration
    par T09
        BUS->>PT09: Generar comunicaciones según catálogo. Los tipos sin evento ( soc.cem…
    and T11
        BUS->>PT11: consume EVT-CON-04
    end
    U->>PM15: Acción que origina el hecho
    PM15->>BUS: EVT-CON-05 con.event.failed
    par M16
        BUS->>PM16: Vínculo asiento ↔ liquidación error a la bandeja
    and M17
        BUS->>PM17: Actualiza accountingStatus .
    and T08
        BUS->>PT08: consume EVT-CON-05
    and T09
        BUS->>PT09: consume EVT-CON-05
    and T11
        BUS->>PT11: consume EVT-CON-05
    end
    U->>PM15: Acción que origina el hecho
    PM15->>BUS: EVT-CON-09 con.fiscalYear.closed y 1 tipo más
    par M17
        BUS->>PM17: consume EVT-CON-09
    and T10
        BUS->>PT10: consume EVT-CON-09
    end
    U->>PM15: Acción que origina el hecho
    PM15->>BUS: EVT-CON-10 con.chart.approved y 1 tipo más
    par M06
        BUS->>PM06: consume EVT-CON-10
    and M07
        BUS->>PM07: consume EVT-CON-10
    and M08
        BUS->>PM08: consume EVT-CON-10
    and M10
        BUS->>PM10: consume EVT-CON-10
    and M16
        BUS->>PM16: consume EVT-CON-10
    and M17
        BUS->>PM17: consume EVT-CON-10
    end
    U->>PM15: Acción que origina el hecho
    PM15->>BUS: EVT-CON-12 con.inflationAdjustment.posted
    BUS->>PT10: consume EVT-CON-12
    U->>PM15: Acción que origina el hecho
    PM15->>BUS: EVT-CON-13 con.reconciliation.differenceDetected
    BUS->>PT09: consume EVT-CON-13
    U->>PM15: Acción que origina el hecho
    PM15->>BUS: EVT-CON-14 con.budget.approved y 1 tipo más
    par M12
        BUS->>PM12: consume EVT-CON-14
    and M14
        BUS->>PM14: consume EVT-CON-14
    and M16
        BUS->>PM16: consume EVT-CON-14
    and T10
        BUS->>PT10: consume EVT-CON-14
    end
    U->>PM15: Acción que origina el hecho
    PM15->>BUS: EVT-CON-15 con.commitment.exceeded y 1 tipo más
    par M12
        BUS->>PM12: consume EVT-CON-15
    and T11
        BUS->>PT11: consume EVT-CON-15
    end
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-CON-04 `con.event.pendingConfiguration` | T09, T11 | T09: Generar comunicaciones según catálogo. Los tipos sin evento (`soc.cemeteryAct.scheduled`, `soc.loan.overdue`) entran por el comando `com.communications.emit` (§9.7). |
| EVT-CON-05 `con.event.failed` | M16, M17, T08, T09, T11 | M16: Vínculo asiento ↔ liquidación; error a la bandeja; M17: Actualiza `accountingStatus`. |
| EVT-CON-09 `con.fiscalYear.closed` | M17, T10 | No declarado en el §12 del consumidor |
| EVT-CON-10 `con.chart.approved` | M06, M07, M08, M10, M16, M17 | No declarado en el §12 del consumidor |
| EVT-CON-12 `con.inflationAdjustment.posted` | T10 | No declarado en el §12 del consumidor |
| EVT-CON-13 `con.reconciliation.differenceDetected` | T09 | No declarado en el §12 del consumidor |
| EVT-CON-14 `con.budget.approved` | M12, M14, M16, T10 | No declarado en el §12 del consumidor |
| EVT-CON-15 `con.commitment.exceeded` | M12, T11 | No declarado en el §12 del consumidor |

### SEC-CON-04 — CON: hechos complementarios (simulation, export, statements)

**Agregados:** `con.simulation.*`, `con.export.*`, `con.statements.*`. **Productor:** M15 Contabilidad (M15 §12; catálogo T11 §12.3).

**Cubre:** EVT-CON-16 `con.simulation.completed`, EVT-CON-17 `con.export.completed`, EVT-CON-18 `con.statements.issued`.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PM15 as M15 CON
    participant BUS as Outbox y colas (T01, T11)
    participant PT09 as T09 COM
    participant PT06 as T06 INT
    participant PM17 as M17 INS
    participant PM19 as M19 POR
    participant PT10 as T10 BIA
    U->>PM15: Acción que origina el hecho
    PM15->>BUS: EVT-CON-16 con.simulation.completed
    BUS->>PT09: consume EVT-CON-16
    U->>PM15: Acción que origina el hecho
    PM15->>BUS: EVT-CON-17 con.export.completed y 1 tipo más
    BUS->>PT06: consume EVT-CON-17
    U->>PM15: Acción que origina el hecho
    PM15->>BUS: EVT-CON-18 con.statements.issued
    par M17
        BUS->>PM17: consume EVT-CON-18
    and M19
        BUS->>PM19: consume EVT-CON-18
    and T10
        BUS->>PT10: consume EVT-CON-18
    end
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-CON-16 `con.simulation.completed` | T09 | No declarado en el §12 del consumidor |
| EVT-CON-17 `con.export.completed` | T06 | No declarado en el §12 del consumidor |
| EVT-CON-18 `con.statements.issued` | M17, M19, T10 | No declarado en el §12 del consumidor |

## M16 — SUE Personal y sueldos

### SEC-SUE-01 — SUE: Legajos

**Agregados:** `sue.employee.*`. **Productor:** M16 Personal y sueldos (M16 §12; catálogo T11 §12.3).

**Cubre:** EVT-SUE-01 `sue.employee.hired`, EVT-SUE-02 `sue.employee.assignmentChanged`, EVT-SUE-03 `sue.employee.terminated`, EVT-SUE-04 `sue.employee.reinstated`.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PM16 as M16 SUE
    participant BUS as Outbox y colas (T01, T11)
    participant PM10 as M10 TEC
    participant PT02 as T02 IAM
    participant PT09 as T09 COM
    participant PT10 as T10 BIA
    participant PT11 as T11 WFL
    participant PM13 as M13 STK
    U->>PM16: Acción que origina el hecho
    PM16->>BUS: EVT-SUE-01 sue.employee.hired
    par M10
        BUS->>PM10: consume EVT-SUE-01
    and T02
        BUS->>PT02: consume EVT-SUE-01
    and T09
        BUS->>PT09: Generar comunicaciones según catálogo. Los tipos sin evento ( soc.cem…
    end
    U->>PM16: Acción que origina el hecho
    PM16->>BUS: EVT-SUE-02 sue.employee.assignmentChanged
    par M10
        BUS->>PM10: consume EVT-SUE-02
    and T10
        BUS->>PT10: consume EVT-SUE-02
    and T11
        BUS->>PT11: consume EVT-SUE-02
    end
    U->>PM16: Acción que origina el hecho
    PM16->>BUS: EVT-SUE-03 sue.employee.terminated
    par M10
        BUS->>PM10: consume EVT-SUE-03
    and M13
        BUS->>PM13: consume EVT-SUE-03
    and T02
        BUS->>PT02: consume EVT-SUE-03
    and T09
        BUS->>PT09: consume EVT-SUE-03
    and T11
        BUS->>PT11: consume EVT-SUE-03
    end
    U->>PM16: Acción que origina el hecho
    PM16->>BUS: EVT-SUE-04 sue.employee.reinstated
    par M10
        BUS->>PM10: consume EVT-SUE-04
    and T02
        BUS->>PT02: consume EVT-SUE-04
    end
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-SUE-01 `sue.employee.hired` | M10, T02, T09 | T09: Generar comunicaciones según catálogo. Los tipos sin evento (`soc.cemeteryAct.scheduled`, `soc.loan.overdue`) entran por el comando `com.communications.emit` (§9.7). |
| EVT-SUE-02 `sue.employee.assignmentChanged` | M10, T10, T11 | No declarado en el §12 del consumidor |
| EVT-SUE-03 `sue.employee.terminated` | M10, M13, T02, T09, T11 | No declarado en el §12 del consumidor |
| EVT-SUE-04 `sue.employee.reinstated` | M10, T02 | No declarado en el §12 del consumidor |

### SEC-SUE-02 — SUE: Liquidaciones

**Agregados:** `sue.payrollRun.*`. **Productor:** M16 Personal y sueldos (M16 §12; catálogo T11 §12.3).

**Cubre:** EVT-SUE-09 `sue.payrollRun.calculated`, EVT-SUE-10 `sue.payrollRun.submitted`, EVT-SUE-11 `sue.payrollRun.approved`, EVT-SUE-12 `sue.payrollRun.voided`, EVT-SUE-13 `sue.payrollRun.closed`.

**API y jobs disparadores (citados junto al evento en el anexo productor):** JOB-SUE-03, JOB-SUE-04.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PM16 as M16 SUE
    participant BUS as Outbox y colas (T01, T11)
    participant PT09 as T09 COM
    participant PT11 as T11 WFL
    participant PM15 as M15 CON
    participant PT10 as T10 BIA
    participant PM06 as M06 FIS
    U->>PM16: Acción que origina el hecho
    PM16->>BUS: EVT-SUE-09 sue.payrollRun.calculated
    BUS->>PT09: consume EVT-SUE-09
    U->>PM16: Acción que origina el hecho
    PM16->>BUS: EVT-SUE-10 sue.payrollRun.submitted
    BUS->>PT11: consume EVT-SUE-10
    U->>PM16: JOB-SUE-03, JOB-SUE-04
    PM16->>BUS: EVT-SUE-11 sue.payrollRun.approved
    par M15
        BUS->>PM15: consume EVT-SUE-11
    and T10
        BUS->>PT10: consume EVT-SUE-11
    end
    U->>PM16: Acción que origina el hecho
    PM16->>BUS: EVT-SUE-12 sue.payrollRun.voided
    BUS->>PM15: consume EVT-SUE-12
    U->>PM16: Acción que origina el hecho
    PM16->>BUS: EVT-SUE-13 sue.payrollRun.closed
    par M06
        BUS->>PM06: Datos para SICORE de sueldos y calendario
    and T10
        BUS->>PT10: Disparo de programaciones por evento (§9.3) y snapshots de cierre
    end
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-SUE-09 `sue.payrollRun.calculated` | T09 | No declarado en el §12 del consumidor |
| EVT-SUE-10 `sue.payrollRun.submitted` | T11 | No declarado en el §12 del consumidor |
| EVT-SUE-11 `sue.payrollRun.approved` | M15, T10 | No declarado en el §12 del consumidor |
| EVT-SUE-12 `sue.payrollRun.voided` | M15 | No declarado en el §12 del consumidor |
| EVT-SUE-13 `sue.payrollRun.closed` | M06, T10 | M06: Datos para SICORE de sueldos y calendario; T10: Disparo de programaciones por evento (§9.3) y snapshots de cierre |

### SEC-SUE-03 — SUE: Recibos de sueldo

**Agregados:** `sue.payslip.*`. **Productor:** M16 Personal y sueldos (M16 §12; catálogo T11 §12.3).

**Cubre:** EVT-SUE-14 `sue.payslip.issued`, EVT-SUE-15 `sue.payslip.acknowledged`, EVT-SUE-16 `sue.payslip.voided`.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PM16 as M16 SUE
    participant BUS as Outbox y colas (T01, T11)
    participant PM19 as M19 POR
    participant PT09 as T09 COM
    participant PT10 as T10 BIA
    U->>PM16: Acción que origina el hecho
    PM16->>BUS: EVT-SUE-14 sue.payslip.issued
    par M19
        BUS->>PM19: Aviso al empleado
    and T09
        BUS->>PT09: consume EVT-SUE-14
    end
    U->>PM16: Acción que origina el hecho
    PM16->>BUS: EVT-SUE-15 sue.payslip.acknowledged
    BUS->>PT10: consume EVT-SUE-15
    U->>PM16: Acción que origina el hecho
    PM16->>BUS: EVT-SUE-16 sue.payslip.voided
    BUS->>PT09: consume EVT-SUE-16
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-SUE-14 `sue.payslip.issued` | M19, T09 | M19: Aviso al empleado |
| EVT-SUE-15 `sue.payslip.acknowledged` | T10 | No declarado en el §12 del consumidor |
| EVT-SUE-16 `sue.payslip.voided` | T09 | No declarado en el §12 del consumidor |

### SEC-SUE-04 — SUE: hechos complementarios (payrollConfig, Escalas salariales, Novedades, leave, Solicitudes de pago a M14, Presentaciones, incomeTax)

**Agregados:** `sue.payrollConfig.*`, `sue.salaryScale.*`, `sue.novelty.*`, `sue.leave.*`, `sue.paymentRequest.*`, `sue.filing.*`, `sue.incomeTax.*`. **Productor:** M16 Personal y sueldos (M16 §12; catálogo T11 §12.3).

**Cubre:** EVT-SUE-05 `sue.payrollConfig.published`, EVT-SUE-06 `sue.salaryScale.published`, EVT-SUE-07 `sue.novelty.approved`, EVT-SUE-08 `sue.leave.requested`, EVT-SUE-17 `sue.paymentRequest.created`, EVT-SUE-27 `sue.paymentRequest.cancelled`, EVT-SUE-18 `sue.filing.generated`, EVT-SUE-19 `sue.incomeTax.annualSettled`.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PM16 as M16 SUE
    participant BUS as Outbox y colas (T01, T11)
    participant PT10 as T10 BIA
    participant PM15 as M15 CON
    participant PM10 as M10 TEC
    participant PT09 as T09 COM
    participant PT11 as T11 WFL
    participant PM14 as M14 TES
    U->>PM16: Acción que origina el hecho
    PM16->>BUS: EVT-SUE-05 sue.payrollConfig.published
    BUS->>PT10: consume EVT-SUE-05
    U->>PM16: Acción que origina el hecho
    PM16->>BUS: EVT-SUE-06 sue.salaryScale.published
    BUS->>PM15: consume EVT-SUE-06
    U->>PM16: Acción que origina el hecho
    PM16->>BUS: EVT-SUE-07 sue.novelty.approved
    BUS->>PT10: consume EVT-SUE-07
    U->>PM16: Acción que origina el hecho
    PM16->>BUS: EVT-SUE-08 sue.leave.requested y 2 tipos más
    par M10
        BUS->>PM10: consume EVT-SUE-08
    and T09
        BUS->>PT09: consume EVT-SUE-08
    and T11
        BUS->>PT11: consume EVT-SUE-08
    end
    U->>PM16: Acción que origina el hecho
    PM16->>BUS: EVT-SUE-17 sue.paymentRequest.created
    BUS->>PM14: Crea / anula lote
    U->>PM16: Acción que origina el hecho
    PM16->>BUS: EVT-SUE-27 sue.paymentRequest.cancelled
    BUS->>PM14: consume EVT-SUE-27
    U->>PM16: Acción que origina el hecho
    PM16->>BUS: EVT-SUE-18 sue.filing.generated y 1 tipo más
    par M14
        BUS->>PM14: consume EVT-SUE-18
    and T10
        BUS->>PT10: consume EVT-SUE-18
    end
    U->>PM16: Acción que origina el hecho
    PM16->>BUS: EVT-SUE-19 sue.incomeTax.annualSettled
    BUS->>PT09: consume EVT-SUE-19
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-SUE-05 `sue.payrollConfig.published` | T10 | No declarado en el §12 del consumidor |
| EVT-SUE-06 `sue.salaryScale.published` | M15 | No declarado en el §12 del consumidor |
| EVT-SUE-07 `sue.novelty.approved` | T10 | No declarado en el §12 del consumidor |
| EVT-SUE-08 `sue.leave.requested` | M10, T09, T11 | No declarado en el §12 del consumidor |
| EVT-SUE-17 `sue.paymentRequest.created` | M14 | M14: Crea / anula lote |
| EVT-SUE-27 `sue.paymentRequest.cancelled` | M14 | No declarado en el §12 del consumidor |
| EVT-SUE-18 `sue.filing.generated` | M14, T10 | No declarado en el §12 del consumidor |
| EVT-SUE-19 `sue.incomeTax.annualSettled` | T09 | No declarado en el §12 del consumidor |

### SEC-SUE-05 — SUE: hechos complementarios (Egresos y liquidación final, Certificados de trabajo, Accidentes de trabajo, Juicios laborales, externalPayro…)

**Agregados:** `sue.termination.*`, `sue.certificate.*`, `sue.accident.*`, `sue.lawsuit.*`, `sue.externalPayroll.*`, `sue.laborCost.*`, `sue.serviceDebt.*`, `sue.payrollFiles.*`. **Productor:** M16 Personal y sueldos (M16 §12; catálogo T11 §12.3).

**Cubre:** EVT-SUE-20 `sue.termination.approved`, EVT-SUE-21 `sue.certificate.issued`, EVT-SUE-22 `sue.accident.reported`, EVT-SUE-23 `sue.lawsuit.provisionChanged`, EVT-SUE-24 `sue.externalPayroll.approved`, EVT-SUE-25 `sue.laborCost.projected`, EVT-SUE-26 `sue.serviceDebt.deducted`, EVT-SUE-28 `sue.payrollFiles.requested`.

**API y jobs disparadores (citados junto al evento en el anexo productor):** API-SUE-75, JOB-SUE-20, API-SUE-63, JOB-SUE-10.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PM16 as M16 SUE
    participant BUS as Outbox y colas (T01, T11)
    participant PM13 as M13 STK
    participant PT02 as T02 IAM
    participant PT09 as T09 COM
    participant PT10 as T10 BIA
    participant PM08 as M08 MOR
    participant PM15 as M15 CON
    participant PM14 as M14 TES
    participant PM07 as M07 COB
    participant PT06 as T06 INT
    U->>PM16: Acción que origina el hecho
    PM16->>BUS: EVT-SUE-20 sue.termination.approved
    par M13
        BUS->>PM13: consume EVT-SUE-20
    and T02
        BUS->>PT02: consume EVT-SUE-20
    end
    U->>PM16: Acción que origina el hecho
    PM16->>BUS: EVT-SUE-21 sue.certificate.issued
    BUS->>PT09: consume EVT-SUE-21
    U->>PM16: Acción que origina el hecho
    PM16->>BUS: EVT-SUE-22 sue.accident.reported
    par T09
        BUS->>PT09: consume EVT-SUE-22
    and T10
        BUS->>PT10: consume EVT-SUE-22
    end
    U->>PM16: Acción que origina el hecho
    PM16->>BUS: EVT-SUE-23 sue.lawsuit.provisionChanged
    par M08
        BUS->>PM08: consume EVT-SUE-23
    and M15
        BUS->>PM15: consume EVT-SUE-23
    end
    U->>PM16: API-SUE-75
    PM16->>BUS: EVT-SUE-24 sue.externalPayroll.approved
    par M14
        BUS->>PM14: consume EVT-SUE-24
    and M15
        BUS->>PM15: consume EVT-SUE-24
    end
    U->>PM16: JOB-SUE-20
    PM16->>BUS: EVT-SUE-25 sue.laborCost.projected
    BUS->>PM15: consume EVT-SUE-25
    U->>PM16: Acción que origina el hecho
    PM16->>BUS: EVT-SUE-26 sue.serviceDebt.deducted
    BUS->>PM07: consume EVT-SUE-26
    U->>PM16: API-SUE-63, JOB-SUE-10
    PM16->>BUS: EVT-SUE-28 sue.payrollFiles.requested
    BUS->>PT06: consume EVT-SUE-28
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-SUE-20 `sue.termination.approved` | M13, T02 | No declarado en el §12 del consumidor |
| EVT-SUE-21 `sue.certificate.issued` | T09 | No declarado en el §12 del consumidor |
| EVT-SUE-22 `sue.accident.reported` | T09, T10 | No declarado en el §12 del consumidor |
| EVT-SUE-23 `sue.lawsuit.provisionChanged` | M08, M15 | No declarado en el §12 del consumidor |
| EVT-SUE-24 `sue.externalPayroll.approved` | M14, M15 | No declarado en el §12 del consumidor |
| EVT-SUE-25 `sue.laborCost.projected` | M15 | No declarado en el §12 del consumidor |
| EVT-SUE-26 `sue.serviceDebt.deducted` | M07 | No declarado en el §12 del consumidor |
| EVT-SUE-28 `sue.payrollFiles.requested` | T06 | No declarado en el §12 del consumidor |

## M17 — INS Institucional

### SEC-INS-01 — INS: Relación institucional del asociado

**Agregados:** `ins.membership.*`. **Productor:** M17 Institucional (M17 §12; catálogo T11 §12.3).

**Cubre:** EVT-INS-01 `ins.membership.requested`, EVT-INS-02 `ins.membership.approved`, EVT-INS-03 `ins.membership.rejected`, EVT-INS-04 `ins.membership.suspended`, EVT-INS-05 `ins.membership.exitRequested`, EVT-INS-06 `ins.membership.exited`.

**API y jobs disparadores (citados junto al evento en el anexo productor):** JOB-INS-07.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PM17 as M17 INS
    participant BUS as Outbox y colas (T01, T11)
    participant PT09 as T09 COM
    participant PT11 as T11 WFL
    participant PM01 as M01 PER
    participant PM04 as M04 TAR
    participant PM05 as M05 FAC
    participant PM19 as M19 POR
    participant PM18 as M18 SOC
    U->>PM17: JOB-INS-07
    PM17->>BUS: EVT-INS-01 ins.membership.requested
    par T09
        BUS->>PT09: Generar comunicaciones según catálogo. Los tipos sin evento ( soc.cem…
    and T11
        BUS->>PT11: consume EVT-INS-01
    end
    U->>PM17: Acción que origina el hecho
    PM17->>BUS: EVT-INS-02 ins.membership.approved
    par M01
        BUS->>PM01: Actualiza holders.membership con el associateMembershipId del payload…
    and M04
        BUS->>PM04: consume EVT-INS-02
    and M05
        BUS->>PM05: consume EVT-INS-02
    and M19
        BUS->>PM19: Con associateMembershipId y memberNumber (antes membershipId ), inval…
    and T09
        BUS->>PT09: Dimensión “asociado activo” y padrón de consultas.
    end
    U->>PM17: Acción que origina el hecho
    PM17->>BUS: EVT-INS-03 ins.membership.rejected
    BUS->>PT09: consume EVT-INS-03
    U->>PM17: Acción que origina el hecho
    PM17->>BUS: EVT-INS-04 ins.membership.suspended y 1 tipo más
    par M01
        BUS->>PM01: consume EVT-INS-04
    and M19
        BUS->>PM19: Con associateMembershipId y date (antes membershipId ), invalida la c…
    end
    U->>PM17: Acción que origina el hecho
    PM17->>BUS: EVT-INS-05 ins.membership.exitRequested
    BUS->>PT11: consume EVT-INS-05
    U->>PM17: Acción que origina el hecho
    PM17->>BUS: EVT-INS-06 ins.membership.exited
    par M01
        BUS->>PM01: consume EVT-INS-06
    and M04
        BUS->>PM04: consume EVT-INS-06
    and M05
        BUS->>PM05: consume EVT-INS-06
    and M18
        BUS->>PM18: Con associateMembershipId , cause y effectiveDate del payload (antes…
    and M19
        BUS->>PM19: Con associateMembershipId y effectiveDate (antes membershipId ), inva…
    end
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-INS-01 `ins.membership.requested` | T09, T11 | T09: Generar comunicaciones según catálogo. Los tipos sin evento (`soc.cemeteryAct.scheduled`, `soc.loan.overdue`) entran por el comando `com.communications.emit` (§9.7). |
| EVT-INS-02 `ins.membership.approved` | M01, M04, M05, M19, T09 | M01: Actualiza `holders.membership` con el `associateMembershipId` del payload (antes `membershipId`; PA-INS-12).; M19: Con `associateMembershipId` y `memberNumber` (antes `membershipId`), invalida la caché de "Mi asoci… |
| EVT-INS-03 `ins.membership.rejected` | T09 | No declarado en el §12 del consumidor |
| EVT-INS-04 `ins.membership.suspended` | M01, M19 | M19: Con `associateMembershipId` y `date` (antes `membershipId`), invalida la caché de "Mi asociación" (PAN-POR-102) y actualiza el estado de asociado mostrado. Consumo declarado en T11 §12 |
| EVT-INS-05 `ins.membership.exitRequested` | T11 | No declarado en el §12 del consumidor |
| EVT-INS-06 `ins.membership.exited` | M01, M04, M05, M18, M19 | M18: Con `associateMembershipId`, `cause` y `effectiveDate` del payload (antes `membershipId`), registra con fecha efectiva que el titular dejó de ser asociado y abre una tarea de revisión de elegibilidad para los benef… |

### SEC-INS-02 — INS: hechos complementarios (member, Libro mayor de capital, Transferencias de capital, Reembolsos de capital, Distribución de excedentes)

**Agregados:** `ins.member.*`, `ins.capitalMovement.*`, `ins.capitalTransfer.*`, `ins.capitalRefund.*`, `ins.surplusDistribution.*`. **Productor:** M17 Institucional (M17 §12; catálogo T11 §12.3).

**Cubre:** EVT-INS-07 `ins.member.withoutServices`, EVT-INS-08 `ins.capitalMovement.recorded`, EVT-INS-09 `ins.capitalMovement.reversed`, EVT-INS-10 `ins.capitalTransfer.executed`, EVT-INS-11 `ins.capitalRefund.approved`, EVT-INS-12 `ins.capitalRefund.paid`, EVT-INS-13 `ins.surplusDistribution.approved`.

**API y jobs disparadores (citados junto al evento en el anexo productor):** JOB-INS-07, JOB-INS-01.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PM17 as M17 INS
    participant BUS as Outbox y colas (T01, T11)
    participant PT11 as T11 WFL
    participant PM15 as M15 CON
    participant PM19 as M19 POR
    participant PM01 as M01 PER
    participant PM05 as M05 FAC
    participant PM14 as M14 TES
    participant PT09 as T09 COM
    participant PM07 as M07 COB
    U->>PM17: JOB-INS-07
    PM17->>BUS: EVT-INS-07 ins.member.withoutServices
    BUS->>PT11: consume EVT-INS-07
    U->>PM17: JOB-INS-01
    PM17->>BUS: EVT-INS-08 ins.capitalMovement.recorded
    par M15
        BUS->>PM15: consume EVT-INS-08
    and M19
        BUS->>PM19: Invalida la caché de capital social en Mi asociación (PAN-POR-102). C…
    end
    U->>PM17: Acción que origina el hecho
    PM17->>BUS: EVT-INS-09 ins.capitalMovement.reversed
    BUS->>PM15: consume EVT-INS-09
    U->>PM17: Acción que origina el hecho
    PM17->>BUS: EVT-INS-10 ins.capitalTransfer.executed
    par M01
        BUS->>PM01: consume EVT-INS-10
    and M15
        BUS->>PM15: consume EVT-INS-10
    end
    U->>PM17: Acción que origina el hecho
    PM17->>BUS: EVT-INS-11 ins.capitalRefund.approved
    par M05
        BUS->>PM05: consume EVT-INS-11
    and M14
        BUS->>PM14: consume EVT-INS-11
    end
    U->>PM17: Acción que origina el hecho
    PM17->>BUS: EVT-INS-12 ins.capitalRefund.paid
    par M15
        BUS->>PM15: consume EVT-INS-12
    and T09
        BUS->>PT09: consume EVT-INS-12
    end
    U->>PM17: Acción que origina el hecho
    PM17->>BUS: EVT-INS-13 ins.surplusDistribution.approved y 1 tipo más
    par M07
        BUS->>PM07: consume EVT-INS-13
    and M14
        BUS->>PM14: consume EVT-INS-13
    and M15
        BUS->>PM15: consume EVT-INS-13
    end
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-INS-07 `ins.member.withoutServices` | T11 | No declarado en el §12 del consumidor |
| EVT-INS-08 `ins.capitalMovement.recorded` | M15, M19 | M19: Invalida la caché de capital social en "Mi asociación" (PAN-POR-102). Consumo declarado en T11 §12 |
| EVT-INS-09 `ins.capitalMovement.reversed` | M15 | No declarado en el §12 del consumidor |
| EVT-INS-10 `ins.capitalTransfer.executed` | M01, M15 | No declarado en el §12 del consumidor |
| EVT-INS-11 `ins.capitalRefund.approved` | M05, M14 | No declarado en el §12 del consumidor |
| EVT-INS-12 `ins.capitalRefund.paid` | M15, T09 | No declarado en el §12 del consumidor |
| EVT-INS-13 `ins.surplusDistribution.approved` | M07, M14, M15 | No declarado en el §12 del consumidor |

### SEC-INS-03 — INS: hechos complementarios (Reuniones y asambleas, Actas, Resoluciones, Padrones, Mandatos, fee, Presentaciones INAES)

**Agregados:** `ins.meeting.*`, `ins.minute.*`, `ins.resolution.*`, `ins.roster.*`, `ins.mandate.*`, `ins.fee.*`, `ins.inaesReport.*`. **Productor:** M17 Institucional (M17 §12; catálogo T11 §12.3).

**Cubre:** EVT-INS-14 `ins.meeting.convened`, EVT-INS-15 `ins.meeting.closed`, EVT-INS-16 `ins.minute.signed`, EVT-INS-17 `ins.resolution.created`, EVT-INS-18 `ins.roster.finalized`, EVT-INS-19 `ins.mandate.started`, EVT-INS-20 `ins.fee.settled`, EVT-INS-21 `ins.inaesReport.submitted`.

**API y jobs disparadores (citados junto al evento en el anexo productor):** JOB-INS-10.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PM17 as M17 INS
    participant BUS as Outbox y colas (T01, T11)
    participant PM19 as M19 POR
    participant PT09 as T09 COM
    participant PT11 as T11 WFL
    participant PM09 as M09 CRM
    participant PT02 as T02 IAM
    participant PM06 as M06 FIS
    participant PM14 as M14 TES
    participant PM15 as M15 CON
    U->>PM17: Acción que origina el hecho
    PM17->>BUS: EVT-INS-14 ins.meeting.convened
    par M19
        BUS->>PM19: consume EVT-INS-14
    and T09
        BUS->>PT09: consume EVT-INS-14
    and T11
        BUS->>PT11: consume EVT-INS-14
    end
    U->>PM17: Acción que origina el hecho
    PM17->>BUS: EVT-INS-15 ins.meeting.closed
    BUS->>PT11: consume EVT-INS-15
    U->>PM17: Acción que origina el hecho
    PM17->>BUS: EVT-INS-16 ins.minute.signed
    BUS->>PT11: consume EVT-INS-16
    U->>PM17: Acción que origina el hecho
    PM17->>BUS: EVT-INS-17 ins.resolution.created
    BUS->>PM09: consume EVT-INS-17
    U->>PM17: Acción que origina el hecho
    PM17->>BUS: EVT-INS-18 ins.roster.finalized
    par M19
        BUS->>PM19: consume EVT-INS-18
    and T09
        BUS->>PT09: Dimensión “asociado activo” y padrón de consultas.
    end
    U->>PM17: Acción que origina el hecho
    PM17->>BUS: EVT-INS-19 ins.mandate.started y 1 tipo más
    par T02
        BUS->>PT02: consume EVT-INS-19
    and T11
        BUS->>PT11: consume EVT-INS-19
    end
    U->>PM17: JOB-INS-10
    PM17->>BUS: EVT-INS-20 ins.fee.settled
    par M06
        BUS->>PM06: consume EVT-INS-20
    and M14
        BUS->>PM14: consume EVT-INS-20
    and M15
        BUS->>PM15: consume EVT-INS-20
    end
    U->>PM17: Acción que origina el hecho
    PM17->>BUS: EVT-INS-21 ins.inaesReport.submitted
    BUS->>PT11: consume EVT-INS-21
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-INS-14 `ins.meeting.convened` | M19, T09, T11 | No declarado en el §12 del consumidor |
| EVT-INS-15 `ins.meeting.closed` | T11 | No declarado en el §12 del consumidor |
| EVT-INS-16 `ins.minute.signed` | T11 | No declarado en el §12 del consumidor |
| EVT-INS-17 `ins.resolution.created` | M09 | No declarado en el §12 del consumidor |
| EVT-INS-18 `ins.roster.finalized` | M19, T09 | T09: Dimensión “asociado activo” y padrón de consultas. |
| EVT-INS-19 `ins.mandate.started` | T02, T11 | No declarado en el §12 del consumidor |
| EVT-INS-20 `ins.fee.settled` | M06, M14, M15 | No declarado en el §12 del consumidor |
| EVT-INS-21 `ins.inaesReport.submitted` | T11 | No declarado en el §12 del consumidor |

## M18 — SOC Servicios sociales y flota

### SEC-SOC-01 — SOC: housing

**Agregados:** `soc.housing.*`. **Productor:** M18 Servicios sociales y flota (M18 §12; catálogo T11 §12.3).

**Cubre:** EVT-SOC-08 `soc.housing.allocated`, EVT-SOC-09 `soc.housing.materialWithdrawn`, EVT-SOC-10 `soc.housing.certificateLiquidated`, EVT-SOC-11 `soc.housing.priceUpdated`.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PM18 as M18 SOC
    participant BUS as Outbox y colas (T01, T11)
    participant PM04 as M04 TAR
    participant PM05 as M05 FAC
    participant PM07 as M07 COB
    participant PM19 as M19 POR
    participant PM13 as M13 STK
    participant PM15 as M15 CON
    participant PM12 as M12 CMP
    participant PM14 as M14 TES
    U->>PM18: Acción que origina el hecho
    PM18->>BUS: EVT-SOC-08 soc.housing.allocated y 4 tipos más
    par M04
        BUS->>PM04: consume EVT-SOC-08
    and M05
        BUS->>PM05: consume EVT-SOC-08
    and M07
        BUS->>PM07: consume EVT-SOC-08
    and M19
        BUS->>PM19: consume EVT-SOC-08
    end
    U->>PM18: Acción que origina el hecho
    PM18->>BUS: EVT-SOC-09 soc.housing.materialWithdrawn y 1 tipo más
    par M13
        BUS->>PM13: consume EVT-SOC-09
    and M15
        BUS->>PM15: consume EVT-SOC-09
    end
    U->>PM18: Acción que origina el hecho
    PM18->>BUS: EVT-SOC-10 soc.housing.certificateLiquidated
    par M12
        BUS->>PM12: consume EVT-SOC-10
    and M14
        BUS->>PM14: consume EVT-SOC-10
    and M15
        BUS->>PM15: consume EVT-SOC-10
    end
    U->>PM18: Acción que origina el hecho
    PM18->>BUS: EVT-SOC-11 soc.housing.priceUpdated
    BUS->>PM04: consume EVT-SOC-11
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-SOC-08 `soc.housing.allocated` | M04, M05, M07, M19 | No declarado en el §12 del consumidor |
| EVT-SOC-09 `soc.housing.materialWithdrawn` | M13, M15 | No declarado en el §12 del consumidor |
| EVT-SOC-10 `soc.housing.certificateLiquidated` | M12, M14, M15 | No declarado en el §12 del consumidor |
| EVT-SOC-11 `soc.housing.priceUpdated` | M04 | No declarado en el §12 del consumidor |

### SEC-SOC-02 — SOC: Vehículos

**Agregados:** `soc.vehicle.*`. **Productor:** M18 Servicios sociales y flota (M18 §12; catálogo T11 §12.3).

**Cubre:** EVT-SOC-12 `soc.vehicle.usageRecorded`, EVT-SOC-13 `soc.vehicle.unfit`, EVT-SOC-17 `soc.vehicle.usageVoided`.

**API y jobs disparadores (citados junto al evento en el anexo productor):** JOB-SOC-08, JOB-SOC-09.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PM18 as M18 SOC
    participant BUS as Outbox y colas (T01, T11)
    participant PM10 as M10 TEC
    participant PM15 as M15 CON
    participant PM16 as M16 SUE
    U->>PM18: Acción que origina el hecho
    PM18->>BUS: EVT-SOC-12 soc.vehicle.usageRecorded
    par M10
        BUS->>PM10: consume EVT-SOC-12
    and M15
        BUS->>PM15: consume EVT-SOC-12
    and M16
        BUS->>PM16: Proponer / retirar novedades de flota
    end
    U->>PM18: Acción que origina el hecho
    PM18->>BUS: EVT-SOC-13 soc.vehicle.unfit y 1 tipo más
    BUS->>PM10: consume EVT-SOC-13
    U->>PM18: JOB-SOC-08, JOB-SOC-09
    PM18->>BUS: EVT-SOC-17 soc.vehicle.usageVoided
    par M10
        BUS->>PM10: consume EVT-SOC-17
    and M15
        BUS->>PM15: consume EVT-SOC-17
    and M16
        BUS->>PM16: Proponer / retirar novedades de flota
    end
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-SOC-12 `soc.vehicle.usageRecorded` | M10, M15, M16 | M16: Proponer / retirar novedades de flota |
| EVT-SOC-13 `soc.vehicle.unfit` | M10 | No declarado en el §12 del consumidor |
| EVT-SOC-17 `soc.vehicle.usageVoided` | M10, M15, M16 | M16: Proponer / retirar novedades de flota |

### SEC-SOC-03 — SOC: hechos complementarios (Adherentes, Solicitudes de prestación, deathSubsidy, Derechos de sepultura, Inhumaciones, exhumaciones, trasl…)

**Agregados:** `soc.dependent.*`, `soc.benefitRequest.*`, `soc.deathSubsidy.*`, `soc.burialRight.*`, `soc.cemeteryAct.*`, `soc.trip.*`, `soc.tripSettlement.*`. **Productor:** M18 Servicios sociales y flota (M18 §12; catálogo T11 §12.3).

**Cubre:** EVT-SOC-01 `soc.dependent.added`, EVT-SOC-02 `soc.dependent.majorityReached`, EVT-SOC-03 `soc.benefitRequest.decided`, EVT-SOC-04 `soc.deathSubsidy.approved`, EVT-SOC-05 `soc.burialRight.formalized`, EVT-SOC-06 `soc.cemeteryAct.performed`, EVT-SOC-07 `soc.trip.completed`, EVT-SOC-14 `soc.tripSettlement.approved`.

**API y jobs disparadores (citados junto al evento en el anexo productor):** JOB-SOC-01, API-SOC-006.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PM18 as M18 SOC
    participant BUS as Outbox y colas (T01, T11)
    participant PM04 as M04 TAR
    participant PM17 as M17 INS
    participant PM19 as M19 POR
    participant PT09 as T09 COM
    participant PM05 as M05 FAC
    participant PM14 as M14 TES
    participant PM15 as M15 CON
    participant PM02 as M02 CAT
    participant PM16 as M16 SUE
    U->>PM18: Acción que origina el hecho
    PM18->>BUS: EVT-SOC-01 soc.dependent.added y 3 tipos más
    par M04
        BUS->>PM04: consume EVT-SOC-01
    and M17
        BUS->>PM17: consume EVT-SOC-01
    and M19
        BUS->>PM19: Actualizar integrantes en PAN-POR-67 y PAN-POR-98 (HUECO-TRV-01, HUE-…
    end
    U->>PM18: JOB-SOC-01
    PM18->>BUS: EVT-SOC-02 soc.dependent.majorityReached
    BUS->>PT09: Generar comunicaciones según catálogo. Los tipos sin evento ( soc.cem…
    U->>PM18: Acción que origina el hecho
    PM18->>BUS: EVT-SOC-03 soc.benefitRequest.decided
    par M04
        BUS->>PM04: consume EVT-SOC-03
    and M05
        BUS->>PM05: consume EVT-SOC-03
    and M19
        BUS->>PM19: consume EVT-SOC-03
    and T09
        BUS->>PT09: consume EVT-SOC-03
    end
    U->>PM18: Acción que origina el hecho
    PM18->>BUS: EVT-SOC-04 soc.deathSubsidy.approved
    par M14
        BUS->>PM14: consume EVT-SOC-04
    and M15
        BUS->>PM15: consume EVT-SOC-04
    end
    U->>PM18: API-SOC-006
    PM18->>BUS: EVT-SOC-05 soc.burialRight.formalized y 2 tipos más
    par M02
        BUS->>PM02: consume EVT-SOC-05
    and M04
        BUS->>PM04: consume EVT-SOC-05
    and M15
        BUS->>PM15: consume EVT-SOC-05
    and M19
        BUS->>PM19: consume EVT-SOC-05
    end
    U->>PM18: Acción que origina el hecho
    PM18->>BUS: EVT-SOC-06 soc.cemeteryAct.performed
    par M04
        BUS->>PM04: Cargo por acto de cementerio (RN-TAR-248), idempotente por actId .
    and M05
        BUS->>PM05: consume EVT-SOC-06
    and M19
        BUS->>PM19: consume EVT-SOC-06
    and T09
        BUS->>PT09: consume EVT-SOC-06
    end
    U->>PM18: Acción que origina el hecho
    PM18->>BUS: EVT-SOC-07 soc.trip.completed
    par M04
        BUS->>PM04: Cargo por traslado con cobertura/coseguro (RN-TAR-249), idempotente p…
    and M05
        BUS->>PM05: consume EVT-SOC-07
    and M15
        BUS->>PM15: consume EVT-SOC-07
    end
    U->>PM18: Acción que origina el hecho
    PM18->>BUS: EVT-SOC-14 soc.tripSettlement.approved
    par M15
        BUS->>PM15: consume EVT-SOC-14
    and M16
        BUS->>PM16: consume EVT-SOC-14
    end
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-SOC-01 `soc.dependent.added` | M04, M17, M19 | M19: Actualizar integrantes en PAN-POR-67 y PAN-POR-98 (HUECO-TRV-01, HUE-SRV-04) |
| EVT-SOC-02 `soc.dependent.majorityReached` | T09 | T09: Generar comunicaciones según catálogo. Los tipos sin evento (`soc.cemeteryAct.scheduled`, `soc.loan.overdue`) entran por el comando `com.communications.emit` (§9.7). |
| EVT-SOC-03 `soc.benefitRequest.decided` | M04, M05, M19, T09 | No declarado en el §12 del consumidor |
| EVT-SOC-04 `soc.deathSubsidy.approved` | M14, M15 | No declarado en el §12 del consumidor |
| EVT-SOC-05 `soc.burialRight.formalized` | M02, M04, M15, M19 | No declarado en el §12 del consumidor |
| EVT-SOC-06 `soc.cemeteryAct.performed` | M04, M05, M19, T09 | M04: Cargo por acto de cementerio (RN-TAR-248), idempotente por `actId`. |
| EVT-SOC-07 `soc.trip.completed` | M04, M05, M15 | M04: Cargo por traslado con cobertura/coseguro (RN-TAR-249), idempotente por `tripId`. |
| EVT-SOC-14 `soc.tripSettlement.approved` | M15, M16 | No declarado en el §12 del consumidor |

### SEC-SOC-04 — SOC: hechos complementarios (Choferes, agreementCost)

**Agregados:** `soc.driver.*`, `soc.agreementCost.*`. **Productor:** M18 Servicios sociales y flota (M18 §12; catálogo T11 §12.3).

**Cubre:** EVT-SOC-15 `soc.driver.timeReported`, EVT-SOC-16 `soc.agreementCost.recorded`.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PM18 as M18 SOC
    participant BUS as Outbox y colas (T01, T11)
    participant PM16 as M16 SUE
    participant PM12 as M12 CMP
    participant PM15 as M15 CON
    U->>PM18: Acción que origina el hecho
    PM18->>BUS: EVT-SOC-15 soc.driver.timeReported
    BUS->>PM16: consume EVT-SOC-15
    U->>PM18: Acción que origina el hecho
    PM18->>BUS: EVT-SOC-16 soc.agreementCost.recorded
    par M12
        BUS->>PM12: consume EVT-SOC-16
    and M15
        BUS->>PM15: consume EVT-SOC-16
    end
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-SOC-15 `soc.driver.timeReported` | M16 | No declarado en el §12 del consumidor |
| EVT-SOC-16 `soc.agreementCost.recorded` | M12, M15 | No declarado en el §12 del consumidor |

## Cobertura de la parte T

| Evento | Productor | Secuencia | También en |
|---|---|---|---|
| EVT-CON-01 | M15 | SEC-CON-01 | A8 (`06-secuencias-y-estados.md`) |
| EVT-CON-02 | M15 | SEC-CON-01 | — |
| EVT-CON-03 | M15 | SEC-CON-01 | — |
| EVT-CON-06 | M15 | SEC-CON-02 | A8 (`06-secuencias-y-estados.md`) |
| EVT-CON-07 | M15 | SEC-CON-02 | A8 (`06-secuencias-y-estados.md`) |
| EVT-CON-08 | M15 | SEC-CON-02 | A8 (`06-secuencias-y-estados.md`) |
| EVT-CON-04 | M15 | SEC-CON-03 | A8 (`06-secuencias-y-estados.md`) |
| EVT-CON-05 | M15 | SEC-CON-03 | A8 (`06-secuencias-y-estados.md`) |
| EVT-CON-09 | M15 | SEC-CON-03 | — |
| EVT-CON-10 | M15 | SEC-CON-03 | — |
| EVT-CON-12 | M15 | SEC-CON-03 | — |
| EVT-CON-13 | M15 | SEC-CON-03 | — |
| EVT-CON-14 | M15 | SEC-CON-03 | — |
| EVT-CON-15 | M15 | SEC-CON-03 | — |
| EVT-CON-16 | M15 | SEC-CON-04 | — |
| EVT-CON-17 | M15 | SEC-CON-04 | — |
| EVT-CON-18 | M15 | SEC-CON-04 | — |
| EVT-SUE-01 | M16 | SEC-SUE-01 | — |
| EVT-SUE-02 | M16 | SEC-SUE-01 | — |
| EVT-SUE-03 | M16 | SEC-SUE-01 | — |
| EVT-SUE-04 | M16 | SEC-SUE-01 | — |
| EVT-SUE-09 | M16 | SEC-SUE-02 | — |
| EVT-SUE-10 | M16 | SEC-SUE-02 | — |
| EVT-SUE-11 | M16 | SEC-SUE-02 | — |
| EVT-SUE-12 | M16 | SEC-SUE-02 | — |
| EVT-SUE-13 | M16 | SEC-SUE-02 | — |
| EVT-SUE-14 | M16 | SEC-SUE-03 | — |
| EVT-SUE-15 | M16 | SEC-SUE-03 | — |
| EVT-SUE-16 | M16 | SEC-SUE-03 | — |
| EVT-SUE-05 | M16 | SEC-SUE-04 | — |
| EVT-SUE-06 | M16 | SEC-SUE-04 | — |
| EVT-SUE-07 | M16 | SEC-SUE-04 | — |
| EVT-SUE-08 | M16 | SEC-SUE-04 | — |
| EVT-SUE-17 | M16 | SEC-SUE-04 | — |
| EVT-SUE-27 | M16 | SEC-SUE-04 | — |
| EVT-SUE-18 | M16 | SEC-SUE-04 | — |
| EVT-SUE-19 | M16 | SEC-SUE-04 | — |
| EVT-SUE-20 | M16 | SEC-SUE-05 | — |
| EVT-SUE-21 | M16 | SEC-SUE-05 | — |
| EVT-SUE-22 | M16 | SEC-SUE-05 | — |
| EVT-SUE-23 | M16 | SEC-SUE-05 | — |
| EVT-SUE-24 | M16 | SEC-SUE-05 | — |
| EVT-SUE-25 | M16 | SEC-SUE-05 | — |
| EVT-SUE-26 | M16 | SEC-SUE-05 | — |
| EVT-SUE-28 | M16 | SEC-SUE-05 | — |
| EVT-INS-01 | M17 | SEC-INS-01 | — |
| EVT-INS-02 | M17 | SEC-INS-01 | — |
| EVT-INS-03 | M17 | SEC-INS-01 | — |
| EVT-INS-04 | M17 | SEC-INS-01 | — |
| EVT-INS-05 | M17 | SEC-INS-01 | — |
| EVT-INS-06 | M17 | SEC-INS-01 | — |
| EVT-INS-07 | M17 | SEC-INS-02 | — |
| EVT-INS-08 | M17 | SEC-INS-02 | — |
| EVT-INS-09 | M17 | SEC-INS-02 | — |
| EVT-INS-10 | M17 | SEC-INS-02 | — |
| EVT-INS-11 | M17 | SEC-INS-02 | — |
| EVT-INS-12 | M17 | SEC-INS-02 | — |
| EVT-INS-13 | M17 | SEC-INS-02 | — |
| EVT-INS-14 | M17 | SEC-INS-03 | — |
| EVT-INS-15 | M17 | SEC-INS-03 | — |
| EVT-INS-16 | M17 | SEC-INS-03 | — |
| EVT-INS-17 | M17 | SEC-INS-03 | — |
| EVT-INS-18 | M17 | SEC-INS-03 | — |
| EVT-INS-19 | M17 | SEC-INS-03 | — |
| EVT-INS-20 | M17 | SEC-INS-03 | — |
| EVT-INS-21 | M17 | SEC-INS-03 | — |
| EVT-SOC-08 | M18 | SEC-SOC-01 | — |
| EVT-SOC-09 | M18 | SEC-SOC-01 | — |
| EVT-SOC-10 | M18 | SEC-SOC-01 | — |
| EVT-SOC-11 | M18 | SEC-SOC-01 | — |
| EVT-SOC-12 | M18 | SEC-SOC-02 | — |
| EVT-SOC-13 | M18 | SEC-SOC-02 | — |
| EVT-SOC-17 | M18 | SEC-SOC-02 | — |
| EVT-SOC-01 | M18 | SEC-SOC-03 | — |
| EVT-SOC-02 | M18 | SEC-SOC-03 | — |
| EVT-SOC-03 | M18 | SEC-SOC-03 | — |
| EVT-SOC-04 | M18 | SEC-SOC-03 | — |
| EVT-SOC-05 | M18 | SEC-SOC-03 | — |
| EVT-SOC-06 | M18 | SEC-SOC-03 | — |
| EVT-SOC-07 | M18 | SEC-SOC-03 | — |
| EVT-SOC-14 | M18 | SEC-SOC-03 | — |
| EVT-SOC-15 | M18 | SEC-SOC-04 | — |
| EVT-SOC-16 | M18 | SEC-SOC-04 | — |
