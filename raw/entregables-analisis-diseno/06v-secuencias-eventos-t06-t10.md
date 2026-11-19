# GoodApps Cooperativas — Diagramas de secuencia por eventos, parte V (T06-T10)

**Entregable de análisis y diseño — Artefacto 7.3 (diagramas de secuencia), ampliación a cobertura completa**

| Campo | Valor |
|---|---|
| Documento | `06v-secuencias-eventos-t06-t10.md` |
| Índice del entregable | [`06-secuencias-y-estados.md`](06-secuencias-y-estados.md) (sección 7) y [`06a-indice-cobertura-secuencias-estados.md`](06a-indice-cobertura-secuencias-estados.md) |
| Versión | 1.0 |
| Fecha | 05-11-2026 |
| Estado | Borrador para revisión |
| Fuentes | T11 §12.2 y §12.3 (catálogo de eventos y consumidores); §12 "Eventos consumidos" y §11 de los anexos T06, T07, T08, T09, T10 |
| Generación | Script `_trabajo/gen06_build.py` (extrae de los anexos; revisión manual posterior) |

## 1. Cómo leer esta parte

Cada diagrama representa un flujo de negocio entre módulos construido a partir del catálogo de eventos de T11 §12.3: un agregado del productor (por ejemplo, `cat.contract.*`) con sus hechos en orden de ID, o un grupo de hechos complementarios del mismo productor cuando el agregado tiene menos de tres eventos. Todos siguen el patrón transversal de `06-secuencias-y-estados.md` §2.2 (outbox en la misma transacción, relay, inbox por consumidor, reintentos y cola de errores), que no se repite en cada diagrama.

- **U** es el origen del hecho: usuario, API o job. Se citan las API y jobs que el anexo productor nombra junto al evento.
- **BUS** es la outbox con el relay y las colas BullMQ; cada consumidor recibe su propio job.
- `par` agrupa consumidores independientes del mismo evento. El texto del mensaje es el efecto que declara el consumidor en el §12 de su anexo; "consume EVT-…" indica que el consumidor figura en T11 pero no describe el efecto. **GEN** representa consumidores genéricos de T11 ("módulo dueño del tipo", "todos").
- Debajo de cada diagrama, la tabla lista los EVT que cubre, sus consumidores externos y los efectos declarados.

## T06 — INT Integraciones

### SEC-INT-01 — INT: hechos complementarios (Conexión del tenant con un proveedor, Bitácora de operaciones con proveedores, circuit, Metadatos de certific…)

**Agregados:** `int.connection.*`, `int.operation.*`, `int.circuit.*`, `int.certificate.*`, `int.arca.*`, `int.padron.*`, `int.paymentIntent.*`. **Productor:** T06 Integraciones (T06 §12; catálogo T11 §12.3).

**Cubre:** EVT-INT-01 `int.connection.activated`, EVT-INT-02 `int.connection.blocked`, EVT-INT-03 `int.operation.succeeded`, EVT-INT-04 `int.circuit.opened`, EVT-INT-05 `int.certificate.expiring`, EVT-INT-06 `int.arca.caeObtained`, EVT-INT-07 `int.padron.personaRetrieved`, EVT-INT-08 `int.paymentIntent.created`.

**API y jobs disparadores (citados junto al evento en el anexo productor):** JOB-INT-19.

