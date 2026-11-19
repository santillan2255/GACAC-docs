# T12 SRV — Fichas verticales por servicio · Parte 2 (DEC-073)

| Campo | Valor |
|---|---|
| Código | T12 SRV (Parte 2 de 2) |
| Versión | 1.0 |
| Estado | Borrador para revisión (generado a partir de los anexos vigentes; no crea requisitos nuevos) |
| Decisión | DEC-073 (fichas verticales por servicio como índice de construcción y prueba punta a punta) |
| Dominios | OBR pavimento y obras / contribución por mejoras · SEP sepelio y subsidio por fallecimiento · CEM cementerio parque · SAN banco de sangre por convenio · SAL ambulancias y salud · VIV planes de vivienda · TAS tasas y conceptos por cuenta de terceros · CAP capital social como concepto · OTR otras prestaciones |
| Olas | O2 (catálogo, landing y portal: CEM catálogo), O4 (adherentes y `billing-inputs` de M18 por DEC-071; TAS; CAP si el piloto factura capital), O5 (capital mínimo por DEC-019; cobro y rendición de terceros), O6 (mora), O7 (OBR, tipo 17), O10 (SEP, CEM operación, SAN, SAL, VIV, CAP completo, OTR), O11 (migración repetible y BI) |
| Fuentes | 00-ESPECIFICACION-MAESTRA (§4, §12), 01-registro-decisiones (DEC-001 a DEC-073), 02-preguntas-abiertas, M01 PER, M02 CAT (§6.C.9 a §6.C.17, §18, §19), M04 TAR, M05 FAC, M06 FIS, M07 COB, M08 MOR, M09 CRM, M10 TEC (obras), M15 CON, M17 INS, M18 SOC, M19 POR, T07 MIG (§19), T09 COM, T10 BIA, T11 WFL |
| Dueño de datos | Ninguno. T12 no es dueño de colecciones, eventos ni pantallas (maestro §12); solo ordena IDs existentes por servicio. |


> **Norma de implementación (DEC-111, DEC-112, DEC-110, DEC-113).** Construcción GoodApps: **.NET 10**, **ASP.NET Core**, **EF Core**, **Azure SQL** (base compartida, `TenantId` en tablas de negocio), front **React 19**, **Microsoft Azure** (Container Apps, Blob, Queue, Key Vault, Application Insights), identidad **OpenIddict**. Modelo físico: `07-modelo-relacional-azure-sql.md` y `07-catalogo-tablas-sql.md`. Checklist e impacto: `06-impacto-adaptacion-stack-goodapps.md` (**DIR-13**).
>
> **Lectura:** «colección» en este anexo = **entidad lógica**; tablas, columnas y FK en `07-*`. RF/RN/CU del anexo **no cambian** por el stack.


## Propósito

Cada ficha permite a Cursor IA **construir y probar un servicio de punta a punta** recorriendo su ciclo de vida completo con los IDs que ya existen en los anexos (RF-, RN-, PAN-, API-, EVT-, JOB-, PRM-, CU-, PA-, DEC-). La ficha **no repite** el contenido de los anexos: indica qué ID leer en cada paso, en qué ola entra y qué escenario lo valida.

Reglas de uso:

1. Si un paso dice **No aplica**, no se construye nada para ese servicio en ese paso.
2. `[REF-PENDIENTE]` indica que el anexo responsable existe pero todavía no tiene el ID que el paso necesita (anexos incompletos T03, T09, T10, T11). Se construye con el contrato del anexo dueño y se completa la referencia cuando el anexo se cierre. Al 04-11-2026 no quedan marcas abiertas: todas se reemplazaron por el ID real del anexo dueño, conservando la marca original como "antes `[REF-PENDIENTE]`".
3. Los **HUECOS** son faltantes o contradicciones entre anexos detectados al armar la ficha; cada uno trae una propuesta y el anexo que debería resolverlo. No se implementan hasta que el anexo se corrija.
4. Todos los datos de ejemplo son **ficticios** (tenants TEN-001 "Cooperativa Ejemplo A" y TEN-002 "Cooperativa Ejemplo B", R14 del plan; antes "Demo Norte" y "Demo Sur"; importes en ARS). Ninguna ficha usa datos de la base de demostración real.
5. Convenciones transversales que no se repiten en cada ficha: `tenantId` en todo documento y primero en índices, tenant tomado del token (DEC-002); dinero en `Decimal128` con decimal.js; eventos `<mod>.<entidad>.<hecho>` por outbox (RF-WFL-001, RF-WFL-003); jobs `<mod>:<proceso>` (RF-WFL-020); errores RFC 9457; `Idempotency-Key` en altas y comandos; textos `dict:`.

## Matriz dominio × anexo

Leyenda: **D** dueño del dato o del proceso principal · **P** participa · **—** no interviene.

| Dominio | M01 | M02 | M04 | M05 | M06 | M07 | M08 | M09 | M10 | M15 | M17 | M18 | M19 | T07 | T09 | T10 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| OBR | P (inmueble) | P (contrato tipo 17) | P (cuota) | P | P | P | P | P | **D** (obra, padrón, prorrateo) | P | — | — | P | P | P | P |
| SEP | P | P | P | P | — | P | P | P | — | P | — | **D** | P | P | P | P |
| CEM | P | P | P | P | — | P | P | P | — | P | — | **D** | P | P | P | P |
| SAN | P | P | — | — (sin precio) | — | — | P (restricción) | P | — | P | — | **D** | P | — | P | P |
| SAL | P | P | P | P | — | P | P | P | — | P | — | **D** | P | P | P | P |
| VIV | P | P | P | P | — | P | P | P | — | P | — | **D** | P | P | P | P |
| TAS | P | P | P | P | **D** (convenio, rendición) | P | P | — | — | P | — | — | P | P | — | P |
| CAP | P | P | — | P | — | P | P | P | — | P | **D** | — | P | P | P | P |
| OTR | P | P | P | P | — | P | — | P | — | P | — | **D** | P | P | P | P |

## HUECOS transversales (aplican a varias fichas)

| ID | Hueco | Propuesta | Anexo que debería cubrirlo |
|---|---|---|---|
| HUECO-TRV-01 | **Adherentes con tres dueños**: M01 (RF-PER-109 a RF-PER-117, EVT-PER-19, PRM-PER-064 a PRM-PER-072), M02 (RF-CAT-080, PAN-CAT-20, API-CAT-40, colección `contractMembers`, JOB-CAT-07, JOB-CAT-11, PRM-CAT-060 a PRM-CAT-067) y M18 (`serviceDependents`, RF-SOC-011 a RF-SOC-030, EVT-SOC-01, PRM-SOC-001 a PRM-SOC-013, JOB-SOC-01). T07 §19.1 mapea `ADHSOC` a `serviceDependents` con dueño M01, y M02 §19.1 lo mapea a `contractMembers`. | M18 es dueño único de adherentes y beneficiarios (DEC-071); M02 solo declara en la ficha del servicio si admite miembros; M01 solo muestra. Eliminar `contractMembers`, JOB-CAT-07, JOB-CAT-11 y los PRM duplicados de M01/M02; T07 apunta `ADHSOC`/`BENSOC` a M18. | M18 (confirmar), M01, M02, T07, T05 · **Estado (04-11-2026):** Corregido en anexo: M18 §2.2, RF-SOC-149; M01 RF-PER-109..117, RN-PER-082..091, PRM-PER-064..072, EVT-PER-19, JOB-PER-06 (reemplazados por M18); M02 RF-CAT-080, PAN-CAT-20, API-CAT-40, PRM-CAT-060..067, JOB-CAT-11, EVT-CAT-23 (reemplazados); T07 ADHSOC, RN-MIG-054; T05 COL-CAT-23, COL-PER-11; T11 EVT-CAT-23 → EVT-SOC-01, JOB-CAT-11 (DEC-071). |
| HUECO-TRV-02 | **Consumidores con nombres de evento no canónicos**. T11 §12.4 ya registra como alias `per.serviceContract.*` → `cat.contract.*`, `fac.invoice.voided` → EVT-FAC-08 `fac.invoice.annulled`, `cob.payment.reversed` → EVT-COB-05 / EVT-COB-06, `fac.batch.issued` → EVT-FAC-05, `fac.cycle.closed` → EVT-FAC-17, `cmp.purchaseInvoice.posted` → EVT-CMP-08, `tes.paymentOrder.paid` → EVT-TES-15 y `stk.movement.posted` → EVT-STK-01 / EVT-STK-02, pero los anexos consumidores (M18 §12, M17 JOB-INS-01, M02) siguen usando el alias. `crm.request.admitted` (consumido por M02 para crear el contrato, DEC-011) figura en T11 §12.4 como migración a comandos pendiente (PA-WFL-01). T09 usa `soc.dependent.cameOfAge` (RN-COM-036, catálogo n.º 77) además de EVT-SOC-02 `soc.dependent.majorityReached`, y ese alias no está en T11 §12.4. | Construir siempre con el nombre canónico del productor; corregir los consumidores en sus anexos y agregar `soc.dependent.cameOfAge` a T11 §12.4. | M18, M17, M02, T09, T11 · **Estado (04-11-2026):** Corregido en anexo: consumidores de M02, M17 y M18 usan el canónico; `soc.dependent.cameOfAge` figura como alias en T11 §12.4. |
| HUECO-TRV-03 | **M02 no asigna IDs EVT-CAT** a sus eventos; T11 §12.3 les asigna IDs provisionales EVT-CAT-01 a EVT-CAT-25 (por ejemplo EVT-CAT-09 `cat.contract.activated`, EVT-CAT-15 `cat.contract.terminated`, EVT-CAT-23 `cat.contract.memberAdded/.memberRemoved`). | Las fichas usan los IDs provisionales de T11; M02 debe adoptarlos en su §12. EVT-CAT-23 desaparece si se resuelve HUECO-TRV-01. | M02, T11 · **Estado (04-11-2026):** Corregido en anexo: M02 adoptó EVT-CAT-01..25 sin "(prov.)" en T11 (CTR-WFL-04 resuelto). |
| HUECO-TRV-04 | **Pantallas duplicadas de oferta**: M02 define PAN-CAT-21 (`/servicios/disponibles`), PAN-CAT-22 (`/servicios/mios`) y PAN-CAT-23 (`/:tenantSlug/servicios`); M19 define PAN-POR-02, PAN-POR-03, PAN-POR-29 y PAN-POR-31 con otras rutas. Las pantallas sociales del socio (PAN-SOC-30 a PAN-SOC-33, PAN-INS-30) no figuran en el mapa del sitio de M19 ni de T03. | M19 es dueño de la presentación; M02 aporta API (API-CAT-49 a API-CAT-51) y M18/M17 aportan API y contenido de sus tarjetas; T03 incorpora las rutas al mapa del sitio. | M19, M02, T03 · **Estado (04-11-2026):** Corregido en anexo: M19 RF-POR-174, PAN-POR-98..103, §10.6.A, API-POR-126/127; M02 PAN-CAT-21/22/23 (componentes embebidos en PAN-POR-31, 29/30, 02/03); T03 SM-PWS-038/039, SM-PWS-046..048. |
| HUECO-TRV-05 | **Catálogo consolidado de reportes incompleto**: T10 §15.4 llega hasta M09/M10; no consolida REP-SOC, REP-INS ni los de M11 a M19. | Completar T10 §15.4.6 en adelante con REP-SOC-01 a REP-SOC-23 y REP-INS-01 a REP-INS-20. | T10 · **Estado (04-11-2026):** Corregido en anexo: T10 §15.4 (nota de verificación: REP-SOC-01..23, REP-INS-01..20, REP-VEN y REP-CMP consolidados). |
| HUECO-TRV-06 | **Contrato del servicio en M01**: RF-SOC-088 dice "contrato tipo plan de vivienda en M01", EVT-SOC-05 tiene como consumidor "M01 (contrato de mantenimiento)" y T07 §19.1 asigna `SERSOC` a M01, cuando el contrato es de M02 (DEC-011, DEC-012). | Reemplazar por M02 en los tres lugares. | M18, T07 · **Estado (04-11-2026):** Corregido en anexo: M18 §2.2, RF-SOC-088, EVT-SOC-05, `serviceDependents.contractId` (T05 COL-SOC-01, §7.2; antes `serviceContractId`), `burialRights.maintenanceContractId`; T07 SERSOC, SERSOC_HST, SERSOC_EXTRAS; T11 EVT-SOC-05. |

---

## Ficha OBR — Pavimento y obras, cuotas de obra, contribución por mejoras

### 1. Resumen (OBR)

| Campo | Valor |
|---|---|
| Unidad central | Obra (`works`, M10 §7.18) con padrón de beneficiarios por inmueble (`workBeneficiaries`); por cada beneficiario, un contrato de servicio de perfil "Cuotas de obras" (M02 §6.C.9) con su plan de cuotas `worksInstallmentPlans` (M04 §7.16). |
| Régimen | Contribución por mejoras: solo se cobra con base aprobada (ordenanza, convenio o asamblea) y criterio de prorrateo explícito (RF-TEC-171, RN-TEC-093). Puede ser obra propia o por cuenta de un municipio (en ese caso, ver la ficha TAS). |
| Perfil de cálculo ProCoop | Tipo 17 "Cuotas de obras" con variantes pavimento, alumbrado, cloaca, agua y vivienda (RN-TAR-070 a RN-TAR-076); la variante vivienda se trata en la ficha VIV. Atributos heredados de `SERSOC_EXTRAS`: CNT_CUOTAS, CNT_UNIDADES, CNT_UNIDADES_FACTURADAS, CNT_UNIDADES_TOTALES, CNT_CUOTAS_PAGAS, PORC_INST_BASICAS, PORC_INST_REDES, CNT_UNIDADES_ORIGINAL, COD_PLA. |
| Olas | O7 completo (M02 §6.C.9, RF-TEC-168 a RF-TEC-175, RF-TAR-031, RF-TAR-049). Cobro con O5 y mora con O6 ya disponibles. |
| Hito de salida O7 | CU-TEC-09 ejecutado en TEN-001: OBR-DEMO-01 aprobada, prorrateada entre 4 frentistas, primera cuota emitida, cobrada e imputada, y avance de cuotas confirmado por la emisión. |

### 2. Configuración (OBR)

- **Perfil BASE §84 en M02**: ficha §6.C.9 (perfil "Cuotas de obras", estado `active` → `terminated` al agotar cuotas, baja anticipada con cancelación V2 2316, grupos de obra V2 2900); dimensiones del perfil en `tenantServices.profile.*` (M02 §6.B).
- **PRM relevantes**: PRM-CAT-072 (baja con cuotas pendientes: `supervisor` por defecto), PRM-CAT-070 (vigencia máxima de "No facturar"), PRM-FAC-062 (no emitir comprobantes solo de cuotas sin ítems de servicio), PRM-CAT-081 (factura separada por servicio, DEC-034).
- **Datos maestros**: inmueble con nomenclatura catastral y metros de frente (RF-PER-095); obra, tipo, grupo y base aprobada (RF-TEC-168, RF-TEC-169, RF-TEC-171); padrón importable (RF-TEC-172); coeficientes por categoría con vigencia (RF-TAR-025, PAN-TAR-10); índice de inflación para alumbrado (RN-TAR-073); criterio de prorrateo (RF-TEC-173, PA-TEC-16 asumida por DEC-072: metros de frente).
- **Precarga demo ficticia**: OBR-DEMO-01 "Pavimento calle Demo" por ARS 1.000.000 con 4 frentistas de 10, 20, 30 y 40 m que reciben ARS 100.000, 200.000, 300.000 y 400.000 (CU-TEC-09). Plan de 10 cuotas por contrato (dato de ficha, no de anexo).

### 3. Recorrido del ciclo de vida (OBR)

| Paso | Qué ocurre | IDs |
|---|---|---|
| Oferta y landing (M19) | **No aplica** a la contratación: la obra no se ofrece en el catálogo, la impone la base aprobada. Se puede publicar un aviso informativo de la obra. | RF-COM-001 (noticia en landing) |
| Solicitud (M09) | **No aplica** al alta. Consultas y reclamos de cuota usan los casos genéricos; la baja anticipada con cancelación entra como solicitud de baja. | RF-CRM-061, RF-CRM-065 |
| Alta, adhesión y grupo familiar (M02/M01/M18) | Aprobación de la contribución en M10 → creación de un contrato tipo 17 por beneficiario del padrón, vinculado al inmueble. Grupo familiar **No aplica**. | RF-TEC-172, RF-TEC-173, PAN-TEC-40, API-TEC-36, EVT-TEC-25, API-CAT-33; HUECO-OBR-01, RF-CAT-115, JOB-CAT-13 `cat:crear-contratos-obra` (un contrato por beneficiario, idempotente por obra + inmueble), RF-TAR-116, JOB-TAR-14 `tar:crear-planes-obra` (corregido) |
| Carencias, convenios y prestación (M18) | **No aplica** (CTR-SOC-10: obras en M10/M04). | — |
| Cálculo (M04) | Cuota n/N según variante; última cuota ajusta saldo; plan agotado no factura; errores tipados. | RF-TAR-031, RF-TAR-049, RN-TAR-070 a RN-TAR-074, RN-TAR-076, `TAR-E-WORKS-TYPE`, `TAR-E-WORKS-PROPERTY`, `TAR-E-WORKS-METERS`, `TAR-E-WORKS-PLAN`, `TAR-E-INDEX-MISSING`, JOB-TAR-03, EVT-TAR-008 |
| Facturación (M05) | La cuota entra como ítem del servicio "Cuotas de obras" en documento propio o junto al servicio según ficha; el avance de cuotas se confirma con la emisión y se revierte con la anulación. | RF-FAC-116, RF-FAC-117, RF-FAC-119, RF-FAC-101, PAN-FAC-11 (modal de obra), EVT-FAC-07, EVT-FAC-08, DEC-034, DEC-037 |
| Fiscal y terceros (M06) | Obra propia: IVA según categoría resuelto por M06. Obra por cuenta del municipio: concepto de terceros con convenio (ver ficha TAS). | RF-TAR-056, RF-FIS-134, RF-FIS-135, RF-FIS-141 |
| Cuenta corriente y cobro (M07) | Cuota como obligación genérica del servicio; imputación por antigüedad con recargos primero. | RF-COB-074, RN-COB-025, PAN-COB-10, EVT-COB-04, DEC-048 |
| Mora y efecto sobre la cobertura (M08) | Saldo elegible para mora y convenio de pago; no hay servicio que suspender; la afectación cruzada a otros servicios está deshabilitada por defecto. M08 consume la contribución aprobada. Corregido (HUECO-OBR-01, HUECO-OBR-02): M08 ya no consume EVT-TEC-25; la obra se cobra por el plan tipo 17 (RN-TEC-115, PRM-TEC-155) y el convenio de M08 solo refinancia cuotas vencidas (RN-MOR-146, PRM-MOR-207). | RF-MOR-068, RF-MOR-069, RF-MOR-148, RN-MOR-082, EVT-TEC-25, JOB-MOR-02, PA-MOR-08; HUECO-OBR-02 |
| Solicitud de prestación o uso (M18/M09) | **No aplica**. | — |
| Cambios y bajas (M01) | Fin automático al agotar cuotas; baja anticipada con cancelación del saldo (requiere supervisor); transferencia del inmueble con deuda en el titular saliente; fallecimiento → sucesión. | JOB-CAT-12 `cat:fin-cuotas-obra`, RN-CAT-072, PRM-CAT-072, RF-CAT-084, DEC-045, RF-PER-009, RF-PER-141, EVT-PER-03 |
| Portal (M19) | Detalle del servicio, facturas con apertura por servicio y convenios. | PAN-POR-30, PAN-POR-38, PAN-POR-39, PAN-POR-46; HUECO-OBR-03 (corregido: RF-POR-176, API-POR-123, RF-TAR-119) |
| Comunicaciones (T09) | Aviso al frentista de la contribución aprobada y del plan de cuotas con el tipo T09 `tec.levy.approved` (T09 §9.6.3), disparado por EVT-TEC-25 (antes `[REF-PENDIENTE]`: T09 no tenía tipo para `tec.levy.approved`; HUECO-OBR-01). Avisos de mora por los tipos generales. | `tec.levy.approved` (T09, EVT-TEC-25), `mor.notice.reminder` (T09, EVT-MOR-09) |
| Reportes (T10) | Avance de obra y cobrado sobre emitido; recursos asignados a obras. | REP-TEC-020, REP-TEC-027 (T10 §15.4.5) |
| Contabilidad (M15) e institucional (M17) | Cuenta del grupo de obra y distribución por sección; M17 **No aplica**. | RN-CON-033, RF-CON-085, RF-TEC-169 |
| Migración (T07, tablas CAT) | `OBRAS` → `works`, `GRPOBRA` → `workGroups` (T07 §19.10); `SERSOC_EXTRAS` (CNT_*) → plan de cuotas. Corregido: `OBRAS` y `GRPOBRA` en O7 y `CNT_*` → `worksInstallmentPlans` de M04 (RN-MIG-053). | T07 §19.10, T07 §19.1 (`SERSOC_EXTRAS`), M02 §19.1; HUECO-OBR-04, HUECO-OBR-05 |

