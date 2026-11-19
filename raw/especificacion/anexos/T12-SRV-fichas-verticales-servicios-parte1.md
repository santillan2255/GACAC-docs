# T12 SRV — Fichas verticales por servicio · Parte 1 (servicios de red y TIC)

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Estado | Borrador para revisión funcional (control de cobertura, DEC-073) |
| Fecha | 04-11-2026 |
| Alcance de esta parte | INT Internet · TEL Telefonía · TV Televisión · ELE Energía eléctrica (con generación distribuida y grandes usuarios) · AG Agua potable · CLO Cloacas · GAS Gas (red natural, propano por red y envasado) · ALU Alumbrado público |
| Olas cubiertas | O2 (catálogo y contrato) · O3 (activación, equipos, aprovisionamiento) · O4 (facturación, fiscal, ALU como tasa) · O5 (cobro) · O6 (mora y corte) · O7 (servicios medidos) · O10 (TV y tasación telefónica) |
| Fuentes | `00-ESPECIFICACION-MAESTRA.md` (§3, §4.2, §12) · `01-registro-decisiones.md` (DEC-001..073) · `02-preguntas-abiertas.md` · anexos M01 PER, M02 CAT, M03 MED, M04 TAR, M05 FAC, M06 FIS, M07 COB, M08 MOR, M09 CRM, M10 TEC, M11 VEN, M13 STK, M15 CON, M19 POR, T04 CFG, T06 INT, T07 MIG, T09 COM, T10 BIA, T11 WFL |
| Parte 2 | OBR, SEP, CEM, SAN, SAL, VIV, TAS, CAP, OTR (fuera de este documento) |


> **Norma de implementación (DEC-111, DEC-112, DEC-110, DEC-113).** Construcción GoodApps: **.NET 10**, **ASP.NET Core**, **EF Core**, **Azure SQL** (base compartida, `TenantId` en tablas de negocio), front **React 19**, **Microsoft Azure** (Container Apps, Blob, Queue, Key Vault, Application Insights), identidad **OpenIddict**. Modelo físico: `07-modelo-relacional-azure-sql.md` y `07-catalogo-tablas-sql.md`. Checklist e impacto: `06-impacto-adaptacion-stack-goodapps.md` (**DIR-13**).
>
> **Lectura:** «colección» en este anexo = **entidad lógica**; tablas, columnas y FK en `07-*`. RF/RN/CU del anexo **no cambian** por el stack.


## 0.1 Propósito

Este anexo **no especifica requisitos nuevos**. Ordena, para cada servicio, los requisitos que ya existen en los anexos M01–M19 y T01–T11 siguiendo el ciclo de vida del servicio, con los **IDs exactos** de cada anexo. Sirve para tres cosas:

1. **Construir un servicio de punta a punta**: Cursor IA toma una ficha y sabe qué pantallas, APIs, eventos, jobs, parámetros y reglas de cada módulo intervienen, y en qué orden.
2. **Probarlo**: cada ficha trae escenarios Dado/Cuando/Entonces con importes ficticios, que se convierten en pruebas de integración (Vitest + Supertest) y E2E (Playwright).
3. **Controlar la cobertura** (DEC-073): lo que el recorrido necesita y ningún anexo define queda registrado como **HUECO**, con propuesta y anexo responsable.

Reglas de redacción aplicadas:

- Solo se citan IDs verificados en el anexo dueño. Si un anexo no tiene ID para lo que se necesita, se cita la sección y se marca `[REF-PENDIENTE]`. Al 04-11-2026 no quedan marcas abiertas: todas se reemplazaron por el ID real del anexo dueño, conservando la marca original entre paréntesis como "antes `[REF-PENDIENTE]`".
- Los eventos de M02 CAT **no tienen ID** en su anexo (M02 §12.1); se citan por nombre (`cat.contract.activated`). Ver HUE-SRV-02. Estado al 04-11-2026: corregido; M02 §12.1 numera EVT-CAT-01 a EVT-CAT-28 con los mismos IDs que T11 §12.3 (EVT-CAT-23 reemplazado por EVT-SOC-01), y las fichas pueden citar el ID.
- Los estados del contrato son los canónicos de M02 §8.2 (transiciones T01–T17): `requested`, `feasibility`, `pendingInstallation`, `active`, `suspended`, `reactivationPending`, `pendingTermination` y los terminales `terminated`, `cancelled`, `superseded`.
- Los IDs de escenarios (`ESC-SRV-<SERV>-NN`) y de huecos (`HUE-SRV-NN`, `HUE-<SERV>-NN`) son **propios de este anexo**.
- "No aplica" se declara de forma explícita, como pide T04 RF-CFG-126.

## 0.2 Cómo usar una ficha con Cursor IA

1. **Prompt de arranque**: "Construí el servicio `<SERV>` siguiendo T12 §`<n>`. Implementá los pasos del recorrido en orden; para cada paso abrí el anexo y los IDs citados; no inventes reglas fuera de esos IDs".
2. **Orden de construcción**: respetar la ola de cada paso (sección 1 de la ficha). Un paso de una ola posterior se deja detrás de un *feature flag* del tenant (T01) y no se simula.
3. **Configuración primero**: cargar la sección 2 (perfil BASE §84, parámetros, maestros y precarga demo con `pnpm seed:demo`, M02 §18) antes de escribir lógica.
4. **Contratos entre módulos**: solo por API interna (`modules/<mod>/index.js`) o eventos vía outbox (T11 RF-WFL-001, 008); nunca lectura directa de colecciones de otro módulo (maestro §12).
5. **Pruebas**: cada escenario de la sección 7 se convierte en un test; el escenario de aislamiento de tenant es obligatorio en todo PR que toque la ficha (T08).
6. **Huecos**: si al construir aparece un HUECO de la sección 9, **no se resuelve en código**: se implementa la propuesta como opción configurable apagada y se deja `// TODO HUE-…` solo en el ticket, no en el código.

## 0.3 Matriz servicio × anexo

Cada celda indica la sección o los IDs de entrada del anexo para ese servicio. "—" significa que el anexo no interviene; "NA" que el paso se declara No aplica.

| Anexo | INT | TEL | TV | ELE | AG | CLO | GAS | ALU |
|---|---|---|---|---|---|---|---|---|
| M01 PER (titular, inmueble, punto) | RF-PER-093 | RF-PER-093 | RF-PER-093 | RF-PER-093, RF-PER-014 | RF-PER-086..095 | RF-PER-086..095 | RF-PER-093, RN-PER-062 | RF-PER-069, RF-PER-095 |
| M02 CAT (ficha de dominio) | 6.C.1, RF-CAT-099 | 6.C.2, RF-CAT-098 | 6.C.3 | 6.C.4, RF-CAT-096, 097 | 6.C.5 | 6.C.6, RF-CAT-021 | 6.C.7, RF-CAT-095 | 6.C.8, RF-CAT-086 |
| M03 MED (medición) | NA | NA | NA | RF-MED-012..099 | RF-MED-012..081 | NA (usa AG) | RF-MED-063 | NA |
| M04 TAR (cálculo) | RF-TAR-104, RN-TAR-230 | RF-TAR-097..099 | RN-TAR-012 tipo 6 | RN-TAR-227, 231, 232 | RN-TAR-228 | RN-CAT-074 | RF-TAR-040, RN-TAR-229 | RF-TAR-057, RN-TAR-073 |
| M05 FAC (emisión) | RF-FAC-065 | RF-FAC-124 | RF-FAC-065 | RF-FAC-030, 108 | RF-FAC-002, 170 | RF-FAC-069 | RF-FAC-108 | RF-FAC-120, 121 |
| M06 FIS (fiscal, regulador) | RF-FIS-146 | RF-FIS-146 | RF-FIS-146 | RF-FIS-073, 128, 144, 147 | RF-FIS-012, 144 | RF-FIS-012 | RF-FIS-145 | RF-FIS-134..141 |
| M07 COB (cuenta corriente) | RF-COB-001, 078 | RF-COB-001 | RF-COB-001 | RF-COB-075 | RF-COB-001 | RF-COB-001 | RF-COB-001 | RF-COB-019, 177 |
| M08 MOR (mora y corte) | RN-MOR-083 | RF-MOR-100 | RF-MOR-100 | RN-MOR-084 | RN-MOR-085 | HUE-CLO-01 | RN-MOR-086 | NA (sigue a ELE) |
| M09 CRM (solicitud, reclamo, baja) | RF-CRM-066, CU-CRM-02..06 | RF-CRM-066 | RF-CRM-066 | RF-CRM-122 | CU-CRM-01 | RF-CRM-100 | RF-CRM-122 | RF-CRM-100 |
| M10 TEC (factibilidad, OT, red) | RF-TEC-182..193 | RF-TEC-197..214 | RF-TEC-194 | RF-TEC-132..137, 196 | RF-TEC-001..017 | RF-TEC-168..175 | RF-TEC-176..181 | RF-TEC-148..163 |
| M13 STK (equipos y medidores) | RF-STK-072, 074 | RF-STK-044 | RF-STK-072 | RF-STK-044 | RF-STK-044 | — | RF-STK-044 | — |
| M15 CON (contabilidad) | RF-CON-066, 092 | RF-CON-066 | RF-CON-066 | RN-CON-069 | RF-CON-066 | RF-CON-066 | RF-CON-066 | RN-CON-066 |
| M19 POR (landing y portal) | RF-POR-004..011, 054 | RF-POR-009 | RF-POR-009 | RF-POR-069, 103 | RF-POR-107 | RF-POR-104 | RF-POR-069 | RF-POR-079 |
| T06 INT (conectores) | FI-INT-79, 80, 81 | FI-INT-84, 85 | FI-INT-86, 87 | FI-INT-25, 28, 33, 75..77 | FI-INT-25 | — | FI-INT-26, 24 | FI-INT-23, 32 |
| T07 MIG (migración) | RN-MIG-013, 035 | RF-MIG-025 | RN-MIG-035 | RN-MIG-020..022 | RN-MIG-020, 021 | RF-MIG-039 | RF-MIG-039 | RF-MIG-039 |
| T09 COM (avisos) | §9.6 tipos 10–34, 41–57, 62 | §9.6 tipos 41–57 | §9.6 tipos 22–34 | §9.6 tipos 32–40 | §9.6 tipos 35–38 | §9.6 tipo 41 | §9.6 tipos 32–35 | §9.6 tipo 41 |
| T10 BIA (reportes) | RF-BIA-065, 090 | RF-BIA-090 | RF-BIA-090 | RF-BIA-090 | RF-BIA-090 | RF-BIA-090 | RF-BIA-090 | RF-BIA-090 |

## 0.4 Huecos transversales (afectan a varias fichas)

| ID | Hueco | Propuesta | Anexo responsable |
|---|---|---|---|
| HUE-SRV-01 | **Nombres de eventos desalineados** entre consumidor y productor. M02 §12.2 consume `crm.request.admitted`, `crm.request.cancelled`, `tec.feasibility.resolved`, `tec.installation.completed`, `mor.suspension.ordered`, `mor.reconnection.ordered`, `stk.unit.returned` y `fac.cycle.closed`; los productores emiten EVT-CRM-13 `crm.commandRequest.requested`, EVT-TEC-02 `tec.feasibility.verdictIssued`, EVT-TEC-16 `tec.installation.activationConfirmed`, EVT-MOR-12 `mor.interruption.*`, EVT-STK-05 `stk.equipment.retrieved` y EVT-FAC-17 `fac.billingCycle.closed`. T09 §9.6 usa además `crm.request.received`, `cat.service.activated`, `mor.suspension.scheduled`, `mor.service.suspended` y `per.service.terminated`, que ningún productor emite. ESC-MOR-48 usa `int.provisioning.succeeded` y T06 emite EVT-INT-15 `int.network.provisioningResult` (antes `int.network.provisioning-result`). | Tomar como canónico el nombre del **productor** y registrar los demás como alias rechazados en CI (T11 RF-WFL-015). Catálogo de alias: T11 §12.4 y conciliación de nombres consumidos en T11 §12.4.1 (CNC-WFL-001..130), con la regla de CI CTR-WFL-03 (resuelto, HUE-SRV-01). | T11 WFL (catálogo); M02 §12.2 y T09 §9.6 (ajustar consumidores) · **Estado (04-11-2026):** Corregido en anexo: T11 §12.4 y §12.4.1 redactados; M02, T09, M10 y demás consumidores usan el nombre canónico con su EVT-ID. |
| HUE-SRV-02 | M02 CAT no numera sus eventos (§12.1): no existen EVT-CAT. | Numerar EVT-CAT-01..25 en el orden de la tabla actual de M02 §12.1. | M02 CAT · **Estado (04-11-2026):** Corregido en anexo: M02 §12.1 numera EVT-CAT-01..25 (mismo orden que T11) y agrega EVT-CAT-26/27. |
| HUE-SRV-03 | Referencias a un anexo **T05 inexistente**: EVT-TEC-16 lista "Contrato (T05)" como consumidor; DEC-064 lista T05. El contrato vive en M02 CAT. | Reemplazar "T05" por "M02 CAT" en M10 §12; aclarar en DEC-064. | M10 TEC; registro de decisiones · **Estado (04-11-2026):** Corregido en anexo: M10 §12 ya lista M02 como consumidor; T05 de DEC-064 es el modelo de datos vigente. |
| HUE-SRV-04 | **Pantallas del socio duplicadas** entre M19 y los módulos: PAN-CAT-21/22/23 vs PAN-POR-02/03/29/30/31; PAN-FAC-43/44/45 vs PAN-POR-38/39/12; PAN-MED-31/32/33 vs PAN-POR-47/48/49; PAN-TEC-57/58/59 vs PAN-POR-34/35; PAN-STK-40 vs PAN-POR-30; PAN-MOR-39/40/41 vs PAN-POR-46/37. | M19 es dueño de la ruta y la composición en `pwa-socio` y `landing`; el módulo aporta el componente y la API. Las PAN de módulo quedan como "componente embebido en PAN-POR-xx". | M19 POR (con ajuste en M02, M03, M05, M08, M10, M13) · **Estado (04-11-2026):** Corregido en anexo: M19 RF-POR-174, PAN-POR-98..103, §10.6.A; componentes embebidos: M02 PAN-CAT-21..23, M03 PAN-MED-31..33, M05 PAN-FAC-43..45, M08 PAN-MOR-39..41, M10 PAN-TEC-57..59, M13 PAN-STK-40. |
| HUE-SRV-05 | **Precarga demo incompleta e inconsistente**: TEN-001 no habilita CLO, GAS ni ALU (M02 §18), aunque existe la categoría GAS-RES; no hay planes ni categorías demo de CLO ni ALU; INT-100 vale ARS 15.000 de abono y ARS 20.000 de instalación en M02 §18, pero ARS 25.000 y ARS 30.000 en M04 §9.3.9 (ESC-TAR-03). | Un solo *seed* en M02 §18 con los ocho servicios (agregar CLO-RES, ALU-MUN y la capacidad GAS en TEN-001); M04 reutiliza esos valores en sus ejemplos. | M02 CAT (seed); M04 TAR (ejemplos) · **Estado (04-11-2026):** Corregido en anexo: M02 §18 (TEN-001 con CLO-RES, ALU-MUN y GAS-RES); M19 §18.3 INT-100 alineado; M04 §9.3.9, ESC-TAR-03. **Estado (05-11-2026):** ESC-SRV-INT-01 de §1.7 alineado a ESC-TAR-03 (primer comprobante ARS 30.000,00). |
| HUE-SRV-06 | **IDs JOB-COM duplicados** en T09: dos tablas usan JOB-COM-01..24 con nombres distintos (por ejemplo, JOB-COM-18 es `com:generar-comunicaciones` en una y `com:purgar-bandeja` en la otra). | Conservar la tabla del catálogo transaccional y renumerar la segunda desde JOB-COM-34. En este anexo los jobs de T09 se citan **por nombre**. | T09 COM · **Estado (04-11-2026):** Corregido en anexo: T09 §9.12 (JOB-COM-34..41 y nota de equivalencia); T11 §12.8 (JOB-COM-34..41). |
| HUE-SRV-07 | **Parámetro de factibilidad con dos dueños**: PRM-CAT-013 `cat.req.feasibility` (true en INT, ELE, AG, GAS) y PRM-TEC-024 `feasibility.required` (required en Internet y servicios con red). DEC-040 no dice cuál manda; CLO queda en `false` en uno y "con red" en el otro. | PRM-TEC-024 es el dueño (operación técnica); PRM-CAT-013 pasa a ser lectura derivada en la ficha del servicio. | M02 CAT y M10 TEC · **Estado (04-11-2026):** Corregido en anexo: M10 PRM-TEC-024, RF-TEC-011, RN-TEC-005 (dueño; CLO `required`); M02 PRM-CAT-013 (lectura derivada). |
| HUE-SRV-08 | **Informes regulatorios sin ID en T10**: T10 solo define el catálogo genérico (RF-BIA-090); los informes concretos están en M06 (RF-FIS-144..148). | Asignar REP-BIA por informe regulatorio y servicio, enlazados a RF-FIS. Mientras tanto: `[REF-PENDIENTE]` en cada ficha (marcas resueltas al 04-11-2026 con REP-BIA-015 a 024). | T10 BIA con M06 FIS · **Estado (04-11-2026):** Corregido en anexo: T10 REP-BIA-015..024 (§15.5.1), RF-BIA-090; T12 partes 1 y 2 (marcas resueltas). |
| HUE-SRV-09 | **Claves `dict:` de estados y conceptos por servicio** no listadas en T03 (por ejemplo, `dict:cat.domain` aparece en M02 §3 pero no en T03). | T03 publica las claves de estados canónicos, dominios y motivos de baja por servicio. | T03 UXD · **Estado (04-11-2026):** Corregido en anexo: T03 RF-UXD-179, §10.9.12 (estados `estado.servicio.*`, dominios, motivos de baja y `crm.claimType.*`); M02 glosario. |

---

# 1. INT — Internet (primer servicio construido, DEC-005; la cooperativa piloto es LAG, DEC-088; antes citaba DEC-001, que es el stack)

## 1.1 Resumen

| Aspecto | Definición |
|---|---|
| Unidad central | Conexión/contrato por titular; varias conexiones independientes en un mismo domicilio (M02 6.C.1). No medido: admite contratos iguales en la cuenta (PRM-CAT-022, DEC-028). |
| Regulador | ENACOM. Reglamento de Clientes TIC (Res. 733/2017): contratación, información, facturación y reclamos con plazos por motivo (M02 6.C.1; M09 RF-CRM-114). Botón de baja (Res. 316/2018; M09 RN-CRM-008; DEC-057). |
| Perfil de cálculo ProCoop | Perfil "Internet"; tipo 6 `fixed` (M04 RN-TAR-012) con proporcional de alta y baja; abono desde la activación efectiva (RF-TAR-104). Tráfico solo con fuente definida (RN-TAR-230). |
| Olas e hito de salida | **O2** catálogo y contrato: INT-100 publicado con aprobación (DEC-021) y una solicitud admitida crea el contrato `requested` (DEC-011). **O3** activación y equipos: ONT en comodato aplicada y aprovisionamiento confirmado en MikroTik/Radius/SmartOLT (DEC-033, DEC-041, DEC-042). **O4** facturación: primer comprobante con fracción + mes siguiente e instalación, autorizado con CAE (ESC-TAR-03). **O5** cobro: pago online imputado (CU-POR-06). **O6** mora: ciclo de mora del piloto con suspensión restringida y reconexión automática (CU-MOR-03, DEC-014). |

## 1.2 Configuración

**Perfil BASE §84** (M02 6.B; T04 RF-CFG-125 y PAN-CFG-29): las 15 dimensiones del perfil se completan desde M02 PAN-CAT-04 (ficha del servicio). Dimensiones "No aplica" en INT: *Cantidad medida* (sin medidor; RN-TAR-230) y *Lecturas* (RF-POR-104).

