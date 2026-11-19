# GoodApps Cooperativas

## Procesos de negocio — Workflow, eventos y documentos (T11)

**Entregable de Análisis y Diseño Detallado — Artefacto 2.1 (Procesos de negocio BPMN). Parte de [`04-procesos-bpmn.md`](04-procesos-bpmn.md).**

| Dato | Valor |
|---|---|
| Documento | Diagramas BPMN, pasos, situación actual en ProCoop y excepciones de los procesos P-WFL-01 a P-WFL-15 |
| Carácter | Derivado de la especificación vigente; no la reemplaza. Ante diferencias prevalecen la maestra `00`, los anexos, T05, T11 y el registro de decisiones `01` |
| Generación | Script `_trabajo/generar_bpmn.py` (extrae pasos, eventos, jobs y RF/RN de los anexos) más datos revisados a mano en `_trabajo/bpmn_datos_*.py` |
| Versión | 1.1 (regenerada contra la especificación corregida) |
| Fecha | 05-11-2026 |

**Cómo leer cada proceso.** La notación es la de [`04-procesos-bpmn.md` §3](04-procesos-bpmn.md#3-notación-equivalencia-mermaid--bpmn) (carriles, eventos de inicio y fin, tareas de usuario y de servicio, compuertas XOR y AND, eventos de dominio como banderas, temporizadores y jobs como estadios). La tabla de pasos reproduce la actividad del anexo; en la columna RF/RN, los identificadores sin prefijo son los que el anexo cita en el paso y los marcados "asoc." son reglas o requisitos del mismo anexo que comparten parámetro, permiso, evento o tema con el paso (asociación generada por el script y revisada). Los eventos se nombran con su ID del catálogo de T11 §12.

## Índice de procesos de esta parte

1. [P-WFL-01 Publicación y consumo de eventos](#1-p-wfl-01-publicación-y-consumo-de-eventos)
2. [P-WFL-02 Programación de jobs por tenant](#2-p-wfl-02-programación-de-jobs-por-tenant)
3. [P-WFL-03 Corrida masiva con excepciones (BASE §69, CU-LOT-01)](#3-p-wfl-03-corrida-masiva-con-excepciones-base-69-cu-lot-01)
4. [P-WFL-04 Operación sensible (MER-012)](#4-p-wfl-04-operación-sensible-mer-012)
5. [P-WFL-05 Aprobación multinivel por monto con firma conjunta](#5-p-wfl-05-aprobación-multinivel-por-monto-con-firma-conjunta)
6. [P-WFL-06 Trámite configurable iniciado por el socio](#6-p-wfl-06-trámite-configurable-iniciado-por-el-socio)
7. [P-WFL-07 Tarea ad hoc recurrente (BASE §26)](#7-p-wfl-07-tarea-ad-hoc-recurrente-base-26)
8. [P-WFL-08 Documento generado por plantilla](#8-p-wfl-08-documento-generado-por-plantilla)
9. [P-WFL-09 Firma electrónica de recibos de sueldo (FIC 15, DFA M20)](#9-p-wfl-09-firma-electrónica-de-recibos-de-sueldo-fic-15-dfa-m20)
10. [P-WFL-10 Conformidad de instalación en campo (BASE §73, DFA M14)](#10-p-wfl-10-conformidad-de-instalación-en-campo-base-73-dfa-m14)
11. [P-WFL-11 Retención y purga](#11-p-wfl-11-retención-y-purga)
12. [P-WFL-12 Expediente: consulta y exportación](#12-p-wfl-12-expediente-consulta-y-exportación)
13. [P-WFL-13 Mesa de entradas coordinada (MER-016, DFA M21)](#13-p-wfl-13-mesa-de-entradas-coordinada-mer-016-dfa-m21)
14. [P-WFL-14 Proyección de la bandeja](#14-p-wfl-14-proyección-de-la-bandeja)
15. [P-WFL-15 Reasignación por baja o licencia](#15-p-wfl-15-reasignación-por-baja-o-licencia)

---

## 1. P-WFL-01 Publicación y consumo de eventos

| Campo | Contenido |
|---|---|
| Fuente | T11 §9.1, `T11-WFL-workflow-eventos-documentos.md` (línea 1863) |
| Macroproceso | MP-08 Orquestación, workflow y documentos |
| Disparador | Cambio de negocio |
| Resultado | No se encola; Termina sin efecto; Evento consumido; Queda en deadLetters para soporte técnico |
| Carriles | Módulo productor; Plataforma T01 (outbox y relay); Módulo consumidor; Workflow T11; Responsable de la bandeja operativa |
| Roles de T02 | Solo actores del sistema (sin rol humano) |
| Módulos involucrados | T01 Plataforma, T11 Workflow, eventos y documentos |
| Eventos (T11 §12) | EVT-PLA-14 `pla.restore.requested`; EVT-WFL-046 `wfl.operationalInbox.itemOpened` |
| Jobs | JOB-PLA-01 `pla:outbox-relay` |
| Relación con 04-procesos-bpmn.md | — |

```mermaid
flowchart LR
  subgraph L_PRO["Módulo productor"]
    ni(("Inicio: Cambio de negocio"))
    nt1[["Abre la transacción, aplica el cambio y publica el evento"]]
  end
  subgraph L_PLA["Plataforma T01 (outbox y relay)"]
    nt2[["Valida el tipo contra eventTypes e inserta en outboxEvents"]]
    nt3[["El relay JOB-PLA-01 encola un job por suscripción activa"]]
    ng0{"¿Módulo consumidor activo en el tenant?"}
    nf0(("Fin: No se encola"))
    nt7[["El evento pasa a deadLetters"]]
    nf3(("Fin: Queda en deadLetters para soporte técnico"))
  end
  subgraph L_CON["Módulo consumidor"]
    ng1{"¿Suscripción perAggregate con versión adelantada?"}
    nt4[["Reencola con espera (RF-WFL-009)"]]
    ng2{"¿inboxReceipt ya existe?"}
    nf1(("Fin: Termina sin efecto"))
    nt5[["Aplica el efecto e inserta inboxReceipts en la misma transacción"]]
    ng3{"¿Error?"}
    nf2(("Fin: Evento consumido"))
    nt6[["Reintenta con backoff PRM-PLA-027"]]
    ng4{"¿Reintentos agotados?"}
  end
  subgraph L_WFL["Workflow T11"]
    ng5{"¿Tipo con businessImpact?"}
    nt8[["Crea o actualiza el ítem de la bandeja operativa con dedupeKey y responsable"]]
    ne1>"EVT-WFL-046 wfl.operationalInbox.itemOpened"]
    nt10[["Reencola con la misma clave y marca resolved al confirmar"]]
  end
  subgraph L_USR["Responsable de la bandeja operativa"]
    nt9["Corrige la causa y reprocesa en PAN-WFL-22"]
  end
  ni --> nt1
  nt1 --> nt2
  nt2 --> nt3
  nt3 --> ng0
  ng0 -->|"No"| nf0
  ng0 -->|"Sí"| ng1
  ng1 -->|"Sí"| nt4
  nt4 --> ng1
  ng1 -->|"No"| ng2
  ng2 -->|"Sí"| nf1
  ng2 -->|"No"| nt5
  nt5 --> ng3
  ng3 -->|"No"| nf2
  ng3 -->|"Sí"| nt6
  nt6 --> ng4
  ng4 -->|"No"| ng1
  ng4 -->|"Sí"| nt7
  nt7 --> ng5
  ng5 -->|"No"| nf3
  ng5 -->|"Sí"| nt8
  nt8 --> ne1
  ne1 --> nt9
  nt9 --> nt10
  nt10 --> ng1
  classDef inicio fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
  classDef fin fill:#ffebee,stroke:#c62828,stroke-width:4px
  classDef evento fill:#fff8e1,stroke:#f9a825
  classDef temporizador fill:#e3f2fd,stroke:#1565c0
  class ni inicio
  class nf0,nf1,nf2,nf3 fin
  class ne1 evento
```

**Pasos del proceso** (actividad tomada del anexo; la columna RF/RN distingue lo citado en el paso de lo asociado por parámetro, permiso, evento o tema compartido).

| Paso | Carril | Actividad | RF/RN que aplican | EVT / JOB / PAN |
|---|---|---|---|---|
| 1 | Módulo productor | El servicio del módulo productor abre la transacción, aplica el cambio y llama a `publish(event, { session })`. T01 valida el tipo contra `eventTypes` (RF-WFL-002/003) e inserta en `outboxEvents`. | RF-WFL-002; asoc.: RF-WFL-004 | — |
| 2 | Plataforma T01 | El relay de T01 (JOB-PLA-01) encola un job en la cola del consumidor por cada suscripción activa (`eventSubscriptions`) con `jobId = <eventId>:<consumer>`. No encola si el módulo consumidor no está activo en el tenant. | asoc.: RF-WFL-007 | JOB-PLA-01 |
| 3 | Módulo consumidor | El handler corre con el contexto del evento. Si la suscripción es `perAggregate`, verifica que `aggregateVersion` sea la siguiente esperada; si es mayor, reencola con espera (RF-WFL-009). | RF-WFL-009; asoc.: RF-WFL-002 | — |
| 4 | Módulo consumidor | Aplica el efecto e inserta `inboxReceipts` en la misma transacción. Si ya existía, termina sin efecto. | asoc.: RF-WFL-008 | — |
| 5 | Workflow T11 | Ante un error, reintenta con backoff (PRM-PLA-027). Agotados los reintentos, el evento va a `deadLetters` (T01). Si el tipo tiene `businessImpact`, T11 crea u actualiza `operationalInboxItems` con `dedupeKey = <type>:<consumer>:<aggregateId>` y responsable (RN-WFL-004). | RN-WFL-004; asoc.: RF-WFL-010 | — |
| 6 | Responsable de la bandeja operativa | Desde la bandeja operativa (PAN-WFL-22), el usuario corrige la causa y reprocesa. T11 reencola por la API de T01 con la misma clave y marca `resolved` cuando el consumidor confirma. | asoc.: RF-WFL-011, RF-WFL-009 | PAN-WFL-22 |

**Situación actual en ProCoop (nota de cambio).** Las tareas en segundo plano de ProCoop corren en un servicio de Windows, temporizadores y colas de Azure para ARCA; pasan a jobs BullMQ con outbox (CTR-WFL-08, DEC-006). La propiedad del outbox se reparte entre T01 (mecánica) y T11 (contrato) (CTR-WFL-01).

**Excepciones**

| Excepción | Tratamiento |
|---|---|
| Caída del relay | Los eventos `pending` se entregan al volver (sondeo de respaldo). |
| Restauración del tenant (EVT-PLA-14) | Los consumidores con `restoreHooks` reconcilian. |
| Evento ya entregado | No se vuelve a entregar salvo replay explícito. |
| Entrega duplicada | El `inboxReceipt` hace que termine sin efecto. |

---

## 2. P-WFL-02 Programación de jobs por tenant

| Campo | Contenido |
|---|---|
| Fuente | T11 §9.2, `T11-WFL-workflow-eventos-documentos.md` (línea 1874) |
| Macroproceso | MP-08 Orquestación, workflow y documentos |
| Disparador | Despliegue de una versión; Activación o desactivación de un módulo en el tenant; Necesidad de cambiar una programación |
| Resultado | Job encolado; Reprogramación rechazada; Programación vigente |
| Carriles | Plataforma T01; Workflow T11; Administrador del tenant (T-ADM) |
| Roles de T02 | T-ADM Administrador de la cooperativa |
| Módulos involucrados | T01 Plataforma, T11 Workflow, eventos y documentos |
| Eventos (T11 §12) | EVT-PLA-06 `pla.capability.activated`; EVT-PLA-07 `pla.capability.deactivated`; EVT-WFL-047 `wfl.jobSchedule.changed` |
| Jobs | — |
| Relación con 04-procesos-bpmn.md | — |

```mermaid
flowchart LR
  subgraph L_PLA["Plataforma T01"]
    ni(("Inicio: Despliegue de una versión"))
    ni2(("Inicio: Activación o desactivación de un módulo en el tenant"))
    ne1>"EVT-PLA-06 o EVT-PLA-07"]
    nj1(["Scheduler líder de T01: nextRunAt vencido"])
    ng2{"¿Dentro de ventana, calendario y tenant activo?"}
    nt4[["Aplica skipIfMissed o difiere a la próxima apertura (RN-WFL-007)"]]
    nt5[["Encola con jobKey por job, tenant y fecha local; recalcula nextRunAt"]]
    nf1(("Fin: Job encolado"))
  end
  subgraph L_WFL["Workflow T11"]
    nt1[["Sincroniza jobDefinitions desde los manifiestos"]]
    ng1{"¿Activación?"}
    nt2[["Crea jobSchedules con cron por defecto y zona horaria del tenant"]]
    nt3[["Pasa los jobSchedules a disabled"]]
    ng3{"¿Cron, ventana y permiso wfl.jobs.programar válidos?"}
    ne2>"EVT-WFL-047 wfl.jobSchedule.changed"]
    nf3(("Fin: Programación vigente"))
  end
  subgraph L_ADM["Administrador del tenant (T-ADM)"]
    ni3(("Inicio: Necesidad de cambiar una programación"))
    nt6["Reprograma en PAN-WFL-21"]
    nf2(("Fin: Reprogramación rechazada"))
  end
  ni --> nt1
  nt1 --> nf3
  ni2 --> ne1
  ne1 --> ng1
  ng1 -->|"Sí"| nt2
  nt2 --> nj1
  ng1 -->|"No"| nt3
  nt3 --> nf3
  nj1 --> ng2
  ng2 -->|"Sí"| nt5
  nt5 --> nf1
  ng2 -->|"No"| nt4
  nt4 --> nf1
  ni3 --> nt6
  nt6 --> ng3
  ng3 -->|"No"| nf2
  ng3 -->|"Sí"| ne2
  ne2 --> nf3
  classDef inicio fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
  classDef fin fill:#ffebee,stroke:#c62828,stroke-width:4px
  classDef evento fill:#fff8e1,stroke:#f9a825
  classDef temporizador fill:#e3f2fd,stroke:#1565c0
  class ni,ni2,ni3 inicio
  class nf1,nf2,nf3 fin
  class ne1,ne2 evento
  class nj1 temporizador
```

**Pasos del proceso** (actividad tomada del anexo; la columna RF/RN distingue lo citado en el paso de lo asociado por parámetro, permiso, evento o tema compartido).

| Paso | Carril | Actividad | RF/RN que aplican | EVT / JOB / PAN |
|---|---|---|---|---|
| 1 | Workflow T11 | Al desplegar, `jobDefinitions` se sincroniza desde los manifiestos. | asoc.: RF-WFL-020 | — |
| 2 | Workflow T11 | Al activar un módulo en un tenant (EVT-PLA-06), T11 crea `jobSchedules` con `defaultCron`, `timezone` del tenant y `status = active`. Al desactivarlo (EVT-PLA-07), pasan a `disabled`. | asoc.: RF-WFL-022 | EVT-PLA-06, EVT-PLA-07 |
| 3 | Plataforma T01 | El scheduler líder de T01 lee `jobSchedules` con `nextRunAt <= now`, verifica la ventana, el calendario y el estado del tenant, encola el job con `jobKey = <job>:<tenantId>:<fechaLocal>` y recalcula `nextRunAt` en la zona del tenant. | asoc.: RF-WFL-022 | — |
| 4 | Plataforma T01 | Si el disparo quedó fuera de ventana (caída, mantenimiento), aplica `skipIfMissed` o difiere a la próxima apertura (RN-WFL-007). | RN-WFL-007 | — |
| 5 | Administrador del tenant | Reprogramar (PAN-WFL-21) valida el cron, la ventana y el permiso `wfl.jobs.programar`, audita el cambio y emite EVT-WFL-047. | asoc.: RF-WFL-023 | PAN-WFL-21, EVT-WFL-047 |

**Situación actual en ProCoop (nota de cambio).** ProCoop programa tareas con un servicio de Windows y temporizadores; GoodApps usa `jobSchedules` por tenant y zona horaria sobre BullMQ (CTR-WFL-08).

**Excepciones**

| Excepción | Tratamiento |
|---|---|
| Disparo perdido por caída o mantenimiento | Se aplica `skipIfMissed` o se difiere a la próxima apertura de ventana (RN-WFL-007). |
| Doble disparo del mismo job y día | La `jobKey` por job, tenant y fecha local lo evita. |
| Cambio de programación | Se audita y emite EVT-WFL-047. |

---

## 3. P-WFL-03 Corrida masiva con excepciones (BASE §69, CU-LOT-01)

| Campo | Contenido |
|---|---|
| Fuente | T11 §9.3, `T11-WFL-workflow-eventos-documentos.md` (línea 1882) |
| Macroproceso | MP-08 Orquestación, workflow y documentos |
| Disparador | Necesidad de un proceso masivo |
| Resultado | Corrida no ejecutada; Corrida cerrada |
| Carriles | Módulo dueño de la corrida; Corridas masivas T11; Aprobadores; Responsables de excepciones (T-FAC, T-ATE u otros) |
| Roles de T02 | T-ATE Comercial / Atención al socio, T-FAC Facturación |
| Módulos involucrados | M06 Fiscal, T06 Integraciones, T11 Workflow, eventos y documentos |
| Eventos (T11 §12) | EVT-WFL-048 `wfl.bulkRun.completed`; EVT-FIS-21 `fis.authorization.globalFailure`; EVT-INT-04 `int.circuit.opened` |
| Jobs | — |
| Relación con 04-procesos-bpmn.md | P3 Facturación periódica y emisión fiscal ([§7](04-procesos-bpmn.md#7-p3--facturación-periódica-y-emisión-fiscal)) |

```mermaid
flowchart LR
  subgraph L_MOD["Módulo dueño de la corrida"]
    ni(("Inicio: Necesidad de un proceso masivo"))
    nt1[["Crea bulkRuns en draft con criterio y fuente"]]
    nf0(("Fin: Corrida no ejecutada"))
    nf1(("Fin: Corrida cerrada"))
    nt9[["Crea una corrida reprocess solo con las excepciones"]]
  end
  subgraph L_WFL["Corridas masivas T11"]
    nt2[["preparing: congela el universo y calcula el total"]]
    ng1{"¿El tipo exige aprobación?"}
    nt4[["running: bloques de PRM-WFL-010 ítems, cada uno en su transacción idempotente"]]
    ng3{"¿Cancelación o pausa pedida, umbral de fallo o evento sistémico?"}
    nt5[["paused con motivo y aviso al responsable"]]
    nt6[["Registra excepciones en bulkRunItems y crea workItems por motivo y responsable"]]
    ng4{"¿Quedan ítems?"}
    nt8[["succeeded o succeededWithExceptions; archivo de resultado"]]
    ne1>"EVT-WFL-048 wfl.bulkRun.completed"]
  end
  subgraph L_APR["Aprobadores"]
    nt3["Aprueba la operación (P-WFL-04)"]
    ng2{"¿Aprobada?"}
  end
  subgraph L_RSP["Responsables de excepciones (T-FAC, T-ATE u otros)"]
    nt7["Resuelve las excepciones"]
  end
  ni --> nt1
  nt1 --> nt2
  nt2 --> ng1
  ng1 -->|"Sí"| nt3
  nt3 --> ng2
  ng2 -->|"No"| nf0
  ng2 -->|"Sí"| nt4
  ng1 -->|"No"| nt4
  nt4 --> ng3
  ng3 -->|"Sí"| nt5
  nt5 -.->|"reanudar"| nt4
  ng3 -->|"No"| nt6
  nt6 --> ng4
  ng4 -->|"Sí"| nt4
  ng4 -->|"No"| nt8
  nt8 --> ne1
  ne1 --> nf1
  ne1 -.->|"con excepciones"| nt7
  nt7 --> nt9
  nt9 --> nt2
  classDef inicio fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
  classDef fin fill:#ffebee,stroke:#c62828,stroke-width:4px
  classDef evento fill:#fff8e1,stroke:#f9a825
  classDef temporizador fill:#e3f2fd,stroke:#1565c0
  class ni inicio
  class nf0,nf1 fin
  class ne1 evento
```

**Pasos del proceso** (actividad tomada del anexo; la columna RF/RN distingue lo citado en el paso de lo asociado por parámetro, permiso, evento o tema compartido).

| Paso | Carril | Actividad | RF/RN que aplican | EVT / JOB / PAN |
|---|---|---|---|---|
| 1 | Módulo dueño de la corrida | El módulo dueño crea `bulkRuns` en `draft` con criterio y fuente. | asoc.: RF-WFL-026 | — |
| 2 | Corridas masivas T11 | `preparing`: el job congela el universo (lista de ids y versión) y calcula `total`. | — | — |
| 3 | Aprobadores | Si el tipo exige aprobación (por ejemplo, `fac.billingRun.approveEmission`), se crea la operación y se espera `approved`. | — | — |
| 4 | Corridas masivas T11 | `running`: procesa en bloques de PRM-WFL-010 ítems. Cada ítem va en su transacción con idempotencia `<run>:<item>`; actualiza el progreso cada bloque y revisa `cancelRequested` y `pauseRequested`. | — | — |
| 5 | Corridas masivas T11 | Las excepciones se registran en `bulkRunItems` con `reasonCode`, `ownerModule` y `ownerRole`, y crean `workItems` agrupados por motivo y responsable. | asoc.: RF-WFL-130, RF-WFL-012 | — |
| 6 | Corridas masivas T11 | Umbral de fallo global (RN-WFL-011) o evento sistémico (`fis.authorization.globalFailure`, `int.circuit.opened`): `paused` con motivo; aviso al responsable. | RN-WFL-011; asoc.: RF-WFL-027 | EVT-FIS-21, EVT-INT-04 |
| 7 | Corridas masivas T11 | Fin: `succeeded` o `succeededWithExceptions`; archivo de resultado; EVT-WFL-048. | — | EVT-WFL-048 |
| 8 | Módulo dueño de la corrida | Reproceso: tras resolver las excepciones, se crea una corrida `reprocess` solo con ellas. Los ya procesados no se tocan. | asoc.: RF-WFL-028 | — |

**Situación actual en ProCoop (nota de cambio).** ProCoop no tiene motor de workflow (análisis de brechas §3.18).

**Excepciones**

| Excepción | Tratamiento |
|---|---|
| Umbral de fallo global (RN-WFL-011) | La corrida pasa a `paused` con motivo. |
| Evento sistémico (`fis.authorization.globalFailure`, `int.circuit.opened`) | Pausa automática y aviso al responsable. |
| Reproceso | Solo incluye las excepciones resueltas; los ítems ya procesados no se tocan (ejemplo CU-LOT-01: LOT-2026-00012 con 2 fallas reprocesadas en LOT-2026-00013). |

---

## 4. P-WFL-04 Operación sensible (MER-012)

| Campo | Contenido |
|---|---|
| Fuente | T11 §9.4, `T11-WFL-workflow-eventos-documentos.md` (línea 1895) |
| Macroproceso | MP-08 Orquestación, workflow y documentos |
| Disparador | Inicia una acción sensible, por ejemplo anular un recibo |
| Resultado | Operación rechazada; la entidad no cambió; Operación fallida en la bandeja operativa; Acción aplicada |
| Carriles | Usuario solicitante (por ejemplo T-CAJ); Módulo dueño; Workflow T11; Comunicaciones T09; Aprobadores (por ejemplo T-TES) |
| Roles de T02 | T-CAJ Cajero, T-TES Tesorero / Financiero (MT-006) |
| Módulos involucrados | M07 Cuenta corriente y cobranza, T09 Comunicaciones, T11 Workflow, eventos y documentos |
| Eventos (T11 §12) | EVT-WFL-001 `wfl.operation.submitted`; EVT-WFL-007 `wfl.approval.requested`; EVT-WFL-004 `wfl.operation.completed`; EVT-WFL-002 `wfl.operation.rejected`; EVT-COB-05 `cob.receipt.voided` |
| Jobs | JOB-WFL-01 `wfl:ejecutar-operacion`; JOB-WFL-02 `wfl:reparar-operaciones`; JOB-WFL-03 `wfl:conciliar-inciertas` |
| Relación con 04-procesos-bpmn.md | P4 Cobranza: caja, pasarelas, débito, rendición y depósito ([§8](04-procesos-bpmn.md#8-p4--cobranza-caja-pasarelas-débito-rendición-y-depósito)); P7 Compras y pago a proveedores ([§11](04-procesos-bpmn.md#11-p7--compras-y-pago-a-proveedores)) |

```mermaid
flowchart LR
  subgraph L_USR["Usuario solicitante (por ejemplo T-CAJ)"]
    ni(("Inicio: Inicia una acción sensible, por ejemplo anular un recibo"))
    nt1["Ingresa motivo y evidencia según el tipo"]
    nf0(("Fin: Operación rechazada; la entidad no cambió"))
    nf1(("Fin: Acción aplicada"))
  end
  subgraph L_MOD["Módulo dueño"]
    nt2[["Pide la operación dentro de su transacción y marca la entidad con operación pendiente"]]
    nt6[["Revalida y aplica (RN-WFL-024) paso a paso en operationSteps"]]
    ng2{"¿Resultado?"}
  end
  subgraph L_WFL["Workflow T11"]
    nt3[["Calcula contentHash, resuelve la política y crea operación y aprobación"]]
    ne1>"EVT-WFL-001 wfl.operation.submitted"]
    ne2>"EVT-WFL-007 wfl.approval.requested"]
    ne3>"EVT-WFL-002 wfl.operation.rejected"]
    nj1[["JOB-WFL-01 wfl:ejecutar-operacion llama al handler del módulo con operationId"]]
    nj2[["JOB-WFL-02 wfl:reparar-operaciones reintenta desde el último paso confirmado"]]
    ng3{"¿Recuperable?"}
    nt7[["failed y bandeja operativa"]]
    nf2(("Fin: Operación fallida en la bandeja operativa"))
    nt8[["uncertain: efecto externo sin confirmar"]]
    nj3[["JOB-WFL-03 wfl:conciliar-inciertas consulta el estado externo"]]
    ng4{"¿Confirmado antes de PRM-WFL-012?"}
    ne4>"EVT-WFL-004 wfl.operation.completed"]
    nt10[["Registra en el expediente y avisa al solicitante"]]
  end
  subgraph L_COM["Comunicaciones T09"]
    nt4[["Avisa a los aprobadores"]]
  end
  subgraph L_APR["Aprobadores (por ejemplo T-TES)"]
    nt5["Decide; se verifican authorize, SoD, límite, MFA y huella (RN-WFL-040 a 043)"]
    ng1{"¿Aprobada?"}
    nt9["Resolución manual con evidencia"]
  end
  ni --> nt1
  nt1 --> nt2
  nt2 --> nt3
  nt3 --> ne1
  ne1 --> ne2
  ne2 --> nt4
  nt4 --> nt5
  nt5 --> ng1
  ng1 -->|"No"| ne3
  ne3 --> nf0
  ng1 -->|"Sí"| nj1
  nj1 --> nt6
  nt6 --> ng2
  ng2 -->|"Completa"| ne4
  ng2 -->|"Falla"| nj2
  nj2 --> ng3
  ng3 -->|"Sí"| nt6
  ng3 -->|"No"| nt7
  nt7 --> nf2
  ng2 -->|"Sin confirmar"| nt8
  nt8 --> nj3
  nj3 --> ng4
  ng4 -->|"Sí"| ne4
  ng4 -->|"No"| nt9
  nt9 --> ne4
  ne4 --> nt10
  nt10 --> nf1
  classDef inicio fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
  classDef fin fill:#ffebee,stroke:#c62828,stroke-width:4px
  classDef evento fill:#fff8e1,stroke:#f9a825
  classDef temporizador fill:#e3f2fd,stroke:#1565c0
  class ni inicio
  class nf0,nf2,nf1 fin
  class ne1,ne2,ne3,ne4 evento
```

**Pasos del proceso** (actividad tomada del anexo; la columna RF/RN distingue lo citado en el paso de lo asociado por parámetro, permiso, evento o tema compartido).

| Paso | Carril | Actividad | RF/RN que aplican | EVT / JOB / PAN |
|---|---|---|---|---|
| 1 | Usuario solicitante | El usuario inicia la acción en la pantalla del módulo (por ejemplo, "Anular recibo"). La pantalla pide motivo y evidencia según el tipo. | — | — |
| 2 | Módulo dueño | El módulo llama a `wfl.operations.request` dentro de su transacción. T11 calcula `contentHash`, resuelve la política (regla según importe y riesgo), crea `operations` y `approvalRequests` y emite EVT-WFL-001 y EVT-WFL-007. El módulo marca la entidad como "con operación pendiente" (lectura) sin cambiar su estado de negocio. | — | EVT-WFL-001, EVT-WFL-007 |
| 3 | Aprobadores | Los aprobadores reciben `workItems` y aviso (T09). Cada decisión verifica `authorize()`, SoD, límite, MFA y huella (RN-WFL-040 a 043). | RN-WFL-040; asoc.: RF-WFL-130, RF-WFL-012 | — |
| 4 | Workflow T11 | Con `approved`, se encola `wfl:ejecutar-operacion` en la cola declarada por el tipo. El worker llama al handler del módulo con `operationId` como clave; el handler revalida y aplica (RN-WFL-024). | RN-WFL-024; asoc.: RF-WFL-043, RN-WFL-021 | JOB-WFL-01 |
| 5 | Workflow T11 | Si son varios pasos, cada uno se registra en `operationSteps` y se confirma de a uno. Ante una falla, `wfl:reparar-operaciones` reintenta desde el último confirmado; si no se puede, `failed` y bandeja operativa. | asoc.: RF-WFL-044 | JOB-WFL-02 |
| 6 | Workflow T11 | Con un efecto externo sin confirmar, el estado es `uncertain` y `wfl:conciliar-inciertas` consulta. Vencido PRM-WFL-012, la resolución es manual con evidencia. | asoc.: RF-WFL-046, RN-WFL-022 | JOB-WFL-03 |
| 7 | Workflow T11 | Al completar se emite EVT-WFL-004, se registra en el expediente del sujeto y se avisa al solicitante. | — | EVT-WFL-004 |

**Situación actual en ProCoop (nota de cambio).** En ProCoop el supervisor autoriza con su usuario y clave en la terminal del solicitante y la autoaprobación es posible (CTR-WFL-10). Ejemplo CU-29: la anulación de un recibo de ARS 18.450,00 exige un paso de T-TES distinto del cajero.

**Excepciones**

| Excepción | Tratamiento |
|---|---|
| La entidad cambió entre el pedido y la ejecución | El handler revalida (RN-WFL-024) y la huella `contentHash` invalida aprobaciones sobre otro contenido. |
| Autoaprobación | Prohibida (RN-WFL-040). |
| Efecto externo sin confirmar | Estado `uncertain`; vencido PRM-WFL-012, resolución manual con evidencia. |

---

## 5. P-WFL-05 Aprobación multinivel por monto con firma conjunta

| Campo | Contenido |
|---|---|
| Fuente | T11 §9.5, `T11-WFL-workflow-eventos-documentos.md` (línea 1907) |
| Macroproceso | MP-08 Orquestación, workflow y documentos |
| Disparador | OP de ARS 3.200.000 lista para aprobar |
| Resultado | OP rechazada o vencida; OP pagada |
| Carriles | Compras M12; Workflow T11; Responsable de compras (T-CMP); Gerencia (T-GER); Firmantes vigentes de M14; Tesorería M14; Firma digital T06 |
| Roles de T02 | T-CMP Compras, T-GER Gerente |
| Módulos involucrados | M12 Compras, M14 Tesorería, T06 Integraciones, T11 Workflow, eventos y documentos |
| Eventos (T11 §12) | EVT-WFL-010 `wfl.approval.decided`; EVT-CMP-11 `cmp.paymentOrder.approved` |
| Jobs | — |
| Relación con 04-procesos-bpmn.md | P7 Compras y pago a proveedores ([§11](04-procesos-bpmn.md#11-p7--compras-y-pago-a-proveedores)) |

```mermaid
flowchart LR
  subgraph L_CMP["Compras M12"]
    ni(("Inicio: OP de ARS 3.200.000 lista para aprobar"))
    nt1[["Envía a aprobación con cmp.paymentOrder.approve"]]
    nf0(("Fin: OP rechazada o vencida"))
    nt7[["La OP pasa a approved"]]
    ne2>"EVT-CMP-11 cmp.paymentOrder.approved"]
  end
  subgraph L_WFL["Workflow T11"]
    nt2[["Resuelve la política POL-CMP-OP y crea los pasos según el monto"]]
    ng2{"¿Monto mayor a ARS 500.000?"}
    ng3{"¿Monto mayor a ARS 2.000.000?"}
    nt5[["Paso 3 en paralelo entre firmantes vigentes a la fecha (RN-WFL-050), sin quien registró el CBU"]]
    ng4{"¿Quórum alcanzado?"}
    ne1>"EVT-WFL-010 wfl.approval.decided"]
  end
  subgraph L_RCO["Responsable de compras (T-CMP)"]
    nt3["Paso 1: aprueba el responsable de compras"]
  end
  subgraph L_GER["Gerencia (T-GER)"]
    nt4["Paso 2: aprueba gerencia"]
  end
  subgraph L_FIR["Firmantes vigentes de M14"]
    nt6["Firman 2 de 3"]
  end
  subgraph L_TES["Tesorería M14"]
    nt8[["Ejecuta el pago (P-TES-05)"]]
    nf1(("Fin: OP pagada"))
  end
  subgraph L_INT["Firma digital T06"]
    nt9[["Firma digital si el perfil lo exige"]]
  end
  ni --> nt1
  nt1 --> nt2
  nt2 --> nt3
  nt3 --> ng2
  ng2 -->|"No"| ne1
  ng2 -->|"Sí"| nt4
  nt4 --> ng3
  ng3 -->|"No"| ne1
  ng3 -->|"Sí"| nt5
  nt5 --> nt6
  nt6 --> ng4
  ng4 -->|"Sí"| ne1
  ng4 -->|"No"| nf0
  ne1 --> nt7
  nt7 --> ne2
  ne2 --> nt8
  nt8 --> nt9
  nt9 --> nf1
  classDef inicio fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
  classDef fin fill:#ffebee,stroke:#c62828,stroke-width:4px
  classDef evento fill:#fff8e1,stroke:#f9a825
  classDef temporizador fill:#e3f2fd,stroke:#1565c0
  class ni inicio
  class nf0,nf1 fin
  class ne1,ne2 evento
```

**Pasos del proceso** (actividad tomada del anexo; la columna RF/RN distingue lo citado en el paso de lo asociado por parámetro, permiso, evento o tema compartido).

| Paso | Carril | Actividad | RF/RN que aplican | EVT / JOB / PAN |
|---|---|---|---|---|
| 1 | Compras M12 | M12 envía la OP `OP-2026-000210` de ARS 3.200.000 a aprobación con `cmp.paymentOrder.approve`. | — | — |
| 2 | Workflow T11 | La política `POL-CMP-OP` tiene estas reglas: - hasta ARS 500.000: responsable de compras; - de ARS 500.000 a 2.000.000: responsable de compras y luego gerencia; - más de ARS 2.000.000: responsable de compras, luego gerencia y luego firma conjunta de 2 de 3 firmantes vigentes de M14. | — | — |
| 3 | Workflow T11 | T11 crea 3 pasos. Activa el paso 1; al aprobarse, el paso 2; al aprobarse, el paso 3 en paralelo con quórum 2 entre los firmantes vigentes a la fecha (RN-WFL-050). | RN-WFL-050 | — |
| 4 | Workflow T11 | Si el tesorero que registró el CBU es firmante, la SoD de T02 (`cmp.proveedores.datosBancarios.editar` ≠ quien paga) lo excluye. | — | — |
| 5 | Compras M12 | Con quórum, `wfl.approval.decided` (`approved`). M12 pasa la OP a `approved` y publica `cmp.paymentOrder.approved`. M14 ejecuta y, si el perfil lo exige, firma digital por T06. | — | EVT-WFL-010, EVT-CMP-11 |

**Situación actual en ProCoop (nota de cambio).** La autorización de ProCoop es puntual y en la misma terminal (CTR-WFL-10); los circuitos multipaso, por monto y con comité son de T11 (RF-IAM-096).

**Excepciones**

| Excepción | Tratamiento |
|---|---|
| Tesorero que registró el CBU del proveedor es firmante | La SoD de T02 lo excluye del paso de firma. |
| Firmante sin vigencia a la fecha | No cuenta para el quórum (RN-WFL-050). |
| Rechazo en cualquier paso | La OP no se aprueba. |

---

## 6. P-WFL-06 Trámite configurable iniciado por el socio

| Campo | Contenido |
|---|---|
| Fuente | T11 §9.6, `T11-WFL-workflow-eventos-documentos.md` (línea 1918) |
| Macroproceso | MP-08 Orquestación, workflow y documentos |
| Disparador | Elige Solicitud de tarifa social en Mis trámites |
| Resultado | Trámite rechazado con aviso; Tarifa social vigente; Beneficio vencido |
| Carriles | Socio (C-SOC); Workflow T11; Atención M09; Atención Comercial (T-ATE); Supervisor comercial (T-SAT); Tarifas M04 |
| Roles de T02 | C-SOC Socio titular, T-ATE Comercial / Atención al socio, T-SAT Supervisor de atención |
| Módulos involucrados | M04 Tarifas, M09 Atención, T11 Workflow, eventos y documentos |
| Eventos (T11 §12) | EVT-WFL-014 `wfl.instance.started`; EVT-WFL-019 `wfl.form.submitted`; EVT-TAR-014 `tar.enrollment.changed`; EVT-WFL-016 `wfl.instance.completed` |
| Jobs | — |
| Relación con 04-procesos-bpmn.md | — |

```mermaid
flowchart LR
  subgraph L_SOC["Socio (C-SOC)"]
    ni(("Inicio: Elige Solicitud de tarifa social en Mis trámites"))
    nt1["Completa el formulario precargado y adjunta constancia de ingresos y declaración jurada"]
    nt6["Adjunta lo faltante"]
    nf1(("Fin: Tarifa social vigente"))
  end
  subgraph L_WFL["Workflow T11"]
    nt2[["Guarda el formulario inmutable con número TRM y constancia PDF"]]
    ne1>"EVT-WFL-014 wfl.instance.started"]
    ne2>"EVT-WFL-019 wfl.form.submitted"]
    ntm(["SLA: aviso al 75 por ciento y escalamiento al 100"])
    ng1{"¿Documentación completa?"}
    nt5[["waitingRequester: pausa el SLA y avisa al socio"]]
    nf0(("Fin: Trámite rechazado con aviso"))
    ne4>"EVT-WFL-016 wfl.instance.completed"]
    ntm2(["Aviso 30 días antes del vencimiento"])
    nf2(("Fin: Beneficio vencido"))
  end
  subgraph L_CRM["Atención M09"]
    nt3[["Crea o vincula el caso"]]
  end
  subgraph L_ATE["Atención Comercial (T-ATE)"]
    nt4["Verifica la documentación con SLA de 3 días hábiles"]
  end
  subgraph L_SAT["Supervisor comercial (T-SAT)"]
    nt7["Aprueba el supervisor comercial"]
    ng2{"¿Aprobada?"}
  end
  subgraph L_TAR["Tarifas M04"]
    nt8[["Acción tipada tar.enrollment.create con vigencia de 12 meses"]]
    ne3>"EVT-TAR-014 tar.enrollment.changed"]
    nt9[["Al vencer ejecuta tar.enrollment.end una sola vez (RN-WFL-035)"]]
  end
  ni --> nt1
  nt1 --> nt2
  nt2 --> ne1
  ne1 --> ne2
  ne2 --> nt3
  nt3 --> nt4
  nt4 --> ng1
  nt4 -.->|"SLA"| ntm
  ntm --> nt4
  ng1 -->|"No"| nt5
  nt5 --> nt6
  nt6 --> nt4
  ng1 -->|"Sí"| nt7
  nt7 --> ng2
  ng2 -->|"No"| nf0
  ng2 -->|"Sí"| nt8
  nt8 --> ne3
  ne3 --> ne4
  ne4 --> nf1
  ne4 -.-> ntm2
  ntm2 --> nt9
  nt9 --> nf2
  classDef inicio fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
  classDef fin fill:#ffebee,stroke:#c62828,stroke-width:4px
  classDef evento fill:#fff8e1,stroke:#f9a825
  classDef temporizador fill:#e3f2fd,stroke:#1565c0
  class ni inicio
  class nf0,nf1,nf2 fin
  class ne1,ne2,ne3,ne4 evento
  class ntm,ntm2 temporizador
```

**Pasos del proceso** (actividad tomada del anexo; la columna RF/RN distingue lo citado en el paso de lo asociado por parámetro, permiso, evento o tema compartido).

| Paso | Carril | Actividad | RF/RN que aplican | EVT / JOB / PAN |
|---|---|---|---|---|
| 1 | Socio | El socio elige en "Mis trámites" la opción "Solicitud de tarifa social" (`WF-TAR-TARIFA-SOCIAL`). El formulario precarga los datos validados (RN-WFL-036) y pide la constancia de ingresos (tipo documental `DOC-INC-CONST`) y la declaración jurada. | RN-WFL-036 | — |
| 2 | Workflow T11 | Envío: `formSubmissions` inmutable, número `TRM-2026-000318` y constancia PDF (plantilla `TPL-CRM-02`). Se emite EVT-WFL-014 y EVT-WFL-019. M09 crea o vincula el caso, según la definición. | asoc.: RF-WFL-095 | EVT-WFL-014, EVT-WFL-019 |
| 3 | Atención Comercial | Nodo "Verificar documentación", asignado al área "Atención Comercial". El SLA es de 3 días hábiles. Al 75 % se avisa al responsable; al 100 % se escala al supervisor. | — | — |
| 4 | Socio | Si falta documentación, la instancia pasa a `waitingRequester` (pausa el SLA) y el socio recibe el aviso. Al adjuntar, se reanuda. | asoc.: RF-WFL-078 | — |
| 5 | Supervisor comercial | Nodo de aprobación del supervisor comercial. | — | — |
| 6 | Tarifas M04 | Acción tipada `tar.enrollment.create` (M04) con vigencia y vencimiento a 12 meses. Se espera el evento `tar.enrollment.changed`. | asoc.: RF-WFL-073 | EVT-TAR-014 |
| 7 | Workflow T11 | Fin `completed`. Al vencer el trámite, la acción `tar.enrollment.end` se ejecuta una sola vez (RN-WFL-035) y se avisa 30 días antes. | RN-WFL-035; asoc.: RF-WFL-075 | — |

**Situación actual en ProCoop (nota de cambio).** En ProCoop los trámites ejecutan scripts SQL configurables por tipo (`TRAMITES_ACCIONES`), que se eliminan (RN-MIG-048, análisis de brechas §3.18); GoodApps usa acciones tipadas del `actionCatalog` que llaman a la API del módulo dueño (CTR-WFL-09).

**Excepciones**

| Excepción | Tratamiento |
|---|---|
| Falta documentación | La instancia pasa a `waitingRequester` y el SLA se pausa hasta que el socio adjunta. |
| SLA vencido | Al 100 % se escala al supervisor. |
| Vencimiento del beneficio | La acción de fin se ejecuta una sola vez (RN-WFL-035). |

---

## 7. P-WFL-07 Tarea ad hoc recurrente (BASE §26)

| Campo | Contenido |
|---|---|
| Fuente | T11 §9.7, `T11-WFL-workflow-eventos-documentos.md` (línea 1928) |
| Macroproceso | MP-08 Orquestación, workflow y documentos |
| Disparador | Necesidad de un control periódico |
| Resultado | Ocurrencia cerrada |
| Carriles | Supervisor del área; Workflow T11; Área Atención Comercial (T-ATE) |
| Roles de T02 | T-ATE Comercial / Atención al socio |
| Módulos involucrados | T11 Workflow, eventos y documentos |
| Eventos (T11 §12) | EVT-WFL-023 `wfl.task.created`; EVT-WFL-026 `wfl.task.overdue`; EVT-WFL-025 `wfl.task.completed` |
| Jobs | JOB-WFL-10 `wfl:generar-tareas-recurrentes`; JOB-WFL-09 `wfl:recordatorios-tareas` |
| Relación con 04-procesos-bpmn.md | — |

```mermaid
flowchart LR
  subgraph L_SUP["Supervisor del área"]
    ni(("Inicio: Necesidad de un control periódico"))
    nt1["Crea la tarea recurrente mensual con área y evidencia obligatoria"]
  end
  subgraph L_WFL["Workflow T11"]
    nj1(["JOB-WFL-10 wfl:generar-tareas-recurrentes crea la ocurrencia el día anterior"])
    ne1>"EVT-WFL-023 wfl.task.created"]
    nj2(["JOB-WFL-09 wfl:recordatorios-tareas recordatorio el día de vencimiento"])
    ng1{"¿Vencida sin completar?"}
    ne2>"EVT-WFL-026 wfl.task.overdue"]
    nt3[["Aparece en Vencidos y escala según SLA"]]
    ng2{"¿Adjunto presente?"}
    nt4[["Cierre clasificado en término o fuera de término"]]
    ne3>"EVT-WFL-025 wfl.task.completed"]
  end
  subgraph L_ARE["Área Atención Comercial (T-ATE)"]
    nt2["Realiza el control y adjunta el Informe de control"]
    nf1(("Fin: Ocurrencia cerrada"))
  end
  ni --> nt1
  nt1 --> nj1
  nj1 --> ne1
  ne1 --> nj2
  nj2 --> ng1
  ng1 -->|"Sí"| ne2
  ne2 --> nt3
  nt3 --> nt2
  ng1 -->|"No"| nt2
  nt2 --> ng2
  ng2 -->|"No"| nt2
  ng2 -->|"Sí"| nt4
  nt4 --> ne3
  ne3 --> nf1
  ne3 -.->|"siguiente mes"| nj1
  classDef inicio fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
  classDef fin fill:#ffebee,stroke:#c62828,stroke-width:4px
  classDef evento fill:#fff8e1,stroke:#f9a825
  classDef temporizador fill:#e3f2fd,stroke:#1565c0
  class ni inicio
  class nf1 fin
  class ne1,ne2,ne3 evento
  class nj1,nj2 temporizador
```

**Pasos del proceso** (actividad tomada del anexo; la columna RF/RN distingue lo citado en el paso de lo asociado por parámetro, permiso, evento o tema compartido).

| Paso | Carril | Actividad | RF/RN que aplican | EVT / JOB / PAN |
|---|---|---|---|---|
| 1 | Supervisor del área | El supervisor crea TAR-001 "Revisar padrón de tarifa social": - recurrencia `FREQ=MONTHLY;BYMONTHDAY=5`, en la zona del tenant; - asignada al área "Atención Comercial"; - evidencia obligatoria: un documento de tipo "Informe de control". | asoc.: RF-WFL-138 | — |
| 2 | Workflow T11 | `wfl:generar-tareas-recurrentes` crea cada ocurrencia el día anterior (`recurrence.seriesId` + `occurrenceDate`, única). | — | JOB-WFL-10 |
| 3 | Workflow T11 | Recordatorio el día de vencimiento (`wfl:recordatorios-tareas`). Si vence, aparece en "Vencidos" y escala según SLA. | — | JOB-WFL-09 |
| 4 | Área Atención Comercial | Completar exige el adjunto. El cierre se clasifica "en término" o "fuera de término". | — | — |

**Situación actual en ProCoop (nota de cambio).** ProCoop tiene actividades sin escalamiento y errores conocidos en su calendario (CTR-WFL-16); se corrigen y se migran con la corrección. El correo interno `PROMAIL` se reemplaza por comentarios y menciones (CTR-WFL-18).

**Excepciones**

| Excepción | Tratamiento |
|---|---|
| Ocurrencia duplicada | Es única por `recurrence.seriesId` y `occurrenceDate`. |
| Completar sin el adjunto | No se admite. |

---

## 8. P-WFL-08 Documento generado por plantilla

| Campo | Contenido |
|---|---|
| Fuente | T11 §9.8, `T11-WFL-workflow-eventos-documentos.md` (línea 1938) |
| Macroproceso | MP-08 Orquestación, workflow y documentos |
| Disparador | Documento a emitir |
| Resultado | Devuelve el mismo documento; Render rechazado; Documento accepted e inmutable |
| Carriles | Módulo dueño del documento; Plantillas y documentos T11; Archivos T01 |
| Roles de T02 | Solo actores del sistema (sin rol humano) |
| Módulos involucrados | T01 Plataforma, T11 Workflow, eventos y documentos |
| Eventos (T11 §12) | EVT-WFL-038 `wfl.render.failed`; EVT-WFL-037 `wfl.render.completed` |
| Jobs | JOB-WFL-11 `wfl:renderizar-documento`; JOB-WFL-12 `wfl:renderizar-lote` |
| Relación con 04-procesos-bpmn.md | P3 Facturación periódica y emisión fiscal ([§7](04-procesos-bpmn.md#7-p3--facturación-periódica-y-emisión-fiscal)) |

```mermaid
flowchart LR
  subgraph L_MOD["Módulo dueño del documento"]
    ni(("Inicio: Documento a emitir"))
    nt1[["Arma el view-model según su contrato y pide el render"]]
    nf0(("Fin: Devuelve el mismo documento"))
    nf1(("Fin: Render rechazado"))
  end
  subgraph L_WFL["Plantillas y documentos T11"]
    ng0{"¿idempotencyKey ya usada?"}
    nt2[["Elige la versión publicada vigente a la fecha del documento"]]
    ng1{"¿Datos válidos contra el contrato?"}
    ne1>"EVT-WFL-038 wfl.render.failed"]
    ng2{"¿Uno o lote?"}
    nj1[["JOB-WFL-11 wfl:renderizar-documento cola interactive"]]
    nj2[["JOB-WFL-12 wfl:renderizar-lote cola batch"]]
    nt3[["HTML a PDF; PDF/A, copias y marcas de agua si el tipo lo exige"]]
    nt5[["documents y documentVersions con generatedFrom; vincula al sujeto y numera"]]
    ne2>"EVT-WFL-037 wfl.render.completed"]
    nf2(("Fin: Documento accepted e inmutable"))
  end
  subgraph L_PLA["Archivos T01"]
    nt4[["Guarda el archivo en storedFiles"]]
  end
  ni --> nt1
  nt1 --> ng0
  ng0 -->|"Sí"| nf0
  ng0 -->|"No"| nt2
  nt2 --> ng1
  ng1 -->|"No"| ne1
  ne1 --> nf1
  ng1 -->|"Sí"| ng2
  ng2 -->|"Uno"| nj1
  nj1 --> nt3
  ng2 -->|"Lote"| nj2
  nj2 --> nt3
  nt3 --> nt4
  nt4 --> nt5
  nt5 --> ne2
  ne2 --> nf2
  classDef inicio fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
  classDef fin fill:#ffebee,stroke:#c62828,stroke-width:4px
  classDef evento fill:#fff8e1,stroke:#f9a825
  classDef temporizador fill:#e3f2fd,stroke:#1565c0
  class ni inicio
  class nf0,nf1,nf2 fin
  class ne1,ne2 evento
```

**Pasos del proceso** (actividad tomada del anexo; la columna RF/RN distingue lo citado en el paso de lo asociado por parámetro, permiso, evento o tema compartido).

| Paso | Carril | Actividad | RF/RN que aplican | EVT / JOB / PAN |
|---|---|---|---|---|
| 1 | Módulo dueño del documento | El módulo dueño arma el view-model según su contrato (por ejemplo, `fac.invoice.v3`) y llama a `wfl.templates.render`. | — | — |
| 2 | Plantillas y documentos T11 | T11 elige la versión publicada vigente a la fecha del documento, valida los datos contra el contrato y renderiza HTML → PDF (cola `interactive` si es uno; `batch` si es lote). Aplica PDF/A si el tipo lo exige, copias y marcas de agua. | — | — |
| 3 | Plantillas y documentos T11 | Guarda `storedFiles` (T01), `documents` y `documentVersions` con `generatedFrom`. Vincula al sujeto y numera si el tipo lo exige. | asoc.: RF-WFL-150 | — |
| 4 | Plantillas y documentos T11 | Idempotencia `renderRequests.idempotencyKey`: un reintento devuelve el mismo documento. | — | — |
| 5 | Plantillas y documentos T11 | Documento emitido: queda `accepted` e inmutable (RN-WFL-065). La reimpresión agrega una marca y un registro, pero no un documento nuevo. | RN-WFL-065 | — |

**Situación actual en ProCoop (nota de cambio).** ProCoop numera con `max + 1` y tablas de último número (CTR-WFL-14) y guarda archivos en una carpeta pública con sobrescritura por nombre (CTR-WFL-13); GoodApps usa contador atómico y repositorio privado con versionado inmutable.

**Excepciones**

| Excepción | Tratamiento |
|---|---|
| Reintento del mismo pedido | Devuelve el mismo documento por `renderRequests.idempotencyKey`. |
| Reimpresión | Agrega una marca y un registro, no un documento nuevo (RN-WFL-065). |

---

## 9. P-WFL-09 Firma electrónica de recibos de sueldo (FIC 15, DFA M20)

| Campo | Contenido |
|---|---|
| Fuente | T11 §9.9, `T11-WFL-workflow-eventos-documentos.md` (línea 1946) |
| Macroproceso | MP-08 Orquestación, workflow y documentos |
| Disparador | Recibos de sueldo emitidos |
| Resultado | Recibo firmado; Rechazo gestionado |
| Carriles | Sueldos M16; Firma T11; Proveedor de firma digital T06; Empleado (C-EMP); RRHH (T-RRHH) |
| Roles de T02 | C-EMP Empleado en portal, T-RRHH RRHH / Liquidador |
| Módulos involucrados | M16 Sueldos, T06 Integraciones, T11 Workflow, eventos y documentos |
| Eventos (T11 §12) | EVT-WFL-041 `wfl.signature.requested`, `wfl.signature.participantSigned`; EVT-WFL-042 `wfl.signature.completed`; EVT-SUE-15 `sue.payslip.acknowledged`; EVT-WFL-043 `wfl.signature.rejected` |
| Jobs | JOB-SUE-03 `sue:emitir-recibos-pdf`; JOB-WFL-18 `wfl:consultar-estado-firma`; JOB-WFL-19 `wfl:vencer-firmas`; JOB-SUE-04 `sue:firmar-recibos-empleador`; JOB-WFL-17 `wfl:enviar-a-firma`; JOB-SUE-06 `sue:consultar-estado-firma`; JOB-SUE-19 `sue:recordatorios-firma` |
| Relación con 04-procesos-bpmn.md | — |

```mermaid
flowchart LR
  subgraph L_SUE["Sueldos M16"]
    ni(("Inicio: Recibos de sueldo emitidos"))
    nt1[["Emite los PDF con el render de T11 y pide la firma del empleador (JOB-SUE-04)"]]
    nt7[["Marca el recibo como conformado"]]
    ne3>"EVT-SUE-15 sue.payslip.acknowledged"]
  end
  subgraph L_WFL["Firma T11"]
    nj1[["JOB-WFL-17 wfl:enviar-a-firma firma del empleador con perfil SIG-SUE-EMPLEADOR"]]
    nj2(["JOB-WFL-18 wfl:consultar-estado-firma sondea el estado del proveedor"])
    nt3[["Crea una solicitud de firma por empleado con perfil SIG-SUE-EMPLEADO"]]
    ne1>"EVT-WFL-041 wfl.signature.requested"]
    nt6[["Genera evidencias: hash, hora del servidor, OTP verificado y dispositivo"]]
    ne5>"EVT-WFL-041 wfl.signature.participantSigned"]
    ne2>"EVT-WFL-042 wfl.signature.completed"]
    ne4>"EVT-WFL-043 wfl.signature.rejected"]
    nj3(["JOB-WFL-19 wfl:vencer-firmas vencimientos y recordatorios"])
  end
  subgraph L_INT["Proveedor de firma digital T06"]
    nt2[["El proveedor licenciado firma"]]
  end
  subgraph L_EMP["Empleado (C-EMP)"]
    nt4["Abre el recibo en la PWA, lo lee y acepta el texto legal"]
    ng1{"¿Firma o rechaza?"}
    nt5["Ingresa el OTP y firma"]
    nf1(("Fin: Recibo firmado"))
  end
  subgraph L_RRHH["RRHH (T-RRHH)"]
    nt8["Atiende el rechazo con motivo"]
    nf2(("Fin: Rechazo gestionado"))
  end
  ni --> nt1
  nt1 --> nj1
  nj1 --> nt2
  nt2 --> nj2
  nj2 --> nt3
  nt3 --> ne1
  ne1 --> nt4
  nt4 --> ng1
  ng1 -->|"Firma"| nt5
  nt5 --> nt6
  nt6 --> ne5
  ne5 --> ne2
  ne2 --> nt7
  nt7 --> ne3
  ne3 --> nf1
  ng1 -->|"Rechaza"| ne4
  ne4 --> nt8
  nt8 --> nf2
  ne1 -.->|"sin firma"| nj3
  nj3 --> nt4
  classDef inicio fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
  classDef fin fill:#ffebee,stroke:#c62828,stroke-width:4px
  classDef evento fill:#fff8e1,stroke:#f9a825
  classDef temporizador fill:#e3f2fd,stroke:#1565c0
  class ni inicio
  class nf1,nf2 fin
  class ne1,ne5,ne2,ne3,ne4 evento
  class nj2,nj3 temporizador
```

**Pasos del proceso** (actividad tomada del anexo; la columna RF/RN distingue lo citado en el paso de lo asociado por parámetro, permiso, evento o tema compartido).

| Paso | Carril | Actividad | RF/RN que aplican | EVT / JOB / PAN |
|---|---|---|---|---|
| 1 | Sueldos M16 | M16 emite los recibos (`sue:emitir-recibos-pdf` usa el render de T11) y pide a T11 la firma del empleador (JOB-SUE-04 llama a API-WFL-75; T11 la ejecuta con JOB-WFL-17). El perfil `SIG-SUE-EMPLEADOR` es firma digital con proveedor licenciado por T06 (DEC-078). | asoc.: RF-WFL-198 | JOB-SUE-04, JOB-WFL-17, JOB-SUE-03 |
| 2 | Firma T11 | Con la firma del empleador, T11 crea `signatureRequests` por empleado con el perfil `SIG-SUE-EMPLEADO` (electrónica, OTP por SMS o email). | — | — |
| 3 | Empleado | El empleado abre el recibo en la PWA, lo lee, acepta el texto legal, ingresa el OTP y firma. Se generan las evidencias (hash, hora del servidor, OTP verificado, dispositivo) y se emite EVT-WFL-041. | — | EVT-WFL-041 |
| 4 | Sueldos M16 | M16 recibe `wfl.signature.completed` y marca `sue.payslip.acknowledged`. Ante un rechazo con motivo, RRHH recibe una tarea. | — | EVT-WFL-042, EVT-SUE-15 |
| 5 | Firma T11 | `wfl:consultar-estado-firma` sondea los proveedores en firma digital. `wfl:vencer-firmas` aplica vencimientos y recordatorios. JOB-SUE-06 y JOB-SUE-19 de M16 se retiraron en favor de estos jobs (CTR-WFL-12). | — | JOB-SUE-06, JOB-SUE-19, JOB-WFL-18, JOB-WFL-19 |

**Situación actual en ProCoop (nota de cambio).** M16 tenía lógica de firma propia y la BASE preveía firma capturada en pantalla; DEC-078 centraliza la firma en T11 en tres niveles, con firma digital por proveedor licenciado para recibos de sueldo (CTR-WFL-12). El análisis de brechas (§3.18) registra la firma manuscrita actual.

**Excepciones**

| Excepción | Tratamiento |
|---|---|
| Rechazo del empleado con motivo | RRHH recibe una tarea. |
| Firma no realizada en plazo | JOB-WFL-19 aplica vencimientos y recordatorios. |
| Jobs propios de firma en M16 | JOB-SUE-06 y JOB-SUE-19 se retiraron en favor de los jobs de T11 (CTR-WFL-12). |

---

## 10. P-WFL-10 Conformidad de instalación en campo (BASE §73, DFA M14)

| Campo | Contenido |
|---|---|
| Fuente | T11 §9.10, `T11-WFL-workflow-eventos-documentos.md` (línea 1954) |
| Macroproceso | MP-08 Orquestación, workflow y documentos |
| Disparador | Instalación terminada |
| Resultado | Conformidad registrada; Negativa registrada |
| Carriles | Técnico de campo (T-TEC); PWA de campo con T11 local; Socio (C-SOC); Documentos T11; Técnica M10 |
| Roles de T02 | C-SOC Socio titular, T-TEC Técnico (campo) |
| Módulos involucrados | M10 Técnica y campo, T11 Workflow, eventos y documentos |
| Eventos (T11 §12) | EVT-TEC-15 `tec.conformity.signed`, `tec.conformity.refused` |
| Jobs | — |
| Relación con 04-procesos-bpmn.md | P1 Alta de socio y contratación de servicio ([§5](04-procesos-bpmn.md#5-p1--alta-de-socio-y-contratación-de-servicio)); P6 Reclamo y orden de trabajo ([§10](04-procesos-bpmn.md#10-p6--reclamo-y-orden-de-trabajo)) |

```mermaid
flowchart LR
  subgraph L_TEC["Técnico de campo (T-TEC)"]
    ni(("Inicio: Instalación terminada"))
    nt1["Cierra la OT en la PWA, con o sin conexión"]
    nf1(("Fin: Conformidad registrada"))
    nt7["Registra la negativa con motivo y foto opcional"]
    nf2(("Fin: Negativa registrada"))
  end
  subgraph L_PWA["PWA de campo con T11 local"]
    nt2[["Genera localmente el acta TPL-TEC-02 con los datos de la OT y del equipo en comodato"]]
    nt4[["Captura geolocalización si se autoriza, fecha, hora y dispositivo"]]
    nt5[["Sincroniza con clientMutationId"]]
  end
  subgraph L_SOC["Socio (C-SOC)"]
    ng1{"¿Acepta firmar?"}
    nt3["Firma en pantalla con nombre y DNI declarados"]
  end
  subgraph L_WFL["Documentos T11"]
    nt6[["Crea el documento, la versión aceptada y las evidencias"]]
  end
  subgraph L_M10["Técnica M10"]
    ne1>"EVT-TEC-15 tec.conformity.signed"]
    ne2>"EVT-TEC-15 tec.conformity.refused"]
  end
  ni --> nt1
  nt1 --> nt2
  nt2 --> ng1
  ng1 -->|"Sí"| nt3
  nt3 --> nt4
  nt4 --> nt5
  nt5 --> nt6
  nt6 --> ne1
  ne1 --> nf1
  ng1 -->|"No"| nt7
  nt7 --> ne2
  ne2 --> nf2
  classDef inicio fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
  classDef fin fill:#ffebee,stroke:#c62828,stroke-width:4px
  classDef evento fill:#fff8e1,stroke:#f9a825
  classDef temporizador fill:#e3f2fd,stroke:#1565c0
  class ni inicio
  class nf1,nf2 fin
  class ne1,ne2 evento
```

**Pasos del proceso** (actividad tomada del anexo; la columna RF/RN distingue lo citado en el paso de lo asociado por parámetro, permiso, evento o tema compartido).

| Paso | Carril | Actividad | RF/RN que aplican | EVT / JOB / PAN |
|---|---|---|---|---|
| 1 | Técnico de campo | El técnico cierra la OT en la PWA de campo (offline admitido). T11 genera el "Acta de conformidad de instalación" (`TPL-TEC-02`) localmente, con los datos de la OT y el equipo en comodato. | — | — |
| 2 | Socio | El socio firma en pantalla (manuscrita digitalizada) con nombre y DNI declarados. Se capturan geolocalización (si se autoriza), fecha y hora, y dispositivo. | asoc.: RF-WFL-196 | — |
| 3 | Documentos T11 | Al sincronizar (`clientMutationId`), se crean el documento, la versión aceptada y las evidencias. M10 publica `tec.conformity.signed`. | asoc.: RF-WFL-097 | EVT-TEC-15 |
| 4 | Técnico de campo | Si el socio se niega, se registra `tec.conformity.refused` con motivo y foto opcional. | — | EVT-TEC-15 |

**Situación actual en ProCoop (nota de cambio).** La conformidad en papel o manuscrita de ProCoop (análisis de brechas §3.18) se reemplaza por firma capturada en pantalla con evidencias (BASE §73, DEC-078).

**Excepciones**

| Excepción | Tratamiento |
|---|---|
| Sin conexión en el domicilio | El acta se genera y firma localmente; se sincroniza después con `clientMutationId`. |
| Socio que no autoriza la geolocalización | Se firma sin ese dato. |
| Negativa a firmar | Se registra con motivo y foto opcional. |

---

## 11. P-WFL-11 Retención y purga

| Campo | Contenido |
|---|---|
| Fuente | T11 §9.11, `T11-WFL-workflow-eventos-documentos.md` (línea 1961) |
| Macroproceso | MP-08 Orquestación, workflow y documentos |
| Disparador | Todos los días a las 03:00 hora del tenant |
| Resultado | Excluido de la purga; Sigue conservado; Solo se informa (RN-WFL-064); Documento purgado |
| Carriles | Documentos T11; Administrador del tenant (T-ADM); Archivos T01 |
| Roles de T02 | T-ADM Administrador de la cooperativa |
| Módulos involucrados | T01 Plataforma, T11 Workflow, eventos y documentos |
| Eventos (T11 §12) | EVT-WFL-032 `wfl.document.retentionExpired`, `wfl.document.purged` |
| Jobs | JOB-WFL-14 `wfl:aplicar-retencion`; JOB-WFL-15 `wfl:purgar-documentos` |
| Relación con 04-procesos-bpmn.md | — |

```mermaid
flowchart LR
  subgraph L_WFL["Documentos T11"]
    ni(("Inicio: Todos los días a las 03:00 hora del tenant"))
    nj1(["JOB-WFL-14 wfl:aplicar-retencion"])
    nt1[["Calcula retainUntil para los documentos sin fecha"]]
    ng1{"¿Legal hold o vínculo económico vigente?"}
    nf0(("Fin: Excluido de la purga"))
    ng2{"¿Retención vencida?"}
    nf3(("Fin: Sigue conservado"))
    ne1>"EVT-WFL-032 wfl.document.retentionExpired"]
    ng3{"¿Política toValidate?"}
    nf4(("Fin: Solo se informa (RN-WFL-064)"))
    nj2[["JOB-WFL-15 wfl:purgar-documentos"]]
    ne2>"EVT-WFL-032 wfl.document.purged"]
    nf1(("Fin: Documento purgado"))
  end
  subgraph L_ADM["Administrador del tenant (T-ADM)"]
    nt2["Revisa los pendientes de purga durante PRM-WFL-043 días"]
    ng4{"¿Extiende la retención?"}
  end
  subgraph L_PLA["Archivos T01"]
    nt3[["Borra los binarios y deja una lápida con hash, tipo, fechas y motivo"]]
  end
  ni --> nj1
  nj1 --> nt1
  nt1 --> ng1
  ng1 -->|"Sí"| nf0
  ng1 -->|"No"| ng2
  ng2 -->|"No"| nf3
  ng2 -->|"Sí"| ne1
  ne1 --> ng3
  ng3 -->|"Sí"| nf4
  ng3 -->|"No"| nt2
  nt2 --> ng4
  ng4 -->|"Sí"| nf3
  ng4 -->|"No"| nj2
  nj2 --> nt3
  nt3 --> ne2
  ne2 --> nf1
  classDef inicio fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
  classDef fin fill:#ffebee,stroke:#c62828,stroke-width:4px
  classDef evento fill:#fff8e1,stroke:#f9a825
  classDef temporizador fill:#e3f2fd,stroke:#1565c0
  class ni inicio
  class nf0,nf3,nf4,nf1 fin
  class ne1,ne2 evento
  class nj1 temporizador
```

**Pasos del proceso** (actividad tomada del anexo; la columna RF/RN distingue lo citado en el paso de lo asociado por parámetro, permiso, evento o tema compartido).

| Paso | Carril | Actividad | RF/RN que aplican | EVT / JOB / PAN |
|---|---|---|---|---|
| 1 | Documentos T11 | `wfl:aplicar-retencion` (diario, 03:00 en la zona del tenant) calcula `retainUntil` para los documentos sin fecha y marca `retentionExpired` cuando vence. Excluye los que tienen legal hold o un vínculo económico vigente. | — | JOB-WFL-14 |
| 2 | Administrador del tenant | Los documentos vencidos quedan `PRM-WFL-043` días en "pendientes de purga", visibles para T-ADM, que puede extender la retención. | — | — |
| 3 | Documentos T11 | `wfl:purgar-documentos` borra los binarios por medio de T01, deja una lápida (hash, tipo, fechas, motivo) y emite EVT-WFL-032. | — | EVT-WFL-032, JOB-WFL-15 |
| 4 | Documentos T11 | Las políticas `toValidate` no purgan (RN-WFL-064): solo informan. | RN-WFL-064 | — |

**Situación actual en ProCoop (nota de cambio).** ProCoop borra archivos físicamente y los sobrescribe por nombre (CTR-WFL-13); GoodApps usa borrado lógico y purga solo por retención, con lápida.

**Excepciones**

| Excepción | Tratamiento |
|---|---|
| Documento con legal hold o vínculo económico vigente | No entra en la purga. |
| Política aún por validar (toValidate) | No purga; solo informa (RN-WFL-064). |

---

## 12. P-WFL-12 Expediente: consulta y exportación

| Campo | Contenido |
|---|---|
| Fuente | T11 §9.12, `T11-WFL-workflow-eventos-documentos.md` (línea 1968) |
| Macroproceso | MP-08 Orquestación, workflow y documentos |
| Disparador | Abre el expediente de un sujeto |
| Resultado | Consulta realizada; Expediente exportado y auditado |
| Carriles | Usuario con alcance sobre el sujeto; Expediente T11; Archivos T01 |
| Roles de T02 | Solo actores del sistema (sin rol humano) |
| Módulos involucrados | T01 Plataforma, T11 Workflow, eventos y documentos |
| Eventos (T11 §12) | EVT-WFL-045 `wfl.dossier.exported` |
| Jobs | JOB-WFL-16 `wfl:exportar-expediente` |
| Relación con 04-procesos-bpmn.md | — |

```mermaid
flowchart LR
  subgraph L_USR["Usuario con alcance sobre el sujeto"]
    ni(("Inicio: Abre el expediente de un sujeto"))
    ng1{"¿Exporta?"}
    nf1(("Fin: Consulta realizada"))
    nt3["Descarga el ZIP"]
    nf2(("Fin: Expediente exportado y auditado"))
  end
  subgraph L_WFL["Expediente T11"]
    nt1[["Consulta documentLinks y dossierTimeline con el alcance y filtra la sensibilidad"]]
    nj1[["JOB-WFL-16 wfl:exportar-expediente arma un ZIP con índice TPL-WFL-01 y los documentos visibles"]]
    ne1>"EVT-WFL-045 wfl.dossier.exported"]
  end
  subgraph L_PLA["Archivos T01"]
    nt2[["Deja el archivo con vencimiento PRM-PLA-024"]]
  end
  ni --> nt1
  nt1 --> ng1
  ng1 -->|"No"| nf1
  ng1 -->|"Sí"| nj1
  nj1 --> nt2
  nt2 --> ne1
  ne1 --> nt3
  nt3 --> nf2
  classDef inicio fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
  classDef fin fill:#ffebee,stroke:#c62828,stroke-width:4px
  classDef evento fill:#fff8e1,stroke:#f9a825
  classDef temporizador fill:#e3f2fd,stroke:#1565c0
  class ni inicio
  class nf1,nf2 fin
  class ne1 evento
```

**Pasos del proceso** (actividad tomada del anexo; la columna RF/RN distingue lo citado en el paso de lo asociado por parámetro, permiso, evento o tema compartido).

| Paso | Carril | Actividad | RF/RN que aplican | EVT / JOB / PAN |
|---|---|---|---|---|
| 1 | Usuario con alcance sobre el sujeto | El usuario abre el expediente de un sujeto. T11 consulta `documentLinks` y `dossierTimeline` con el alcance del usuario y filtra la sensibilidad. | asoc.: RF-WFL-154 | — |
| 2 | Expediente T11 | Al exportar, se crea un job de clase `export` (`wfl:exportar-expediente`) que arma un ZIP con un PDF índice (plantilla `TPL-WFL-01`) y los documentos visibles. El job audita y deja el archivo con vencimiento (PRM-PLA-024). Se emite EVT-WFL-045. | asoc.: RF-WFL-213 | EVT-WFL-045, JOB-WFL-16 |

**Situación actual en ProCoop (nota de cambio).** No relevada en el anexo ni en T07 o en el análisis de brechas (`15-analisis-brechas-procoop.md`).

**Excepciones**

| Excepción | Tratamiento |
|---|---|
| Documentos fuera del alcance o de sensibilidad mayor | No se muestran ni se exportan. |
| Archivo vencido | Se genera una nueva exportación. |

---

## 13. P-WFL-13 Mesa de entradas coordinada (MER-016, DFA M21)

| Campo | Contenido |
|---|---|
| Fuente | T11 §9.13, `T11-WFL-workflow-eventos-documentos.md` (línea 1973) |
| Macroproceso | MP-08 Orquestación, workflow y documentos |
| Disparador | Ingresa documentación externa |
| Resultado | Expediente cerrado |
| Carriles | Operador de mesa de entradas de M09 (T-ATE); Expediente T11; Área destino del pase |
| Roles de T02 | T-ATE Comercial / Atención al socio |
| Módulos involucrados | M09 Atención, T11 Workflow, eventos y documentos |
| Eventos (T11 §12) | EVT-WFL-044 `wfl.dossier.opened`, `wfl.dossier.closed` |
| Jobs | — |
| Relación con 04-procesos-bpmn.md | — |

```mermaid
flowchart LR
  subgraph L_OPE["Operador de mesa de entradas de M09 (T-ATE)"]
    ni(("Inicio: Ingresa documentación externa"))
    nt1["Registra la entrada: remitente, tipo de documento, folios y plazo de respuesta"]
    ng1{"¿Requiere pase a otra área?"}
    nt6["Registra la respuesta como salida con número MS vinculado"]
    nf1(("Fin: Expediente cerrado"))
  end
  subgraph L_WFL["Expediente T11"]
    nt2[["Asigna número ME con secuencia gapless y abre el expediente deskEntry"]]
    ne1>"EVT-WFL-044 wfl.dossier.opened"]
    nt3[["Genera acuse TPL-CRM-04 y carátula TPL-WFL-02; digitaliza lo recibido"]]
    nt4[["Crea un workItem deskTransfer"]]
    ne2>"EVT-WFL-044 wfl.dossier.closed"]
  end
  subgraph L_ARE["Área destino del pase"]
    nt5["Acusa el pase y trabaja; el plazo corre en días hábiles"]
  end
  ni --> nt1
  nt1 --> nt2
  nt2 --> ne1
  ne1 --> nt3
  nt3 --> ng1
  ng1 -->|"Sí"| nt4
  nt4 --> nt5
  nt5 --> ng1
  ng1 -->|"No"| nt6
  nt6 --> ne2
  ne2 --> nf1
  classDef inicio fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
  classDef fin fill:#ffebee,stroke:#c62828,stroke-width:4px
  classDef evento fill:#fff8e1,stroke:#f9a825
  classDef temporizador fill:#e3f2fd,stroke:#1565c0
  class ni inicio
  class nf1 fin
  class ne1,ne2 evento
```

**Pasos del proceso** (actividad tomada del anexo; la columna RF/RN distingue lo citado en el paso de lo asociado por parámetro, permiso, evento o tema compartido).

| Paso | Carril | Actividad | RF/RN que aplican | EVT / JOB / PAN |
|---|---|---|---|---|
| 1 | Operador de mesa de entradas de M09 | El operador de M09 registra la entrada (`crmCases.kind = deskEntry`): remitente, tipo de documento, folios y plazo de respuesta. | — | — |
| 2 | Expediente T11 | T11 asigna el número `ME-2026-000045` (secuencia `gapless`), abre `dossiers` (kind `deskEntry`), genera el acuse (`TPL-CRM-04`) y la carátula (`TPL-WFL-02`) y digitaliza los documentos recibidos. | — | — |
| 3 | Área destino del pase | Cada pase a otra área crea un `workItem` de tipo `deskTransfer` que el área destino debe acusar; el plazo de respuesta corre en días hábiles. | asoc.: RF-WFL-221 | — |
| 4 | Operador de mesa de entradas de M09 | La respuesta se registra como salida con su número (`MS-2026-000019`) vinculado. Al cerrar, el expediente queda `closed`. | — | — |

**Situación actual en ProCoop (nota de cambio).** M09 cubre la mesa de entradas como caso; T11 aporta numeración, expediente, acuse, carátula y pases (CTR-WFL-21). La numeración `max + 1` de ProCoop se reemplaza por contador atómico (CTR-WFL-14).

**Excepciones**

| Excepción | Tratamiento |
|---|---|
| Pase no acusado por el área destino | El plazo corre en días hábiles y escala según SLA. |
| Numeración | Secuencia sin huecos (`gapless`). |

---

## 14. P-WFL-14 Proyección de la bandeja

| Campo | Contenido |
|---|---|
| Fuente | T11 §9.14, `T11-WFL-workflow-eventos-documentos.md` (línea 1980) |
| Macroproceso | MP-08 Orquestación, workflow y documentos |
| Disparador | Evento de una fuente de la bandeja |
| Resultado | Evento descartado; Bandeja y contadores exactos |
| Carriles | Módulos fuente; Bandeja T11; Usuario de la bandeja |
| Roles de T02 | Solo actores del sistema (sin rol humano) |
| Módulos involucrados | M03 Medición, M09 Atención, M10 Técnica y campo, T11 Workflow, eventos y documentos |
| Eventos (T11 §12) | EVT-CRM-04 `crm.case.assigned`; EVT-TEC-05 `tec.workOrder.statusChanged`; EVT-TEC-13 `tec.visit.statusChanged`; EVT-MED-28 `med.syncConflict.raised` |
| Jobs | JOB-WFL-06 `wfl:proyectar-bandeja`; JOB-WFL-07 `wfl:recalcular-vencimientos-bandeja`; JOB-WFL-08 `wfl:reconstruir-proyecciones` |
| Relación con 04-procesos-bpmn.md | — |

```mermaid
flowchart LR
  subgraph L_SRC["Módulos fuente"]
    ni(("Inicio: Evento de una fuente de la bandeja"))
    ne1>"Tareas, aprobaciones, autorizaciones, casos, OT y conflictos de §12.5"]
  end
  subgraph L_WFL["Bandeja T11"]
    nj1[["JOB-WFL-06 wfl:proyectar-bandeja"]]
    ng1{"¿sourceVersion menor a la guardada?"}
    nf0(("Fin: Evento descartado"))
    nt1[["Upsert por sourceType y sourceId"]]
    nj2(["JOB-WFL-07 wfl:recalcular-vencimientos-bandeja a las 00:05"])
    nj3(["JOB-WFL-08 wfl:reconstruir-proyecciones reconstrucción completa"])
    nt3[["Compara con las fuentes y corrige diferencias"]]
  end
  subgraph L_USR["Usuario de la bandeja"]
    nt2["Lee la bandeja; dueBucket se recalcula con la hora local"]
    nf1(("Fin: Bandeja y contadores exactos"))
  end
  ni --> ne1
  ne1 --> nj1
  nj1 --> ng1
  ng1 -->|"Sí"| nf0
  ng1 -->|"No"| nt1
  nt1 --> nt2
  nt2 --> nf1
  nj2 --> nt2
  nj3 --> nt3
  nt3 --> nf1
  classDef inicio fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
  classDef fin fill:#ffebee,stroke:#c62828,stroke-width:4px
  classDef evento fill:#fff8e1,stroke:#f9a825
  classDef temporizador fill:#e3f2fd,stroke:#1565c0
  class ni inicio
  class nf0,nf1 fin
  class ne1 evento
  class nj2,nj3 temporizador
```

**Pasos del proceso** (actividad tomada del anexo; la columna RF/RN distingue lo citado en el paso de lo asociado por parámetro, permiso, evento o tema compartido).

| Paso | Carril | Actividad | RF/RN que aplican | EVT / JOB / PAN |
|---|---|---|---|---|
| 1 | Bandeja T11 | `wfl:proyectar-bandeja` consume los eventos de las fuentes (§12.5): `wfl.task.*`, `wfl.approval.*`, `iam.authorization.*`, `crm.case.assigned`/`statusChanged`, `tec.workOrder.statusChanged`, `tec.visit.statusChanged`, `fac.billingException.*`, `crm.activityOccurrence.*`, `tec.syncConflict.*`, `stk.fieldConflict.*`, `med.syncConflict.raised`, `wfl.signature.*` y `wfl.operationalInbox.*`. | — | JOB-WFL-06, EVT-CRM-04, EVT-TEC-05, EVT-TEC-13, EVT-MED-28 |
| 2 | Bandeja T11 | Hace un upsert por (`sourceType`, `sourceId`) y descarta los eventos con `sourceVersion` menor a la guardada. | — | — |
| 3 | Bandeja T11 | La lectura recalcula `dueBucket` con la hora local. `wfl:recalcular-vencimientos-bandeja` lo hace en bloque a las 00:05 para que los contadores sean exactos. | — | JOB-WFL-07 |
| 4 | Bandeja T11 | La reconstrucción completa (`wfl:reconstruir-proyecciones`) compara los resultados con las fuentes y corrige las diferencias. | asoc.: RF-WFL-012 | JOB-WFL-08 |

**Situación actual en ProCoop (nota de cambio).** ProCoop no tiene motor de workflow (análisis de brechas §3.18).

**Excepciones**

| Excepción | Tratamiento |
|---|---|
| Eventos fuera de orden | Se descartan los de `sourceVersion` menor a la guardada. |
| Proyección desalineada | La reconstrucción completa corrige las diferencias. |

---

## 15. P-WFL-15 Reasignación por baja o licencia

| Campo | Contenido |
|---|---|
| Fuente | T11 §9.15, `T11-WFL-workflow-eventos-documentos.md` (línea 1987) |
| Macroproceso | MP-08 Orquestación, workflow y documentos |
| Disparador | Pertenencia suspendida o revocada; Baja o licencia aprobada |
| Resultado | Trabajo sin huérfanos |
| Carriles | Identidad T02; Sueldos M16; Workflow T11; Supervisor del área |
| Roles de T02 | Solo actores del sistema (sin rol humano) |
| Módulos involucrados | M16 Sueldos, T02 Identidad y roles, T11 Workflow, eventos y documentos |
| Eventos (T11 §12) | EVT-IAM-03 `iam.membership.suspended`, `iam.membership.revoked`; EVT-SUE-03 `sue.employee.terminated`; EVT-SUE-08 `sue.leave.approved`; EVT-WFL-027 `wfl.workItem.reassigned` |
| Jobs | JOB-WFL-29 `wfl:reasignar-huerfanos` |
| Relación con 04-procesos-bpmn.md | — |

```mermaid
flowchart LR
  subgraph L_IAM["Identidad T02"]
    ni(("Inicio: Pertenencia suspendida o revocada"))
    ne1>"EVT-IAM-03 iam.membership.revoked o suspended"]
  end
  subgraph L_SUE["Sueldos M16"]
    ni2(("Inicio: Baja o licencia aprobada"))
    ne2>"EVT-SUE-03 sue.employee.terminated o EVT-SUE-08 sue.leave.approved"]
  end
  subgraph L_WFL["Workflow T11"]
    nj1[["JOB-WFL-29 wfl:reasignar-huerfanos"]]
    ng1{"¿Hay reemplazo definido?"}
    nt1[["Mueve tareas y pasos de aprobación al reemplazo"]]
    nt2[["Mueve tareas y pasos de aprobación al área"]]
    nt3[["Suspende las delegaciones del usuario"]]
    ne3>"EVT-WFL-027 wfl.workItem.reassigned"]
  end
  subgraph L_SUP["Supervisor del área"]
    nt4["Recibe el aviso y redistribuye si hace falta"]
    nf1(("Fin: Trabajo sin huérfanos"))
  end
  ni --> ne1
  ne1 --> nj1
  ni2 --> ne2
  ne2 --> nj1
  nj1 --> ng1
  ng1 -->|"Sí"| nt1
  nt1 --> nt3
  ng1 -->|"No"| nt2
  nt2 --> nt3
  nt3 --> ne3
  ne3 --> nt4
  nt4 --> nf1
  classDef inicio fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
  classDef fin fill:#ffebee,stroke:#c62828,stroke-width:4px
  classDef evento fill:#fff8e1,stroke:#f9a825
  classDef temporizador fill:#e3f2fd,stroke:#1565c0
  class ni,ni2 inicio
  class nf1 fin
  class ne1,ne2,ne3 evento
```

**Pasos del proceso** (actividad tomada del anexo; la columna RF/RN distingue lo citado en el paso de lo asociado por parámetro, permiso, evento o tema compartido).

| Paso | Carril | Actividad | RF/RN que aplican | EVT / JOB / PAN |
|---|---|---|---|---|
| 1 | Workflow T11 | Los eventos `iam.membership.suspended`/`revoked` (EVT-IAM-03), `sue.employee.terminated` (EVT-SUE-03) y `sue.leave.approved` (EVT-SUE-08, con vigencia) disparan `wfl:reasignar-huerfanos` (JOB-WFL-29). | asoc.: RN-WFL-037, RF-WFL-079 | EVT-IAM-03, EVT-SUE-03, EVT-SUE-08, JOB-WFL-29 |
| 2 | Workflow T11 | Mueve las tareas y los pasos de aprobación del usuario a su área o al reemplazo definido. | — | — |
| 3 | Workflow T11 | Suspende sus delegaciones. | — | — |
| 4 | Supervisor del área | Avisa al supervisor. | — | — |
| 5 | Workflow T11 | Publica EVT-WFL-027. | — | EVT-WFL-027 |

**Situación actual en ProCoop (nota de cambio).** No relevada en el anexo ni en T07 o en el análisis de brechas (`15-analisis-brechas-procoop.md`).

**Excepciones**

| Excepción | Tratamiento |
|---|---|
| Licencia con vigencia | La reasignación aplica durante la vigencia de `sue.leave.approved`. |
| Baja que dispara IAM y Sueldos a la vez | Llegan EVT-SUE-03 y EVT-IAM-03 (este último desde P-IAM-26); el anexo no indica cómo se evita la doble reasignación. |

---

## Inconsistencias detectadas en la especificación (esta parte)

No se detectaron inconsistencias en los procesos de esta parte.

## Cobertura de esta parte

| Universo de la parte | Diagramados | Pendientes |
|---|---|---|
| 15 (P-WFL-01 a P-WFL-15) | 15 | 0 |