### 4. Reglas críticas (OBR)

- RN-TEC-093: sin base aprobada y criterio de prorrateo explícito no se cobra.
- RF-TEC-173: la suma de cuotas es igual al costo a distribuir, con redondeo explícito.
- RN-TAR-070: tipo 17 exige tipo de obra (`TAR-E-WORKS-TYPE`).
- RN-TAR-071: el avance del plan se confirma al emitir, nunca al calcular.
- RN-TAR-072: pavimento toma unidades del inmueble; la última cuota ajusta el saldo; plan agotado no factura.
- RN-TAR-073: alumbrado exige metros y, si hay índice, ajusta por inflación (`TAR-E-INDEX-MISSING`).
- RN-CAT-072: baja con cuotas pendientes solo con supervisor (PRM-CAT-072).
- DEC-045: en la transferencia del inmueble la deuda queda en el titular saliente.

### 5. Pantallas (OBR)

| App | Pantallas |
|---|---|
| admin | PAN-TEC-39 `/admin/tec/works`, PAN-TEC-40 `/admin/tec/works/:id/levy`, PAN-CAT-13, PAN-CAT-14, PAN-CAT-16 (baja anticipada), PAN-TAR-10 (coeficientes), PAN-TAR-15 (simulador), PAN-FAC-11 (modal de obra), PAN-COB-10 |
| pwa-socio | PAN-POR-30 (bloque "Plan de cuotas de obra", RF-POR-176, API-POR-123), PAN-POR-38, PAN-POR-39, PAN-POR-46 (con PAN-MOR-39 como componente embebido, HUE-SRV-04) |
| landing | No aplica |

### 6. Eventos y jobs (OBR)

- Emite: EVT-TEC-25 `tec.levy.approved`; EVT-CAT-09 `cat.contract.activated` / EVT-CAT-15 `cat.contract.terminated` (IDs provisionales de T11 §12.3, HUECO-TRV-03) (ya adoptados por M02 §12.1); EVT-TAR-008; EVT-FAC-07; EVT-COB-04.
- Consume: EVT-TEC-25 (M05, M08); al 04-11-2026 los consumidores de EVT-TEC-25 son M02 (JOB-CAT-13), M04 (JOB-TAR-14) y T09 (`tec.levy.approved`); salen M05 y M08 (T11 §12.3, HUECO-OBR-01); EVT-FAC-07 y EVT-FAC-08 (M04, avance o reversión del plan); EVT-FAC-17 `fac.billingCycle.closed` (M02, fin de cuotas de obra → JOB-CAT-12).
- Jobs: JOB-TAR-03 `tar:calcular-lote`, JOB-FAC-03 `fac:emitir-lote`, JOB-CAT-12 `cat:fin-cuotas-obra`, JOB-MOR-02 `mor:evaluar-mora`.

### 7. Escenarios de prueba punta a punta (OBR)

| ID | Dado / Cuando / Entonces |
|---|---|
| ESC-T12-OBR-01 | **Dado** OBR-DEMO-01 de ARS 1.000.000 con base aprobada y frentistas de 10, 20, 30 y 40 m en TEN-001, **cuando** se aprueba el prorrateo por metros de frente, **entonces** se publica `tec.levy.approved` con ARS 100.000, 200.000, 300.000 y 400.000 y la suma es exactamente ARS 1.000.000 (CU-TEC-09). |
| ESC-T12-OBR-02 | **Dado** el contrato del frentista de 20 m con plan de 10 cuotas, **cuando** corre `tar:calcular-lote` y se emite el lote, **entonces** la factura lleva "Cuota 1/10" por ARS 20.000, el plan pasa a 1 cuota facturada y, al anular la factura (EVT-FAC-08), vuelve a 0. |
| ESC-T12-OBR-03 | **Dado** el mismo contrato con 9 cuotas facturadas y ARS 0,03 de redondeo acumulado, **cuando** se calcula la cuota 10, **entonces** cobra el saldo exacto y, tras emitirla, JOB-CAT-12 pasa el contrato a `terminated`. |
| ESC-T12-OBR-04 (error) | **Dado** un contrato tipo 17 de pavimento sin inmueble asociado, **cuando** se calcula, **entonces** el renglón falla con `TAR-E-WORKS-PROPERTY` en formato RFC 9457 y el contrato queda en la bandeja de excepciones del lote sin emitir factura. |
| ESC-T12-OBR-05 (error) | **Dado** OBR-DEMO-02 sin base aprobada adjunta, **cuando** el responsable intenta aprobar el prorrateo en PAN-TEC-40, **entonces** recibe 422 y no se crea ningún contrato tipo 17 (RN-TEC-093). |
| ESC-T12-OBR-06 (aislamiento) | **Dado** un usuario de TEN-002 con `tec.obras.gestionar` (antes `tec.work.manage`), **cuando** consulta `GET /admin/tec/works/{id de OBR-DEMO-01}`, **entonces** recibe 404 y no ve la obra ni sus beneficiarios. |
| ESC-T12-OBR-07 | **Dado** un frentista con 4 cuotas impagas y PRM-CAT-072 = `supervisor`, **cuando** un operador pide la baja anticipada, **entonces** la acción exige aprobación de supervisor, emite la cancelación del saldo y no suspende ningún otro servicio de la cuenta (RF-MOR-069). |

### 8. Preguntas abiertas (OBR)

- PA-TEC-16 (criterio de prorrateo): asumida por DEC-072 con metros de frente.
- PA-MOR-08 (afectación cruzada en cuenta unificada): pendiente en M08; por defecto deshabilitada.
- PA-FIS-05 (prorrata entre propio y terceros en pagos parciales): asumida por DEC-072; aplica si la obra es por cuenta del municipio.

### 9. HUECOS (OBR)

| ID | Hueco | Propuesta | Anexo |
|---|---|---|---|
| HUECO-OBR-01 | No hay proceso ni job que, a partir de EVT-TEC-25, cree los contratos tipo 17 en M02 y los `worksInstallmentPlans` en M04 (RF-TEC-173 solo dice "envío a M05/M08"). | Consumidor de `tec.levy.approved` en M02 que crea un contrato por beneficiario (API-CAT-33) y en M04 que crea el plan; job `cat:crear-contratos-obra` idempotente por obra + inmueble. | M10, M02, M04 · **Estado (04-11-2026):** Corregido en anexo: M10 RF-TEC-173, EVT-TEC-25 (payload y consumidores); M02 RF-CAT-115, JOB-CAT-13; M04 RF-TAR-116, JOB-TAR-14; T09 tipo `tec.levy.approved`; T11 EVT-TEC-25, JOB-CAT-13, JOB-TAR-14. |
| HUECO-OBR-02 | RF-TEC-173 permite cobrar la obra "en cuotas o plan de pago", pero no define cuándo va por plan de cuotas tipo 17 (M04) y cuándo por convenio de M08. | Regla en M10: por defecto plan tipo 17; convenio de M08 solo para refinanciar cuotas vencidas. | M10, M08 · **Estado (04-11-2026):** Corregido en anexo: M10 RN-TEC-115, PRM-TEC-155; M08 RN-MOR-146, PRM-MOR-207, ESC-MOR-59. |
| HUECO-OBR-03 | El portal no muestra el plan de cuotas (cuota actual n/N, saldo, unidades). | Agregar bloque "Plan de cuotas de obra" en PAN-POR-30 con API de M04 de solo lectura. | M19, M04 · **Estado (04-11-2026):** Corregido en anexo: M19 RF-POR-176, PAN-POR-30, API-POR-123; M04 RF-TAR-119, API-TAR-066. |
| HUECO-OBR-04 | Ola de migración: T07 §19.10 asigna `OBRAS` y `GRPOBRA` a O8, mientras M10 y M02 §6.C.9 los ubican en O7. | Alinear T07 a O7. | T07 · **Estado (04-11-2026):** Corregido en anexo: T07 §19.10, §9.1 (`OBRAS` y `GRPOBRA` en O7). |
| HUECO-OBR-05 | T07 §19.1 mapea `SERSOC_EXTRAS` a `serviceContracts.extras`, pero M04 guarda el plan en `worksInstallmentPlans` (RN-TAR-071). | Mapear CNT_* a `worksInstallmentPlans` y dejar en `extras` solo los atributos no tarifarios. | T07, M04 · **Estado (04-11-2026):** Corregido en anexo: M04 RN-TAR-071, §7.16, §19.2; T07 RN-MIG-053 (`CNT_*` → `worksInstallmentPlans`). |

---

## Ficha SEP — Sepelio y subsidio por fallecimiento

### 1. Resumen (SEP)

| Campo | Valor |
|---|---|
| Unidad central | Contrato del servicio de sepelio (M02 §6.C.10) con su **grupo de cobertura** (adherentes y beneficiarios, `serviceDependents` de M18) bajo un **plan de cobertura** (RF-SOC-001). Las prestaciones nacen de una **solicitud de prestación** (RF-SOC-031) que da lugar a un caso de sepelio (RF-SOC-039) o a un expediente de subsidio (RF-SOC-044). |
| Régimen | Servicio social por adhesión voluntaria; alta automática solo con fundamento normativo o con consentimiento (DEC-023, RF-CAT-086). Sepelio, subsidio y cementerio son independientes (RF-SOC-047). |
| Perfil de cálculo ProCoop | Perfil Adherentes, tipos 9 a 13 (categoría por cantidad, tarifa por adherente por edad, vínculo y ocupación, franquicia `COBRAEXCEDENTE`); cobertura desde = alta + carencia (M02 §6.C.10). |
| Olas | **O4**: alta y baja de adherentes, adherente titular, duplicados y `billing-inputs` (RF-SOC-011 a RF-SOC-014, RF-SOC-026, API-SOC-006; DEC-071). **O10**: resto de M18 (lotes por condición, mayoría de edad, cascadas, solicitudes, sepelio, subsidio). |
| Hito de salida O4 | El contrato SOC-FAM de "Ana Demo" factura la cuota del grupo con la cantidad de adherentes vigentes al último día del período (RF-SOC-026, REP-SOC-03). |
| Hito de salida O10 | CU-SOC-04 (sepelio con inhumación en el parque) y CU-SOC-05 (subsidio aprobado y pagado) ejecutados en TEN-001. |

### 2. Configuración (SEP)

- **Perfil BASE §84 en M02**: ficha §6.C.10; pestaña Miembros de PAN-CAT-04; regla de alta automática en PAN-CAT-11 (modo por defecto PRM-CAT-050 = `propose`).
- **PRM relevantes**: PRM-SOC-001 (adherente titular), PRM-SOC-002 (duplicado en el servicio), PRM-SOC-003 (baja en otro titular), PRM-SOC-004 (efecto de la desconexión), PRM-SOC-005 (consulta al reconectar), PRM-SOC-006 (reconexión con titular fallecido), PRM-SOC-007 (ocultar fallecidos), PRM-SOC-008 (control de deuda al dar altas), PRM-SOC-009 a PRM-SOC-011 (mayoría de edad), PRM-SOC-012 (transferencia), PRM-SOC-013 (carencia por defecto), PRM-SOC-015 (plazo de reclamo del subsidio, 180 días), PRM-SOC-052 (carencia de rehabilitación, HUECO-SEP-01). Ver HUECO-TRV-01 por los PRM duplicados en M01 y M02: al 04-11-2026 PRM-PER-064..072 y PRM-CAT-060..067 están reemplazados y M18 es el único dueño (DEC-071).
- **Datos maestros**: plan de cobertura con vínculos, edades, carencias, territorio y exclusiones (RF-SOC-001, RF-SOC-005, RF-SOC-006, PAN-SOC-03); prestadores y convenios (RF-SOC-003, RF-SOC-004, PAN-SOC-04); tarifas de adherentes (RF-TAR-024, PAN-TAR-02 pestaña Adherentes); reglamento de subsidio versionado (RF-SOC-045); vínculos (RF-PER-099).
- **Precarga demo ficticia**: plan SOC-FAM con adherentes y carencia de 90 días, ARS 8.000 por grupo (M02 §18, M18 precarga); grupo GRU-001 / FAM-DEMO-001 con titular "Ana Demo"; regla PAR-DEMO-001 (alta de SEP propuesta al activar ELE, modo `propose`).

### 3. Recorrido del ciclo de vida (SEP)

| Paso | Qué ocurre | IDs |
|---|---|---|
| Oferta y landing (M19) | El servicio se publica con planes, requisitos y precio vigente; la categoría "Sociales" agrupa la oferta. | RF-POR-004, RF-POR-005, RF-POR-174, PAN-POR-02, PAN-POR-03 (con PAN-CAT-23 como componente embebido), API-CAT-49 a API-CAT-51; tarjetas sociales PAN-SOC-30 a PAN-SOC-33 embebidas en PAN-POR-98 a PAN-POR-101; HUECO-TRV-04 (corregido) |
| Solicitud (M09) | Solicitud de alta con requisitos del tipo; el contrato se crea al admitir la solicitud. Casos de sepelio marcados sensibles. | RF-CRM-060, RF-CRM-063, RF-CRM-065, RF-POR-056, RF-POR-061, PAN-POR-32, DEC-011, RF-CRM-210, RN-CRM-088 |
| Alta, adhesión y grupo familiar (M02/M01/M18) | Contrato `requested` → `active`; alta automática propuesta desde ELE (PAR-DEMO-001); alta del adherente titular y de familiares con validación de plan y duplicados. | API-CAT-33, RF-CAT-086, JOB-CAT-01, DEC-023, RF-SOC-011, RF-SOC-012, RF-SOC-013, RF-SOC-029, RN-SOC-001, RN-SOC-005 a RN-SOC-007, RN-SOC-016, API-SOC-002, PAN-SOC-01, CU-SOC-01; HUECO-TRV-01 |
| Carencias, convenios y prestación (M18) | Cobertura desde el alta de cada adherente más la carencia; convenio vigente con la empresa fúnebre a la fecha del evento. | RF-SOC-005, RN-SOC-020, RN-SOC-021, RF-SOC-004, RF-SOC-040, PA-SOC-11 |
| Cálculo (M04) | M04 lee `billing-inputs` (cantidad, vínculo, edad al último día del período) y calcula la cuota por tipo 9 a 13 con franquicia. | API-SOC-006, RF-SOC-026, RF-TAR-024, RF-TAR-047, RN-TAR-078 a RN-TAR-081, RN-SOC-017, RN-SOC-018, `TAR-E-ADH-CATEGORY`, EVT-TAR-018, JOB-TAR-03 |
| Facturación (M05) | Factura separada por servicio o talón conjunto con energía y agua si el tenant lo configura; factura en cero no se emite. Adicionales del sepelio a cargo del solicitante como ítem facturable. | DEC-034, RF-FAC-149, DEC-037, RF-SOC-042, RF-FAC-116, EVT-SOC-03, EVT-FAC-07 |
| Fiscal y terceros (M06) | **No aplica** régimen de terceros; IVA del servicio resuelto por M06 en el cálculo. Seguro por cuenta de terceros: ver ficha OTR. | RF-TAR-056 |
| Cuenta corriente y cobro (M07) | Obligación del servicio; imputación por antigüedad, recargos primero; créditos entre servicios con elección. | RF-COB-001, RF-COB-074, DEC-048, DEC-049, EVT-COB-04 |
| Mora y efecto sobre la cobertura (M08) | La deuda solo advierte en el alta de adherentes; una prestación urgente nunca se rechaza automáticamente por deuda. No está definido si las cuotas impagas suspenden la cobertura ni con qué carencia se rehabilita. Corregido (HUECO-SEP-01): con la restricción `socialCoverageSuspension` habilitada (RN-MOR-143, PRM-MOR-204, apagada por defecto), M08 publica EVT-MOR-21 `mor.socialCoverage.suspended` / `.restored` y M18 lo evalúa en RF-SOC-032 con la carencia de rehabilitación PRM-SOC-052 (RN-SOC-054); nunca afecta urgencias. | PRM-SOC-008, RF-SOC-023, RF-SOC-036, RN-MOR-082, JOB-MOR-02; HUECO-SEP-01, RN-MOR-143, EVT-MOR-21, PRM-SOC-052 |
| Solicitud de prestación o uso (M18/M09) | Solicitud → verificación de cobertura a la fecha del evento → caso de sepelio (prestador, traslado, acto de cementerio) → cierre; subsidio con beneficiarios, aprobación de otro usuario y orden de pago. | RF-SOC-031 a RF-SOC-035, RF-SOC-039 a RF-SOC-046, API-SOC-012 a API-SOC-017, PAN-SOC-05 a PAN-SOC-08, CU-24, CU-SOC-04, CU-SOC-05, `soc.benefit.approve` (T11), EVT-SOC-04, JOB-SOC-03 |
| Cambios y bajas (M01) | Baja de adherente con causa y sin borrado; lotes por condición y mayoría de edad (excluye discapacidad); cascada por desconexión, transferencia y fallecimiento; titular fallecido genera tarea y bloquea reconexión. | RF-SOC-014 a RF-SOC-022, RN-SOC-002, RN-SOC-004, RN-SOC-008 a RN-SOC-013, RN-SOC-053, API-SOC-003, API-SOC-004, PAN-SOC-02, CU-SOC-02, CU-SOC-03, RF-PER-009, EVT-PER-03, DEC-045 |
| Portal (M19) | Mi grupo y coberturas, solicitud de alta o baja de integrantes y de prestaciones; adherentes en el detalle del servicio. | PAN-SOC-30, PAN-SOC-31, API-SOC-056, API-SOC-057, RF-SOC-030, RF-SOC-038, RF-POR-068, PAN-POR-30; HUECO-TRV-04 |
| Comunicaciones (T09) | Aviso interno de mayoría de edad y aviso transaccional de la decisión de la solicitud; prohibido segmentar campañas por beneficiarios de sepelio. | EVT-SOC-02, EVT-SOC-03 (T09 catálogo `soc.benefitRequest.decided`), RN-COM-036, RF-COM-119, RN-COM-059; HUECO-TRV-02 |
| Reportes (T10) | Adherentes, mayoría de edad, cantidades para facturar, solicitudes y tiempos, prestaciones vs topes, costos de convenios. | REP-SOC-01 a REP-SOC-06, REP-CAT-010 (T10); HUECO-TRV-05 |
| Contabilidad (M15) e institucional (M17) | Costo del prestador por factura de compra (M12) y pago del subsidio (M14). La regla contable del fondo de subsidio es RN-CON-122 de M15: rol `socialSubsidy` (PRM-CON-189) contra el fondo `socialSubsidyFund` (PRM-CON-190) y pasivo `socialSubsidyPayable` (PRM-CON-191), con los asientos M-129 a M-131 y el faltante de fondo según PRM-CON-194 (antes `[REF-PENDIENTE]`; HUECO-SEP-03). M17 consulta si la persona es adherente vigente antes de informar "asociado sin servicios". | RF-SOC-034, EVT-SOC-04, API-SOC-007, RF-SOC-028, RN-SOC-015, EVT-INS-07, RN-CON-122, M-129 a M-131 |
| Migración (T07, tablas CAT) | `ADHSOC` (adherentes), `BENSOC` (beneficiarios) y `TAR_ADHE` / `HIS_TAR_ADHE` (tarifas de adherentes). | T07 §19.1 (`ADHSOC`, `BENSOC`), T07 §19.2 (`TAR_ADHE`, `HIS_TAR_ADHE` → `dependentTariffs`), M02 §19.1; HUECO-SEP-02, HUECO-TRV-01 |