| Grupo | Parámetros (valor por defecto) |
|---|---|
| Alta y requisitos | PRM-TEC-024 `feasibility.required` (required; dueño M10) y PRM-CAT-013 `cat.req.feasibility` (true, lectura derivada de PRM-TEC-024; HUE-SRV-07 corregido) · PRM-CAT-017 `cat.req.addressDebtCheck` (warn, DEC-029) · PRM-CAT-022 (contratos iguales en no medidos: true) · PRM-CAT-107 `cat.activation.requireEquipmentAssigned` (true) · PRM-TEC-048 `workOrder.close.requireDeviceSerial` (true) |
| Equipos | PRM-CAT-093 `cat.equipmentDefaultModality` (ámbito servicio; `loan` en INT, DEC-013; alias aceptado `cat.int.equipmentDefaultModality`, HUE-TV-02) · PRM-CAT-094 `cat.int.equipmentReturnDays` (15) · cargo por equipo no devuelto: RF-TAR-115, RN-TAR-246, PRM-TAR-169 (apagado por defecto; HUE-INT-01) |
| Aprovisionamiento | PRM-TEC-041 `provisioning.mikrotik.suspendedProfile` · PRM-TEC-076 `provisioning.deleteUserOnTermination` (false) · PRM-TEC-094 `provisioning.radius.queryOnly` (false) |
| Tarifa | PRM-TAR-012 `tar.inAdvance.firstInvoiceMode` (`fraction_plus_next`) · PRM-TAR-013 `tar.promotion.endNoticeDays` (10) · PRM-CAT-040 `cat.billing.billableStates` (`active, pendingTermination`) · PRM-CAT-083 (mínimo en suspensión: false) |
| Ciclo comercial | PRM-CAT-098 `cat.voluntarySuspension.enabled` (false, DEC-031) · PRM-CAT-099 (90 días) · PRM-CAT-100 `cat.plan.changeEffective` (`nextCycle`, DEC-032) · PRM-CAT-101 (permanencia 0; nunca bloquea la baja) · PRM-CAT-102 `cat.sale.publicCancelButton` (true) |
| Portal y atención | PRM-POR-052 (pago sin login) · PRM-POR-071 (aviso de deuda vencida al contratar) · PRM-CRM-032 (constancia de baja por el mismo medio) |
| Mora | PRM-TEC-069 `dunning.allowWithoutTechnicalNotes` (true) · PRM-MOR-070 (preselección de documentos de la notificación) · PRM-MOR-093 (aviso de composición cambiada) |

**Datos maestros** (orden de carga): servicio INT y concesión (PAN-CAT-03, 04, 26) → producto "Fibra hogar" y conceptos (PAN-CAT-06; DEC-012) → planes INT-100 e INT-300 versionados (PAN-CAT-07; RF-CAT-041) → categorías (PAN-CAT-08) → perfil de red `networkProfileCode` (RF-CAT-099) → sistema de aprovisionamiento y perfiles técnicos (M10 RF-TEC-182, 183; PAN-TEC-36) → equipos de red, OLT y puertos PON (RF-TEC-164, 167; PAN-TEC-35) → artículo ONT serializado (M13 RF-STK-002, 044; PAN-STK-02) → cuadro tarifario y promoción (M04 PAN-TAR-02, 14) → punto de venta fiscal (M06 RF-FIS-033) → política de mora e instancias (M08 PAN-MOR-10, 11) → plantillas (T09 PAN-COM-19).

**Precarga demo ficticia** (M02 §18): TEN-001 "Cooperativa Ejemplo A" con INT publicado; TEN-002 "Cooperativa Ejemplo B" (R14 del plan; antes "Demo Norte" y "Demo Sur") (destino de copia COP-DEMO-001, CU-COP-01 de T04); INT-100 "Fibra 100" (100/50 Mbps, abono ARS 15.000, instalación ARS 20.000, ONT en comodato); INT-300 "Fibra 300" (ARS 22.000); Ana Demo (DNI 00000001); Hermano A / Hermano B (INT-H-A-001, INT-H-B-001); BAJA-DEMO; SUS-DEMO-GRATIS; REACT-DEMO-GRATIS / REACT-DEMO-ARANCEL; ONT-DEMO-0001..0010. Inconsistencia de importes con M04 §9.3.9: ver HUE-SRV-05. Corregido: M04 §9.3.9 y ESC-TAR-03 usan los valores de M02 §18 (primer comprobante ARS 30.000,00).

## 1.3 Recorrido del ciclo de vida

| # | Paso | Anexo | IDs | Notas para construir |
|---|---|---|---|---|
| 1 | Oferta y landing | M19, M02 | RF-POR-004, 005, 006; PAN-POR-02, 03, 04 (con PAN-CAT-23 como componente embebido, HUE-SRV-04); API-CAT-49; `cat.tenantService.published`; DEC-021 | La consulta de cobertura es preliminar: no reemplaza la factibilidad (RN-PER-066). |
| 2 | Solicitud de alta | M09, M19, M02 | RF-CRM-004, 060, 063, 079; RN-CRM-006; RF-POR-056, 061; PAN-POR-31, 32; PAN-CRM-04; CU-SOL-01; API-CAT-33; `cat.contract.requested` (T01); DEC-011; RN-CAT-030 y PRM-CAT-017 (DEC-029) | Al admitir la solicitud se crea el contrato `requested`. La deuda en el domicilio solo advierte. El evento de admisión tiene nombre desalineado (HUE-SRV-01). Corregido: el nombre canónico y su alias están en T11 §12.4. |
| 3 | Factibilidad | M10 | RF-TEC-001, 002, 003, 007, 008, 010, 011, 012, 017; RN-CAT-026; PAN-TEC-01, 02, 59; EVT-TEC-01, 02; JOB-TEC-14; DEC-040 | Vigencia de 90 días y uso único (RF-TEC-010; PA-TEC-05). Recurso propuesto: puerto PON libre (RF-TEC-167). Obra: no aplica en el piloto. |
| 4 | Alta del contrato | M02 | §8.2 T01–T03; RF-CAT-041, 051; RN-CAT-064; PAN-CAT-13, 14, 15, 16; API-CAT-33, 35; `cat.contract.feasibilityRequested`, `cat.contract.installationRequested` | `feasibility` → `pendingInstallation` solo con dictamen favorable. Sin titular, cuenta, plan vigente y grupo de facturación no se activa (RN-CAT-064). |
| 5 | Instalación y equipos | M10, M13, M19 | RF-TEC-085..092, 097, 098, 101; EVT-TEC-12, 13, 15; PAN-TEC-25, 50, 51; RF-STK-059, 062, 063, 072, 074; RN-STK-014, 017, 018; RN-CAT-061; PAN-STK-38; EVT-STK-04; RF-CAT-079; PAN-CAT-19; API-CAT-37, 38; RF-POR-072..077; PAN-POR-34, 35, 36; DEC-013, DEC-039 | La ONT sale de la custodia del instalador al domicilio del socio con constancia de comodato. Visita fallida: el equipo queda en custodia y no se factura (RF-TEC-098). Cierre de OT en dos pasos (DEC-039). |
| 6 | Aprovisionamiento | M10, T06 | RF-TEC-182..188, 192; RF-TEC-093; JOB-TEC-06, 11; EVT-TEC-16, 21; PAN-TEC-36, 37, 38; FI-INT-79, 80, 81; EVT-INT-15; JOB-INT-01, 02; PRM-CAT-107; DEC-033, DEC-041, DEC-042; CU-TEC-04 | `activate` asíncrono e idempotente; el hito de activación (`cat.contract.activated`, T06 de M02) espera la confirmación. Si falla, hay respaldo manual al NOC (RF-TEC-188). |
| 7 | Medidor y lecturas | — | **No aplica** (RN-TAR-230; RF-TEC-193; RF-POR-104) | Sin medición de tráfico salvo fuente definida y regla tarifaria explícita. |
| 8 | Tarifa | M04, M11 | RF-TAR-104; RN-TAR-012 (tipo 6), RN-TAR-230; PAN-TAR-02, 14, 15, 17; EVT-TAR-010, 011, 012; JOB-TAR-03, 11; ESC-TAR-03; RF-VEN-011; DEC-016 | Primer comprobante: fracción + mes siguiente + instalación (DEC-016). La promoción consume ciclos al emitir. Posible doble aviso de fin de promoción: ver HUE-INT-02. Corregido: JOB-TAR-11 es dueño y JOB-CAT-10 solo reacciona a EVT-TAR-012. |
| 9 | Facturación | M05 | RF-FAC-002, 020, 029, 064, 065; JOB-FAC-01, 02, 03, 04, 06; EVT-FAC-07, 14; PAN-FAC-05, 07, 08, 10; DEC-034, DEC-037, DEC-061 | Factura separada por servicio (DEC-034). No se emite en cero (DEC-037). Capital social en un renglón identificado (DEC-061). |
| 10 | Fiscal y regulador | M06, T06 | RF-FIS-033, 034, 051, 065; EVT-FIS-01, 02, 07; FI-INT-01, 02, 03; RF-FIS-146; DEC-018, DEC-035, DEC-038, DEC-053, DEC-054 | CAE por WSFEv1; ante caída de ARCA se emite, se encola y se pausa solo la autorización (DEC-038). La configuración ENACOM vive en RF-FIS-146 (PA-FIS-13). |
| 11 | Cuenta corriente y cobro | M07, M19, T06 | RF-COB-001, 026, 032, 078, 132, 152; EVT-COB-01, 02, 04; RF-POR-089, 100; PAN-POR-38..42; CU-POR-05, 06, 07; FI-INT-43, 44; EVT-INT-08; DEC-048, DEC-049, DEC-051 | Una obligación por servicio y comprobante. Al confirmar el cobro se dispara la evaluación de reconexión en M08 (RF-COB-078). |
| 12 | Mora, corte y reconexión | M08, M10 | RF-MOR-073, 075, 100, 118..124, 130; RN-MOR-083, 092, 094, 101; PAN-MOR-10, 11, 13, 14, 19, 20, 27; JOB-MOR-02, 03, 04, 07, 18; EVT-MOR-08, 12, 13; RF-TEC-132, 134, 135, 187; EVT-TEC-18, 19, 21; PRM-TEC-041; CU-MOR-03, 05; PA-MOR-05, 06, 10, 11, 12; DEC-014 | Suspensión `restricted` (perfil de velocidad reducida) o `interrupted`. Pagar antes de la ejecución cancela la orden (RF-MOR-121). La reconexión automática solo aplica a casos de mora (RF-MOR-123). |
| 13 | Reclamos | M09, M10 | RF-CRM-100, 101, 105, 107, 108, 114; RN-CRM-031; EVT-CRM-01, 05, 08, 16; JOB-CRM-01, 05; PAN-CRM-03, 04, 07, 08; CU-CRM-03, 14; RF-TEC-166, 192; EVT-TEC-24; JOB-TEC-07; DEC-056 | Un incidente de zona (nodo u OLT caído) agrupa casos y notifica en forma masiva. El diagnóstico se consulta con `query` desde la ficha (RF-TEC-192). |
| 14 | Cambios | M09, M02, M10, M13 | Plan: RF-CRM-072, CU-CRM-04, RF-CAT-081, `cat.contract.planChanged`, RF-TEC-187 (`changePlan`), DEC-032. Titular: RF-CRM-071, CU-CRM-05, `cat.contract.transferred`, DEC-045. Traslado: RF-CRM-073, CU-CRM-06, CU-TEC-06, `cat.contract.addressChanged`. Equipo: EVT-STK-06, RF-TEC-090. Suspensión voluntaria: RF-MOR-133, RF-MOR-211, PAN-POR-37 (con PAN-MOR-41 como componente embebido, HUE-SRV-04), PRM-CAT-098 (DEC-031) | El cambio de plan rige el próximo período; inmediato con prorrateo solo si el tenant lo habilita. El traslado exige nueva factibilidad. |
| 15 | Baja | M09, M19, M02, M10, M13 | RF-CRM-061, 066, 067, 075, 083; RN-CRM-007, 008, 010, 015; EVT-CRM-14, 15; JOB-CRM-06; RF-POR-009, 010, 011, 065; PAN-POR-09, 10, 11, 37, 91; EVT-POR-09, 10, 11; CU-CRM-02, CU-POR-04, CU-MOR-10; RF-CAT-088; RN-CAT-039; `cat.contract.terminationRequested`, `cat.contract.terminated`; RF-TEC-099; EVT-STK-05, 07, 08; JOB-CAT-09; PRM-CAT-094; PRM-TEC-076; RN-MOR-100, 104; ESC-TAR-26; DEC-057 | Sin cargo, sin exigir pago ni registro, con código en 24 h. Devolver el router no equivale a baja procesada (M02 6.C.1). Reactivar un contrato cerrado exige un alta nueva (RN-MOR-104). |
| 16 | Portal del socio | M19, M13 | RF-POR-050, 054, 055, 062, 071, 174; PAN-POR-25, 29, 30, 33, 37; RF-STK-079; PAN-STK-40 (componente embebido en PAN-POR-30); CU-POR-17 | El portal nunca muestra "Activo" o "Dado de baja" antes del evento del módulo dueño (RF-POR-071). M19 es dueño de las rutas; PAN-CAT-21/22 son componentes embebidos en PAN-POR-31 y PAN-POR-29/30 (HUE-SRV-04 corregido; antes "las pantallas se duplican"). |
| 17 | Comunicaciones | T09, T06 | §9.6 tipos 10, 11, 12–15, 22–30, 32–34, 41, 44, 45, 47, 53–57, 62; jobs `com:generar-comunicaciones` y `com:despachar` (HUE-SRV-06); FI-INT-63; DEC-055 | Los avisos regulatorios de mora (tipos 53–56) exigen evidencia de entrega; sin evidencia no hay suspensión (ESC-MOR-16). |
| 18 | Reportes | T10, M06, M09 | RF-BIA-065, 090; RF-FIS-146, 148; PAN-CRM-34; REP-BIA-015 Informe ENACOM de Internet (T10 §15.5.1; antes `[REF-PENDIENTE]`, HUE-SRV-08) | Indicadores de reclamos TIC por motivo y plazo (RF-CRM-114, 120). |
| 19 | Contabilidad | M15, M13 | RF-CON-066, 074, 092, 093; RN-CON-036; RF-STK-094, 095; DEC-069 | El comodato se valoriza en stock (DEC-013); durante la convivencia la contabilidad oficial sigue en ProCoop (DEC-069). |
| 20 | Migración | T07, M02 | RF-MIG-032, 039, 054; RN-MIG-004, 006, 013, 017, 035; PAN-MIG-14; M02 §19 (`SERSOC`, `INTERNET`, `MIKROTIK`, `CATE_SER_EXTRAS.PERFIL_MIKROTIK`, `SERSOC_PRODUCTOS`); DEC-068, DEC-070 | Las credenciales de `MIKROTIK` no se migran en claro: se recargan en la bóveda (RN-MIG-013). El comodato se migra como equipo asignado (RN-MIG-035). |

## 1.4 Reglas críticas

- **RN-CAT-026**: sin factibilidad aprobada no se pasa de `feasibility` a `pendingInstallation`.
- **RN-CAT-064**: no hay `active` sin titular, cuenta, plan vigente, grupo de facturación y requisitos del perfil.
- **RN-CAT-061**: el comodato solo asigna una unidad serializada disponible en la custodia del técnico.
- **RN-STK-018**: una unidad está aplicada a un solo contrato a la vez.
- **RN-TAR-230**: el abono por velocidad no convierte GB en cargo sin fuente y regla.
- **RN-MOR-083**: la suspensión por mora de INT es una restricción o un corte vía aprovisionamiento remoto.
- **RN-MOR-092**: la reconexión automática alcanza solo a servicios suspendidos por un caso de mora.
- **RN-MOR-101**: los costos de suspensión o reactivación requieren una regla habilitada y aprobada.
- **RN-CRM-007 / RN-CRM-008**: la baja no genera cargo ni exige pago o registro; el botón de baja es público y visible.
- **RN-CRM-004**: aprobar la solicitud no equivale a servicio instalado.
- **RN-MOR-104**: reactivar un contrato INT cerrado exige un alta nueva.

## 1.5 Pantallas

| App | Pantallas |
|---|---|
| landing | PAN-POR-01, 02, 03, 04, 09, 10, 11, 12 (PAN-CAT-23 es componente embebido en PAN-POR-02/03, HUE-SRV-04); PAN-TAR-24 |
| pwa-socio | PAN-POR-25, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 50, 51; PAN-TAR-23. Componentes embebidos, sin ruta propia (HUE-SRV-04): PAN-STK-40 en PAN-POR-30, PAN-MOR-39 en PAN-POR-46, PAN-MOR-41 en PAN-POR-37 |
| admin | PAN-CAT-03, 04, 07, 13, 14, 15, 16, 19; PAN-TEC-01, 02, 04, 05, 10, 11, 25, 35, 36, 37, 38; PAN-STK-11, 12, 14, 17, 18; PAN-TAR-02, 14, 15, 17; PAN-FAC-05, 07, 08, 10; PAN-MOR-10, 11, 19, 20, 27; PAN-CRM-02, 03, 04, 07, 08; PAN-POR-91 |
| pwa-campo | PAN-TEC-50, 51, 52, 53; PAN-STK-38 |

## 1.6 Eventos y jobs

| Tipo | Elementos |
|---|---|
| Emitidos en el recorrido | `cat.contract.requested` → `cat.contract.installationRequested` → EVT-TEC-12, 15 → EVT-STK-04 → EVT-TEC-21 → EVT-TEC-16 → `cat.contract.activated` → EVT-TAR-010/011 → EVT-FAC-07 → EVT-FIS-01 → EVT-COB-01 → EVT-COB-04 → EVT-MOR-12/13 → EVT-TEC-18/19 → EVT-CRM-14 → `cat.contract.terminated` → EVT-STK-05 |
| Jobs | JOB-TEC-06 `tec:aprovisionar`; JOB-TEC-11 `tec:conciliar-aprovisionamiento`; JOB-INT-01, 02; JOB-TAR-03, 11; JOB-FAC-01..04, 06; JOB-MOR-02, 03, 04, 07, 18; JOB-CRM-05, 06; JOB-CAT-09 (devoluciones vencidas), JOB-CAT-10 (fin de promociones) |

## 1.7 Escenarios

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| ESC-SRV-INT-01 | TEN-001 con INT-100 (valores del *seed* único de M02 §18 que usa el ejemplo M04 §9.3.9: abono ARS 15.000, promoción PROMO-INT-50x3 = 50 % sobre el abono × 3 ciclos, instalación ARS 20.000 sin descuento, mes adelantado, PRM-TAR-012 = `fraction_plus_next`, PRM-TAR-016 = `false`) y Ana Demo con factibilidad favorable | La ONT-DEMO-0001 se aplica, SmartOLT confirma `activate` y la activación queda el 21-11-2026 | El contrato pasa a `active` con `effectiveStart` 21-11-2026; el primer comprobante (diciembre) suma ARS 30.000,00 neto (fracción de noviembre 15.000 × 10/30 = 5.000,00 − 2.500,00 + diciembre 15.000,00 − 7.500,00 + instalación 20.000,00; RN-TAR-240 a 242), el ciclo parcial no consume promoción y obtiene CAE (ESC-TAR-03, DEC-016, DEC-033). Corrección del 05-11-2026 (HUE-SRV-05): antes decía "abono ARS 25.000, promoción 10 % × 3 ciclos, instalación ARS 30.000 … ARS 60.000,00 neto (fracción 8.333,33 − 833,33 + 25.000 − 2.500 + 30.000)", valores de BASE que M04 conserva solo como casos de prueba de RN-TAR-241 y RN-TAR-245. |
| ESC-SRV-INT-02 (error) | Contrato de Ana en `pendingInstallation` con la OT cerrada en campo | SmartOLT responde `timeout` tres veces | EVT-TEC-21 `tec.provisioning.failed`; el contrato **no** se activa ni se factura; se crea una tarea manual para el NOC (RF-TEC-188); el socio ve "Instalación realizada – activación en curso" (RF-POR-071; CU-TEC-04). |
| ESC-SRV-INT-03 | SUS-DEMO-GRATIS suspendido en modo `restricted` por una deuda vencida de ARS 15.000 | Se confirma un pago de ARS 15.000 por Pagos360 (EVT-COB-04) | JOB-MOR-07 evalúa la reconexión, M10 emite `reactivate` y el contrato vuelve a `active` sin cargo (REACT-DEMO-GRATIS); si T06 falla, el caso queda `executionFailed` con reintentos y el contrato sigue `suspended` (ESC-MOR-21, 22). |
| ESC-SRV-INT-04 | BAJA-DEMO activo con deuda ficticia de ARS 12.500 | El titular pide la baja por el botón público, sin iniciar sesión | Recibe el código en pantalla y por correo en menos de 24 h; no se exige el pago ni se crea un cargo; se emite `cat.contract.terminationRequested`, OT de retiro de la ONT con plazo de 15 días (PRM-CAT-094); la deuda sigue en M07 (ESC-CRM-04, ESC-MOR-27, DEC-057). |
| ESC-SRV-INT-05 | Ana con INT-100 (ARS 15.000) desde agosto, ciclo mensual | Pide el cambio a INT-300 (ARS 22.000) el 10-11-2026 | `cat.contract.planChanged` con `validFrom` 01-12-2026 (DEC-032); M10 emite `changePlan` con fecha efectiva; noviembre se factura ARS 15.000 y diciembre ARS 22.000. |
| ESC-SRV-INT-06 (aislamiento) | Un operador de TEN-002 con permiso `cat.contratos.ver` | Consulta por ID el contrato INT de Ana (TEN-001) y la ONT-DEMO-0001 | 404 sin revelar existencia; los jobs `tec:aprovisionar` de TEN-002 no leen comandos de TEN-001; una copia COP-DEMO-001 lleva la configuración pero ni contratos ni precios aprobados (ESC-TEC-25, ESC-TAR-21, ESC-MOR-45). |
| ESC-SRV-INT-07 (error) | Hermano A con deuda ficticia en DIR-CASA-001 | Hermano B solicita INT en el mismo domicilio | Se advierte la deuda del domicilio sin bloquear ni trasladarla (DEC-029; RN-CAT-030); el contrato de B se crea independiente (ESC-03 de M02). |