Parte de estos hechos también aparece, con el detalle del caso de negocio, en A2 de `06-secuencias-y-estados.md` §3.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PT06 as T06 INT
    participant BUS as Outbox y colas (T01, T11)
    participant PM03 as M03 MED
    participant PM06 as M06 FIS
    participant PM07 as M07 COB
    participant PM09 as M09 CRM
    participant PM10 as M10 TEC
    participant PM14 as M14 TES
    participant PT01 as T01 PLA
    participant PT02 as T02 IAM
    participant PT09 as T09 COM
    participant PT11 as T11 WFL
    participant PM05 as M05 FAC
    participant PT04 as T04 CFG
    participant PM01 as M01 PER
    participant PM12 as M12 CMP
    participant PM19 as M19 POR
    U->>PT06: Acción que origina el hecho
    PT06->>BUS: EVT-INT-01 int.connection.activated y 2 tipos más
    par M03
        BUS->>PM03: consume EVT-INT-01
    and M06
        BUS->>PM06: consume EVT-INT-01
    and M07
        BUS->>PM07: consume EVT-INT-01
    and M09
        BUS->>PM09: consume EVT-INT-01
    and M10
        BUS->>PM10: consume EVT-INT-01
    and M14
        BUS->>PM14: consume EVT-INT-01
    and T01
        BUS->>PT01: consume EVT-INT-01
    and T02
        BUS->>PT02: consume EVT-INT-01
    and T09
        BUS->>PT09: consume EVT-INT-01
    and T11
        BUS->>PT11: consume EVT-INT-01
    end
    U->>PT06: Acción que origina el hecho
    PT06->>BUS: EVT-INT-02 int.connection.blocked
    par M05
        BUS->>PM05: consume EVT-INT-02
    and M06
        BUS->>PM06: consume EVT-INT-02
    and M07
        BUS->>PM07: consume EVT-INT-02
    and T09
        BUS->>PT09: Generar comunicaciones según catálogo. Los tipos sin evento ( soc.cem…
    end
    U->>PT06: Acción que origina el hecho
    PT06->>BUS: EVT-INT-03 int.operation.succeeded y 4 tipos más
    par M03
        BUS->>PM03: consume EVT-INT-03
    and M06
        BUS->>PM06: consume EVT-INT-03
    and M07
        BUS->>PM07: consume EVT-INT-03
    and M09
        BUS->>PM09: consume EVT-INT-03
    and M10
        BUS->>PM10: consume EVT-INT-03
    and M14
        BUS->>PM14: consume EVT-INT-03
    and T09
        BUS->>PT09: consume EVT-INT-03
    and T11
        BUS->>PT11: consume EVT-INT-03
    end
    U->>PT06: Acción que origina el hecho
    PT06->>BUS: EVT-INT-04 int.circuit.opened y 1 tipo más
    par M07
        BUS->>PM07: Salud del conector excepción connectorDown .
    and T09
        BUS->>PT09: Pausa/reanuda colas del canal alerta.
    and T11
        BUS->>PT11: consume EVT-INT-04
    end
    U->>PT06: Acción que origina el hecho
    PT06->>BUS: EVT-INT-05 int.certificate.expiring y 3 tipos más
    par T04
        BUS->>PT04: Actualizar estado de secretRef .
    and T09
        BUS->>PT09: consume EVT-INT-05
    end
    U->>PT06: Acción que origina el hecho
    PT06->>BUS: EVT-INT-06 int.arca.caeObtained y 4 tipos más
    par M05
        BUS->>PM05: consume EVT-INT-06
    and M06
        BUS->>PM06: consume EVT-INT-06
    end
    U->>PT06: Acción que origina el hecho
    PT06->>BUS: EVT-INT-07 int.padron.personaRetrieved
    par M01
        BUS->>PM01: consume EVT-INT-07
    and M12
        BUS->>PM12: consume EVT-INT-07
    end
    U->>PT06: JOB-INT-19
    PT06->>BUS: EVT-INT-08 int.paymentIntent.created y 5 tipos más
    par M07
        BUS->>PM07: consume EVT-INT-08
    and M19
        BUS->>PM19: consume EVT-INT-08
    end
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-INT-01 `int.connection.activated` | M03, M06, M07, M09, M10, M14, T01, T02, T09, T11 | No declarado en el §12 del consumidor |
| EVT-INT-02 `int.connection.blocked` | M05, M06, M07, T09 | T09: Generar comunicaciones según catálogo. Los tipos sin evento (`soc.cemeteryAct.scheduled`, `soc.loan.overdue`) entran por el comando `com.communications.emit` (§9.7). |
| EVT-INT-03 `int.operation.succeeded` | M03, M06, M07, M09, M10, M14, T09, T11 | No declarado en el §12 del consumidor |
| EVT-INT-04 `int.circuit.opened` | M07, T09, T11 | M07: Salud del conector; excepción `connectorDown`.; T09: Pausa/reanuda colas del canal; alerta. |
| EVT-INT-05 `int.certificate.expiring` | T04, T09 | T04: Actualizar estado de `secretRef`. |
| EVT-INT-06 `int.arca.caeObtained` | M05, M06 | No declarado en el §12 del consumidor |
| EVT-INT-07 `int.padron.personaRetrieved` | M01, M12 | No declarado en el §12 del consumidor |
| EVT-INT-08 `int.paymentIntent.created` | M07, M19 | No declarado en el §12 del consumidor |

### SEC-INT-02 — INT: hechos complementarios (debtPublication, remittance, directDebit, bank, Mensajes saneados de request/response, meter, network, cdr)

**Agregados:** `int.debtPublication.*`, `int.remittance.*`, `int.directDebit.*`, `int.bank.*`, `int.message.*`, `int.meter.*`, `int.network.*`, `int.cdr.*`. **Productor:** T06 Integraciones (T06 §12; catálogo T11 §12.3).

**Cubre:** EVT-INT-09 `int.debtPublication.acknowledged`, EVT-INT-10 `int.remittance.lineReceived`, EVT-INT-11 `int.directDebit.adhesionUpdated`, EVT-INT-12 `int.bank.movementsReceived`, EVT-INT-13 `int.message.sent`, EVT-INT-14 `int.meter.readingReceived`, EVT-INT-15 `int.network.provisioningResult`, EVT-INT-16 `int.cdr.batchReceived`.

**API y jobs disparadores (citados junto al evento en el anexo productor):** JOB-INT-23.

Parte de estos hechos también aparece, con el detalle del caso de negocio, en A4 de `06-secuencias-y-estados.md` §3.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PT06 as T06 INT
    participant BUS as Outbox y colas (T01, T11)
    participant PM07 as M07 COB
    participant PM01 as M01 PER
    participant PM14 as M14 TES
    participant PM09 as M09 CRM
    participant PT09 as T09 COM
    participant PM03 as M03 MED
    participant PM08 as M08 MOR
    participant PM10 as M10 TEC
    participant PM04 as M04 TAR
    U->>PT06: Acción que origina el hecho
    PT06->>BUS: EVT-INT-09 int.debtPublication.acknowledged y 1 tipo más
    BUS->>PM07: consume EVT-INT-09
    U->>PT06: Acción que origina el hecho
    PT06->>BUS: EVT-INT-10 int.remittance.lineReceived y 1 tipo más
    BUS->>PM07: consume EVT-INT-10
    U->>PT06: Acción que origina el hecho
    PT06->>BUS: EVT-INT-11 int.directDebit.adhesionUpdated y 1 tipo más
    par M01
        BUS->>PM01: consume EVT-INT-11
    and M07
        BUS->>PM07: consume EVT-INT-11
    end
    U->>PT06: Acción que origina el hecho
    PT06->>BUS: EVT-INT-12 int.bank.movementsReceived y 1 tipo más
    BUS->>PM14: consume EVT-INT-12
    U->>PT06: Acción que origina el hecho
    PT06->>BUS: EVT-INT-13 int.message.sent y 5 tipos más
    par M09
        BUS->>PM09: consume EVT-INT-13
    and T09
        BUS->>PT09: Estados de entrega y mensajes entrantes (P-COM-10).
    end
    U->>PT06: Acción que origina el hecho
    PT06->>BUS: EVT-INT-14 int.meter.readingReceived y 2 tipos más
    par M03
        BUS->>PM03: consume EVT-INT-14
    and M08
        BUS->>PM08: consume EVT-INT-14
    and M10
        BUS->>PM10: consume EVT-INT-14
    end
    U->>PT06: Acción que origina el hecho
    PT06->>BUS: EVT-INT-15 int.network.provisioningResult
    par M08
        BUS->>PM08: Transición del caso (acción remota) según result .
    and M10
        BUS->>PM10: consume EVT-INT-15
    end
    U->>PT06: JOB-INT-23
    PT06->>BUS: EVT-INT-16 int.cdr.batchReceived
    par M04
        BUS->>PM04: consume EVT-INT-16
    and M10
        BUS->>PM10: consume EVT-INT-16
    end
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-INT-09 `int.debtPublication.acknowledged` | M07 | No declarado en el §12 del consumidor |
| EVT-INT-10 `int.remittance.lineReceived` | M07 | No declarado en el §12 del consumidor |
| EVT-INT-11 `int.directDebit.adhesionUpdated` | M01, M07 | No declarado en el §12 del consumidor |
| EVT-INT-12 `int.bank.movementsReceived` | M14 | No declarado en el §12 del consumidor |
| EVT-INT-13 `int.message.sent` | M09, T09 | T09: Estados de entrega y mensajes entrantes (P-COM-10). |
| EVT-INT-14 `int.meter.readingReceived` | M03, M08, M10 | No declarado en el §12 del consumidor |
| EVT-INT-15 `int.network.provisioningResult` | M08, M10 | M08: Transición del caso (acción remota) según `result`. |
| EVT-INT-16 `int.cdr.batchReceived` | M04, M10 | No declarado en el §12 del consumidor |

### SEC-INT-03 — INT: hechos complementarios (fleet, signature, file, Conciliaciones técnicas con proveedores, Contingencias declaradas, Agentes de hardwar…)

**Agregados:** `int.fleet.*`, `int.signature.*`, `int.file.*`, `int.reconciliation.*`, `int.contingency.*`, `int.agent.*`, `int.ai.*`, `int.serviceUsage.*`. **Productor:** T06 Integraciones (T06 §12; catálogo T11 §12.3).

**Cubre:** EVT-INT-17 `int.fleet.positionsReceived`, EVT-INT-18 `int.signature.completed`, EVT-INT-19 `int.file.generated`, EVT-INT-20 `int.reconciliation.closed`, EVT-INT-21 `int.contingency.started`, EVT-INT-22 `int.agent.online`, EVT-INT-23 `int.ai.completionReady`, EVT-INT-24 `int.serviceUsage.received`.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PT06 as T06 INT
    participant BUS as Outbox y colas (T01, T11)
    participant PM18 as M18 SOC
    participant PM08 as M08 MOR
    participant PM12 as M12 CMP
    participant PM16 as M16 SUE
    participant PT11 as T11 WFL
    participant PM03 as M03 MED
    participant PM06 as M06 FIS
    participant PM07 as M07 COB
    participant PM14 as M14 TES
    participant PM05 as M05 FAC
    participant PM09 as M09 CRM
    participant PM11 as M11 VEN
    participant PT09 as T09 COM
    participant PT10 as T10 BIA
    participant PM04 as M04 TAR
    participant PM10 as M10 TEC
    U->>PT06: Acción que origina el hecho
    PT06->>BUS: EVT-INT-17 int.fleet.positionsReceived
    BUS->>PM18: JOB-SOC-08 normaliza y guarda las posiciones GPS.
    U->>PT06: Acción que origina el hecho
    PT06->>BUS: EVT-INT-18 int.signature.completed y 1 tipo más
    par M08
        BUS->>PM08: consume EVT-INT-18
    and M12
        BUS->>PM12: consume EVT-INT-18
    and M16
        BUS->>PM16: consume EVT-INT-18
    and T11
        BUS->>PT11: consume EVT-INT-18
    end
    U->>PT06: Acción que origina el hecho
    PT06->>BUS: EVT-INT-19 int.file.generated y 3 tipos más
    par M03
        BUS->>PM03: consume EVT-INT-19
    and M06
        BUS->>PM06: consume EVT-INT-19
    and M07
        BUS->>PM07: Dispara JOB-COB-02 / JOB-COB-08 / JOB-COB-18.
    and M14
        BUS->>PM14: consume EVT-INT-19
    end
    U->>PT06: Acción que origina el hecho
    PT06->>BUS: EVT-INT-20 int.reconciliation.closed y 1 tipo más
    par M06
        BUS->>PM06: consume EVT-INT-20
    and M07
        BUS->>PM07: consume EVT-INT-20
    and M14
        BUS->>PM14: consume EVT-INT-20
    end
    U->>PT06: Acción que origina el hecho
    PT06->>BUS: EVT-INT-21 int.contingency.started y 1 tipo más
    par M05
        BUS->>PM05: consume EVT-INT-21
    and M06
        BUS->>PM06: consume EVT-INT-21
    and M07
        BUS->>PM07: consume EVT-INT-21
    end
    U->>PT06: Acción que origina el hecho
    PT06->>BUS: EVT-INT-22 int.agent.online y 2 tipos más
    par M07
        BUS->>PM07: consume EVT-INT-22
    and M09
        BUS->>PM09: Estado de dispositivos del turnero
    and M11
        BUS->>PM11: consume EVT-INT-22
    end
    U->>PT06: Acción que origina el hecho
    PT06->>BUS: EVT-INT-23 int.ai.completionReady
    par M09
        BUS->>PM09: consume EVT-INT-23
    and T09
        BUS->>PT09: Resultado de moderación IA y borradores.
    and T10
        BUS->>PT10: consume EVT-INT-23
    end
    U->>PT06: Acción que origina el hecho
    PT06->>BUS: EVT-INT-24 int.serviceUsage.received
    par M04
        BUS->>PM04: consume EVT-INT-24
    and M10
        BUS->>PM10: Registrar el consumo de correo o pack SMS en mobileUsageImports ( kin…
    end
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-INT-17 `int.fleet.positionsReceived` | M18 | M18: JOB-SOC-08 normaliza y guarda las posiciones GPS. |
| EVT-INT-18 `int.signature.completed` | M08, M12, M16, T11 | No declarado en el §12 del consumidor |
| EVT-INT-19 `int.file.generated` | M03, M06, M07, M14 | M07: Dispara JOB-COB-02 / JOB-COB-08 / JOB-COB-18. |
| EVT-INT-20 `int.reconciliation.closed` | M06, M07, M14 | No declarado en el §12 del consumidor |
| EVT-INT-21 `int.contingency.started` | M05, M06, M07 | No declarado en el §12 del consumidor |
| EVT-INT-22 `int.agent.online` | M07, M09, M11 | M09: Estado de dispositivos del turnero |
| EVT-INT-23 `int.ai.completionReady` | M09, T09, T10 | T09: Resultado de moderación IA y borradores. |
| EVT-INT-24 `int.serviceUsage.received` | M04, M10 | M10: Registrar el consumo de correo o pack SMS en `mobileUsageImports` (`kind = ticQuota`), atribuirlo al contrato por la referencia externa y publicar EVT-TEC-38 por contrato (RF-TEC-195; DEC-084). Idempotente por `mes`… |

## T07 — MIG Migración desde ProCoop

### SEC-MIG-01 — MIG: hechos complementarios (Copias del origen, run, Rechazos y advertencias, Conciliaciones origen-destino, parallel, domain, cutover, ro…)

**Agregados:** `mig.snapshot.*`, `mig.run.*`, `mig.issue.*`, `mig.reconciliation.*`, `mig.parallel.*`, `mig.domain.*`, `mig.cutover.*`, `mig.rollback.*`. **Productor:** T07 Migración desde ProCoop (T07 §12; catálogo T11 §12.3).

**Cubre:** EVT-MIG-01 `mig.snapshot.ready`, EVT-MIG-02 `mig.run.started`, EVT-MIG-03 `mig.issue.assigned`, EVT-MIG-04 `mig.reconciliation.approved`, EVT-MIG-05 `mig.parallel.compared`, EVT-MIG-06 `mig.domain.switched`, EVT-MIG-07 `mig.cutover.completed`, EVT-MIG-08 `mig.rollback.executed`.

Parte de estos hechos también aparece, con el detalle del caso de negocio, en A9 de `06-secuencias-y-estados.md` §3.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PT07 as T07 MIG
    participant BUS as Outbox y colas (T01, T11)
    participant PT04 as T04 CFG
    participant PT02 as T02 IAM
    participant PT09 as T09 COM
    participant PT11 as T11 WFL
    participant PT10 as T10 BIA
    participant PM01 as M01 PER
    participant PM07 as M07 COB
    participant PM19 as M19 POR
    participant PT06 as T06 INT
    participant PM05 as M05 FAC
    participant PM06 as M06 FIS
    U->>PT07: Acción que origina el hecho
    PT07->>BUS: EVT-MIG-01 mig.snapshot.ready
    BUS->>PT04: Disparar JOB-CFG-10.
    U->>PT07: Acción que origina el hecho
    PT07->>BUS: EVT-MIG-02 mig.run.started y 3 tipos más
    par T02
        BUS->>PT02: consume EVT-MIG-02
    and T09
        BUS->>PT09: consume EVT-MIG-02
    end
    U->>PT07: Acción que origina el hecho
    PT07->>BUS: EVT-MIG-03 mig.issue.assigned
    BUS->>PT11: consume EVT-MIG-03
    U->>PT07: Acción que origina el hecho
    PT07->>BUS: EVT-MIG-04 mig.reconciliation.approved y 1 tipo más
    BUS->>PT10: consume EVT-MIG-04
    U->>PT07: Acción que origina el hecho
    PT07->>BUS: EVT-MIG-05 mig.parallel.compared y 1 tipo más
    BUS->>PT10: consume EVT-MIG-05
    U->>PT07: Acción que origina el hecho
    PT07->>BUS: EVT-MIG-06 mig.domain.switched
    par M01
        BUS->>PM01: consume EVT-MIG-06
    and M07
        BUS->>PM07: consume EVT-MIG-06
    and M19
        BUS->>PM19: consume EVT-MIG-06
    and T06
        BUS->>PT06: consume EVT-MIG-06
    end
    U->>PT07: Acción que origina el hecho
    PT07->>BUS: EVT-MIG-07 mig.cutover.completed
    par M05
        BUS->>PM05: consume EVT-MIG-07
    and M06
        BUS->>PM06: consume EVT-MIG-07
    and M07
        BUS->>PM07: consume EVT-MIG-07
    and M19
        BUS->>PM19: consume EVT-MIG-07
    and T09
        BUS->>PT09: consume EVT-MIG-07
    end
    U->>PT07: Acción que origina el hecho
    PT07->>BUS: EVT-MIG-08 mig.rollback.executed
    par M01
        BUS->>PM01: consume EVT-MIG-08
    and M19
        BUS->>PM19: consume EVT-MIG-08
    and T02
        BUS->>PT02: consume EVT-MIG-08
    and T04
        BUS->>PT04: consume EVT-MIG-08
    end
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-MIG-01 `mig.snapshot.ready` | T04 | T04: Disparar JOB-CFG-10. |
| EVT-MIG-02 `mig.run.started` | T02, T09 | No declarado en el §12 del consumidor |
| EVT-MIG-03 `mig.issue.assigned` | T11 | No declarado en el §12 del consumidor |
| EVT-MIG-04 `mig.reconciliation.approved` | T10 | No declarado en el §12 del consumidor |
| EVT-MIG-05 `mig.parallel.compared` | T10 | No declarado en el §12 del consumidor |
| EVT-MIG-06 `mig.domain.switched` | M01, M07, M19, T06 | No declarado en el §12 del consumidor |
| EVT-MIG-07 `mig.cutover.completed` | M05, M06, M07, M19, T09 | No declarado en el §12 del consumidor |
| EVT-MIG-08 `mig.rollback.executed` | M01, M19, T02, T04 | No declarado en el §12 del consumidor |

### SEC-MIG-02 — MIG: hechos complementarios (person)

**Agregados:** `mig.person.*`. **Productor:** T07 Migración desde ProCoop (T07 §12; catálogo T11 §12.3).

**Cubre:** EVT-MIG-09 `mig.person.merged`.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PT07 as T07 MIG
    participant BUS as Outbox y colas (T01, T11)
    participant PM01 as M01 PER
    U->>PT07: Acción que origina el hecho
    PT07->>BUS: EVT-MIG-09 mig.person.merged
    BUS->>PM01: consume EVT-MIG-09
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-MIG-09 `mig.person.merged` | M01 | No declarado en el §12 del consumidor |

## T08 — NFR No funcionales, seguridad y privacidad

### SEC-NFR-01 — NFR: hechos complementarios (Avisos de privacidad versionados, consent, Solicitudes de derechos, personData, Retenciones legales, Corridas…)

**Agregados:** `nfr.privacyNotice.*`, `nfr.consent.*`, `nfr.dataSubjectRequest.*`, `nfr.personData.*`, `nfr.legalHold.*`, `nfr.retentionRun.*`. **Productor:** T08 No funcionales, seguridad y privacidad (T08 §12; catálogo T11 §12.3).

**Cubre:** EVT-NFR-01 `nfr.privacyNotice.published`, EVT-NFR-02 `nfr.consent.granted`, EVT-NFR-03 `nfr.consent.revoked`, EVT-NFR-04 `nfr.dataSubjectRequest.received`, EVT-NFR-05 `nfr.dataSubjectRequest.completed`, EVT-NFR-06 `nfr.personData.erasureRequested`, EVT-NFR-07 `nfr.legalHold.activated`, EVT-NFR-08 `nfr.retentionRun.completed`.

**API y jobs disparadores (citados junto al evento en el anexo productor):** JOB-NFR-03.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PT08 as T08 NFR
    participant BUS as Outbox y colas (T01, T11)
    participant PM19 as M19 POR
    participant PT09 as T09 COM
    participant PM09 as M09 CRM
    participant PT10 as T10 BIA
    participant PT11 as T11 WFL
    participant PT02 as T02 IAM
    participant PM01 as M01 PER
    participant PT01 as T01 PLA
    participant PT04 as T04 CFG
    participant PT05 as T05 DAT
    participant PT07 as T07 MIG
    U->>PT08: Acción que origina el hecho
    PT08->>BUS: EVT-NFR-01 nfr.privacyNotice.published
    par M19
        BUS->>PM19: consume EVT-NFR-01
    and T09
        BUS->>PT09: consume EVT-NFR-01
    end
    U->>PT08: Acción que origina el hecho
    PT08->>BUS: EVT-NFR-02 nfr.consent.granted
    par M09
        BUS->>PM09: consume EVT-NFR-02
    and T09
        BUS->>PT09: consume EVT-NFR-02
    end
    U->>PT08: Acción que origina el hecho
    PT08->>BUS: EVT-NFR-03 nfr.consent.revoked
    par T09
        BUS->>PT09: consume EVT-NFR-03
    and T10
        BUS->>PT10: consume EVT-NFR-03
    end
    U->>PT08: Acción que origina el hecho
    PT08->>BUS: EVT-NFR-04 nfr.dataSubjectRequest.received
    par T09
        BUS->>PT09: consume EVT-NFR-04
    and T11
        BUS->>PT11: consume EVT-NFR-04
    end
    U->>PT08: Acción que origina el hecho
    PT08->>BUS: EVT-NFR-05 nfr.dataSubjectRequest.completed y 1 tipo más
    par M19
        BUS->>PM19: consume EVT-NFR-05
    and T02
        BUS->>PT02: consume EVT-NFR-05
    end
    U->>PT08: JOB-NFR-03
    PT08->>BUS: EVT-NFR-06 nfr.personData.erasureRequested
    par M01
        BUS->>PM01: consume EVT-NFR-06
    and M19
        BUS->>PM19: consume EVT-NFR-06
    and T01
        BUS->>PT01: consume EVT-NFR-06
    and T02
        BUS->>PT02: consume EVT-NFR-06
    and T04
        BUS->>PT04: consume EVT-NFR-06
    and T05
        BUS->>PT05: consume EVT-NFR-06
    and T07
        BUS->>PT07: consume EVT-NFR-06
    and T09
        BUS->>PT09: consume EVT-NFR-06
    and T10
        BUS->>PT10: consume EVT-NFR-06
    and T11
        BUS->>PT11: consume EVT-NFR-06
    end
    U->>PT08: Acción que origina el hecho
    PT08->>BUS: EVT-NFR-07 nfr.legalHold.activated y 1 tipo más
    par M01
        BUS->>PM01: consume EVT-NFR-07
    and M19
        BUS->>PM19: consume EVT-NFR-07
    and T02
        BUS->>PT02: consume EVT-NFR-07
    and T09
        BUS->>PT09: consume EVT-NFR-07
    and T10
        BUS->>PT10: consume EVT-NFR-07
    and T11
        BUS->>PT11: consume EVT-NFR-07
    end
    U->>PT08: Acción que origina el hecho
    PT08->>BUS: EVT-NFR-08 nfr.retentionRun.completed
    BUS->>PT02: consume EVT-NFR-08
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-NFR-01 `nfr.privacyNotice.published` | M19, T09 | No declarado en el §12 del consumidor |
| EVT-NFR-02 `nfr.consent.granted` | M09, T09 | No declarado en el §12 del consumidor |
| EVT-NFR-03 `nfr.consent.revoked` | T09, T10 | No declarado en el §12 del consumidor |
| EVT-NFR-04 `nfr.dataSubjectRequest.received` | T09, T11 | No declarado en el §12 del consumidor |
| EVT-NFR-05 `nfr.dataSubjectRequest.completed` | M19, T02 | No declarado en el §12 del consumidor |
| EVT-NFR-06 `nfr.personData.erasureRequested` | M01, M19, T01, T02, T04, T05, T07, T09, T10, T11 | No declarado en el §12 del consumidor |
| EVT-NFR-07 `nfr.legalHold.activated` | M01, M19, T02, T09, T10, T11 | No declarado en el §12 del consumidor |
| EVT-NFR-08 `nfr.retentionRun.completed` | T02 | No declarado en el §12 del consumidor |

### SEC-NFR-02 — NFR: hechos complementarios (Incidentes de seguridad y privacidad, (duplicada con `restoreTests`), alert, invariant, quota, Registro públi…)

**Agregados:** `nfr.securityIncident.*`, `nfr.restoreDrill.*`, `nfr.alert.*`, `nfr.invariant.*`, `nfr.quota.*`, `nfr.subprocessor.*`, `nfr.file.*`, `nfr.auditChain.*`. **Productor:** T08 No funcionales, seguridad y privacidad (T08 §12; catálogo T11 §12.3).

**Cubre:** EVT-NFR-09 `nfr.securityIncident.notified`, EVT-NFR-10 `nfr.restoreDrill.completed`, EVT-NFR-12 `nfr.alert.fired`, EVT-NFR-13 `nfr.invariant.violated`, EVT-NFR-14 `nfr.quota.exceeded`, EVT-NFR-15 `nfr.subprocessor.added`, EVT-NFR-16 `nfr.file.infected`, EVT-NFR-17 `nfr.auditChain.broken`.

**API y jobs disparadores (citados junto al evento en el anexo productor):** JOB-NFR-06, JOB-NFR-21, JOB-NFR-05.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PT08 as T08 NFR
    participant BUS as Outbox y colas (T01, T11)
    participant PT09 as T09 COM
    participant PT10 as T10 BIA
    participant PT01 as T01 PLA
    participant PT11 as T11 WFL
    U->>PT08: Acción que origina el hecho
    PT08->>BUS: EVT-NFR-09 nfr.securityIncident.notified
    BUS->>PT09: consume EVT-NFR-09
    U->>PT08: Acción que origina el hecho
    PT08->>BUS: EVT-NFR-10 nfr.restoreDrill.completed
    BUS->>PT10: consume EVT-NFR-10
    U->>PT08: Acción que origina el hecho
    PT08->>BUS: EVT-NFR-12 nfr.alert.fired y 1 tipo más
    par T01
        BUS->>PT01: consume EVT-NFR-12
    and T09
        BUS->>PT09: consume EVT-NFR-12
    end
    U->>PT08: JOB-NFR-06
    PT08->>BUS: EVT-NFR-13 nfr.invariant.violated
    BUS->>PT11: consume EVT-NFR-13
    U->>PT08: JOB-NFR-21
    PT08->>BUS: EVT-NFR-14 nfr.quota.exceeded
    BUS->>PT01: consume EVT-NFR-14
    U->>PT08: Acción que origina el hecho
    PT08->>BUS: EVT-NFR-15 nfr.subprocessor.added
    BUS->>PT09: consume EVT-NFR-15
    U->>PT08: Acción que origina el hecho
    PT08->>BUS: EVT-NFR-16 nfr.file.infected
    BUS->>PT11: consume EVT-NFR-16
    U->>PT08: JOB-NFR-05
    PT08->>BUS: EVT-NFR-17 nfr.auditChain.broken
    BUS->>PT09: consume EVT-NFR-17
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-NFR-09 `nfr.securityIncident.notified` | T09 | No declarado en el §12 del consumidor |
| EVT-NFR-10 `nfr.restoreDrill.completed` | T10 | No declarado en el §12 del consumidor |
| EVT-NFR-12 `nfr.alert.fired` | T01, T09 | No declarado en el §12 del consumidor |
| EVT-NFR-13 `nfr.invariant.violated` | T11 | No declarado en el §12 del consumidor |
| EVT-NFR-14 `nfr.quota.exceeded` | T01 | No declarado en el §12 del consumidor |
| EVT-NFR-15 `nfr.subprocessor.added` | T09 | No declarado en el §12 del consumidor |
| EVT-NFR-16 `nfr.file.infected` | T11 | No declarado en el §12 del consumidor |
| EVT-NFR-17 `nfr.auditChain.broken` | T09 | No declarado en el §12 del consumidor |

## T09 — COM Comunidad y comunicaciones

### SEC-COM-01 — COM: Publicaciones del muro y novedades

**Agregados:** `com.post.*`. **Productor:** T09 Comunidad y comunicaciones (T09 §12; catálogo T11 §12.3).

**Cubre:** EVT-COM-01 `com.post.published`, EVT-COM-02 `com.post.reviewRequested`, EVT-COM-04 `com.post.archived`.

**API y jobs disparadores (citados junto al evento en el anexo productor):** JOB-COM-01.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PT09 as T09 COM
    participant BUS as Outbox y colas (T01, T11)
    participant PM19 as M19 POR
    participant PT10 as T10 BIA
    participant PT11 as T11 WFL
    U->>PT09: JOB-COM-01
    PT09->>BUS: EVT-COM-01 com.post.published
    par M19
        BUS->>PM19: Invalidar caché de noticias de landing
    and T10
        BUS->>PT10: consume EVT-COM-01
    end
    U->>PT09: Acción que origina el hecho
    PT09->>BUS: EVT-COM-02 com.post.reviewRequested
    BUS->>PT11: consume EVT-COM-02
    U->>PT09: Acción que origina el hecho
    PT09->>BUS: EVT-COM-04 com.post.archived
    BUS->>PM19: consume EVT-COM-04
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-COM-01 `com.post.published` | M19, T10 | M19: Invalidar caché de noticias de landing |
| EVT-COM-02 `com.post.reviewRequested` | T11 | No declarado en el §12 del consumidor |
| EVT-COM-04 `com.post.archived` | M19 | No declarado en el §12 del consumidor |

### SEC-COM-02 — COM: Comentarios moderados

**Agregados:** `com.comment.*`. **Productor:** T09 Comunidad y comunicaciones (T09 §12; catálogo T11 §12.3).

**Cubre:** EVT-COM-05 `com.comment.created`, EVT-COM-07 `com.comment.moderated`, EVT-COM-37 `com.comment.derivedToCrm`.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PT09 as T09 COM
    participant BUS as Outbox y colas (T01, T11)
    participant PT10 as T10 BIA
    participant PM09 as M09 CRM
    U->>PT09: Acción que origina el hecho
    PT09->>BUS: EVT-COM-05 com.comment.created
    BUS->>PT10: consume EVT-COM-05
    U->>PT09: Acción que origina el hecho
    PT09->>BUS: EVT-COM-07 com.comment.moderated
    BUS->>PT10: consume EVT-COM-07
    U->>PT09: Acción que origina el hecho
    PT09->>BUS: EVT-COM-37 com.comment.derivedToCrm
    BUS->>PM09: consume EVT-COM-37
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-COM-05 `com.comment.created` | T10 | No declarado en el §12 del consumidor |
| EVT-COM-07 `com.comment.moderated` | T10 | No declarado en el §12 del consumidor |
| EVT-COM-37 `com.comment.derivedToCrm` | M09 | No declarado en el §12 del consumidor |

### SEC-COM-03 — COM: Encuestas y votaciones no vinculantes

**Agregados:** `com.survey.*`. **Productor:** T09 Comunidad y comunicaciones (T09 §12; catálogo T11 §12.3).

**Cubre:** EVT-COM-14 `com.survey.published`, EVT-COM-15 `com.survey.responseSubmitted`, EVT-COM-16 `com.survey.criticalAlertRaised`.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PT09 as T09 COM
    participant BUS as Outbox y colas (T01, T11)
    participant PM19 as M19 POR
    participant PT10 as T10 BIA
    participant PM09 as M09 CRM
    participant PM10 as M10 TEC
    U->>PT09: Acción que origina el hecho
    PT09->>BUS: EVT-COM-14 com.survey.published y 1 tipo más
    par M19
        BUS->>PM19: consume EVT-COM-14
    and T10
        BUS->>PT10: consume EVT-COM-14
    end
    U->>PT09: Acción que origina el hecho
    PT09->>BUS: EVT-COM-15 com.survey.responseSubmitted
    par M09
        BUS->>PM09: consume EVT-COM-15
    and M10
        BUS->>PM10: consume EVT-COM-15
    and T10
        BUS->>PT10: consume EVT-COM-15
    end
    U->>PT09: Acción que origina el hecho
    PT09->>BUS: EVT-COM-16 com.survey.criticalAlertRaised
    BUS->>PM09: consume EVT-COM-16
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-COM-14 `com.survey.published` | M19, T10 | No declarado en el §12 del consumidor |
| EVT-COM-15 `com.survey.responseSubmitted` | M09, M10, T10 | No declarado en el §12 del consumidor |
| EVT-COM-16 `com.survey.criticalAlertRaised` | M09 | No declarado en el §12 del consumidor |

### SEC-COM-04 — COM: Eventos de comunidad

**Agregados:** `com.event.*`. **Productor:** T09 Comunidad y comunicaciones (T09 §12; catálogo T11 §12.3).

**Cubre:** EVT-COM-17 `com.event.registrationChanged`, EVT-COM-18 `com.event.changed`, EVT-COM-19 `com.event.finished`.

**API y jobs disparadores (citados junto al evento en el anexo productor):** JOB-COM-09.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PT09 as T09 COM
    participant BUS as Outbox y colas (T01, T11)
    participant PT10 as T10 BIA
    participant PT11 as T11 WFL
    participant PM19 as M19 POR
    U->>PT09: Acción que origina el hecho
    PT09->>BUS: EVT-COM-17 com.event.registrationChanged
    par T10
        BUS->>PT10: consume EVT-COM-17
    and T11
        BUS->>PT11: consume EVT-COM-17
    end
    U->>PT09: Acción que origina el hecho
    PT09->>BUS: EVT-COM-18 com.event.changed y 1 tipo más
    par M19
        BUS->>PM19: consume EVT-COM-18
    and T11
        BUS->>PT11: consume EVT-COM-18
    end
    U->>PT09: JOB-COM-09
    PT09->>BUS: EVT-COM-19 com.event.finished
    BUS->>PT10: consume EVT-COM-19
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-COM-17 `com.event.registrationChanged` | T10, T11 | No declarado en el §12 del consumidor |
| EVT-COM-18 `com.event.changed` | M19, T11 | No declarado en el §12 del consumidor |
| EVT-COM-19 `com.event.finished` | T10 | No declarado en el §12 del consumidor |

### SEC-COM-05 — COM: outage

**Agregados:** `com.outage.*`. **Productor:** T09 Comunidad y comunicaciones (T09 §12; catálogo T11 §12.3).

**Cubre:** EVT-COM-22 `com.outage.published`, EVT-COM-23 `com.outage.started`, EVT-COM-24 `com.outage.rescheduled`, EVT-COM-25 `com.outage.restored`, EVT-COM-26 `com.outage.criticalAffected`.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PT09 as T09 COM
    participant BUS as Outbox y colas (T01, T11)
    participant PM09 as M09 CRM
    participant PM19 as M19 POR
    participant PT10 as T10 BIA
    participant PM01 as M01 PER
    participant PM08 as M08 MOR
    U->>PT09: Acción que origina el hecho
    PT09->>BUS: EVT-COM-22 com.outage.published
    par M09
        BUS->>PM09: consume EVT-COM-22
    and M19
        BUS->>PM19: consume EVT-COM-22
    and T10
        BUS->>PT10: consume EVT-COM-22
    end
    U->>PT09: Acción que origina el hecho
    PT09->>BUS: EVT-COM-23 com.outage.started
    par M09
        BUS->>PM09: consume EVT-COM-23
    and M19
        BUS->>PM19: consume EVT-COM-23
    end
    U->>PT09: Acción que origina el hecho
    PT09->>BUS: EVT-COM-24 com.outage.rescheduled y 1 tipo más
    par M09
        BUS->>PM09: consume EVT-COM-24
    and M19
        BUS->>PM19: consume EVT-COM-24
    end
    U->>PT09: Acción que origina el hecho
    PT09->>BUS: EVT-COM-25 com.outage.restored
    par M09
        BUS->>PM09: consume EVT-COM-25
    and M19
        BUS->>PM19: consume EVT-COM-25
    and T10
        BUS->>PT10: consume EVT-COM-25
    end
    U->>PT09: Acción que origina el hecho
    PT09->>BUS: EVT-COM-26 com.outage.criticalAffected
    par M01
        BUS->>PM01: consume EVT-COM-26
    and M08
        BUS->>PM08: consume EVT-COM-26
    and M09
        BUS->>PM09: consume EVT-COM-26
    end
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-COM-22 `com.outage.published` | M09, M19, T10 | No declarado en el §12 del consumidor |
| EVT-COM-23 `com.outage.started` | M09, M19 | No declarado en el §12 del consumidor |
| EVT-COM-24 `com.outage.rescheduled` | M09, M19 | No declarado en el §12 del consumidor |
| EVT-COM-25 `com.outage.restored` | M09, M19, T10 | No declarado en el §12 del consumidor |
| EVT-COM-26 `com.outage.criticalAffected` | M01, M08, M09 | No declarado en el §12 del consumidor |

### SEC-COM-06 — COM: Comunicación enviada a un destinatario

**Agregados:** `com.communication.*`. **Productor:** T09 Comunidad y comunicaciones (T09 §12; catálogo T11 §12.3).

**Cubre:** EVT-COM-27 `com.communication.accepted`, EVT-COM-28 `com.communication.milestoneReached`, EVT-COM-29 `com.communication.allChannelsFailed`.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PT09 as T09 COM
    participant BUS as Outbox y colas (T01, T11)
    participant PM01 as M01 PER
    participant PM05 as M05 FAC
    participant PM08 as M08 MOR
    participant PM09 as M09 CRM
    participant PT02 as T02 IAM
    participant PT10 as T10 BIA
    participant PT11 as T11 WFL
    U->>PT09: Acción que origina el hecho
    PT09->>BUS: EVT-COM-27 com.communication.accepted y 7 tipos más
    par M01
        BUS->>PM01: consume EVT-COM-27
    and M05
        BUS->>PM05: consume EVT-COM-27
    and M08
        BUS->>PM08: Actualiza entrega y evidencia de notificaciones el hito habilita el s…
    and M09
        BUS->>PM09: consume EVT-COM-27
    and T02
        BUS->>PT02: Actualiza auditMessages
    and T10
        BUS->>PT10: consume EVT-COM-27
    and T11
        BUS->>PT11: consume EVT-COM-27
    end
    U->>PT09: Acción que origina el hecho
    PT09->>BUS: EVT-COM-28 com.communication.milestoneReached
    par M08
        BUS->>PM08: Actualiza entrega y evidencia de notificaciones el hito habilita el s…
    and T11
        BUS->>PT11: consume EVT-COM-28
    end
    U->>PT09: Acción que origina el hecho
    PT09->>BUS: EVT-COM-29 com.communication.allChannelsFailed
    par M05
        BUS->>PM05: consume EVT-COM-29
    and M08
        BUS->>PM08: Actualiza entrega y evidencia de notificaciones el hito habilita el s…
    and M09
        BUS->>PM09: consume EVT-COM-29
    and T02
        BUS->>PT02: consume EVT-COM-29
    and T11
        BUS->>PT11: consume EVT-COM-29
    end
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-COM-27 `com.communication.accepted` | M01, M05, M08, M09, T02, T10, T11 | M08: Actualiza entrega y evidencia de notificaciones; el hito habilita el siguiente paso; el fallo total crea la tarea "canal alternativo".; T02: Actualiza `auditMessages` |
| EVT-COM-28 `com.communication.milestoneReached` | M08, T11 | M08: Actualiza entrega y evidencia de notificaciones; el hito habilita el siguiente paso; el fallo total crea la tarea "canal alternativo". |
| EVT-COM-29 `com.communication.allChannelsFailed` | M05, M08, M09, T02, T11 | M08: Actualiza entrega y evidencia de notificaciones; el hito habilita el siguiente paso; el fallo total crea la tarea "canal alternativo". |

### SEC-COM-07 — COM: hechos complementarios (Sanciones de comunidad, Boletines, Beneficios del club, consent, Preferencias de canal por persona, suppressi…)

**Agregados:** `com.sanction.*`, `com.newsletter.*`, `com.benefit.*`, `com.consent.*`, `com.preference.*`, `com.suppression.*`. **Productor:** T09 Comunidad y comunicaciones (T09 §12; catálogo T11 §12.3).

**Cubre:** EVT-COM-11 `com.sanction.applied`, EVT-COM-13 `com.newsletter.issued`, EVT-COM-20 `com.benefit.redemptionIssued`, EVT-COM-21 `com.benefit.redeemed`, EVT-COM-30 `com.consent.changed`, EVT-COM-31 `com.preference.changed`, EVT-COM-32 `com.suppression.added`.

**API y jobs disparadores (citados junto al evento en el anexo productor):** JOB-COM-04.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PT09 as T09 COM
    participant BUS as Outbox y colas (T01, T11)
    participant PT02 as T02 IAM
    participant PT10 as T10 BIA
    participant PM01 as M01 PER
    participant PM05 as M05 FAC
    participant PM19 as M19 POR
    U->>PT09: Acción que origina el hecho
    PT09->>BUS: EVT-COM-11 com.sanction.applied y 2 tipos más
    BUS->>PT02: consume EVT-COM-11
    U->>PT09: JOB-COM-04
    PT09->>BUS: EVT-COM-13 com.newsletter.issued
    BUS->>PT10: consume EVT-COM-13
    U->>PT09: Acción que origina el hecho
    PT09->>BUS: EVT-COM-20 com.benefit.redemptionIssued
    BUS->>PT10: consume EVT-COM-20
    U->>PT09: Acción que origina el hecho
    PT09->>BUS: EVT-COM-21 com.benefit.redeemed
    BUS->>PT10: consume EVT-COM-21
    U->>PT09: Acción que origina el hecho
    PT09->>BUS: EVT-COM-30 com.consent.changed
    par M01
        BUS->>PM01: consume EVT-COM-30
    and T10
        BUS->>PT10: consume EVT-COM-30
    end
    U->>PT09: Acción que origina el hecho
    PT09->>BUS: EVT-COM-31 com.preference.changed
    par M05
        BUS->>PM05: consume EVT-COM-31
    and M19
        BUS->>PM19: consume EVT-COM-31
    end
    U->>PT09: Acción que origina el hecho
    PT09->>BUS: EVT-COM-32 com.suppression.added y 1 tipo más
    BUS->>PM01: consume EVT-COM-32
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-COM-11 `com.sanction.applied` | T02 | No declarado en el §12 del consumidor |
| EVT-COM-13 `com.newsletter.issued` | T10 | No declarado en el §12 del consumidor |
| EVT-COM-20 `com.benefit.redemptionIssued` | T10 | No declarado en el §12 del consumidor |
| EVT-COM-21 `com.benefit.redeemed` | T10 | No declarado en el §12 del consumidor |
| EVT-COM-30 `com.consent.changed` | M01, T10 | No declarado en el §12 del consumidor |
| EVT-COM-31 `com.preference.changed` | M05, M19 | No declarado en el §12 del consumidor |
| EVT-COM-32 `com.suppression.added` | M01 | No declarado en el §12 del consumidor |

### SEC-COM-08 — COM: hechos complementarios (Campañas masivas, Plantillas de publicación, Consumo de mensajería por período, Avisos de plataforma a admini…)

**Agregados:** `com.campaign.*`, `com.template.*`, `com.messagingUsage.*`, `com.platformNotice.*`, `com.invoiceMessage.*`, `com.message.*`. **Productor:** T09 Comunidad y comunicaciones (T09 §12; catálogo T11 §12.3).

**Cubre:** EVT-COM-33 `com.campaign.statusChanged`, EVT-COM-34 `com.campaign.completed`, EVT-COM-35 `com.template.published`, EVT-COM-36 `com.messagingUsage.thresholdReached`, EVT-COM-38 `com.platformNotice.published`, EVT-COM-39 `com.invoiceMessage.activated`, EVT-COM-40 `com.message.dispatchRequested`.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PT09 as T09 COM
    participant BUS as Outbox y colas (T01, T11)
    participant PT10 as T10 BIA
    participant PT11 as T11 WFL
    participant PT02 as T02 IAM
    participant PT01 as T01 PLA
    participant PM05 as M05 FAC
    participant PT06 as T06 INT
    U->>PT09: Acción que origina el hecho
    PT09->>BUS: EVT-COM-33 com.campaign.statusChanged
    par T10
        BUS->>PT10: consume EVT-COM-33
    and T11
        BUS->>PT11: consume EVT-COM-33
    end
    U->>PT09: Acción que origina el hecho
    PT09->>BUS: EVT-COM-34 com.campaign.completed
    BUS->>PT10: consume EVT-COM-34
    U->>PT09: Acción que origina el hecho
    PT09->>BUS: EVT-COM-35 com.template.published
    BUS->>PT02: consume EVT-COM-35
    U->>PT09: Acción que origina el hecho
    PT09->>BUS: EVT-COM-36 com.messagingUsage.thresholdReached
    BUS->>PT01: consume EVT-COM-36
    U->>PT09: Acción que origina el hecho
    PT09->>BUS: EVT-COM-38 com.platformNotice.published
    par T10
        BUS->>PT10: consume EVT-COM-38
    and T11
        BUS->>PT11: consume EVT-COM-38
    end
    U->>PT09: Acción que origina el hecho
    PT09->>BUS: EVT-COM-39 com.invoiceMessage.activated y 1 tipo más
    BUS->>PM05: consume EVT-COM-39
    U->>PT09: Acción que origina el hecho
    PT09->>BUS: EVT-COM-40 com.message.dispatchRequested
    BUS->>PT06: consume EVT-COM-40
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-COM-33 `com.campaign.statusChanged` | T10, T11 | No declarado en el §12 del consumidor |
| EVT-COM-34 `com.campaign.completed` | T10 | No declarado en el §12 del consumidor |
| EVT-COM-35 `com.template.published` | T02 | No declarado en el §12 del consumidor |
| EVT-COM-36 `com.messagingUsage.thresholdReached` | T01 | No declarado en el §12 del consumidor |
| EVT-COM-38 `com.platformNotice.published` | T10, T11 | No declarado en el §12 del consumidor |
| EVT-COM-39 `com.invoiceMessage.activated` | M05 | No declarado en el §12 del consumidor |
| EVT-COM-40 `com.message.dispatchRequested` | T06 | No declarado en el §12 del consumidor |

## T10 — BIA Reportes, BI y APIs

### SEC-BIA-01 — BIA: hechos complementarios (Generador de reportes del tenant, Ejecuciones, Archivos exportados, Programaciones)

**Agregados:** `bia.report.*`, `bia.reportRun.*`, `bia.export.*`, `bia.schedule.*`. **Productor:** T10 Reportes, BI y APIs (T10 §12; catálogo T11 §12.3).

**Cubre:** EVT-BIA-01 `bia.report.published`, EVT-BIA-02 `bia.report.deprecated`, EVT-BIA-03 `bia.reportRun.completed`, EVT-BIA-04 `bia.reportRun.failed`, EVT-BIA-05 `bia.export.ready`, EVT-BIA-06 `bia.export.downloaded`, EVT-BIA-07 `bia.schedule.suspended`.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PT10 as T10 BIA
    participant BUS as Outbox y colas (T01, T11)
    participant PT02 as T02 IAM
    participant PT09 as T09 COM
    participant PT01 as T01 PLA
    U->>PT10: Acción que origina el hecho
    PT10->>BUS: EVT-BIA-01 bia.report.published
    BUS->>PT02: consume EVT-BIA-01
    U->>PT10: Acción que origina el hecho
    PT10->>BUS: EVT-BIA-02 bia.report.deprecated
    BUS->>PT09: consume EVT-BIA-02
    U->>PT10: Acción que origina el hecho
    PT10->>BUS: EVT-BIA-03 bia.reportRun.completed
    BUS->>PT09: consume EVT-BIA-03
    U->>PT10: Acción que origina el hecho
    PT10->>BUS: EVT-BIA-04 bia.reportRun.failed
    par T01
        BUS->>PT01: consume EVT-BIA-04
    and T09
        BUS->>PT09: consume EVT-BIA-04
    end
    U->>PT10: Acción que origina el hecho
    PT10->>BUS: EVT-BIA-05 bia.export.ready
    BUS->>PT09: consume EVT-BIA-05
    U->>PT10: Acción que origina el hecho
    PT10->>BUS: EVT-BIA-06 bia.export.downloaded
    BUS->>PT02: consume EVT-BIA-06
    U->>PT10: Acción que origina el hecho
    PT10->>BUS: EVT-BIA-07 bia.schedule.suspended
    BUS->>PT09: consume EVT-BIA-07
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-BIA-01 `bia.report.published` | T02 | No declarado en el §12 del consumidor |
| EVT-BIA-02 `bia.report.deprecated` | T09 | No declarado en el §12 del consumidor |
| EVT-BIA-03 `bia.reportRun.completed` | T09 | No declarado en el §12 del consumidor |
| EVT-BIA-04 `bia.reportRun.failed` | T01, T09 | No declarado en el §12 del consumidor |
| EVT-BIA-05 `bia.export.ready` | T09 | No declarado en el §12 del consumidor |
| EVT-BIA-06 `bia.export.downloaded` | T02 | No declarado en el §12 del consumidor |
| EVT-BIA-07 `bia.schedule.suspended` | T09 | No declarado en el §12 del consumidor |

### SEC-BIA-02 — BIA: hechos complementarios (Alertas disparadas, (duplicada con T02), Suscripciones de webhooks salientes, Datasets certificados, reconcil…)

**Agregados:** `bia.kpiAlert.*`, `bia.apiClient.*`, `bia.webhookSubscription.*`, `bia.dataset.*`, `bia.reconciliation.*`, `bia.customReport.*`, `bia.bulkExport.*`. **Productor:** T10 Reportes, BI y APIs (T10 §12; catálogo T11 §12.3).

**Cubre:** EVT-BIA-09 `bia.kpiAlert.opened`, EVT-BIA-10 `bia.kpiAlert.resolved`, EVT-BIA-11 `bia.apiClient.activated`, EVT-BIA-12 `bia.webhookSubscription.disabled`, EVT-BIA-13 `bia.dataset.freshnessBreached`, EVT-BIA-14 `bia.reconciliation.mismatch`, EVT-BIA-15 `bia.customReport.submitted`, EVT-BIA-16 `bia.bulkExport.ready`.

**API y jobs disparadores (citados junto al evento en el anexo productor):** JOB-BIA-11, JOB-BIA-12.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PT10 as T10 BIA
    participant BUS as Outbox y colas (T01, T11)
    participant PT09 as T09 COM
    participant PT02 as T02 IAM
    participant PT01 as T01 PLA
    participant PT11 as T11 WFL
    U->>PT10: Acción que origina el hecho
    PT10->>BUS: EVT-BIA-09 bia.kpiAlert.opened
    BUS->>PT09: consume EVT-BIA-09
    U->>PT10: Acción que origina el hecho
    PT10->>BUS: EVT-BIA-10 bia.kpiAlert.resolved
    BUS->>PT09: consume EVT-BIA-10
    U->>PT10: Acción que origina el hecho
    PT10->>BUS: EVT-BIA-11 bia.apiClient.activated y 2 tipos más
    BUS->>PT02: consume EVT-BIA-11
    U->>PT10: Acción que origina el hecho
    PT10->>BUS: EVT-BIA-12 bia.webhookSubscription.disabled
    BUS->>PT09: consume EVT-BIA-12
    U->>PT10: Acción que origina el hecho
    PT10->>BUS: EVT-BIA-13 bia.dataset.freshnessBreached
    BUS->>PT01: consume EVT-BIA-13
    U->>PT10: JOB-BIA-11, JOB-BIA-12
    PT10->>BUS: EVT-BIA-14 bia.reconciliation.mismatch
    BUS->>PT01: consume EVT-BIA-14
    U->>PT10: Acción que origina el hecho
    PT10->>BUS: EVT-BIA-15 bia.customReport.submitted y 1 tipo más
    BUS->>PT11: consume EVT-BIA-15
    U->>PT10: Acción que origina el hecho
    PT10->>BUS: EVT-BIA-16 bia.bulkExport.ready
    BUS->>PT01: consume EVT-BIA-16
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-BIA-09 `bia.kpiAlert.opened` | T09 | No declarado en el §12 del consumidor |
| EVT-BIA-10 `bia.kpiAlert.resolved` | T09 | No declarado en el §12 del consumidor |
| EVT-BIA-11 `bia.apiClient.activated` | T02 | No declarado en el §12 del consumidor |
| EVT-BIA-12 `bia.webhookSubscription.disabled` | T09 | No declarado en el §12 del consumidor |
| EVT-BIA-13 `bia.dataset.freshnessBreached` | T01 | No declarado en el §12 del consumidor |
| EVT-BIA-14 `bia.reconciliation.mismatch` | T01 | No declarado en el §12 del consumidor |
| EVT-BIA-15 `bia.customReport.submitted` | T11 | No declarado en el §12 del consumidor |
| EVT-BIA-16 `bia.bulkExport.ready` | T01 | No declarado en el §12 del consumidor |

### SEC-BIA-03 — BIA: hechos complementarios (openData, exitExport)

**Agregados:** `bia.openData.*`, `bia.exitExport.*`. **Productor:** T10 Reportes, BI y APIs (T10 §12; catálogo T11 §12.3).

**Cubre:** EVT-BIA-17 `bia.openData.published`, EVT-BIA-18 `bia.exitExport.delivered`.

**API y jobs disparadores (citados junto al evento en el anexo productor):** JOB-BIA-21.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario, API o job
    participant PT10 as T10 BIA
    participant BUS as Outbox y colas (T01, T11)
    participant PM19 as M19 POR
    participant PT01 as T01 PLA
    U->>PT10: Acción que origina el hecho
    PT10->>BUS: EVT-BIA-17 bia.openData.published y 1 tipo más
    BUS->>PM19: consume EVT-BIA-17
    U->>PT10: JOB-BIA-21
    PT10->>BUS: EVT-BIA-18 bia.exitExport.delivered
    BUS->>PT01: consume EVT-BIA-18
```

| Evento | Consumidores externos (T11 §12.3) | Efecto declarado por el consumidor (§12 de su anexo) |
|---|---|---|
| EVT-BIA-17 `bia.openData.published` | M19 | No declarado en el §12 del consumidor |
| EVT-BIA-18 `bia.exitExport.delivered` | T01 | No declarado en el §12 del consumidor |

## Cobertura de la parte V

| Evento | Productor | Secuencia | También en |
|---|---|---|---|
| EVT-INT-01 | T06 | SEC-INT-01 | — |
| EVT-INT-02 | T06 | SEC-INT-01 | — |
| EVT-INT-03 | T06 | SEC-INT-01 | — |
| EVT-INT-04 | T06 | SEC-INT-01 | — |
| EVT-INT-05 | T06 | SEC-INT-01 | — |
| EVT-INT-06 | T06 | SEC-INT-01 | — |
| EVT-INT-07 | T06 | SEC-INT-01 | — |
| EVT-INT-08 | T06 | SEC-INT-01 | A2 (`06-secuencias-y-estados.md`) |
| EVT-INT-09 | T06 | SEC-INT-02 | — |
| EVT-INT-10 | T06 | SEC-INT-02 | — |
| EVT-INT-11 | T06 | SEC-INT-02 | — |
| EVT-INT-12 | T06 | SEC-INT-02 | — |
| EVT-INT-13 | T06 | SEC-INT-02 | — |
| EVT-INT-14 | T06 | SEC-INT-02 | — |
| EVT-INT-15 | T06 | SEC-INT-02 | A4 (`06-secuencias-y-estados.md`) |
| EVT-INT-16 | T06 | SEC-INT-02 | — |
| EVT-INT-17 | T06 | SEC-INT-03 | — |
| EVT-INT-18 | T06 | SEC-INT-03 | — |
| EVT-INT-19 | T06 | SEC-INT-03 | — |
| EVT-INT-20 | T06 | SEC-INT-03 | — |
| EVT-INT-21 | T06 | SEC-INT-03 | — |
| EVT-INT-22 | T06 | SEC-INT-03 | — |
| EVT-INT-23 | T06 | SEC-INT-03 | — |
| EVT-INT-24 | T06 | SEC-INT-03 | — |
| EVT-MIG-01 | T07 | SEC-MIG-01 | A9 (`06-secuencias-y-estados.md`) |
| EVT-MIG-02 | T07 | SEC-MIG-01 | A9 (`06-secuencias-y-estados.md`) |
| EVT-MIG-03 | T07 | SEC-MIG-01 | — |
| EVT-MIG-04 | T07 | SEC-MIG-01 | A9 (`06-secuencias-y-estados.md`) |
| EVT-MIG-05 | T07 | SEC-MIG-01 | — |
| EVT-MIG-06 | T07 | SEC-MIG-01 | — |
| EVT-MIG-07 | T07 | SEC-MIG-01 | — |
| EVT-MIG-08 | T07 | SEC-MIG-01 | — |
| EVT-MIG-09 | T07 | SEC-MIG-02 | — |
| EVT-NFR-01 | T08 | SEC-NFR-01 | — |
| EVT-NFR-02 | T08 | SEC-NFR-01 | — |
| EVT-NFR-03 | T08 | SEC-NFR-01 | — |
| EVT-NFR-04 | T08 | SEC-NFR-01 | — |
| EVT-NFR-05 | T08 | SEC-NFR-01 | — |
| EVT-NFR-06 | T08 | SEC-NFR-01 | — |
| EVT-NFR-07 | T08 | SEC-NFR-01 | — |
| EVT-NFR-08 | T08 | SEC-NFR-01 | — |
| EVT-NFR-09 | T08 | SEC-NFR-02 | — |
| EVT-NFR-10 | T08 | SEC-NFR-02 | — |
| EVT-NFR-12 | T08 | SEC-NFR-02 | — |
| EVT-NFR-13 | T08 | SEC-NFR-02 | — |
| EVT-NFR-14 | T08 | SEC-NFR-02 | — |
| EVT-NFR-15 | T08 | SEC-NFR-02 | — |
| EVT-NFR-16 | T08 | SEC-NFR-02 | — |
| EVT-NFR-17 | T08 | SEC-NFR-02 | — |
| EVT-COM-01 | T09 | SEC-COM-01 | — |
| EVT-COM-02 | T09 | SEC-COM-01 | — |
| EVT-COM-04 | T09 | SEC-COM-01 | — |
| EVT-COM-05 | T09 | SEC-COM-02 | — |
| EVT-COM-07 | T09 | SEC-COM-02 | — |
| EVT-COM-37 | T09 | SEC-COM-02 | — |
| EVT-COM-14 | T09 | SEC-COM-03 | — |
| EVT-COM-15 | T09 | SEC-COM-03 | — |
| EVT-COM-16 | T09 | SEC-COM-03 | — |
| EVT-COM-17 | T09 | SEC-COM-04 | — |
| EVT-COM-18 | T09 | SEC-COM-04 | — |
| EVT-COM-19 | T09 | SEC-COM-04 | — |
| EVT-COM-22 | T09 | SEC-COM-05 | — |
| EVT-COM-23 | T09 | SEC-COM-05 | — |
| EVT-COM-24 | T09 | SEC-COM-05 | — |
| EVT-COM-25 | T09 | SEC-COM-05 | — |
| EVT-COM-26 | T09 | SEC-COM-05 | — |
| EVT-COM-27 | T09 | SEC-COM-06 | — |
| EVT-COM-28 | T09 | SEC-COM-06 | — |
| EVT-COM-29 | T09 | SEC-COM-06 | — |
| EVT-COM-11 | T09 | SEC-COM-07 | — |
| EVT-COM-13 | T09 | SEC-COM-07 | — |
| EVT-COM-20 | T09 | SEC-COM-07 | — |
| EVT-COM-21 | T09 | SEC-COM-07 | — |
| EVT-COM-30 | T09 | SEC-COM-07 | — |
| EVT-COM-31 | T09 | SEC-COM-07 | — |
| EVT-COM-32 | T09 | SEC-COM-07 | — |
| EVT-COM-33 | T09 | SEC-COM-08 | — |
| EVT-COM-34 | T09 | SEC-COM-08 | — |
| EVT-COM-35 | T09 | SEC-COM-08 | — |
| EVT-COM-36 | T09 | SEC-COM-08 | — |
| EVT-COM-38 | T09 | SEC-COM-08 | — |
| EVT-COM-39 | T09 | SEC-COM-08 | — |
| EVT-COM-40 | T09 | SEC-COM-08 | — |
| EVT-BIA-01 | T10 | SEC-BIA-01 | — |
| EVT-BIA-02 | T10 | SEC-BIA-01 | — |
| EVT-BIA-03 | T10 | SEC-BIA-01 | — |
| EVT-BIA-04 | T10 | SEC-BIA-01 | — |
| EVT-BIA-05 | T10 | SEC-BIA-01 | — |
| EVT-BIA-06 | T10 | SEC-BIA-01 | — |
| EVT-BIA-07 | T10 | SEC-BIA-01 | — |
| EVT-BIA-09 | T10 | SEC-BIA-02 | — |
| EVT-BIA-10 | T10 | SEC-BIA-02 | — |
| EVT-BIA-11 | T10 | SEC-BIA-02 | — |
| EVT-BIA-12 | T10 | SEC-BIA-02 | — |
| EVT-BIA-13 | T10 | SEC-BIA-02 | — |
| EVT-BIA-14 | T10 | SEC-BIA-02 | — |
| EVT-BIA-15 | T10 | SEC-BIA-02 | — |
| EVT-BIA-16 | T10 | SEC-BIA-02 | — |
| EVT-BIA-17 | T10 | SEC-BIA-03 | — |
| EVT-BIA-18 | T10 | SEC-BIA-03 | — |