### 4. Reglas críticas (SEP)

- RN-SOC-020: la cobertura se evalúa a la fecha del evento, sin cambios retroactivos.
- RN-SOC-021: la carencia corre desde el alta de cada adherente (PRM-SOC-013).
- RN-SOC-002 / RF-SOC-018: un adherente con discapacidad acreditada no se da de baja por edad.
- RN-SOC-011: el fallecimiento llega por `per.person.deceased` y da de baja con causa `death`.
- RN-SOC-010: no se reconecta con titular fallecido salvo PRM-SOC-006.
- RN-SOC-013: en la transferencia no existe "eliminar"; se da de baja con causa `transfer`.
- RN-SOC-053: la historia del grupo nunca se borra.
- RF-SOC-036: la deuda solo advierte; la decisión la toma un responsable.
- RN-TAR-079: sin categoría para N adherentes, error `TAR-E-ADH-CATEGORY`.

### 5. Pantallas (SEP)

| App | Pantallas |
|---|---|
| admin | PAN-SOC-01 a PAN-SOC-08, PAN-SOC-29, PAN-CAT-04 (pestaña Miembros, enlaza a PAN-SOC-01), PAN-CAT-11, PAN-CAT-14, PAN-TAR-02, PAN-CRM-03. PAN-CAT-20 quedó reemplazada por PAN-SOC-01 y PAN-SOC-02 (DEC-071, HUECO-TRV-01) |
| pwa-socio | PAN-SOC-30, PAN-SOC-31, PAN-POR-29, PAN-POR-30, PAN-POR-32, PAN-POR-38 |
| landing | PAN-POR-02, PAN-POR-03 |

### 6. Eventos y jobs (SEP)

- Emite: EVT-SOC-01 `soc.dependent.added/.ended/.categoryChanged/.restored`, EVT-SOC-02 `soc.dependent.majorityReached`, EVT-SOC-03 `soc.benefitRequest.decided`, EVT-SOC-04 `soc.deathSubsidy.approved`, EVT-SOC-16 `soc.agreementCost.recorded`.
- Consume: EVT-PER-03 `per.person.deceased`; EVT-CAT-09, EVT-CAT-10, EVT-CAT-15 y EVT-CAT-17 (`cat.contract.activated/.suspended/.terminated/.transferred`; M18 usa el alias `per.serviceContract.*`, HUECO-TRV-02); EVT-WFL-010 `wfl.approval.decided`; EVT-TES-15 `tes.paymentExecution.executed` (alias `tes.paymentOrder.paid`); EVT-CMP-08 `cmp.supplierInvoice.registered` (alias `cmp.purchaseInvoice.posted`).
- Jobs: JOB-SOC-01 `soc:mayoria-edad` (dueño único; JOB-CAT-07 y JOB-PER-05 reemplazados por JOB-SOC-01, T11 §12.9; HUECO-TRV-01), JOB-SOC-02 `soc:revision-condiciones`, JOB-SOC-03 `soc:vencimiento-subsidios`, JOB-SOC-11 `soc:costo-convenios`, JOB-CAT-01 `cat:altas-automaticas`, JOB-TAR-03.

### 7. Escenarios de prueba punta a punta (SEP)

| ID | Dado / Cuando / Entonces |
|---|---|
| ESC-T12-SEP-01 | **Dado** el contrato SOC-FAM de "Ana Demo" con 3 adherentes vigentes al 31-10-2026 y franquicia de 2, **cuando** M04 calcula el período 10-2026 con API-SOC-006, **entonces** cobra la cuota del grupo más 1 adherente excedente y REP-SOC-03 informa 1 adherente facturable. |
| ESC-T12-SEP-02 | **Dado** un hijo dado de alta el 01-09-2026 con carencia de 90 días, **cuando** se solicita un sepelio con evento el 15-10-2026, **entonces** la verificación devuelve `notCovered` por carencia con opción de excepción (ESC-SOC-02). |
| ESC-T12-SEP-03 | **Dado** un adherente fallecido registrado en M01, **cuando** M18 consume `per.person.deceased`, **entonces** el adherente queda `ended` con causa `death`, la ficha lo oculta (PRM-SOC-007) y la cuota del período siguiente baja en ese adherente. |
| ESC-T12-SEP-04 | **Dado** un subsidio por ARS 300.000 con dos beneficiarios al 50 %, **cuando** el mismo usuario que lo creó intenta aprobarlo, **entonces** se rechaza; **cuando** lo aprueba otro usuario, **entonces** se publica EVT-SOC-04 y M14 emite la orden de pago. |
| ESC-T12-SEP-05 (error) | **Dado** un plan con edad máxima 21 para hijos, **cuando** se da de alta un hijo de 25 años con `Idempotency-Key`, **entonces** la API responde 422 RFC 9457 con motivo "edad fuera de rango" y reenviar la misma clave no crea un adherente. |
| ESC-T12-SEP-06 (aislamiento) | **Dado** un operador de TEN-002 con `soc.adherentes.ver`, **cuando** consulta `/api/admin/soc/contracts/{contrato de Ana Demo}/dependents`, **entonces** recibe 404. |
| ESC-T12-SEP-07 | **Dado** PAR-DEMO-001 en modo `propose`, **cuando** se activa un contrato ELE nuevo, **entonces** queda una propuesta de alta de SEP pendiente de consentimiento y no se crea contrato ni cargo hasta aceptarla (DEC-023). |

### 8. Preguntas abiertas (SEP)

- PA-SOC-04 (edad de corte), PA-SOC-10 (subsidio), PA-SOC-11 (carencias): asumidas por DEC-072 con la opción recomendada.
- PA-SOC-14 (ola de adherentes): respondida por DEC-071 (O4).
- PA-CAT-04 (altas automáticas): respondida por DEC-023.
- PA-PER-08 (registro del fallecimiento en M01): ver M01; el flujo de la ficha supone que M01 publica EVT-PER-03.

### 9. HUECOS (SEP)

| ID | Hueco | Propuesta | Anexo |
|---|---|---|---|
| HUECO-SEP-01 | Falta la regla de **suspensión de cobertura por cuotas impagas** y la **carencia de rehabilitación** al regularizar (RF-SOC-036 y RN-SOC-022 solo cubren urgencias y prestaciones sanitarias). | Agregar a la matriz RN-MOR-082 una restricción `tenantPolicy` "cobertura social" (meses impagos para suspender) y en M18 un PRM de carencia de rehabilitación, evaluados en RF-SOC-032. | M08, M18 · **Estado (04-11-2026):** Corregido en anexo (parcial): M08 RN-MOR-143, RF-MOR-224, PRM-MOR-204, EVT-MOR-21, ESC-MOR-56; M18 RF-SOC-032, RN-SOC-054, PRM-SOC-052; T11 EVT-MOR-21; pendiente: meses de cuotas impagas y carencia según el reglamento del servicio social (validación). · **Estado (05-11-2026):** Corregido en anexo (parámetro con default propuesto; requiere validación legal): M08 RN-MOR-143, RF-MOR-224, PRM-MOR-204 (3 meses impagos, deshabilitado por defecto), EVT-MOR-21, ESC-MOR-56; M18 RF-SOC-032, RN-SOC-054, PRM-SOC-052 (carencia de rehabilitación 30 días); T11 EVT-MOR-21. Antes: parcial, pendiente meses impagos y carencia según el reglamento. |
| HUECO-SEP-02 | `BENSOC` tiene tres destinos: beneficiarios del contrato (RF-SOC-024, M18), `tariffBenefits` de tarifa social (T07 §19.1, T09 glosario) y `contractMembers` (M02 §19.1). | Confirmar con el diccionario de datos CAT el significado de `BENSOC` y dejar un único destino. | T07, M18, M02, T09 · **Estado (04-11-2026):** Corregido en anexo: M18 RF-SOC-024, `serviceBeneficiaries`, CTR-SOC-03; T07 RN-MIG-054; M02 §19 `BENSOC`; M04 §7; T09 glosario, RF-COM-106, CTR-COM-18; T05 COL-SOC-02, CTR-DAT-27 (DEC-086). |
| HUECO-SEP-03 | La regla contable del subsidio por fallecimiento (fondo, previsión, pago) no está en M15. | Agregar a M15 el rol de importe "subsidio social" con contrapartida del fondo y consumo de EVT-SOC-04. | M15 · **Estado (04-11-2026):** Corregido en anexo: M15 RN-CON-122, M-129..131, PRM-CON-189..191, PRM-CON-194, ESC-CON-25; M18 y T11 EVT-SOC-04 (consumidor M15). |

---

## Ficha CEM — Cementerio parque

### 1. Resumen (CEM)

| Campo | Valor |
|---|---|
| Unidad central | **Derecho de sepultura** sobre una **unidad** (parcela, nicho, urnario) de un establecimiento (RF-SOC-049, RF-SOC-050, RF-SOC-053), con **ocupaciones** permanentes y **actos** (inhumación, exhumación, reducción, traslado; RF-SOC-056). El contrato de M02 de perfil "Derecho de sepultura" sostiene las obligaciones económicas (RF-SOC-055). |
| Régimen | Derecho real o concesión según CCyC arts. 2103 a 2113 (M02 §6.C.11, RF-SOC-049). Se separan contratante, titular, pagador, fallecido y autorizados (RF-SOC-054). No es un plan de cobertura familiar (RF-SOC-002). |
| Perfil de cálculo ProCoop | Perfil nuevo "Derecho de sepultura" (M02 §6.C.11); ProCoop no tiene tablas de cementerio. Obligaciones: adquisición (contado o financiada), mantenimiento periódico y actos (RF-SOC-055). |
| Olas | **O2**: catálogo y oferta (M02 §6.C.11; TEN-001 publica "Cementerio parque" en RF-POR-004). **O10**: operación completa en M18. |
| Hito de salida O2 | "Cementerio parque" visible en la landing de TEN-001 con sus planes y sin botón de baja público. |
| Hito de salida O10 | CU-ESP-CEM completo: reserva de PAR-DEMO-001, formalización, obligaciones en 24 cuotas, inhumación de un fallecido distinto del titular y registro en el libro. |

### 2. Configuración (CEM)

- **Perfil BASE §84 en M02**: ficha §6.C.11 (sin baja por botón; unidad obligatoria PRM-CAT-097); concesión y fuente normativa en PAN-CAT-26.
- **PRM relevantes**: PRM-CAT-097 (`cat.cem.plotRequired`), PRM-SOC-014 (reserva 7 días), PRM-SOC-016 (documentación previa por tipo de acto), PRM-SOC-050 (búsqueda pública de difuntos, `false` por defecto).
- **Datos maestros**: establecimiento y reglamento versionado (RF-SOC-049, PAN-SOC-12, API-SOC-018); catálogo jerárquico de sectores, manzanas, filas y unidades con capacidad por niveles (RF-SOC-050, API-SOC-019 con importación masiva); autorizados (RF-SOC-054).
- **Precarga demo ficticia**: establecimiento "Parque Demo"; unidad PAR-DEMO-001; plan CEM-PAR "Parcela cementerio parque en 24 cuotas ficticias" (M02 §18).

### 3. Recorrido del ciclo de vida (CEM)

| Paso | Qué ocurre | IDs |
|---|---|---|
| Oferta y landing (M19) | Catálogo público con el servicio y sus planes; no se muestra botón de baja para este servicio. | RF-POR-004, RF-POR-005, PAN-POR-02, PAN-POR-03 (con PAN-CAT-23 como componente embebido), M02 §6.C.11; buscador público de difuntos PAN-POR-104 (RF-POR-177, API-POR-124, solo con PRM-SOC-050; HUECO-CEM-02); HUECO-TRV-04 (corregido) |
| Solicitud (M09) | Solicitud de alta (reserva) con requisitos; el contrato se crea al admitir la solicitud. | RF-CRM-060, RF-CRM-063, DEC-011, RF-POR-056, RF-POR-061 |
| Alta, adhesión y grupo familiar (M02/M01/M18) | Reserva con control de concurrencia y vencimiento → formalización con instrumento → derecho `pendingDocumentation` hasta adjuntarlo. Grupo familiar **No aplica** (los autorizados no son adherentes). | API-CAT-33, RF-SOC-051, RF-SOC-052, RF-SOC-053, RF-SOC-054, API-SOC-020, API-SOC-021, API-SOC-022, PAN-SOC-09, PAN-SOC-10, CU-ESP-CEM |
| Carencias, convenios y prestación (M18) | Carencia **No aplica**. La prestación son los actos, con autorización del titular o autorizado y documentación previa; turnos en la agenda del establecimiento. | RF-SOC-056, RF-SOC-057, RN-SOC-026, RN-SOC-027, PRM-SOC-016, API-SOC-023, API-SOC-024, PAN-SOC-11, PAN-SOC-35 |
| Cálculo (M04) | Precio de adquisición, cuotas de financiación y abono de mantenimiento; cargos por acto. M04 no tiene una regla propia para estas obligaciones. Corregido: RF-TAR-117 y RN-TAR-248 (adquisición al contado o en cuotas con `planKind = right_acquisition`, mantenimiento periódico y cargo por acto con disparador `social_act` sobre EVT-SOC-06). | RF-SOC-055, EVT-SOC-05 (consumidor M04); HUECO-CEM-01, RF-TAR-117, RN-TAR-248, EVT-SOC-06 (consumidor M04) |
| Facturación (M05) | Abono de mantenimiento en el ciclo del servicio; cargo del acto realizado como ítem facturable; factura separada por servicio. | EVT-SOC-06 (consumidor M05), RF-FAC-116, DEC-034, DEC-037 |
| Fiscal y terceros (M06) | **No aplica** régimen de terceros. El tratamiento de IVA del derecho, del mantenimiento y de los actos lo resuelve M06 por concepto con el caso fiscal de derechos de sepultura RF-FIS-162 / RN-FIS-125 (`conceptFiscalCases`, M06 §7.37; momento fiscal PRM-FIS-123; encuadre a validar con el contador) (antes `[REF-PENDIENTE]`: M06 no tenía un caso para derechos de sepultura). | RF-TAR-056, RF-FIS-162, RN-FIS-125 |
| Cuenta corriente y cobro (M07) | Cuenta por derecho y acto visible en el resumen del asociado. | RF-SOC-060, RF-COB-074, DEC-048 |
| Mora y efecto sobre la cobertura (M08) | La mora no cancela el derecho, no libera la unidad ni corta otros servicios; solo habilita gestión de cobranza y, eventualmente, trámite jurídico. | RF-SOC-058, RF-SOC-062, RN-SOC-025, RN-MOR-087, RF-MOR-069, RN-MOR-082 |
| Solicitud de prestación o uso (M18/M09) | Solicitud de acto desde el portal o mostrador: queda `requested` hasta validar documentación; un sepelio de M18 puede crear el acto de inhumación. | RF-SOC-057, RF-SOC-043, API-SOC-057, PAN-SOC-32, CU-SOC-04 |
| Cambios y bajas (M01) | Sin baja por botón; cambio de pagador sin transferir el derecho; cesión, transferencia, sucesión y extinción con revisión jurídica; fallecimiento del titular → sucesión. | M02 §6.C.11, RN-SOC-024, RF-SOC-059, API-SOC-022, CU-SOC-06, RF-PER-141, EVT-PER-03, PA-SOC-06 |
| Portal (M19) | Mis derechos de sepultura con obligaciones y actos; búsqueda pública de difuntos solo si el tenant la habilita (nombre y ubicación). | PAN-SOC-32, API-SOC-058, API-SOC-061, PRM-SOC-050, RF-SOC-063; HUECO-CEM-02 |
| Comunicaciones (T09) | Aviso de acto programado y realizado al titular o autorizado con los tipos T09 `soc.cemeteryAct.scheduled` (por el comando `com.communications.emit`, M18 no publica evento de programación) y `soc.cemeteryAct.performed` (EVT-SOC-06), T09 §9.6.8 (antes `[REF-PENDIENTE]`: T09 no tenía tipo para `soc.cemeteryAct.performed`). Avisos de deuda por los tipos generales, sin amenaza de liberar la unidad. | EVT-SOC-06, `soc.cemeteryAct.scheduled`, `soc.cemeteryAct.performed`, `mor.notice.reminder` |
| Reportes (T10) | Disponibilidad, registro de inhumaciones, registro de titulares y deuda de cementerio; libros exportables. | REP-SOC-07 a REP-SOC-10, RF-SOC-064; HUECO-TRV-05 |
| Contabilidad (M15) e institucional (M17) | Ingreso por adquisición y mantenimiento por las reglas generales de facturación. La venta del derecho sigue RN-CON-124 de M15 (PA-CON-17, asumida la recomendada): por defecto ingreso del período al otorgar (M-134, PRM-CON-193 = `atGrant`); con `deferredOverTerm` el ingreso se difiere en `burialRightDeferredRevenue` (PRM-CON-192) y JOB-CON-23 `con:devengar-derechos-sepultura` lo devenga mes a mes (M-135) (antes `[REF-PENDIENTE]`: no estaba definido si el ingreso era diferido; HUECO-CEM-04). M17 **No aplica**. | RF-CON-052, RN-CON-124, PA-CON-17, M-134, M-135, PRM-CON-193, JOB-CON-23 |
| Migración (T07, tablas CAT) | ProCoop no tiene tablas de cementerio: carga inicial por `ExcelImportWizard` de unidades, derechos y ocupaciones. | API-SOC-019 (importación masiva), PAN-SOC-12; plantillas TPL-MIG-CEM-01 a 05 con orden de carga y conciliación por unidad (T07 RF-MIG-099, §19.33); HUECO-CEM-03 (corregido) |