## 1.8 Preguntas abiertas

| PA | Tema | Estado |
|---|---|---|
| PA-CAT-01, 10, 14, 15, 16 | Contrato al admitir, comodato, suspensión voluntaria, cambio de plan, hito de activación | Respondidas (DEC-011, 013, 031, 032, 033) |
| PA-TEC-02, 04, 09, 10 | Hito, factibilidad, aprovisionamiento, sistemas de red | Respondidas (DEC-033, 040, 041, 042) |
| PA-TEC-05, 06, 07, 08 | Vigencia de factibilidad, visita fallida, firma, encuesta | Asumidas (DEC-072) |
| PA-CRM-06, 09, 15 | WhatsApp, IA, botón de baja | Respondidas (DEC-055, 056, 057) |
| PA-MOR-05, 06, 10, 11, 12 | Instancias del piloto, preaviso, ventanas, deuda para reconectar, cargos | Asumidas (DEC-072) |
| PA-FIS-13 | Informes ENACOM | Asumida (DEC-072) |
| PA-FAC-19 | Caída de ARCA | Respondida (DEC-038) |

## 1.9 Huecos

| ID | Hueco | Propuesta | Anexo |
|---|---|---|---|
| HUE-INT-01 | Ningún anexo define el **plazo de devolución y el cargo por no devolución** de la ONT con importe y aprobación de punta a punta: M13 tiene EVT-STK-07/08 y M02 PRM-CAT-094, pero M04 no tiene el concepto ni la regla de cargo. | Agregar en M04 un cargo por evento "equipo no devuelto", deshabilitado por defecto y aprobado por M08 (RN-MOR-101). | M04 TAR · **Estado (04-11-2026):** Corregido en anexo: M04 RF-TAR-115, RN-TAR-246, PRM-TAR-169, ESC-TAR-31; T11 EVT-STK-07/08 (consumidor M04). |
| HUE-INT-02 | Dos jobs para el fin de promociones: JOB-CAT-10 (M02) y JOB-TAR-11 `tar:aviso-fin-promociones` (M04). | M04 es dueño de la promoción (EVT-TAR-012); JOB-CAT-10 solo actualiza el tramo del contrato al recibir EVT-TAR-012. | M02 CAT y M04 TAR · **Estado (04-11-2026):** Corregido en anexo: JOB-TAR-11 (M04) es dueño; JOB-CAT-10 reacciona a EVT-TAR-012 (T11 §12.9). |
| HUE-INT-03 | Los plazos de respuesta de reclamos TIC por motivo (Res. 733/2017) no tienen un PRM con valores: RF-CRM-114 solo marca los campos. | Precargar `slaPolicies` ENACOM en M09 (PAN-CRM-14) como plantilla de plataforma. | M09 CRM · **Estado (04-11-2026):** Corregido en anexo (parcial): M09 RF-CRM-258, PRM-CRM-132, §18.1; pendiente: validación legal de los plazos ENACOM (el RF quedó en O3, con RF-CRM-103). · **Estado (05-11-2026):** Corregido en anexo (parámetro con default propuesto; requiere validación legal): M09 RF-CRM-258, PRM-CRM-132 (plantilla ENACOM), PRM-CRM-135 `crm.sla.enacomTargets` (plazos por motivo, §18.1). Antes: parcial, pendiente validación legal de los plazos ENACOM. |
| HUE-SRV-01, 04, 05, 06, 07, 08 | Ver §0.4 | — | — |

---

# 2. TEL — Telefonía (fija, móvil revendida, pack SMS, prepaga)

## 2.1 Resumen

| Aspecto | Definición |
|---|---|
| Unidad central | Línea/número asignado a un contrato, con vigencia usada para atribuir llamadas (M02 6.C.2; M10 RF-TEC-201). |
| Regulador | ENACOM: servicio TIC, plan de numeración (RF-TEC-204) e informes (M06 RF-FIS-146). Botón de baja obligatorio también en telefonía (DEC-057). |
| Perfil de cálculo ProCoop | Perfil "Teléfono". Tipo 5 `phone`: suma de llamadas tasadas (RN-TAR-082; RN-CAT-075). Tipo 14 `mobile_phone`: telefonía móvil con importe fijo y conceptos del proveedor (RN-TAR-099). Tipo 16 `sms_pack` (RN-TAR-012). |
| Olas e hito de salida | **O2** catálogo y contrato con TEL-BAS publicado. **O4** abono: la línea se factura con abono fijo y renglón en 0 opcional sin llamadas (PRM-TAR-080). **O10** CDR y tasación: importación de CDR deduplicada, atribuida y tasada; se factura la suma y se liquida CPP (RF-TEC-205..211; RF-TAR-097..099). |

## 2.2 Configuración

**Perfil BASE §84** (M02 6.B; T04 RF-CFG-125). "No aplica": *Medidor y lecturas* (el consumo proviene del CDR, no de un medidor de M03).

| Grupo | Parámetros |
|---|---|
| Catálogo | PRM-CAT-090 `cat.tel.freeCallsZeroRate` (true) · PRM-CAT-091 `cat.tel.cppConcept` y PRM-CAT-092 `cat.tel.internationalConcept`: solo lectura, alias de PRM-TAR-081/082 de M04, que es el dueño (RN-TAR-083; HUE-TEL-03 corregido; antes "se superponen con PRM-TAR-081") |
| Técnica | PRM-TEC-097 `phone.callDetailServiceId` · PRM-TEC-100 `phone.virtualExchangeServiceId` · PRM-TEC-101 `phone.prepaidEnabled` · PRM-TEC-102 `phone.prepaidTopUpOperationTypeId` · PRM-TEC-108 `cdr.dedupeOnImport` · PRM-TEC-110 `cdr.telcoIpKey99ZeroAmount` · PRM-TEC-024 (factibilidad en telefonía fija con red) |
| Tarifa | PRM-TAR-080 `tar.phone.zeroLineWhenNoCalls` (false) · PRM-TAR-081 `tar.phone.cppConceptId` · PRM-TAR-082 `tar.phone.internationalConceptId` · PRM-TAR-084..091 (internacionales, plan por defecto, prepago, central virtual, mínimo por llamada, Telco IP; citados en RN-TAR-083..094) |
| Ciclo comercial | PRM-CAT-098 (false), PRM-CAT-100 (`nextCycle`), PRM-CAT-102 (true) |

**Datos maestros**: servicio TEL, modalidad (fija/móvil) y servicio telefónico (RF-CAT-098; PAN-CAT-04) → planes TEL-BAS y pack SMS (PAN-CAT-07) → red física: centrales, puertos, repartidores, regletas y cajas (RF-TEC-197, 198; PAN-TEC-42) → prefijos, pool de números y plan de numeración ENACOM (RF-TEC-200, 204; PAN-TEC-43) → planes tarifarios, bandas, fracciones, claves y planes de descuento (RF-TAR-097; PAN-TAR-19) → conceptos CPP e internacionales → lectores de CDR por central (RF-TEC-205; FI-INT-84) → importador de operador móvil (RF-TEC-210; FI-INT-85).

**Precarga demo ficticia**: TEL-BAS "Línea básica con conceptos CPP e internacional" (M02 §18); central CEN-DEMO-01, repartidor REP-DEMO-01, regleta REG-DEMO-01 de 10 posiciones, prefijo 0000, números 0000-400100 a 0000-400199 y `cdr-demo.csv` con 50 llamadas sintéticas (M10 §18). No hay importes demo de TEL-BAS ni del plan tarifario (HUE-SRV-05). Estado: M02 §18 es el seed único de los ocho servicios (HUE-SRV-05 corregido); los importes de TEL-BAS se toman de ahí.

## 2.3 Recorrido del ciclo de vida

| # | Paso | Anexo | IDs | Notas para construir |
|---|---|---|---|---|
| 1 | Oferta y landing | M19, M02 | RF-POR-004, 005; PAN-POR-02, 03 (PAN-CAT-23 como componente embebido, HUE-SRV-04); `cat.tenantService.published`; DEC-021 | La cobertura de telefonía fija depende de cajas con posiciones libres (RF-TEC-198). |
| 2 | Solicitud | M09, M19 | RF-CRM-004, 060, 063; RF-POR-056, 061; PAN-POR-31, 32; DEC-011; `cat.contract.requested` | La telefonía móvil revendida no requiere visita: la solicitud deriva en una operación administrativa. |
| 3 | Factibilidad | M10 | RF-TEC-001, 007, 008, 011; PRM-TEC-024; EVT-TEC-01, 02; DEC-040 | Solo en telefonía fija: posición de caja y par disponibles. **No aplica** en móvil y pack SMS. |
| 4 | Alta del contrato | M02 | §8.2 T01–T03; RF-CAT-098; RN-CAT-064; PAN-CAT-14, 15; API-CAT-33 | El número forma parte del contrato con fechas y plan tarifario (RF-CAT-098). |
| 5 | Instalación y numeración | M10, M13 | RF-TEC-085, 089, 091; RF-TEC-198, 200, 201, 202; PAN-TEC-43, 44; EVT-TEC-31 `tec.phoneLine.changed`; RF-STK-044 (terminal o SIM serializado, si se entrega) | Se reserva el número en la OT abierta (RF-TEC-202) y la línea se abre con la fecha efectiva de activación. |
| 6 | Aprovisionamiento | M10, T06 | RF-TEC-185, 194; FI-INT-84; EVT-TEC-16; `cat.contract.activated` | Hito: línea activa en la central (M02 6.C.2). La mayoría de las centrales no tiene API: registro manual autorizado (RF-TEC-188). |
| 7 | Tasación (consumo) | M10, M04, T06 | RF-TEC-205..211, 214; RN-TEC-103; JOB-TEC-09 `tec:importar-cdr`; EVT-TEC-27 `tec.cdr.attributed`; JOB-INT-23 `int:recibir-cdr`; EVT-INT-16; RF-TAR-097, 098, 099; RN-TAR-084..097; JOB-TAR-09, 10; EVT-TAR-019; CU-TEC-10; CU-TAR-09; PAN-TEC-45; PAN-TAR-19, 20 | Deduplicación por (origen, destino, fecha, segundos); el origen se atribuye a la línea vigente a la fecha. JOB-TAR-09 espera `tec.cdr.imported` (HUE-SRV-01). Importación con dos dueños (HUE-TEL-01). Ambos corregidos: alias en T11 §12.4; T06 solo recibe (JOB-INT-23 `int:recibir-cdr`) y M10 parsea y atribuye (JOB-TEC-09). |
| 8 | Tarifa | M04 | RN-TAR-012 (tipos 5, 14, 16), RN-TAR-082, 083, 089, 091, 092, 098, 099; PRM-TAR-080, 081; PAN-TAR-15, 17 | CPP (clave 100) al concepto CPP; internacionales al suyo; gratuitos en cero (PRM-CAT-090). |
| 9 | Facturación | M05 | RF-FAC-065, 121, 124; JOB-FAC-01..04; EVT-FAC-07; PAN-FAC-10 | Móvil revendido: importación PR1 por línea (RF-FAC-121, 124). El detalle de llamadas se imprime desde la ficha (M02 6.C.2). |
| 10 | Fiscal y regulador | M06 | RF-FIS-033, 051, 146; EVT-FIS-01; DEC-038 | La liquidación CPP/CVLP a operadoras la calcula M04 (RN-TAR-098) y la factura M05. Informes ENACOM: PA-FIS-13. |
| 11 | Cuenta corriente y cobro | M07, M19 | RF-COB-001, 152; EVT-COB-01, 04; PAN-POR-38..41 | Prepaga: la recarga de minutos se vende por OT/operación (RF-TEC-203) y se cobra en M07 (RF-COB-075). |
| 12 | Mora, corte y reconexión | M08, M10 | RF-MOR-073, 100, 118, 121, 122, 130; EVT-MOR-12, 13; RF-TEC-132, 134; EVT-TEC-18, 19 | Suspensión = "línea bloqueada saliente" mapeada a `suspended/restricted` (M02 6.C.2). No hay una regla propia equivalente a RN-MOR-083 (HUE-TEL-04). Corregido: RN-MOR-137 (bloqueo saliente; entrantes y emergencias siempre habilitadas), RF-MOR-222, PRM-MOR-199; requiere validación legal. |
| 13 | Reclamos | M09, M10 | RF-CRM-100, 101, 114; CU-CRM-03 (patrón de incidente de zona); EVT-TEC-24 | Reclamo de facturación de llamadas: excluye el documento de la mora mientras está abierto (ESC-MOR-23). |
| 14 | Cambios | M09, M02, M10 | Plan tarifario: RF-CRM-072, `cat.contract.planChanged`, DEC-032. Número: EVT-TEC-31, RF-TEC-201. Titular: RF-CRM-071, DEC-045. Traslado: RF-CRM-073, RF-TEC-198 | Cambiar el número cierra la línea anterior conservando el historial de atribución (RF-TEC-201). |
| 15 | Baja | M09, M19, M10 | RF-CRM-061, 066, 067; RN-CRM-007, 008; RF-POR-009..011; EVT-CRM-14; RF-TEC-200; `cat.contract.terminated`; DEC-057 | El número pasa a "en cuarentena" (RF-TEC-200; M02 6.C.2); la última factura incluye las llamadas hasta la fecha efectiva de baja. |
| 16 | Portal del socio | M19 | RF-POR-054, 055, 079; PAN-POR-29, 30, 39 | No existe una vista de detalle de llamadas para el socio (HUE-TEL-02). Corregido: RF-POR-175, PAN-POR-103 y API-POR-122 de M19, con RF-TEC-237/API-TEC-55 (llamadas) y RF-TAR-120/API-TAR-067 (tasación). |
| 17 | Comunicaciones | T09 | §9.6 tipos 10, 11, 12–14, 41, 44, 45, 47, 53–57, 62 | Sin aviso específico de consumo telefónico alto. |
| 18 | Reportes | M10, T10, M06 | RF-TEC-213; REP-TEC-22; RF-FIS-146; RF-BIA-090; REP-BIA-016 Informe ENACOM de telefonía (T10 §15.5.1; antes `[REF-PENDIENTE]`, HUE-SRV-08) | Informes CNC (llamadas y categorías) y números en central (RF-TEC-213). |
| 19 | Contabilidad | M15 | RF-CON-066, 092 | La compra de minutos y CPP a operadoras es costo (M12/M15). |
| 20 | Migración | T07, M02 | RF-MIG-025 (`CENTRALT` vs `TEL_CENTRAL`), RF-MIG-039, RF-MIG-060; RN-MIG-005; M02 §19 (`TEL_SERSOC`, `TEL_SERVICIO`, `TEL_MODALIDAD`, `SERTEL`, `TEL_NUMEROS`) | Las llamadas no facturadas del período abierto se migran vivas; el resto queda como histórico de solo lectura (RF-MIG-060). |

## 2.4 Reglas críticas

- **RN-CAT-075**: el contrato telefónico factura la suma de llamadas tasadas; sin llamadas, renglón en 0 solo si el parámetro lo indica.
- **RF-TEC-201**: un número no puede estar en uso por otro servicio en la misma fecha.
- **RN-TAR-084**: el origen se atribuye a la línea vigente a la fecha de la llamada; el destino, al prefijo más largo.
- **RN-TAR-086**: la clave del CDR, si viene distinta de 0, se respeta.
- **RN-TAR-091**: destino gratuito ⇒ importe 0; misma central virtual ⇒ tipo interno.
- **RN-TAR-096 / RN-TEC-103**: solo se retasan y revierten llamadas no agrupadas ni facturadas.
- **RN-TAR-098**: la liquidación CPP/CVLP a la operadora se agrupa por condición de IVA y alícuota.
- **RN-CRM-008**: el botón de baja también rige para telefonía (DEC-057).

## 2.5 Pantallas

| App | Pantallas |
|---|---|
| landing | PAN-POR-02, 03, 09, 10, 11 |
| pwa-socio | PAN-POR-29, 30, 37, 38, 39, 40 |
| admin | PAN-CAT-04, 07, 14; PAN-TEC-42, 43, 44, 45, 46, 47; PAN-TAR-15, 17, 19, 20; PAN-FAC-10 |
| pwa-campo | PAN-TEC-50, 51 |

## 2.6 Eventos y jobs

| Tipo | Elementos |
|---|---|
| Eventos | `cat.contract.activated`; EVT-TEC-31 `tec.phoneLine.changed`; EVT-INT-16 `int.cdr.batchReceived` (antes `int.cdr.batch-received`); EVT-TEC-27 `tec.cdr.attributed`; EVT-TEC-28 `tec.mobileUsage.imported`; EVT-TAR-019 `tar.calls.rated`; EVT-FAC-07; EVT-COB-04; EVT-MOR-12/13; `cat.contract.terminated` |
| Jobs | JOB-INT-23 `int:recibir-cdr`; JOB-TEC-09 `tec:importar-cdr`; JOB-TAR-09 `tar:tasar-llamadas`; JOB-TAR-10 `tar:retasar`; JOB-FAC-01..04 |

## 2.7 Escenarios

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| ESC-SRV-TEL-01 | Línea 0000-400101 de TEL-BAS con abono ficticio de ARS 8.000 y PRM-TAR-080 = false (ola O4, sin CDR) | Se emite el ciclo de noviembre sin llamadas | El comprobante tiene un solo renglón de abono por ARS 8.000 y ningún renglón de llamadas (RN-CAT-075). |
| ESC-SRV-TEL-02 | Plan ficticio con banda A a ARS 10 por minuto hasta las 00:00 y banda B a ARS 5 por minuto después | Se tasa una llamada local de 23:50 a 00:20 | Dos tramos: 10 min × 10 = ARS 100 y 20 min × 5 = ARS 100; neto ARS 200 con versión del plan en la traza (ESC-TAR-28). |
| ESC-SRV-TEL-03 (error) | `cdr-demo.csv` contiene una llamada con origen 0000-400199, número sin línea vigente a la fecha | Se ejecuta JOB-TEC-09 | La llamada queda como "origen no encontrado" (RF-TEC-207), no se tasa ni factura y aparece en el informe de no asignadas (RF-TEC-213). |
| ESC-SRV-TEL-04 | El mismo `cdr-demo.csv` ya fue importado | Se vuelve a importar el archivo | La deduplicación (RF-TEC-206; PRM-TEC-108) no crea llamadas nuevas ni tasa dos veces; el resultado informa 50 duplicadas. |
| ESC-SRV-TEL-05 | Línea 0000-400102 con baja confirmada el 15-11-2026 | Se intenta asignar el número a otro contrato el 20-11-2026 | Se rechaza: el número está en cuarentena (RF-TEC-200); las llamadas del 1 al 15 de noviembre se facturan en la factura final. |
| ESC-SRV-TEL-06 (aislamiento) | Un usuario de TEN-002 con `tec.cdr.importar` (antes `tec.cdr.import`) | Importa un CDR cuyos orígenes coinciden con números de TEN-001 | Ninguna llamada se atribuye a líneas de TEN-001; todas quedan "origen no encontrado" en TEN-002; consultar una llamada de TEN-001 por ID devuelve 404. |
| ESC-SRV-TEL-07 | Línea móvil revendida con factura del proveedor de ARS 9.500 (abono 7.000 + excedente 2.500) | Se importa el archivo PR1 del período | Renglones de abono y excedente en el comprobante del socio por ARS 9.500 con los conceptos del proveedor (RF-FAC-124; RN-TAR-099). |

## 2.8 Preguntas abiertas

| PA | Tema | Estado |
|---|---|---|
| PA-TEC-13 | Formatos de CDR prioritarios | Asumida (DEC-072) |
| PA-TEC-14 | Telefonía móvil Claro/Personal | Asumida (DEC-072) |
| PA-FIS-13 | Informes ENACOM | Asumida (DEC-072) |
| PA-CRM-15 | Botón de baja | Respondida (DEC-057) |

## 2.9 Huecos

| ID | Hueco | Propuesta | Anexo |
|---|---|---|---|
| HUE-TEL-01 | **Importación de CDR con dos dueños**: JOB-INT-23 `int:importar-cdr` (T06) y JOB-TEC-09 `tec:importar-cdr` (M10). | T06 solo recibe el archivo o la descarga (EVT-INT-16); M10 parsea, deduplica y atribuye (JOB-TEC-09). Renombrar JOB-INT-23 a `int:recibir-cdr`. | T06 INT y M10 TEC · **Estado (04-11-2026):** Corregido en anexo: JOB-INT-23 renombrado `int:recibir-cdr` (T06 recibe); M10 parsea y atribuye con JOB-TEC-09. |
| HUE-TEL-02 | El socio no puede ver el **detalle de llamadas** en el portal: M19 no tiene pantalla ni RF; M02 solo prevé impresión desde la ficha. | Agregar en M19 "Detalle de llamadas" por período (consulta de solo lectura a M04/M10), detrás de `por.consumos.ver`. | M19 POR · **Estado (04-11-2026):** Corregido en anexo: M19 RF-POR-175, PAN-POR-103, API-POR-122; M10 RF-TEC-237, API-TEC-55; M04 RF-TAR-120, API-TAR-067. |
| HUE-TEL-03 | **Concepto CPP e internacional con doble parámetro**: PRM-CAT-091/092 (M02) y PRM-TAR-081 más los internacionales (M04). | M04 es el dueño (RN-TAR-083); M02 elimina PRM-CAT-091/092 o los deja de solo lectura. | M02 CAT y M04 TAR · **Estado (04-11-2026):** Corregido en anexo: M04 RN-TAR-083, PRM-TAR-081/082; M02 PRM-CAT-091/092 (solo lectura). |
| HUE-TEL-04 | No hay una regla de mora propia de telefonía (bloqueo saliente, llamadas de emergencia siempre habilitadas) equivalente a RN-MOR-083. | Agregar RN-MOR para TEL: suspensión = bloqueo saliente conservando entrantes y números de emergencia. | M08 MOR · **Estado (04-11-2026):** Corregido en anexo (parcial): M08 RN-MOR-137, RF-MOR-222, PRM-MOR-199, ESC-MOR-51; pendiente: validación legal del régimen de emergencias de telefonía. · **Estado (05-11-2026):** Corregido en anexo (parámetro con default propuesto; requiere validación legal): M08 RN-MOR-137, RF-MOR-222, PRM-MOR-199 (modo `restricted`, emergencias siempre habilitadas), ESC-MOR-51. Antes: parcial, pendiente validación legal del régimen de emergencias. |
| HUE-TEL-05 | **Portabilidad numérica**: EVT-TEC-31 lleva `portId`, pero ningún anexo define el proceso de portabilidad. | Definir en M10 la portabilidad entrante y saliente como operación técnica con estados, o declararla "No aplica" para cooperativas sin numeración propia. | M10 TEC · **Estado (04-11-2026):** Decisión: PA-TEC-19, asumida la opción recomendada (DEC-072) |
| HUE-SRV-01, 05, 08 | Ver §0.4 | — | — |

---

# 3. TV — Televisión / cable

## 3.1 Resumen

| Aspecto | Definición |
|---|---|
| Unidad central | Contrato con paquete y puntos o decodificadores como dispositivos (M02 6.C.3). |
| Regulador | ENACOM (servicio TIC/audiovisual); informes por servicio TIC con TV incluida (M06 RF-FIS-146). Botón de baja habilitado (DEC-057). |
| Perfil de cálculo ProCoop | Perfil "Fijos con dispositivos"; tipo 6 `fixed` con la cantidad de puntos como dispositivos (M02 6.C.3; RN-TAR-012). |
| Olas e hito de salida | **O10**: todo el recorrido. Hito de salida: contrato TV-BAS activado por el sistema de acceso condicional (CAS) o SITSA con decodificador en comodato, facturado, suspendido por mora y reconectado por el mismo conector (RF-TEC-194; FI-INT-86, 87). Antes de O10 el servicio se puede facturar como abono fijo con activación manual (RF-TEC-188). |

## 3.2 Configuración

**Perfil BASE §84** (M02 6.B; T04 RF-CFG-125). "No aplica": *Medidor y lecturas*.

| Grupo | Parámetros |
|---|---|
| Equipos | PRM-CAT-095 `cat.tv.decodersPerContract` (1) · PRM-CAT-107 `cat.activation.requireEquipmentAssigned` (true en INT y TV) · modalidad por defecto comodato (DEC-013): PRM-CAT-093 `cat.equipmentDefaultModality` con ámbito servicio, `loan` en TV (HUE-TV-02 corregido; antes "no existe PRM para TV, PRM-CAT-093 es solo INT") · PRM-CAT-094 (devolución 15 días; ámbito servicio) |
| Alta | PRM-TEC-024 (red de cable: factibilidad; dueño M10) y PRM-CAT-013 (lectura derivada; HUE-SRV-07) · PRM-TEC-048 (serie de dispositivo obligatoria) |
| Ciclo comercial | PRM-CAT-098 (false) · PRM-CAT-100 (`nextCycle`) · PRM-CAT-102 (true) |

**Datos maestros**: servicio TV y concesión (PAN-CAT-04, 26) → paquetes y señales adicionales como productos (PAN-CAT-06, 27; DEC-012) → plan TV-BAS (PAN-CAT-07) → artículo decodificador serializado (RF-STK-002, 044) → sistema de aprovisionamiento CAS/SITSA/Sensa (RF-TEC-182, 194; PAN-TEC-36) → cabecera de TV como equipo de red (RF-TEC-164) → cuadro tarifario (PAN-TAR-02).

**Precarga demo ficticia**: TV-BAS "Grilla básica, 1 decodificador" (M02 §18). No hay decodificadores demo en stock ni importes de TV-BAS (HUE-SRV-05). Estado: M02 §18 es el seed único (HUE-SRV-05 corregido).

## 3.3 Recorrido del ciclo de vida

| # | Paso | Anexo | IDs | Notas para construir |
|---|---|---|---|---|
| 1 | Oferta y landing | M19, M02 | RF-POR-004, 005, 006; PAN-POR-02, 03, 04 (PAN-CAT-23 como componente embebido, HUE-SRV-04) | Paquetes y señales adicionales como productos del plan (PAN-CAT-27). |
| 2 | Solicitud | M09, M19 | RF-CRM-004, 060, 063; RF-POR-056, 061; DEC-011; `cat.contract.requested` | — |
| 3 | Factibilidad | M10 | RF-TEC-001, 007, 008, 011; PRM-TEC-024; DEC-040 | Cobertura de la red de cable o IPTV en la zona. |
| 4 | Alta del contrato | M02 | §8.2 T01–T03; RN-CAT-064; PAN-CAT-14, 15; API-CAT-33 | Puntos de conexión y señales adicionales como atributos de dominio (M02 6.C.3). |
| 5 | Instalación y equipos | M10, M13 | RF-TEC-085..092, 098; RF-STK-059, 062, 072, 074; RN-STK-018; RN-CAT-061; EVT-STK-04; EVT-TEC-12; PAN-STK-38; API-CAT-37 | Cada decodificador se aplica al contrato con constancia de comodato. |
| 6 | Aprovisionamiento | M10, T06 | RF-TEC-185, 186, 194; JOB-TEC-06; EVT-TEC-21; EVT-TEC-16; FI-INT-86, 87; EVT-INT-15; RF-TEC-188; DEC-033, DEC-041 | Alta = activación de señal (M02 6.C.3). La interfaz es la misma que en INT (RF-TEC-194). |
| 7 | Medidor y lecturas | — | **No aplica** | — |
| 8 | Tarifa | M04 | RN-TAR-012 (tipo 6); RF-TAR-036; PAN-TAR-02, 14 | Abono por paquete + punto adicional por decodificador por encima de PRM-CAT-095. |
| 9 | Facturación | M05 | RF-FAC-065; JOB-FAC-01..04; EVT-FAC-07; DEC-034, DEC-016 | Instalación en la primera factura (DEC-016). |
| 10 | Fiscal y regulador | M06 | RF-FIS-033, 051, 146; EVT-FIS-01; DEC-038 | — |
| 11 | Cuenta corriente y cobro | M07, M19 | RF-COB-001, 078, 152; EVT-COB-01, 04 | — |
| 12 | Mora, corte y reconexión | M08, M10 | RF-MOR-073, 100, 118, 121..124, 130; EVT-MOR-12, 13; RF-TEC-187; EVT-TEC-18, 19, 21; DEC-014 | Suspensión = corte de señal vía CAS (RF-MOR-130 lista SITSA). No hay regla propia de TV (HUE-TV-03). Corregido: RN-MOR-138 con modos `restricted` (grilla mínima) e `interrupted`, RF-MOR-222, PRM-MOR-200. |
| 13 | Reclamos | M09, M10 | RF-CRM-100, 101, 107, 108; RF-TEC-166; EVT-TEC-24; CU-CRM-03 | Caída de la cabecera = incidente de zona. |
| 14 | Cambios | M09, M02, M10, M13 | Plan o paquete: RF-CRM-072, `cat.contract.planChanged`, RF-TEC-187 (`changePlan`), DEC-032. Equipo: EVT-STK-06. Titular: RF-CRM-071, DEC-045. Traslado: RF-CRM-073. Baja parcial de señal adicional: RF-CRM-075 | — |
| 15 | Baja | M09, M19, M10, M13 | RF-CRM-061, 066, 067; RN-CRM-007, 008; RF-POR-009..011; EVT-CRM-14; RF-CAT-088; RF-TEC-099; EVT-STK-05, 07; JOB-CAT-09; DEC-057 | Salida: corte de señal y retiro de los decodificadores (M02 6.C.3). |
| 16 | Portal del socio | M19, M13 | RF-POR-054, 055; PAN-POR-29, 30; RF-STK-079; PAN-STK-40 (componente embebido en PAN-POR-30, HUE-SRV-04) | — |
| 17 | Comunicaciones | T09 | §9.6 tipos 10–14, 22–30, 41, 44, 45, 47, 53–57, 62 | — |
| 18 | Reportes | M06, T10 | RF-FIS-146; RF-BIA-090; REP-BIA-017 Informe ENACOM de televisión (T10 §15.5.1; antes `[REF-PENDIENTE]`, HUE-SRV-08) | — |
| 19 | Contabilidad | M15, M13 | RF-CON-066, 092; RF-STK-094 | Los derechos de señales son costo (M12/M15); no hay especificación (HUE-TV-01). Corregido: RF-CMP-154/155, JOB-CMP-09 y EVT-CMP-17 de M12 sobre el informe RF-CAT-116 de M02; devengo en M15 con M-128. |
| 20 | Migración | T07, M02 | RF-MIG-039; RN-MIG-035; M02 §19 (`SERSOC`, `SERSOC_PRODUCTOS`) | Decodificadores en comodato como equipos asignados al contrato. |

## 3.4 Reglas críticas

- **RN-CAT-061 / RN-STK-018**: un decodificador solo se aplica desde la custodia del técnico y a un único contrato.
- **RN-CAT-064**: sin el equipo obligatorio asignado (PRM-CAT-107) el contrato no se activa.
- **RN-CRM-007 / RN-CRM-008**: baja sin cargo y por botón público (DEC-057).
- **RN-MOR-101**: no hay cargos de suspensión o reactivación sin una regla aprobada.
- **RF-POR-071**: el portal no muestra "Activo" antes de la confirmación del CAS.

## 3.5 Pantallas

| App | Pantallas |
|---|---|
| landing | PAN-POR-02, 03, 04, 09, 10, 11 |
| pwa-socio | PAN-POR-29, 30, 34, 35, 36, 37, 38, 39 (PAN-STK-40 es componente embebido en PAN-POR-30, HUE-SRV-04) |
| admin | PAN-CAT-04, 06, 07, 14, 19, 27; PAN-TEC-25, 35, 36, 37, 38; PAN-STK-11, 12, 17; PAN-TAR-02 |
| pwa-campo | PAN-TEC-50, 51; PAN-STK-38 |

## 3.6 Eventos y jobs

| Tipo | Elementos |
|---|---|
| Eventos | `cat.contract.installationRequested`; EVT-STK-04; EVT-TEC-21; EVT-TEC-16; `cat.contract.activated`; EVT-FAC-07; EVT-MOR-13; EVT-TEC-18/19; EVT-CRM-14; EVT-STK-05, 07 |
| Jobs | JOB-TEC-06, 11; JOB-INT-01, 02; JOB-FAC-01..04; JOB-MOR-02, 07, 18; JOB-CAT-09 |

## 3.7 Escenarios

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| ESC-SRV-TV-01 | TV-BAS con abono ficticio de ARS 12.000 e instalación de ARS 6.000; decodificador con serie ficticia DECO-DEMO-0001 en custodia del instalador | Se aplica el decodificador y el CAS confirma la activación el 01-12-2026 | El contrato pasa a `active`; el primer comprobante de diciembre suma ARS 18.000 (abono + instalación, DEC-016). |
| ESC-SRV-TV-02 | Contrato TV-BAS activo con PRM-CAT-095 = 1 y punto adicional ficticio de ARS 2.000 | Se instala un segundo decodificador | El período siguiente factura ARS 12.000 + ARS 2.000 = ARS 14.000; el segundo equipo queda en comodato con su constancia. |
| ESC-SRV-TV-03 (error) | Contrato en `pendingInstallation` con el decodificador aplicado | El CAS rechaza la activación por serie no registrada | EVT-TEC-21 `tec.provisioning.failed`; el contrato no se activa ni se factura; tarea manual (RF-TEC-188); la bandeja de instalaciones lo muestra como "ejecutada sin activación" (RF-TEC-100). |
| ESC-SRV-TV-04 | Contrato TV con deuda vencida de ARS 24.000 y caso de mora aprobado | Se ejecuta la suspensión y luego se confirma el pago total | El CAS corta la señal (EVT-TEC-18); tras el pago, JOB-MOR-07 reconecta sin cargo y el contrato vuelve a `active` (RF-MOR-122). |
| ESC-SRV-TV-05 | Contrato TV activo con dos decodificadores | El titular pide la baja desde la app | Constancia por el mismo medio; el contrato pasa a `pendingTermination` y se genera la OT de retiro; si los equipos no se devuelven en 15 días, EVT-STK-07 abre un contacto en M09, sin cargo automático (HUE-INT-01). Con HUE-INT-01 corregido, el tenant puede habilitar el cargo por equipo no devuelto (RF-TAR-115, PRM-TAR-169, apagado por defecto), que se aprueba según RN-MOR-101. |
| ESC-SRV-TV-06 (aislamiento) | Un operador de TEN-002 | Busca la serie DECO-DEMO-0001 (TEN-001) en PAN-STK-11 | Sin resultados; GET por ID devuelve 404. |

## 3.8 Preguntas abiertas

| PA | Tema | Estado |
|---|---|---|
| PA-CAT-10 | Modalidad de equipos | Respondida (DEC-013) |
| PA-TEC-09 | Aprovisionamiento | Respondida (DEC-041) |
| PA-CRM-15 | Botón de baja | Respondida (DEC-057) |
| PA-FIS-13 | Informes ENACOM | Asumida (DEC-072) |

## 3.9 Huecos

| ID | Hueco | Propuesta | Anexo |
|---|---|---|---|
| HUE-TV-01 | **Derechos de señales**: M02 6.C.3 los deja "a relevar por tenant"; ningún anexo define el costo por abonado, la declaración a los proveedores de señales ni su contabilización. | Definir en M12 la liquidación mensual de derechos por cantidad de abonados activos por paquete, con informe desde M02 y asiento de costo en M15. | M12 CMP (con M02 y M15) · **Estado (04-11-2026):** Corregido en anexo: M12 RF-CMP-154/155, RN-CMP-075, JOB-CMP-09, EVT-CMP-17, PAN-CMP-26, API-CMP-123/124, PRM-CMP-115/116; M02 RF-CAT-116, API-CAT-56; M15 M-128, PRM-CON-188; T11 EVT-CMP-17, JOB-CMP-09. |
| HUE-TV-02 | No hay un parámetro de modalidad de equipos por defecto para TV: PRM-CAT-093 es solo INT, aunque DEC-013 fija comodato por defecto en INT y TV. | Generalizar PRM-CAT-093 a `cat.equipmentDefaultModality` con ámbito servicio. | M02 CAT · **Estado (04-11-2026):** Corregido en anexo: M02 PRM-CAT-093 `cat.equipmentDefaultModality` (ámbito servicio). |
| HUE-TV-03 | No hay una regla de mora propia de TV ni definición de los modos de suspensión (corte total frente a grilla reducida). | Agregar RN-MOR para TV con modos `interrupted` y `restricted` (grilla mínima). | M08 MOR · **Estado (04-11-2026):** Corregido en anexo (parcial): M08 RN-MOR-138, RF-MOR-222, PRM-MOR-200, ESC-MOR-52; pendiente: validación legal del contenido de la grilla mínima. · **Estado (05-11-2026):** Corregido en anexo (parámetro con default propuesto; requiere validación legal): M08 RN-MOR-138, RF-MOR-222, PRM-MOR-200 (modo `restricted` con el paquete de grilla mínima de M02, RN-CAT-079), ESC-MOR-52. Antes: parcial, pendiente validación legal de la grilla mínima. |
| HUE-TV-04 | El aprovisionamiento de TV solo tiene RF-TEC-194 ("misma interfaz"); faltan perfiles técnicos de paquete y señal y el mapeo plan → paquete CAS. | Extender RF-TEC-183 con perfiles de TV (paquete, señales, cantidad de decodificadores). | M10 TEC con T06 INT (FI-INT-86) · **Estado (04-11-2026):** Corregido en anexo: M10 RF-TEC-183, RF-TEC-194, `provisioningProfiles`, `decoders[]`; T06 FI-INT-86 (contrato del conector CAS). |
| HUE-SRV-04, 05, 08 | Ver §0.4 | — | — |

---

# 4. ELE — Energía eléctrica (incluye generación distribuida y grandes usuarios)

## 4.1 Resumen

| Aspecto | Definición |
|---|---|
| Unidad central | Suministro y punto de medición (M02 6.C.4; M03 RF-MED-012). Uno por punto de suministro (DEC-028; PRM-CAT-021 = false). |
| Regulador | Córdoba: ERSeP (Ley 8835); EPEC como prestadora mayorista con tarifa de abastecimiento; Ley 10281 (instalador habilitado); electrodependencia (Ley 27351 y Ley 10511); Ley 10739 (contenido de facturas, M06 RF-FIS-012). Secretaría de Energía (RF-FIS-147) y, en otras provincias, OCEBA/EPRE (FI-INT-29). Generación distribuida: Ley 27.424 (DEC-060) y RG ARCA 5746/2025 (RF-FIS-073, 128). |
| Perfil de cálculo ProCoop | Perfil "Energía"; tipo 1 `metered_block`, 2 `metered_tiers` o 4 `metered_fixed_by_range` (RN-TAR-012); variante grandes clientes con demanda, reactiva y factor de potencia (RN-TAR-101..115); medidor testigo (RF-MED-087). |
| Olas e hito de salida | **O7**: todo el recorrido. Hito de salida de O7: ciclo mensual completo de una ruta ELE-RES (lote de lecturas confirmado → consumos aprobados → cálculo → emisión con CAE → cobro), con al menos un suministro GD liquidado por separado (ESC-TAR-11), un gran usuario con factor de potencia (ESC-TAR-08), un suministro electrodependiente protegido del corte (ESC-MOR-17) y un informe ERSeP generado (RF-FIS-144). Prerrequisitos de olas anteriores: catálogo y contrato (O2), facturación y fiscal (O4), cobro (O5), mora (O6). |

## 4.2 Configuración

**Perfil BASE §84** (M02 6.B; T04 RF-CFG-125). No hay dimensiones "No aplica".