### 4. Reglas críticas (CEM)

- RN-SOC-023: una unidad tiene un solo derecho vigente y la ocupación es permanente.
- RN-SOC-024: cambiar el pagador no transfiere el derecho ni elimina la ocupación.
- RN-SOC-025 / RN-MOR-087: la mora no cancela derechos ni corta otros servicios.
- RN-SOC-026: todo acto requiere autorización y documentación previa (PRM-SOC-016).
- RN-SOC-027: inhumaciones ≤ capacidad de niveles; la reducción libera nivel.
- RF-SOC-051: reserva o venta duplicada imposible (control por `version`).
- RF-SOC-058: no existe la acción "liberar por mora".

### 5. Pantallas (CEM)

| App | Pantallas |
|---|---|
| admin | PAN-SOC-09, PAN-SOC-10, PAN-SOC-11, PAN-SOC-12, PAN-CAT-14, PAN-CAT-26 |
| pwa-empleado | PAN-SOC-35 `/app/soc/cementerio/actos` |
| pwa-socio | PAN-SOC-32 `/app/cementerio`, PAN-POR-38, PAN-POR-39 |
| landing | PAN-POR-02, PAN-POR-03; búsqueda pública de difuntos sin pantalla asignada (HUECO-CEM-02) |

### 6. Eventos y jobs (CEM)

- Emite: EVT-SOC-05 `soc.burialRight.formalized/.holderChanged/.extinguished`, EVT-SOC-06 `soc.cemeteryAct.performed`.
- Consume: EVT-PER-03 `per.person.deceased`, EVT-WFL-010 `wfl.approval.decided` (cesión y extinción), EVT-FAC-07, EVT-COB-04.
- Jobs: JOB-SOC-04 `soc:vencer-reservas` (horario, libera solo reservas vencidas), JOB-MOR-02.

### 7. Escenarios de prueba punta a punta (CEM)

| ID | Dado / Cuando / Entonces |
|---|---|
| ESC-T12-CEM-01 | **Dado** PAR-DEMO-001 disponible en "Parque Demo", **cuando** dos operadores la reservan al mismo tiempo, **entonces** una reserva se confirma y la otra recibe `soc.unit.notAvailable` (ESC-SOC-07). |
| ESC-T12-CEM-02 | **Dado** una reserva de PAR-DEMO-001 creada hace 8 días sin formalizar y PRM-SOC-014 = 7, **cuando** corre JOB-SOC-04, **entonces** la unidad vuelve a disponible y queda el evento de liberación. |
| ESC-T12-CEM-03 | **Dado** un derecho formalizado con plan CEM-PAR de 24 cuotas de ARS 50.000 y 3 cuotas de mantenimiento impagas, **cuando** corre `mor:evaluar-mora`, **entonces** no se crea orden de corte de otros servicios, el derecho y la ocupación no cambian y REP-SOC-10 muestra el saldo (ESC-SOC-05). |
| ESC-T12-CEM-04 (error) | **Dado** una inhumación solicitada por un tercero no autorizado, **cuando** se intenta registrar como realizada desde PAN-SOC-35, **entonces** se rechaza con `soc.act.unauthorized` (ESC-SOC-08). |
| ESC-T12-CEM-05 | **Dado** un derecho con un fallecido inhumado, **cuando** cambia el pagador a otro familiar, **entonces** titular y ocupación no cambian y la próxima cuota sale a nombre del nuevo pagador (ESC-SOC-06). |
| ESC-T12-CEM-06 (aislamiento) | **Dado** PRM-SOC-050 = `true` en TEN-001 y `false` en TEN-002, **cuando** se consulta `/api/public/<slug de TEN-002>/soc/cemetery/search` con el nombre de un difunto de TEN-001, **entonces** la respuesta está vacía o es 404 y nunca muestra datos de TEN-001. |

### 8. Preguntas abiertas (CEM)

- PA-SOC-05 (modalidad jurídica del establecimiento) y PA-SOC-06 (cesión, sucesión y extinción): asumidas por DEC-072.

### 9. HUECOS (CEM)

| ID | Hueco | Propuesta | Anexo |
|---|---|---|---|
| HUECO-CEM-01 | M04 no define cómo calcula la adquisición financiada, el mantenimiento periódico ni el cargo por acto del perfil "Derecho de sepultura". | Agregar en M04 una estrategia o variante "cargo fijo por derecho" con financiación en cuotas (reutilizar el plan de cuotas de RF-TAR-031) y conceptos por acto disparados por EVT-SOC-06. | M04 · **Estado (04-11-2026):** Corregido en anexo: M04 RF-TAR-117, RN-TAR-248, ESC-TAR-34; M06 RF-FIS-162, RN-FIS-125; T11 EVT-SOC-06 (consumidor M04). |
| HUECO-CEM-02 | La búsqueda pública de difuntos (API-SOC-061) no tiene pantalla en la landing de M19 ni ruta en T03. | Agregar PAN-POR "Buscar difunto" visible solo con PRM-SOC-050 = `true`. | M19, T03 · **Estado (04-11-2026):** Corregido en anexo: M19 RF-POR-177, PAN-POR-104, API-POR-124; T03 SM-LND-034. |
| HUECO-CEM-03 | No hay tablas ProCoop de cementerio; la migración depende de una planilla sin plantilla definida en T07. | Definir en T07 una plantilla de `ExcelImportWizard` para unidades, derechos, titulares, autorizados y ocupaciones, con conciliación por unidad. | T07, M18 · **Estado (04-11-2026):** Corregido en anexo: T07 RF-MIG-099, §19.33 (TPL-MIG-CEM-01..05); M18 §19 (fila Cementerio). |
| HUECO-CEM-04 | No está definido el tratamiento contable y fiscal de la venta del derecho (ingreso del período o diferido; IVA). | Decidir en M06 y M15 con el contador del piloto; registrar PA nueva. | M06, M15 · **Estado (04-11-2026):** Decisión: PA-CON-17, asumida la opción recomendada (DEC-072) |

---

## Ficha SAN — Banco de sangre por convenio

### 1. Resumen (SAN)

| Campo | Valor |
|---|---|
| Unidad central | **Convenio** con una red o banco habilitado (RF-SOC-065) y **adhesión** del titular, su grupo y beneficiarios (RF-SOC-066), materializada en un contrato de M02 de perfil "Adherentes" o "Beneficiarios" (M02 §6.C.12). La prestación es una **solicitud administrativa** de cobertura canalizada al prestador (RF-SOC-068). |
| Régimen | Ley 22990: prohibición de intermediación lucrativa y de cobrar la sangre al receptor (RF-SOC-067, RN-SOC-028). Solo gestión administrativa, sin datos clínicos (DEC-024, RF-SOC-069). Dominio sensible: alcance por servicio obligatorio (M02 §4, AGR-008). |
| Perfil de cálculo ProCoop | Financiado por la cooperativa (importe 0 al socio), aporte permitido o gratuito según convenio; nunca precio por unidad de sangre (M02 §6.C.12). `control.sensitiveData = true`. |
| Olas | O10 (M02 §6.C.12, RF-SOC-065 a RF-SOC-073). |
| Hito de salida O10 | CU-ESP-SAN en TEN-001: BEN-DEMO-001 con cobertura vigente por CONV-SAN-DEMO; la solicitud SAN-DEM-001 recorre `requested` → `inProgressWithProvider` → `answered` sin comprobante al paciente y con costo del convenio registrado. |

### 2. Configuración (SAN)

- **Perfil BASE §84 en M02**: ficha §6.C.12; dimensión `control.sensitiveData = true` (M02 §6.B); miembros en la pestaña Miembros de PAN-CAT-04 (ver HUECO-TRV-01).
- **PRM relevantes**: PRM-SOC-017 (rango de edad de donante, solo informativo), PRM-SOC-001 a PRM-SOC-013 para el grupo (mismos que SEP), PRM-CAT-097 no aplica.
- **Datos maestros**: convenio con ámbito, vigencia, modalidad de financiamiento y costo (RF-SOC-004, RF-SOC-065, PAN-SOC-04, API-SOC-010); prestador habilitado (RF-SOC-003); campañas y turnos de donación (RF-SOC-070, API-SOC-027).
- **Precarga demo ficticia**: convenio CONV-SAN-DEMO; plan SAN-CONV con importe ARS 0 (solo administrativo); beneficiario BEN-DEMO-001; solicitud SAN-DEM-001.

### 3. Recorrido del ciclo de vida (SAN)

| Paso | Qué ocurre | IDs |
|---|---|---|
| Oferta y landing (M19) | Publicación informativa del servicio y sus requisitos; sin precio por unidad. | RF-POR-005, PAN-POR-03, M02 §6.C.12 |
| Solicitud (M09) | Solicitud de adhesión como caso sensible: acceso restringido, IA deshabilitada por defecto; el bot solo explica cómo iniciar y deriva a un operador. | RF-CRM-060, RF-CRM-210, RN-CRM-088, RF-SOC-073, DEC-011 |
| Alta, adhesión y grupo familiar (M02/M01/M18) | Alta del contrato y de beneficiarios con fechas; cobertura a una fecha consultable. | API-CAT-33, RF-SOC-024, RF-SOC-066, API-SOC-005, CU-ESP-SAN (M02 §16), PAN-SOC-01; HUECO-TRV-01 |
| Carencias, convenios y prestación (M18) | La cobertura usa el convenio vigente a la fecha; carencia solo si el plan la define. | RF-SOC-004, RF-SOC-005, RF-SOC-065, RF-SOC-066, RN-SOC-020 |
| Cálculo (M04) | Modalidad financiada o gratuita: **No aplica** (importe 0). Modalidad con aporte: cargo fijo del plan por las reglas generales de M04; nunca un concepto por unidad de sangre. | RF-SOC-067, RN-SOC-028, RF-TAR-021 |
| Facturación (M05) | Con importe 0 no se emite factura (DEC-037); con aporte, factura separada por servicio. | DEC-037, DEC-034, ESC-SOC-09 |
| Fiscal y terceros (M06) | **No aplica**. | — |
| Cuenta corriente y cobro (M07) | Solo en modalidad con aporte, como obligación genérica del servicio. | RF-COB-074 |
| Mora y efecto sobre la cobertura (M08) | La deuda no condiciona la disponibilidad clínica ni la respuesta urgente: restricción `normative` bloqueante por defecto; una solicitud con deuda queda "en gestión" con advertencia. | RN-MOR-088, RN-MOR-082, RN-SOC-022, RF-SOC-036 |
| Solicitud de prestación o uso (M18/M09) | Solicitud administrativa con referencia, estado y respuesta del prestador; campañas y turnos sin decidir aptitud. | RF-SOC-031, RF-SOC-068, RF-SOC-069, RF-SOC-070, API-SOC-026, API-SOC-027, PAN-SOC-13, CU-ESP-SAN (M18) |
| Cambios y bajas (M01) | Baja de beneficiario con causa y sin borrado; fallecimiento por evento; cascada por desconexión como en SEP. | RF-SOC-014, RF-SOC-019, RF-SOC-020, RN-SOC-011, RN-SOC-053, EVT-PER-03 |
| Portal (M19) | Mi grupo y solicitudes, sin datos clínicos. | PAN-SOC-30, PAN-SOC-31, API-SOC-056, API-SOC-057, RF-SOC-038 |
| Comunicaciones (T09) | Solo transaccionales del módulo dueño; prohibido segmentar o publicar por banco de sangre. | RF-COM-119, RN-COM-059, EVT-SOC-03 |
| Reportes (T10) | Solicitudes, tiempos, costos y cobertura sin datos clínicos; enmascarado por defecto. | RF-SOC-072, REP-SOC-04, REP-SOC-06, RF-BIA-014, RN-BIA-016; HUECO-TRV-05 |
| Contabilidad (M15) e institucional (M17) | Costo del convenio como gasto, separado de cualquier cobro al socio. M17 **No aplica**. | RF-SOC-071, EVT-SOC-16, JOB-SOC-11 |
| Migración (T07, tablas CAT) | **No aplica**: ProCoop no tiene tablas de banco de sangre; los convenios se cargan en PAN-SOC-04. Validación de edad de donante de ProCoop (V2 2527) se elimina. | RN-SOC-029 |

### 4. Reglas críticas (SAN)

- RN-SOC-028 / RF-SOC-067: no existe concepto facturable por sangre o transfusión al paciente.
- RF-SOC-069: el formulario no tiene diagnóstico, grupo sanguíneo ni indicaciones.
- RN-SOC-029: sin aptitud clínica de donantes; la edad es filtro informativo.
- RN-MOR-088 / RN-SOC-022: la deuda no decide prestaciones sanitarias.
- RF-SOC-073: ni el bot ni las reglas de deuda resuelven solicitudes de sangre.
- RF-SOC-037 / RF-SOC-139: documentación sensible solo con `soc.datosSensibles.ver`; nunca en muro, BI general ni bot.

### 5. Pantallas (SAN)

| App | Pantallas |
|---|---|
| admin | PAN-SOC-13 `/soc/sangre`, PAN-SOC-04, PAN-SOC-01, PAN-SOC-05, PAN-SOC-06, PAN-CAT-14; beneficiarios en PAN-SOC-01/02 con alcance sensible (PAN-CAT-20 reemplazada por PAN-SOC-01 y PAN-SOC-02, HUECO-TRV-01) |
| pwa-socio | PAN-SOC-30, PAN-SOC-31 |
| landing | PAN-POR-03 |

### 6. Eventos y jobs (SAN)

- Emite: EVT-SOC-01 (beneficiarios), EVT-SOC-03 `soc.benefitRequest.decided`, EVT-SOC-16 `soc.agreementCost.recorded`.
- Consume: EVT-PER-03, EVT-CAT-09 y EVT-CAT-15 (alias `per.serviceContract.*` en M18, HUECO-TRV-02), EVT-CMP-08 (factura del prestador; alias `cmp.purchaseInvoice.posted`).
- Jobs: JOB-SOC-11 `soc:costo-convenios` (mensual, idempotente).

### 7. Escenarios de prueba punta a punta (SAN)

| ID | Dado / Cuando / Entonces |
|---|---|
| ESC-T12-SAN-01 | **Dado** CONV-SAN-DEMO financiado por la cooperativa y BEN-DEMO-001 vigente, **cuando** se cierra SAN-DEM-001, **entonces** no se genera comprobante al paciente y JOB-SOC-11 registra el costo del convenio del período (ESC-SOC-09). |
| ESC-T12-SAN-02 (error) | **Dado** el catálogo del servicio SAN, **cuando** un administrador intenta crear un concepto facturable de tipo "unidad de sangre", **entonces** M02 lo rechaza con error RFC 9457 (RF-SOC-067). |
| ESC-T12-SAN-03 | **Dado** el titular de BEN-DEMO-001 con ARS 15.000 vencidos en otro servicio, **cuando** se registra una solicitud de sangre, **entonces** queda "en gestión" con advertencia y no es rechazada (RF-SOC-036). |
| ESC-T12-SAN-04 (permiso) | **Dado** un supervisor de Agua de TEN-001, **cuando** consulta solicitudes de banco de sangre, **entonces** recibe 403 y no aparecen en la búsqueda global (ESC-SOC-11). |
| ESC-T12-SAN-05 (aislamiento) | **Dado** un operador de TEN-002 con `soc.sangre.ver`, **cuando** pide `/api/admin/soc/blood-requests/{id de SAN-DEM-001}`, **entonces** recibe 404. |
| ESC-T12-SAN-06 | **Dado** el modelo de solicitudes de banco de sangre de M18, **cuando** se inspecciona el esquema, **entonces** no existen campos de grupo sanguíneo, diagnóstico ni compatibilidad (ESC-SOC-10). |

### 8. Preguntas abiertas (SAN)

- PA-CAT-06 (alcance de banco de sangre): respondida por DEC-024.
- PA-SOC-03 (datos mínimos): asumida por DEC-072.

### 9. HUECOS (SAN)

| ID | Hueco | Propuesta | Anexo |
|---|---|---|---|
| HUECO-SAN-01 | RF-SOC-067 dice que "el catálogo de M02 rechaza" un concepto por unidad de sangre, pero M02 no tiene la regla (RN-CAT) que lo valide. | Agregar en M02 una RN-CAT de validación para servicios con capacidad SAN. | M02 · **Estado (04-11-2026):** Corregido en anexo: M02 RN-CAT-077. |
| HUECO-SAN-02 | En la modalidad "aporte del socio" no está definido qué ocurre con el aporte impago (RN-MOR-088 exige "revisión del convenio" sin decir quién ni cómo). | Tarea de revisión en la bandeja del responsable del servicio social; nunca suspensión automática. | M08, M18 · **Estado (04-11-2026):** Corregido en anexo: M08 RN-MOR-144, RN-MOR-088, RF-MOR-224, PRM-MOR-205, ESC-MOR-57; M18 RF-SOC-146, RN-SOC-055; T11 §7.6 (tarea `review` con `origin.dedupKey`). |