| Grupo | Parámetros |
|---|---|
| Alta y requisitos | PRM-TEC-024 (factibilidad; dueño M10) y PRM-CAT-013 (lectura derivada; HUE-SRV-07) · PRM-TEC-043 `workOrder.close.installerCertificate` (dueño M10: `require` en ELE con jurisdicción Córdoba por Ley 10281, `warn` en el resto; RN-TEC-114) y PRM-CAT-015 `cat.req.installerCertificate` (lectura derivada de PRM-TEC-043; HUE-ELE-04 corregido; antes "`none`; recomendado `warn`" y PRM-TEC-043 en `warn`) · PRM-TEC-063 `workOrder.close.requireMeterModel` (true) · PRM-CAT-021 (false, DEC-028) · PRM-CAT-017 (`warn`, DEC-029) |
| Medición | PRM-MED-012 `med.route.excludePrepaid` (true) · PRM-MED-013 `med.route.telemeteredDefault` (`exclude`) · PRM-MED-089 `med.rule.injectionWithoutContract.severity` (`blocking`) · PRM-MED-100 `med.estimate.defaultMethod` (`average`) · PRM-MED-108 `med.estimate.maxConsecutive` (2) · PRM-CAT-041 `cat.ot.blockCloseOnTelemetryError` (true) |
| Tarifa | PRM-TAR-062 (activa con o sin inyectada para el factor de potencia) · PRM-TAR-093 `tar.demand.prorationEnabled` (false) · PRM-TAR-095 (piso del coseno) · PRM-CAT-082 `cat.billing.noConsumptionCharge` (false) · PRM-CAT-106 `cat.categories.maxSocialPerPerson` (1) |
| Corte y reconexión | PRM-TEC-047 `disconnection.defaultMeterRemoved` (false) · PRM-CAT-042 `cat.reconnect.keepPreviousStart` · ventanas y preaviso por servicio (RF-MOR-119, 120) |

**Datos maestros**: concesión y código de empresa ERSeP (PAN-CAT-26; RF-FIS-144) → categorías con código regulatorio y social (PAN-CAT-08; RN-CAT-016, 028) → tipos y modelos de medidor, canales (PAN-MED-01; RF-MED-013) → medidores serializados en stock (RF-STK-044) → rutas y cronograma (PAN-MED-05, 06) → cuadros tarifarios por categoría con energía, demanda y reactiva (PAN-TAR-02, 03) → subsidios y segmentación (PAN-TAR-12; FI-INT-24) → instaladores certificados (PAN-TEC-16) → red eléctrica y GIS (PAN-TEC-30, 31, 32) → sistemas de telemedición y prepago (PAN-MED-23; FI-INT-75, 76, 77) → protecciones normativas (PAN-MOR-24).

**Precarga demo ficticia**: ELE-RES (código regulatorio R1) y ELE-RES-SOC (`isSocial=true`) (M02 §18); PAR-DEMO-001 (regla que propone SEP al activar ELE, modo `propose`). Faltan medidores, rutas y un cuadro tarifario ELE demo (HUE-SRV-05). Estado: M02 §18 es el seed único del catálogo (HUE-SRV-05 corregido); medidores y rutas siguen en la precarga de M03.

## 4.3 Recorrido del ciclo de vida

| # | Paso | Anexo | IDs | Notas para construir |
|---|---|---|---|---|
| 1 | Oferta y landing | M19, M02, M04 | RF-POR-004, 005, 006; PAN-POR-02, 03, 04; PAN-TAR-24; `cat.tenantService.published` | El cuadro tarifario público es obligatorio en servicios regulados (PAN-TAR-24). |
| 2 | Solicitud | M09, M19, M01 | RF-CRM-060, 063, 079; RF-POR-056, 059, 061; RF-PER-093, 096; RN-PER-062; DEC-011, DEC-029 | Documentos: solicitud de suministro, certificado de instalador, constancia de electrodependencia (M02 6.C.4). |
| 3 | Factibilidad y obra | M10, M11 | RF-TEC-001, 005, 006, 007, 008, 011; PAN-TEC-01, 02, 03; RF-TEC-168..175; PAN-TEC-39; RF-VEN-036, 047; EVT-TEC-02 | Potencia solicitada como propiedad de la factibilidad (RF-TEC-005). Con obra: presupuesto en M11 y OT en M10. |
| 4 | Alta del contrato | M02 | §8.2 T01–T03; RF-CAT-021, 096, 097; RN-CAT-064; PAN-CAT-14, 15; API-CAT-33, 42, 43; CU-ESP-ELE; DEC-027 (provisorio) | GD y grandes usuarios son vínculos del contrato, no servicios aparte (M02 6.C.4). |
| 5 | Instalación y medidor | M10, M03, M13 | RF-TEC-085, 091, 093; PRM-TEC-043, 063; RF-MED-012, 013, 016, 019; RN-MED-017; PAN-MED-04; EVT-MED-01; RF-STK-044, 062; RN-CAT-042 | Alta = conexión habilitada con lectura inicial (M02 6.C.4). Cierre de OT en dos pasos (DEC-039). |
| 6 | Telemedición y prepago | M03, M10, T06 | RF-MED-103, 108, 110, 113, 118; RF-TEC-196; PAN-MED-23, 24, 25; JOB-MED-10, 11, 12, 13, 14; EVT-MED-21..25; FI-INT-75, 76, 77, 78; EVT-INT-14; CU-MED-08, 09; RN-MED-110; PA-INT-14 | Aprovisionamiento = alta del medidor en el sistema remoto. El prepago no entra en rutas ni en el lote pospago (RN-MED-110). |
| 7 | Lecturas y consumos | M03 | RF-MED-025, 043, 053, 057, 061, 064, 074, 087, 089; RN-MED-050, 076, 078, 090; PAN-MED-05..14, 18, 19, 28, 29; JOB-MED-01, 03, 05, 09, 17; EVT-MED-07, 11, 12, 14, 16, 18; CU-MED-01, 03, 07 | Un consumo con excepción bloqueante no se liquida y el servicio queda "observado" en el lote (RN-MED-078). |
| 7b | Generación distribuida | M03, M02 | RF-MED-094, 095, 099; RN-MED-117, 118; PAN-MED-26; JOB-MED-15; EVT-MED-19, 20; RF-CAT-096; PRM-MED-089; CU-MER-01 | Medidor bidireccional con canales separados; inyección sin contrato GD = excepción bloqueante. |
| 8 | Tarifa | M04 | RN-TAR-012, 101..115, 227, 231, 232; RF-TAR-036; PAN-TAR-02, 03, 10, 12, 15, 17; EVT-TAR-008, 013, 014, 017, 021; JOB-TAR-03, 05; ESC-TAR-08, 11; RN-TAR-172 | No equiparar kWh con kW ni aplicar la tarifa mayorista como minorista (RN-TAR-227). Demanda contratada: se factura la mayor entre contratada y registrada (RN-MED-101). |
| 9 | Facturación | M05 | RF-FAC-002, 020, 029, 030, 064, 065, 108, 135, 170; JOB-FAC-01..04, 06, 10; EVT-FAC-07, 17, 19; PAN-FAC-05, 07, 08, 19; DEC-034, DEC-036, DEC-037 | Total negativo por GD: crédito a futuro (DEC-036). La facturación in situ queda como extensión (PA-FAC-14, PA-MED-05). |
| 10 | Fiscal y regulador | M06, T06 | RF-FIS-012, 033, 051, 073, 128, 144, 147, 148, 150; EVT-FIS-01, 18; FI-INT-02, 25, 28, 29; PA-FIS-07, 14; DEC-038, DEC-054 | GD: datos de energía inyectada en la LQSP (RG 5746/2025). ERSeP: Circular 70/2021 y archivo de consumos (RF-FIS-144). |
| 11 | Cuenta corriente y cobro | M07, M19 | RF-COB-001, 026, 075, 078, 152; EVT-COB-01, 04, 09; RF-POR-089, 108; PAN-POR-40, 49; CU-POR-12 | El crédito por GD se consume en la próxima factura (EVT-COB-09). La venta prepaga se cobra en M07 (RF-COB-075). |
| 12 | Mora, corte y reconexión | M08, M10, M03, M01 | RF-MOR-073, 100, 111, 118..124, 126, 128, 130, 202; RN-MOR-084, 092, 093, 094, 095; PAN-MOR-10, 19, 20, 24; JOB-MOR-02, 06, 07, 14, 18; EVT-MOR-12, 13, 20; RF-TEC-132..137; EVT-TEC-18, 19, 20; CU-TEC-03; RF-MED-108; RF-PER-014; RN-PER-017; ESC-MOR-17, 19; PA-MOR-06, 07, 10 | Electrodependiente acreditado: la evaluación queda `blocked` y nadie crea el caso (RN-MOR-084). La desconexión de ELE dispara la de los dependientes, como ALU (EVT-TEC-20). |
| 13 | Reclamos y emergencias | M09, M10 | RF-CRM-100, 101, 107, 108, 114, 122; EVT-CRM-16; PAN-CRM-07, 08; RF-TEC-176..181; PAN-TEC-28, 41; EVT-TEC-23, 26; EVT-MED-17 | Riesgo eléctrico o cable caído: prioridad crítica y protocolo de urgencia (RF-CRM-122). Fraude: inspección y recupero aprobado (EVT-TEC-26). |
| 14 | Cambios | M09, M02, M03, M05, M04 | Categoría o recategorización: RF-FAC-108; JOB-FAC-10; JOB-TAR-05; EVT-FAC-19; EVT-TAR-018; `cat.contract.categoryChanged`. Medidor: CU-TEC-07, EVT-TEC-22, CU-MED-14. Potencia o demanda contratada: RF-MED-089; EVT-TAR-017. Titular: RF-CRM-071, DEC-045, RN-MED-118. Traslado: RF-CRM-073 | El contrato GD sigue al suministro en cambios de titular y baja (RN-MED-118). |
| 15 | Baja | M09, M02, M03, M10 | RF-CRM-061, 067; RN-CRM-007; RF-CAT-088; RN-CAT-039; RF-MED-022; `cat.contract.terminated` | Baja con lectura final y tratamiento del medidor; la deuda queda con quien corresponda (M02 6.C.4). El botón de baja es configurable, no obligatorio (DEC-057). |
| 16 | Portal del socio | M19, M03 | RF-POR-054, 055, 069, 103, 106, 107, 108; PAN-POR-30, 47, 48, 49, 66; RF-MED-057, 120; CU-POR-11, 12, 14; PA-POR-14, 16 | DDJJ de artefactos eléctricos y vehículos eléctricos (RF-POR-069), que difiere de la DDJJ de gas de M02 (HUE-GAS-01). Corregido: la DDJJ es por servicio con plantilla de M02 (RN-POR-042, API-POR-125; ELE con artefactos y vehículos eléctricos). |
| 17 | Comunicaciones | T09 | §9.6 tipos 32–40, 41, 44, 45, 47, 53–57 | Avisos de interrupción programada por zona (tipos 32–34; PAN-COM-23; job `com:avisos-interrupcion`). |
| 18 | Reportes | M06, M03, T10 | RF-FIS-144, 147, 148; medición propia y pérdidas (PAN-MED-21, CU-MED-13); PAN-MED-22; RF-BIA-090; REP-BIA-018 Informes ERSeP de energía y REP-BIA-019 Informe a la Secretaría de Energía (T10 §15.5.1; antes `[REF-PENDIENTE]`, HUE-SRV-08) | Informe de pérdidas por servicio (RF-FIS-144) a partir de la medición propia (CU-MED-13). |
| 19 | Contabilidad | M15, M12 | RF-CON-066, 090, 092, 093; RN-CON-069; FI-INT-33 | La compra de energía a EPEC es costo, no recargo al usuario (RN-CON-069). Circuito de compra no especificado (HUE-ELE-01). Corregido: M12 RF-CMP-149..151 y 153, JOB-CMP-10, EVT-CMP-16, con la medición de frontera de M03 (RF-MED-129) y el asiento M-126 de M15. |
| 20 | Migración | T07, M02 | RF-MIG-039, 054; RN-MIG-018, 020, 021, 022; M02 §19 (`SERSOC`, `PROPIESER`, `CATE_SER_EXTRAS.GENERADOR`, `SERSOC_EXTRAS`) | Medidor instalado con última lectura válida, factor y dígitos (RN-MIG-020); 12 períodos de consumo para estimar (RN-MIG-021); saldo prepago vivo (RN-MIG-022). |

## 4.4 Reglas críticas

- **RN-TAR-227**: no equiparar kWh con kW; no aplicar la tarifa mayorista como minorista; no extender un beneficio personal a otra persona.
- **RN-TAR-231**: demanda e inyección del usuario-generador son operaciones separadas con su IVA.
- **RN-TAR-232**: los grandes usuarios tienen condiciones particulares aprobadas y versionadas.
- **RN-TAR-111..114**: factor de potencia con método, tope y base por `kind`.
- **RN-MED-050**: un consumo negativo solo se acepta en el canal de energía recibida.
- **RN-MED-117 / RN-MED-118**: la inyección requiere un contrato GD vigente, y el GD sigue al suministro.
- **RN-MED-101**: se factura la mayor entre la demanda contratada y la registrada.
- **RN-MED-110**: el prepago no se lee ni se factura en el ciclo pospago.
- **RN-MOR-084**: no se suspende un suministro con electrodependencia acreditada.
- **RN-CAT-028**: un titular tiene como máximo un contrato social por servicio.
- **RN-PER-017**: la electrodependencia es un dato sensible, de acceso restringido.
- **RN-CON-069**: la compra de energía es costo, no recargo al usuario.

## 4.5 Pantallas

| App | Pantallas |
|---|---|
| landing | PAN-POR-02, 03, 04, 07; PAN-TAR-24 |
| pwa-socio | PAN-POR-29, 30, 38, 39, 40, 47, 48, 49, 66, 68; PAN-TAR-23 |
| admin | PAN-CAT-04, 08, 14, 15, 26; PAN-MED-01..14, 18, 19, 21, 23, 24, 25, 26, 27; PAN-TAR-02, 03, 10, 12, 15, 16, 17; PAN-FAC-05, 07, 08, 19; PAN-MOR-10, 19, 20, 24; PAN-TEC-01, 02, 16, 28, 30, 31, 32, 39, 41 |
| pwa-campo | PAN-MED-28, 29, 30; PAN-TEC-50, 51, 54 |

## 4.6 Eventos y jobs

| Tipo | Elementos |
|---|---|
| Eventos | EVT-MED-01, 07, 11, 12, 14, 18, 19, 20, 21, 22, 23, 25; EVT-TEC-18, 19, 20, 22, 23, 26; EVT-TAR-008, 013, 014, 017, 021 `tar.injectedCredit.recorded`; EVT-FAC-07, 17, 19; EVT-FIS-01, 18; EVT-COB-04, 09; EVT-MOR-12, 13, 20; EVT-INT-14 |
| Jobs | JOB-MED-01, 03, 05, 09, 10, 11, 12, 13, 14, 15, 17; JOB-TAR-03, 05; JOB-FAC-01..04, 06, 10; JOB-MOR-02, 06, 07, 14, 18; JOB-INT-22 `int:leer-telemedicion` |

## 4.7 Escenarios

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| ESC-SRV-ELE-01 | Suministro ELE-RES con cuadro ficticio tipo 2: cargo fijo ARS 3.000; 0–150 kWh a ARS 100; más de 150 kWh a ARS 120 | Lecturas validadas de 10.000 y 10.250 kWh | Consumo 250 kWh; neto ARS 3.000 + 15.000 + 12.000 = ARS 30.000 con versión del cuadro y tramos en la traza; CAE obtenido. |
| ESC-SRV-ELE-02 | Suministro con contrato GD vigente, demanda 300 kWh e inyección 120 kWh (ESC-TAR-11) | Se aprueba el balance (JOB-MED-15) y se emite | Dos operaciones separadas con su IVA; si el total queda negativo, crédito registrado para la próxima factura (DEC-036, DEC-060; EVT-TAR-021) y datos de energía inyectada para RG 5746/2025 (RF-FIS-073). |
| ESC-SRV-ELE-03 (error) | Punto sin contrato GD | Llega una lectura con inyección de 40 kWh | Excepción bloqueante (RF-MED-099; PRM-MED-089); el servicio queda "observado" en el lote y no se emite hasta resolver (RN-MED-078; ESC-MED-18). |
| ESC-SRV-ELE-04 | Suministro con electrodependencia acreditada y deuda vencida de ARS 90.000 | Corre JOB-MOR-02 | Evaluación `blocked`; ningún rol puede crear el caso de interrupción (ESC-MOR-17); la deuda sigue en gestión de aviso y convenio. |
| ESC-SRV-ELE-05 | Gran usuario con reactiva alta (ejemplo M04 §9.3.6) | Se calcula el período | Renglón de factor de potencia con recargo ARS 209.677,42, método y tope en la traza; sin reactiva no hay renglón (ESC-TAR-08). |
| ESC-SRV-ELE-06 | Suministro prepago con deuda vencida y retención configurada del 10 % | El socio recarga ARS 5.000 desde la app | Capital acreditado ARS 4.500 y ARS 500 a cuenta de la deuda; token entregado (EVT-MED-23); factura de autogestión (CU-POR-12). |
| ESC-SRV-ELE-07 | Suministro telemedido con caso de mora `scheduled` en ventana hábil | Se ejecuta el corte remoto y luego se confirma el pago | `disconnect` y `reconnect` con `Idempotency-Key` (RF-MED-108); EVT-MED-21 en ambos; si falla, EVT-MED-22 y la OT no cierra (PRM-CAT-041; CU-MED-08). |
| ESC-SRV-ELE-08 (aislamiento) | Un lecturista de TEN-002 | Sincroniza un lote que incluye un punto de TEN-001 por ID | Rechazo 404 por ítem; ninguna lectura de TEN-001 se crea ni se lee desde TEN-002 (ESC-MED-24). |

## 4.8 Preguntas abiertas

| PA | Tema | Estado |
|---|---|---|
| PA-MED-08 | Compensación de GD | Respondida (DEC-060) |
| PA-TAR-14 | Energía inyectada | Asumida (DEC-072) como "balance neto MER-001 + modo de compatibilidad"; posible conflicto con DEC-060 (HUE-ELE-03). Estado: alineada con DEC-060 (compensación monetaria por defecto; balance neto como opción del régimen; RN-TAR-231) |
| PA-MED-02, 04, 05, 06, 07, 12 | Estimación, prepago, in situ, autolectura, tope de estimaciones, conectores | Asumidas (DEC-072) |
| PA-INT-14 | Primer adaptador de telemedición | No consolidada en `02-preguntas-abiertas.md` |
| PA-MOR-06, 07, 10 | Preaviso, protecciones, ventanas | Asumidas (DEC-072) |
| PA-FIS-07, 14 | RG 3571/5746 y ERSeP | Asumidas (DEC-072) |
| PA-POR-16 | DDJJ de artefactos y vehículos eléctricos | Asumida (DEC-072) |

## 4.9 Huecos

| ID | Hueco | Propuesta | Anexo |
|---|---|---|---|
| HUE-ELE-01 | **Compra de energía a EPEC**: FI-INT-33 y RN-CON-069 existen, pero ningún anexo define el circuito (factura del mayorista `FACT_EPEC`, control contra la medición de frontera, asiento de costo). | Definir en M12 la recepción de la factura del mayorista con control contra los medidores de compra/frontera de M03 (RF-MED-012 tipo de punto "compra") y asiento en M15. | M12 CMP (con M03 y M15) · **Estado (04-11-2026):** Corregido en anexo: M12 RF-CMP-149..151, RF-CMP-153, RN-CMP-073/074, JOB-CMP-10, EVT-CMP-16, PAN-CMP-25; M03 RF-MED-129, API-MED-78; M15 M-126, PRM-CON-186, RN-CON-121; T11 EVT-CMP-16, JOB-CMP-10. |
| HUE-ELE-02 | **Grandes usuarios**: la revisión previa de factura (M02 6.C.4, MER-003) no tiene RF en M05. | Agregar en M05 una cola de revisión previa por categoría o condición especial antes de autorizar. | M05 FAC · **Estado (04-11-2026):** Corregido en anexo: M05 RF-FAC-174, RN-FAC-154, PRM-FAC-161/162, PAN-FAC-47, API-FAC-158/159. |
| HUE-ELE-03 | **Régimen GD por defecto en conflicto**: DEC-060 fija compensación monetaria (Ley 27.424) y PA-TAR-14 asume "balance neto MER-001". | Alinear PA-TAR-14 con DEC-060 (monetario por defecto; balance neto como opción del régimen). | M04 TAR y `02-preguntas-abiertas.md` · **Estado (04-11-2026):** Corregido en anexo: M04 PA-TAR-14, RF-TAR-045, RN-TAR-231 (compensación monetaria por defecto, DEC-060). |
| HUE-ELE-04 | **Certificado de instalador**: PRM-CAT-015 vale `none` en ELE, aunque la Ley 10281 exige instalador habilitado en Córdoba; PRM-TEC-043 vale `warn`. Dos parámetros para el mismo control. | Un solo parámetro en M10 (PRM-TEC-043) con default `require` en ELE con jurisdicción Córdoba. | M10 TEC y M02 CAT · **Estado (04-11-2026):** Corregido en anexo: M10 PRM-TEC-043, RF-TEC-106, RN-TEC-114; M02 PRM-CAT-015 (lectura derivada). |
| HUE-ELE-05 | **Ventanas de corte por jurisdicción** (días hábiles, clima, vísperas): RF-MOR-119 y PA-MOR-10 las definen, pero no hay datos por defecto del ERSeP. | Plantilla de plataforma con la ventana ERSeP, validada legalmente. | M08 MOR · **Estado (04-11-2026):** Corregido en anexo (parcial): M08 RN-MOR-145, RF-MOR-221, RF-MOR-119, PRM-MOR-206, ESC-MOR-58; pendiente: validación legal de la plantilla ERSeP (días, horarios y umbrales climáticos, `toValidate`). · **Estado (05-11-2026):** Corregido en anexo (parámetro con default propuesto; requiere validación legal): M08 RN-MOR-145, RF-MOR-221, RF-MOR-119, PRM-MOR-206 (plantilla ERSeP `toValidate`), ESC-MOR-58. Antes: parcial, pendiente validación legal de días, horarios y umbrales climáticos. |
| HUE-SRV-01, 04, 05, 07, 08 | Ver §0.4 | — | — |

---

# 5. AG — Agua potable

## 5.1 Resumen

| Aspecto | Definición |
|---|---|
| Unidad central | Conexión o unidad de facturación: inmueble, parcela o unidad funcional (M02 6.C.5; M01 RF-PER-086, 087, 093). |
| Regulador | Según concesión: ERSeP, autoridad local o marco hídrico provincial (Decreto 529/94); Ley 10739 sobre contenido de facturas (M06 RF-FIS-012); informes ERSeP (RF-FIS-144). |
| Perfil de cálculo ProCoop | Perfil "Otros medidos" o "Fijos". Medido: tipo 1 `metered_block` o 2 `metered_tiers`. No medido: tipo 15 `water_by_property` (fórmula sobre datos catastrales) o 6 `fixed` (RN-TAR-012; RN-TAR-228). |
| Olas e hito de salida | **O7**: hito de salida = un ciclo de agua medida (lote de ruta, consumo aprobado, cálculo ESC-TAR-01, emisión y cobro) y uno no medido por inmueble (ESC-TAR-09) en el mismo tenant, con autolectura habilitada y distribución de consumo en un consorcio (CU-MED-06). |

## 5.2 Configuración

**Perfil BASE §84** (M02 6.B; T04 RF-CFG-125). En régimen no medido, *Medidor y lecturas* se declara "No aplica" para ese contrato, con fecha efectiva del régimen (M02 6.C.5).

| Grupo | Parámetros |
|---|---|
| Alta | PRM-TEC-024 (required; dueño M10) y PRM-CAT-013 (true, lectura derivada; HUE-SRV-07) · PRM-CAT-021 (false en medidos, DEC-028) · PRM-CAT-022 (true en no medidos) · política "solicitar siempre propiedades en el alta" (RN-PER-074) · PRM-CAT-017 (`warn`, DEC-029) |
| Medición | PRM-MED-100 (`average`) · PRM-MED-108 (2) · PRM-MED-012, 013 |
| Tarifa | PRM-TAR-070 `tar.waterProperty.zonalThreshold` (0,8) · PRM-TAR-071 `tar.waterProperty.minQuotaFactor` (0,7) · PRM-CAT-082 (cargo fijo sin consumo) · PRM-CAT-042 (fecha de alta en la reconexión de no medidos) |

**Datos maestros**: concesión y régimen (PAN-CAT-26) → categorías AG con destino de uso, urbano/rural y radio servido (PAN-CAT-08) → inmuebles con nomenclatura catastral de seis partes, superficie, frente y coeficientes (RF-PER-086, 090, 095; RN-PER-072, 073) → unidades funcionales (RF-PER-087) → medidores y diámetro de conexión (PAN-MED-01, 02) → rutas (PAN-MED-05) → cuadro tarifario medido y fórmula por inmueble (PAN-TAR-02, 07, 10) → distribuciones de consorcio (PAN-MED-17).

**Precarga demo ficticia**: AG-RES "Agua residencial" (M02 §18); ejemplos de M04: TAR-AG-2026-11 (cargo fijo ARS 3.000, ARS 500 por m³; ESC-TAR-01) y agua por inmueble (TBM 1.000, zonal 0,9, coeficiente 1,1, cuota 500; ESC-TAR-09). No hay inmuebles ni medidores AG demo (HUE-SRV-05). Estado: M02 §18 es el seed único del catálogo (HUE-SRV-05 corregido).

## 5.3 Recorrido del ciclo de vida

| # | Paso | Anexo | IDs | Notas para construir |
|---|---|---|---|---|
| 1 | Oferta y landing | M19, M04 | RF-POR-004, 005, 006; PAN-POR-02, 03, 04; PAN-TAR-24 | — |
| 2 | Solicitud | M09, M19, M01 | RF-CRM-060, 063; RF-POR-056, 059, 061; RF-PER-091, 092, 096; RN-PER-062, 074; DEC-011, DEC-029 | El inmueble es obligatorio si el servicio lo exige (RN-PER-074); la parcela catastral no se duplica (RF-PER-092). |
| 3 | Factibilidad y obra | M10, M11 | RF-TEC-001, 003, 006, 007, 008, 011; RF-TEC-168..175; PAN-TEC-39, 40; RF-VEN-047; RN-TEC-093; RF-TAR-049 | Conexión domiciliaria o extensión de red; obra con prorrateo explícito (RN-TEC-093) y cuotas de obra tipo 17 (RN-TAR-070). |
| 4 | Alta del contrato | M02 | §8.2 T01–T03; RN-CAT-064; PAN-CAT-14, 15; API-CAT-33; CU-ESP-AG | El régimen `metered`/`unmetered` se registra con fecha efectiva (M02 6.C.5). |
| 5 | Instalación y medidor | M10, M03, M13 | RF-TEC-085, 091, 093; RF-MED-012, 016, 019; RN-MED-017; PAN-MED-04; EVT-MED-01; RF-STK-044, 062 | Alta = conexión habilitada con la condición del régimen. |
| 6 | Aprovisionamiento | — | **No aplica** (sin sistema de red que aprovisionar); telemedición opcional como en ELE (RF-MED-103) | — |
| 7 | Lecturas y consumos | M03, M19 | RF-MED-025, 043, 053, 057, 061, 064, 074; RN-MED-076, 078, 090; PAN-MED-05..17; JOB-MED-01, 03, 05, 06, 07, 08; EVT-MED-07, 11, 12, 14, 16; CU-MED-01, 03, 04, 05, 06, 10; RF-POR-107; PAN-POR-48; CU-POR-11 | Consorcio: el consumo del medidor general se divide o distribuye entre unidades (JOB-MED-06, 07). Vuelta de medidor (CU-MED-05). |
| 8 | Tarifa | M04 | RN-TAR-012 (tipos 1, 2, 6, 15), RN-TAR-228; PRM-TAR-070, 071; ESC-TAR-01, 09; PAN-TAR-02, 10, 15, 17; JOB-TAR-03 | No medidos: solo bases aprobadas (categorías o características del inmueble), sin lecturas inventadas (RN-TAR-228). |
| 9 | Facturación | M05 | RF-FAC-002, 020, 029, 064, 065, 069, 135, 170; JOB-FAC-01..04, 06; EVT-FAC-07; DEC-034 | Puede haber varios ciclos de agua por tenant (RF-FAC-002). |
| 10 | Fiscal y regulador | M06 | RF-FIS-012, 033, 051, 144, 150; EVT-FIS-01 | La responsabilidad regulatoria depende de la concesión (RF-FIS-150). |
| 11 | Cuenta corriente y cobro | M07, M19 | RF-COB-001, 026, 032, 038, 152; EVT-COB-01, 04; CU-POR-05, 07 | En cuenta unificada no se imputa entre servicios por inferencia (RF-COB-038; DEC-049). |
| 12 | Mora, corte y reconexión | M08, M10 | RF-MOR-073, 100, 118..124; RN-MOR-085, 092, 093; RF-TEC-132..137; EVT-TEC-18, 19; ESC-MOR-15; PA-MOR-08 | Baja/desconexión, cargos remanentes y rehabilitación según el marco del servicio, **sin copiar la suspensión de Internet** (RN-MOR-085). La restricción de caudal no está especificada (HUE-AG-02). Corregido: RN-MOR-139 (reducción de caudal o interrupción, con caudal mínimo vital), PRM-MOR-201; requiere validación legal. |
| 13 | Reclamos | M09, M10 | RF-CRM-100, 101, 105, 107, 110, 122; CU-CRM-01; ESC-CRM-08; EVT-CRM-16; PAN-TEC-28 | Pérdida en vereda con foto (CU-CRM-01); el incidente restablecido no cierra los casos (ESC-CRM-08). |
| 14 | Cambios | M09, M02, M03 | Régimen medido ↔ no medido: M02 6.C.5 (fecha efectiva). Categoría: `cat.contract.categoryChanged`. Titular: RF-CRM-071, CU-CRM-05, DEC-045. Medidor: CU-TEC-07, EVT-TEC-22 | El cambio de régimen no tiene un comando propio en M02 (HUE-AG-03). Corregido: comando `changeMeteringRegime` (RF-CAT-114, RN-CAT-078) que publica EVT-CAT-28 `cat.contract.meteringRegimeChanged`; M03 crea o retira el punto (RF-MED-128). |
| 15 | Baja | M09, M02, M03, M10 | RF-CRM-061, 067; RN-CRM-007; RF-CAT-088; RN-CAT-039; RF-MED-022; `cat.contract.terminated` | La baja contractual es distinta de la situación física de la conexión y de la obligación regulatoria del inmueble (M02 6.C.5). |
| 16 | Portal del socio | M19, M03 | RF-POR-054, 055, 103, 107; PAN-POR-30, 47, 48; RF-MED-120 | — |
| 17 | Comunicaciones | T09 | §9.6 tipos 32–38, 41, 44, 45, 47, 53–57 | Consumo anómalo por posible pérdida (tipo 37). |
| 18 | Reportes | M06, T10 | RF-FIS-144, 148; RF-BIA-090; REP-BIA-020 Informes ERSeP de agua potable y REP-BIA-024 Informe de calidad del agua (solo con PRM-TEC-157; T10 §15.5.1; antes `[REF-PENDIENTE]`, HUE-SRV-08, HUE-AG-01) | — |
| 19 | Contabilidad | M15 | RF-CON-066, 092, 093 | — |
| 20 | Migración | T07, M01, M02 | RF-MIG-039, 054; RN-MIG-018, 020, 021; RF-PER-168; M02 §19 (`SERSOC`, `PROPIESER`) | Inmuebles y nomenclatura antes que contratos (RF-MIG-045). |

## 5.4 Reglas críticas

- **RN-TAR-228**: régimen medido/no medido con fecha efectiva; los no medidos se calculan con bases aprobadas.
- **RN-MOR-085**: la mora del agua sigue el marco del servicio, nunca el modelo de Internet.
- **RN-PER-072 / RN-PER-073**: nomenclatura catastral de seis partes; la designación del contrato debe existir en inmuebles.
- **RN-PER-074**: el inmueble es obligatorio cuando el servicio lo exige.
- **RN-MED-078**: un consumo con excepción bloqueante no se liquida.
- **RN-MED-090**: más de N estimaciones consecutivas generan una inspección obligatoria.
- **RN-CAT-073**: en medidos conectados sin consumo, se factura el cargo fijo si el parámetro lo indica.

## 5.5 Pantallas

| App | Pantallas |
|---|---|
| landing | PAN-POR-02, 03, 04, 07; PAN-TAR-24 |
| pwa-socio | PAN-POR-30, 38, 39, 47, 48, 51, 68; PAN-MED-32 (componente embebido en PAN-POR-48, HUE-SRV-04) |
| admin | PAN-CAT-08, 14, 15, 26; PAN-MED-02..17; PAN-TAR-02, 07, 10, 15, 17; PAN-FAC-05, 07, 08; PAN-TEC-01, 02, 39, 40; PAN-CRM-03, 07, 08 |
| pwa-campo | PAN-MED-28, 29, 30; PAN-TEC-50, 51 |

## 5.6 Eventos y jobs

| Tipo | Elementos |
|---|---|
| Eventos | EVT-MED-01, 07, 11, 12, 14, 16, 26, 27; EVT-TAR-008; EVT-FAC-07; EVT-COB-04; EVT-MOR-12, 13; EVT-TEC-18, 19, 22, 25 `tec.levy.approved`; EVT-CRM-16 |
| Jobs | JOB-MED-01, 03, 05, 06, 07, 08, 16, 17; JOB-TAR-03; JOB-FAC-01..04, 06; JOB-MOR-02, 07 |

## 5.7 Escenarios

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| ESC-SRV-AG-01 | Contrato AG-RES medido con TAR-AG-2026-11 (cargo fijo ARS 3.000; ARS 500 por m³) | Se aprueba un consumo de 20 m³ | Neto ARS 13.000,00 con versión, fila y cantidad en la traza (ESC-TAR-01). |
| ESC-SRV-AG-02 | Contrato no medido tipo 15 con TBM 1.000, zonal 0,9, coeficiente 1,1 y cuota 500 | Se calcula el período | red2(1.000 × 0,9 × 1,1 + 500 × 0,7) = ARS 1.340,00 (ESC-TAR-09). |
| ESC-SRV-AG-03 (error) | Contrato no medido tipo 15 cuyo inmueble tiene TBM = 0 | Se calcula el lote | La cuenta se excluye con `TAR-E-WATER-TBM` y el lote continúa (ESC-TAR-09, ESC-TAR-15). |
| ESC-SRV-AG-04 | Cuenta unificada con agua ARS 13.000, electricidad ARS 20.000 y cementerio ARS 7.000 vencidos; pago de ARS 8.000 | Corre la evaluación de mora | Decisión por servicio, sin corte automático; la deuda de cementerio no habilita suspender agua ni electricidad (ESC-MOR-15; PA-MOR-08). |
| ESC-SRV-AG-05 | Consorcio con medidor general de 100 m³ y cuatro unidades funcionales con coeficiente 0,25 | Se ejecuta la distribución (JOB-MED-07) | 25 m³ por unidad; cada contrato se factura con su consumo distribuido y la traza al medidor general (CU-MED-06). |
| ESC-SRV-AG-06 | Ventana de autolectura abierta; último consumo 18 m³ | Ana informa una autolectura que da 95 m³ | La autolectura queda "En revisión" por fuera de rango, sin consumo aprobado (CU-POR-11; EVT-MED-27). |
| ESC-SRV-AG-07 (aislamiento) | Un operador de TEN-002 | Busca por nomenclatura un inmueble de TEN-001 | Sin resultados; la validación de parcela duplicada (RF-PER-092) solo compara dentro del tenant. |

## 5.8 Preguntas abiertas

| PA | Tema | Estado |
|---|---|---|
| PA-CAT-11 | Contratos iguales en una cuenta | Respondida (DEC-028) |
| PA-CAT-12 | Deuda previa en el domicilio | Respondida (DEC-029) |
| PA-MED-01, 02, 06, 07, 13 | Regularización, estimación, autolectura, tope, historia | Asumidas (DEC-072) |
| PA-POR-14 | Autolectura desde el portal | Asumida (DEC-072) |
| PA-MOR-08 | Afectación cruzada | Asumida (DEC-072) |
| PA-TEC-16 | Prorrateo de contribución por mejoras | Asumida (DEC-072) |
| PA-FIS-14 | Informes ERSeP | Asumida (DEC-072) |

## 5.9 Huecos

| ID | Hueco | Propuesta | Anexo |
|---|---|---|---|
| HUE-AG-01 | **Calidad del agua**: M02 6.C.5 prohíbe certificarla con datos libres, pero ningún anexo define muestras, laboratorio, resultados ni su informe al regulador. | Definir en M10 los "controles de calidad" (punto de muestreo, análisis, resultado, laboratorio con documento en T11) e informe en M06/T10; o declararlo "No aplica" con fundamento. | M10 TEC (con M06 FIS) · **Estado (04-11-2026):** Decisión: PA-TEC-20, asumida la opción recomendada (DEC-072) |
| HUE-AG-02 | **Restricción de caudal** como modo de mora: RN-MOR-085 remite al marco sin modos operativos. | Modos de mora de AG: `restricted` (reducción de caudal) e `interrupted`, ambos habilitables por concesión. | M08 MOR · **Estado (04-11-2026):** Corregido en anexo (parcial): M08 RN-MOR-139, RN-MOR-085, PRM-MOR-201, ESC-MOR-53; pendiente: validación legal del caudal mínimo vital. · **Estado (05-11-2026):** Corregido en anexo (parámetro con default propuesto; requiere validación legal): M08 RN-MOR-139, RN-MOR-085, PRM-MOR-201 (modo `restricted`, caudal mínimo vital 50 l por persona y día), ESC-MOR-53. Antes: parcial, pendiente validación legal del caudal mínimo vital. |
| HUE-AG-03 | **Cambio de régimen medido ↔ no medido**: sin comando en M02 ni efecto definido en M03 (alta o retiro del punto de medición). | Comando `changeMeteringRegime` en M02 con fecha efectiva, que emite un evento y dispara RF-MED-012 o RF-MED-022. | M02 CAT (con M03 MED) · **Estado (04-11-2026):** Corregido en anexo: M02 RF-CAT-114, RN-CAT-078, EVT-CAT-28, API-CAT-35; M03 RF-MED-128, ESC-MED-36; T11 EVT-CAT-28. |
| HUE-SRV-04, 05, 07, 08 | Ver §0.4 | — | — |

---

# 6. CLO — Cloacas / saneamiento

## 6.1 Resumen

| Aspecto | Definición |
|---|---|
| Unidad central | Conexión cloacal del inmueble (M02 6.C.6). |
| Regulador | Concesión local o provincial; responsabilidad regulatoria por concesión (M06 RF-FIS-150). |
| Perfil de cálculo ProCoop | "Fijos" (tipo 6), "Otros medidos" con **servicio relacionado AG** (toma el consumo de agua de la misma cuenta: RF-CAT-021, RN-CAT-074, RF-TAR-046, RN-TAR-015) o tipo 17 si es cuota de obra de red cloacal (RN-TAR-070, 074). |
| Olas e hito de salida | **O7**: hito de salida = contrato CLO liquidado sobre el consumo aprobado de AG de la misma cuenta, más un plan de cuotas de obra cloacal cerrado con ajuste de saldo en la última cuota. |

## 6.2 Configuración

**Perfil BASE §84** (M02 6.B; T04 RF-CFG-125). *Medidor y lecturas*: "No aplica" cuando se usa el servicio relacionado; hay consumos propios solo por importación directa (RF-MED-055).

| Grupo | Parámetros |
|---|---|
| Alta | PRM-TEC-024 (factibilidad `required` también en CLO; dueño M10) y PRM-CAT-013 (lectura derivada, ya incluye CLO; HUE-SRV-07 corregido; antes "PRM-CAT-013 no incluye CLO") · PRM-CAT-022 (no medidos) |
| Servicio relacionado | PRM-CAT-080 `cat.related.readingsFromService` (= AG) · PRM-TAR-060 `tar.relatedService.onlyPending` · PRM-TAR-061 `tar.relatedService.onlyUnbilled` |
| Obra | Atributos de frente del inmueble (RF-PER-095; `networkMeters.sewerM` en M01) |

**Datos maestros**: concesión (PAN-CAT-26) → red cloacal y servicios que la usan (RF-TEC-148) → inmuebles con frente → categorías CLO (PAN-CAT-08) → cuadro tarifario fijo o por m³ de agua (PAN-TAR-02) → obra y plan de cuotas (PAN-TEC-39, 40).

**Precarga demo**: no hay servicio CLO en TEN-001 (HUE-SRV-05). Corregido: TEN-001 habilita CLO y M02 §18 agrega la categoría CLO-RES.

## 6.3 Recorrido del ciclo de vida