---

## Ficha SAL — Ambulancias y salud

### 1. Resumen (SAL)

| Campo | Valor |
|---|---|
| Unidad central | Contrato de salud o ambulancia (M02 §6.C.13) con grupo de cobertura (M18) y plan con topes; la prestación es un **viaje de traslado** con tramos (RF-SOC-074, RF-SOC-075) o una **autorización administrativa** de internación o práctica por convenio (RF-SOC-081). Recursos: vehículos y choferes de flota (RF-SOC-118, RF-SOC-119). |
| Régimen | Cobertura por convenio con prestadores; el sistema **no despacha emergencias**, las deriva al prestador habilitado (RF-SOC-082). Datos sensibles: el motivo es categoría administrativa y el texto libre solo lo ve `soc.datosSensibles.ver` (RF-SOC-078). |
| Perfil de cálculo ProCoop | Perfil Adherentes (tipos 9 a 13) para la cuota; traslado por km o importe fijo y coseguro (M02 §6.C.13, RF-SOC-080). |
| Olas | O10 (M02 §6.C.13, RF-SOC-074 a RF-SOC-084). Vehículos y choferes desde O8 (RF-SOC-118, RF-SOC-119). Adherentes desde O4 (DEC-071). |
| Hito de salida O10 | CU-SOC-07 en TEN-001: traslado programado a diálisis con móvil AMB-01 y chofer CHO-01, ejecutado en la PWA de campo, cerrado con km reales y, si no está cubierto, facturado. |

### 2. Configuración (SAL)

- **Perfil BASE §84 en M02**: ficha §6.C.13; `control.sensitiveData = true`; alcance por servicio obligatorio (M02 §4).
- **PRM relevantes**: PRM-SOC-048 (derivación de emergencias: prestador, teléfono, texto), PRM-SOC-049 (superposición de móvil o chofer, `warn`), PRM-SOC-033 (alerta de vencimiento de documentación de flota), PRM-SOC-001 a PRM-SOC-013 para el grupo.
- **Datos maestros**: características de viaje y su efecto en tarifa (RF-SOC-076, API-SOC-031); profesionales y especialidades (RF-SOC-007, API-SOC-011); nosocomios y localidades (RF-SOC-008); prestadores y convenios (RF-SOC-003, RF-SOC-004); plan con topes (RF-SOC-001, RF-SOC-035); vehículos y choferes (API-SOC-042, API-SOC-043).
- **Precarga demo ficticia**: móvil AMB-01 dominio ficticio AA000AA; chofer CHO-01; tarifa ficticia ARS 900 por km (RF-SOC-080).

### 3. Recorrido del ciclo de vida (SAL)

| Paso | Qué ocurre | IDs |
|---|---|---|
| Oferta y landing (M19) | Servicio publicado con planes y requisitos. | RF-POR-004, RF-POR-005, PAN-POR-03 (con PAN-CAT-23 como componente embebido); HUECO-TRV-04 (corregido) |
| Solicitud (M09) | Alta del servicio como solicitud; casos de salud sensibles, sin IA por defecto. | RF-CRM-060, RF-CRM-210, RN-CRM-088, DEC-011 |
| Alta, adhesión y grupo familiar (M02/M01/M18) | Contrato y grupo de cobertura como en SEP. | API-CAT-33, RF-SOC-011 a RF-SOC-013, API-SOC-002, PAN-SOC-01; HUECO-TRV-01 |
| Carencias, convenios y prestación (M18) | Cobertura a la fecha del viaje: contrato y adherente vigentes, carencia cumplida, prestación incluida y tope disponible. | RF-SOC-005, RF-SOC-032, RF-SOC-035, RN-SOC-020, RN-SOC-021 |
| Cálculo (M04) | Cuota del grupo por tipos 9 a 13; traslado no cubierto: km × tarifa o importe fijo; no asociado por lista propia. M04 no tiene la regla del traslado. Corregido: RF-TAR-118 y RN-TAR-249 con `tripPricing` (km × tarifa, importe fijo, viaje corto, característica, coseguro y lista de no asociados) sobre EVT-SOC-07 ampliado (`characteristicCode`, `memberStatus`, `originalTripId`). | API-SOC-006, RN-TAR-078 a RN-TAR-081, RF-SOC-080, RF-SOC-074, EVT-SOC-07; HUECO-SAL-01, RF-TAR-118, RN-TAR-249, PRM-TAR-170 |
| Facturación (M05) | Cuota en el ciclo del servicio; traslado no cubierto como ítem facturable al cerrar el viaje. | EVT-SOC-07 (consumidor M04/M05), RF-FAC-116, DEC-034, DEC-037 |
| Fiscal y terceros (M06) | **No aplica** régimen de terceros. | RF-TAR-056 |
| Cuenta corriente y cobro (M07) | Obligación genérica del servicio. | RF-COB-074, DEC-048 |
| Mora y efecto sobre la cobertura (M08) | La deuda no decide prestaciones sanitarias ni rechaza un traslado urgente; solo advierte. | RN-SOC-022, RF-SOC-036, RN-MOR-082; HUECO-SEP-01 |
| Solicitud de prestación o uso (M18/M09) | Solicitud → verificación → agenda con móvil apto y chofer → ejecución offline en la PWA de campo → cierre con km e importe; emergencias derivadas sin agenda; autorizaciones de internación con número y costo. | RF-SOC-031 a RF-SOC-035, RF-SOC-074 a RF-SOC-084, API-SOC-029, API-SOC-030, API-SOC-028, API-SOC-044, API-SOC-060, PAN-SOC-14, PAN-SOC-16, PAN-SOC-34, CU-SOC-07, RN-SOC-030, RN-SOC-050 |
| Cambios y bajas (M01) | Igual que SEP para el grupo; el trámite de fallecimiento puede crear un traslado vinculado. | RF-SOC-014, RF-SOC-019, RF-SOC-020, RF-SOC-083, EVT-PER-03 |
| Portal (M19) | Mi grupo y solicitudes de prestación; emergencias muestran el número del prestador. | PAN-SOC-30, PAN-SOC-31, API-SOC-056, API-SOC-057 |
| Comunicaciones (T09) | Aviso de la decisión de la solicitud; prohibido segmentar por salud. | EVT-SOC-03, RF-COM-119, RN-COM-059 |
| Reportes (T10) | Informe general de traslados con filtros y edad a la fecha del viaje; solicitudes y tiempos; costos de flota. | REP-SOC-04, REP-SOC-05, REP-SOC-11, REP-SOC-18, RN-SOC-031, PAN-SOC-15; HUECO-TRV-05 |
| Contabilidad (M15) e institucional (M17) | Viaje completado a M15 (costo y, si corresponde, ingreso); uso de vehículo con costo. M17 **No aplica**. | EVT-SOC-07, EVT-SOC-12, EVT-SOC-16 |
| Migración (T07, tablas CAT) | `AMBULANC` (histórico; pendientes de facturar vivos; cifrado de campo), `AMBUCARACTE`, `AMBUMED`, `MEDICOS`, `ESPE_MED`. | T07 §19.20, RN-MIG-038, PA-MIG-19, M02 §19.1 (`AMBULANC`, `MEDICOS`, `PROFESIO`); HUECO-SAL-02 |

### 4. Reglas críticas (SAL)

- RF-SOC-082: el sistema no despacha emergencias; las deriva según PRM-SOC-048.
- RF-SOC-078: el motivo del traslado no es diagnóstico; el texto libre es restringido.
- RN-SOC-050: un vehículo con documentación o mantenimiento vencido no se asigna.
- RN-SOC-030: un viaje multitramo se vincula al original y suma km e importes.
- RN-SOC-022: la deuda no decide prestaciones sanitarias.
- RF-SOC-084: un móvil en dos viajes superpuestos genera advertencia o bloqueo (PRM-SOC-049).

### 5. Pantallas (SAL)

| App | Pantallas |
|---|---|
| admin | PAN-SOC-14 `/soc/traslados`, PAN-SOC-15, PAN-SOC-16, PAN-SOC-04, PAN-SOC-05, PAN-SOC-06, PAN-SOC-22, PAN-SOC-23 |
| pwa-campo | PAN-SOC-34 `/app/campo/viajes` (offline) |
| pwa-socio | PAN-SOC-30, PAN-SOC-31 |
| landing | PAN-POR-03 |

### 6. Eventos y jobs (SAL)

- Emite: EVT-SOC-03, EVT-SOC-07 `soc.trip.completed`, EVT-SOC-12 `soc.vehicle.usageRecorded`, EVT-SOC-13 `soc.vehicle.unfit/.fit`, EVT-SOC-16.
- Consume: EVT-PER-03, EVT-CAT-09, EVT-CAT-10 y EVT-CAT-15 (alias `per.serviceContract.*` en M18, HUECO-TRV-02), EVT-CMP-08 (alias `cmp.purchaseInvoice.posted`).
- Jobs: JOB-SOC-06 `soc:vencimientos-flota`, JOB-SOC-07 `soc:mantenimiento-preventivo`, JOB-SOC-11 `soc:costo-convenios`, JOB-SOC-01 (grupo).

### 7. Escenarios de prueba punta a punta (SAL)

| ID | Dado / Cuando / Entonces |
|---|---|
| ESC-T12-SAL-01 | **Dado** un viaje no cubierto de 120 km con tarifa ARS 900 por km, **cuando** el chofer lo finaliza en PAN-SOC-34 y el responsable lo cierra, **entonces** se publica `soc.trip.completed` y M05 recibe un ítem facturable de ARS 108.000 (RF-SOC-080). |
| ESC-T12-SAL-02 | **Dado** un plan con tope anual de 2 traslados y uno ya usado, **cuando** se verifica una nueva solicitud, **entonces** la cobertura informa 1 disponible y el viaje queda cubierto (RF-SOC-035). |
| ESC-T12-SAL-03 | **Dado** una solicitud marcada emergencia, **cuando** se registra, **entonces** queda `derived`, muestra la derivación de PRM-SOC-048 y no se agenda (ESC-SOC-22). |
| ESC-T12-SAL-04 (error) | **Dado** AMB-01 con seguro vencido, **cuando** se lo asigna a un traslado, **entonces** la asignación falla con `soc.vehicle.unfit` (ESC-SOC-18). |
| ESC-T12-SAL-05 (permiso) | **Dado** un operador sin `soc.datosSensibles.ver`, **cuando** abre un traslado y exporta el informe, **entonces** el motivo aparece enmascarado y no se exporta (ESC-SOC-12). |
| ESC-T12-SAL-06 (aislamiento) | **Dado** un usuario de TEN-002, **cuando** consulta un viaje de TEN-001 por id, **entonces** recibe 404 (ESC-SOC-14). |

### 8. Preguntas abiertas (SAL)

- PA-SOC-01 (autorizaciones de internación), PA-SOC-02 (traslados de no asociados): asumidas por DEC-072.
- PA-MIG-19 (datos de salud en la migración): pendiente en T07.

### 9. HUECOS (SAL)

| ID | Hueco | Propuesta | Anexo |
|---|---|---|---|
| HUECO-SAL-01 | M04 no tiene regla de cálculo para el traslado (km × tarifa, importe fijo, viajes cortos `MOVIL.PRE_VIAJESCORTOS`, característica de viaje) ni para el coseguro de M02 §6.C.13. | Agregar en M04 una regla "cargo por evento de traslado" alimentada por EVT-SOC-07 (km, característica, cubierto) con lista para no asociados. | M04 · **Estado (04-11-2026):** Corregido en anexo: M04 RF-TAR-118, RN-TAR-249, PRM-TAR-170, ESC-TAR-35; M18 y T11 EVT-SOC-07 (payload con `characteristicCode`, `memberStatus`, `originalTripId`). |
| HUECO-SAL-02 | Nombre de destino de `AMBULANC`: T07 §19.20 usa `ambulanceTrips` y `ambulanceTripFeatures`; M18 usa `transportTrips` (RF-SOC-041). | Unificar en el nombre de M18. | T07 · **Estado (04-11-2026):** Corregido en anexo: T07 §19.20 (`transportTrips`, `tripLegs`, `tripCharacteristics`, `medicalProfessionals`). |

---

## Ficha VIV — Planes de vivienda

### 1. Resumen (VIV)

| Campo | Valor |
|---|---|
| Unidad central | **Vivienda inscripta** en un **plan de vivienda** con tipología (RF-SOC-085, RF-SOC-088), vinculada a un contrato de M02 de perfil vivienda (M02 §6.C.14) en la cuenta del inscripto; cada cuota es un **aporte porcentual** sobre el precio vigente de la tipología (RF-SOC-091). La construcción se sigue por etapas, actividades, materiales y certificados (RF-SOC-097 a RF-SOC-105). |
| Régimen | Plan de ahorro y construcción de la cooperativa: inscripción, adjudicación (sorteo, licitación, antigüedad u otra), aportes, construcción, entrega y eventual rescisión con comisión (RF-SOC-090, RF-SOC-108). Una cuenta, un plan (RF-SOC-089). |
| Perfil de cálculo ProCoop | Tipo 17 variante vivienda o aportes (M02 §6.C.14, RN-TAR-075): % mínimo antes o después de adjudicar, tope = % a facturar − % facturado, renglón subtipo 27 con cantidad = %/100 (RN-SOC-033). Parámetros V2 413 a 419, 634 a 639. |
| Olas | O10 (M02 §6.C.14, RF-SOC-085 a RF-SOC-112, RF-TAR-049 parte vivienda). |
| Hito de salida O10 | CU-SOC-08 y CU-SOC-09 en TEN-001: cuota de "Dúplex 2D" emitida en comprobante exclusivo, cobrada (sube % pagado), un certificado de avance aprobado por otro usuario y liquidado al constructor. |

### 2. Configuración (VIV)

- **Perfil BASE §84 en M02**: ficha §6.C.14; conceptos de comisión, diferencia, facturación eventual y liquidación referidos desde M18 (PRM-SOC-025, PRM-SOC-027, PRM-SOC-031, PRM-SOC-032).
- **PRM relevantes**: PRM-SOC-018 a PRM-SOC-021 (mínimos, máximo anual, comprobante exclusivo), PRM-SOC-022 y PRM-SOC-023 (vales y obra por defecto), PRM-SOC-024 (aporte sobre el máximo), PRM-SOC-025 a PRM-SOC-027 (rescisión), PRM-SOC-028 y PRM-SOC-029 (rubros de compras), PRM-SOC-030 (fondo fiduciario), PRM-SOC-034 (comprobante de entrega), PRM-SOC-040 a PRM-SOC-043 (comprobante de baja y plantillas); PRM-TAR-072 y PRM-TAR-073 quedaron reemplazados por PRM-SOC-019 y PRM-SOC-018: M18 es dueño de los mínimos y M04 no tiene fallback propio (HUECO-VIV-02 corregido); PRM-CAT-072 (baja con cuotas pendientes).
- **Datos maestros**: plan, tipologías, etapas, actividades y materiales (RF-SOC-085, RF-SOC-097, RF-SOC-098, PAN-SOC-17, API-SOC-032); precios por tipología con vigencia (RF-SOC-086, API-SOC-034); validación de configuración obligatoria antes de inscribir (RN-SOC-041, API-SOC-033).
- **Precarga demo ficticia**: "Plan Demo 2026" con tipología "Dúplex 2D" a ARS 40.000.000; aporte mínimo después de adjudicar 1 % (ESC-SOC-15).

### 3. Recorrido del ciclo de vida (VIV)