| # | Paso | Anexo | IDs | Notas para construir |
|---|---|---|---|---|
| 1 | Oferta y landing | M19, M04 | RF-POR-004, 005, 006; PAN-POR-02, 03, 04; PAN-TAR-24 | — |
| 2 | Solicitud | M09, M19, M01 | RF-CRM-060, 063; RF-POR-056, 061; RN-PER-074; DEC-029 | **Nunca se habilita automáticamente por tener agua** (M02 6.C.6; BASE §88). |
| 3 | Factibilidad y obra | M10, M04 | RF-TEC-001, 003, 148, 168..175; RN-TEC-093; RF-TAR-049; RN-TAR-070, 074; EVT-TEC-25 | Factibilidad por red (PRM-TEC-024); cuota de obra de red cloacal por frente. |
| 4 | Alta del contrato | M02 | §8.2 T01–T03; RF-CAT-021; RN-CAT-074; PAN-CAT-14, 15 | Declarar el servicio relacionado al configurar (PRM-CAT-080). |
| 5 | Instalación | M10 | RF-TEC-085, 091, 093 | Alta = conexión domiciliaria habilitada. |
| 6 | Aprovisionamiento o medidor | — | **No aplica** | — |
| 7 | Consumos | M04, M03 | RN-TAR-015; PRM-TAR-060, 061; RF-MED-055 | Toma los consumos del AG de la misma cuenta; la importación directa (por ejemplo, archivo ARR) requiere aprobación previa. |
| 8 | Tarifa | M04 | RN-TAR-012 (tipos 6, 17 o medido con relacionado), RF-TAR-046, 049; RN-TAR-015, 070, 074 | — |
| 9 | Facturación | M05 | RF-FAC-002, 020, 029, 064, 065; JOB-FAC-01..04; EVT-FAC-07 | Liquida después del AG si usa su consumo (HUE-CLO-02). Corregido: JOB-FAC-01 ordena CLO después de AG (RF-FAC-175, RN-FAC-155) y M04 excluye la cuenta con `TAR-E-RELATED-MISSING` (RN-TAR-247). |
| 10 | Fiscal y regulador | M06 | RF-FIS-033, 051, 150; EVT-FIS-01 | — |
| 11 | Cuenta corriente y cobro | M07 | RF-COB-001, 026, 032, 038; EVT-COB-01, 04 | — |
| 12 | Mora, corte y reconexión | M08 | RF-MOR-073, 100, 118..124; RN-MOR-092; ESC-MOR-15 | **Sin regla de mora propia** (HUE-CLO-01). Corregido: RN-MOR-140, sin suspensión física (`noSuspension`); avisos, intereses, convenio y gestión. |
| 13 | Reclamos | M09, M10 | RF-CRM-100, 101, 105, 107, 110, 259; EVT-CRM-16; PAN-TEC-28 | Desborde o obstrucción: subtipos de reclamo `dict:crm.claimType.clo.desborde` y `dict:crm.claimType.clo.obstruccion` (T03 §10.9.12, RF-UXD-179), configurados en M09 con RF-CRM-259; antes `[REF-PENDIENTE]` en T03 (HUE-CLO-03). |
| 14 | Cambios | M09, M02 | `cat.contract.categoryChanged`; RF-CRM-071; DEC-045 | — |
| 15 | Baja | M09, M02, M10 | RF-CRM-061, 067; RN-CRM-007; RF-CAT-088; RN-CAT-039 | La baja del AG no da de baja la cloaca (BASE §88); el plan de obra solo termina con la última cuota o con cancelación (M02 6.C.9). |
| 16 | Portal del socio | M19 | RF-POR-054, 055, 103; PAN-POR-30, 47 | — |
| 17 | Comunicaciones | T09 | §9.6 tipos 32–34, 41, 44, 45 | — |
| 18 | Reportes | M06, T10 | RF-FIS-144, 150; REP-BIA-021 Informe de la concesión de saneamiento (T10 §15.5.1; antes `[REF-PENDIENTE]`, HUE-SRV-08) | — |
| 19 | Contabilidad | M15 | RF-CON-066, 092 | — |
| 20 | Migración | T07, M02 | RF-MIG-039; RN-MIG-020, 021; M02 6.C.6 (`REL_SER`, `USA_COT`); M02 6.C.9 (`SERSOC_EXTRAS`) | Los vínculos con el servicio relacionado se migran después de los contratos AG. |

## 6.4 Reglas críticas

- **M02 6.C.6 / BASE §88**: la cloaca no se habilita automáticamente por existir agua.
- **RN-CAT-074 / RN-TAR-015**: el servicio relacionado toma lecturas del AG de la **misma cuenta**; PRM-TAR-061 limita a consumos no liquidados.
- **RN-TAR-074**: en cuotas de cloaca, la cuota es un importe y la última cobra el saldo.
- **RN-TAR-070**: una cuota de obra sin tipo de obra se rechaza con `TAR-E-WORKS-TYPE`.
- **RN-TEC-093**: el prorrateo de una obra exige un criterio explícito y aprobación.

## 6.5 Pantallas

| App | Pantallas |
|---|---|
| landing | PAN-POR-02, 03, 04; PAN-TAR-24 |
| pwa-socio | PAN-POR-30, 38, 39, 47 |
| admin | PAN-CAT-08, 14, 15, 26; PAN-TAR-02, 15, 17; PAN-FAC-05, 07; PAN-TEC-39, 40; PAN-CRM-03 |

## 6.6 Eventos y jobs

| Tipo | Elementos |
|---|---|
| Eventos | `cat.contract.*` (M02 §12.1); EVT-TEC-25; EVT-TAR-008; EVT-FAC-07; EVT-COB-04; EVT-MOR-12, 13 |
| Jobs | JOB-FAC-01..04; JOB-MOR-02 |

## 6.7 Escenarios

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| ESC-SRV-CLO-01 | Cuenta con AG y CLO; CLO tiene servicio relacionado AG (PRM-CAT-080); cuadro ficticio: cargo fijo ARS 1.000 y ARS 200 por m³ | Se aprueba un consumo AG de 20 m³ y se calcula el período | CLO = 1.000 + 20 × 200 = ARS 5.000,00, con la traza al consumo AG de origen (RN-TAR-015). |
| ESC-SRV-CLO-02 | PRM-TAR-061 = true; el consumo AG de octubre ya se liquidó en CLO | Se recalcula CLO de noviembre | Solo se toma el consumo AG no liquidado; octubre no se vuelve a cobrar. |
| ESC-SRV-CLO-03 | Un socio pide el alta de AG en un inmueble con red cloacal | Se da de alta AG | No se crea ningún contrato CLO; CLO requiere su propia solicitud (M02 6.C.6). |
| ESC-SRV-CLO-04 | Plan de obra cloacal ficticio de ARS 100.000 en 12 cuotas | Se facturan las 12 cuotas | Cuotas 1 a 11 de ARS 8.333,33 y última de ARS 8.333,37 (ajuste de saldo, RN-TAR-074). |
| ESC-SRV-CLO-05 (error) | Contrato tipo 17 sin tipo de obra informado | Se calcula el lote | La cuenta se excluye con `TAR-E-WORKS-TYPE` y el lote continúa (RN-TAR-070). |
| ESC-SRV-CLO-06 | Archivo ARR de consumos directos de cloaca | Se importa (RF-MED-055) | Los consumos quedan pendientes de aprobación; no se liquidan hasta aprobarlos. |
| ESC-SRV-CLO-07 (aislamiento) | Un contrato CLO de TEN-002 con servicio relacionado AG | Se calcula | Solo toma consumos AG de la misma cuenta de TEN-002; nunca los de TEN-001, aunque coincida la nomenclatura. |

## 6.8 Preguntas abiertas

| PA | Tema | Estado |
|---|---|---|
| PA-CAT-11 | Contratos iguales en una cuenta | Respondida (DEC-028) |
| PA-TEC-16 | Prorrateo de contribución por mejoras | Asumida (DEC-072) |
| PA-MOR-08 | Afectación cruzada | Asumida (DEC-072) |
| — | Sin PA propia de CLO | Ver huecos |

## 6.9 Huecos

| ID | Hueco | Propuesta | Anexo |
|---|---|---|---|
| HUE-CLO-01 | **Sin regla de mora propia**: M08 no define qué medida aplica en saneamiento (en general no se corta). | RN-MOR específica: CLO sin suspensión física; solo gestión de deuda, intereses y plan; habilitable por concesión. | M08 MOR · **Estado (04-11-2026):** Corregido en anexo: M08 RN-MOR-140, RF-MOR-222, ESC-MOR-54. |
| HUE-CLO-02 | **Orden y error del servicio relacionado**: no se define qué ocurre si el AG relacionado no existe en la cuenta, está dado de baja o su consumo aún no se aprobó. | Código `TAR-E-RELATED-MISSING` (cuenta excluida, lote continúa) y dependencia de lote "CLO después de AG" en JOB-FAC-01. | M04 TAR (con M05 FAC) · **Estado (04-11-2026):** Corregido en anexo: M04 RN-TAR-247, `TAR-E-RELATED-MISSING`, ESC-TAR-32; M05 RF-FAC-175, RN-FAC-155, JOB-FAC-01. |
| HUE-CLO-03 | **Categoría de reclamo de cloacas** (desborde, obstrucción) sin clave en T03. | Agregar `dict:crm.claimType` con valores de saneamiento. | T03 (con M09) · **Estado (04-11-2026):** Corregido en anexo: T03 `crm.claimType.clo.desborde` / `.obstruccion` (RF-UXD-179); M09 RF-CRM-259. |
| HUE-SRV-05, 07 | Ver §0.4 | — | — |

---

# 7. GAS — Gas natural por red, propano por red y envasado

## 7.1 Resumen

| Aspecto | Definición |
|---|---|
| Unidad central | Suministro, medidor y modalidad (M02 6.C.7). Las modalidades —red natural, propano por red y envasado— son variantes de la capacidad GAS habilitables por tenant con perfil propio (PA-CAT-13 → DEC-030). |
| Regulador | ENReGE (funciones federales ex ENARGAS/ENRE); subdistribuidor autorizado; distribuidora de referencia, por ejemplo Ecogas (M02 6.C.7). Informes SARI y FCU-DS (M06 RF-FIS-145; T06 FI-INT-26); subsidios SEF y Zona Fría (T06 FI-INT-24). |
| Perfil de cálculo ProCoop | "Otros medidos"; tipo 3 `gas` con corrección por factor calórico, presión, temperatura y coeficiente (RN-TAR-012, 035, 036, 229; RF-TAR-040). Envasado sin medidor: HUE-GAS-02. |
| Olas e hito de salida | **O7**: hito de salida = alta con certificado del matriculado, DDJJ de artefactos e inspección (CU-ESP-GAS); ciclo con consumo corregido (ESC-TAR-10); suspensión por mora con rehabilitación sujeta a inspección (RN-MOR-086). |

## 7.2 Configuración

**Perfil BASE §84** (M02 6.B; T04 RF-CFG-125), una variante por modalidad (DEC-030).

| Grupo | Parámetros |
|---|---|
| Alta | PRM-TEC-024 (dueño M10) y PRM-CAT-013 (lectura derivada; HUE-SRV-07) · PRM-TEC-043 (`require` en GAS; dueño M10) y PRM-CAT-015 (lectura derivada; HUE-ELE-04) · PRM-CAT-096 `cat.gas.requireApplianceAffidavit` (true) |
| Corrección (M04; DEC-085) | PRM-TAR-050 (factor calórico óptimo), PRM-TAR-051 (redondeo) y PRM-TAR-168 (exigir presión y temperatura), de los que M04 es dueño y con los que aplica la corrección (RN-TAR-035) · M03 conserva PRM-MED-091 `med.rule.missingGasFactor.severity` (`blocking`) para validar la lectura. Antes: PRM-MED-070 `med.gas.optimalCalorificFactor`, PRM-MED-071 `med.gas.rounding` y PRM-MED-072 `med.gas.requirePressureTemperature`, hoy reemplazados (HUE-GAS-03) |
| Corrección (M04) | PRM-TAR-050 `tar.gas.optimalCalorificFactor` (9.300) · PRM-TAR-051 `tar.gas.correctedRounding` (`round0`) · PRM-TAR-052 `tar.gas.useRealConsumption` |

Los parámetros de corrección están duplicados entre M03 y M04 (PA-TAR-19, HUE-GAS-03). Hasta consolidarlos, **Cursor IA debe leer un solo origen**: la opción A de PA-TAR-19 (M04).

**Datos maestros**: concesión y responsabilidad regulatoria (PAN-CAT-26; RF-FIS-150) → categorías y grupos con código regulatorio (PAN-CAT-08) → zona (Zona Fría) → profesionales matriculados (RF-TEC-106) → artefactos (RF-CAT-095) → factores calóricos por período y categoría (PAN-TAR-09 de M04; PAN-MED-20 de M03 quedó reemplazada, HUE-GAS-03) → cuadro tarifario (PAN-TAR-02) → medidores y rutas (PAN-MED-01, 05).

**Precarga demo ficticia**: GAS-RES "Gas residencial" (M02 §18); TEN-001 no tiene la capacidad habilitada (HUE-SRV-05). Corregido: TEN-001 habilita GAS (M02 §18).

## 7.3 Recorrido del ciclo de vida

| # | Paso | Anexo | IDs | Notas para construir |
|---|---|---|---|---|
| 1 | Oferta y landing | M19, M04 | RF-POR-004, 005, 006; PAN-POR-02, 03, 04; PAN-TAR-24 | Una oferta por modalidad (DEC-030). |
| 2 | Solicitud | M09, M19 | RF-CRM-060, 063; RF-POR-056, 059, 061; DEC-029 | El cambio de titular no traslada la deuda histórica del inmueble (M02 6.C.7). |
| 3 | Factibilidad y obra | M10 | RF-TEC-001, 003, 006, 148, 168..175; RN-TEC-093 | Extensión de red: obra con prorrateo. Envasado: no aplica. |
| 4 | Alta del contrato | M02 | §8.2 T01–T03; CU-ESP-GAS; RF-CAT-095; PAN-CAT-25; PRM-CAT-096, 015 | Orden obligatorio: certificado del instalador → DDJJ de artefactos → inspección → habilitación. |
| 5 | Instalación y medidor | M10, M03, M13 | RF-TEC-085, 091, 093, 106; RF-MED-012, 016; RN-MED-017; RF-STK-044, 062 | Alta = aprobación técnica y colocación del medidor. |
| 6 | Aprovisionamiento | — | **No aplica**; en distribuidora de referencia, intercambio de formularios (M02 6.C.7) con FI-INT-114 "Distribuidora de gas de referencia: intercambio de formularios" de T06 (antes `[REF-PENDIENTE]`; formularios y canal a relevar con el tenant piloto) | — |
| 7 | Lecturas y corrección | M03 | RF-MED-025, 043, 063; RN-MED-069, 070, 076, 078; PAN-MED-05..12, 20; JOB-MED-01, 03; CU-MED-01, 12; ESC-MED-17 | Sin factor del período, el consumo queda bloqueado (RN-MED-070). |
| 8 | Tarifa | M04 | RN-TAR-012 (tipo 3), 035, 036, 229; RF-TAR-040; PAN-TAR-09; ESC-TAR-10; CU-ESP-GAS (M04) | Se guarda el volumen medido, los factores y la cantidad resultante; no fijar coeficientes físicos en el código. |
| 9 | Facturación | M05 | RF-FAC-020, 029, 064, 065, 108, 121; JOB-FAC-01..04; EVT-FAC-07 | Recategorización por los últimos 6 o 12 períodos (RF-FAC-108). |
| 10 | Fiscal y regulador | M06, T06 | RF-FIS-033, 051, 137, 145, 150; FI-INT-24, 26; EVT-FIS-01 | SARI y FCU-DS; SEF y Zona Fría. |
| 11 | Cuenta corriente y cobro | M07 | RF-COB-001, 026, 032, 038; EVT-COB-01, 04 | — |
| 12 | Mora, corte y reconexión | M08, M10, M02 | RF-MOR-073, 100, 118..124, 128; RN-MOR-086; RF-CAT-066; RF-TEC-132..137; EVT-TEC-18, 19 | El pago no rehabilita: "Rehabilitación en trámite" (`reactivationPending`) hasta la inspección aprobada. |
| 13 | Reclamos y emergencias | M09, M10 | RF-CRM-100, 101, 105, 122; EVT-CRM-16; RF-TEC-176..181; PAN-TEC-41, 54 | Fuga de gas: prioridad crítica y teléfono de emergencia; **el bot no reemplaza la guardia ni decide sobre seguridad**. Las inspecciones por sospecha no son infracción (RF-TEC-176). |
| 14 | Cambios | M09, M02, M03 | DDJJ de artefactos: RF-CAT-095 (historial). Categoría: RF-FAC-108; `cat.contract.categoryChanged`. Titular: RF-CRM-071; DEC-045. Medidor: CU-TEC-07; EVT-TEC-22 | — |
| 15 | Baja | M09, M02, M03, M10 | RF-CRM-061, 067; RN-CRM-007; RF-CAT-088; RN-CAT-039; RF-MED-022 | Salida con lectura final, estado técnico y documentación (M02 6.C.7). |
| 16 | Portal del socio | M19 | RF-POR-054, 055, 069, 103; CU-POR-14; RN-POR-042; API-POR-125; PAN-POR-30, 47 (PAN-CAT-22 como componente embebido, HUE-SRV-04) | La DDJJ del portal es por servicio con la plantilla de M02 (gas: artefactos en kcal/h, FRM-DDJJ-GAS; RF-CAT-095, PAN-CAT-25). HUE-GAS-01 corregido; antes "definida para artefactos eléctricos". |
| 17 | Comunicaciones | T09 | §9.6 tipos 32–38, 41, 44, 45 | Aviso de emergencia por fuga: tipos T09 `tec.emergency.notice`, `tec.emergency.onCallAlert` y `tec.emergency.closed` (T09 §9.6.3), disparados por EVT-TEC-35 `tec.emergency.declared` / `.closed` y EVT-TEC-36 `tec.onCall.escalated` (antes `[REF-PENDIENTE]` en T09; HUE-GAS-05). |
| 18 | Reportes | M06, T10 | RF-FIS-145; RF-BIA-090; REP-BIA-022 Informes ENARGAS / ENReGE de gas (T10 §15.5.1; antes `[REF-PENDIENTE]`, HUE-SRV-08) | — |
| 19 | Contabilidad | M15 | RF-CON-066, 092 | Compra de gas a la distribuidora: igual que HUE-ELE-01 (HUE-GAS-04). Corregido: RF-CMP-152, PRM-CMP-114 de M12 y M-127 de M15. |
| 20 | Migración | T07, M02, M03 | RF-MIG-039; RN-MIG-020, 021; M02 6.C.7 (`ARTEFACTO`, `ARTEFSUMS`, `HIS_ARTEFSUMS`, `CORREGAS`, `FACTOR_CAL`, `PRCAGAS`, `GRP_CAT`, `ENGAS_CANTMESES`) | Los factores históricos se migran antes que los consumos. |

## 7.4 Reglas críticas

- **RN-MED-069 / RN-TAR-035**: volumen = red4(neto × presión × temperatura); cantidad = volumen × factor × coeficiente ÷ factor óptimo.
- **RN-MED-070**: el factor se busca por período, primero por categoría y después el general; sin factor, el consumo queda bloqueado.
- **RN-TAR-036**: se implementan los cinco modos de redondeo de PRM-TAR-051.
- **RN-TAR-229**: el método y los datos de origen se versionan; no se copian tarifas de otra modalidad.
- **RN-MOR-086 / RF-CAT-066**: la reconexión exige una inspección de rehabilitación aprobada; el pago no acredita una instalación segura.
- **PRM-CAT-096**: sin DDJJ de artefactos no se habilita.
- **RF-CRM-122**: una fuga de gas es una urgencia crítica con aviso inmediato a la guardia.

## 7.5 Pantallas

| App | Pantallas |
|---|---|
| landing | PAN-POR-02, 03, 04; PAN-TAR-24 |
| pwa-socio | PAN-POR-30, 38, 39, 47; PAN-CAT-22 como componente embebido en PAN-POR-29/30 (estado "Rehabilitación en trámite"; HUE-SRV-04) |
| admin | PAN-CAT-08, 14, 15, 25, 26; PAN-MED-02..12, 20; PAN-TAR-02, 09, 15, 17; PAN-FAC-05, 07; PAN-FIS-35, 36; PAN-TEC-01, 02, 41; PAN-CRM-03 |
| pwa-campo | PAN-MED-28, 29; PAN-TEC-50, 51, 54 |

## 7.6 Eventos y jobs

| Tipo | Elementos |
|---|---|
| Eventos | `cat.contract.*` (M02 §12.1); EVT-MED-01, 07, 11, 12; EVT-TAR-008; EVT-FAC-07; EVT-COB-04; EVT-MOR-12, 13; EVT-TEC-18, 19, 22; EVT-CRM-16; EVT-FIS-01 |
| Jobs | JOB-MED-01, 03, 05; JOB-TAR-03; JOB-FAC-01..04; JOB-MOR-02, 07 |