| Paso | Qué ocurre | IDs |
|---|---|---|
| Oferta y landing (M19) | Publicación del plan con requisitos; el precio de la tipología se informa como referencia vigente. | RF-POR-005, PAN-POR-03, M02 §6.C.14 |
| Solicitud (M09) | Solicitud de inscripción con requisitos del tipo; el contrato se crea al admitir. | RF-CRM-060, RF-CRM-063, DEC-011 |
| Alta, adhesión y grupo familiar (M02/M01/M18) | Inscripción con fecha, tipología y terreno propio; rechazo de un segundo plan en la cuenta; adjudicación posterior con fecha válida. Grupo familiar **No aplica**. | API-CAT-33, RF-SOC-088, RF-SOC-089, RF-SOC-090, RN-SOC-037, API-SOC-035, API-SOC-036, PAN-SOC-18, PAN-SOC-19; HUECO-TRV-06 |
| Carencias, convenios y prestación (M18) | Carencia **No aplica**. La "prestación" es la construcción y la entrega (ver paso de uso). | — |
| Cálculo (M04) | M18 informa % y precio vigente por `billing-inputs`; M04 calcula el renglón subtipo 27 con tope al 100 %; aporte sobre el máximo anual solo con PRM-SOC-024; actualización masiva de precios con aprobación. | API-SOC-006, RF-SOC-086, RF-SOC-087, RF-SOC-091, RF-SOC-092, RN-SOC-032 a RN-SOC-035, RN-TAR-075 (precio vigente a la fecha del período facturado), RF-TAR-021, JOB-SOC-05, EVT-SOC-11, PAN-SOC-17 (PAN-TAR-29 reemplazada), PA-SOC-09; HUECO-VIV-01, HUECO-VIV-02 (corregidos) |
| Facturación (M05) | Comprobante exclusivo de cuotas de vivienda (no se mezcla con otros productos); facturación eventual de aportes; la anulación descuenta el % facturado. | RF-SOC-093, RF-SOC-094, RF-SOC-096, RN-SOC-036, RN-SOC-042, PRM-SOC-021, CU-SOC-08, EVT-FAC-07, EVT-FAC-08, PA-SOC-13; HUECO-TRV-02 |
| Fiscal y terceros (M06) | **No aplica** régimen de terceros; tratamiento de IVA del aporte por concepto en M06. | RF-TAR-056 |
| Cuenta corriente y cobro (M07) | Cobro de cuotas con permiso específico; el pago actualiza el % pagado; transferir cuotas exige caja abierta. | RF-SOC-095, RF-COB-074, RN-SOC-038, EVT-COB-04, ESC-SOC-23 |
| Mora y efecto sobre la cobertura (M08) | Mora del plan configurable (meses adeudados para fondo fiduciario); los planes de vivienda no se reconectan como un servicio de red. | RF-SOC-111, RN-SOC-046, PRM-SOC-030, RN-SOC-047, RF-SOC-109, RN-MOR-082, PA-SOC-08 |
| Solicitud de prestación o uso (M18/M09) | Progreso por actividad (≤ 100 %), materiales asignados, reservados y retirados con vale contra stock, certificados aprobados por otro usuario y liquidados al constructor; entrega con comprobante. | RF-SOC-097 a RF-SOC-105, RN-SOC-043 a RN-SOC-045, API-SOC-037 a API-SOC-041, PAN-SOC-19, PAN-SOC-20, CU-SOC-09, CU-SOC-10 |
| Cambios y bajas (M01) | Cambio de tipología con recálculo; transferencia de vivienda, cuotas y construcción; rescisión solo de planes conectados con comisión y diferencia; baja con cuotas pendientes con supervisor; fallecimiento del inscripto → sucesión. | RF-SOC-106, RF-SOC-107, RF-SOC-108, RN-SOC-039, RN-SOC-040, CU-SOC-11, PRM-CAT-072, RN-CAT-072, RF-PER-141, EVT-PER-03, DEC-045 |
| Portal (M19) | Mi plan de vivienda: tipología, % aportado, cuotas y avance de obra. | PAN-SOC-33, API-SOC-059, RF-SOC-112, RF-SOC-143; HUECO-TRV-04 |
| Comunicaciones (T09) | Textos de transferencia, baja y cambio de plan por plantilla; avisos al inscripto de adjudicación y entrega con los tipos T09 `soc.housing.allocated` y `soc.housing.delivered` (T09 §9.6.8, disparados por EVT-SOC-08; antes `[REF-PENDIENTE]`: T09 no tenía tipos para EVT-SOC-08). | PRM-SOC-041, PRM-SOC-042, PRM-SOC-043, EVT-SOC-08, `soc.housing.allocated`, `soc.housing.delivered` |
| Reportes (T10) | Aporte teórico vs facturado, estado de aportes y del plan, composición, desviación, materiales y cambio de plan. | REP-SOC-12 a REP-SOC-17, RF-SOC-110, PAN-SOC-21; HUECO-TRV-05 |
| Contabilidad (M15) e institucional (M17) | Bloqueo del módulo "viviendas" por período; vales de vivienda imputados a la obra por defecto; certificados liquidados a M12, M14 y M15. M17 **No aplica**. | RF-CON-029, RF-CON-071, EVT-SOC-09, EVT-SOC-10, PRM-SOC-023 |
| Migración (T07, tablas CAT) | `PLANESVIV` → planes; `PRECIOSVIV` → precios; `VIVIENDAS` → viviendas; un contrato M02 por vivienda, con estado según inscripción, adjudicación o entrega (RN-MIG-052, PRM-MIG-063; HUECO-VIV-03); `VIV_ETAPA`, `VIV_ACTIVIDAD`, `VIV_MATACT`, `VIV_PROGRESO`, `VIV_PROGMAT`, `VIV_MAT` → construcción; `VIV_RETM`, `VIV_RET_IT` → retiros (M13); `CATE_SER_EXTRAS` (`VIV_*`) → M18. | T07 §19.19, T07 §19.2 (`CATE_SER_EXTRAS`), M02 §19.1 (`PLANESVIV`, `VIVIENDAS`); HUECO-VIV-03 |

### 4. Reglas críticas (VIV)

- RN-SOC-033: % por cuota = mínimo después de adjudicar si está adjudicada, si no el mínimo antes; tope = % a facturar − % facturado.
- RN-SOC-032: precio vigente = último con fecha ≤ fecha del período facturado (contradice RN-TAR-075, HUECO-VIV-01).
- RN-SOC-036: comprobante exclusivo de vivienda.
- RN-SOC-037: un plan por cuenta.
- RN-SOC-039 / RN-SOC-040: rescisión solo de planes conectados, con comisión y concepto de diferencia.
- RN-SOC-042: la anulación de una cuota descuenta el % facturado.
- RN-SOC-045: progreso ≤ 100 %; materiales ≤ asignados salvo autorización.
- RN-SOC-047: los planes de vivienda no se reconectan.

### 5. Pantallas (VIV)

| App | Pantallas |
|---|---|
| admin | PAN-SOC-17 a PAN-SOC-21, PAN-CAT-14, PAN-COB-10. PAN-TAR-29 quedó reemplazada por PAN-SOC-17 (HUECO-VIV-02) |
| pwa-socio | PAN-SOC-33 `/app/vivienda`, PAN-POR-38, PAN-POR-39 |
| landing | PAN-POR-03 |

### 6. Eventos y jobs (VIV)

- Emite: EVT-SOC-08 `soc.housing.allocated/.delivered/.terminated/.transferred/.planChanged`, EVT-SOC-09 `soc.housing.materialWithdrawn/.materialReturned`, EVT-SOC-10 `soc.housing.certificateLiquidated`, EVT-SOC-11 `soc.housing.priceUpdated`.
- Consume: EVT-FAC-07, EVT-FAC-08 (alias `fac.invoice.voided` en M18), EVT-COB-04, EVT-COB-05 (alias `cob.payment.reversed`), EVT-STK-02 (alias `stk.movement.posted`), EVT-CMP-08, EVT-TES-15, EVT-WFL-010.
- Jobs: JOB-SOC-05 `soc:actualizar-precios-vivienda`, JOB-TAR-03, JOB-FAC-03.

### 7. Escenarios de prueba punta a punta (VIV)

| ID | Dado / Cuando / Entonces |
|---|---|
| ESC-T12-VIV-01 | **Dado** "Dúplex 2D" a ARS 40.000.000, adjudicada, mínimo 1 % y 99,5 % facturado, **cuando** M04 calcula la cuota, **entonces** el aporte es 0,5 % = ARS 200.000 (ESC-SOC-15). |
| ESC-T12-VIV-02 | **Dado** una cuota de 1 % emitida (ARS 400.000), **cuando** se anula la factura, **entonces** `pctBilled` baja 1 punto y el evento repetido no lo baja dos veces (ESC-SOC-16, ESC-SOC-23). |
| ESC-T12-VIV-03 (error) | **Dado** una cuenta con un plan de vivienda, **cuando** se inscribe un segundo plan, **entonces** se rechaza con `soc.housing.secondPlan` (ESC-SOC-17). |
| ESC-T12-VIV-04 | **Dado** aportes por ARS 4.000.000 y comisión de rescisión 10 %, **cuando** se rescinde el plan conectado con aprobación, **entonces** se calcula ARS 400.000 de comisión y el saldo a devolver o compensar (RF-SOC-108). |
| ESC-T12-VIV-05 (separación de tareas) | **Dado** el técnico que cargó el progreso, **cuando** intenta aprobar el certificado, **entonces** se rechaza (ESC-SOC-13). |
| ESC-T12-VIV-06 (aislamiento) | **Dado** un usuario de TEN-002 con `soc.vivienda.ver`, **cuando** pide `/api/admin/soc/housing-units/{id de TEN-001}`, **entonces** recibe 404. |
| ESC-T12-VIV-07 | **Dado** precios de "Dúplex 2D" del 01-03-2026 y del 01-09-2026, **cuando** se factura el período 07-2026 el 05-10-2026, **entonces** se usa el precio del 01-03-2026 (RF-SOC-086, RN-SOC-032). |

### 8. Preguntas abiertas (VIV)

- PA-SOC-08 (fondo fiduciario), PA-SOC-09 (actualización masiva de precios), PA-SOC-13 (comprobante exclusivo), PA-SOC-15 (configuración de planes): asumidas por DEC-072.

### 9. HUECOS (VIV)

| ID | Hueco | Propuesta | Anexo |
|---|---|---|---|
| HUECO-VIV-01 | RN-TAR-075 toma el precio "último con fecha ≤ hoy", mientras RN-SOC-032, RF-SOC-086 y CTR-SOC-15 fijan "≤ fecha del período facturado". | Corregir RN-TAR-075 a la fecha del período. | M04 · **Estado (04-11-2026):** Corregido en anexo: M04 RN-TAR-075 (precio vigente a la fecha del período facturado). |
| HUECO-VIV-02 | Dueño duplicado de precios y mínimos: PAN-TAR-29 y `productPrices` (M04) vs PAN-SOC-17 y API-SOC-034 (M18); PRM-TAR-072/073 vs PRM-SOC-018/019. T07 §19.19 manda `PRECIOSVIV` a `housingPlans.prices` (M18) y M04 §19 a `productPrices`. | M18 dueño de precios y mínimos (expone `billing-inputs`); M04 solo calcula. Retirar PAN-TAR-29 y PRM-TAR-072/073. | M04, T07 · **Estado (04-11-2026):** Corregido en anexo: M04 RN-TAR-075, PAN-TAR-29 → PAN-SOC-17, PRM-TAR-072/073 → PRM-SOC-019/018 (reemplazados); T07 §19.19 (`PRECIOSVIV` → `housingPrices` de M18). |
| HUECO-VIV-03 | `VIVIENDAS` se migra a `housingUnits` "vinculadas a `serviceContracts`" sin definir cómo se crea el contrato M02 de cada vivienda ni su estado canónico. | Regla en T07 §19.19: un contrato M02 por vivienda con estado según inscripción, adjudicación o entrega. | T07, M02 · **Estado (04-11-2026):** Corregido en anexo (parcial): T07 RN-MIG-052, PRM-MIG-063; pendiente: confirmar el valor de `CONDICION_TRANSFERENCIA` (`CONDICION = 5` se trató como `terminated`, [VERIFICAR]). · **Estado (05-11-2026):** Corregido en anexo: T07 RN-MIG-052 (dato relevado: `CONDICION_TRANSFERENCIA` toma los valores de condición 0..5 y `CONDICION = 5` es "no vigente"; origen de transferencia con `CONDICION` 3, 4 o 5 → `superseded`), PRM-MIG-063. Antes: parcial, pendiente confirmar `CONDICION_TRANSFERENCIA`. |

---

## Ficha TAS — Tasas y conceptos por cuenta de terceros

### 1. Resumen (TAS)

| Campo | Valor |
|---|---|
| Unidad central | **Convenio con el organismo beneficiario** (RF-FIS-134, PAN-FIS-33) que habilita uno o más **conceptos por cuenta de terceros** del catálogo (RF-CAT-037) para incluirlos en la factura de un servicio propio; alternativamente, **comprobantes del tercero** importados (RF-FAC-121) o cobrados por código de barras del tercero (RF-COB-177). El dinero cobrado es **pasivo** con el tercero hasta su rendición (RF-FIS-136, RF-FIS-139). |
| Régimen | Cobro por cuenta y orden de terceros (tasas municipales, fondos provinciales, alumbrado público, tasa hospital municipal Ley 10739): solo con convenio y fundamento normativo cargados (RN-FIS-121, RF-FAC-120). Exhibición separada del cargo propio (RF-FIS-135). |
| Perfil de cálculo ProCoop | Reglas de tipo impuesto vinculadas al catálogo aprobado de M06 (RF-TAR-057); clase de servicio "4 Tasa hospital municipal" (`CLASESER`); `CON_TASAS` no es regla de cálculo: es concepto de compra en `purchaseConcepts` de M12 (T05 COL-CMP-05, HUECO-TAS-03; antes "y `CON_TASAS` (M02 §6.C.15)"); tributo municipal con Id ARCA 3 (RF-FIS-047). |
| Olas | O4 (M02 §6.C.15, RF-FIS-134, RF-FIS-135, RF-FIS-137, RF-FIS-141, RF-FAC-120, RF-FAC-121). O5: pasivo, imputación de pagos parciales, rendición y cobro por código del tercero (RF-FIS-136, RF-FIS-138, RF-FIS-139, RF-COB-019, RF-COB-177). O8: FECESCOR (RF-FIS-140). |
| Hito de salida O4 | Una factura de energía de TEN-001 con el bloque "por cuenta y orden de terceros" de la tasa hospital municipal, autorizada con el tributo en Id 3. |
| Hito de salida O5 | La rendición del período del convenio de la tasa cuadra con lo cobrado e imputado al tercero (REP-FIS-012) y genera la orden de pago en M14. |

### 2. Configuración (TAS)

- **Perfil BASE §84 en M02**: ficha §6.C.15; clases de servicio en PAN-CAT-09 (RF-CAT-053); concepto de tasa de terceros en PAN-CAT-06 (RF-CAT-037).
- **PRM relevantes**: PRM-COB-022 (prioridad de servicio en imputación), PRM-COB-023 (orden de componentes dentro de la obligación), PRM-COB-132 (cobro por cuenta de terceros), PRM-FIS-114 (entidad de terceros FECESCOR), PRM-FIS-117 (modelo de impresión de facturas de terceros), PRM-FIS-118 (concepto A.M.A.), PRM-FIS-119 (titular de farmacia).
- **Datos maestros**: convenio con CUIT, fundamento, vigencia, base, alícuota o importe, servicio y documento admitidos, exhibición, comisión, cuenta de pasivo y política de pagos parciales (RF-FIS-134, PAN-FIS-33); catálogo de tributos municipales propio vs de terceros (RF-FIS-141); terceros para cobro por código de barras (RF-COB-177, PAN-COB-30).
- **Precarga demo ficticia**: convenio "Municipalidad Demo — Tasa hospital" con importe fijo ficticio ARS 1.000 por factura de energía residencial y comisión 2 %; tercero "Ente Demo Agua" para cobro por código de barras (datos de ficha, no de anexo).

### 3. Recorrido del ciclo de vida (TAS)

| Paso | Qué ocurre | IDs |
|---|---|---|
| Oferta y landing (M19) | **No aplica**: el concepto no se contrata; acompaña al servicio propio. | — |
| Solicitud (M09) | **No aplica** para el alta. Reclamos sobre la tasa se atienden como reclamo de factura. | RF-CRM-065 |
| Alta, adhesión y grupo familiar (M02/M01/M18) | El concepto se asocia al servicio o categoría que lo admite en el convenio; no hay contrato propio del socio con el tercero. Grupo familiar **No aplica**. | RF-CAT-037, RF-CAT-053, M02 §6.C.15; HUECO-TAS-01 |
| Carencias, convenios y prestación (M18) | **No aplica**. | — |
| Cálculo (M04) | Regla de tipo impuesto vinculada al tributo aprobado de M06; sin tributo aprobado la regla no publica; M06 bloquea el cálculo sin fundamento. | RF-TAR-057, RF-TAR-056, RN-FIS-121, EVT-FIS-20 `fis.taxCalculation.blocked` |
| Facturación (M05) | Bloque separado "por cuenta y orden de terceros" en la representación; sin convenio el ítem va a excepción; importaciones de terceros con adaptadores por origen; la anulación libera los conceptos de terceros. | RF-FAC-120, RF-FAC-121, RF-FAC-135, RF-FAC-101, PAN-FAC-22, JOB-FAC-13 `fac:importar-terceros`, RF-FIS-137, RN-FIS-114, PRM-FIS-117 |
| Fiscal y terceros (M06) | Tratamiento fiscal según convenio (no gravado / no ingreso propio); tributo municipal Id 3; total de factura con sección de terceros propia. | RF-FIS-134, RF-FIS-135, RF-FIS-141, RF-FIS-047, RN-FIS-082, EVT-FIS-01 |
| Cuenta corriente y cobro (M07) | Componente del tercero con saldo propio dentro de la obligación; prioridad configurable; pago parcial prorrateado entre propio y terceros; cobro de comprobantes del tercero por código de barras con comisión. | RF-COB-019, RN-COB-023, RN-COB-025, RF-FIS-138, PA-FIS-05, RF-COB-177, RN-COB-142, PAN-COB-30, EVT-COB-21, EVT-FIS-16 |
| Mora y efecto sobre la cobertura (M08) | No está definido si el saldo de terceros integra el saldo elegible para suspender el servicio que lo factura ni si genera recargos propios. Corregido (HUECO-TAS-02): queda fuera del saldo elegible por defecto y los recargos solo se aplican si el convenio los define (RN-MOR-142, RN-FIS-127, `thirdPartyAgreements.moraPolicy`). | RF-MOR-068, RN-MOR-082; HUECO-TAS-02 |
| Solicitud de prestación o uso (M18/M09) | **No aplica**. | — |
| Cambios y bajas (M01) | El concepto termina con la vigencia del convenio o con la baja del contrato que lo lleva; la deuda queda en el titular saliente. | RF-FIS-134 (vigencia), DEC-045 |
| Portal (M19) | Factura con apertura por servicio y bloque de terceros; pago con la imputación configurada. | PAN-POR-39, PAN-POR-40, RF-POR-079 |
| Comunicaciones (T09) | **No aplica** comunicación propia; el bloque de terceros viaja en la factura. | — |
| Reportes (T10) | Rendición por convenio de terceros; impuestos facturados por categoría; rendiciones de entes. | REP-FIS-012, REP-FIS-013, REP-COB-009 (T10 §15.4.3 y §15.4.4) |
| Contabilidad (M15) e institucional (M17) | Rol de importe "tasa de terceros" acredita el pasivo del convenio; la rendición lo cancela; comisión como ingreso propio. M17 **No aplica**. | RF-CON-052, RF-FIS-136, RF-CON-077, EVT-FIS-16, EVT-FIS-17 `fis.remittance.approved/.paid`, EVT-COB-21 |
| Migración (T07, tablas CAT) | `TERCEROS` → `thirdPartyAgreements` y `FACTURAS_TERCEROS` → `thirdPartyCollections` (T07 §19.7, O5); `IMPUESTO` → `taxes` (T07 §19.2, O4); `CON_TASAS` → `purchaseConcepts` de M12 (T07 §19.2, T05 COL-CMP-05, O8; antes "`CON_TASAS` e `IMPUESTO` → `taxes` (O4)"); `CLASESER` → `serviceClasses` con la tasa hospital convertida en concepto de tercero (M02 §19.1, CTR-CAT-17). Cada fila se clasifica antes con la regla de M06 RF-FIS-163 / RN-FIS-126 que aplica T07 (RN-MIG-051); sin clasificación, rechazo bloqueante (HUECO-TAS-03). | T07 §19.2, T07 §19.7, M02 §19.1; HUECO-TAS-03 |

### 4. Reglas críticas (TAS)

- RN-FIS-121: un concepto por cuenta de terceros solo se habilita con convenio y fundamento cargados.
- RF-FAC-120: sin convenio vigente el ítem queda como excepción "Concepto de terceros sin convenio".
- RF-FIS-136: lo cobrado es pasivo con el tercero, nunca ingreso propio.
- RF-FIS-141: un tributo propio marcado no trasladable no se asigna como cargo al socio.
- RF-FIS-138: el pago parcial se imputa entre propio y terceros según la política aprobada (prorrata por DEC-072).
- RN-COB-073 / RN-COB-142: un cobro de tercero ya rendido no se puede anular.
- DEC-037: una factura que queda en cero no se emite, aunque tenga conceptos de terceros en cero.

### 5. Pantallas (TAS)

| App | Pantallas |
|---|---|
| admin | PAN-FIS-33 `/admin/fis/third-parties/agreements`, PAN-FIS-34 `/admin/fis/third-parties/remittances`, PAN-CAT-06, PAN-CAT-09, PAN-COB-30, PAN-COB-10, PAN-FAC-22 `/admin/fac/importaciones` |
| pwa-socio | PAN-POR-39, PAN-POR-40 |
| landing | No aplica |

### 6. Eventos y jobs (TAS)

- Emite: EVT-FIS-16 `fis.thirdPartyCharge.collected`, EVT-FIS-17 `fis.remittance.approved/.paid`, EVT-FIS-20 `fis.taxCalculation.blocked`, EVT-COB-21 `cob.thirdPartyCollection.recorded`.
- Consume: EVT-FAC-07, EVT-FAC-08, EVT-COB-04, EVT-COB-05.
- Jobs: JOB-FAC-13 `fac:importar-terceros`, JOB-FIS-15 `fis:rendicion-terceros`, JOB-FAC-03.

### 7. Escenarios de prueba punta a punta (TAS)

| ID | Dado / Cuando / Entonces |
|---|---|
| ESC-T12-TAS-01 | **Dado** el convenio "Municipalidad Demo — Tasa hospital" vigente por ARS 1.000 por factura, **cuando** se emite la factura de energía de ARS 20.000 de un socio residencial, **entonces** el PDF muestra el bloque de terceros con ARS 1.000, el tributo va con Id 3 y el asiento acredita el pasivo del convenio. |
| ESC-T12-TAS-02 | **Dado** esa factura de ARS 21.000 (ARS 1.000 de terceros), **cuando** el socio paga ARS 10.500, **entonces** se imputan ARS 500 al tercero por prorrata y EVT-FIS-16 informa ese importe (RF-FIS-138). |
| ESC-T12-TAS-03 (error) | **Dado** un ítem "Tasa de bomberos" sin convenio vigente, **cuando** corre el lote, **entonces** el ítem queda en la bandeja de excepciones "Concepto de terceros sin convenio" y la factura sale sin ese ítem (RF-FAC-120). |
| ESC-T12-TAS-04 | **Dado** cobros imputados al tercero por ARS 50.000 en el período y comisión 2 %, **cuando** corre JOB-FIS-15 y se aprueba la rendición, **entonces** el neto a rendir es ARS 49.000, M14 recibe la orden de pago y REP-FIS-012 cuadra. |
| ESC-T12-TAS-05 (error) | **Dado** un comprobante de "Ente Demo Agua" cobrado en caja y ya rendido, **cuando** el cajero intenta anular el cobro, **entonces** se rechaza (RN-COB-073). |
| ESC-T12-TAS-06 (aislamiento) | **Dado** un usuario de TEN-002 con `fis.terceros.configurar`, **cuando** lista convenios, **entonces** no ve el convenio de TEN-001 y su id devuelve 404. |
| ESC-T12-TAS-07 (error) | **Dado** un archivo IAL de alumbrado con un suministro inexistente, **cuando** se valida la importación, **entonces** esa fila se rechaza con "CUENTA INEXISTENTE" y las demás quedan listas para confirmar (RF-FAC-121). |

### 8. Preguntas abiertas (TAS)

- PA-FIS-05 (imputación de pagos parciales): asumida por DEC-072 (prorrata).
- PA-FIS-16 (FECESCOR): pendiente en M06.

### 9. HUECOS (TAS)

| ID | Hueco | Propuesta | Anexo |
|---|---|---|---|
| HUECO-TAS-01 | M02 §6.C.15 no define un perfil de servicio "convenio de terceros" ni un contrato propio para los conceptos "Fijos" que ProCoop factura sin servicio propio asociado. | Definir en M02 si el concepto de terceros puede facturarse sin contrato del socio (por ejemplo, por inmueble) o si siempre cuelga de un contrato propio. | M02, M06 · **Estado (04-11-2026):** Decisión: PA-CAT-18, respondida con la opción recomendada (DEC-083) |
| HUECO-TAS-02 | No está definido si el saldo de conceptos de terceros integra el saldo elegible de mora (RF-MOR-068) ni si admite recargos o intereses propios. | Excluirlo del saldo elegible por defecto y permitir incluirlo solo si el convenio lo autoriza; recargos según convenio. | M08, M06 · **Estado (04-11-2026):** Corregido en anexo: M06 RF-FIS-164, RN-FIS-127, `thirdPartyAgreements.moraPolicy`; M08 RN-MOR-142, RF-MOR-068, PRM-MOR-202/203. |
| HUECO-TAS-03 | `CON_TASAS` se migra a `taxes` de M06 (T07 §19.2), mientras M02 §19.1 convierte la tasa hospital de `CLASESER` en concepto de tercero; no hay regla para decidir si una fila es tributo propio, tributo de terceros o concepto de terceros. | Regla de clasificación en T07 basada en el organismo de `IMPUESTO.ORIGEN` y la existencia de convenio. | T07, M06, M02 · **Estado (04-11-2026):** Corregido en anexo (parcial): M06 RF-FIS-163, RN-FIS-126, `taxDefinitions.nature`; T07 RN-MIG-051; M02 §19 `CLASESER`; pendiente: si `CON_TASAS` se administra desde Compras y qué valores de `IMPUESTO.ORIGEN` usa cada cooperativa ([VERIFICAR]). · **Estado (05-11-2026):** Corregido en anexo: M06 RF-FIS-163, RN-FIS-126, `taxDefinitions.nature`, §19 `CON_TASAS`; T07 RN-MIG-051, §19.2 (dato relevado: `CON_TASAS` se administra solo desde Compras y va a `purchaseConcepts` de M12; `IMPUESTO.ORIGEN` 0 otros, 1 municipal, 2 provincial, 3 nacional, 4 internos); M02 §19 `CLASESER`; T05 COL-CMP-05; M12 §7 y §19.2 (`purchaseConcepts` absorbe `CON_TASAS` con `kind = rateConcept`). Antes: parcial, pendiente administración de `CON_TASAS` y valores de `IMPUESTO.ORIGEN`. |

---

## Ficha CAP — Capital social como concepto

### 1. Resumen (CAP)

| Campo | Valor |
|---|---|
| Unidad central | **Movimiento de capital** del asociado (`capitalMovements`, RF-INS-036) por rubro de capital (RF-INS-029), originado por un **concepto de aporte de capital** del catálogo (RF-CAT-037, `capitalContribution`) facturado, por el importe de capital al alta de un servicio (RF-INS-031) o por la afiliación (RF-INS-034). |
| Régimen | Cuotas sociales de la Ley 20.337: el aporte no es precio del servicio. Va en renglón propio de la factura del servicio, con auxiliar separado y leyenda (DEC-061, RF-INS-040); suscripción e integración configurables (RN-INS-014). |
| Perfil de cálculo ProCoop | `IMP_CAPITAL` del contrato y capitalización por rubro de producto (`RUBCAPI`); V2 73 (suscribe al facturar), V2 2636 (suscribe en la afiliación), V2 2916 (integra en el pago), V2 2736 (capitalización automática) (M02 §6.C.16, RN-INS-013, RN-INS-014). |
| Olas | **O5** capital mínimo (DEC-019): rubros, conceptos capitalizables, importe al alta, momento, integración, libro mayor, fuentes, job de registración, cuota en factura, reversión, ajuste, exclusión con el lote, estado y resumen, contabilización (RF-INS-029 a RF-INS-031, RF-INS-034 a RF-INS-038, RF-INS-040, RF-INS-042 a RF-INS-046, RF-INS-056). **O6**: capital en convenios (RF-INS-041). **O10**: resto (reglas versionadas, valor nominal, revisión, deuda, reserva, transferencia, rescate, cierre, carga manual, importación, distribución). M02 §6.C.16 lo ubica en O10, u O4 si el piloto factura capital. |
| Hito de salida O5 | En TEN-001, una factura de servicio con renglón "Cuota social" de ARS 1.000 genera el movimiento `billed`; un pago del 40 % integra ARS 400; el asiento existe en M15 y REP-INS-06 no muestra diferencias. |

### 2. Configuración (CAP)

- **Perfil BASE §84 en M02**: ficha §6.C.16; concepto `capitalContribution` en PAN-CAT-06 (RF-CAT-037).
- **PRM relevantes**: PRM-INS-014 (capitalización automática), PRM-INS-015 (momento de suscripción), PRM-INS-016 (momento de integración), PRM-INS-017 (cobro en factura del servicio, en documento propio o ninguno), PRM-INS-018 (ventana de revisión), PRM-INS-019 (deuda de capital tolerada), PRM-INS-021 a PRM-INS-023 (reserva), PRM-INS-024 a PRM-INS-028 (rescate), PRM-INS-029 (cierre), PRM-INS-031 (fecha efectiva del capital facturado); PRM-FAC-061 (registrar capital al cerrar el lote).
- **Datos maestros**: rubros de capital con cuenta contable (RF-INS-029, PAN-INS-06); conceptos o servicios capitalizables (RF-INS-030); reglas de suscripción y valor nominal versionados (RF-INS-032, RF-INS-033); cuentas de capital por rubro en M15 (RF-CON-025, RF-CON-150).
- **Precarga demo ficticia**: rubro "Capital servicios" con cuenta contable ficticia; valor nominal ARS 1.000 por cuota social; regla "1 cuota social al activar Internet" (datos de ficha, no de anexo).

### 3. Recorrido del ciclo de vida (CAP)

| Paso | Qué ocurre | IDs |
|---|---|---|
| Oferta y landing (M19) | La ficha del servicio informa si exige asociación; el asistente inicia la solicitud de ingreso sin bloquear el trámite. | RF-POR-060, PAN-POR-32 |
| Solicitud (M09) | Solicitud de ingreso como asociado (M17) o de alta de servicio con capital al alta; la baja de asociado se deriva a M17 sin automatismo sobre los servicios. | RF-CRM-074, EVT-INS-01 |
| Alta, adhesión y grupo familiar (M02/M01/M18) | Al activarse el contrato se registra una única vez la suscripción del importe de capital al alta, o al aprobar el ingreso según PRM-INS-015. Grupo familiar **No aplica**. | RF-INS-031, RF-INS-034, EVT-CAT-09, EVT-INS-02 |
| Carencias, convenios y prestación (M18) | **No aplica**. | — |
| Cálculo (M04) | **No aplica**: el importe de capital no es precio; lo define M17 por regla de suscripción o concepto capitalizable. | RF-INS-030, RF-INS-032 |
| Facturación (M05) | Renglón propio "Cuota social" con leyenda; bloqueo del lote si hay registración de capital en curso sobre el mismo universo; al cerrar el lote, totales por rubro de capital a M17; la anulación libera el registro de capital. | DEC-061, RF-INS-040, RF-FAC-017, RF-INS-044, RN-INS-018, RF-FAC-056, PRM-FAC-061, EVT-FAC-05, EVT-FAC-06, RF-FAC-101, RF-INS-042, RN-INS-019 |
| Fiscal y terceros (M06) | El aporte de capital no es ingreso por servicios; M06 lo trata con la clase fiscal "aporte de capital" RF-FIS-161 / RN-FIS-124: no gravado, fuera del neto y de todas las bases, informado en `ImpTotConc` o fuera del comprobante según PRM-FIS-122 (encuadre a validar con el contador) (antes `[REF-PENDIENTE]`: no estaba explícito en M06). | RF-CON-075; RF-FIS-161; RN-FIS-124; HUECO-CAP-04 |
| Cuenta corriente y cobro (M07) | Integración al confirmarse el pago, proporcional pago/total del comprobante con redondeo y ajuste en el último pago. | RF-INS-035, RN-INS-015, RN-INS-017, EVT-COB-04, EVT-COB-05, RF-COB-176; HUECO-CAP-02 (corregido: RF-COB-176 es solo conciliación de cierre) |
| Mora y efecto sobre la cobertura (M08) | El convenio registra el capital incluido y lo revierte si se anula; la deuda de capital vencida sobre el umbral puede excluir del padrón; la deuda de capital no suspende servicios por sí sola. | RF-MOR-148, RN-MOR-114, RF-INS-041, RF-INS-047, RN-INS-021, PRM-INS-019, RF-MOR-069, EVT-MOR-14 |
| Solicitud de prestación o uso (M18/M09) | **No aplica**. | — |
| Cambios y bajas (M01) | Transferencia de capital entre asociados con aprobación; transferir una cuenta no mueve capital salvo decisión explícita; rescate al egreso con límite anual, cola y aprobación del consejo; fallecimiento → egreso y sucesión. | RF-INS-049, RF-INS-050, RF-INS-051, RF-INS-052, RF-INS-058, RN-INS-023, RN-INS-028, `ins.capital.refund` (T11), EVT-INS-06, EVT-INS-10, EVT-INS-11, EVT-INS-12, RF-PER-141, EVT-PER-03 |
| Portal (M19) | Mi asociación con resumen de capital y descarga del estado; renglón de cuota social visible en la factura. | PAN-INS-30, RF-INS-045, EVT-INS-08 (consumidor M19), PAN-POR-39; HUECO-TRV-04 |
| Comunicaciones (T09) | Estado de cuenta de capital enviado por T09; aviso del reembolso pagado. | PAN-INS-08, `ins.capitalRefund.paid` (antes `ins.capital.refund.paid`) (T09, EVT-INS-12) |
| Reportes (T10) | Estado de cuenta de capital, resumen, conciliación con contabilidad, deuda de capital, rescates; API externa de resumen de capital. | REP-INS-04 a REP-INS-08, API-BIA-114, `bi_fact_member` (T10 §7.15); HUECO-TRV-05 |
| Contabilidad (M15) e institucional (M17) | Cada movimiento confirmado genera su asiento por rubro; transferencias entre asociados sin asiento si la cuenta es la misma; conciliación del auxiliar con contabilidad y exposición en el EEPN. | RF-INS-056, EVT-INS-08, EVT-INS-09, RF-CON-025, RF-CON-075, RF-CON-098, RF-CON-150, RF-CON-151, RF-CON-152, RN-CON-028, REP-INS-06, PAN-INS-12; HUECO-CAP-01 (corregido: RF-CON-098, 150 y 151 en O5; RF-CON-161 en O10) |
| Migración (T07, tablas CAT) | `CAPITAL` (cuotas facturadas, vinculadas al comprobante), `CAPITAL_RES` (saldos), `RUBCAPI` (rubros), `SERSOC.IMP_CAPITAL`; importación masiva con conciliación. | T07 §19.1 (`CAPITAL`, `CAPITAL_RES`, `RUBCAPI`), RF-INS-055, PAN-INS-13; HUECO-CAP-03 (corregido: `capitalMovements` y proyección `capitalBalances` de M17 §7.33) |

### 4. Reglas críticas (CAP)

- DEC-061 / RF-INS-040: el aporte va en renglón propio con leyenda, sin mezclarse con el abono.
- RN-INS-012: un rubro de productos pertenece a un solo rubro de capitalización.
- RN-INS-015: integración proporcional al pago, con decimal.js y ajuste en el último pago.
- RN-INS-018 / RF-INS-044: exclusión entre emisión y registración de capital por universo y período.
- RN-INS-019: la reversión es por contramovimiento; nunca se borra un movimiento.
- RF-INS-037: un movimiento por documento origen (clave de idempotencia).
- RN-INS-024: no se admiten movimientos con fecha ≤ cierre de capital (`ins.capital.closed`).
- RF-CON-075: cobrar la cuota social no aumenta ingresos por servicios.

### 5. Pantallas (CAP)

| App | Pantallas |
|---|---|
| admin | PAN-INS-02, PAN-INS-06, PAN-INS-07, PAN-INS-08, PAN-INS-11, PAN-INS-12, PAN-INS-13, PAN-CAT-06 |
| pwa-socio | PAN-INS-30 `/app/mi-asociacion`, PAN-POR-39 |
| landing | No aplica |

### 6. Eventos y jobs (CAP)

- Emite: EVT-INS-08 `ins.capitalMovement.recorded` (antes `ins.capital.movement.recorded`), EVT-INS-09 `ins.capitalMovement.reversed` (antes `ins.capital.movement.reversed`), EVT-INS-10 `ins.capitalTransfer.executed` (antes `ins.capital.transfer.executed`), EVT-INS-11 `ins.capitalRefund.approved` (antes `ins.capital.refund.approved`), EVT-INS-12 `ins.capitalRefund.paid` (antes `ins.capital.refund.paid`).
- Consume: EVT-FAC-05 `fac.billingRun.issued` (JOB-INS-01 usa el alias `fac.batch.issued`, HUECO-TRV-02), EVT-FAC-06, EVT-FAC-07, EVT-FAC-08, EVT-COB-04, EVT-COB-05, EVT-CAT-09, EVT-MOR-14, EVT-WFL-010.
- Jobs: JOB-INS-01 `ins:registrar-capital-lote`, JOB-INS-02 `ins:revisar-capital`.

### 7. Escenarios de prueba punta a punta (CAP)

| ID | Dado / Cuando / Entonces |
|---|---|
| ESC-T12-CAP-01 | **Dado** PRM-INS-017 = `inServiceInvoice` y un concepto capitalizable de ARS 1.000, **cuando** se emite la factura de Internet de ARS 22.000, **entonces** el comprobante muestra "Cuota social ARS 1.000" en renglón propio con leyenda y se registra un movimiento `billed` de ARS 1.000 (DEC-061). |
| ESC-T12-CAP-02 | **Dado** esa factura de ARS 23.000, **cuando** se confirma un pago de ARS 9.200 (40 %), **entonces** se integran ARS 400 y el asiento de integración se genera en M15 (RF-INS-035). |
| ESC-T12-CAP-03 | **Dado** la factura con capital integrado parcialmente, **cuando** se anula (EVT-FAC-08), **entonces** se crean contramovimientos vinculados, el saldo vuelve al previo y ningún movimiento se borra (RN-INS-019). |
| ESC-T12-CAP-04 (error) | **Dado** JOB-INS-01 en curso sobre el universo "Residencial Centro", **cuando** se intenta preparar un lote sobre el mismo universo, **entonces** el lote se bloquea con motivo de registración de capital en curso; un lote de otro universo no se bloquea (RF-FAC-017, RF-INS-044). |
| ESC-T12-CAP-05 | **Dado** JOB-INS-01 ejecutado sobre un lote, **cuando** se reejecuta con la misma clave, **entonces** no se duplican movimientos (RF-INS-038). |
| ESC-T12-CAP-06 (aislamiento) | **Dado** un usuario de TEN-002 con `ins.capital.ver`, **cuando** consulta `/ins/asociados/{asociado de TEN-001}/capital`, **entonces** recibe 404 y REP-INS-05 de TEN-002 no incluye importes de TEN-001. |
| ESC-T12-CAP-07 (error) | **Dado** un cierre de capital al 31-10-2026, **cuando** se registra un ajuste manual con fecha 30-10-2026, **entonces** se rechaza con `ins.capital.closed` (RF-INS-053). |