## 7.7 Escenarios

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| ESC-SRV-GAS-01 | Contrato GAS-RES; factor del período 9.300 kcal/m³; óptimo 9.300; coeficiente 1; PRM-TAR-051 = `round0`; cuadro ficticio con cargo fijo ARS 2.500 y ARS 300 por m³ | Se aprueba una lectura de 100 m³ con presión 1,0140 y temperatura 0,9870 | red4(100 × 1,0140 × 0,9870) = 100,0818 m³ → 100 m³ corregidos; neto = 2.500 + 100 × 300 = ARS 32.500,00, con factores y método en la traza (ESC-TAR-10). |
| ESC-SRV-GAS-02 (error) | No hay factor calórico de noviembre (ni por categoría ni general) | Se valida y se calcula | El consumo queda aprobado con su volumen medido y M04 excluye la cuenta con `TAR-E-GAS-FACTOR`; el lote continúa (RN-TAR-035, DEC-085; ESC-MED-17, ESC-TAR-10; antes "el consumo queda bloqueado por falta factor de gas"). |
| ESC-SRV-GAS-03 | PRM-CAT-096 = true; la solicitud tiene certificado del matriculado pero no DDJJ de artefactos | Se intenta habilitar el contrato | Se rechaza la habilitación; el contrato no pasa a Activo hasta cargar la DDJJ (PAN-CAT-25) y aprobar la inspección (CU-ESP-GAS). |
| ESC-SRV-GAS-04 | Contrato suspendido por mora con deuda de ARS 45.000 | El socio paga los ARS 45.000 | Estado "Rehabilitación en trámite"; se genera una OT de inspección y el contrato vuelve a Activo solo con la inspección aprobada (RN-MOR-086; RF-CAT-066). |
| ESC-SRV-GAS-05 | El socio escribe al bot "huele a gas en la cocina" | El bot clasifica el mensaje | Caso de urgencia crítica, aviso inmediato a la guardia y mensaje de seguridad con teléfono de emergencia; el bot no da instrucciones técnicas (RF-CRM-122). |
| ESC-SRV-GAS-06 | Un lecturista informa un precinto roto | Se abre un caso de inspección | El caso nace como `suspected`; el recupero solo se factura con método aprobado y aprobación explícita, nunca de forma automática (RF-TEC-176, 180). |
| ESC-SRV-GAS-07 (aislamiento) | TEN-001 tiene cargado el factor de noviembre y TEN-002 no | TEN-002 calcula su lote de gas | TEN-002 no usa el factor de TEN-001; sus cuentas de gas quedan excluidas con `TAR-E-GAS-FACTOR` (RN-TAR-035, DEC-085; antes "sus consumos quedan bloqueados por falta de factor"). |

## 7.8 Preguntas abiertas

| PA | Tema | Estado |
|---|---|---|
| PA-CAT-13 | Modalidades de gas | Respondida (DEC-030) |
| PA-TAR-19 | Propiedad de los factores de gas y de los cargos por evento | Abierta en M04 (recomendada la opción A); no figura en `02-preguntas-abiertas.md` (HUE-GAS-03). Estado: resuelta para los factores de gas (dueño M04; la corrección la aplica M04, DEC-085); la parte de cargos por evento sigue con la opción A asumida |
| PA-TEC-15 | Método de recupero en inspecciones | Ver M10 |
| PA-POR-16 | DDJJ en el portal | Ver M19 |
| PA-MOR-08 | Afectación cruzada | Asumida (DEC-072) |

## 7.9 Huecos

| ID | Hueco | Propuesta | Anexo |
|---|---|---|---|
| HUE-GAS-01 | **DDJJ de artefactos inconsistente**: M02 (RF-CAT-095, PRM-CAT-096) la define para gas; M19 (RF-POR-069, CU-POR-14) la define para artefactos **eléctricos** y vehículos eléctricos. | M19 debe aceptar una DDJJ por servicio con plantilla de M02 (gas: artefactos con potencia en kcal/h; ELE: artefactos eléctricos). | M19 POR, M02 CAT · **Estado (04-11-2026):** Corregido en anexo: M02 RF-CAT-095, PRM-CAT-096/110, PAN-CAT-25, API-CAT-41, FRM-DDJJ-GAS; M19 RN-POR-042, CU-POR-14, API-POR-125. |
| HUE-GAS-02 | **Gas envasado**: DEC-030 lo habilita como variante, pero no hay perfil de cálculo, stock de garrafas o cilindros, venta ni entrega. | Definir la variante envasado como venta con stock (M13) y entrega (M10), sin medidor ni corrección. | M02 CAT (con M13 STK, M04 TAR) · **Estado (04-11-2026):** Decisión: PA-CAT-17, respondida con la opción recomendada (DEC-082) |
| HUE-GAS-03 | **Factores de gas con doble dueño**: PRM-TAR-050..052 y PAN-TAR-09 frente a PRM-MED-070..072 y PAN-MED-20; PA-TAR-19 sin consolidar. | Consolidar PA-TAR-19 (opción A: dueño M04, M03 lee) con un DEC y eliminar el duplicado. | M04 TAR, M03 MED, `02-preguntas-abiertas.md` · **Estado (04-11-2026):** Corregido en anexo: M04 PRM-TAR-168, RN-TAR-035, PAN-TAR-09, CTR-TAR-38, PA-TAR-19; M03 PAN-MED-20, PRM-MED-070..072, `gasCorrectionFactors`, API-MED-66 y CTR-MED-06 reemplazados; la corrección la aplica M04 (DEC-085). |
| HUE-GAS-04 | **Compra de gas a la distribuidora** y conciliación de volúmenes, igual que HUE-ELE-01. | Proceso de compra y balance de volumen comprado contra facturado. | M12 (con M03, M15) · **Estado (04-11-2026):** Corregido en anexo: M12 RF-CMP-152, PRM-CMP-114, ESC-CMP-22; M03 RF-MED-129; M15 M-127, PRM-CON-187. |
| HUE-GAS-05 | **Protocolo de emergencias**: RF-CRM-122 da prioridad, pero no define turnos de guardia, plantilla T09 ni tiempo de respuesta. | Guardias en M10, plantilla de emergencia en T09 y SLA de reclamo de seguridad. | M10 TEC, T09 COM · **Estado (04-11-2026):** Corregido en anexo (parcial): M10 RF-TEC-231..233, RN-TEC-116, PRM-TEC-152..154, EVT-TEC-35/36, JOB-TEC-17; M09 RF-CRM-260, PRM-CRM-133; T09 `tec.emergency.*`; T11 EVT-TEC-35/36, JOB-TEC-17; pendiente: validar los tiempos del SLA de seguridad y de guardia con la distribuidora y el regulador. · **Estado (05-11-2026):** Corregido en anexo (parámetro con default propuesto; requiere validación legal): M10 RF-TEC-231..233, RN-TEC-116, PRM-TEC-152 `onCall.acceptanceMinutes`, PRM-TEC-153/154, EVT-TEC-35/36, JOB-TEC-17; M09 RF-CRM-260, PRM-CRM-133 `crm.sla.safetyTargets` (GAS 10/60/240 min); T09 `tec.emergency.*`; T11 EVT-TEC-35/36, JOB-TEC-17. Antes: parcial, pendiente validar los tiempos con la distribuidora y el regulador. |
| HUE-SRV-05, 07, 08 | Ver §0.4 | — | — |

---

# 8. ALU — Alumbrado público

## 8.1 Resumen

| Aspecto | Definición |
|---|---|
| Unidad central | Contrato accesorio del suministro eléctrico (`parentContractId` → ELE) o del inmueble cuando es una tasa (M02 6.C.8). Los suministros propios del municipio se facturan como ELE con la categoría "19 Alumbrado público". |
| Regulador | Ordenanza o convenio municipal. Cuando es una tasa por cuenta de terceros: convenio obligatorio (M06 RF-FIS-134), pasivo con el tercero (RF-FIS-136; M15 RN-CON-066) y rendición (RF-FIS-139). Ver también TAS en M02 6.C.15 (parte 2). |
| Perfil de cálculo ProCoop | "Fijos" (tipo 6): importe fijo o porcentaje sobre la energía. Como tributo de terceros: regla de tipo impuesto (RF-TAR-057; ESC-TAR-13). Obra de alumbrado: tipo 17 con índice (RN-TAR-073). |
| Olas e hito de salida | **O4** como tasa (regla `tasa_alumbrado`, exhibición separada, convenio) y **O7** como contrato accesorio con alta automática. Hito de salida = factura ELE con ALU en el bloque de terceros, cobro parcial imputado por prorrata y rendición aprobada al municipio. |

## 8.2 Configuración

**Perfil BASE §84** (M02 6.B; T04 RF-CFG-125). *Medidor y lecturas*, *Instalación* y *Aprovisionamiento*: "No aplica"; la base de cálculo es el consumo del ELE principal.

| Grupo | Parámetros y maestros |
|---|---|
| Alta automática | Regla en PAN-CAT-11 (evento = alta de ELE; destino = ALU; modo `propose` o `create`; `legalBasis`; filtros por localidad o categoría) (RF-CAT-086; RN-CAT-035, 036; DEC-023) |
| Tributo y convenio | Convenio con el municipio: CUIT, fundamento, vigencia, base, alícuota o importe, comisión y cuenta de pasivo (RF-FIS-134; PAN-FIS-33) · catálogo de tributos municipales (RF-FIS-141) |
| Tarifa | Regla `tasa_alumbrado` (tipo `tax`) y beneficio `bonif_alumbrado_social` (M04 §9.3.8) |

**Datos maestros**: municipio como persona jurídica (M01) → convenio (PAN-FIS-33) → tributo en el catálogo de M06 → regla de tarifa vinculada → regla de alta automática → localidades alcanzadas.

**Precarga demo ficticia**: PER-JUR-001 "Municipalidad Demo" con cuenta de alumbrado público (M01; RF-PER-069). No hay servicio ALU, convenio ni regla en TEN-001 (HUE-SRV-05). Corregido: TEN-001 habilita ALU y M02 §18 agrega el plan ALU-MUN con el convenio CONV-ALU-DEMO.

## 8.3 Recorrido del ciclo de vida

| # | Paso | Anexo | IDs | Notas para construir |
|---|---|---|---|---|
| 1 | Oferta y landing | — | **No aplica**: no se ofrece ni se contrata por el socio | — |
| 2 | Solicitud | — | **No aplica**: nace por regla automática (RF-CAT-086) | — |
| 3 | Factibilidad y obra | M04, M10 | RN-TAR-073; RF-TAR-049; RF-TEC-168..175; RF-PER-095 (`networkMeters.publicLightingM`) | Solo para cuotas de obra de alumbrado (contribución por mejoras). |
| 4 | Alta del contrato | M02 | RF-CAT-086; RN-CAT-035, 036; PAN-CAT-11; CU-CAT-09; JOB-CAT-01; CTR-CAT-05; DEC-023 | `create` solo si es obligatorio y tiene fundamento normativo; si no, `propose` con consentimiento. Sin duplicados. |
| 5 | Instalación | — | **No aplica** | — |
| 6 | Aprovisionamiento o medidor | — | **No aplica** | — |
| 7 | Lecturas | M04 | Base = consumo del ELE principal (`consumption('A')`, M04 §9.3.8) | Sin lecturas propias. |
| 8 | Tarifa | M04 | RN-TAR-012 (tipo 6, 17); RF-TAR-057; RN-TAR-073; ESC-TAR-13; CU-TAR-04 | — |
| 9 | Facturación | M05 | RF-FAC-120, 121 (importación IAL); JOB-FAC-01..04; EVT-FAC-07 | Bloque separado "por cuenta y orden de terceros"; sin convenio, el ítem queda bloqueado como excepción. |
| 10 | Fiscal | M06, T06 | RF-FIS-134, 135, 136, 137, 141; FI-INT-23, 32; EVT-FIS-01 | Concepto de terceros: no gravado ni ingreso propio, según convenio. |
| 11 | Cuenta corriente y cobro | M07, M06 | RF-COB-019, 177; RF-FIS-138; EVT-COB-01, 04; EVT-FIS-16 | Pago parcial: prorrata entre lo propio y lo de terceros (PA-FIS-05). |
| 12 | Mora, corte y reconexión | M08, M10 | EVT-TEC-20 `tec.dependentDisconnection.requested`; RF-MOR-073 | ALU sigue al principal; no se corta por separado. El efecto de la deuda de ALU sobre el corte de ELE no está definido (HUE-ALU-01). Corregido: RN-MOR-141, la deuda de terceros no habilita el corte salvo convenio y norma. |
| 13 | Reclamos | M09 | RF-CRM-100, 101, 259 | Reclamo por luminaria apagada: subtipo `dict:crm.claimType.alu.luminariaApagada` (T03 §10.9.12, RF-UXD-179); lo atiende el municipio o la cooperativa según el convenio del servicio (`domainAttributes.agreement.claimHandler` y PRM-CAT-111 de M02; derivación en M09 RF-CRM-259). Antes `[REF-PENDIENTE]` en T03 (HUE-ALU-03). |
| 14 | Cambios | M02 | RF-CAT-086 (cambio de categoría o domicilio como eventos de la regla) | El cambio de alícuota es una nueva versión del convenio (RF-FIS-134). |
| 15 | Baja | M02, M10 | EVT-TEC-20; M02 6.C.8 (baja junto con el principal) | — |
| 16 | Portal del socio | M19 | RF-POR-054, 055; PAN-POR-30 | Se ve dentro de la factura ELE, en el bloque de terceros. |
| 17 | Comunicaciones | T09 | §9.6 tipo 41 | — |
| 18 | Reportes | M06, T10 | RF-FIS-139 (reporte al organismo); PAN-FIS-34; REP-BIA-023 Rendición de alumbrado público al municipio (T10 §15.5.1; antes `[REF-PENDIENTE]`, HUE-SRV-08) | — |
| 19 | Contabilidad y pagos | M15, M14 | RN-CON-066; RF-FIS-136, 139; EVT-FIS-16, 17 | Emisión: pasivo con el municipio. Rendición: orden de pago en M14 que cancela el pasivo. |
| 20 | Migración | T07, M02, M06 | RF-MIG-039; RN-MIG-020, 021; M02 6.C.8; `abm_AltasEau` → PAN-CAT-11; `abm_Terceros` → PAN-FIS-33 | Migrar convenios y reglas antes que los contratos ALU. |

## 8.4 Reglas críticas

- **DEC-023 / CTR-CAT-05**: el alta automática directa (`create`) solo procede para servicios obligatorios con fundamento normativo; en los demás casos se propone.
- **RN-CAT-036**: una regla automática nunca crea un segundo contrato no terminado en la misma cuenta y punto.
- **RF-FIS-134 / RF-FAC-120**: sin convenio vigente y fundamento, el concepto de terceros se bloquea.
- **RF-FIS-135**: el concepto de terceros se exhibe separado del cargo propio.
- **RN-CON-066**: lo cobrado por cuenta de terceros es pasivo, no ingreso; la rendición cancela el pasivo.
- **RF-FIS-138**: los pagos parciales se imputan por prorrata entre lo propio y lo de terceros.
- **M02 6.C.8**: ALU sigue el estado del suministro principal y se da de baja con él.

## 8.5 Pantallas

| App | Pantallas |
|---|---|
| landing | No aplica |
| pwa-socio | PAN-POR-30 (factura con bloque de terceros) |
| admin | PAN-CAT-11, 14; PAN-FIS-33, 34; PAN-TAR-02, 15, 17; PAN-FAC-05, 07 |

## 8.6 Eventos y jobs

| Tipo | Elementos |
|---|---|
| Eventos | `cat.contract.*` (M02 §12.1); EVT-TEC-20; EVT-TAR-008; EVT-FAC-07; EVT-COB-04; EVT-FIS-16, 17 |
| Jobs | JOB-CAT-01 `cat:altas-automaticas` (idempotente por `(eventId, ruleId)`); JOB-FAC-01..04 |

## 8.7 Escenarios

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| ESC-SRV-ALU-01 | Regla ELE → ALU en modo `create` con `legalBasis` (ordenanza ficticia 100/2026) | Se da de alta un contrato ELE-RES en la localidad alcanzada | JOB-CAT-01 crea el contrato ALU con `parentContractId` del ELE y el grupo de facturación por defecto (RN-CAT-035). |
| ESC-SRV-ALU-02 | Regla en modo `propose` (sin fundamento normativo) | Se da de alta el ELE | Se crea una propuesta pendiente de consentimiento del socio; no se crea el contrato (DEC-023). |
| ESC-SRV-ALU-03 | El evento de alta del ELE se reprocesa por un reintento | JOB-CAT-01 lo vuelve a evaluar | No se crea un segundo ALU (idempotencia `(eventId, ruleId)`; RN-CAT-036). |
| ESC-SRV-ALU-04 | Regla `tasa_alumbrado` = consumo × 0,85 y beneficio social del 50 %; el socio está inscripto en tarifa social | Se calcula un ELE con 250 kWh | Tasa ARS 212,50 y bonificación −ARS 106,25, con la referencia entre reglas en la traza (ESC-TAR-13). |
| ESC-SRV-ALU-05 (error) | El convenio con el municipio venció el 31-10-2026 | Se emite la factura de noviembre | El ítem de alumbrado queda bloqueado como excepción, y el resto de la factura sigue su curso según la política (RF-FAC-120; RF-FIS-134). |
| ESC-SRV-ALU-06 | Factura de ARS 10.000 con ARS 1.000 de alumbrado de terceros | El socio paga ARS 5.000 | Se imputan ARS 500 al tercero por prorrata; se emite EVT-FIS-16 y M15 registra el pasivo (RF-FIS-138; RN-CON-066). |
| ESC-SRV-ALU-07 | Cobros de alumbrado de octubre por ARS 800.000 con comisión del 3 % | Se aprueba la rendición | Neto a rendir ARS 776.000; EVT-FIS-17 genera la orden de pago en M14 y cancela el pasivo (RF-FIS-139). |
| ESC-SRV-ALU-08 | Se da de baja el ELE principal | M10 ejecuta la desconexión | Se emite EVT-TEC-20 y el ALU dependiente se da de baja con el principal (M02 6.C.8). |
| ESC-SRV-ALU-09 (aislamiento) | TEN-001 tiene un convenio vigente con Municipalidad Demo | TEN-002 emite una factura con alumbrado | TEN-002 no ve ni usa el convenio de TEN-001; sin convenio propio, el ítem queda bloqueado. |

## 8.8 Preguntas abiertas

| PA | Tema | Estado |
|---|---|---|
| PA-CAT-04 | Altas automáticas de servicios opcionales | Respondida (DEC-023) |
| PA-FIS-05 | Pagos parciales con conceptos de terceros | Asumida (DEC-072): prorrata |

## 8.9 Huecos

| ID | Hueco | Propuesta | Anexo |
|---|---|---|---|
| HUE-ALU-01 | **Mora por deuda de terceros**: no se define si la deuda de la tasa de alumbrado (concepto de terceros) cuenta para el corte del ELE principal. | RN-MOR: los conceptos de terceros no habilitan el corte del servicio principal salvo que el convenio y la norma lo prevean. | M08 MOR (con M06) · **Estado (04-11-2026):** Corregido en anexo: M08 RN-MOR-141, RF-MOR-223, PRM-MOR-202, ESC-MOR-55. |
| HUE-ALU-02 | **Doble modelado**: ALU como contrato accesorio tipo 6 (M02 6.C.8) y como regla de tipo impuesto sobre el ELE (RF-TAR-057); falta el criterio para elegir uno u otro y evitar el doble cobro. | Criterio por tenant y validación que impida tener activos a la vez un contrato ALU y una regla `tasa_alumbrado` sobre el mismo ELE. | M02 CAT, M04 TAR · **Estado (04-11-2026):** Corregido en anexo: M02 RN-CAT-076, PRM-CAT-111; M04 RF-TAR-057. |
| HUE-ALU-03 | **Reclamos de alumbrado** (luminaria apagada) sin categoría ni derivación al municipio. | Tipo de reclamo con derivación según el convenio. | M09 CRM, T03 · **Estado (04-11-2026):** Corregido en anexo: T03 `crm.claimType.alu.luminariaApagada` (RF-UXD-179); M09 RF-CRM-259, PRM-CRM-134; M02 PRM-CAT-111. |
| HUE-SRV-05, 08 | Ver §0.4 | — | — |