### 8. Preguntas abiertas (CAP)

- PA-INS-02 (cuota en factura): respondida por DEC-061. PA-INS-03 (capital mínimo): respondida por DEC-019.
- PA-INS-01 (reglas y momento de suscripción), PA-INS-04 (rescate), PA-INS-07 (deuda de capital para el padrón), PA-INS-11 (distribución masiva): asumidas por DEC-072.

### 9. HUECOS (CAP)

| ID | Hueco | Propuesta | Anexo |
|---|---|---|---|
| HUECO-CAP-01 | Ola contable desalineada: RF-INS-056 contabiliza capital en O5 (DEC-019), pero RF-CON-075, RF-CON-150, RF-CON-151 y RF-CON-098 de M15 están en O10; con DEC-068/DEC-069 la contabilidad corre en un plan no oficial durante la convivencia. | Mover a O5 en M15 las reglas de suscripción e integración (RF-CON-150, RF-CON-151) y la conciliación (RF-CON-098); dejar en O10 rescate, reserva y distribución. | M15 · **Estado (04-11-2026):** Corregido en anexo: M15 RF-CON-098, RF-CON-150, RF-CON-151 (pasan a O5), RF-CON-161 (O10), nota en RF-CON-075. |
| HUECO-CAP-02 | Momento de integración contradictorio: M17 reemplaza la registración al cierre de caja por el evento `cob.payment.confirmed` (RN-INS-017), mientras M07 mantiene RF-COB-176 "informar a M17 el capital cobrado al cierre de caja". | RF-COB-176 queda como conciliación de cierre, sin efecto sobre el auxiliar. | M07 · **Estado (04-11-2026):** Corregido en anexo: M07 RF-COB-176 (solo conciliación de cierre, O5). |
| HUECO-CAP-03 | Nombres de destino: T07 §19.1 migra `CAPITAL` a `capitalInstallments`, `CAPITAL_RES` a `capitalAccounts` y `RUBCAPI` a `capitalCategories`; M17 usa `capitalMovements` (RF-INS-036) y no nombra las otras colecciones. | Alinear T07 a `capitalMovements` (tipo `migration`, RF-INS-055) y a la colección de rubros que defina M17 §7. | T07, M17 · **Estado (04-11-2026):** Corregido en anexo: M17 §7.33 `capitalBalances`, §19; T07 RUBCAPI, CAPITAL, CAPITAL_RES. |
| HUECO-CAP-04 | M06 no define el tratamiento fiscal del renglón de aporte de capital (no gravado, fuera del neto del servicio, tributo o no ante ARCA). | Agregar en M06 la clase fiscal "aporte de capital" con su exposición en el comprobante. | M06 · **Estado (04-11-2026):** Corregido en anexo (parcial): M06 RF-FIS-161, RN-FIS-124, PRM-FIS-122, §7.37 `conceptFiscalCases`; pendiente: validar el encuadre fiscal con el contador de la cooperativa piloto ([VERIFICAR] en RF-FIS-161). · **Estado (05-11-2026):** Corregido en anexo (parámetro con default propuesto; requiere validación legal): M06 RF-FIS-161, RN-FIS-124, §7.37 `conceptFiscalCases`, PRM-FIS-122 `fis.capitalContribution.exposure` (default `untaxedInInvoice`). Antes: parcial, pendiente validar el encuadre fiscal con el contador. |

---

## Ficha OTR — Otras prestaciones

### 1. Resumen (OTR)

| Campo | Valor |
|---|---|
| Unidad central | Contrato de M02 de una prestación menor (M02 §6.C.17) con la entidad operativa que corresponda en M18: **préstamo ortopédico** (RF-SOC-113), **retiro de dispenser** (RF-SOC-114), **registración de vehículo eléctrico** (RF-SOC-115), **dispositivos y adherentes** (RF-SOC-148 `contractRegistrations` compuesto con `serviceDependents`; RF-SOC-116 reemplazado, HUECO-OTR-05), **seguro por cuenta de terceros** (RF-SOC-048); más **correo electrónico** y **pack SMS** como servicios de catálogo sin operación en M18 (M02 §6.C.17). |
| Régimen | Prestaciones complementarias. Un servicio candidato (sin ficha completa confirmada por el tenant) no admite contratos (RF-SOC-010, RN-SOC-052). Nuevos servicios sociales se configuran como tipo + plan + formulario de solicitud cuando encajan en el modelo de prestación (RF-SOC-117). |
| Perfil de cálculo ProCoop | Ortopedia: préstamo con depósito, no venta. Dispenser: V2 2581 a 2584 (`clsDispenser`), límite diario, litros por atención, días de deuda, excedente mensual. Vehículo eléctrico: tipo de registración V2 75. Pack SMS: tipo de servicio 16 (M02 §6.C.17). Seguro: cobertura con aseguradora prestadora, sin cálculo actuarial (M02 §6.C.17, RF-SOC-048). |
| Olas | O10 (M02 §6.C.17, RF-SOC-113 a RF-SOC-117, RF-SOC-048). La DDJJ de vehículos eléctricos en el portal está en O7 (RF-POR-069). |
| Hito de salida O10 | CU-SOC-15 (préstamo de silla de ruedas con devolución y mantenimiento) y un retiro de dispenser que respeta el límite diario, ambos en TEN-001. |

### 2. Configuración (OTR)

- **Perfil BASE §84 en M02**: ficha §6.C.17 por prestación; PRM-CAT-094 `cat.int.equipmentReturnDays` (plazo de devolución de equipos en comodato tras la baja, por servicio).
- **PRM relevantes**: PRM-SOC-036 (servicio del dispenser), PRM-SOC-037 (límite diario de litros), PRM-SOC-038 (días para cálculo de deuda), PRM-SOC-039 (litros por atención), PRM-SOC-044 (habilita registración de vehículos eléctricos).
- **Datos maestros**: elementos ortopédicos identificados con tipo y estado (RF-SOC-113, API-SOC-052); aseguradora como prestador y número de póliza (RF-SOC-003, RF-SOC-048); registraciones del contrato (vehículo eléctrico, equipo u otro) en `contractRegistrations` de M18 para el tipo combinado (RF-SOC-148, API-SOC-062; antes "dispositivos de M01", RF-SOC-116 reemplazado; HUECO-OTR-05).
- **Precarga demo ficticia**: elemento ORT-DEMO-01 "Silla de ruedas" con depósito ficticio ARS 20.000 y plazo de 30 días; dispenser con límite diario de 20 litros y 10 litros por atención (datos de ficha, no de anexo).

### 3. Recorrido del ciclo de vida (OTR)

| Paso | Qué ocurre | IDs |
|---|---|---|
| Oferta y landing (M19) | Publicación de las prestaciones confirmadas; los candidatos no se ofrecen. | RF-POR-004, PAN-POR-03, RF-SOC-010, RN-SOC-052 |
| Solicitud (M09) | Solicitud de alta tipificada; préstamos ortopédicos también como solicitud de prestación de M18. | RF-CRM-060, RF-CRM-063, RF-SOC-031, DEC-011 |
| Alta, adhesión y grupo familiar (M02/M01/M18) | Contrato del servicio; vehículo eléctrico como tipo de registración del contrato; dispositivos y adherentes combinados. Grupo familiar solo para el tipo combinado. | API-CAT-33, RF-SOC-115, PRM-SOC-044, RF-SOC-148 (`contractRegistrations`, M18 §7.5), API-SOC-062; RF-SOC-116 reemplazado por RF-SOC-148 (antes "dispositivos de M01 `[REF-PENDIENTE]`": M01 no tiene RF de dispositivos registrables; el tipo combinado se compone con `serviceDependents` de M18); HUECO-OTR-05, HUECO-TRV-01 |
| Carencias, convenios y prestación (M18) | Seguro: cobertura por póliza de la aseguradora; el resto **No aplica**. | RF-SOC-048, RF-SOC-004 |
| Cálculo (M04) | Abono o cargo por evento con las reglas generales de M04; excedente de dispenser calculado con los litros del mes. | RF-TAR-021, RN-SOC-051, REP-SOC-23 |
| Facturación (M05) | Factura separada por servicio; depósito y cargos de ortopedia como ítems facturables; factura en cero no se emite. | DEC-034, DEC-037, RF-FAC-116 |
| Fiscal y terceros (M06) | Seguro por cuenta de terceros: si se cobra la prima por cuenta de la aseguradora, sigue la ficha TAS (convenio y pasivo). Resto **No aplica**. | RF-FIS-134, RF-FIS-136 |
| Cuenta corriente y cobro (M07) | Obligación genérica del servicio. | RF-COB-074 |
| Mora y efecto sobre la cobertura (M08) | Dispenser: la deuda a N días bloquea nuevos retiros. Resto según matriz general; sin afectación cruzada por defecto. | RN-SOC-051, PRM-SOC-038, RN-MOR-082, RF-MOR-069 |
| Solicitud de prestación o uso (M18/M09) | Préstamo, devolución, limpieza y mantenimiento; retiro de dispenser validado contra límites. | RF-SOC-113, RF-SOC-114, API-SOC-052, API-SOC-053, PAN-SOC-27, PAN-SOC-28, CU-SOC-15 |
| Cambios y bajas (M01) | Baja del contrato con devolución de equipos en plazo; préstamo vencido marcado `overdue` con aviso; fallecimiento del titular por evento. | PRM-CAT-094, JOB-SOC-10, EVT-PER-03, EVT-CAT-15 |
| Portal (M19) | Detalle del servicio y DDJJ de vehículo eléctrico con advertencia si no se presentó. | PAN-POR-30, RF-POR-069, PA-POR-16 |
| Comunicaciones (T09) | Aviso de préstamo vencido con el tipo T09 `soc.loan.overdue` (T09 §9.6.8), que JOB-SOC-10 emite por el comando `com.communications.emit` (el job no publica evento) (antes `[REF-PENDIENTE]`: T09 no tenía tipo para el vencimiento de préstamos). | JOB-SOC-10, `soc.loan.overdue` |
| Reportes (T10) | Préstamos ortopédicos y retiros de dispenser. | REP-SOC-22, REP-SOC-23; HUECO-TRV-05 |
| Contabilidad (M15) e institucional (M17) | Ingresos por las reglas generales de facturación; depósito de garantía como pasivo con el rol `guaranteesHeld` (PRM-CON-169) según RN-CON-123 de M15, con los asientos M-132 (cobro) y M-133 (devolución como crédito a la cuenta), y el saldo a favor de M07 RF-COB-190 al recibir `mor.guarantee.refunded` (EVT-MOR-16, `refundMode = accountCredit`) (antes `[REF-PENDIENTE]`: M15 no definía el rol "depósito en garantía"; HUECO-OTR-04). M17 **No aplica**. | RF-CON-052, RN-CON-123, PRM-CON-169, M-132, M-133, RF-COB-190 |
| Migración (T07, tablas CAT) | Contratos por `SERSOC` como el resto de los servicios; correo electrónico: credenciales de `CORREOSINT` nunca en colecciones CAT (bóveda T06); pack SMS: `MODEMS` no es Internet. Ortopedia y dispenser sin tablas propias relevadas. Estado (HUECO-OTR-01, parcial): préstamos ortopédicos desde `SERSOC_PRODUCTOS` y dispenser por plantillas TPL-MIG-OTR-01 a 03 (T07 §19.33); falta confirmar si el dispenser registra consumos en la tabla de consumos del servicio. Corregido (05-11-2026): sí, cada retiro es un consumo en `CONS_SER` y los retiros del mes se cargan desde ahí (T07 §19.33, M18 §19). | M02 §19.1 (`SERSOC`, `CORREOSINT`, `MIKROTIK`, `SERVINT`, `MODEMS`), CTR-CAT-06, CTR-CAT-10; HUECO-OTR-01 |

### 4. Reglas críticas (OTR)

- RN-SOC-052: un servicio candidato no admite contratos.
- RF-SOC-113: un elemento en mantenimiento no se presta; el préstamo no es venta.
- RN-SOC-051: dispenser con límite diario y litros por atención; la deuda a N días bloquea.
- RF-SOC-048: el seguro no tiene cálculo actuarial; la cobertura es de la aseguradora.
- RF-SOC-144: la IA no decide coberturas ni aptitud.

### 5. Pantallas (OTR)

| App | Pantallas |
|---|---|
| admin | PAN-SOC-27 `/soc/otros/ortopedia`, PAN-SOC-28 `/soc/otros/dispenser`, PAN-SOC-04 (aseguradoras), PAN-CAT-14, PAN-CAT-19 (equipos en comodato) |
| pwa-socio | PAN-POR-30, PAN-SOC-31 (solicitud de préstamo) |
| landing | PAN-POR-03 |

### 6. Eventos y jobs (OTR)

- Emite: EVT-SOC-03 (decisión de solicitudes de préstamo), EVT-CAT-09 / EVT-CAT-15 (contrato).
- Consume: EVT-PER-03, EVT-COB-04.
- Jobs: JOB-SOC-10 `soc:vencimiento-prestamos`.

### 7. Escenarios de prueba punta a punta (OTR)

| ID | Dado / Cuando / Entonces |
|---|---|
| ESC-T12-OTR-01 | **Dado** ORT-DEMO-01 disponible, **cuando** se presta a un asociado con depósito ARS 20.000 y plazo 30 días, y se devuelve a los 20 días, **entonces** el elemento pasa a limpieza o mantenimiento y no se presta hasta liberarlo (CU-SOC-15). |
| ESC-T12-OTR-02 | **Dado** un préstamo con plazo vencido ayer, **cuando** corre JOB-SOC-10, **entonces** queda `overdue` y se genera el aviso; repetir el job no duplica el aviso. |
| ESC-T12-OTR-03 (error) | **Dado** un límite diario de 20 litros y 15 litros ya retirados hoy, **cuando** se registra un retiro de 10 litros con `Idempotency-Key`, **entonces** se rechaza con 422 RFC 9457 y reenviar la misma clave devuelve el mismo rechazo (RF-SOC-114). |
| ESC-T12-OTR-04 (error) | **Dado** un servicio "Seguro de vida" en estado candidato, **cuando** se intenta crear un contrato, **entonces** M02 lo rechaza (RN-SOC-052). |
| ESC-T12-OTR-05 (aislamiento) | **Dado** un operador de TEN-002 con `soc.ortopedia.gestionar`, **cuando** pide el préstamo de ORT-DEMO-01 de TEN-001, **entonces** recibe 404. |

### 8. Preguntas abiertas (OTR)

- PA-POR-16 (DDJJ de artefactos y vehículos eléctricos): Asumida (DEC-072).
- PA-CAT-10 (modalidad de equipos): Respondida (DEC-013); aplica a equipos en comodato de PAN-CAT-19.

### 9. HUECOS (OTR)

| ID | Hueco | Propuesta | Anexo |
|---|---|---|---|
| HUECO-OTR-01 | No hay mapeo de migración para préstamos ortopédicos ni retiros de dispenser, ni confirmación de que ProCoop los registre en tablas propias. | Relevar en el diccionario CAT; si no existen, carga inicial por `ExcelImportWizard` con plantilla definida en T07. | T07, M18 · **Estado (04-11-2026):** Corregido en anexo (parcial): T07 §19.33 (TPL-MIG-OTR-01..03); M18 filas de `SERSOC_PRODUCTOS`; pendiente: confirmar si el dispenser registra consumos en la tabla de consumos del servicio (V2 2581..2584, [VERIFICAR]). · **Estado (05-11-2026):** Corregido en anexo: T07 RF-MIG-099, §19.33 (TPL-MIG-OTR-01..03; dato relevado: el dispenser registra cada retiro como consumo en `CONS_SER` y los retiros del mes se cargan desde ahí); M18 §19 (`SERSOC_PRODUCTOS`, `CONS_SER`). Antes: parcial, pendiente confirmar la tabla de consumos del dispenser. |
| HUECO-OTR-02 | M02 §6.C.17 incluye "traslados no médicos", pero M18 solo modela traslados sanitarios (RF-SOC-074) y rendiciones de flota (RF-SOC-128 a RF-SOC-131); no está definido si el traslado no médico es un viaje con característica propia o un uso de vehículo. | Modelarlo como viaje de RF-SOC-074 con característica "no sanitario" (RF-SOC-076), sin datos sensibles. | M18, M02 · **Estado (04-11-2026):** Corregido en anexo: M18 RF-SOC-147; M02 ficha 6.C.17. |
| HUECO-OTR-03 | Correo electrónico y pack SMS no tienen operación definida fuera del catálogo (alta de casilla, cupo de mensajes, consumo) en ningún anexo. | Definir si son servicios de M02 con aprovisionamiento por T06 o se discontinúan; registrar PA. | M02, T06 · **Estado (04-11-2026):** Decisión: PA-CAT-19, respondida con la opción recomendada (DEC-084) |
| HUECO-OTR-04 | El depósito en garantía del préstamo ortopédico no tiene rol de importe ni tratamiento de devolución en M15/M07. | Rol "depósito en garantía" (pasivo) en M15 y devolución como crédito en M07. | M15, M07 · **Estado (04-11-2026):** Corregido en anexo: M15 RN-CON-123, M-132/133, M-45, PRM-CON-169; M07 RF-COB-190; M08 RF-MOR-179, EVT-MOR-16 (`refundMode`); M18 RF-SOC-113; T11 EVT-MOR-16. |
| HUECO-OTR-05 | RF-SOC-116 se apoya en "dispositivos de M01", pero M01 no define dispositivos registrables (vehículo eléctrico, equipo). | Definir en M18 la entidad de registración del contrato (tipo, datos del vehículo o equipo) y quitar la dependencia de M01. | M18, M01 · **Estado (04-11-2026):** Corregido en anexo (parcial): M18 RF-SOC-148, `contractRegistrations`, API-SOC-062, RF-SOC-115, RF-SOC-116 (reemplazado); pendiente: dónde guarda ProCoop los datos del vehículo eléctrico, para la migración ([VERIFICAR]). · **Estado (05-11-2026):** Corregido en anexo: M18 RF-SOC-148, `contractRegistrations`, API-SOC-062, RF-SOC-115, RF-SOC-116 (reemplazado), §19 (dato relevado: el identificador del vehículo está en `SERSOC.NUM_MED`, se carga en `vehicle.plate`); T05 COL-SOC-53. Antes: parcial, pendiente dónde guarda ProCoop el dato del vehículo eléctrico. |

